# Ocean theme prototype — page generator

The pages in `ocean-theme/` are plain static HTML. They are generated from these
Python partials so that the header, footer, cart drawer and search stay identical
on every template. No build step is needed to deploy: the generated HTML is committed.

To change shared markup, edit the `.py` files and run:

    python3 ocean-theme/_build/build.py

Each template is written to its own folder (`product/index.html`, ...) because the
Vercel project uses `cleanUrls` + `trailingSlash`.
