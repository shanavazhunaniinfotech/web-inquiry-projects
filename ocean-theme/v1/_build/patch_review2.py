"""One-off: fixes from the readiness re-review (accessibility names, hero images, lazy LCP images, table focus)."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')


def edit(path, pairs):
    path = os.path.join(ROOT, path)
    s = open(path).read()
    for a, b in pairs:
        assert s.count(a) >= 1, (path, a[:90])
        s = s.replace(a, b)
    open(path, 'w').write(s)


# 1. settings button keeps its name when the text label is hidden on phones
edit('_build/partials.py', [
    ('<button class="settings__toggle" aria-expanded="false" aria-controls="settings-panel" data-settings-toggle>',
     '<button class="settings__toggle" aria-label="Theme settings" aria-expanded="false" aria-controls="settings-panel" data-settings-toggle>'),
])

# 2. sort select keeps a name when its visible label is hidden on phones
edit('_build/templates.py', [
    ('<select id="sort-by" data-sort>', '<select id="sort-by" aria-label="Sort by" data-sort>'),
    # 3. scrollable tables can be reached and scrolled by keyboard
    ('<div class="otbl-wrap"><table class="otbl"><caption class="visually-hidden">Your orders</caption>',
     '<div class="otbl-wrap" tabindex="0" role="region" aria-label="Your orders"><table class="otbl"><caption class="visually-hidden">Your orders</caption>'),
    ('<div class="otbl-wrap"><table class="otbl otbl--lines"><caption class="visually-hidden">Items in order #1048</caption>',
     '<div class="otbl-wrap" tabindex="0" role="region" aria-label="Items in order #1048"><table class="otbl otbl--lines"><caption class="visually-hidden">Items in order #1048</caption>'),
    ('<div class="otbl-wrap"><table class="otbl settings-table">',
     '<div class="otbl-wrap" tabindex="0" role="region" aria-label="Merchant settings"><table class="otbl settings-table">'),
])

# 4. hero: phones get a portrait crop sized for the slide; slides 2 and 3 load at low priority
SL = [('1633810542706-90e5ff7557be', (0.5, 0.28, 1)), ('1611085583191-a3b181a88401', (0.6, 0.4, 1)), ('1622398925373-3f91b1e275f5', (0.5, 0.55, 1))]
home = os.path.join(HERE, 'home.py')
s = open(home).read()
for n, (pid, fp) in enumerate(SL):
    i = s.index(f"<img class=\"hero__img{' is-active' if n == 0 else ''}\" style=")
    j = s.index('>', i) + 1
    old = s[i:j]
    alt = old.split('alt="')[1].split('"')[0]
    pos = old.split('--pos: ')[1].split('"')[0]
    src = (f"<source media=\"(max-width: 749px)\" srcset=\"{{U('{pid}', 480, 880, {fp})}} 480w, {{U('{pid}', 720, 1320, {fp})}} 720w, {{U('{pid}', 960, 1760, {fp})}} 960w\" sizes=\"100vw\" width=\"720\" height=\"1320\">"
           f"<img class=\"hero__img{' is-active' if n == 0 else ''}\" style=\"--pos: {pos}\" src=\"{{U('{pid}', 1600)}}\" srcset=\"{{U('{pid}', 1000)}} 1000w, {{U('{pid}', 1600)}} 1600w, {{U('{pid}', 2200)}} 2200w\" sizes=\"100vw\" alt=\"{alt}\" width=\"2000\" height=\"1333\""
           + (' fetchpriority="high">' if n == 0 else ' loading="lazy" fetchpriority="low">'))
    s = s[:i] + '<picture>' + src + '</picture>' + s[j:]
open(home, 'w').write(s)

# 5. first images on collections, blog and search load eagerly; 6. duplicate "worn with" image link hidden
edit('pages.js', [
    ("""'<div class="ccard__media">' + (imgId ? '<img src="' + D.img(imgId, 900, 1000) + '" alt="" width="450" height="500" loading="lazy">'""",
     """'<div class="ccard__media">' + (imgId ? '<img src="' + D.img(imgId, 900, 1000) + '" alt="" width="450" height="500"' + (i < 2 ? ' fetchpriority="high"' : ' loading="lazy"') + '>'"""),
    ("""'" alt="" width="' + (big ? 700 : 400) + '" height="' + (big ? 450 : 300) + '" loading="lazy">'""",
     """'" alt="" width="' + (big ? 700 : 400) + '" height="' + (big ? 450 : 300) + '"' + (big ? ' fetchpriority="high"' : ' loading="lazy"') + '>'"""),
    ("""<a class="worn__img" href="' + R + 'product/?id=' + x.id + '" tabindex="-1">""",
     """<a class="worn__img" href="' + R + 'product/?id=' + x.id + '" tabindex="-1" aria-hidden="true">"""),
])
s = open(os.path.join(ROOT, 'script.js')).read()
a = """'" width="700" height="875" loading="lazy">'"""
assert s.count(a) == 1, 'card img'
s = s.replace(a, """'" width="700" height="875"' + ((i || 0) < 2 && !document.querySelector('.hero') ? '' : ' loading="lazy"') + '>'""")
open(os.path.join(ROOT, 'script.js'), 'w').write(s)
print('review-2 patch applied')
