# FinConnect Database Architecture & Schemas

**Database Engine**: MongoDB Atlas  
**Database Name**: `finconnect`  
**ORM / ODM**: Mongoose 8  

---

## 1. Entity Relationship Overview

```
User (1) <----> (1) Profile
User (1) <----> (N) Posts
User (1) <----> (N) Credentials <----> (N) Verifications
User (M) <----> (N) Connections
User (M) <----> (N) Follows
User (M) <----> (N) Conversations <----> (N) Messages
User (1) <----> (N) Notifications
User (1) <----> (N) OrganisationMembers <----> (1) Organisation
User (1) <----> (N) AuditLogs
```

---

## 2. Collections & Schema Definitions

### 2.1 `users`
Account identity and permission records.
- `_id`: ObjectId
- `firebaseUid`: String (unique, indexed)
- `email`: String (lowercase, unique, indexed)
- `fullName`: String
- `role`: Enum `['user', 'admin']` (default: `'user'`)
- `accountType`: Enum `['student', 'investor', 'finance_enthusiast', 'professional']`
- `profileImage`: String
- `emailVerified`: Boolean
- `status`: Enum `['active', 'suspended']` (default: `'active'`)
- `timestamps`: createdAt, updatedAt

### 2.2 `profiles`
Detailed career and education details.
- `_id`: ObjectId
- `user`: ObjectId -> `users` (unique, indexed)
- `firebaseUid`: String (unique, indexed)
- `headline`: String
- `bio`: String
- `location`: String
- `education`: Array of `{ institution, degree, fieldOfStudy, startDate, endDate, current }`
- `experience`: Array of `{ company, position, location, startDate, endDate, current, description }`
- `skills`: Array of Strings
- `financeInterests`: Array of Strings
- `qualifications`: Array of Strings
- `certifications`: Array of `{ name, issuingOrganization, issueDate, credentialUrl }`
- `followersCount`, `followingCount`, `connectionsCount`: Numbers
- `timestamps`: createdAt, updatedAt

### 2.3 `organisations` & `organisationMembers`
Corporate presence and team membership.
- **`organisations`**:
  - `name`: String (indexed)
  - `slug`: String (unique, indexed)
  - `tagline`: String
  - `description`: String
  - `logoUrl`, `website`, `headquarters`: Strings
  - `industry`: Enum `['Investment Banking', 'Asset Management', 'Wealth Advisory', 'Fintech', ...]`
  - `companySize`: Enum `['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']`
  - `createdBy`: ObjectId -> `users`
  - `registrationNumber`, `registrationAuthority`, `documentUrl`: Strings
  - `verificationStatus`: Enum `['unverified', 'pending', 'verified', 'rejected']`
  - `verifiedBadgeIssued`: Boolean
- **`organisationMembers`**:
  - `organisation`: ObjectId -> `organisations`
  - `user`: ObjectId -> `users`
  - `role`: Enum `['admin', 'member']`
  - `title`: String
  - *Index*: Compound `{ organisation: 1, user: 1 }` (unique)

### 2.4 `credentials` & `verifications`
Regulatory credential verification pipeline.
- **`credentials`**:
  - `user`: ObjectId -> `users`
  - `authority`: String (e.g. SEBI, ICAI, NISM)
  - `title`, `credentialNumber`: Strings
  - `issueDate`, `expiryDate`: Dates
  - `verificationStatus`: Enum `['pending', 'verified', 'rejected']`
  - `verifiedBadgeIssued`: Boolean
- **`verifications`**:
  - `user`: ObjectId -> `users`
  - `credential`: ObjectId -> `credentials`
  - `documentUrl`, `documentType`: Strings
  - `status`: Enum `['pending', 'under_review', 'approved', 'rejected', 'more_info_required']`
  - `adminNotes`: String
  - `reviewedBy`: ObjectId -> `users`
  - `reviewedAt`: Date

### 2.5 `posts`, `comments`, `reactions`
Social feed and interactions.
- **`posts`**: `author`, `content`, `images`, `hashtags`, `visibility`, `likesCount`, `commentsCount`
- **`comments`**: `post`, `author`, `content`, `parentComment`
- **`reactions`**: `post`, `user`, `type` (*Index*: Compound `{ post: 1, user: 1 }` unique)

### 2.6 `connections` & `follows`
Networking relationships.
- **`connections`**: `requester`, `recipient`, `status` (`'pending'`, `'accepted'`, `'rejected'`)
- **`follows`**: `follower`, `following` (*Index*: Compound `{ follower: 1, following: 1 }` unique)

### 2.7 `conversations` & `messages`
Real-time messaging.
- **`conversations`**: `participants` (Array of ObjectIds), `lastMessage`, `lastMessageAt`, `status`
- **`messages`**: `conversation`, `sender`, `text`, `mediaUrl`, `mediaType`, `readBy` (Array of ObjectIds)

### 2.8 `notifications` & `auditLogs`
Platform events and compliance history.
- **`notifications`**: `recipient`, `sender`, `type`, `title`, `message`, `entityId`, `entityType`, `isRead`
- **`auditLogs`**: `admin`, `action`, `targetType`, `targetId`, `details`, `ipAddress`
