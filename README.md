# Film

A movie catalogue: a React client with an informational home page, a searchable catalogue with genre filters, an add-movie form and light/dark themes, backed by a NestJS + PostgreSQL REST API.

```
gorb-work/
├─ client/   UI — React 19, Vite, TanStack Query (works standalone on a mock backend)
└─ server/   API — NestJS 12, TypeORM, PostgreSQL, Firebase Storage (prepared)
```

Each folder is a separate npm project with its own dependencies and scripts.

## Quick start

Requires **Node.js `^20.19` or `>=22.12`** and Docker (for PostgreSQL).

```bash
# 1. API
cd server
cp .env.example .env
docker compose up -d          # PostgreSQL on localhost:5433
npm install
npm run start:dev             # http://localhost:3000/api

# 2. Client
cd ../client
npm install
npm run dev                   # http://localhost:5173
```

Out of the box the client uses an in-browser mock backend. To talk to the real API, create `client/.env.local`:

```env
VITE_API_MOCKS=false
VITE_API_URL=http://localhost:3000/api
```

## Features

- **Home** — “Who we are” section with team and stats, a “Top 10” carousel by rating, genre tiles, a newsletter form (validation only, no backend yet).
- **Catalogue** (`/movies`) — card grid, title search from the header, genre filter.
- **Add movie** (`/movies/new`) — react-hook-form + zod form: field validation, character counter, genre suggestions, server errors shown next to the fields.
- **API** — CRUD for movies with validation that mirrors the client form, a consistent error format and case-insensitive duplicate title detection.
- **Theme** — header toggle; the choice is stored in `localStorage`, defaults to the system theme, no flash on load.
- **Responsive** — mobile menu, separate mobile search, horizontally scrolling chips and carousel on small screens.
- **404 and error page** for unknown routes and render errors.

## Tech stack

| Area           | Tools                                                                      |
| -------------- | -------------------------------------------------------------------------- |
| Client UI      | React 19, TypeScript 6                                                     |
| Client build   | Vite 8, `@vitejs/plugin-react`                                             |
| Styles         | Tailwind CSS 4 (CSS-first), `clsx` + `tailwind-merge`, Inter               |
| Routing        | React Router 7 (`createBrowserRouter`, nested routes)                      |
| Client data    | TanStack Query 5, axios, zod (response validation)                         |
| UI state       | Zustand 5 (`devtools`, `persist`)                                          |
| Forms          | React Hook Form + `@hookform/resolvers` + zod                              |
| Icons          | lucide-react                                                               |
| API            | NestJS 12, `@nestjs/config`                                                |
| Database       | PostgreSQL 17 (Docker), TypeORM                                            |
| API validation | class-validator, class-transformer                                         |
| File storage   | Firebase Admin (Cloud Storage), prepared for movie posters                 |
| Quality        | Client: ESLint 10, Prettier 3. API: oxlint, Prettier 3, Vitest + Supertest |

## Scripts

### Client (`client/`)

| Command                | What it does                                |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Dev server with HMR                         |
| `npm run build`        | Type check and production build into `dist` |
| `npm run preview`      | Preview the production build locally        |
| `npm run typecheck`    | Type check only                             |
| `npm run lint`         | ESLint                                      |
| `npm run lint:fix`     | ESLint with autofix                         |
| `npm run format`       | Format with Prettier                        |
| `npm run format:check` | Check formatting                            |

### API (`server/`)

| Command              | What it does                                         |
| -------------------- | ---------------------------------------------------- |
| `npm run start:dev`  | Start with restart on changes                        |
| `npm run build`      | Build into `dist`                                    |
| `npm run start:prod` | Run the built app                                    |
| `npm run lint`       | oxlint                                               |
| `npm run format`     | Format with Prettier                                 |
| `npm run test:e2e`   | API tests (no database needed, repository is mocked) |

## Environment variables

### Client

Copy `client/.env.example` to `client/.env.local`. Variables are validated with a zod schema in `src/config/env.ts`: if a value is invalid, the app does not start and reports which variable is wrong.

| Variable           | Default                     | Description                                          |
| ------------------ | --------------------------- | ---------------------------------------------------- |
| `VITE_API_URL`     | `http://localhost:3000/api` | API base URL                                         |
| `VITE_API_MOCKS`   | `true`                      | `true` — in-browser mock backend, `false` — real API |
| `VITE_API_TIMEOUT` | `10000`                     | Request timeout, ms                                  |

