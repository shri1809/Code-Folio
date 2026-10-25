/**
 * RBAC middleware to restrict access to specific user roles
 * @param {...string} allowedRoles
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required prior to authorization check.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: role '${req.user.role}' is not authorized to access this resource. Required: ${allowedRoles.join(' or ')}.`,
      });
    }

    next();
  };
};

/**
 * Verify portfolio ownership: ensures a user can only mutate/delete their own portfolio
 * Admin role can bypass ownership checks if needed.
 */
const requirePortfolioOwnership = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.',
    });
  }

  // If a target userId or portfolio owner is specified in params or body
  const targetUserId =
    req.params.userId ||
    req.params.id ||
    (req.body && req.body.userId);

  if (targetUserId && targetUserId.toString() !== req.user._id.toString()) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have permission to modify another user\'s portfolio.',
      });
    }
  }

  next();
};

module.exports = {
  requireRole,
  requirePortfolioOwnership,
};

