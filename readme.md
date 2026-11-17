# FINCONNECT
## Finance-Focused Professional Social Networking Platform

**Tagline:** Discover. Verify. Evaluate. Connect.

**Project Type:** Full-Stack Web Application  
**Architecture:** MERN Stack  
**Authentication:** Firebase Authentication  
**Database:** MongoDB Atlas  
**Frontend:** React.js + Vite  
**Backend:** Node.js + Express.js  
**Real-Time Communication:** Socket.IO  
**Media Storage:** Cloudinary

---

# 1. PROJECT CONTEXT

## 1.1 About FinConnect

FinConnect is a finance-exclusive professional social networking platform inspired by LinkedIn.

The platform connects:

- Students interested in finance.
- Individual investors.
- Finance enthusiasts.
- Financial professionals.
- Financial educators.
- Financial institutions.
- Companies and organisations.

FinConnect provides a centralized ecosystem where users can create professional profiles, share financial knowledge, connect with professionals, discover organisations and submit professional credentials for manual verification.

The platform focuses on professional networking, financial education, knowledge sharing and credential transparency.

## 1.2 Product Vision

Build a trusted digital professional network exclusively for the finance ecosystem.

## 1.3 Core Concept

FinConnect = LinkedIn-style networking + Finance-focused community + Professional credential verification.

## 1.4 Target Audience

| User | Purpose |
|---|---|
| Students | Build profiles and connect with finance professionals |
| Investors | Discover financial professionals and educational content |
| Finance Enthusiasts | Share and explore finance-related knowledge |
| Professionals | Build professional credibility and networking opportunities |
| Organisations | Establish an official organisation presence |
| Administrators | Manage platform operations and credential verification |

---

# 2. IMPORTANT INSTRUCTIONS FOR AI CODING ASSISTANTS

This section defines the development rules for any IDE-based AI assistant working on this repository.

## 2.1 General Development Rules

1. Understand the existing project structure before creating or modifying files.
2. Do not recreate existing components unnecessarily.
3. Follow the established architecture and naming conventions.
4. Write reusable, modular and maintainable code.
5. Avoid unnecessary dependencies.
6. Use environment variables for configuration and secrets.
7. Validate all API inputs.
8. Handle loading, error, success and empty states.
9. Implement responsive layouts for desktop, tablet and mobile.
10. Do not introduce mock data into production functionality.
11. Never claim that a feature is implemented unless its functionality is actually complete.
12. Test changes before considering a module complete.
13. Do not break existing modules while implementing new features.
14. Keep frontend and backend responsibilities separate.
15. Update documentation when architecture or API contracts change.

## 2.2 AI Assistant Workflow

Before implementing a feature:

1. Inspect the existing folder structure.
2. Identify the relevant frontend components.
3. Identify the corresponding backend routes, controllers and models.
4. Understand the database relationships.
5. Check authentication and authorization requirements.
6. Identify reusable utilities and services.
7. Implement the feature in small, logical steps.
8. Test the frontend and backend integration.
9. Report modified files and any remaining issues.

**Important:** Do not generate the entire application in one operation. Implement one module at a time and preserve previously working functionality.

---

# 3. MVP MODULES

FinConnect has nine primary MVP modules.

## Module 1 – User Authentication

Authentication is managed through Firebase Authentication.

Features:

- Email and password registration.
- Email and password login.
- Google sign-in.
- Forgot password.
- Password reset.
- Email verification.
- Logout.
- Authentication state management.
- Protected routes.
- Role-based access control.

Account types:

- student
- investor
- finance_enthusiast
- professional

Organisation profiles are separate entities rather than personal account types.

## Module 2 – User Profiles

Features:

- Profile picture.
- Full name.
- Headline.
- Biography.
- Location.
- Education.
- Professional experience.
- Skills.
- Finance interests.
- Qualifications.
- Certifications.
- Followers.
- Following.
- Connections.

Users must be able to create, view and update their profiles.

## Module 3 – Professional and Organisation Verification

Features:

