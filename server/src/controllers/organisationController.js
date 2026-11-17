const organisationService = require('../services/organisationService');

/**
 * POST /api/v1/organisations
 */
const create = async (req, res) => {
  try {
    const organisation = await organisationService.createOrganisation(req.user._id, req.body);
    return res.status(201).json({
      success: true,
      data: organisation
    });
  } catch (error) {
    console.error('[OrganisationController.create] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create organisation'
    });
  }
};

/**
 * GET /api/v1/organisations
 */
const getAll = async (req, res) => {
  try {
    const { q, industry, verifiedOnly, page, limit } = req.query;
    const result = await organisationService.getOrganisations({
      q,
      industry,
      verifiedOnly,
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[OrganisationController.getAll] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve organisations',
      error: error.message
    });
  }
};

/**
 * GET /api/v1/organisations/:id
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await organisationService.getOrganisationDetails(id);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[OrganisationController.getById] Error:', error);
    return res.status(404).json({
      success: false,
      message: error.message || 'Organisation not found'
    });
  }
};

/**
 * PUT /api/v1/organisations/:id
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const organisation = await organisationService.updateOrganisation(
      id,
      req.user._id,
      req.user.role,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: organisation
    });
  } catch (error) {
    console.error('[OrganisationController.update] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update organisation'
    });
  }
};

/**
 * POST /api/v1/organisations/:id/members
 */
const joinOrAddMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role, title } = req.body;
    const targetUser = userId || req.user._id;

    const member = await organisationService.addMember(id, targetUser, { role, title });

    return res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('[OrganisationController.joinOrAddMember] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to add member'
    });
  }
};

/**
 * PATCH /api/v1/organisations/:id/verify (Admin Only)
 */
const reviewVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await organisationService.reviewOrganisationVerification(id, { status });

    return res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('[OrganisationController.reviewVerification] Error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to verify organisation'
    });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  joinOrAddMember,
  reviewVerification
};

