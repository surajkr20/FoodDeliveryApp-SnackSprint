
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

