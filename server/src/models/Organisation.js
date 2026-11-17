const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    tagline: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    logoUrl: {
      type: String,
      trim: true,
      default: ''
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    industry: {
      type: String,
      enum: [
        'Investment Banking',
        'Asset Management',
        'Wealth Advisory',
        'Fintech',
        'Commercial Banking',
        'Insurance',
        'Audit & Accounting',
        'Credit Rating',
        'Education & Research',
        'Other'
      ],
      default: 'Other',
      index: true
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
      default: '1-10'
    },
    headquarters: {
      type: String,
      trim: true,
      default: ''
    },
    foundedYear: {
      type: Number
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    // Registration details
    registrationNumber: {
      type: String,
      trim: true,
      default: ''
    },
    registrationAuthority: {
      type: String,
      trim: true,
      default: ''
    },
    documentUrl: {
      type: String,
      trim: true,
      default: ''
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified',
      index: true
    },
    verifiedBadgeIssued: {
      type: Boolean,
      default: false
    },
    verifiedAt: {
      type: Date
    },
    memberCount: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

organisationSchema.pre('save', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Math.random().toString(36).substring(2, 7);
  }
  next();
});

module.exports = mongoose.model('Organisation', organisationSchema);

