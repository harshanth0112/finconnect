const Profile = require('../models/Profile');
const User = require('../models/User');

/**
 * Get profile for the authenticated user
 */
const getMyProfile = async (userId, firebaseUid) => {
  let profile = await Profile.findOne({ user: userId }).populate('user', 'fullName email accountType role profileImage emailVerified status createdAt');
  if (!profile) {
    profile = await Profile.create({
      user: userId,
      firebaseUid: firebaseUid
    });
    profile = await profile.populate('user', 'fullName email accountType role profileImage emailVerified status createdAt');
  }
  return profile;
};

/**
 * Update authenticated user's profile and user basics
 */
const updateMyProfile = async (userId, updateData) => {
  const {
    fullName,
    profileImage,
    headline,
    bio,
    location,
    education,
    experience,
    skills,
    financeInterests,
    qualifications,
    certifications
  } = updateData;

  // 1. Update basic user info if provided
  if (fullName || profileImage !== undefined) {
    const userUpdates = {};
    if (fullName) userUpdates.fullName = fullName;
    if (profileImage !== undefined) userUpdates.profileImage = profileImage;
    await User.findByIdAndUpdate(userId, userUpdates);
  }

  // 2. Update profile fields
  const profileFields = {};
  if (headline !== undefined) profileFields.headline = headline;
  if (bio !== undefined) profileFields.bio = bio;
  if (location !== undefined) profileFields.location = location;
  if (education !== undefined) profileFields.education = education;
  if (experience !== undefined) profileFields.experience = experience;
  if (skills !== undefined) profileFields.skills = skills;
  if (financeInterests !== undefined) profileFields.financeInterests = financeInterests;
  if (qualifications !== undefined) profileFields.qualifications = qualifications;
  if (certifications !== undefined) profileFields.certifications = certifications;

  const updatedProfile = await Profile.findOneAndUpdate(
    { user: userId },
    { $set: profileFields },
    { new: true, runValidators: true }
  ).populate('user', 'fullName email accountType role profileImage emailVerified status createdAt');

  return updatedProfile;
};

/**
 * Get public profile by user ID or profile ID
 */
const getProfileById = async (identifier) => {
  let profile = await Profile.findOne({
    $or: [{ _id: identifier }, { user: identifier }]
  }).populate('user', 'fullName email accountType role profileImage emailVerified status createdAt');

  return profile;
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getProfileById
};

