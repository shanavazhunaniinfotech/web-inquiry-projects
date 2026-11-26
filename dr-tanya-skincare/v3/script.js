/* =========================================================
   Dr Tanya — V3 "Formulated in Light"
   GSAP + ScrollTrigger + Lenis + Three.js (lazy-loaded)
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const G = window.gsap;
  const ST = window.ScrollTrigger;
  const hasMotion = !!(G && ST) && !reduce;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const money = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const FREE_SHIP = 5000; // placeholder threshold — match the live shipping policy
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  if (G && ST) G.registerPlugin(ST);

  /* ---------------------------------------------------------
     CATALOGUE — real products & INR prices from drtanya.in
     --------------------------------------------------------- */
  const P = {
    'super-c': {
      name: 'Super C Serum', price: 4300, img: 'img/super-c.webp', cat: 'skin', tone: '#f6e1cd', badge: 'Bestseller',
      tag: 'Vitamin C · Day serum', size: '30 ml',
      desc: 'Antioxidant-rich Vitamin C day serum for brighter, firmer and more hydrated-looking skin.',
      model: 'pump', label: ['Super C', 'Serum'], tagline: 'Firms & Brightens',
      back: 'Antioxidant-rich Vitamin C day serum for brighter, firmer and more hydrated-looking skin.',
      hs: [
        { a: -40, y: 2.05, t: 'Vitamin C', d: 'Antioxidant-rich — for brighter, firmer, more hydrated-looking skin.' },
        { a: 78, y: 2.5, t: 'Your morning step', d: 'Dr Tanya’s day serum. Apply after cleansing, every morning.' },
        { a: 0, y: 5.35, r: .41, t: 'Pump dispenser', d: 'A clean, easy dose — no dipping fingers into the bottle.' }
      ]
    },
    'retinol': {
      name: 'Advanced Retinol Serum', price: 4500, img: 'img/retinol.webp', cat: 'skin', tone: '#e4e4f1',
      tag: 'Vitamin A · Night serum', size: '30 ml',
      desc: 'The ultimate overnight elixir to rewind, renew and reveal a more radiant you.',
      model: 'pump', label: ['Advanced', 'Retinol Serum'], tagline: 'Rewind & Renew',
      back: 'The ultimate overnight elixir to rewind, renew and achieve a more radiant you.',
      hs: [
        { a: 40, y: 2.05, t: 'Vitamin A', d: 'The overnight elixir — rewind, renew, reveal.' },
        { a: -78, y: 2.5, t: 'Your night step', d: 'Part of the PM protocol. Apply after cleansing, at night.' },
        { a: 0, y: 5.35, r: .41, t: 'Pump dispenser', d: 'A clean, easy dose — no dipping fingers into the bottle.' }
      ]
    },
    'hyaluronic': {
      name: 'Hyaluronic Acid Serum', price: 3700, img: 'img/hyaluronic.webp', cat: 'skin', tone: '#d9ebee', badge: 'New',
      tag: 'Hydration · Vitamin B5', size: '30 ml',
      desc: 'Doctor-formulated serum for optimal hydration, plumpness and anti-ageing support.',
      model: 'dropper', label: ['Hyaluronic', 'Acid Serum'], tagline: 'Ultra Hydration',
      back: 'Doctor-formulated serum for optimal hydration, plumpness and anti-ageing support.',
      hs: [
        { a: -40, y: 2.0, t: 'Hyaluronic Acid', d: 'Optimal hydration and plumpness, for all skin types.' },
        { a: 80, y: 2.4, t: 'Vitamin B5', d: 'Paired with Vitamin B5 in a doctor-formulated serum.' },
        { a: 0, y: 5.5, r: .3, t: 'Precision dropper', d: 'Draw up exactly what you need — nothing wasted.' }
      ]
    },
    'cream': {
      name: 'Holy Basil Day & Night Cream', price: 2500, img: 'img/cream.webp', cat: 'skin', tone: '#dfe8dc', badge: 'Bestseller', wide: true,
      tag: 'Holy Basil · Vitamin E', size: '70 ml',
      desc: 'A gentle, results-driven hydrating cream with ancient Holy Basil — moisturised, restored and youthful from AM to PM.',
      model: 'jar',
      hs: [
        { a: 38, y: .9, t: 'Holy Basil (Tulsi)', d: 'An ancient botanical in a gentle, results-driven cream.' },
        { a: 82, y: .55, t: 'Vitamin E', d: 'Keeps skin moisturised, restored and youthful-looking.' },
        { a: -42, y: 1.7, r: 1.04, t: 'Day & night', d: 'One cream for your whole routine — AM to PM.' }
      ]
    },
    'nusonic': {
      name: 'NuSonic Facial Exfoliator', price: 2700, img: 'img/nusonic.webp', cat: 'tools', tone: '#e7eee9', badge: 'Bestseller', wide: true,
      tag: 'Sonic exfoliation · Tool', size: 'Device',
      desc: 'A pocket-sized face exfoliator that helps loosen dead-skin build-up to reveal a more rejuvenated, glowing complexion.'
    },
    'hair-serum': {
      name: 'Holy Basil Hair Serum', price: 1075, img: 'img/hair-serum.webp', cat: 'hair', tone: '#ebe4d3', badge: 'New',
      tag: 'Holy Basil · Scalp & hair', size: '30 ml',
      desc: 'A unique scalp and hair serum with sacred Indian Holy Basil to revive dull, tired-looking hair.',
      model: 'dropper-green',
      hs: [
        { a: 40, y: 1.5, t: 'Sacred Indian Holy Basil', d: 'Revives the dullest, tired-looking hair.' },
        { a: 0, y: 3.45, r: .64, t: 'Gold dropper', d: 'Apply straight to the scalp, where it counts.' },
        { a: -80, y: 1.1, t: 'Pairs with NuBrush', d: 'Load it into the serum-dispensing scalp massager.' }
      ]
    },
    'nubrush': {
      name: 'NuBrush', price: 2200, img: 'img/nubrush.webp', cat: 'tools', tone: '#e6e7e2', wide: true,
      tag: 'Scalp massager · Tool', size: 'Device',
      desc: 'A serum-dispensing hair massager and scalp-rejuvenating technology.'
    },
    'conditioner': {
      name: 'Holy Basil Conditioner', price: 1600, img: 'img/conditioner.webp', cat: 'hair', tone: '#e0eae4', badge: 'New',
      tag: 'Holy Basil · Niacinamide', size: '250 ml',
      desc: 'Where modern therapeutics meet ancient beauty rituals — a mindful blend of conditioning botanicals.'
    },
    'shampoo': {
      name: 'Holy Basil Shampoo', price: 1600, img: 'img/shampoo.webp', cat: 'hair', tone: '#e0eae4', soldOut: true,
      tag: 'Paraben & sulphate-free', size: '250 ml',
      desc: 'Healthier, stronger-looking hair with a paraben and sulphate-free Holy Basil formula.'
    }
  };
  const ORDER = ['super-c', 'cream', 'nusonic', 'retinol', 'hyaluronic', 'hair-serum', 'nubrush', 'conditioner', 'shampoo'];
  const PAIRS = {
    'super-c': ['hyaluronic', 'cream', 'nusonic', 'retinol'],
    'retinol': ['hyaluronic', 'cream', 'super-c', 'nusonic'],
    'hyaluronic': ['cream', 'super-c', 'retinol'],
    'cream': ['super-c', 'hyaluronic', 'nusonic'],
    'nusonic': ['super-c', 'cream', 'hyaluronic'],
    'hair-serum': ['nubrush', 'conditioner'],
    'nubrush': ['hair-serum', 'conditioner'],
    'conditioner': ['hair-serum', 'nubrush'],
    'shampoo': ['conditioner', 'hair-serum']
  };
  const WHY = {
    'super-c': 'Your AM brightener', 'retinol': 'Your PM renewer', 'hyaluronic': 'Hydrate after serum',
    'cream': 'Seal it all in', 'nusonic': 'Prep step', 'hair-serum': 'Pairs with NuBrush',
    'nubrush': 'Massage it in', 'conditioner': 'Finish the ritual', 'shampoo': 'Hair ritual'
  };
  const ICON_PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

  /* ---------------------------------------------------------
     TEXT HELPERS
     --------------------------------------------------------- */
  // wrap words (keeps <em> etc.) — mode "mask" adds overflow wrappers for rise reveals
  function splitWords(el, mode) {
    const out = [];
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const inner = document.createElement('span');
            inner.textContent = part;
            if (mode === 'mask') {
              const m = document.createElement('span'); m.className = 'wm';
              inner.className = 'wi'; m.appendChild(inner); frag.appendChild(m);
            } else { inner.className = 'w'; frag.appendChild(inner); }
            out.push(inner);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('wm')) walk(n);
      });
    };
    walk(el);
    return out;
  }
  function splitChars(el, cls = 'char') {
    const out = [];
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...n.textContent].forEach(ch => {
            if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span'); s.className = cls; s.textContent = ch; frag.appendChild(s); out.push(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return out;
  }
  // per-character text roll on hover
  $$('[data-roll]').forEach(el => {
    const txt = el.textContent.trim();
    const chars = [...txt].map((c, i) => `<span style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
    el.setAttribute('aria-label', txt);
    el.innerHTML = `<span class="roll__a" aria-hidden="true">${chars}</span><span class="roll__b" aria-hidden="true">${chars}</span>`;
  });

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ---------------------------------------------------------
     SMOOTH SCROLL (Lenis)
     --------------------------------------------------------- */
  let lenis = null;
  if (hasMotion && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ST.update);
    G.ticker.add(t => lenis.raf(t * 1000));
    G.ticker.lagSmoothing(0);
    lenis.stop();
  }
  if (ST) ST.config({ ignoreMobileResize: true });
  const scrollToEl = (target, offset = 0) => {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.5 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#') { e.preventDefault(); return; }
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    closeMenu();
    scrollToEl(target);
  });

  /* ---------------------------------------------------------
     HEADER, MENU, PROGRESS
     --------------------------------------------------------- */
  const hdr = $('#hdr');
  let lastY = 0;
  const onScrollHeader = y => {
    hdr.classList.toggle('is-scrolled', y > 40);
    const goingDown = y > lastY + 2, goingUp = y < lastY - 2;
    if (goingDown && y > 400 && !document.body.classList.contains('menu-open')) hdr.classList.add('is-hidden');
    else if (goingUp) hdr.classList.remove('is-hidden');
    lastY = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => onScrollHeader(scroll));
  else addEventListener('scroll', () => onScrollHeader(scrollY), { passive: true });

  const burger = $('#burger');
  function closeMenu() {
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    $('#mnav').setAttribute('aria-hidden', 'true');
    if (lenis && !cartOpen) lenis.start();
  }
  burger.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    $('#mnav').setAttribute('aria-hidden', String(!open));
    hdr.classList.remove('is-hidden');
    if (lenis) open ? lenis.stop() : lenis.start();
  });

  /* ---------------------------------------------------------
     CURSOR + MAGNETIC + BUTTON FILL ORIGIN
     --------------------------------------------------------- */
  if (fine && G && !reduce) {
    root.classList.add('has-cursor');
    const cur = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), lab = $('.cursor__label');
    const dx = G.quickSetter(dot, 'css'), pos = { x: -100, y: -100 }, rp = { x: -100, y: -100 };
    addEventListener('pointermove', e => { pos.x = e.clientX; pos.y = e.clientY; dx({ x: pos.x, y: pos.y }); }, { passive: true });
    G.set([dot, ring], { xPercent: 0, yPercent: 0 });
    G.ticker.add(() => {
      rp.x += (pos.x - rp.x) * .18; rp.y += (pos.y - rp.y) * .18;
      ring.style.transform = `translate3d(${rp.x}px, ${rp.y}px, 0)`;
    });
    document.addEventListener('pointerover', e => {
      const l = e.target.closest('[data-cursor]');
      const h = e.target.closest('a, button, [role="tab"], input, label');
      if (l && !h) { lab.textContent = l.dataset.cursor; cur.classList.add('is-label'); cur.classList.remove('is-hover'); }
      else { cur.classList.remove('is-label'); cur.classList.toggle('is-hover', !!h); }
    });
    document.addEventListener('pointerleave', () => { pos.x = pos.y = -100; dx({ x: -100, y: -100 }); });

    $$('[data-magnetic]').forEach(el => {
      const xTo = G.quickTo(el, 'x', { duration: .6, ease: 'power3.out' });
      const yTo = G.quickTo(el, 'y', { duration: .6, ease: 'power3.out' });
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .28);
        yTo((e.clientY - r.top - r.height / 2) * .32);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }
  document.addEventListener('pointerover', e => {
    const b = e.target.closest('.btn');
    if (!b || b._fillBound) return;
    b._fillBound = true;
    b.addEventListener('pointerenter', ev => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100) + '%');
      b.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100) + '%');
    });
    b.addEventListener('pointerleave', ev => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100) + '%');
      b.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100) + '%');
    });
  });

  /* ---------------------------------------------------------
     HERO — parallax depth, dynamic light, particles, intro, scroll
     --------------------------------------------------------- */
  const hero = $('.hero');
  const heroLines = $$('.hero__line');
  const heroChars = heroLines.map(l => splitChars(l));
  const depthEls = $$('.hero [data-depth]').map(el => ({ el, d: parseFloat(el.dataset.depth) || 0 }));
  const superIn = $('.hp--superc .hp__in');
  let heroVisible = true;
  new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; }, { threshold: 0 }).observe(hero);

  let mx = 0, my = 0, cxp = 0, cyp = 0, pointerActive = false;
  if (fine) {
    hero.addEventListener('pointermove', e => { pointerActive = true; mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; });
    hero.addEventListener('pointerleave', () => { pointerActive = false; });
  }
  const heroTick = time => {
    if (!heroVisible) return;
    const t = time || performance.now() / 1000;
    if (!pointerActive) { mx = Math.sin(t * .35) * .45; my = Math.cos(t * .28) * .25; }
    cxp += (mx - cxp) * .055; cyp += (my - cyp) * .055;
    for (const o of depthEls) {
      o.el.style.setProperty('--px', (cxp * o.d * 1.5).toFixed(2) + 'px');
      o.el.style.setProperty('--py', (cyp * o.d * .7).toFixed(2) + 'px');
    }
    hero.style.setProperty('--lx', (50 + cxp * 28).toFixed(2) + '%');
    hero.style.setProperty('--ly', (40 + cyp * 18).toFixed(2) + '%');
    hero.style.setProperty('--sx', (50 - cxp * 20 + Math.sin(t * .8) * 4).toFixed(2));
    hero.style.setProperty('--shx', (-cxp * 16).toFixed(1) + 'px');
    if (superIn) superIn.style.setProperty('--ry', (cxp * 12).toFixed(2) + 'deg');
  };
  if (!reduce) { if (G) G.ticker.add(heroTick); else (function loop() { heroTick(); requestAnimationFrame(loop); })(); }

  // floating light particles
  (function particles() {
    const cv = $('#particles');
    if (!cv || reduce) return;
    const ctx = cv.getContext('2d');
    const sprite = document.createElement('canvas'); sprite.width = sprite.height = 64;
    const sc = sprite.getContext('2d'), gr = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,240,214,1)'); gr.addColorStop(.35, 'rgba(255,230,190,.45)'); gr.addColorStop(1, 'rgba(255,230,190,0)');
    sc.fillStyle = gr; sc.fillRect(0, 0, 64, 64);
    let w = 0, h = 0, dpr = 1; const N = fine ? 70 : 34; const ps = [];
    const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); addEventListener('resize', size);
    for (let i = 0; i < N; i++) ps.push({ x: Math.random() * w, y: Math.random() * h, z: .25 + Math.random() * .75, vy: .12 + Math.random() * .35, a: .15 + Math.random() * .55, ph: Math.random() * 6.28, s: 2 + Math.random() * 5 });
    const draw = () => {
      requestAnimationFrame(draw);
      if (!heroVisible || document.hidden) return;
      const t = performance.now();
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of ps) {
        p.y -= p.vy * p.z; p.x += Math.sin(t * .0004 + p.ph) * .12;
        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
        const x = p.x + cxp * 26 * p.z, y = p.y + cyp * 12 * p.z;
        ctx.globalAlpha = p.a * (.55 + .45 * Math.sin(t * .0016 + p.ph));
        const s = p.s * p.z * 4;
        ctx.drawImage(sprite, x - s / 2, y - s / 2, s, s);
      }
    };
    draw();
  })();

  // intro (plays after loader)
  function heroIntro() {
    if (!hasMotion) return;
    const tl = G.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero__bg', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
      .from('.hero__floor', { scaleX: 0, duration: 1.6, ease: 'expo.inOut' }, 0)
      .from('.hp__in', { y: () => innerHeight * .45, opacity: 0, duration: 1.8, stagger: { each: .08, from: 'center' }, clearProps: 'opacity' }, .1)
      .from(heroChars[0], { yPercent: 115, rotate: 8, duration: 1.3, stagger: .025 }, .35)
      .from(heroChars[1].concat(heroChars[2]), { yPercent: 115, rotate: 8, duration: 1.3, stagger: .03 }, .5)
      .from('[data-hero-ui]', { y: 26, opacity: 0, duration: 1.1, stagger: .08, ease: 'power3.out' }, .95)
      .from(['.hdr__note', '.hdr__bar'], { y: -90, opacity: 0, duration: 1.2, stagger: .08, clearProps: 'transform,opacity' }, .8);
    return tl;
  }
  // scroll — "camera dolly" into Super C
  if (hasMotion) {
    const W = () => innerWidth, H = () => innerHeight;
    G.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, start: 'top top', end: () => '+=' + Math.round(H() * (innerWidth < 900 ? .6 : .95)), scrub: .9, pin: true, anticipatePin: 1, invalidateOnRefresh: true }
    })
      .to('.hp--superc', { scale: 1.34, y: () => -H() * .05 }, 0)
      .to('.hp--retinol', { x: () => -W() * .3, rotation: -7, opacity: 0 }, 0)
      .to('.hp--hyaluronic', { x: () => W() * .3, rotation: 7, opacity: 0 }, 0)
      .to('.hp--hair', { x: () => W() * .36, opacity: 0 }, 0)
      .to('.hp--cream', { x: () => -W() * .22, y: () => H() * .28, scale: 1.4, opacity: 0 }, 0)
      .to('.hp--nusonic', { x: () => W() * .2, y: () => H() * .3, scale: 1.4, opacity: 0 }, 0)
      .to('.hero__line--1', { y: () => -H() * .2, opacity: 0 }, 0)
      .to('.hero__line--2a', { x: () => -W() * .28, opacity: 0 }, 0)
      .to('.hero__line--2b', { x: () => W() * .28, opacity: 0 }, 0)
      .to('.hero__ui, .hero__top', { y: 50, opacity: 0, duration: .5 }, 0)
      .to('.hero__beam', { opacity: 0, duration: .6 }, 0)
      .to('.hp--superc', { opacity: 0, y: () => -H() * .16, duration: .35 }, .65);
  }

  /* ---------------------------------------------------------
     PRELOADER
     --------------------------------------------------------- */
  function runLoader(done) {
    const loader = $('#loader');
    if (!hasMotion) { loader.remove(); document.body.classList.remove('is-loading'); done(); return; }
    const num = $('#loadNum'), bar = $('#loadBar');
    const imgs = $$('.hero img');
    let loaded = 0; const total = imgs.length + 1;
    const state = { p: 0, target: 0 };
    const bump = () => { loaded++; state.target = loaded / total; };
    imgs.forEach(img => { if (img.complete) bump(); else { img.addEventListener('load', bump, { once: true }); img.addEventListener('error', bump, { once: true }); } });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(bump);
    setTimeout(() => { state.target = 1; }, 3500);
    G.timeline()
      .to('.lm--bar', { strokeDashoffset: 0, duration: .6, ease: 'power2.inOut' })
      .to('.lm--stem', { strokeDashoffset: 0, duration: .55, ease: 'power2.inOut' }, '-=.25')
      .to('.lm--bowl', { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut' }, '-=.2')
      .from('.loader__word span', { yPercent: 110, duration: 1, ease: 'expo.out' }, .15);
    const start = performance.now();
    let exiting = false;
    const tick = () => {
      state.p += (state.target - state.p) * .08;
      const shown = Math.min(state.p, (performance.now() - start) / 1500);
      num.textContent = String(Math.round(shown * 100)).padStart(3, '0');
      bar.style.transform = `scaleX(${shown})`;
      if (!exiting && shown > .995) {
        exiting = true; G.ticker.remove(tick);
        num.textContent = '100';
        G.timeline({ onComplete: () => { loader.remove(); } })
          .to('.loader__in', { y: -40, opacity: 0, duration: .6, ease: 'power3.in' })
          .to(loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '-=.15')
          .add(() => { document.body.classList.remove('is-loading'); if (lenis) lenis.start(); done(); }, '-=.75');
      }
    };
    G.ticker.add(tick);
  }

  /* ---------------------------------------------------------
     KINETIC RIBBONS (velocity-reactive marquee)
     --------------------------------------------------------- */
  let scrollDir = 1;
  if (lenis) lenis.on('scroll', ({ direction }) => { if (direction) scrollDir = direction; });
  $$('[data-marquee]').forEach(track => {
    const unit = track.innerHTML;
    track.innerHTML = unit;
    const reps = Math.max(1, Math.ceil((innerWidth * 1.3) / Math.max(1, track.scrollWidth)));
    track.innerHTML = unit.repeat(reps * 2);
    const dir = +track.dataset.marquee || 1;
    let x = 0, half = track.scrollWidth / 2, skew = 0, vis = false;
    addEventListener('resize', () => { half = track.scrollWidth / 2; });
    if (document.fonts) document.fonts.ready.then(() => { half = track.scrollWidth / 2; });
    new IntersectionObserver(([en]) => { vis = en.isIntersecting; }).observe(track);
    const step = (t, dt) => {
      if (!vis) return;
      const v = lenis ? lenis.velocity : 0;
      const speed = (reduce ? 0 : .7) + Math.min(Math.abs(v) * .35, 14);
      x -= dir * scrollDir * speed * (dt / 16.67);
      if (x <= -half) x += half; if (x > 0) x -= half;
      skew += ((clamp(v * .25, -7, 7)) - skew) * .1;
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${(-skew * dir).toFixed(2)}deg)`;
    };
    if (G) G.ticker.add(step);
  });

  /* ---------------------------------------------------------
     GENERIC REVEALS
     --------------------------------------------------------- */
  if (hasMotion) {
    $$('[data-split]').forEach(h => {
      const words = splitWords(h, 'mask');
      G.from(words, { yPercent: 115, rotate: 4, duration: 1.15, ease: 'expo.out', stagger: .045, scrollTrigger: { trigger: h, start: 'top 86%', once: true } });
    });
    ST.batch('[data-reveal]', {
      start: 'top 88%', once: true,
      onEnter: els => G.from(els, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .1 })
    });
  }

  /* ---------------------------------------------------------
     STORY — pinned, scrubbed chapters
     --------------------------------------------------------- */
  const chs = $$('.ch'), svs = $$('.sv'), sws = $$('.sw'), rail = $$('.story__rail li');
  const chChars = chs.map(c => { const out = []; $$('.ch__title > span, .ch__title > em', c).forEach(s => out.push(...splitChars(s, 'c'))); return out; });
  const STORY_BG = ['#f3dcc6', '#dedff0', '#d3e8ea', '#1d4a48'];
  let storyIdx = 0;
  if (!hasMotion) $('.story').classList.add('is-static');
  if (hasMotion) {
    const mm = G.matchMedia();
    mm.add('(min-width: 901px)', () => {
      const parts = c => $$('.ch__kicker, .ch__line, .ch__desc, .ch__chips, .ch__buy', c);
      const tagsOf = i => $$(`.stag[data-i="${i}"]`);
      G.set(svs.slice(1), { autoAlpha: 0 });
      G.set(chs.slice(1), { autoAlpha: 0 });
      G.set(sws.slice(1), { autoAlpha: 0 });
      G.set($$('.stag').filter(s => s.dataset.i !== '0'), { autoAlpha: 0 });
      const mids = [];
      const tl = G.timeline({ defaults: { ease: 'power2.inOut' } });
      tl.to({}, { duration: .6 });
      tl.addLabel('c0', 0);
      for (let a = 0; a < 3; a++) {
        const b = a + 1, at = tl.duration();
        mids.push(at + .55);
        tl.to(chChars[a], { yPercent: -115, stagger: .008, duration: .5, ease: 'power3.in' }, at)
          .to(parts(chs[a]), { y: -26, autoAlpha: 0, stagger: .03, duration: .4, ease: 'power2.in' }, at)
          .set(chs[a], { autoAlpha: 0 }, at + .6)
          .set(chs[b], { autoAlpha: 1 }, at + .5)
          .fromTo(chChars[b], { yPercent: 115 }, { yPercent: 0, stagger: .01, duration: .6, ease: 'power3.out', immediateRender: false }, at + .5)
          .fromTo(parts(chs[b]), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: .04, duration: .5, ease: 'power2.out', immediateRender: false }, at + .6)
          .to(svs[a], { x: () => -innerWidth * .3, rotationY: -75, scale: .72, autoAlpha: 0, filter: 'blur(10px)', duration: 1, ease: 'power2.in' }, at)
          .fromTo(svs[b], { x: () => innerWidth * .3, rotationY: 75, scale: .72, autoAlpha: 0, filter: 'blur(10px)' },
            { x: 0, rotationY: 0, scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out', immediateRender: false }, at + .4)
          .to(sws[a], { xPercent: -25, autoAlpha: 0, duration: 1 }, at)
          .fromTo(sws[b], { xPercent: 25, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 1.1, immediateRender: false }, at + .3)
          .to(tagsOf(a), { scale: .6, autoAlpha: 0, duration: .35, stagger: .05 }, at)
          .fromTo(tagsOf(b), { scale: .6, y: 18, autoAlpha: 0 }, { scale: 1, y: 0, autoAlpha: 1, duration: .5, stagger: .08, ease: 'back.out(2)', immediateRender: false }, at + .85)
          .to('#storyBg', { backgroundColor: STORY_BG[b], duration: 1.1 }, at + .15)
          .addLabel('c' + b, at + 1.45)
          .to({}, { duration: .65 });
      }
      tl.fromTo('.story__words', { x: 0 }, { x: () => -innerWidth * .12, ease: 'none', duration: tl.duration() }, 0);
      const setIdx = i => {
        if (i === storyIdx) return;
        storyIdx = i;
        $('#storyNum').textContent = String(i + 1).padStart(2, '0');
        $('.story').classList.toggle('is-dark', i === 3);
      };
      const labelTimes = ['c0', 'c1', 'c2', 'c3'].map(l => tl.labels[l]);
      const storyST = ST.create({
        animation: tl, trigger: '.story', start: 'top top', end: () => '+=' + Math.round(innerHeight * 3.6),
        pin: true, scrub: .8, anticipatePin: 1, invalidateOnRefresh: true,
        snap: lenis ? false : { snapTo: 'labels', duration: { min: .3, max: .9 }, delay: .15, ease: 'power2.inOut' },
        onUpdate: self => {
          const t = tl.duration() * self.progress;
          let i = 0; mids.forEach(m => { if (t > m) i++; });
          setIdx(i);
          rail.forEach((li, k) => li.style.setProperty('--p', clamp((t - (k === 0 ? 0 : mids[k - 1])) / ((mids[k] || tl.duration()) - (k === 0 ? 0 : mids[k - 1])), 0, 1).toFixed(3)));
          if (self.isActive) hdr.dataset.theme = i === 3 ? 'dark' : 'light';
        }
      });
      // gentle settle onto the nearest chapter when scrolling stops (Lenis-driven)
      let snapT = null, snappingStory = false;
      const easeOut = x => 1 - Math.pow(1 - x, 3);
      const onLenis = () => {
        clearTimeout(snapT);
        if (snappingStory) return;
        snapT = setTimeout(() => {
          if (!storyST.isActive || Math.abs(lenis.velocity) > .05) return;
          const t = tl.duration() * storyST.progress;
          let best = labelTimes[0];
          labelTimes.forEach(lt => { if (Math.abs(lt - t) < Math.abs(best - t)) best = lt; });
          const y = storyST.start + (best / tl.duration()) * (storyST.end - storyST.start);
          if (Math.abs(y - lenis.scroll) < 6) return;
          snappingStory = true;
          lenis.scrollTo(y, { duration: .9, easing: easeOut, onComplete: () => { snappingStory = false; } });
          setTimeout(() => { snappingStory = false; }, 1100);
        }, 180);
      };
      if (lenis) lenis.on('scroll', onLenis);
      // entry reveal on elements the scrubbed timeline never touches
      G.from('.ch[data-i="0"] .ch__title', { y: 70, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.story', start: 'top 55%', once: true } });
      G.from('.sv[data-i="0"] img', { y: 120, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.story', start: 'top 55%', once: true } });
      return () => { if (lenis) lenis.off('scroll', onLenis); G.set([...chs, ...svs, ...sws, ...$$('.stag')], { clearProps: 'all' }); };
    });
    mm.add('(max-width: 900px)', () => {
      chs.forEach(c => G.from(c, { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 88%', once: true } }));
    });
  }

  /* ---------------------------------------------------------
     CONCERNS — kinetic list + cursor image
     --------------------------------------------------------- */
  const CONCERNS = [
    { name: 'Acne', img: '../images/concern-acne.webp', note: 'Breakouts love build-up. Keep pores clear and skin balanced — without stripping it.', ids: ['nusonic', 'super-c'] },
    { name: 'Sensitive', img: '../images/concern-sensitive.webp', note: 'Calm, hydrate and keep it simple: fewer steps, gentler formulas.', ids: ['hyaluronic', 'cream'] },
    { name: 'Normal', img: '../images/concern-normal.webp', note: 'Protect what you have with a consistent morning and night routine.', ids: ['super-c', 'hyaluronic', 'cream'] },
    { name: 'Pigmentation', img: '../images/concern-pigmentation.webp', note: 'Uneven tone rewards consistency — brighten by day, renew by night.', ids: ['super-c', 'retinol', 'nusonic'] },
    { name: 'Hair', img: '../images/j-hair.webp', note: 'Healthy hair starts at the scalp. Massage, nourish, repeat.', ids: ['hair-serum', 'nubrush', 'conditioner'] }
  ];
  const miniHTML = (id, sub) => {
    const p = P[id];
    return `<div class="mini" style="--tone:${p.tone}"><span class="mini__img"><img src="${p.img}" alt="" loading="lazy"></span><div><strong>${p.name}</strong><small>${sub || p.tag} · ${money(p.price)}</small></div>${p.soldOut ? '' : `<button class="plus" data-add="${id}" aria-label="Add ${p.name} to bag">${ICON_PLUS}</button>`}</div>`;
  };
  const clist = $('#clist');
  clist.innerHTML = CONCERNS.map((c, i) => `
    <li class="crow" data-img="${c.img}">
      <button class="crow__btn" aria-expanded="false" aria-controls="cp${i}">
        <span class="crow__no">0${i + 1}</span>
        <span class="crow__word"><span>${c.name}</span><span aria-hidden="true">${c.name}</span></span>
        <span class="crow__meta"><b>${c.ids.length} picks</b>by Dr Tanya</span>
        <span class="crow__arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></span>
      </button>
      <div class="crow__panel" id="cp${i}"><div><div class="crow__inner">
        <div class="crow__img"><img src="${c.img}" alt="" loading="lazy"></div>
        <div class="crow__note"><span class="mono">The approach</span><p>${c.note}</p></div>
        <div class="crow__picks">${c.ids.map(id => miniHTML(id)).join('')}</div>
      </div></div></div>
    </li>`).join('');
  clist.addEventListener('click', e => {
    const b = e.target.closest('.crow__btn'); if (!b) return;
    const row = b.parentElement, open = !row.classList.contains('is-open');
    $$('.crow', clist).forEach(r => { r.classList.remove('is-open'); $('.crow__btn', r).setAttribute('aria-expanded', 'false'); });
    if (open) { row.classList.add('is-open'); b.setAttribute('aria-expanded', 'true'); }
    setTimeout(() => ST && ST.refresh(), 750);
  });
  if (fine && G && !reduce) {
    const fl = $('#cfloat'), fimg = $('img', fl);
    const xTo = G.quickTo(fl, 'x', { duration: .7, ease: 'power3.out' }), yTo = G.quickTo(fl, 'y', { duration: .7, ease: 'power3.out' });
    const rTo = G.quickTo(fl, 'rotation', { duration: .8, ease: 'power3.out' });
    let lx = 0;
    G.set(fl, { xPercent: -50, yPercent: -50, x: -500, y: -500 });
    clist.addEventListener('pointermove', e => { xTo(e.clientX + 150); yTo(e.clientY); rTo(clamp((e.clientX - lx) * .8, -14, 14)); lx = e.clientX; });
    clist.addEventListener('pointerover', e => {
      const row = e.target.closest('.crow'); if (!row || row.classList.contains('is-open')) { G.to(fl, { opacity: 0, scale: .85, duration: .3 }); return; }
      if (fimg.getAttribute('src') !== row.dataset.img) fimg.src = row.dataset.img;
      G.to(fl, { opacity: 1, scale: 1, duration: .45, ease: 'power3.out' });
    });
    clist.addEventListener('pointerleave', () => G.to(fl, { opacity: 0, scale: .85, duration: .35 }));
  }

  /* ---------------------------------------------------------
     SHOP RAIL — 3D tilt cards, drag, filters
     --------------------------------------------------------- */
  const track = $('#railTrack'), railEl = $('#rail');
  track.innerHTML = ORDER.map(id => {
    const p = P[id];
    const badge = p.soldOut ? '<span class="pcard__badge">Back soon</span>' : p.badge ? `<span class="pcard__badge ${p.badge === 'New' ? 'pcard__badge--new' : ''}">${p.badge}</span>` : '';
    const btn = p.soldOut
      ? `<button class="addbtn addbtn--sold" data-notify="${id}">Notify me</button>`
      : `<button class="addbtn" data-add="${id}" aria-label="Add ${p.name} to bag"><span>Add</span><i>${ICON_PLUS}</i></button>`;
    return `<article class="pcard" data-cat="${p.cat}" style="--tone:${p.tone}">
      <div class="pcard__tilt">
        <div class="pcard__media">${badge}${p.model ? `<button class="pcard__360" data-view360="${id}" aria-label="View ${p.name} in 360°">360°</button>` : ''}
          <img class="pcard__img ${p.wide ? 'pcard__img--wide' : ''}" src="${p.img}" alt="${p.name}" loading="lazy">
          <span class="pcard__glare"></span>
        </div>
      </div>
      <div class="pcard__body"><p class="pcard__tag">${p.tag}</p><h3 class="pcard__name">${p.name}</h3>
        <div class="pcard__foot"><span class="pcard__price">${money(p.price)}</span>${btn}</div></div>
    </article>`;
  }).join('');
  if (fine && !reduce) {
    $$('.pcard', track).forEach(card => {
      const tilt = $('.pcard__tilt', card), media = $('.pcard__media', card);
      card.addEventListener('pointermove', e => {
        const r = media.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        tilt.style.transform = `rotateY(${(px - .5) * 14}deg) rotateX(${(.5 - py) * 12}deg)`;
        media.style.setProperty('--gx', px * 100 + '%'); media.style.setProperty('--gy', py * 100 + '%');
      });
      card.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
    });
  }
  // drag to scroll (mouse)
  (function dragRail() {
    let down = false, sx = 0, sl = 0, moved = false;
    railEl.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; sx = e.clientX; sl = railEl.scrollLeft; });
    addEventListener('pointermove', e => {
      if (!down) return;
      const d = e.clientX - sx;
      if (Math.abs(d) > 6) { moved = true; railEl.classList.add('is-drag'); }
      if (moved) railEl.scrollLeft = sl - d;
    });
    addEventListener('pointerup', () => { if (!down) return; down = false; setTimeout(() => railEl.classList.remove('is-drag'), 0); });
    railEl.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    const bar = $('#railBar');
    const upd = () => {
      const max = railEl.scrollWidth - railEl.clientWidth;
      const vis = railEl.clientWidth / railEl.scrollWidth;
      bar.style.width = clamp(vis * 100, 10, 100) + '%';
      bar.style.transform = `translateX(${max > 0 ? (railEl.scrollLeft / max) * ((1 / Math.max(vis, .1)) - 1) * 100 : 0}%)`;
    };
    railEl.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
    const stepW = () => ($('.pcard:not(.is-out)', track)?.offsetWidth || 300) + 18;
    $('#railPrev').addEventListener('click', () => railEl.scrollBy({ left: -stepW() * 2, behavior: 'smooth' }));
    $('#railNext').addEventListener('click', () => railEl.scrollBy({ left: stepW() * 2, behavior: 'smooth' }));
    railEl._upd = upd;
  })();
  // filters with sliding indicator
  (function filters() {
    const wrap = $('#filters'), ind = $('.filters__ind', wrap), btns = $$('button', wrap);
    const place = b => { ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft - 5}px)`; };
    requestAnimationFrame(() => place(btns[0]));
    addEventListener('resize', () => place(btns.find(b => b.getAttribute('aria-selected') === 'true')));
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => place(btns.find(b => b.getAttribute('aria-selected') === 'true')));
    wrap.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      btns.forEach(x => x.setAttribute('aria-selected', String(x === b)));
      place(b);
      const f = b.dataset.f;
      const cards = $$('.pcard', track);
      cards.forEach(c => c.classList.toggle('is-out', f !== 'all' && c.dataset.cat !== f));
      railEl.scrollTo({ left: 0 });
      if (G && !reduce) G.fromTo(cards.filter(c => !c.classList.contains('is-out')), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'expo.out', stagger: .06 });
      railEl._upd();
    });
  })();
  if (hasMotion) G.from('.pcard', { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .07, scrollTrigger: { trigger: '#rail', start: 'top 85%', once: true } });

  /* ---------------------------------------------------------
     SKIN DOCTOR PROTOCOL — AM / PM
     --------------------------------------------------------- */
  const PROTO = {
    am: [{ v: 'Prep', id: 'nusonic', w: 'Sonic cleanse & exfoliate' }, { v: 'Treat', id: 'super-c', w: 'Every morning' }, { v: 'Hydrate', id: 'hyaluronic', w: 'Morning & night' }, { v: 'Moisturise', id: 'cream', w: 'Morning & night' }],
    pm: [{ v: 'Prep', id: 'nusonic', w: 'Sonic cleanse & exfoliate' }, { v: 'Renew', id: 'retinol', w: 'At night' }, { v: 'Hydrate', id: 'hyaluronic', w: 'Morning & night' }, { v: 'Moisturise', id: 'cream', w: 'Morning & night' }]
  };
  const proto = $('#protocol');
  let mode = 'am';
  const renderSteps = () => {
    $('#stepsList').innerHTML = PROTO[mode].map((s, i) => {
      const p = P[s.id];
      return `<li class="step" style="--tone:${p.tone}"><span class="step__no">Step 0${i + 1}</span>
        <div class="step__orb"><img class="${p.wide ? 'is-wide' : ''}" src="${p.img}" alt="${p.name}" loading="lazy"></div>
        <p class="step__verb">${s.v}</p><p class="step__name">${p.name}</p><p class="step__when">${s.w} · ${money(p.price)}</p>
        <button class="step__add" data-add="${s.id}">Add to bag</button></li>`;
    }).join('');
    const ids = PROTO[mode].map(s => s.id), sum = ids.reduce((a, id) => a + P[id].price, 0);
    $('#bundleImgs').innerHTML = ids.map(id => `<span><img src="${P[id].img}" alt=""></span>`).join('');
    $('#bundleKick').textContent = mode === 'am' ? 'The morning protocol' : 'The night protocol';
    $('#bundleTitle').textContent = `${ids.length} products · ${money(sum)}`;
  };
  renderSteps();
  $$('.ampm button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.mode === mode) return;
    mode = b.dataset.mode;
    $$('.ampm button').forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    proto.dataset.mode = mode;
    proto.dataset.header = mode === 'pm' ? 'dark' : 'light';
    const r = proto.getBoundingClientRect();
    if (r.top < 46 && r.bottom > 46) hdr.dataset.theme = proto.dataset.header;
    if (G && !reduce) {
      G.to('.step', { y: -20, opacity: 0, duration: .3, stagger: .04, ease: 'power2.in', onComplete: () => { renderSteps(); G.from('.step', { y: 30, opacity: 0, duration: .7, stagger: .07, ease: 'expo.out' }); } });
    } else renderSteps();
  }));
  $('#bundleAdd').addEventListener('click', e => {
    PROTO[mode].forEach((s, i) => addToBag(s.id, 1, { silent: i < PROTO[mode].length - 1, src: e.currentTarget }));
  });
  if (hasMotion) {
    const path = $('#stepsPath');
    const len = path.getTotalLength();
    G.set(path, { strokeDasharray: len, strokeDashoffset: len });
    G.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 80%', end: 'bottom 60%', scrub: 1 } });
    G.from('.step', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.steps', start: 'top 80%', once: true } });
    G.from('.bundle', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.bundle', start: 'top 92%', once: true } });
  }

  /* ---------------------------------------------------------
     PROOF + DOCTOR + GLOW + JOURNAL + FOOTER
     --------------------------------------------------------- */
  const quoteWords = splitWords($('#proofQuote'));
  const maniWords = splitWords($('#manifesto'));
  if (hasMotion) {
    G.to('#proofClip', { clipPath: 'inset(0% 0% 0% 0% round 30px)', ease: 'none', scrollTrigger: { trigger: '.proof__media', start: 'top 90%', end: 'top 30%', scrub: 1 } });
    G.to('#proofClip img', { scale: 1, ease: 'none', scrollTrigger: { trigger: '.proof__media', start: 'top 90%', end: 'bottom 20%', scrub: 1 } });
    G.to(quoteWords, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '#proofQuote', start: 'top 80%', end: 'bottom 45%', scrub: 1 } });
    G.from('.stars i', { scale: 0, rotate: -90, duration: .8, stagger: .07, ease: 'back.out(3)', scrollTrigger: { trigger: '.stars', start: 'top 85%', once: true } });

    G.to('#docClip', { clipPath: 'inset(0% 0% 0% 0% round 30px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.doctor__media', start: 'top 80%', once: true } });
    G.fromTo('#docClip img', { yPercent: -8 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.doctor', start: 'top bottom', end: 'bottom top', scrub: true } });
    G.from('.doctor__seal', { scale: 0, rotate: -120, duration: 1.4, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.doctor__media', start: 'top 60%', once: true } });
    G.to(maniWords, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '#manifesto', start: 'top 82%', end: 'bottom 50%', scrub: 1 } });
    const sign = $('#signPath'), sl = sign.getTotalLength();
    G.set(sign, { strokeDasharray: sl, strokeDashoffset: sl });
    G.to(sign, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.doctor__sign', start: 'top 85%', end: 'top 55%', scrub: 1 } });

    const gl = $$('#glowWord span');
    G.from(gl, { yPercent: 120, rotate: () => G.utils.random(-25, 25), duration: 1.2, ease: 'back.out(1.7)', stagger: .08, scrollTrigger: { trigger: '.glow', start: 'top 70%', once: true } });
    ST.create({
      trigger: '.glow', start: 'top bottom', end: 'bottom top',
      onUpdate: self => gl.forEach((s, i) => { s.style.translate = `0 ${(Math.sin(self.progress * Math.PI * 3 + i * .9) * 14).toFixed(1)}px`; })
    });
    $$('.glow__card').forEach(c => G.fromTo(c, { y: () => 70 * parseFloat(c.dataset.depth) }, { y: () => -70 * parseFloat(c.dataset.depth), ease: 'none', scrollTrigger: { trigger: '.glow', start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true } }));
    $$('.stk').forEach((s, i) => G.to(s, { rotation: i % 2 ? -200 : 200, y: (i % 2 ? -1 : 1) * 80, ease: 'none', scrollTrigger: { trigger: '.glow', start: 'top bottom', end: 'bottom top', scrub: 1.2 } }));

    G.from('.jcard', { y: 70, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.jgrid', start: 'top 85%', once: true } });
    G.from('#footMark span', { yPercent: 100, ease: 'none', stagger: .05, scrollTrigger: { trigger: '#footMark', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });
    G.from('.pillar__ico img', { scale: .4, rotate: -40, opacity: 0, duration: 1.2, ease: 'back.out(1.8)', stagger: .1, scrollTrigger: { trigger: '.pillars__list', start: 'top 85%', once: true } });

    // scroll progress
    ST.create({ start: 0, end: 'max', onUpdate: self => { $('#progressBar').style.transform = `scaleX(${self.progress})`; } });
  } else {
    ['#proofClip', '#docClip'].forEach(s => { $(s).style.clipPath = 'inset(0% 0% 0% 0% round 30px)'; });
    $('#proofClip img').style.transform = 'none';
    quoteWords.concat(maniWords).forEach(w => { w.style.opacity = 1; });
  }

  /* ---------------------------------------------------------
     360° STUDIO — Three.js, lazy-loaded
     --------------------------------------------------------- */
  const studio = $('#studio');
  let studioApi = null, pendingModel = 'super-c', studioStarted = false;
  const setInfo = id => {
    const p = P[id];
    const els = ['#siCat', '#siName', '#siDesc', '#siPrice'].map(s => $(s));
    const apply = () => {
      $('#siCat').textContent = p.tag; $('#siName').textContent = p.name; $('#siDesc').textContent = p.desc; $('#siPrice').textContent = money(p.price);
      $('#siAdd').dataset.add = id;
      $('#studioFallback img').src = p.img; $('#studioFallback img').alt = p.name;
    };
    if (G && !reduce) G.to(els, { y: -12, opacity: 0, duration: .25, stagger: .03, onComplete: () => { apply(); G.fromTo(els, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .05, ease: 'expo.out' }); } });
    else apply();
  };
  const selectModel = id => {
    if (!P[id] || !P[id].model) return;
    pendingModel = id;
    $$('#studioTabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.model === id)));
    setInfo(id);
    if (studioApi) studioApi.show(id);
  };
  $('#studioTabs').addEventListener('click', e => { const b = e.target.closest('button[data-model]'); if (b) selectModel(b.dataset.model); });
  document.addEventListener('click', e => {
    const v = e.target.closest('[data-view360]'); if (!v) return;
    e.preventDefault();
    selectModel(v.dataset.view360);
    scrollToEl($('#studio'));
  });
  $$('.studio__lights button').forEach(b => b.addEventListener('click', () => {
    $$('.studio__lights button').forEach(x => x.classList.toggle('is-on', x === b));
    studio.dataset.light = b.dataset.light;
    if (studioApi) studioApi.light(b.dataset.light);
  }));
  $$('.studio__views button').forEach(b => b.addEventListener('click', () => {
    $$('.studio__views button').forEach(x => x.classList.toggle('is-on', x === b));
    if (studioApi) studioApi.snap(+b.dataset.angle);
  }));
  new IntersectionObserver((ents, obs) => {
    if (ents.some(en => en.isIntersecting) && !studioStarted) { studioStarted = true; obs.disconnect(); initStudio(); }
  }, { rootMargin: '120% 0px' }).observe(studio);

  async function initStudio() {
    const canvas = $('#studioCanvas'), stage = $('#studioStage');
    const fail = () => { studio.classList.add('no-gl', 'is-ready'); };
    let THREE, RoomEnvironment;
    try {
      THREE = await import('three');
      ({ RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js'));
    } catch (err) { fail(); return; }
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (err) { fail(); return; }
    try {
      await Promise.all(['500 60px "Cormorant Garamond"', '500 60px "Quicksand"', '600 60px "Quicksand"', '700 60px "Quicksand"'].map(f => document.fonts.load(f)));
    } catch (err) { /* draw with fallbacks */ }

    const DPR = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(DPR);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const TEX_W = (innerWidth > 1000 && DPR >= 1.5) ? 3072 : 2048;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), .04).texture;
    const camera = new THREE.PerspectiveCamera(26, 1, .1, 100);
    const target = new THREE.Vector3(0, 1.7, 0);
    let dist = 11, distT = 11, baseDist = 11;

    const key = new THREE.DirectionalLight(0xfff1e0, 1.6); key.position.set(4, 7, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fd6cf, 2.4); rim.position.set(-6, 4, -5); scene.add(rim);
    const hemi = new THREE.HemisphereLight(0xffffff, 0x18403d, .35); scene.add(hemi);
    const sweep = new THREE.PointLight(0xfff4e6, 8, 14, 2); scene.add(sweep);

    // turntable
    const plateMat = new THREE.MeshPhysicalMaterial({ color: 0x0f2d2b, roughness: .32, metalness: .15, clearcoat: .7, clearcoatRoughness: .2 });
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 2.02, .14, 128), plateMat); plate.position.y = -.07; scene.add(plate);
    const goldMat = new THREE.MeshPhysicalMaterial({ color: 0xd8b672, metalness: 1, roughness: .24, clearcoat: .4 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.97, .014, 10, 160), goldMat); ring.rotation.x = Math.PI / 2; ring.position.y = .002; scene.add(ring);
    const shc = document.createElement('canvas'); shc.width = shc.height = 256;
    const sx = shc.getContext('2d'), sg = sx.createRadialGradient(128, 128, 0, 128, 128, 128);
    sg.addColorStop(0, 'rgba(0,0,0,.75)'); sg.addColorStop(.45, 'rgba(0,0,0,.35)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
    sx.fillStyle = sg; sx.fillRect(0, 0, 256, 256);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shc), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = .004; scene.add(shadow);

    /* ---- label drawing ---- */
    const K = W => W / (2 * Math.PI);
    const spaced = (x, txt, cx, cy, sp) => {
      const chars = [...txt]; const widths = chars.map(c => x.measureText(c).width);
      const total = widths.reduce((a, b) => a + b, 0) + sp * (chars.length - 1);
      let px = cx - total / 2; x.textAlign = 'left';
      chars.forEach((c, i) => { x.fillText(c, px, cy); px += widths[i] + sp; });
      x.textAlign = 'center';
    };
    const monogram = (x, cx, cy, s, col) => {
      x.save(); x.fillStyle = col; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = `500 ${s * 1.25}px "Cormorant Garamond", Georgia, serif`;
      x.fillText('D', cx + s * .1, cy + s * .04);
      x.fillRect(cx - s * .46, cy - s * .5, s * .66, Math.max(2, s * .07));
      x.restore();
    };
    const wrapText = (x, txt, cx, y, maxW, lh) => {
      const words = txt.split(' '); let line = '', yy = y;
      words.forEach(w => { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { x.fillText(line, cx, yy); line = w; yy += lh; } else line = t; });
      if (line) x.fillText(line, cx, yy);
      return yy;
    };
    const barcode = (x, cx, y, w, h, col) => {
      x.fillStyle = col; let px = cx - w / 2; let seed = 7;
      while (px < cx + w / 2) { seed = (seed * 9301 + 49297) % 233280; const bw = 1 + (seed % 4) * (w / 160); x.fillRect(px, y, bw, h); px += bw + (w / 120) * (1 + (seed % 3)); }
    };
    const mkTex = c => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso; t.needsUpdate = true; return t; };

    function whiteLabel(p) {
      const W = TEX_W, h = 2.6, top = 3.0, k = K(W), H = Math.round(h * k);
      const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
      const Y = yu => (top - yu) * k, fx = W * .25, bx = W * .75;
      x.fillStyle = '#f5f4f0'; x.fillRect(0, 0, W, H);
      x.fillStyle = 'rgba(0,0,0,.05)'; x.fillRect(0, Y(2.93), W, Math.max(2, k * .006)); x.fillRect(0, Y(.46), W, Math.max(2, k * .006));
      x.textAlign = 'center'; x.textBaseline = 'middle';
      monogram(x, fx, Y(2.52), .26 * k, '#ab8a45');
      x.fillStyle = '#8f7646'; x.font = `500 ${.19 * k}px "Cormorant Garamond", Georgia, serif`; x.fillText('Dr Tanya', fx, Y(2.24));
      x.font = `500 ${.05 * k}px "Quicksand", sans-serif`; x.fillText('TM', fx + .43 * k, Y(2.31));
      x.fillStyle = '#1e2725'; x.font = `500 ${.225 * k}px "Quicksand", sans-serif`;
      x.fillText(p.label[0], fx, Y(1.71)); x.fillText(p.label[1], fx, Y(1.45));
      x.font = `italic 500 ${.13 * k}px "Quicksand", sans-serif`; x.fillStyle = '#3d4745'; x.fillText(p.tagline, fx, Y(1.14));
      x.fillStyle = '#1f4f55'; x.fillRect(0, Y(1.035), W, .13 * k);
      x.fillStyle = '#ffffff'; x.font = `600 ${.075 * k}px "Quicksand", sans-serif`; spaced(x, 'PROFESSIONAL', fx, Y(.97), .03 * k);
      x.fillStyle = '#2c3634'; x.font = `500 ${.085 * k}px "Quicksand", sans-serif`; x.fillText('30 ml  |  1.01 fl.oz', fx, Y(.7));
      // back panel
      x.fillStyle = '#1f4f55'; x.font = `600 ${.07 * k}px "Quicksand", sans-serif`; spaced(x, 'DIRECTIONS', bx, Y(2.6), .02 * k);
      x.fillStyle = '#4a5553'; x.font = `500 ${.068 * k}px "Quicksand", sans-serif`;
      let yy = wrapText(x, p.back, bx, Y(2.42), 1.25 * k, .1 * k);
      x.fillStyle = '#1f4f55'; x.font = `600 ${.07 * k}px "Quicksand", sans-serif`; spaced(x, 'BY DR TANYA', bx, yy + .2 * k, .02 * k);
      x.fillStyle = '#4a5553'; x.font = `500 ${.062 * k}px "Quicksand", sans-serif`; x.fillText('Doctor-formulated skincare', bx, yy + .32 * k);
      barcode(x, bx, Y(.88) + .14 * k, .7 * k, .26 * k, '#2c3634');
      x.fillStyle = '#4a5553'; x.font = `500 ${.05 * k}px "IBM Plex Mono", monospace`; x.fillText('8 9 3 1 2 4 0 7 7 1 3 6', bx, Y(.52));
      return mkTex(c);
    }
    function greenLabel(p) {
      const W = TEX_W, h = 2.62, top = 2.82, k = K(W), H = Math.round(h * k);
      const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
      const Y = yu => (top - yu) * k, fx = W * .25, bx = W * .75;
      x.fillStyle = '#063a2f'; x.fillRect(0, 0, W, H);
      const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(255,255,255,.04)'); g.addColorStop(1, 'rgba(0,0,0,.08)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.textAlign = 'center'; x.textBaseline = 'middle';
      monogram(x, fx, Y(2.29), .3 * k, '#d9bd7a');
      x.fillStyle = '#d9bd7a'; x.font = `500 ${.31 * k}px "Cormorant Garamond", Georgia, serif`; x.fillText('Dr Tanya', fx, Y(1.8));
      x.fillStyle = '#e7efea'; x.font = `600 ${.15 * k}px "Quicksand", sans-serif`; x.fillText('Holy Basil', fx, Y(1.3)); x.fillText('Hair Serum', fx, Y(1.12));
      x.font = `700 ${.088 * k}px "Quicksand", sans-serif`; x.fillText('With Tulsi Complex', fx, Y(.89)); x.fillText('to Restore & Repair', fx, Y(.76));
      x.font = `500 ${.105 * k}px "Quicksand", sans-serif`; x.fillText('30ml  |  1.01 fl.oz', fx, Y(.46));
      x.fillStyle = '#d9bd7a'; x.font = `600 ${.07 * k}px "Quicksand", sans-serif`; spaced(x, 'DIRECTIONS', bx, Y(2.3), .02 * k);
      x.fillStyle = 'rgba(231,239,234,.85)'; x.font = `500 ${.066 * k}px "Quicksand", sans-serif`;
      const yy = wrapText(x, 'A unique scalp and hair serum containing sacred Indian Holy Basil. Apply to the scalp and massage in — or load into NuBrush.', bx, Y(2.12), 1.25 * k, .1 * k);
      barcode(x, bx, yy + .3 * k, .62 * k, .22 * k, 'rgba(231,239,234,.85)');
      return mkTex(c);
    }
    function jarLabel() {
      const W = TEX_W, h = 1.2, top = 1.4, k = K(W), H = Math.round(h * k);
      const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
      const Y = yu => (top - yu) * k, fx = W * .25, bx = W * .75;
      x.fillStyle = '#0b3c32'; x.fillRect(0, 0, W, H);
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillStyle = '#d4b46e'; x.font = `500 ${.175 * k}px "Cormorant Garamond", Georgia, serif`; x.fillText('Dr Tanya', fx, Y(1.045));
      x.fillStyle = '#dfe6e1'; x.font = `600 ${.1 * k}px "Quicksand", sans-serif`; x.fillText('Holy Basil', fx, Y(.8)); x.fillText('Day & Night Cream', fx, Y(.675));
      x.font = `600 ${.07 * k}px "Quicksand", sans-serif`; x.fillText('With Tulsi Complex', fx, Y(.535));
      x.font = `500 ${.085 * k}px "Quicksand", sans-serif`; x.fillText('70ml  |  2.36 fl.oz', fx, Y(.36));
      x.fillStyle = '#d4b46e'; x.font = `600 ${.06 * k}px "Quicksand", sans-serif`; spaced(x, 'DIRECTIONS', bx, Y(1.15), .02 * k);
      x.fillStyle = 'rgba(223,230,225,.85)'; x.font = `500 ${.056 * k}px "Quicksand", sans-serif`;
      wrapText(x, 'A gentle results-driven hydrating cream with ancient Holy Basil. Apply morning and night as the last step of your routine.', bx, Y(1.0), 1.5 * k, .085 * k);
      barcode(x, bx, Y(.48), .55 * k, .16 * k, 'rgba(223,230,225,.85)');
      return mkTex(c);
    }

    /* ---- geometry helpers ---- */
    const V2 = pts => pts.map(([a, b]) => new THREE.Vector2(a, b));
    const lathe = (pts, mat, seg = 128) => new THREE.Mesh(new THREE.LatheGeometry(V2(pts), seg), mat);
    const labelCyl = (r, y0, y1, mat) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, y1 - y0, 192, 1, true, -Math.PI / 2, Math.PI * 2), mat); m.position.y = (y0 + y1) / 2; return m; };
    const ribbed = (r, h, mat, ribs = 72, depth = .018) => {
      const geo = new THREE.CylinderGeometry(r, r, h, ribs * 4, 1, false);
      const pos = geo.attributes.position, v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const rad = Math.hypot(v.x, v.z); if (rad < r * .5) continue;
        const th = Math.atan2(v.x, v.z), f = 1 - depth * (Math.cos(th * ribs) > 0 ? 0 : 1);
        pos.setXYZ(i, v.x * f, v.y, v.z * f);
      }
      geo.computeVertexNormals();
      return new THREE.Mesh(geo, mat);
    };
    const side = { side: THREE.DoubleSide };
    const whitePlastic = () => new THREE.MeshPhysicalMaterial({ color: 0xf3f2ee, roughness: .36, clearcoat: .55, clearcoatRoughness: .28, ...side });
    const bulbMat = () => new THREE.MeshPhysicalMaterial({ color: 0xf6f5f1, roughness: .62, sheen: .4, sheenColor: 0xffffff, ...side });

    function buildPump(p) {
      const g = new THREE.Group(), w = whitePlastic();
      g.add(lathe([[0, 0], [.62, 0], [.8, .03], [.92, .1], [.98, .22], [1, .4]], w));
      g.add(labelCyl(1, .4, 3.0, new THREE.MeshPhysicalMaterial({ map: whiteLabel(p), roughness: .34, clearcoat: .55, clearcoatRoughness: .26 })));
      g.add(lathe([[1, 3.0], [.995, 3.12], [.975, 3.26], [.93, 3.4], [.85, 3.5], [.74, 3.58], [.66, 3.62], [0, 3.62]], w));
      const col = ribbed(.645, .55, w, 64, .02); col.position.y = 3.6 + .275; g.add(col);
      g.add(lathe([[0, 4.15], [.565, 4.15], [.572, 4.2], [.572, 4.84], [.55, 4.9], [0, 4.9]], w));
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .1, 48), w); stem.position.y = 4.94; g.add(stem);
      g.add(lathe([[0, 4.97], [.36, 4.97], [.39, 5.0], [.4, 5.08], [.4, 5.66], [.385, 5.77], [.33, 5.85], [.2, 5.885], [0, 5.89]], w));
      const noz = new THREE.Mesh(new THREE.CylinderGeometry(.08, .095, .62, 40), w); noz.rotation.z = Math.PI / 2 - .12; noz.position.set(-.64, 5.66, 0); g.add(noz);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(.08, 24, 16), w); tip.position.set(-.94, 5.62, 0); g.add(tip);
      g.scale.setScalar(.6);
      return { g, h: 5.9 * .6 };
    }
    function buildDropper(p) {
      const g = new THREE.Group(), w = whitePlastic();
      g.add(lathe([[0, 0], [.62, 0], [.8, .03], [.92, .1], [.98, .2], [1, .35]], w));
      g.add(labelCyl(1, .35, 2.95, new THREE.MeshPhysicalMaterial({ map: whiteLabel(p), roughness: .34, clearcoat: .55, clearcoatRoughness: .26 })));
      g.add(lathe([[1, 2.95], [.995, 3.08], [.97, 3.22], [.92, 3.34], [.83, 3.44], [.74, 3.5], [0, 3.5]], w));
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(.72, .72, .15, 96), w); neck.position.y = 3.555; g.add(neck);
      const col = ribbed(.69, .47, w, 60, .022); col.position.y = 3.865; g.add(col);
      g.add(lathe([[0, 4.1], [.6, 4.1], [.6, 4.9], [.57, 4.97], [0, 4.97]], w));
      g.add(lathe([[0, 4.95], [.34, 4.95], [.335, 5.1], [.32, 5.3], [.3, 5.5], [.285, 5.7], [.27, 5.82], [.23, 5.93], [.14, 5.99], [0, 6.01]], bulbMat()));
      g.scale.setScalar(.6);
      return { g, h: 6.0 * .6 };
    }
    function buildGreenDropper() {
      const g = new THREE.Group();
      const glass = new THREE.MeshPhysicalMaterial({ color: 0x053a2e, roughness: .16, clearcoat: 1, clearcoatRoughness: .06, envMapIntensity: .8, ...side });
      g.add(lathe([[0, 0], [.75, 0], [.92, .04], [.985, .1], [1, .2]], glass));
      g.add(labelCyl(1, .2, 2.82, new THREE.MeshPhysicalMaterial({ map: greenLabel(), roughness: .16, clearcoat: 1, clearcoatRoughness: .06, envMapIntensity: .8 })));
      g.add(lathe([[1, 2.82], [.985, 2.88], [.94, 2.93], [.86, 2.97], [.7, 2.995], [0, 3.0]], glass));
      g.add(lathe([[0, 2.98], [.62, 2.98], [.635, 3.0], [.64, 3.05], [.64, 3.88], [.625, 3.93], [.58, 3.955], [0, 3.96]], goldMat));
      g.add(lathe([[0, 3.95], [.31, 3.95], [.305, 4.1], [.3, 4.35], [.29, 4.55], [.275, 4.7], [.24, 4.8], [.16, 4.87], [0, 4.9]], bulbMat()));
      g.scale.setScalar(.66);
      return { g, h: 4.9 * .66 };
    }
    function buildJar() {
      const g = new THREE.Group();
      const jar = new THREE.MeshPhysicalMaterial({ color: 0x0b3c32, roughness: .5, clearcoat: .3, clearcoatRoughness: .4, ...side });
      g.add(lathe([[0, 0], [.6, 0], [.82, .03], [.93, .08], [.98, .14], [1, .2]], jar));
      g.add(labelCyl(1, .2, 1.4, new THREE.MeshPhysicalMaterial({ map: jarLabel(), roughness: .48, clearcoat: .3, clearcoatRoughness: .4 })));
      g.add(lathe([[1, 1.4], [1, 1.43], [.97, 1.45], [0, 1.45]], jar));
      const lidMat = new THREE.MeshPhysicalMaterial({ color: 0xd9b874, metalness: 1, roughness: .3, clearcoat: .5, clearcoatRoughness: .2, ...side });
      g.add(lathe([[0, 1.43], [1.015, 1.43], [1.025, 1.45], [1.025, 1.93], [1.015, 1.97], [.99, 1.99], [.95, 2.0], [0, 2.0]], lidMat));
      g.scale.setScalar(1.12);
      return { g, h: 2.0 * 1.12, w: 2.3 * 1.12 };
    }
    const builders = { pump: buildPump, dropper: buildDropper, 'dropper-green': buildGreenDropper, jar: buildJar };
    const cache = {};
    const getModel = id => {
      if (cache[id]) return cache[id];
      const p = P[id], built = builders[p.model](p);
      const holder = new THREE.Group(); holder.add(built.g);
      const sc = built.g.scale.x;
      const spots = (p.hs || []).map(hs => {
        const a = THREE.MathUtils.degToRad(hs.a || 0), r = hs.r != null ? hs.r : 1.02;
        return { pos: new THREE.Vector3(Math.sin(a) * r * sc, hs.y * sc, Math.cos(a) * r * sc), n: hs.up ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(Math.sin(a), 0, Math.cos(a)), t: hs.t, d: hs.d };
      });
      const shadowW = p.model === 'jar' ? 3.3 : 2.1;
      const plateS = p.model === 'jar' ? .84 : .72;
      cache[id] = { holder, h: built.h, w: Math.max((built.w || 1.25) * 1.25, 1.95 * plateS * 2 * .9), spots, shadowW, plate: plateS };
      return cache[id];
    };

    /* ---- state ---- */
    let current = null, rotY = -.35, vel = 0, auto = !reduce, lastInteract = 0, snapping = null;
    let tiltX = 0, tiltY = 0, ptx = 0, pty = 0;
    const hsWrap = $('#hotspots');
    let hsEls = [];
    const buildHotspots = m => {
      hsWrap.innerHTML = m.spots.map((s, i) => `<div class="hs" data-i="${i}"><button class="hs__btn" aria-label="${s.t}">${ICON_PLUS}</button><div class="hs__card"><strong>${s.t}</strong><span>${s.d}</span></div></div>`).join('');
      hsEls = $$('.hs', hsWrap);
    };
    hsWrap.addEventListener('click', e => {
      const h = e.target.closest('.hs'); if (!h) return;
      const was = h.classList.contains('is-open');
      hsEls.forEach(x => x.classList.remove('is-open'));
      if (!was) h.classList.add('is-open');
      auto = false; $('#autoSpin').classList.remove('is-on'); lastInteract = performance.now();
    });

    function fitDist(m) {
      const vf = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const dH = m.h / (.7 * vf);
      const dW = m.w / (.82 * vf * camera.aspect);
      return clamp(Math.max(dH, dW), 5.5, 16);
    }
    function show(id) {
      const next = getModel(id);
      if (current === next) return;
      const prev = current; current = next;
      scene.add(next.holder);
      buildHotspots(next);
      baseDist = fitDist(next); distT = baseDist;
      G.to(plate.scale, { x: next.plate, z: next.plate, duration: 1.1, ease: 'expo.inOut' });
      G.to(ring.scale, { x: next.plate, y: next.plate, z: next.plate, duration: 1.1, ease: 'expo.inOut' });
      G.to(target, { y: next.h * .5, duration: 1.2, ease: 'expo.inOut' });
      G.to(shadow.scale, { x: next.shadowW, y: next.shadowW, duration: 1, ease: 'expo.out' });
      if (prev) {
        G.to(prev.holder.scale, { x: .001, y: .001, z: .001, duration: .55, ease: 'power3.in', onComplete: () => scene.remove(prev.holder) });
        G.to(prev.holder.rotation, { y: '+=' + Math.PI, duration: .55, ease: 'power3.in' });
      }
      next.holder.scale.setScalar(.001); next.holder.rotation.y = -Math.PI;
      G.to(next.holder.scale, { x: 1, y: 1, z: 1, duration: 1.2, delay: prev ? .35 : 0, ease: 'elastic.out(1, .75)' });
      G.to(next.holder.rotation, { y: 0, duration: 1.4, delay: prev ? .35 : 0, ease: 'expo.out' });
    }

    const LIGHTS = {
      studio: { key: 0xfff1e0, ki: 1.6, rim: 0x9fd6cf, ri: 2.4, sweep: 0xfff4e6, exp: 1.05, plate: 0x0f2d2b },
      sunrise: { key: 0xffc690, ki: 2.4, rim: 0xff9c78, ri: 2.0, sweep: 0xffd2a0, exp: 1.12, plate: 0x3a2618 },
      midnight: { key: 0x9ab8ff, ki: .9, rim: 0x6ee0c8, ri: 3.4, sweep: 0x9fe8ff, exp: .95, plate: 0x0b1c24 }
    };
    const tweenColor = (col, hex) => { const c = new THREE.Color(hex); G.to(col, { r: c.r, g: c.g, b: c.b, duration: 1.1, ease: 'power2.inOut' }); };
    function light(name) {
      const L = LIGHTS[name] || LIGHTS.studio;
      tweenColor(key.color, L.key); tweenColor(rim.color, L.rim); tweenColor(sweep.color, L.sweep); tweenColor(plateMat.color, L.plate);
      G.to(key, { intensity: L.ki, duration: 1.1 }); G.to(rim, { intensity: L.ri, duration: 1.1 });
      G.to(renderer, { toneMappingExposure: L.exp, duration: 1.1 });
    }
    function snap(deg) {
      auto = false; $('#autoSpin').classList.remove('is-on'); vel = 0;
      const tgt = THREE.MathUtils.degToRad(-deg);
      const twoPi = Math.PI * 2;
      let d = ((tgt - rotY) % twoPi + twoPi * 1.5) % twoPi - Math.PI;
      if (snapping) snapping.kill();
      const o = { v: rotY };
      snapping = G.to(o, { v: rotY + d, duration: 1.2, ease: 'expo.inOut', onUpdate: () => { rotY = o.v; }, onComplete: () => { snapping = null; } });
      lastInteract = performance.now();
    }

    /* ---- interaction ---- */
    const pointers = new Map(); let pinch0 = 0, dist0 = 0, lastX = 0, dragging = false;
    canvas.addEventListener('pointerdown', e => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) { dragging = true; lastX = e.clientX; vel = 0; if (snapping) { snapping.kill(); snapping = null; } }
      if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); dist0 = distT; }
      studio.classList.add('is-touched'); lastInteract = performance.now();
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      ptx = ((e.clientX - r.left) / r.width) * 2 - 1; pty = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch0) distT = clamp(dist0 * (pinch0 / d), baseDist * .55, baseDist * 1.25);
        return;
      }
      if (dragging) { const dx = e.clientX - lastX; lastX = e.clientX; rotY += dx * .0105; vel = dx * .0105; lastInteract = performance.now(); }
    });
    const end = e => { pointers.delete(e.pointerId); if (pointers.size < 2) pinch0 = 0; if (!pointers.size) dragging = false; };
    canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('pointerleave', () => { ptx = pty = 0; });
    $('#zoomIn').addEventListener('click', () => { distT = clamp(distT * .82, baseDist * .55, baseDist * 1.25); });
    $('#zoomOut').addEventListener('click', () => { distT = clamp(distT * 1.18, baseDist * .55, baseDist * 1.25); });
    $('#autoSpin').addEventListener('click', e => { auto = !auto; e.currentTarget.classList.toggle('is-on', auto); lastInteract = 0; });
    if (reduce) $('#autoSpin').classList.remove('is-on');

    /* ---- render loop ---- */
    let w = 0, h = 0, visible = true;
    const resize = () => {
      const r = stage.getBoundingClientRect(); w = Math.max(1, r.width); h = Math.max(1, r.height);
      renderer.setSize(w, h, false); camera.aspect = w / h;
      camera.fov = w / h < .8 ? 30 : 26; camera.updateProjectionMatrix();
      if (current) { const nd = fitDist(current); distT = distT * (nd / baseDist); baseDist = nd; }
    };
    resize(); new ResizeObserver(resize).observe(stage);
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(stage);
    const dial = $('#dialArc'), degEl = $('#dialDeg');
    const v3 = new THREE.Vector3(), n3 = new THREE.Vector3(), cam3 = new THREE.Vector3(), tmp = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0);
    let lastDeg = -1;
    const clock = new THREE.Clock();
    const frame = () => {
      requestAnimationFrame(frame);
      if (!visible || document.hidden || !current) return;
      const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
      if (!dragging && !snapping) {
        rotY += vel; vel *= .94;
        if (auto && performance.now() - lastInteract > 2200) rotY += dt * .42;
      }
      current.holder.rotation.y = rotY;
      current.holder.position.y = Math.sin(t * 1.2) * .03 + .02;
      dist += (distT - dist) * .08;
      tiltX += (ptx - tiltX) * .05; tiltY += (pty - tiltY) * .05;
      const az = tiltX * .18, el = .14 + tiltY * .06;
      camera.position.set(Math.sin(az) * dist, target.y + Math.sin(el) * dist, Math.cos(az) * dist);
      camera.lookAt(target);
      sweep.position.set(Math.sin(t * .6) * 4, 3.2 + Math.sin(t * .4), Math.cos(t * .6) * 4);
      renderer.render(scene, camera);
      // hotspots
      camera.getWorldPosition(cam3);
      current.spots.forEach((s, i) => {
        const el = hsEls[i]; if (!el) return;
        v3.copy(s.pos); current.holder.localToWorld(v3);
        n3.copy(s.n).applyAxisAngle(UP, rotY);
        const facing = n3.dot(tmp.copy(cam3).sub(v3).normalize());
        const sp = tmp.copy(v3).project(camera);
        const x = (sp.x * .5 + .5) * w, y = (-sp.y * .5 + .5) * h;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        el.classList.toggle('is-back', facing < .12 || current.holder.scale.x < .9);
        el.classList.toggle('is-left', x > w * .58);
        if (facing < .12) el.classList.remove('is-open');
      });
      // dial
      const deg = Math.floor(((-rotY * 180 / Math.PI) % 360 + 360) % 360) % 360;
      if (deg !== lastDeg) { lastDeg = deg; degEl.textContent = String(deg).padStart(3, '0') + '°'; dial.style.strokeDashoffset = (276.5 * (1 - deg / 360)).toFixed(1); }
    };
    studioApi = { show, light, snap };
    show(pendingModel);
    light(studio.dataset.light || 'studio');
    frame();
    studio.classList.add('is-ready');
  }

  /* ---------------------------------------------------------
     SIDE CART — free-shipping progress, smart upsells, fly-to-bag
     --------------------------------------------------------- */
  const cartEl = $('#cart');
  let cart = store.get('drt-v3-cart', []).filter(l => P[l.id] && !P[l.id].soldOut);
  let cartOpen = false, lastFocus = null;
  const subtotal = () => cart.reduce((a, l) => a + P[l.id].price * l.qty, 0);
  const count = () => cart.reduce((a, l) => a + l.qty, 0);
  const save = () => store.set('drt-v3-cart', cart);

  function setCount(n, animate) {
    const el = $('#bagN');
    $('#bagBtn').setAttribute('aria-label', `Open bag, ${n} item${n === 1 ? '' : 's'}`);
    if (animate && G && !reduce) {
      const old = $('span', el);
      const nw = document.createElement('span'); nw.textContent = n; el.appendChild(nw);
      G.set(el, { display: 'grid' });
      G.fromTo(nw, { yPercent: 100 }, { yPercent: 0, duration: .5, ease: 'expo.out' });
      G.to(old, { yPercent: -100, duration: .5, ease: 'expo.out', onComplete: () => old.remove() });
      el.style.gridTemplateAreas = '"a"';
      [old, nw].forEach(s => { s.style.gridArea = 'a'; });
    } else el.innerHTML = `<span>${n}</span>`;
    $('#cartCount').textContent = n;
  }

  function upsellIds() {
    const inCart = new Set(cart.map(l => l.id));
    const out = [];
    cart.forEach(l => (PAIRS[l.id] || []).forEach(id => { if (!inCart.has(id) && !P[id].soldOut && !out.includes(id)) out.push(id); }));
    ['super-c', 'cream', 'hyaluronic', 'nusonic', 'retinol'].forEach(id => { if (out.length < 4 && !inCart.has(id) && !out.includes(id)) out.push(id); });
    const left = FREE_SHIP - subtotal();
    if (left > 0) out.sort((a, b) => (P[a].price >= left ? 0 : 1) - (P[b].price >= left ? 0 : 1));
    return out.slice(0, 4);
  }

  function renderCart(newId) {
    const n = count(), sub = subtotal();
    cartEl.classList.toggle('is-empty', n === 0);
    $('#cartItems').innerHTML = cart.map((l, i) => {
      const p = P[l.id];
      return `<li class="ci ${l.id === newId ? 'is-new' : ''}" style="--tone:${p.tone}">
        <span class="ci__img"><img src="${p.img}" alt=""></span>
        <div><p class="ci__name">${p.name}</p><p class="ci__meta">${p.size} · ${p.tag.split(' · ')[0]}</p>
          <div class="qty" role="group" aria-label="Quantity"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="${i}" data-d="1" aria-label="Increase">+</button></div></div>
        <div class="ci__side"><span class="ci__price">${money(p.price * l.qty)}</span><button class="ci__rm" data-rm="${i}">Remove</button></div>
      </li>`;
    }).join('');
    $('#cartSub').textContent = money(sub);
    const left = FREE_SHIP - sub, pct = clamp(sub / FREE_SHIP, 0, 1) * 100;
    $('#shipMsg').innerHTML = n === 0 ? `Free shipping on orders over <b>${money(FREE_SHIP)}</b>` : left > 0 ? `You're <b>${money(left)}</b> away from free shipping` : `<b>You've unlocked free shipping</b> ✦ nice prescription.`;
    $('#shipFill').style.width = pct + '%';
    $('#shipVan').style.left = `calc(${pct}% ${pct > 4 ? '' : '+ 15px'})`;
    $('#ship').classList.toggle('is-free', left <= 0 && n > 0);
    const ups = upsellIds();
    $('#upsTitle').textContent = n === 0 ? 'Dr Tanya’s bestsellers' : left > 0 ? 'Complete your protocol' : 'Pairs perfectly with your routine';
    $('#upsSub').textContent = n === 0 ? 'Most prescribed' : left > 0 ? 'Unlock free shipping' : 'Picked for you';
    $('#upsRail').innerHTML = ups.map(id => {
      const p = P[id];
      return `<article class="up" style="--tone:${p.tone}"><span class="up__img"><img src="${p.img}" alt="" loading="lazy"></span>
        <span class="up__why">${n === 0 ? (p.badge || 'Doctor’s pick') : WHY[id]}</span><strong>${p.name}</strong>
        <div class="up__row"><span>${money(p.price)}</span><button data-add="${id}" data-upsell aria-label="Add ${p.name}">${ICON_PLUS}</button></div></article>`;
    }).join('');
    setCount(n, false);
  }

  function openCart() {
    if (cartOpen) return;
    cartOpen = true; lastFocus = document.activeElement;
    cartEl.classList.add('is-open'); cartEl.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
    setTimeout(() => $('.cart__close').focus({ preventScroll: true }), 300);
    if (G && !reduce) {
      G.fromTo('#cartItems .ci:not(.is-new), .ups .up', { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: .8, stagger: .06, delay: .25, ease: 'expo.out', clearProps: 'transform,opacity' });
    }
  }
  function closeCart() {
    if (!cartOpen) return;
    cartOpen = false;
    cartEl.classList.remove('is-open'); cartEl.setAttribute('aria-hidden', 'true');
    if (lenis && !document.body.classList.contains('menu-open')) lenis.start();
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  $('#bagBtn').addEventListener('click', () => { renderCart(); openCart(); });
  $$('[data-close-cart]').forEach(b => b.addEventListener('click', closeCart));
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeMenu(); } });
  cartEl.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || !cartOpen) return;
    const f = $$('button, a, input', $('.cart__panel')).filter(x => x.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });
  $('#cartItems').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    if (q) { const l = cart[+q.dataset.q]; l.qty += +q.dataset.d; if (l.qty <= 0) cart.splice(+q.dataset.q, 1); }
    else if (rm) {
      const li = rm.closest('.ci');
      if (G && !reduce) { G.to(li, { x: 60, opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, duration: .45, ease: 'power3.in', onComplete: () => { cart.splice(+rm.dataset.rm, 1); save(); renderCart(); } }); return; }
      cart.splice(+rm.dataset.rm, 1);
    } else return;
    save(); renderCart();
  });

  function flySrc(btn, id) {
    const box = btn && btn.closest('.pcard, .mini, .hero__feature, .step, .proof__prod, .up, .mnav__foot');
    let img = box && $('img', box);
    if (!img && btn && btn.closest('.ch')) img = $(`.sv[data-i="${btn.closest('.ch').dataset.i}"] img`) || $('img', btn.closest('.ch'));
    if (!img && btn && btn.closest('.studio')) img = $(`#studioTabs button[data-model="${id}"] img`);
    if (img) { const r = img.getBoundingClientRect(); if (r.width > 4 && r.bottom > 0 && r.top < innerHeight) return r; }
    if (btn) { const r = btn.getBoundingClientRect(); return { left: r.left + r.width / 2 - 30, top: r.top - 50, width: 60, height: 90 }; }
    return { left: innerWidth / 2 - 30, top: innerHeight / 2 - 45, width: 60, height: 90 };
  }
  function fly(id, btn, cb) {
    if (!G || reduce) { cb(); return; }
    const from = flySrc(btn, id), to = $('#bagBtn').getBoundingClientRect();
    const el = document.createElement('div'); el.className = 'fly';
    const fw = Math.min(from.width, 140), fh = Math.min(from.height, 200);
    Object.assign(el.style, { left: from.left + (from.width - fw) / 2 + 'px', top: from.top + (from.height - fh) / 2 + 'px', width: fw + 'px', height: fh + 'px' });
    el.innerHTML = `<img src="${P[id].img}" alt="">`;
    document.body.appendChild(el);
    const dx = to.left + to.width / 2 - (from.left + from.width / 2), dy = to.top + to.height / 2 - (from.top + from.height / 2);
    G.timeline({ onComplete: () => { el.remove(); cb(); } })
      .to(el, { x: dx, duration: .9, ease: 'power2.inOut' }, 0)
      .to(el, { y: dy, duration: .9, ease: 'back.in(1.4)' }, 0)
      .to(el, { scale: .18, rotation: 24, duration: .9, ease: 'power2.in' }, 0)
      .to(el, { opacity: 0, duration: .15 }, .78);
  }
  function addToBag(id, qty = 1, opts = {}) {
    const p = P[id]; if (!p || p.soldOut) return;
    const l = cart.find(x => x.id === id);
    l ? (l.qty += qty) : cart.push({ id, qty });
    save();
    const btn = opts.src;
    if (btn && btn.classList.contains('addbtn')) {
      btn.classList.add('is-added'); $('span', btn).textContent = 'Added'; $('i', btn).innerHTML = ICON_CHECK;
      setTimeout(() => { btn.classList.remove('is-added'); $('span', btn).textContent = 'Add'; $('i', btn).innerHTML = ICON_PLUS; }, 1800);
    }
    if (opts.silent) return;
    if (opts.inCart) { renderCart(id); return; }
    hdr.classList.remove('is-hidden');
    fly(id, btn, () => {
      const b = $('#bagBtn'); b.classList.remove('is-bump'); void b.offsetWidth; b.classList.add('is-bump');
      setCount(count(), true);
      renderCart(id);
      setTimeout(openCart, 220);
    });
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]');
    if (a) { e.preventDefault(); addToBag(a.dataset.add, 1, { src: a, inCart: a.hasAttribute('data-upsell') && cartOpen }); return; }
    const n = e.target.closest('[data-notify]');
    if (n) { toast('We’ll let you know the moment Holy Basil Shampoo is back.'); n.textContent = 'You’re on the list'; }
  });
  $('#checkout').addEventListener('click', () => toast('Design prototype — checkout connects to Shopify on the live store.'));
  renderCart();

  /* ---------------------------------------------------------
     NEWSLETTER + TOAST
     --------------------------------------------------------- */
  let toastT;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 3200);
  }
  $('#news').addEventListener('submit', e => {
    e.preventDefault();
    const v = $('#newsEmail').value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    $('#newsMsg').textContent = ok ? 'Thank you — your first Daily Dose is on its way.' : 'Please enter a valid email address.';
    if (ok) $('#newsEmail').value = '';
  });

  /* ---------------------------------------------------------
     HEADER THEME per section (created last so pins are measured first)
     --------------------------------------------------------- */
  if (ST) {
    $$('[data-header]').forEach(sec => ST.create({
      trigger: sec, start: 'top 46px', end: 'bottom 46px',
      onToggle: self => { if (self.isActive) hdr.dataset.theme = sec.dataset.header; }
    }));
  }

  /* ---------------------------------------------------------
     BOOT
     --------------------------------------------------------- */
  runLoader(() => { heroIntro(); if (ST) ST.refresh(); });
  addEventListener('load', () => ST && ST.refresh());
  if (document.fonts) document.fonts.ready.then(() => ST && ST.refresh());
})();
