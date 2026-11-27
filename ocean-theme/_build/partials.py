"""Shared partials for the Ocean theme prototype (fine jewellery preset)."""

def U(i, w, h=None, fp=None):
    s = f"https://images.unsplash.com/photo-{i}?auto=format&fit=crop&w={w}" + (f"&h={h}" if h else "") + "&q=80"
    if fp:
        s += f"&crop=focalpoint&fp-x={fp[0]}&fp-y={fp[1]}&fp-z={fp[2]}"
    return s

CHEV = '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'
CHEV_UP = '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 7l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'
ARR_L = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
ARR_R = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
X = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
SEARCH = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
USER = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="3.8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4.5 20.5c1.4-3.7 4.2-5.5 7.5-5.5s6.1 1.8 7.5 5.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
BAG = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
# Brand mark: a single ring with a wave through it (fine-jewellery monogram, no app-icon tile)
LOGO_MARK = '<svg class="logo__mark" width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6.5 17.5c3-3 6-3 9.5 0s6.5 3 9.5 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
LOGO = f'<a class="logo" href="index.html" aria-label="Ocean Fine Jewellery, home"><span class="logo__word">Ocean</span><span class="logo__sub">Fine jewellery</span></a>'

FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23ffffff'/%3E%3Ccircle cx='16' cy='16' r='12' fill='none' stroke='%230A7167' stroke-width='2.4'/%3E%3Cpath d='M7 17.5c3-3 6-3 9 0s6 3 9 0' fill='none' stroke='%230A7167' stroke-width='2.4' stroke-linecap='round'/%3E%3C/svg%3E"

COUNTRIES = [('US', '1', 'USD', 'United States (USD $)'), ('GB', '0.79', 'GBP', 'United Kingdom (GBP £)'), ('EU', '0.92', 'EUR', 'Europe (EUR €)'), ('CA', '1.37', 'CAD', 'Canada (CAD $)'), ('AU', '1.52', 'AUD', 'Australia (AUD $)')]


def country_menu(up=False):
    opts = ''.join(f'<li><button role="option" data-country="{c}" data-rate="{r}" data-code="{cd}"><span class="flag flag--{c.lower()}" aria-hidden="true"></span>{t}</button></li>' for c, r, cd, t in COUNTRIES)
    lang = '<li><button role="option" data-lang="English">English</button></li><li><button role="option" data-lang="Français">Français</button></li><li><button role="option" data-lang="Deutsch">Deutsch</button></li>'
    cls = 'dropdown dropdown--up' if up else 'dropdown'
    ch = CHEV_UP if up else CHEV
    return (f'<div class="{cls}" data-dropdown><button class="dropdown__toggle" aria-expanded="false" aria-haspopup="listbox" aria-label="Country / currency"><span data-current-country><span class="flag flag--us" aria-hidden="true"></span>United States (USD $)</span>{ch}</button><ul class="dropdown__menu" role="listbox" aria-label="Choose country">{opts}</ul></div>'
            f'<div class="{cls}" data-dropdown><button class="dropdown__toggle" aria-expanded="false" aria-haspopup="listbox" aria-label="Language"><span data-current-lang>English</span>{ch}</button><ul class="dropdown__menu" role="listbox" aria-label="Choose language">{lang}</ul></div>')


TEMPLATES = [
    ('Shop', [('index.html', 'Home'), ('collection.html', 'Collection'), ('collection.html?filters=open', 'Collection, filters open (mobile drawer)'), ('collections.html', 'Collection list'),
              ('product.html', 'Product'), ('product.html?id=8', 'Product, sold out'), ('product.html?id=20', 'Gift card product'), ('search.html?q=gold', 'Search results'), ('search.html?q=xyz', 'Search, no results')]),
    ('Cart', [('cart.html', 'Cart page'), ('cart.html?preview=empty', 'Cart page, empty'), ('index.html?cart=open', 'Cart drawer, open'), ('index.html?cart=open&preview=empty', 'Cart drawer, empty')]),
    ('Content', [('blog.html', 'Blog'), ('article.html', 'Article'), ('page.html', 'Page'), ('contact.html', 'Contact'), ('policies/privacy-policy.html', 'Privacy policy'), ('policies/terms-of-service.html', 'Terms of service'), ('404.html', '404')]),
    ('Customer', [('account.html', 'Sign in / register'), ('account/orders.html', 'Account: orders'), ('account/order.html', 'Account: order detail'), ('account/addresses.html', 'Account: addresses')]),
    ('Standalone', [('password.html', 'Password'), ('password.html?state=error', 'Password, error'), ('gift-card.html', 'Gift card'), ('gift-card.html?state=expired', 'Gift card, expired'), ('states.html', 'All states + settings')]),
]


