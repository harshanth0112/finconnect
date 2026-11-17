const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let initialized = false;

const initFirebaseAdmin = () => {
  if (initialized) return admin;

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, '../../serviceAccountKey.json');

  try {
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
      });
      console.log('[FirebaseAdmin] Initialized with service account file');
      initialized = true;
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
      });
      console.log('[FirebaseAdmin] Initialized with inline JSON');
      initialized = true;
    } else {
      // Default application credentials or project ID fallback
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'finconnect-demo'
      });
      console.log('[FirebaseAdmin] Initialized with default project config');
      initialized = true;
    }
  } catch (error) {
    console.error('[FirebaseAdmin] Initialization warning:', error.message);
  }

  return admin;
};

initFirebaseAdmin();

module.exports = admin;

