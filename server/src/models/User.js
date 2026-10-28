const mongoose = require('mongoose');
const { isReservedUsername } = require('../utils/reservedUsernames');
const { ROLE_IDS } = require('../utils/rolesTaxonomy');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
      maxlength: [80, 'Full name cannot exceed 80 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      validate: {
        validator: function (val) {
          if (!val) return false;
          // Must be alphanumeric + underscores/hyphens
          const validFormat = /^[a-zA-Z0-9_-]+$/.test(val);
          if (!validFormat) return false;
          return !isReservedUsername(val);
        },
        message: (props) =>
          `The username '${props.value}' is reserved or invalid. Please choose another username.`,
      },
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    mfaEnabled: {
      type: Boolean,
      default: function () {
        return this.role === 'admin';
      },
    },
    otpCodeHash: {
      type: String,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    otpLockoutUntil: {
      type: Date,
      default: null,
    },
    isPro: {
      type: Boolean,
      default: false,
    },
    customDomain: {
      type: String,
      lowercase: true,
      trim: true,
      default: undefined,
      match: [
        /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
        'Please provide a valid domain name (e.g. example.com)',
      ],
    },
    templateId: {
      type: String,
      enum: ROLE_IDS,
      default: 'minimalist',
    },
    refreshTokenHash: {
      type: String,
      default: null,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

// Prevent NoSQL operator injection in queries
userSchema.set('strictQuery', true);

// Enforce uniqueness only for users who have defined a valid customDomain string
userSchema.index(
  { customDomain: 1 },
  {
    unique: true,
    partialFilterExpression: { customDomain: { $type: 'string' } },
  }
);

// Method to check if user is currently locked out from OTP attempts
userSchema.methods.isOtpLocked = function () {
  return this.otpLockoutUntil && this.otpLockoutUntil > new Date();
};

const User = mongoose.model('User', userSchema);

module.exports = User;

