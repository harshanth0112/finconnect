const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000
    },
    images: [
      {
        type: String,
        trim: true
      }
    ],
    hashtags: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    visibility: {
      type: String,
      enum: ['public', 'connections'],
      default: 'public',
      index: true
    },
    likesCount: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    },
    sharesCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

postSchema.index({ hashtags: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);

