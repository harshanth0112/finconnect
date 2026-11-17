import React, { useState, useEffect } from 'react';
import { getMyVerifications, submitVerification } from '../../services/verificationService';
import PageLoader from '../../lazy/PageLoader';
import { 
  Award, ShieldCheck, Clock, CheckCircle2, XCircle, 
  AlertCircle, Plus, FileText, Upload, HelpCircle, X
} from 'lucide-react';

const authorities = [
  'SEBI', 'AMFI', 'IRDAI', 'PFRDA', 'RBI', 
  'MCA', 'ICAI', 'ICSI', 'ICMAI', 'NISM', 
  'CFA Institute', 'UGC', 'AICTE', 'Other'
];

const VerificationCenter = () => {
  const [data, setData] = useState({ credentials: [], verifications: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    authority: 'SEBI',
    title: '',
    credentialNumber: '',
    issueDate: '',
    expiryDate: '',
    documentUrl: '',
    documentType: 'certificate',
    remarks: ''
  });

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const res = await getMyVerifications();
      if (res) setData(res);
    } catch (err) {
      console.error('Failed to load verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await submitVerification(formData);
      setMessage({
        type: 'success',
        text: 'Credential application submitted successfully for review.'
      });
      setShowModal(false);
      setFormData({
        authority: 'SEBI',
        title: '',
        credentialNumber: '',
        issueDate: '',
        expiryDate: '',
        documentUrl: '',
        documentType: 'certificate',
        remarks: ''
      });
      await loadVerifications();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Submission failed'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
      case 'approved':
        return (
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Verified Badge Issued
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Under Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" />
            Application Rejected
          </span>
        );
      case 'more_info_required':
        return (
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <AlertCircle className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Information Requested
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  if (loading) return <PageLoader message="Loading verification records..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-2xl p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                Official Credential Verification
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Finance Credential Badges
            </h1>
            <p className="mt-2 text-sky-100 text-sm max-w-xl">
              Establish platform trust and credibility. Submit your regulatory certificates (SEBI, AMFI, ICAI, CFA Institute) for manual review and earn a verified credential badge on your FinConnect profile.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit Credential
            </button>
          </div>
        </div>
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

      {/* Disclaimers */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-xs text-amber-800 flex items-start space-x-3">
        <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Compliance Notice:</strong> A FinConnect verified badge indicates administrative review of submitted records and certifications. It does not constitute a government or regulatory endorsement, nor does it represent individualized financial advice.
        </div>
      </div>

      {/* Credentials List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-gray-900 text-base">Your Submitted Credentials</h2>
          <span className="text-xs text-gray-500">{data.credentials.length} Records</span>
        </div>

        {data.credentials.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-800">No Credentials Submitted</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
              Submit your charter, license, or certification numbers to initiate administrative verification.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Submit Now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.credentials.map((cred) => (
              <div key={cred._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">
                      {cred.authority}
                    </span>
                    <h3 className="font-semibold text-gray-900 text-sm">{cred.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500">
                    Registration / License No: <span className="font-mono text-gray-700 font-medium">{cred.credentialNumber}</span>
                  </p>
                  {cred.issueDate && (
                    <p className="text-xs text-gray-400">
                      Issued: {new Date(cred.issueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="mt-4 sm:mt-0 flex items-center">
                  {getStatusBadge(cred.verificationStatus)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Submit Credential for Review</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Issuing Authority</label>
                <select
                  value={formData.authority}
                  onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500"
                >
                  {authorities.map((auth) => (
                    <option key={auth} value={auth}>
                      {auth}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Credential Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Registered Investment Advisor (RIA) or CA Member"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Registration / License / Roll No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. INA000012345 or ICAI-554432"
                  value={formData.credentialNumber}
                  onChange={(e) => setFormData({ ...formData, credentialNumber: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">Issue Date</label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Supporting Document URL / Proof</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/certificate.pdf"
                  value={formData.documentUrl}
                  onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <span className="text-[11px] text-gray-400 mt-0.5 block">
                  Link to certificate, public roster listing, or Cloudinary scan.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Remarks for Administrator</label>
                <textarea
                  rows={2}
                  placeholder="Additional context or public lookup register details..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationCenter;

