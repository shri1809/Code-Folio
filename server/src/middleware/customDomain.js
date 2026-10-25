const User = require('../models/User');
const Portfolio = require('../models/Portfolio');

/**
 * Middleware that checks incoming Host or X-Forwarded-Host header.
 * If the host matches a registered custom domain for a Pro user,
 * it resolves the user and portfolio and attaches it to req.resolvedDomainUser.
 */
const resolveCustomDomain = async (req, res, next) => {
  try {
    const rawHost =
      req.headers['x-forwarded-host'] ||
      req.headers['host'] ||
      '';

    // Strip port if present (e.g. "john.com:5000" -> "john.com")
    const hostname = rawHost.split(':')[0].toLowerCase().trim();

    // Ignore localhost, 127.0.0.1, internal test hosts, or main domain
    const systemHosts = ['localhost', '127.0.0.1', 'codefolio.dev', 'api.codefolio.dev'];
    if (!hostname || systemHosts.includes(hostname)) {
      return next();
    }

    // Look for a verified Pro user with this customDomain
    const user = await User.findOne({
      customDomain: hostname,
      isPro: true,
    }).select('-passwordHash -otpCodeHash -refreshTokenHash');

    if (user) {
      req.resolvedDomainUser = user;
    }

    next();
  } catch (err) {
    // Non-blocking error handling
    console.error(`[CustomDomainMiddleware] Error resolving host: ${err.message}`);
    next();
  }
};

module.exports = {
  resolveCustomDomain,
};

