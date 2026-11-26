"""Shared partials for the Ocean theme prototype (fine jewellery preset)."""
import json

def U(i, w, h=None, fp=None):
    s = f"https://images.unsplash.com/photo-{i}?auto=format&fit=crop&w={w}" + (f"&h={h}" if h else "") + "&q=78"
    if fp:
        s += f"&crop=focalpoint&fp-x={fp[0]}&fp-y={fp[1]}&fp-z={fp[2]}"
    return s

CHEV = '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
CHEV_UP = '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 7l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
ARR_L = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
ARR_R = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
X = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
SEARCH = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M20 20l-3.6-3.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
USER = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
BAG = '<svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
LOGO_MARK = '<svg class="logo__mark" width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="currentColor"/><path d="M5 18c3.5-4 7-4 11 0s7.5 4 11 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M5 12.5c3.5-4 7-4 11 0s7.5 4 11 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".55"/></svg>'
LOGO = f'<a class="logo" href="index.html" aria-label="Ocean Fine Jewellery, home">{LOGO_MARK}<span class="logo__word">OCEAN</span></a>'

FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230A7167'/%3E%3Cpath d='M5 19c3.5-4 7-4 11 0s7.5 4 11 0' fill='none' stroke='%23EAF7F6' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E"

COUNTRIES = [('US', '1', 'USD', 'United States (USD $)'), ('GB', '0.79', 'GBP', 'United Kingdom (GBP £)'), ('EU', '0.92', 'EUR', 'Europe (EUR €)'), ('CA', '1.37', 'CAD', 'Canada (CAD $)'), ('AU', '1.52', 'AUD', 'Australia (AUD $)')]

def country_menu(up=False):
    opts = ''.join(f'<li><button role="option" data-country="{c}" data-rate="{r}" data-code="{cd}"><span class="flag flag--{c.lower()}" aria-hidden="true"></span>{t}</button></li>' for c, r, cd, t in COUNTRIES)
    lang = '<li><button role="option" data-lang="English">English</button></li><li><button role="option" data-lang="Français">Français</button></li><li><button role="option" data-lang="Deutsch">Deutsch</button></li>'
    cls = 'dropdown dropdown--up' if up else 'dropdown'
    ch = CHEV_UP if up else CHEV
    return (f'<div class="{cls}" data-dropdown><button class="dropdown__toggle" aria-expanded="false" aria-haspopup="listbox" aria-label="Country / currency"><span data-current-country><span class="flag flag--us" aria-hidden="true"></span>United States (USD $)</span>{ch}</button><ul class="dropdown__menu" role="listbox" aria-label="Choose country">{opts}</ul></div>'
            f'<div class="{cls}" data-dropdown><button class="dropdown__toggle" aria-expanded="false" aria-haspopup="listbox" aria-label="Language"><span data-current-lang>English</span>{ch}</button><ul class="dropdown__menu" role="listbox" aria-label="Choose language">{lang}</ul></div>')

TEMPLATES = [('index.html', 'Home'), ('collection.html', 'Collection'), ('collections.html', 'Collection list'), ('product.html', 'Product'), ('cart.html', 'Cart page'),
             ('search.html?q=gold', 'Search results'), ('blog.html', 'Blog'), ('article.html', 'Article'), ('page.html', 'Page'), ('contact.html', 'Contact'),
             ('404.html', '404'), ('password.html', 'Password'), ('gift-card.html', 'Gift card'), ('account.html', 'Account'), ('states.html', 'States gallery')]


def head(title, desc, extra=''):
    return f'''<!doctype html>
<html lang="en" data-scheme="ocean" data-corners="rounded">
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
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="templates.css">
  <link rel="icon" href="{FAVICON}">{extra}
</head>
'''