### API

Copy `server/.env.example` to `server/.env`. Variables are validated on startup (`src/config/env.validation.ts`): with an invalid value the server does not start and reports which variable is wrong.

| Variable              | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| `PORT`                | API port, defaults to `3000`                                            |
| `CLIENT_URL`          | Client origin allowed by CORS, defaults to `http://localhost:5173`      |
| `DB_HOST` … `DB_NAME` | PostgreSQL connection; `docker-compose.yml` uses the same values        |
| `DB_SYNCHRONIZE`      | `true` — TypeORM syncs the schema with entities. Local development only |
| `FIREBASE_*`          | Firebase service account. Leave empty to run without file storage       |

## Project structure

### Client

```
client/src/
├─ api/
│  ├─ http.ts           axios instance: baseURL, timeout, error normalisation
│  ├─ errors.ts         ApiError and toApiError
│  ├─ movies/           schemas (zod), api (requests), queries (TanStack Query keys and hooks)
│  └─ mock/             mock backend: axios adapter, routes, in-memory DB, seed data
├─ app/                 router, routes, QueryClient, providers
├─ config/env.ts        typed environment variables
├─ layouts/root/        RootLayout with <Outlet />, Header, Footer, search, theme toggle
├─ pages/
│  ├─ home/             home: About, Top 10 carousel, genres, newsletter
│  ├─ movies/           catalogue: page, genre filter, movie card
│  ├─ add-movie/        add-movie page and form
│  ├─ not-found/        404
│  └─ error/            router error page
├─ store/               zustand stores: catalogue filters and theme
├─ ui/                  shared UI primitives: Skeleton, QueryError, PageLoader
├─ lib/                 utilities (cn)
└─ styles/index.css     Tailwind: theme, tokens, base styles
```

Rule of thumb: a component lives next to the page or layout that uses it; `ui/` holds only primitives shared by several pages. Cross-module imports go through the `@/` alias (`@/api/movies/movies.queries`).

### API

```
server/src/
├─ main.ts               /api prefix, CORS, global validation
├─ app.module.ts         config, TypeORM, response serialisation
├─ config/               registerAs configs and env validation
├─ common/               ValidationPipe with the client error format, transformers
├─ firebase/             FirebaseModule (global) and FirebaseStorageService
└─ movies/               movies module: entity, DTOs, service, controller
```

## Routes

| Path          | Page      |
| ------------- | --------- |
| `/`           | Home      |
| `/movies`     | Catalogue |
| `/movies/new` | Add movie |
| `*`           | 404       |

Pages are lazy-loaded (`lazy` in the router), each in its own chunk. To add a page: create a folder in `src/pages/` with a component as `export default`, add the path to `src/app/routes.ts` and a child route `lazy: page(() => import(...))` to `src/app/router.tsx` — it renders inside `RootLayout` via `<Outlet />`. To show a link in the header and footer, add it to `src/layouts/root/navigation.ts`.

## Styles and theme

Tailwind 4 is configured without `tailwind.config.js` — everything lives in `src/styles/index.css`:

- `--color-brand-*` — brand palette (indigo): `bg-brand-600`, `text-brand-400`…
- semantic tokens that switch with the theme:

  | Utility             | Purpose              |
  | ------------------- | -------------------- |
  | `bg-surface`        | page background      |
  | `bg-surface-muted`  | section background   |
  | `bg-surface-raised` | cards, inputs        |
  | `border-line`       | borders and dividers |
  | `text-fg`           | primary text         |
  | `text-fg-muted`     | secondary text       |
  | `bg-chrome`         | header and footer    |

- dark theme is enabled by the `.dark` class on `<html>`; the `dark:` variant is available for one-off tweaks;
- restrained corner radii: `rounded-xs` / `rounded-sm` / `rounded-md`;
- utilities `container`, `no-scrollbar`, animation `animate-fade-in`.

Recommended VS Code extensions are listed in `client/.vscode/extensions.json` (Tailwind CSS IntelliSense, ESLint, Prettier, EditorConfig).

## Data flow

```
component → hook (movies.queries) → moviesApi (movies.api) → http (axios) → API | mock adapter
```

