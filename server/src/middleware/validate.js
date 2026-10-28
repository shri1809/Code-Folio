const { body, validationResult } = require('express-validator');
const { isReservedUsername } = require('../utils/reservedUsernames');
const { ROLE_IDS } = require('../utils/rolesTaxonomy');

/**
 * Middleware that inspects express-validator errors and halts with 400
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Check that a URL is safe and does not contain dangerous protocols like javascript:
 */
const isSafeUrl = (value) => {
  if (!value || typeof value !== 'string') return true;
  const trimmed = value.trim().toLowerCase();
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')
  ) {
    return false;
  }
  return true;
};

// Validation for User Registration
const validateRegister = [
  body('name')
    .optional()
    .isString()
    .withMessage('Full name must be a string')
    .trim()
    .isLength({ max: 80 })
    .withMessage('Full name cannot exceed 80 characters'),
  body('username')
    .isString()
    .withMessage('Username must be a string')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain alphanumeric characters, underscores, and hyphens')
    .custom((val) => {
      if (isReservedUsername(val)) {
        throw new Error(`The username '${val}' is reserved and cannot be registered`);
      }
      return true;
    }),
  body('email')
    .isString()
    .withMessage('Email must be a string')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters long'),
  handleValidationErrors,
];

// Validation for User Login
const validateLogin = [
  body('email')
    .isString()
    .withMessage('Email must be a string')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 128 })
    .withMessage('Password cannot exceed 128 characters'),
  handleValidationErrors,
];

// Validation for Requesting OTP
const validateRequestOtp = [
  body('email')
    .isString()
    .withMessage('Email must be a string')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  handleValidationErrors,
];

// Validation for Verifying OTP
const validateVerifyOtp = [
  body('email')
    .isString()
    .withMessage('Email must be a string')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('otp')
    .isString()
    .withMessage('OTP must be a string')
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only digits'),
  handleValidationErrors,
];

// Validation for Changing Password
const validateChangePassword = [
  body('currentPassword')
    .isString()
    .withMessage('Current password must be a string')
    .notEmpty()
    .withMessage('Current password is required')
    .isLength({ max: 128 })
    .withMessage('Current password cannot exceed 128 characters'),
  body('newPassword')
    .isString()
    .withMessage('New password must be a string')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters long'),
  handleValidationErrors,
];

// Validation for Resetting Password via OTP
const validateResetPassword = [
  body('email')
    .isString()
    .withMessage('Email must be a string')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('otp')
    .isString()
    .withMessage('OTP must be a string')
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only digits'),
  body('newPassword')
    .isString()
    .withMessage('New password must be a string')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters long'),
  handleValidationErrors,
];

// Validation for Contact Relay Form
const validateContactMessage = [
  body('senderName')
    .isString()
    .withMessage('Sender name must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Sender name must be between 1 and 100 characters'),
  body('senderEmail')
    .isString()
    .withMessage('Sender email must be a string')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('subject')
    .optional()
    .isString()
    .withMessage('Subject must be a string')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters'),
  body('message')
    .isString()
    .withMessage('Message must be a string')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message must be between 1 and 5000 characters'),
  handleValidationErrors,
];

// Validation for Portfolio Mutation
const validatePortfolioUpdate = [
  body('profile.name')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Profile name cannot exceed 100 characters'),
  body('profile.bio')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('Profile bio cannot exceed 10000 characters'),
  body('profile.socialLinks.github')
    .optional({ values: 'falsy' })
    .custom((val) => {
      if (!isSafeUrl(val)) throw new Error('Unsafe URL protocol in github link');
      return true;
    }),
  body('profile.socialLinks.linkedin')
    .optional({ values: 'falsy' })
    .custom((val) => {
      if (!isSafeUrl(val)) throw new Error('Unsafe URL protocol in linkedin link');
      return true;
    }),
  body('profile.socialLinks.twitter')
    .optional({ values: 'falsy' })
    .custom((val) => {
      if (!isSafeUrl(val)) throw new Error('Unsafe URL protocol in twitter link');
      return true;
    }),
  body('profile.socialLinks.website')
    .optional({ values: 'falsy' })
    .custom((val) => {
      if (!isSafeUrl(val)) throw new Error('Unsafe URL protocol in website link');
      return true;
    }),
  body('profile.resumeUrl')
    .optional({ values: 'falsy' })
    .custom((val) => {
      if (!isSafeUrl(val)) throw new Error('Unsafe URL protocol in resume link');
      return true;
    }),
  body('skills.frontend')
    .optional({ values: 'null' })
    .isArray({ max: 50 })
    .withMessage('Frontend skills cannot exceed 50 items'),
  body('skills.backend')
    .optional({ values: 'null' })
    .isArray({ max: 50 })
    .withMessage('Backend skills cannot exceed 50 items'),
  body('skills.devops')
    .optional({ values: 'null' })
    .isArray({ max: 50 })
    .withMessage('DevOps skills cannot exceed 50 items'),
  body('projects')
    .optional({ values: 'null' })
    .isArray({ max: 50 })
    .withMessage('Projects cannot exceed 50 items'),
  body('projects.*.title')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage('Project title must be between 1 and 120 characters'),
  body('projects.*.description')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Project description cannot exceed 2000 characters'),
  body('projects.*.repoLink')
    .optional({ values: 'falsy' })
    .custom((val) => {
      if (!isSafeUrl(val)) throw new Error('Unsafe URL protocol detected in repository link');
      return true;
    }),
  body('projects.*.liveLink')
    .optional({ values: 'falsy' })
    .custom((val) => {
      if (!isSafeUrl(val)) throw new Error('Unsafe URL protocol detected in live link');
      return true;
    }),
  body('projects.*.screenshot')
    .optional({ values: 'falsy' })
    .custom((val) => {
      if (!isSafeUrl(val)) throw new Error('Unsafe URL protocol detected in screenshot link');
      return true;
    }),
  body('templateId')
    .optional({ values: 'falsy' })
    .isIn(ROLE_IDS)
    .withMessage('Invalid template ID selected'),
  body('customDomain')
    .optional({ values: 'falsy' })
    .isString()
    .trim()
    .matches(/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$|^$/)
    .withMessage('Invalid domain format'),
  handleValidationErrors,
];

module.exports = {
  isSafeUrl,
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateRequestOtp,
  validateVerifyOtp,
  validateChangePassword,
  validateResetPassword,
  validateContactMessage,
  validatePortfolioUpdate,
};

