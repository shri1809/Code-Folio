const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Upload = require('../models/Upload');
const Portfolio = require('../models/Portfolio');
const { requireAuth } = require('../middleware/auth');
const { doubleCsrfProtection } = require('../middleware/csrf');

// Configure multer memory storage for Screenshots (Images up to 5MB)
const screenshotUpload = multer({
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
      cb(new Error('Invalid image format. Allowed formats: PNG, JPG, JPEG, WEBP, GIF, SVG.'));
    }
  },
});

// Configure multer memory storage for Resumes & CVs (Documents up to 10MB)
const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/octet-stream',
    ];
    const ext = file.originalname?.split('.').pop()?.toLowerCase();
    const validExts = ['pdf', 'doc', 'docx', 'txt'];

    if (allowedMimeTypes.includes(file.mimetype?.toLowerCase()) || validExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid document format. Allowed formats: PDF, DOC, DOCX.'));
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
    screenshotUpload.single('image')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: 'File size exceeds 5MB limit. Please choose a smaller image.',
          });
        }
        return res.status(400).json({
          success: false,
          error: err.message || 'Image upload failed.',
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
        contentType: req.file.mimetype || 'image/png',
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
 * POST /api/upload/resume
 * Authenticated & CSRF-protected endpoint to upload a Resume / CV (PDF, DOC, DOCX) directly into MongoDB.
 */
router.post(
  '/resume',
  requireAuth,
  doubleCsrfProtection,
  (req, res, next) => {
    resumeUpload.single('resume')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: 'Resume size exceeds 10MB limit. Please choose a smaller document.',
          });
        }
        return res.status(400).json({
          success: false,
          error: err.message || 'Resume upload failed.',
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
          error: 'No resume document was uploaded.',
        });
      }

      // Detect content type accurately based on extension
      let contentType = req.file.mimetype;
      const ext = req.file.originalname?.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') {
        contentType = 'application/pdf';
      } else if (ext === 'docx') {
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (ext === 'doc') {
        contentType = 'application/msword';
      }

      const newUpload = await Upload.create({
        userId: req.user._id,
        filename: req.file.originalname || 'resume.pdf',
        contentType: contentType || 'application/pdf',
        size: req.file.size,
        data: req.file.buffer,
      });

      const resumeUrl = `/api/uploads/${newUpload._id}`;

      // Automatically update the user's portfolio profile.resumeUrl
      await Portfolio.findOneAndUpdate(
        { userId: req.user._id },
        { $set: { 'profile.resumeUrl': resumeUrl } },
        { new: true, upsert: true }
      );

      return res.status(201).json({
        success: true,
        message: 'Resume uploaded and attached to your portfolio successfully!',
        url: resumeUrl,
        uploadId: newUpload._id,
        filename: newUpload.filename,
        size: newUpload.size,
      });
    } catch (error) {
      console.error('[Upload Resume Error]:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to save resume document. Please try again.',
      });
    }
  }
);

/**
 * GET /:id
 * Public endpoint to fetch uploaded files (screenshots, resumes, PDFs) with optimal viewing & download headers.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file identifier.',
      });
    }

    const doc = await Upload.findById(id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: 'File not found.',
      });
    }

    const isPdf = doc.contentType === 'application/pdf';
    const isImage = doc.contentType?.startsWith('image/');
    // For PDFs and images, display inline in the browser tab with viewer; for docs, trigger download
    const disposition = isPdf || isImage ? 'inline' : 'attachment';

    res.set({
      'Content-Type': doc.contentType,
      'Content-Length': doc.size,
      'Content-Disposition': `${disposition}; filename="${encodeURIComponent(doc.filename || (isPdf ? 'resume.pdf' : 'document'))}"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Access-Control-Allow-Origin': '*',
    });

    return res.status(200).send(doc.data);
  } catch (error) {
    console.error('[Serve Upload Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve file.',
    });
  }
});

module.exports = router;
