const verificationService = require('../services/verificationService');

/**
 * POST /api/v1/verifications
 * Submit a new credential for manual verification
 */
const submitVerification = async (req, res) => {
  try {
    const { authority, title, credentialNumber, documentUrl } = req.body;
    if (!authority || !title || !credentialNumber || !documentUrl) {
      return res.status(400).json({
        success: false,
        message: 'Authority, title, credential number, and supporting document are required'
      });
    }

    const result = await verificationService.submitVerification(req.user._id, req.body);
    return res.status(201).json({
      success: true,
      message: 'Credential verification submitted for administrator review',
      data: result
    });
  } catch (error) {
    console.error('[VerificationController.submitVerification] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit verification',
      error: error.message
    });
  }
};

/**
 * GET /api/v1/verifications/me
 * Get current user's submitted credentials and status
 */
const getMyVerifications = async (req, res) => {
  try {
    const result = await verificationService.getMyVerifications(req.user._id);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[VerificationController.getMyVerifications] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get credentials',
      error: error.message
    });
  }
};

/**
 * GET /api/v1/admin/verifications
 * Admin: List all applications
 */
const getAdminVerifications = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const list = await verificationService.getAllVerificationsForAdmin(filter);
    return res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    console.error('[VerificationController.getAdminVerifications] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get verification list',
      error: error.message
    });
  }
};

/**
 * PATCH /api/v1/admin/verifications/:id
 * Admin: Approve, reject, or request more information
 */
const reviewVerification = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const updated = await verificationService.reviewVerification(
      req.params.id,
      req.user._id,
      { status, adminNotes }
    );

    return res.status(200).json({
      success: true,
      message: `Verification application updated to ${status}`,
      data: updated
    });
  } catch (error) {
    console.error('[VerificationController.reviewVerification] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to review verification application',
      error: error.message
    });
  }
};

module.exports = {
  submitVerification,
  getMyVerifications,
  getAdminVerifications,
  reviewVerification
};

