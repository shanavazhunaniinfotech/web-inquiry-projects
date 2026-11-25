/* Home District — product page (PDP) template. One template, driven by data, for 30 → 80+ products. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const aed = n => 'AED ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const q4 = n => aed(Math.round((n / 4) * 100) / 100);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const I = n => '../images/' + n;

  /* ======================= CATALOG (placeholder data until the client's range is final) ======================= */
  const SOFA_LEGS = [{ label: 'Natural oak', c: '#B8916A', add: 0 }, { label: 'Black ash', c: '#1a1a1a', add: 150 }];
  const P = {
    'coast-sofa': { name: 'Coast 3-seater sofa', cat: 'sofas', room: 'Living', badge: 'Bestseller', rating: 4.9, reviews: 86, anchor: 9800,
      sub: 'Deep-seat sofa · kiln-dried oak frame · zip-off covers', mat: 'Kiln-dried oak frame',
      desc: 'A deep seat, a relaxed back and the space to settle in. Feather-wrapped cushions and zip-off, washable covers.',
      variants: [
        { label: 'Forest velvet', c: '#2f5a4a', img: 'p-sofa-green.jpg', price: 4290, gallery: ['pd-green.jpg', 'pd-green-arm.jpg', 'pd-green-cush.jpg', 'pd-green-leg.jpg', 'v2-hero.jpg'] },
        { label: 'Charcoal weave', c: '#3a3a3a', img: 'p-sofa-dark.jpg', price: 4290, gallery: ['pd-dark.jpg', 'pd-dark-arm.jpg', 'p-sofa-dark.jpg', 'v2-hero.jpg'] },
        { label: 'Cognac leather', c: '#9a5f37', img: 'p-sofa-tan.jpg', price: 5990, gallery: ['pd-tan.jpg', 'pd-tan-arm.jpg', 'pd-tan-cush.jpg', 'pd-tan-leg.jpg', 'v2-tansofa.jpg'] }
      ],
      sizes: [{ label: '180 cm', note: '2–3 seats', w: 180, add: -430 }, { label: '220 cm', note: '3 seats', w: 220, add: 0 }, { label: '260 cm', note: '3–4 seats', w: 260, add: 650 }],
      legs: SOFA_LEGS, dims: { d: 95, h: 78, seatH: 45, seatD: 60, armH: 62, legH: 14 }, shape: 'sofa',
      highlights: [['60 cm', 'Deep, relaxed seat', 'Room to curl up, with a back cushion that supports, not swallows.'], ['30°', 'Zip-off, washable covers', 'Every cover unzips and machine-washes, so it stays new for longer.'], ['5 yrs', 'Kiln-dried oak frame', 'Corner-blocked, glued and screwed. It will not warp in air-conditioning.']] },
    'mara-sofa': { name: 'Mara modular sofa', cat: 'sofas', room: 'Living', badge: 'Made to order', rating: 4.8, reviews: 41, anchor: 12400,
      sub: 'Low modular sofa · arrives in pieces · re-arrange any time', mat: 'Stone weave, oak plinth',
      desc: 'Low, generous and endlessly re-arrangeable. Start with three modules and add more as your home grows.',
      variants: [{ label: 'Stone weave', c: '#8d8d88', img: 'pp-mara.jpg', price: 5490, gallery: ['pp-mara.jpg', 'r-sofa.jpg', 'shop-room.jpg', 'v2-detail.jpg'] }],
      sizes: [{ label: '3 modules', note: '264 cm', w: 264, add: 0 }, { label: '4 modules', note: '352 cm', w: 352, add: 1690 }, { label: 'Corner', note: '264 × 200 cm', w: 264, add: 2200 }],
      legs: SOFA_LEGS, dims: { d: 100, h: 72, seatH: 42, seatD: 64, armH: 58, legH: 8 }, shape: 'sofa', modular: true,
      highlights: [['88 cm', 'Arrives in modules', 'Every piece fits through a standard door, lift or staircase.'], ['∞', 'Re-arrange any time', 'Hidden clips let you turn a sofa into a corner or a chaise.'], ['64 cm', 'Extra-deep seat', 'Low and lounge-y, made for long movie nights.']] },
    'nook-chair': { name: 'Nook lounge chair', cat: 'chairs', room: 'Living', badge: 'Bestseller', rating: 4.9, reviews: 64, anchor: 3900, sub: 'Rounded lounge chair · bouclé · solid beech legs', mat: 'Bouclé, solid beech',
      desc: 'A soft, rounded shell on solid beech legs. Small enough for a bedroom corner, comfortable enough for a long read.',
      variants: [{ label: 'Sky bouclé', c: '#86A6C9', img: 'p-chair-blue.jpg', price: 1890, gallery: ['p-chair-blue.jpg', 'v2-anatomy.jpg', 'room-armchairs.jpg'] }, { label: 'Mist bouclé', c: '#d9d6d0', img: 'v2-anatomy.jpg', price: 1890, gallery: ['v2-anatomy.jpg', 'texture.jpg'] }],
      dims: { w: 78, d: 74, h: 82, seatH: 42, legH: 16 }, shape: 'chair' },
    'orbit-chair': { name: 'Orbit swivel chair', cat: 'chairs', room: 'Workspace', badge: 'New', rating: 4.8, reviews: 22, anchor: 2700, sub: 'Swivel chair · woven fabric · oak base', mat: 'Woven fabric, oak base', desc: 'A gentle 360° swivel on a four-star oak base. Ideal for a reading corner or a desk.', variants: [{ label: 'Pebble', c: '#a59c90', img: 'pp-swivel.jpg', price: 1290, gallery: ['pp-swivel.jpg', 'v2-work.jpg'] }], dims: { w: 62, d: 60, h: 80, seatH: 46, legH: 30 }, shape: 'chair' },
    'sato-side': { name: 'Sato side table', cat: 'tables', room: 'Living', rating: 4.9, reviews: 28, anchor: 1200, sub: 'Solid oak · slides over the sofa arm', mat: 'Solid oak', desc: 'Solid oak with a cantilevered top that slides over the sofa arm, and a shelf for books.', variants: [{ label: 'Natural oak', c: '#b89068', img: 'pp-side.jpg', price: 590, gallery: ['pp-side.jpg', 'p-console.jpg'] }], dims: { w: 45, d: 35, h: 55 }, shape: 'box' },
    'dome-pendant': { name: 'Dome pendant', cat: 'lighting', room: 'Dining', rating: 4.8, reviews: 37, anchor: 990, sub: 'Brushed brass · warm downward glow', mat: 'Brushed brass', desc: 'Spun brushed-brass shade with a warm, downward glow. Hang alone or as a cluster.', variants: [{ label: 'Brushed brass', c: '#b8954a', img: 'pp-pendant.jpg', price: 490, gallery: ['pp-pendant.jpg', 'v2-lighting.jpg'] }], dims: { w: 32, d: 32, h: 28 }, shape: 'box' },
    'ochre-chair': { name: 'Ochre armchair', cat: 'chairs', room: 'Living', rating: 4.7, reviews: 19, anchor: 3300, sub: 'Button-tufted velvet · turned legs', mat: 'Velvet, turned legs', desc: 'Button-tufted back and turned black legs: a warm accent for a calm room.', variants: [{ label: 'Ochre velvet', c: '#c49a3c', img: 'pp-ochre.jpg', price: 1650, gallery: ['pp-ochre.jpg'] }], dims: { w: 70, d: 76, h: 88, seatH: 44, legH: 18 }, shape: 'chair' },
    'saddle-chair': { name: 'Saddle desk chair', cat: 'chairs', room: 'Workspace', rating: 4.7, reviews: 15, anchor: 2800, sub: 'Channel-stitched cognac leather', mat: 'Cognac leather', desc: 'Channel-stitched cognac leather on a smooth swivel base.', variants: [{ label: 'Cognac leather', c: '#8A5A3C', img: 'pp-saddle.jpg', price: 1390, gallery: ['pp-saddle.jpg'] }], dims: { w: 60, d: 58, h: 84, seatH: 47, legH: 30 }, shape: 'chair' },
    'wren-sideboard': { name: 'Wren sideboard', cat: 'tables', room: 'Dining', rating: 4.8, reviews: 19, anchor: 5800, sub: 'Matt lacquer · solid oak top · soft-close', mat: 'Lacquer & oak', desc: 'Matt white lacquer with a solid oak top and soft-close doors.', variants: [{ label: 'White & oak', c: '#f3f1ec', img: 'p-sideboard.jpg', price: 2890, gallery: ['p-sideboard.jpg', 'v2-storage.jpg'] }], dims: { w: 160, d: 45, h: 75 }, shape: 'box' },
    'halo-lamp': { name: 'Halo floor lamp', cat: 'lighting', room: 'Living', rating: 4.8, reviews: 31, anchor: 1400, sub: 'Adjustable reading light', mat: 'Powder-coated steel', desc: 'Adjustable head and a warm, focused reading light.', variants: [{ label: 'Graphite', c: '#5a5d60', img: 'p-lamp.jpg', price: 690, gallery: ['p-lamp.jpg', 'room-lighting.jpg'] }], dims: { w: 30, d: 30, h: 160 }, shape: 'box' },
    'teak-table': { name: 'Block coffee table', cat: 'tables', room: 'Living', rating: 4.8, reviews: 31, anchor: 3900, sub: 'Reclaimed teak · hand-oiled', mat: 'Reclaimed teak', desc: 'Reclaimed teak, oiled by hand. Every top is unique.', variants: [{ label: 'Reclaimed teak', c: '#8a5a3c', img: 'r-table.jpg', price: 1890, gallery: ['r-table.jpg', 'shop-room.jpg'] }], dims: { w: 120, d: 60, h: 40 }, shape: 'box' },
    'saddle-pouf': { name: 'Saddle leather pouf', cat: 'chairs', room: 'Living', rating: 4.9, reviews: 44, anchor: 1100, sub: 'Hand-stitched vegetable-tanned leather', mat: 'Vegetable-tanned leather', desc: 'Hand-stitched leather that softens beautifully with age.', variants: [{ label: 'Cognac', c: '#9a5f37', img: 'r-pouf.jpg', price: 490, gallery: ['r-pouf.jpg', 'shop-room.jpg'] }], dims: { w: 45, d: 45, h: 42 }, shape: 'box' },
    'arc-lamp': { name: 'Arc floor lamp', cat: 'lighting', room: 'Living', badge: 'New', rating: 4.8, reviews: 15, anchor: 1900, sub: 'Brushed brass · lights a sofa without a ceiling point', mat: 'Brushed brass', desc: 'A brushed-brass arc that lights a sofa without a ceiling point.', variants: [{ label: 'Brushed brass', c: '#b8954a', img: 'r-lamp.jpg', price: 890, gallery: ['r-lamp.jpg', 'shop-room.jpg'] }], dims: { w: 160, d: 35, h: 195 }, shape: 'box' },
    'ranch-chair': { name: 'Ranch lounge chair', cat: 'chairs', room: 'Living', rating: 4.7, reviews: 12, anchor: 4400, sub: 'Steel frame · slung saddle leather', mat: 'Steel & saddle leather', desc: 'Black steel frame with a slung saddle-leather seat.', variants: [{ label: 'Cognac & black', c: '#7a4a2c', img: 'r-chair.jpg', price: 2190, gallery: ['r-chair.jpg', 'shop-room.jpg'] }], dims: { w: 72, d: 80, h: 74, seatH: 38, legH: 20 }, shape: 'chair' }
  };
  const CAT_LABEL = { sofas: 'Sofas', chairs: 'Chairs', tables: 'Tables & storage', lighting: 'Lighting' };

  /* ======================= STATE ======================= */
  const params = new URLSearchParams(location.search);
  const id = P[params.get('id')] ? params.get('id') : 'coast-sofa';
  const p = P[id];
  const st = { v: 0, s: p.sizes ? Math.min(1, p.sizes.length - 1) : -1, l: 0, qty: 1 };
  const price = () => p.variants[st.v].price + (p.sizes ? p.sizes[st.s].add : 0) + (p.legs ? p.legs[st.l].add : 0);
  const sizeLabel = () => (p.sizes ? p.sizes[st.s].label : '') + (p.legs ? ' · ' + p.legs[st.l].label + ' legs' : '');
  const W = () => p.sizes ? p.sizes[st.s].w : p.dims.w;

  /* ======================= TOAST / PANELS ======================= */
  const toastEl = $('[data-toast]'); let toastT;
  function toast(msg) { toastEl.innerHTML = '<svg><use href="#i-check"/></svg><span></span>'; toastEl.querySelector('span').textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2800); }
  const scrim = $('[data-scrim]'); let openPanel = null, lenis = null;
  function open(name) {
    const el = $(`[data-panel="${name}"]`); if (!el) return;
    if (openPanel) close();
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false'); scrim.classList.add('is-on'); document.body.style.overflow = 'hidden'; lenis && lenis.stop(); openPanel = el;
    if (name === 'cart') renderCart();
    if (name === 'swatches') renderSwatchPick();
    if (name === 'bnpl') renderPlan();
  }
  function close() { if (!openPanel) return; openPanel.classList.remove('is-open'); openPanel.setAttribute('aria-hidden', 'true'); openPanel = null; scrim.classList.remove('is-on'); document.body.style.overflow = ''; lenis && lenis.start(); }
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]'); if (o) { e.preventDefault(); open(o.dataset.open); return; }
    if (e.target.closest('[data-close]')) { close(); return; }
    if (e.target.classList.contains('modal')) close();
    const a = e.target.closest('a[href^="#"]');
    if (a && a.getAttribute('href').length > 1 && lenis) { e.preventDefault(); lenis.scrollTo(a.getAttribute('href'), { offset: -80, duration: 1.3 }); }
  });
  scrim.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); closeLb(); closeNote(); } });

  const ann = $$('[data-announce] p'); let ai = 0;
  setInterval(() => { ann[ai].classList.remove('is-active'); ai = (ai + 1) % ann.length; ann[ai].classList.add('is-active'); }, 4200);
  const header = $('[data-header]'); let lastY = 0;
  window.addEventListener('scroll', () => { const y = scrollY; header.classList.toggle('is-scrolled', y > 10); header.classList.toggle('is-hidden', y > 700 && y > lastY + 4 && !openPanel); if (y < lastY - 4) header.classList.remove('is-hidden'); lastY = y; }, { passive: true });

  /* ======================= CART (shared with the home page) ======================= */
  let cart = store.get('hd-cart2', []);
  const cartCount = $('[data-cart-count]');
  function syncCart(bump) { const n = cart.reduce((a, i) => a + i.qty, 0); cartCount.textContent = n; cartCount.hidden = !n; if (bump) { cartCount.classList.remove('bump'); void cartCount.offsetWidth; cartCount.classList.add('bump'); } }
  const unit = i => i.custom ? i.custom.price : (P[i.id] ? P[i.id].variants[i.v].price : 0);
  function addToCart(pid, v, qty, opts = {}) {
    const key = pid + ':' + v + ':' + (opts.label || '');
    const ex = cart.find(i => i.key === key);
    if (ex) ex.qty += qty; else cart.push({ key, id: pid, v, qty, size: opts.label || '', custom: opts.price ? { name: P[pid].name, label: P[pid].variants[v].label + (opts.label ? ' · ' + opts.label : ''), price: opts.price } : null });
    store.set('hd-cart2', cart); syncCart(true);
    if (!opts.silent) open('cart');
  }
  function eta(days) { const d = new Date(); d.setDate(d.getDate() + days); return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }
  function renderCart() {
    const box = $('[data-cart-items]'), foot = $('[data-cart-foot]');
    const n = cart.reduce((a, i) => a + i.qty, 0);
    $('[data-cart-label]').textContent = n ? `(${n})` : '';
    $('[data-cart-eta]').textContent = 'by ' + eta(7);
    if (!cart.length) { box.innerHTML = `<div class="cart__empty"><p class="h3">Your cart is <em>empty</em></p><p>Find something you'll love.</p><a href="../#edit" class="btn btn--dark">Shop bestsellers</a></div>`; foot.hidden = true; return; }
    foot.hidden = false;
    box.innerHTML = cart.map((i, idx) => {
      const pp = P[i.id]; if (!pp) return '';
      const va = pp.variants[i.v] || pp.variants[0];
      return `<div class="cart-item"><img src="${I(va.img)}" alt=""><div><strong>${i.custom ? i.custom.name : pp.name}</strong><span class="muted">${i.custom ? i.custom.label : va.label + (i.size ? ' · ' + i.size : '')}</span>
        <div class="qty"><button aria-label="Decrease" data-cq="${idx}" data-d="-1"><svg><use href="#i-minus"/></svg></button><span>${i.qty}</span><button aria-label="Increase" data-cq="${idx}" data-d="1"><svg><use href="#i-plus"/></svg></button></div></div>
        <div><div class="cart-item__price">${aed(unit(i) * i.qty)}</div><button class="cart-item__remove" data-crm="${idx}">Remove</button></div></div>`;
    }).join('');
    const sub = cart.reduce((a, i) => a + unit(i) * i.qty, 0);
    $('[data-cart-subtotal]').textContent = aed(sub);
    $('[data-cart-tabby]').textContent = q4(sub);
  }
  $('[data-panel="cart"]').addEventListener('click', e => {
    const q = e.target.closest('[data-cq]'), rm = e.target.closest('[data-crm]');
    if (q) { const i = cart[+q.dataset.cq]; i.qty += +q.dataset.d; if (i.qty < 1) cart.splice(+q.dataset.cq, 1); }
    if (rm) cart.splice(+rm.dataset.crm, 1);
    if (q || rm) { store.set('hd-cart2', cart); syncCart(); renderCart(); }
  });
  $('[data-checkout]').addEventListener('click', () => toast('In Shopify this opens checkout with Apple Pay, cards, tabby & tamara'));
  syncCart();

  /* ======================= WISHLIST ======================= */
  let wish = store.get('hd-wish', []);
  const wishCount = $('[data-wish-count]');
  function syncWish() { wishCount.textContent = wish.length; wishCount.hidden = !wish.length; $('[data-wish-p]').classList.toggle('is-on', wish.includes(id)); $$('[data-wish]').forEach(b => b.classList.toggle('is-on', wish.includes(b.dataset.wish))); }
  function toggleWish(pid) { wish = wish.includes(pid) ? wish.filter(x => x !== pid) : [...wish, pid]; store.set('hd-wish', wish); syncWish(); toast(wish.includes(pid) ? `Saved ${P[pid].name}` : 'Removed from wishlist'); }
  $('[data-wish-p]').addEventListener('click', () => toggleWish(id));
  $('[data-wish-count-btn]').addEventListener('click', () => toast(wish.length ? `${wish.length} saved — wishlist page comes with the full build` : 'Tap ♡ to save a piece'));

  /* ======================= BUY BOX ======================= */
  document.title = `${p.name} — Home District`;
  $('[data-p-name]').innerHTML = p.name.replace(/(\S+)$/, '<em>$1</em>');
  $('[data-p-name-crumb]').textContent = p.name;
  $('[data-crumb-cat]').textContent = CAT_LABEL[p.cat];
  $('[data-crumb-room]').textContent = p.room;
  $('[data-p-sub]').textContent = p.sub;
  $('[data-p-rating]').textContent = p.rating;
  $('[data-p-reviews]').textContent = p.reviews;
  if (p.badge) { const b = $('[data-p-badge]'); b.textContent = p.badge; b.hidden = false; }
  $('[data-wa-product]').href = `https://wa.me/971500000000?text=${encodeURIComponent('Hi Home District, I have a question about the ' + p.name)}`;

  $('[data-p-variants]').innerHTML = p.variants.map((v, i) => `<button type="button" style="--c:${v.c}" aria-label="${v.label}" aria-pressed="${i === 0}" data-pv="${i}"><span class="tip">${v.label}</span></button>`).join('');
  if (p.sizes) { $('[data-opt-size]').hidden = false; $('[data-p-sizes]').innerHTML = p.sizes.map((s, i) => `<button type="button" aria-pressed="${i === st.s}" data-ps="${i}">${s.label}<small>${s.add > 0 ? '+' + aed(s.add) : s.add < 0 ? '−' + aed(-s.add) : s.note}</small></button>`).join(''); }
  if (p.legs) { $('[data-opt-legs]').hidden = false; $('[data-p-legs]').innerHTML = p.legs.map((l, i) => `<button type="button" aria-pressed="${i === 0}" data-pl="${i}">${l.label}<small>${l.add ? '+' + aed(l.add) : 'Included'}</small></button>`).join(''); }
  if (p.variants.length === 1) $('[data-opt-variant] .opt__head > span').textContent = 'Finish';

  function updateBuy() {
    const pr = price(), va = p.variants[st.v];
    $('[data-p-price]').textContent = aed(pr);
    $('[data-p-anchor]').innerHTML = p.anchor ? `Comparable showroom price <s>${aed(p.anchor)}</s>` : '';
    $('[data-p-q4]').textContent = q4(pr);
    $('[data-p-vlabel]').textContent = va.label;
    if (p.sizes) $('[data-p-slabel]').textContent = p.sizes[st.s].label;
    if (p.legs) $('[data-p-llabel]').textContent = p.legs[st.l].label;
    $('[data-p-add-price]').textContent = aed(pr * st.qty);
    $('[data-qty-val]').textContent = st.qty;
    $('[data-satc-img]').src = I(va.img);
    $('[data-satc-name]').textContent = p.name;
    $('[data-satc-var]').textContent = va.label + (p.sizes ? ' · ' + sizeLabel() : '');
    $('[data-satc-price]').textContent = aed(pr);
    $('[data-satc-q4]').textContent = q4(pr);
    const made = p.badge === 'Made to order';
    $('[data-p-stock]').textContent = made ? 'Made to order' : 'In stock';
    updateEta();
    drawFit(); doorCheck(); renderSet();
  }
  function updateEta() {
    const em = $('[data-p-emirate]').value;
    const base = p.badge === 'Made to order' ? 42 : 5;
    const extra = { 'Dubai': 0, 'Sharjah': 1, 'Ajman': 1, 'Abu Dhabi': 2 }[em] ?? 3;
    $('[data-p-eta]').textContent = eta(base + extra);
  }
  $('[data-p-emirate]').addEventListener('change', updateEta);
  $('[data-buy]').addEventListener('click', e => {
    const v = e.target.closest('[data-pv]'), s = e.target.closest('[data-ps]'), l = e.target.closest('[data-pl]'), q = e.target.closest('[data-qty]');
    if (v) { st.v = +v.dataset.pv; $$('[data-pv]').forEach(b => b.setAttribute('aria-pressed', b === v)); renderGallery(); }
    if (s) { st.s = +s.dataset.ps; $$('[data-ps]').forEach(b => b.setAttribute('aria-pressed', b === s)); }
    if (l) { st.l = +l.dataset.pl; $$('[data-pl]').forEach(b => b.setAttribute('aria-pressed', b === l)); }
    if (q) st.qty = Math.max(1, Math.min(9, st.qty + +q.dataset.qty));
    if (v || s || l || q) updateBuy();
  });
  const addMain = silent => addToCart(id, st.v, st.qty, { label: p.sizes ? sizeLabel() : '', price: (p.sizes || p.legs) ? price() : 0, silent });
  $('[data-p-add]').addEventListener('click', () => addMain());
  $('[data-satc-add]').addEventListener('click', () => addMain());
  $('[data-p-buynow]').addEventListener('click', () => { addMain(true); toast('In Shopify this goes straight to secure checkout'); });
  $('[data-bnpl]').addEventListener('click', () => open('bnpl'));
  function renderPlan() {
    const each = Math.round(price() * st.qty / 4 * 100) / 100;
    $('[data-bnpl-plan]').innerHTML = ['Today', 'In 1 month', 'In 2 months', 'In 3 months'].map(t => `<li><b>${aed(each)}</b>${t}</li>`).join('');
  }

  /* ======================= GALLERY + LIGHTBOX ======================= */
  const track = $('[data-gallery-track]');
  let gal = [];
  function renderGallery() {
    gal = p.variants[st.v].gallery || [p.variants[st.v].img];
    const odd = (gal.length - 1) % 2 === 1;
    track.innerHTML = gal.map((g, i) => `<button class="gallery__item${odd && i === gal.length - 1 ? ' is-wide' : ''}" type="button" data-gi="${i}" data-cursor-text="Zoom" aria-label="Enlarge image ${i + 1}"><img src="${I(g)}" alt="${p.name} in ${p.variants[st.v].label}, view ${i + 1}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>${i === 0 ? `<figcaption>${p.variants[st.v].label}</figcaption>` : ''}</button>`).join('');
    $('[data-g-total]').textContent = gal.length; $('[data-g-cur]').textContent = 1;
    $('[data-gallery-dots]').innerHTML = gal.map((_, i) => `<i class="${i ? '' : 'is-on'}"></i>`).join('');
    track.scrollLeft = 0;
    bindCursor(track);
    if (window.gsap && !reduce) gsap.from(track.children, { opacity: 0, y: 16, duration: .7, stagger: .05, ease: 'power3.out' });
  }
  track.addEventListener('scroll', () => { const i = Math.round(track.scrollLeft / track.clientWidth); $('[data-g-cur]').textContent = i + 1; $$('[data-gallery-dots] i').forEach((d, k) => d.classList.toggle('is-on', k === i)); }, { passive: true });
  const lb = $('[data-lightbox]'), lbImg = $('[data-lb-img]'); let lbi = 0;
  function openLb(i) { lbi = i; lbImg.src = I(gal[i]); lbImg.alt = `${p.name}, view ${i + 1}`; lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; lenis && lenis.stop(); }
  function closeLb() { if (!lb.classList.contains('is-open')) return; lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; lenis && lenis.start(); }
  track.addEventListener('click', e => { const g = e.target.closest('[data-gi]'); if (g) openLb(+g.dataset.gi); });
  $('[data-lb-close]').addEventListener('click', closeLb);
  lb.addEventListener('click', e => { const n = e.target.closest('[data-lb]'); if (n) { openLb((lbi + +n.dataset.lb + gal.length) % gal.length); return; } if (e.target === lb) closeLb(); });

  /* ======================= HIGHLIGHTS ======================= */
  const HL = p.highlights || [['Free', 'Delivery & assembly', 'Our own team, to the room of your choice, packaging removed.'], ['30', 'Day home trial', 'Live with it for a month. Not right? We collect it.'], ['5 yrs', 'Guarantee', 'Every frame, spring and joint, covered.']];
  $('[data-highlights]').innerHTML = HL.map(([n, t, d]) => `<div class="hl"><strong>${n}</strong><h3>${t}</h3><p>${d}</p></div>`).join('');

  /* ======================= WILL IT FIT (drawing + doorway) ======================= */
  let view = 'front';
  $$('[data-view]').forEach(b => b.addEventListener('click', () => { view = b.dataset.view; $$('[data-view]').forEach(x => x.setAttribute('aria-selected', x === b)); drawFit(); }));
  function dimLine(x1, y1, x2, y2, label, vertical) {
    const t = vertical ? `<text x="${x1 - 10}" y="${(y1 + y2) / 2}" text-anchor="end" dominant-baseline="middle">${label}</text>` : `<text x="${(x1 + x2) / 2}" y="${y1 + 22}" text-anchor="middle">${label}</text>`;
    const ticks = vertical ? `<line class="dim" x1="${x1 - 5}" y1="${y1}" x2="${x1 + 5}" y2="${y1}"/><line class="dim" x1="${x1 - 5}" y1="${y2}" x2="${x1 + 5}" y2="${y2}"/>` : `<line class="dim" x1="${x1}" y1="${y1 - 5}" x2="${x1}" y2="${y1 + 5}"/><line class="dim" x1="${x2}" y1="${y1 - 5}" x2="${x2}" y2="${y1 + 5}"/>`;
    return `<line class="dim" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>${ticks}${t}`;
  }
  function drawFit() {
    const svg = $('[data-drawing]'), d = p.dims, w = W(), base = 300;
    const len = view === 'front' ? w : d.d;
    const s = Math.min(560 / len, 240 / d.h);
    const L = 360 - len * s / 2, R = 360 + len * s / 2, T = base - d.h * s;
    const y = v => base - v * s;
    let g = `<line class="floor" x1="40" y1="${base}" x2="680" y2="${base}"/>`;
    if (p.shape === 'sofa' || p.shape === 'chair') {
      const legH = (d.legH || 12) * s, seatY = y(d.seatH || 44), armY = y(d.armH || (d.seatH || 44) + 18);
      if (view === 'front') {
        const armW = Math.max(14, 16 * s);
        g += `<rect class="ln" x="${L + 10}" y="${base - legH}" width="${6}" height="${legH}"/><rect class="ln" x="${R - 16}" y="${base - legH}" width="6" height="${legH}"/>`;
        g += `<rect class="fill" x="${L + 6}" y="${T}" width="${R - L - 12}" height="${base - legH - T}" rx="${10 * s}"/>`;
        const n = p.shape === 'chair' ? 1 : w >= 250 ? 3 : w >= 200 ? 3 : 2, inner = (R - armW) - (L + armW), cw = inner / n;
        for (let i = 0; i < n; i++) g += `<rect class="ln" x="${L + armW + i * cw + 2}" y="${T + 10 * s}" width="${cw - 4}" height="${seatY - T - 12 * s}" rx="${8 * s}"/><rect class="ln" x="${L + armW + i * cw + 2}" y="${seatY - 4 * s}" width="${cw - 4}" height="${12 * s}" rx="${4 * s}"/>`;
        g += `<rect class="fill" x="${L}" y="${armY}" width="${armW}" height="${base - legH - armY}" rx="${6 * s}"/><rect class="fill" x="${R - armW}" y="${armY}" width="${armW}" height="${base - legH - armY}" rx="${6 * s}"/>`;
      } else {
        const sd = (d.seatD || d.d * .62) * s;
        g += `<path class="fill" d="M${L + 4} ${base - legH} L${L + 4} ${armY} Q${L + 4} ${T} ${L + 20 * s} ${T} L${L + 30 * s} ${T} Q${L + 38 * s} ${T} ${L + 38 * s} ${T + 12 * s} L${R - sd} ${seatY - 4 * s} L${R - 6} ${seatY - 4 * s} Q${R} ${seatY - 4 * s} ${R} ${seatY + 4 * s} L${R} ${base - legH} Z"/>`;
        g += `<line class="ln" x1="${R - sd}" y1="${seatY - 4 * s}" x2="${R - sd}" y2="${base - legH}" stroke-dasharray="4 4"/>`;
        g += `<rect class="ln" x="${L + 12}" y="${base - legH}" width="6" height="${legH}"/><rect class="ln" x="${R - 18}" y="${base - legH}" width="6" height="${legH}"/>`;
        g += dimLine(R - sd, seatY - 22, R, seatY - 22, `Seat depth ${d.seatD || Math.round(d.d * .62)} cm`).replace(`y="${seatY - 22 + 22}"`, `y="${seatY - 30}"`);
      }
      g += dimLine(R + 26, seatY, R + 26, base, '', true) + `<text x="${R + 34}" y="${(seatY + base) / 2}" dominant-baseline="middle">Seat ${d.seatH || 44}</text>`;
    } else {
      g += `<rect class="fill" x="${L}" y="${T}" width="${R - L}" height="${base - T}" rx="4"/>`;
    }
    g += dimLine(L, base + 22, R, base + 22, `${view === 'front' ? 'Width ' + len : 'Depth ' + len} cm`);
    g += dimLine(L - 22, T, L - 22, base, `${d.h} cm`, true);
    svg.innerHTML = g;
    $('[data-dims]').innerHTML = [['Width', w], ['Depth', d.d], ['Height', d.h], [d.seatH ? 'Seat height' : 'Weight', d.seatH ? d.seatH : '—']].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}${typeof v === 'number' ? ' cm' : ''}</dd></div>`).join('');
  }
  function doorCheck() {
    const dw = +$('[data-door-w]').value || 0, dh = +$('[data-door-h]').value || 0, d = p.dims, out = $('[data-door-result]');
    const pass = p.modular ? 60 : Math.min(d.d, d.h - (d.legH || 0)) + 2;
    let msg, c;
    if (dw >= pass + 6 && dh >= 180) { c = '#2E7D32'; msg = `<span><b>Fits comfortably.</b> ${p.modular ? 'It arrives in modules, each smaller than a standard door.' : `Through your ${dw} cm door with legs off it needs ${pass} cm. Our team handles it.`}</span>`; }
    else if (dw >= pass) { c = '#C27C0E'; msg = `<span><b>A tight fit.</b> It should pass at ${pass} cm, but book a free home visit and we'll measure it for you.</span>`; }
    else { c = '#B3261E'; msg = `<span><b>Too narrow (needs ${pass} cm).</b> ${p.shape === 'sofa' && !p.modular ? 'Try the <a href="?id=mara-sofa">Mara modular sofa</a>: it arrives in pieces.' : 'Ask us on WhatsApp and we’ll find a way.'}</span>`; }
    out.style.setProperty('--dot', c); out.innerHTML = msg;
  }
  $$('[data-door-w], [data-door-h]').forEach(i => i.addEventListener('input', doorCheck));

  /* ======================= DETAILS ACCORDION ======================= */
  const d = p.dims;
  const ACC = [
    ['Overview', `<p>${p.desc}</p>`, true],
    ['Materials &amp; construction', `<ul><li><b>Frame</b><span>${p.shape === 'sofa' ? 'Kiln-dried solid oak and hardwood, corner-blocked, glued and screwed' : p.mat}</span></li><li><b>Upholstery</b><span>${p.variants[0].label} — stain-resistant, fade-tested</span></li>${p.shape === 'sofa' ? '<li><b>Cushions</b><span>High-resilience foam core, feather-and-fibre wrap</span></li><li><b>Legs</b><span>Solid oak or black ash, removable</span></li>' : ''}</ul>`],
    ['Dimensions', `<ul><li><b>Overall</b><span>W ${W()} × D ${d.d} × H ${d.h} cm</span></li>${d.seatH ? `<li><b>Seat height</b><span>${d.seatH} cm</span></li>` : ''}${d.seatD ? `<li><b>Seat depth</b><span>${d.seatD} cm</span></li>` : ''}${d.armH ? `<li><b>Arm height</b><span>${d.armH} cm</span></li>` : ''}<li><b>Fits through</b><span>${p.modular ? '60 cm doors (arrives in modules)' : Math.min(d.d, d.h - (d.legH || 0)) + 2 + ' cm doors'}</span></li></ul>`],
    ['Care', `<p>${p.shape === 'sofa' ? 'Unzip the covers and machine-wash at 30° on a gentle cycle; line dry. Plump cushions weekly. Blot spills straight away with a damp cloth.' : 'Dust with a soft, dry cloth. Avoid direct sun and harsh cleaners.'}</p>`],
    ['Delivery, assembly &amp; returns', `<p>Free delivery and assembly to the room of your choice in all 7 Emirates, in 3–10 days (tailor-made 6–8 weeks). We confirm a 2-hour window on WhatsApp the day before and take all packaging away. Live with it for 30 days; if it isn't right, we collect it free.</p>`],
    ['Guarantee', `<p>5 years on every frame, spring and joint. If anything fails under normal use, we repair or replace it — no forms, just a WhatsApp message.</p>`]
  ];
  $('[data-acc]').innerHTML = ACC.map(([t, b, o]) => `<details ${o ? 'open' : ''}><summary>${t}<i></i></summary><div class="acc__body">${b}</div></details>`).join('');
  $('[data-details-img]').src = I(p.variants[0].gallery && p.variants[0].gallery[2] || p.variants[0].img);
  $('[data-details-img]').alt = `${p.name} detail`;

  /* ======================= COMPLETE THE LOOK ======================= */
  const SET = p.cat === 'sofas' ? ['teak-table', 'arc-lamp', 'saddle-pouf'] : p.cat === 'chairs' ? ['sato-side', 'halo-lamp', 'saddle-pouf'] : ['coast-sofa', 'nook-chair', 'dome-pendant'];
  const setIds = [id, ...SET.filter(x => x !== id)].slice(0, 4);
  const sel = new Set(setIds);
  $('[data-set-items]').innerHTML = setIds.map((sid, i) => `<label class="set-item"><input type="checkbox" checked data-set="${sid}"><figure><img src="${I(P[sid].variants[0].img)}" alt="" loading="lazy">${i === 0 ? '<span class="set-item__tag">This piece</span>' : ''}<span class="set-item__check"><svg><use href="#i-check"/></svg></span></figure><strong>${P[sid].name}</strong><span data-set-price="${sid}"></span></label>`).join('');
  function setPrice(sid) { return sid === id ? price() : P[sid].variants[0].price; }
  function renderSet() {
    setIds.forEach(sid => { const el = $(`[data-set-price="${sid}"]`); el && (el.textContent = aed(setPrice(sid))); });
    const total = [...sel].reduce((a, sid) => a + setPrice(sid), 0);
    const disc = sel.size >= 2 ? Math.round(total * .05) : 0;
    $('[data-set-was]').textContent = disc ? aed(total) : '';
    $('[data-set-total]').textContent = aed(total - disc);
    $('[data-set-q4]').textContent = q4(total - disc);
    $('[data-set-note]').textContent = sel.size >= 2 ? `You save ${aed(disc)} with ${sel.size} pieces` : 'Add one more piece to save 5%';
    $('[data-set-add]').textContent = `Add ${sel.size} ${sel.size === 1 ? 'piece' : 'pieces'} to cart`;
    $('[data-set-add]').disabled = !sel.size;
  }
  $('[data-set-items]').addEventListener('change', e => { const c = e.target.closest('[data-set]'); if (!c) return; c.checked ? sel.add(c.dataset.set) : sel.delete(c.dataset.set); renderSet(); });
  $('[data-set-add]').addEventListener('click', () => { [...sel].forEach(sid => sid === id ? addMain(true) : addToCart(sid, 0, 1, { silent: true })); open('cart'); });

  /* ======================= REVIEWS ======================= */
  const RV = [
    { n: 'Layla A.', loc: 'Dubai Hills', r: 5, t: 'Looks twice the price', b: 'Delivered on the day they promised, assembled in forty minutes, packaging taken away. The velvet is deep and soft, and friends keep asking where it is from.', v: 'Forest velvet · 220 cm', ph: ['ugc-2.jpg', 'pd-green-cush.jpg'], tags: ['delivery', 'comfort'], d: '12 Nov 2026', h: 24 },
    { n: 'Omar K.', loc: 'Abu Dhabi', r: 5, t: 'The home visit sold me', b: 'Sara measured our majlis and suggested the 260 cm. It fits perfectly and the seat is deep enough to nap on. Paid with tabby in four.', v: 'Charcoal weave · 260 cm', ph: ['ug-10.jpg'], tags: ['comfort'], d: '3 Nov 2026', h: 18 },
    { n: 'Hannah R.', loc: 'Sharjah', r: 5, t: 'Washable covers are a lifesaver', b: 'Two kids and a dog. Zipped the covers off, washed them, and they came back like new. Calm, beautiful and actually practical.', v: 'Forest velvet · 220 cm', ph: [], tags: ['comfort'], d: '28 Oct 2026', h: 15 },
    { n: 'Ahmed S.', loc: 'Dubai Marina', r: 5, t: 'Made it up 14 floors without a scratch', b: 'I worried it would not fit our lift. The team took the legs off and had it in place in minutes. Very professional.', v: 'Cognac leather · 220 cm', ph: ['pd-tan.jpg'], tags: ['delivery'], d: '19 Oct 2026', h: 11 },
    { n: 'Priya M.', loc: 'JLT', r: 4, t: 'Beautiful, a little firm at first', b: 'Took about two weeks to soften into the perfect seat. The colour is exactly as photographed. Would buy again.', v: 'Charcoal weave · 180 cm', ph: [], tags: ['comfort'], d: '8 Oct 2026', h: 9 },
    { n: 'Rania & Karim', loc: 'Arabian Ranches', r: 5, t: 'Better than the showroom sofa we almost bought', b: 'We compared it side by side with a sofa three times the price. Same oak frame, nicer fabric. Easy decision.', v: 'Cognac leather · 260 cm', ph: ['v2-tansofa.jpg'], tags: ['comfort'], d: '30 Sep 2026', h: 21 }
  ];
  const bars = [[5, 91], [4, 7], [3, 1], [2, 1], [1, 0]];
  $('[data-rv-bars]').innerHTML = bars.map(([s, w]) => `<li><span>${s} ★</span><i style="--w:${w}%"></i><span>${w}%</span></li>`).join('');
  $('[data-rv-count]').textContent = p.reviews;
  $('[data-rv-score]').textContent = p.rating;
  let rf = 'all', rvShown = 4;
  function renderReviews() {
    const list = RV.filter(r => rf === 'all' || (rf === 'photo' ? r.ph.length : rf === '5' ? r.r === 5 : r.tags.includes(rf)));
    $('[data-rv-list]').innerHTML = list.slice(0, rvShown).map((r, i) => `<article class="rv"><div class="rv__head"><span class="stars">${'<svg><use href="#i-star"/></svg>'.repeat(r.r)}</span><strong>${r.n}</strong><span class="muted">${r.loc}</span><span class="verified"><svg><use href="#i-check"/></svg>Verified buyer</span><span class="rv__date">${r.d}</span></div>
      <div class="rv__body"><h3>${r.t}</h3><p>${r.b}</p><span class="rv__var">Purchased: ${r.v}</span></div>
      ${r.ph.length ? `<div class="rv__photos">${r.ph.map(x => `<img src="${I(x)}" alt="Photo from ${r.n}" loading="lazy">`).join('')}</div>` : '<span></span>'}
      <div class="rv__help">Helpful? <button type="button" data-help="${i}">Yes · ${r.h}</button></div></article>`).join('') || '<p class="muted" style="padding:28px 0">No reviews match this filter yet.</p>';
    $('[data-rv-more]').hidden = list.length <= rvShown;
  }
  $('[data-rv-filters]').addEventListener('click', e => { const b = e.target.closest('[data-rf]'); if (!b) return; rf = b.dataset.rf; rvShown = 4; $$('[data-rf]').forEach(x => x.setAttribute('aria-pressed', x === b)); renderReviews(); });
  $('[data-rv-more]').addEventListener('click', () => { rvShown += 4; renderReviews(); });
  $('[data-rv-list]').addEventListener('click', e => { const h = e.target.closest('[data-help]'); if (h && !h.classList.contains('is-on')) { h.classList.add('is-on'); h.textContent = h.textContent.replace(/\d+$/, n => +n + 1); } });
  $('[data-write-review]').addEventListener('click', () => toast('In Shopify this opens the review form (Judge.me / Okendo)'));
  renderReviews();

  /* ======================= Q&A ======================= */
  const FAQ = [
    ['Will it fit through my door or lift?', `Use the doorway checker above. With the legs off, ${p.name} passes through a ${p.modular ? '60' : Math.min(d.d, d.h - (d.legH || 0)) + 2} cm opening. If you're unsure, we'll measure for free.`],
    ['Can I see the fabric first?', 'Yes — order up to 6 swatches free, delivered in 2–3 days, or book a free home visit and we bring them.'],
    ['How firm is the seat?', 'Medium. A high-resilience foam core keeps its shape; the feather wrap gives a soft, relaxed top. Most owners say "just right".'],
    ['Can I get a different size or fabric?', 'Yes. Every sofa can be tailor-made in your width and any of our 24 fabrics, in 6–8 weeks.']
  ];
  $('[data-faq]').innerHTML = FAQ.map(([q, a], i) => `<details ${i ? '' : 'open'}><summary>${q}<i></i></summary><p>${a}</p></details>`).join('');

  /* ======================= RELATED ======================= */
  const REL = Object.keys(P).filter(x => x !== id).sort((a, b) => (P[b].cat === p.cat) - (P[a].cat === p.cat)).slice(0, 8);
  $('[data-related]').innerHTML = REL.map(rid => { const r = P[rid], v = r.variants[0]; return `<article class="pcard"><a class="pcard__media" href="?id=${rid}" data-cursor-text="View"><img src="${I(v.img)}" alt="${r.name}" loading="lazy">${r.badge ? `<span class="pcard__badge">${r.badge}</span>` : ''}</a><div class="pcard__info"><div class="pcard__top"><h3 class="pcard__name"><a href="?id=${rid}">${r.name}</a></h3><span class="pcard__price">${aed(v.price)}</span></div><span class="pcard__tabby">or 4 × <b>${q4(v.price)}</b></span><div class="pcard__row"><span class="pcard__mat">${r.mat}</span><span class="rating"><svg><use href="#i-star"/></svg>${r.rating}</span></div></div></article>`; }).join('');
  $$('[data-rel]').forEach(b => b.addEventListener('click', () => { const rail = $('[data-related]'); rail.scrollBy({ left: +b.dataset.rel * rail.clientWidth * .8, behavior: 'smooth' }); }));

  /* ======================= SWATCHES ======================= */
  const FABRICS = [['Oat linen', '#E3DCCF'], ['Mist bouclé', '#C9C3B8'], ['Stone weave', '#8F8A82'], ['Olive velvet', '#5E6256'], ['Forest velvet', '#2F4A42'], ['Sky bouclé', '#86A6C9'], ['Cognac leather', '#8A5A3C'], ['Charcoal weave', '#3A3936']];
  let picked = [];
  function renderSwatchPick() {
    if (!picked.length && FABRICS.some(f => f[0] === p.variants[st.v].label)) picked.push(p.variants[st.v].label);
    $('[data-swatch-pick]').innerHTML = FABRICS.map(([n, c]) => `<button type="button" aria-pressed="${picked.includes(n)}" data-fab="${n}"><i style="--c:${c}"></i>${n}</button>`).join('');
    $('[data-swatch-submit]').textContent = `Send my swatches (${picked.length}/6)`;
  }
  $('[data-swatch-pick]').addEventListener('click', e => { const b = e.target.closest('[data-fab]'); if (!b) return; const n = b.dataset.fab; if (picked.includes(n)) picked = picked.filter(x => x !== n); else if (picked.length < 6) picked.push(n); renderSwatchPick(); });
  $('[data-swatch-form]').addEventListener('submit', e => { e.preventDefault(); if (!picked.length) { toast('Pick at least one fabric'); return; } close(); toast(`${picked.length} swatch${picked.length > 1 ? 'es' : ''} on the way — arriving in 2–3 days`); picked = []; e.target.reset(); });

  /* ======================= STICKY ADD TO CART ======================= */
  const satc = $('[data-satc]');
  if ('IntersectionObserver' in window) {
    let atcVisible = true, footVisible = false;
    const upd = () => { const on = !atcVisible && !footVisible && scrollY > 400; satc.classList.toggle('is-on', on); satc.setAttribute('aria-hidden', !on); };
    new IntersectionObserver(es => { atcVisible = es[0].isIntersecting || es[0].boundingClientRect.top > 0; upd(); }).observe($('[data-main-atc]'));
    new IntersectionObserver(es => { footVisible = es[0].isIntersecting; upd(); }).observe($('.footer'));
    addEventListener('scroll', () => { const r = $('[data-main-atc]').getBoundingClientRect(); atcVisible = r.bottom > 0; upd(); }, { passive: true });
  }

  /* ======================= DESIGN NOTES ======================= */
  const NOTES = {
    1: ['Buy box: everything above the fold', `<p>Name, rating, price, the 4-payment price, options, delivery date and Add to cart are all visible without scrolling. The gallery scrolls while the buy box stays put on desktop.</p><ul><li>A <b>comparable showroom price</b> anchors the value.</li><li>Delivery date changes with the Emirate you choose: a concrete promise, not a vague "3–10 days".</li><li>Fabric swatches change the gallery; size and leg choices update the price live.</li><li>Trust row and a stylist with a face answer the last doubts. WhatsApp is one tap away.</li></ul><span class="tag">Clarity</span><span class="tag">Trust</span>`],
    2: ['Highlights: three reasons in three seconds', `<p>Big numbers in serif italic make the key benefits scannable: seat depth, washable covers, frame guarantee. For products without custom highlights, the template falls back to delivery, trial and guarantee.</p>`],
    3: ['Will it fit? Remove the #1 objection', `<p>"Will it fit?" is the biggest reason people don't buy a sofa online. A to-scale drawing updates with the chosen size, and a doorway checker gives an instant, honest answer — even suggesting the modular sofa if a door is too narrow.</p><span class="tag">Objection handling</span>`],
    4: ['Details: honest information', `<p>Materials, dimensions, care, delivery and guarantee in calm accordions, as the brand guide asks: "describe materials, dimensions and comfort clearly."</p>`],
    5: ['Complete the look: raise order value', `<p>Pieces that belong together, ticked by default, with a 5% saving on two or more and the 4-payment total. One button adds the whole set.</p><span class="tag">AOV</span>`],
    6: ['Reviews: real owners, real homes', `<p>Rating summary, star distribution, "would recommend", and fit/feel scales (firmness, colour accuracy) answer the questions people can't test online. Filters for photos, comfort and delivery let shoppers find their concern fast.</p><p><b>Note:</b> sample reviews; at launch this connects to Judge.me or Okendo.</p>`],
    7: ['Questions: stop exits', `<p>The four questions that stop a sofa purchase, answered on the page, with WhatsApp next to them for anything else.</p>`],
    8: ['Related: keep browsing', `<p>Products from the same category first, then complementary pieces. When people scroll past the buy box, a slim <b>sticky add-to-cart bar</b> keeps the price and button in reach.</p><p>This page is one template: every product in the store uses it, driven by data, so it scales from 30 to 80+ products.</p>`]
  };
  const notesBtn = $('[data-notes-toggle]'), notesPanel = $('[data-notes-panel]'); let curNote = 1;
  $$('[data-note]').forEach(sec => { const n = sec.dataset.note; const pin = document.createElement('button'); pin.type = 'button'; pin.className = 'note-pin'; pin.innerHTML = `<b>${n}</b>${NOTES[n][0].split(':')[0]}`; pin.addEventListener('click', () => showNote(+n)); sec.appendChild(pin); });
  function showNote(n) { curNote = n; $('[data-note-num]').textContent = `${n} / 8`; $('[data-note-title]').textContent = NOTES[n][0]; $('[data-note-body]').innerHTML = NOTES[n][1]; notesPanel.classList.add('is-open'); notesPanel.setAttribute('aria-hidden', 'false'); }
  function closeNote() { notesPanel.classList.remove('is-open'); notesPanel.setAttribute('aria-hidden', 'true'); }
  notesBtn.addEventListener('click', () => { const on = !document.body.classList.contains('notes-on'); document.body.classList.toggle('notes-on', on); notesBtn.setAttribute('aria-pressed', on); on ? showNote(curNote) : closeNote(); });
  $('[data-notes-close]').addEventListener('click', closeNote);
  const goNote = n => { n = ((n - 1 + 8) % 8) + 1; showNote(n); const s = $(`[data-note="${n}"]`); s && (lenis ? lenis.scrollTo(s, { offset: -80 }) : s.scrollIntoView({ behavior: 'smooth' })); };
  $('[data-note-prev]').addEventListener('click', () => goNote(curNote - 1));
  $('[data-note-next]').addEventListener('click', () => goNote(curNote + 1));

  /* ======================= CURSOR ======================= */
  const cur = $('[data-cursor]'), curLabel = $('[data-cursor-label]');
  function bindCursor(root = document) {
    if (!fine || reduce) return;
    $$('[data-cursor-text]', root).forEach(el => { if (el._cb) return; el._cb = 1; el.addEventListener('mouseenter', () => { curLabel.textContent = el.dataset.cursorText; cur.classList.add('is-text'); }); el.addEventListener('mouseleave', () => cur.classList.remove('is-text')); });
    $$('a, button, label', root).forEach(el => { if (el._ch) return; el._ch = 1; el.addEventListener('mouseenter', () => cur.classList.add('is-hover')); el.addEventListener('mouseleave', () => cur.classList.remove('is-hover')); });
  }
  if (fine && !reduce) {
    document.documentElement.classList.add('has-cursor');
    let mx = -100, my = -100, cx = -100, cy = -100;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() { cx += (mx - cx) * .2; cy += (my - cy) * .2; cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; requestAnimationFrame(loop); })();
  }

  /* ======================= INIT ======================= */
  renderGallery(); updateBuy(); syncWish(); bindCursor();
  function motion() {
    if (!window.gsap || !window.ScrollTrigger || reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis && fine) { lenis = new Lenis({ duration: 1.1 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    gsap.from('.buy > *', { opacity: 0, y: 18, duration: .9, stagger: .04, ease: 'power3.out', delay: .1 });
    ['.hl', '.fit__copy > *', '.drawing', '.acc details', '.set-item', '.look-set__sum', '.rv__summary', '.rv', '.faq__list details', '.related__rail .pcard'].forEach(sel =>
      $$(sel).forEach(el => gsap.from(el, { opacity: 0, y: 28, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } })));
  }
  if (document.readyState === 'complete') motion(); else addEventListener('load', motion);
})();
