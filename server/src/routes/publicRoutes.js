const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const { strictRateLimiter } = require('../middleware/rateLimiter');
const { validateContactMessage } = require('../middleware/validate');

// Custom domain resolution endpoint
router.get('/domain/:hostname', publicController.getPortfolioByDomain);

// Public profile viewer
router.get('/:username', publicController.getPublicPortfolio);

// Contact message relay to developer
router.post(
  '/:username/contact',
  strictRateLimiter,
  validateContactMessage,
  publicController.sendContactRelay
);

module.exports = router;

