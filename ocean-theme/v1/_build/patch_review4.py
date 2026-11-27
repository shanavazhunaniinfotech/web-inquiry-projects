"""One-off: fixes from the third live re-check (footer quick links, gift card art and terms, load shifts on 5 templates)."""
import os
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')
def edit(path, pairs):
    path = os.path.join(ROOT, path); s = open(path).read()
    for a, b in pairs:
        assert s.count(a) == 1, (path, a[:90]); s = s.replace(a, b)
    open(path, 'w').write(s)

# gift card: its own terms instead of the jewellery shipping text
edit('pages.js', [
    ("'<details><summary>Shipping &amp; returns</summary><div><p>Free shipping over ' + money(100) + '. Orders ship within 2 working days. Returns are free for 60 days and resizing is free, including engraved rings.</p></div></details>' +",
     "(p.giftCard ? '<details><summary>How gift cards work</summary><div><p>Sent by email with a code to use at checkout. It never expires and can be spent on anything in the store, online or at our studio. Gift cards can’t be exchanged for cash.</p></div></details>' : '<details><summary>Shipping &amp; returns</summary><div><p>Free shipping over ' + money(100) + '. Orders ship within 2 working days. Returns are free for 60 days and resizing is free, including engraved rings.</p></div></details>') +"),
])
# mark the page as rendered once pages.js has filled it, so load-time space reservations can drop
s = open(os.path.join(ROOT, 'pages.js')).read()
assert s.rstrip().endswith('})();')
s = s.rstrip()[:-len('})();')] + "  document.documentElement.classList.add('is-rendered');\n})();\n"
open(os.path.join(ROOT, 'pages.js'), 'w').write(s)

# cart: show the right block (bag or empty state) before the first paint
edit('_build/templates.py', [
    ('</div></section>\n<section class="section scheme-2" data-section="Cart recommendations">',
     """</div></section>
<script>(function () {{ var c = []; try {{ c = JSON.parse(localStorage.getItem('ocean-jewel-cart') || '[]'); }} catch (e) {{}} document.querySelector(c.length ? '[data-cp-full]' : '[data-cp-empty]').hidden = false; }})();</script>
<section class="section scheme-2" data-section="Cart recommendations">"""),
    # article: the default article's meta, lead and hero are in the HTML
    ('<p class="article__meta" data-a-meta></p>',
     '<p class="article__meta" data-a-meta><span class="bpost__tag bpost__tag--inline">Guides</span> 18 Nov 2026 · 5 min read · By Maya Lund</p>'),
    ('<p class="article__lead" data-a-lead></p>',
     '<p class="article__lead" data-a-lead>Three easy ways to measure, and what to do if you are between sizes.</p>'),
    ('<figure class="article__hero container" data-a-hero></figure>',
     '<figure class="article__hero container" data-a-hero><img src="https://images.unsplash.com/photo-1631982690223-8aa4be0a2497?auto=format&fit=crop&w=1800&h=900&q=78" alt="" width="1800" height="900" fetchpriority="high"></figure>'),
])

s = open(os.path.join(ROOT, 'ready.css')).read()
s += """
/* review 4: footer quick links keep title and subtitle stacked, with room for the arrow (beats .footer__col li a) */
.footer .footer__quick li a { display: grid; align-content: center; gap: 4px; padding: 20px 64px 20px 20px; }

/* review 4: gift card art fits its text on phones */
.pg__giftcard .gc__card-amount { line-height: 1.05; }
@media (max-width: 749px) {
  .pg__giftcard { padding: 20px; }
  .pg__giftcard .gc__card { padding: 20px; }
  .pg__giftcard .gc__card-amount { font-size: 40px; }
}

/* review 4: hold space for content the demo builds after load (a Liquid theme renders it on the server) */
html:not(.is-rendered) [data-s-summary]:empty { min-height: 27px; }
html:not(.is-rendered) .ftoolbar__count:empty { min-height: 22px; }
html:not(.is-rendered) [data-results]:empty,
html:not(.is-rendered) [data-collection-list]:empty,
html:not(.is-rendered) [data-blog-grid]:empty,
html:not(.is-rendered) [data-cp-ups]:empty { min-height: 110vh; }
"""
open(os.path.join(ROOT, 'ready.css'), 'w').write(s)
print('review-4 patch applied')
