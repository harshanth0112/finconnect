const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    type: {
      type: String,
      enum: ['like', 'insightful', 'celebrate'],
      default: 'like'
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate reactions from the same user on a post
reactionSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);

