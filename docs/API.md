# FinConnect REST API Documentation

Base URL: `/api/v1`  
All protected endpoints require header: `Authorization: Bearer <FIREBASE_ID_TOKEN>`

---

## 1. Authentication & Identity (`/auth`)
- `POST /auth/sync`: Synchronizes Firebase authenticated user into MongoDB.
- `GET /auth/me`: Retrieves current authenticated user profile and permissions.

## 2. User Profiles (`/profiles`)
- `GET /profiles/me`: Returns current user's full profile.
- `PUT /profiles/me`: Updates bio, headline, skills, work experience, education, and credentials.
- `GET /profiles/:id`: Returns public profile by User ID or Profile ID.

## 3. Discovery (`/users`)
- `GET /users/discovery`: Search active users by keywords (`q`), `accountType`, `location`, `skill`, and `verifiedOnly`.

## 4. Professional Verification (`/verifications`)
- `POST /verifications`: Submit a credential and verification application with evidence document.
- `GET /verifications/my`: List current user's submitted verification applications.

## 5. Social Feed (`/posts`)
- `GET /posts`: List paginated feed posts with like status for authenticated user.
- `POST /posts`: Create a post with hashtags, text, and optional media.
- `POST /posts/:id/react`: Toggle like / reaction.
- `POST /posts/:id/comments`: Add a comment or reply to a post.
- `GET /posts/:id/comments`: Retrieve comments thread for a post.
- `DELETE /posts/:id`: Delete a post (author or admin only).

## 6. Connections & Networking (`/connections`)
- `GET /connections`: List accepted connections and pending invitations (received & sent).
- `POST /connections/request`: Send a connection request (`{ recipientId }`).
- `PATCH /connections/:id/respond`: Accept or reject request (`{ action: 'accept' | 'reject' }`).
- `DELETE /connections/:id`: Cancel an outgoing connection request.
- `POST /connections/follow/:userId`: Toggle follow / unfollow.

## 7. Real-Time Messaging (`/conversations`)
- `GET /conversations`: Retrieve conversation list with latest message previews.
- `POST /conversations`: Start or open a 1-to-1 conversation room (`{ targetUserId }`).
- `GET /conversations/:id/messages`: Paginated message thread history.
- `POST /conversations/:id/messages`: Post message via REST fallback.
- `POST /conversations/:id/read`: Mark messages in conversation as read.

## 8. Notifications (`/notifications`)
- `GET /notifications`: List user notifications with unread counts and pagination.
- `PATCH /notifications/:id/read`: Mark an individual notification as read.
- `PATCH /notifications/read-all`: Mark all notifications as read.
- `DELETE /notifications/:id`: Delete a notification.

## 9. Organisations (`/organisations`)
- `GET /organisations`: Directory listing with search and industry filtering.
- `POST /organisations`: Create an organisation profile.
- `GET /organisations/:id`: Public profile with metadata and member roster.
- `PUT /organisations/:id`: Update organisation details (org admin only).
- `POST /organisations/:id/members`: Join or add team member.

## 10. Administration & Governance (`/admin`)
*Requires role: `admin`*
- `GET /admin/stats`: High-level platform statistics and metrics.
- `GET /admin/users`: Search and filter user accounts.
- `PATCH /admin/users/:id/status`: Suspend or activate a user account with reason logging.
- `DELETE /admin/posts/:id`: Moderation removal of a post.
- `GET /admin/verifications`: Credential verification review queue.
- `PATCH /admin/verifications/:id`: Approve, reject, or request information on credentials.
- `GET /admin/logs`: Audit trail of all administrative actions.
