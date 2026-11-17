const mongoose = require('mongoose');

const organisationMemberSchema = new mongoose.Schema(
  {
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organisation',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    title: {
      type: String,
      trim: true,
      default: 'Team Member'
    }
  },
  {
    timestamps: true
  }
);

organisationMemberSchema.index({ organisation: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('OrganisationMember', organisationMemberSchema);