- Credential submission.
- Supporting document upload.
- Authority selection.
- Credential number.
- Issue date and expiry date.
- Application status tracking.
- Administrator review.
- Approve application.
- Reject application.
- Request additional information.
- Verification history.
- Verified credential badges.

Potential authorities:

- SEBI
- AMFI
- IRDAI
- PFRDA
- RBI
- MCA
- ICAI
- ICSI
- ICMAI
- NISM
- UGC
- AICTE
- Other recognised authorities.

Verification must be based on the available evidence and official records wherever possible.

A FinConnect badge indicates platform review, not government endorsement.

## Module 4 – Finance Social Feed

Features:

- Create posts.
- Edit posts.
- Delete posts.
- Upload images.
- Like posts.
- Comment.
- Reply to comments.
- Share posts.
- Bookmark posts.
- Hashtags.
- Mentions.
- Feed pagination.
- Public and connection-based visibility.

## Module 5 – Professional Networking

Features:

- Follow users.
- Unfollow users.
- Send connection requests.
- Accept connection requests.
- Reject connection requests.
- Cancel pending requests.
- View connections.
- View mutual connections.

## Module 6 – Finance Discovery

Features:

- Search users.
- Search professionals.
- Search students.
- Search organisations.
- Filter by location.
- Filter by expertise.
- Filter by qualifications.
- Filter by credential verification status.

## Module 7 – Messaging

Features:

- One-to-one messaging.
- Conversation list.
- Message requests.
- Text messages.
- Image and file messages.
- Real-time communication.
- Read status.
- Conversation history.

Technology: Socket.IO.

## Module 8 – Notifications

Notification events:

- New follower.
- Connection request.
- Connection accepted.
- Post liked.
- Post commented.
- New message.
- Verification approved.
- Verification rejected.
- Additional information requested.

## Module 9 – Organisation Profiles

Features:

- Create organisation.
- Edit organisation.
- Organisation logo.
- Organisation description.
- Website.
- Industry category.
- Registration information.
- Organisation members.
- Submit registration documents.
- Verification status.
- Public organisation profile.

---

# 4. TECHNOLOGY STACK

## Frontend

| Technology | Responsibility |
|---|---|
| React.js | Component-based UI |
| Vite | Development server and build |
| Tailwind CSS | Styling |
| React Router DOM | Routing |
| Axios | HTTP communication |
| Firebase SDK | Authentication |
| Socket.IO Client | Real-time messaging |
| Lucide React | Icons |

## Backend

| Technology | Responsibility |
|---|---|
| Node.js | Runtime |
| Express.js | REST API |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| Firebase Admin SDK | ID token verification |
| Socket.IO | Real-time communication |
| Cloudinary | Media storage |
| Helmet | HTTP security headers |
| Express Rate Limit | Request rate limiting |

## Development Tools

- Git.
- GitHub.
- VS Code / Cursor.
- Postman.
- MongoDB Compass.
- Firebase Console.

---

# 5. SYSTEM ARCHITECTURE

```text
                    FINCONNECT
                        |
             +----------+----------+
             |                     |
        React Frontend         Firebase Auth
             |                     |
             |                 ID Token
             |                     |
             +----------+----------+
                        |
                   Axios Client
                        |
                 Express Backend
                        |
                Firebase Admin SDK
                        |
                 Token Verification
                        |
                Authorization Layer
                        |
          +-------------+-------------+
          |             |             |
       MongoDB       Cloudinary     Socket.IO
       Atlas          Storage        Server
          |                            |
     Application Data             Real-time Chat
```

## Architectural Responsibilities

### React Frontend

Responsible for:

- User interface.
- Authentication screens.
- Navigation.
- State management.
- API requests.
- Form validation.
- Responsive layouts.
- Real-time messaging interface.

### Firebase Authentication

Responsible for:

- User identity.
- Email/password authentication.
- Google authentication.
- Password reset.
- Email verification.

### Express Backend

Responsible for:

- Business logic.
- API endpoints.
- Authentication token verification.
- Authorization.
- Database operations.
- Verification workflows.
- Notifications.
- Messaging authorization.

