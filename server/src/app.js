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
// Trust proxy is set to true to correctly resolve the true client IP from X-Forwarded-For across Vercel and Render proxies.
app.set('trust proxy', true);

// Disable Express fingerprinting header
app.disable('x-powered-by');

// Strip technology headers & attach API version metadata
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  res.setHeader('API-Version', '1.0.0');
  next();
});

// Security event audit monitoring for incident investigation
app.use((req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 429) {
      console.warn(`[Security Audit] Status ${res.statusCode} on ${req.method} ${req.originalUrl} from IP: ${req.ip}`);
    }
  });
  next();
});

// 1. HTTP Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", 'https://codefolio-topaz.vercel.app'],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
        reportUri: '/api/security/csp-report',
      },
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    hidePoweredBy: true,
  })
);

// 2. Strict CORS Configuration (permits verified production URLs and local dev in non-production)
const configuredClientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
const allowedOrigins = [
  'https://codefolio-topaz.vercel.app',
  'https://www.codefolio-topaz.vercel.app',
  configuredClientUrl,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, curl, or same-origin tests)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(normalizedOrigin)) {
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
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'x-csrf-token', 'X-Requested-With', 'Accept-Version'],
    exposedHeaders: ['API-Version', 'Retry-After'],
  })
);

// 3. Body Parsing & Cookie Parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// 4. NoSQL Operator Sanitization (Body, Query, Params)
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  }
  if (req.params && typeof req.params === 'object') {
    mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  }
  if (req.query && typeof req.query === 'object') {
    mongoSanitize.sanitize(req.query, { replaceWith: '_' });
  }
  next();
});

// 5. Custom Domain Header Resolution
app.use(resolveCustomDomain);

// 6. RFC 9116 security.txt Declarations & CSP Reporting
const securityTxtContent = `Contact: mailto:security@codefolio-topaz.vercel.app
Contact: https://codefolio-topaz.vercel.app/
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: en
Canonical: https://codefolio-topaz.vercel.app/.well-known/security.txt
Policy: https://codefolio-topaz.vercel.app/security-policy
Acknowledgments: https://codefolio-topaz.vercel.app/hall-of-fame
`;

app.get(['/.well-known/security.txt', '/api/security/txt'], (req, res) => {
  res.type('text/plain').send(securityTxtContent);
});

app.post(
  '/api/security/csp-report',
  express.json({ type: ['application/json', 'application/csp-report'] }),
  (req, res) => {
    if (req.body) {
      console.warn('[CSP Violation Report]:', JSON.stringify(req.body));
    }
    return res.status(204).end();
  }
);

// 7. General API Rate Limiting
app.use('/api', generalRateLimiter);

// 8. API Health & Status
app.get(['/api/health', '/api/v1/health'], (req, res) => {
  res.status(200).json({ status: 'ok', service: 'CodeFolio API', version: '1.0.0', timestamp: new Date() });
});

// 9. API Routes & Version 1 Aliases
app.use(['/api/auth', '/api/v1/auth'], authRoutes);
app.use(['/api/portfolio', '/api/v1/portfolio'], portfolioRoutes);
app.use(['/api/public', '/api/v1/public'], publicRoutes);
app.use(['/api/upload', '/api/v1/upload'], uploadRoutes);
app.use(['/api/uploads', '/api/v1/uploads'], uploadRoutes);

// 10. 404 Route Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route '${req.originalUrl}' not found.`,
  });
});

// 11. Centralized Error Handler (handles CSRF, CORS, Rate Limit, and Uncaught Errors)
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
