# CodeFolio System Design & Architecture Specification

## 1. Executive Overview

**CodeFolio** is a production-grade MERN (MongoDB, Express, React, Node.js) SaaS platform designed for software engineers, systems architects, and cybersecurity specialists to build, manage, and publish high-performance developer portfolios.

The platform is architected around high-assurance security principles: zero-trust input validation, Double-Submit Cookie CSRF protection, strict Content Security Policy (CSP), rate-limited OTP authentication via Gmail SMTP, and runtime XSS neutralization.

---

## 2. Hybrid Routing Architecture & Vanity URL Resolution

CodeFolio implements a dual-layer hybrid routing architecture combining client-side Single Page Application (SPA) routing via React Router (`v7`) with Express.js REST API persistence and dynamic SEO metadata injection.

### 2.1 Route Mapping & Path Hierarchy

```
Browser Request (e.g. /u/alexrivera or /demo2.tech)
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Express.js Hostname & Route Dispatcher                 │
├────────────────────────────────────────────────────────┤
│ 1. Host header inspection:                             │
│    Is Host != codefolio.dev / localhost?               │
│    ├── Yes ──> Query Pro User by `customDomain`        │
│    └── No  ──> Pass through                            │
│ 2. API Routes:                                         │
│    ├── /api/auth/*     (Rate-limited auth & OTP)       │
│    ├── /api/portfolio  (Authenticated CMS mutations)   │
│    └── /api/public/*   (Sanitized read & relay)        │
│ 3. Client SPA Fallback:                                │
│    Serves Vite/React index.html                        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ React Router (Client-Side Virtual DOM)                 │
├────────────────────────────────────────────────────────┤
│ 1. Matches: /u/:username or /user/:username            │
│ 2. Extracts `useParams().username`                     │
│ 3. Dispatches GET /api/public/:username                │
│ 4. Dynamically injects <Helmet> SEO tags               │
│ 5. Selects layout via templateMap[user.templateId]     │
└────────────────────────────────────────────────────────┘
```

### 2.2 Client-Side Parameter Handling vs. Server Public API

1. **Vanity Path Interception:** When a user visits `/u/:username` (or `/user/:username`), React Router captures the `:username` parameter and validates it against reserved keywords (`admin`, `api`, `login`, `dashboard`, `settings`).
2. **Data Hydration:** The `PublicPortfolioPage` initiates an asynchronous query to `GET /api/public/:username`.
3. **Data Sanitization & Stripping:** The backend Express controller (`publicController.js`) guarantees that private developer attributes (`email`, `passwordHash`, `otpCodeHash`, `otpExpiresAt`, `refreshTokenHash`) are stripped at the database query level via Mongoose projections before the JSON payload is dispatched.
4. **Dynamic SEO Metadata Injection:** `react-helmet-async` dynamically updates `<title>` and `<meta name="description">` in the document `<head>` using the developer's display name and sanitized bio excerpt. OpenGraph and Twitter card tags are populated synchronously during hydration.
5. **Custom Domain Resolution:** For Pro users with a vanity custom domain (e.g., `demo2.tech`), custom domain simulation middleware matches the incoming `Host` or `X-Forwarded-Host` header against verified Pro accounts in MongoDB.

---

## 3. Dynamic Template Engine

The template engine employs a declarative mapping pattern that completely separates layout presentation from portfolio data:

```javascript
const PortfolioLayout = templateMap[user.templateId] || DefaultLayout;
return <PortfolioLayout data={userData} onOpenContact={...} />;
```

### Supported Layout Archetypes:
| Template | Aesthetic | Target Audience | Key Features |
| :--- | :--- | :--- | :--- |
| **Minimalist** | Clean monochrome typography, generous whitespace | Full-Stack & Systems Engineers | High readability, structured skill columns, subtle card dividers |
| **Cyberpunk** | High-contrast dark theme, cyan/pink neon glows | Security Specialists, Netrunners | Terminal headers, glowing borders, animated badges, Pro chip |
| **Corporate** | Executive slate/navy palette, grid layout | Staff/Principal Architects, Consultants | Executive summary header, enterprise competency matrix, case studies |

### Safe Empty State Handling
Each template implements fallback boundary guards. If a newly registered user has empty arrays (`projects: []`, `skills: { frontend: [], backend: [], devops: [] }`) or an empty bio, the template renders stylized neutral placeholders without throwing `TypeError: Cannot read properties of undefined`.

---

## 4. End-to-End Security Architecture

### 4.1 Authentication & Session Management
- **Password Security:** Salted and hashed using `bcrypt` with **12 salt rounds**.
- **Cryptographic OTP:** Generated using `crypto.randomInt(100000, 1000000)` and hashed with bcrypt before storing with a strict 5-minute time-to-live (`otpExpiresAt`).
- **Token Security:** Short-lived Access Tokens (15 min) and Refresh Tokens (7 days) stored exclusively in `HttpOnly; Secure; SameSite=Strict` cookies. Tokens are **never** returned in response bodies for `localStorage` storage.
- **Account Lockout:** Reaching 5 consecutive invalid OTP attempts locks the account out for 15 minutes (`otpLockoutUntil`), preventing automated brute-force attacks.

### 4.2 Nodemailer Gmail SMTP Relay
Configured with `host: "smtp.gmail.com"`, `port: 465`, and `secure: true`:
1. **Security OTP Dispatch:** Sends 2FA/verification codes directly to the user's registered inbox.
2. **Contact Form Relay (`POST /api/public/:username/contact`):** Allows public visitors to send messages to developers. The developer's private email is retrieved server-side from MongoDB and used as the delivery destination; the client browser never receives or observes the developer's real email address.
3. **Fail-Safe Mechanism:** If Google SMTP encounters network timeouts or disconnects, the controller captures the rejection cleanly and emits a structured `503 Service Unavailable` response rather than allowing unhandled promise rejections to crash the Node.js event loop.

### 4.3 Double-Submit CSRF Protection
Implemented via `csrf-csrf` using cryptographically generated tokens:
- Safe methods (`GET`, `HEAD`, `OPTIONS`) are exempt.
- State-changing endpoints (`PUT /api/portfolio`, `DELETE /api/portfolio`) mandate both the `x-csrf-token` cookie and matching `x-csrf-token` request header.
- Requests lacking a valid token are rejected with `403 Forbidden`.

### 4.4 Defensive Middleware Stack
- **Helmet:** Enforces explicit Content Security Policy (CSP), blocks clickjacking via `X-Frame-Options: DENY`, and prevents MIME sniffing with `X-Content-Type-Options: nosniff`.
- **CORS:** Locked strictly to `process.env.CLIENT_URL` with `credentials: true`. Requests from unlisted origins (e.g. `https://evil-attacker.com`) are rejected with `403 Forbidden`.
- **NoSQL Injection Defense:** `express-mongo-sanitize` strips `$` and `.` operators from `req.body`, `req.query`, and `req.params`. Mongoose enforces `sanitizeFilter: true`.
- **Rate Limiting:** `express-rate-limit` enforces a strict 5-requests-per-15-minute window on `/api/auth/*` and public contact relay routes.
- **XSS Sanitization:** All bio text and project descriptions rendered in React are scrubbed via `DOMPurify.sanitize()`. All outbound links reject `javascript:` pseudo-protocols.

