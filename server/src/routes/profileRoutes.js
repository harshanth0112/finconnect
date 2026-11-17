const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken, requireAuth } = require('../middleware/authMiddleware');

// Get current user's profile
router.get('/me', verifyToken, requireAuth, profileController.getMyProfile);

// Update current user's profile
router.put('/me', verifyToken, requireAuth, profileController.updateMyProfile);

// Get any public profile by user ID or profile ID
router.get('/:id', verifyToken, profileController.getProfileById);

module.exports = router;

