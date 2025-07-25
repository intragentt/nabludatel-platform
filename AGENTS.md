# AGENTS Instructions for `nabludatel-platform`

This repository is a monorepo containing several Node.js/TypeScript packages and apps.
The layout is:

- `admin/` – React admin panel built with Vite.
- `backend/` – Express API server storing data in JSON files.
- `apps/site-runner/` – small server to render static sites using the UI package.
- `packages/`
  - `core/` – shared TypeScript interfaces and utilities.
  - `ui/` – React UI component library.
- `core/` – additional utilities (project info, slugify helper).
- `scripts/` – helper scripts for development banners and logs.

## How it works

1. **Backend** (`backend/`)
   - Runs an Express server on port 3001.
   - Stores users and site data in `backend/db/*.json` files.
   - Provides REST API routes under `/api/*` for users, auth, uploads and sites.
   - Uses simple JWT auth middleware located in `backend/middlewares/`.
   - Uploaded files are saved under `backend/uploads/` and served statically.

2. **Admin** (`admin/`)
   - Vite + React SPA for managing users/sites.
   - Communicates with the backend via fetch calls.
   - Uses Tailwind for styling. Entry point: `admin/src/main.tsx`.

3. **UI Package** (`packages/ui`)
   - Contains reusable React components (header, product card, etc.).
   - Consumed by other apps like `site-runner`.

4. **Site Runner** (`apps/site-runner`)
   - Minimal Express/React server for rendering a storefront using components
     from the UI and data from packages/core.

5. **Core Utilities** (`core/` and `packages/core`)
   - Provide small helpers like `slugify` and `project.ts` with git metadata.

## Development

- Install dependencies with `pnpm install`.
- Run `pnpm dev` to launch all apps via Turborepo (admin + backend).
- Backend scripts live under `scripts/`. `printServerStop.ts` logs shutdown info.

There are currently no automated tests. When modifying code, please ensure
`npx tsc -p backend/tsconfig.json --noEmit` runs without new errors.

