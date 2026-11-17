import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, AlertCircle, CheckCircle, GraduationCap, TrendingUp, Sparkles, Briefcase } from 'lucide-react';

const accountTypes = [
  {
    id: 'student',
    title: 'Student',
    desc: 'Aspiring finance learner looking for guidance and career opportunities.',
    icon: GraduationCap
  },
  {
    id: 'investor',
    title: 'Individual Investor',
    desc: 'Retail or angel investor seeking market insights and verified analysis.',
    icon: TrendingUp
  },
  {
    id: 'finance_enthusiast',
    title: 'Finance Enthusiast',
    desc: 'Passionate about economics, markets, and financial discourse.',
    icon: Sparkles
  },
  {
    id: 'professional',
    title: 'Financial Professional',
    desc: 'Chartered accountant, analyst, advisor, or registered practitioner.',
    icon: Briefcase
  }
];

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('finance_enthusiast');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, signInGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        email,
        password,
        fullName,
        accountType
      });
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await signInGoogle(accountType);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sign up with Google');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Join FinConnect
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Discover. Verify. Evaluate. Connect with finance peers and institutions.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-start p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Account Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Your Financial Identity
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {accountTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = accountType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setAccountType(type.id)}
                    className={`p-3.5 text-left border rounded-lg transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/50 ring-1 ring-sky-600'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-600' : 'text-gray-500'}`} />
                      <span className={`text-sm font-semibold ${isSelected ? 'text-sky-900' : 'text-gray-800'}`}>
                        {type.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 leading-snug">{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-sm"
                  placeholder="Warren Buffett"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-sm"
                  placeholder="warren@berkshire.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-sm"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or register with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 transition"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign up with Google
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

