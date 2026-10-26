const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    filename: {
      type: String,
      trim: true,
      default: 'screenshot.webp',
      maxlength: [255, 'Filename cannot exceed 255 characters'],
    },
    contentType: {
      type: String,
      required: true,
      enum: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif',
        'image/svg+xml',
      ],
    },
    size: {
      type: Number,
      required: true,
      max: [5 * 1024 * 1024, 'File size cannot exceed 5MB'],
    },
    data: {
      type: Buffer,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Upload', uploadSchema);
