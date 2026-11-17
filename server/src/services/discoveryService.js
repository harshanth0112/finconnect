const User = require('../models/User');
const Profile = require('../models/Profile');
const Credential = require('../models/Credential');

/**
 * Search users, professionals, and students with filter criteria
 */
const searchUsers = async ({
  q,
  accountType,
  location,
  skill,
  verifiedOnly,
  page = 1,
  limit = 12
}) => {
  const skip = (page - 1) * limit;

  // Build query for User collection
  const userQuery = { status: 'active' };

  if (accountType && accountType !== 'all') {
    userQuery.accountType = accountType;
  }

  if (q && q.trim()) {
    userQuery.$or = [
      { fullName: { $regex: q.trim(), $options: 'i' } },
      { email: { $regex: q.trim(), $options: 'i' } }
    ];
  }

  // Find matching users first
  const users = await User.find(userQuery).select('fullName email accountType role profileImage');
  const userIds = users.map((u) => u._id);

  // Build query for Profile collection
  const profileQuery = { user: { $in: userIds } };

  if (location && location.trim()) {
    profileQuery.location = { $regex: location.trim(), $options: 'i' };
  }

  if (skill && skill.trim()) {
    profileQuery.$or = [
      { skills: { $regex: skill.trim(), $options: 'i' } },
      { financeInterests: { $regex: skill.trim(), $options: 'i' } },
      { qualifications: { $regex: skill.trim(), $options: 'i' } }
    ];
  }

  const profiles = await Profile.find(profileQuery)
    .populate('user', 'fullName email accountType role profileImage emailVerified')
    .skip(skip)
    .limit(limit);

  const total = await Profile.countDocuments(profileQuery);

  // If verifiedOnly requested, filter by verified credentials
  const profileUserIds = profiles.map((p) => p.user?._id).filter(Boolean);
  const verifiedCredentials = await Credential.find({
    user: { $in: profileUserIds },
    verificationStatus: 'verified'
  });

  const verifiedUserSet = new Set(verifiedCredentials.map((c) => c.user.toString()));

  const items = profiles
    .map((p) => {
      const obj = p.toObject();
      obj.hasVerifiedCredential = verifiedUserSet.has(p.user?._id?.toString());
      return obj;
    })
    .filter((item) => {
      if (verifiedOnly === 'true' || verifiedOnly === true) {
        return item.hasVerifiedCredential;
      }
      return true;
    });

  return {
    items,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

module.exports = {
  searchUsers
};

