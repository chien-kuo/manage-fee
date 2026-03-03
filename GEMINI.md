# GEMINI.md: Manage Fee Project Profile

## 🤖 Current Project Context (2026-03-03)
- **Project Name:** Manage Fee (管理費匯整)
- **Status:** Enhanced time selection and cross-month backfill support implemented.
- **Tech Stack:** React 19, Vite 7, Tailwind CSS v4, Zustand, Firebase (Modular SDK), Playwright.
- **New Features:** 
  - Added `bankName` and `lastFiveDigits` fields to payment records.
  - Implemented Admin Reconciliation (已對帳) toggle with multi-select support.
  - Visual sync: Reconciled status displayed in Blue in `ProgressOverview`.
  - **Enhanced Time Selection:** Supports 0-24h selection and intelligent cross-month backfill (auto-validates dates when switching months).

## 🏗 Architectural Mandates
1. **Service Layer (`src/services/`):** Firebase initialization using Vite environment variables.
2. **Hook Layer (`src/hooks/`):** 
   - `useAuth`: Handles anonymous and admin authentication.
   - `useData`: Manages real-time Firestore synchronization and data mutations, including the `markAsReconciled` batch toggle logic.
3. **Store Layer (`src/store/`):** 
   - `useAuthStore`: Zustand store for user and admin state.
   - `useDataStore`: Zustand store for payment records and shared `selectedIds`.
4. **UI Layer (`src/components/`):** Tailwind-styled functional components. Logic is delegated to Hooks.

## 🧪 Testing & Environments
- **Multi-Env Support:** 
  - Production: `.env.production` -> `VITE_APP_ID=manage-fee-prod`
  - Testing: `.env.test` -> `VITE_APP_ID=manage-fee-test`
- **Security:** E2E test credentials are moved to `.env.test.local` (ignored by Git) and loaded via `dotenv` in `playwright.config.ts`.
- **E2E Testing:** Playwright configured in `tests/manage-fee.spec.ts`. Run via `npm run test:e2e`. Covers submission with bank info and admin reconciliation toggle.

## 🛠 Required Environment Variables (Vite Prefix)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_APP_ID`
- `VITE_PUBLIC_COLLECTION`
- `VITE_TEST_ADMIN_EMAIL` (Local only)
- `VITE_TEST_ADMIN_PASSWORD` (Local only)

---

## 💡 Resume Context Prompt (For next session)
"Hi Gemini, please resume work on the Manage Fee project.
The project is a React 19 SPA following the Service-Hook-UI pattern.
- Latest Features: Enhanced time selection (0-24h) and cross-month backfill support.
- UI Logic: Completed units are Orange, Reconciled units are Blue.
- Testing: Verified with Playwright E2E tests and manual time selection checks.
Please analyze `src/components/InputForm.tsx` to understand the latest date/time validation logic before we proceed."
