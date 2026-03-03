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

### Multi-Environment Support
This project uses Vite modes to separate production and test environments:
- **Production:** Uses `.env.production` (`VITE_APP_ID=manage-fee-prod`)
- **Testing:** Uses `.env.test` (`VITE_APP_ID=manage-fee-test`)

### Testing
We use [Playwright](https://playwright.dev/) for end-to-end testing. The tests run against the test environment to avoid data pollution.
```bash
# Run tests in headless mode
npm run test:e2e

# Run tests with UI for debugging
npx playwright test --ui
```

## Features
- Real-time payment tracking.
- Progress visualization by zones (Orange for completed, Blue for reconciled).
- **Sorting functionality:** Supports sorting by House Number, Remittance Time, and Updated Time (Admin).
- Enhanced time selection with 0-24h options and cross-month backfill support.
- Admin dashboard with CSV/PDF export and data management.
- Secure authentication (Anonymous for users, Email/Password for Admin).
