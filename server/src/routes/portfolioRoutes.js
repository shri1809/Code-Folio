const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { requireAuth } = require('../middleware/auth');
const { requireRole, requirePortfolioOwnership } = require('../middleware/rbac');
const { doubleCsrfProtection } = require('../middleware/csrf');
const { validatePortfolioUpdate } = require('../middleware/validate');

// All portfolio routes require authentication and user or admin role
router.use(requireAuth);
router.use(requireRole('user', 'admin'));

// Fetch logged-in user's portfolio
router.get('/', portfolioController.getMyPortfolio);

// Mutate portfolio: Enforce CSRF protection, RBAC ownership, and input validation
router.put(
  '/',
  doubleCsrfProtection,
  requirePortfolioOwnership,
  validatePortfolioUpdate,
  portfolioController.updateMyPortfolio
);

// Delete/reset portfolio: Enforce CSRF and RBAC ownership
router.delete(
  '/',
  doubleCsrfProtection,
  requirePortfolioOwnership,
  portfolioController.deleteMyPortfolio
);

module.exports = router;

