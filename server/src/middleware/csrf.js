const { doubleCsrf } = require('csrf-csrf');

const CSRF_SECRET =
  process.env.CSRF_SECRET || 'codefolio_csrf_super_secret_key_32_characters_minimum!';

const {
  invalidCsrfTokenError,
  generateToken,
  validateRequest,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => CSRF_SECRET,
  cookieName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: false, // Double submit cookie must be readable by JS client or sent as cookie
    sameSite: 'strict',
    path: '/',
    secure: true,
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
});

module.exports = {
  doubleCsrfProtection,
  generateToken,
  invalidCsrfTokenError,
};

