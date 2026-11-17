import React, { useState, useEffect } from 'react';
import { getAdminVerifications, reviewVerification } from '../../services/verificationService';
import { getAdminStats, getAdminUsers, updateUserStatus, getAdminLogs } from '../../services/adminService';
import PageLoader from '../../lazy/PageLoader';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Clock,
  User,
  Filter,
  FileText,
  Check,
  X,
  Users,
  Building2,
  Activity,
  AlertTriangle,
  Lock,
  Unlock,
  ClipboardList
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('verifications'); // 'verifications' | 'users' | 'logs'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verification Queue State
  const [verifications, setVerifications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [notes, setNotes] = useState({});

  // User Management State
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');

  // Logs State
  const [logs, setLogs] = useState([]);

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'verifications') {
      loadVerifications();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'logs') {
      loadLogs();
    }
  }, [activeTab, filterStatus, userRoleFilter, userStatusFilter]);

  const loadStats = async () => {
    try {
      const data = await getAdminStats();
      if (data) setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const res = await getAdminVerifications(filterStatus);
      if (res) setVerifications(res);
    } catch (err) {
      console.error('Failed to load admin verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers({
        q: userSearch,
        role: userRoleFilter,
        status: userStatusFilter
      });
      if (res?.users) setUsers(res.users);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await getAdminLogs();
      if (res?.logs) setLogs(res.logs);
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    try {
      setActionLoading(id);
      const adminNote = notes[id] || '';
      await reviewVerification(id, status, adminNote);
      setMessage({ type: 'success', text: `Application successfully marked as ${status}.` });
      await Promise.all([loadVerifications(), loadStats()]);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Action failed' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleUserStatus = async (user) => {
    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    const reason = window.prompt(`Enter reason to set account status to ${nextStatus}:`, 'Platform compliance policy enforcement');
    if (reason === null) return;

    try {
      setActionLoading(user._id);
      await updateUserStatus(user._id, { status: nextStatus, reason });
      setMessage({ type: 'success', text: `User ${user.fullName} is now ${nextStatus}.` });
      await Promise.all([loadUsers(), loadStats()]);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Action failed' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-sky-950 text-white rounded-2xl p-8 mb-8 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Platform Administration & Moderation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Governance & Compliance Dashboard
        </h1>
        <p className="mt-2 text-amber-100 text-sm max-w-xl">
          Review regulatory credentials, enforce account suspension guidelines, monitor corporate accounts, and audit platform activity.
        </p>

        {/* Platform Stat Counters */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-amber-900/50">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
              <span className="text-[10px] text-amber-200 block uppercase font-bold">Total Members</span>
              <span className="text-xl font-black text-white">{stats.totalUsers}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
              <span className="text-[10px] text-amber-200 block uppercase font-bold">Pending Verifications</span>
              <span className="text-xl font-black text-amber-300">{stats.pendingVerifications}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
              <span className="text-[10px] text-amber-200 block uppercase font-bold">Verified Practitioners</span>
              <span className="text-xl font-black text-emerald-400">{stats.verifiedUsersCount}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
              <span className="text-[10px] text-amber-200 block uppercase font-bold">Organisations</span>
              <span className="text-xl font-black text-white">{stats.totalOrganisations}</span>
            </div>
          </div>
        )}
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 mb-6 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-4 py-2 rounded-xl transition flex items-center ${
            activeTab === 'verifications'
              ? 'bg-amber-100 text-amber-900'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-700" />
          Credential Verifications ({verifications.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition flex items-center ${
            activeTab === 'users'
              ? 'bg-amber-100 text-amber-900'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4 mr-1.5 text-amber-700" />
          Member Accounts & Moderation
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl transition flex items-center ${
            activeTab === 'logs'
              ? 'bg-amber-100 text-amber-900'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ClipboardList className="w-4 h-4 mr-1.5 text-amber-700" />
          Audit Trail
        </button>
      </div>

      {/* Tab 1: Verifications Queue */}
      {activeTab === 'verifications' && (
        <>
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-700">Filter By Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md text-xs px-2.5 py-1 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">All Applications</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="more_info_required">More Info Required</option>
              </select>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {verifications.length} Applications Total
            </span>
          </div>

          {loading ? (
            <PageLoader message="Loading queue..." />
          ) : verifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700 text-sm">No Applications Found</h3>
              <p className="text-xs text-gray-400 mt-1">There are no pending credential reviews in this view.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {verifications.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                        {item.user?.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{item.user?.fullName}</h3>
                        <p className="text-xs text-gray-500">
                          {item.user?.email} •{' '}
                          <span className="capitalize text-sky-700 font-medium">
                            {item.user?.accountType?.replace('_', ' ')}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 block mb-0.5">Regulatory Authority</span>
                        <span className="font-semibold text-gray-800">{item.authority}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-0.5">Credential Name / Title</span>
                        <span className="font-semibold text-gray-800">{item.title}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-0.5">Registration Number</span>
                        <span className="font-mono text-gray-800">{item.credentialNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-0.5">Current Application Status</span>
                        <span
                          className={`font-semibold capitalize ${
                            item.status === 'approved'
                              ? 'text-emerald-600'
                              : item.status === 'rejected'
                              ? 'text-red-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {item.documentUrl && (
                      <div>
                        <a
                          href={item.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-semibold text-sky-600 hover:text-sky-700"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" />
                          View Verification Evidence Document
                        </a>
                      </div>
                    )}

                    <div className="pt-2">
                      <input
                        type="text"
                        placeholder="Admin review notes / justification..."
                        value={notes[item._id] || item.adminNotes || ''}
                        onChange={(e) => setNotes({ ...notes, [item._id]: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end space-x-2 md:space-x-0 md:space-y-2 flex-shrink-0">
                    <button
                      onClick={() => handleReview(item._id, 'approved')}
                      disabled={actionLoading === item._id}
                      className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition"
                    >
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      Approve Badge
                    </button>
                    <button
                      onClick={() => handleReview(item._id, 'rejected')}
                      disabled={actionLoading === item._id}
                      className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition"
                    >
                      <X className="w-3.5 h-3.5 mr-1.5" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleReview(item._id, 'more_info_required')}
                      disabled={actionLoading === item._id}
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition"
                    >
                      Request Info
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab 2: User Moderation */}
      {activeTab === 'users' && (
        <div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
              className="text-xs border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64"
            />
            <div className="flex space-x-2 w-full sm:w-auto">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              <button
                onClick={loadUsers}
                className="px-4 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg"
              >
                Search
              </button>
            </div>
          </div>

          {loading ? (
            <PageLoader message="Loading member directory..." />
          ) : users.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
              No users matching query.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-3">Member</th>
                    <th className="px-6 py-3">Account Type</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3">
                        <div className="font-bold text-gray-900">{u.fullName}</div>
                        <div className="text-gray-400 text-[11px]">{u.email}</div>
                      </td>
                      <td className="px-6 py-3 capitalize text-gray-700">
                        {u.accountType?.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'suspended'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            disabled={actionLoading === u._id}
                            className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${
                              u.status === 'suspended'
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-red-50 text-red-700 hover:bg-red-100'
                            }`}
                          >
                            {u.status === 'suspended' ? (
                              <>
                                <Unlock className="w-3.5 h-3.5 mr-1" />
                                Activate
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5 mr-1" />
                                Suspend
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Audit Trail */}
      {activeTab === 'logs' && (
        <div>
          {loading ? (
            <PageLoader message="Loading compliance logs..." />
          ) : logs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
              No audit logs recorded yet.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs divide-y divide-gray-100">
              {logs.map((log) => (
                <div key={log._id} className="p-4 flex items-start justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block mb-0.5">
                      {log.action}
                    </span>
                    <span className="text-gray-500">
                      Executed by: <strong className="text-gray-700">{log.admin?.fullName || 'Admin'}</strong> ({log.admin?.email})
                    </span>
                    {log.details && (
                      <div className="text-[11px] text-gray-400 mt-1">
                        Target: {log.targetType} #{log.targetId} {log.details.reason ? `• Reason: "${log.details.reason}"` : ''}
                      </div>
                    )}
                  </div>
                  <span className="text-gray-400 text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