def head(title, desc, extra=''):
    return f'''<!doctype html>
<html lang="en" data-scheme="ocean" data-corners="editorial" data-header="center">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="robots" content="noindex">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="{U('1633810542706-90e5ff7557be', 1200, 630)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://images.unsplash.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="templates.css">
  <link rel="stylesheet" href="ocean.css">
  <link rel="icon" href="{FAVICON}">{extra}
</head>
'''


def announcement():
    return f'''<div class="announcement" data-section="Announcement bar">
  <div class="container announcement__inner">
    <p class="announcement__msg is-active"><span class="nowrap">Free insured shipping over <span data-money="100">$100.00</span></span><span class="announcement__extra"> · Free resizing for 60 days</span></p>
    <div class="announcement__right">{country_menu()}</div>
  </div>
</div>
'''


def header(current=''):
    def cur(k):
        return ' aria-current="page"' if k == current else ''
    return f'''<header class="site-header" data-section="Header" id="header">
  <div class="container site-header__inner">
    <button class="site-header__icon site-header__burger" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false" data-open-menu>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18M3 16h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    </button>
    <nav class="site-nav" aria-label="Main">
      <ul class="site-nav__list">
        <li class="site-nav__item has-mega">
          <button class="site-nav__link" aria-expanded="false" aria-controls="mega-shop">Shop {CHEV}</button>
          <div class="mega" id="mega-shop">
            <div class="container mega__inner">
              <div class="mega__col"><p class="mega__title">Rings</p><ul>
                <li><a href="collection.html?c=rings">All rings</a></li><li><a href="product.html?id=2">Engagement</a></li><li><a href="product.html?id=9">Stacking</a></li><li><a href="product.html?id=14">Wedding bands</a></li></ul></div>
              <div class="mega__col"><p class="mega__title">Jewellery</p><ul>
                <li><a href="collection.html?c=necklaces">Necklaces</a></li><li><a href="collection.html?c=earrings">Earrings</a></li><li><a href="collection.html?c=bracelets">Bracelets</a></li><li><a href="collection.html">Shop all</a></li></ul></div>
              <div class="mega__col"><p class="mega__title">Guides</p><ul>
                <li><a href="page.html#size-guide">Ring size guide</a></li><li><a href="page.html#materials">Gold &amp; stones</a></li><li><a href="page.html#care">Care</a></li><li><a href="gift-card.html">Gift cards</a></li></ul></div>
              <a class="mega__feature" href="collection.html?c=bridal">
                <span class="mega__img"><img src="{U('1631982690223-8aa4be0a2497', 700, 520)}" alt="Rings displayed in a jewellery tray" width="350" height="260" loading="lazy"></span>
                <span class="mega__cap">The bridal edit <span aria-hidden="true">→</span></span>
              </a>
            </div>
          </div>
        </li>
        <li class="site-nav__item"><a class="site-nav__link" href="collection.html?c=bridal"{cur('bridal')}>Bridal</a></li>
        <li class="site-nav__item"><a class="site-nav__link" href="collection.html?c=gifts-under-250">Gifts</a></li>
        <li class="site-nav__item site-nav__item--far"><a class="site-nav__link" href="blog.html"{cur('blog')}>Journal</a></li>
      </ul>
    </nav>
    {LOGO}
    <div class="site-header__tools">
      <button class="site-header__icon" aria-label="Search" data-open-search>{SEARCH}</button>
      <a class="site-header__icon site-header__account" href="account.html" aria-label="Account"{cur('account')}>{USER}</a>
      <a class="site-header__bag cart-btn" href="cart.html" data-open-cart><span class="site-header__bag-ic">{BAG}</span><span class="site-header__bag-txt">Bag</span> <span class="site-header__bag-n">(<span data-cart-count>0</span>)</span></a>
    </div>
  </div>
</header>
'''


