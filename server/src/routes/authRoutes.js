const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { strictRateLimiter } = require('../middleware/rateLimiter');
const { doubleCsrfProtection } = require('../middleware/csrf');
const {
  validateRegister,
  validateLogin,
  validateRequestOtp,
  validateVerifyOtp,
  validateChangePassword,
  validateResetPassword,
} = require('../middleware/validate');

// Public Auth Endpoints protected with strict rate limiting
router.post('/register', strictRateLimiter, validateRegister, authController.register);
router.post('/login', strictRateLimiter, validateLogin, authController.login);
router.post('/request-otp', strictRateLimiter, validateRequestOtp, authController.requestOtp);
router.post('/verify-otp', strictRateLimiter, validateVerifyOtp, authController.verifyOtp);
router.post('/reset-password', strictRateLimiter, validateResetPassword, authController.resetPasswordWithOtp);

// Session Endpoints
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.getCurrentUser);
router.get('/csrf-token', authController.getCsrfToken);

// Authenticated Password Change Endpoint (Protected with CSRF & Strict Rate Limiting)
router.put(
  '/password',
  requireAuth,
  doubleCsrfProtection,
  strictRateLimiter,
  validateChangePassword,
  authController.changePassword
);

module.exports = router;

