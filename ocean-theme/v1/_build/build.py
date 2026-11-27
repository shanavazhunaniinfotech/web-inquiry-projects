import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from partials import page, standalone
import home, templates as T

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
D = 'Ocean Fine Jewellery — Shopify theme prototype: recycled gold rings, necklaces and earrings.'

product_crumbs = '<div class="container"><nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li><li><a href="collection.html" data-p-crumb-type>Jewellery</a></li><li aria-current="page"><span data-p-crumb></span></li></ol></nav></div>'
prod = T.product()
prod = product_crumbs + prod[prod.index('</div>') + 6:]

states = T.states().replace('<ul class="product-grid st-grid st-grid--2"><li data-st-loading-wrap style="display:contents"></li></ul>', '<ul class="product-grid st-grid st-grid--2" data-st-loading aria-busy="true"></ul>')

QR = '\n  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" defer></script>'

PAGES = {
    'index.html': page('Ocean Fine Jewellery — Recycled gold, made to be worn daily', D, 'index', home.home(), footer_news=False),
    'collection.html': page('All jewellery | Ocean Fine Jewellery', D, 'collection', T.collection(), 'collections'),
    'collections.html': page('Collections | Ocean Fine Jewellery', D, 'list-collections', T.collections(), 'collections'),
    'product.html': page('Product | Ocean Fine Jewellery', D, 'product', prod),
    'cart.html': page('Your bag | Ocean Fine Jewellery', D, 'cart', T.cart()),
    'search.html': page('Search | Ocean Fine Jewellery', D, 'search', T.search()),
    'blog.html': page('The Journal | Ocean Fine Jewellery', D, 'blog', T.blog(), 'blog'),
    'article.html': page('Article | The Ocean Journal', D, 'article', T.article(), 'blog'),
    'page.html': page('About Ocean | Ocean Fine Jewellery', D, 'page', T.page(), 'page'),
    'contact.html': page('Contact us | Ocean Fine Jewellery', D, 'contact', T.contact()),
    '404.html': page('Page not found | Ocean Fine Jewellery', D, '404', T.notfound()),
    'password.html': standalone('Opening soon | Ocean Fine Jewellery', D, 'password', T.password()),
    'gift-card.html': standalone('Your gift card | Ocean Fine Jewellery', D, 'gift-card', T.giftcard(), QR),
    'account.html': page('Account | Ocean Fine Jewellery', D, 'account', T.account(), 'account'),
    'account/orders.html': page('Your account | Ocean Fine Jewellery', D, 'customers-account', T.account_orders(), 'account'),
    'account/order.html': page('Order #1048 | Ocean Fine Jewellery', D, 'customers-order', T.account_order(), 'account'),
    'account/addresses.html': page('Addresses | Ocean Fine Jewellery', D, 'customers-addresses', T.account_addresses(), 'account'),
    'account/activate.html': page('Activate your account | Ocean Fine Jewellery', D, 'customers-activate', T.account_activate(), 'account'),
    'policies/privacy-policy.html': page('Privacy policy | Ocean Fine Jewellery', D, 'policy', T.policy('privacy')),
    'policies/terms-of-service.html': page('Terms of service | Ocean Fine Jewellery', D, 'policy', T.policy('terms')),
    'states.html': page('Design states | Ocean Fine Jewellery', D, 'states', states),
}
import re
NAMES = sorted([n[:-5] for n in PAGES if n != 'index.html'], key=len, reverse=True)
def fix(html, R):
    html = html.replace('<html lang="en"', '<html lang="en" data-root="' + R + '"', 1)
    html = re.sub(r'(href|action)="index\.html', lambda m: m.group(1) + '="' + (R or './'), html)
    html = re.sub(r'(href|action)="(' + '|'.join(map(re.escape, NAMES)) + r')\.html', lambda m: m.group(1) + '="' + R + m.group(2) + '/', html)
    html = re.sub(r'(href|src)="(style\.css|templates\.css|ready\.css|data\.js|script\.js|pages\.js)"', lambda m: m.group(1) + '="' + R + m.group(2) + '"', html)
    # one italic accent only (the hero); section headings stay roman
    html = re.sub(r'(<h2 class="h2[^"]*">)(.*?)(</h2>)', lambda m: m.group(1) + m.group(2).replace('<em>', '').replace('</em>', '') + m.group(3), html, flags=re.S)
    return html
for name, html in PAGES.items():
    if name == 'index.html':
        path, R = os.path.join(OUT, 'index.html'), ''
    else:
        d = os.path.join(OUT, name[:-5]); os.makedirs(d, exist_ok=True)
        path, R = os.path.join(d, 'index.html'), '../' * (name.count('/') + 1)
    with open(path, 'w') as f:
        f.write(fix(html, R))
print('wrote', len(PAGES), 'pages')
