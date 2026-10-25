const rateLimit = require('express-rate-limit');

/**
 * Strict rate limiter for sensitive authentication & contact form routes
 * Max 5 requests per 15-minute window per IP
 */
const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (req) => {
    // In test environment, enforce rate limiting selectively when x-test-ip is specified
    if (process.env.NODE_ENV === 'test') {
      return !req.headers['x-test-ip'];
    }
    return false;
  },
  keyGenerator: (req) => req.headers['x-test-ip'] || req.ip || '127.0.0.1',
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes.',
    statusCode: 429,
  },
  validate: false,
});

/**
 * Standard rate limiter for general API routes
 * Max 100 requests per 15-minute window per IP
 */
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    if (process.env.NODE_ENV === 'test') {
      return !req.headers['x-test-ip'];
    }
    return false;
  },
  keyGenerator: (req) => req.headers['x-test-ip'] || req.ip || '127.0.0.1',
  message: {
    success: false,
    error: 'API rate limit exceeded. Please slow down your requests.',
    statusCode: 429,
  },
  validate: false,
});

module.exports = {
  strictRateLimiter,
  generalRateLimiter,
};

