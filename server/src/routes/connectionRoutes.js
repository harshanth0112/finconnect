const express = require('express');
const router = express.Router();
const networkController = require('../controllers/networkController');
const { verifyToken, requireAuth } = require('../middleware/authMiddleware');

router.use(verifyToken, requireAuth);

// Connections management
router.post('/', networkController.sendRequest);
router.get('/', networkController.getConnections);
router.patch('/:id', networkController.respondRequest);
router.delete('/:id', networkController.cancelRequest);

// Follow / Unfollow
router.post('/follow/:userId', networkController.toggleFollow);

// Mutual connections
router.get('/mutual/:userId', networkController.getMutual);

module.exports = router;