def announcement():
    return f'''<div class="announcement" data-section="Announcement bar">
  <div class="container announcement__inner">
    <p class="announcement__proof"><span class="stars" aria-hidden="true">★★★★★</span> <strong>4.9</strong> from 2,840 reviews</p>
    <div class="announcement__center">
      <button class="announcement__arrow" aria-label="Previous announcement" data-ann="-1"><svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></button>
      <div class="announcement__slider" aria-live="polite">
        <p class="announcement__msg is-active"><span>Free express shipping on orders over <span data-money="100">$100.00</span></span></p>
        <p class="announcement__msg"><span>Free engraving on every ring and pendant</span></p>
        <p class="announcement__msg"><span>Build a stack of 3 and save 15%</span></p>
      </div>
      <button class="announcement__arrow" aria-label="Next announcement" data-ann="1"><svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></button>
    </div>
    <div class="announcement__right">
      <a class="announcement__link" href="account.html">Track order</a>
      <a class="announcement__link" href="contact.html">Help</a>
      <span class="announcement__sep" aria-hidden="true"></span>
      {country_menu()}
    </div>
  </div>
</div>
'''


def header(current=''):
    def cur(k):
        return ' aria-current="page"' if k == current else ''
    return f'''<header class="header" data-section="Header" id="header">
  <div class="container">
    <div class="header__inner">
      <button class="icon-btn header__burger" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false" data-open-menu>
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
      <nav class="nav" aria-label="Main">
        <ul class="nav__list">
          <li class="nav__item has-mega">
            <button class="nav__link" aria-expanded="false" aria-controls="mega-shop">Shop {CHEV}</button>
            <div class="mega" id="mega-shop">
              <div class="mega__inner">
                <div class="mega__cols">
                  <div class="mega__col"><p class="mega__title">Rings</p><ul>
                    <li><a href="collection.html?c=rings">All rings</a></li>
                    <li><a href="product.html?id=2">Engagement rings</a></li>
                    <li><a href="product.html?id=9">Stacking rings <span class="mega__badge">New</span></a></li>
                    <li><a href="product.html?id=14">Wedding bands</a></li>
                    <li><a href="page.html#size-guide">Ring size guide</a></li></ul></div>
                  <div class="mega__col"><p class="mega__title">Necklaces &amp; more</p><ul>
                    <li><a href="collection.html?c=necklaces">Necklaces</a></li>
                    <li><a href="collection.html?c=earrings">Earrings</a></li>
                    <li><a href="collection.html?c=bracelets">Bracelets</a></li>
                    <li><a href="collection.html?c=bridal">Bridal</a></li></ul></div>
                  <div class="mega__col"><p class="mega__title">Featured</p><ul>
                    <li><a href="collection.html?c=all">New arrivals</a></li>
                    <li><a href="collection.html?c=gifts-under-250">Gifts under <span data-money="250">$250.00</span></a></li>
                    <li><a href="index.html#bundle">Build a stack <span class="mega__badge mega__badge--sale">−15%</span></a></li>
                    <li><a href="gift-card.html">Gift cards</a></li></ul></div>
                  <a class="mega__all" href="collections.html">Shop all collections <span aria-hidden="true">→</span></a>
                </div>
                <a class="mega__feature" href="product.html?id=2">
                  <img src="{U('1591209627710-d2427565a41f', 600, 760, (0.52, 0.5, 1.6))}" alt="Halo solitaire diamond ring" width="300" height="380" loading="lazy">
                  <span class="mega__feature-text"><small>Bridal</small>Halo Solitaire Ring <span aria-hidden="true">→</span></span>
                </a>
                <a class="mega__feature" href="index.html#bundle">
                  <img src="{U('1599459183200-59c7687a0275', 600, 760)}" alt="Three layered gold necklaces" width="300" height="380" loading="lazy">
                  <span class="mega__feature-text"><small>Save 15%</small>Build a stack <span aria-hidden="true">→</span></span>
                </a>
              </div>
            </div>
          </li>
          <li class="nav__item"><a class="nav__link" href="collections.html"{cur('collections')}>Collections</a></li>
          <li class="nav__item"><a class="nav__link" href="collection.html?c=bridal"{cur('bridal')}>Bridal <span class="nav__dot" aria-hidden="true"></span></a></li>
        </ul>
      </nav>
      {LOGO}
      <div class="header__right">
        <ul class="nav__list nav__list--right">
          <li class="nav__item"><a class="nav__link" href="page.html"{cur('page')}>About</a></li>
          <li class="nav__item"><a class="nav__link" href="blog.html"{cur('blog')}>Journal</a></li>
        </ul>
        <button class="search-pill" aria-label="Search" data-open-search>{SEARCH}<span>Search</span><kbd>/</kbd></button>
        <a class="icon-btn header__account" href="account.html" aria-label="Account"{cur('account')}>{USER}</a>
        <a class="cart-btn cart-pill" href="cart.html" aria-label="Open bag" data-open-cart>{BAG}<span class="cart-pill__label">Bag</span><span class="cart-btn__count" data-cart-count>0</span></a>
      </div>
    </div>
  </div>
</header>
'''


