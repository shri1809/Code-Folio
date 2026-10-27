const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const { generateOtp, hashSecret, compareSecret } = require('../utils/crypto');
const { sendOtpEmail } = require('../services/mailService');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} = require('../services/tokenService');
const { generateToken } = require('../middleware/csrf');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    const normalizedUsername = username.toLowerCase().trim();
    const normalizedEmail = email.toLowerCase().trim();

    // Check existing username
    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      // If the unverified user is re-submitting with the same email, refresh OTP and allow them to proceed
      if (!existingUsername.isVerified && existingUsername.email === normalizedEmail) {
        const passwordHash = await hashSecret(password);
        const otpCode = generateOtp();
        const otpCodeHash = await hashSecret(otpCode);
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        existingUsername.passwordHash = passwordHash;
        existingUsername.otpCodeHash = otpCodeHash;
        existingUsername.otpExpiresAt = otpExpiresAt;
        existingUsername.otpAttempts = 0;
        existingUsername.otpLockoutUntil = null;
        await existingUsername.save();

        try {
          await sendOtpEmail(normalizedEmail, otpCode, normalizedUsername);
        } catch (mailErr) {
          console.warn(`[Auth] Could not send welcome OTP email: ${mailErr.message}`);
        }

        return res.status(200).json({
          success: true,
          message: 'Account pending verification. A fresh 6-digit verification code has been dispatched to your email.',
          user: {
            id: existingUsername._id,
            username: existingUsername.username,
            email: existingUsername.email,
            role: existingUsername.role,
            isVerified: false,
          },
        });
      }

      return res.status(400).json({
        success: false,
        error: 'Username is already taken. Please choose another.',
      });
    }

    // Check existing email
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      if (!existingEmail.isVerified) {
        const passwordHash = await hashSecret(password);
        const otpCode = generateOtp();
        const otpCodeHash = await hashSecret(otpCode);
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        existingEmail.username = normalizedUsername;
        existingEmail.passwordHash = passwordHash;
        existingEmail.otpCodeHash = otpCodeHash;
        existingEmail.otpExpiresAt = otpExpiresAt;
        existingEmail.otpAttempts = 0;
        existingEmail.otpLockoutUntil = null;
        await existingEmail.save();

        let emailDispatched = true;
        let emailWarning = null;
        try {
          await sendOtpEmail(normalizedEmail, otpCode, normalizedUsername);
        } catch (mailErr) {
          emailDispatched = false;
          emailWarning = mailErr.message;
          console.warn(`[Auth] Could not send welcome OTP email: ${mailErr.message}`);
        }

        return res.status(200).json({
          success: true,
          emailSent: emailDispatched,
          message: emailDispatched
            ? 'Account pending verification. A fresh 6-digit verification code has been dispatched to your email.'
            : `Verification code refreshed, but email delivery failed (${emailWarning || 'SMTP error'}). Please verify SMTP credentials on Render.`,
          user: {
            id: existingEmail._id,
            username: existingEmail.username,
            email: existingEmail.email,
            role: existingEmail.role,
            isVerified: false,
          },
        });
      }

      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists.',
      });
    }

    // Hash password with bcrypt 12 rounds
    const passwordHash = await hashSecret(password);

    // Generate initial 6-digit OTP for email verification
    const otpCode = generateOtp();
    const otpCodeHash = await hashSecret(otpCode);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const newUser = await User.create({
      name: name?.trim() || '',
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      isVerified: false,
      otpCodeHash,
      otpExpiresAt,
      otpAttempts: 0,
      templateId: 'minimalist',
    });

    // Create empty default portfolio for user
    await Portfolio.create({
      userId: newUser._id,
      profile: {
        name: name?.trim() || '',
        bio: '',
        socialLinks: { github: '', linkedin: '', twitter: '', website: '' },
        resumeUrl: '',
      },
      skills: { frontend: [], backend: [], devops: [] },
      projects: [],
    });

    // Dispatch verification OTP email
    let emailDispatched = true;
    let emailWarning = null;
    try {
      await sendOtpEmail(normalizedEmail, otpCode, normalizedUsername);
    } catch (mailErr) {
      emailDispatched = false;
      emailWarning = mailErr.message;
      console.warn(`[Auth] Could not send welcome OTP email: ${mailErr.message}`);
    }

    return res.status(201).json({
      success: true,
      emailSent: emailDispatched,
      message: emailDispatched
        ? 'Registration successful. A 6-digit verification code has been dispatched to your email.'
        : `Registration successful, but email delivery failed (${emailWarning || 'SMTP error'}). Please verify SMTP credentials on Render.`,
      user: {
        id: newUser._id,
        name: newUser.name || '',
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
    });
  } catch (err) {
    console.error(`[Register Error]: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: 'Registration failed due to an internal server error.',
    });
  }
};

/**
 * Request OTP for 2FA or Passwordless Login
 * POST /api/auth/request-otp
 */
const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account found with this email address.',
      });
    }

    // Check if account is temporarily locked
    if (user.isOtpLocked()) {
      const waitMinutes = Math.ceil((user.otpLockoutUntil - Date.now()) / (60 * 1000));
      return res.status(429).json({
        success: false,
        error: `Account is temporarily locked due to excessive failed attempts. Please try again in ${waitMinutes} minutes.`,
      });
    }

    // Generate cryptographically secure OTP
    const otpCode = generateOtp();
    const otpCodeHash = await hashSecret(otpCode);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otpCodeHash = otpCodeHash;
    user.otpExpiresAt = otpExpiresAt;
    user.otpAttempts = 0; // Reset counter for new OTP
    await user.save();

    // Send email via Gmail SMTP
    try {
      await sendOtpEmail(user.email, otpCode, user.username);
    } catch (mailErr) {
      console.error(`[RequestOtp] Mail dispatch failed: ${mailErr.message}`);
      return res.status(503).json({
        success: false,
        error: `Email delivery failed (${mailErr.message}). Please verify SMTP_EMAIL and SMTP_APP_PASSWORD in Render settings.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'A 6-digit OTP has been sent to your email address.',
    });
  } catch (err) {
    console.error(`[RequestOtp Error]: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to request OTP.',
    });
  }
};

/**
 * Verify OTP code
 * POST /api/auth/verify-otp
 */
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    // Check lockout
    if (user.isOtpLocked()) {
      const waitMinutes = Math.ceil((user.otpLockoutUntil - Date.now()) / (60 * 1000));
      return res.status(429).json({
        success: false,
        error: `Account is temporarily locked. Please try again in ${waitMinutes} minutes.`,
      });
    }

    // Check if OTP hash exists (prevents replay of already-used OTP)
    if (!user.otpCodeHash || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        error: 'No active OTP found. Please request a new OTP.',
      });
    }

    // Check expiry (> 5 mins)
    if (new Date() > user.otpExpiresAt) {
      user.otpCodeHash = null;
      user.otpExpiresAt = null;
      await user.save();
      return res.status(400).json({
        success: false,
        error: 'OTP has expired. Please request a new verification code.',
      });
    }

    // Verify OTP code
    const isMatch = await compareSecret(otp, user.otpCodeHash);

    if (!isMatch) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;

      // Lockout if 5 failed attempts reached
      if (user.otpAttempts >= 5) {
        user.otpLockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        user.otpCodeHash = null; // Invalidate active OTP
        user.otpExpiresAt = null;
        await user.save();

        return res.status(429).json({
          success: false,
          error: 'Maximum OTP verification attempts exceeded. Account is locked for 15 minutes.',
        });
      }

      await user.save();
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP code. Please check and try again.',
        attemptsRemaining: 5 - user.otpAttempts,
      });
    }

    // Successful verification: consume OTP
    user.otpCodeHash = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;
    user.otpLockoutUntil = null;
    user.isVerified = true;
    await user.save();

    // Issue tokens inside HttpOnly, Secure, SameSite=Strict cookies
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully. Authenticated.',
      user: {
        id: user._id,
        name: user.name || '',
        username: user.username,
        email: user.email,
        role: user.role,
        isPro: user.isPro,
        isVerified: user.isVerified,
        templateId: user.templateId,
      },
    });
  } catch (err) {
    console.error(`[VerifyOtp Error]: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: 'OTP verification encountered an internal error.',
    });
  }
};

