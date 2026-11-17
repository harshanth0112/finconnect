const discoveryService = require('../services/discoveryService');

/**
 * GET /api/v1/users/discovery
 */
const discoverUsers = async (req, res) => {
  try {
    const { q, accountType, location, skill, verifiedOnly, page, limit } = req.query;
    const result = await discoveryService.searchUsers({
      q,
      accountType,
      location,
      skill,
      verifiedOnly,
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[DiscoveryController.discoverUsers] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search users',
      error: error.message
    });
  }
};

module.exports = {
  discoverUsers
};

