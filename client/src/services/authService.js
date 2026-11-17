import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from '../config/firebase';
import api from './api';

/**
 * Register a new user with Firebase, then sync with MongoDB backend
 */
export const registerWithEmail = async ({ email, password, fullName, accountType }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update display name in Firebase
  if (fullName) {
    await updateProfile(user, { displayName: fullName });
  }

  // Send verification email
  try {
    await sendEmailVerification(user);
  } catch (err) {
    console.warn('[authService] Failed to send email verification:', err);
  }

  // Sync user with backend
  const syncResponse = await api.post('/auth/sync', {
    fullName,
    accountType
  });

  return {
    firebaseUser: user,
    dbData: syncResponse.data?.data
  };
};

/**
 * Login with Email and Password
 */
export const loginWithEmail = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Sync / update last login on backend
  const syncResponse = await api.post('/auth/sync', {});

  return {
    firebaseUser: user,
    dbData: syncResponse.data?.data
  };
};

/**
 * Login or Sign Up with Google
 */
export const loginWithGoogle = async (accountType = 'finance_enthusiast') => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Sync user with backend
  const syncResponse = await api.post('/auth/sync', {
    fullName: user.displayName,
    accountType: accountType,
    profileImage: user.photoURL
  });

  return {
    firebaseUser: user,
    dbData: syncResponse.data?.data
  };
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

/**
 * Resend email verification
 */
export const resendVerificationEmail = async () => {
  if (auth.currentUser) {
    return await sendEmailVerification(auth.currentUser);
  }
  throw new Error('No user is currently signed in');
};

/**
 * Log out
 */
export const logout = async () => {
  return await firebaseSignOut(auth);
};

/**
 * Fetch current user from backend
 */
export const fetchCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data?.data;
};

