/**
 * Reserved usernames that cannot be claimed by users to prevent route collision
 * with system endpoints, pages, or administrative paths.
 */
const RESERVED_USERNAMES = new Set([
  'admin',
  'api',
  'auth',
  'login',
  'register',
  'logout',
  'dashboard',
  'settings',
  'user',
  'users',
  'public',
  'portfolio',
  'u',
  'root',
  'administrator',
  'system',
  'support',
  'billing',
  'help',
  'static',
  'assets',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
]);

const isReservedUsername = (username) => {
  if (!username || typeof username !== 'string') return true;
  return RESERVED_USERNAMES.has(username.toLowerCase().trim());
};

module.exports = {
  RESERVED_USERNAMES,
  isReservedUsername,
};

