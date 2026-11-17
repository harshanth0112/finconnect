import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrganisationById, joinOrganisation } from '../../services/organisationService';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  ShieldCheck,
  Calendar,
  ExternalLink,
  UserPlus,
  ArrowLeft,
  Check
} from 'lucide-react';
import PageLoader from '../../lazy/PageLoader';

const OrganisationDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        setLoading(true);
        const result = await getOrganisationById(id);
        setData(result);
        if (result?.members?.some((m) => m.user?._id === currentUser?._id)) {
          setHasJoined(true);
        }
      } catch (err) {
        console.error('Failed to load organisation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrg();
  }, [id, currentUser]);

  const handleJoin = async () => {
    try {
      setJoining(true);
      await joinOrganisation(id);
      setHasJoined(true);
      const updated = await getOrganisationById(id);
      setData(updated);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to join organisation');
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <PageLoader message="Loading organisation profile..." />;
  if (!data?.organisation) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-gray-500">
        <h2 className="text-xl font-bold">Organisation Not Found</h2>
        <Link to="/organisations" className="text-sky-600 hover:underline text-sm mt-2 inline-block">
          Return to Organisation Directory
        </Link>
      </div>
    );
  }

  const { organisation, members } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/organisations"
        className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-sky-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Organisations
      </Link>

      {/* Header Banner Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-sky-800 to-slate-900" />
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-14 mb-4 gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
              {organisation.logoUrl ? (
                <img
                  src={organisation.logoUrl}
                  alt={organisation.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-sky-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-sky-700" />
                </div>
              )}
            </div>

            <div>
              {!hasJoined ? (
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  {joining ? 'Joining...' : 'Join Organisation'}
                </button>
              ) : (
                <span className="inline-flex items-center px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                  <Check className="w-4 h-4 mr-1 text-emerald-600" />
                  You are a Member
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-gray-900">{organisation.name}</h1>
            {organisation.verificationStatus === 'verified' && (
              <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Verified Institution
              </span>
            )}
          </div>

          <p className="text-xs font-semibold text-sky-700 mt-0.5">{organisation.industry}</p>

          {organisation.tagline && (
            <p className="text-xs text-gray-600 italic mt-2">{organisation.tagline}</p>
          )}

          {/* Quick Meta */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
            {organisation.headquarters && (
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                {organisation.headquarters}
              </span>
            )}
            <span className="flex items-center">
              <Users className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {organisation.companySize} employees ({members?.length || 1} on FinConnect)
            </span>
            {organisation.website && (
              <a
                href={organisation.website.startsWith('http') ? organisation.website : `https://${organisation.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center text-sky-600 hover:underline"
              >
                <Globe className="w-3.5 h-3.5 mr-1" />
                {organisation.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: About Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <h3 className="font-bold text-gray-900 text-sm mb-3">About the Organisation</h3>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
              {organisation.description || 'No detailed overview has been published yet.'}
            </p>
          </div>

          {/* Verification Credentials / Registration Records */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Corporate Registration & Credential Record</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px] mb-0.5">Registration Authority</span>
                <span className="font-semibold text-gray-800">
                  {organisation.registrationAuthority || 'Self-declared corporate entity'}
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 block text-[11px] mb-0.5">Verification Status</span>
                <span className="font-semibold capitalize text-gray-800">
                  {organisation.verificationStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Organisation Members */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs h-fit">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center justify-between">
            <span>Members & Leadership</span>
            <span className="text-xs font-normal text-gray-400">{members?.length || 0}</span>
          </h3>

          <div className="divide-y divide-gray-100">
            {members && members.length > 0 ? (
              members.map((m) => (
                <div key={m._id} className="py-3 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden">
                    {m.user?.profileImage ? (
                      <img src={m.user.profileImage} alt={m.user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      m.user?.fullName?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{m.user?.fullName}</h4>
                    <p className="text-[11px] text-gray-500 truncate">{m.title}</p>
                  </div>
                  {m.role === 'admin' && (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      Admin
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-3">No members listed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganisationDetails;

