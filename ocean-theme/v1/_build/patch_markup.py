"""One-off: Theme Store review fixes for the v1 generator (partials, home, templates, build)."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)


def edit(path, pairs, regex=()):
    s = open(path).read()
    for a, b in pairs:
        assert a in s, (path, a[:80])
        s = s.replace(a, b)
    for pat, b in regex:
        s2 = re.sub(pat, b, s, flags=re.S)
        assert s2 != s, (path, pat)
        s = s2
    open(path, 'w').write(s)


EXT = ' target="_blank" rel="noopener"'
PAY = {
    'Visa': '<svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-label="Visa"><rect width="38" height="24" rx="3" fill="#fff"/><path d="M16 15.8l1.3-7.6h2l-1.2 7.6zm9-7.4a5 5 0 0 0-1.8-.3c-2 0-3.4 1-3.4 2.5 0 1.1 1 1.7 1.8 2 .8.4 1 .6 1 1 0 .5-.6.8-1.2.8a4.2 4.2 0 0 1-1.9-.4l-.3-.1-.3 1.7a6.4 6.4 0 0 0 2.2.4c2.1 0 3.5-1 3.5-2.6 0-.9-.5-1.5-1.7-2-.7-.4-1.1-.6-1.1-1s.4-.7 1.2-.7a3.7 3.7 0 0 1 1.5.3l.2.1zm5.1-.2h-1.5a1 1 0 0 0-1 .6l-3 6.9h2.1l.4-1.1h2.6l.2 1.1h1.9zm-2.5 4.9l.8-2.1.5 2.1zM14.3 8.2l-2 5.2-.2-1A5.9 5.9 0 0 0 9.4 9.3l1.8 6.5h2.1l3.1-7.6z" fill="#1A1F71"/><path d="M10.5 8.2H7.3v.2c2.5.6 4.1 2.1 4.8 3.9l-.7-3.5a.8.8 0 0 0-.9-.6z" fill="#F7B600"/></svg>',
    'Mastercard': '<svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-label="Mastercard"><rect width="38" height="24" rx="3" fill="#fff"/><circle cx="15" cy="12" r="7" fill="#EB001B"/><circle cx="23" cy="12" r="7" fill="#F79E1B"/><path d="M19 6.5a7 7 0 0 1 0 11 7 7 0 0 1 0-11z" fill="#FF5F00"/></svg>',
    'American Express': '<svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-label="American Express"><rect width="38" height="24" rx="3" fill="#1F72CD"/><text x="19" y="15.5" font-family="Arial, sans-serif" font-size="8" font-weight="700" fill="#fff" text-anchor="middle">AMEX</text></svg>',
    'PayPal': '<svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-label="PayPal"><rect width="38" height="24" rx="3" fill="#fff"/><text x="19" y="15.5" font-family="Arial, sans-serif" font-size="7.5" font-weight="700" font-style="italic" text-anchor="middle"><tspan fill="#003087">Pay</tspan><tspan fill="#009CDE">Pal</tspan></text></svg>',
    'Apple Pay': '<svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-label="Apple Pay"><rect width="38" height="24" rx="3" fill="#000"/><path d="M11.9 8.6c.4-.5.7-1.2.6-1.9-.6 0-1.3.4-1.7.9-.4.4-.7 1.1-.6 1.8.7.1 1.3-.3 1.7-.8zm.6 1c-.9-.1-1.7.5-2.2.5s-1.1-.5-1.9-.5a2.8 2.8 0 0 0-2.4 1.5c-1 1.8-.3 4.4.7 5.8.5.7 1 1.5 1.8 1.4.7 0 1-.5 1.9-.5s1.1.5 1.9.5c.8 0 1.3-.7 1.7-1.4a6.1 6.1 0 0 0 .8-1.6 2.5 2.5 0 0 1-1.5-2.3 2.6 2.6 0 0 1 1.2-2.2 2.7 2.7 0 0 0-2-1.2z" fill="#fff"/><text x="25" y="15.6" font-family="Arial, sans-serif" font-size="8" font-weight="600" fill="#fff" text-anchor="middle">Pay</text></svg>',
    'Shop Pay': '<svg viewBox="0 0 38 24" width="38" height="24" role="img" aria-label="Shop Pay"><rect width="38" height="24" rx="3" fill="#5A31F4"/><text x="19" y="15.5" font-family="Arial, sans-serif" font-size="7.5" font-weight="700" fill="#fff" text-anchor="middle">shop Pay</text></svg>',
}
pay_html = '<ul class="payments payments--icons" aria-label="Payment methods accepted">' + ''.join('<li>' + v + '</li>' for v in PAY.values()) + '</ul>'

# ------------------------------------------------------------------ partials
edit('partials.py', [
    ("""    <p class="announcement__proof"><span class="stars" aria-hidden="true">★★★★★</span> <strong>4.9</strong> from 2,840 reviews</p>""",
     """    <p class="announcement__proof">Solid 14k gold · Hallmarked</p>"""),
    ("""        <p class="announcement__msg"><span>Build a stack of 3 and save 15%</span></p>""",
     """        <p class="announcement__msg"><span>Free resizing within 60 days</span></p>"""),
    ("""  <link rel="stylesheet" href="templates.css">""", """  <link rel="stylesheet" href="templates.css">\n  <link rel="stylesheet" href="ready.css">"""),
    ("""  <p class="footer__giant" aria-hidden="true">OCEAN</p>\n""", ""),
    ("""    <ol class="ship-meter__perks"><li data-perk="50"><span>Gift box</span></li><li data-perk="100"><span>Free shipping</span></li><li data-perk="250"><span>Polishing kit</span></li></ol>\n""", ""),
    ("""    <p class="ship-meter__text" data-ship-text>Spend <strong>$100.00</strong> more for free express shipping</p>""", """    <p class="ship-meter__text" data-ship-text>Free shipping on orders over $100.00</p>"""),
    ("<span>Theme preview</span>", "<span>Theme settings</span>"),
    ("<legend>Colour palette</legend>", "<legend>Color scheme</legend>"),
    ("<legend>Corners</legend>", "<legend>Corner style</legend>"),
    ("""    <label class="switch"><input type="checkbox" data-show-sections><span class="switch__ui" aria-hidden="true"></span>Show section names</label>""",
     """    <fieldset><legend>Features</legend>
      <label class="switch"><input type="checkbox" data-setting="stickyAtc"><span class="switch__ui" aria-hidden="true"></span><span>Sticky add to cart<small>Product page bar after scrolling</small></span></label>
      <label class="switch"><input type="checkbox" data-setting="upsell"><span class="switch__ui" aria-hidden="true"></span><span>Cart upsell<small>Uses Shopify product recommendations</small></span></label>
      <label class="switch"><input type="checkbox" data-setting="stackDiscount"><span class="switch__ui" aria-hidden="true"></span><span>Stack builder discount<small>Off by default. Turn on only after creating the matching automatic discount in Shopify.</small></span></label>
      <label class="switch"><input type="checkbox" data-show-sections><span class="switch__ui" aria-hidden="true"></span><span>Show section names<small>Outline each Shopify section</small></span></label>
    </fieldset>"""),
    ("""<li><a href="#" aria-label="Instagram">""", """<li><a href="https://www.instagram.com/\"""" + EXT + """ aria-label="Instagram (opens in a new tab)">"""),
    ("""<li><a href="#" aria-label="TikTok">""", """<li><a href="https://www.tiktok.com/\"""" + EXT + """ aria-label="TikTok (opens in a new tab)">"""),
    ("""<li><a href="#" aria-label="Pinterest">""", """<li><a href="https://www.pinterest.com/\"""" + EXT + """ aria-label="Pinterest (opens in a new tab)">"""),
    ("""<a class="follow-shop" href="#" aria-label="Follow on Shop">""", """<a class="follow-shop" href="https://shop.app/\"""" + EXT + """ aria-label="Follow on Shop (opens in a new tab)">"""),
    ("""<a href="page.html">Privacy</a> · <a href="page.html">Terms</a>""", """<a href="policies/privacy-policy.html">Privacy policy</a> · <a href="policies/terms-of-service.html">Terms of service</a>"""),
], regex=[
    (r'<ul class="payments" aria-label="Payment methods accepted">.*?</ul>', pay_html),
    (r"TEMPLATES = \[.*?\]\n", """TEMPLATES = [('index.html', 'Home'), ('collection.html', 'Collection'), ('collection.html?filters=open', 'Collection, filters open'), ('collections.html', 'Collection list'),
             ('product.html', 'Product (3D)'), ('product.html?id=1', 'Product (video, selling plan)'), ('product.html?id=8', 'Product, sold out'), ('product.html?id=20', 'Gift card product'),
             ('cart.html', 'Cart page'), ('index.html?cart=open', 'Cart drawer, open'), ('search.html?q=gold', 'Search results'), ('search.html?q=xyz', 'Search, no results'),
             ('blog.html', 'Blog'), ('article.html', 'Article'), ('page.html', 'Page'), ('contact.html', 'Contact'), ('policies/privacy-policy.html', 'Privacy policy'), ('policies/terms-of-service.html', 'Terms of service'), ('404.html', '404'),
             ('account.html', 'Account sign in'), ('account/orders.html', 'Account orders'), ('account/order.html', 'Order detail'), ('account/addresses.html', 'Addresses'), ('account/activate.html', 'Activate account'),
             ('password.html', 'Password'), ('password.html?state=error', 'Password, error'), ('gift-card.html', 'Gift card'), ('gift-card.html?state=expired', 'Gift card, expired'), ('states.html', 'States + settings')]
"""),
])
s = open('partials.py').read()
# footer newsletter is optional: hidden where the page already has a newsletter section
s = s.replace("def footer():", "def footer(news=True):")
s = re.sub(r'(\n        <form class="footer__news" data-newsletter novalidate>.*?</form>)', lambda m: "{NEWS}", s, count=1, flags=re.S)
news_block = re.search(r'<form class="footer__news" data-newsletter novalidate>.*?</form>', open('partials.py').read(), re.S).group(0)
s = s.replace("    return f'''<footer class=\"footer scheme-4\"", "    NEWS = ('\\n        ' + " + repr(news_block) + ") if news else ''\n    return f'''<footer class=\"footer scheme-4\"", 1)
s = s.replace("def page(title, desc, body_class, main, current='', extra_head=''):", "def page(title, desc, body_class, main, current='', extra_head='', footer_news=True):")
s = s.replace("f'<main id=\"main\">\\n{main}\\n</main>\\n' + footer() + overlays()", "f'<main id=\"main\">\\n{main}\\n</main>\\n' + footer(footer_news) + overlays()")
assert "footer(footer_news)" in s and "{NEWS}" in s
open('partials.py', 'w').write(s)

