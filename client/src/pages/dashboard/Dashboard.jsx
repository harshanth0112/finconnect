import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Shield, ArrowUpRight, TrendingUp, Users, Award } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, currentProfile, firebaseUser } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 text-white rounded-2xl p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/30 text-sky-200 border border-sky-400/30 capitalize">
                {currentUser?.accountType?.replace('_', ' ') || 'Finance Enthusiast'}
              </span>
              {currentUser?.emailVerified && (
                <span className="inline-flex items-center text-xs font-medium text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Verified Email
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.fullName || firebaseUser?.displayName || 'FinConnect Member'}
            </h1>
            <p className="mt-2 text-sky-100 text-sm max-w-xl">
              Module 1 Authentication is live. Discover, verify credentials, evaluate research, and connect with trusted financial peers.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex space-x-3">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 text-center">
              <span className="text-xs text-sky-200 block">User Role</span>
              <span className="text-sm font-bold uppercase tracking-wider">{currentUser?.role || 'user'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 text-center">
              <span className="text-xs text-sky-200 block">Status</span>
              <span className="text-sm font-bold text-emerald-400 capitalize">{currentUser?.status || 'active'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Account Identity</h3>
            <Users className="w-5 h-5 text-sky-600" />
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong className="text-gray-900">Email:</strong> {currentUser?.email || firebaseUser?.email}</p>
            <p><strong className="text-gray-900">Firebase UID:</strong> <span className="font-mono text-xs">{currentUser?.firebaseUid}</span></p>
            <p><strong className="text-gray-900">Registered On:</strong> {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Today'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Credential Badges</h3>
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Module 3 credential verification allows SEBI, AMFI, ICAI, and CFA credentials review.
          </p>
          <span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
            Pending Credential Application
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Financial Feed</h3>
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Share financial insights, research notes, and market commentary with your network.
          </p>
          <span className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
            Module 4 Feed Ready
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

