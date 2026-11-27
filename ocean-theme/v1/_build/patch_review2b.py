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


# 5. first images on collections, blog and search load eagerly; 6. duplicate "worn with" image link hidden
edit('pages.js', [
    ("""'<div class="ccard__media">' + (imgId ? '<img src="' + D.img(imgId, 900, 1000) + '" alt="" width="450" height="500" loading="lazy">'""",
     """'<div class="ccard__media">' + (imgId ? '<img src="' + D.img(imgId, 900, 1000) + '" alt="" width="450" height="500"' + (i < 2 ? ' fetchpriority="high"' : ' loading="lazy"') + '>'"""),
    ("""'" alt="" width="' + (big ? 700 : 400) + '" height="' + (big ? 450 : 300) + '" loading="lazy">""",
     """'" alt="" width="' + (big ? 700 : 400) + '" height="' + (big ? 450 : 300) + '"' + (big ? ' fetchpriority="high"' : ' loading="lazy"') + '>"""),
    ("""<a class="worn__img" href="' + R + 'product/?id=' + x.id + '" tabindex="-1">""",
     """<a class="worn__img" href="' + R + 'product/?id=' + x.id + '" tabindex="-1" aria-hidden="true">"""),
])
s = open(os.path.join(ROOT, 'script.js')).read()
a = """'" width="700" height="875" loading="lazy">'"""
assert s.count(a) == 1, 'card img'
s = s.replace(a, """'" width="700" height="875"' + ((i || 0) < 2 && !document.querySelector('.hero') ? '' : ' loading="lazy"') + '>'""")
open(os.path.join(ROOT, 'script.js'), 'w').write(s)
print('review-2 patch applied')
