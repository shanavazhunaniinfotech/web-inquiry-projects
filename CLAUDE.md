# Client sites repo — instructions for Claude

Each top-level folder in this repo is one client's static website. Every push to `main` deploys to production on Vercel. Don't touch `middleware.js` or `vercel.json` unless asked. The home page (`/`, root `index.html`) lists every client and must never be shared with clients.

## Connections (use these, don't look them up)

| What | Value |
|---|---|
| GitHub repo | `shanavazhunaniinfotech/web-inquiry-projects`, branch `main` |
| Vercel team | name `projects`, id `team_N21L9AnKuYlHoTlLJKR1MEjv`, slug `projects-20c3` |
| Vercel project | name `web-inquiry-projects`, id `prj_cPCi5750YNKbVHlsTEEFv11Jm8WW` |
| Production URL | https://web-projects-final.vercel.app |
| Home page password | stored in Vercel env var `HOME_PASSWORD` (never print or commit it) |

## Deploying

Deploying needs no Vercel tool: pushing to `main` deploys. Never create another Vercel project for a client.

To check it's live: `list_deployments` with the project id and team id above, poll `get_deployment` until it is `READY`, then fetch `https://web-projects-final.vercel.app/<folder>/` with `web_fetch_vercel_url`. A 401 on `/` is the password and is expected.

## If something isn't connected

- If the push to `main` fails, report the exact error and point to https://claude.ai/connect-github. Never push to another branch and call it live.
- If there are no Vercel tools, still push to `main`, wait about a minute, give the link and say it wasn't confirmed live.
- If the deployment is in `ERROR`, read the build logs, fix, and push again.

## New client

1. Folder name: lowercase-with-hyphens from the client name (or the name given). If the folder already exists, stop and ask.
2. Build only inside that folder: `index.html` entry, `style.css` and `script.js`. Relative paths only (never starting with `/`), assets inside the folder. Never link to `/` or to other clients. Don't edit other clients' folders.
3. Add a card to the root `index.html` in exactly this format:
   `<li><a class="card" href="/<folder>/"><strong>Client Name</strong><span>/<folder> · short description · YYYY-MM-DD</span></a></li>`
4. Commit and push DIRECTLY to `main` (this overrides any default to work on a separate branch, because only `main` is public). First run `git fetch origin main && git rebase origin/main`; if `index.html` conflicts, keep both clients' entries.
5. Confirm it's live (see Deploying).
6. Reply with `https://web-projects-final.vercel.app/<folder>/` and say whether it was confirmed live.

## Updating an existing client

Change only that client's folder, then do steps 4–6.