def footer():
    return f'''<footer class="footer scheme-4" id="footer" data-section="Footer">
  <div class="container">
    <div class="footer__hero">
      <p class="footer__tag">Made to be<br><em>worn daily.</em></p>
      <ul class="footer__quick">
        <li><a href="contact.html"><span>Help centre</span><small>Answers in minutes</small><i aria-hidden="true">→</i></a></li>
        <li><a href="account.html"><span>Track an order</span><small>Live delivery updates</small><i aria-hidden="true">→</i></a></li>
        <li><a href="page.html#size-guide"><span>Ring size guide</span><small>Measure at home</small><i aria-hidden="true">→</i></a></li>
      </ul>
    </div>
    <div class="footer__top">
      <div class="footer__brand">
        <a class="logo logo--light" href="index.html" aria-label="Ocean Fine Jewellery, home">{LOGO_MARK.replace('#fff', '#0d1422')}<span class="logo__word">OCEAN</span></a>
        <p class="footer__about">Fine jewellery in recycled gold and conflict-free stones, designed to be worn every day.</p>
        <form class="footer__news" data-newsletter novalidate>
          <label for="f-email">Get 10% off your first order</label>
          <div class="footer__news-row"><input id="f-email" type="email" placeholder="Email address" autocomplete="email" required><button class="btn btn--light" type="submit">Join</button></div>
          <p class="form-msg" role="status" aria-live="polite" data-form-msg></p>
        </form>
        <div class="footer__social-row">
          <a class="follow-shop" href="#" aria-label="Follow on Shop"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.6 12 21 12 21z" fill="currentColor"/></svg>Follow on <strong>shop</strong></a>
          <ul class="socials" aria-label="Social media">
            <li><a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg></a></li>
            <li><a href="#" aria-label="TikTok"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3-3.46M14 3c.5 2.6 2.4 4.4 5 4.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></a></li>
            <li><a href="#" aria-label="Pinterest"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M11 8.5c3-1 5 .8 4.5 3.3-.4 2-2.4 3-3.7 1.6M11.5 10l-2 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></a></li>
          </ul>
        </div>
      </div>
      <nav class="footer__col" aria-label="Shop"><p class="footer__title">Shop</p><ul>
        <li><a href="collection.html?c=rings">Rings</a></li><li><a href="collection.html?c=necklaces">Necklaces</a></li><li><a href="collection.html?c=earrings">Earrings</a></li><li><a href="collection.html?c=bracelets">Bracelets</a></li><li><a href="collection.html?c=bridal">Bridal</a></li><li><a href="gift-card.html">Gift cards</a></li></ul></nav>
      <nav class="footer__col" aria-label="Help"><p class="footer__title">Help</p><ul>
        <li><a href="contact.html">Contact us</a></li><li><a href="page.html#size-guide">Size guide</a></li><li><a href="page.html#shipping">Shipping &amp; returns</a></li><li><a href="page.html#care">Jewellery care</a></li><li><a href="account.html">Your account</a></li></ul></nav>
      <nav class="footer__col" aria-label="Company"><p class="footer__title">Company</p><ul>
        <li><a href="page.html">Our story</a></li><li><a href="blog.html">The Journal</a></li><li><a href="page.html#materials">Materials</a></li><li><a href="states.html">Design states</a></li></ul></nav>
    </div>
    <div class="footer__bottom">
      <div class="footer__loc">{country_menu(up=True)}</div>
      <ul class="payments" aria-label="Payment methods accepted"><li>Visa</li><li>Mastercard</li><li>Amex</li><li>PayPal</li><li>Apple Pay</li><li class="pay-shop">Shop Pay</li></ul>
      <p class="footer__copy">© 2026 Ocean Fine Jewellery · <a href="page.html">Privacy</a> · <a href="page.html">Terms</a> · Powered by Shopify</p>
    </div>
  </div>
  <p class="footer__giant" aria-hidden="true">OCEAN</p>
</footer>
'''


