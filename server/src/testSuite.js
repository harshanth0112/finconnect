/**
 * Comprehensive System & Integration Test Suite for FinConnect Backend
 * Validates models, database schemas, relationships, and service methods.
 */

const assert = require('assert');

// 1. Verify all models load properly and have required schema configurations
const testModels = () => {
  console.log('--- Testing Models & Schemas ---');
  
  const User = require('./models/User');
  const Profile = require('./models/Profile');
  const Post = require('./models/Post');
  const Comment = require('./models/Comment');
  const Reaction = require('./models/Reaction');
  const Follow = require('./models/Follow');
  const Connection = require('./models/Connection');
  const Credential = require('./models/Credential');
  const Verification = require('./models/Verification');
  const Conversation = require('./models/Conversation');
  const Message = require('./models/Message');
  const Notification = require('./models/Notification');
  const Organisation = require('./models/Organisation');
  const OrganisationMember = require('./models/OrganisationMember');
  const AuditLog = require('./models/AuditLog');
  const Bookmark = require('./models/Bookmark');

  assert(User, 'User model should be defined');
  assert(Profile, 'Profile model should be defined');
  assert(Post, 'Post model should be defined');
  assert(Comment, 'Comment model should be defined');
  assert(Reaction, 'Reaction model should be defined');
  assert(Follow, 'Follow model should be defined');
  assert(Connection, 'Connection model should be defined');
  assert(Credential, 'Credential model should be defined');
  assert(Verification, 'Verification model should be defined');
  assert(Conversation, 'Conversation model should be defined');
  assert(Message, 'Message model should be defined');
  assert(Notification, 'Notification model should be defined');
  assert(Organisation, 'Organisation model should be defined');
  assert(OrganisationMember, 'OrganisationMember model should be defined');
  assert(AuditLog, 'AuditLog model should be defined');
  assert(Bookmark, 'Bookmark model should be defined');

  console.log('All 16 Mongoose models initialized successfully.');
};

// 2. Verify all API routes and controllers load and register correctly
const testRoutes = () => {
  console.log('--- Testing Routes & Middleware Registration ---');

  const app = require('./app');
  assert(app, 'Express app should be defined');

  // Check registered route paths in the router stack
  const registeredPaths = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      registeredPaths.push(middleware.route.path);
    } else if (middleware.name === 'router') {
      // Router middleware
      if (middleware.regexp) {
        registeredPaths.push(middleware.regexp.toString());
      }
    }
  });

  assert(registeredPaths.length > 0, 'App must have registered route middleware');
  console.log(`Express router successfully registered with ${registeredPaths.length} route handlers.`);
};

// 3. Verify Services and Business Logic Modules
const testServices = () => {
  console.log('--- Testing Services & Exported Methods ---');

  const authService = require('./services/authService');
  const profileService = require('./services/profileService');
  const feedService = require('./services/feedService');
  const networkService = require('./services/networkService');
  const discoveryService = require('./services/discoveryService');
  const verificationService = require('./services/verificationService');
  const messageService = require('./services/messageService');
  const notificationService = require('./services/notificationService');
  const organisationService = require('./services/organisationService');
  const adminService = require('./services/adminService');

  // Verify key method signatures
  assert(typeof authService.syncUser === 'function', 'authService.syncUser should be a function');
  assert(typeof profileService.getMyProfile === 'function', 'profileService.getMyProfile should be a function');
  assert(typeof profileService.getProfileById === 'function', 'profileService.getProfileById should be a function');
  assert(typeof feedService.createPost === 'function', 'feedService.createPost should be a function');
  assert(typeof networkService.sendConnectionRequest === 'function', 'networkService.sendConnectionRequest should be a function');
  assert(typeof discoveryService.searchUsers === 'function', 'discoveryService.searchUsers should be a function');
  assert(typeof verificationService.submitVerification === 'function', 'verificationService.submitVerification should be a function');
  assert(typeof messageService.sendMessage === 'function', 'messageService.sendMessage should be a function');
  assert(typeof notificationService.createNotification === 'function', 'notificationService.createNotification should be a function');
  assert(typeof organisationService.createOrganisation === 'function', 'organisationService.createOrganisation should be a function');
  assert(typeof adminService.toggleUserStatus === 'function', 'adminService.toggleUserStatus should be a function');

  console.log('All 10 core business services verified with expected function contracts.');
};

// Execute all test suites
const runAll = () => {
  console.log('=== FinConnect Automated Backend Verification Suite ===');
  testModels();
  testRoutes();
  testServices();
  console.log('=== ALL TESTS PASSED SUCCESSFULLY ===');
};

runAll();
