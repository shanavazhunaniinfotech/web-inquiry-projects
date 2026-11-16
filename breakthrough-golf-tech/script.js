(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = (n) => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  /* ---------- Image fallbacks (client CDN → YouTube stills) ---------- */
  const fallback = (img) => {
    const fb = img.dataset.fb;
    if (fb && img.src !== fb) { img.src = fb; return; }
    const mark = img.closest('.logo__mark');
    if (mark) mark.classList.add('no-img');
    else img.style.visibility = 'hidden';
  };
  $$('img').forEach((img) => {
    img.addEventListener('error', () => fallback(img));
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src') && !img.src.startsWith('data:')) fallback(img);
  });

  /* ---------- Announcement bar ---------- */
  const msgs = $$('.announce__msg');
  let ai = 0, annTimer;
  const showAnn = (n) => {
    const prev = msgs[ai];
    ai = (n + msgs.length) % msgs.length;
    if (prev === msgs[ai]) return;
    prev.classList.remove('is-on'); prev.classList.add('is-out');
    setTimeout(() => prev.classList.remove('is-out'), 650);
    msgs[ai].classList.add('is-on');
  };
  const annAuto = () => { clearInterval(annTimer); annTimer = setInterval(() => showAnn(ai + 1), 4500); };
  $$('[data-ann]').forEach((b) => b.addEventListener('click', () => { showAnn(ai + +b.dataset.ann); annAuto(); }));
  annAuto();

  /* ---------- Header + scroll progress ---------- */
  const header = $('.header');
  const prog = $('.scroll-progress');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    const hide = y > 700 && y > lastY + 4 && !header.matches(':hover');
    if (hide) header.classList.add('is-hidden'); else if (y < lastY - 4 || y < 700) header.classList.remove('is-hidden');
    lastY = y;
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    techScroll();
  };
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Hero slider (8s autoplay) ---------- */
  const slides = $$('.slide');
  const tabs = $$('.hero__tab');
  const DURATION = 8000;
  let cur = 0, start = performance.now(), paused = false, pausedAt = 0;
  const go = (n) => {
    slides[cur].classList.remove('is-active');
    tabs[cur].classList.remove('is-active'); tabs[cur].setAttribute('aria-selected', 'false');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('is-active');
    tabs.forEach((t, i) => { t.classList.toggle('is-done', i < cur); t.querySelector('.track span').style.width = i < cur ? '100%' : '0'; });
    tabs[cur].classList.add('is-active'); tabs[cur].setAttribute('aria-selected', 'true');
    start = performance.now(); pausedAt = 0;
  };
  const loop = (t) => {
    if (!paused) {
      const p = Math.min((t - start) / DURATION, 1);
      tabs[cur].querySelector('.track span').style.width = (p * 100) + '%';
      if (p >= 1) go(cur + 1);
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  tabs.forEach((t, i) => t.addEventListener('click', () => go(i)));
  $$('[data-hero]').forEach((b) => b.addEventListener('click', () => {
    const v = b.dataset.hero;
    if (v === 'pause') {
      paused = !paused;
      if (paused) pausedAt = performance.now(); else start += performance.now() - pausedAt;
      b.innerHTML = paused ? '<svg><use href="#i-play"/></svg>' : '<svg><use href="#i-pause"/></svg>';
      b.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
      if (paused) b.querySelector('svg').style.cssText = 'width:12px;margin-left:2px';
    } else go(cur + +v);
  }));
  // swipe
  let sx = null;
  const frame = $('.hero__frame');
  frame.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  frame.addEventListener('touchend', (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); sx = null; });

  /* ---------- Reveal + counters ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .reveal-stagger').forEach((el) => io.observe(el));
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count;
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; o.disconnect();
      if (reduce) { el.textContent = end; return; }
      const t0 = performance.now();
      const tick = (t) => { const p = Math.min((t - t0) / 1600, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: .4 });
    o.observe(el);
  });

  /* ---------- Overlays: drawers, search, lightbox ---------- */
  const scrim = $('.drawer-scrim');
  const panels = { menu: $('#menu'), cart: $('#cart'), search: $('#search') };
  const closeAll = () => {
    Object.values(panels).forEach((p) => p.classList.remove('is-open'));
    scrim.classList.remove('is-open');
    const lb = $('#lightbox'); if (lb.classList.contains('is-open')) { lb.classList.remove('is-open'); $('#lbInner').innerHTML = ''; }
    document.body.style.overflow = '';
  };
  const open = (name) => {
    closeAll();
    panels[name].classList.add('is-open');
    if (name !== 'search') scrim.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (name === 'search') setTimeout(() => $('#searchInput').focus(), 200);
  };
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-open]'); if (o) { e.preventDefault(); open(o.dataset.open); return; }
    const c = e.target.closest('[data-close]'); if (c) { closeAll(); return; }
    if (e.target.id === 'search' || e.target.id === 'lightbox') closeAll();
    const a = e.target.closest('.drawer a[href^="#"]'); if (a) closeAll();
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); open('search'); } });

  // Video lightbox
  const playVideo = (id) => {
    closeAll();
    $('#lbInner').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1" title="Breakthrough Golf Technology video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    $('#lightbox').classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  $$('[data-video]').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); playVideo(el.dataset.video); });
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playVideo(el.dataset.video); } });
  });

  // Search
  const catalog = $$('.card').map((c) => ({ name: c.dataset.name, price: +c.dataset.price, img: c.querySelector('img.main').currentSrc || c.querySelector('img.main').src, el: c }));
  const renderSearch = (q = '') => {
    const ql = q.trim().toLowerCase();
    const list = catalog.filter((p) => !ql || p.name.toLowerCase().includes(ql) || (ql.startsWith('wom') && /stability/i.test(p.name)));
    $('#searchResults').innerHTML = list.length ? list.slice(0, 6).map((p) => `<a href="#shop" data-close><img src="${p.el.querySelector('img.main').src}" alt=""><span>${p.name}</span><small>${money(p.price)}</small></a>`).join('') : '<p style="padding:10px;color:var(--muted)">No matches — try “Stability” or call 972-972-8882.</p>';
  };
  renderSearch();
  $('#searchInput').addEventListener('input', (e) => renderSearch(e.target.value));
  $$('[data-q]').forEach((b) => b.addEventListener('click', () => { $('#searchInput').value = b.dataset.q; renderSearch(b.dataset.q); }));

  /* ---------- Cart ---------- */
  const cart = [];
  const countEl = $('.cart-count');
  const renderCart = () => {
    const total = cart.reduce((s, i) => s + i.price, 0);
    countEl.textContent = cart.length;
    countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump');
    $('#cartTotal').textContent = money(total);
    const left = 200 - total;
    $('#meterTxt').innerHTML = left > 0 ? `Spend <b>${money(left)}</b> more and save $60 automatically` : '🎉 <b>You unlocked $60 off</b> — applied at checkout';
    $('#meterBar').style.width = Math.min(total / 200 * 100, 100) + '%';
    $('#cartLines').innerHTML = cart.length ? cart.map((i, n) => `<div class="cart-line"><img src="${i.img}" alt=""><div><b>${i.name}</b><small>${i.meta || 'Qty 1'}</small><br><button type="button" data-rm="${n}">Remove</button></div><span class="price">${money(i.price)}</span></div>`).join('')
      : '<div class="cart-empty"><svg width="40" height="40"><use href="#i-bag"/></svg><p>Your bag is empty.</p><a href="#shop" class="btn btn--sm" data-close>Shop best sellers</a></div>';
  };
  let toastT;
  const add = (item) => {
    cart.push(item); renderCart();
    $('#toastImg').src = item.img; $('#toastTxt').innerHTML = `<b>${item.name}</b> added`;
    const t = $('#toast'); t.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 3200);
  };
  $('#cartLines').addEventListener('click', (e) => { const b = e.target.closest('[data-rm]'); if (b) { cart.splice(+b.dataset.rm, 1); renderCart(); } });
  $$('[data-add]').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    const c = b.closest('.card');
    add({ name: c.dataset.name, price: +c.dataset.price, img: c.querySelector('img.main').src });
    b.textContent = 'Added ✓'; setTimeout(() => (b.textContent = 'Quick add'), 1600);
  }));
  $('[data-upsell]').addEventListener('click', (e) => { const img = e.target.closest('div').querySelector('img').src; add({ name: 'BGT Trucker Hat', price: 34.99, img }); });

  // Wishlist + swatches
  $$('.card__wish').forEach((b) => b.addEventListener('click', () => b.classList.toggle('is-on')));
  $$('.swatches').forEach((s) => s.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', s).forEach((x) => x.classList.toggle('is-on', x === b));
    const media = s.closest('.card').querySelector('.card__media');
    const alt = media.querySelector('img.alt');
    if (alt) media.querySelector('img.main').style.opacity = b === s.lastElementChild ? '0' : '';
    if (alt) alt.style.opacity = b === s.lastElementChild ? '1' : '';
  }));

  // Filters
  $$('.filters button').forEach((b) => b.addEventListener('click', () => {
    $$('.filters button').forEach((x) => x.classList.toggle('is-on', x === b));
    $$('.card').forEach((c) => c.classList.toggle('is-hidden', b.dataset.filter !== 'all' && c.dataset.cat !== b.dataset.filter));
  }));

  /* ---------- Configurator ---------- */
  const st = { head: 'Blade', hand: 'Right', shaft: 'Stability Tour Black', adj: true, lie: 0, loft: 0, len: 34, grip: 'BGT Standard', gripP: 0 };
  const rLie = $('#rLie'), rLoft = $('#rLoft'), rLen = $('#rLen');
  const steps = $$('.cfg__steps span');
  const touched = new Set(['head', 'hand']);
  const renderCfg = () => {
    $('#cfgTitle').textContent = `Paradox ${st.head}${st.adj ? ' Tour' : ''}`;
    $('#headBlade').style.display = st.head === 'Blade' ? '' : 'none';
    $('#headMallet').style.display = st.head === 'Mallet' ? '' : 'none';
    $('#cfgPutter').style.transform = `${st.hand === 'Left' ? 'scaleX(-1)' : ''} rotate(${st.lie * 1.2}deg)`;
    const lie = 70 + (st.adj ? st.lie : 0), loft = 3 + (st.adj ? st.loft : 0);
    $('#sLen').textContent = st.len.toFixed(1) + '"'; $('#vLen').textContent = st.len.toFixed(1) + '"';
    $('#sLie').textContent = lie + '°'; $('#sLoft').textContent = loft + '°'; $('#sHand').textContent = st.hand;
    $('#vLie').textContent = (st.adj && (st.lie || st.loft)) ? `${lie}° / ${loft}°` : 'Standard';
    $('#cLie').textContent = `${lie}° / ${loft}°`;
    $('#vHand').textContent = st.hand; $('#vShaft').textContent = st.shaft; $('#vGrip').textContent = st.grip;
    $('#cShaft').textContent = st.shaft; $('#cGrip').textContent = st.grip;
    rLie.disabled = rLoft.disabled = !st.adj;
    $('#cfgWarn').classList.toggle('is-on', !st.adj);
    $('#tGrip').textContent = money(st.gripP);
    $('#tTotal').textContent = money(399.99 + st.gripP);
    steps.forEach((s, i) => s.classList.toggle('is-on', i < touched.size));
  };
  $$('.cfg__mode button').forEach((b) => b.addEventListener('click', () => { $$('.cfg__mode button').forEach((x) => x.classList.toggle('is-on', x === b)); st.head = b.dataset.head; renderCfg(); }));
  $$('[data-group]').forEach((g) => g.addEventListener('click', (e) => {
    const b = e.target.closest('.opt'); if (!b) return;
    $$('.opt', g).forEach((x) => x.classList.toggle('is-on', x === b));
    const k = g.dataset.group; touched.add(k);
    if (k === 'hand') st.hand = b.dataset.v;
    if (k === 'shaft') {
      st.shaft = b.dataset.v; st.adj = b.dataset.adj === '1';
      $('#cfgShaft').setAttribute('fill', b.dataset.color); $('#cfgBand').setAttribute('fill', b.dataset.band);
      if (!st.adj) { rLie.value = 0; rLoft.value = 0; st.lie = st.loft = 0; }
    }
    if (k === 'grip') { st.grip = b.dataset.v; st.gripP = +b.dataset.p; $('#cfgGrip').setAttribute('fill', b.dataset.color); $('#cfgGrip').setAttribute('width', b.dataset.v.includes('Zenergy') || b.dataset.v.includes('Quad') ? 30 : 26); }
    renderCfg();
  }));
  rLie.addEventListener('input', () => { st.lie = +rLie.value; touched.add('lie'); renderCfg(); });
  rLoft.addEventListener('input', () => { st.loft = +rLoft.value; touched.add('lie'); renderCfg(); });
  rLen.addEventListener('input', () => { st.len = +rLen.value; touched.add('len'); renderCfg(); });
  $('#cfgShaft').setAttribute('fill', '#15171a');
  renderCfg();
  $('#cfgAdd').addEventListener('click', () => {
    const img = st.head === 'Blade' ? $('.card[data-name="Paradox Blade Putter"] img.main').src : $('.card[data-name="Paradox Mallet Putter"] img.main').src;
    add({ name: $('#cfgTitle').textContent, price: 399.99 + st.gripP, img, meta: `${st.hand} · ${st.shaft} · ${st.len}" · ${$('#sLie').textContent}/${$('#sLoft').textContent} · ${st.grip}` });
    open('cart');
  });
  $('#cfgSave').addEventListener('click', (e) => e.currentTarget.classList.toggle('card__wish--on'));

  /* ---------- Technology sticky scroll ---------- */
  const techSteps = $$('.tstep');
  const stepsWrap = $('.tech__steps');
  const steelHead = $('#steelHead'), bgtHead = $('#bgtHead');
  const steelDeg = $('#steelDeg'), bgtDeg = $('#bgtDeg'), stage = $('#techStage');
  const labels = ['Backstroke', 'Impact', 'Follow-through'];
  function techScroll() {
    if (!stepsWrap) return;
    const r = stepsWrap.getBoundingClientRect();
    const p = Math.min(Math.max((innerHeight * .55 - r.top) / r.height, 0), 1);
    const idx = Math.min(Math.floor(p * techSteps.length), techSteps.length - 1);
    techSteps.forEach((s, i) => s.classList.toggle('is-on', i === idx));
    // steel oscillates and opens; Stability stays near square
    const osc = Math.sin(p * Math.PI * 5) * (1 - p * .35);
    const steel = (osc * 6 + p * 2.5);
    const bgt = osc * .7;
    steelHead.style.transform = `rotate(${steel}deg)`;
    bgtHead.style.transform = `rotate(${bgt}deg)`;
    steelDeg.textContent = (steel >= 0 ? '+' : '') + steel.toFixed(1) + '°';
    bgtDeg.textContent = (bgt >= 0 ? '+' : '') + bgt.toFixed(1) + '°';
    stage.textContent = p <= 0 ? 'Address' : labels[idx];
  }

  /* ---------- Product lines tabs ---------- */
  const lineTabs = $$('.lines__tab'), linePanels = $$('.line-panel');
  lineTabs.forEach((t, i) => t.addEventListener('click', () => {
    lineTabs.forEach((x) => x.classList.toggle('is-on', x === t));
    linePanels.forEach((p, j) => p.classList.toggle('is-on', j === i));
  }));

  /* ---------- Subtle parallax on category/film images ---------- */
  if (!reduce) {
    const par = $$('.film img, .fit__media img');
    const pTick = () => { par.forEach((img) => { const r = img.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; const c = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; img.style.translate = `0 ${c * -30}px`; }); requestAnimationFrame(pTick); };
    requestAnimationFrame(pTick);
  }

  onScroll();
})();
