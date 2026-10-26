const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Upload = require('../models/Upload');
const { requireAuth } = require('../middleware/auth');
const { doubleCsrfProtection } = require('../middleware/csrf');

// Configure multer memory storage with strict 5MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];
    if (allowedMimeTypes.includes(file.mimetype?.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed formats: PNG, JPG, JPEG, WEBP, GIF, SVG.'));
    }
  },
});

/**
 * POST /api/upload/screenshot
 * Authenticated & CSRF-protected endpoint to upload an image from device directly into MongoDB.
 */
router.post(
  '/screenshot',
  requireAuth,
  doubleCsrfProtection,
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: 'File size exceeds 5MB limit. Please choose a smaller image.',
          });
        }
        return res.status(400).json({
          success: false,
          error: err.message || 'File upload failed.',
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No image file was uploaded.',
        });
      }

      const newUpload = await Upload.create({
        userId: req.user._id,
        filename: req.file.originalname || 'screenshot.webp',
        contentType: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
      });

      const imageUrl = `/api/uploads/${newUpload._id}`;

      return res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        url: imageUrl,
        uploadId: newUpload._id,
        filename: newUpload.filename,
        size: newUpload.size,
      });
    } catch (error) {
      console.error('[Upload Screenshot Error]:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to save image. Please try again.',
      });
    }
  }
);

/**
 * GET /:id
 * Public endpoint to fetch the image binary with permanent cache headers.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image identifier.',
      });
    }

    const imageDoc = await Upload.findById(id);
    if (!imageDoc) {
      return res.status(404).json({
        success: false,
        error: 'Image not found.',
      });
    }

    res.set({
      'Content-Type': imageDoc.contentType,
      'Content-Length': imageDoc.size,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Access-Control-Allow-Origin': '*',
    });

    return res.status(200).send(imageDoc.data);
  } catch (error) {
    console.error('[Serve Upload Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve image.',
    });
  }
});

module.exports = router;
