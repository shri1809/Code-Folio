const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [120, 'Project title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Project description cannot exceed 2000 characters'],
    },
    techStack: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 50,
        message: 'Project tech stack cannot exceed 50 items',
      },
    },
    repoLink: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Repository link cannot exceed 500 characters'],
    },
    liveLink: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Live link cannot exceed 500 characters'],
    },
    appStoreLink: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'App Store link cannot exceed 500 characters'],
    },
    playStoreLink: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Play Store link cannot exceed 500 characters'],
    },
    screenshot: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Screenshot URL cannot exceed 1000 characters'],
    },
  },
  { _id: true }
);

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    profile: {
      name: {
        type: String,
        default: '',
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
      },
      bio: {
        type: String,
        default: '',
        trim: true,
        maxlength: [10000, 'Bio cannot exceed 10000 characters'],
      },
      socialLinks: {
        github: { type: String, default: '', trim: true, maxlength: 500 },
        linkedin: { type: String, default: '', trim: true, maxlength: 500 },
        twitter: { type: String, default: '', trim: true, maxlength: 500 },
        website: { type: String, default: '', trim: true, maxlength: 500 },
      },
      resumeUrl: {
        type: String,
        default: '',
        trim: true,
        maxlength: 1000,
      },
    },
    skills: {
      frontend: {
        type: [String],
        default: [],
        validate: {
          validator: (arr) => arr.length <= 50,
          message: 'Frontend skills cannot exceed 50 items',
        },
      },
      backend: {
        type: [String],
        default: [],
        validate: {
          validator: (arr) => arr.length <= 50,
          message: 'Backend skills cannot exceed 50 items',
        },
      },
      devops: {
        type: [String],
        default: [],
        validate: {
          validator: (arr) => arr.length <= 50,
          message: 'DevOps skills cannot exceed 50 items',
        },
      },
    },
    projects: {
      type: [projectSchema],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 50,
        message: 'Projects count cannot exceed 50 items',
      },
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;

