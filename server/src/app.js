const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const { generalRateLimiter } = require('./middleware/rateLimiter');
const { resolveCustomDomain } = require('./middleware/customDomain');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const publicRoutes = require('./routes/publicRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Reverse Proxy Configuration:
// Topology: Browser -> [Vercel Edge] -> [Render Load Balancer (Envoy)] -> Node.js Express
// Trust proxy is set to 1 to trust the immediate Render reverse proxy.
// Assumptions:
// 1. Render terminates TLS and forwards X-Forwarded-Proto ('https') and X-Forwarded-For.
// 2. Setting '1' trusts the first hop (Render ingress), preventing untrusted clients from spoofing
//    arbitrary IP addresses via client-crafted X-Forwarded-For headers.
// 3. For direct Render requests, req.ip resolves to the true client IP.
// 4. For requests proxied via Vercel rewrites (2 hops), req.ip resolves to the Vercel edge IP.
// 5. req.secure evaluates to true over HTTPS, enabling Secure cookies in production.
app.set('trust proxy', 1);

// 1. HTTP Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. Strict CORS Configuration (permits any local dev port in development and strictly locks in production)
const allowedOrigin = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, curl, or same-origin tests)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (normalizedOrigin === allowedOrigin) {
        return callback(null, true);
      }
      // In development or test, allow any localhost or 127.0.0.1 port (e.g. 5173, 5174, 5175)
      if (process.env.NODE_ENV !== 'production') {
        const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
        if (isLocalhost) {
          return callback(null, true);
        }
      }
      return callback(new Error('CORS blocked: Origin not permitted by Access-Control policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'x-csrf-token'],
  })
);

// 3. Body Parsing & Cookie Parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// 4. NoSQL Operator Sanitization
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  }
  if (req.params && typeof req.params === 'object') {
    mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  }
  next();
});

// 5. Custom Domain Header Resolution
app.use(resolveCustomDomain);

// 6. General API Rate Limiting
app.use('/api', generalRateLimiter);

// 7. API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'CodeFolio API', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/uploads', uploadRoutes);

// 8. 404 Route Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route '${req.originalUrl}' not found.`,
  });
});

// 9. Centralized Error Handler (handles CSRF, CORS, Rate Limit, and Uncaught Errors)
app.use((err, req, res, next) => {
  // CORS Rejection
  if (err.message && err.message.startsWith('CORS blocked')) {
    return res.status(403).json({
      success: false,
      error: err.message,
    });
  }

  // CSRF Rejection
  if (
    err.code === 'EBADCSRFTOKEN' ||
    err.message?.toLowerCase().includes('csrf') ||
    err.name === 'InvalidCsrfTokenError'
  ) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid or missing CSRF token.',
      code: 'CSRF_INVALID',
    });
  }

  // General server errors
  console.error('[App Central Error Handler]:', err.message || err);
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;

