const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    authority: {
      type: String,
      required: true,
      enum: [
        'SEBI',
        'AMFI',
        'IRDAI',
        'PFRDA',
        'RBI',
        'MCA',
        'ICAI',
        'ICSI',
        'ICMAI',
        'NISM',
        'UGC',
        'AICTE',
        'CFA Institute',
        'Other'
      ]
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    credentialNumber: {
      type: String,
      required: true,
      trim: true
    },
    issueDate: {
      type: Date
    },
    expiryDate: {
      type: Date
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'pending',
      index: true
    },
    verifiedBadgeIssued: {
      type: Boolean,
      default: false
    },
    verifiedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Credential', credentialSchema);

