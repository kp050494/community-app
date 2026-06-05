# Deploying (free): Vercel + Supabase

This app is a Next.js 16 app backed by PostgreSQL (Prisma). We'll host the app on
**Vercel** (free Hobby tier) and the database on **Supabase** (free Postgres).
The production database starts **clean** with just one admin login.

> The `offline-app/` folder is a separate on-device (Capacitor/Vite) app and is **not**
> part of this deployment. Vercel only builds the Next.js app at the repo root.

---

## 0. Accounts you need (all free)
- GitHub (you already have the repo: `kp050494/community-app`)
- Supabase — https://supabase.com
- Vercel — https://vercel.com (sign in with GitHub)

---

## 1. Create the Supabase database
1. Supabase → **New project**. Pick a name, a strong **database password** (save it), and a region close to you.
2. Wait for it to provision (~1–2 min).
3. Go to **Project Settings → Database → Connection string** and copy **two** URIs:
   - **Transaction pooler** (port `6543`) → this is your `DATABASE_URL`
   - **Session pooler** (port `5432`) → this is your `DIRECT_URL`
4. In each string, replace `[YOUR-PASSWORD]` with the password from step 1.
5. Add `?pgbouncer=true&connection_limit=1` to the **end of the `DATABASE_URL`** (the 6543 one).

They look like this:

```
DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"
```

---

## 2. Create the database schema + admin (run once, locally)
Point your local machine at the Supabase DB and push the schema, then create the admin.

In a terminal in the project folder, set the two URLs **for this one session** and run:

PowerShell:
```powershell
$env:DATABASE_URL="<your DATABASE_URL from step 1>"
$env:DIRECT_URL="<your DIRECT_URL from step 1>"
npm run db:push                # creates all tables/columns in Supabase
$env:ADMIN_EMAIL="you@example.com"
$env:ADMIN_PASSWORD="a-strong-password"
npm run create-admin           # creates ONE admin login (no other data)
```

`db:push` creates every table from `prisma/schema.prisma` (families, members incl.
`gotra`, `yskId`, `yuvaSanghFamilyId`, `maritalStatus`, `middleName`, notices, events, etc.).
`create-admin` only upserts the admin — it does not touch any other data.

---

## 3. Generate an auth secret
Next-Auth needs a secret in production. Generate one:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output — that's your `AUTH_SECRET`.

---

## 4. Push your code to GitHub
Commit the latest changes and push:

```powershell
git add -A
git commit -m "Prepare for deployment"
git push origin master
```

(`.env` is git-ignored, so your local DB password is not pushed — good.)

---

## 5. Deploy on Vercel
1. Vercel → **Add New… → Project** → import `kp050494/community-app`.
2. Framework preset: **Next.js** (auto-detected). Leave Build/Install commands as default
   (the build script already runs `prisma generate && next build --webpack`).
   Root Directory: **leave as the repo root**.
3. Open **Environment Variables** and add these (Production + Preview):

   | Name              | Value |
   |-------------------|-------|
   | `DATABASE_URL`    | the **6543** pooler URL from step 1 (with `?pgbouncer=true&connection_limit=1`) |
   | `DIRECT_URL`      | the **5432** session pooler URL from step 1 |
   | `AUTH_SECRET`     | the value from step 3 |
   | `AUTH_TRUST_HOST` | `true` |

4. Click **Deploy**. First build takes a few minutes.
5. When it's done, open the Vercel URL (e.g. `https://community-app-xxxx.vercel.app`).

---

## 6. First login
- Go to `https://<your-vercel-url>/login`
- Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in step 2.
- Change the password (and create real families/members).

---

## Redeploying later
Every `git push origin master` triggers a new Vercel deploy automatically.
If you change `prisma/schema.prisma`, re-run step 2's `npm run db:push` (with the Supabase
URLs set) so the database matches the new schema.

## Free-tier notes
- **Supabase free**: pauses after ~1 week of inactivity (resumes on next request); 0.5 GB DB.
- **Vercel Hobby**: free for personal/non-commercial use; serverless functions sleep when idle.
- Both are fine for a community admin app with light traffic.

## Troubleshooting
- **Build fails on Prisma**: ensure `DATABASE_URL` + `DIRECT_URL` are set in Vercel.
- **Can't log in / "configuration" error**: `AUTH_SECRET` missing — add it and redeploy.
- **DB connection errors at runtime**: confirm `DATABASE_URL` uses the **6543** pooler with
  `?pgbouncer=true&connection_limit=1`, and `DIRECT_URL` uses **5432**.
