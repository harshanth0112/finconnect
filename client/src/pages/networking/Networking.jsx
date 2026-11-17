import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyConnections, respondConnectionRequest, cancelConnectionRequest } from '../../services/networkService';
import PageLoader from '../../lazy/PageLoader';
import { Users, UserCheck, UserPlus, Check, X, Clock, ShieldCheck } from 'lucide-react';

const Networking = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState({ accepted: [], pendingReceived: [], pendingSent: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('connections');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const res = await getMyConnections();
      if (res) setData(res);
    } catch (err) {
      console.error('Failed to load connections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (connectionId, action) => {
    try {
      setActionLoading(connectionId);
      await respondConnectionRequest(connectionId, action);
      await loadConnections();
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (connectionId) => {
    try {
      setActionLoading(connectionId);
      await cancelConnectionRequest(connectionId);
      await loadConnections();
    } catch (err) {
      console.error('Failed to cancel request:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <PageLoader message="Loading professional network..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-2xl p-8 mb-8 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="w-5 h-5 text-sky-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
            Professional Relationships
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Financial Network
        </h1>
        <p className="mt-2 text-sky-100 text-sm max-w-xl">
          Build direct relationships with verified analysts, chartered accountants, educators, and institutions in the finance community.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 mb-6 pb-2">
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
            activeTab === 'connections'
              ? 'bg-sky-50 text-sky-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Connections ({data.accepted.length})
        </button>

        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition relative ${
            activeTab === 'received'
              ? 'bg-sky-50 text-sky-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Received Requests
          {data.pendingReceived.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-sky-600 text-white rounded-full font-bold">
              {data.pendingReceived.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
            activeTab === 'sent'
              ? 'bg-sky-50 text-sky-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sent Requests ({data.pendingSent.length})
        </button>
      </div>

      {/* Tab 1: Accepted Connections */}
      {activeTab === 'connections' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          {data.accepted.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">No Connections Yet</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Explore posts or discovery to connect with fellow finance enthusiasts and professionals.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.accepted.map((conn) => {
                const otherUser =
                  conn.requester?._id === currentUser?._id ? conn.recipient : conn.requester;

                return (
                  <div
                    key={conn._id}
                    className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-base flex-shrink-0">
                        {otherUser?.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{otherUser?.fullName}</h4>
                        <span className="text-[10px] font-semibold text-sky-700 uppercase">
                          {otherUser?.accountType?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-600 font-medium flex items-center">
                      <UserCheck className="w-3.5 h-3.5 mr-1" />
                      Connected
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Pending Received Requests */}
      {activeTab === 'received' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          {data.pendingReceived.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm">No incoming connection requests.</p>
            </div>
          ) : (
            data.pendingReceived.map((req) => (
              <div
                key={req._id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm">
                    {req.requester?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{req.requester?.fullName}</h4>
                    <span className="text-xs text-gray-500 capitalize">
                      {req.requester?.accountType?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRespond(req._id, 'accept')}
                    disabled={actionLoading === req._id}
                    className="inline-flex items-center px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(req._id, 'reject')}
                    disabled={actionLoading === req._id}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-medium transition"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Pending Sent Requests */}
      {activeTab === 'sent' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          {data.pendingSent.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm">No pending invitations sent.</p>
            </div>
          ) : (
            data.pendingSent.map((req) => (
              <div
                key={req._id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">
                    {req.recipient?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{req.recipient?.fullName}</h4>
                    <span className="text-xs text-gray-500 capitalize">
                      {req.recipient?.accountType?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCancel(req._id)}
                  disabled={actionLoading === req._id}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-lg transition"
                >
                  Withdraw Request
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Networking;