- **Server state** lives only in TanStack Query. Keys are collected in `movieKeys`, query options in `moviesListOptions()` / `movieDetailOptions(id)`. Derived data (`useFilteredMovies`, `useGenres`, `useGenreStats`, `useTopMovies`) is computed via `select`, so all of them share one cache and one request.
- **Mutations** — `useCreateMovie()` puts the movie into the detail cache on success and invalidates the lists.
- **QueryClient** (`src/app/query-client.ts`): `staleTime` 1 min, no refetch on window focus, 4xx errors are not retried, others up to 2 times. React Query Devtools are available in dev mode (button in the bottom-left corner).
- **Server responses** are validated with zod schemas in `movies.api.ts`: if the API returns an unexpected shape, it becomes an error immediately instead of a broken UI.
- **Errors** are caught by an axios interceptor and turned into `ApiError` with `status`, `message`, `fieldErrors`. The UI shows them via `QueryError` with a “Try again” button, and the form maps `fieldErrors` onto the matching fields.

### Mock backend

While `VITE_API_MOCKS=true`, axios uses a custom adapter (`src/api/mock/adapter.ts`): requests never hit the network and are handled by routes in `src/api/mock/routes.ts` with an artificial 250–650 ms delay. Data is stored in `localStorage` (`film-mock-db`), so added movies survive reloads; delete that key to reset them.

To add an endpoint: describe the schema in `movies.schemas.ts`, the function in `movies.api.ts`, the hook in `movies.queries.ts`, the handler in `mock/routes.ts` — and the real endpoint in `server/`.

## API

| Method   | Path              | Body                                             | Response                            |
| -------- | ----------------- | ------------------------------------------------ | ----------------------------------- |
| `GET`    | `/api/movies`     | —                                                | `200 Movie[]`                       |
| `GET`    | `/api/movies/:id` | —                                                | `200 Movie` / `404`                 |
| `POST`   | `/api/movies`     | `{ title, genre, year?, rating?, description? }` | `201 Movie` / `409` / `422`         |
| `PATCH`  | `/api/movies/:id` | any subset of the `POST` fields                  | `200 Movie` / `404` / `409` / `422` |
| `DELETE` | `/api/movies/:id` | —                                                | `204` / `404`                       |

`Movie`: `{ id: number, title: string, genre: string, year?: number, rating?: number, description?: string, posterUrl?: string, createdAt: string, updatedAt: string }`.

- Empty optional fields (`null` in the database) are omitted from JSON, since the client treats them as absent. `posterPath` is never returned.
- Strings are trimmed, an empty `description` counts as missing, unknown fields are rejected.
- A duplicate title (case-insensitive) returns `409` with `errors.title`.

Error format understood by the client:

```json
{
  "message": "Some fields are invalid.",
  "errors": { "title": "A movie with this title already exists" }
}
```

`errors` is optional; its keys match the form field names.

## Validation

Rules are defined on the client in `createMovieSchema` (used by both the form via `zodResolver` and the mock backend) and mirrored on the API in `CreateMovieDto` with the same messages. Limits are shared constants: `client/src/api/movies/movies.schemas.ts` ↔ `server/src/movies/movies.constants.ts` — keep them in sync.

| Field         | Rules                                                          |
| ------------- | -------------------------------------------------------------- |
| `title`       | required, 1–120 characters, surrounding whitespace is trimmed  |
| `genre`       | required, 2–40 characters, letters, spaces, `&`, `-`, `'` only |
| `year`        | optional, integer, from 1888 to the current year + 5           |
| `rating`      | optional, 0–10, at most one decimal place                      |
| `description` | optional, up to 500 characters, with a counter                 |

Errors appear after the user leaves a field (`mode: 'onTouched'`). While the form is submitting, fields are disabled; server errors are shown next to the matching fields and as a general message above the form.

## Client state

Zustand holds only client-side UI state; server data lives in TanStack Query.

- `useFiltersStore` — catalogue search query, selected genre and actions (`setSearchTerm`, `setGenre`, `toggleGenre`, `browseGenre`, `resetFilters`). In dev mode the store is visible in Redux DevTools.
- `useThemeStore` — current theme and `toggleTheme`, persisted in `localStorage` under the `film-theme` key.

## Firebase Storage

`FirebaseStorageService` (`upload`, `delete`, `isEnabled`) can be injected into any API module but is not used yet. The `Movie` entity already has `posterUrl` (public link) and `posterPath` (object path in the bucket) columns. To enable storage, fill in `FIREBASE_*` in `server/.env` with service account credentials: Firebase Console → Project settings → Service accounts → Generate new private key. Never commit the JSON key.
