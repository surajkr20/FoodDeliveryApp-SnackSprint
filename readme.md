
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
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary API secret

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

Shop & Item Management API

These endpoints allow restaurant owners (`role: owner`) to manage their shop and menu items. Multer handles file uploads to disk, and Cloudinary uploads images to the cloud and returns a secure URL.

Shop endpoints

- `POST /api/shop/create-edit` — Protected with `isAuth` middleware.
  - Description: Create a new shop or update an existing one for the logged-in owner. Only one shop per owner is allowed.
  - Body (FormData): `{ name, city, state, address, pincode, image? }` — `image` is optional; only uploaded if provided.
  - Behavior: Uses multer to accept a single file (`image`), uploads it to Cloudinary, stores the shop record in MongoDB with owner reference.
  - Returns: `201` + the created or updated shop object (includes owner details via `populate("owner")`).
  - Errors: `401` if not authenticated, `500` for server errors.
  - Example request (using FormData / fetch):

```js
const formData = new FormData();
formData.append('name', 'My Restaurant');
formData.append('city', 'Mumbai');
formData.append('state', 'Maharashtra');
formData.append('address', '123 Main St');
formData.append('pincode', '400001');
formData.append('image', fileInputElement.files[0]); // file from <input type="file">

fetch(`${import.meta.env.VITE_API_URL}/api/shop/create-edit`, {
  method: 'POST',
  credentials: 'include',
  body: formData
}).then(r => r.json()).then(shop => console.log('Shop created:', shop));
```

Item (menu) endpoints

- `POST /api/item/create-item` — Protected with `isAuth` middleware.
  - Description: Add a new menu item to the shop.
  - Body (FormData): `{ name, category, price, foodtype, image }` — `image` is required.
  - Behavior: Multer accepts a single file, uploads to Cloudinary, creates item linked to the owner's shop.
  - Returns: `201` + the created item object.
  - Errors: `404` if shop not found, `500` for errors.

- `POST /api/item/update-item/:itemId` — Protected with `isAuth` middleware.
  - Description: Update an existing menu item.
  - URL params: `itemId` — the item's MongoDB ID.
  - Body (FormData): `{ name, category, price, foodtype, image? }` — `image` is optional.
  - Behavior: Updates item fields; if a new image is provided, uploads to Cloudinary and replaces the old URL.
  - Returns: `201` + the updated item object.
  - Errors: `400` if item not found, `500` for errors.

File upload & Cloudinary integration

- Multer is configured with `diskStorage` to save uploaded files to `/public` folder temporarily.
- After upload, `UploadOnCloudinary` utility takes the file path, uploads to Cloudinary using `cloudinary.uploader.upload()`, extracts the `secure_url`, and deletes the temporary file.
- Cloudinary credentials must be set in backend env vars.

Owner (Shop) — Frontend integration

The codebase includes frontend support so restaurant owners can manage their shop and items. The flow fetches the owner's shop on app load and stores it in Redux for access across components.

Key frontend pieces:
- `Frontend/src/redux/ownerSlice.js` — Redux slice that stores `shopData` and exposes `setShopData`.
- `Frontend/src/hooks/useGetMyShop.jsx` — Hook that calls `GET /api/shop/get-shop` and dispatches `setShopData(result.data)` on success.
- `Frontend/src/redux/store.js` — Combines `user` and `owner` reducers so components can read `state.owner.shopData`.

Backend route:
- `GET /api/shop/get-shop` — Returns the current owner's shop and is protected by `isAuth` middleware. The shop returned is populated with owner details.

How it works:
1. `App.jsx` calls `useGetMyShop()` (and other startup hooks) on app mount.
2. `useGetMyShop` makes an authenticated request with credentials (`withCredentials: true`) to `/api/shop/get-shop`.
3. On success the hook dispatches `setShopData(result.data)` into Redux. The shop object includes an `items` array of populated item references.
4. Components like `Nav.jsx` and `OwnerDashboard.jsx` read `shopData` via `useSelector(state => state.owner)` and render owner-specific UI (shop info, manage items links).

Example (hook dispatch):

```js
const result = await axios.get(`${serverUrl}/api/shop/get-shop`, { withCredentials: true });
dispatch(setShopData(result.data)); // shop includes { name, image, items: [...], owner, ... }
```

Notes and recommendations:
- `Nav.jsx` already uses `shopData` to show owner-specific options when available.
- `App.jsx` currently exports `serverUrl = "http://localhost:3000"`; for consistency consider moving to `import.meta.env.VITE_API_URL` and a `Frontend/.env` file.
- Make sure `ownerSlice` is included in the store (`store.js`) so `useGetMyShop` can dispatch successfully.

