const feedService = require('../services/feedService');

/**
 * POST /api/v1/posts
 */
const createPost = async (req, res) => {
  try {
    const { content, images, visibility } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Post content cannot be empty'
      });
    }

    const post = await feedService.createPost(req.user._id, {
      content,
      images,
      visibility
    });

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    console.error('[FeedController.createPost] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message
    });
  }
};

/**
 * GET /api/v1/posts
 */
const getPosts = async (req, res) => {
  try {
    const { page, limit, hashtag } = req.query;
    const currentUserId = req.user ? req.user._id : null;
    const result = await feedService.getFeedPosts(currentUserId, { page, limit, hashtag });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[FeedController.getPosts] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: error.message
    });
  }
};

/**
 * POST /api/v1/posts/:id/reactions
 */
const toggleReaction = async (req, res) => {
  try {
    const { type } = req.body;
    const result = await feedService.toggleReaction(req.user._id, req.params.id, type);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[FeedController.toggleReaction] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process reaction',
      error: error.message
    });
  }
};

/**
 * POST /api/v1/posts/:id/comments
 */
const addComment = async (req, res) => {
  try {
    const { content, parentComment } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot be empty'
      });
    }

    const comment = await feedService.addComment(req.user._id, req.params.id, {
      content,
      parentComment
    });

    return res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('[FeedController.addComment] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
};

/**
 * GET /api/v1/posts/:id/comments
 */
const getComments = async (req, res) => {
  try {
    const comments = await feedService.getComments(req.params.id);
    return res.status(200).json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('[FeedController.getComments] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message
    });
  }
};

/**
 * DELETE /api/v1/posts/:id
 */
const deletePost = async (req, res) => {
  try {
    await feedService.deletePost(req.params.id, req.user._id, req.user.role);
    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('[FeedController.deletePost] Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete post'
    });
  }
};

/**
 * POST /api/v1/posts/:id/bookmark
 */
const toggleBookmark = async (req, res) => {
  try {
    const result = await feedService.toggleBookmark(req.user._id, req.params.id);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[FeedController.toggleBookmark] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle bookmark',
      error: error.message
    });
  }
};

/**
 * GET /api/v1/posts/bookmarked
 */
const getBookmarks = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await feedService.getBookmarkedPosts(req.user._id, { page, limit });
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[FeedController.getBookmarks] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookmarked posts',
      error: error.message
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  toggleReaction,
  toggleBookmark,
  getBookmarks,
  addComment,
  getComments,
  deletePost
};

