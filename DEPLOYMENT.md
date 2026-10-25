# CodeFolio Production Deployment Guide

This guide provides complete, production-grade instructions for deploying the **CodeFolio** MERN-stack portfolio builder into production using:
* **Frontend:** Vercel (React 18 + Vite SPA)
* **Backend:** Render (Node.js + Express REST API)
* **Database:** MongoDB Atlas (Mongoose with strict TLS)

---

## 1. Architectural Topology & Vercel API Reverse Proxy

CodeFolio operates with a split deployment architecture optimized for cookie and CSRF security:

```
  User Browser (HTTPS)
         │
         │  1. Visits https://your-codefolio.vercel.app
         │  2. Requests /api/* (Same-Origin Relative URL)
         ▼
┌────────────────────────────────────────────────────────┐
│ Vercel Edge Network (Root: vercel.json)               │
├────────────────────────────────────────────────────────┤
│ • Rewrites /api/:path* ──> Render Backend Service      │
│ • Serves Static Assets: /assets/*, /vite.svg           │
│ • SPA Fallback: Rewrites all virtual routes to         │
│   /index.html (e.g. /dashboard, /u/:username)          │
└──────────────────────────┬─────────────────────────────┘
                           │ Proxies /api/*
                           ▼
┌────────────────────────────────────────────────────────┐
│ Render Web Service (Root: render.yaml / server)        │
├────────────────────────────────────────────────────────┤
│ • Express REST API (Mounted at /api/*)                 │
│ • trust proxy: 1 (Extracts real client IP & TLS state) │
│ • CORS: Strictly validates Origin against CLIENT_URL   │
│ • HttpOnly, Secure, SameSite=Strict Auth & CSRF Cookies│
│ • Gmail SMTP Port 465 SSL Relay                        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ MongoDB Atlas (Replica Set / Mongoose)                 │
├────────────────────────────────────────────────────────┤
│ • Strict TLS (tlsAllowInvalidCertificates: false)      │
│ • Network Access: Restricted Render Egress IPs         │
│   (or Dedicated Outbound IP / Atlas Whitelist)         │
└────────────────────────────────────────────────────────┘
```

### Why the Vercel API Reverse Proxy is Critical for Security:
1. **First-Party Cookie Isolation:** By proxying `/api/:path*` through Vercel, the browser sends and receives cookies under the same origin (`your-codefolio.vercel.app`). This allows `SameSite=Strict` and `HttpOnly` security cookies (`accessToken`, `refreshToken`, `x-csrf-token`) to work seamlessly without being blocked by modern third-party cookie restrictions.
2. **Zero Cross-Origin Leaks:** The frontend code does not bake hardcoded backend URLs into production JavaScript bundles.
3. **Double-Submit CSRF Intact:** The client Axios instance receives the CSRF token on `GET /api/auth/csrf-token` and automatically attaches `x-csrf-token` in both the cookie and request header for state-changing operations (`PUT /api/portfolio`).

### Reverse Proxy Topology & `trust proxy` Assumptions:
In `server/src/app.js`, Express is configured with `app.set('trust proxy', 1);`.
* **Topology:** In production, requests flow through:
  `Browser (Client) ──> [Vercel Edge Network] ──> [Render Load Balancer / Envoy] ──> [Node.js Express]`