Owner item management — Add, Edit & Display

After setting up a shop, owners can add menu items and manage them through dedicated pages. This feature demonstrates CRUD operations on related documents and a full-featured dashboard.

Backend item endpoints
- `POST /api/item/create-item` — Protected with `isAuth` middleware.
  - Description: Add a new food item to the owner's shop.
  - Body (FormData): `{ name, category, price, foodtype, image }` — `image` is required.
  - Behavior: Multer accepts a single file, uploads to Cloudinary. Backend validates the owner has a shop, creates the item, pushes it to `shop.items[]`, and returns the populated shop object.
  - Returns: `201` + updated shop with the new item in the `items` array.
  - Errors: `404` if shop not found, `500` for server errors.

- `POST /api/item/update-item/:itemId` — Protected with `isAuth` middleware.
  - Description: Edit an existing menu item.
  - URL params: `itemId` — the item's MongoDB ID.
  - Body (FormData): `{ name, category, price, foodtype, image? }` — `image` is optional.
  - Behavior: Validates the owner's shop, updates the item (including image if provided via Cloudinary), returns the updated shop with all items populated.
  - Returns: `201` + updated shop.
  - Errors: `400` if item not found, `500` for errors.

- `GET /api/item/get-item/:itemId` — Public route (no auth required).
  - Description: Fetch a single item's details.
  - Returns: `200` + item object.

Frontend item management pages

- `Frontend/src/pages/AddFoodItems.jsx` — Form to create a new food item.
  - Features: Inputs for item name, category (select from predefined list), food type (`veg`/`non veg`), price, image.
  - Client-side image preview using `URL.createObjectURL`.
  - Submits as `FormData` to `POST /api/item/create-item` with credentials.
  - On success dispatches `setShopData(result.data)` and navigates home.
  - Shows loader state during submission.

- `Frontend/src/pages/EditFoodItems.jsx` — Form to edit an existing food item.
  - Fetches the current item from the shop via `itemId` URL param.
  - Pre-fills all fields (name, category, type, price, image).
  - Image is optional on edit — only uploads if user selects a new file.
  - Submits to `POST /api/item/update-item/:itemId`.
  - Dispatches updated shop data and navigates home.

Owner dashboard & item display

- `Frontend/src/dashboards/OwnerDashboard.jsx` — Main owner view showing shop status and items.
  - If `shopData` is null: displays a card prompting owner to create a shop with "Get Started" button linking to `/create-edit-shop`.
  - If `shopData` exists but has no items: displays a card prompting to add items with "Add Food" button linking to `/add-shop-items`.
  - If `shopData` exists with items: displays the shop banner (image with edit button), shop details (name, owner, address), and a grid of items via the `ShowFoodItems` component.
  - Edit shop link in the top-right of the shop banner for quick access to `CreateEditShop`.

- `Frontend/src/components/ShowFoodItems.jsx` — Item card component displayed on the owner dashboard.
  - Shows item image, name, category, food type, and price.
  - Includes Edit button (green) that navigates to `/edit-shop-items/{itemId}`.
  - Includes Delete button (red) — currently navigates to add items page (placeholder for delete logic).
  - Used in a grid layout on `OwnerDashboard` when items exist.

Routes and guards

The following routes are added to `App.jsx`:
- `/create-edit-shop` — Redirects to signin if `userData` is not set.
- `/add-shop-items` — Requires both `userData` and `shopData` to exist (owner must create shop first).
- `/edit-shop-items/:itemId` — Requires `userData`, `shopData`, and at least one item in the shop.

UX highlights
- Progressive disclosure: users must complete setup steps in order (signup → create shop → add items).
- Loader states on all form submissions (AddFoodItems, EditFoodItems, CreateEditShop) for clear feedback.
- Image previews before upload so owners see what they're adding.
- Quick edit links from the dashboard to manage items without leaving the view.

Data flow summary
1. Owner signs up / signs in → `useGetCurrentUser` fetches user, `useGetMyShop` fetches shop.
2. Owner navigates to `/create-edit-shop` → creates or edits shop via `CreateEditShop` page.
3. Dashboard shows shop created → "Add Food" button is now available.
4. Owner clicks "Add Food" → `/add-shop-items` page with form.
5. On submit → `POST /api/item/create-item` → backend adds item to shop and updates Redux via `setShopData`.
6. Dashboard refreshes and shows the new item in the items grid.
7. Owner can click edit icon on any item → `/edit-shop-items/{itemId}` → fetch item details, edit form, submit to `POST /api/item/update-item/:itemId}`.
8. Dashboard updates after successful edit.

