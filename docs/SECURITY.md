# FinConnect Security & Compliance Policy

## 1. Authentication Security
- **Firebase Authentication**: Industry-standard identity management handles password hashing (scrypt) and multi-factor authentication.
- **Firebase Admin SDK**: Every backend request to protected routes verifies the incoming Firebase ID token using public key cryptography.
- **Client Tokens**: Tokens are never stored in localStorage in plain text; Firebase Auth SDK manages token caching and automatic refresh cycles securely.

---

## 2. Authorization & RBAC
- **Strict Role-Based Access Control**:
  - `user`: Ordinary user access with ownership checks for all resource modifications (posts, profiles, applications).
  - `admin`: Role required for all `/api/v1/admin/*` endpoints and organisation verification review.
- **No Self-Assignment**: Administrator roles cannot be assigned or elevated via public endpoints or client registration payloads.

---

## 3. Network & Transport Security
- **HTTPS Enforcement**: Production endpoints on Render and Vercel enforce SSL/TLS encryption in transit.
- **HTTP Security Headers**: `helmet` is installed and applied on all Express routes to prevent XSS, clickjacking, MIME-sniffing, and cross-site injection.
- **CORS Protection**: Restricted to authorized origins (`CLIENT_URL`) in both Express and Socket.IO.
- **Rate Limiting**: `express-rate-limit` prevents brute force and denial of service attacks by limiting IP requests to 200 requests per 15-minute window.

---

## 4. Financial Content Safety & Regulatory Compliance
- **No Unregulated Advice**: FinConnect explicitly prohibits algorithmic or individual buy/sell/hold trading advice, portfolio management, or trading execution.
- **Badge Disclaimer**: Badges indicate administrative review of credential proof documents, not government guarantees or endorsements.
- **Account Suspension**: Suspended accounts are immediately locked out from API operations via the `authMiddleware` gate (`user.status === 'suspended'`).
- **Audit Logging**: All moderation actions, user suspensions, and verification decisions are written to immutable `AuditLog` records for compliance accountability.
