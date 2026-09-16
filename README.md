# DSC Voicebox — deploy to Vercel

Anonymous complaint & suggestion box for Dyal Singh College. Static frontend
in `public/`, two serverless API routes in `api/`, data stored in Vercel KV
(a free Redis database) so every student and the Union desk see the same
shared data — no traditional backend server to manage.

## 1. Push this folder to GitHub
Create a new repo and push everything in this folder (keep the `api/`,
`public/`, `package.json`, and `.gitignore` as-is).

```bash
git init
git add .
git commit -m "DSC Voicebox"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## 2. Import into Vercel
- Go to vercel.com → **Add New Project** → import the GitHub repo.
- Framework preset: choose **Other** (it's plain static + API routes, no
  build step needed).
- Click **Deploy**. It will deploy fine even before the database is
  connected — you just won't be able to submit/view entries yet.

## 3. Add a Vercel KV database (2 minutes, free tier is plenty)
- In your Vercel project → **Storage** tab → **Create Database** → **KV**.
- Once created, click **Connect Project** and select this project.
- Vercel automatically adds the required environment variables
  (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc.) — no manual copy-pasting.
- Go to **Deployments** → redeploy the latest deployment (or just push a
  new commit) so the functions pick up the new environment variables.

## 4. You're live
Your app is now at `your-project.vercel.app`. Share that link on posters,
WhatsApp groups, Instagram bio — wherever students will actually see it.

## Before sharing widely
- Open `public/index.html`, search for `ADMIN_PASS`, and change
  `"dscunion26"` to your own access code for the Union desk tab.
- Optionally connect a custom domain in Vercel's **Domains** tab if the
  college has one you can point at this (e.g. `voicebox.dsc.edu` — check
  with your college's IT/webmaster).

## How data is stored
- Every submission is a JSON object keyed by its tracking code
  (`voicebox:DSC-XXXXXX`) in KV, plus an index list of all codes.
- Photos are compressed and embedded as base64 inside that JSON (this also
  strips EXIF/location metadata client-side before it's ever sent).
- Videos are stored as a link only (unlisted YouTube/Drive) — video files
  are too large for this kind of storage and a link is more reliable
  anyway.
- The admin PATCH route only accepts `status` and `reply` fields, so even
  if someone finds the API, they can't rewrite a complaint's content.

## Local testing (optional)
```bash
npm install -g vercel
npm install
vercel dev
```
`vercel dev` will prompt you to link a KV store for local env vars too.
