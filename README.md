# UpdatedMovieProject

Search movies from TMDB, collect favorites and share them as a list.

## How to run

1. Get a free API key from [TMDB](https://www.themoviedb.org/settings/api).
2. Copy `.env.example` to `.env.local` and put your key in it:

   ```
   VITE_TMDB_API_KEY=your_key_here
   ```

   `.env.local` is git-ignored — never commit your key.

3. Install and start:

   ```
   npm install
   npm run dev
   ```

## Scripts

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start the dev server                          |
| `npm run build`     | Type-check, then build into `dist/`           |
| `npm run preview`   | Serve the production build                    |
| `npm run typecheck` | Run the TypeScript compiler (no output files) |
| `npm run lint`      | Run ESLint                                    |

## Project structure

Written in TypeScript (strict mode) with React, Redux Toolkit, React Router and
Tailwind CSS, built with Vite.

```
src/
  api/          TMDB and shared-list requests; raw responses are normalized here
  components/
    layout/     header, footer, account menu, language switcher, page shell
    search/     search box, live suggestions, search results
    title/      cards, rows, hero slider, details modal
    series/     series spotlight and the episode-ratings chart
    watchlist/  sharing the watchlist as a link
    ui/         small shared pieces (reveal animation, skeletons, images)
  hooks/        data loading (cached per language) and UI behaviour hooks
  i18n/         translations (en, tr, ru) and the typed `t()` function
  pages/        one component per route
  state/        Redux slices: search, details, watchlist, auth
  utils/        formatting, search ranking, storage, splash screen
  types.ts      shared domain types (Title, TitleDetails, Episode, …)
```

Translation keys are type-checked: `t("nav.movies")` compiles, a typo does
not, and every language must define every key that English has.

## Note on the API key

Vite inlines `VITE_*` variables into the JavaScript bundle, so the key is still
visible to anyone who opens the deployed site. To hide it completely, call TMDB
through a small server-side proxy (for example a Vercel/Netlify function) that
adds the key on the server.

When deploying, configure the host to serve `index.html` for all routes so that
shared `/list/:id` links and the sign-in callback (`/auth/callback`) work.

## Sign in

"Sign in" uses the visitor's own TMDB account (TMDB v3 user authentication):
the app requests a token, the visitor approves it on themoviedb.org, and TMDB
redirects back to `/auth/callback`. The session id is kept in `localStorage`
and the watchlist is synced with the account's TMDB movie watchlist. No backend
is needed. The callback only accepts the token this browser started with, which
blocks login-CSRF links.

## Languages

The interface is available in English, Turkish and Russian (`src/i18n/`).
TMDB data (titles, overviews, genres) is requested in the same language. Where
TMDB has no translation, titles fall back to the original and the overview can
be missing (newer or less known titles often lack one). To add a language,
copy `src/i18n/en.js`, translate it and register it in `src/i18n/context.js`.
