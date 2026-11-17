const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const adminController = require('../controllers/adminController');
const { verifyToken, requireAuth, requireRole } = require('../middleware/authMiddleware');

// All admin routes require admin role
router.use(verifyToken, requireAuth, requireRole('admin'));

// Platform Stats
router.get('/stats', adminController.getStats);

// User Moderation
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);

// Post Moderation
router.delete('/posts/:id', adminController.moderatePost);

// Verification queue review endpoints
router.get('/verifications', verificationController.getAdminVerifications);
router.patch('/verifications/:id', verificationController.reviewVerification);

// Audit logs
router.get('/logs', adminController.getLogs);

module.exports = router;

