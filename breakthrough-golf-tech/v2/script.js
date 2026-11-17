(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const money = (n) => '$' + n.toFixed(2);
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* logo: hide fallback text once the real SVG loads */
  $$('.logo__mark img').forEach((img) => {
    const fail = () => { img.style.display = 'none'; };
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* smooth scroll */
  let lenis = null;
  const startLenis = () => {
    if (reduce || !window.Lenis || lenis) return;
    lenis = new window.Lenis({ lerp: 0.1 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  };
  if (document.readyState === 'complete') startLenis(); else addEventListener('load', startLenis);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault(); closeAll();
    if (lenis) lenis.scrollTo(t, { offset: -90 }); else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  /* countdown */
  const end = new Date('2026-11-30T23:59:59-06:00').getTime();
  const cd = $('#cd');
  const tick = () => {
    let s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s -= d * 86400; const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s -= m * 60;
    cd.textContent = `${d}d ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };
  tick(); setInterval(tick, 1000);
  const tr = $('.bar__track'); tr.innerHTML += tr.innerHTML;

  /* mega (click for touch) */
  const dd = $('.dd'), ddBtn = $('.dd > button');
  ddBtn.addEventListener('click', () => ddBtn.setAttribute('aria-expanded', dd.classList.toggle('is-open')));
  document.addEventListener('click', (e) => { if (!e.target.closest('.dd')) dd.classList.remove('is-open'); });

  /* hero */
  const hin = $('.hero__in'), hs = $$('.hs'), dots = $$('.hero__dots button');
  const DUR = 8000; let cur = 0, t0 = performance.now(), hover = false;
  const go = (n) => {
    hs[cur].classList.remove('is-on'); dots[cur].classList.remove('is-on');
    dots[cur].querySelector('.r').style.strokeDashoffset = 125.7;
    cur = (n + hs.length) % hs.length;
    hs[cur].classList.add('is-on'); dots[cur].classList.add('is-on');
    hin.style.setProperty('--accent', hs[cur].dataset.accent);
    hin.style.setProperty('--tint', hs[cur].dataset.tint);
    t0 = performance.now();
  };
  let pausedAt = 0;
  const loop = (t) => {
    if (!hover) {
      const p = clamp((t - t0) / DUR, 0, 1);
      dots[cur].querySelector('.r').style.strokeDashoffset = 125.7 * (1 - p);
      if (p >= 1) go(cur + 1);
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  // pause while the visitor reads the copy / CTA block
  $$('.hs__foot').forEach((f) => {
    f.addEventListener('mouseenter', () => { hover = true; pausedAt = performance.now(); });
    f.addEventListener('mouseleave', () => { hover = false; t0 += performance.now() - pausedAt; });
  });
  let sx = null;
  hin.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  hin.addEventListener('touchend', (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); sx = null; });
  if (fine && !reduce) {
    let mx = 0, my = 0, tx = 0, ty = 0;
    hin.addEventListener('mousemove', (e) => { const r = hin.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; });
    hin.addEventListener('mouseleave', () => { tx = ty = 0; });
    const par = () => {
      mx = lerp(mx, tx, .06); my = lerp(my, ty, .06);
      const a = hs[cur];
      const p = $('.hs__prod', a), w = $('.hs__word', a);
      if (p) p.style.translate = `${mx * 34}px ${my * 24}px`;
      if (w) w.style.translate = `${mx * -14}px calc(-50% + ${my * -8}px)`;
      requestAnimationFrame(par);
    };
    requestAnimationFrame(par);
  }

  /* overlays */
  const veil = $('.veil');
  const pan = { menu: $('#menu'), cart: $('#cart'), search: $('#search') };
  function closeAll() {
    Object.values(pan).forEach((p) => p.classList.remove('is-on'));
    veil.classList.remove('is-on');
    const lb = $('#lb'); if (lb.classList.contains('is-on')) { lb.classList.remove('is-on'); setTimeout(() => { $('#lbi').innerHTML = ''; }, 400); }
    document.documentElement.style.overflow = ''; if (lenis) lenis.start();
  }
  const open = (n) => {
    closeAll(); pan[n].classList.add('is-on'); if (n !== 'search') veil.classList.add('is-on');
    document.documentElement.style.overflow = 'hidden'; if (lenis) lenis.stop();
    if (n === 'search') setTimeout(() => $('#q').focus(), 150);
  };
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-open]'); if (o) { e.preventDefault(); open(o.dataset.open); return; }
    if (e.target.closest('[data-close]') || e.target.id === 'search' || e.target.id === 'lb') closeAll();
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
  const play = (id) => {
    closeAll();
    $('#lbi').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="Breakthrough Golf video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    $('#lb').classList.add('is-on'); document.documentElement.style.overflow = 'hidden'; if (lenis) lenis.stop();
  };
  $$('[data-video]').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); play(el.dataset.video); });
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(el.dataset.video); } });
  });

  /* search */
  const cat = [
    ['Stability Tour Putter Shaft', 359.99, '../images/stability-tour-b-w-cu-cut.webp', '#lineup'],
    ['Stability ONE Putter Shaft', 329.99, '../images/one-b-w-cu-cut.webp', '#lineup'],
    ['Stability Carbon Pro', 329.99, '../images/carbon-pro-cu-cut.webp', '#lineup'],
    ['Stability Tour M Edition', 409.99, '../images/m-edition-hero-cut.webp', '#lineup'],
    ['Stability Tour Pearl (Women\'s)', 359.99, '../images/pearl-ft-cut.webp', '#lineup'],
    ['Paradox Putter (Blade / Mallet)', 399.99, '../images/paradox-blade-hero-cut.webp', '#build'],
    ['Forta Wood Shaft', 399.99, '../images/forta-flexes-full-cut.webp', '#lineup'],
    ['Forta Tour Wood Shaft', 429.99, '../images/forta-tour-flexes-cut.webp', '#lineup'],
    ['Silo Tour Wedge Shaft', 199.99, '../images/silo-tour-weights-full-cut.webp', '#lineup'],
  ];
  const rs = (q = '') => {
    const l = cat.filter((p) => p[0].toLowerCase().includes(q.trim().toLowerCase()));
    $('#qr').innerHTML = l.length ? l.map((p) => `<a href="${p[3]}"><img src="${p[2]}" alt=""><span>${p[0]}</span><small>${money(p[1])}</small></a>`).join('') : '<p style="padding:14px;color:var(--muted)">No matches — call 972-972-8882.</p>';
  };
  rs(); $('#q').addEventListener('input', (e) => rs(e.target.value));

  /* cart */
  const cart = [];
  const rc = () => {
    const tot = cart.reduce((s, i) => s + i.price, 0);
    const c = $('.count'); c.textContent = cart.length; c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    $('#cn').textContent = `(${cart.length})`; $('#st').textContent = money(tot);
    const left = 200 - tot;
    $('#mt').innerHTML = left > 0 ? `Spend <b>${money(left)}</b> more and save $60` : '<b>$60 off unlocked</b> — applied at checkout';
    $('#mb').style.width = clamp(tot / 200 * 100, 0, 100) + '%';
    $('#lines').innerHTML = cart.length ? cart.map((i, n) => `<div class="line"><img src="${i.img}" alt=""><div><b>${i.name}</b><small>${i.meta || 'Ships in 24–48 hrs'}</small><button type="button" data-rm="${n}">Remove</button></div><span class="p">${money(i.price)}</span></div>`).join('') : '<p class="empty">Your bag is empty.</p>';
  };
  rc();
  let tt;
  const add = (i) => {
    cart.push(i); rc();
    $('#ti').src = i.img; $('#tt').innerHTML = `<b>${i.name}</b> added`;
    const t = $('#toast'); t.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('is-on'), 3200);
  };
  $('#lines').addEventListener('click', (e) => { const b = e.target.closest('[data-rm]'); if (b) { cart.splice(+b.dataset.rm, 1); rc(); } });
  $$('[data-quick]').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault(); const [n, p, img] = b.dataset.quick.split('|'); add({ name: n, price: +p, img });
    const h = b.innerHTML; b.innerHTML = '<svg><use href="#i-check"/></svg>Added'; setTimeout(() => { b.innerHTML = h; }, 1400);
  }));

  /* lineup rail: drag, arrows, filter, progress */
  const rail = $('#rail'), bar = $('#railBar');
  const upd = () => {
    const max = rail.scrollWidth - rail.clientWidth;
    const w = clamp(rail.clientWidth / rail.scrollWidth, .12, 1);
    bar.style.width = (w * 100) + '%';
    bar.style.marginLeft = (max > 0 ? rail.scrollLeft / max * (1 - w) * 100 : 0) + '%';
  };
  rail.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  $$('[data-slide]').forEach((b) => b.addEventListener('click', () => rail.scrollBy({ left: +b.dataset.slide * (rail.querySelector('.pc:not(.is-hidden)').offsetWidth + 16) * 2, behavior: 'smooth' })));
  let down = false, startX = 0, startL = 0, moved = false;
  rail.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; startX = e.clientX; startL = rail.scrollLeft; });
  addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - startX; if (Math.abs(dx) > 5) { moved = true; rail.classList.add('is-drag'); } rail.scrollLeft = startL - dx; });
  addEventListener('pointerup', () => { if (!down) return; down = false; setTimeout(() => rail.classList.remove('is-drag'), 0); });
  rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  $$('.tabs button').forEach((b) => b.addEventListener('click', () => {
    $$('.tabs button').forEach((x) => x.classList.toggle('is-on', x === b));
    $$('.pc').forEach((p) => p.classList.toggle('is-hidden', b.dataset.f !== 'all' && p.dataset.c !== b.dataset.f));
    rail.scrollTo({ left: 0 }); upd();
  }));

  /* finder hover list */
  const fl = $$('.fx__list li'), fc = $$('.fx__card');
  const fset = (i) => { fl.forEach((l, j) => l.classList.toggle('is-on', j === i)); fc.forEach((c, j) => c.classList.toggle('is-on', j === i)); };
  fl.forEach((l, i) => { l.addEventListener('mouseenter', () => fine && fset(i)); l.addEventListener('click', () => fset(i)); });

  /* builder wizard */
  const S = { head: 'Blade', hand: 'Right', shaft: 'Stability Tour Black', adj: true, lie: 0, loft: 0, len: 34, grip: 'BGT Standard', gp: 0 };
  const steps = $$('.wz__steps li'), panes = $$('.wz__pane'), imgs = $$('.wz__img');
  const viewFor = ['head', 'head', 'shaft', 'head', 'grip', 'cover'];
  let step = 0;
  const show = (v) => imgs.forEach((i) => i.classList.toggle('is-on', i.dataset.v === v));
  const flash = (el, txt) => { if (el.textContent !== txt) { el.textContent = txt; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); } };
  const render = () => {
    const lie = 70 + (S.adj ? S.lie : 0), loft = 3 + (S.adj ? S.loft : 0);
    $('#vHead').textContent = S.head; $('#vHand').textContent = S.hand; $('#vShaft').textContent = S.shaft; $('#vGrip').textContent = S.grip;
    $('#vFit').textContent = `${lie}° · ${loft}° · ${S.len}"`;
    $('#oLie').textContent = lie + '°'; $('#oLoft').textContent = loft + '°'; $('#oLen').textContent = S.len.toFixed(1) + '"';
    flash($('#cLie'), `Lie ${lie}°`); flash($('#cLoft'), `Loft ${loft}°`); flash($('#cLen'), `${S.len.toFixed(1)}"`);
    const code = { 'Stability Tour Black': 'STB', 'Stability Tour One': 'ST1', 'Stability Carbon Pro': 'SCP', 'Stability Tour Long': 'STL', 'Paradox Multi-Material': 'PMM', 'Paradox Graphite': 'PGR' }[S.shaft];
    $('#sku').textContent = `PDX-${S.head === 'Blade' ? 'BLD' : 'MLT'}-${code}-${S.hand[0]}-${S.len}`;
    $('#warn').classList.toggle('is-on', !S.adj); $('#rLie').disabled = $('#rLoft').disabled = !S.adj;
    const tot = 399.99 + S.gp; $('#total').textContent = money(tot); $('#inst').textContent = money(Math.ceil(tot / 4 * 100) / 100);
    $('.wz__img[data-v="head"]').classList.toggle('flip', S.hand === 'Left');
    $('#rev').innerHTML = [['Putter', `Paradox${S.adj ? ' Tour' : ''} ${S.head}`], ['Hand', S.hand], ['Shaft', S.shaft], ['Lie / Loft', `${lie}° / ${loft}°`], ['Length', S.len.toFixed(1) + '"'], ['Grip', S.grip], ['Assembly & spec check', 'Included']].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  };
  const goStep = (n) => {
    step = clamp(n, 0, 5);
    steps.forEach((s, i) => { s.classList.toggle('is-on', i === step); if (i < step) s.classList.add('is-done'); });
    panes.forEach((p, i) => p.classList.toggle('is-on', i === step));
    show(viewFor[step]);
    $('#wzBack').disabled = step === 0;
    $('#wzNext').innerHTML = step === 5 ? 'Add build to bag <i><svg><use href="#i-bag"/></svg></i>' : 'Next step <i><svg><use href="#i-arrow"/></svg></i>';
  };
  steps.forEach((s, i) => s.addEventListener('click', () => goStep(i)));
  $('#wzBack').addEventListener('click', () => goStep(step - 1));
  $('#wzNext').addEventListener('click', () => {
    if (step < 5) return goStep(step + 1);
    const lie = 70 + (S.adj ? S.lie : 0), loft = 3 + (S.adj ? S.loft : 0);
    add({ name: `Paradox${S.adj ? ' Tour' : ''} ${S.head}`, price: 399.99 + S.gp, img: $('.wz__img[data-v="head"]').getAttribute('src'), meta: `${S.hand} · ${S.shaft} · ${S.len}" · ${lie}°/${loft}° · ${S.grip}` });
    steps.forEach((s) => s.classList.add('is-done'));
    setTimeout(() => open('cart'), 350);
  });
  $$('[data-g]').forEach((g) => g.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', g).forEach((x) => x.classList.toggle('is-on', x === b));
    const k = g.dataset.g;
    if (k === 'head') { S.head = b.dataset.v; $('.wz__img[data-v="head"]').src = b.dataset.img; show('head'); }
    if (k === 'hand') S.hand = b.dataset.v;
    if (k === 'shaft') { S.shaft = b.dataset.v; S.adj = b.dataset.adj === '1'; $('.wz__img[data-v="shaft"]').src = b.dataset.img; show('shaft'); if (!S.adj) { S.lie = S.loft = 0; $('#rLie').value = 0; $('#rLoft').value = 0; } }
    if (k === 'grip') { S.grip = b.dataset.v; S.gp = +b.dataset.p; }
    render();
  }));
  $('#rLie').addEventListener('input', (e) => { S.lie = +e.target.value; render(); });
  $('#rLoft').addEventListener('input', (e) => { S.loft = +e.target.value; render(); });
  $('#rLen').addEventListener('input', (e) => { S.len = +e.target.value; render(); });
  render(); goStep(0);

  /* compare slider */
  const cmp = $('#cmp'), hd = $('#cmpHandle');
  let drag = false;
  const setPos = (x) => { const r = cmp.getBoundingClientRect(); const p = clamp((x - r.left) / r.width * 100, 4, 96); cmp.style.setProperty('--pos', p + '%'); hd.setAttribute('aria-valuenow', Math.round(p)); };
  cmp.addEventListener('pointerdown', (e) => { drag = true; cmp.classList.add('is-drag'); setPos(e.clientX); cmp.setPointerCapture(e.pointerId); });
  cmp.addEventListener('pointermove', (e) => { if (drag) setPos(e.clientX); });
  cmp.addEventListener('pointerup', () => { drag = false; cmp.classList.remove('is-drag'); });
  hd.addEventListener('keydown', (e) => { const v = parseFloat(getComputedStyle(cmp).getPropertyValue('--pos')) || 50; if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); cmp.style.setProperty('--pos', clamp(v + (e.key === 'ArrowLeft' ? -5 : 5), 4, 96) + '%'); } });
  // gentle intro sweep when it scrolls into view
  const cio = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting || reduce) return; cio.disconnect();
    const s0 = performance.now();
    const sw = (t) => { const p = clamp((t - s0) / 1800, 0, 1); if (drag) return; const v = 50 + Math.sin(p * Math.PI * 2) * 22 * (1 - p); cmp.style.setProperty('--pos', v + '%'); if (p < 1) requestAnimationFrame(sw); };
    requestAnimationFrame(sw);
  }, { threshold: .5 });
  cio.observe(cmp);

  /* hub background video */
  let hubOn = false;
  const loadHub = () => {
    if (hubOn || reduce) return; hubOn = true;
    const f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/A9f6uEB-g1g?autoplay=1&mute=1&loop=1&playlist=A9f6uEB-g1g&controls=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1';
    f.allow = 'autoplay; encrypted-media'; f.tabIndex = -1; f.title = 'Background film';
    f.addEventListener('load', () => setTimeout(() => f.classList.add('ready'), 1200));
    $('#hubBg').appendChild(f);
  };

  /* dotted map */
  const cv = $('#dots');
  const drawDots = () => {
    const r = cv.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = r.width * dpr; cv.height = r.height * dpr;
    const c = cv.getContext('2d'); c.scale(dpr, dpr); c.clearRect(0, 0, r.width, r.height);
    const gap = 14;
    for (let y = gap; y < r.height; y += gap) for (let x = gap; x < r.width; x += gap) {
      const nx = x / r.width, ny = y / r.height;
      // rough continental-US silhouette
      const inside = ny > .16 + Math.sin(nx * 6) * .03 && ny < .86 - (nx > .55 && nx < .7 ? .0 : .08) - Math.max(0, (nx - .78)) * .9 && nx > .06 && nx < .94 && !(nx > .72 && ny > .72 && nx < .8);
      c.fillStyle = inside ? 'rgba(31,91,255,.38)' : 'rgba(10,15,26,.07)';
      c.beginPath(); c.arc(x, y, inside ? 2.1 : 1.4, 0, Math.PI * 2); c.fill();
    }
  };
  drawDots(); addEventListener('resize', drawDots);

  /* scroll loop */
  const hdr = $('.hdr'), prog = $('.progress'), big = $('#tourBig'), mbar = $('.mbar'), build = $('#build'), hub = $('.hub__main');
  let py = scrollY;
  const onScroll = () => {
    const y = scrollY, vh = innerHeight;
    hdr.classList.toggle('is-scrolled', y > 20);
    if (y > 700 && y > py + 4 && !dd.matches(':hover')) hdr.classList.add('is-hidden'); else if (y < py - 4 || y < 700) hdr.classList.remove('is-hidden');
    py = y;
    const h = document.documentElement.scrollHeight - vh; prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    const br = big.getBoundingClientRect(); big.style.setProperty('--fill', clamp((vh - br.top) / (vh * .8) * 100, 0, 100) + '%');
    const hr = hub.getBoundingClientRect(); if (hr.top < vh * 1.4 && hr.bottom > -100) loadHub();
    const bb = build.getBoundingClientRect(); mbar.classList.toggle('is-on', y > vh * .9 && !(bb.top < vh && bb.bottom > 0));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* reveal + counters */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -50px 0px' });
  $$('.rv, .tour__list').forEach((el) => io.observe(el));
  $$('[data-count]').forEach((el) => {
    const v = +el.dataset.count;
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; o.disconnect();
      if (reduce) { el.textContent = v.toLocaleString(); return; }
      const s0 = performance.now();
      const st = (t) => { const p = clamp((t - s0) / 1800, 0, 1); el.textContent = Math.round(v * (1 - Math.pow(1 - p, 4))).toLocaleString(); if (p < 1) requestAnimationFrame(st); };
      requestAnimationFrame(st);
    }, { threshold: .5 });
    o.observe(el);
  });

  /* cursor + magnetic */
  if (fine && !reduce) {
    const c = $('.cursor'), dot = $('.cursor span'), lab = $('.cursor em');
    let x = -100, y = -100, cx = x, cy = y;
    addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });
    const cl = () => { cx = lerp(cx, x, .22); cy = lerp(cy, y, .22); c.style.transform = `translate3d(${cx}px,${cy}px,0)`; requestAnimationFrame(cl); };
    requestAnimationFrame(cl);
    document.addEventListener('mouseover', (e) => {
      const l = e.target.closest('[data-cursor]'); const k = e.target.closest('a, button, summary, input, label, li[data-i]');
      c.classList.toggle('is-label', !!l); c.classList.toggle('is-link', !l && !!k); if (l) lab.textContent = l.dataset.cursor;
    });
    $$('.mag').forEach((m) => {
      m.addEventListener('mousemove', (e) => { const r = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`; });
      m.addEventListener('mouseleave', () => { m.style.transform = ''; });
    });
  }
})();
