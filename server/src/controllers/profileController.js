const profileService = require('../services/profileService');

/**
 * GET /api/v1/profiles/me
 */
const getMyProfile = async (req, res) => {
  try {
    const profile = await profileService.getMyProfile(req.user._id, req.firebaseUser.uid);
    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('[ProfileController.getMyProfile] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message
    });
  }
};

/**
 * PUT /api/v1/profiles/me
 */
const updateMyProfile = async (req, res) => {
  try {
    const updated = await profileService.updateMyProfile(req.user._id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('[ProfileController.updateMyProfile] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

/**
 * GET /api/v1/profiles/:id
 */
const getProfileById = async (req, res) => {
  try {
    const profile = await profileService.getProfileById(req.params.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('[ProfileController.getProfileById] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getProfileById
};