def footer():
    return f'''<footer class="site-footer" id="footer" data-section="Footer">
  <div class="container">
    <div class="site-footer__top">
      <div class="site-footer__brand">
        <p class="site-footer__word">Ocean</p>
        <p class="site-footer__about">Solid recycled 14k gold and lab-grown diamonds, cast, set and hallmarked by hand.</p>
        <form class="site-footer__news" data-newsletter novalidate>
          <label for="f-email">The Ocean letter: new pieces, once a month</label>
          <div class="site-footer__news-row"><input id="f-email" type="email" placeholder="Email address" autocomplete="email" required><button class="btn btn--light" type="submit">Subscribe</button></div>
          <p class="form-msg" role="status" aria-live="polite" data-form-msg></p>
        </form>
      </div>
      <nav class="site-footer__col" aria-label="Shop"><p class="site-footer__title">Shop</p><ul>
        <li><a href="collection.html?c=rings">Rings</a></li><li><a href="collection.html?c=necklaces">Necklaces</a></li><li><a href="collection.html?c=earrings">Earrings</a></li><li><a href="collection.html?c=bracelets">Bracelets</a></li><li><a href="collection.html?c=bridal">Bridal</a></li><li><a href="gift-card.html">Gift cards</a></li></ul></nav>
      <nav class="site-footer__col" aria-label="Help"><p class="site-footer__title">Help</p><ul>
        <li><a href="contact.html">Contact</a></li><li><a href="page.html#size-guide">Size guide</a></li><li><a href="page.html#shipping">Shipping &amp; returns</a></li><li><a href="page.html#care">Care</a></li><li><a href="account.html">Account</a></li></ul></nav>
      <nav class="site-footer__col" aria-label="Ocean"><p class="site-footer__title">Ocean</p><ul>
        <li><a href="page.html">Our workshop</a></li><li><a href="page.html#materials">Gold &amp; stones</a></li><li><a href="blog.html">Journal</a></li><li><a href="states.html">Theme states</a></li></ul></nav>
    </div>
    <div class="site-footer__mid">
      <ul class="socials" aria-label="Social media">
        <li><a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor"/></svg></a></li>
        <li><a href="#" aria-label="Pinterest"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M11 8.5c3-1 5 .8 4.5 3.3-.4 2-2.4 3-3.7 1.6M11.5 10l-2 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></a></li>
        <li><a href="#" aria-label="TikTok"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3-3.46M14 3c.5 2.6 2.4 4.4 5 4.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></a></li>
      </ul>
      <a class="follow-shop" href="#" aria-label="Follow on Shop"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.6 12 21 12 21z" fill="currentColor"/></svg>Follow on <strong>shop</strong></a>
    </div>
    <div class="site-footer__bottom">
      <div class="footer__loc">{country_menu(up=True)}</div>
      <ul class="payments" aria-label="Payment methods accepted"><li>Visa</li><li>Mastercard</li><li>Amex</li><li>PayPal</li><li>Apple Pay</li><li>Shop Pay</li></ul>
      <p class="site-footer__copy">© 2026 Ocean Fine Jewellery · <a href="policies/privacy-policy.html">Privacy policy</a> · <a href="policies/terms-of-service.html">Terms of service</a> · Powered by Shopify</p>
    </div>
  </div>
</footer>
'''


