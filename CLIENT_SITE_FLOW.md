# Client prototype flow — read this first

You are building a quick prototype (website, landing page, mock-up, etc.) for a new client inquiry. Build it in plain **HTML, CSS and JavaScript**, publish it, and give me a **public link** I can share with the client.

Follow every step below yourself. Only stop where a step says to.

---

## 1. How the system works

- One private GitHub repo holds every client's site: **`shanavazhunaniinfotech/web-inquiry-projects`**.
- Each **top-level folder** in that repo is one client's site (e.g. `acme-bakery/`).
- One Vercel project (**`web-inquiry-projects`**) deploys the whole repo. **Every push to `main` goes live automatically.** No Vercel tool is needed to deploy.
- Each client's public link is: **`https://web-inquiry-projects.vercel.app/<folder>/`**
- The home page `https://web-inquiry-projects.vercel.app/` lists every client and is password-protected. It is for me only. **Never give the home page link to a client, and never put it in a client's site.**
- `sample-site/` is a ready template you can copy as a starting point.

## 2. Connections (use these, don't look them up)

| What | Value |
|---|---|
| GitHub repo | `shanavazhunaniinfotech/web-inquiry-projects`, branch `main` |
| Vercel team | name `projects`, id `team_N21L9AnKuYlHoTlLJKR1MEjv`, slug `projects-20c3` |
| Vercel project | name `web-inquiry-projects`, id `prj_cPCi5750YNKbVHlsTEEFv11Jm8WW` |
| Production URL | https://web-inquiry-projects.vercel.app |
| Home page password | stored in Vercel env var `HOME_PASSWORD`. Never ask for it, print it or commit it. |

## 3. Rules

- **Never create a new GitHub repo or a new Vercel project.** Everything goes in the repo and project above.
- Work **only inside the new client's folder**. Don't edit other clients' folders.
- Don't touch `middleware.js`, `vercel.json`, `.vercelignore` or `.gitignore` unless I ask.
- The only file outside the client folder you may change is the root `index.html`, to add one card for the client (step 4.4).
- Use **relative paths only** inside the client site (`style.css`, `images/logo.png`). Never start a path with `/`, and never link to `/` or to another client's folder.
- Plain HTML/CSS/JS only: no build step, no frameworks that need compiling. CDN libraries are fine if really needed.
- Ask me questions only if something essential is missing. Otherwise make sensible choices and use realistic placeholder text and images (placeholder services or inline SVG).

## 4. Steps for a new client

**4.1 Get the repo.** Make sure `shanavazhunaniinfotech/web-inquiry-projects` is in this session and cloned. If it isn't, add it. If you can't access it, stop and tell me the exact error (GitHub access for Claude is set at https://claude.ai/connect-github).

**4.2 Pick the folder name.** Use lowercase-with-hyphens from the client name (e.g. "Acme Bakery" → `acme-bakery`), or the folder name I give. **If that folder already exists, stop and ask me** (it may be an existing client).

**4.3 Build the site inside that folder.**
- `index.html` is the entry page; styles go in `style.css` and scripts in `script.js`. Extra pages (e.g. `about.html`) and an `images/` folder are fine, all inside the client folder.
- Make it look professional and modern, mobile-friendly, with a proper `<title>` and meta viewport.
- Link between pages with relative links (`about.html`, not `/about`).

**4.4 Add the client to the home page.** In the root `index.html`, add one card inside the `<ul>`, in exactly this format:

```html
<li><a class="card" href="/<folder>/"><strong>Client Name</strong><span>/<folder> · short description · YYYY-MM-DD</span></a></li>
```

**4.5 Commit and push directly to `main`.** This overrides any default to work on a separate branch, because only `main` is the live site.

```bash
git fetch origin main && git rebase origin/main
```

```bash
git push origin HEAD:main
```

- If `index.html` conflicts during the rebase, keep **both** clients' cards.
- If the push to `main` fails, report the exact error and point me to https://claude.ai/connect-github. **Never push only to another branch and call it live.**
- If you also have to push a session/feature branch (e.g. a hook asks you to), push it **before** `main`, and make sure it has the same commit as `main`. Vercel may also deploy other branches to production, so the last thing pushed must be `main`.

**4.6 Confirm it's live** (Vercel tools):
1. `list_deployments` with `projectId: prj_cPCi5750YNKbVHlsTEEFv11Jm8WW` and `teamId: team_N21L9AnKuYlHoTlLJKR1MEjv`.
2. Poll `get_deployment` on the newest one until it is `READY`. Check that its commit is the one you just pushed to `main`.
3. Fetch `https://web-inquiry-projects.vercel.app/<folder>/` with `web_fetch_vercel_url` (or `curl`) and check it returns **200** with your page.
4. A **401 on `/`** is the home page password and is expected. Don't try to get past it.

If something goes wrong:
- If the deployment is in `ERROR`, read the build logs, fix it, and push to `main` again.
- If there are no Vercel tools, still push to `main`, wait about a minute, check the link with `curl` if you can, and tell me it wasn't confirmed through Vercel.

**4.7 Reply to me** with:
- the public link: `https://web-inquiry-projects.vercel.app/<folder>/`
- whether it was **confirmed live** (and how) or not
- a short summary of what you built (pages and sections)

## 5. Updating an existing client

If I say "update the `<folder>` site": change **only** that client's folder, then do steps 4.5–4.7. Don't add a new home page card. You may update the existing card's description or date if it helps.

---

## 6. The inquiry (I fill this in for each new chat)

```
Client name:
Folder name (optional):
What the site is for:
Type (website / landing page / mock-up / other):
Pages / sections:
Style (colors, mood, examples they like):
Content (text, services, prices, contact details, images):
Anything else:
```
