const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    headline: {
      type: String,
      trim: true,
      default: ''
    },
    bio: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        current: Boolean
      }
    ],
    experience: [
      {
        company: String,
        position: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String
      }
    ],
    skills: [
      {
        type: String,
        trim: true
      }
    ],
    financeInterests: [
      {
        type: String,
        trim: true
      }
    ],
    qualifications: [
      {
        type: String,
        trim: true
      }
    ],
    certifications: [
      {
        name: String,
        issuingOrganization: String,
        issueDate: Date,
        credentialUrl: String
      }
    ],
    followersCount: {
      type: Number,
      default: 0
    },
    followingCount: {
      type: Number,
      default: 0
    },
    connectionsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Profile', profileSchema);

