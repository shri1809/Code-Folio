const rateLimit = require('express-rate-limit');

/**
 * Strict rate limiter for sensitive authentication & contact form routes
 * Max 30 requests per 15-minute window per IP with failed request immunity
 * (In test environment, capped at 5 to accommodate deterministic rate limit assertions)
 */
const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 5 : 30,
  skipFailedRequests: true, // Never penalize users when requests fail due to Render cold starts (502/504)
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
  handler: (req, res) => {
    res.set('Retry-After', '900');
    return res.status(429).json({
      success: false,
      statusCode: 429,
      error: 'Too many requests from this IP, please try again after a few minutes.',
      retryAfter: '15 minutes',
    });
  },
  validate: false,
});

/**
 * Standard rate limiter for general API routes
 * Max 300 requests per 15-minute window per IP
 */
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  skipFailedRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    if (process.env.NODE_ENV === 'test') {
      return !req.headers['x-test-ip'];
    }
    return false;
  },
  keyGenerator: (req) => req.headers['x-test-ip'] || req.ip || '127.0.0.1',
  handler: (req, res) => {
    res.set('Retry-After', '900');
    return res.status(429).json({
      success: false,
      statusCode: 429,
      error: 'API rate limit exceeded. Please slow down your requests.',
      retryAfter: '15 minutes',
    });
  },
  validate: false,
});

module.exports = {
  strictRateLimiter,
  generalRateLimiter,
};
