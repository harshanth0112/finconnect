const Credential = require('../models/Credential');
const Verification = require('../models/Verification');
const notificationService = require('./notificationService');

/**
 * Submit credential and create a verification application
 */
const submitVerification = async (userId, data) => {
  const {
    authority,
    title,
    credentialNumber,
    issueDate,
    expiryDate,
    documentUrl,
    documentType,
    remarks
  } = data;

  // 1. Create Credential Record
  const credential = await Credential.create({
    user: userId,
    authority,
    title,
    credentialNumber,
    issueDate: issueDate || null,
    expiryDate: expiryDate || null,
    verificationStatus: 'pending'
  });

  // 2. Create Verification Application
  const verification = await Verification.create({
    applicant: userId,
    credential: credential._id,
    documentUrl,
    documentType: documentType || 'certificate',
    remarks: remarks || '',
    status: 'pending'
  });

  return { credential, verification };
};

/**
 * Get all credentials and verifications for the current user
 */
const getMyVerifications = async (userId) => {
  const credentials = await Credential.find({ user: userId }).sort({ createdAt: -1 });
  const verifications = await Verification.find({ applicant: userId })
    .populate('credential')
    .sort({ createdAt: -1 });

  return { credentials, verifications };
};

/**
 * Administrator: Get all verifications across the platform
 */
const getAllVerificationsForAdmin = async (filter = {}) => {
  const query = {};
  if (filter.status) query.status = filter.status;

  const verifications = await Verification.find(query)
    .populate('applicant', 'fullName email accountType profileImage')
    .populate('credential')
    .sort({ createdAt: -1 });

  return verifications;
};

/**
 * Administrator: Review and update a verification application
 */
const reviewVerification = async (verificationId, adminUserId, { status, adminNotes }) => {
  const validStatuses = ['approved', 'rejected', 'more_info_required', 'under_review'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid verification status');
  }

  const verification = await Verification.findById(verificationId);
  if (!verification) {
    throw new Error('Verification application not found');
  }

  verification.status = status;
  verification.adminNotes = adminNotes || '';
  verification.reviewedBy = adminUserId;
  verification.reviewedAt = new Date();
  await verification.save();

  // If approved or rejected, update the corresponding Credential
  if (verification.credential) {
    const credStatus = status === 'approved' ? 'verified' : status === 'rejected' ? 'rejected' : 'pending';
    await Credential.findByIdAndUpdate(verification.credential, {
      verificationStatus: credStatus,
      verifiedBadgeIssued: status === 'approved',
      verifiedAt: status === 'approved' ? new Date() : null
    });
  }

  // Trigger notification to the applicant
  const notificationMap = {
    approved: {
      type: 'verification_approved',
      title: 'Verification Approved',
      message: 'Your professional credential has been verified and your FinConnect badge is now active.'
    },
    rejected: {
      type: 'verification_rejected',
      title: 'Verification Rejected',
      message: `Your credential verification was rejected.${adminNotes ? ' Reason: ' + adminNotes : ''}`
    },
    more_info_required: {
      type: 'verification_info_requested',
      title: 'Additional Information Requested',
      message: `The admin requested additional details for your credential verification.${adminNotes ? ' Note: ' + adminNotes : ''}`
    }
  };

  if (notificationMap[status]) {
    await notificationService.createNotification({
      recipient: verification.user,
      sender: adminUserId,
      type: notificationMap[status].type,
      title: notificationMap[status].title,
      message: notificationMap[status].message,
      entityId: verification._id,
      entityType: 'verification'
    });
  }

  return verification;
};

module.exports = {
  submitVerification,
  getMyVerifications,
  getAllVerificationsForAdmin,
  reviewVerification
};

