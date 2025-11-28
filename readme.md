
# SnackSprint — Food Delivery App

SnackSprint is a full-stack, role-based food delivery starter project built to demonstrate real-world features and architecture useful for production and hiring portfolios. It includes role-based auth (user / owner / deliveryboy), JWT + Google social auth, OTP-based password reset, live-tracking hooks (planned), and a Razorpay payments integration scaffold.

Why this project
- Designed to showcase end-to-end skills: frontend (React + Vite), backend (Node.js + Express), database (MongoDB), real-time (Socket.IO), authentication (JWT + OAuth), payments, and deployment-ready practices.
- Clean separation of concerns, middleware for auth, and example UX flows (signup, signin, reset password).

Table of contents
- Project highlights
- Architecture & folder layout
- Tech stack
- Quick start (local dev)
- Environment variables
- Authentication API (detailed)
- Frontend notes (Firebase + auth flows)
- Security & production notes
- Next steps & how I can help

Project highlights
- Role-based accounts: `user`, `owner`, `deliveryboy`.
- Signup / Signin (email + password).
- Google social auth (Firebase + backend token issuance).
- OTP-based password reset via email (nodemailer + 4-digit OTP, 5 minute expiry).
- Protected routes using `isAuth` middleware that validates HTTP-only cookies.
- Frontend loader states on buttons for better UX (SignIn / SignUp).

Architecture & folder layout
- `Backend/` — Express app: routes, controllers, models, middlewares, utils (mail, token).
- `Frontend/` — React + Vite app: pages, hooks, components, and Firebase for Google sign-in.

Tech stack
- Frontend: React, Vite, Axios, Tailwind/CSS (optional), Firebase Auth (Google), react-router.
- Backend: Node.js, Express, Mongoose (MongoDB), bcryptjs, jsonwebtoken, nodemailer.
- Realtime & payments (planned/scaffolded): Socket.IO, Razorpay.

Quick start (local development)

Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (Atlas or local instance)

Start backend

```powershell
cd 'c:\Users\user\OneDrive\Desktop\Projects\FoodDeliveryApp-SnackSprint\Backend'
npm install
# create a .env file (see Environment variables below)
npm run dev
```

Start frontend

```powershell
cd 'c:\Users\user\OneDrive\Desktop\Projects\FoodDeliveryApp-SnackSprint\Frontend'
npm install
npm run dev
```

Environment variables

Backend (create `Backend/.env`):
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for signing JWT cookies
- `PORT` — Server port (default in code 8000)
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` — Razorpay (optional)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — Optional if using server-side Google OAuth
- `FRONTEND_URL` — e.g. `http://localhost:5173` (for CORS / OAuth callbacks)
- `GMAIL` — Gmail address used to send OTP/reset emails
- `APP_PASSWORD` — App password or SMTP password for `GMAIL`

Frontend (create `Frontend/.env` — Vite expects `VITE_` prefix):
- `VITE_API_URL` — e.g. `http://localhost:8000`
- `VITE_RAZORPAY_KEY_ID` — Razorpay key for client-side checkout
- `VITE_FIREBASE_APIKEY` — Firebase config key used for Google sign-in

Authentication API (detailed)

Base: `/api/auth`

- `POST /api/auth/signup`
  - Body: `{ fullname, email, password, mobile, role }` (role: `user|owner|deliveryboy`)
  - Returns: `201` + created user. Sets HTTP-only cookie `token` (7 days).

- `POST /api/auth/signin`
  - Body: `{ email, password }`
  - Returns: `200` + user. Sets HTTP-only cookie `token`.

- `POST /api/auth/signout`
  - Clears `token` cookie. Returns `200`.

- `POST /api/auth/google-auth` (implemented server-side)
  - Expected from frontend after Firebase Google sign-in to exchange the Google email for an internal user and issue the same `token` cookie.
  - Body example: `{ fullname, email, role, mobile }` (backend creates user if not exists, then sets cookie).

Password reset / OTP

- `POST /api/auth/send-otp` — Body: `{ email }`.
  - Generates a 4-digit OTP, stores `resetOtp`, `otpExpires` (5 minutes) and sends email via `nodemailer`.

- `POST /api/auth/verify-otp` — Body: `{ email, otp }`.
  - Verifies OTP, sets `isOtpVerified=true` on the user doc.

- `POST /api/auth/reset-password` — Body: `{ email, newPassword }`.
  - Requires `isOtpVerified === true`; hashes new password and clears the flag.

Protected user route

- `GET /api/user/current` — Protected with `isAuth` middleware.
  - Reads JWT from cookie `token`, validates it, and returns the current user's record.

Implementation notes & frontend integration
- Cookies: the server issues an HTTP-only cookie named `token`. Backend CORS is configured to allow `http://localhost:5173` and `credentials: true`.
- Axios/fetch: include credentials on requests. Example Axios call used across the frontend:

```js
// send credentials along with request
axios.post(`${serverUrl}/api/auth/signin`, { email, password }, { withCredentials: true });

// get current user
axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
```

- Firebase Google sign-in: frontend uses Firebase `signInWithPopup` to get the Google user, then posts that to the backend's `POST /api/auth/google-auth` endpoint to create/return the app user and get a server-issued `token` cookie.
- Frontend uses loader states on button actions (SignIn / SignUp) for better UX; see `Frontend/src/pages/SignIn.jsx` and `SignUp.jsx`.

Security & production notes
- Use secure cookies in production: set `secure: true` and ensure HTTPS.
- Use strong `JWT_SECRET` and rotate it when needed.
- Use rate limiting / captchas on `send-otp` to prevent abuse.
- For Gmail, use App Passwords or a transactional email provider (SendGrid, Mailgun) for production.

Next steps & ideas to showcase
- Add Socket.IO based live-tracking and a small simulation UI for recruiters to demo live location updates.
- Implement Razorpay checkout flow end-to-end with webhook verification.
- Add automated tests for API endpoints (Jest + Supertest) and CI workflow (GitHub Actions).
- Add `Backend/.env.example` and `Frontend/.env.example` for easy onboarding.

How I can help
- I can add `Backend/.env.example` and `Frontend/.env.example` now.
- I can add a short OpenAPI/Swagger spec for these endpoints or a Postman collection for quick demo.
- I can scaffold Docker + docker-compose to run both services locally with one command.

Contact
- If you'd like, I can draft a short README summary (one-page) suitable for attaching to job applications or a portfolio with screenshots and demo steps.

---

This README reflects the current implementation: email/password auth, Google sign-in flow, OTP password reset, HTTP-only cookie auth, and a protected `GET /api/user/current` route. Ask me to keep the docs synced as you add payments, tracking, and admin features.

- Consider rate-limiting `send-otp` requests and storing a short cooldown to avoid abuse.

If you'd like, I can add a `Backend/.env.example` and `Frontend/.env.example` next with these variables prefilled as examples.

Example fetch (frontend) — signin:

```js
await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signin`, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	credentials: 'include',
	body: JSON.stringify({ email, password })
});
```

