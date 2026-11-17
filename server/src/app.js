const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const corsMiddleware = require('./config/cors');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const postRoutes = require('./routes/postRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const organisationRoutes = require('./routes/organisationRoutes');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(corsMiddleware);

// Request rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api', limiter);

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'finconnect-api' });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/verifications', verificationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/connections', connectionRoutes);
app.use('/api/v1/conversations', conversationRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/organisations', organisationRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server`
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Error Middleware]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;