### MongoDB

Responsible for storing:

- User application records.
- Profiles.
- Organisations.
- Credentials.
- Verification applications.
- Posts.
- Comments.
- Connections.
- Messages.
- Notifications.

### Cloudinary

Responsible for storing and delivering:

- Profile images.
- Organisation logos.
- Post images.
- Permitted message attachments.
- Verification documents through appropriately restricted storage.

---

# 6. PROJECT FOLDER STRUCTURE

```text
finconnect/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── config/
│       │   └── firebase.js
│       │
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   ├── profile/
│       │   ├── feed/
│       │   ├── verification/
│       │   ├── organisation/
│       │   └── messaging/
│       │
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── SocketContext.jsx
│       │   └── NotificationContext.jsx
│       │
│       ├── hooks/
│       │
│       ├── lazy/
│       │   ├── LazyPage.jsx
│       │   └── PageLoader.jsx
│       │
│       ├── pages/
│       │   ├── auth/
│       │   ├── dashboard/
│       │   ├── profile/
│       │   ├── feed/
│       │   ├── discovery/
│       │   ├── networking/
│       │   ├── messaging/
│       │   ├── notifications/
│       │   ├── verification/
│       │   ├── organisation/
│       │   └── admin/
│       │
│       ├── services/
│       ├── routes/
│       ├── store/
│       ├── utils/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── server/
│   └── src/
│       ├── config/
│       │   ├── db.js
│       │   ├── firebaseAdmin.js
│       │   ├── cloudinary.js
│       │   └── cors.js
│       │
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── services/
│       ├── sockets/
│       ├── validators/
│       ├── utils/
│       ├── app.js
│       └── server.js
│
├── docs/
│   ├── PRD.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── SECURITY.md
│   └── DEPLOYMENT.md
│
├── package.json
├── .gitignore
└── README.md
```

---

# 7. DATABASE SCHEMA

Database name: `finconnect`

MongoDB collections:

| Collection | Purpose |
|---|---|
| users | Account identity and permissions |
| profiles | Individual profile details |
| organisations | Organisation details |
| organisationMembers | Organisation membership |
| credentials | Professional and organisation credentials |
| verifications | Credential review applications |
| posts | Social feed |
| comments | Post comments and replies |
| reactions | Post reactions |
| follows | Follow relationships |
| connections | Connection requests and relationships |
| conversations | Messaging conversations |
| messages | Individual messages |
| notifications | User notifications |

## Database Design Rules

1. Use ObjectId references between related collections.
2. Use Firebase UID as the external authentication identifier.
3. Never store Firebase passwords in MongoDB.
4. Use unique indexes for email and Firebase UID.
5. Use compound indexes for follows, reactions and membership.
6. Use pagination for posts, messages and notifications.
7. Store media URLs and metadata instead of large files in MongoDB.
8. Keep verification history available for audit purposes.
9. Keep professional credentials separate from organisation registration records.
10. Enforce ownership and access permissions in backend services.

Detailed schema definitions must be maintained in `docs/DATABASE.md`.

---

# 8. FIREBASE AUTHENTICATION IMPLEMENTATION

## Frontend authentication

Location:

`client/src/config/firebase.js`

Initialize Firebase using environment variables.

Location:

`client/src/context/AuthContext.jsx`

Responsibilities:

- Maintain Firebase authentication state.
- Expose the current authenticated user.
- Expose loading state.
- Provide authentication methods.
- Synchronise the authenticated identity with the backend.

Location:

`client/src/services/authService.js`

Responsibilities:

- Register.
- Login.
- Google sign-in.
- Logout.
- Password reset.
- Email verification.

## Backend authentication

Location:

`server/src/config/firebaseAdmin.js`

Initialize Firebase Admin SDK securely.

Location:

`server/src/middleware/authMiddleware.js`

Responsibilities:

1. Extract the Bearer token.
2. Verify the Firebase ID token.
3. Retrieve the MongoDB user using `firebaseUid`.
4. Check account status.
5. Attach authenticated user details to the request.
6. Reject invalid or unauthorized requests.

