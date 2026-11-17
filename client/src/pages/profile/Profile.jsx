import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../../services/profileService';
import PageLoader from '../../lazy/PageLoader';
import { 
  User, Briefcase, GraduationCap, MapPin, Award, 
  CheckCircle, Edit3, Plus, Trash2, Save, X, ExternalLink
} from 'lucide-react';

const Profile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Edit form state
  const [formData, setFormData] = useState({
    fullName: '',
    headline: '',
    bio: '',
    location: '',
    skills: '',
    financeInterests: '',
    qualifications: '',
    experience: [],
    education: [],
    certifications: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data);
      if (data) {
        setFormData({
          fullName: data.user?.fullName || '',
          headline: data.headline || '',
          bio: data.bio || '',
          location: data.location || '',
          skills: data.skills?.join(', ') || '',
          financeInterests: data.financeInterests?.join(', ') || '',
          qualifications: data.qualifications?.join(', ') || '',
          experience: data.experience || [],
          education: data.education || [],
          certifications: data.certifications || []
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        fullName: formData.fullName,
        headline: formData.headline,
        bio: formData.bio,
        location: formData.location,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        financeInterests: formData.financeInterests.split(',').map((s) => s.trim()).filter(Boolean),
        qualifications: formData.qualifications.split(',').map((s) => s.trim()).filter(Boolean),
        experience: formData.experience,
        education: formData.education,
        certifications: formData.certifications
      };

      const updated = await updateMyProfile(payload);
      setProfile(updated);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile successfully updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  // Helper methods to add empty entries
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { company: '', position: '', location: '', description: '', current: true }
      ]
    });
  };

  const removeExperience = (index) => {
    const updated = [...formData.experience];
    updated.splice(index, 1);
    setFormData({ ...formData, experience: updated });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { institution: '', degree: '', fieldOfStudy: '', current: false }
      ]
    });
  };

  const removeEducation = (index) => {
    const updated = [...formData.education];
    updated.splice(index, 1);
    setFormData({ ...formData, education: updated });
  };

  if (loading) {
    return <PageLoader message="Loading professional profile..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-sky-800 via-sky-700 to-indigo-900" />
        <div className="px-6 sm:px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-12 mb-6">
            <div className="flex items-end space-x-5">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md border border-gray-200 flex-shrink-0">
                {profile?.user?.profileImage ? (
                  <img
                    src={profile.user.profileImage}
                    alt={profile.user.fullName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-sky-100 text-sky-800 rounded-xl flex items-center justify-center font-bold text-2xl">
                    {profile?.user?.fullName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-900">{profile?.user?.fullName}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 capitalize">
                    {profile?.user?.accountType?.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600 mt-1">
                  {profile?.headline || 'No headline set yet'}
                </p>
                {profile?.location && (
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {profile.location}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 sm:mt-0 flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-xs transition"
                >
                  <Edit3 className="w-4 h-4 mr-2 text-gray-500" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-xs transition"
                >
                  <X className="w-4 h-4 mr-2 text-gray-500" />
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Followers / Following Stats */}
          <div className="flex space-x-6 text-sm border-t border-gray-100 pt-4">
            <div>
              <span className="font-bold text-gray-900">{profile?.connectionsCount || 0}</span>{' '}
              <span className="text-gray-500">Connections</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">{profile?.followersCount || 0}</span>{' '}
              <span className="text-gray-500">Followers</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">{profile?.followingCount || 0}</span>{' '}
              <span className="text-gray-500">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editing Form OR Viewing Section */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Details Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Headline</label>
              <input
                type="text"
                placeholder="e.g. Portfolio Manager at Alpha Capital | CFA Charterholder"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                placeholder="e.g. Mumbai, India or New York, NY"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">About / Bio</label>
              <textarea
                rows={4}
                placeholder="Write a brief overview of your finance experience, philosophy, and focus areas..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Categorized Tags */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Expertise & Interests</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
              <input
                type="text"
                placeholder="Financial Modeling, Valuation, Equity Research, Python"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Finance Interests (comma-separated)</label>
              <input
                type="text"
                placeholder="Value Investing, Derivatives, ESG, Fixed Income"
                value={formData.financeInterests}
                onChange={(e) => setFormData({ ...formData, financeInterests: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Qualifications (comma-separated)</label>
              <input
                type="text"
                placeholder="CFA, CA, MBA Finance, FRM"
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Professional Experience Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Professional Experience</h2>
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Position
              </button>
            </div>

            {formData.experience.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeExperience(idx)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const copy = [...formData.experience];
                        copy[idx].company = e.target.value;
                        setFormData({ ...formData, experience: copy });
                      }}
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                      placeholder="Goldman Sachs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Position / Title</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => {
                        const copy = [...formData.experience];
                        copy[idx].position = e.target.value;
                        setFormData({ ...formData, experience: copy });
                      }}
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                      placeholder="Senior Equity Analyst"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">Description</label>
                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={(e) => {
                      const copy = [...formData.experience];
                      copy[idx].description = e.target.value;
                      setFormData({ ...formData, experience: copy });
                    }}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    placeholder="Focus areas, portfolio coverage, key contributions..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Education Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Education</h2>
              <button
                type="button"
                onClick={addEducation}
                className="inline-flex items-center text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Degree
              </button>
            </div>

            {formData.education.map((edu, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Institution / University</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const copy = [...formData.education];
                        copy[idx].institution = e.target.value;
                        setFormData({ ...formData, education: copy });
                      }}
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                      placeholder="London School of Economics"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Degree & Field</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const copy = [...formData.education];
                        copy[idx].degree = e.target.value;
                        setFormData({ ...formData, education: copy });
                      }}
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                      placeholder="B.Sc. in Accounting & Finance"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      ) : (
        /* Read-Only Profile View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h2 className="text-base font-bold text-gray-900 mb-3">About</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {profile?.bio || 'Add a bio to highlight your finance journey, market approach, or background.'}
              </p>
            </div>

            {/* Experience Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-sky-600" />
                Professional Experience
              </h2>
              {profile?.experience && profile.experience.length > 0 ? (
                <div className="space-y-6">
                  {profile.experience.map((exp, idx) => (
                    <div key={idx} className="border-l-2 border-sky-600 pl-4 space-y-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{exp.position}</h3>
                      <p className="text-xs font-medium text-sky-700">{exp.company}</p>
                      {exp.description && (
                        <p className="text-xs text-gray-600 mt-2">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No experience added yet.</p>
              )}
            </div>

            {/* Education Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2 text-sky-600" />
                Education
              </h2>
              {profile?.education && profile.education.length > 0 ? (
                <div className="space-y-4">
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="border-l-2 border-gray-200 pl-4 space-y-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{edu.institution}</h3>
                      <p className="text-xs text-gray-600">{edu.degree}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No education entries added yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider text-xs text-gray-500">
                Skills & Capabilities
              </h2>
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No skills listed</p>
              )}
            </div>

            {/* Finance Interests */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider text-xs text-gray-500">
                Finance Interests
              </h2>
              {profile?.financeInterests && profile.financeInterests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.financeInterests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-sky-50 text-sky-700 rounded-md text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No interests listed</p>
              )}
            </div>

            {/* Qualifications */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider text-xs text-gray-500">
                Qualifications
              </h2>
              {profile?.qualifications && profile.qualifications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.qualifications.map((qual, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md text-xs font-semibold"
                    >
                      {qual}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No qualifications listed</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

