/* Souqna marketplace prototype — shared behaviour (header, footer, cart, proposal guide). */
const ROOT = document.body.dataset.root || '';
const SCREEN = document.body.dataset.screen || '';
const IN_FRAME = window.self !== window.top;
if (IN_FRAME) document.documentElement.classList.add('in-frame');

const store = {
  get(k, d) { try { const v = localStorage.getItem('souqna_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('souqna_' + k, JSON.stringify(v)); } catch (e) {} }
};

/* ---------- Requirement map & screens ---------- */
const REQS = [
  { id: 1, t: 'Custom-designed homepage & marketplace UI', s: ['store'] },
  { id: 2, t: 'Individual vendor storefronts & profiles', s: ['vendor', 'store'] },
  { id: 3, t: 'Vendor registration & onboarding', s: ['sell'] },
  { id: 4, t: 'Vendor login with SMS OTP', s: ['vendor-login'] },
  { id: 5, t: 'Vendor dashboard: products, inventory, orders, sales', s: ['vendor-dashboard'] },
  { id: 6, t: 'Customer registration, login, account & order tracking', s: ['account'] },
  { id: 7, t: 'Collections, categories, search, filtering & sorting', s: ['shop', 'store'] },
  { id: 8, t: 'Shopping cart, checkout & payment gateway', s: ['checkout', 'product'] },
  { id: 9, t: 'Central admin dashboard: vendors, products, orders', s: ['admin'] },
  { id: 10, t: 'Vendor approval & management', s: ['admin'] },
  { id: 11, t: 'Commission calculation & vendor payouts', s: ['admin', 'vendor-dashboard'] },
  { id: 12, t: 'Third-party apps & API integrations', s: ['admin'] },
  { id: 13, t: 'Works on desktop, tablet & mobile', s: ['mobile'] },
  { id: 14, t: 'MVP first, expand as the business grows', s: ['hub'] }
];

const SCREENS = [
  { key: 'hub', path: '', title: 'Proposal overview', role: 'Overview',
    notes: ['Every requirement mapped to the screen that shows it', 'How it is built on Shopify', 'MVP scope, phases & next steps'] },
  { key: 'store', path: 'store/', title: 'Marketplace homepage', role: 'Customer',
    notes: ['Custom marketplace UI (not a stock Shopify theme)', 'Search bar with live suggestions', 'Shop by category & featured vendor storefronts', 'Every product shows which vendor sells it', 'Premium side cart with upsells (add anything to try it)'] },
  { key: 'shop', path: 'shop/', title: 'Collections, search & filters', role: 'Customer',
    notes: ['Search by keyword (try "oud" or "coffee")', 'Filter by category, vendor, price & rating', 'Sort by popularity, price & rating', 'Mobile: filters open as a bottom sheet'] },
  { key: 'product', path: 'product/?id=over-ear', title: 'Product page', role: 'Customer',
    notes: ['Gallery, price, stock & delivery estimate', '"Sold by" vendor card linking to their storefront', 'Frequently bought together bundle', 'More from this vendor'] },
  { key: 'vendor', path: 'vendor/?v=nook-grain', title: 'Vendor storefront', role: 'Customer',
    notes: ['Each vendor gets a branded storefront & profile', 'Banner, logo, rating, followers & policies', 'Vendor’s own catalogue with search & sort', 'About, reviews & policies tabs'] },
  { key: 'checkout', path: 'checkout/', title: 'Checkout & payment', role: 'Customer',
    notes: ['One checkout for items from many vendors', 'Order split by vendor shipments automatically', 'Payment options: Mada, Apple Pay, cards, Tabby, COD (via Shopify Payments / gateway)', 'Order confirmation with tracking per vendor'] },
  { key: 'account', path: 'account/', title: 'Customer account & tracking', role: 'Customer',
    notes: ['Register / sign in (email or phone OTP)', 'Order history & live tracking timeline per vendor', 'Addresses, wishlist & profile'] },
  { key: 'sell', path: 'sell/', title: 'Vendor registration', role: 'Vendor',
    notes: ['"Sell with us" landing for new vendors', '4-step onboarding: store, phone OTP, documents, payouts', 'Application goes to admin for approval'] },
  { key: 'vendor-login', path: 'vendor-login/', title: 'Vendor SMS OTP login', role: 'Vendor',
    notes: ['Passwordless login with a 6-digit SMS code', 'Code auto-fill, resend timer & attempt limit', 'Simulated SMS appears on screen in this demo'] },
  { key: 'vendor-dashboard', path: 'vendor-dashboard/', title: 'Vendor dashboard', role: 'Vendor',
    notes: ['Sales overview & key numbers', 'Products: add / edit / hide', 'Inventory with low-stock alerts', 'Orders: accept, fulfil & add tracking', 'Earnings, commission & payouts', 'Storefront settings'] },
  { key: 'admin', path: 'admin/', title: 'Admin control panel', role: 'Admin',
    notes: ['Marketplace-wide numbers', 'Approve / reject vendor applications', 'Manage vendors, products & orders', 'Commission rules & vendor payouts', 'Apps & integrations (Shopify, SMS, payments)'] }
];
const screenIdx = SCREENS.findIndex(s => s.key === SCREEN);
const curScreen = SCREENS[screenIdx];

/* ---------- Icons ---------- */
const I = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M4 9 5.5 4h13L20 9M4 9v11h16V9M4 9c0 1.7 1.3 3 3 3s2.7-1.3 2.7-3c0 1.7 1.3 3 2.8 3s2.8-1.3 2.8-3c0 1.7 1.2 3 2.7 3s3-1.3 3-3"/><path d="M10 20v-5h4v5"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6L12 16.8 6.6 19.6l1.1-6-4.5-4.2 6.1-.8L12 3Z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>',
  desk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  verified: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5 14.4 4l2.8-.2 1.2 2.6 2.5 1.3-.2 2.8L22 13l-1.3 2.4.2 2.8-2.6 1.2-1.3 2.5-2.8-.2L12 23.2 9.6 21.7l-2.8.2-1.2-2.6L3 18l.2-2.8L2 12.8l1.3-2.4L3 7.6l2.6-1.2L6.9 4l2.8.2L12 2.5Z" opacity=".95"/><path d="m8.2 12.4 2.6 2.6 5-5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 4 8 4.5 7.5 8 12 8Zm0 0s1.5-4 4-3.5S16.5 8 12 8Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/></svg>'
};
const stars = r => `<span class="stars" aria-label="${r} out of 5">${I.star}<b>${r.toFixed(1)}</b></span>`;

/* ---------- Product card ---------- */
function productCard(p, opts = {}) {
  const v = vendorById(p.vendor);
  const wish = store.get('wish', []);
  const off = p.compare ? Math.round((1 - p.price / p.compare) * 100) : 0;
  return `<article class="pcard${opts.compact ? ' compact' : ''}"><div class="pcard-media">
    <a class="pcard-img" href="${ROOT}product/?id=${p.id}">
      <img src="${IMG(p.img, 520, 600)}" alt="${p.name}" loading="lazy">
      ${p.badge && p.badge !== 'Add-on' ? `<span class="pbadge${p.badge.startsWith('-') ? ' sale' : ''}">${p.badge}</span>` : off ? `<span class="pbadge sale">-${off}%</span>` : ''}
    </a>
    <button class="wish${wish.includes(p.id) ? ' on' : ''}" data-wish="${p.id}" aria-label="Save to wishlist">${I.heart}</button>
    <button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to cart">${I.plus}<span>Add to cart</span></button></div>
    <div class="pcard-body">
      <a class="pcard-vendor" href="${ROOT}vendor/?v=${v.id}"><i style="background:${v.color}">${v.name[0]}</i>${v.name}</a>
      <a class="pcard-name" href="${ROOT}product/?id=${p.id}">${p.name}</a>
      <div class="pcard-meta"><span class="price">${money(p.price)}${p.compare ? ` <s>${money(p.compare)}</s>` : ''}</span>${stars(p.rating)}</div>
    </div>
  </article>`;
}

function vendorCard(v) {
  const items = PRODUCTS.filter(p => p.vendor === v.id).slice(0, 3);
  return `<a class="vcard" href="${ROOT}vendor/?v=${v.id}">
    <div class="vcard-banner"><img src="${IMG(v.banner, 600, 300)}" alt="" loading="lazy"></div>
    <div class="vcard-logo" style="background:${v.color}">${v.name.split(' ').map(w => w[0]).join('').replace('&', '').slice(0, 2)}</div>
    <div class="vcard-body">
      <strong>${v.name} <span class="vtick">${I.verified}</span></strong>
      <span class="muted">${v.cat} · ${v.city}</span>
      <div class="vcard-stats">${stars(v.rating)}<span>${v.reviews.toLocaleString()} reviews</span><span>${v.followers} followers</span></div>
      <div class="vcard-thumbs">${items.map(p => `<img src="${IMG(p.img, 160, 160)}" alt="" loading="lazy">`).join('')}</div>
    </div>
  </a>`;
}

/* ---------- Site header / footer (customer side) ---------- */
function renderSiteChrome() {
  const h = document.getElementById('site-header');
  if (h) {
    h.outerHTML = `
    <div class="announce"><div class="wrap"><span>${I.truck} Free delivery on orders over SAR 300 · one checkout for every vendor</span><a href="${ROOT}sell/">Sell on Souqna ${I.arrow}</a></div></div>
    <header class="site-header" id="siteHeader">
      <div class="wrap sh-row">
        <button class="icon-btn only-m" id="menuBtn" aria-label="Menu">${I.menu}</button>
        <a class="brand" href="${ROOT}store/"><span class="brand-mark">S</span><span>Souqna</span></a>
        <form class="sh-search" action="${ROOT}shop/" autocomplete="off" role="search">
          ${I.search}<input name="q" id="searchInput" placeholder="Search products, vendors, categories…" aria-label="Search">
          <div class="suggest" id="suggest"></div>
        </form>
        <nav class="sh-actions">
          <a class="sh-link only-d" href="${ROOT}vendor-login/">${I.store}<span>Vendor login</span></a>
          <a class="icon-btn" href="${ROOT}account/" aria-label="Account">${I.user}</a>
          <button class="icon-btn cart-btn" data-open-cart aria-label="Open cart">${I.bag}<b class="cart-count" hidden>0</b></button>
        </nav>
      </div>
      <nav class="wrap sh-cats">
        <a href="${ROOT}shop/">All products</a>
        ${CATEGORIES.map(c => `<a href="${ROOT}shop/?cat=${encodeURIComponent(c.name)}">${c.name}</a>`).join('')}
        <a href="${ROOT}store/#vendors">Vendors</a>
        <a class="hot" href="${ROOT}shop/?sort=deals">Deals</a>
      </nav>
    </header>
    <div class="mnav" id="mnav"><div class="mnav-panel">
      <div class="mnav-head"><a class="brand" href="${ROOT}store/"><span class="brand-mark">S</span><span>Souqna</span></a><button class="icon-btn" data-close-mnav>${I.x}</button></div>
      <a href="${ROOT}shop/">All products</a>
      ${CATEGORIES.map(c => `<a href="${ROOT}shop/?cat=${encodeURIComponent(c.name)}">${c.name}</a>`).join('')}
      <a href="${ROOT}store/#vendors">All vendors</a>
      <hr><a href="${ROOT}account/">My account & orders</a><a href="${ROOT}sell/">Sell on Souqna</a><a href="${ROOT}vendor-login/">Vendor login (SMS OTP)</a>
    </div></div>`;
    initSearch();
    document.getElementById('menuBtn').onclick = () => document.getElementById('mnav').classList.add('open');
    document.querySelector('[data-close-mnav]').onclick = () => document.getElementById('mnav').classList.remove('open');
    document.getElementById('mnav').addEventListener('click', e => { if (e.target.id === 'mnav') e.currentTarget.classList.remove('open'); });
  }
  const f = document.getElementById('site-footer');
  if (f) {
    f.outerHTML = `<footer class="site-footer">
      <div class="wrap foot-grid">
        <div><a class="brand light" href="${ROOT}store/"><span class="brand-mark">S</span><span>Souqna</span></a>
          <p>One marketplace, hundreds of independent vendors, a single secure checkout.</p>
          <div class="pay-row"><span>mada</span><span>Apple Pay</span><span>VISA</span><span>Mastercard</span><span>tabby</span></div></div>
        <div><h4>Shop</h4>${CATEGORIES.map(c => `<a href="${ROOT}shop/?cat=${encodeURIComponent(c.name)}">${c.name}</a>`).join('')}</div>
        <div><h4>Customers</h4><a href="${ROOT}account/">My account</a><a href="${ROOT}account/">Track an order</a><a href="${ROOT}checkout/">Checkout</a><a href="#">Returns & refunds</a></div>
        <div><h4>Vendors</h4><a href="${ROOT}sell/">Become a vendor</a><a href="${ROOT}vendor-login/">Vendor login</a><a href="${ROOT}vendor-dashboard/">Vendor dashboard</a><a href="#">Seller policies</a></div>
      </div>
      <div class="wrap foot-base"><span>© 2026 Souqna (working name). Prototype for discussion.</span><span>Powered by Shopify</span></div>
    </footer>
    <nav class="tabbar" aria-label="Mobile navigation">
      <a href="${ROOT}store/" class="${SCREEN === 'store' ? 'on' : ''}">${I.home}<span>Home</span></a>
      <a href="${ROOT}shop/" class="${SCREEN === 'shop' ? 'on' : ''}">${I.grid}<span>Shop</span></a>
      <a href="${ROOT}store/#vendors" class="${SCREEN === 'vendor' ? 'on' : ''}">${I.store}<span>Vendors</span></a>
      <button data-open-cart>${I.bag}<span>Cart</span><b class="cart-count" hidden>0</b></button>
      <a href="${ROOT}account/" class="${SCREEN === 'account' ? 'on' : ''}">${I.user}<span>Account</span></a>
    </nav>`;
  }
}

function initSearch() {
  const inp = document.getElementById('searchInput'), box = document.getElementById('suggest');
  if (!inp) return;
  const q0 = new URLSearchParams(location.search).get('q');
  if (q0) inp.value = q0;
  inp.addEventListener('input', () => {
    const q = inp.value.trim().toLowerCase();
    if (q.length < 2) { box.classList.remove('open'); return; }
    const ps = PRODUCTS.filter(p => (p.name + p.cat).toLowerCase().includes(q)).slice(0, 4);
    const vs = VENDORS.filter(v => (v.name + v.cat).toLowerCase().includes(q)).slice(0, 2);
    const cs = CATEGORIES.filter(c => c.name.toLowerCase().includes(q)).slice(0, 2);
    if (!ps.length && !vs.length && !cs.length) { box.innerHTML = `<div class="sg-empty">No matches for “${inp.value}”. Press enter to search all.</div>`; box.classList.add('open'); return; }
    box.innerHTML =
      (ps.length ? `<h6>Products</h6>${ps.map(p => `<a href="${ROOT}product/?id=${p.id}"><img src="${IMG(p.img, 80, 80)}" alt=""><span>${p.name}<small>${vendorById(p.vendor).name} · ${money(p.price)}</small></span></a>`).join('')}` : '') +
      (vs.length ? `<h6>Vendors</h6>${vs.map(v => `<a href="${ROOT}vendor/?v=${v.id}"><i class="sg-logo" style="background:${v.color}">${v.name[0]}</i><span>${v.name}<small>${v.cat}</small></span></a>`).join('')}` : '') +
      (cs.length ? `<h6>Categories</h6>${cs.map(c => `<a href="${ROOT}shop/?cat=${encodeURIComponent(c.name)}"><img src="${IMG(c.img, 80, 80)}" alt=""><span>${c.name}</span></a>`).join('')}` : '');
    box.classList.add('open');
  });
  document.addEventListener('click', e => { if (!e.target.closest('.sh-search')) box.classList.remove('open'); });
}

/* ---------- Toast ---------- */
function toast(msg, icon = I.check) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.innerHTML = `<i>${icon}</i><span>${msg}</span>`;
  t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Cart (premium side cart with upsells) ---------- */
const FREE_SHIP = 300;
const Cart = {
  items: store.get('cart', []),
  save() { store.set('cart', this.items); this.render(); },
  add(id, qty = 1, silent) {
    const l = this.items.find(i => i.id === id);
    l ? l.qty += qty : this.items.push({ id, qty });
    this.save();
    if (!silent) this.open();
  },
  setQty(id, q) { const l = this.items.find(i => i.id === id); if (!l) return; l.qty = q; if (q <= 0) this.items = this.items.filter(i => i.id !== id); this.save(); },
  count() { return this.items.reduce((a, i) => a + i.qty, 0); },
  subtotal() { return this.items.reduce((a, i) => a + productById(i.id).price * i.qty, 0); },
  open() { document.getElementById('cartDrawer').classList.add('open'); document.body.classList.add('no-scroll'); },
  close() { document.getElementById('cartDrawer').classList.remove('open'); document.body.classList.remove('no-scroll'); },
  upsells() {
    const inCart = new Set(this.items.map(i => i.id));
    const cartVendors = new Set(this.items.map(i => productById(i.id).vendor));
    const pool = PRODUCTS.filter(p => !inCart.has(p.id));
    const sameVendorAddOns = pool.filter(p => cartVendors.has(p.vendor) && p.price < 250);
    const addOns = pool.filter(p => p.badge === 'Add-on');
    const list = [...new Map([...sameVendorAddOns, ...addOns, ...pool.filter(p => p.badge === 'Bestseller')].map(p => [p.id, p])).values()];
    return list.slice(0, 6);
  },
  render() {
    document.querySelectorAll('.cart-count').forEach(b => { const c = this.count(); b.textContent = c; b.hidden = !c; });
    const d = document.getElementById('cartDrawer'); if (!d) return;
    const sub = this.subtotal(), left = Math.max(0, FREE_SHIP - sub), pct = Math.min(100, sub / FREE_SHIP * 100);
    const groups = {};
    this.items.forEach(i => { const p = productById(i.id); (groups[p.vendor] = groups[p.vendor] || []).push({ ...i, p }); });
    const nV = Object.keys(groups).length;
    d.querySelector('.cd-count').textContent = this.count() ? `${this.count()} item${this.count() > 1 ? 's' : ''}${nV ? ` · ${nV} vendor${nV > 1 ? 's' : ''}` : ''}` : '';
    d.querySelector('.cd-ship').innerHTML = this.items.length ? `
      <p>${left ? `You are <b>${money(left)}</b> away from <b>free delivery</b>` : `<b>${I.check} You unlocked free delivery</b> on every vendor shipment`}</p>
      <div class="bar"><i style="width:${pct}%"></i></div>` : '';
    const body = d.querySelector('.cd-items');
    if (!this.items.length) {
      body.innerHTML = `<div class="cd-empty"><div class="cd-empty-ico">${I.bag}</div><h4>Your cart is empty</h4><p>Items from any vendor land here and check out together.</p><a class="btn btn-dark" href="${ROOT}shop/">Start shopping</a></div>`;
    } else {
      body.innerHTML = Object.entries(groups).map(([vid, ls]) => {
        const v = vendorById(vid);
        return `<div class="cd-group"><div class="cd-vendor"><i style="background:${v.color}">${v.name[0]}</i><span>Shipped by <a href="${ROOT}vendor/?v=${v.id}">${v.name}</a></span><small>${I.truck} 2–4 days</small></div>
        ${ls.map(l => `<div class="cd-line"><img src="${IMG(l.p.img, 160, 180)}" alt="">
          <div class="cd-line-info"><a href="${ROOT}product/?id=${l.p.id}">${l.p.name}</a><span class="price">${money(l.p.price)}${l.p.compare ? ` <s>${money(l.p.compare)}</s>` : ''}</span>
            <div class="qty"><button data-q="${l.id}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="${l.id}" data-d="1" aria-label="Increase">+</button></div></div>
          <button class="cd-rm" data-rm="${l.id}" aria-label="Remove">${I.trash}</button></div>`).join('')}</div>`;
      }).join('');
    }
    const ups = this.upsells();
    d.querySelector('.cd-upsell').innerHTML = this.items.length && ups.length ? `
      <div class="cd-up-head"><h5>Complete your order</h5><span>Picked from your vendors & bestsellers</span></div>
      <div class="cd-up-row">${ups.map(p => `<div class="cd-up"><img src="${IMG(p.img, 200, 200)}" alt=""><div><b>${p.name}</b><small>${vendorById(p.vendor).name}</small><span>${money(p.price)}</span></div><button data-upadd="${p.id}" aria-label="Add ${p.name}">${I.plus}</button></div>`).join('')}</div>` : '';
    d.querySelector('.cd-foot').innerHTML = this.items.length ? `
      <label class="cd-gift"><input type="checkbox" id="giftWrap"> <span>${I.gift} Gift wrap every parcel <b>+ SAR 15</b></span></label>
      <div class="cd-sum"><span>Subtotal</span><b>${money(sub)}</b></div>
      <p class="cd-note">${nV > 1 ? `${nV} vendor shipments, <b>one payment</b>. ` : ''}Taxes & delivery calculated at checkout.</p>
      <a class="btn btn-primary btn-block" href="${ROOT}checkout/">Secure checkout · ${money(sub)}</a>
      <div class="cd-pay"><span>mada</span><span>Apple Pay</span><span>VISA</span><span>tabby</span></div>` : '';
  }
};

function mountCart() {
  const d = document.createElement('aside');
  d.id = 'cartDrawer'; d.className = 'cart-drawer'; d.setAttribute('aria-label', 'Shopping cart');
  d.innerHTML = `<div class="cd-scrim" data-close-cart></div><div class="cd-panel">
    <div class="cd-head"><div><h3>Your cart</h3><span class="cd-count"></span></div><button class="icon-btn" data-close-cart aria-label="Close cart">${I.x}</button></div>
    <div class="cd-ship"></div><div class="cd-scroll"><div class="cd-items"></div><div class="cd-upsell"></div></div><div class="cd-foot"></div></div>`;
  document.body.appendChild(d);
  Cart.render();
}

/* ---------- Proposal guide (floating pill) ---------- */
function mountGuide() {
  if (IN_FRAME || !curScreen) return;
  const prev = SCREENS[screenIdx - 1], next = SCREENS[screenIdx + 1];
  const roles = ['Overview', 'Customer', 'Vendor', 'Admin'];
  const g = document.createElement('div');
  g.className = 'guide';
  g.innerHTML = `
    <div class="guide-pop" id="guidePop">
      <div class="gp-head"><span class="gp-role">${curScreen.role} screen ${screenIdx}/${SCREENS.length - 1}</span><h5>${curScreen.title}</h5><p>What this screen shows from your brief:</p></div>
      <ul>${curScreen.notes.map(n => `<li>${I.check}<span>${n}</span></li>`).join('')}</ul>
      <div class="gp-all"><h6>All screens</h6>${roles.map(r => `<div class="gp-role-group"><span>${r}</span>${SCREENS.filter(s => s.role === r).map(s => `<a href="${ROOT}${s.path}" class="${s.key === SCREEN ? 'on' : ''}">${s.title}</a>`).join('')}</div>`).join('')}
      <div class="gp-role-group"><span>Mobile</span><a href="${ROOT}mobile/?s=${SCREEN}">Phone preview of every screen</a></div></div>
    </div>
    <div class="guide-bar">
      ${prev ? `<a class="g-nav" href="${ROOT}${prev.path}" title="Previous: ${prev.title}">${I.left}</a>` : '<span class="g-nav off">' + I.left + '</span>'}
      <button class="g-info" id="guideBtn" aria-expanded="false"><span class="g-dot"></span><span class="g-txt"><small>Prototype · ${curScreen.role}</small><b>${curScreen.title}</b></span>${I.info}</button>
      <div class="g-view" role="group" aria-label="View"><a class="on" href="${ROOT}${curScreen.path}" title="Desktop view">${I.desk}<span>Desktop</span></a><a href="${ROOT}mobile/?s=${SCREEN}" title="Mobile view">${I.phone}<span>Mobile</span></a></div>
      ${next ? `<a class="g-nav" href="${ROOT}${next.path}" title="Next: ${next.title}">${I.right}</a>` : '<span class="g-nav off">' + I.right + '</span>'}
    </div>`;
  document.body.appendChild(g);
  const btn = g.querySelector('#guideBtn'), pop = g.querySelector('#guidePop');
  btn.onclick = e => { e.stopPropagation(); const o = pop.classList.toggle('open'); btn.setAttribute('aria-expanded', o); };
  document.addEventListener('click', e => { if (!e.target.closest('.guide')) { pop.classList.remove('open'); btn.setAttribute('aria-expanded', false); } });
  if (!store.get('guideSeen', false) && SCREEN !== 'hub' && innerWidth > 900) { setTimeout(() => { pop.classList.add('open'); setTimeout(() => pop.classList.remove('open'), 7000); }, 900); store.set('guideSeen', true); }
}

/* ---------- Global delegated events ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-add],[data-upadd],[data-open-cart],[data-close-cart],[data-q],[data-rm],[data-wish]');
  if (!t) return;
  if (t.dataset.add) { e.preventDefault(); Cart.add(t.dataset.add); }
  else if (t.dataset.upadd) { Cart.add(t.dataset.upadd, 1, true); toast('Added to your order'); }
  else if (t.hasAttribute('data-open-cart')) Cart.open();
  else if (t.hasAttribute('data-close-cart')) Cart.close();
  else if (t.dataset.q) { const l = Cart.items.find(i => i.id === t.dataset.q); Cart.setQty(t.dataset.q, l.qty + +t.dataset.d); }
  else if (t.dataset.rm) Cart.setQty(t.dataset.rm, 0);
  else if (t.dataset.wish) {
    e.preventDefault();
    let w = store.get('wish', []); const id = t.dataset.wish;
    w = w.includes(id) ? w.filter(x => x !== id) : [...w, id]; store.set('wish', w);
    t.classList.toggle('on'); toast(w.includes(id) ? 'Saved to your wishlist' : 'Removed from wishlist', I.heart);
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('cartDrawer')) Cart.close(); });

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ---------- Boot ---------- */
renderSiteChrome();
if (document.body.dataset.cart !== 'off') mountCart();
mountGuide();
document.addEventListener('DOMContentLoaded', initReveal);
if (document.readyState !== 'loading') initReveal();

/* ---------- SMS OTP component (simulated SMS gateway) ---------- */
function smsBanner(code) {
  let b = document.getElementById('smsBanner');
  if (!b) { b = document.createElement('div'); b.id = 'smsBanner'; b.className = 'sms-banner'; document.body.appendChild(b); }
  b.innerHTML = `<div class="sb-app"><span>💬</span>MESSAGES<small>now</small></div><b>Souqna</b><p>${code} is your Souqna verification code. It expires in 5 minutes. Don't share it with anyone.</p><em>Tap to autofill</em>`;
  b.classList.add('show'); clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('show'), 9000);
  return b;
}
function mountOTP(el, { phone = '+966 5•• ••• •47', onSuccess }) {
  let code = '', timer, left = 0, attempts = 0;
  el.innerHTML = `<div class="otp">
      <div class="otp-boxes-in">${Array.from({ length: 6 }, (_, i) => `<input inputmode="numeric" maxlength="1" aria-label="Digit ${i + 1}" autocomplete="${i ? 'off' : 'one-time-code'}">`).join('')}</div>
      <p class="otp-msg" aria-live="polite"></p>
      <div class="otp-foot"><span class="otp-timer"></span><button type="button" class="otp-resend" disabled>Resend code</button></div>
    </div>`;
  const ins = [...el.querySelectorAll('input')], msg = el.querySelector('.otp-msg'), tEl = el.querySelector('.otp-timer'), rs = el.querySelector('.otp-resend');
  function send() {
    code = String(Math.floor(100000 + Math.random() * 900000)); attempts = 0;
    ins.forEach(i => { i.value = ''; i.classList.remove('bad', 'good'); }); msg.textContent = ''; msg.className = 'otp-msg';
    const b = smsBanner(code); b.onclick = () => { ins.forEach((i, k) => i.value = code[k]); b.classList.remove('show'); check(); };
    left = 30; rs.disabled = true; clearInterval(timer);
    const tick = () => { tEl.textContent = left > 0 ? `Resend in 0:${String(left).padStart(2, '0')}` : 'Didn’t get it?'; if (left-- <= 0) { clearInterval(timer); rs.disabled = false; } };
    tick(); timer = setInterval(tick, 1000);
    setTimeout(() => ins[0].focus({ preventScroll: true }), 50);
  }
  function check() {
    const v = ins.map(i => i.value).join('');
    if (v.length < 6) return;
    if (v === code) {
      ins.forEach(i => i.classList.add('good')); msg.className = 'otp-msg ok'; msg.textContent = 'Verified'; clearInterval(timer);
      document.getElementById('smsBanner')?.classList.remove('show');
      setTimeout(() => onSuccess && onSuccess(), 650);
    } else {
      attempts++; ins.forEach(i => i.classList.add('bad')); msg.className = 'otp-msg err';
      msg.textContent = attempts >= 3 ? 'Too many attempts. Please request a new code.' : `That code isn't right. ${3 - attempts} attempt${3 - attempts > 1 ? 's' : ''} left.`;
      setTimeout(() => { ins.forEach(i => { i.classList.remove('bad'); i.value = ''; }); ins[0].focus(); }, 700);
      if (attempts >= 3) { rs.disabled = false; clearInterval(timer); tEl.textContent = ''; }
    }
  }
  ins.forEach((inp, k) => {
    inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, '').slice(-1); if (inp.value && k < 5) ins[k + 1].focus(); check(); });
    inp.addEventListener('keydown', e => { if (e.key === 'Backspace' && !inp.value && k) ins[k - 1].focus(); });
    inp.addEventListener('paste', e => { const t = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6); if (t.length) { e.preventDefault(); ins.forEach((i, j) => i.value = t[j] || ''); check(); } });
  });
  rs.onclick = () => { send(); toast('New code sent by SMS'); };
  send();
  return { resend: send };
}
