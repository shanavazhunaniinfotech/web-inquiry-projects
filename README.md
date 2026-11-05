# Web Inquiry Projects — client sites

One repo, many client websites. Every top-level folder is a separate client's static site (HTML/CSS/JS), deployed by a single Vercel project. Every push to `main` goes live.

- Client site: `https://web-projects-final.vercel.app/<folder>/`
- Home page (`/`): lists all clients and is password-protected so clients can't see each other.

## Structure

```
index.html          # client list (password-protected)
middleware.js       # protects only the home page
vercel.json         # clean URLs + trailing slashes
sample-site/        # template: index.html, style.css, script.js
<client-folder>/    # one folder per client
```

## Adding a client

Start a new Claude chat on this repo and paste the "New client website" prompt from `NEW_CLIENT_PROMPT.md`. Claude follows `CLAUDE.md`: it creates the folder, adds a card to the home page and pushes to `main`.

By hand: copy `sample-site/` to a new lowercase-hyphen folder, edit it (relative paths only), add a card to `index.html`, and push to `main`.

## Home page password

The password lives in the Vercel environment variable `HOME_PASSWORD` (project `web-inquiry-projects`). To open the home page, enter any username plus that password. Change it in Vercel → Project → Settings → Environment Variables, then redeploy.
