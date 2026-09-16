# Handelingen Ministries International Platform

Multi-tenant church/ministry management platform. This repository currently
implements the application shell, design system, public homepage, NL/EN
authentication, church selection, role permissions, and data-access foundations.
Business functionality (members, ministries,
events, documents, reporting, etc.) is intentionally deferred to later
layers - see [Roadmap](#roadmap).

## Technology stack

| Concern | Choice |
| --- | --- |
| Frontend framework | React 19 + TypeScript |
| Build tool / dev server | Vite |
| Styling | Tailwind CSS v4 (CSS-first `@theme`, see `src/index.css`) |
| Routing | React Router v7 |
| Internationalization | i18next / react-i18next |
| Backend | Firebase Authentication, Firestore, Storage and Hosting; no Cloud Functions implemented |
| Linting | oxlint |
| Tests | Vitest, React Testing Library, Firebase rules emulator |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Firebase project config
npm run dev
```

Other scripts:

```bash
npm run typecheck   # tsc project references, no emit
npm run lint        # oxlint
npm test            # unit and component regressions
npm run test:rules  # security tests; local Firestore emulator must be running on 8180
npm run build       # typecheck + production build
npm run preview     # preview the production build locally
```

Public pages render without Firebase configuration. Authentication and protected
pages require a configured project. Never use production data for security tests.
With Java 21+ and Firebase CLI installed, run the isolated security suite with:

```bash
firebase emulators:exec --only firestore --project demo-hand "npm run test:rules"
```

On Windows, use `npm.cmd` if the PowerShell execution policy blocks `npm.ps1`.

## Project structure

```
src/
  app/
    routes/        Route table (AppRoutes) and top-level route components
    providers/      App-wide providers: ThemeProvider, ErrorBoundary, AppProviders
    config/         app.config.ts (static config), env.config.ts (typed env access)
  components/
    ui/             Design-system primitives: Button, Input, Dialog, Table, ...
    layout/         AppShell, Sidebar, Topbar, PageContainer
    navigation/     navigation.config.ts; nav-items.ts is a derived compatibility view
    shared/         Cross-feature building blocks (e.g. PlaceholderPage)
  features/
    auth/           AuthContext/AuthProvider (Firebase Auth + permission check)
    dashboard/      Dashboard landing page
    ministries/ departments/ members/ leaders/ events/ documents/
    tasks/ reports/ notifications/ settings/
                    One page component per navigation destination
  hooks/            useMediaQuery, useClickOutside
  lib/              firebase.ts - lazy Firebase app/auth/firestore/storage init
  services/         firestore-repository.ts - generic data-access layer
  types/            auth.ts (roles/permissions), common.ts (AppError, AsyncState, ...)
  utils/            cn.ts (className composition)
  i18n/             i18next setup + locales/{nl,en}/common.json
  styles/           tokens.css - design tokens (color, type, spacing, effects)
```

Directories are only created where they hold real content - no placeholder
empty folders.

## Architectural principles

- **Single source of truth for navigation.** `components/navigation/navigation.config.ts`
  drives the sidebar, the breadcrumb, and (eventually) route guards. Add a
  destination once, it shows up everywhere consistently.
- **Design tokens over hardcoded values.** All colors, spacing, radii,
  shadows and typography are CSS custom properties in `styles/tokens.css`,
  mapped into Tailwind via `@theme inline` in `src/index.css`. Dark mode
  redefines the same tokens under `[data-theme="dark"]` and
  `prefers-color-scheme: dark`.
- **UI never talks to Firebase directly.** Components call into
  `services/` (e.g. `FirestoreRepository`), which normalizes every failure
  into an `AppError` (`types/common.ts`) so the UI only ever renders
  `ErrorState`, never a raw provider error.
- **Authorization is a server-side concern.** `features/auth/AuthContext`
  exposes `hasPermission()` for UI-level show/hide decisions only; the real
  enforcement point is Firestore/Storage Security Rules and Cloud
  Functions when introduced. New profiles use `member` / `pending`. Permission
  checks deny inactive accounts; `resource.manage` includes that resource's CRUD actions.
- **i18n by key, not by string.** No user-facing text is hardcoded in a
  component; every string is a `t('namespace.key')` call resolved from
  `i18n/locales/<lng>/common.json`. Adding a language means adding a locale
  file and registering it in `app/config/app.config.ts`.

## Routing

Routes are defined in `src/app/routes/AppRoutes.tsx`. Public routes include `/`,
`/select-church`, `/register`, `/login`, `/forgot-password`, `/reset-password`.
`/profile` and `/verify-email` require authentication. Other application routes
require a verified, active account with a church. Module pages remain placeholders;
real administrative operations must also use `RequirePermission` and backend rules.
Application routes: `/dashboard`, `/ministries`, `/departments`,
`/members`, `/leaders`, `/events`, `/documents`, `/tasks`, `/reports`,
`/notifications`, `/settings`, plus a catch-all 404.

## Authentication & authorization foundation

- `src/lib/firebase.ts` lazily initializes the Firebase app/Auth/Firestore/
  Storage clients, and is a safe no-op until `.env.local` is filled in.
- `src/features/auth/AuthContext.tsx` subscribes to Firebase Auth state and
  observes ID-token and profile changes and exposes `status`, `user`,
  `firebaseUser`, `hasPermission`, and `refreshProfile` via `useAuth()`.
- `src/types/auth.ts` defines the permission model: `Permission` is a
  `"resource.action"` string (e.g. `members.create`). Roles map to permissions
  in `lib/authorization.ts`. Firestore rules independently enforce access.
- Registration validates an active church before account creation. Google
  registration creates a safe profile without overwriting existing roles or churches.
  Partial email registration can be retried within its authenticated session.
- `hmi.selectedChurchId` is the shared registration storage key. It stores only
  an ID; selection is revalidated against Firestore. Passwords are never stored there.
- First privileged-role bootstrap requires trusted administration. Church admins
  cannot promote themselves or grant global privileges. Unimplemented collection
  writes are denied. Client activity reports are not authoritative admin audit logs.

## Environment variables

See `.env.example` for the full list. All variables are `VITE_`-prefixed
and therefore public in the built client bundle - never put a server-only
secret in this file or in `app/config/env.config.ts`.

## Roadmap

Next: member registration intake and a church-scoped review queue. Separate
email verification (identity) from membership approval (organizational access).
Use an idempotent submission, validated immutable church ID, explicit review
permissions, backend validation, and trusted audit events. Do not add payroll,
finance, or other unrelated modules to this step.

Deferred to later layers (see
the Master Build Prompt phases): complete member/ministry/department/
leader/event/document management, reporting, financial management, an AI
assistant, advanced analytics, workflow automation, advanced audit
logging, advanced notifications, and third-party integrations.

## September 2026 repair audit

Fixed conflicting/unsafe Firestore rules, self-promotion paths, Storage ownership,
auth state races, token refresh, ignored login persistence, Google church profile
creation, duplicate church services/context keys, malformed style utilities,
responsive heading overrides, missing English keys, nested dropdown buttons,
and registration modal focus/navigation. The unused broken registration prototype
is preserved in `docs/reference/RegistrationCard.tsx.txt` outside compiled source.

Local checks: 56 unit/component tests and 8 Firestore emulator cases passed,
alongside typecheck/build. Browser smoke checks covered desktop homepage, mobile
login validation, language/theme switching, registration modal and public route
protection. Production email delivery, Google OAuth configuration and a full
production registration were not exercised. Lint warnings and the Firebase
bundle-size advisory remain. These local repairs have not been deployed.
