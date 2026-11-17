const admin = require('../config/firebaseAdmin');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    const token = authHeader.split('Bearer ')[1].trim();

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired Firebase ID token',
        error: err.message
      });
    }

    // Attach decoded token
    req.firebaseUser = decodedToken;

    // Retrieve user from MongoDB if already synced
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (user) {
      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          message: 'Account has been suspended'
        });
      }
      req.user = user;
    }

    next();
  } catch (error) {
    console.error('[AuthMiddleware] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message
    });
  }
};

const requireAuth = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User authentication required. Please sync user profile first.'
    });
  }
  next();
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires one of [${roles.join(', ')}] role`
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  requireAuth,
  requireRole
};

