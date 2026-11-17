import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPosts, createPost, toggleReaction, toggleBookmark, getBookmarkedPosts, getComments, addComment, deletePost } from '../../services/feedService';
import PageLoader from '../../lazy/PageLoader';
import { 
  Send, ThumbsUp, MessageSquare, Share2, Trash2, Bookmark,
  Image, Hash, ShieldCheck, TrendingUp, Sparkles, AlertCircle 
} from 'lucide-react';

const Feed = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [commentsMap, setCommentsMap] = useState({});
  const [commentInput, setCommentInput] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [viewBookmarks, setViewBookmarks] = useState(false);

  useEffect(() => {
    if (viewBookmarks) {
      loadBookmarks();
    } else {
      loadFeed();
    }
  }, [filterTag, viewBookmarks]);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const res = await getBookmarkedPosts(1);
      if (res?.items) {
        setPosts(res.items);
      }
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFeed = async () => {
    try {
      setLoading(true);
      const res = await getPosts(1, filterTag);
      if (res?.items) {
        setPosts(res.items);
      }
    } catch (err) {
      console.error('Failed to load feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      const newPost = await createPost({
        content,
        images: imageUrl.trim() ? [imageUrl.trim()] : [],
        visibility: 'public'
      });
      setPosts([newPost, ...posts]);
      setContent('');
      setImageUrl('');
      setShowImageInput(false);
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleReaction = async (postId) => {
    try {
      const res = await toggleReaction(postId);
      setPosts(
        posts.map((p) => {
          if (p._id === postId) {
            return {
              ...p,
              userReaction: res.reacted ? 'like' : null,
              likesCount: res.reacted ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error('Reaction failed:', err);
    }
  };

  const handleToggleBookmark = async (postId) => {
    try {
      const res = await toggleBookmark(postId);
      setPosts(
        posts.map((p) => {
          if (p._id === postId) {
            return {
              ...p,
              isBookmarked: res.bookmarked
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    }
  };

  const toggleComments = async (postId) => {
    if (activeCommentsPostId === postId) {
      setActiveCommentsPostId(null);
      return;
    }

    setActiveCommentsPostId(postId);
    if (!commentsMap[postId]) {
      try {
        const comments = await getComments(postId);
        setCommentsMap((prev) => ({ ...prev, [postId]: comments }));
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      }
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentInput.trim()) return;
    try {
      const newComment = await addComment(postId, commentInput.trim());
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));
      setPosts(
        posts.map((p) =>
          p._id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
        )
      );
      setCommentInput('');
    } catch (err) {
      console.error('Failed to submit comment:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(postId);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error('Delete post error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Feed / Bookmarks Filter Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewBookmarks(false)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              !viewBookmarks
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Community Feed
          </button>
          <button
            onClick={() => setViewBookmarks(true)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center ${
              viewBookmarks
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 mr-1 text-sky-600" />
            Saved Posts
          </button>
        </div>

        {filterTag && (
          <span className="text-xs bg-sky-50 text-sky-700 px-3 py-1 rounded-full font-semibold flex items-center">
            #{filterTag}
            <button
              onClick={() => setFilterTag('')}
              className="ml-2 hover:text-sky-900"
            >
              ×
            </button>
          </span>
        )}
      </div>

      {/* Create Post Card - hidden when in bookmarks mode */}
      {!viewBookmarks && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 mb-8">
        <form onSubmit={handleCreatePost}>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
              {currentUser?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <textarea
                rows={3}
                placeholder="Share a financial observation, market analysis, or regulatory update... (#macro #markets)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border-0 focus:ring-0 text-sm text-gray-800 placeholder-gray-400 p-0 resize-none"
              />

              {showImageInput && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center space-x-2">
                  <Image className="w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    placeholder="Paste image / chart URL..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-md px-3 py-1.5 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
              >
                <Image className="w-4 h-4 mr-1 text-gray-400" />
                Add Image
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              {submitting ? 'Posting...' : 'Post to Feed'}
            </button>
          </div>
        </form>
      </div>
      )}

      {/* Filter / Hashtag active state */}
      {filterTag && (
        <div className="flex items-center justify-between mb-4 bg-sky-50 px-4 py-2 rounded-xl text-xs text-sky-800 border border-sky-100">
          <span>
            Filtering by <strong>#{filterTag}</strong>
          </span>
          <button
            onClick={() => setFilterTag('')}
            className="font-semibold text-sky-600 hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Feed Stream */}
      {loading ? (
        <PageLoader message="Loading financial discourse..." />
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-800">No Posts in Feed</h3>
          <p className="text-xs text-gray-400 mt-1">Be the first to share an insight with the FinConnect community!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const isLiked = post.userReaction === 'like';
            const isAuthor = post.author?._id === currentUser?._id;

            return (
              <div
                key={post._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6"
              >
                {/* Author Info */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">
                      {post.author?.profileImage ? (
                        <img
                          src={post.author.profileImage}
                          alt={post.author.fullName}
                          className="w-full h-full rounded-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        post.author?.fullName?.charAt(0) || 'U'
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900 text-sm">
                          {post.author?.fullName || 'Anonymous'}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                          {post.author?.accountType?.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {(isAuthor || currentUser?.role === 'admin') && (
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-gray-400 hover:text-red-600 transition"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line mb-4">
                  {post.content}
                </p>

                {/* Optional Attached Images */}
                {post.images && post.images.length > 0 && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 max-h-96">
                    <img
                      src={post.images[0]}
                      alt="Post visual"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                {/* Hashtags */}
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.hashtags.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => setFilterTag(tag)}
                        className="text-xs font-medium text-sky-600 hover:underline"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center space-x-6 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <button
                    onClick={() => handleToggleReaction(post._id)}
                    className={`inline-flex items-center space-x-1.5 transition ${
                      isLiked ? 'text-sky-600 font-bold' : 'hover:text-gray-800'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-sky-600' : ''}`} />
                    <span>{post.likesCount || 0} Likes</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post._id)}
                    className="inline-flex items-center space-x-1.5 hover:text-gray-800 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount || 0} Comments</span>
                  </button>

                  <button
                    onClick={() => handleToggleBookmark(post._id)}
                    className={`inline-flex items-center space-x-1.5 transition ${
                      post.isBookmarked ? 'text-sky-600 font-bold' : 'hover:text-gray-800'
                    }`}
                    title={post.isBookmarked ? 'Saved to bookmarks' : 'Bookmark post'}
                  >
                    <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-sky-600' : ''}`} />
                    <span>{post.isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {activeCommentsPostId === post._id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Write a constructive comment..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                        className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-sky-500 focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post._id)}
                        className="px-3 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700"
                      >
                        Reply
                      </button>
                    </div>

                    <div className="space-y-2 pt-2">
                      {(commentsMap[post._id] || []).map((c) => (
                        <div key={c._id} className="bg-gray-50 p-2.5 rounded-lg text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-800">
                              {c.author?.fullName || 'User'}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Feed;

