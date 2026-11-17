const User = require('../models/User');
const Profile = require('../models/Profile');

/**
 * Synchronize Firebase user with MongoDB database
 */
const syncUser = async ({ firebaseUid, email, fullName, accountType, profileImage, emailVerified }) => {
  let user = await User.findOne({ firebaseUid });

  const validAccountTypes = ['student', 'investor', 'finance_enthusiast', 'professional'];
  const sanitizedAccountType = validAccountTypes.includes(accountType) ? accountType : 'finance_enthusiast';

  if (!user) {
    // Create new MongoDB user
    user = new User({
      firebaseUid,
      email: email.toLowerCase().trim(),
      fullName: fullName || email.split('@')[0],
      accountType: sanitizedAccountType,
      role: 'user', // Default role is strictly 'user'. Admins cannot self-assign via sync.
      emailVerified: Boolean(emailVerified),
      profileImage: profileImage || '',
      lastLogin: new Date()
    });

    await user.save();

    // Create corresponding empty Profile
    const profile = new Profile({
      user: user._id,
      firebaseUid: user.firebaseUid
    });
    await profile.save();
  } else {
    // Update existing user details
    user.lastLogin = new Date();
    if (emailVerified !== undefined) user.emailVerified = Boolean(emailVerified);
    if (fullName) user.fullName = fullName;
    if (profileImage) user.profileImage = profileImage;
    await user.save();
  }

  // Populate profile info
  const profile = await Profile.findOne({ user: user._id });

  return { user, profile };
};

/**
 * Get current user profile by Firebase UID or MongoDB ID
 */
const getCurrentUser = async (firebaseUid) => {
  const user = await User.findOne({ firebaseUid });
  if (!user) return null;

  const profile = await Profile.findOne({ user: user._id });
  return { user, profile };
};

module.exports = {
  syncUser,
  getCurrentUser
};