Example request:

```http
GET /api/v1/auth/me
Authorization: Bearer FIREBASE_ID_TOKEN
```

## User Synchronisation

After successful Firebase registration:

1. Firebase creates the authentication account.
2. Frontend obtains the ID token.
3. Frontend sends the token to `/api/v1/auth/sync`.
4. Backend verifies the token.
5. Backend creates or retrieves the MongoDB user.
6. Backend returns the application user profile.

Never allow the frontend to assign its own administrator role.

---

# 9. API DEVELOPMENT STANDARDS

Base URL:

```text
/api/v1
```

## API Routes

| Module | Base endpoint |
|---|---|
| Authentication | `/auth` |
| Users | `/users` |
| Profiles | `/profiles` |
| Organisations | `/organisations` |
| Credentials | `/credentials` |
| Verification | `/verifications` |
| Posts | `/posts` |
| Comments | `/comments` |
| Connections | `/connections` |
| Messaging | `/conversations` |
| Notifications | `/notifications` |
| Admin | `/admin` |

## Example API Endpoints

```text
POST   /api/v1/auth/sync
GET    /api/v1/auth/me

GET    /api/v1/users
GET    /api/v1/users/:userId

GET    /api/v1/profiles/me
PUT    /api/v1/profiles/me

POST   /api/v1/organisations
GET    /api/v1/organisations

POST   /api/v1/credentials
GET    /api/v1/credentials

POST   /api/v1/verifications
GET    /api/v1/verifications/me

POST   /api/v1/posts
GET    /api/v1/posts
PUT    /api/v1/posts/:postId
DELETE /api/v1/posts/:postId

POST   /api/v1/connections
GET    /api/v1/connections

GET    /api/v1/conversations
GET    /api/v1/notifications

GET    /api/v1/admin/verifications
PATCH  /api/v1/admin/verifications/:id
```

All protected endpoints must use authentication middleware.

Administrator endpoints must additionally use administrator authorization middleware.

---

# 10. FRONTEND DEVELOPMENT STANDARDS

## Component Design

- Use functional React components.
- Use hooks for component state and lifecycle.
- Keep components focused on one responsibility.
- Extract reusable UI components.
- Avoid oversized components.
- Separate API logic from UI components.

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase | `ProfileCard.jsx` |
| Hooks | camelCase with use | `useAuth.js` |
| Services | camelCase | `authService.js` |
| Utilities | camelCase | `formatDate.js` |
| Context | PascalCase | `AuthContext.jsx` |
| Backend models | PascalCase | `User.js` |
| Controllers | camelCase | `userController.js` |
| Routes | camelCase | `userRoutes.js` |

## UI Requirements

The application should have:

- Modern professional finance-oriented design.
- Responsive layouts.
- Consistent spacing and typography.
- Reusable buttons and form controls.
- Loading indicators.
- Error messages.
- Empty states.
- Confirmation dialogs for destructive actions.
- Accessible forms and controls.

Avoid unnecessary animations and excessive visual effects.

---

# 11. LAZY LOADING AND PERFORMANCE

Lazy loading is mandatory for major application pages.

## Route-Level Lazy Loading

Use:

```jsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(() =>
  import("../pages/dashboard/Dashboard")
);
```

Wrap lazy-loaded routes in Suspense:

```jsx
<Suspense fallback={<PageLoader />}>
  <Routes>
    {/* Application routes */}
  </Routes>
</Suspense>
```

## Performance Requirements

| Area | Strategy |
|---|---|
| Dashboard | Route-level lazy loading |
| Feed | Route-level lazy loading |
| Discovery | Route-level lazy loading |
| Admin | Separate lazy-loaded routes |
| Messaging | Route-level lazy loading |
| Charts | Component-level lazy loading |
| Modals | Load on demand |
| Images | Native lazy loading |
| Posts | Pagination |
| API requests | Avoid unnecessary duplicate requests |

Use:

