const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_SECRET || 'codefolio_default_access_jwt_secret_key_32chars';
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || 'codefolio_default_refresh_jwt_secret_key_32chars';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const COOKIE_OPTIONS_BASE = {
  httpOnly: true,
  secure: true, // Always set Secure flag as required by security spec
  sameSite: 'strict',
  path: '/',
};

const ACCESS_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS_BASE,
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS_BASE,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Generate Access Token (15m)
 * @param {object} user - User object { _id, username, email, role, isPro }
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      isPro: user.isPro,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generate Refresh Token (7d)
 * @param {object} user
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      tokenVersion: Date.now(),
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Verify Access Token
 * @param {string} token
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (err) {
    return null;
  }
};

/**
 * Verify Refresh Token
 * @param {string} token
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (err) {
    return null;
  }
};

/**
 * Attach tokens into HttpOnly Secure Strict cookies on res
 * @param {object} res - Express response
 * @param {string} accessToken
 * @param {string} refreshToken
 */
const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, ACCESS_COOKIE_OPTIONS);
  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  }
};

/**
 * Clear authentication cookies on logout
 * @param {object} res - Express response
 */
const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', COOKIE_OPTIONS_BASE);
  res.clearCookie('refreshToken', COOKIE_OPTIONS_BASE);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  ACCESS_COOKIE_OPTIONS,
  REFRESH_COOKIE_OPTIONS,
};