/**
 * Standard Password Login (with MFA support)
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password credentials.',
      });
    }

    const isMatch = await compareSecret(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password credentials.',
      });
    }

    // If user is not yet verified or MFA is enabled, initiate OTP flow
    if (!user.isVerified || user.mfaEnabled) {
      const otpCode = generateOtp();
      user.otpCodeHash = await hashSecret(otpCode);
      user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
      user.otpAttempts = 0;
      await user.save();

      try {
        await sendOtpEmail(user.email, otpCode, user.username);
      } catch (mailErr) {
        console.warn(`[Login] OTP mail dispatch failed: ${mailErr.message}`);
      }

      return res.status(200).json({
        success: true,
        mfaRequired: true,
        email: user.email,
        message: !user.isVerified
          ? 'Email verification required. Verification code sent to your email.'
          : 'Two-factor authentication required. Verification code sent to email.',
      });
    }

    // Issue cookies directly for non-MFA accounts
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        id: user._id,
        name: user.name || '',
        username: user.username,
        email: user.email,
        role: user.role,
        isPro: user.isPro,
        isVerified: user.isVerified,
        templateId: user.templateId,
      },
    });
  } catch (err) {
    console.error(`[Login Error]: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: 'Login failed due to an internal server error.',
    });
  }
};

/**
 * Refresh Access Token using Refresh Token cookie
 * POST /api/auth/refresh
 */
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies && req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No refresh token provided in cookies.',
      });
    }

    const payload = verifyRefreshToken(token);
    if (!payload || !payload.sub) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token.',
      });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        error: 'User not found.',
      });
    }

    // Token rotation: Issue new access token and new refresh token
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to refresh token.',
    });
  }
};

