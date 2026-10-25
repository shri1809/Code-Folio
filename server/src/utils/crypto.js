const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Generate a cryptographically secure 6-digit OTP
 * @returns {string} 6-digit numeric string
 */
const generateOtp = () => {
  // Generates between 100000 and 999999 inclusive
  const otpNumber = crypto.randomInt(100000, 1000000);
  return String(otpNumber);
};

/**
 * Hash a plain text string using bcrypt with 12 salt rounds
 * @param {string} text
 * @returns {Promise<string>}
 */
const hashSecret = async (text) => {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(text, salt);
};

/**
 * Compare plain text against a bcrypt hash
 * @param {string} text
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
const compareSecret = async (text, hash) => {
  if (!text || !hash) return false;
  return bcrypt.compare(text, hash);
};

module.exports = {
  generateOtp,
  hashSecret,
  compareSecret,
  BCRYPT_SALT_ROUNDS,
};