# ------------------------------------------------------------------ home
edit('home.py', [
    ("'eyebrow': 'Best seller · 4.9 rated'", "'eyebrow': 'Best seller'"),
    ("""<p class="hero__chip-meta"><span class="stars" aria-label="Rated 4.8 out of 5">★★★★★</span> <span data-chip-price""", """<p class="hero__chip-meta"><span data-chip-price"""),
    ("""<div class="story__rating"><span class="stars" aria-hidden="true">★★★★★</span><p><strong>4.9</strong> from 2,840 reviews</p></div>""", """<div class="story__rating"><p><strong>585</strong> hallmark on every piece</p></div>"""),
    ("""<span data-money="120">$120.00</span> chain""", """<span class="nowrap"><span data-money="120">$120.00</span></span> chain"""),
    ("""<h2 class="h2">Build your stack.<br><em>Save 15%.</em></h2>""", """<h2 class="h2">Build your stack</h2>"""),
    ("""<div class="review__body"><div class="review__top"><span class="stars" aria-label="{s} out of 5">{'★' * s}{'☆' * (5 - s)}</span><span class="review__date">{d}</span></div><h3>{t}</h3><p>{b}</p>""", """<div class="review__body"><h3>{t}</h3><p>{b}</p>"""),
    (""" <span class="verified">Verified buyer</span></p></div></li>""", """</p></div></li>"""),
    ("""<p class="eyebrow"><span class="idx">(08)</span> Reviews</p><h2 class="h2">Worn, loved,<br><em>reviewed.</em></h2></div>""", """<p class="eyebrow">Testimonials</p><h2 class="h2">Notes from customers</h2></div>"""),
], regex=[
    (r'<span data-count="(\d+)">0</span>', r'<span>\1</span>'),
    (r'\n      <div class="reviews__score">.*?</div></div></div>', ''),
])
s = open('home.py').read()
i = s.index("<p class=\"muted\">Choose one piece from each step.")
j = s.index("</p>", i)
s = s[:i] + "<p class=\"muted\">Choose one piece from each step and add all three in one go." + s[j:]
# featured product section after shop the look
s = s.replace("    return hero + marquee", """    featured_product = '''<section class="section fp" data-section="Featured product" data-featured-product data-id="1">
  <div class="container fp__grid"><div class="fp__media" data-fp-media></div><div class="fp__info" data-fp-info></div></div>
</section>
'''
    return hero + marquee""")