What I added to the README
- Detailed item management endpoints and behaviors.
- Frontend page descriptions (AddFoodItems, EditFoodItems, OwnerDashboard, ShowFoodItems).
- Route guards and UX flow.
- Data flow summary showing the complete owner journey from shop creation to item management.

Create / Edit Shop page & location hook

This project includes a dedicated owner page to create or edit the restaurant (shop) and a location hook that pre-fills city/state/address from the browser's geolocation. These features improve onboarding speed for owners and demonstrate practical UX for merchant flows.

Key frontend files
- `Frontend/src/pages/CreateEditShop.jsx` — Page with a form (Shop Name, City, State, Address, Image). Features:
  - Pre-fills City/State/Address using global user state populated by `useGetCity`.
  - Image preview on the client using `URL.createObjectURL` before upload.
  - Submits as `FormData` to `POST /api/shop/create-edit` with `withCredentials: true`.
  - Shows a loader state on submit (uses `ClipLoader`).
  - On success dispatches `setShopData(result.data)` to update Redux and clears the form.

- `Frontend/src/hooks/useGetCity.jsx` — Geolocation hook that:
  - Uses `navigator.geolocation.getCurrentPosition` to retrieve latitude/longitude.
  - Calls an external reverse-geocoding API (Geoapify) using `VITE_GEOLOCATION_APIKEY` to resolve `city`, `state`, `country`, and `address_line2`.
  - Dispatches those values to the Redux `user` slice: `setCity`, `setState`, `setCountry`, `setCurrentAddress`.

- `Frontend/src/redux/userSlice.js` — Holds global user-related fields used across the app:
  - `userData` (current user object)
  - `city`, `country`, `state`, `currentAddress` (populated by `useGetCity`)

How these pieces work together
1. On app mount `App.jsx` calls `useGetCity()` and `useGetMyShop()` (and `useGetCurrentUser()`).
2. `useGetCity` sets `city`, `state`, `country` and `currentAddress` in the `user` slice so pages like `CreateEditShop` can pre-fill inputs.
3. Owner opens `CreateEditShop` — the form loads values from `shopData` (if editing) or from the `user` slice for location fields.
4. Owner can choose an image file; the page shows a client-side preview. When submitting, the page builds `FormData`, attaches the image if present, and posts to `POST /api/shop/create-edit`.
5. Backend handles image upload (multer + Cloudinary), creates/updates the shop, and returns the shop object which the frontend stores in the `owner` slice via `setShopData`.

Route & UX notes
- `App.jsx` exposes the route `/create-edit-shop` which is guarded by redirect logic (`Navigate`) when the user is not authenticated.
- The `CreateEditShop` page uses `loading` state to give the owner clear feedback during network operations; this is important for recruiter-facing demos showing polished UX.

Security & privacy notes
- Geolocation is requested from the user's browser; ensure you present a clear reason in the UI why location is needed and fallback gracefully if the user denies permission.

What I added to the README
- A professional section describing the `CreateEditShop` page, the `useGetCity` geolocation hook, the `user` Redux fields, and the end-to-end flow for owners creating/updating a shop.

Next steps I can take
- Replace hard-coded `serverUrl` with `import.meta.env.VITE_API_URL` and add `Frontend/.env.example`.
- Add a small owner dashboard view that lists items and shows quick links to add/edit items.
- Add client-side validation and friendly messages for geolocation permission denial.


Example FormData request for creating an item:

```js
const formData = new FormData();
formData.append('name', 'Biryani');
formData.append('category', 'Rice');
formData.append('price', 350);
formData.append('foodtype', 'veg');
formData.append('image', fileInput.files[0]);

fetch(`${import.meta.env.VITE_API_URL}/api/item/create-item`, {
  method: 'POST',
  credentials: 'include',
  body: formData
}).then(r => r.json()).then(item => console.log('Item created:', item));
```

Data models (schema overview)

- **User:** `fullname`, `email`, `password` (hashed), `mobile`, `role` (`user|owner|deliveryboy`), plus OTP fields.
- **Shop:** `name`, `city`, `state`, `address`, `pincode`, `image` (Cloudinary URL), `owner` (ref to User), timestamps.
- **Item:** `name`, `category`, `foodtype` (`veg|nonveg`), `price`, `image` (Cloudinary URL), `shop` (ref to Shop), timestamps.

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

