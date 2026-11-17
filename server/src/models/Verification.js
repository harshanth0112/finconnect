const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    credential: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Credential',
      required: true
    },
    documentUrl: {
      type: String,
      required: true
    },
    documentType: {
      type: String,
      enum: ['certificate', 'license', 'registration_letter', 'scorecard', 'other'],
      default: 'certificate'
    },
    remarks: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected', 'more_info_required'],
      default: 'pending',
      index: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    adminNotes: {
      type: String,
      trim: true
    },
    reviewedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Verification', verificationSchema);