def overlays():
    templ = ''.join(f'<li><a href="{u}">{t}</a></li>' for u, t in TEMPLATES)
    return f'''
<div class="drawer drawer--left" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <div class="drawer__head"><span class="logo__word">OCEAN</span><button class="icon-btn" aria-label="Close menu" data-close-drawer>{X}</button></div>
  <nav class="drawer__body mobile-nav" aria-label="Mobile">
    <details><summary>Rings</summary><ul><li><a href="collection.html?c=rings">All rings</a></li><li><a href="product.html?id=2">Engagement rings</a></li><li><a href="product.html?id=14">Wedding bands</a></li><li><a href="page.html#size-guide">Ring size guide</a></li></ul></details>
    <details><summary>Jewellery</summary><ul><li><a href="collection.html?c=necklaces">Necklaces</a></li><li><a href="collection.html?c=earrings">Earrings</a></li><li><a href="collection.html?c=bracelets">Bracelets</a></li></ul></details>
    <a href="collections.html">Collections</a>
    <a href="collection.html?c=bridal">Bridal</a>
    <a href="blog.html">Journal</a>
    <a href="page.html">About</a>
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
        <input id="search-input" name="q" type="search" placeholder="Search rings, pearls, gold…" autocomplete="off" aria-controls="search-results">
        <button class="icon-btn" type="button" aria-label="Close search" data-close-search>{X}</button>
      </form>
      <div class="search-modal__results" id="search-results" aria-live="polite">
        <div class="search-modal__suggest">
          <p class="mini-title">Popular searches</p>
          <ul class="chips"><li><button type="button" data-suggest="ring">ring</button></li><li><button type="button" data-suggest="pearl">pearl</button></li><li><button type="button" data-suggest="diamond">diamond</button></li><li><button type="button" data-suggest="hoop">hoop</button></li></ul>
          <ul class="search-modal__articles" data-search-articles></ul>
        </div>
        <div>
          <p class="mini-title" data-search-title>Trending now</p>
          <ul class="search-products" data-search-products></ul>
          <a class="btn btn--outline search-modal__all" href="search.html" data-search-all hidden>See all results for “<span></span>”</a>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal" id="quick-view" role="dialog" aria-modal="true" aria-labelledby="qv-title" hidden>
  <div class="modal__panel"><button class="icon-btn modal__close" aria-label="Close quick view" data-close-modal>{X}</button><div class="qv" data-qv></div></div>
</div>

<div class="drawer drawer--right cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" hidden>
  <div class="drawer__head">
    <p class="cart-drawer__title" id="cart-title">Your bag <span data-cart-count-label>(0)</span></p>
    <button class="icon-btn" aria-label="Close bag" data-close-drawer>{X}</button>
  </div>
  <div class="ship-meter">
    <p class="ship-meter__text" data-ship-text>Spend <strong>$100.00</strong> more for free express shipping</p>
    <div class="ship-meter__bar"><span data-ship-bar></span></div>
    <ol class="ship-meter__perks"><li data-perk="50"><span>Gift box</span></li><li data-perk="100"><span>Free shipping</span></li><li data-perk="250"><span>Polishing kit</span></li></ol>
  </div>
  <div class="drawer__body cart-drawer__body">
    <ul class="cart-lines" data-cart-lines></ul>
    <div class="cart-empty" data-cart-empty>
      <div class="cart-empty__art" aria-hidden="true">{BAG.replace('width="19" height="19"', 'width="40" height="40"')}</div>
      <p class="h4">Your bag is empty</p>
      <p class="muted">Not sure where to start? Our best seller is a good first piece.</p>
      <a class="btn btn--primary" href="collection.html">Shop best sellers</a>
    </div>
    <div class="upsell" data-upsell>
      <div class="upsell__head"><p class="mini-title">You may also like</p>
        <div class="slider-nav slider-nav--sm">
          <button class="icon-btn icon-btn--outline" aria-label="Previous suggestion" data-scroll="#upsell-track" data-dir="-1">{ARR_L}</button>
          <button class="icon-btn icon-btn--outline" aria-label="Next suggestion" data-scroll="#upsell-track" data-dir="1">{ARR_R}</button>
        </div></div>
      <ul class="upsell__track" id="upsell-track" data-upsell-track></ul>
    </div>
  </div>
  <div class="cart-drawer__foot" data-cart-foot hidden>
    <label class="gift-toggle"><input type="checkbox" data-gift><span class="gift-toggle__ui" aria-hidden="true"></span><span><strong>Add gift wrap</strong> Ribbon and a handwritten card · <span data-money="8">$8.00</span></span></label>
    <div class="cart-drawer__row"><span>Subtotal</span><strong data-cart-subtotal>$0.00</strong></div>
    <div class="cart-drawer__row cart-drawer__row--discount" data-bundle-row hidden><span>Stack discount</span><strong data-cart-discount>−$0.00</strong></div>
    <p class="cart-drawer__tax">Tax included. Discounts and shipping calculated at checkout.</p>
    <button class="btn btn--primary btn--block btn--lg" data-checkout>Check out · <span data-cart-total>$0.00</span></button>
    <div class="accel"><button class="accel__btn accel__btn--shop" aria-label="Buy with Shop Pay">Buy with <strong>shop</strong><em>Pay</em></button><button class="accel__btn accel__btn--apple" aria-label="Buy with Apple Pay"> Pay</button></div>
    <a class="cart-drawer__view" href="cart.html">View bag and add a note</a>
  </div>
</div>
<div class="overlay" data-overlay hidden></div>

<div class="settings" data-settings>
  <button class="settings__toggle" aria-expanded="false" aria-controls="settings-panel" data-settings-toggle>
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
    <span>Theme preview</span>
  </button>
  <div class="settings__panel" id="settings-panel" hidden>
    <p class="settings__title">Templates</p>
    <ul class="settings__templates">{templ}</ul>
    <fieldset><legend>Colour palette</legend><div class="swatches">
      <label><input type="radio" name="scheme" value="ocean" checked><span style="--a:#0A7167;--b:#EAF7F6"></span>Ocean</label>
      <label><input type="radio" name="scheme" value="sand"><span style="--a:#8A5A3B;--b:#F6EFE7"></span>Sand</label>
      <label><input type="radio" name="scheme" value="midnight"><span style="--a:#1E2A52;--b:#ECEFF8"></span>Midnight</label></div></fieldset>
    <fieldset><legend>Corners</legend><div class="seg">
      <label><input type="radio" name="corners" value="rounded" checked><span>Rounded</span></label>
      <label><input type="radio" name="corners" value="square"><span>Square</span></label></div></fieldset>
    <label class="switch"><input type="checkbox" data-show-sections><span class="switch__ui" aria-hidden="true"></span>Show section names</label>
  </div>
</div>
<button class="to-top" aria-label="Back to top" data-to-top><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
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
    lis = ''.join(f'<li><a href="{u}">{t}</a></li>' if u else f'<li aria-current="page"{extra}>{t}</li>' for t, u, extra in [(i[0], i[1], i[2] if len(i) > 2 else '') for i in items])
    return f'<nav class="crumbs" aria-label="Breadcrumb"><ol>{lis}</ol></nav>'
