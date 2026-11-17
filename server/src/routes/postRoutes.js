const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const { verifyToken, requireAuth } = require('../middleware/authMiddleware');

// Get feed posts (public or connection-based)
router.get('/', verifyToken, feedController.getPosts);

// Bookmarks
router.get('/bookmarked', verifyToken, requireAuth, feedController.getBookmarks);
router.post('/:id/bookmark', verifyToken, requireAuth, feedController.toggleBookmark);

// Create new post
router.post('/', verifyToken, requireAuth, feedController.createPost);

// Toggle reaction (like, etc.)
router.post('/:id/reactions', verifyToken, requireAuth, feedController.toggleReaction);

// Comments
router.get('/:id/comments', verifyToken, feedController.getComments);
router.post('/:id/comments', verifyToken, requireAuth, feedController.addComment);

// Delete post
router.delete('/:id', verifyToken, requireAuth, feedController.deletePost);

module.exports = router;