* **Single Hop Assumption (`trust proxy: 1`):** Express is configured to trust the immediate reverse proxy (Render's ingress load balancer). Render terminates TLS and forwards headers including `X-Forwarded-Proto` and `X-Forwarded-For`.
* **Direct Render Calls:** `req.ip` reflects the client's public IP address.
* **Vercel Proxied Calls:** Because requests traverse two proxy hops (`Vercel Edge` then `Render`), Express trusts only the immediate Render proxy, which resolves `req.ip` to the Vercel edge node egress IP. This safely prevents untrusted external clients from forging `X-Forwarded-For` headers directly.
* **HTTPS & Security Impact:** `req.secure` evaluates to `true` when Render forwards `X-Forwarded-Proto: https`, which is mandatory for `secure: true` cookies to be sent across production connections. If granular per-client rate limiting is needed specifically across Vercel proxies without aggregating traffic by Vercel edge node, trust proxy can be configured to trust the 2-hop chain (`app.set('trust proxy', 2)`), provided Render's backend is protected from direct public access or validates origin.

---

## 2. Dedicated Step-by-Step Deployment Guide: Vercel + Render + MongoDB Atlas

Follow this exact sequence to deploy without chicken-and-egg configuration errors:

### Step 1: Push Repository to GitHub or GitLab
Ensure your latest working-tree code, including `render.yaml` and `vercel.json`, is committed and pushed to your remote Git repository:
```bash
git add .
git commit -m "chore: configure Vercel and Render deployment blueprints"
git push origin main
```

### Step 2: Configure MongoDB Atlas Cluster & Network Access

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Under **Security** -> **Database Access**:
   * Create a dedicated database user (e.g., `codefolio_app_user`).
   * **Least-Privilege Scoping:** Assign the user the built-in role **`readWrite`** strictly scoped to the `codefolio` database. **Never** assign administrative roles (`atlasAdmin`, `clusterAdmin`, or `root`) to an application service.
   * Generate a strong, high-entropy password (32+ alphanumeric characters) and store it securely in a password manager.
3. Under **Security** -> **Network Access**:
   Configure the IP Access List using one of the following approaches (ordered from most secure to temporary diagnostic fallback):

   * **Option A: Dedicated Outbound IP (Highest Security — Paid/Team Feature):**
     If you have a Render Team or Paid instance with a Dedicated Outbound IP assigned, find your static outbound IP in the Render Dashboard (**Service** -> **Settings** -> **Outbound IP Addresses**). Add only this dedicated static IP address to the Atlas Network Access list with a clear comment (e.g., `Render-Backend-Dedicated-IP`).

   * **Option B: Restrict to Render's Regional Outbound IP Ranges (Recommended for Standard/Starter Services):**
     Render web services publish the outbound IP CIDR ranges for their infrastructure by region:
     1. In the Render Dashboard, check your service's deployed region (e.g., Oregon US-West, Ohio US-East, Frankfurt EU-Central).
     2. In your service's **Settings** or **Connect** tab (or via [Render's Outbound IP Documentation](https://render.com/docs/outbound-ip-addresses)), locate the outbound IP CIDR blocks for your region.
     3. In MongoDB Atlas, add entries for each of Render's regional CIDR blocks (e.g., `216.24.56.0/24`, etc.).
     * **Trade-Off Analysis:** Whitelisting Render's regional CIDR ranges eliminates exposure to the wider internet and blocks arbitrary scanning from other cloud providers or personal networks. However, because these egress ranges are shared among Render services in that region, IP filtering alone does not provide complete tenant isolation.
     * **Defense-in-Depth:** You MUST pair network filtering with:
       - Unique, cryptographically strong database passwords (32+ chars).
       - Least-privilege user access (`readWrite` on `codefolio` only).
       - Strict TLS encryption (`tlsAllowInvalidCertificates: false`, enforced in `server/src/config/db.js`).

   * **Option C: Temporary Diagnostic Fallback (`0.0.0.0/0`):**
     > [!WARNING]
     > **Do NOT leave `0.0.0.0/0` (Allow Access from Anywhere) enabled in production.**
     > Adding `0.0.0.0/0` permits connection attempts from any device on the public internet, exposing your cluster to automated port scanners, credential brute-force attempts, and distributed denial-of-service (DDoS) vectors.
     >
     > If your Render backend fails to connect during initial deployment, you may temporarily add `0.0.0.0/0` strictly to verify whether an IP whitelist mismatch is the cause. Once connectivity is confirmed, immediately replace `0.0.0.0/0` with your Render service's specific outbound IP ranges (Option A or Option B).

4. Under **Deployment** -> **Database**:
   * Click **Connect** -> **Drivers** (Node.js).
   * Copy the connection string (format: `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/codefolio?retryWrites=true&w=majority`).
   * Verify that the database name `/codefolio` is specified before query parameters.

### Step 3: Deploy Backend on Render
1. Log in to the [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Blueprint**.
3. Select your Git repository. Render will automatically parse [**`render.yaml`**](file:///e:/ProjectByAntigravity/CodeFolio/render.yaml):
   * **Service Name:** `codefolio-backend`
   * **Root Directory:** `server`
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
   * **Health Check Path:** `/api/health`
4. Render will prompt you for the un-synchronized environment variables marked `sync: false`:
   * `MONGO_URI`: Paste your MongoDB Atlas connection string from Step 2.
   * `CLIENT_URL`: Enter a temporary placeholder like `http://localhost:5173` (we will update this with your exact Vercel URL in Step 8).
   * `SMTP_EMAIL`: Your Gmail account address.
   * `SMTP_APP_PASSWORD`: Your 16-character Google App Password (generated at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
   * *Notice:* `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `CSRF_SECRET` are generated automatically with high entropy by Render.
5. Click **Apply**.
6. Wait for the build to finish. Once live, Render displays your service URL at the top of the dashboard:
   ```
   https://codefolio-backend-xxxx.onrender.com
   ```
7. Verify backend health:
   ```bash
   curl -I https://codefolio-backend-xxxx.onrender.com/api/health
   # Expected: HTTP/1.1 200 OK
   ```

### Step 4: Update `vercel.json` with Real Render Service URL
1. Open [**`vercel.json`**](file:///e:/ProjectByAntigravity/CodeFolio/vercel.json) in your repository root.
2. Replace the destination placeholder with your actual Render service URL obtained in Step 3:
   ```json
   {
     "$schema": "https://openapi.vercel.sh/vercel.json",
     "framework": "vite",
     "installCommand": "npm --prefix client ci",
     "buildCommand": "npm --prefix client run build",
     "outputDirectory": "client/dist",
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://codefolio-backend-xxxx.onrender.com/api/:path*"
       },
       {
         "source": "/((?!assets/|vite\\.svg|favicon\\.ico).*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
3. Commit and push this change to your Git repository:
   ```bash
   git add vercel.json
   git commit -m "deploy: update vercel.json with real Render backend URL"
   git push origin main
   ```

### Step 5: Deploy Frontend on Vercel
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your CodeFolio Git repository.
4. In the **Configure Project** screen:
   * **Project Name:** `codefolio` (or custom name)
   * **Framework Preset:** `Vite`
   * **Root Directory:** Leave as `./` (Repository root, so `vercel.json` is detected and edge rewrites are applied).
   * **Build and Output Settings:** Leave default (Vercel reads `installCommand: "npm --prefix client ci"`, `buildCommand: "npm --prefix client run build"`, and `outputDirectory: "client/dist"` directly from `vercel.json`).
   * **Environment Variables:** **None required.** The frontend uses `/api` relative paths proxied by Vercel's edge rewrites.
5. Click **Deploy**.
6. Wait for the build to finish (typically 30-45 seconds).
7. Copy your assigned production Vercel URL from the dashboard:
   ```
   https://codefolio-xxxx.vercel.app  (or your custom domain: https://codefolio.dev)
   ```

### Step 6: Update Render Allowed Origin (`CLIENT_URL`)
1. Return to the [Render Dashboard](https://dashboard.render.com/) -> `codefolio-backend`.
2. Go to the **Environment** tab.
3. Locate `CLIENT_URL` and update its value to your actual live Vercel URL from Step 5:
   ```
   CLIENT_URL=https://codefolio-xxxx.vercel.app
   ```
   > [!IMPORTANT]
   > Do **NOT** include a trailing slash! CORS origin checks compare exact strings (`https://codefolio-xxxx.vercel.app`).
4. Click **Save Changes**. Render will automatically trigger a rolling redeployment with the new origin policy.

### Step 7: Production Smoke Tests & Flow Verification
Once both services are live:
1. **Public Site:** Open `https://your-codefolio.vercel.app`. Verify that the homepage renders without console errors.
2. **Registration & OTP:** Click **Get Started** (`/register`), enter test credentials, and submit. Verify that the 6-digit OTP code is delivered to your inbox from Gmail SMTP.
3. **Authentication:** Enter the code to verify your account and confirm transition to `/profile`.
4. **Studio Dashboard:** Navigate to `/dashboard`. Modify skills or bio, toggle between **Edit** and **Preview**, and click **Save Portfolio**. Confirm that the save status displays `"Portfolio changes securely saved!"` and that the Double-Submit CSRF token was validated.
5. **Template Gallery:** Open **Template Studio**, filter categories, select a template layout, and confirm preview rendering.
6. **SPA Route Refresh:** While on `/dashboard` or `/settings`, press `F5` / browser reload. Verify that Vercel's SPA fallback serves `index.html` with HTTP 200 without returning a 404.

---

## 3. Environment Variables Reference

### Frontend (`client/`)
| Variable | Value for Vercel Deployment | Purpose |
| :--- | :--- | :--- |
| `VITE_API_URL` | *(Omit or leave `/api`)* | With `vercel.json` API rewrites, requests to `/api` are forwarded directly by Vercel edge nodes. No environment variable is needed in the Vercel dashboard. |

### Backend (`server/`)
Configure these in the Render Dashboard (**Environment** tab):

| Variable | Required | Value / Source |
| :--- | :---: | :--- |
| `NODE_ENV` | **Yes** | `production` |
| `PORT` | Auto | Render assigns this dynamically (default `5000` fallback). |
| `CLIENT_URL` | **Yes** | Your exact Vercel URL (e.g. `https://codefolio-xxxx.vercel.app` or custom domain). No trailing slash. |
| `MONGO_URI` | **Yes** | MongoDB Atlas connection string with username, password, and database name. |
| `JWT_ACCESS_SECRET` | Auto | Generated securely by Render (`generateValue: true` in `render.yaml`). |
| `JWT_REFRESH_SECRET` | Auto | Generated securely by Render (`generateValue: true` in `render.yaml`). |
| `CSRF_SECRET` | Auto | Generated securely by Render (`generateValue: true` in `render.yaml`). |
| `SMTP_EMAIL` | **Yes** | Gmail account used as sender. |
| `SMTP_APP_PASSWORD` | **Yes** | 16-character Google App Password. |

---

## 4. Local Build & Verification Commands

Before deploying, verify everything locally using the project scripts:

```bash
# 1. Clean install client dependencies (matches Vercel installCommand)
npm --prefix client ci

# 2. Compile client production bundle (matches Vercel buildCommand)
npm --prefix client run build

# 3. Run full client test suite (131 tests)
npm --prefix client test -- --run

# 4. Run full backend security and RBAC test suite (19 tests)
npm --prefix server test
```

---

## 5. Troubleshooting Common Production Issues

| Symptom | Root Cause | Resolution |
| :--- | :--- | :--- |
| **`404 Not Found` on API calls (`/api/...`)** | Vercel rewrite points to a placeholder or typo in `vercel.json`. | Check `vercel.json` line 9. Ensure `https://YOUR-RENDER-BACKEND-NAME.onrender.com/api/:path*` matches your real Render service URL. |
| **`CORS blocked: Origin not permitted`** | `CLIENT_URL` in Render environment variables does not match Vercel URL. | Ensure `CLIENT_URL` in Render is set to the exact Vercel URL (e.g. `https://your-app.vercel.app`) with **no trailing slash** and matching `https://` protocol. |
| **`403 Forbidden: Invalid or missing CSRF token`** | CSRF cookie was blocked or not forwarded by proxy. | Ensure the client requests use `/api` relative paths so Vercel keeps cookies same-origin. Verify `withCredentials: true` is enabled in `client/src/api/client.js`. |
| **Render Service Fails to Start** | Missing `MONGO_URI`, unwhitelisted Render outbound IP, or invalid database credentials. | In Atlas Network Access, verify that Render's regional outbound IP ranges (or dedicated IP) are added. As a temporary diagnostic test, you may briefly test with `0.0.0.0/0` to confirm if network filtering is the blocker, then immediately restrict access. Confirm database user has `readWrite` on `codefolio`. |
| **`SMTP connection timeout` during registration** | Outbound port 465 blocked, or invalid Google App Password. | Verify your Google account has 2FA enabled and that you generated a dedicated 16-character App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords). |
| **Rate limit triggered on first visit** | Express sees the proxy IP for all users. | `app.set('trust proxy', 1)` is enabled in `server/src/app.js` to extract client IP from `X-Forwarded-For`. |
