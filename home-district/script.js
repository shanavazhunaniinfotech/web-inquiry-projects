/* Home District — home page concept v2 */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const aed = n => 'AED ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const q4 = n => aed(Math.round((n / 4) * 100) / 100);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const isDesk = () => window.innerWidth > 760;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const hasGsap = () => !!(window.gsap && window.ScrollTrigger);
  const B = document.documentElement.dataset.base || '';
  const PDP = document.documentElement.dataset.pdp || 'product/';

  /* ======================= DATA (placeholders until the range is final) ======================= */
  const P = {
    'coast-sofa': { name: 'Coast 3-seater sofa', cat: 'sofas', badge: 'Bestseller', rating: 4.9, reviews: 86, meta: '220 × 95 × 78 cm', mat: 'Kiln-dried oak frame',
      desc: 'A deep seat, a relaxed back and the space to settle in. Feather-wrapped cushions and zip-off, washable covers.',
      variants: [
        { label: 'Forest velvet', c: '#2f5a4a', img: B + 'images/p-sofa-green.jpg', price: 4290 },
        { label: 'Charcoal weave', c: '#3a3a3a', img: B + 'images/p-sofa-dark.jpg', price: 4290 },
        { label: 'Cognac leather', c: '#9a5f37', img: B + 'images/p-sofa-tan.jpg', price: 5990 }
      ], alt: B + 'images/v2-tansofa.jpg', sizes: ['180 cm', '220 cm', '260 cm'] },
    'nook-chair': { name: 'Nook lounge chair', cat: 'chairs', badge: 'Bestseller', rating: 4.9, reviews: 64, meta: '78 × 74 × 82 cm', mat: 'Bouclé, solid beech',
      desc: 'A soft, rounded shell on solid beech legs. Small enough for a bedroom corner, comfortable enough for a long read.',
      variants: [{ label: 'Sky bouclé', c: '#86A6C9', img: B + 'images/p-chair-blue.jpg', price: 1890 }, { label: 'Mist bouclé', c: '#d9d6d0', img: B + 'images/v2-anatomy.jpg', price: 1890 }], alt: B + 'images/v2-anatomy.jpg' },
    'orbit-chair': { name: 'Orbit swivel chair', cat: 'chairs', badge: 'New', rating: 4.8, reviews: 22, meta: '62 × 60 × 80 cm', mat: 'Woven fabric, oak base',
      desc: 'A gentle 360° swivel on a four-star oak base. Ideal for a reading corner or a desk.',
      variants: [{ label: 'Pebble', c: '#a59c90', img: B + 'images/pp-swivel.jpg', price: 1290 }], alt: B + 'images/v2-work.jpg' },
    'sato-side': { name: 'Sato side table', cat: 'tables', rating: 4.9, reviews: 28, meta: '45 × 35 × 55 cm', mat: 'Solid oak',
      desc: 'Solid oak with a cantilevered top that slides over the sofa arm, and a shelf for books.',
      variants: [{ label: 'Natural oak', c: '#b89068', img: B + 'images/pp-side.jpg', price: 590 }], alt: B + 'images/p-console.jpg' },
    'dome-pendant': { name: 'Dome pendant', cat: 'lighting', rating: 4.8, reviews: 37, meta: 'Ø 32 cm', mat: 'Brushed brass',
      desc: 'Spun brushed-brass shade with a warm, downward glow. Hang alone or as a cluster over the dining table.',
      variants: [{ label: 'Brushed brass', c: '#b8954a', img: B + 'images/pp-pendant.jpg', price: 490 }], alt: B + 'images/v2-lighting.jpg' },
    'ochre-chair': { name: 'Ochre armchair', cat: 'chairs', rating: 4.7, reviews: 19, meta: '70 × 76 × 88 cm', mat: 'Velvet, turned legs',
      desc: 'Button-tufted back and turned black legs: a warm accent for a calm room.',
      variants: [{ label: 'Ochre velvet', c: '#c49a3c', img: B + 'images/pp-ochre.jpg', price: 1650 }] },
    'mara-sofa': { name: 'Mara modular sofa', cat: 'sofas', badge: 'Made to order', dark: true, rating: 4.8, reviews: 41, meta: '264 × 100 × 72 cm', mat: 'Stone weave, oak plinth',
      desc: 'Low, generous and endlessly re-arrangeable. Start with three modules and add more as your home grows.',
      variants: [{ label: 'Stone weave', c: '#8d8d88', img: B + 'images/pp-mara.jpg', price: 5490 }], alt: B + 'images/r-sofa.jpg', sizes: ['3 modules', '4 modules', 'Corner'] },
    'saddle-chair': { name: 'Saddle desk chair', cat: 'chairs', rating: 4.7, reviews: 15, meta: '60 × 58 × 84 cm', mat: 'Cognac leather',
      desc: 'Channel-stitched cognac leather on a smooth swivel base.',
      variants: [{ label: 'Cognac leather', c: '#8A5A3C', img: B + 'images/pp-saddle.jpg', price: 1390 }] },
    'halo-lamp': { name: 'Halo floor lamp', cat: 'lighting', rating: 4.8, reviews: 31, meta: 'H 160 cm', mat: 'Powder-coated steel',
      desc: 'Adjustable head and a warm, focused reading light.',
      variants: [{ label: 'Graphite', c: '#5a5d60', img: B + 'images/p-lamp.jpg', price: 690 }] },
    'wren-sideboard': { name: 'Wren sideboard', cat: 'tables', rating: 4.8, reviews: 19, meta: '160 × 45 × 75 cm', mat: 'Lacquer & oak',
      desc: 'Matt white lacquer with a solid oak top and soft-close doors.',
      variants: [{ label: 'White & oak', c: '#f3f1ec', img: B + 'images/p-sideboard.jpg', price: 2890 }], alt: B + 'images/v2-storage.jpg' },
    /* Shop-the-room pieces */
    'teak-table': { name: 'Block coffee table', cat: 'tables', rating: 4.8, reviews: 31, meta: '120 × 60 × 40 cm', mat: 'Reclaimed teak', desc: 'Reclaimed teak, oiled by hand. Every top is unique.', variants: [{ label: 'Reclaimed teak', c: '#8a5a3c', img: B + 'images/r-table.jpg', price: 1890 }] },
    'saddle-pouf': { name: 'Saddle leather pouf', cat: 'chairs', rating: 4.9, reviews: 44, meta: '45 × 45 × 42 cm', mat: 'Vegetable-tanned leather', desc: 'Hand-stitched leather that softens beautifully with age.', variants: [{ label: 'Cognac', c: '#9a5f37', img: B + 'images/r-pouf.jpg', price: 490 }] },
    'arc-lamp': { name: 'Arc floor lamp', cat: 'lighting', badge: 'New', rating: 4.8, reviews: 15, meta: 'H 195 cm · reach 160 cm', mat: 'Brushed brass', desc: 'A brushed-brass arc that lights a sofa without a ceiling point.', variants: [{ label: 'Brushed brass', c: '#b8954a', img: B + 'images/r-lamp.jpg', price: 890 }] },
    'ranch-chair': { name: 'Ranch lounge chair', cat: 'chairs', rating: 4.7, reviews: 12, meta: '72 × 80 × 74 cm', mat: 'Steel & saddle leather', desc: 'Black steel frame with a slung saddle-leather seat.', variants: [{ label: 'Cognac & black', c: '#7a4a2c', img: B + 'images/r-chair.jpg', price: 2190 }] }
  };
  P['mara-sofa-room'] = P['mara-sofa'];
  const FEATURED = ['coast-sofa', 'nook-chair', 'orbit-chair', 'sato-side', 'dome-pendant', 'ochre-chair', 'mara-sofa', 'saddle-chair', 'wren-sideboard'];
  const ROOM = ['mara-sofa', 'teak-table', 'saddle-pouf', 'arc-lamp', 'ranch-chair'];
  const ROOM_DISCOUNT = 0.05;
  const priceOf = (id, v = 0) => P[id].variants[v].price;
  let picked = [];
  const stars5 = '<svg><use href="#i-star"/></svg>'.repeat(5);

  /* ======================= LOADER ======================= */
  const loader = $('[data-loader]');
  function finishLoader(cb) {
    const seen = document.documentElement.classList.contains('seen');
    try { sessionStorage.setItem('hd-loaded', '1'); } catch (e) {}
    if (seen || !loader || reduce || !window.gsap) { loader && loader.remove(); cb(); return; }
    const o = { v: 0 }, bar = $('[data-loader-bar]'), cnt = $('[data-loader-count]');
    gsap.timeline({ onComplete: () => { loader.remove(); } })
      .to(o, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { bar.style.transform = `scaleX(${o.v / 100})`; cnt.textContent = Math.round(o.v); } })
      .to('.loader__inner', { opacity: 0, y: -16, duration: .45, ease: 'power2.in' }, '+=.05')
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'expo.inOut', onStart: cb }, '-=.1');
  }

  /* ======================= TOAST ======================= */
  const toastEl = $('[data-toast]');
  let toastT;
  function toast(msg) {
    toastEl.innerHTML = '<svg><use href="#i-check"/></svg><span></span>';
    toastEl.querySelector('span').textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2800);
  }

  /* ======================= PANELS ======================= */
  const scrim = $('[data-scrim]');
  let openPanel = null, lastFocus = null, lenis = null;
  function open(name) {
    const el = $(`[data-panel="${name}"]`);
    if (!el) return;
    if (openPanel) close(true);
    lastFocus = document.activeElement;
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
    scrim.classList.add('is-on');
    document.body.style.overflow = 'hidden';
    lenis && lenis.stop();
    openPanel = el;
    if (name === 'cart') renderCart();
    if (name === 'swatches') renderSwatchPick();
    setTimeout(() => { const f = el.querySelector('[data-search-input]') || el.querySelector('button, a, input'); f && f.focus({ preventScroll: true }); }, 80);
  }
  function close(silent) {
    if (!openPanel) return;
    openPanel.classList.remove('is-open'); openPanel.setAttribute('aria-hidden', 'true');
    openPanel = null;
    scrim.classList.remove('is-on');
    document.body.style.overflow = '';
    lenis && lenis.start();
    if (!silent && lastFocus) lastFocus.focus({ preventScroll: true });
  }
  function goTo(hash) {
    const t = $(hash); if (!t) return;
    if (lenis) lenis.scrollTo(t, { offset: -72, duration: 1.4 }); else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); open(o.dataset.open); return; }
    if (e.target.closest('[data-close]')) { close(); return; }
    const cl = e.target.closest('[data-close-link]');
    if (cl) { close(true); }
    if (e.target.classList.contains('modal')) { close(); return; }
    const a = e.target.closest('a[href^="#"]');
    if (a && a.getAttribute('href').length > 1 && lenis) { e.preventDefault(); goTo(a.getAttribute('href')); }
  });
  scrim.addEventListener('click', () => close());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); closeNote(); } });

  /* ======================= ANNOUNCEMENT / HEADER ======================= */
  const ann = $$('[data-announce] p'); let ai = 0;
  if (ann.length > 1) setInterval(() => { ann[ai].classList.remove('is-active'); ai = (ai + 1) % ann.length; ann[ai].classList.add('is-active'); }, 4200);
  const header = $('[data-header]'), mbar = $('[data-mbar]');
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    header.classList.toggle('is-hidden', y > 900 && y > lastY + 4 && !openPanel);
    if (y < lastY - 4) header.classList.remove('is-hidden');
    const heroEnd = ($('.hero__foot')?.getBoundingClientRect().bottom ?? 0);
    const footerTop = $('.footer__bottom').getBoundingClientRect().top;
    mbar.classList.toggle('is-on', heroEnd < 0 && footerTop > window.innerHeight);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ======================= WISHLIST ======================= */
  let wish = store.get('hd-wish', []);
  const wishCount = $('[data-wish-count]');
  function syncWish() {
    wishCount.textContent = wish.length; wishCount.hidden = !wish.length;
    $$('[data-wish]').forEach(b => { const on = wish.includes(b.dataset.wish); b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
  }
  function toggleWish(id) {
    wish = wish.includes(id) ? wish.filter(x => x !== id) : [...wish, id];
    store.set('hd-wish', wish); syncWish();
    toast(wish.includes(id) ? `Saved ${P[id].name}` : 'Removed from wishlist');
  }
  $('[data-wish-count-btn]').addEventListener('click', () => toast(wish.length ? `${wish.length} saved — wishlist page comes with the full build` : 'Tap ♡ on any piece to save it'));

  /* ======================= CART ======================= */
  let cart = store.get('hd-cart2', []);
  const cartCount = $('[data-cart-count]');
  const saveCart = () => { store.set('hd-cart2', cart); syncCartCount(); };
  function syncCartCount(bump) {
    const n = cart.reduce((a, i) => a + i.qty, 0);
    cartCount.textContent = n; cartCount.hidden = !n;
    if (bump) { cartCount.classList.remove('bump'); void cartCount.offsetWidth; cartCount.classList.add('bump'); }
  }
  function addToCart(id, v = 0, qty = 1, opts = {}) {
    const key = id + ':' + v + (opts.size ? ':' + opts.size : '') + (opts.custom ? ':' + opts.custom.label : '');
    const ex = cart.find(i => i.key === key);
    if (ex) ex.qty += qty; else cart.push({ key, id, v, qty, size: opts.size || '', custom: opts.custom || null });
    saveCart(); syncCartCount(true);
    if (!opts.silent) open('cart');
  }
  const itemPrice = i => i.custom ? i.custom.price : P[i.id].variants[i.v].price;
  function roomDiscount() {
    const sets = Math.min(...ROOM.map(id => cart.filter(i => i.id === id && !i.custom).reduce((a, i) => a + i.qty, 0)));
    return sets ? Math.round(ROOM.reduce((a, id) => a + priceOf(id), 0) * ROOM_DISCOUNT) * sets : 0;
  }
  function eta(days) { const d = new Date(); d.setDate(d.getDate() + days); return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }
  function renderCart() {
    const box = $('[data-cart-items]'), foot = $('[data-cart-foot]'), up = $('[data-cart-upsell]');
    const n = cart.reduce((a, i) => a + i.qty, 0);
    $('[data-cart-label]').textContent = n ? `(${n})` : '';
    $('[data-cart-eta]').textContent = cart.some(i => i.custom) ? 'in 6–8 weeks' : 'by ' + eta(7);
    if (!cart.length) {
      box.innerHTML = `<div class="cart__empty"><p class="h3" style="color:var(--black)">Your cart is <em>empty</em></p><p>Start with the pieces people choose first.</p><a href="#edit" class="btn btn--dark" data-close-link>Shop bestsellers</a></div>`;
      foot.hidden = true; up.innerHTML = ''; return;
    }
    foot.hidden = false;
    box.innerHTML = cart.map((i, idx) => {
      const p = P[i.id], va = p.variants[i.v];
      const label = i.custom ? i.custom.label : va.label + (i.size ? ' · ' + i.size : '');
      return `<div class="cart-item"><img src="${i.custom ? B + 'images/p-sofa-tan.jpg' : va.img}" alt="">
        <div><strong>${i.custom ? i.custom.name : p.name}</strong><span class="muted">${label}</span>
        <div class="qty"><button aria-label="Decrease" data-q="${idx}" data-d="-1"><svg><use href="#i-minus"/></svg></button><span>${i.qty}</span><button aria-label="Increase" data-q="${idx}" data-d="1"><svg><use href="#i-plus"/></svg></button></div></div>
        <div><div class="cart-item__price">${aed(itemPrice(i) * i.qty)}</div><button class="cart-item__remove" data-rm="${idx}">Remove</button></div></div>`;
    }).join('');
    const sub = cart.reduce((a, i) => a + itemPrice(i) * i.qty, 0);
    const disc = roomDiscount(), total = sub - disc;
    $('[data-cart-subtotal]').innerHTML = disc ? `<s class="muted" style="font-weight:400;margin-right:8px">${aed(sub)}</s>${aed(total)}` : aed(total);
    $('[data-cart-tabby]').textContent = q4(total);
    if (disc) box.insertAdjacentHTML('beforeend', `<div class="cart__row small" style="padding:14px 0"><span>Shop-the-room saving (5%)</span><strong>−${aed(disc)}</strong></div>`);
    const sug = ['dome-pendant', 'sato-side', 'saddle-pouf'].find(id => !cart.some(i => i.id === id));
    up.innerHTML = sug ? `<p class="eyebrow">Complete the room</p><div class="upsell"><img src="${P[sug].variants[0].img}" alt=""><div><strong>${P[sug].name}</strong><span>${aed(priceOf(sug))}</span></div><button class="btn btn--line btn--sm" data-upsell="${sug}">Add</button></div>` : '';
  }
  $('[data-panel="cart"]').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]'), us = e.target.closest('[data-upsell]');
    if (q) { const i = cart[+q.dataset.q]; i.qty += +q.dataset.d; if (i.qty < 1) cart.splice(+q.dataset.q, 1); saveCart(); renderCart(); }
    if (rm) { cart.splice(+rm.dataset.rm, 1); saveCart(); renderCart(); }
    if (us) { addToCart(us.dataset.upsell, 0, 1, { silent: true }); renderCart(); toast(`${P[us.dataset.upsell].name} added`); }
  });
  $('[data-checkout]').addEventListener('click', () => toast('In Shopify this opens checkout with Apple Pay, cards, tabby & tamara'));
  syncCartCount();

  /* ======================= THE EDIT (product grid) ======================= */
  const grid = $('[data-products]');
  const MINIMAL = document.documentElement.dataset.card === 'minimal';
  function cardMinimal(id) {
    const p = P[id], v = p.variants[0];
    const dots = p.variants.length > 1 ? `<span class="mcard__dots">${p.variants.map((x, i) => `<button type="button" style="--c:${x.c}" aria-label="${x.label}" aria-pressed="${i === 0}" data-sw="${i}"></button>`).join('')}</span>` : '';
    return `<article class="pcard mcard" data-id="${id}" data-cat="${p.cat}">
      <a class="pcard__media" href="${PDP}?id=${id}" data-cursor-text="View">
        <img src="${v.img}" alt="${p.name} in ${v.label}" loading="lazy" width="900" height="900">
        ${p.alt ? `<img class="alt" src="${p.alt}" alt="" loading="lazy">` : ''}
        ${p.badge ? `<span class="pcard__badge">${p.badge}</span>` : ''}
      </a>
      <div class="mcard__info">
        <div><h3 class="pcard__name"><a href="${PDP}?id=${id}">${p.name}</a></h3><span class="mcard__sub" data-vname>${v.label}</span></div>
        <div class="mcard__right"><span class="pcard__price" data-price>${aed(v.price)}</span>${dots}</div>
      </div>
      <span hidden data-tabby></span>
    </article>`;
  }
  function card(id, feature) {
    if (MINIMAL) return cardMinimal(id);
    const p = P[id], v = p.variants[0];
    const sw = p.variants.length > 1
      ? `<div class="sw" role="group" aria-label="Colours">${p.variants.map((x, i) => `<button type="button" style="--c:${x.c}" aria-label="${x.label}" aria-pressed="${i === 0}" data-sw="${i}"></button>`).join('')}${feature ? `<span class="pcard__vname" data-vname>${v.label}</span>` : ''}</div>`
      : `<span class="pcard__mat">${p.mat}</span>`;
    const media = `<div class="pcard__media" data-quick="${id}" data-cursor-text="View">
        <img src="${v.img}" alt="${p.name} in ${v.label}" loading="lazy" width="900" height="900">
        ${p.alt ? `<img class="alt" src="${p.alt}" alt="" loading="lazy">` : ''}
        ${p.badge ? `<span class="pcard__badge ${p.dark ? 'pcard__badge--dark' : ''}">${p.badge}</span>` : ''}
        <button class="icon-btn pcard__wish" type="button" aria-label="Save ${p.name}" aria-pressed="false" data-wish="${id}"><svg><use href="#i-heart"/></svg></button>
        ${feature ? '' : `<button class="pcard__add" type="button" data-add="${id}" aria-label="Add ${p.name} to cart"><svg><use href="#i-plus"/></svg><span>Add to cart</span></button>`}
      </div>`;
    if (feature) return `<article class="pcard pcard--feature" data-id="${id}" data-cat="${p.cat}" data-reveal>${media}
      <div class="pcard__info">
        <h3 class="pcard__name"><a href="${PDP}?id=${id}">${p.name.replace('3-seater', '<em>3-seater</em>')}</a></h3>
        <span class="pcard__price" data-price>${aed(v.price)}</span>
        <p class="pcard__desc">${p.desc}</p>
        <div class="pcard__row" style="grid-column:1/-1">${sw}<span class="rating">${stars5.slice(0, 32)} ${p.rating}<span>&nbsp;(${p.reviews} reviews)</span></span></div>
        <span class="pcard__tabby" style="grid-column:1/-1">or 4 interest-free payments of <b data-tabby>${q4(v.price)}</b> with tabby or tamara</span>
        <div class="pcard__cta"><button class="btn btn--dark" type="button" data-add="${id}">Add to cart</button><a class="btn btn--line" href="${PDP}?id=${id}">Choose size &amp; colour</a></div>
      </div></article>`;
    return `<article class="pcard" data-id="${id}" data-cat="${p.cat}" data-reveal>${media}
      <div class="pcard__info">
        <div class="pcard__top"><h3 class="pcard__name"><a href="${PDP}?id=${id}">${p.name}</a></h3><span class="pcard__price" data-price>${aed(v.price)}</span></div>
        <span class="pcard__tabby">or 4 × <b data-tabby>${q4(v.price)}</b></span>
        <div class="pcard__row">${sw}<span class="rating"><svg><use href="#i-star"/></svg>${p.rating}<span>&nbsp;(${p.reviews})</span></span></div>
      </div></article>`;
  }
  function renderGrid(filter = 'all') {
    let ids = filter === 'all' ? FEATURED : Object.keys(P).filter(id => P[id].cat === filter && id !== 'mara-sofa-room');
    ids = ids.slice(0, MINIMAL ? 8 : 9);
    const featureFirst = !MINIMAL && (filter === 'all' || filter === 'sofas');
    grid.innerHTML = ids.map((id, i) => card(id, featureFirst && i === 0)).join('');
    syncWish();
    if (hasGsap() && !reduce) gsap.fromTo(grid.children, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: .9, stagger: .06, ease: 'power3.out', clearProps: 'transform' });
    else $$('[data-reveal]', grid).forEach(el => el.removeAttribute('data-reveal'));
    bindCursorTargets(grid);
    window.ScrollTrigger && ScrollTrigger.refresh();
  }
  function setFilter(f) { $$('.tabs [data-filter]').forEach(b => b.setAttribute('aria-selected', b.dataset.filter === f)); renderGrid(f); }
  $$('.tabs [data-filter]').forEach(b => b.addEventListener('click', () => setFilter(b.dataset.filter)));
  renderGrid();
  grid.addEventListener('click', e => {
    const sw = e.target.closest('[data-sw]');
    if (sw) {
      e.stopPropagation();
      const c = sw.closest('.pcard'), id = c.dataset.id, v = P[id].variants[+sw.dataset.sw];
      $$('[data-sw]', c).forEach(b => b.setAttribute('aria-pressed', b === sw));
      if (MINIMAL) e.preventDefault();
      const img = $('.pcard__media img', c);
      const swap = () => { img.src = v.img; img.alt = `${P[id].name} in ${v.label}`; };
      if (hasGsap() && !reduce) gsap.to(img, { opacity: 0, duration: .25, onComplete: () => { swap(); gsap.to(img, { opacity: 1, duration: .5 }); } }); else swap();
      $('[data-price]', c).textContent = aed(v.price);
      $('[data-tabby]', c).textContent = q4(v.price);
      const vn = $('[data-vname]', c); vn && (vn.textContent = v.label);
      c.dataset.v = sw.dataset.sw;
      if (MINIMAL) $$('a[href*="?id="]', c).forEach(l => l.href = `${PDP}?id=${id}&v=${sw.dataset.sw}`);
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) { e.stopPropagation(); addToCart(add.dataset.add, +(add.closest('.pcard').dataset.v || 0)); }
  });
  document.addEventListener('click', e => {
    const fl = e.target.closest('[data-filter-link]');
    if (fl) setFilter(fl.dataset.filterLink);
    const w = e.target.closest('[data-wish]');
    if (w) { e.preventDefault(); e.stopPropagation(); toggleWish(w.dataset.wish); return; }
    const q = e.target.closest('[data-quick]');
    if (q && !e.target.closest('[data-add]')) { e.preventDefault(); const c = q.closest('.pcard'); quickView(q.dataset.quick, c ? +(c.dataset.v || 0) : 0); }
  });

  /* ======================= QUICK VIEW (PDP preview) ======================= */
  function quickView(id, v = 0) {
    const p = P[id], body = $('[data-quick-body]');
    const st = { v, size: p.sizes ? (p.sizes[1] || p.sizes[0]) : '' };
    const draw = () => {
      const va = p.variants[st.v];
      body.innerHTML = `<button class="icon-btn modal__close" data-close aria-label="Close"><svg><use href="#i-close"/></svg></button>
      <div class="qv"><div class="qv__media"><img src="${va.img}" alt="${p.name} in ${va.label}"></div>
        <div class="qv__body">
          <span class="rating">${stars5} ${p.rating} · ${p.reviews} reviews</span>
          <h3>${p.name}</h3>
          <p class="qv__price">${aed(va.price)}</p>
          <div class="qv__tabby"><span class="pill-tabby">tabby</span><span class="pill-tamara">tamara</span>4 interest-free payments of <b style="color:var(--black)">${q4(va.price)}</b></div>
          <p class="muted">${p.desc}</p>
          ${p.variants.length > 1 ? `<fieldset class="qv__opt"><legend>Colour — <span style="font-weight:400">${va.label}</span></legend><div class="sw">${p.variants.map((x, i) => `<button type="button" style="--c:${x.c};width:32px;height:32px" aria-label="${x.label}" aria-pressed="${i === st.v}" data-qv-v="${i}"></button>`).join('')}</div></fieldset>` : `<p class="small"><b>Finish:</b> ${va.label}</p>`}
          ${p.sizes ? `<fieldset class="qv__opt"><legend>Size</legend><div class="chips">${p.sizes.map(s => `<label><input type="radio" name="qv-size" value="${s}" ${s === st.size ? 'checked' : ''} data-qv-size><span>${s}</span></label>`).join('')}</div></fieldset>` : ''}
          <p class="small muted">Dimensions: ${p.meta} · ${p.mat}</p>
          <span class="qv__stock">In stock · delivered &amp; assembled by&nbsp;<b>${eta(7)}</b></span>
          <div class="qv__actions"><button class="btn btn--dark" data-qv-add>Add to cart · ${aed(va.price)}</button><button class="icon-btn" style="border:1px solid var(--mist);border-radius:4px;width:54px;height:54px" data-wish="${id}" aria-label="Save"><svg><use href="#i-heart"/></svg></button></div>
          <a class="link-btn" href="${PDP}?id=${id}">View full product details <svg><use href="#i-arrow-ne"/></svg></a>
          <ul class="qv__perks">
            <li><svg><use href="#i-truck"/></svg>Free delivery &amp; assembly · packaging removed</li>
            <li><svg><use href="#i-shield"/></svg>5-year frame guarantee · 30-day home trial</li>
            <li><svg><use href="#i-home"/></svg><button type="button" style="all:unset;cursor:pointer;text-decoration:underline;text-underline-offset:3px" data-open="swatches">Order free fabric swatches</button></li>
          </ul>
        </div></div>`;
      syncWish();
    };
    draw();
    body.onclick = e => {
      const b = e.target.closest('[data-qv-v]');
      if (b) { st.v = +b.dataset.qvV; draw(); }
      if (e.target.closest('[data-qv-add]')) { close(true); addToCart(id, st.v, 1, { size: st.size }); }
    };
    body.onchange = e => { if (e.target.matches('[data-qv-size]')) st.size = e.target.value; };
    open('quick');
  }

  /* ======================= SHOP THE ROOM ======================= */
  const list = $('[data-room-list]');
  const roomTotal = ROOM.reduce((a, id) => a + priceOf(id), 0);
  const roomNet = roomTotal - Math.round(roomTotal * ROOM_DISCOUNT);
  list.innerHTML = ROOM.map(id => `<li data-room-item="${id}"><img src="${id === 'mara-sofa' ? B + 'images/r-sofa.jpg' : P[id].variants[0].img}" alt="" loading="lazy"><div><strong>${P[id].name}</strong><span>${P[id].variants[0].label}</span></div><span class="p">${aed(priceOf(id))}</span></li>`).join('');
  $('[data-room-was]').textContent = aed(roomTotal);
  $('[data-room-total]').textContent = aed(roomNet);
  $('[data-room-tabby]').textContent = q4(roomNet);
  const look = $('[data-look]');
  const pop = document.createElement('div'); pop.className = 'spot-pop'; pop.hidden = true; look.appendChild(pop);
  function showSpot(id) {
    const spot = $(`[data-spot="${id}"]`);
    $$('[data-spot]').forEach(s => s.classList.toggle('is-active', s === spot));
    $$('[data-room-item]').forEach(li => li.classList.toggle('is-active', li.dataset.roomItem === id));
    const p = P[id];
    pop.innerHTML = `<img src="${id === 'mara-sofa' ? B + 'images/r-sofa.jpg' : p.variants[0].img}" alt=""><div><strong>${p.name}</strong><span>${aed(priceOf(id))} · or 4 × ${q4(priceOf(id))}</span></div><button class="btn btn--dark btn--sm btn--block" data-add-one="${id}">Add to cart</button>`;
    pop.hidden = false;
    const fr = look.getBoundingClientRect(), sr = spot.getBoundingClientRect();
    const w = pop.offsetWidth, h = pop.offsetHeight;
    let x = sr.left - fr.left + 34, y = sr.top - fr.top - h / 2 + 22;
    if (x + w > fr.width - 16) x = sr.left - fr.left - w - 12;
    y = Math.max(16, Math.min(y, fr.height - h - 16));
    pop.style.left = Math.max(16, x) + 'px'; pop.style.top = y + 'px';
  }
  look.addEventListener('click', e => {
    const s = e.target.closest('[data-spot]'), a = e.target.closest('[data-add-one]');
    if (a) { addToCart(a.dataset.addOne, 0, 1, { silent: true }); markAdded(a.dataset.addOne); toast(`${P[a.dataset.addOne].name} added to cart`); return; }
    if (s) { showSpot(s.dataset.spot); return; }
    if (!e.target.closest('.spot-pop')) { pop.hidden = true; $$('[data-spot]').forEach(x => x.classList.remove('is-active')); $$('[data-room-item]').forEach(x => x.classList.remove('is-active')); }
  });
  const markAdded = id => { const li = $(`[data-room-item="${id}"]`); li && li.classList.add('is-added'); };
  list.addEventListener('click', e => { const li = e.target.closest('[data-room-item]'); if (li) showSpot(li.dataset.roomItem); });
  $('[data-add-room]').addEventListener('click', () => { ROOM.forEach(id => { addToCart(id, 0, 1, { silent: true }); markAdded(id); }); open('cart'); });

  /* ======================= CONSIDERED DETAILS (blueprint) ======================= */
  const bp = $('[data-blueprint]') || document.createElement('div');
  function bpFocus(key) {
    bp.classList.toggle('is-focus', !!key);
    $$('[data-bp]', bp).forEach(g => g.classList.toggle('is-on', g.dataset.bp === key));
    $$('[data-bp-label]', bp).forEach(l => l.classList.toggle('is-on', l.dataset.bpLabel === key));
  }
  $$('[data-bp-label]', bp).forEach(l => { l.tabIndex = 0; l.addEventListener('mouseenter', () => bpFocus(l.dataset.bpLabel)); l.addEventListener('focus', () => bpFocus(l.dataset.bpLabel)); l.addEventListener('mouseleave', () => bpFocus(null)); l.addEventListener('blur', () => bpFocus(null)); });
  const FAB_TILES = [['Oat linen', '#E3DCCF', 'Performance linen'], ['Mist bouclé', '#C9C3B8', 'Soft bouclé'], ['Stone weave', '#8F8A82', 'Easy-clean weave'], ['Forest velvet', '#2F4A42', 'Performance velvet'], ['Cognac leather', '#8A5A3C', 'Full-grain leather'], ['Charcoal weave', '#3A3936', 'Easy-clean weave']];
  if ($('[data-fabric-rail]')) $('[data-fabric-rail]').innerHTML = FAB_TILES.map(([n, c, t]) => `<button class="fab-tile" type="button" data-fab-tile="${n}" data-cursor-text="Add"><i style="--c:${c}"></i><strong>${n}</strong><span>${t}</span></button>`).join('');
  $('[data-fabric-rail]') && $('[data-fabric-rail]').addEventListener('click', e => { const t = e.target.closest('[data-fab-tile]'); if (!t) return; if (!picked.includes(t.dataset.fabTile)) picked.push(t.dataset.fabTile); open('swatches'); });

  /* ======================= TAILOR-MADE CONFIGURATOR ======================= */
  const builder = $('[data-builder]'), sofa = $('[data-sofa]');
  const S = k => sofa.querySelector(`[data-s="${k}"]`);
  let lastPrice = 0;
  function layout(model, W, n) {
    const cx = 320, L = cx - W / 2, R = cx + W / 2;
    const coast = model === 'Coast';
    const armW = coast ? 54 : 34, armTop = coast ? 150 : 172, armR = coast ? 26 : 6;
    const backTop = coast ? 96 : 128, cr = coast ? 18 : 6;
    const inL = L + armW - 6, inR = R - armW + 6, inner = inR - inL;
    const r = {};
    r.back = { x: L + 10, y: backTop, width: W - 20, height: 150, rx: coast ? 30 : 8 };
    r.base = { x: L + 4, y: 236, width: W - 8, height: 30, rx: coast ? 10 : 4 };
    r.armL = { x: L, y: armTop, width: armW, height: 266 - armTop, rx: armR };
    r.armR = { x: R - armW, y: armTop, width: armW, height: 266 - armTop, rx: armR };
    const gap = 6, cw = (inner - gap * (n - 1)) / n;
    for (let i = 0; i < 4; i++) {
      const on = i < n, x = inL + i * (cw + gap);
      r['bc' + i] = { x: on ? x : cx, y: backTop + 14, width: on ? cw : 0, height: coast ? 104 : 74, rx: cr, opacity: on ? 1 : 0 };
      r['sc' + i] = { x: on ? x : cx, y: 196, width: on ? cw : 0, height: 46, rx: coast ? 14 : 5, opacity: on ? 1 : 0 };
    }
    r.backS = { ...r.back }; r.armLS = { ...r.armL }; r.armRS = { ...r.armR };
    const lx = [L + 22, L + W * .3, R - W * .3, R - 22];
    lx.forEach((x, i) => { r['leg' + i] = { d: `M${x - 6} 266 L${x + 6} 266 L${x + 3} 292 L${x - 3} 292 Z`, opacity: (i === 1 || i === 2) && W < 420 ? 0 : 1 }; });
    r.floor = { rx: W / 2 + 40 };
    r.dimL = { x1: L, x2: R }; r.tickL = { x1: L, x2: L }; r.tickR = { x1: R, x2: R };
    return r;
  }
  function applyLayout(r, animate) {
    Object.entries(r).forEach(([k, a]) => {
      const el = S(k); if (!el) return;
      const { opacity, ...attr } = a;
      if (animate && hasGsap() && !reduce) {
        gsap.to(el, { attr, opacity: opacity ?? 1, duration: .9, ease: 'expo.out' });
      } else {
        Object.entries(attr).forEach(([n, v]) => el.setAttribute(n, v));
        if (opacity !== undefined) el.style.opacity = opacity;
      }
    });
  }
  function build(animate = true) {
    const m = $('input[name=model]:checked', builder), s = $('input[name=size]:checked', builder);
    const fab = $('input[name=fabric]:checked', builder), leg = $('input[name=legs]:checked', builder);
    applyLayout(layout(m.value, +s.dataset.w, +s.dataset.n), animate);
    sofa.style.setProperty('--fab', getComputedStyle(fab.parentElement).getPropertyValue('--c').trim());
    sofa.style.setProperty('--leg', leg.dataset.leg);
    $('[data-fabric-name]').textContent = fab.value;
    $('[data-dim-label]').textContent = s.value;
    const price = Math.round((+m.dataset.base * +s.dataset.mult + +fab.dataset.add + +leg.dataset.add) / 10) * 10;
    const pe = $('[data-build-price]');
    if (animate && hasGsap() && !reduce && lastPrice) { const o = { v: lastPrice }; gsap.to(o, { v: price, duration: .8, ease: 'power3.out', onUpdate: () => pe.textContent = aed(Math.round(o.v / 10) * 10) }); }
    else pe.textContent = aed(price);
    lastPrice = price;
    $('[data-build-sum]').textContent = `or 4 × ${q4(price)} · ${m.value} · ${s.value} · ${fab.value} · ${leg.value} · made in 6–8 weeks`;
    builder.dataset.summary = `${m.value} sofa, ${s.value}, ${fab.value}, ${leg.value} legs (${aed(price)})`;
    builder.dataset.price = price;
  }
  builder.addEventListener('change', () => build(true));
  build(false);
  $('[data-build-add]').addEventListener('click', () => {
    const m = $('input[name=model]:checked', builder).value;
    addToCart(m === 'Coast' ? 'coast-sofa' : 'mara-sofa', 0, 1, { custom: { name: `${m} sofa — tailor-made`, label: builder.dataset.summary.replace(/ \(.*\)$/, ''), price: +builder.dataset.price } });
  });
  $('[data-build-cta]').addEventListener('click', () => { $('input[name=room][value="Living room"]').checked = true; toast('Design saved — your stylist will bring these samples'); });

  /* ======================= REVIEWS ======================= */
  const REVIEWS = [
    { q: 'It looks twice the price. Delivered on the day they promised, assembled in forty minutes, every bit of packaging taken away.', n: 'Layla A.', m: 'Dubai Hills · Coast sofa in Forest velvet', img: B + 'images/ugc-2.jpg', face: B + 'images/face-1.jpg', id: 'coast-sofa' },
    { q: 'The home visit sold me. Sara measured our majlis, brought swatches and suggested the 260 cm. It fits perfectly — paid with tabby in four.', n: 'Omar K.', m: 'Abu Dhabi · Mara modular sofa', img: B + 'images/ug-10.jpg', face: B + 'images/face-2.jpg', id: 'mara-sofa' },
    { q: 'Two kids and a dog. I zipped the covers off, washed them and they came back like new. Calm, beautiful and actually practical.', n: 'Hannah R.', m: 'Sharjah · Nook lounge chair', img: B + 'images/ugc-3.jpg', face: B + 'images/face-3.jpg', id: 'nook-chair' },
    { q: 'We furnished the whole apartment in one visit. Everything works together, and the prices were honest from the first quote.', n: 'Rania & Karim', m: 'Dubai Marina · Whole home', img: B + 'images/ug-9.jpg', face: B + 'images/face-5.jpg', id: 'wren-sideboard' }
  ];
  const qMedia = $('[data-quote-media]'), qText = $('[data-quote-text]'), qDots = $('[data-quote-dots]');
  if (qMedia) {
  qMedia.innerHTML = REVIEWS.map((r, i) => `<img src="${r.img}" alt="" loading="lazy" class="${i === 0 ? 'is-on' : ''}">`).join('');
  qDots.innerHTML = REVIEWS.map((r, i) => `<button type="button" aria-label="Review ${i + 1}" aria-current="${i === 0}" data-qi="${i}"></button>`).join('');
  let qi = 0, qTimer;
  function showQuote(i, instant) {
    qi = (i + REVIEWS.length) % REVIEWS.length;
    const r = REVIEWS[qi];
    $$('img', qMedia).forEach((im, k) => im.classList.toggle('is-on', k === qi));
    $$('button', qDots).forEach((b, k) => b.setAttribute('aria-current', k === qi));
    const fill = () => { qText.textContent = r.q; $('[data-quote-name]').textContent = r.n; $('[data-quote-meta]').textContent = r.m; $('[data-quote-face]').src = r.face; qText.classList.remove('is-out'); };
    if (instant) fill(); else { qText.classList.add('is-out'); setTimeout(fill, 380); }
    clearInterval(qTimer); qTimer = setInterval(() => showQuote(qi + 1), 7000);
  }
  showQuote(0, true);
  $('[data-quote-prev]').addEventListener('click', () => showQuote(qi - 1));
  $('[data-quote-next]').addEventListener('click', () => showQuote(qi + 1));
  qDots.addEventListener('click', e => { const b = e.target.closest('[data-qi]'); b && showQuote(+b.dataset.qi); });
  $('[data-quote-shop]').addEventListener('click', () => quickView(REVIEWS[qi].id));
  }
  window.HD_REVIEWS = REVIEWS; window.HD_quickView = id => quickView(id); window.HD_addToCart = (id, v, q, o) => addToCart(id, v, q, o); window.HD_toast = m => toast(m); window.HD_P = P;

  /* ======================= HOME VISIT (multi-step) ======================= */
  const vf = $('[data-visit-form]');
  const dates = $('[data-dates]');
  dates.innerHTML = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    const val = d.toISOString().slice(0, 10);
    return `<label><input type="radio" name="date" value="${val}" ${i === 1 ? 'checked' : ''}><span>${d.toLocaleDateString('en-GB', { weekday: 'short' })}<b>${d.getDate()}</b></span></label>`;
  }).join('');
  let step = 1;
  const next = $('[data-step-next]'), back = $('[data-step-back]');
  function goStep(n) {
    step = n;
    $$('[data-panel-step]', vf).forEach(p => p.classList.toggle('is-active', +p.dataset.panelStep === n));
    $('[data-step-bar]').style.width = Math.min(n, 3) / 3 * 100 + '%';
    $$('[data-tab]', vf).forEach(t => { t.classList.toggle('is-active', +t.dataset.tab === n); t.classList.toggle('is-done', +t.dataset.tab < n); });
    back.hidden = n === 1 || n === 4;
    next.textContent = n === 3 ? 'Book my free visit' : 'Continue';
    $('[data-steps-foot]').hidden = n === 4;
  }
  next.addEventListener('click', () => {
    if (step === 1 && !$$('input[name=room]:checked', vf).length) { toast('Pick at least one room'); return; }
    if (step === 3) {
      const name = $('#v-name'), ph = $('#v-phone');
      let ok = true;
      [[name, name.value.trim().length > 1], [ph, ph.value.replace(/\D/g, '').length >= 8]].forEach(([el, good]) => { el.closest('.field').classList.toggle('is-error', !good); if (!good && ok) { el.focus(); ok = false; } });
      if (!ok) { toast('Please add your name and mobile number'); return; }
      const d = new Date($('input[name=date]:checked', vf).value).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
      const rooms = $$('input[name=room]:checked', vf).map(x => x.value.toLowerCase()).join(', ');
      $('[data-visit-msg]').textContent = `Thanks ${name.value.trim().split(' ')[0]} — a stylist will WhatsApp you within 2 hours to confirm ${$('input[name=slot]:checked', vf).value.toLowerCase()} on ${d} in ${$('input[name=emirate]:checked', vf).value}, for your ${rooms}.${builder.dataset.summary ? ' We\'ll bring samples for your ' + builder.dataset.summary + '.' : ''}`;
      goStep(4); return;
    }
    goStep(step + 1);
  });
  back.addEventListener('click', () => goStep(step - 1));
  vf.addEventListener('input', e => { const f = e.target.closest('.field'); f && f.classList.remove('is-error'); });
  vf.addEventListener('submit', e => e.preventDefault());

  /* ======================= LAUNCH ======================= */
  $('[data-launch-form]').addEventListener('submit', e => {
    e.preventDefault();
    const em = $('#l-email'), msg = $('[data-launch-msg]');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) { msg.textContent = 'Please enter a valid email address.'; em.focus(); return; }
    msg.textContent = 'You’re on the list. Your AED 250 code arrives in January.'; em.value = '';
  });

  /* ======================= SWATCHES ======================= */
  const FABRICS = [['Oat linen', '#E3DCCF'], ['Mist bouclé', '#C9C3B8'], ['Stone weave', '#8F8A82'], ['Olive velvet', '#5E6256'], ['Forest velvet', '#2F4A42'], ['Sky bouclé', '#86A6C9'], ['Cognac leather', '#8A5A3C'], ['Charcoal weave', '#3A3936']];
  function renderSwatchPick() {
    $('[data-swatch-pick]').innerHTML = FABRICS.map(([n, c]) => `<button type="button" aria-pressed="${picked.includes(n)}" data-fab="${n}"><i style="--c:${c}"></i>${n}</button>`).join('');
    $('[data-swatch-submit]').textContent = `Send my swatches (${picked.length}/6)`;
  }
  $('[data-swatch-pick]').addEventListener('click', e => {
    const b = e.target.closest('[data-fab]'); if (!b) return;
    const n = b.dataset.fab;
    if (picked.includes(n)) picked = picked.filter(x => x !== n); else if (picked.length < 6) picked.push(n); else toast('Up to 6 swatches per order');
    renderSwatchPick();
  });
  $('[data-swatch-form]').addEventListener('submit', e => {
    e.preventDefault();
    if (!picked.length) { toast('Pick at least one fabric'); return; }
    close(); toast(`${picked.length} swatch${picked.length > 1 ? 'es' : ''} on the way — arriving in 2–3 days`); picked = []; e.target.reset();
  });

  /* ======================= SEARCH ======================= */
  const sIn = $('[data-search-input]'), sOut = $('[data-search-results]');
  function search(q) {
    q = q.trim().toLowerCase().replace(/s$/, '');
    if (!q) { sOut.innerHTML = ''; return; }
    const hits = Object.keys(P).filter(id => id !== 'mara-sofa-room' && (P[id].name + ' ' + P[id].cat + ' ' + P[id].mat + ' ' + P[id].desc + ' ' + P[id].variants.map(v => v.label).join(' ')).toLowerCase().includes(q));
    sOut.innerHTML = hits.length ? hits.map(id => `<button type="button" data-quick="${id}"><img src="${P[id].variants[0].img}" alt=""><span><strong>${P[id].name}</strong><span>${aed(priceOf(id))}</span></span></button>`).join('')
      : `<p class="muted">No matches for “${q}”. Try sofa, oak or lamp — or <a href="https://wa.me/971500000000" target="_blank" rel="noopener">ask us on WhatsApp</a>.</p>`;
  }
  sIn.addEventListener('input', () => search(sIn.value));
  $$('[data-q]', $('.search')).forEach(b => b.addEventListener('click', () => { sIn.value = b.dataset.q; search(b.dataset.q); sIn.focus(); }));

  /* ======================= UGC rows ======================= */
  const U1 = ['ugc-1', 'ug-7', 'ugc-2', 'ug-8', 'ugc-6', 'ug-10'], U2 = ['ugc-3', 'ug-9', 'ugc-4', 'ugc-5', 'v2-detail', 'v2-plant'];
  const ugcHTML = arr => arr.map(n => `<a class="ugc__item" href="#edit" data-cursor-text="Shop"><img src="${B}images/${n}.jpg" alt="A customer's room styled with Home District furniture" loading="lazy"></a>`).join('');
  if ($('[data-ugc-row="1"]')) { $('[data-ugc-row="1"]').innerHTML = ugcHTML(U1) + ugcHTML(U1); $('[data-ugc-row="2"]').innerHTML = ugcHTML(U2) + ugcHTML(U2); }
  const mq = $('[data-marquee]'); if (mq) mq.innerHTML += mq.innerHTML;

  /* ======================= DESIGN NOTES ======================= */
  const NOTES = window.HD_NOTES || {
    1: ['Hero: the promise in one line', `<p>Visitors decide in about 3 seconds whether a store is for them. The headline states the positioning — <b>the designer look, at a fair price</b> — in big editorial type, like a magazine cover.</p><ul><li>The small arch "window" in the headline opens into a full-screen room as you scroll: a memorable, award-style moment that is also on-brand (calm, modern, the furniture supplies the warmth).</li><li>Shop + Book a free home visit are visible immediately: one path for ready buyers, one for considered buyers.</li><li>Rating and tabby/tamara sit beside the CTAs, answering "can I trust it?" and "can I afford it?" before the first scroll.</li><li>The full-screen room has a shoppable dot, turning inspiration into a product.</li></ul><span class="tag">Clarity</span><span class="tag">Memorability</span>`],
    2: ['Promise marquee: remove risk', `<p>Buying a AED 4,000 sofa online feels risky. A slow, endless marquee keeps the five promises that remove that risk in view without taking space: free delivery &amp; assembly, pay in 4, 5-year guarantee, 30-day trial, free home visit.</p><p><b>Client to confirm:</b> exact policy wording.</p>`],
    3: ['Rooms: a horizontal gallery', `<p>People shop for a room, not a SKU. On desktop the page turns sideways as you scroll — the "turning pages of a magazine" feeling the brief asks for — and every room is one click from its products. On mobile it's a native swipe rail.</p><span class="tag">Navigation</span><span class="tag">Editorial feel</span>`],
    4: ['The edit: bestsellers that sell', `<p>A featured hero product with large imagery, then a tidy grid. "Most loved" uses social proof; filters keep it to one grid.</p><ul><li>Every card shows the price <b>and</b> the 4-payment price — AED 1,072.50 feels very different to AED 4,290.</li><li>Hover shows the piece in a room; swatches switch colour instantly.</li><li>The round "+" adds to cart in one tap; ♡ saves intent; Quick view previews the product page.</li></ul>`],
    5: ['Why it costs less: show the maths', `<p>"Affordable luxury" raises one doubt: <i>if it's cheaper, is it worse?</i> We answer it like a luxury price list, not a sales banner.</p><ul><li>The headline lights up as you scroll: "We removed the showroom mark-up. Not the quality."</li><li>A clear ledger shows the same materials cost in both columns, and where the showroom money really goes. Transparency builds trust.</li><li>A slowly turning seal ("Same frame · Same foam · Same fabric") makes the saving memorable.</li><li>It ends with "You keep AED 5,510", a direct link to the product and four guarantees.</li></ul><p><b>Client to confirm:</b> benchmark prices and the cost split.</p>`],
    6: ['Shop the room: raise basket size', `<p>Furniture is bought as a look. A cinematic, full-bleed room with tap-to-shop dots, and a panel that totals the whole room with a <b>5% bundle saving</b> and the 4-payment price. Bundles lift average order value.</p><span class="tag">AOV</span>`],
    7: ['Considered details: a product blueprint', `<p>Online, nobody can sit on the sofa, so we show what's inside, like a luxury product brochure. Fine leader lines draw themselves onto the sofa and point at each detail (covers, fabric, frame, foam) with its real-life benefit.</p><ul><li>Hovering a detail highlights it and dims the rest.</li><li>The fabric rail turns "not sure" into a free first step: tap any fabric to order <b>free swatches</b>, one of the strongest furniture conversion tools.</li></ul>`],
    8: ['Tailor-made: a live configurator', `<p>The showpiece. Instead of a "contact us" form, the customer designs their sofa: shape, width, fabric and legs change the drawing live, and the price updates instantly.</p><ul><li>Instant price = transparency and commitment (people value what they help create).</li><li>Two exits: add to cart (made to order) or talk to a stylist, with the design carried into the home-visit request.</li><li>On the full site this becomes the Tailor-made page.</li></ul><span class="tag">Engagement</span><span class="tag">Lead quality</span>`],
    9: ['Reviews: real homes, big voices', `<p>Large serif quotes read like magazine pull-quotes, paired with photos of customers' rooms. Each review answers an objection (quality, fit, practicality) and links to the product it mentions.</p><p><b>Note:</b> sample reviews for the concept — at launch we connect a review app (Judge.me / Okendo).</p>`],
    10: ['Free home visit: a premium concierge', `<p>High-ticket buyers often need a person before they commit. This section feels like a concierge service: a full-bleed room, a named stylist with a face and rating, and three clear promises (45 min, 48 hrs, AED 0).</p><ul><li>The form is split into Rooms → Date → Details. One question at a time feels effortless and converts better than one long form.</li><li>Step 1 is a tap, not typing, so it builds momentum. Contact details come last, when commitment is highest.</li><li>WhatsApp is always the alternative.</li></ul><p><b>Client to supply:</b> stylist name and photo.</p><span class="tag">Lead capture</span><span class="tag">Human trust</span>`],
    11: ['Story: the people behind the brand', `<p>The brief asks for "real people behind the brand". A founder quote, faces, a signature and a real studio address make a new brand accountable — vital trust for a January 2027 launch with no history yet.</p><p><b>Client to supply:</b> founder photo, story in their words, studio details.</p>`],
    12: ['Community: living proof', `<p>Two slowly drifting rows of customer homes show the furniture in real UAE rooms and invite people to tag #AtHomeDistrict. Every image links to shop.</p>`],
    13: ['FAQ: stop exits', `<p>Delivery, assembly, instalments, returns and guarantee are the questions that stop a purchase. Answering them here keeps people from leaving to "check later" — with a real person on WhatsApp for anything else.</p>`],
    14: ['Launch list: sell before January', `<p>Until launch, every visitor is a potential first customer. Early access + AED 250 off builds a launch-day audience. After launch this becomes the newsletter with a first-order offer.</p>`]
  };
  const notesBtn = $('[data-notes-toggle]'), notesPanel = $('[data-notes-panel]');
  let curNote = 1;
  $$('[data-note]').forEach(sec => {
    const n = sec.dataset.note;
    const pin = document.createElement('button');
    pin.type = 'button'; pin.className = 'note-pin';
    pin.innerHTML = `<b>${n}</b>${NOTES[n][0].split(':')[0]}`;
    pin.addEventListener('click', () => showNote(+n));
    sec.appendChild(pin);
  });
  function showNote(n) {
    curNote = n;
    $('[data-note-num]').textContent = `${n} / ${Object.keys(NOTES).length}`;
    $('[data-note-title]').textContent = NOTES[n][0];
    $('[data-note-body]').innerHTML = NOTES[n][1];
    notesPanel.classList.add('is-open'); notesPanel.setAttribute('aria-hidden', 'false');
  }
  function closeNote() { notesPanel.classList.remove('is-open'); notesPanel.setAttribute('aria-hidden', 'true'); }
  function setNotes(on) { document.body.classList.toggle('notes-on', on); notesBtn.setAttribute('aria-pressed', on); on ? showNote(curNote) : closeNote(); }
  notesBtn.addEventListener('click', () => setNotes(!document.body.classList.contains('notes-on')));
  $('[data-notes-close]').addEventListener('click', closeNote);
  const goNote = n => { const max = Object.keys(NOTES).length; n = ((n - 1 + max) % max) + 1; showNote(n); const s = $(`[data-note="${n}"]`); if (s) { lenis ? lenis.scrollTo(s, { offset: -72 }) : s.scrollIntoView({ behavior: 'smooth' }); } };
  $('[data-note-prev]').addEventListener('click', () => goNote(curNote - 1));
  $('[data-note-next]').addEventListener('click', () => goNote(curNote + 1));
  if (/[?&]notes=1/.test(location.search)) setNotes(true);

  /* ======================= CURSOR + MAGNETIC ======================= */
  const cur = $('[data-cursor]'), curLabel = $('[data-cursor-label]');
  function bindCursorTargets(root = document) {
    if (!fine) return;
    $$('[data-cursor-text]', root).forEach(el => {
      if (el._cb) return; el._cb = 1;
      el.addEventListener('mouseenter', () => { curLabel.textContent = el.dataset.cursorText; cur.classList.add('is-text'); });
      el.addEventListener('mouseleave', () => cur.classList.remove('is-text'));
    });
    $$('a, button, label', root).forEach(el => {
      if (el._ch) return; el._ch = 1;
      el.addEventListener('mouseenter', () => cur.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cur.classList.remove('is-hover'));
    });
  }
  if (fine && !reduce) {
    document.documentElement.classList.add('has-cursor');
    let mx = -100, my = -100, cx = -100, cy = -100;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    document.addEventListener('mouseleave', () => cur.classList.add('is-hidden'));
    document.addEventListener('mouseenter', () => cur.classList.remove('is-hidden'));
    (function loop() { cx += (mx - cx) * .2; cy += (my - cy) * .2; cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; requestAnimationFrame(loop); })();
    bindCursorTargets();
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`; });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
      el.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1), color .4s, background .4s, border-color .4s';
    });
  }

  /* ======================= COUNTERS ======================= */
  function countUp(el) {
    const end = +el.dataset.count;
    if (!hasGsap() || reduce || end === 0) { el.textContent = end; return; }
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => el.textContent = Math.round(o.v) });
  }
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { countUp(en.target); co.unobserve(en.target); } }), { threshold: .6 });
    $$('[data-count]').forEach(el => co.observe(el));
  }

  /* ======================= MOTION ======================= */
  function splitWords(el) {
    if (el._split) return; el._split = 1;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(w => {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            const o = document.createElement('span'); o.className = 'split-w';
            const i = document.createElement('span'); i.textContent = w; o.appendChild(i); frag.appendChild(o);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName === 'EM') {
          const o = document.createElement('span'); o.className = 'split-w';
          const i = document.createElement('span'); n.replaceWith(o); i.appendChild(n); o.appendChild(i);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
  }

  function initMotion() {
    if (!hasGsap() || reduce) { introDone(); window.HD_onMotion && window.HD_onMotion(null); return; }
    gsap.registerPlugin(ScrollTrigger);

    // Lenis smooth scroll
    if (window.Lenis && fine) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // Split headings
    $$('[data-split]').forEach(h => {
      splitWords(h);
      gsap.from($$('.split-w > span', h), { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: .05, scrollTrigger: { trigger: h, start: 'top 85%' } });
    });

    // Generic reveals
    ['.sec-head .tabs', '.lede', '.ledger', '.value__foot', '.value__proof li', '.bp-label', '.fabric-rail__head', '.visit__perks li', '.stylist', '.visit__lede', '.look__panel', '.config fieldset', '.config__out', '.quote__body', '.steps', '.story__quote', '.founders', '.story__facts li', '.faq__list details', '.wa-card', '.launch__lede', '.launch__form', '.footer__grid > *', '.edit__more', '.rating-sum']
      .forEach(sel => $$(sel).forEach(el => { if (!el.closest('.hero')) el.setAttribute('data-reveal', ''); }));
    ScrollTrigger.batch('[data-reveal]:not(.pcard)', { start: 'top 90%', onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, stagger: .08, ease: 'expo.out', overwrite: true }) });
    ScrollTrigger.create({ trigger: grid, start: 'top 85%', once: true, onEnter: () => gsap.to(grid.children, { opacity: 1, y: 0, duration: 1, stagger: .07, ease: 'expo.out' }) });

    // Image clip reveals + parallax
    $$('.reveal-img, .arch-frame, .launch__arch, .quote__media').forEach(w => {
      gsap.fromTo(w, { clipPath: 'inset(18% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: w, start: 'top 85%' } });
    });
    $$('[data-parallax]').forEach(img => gsap.fromTo(img, { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

    // Manifesto words light up on scroll
    const mt = $('[data-scrub-text]');
    if (mt) {
      splitWords(mt);
      const words = $$('.split-w', mt); words.forEach(w => w.classList.add('sw-word'));
      ScrollTrigger.create({ trigger: mt, start: 'top 80%', end: 'bottom 45%', scrub: true, onUpdate: s => { const n = Math.round(s.progress * words.length); words.forEach((w, i) => w.classList.toggle('on', i < n)); } });
    }
    // Ledger rows slide in
    if ($('.ledger')) gsap.from('[data-ledger-row]', { opacity: 0, x: -16, duration: .9, stagger: .09, ease: 'expo.out', scrollTrigger: { trigger: '.ledger', start: 'top 80%' } });
    // Blueprint leader lines draw in
    const bpPaths = $$('.blueprint__lines path');
    bpPaths.forEach(p => { p.style.strokeDasharray = 3000; p.style.strokeDashoffset = 3000; });
    if (bpPaths.length) gsap.to(bpPaths, { strokeDashoffset: 0, duration: 2.4, stagger: .2, ease: 'power3.inOut', scrollTrigger: { trigger: '[data-blueprint]', start: 'top 70%' } });
    if (bpPaths.length) gsap.from('.blueprint__lines circle:not(.ring)', { scale: 0, duration: .8, stagger: .2, ease: 'back.out(3)', scrollTrigger: { trigger: '[data-blueprint]', start: 'top 70%' } });
    if ($('.fabric-rail__list')) gsap.from('.fab-tile', { opacity: 0, y: 40, duration: 1.1, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: '.fabric-rail__list', start: 'top 88%' } });
    // Price seal drifts
    if ($('[data-seal]')) gsap.fromTo('[data-seal]', { yPercent: 30 }, { yPercent: -30, ease: 'none', scrollTrigger: { trigger: '.value__media', start: 'top bottom', end: 'bottom top', scrub: true } });

    // Shop the look: slow zoom
    if ($('.look [data-look-img]')) gsap.fromTo('[data-look-img]', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.look', start: 'top bottom', end: 'center center', scrub: true } });

    // Signature draw
    const sig = $('[data-sign]');
    if (sig) { const L = sig.getTotalLength(); gsap.fromTo(sig, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', scrollTrigger: { trigger: sig, start: 'top 85%' } }); }

    // Sofa entrance
    if ($('.sofa-stage')) gsap.from('.sofa', { opacity: 0, y: 40, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.sofa-stage', start: 'top 80%' } });

    const mm = gsap.matchMedia();
    if ($('[data-hero-slot]')) setupHero(mm);
    window.HD_onMotion && window.HD_onMotion(mm, lenis);
    mm.add('(min-width: 761px)', () => {
      // Rooms: horizontal scroll
      const track = $('[data-rooms-track]');
      if (!track) return;
      const dist = () => track.scrollWidth - window.innerWidth;
      const tw = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '[data-rooms-pin]', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .8, invalidateOnRefresh: true,
        onUpdate: s => { $('[data-rooms-progress]').style.transform = `scaleX(${s.progress})`; } } });
      $$('.room-card img').forEach(img => gsap.fromTo(img, { xPercent: 6 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: img.closest('.room-card'), containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } }));
      return () => {};
    });

    ScrollTrigger.refresh();
  }

  /* Hero: arch slot expands to full-screen room (desktop) */
  function setupHero(mm) {
    const hero = $('[data-hero]'), stage = $('[data-hero-stage]'), arch = $('[data-hero-arch]'), slot = $('[data-hero-slot]');
    // intro animation (all sizes)
    const lines = $$('.hero__line > span', hero);
    introTl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .from(lines, { yPercent: 110, duration: 1.4, stagger: .1 })
      .from('.hero__folio', { opacity: 0, y: 10, duration: 1 }, .2)
      .from(slot, { scale: 0, duration: 1.2 }, .4)
      .from(['.hero__lede', '.hero__btns', '.hero__proof'], { opacity: 0, y: 24, duration: 1.1, stagger: .1 }, .5)
      .from('.hero__arch', { opacity: 0, y: 40, duration: 1.2 }, .6);

    mm.add('(min-width: 761px)', () => {
      document.documentElement.classList.add('hero-fx');
      const place = () => {
        const s = slot.getBoundingClientRect(), st = stage.getBoundingClientRect();
        return { top: s.top - st.top, left: s.left - st.left, width: s.width, height: s.height, borderRadius: getComputedStyle(slot).borderRadius };
      };
      gsap.set(arch, place());
      introTl.eventCallback('onUpdate', () => { if (window.scrollY < 5) gsap.set(arch, place()); });
      const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: '+=130%', pin: true, scrub: 1, invalidateOnRefresh: true,
        onRefresh: self => { if (self.progress === 0) gsap.set(arch, place()); } } });
      tl.to($$('.hero__line')[0], { xPercent: -40, opacity: 0, ease: 'power2.in' }, 0)
        .to($$('.hero__line')[1], { opacity: 0, ease: 'power2.in' }, 0)
        .to($$('.hero__line')[2], { xPercent: 40, opacity: 0, ease: 'power2.in' }, 0)
        .to(['.hero__folio', '.hero__foot'], { opacity: 0, y: 20 }, 0)
        .fromTo(arch, { top: () => place().top, left: () => place().left, width: () => place().width, height: () => place().height, borderRadius: () => place().borderRadius },
          { top: 0, left: 0, width: () => stage.offsetWidth, height: () => stage.offsetHeight, borderRadius: 0, ease: 'power2.inOut', duration: 1 }, 0)
        .fromTo('.hero__arch img', { scale: 1.35 }, { scale: 1, ease: 'power2.inOut', duration: 1 }, 0)
        .to('[data-hero-overlay]', { opacity: 1, duration: .35 }, .75)
        .to('.hero__hotspot', { opacity: 1, duration: .25 }, .85);
      return () => { document.documentElement.classList.remove('hero-fx'); gsap.set(arch, { clearProps: 'all' }); };
    });
  }
  let introTl = null;
  function introDone() { $$('[data-reveal]').forEach(el => el.removeAttribute('data-reveal')); }

  const start = () => {
    initMotion();
    finishLoader(() => { introTl && introTl.play(); window.HD_onIntro && window.HD_onIntro(); });
  };
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
})();
