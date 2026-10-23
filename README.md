# Streamflix - local cinematic edition

## Start on this Windows PC

Double-click **Start-Streamflix.cmd**, then open **http://localhost:3000**.
The launcher uses the portable Node 22 runtime in `.tools`; it does not require a system-wide installation. Keep the terminal open while using the app. Close it to stop the server.

With Node.js 22 installed on another machine:

```sh
npm ci
npm start
```

The GitHub repository excludes `.tools`, `node_modules`, `.env` files, test output, and generated builds. After cloning, install Node.js 22 and run the commands above; `.env.example` documents the optional API configuration.

## What's implemented

- Cinematic responsive discovery page with layered scroll parallax, selectable featured titles, and scroll reveals.
- Movie and series catalogs, title/cast/genre search, genre filtering, and rating/year sorting.
- Browser-persisted personal watchlist with add/remove feedback and empty states.
- Accessible title dialogs with keyboard focus restoration, Escape dismissal, trailers, and MP4/WebM support for connected catalog entries.
- Motion preference with automatic respect for the system's reduced-motion setting.
- Consistent help, about, preferences, account, title, playback, and local subscription information pages.
- A redesigned Studio dashboard with local catalog creation, editing, deletion confirmation, search, and poster previews. Open **Preferences → Open studio**, or visit `/dashboard`.
- The same Studio forms connect to existing movie, TV, and trending API endpoints in API mode. User and order tables show explicit disconnected states in local mode.
- Account forms include validation, loading states, visible service errors, password visibility, and sign-out. Registration and login are enabled only in API mode.
- Vite replaces Create React App; the Studio, account, and watch screens load on demand instead of inflating the discovery bundle.
- Local poster assets so the catalog still renders without an image service connection.

The default is an **editable local demo catalog**, not a full movie streaming service. Trailers use YouTube and require internet; availability varies by region. Watchlists and local catalog changes are stored in this browser, not synchronized to an account. Clearing site data removes these changes. Paid checkout is not connected.

## Connect the original Flask / MongoDB backend

The original backend remains in `src/api`. It is **not required or started** for local browsing or catalog editing. Its existing authentication, admin authorization, and payment behavior have not been rebuilt for production use. The original UI modules in `src/pages` and `src/Model` are retained as reference; active routes use the redesigned components in `src/experience`. `src/App.js` remains the browsing entry point.

1. Install Python 3.11+ and MongoDB, or supply your own MongoDB database.
2. Create a Python virtual environment and install `requirements.txt`.
3. Set `MONGO_URI` to your database connection string in the backend process environment. Without it, the backend defaults to `mongodb://127.0.0.1:27017/streamflix`.
4. Run `python src/api/app.py` (loopback port 5002).
5. Create `.env.local` with `VITE_CATALOG_SOURCE=api` and restart the frontend.

The redesigned catalog requests `/api/getMovies`, `/api/getTvshows`, and `/api/getTrending` through Vite's proxy. It normalizes Mongo IDs, cast/genre arrays, and legacy image/video fields. Loading, failure, retry, and empty catalog states are handled explicitly. On connection failure, discovery identifies that it is displaying the local demo collection; Studio displays an error rather than silently redirecting writes to local storage. Favorites remain local in either mode. All active UI requests use the proxy.

The hardcoded MongoDB credential has been removed from `src/api/app.py`. **Rotate the credential previously committed in the upstream repository**, since removing it locally does not remove it from repository history.

## Verify

```sh
npm test
npm run build
npx playwright test
```

Browser tests use installed Windows Chrome by default; set `CHROME_PATH` to another Chromium executable if needed. They cover saved-list persistence, search, empty states, dialogs and focus restoration, mobile navigation/overflow, reduced motion, trailer selection, local catalog CRUD, detail routes, account validation, API failure/retry, and edit payloads. API tests use intercepted responses; they do not verify a running MongoDB backend or actual third-party video playback.

`npm run build` generates `dist/`. Production API deployments need their own `/api` reverse proxy; the development proxy is not included in static builds.

## Source and artwork

Based on the main-branch source archive from https://github.com/moosey2003/Streamflix. This edition has its own Git history, initialized after the local redesign; it does not include the upstream repository's commit history.

The original artwork is retained in `src/assets`. Added promotional posters are for this local demonstration; rights remain with their owners. See `ARTWORK.md` for sources. Confirm licensing before public redistribution. No hosted deployment was made.