```jsx
<img
  src={imageUrl}
  alt="Finance content"
  loading="lazy"
  decoding="async"
/>
```

Do not lazy-load essential authentication initialization or route guards.

---

# 12. BACKEND DEVELOPMENT STANDARDS

## MVC Architecture

Follow the separation:

```text
Routes
  |
  v
Middleware
  |
  v
Controllers
  |
  v
Services
  |
  v
Models
  |
  v
MongoDB
```

### Routes

Define HTTP endpoints and middleware.

### Middleware

Handle authentication, authorization, validation and request-level controls.

### Controllers

Handle HTTP requests and responses.

### Services

Implement reusable business logic.

### Models

Define MongoDB schemas, indexes and validation.

## Backend Rules

- Use async/await.
- Use centralized error handling.
- Validate incoming data.
- Use consistent HTTP status codes.
- Enforce authorization at the backend.
- Use database transactions where multi-document consistency requires them and deployment supports them.
- Prevent duplicate records through database indexes.
- Never expose private credentials.
- Avoid putting business logic directly into route files.

---

# 13. SECURITY REQUIREMENTS

Security is a critical requirement for FinConnect.

Implement:

- Firebase ID token verification.
- Role-based access control.
- User ownership validation.
- Input validation and sanitization.
- Rate limiting.
- Helmet security headers.
- CORS restrictions.
- Secure file upload validation.
- Private verification document access.
- Socket.IO authentication.
- Message participant authorization.
- Administrator action audit logs.
- Account suspension enforcement.

## Role Security

Public registration can create only ordinary user accounts.

Administrator privileges must be assigned through a trusted backend process.

## Verification Security

Uploaded credential documents must not be publicly accessible.

Only authorised administrators should access private verification evidence.

## Financial Content Safety

FinConnect is a professional networking and financial education platform.

Do not implement personalised securities recommendations, buy/sell/hold advice, portfolio management or trading functionality as ordinary social features.

Any future regulated functionality requires separate legal and regulatory review.

---

# 14. REAL-TIME MESSAGING

Use Socket.IO.

## Socket Events

```text
connection
disconnect

join_conversation
leave_conversation

send_message
receive_message

message_read
typing_start
typing_stop
```

## Messaging Rules

- Verify the Firebase ID token during socket authentication.
- Confirm the user belongs to the conversation.
- Validate message content.
- Persist messages in MongoDB.
- Deliver messages through authorised conversation rooms.
- Update read status.
- Prevent users from joining unauthorised conversation rooms.

Do not treat a client-supplied user ID as proof of identity.

---

# 15. ENVIRONMENT VARIABLES

## Frontend – client/.env

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_API_URL=http://localhost:5000/api/v1
```

## Backend – server/.env

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=

FIREBASE_PROJECT_ID=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=http://localhost:5173
```

Do not commit actual environment files.

Add `.env`, `.env.local`, service account JSON files and private keys to `.gitignore`.

Use secure Firebase Admin credentials in the backend environment.

---

# 16. DEVELOPMENT COMMANDS

## Frontend

```bash
cd client
npm install
npm run dev
```

## Backend

```bash
cd server
npm install
npm run dev
```

## Production Build

```bash
cd client
npm run build
```

## Backend Production

```bash
cd server
npm start
```

The exact scripts must match the respective `package.json` files.

---

# 17. DEVELOPMENT ROADMAP

Implement modules in the following order.

| Phase | Module | Priority |
|---|---|---|
| 1 | Project configuration | Critical |
| 2 | Firebase authentication | Critical |
| 3 | User and profile management | Critical |
| 4 | Organisation management | High |
| 5 | Credential submission and verification | Critical |
| 6 | Finance social feed | High |
| 7 | Professional networking | High |
| 8 | Finance discovery | High |
| 9 | Real-time messaging | Medium |
| 10 | Notifications | Medium |
| 11 | Admin dashboard and moderation | Critical |
| 12 | Testing and deployment | Critical |

Do not start advanced features before the underlying MVP modules work correctly.

---

# 18. TESTING REQUIREMENTS

## Frontend Testing

