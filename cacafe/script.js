(() => {
  'use strict';

  const BF = 0.15; // Black Friday discount
  const BUNDLE = [[3, 0.10], [2, 0.05]]; // [min jars, extra off]

  const P = [
    { id: 'wm-coffee', name: 'Weight Management Coffee', sub: 'No Added Sugar', price: 34.99, img: 'images/p-wm-coffee.webp', cats: ['coffee', 'weight'], goal: ['weight', 'focus'], sweet: 'none', tag: 'Light & Steady', notes: ['Collagen', 'ACV', 'Turmeric'], badge: 'Bestseller', stock: true, tint: '#efe2cf', pair: 'wm-matcha', why: 'Your afternoon match' },
    { id: 'wm-matcha', name: 'Weight Management Matcha', sub: 'No Added Sugar', price: 34.99, img: 'images/p-wm-matcha.webp', cats: ['matcha', 'weight'], goal: ['weight', 'calm'], sweet: 'none', tag: 'Steady Clarity', notes: ['Collagen', 'Prebiotic fiber', 'ACV'], badge: 'New look', stock: true, tint: '#e1e8d2', pair: 'wm-coffee', why: 'Your morning match' },
    { id: 'coffee-og', name: 'Coconut Coffee', sub: 'Original', price: 19.99, img: 'images/p-coffee-original.webp', cats: ['coffee'], goal: ['focus'], sweet: 'sweet', tag: 'Comfort & Focus', notes: ['Colombian arabica', 'Coconut milk'], badge: 'Fan favorite', stock: true, tint: '#f2e7d6', pair: 'wm-matcha', why: 'Customers also love' },
    { id: 'wm-matcha-og', name: 'Weight Management Matcha', sub: 'Original Sweetened', price: 34.99, img: 'images/p-wm-matcha-original.webp', cats: ['matcha', 'weight'], goal: ['weight', 'calm'], sweet: 'sweet', tag: 'Steady Clarity', notes: ['Collagen', 'Turmeric', 'ACV'], stock: true, tint: '#e6e3dc', pair: 'coffee-og', why: 'Complete the ritual' },
    { id: 'collagen-coffee', name: 'Coconut Collagen Coffee', sub: 'Unsweetened', price: 24.99, img: 'images/p-collagen-coffee.webp', cats: ['coffee'], goal: ['glow'], sweet: 'none', tag: 'Vitality & Glow', notes: ['Collagen', 'Coconut'], stock: false, tint: '#f1e9dc' },
    { id: 'coconut-matcha', name: 'Coconut Matcha', sub: 'Reduced Sugar', price: 19.99, img: 'images/p-coconut-matcha.webp', cats: ['matcha'], goal: ['calm'], sweet: 'sweet', tag: 'Calm Clarity', notes: ['Japanese matcha', 'Coconut'], stock: false, tint: '#dfe7d3' },
    { id: 'coconut-tea', name: 'Coconut Tea', sub: 'Reduced Sugar', price: 19.99, img: 'images/p-coconut-tea.webp', cats: ['tea'], goal: ['calm'], sweet: 'sweet', tag: 'Daily Balance', notes: ['Green tea', 'Coconut'], stock: false, tint: '#ece7df' },
    { id: 'tea-unsw', name: 'Coconut Milk Tea', sub: 'Unsweetened', price: 16.00, compare: 19.99, img: 'images/p-tea-unsweetened.webp', cats: ['tea'], goal: ['calm'], sweet: 'none', tag: 'Daily Balance', notes: ['Green tea', 'Coconut'], stock: false, tint: '#f6e3cf' },
    { id: 'coffee-unsw', name: 'Coconut Coffee', sub: 'Unsweetened', price: 19.99, img: 'images/p-coffee-unsweetened.webp', cats: ['coffee'], goal: ['focus'], sweet: 'none', tag: 'Comfort & Focus', notes: ['Colombian arabica', 'Coconut'], stock: false, tint: '#efe2cf' },
  ];
  const byId = id => P.find(p => p.id === id);
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const money = n => '$' + n.toFixed(2);
  const bf = n => Math.round(n * (1 - BF) * 100) / 100;
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

  /* ---------- countdown (placeholder end: Dec 1 2026, 00:00 PT) ---------- */
  const END = new Date('2026-12-01T08:00:00Z').getTime();
  const tick = () => {
    let s = Math.max(0, Math.floor((END - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60);
    const txt = `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
    $$('.js-countdown').forEach(el => (el.textContent = txt));
  };
  tick(); setInterval(tick, 30000);

  /* ---------- product grid ---------- */
  const grid = $('.js-grid');
  const priceHTML = p => {
    const was = p.compare || p.price;
    return `<div class="price"><b>${money(bf(p.price))}</b><s>${money(was)}</s></div>`;
  };
  const cardHTML = (p, i) => {
    const badges = [];
    if (!p.stock) badges.push('<span class="chip chip--dark">Sold out</span>');
    else if (p.badge) badges.push(`<span class="chip">${p.badge}</span>`);
    badges.push('<span class="chip chip--gold">−15%</span>');
    return `<article class="card ${p.stock ? '' : 'is-out'}" style="--tint:${p.tint};animation-delay:${i * 60}ms">
      <div class="card__media">
        <div class="card__badges">${badges.join('')}</div>
        <img src="${p.img}" alt="${p.name}, ${p.sub}" loading="lazy" width="800" height="800">
        <div class="card__quick">${p.stock
          ? `<button class="btn" data-add="${p.id}">Quick add ${icon('i-bag')}</button>`
          : `<button class="btn" data-notify="${p.id}">Notify me when back ${icon('i-bell')}</button>`}</div>
      </div>
      <div class="card__body">
        <span class="card__tag">${p.tag}</span>
        <h3 class="card__name">${p.name}</h3>
        <p class="card__sub">${p.sub}</p>
        <div class="card__notes">${p.notes.map(n => `<span>${n}</span>`).join('')}</div>
        <div class="card__foot">${priceHTML(p)}${p.stock
          ? `<button class="add" data-add="${p.id}" aria-label="Add ${p.name} ${p.sub} to cart">${icon('i-plus')}</button>`
          : `<button class="add add--notify" data-notify="${p.id}" aria-label="Notify me when ${p.name} is back">${icon('i-bell')}</button>`}</div>
      </div>
    </article>`;
  };
  const GOAL_MAP = { focus: 'coffee', calm: 'matcha', glow: 'coffee', weight: 'weight' };
  const renderGrid = (filter = 'all', goal) => {
    let list = P.filter(p => filter === 'all' || p.cats.includes(filter));
    if (goal) list = [...list].sort((a, b) => (b.goal.includes(goal) - a.goal.includes(goal)));
    list = [...list].sort((a, b) => b.stock - a.stock);
    if (filter === 'all' && !goal) list = list.slice(0, 8);
    grid.innerHTML = list.map(cardHTML).join('');
    $$('.tab').forEach(t => t.classList.toggle('is-active', t.dataset.tab === filter));
  };
  renderGrid();
  $$('.tab').forEach(t => t.addEventListener('click', () => renderGrid(t.dataset.tab)));
  $$('[data-filter]').forEach(a => a.addEventListener('click', () => renderGrid(a.dataset.filter)));
  $$('[data-goal]').forEach(g => g.addEventListener('click', () => {
    const goal = g.dataset.goal;
    renderGrid(GOAL_MAP[goal], goal);
    $('#shop').scrollIntoView({ behavior: 'smooth' });
  }));
  $('.grid-foot .link-arrow').addEventListener('click', () => {
    const list = P.slice().sort((a, b) => b.stock - a.stock);
    grid.innerHTML = list.map(cardHTML).join('');
    $$('.tab').forEach(t => t.classList.toggle('is-active', t.dataset.tab === 'all'));
  });

  /* ---------- cart state ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('cacafe-cart') || '[]').filter(l => byId(l.id)); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem('cacafe-cart', JSON.stringify(cart)); } catch (e) {} };

  const cartEl = $('#cart');
  const overlay = $('.overlay');
  const openCart = () => {
    cartEl.classList.add('is-open'); overlay.classList.add('is-open');
    cartEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('[data-close-cart].icon-btn', cartEl).focus(), 100);
  };
  const closeCart = () => {
    cartEl.classList.remove('is-open'); overlay.classList.remove('is-open');
    cartEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
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
    if (!silent) { openCart(); }
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
    const was = cart.reduce((n, l) => { const p = byId(l.id); return n + (p.compare || p.price) * l.qty; }, 0);
    const bfOff = subtotal * BF;
    const rate = (BUNDLE.find(([min]) => jars >= min) || [0, 0])[1];
    const bundleOff = (subtotal - bfOff) * rate;
    const total = subtotal - bfOff - bundleOff;
    return { jars, subtotal, was, bfOff, rate, bundleOff, total };
  };

  let upsIdx = 0;
  const upsellList = () => {
    const inCart = new Set(cart.map(l => l.id));
    const pairs = cart.map(l => byId(l.id).pair).filter(id => id && !inCart.has(id));
    const rest = P.filter(p => p.stock && !inCart.has(p.id) && !pairs.includes(p.id)).map(p => p.id);
    return [...new Set([...pairs, ...rest])].map(byId);
  };
  const whyFor = p => {
    const src = cart.find(l => byId(l.id).pair === p.id);
    if (src) return byId(src.id).why;
    return cart.length ? 'Customers also bought' : 'Bestseller';
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
          <div class="line__price">${money(bf(p.price) * l.qty)}<s>${money((p.compare || p.price) * l.qty)}</s></div>
          <button class="line__rm" data-rm="${p.id}">Remove</button>
        </div>
      </li>`;
    }).join('');

    // tier progress
    const pct = t.jars >= 3 ? 100 : t.jars === 2 ? 50 : t.jars === 1 ? 18 : 0;
    $('.js-tier-fill').style.width = pct + '%';
    $$('.tier__node').forEach(n => n.classList.toggle('is-on', t.jars >= +n.dataset.tier));
    const msg = $('.js-tier-msg');
    if (t.jars === 0) msg.innerHTML = 'Free shipping on every order. Bundle <b>2+ jars</b> to save even more.';
    else if (t.jars === 1) msg.innerHTML = 'Add <b>1 more jar</b> to unlock an <b>extra 5% off</b>';
    else if (t.jars === 2) msg.innerHTML = 'Nice! 5% unlocked. Add <b>1 more jar</b> for an <b>extra 10% off</b>';
    else msg.innerHTML = '🎉 Ritual bundle unlocked: <b>extra 10% off</b> your order';

    // upsells
    const ups = upsellList();
    $('.js-upsell-title').textContent = cart.length ? 'Pairs perfectly with' : 'Our bestsellers';
    $('.js-upsells').innerHTML = ups.map(p => `<div class="up">
        <div class="up__img" style="--tint:${p.tint}"><img src="${p.img}" alt="" width="800" height="800"></div>
        <div>
          <span class="up__why">${whyFor(p)}</span>
          <h4>${p.name} <span style="color:var(--muted)">· ${p.sub}</span></h4>
          <div class="up__row">${priceHTML(p)}<button class="up__add" data-up-add="${p.id}">${icon('i-plus')} Add</button></div>
        </div>
      </div>`).join('');
    $('.cart__upsell').style.display = ups.length ? '' : 'none';
    upsIdx = 0;

    // summary
    $('.js-subtotal').textContent = money(t.subtotal);
    $('.js-bf').textContent = '−' + money(t.bfOff);
    $('.js-bundle-row').hidden = !t.rate;
    $('.js-bundle').textContent = '−' + money(t.bundleOff) + ` (${t.rate * 100}%)`;
    $('.js-total').textContent = money(t.total);
    $('.js-was').textContent = t.was > t.total ? money(t.was) : '';
    $('.js-save-note').textContent = t.was - t.total > 0.01 ? `You're saving ${money(t.was - t.total)} today` : '';
    $('.js-checkout').disabled = !cart.length;
    $('.js-checkout').style.opacity = cart.length ? '' : '.45';
  };

  // delegated clicks
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]');
    if (a) { add(a.dataset.add); toast(`${byId(a.dataset.add).name} added to your ritual`); return; }
    const b = e.target.closest('[data-add-bundle]');
    if (b) { b.dataset.addBundle.split(',').forEach(id => add(id, 1, true)); openCart(); toast('AM/PM Duo added: extra 5% unlocked'); return; }
    const up = e.target.closest('[data-up-add]');
    if (up) { add(up.dataset.upAdd, 1, true); toast(`${byId(up.dataset.upAdd).name} added`); return; }
    const q = e.target.closest('[data-q][data-d]');
    if (q) { const l = cart.find(x => x.id === q.dataset.q); if (l) setQty(l.id, l.qty + +q.dataset.d); return; }
    const rm = e.target.closest('[data-rm]');
    if (rm) { setQty(rm.dataset.rm, 0); return; }
    const n = e.target.closest('[data-notify]');
    if (n) { openNotify(n.dataset.notify); return; }
    const u = e.target.closest('[data-ups]');
    if (u) {
      const track = $('.js-upsells');
      const cards = $$('.up', track);
      upsIdx = Math.max(0, Math.min(cards.length - 1, upsIdx + +u.dataset.ups));
      if (cards[upsIdx]) track.scrollTo({ left: cards[upsIdx].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }
  });

  $('.js-sub').addEventListener('change', e => toast(e.target.checked ? 'Subscribed: 10% off every refill, cancel anytime' : 'Subscription removed'));
  $('.js-checkout').addEventListener('click', () => toast('Prototype: this would continue to Shopify checkout'));

  renderCart();

  /* ---------- notify modal ---------- */
  const modal = $('#notify');
  const openNotify = id => {
    const p = byId(id);
    $('.js-notify-img').src = p.img;
    $('.js-notify-img').alt = p.name;
    $('.js-notify-name').textContent = `${p.name}, ${p.sub}`;
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => $('#notify-email').focus(), 150);
  };
  const closeNotify = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); };
  $$('[data-close-modal]').forEach(b => b.addEventListener('click', closeNotify));
  modal.addEventListener('click', e => { if (e.target === modal) closeNotify(); });
  $('.js-notify-form').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); closeNotify(); toast("You're on the list. We'll email you when it's back."); });
  $('.js-news').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('Welcome! Your 10% code is on its way.'); });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    closeCart(); closeNotify(); closeMenu();
  });

  /* ---------- mobile menu ---------- */
  const mnav = $('#mnav');
  const closeMenu = () => { mnav.classList.remove('is-open'); mnav.setAttribute('aria-hidden', 'true'); };
  $('[data-open-menu]').addEventListener('click', () => { mnav.classList.add('is-open'); mnav.setAttribute('aria-hidden', 'false'); });
  $$('[data-close-menu]').forEach(b => b.addEventListener('click', closeMenu));
  mnav.addEventListener('click', e => { if (e.target === mnav) closeMenu(); });

  /* ---------- ingredients accordion ---------- */
  $$('.ingr__item').forEach(item => {
    $('button', item).addEventListener('click', () => {
      const i = item.dataset.ingr;
      $$('.ingr__item').forEach(x => x.classList.toggle('is-active', x === item));
      $$('[data-ingr-img]').forEach(img => img.classList.toggle('is-active', img.dataset.ingrImg === i));
      $('.js-ingr-tag').textContent = item.dataset.tag;
    });
  });

  /* ---------- quiz ---------- */
  const answers = {};
  const steps = $$('.quiz__step');
  const bar = $('.js-quiz-bar');
  const count = $('.js-quiz-count');
  const go = n => {
    steps.forEach(s => s.classList.toggle('is-active', +s.dataset.step === n));
    bar.style.width = Math.min(100, ((n + 1) / 3) * 100) + '%';
    count.textContent = n < 3 ? `Question ${n + 1} of 3` : 'Your match is ready';
  };
  const score = p => {
    let s = 0;
    if (p.cats.includes(answers.drink)) s += 4;
    if (p.goal.includes(answers.goal)) s += 3;
    if (p.sweet === answers.sweet) s += 2;
    if (p.stock) s += 5;
    return s;
  };
  const showResult = () => {
    const ranked = P.slice().sort((a, b) => score(b) - score(a));
    const best = ranked[0];
    const alt = ranked.find(p => p !== best && p.stock);
    $('.js-result').innerHTML = `
      <div class="result__img" style="--tint:${best.tint}"><img src="${best.img}" alt="${best.name}" width="800" height="800"></div>
      <div>
        <span class="card__tag">${best.tag}</span>
        <h4>${best.name}<br><span style="color:var(--muted);font-size:1.1rem">${best.sub}</span></h4>
        <p>${best.notes.join(' · ')}. Ready in 8 seconds, hot or iced.</p>
        ${priceHTML(best)}
        <button class="btn btn--primary" data-add="${best.id}">Add my match ${icon('i-bag')}</button>
      </div>
      ${alt ? `<div class="result__alt">Also great for you: <button data-add="${alt.id}">${alt.name}, ${alt.sub}</button></div>` : ''}`;
    go(3);
  };
  $$('.opt').forEach(o => o.addEventListener('click', () => {
    answers[o.dataset.q] = o.dataset.v;
    const cur = +o.closest('.quiz__step').dataset.step;
    if (cur < 2) go(cur + 1); else showResult();
  }));
  $('.js-quiz-reset').addEventListener('click', () => go(0));

  /* ---------- reviews carousel ---------- */
  $$('[data-rev]').forEach(b => b.addEventListener('click', () => {
    const track = $('.js-reviews');
    const card = $('.review', track);
    track.scrollBy({ left: (card.offsetWidth + 20) * +b.dataset.rev, behavior: 'smooth' });
  }));

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
    // gentle parallax on hero jars
    if (y < 900) {
      $$('.hero__jar').forEach((j, i) => { j.style.transform = `translateY(${y * (i ? -0.06 : -0.1)}px)`; });
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveal + counters ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });

  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; const to = +el.dataset.count; const t0 = performance.now();
      const step = now => {
        const k = Math.min(1, (now - t0) / 1400);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => cio.observe(el));
})();
