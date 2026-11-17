# FinConnect Production Deployment & Operations Guide

## 1. Overview
FinConnect is built on the MERN stack with Firebase Authentication, MongoDB Atlas, and Cloudinary media storage.

| Tier | Service | Provider |
|---|---|---|
| Frontend Client | Single Page Application (React + Vite) | Vercel |
| Backend API | Express.js + Socket.IO Server | Render |
| Database | Distributed Document Database | MongoDB Atlas |
| Authentication | User Identity, JWT verification | Firebase Authentication |
| Media Storage | Documents, Post Images, Profile Avatars | Cloudinary |

---

## 2. Environment Variables Configuration

### 2.1 Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/finconnect?retryWrites=true&w=majority
FIREBASE_PROJECT_ID=your-firebase-project-id
CLIENT_URL=https://your-finconnect-client.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 2.2 Frontend (`client/.env`)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_URL=https://your-finconnect-api.onrender.com/api/v1
```

---

## 3. Deployment Steps

### 3.1 Backend on Render
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and create a **New Web Service** connected to your repo.
3. Set **Root Directory** to `server`.
4. Build command: `npm install`.
5. Start command: `npm start`.
6. Add the environment variables specified in Section 2.1.
7. Verify health check: `GET https://your-service.onrender.com/api/health` should respond `{"status":"ok","service":"finconnect-api"}`.

### 3.2 Frontend on Vercel
1. Sign in to [Vercel](https://vercel.com) and import the repository.
2. Set **Root Directory** to `client`.
3. Framework preset will automatically detect **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add environment variables specified in Section 2.2.
7. SPA routing is managed via `client/vercel.json` (rewrites `/(.*)` to `/index.html`).

---

## 4. Third-Party Service Configuration

### 4.1 Firebase Authentication
- Add your Vercel domain (e.g. `your-app.vercel.app`) to **Firebase Console -> Authentication -> Settings -> Authorized Domains**.
- Ensure Google Sign-In and Email/Password providers are enabled.

### 4.2 MongoDB Atlas
- In **Network Access**, allow access from anywhere (`0.0.0.0/0`) or add the outbound IPs from Render.
- In **Database Access**, create a user with read/write access to the `finconnect` database.

### 4.3 Cloudinary
- Obtain API keys from Cloudinary Dashboard and set them in the Render backend environment.
