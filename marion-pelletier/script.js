/* Maison Pelletier — v2 "Atelier" CRO homepage */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const img = (id, w = 700, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=74`;
  const eur = n => { const r = Math.round(n * 100) / 100; return '€' + (r % 1 ? r.toFixed(2).replace('.', ',') : r); };
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } }
  };
  const sget = k => { try { return sessionStorage.getItem(k); } catch { return null; } };
  const sset = (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* ignore */ } };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduced;

  /* ---------- Catalogue (placeholder data) ---------- */
  const P = {
    p1: { name: 'Grès Stoneware Cups', meta: 'Set of 4 · Limoges', price: 48, rating: 4.9, reviews: 412, img: '1610701596007-11502861dcfa', alt: '1610701596061-2ecf227e85b2', badge: 'Bestseller', swatches: [['Sand', '#D9C6A8'], ['Chalk', '#F1ECE3'], ['Charcoal', '#4A4642']], desc: 'Wheel-thrown stoneware with a raw clay foot and a soft satin glaze. Each cup holds 220 ml and feels made for slow mornings.' },
    p2: { name: 'Ambre & Figue Candle', meta: '220 g · 50 h burn', price: 36, rating: 4.8, reviews: 639, img: '1572726729207-a78d6feb18d7', alt: '1603006905003-be475563bc59', badge: 'Bestseller', desc: 'Hand-poured in Provence from rapeseed and soy wax with notes of amber, fig leaf and cedar. Cotton wick, reusable amber glass.' },
    p3: { name: 'Washed Linen Bedding', meta: 'Duvet + 2 pillowcases', price: 189, was: 219, rating: 4.9, reviews: 287, img: '1595526114035-0d45ed16cfbf', alt: '1505693416388-ac5ce068fe85', swatches: [['Flax', '#CDBFA8'], ['White', '#F4F1EA'], ['Sage', '#A3AE93']], desc: 'European flax woven in the Vosges and stone-washed for a lived-in softness from the first night. Gets better with every wash.' },
    p4: { name: 'Céleste Vase', meta: 'H 28 cm · Matte glaze', price: 64, rating: 4.7, reviews: 198, img: '1612196808214-b8e1d6145a8c', alt: '1565193566173-7a0ee3dbe261', badge: 'New', desc: 'A generous, rounded vase thrown by hand in Limoges. Watertight inside, chalky matte outside — beautiful with or without flowers.' },
    p5: { name: 'Bleu Atlantique Plates', meta: 'Set of 4 · Ø 26 cm', price: 72, rating: 4.8, reviews: 156, img: '1578749556568-bc2c40e68b61', alt: '1610701596061-2ecf227e85b2', desc: 'Reactive-glaze dinner plates inspired by the Breton coast. Dishwasher and microwave safe.' },
    p6: { name: 'Ocre Lounge Chair', meta: 'Oak frame · Bouclé', price: 690, rating: 4.9, reviews: 74, img: '1616627547584-bf28cee262db', alt: '1586023492125-27b2c045efd7', stock: 3, desc: 'A deep, tufted lounge chair upholstered in ochre bouclé on a solid French oak frame. Made to order in Burgundy.' },
    p7: { name: 'Matin Porcelain Mug', meta: '330 ml · Limoges', price: 22, rating: 4.8, reviews: 521, img: '1514228742587-6b1558fcca3d', alt: '1610701596007-11502861dcfa', desc: 'A thin-walled porcelain mug with a generous handle. Dishwasher safe, endlessly reached-for.' },
    p8: { name: 'Duo Bud Vases', meta: 'Set of 2 · Oak tray', price: 39, rating: 4.7, reviews: 142, img: '1490312278390-ab64016e0aa9', alt: '1612196808214-b8e1d6145a8c', badge: 'New', desc: 'Two slender porcelain bud vases on a hand-turned oak tray. The easiest way to bring a branch indoors.' },
    p9: { name: 'Trio Pillar Candles', meta: 'Set of 3 · Unscented', price: 29, rating: 4.8, reviews: 233, img: '1602523961358-f9f03dd557db', alt: '1602874801007-bd458bb1b8b6', desc: 'Dripless pillar candles in natural ivory wax. 40 hours each.' },
    p10: { name: 'Bois Room Oil', meta: '50 ml · Cedar & smoke', price: 26, rating: 4.7, reviews: 118, img: '1608571423902-eed4a5ad8108', alt: '1612817288484-6f916006741a', badge: 'New', desc: 'A few drops on a ceramic diffuser or linen. Cedar, birch smoke and vetiver.' },
    p11: { name: 'Petit Planter', meta: 'Ø 18 cm · Glazed', price: 34, rating: 4.6, reviews: 87, img: '1603204077779-bed963ea7d0e', alt: '1530018607912-eff2daa1bac4', badge: 'New', desc: 'A shallow glazed planter with drainage hole and saucer. Plant not included.' },
    p12: { name: 'Feather Cushion Insert', meta: '50 × 50 cm', price: 45, rating: 4.8, reviews: 301, img: '1584100936595-c0654b55a2e2', alt: '1595526114035-0d45ed16cfbf', desc: 'Responsibly sourced duck-feather insert with a cotton cover. Fills our linen cushion covers perfectly.' },
    p13: { name: 'Lune Wool Rug', meta: '170 × 240 cm', price: 249, rating: 4.8, reviews: 64, img: '1600166898405-da9535204843', alt: '1618220179428-22790b461013', desc: 'Hand-loomed wool and jute rug with a subtle border. Soft underfoot, hard-wearing.' },
    p14: { name: 'Oak Serving Board', meta: '45 × 20 cm', price: 42, rating: 4.9, reviews: 176, img: '1610701596061-2ecf227e85b2', alt: '1610701596007-11502861dcfa', desc: 'Solid French oak, oiled by hand. For bread, cheese and long lunches.' },
    g1: { name: 'The Slow Morning Set', meta: '4 cups · 2 mugs · gift-wrapped', price: 79, was: 92, rating: 4.9, reviews: 96, img: '1610701596007-11502861dcfa', alt: '1514228742587-6b1558fcca3d', desc: 'Our bestselling Grès cups and two Matin mugs, wrapped in recycled paper with a handwritten card.' },
    g2: { name: 'The Candlelit Evening', meta: 'Candle · pillars · room oil', price: 78, was: 91, rating: 4.9, reviews: 132, img: '1603006905003-be475563bc59', alt: '1602523961358-f9f03dd557db', desc: 'Ambre & Figue candle, a trio of pillar candles and Bois room oil. Everything for a slow night in.' },
    g3: { name: 'The Bloom Duo', meta: 'Céleste vase · bud vases', price: 89, was: 103, rating: 4.8, reviews: 58, img: '1565193566173-7a0ee3dbe261', alt: '1612196808214-b8e1d6145a8c', desc: 'The Céleste vase and our Duo bud vases — for big branches and single stems alike.' },
    gift: { name: 'Mini Ambre Candle', meta: 'Reward · 80 g', price: 0, img: '1603006905003-be475563bc59' }
  };
  const TABS = {
    best: ['p1', 'p2', 'p3', 'p6', 'p5', 'p7', 'p4', 'p8'],
    new: ['p4', 'p8', 'p10', 'p11', 'p1', 'p13', 'p3', 'p2'],
    gifts: ['p2', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p14']
  };
  const PAIRS = { p1: ['p14', 'p7', 'p5'], p2: ['p9', 'p10', 'p8'], p3: ['p12', 'p2', 'p13'], p4: ['p8', 'p2', 'p11'], p5: ['p1', 'p14', 'p7'], p6: ['p13', 'p12', 'p4'], p7: ['p1', 'p14', 'p2'], p8: ['p4', 'p11', 'p2'], p9: ['p2', 'p10'], p10: ['p2', 'p9'], p11: ['p8', 'p4'], p12: ['p3', 'p2'], p13: ['p6', 'p12'], p14: ['p1', 'p5'], g1: ['p14', 'p2'], g2: ['p8', 'p7'], g3: ['p11', 'p2'] };
  const SHIP_AT = 80, GIFT_AT = 150;
  const stars = n => `<span class="stars" aria-label="${n} out of 5 stars">${'<svg><use href="#i-star"/></svg>'.repeat(5)}</span>`;
  const klarna = p => p >= 30 ? `<span class="kl">or 3 × ${eur(p / 3)} with Klarna</span>` : '';

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ duration: 1.15, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    if (hasGsap) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  let locks = 0;
  const lock = on => {
    locks = Math.max(0, locks + (on ? 1 : -1));
    if (lenis) locks ? lenis.stop() : lenis.start();
    document.documentElement.style.overflow = locks ? 'hidden' : '';
  };
  function goTo(target) {
    const el = typeof target === 'string' ? $(target) : target; if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-goto], a[href^="#"]'); if (!a) return;
    const href = a.getAttribute('href'); if (!href || href === '#' || href.length < 2) return;
    const t = $(href); if (!t) return;
    e.preventDefault();
    if (a.dataset.tab) setTab(a.dataset.tab);
    if (a.closest('#menu')) { setMenu(false); setTimeout(() => goTo(t), 450); } else goTo(t);
  });

  /* ---------- Toast ---------- */
  const toastEl = $('#toast'); let toastT;
  function toast(msg) {
    toastEl.innerHTML = `<svg><use href="#i-check"/></svg>${msg}`;
    toastEl.classList.add('is-on'); clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
  }

  /* ---------- Header + mobile bar ---------- */
  const header = $('#header'); let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    header.classList.toggle('is-hidden', y > 600 && y > lastY + 2);
    if (y < lastY - 2) header.classList.remove('is-hidden');
    lastY = y;
    const on = y > innerHeight * .9;
    $('#mbar').classList.toggle('is-on', on); document.body.classList.toggle('mbar-on', on);
  }
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Full-screen menu ---------- */
  const menu = $('#menu');
  function setMenu(on) {
    if (menu.classList.contains('is-open') === on) return;
    menu.classList.toggle('is-open', on); menu.setAttribute('aria-hidden', !on); $('#menuBtn').setAttribute('aria-expanded', on); lock(on);
    if (on && hasGsap) gsap.from('.menu__links a', { yPercent: 100, opacity: 0, duration: .8, stagger: .05, delay: .25, ease: 'power4.out' });
  }
  $('#menuBtn').addEventListener('click', () => setMenu(true));
  menu.addEventListener('click', e => { if (e.target.closest('[data-close-menu]') && !e.target.closest('a')) setMenu(false); });

  /* ---------- Cursor, magnetic, peek ---------- */
  const cursor = $('#cursor'), cLabel = $('#cursorLabel'), peek = $('#peek'), peekImg = $('#peekImg');
  if (fine && !reduced) {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, px = mx, py = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.classList.add('is-on'); }, { passive: true });
    document.addEventListener('mouseleave', () => cursor.classList.remove('is-on'));
    (function loop() {
      cx += (mx - cx) * .2; cy += (my - cy) * .2; px += (mx - px) * .1; py += (my - py) * .1;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      peek.style.transform = `translate(${px}px, ${py}px) rotate(${(mx - px) * .04}deg)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', e => {
      const lab = e.target.closest('[data-cursor]');
      const link = e.target.closest('a, button, summary, label');
      cursor.classList.toggle('is-label', !!lab); cLabel.textContent = lab ? lab.dataset.cursor : '';
      cursor.classList.toggle('is-link', !lab && !!link);
    });
    document.addEventListener('mouseover', e => {
      const m = e.target.closest('.magnetic'); if (!m || m._mag) return; m._mag = true;
      const move = ev => { const r = m.getBoundingClientRect(); m.style.transform = `translate(${(ev.clientX - r.left - r.width / 2) * .25}px, ${(ev.clientY - r.top - r.height / 2) * .35}px)`; };
      const leave = () => { m.style.transition = 'transform .6s cubic-bezier(.22,.8,.2,1)'; m.style.transform = ''; setTimeout(() => m.style.transition = '', 600); m.removeEventListener('mousemove', move); m.removeEventListener('mouseleave', leave); m._mag = false; };
      m.addEventListener('mousemove', move); m.addEventListener('mouseleave', leave);
    });
  }

  /* ---------- Categories index ---------- */
  const CATS = [['Ceramics', 48, '1610701596007-11502861dcfa', 'best'], ['Candles & scent', 21, '1572726729207-a78d6feb18d7', 'gifts'], ['Bed & bath linen', 34, '1595526114035-0d45ed16cfbf', 'best'], ['Vases & décor', 39, '1612196808214-b8e1d6145a8c', 'new'], ['Furniture', 16, '1616627547584-bf28cee262db', 'best'], ['Bath & body', 27, '1612817288484-6f916006741a', 'new']];
  $('#catList').innerHTML = CATS.map((c, i) => `<li class="cat-row"><a href="#shop" data-goto data-tab="${c[3]}" data-peek="${c[2]}"><span class="n">0${i + 1}</span><span class="t">${c[0]}</span><span class="c">${c[1]} pieces</span><span class="a"><svg><use href="#i-arrow"/></svg></span><img class="thumb" src="${img(c[2], 160, 160)}" alt="" loading="lazy"></a></li>`).join('');
  if (fine && !reduced) {
    $$('[data-peek]').forEach(a => {
      a.addEventListener('mouseenter', () => { peekImg.src = img(a.dataset.peek, 600, 760); peek.classList.add('is-on'); });
      a.addEventListener('mouseleave', () => peek.classList.remove('is-on'));
    });
  }

  /* ---------- Product grid ---------- */
  const wish = new Set(store.get('mp_wish', []));
  function cardHTML(id) {
    const p = P[id]; const badges = [];
    if (p.was) badges.push(`<span class="badge badge--sale">−${Math.round((1 - p.price / p.was) * 100)}%</span>`);
    if (p.badge) badges.push(`<span class="badge ${p.badge === 'New' ? 'badge--new' : ''}">${p.badge}</span>`);
    const sw = p.swatches ? `<div class="swatches">${p.swatches.map((s, i) => `<button class="${i ? '' : 'is-on'}" style="background:${s[1]}" aria-label="${s[0]}" data-sw></button>`).join('')}</div>` : '';
    return `<article class="card">
      <div class="card__media" data-cursor="View">
        <div class="badges">${badges.join('')}</div>
        <button class="wish ${wish.has(id) ? 'is-on' : ''}" data-wish="${id}" aria-label="Save ${p.name} to wishlist" aria-pressed="${wish.has(id)}"><svg><use href="#i-heart"/></svg></button>
        <img src="${img(p.img, 640, 800)}" alt="${p.name}" loading="lazy" data-qv="${id}">
        <img class="alt" src="${img(p.alt, 640, 800)}" alt="" loading="lazy" aria-hidden="true" data-qv="${id}">
        <div class="qadd"><button class="btn" data-add="${id}"><span>Quick add · ${eur(p.price)}</span></button><button class="qv-btn" data-qv="${id}" aria-label="Quick view ${p.name}"><svg><use href="#i-eye"/></svg></button></div>
      </div>
      <div class="card__body">
        <h3 class="card__name"><button data-qv="${id}">${p.name}</button></h3>
        <div class="card__price">${eur(p.price)}${p.was ? `<s>${eur(p.was)}</s>` : ''}</div>
        <p class="card__meta">${p.meta}</p>
        <div class="card__row"><span class="r">${stars(p.rating)} ${p.rating} (${p.reviews})</span>${p.stock ? `<span class="stock">Only ${p.stock} left</span>` : sw}</div>
        <button class="btn btn--dark card__madd" data-add="${id}">Add to bag</button>
      </div>
    </article>`;
  }
  const grid = $('#productGrid');
  function movePill() {
    const on = $('.tabs [aria-selected="true"]'), pill = $('#tabPill'); if (!on) return;
    pill.style.width = on.offsetWidth + 'px'; pill.style.transform = `translateX(${on.offsetLeft - 5}px)`;
  }
  function setTab(tab) {
    if (!TABS[tab]) return;
    $$('.tabs [role="tab"]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === tab));
    movePill();
    grid.innerHTML = TABS[tab].map(cardHTML).join('');
    if (hasGsap && grid._seen) gsap.from(grid.children, { y: 40, opacity: 0, duration: .8, stagger: .05, ease: 'power3.out', clearProps: 'transform,opacity' });
  }
  $$('.tabs [role="tab"]').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));
  addEventListener('resize', movePill);

  /* ---------- Wishlist + swatches ---------- */
  const renderWish = () => { const c = $('#wishCount'); c.textContent = wish.size; c.hidden = !wish.size; };
  document.addEventListener('click', e => {
    const w = e.target.closest('[data-wish]');
    if (w) {
      const id = w.dataset.wish; wish.has(id) ? wish.delete(id) : wish.add(id);
      $$(`[data-wish="${id}"]`).forEach(b => { b.classList.toggle('is-on', wish.has(id)); b.setAttribute('aria-pressed', wish.has(id)); });
      store.set('mp_wish', [...wish]); renderWish();
      const c = $('#wishCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
      toast(wish.has(id) ? `${P[id].name} saved to wishlist` : 'Removed from wishlist'); return;
    }
    const s = e.target.closest('[data-sw]');
    if (s) { $$('[data-sw]', s.parentElement).forEach(b => b.classList.toggle('is-on', b === s)); const l = $('#qvColor'); if (l && s.closest('#qv')) l.textContent = s.getAttribute('aria-label'); }
  });

  /* ---------- Cart ---------- */
  let cart = store.get('mp_cart2', []);
  const opts = store.get('mp_opts2', { wrap: false, note: '' });
  const cartEl = $('#cart'), overlay = $('#overlay'); let lastFocus;
  const save = () => { store.set('mp_cart2', cart); store.set('mp_opts2', opts); };
  const subtotal = () => cart.reduce((s, l) => s + l.price * l.qty, 0);
  const savings = () => cart.reduce((s, l) => s + (l.was ? (l.was - l.price) * l.qty : 0), 0);
  const itemCount = () => cart.reduce((s, l) => s + l.qty, 0);
  function add(id, qty = 1, extra = {}) {
    const p = P[id]; const variant = extra.variant || (p.swatches ? p.swatches[0][0] : '');
    const key = [id, variant, extra.tag || ''].join('|');
    const ex = cart.find(l => l.key === key);
    if (ex) ex.qty += qty; else cart.push({ key, id, qty, variant, price: extra.price ?? p.price, was: extra.was ?? p.was, tag: extra.tag || '' });
    save(); updateCounts(true);
  }
  function updateCounts(bump) {
    const n = itemCount(); $('#cartCount').textContent = n;
    if (bump) { const b = $('#cartBtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    $('#mbarTotal').textContent = n ? `${eur(subtotal())} · ${n}` : 'Bag';
  }
  function openCart() {
    if (cartEl.classList.contains('is-open')) { renderCart(); return; }
    lastFocus = document.activeElement; renderCart();
    cartEl.classList.add('is-open'); cartEl.setAttribute('aria-hidden', 'false'); overlay.classList.add('is-on'); lock(true);
    setTimeout(() => $('[data-close-cart]').focus({ preventScroll: true }), 80);
  }
  function closeCart() {
    if (!cartEl.classList.contains('is-open')) return;
    cartEl.classList.remove('is-open'); cartEl.setAttribute('aria-hidden', 'true'); overlay.classList.remove('is-on'); lock(false);
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  function eta() {
    const now = new Date(), cutoff = new Date(now); cutoff.setHours(14, 0, 0, 0);
    const wk = d => d.getDay() === 0 || d.getDay() === 6;
    const ship = new Date(now); if (now > cutoff || wk(now)) { do { ship.setDate(ship.getDate() + 1); } while (wk(ship)); }
    const arr = new Date(ship); let n = 0; while (n < 2) { arr.setDate(arr.getDate() + 1); if (!wk(arr)) n++; }
    const f = d => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    if (now < cutoff && !wk(now)) { const ms = cutoff - now; return `Order within <strong>${Math.floor(ms / 36e5)}h ${Math.floor(ms % 36e5 / 6e4)}m</strong> for dispatch today · arrives <strong>${f(arr)}</strong>`; }
    return `Order now for delivery by <strong>${f(arr)}</strong>`;
  }
  function renderLadder(sub) {
    $('#ladderFill').style.width = Math.min(sub / GIFT_AT * 100, 100) + '%';
    $$('.ladder__step').forEach(s => s.classList.toggle('is-done', sub >= +s.dataset.step));
    $('#ladderMsg').innerHTML = sub < SHIP_AT ? `You're <strong>${eur(SHIP_AT - sub)}</strong> away from <strong>free shipping</strong>`
      : sub < GIFT_AT ? `Free shipping unlocked — add <strong>${eur(GIFT_AT - sub)}</strong> for a <strong>free candle</strong>`
      : `<strong>Everything unlocked</strong> — free shipping + a free mini candle`;
  }
  function upsells() {
    const inCart = new Set(cart.map(l => l.id)), pool = [];
    cart.forEach(l => (PAIRS[l.id] || []).forEach(x => { if (!inCart.has(x) && !pool.includes(x)) pool.push(x); }));
    ['p9', 'p10', 'p7', 'p2', 'p12', 'p14', 'p8'].forEach(x => { if (!inCart.has(x) && !pool.includes(x)) pool.push(x); });
    return pool.slice(0, 6);
  }
  const upHTML = id => { const p = P[id]; return `<div class="up"><div class="up__img"><img src="${img(p.img, 260, 260)}" alt="${p.name}" loading="lazy"><button class="add-sm" data-up="${id}" aria-label="Add ${p.name}"><svg><use href="#i-plus"/></svg></button></div><strong>${p.name}</strong><small>${stars(p.rating)}<b>${eur(p.price)}</b></small></div>`; };
  function renderCart() {
    const sub = subtotal(), n = itemCount(), body = $('#cartBody'), foot = $('#cartFoot');
    $('#cartHeadCount').textContent = n; renderLadder(sub); $('#ladder').hidden = !n;
    if (!n) {
      body.innerHTML = `<div class="empty"><div class="empty__icon"><svg><use href="#i-bag"/></svg></div><h3>Your bag is empty</h3><p>Start with a bestseller — loved by 40,000+ homes.</p><div class="empty__chips"><a href="#shop" data-goto data-close-cart>Bestsellers</a><a href="#gifts" data-goto data-close-cart>Gift Edit</a><a href="#bundle" data-goto data-close-cart>Build a box</a></div></div>
        <div class="ups"><div class="ups__head"><p>Most loved right now</p><span>Swipe →</span></div><div class="ups__track">${['p2', 'p1', 'p7', 'p8', 'p9'].map(upHTML).join('')}</div></div>`;
      foot.innerHTML = `<div class="cart__trust"><span><svg><use href="#i-truck"/></svg>Free shipping €80+</span><span><svg><use href="#i-return"/></svg>30-day returns</span></div>`;
      return;
    }
    const lines = cart.map(l => { const p = P[l.id]; return `<div class="line" data-key="${l.key}"><img src="${img(p.img, 200, 240)}" alt="${p.name}"><div><p class="line__name">${p.name}</p><p class="line__var">${l.variant ? l.variant + ' · ' : ''}${p.meta}${l.tag ? ` · <b>${l.tag}</b>` : ''}</p><div class="qty"><button data-q="-1" aria-label="Decrease quantity"><svg><use href="#i-minus"/></svg></button><span>${l.qty}</span><button data-q="1" aria-label="Increase quantity"><svg><use href="#i-plus"/></svg></button></div></div><div class="line__right"><div class="line__price">${eur(l.price * l.qty)}${l.was ? `<s>${eur(l.was * l.qty)}</s>` : ''}</div><button class="line__rm" data-rm>Remove</button></div></div>`; }).join('');
    const giftLine = sub >= GIFT_AT ? `<div class="line line--free"><img src="${img(P.gift.img, 200, 240)}" alt=""><div><p class="line__name">${P.gift.name}</p><p class="line__var">Ambre & Figue · <b>Reward</b></p></div><div class="line__right"><div class="line__price">Free</div></div></div>` : '';
    const ups = upsells();
    body.innerHTML = lines + giftLine +
      (ups.length ? `<div class="ups"><div class="ups__head"><p>Complete the look</p><span>Swipe →</span></div><div class="ups__track">${ups.map(upHTML).join('')}</div></div>` : '') +
      `<label class="toggle"><input type="checkbox" id="wrapT" ${opts.wrap ? 'checked' : ''}><span><strong>Gift wrap &amp; handwritten card</strong><small>Recycled paper · prices hidden on slip</small></span><em>Free</em></label>
      ${opts.wrap ? `<textarea class="gift-note" id="giftNote" placeholder="Your message — we'll write it by hand" maxlength="200">${opts.note.replace(/</g, '&lt;')}</textarea>` : ''}
      <div class="eta"><svg><use href="#i-truck"/></svg><span>${eta()}</span></div>`;
    const sv = savings(), ship = sub >= SHIP_AT ? 0 : 5.9, tot = sub + ship;
    foot.innerHTML = `<div class="sum"><div class="row2"><span>Subtotal ${eur(sub + sv)} · Shipping ${ship ? eur(ship) : '<b style="color:var(--olive)">Free</b>'}</span>${sv ? `<span class="save">You save ${eur(sv)}</span>` : ''}</div>
        <div class="tot"><span>Total</span><span>${eur(tot)}</span></div><div class="kl">or 3 interest-free payments of ${eur(tot / 3)} with Klarna</div></div>
      <button class="btn btn--dark btn--block" id="checkout"><svg><use href="#i-lock"/></svg><span>Secure checkout</span></button>
      <div class="express"><button class="ap" data-express>Apple Pay</button><button class="pp" data-express>PayPal</button><button data-express>G Pay</button></div>
      <div class="cart__trust"><span><svg><use href="#i-lock"/></svg>SSL secure</span><span><svg><use href="#i-return"/></svg>30-day free returns</span></div>`;
  }
  cartEl.addEventListener('click', e => {
    const line = e.target.closest('.line[data-key]'), q = e.target.closest('[data-q]');
    if (q && line) { const l = cart.find(x => x.key === line.dataset.key); l.qty += +q.dataset.q; if (l.qty < 1) cart = cart.filter(x => x !== l); save(); updateCounts(); renderCart(); return; }
    if (e.target.closest('[data-rm]') && line) { cart = cart.filter(x => x.key !== line.dataset.key); save(); updateCounts(); renderCart(); return; }
    const up = e.target.closest('[data-up]'); if (up) { add(up.dataset.up); renderCart(); toast(`${P[up.dataset.up].name} added`); return; }
    if (e.target.closest('#checkout, [data-express]')) { toast('Demo — checkout connects to Shopify / Stripe in the build'); return; }
    if (e.target.closest('[data-close-cart]')) closeCart();
  });
  cartEl.addEventListener('change', e => { if (e.target.id === 'wrapT') { opts.wrap = e.target.checked; save(); renderCart(); } });
  cartEl.addEventListener('input', e => { if (e.target.id === 'giftNote') { opts.note = e.target.value; save(); } });
  overlay.addEventListener('click', closeCart);
  $('#cartBtn').addEventListener('click', openCart);
  $$('[data-open-cart]').forEach(b => b.addEventListener('click', openCart));
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]'); if (!a || a.closest('#qv')) return;
    const card = a.closest('.card'); const on = card && $('[data-sw].is-on', card);
    add(a.dataset.add, 1, { variant: on ? on.getAttribute('aria-label') : undefined }); openCart();
  });

  /* ---------- Quick view ---------- */
  const qv = $('#qv');
  function openQV(id) {
    const p = P[id]; if (!p) return; lastFocus = document.activeElement;
    const sw = p.swatches ? `<div><p class="qv__label">Colour: <span id="qvColor">${p.swatches[0][0]}</span></p><div class="swatches">${p.swatches.map((s, i) => `<button class="${i ? '' : 'is-on'}" style="background:${s[1]}" aria-label="${s[0]}" data-sw></button>`).join('')}</div></div>` : '';
    $('#qvBody').innerHTML = `<div class="qv__media"><div class="qv__main"><img id="qvMain" src="${img(p.img, 900, 1125)}" alt="${p.name}"></div><div class="qv__thumbs"><button class="is-on" data-th="${p.img}" aria-label="Image 1"><img src="${img(p.img, 140, 140)}" alt=""></button><button data-th="${p.alt}" aria-label="Image 2"><img src="${img(p.alt, 140, 140)}" alt=""></button></div></div>
      <div class="qv__info"><div class="card__row" style="margin:0">${stars(p.rating)} ${p.rating} · ${p.reviews} reviews</div><h3 id="qvTitle">${p.name}</h3>
        <div class="qv__price">${eur(p.price)}${p.was ? `<s>${eur(p.was)}</s>` : ''}</div>${klarna(p.price)}<p>${p.desc}</p>${sw}${p.stock ? `<span class="stock">Only ${p.stock} left in stock</span>` : ''}
        <div class="qv__buy"><div class="qty"><button data-qq="-1" aria-label="Decrease"><svg><use href="#i-minus"/></svg></button><span id="qvQty">1</span><button data-qq="1" aria-label="Increase"><svg><use href="#i-plus"/></svg></button></div><button class="btn btn--dark" id="qvAdd" data-id="${id}"><span>Add to bag</span></button><button class="icon-btn icon-btn--line ${wish.has(id) ? 'is-on' : ''}" data-wish="${id}" aria-label="Save to wishlist"><svg><use href="#i-heart"/></svg></button></div>
        <ul class="qv__perks"><li><svg><use href="#i-truck"/></svg>Free EU shipping over €80 · dispatched in 24 h</li><li><svg><use href="#i-return"/></svg>30-day free returns</li><li><svg><use href="#i-hand"/></svg>Handmade in France — small variations are natural</li></ul></div>`;
    qv.classList.add('is-open'); qv.setAttribute('aria-hidden', 'false'); lock(true);
    setTimeout(() => $('[data-close-qv]').focus({ preventScroll: true }), 80);
  }
  function closeQV() { if (!qv.classList.contains('is-open')) return; qv.classList.remove('is-open'); qv.setAttribute('aria-hidden', 'true'); lock(false); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); }
  document.addEventListener('click', e => { const b = e.target.closest('[data-qv]'); if (b && !e.target.closest('[data-add], [data-wish]')) openQV(b.dataset.qv); });
  qv.addEventListener('click', e => {
    if (e.target === qv || e.target.closest('[data-close-qv]')) return closeQV();
    const th = e.target.closest('[data-th]'); if (th) { $('#qvMain').src = img(th.dataset.th, 900, 1125); $$('[data-th]', qv).forEach(b => b.classList.toggle('is-on', b === th)); }
    const qq = e.target.closest('[data-qq]'); if (qq) { const s = $('#qvQty'); s.textContent = Math.max(1, +s.textContent + +qq.dataset.qq); }
    const ab = e.target.closest('#qvAdd'); if (ab) { const on = $('[data-sw].is-on', qv); add(ab.dataset.id, +$('#qvQty').textContent, { variant: on ? on.getAttribute('aria-label') : undefined }); closeQV(); openCart(); }
  });

  /* ---------- Search ---------- */
  const search = $('#search'), sInput = $('#searchInput');
  function renderSearch(q) {
    q = q.trim().toLowerCase();
    const ids = Object.keys(P).filter(k => k !== 'gift' && (!q || (P[k].name + ' ' + P[k].meta + ' ' + P[k].desc).toLowerCase().includes(q)));
    $('#searchResults').innerHTML = ids.length ? ids.slice(0, 8).map(id => `<button class="sres" data-qv="${id}"><img src="${img(P[id].img, 120, 120)}" alt=""><span><strong>${P[id].name}</strong><span>${eur(P[id].price)} · ${P[id].meta}</span></span></button>`).join('')
      : `<p class="search__empty">Nothing for “${q.replace(/</g, '&lt;')}”. Try “candle” or “linen”.</p>`;
  }
  const openSearch = () => { search.classList.add('is-open'); search.setAttribute('aria-hidden', 'false'); renderSearch(''); lock(true); setTimeout(() => sInput.focus(), 80); };
  const closeSearch = () => { if (!search.classList.contains('is-open')) return; search.classList.remove('is-open'); search.setAttribute('aria-hidden', 'true'); lock(false); };
  $('#searchBtn').addEventListener('click', openSearch);
  sInput.addEventListener('input', () => renderSearch(sInput.value));
  search.addEventListener('click', e => {
    if (e.target === search || e.target.closest('[data-close-search], [data-qv]')) closeSearch();
    const chip = e.target.closest('.search__chips button'); if (chip) { sInput.value = chip.textContent; renderSearch(chip.textContent); }
  });

  /* ---------- Cinematic room (shop the look) ---------- */
  const LOOK = [{ id: 'p6', x: 72, y: 72 }, { id: 'p4', x: 33, y: 58 }, { id: 'p13', x: 56, y: 86 }, { id: 'p11', x: 9, y: 40 }];
  const hots = $('#cineHots');
  hots.innerHTML = LOOK.map((h, i) => `<div class="hot${h.x > 55 ? ' hot--l' : ''}" style="left:${h.x}%;top:${h.y}%" data-i="${i}"><button class="hot__dot" aria-label="${P[h.id].name}, ${eur(P[h.id].price)}"></button><span class="hot__tag">${P[h.id].name}<b>${eur(P[h.id].price)}</b></span></div>`).join('');
  $('#lookList').innerHTML = LOOK.map((h, i) => `<li data-i="${i}"><img src="${img(P[h.id].img, 100, 100)}" alt=""><div><strong>${P[h.id].name}</strong><span>${eur(P[h.id].price)}</span></div><button class="add-sm" data-add="${h.id}" aria-label="Add ${P[h.id].name}"><svg><use href="#i-plus"/></svg></button></li>`).join('');
  const lookSum = LOOK.reduce((s, h) => s + P[h.id].price, 0);
  $('#lookTotal').innerHTML = `· <s style="opacity:.55;font-weight:400">${eur(lookSum)}</s> ${eur(Math.round(lookSum * .9))}`;
  const setHot = i => { $$('.hot', hots).forEach(h => h.classList.toggle('is-open', +h.dataset.i === i)); $$('#lookList li').forEach(li => li.classList.toggle('is-hl', +li.dataset.i === i)); };
  hots.addEventListener('click', e => { const d = e.target.closest('.hot'); if (d) { const i = +d.dataset.i; setHot(d.classList.contains('is-open') ? -1 : i); } });
  $$('.hot').forEach(h => h.addEventListener('mouseenter', () => setHot(+h.dataset.i)));
  $$('#lookList li').forEach(li => li.addEventListener('mouseenter', () => setHot(+li.dataset.i)));
  setHot(0);
  $('#addLook').addEventListener('click', () => { LOOK.forEach(h => add(h.id, 1, { price: Math.round(P[h.id].price * 90) / 100, was: P[h.id].price, tag: 'Look −10%' })); openCart(); toast('Full look added — 10% off applied'); });

  /* ---------- Rooms ---------- */
  const ROOMS = [
    ['The breakfast <em>table</em>', '1610701596061-2ecf227e85b2', ['p1', 'p7', 'p14']],
    ['The linen <em>bedroom</em>', '1631049307264-da0ec9d70304', ['p3', 'p12']],
    ['The reading <em>corner</em>', '1586023492125-27b2c045efd7', ['p6', 'p8']],
    ['The long <em>lunch</em>', '1617806118233-18e1de247200', ['p5', 'p4']],
    ['The candlelit <em>evening</em>', '1602874801007-bd458bb1b8b6', ['p2', 'p9', 'p10']]
  ];
  $('#roomsTrack').insertAdjacentHTML('beforeend', ROOMS.map((r, i) => `<article class="room"><img src="${img(r[1], 1500, 1000)}" alt="" loading="lazy"><span class="room__num">0${i + 1} / 0${ROOMS.length}</span>
    <div class="room__info"><h3 class="room__title">${r[0]}</h3><div class="room__items">${r[2].map(id => `<div class="chip"><img src="${img(P[id].img, 80, 80)}" alt=""><span><b>${P[id].name}</b><small>${eur(P[id].price)}</small></span><button class="add-sm" data-add="${id}" aria-label="Add ${P[id].name}"><svg><use href="#i-plus"/></svg></button></div>`).join('')}</div></div></article>`).join(''));

  /* ---------- Gift sets ---------- */
  $('#giftGrid').innerHTML = ['g1', 'g2', 'g3'].map(id => { const p = P[id]; return `<article class="gset" data-cursor="View"><img src="${img(p.img, 800, 1000)}" alt="${p.name}" loading="lazy" data-qv="${id}"><span class="gset__tag badge badge--sale">Save ${eur(p.was - p.price)}</span><div class="gset__body"><h3>${p.name}</h3><p>${p.meta}</p><div class="gset__buy"><span class="gset__price">${eur(p.price)}<s>${eur(p.was)}</s></span><button class="btn btn--light" data-add="${id}"><span>Add to bag</span></button></div></div></article>`; }).join('');

  /* ---------- Countdown ---------- */
  const deadline = new Date('2026-12-18T23:59:59+01:00').getTime();
  (function tick() {
    const ms = deadline - Date.now();
    if (ms <= 0) { $('#countdown').innerHTML = '<p class="mono">Gift-ready all year</p><p class="tiny">Every order can be gift-wrapped with a handwritten card — free.</p>'; return; }
    const v = { d: Math.floor(ms / 864e5), h: Math.floor(ms % 864e5 / 36e5), m: Math.floor(ms % 36e5 / 6e4), s: Math.floor(ms % 6e4 / 1e3) };
    $$('[data-cd]').forEach(el => { const t = String(v[el.dataset.cd]).padStart(2, '0'); if (el.textContent !== t) el.textContent = t; });
    setTimeout(tick, 1000);
  })();

  /* ---------- Reviews ---------- */
  const REV = [
    ['Camille R.', 'Lyon', 'p1', 'The glaze is even more beautiful in person. Packed so carefully — not a single chip after the trip from Limoges.'],
    ['Thomas B.', 'Bordeaux', 'p3', 'Softest linen I have ever owned. Two washes in and it only gets better. Already ordered a second set for the guest room.'],
    ['Sophie L.', 'Brussels', 'p2', 'Ambre & Figue makes the whole flat smell like a little boutique hotel. Clean burn, no soot. This is my third one.'],
    ['Hannah K.', 'Berlin', 'p6', 'Delivered to Berlin in four days. The bouclé is gorgeous, the oak is solid and it is the comfiest chair in the house.'],
    ['Lucía M.', 'Madrid', 'g3', 'Ordered as a gift — the wrapping and handwritten card made it feel so personal. My sister was in tears.']
  ];
  const stage = $('#quoteStage'), dots = $('#quoteDots'); let qi = 0, qT;
  stage.innerHTML = REV.map((r, i) => `<div class="q" data-i="${i}"><div><blockquote>${r[3].split(' ').map((w, j) => `<span class="w" style="--i:${j}">${w}</span>`).join(' ')}</blockquote>
    <div class="q__who">${stars(5)}<div><strong>${r[0]}</strong><span>${r[1]} · </span><span class="verified"><svg><use href="#i-check"/></svg>Verified buyer</span></div></div></div>
    <button class="q__prod" data-qv="${r[2]}" data-cursor="Shop"><img src="${img(P[r[2]].img, 480, 600)}" alt="${P[r[2]].name}" loading="lazy"><span><b>${P[r[2]].name}</b>${eur(P[r[2]].price)}</span></button></div>`).join('');
  dots.innerHTML = REV.map((_, i) => `<button aria-label="Review ${i + 1}"><i></i></button>`).join('');
  function showQ(i) {
    qi = (i + REV.length) % REV.length;
    $$('.q', stage).forEach((q, j) => q.classList.toggle('is-on', j === qi));
    $$('button', dots).forEach((d, j) => { d.classList.toggle('is-on', j === qi); d.classList.toggle('is-done', j < qi); const ii = $('i', d); ii.style.animation = 'none'; void ii.offsetWidth; ii.style.animation = ''; });
    clearTimeout(qT); if (!reduced) qT = setTimeout(() => showQ(qi + 1), 6500);
  }
  $('#qNext').addEventListener('click', () => showQ(qi + 1));
  $('#qPrev').addEventListener('click', () => showQ(qi - 1));
  dots.addEventListener('click', e => { const b = e.target.closest('button'); if (b) showQ([...dots.children].indexOf(b)); });
  showQ(0);

  /* ---------- Bundle builder ---------- */
  const B_OPTS = ['p2', 'p7', 'p8', 'p9', 'p10', 'p14'];
  let picked = [];
  $('#bundleOptions').innerHTML = B_OPTS.map(id => `<button class="bopt" data-b="${id}" aria-pressed="false"><img src="${img(P[id].img, 420, 315)}" alt="" loading="lazy"><strong>${P[id].name}</strong><span>${eur(P[id].price)}</span><i><svg><use href="#i-plus"/></svg></i></button>`).join('');
  function renderBundle() {
    $$('.bopt').forEach(b => { const on = picked.includes(b.dataset.b); b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); $('use', b).setAttribute('href', on ? '#i-check' : '#i-plus'); });
    $('#bundleSlots').innerHTML = [0, 1, 2].map(i => picked[i] ? `<div class="slot"><img src="${img(P[picked[i]].img, 200, 200)}" alt="${P[picked[i]].name}"><button data-unpick="${picked[i]}" aria-label="Remove ${P[picked[i]].name}"><svg><use href="#i-close"/></svg></button></div>` : `<div class="slot">${i + 1}</div>`).join('');
    const sub = picked.reduce((s, id) => s + P[id].price, 0), sv = picked.length === 3 ? sub * .15 : 0;
    $('#boxCount').textContent = `${picked.length} / 3`;
    $('#bSub').textContent = eur(sub); $('#bSave').textContent = '−' + eur(sv); $('#bTotal').textContent = eur(sub - sv);
    const btn = $('#bundleAdd'); btn.disabled = picked.length < 3;
    btn.innerHTML = `<span>${picked.length < 3 ? `Choose ${3 - picked.length} more` : 'Add gift box to bag'}</span>`;
  }
  $('#bundleOptions').addEventListener('click', e => {
    const b = e.target.closest('[data-b]'); if (!b) return; const id = b.dataset.b;
    if (picked.includes(id)) picked = picked.filter(x => x !== id); else { if (picked.length === 3) picked.shift(); picked.push(id); }
    renderBundle();
  });
  $('#bundleSlots').addEventListener('click', e => { const u = e.target.closest('[data-unpick]'); if (u) { picked = picked.filter(x => x !== u.dataset.unpick); renderBundle(); } });
  $('#bundleAdd').addEventListener('click', () => { picked.forEach(id => add(id, 1, { price: Math.round(P[id].price * 85) / 100, was: P[id].price, tag: 'Box −15%' })); opts.wrap = true; save(); picked = []; renderBundle(); openCart(); toast('Gift box added — 15% off & free wrapping'); });
  renderBundle();

  /* ---------- UGC rows ---------- */
  const UGC = [['1493663284031-b7e3aefcae8e', '@chez.camille', 'p12'], ['1616486338812-3dadae4b4ace', '@lea.interieur', 'p13'], ['1618221195710-dd6b41faaea6', '@atelier.nord', 'p1'], ['1615529182904-14819c35db37', '@maison.solene', 'p8'], ['1617806118233-18e1de247200', '@petitappart', 'p5'], ['1519710164239-da123dc03ef4', '@hugo.home', 'p11'], ['1600210492486-724fe5c67fb0', '@claire.chez.soi', 'p2'], ['1513694203232-719a280e022f', '@studio.marais', 'p4']];
  const tile = (u, hide) => `<figure class="ugc__item"${hide ? ' aria-hidden="true"' : ''}><img src="${img(u[0], 640, 760)}" alt="${hide ? '' : 'Customer home styled with Maison Pelletier pieces'}" loading="lazy"><figcaption><span>${u[1]}</span><button data-qv="${u[2]}"${hide ? ' tabindex="-1"' : ''}>Shop this</button></figcaption></figure>`;
  const r1 = UGC.slice(0, 4).concat(UGC.slice(4)), r2 = UGC.slice(4).concat(UGC.slice(0, 4));
  $('#ugc').innerHTML = `<div class="ugc__row">${r1.map(u => tile(u)).join('')}${r1.map(u => tile(u, 1)).join('')}</div><div class="ugc__row ugc__row--rev">${r2.map(u => tile(u, 1)).join('')}${r2.map(u => tile(u, 1)).join('')}</div>`;

  /* ---------- Newsletter / offer ---------- */
  const offer = $('#offer');
  const openOffer = () => { if (sget('mp_offer') || $('.is-open.cart, .is-open.modal, .is-open.menu, .is-open.search') || document.body.classList.contains('show-notes')) return; sset('mp_offer', '1'); offer.classList.add('is-open'); offer.setAttribute('aria-hidden', 'false'); lock(true); };
  const closeOffer = () => { if (!offer.classList.contains('is-open')) return; offer.classList.remove('is-open'); offer.setAttribute('aria-hidden', 'true'); lock(false); };
  offer.addEventListener('click', e => { if (e.target === offer || e.target.closest('[data-close-offer]')) closeOffer(); });
  setTimeout(openOffer, 35000);
  document.addEventListener('mouseout', e => { if (!e.relatedTarget && e.clientY < 8 && scrollY > 900) openOffer(); });
  $$('[data-signup]').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); sset('mp_offer', '1'); f.outerHTML = `<div class="done"><p>Welcome to the Maison. Your code:</p><strong>BIENVENUE10</strong><p class="tiny" style="justify-content:center">Applied automatically at checkout.</p></div>`; }));

  /* ---------- Design notes ---------- */
  const NOTES = [
    ['Announcement ticker', 'The first line every visitor reads answers the #1 reason carts are abandoned — unexpected costs — before it is even asked.', ['Free-shipping threshold (€80) nudges basket size up', 'Real Christmas cut-off date and Klarna split'], 'Lower abandonment · higher AOV'],
    ['Header', 'Navigation stays one tap away but hides while you scroll down, so products get the whole screen. The bag is a filled button with a live count — always the most visible action.', ['Full-screen menu with “by need” shortcuts (gifts, rooms, new in)', 'Search and wishlist always visible'], 'Faster discovery'],
    ['Hero', 'An editorial headline with product photos set inside the words — it sells the feeling and shows real products in the first second. Proof sits right under the buttons.', ['One primary action: Shop bestsellers (lowest-risk first purchase)', '4.9/5 from 2,143 reviews + 40,000 homes next to the CTA', 'Short intro animation shows only once per visit'], 'Click-through from screen one'],
    ['Shoppable room', 'As you scroll, the photo opens up to full width — a cinematic “wow” that is also a shop. Tap the dots, add one piece or the whole room with 10% off.', ['Turns one item into four (multi-item orders)', 'Product list beside the image for clarity and accessibility'], 'Higher average order value'],
    ['Promises band', 'A bold terracotta band makes the four guarantees impossible to miss: shipping, returns, handmade, secure payment. Press names borrow authority (placeholders).', [], 'Trust before the first product'],
    ['Category index', 'Shoppers with a goal skip browsing. Hovering a category name floats a preview photo next to the cursor — memorable and quick. On phones each row shows its photo.', [], 'Lower bounce for intent visitors'],
    ['Bestsellers', 'The main revenue section. Bestsellers sell best because they carry proof by definition; tabs switch to New in / Under €50 without leaving the page.', ['Quick add + quick view — buy without opening a product page', 'Ratings, savings, low stock and Klarna on every card', 'Hover swaps to a lifestyle photo; wishlist captures “not yet” shoppers', 'Phones get a permanent Add to bag button'], 'Main revenue driver'],
    ['Shop by room', 'A horizontal gallery that moves as you scroll — the award-style moment of the page. People buy rooms, not objects, so every room has its products one tap away.', ['On phones it becomes a natural swipe row'], 'Inspiration → add to bag'],
    ['Gift Edit + countdown', 'Honest urgency: the countdown is the real last order date for Christmas delivery and switches to “gift-ready all year” after 18 Dec. Ready-made sets show the saving.', ['Free gift wrapping removes the last gift-buyer objection'], 'Seasonal conversions'],
    ['Why us — stacking cards', 'Placed after people have seen products: now the story justifies the price. Cards stack on top of each other while scrolling, each with one hard number.', ['Handmade · lasting materials · plastic-free · free returns'], 'Justifies premium pricing'],
    ['Reviews', 'One big review at a time, each linked to the product it mentions, with a progress bar that auto-advances. Score and distribution sit alongside.', ['Ready to connect to Judge.me / Trustpilot / Yotpo'], 'Converts hesitant visitors'],
    ['Gift box builder', 'Interactive and fun, and it upsells by itself: pick any three, save 15%. The dark “box” fills up live and the button says exactly what is missing.', [], 'More items per order'],
    ['Customer photos', 'Two endless rows of real homes. Each photo has “Shop this” so inspiration becomes a click.', [], 'Social proof + discovery'],
    ['FAQ + live help', 'Answers the questions that otherwise end in an abandoned bag, with a real person (online now) for anything else.', [], 'Removes last objections'],
    ['Newsletter 10%', 'Most visitors won’t buy today — this captures their email so the store can bring them back. A matching pop-up appears once per visit, after 35 s or on exit intent, with a polite “no thanks”.', [], 'Owned audience'],
    ['Footer', 'Reassurance for careful shoppers who scroll to the end: contact, help links and payment methods, finished with a large brand signature.', [], 'Trust + brand recall'],
    ['Side cart (open it)', 'Opens over the page so shopping never stops.', ['Reward ladder: free shipping at €80, free candle at €150', '“Complete the look” upsells based on what is in the bag', 'Free gift wrap + handwritten note', 'Live delivery estimate', 'Klarna, Apple Pay, PayPal, Google Pay, trust badges'], 'Higher AOV · fewer drop-offs']
  ];
  const notes = $('#notes');
  $$('[data-note]').forEach(el => { const p = document.createElement('span'); p.className = 'pin'; p.textContent = el.dataset.note; p.setAttribute('aria-hidden', 'true'); el.appendChild(p); });
  const noteMap = [1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
  $('#notesBody').innerHTML = `<p class="notes__intro">Every section has <strong>one job</strong> in moving a visitor from “just looking” to “order placed”. Numbers match the blue pins on the page.</p>` +
    NOTES.map((n, i) => `<div class="note"><div class="note__head"><span class="note__num">${i === 3 ? '3b' : (noteMap[i] || '+')}</span><button data-jump="${noteMap[i]}">${n[0]}</button></div><p>${n[1]}</p>${n[2].length ? `<ul>${n[2].map(x => `<li>${x}</li>`).join('')}</ul>` : ''}<span class="note__kpi">${n[3]}</span></div>`).join('');
  function openNotes() { notes.classList.add('is-open'); notes.setAttribute('aria-hidden', 'false'); document.body.classList.add('show-notes'); $('#notesBtn').setAttribute('aria-expanded', 'true'); }
  function closeNotes() { notes.classList.remove('is-open'); notes.setAttribute('aria-hidden', 'true'); document.body.classList.remove('show-notes'); $('#notesBtn').setAttribute('aria-expanded', 'false'); }
  $('#notesBtn').addEventListener('click', () => notes.classList.contains('is-open') ? closeNotes() : openNotes());
  notes.addEventListener('click', e => {
    if (e.target.closest('[data-close-notes]')) return closeNotes();
    const j = e.target.closest('[data-jump]'); if (!j) return;
    const n = +j.dataset.jump; if (!n) { openCart(); return; }
    const t = n === 3 && j.textContent.includes('room') ? $('#cine') : $(`[data-note="${n}"]`); if (t) goTo(t);
  });
  if (/[?&]notes\b/.test(location.search)) openNotes();

  /* ---------- Escape ---------- */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (qv.classList.contains('is-open')) return closeQV();
    closeCart(); closeSearch(); closeOffer(); setMenu(false); closeNotes();
  });

  /* ---------- Init + motion ---------- */
  setTab('best'); renderWish(); updateCounts();
  requestAnimationFrame(movePill);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(movePill);

  const intro = $('#intro');
  const introOn = intro && getComputedStyle(intro).display !== 'none';
  function heroIn(delay) {
    if (!hasGsap) return;
    gsap.from('.hero__title .hl__in', { yPercent: 110, duration: 1.3, stagger: .1, ease: 'power4.out', delay });
    gsap.from('.pill', { width: 0, duration: 1.2, ease: 'power4.inOut', delay: delay + .35, clearProps: 'width' });
    gsap.from('.hero__meta, .hero__lead, .hero__proof, .hero__scroll', { y: 30, opacity: 0, duration: 1, stagger: .08, ease: 'power3.out', delay: delay + .5 });
    gsap.from('.header__inner', { y: -20, opacity: 0, duration: 1, ease: 'power3.out', delay });
  }
  function endIntro() { sset('mp_intro', '1'); if (intro) intro.remove(); lock(false); }
  if (introOn) {
    lock(true);
    if (hasGsap) {
      const o = { v: 0 }, tl = gsap.timeline({ onComplete: endIntro });
      tl.from('.intro__word span, .intro__word em', { yPercent: 110, duration: 1, stagger: .12, ease: 'power4.out' })
        .to(o, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { $('#introCount').textContent = Math.round(o.v); } }, 0)
        .to('.intro__word span, .intro__word em', { yPercent: -110, duration: .7, stagger: .06, ease: 'power3.in' }, 1.25)
        .to(intro, { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'power4.inOut' }, 1.6);
      heroIn(2.05);
    } else endIntro();
    setTimeout(() => { if (document.body.contains(intro)) endIntro(); }, 4500);
  } else heroIn(.1);

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // cinematic frame opens to full width
    mm.add('(min-width: 701px)', () => {
      gsap.fromTo('#cineFrame', { clipPath: 'inset(0% 9% 0% 9% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', ease: 'none', scrollTrigger: { trigger: '#cine', start: 'top 95%', end: 'top 15%', scrub: true } });
      gsap.fromTo('#cineImg', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#cine', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from('#cinePanel', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '#cine', start: 'top 35%', once: true } });
    });

    // horizontal rooms
    mm.add('(min-width: 961px)', () => {
      const track = $('#roomsTrack');
      const dist = () => track.scrollWidth - innerWidth;
      const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#rooms', pin: '#roomsPin', start: 'top top', end: () => '+=' + dist(), scrub: 1, invalidateOnRefresh: true, onUpdate: s => { $('#roomsBar').style.width = (s.progress * 100) + '%'; } } });
      $$('.room > img').forEach(im => gsap.fromTo(im, { xPercent: 4 }, { xPercent: -4, ease: 'none', scrollTrigger: { trigger: im.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } }));
      return () => gsap.set(track, { x: 0 });
    });

    // stacking cards
    mm.add('(min-width: 701px)', () => {
      const cards = $$('.stack__card');
      cards.forEach((c, i) => { if (i < cards.length - 1) gsap.to(c, { scale: .94, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top 85%', end: 'top 110px', scrub: true } }); });
    });

    // headings & reveals
    $$('.sec-head, .cats__head, .rooms__intro, .gifts__top, .score, .faq__side, .news__inner, .footer__grid').forEach(el => gsap.from(el.children, { y: 50, opacity: 0, duration: 1.1, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }));
    gsap.from('.cat-row', { y: 40, opacity: 0, duration: .9, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: '#catList', start: 'top 85%', once: true } });
    ScrollTrigger.create({ trigger: grid, start: 'top 85%', once: true, onEnter: () => { grid._seen = true; gsap.from(grid.children, { y: 60, opacity: 0, duration: 1, stagger: .07, ease: 'power3.out', clearProps: 'transform,opacity' }); } });
    gsap.from('.gset', { y: 80, opacity: 0, duration: 1.1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '#giftGrid', start: 'top 85%', once: true } });
    gsap.from('.bopt', { y: 40, opacity: 0, duration: .9, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: '#bundleOptions', start: 'top 85%', once: true } });
    gsap.fromTo('.footer__word', { yPercent: 40 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    addEventListener('load', () => ScrollTrigger.refresh());
  } else grid._seen = true;
})();
