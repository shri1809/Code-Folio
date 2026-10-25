const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    recipientUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderName: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
      maxlength: [100, 'Sender name cannot exceed 100 characters'],
    },
    senderEmail: {
      type: String,
      required: [true, 'Sender email is required'],
      trim: true,
      lowercase: true,
      maxlength: [200, 'Sender email cannot exceed 200 characters'],
    },
    subject: {
      type: String,
      default: 'New message from CodeFolio portfolio visitor',
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true,
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    senderIp: {
      type: String,
      default: '',
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

module.exports = ContactMessage;

