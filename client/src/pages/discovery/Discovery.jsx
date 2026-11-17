import React, { useState, useEffect } from 'react';
import { searchDiscovery } from '../../services/discoveryService';
import { getOrganisations } from '../../services/organisationService';
import { sendConnectionRequest } from '../../services/networkService';
import { Link } from 'react-router-dom';
import PageLoader from '../../lazy/PageLoader';
import {
  Search, Filter, MapPin, UserPlus, Check,
  ShieldCheck, Building2, Users, Globe, ExternalLink
} from 'lucide-react';

const Discovery = () => {
  const [tab, setTab] = useState('people'); // 'people' | 'organisations'
  const [results, setResults] = useState([]);
  const [orgResults, setOrgResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState(null);
  const [connectedMap, setConnectedMap] = useState({});

  // People filters
  const [searchTerm, setSearchTerm] = useState('');
  const [accountType, setAccountType] = useState('all');
  const [location, setLocation] = useState('');
  const [skill, setSkill] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    if (tab === 'people') {
      handlePeopleSearch();
    } else {
      handleOrgSearch();
    }
  }, [tab, accountType, verifiedOnly]);

  const handlePeopleSearch = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const res = await searchDiscovery({ q: searchTerm, accountType, location, skill, verifiedOnly });
      if (res?.items) setResults(res.items);
    } catch (err) {
      console.error('Failed to search people:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrgSearch = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const res = await getOrganisations({ q: searchTerm, verifiedOnly });
      if (res?.organisations) setOrgResults(res.organisations);
    } catch (err) {
      console.error('Failed to search organisations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (tab === 'people') handlePeopleSearch(e);
    else handleOrgSearch(e);
  };
  const handleConnect = async (recipientId) => {
    try {
      setConnectingId(recipientId);
      await sendConnectionRequest(recipientId);
      setConnectedMap((prev) => ({ ...prev, [recipientId]: true }));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to send connection request');
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-2xl p-8 mb-8 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Search className="w-5 h-5 text-sky-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
            Finance Ecosystem Discovery
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Discover Finance Talent & Organisations
        </h1>
        <p className="mt-2 text-sky-100 text-sm max-w-xl">
          Search chartered accountants, equity analysts, individual investors, finance students, and verified institutions.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder={tab === 'people' ? 'Search by name, expertise, or role...' : 'Search organisations by name or sector...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold shadow-sm transition"
          >
            Find
          </button>
        </form>

        {/* Tab Switcher */}
        <div className="flex mt-6 border border-sky-700/40 rounded-xl overflow-hidden w-fit">
          <button
            onClick={() => setTab('people')}
            className={`px-5 py-2 text-xs font-bold flex items-center transition ${
              tab === 'people'
                ? 'bg-sky-500 text-white'
                : 'text-sky-200 hover:bg-sky-800/50'
            }`}
          >
            <Users className="w-3.5 h-3.5 mr-1.5" />
            People
          </button>
          <button
            onClick={() => setTab('organisations')}
            className={`px-5 py-2 text-xs font-bold flex items-center transition ${
              tab === 'organisations'
                ? 'bg-sky-500 text-white'
                : 'text-sky-200 hover:bg-sky-800/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 mr-1.5" />
            Organisations
          </button>
        </div>
      </div>

      {/* People filters — only shown on people tab */}
      {tab === 'people' && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 mb-8 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-gray-900 text-sm">Refine Search Criteria</h3>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
              />
              <span className="flex items-center text-sky-800">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-sky-600" />
                Verified Credentials Only
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Account Category</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:ring-sky-500 focus:border-sky-500 capitalize"
              >
                <option value="all">All Members</option>
                <option value="professional">Financial Professionals</option>
                <option value="investor">Individual Investors</option>
                <option value="student">Finance Students</option>
                <option value="finance_enthusiast">Finance Enthusiasts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Mumbai, New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Skills or Qualifications</label>
              <input
                type="text"
                placeholder="e.g. Valuation, CFA, CA"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* Org filters — only shown on organisations tab */}
      {tab === 'organisations' && (
        <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-8 shadow-xs flex items-center space-x-3">
          <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-gray-700">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
            />
            <span className="flex items-center text-sky-800">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-sky-600" />
              Verified Institutions Only
            </span>
          </label>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <PageLoader message="Searching directory..." />
      ) : tab === 'people' ? (
        results.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">No Members Match Criteria</h3>
            <p className="text-xs text-gray-400 mt-1">Try broadening your search term or clearing filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((profile) => {
              const user = profile.user;
              const isConnected = connectedMap[user?._id];
              return (
                <div
                  key={profile._id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 flex flex-col justify-between hover:border-sky-300 transition"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xl flex-shrink-0">
                        {user?.profileImage ? (
                          <img src={user.profileImage} alt={user.fullName} className="w-full h-full rounded-2xl object-cover" loading="lazy" />
                        ) : (
                          user?.fullName?.charAt(0) || 'U'
                        )}
                      </div>
                      {profile.hasVerifiedCredential && (
                        <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Verified
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">{user?.fullName}</h3>
                    <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider block mb-1">
                      {user?.accountType?.replace('_', ' ')}
                    </span>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                      {profile.headline || 'FinConnect Community Member'}
                    </p>
                    {profile.location && (
                      <p className="text-xs text-gray-400 flex items-center mb-3">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                        {profile.location}
                      </p>
                    )}
                    {profile.skills && profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {profile.skills.slice(0, 3).map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleConnect(user?._id)}
                      disabled={connectingId === user?._id || isConnected}
                      className={`w-full inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-semibold transition ${
                        isConnected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs'
                      }`}
                    >
                      {isConnected ? (
                        <><Check className="w-3.5 h-3.5 mr-1" />Request Sent</>
                      ) : (
                        <><UserPlus className="w-3.5 h-3.5 mr-1" />Connect</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        // Organisation results
        orgResults.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">No Organisations Found</h3>
            <p className="text-xs text-gray-400 mt-1">Try a different keyword or remove the verified filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orgResults.map((org) => (
              <div
                key={org._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 flex flex-col justify-between hover:border-sky-300 transition"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {org.logoUrl ? (
                        <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <Building2 className="w-7 h-7 text-sky-700" />
                      )}
                    </div>
                    {org.verificationStatus === 'verified' && (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{org.name}</h3>
                  <span className="text-xs font-semibold text-sky-700 block mb-1">{org.industry}</span>
                  <p className="text-xs text-gray-500 line-clamp-3 mb-3 leading-relaxed">
                    {org.description || 'No description provided.'}
                  </p>
                  {org.headquarters && (
                    <p className="text-xs text-gray-400 flex items-center mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {org.headquarters}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {org.memberCount || 1} FinConnect members
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <Link
                    to={`/organisations/${org._id}`}
                    className="w-full inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-semibold bg-gray-50 hover:bg-sky-50 text-sky-700 border border-gray-200 transition"
                  >
                    View Profile
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Discovery;

