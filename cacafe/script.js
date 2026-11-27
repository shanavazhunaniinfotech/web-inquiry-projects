(() => {
  'use strict';

  const BUNDLE = [[3, 0.10], [2, 0.05]]; // [min jars, extra off]
  const SUB = 0.10; // subscribe & save

  /* ---------- product data (from cacafe.com; ratings as shown on product pages) ---------- */
  const P = [
    { id: 'wm-coffee', name: 'Weight Management Coffee', sub: 'No Added Sugar', price: 34.99, img: 'images/p-wm-coffee.webp', gallery: ['images/ing-coffee.webp', 'images/ritual-drinks.webp'], cats: ['coffee', 'weight'], goal: ['weight', 'focus'], sweet: 'none', tag: 'Light & Steady', facts: ['90 cal', '0g added sugar', 'Collagen + ACV'], rating: 4.5, count: 12, badge: 'Bestseller', stock: true, tint: '#efe2cf', pair: 'wm-matcha', why: 'Your afternoon match',
      desc: 'High-altitude Colombian arabica with creamy coconut, collagen, apple cider vinegar and turmeric. Sweetened with monk fruit for 90 calories and 0g added sugar per serving, with a gentle 45–50mg of caffeine.',
      ben: ['90 calories per cup', '0g added sugar', 'Collagen for skin & joints', 'Gentle 45–50mg caffeine'] },
    { id: 'wm-matcha', name: 'Weight Management Matcha', sub: 'No Added Sugar', price: 34.99, img: 'images/p-wm-matcha.webp', gallery: ['images/ing-matcha.webp', 'images/matcha-bowl.webp'], cats: ['matcha', 'weight'], goal: ['weight', 'calm'], sweet: 'none', tag: 'Steady Clarity', facts: ['0g added sugar', 'Prebiotic fiber', 'Collagen'], rating: 5.0, count: 8, badge: 'New look', stock: true, tint: '#e1e8d2', pair: 'wm-coffee', why: 'Your morning match',
      desc: 'Stone-ground Japanese matcha with coconut, collagen peptides, apple cider vinegar, turmeric and prebiotic chicory root fiber. 0g added sugar and no artificial sweeteners.',
      ben: ['0g added sugar', 'Prebiotic chicory fiber', 'Calm, steady focus', 'Collagen peptides'] },
    { id: 'wm-matcha-og', name: 'Weight Management Matcha', sub: 'Original Sweetened', price: 34.99, img: 'images/p-wm-matcha-original.webp', gallery: ['images/matcha-bowl.webp', 'images/ing-matcha.webp'], cats: ['matcha', 'weight'], goal: ['weight', 'calm'], sweet: 'sweet', tag: 'Steady Clarity', facts: ['Lightly sweet', 'Turmeric', 'Collagen'], rating: 5.0, count: 21, stock: true, tint: '#e6e3dc', pair: 'coffee-og', why: 'Complete the ritual',
      desc: 'Our functional matcha formula, lightly sweetened. Creamy coconut, collagen, apple cider vinegar and turmeric in every smooth, clump-free cup.',
      ben: ['Lightly sweet', 'Collagen + turmeric', 'Apple cider vinegar', 'Hot, iced or blended'] },
    { id: 'coffee-og', name: 'Coconut Coffee', sub: 'Original', price: 19.99, img: 'images/p-coffee-original.webp', gallery: ['images/story-drinks.webp', 'images/ing-coconut.webp'], cats: ['coffee'], goal: ['focus'], sweet: 'sweet', tag: 'Comfort & Focus', facts: ['Colombian arabica', 'Creamy coconut', 'Hot or iced'], rating: 4.81, count: 120, badge: 'Fan favorite', stock: true, tint: '#f2e7d6', pair: 'wm-matcha', why: 'Customers also love',
      desc: 'The one that started it all: smooth Colombian coffee blended with creamy coconut and a touch of non-GMO cane sugar. Delicious hot or iced, no frother needed.',
      ben: ['Smooth Colombian coffee', 'Creamy coconut', 'Ready in 8 seconds', 'Hot or iced'] },
    { id: 'collagen-coffee', name: 'Coconut Collagen Coffee', sub: 'Unsweetened', price: 24.99, img: 'images/p-collagen-coffee.webp', cats: ['coffee'], goal: ['glow'], sweet: 'none', tag: 'Vitality & Glow', stock: false, tint: '#f1e9dc' },
    { id: 'coconut-matcha', name: 'Coconut Matcha', sub: 'Reduced Sugar', price: 19.99, img: 'images/p-coconut-matcha.webp', cats: ['matcha'], goal: ['calm'], sweet: 'sweet', tag: 'Calm Clarity', rating: 4.84, count: 61, stock: false, tint: '#dfe7d3' },
    { id: 'coconut-tea', name: 'Coconut Tea', sub: 'Reduced Sugar', price: 19.99, img: 'images/p-coconut-tea.webp', cats: ['tea'], goal: ['calm'], sweet: 'sweet', tag: 'Daily Balance', rating: 4.76, count: 67, stock: false, tint: '#ece7df' },
    { id: 'tea-unsw', name: 'Coconut Milk Tea', sub: 'Unsweetened', price: 16.00, img: 'images/p-tea-unsweetened.webp', cats: ['tea'], goal: ['calm'], sweet: 'none', tag: 'Daily Balance', stock: false, tint: '#f6e3cf' },
    { id: 'coffee-unsw', name: 'Coconut Coffee', sub: 'Unsweetened', price: 19.99, img: 'images/p-coffee-unsweetened.webp', cats: ['coffee'], goal: ['focus'], sweet: 'none', tag: 'Comfort & Focus', stock: false, tint: '#efe2cf' },
  ];
  const byId = id => P.find(p => p.id === id);

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
  const stars5 = icon('i-star').repeat(5);
  const fmtRate = r => (Number.isInteger(r) ? r.toFixed(1) : String(r));

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
        <div class="pc__badges">${p.badge ? `<span class="chip">${p.badge}</span>` : ''}</div>
        <img class="pc__jar" src="${p.img}" alt="${p.name}, ${p.sub}" loading="lazy" width="800" height="800">
        <button class="pc__qv" data-qv="${p.id}">${icon('i-search')} Quick view</button>
      </div>
      <div class="pc__body">
        <div class="pc__meta"><span class="pc__tag">${p.tag}</span><span class="pc__rate">${icon('i-star')} ${fmtRate(p.rating)} <small>(${p.count})</small></span></div>
        <h3 class="pc__name">${p.name}</h3>
        ${card.labels ? '' : `<p class="pc__sub">${p.sub}</p>`}
        ${vars}
        <div class="pc__facts">${p.facts.map(f => `<span>${f}</span>`).join('')}</div>
        <p class="pc__subsave">${icon('i-repeat')} or ${money(p.price * (1 - SUB))} with Subscribe &amp; Save</p>
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
        <div class="pc__meta"><span class="pc__tag">The AM/PM Duo</span><span class="pc__rate">2 jars</span></div>
        <h3 class="pc__name">Coffee by morning, matcha by afternoon</h3>
        <div class="pc__facts"><span>No added sugar</span><span>Collagen in both</span><span>Most gifted</span></div>
        <p class="pc__subsave">${icon('i-gift')} Bundle price applied in cart</p>
        <button class="pc__add" data-add-bundle="${card.bundle.join(',')}"><span>${icon('i-gift')} Add both</span><em><s>${money(full)}</s>${money(full * 0.95)}</em></button>
      </div>
    </article>`;
  };
  const soonCard = p => `<article class="sc" style="--tint:${p.tint}">
      <div class="sc__img"><span class="sc__chip">Restocking</span><img src="${p.img}" alt="${p.name}, ${p.sub}" loading="lazy" width="800" height="800"></div>
      <div class="sc__body">
        <b>${p.name}</b>
        <div class="sc__meta"><span>${p.sub}</span>${p.rating ? `<span>${icon('i-star')} ${p.rating} (${p.count})</span>` : `<span>${money(p.price)}</span>`}</div>
        <button class="sc__btn" data-notify="${p.id}">${icon('i-bell')} Notify me</button>
      </div>
    </article>`;

  const renderGrid = (filter = currentFilter) => {
    currentFilter = filter;
    const match = ids => ids.some(id => filter === 'all' || byId(id).cats.includes(filter));
    const list = CARDS.map((c, idx) => ({ c, idx })).filter(({ c }) => match(c.ids || c.bundle));
    grid.innerHTML = list.length
      ? list.map(({ c, idx }, i) => (c.bundle ? bundleCard(c, i) : productCard(c, idx, i))).join('')
      : `<div class="pgrid__empty"><h3>Our tea blends are brewing a fresh batch</h3><p>Join the restock list below and you'll be the first to know when they're back.</p><button class="btn btn--primary" data-notify="coconut-tea">${icon('i-bell')} Notify me</button></div>`;
    const soon = P.filter(p => !p.stock && (filter === 'all' || p.cats.includes(filter)));
    soonTrack.innerHTML = soon.map(soonCard).join('');
    soonTrack.scrollLeft = 0;
    $('.js-soon-count').textContent = `${soon.length} blend${soon.length === 1 ? '' : 's'} brewing`;
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
    closeQV();
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

  /* ---------- quick view ---------- */
  const qv = $('#qv');
  let qvState = null;
  const qvGroup = id => CARDS.find(c => c.ids && c.ids.includes(id));
  const renderQV = () => {
    const { id, img, qty, plan } = qvState;
    const p = byId(id);
    const imgs = [p.img, ...(p.gallery || [])];
    const cur = imgs[img] || p.img;
    $('.qv__card').style.setProperty('--tint', p.tint);
    $('.js-qv-main').innerHTML = `<img src="${cur}" alt="${p.name}" class="${img === 0 ? 'is-jar' : ''}">`;
    $('.js-qv-thumbs').innerHTML = imgs.map((s, n) => `<button class="${n === img ? 'is-on' : ''}" data-qv-img="${n}" aria-label="Image ${n + 1}"><img src="${s}" alt="" class="${n === 0 ? 'is-jar' : ''}"></button>`).join('');
    const g = qvGroup(id);
    const vars = g && g.labels ? `<div class="pc__vars">${g.labels.map((l, n) => `<button class="pc__var ${g.ids[n] === id ? 'is-on' : ''}" data-qv-var="${g.ids[n]}">${l}</button>`).join('')}</div>` : '';
    const subPrice = p.price * (1 - SUB);
    $('.js-qv-info').innerHTML = `
      <span class="qv__tag">${p.tag}</span>
      <h3 id="qv-title">${p.name}${g && g.labels ? '' : `<br><span style="color:var(--muted);font-size:1.2rem">${p.sub}</span>`}</h3>
      <div class="qv__rate"><span class="stars">${stars5}</span><b>${fmtRate(p.rating)}</b> · ${p.count} reviews</div>
      ${vars}
      <p class="qv__desc">${p.desc}</p>
      <ul class="qv__ben">${p.ben.map(b => `<li>${icon('i-check')}${b}</li>`).join('')}</ul>
      <div class="qv__opts">
        <label class="qv__opt"><input type="radio" name="qvplan" value="once" ${plan === 'once' ? 'checked' : ''}><span>One-time purchase</span><b>${money(p.price)}</b></label>
        <label class="qv__opt"><input type="radio" name="qvplan" value="sub" ${plan === 'sub' ? 'checked' : ''}><span>Subscribe &amp; Save 10%<small>Delivered every 30 days. Skip or cancel anytime.</small></span><b>${money(subPrice)}</b></label>
      </div>
      <div class="qv__buy">
        <div class="qty"><button data-qv-q="-1" aria-label="Decrease">${icon('i-minus')}</button><span>${qty}</span><button data-qv-q="1" aria-label="Increase">${icon('i-plus')}</button></div>
        <button class="btn btn--primary btn--lg js-qv-add">Add to cart · ${money((plan === 'sub' ? subPrice : p.price) * qty)}</button>
      </div>
      <div class="qv__how"><span>${icon('d-truck')} Free shipping</span><span>${icon('d-heart')} 30-day Love-It Guarantee</span><span>${icon('d-bolt')} Ready in 8 seconds</span></div>`;
  };
  function openQV(id) {
    qvState = { id, img: 0, qty: 1, plan: 'once' };
    renderQV();
    qv.classList.add('is-open'); qv.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('.qv__x').focus(), 120);
  }
  function closeQV() {
    if (!qv.classList.contains('is-open')) return;
    qv.classList.remove('is-open'); qv.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  qv.addEventListener('click', e => {
    if (e.target === qv || e.target.closest('[data-close-qv]')) { closeQV(); return; }
    const t = e.target.closest('[data-qv-img]');
    if (t) { qvState.img = +t.dataset.qvImg; renderQV(); return; }
    const v = e.target.closest('[data-qv-var]');
    if (v) { qvState.id = v.dataset.qvVar; qvState.img = 0; renderQV(); return; }
    const q = e.target.closest('[data-qv-q]');
    if (q) { qvState.qty = Math.max(1, qvState.qty + +q.dataset.qvQ); renderQV(); return; }
    if (e.target.closest('.js-qv-add')) {
      const { id, qty, plan } = qvState;
      add(id, qty, true);
      if (plan === 'sub') $('.js-sub').checked = true;
      openCart();
      toast(`${byId(id).name} added${plan === 'sub' ? ' with Subscribe & Save' : ''}`);
    }
  });
  qv.addEventListener('change', e => { if (e.target.name === 'qvplan') { qvState.plan = e.target.value; renderQV(); } });

  /* ---------- global clicks ---------- */
  document.addEventListener('click', e => {
    if (e.target.closest('#qv')) return;
    const qvb = e.target.closest('[data-qv]');
    if (qvb) { openQV(qvb.dataset.qv); return; }
    const a = e.target.closest('[data-add]');
    if (a) { add(a.dataset.add); toast(`${byId(a.dataset.add).name} added to your ritual`); return; }
    const b = e.target.closest('[data-add-bundle]');
    if (b) { b.dataset.addBundle.split(',').forEach(id => add(id, 1, true)); openCart(); toast('Duo added. 5% off unlocked'); return; }
    const up = e.target.closest('[data-up-add]');
    if (up) { add(up.dataset.upAdd, 1, true); toast(`${byId(up.dataset.upAdd).name} added`); return; }
    const q = e.target.closest('[data-q][data-d]');
    if (q) { const l = cart.find(x => x.id === q.dataset.q); if (l) setQty(l.id, l.qty + +q.dataset.d); return; }
    const rm = e.target.closest('[data-rm]');
    if (rm) { setQty(rm.dataset.rm, 0); return; }
    const n = e.target.closest('[data-notify]');
    if (n) { openNotify(n.dataset.notify); return; }
    const v = e.target.closest('.pc__var[data-card]');
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
    if (s) { const card = $('.sc', soonTrack); soonTrack.scrollBy({ left: ((card ? card.offsetWidth : 260) + 16) * +s.dataset.soon, behavior: 'smooth' }); }
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
  $('.js-soon-form').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast("You're on the restock list for every blend."); });
  $('.js-news').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('Welcome! Your 10% code is on its way.'); });

  /* ---------- mobile menu ---------- */
  const mnav = $('#mnav');
  const closeMenu = () => { mnav.classList.remove('is-open'); mnav.setAttribute('aria-hidden', 'true'); };
  $('[data-open-menu]').addEventListener('click', () => { mnav.classList.add('is-open'); mnav.setAttribute('aria-hidden', 'false'); });
  $$('[data-close-menu]').forEach(b => b.addEventListener('click', closeMenu));
  mnav.addEventListener('click', e => { if (e.target === mnav) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeQV(); closeCart(); closeNotify(); closeMenu(); } });

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

  /* ---------- reviews: customer reviews shown on cacafe.com product pages ---------- */
  const R = [
    ['Alberto Morelos', 'Great coffee', 'The original is what hooked me.', 'coffee-og'],
    ['Paula V', 'Delicious', "Only coffee I'll drink.", 'coffee-og'],
    ['Amorette', 'My go to coffee', "Since trying this coffee I haven't found anything comparable...", 'coffee-og'],
    ['Scott Dhalliwal', 'IT GREAT', "I'm 72 never had coffee found this and it Great", 'coffee-og'],
    ['Heather Glaser', 'The Best Coffee', 'I love this coffee, I have been drinking it for years.', 'coffee-og'],
    ['Osvaldo Galaviz Jr.', 'Great product', 'It has helped a lot I feel more energized and motivated to start my day!', 'wm-matcha'],
    ['Bev Rietveld', 'Coconut weight management matcha/no sugar added.', 'Excellent matcha tea and exactly what I needed with the no sugar added.', 'wm-matcha'],
    ['Anibal Mendez', '', 'I been drinking coconut matcha for about two years.', 'wm-matcha'],
    ['Tracy Navetta', 'Great service', 'Saved me time!', 'wm-matcha'],
    ['Dao Nguyen', 'Matcha weight management', 'I love this matcha drink..just what I need to start my day', 'wm-matcha-og'],
    ['Rick Clift', 'We love the matcha', "We love the matcha drink it's simple to make and it's delicious", 'wm-matcha-og'],
    ['R.C.', '', 'My wife and I love the coconut matcha it is delicious', 'wm-matcha-og'],
    ['Linda Williams', '', "I was skeptical at first because I don't particularly care for the taste of matcha.", 'wm-matcha-og'],
    ['Dao Nguyen', 'Coconut matcha weight managent', "I love this product and I've been ordering it for quite a few years now.", 'wm-matcha-og'],
    ['Victoria Davis', 'Worth The Cost', 'The taste is simply delicious.', 'wm-coffee'],
    ['Tracey Carter', 'Awesome', 'I love this coffee!', 'wm-coffee'],
    ['Alberto Morelos', 'Good', 'Love coconut coffee. Love the one with collagen.', 'wm-coffee'],
    ['Robert Rojo', 'Love every sip of Coconut Matcha!', 'Coconut Matcha has continued to be one of my favorite flavors CAcafe has available.', 'coconut-matcha'],
    ['Peggy Higginbotham', 'My Daily Treat', "I admit I'm addicted to the coconut matcha and the coconut coffee.", 'coconut-matcha'],
    ['Lori Parker', 'Coconut matcha', 'I love coconut matcha and have been drinking it for years.', 'coconut-matcha'],
    ['Sasha Williams', 'Yummy', 'Creamy and delicious my favorite!', 'coconut-matcha'],
    ['Patty', 'Coconut tea', 'I loved your coconut tea started my day with it each morning for years.', 'coconut-tea'],
    ['Bev Rietveld', 'Coconut Milk Tea.', 'It would be lost first thing in the morning without it!!!!', 'coconut-tea'],
  ];
  const AV = ['#c9a77c', '#7f9466', '#b47c59', '#3b2a1e', '#5f7a3c', '#8a7868'];
  const rtrack = $('.js-rtrack');
  rtrack.innerHTML = R.map(([n, t, b, pid], i) => {
    const p = byId(pid);
    return `<article class="rc" style="--tint:${p.tint}">
      ${icon('i-quote').replace('<svg>', '<svg class="rc__q">')}
      ${t ? `<h4>${t}</h4>` : ''}
      <p>“${b}”</p>
      <div class="rc__foot">
        <span class="rc__av" style="background:${AV[i % AV.length]}">${n[0]}</span>
        <span class="rc__who"><b>${n}</b><small>${icon('i-check')} Verified review</small></span>
        <span class="rc__prod" title="${p.name}, ${p.sub}"><img src="${p.img}" alt="" width="800" height="800"></span>
      </div>
      <span class="rc__tag">${p.name} · ${p.sub}</span>
    </article>`;
  }).join('');
  const rprog = $('.js-rprog');
  const rcount = $('.js-rcount');
  const updRev = () => {
    const max = rtrack.scrollWidth - rtrack.clientWidth;
    const vis = rtrack.clientWidth / rtrack.scrollWidth;
    const pos = max > 0 ? rtrack.scrollLeft / max : 0;
    rprog.style.width = (vis * 100) + '%';
    rprog.style.marginLeft = (pos * (1 - vis) * 100) + '%';
    const card = $('.rc', rtrack);
    const w = card ? card.offsetWidth + 16 : 1;
    const first = Math.round(rtrack.scrollLeft / w) + 1;
    const last = Math.min(R.length, first + Math.round(rtrack.clientWidth / w) - 1);
    rcount.textContent = `${first}–${last} of ${R.length}`;
  };
  rtrack.addEventListener('scroll', updRev, { passive: true });
  window.addEventListener('resize', updRev);
  updRev();
  $$('[data-rv]').forEach(b => b.addEventListener('click', () => {
    const card = $('.rc', rtrack);
    const w = card ? card.offsetWidth + 16 : 300;
    const max = rtrack.scrollWidth - rtrack.clientWidth;
    const dir = +b.dataset.rv;
    if (dir > 0 && rtrack.scrollLeft >= max - 4) rtrack.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir < 0 && rtrack.scrollLeft <= 4) rtrack.scrollTo({ left: max, behavior: 'smooth' });
    else rtrack.scrollBy({ left: w * dir, behavior: 'smooth' });
  }));
  rtrack.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); $('[data-rv="1"]').click(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); $('[data-rv="-1"]').click(); }
  });
  $('.js-rprods').innerHTML = P.filter(p => p.count).sort((a, b) => b.count - a.count).map(p =>
    `<li style="--tint:${p.tint}"><span><img src="${p.img}" alt="" width="800" height="800"></span><span><b>${p.name}</b> <small>${p.sub}</small><br>${icon('i-star')}${fmtRate(p.rating)} <small>· ${p.count} reviews</small></span></li>`).join('');

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
