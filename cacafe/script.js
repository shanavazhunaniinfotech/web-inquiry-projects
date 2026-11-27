(() => {
  'use strict';

  const BUNDLE = [[3, 0.10], [2, 0.05]]; // [min jars, extra off]

  /* ---------- product data (from cacafe.com) ---------- */
  const P = [
    { id: 'wm-coffee', name: 'Weight Management Coffee', sub: 'No Added Sugar', price: 34.99, img: 'images/p-wm-coffee.webp', life: 'images/ing-coffee.webp', cats: ['coffee', 'weight'], goal: ['weight', 'focus'], sweet: 'none', tag: 'Light & Steady', facts: ['90 cal', '0g added sugar', 'Collagen + ACV'], rating: 4.8, badge: 'Bestseller', stock: true, tint: '#efe2cf', pair: 'wm-matcha', why: 'Your afternoon match' },
    { id: 'wm-matcha', name: 'Weight Management Matcha', sub: 'No Added Sugar', price: 34.99, img: 'images/p-wm-matcha.webp', life: 'images/ing-matcha.webp', cats: ['matcha', 'weight'], goal: ['weight', 'calm'], sweet: 'none', tag: 'Steady Clarity', facts: ['0g added sugar', 'Prebiotic fiber', 'Collagen'], rating: 4.8, badge: 'New look', stock: true, tint: '#e1e8d2', pair: 'wm-coffee', why: 'Your morning match' },
    { id: 'wm-matcha-og', name: 'Weight Management Matcha', sub: 'Original Sweetened', price: 34.99, img: 'images/p-wm-matcha-original.webp', life: 'images/matcha-bowl.webp', cats: ['matcha', 'weight'], goal: ['weight', 'calm'], sweet: 'sweet', tag: 'Steady Clarity', facts: ['Lightly sweet', 'Turmeric', 'Collagen'], rating: 4.7, stock: true, tint: '#e6e3dc', pair: 'coffee-og', why: 'Complete the ritual' },
    { id: 'coffee-og', name: 'Coconut Coffee', sub: 'Original', price: 19.99, img: 'images/p-coffee-original.webp', life: 'images/still-life.webp', cats: ['coffee'], goal: ['focus'], sweet: 'sweet', tag: 'Comfort & Focus', facts: ['Colombian arabica', 'Creamy coconut', 'Hot or iced'], rating: 4.9, badge: 'Fan favorite', stock: true, tint: '#f2e7d6', pair: 'wm-matcha', why: 'Customers also love' },
    { id: 'collagen-coffee', name: 'Coconut Collagen Coffee', sub: 'Unsweetened', price: 24.99, img: 'images/p-collagen-coffee.webp', cats: ['coffee'], goal: ['glow'], sweet: 'none', tag: 'Vitality & Glow', facts: ['Collagen', 'Coconut'], stock: false, tint: '#f1e9dc' },
    { id: 'coconut-matcha', name: 'Coconut Matcha', sub: 'Reduced Sugar', price: 19.99, img: 'images/p-coconut-matcha.webp', cats: ['matcha'], goal: ['calm'], sweet: 'sweet', tag: 'Calm Clarity', facts: ['Japanese matcha', 'Coconut'], stock: false, tint: '#dfe7d3' },
    { id: 'coconut-tea', name: 'Coconut Tea', sub: 'Reduced Sugar', price: 19.99, img: 'images/p-coconut-tea.webp', cats: ['tea'], goal: ['calm'], sweet: 'sweet', tag: 'Daily Balance', facts: ['Green tea', 'Coconut'], stock: false, tint: '#ece7df' },
    { id: 'tea-unsw', name: 'Coconut Milk Tea', sub: 'Unsweetened', price: 16.00, compare: 19.99, img: 'images/p-tea-unsweetened.webp', cats: ['tea'], goal: ['calm'], sweet: 'none', tag: 'Daily Balance', facts: ['Green tea', 'Coconut'], stock: false, tint: '#f6e3cf' },
    { id: 'coffee-unsw', name: 'Coconut Coffee', sub: 'Unsweetened', price: 19.99, img: 'images/p-coffee-unsweetened.webp', cats: ['coffee'], goal: ['focus'], sweet: 'none', tag: 'Comfort & Focus', facts: ['Colombian arabica', 'Coconut'], stock: false, tint: '#efe2cf' },
  ];
  const byId = id => P.find(p => p.id === id);

  // collection cards: variants grouped into one card + a bundle card
  const CARDS = [
    { ids: ['wm-coffee'] },
    { ids: ['wm-matcha', 'wm-matcha-og'], labels: ['No Added Sugar', 'Original Sweetened'] },
    { ids: ['coffee-og'] },
    { bundle: ['wm-coffee', 'wm-matcha'] },
  ];
  const selVar = {};

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const money = n => '$' + n.toFixed(2);
  const icon = id => `<svg><use href="#${id}"/></svg>`;

  /* ---------- toast ---------- */
  const toastEl = $('.toast');
  let toastT;
  const toast = msg => {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
  };

  /* ---------- collection ---------- */
  const grid = $('.js-grid');
  const soonTrack = $('.js-soon');
  let currentFilter = 'all';

  $$('.tab i').forEach(i => {
    const c = i.dataset.c;
    i.textContent = P.filter(p => c === 'all' || p.cats.includes(c)).length;
  });

  const productCard = (card, idx, i) => {
    const v = selVar[idx] || 0;
    const p = byId(card.ids[v]);
    const vars = card.labels ? `<div class="pc__vars">${card.labels.map((l, n) => `<button class="pc__var ${n === v ? 'is-on' : ''}" data-card="${idx}" data-var="${n}">${l}</button>`).join('')}</div>` : '';
    return `<article class="pc" style="--tint:${p.tint};animation-delay:${i * 70}ms">
      <div class="pc__media">
        <img class="pc__life" src="${p.life}" alt="" loading="lazy">
        <div class="pc__badges">${p.badge ? `<span class="chip">${p.badge}</span>` : ''}</div>
        <img class="pc__jar" src="${p.img}" alt="${p.name}, ${p.sub}" loading="lazy" width="800" height="800">
      </div>
      <div class="pc__body">
        <div class="pc__meta"><span class="pc__tag">${p.tag}</span><span class="pc__rate">${icon('i-star')} ${p.rating}</span></div>
        <h3 class="pc__name">${p.name}</h3>
        ${card.labels ? '' : `<p class="pc__sub">${p.sub}</p>`}
        ${vars}
        <div class="pc__facts">${p.facts.map(f => `<span>${f}</span>`).join('')}</div>
        <button class="pc__add" data-add="${p.id}"><span>${icon('i-bag')} Add to cart</span><em>${money(p.price)}</em></button>
      </div>
    </article>`;
  };
  const bundleCard = (card, i) => {
    const [a, b] = card.bundle.map(byId);
    const full = a.price + b.price;
    return `<article class="pc pc--bundle" style="animation-delay:${i * 70}ms">
      <div class="pc__media">
        <div class="pc__badges"><span class="chip chip--gold">Save 5%</span></div>
        <div class="pc__duo"><img src="${a.img}" alt="${a.name}" loading="lazy" width="800" height="800"><img src="${b.img}" alt="${b.name}" loading="lazy" width="800" height="800"></div>
      </div>
      <div class="pc__body">
        <div class="pc__meta"><span class="pc__tag">The AM/PM Duo</span><span class="pc__rate">${icon('i-star')} 4.9</span></div>
        <h3 class="pc__name">Coffee by morning, matcha by afternoon</h3>
        <div class="pc__facts"><span>2 jars</span><span>No added sugar</span><span>Most gifted</span></div>
        <button class="pc__add" data-add-bundle="${card.bundle.join(',')}"><span>${icon('i-gift')} Add both</span><em><s>${money(full)}</s>${money(full * 0.95)}</em></button>
      </div>
    </article>`;
  };
  const soonCard = p => `<div class="sc" style="--tint:${p.tint}">
      <div class="sc__img"><img src="${p.img}" alt="" loading="lazy" width="800" height="800"></div>
      <div><b>${p.name}</b><small>${p.sub} · ${money(p.price)}</small></div>
      <button class="sc__btn" data-notify="${p.id}">${icon('i-bell')} Notify</button>
    </div>`;

  const renderGrid = (filter = currentFilter) => {
    currentFilter = filter;
    const match = ids => ids.some(id => filter === 'all' || byId(id).cats.includes(filter));
    const list = CARDS.map((c, idx) => ({ c, idx })).filter(({ c }) => match(c.ids || c.bundle));
    grid.innerHTML = list.length
      ? list.map(({ c, idx }, i) => (c.bundle ? bundleCard(c, i) : productCard(c, idx, i))).join('')
      : `<div class="pgrid__empty"><h3>Our tea blends are brewing a fresh batch</h3><p>Join the list below and you'll be the first to know when they're back.</p><button class="btn btn--primary" data-notify="coconut-tea">${icon('i-bell')} Notify me</button></div>`;
    const soon = P.filter(p => !p.stock && (filter === 'all' || p.cats.includes(filter)));
    soonTrack.innerHTML = soon.map(soonCard).join('');
    $('.soon').style.display = soon.length ? '' : 'none';
    $$('.tab').forEach(t => t.classList.toggle('is-active', t.dataset.tab === filter));
  };
  renderGrid();
  $$('.tab').forEach(t => t.addEventListener('click', () => renderGrid(t.dataset.tab)));
  $$('[data-filter]').forEach(a => a.addEventListener('click', () => renderGrid(a.dataset.filter)));

  /* ---------- cart ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('cacafe-cart-v2') || '[]').filter(l => byId(l.id) && byId(l.id).stock); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem('cacafe-cart-v2', JSON.stringify(cart)); } catch (e) {} };

  const cartEl = $('#cart');
  const overlay = $('.overlay');
  const openCart = () => {
    cartEl.classList.add('is-open'); overlay.classList.add('is-open');
    cartEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('cart-open');
    setTimeout(() => $('.cart__head .icon-btn').focus(), 100);
  };
  const closeCart = () => {
    cartEl.classList.remove('is-open'); overlay.classList.remove('is-open');
    cartEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.classList.remove('cart-open');
  };
  $$('[data-open-cart]').forEach(b => b.addEventListener('click', openCart));
  $$('[data-close-cart]').forEach(b => b.addEventListener('click', closeCart));

  const add = (id, qty = 1, silent) => {
    const p = byId(id);
    if (!p || !p.stock) return;
    const line = cart.find(l => l.id === id);
    if (line) line.qty += qty; else cart.push({ id, qty });
    save(); renderCart();
    const c = $('.js-count'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    if (!silent) openCart();
  };
  const setQty = (id, qty) => {
    const line = cart.find(l => l.id === id);
    if (!line) return;
    if (qty <= 0) {
      const li = $(`.line[data-id="${id}"]`);
      cart = cart.filter(l => l.id !== id);
      save();
      if (li) { li.classList.add('is-removing'); setTimeout(renderCart, 300); } else renderCart();
      return;
    }
    line.qty = qty; save(); renderCart();
  };

  const totals = () => {
    const jars = cart.reduce((n, l) => n + l.qty, 0);
    const subtotal = cart.reduce((n, l) => n + byId(l.id).price * l.qty, 0);
    const rate = (BUNDLE.find(([min]) => jars >= min) || [0, 0])[1];
    const bundleOff = subtotal * rate;
    return { jars, subtotal, rate, bundleOff, total: subtotal - bundleOff };
  };

  let upsIdx = 0;
  const upsellList = () => {
    const inCart = new Set(cart.map(l => l.id));
    const pairs = cart.map(l => byId(l.id).pair).filter(id => id && !inCart.has(id));
    const rest = P.filter(p => p.stock && !inCart.has(p.id)).map(p => p.id);
    return [...new Set([...pairs, ...rest])].map(byId);
  };
  const whyFor = p => {
    const src = cart.find(l => byId(l.id).pair === p.id);
    if (src) return byId(src.id).why;
    return cart.length ? 'Customers also bought' : (p.badge || 'Most loved');
  };

  const renderCart = () => {
    const t = totals();
    $('.js-count').textContent = t.jars;
    $('.js-cart-items').textContent = `${t.jars} ${t.jars === 1 ? 'item' : 'items'}`;
    cartEl.classList.toggle('is-empty', !cart.length);

    $('.js-lines').innerHTML = cart.map(l => {
      const p = byId(l.id);
      return `<li class="line" data-id="${p.id}">
        <div class="line__img" style="--tint:${p.tint}"><img src="${p.img}" alt="" width="800" height="800"></div>
        <div>
          <p class="line__name">${p.name}</p>
          <p class="line__sub">${p.sub} · 1 jar</p>
          <div class="qty"><button data-q="${p.id}" data-d="-1" aria-label="Decrease quantity">${icon('i-minus')}</button><span>${l.qty}</span><button data-q="${p.id}" data-d="1" aria-label="Increase quantity">${icon('i-plus')}</button></div>
        </div>
        <div class="line__right">
          <div class="line__price">${money(p.price * l.qty)}</div>
          <button class="line__rm" data-rm="${p.id}">Remove</button>
        </div>
      </li>`;
    }).join('');

    const pct = t.jars >= 3 ? 100 : t.jars === 2 ? 50 : t.jars === 1 ? 20 : 0;
    $('.js-tier-fill').style.width = pct + '%';
    $$('.tier__node').forEach(n => n.classList.toggle('is-on', t.jars >= +n.dataset.tier));
    const msg = $('.js-tier-msg');
    if (t.jars === 0) msg.innerHTML = 'Free shipping on every order. Bundle <b>2+ jars</b> to save up to 10%.';
    else if (t.jars === 1) msg.innerHTML = 'Add <b>1 more jar</b> to unlock <b>5% off</b> your order';
    else if (t.jars === 2) msg.innerHTML = '5% unlocked! Add <b>1 more jar</b> for <b>10% off</b>';
    else msg.innerHTML = 'Ritual bundle unlocked: <b>10% off</b> your order';

    const ups = upsellList();
    $('.js-upsell-title').textContent = cart.length ? 'Pairs perfectly with' : 'Our most-loved blends';
    $('.js-upsells').innerHTML = ups.map(p => `<div class="up">
        <div class="up__img" style="--tint:${p.tint}"><img src="${p.img}" alt="" width="800" height="800"></div>
        <div>
          <span class="up__why">${whyFor(p)}</span>
          <h4>${p.name} <span>· ${p.sub}</span></h4>
          <div class="up__row"><b>${money(p.price)}</b><button class="up__add" data-up-add="${p.id}">${icon('i-plus')} Add</button></div>
        </div>
      </div>`).join('');
    $('.cart__upsell').style.display = ups.length ? '' : 'none';
    upsIdx = 0;

    $('.js-subtotal').textContent = money(t.subtotal);
    $('.js-bundle-row').hidden = !t.rate;
    $('.js-bundle').textContent = `−${money(t.bundleOff)} (${Math.round(t.rate * 100)}%)`;
    $('.js-total').textContent = money(t.total);
    $('.js-was').textContent = t.bundleOff > 0 ? money(t.subtotal) : '';
    $('.js-save-note').textContent = t.bundleOff > 0 ? `You're saving ${money(t.bundleOff)}` : '';
    const co = $('.js-checkout');
    co.disabled = !cart.length;
    co.style.opacity = cart.length ? '' : '.45';
  };

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]');
    if (a) { add(a.dataset.add); toast(`${byId(a.dataset.add).name} added to your ritual`); return; }
    const b = e.target.closest('[data-add-bundle]');
    if (b) { b.dataset.addBundle.split(',').forEach(id => add(id, 1, true)); openCart(); toast('AM/PM Duo added. 5% off unlocked'); return; }
    const up = e.target.closest('[data-up-add]');
    if (up) { add(up.dataset.upAdd, 1, true); toast(`${byId(up.dataset.upAdd).name} added`); return; }
    const q = e.target.closest('[data-q][data-d]');
    if (q) { const l = cart.find(x => x.id === q.dataset.q); if (l) setQty(l.id, l.qty + +q.dataset.d); return; }
    const rm = e.target.closest('[data-rm]');
    if (rm) { setQty(rm.dataset.rm, 0); return; }
    const n = e.target.closest('[data-notify]');
    if (n) { openNotify(n.dataset.notify); return; }
    const v = e.target.closest('.pc__var');
    if (v) { selVar[v.dataset.card] = +v.dataset.var; renderGrid(); return; }
    const u = e.target.closest('[data-ups]');
    if (u) {
      const track = $('.js-upsells');
      const cards = $$('.up', track);
      upsIdx = Math.max(0, Math.min(cards.length - 1, upsIdx + +u.dataset.ups));
      if (cards[upsIdx]) track.scrollTo({ left: cards[upsIdx].offsetLeft - track.offsetLeft, behavior: 'smooth' });
      return;
    }
    const s = e.target.closest('[data-soon]');
    if (s) soonTrack.scrollBy({ left: 300 * +s.dataset.soon, behavior: 'smooth' });
  });

  $('.js-sub').addEventListener('change', e => toast(e.target.checked ? 'Subscribed: 10% off every refill, cancel anytime' : 'Subscription removed'));
  $('.js-checkout').addEventListener('click', () => toast('Prototype: this continues to Shopify checkout'));
  renderCart();

  /* ---------- notify modal ---------- */
  const modal = $('#notify');
  function openNotify(id) {
    const p = byId(id);
    $('.js-notify-img').src = p.img;
    $('.js-notify-img').alt = p.name;
    $('.js-notify-name').textContent = `${p.name}, ${p.sub}`;
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => $('#notify-email').focus(), 150);
  }
  const closeNotify = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); };
  $$('[data-close-modal]').forEach(b => b.addEventListener('click', closeNotify));
  modal.addEventListener('click', e => { if (e.target === modal) closeNotify(); });
  $('.js-notify-form').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); closeNotify(); toast("You're on the list. We'll email you when it's back."); });
  $('.js-news').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('Welcome! Your 10% code is on its way.'); });

  /* ---------- mobile menu ---------- */
  const mnav = $('#mnav');
  const closeMenu = () => { mnav.classList.remove('is-open'); mnav.setAttribute('aria-hidden', 'true'); };
  $('[data-open-menu]').addEventListener('click', () => { mnav.classList.add('is-open'); mnav.setAttribute('aria-hidden', 'false'); });
  $$('[data-close-menu]').forEach(b => b.addEventListener('click', closeMenu));
  mnav.addEventListener('click', e => { if (e.target === mnav) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeNotify(); closeMenu(); } });

  /* ---------- find your cup ---------- */
  const finder = $('.finder');
  const fsteps = $$('.fstep');
  const segs = $$('.finder__segs span');
  const fcount = $('.js-fcount');
  const backBtn = $('.js-back');
  const picks = $('.js-picks');
  const answers = {};
  const LABEL = { coffee: 'Coffee', matcha: 'Matcha', tea: 'Tea', focus: 'Steady focus', calm: 'Calm energy', glow: 'Glow', weight: 'Light & steady', sweet: 'Lightly sweet', none: 'No added sugar' };
  let step = 0;

  const stage = key => $$('.finder__orb > img').forEach(img => img.classList.toggle('is-on', img.dataset.stage === key));
  const renderPicks = () => {
    const vals = ['drink', 'goal', 'sweet'].map(k => answers[k]).filter(Boolean);
    picks.innerHTML = vals.length
      ? vals.map(v => `<span class="pick">${icon('i-check')}${LABEL[v]}</span>`).join('')
      : '<span class="pick pick--hint">Your picks appear here</span>';
  };
  const go = n => {
    step = n;
    fsteps.forEach(s => s.classList.toggle('is-active', +s.dataset.step === n));
    segs.forEach((s, i) => s.classList.toggle('is-on', i <= Math.min(n, 2)));
    fcount.textContent = n < 3 ? `0${n + 1} / 03` : 'Matched';
    backBtn.hidden = n === 0;
    finder.classList.toggle('is-done', n === 3);
    $$('.fopt').forEach(o => o.classList.toggle('is-sel', answers[o.dataset.q] === o.dataset.v));
  };
  const score = p => (p.cats.includes(answers.drink) ? 4 : 0) + (p.goal.includes(answers.goal) ? 3 : 0) + (p.sweet === answers.sweet ? 2 : 0) + (p.stock ? 5 : 0);
  const showResult = () => {
    const ranked = P.slice().sort((a, b) => score(b) - score(a));
    const best = ranked[0];
    const pair = byId(best.pair) || ranked.find(p => p !== best && p.stock);
    const pctMatch = Math.min(98, 78 + score(best) * 1.5);
    const why = [];
    if (best.cats.includes(answers.drink)) why.push(`Made with ${answers.drink === 'coffee' ? 'smooth, low-acid Colombian arabica' : answers.drink === 'matcha' ? 'stone-ground Japanese matcha' : 'creamy coconut'}`);
    else why.push(`Our closest in-stock match while ${LABEL[answers.drink].toLowerCase()} blends are restocking`);
    if (best.goal.includes(answers.goal)) why.push({ focus: 'A steady lift without the edge', calm: 'Calm, focused energy without jitters', glow: 'Collagen for skin, hair and joints', weight: 'Collagen, apple cider vinegar and turmeric' }[answers.goal]);
    why.push(best.sweet === 'none' ? 'No added sugar' : 'Lightly sweet, never syrupy');
    why.push('Ready in 8 seconds, hot or iced');

    $('.js-stage-jar').src = best.img;
    $('.finder__jar').style.setProperty('--tint', best.tint);
    $('.js-fresult').innerHTML = `<div class="fres">
      <div class="fres__top">
        <div class="fres__ring" style="--p:${pctMatch}"><b>${Math.round(pctMatch)}%<small>match</small></b></div>
        <div class="fres__name"><small>Your perfect cup</small><h3>${best.name}</h3><span>${best.sub}</span></div>
      </div>
      <ul class="fres__why">${why.map(w => `<li>${icon('i-check')}${w}</li>`).join('')}</ul>
      <div class="fres__buy"><span class="fres__price">${money(best.price)}</span><button class="btn btn--primary" data-add="${best.id}">Add my match ${icon('i-bag')}</button></div>
      ${pair ? `<div class="fres__pair" style="--tint:${pair.tint}"><div class="fres__pair-img"><img src="${pair.img}" alt="" width="800" height="800"></div><div><small>Pair it, save 5%</small><b>${pair.name} · ${pair.sub}</b></div><button class="btn btn--ghost btn--sm" data-add-bundle="${best.id},${pair.id}">Add both</button></div>` : ''}
      <button class="fres__retake js-retake">Start over</button>
    </div>`;
    go(3);
  };
  $$('.fopt').forEach(o => {
    o.addEventListener('mouseenter', () => { if (step < 2) stage(o.dataset.v); });
    o.addEventListener('mouseleave', () => { if (step < 2) stage(answers.goal || answers.drink || 'default'); });
    o.addEventListener('click', () => {
      answers[o.dataset.q] = o.dataset.v;
      o.classList.add('is-sel');
      if (o.dataset.q !== 'sweet') stage(o.dataset.v);
      renderPicks();
      setTimeout(() => (step < 2 ? go(step + 1) : showResult()), 260);
    });
  });
  backBtn.addEventListener('click', () => go(Math.max(0, step - 1)));
  finder.addEventListener('click', e => {
    if (!e.target.closest('.js-retake')) return;
    Object.keys(answers).forEach(k => delete answers[k]);
    renderPicks(); stage('default'); go(0);
  });

  /* ---------- ingredients ---------- */
  const disc = $$('.ingr__disc img');
  const label = $('.js-ingr-label');
  const setIngr = card => {
    $$('.icard').forEach(c => c.classList.toggle('is-active', c === card));
    const key = card ? card.dataset.i : 'default';
    disc.forEach(img => img.classList.toggle('is-on', img.dataset.c === key));
    label.textContent = card ? $('h3', card).textContent : 'Hover an ingredient';
  };
  $$('.icard').forEach(c => {
    c.addEventListener('mouseenter', () => setIngr(c));
    c.addEventListener('focus', () => setIngr(c));
    c.addEventListener('click', () => setIngr(c));
  });
  $('.ingr').addEventListener('mouseleave', () => setIngr(null));

  /* ---------- reviews ---------- */
  const R = [
    { cat: ['coffee', 'weight'], p: 'wm-coffee', n: 'Michael T.', c: '#7f9466', when: '1 week ago', t: 'Finally a coffee that keeps up', b: 'Smooth, low-acid and just enough caffeine. I drink it iced after the gym and it keeps me full until lunch.', h: 24 },
    { cat: ['matcha', 'weight'], p: 'wm-matcha', n: 'Priya K.', c: '#b47c59', when: '2 weeks ago', t: 'Matcha without the whisk', b: 'Genuinely dissolves with a spoon. My afternoon cup is now the calmest five minutes of my day.', h: 31 },
    { cat: ['coffee'], p: 'coffee-og', n: 'Angela M.', c: '#3b2a1e', when: '3 weeks ago', t: 'Found it at Costco, now I order direct', b: 'Free shipping and it arrives fast. The original coconut coffee tastes like a treat but feels light.', h: 18 },
    { cat: ['matcha', 'weight'], p: 'wm-matcha-og', n: 'Danielle W.', c: '#c9a77c', when: '1 month ago', t: 'Lightly sweet, perfectly creamy', b: 'I was nervous about matcha being grassy. This is creamy and mellow, my kids even steal sips.', h: 12 },
    { cat: ['coffee', 'weight'], p: 'wm-coffee', n: 'Robert L.', c: '#5f7a3c', when: '1 month ago', t: 'No more jitters', b: 'Regular coffee made me anxious by 10am. This gives me a steady lift instead. Subscribed after the first jar.', h: 27 },
    { cat: ['matcha', 'coffee', 'weight'], p: 'wm-matcha', n: 'Sofia H.', c: '#8a7868', when: '2 months ago', t: 'The AM/PM duo is my routine', b: 'Coffee in the morning, matcha after lunch. Love that there\'s no added sugar in either.', h: 22 },
    { cat: ['coffee'], p: 'coffee-og', n: 'Marcus J.', c: '#b47c59', when: '2 months ago', t: 'Travel essential', b: 'I keep a jar at the office and one in my carry-on. Hot water from anywhere and I have a proper latte.', h: 9 },
    { cat: ['matcha', 'weight'], p: 'wm-matcha', n: 'Hannah B.', c: '#7f9466', when: '3 months ago', t: 'Replaced my 3pm snack', b: 'With almond milk it\'s filling and gently sweet without sugar. Easily the best matcha powder I\'ve tried.', h: 15 },
  ];
  let rFilter = 'all';
  let rAll = false;
  const rGrid = $('.js-reviews');
  const moreBtn = $('.js-more-reviews');
  const stars = icon('i-star').repeat(5);
  const renderReviews = () => {
    const list = R.filter(r => rFilter === 'all' || r.cat.includes(rFilter));
    const shown = rAll ? list : list.slice(0, 4);
    rGrid.innerHTML = shown.map((r, i) => {
      const p = byId(r.p);
      return `<article class="rc" style="animation-delay:${i * 60}ms;--tint:${p.tint}">
        <div class="rc__head"><span class="stars">${stars}</span><small>${r.when}</small></div>
        <h4>“${r.t}”</h4>
        <p>${r.b}</p>
        <div class="rc__foot">
          <span class="rv__avatar" style="background:${r.c}">${r.n[0]}</span>
          <span><b>${r.n}</b><small>${icon('i-check')} Verified buyer</small></span>
          <span class="rc__prod"><img src="${p.img}" alt="" width="800" height="800">${p.name}<br>${p.sub}</span>
        </div>
        <button class="rc__help" data-help="${i}">Helpful (${r.h})</button>
      </article>`;
    }).join('');
    moreBtn.style.display = list.length > 4 && !rAll ? '' : 'none';
  };
  renderReviews();
  $$('.rchip').forEach(c => c.addEventListener('click', () => {
    rFilter = c.dataset.r; rAll = false;
    $$('.rchip').forEach(x => x.classList.toggle('is-active', x === c));
    renderReviews();
  }));
  moreBtn.addEventListener('click', () => { rAll = true; renderReviews(); });
  rGrid.addEventListener('click', e => {
    const h = e.target.closest('.rc__help');
    if (!h || h.classList.contains('is-on')) return;
    h.classList.add('is-on');
    h.textContent = h.textContent.replace(/\((\d+)\)/, (m, n) => `(${+n + 1})`) + ' · Thanks!';
  });

  /* ---------- header + sticky cta ---------- */
  const header = $('.header');
  const sticky = $('.sticky-cta');
  const hero = $('.hero');
  const closing = $('.closing');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    const pastHero = y > hero.offsetTop + hero.offsetHeight - 100;
    const nearEnd = closing.getBoundingClientRect().top < window.innerHeight;
    sticky.classList.toggle('is-on', pastHero && !nearEnd);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });
})();
