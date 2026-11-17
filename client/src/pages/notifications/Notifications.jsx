import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle,
  UserPlus,
  Users,
  Heart,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  Info,
  Clock,
  Trash2,
  ExternalLink
} from 'lucide-react';
import PageLoader from '../../lazy/PageLoader';

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    handleMarkAsRead,
    handleMarkAllAsRead,
    fetchNotifications
  } = useNotification();

  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case 'new_follower':
        return <Users className="w-5 h-5 text-sky-500" />;
      case 'connection_request':
      case 'connection_accepted':
        return <UserPlus className="w-5 h-5 text-indigo-500" />;
      case 'post_liked':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'post_commented':
      case 'new_message':
        return <MessageSquare className="w-5 h-5 text-emerald-500" />;
      case 'verification_approved':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'verification_rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'verification_info_requested':
        return <Info className="w-5 h-5 text-amber-500" />;
      default:
        return <Bell className="w-5 h-5 text-sky-600" />;
    }
  };

  const handleNotificationClick = (item) => {
    if (!item.isRead) {
      handleMarkAsRead(item._id);
    }

    if (item.entityType === 'conversation' || item.type === 'new_message') {
      navigate('/messaging');
    } else if (item.entityType === 'post' || item.type === 'post_liked' || item.type === 'post_commented') {
      navigate('/dashboard');
    } else if (item.type === 'connection_request' || item.type === 'connection_accepted' || item.type === 'new_follower') {
      navigate('/network');
    } else if (item.type.startsWith('verification')) {
      navigate('/verification');
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="w-6 h-6 mr-2 text-sky-600" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Stay updated with your finance connections, verification decisions, and engagement.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 mb-6 space-x-6 text-sm font-semibold text-gray-500">
        <button
          onClick={() => setFilter('all')}
          className={`pb-3 transition ${
            filter === 'all'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'hover:text-gray-800'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`pb-3 transition ${
            filter === 'unread'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'hover:text-gray-800'
          }`}
        >
          Unread Only
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <PageLoader message="Loading activity..." />
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700 text-sm">No notifications</h3>
          <p className="text-xs text-gray-400 mt-1">
            You are all caught up! New alerts and interactions will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs divide-y divide-gray-100 overflow-hidden">
          {filteredNotifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`p-4 flex items-start space-x-4 cursor-pointer transition hover:bg-sky-50/40 ${
                !n.isRead ? 'bg-sky-50/20 font-medium' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-gray-50 flex-shrink-0 shadow-2xs">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-gray-900">{n.title}</h4>
                  <span className="text-[11px] text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(n.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-2">{n.message}</p>
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-sky-600 hover:text-sky-700 font-semibold flex items-center">
                    View Details
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </span>
                  {!n.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(n._id);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>

              {!n.isRead && (
                <div className="w-2.5 h-2.5 bg-sky-600 rounded-full flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;

