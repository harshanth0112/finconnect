const express = require('express');
const router = express.Router();
const organisationController = require('../controllers/organisationController');
const { verifyToken, requireAuth, requireRole } = require('../middleware/authMiddleware');

// Public or authenticated listings
router.get('/', organisationController.getAll);
router.get('/:id', organisationController.getById);

// Protected routes
router.use(verifyToken, requireAuth);

router.post('/', organisationController.create);
router.put('/:id', organisationController.update);
router.post('/:id/members', organisationController.joinOrAddMember);

// Platform admin review
router.patch('/:id/verify', requireRole('admin'), organisationController.reviewVerification);

module.exports = router;

