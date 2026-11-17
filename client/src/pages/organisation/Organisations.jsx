import React, { useState, useEffect } from 'react';
import { getOrganisations, createOrganisation } from '../../services/organisationService';
import { Link } from 'react-router-dom';
import {
  Building2,
  Search,
  Plus,
  ShieldCheck,
  Globe,
  MapPin,
  Users,
  Calendar,
  X,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import PageLoader from '../../lazy/PageLoader';

const Organisations = () => {
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    logoUrl: '',
    website: '',
    industry: 'Asset Management',
    companySize: '11-50',
    headquarters: '',
    foundedYear: '',
    registrationNumber: '',
    registrationAuthority: '',
    documentUrl: ''
  });

  const industries = [
    'Investment Banking',
    'Asset Management',
    'Wealth Advisory',
    'Fintech',
    'Commercial Banking',
    'Insurance',
    'Audit & Accounting',
    'Credit Rating',
    'Education & Research',
    'Other'
  ];

  const fetchOrgs = async () => {
    try {
      setLoading(true);
      const res = await getOrganisations({
        q: searchQuery,
        industry: selectedIndustry,
        verifiedOnly
      });
      if (res?.organisations) {
        setOrganisations(res.organisations);
      }
    } catch (err) {
      console.error('Failed to load organisations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, [selectedIndustry, verifiedOnly]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrgs();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setCreating(true);
      await createOrganisation(formData);
      setShowModal(false);
      setFormData({
        name: '',
        tagline: '',
        description: '',
        logoUrl: '',
        website: '',
        industry: 'Asset Management',
        companySize: '11-50',
        headquarters: '',
        foundedYear: '',
        registrationNumber: '',
        registrationAuthority: '',
        documentUrl: ''
      });
      fetchOrgs();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to create organisation');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-2xl p-8 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
              Corporate & Institution Network
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Financial Organisations
          </h1>
          <p className="mt-2 text-sky-100 text-sm max-w-xl">
            Explore verified asset management firms, investment banks, wealth managers, and fintech leaders.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-5 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Organisation
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 mb-8 shadow-xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies by name or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <label className="text-xs font-bold text-gray-600">Industry:</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700"
            >
              <option value="all">All Industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
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
              Verified Organisations Only
            </span>
          </label>
        </div>
      </div>

      {/* Organisation Cards Grid */}
      {loading ? (
        <PageLoader message="Loading financial organisations..." />
      ) : organisations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700 text-sm">No Organisations Found</h3>
          <p className="text-xs text-gray-400 mt-1">
            Be the first to establish your company or institution profile on FinConnect.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organisations.map((org) => (
            <div
              key={org._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 flex flex-col justify-between hover:border-sky-300 transition"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xl flex-shrink-0 overflow-hidden">
                    {org.logoUrl ? (
                      <img
                        src={org.logoUrl}
                        alt={org.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Building2 className="w-7 h-7 text-sky-700" />
                    )}
                  </div>

                  {org.verificationStatus === 'verified' && (
                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                      Verified Org
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-base">{org.name}</h3>
                <span className="text-xs font-semibold text-sky-700 block mb-1">
                  {org.industry}
                </span>

                {org.tagline && (
                  <p className="text-xs text-gray-600 italic line-clamp-1 mb-2">{org.tagline}</p>
                )}

                <p className="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                  {org.description || 'No formal description provided.'}
                </p>

                <div className="space-y-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3">
                  {org.headquarters && (
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{org.headquarters}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                    <span>{org.memberCount || 1} members ({org.companySize} employees)</span>
                  </div>
                  {org.website && (
                    <div className="flex items-center">
                      <Globe className="w-3.5 h-3.5 mr-1.5 text-sky-600 flex-shrink-0" />
                      <a
                        href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-600 hover:underline truncate"
                      >
                        {org.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <Link
                  to={`/organisations/${org._id}`}
                  className="w-full inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-semibold bg-gray-50 hover:bg-sky-50 text-sky-700 border border-gray-200 transition"
                >
                  View Public Profile
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Organisation */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="w-5 h-5 text-sky-600" />
              <h3 className="text-lg font-bold text-gray-900">Establish Organisation</h3>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Organisation Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Wealth Management"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Delivering alpha with disciplined quantitative research"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl"
                  >
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Company Size</label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl"
                  >
                    {['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'].map((sz) => (
                      <option key={sz} value={sz}>
                        {sz} employees
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Headquarters
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, India"
                    value={formData.headquarters}
                    onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    placeholder="https://company.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Provide an overview of the firm's financial services and background..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  {creating ? 'Creating...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organisations;

