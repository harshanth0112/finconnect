import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ShieldCheck, LogOut, User, Bell, Home, Briefcase, Search, MessageSquare, Users, Building2 } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, currentUser, logout, isAdmin } = useAuth();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-sky-700 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-sm">
                FC
              </div>
              <span className="font-extrabold text-xl text-gray-900 tracking-tight">FinConnect</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md"
                >
                  <Home className="w-4 h-4 mr-1.5" />
                  Feed
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md"
                >
                  <User className="w-4 h-4 mr-1.5" />
                  Profile
                </Link>

                <Link
                  to="/network"
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md"
                >
                  <Users className="w-4 h-4 mr-1.5" />
                  Network
                </Link>

                <Link
                  to="/discovery"
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md"
                >
                  <Search className="w-4 h-4 mr-1.5" />
                  Discovery
                </Link>

                <Link
                  to="/organisations"
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md"
                >
                  <Building2 className="w-4 h-4 mr-1.5" />
                  Organisations
                </Link>

                <Link
                  to="/messaging"
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  Messaging
                </Link>

                <Link
                  to="/verification"
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md"
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  Verification
                </Link>

                <Link
                  to="/notifications"
                  className="relative flex items-center text-sm font-medium text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md"
                >
                  <Bell className="w-4 h-4 mr-1.5" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md hover:bg-amber-100"
                  >
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    Admin
                  </Link>
                )}

                {/* Profile Pill */}
                <div className="flex items-center pl-3 border-l border-gray-200 space-x-3">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-semibold text-gray-800 leading-tight">
                      {currentUser?.fullName || 'User'}
                    </span>
                    <span className="text-xs text-sky-700 font-medium capitalize">
                      {currentUser?.accountType?.replace('_', ' ') || 'Member'}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-sky-600 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-md shadow-sm transition"
                >
                  Join FinConnect
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

