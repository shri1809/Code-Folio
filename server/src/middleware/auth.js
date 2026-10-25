const { verifyAccessToken } = require('../services/tokenService');
const User = require('../models/User');

/**
 * Authentication middleware
 * Checks accessToken in HttpOnly cookies or Bearer Authorization header
 */
const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. No access token provided.',
      });
    }

    const payload = verifyAccessToken(token);
    if (!payload || !payload.sub) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired access token.',
      });
    }

    const user = await User.findById(payload.sub).select('-passwordHash -otpCodeHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User account not found.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed.',
      details: err.message,
    });
  }
};

module.exports = {
  requireAuth,
};