s = s.replace("+ look +", "+ look + featured_product +")
assert "featured_product +" in s
open('home.py', 'w').write(s)

# ------------------------------------------------------------------ templates
cur = open(os.path.join(HERE, '..', '..', '_build', 'templates.py')).read()
acct_code = cur[cur.index('def acct_shell'):cur.index('SETTINGS = [')]
edit('templates.py', [
    ("""<span data-filter-label>Hide filters</span>""", """<span data-filter-label>Filter</span>"""),
    ("""data-filter-toggle aria-expanded="true" aria-controls="filters">""", """data-filter-toggle aria-expanded="false" aria-controls="filters">"""),
    ("""      <div class="pcomp"><p class="mini-title">Complete the look</p><ul class="pcomp__list" data-complementary></ul></div>\n""", ""),
    ("""<a href="#">Log in here</a>""", """<a href="https://accounts.shopify.com/store-login\"""" + EXT + """>Log in here</a>"""),
    ("""<p class="gc__card-foot">Gift card · No expiry date</p>""", """<p class="gc__card-foot" data-gc-foot>Gift card · No expiry date</p>"""),
    ("""<div class="gc__code"><p class="mini-title">Use this code at checkout</p>""", """<div class="gc__code"><p class="mini-title" data-gc-instruction>Use this code at checkout</p>"""),
    ("""  <div class="gc__main">\n""", """  <div class="gc__main">\n    <div class="gc__expired" data-gc-expired role="status" hidden><strong>This gift card expired on 1 January 2026.</strong> It can no longer be used at checkout. Contact us if you think this is a mistake.</div>\n"""),
    ("""<a class="acct__forgot" href="#" data-switch="recover">Forgot your password?</a>""", """<button type="button" class="acct__forgot" data-switch="recover">Forgot your password?</button>"""),
    ("""<a class="acct__forgot" href="#" data-switch="login">Back to sign in</a>""", """<button type="button" class="acct__forgot" data-switch="login">Back to sign in</button>"""),
], regex=[
    (r'<section class="section" id="reviews" data-section="Product reviews">.*?</section>\n', '<!-- Product reviews: an @app block slot. The reviews app renders here; the demo store uses no apps. -->\n'),
    (r'(<p class="phead__lead">)Rings, necklaces, earrings and bracelets in recycled gold\. One collection has no image of its own[^<]*(</p>)', r'\1Rings, necklaces, earrings and bracelets in solid recycled 14k gold.\2'),
])
s = open('templates.py').read()
s = s.replace('class="link-u is-focus" href="#"', 'class="link-u is-focus" href="page.html"').replace('href="#">Text link', 'href="page.html">Text link')
i = s.index('def states():')
s = s[:i] + acct_code + r'''
SETTINGS = [
    ('Theme settings', 'Logo', 'Image picker and width. Works in portrait and landscape.'),
    ('Theme settings', 'Colors', 'Four schemes (background, text, accent, button), each with a matching foreground.'),
    ('Theme settings', 'Typography', 'Heading and body font pickers from the Shopify font library (default DM Sans).'),
    ('Theme settings', 'Corner style', 'Rounded or square.'),
    ('Theme settings', 'Section spacing', 'Top and bottom padding per section (desktop 75 px, tablet 60 px, mobile 48 px), with a “remove top padding” option.'),
    ('Theme settings', 'Image overlay', 'Overlay strength for text on images, default 40%.'),
    ('Theme settings', 'Cart', 'Drawer or page, free-shipping threshold, cart upsell (product recommendations or a chosen collection), gift wrap product picker.'),
    ('Header', 'Layout', 'Centered logo, sticky on/off, mega menu with promo image, account icon (shopify-account) on every breakpoint.'),
    ('Announcement bar', 'Messages', 'Up to 3 text blocks with links; country and language selectors on/off.'),
    ('Slideshow', 'Slides', 'Image, heading, text, button per block; autoplay (pausable) and speed. First slide is the LCP image.'),
    ('Featured product', 'Product', 'Product picker, media (image, video, 3D), variant picker, buy buttons, @app blocks.'),
    ('Main product', 'Blocks', 'Title, price, variant picker, purchase options (selling plans), engraving field, quantity, buy buttons, pickup, USP list, collapsible tabs, true-size view, worn-with strip, share, @app and Custom Liquid.'),
    ('Main product', 'Sticky add to cart', 'On or off.'),
    ('Shop the look', 'Hotspots', 'Image plus up to 6 hotspot blocks, each with a product and X/Y position.'),
    ('Stack builder', 'Steps', 'Up to 4 step blocks, each with a product list. Discount label off by default and shown only when the merchant has created the automatic discount.'),
    ('Multicolumn', 'Columns', 'Number, suffix, heading and text per block; optional image.'),
    ('Testimonials', 'Quotes', 'Merchant-written quote, name and optional product link. No ratings or “verified” labels.'),
    ('Collection', 'Filters', 'Filter drawer with counts; story tile on or off.'),
    ('Every template', 'Custom Liquid', 'Custom Liquid section and block available on all section templates.'),
]


def states():
    def block(n, title, note, inner):
        return f'<section class="stcard"><header><span class="stcard__n">{n:02d}</span><h2>{title}</h2></header><p class="muted">{note}</p><div class="stcard__demo">{inner}</div></section>'
    blocks = [
        block(1, 'Hover', 'Mouse over the image for the jeweller’s loupe; the add button expands.', '<ul class="product-grid st-grid" data-st-hover></ul>'),
        block(2, 'Focus', 'Every interactive element has a visible 2px focus ring. Press Tab anywhere on the site.', '<div class="st-row"><button class="btn btn--primary is-focus">Primary button</button><button class="btn btn--outline is-focus">Outline</button><a class="link-arrow is-focus" href="page.html">Text link →</a></div><div class="field st-mt"><label for="st-f">Text field</label><input id="st-f" class="is-focus" value="Focused field"></div>'),
        block(3, 'Loading', 'Skeleton cards while filters update, and a spinner inside buttons while a request runs.', '<ul class="product-grid st-grid st-grid--2" data-st-loading aria-busy="true"></ul><div class="st-row st-mt"><button class="btn btn--primary is-loading" disabled aria-busy="true">Add to bag</button><button class="btn btn--outline is-loading" disabled>Saving</button></div>'),
        block(4, 'Empty collection', 'Live example: <a class="link-btn" href="collection.html?c=archive">The Archive</a>.', '<div class="state-empty"><h3 class="h4">This collection is empty</h3><p class="muted">There are no products here yet.</p><a class="btn btn--primary" href="collections.html">Browse collections</a></div>'),
        block(5, 'Error', 'Inline field errors with an error summary, and a stock limit message.', '<div class="error-summary" role="alert"><p><strong>Please fix 1 error:</strong></p><ul><li><a href="#st-e">Enter a valid email address, like name@example.com.</a></li></ul></div><div class="field has-error"><label for="st-e">Email</label><input id="st-e" value="name@" aria-invalid="true" aria-describedby="st-e-err"><p class="field__error" id="st-e-err">Enter a valid email address, like name@example.com.</p></div><p class="form-msg is-error">You can only add 3 of this item to your bag.</p>'),
        block(6, 'Sold out / unavailable variant', 'Crossed-out options, a notice and an “Email me when it’s available” link. Try the options below.', '<div class="st-variant" data-st-variant></div>'),
        block(7, 'Empty cart', 'Live: <a class="link-btn" href="index.html?cart=open">open the cart drawer</a> with nothing in it.', '<div class="cart-empty st-cart-empty"><p class="h4">Your bag is empty</p><p class="muted">Not sure where to start? Our most-worn piece is a good first one.</p><a class="btn btn--primary" href="collection.html">Shop the collection</a></div>'),
        block(8, 'Search no results', 'Live example: <a class="link-btn" href="search.html?q=xyz">search “xyz”</a>.', '<div class="state-empty"><h3 class="h4">No results for “xyz”</h3><p class="muted">Check the spelling or try one of these:</p><ul class="chips chips--center"><li><a href="search.html?q=ring">ring</a></li><li><a href="search.html?q=pearl">pearl</a></li></ul></div>'),
        block(9, 'Long product title', 'Titles are never truncated; the grid stays aligned.', '<ul class="product-grid st-grid" data-st-long></ul>'),
        block(10, 'Product without image', 'A branded placeholder keeps the card the same size.', '<ul class="product-grid st-grid" data-st-noimg></ul>'),
        block(11, 'Sold-out product', 'Badge, muted image and a disabled add button.', '<ul class="product-grid st-grid" data-st-sold></ul>'),
        block(12, 'Video media', 'Poster with a play badge; plays inline with controls. Also used for YouTube and Vimeo media.', '<div class="st-media" data-st-media></div>'),
        block(13, '3D and AR media', 'Opens a 3D view with button controls (rotate, zoom, reset) as a single-tap alternative to gestures, and “View in your space” on phones.', '<div class="st-media" data-st-media3d></div>'),
        block(14, 'Selling plan and gift card', 'Purchase options on the product page, plan name on cart lines; gift card with recipient form.', '<div class="st-row"><a class="btn btn--outline" href="product.html?id=1">Selling plan</a><a class="btn btn--outline" href="product.html?id=20">Gift card product</a><a class="btn btn--outline" href="password.html?state=error">Password error</a><a class="btn btn--outline" href="gift-card.html?state=expired">Expired gift card</a></div>'),
    ]
    rows = ''.join(f'<tr><td>{a}</td><th scope="row">{b}</th><td>{c}</td></tr>' for a, b, c in SETTINGS)
    from partials import TEMPLATES
    links = ''.join(f'<li><a href="{u}">{t}</a></li>' for u, t in TEMPLATES)
    return f"""<section class="phead" data-section="Page header"><div class="container">
  {breadcrumbs([('Home', 'index.html'), ('Theme states', None)])}
  <h1 class="phead__title">Theme states and settings</h1>
  <p class="phead__lead">Every state reviewers check, every template preview, and the merchant settings behind them.</p>
</div></section>
<section class="section section--tight" data-section="Preview links"><div class="container"><ul class="stlinks">{links}</ul></div></section>
<section class="section section--tight" data-section="States"><div class="container"><div class="stgrid">{''.join(blocks)}</div></div></section>
<section class="section section--tight" data-section="Settings map"><div class="container">
  <div class="section-head"><div><h2 class="h2">Settings map</h2><p class="muted">What merchants can change in the theme editor. The live ones are in the Theme settings button.</p></div></div>
  <div class="otbl-wrap"><table class="otbl settings-table"><caption class="visually-hidden">Merchant settings</caption><thead><tr><th scope="col">Where</th><th scope="col">Setting</th><th scope="col">Options</th></tr></thead><tbody>{rows}</tbody></table></div>
</div></section>"""
'''
open('templates.py', 'w').write(s)

