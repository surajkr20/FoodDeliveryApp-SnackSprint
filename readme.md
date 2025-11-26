
# SnackSprint — Food Delivery App (Fullstack)

Brief, opinionated starter for a role-based food delivery application (delivery boy, user, item owner) built with React + Vite, Node.js + Express, MongoDB, Razorpay, JWT/OAuth, and Socket.IO for real-time features.

**Status:** Basic frontend and backend scaffolding completed (see `Frontend/` and `Backend/`). This README will be kept in sync with the codebase as features are added.

**Tech stack:**
- **Frontend:** React + Vite, CSS (or Tailwind/your choice), client-side routing
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas or local)
- **Realtime:** Socket.IO
- **Payments:** Razorpay
- **Auth:** JWT + OAuth (Google) for social login

**Key roles (planned):**
- **User:** Browse restaurants/items, place orders, view order tracking
- **Item Owner:** Manage menu/items, accept orders
- **Delivery Boy:** Accept / pick up orders, update live location

Planned core features:
- Role-based authentication and authorization (JWT + OAuth)
- Order lifecycle: order creation → restaurant acceptance → pickup → delivery
- Live tracking for delivery (Socket.IO + geolocation)
- Razorpay payment integration
- Notifications (in-app / push)
- Admin dashboard and reporting

Folder structure (top-level):
- `Backend/` — Express server, routes, controllers, models
- `Frontend/` — React + Vite app

Environment variables (examples — set in `.env` or environment):

Backend (example):
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `PORT` — Backend port (defaults often to 5000)
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` — Razorpay credentials
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — OAuth credentials
- `FRONTEND_URL` — frontend origin (for CORS / OAuth callbacks)
 - `GMAIL` — Gmail address used to send OTP/reset emails (for `nodemailer`)
 - `APP_PASSWORD` — App password (or SMTP password) for `GMAIL` (use App Passwords for Gmail)

Frontend (example, Vite uses `VITE_` prefix):
- `VITE_API_URL` — `http://localhost:5000` (or your backend URL)
- `VITE_RAZORPAY_KEY_ID` — Razorpay key id used by client

Quick local setup

1) Backend

Open a PowerShell terminal and run:

```powershell
cd <project-root>/Backend
npm install
# create a .env file with the variables above
npm run dev
```

2) Frontend

```powershell
cd 'c:\Users\user\OneDrive\Desktop\Projects\FoodDeliveryApp-SnackSprint\Frontend'
npm install
npm run dev
```

Notes & next steps
- This repo currently contains the initial scaffolding: `Backend/index.js` and `Frontend` Vite app with `App.jsx`, `main.jsx`.
- I recommend adding a `.env.example` in each of `Backend/` and `Frontend/` to make onboarding simpler.
- When you add routes, components, or environment variables, ask me to update this `readme.md` so it matches the code and newly added features.

How I can help next
- Add `.env.example` files and scripts to start both apps together (concurrently or Docker).
- Add basic API docs for existing endpoints.
- Implement and document Razorpay checkout flow and webhooks.

If you'd like, I can now: add a `.env.example` for the backend, or document existing backend routes. Which should I do next?

**API — Authentication**

The backend includes a minimal authentication API with signup, signin and signout routes. All routes are mounted under `/api/auth`.

- `POST /api/auth/signup`
	- Description: Register a new user.
	- Body (JSON): `{ fullname, email, password, mobile, role }` — `role` must be one of `user`, `owner`, or `deliveryboy`.
	- Success: `201` and the created user object. The server sets an HTTP-only cookie named `token` (valid 7 days).
	- Errors: `400` for validation (existing user, short password, short mobile) or `500` for server errors.

- `POST /api/auth/signin`
	- Description: Authenticate user and create session cookie.
	- Body (JSON): `{ email, password }`.
	- Success: `200` and the user object. Sets the same HTTP-only `token` cookie used for auth.
	- Errors: `400` for invalid credentials or missing user, `500` for server errors.

- `POST /api/auth/signout`
	- Description: Clear authentication cookie and sign out.
	- Success: `200` with `{ message: "sign out successfully" }`.

Notes and implementation details:
- The cookie name is `token`, `httpOnly: true`, `sameSite: "strict"`, and a `maxAge` of 7 days. For development the server sets `secure: false`.
- The backend currently allows CORS from `http://localhost:5173` and passes `credentials: true`, so frontend requests must include credentials to send/receive cookies (e.g. `fetch` with `credentials: 'include'`).
- User schema fields: `fullname` (string), `email` (string, unique), `password` (hashed string), `mobile` (string), `role` (`user|owner|deliveryboy`).

Password reset (OTP) — endpoints & client notes

The backend implements an OTP-based password reset flow. These routes are mounted under `/api/auth`:

- `POST /api/auth/send-otp`
	- Description: Generate and email a 4-digit OTP to a registered user's email for password reset.
	- Body (JSON): `{ email }`
	- Behavior: If the email exists, server generates a 4-digit OTP, stores it on the user document as `resetOtp`, sets `otpExpires` to 5 minutes from now, sets `isOtpVerified` to `false`, and sends the OTP by email using `nodemailer`.
	- Success: `200` with `{ message: "otp sent successfully" }`.
	- Errors: `400` if the user does not exist, `500` for server errors.

- `POST /api/auth/verify-otp`
	- Description: Verify the OTP sent to the user's email.
	- Body (JSON): `{ email, otp }`
	- Behavior: Checks that the provided OTP matches `resetOtp` and that `otpExpires` is still valid; on success clears `resetOtp`, sets `isOtpVerified=true` on the user document.
	- Success: `200` with `{ message: "otp verified successfully" }`.
	- Errors: `400` for invalid/expired OTP, `500` for server errors.

- `POST /api/auth/reset-password`
	- Description: Set new password after OTP verification.
	- Body (JSON): `{ email, newPassword }`
	- Behavior: Only allowed for users with `isOtpVerified === true`. Hashes the new password, updates the user record, and clears `isOtpVerified`.
	- Success: `200` with `{ message: "your password changed successfully" }`.
	- Errors: `400` if OTP verification is required or password is too short, `500` for server errors.

Implementation notes:
- OTPs are 4-digit numeric codes and expire after 5 minutes.
- The server uses `nodemailer` configured with `GMAIL` and `APP_PASSWORD` (or other SMTP creds). Add these to your backend environment for the mailer to work.
- The `User` model stores `resetOtp`, `otpExpires`, and `isOtpVerified` fields during the flow (transient; you may clear them after reset).

Frontend integration (example)

The `Frontend/src/pages/ForgetPassword.jsx` page implements a 3-step flow:
- Step 1: Submit registered email to `POST /api/auth/send-otp`.
- Step 2: Submit received OTP to `POST /api/auth/verify-otp`.
- Step 3: Submit new password to `POST /api/auth/reset-password`.

Example Axios calls (the frontend sample uses `axios` with credentials):

```js
// send OTP
axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true });

// verify OTP
axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true });

// reset password
axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true });
```

UX notes:
- Ensure the frontend shows clear success/error messages for each step and prevents proceeding until the server confirms success.
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

If you want, I can also add: a `.env.example`, a short Postman collection, or automated docs (Swagger) for these endpoints. Which would help most right now?