def settings_panel():
    groups = ''.join(f'<p class="settings__group">{g}</p><ul class="settings__templates">' + ''.join(f'<li><a href="{u}">{t}</a></li>' for u, t in items) + '</ul>' for g, items in TEMPLATES)
    def seg(name, opts, default):
        return f'<div class="seg seg--{len(opts)}">' + ''.join(f'<label><input type="radio" name="{name}" value="{v}"{" checked" if v == default else ""}><span>{t}</span></label>' for v, t in opts) + '</div>'
    def sw(key, label, hint):
        return f'<label class="switch"><input type="checkbox" data-setting="{key}" checked><span class="switch__ui" aria-hidden="true"></span><span>{label}<small>{hint}</small></span></label>'
    return f'''
<div class="settings" data-settings>
  <button class="settings__toggle" aria-expanded="false" aria-controls="settings-panel" data-settings-toggle>
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="16" cy="7" r="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="10" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
    <span>Theme settings</span>
  </button>
  <div class="settings__panel" id="settings-panel" role="dialog" aria-label="Theme settings preview" hidden>
    <p class="settings__title">Theme settings <span>preview</span></p>
    <p class="settings__hint">In Shopify these are in Theme settings and section settings. Changes here are saved in this browser only.</p>
    <fieldset><legend>Header layout</legend>{seg('header', [('center', 'Logo centred'), ('left', 'Logo left')], 'center')}</fieldset>
    <fieldset><legend>Corner style</legend>{seg('corners', [('square', 'Square'), ('editorial', 'Editorial'), ('soft', 'Soft')], 'editorial')}</fieldset>
    <fieldset><legend>Colour scheme</legend><div class="swatches">
      <label><input type="radio" name="scheme" value="ocean" checked><span style="--a:#0A7167;--b:#F3F7F6"></span>Ocean</label>
      <label><input type="radio" name="scheme" value="sand"><span style="--a:#8A5A3B;--b:#F6EFE7"></span>Sand</label>
      <label><input type="radio" name="scheme" value="midnight"><span style="--a:#1E2A52;--b:#ECEFF8"></span>Midnight</label></div></fieldset>
    <fieldset><legend>Features</legend>
      {sw('stickyAtc', 'Sticky add to cart', 'Product page bar after scrolling')}
      {sw('hallmarks', 'Hallmark row', 'Material and service promises')}
      {sw('upsell', 'Cart upsell', 'Suggested piece in cart drawer')}
      {sw('hoverSwap', 'Second image on hover', 'Product cards')}
      <label class="switch"><input type="checkbox" data-show-sections><span class="switch__ui" aria-hidden="true"></span><span>Show section names<small>Outline each Shopify section</small></span></label>
    </fieldset>
    <details class="settings__pages"><summary>All templates &amp; states</summary>{groups}</details>
  </div>
</div>
'''


