/* Home District — home page concept interactions */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const aed = n => 'AED ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const tabby = n => aed(Math.round((n / 4) * 100) / 100);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------------- Product data (placeholders until the client's range is final) ---------------- */
  const P = {
    'coast-sofa': { name: 'Coast 3-seater sofa', cat: 'sofas', badge: 'Bestseller', rating: 4.9, reviews: 86, desc: 'A deep seat, a relaxed back and the space to settle in. Kiln-dried oak frame, feather-wrapped cushions and zip-off covers.',
      variants: [
        { label: 'Forest velvet', c: '#2f5a4a', img: 'images/p-sofa-green.jpg', price: 4290 },
        { label: 'Charcoal weave', c: '#3a3a3a', img: 'images/p-sofa-dark.jpg', price: 4290 },
        { label: 'Cognac leather', c: '#9a5f37', img: 'images/p-sofa-tan.jpg', price: 5990 }
      ], sizes: ['180 cm', '220 cm', '260 cm'], meta: '220 × 95 × 78 cm' },
    'mara-sofa': { name: 'Mara modular sofa', cat: 'sofas', badge: 'New', rating: 4.8, reviews: 41, desc: 'Low, generous and endlessly re-arrangeable. Start with three modules and add more as your home grows.',
      variants: [{ label: 'Stone weave', c: '#8d8d88', img: 'images/r-sofa.jpg', price: 5490 }], sizes: ['3 modules', '4 modules', 'Corner'], meta: '264 × 100 × 72 cm' },
    'nook-chair': { name: 'Nook lounge chair', cat: 'chairs', badge: 'Bestseller', rating: 4.9, reviews: 64, desc: 'A soft, rounded shell on solid beech legs. Small enough for a bedroom corner, comfortable enough for a long read.',
      variants: [
        { label: 'Sky bouclé', c: '#86A6C9', img: 'images/p-chair-blue.jpg', price: 1890 },
        { label: 'Mist bouclé', c: '#d9d6d0', img: 'images/room-armchairs.jpg', price: 1890 }
      ], meta: '78 × 74 × 82 cm' },
    'cloud-armchair': { name: 'Cloud armchair', cat: 'chairs', rating: 4.7, reviews: 23, desc: 'Channel-tufted back, compact footprint, painted solid-wood legs.',
      variants: [{ label: 'Ivory', c: '#efede8', img: 'images/p-chair-white.jpg', price: 1450 }], meta: '68 × 70 × 86 cm' },
    'wren-sideboard': { name: 'Wren sideboard', cat: 'tables', badge: 'Made to order', dark: true, rating: 4.8, reviews: 19, desc: 'Matt white lacquer with a solid oak top and soft-close doors.',
      variants: [{ label: 'White & oak', c: '#f3f1ec', img: 'images/p-sideboard.jpg', price: 2890 }], meta: '160 × 45 × 75 cm' },
    'sato-console': { name: 'Sato oak console', cat: 'tables', rating: 4.9, reviews: 28, desc: 'Solid oak with softly rounded ends and an open lower shelf for books and baskets.',
      variants: [{ label: 'Natural oak', c: '#b89068', img: 'images/p-console.jpg', price: 2190 }], meta: '140 × 38 × 76 cm' },
    'halo-lamp': { name: 'Halo floor lamp', cat: 'lighting', rating: 4.8, reviews: 37, desc: 'Powder-coated steel with an adjustable head. Warm, focused reading light.',
      variants: [{ label: 'Graphite', c: '#5a5d60', img: 'images/p-lamp.jpg', price: 690 }], meta: 'H 160 cm' },
    'linnea-chair': { name: 'Linnea dining chair', cat: 'chairs', rating: 4.7, reviews: 52, desc: 'Upholstered wingback dining chair on solid ash legs.',
      variants: [{ label: 'Pebble', c: '#9b9a97', img: 'images/p-chair-grey.jpg', price: 690 }], meta: '52 × 58 × 92 cm' },
    /* Shop-the-room pieces */
    'teak-table': { name: 'Block coffee table', cat: 'tables', rating: 4.8, reviews: 31, desc: 'Reclaimed teak, oiled by hand. Every top is unique.',
      variants: [{ label: 'Reclaimed teak', c: '#8a5a3c', img: 'images/r-table.jpg', price: 1890 }], meta: '120 × 60 × 40 cm' },
    'saddle-pouf': { name: 'Saddle leather pouf', cat: 'chairs', rating: 4.9, reviews: 44, desc: 'Hand-stitched vegetable-tanned leather. Softens beautifully with age.',
      variants: [{ label: 'Cognac', c: '#9a5f37', img: 'images/r-pouf.jpg', price: 490 }], meta: '45 × 45 × 42 cm' },
    'arc-lamp': { name: 'Arc floor lamp', cat: 'lighting', badge: 'New', rating: 4.8, reviews: 15, desc: 'A brushed-brass arc that lights a sofa without a ceiling point.',
      variants: [{ label: 'Brushed brass', c: '#b8954a', img: 'images/r-lamp.jpg', price: 890 }], meta: 'H 195 cm · reach 160 cm' },
    'ranch-chair': { name: 'Ranch lounge chair', cat: 'chairs', rating: 4.7, reviews: 12, desc: 'Black steel frame with a slung saddle-leather seat.',
      variants: [{ label: 'Cognac & black', c: '#7a4a2c', img: 'images/r-chair.jpg', price: 2190 }], meta: '72 × 80 × 74 cm' },
    'oro-stool': { name: 'Oro bar stool', cat: 'chairs', rating: 4.6, reviews: 18, desc: 'Moulded seat on solid beech legs with a steel footrest.',
      variants: [{ label: 'Black', c: '#151515', img: 'images/p-stool.jpg', price: 590 }], meta: 'Seat H 75 cm' }
  };
  const FEATURED = ['coast-sofa', 'nook-chair', 'wren-sideboard', 'halo-lamp', 'mara-sofa', 'cloud-armchair', 'sato-console', 'linnea-chair'];
  const ROOM = ['mara-sofa', 'teak-table', 'saddle-pouf', 'arc-lamp', 'ranch-chair'];
  const ROOM_DISCOUNT = 0.05;
  const priceOf = (id, v = 0) => P[id].variants[v].price;

  /* ---------------- Toast ---------------- */
  const toastEl = $('[data-toast]');
  let toastT;
  function toast(msg) {
    toastEl.innerHTML = '<svg><use href="#i-check"/></svg><span></span>';
    toastEl.querySelector('span').textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
  }

  /* ---------------- Panels (drawers, modals, search) ---------------- */
  const scrim = $('[data-scrim]');
  let openPanel = null, lastFocus = null;
  function open(name) {
    const el = $(`[data-panel="${name}"]`);
    if (!el) return;
    if (openPanel) close(true);
    lastFocus = document.activeElement;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    scrim.classList.add('is-on');
    document.body.style.overflow = 'hidden';
    openPanel = el;
    if (name === 'cart') renderCart();
    if (name === 'swatches') renderSwatchPick();
    setTimeout(() => {
      const f = el.querySelector('[data-search-input]') || el.querySelector('button, a, input');
      f && f.focus({ preventScroll: true });
    }, 60);
  }
  function close(silent) {
    if (!openPanel) return;
    openPanel.classList.remove('is-open');
    openPanel.setAttribute('aria-hidden', 'true');
    openPanel = null;
    scrim.classList.remove('is-on');
    document.body.style.overflow = '';
    if (!silent && lastFocus) lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); open(o.dataset.open); return; }
    if (e.target.closest('[data-close]')) { close(); return; }
    if (e.target.closest('[data-close-link]')) { close(true); }
    if (e.target.classList.contains('modal')) close();
  });
  scrim.addEventListener('click', () => close());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); closeNote(); } });

  /* ---------------- Announcement rotation ---------------- */
  const ann = $$('[data-announce] p');
  let ai = 0;
  if (ann.length > 1) setInterval(() => { ann[ai].classList.remove('is-active'); ai = (ai + 1) % ann.length; ann[ai].classList.add('is-active'); }, 4200);

  /* ---------------- Header state ---------------- */
  const header = $('[data-header]');
  const wa = $('.wa-float');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Wishlist ---------------- */
  let wish = store.get('hd-wish', []);
  const wishCount = $('[data-wish-count]');
  function syncWish() {
    wishCount.textContent = wish.length;
    wishCount.hidden = !wish.length;
    $$('[data-wish]').forEach(b => {
      const on = wish.includes(b.dataset.wish);
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on);
    });
  }
  function toggleWish(id) {
    wish = wish.includes(id) ? wish.filter(x => x !== id) : [...wish, id];
    store.set('hd-wish', wish);
    syncWish();
    toast(wish.includes(id) ? `Saved ${P[id].name} to your wishlist` : 'Removed from wishlist');
  }
  $('[data-wish-count-btn]').addEventListener('click', () => toast(wish.length ? `${wish.length} saved — wishlist page comes in the next phase` : 'Tap the heart on any piece to save it'));

  /* ---------------- Cart ---------------- */
  let cart = store.get('hd-cart', []);
  const cartCount = $('[data-cart-count]');
  function saveCart() { store.set('hd-cart', cart); syncCartCount(); }
  function syncCartCount(bump) {
    const n = cart.reduce((a, i) => a + i.qty, 0);
    cartCount.textContent = n;
    cartCount.hidden = !n;
    if (bump) { cartCount.classList.remove('bump'); void cartCount.offsetWidth; cartCount.classList.add('bump'); }
  }
  function addToCart(id, v = 0, qty = 1, opts = {}) {
    const key = id + ':' + v + (opts.size ? ':' + opts.size : '');
    const ex = cart.find(i => i.key === key);
    if (ex) ex.qty += qty; else cart.push({ key, id, v, qty, size: opts.size || '' });
    saveCart();
    syncCartCount(true);
    if (!opts.silent) { open('cart'); }
  }
  function roomDiscount() {
    const sets = Math.min(...ROOM.map(id => cart.filter(i => i.id === id).reduce((a, i) => a + i.qty, 0)));
    if (!sets) return 0;
    return Math.round(ROOM.reduce((a, id) => a + priceOf(id), 0) * ROOM_DISCOUNT * sets);
  }
  function renderCart() {
    const box = $('[data-cart-items]');
    const foot = $('[data-cart-foot]');
    const up = $('[data-cart-upsell]');
    const n = cart.reduce((a, i) => a + i.qty, 0);
    $('[data-cart-label]').textContent = n ? `(${n})` : '';
    if (!cart.length) {
      box.innerHTML = `<div class="cart__empty"><p class="h3" style="color:var(--black)">Your cart is empty</p><p>Start with the pieces people choose first.</p><a href="#bestsellers" class="btn btn--dark" data-close-link>Shop bestsellers</a></div>`;
      foot.hidden = true; up.innerHTML = '';
      return;
    }
    foot.hidden = false;
    box.innerHTML = cart.map((i, idx) => {
      const p = P[i.id], va = p.variants[i.v];
      return `<div class="cart-item">
        <img src="${va.img}" alt="">
        <div><strong>${p.name}</strong><span class="muted">${va.label}${i.size ? ' · ' + i.size : ''}</span>
          <div class="qty"><button aria-label="Decrease" data-q="${idx}" data-d="-1"><svg><use href="#i-minus"/></svg></button><span>${i.qty}</span><button aria-label="Increase" data-q="${idx}" data-d="1"><svg><use href="#i-plus"/></svg></button></div>
        </div>
        <div><div class="cart-item__price">${aed(va.price * i.qty)}</div><button class="cart-item__remove" data-rm="${idx}">Remove</button></div>
      </div>`;
    }).join('');
    const sub = cart.reduce((a, i) => a + P[i.id].variants[i.v].price * i.qty, 0);
    const disc = roomDiscount();
    const total = sub - disc;
    $('[data-cart-subtotal]').innerHTML = disc ? `<s class="muted" style="font-weight:400;margin-right:8px">${aed(sub)}</s>${aed(total)}` : aed(total);
    $('[data-cart-tabby]').textContent = tabby(total);
    if (disc) box.insertAdjacentHTML('beforeend', `<div class="cart__row small" style="padding:14px 0"><span>Shop-the-room saving (5%)</span><strong>−${aed(disc)}</strong></div>`);
    const sug = ['halo-lamp', 'saddle-pouf', 'sato-console'].find(id => !cart.some(i => i.id === id));
    up.innerHTML = sug ? `<p class="eyebrow">Complete the room</p><div class="upsell"><img src="${P[sug].variants[0].img}" alt=""><div><strong>${P[sug].name}</strong><span>${aed(priceOf(sug))}</span></div><button class="btn btn--line btn--sm" data-upsell="${sug}">Add</button></div>` : '';
  }
  $('[data-panel="cart"]').addEventListener('click', e => {
    const q = e.target.closest('[data-q]');
    const rm = e.target.closest('[data-rm]');
    const us = e.target.closest('[data-upsell]');
    if (q) { const i = cart[+q.dataset.q]; i.qty += +q.dataset.d; if (i.qty < 1) cart.splice(+q.dataset.q, 1); saveCart(); renderCart(); }
    if (rm) { cart.splice(+rm.dataset.rm, 1); saveCart(); renderCart(); }
    if (us) { addToCart(us.dataset.upsell, 0, 1, { silent: true }); renderCart(); toast(`${P[us.dataset.upsell].name} added`); }
  });
  $('[data-checkout]').addEventListener('click', () => toast('In Shopify this opens checkout with Apple Pay, cards, tabby & tamara'));
  syncCartCount();

  /* ---------------- Product grid ---------------- */
  const grid = $('[data-products]');
  const stars = '<svg><use href="#i-star"/></svg>';
  function card(id) {
    const p = P[id], v = p.variants[0];
    const sw = p.variants.length > 1 ? `<div class="card__swatches" role="group" aria-label="Colours">${p.variants.map((x, i) => `<button type="button" style="--c:${x.c}" aria-label="${x.label}" aria-pressed="${i === 0}" data-sw="${i}"></button>`).join('')}</div>` : `<span class="card__meta">${v.label}</span>`;
    return `<article class="card" data-id="${id}" data-cat="${p.cat}" data-reveal>
      <div class="card__media" data-quick="${id}">
        <img src="${v.img}" alt="${p.name} in ${v.label}" loading="lazy" width="900" height="900">
        ${p.badge ? `<span class="card__badge ${p.dark ? 'card__badge--dark' : ''}">${p.badge}</span>` : ''}
        <button class="icon-btn card__wish" type="button" aria-label="Save ${p.name}" aria-pressed="false" data-wish="${id}"><svg><use href="#i-heart"/></svg></button>
        <button class="card__quick" type="button" data-quick="${id}">Quick view</button>
      </div>
      <div class="card__info">
        <div class="card__top"><h3 class="card__name"><button type="button" data-quick="${id}">${p.name}</button></h3><span class="card__price" data-price>${aed(v.price)}</span></div>
        <span class="card__tabby">or 4 × <b data-tabby>${tabby(v.price)}</b> with tabby</span>
        <div class="card__row">${sw}<span class="card__rating">${stars}${p.rating}<span>(${p.reviews})</span></span></div>
        <button class="card__add" type="button" data-add="${id}">Add to cart</button>
      </div>
    </article>`;
  }
  function renderGrid(filter = 'all') {
    const ids = filter === 'all' ? FEATURED : Object.keys(P).filter(id => P[id].cat === filter);
    grid.innerHTML = ids.slice(0, 8).map(card).join('');
    syncWish();
    if (window.gsap && !reduce) gsap.fromTo(grid.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, stagger: .06, ease: 'power3.out' });
    else $$('[data-reveal]', grid).forEach(el => el.removeAttribute('data-reveal'));
  }
  renderGrid();
  function setFilter(f) {
    $$('.tabs [data-filter]').forEach(b => b.setAttribute('aria-selected', b.dataset.filter === f));
    renderGrid(f);
  }
  $$('.tabs [data-filter]').forEach(b => b.addEventListener('click', () => setFilter(b.dataset.filter)));
  document.addEventListener('click', e => {
    const fl = e.target.closest('[data-filter-link]');
    if (fl) setFilter(fl.dataset.filterLink);
  });
  grid.addEventListener('click', e => {
    const sw = e.target.closest('[data-sw]');
    if (sw) {
      const c = sw.closest('.card'), id = c.dataset.id, v = P[id].variants[+sw.dataset.sw];
      $$('[data-sw]', c).forEach(b => b.setAttribute('aria-pressed', b === sw));
      const img = $('img', c);
      img.style.opacity = 0;
      setTimeout(() => { img.src = v.img; img.alt = `${P[id].name} in ${v.label}`; img.style.opacity = 1; }, 180);
      $('[data-price]', c).textContent = aed(v.price);
      $('[data-tabby]', c).textContent = tabby(v.price);
      c.dataset.v = sw.dataset.sw;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) { addToCart(add.dataset.add, +(add.closest('.card').dataset.v || 0)); return; }
  });
  document.addEventListener('click', e => {
    const w = e.target.closest('[data-wish]');
    if (w) { e.preventDefault(); e.stopPropagation(); toggleWish(w.dataset.wish); return; }
    const q = e.target.closest('[data-quick]');
    if (q) { e.preventDefault(); const c = q.closest('.card'); quickView(q.dataset.quick, c ? +(c.dataset.v || 0) : 0); }
  });

  /* ---------------- Quick view (preview of the PDP) ---------------- */
  function deliveryDate(days) {
    const d = new Date(); d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  }
  function quickView(id, v = 0) {
    const p = P[id];
    const body = $('[data-quick-body]');
    const state = { v, size: p.sizes ? p.sizes[1] || p.sizes[0] : '', qty: 1 };
    const draw = () => {
      const va = p.variants[state.v];
      body.innerHTML = `<button class="icon-btn modal__close" data-close aria-label="Close"><svg><use href="#i-close"/></svg></button>
      <div class="qv">
        <div class="qv__media"><img src="${va.img}" alt="${p.name} in ${va.label}"></div>
        <div class="qv__body">
          <span class="card__rating">${stars.repeat(5)} ${p.rating} · ${p.reviews} reviews</span>
          <h3>${p.name}</h3>
          <p class="qv__price">${aed(va.price)}</p>
          <div class="qv__tabby"><span class="pill-tabby">tabby</span><span class="pill-tamara">tamara</span>4 interest-free payments of <b style="color:var(--black)">${tabby(va.price)}</b></div>
          <p class="muted">${p.desc}</p>
          ${p.variants.length > 1 ? `<fieldset class="qv__opt"><legend>Colour — <span style="font-weight:400">${va.label}</span></legend><div class="card__swatches">${p.variants.map((x, i) => `<button type="button" style="--c:${x.c};width:32px;height:32px" aria-label="${x.label}" aria-pressed="${i === state.v}" data-qv-v="${i}"></button>`).join('')}</div></fieldset>` : `<p class="small"><b>Finish:</b> ${va.label}</p>`}
          ${p.sizes ? `<fieldset class="qv__opt"><legend>Size</legend><div class="chips chips--sm">${p.sizes.map(s => `<label><input type="radio" name="qv-size" value="${s}" ${s === state.size ? 'checked' : ''} data-qv-size><span>${s}</span></label>`).join('')}</div></fieldset>` : ''}
          <p class="small muted">Dimensions: ${p.meta}</p>
          <span class="qv__stock">In stock · delivered &amp; assembled by <b>&nbsp;${deliveryDate(7)}</b></span>
          <div class="qv__actions"><button class="btn btn--dark" data-qv-add>Add to cart · ${aed(va.price)}</button><button class="icon-btn" style="border:1px solid var(--mist);border-radius:4px;width:52px;height:52px" data-wish="${id}" aria-label="Save"><svg><use href="#i-heart"/></svg></button></div>
          <ul class="qv__perks">
            <li><svg><use href="#i-truck"/></svg>Free delivery &amp; assembly, packaging removed</li>
            <li><svg><use href="#i-shield"/></svg>5-year frame guarantee · 30-day returns</li>
            <li><svg><use href="#i-swatch"/></svg><button type="button" class="btn--ghost" style="all:unset;cursor:pointer;text-decoration:underline;text-underline-offset:3px" data-open="swatches">Order free fabric swatches</button></li>
          </ul>
        </div>
      </div>`;
      syncWish();
    };
    draw();
    body.onclick = e => {
      const b = e.target.closest('[data-qv-v]');
      if (b) { state.v = +b.dataset.qvV; draw(); }
      if (e.target.closest('[data-qv-add]')) { close(true); addToCart(id, state.v, 1, { size: state.size }); }
    };
    body.onchange = e => { if (e.target.matches('[data-qv-size]')) state.size = e.target.value; };
    open('quick');
  }

  /* ---------------- Shop the room ---------------- */
  const list = $('[data-room-list]');
  const roomTotal = ROOM.reduce((a, id) => a + priceOf(id), 0);
  const roomNet = roomTotal - Math.round(roomTotal * ROOM_DISCOUNT);
  list.innerHTML = ROOM.map(id => `<li data-room-item="${id}"><img src="${P[id].variants[0].img}" alt="" loading="lazy"><div><strong>${P[id].name}</strong><span>${P[id].variants[0].label}</span></div><span class="p">${aed(priceOf(id))}</span></li>`).join('');
  $('[data-room-was]').textContent = aed(roomTotal);
  $('[data-room-total]').textContent = aed(roomNet);
  $('[data-room-tabby]').textContent = tabby(roomNet);
  const fig = $('.shop-room__fig');
  const spotCard = $('[data-spot-card]');
  function showSpot(id) {
    const spot = $(`[data-spot="${id}"]`);
    $$('[data-spot]').forEach(s => s.classList.toggle('is-active', s === spot));
    $$('[data-room-item]').forEach(li => li.classList.toggle('is-active', li.dataset.roomItem === id));
    const p = P[id];
    spotCard.innerHTML = `<img src="${p.variants[0].img}" alt=""><div><strong>${p.name}</strong><span>${aed(priceOf(id))} · or 4 × ${tabby(priceOf(id))}</span></div><button class="btn btn--dark btn--sm btn--block" data-add-one="${id}">Add to cart</button>`;
    spotCard.hidden = false;
    const fr = fig.getBoundingClientRect(), sr = spot.getBoundingClientRect();
    const w = spotCard.offsetWidth, h = spotCard.offsetHeight;
    let x = sr.left - fr.left + 30, y = sr.top - fr.top - h / 2 + 22;
    if (x + w > fr.width - 12) x = sr.left - fr.left - w - 8;
    y = Math.max(12, Math.min(y, fr.height - h - 12));
    spotCard.style.left = Math.max(12, x) + 'px';
    spotCard.style.top = y + 'px';
  }
  fig.addEventListener('click', e => {
    const s = e.target.closest('[data-spot]');
    const a = e.target.closest('[data-add-one]');
    if (a) { addToCart(a.dataset.addOne, 0, 1, { silent: true }); toast(`${P[a.dataset.addOne].name} added to cart`); return; }
    if (s) { showSpot(s.dataset.spot); return; }
    if (!e.target.closest('[data-spot-card]')) { spotCard.hidden = true; $$('[data-spot]').forEach(x => x.classList.remove('is-active')); $$('[data-room-item]').forEach(x => x.classList.remove('is-active')); }
  });
  list.addEventListener('click', e => { const li = e.target.closest('[data-room-item]'); if (li) showSpot(li.dataset.roomItem); });
  $('[data-add-room]').addEventListener('click', () => { ROOM.forEach(id => addToCart(id, 0, 1, { silent: true })); open('cart'); });

  /* ---------------- Tailor-made builder ---------------- */
  const builder = $('[data-builder]');
  function build() {
    const f = new FormData(builder);
    const m = $('input[name=model]:checked', builder), s = $('input[name=size]:checked', builder), fab = $('input[name=fabric]:checked', builder);
    const price = Math.round((+m.dataset.base * +s.dataset.mult + +fab.dataset.add) / 10) * 10;
    $('[data-build-price]').textContent = (s.value === 'Custom' ? 'From ' : '') + aed(price);
    $('[data-build-sum]').textContent = `${m.value} ${m.value === 'Dune' ? 'bed' : 'sofa'} · ${s.value} · ${fab.value} · made in 6–8 weeks`;
    $('[data-fabric-name]').textContent = '— ' + fab.value;
    const chip = $('[data-fabric-chip]');
    chip.textContent = fab.value;
    chip.style.setProperty('--c', getComputedStyle(fab.parentElement).getPropertyValue('--c'));
    builder.dataset.summary = `${m.value} · ${s.value} · ${fab.value} (${aed(price)})`;
    return f;
  }
  builder.addEventListener('change', build);
  build();
  $('[data-build-cta]').addEventListener('click', () => {
    const chk = $$('input[name=room]');
    const model = $('input[name=model]:checked', builder).value;
    chk.forEach(c => { if ((model === 'Dune' && c.value === 'Bedroom') || (model !== 'Dune' && c.value === 'Living')) c.checked = true; });
    setTimeout(() => $('#v-name').focus({ preventScroll: true }), 700);
    toast('Design saved — a stylist will bring these samples');
  });

  /* ---------------- Home visit form ---------------- */
  const vf = $('[data-visit-form]');
  const dateIn = $('[data-min-today]');
  const t = new Date(); t.setDate(t.getDate() + 1);
  dateIn.min = t.toISOString().slice(0, 10);
  vf.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('input[required], select[required]', vf).forEach(i => {
      const bad = !i.value || (i.type === 'tel' && i.value.replace(/\D/g, '').length < 8);
      i.closest('.field').classList.toggle('is-error', bad);
      if (bad && ok) { i.focus(); ok = false; }
    });
    if (!ok) { toast('Please complete the highlighted fields'); return; }
    const name = $('#v-name').value.split(' ')[0];
    const d = new Date($('#v-date').value).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    $('[data-visit-msg]').textContent = `Thanks ${name} — we'll confirm a time on ${d} by WhatsApp within 2 hours.${builder.dataset.summary ? ' We\'ll bring samples for: ' + builder.dataset.summary + '.' : ''}`;
    $('[data-visit-success]').hidden = false;
    $('[data-visit-success]').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  });
  vf.addEventListener('input', e => { const f = e.target.closest('.field'); f && f.classList.remove('is-error'); });

  /* ---------------- Launch list ---------------- */
  $('[data-launch-form]').addEventListener('submit', e => {
    e.preventDefault();
    const em = $('#l-email');
    const msg = $('[data-launch-msg]');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) { msg.textContent = 'Please enter a valid email address.'; em.focus(); return; }
    msg.textContent = 'You’re on the list. Your AED 250 code arrives in January.';
    em.value = '';
  });

  /* ---------------- Swatches ---------------- */
  const FABRICS = [['Oat linen', '#E7E0D4'], ['Mist bouclé', '#CFC8BC'], ['Stone weave', '#9A9286'], ['Olive velvet', '#6B6A5E'], ['Forest velvet', '#2f5a4a'], ['Sky bouclé', '#86A6C9'], ['Cognac leather', '#8A5A3C'], ['Charcoal weave', '#2C2B29']];
  let picked = [];
  function renderSwatchPick() {
    $('[data-swatch-pick]').innerHTML = FABRICS.map(([n, c]) => `<button type="button" aria-pressed="${picked.includes(n)}" data-fab="${n}"><i style="--c:${c}"></i>${n}</button>`).join('');
    $('[data-swatch-submit]').textContent = `Send my swatches (${picked.length}/6)`;
  }
  $('[data-swatch-pick]').addEventListener('click', e => {
    const b = e.target.closest('[data-fab]'); if (!b) return;
    const n = b.dataset.fab;
    if (picked.includes(n)) picked = picked.filter(x => x !== n);
    else if (picked.length < 6) picked.push(n);
    else toast('Up to 6 swatches per order');
    renderSwatchPick();
  });
  $('[data-swatch-form]').addEventListener('submit', e => {
    e.preventDefault();
    if (!picked.length) { toast('Pick at least one fabric'); return; }
    close(); toast(`${picked.length} swatch${picked.length > 1 ? 'es' : ''} on the way — arriving in 2–3 days`);
    picked = []; e.target.reset();
  });

  /* ---------------- Search ---------------- */
  const sIn = $('[data-search-input]'), sOut = $('[data-search-results]');
  function search(q) {
    q = q.trim().toLowerCase();
    if (!q) { sOut.innerHTML = ''; return; }
    const hits = Object.keys(P).filter(id => (P[id].name + ' ' + P[id].cat + ' ' + P[id].desc + ' ' + P[id].variants.map(v => v.label).join(' ')).toLowerCase().includes(q.replace(/s$/, '')));
    sOut.innerHTML = hits.length ? hits.map(id => `<button type="button" data-quick="${id}"><img src="${P[id].variants[0].img}" alt=""><span><strong>${P[id].name}</strong><span>${aed(priceOf(id))}</span></span></button>`).join('') : `<p class="muted">No matches for “${q}”. Try sofa, oak or lamp — or <a href="https://wa.me/971500000000" target="_blank" rel="noopener">ask us on WhatsApp</a>.</p>`;
  }
  sIn.addEventListener('input', () => search(sIn.value));
  $$('[data-q]', $('.search')).forEach(b => b.addEventListener('click', () => { sIn.value = b.dataset.q; search(b.dataset.q); sIn.focus(); }));

  /* ---------------- Design notes ---------------- */
  const NOTES = {
    1: ['Hero: lead with the promise, not the logo', `<p>Visitors decide in about 3 seconds whether a store is "for them". The headline states the brand's positioning in plain words — <b>the designer look, at a fair price</b> — so the value is understood before anyone scrolls.</p><ul><li>Magazine-style split layout: calm, editorial, lots of white (the brand guide's "white leads").</li><li>Two CTAs: <b>Shop</b> for ready buyers, <b>Book a free home visit</b> for high-consideration buyers. Furniture has both.</li><li>A shoppable tag on the photo turns inspiration into a product in one tap.</li><li>Trust row (rating, free delivery, 0% instalments) answers the three biggest objections — quality, hassle, cost — above the fold.</li></ul><span class="tag">Clarity</span><span class="tag">Trust above the fold</span>`],
    2: ['Promise bar: remove risk early', `<p>Buying a AED 4,000 sofa online feels risky. These four promises remove the risk before a product is even shown — the most effective trust signals in furniture e-commerce.</p><ul><li>Free delivery <i>and</i> assembly — the #1 hidden cost people worry about.</li><li>tabby / tamara named explicitly: in the UAE, BNPL visibility raises conversion on high-ticket baskets.</li><li>Returns + 5-year frame guarantee signal confidence in quality.</li></ul><p><b>Client to confirm:</b> exact return window, guarantee length and delivery times.</p>`],
    3: ['Shop by room: help people self-sort', `<p>Most furniture shoppers start with a room, not a product type. Big, photographic room tiles let them jump straight to what they're furnishing — fewer clicks, less thinking.</p><ul><li>Portrait images feel like magazine pages and work as a swipeable rail on mobile.</li><li>Piece counts set expectations and suggest a full range.</li></ul>`],
    4: ['Bestsellers: social proof + fast path to cart', `<p>"Most loved" uses the bandwagon effect: new visitors trust what others chose. Filters keep it to one tidy grid instead of four separate sliders.</p><ul><li>Each card shows price <b>and</b> the 4-payment price — AED 1,072.50 feels very different to AED 4,290.</li><li>Colour swatches switch the photo instantly (as on the real product page).</li><li>Quick view and Add to cart skip a page load; wishlist saves intent for later.</li><li>Ratings on every card keep proof visible while browsing.</li></ul>`],
    5: ['Fair price: answer "why is it cheaper?"', `<p>"Affordable luxury" creates a natural doubt: <i>if it's cheaper, is it worse?</i> This section answers it with a simple, honest comparison — where the money goes — instead of vague claims (exactly what the brand guide asks: "avoid empty claims").</p><ul><li>Visual price bars make the saving obvious in a glance.</li><li>Ticks repeat the quality cues: frame, foam, fabric.</li></ul><p><b>Client to confirm:</b> comparison numbers should be based on real benchmarks before launch.</p>`],
    6: ['Shop the room: raise basket size', `<p>Furniture is bought as a look, not as single items. A styled room with tap-to-shop hotspots lets people buy the whole picture they fell for.</p><ul><li>"Add the whole room · save 5%" is a bundle incentive that lifts average order value.</li><li>Showing the room total with the 4-payment price keeps the big number approachable.</li></ul><span class="tag">AOV</span><span class="tag">Inspiration → purchase</span>`],
    7: ['Considered details: prove quality you can’t touch', `<p>Online, people can't sit on the sofa. So we show and explain what they can't see: frame, foam, covers, fabric — the guide's "useful details and honest product information".</p><ul><li>Each detail ties to a real-life benefit (UAE air-con, kids, coffee).</li><li><b>Free swatches</b> is one of the strongest furniture conversion tools: it turns "not sure" into a small, free first step and starts a relationship.</li></ul>`],
    8: ['Tailor-made: an instant price, not "contact us"', `<p>The brief asks for a tailor-made page. Instead of a vague enquiry form, the mini builder gives an <b>instant estimate</b> as people choose design, size and fabric — engagement and price transparency build commitment.</p><ul><li>"Request this design" carries the choices into the home-visit form, so the lead arrives with context.</li><li>On the full site this becomes its own page, with the same builder.</li></ul>`],
    9: ['Reviews: real people, real homes', `<p>Placed after the product story, reviews confirm what we just claimed. Photos of customers' homes are more convincing than studio shots.</p><ul><li>Each review answers an objection: quality ("looks twice the price"), fit ("home visit sold me"), practicality ("washable covers").</li><li>Rating summary + "verified" badges add credibility.</li></ul><p><b>Note:</b> reviews are sample content for the concept. At launch we connect a review app (e.g. Judge.me / Okendo) and can seed with pre-launch customers.</p>`],
    10: ['Free home visit: the high-ticket closer', `<p>For bigger purchases many people won't buy on a first visit. A free, no-obligation home visit captures these buyers as qualified leads instead of losing them.</p><ul><li>Short form: only what's needed to call back (name, mobile with +971, Emirate, date).</li><li>WhatsApp alternative for people who prefer chat — the default in the UAE.</li><li>Clear outcome: "room plan and quote within 48 hours".</li></ul><span class="tag">Lead capture</span>`],
    11: ['Our story: the people behind the brand', `<p>The brief asks for "real people behind the brand". A short founder note with faces makes a new brand feel accountable and human — vital trust for a brand launching in January 2027 with no history yet.</p><ul><li>Simple numbers (makers, fabrics, Emirates) make claims concrete.</li><li>Studio address shows there is a physical place behind the website.</li></ul><p><b>Client to supply:</b> founder photo, real story and studio details.</p>`],
    12: ['Community: shoppable inspiration', `<p>Customer photos show the furniture in real UAE homes and give people a reason to follow on Instagram. Each tile links to the products in it ("Shop this look").</p>`],
    13: ['FAQ: answer objections before they become exits', `<p>Delivery, assembly, instalments, returns and guarantee are the questions that stop a purchase. Answering them on the home page prevents people from leaving to "check later".</p><ul><li>WhatsApp next to the FAQ: a real person, fast — the "warm and personal" tone the brief asks for.</li></ul>`],
    14: ['Launch list: convert visitors before launch', `<p>The brand launches in January 2027. Until then, every visitor is a potential first customer. An early-access list with a clear incentive (AED 250 off) builds a launch audience — the single biggest driver of day-one sales.</p><ul><li>After launch this becomes a newsletter with a first-order offer.</li></ul>`]
  };
  const notesBtn = $('[data-notes-toggle]');
  const notesPanel = $('[data-notes-panel]');
  let curNote = 1;
  $$('[data-note]').forEach(sec => {
    const n = sec.dataset.note;
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'note-pin';
    pin.innerHTML = `<b>${n}</b>${NOTES[n][0].split(':')[0]}`;
    pin.addEventListener('click', () => showNote(+n));
    sec.prepend(pin);
  });
  function showNote(n) {
    curNote = n;
    $('[data-note-num]').textContent = `${n} / ${Object.keys(NOTES).length}`;
    $('[data-note-title]').textContent = NOTES[n][0];
    $('[data-note-body]').innerHTML = NOTES[n][1];
    notesPanel.classList.add('is-open');
    notesPanel.setAttribute('aria-hidden', 'false');
  }
  function closeNote() { notesPanel.classList.remove('is-open'); notesPanel.setAttribute('aria-hidden', 'true'); }
  function setNotes(on) {
    document.body.classList.toggle('notes-on', on);
    notesBtn.setAttribute('aria-pressed', on);
    if (on) showNote(curNote); else closeNote();
  }
  notesBtn.addEventListener('click', () => setNotes(!document.body.classList.contains('notes-on')));
  $('[data-notes-close]').addEventListener('click', closeNote);
  const goNote = n => { const max = Object.keys(NOTES).length; n = ((n - 1 + max) % max) + 1; showNote(n); const s = $(`[data-note="${n}"]`); s && s.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); };
  $('[data-note-prev]').addEventListener('click', () => goNote(curNote - 1));
  $('[data-note-next]').addEventListener('click', () => goNote(curNote + 1));
  if (/[?&]notes=1/.test(location.search)) setNotes(true);

  /* ---------------- Motion (GSAP) ---------------- */
  function countUp(el) {
    const end = +el.dataset.count; const o = { v: 0 };
    if (!window.gsap || reduce) { el.textContent = end; return; }
    gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v); } });
  }
  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger || reduce) return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero title word reveal
    const title = $('[data-split]');
    title.innerHTML = title.innerHTML.split(/(\s|&nbsp;)/).map(w => (w.trim() && w !== '&nbsp;') ? `<span class="w"><span>${w}</span></span>` : w).join('');
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('[data-hero-img]', { scale: 1.14, duration: 2.2, ease: 'power3.out' }, 0)
      .from('.hero__media', { clipPath: 'inset(0 0 0 100%)', duration: 1.4, ease: 'expo.inOut' }, 0)
      .from('.hero .folio', { opacity: 0, y: 12, duration: .8 }, .3)
      .from('.hero__title .w > span', { yPercent: 110, duration: 1.1, stagger: .06 }, .35)
      .from(['.hero__lede', '.hero__ctas', '.hero__proof'], { opacity: 0, y: 20, duration: .9, stagger: .1 }, .8)
      .from('.hero__tag', { opacity: 0, y: 16, duration: .8 }, 1.3);

    // Section reveals
    const groups = ['.sec-head', '.promise__list li', '.room', '.fair__copy > *', '.fair__compare', '.room-list', '.details__copy > *', '.tailor__copy > *', '.review', '.visit__copy > *', '.story__copy > *', '.ugc__item', '.faq__grid > div:first-child > *', '.faq__list details', '.launch__inner > *', '.footer__grid > *'];
    groups.forEach(sel => $$(sel).forEach(el => el.setAttribute('data-reveal', '')));
    ScrollTrigger.batch('[data-reveal]:not(.card)', {
      start: 'top 88%',
      onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out', overwrite: true })
    });
    // Product cards initial render reveal
    ScrollTrigger.create({ trigger: grid, start: 'top 85%', once: true, onEnter: () => gsap.to(grid.children, { opacity: 1, y: 0, duration: .8, stagger: .07, ease: 'power3.out' }) });

    // Parallax images
    $$('[data-parallax]').forEach(img => {
      gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // Price bars
    $$('[data-bar]').forEach((b, i) => gsap.from(b, { scaleX: 0, duration: 1.3, delay: i * .25, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 85%' } }));
    // Story collage float
    gsap.to('.story__collage .c2', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.story', scrub: true } });
    gsap.to('.story__collage .c3', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.story', scrub: true } });
  }

  // Counters (with or without GSAP)
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { countUp(en.target); io.unobserve(en.target); } }), { threshold: .6 }) : null;
  $$('[data-count]').forEach(el => io ? io.observe(el) : null);

  // Hide WhatsApp button while the footer or a form is in view on small screens (keeps tap targets clear)
  if (io) {
    const io2 = new IntersectionObserver(es => es.forEach(en => wa.classList.toggle('is-hidden', en.isIntersecting && window.innerWidth < 680)), { threshold: .2 });
    io2.observe($('.footer__bottom'));
  }

  if (document.readyState === 'complete') initMotion();
  else window.addEventListener('load', initMotion);
})();