/**
 * Logout user by clearing HttpOnly auth cookies
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  clearAuthCookies(res);
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * Get current authenticated user session
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name || '',
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      isPro: req.user.isPro,
      isVerified: req.user.isVerified,
      templateId: req.user.templateId,
      customDomain: req.user.customDomain || null,
    },
  });
};

/**
 * Provide CSRF Token for Double-Submit Cookie protection
 * GET /api/auth/csrf-token
 */
const getCsrfToken = (req, res) => {
  const csrfToken = generateToken(req, res);
  return res.status(200).json({
    success: true,
    csrfToken,
  });
};

/**
 * Change password for authenticated user
 * PUT /api/auth/password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    const isMatch = await compareSecret(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect.',
      });
    }

    const isSamePassword = await compareSecret(newPassword, user.passwordHash);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        error: 'New password cannot be the same as your current password.',
      });
    }

    user.passwordHash = await hashSecret(newPassword);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password successfully updated. Your new credentials are now active.',
    });
  } catch (err) {
    console.error(`[Change Password Error]: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to update password.',
    });
  }
};

/**
 * Reset password using email OTP verification
 * POST /api/auth/reset-password
 */
const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account found with this email address.',
      });
    }

    // Check if account is temporarily locked
    if (user.isOtpLocked()) {
      const waitMinutes = Math.ceil((user.otpLockoutUntil - Date.now()) / (60 * 1000));
      return res.status(429).json({
        success: false,
        error: `Account is temporarily locked due to excessive failed attempts. Please try again in ${waitMinutes} minutes.`,
      });
    }

    // Check if OTP hash exists
    if (!user.otpCodeHash || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        error: 'No active OTP found. Please request a new verification code.',
      });
    }

    // Check expiry
    if (new Date() > user.otpExpiresAt) {
      user.otpCodeHash = null;
      user.otpExpiresAt = null;
      await user.save();
      return res.status(400).json({
        success: false,
        error: 'OTP code has expired. Please request a fresh verification code.',
      });
    }

    // Compare OTP
    const isOtpValid = await compareSecret(otp, user.otpCodeHash);
    if (!isOtpValid) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;

      if (user.otpAttempts >= 5) {
        user.otpLockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
        user.otpCodeHash = null;
        user.otpExpiresAt = null;
        await user.save();

        return res.status(429).json({
          success: false,
          error: 'Maximum OTP verification attempts exceeded. Account is locked for 15 minutes.',
        });
      }

      await user.save();
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP code. Please check and try again.',
        attemptsRemaining: 5 - user.otpAttempts,
      });
    }

    // Invalidate consumed OTP & reset lockout
    user.otpCodeHash = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;
    user.otpLockoutUntil = null;
    user.isVerified = true;

    // Hash and store new password
    user.passwordHash = await hashSecret(newPassword);
    await user.save();

    // Issue refreshed auth session cookies
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Password successfully reset! You are now logged in.',
      user: {
        id: user._id,
        name: user.name || '',
        username: user.username,
        email: user.email,
        role: user.role,
        isPro: user.isPro,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error(`[ResetPasswordWithOtp Error]: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to reset password due to an internal server error.',
    });
  }
};

module.exports = {
  register,
  requestOtp,
  verifyOtp,
  login,
  refreshToken,
  logout,
  getCurrentUser,
  getCsrfToken,
  changePassword,
  resetPasswordWithOtp,
};