def overlays():
    return f'''
<div class="drawer drawer--left" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <div class="drawer__head"><span class="logo__word">Ocean</span><button class="site-header__icon" aria-label="Close menu" data-close-drawer>{X}</button></div>
  <nav class="drawer__body mobile-nav" aria-label="Mobile">
    <details open><summary>Shop</summary><ul><li><a href="collection.html?c=rings">Rings</a></li><li><a href="collection.html?c=necklaces">Necklaces</a></li><li><a href="collection.html?c=earrings">Earrings</a></li><li><a href="collection.html?c=bracelets">Bracelets</a></li><li><a href="collection.html">Shop all</a></li></ul></details>
    <a href="collection.html?c=bridal">Bridal</a>
    <a href="collection.html?c=gifts-under-250">Gifts</a>
    <a href="blog.html">Journal</a>
    <a href="page.html">Our workshop</a>
    <a href="account.html">Account</a>
  </nav>
  <div class="drawer__foot mobile-nav__loc">{country_menu(up=True)}</div>
</div>

<div class="search-modal" id="search" role="dialog" aria-modal="true" aria-label="Search" hidden>
  <div class="search-modal__panel">
    <div class="container">
      <form class="search-modal__form" role="search" action="search.html" data-search-form>
        <label class="visually-hidden" for="search-input">Search products</label>
        {SEARCH}
        <input id="search-input" name="q" type="search" placeholder="Search rings, pearls, gold" autocomplete="off" aria-controls="search-results">
        <button class="site-header__icon" type="button" aria-label="Close search" data-close-search>{X}</button>
      </form>
      <div class="search-modal__results" id="search-results" aria-live="polite">
        <div class="search-modal__suggest">
          <p class="mini-title">Popular searches</p>
          <ul class="chips"><li><button type="button" data-suggest="ring">ring</button></li><li><button type="button" data-suggest="pearl">pearl</button></li><li><button type="button" data-suggest="diamond">diamond</button></li><li><button type="button" data-suggest="hoop">hoop</button></li></ul>
          <ul class="search-modal__articles" data-search-articles></ul>
        </div>
        <div>
          <p class="mini-title" data-search-title>Most loved</p>
          <ul class="search-products" data-search-products></ul>
          <a class="btn btn--outline search-modal__all" href="search.html" data-search-all hidden>See all results for “<span></span>”</a>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal" id="quick-view" role="dialog" aria-modal="true" aria-labelledby="qv-title" hidden>
  <div class="modal__panel"><button class="site-header__icon modal__close" aria-label="Close quick view" data-close-modal>{X}</button><div class="qv" data-qv></div></div>
</div>

<div class="drawer drawer--right cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" hidden>
  <div class="drawer__head">
    <p class="cart-drawer__title" id="cart-title">Your bag <span data-cart-count-label>(0)</span></p>
    <button class="site-header__icon" aria-label="Close bag" data-close-drawer>{X}</button>
  </div>
  <p class="cart-drawer__ship" data-ship-text>Free insured shipping over $100.00</p>
  <div class="drawer__body cart-drawer__body">
    <ul class="cart-lines" data-cart-lines></ul>
    <div class="cart-empty" data-cart-empty>
      <p class="cart-empty__title">Your bag is empty</p>
      <p class="muted">Start with a piece you will wear every day.</p>
      <a class="btn btn--primary" href="collection.html">Shop the collection</a>
      <ul class="cart-empty__links"><li><a href="collection.html?c=rings">Rings</a></li><li><a href="collection.html?c=necklaces">Necklaces</a></li><li><a href="collection.html?c=earrings">Earrings</a></li></ul>
    </div>
    <div class="upsell" data-upsell>
      <p class="mini-title">Pairs well with</p>
      <ul class="upsell__list" data-upsell-track></ul>
    </div>
  </div>
  <div class="cart-drawer__foot" data-cart-foot hidden>
    <div class="cart-drawer__row"><span>Subtotal</span><strong data-cart-subtotal>$0.00</strong></div>
    <div class="cart-drawer__row cart-drawer__row--discount" data-bundle-row hidden><span>Stack discount</span><strong data-cart-discount>−$0.00</strong></div>
    <p class="cart-drawer__tax">Tax included. Shipping calculated at checkout.</p>
    <button class="btn btn--primary btn--block btn--lg" data-checkout>Check out · <span data-cart-total>$0.00</span></button>
    <a class="cart-drawer__view" href="cart.html">View bag, add a note or gift wrap</a>
  </div>
</div>
<div class="overlay" data-overlay hidden></div>
{settings_panel()}
<button class="to-top" aria-label="Back to top" data-to-top><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
<div class="toast" role="status" aria-live="polite" data-toast></div>
'''


SCRIPTS = '''
<script src="data.js"></script>
<script src="script.js"></script>
<script src="pages.js"></script>
</body>
</html>
'''


def page(title, desc, body_class, main, current='', extra_head=''):
    return (head(title, desc, extra_head) +
            f'<body class="template-{body_class}">\n<a class="skip-link" href="#main">Skip to content</a>\n' +
            announcement() + header(current) +
            f'<main id="main">\n{main}\n</main>\n' + footer() + overlays() + SCRIPTS)


def standalone(title, desc, body_class, main, extra_head=''):
    return (head(title, desc, extra_head) +
            f'<body class="template-{body_class} layout-standalone">\n<main id="main">\n{main}\n</main>\n<div class="toast" role="status" aria-live="polite" data-toast></div>' + SCRIPTS)


def breadcrumbs(items):
    lis = ''.join(f'<li><a href="{i[1]}">{i[0]}</a></li>' if i[1] else f'<li aria-current="page">{i[0]}</li>' for i in items)
    return f'<nav class="crumbs" aria-label="Breadcrumb"><ol>{lis}</ol></nav>'
