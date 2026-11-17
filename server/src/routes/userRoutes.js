const express = require('express');
const router = express.Router();
const discoveryController = require('../controllers/discoveryController');
const { verifyToken, requireAuth } = require('../middleware/authMiddleware');

router.get('/discovery', verifyToken, requireAuth, discoveryController.discoverUsers);

module.exports = router;

