# Manage Fee (管理費匯整)

A modern React SPA for tracking community management fee payments.

## Tech Stack
- **Frontend:** React 19, Vite 7, Tailwind CSS v4
- **State Management:** Zustand
- **Backend:** Firebase (Auth, Firestore)
- **Deployment:** Vercel / Netlify

## Architecture (Service-Hook-UI Pattern)
- `src/services/`: Singleton service initializations (Firebase).
- `src/hooks/`: Business logic and data fetching hooks.
- `src/store/`: Zustand stores for global state.
- `src/components/`: Modular UI components.
- `src/pages/`: Main application views.
- `src/utils/`: Constants and helper functions.

## Getting Started
1. Install dependencies: `npm install`
2. Set up environment variables in `.env` (see below)
3. Run development server: `npm run dev`
4. Build for production: `npm run build`

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_APP_ID=default-house-app
VITE_PUBLIC_COLLECTION=house_opinions_v2
```

## Features
- Real-time payment tracking.
- Progress visualization by zones.
- Admin dashboard with CSV/PDF export and data management.
- Secure authentication (Anonymous for users, Email/Password for Admin).
