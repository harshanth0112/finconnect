const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const { verifyToken, requireAuth } = require('../middleware/authMiddleware');

// User routes
router.post('/', verifyToken, requireAuth, verificationController.submitVerification);
router.get('/me', verifyToken, requireAuth, verificationController.getMyVerifications);

module.exports = router;

