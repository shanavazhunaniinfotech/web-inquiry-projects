/* Maison Pelletier — CRO homepage concept */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const img = (id, w = 700, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=72`;
  const eur = n => '€' + (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0).replace('.', ',');
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } }
  };
  const sget = k => { try { return sessionStorage.getItem(k); } catch { return null; } };
  const sset = (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* ignore */ } };

  /* ---------- Catalogue (placeholder data) ---------- */
  const P = {
    p1: { name: 'Grès Stoneware Cups', meta: 'Set of 4 · Limoges', price: 48, rating: 4.9, reviews: 412, img: '1610701596007-11502861dcfa', alt: '1610701596061-2ecf227e85b2', badge: 'Bestseller', swatches: [['Sand', '#D9C6A8'], ['Chalk', '#F1ECE3'], ['Charcoal', '#4A4642']], desc: 'Wheel-thrown stoneware with a raw clay foot and a soft satin glaze. Each cup holds 220 ml and feels made for slow mornings.' },
    p2: { name: 'Ambre & Figue Candle', meta: '220 g · 50 h burn', price: 36, rating: 4.8, reviews: 639, img: '1572726729207-a78d6feb18d7', alt: '1603006905003-be475563bc59', badge: 'Bestseller', desc: 'Hand-poured in Provence from rapeseed and soy wax with notes of amber, fig leaf and cedar. Cotton wick, reusable amber glass.' },
    p3: { name: 'Washed Linen Bedding Set', meta: 'Duvet + 2 pillowcases', price: 189, was: 219, rating: 4.9, reviews: 287, img: '1595526114035-0d45ed16cfbf', alt: '1505693416388-ac5ce068fe85', swatches: [['Flax', '#CDBFA8'], ['White', '#F4F1EA'], ['Sage', '#A3AE93']], desc: 'European flax woven in the Vosges and stone-washed for a lived-in softness from the first night. Gets better with every wash.' },
    p4: { name: 'Céleste Stoneware Vase', meta: 'H 28 cm · Matte glaze', price: 64, rating: 4.7, reviews: 198, img: '1612196808214-b8e1d6145a8c', alt: '1565193566173-7a0ee3dbe261', badge: 'New', desc: 'A generous, rounded vase thrown by hand in Limoges. Watertight inside, chalky matte outside — beautiful with or without flowers.' },
    p5: { name: 'Bleu Atlantique Plates', meta: 'Set of 4 · Ø 26 cm', price: 72, rating: 4.8, reviews: 156, img: '1578749556568-bc2c40e68b61', alt: '1610701596061-2ecf227e85b2', desc: 'Reactive glaze dinner plates inspired by the Breton coast. Dishwasher and microwave safe.' },
    p6: { name: 'Ocre Lounge Chair', meta: 'Oak frame · Bouclé', price: 690, rating: 4.9, reviews: 74, img: '1616627547584-bf28cee262db', alt: '1586023492125-27b2c045efd7', stock: 3, desc: 'A deep, tufted lounge chair upholstered in ochre bouclé on a solid French oak frame. Made to order in Burgundy.' },
    p7: { name: 'Matin Porcelain Mug', meta: '330 ml · Limoges porcelain', price: 22, rating: 4.8, reviews: 521, img: '1514228742587-6b1558fcca3d', alt: '1610701596007-11502861dcfa', desc: 'A thin-walled porcelain mug with a generous handle. Dishwasher safe, endlessly reached-for.' },
    p8: { name: 'Duo Bud Vases', meta: 'Set of 2 · Oak base', price: 39, rating: 4.7, reviews: 142, img: '1490312278390-ab64016e0aa9', alt: '1612196808214-b8e1d6145a8c', badge: 'New', desc: 'Two slender porcelain bud vases on a hand-turned oak tray. The easiest way to bring a branch indoors.' },
    p9: { name: 'Trio Pillar Candles', meta: 'Set of 3 · Unscented', price: 29, rating: 4.8, reviews: 233, img: '1602523961358-f9f03dd557db', alt: '1602874801007-bd458bb1b8b6', desc: 'Dripless pillar candles in natural ivory wax. 40 hours each.' },
    p10: { name: 'Bois Room Oil', meta: '50 ml · Cedar & smoke', price: 26, rating: 4.7, reviews: 118, img: '1608571423902-eed4a5ad8108', alt: '1612817288484-6f916006741a', badge: 'New', desc: 'A few drops on a ceramic diffuser or linen. Cedar, birch smoke and vetiver.' },
    p11: { name: 'Petit Cactus Planter', meta: 'Ø 18 cm · Glazed', price: 34, rating: 4.6, reviews: 87, img: '1603204077779-bed963ea7d0e', alt: '1530018607912-eff2daa1bac4', badge: 'New', desc: 'A shallow glazed planter with drainage hole and saucer. Plant not included.' },
    p12: { name: 'Feather Pillow Insert', meta: '50 × 50 cm', price: 45, rating: 4.8, reviews: 301, img: '1584100936595-c0654b55a2e2', alt: '1595526114035-0d45ed16cfbf', desc: 'Responsibly sourced duck feather insert with a cotton cover. Fills our linen cushion covers perfectly.' },
    p13: { name: 'Lune Wool Rug', meta: '170 × 240 cm', price: 249, rating: 4.8, reviews: 64, img: '1600166898405-da9535204843', alt: '1618220179428-22790b461013', desc: 'Hand-loomed wool and jute rug with a subtle border. Soft underfoot, hard-wearing.' },
    p14: { name: 'Oak Serving Board', meta: '45 × 20 cm', price: 42, rating: 4.9, reviews: 176, img: '1610701596061-2ecf227e85b2', alt: '1610701596007-11502861dcfa', desc: 'Solid French oak, oiled by hand. For bread, cheese and long lunches.' },
    gift: { name: 'Mini Ambre Candle', meta: 'Free gift', price: 0, img: '1603006905003-be475563bc59' }
  };
  const TABS = {
    best: ['p1', 'p2', 'p3', 'p6', 'p5', 'p7', 'p4', 'p8'],
    new: ['p4', 'p8', 'p10', 'p11', 'p1', 'p13', 'p3', 'p2'],
    gifts: ['p2', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p14']
  };
  const PAIRS = { p1: ['p14', 'p7', 'p5'], p2: ['p9', 'p10', 'p8'], p3: ['p12', 'p2', 'p13'], p4: ['p8', 'p2', 'p11'], p5: ['p1', 'p14', 'p7'], p6: ['p13', 'p12', 'p4'], p7: ['p1', 'p14', 'p2'], p8: ['p4', 'p11', 'p2'], p9: ['p2', 'p10'], p10: ['p2', 'p9'], p11: ['p8', 'p4'], p12: ['p3', 'p2'], p13: ['p6', 'p12'], p14: ['p1', 'p5'] };
  const SHIP_AT = 80, GIFT_AT = 150, WRAP = 0;

  const stars = n => `<span class="stars" aria-label="${n} out of 5 stars">${'<svg><use href="#i-star"/></svg>'.repeat(5)}</span>`;
  const klarna = p => p >= 30 ? `<span class="klarna">or 3 × ${eur(p / 3)} with Klarna</span>` : '';

  /* ---------- Toast ---------- */
  const toastEl = $('#toast'); let toastT;
  function toast(msg) {
    toastEl.innerHTML = `<svg><use href="#i-check"/></svg>${msg}`;
    toastEl.classList.add('is-on'); clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
  }

  /* ---------- Announcement rotator ---------- */
  const ann = $$('#announceTrack p'); let ai = 0;
  if (ann.length > 1) setInterval(() => {
    const cur = ann[ai]; cur.classList.remove('is-on'); cur.classList.add('is-out');
    setTimeout(() => cur.classList.remove('is-out'), 600);
    ai = (ai + 1) % ann.length; ann[ai].classList.add('is-on');
  }, 4200);

  /* ---------- Header behaviour ---------- */
  const header = $('#header'); let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    const megaOpen = $('.has-mega').classList.contains('is-open');
    header.classList.toggle('is-hidden', y > 500 && y > lastY && !megaOpen);
    lastY = y;
    const mbarOn = y > innerHeight * .8;
    $('#mbar').classList.toggle('is-on', mbarOn);
    document.body.classList.toggle('mbar-on', mbarOn);
  }, { passive: true });

  // mega menu (hover on desktop, click for keyboard/touch)
  const mega = $('.has-mega'), megaBtn = $('.has-mega > button'); let megaT;
  const setMega = on => { mega.classList.toggle('is-open', on); megaBtn.setAttribute('aria-expanded', on); };
  mega.addEventListener('mouseenter', () => { clearTimeout(megaT); setMega(true); });
  mega.addEventListener('mouseleave', () => { megaT = setTimeout(() => setMega(false), 150); });
  megaBtn.addEventListener('click', () => setMega(!mega.classList.contains('is-open')));
  $$('.mega a').forEach(a => a.addEventListener('click', () => setMega(false)));

  // mobile nav
  const mnav = $('#mnav');
  const setMnav = on => { mnav.classList.toggle('is-open', on); mnav.setAttribute('aria-hidden', !on); $('#menuBtn').setAttribute('aria-expanded', on); };
  $('#menuBtn').addEventListener('click', () => setMnav(true));
  mnav.addEventListener('click', e => { if (e.target === mnav || e.target.closest('[data-close-mnav]')) setMnav(false); });

  /* ---------- Product cards ---------- */
  const wish = new Set(store.get('mp_wish', []));
  function cardHTML(id) {
    const p = P[id];
    const badges = [];
    if (p.was) badges.push(`<span class="badge badge--sale">−${Math.round((1 - p.price / p.was) * 100)}%</span>`);
    if (p.badge) badges.push(`<span class="badge ${p.badge === 'New' ? 'badge--new' : ''}">${p.badge}</span>`);
    const sw = p.swatches ? `<div class="swatches">${p.swatches.map((s, i) => `<button class="${i ? '' : 'is-on'}" style="background:${s[1]}" aria-label="${s[0]}" data-sw></button>`).join('')}</div>` : '';
    return `<article class="card" data-reveal>
      <div class="card__media">
        <div class="badges">${badges.join('')}</div>
        <button class="wish ${wish.has(id) ? 'is-on' : ''}" data-wish="${id}" aria-label="Save ${p.name} to wishlist" aria-pressed="${wish.has(id)}"><svg><use href="#i-heart"/></svg></button>
        <img src="${img(p.img, 600, 750)}" alt="${p.name}" loading="lazy">
        <img class="alt" src="${img(p.alt, 600, 750)}" alt="" loading="lazy" aria-hidden="true">
        <div class="card__actions">
          <button class="btn btn--dark" data-add="${id}">Add to bag · ${eur(p.price)}</button>
          <button class="qv-btn" data-qv="${id}" aria-label="Quick view ${p.name}"><svg><use href="#i-eye"/></svg></button>
        </div>
      </div>
      <div class="card__body">
        <div class="card__rating">${stars(p.rating)} ${p.rating} (${p.reviews})</div>
        <h3 class="card__name"><button data-qv="${id}">${p.name}</button></h3>
        <p class="card__meta">${p.meta}</p>
        <div class="price">${eur(p.price)}${p.was ? `<s>${eur(p.was)}</s>` : ''}</div>
        ${p.stock ? `<span class="stock">Only ${p.stock} left — made to order after</span>` : klarna(p.price)}
        ${sw}
        <button class="btn btn--dark card__mobile-add" data-add="${id}">Add to bag</button>
      </div>
    </article>`;
  }
  const grid = $('#productGrid');
  function renderGrid(tab) {
    grid.innerHTML = TABS[tab].map(cardHTML).join('');
    if (window.gsap && !reduced) gsap.from(grid.children, { y: 30, opacity: 0, duration: .7, stagger: .06, ease: 'power3.out', clearProps: 'all' });
  }
  function setTab(tab) {
    $$('.tabs [role="tab"]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === tab));
    renderGrid(tab);
  }
  $$('.tabs [role="tab"]').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));
  $$('a[data-tab]').forEach(a => a.addEventListener('click', () => setTab(a.dataset.tab)));

  /* ---------- Wishlist ---------- */
  function renderWish() {
    const c = $('#wishCount'); c.textContent = wish.size; c.hidden = !wish.size;
  }
  document.addEventListener('click', e => {
    const w = e.target.closest('[data-wish]'); if (!w) return;
    const id = w.dataset.wish;
    wish.has(id) ? wish.delete(id) : wish.add(id);
    $$(`[data-wish="${id}"]`).forEach(b => { b.classList.toggle('is-on', wish.has(id)); b.setAttribute('aria-pressed', wish.has(id)); });
    store.set('mp_wish', [...wish]); renderWish();
    const c = $('#wishCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    toast(wish.has(id) ? `Saved ${P[id].name} to your wishlist` : 'Removed from wishlist');
  });
  // swatches
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-sw]'); if (!s) return;
    $$('[data-sw]', s.parentElement).forEach(b => b.classList.toggle('is-on', b === s));
    const lab = s.closest('.qv__info') && $('#qvColor'); if (lab) lab.textContent = s.getAttribute('aria-label');
  });

  /* ---------- Cart ---------- */
  let cart = store.get('mp_cart', []); // {key,id,qty,variant,price,was,note}
  let opts = store.get('mp_opts', { wrap: false, note: '' });
  const cartEl = $('#cart'), overlay = $('#overlay');
  let lastFocus;
  function openCart() {
    lastFocus = document.activeElement;
    renderCart(); cartEl.classList.add('is-open'); cartEl.setAttribute('aria-hidden', 'false'); overlay.classList.add('is-on');
    document.documentElement.style.overflow = 'hidden';
    setTimeout(() => $('[data-close-cart]').focus(), 50);
  }
  function closeCart() {
    cartEl.classList.remove('is-open'); cartEl.setAttribute('aria-hidden', 'true'); overlay.classList.remove('is-on');
    document.documentElement.style.overflow = '';
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  const save = () => { store.set('mp_cart', cart); store.set('mp_opts', opts); };
  function add(id, qty = 1, extra = {}) {
    const p = P[id]; const variant = extra.variant || (p.swatches ? p.swatches[0][0] : '');
    const key = id + '|' + variant + '|' + (extra.tag || '');
    const ex = cart.find(l => l.key === key);
    if (ex) ex.qty += qty;
    else cart.push({ key, id, qty, variant, price: extra.price ?? p.price, was: extra.was ?? p.was, tag: extra.tag || '' });
    save(); updateCounts();
  }
  const subtotal = () => cart.reduce((s, l) => s + l.price * l.qty, 0);
  const savings = () => cart.reduce((s, l) => s + (l.was ? (l.was - l.price) * l.qty : 0), 0);
  const itemCount = () => cart.reduce((s, l) => s + l.qty, 0);
  function updateCounts() {
    const n = itemCount(); const c = $('#cartCount');
    c.textContent = n; c.hidden = !n; c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    $('#mbarTotal').textContent = n ? eur(subtotal()) : 'Bag';
  }
  function eta() {
    const now = new Date(); const cutoff = new Date(now); cutoff.setHours(14, 0, 0, 0);
    let ship = new Date(now); const isWk = d => d.getDay() === 0 || d.getDay() === 6;
    if (now > cutoff || isWk(now)) { do { ship.setDate(ship.getDate() + 1); } while (isWk(ship)); }
    let arr = new Date(ship), added = 0; while (added < 2) { arr.setDate(arr.getDate() + 1); if (!isWk(arr)) added++; }
    const fmt = d => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    if (now < cutoff && !isWk(now)) { const ms = cutoff - now, h = Math.floor(ms / 36e5), m = Math.floor(ms % 36e5 / 6e4); return `Order within <strong>${h}h ${m}m</strong> for dispatch today · arrives <strong>${fmt(arr)}</strong>`; }
    return `Order now for delivery by <strong>${fmt(arr)}</strong> · free returns for 30 days`;
  }
  function renderLadder(sub) {
    const pct = Math.min(sub / GIFT_AT * 100, 100);
    $('#ladderFill').style.width = pct + '%';
    $$('.ladder__step').forEach(s => s.classList.toggle('is-done', sub >= +s.dataset.step));
    const msg = $('#ladderMsg');
    if (sub < SHIP_AT) msg.innerHTML = `You're <strong>${eur(SHIP_AT - sub)}</strong> away from <strong>free shipping</strong>`;
    else if (sub < GIFT_AT) msg.innerHTML = `Free shipping unlocked ✓ — add <strong>${eur(GIFT_AT - sub)}</strong> for a <strong>free mini candle</strong>`;
    else msg.innerHTML = `<strong>You've unlocked everything</strong> — free shipping + a free mini candle`;
  }
  function upsells() {
    const inCart = new Set(cart.map(l => l.id));
    const pool = [];
    cart.forEach(l => (PAIRS[l.id] || []).forEach(x => { if (!inCart.has(x) && !pool.includes(x)) pool.push(x); }));
    ['p9', 'p10', 'p7', 'p2', 'p12', 'p14'].forEach(x => { if (!inCart.has(x) && !pool.includes(x)) pool.push(x); });
    return pool.slice(0, 5);
  }
  function renderCart() {
    const sub = subtotal(), n = itemCount();
    $('#cartHeadCount').textContent = `(${n})`;
    renderLadder(sub);
    const body = $('#cartBody'), foot = $('#cartFoot');
    $('#ladder').hidden = !n;
    if (!n) {
      body.innerHTML = `<div class="empty"><div class="empty__icon"><svg><use href="#i-bag"/></svg></div><h3>Your bag is empty</h3><p>Start with a bestseller — loved by 40,000+ homes.</p>
        <div class="empty__chips"><a href="#bestsellers" data-close-cart>Bestsellers</a><a href="#gift-edit" data-close-cart>Gift Edit</a><a href="#bundle" data-close-cart>Build a gift box</a></div></div>
        <div class="ups"><div class="ups__head"><p>Most-loved right now</p></div><div class="ups__track">${['p2', 'p1', 'p7', 'p8'].map(upHTML).join('')}</div></div>`;
      foot.innerHTML = `<div class="cart__trust"><span><svg><use href="#i-truck"/></svg>Free shipping €80+</span><span><svg><use href="#i-return"/></svg>30-day returns</span></div>`;
      return;
    }
    const lines = cart.map(l => {
      const p = P[l.id];
      return `<div class="line" data-key="${l.key}">
        <img src="${img(p.img, 200, 240)}" alt="${p.name}">
        <div><p class="line__name">${p.name}</p><p class="line__var">${l.variant ? l.variant + ' · ' : ''}${p.meta}${l.tag ? ` · <b>${l.tag}</b>` : ''}</p>
          <div class="qty"><button data-q="-1" aria-label="Decrease quantity"><svg><use href="#i-minus"/></svg></button><span>${l.qty}</span><button data-q="1" aria-label="Increase quantity"><svg><use href="#i-plus"/></svg></button></div></div>
        <div class="line__right"><div class="line__price">${eur(l.price * l.qty)}${l.was ? `<s>${eur(l.was * l.qty)}</s>` : ''}</div><button class="line__rm" data-rm>Remove</button></div>
      </div>`;
    }).join('');
    const giftLine = sub >= GIFT_AT ? `<div class="line line--free"><img src="${img(P.gift.img, 200, 240)}" alt="Mini candle"><div><p class="line__name">${P.gift.name}</p><p class="line__var">80 g · Ambre & Figue · <b>Reward</b></p></div><div class="line__right"><div class="line__price">Free</div></div></div>` : '';
    const ups = upsells();
    body.innerHTML = lines + giftLine +
      (ups.length ? `<div class="ups"><div class="ups__head"><p>Complete your order</p><span>Swipe →</span></div><div class="ups__track">${ups.map(upHTML).join('')}</div></div>` : '') +
      `<div class="extras">
        <label class="toggle"><input type="checkbox" id="wrapT" ${opts.wrap ? 'checked' : ''}><span><strong>Gift wrap &amp; handwritten card</strong><small>Recycled paper · prices hidden on slip</small></span><em>Free</em></label>
        ${opts.wrap ? `<textarea class="gift-note" id="giftNote" placeholder="Your message (we'll write it by hand)" maxlength="200">${opts.note.replace(/</g, '&lt;')}</textarea>` : ''}
      </div>
      <div class="eta"><svg><use href="#i-truck"/></svg><span>${eta()}</span></div>`;
    const sv = savings();
    foot.innerHTML = `<div class="sum">
        <div class="row2"><span>Subtotal ${eur(sub + sv)} · Shipping ${sub >= SHIP_AT ? '<b style="color:var(--sage)">Free</b>' : eur(5.9)}</span>${sv ? `<span class="save">You save ${eur(sv)}</span>` : ''}</div>
        <div class="tot"><span>Total</span><span>${eur(sub + (sub >= SHIP_AT ? 0 : 5.9))}</span></div>
        <div class="kl">or 3 interest-free payments of ${eur((sub + (sub >= SHIP_AT ? 0 : 5.9)) / 3)} with Klarna</div>
      </div>
      <button class="btn btn--dark btn--block" id="checkout"><svg><use href="#i-lock"/></svg>Secure checkout</button>
      <div class="express"><button class="ap" data-express aria-label="Apple Pay">Apple Pay</button><button class="pp" data-express aria-label="PayPal">PayPal</button><button class="gp" data-express aria-label="Google Pay">G Pay</button></div>
      <div class="cart__trust"><span><svg><use href="#i-lock"/></svg>SSL secure</span><span><svg><use href="#i-return"/></svg>30-day free returns</span></div>`;
  }
  function upHTML(id) {
    const p = P[id];
    return `<div class="up"><img src="${img(p.img, 160, 160)}" alt="${p.name}"><div><strong>${p.name}</strong><small>${stars(p.rating)}</small><span>${eur(p.price)}</span></div><button data-up="${id}" aria-label="Add ${p.name}">+ Add</button></div>`;
  }
  // cart events
  cartEl.addEventListener('click', e => {
    const line = e.target.closest('.line[data-key]');
    const q = e.target.closest('[data-q]');
    if (q && line) {
      const l = cart.find(x => x.key === line.dataset.key); l.qty += +q.dataset.q;
      if (l.qty < 1) cart = cart.filter(x => x !== l);
      save(); updateCounts(); renderCart(); return;
    }
    if (e.target.closest('[data-rm]') && line) { cart = cart.filter(x => x.key !== line.dataset.key); save(); updateCounts(); renderCart(); return; }
    const up = e.target.closest('[data-up]');
    if (up) { add(up.dataset.up); renderCart(); toast(`${P[up.dataset.up].name} added`); return; }
    if (e.target.closest('#checkout') || e.target.closest('[data-express]')) { toast('Demo: checkout connects to Shopify / Stripe in the build phase'); return; }
    if (e.target.closest('[data-close-cart]')) closeCart();
  });
  cartEl.addEventListener('change', e => { if (e.target.id === 'wrapT') { opts.wrap = e.target.checked; save(); renderCart(); } });
  cartEl.addEventListener('input', e => { if (e.target.id === 'giftNote') { opts.note = e.target.value; save(); } });
  overlay.addEventListener('click', closeCart);
  $('#cartBtn').addEventListener('click', openCart);
  $$('[data-open-cart]').forEach(b => b.addEventListener('click', openCart));

  // global add-to-bag
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]'); if (!a || a.closest('#qv')) return;
    const card = a.closest('.card'); let variant;
    if (card) { const on = $('[data-sw].is-on', card); variant = on && on.getAttribute('aria-label'); }
    add(a.dataset.add, 1, { variant }); openCart();
  });

  /* ---------- Quick view ---------- */
  const qv = $('#qv');
  function openQV(id) {
    const p = P[id]; lastFocus = document.activeElement;
    const sw = p.swatches ? `<div><p class="qv__label">Colour: <span id="qvColor">${p.swatches[0][0]}</span></p><div class="swatches">${p.swatches.map((s, i) => `<button class="${i ? '' : 'is-on'}" style="background:${s[1]}" aria-label="${s[0]}" data-sw></button>`).join('')}</div></div>` : '';
    $('#qvBody').innerHTML = `<div class="qv__media"><div class="qv__main"><img id="qvMain" src="${img(p.img, 900, 1125)}" alt="${p.name}"></div>
      <div class="qv__thumbs"><button class="is-on" data-th="${p.img}" aria-label="Image 1"><img src="${img(p.img, 140, 140)}" alt=""></button><button data-th="${p.alt}" aria-label="Image 2"><img src="${img(p.alt, 140, 140)}" alt=""></button></div></div>
      <div class="qv__info">
        <div class="card__rating">${stars(p.rating)} ${p.rating} · ${p.reviews} reviews</div>
        <h3 id="qvTitle">${p.name}</h3>
        <div class="price">${eur(p.price)}${p.was ? `<s>${eur(p.was)}</s>` : ''}</div>
        ${klarna(p.price)}
        <p>${p.desc}</p>
        ${sw}
        ${p.stock ? `<span class="stock">Only ${p.stock} left in stock</span>` : ''}
        <div class="qv__buy"><div class="qty"><button data-qq="-1" aria-label="Decrease"><svg><use href="#i-minus"/></svg></button><span id="qvQty">1</span><button data-qq="1" aria-label="Increase"><svg><use href="#i-plus"/></svg></button></div>
          <button class="btn btn--dark" id="qvAdd" data-id="${id}">Add to bag</button>
          <button class="icon-btn icon-btn--line wish-inline ${wish.has(id) ? 'is-on' : ''}" data-wish="${id}" aria-label="Save to wishlist"><svg><use href="#i-heart"/></svg></button></div>
        <ul class="qv__perks"><li><svg><use href="#i-truck"/></svg>Free EU shipping over €80 · dispatched in 24 h</li><li><svg><use href="#i-return"/></svg>30-day free returns</li><li><svg><use href="#i-hand"/></svg>Handmade in France — slight variations are natural</li></ul>
      </div>`;
    qv.classList.add('is-open'); qv.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    setTimeout(() => $('[data-close-qv]').focus(), 50);
  }
  function closeQV() { qv.classList.remove('is-open'); qv.setAttribute('aria-hidden', 'true'); document.documentElement.style.overflow = ''; lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); }
  document.addEventListener('click', e => { const b = e.target.closest('[data-qv]'); if (b) openQV(b.dataset.qv); });
  qv.addEventListener('click', e => {
    if (e.target === qv || e.target.closest('[data-close-qv]')) return closeQV();
    const th = e.target.closest('[data-th]');
    if (th) { $('#qvMain').src = img(th.dataset.th, 900, 1125); $$('[data-th]', qv).forEach(b => b.classList.toggle('is-on', b === th)); }
    const qq = e.target.closest('[data-qq]');
    if (qq) { const s = $('#qvQty'); s.textContent = Math.max(1, +s.textContent + +qq.dataset.qq); }
    const addB = e.target.closest('#qvAdd');
    if (addB) { const on = $('[data-sw].is-on', qv); add(addB.dataset.id, +$('#qvQty').textContent, { variant: on && on.getAttribute('aria-label') }); closeQV(); openCart(); }
  });

  /* ---------- Search ---------- */
  const search = $('#search'), sInput = $('#searchInput');
  function renderSearch(q) {
    q = q.trim().toLowerCase();
    const ids = Object.keys(P).filter(k => k !== 'gift' && (!q || (P[k].name + ' ' + P[k].meta + ' ' + P[k].desc).toLowerCase().includes(q)));
    $('#searchResults').innerHTML = ids.length ? ids.slice(0, 8).map(id => `<button class="sres" data-qv="${id}"><img src="${img(P[id].img, 120, 120)}" alt=""><span><strong>${P[id].name}</strong><span>${eur(P[id].price)} · ${P[id].meta}</span></span></button>`).join('')
      : `<p class="search__empty">No results for “${q.replace(/</g, '&lt;')}”. Try “candle” or “linen”.</p>`;
  }
  const openSearch = () => { search.classList.add('is-open'); search.setAttribute('aria-hidden', 'false'); renderSearch(''); setTimeout(() => sInput.focus(), 60); };
  const closeSearch = () => { search.classList.remove('is-open'); search.setAttribute('aria-hidden', 'true'); };
  $('#searchBtn').addEventListener('click', openSearch);
  sInput.addEventListener('input', () => renderSearch(sInput.value));
  search.addEventListener('click', e => {
    if (e.target === search || e.target.closest('[data-close-search]') || e.target.closest('[data-qv]')) closeSearch();
    const chip = e.target.closest('.search__chips button'); if (chip) { sInput.value = chip.textContent; renderSearch(chip.textContent); }
  });

  /* ---------- Countdown ---------- */
  const deadline = new Date('2026-12-18T23:59:59+01:00').getTime();
  function tick() {
    let ms = deadline - Date.now();
    if (ms <= 0) { $('#countdown').innerHTML = '<p class="countdown__label">Gift-ready all year</p><p class="countdown__note">Every order can be gift-wrapped with a handwritten card — free.</p>'; return; }
    const v = { d: Math.floor(ms / 864e5), h: Math.floor(ms % 864e5 / 36e5), m: Math.floor(ms % 36e5 / 6e4), s: Math.floor(ms % 6e4 / 1e3) };
    $$('[data-cd]').forEach(el => el.textContent = String(v[el.dataset.cd]).padStart(2, '0'));
    setTimeout(tick, 1000);
  }
  tick();

  /* ---------- Shop the look ---------- */
  const LOOK = [
    { id: 'p6', x: 72, y: 74 },
    { id: 'p4', x: 33, y: 62 },
    { id: 'p13', x: 46, y: 95 },
    { id: 'p11', x: 10, y: 50, below: true }
  ];
  const lookMedia = $('#lookMedia');
  LOOK.forEach((h, i) => {
    const p = P[h.id]; const d = document.createElement('div');
    d.className = 'hot' + (h.below ? ' hot--below' : ''); d.style.left = h.x + '%'; d.style.top = h.y + '%'; d.dataset.i = i;
    d.innerHTML = `<button class="hot__dot" aria-label="${p.name}, ${eur(p.price)}" aria-expanded="false"></button>
      <div class="hot__pop"><img src="${img(p.img, 120, 120)}" alt=""><div><strong>${p.name}</strong><span>${eur(p.price)}</span></div><button class="round-add" data-add="${h.id}" aria-label="Add ${p.name}"><svg><use href="#i-plus"/></svg></button></div>`;
    lookMedia.appendChild(d);
  });
  const lookTotal = LOOK.reduce((s, h) => s + P[h.id].price, 0);
  $('#lookList').innerHTML = LOOK.map((h, i) => `<li data-i="${i}"><img src="${img(P[h.id].img, 120, 120)}" alt=""><div class="info"><strong>${P[h.id].name}</strong><span>${eur(P[h.id].price)}</span></div><button class="round-add" data-add="${h.id}" aria-label="Add ${P[h.id].name}"><svg><use href="#i-plus"/></svg></button></li>`).join('');
  $('#lookTotal').innerHTML = `<s style="opacity:.6;font-weight:400">${eur(lookTotal)}</s> ${eur(Math.round(lookTotal * .9))}`;
  const setHot = i => {
    $$('.hot', lookMedia).forEach(h => { const on = +h.dataset.i === i; h.classList.toggle('is-open', on); $('.hot__dot', h).setAttribute('aria-expanded', on); });
    $$('#lookList li').forEach(li => li.classList.toggle('is-hl', +li.dataset.i === i));
  };
  lookMedia.addEventListener('click', e => {
    const dot = e.target.closest('.hot__dot'); if (!dot) return;
    const h = dot.parentElement; setHot(h.classList.contains('is-open') ? -1 : +h.dataset.i);
  });
  $$('#lookList li').forEach(li => li.addEventListener('mouseenter', () => setHot(+li.dataset.i)));
  setHot(0);
  $('#addLook').addEventListener('click', () => {
    LOOK.forEach(h => add(h.id, 1, { price: Math.round(P[h.id].price * .9 * 100) / 100, was: P[h.id].price, tag: 'Look −10%' }));
    openCart(); toast('The full look was added — 10% off applied');
  });

  /* ---------- Reviews ---------- */
  const REV = [
    { n: 'Camille R.', c: 'Lyon', p: 'p1', img: '1610701596061-2ecf227e85b2', t: 'The glaze is even more beautiful in person. Packed so carefully — not a single chip after the trip from Limoges.' },
    { n: 'Thomas B.', c: 'Bordeaux', p: 'p3', img: '1505693416388-ac5ce068fe85', t: 'Softest linen I’ve owned. Washed it twice and it’s only getting better. Already ordered a second set for the guest room.' },
    { n: 'Sophie L.', c: 'Brussels', p: 'p2', img: '1603006905003-be475563bc59', t: 'Ambre & Figue makes the whole flat smell like a little boutique hotel. Clean burn, no soot. My third one.' },
    { n: 'Hannah K.', c: 'Berlin', p: 'p6', img: '1586023492125-27b2c045efd7', t: 'Delivered to Berlin in 4 days, assembled in 5 minutes. The bouclé is gorgeous and the oak is solid. Worth every euro.' },
    { n: 'Lucía M.', c: 'Madrid', p: 'p4', img: '1565193566173-7a0ee3dbe261', t: 'Ordered as a gift — the wrapping and handwritten card made it feel so personal. My sister loved it.' },
    { n: 'Julien P.', c: 'Paris', p: 'p7', img: '1514228742587-6b1558fcca3d', t: 'Thin porcelain, perfect handle. These are now the only mugs anyone in our house reaches for.' }
  ];
  $('#revTrack').innerHTML = REV.map(r => `<article class="rev"><img src="${img(r.img, 500, 375)}" alt="Customer photo of ${P[r.p].name}" loading="lazy">${stars(5)}<p>“${r.t}”</p><p class="rev__prod">Bought: <button data-qv="${r.p}">${P[r.p].name}</button></p><div class="rev__who"><div><strong>${r.n}</strong><span>${r.c}</span></div><span class="verified"><svg><use href="#i-check"/></svg>Verified buyer</span></div></article>`).join('');
  const rt = $('#revTrack');
  const step = () => (rt.firstElementChild?.offsetWidth || 300) + 20;
  $('#revNext').addEventListener('click', () => rt.scrollBy({ left: step(), behavior: 'smooth' }));
  $('#revPrev').addEventListener('click', () => rt.scrollBy({ left: -step(), behavior: 'smooth' }));

  /* ---------- Bundle builder ---------- */
  const B_OPTS = ['p2', 'p7', 'p8', 'p9', 'p10', 'p14'];
  let picked = [];
  $('#bundleOptions').innerHTML = B_OPTS.map(id => `<button class="bopt" data-b="${id}" aria-pressed="false"><img src="${img(P[id].img, 400, 400)}" alt="" loading="lazy"><strong>${P[id].name}</strong><span>${eur(P[id].price)}</span><i><svg><use href="#i-plus"/></svg></i></button>`).join('');
  function renderBundle() {
    $$('.bopt').forEach(b => { const on = picked.includes(b.dataset.b); b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); $('use', b).setAttribute('href', on ? '#i-check' : '#i-plus'); });
    $('#bundleSlots').innerHTML = [0, 1, 2].map(i => picked[i] ? `<div class="slot"><img src="${img(P[picked[i]].img, 200, 200)}" alt="${P[picked[i]].name}"><button data-unpick="${picked[i]}" aria-label="Remove ${P[picked[i]].name}"><svg><use href="#i-close"/></svg></button></div>` : `<div class="slot">${i + 1}</div>`).join('');
    const sub = picked.reduce((s, id) => s + P[id].price, 0), sv = picked.length === 3 ? sub * .15 : 0;
    $('#bSub').textContent = eur(sub); $('#bSave').textContent = '−' + eur(Math.round(sv * 100) / 100); $('#bTotal').textContent = eur(Math.round((sub - sv) * 100) / 100);
    const btn = $('#bundleAdd'); btn.disabled = picked.length < 3;
    btn.textContent = picked.length < 3 ? `Choose ${3 - picked.length} more item${3 - picked.length > 1 ? 's' : ''}` : 'Add gift box to bag';
  }
  $('#bundleOptions').addEventListener('click', e => {
    const b = e.target.closest('[data-b]'); if (!b) return; const id = b.dataset.b;
    if (picked.includes(id)) picked = picked.filter(x => x !== id);
    else if (picked.length < 3) picked.push(id);
    else { picked.shift(); picked.push(id); }
    renderBundle();
  });
  $('#bundleSlots').addEventListener('click', e => { const u = e.target.closest('[data-unpick]'); if (u) { picked = picked.filter(x => x !== u.dataset.unpick); renderBundle(); } });
  $('#bundleAdd').addEventListener('click', () => {
    picked.forEach(id => add(id, 1, { price: Math.round(P[id].price * .85 * 100) / 100, was: P[id].price, tag: 'Gift box −15%' }));
    opts.wrap = true; save(); picked = []; renderBundle(); openCart(); toast('Gift box added — 15% off & free wrapping');
  });
  renderBundle();

  /* ---------- UGC ---------- */
  const UGC = [['1493663284031-b7e3aefcae8e', '@chez.camille', 'p12'], ['1616486338812-3dadae4b4ace', '@lea.interieur', 'p13'], ['1618221195710-dd6b41faaea6', '@atelier.nord', 'p1'], ['1615529182904-14819c35db37', '@maison.solene', 'p8'], ['1617806118233-18e1de247200', '@petitappart', 'p5'], ['1519710164239-da123dc03ef4', '@hugo.home', 'p11']];
  $('#ugc').innerHTML = UGC.map(u => `<figure class="ugc__item" style="margin:0"><img src="${img(u[0], 600, 700)}" alt="Customer home styled with Maison Pelletier pieces" loading="lazy"><figcaption><span>${u[1]}</span><button data-qv="${u[2]}">Shop this</button></figcaption></figure>`).join('');

  /* ---------- Newsletter / welcome offer ---------- */
  const offer = $('#offer');
  const openOffer = () => { if (sget('mp_offer') || cartEl.classList.contains('is-open') || qv.classList.contains('is-open') || document.body.classList.contains('show-notes')) return; sset('mp_offer', '1'); offer.classList.add('is-open'); offer.setAttribute('aria-hidden', 'false'); };
  const closeOffer = () => { offer.classList.remove('is-open'); offer.setAttribute('aria-hidden', 'true'); };
  offer.addEventListener('click', e => { if (e.target === offer || e.target.closest('[data-close-offer]')) closeOffer(); });
  setTimeout(openOffer, 30000);
  document.addEventListener('mouseout', e => { if (!e.relatedTarget && e.clientY < 8 && scrollY > 600) openOffer(); });
  $$('[data-signup]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); sset('mp_offer', '1');
    f.innerHTML = `<div class="offer__done"><p style="margin:0">Welcome to the Maison. Your code:</p><strong>BIENVENUE10</strong><p class="micro" style="justify-content:center;${f.closest('.news') ? 'color:rgba(251,248,243,.8)' : ''}">Applied automatically at checkout.</p></div>`;
  }));

  /* ---------- Esc + focus handling ---------- */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (qv.classList.contains('is-open')) closeQV();
    else if (cartEl.classList.contains('is-open')) closeCart();
    closeSearch(); closeOffer(); setMnav(false); setMega(false); closeNotes();
  });

  /* ---------- Design rationale notes ---------- */
  const NOTES = [
    ['Announcement bar', 'The first thing every visitor reads. It answers the #1 cart-abandonment reason (unexpected shipping costs) before it is even asked.', ['Rotates 3 offers: free shipping threshold, Christmas cut-off, free returns + Klarna', 'The €80 threshold nudges basket size up (AOV)'], 'Lowers abandonment · lifts AOV'],
    ['Sticky header + mega menu', 'Navigation stays one click away, but hides when scrolling down so the products get the full screen, and comes back on the slightest scroll up.', ['Mega menu offers both “by category” and “by need” (gifts, bestsellers) — people shop both ways', 'Search, wishlist and bag are always visible with live counters'], 'Faster product discovery'],
    ['Hero', 'One clear promise, one primary action. The headline sells the feeling; the sub-line gives the proof (handmade, 32 makers, 2–4 day delivery).', ['Primary CTA goes straight to bestsellers — the lowest-risk first purchase', 'Rating + free returns under the buttons remove doubt at the moment of the click', 'Floating product card makes the hero shoppable — one tap adds to bag'], 'Higher click-through from the first screen'],
    ['Trust strip + press', 'Placed directly under the hero because new visitors decide in seconds whether a store is safe. These four promises cover delivery, returns, quality and payment security.', ['Press marquee borrows authority from known titles (placeholder names — replace with real ones)'], 'Builds trust before the first scroll'],
    ['Shop by category', 'Visitors with a goal (“I need a vase”) get a one-tap shortcut instead of browsing. Big photo tiles work better than text links, especially on mobile where they become a swipe row.', ['Product counts set expectations of choice'], 'Reduces bounce from intent-driven visitors'],
    ['Bestsellers grid', 'The money section. Bestsellers convert best because they carry social proof by definition. Tabs let shoppers switch to “New in” or “Under €50” without leaving the page.', ['Quick add + quick view: buy without opening a product page', 'Ratings, savings badges, Klarna instalments and low-stock signals on every card', 'Hover swaps to a lifestyle photo; wishlist hearts capture “not yet” shoppers', 'Mobile gets a permanent “Add to bag” button (no hover on phones)'], 'Main revenue driver'],
    ['Gift Edit + countdown', 'Seasonal urgency done honestly: the countdown is the real last order date for Christmas delivery, not a fake timer. After 18 Dec it switches automatically to “gift-ready all year”.', ['Dark band breaks the rhythm of the page and pulls attention', 'Free gift wrapping removes the last objection for gift buyers'], 'Urgency without dark patterns'],
    ['Shop the look', 'People buy rooms, not single objects. Hotspots let them shop the photo directly, and “Add the full look −10%” turns one item into four.', ['Product list beside the photo for accessibility and quick scanning'], 'Multi-item orders · higher AOV'],
    ['Reviews', 'Placed after the shoppable sections, right where the “is it really good?” question appears. Score + distribution + photo reviews from named, verified buyers across Europe.', ['Each review links to the exact product it mentions', 'Placeholder content — will connect to Judge.me / Trustpilot / Yotpo'], 'Converts hesitant visitors'],
    ['Our ateliers (brand story)', 'The story comes after the products on purpose: shoppers first need to want something, then the story justifies the price and builds loyalty.', ['Hard numbers (32 ateliers, 100% plastic-free, 40k homes) are easier to believe than adjectives', 'Maker quote adds a human face'], 'Justifies premium pricing'],
    ['Gift box builder', 'Interactive and fun, and it does the upselling for us: pick any 3, save 15%. A live box preview shows progress, and the button tells you exactly what is missing.', ['Adds gift wrapping automatically'], 'Raises items per order'],
    ['Customer photos (UGC)', 'Real homes are more convincing than studio shots. Each photo has a “Shop this” button so inspiration becomes a click.', ['Can be fed live from Instagram later'], 'Social proof + discovery'],
    ['FAQ', 'Answers the questions that otherwise end in an abandoned bag: delivery time, returns, handmade variation, payment, international shipping, gifting.', ['Chat CTA for anything else'], 'Removes last objections'],
    ['Newsletter (10% off)', 'Most first-time visitors will not buy today. This captures their email so the store can bring them back. A matching welcome pop-up appears once per visit — after 30 s or on exit intent, never immediately.', ['Polite “No thanks” link, no forced sign-up'], 'Builds an owned audience'],
    ['Footer', 'Reassurance for the careful shopper who scrolls to the bottom: contact details, help links, and accepted payment methods.', [], 'Trust'],
    ['Side cart (open it!)', 'The cart slides in instead of sending people to another page, so shopping never stops.', ['Reward ladder: free shipping at €80, free mini candle at €150', '“Complete your order” upsells based on what is in the bag', 'Free gift wrap + handwritten note', 'Live delivery estimate (“order within 3h for dispatch today”)', 'Klarna split, express Apple Pay / PayPal / Google Pay, trust badges'], 'Higher AOV · fewer drop-offs'],
    ['Mobile extras', 'On phones a sticky bar with “Shop bestsellers” + bag total appears after the hero, product cards show a permanent add button, and categories become a swipe row.', [], 'Mobile = 70%+ of e-commerce traffic']
  ];
  const notes = $('#notes');
  const noteTargets = $$('[data-note]');
  noteTargets.forEach(el => { const p = document.createElement('span'); p.className = 'pin'; p.textContent = el.dataset.note; p.setAttribute('aria-hidden', 'true'); el.appendChild(p); });
  $('#notesBody').innerHTML = `<p class="notes__intro">Every section has <strong>one job</strong> in moving a visitor from “just looking” to “order placed”. Numbers match the blue pins on the page.</p>` + NOTES.map((n, i) => `<div class="note" id="note-${i + 1}"><div class="note__head"><span class="note__num">${i + 1}</span><button data-goto="${i + 1}">${n[0]}</button></div><p>${n[1]}</p>${n[2].length ? `<ul>${n[2].map(x => `<li>${x}</li>`).join('')}</ul>` : ''}<span class="note__kpi">${n[3]}</span></div>`).join('');
  function openNotes() { notes.classList.add('is-open'); notes.setAttribute('aria-hidden', 'false'); document.body.classList.add('show-notes'); $('#notesBtn').setAttribute('aria-expanded', 'true'); }
  function closeNotes() { notes.classList.remove('is-open'); notes.setAttribute('aria-hidden', 'true'); document.body.classList.remove('show-notes'); $('#notesBtn').setAttribute('aria-expanded', 'false'); }
  $('#notesBtn').addEventListener('click', () => notes.classList.contains('is-open') ? closeNotes() : openNotes());
  notes.addEventListener('click', e => {
    if (e.target.closest('[data-close-notes]')) return closeNotes();
    const g = e.target.closest('[data-goto]'); if (!g) return;
    const n = +g.dataset.goto;
    if (n === 16) { openCart(); return; }
    const t = $(`[data-note="${n}"]`); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (n === 2) setMega(true);
  });
  if (/[?&]notes\b/.test(location.search)) openNotes();

  /* ---------- Motion (GSAP) ---------- */
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTab('best');
  renderWish(); updateCounts(); $('#cartCount').classList.remove('bump');
  if (window.gsap && !reduced) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero__in', { y: 40, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', delay: .1 });
    gsap.from('.hero__img', { clipPath: 'inset(100% 0 0 0 round 220px 220px 18px 18px)', duration: 1.4, ease: 'power4.inOut' });
    gsap.from('.hero__img img', { scale: 1.25, duration: 1.8, ease: 'power3.out' });
    gsap.from('#heroCard', { y: 30, opacity: 0, duration: .9, delay: 1, ease: 'power3.out' });
    gsap.from('.hero__badge', { scale: 0, rotate: -90, duration: 1, delay: 1.1, ease: 'back.out(1.6)' });
    gsap.to('.hero__img img', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    $$('.sec-head, .gift__copy, .look__copy, .story__copy, .faq__grid > div:first-child, .news__inner > div, .reviews__top').forEach(el => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });
    $$('[data-reveal-group]').forEach(g => gsap.from(g.children, { y: 40, opacity: 0, duration: .9, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: g, start: 'top 85%', once: true } }));
    $$('.gift__media img, .look__media > img').forEach(im => gsap.fromTo(im, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: im, start: 'top bottom', end: 'bottom top', scrub: true } }));
    ScrollTrigger.create({ trigger: '.stats', start: 'top 85%', once: true, onEnter: countUp });
  } else countUp();
  function countUp() {
    $$('[data-count]').forEach(el => {
      const to = +el.dataset.count, suf = el.dataset.suffix || '';
      if (!window.gsap || reduced) { el.textContent = to + suf; return; }
      const o = { v: 0 }; gsap.to(o, { v: to, duration: 1.6, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v) + suf });
    });
  }
})();
