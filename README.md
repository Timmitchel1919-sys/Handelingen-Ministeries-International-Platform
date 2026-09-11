# Handelingen Ministries International Platform

Multi-tenant church/ministry management platform. This repository currently
implements **Layer 0 - Project Foundation**: application shell, design
system, routing, i18n, and the architectural foundation for authentication,
authorization and data access. Business functionality (members, ministries,
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
| Backend | Firebase (Authentication, Firestore, Storage, Cloud Functions, Hosting) |
| Linting | oxlint |

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
npm run build       # typecheck + production build
npm run preview     # preview the production build locally
```

The app runs and renders the full shell/navigation without Firebase
configured - `src/lib/firebase.ts` no-ops when environment variables are
missing (a console warning is logged in dev) so the UI foundation can be
developed independently of a live Firebase project.

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
    navigation/     nav-items.ts - single source of truth for primary navigation
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

- **Single source of truth for navigation.** `components/navigation/nav-items.ts`
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
  Functions. No authenticated user is assumed to be an administrator - a
  user resolves to zero roles until later layers wire up role lookup.
- **i18n by key, not by string.** No user-facing text is hardcoded in a
  component; every string is a `t('namespace.key')` call resolved from
  `i18n/locales/<lng>/common.json`. Adding a language means adding a locale
  file and registering it in `app/config/app.config.ts`.

## Routing

All routes are defined in `src/app/routes/AppRoutes.tsx` and rendered
inside `AppShell` (sidebar + topbar + content outlet), so every page shares
one layout. Current routes: `/dashboard`, `/ministries`, `/departments`,
`/members`, `/leaders`, `/events`, `/documents`, `/tasks`, `/reports`,
`/notifications`, `/settings`, plus a catch-all 404.

## Authentication & authorization foundation

- `src/lib/firebase.ts` lazily initializes the Firebase app/Auth/Firestore/
  Storage clients, and is a safe no-op until `.env.local` is filled in.
- `src/features/auth/AuthContext.tsx` subscribes to Firebase Auth state and
  exposes `{ status, user, roles, hasPermission }` via `useAuth()`.
- `src/types/auth.ts` defines the permission model: `Permission` is a
  `"resource.action"` string (e.g. `members.create`), `Role` is a named
  bundle of permissions. This is the shape later layers populate from
  Firestore - no schema change should be required to add real roles.

## Environment variables

See `.env.example` for the full list. All variables are `VITE_`-prefixed
and therefore public in the built client bundle - never put a server-only
secret in this file or in `app/config/env.config.ts`.

## Roadmap

Layer 0 deliberately stops at the foundation. Deferred to later layers (see
the Master Build Prompt phases): complete member/ministry/department/
leader/event/document management, reporting, financial management, an AI
assistant, advanced analytics, workflow automation, advanced audit
logging, advanced notifications, and third-party integrations.
