# GEMINI.md: Manage Fee Project Profile

## 🤖 Current Project Context (2026-02-28)
- **Project Name:** Manage Fee (管理費匯整)
- **Status:** Refactoring Complete. E2E Testing Environment configured. Production-ready.
- **Tech Stack:** React 19, Vite 7, Tailwind CSS v4, Zustand, Firebase (Modular SDK), Playwright.
- **Architecture:** Service-Hook-UI Pattern.

## 🏗 Architectural Mandates
1. **Service Layer (`src/services/`):** Firebase initialization using Vite environment variables.
2. **Hook Layer (`src/hooks/`):** 
   - `useAuth`: Handles anonymous and admin authentication.
   - `useData`: Manages real-time Firestore synchronization and data mutations.
3. **Store Layer (`src/store/`):** 
   - `useAuthStore`: Zustand store for user and admin state.
   - `useDataStore`: Zustand store for payment records.
4. **UI Layer (`src/components/`):** Lucide-styled functional components. Logic is delegated to Hooks.

## 🧪 Testing & Environments
- **Multi-Env Support:** 
  - Production: `.env.production` -> `VITE_APP_ID=manage-fee-prod`
  - Testing: `.env.test` -> `VITE_APP_ID=manage-fee-test`
- **E2E Testing:** Playwright configured in `tests/manage-fee.spec.ts`. Run via `npm run test:e2e`.

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

---

## 💡 Resume Context Prompt (For next session)
"Hi Gemini, please resume work on the Manage Fee project.
The project is a React 19 SPA following the Service-Hook-UI pattern.
- Build Tool: Vite 7
- CSS: Tailwind v4
- State: Zustand
- Testing: Playwright E2E
- Backend: Firebase Modular SDK
Please analyze the `src/hooks/useData.ts` and `tests/manage-fee.spec.ts` to understand the current implementation of data synchronization and automated testing before we proceed."
