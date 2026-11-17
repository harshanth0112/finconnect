const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      required: true,
      enum: [
        'new_follower',
        'connection_request',
        'connection_accepted',
        'post_liked',
        'post_commented',
        'new_message',
        'verification_approved',
        'verification_rejected',
        'verification_info_requested'
      ],
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId
    },
    entityType: {
      type: String,
      enum: ['post', 'user', 'conversation', 'verification', 'credential', ''],
      default: ''
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