# ------------------------------------------------------------------ build
edit('build.py', [
    ("    'states.html': page(", """    'account/orders.html': page('Your account | Ocean Fine Jewellery', D, 'customers-account', T.account_orders(), 'account'),
    'account/order.html': page('Order #1048 | Ocean Fine Jewellery', D, 'customers-order', T.account_order(), 'account'),
    'account/addresses.html': page('Addresses | Ocean Fine Jewellery', D, 'customers-addresses', T.account_addresses(), 'account'),
    'account/activate.html': page('Activate your account | Ocean Fine Jewellery', D, 'customers-activate', T.account_activate(), 'account'),
    'policies/privacy-policy.html': page('Privacy policy | Ocean Fine Jewellery', D, 'policy', T.policy('privacy')),
    'policies/terms-of-service.html': page('Terms of service | Ocean Fine Jewellery', D, 'policy', T.policy('terms')),
    'states.html': page("""),
    ("NAMES = [n[:-5] for n in PAGES if n != 'index.html']", "NAMES = sorted([n[:-5] for n in PAGES if n != 'index.html'], key=len, reverse=True)"),
    ("""        path, R = os.path.join(d, 'index.html'), '../'""", """        path, R = os.path.join(d, 'index.html'), '../' * (name.count('/') + 1)"""),
    ("    return html\n", """    # one italic accent only (the hero); section headings stay roman
    html = re.sub(r'(<h2 class="h2[^"]*">)(.*?)(</h2>)', lambda m: m.group(1) + m.group(2).replace('<em>', '').replace('</em>', '') + m.group(3), html, flags=re.S)
    return html
"""),
], regex=[
    (r"('index\.html': page\('Ocean Fine Jewellery[^\n]*?home\.home\(\))\)", r"\1, footer_news=False)"),
])
print('markup patched')
