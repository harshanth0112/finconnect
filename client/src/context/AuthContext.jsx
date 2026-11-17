import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logout as authLogout,
  resetPassword,
  resendVerificationEmail,
  fetchCurrentUser
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // MongoDB user document
  const [currentProfile, setCurrentProfile] = useState(null); // MongoDB profile document
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Synchronize on authentication state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const data = await fetchCurrentUser();
          if (data) {
            setCurrentUser(data.user);
            setCurrentProfile(data.profile);
          }
        } catch (err) {
          console.warn('[AuthContext] Backend sync pending or failed:', err.message);
        }
      } else {
        setCurrentUser(null);
        setCurrentProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (params) => {
    setError(null);
    try {
      const res = await registerWithEmail(params);
      if (res.dbData) {
        setCurrentUser(res.dbData.user);
        setCurrentProfile(res.dbData.profile);
      }
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (params) => {
    setError(null);
    try {
      const res = await loginWithEmail(params);
      if (res.dbData) {
        setCurrentUser(res.dbData.user);
        setCurrentProfile(res.dbData.profile);
      }
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signInGoogle = async (accountType) => {
    setError(null);
    try {
      const res = await loginWithGoogle(accountType);
      if (res.dbData) {
        setCurrentUser(res.dbData.user);
        setCurrentProfile(res.dbData.profile);
      }
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await authLogout();
      setFirebaseUser(null);
      setCurrentUser(null);
      setCurrentProfile(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    setError(null);
    try {
      return await resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resendVerification = async () => {
    setError(null);
    try {
      return await resendVerificationEmail();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    firebaseUser,
    currentUser,
    currentProfile,
    loading,
    error,
    isAuthenticated: !!firebaseUser,
    isAdmin: currentUser?.role === 'admin',
    accountType: currentUser?.accountType,
    register,
    login,
    signInGoogle,
    logout,
    forgotPassword,
    resendVerification
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

