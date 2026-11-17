const Organisation = require('../models/Organisation');
const OrganisationMember = require('../models/OrganisationMember');
const User = require('../models/User');

/**
 * Create a new organisation
 */
const createOrganisation = async (userId, data) => {
  const {
    name,
    tagline,
    description,
    logoUrl,
    website,
    industry,
    companySize,
    headquarters,
    foundedYear,
    registrationNumber,
    registrationAuthority,
    documentUrl
  } = data;

  if (!name || !name.trim()) {
    throw new Error('Organisation name is required');
  }

  const organisation = await Organisation.create({
    name: name.trim(),
    tagline: tagline || '',
    description: description || '',
    logoUrl: logoUrl || '',
    website: website || '',
    industry: industry || 'Other',
    companySize: companySize || '1-10',
    headquarters: headquarters || '',
    foundedYear: foundedYear ? Number(foundedYear) : undefined,
    registrationNumber: registrationNumber || '',
    registrationAuthority: registrationAuthority || '',
    documentUrl: documentUrl || '',
    verificationStatus: documentUrl ? 'pending' : 'unverified',
    createdBy: userId,
    memberCount: 1
  });

  // Creator automatically joins as an admin member
  await OrganisationMember.create({
    organisation: organisation._id,
    user: userId,
    role: 'admin',
    title: 'Founder / Administrator'
  });

  return organisation;
};

/**
 * Get all organisations with optional search and filters
 */
const getOrganisations = async ({ q, industry, verifiedOnly, page = 1, limit = 12 } = {}) => {
  const query = {};

  if (q && q.trim()) {
    query.$or = [
      { name: { $regex: q.trim(), $options: 'i' } },
      { tagline: { $regex: q.trim(), $options: 'i' } },
      { description: { $regex: q.trim(), $options: 'i' } }
    ];
  }

  if (industry && industry !== 'all') {
    query.industry = industry;
  }

  if (verifiedOnly === 'true' || verifiedOnly === true) {
    query.verificationStatus = 'verified';
  }

  const skip = (page - 1) * limit;

  const organisations = await Organisation.find(query)
    .populate('createdBy', 'fullName email profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Organisation.countDocuments(query);

  return {
    organisations,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get organisation by ID or slug with members
 */
const getOrganisationDetails = async (idOrSlug) => {
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

  const organisation = await Organisation.findOne(query).populate('createdBy', 'fullName email profileImage');
  if (!organisation) {
    throw new Error('Organisation not found');
  }

  const members = await OrganisationMember.find({ organisation: organisation._id })
    .populate('user', 'fullName email profileImage accountType')
    .sort({ createdAt: 1 });

  return {
    organisation,
    members
  };
};

/**
 * Update organisation details (Only admin or platform admin)
 */
const updateOrganisation = async (organisationId, userId, userRole, data) => {
  const organisation = await Organisation.findById(organisationId);
  if (!organisation) {
    throw new Error('Organisation not found');
  }

  // Check if current user is an admin of this organisation or a platform admin
  const isOrgAdmin = await OrganisationMember.findOne({
    organisation: organisationId,
    user: userId,
    role: 'admin'
  });

  if (!isOrgAdmin && userRole !== 'admin') {
    throw new Error('Unauthorized: only organisation admins can update organisation details');
  }

  const allowedFields = [
    'name',
    'tagline',
    'description',
    'logoUrl',
    'website',
    'industry',
    'companySize',
    'headquarters',
    'foundedYear',
    'registrationNumber',
    'registrationAuthority',
    'documentUrl'
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      organisation[field] = data[field];
    }
  });

  // If new registration document submitted, set verificationStatus to pending
  if (data.documentUrl && organisation.verificationStatus === 'unverified') {
    organisation.verificationStatus = 'pending';
  }

  await organisation.save();
  return organisation;
};

/**
 * Add or join member to organisation
 */
const addMember = async (organisationId, targetUserId, { role = 'member', title = 'Team Member' } = {}) => {
  const organisation = await Organisation.findById(organisationId);
  if (!organisation) throw new Error('Organisation not found');

  const existing = await OrganisationMember.findOne({ organisation: organisationId, user: targetUserId });
  if (existing) {
    throw new Error('User is already a member of this organisation');
  }

  const member = await OrganisationMember.create({
    organisation: organisationId,
    user: targetUserId,
    role,
    title
  });

  await Organisation.findByIdAndUpdate(organisationId, { $inc: { memberCount: 1 } });

  return await member.populate('user', 'fullName email profileImage accountType');
};

/**
 * Review organisation verification (Platform Admin only)
 */
const reviewOrganisationVerification = async (organisationId, { status }) => {
  const valid = ['verified', 'rejected', 'pending', 'unverified'];
  if (!valid.includes(status)) throw new Error('Invalid verification status');

  const organisation = await Organisation.findById(organisationId);
  if (!organisation) throw new Error('Organisation not found');

  organisation.verificationStatus = status;
  organisation.verifiedBadgeIssued = status === 'verified';
  organisation.verifiedAt = status === 'verified' ? new Date() : null;
  await organisation.save();

  return organisation;
};

module.exports = {
  createOrganisation,
  getOrganisations,
  getOrganisationDetails,
  updateOrganisation,
  addMember,
  reviewOrganisationVerification
};

