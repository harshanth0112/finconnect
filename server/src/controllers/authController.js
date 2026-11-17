const authService = require('../services/authService');

/**
 * POST /api/v1/auth/sync
 * Syncs the authenticated Firebase user with MongoDB
 */
const sync = async (req, res) => {
  try {
    const { uid, email, email_verified, name, picture } = req.firebaseUser;
    const { fullName, accountType, profileImage } = req.body;

    const result = await authService.syncUser({
      firebaseUid: uid,
      email: email || '',
      fullName: fullName || name || (email ? email.split('@')[0] : 'User'),
      accountType: accountType || 'finance_enthusiast',
      profileImage: profileImage || picture || '',
      emailVerified: email_verified
    });

    return res.status(200).json({
      success: true,
      message: 'User synchronized successfully',
      data: result
    });
  } catch (error) {
    console.error('[AuthController.sync] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to sync user',
      error: error.message
    });
  }
};

/**
 * GET /api/v1/auth/me
 * Retrieves the current logged in user & profile
 */
const getMe = async (req, res) => {
  try {
    if (!req.firebaseUser) {
      return res.status(401).json({
        success: false,
        message: 'Unauthenticated'
      });
    }

    const result = await authService.getCurrentUser(req.firebaseUser.uid);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User record not found in database. Please sync user first.'
      });
    }

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[AuthController.getMe] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get current user',
      error: error.message
    });
  }
};

module.exports = {
  sync,
  getMe
};

