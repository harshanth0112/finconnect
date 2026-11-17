const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { verifyToken, requireAuth } = require('../middleware/authMiddleware');

router.use(verifyToken, requireAuth);

router.get('/', messageController.getConversations);
router.post('/', messageController.createConversation);
router.get('/:id/messages', messageController.getMessages);
router.post('/:id/messages', messageController.postMessage);
router.post('/:id/read', messageController.markRead);

module.exports = router;

