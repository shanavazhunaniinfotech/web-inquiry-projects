(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const money = (n) => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- Logo fallback ---------- */
  $$('.logo__mark img').forEach((img) => {
    const fail = () => img.closest('.logo__mark').classList.add('no-img');
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  const startLenis = () => {
    if (reduce || !window.Lenis || lenis) return;
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  };
  if (document.readyState === 'complete') startLenis(); else addEventListener('load', startLenis);
  const scrollToEl = (el) => { if (lenis) lenis.scrollTo(el, { offset: -90 }); else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); closeAll(); scrollToEl(t); }
  });

  /* ---------- Countdown (holiday offer) ---------- */
  const end = new Date('2026-11-30T23:59:59-06:00').getTime();
  const cd = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  const tickCd = () => {
    let s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s -= d * 86400;
    const h = Math.floor(s / 3600); s -= h * 3600;
    const m = Math.floor(s / 60); s -= m * 60;
    const p = (n) => String(n).padStart(2, '0');
    cd.d.textContent = p(d); cd.h.textContent = p(h); cd.m.textContent = p(m); cd.s.textContent = p(s);
  };
  tickCd(); setInterval(tickCd, 1000);

  /* ---------- Announcement rotator ---------- */
  const msgs = $$('.announce__msg'); let ai = 0;
  setInterval(() => {
    const prev = msgs[ai]; ai = (ai + 1) % msgs.length;
    prev.classList.remove('is-on'); prev.classList.add('is-out');
    setTimeout(() => prev.classList.remove('is-out'), 750);
    msgs[ai].classList.add('is-on');
  }, 4200);

  /* ---------- Mega menu ---------- */
  const mega = $('.has-mega');
  const megaBtn = $('.has-mega > .nav__link');
  megaBtn.addEventListener('click', () => { const o = mega.classList.toggle('is-open'); megaBtn.setAttribute('aria-expanded', o); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.has-mega')) mega.classList.remove('is-open'); });
  const prev = $('.mega__preview'), prevImg = $('.mega__img');
  let swapT;
  $$('.mega__col a[data-prev]').forEach((a) => a.addEventListener('mouseenter', () => {
    if (prevImg.getAttribute('src') === a.dataset.prev) return;
    prevImg.classList.add('swap'); clearTimeout(swapT);
    swapT = setTimeout(() => {
      prevImg.src = a.dataset.prev;
      prev.style.setProperty('--tint', a.dataset.tint);
      prev.href = a.getAttribute('href');
      $('.mega__name').textContent = a.dataset.name;
      $('.mega__price').textContent = a.dataset.price;
      prevImg.classList.remove('swap');
    }, 180);
  }));

  /* ---------- Hero slider ---------- */
  const frame = $('.hero__frame');
  const slides = $$('.slide');
  const tabs = $$('.hero__tab');
  const cur = $('.hero__cur');
  const DURATION = 8000;
  let idx = 0, t0 = performance.now(), paused = false, pausedAt = 0;
  $$('[data-depth]').forEach((el) => el.style.setProperty('--d', el.dataset.depth));
  const applyTheme = (s) => {
    frame.style.setProperty('--tint', s.dataset.tint);
    frame.style.setProperty('--tint2', s.dataset.tint2);
    frame.style.setProperty('--accent', s.dataset.accent);
  };
  const go = (n) => {
    slides[idx].classList.remove('is-active');
    tabs[idx].classList.remove('is-active'); tabs[idx].setAttribute('aria-selected', 'false');
    idx = (n + slides.length) % slides.length;
    slides[idx].classList.add('is-active');
    tabs[idx].classList.add('is-active'); tabs[idx].setAttribute('aria-selected', 'true');
    tabs.forEach((t, i) => { t.querySelector('.bar i').style.width = i < idx ? '100%' : '0%'; });
    cur.textContent = String(idx + 1).padStart(2, '0');
    applyTheme(slides[idx]);
    t0 = performance.now(); pausedAt = performance.now();
  };
  const heroLoop = (t) => {
    if (!paused) {
      const p = clamp((t - t0) / DURATION, 0, 1);
      tabs[idx].querySelector('.bar i').style.width = (p * 100) + '%';
      if (p >= 1) go(idx + 1);
    }
    requestAnimationFrame(heroLoop);
  };
  requestAnimationFrame(heroLoop);
  tabs.forEach((t, i) => t.addEventListener('click', () => go(i)));
  $$('[data-hero]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.hero !== 'pause') return go(idx + +b.dataset.hero);
    paused = !paused;
    if (paused) pausedAt = performance.now(); else t0 += performance.now() - pausedAt;
    b.innerHTML = paused ? '<svg style="width:12px;margin-left:2px"><use href="#i-play"/></svg>' : '<svg><use href="#i-pause"/></svg>';
    b.setAttribute('aria-label', paused ? 'Play' : 'Pause');
  }));
  let sx = null;
  frame.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  frame.addEventListener('touchend', (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1)); sx = null; });
  // Mouse parallax
  if (fine && !reduce) {
    let mx = 0, my = 0, tx = 0, ty = 0;
    frame.addEventListener('mousemove', (e) => { const r = frame.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; });
    frame.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
    const par = () => {
      mx = lerp(mx, tx, .06); my = lerp(my, ty, .06);
      $$('.slide.is-active [data-depth]').forEach((el) => { const d = +el.dataset.depth; el.style.translate = `${(mx * d * 1.6).toFixed(2)}px ${(my * d * 1.6).toFixed(2)}px`; });
      requestAnimationFrame(par);
    };
    requestAnimationFrame(par);
  }

  /* ---------- Kinetic marquee (scroll velocity) ---------- */
  const kin = $('.kinetic__row');
  let kx = 0, lastY = scrollY, vel = 0;
  const kinLoop = () => {
    const y = scrollY; const dy = y - lastY; lastY = y;
    vel = lerp(vel, dy, .1);
    if (!reduce) {
      kx -= 0.6 + Math.abs(vel) * 0.35;
      const half = kin.scrollWidth / 2;
      if (-kx >= half) kx += half;
      kin.style.transform = `translate3d(${kx}px,0,0) skewX(${clamp(-vel * .15, -8, 8)}deg)`;
    }
    requestAnimationFrame(kinLoop);
  };
  requestAnimationFrame(kinLoop);

  /* ---------- Manifesto words ---------- */
  const mText = $('.manifesto__text');
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((w) => {
          if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
          const s = document.createElement('span'); s.className = 'w'; s.textContent = w; frag.appendChild(s);
        });
        n.replaceWith(frag);
      }
    });
  };
  walk(mText);
  const mUnits = $$('.w, .pic', mText);

  /* ---------- Accordion ---------- */
  const accs = $$('.acc');
  const openAcc = (a) => accs.forEach((x) => x.classList.toggle('is-open', x === a));
  accs.forEach((a) => {
    if (fine) a.addEventListener('mouseenter', () => openAcc(a));
    a.addEventListener('click', (e) => { if (!a.classList.contains('is-open')) { e.preventDefault(); e.stopPropagation(); openAcc(a); } });
  });

  /* ---------- Segmented filter ---------- */
  const seg = $('.seg');
  const pill = document.createElement('span'); pill.className = 'seg__pill'; seg.prepend(pill);
  const movePill = (b) => { pill.style.left = b.offsetLeft + 'px'; pill.style.width = b.offsetWidth + 'px'; };
  const segBtns = $$('button', seg);
  requestAnimationFrame(() => movePill(segBtns[0]));
  addEventListener('resize', () => movePill($('.seg button.is-on')));
  segBtns.forEach((b) => b.addEventListener('click', () => {
    segBtns.forEach((x) => x.classList.toggle('is-on', x === b)); movePill(b);
    const f = b.dataset.filter;
    $$('.bento > [data-cat]').forEach((c) => c.classList.toggle('is-hidden', f !== 'all' && c.dataset.cat !== f));
  }));

  /* ---------- Feature swatches + wishlist ---------- */
  $$('.feature .swatches button').forEach((b) => b.addEventListener('click', () => {
    $$('.feature .swatches button').forEach((x) => x.classList.toggle('is-on', x === b));
    $$('.feature__img').forEach((i) => i.classList.toggle('is-on', i.dataset.v === b.dataset.v));
  }));
  $$('.wish').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); b.classList.toggle('is-on'); }));

  /* ---------- Overlays ---------- */
  const scrim = $('.scrim');
  const panels = { menu: $('#menu'), cart: $('#cart'), search: $('#search') };
  function closeAll() {
    Object.values(panels).forEach((p) => p.classList.remove('is-open'));
    scrim.classList.remove('is-open');
    const lb = $('#lightbox');
    if (lb.classList.contains('is-open')) { lb.classList.remove('is-open'); setTimeout(() => { $('#lbInner').innerHTML = ''; }, 400); }
    document.documentElement.style.overflow = '';
    if (lenis) lenis.start();
  }
  const open = (name) => {
    closeAll();
    panels[name].classList.add('is-open');
    if (name !== 'search') scrim.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    if (name === 'search') setTimeout(() => $('#searchInput').focus(), 150);
  };
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-open]'); if (o) { e.preventDefault(); open(o.dataset.open); return; }
    if (e.target.closest('[data-close]') || e.target.id === 'search' || e.target.id === 'lightbox') closeAll();
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName))) { e.preventDefault(); open('search'); }
  });
  const playVideo = (id) => {
    closeAll();
    $('#lbInner').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="Breakthrough Golf Technology video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    $('#lightbox').classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  };
  $$('[data-video]').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); playVideo(el.dataset.video); });
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playVideo(el.dataset.video); } });
  });

  // Search
  const catalog = [
    ['Stability Tour Putter Shaft', 359.99, 'images/stability-tour-b-w-cu-cut.webp', '#shop'],
    ['Stability ONE Putter Shaft', 329.99, 'images/one-b-w-cu-cut.webp', '#shop'],
    ['Stability Carbon Pro', 329.99, 'images/carbon-pro-cu-cut.webp', '#shop'],
    ['Stability Tour M Edition', 409.99, 'images/m-edition-hero-cut.webp', '#shop'],
    ['Stability Tour Pearl (Women\'s)', 359.99, 'images/pearl-ft-cut.webp', '#shop'],
    ['Paradox Blade Putter', 399.99, 'images/paradox-blade-hero-cut.webp', '#build'],
    ['Paradox Mallet Putter', 399.99, 'images/paradox-mallet-top-cut.webp', '#build'],
    ['Forta Wood Shaft', 399.99, 'images/forta-flexes-full-cut.webp', '#shop'],
    ['Forta Tour Wood Shaft', 429.99, 'images/forta-tour-flexes-cut.webp', '#shop'],
    ['Silo Tour Wedge Shaft', 199.99, 'images/silo-tour-weights-full-cut.webp', '#shop'],
  ];
  const renderSearch = (q = '') => {
    const ql = q.trim().toLowerCase();
    const list = catalog.filter((p) => !ql || p[0].toLowerCase().includes(ql));
    $('#searchResults').innerHTML = list.length
      ? list.slice(0, 6).map((p) => `<a href="${p[3]}"><img src="${p[2]}" alt=""><span>${p[0]}</span><small>${money(p[1])}</small></a>`).join('')
      : '<p style="padding:12px;color:var(--muted)">No matches — try “Stability”, or call 972-972-8882.</p>';
  };
  renderSearch();
  $('#searchInput').addEventListener('input', (e) => renderSearch(e.target.value));
  $$('[data-q]').forEach((b) => b.addEventListener('click', () => { $('#searchInput').value = b.dataset.q; renderSearch(b.dataset.q); }));

  /* ---------- Cart ---------- */
  const cart = [];
  const countEl = $('.cart-count');
  const renderCart = () => {
    const total = cart.reduce((s, i) => s + i.price, 0);
    countEl.textContent = cart.length; $('#cartN').textContent = `(${cart.length})`;
    countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump');
    $('#cartTotal').textContent = money(total);
    const left = 200 - total;
    $('#meterTxt').innerHTML = left > 0 ? `Spend <b>${money(left)}</b> more and save $60 automatically` : '🎉 <b>$60 off unlocked</b> — applied at checkout';
    $('#meterBar').style.width = clamp(total / 200 * 100, 0, 100) + '%';
    $('#cartLines').innerHTML = cart.length
      ? cart.map((i, n) => `<div class="cart-line"><img src="${i.img}" alt=""><div><b>${i.name}</b><small>${i.meta || 'Qty 1 · ships in 24–48 hrs'}</small><button type="button" data-rm="${n}">Remove</button></div><span class="p">${money(i.price)}</span></div>`).join('')
      : '<div class="cart-empty"><svg><use href="#i-bag"/></svg><p>Your bag is empty.</p><a href="#shop" class="btn btn--sm btn--ink">Shop best sellers <span class="arr"><svg width="12" height="12"><use href="#i-arrow"/></svg></span></a></div>';
  };
  renderCart();
  let toastT;
  const add = (item) => {
    cart.push(item); renderCart();
    $('#toastImg').src = item.img; $('#toastTxt').innerHTML = `<b>${item.name}</b> added`;
    const t = $('#toast'); t.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 3200);
  };
  $('#cartLines').addEventListener('click', (e) => { const b = e.target.closest('[data-rm]'); if (b) { cart.splice(+b.dataset.rm, 1); renderCart(); } });
  $$('[data-quick]').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    const [name, price, img] = b.dataset.quick.split('|');
    add({ name, price: +price, img });
    if (b.classList.contains('pcard__quick')) { const h = b.innerHTML; b.innerHTML = 'Added ✓'; setTimeout(() => { b.innerHTML = h; }, 1500); }
  }));

  /* ---------- Configurator ---------- */
  const st = { head: 'Blade', hand: 'Right', shaft: 'Stability Tour Black', adj: true, lie: 0, loft: 0, len: 34, grip: 'BGT Standard', gripP: 0 };
  const touched = new Set(['head', 'hand']);
  const views = $$('.cfg__img'), thumbs = $$('.cfg__thumbs button');
  const showView = (v) => {
    views.forEach((i) => i.classList.toggle('is-on', i.dataset.view === v));
    thumbs.forEach((b) => b.classList.toggle('is-on', b.dataset.goto === v));
  };
  thumbs.forEach((b) => b.addEventListener('click', () => showView(b.dataset.goto)));
  const flash = (id, txt) => { const el = $(id); if (el.textContent !== txt) { el.textContent = txt; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); } };
  const renderCfg = () => {
    const lie = 70 + (st.adj ? st.lie : 0), loft = 3 + (st.adj ? st.loft : 0);
    const title = `Paradox${st.adj ? ' Tour' : ''} · ${st.head}`;
    $('#cfgTitle').textContent = title;
    const code = { 'Stability Tour Black': 'STB', 'Stability Tour One': 'ST1', 'Stability Carbon Pro': 'SCP', 'Stability Tour Long': 'STL', 'Paradox Multi-Material': 'PMM', 'Paradox Graphite': 'PGR' }[st.shaft];
    $('#cfgSku').textContent = `PDX-${st.head === 'Blade' ? 'BLD' : 'MLT'}-${code}-${st.hand[0]}-${st.len}`;
    flash('#tHead', st.head); flash('#tHand', st.hand); flash('#tShaft', st.shaft); flash('#tLie', `${lie}° / ${loft}°`); flash('#tLen', st.len.toFixed(1) + '"'); flash('#tGrip', st.grip);
    $('#sHead').textContent = st.head; $('#sHand').textContent = st.hand; $('#sShaft').textContent = st.shaft; $('#sGrip').textContent = st.grip;
    $('#sFit').textContent = `${(st.adj && (st.lie || st.loft)) ? `${lie}° / ${loft}°` : 'Standard'} · ${st.len}"`;
    $('#oLen').textContent = st.len.toFixed(1) + '"';
    $('#dialLie').textContent = lie + '°';
    $('#lieNeedle').style.transform = `rotate(${(lie - 70) * 12}deg)`;
    $('#cfgWarn').classList.toggle('is-on', !st.adj);
    $$('.pills button').forEach((b) => { b.disabled = !st.adj; });
    const total = 399.99 + st.gripP;
    $('#cfgTotal').textContent = money(total);
    $('#cfgInst').textContent = money(Math.ceil(total / 4 * 100) / 100);
    $('#cfgStepN').textContent = touched.size;
    $('#cfgBar').style.width = (touched.size / 5 * 100) + '%';
    $('.cfg__img[data-view="head"]').classList.toggle('flip', st.hand === 'Left');
  };
  $$('[data-group]').forEach((g) => g.addEventListener('click', (e) => {
    const b = e.target.closest('.opt'); if (!b) return;
    $$('.opt', g).forEach((x) => x.classList.toggle('is-on', x === b));
    const k = g.dataset.group; touched.add(k);
    if (k === 'head') { st.head = b.dataset.v; $('.cfg__img[data-view="head"]').src = b.dataset.img; $('.cfg__thumbs [data-goto="head"] img').src = b.dataset.top; showView('head'); }
    if (k === 'hand') { st.hand = b.dataset.v; showView('head'); }
    if (k === 'shaft') {
      st.shaft = b.dataset.v; st.adj = b.dataset.adj === '1';
      $('.cfg__img[data-view="shaft"]').src = b.dataset.img; showView('shaft');
      if (!st.adj) { st.lie = 0; st.loft = 0; $$('.pills').forEach((p) => $$('button', p).forEach((x) => x.classList.toggle('is-on', x.dataset.v === '0'))); }
    }
    if (k === 'grip') { st.grip = b.dataset.v; st.gripP = +b.dataset.p; showView('grip'); }
    renderCfg();
  }));
  $$('.pills').forEach((p) => p.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', p).forEach((x) => x.classList.toggle('is-on', x === b));
    st[p.dataset.range] = +b.dataset.v; touched.add('fit'); showView('head'); renderCfg();
  }));
  $('#rLen').addEventListener('input', (e) => { st.len = +e.target.value; touched.add('fit'); renderCfg(); });
  $('#cfgAdd').addEventListener('click', () => {
    const lie = 70 + (st.adj ? st.lie : 0), loft = 3 + (st.adj ? st.loft : 0);
    add({ name: $('#cfgTitle').textContent, price: 399.99 + st.gripP, img: $('.cfg__img[data-view="head"]').getAttribute('src'), meta: `${st.hand} · ${st.shaft} · ${st.len}" · ${lie}°/${loft}° · ${st.grip}` });
    setTimeout(() => open('cart'), 350);
  });
  renderCfg();

  /* ---------- Tech trace ---------- */
  const N = 240;
  const steelPts = [], bgtPts = [];
  for (let i = 0; i <= N; i++) {
    const x = i / N;
    const stroke = Math.sin(x * Math.PI * 2) * 0.35;                      // stroke arc
    const wob = Math.sin(x * Math.PI * 22) * Math.exp(-Math.pow((x - .55) / .22, 2)) * 0.55; // oscillation peaking near impact
    const drift = Math.max(0, x - .45) * 0.9;
    steelPts.push([x * 600, 150 - (stroke * 0.25 + wob + drift * 0.45) * 160]);
    bgtPts.push([x * 600, 150 - (stroke * 0.25 + wob * 0.12 + drift * 0.05) * 160]);
  }
  const toPath = (pts, n) => pts.slice(0, Math.max(2, n)).map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
  const tSteel = $('#traceSteel'), tBgt = $('#traceBgt'), head = $('#playhead');
  const tSec = $('.tech'), tSteps = $$('.tstep');
  const dots = document.createElement('div'); dots.className = 'tech__dots'; dots.innerHTML = '<i class="on"></i><i></i><i></i>'; $('.tech__copy').appendChild(dots);
  let lastTechP = -1;
  const techUpdate = (p) => {
    if (Math.abs(p - lastTechP) < 0.002) return; lastTechP = p;
    const n = Math.round(p * N);
    tSteel.setAttribute('d', toPath(steelPts, n + 1));
    tBgt.setAttribute('d', toPath(bgtPts, n + 1));
    const px = (n / N) * 600; head.setAttribute('x1', px); head.setAttribute('x2', px);
    const deg = (pts) => { const v = (150 - pts[Math.min(n, N)][1]) / 160 * 4; return (Math.abs(v) < .05 ? 0 : v).toFixed(1); };
    const sd = deg(steelPts), bd = deg(bgtPts);
    $('#rSteel').textContent = (sd > 0 ? '+' : '') + sd + '°';
    $('#rBgt').textContent = (bd > 0 ? '+' : '') + bd + '°';
    $('#rFrames').textContent = Math.round(p * 4200).toLocaleString();
    const si = p < .34 ? 0 : p < .67 ? 1 : 2;
    tSteps.forEach((s, i) => s.classList.toggle('is-on', i === si));
    $$('i', dots).forEach((d, i) => d.classList.toggle('on', i === si));
  };

  /* ---------- Film + Lines ---------- */
  const film = $('.film__frame'), filmBg = $('#filmBg');
  let filmLoaded = false;
  const loadFilmBg = () => {
    if (filmLoaded || reduce) return; filmLoaded = true;
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/A9f6uEB-g1g?autoplay=1&mute=1&loop=1&playlist=A9f6uEB-g1g&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1';
    f.allow = 'autoplay; encrypted-media'; f.tabIndex = -1; f.title = 'Background film';
    f.addEventListener('load', () => setTimeout(() => f.classList.add('ready'), 1200));
    filmBg.appendChild(f);
  };
  const linesSec = $('.lines'), track = $('#linesTrack'), linesBar = $('#linesBar');
  const desktopPin = () => innerWidth > 1000;

  /* ---------- Scroll loop ---------- */
  const header = $('.header'), progEl = $('.scroll-progress'), mcta = $('.mcta'), build = $('#build');
  let prevY = scrollY;
  const onScroll = () => {
    const y = scrollY, vh = innerHeight;
    header.classList.toggle('is-scrolled', y > 30);
    if (y > 700 && y > prevY + 4 && !mega.matches(':hover')) header.classList.add('is-hidden');
    else if (y < prevY - 4 || y < 700) header.classList.remove('is-hidden');
    prevY = y;
    const h = document.documentElement.scrollHeight - vh;
    progEl.style.transform = `scaleX(${h > 0 ? y / h : 0})`;

    // manifesto
    const mr = mText.getBoundingClientRect();
    const mp = clamp((vh * .85 - mr.top) / (mr.height + vh * .35), 0, 1);
    const on = Math.floor(mp * mUnits.length * 1.05);
    mUnits.forEach((u, i) => u.classList.toggle('on', i < on));

    // tech
    if (desktopPin()) {
      const tr = tSec.getBoundingClientRect();
      techUpdate(clamp(-tr.top / (tr.height - vh), 0, 1));
    } else {
      const tr = $('.scope').getBoundingClientRect();
      techUpdate(clamp((vh * .9 - tr.top) / (vh * .8), 0, 1));
    }

    // film
    const fr = film.getBoundingClientRect();
    if (fr.top < vh * 1.5 && fr.bottom > -200) loadFilmBg();
    const fp = clamp((vh - fr.top) / (vh * .9), 0, 1);
    film.style.setProperty('--fw', `${86 + fp * 14}%`);
    film.style.setProperty('--fr', `${40 - fp * 40 + (innerWidth < 640 ? 26 : 0) * fp}px`);

    // lines
    if (desktopPin()) {
      const lr = linesSec.getBoundingClientRect();
      const lp = clamp(-lr.top / (lr.height - vh), 0, 1);
      const max = track.scrollWidth - innerWidth;
      track.style.transform = `translate3d(${-lp * max}px,0,0)`;
      linesBar.style.width = (lp * 100) + '%';
    }

    // mobile CTA
    if (mcta) {
      const br = build.getBoundingClientRect();
      mcta.classList.toggle('is-on', y > vh * .9 && !(br.top < vh && br.bottom > 0));
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  /* ---------- Reveal + counters ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -60px 0px' });
  $$('.reveal, .tour__bars').forEach((el) => io.observe(el));
  $$('[data-count]').forEach((el) => {
    const endV = +el.dataset.count;
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; o.disconnect();
      if (reduce) { el.textContent = endV; return; }
      const s0 = performance.now();
      const tk = (t) => { const p = clamp((t - s0) / 1800, 0, 1); el.textContent = Math.round(endV * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(tk); };
      requestAnimationFrame(tk);
    }, { threshold: .5 });
    o.observe(el);
  });

  /* ---------- Cursor + magnetic ---------- */
  if (fine && !reduce) {
    const c = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), lab = $('.cursor__ring em');
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; dot.style.transform = `translate3d(${x}px,${y}px,0)`; });
    const cl = () => { rx = lerp(rx, x, .18); ry = lerp(ry, y, .18); ring.style.transform = `translate3d(${rx}px,${ry}px,0)`; requestAnimationFrame(cl); };
    requestAnimationFrame(cl);
    document.addEventListener('mouseover', (e) => {
      const lbl = e.target.closest('[data-cursor]');
      const link = e.target.closest('a, button, summary, input, label');
      c.classList.toggle('is-label', !!lbl);
      c.classList.toggle('is-link', !lbl && !!link);
      if (lbl) lab.textContent = lbl.dataset.cursor;
    });
    document.addEventListener('mouseleave', () => { c.style.opacity = 0; });
    document.addEventListener('mouseenter', () => { c.style.opacity = 1; });
    $$('.magnetic').forEach((m) => {
      m.addEventListener('mousemove', (e) => { const r = m.getBoundingClientRect(); const dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2; m.style.transform = `translate(${dx * .22}px, ${dy * .3}px)`; });
      m.addEventListener('mouseleave', () => { m.style.transform = ''; });
    });
  }

  onScroll();
})();