Test:

- Login and registration forms.
- Authentication state.
- Protected routes.
- Admin routes.
- Profile forms.
- Feed interactions.
- Connection requests.
- Messaging interface.
- Responsive layouts.
- Lazy-loading fallbacks.

## Backend Testing

Test:

- Firebase token verification.
- MongoDB user synchronisation.
- API validation.
- User permissions.
- Administrator permissions.
- CRUD operations.
- Verification workflow.
- Duplicate connections.
- Duplicate reactions.
- Message access control.
- File upload validation.

## Integration Testing

Verify:

1. Firebase registration creates a MongoDB user.
2. Login gives access to protected routes.
3. Profile updates persist in MongoDB.
4. Posts are stored and retrieved.
5. Connection requests work correctly.
6. Credential applications reach the administrator.
7. Approved credentials display the correct badge.
8. Messaging works only between authorised participants.
9. Notifications are delivered to the correct user.

---

# 19. DEPLOYMENT ARCHITECTURE

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Authentication | Firebase |
| File storage | Cloudinary |
| Repository | GitHub |

Before deployment:

- Configure production environment variables.
- Configure Firebase authorised domains.
- Configure backend CORS.
- Configure MongoDB network access.
- Configure Cloudinary credentials.
- Configure Socket.IO origins.
- Test production API endpoints.
- Verify that private documents are protected.

---

# 20. OUT-OF-SCOPE FEATURES

Do not add the following to the initial MVP without an explicit product decision:

- AI financial advisor.
- Automated investment recommendations.
- Stock trading.
- Portfolio management.
- Paid professional rankings.
- Subscription billing.
- Live video streaming.
- Voice and video calls.
- Advanced investment analytics.
- Native Android and iOS applications.

These may be considered in future releases after the MVP is stable and applicable compliance requirements are reviewed.

---

# 21. DEFINITION OF DONE

A feature is considered complete only when:

- Frontend implementation is complete.
- Backend implementation is complete where required.
- Database integration works.
- Authentication is enforced.
- Authorization is enforced.
- Validation is implemented.
- Error handling is implemented.
- Loading and empty states are implemented.
- Responsive behaviour is tested.
- Relevant tests pass.
- Existing functionality remains operational.
- Documentation is updated.

Do not mark partially implemented functionality as complete.

---

# 22. AI IDE EXECUTION DIRECTIVE

When working on FinConnect, follow these instructions:

1. Read this README before making architectural changes.
2. Inspect existing source files before editing.
3. Follow the established folder structure.
4. Use Firebase Authentication rather than implementing a separate password authentication system in Express.
5. Use MongoDB for application data.
6. Use Firebase Admin SDK to verify backend requests.
7. Use React lazy loading for major application routes.
8. Follow modular MVC architecture in the backend.
9. Keep controllers, services, models and routes separated.
10. Follow the defined nine-module MVP scope.
11. Implement secure role-based permissions.
12. Build administrator functionality with proper backend protection.
13. Use reusable React components.
14. Keep the UI responsive and production-oriented.
15. Do not introduce unnecessary libraries or architecture.
16. Preserve existing working code.
17. Implement features incrementally.
18. Run relevant tests after changes.
19. Report all created and modified files.
20. Clearly identify incomplete features and known limitations.

**Primary objective:** Build a complete, secure, scalable and production-ready FinConnect MVP without compromising the existing architecture.

---

# 23. PROJECT SUMMARY

| Property | Value |
|---|---|
| Project | FinConnect |
| Category | Finance Social Networking |
| Architecture | MERN |
| Authentication | Firebase |
| Database | MongoDB Atlas |
| Frontend | React + Vite |
| Backend | Express + Node.js |
| Real-Time | Socket.IO |
| Media | Cloudinary |
| Deployment | Vercel + Render |
| MVP Modules | 9 |
| Development Style | Modular MVC |
| Performance | Lazy Loading + Pagination |

---

**FINCONNECT**

**Discover. Verify. Evaluate. Connect.**

*Building a trusted professional network for the finance ecosystem.*