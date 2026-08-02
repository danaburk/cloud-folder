# Cloud Folder

Your textbooks and lectures, in your own Google Drive, behind a simple login,
with instant previews — usable from any browser, including locked-down
library desktops.

**How it works:** your files live in a folder in your Google Drive (free,
15GB). This app is just a thin, fast frontend — it signs in with your Google
account, lists what's in that folder, and shows previews using Google's own
preview engine (so there's no upload/processing step and no server of yours
that can go down). Nothing is hosted on your MacBook, so it works the same
whether you're home or at the library.

---

## 1. Put your files in Drive

1. In [Google Drive](https://drive.google.com), create a folder, e.g. `Cloud Folder`.
2. Upload your textbooks/lectures into it (subfolders are supported — you can
   click into them in the app).
3. Open the folder and copy the ID from the URL:
   `https://drive.google.com/drive/folders/`**`THIS_PART_IS_THE_ID`**

## 2. Create Google OAuth credentials (one-time, free)

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → create a
   new project (any name, e.g. "Cloud Folder").
2. **APIs & Services → Library** → enable **Google Drive API**.
3. **APIs & Services → OAuth consent screen**:
   - User type: External
   - Fill in app name ("Cloud Folder"), your email for support/dev contact
   - Scopes: you can skip adding scopes here, the app requests them directly
   - Test users: add your own Google email
   - Publishing status: leave in "Testing" — this is fine forever for a
     single-user app; only your own account (added as a test user) can sign
     in, which also means you don't need Google's app review.
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: Web application
   - Authorized redirect URIs, add both:
     - `http://localhost:3000/api/auth/callback/google` (for local testing)
     - `https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/callback/google`
       (add this after step 3 below, once you know your domain)
   - Save. Copy the **Client ID** and **Client Secret**.

## 3. Deploy for free on Vercel

1. Push this project to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **Add New
   Project** → import the repo.
3. Before deploying, add these Environment Variables (Project Settings →
   Environment Variables):

   | Name | Value |
   |---|---|
   | `GOOGLE_CLIENT_ID` | from step 2 |
   | `GOOGLE_CLIENT_SECRET` | from step 2 |
   | `NEXTAUTH_SECRET` | run `openssl rand -base64 32` locally and paste the result |
   | `NEXTAUTH_URL` | `https://YOUR-VERCEL-DOMAIN.vercel.app` |
   | `ALLOWED_EMAIL` | your Google email — the only account allowed to sign in |
   | `DRIVE_FOLDER_ID` | from step 1 |

4. Deploy. Once it's live, go back to Google Cloud Console and add the
   real `https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/callback/google`
   redirect URI from step 2 (Vercel gives you the domain after first deploy).
5. Visit your site from any desktop (library included), sign in with your
   Google account, and your files should appear.

Vercel's free tier and Google Drive's free 15GB are both enough for this —
no cost.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values from steps 1-2, NEXTAUTH_URL=http://localhost:3000
npm run dev
```

## Notes

- Only the email in `ALLOWED_EMAIL` can sign in — this is a single-user app
  by design, so no one else can access your files even if they find the URL.
- Previews are rendered by Google Drive's own viewer (`drive.google.com/file/d/…/preview`),
  which is why there's effectively no loading delay — you're not waiting on
  any server of yours to process the file.
- To add more textbooks later, just drop them into the Drive folder — no
  redeploy needed.
