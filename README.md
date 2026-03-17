# Billie's Dictionary

A progressive web app (PWA) dictionary with extensive coverage: definitions, etymology, synonyms, antonyms, and slang—centered on North American and Black English context. Installable, offline-capable, and deployable on Vercel.

## Deploy to Vercel via GitHub

1. **Create a new GitHub repo** (e.g. `billies-dictionary`). Do not add a README or .gitignore if you already have them.
2. **Push this project** from the `billies-dictionary` folder:
   ```bash
   cd billies-dictionary
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/billies-dictionary.git
   git push -u origin main
   ```
3. **Connect to Vercel:** Go to [vercel.com/new](https://vercel.com/new), import your GitHub repo, set the root directory to the repo (or leave default).
4. **Environment variables:** Add any vars from `.env.example` in Vercel → Project → Settings → Environment Variables (optional for this app).
5. **Deploy.** Vercel will build and deploy. Future pushes to `main` trigger automatic deploys.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Data

- **Base dictionary:** [Free Dictionary API](https://dictionaryapi.dev/) (no key). See `docs/DATA_SOURCE.md`.
- **Search:** In-repo word list in `src/data/commonWords.json`; expand it for more type-ahead options.
- **Overlay (slang, cultural notes):** Edit `src/data/overlay.json` keyed by headword.
