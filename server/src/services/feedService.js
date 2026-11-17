const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Reaction = require('../models/Reaction');
const Bookmark = require('../models/Bookmark');
const User = require('../models/User');
const notificationService = require('./notificationService');

/**
 * Extract hashtags from text
 */
const extractHashtags = (text) => {
  const matches = text.match(/#([a-zA-Z0-9_]+)/g);
  return matches ? matches.map((tag) => tag.substring(1).toLowerCase()) : [];
};

/**
 * Create a new feed post
 */
const createPost = async (userId, { content, images, visibility }) => {
  const hashtags = extractHashtags(content);

  const post = await Post.create({
    author: userId,
    content,
    images: images || [],
    hashtags,
    visibility: visibility || 'public'
  });

  return await post.populate('author', 'fullName email accountType profileImage role');
};

/**
 * Get paginated feed posts with reaction state for current user
 */
const getFeedPosts = async (currentUserId, { page = 1, limit = 10, hashtag }) => {
  const skip = (page - 1) * limit;
  const query = {};
  if (hashtag) {
    query.hashtags = hashtag.toLowerCase();
  }

  const posts = await Post.find(query)
    .populate('author', 'fullName email accountType profileImage role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments(query);

  // Check if current user has reacted or bookmarked each post
  const postIds = posts.map((p) => p._id);
  const [userReactions, userBookmarks] = await Promise.all([
    Reaction.find({
      user: currentUserId,
      post: { $in: postIds }
    }),
    Bookmark.find({
      user: currentUserId,
      post: { $in: postIds }
    })
  ]);

  const reactedPostMap = new Map();
  userReactions.forEach((r) => reactedPostMap.set(r.post.toString(), r.type));

  const bookmarkSet = new Set(userBookmarks.map((b) => b.post.toString()));

  const items = posts.map((post) => {
    const p = post.toObject();
    p.userReaction = reactedPostMap.get(post._id.toString()) || null;
    p.isBookmarked = bookmarkSet.has(post._id.toString());
    return p;
  });

  return {
    items,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Toggle like/reaction on a post
 */
const toggleReaction = async (userId, postId, type = 'like') => {
  const existing = await Reaction.findOne({ user: userId, post: postId });

  if (existing) {
    // Remove reaction (unlike)
    await Reaction.findByIdAndDelete(existing._id);
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
    return { reacted: false };
  } else {
    // Add reaction
    await Reaction.create({ user: userId, post: postId, type });
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

    // Notify post author
    const post = await Post.findById(postId);
    if (post && post.author.toString() !== userId.toString()) {
      const user = await User.findById(userId);
      await notificationService.createNotification({
        recipient: post.author,
        sender: userId,
        type: 'post_liked',
        title: 'Post Liked',
        message: `${user?.fullName || 'Someone'} liked your post`,
        entityId: postId,
        entityType: 'post'
      });
    }

    return { reacted: true, type };
  }
};

/**
 * Add comment to post
 */
const addComment = async (userId, postId, { content, parentComment }) => {
  const comment = await Comment.create({
    post: postId,
    author: userId,
    content,
    parentComment: parentComment || null
  });

  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

  // Notify post author
  const post = await Post.findById(postId);
  if (post && post.author.toString() !== userId.toString()) {
    const commenter = await User.findById(userId);
    await notificationService.createNotification({
      recipient: post.author,
      sender: userId,
      type: 'post_commented',
      title: 'New Comment',
      message: `${commenter?.fullName || 'Someone'} commented on your post: "${content.substring(0, 40)}${content.length > 40 ? '...' : ''}"`,
      entityId: postId,
      entityType: 'post'
    });
  }

  return await comment.populate('author', 'fullName profileImage accountType');
};

/**
 * Get comments for a post
 */
const getComments = async (postId) => {
  return await Comment.find({ post: postId })
    .populate('author', 'fullName profileImage accountType')
    .sort({ createdAt: 1 });
};

/**
 * Delete a post (only author or admin)
 */
const deletePost = async (postId, userId, userRole) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  if (post.author.toString() !== userId.toString() && userRole !== 'admin') {
    throw new Error('Unauthorized to delete this post');
  }

  await Post.findByIdAndDelete(postId);
  await Comment.deleteMany({ post: postId });
  await Reaction.deleteMany({ post: postId });

  return { success: true };
};

/**
 * Toggle bookmark on a post
 */
const toggleBookmark = async (userId, postId) => {
  const existing = await Bookmark.findOne({ user: userId, post: postId });

  if (existing) {
    await Bookmark.findByIdAndDelete(existing._id);
    return { bookmarked: false };
  } else {
    await Bookmark.create({ user: userId, post: postId });
    return { bookmarked: true };
  }
};

/**
 * Get user's bookmarked posts
 */
const getBookmarkedPosts = async (userId, { page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;

  const bookmarks = await Bookmark.find({ user: userId })
    .populate({
      path: 'post',
      populate: { path: 'author', select: 'fullName email accountType profileImage role' }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Bookmark.countDocuments({ user: userId });
  const items = bookmarks.map((b) => ({
    ...b.post.toObject(),
    isBookmarked: true
  }));

  return {
    items,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

module.exports = {
  createPost,
  getFeedPosts,
  toggleReaction,
  toggleBookmark,
  getBookmarkedPosts,
  addComment,
  getComments,
  deletePost
};

