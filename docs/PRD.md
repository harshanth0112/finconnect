# FinConnect Product Requirements Document (PRD)

## 1. Product Vision & Value Proposition
FinConnect is a dedicated finance-exclusive professional networking platform designed to combine LinkedIn-style networking with professional credential transparency and financial education.

### Tagline
*Discover. Verify. Evaluate. Connect.*

---

## 2. Target Persona & Roles
1. **Students**: Showcase education, finance skills, coursework, and connect with finance practitioners.
2. **Individual Investors**: Discover verified investment professionals, financial analysts, and educational insights.
3. **Finance Enthusiasts**: Share market thoughts, macroeconomic articles, and community posts.
4. **Financial Professionals**: Establish professional credibility with verified credentials issued by official regulatory bodies (SEBI, CFA, ICAI, NISM, etc.).
5. **Organisations**: Corporate representation for asset managers, fintech startups, audit firms, and investment banks.
6. **Administrators**: Moderate content, review regulatory credential submissions, and audit platform actions.

---

## 3. Product Scope & Functional Modules

### Module 1: User Authentication & Role Management
- Firebase Authentication with Email/Password and Google OAuth.
- Role synchronization with MongoDB Atlas.
- Account categories: `student`, `investor`, `finance_enthusiast`, `professional`.
- Account status tracking (`active`, `suspended`).

### Module 2: User Profiles
- Bio, Headline, Education history, Work experience, Skills, Finance Interests, Qualifications, Certifications.
- Followers, Following, and Connections counter stats.
- Dynamic profile editing and public profile views.

### Module 3: Professional & Organisation Credential Verification
- Submissions backed by regulatory authority selection (SEBI, ICAI, NISM, CFA, RBI, IRDAI, etc.).
- Secure verification evidence document URL attachment.
- Administrative review workflow (`pending`, `under_review`, `approved`, `rejected`, `more_info_required`).
- Verified badge issued upon admin approval.

### Module 4: Finance Social Feed
- Knowledge sharing posts with rich text, hashtags, and media attachments.
- Public vs. connection-based visibility settings.
- Real-time interactions: likes/reactions, comments, and replies.

### Module 5: Professional Networking
- Mutual connection requests (`pending`, `accepted`, `rejected`).
- Asymmetrical following/unfollowing mechanism.
- Network directory view showing connections, incoming requests, and outgoing invitations.

### Module 6: Finance Ecosystem Discovery
- Multi-dimensional search across users and organizations.
- Filters by role/category, geographic location, expertise/skills, and verification status.

### Module 7: Real-Time Messaging
- One-on-one private messaging powered by Socket.IO with MongoDB persistence.
- Live typing indicators, conversation histories, and read receipts.

### Module 8: Notification Center
- Real-time event notifications for connections, follows, post likes, comments, incoming messages, and verification review outcomes.

### Module 9: Corporate & Organisation Profiles
- Establishment of institutional pages with member rosters, employee size, industry classification, and corporate credential verification.

### Phase 11: Governance, Moderation & Admin Dashboard
- Centralized queue for credential verifications.
- User management and account suspension enforcement.
- Automated compliance audit trail for administrative actions.

---

## 4. Non-Functional Requirements
- **Performance**: Route-level lazy loading in React; compound database indexes for sub-100ms queries.
- **Security**: JWT token verification via Firebase Admin SDK; Helmet headers; Express rate-limiting.
- **Compliance**: Clear disclaimer that badges represent platform verification of credentials, not government financial advice endorsement.
