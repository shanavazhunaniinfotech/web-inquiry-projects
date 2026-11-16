/* =========================================================
   Beachstone Media — interactions & motion (GSAP + Lenis)
   ========================================================= */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const yr = $('.yr'); if (yr) yr.textContent = new Date().getFullYear();

  if (!hasGSAP) { document.body.classList.remove('is-loading'); const l = $('.loader'); if (l) l.remove(); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const scrollToEl = (target) => {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else (typeof target === 'number' ? window.scrollTo({ top: target, behavior: 'smooth' }) : target.scrollIntoView({ behavior: 'smooth' }));
  };

  /* ---------- anchors + menu ---------- */
  const body = document.body;
  const burger = $('.burger');
  const closeMenu = () => { body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); $('.menu').setAttribute('aria-hidden', 'true'); if (lenis) lenis.start(); };
  burger.addEventListener('click', () => {
    const open = !body.classList.contains('menu-open');
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    $('.menu').setAttribute('aria-hidden', String(!open));
    if (lenis) open ? lenis.stop() : lenis.start();
  });
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = $(id);
    if (!el) return;
    e.preventDefault();
    if (body.classList.contains('menu-open')) closeMenu();
    scrollToEl(id === '#top' ? 0 : el);
  }));

  /* ---------- header ---------- */
  const hdr = $('.hdr');
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      hdr.classList.toggle('is-solid', y > 40);
      hdr.classList.toggle('is-hidden', y > 300 && y > lastY && !body.classList.contains('menu-open'));
      lastY = y;
    }
  });

  /* ---------- cursor ---------- */
  const cursor = $('.cursor');
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  if (finePointer && !reduce) {
    const dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
    const dx = gsap.quickTo(dot, 'x', { duration: .1 }), dy = gsap.quickTo(dot, 'y', { duration: .1 });
    const rx = gsap.quickTo(ring, 'x', { duration: .45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: .45, ease: 'power3' });
    window.addEventListener('mousemove', (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
    $$('a, button, .region, .pin, .svc__item, .wtag').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
    const labelled = [['.svc__item', 'Open'], ['.book', 'Guide'], ['.map', 'Explore'], ['.orb', "Let's go"]];
    labelled.forEach(([sel, txt]) => $$(sel).forEach((el) => {
      el.addEventListener('mouseenter', () => { label.textContent = txt; cursor.classList.add('is-label'); });
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-label'));
    }));

    /* magnetic */
    $$('.magnetic').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: .6, ease: 'elastic.out(1,.4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: .6, ease: 'elastic.out(1,.4)' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .3); yTo((e.clientY - r.top - r.height / 2) * .35);
      });
      el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- tide canvas (hero + CTA) ---------- */
  function tide(canvas, opts) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, visible = true, t = Math.random() * 10;
    const lines = opts.lines || 24;
    const local = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    canvas.parentElement.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect(); local.tx = e.clientX - r.left; local.ty = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => { local.tx = -9999; local.ty = -9999; });
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(canvas);
    const draw = () => {
      if (!visible) return;
      t += reduce ? 0 : .006;
      local.x += (local.tx - local.x) * .08; local.y += (local.ty - local.y) * .08;
      if (Math.abs(local.tx) > 5000) { local.x = local.tx; local.y = local.ty; }
      ctx.clearRect(0, 0, w, h);
      const step = w < 700 ? 16 : 12;
      for (let i = 0; i < lines; i++) {
        const p = i / (lines - 1);
        const y0 = h * (opts.top + p * (opts.bottom - opts.top));
        const amp = 10 + p * 26;
        ctx.beginPath();
        for (let x = -10; x <= w + step; x += step) {
          let y = y0 + Math.sin(x * .0042 + t * 2 + i * .32) * amp * .6 + Math.sin(x * .0016 - t * 1.3 + i * .12) * amp;
          const ddx = x - local.x, ddy = y - local.y;
          const d2 = ddx * ddx + ddy * ddy;
          y += Math.exp(-d2 / 14000) * -38 * (ddy > 0 ? -1 : 1) * .7;
          x === -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const a = opts.alpha * (.25 + p * .75);
        ctx.strokeStyle = i % 6 === 0 ? `rgba(233,223,204,${a * .9})` : `rgba(124,198,190,${a})`;
        ctx.lineWidth = i % 6 === 0 ? 1.2 : .8;
        ctx.stroke();
      }
    };
    gsap.ticker.add(draw);
  }
  tide($('.cta__tide'), { lines: 20, top: .55, bottom: 1.05, alpha: .4 });

  /* =========================================================
     HERO — "The Ripple Effect"
     water canvas + 3D orbit of media placements + stone drops
     ========================================================= */
  const hero = $('.hero');
  hero.style.touchAction = 'pan-y';
  let heroVisible = true;
  new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; }).observe(hero);

  /* --- water canvas --- */
  const water = $('.hero__water'), wctx = water.getContext('2d');
  let ww = 0, wh = 0, wt = 0;
  const ripples = [];
  const sizeWater = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    ww = water.clientWidth; wh = water.clientHeight;
    water.width = ww * dpr; water.height = wh * dpr;
    wctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  sizeWater();
  const addRipple = (x, y, size) => {
    const big = size === 'big', small = size === 'small';
    ripples.push({ x, y, r: 0, max: big ? 460 : small ? 70 : 170 + Math.random() * 110, sp: big ? 3.4 : small ? 1.1 : 1.7, w: big ? 1.7 : small ? .6 : 1.1, rings: small ? 1 : 3 });
    if (ripples.length > 46) ripples.shift();
  };
  gsap.ticker.add(() => {
    if (!heroVisible) return;
    wt += reduce ? 0 : .01;
    wctx.clearRect(0, 0, ww, wh);
    const hz = wh * .34;
    for (let i = 0; i < 24; i++) {
      const p = ((i + (wt * .5) % 1) / 24);
      const y = hz + Math.pow(p, 2.1) * (wh - hz + 60);
      wctx.beginPath();
      for (let x = 0; x <= ww + 24; x += 24) {
        const yy = y + Math.sin(x * .005 + wt * 2 + i * 1.7) * (1 + p * 7);
        x === 0 ? wctx.moveTo(x, yy) : wctx.lineTo(x, yy);
      }
      wctx.strokeStyle = i % 5 === 0 ? `rgba(233,223,204,${.02 + p * .1})` : `rgba(124,198,190,${.025 + p * .13})`;
      wctx.lineWidth = .5 + p * .9;
      wctx.stroke();
    }
    for (let k = ripples.length - 1; k >= 0; k--) {
      const r = ripples[k];
      r.r += r.sp * (1 + (1 - r.r / r.max) * .8);
      const life = 1 - r.r / r.max;
      if (life <= 0) { ripples.splice(k, 1); continue; }
      for (let j = 0; j < r.rings; j++) {
        const rr = r.r - j * 20; if (rr <= 0) continue;
        wctx.beginPath();
        wctx.ellipse(r.x, r.y, rr, rr * .33, 0, 0, Math.PI * 2);
        wctx.strokeStyle = j === 0 ? `rgba(233,223,204,${life * .6})` : `rgba(124,198,190,${life * .45 / j})`;
        wctx.lineWidth = r.w * (1.3 - j * .3);
        wctx.stroke();
      }
    }
  });

  /* --- 3D orbit --- */
  const ocards = $$('.ocard'), N = ocards.length;
  const orbitIn = { v: 0 };
  let rot = 0, speed = .14, targetSpeed = .14, spinBoost = 0, dragV = 0, tilt = 0, tiltTarget = 0, exitP = 0, R = 600;
  const layoutHero = () => {
    sizeWater();
    const w = hero.clientWidth, mobile = w < 901;
    R = mobile ? Math.min(w * .5, 300) : Math.min(w * .41, 650);
    if (mobile) {
      const h = hero.getBoundingClientRect(), t = $('.hero__title').getBoundingClientRect(), l = $('.hero__lead').getBoundingClientRect();
      hero.style.setProperty('--oy', ((t.bottom + l.top) / 2 - h.top) + 'px');
    } else hero.style.setProperty('--oy', '46%');
  };
  layoutHero();
  window.addEventListener('resize', layoutHero);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutHero);
  gsap.ticker.add(() => {
    if (!heroVisible) return;
    spinBoost *= .955; dragV *= .93;
    speed += (targetSpeed - speed) * .04;
    tilt += (tiltTarget - tilt) * .05;
    if (!reduce) rot += speed + spinBoost * .25 + dragV;
    const k = orbitIn.v, Rr = R * (.3 + .7 * k) * (1 + exitP * 1.1), vy = .1 + tilt;
    for (let i = 0; i < N; i++) {
      const a = (rot + i * 360 / N) * Math.PI / 180, s = Math.sin(a), c = Math.cos(a), d = (c + 1) / 2;
      const el = ocards[i];
      el.style.transform = `translate3d(${(s * Rr).toFixed(1)}px,${(c * Rr * vy).toFixed(1)}px,${(c * Rr * .5).toFixed(1)}px) rotateY(${(s * -30).toFixed(1)}deg)`;
      el.style.opacity = (k * (1 - exitP) * (.14 + .86 * Math.pow(d, 1.7))).toFixed(3);
      el.style.zIndex = Math.round(d * 100);
    }
  });

  /* --- live signals --- */
  const sig = { homes: 78269, leads: 1284 };
  const sigEls = { homes: $('[data-sig="homes"]'), leads: $('[data-sig="leads"]') };
  const callsEl = $('[data-calls]'); let calls = 38;
  const bump = (key, n) => {
    const o = { v: sig[key] }; sig[key] += n;
    gsap.to(o, { v: sig[key], duration: .9, ease: 'power2.out', onUpdate: () => { sigEls[key].textContent = Math.round(o.v).toLocaleString('en-US'); } });
    sigEls[key].classList.add('bump'); setTimeout(() => sigEls[key].classList.remove('bump'), 800);
    if (key === 'leads') { calls++; callsEl.textContent = calls; }
  };

  /* --- stone drops --- */
  const dropsEl = $('.hero__drops');
  const TAGS = [['+1 call tracked', 'leads'], ['Guide delivered · Branford', 'homes'], ['+1 QR scan · Guilford', 'leads'], ['Ad seen · East Haven', 'homes'], ['Offer code redeemed', 'leads'], ['New lead · Branford', 'leads'], ['+1 booked job', 'leads']];
  let tagN = 0;
  const drop = (x, y, user) => {
    addRipple(x, y, user ? 'big' : 'mid');
    setTimeout(() => addRipple(x, y, 'mid'), 220);
    spinBoost += user ? 4 : 1.2;
    if (dropsEl.children.length > 3) return;
    const [txt, key] = TAGS[tagN++ % TAGS.length];
    const t = document.createElement('span');
    t.className = 'dtag'; t.innerHTML = `<i></i>${txt}`;
    t.style.left = x + 'px'; t.style.top = y + 'px';
    dropsEl.appendChild(t);
    gsap.set(t, { xPercent: -50, yPercent: -100 });
    gsap.timeline({ onComplete: () => t.remove() })
      .fromTo(t, { opacity: 0, scale: .5, y: 10 }, { opacity: 1, scale: 1, y: -26, duration: .7, ease: 'back.out(2.2)' })
      .to(t, { y: -100, opacity: 0, duration: 1.3, ease: 'power2.in' }, '+=1.2');
    bump(key, key === 'homes' ? 4 + Math.floor(Math.random() * 12) : 1);
  };
  let autoTimer = null;
  const startAuto = () => {
    if (reduce || autoTimer) return;
    autoTimer = setInterval(() => {
      if (!heroVisible || document.hidden || exitP > .4) return;
      const w = hero.clientWidth, h = hero.clientHeight;
      drop(w * (.08 + Math.random() * .84), h * (.56 + Math.random() * .3), false);
    }, 2300);
  };

  /* --- pointer: light, tilt, drag-to-spin, click-to-drop, trails --- */
  let down = null, moved = 0, lastTrail = 0;
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    hero.style.setProperty('--mx', x + 'px'); hero.style.setProperty('--my', y + 'px');
    if (e.pointerType === 'mouse') {
      targetSpeed = .14 + (x / r.width - .5) * .7;
      tiltTarget = (y / r.height - .5) * .1;
      const now = performance.now();
      if (now - lastTrail > 110 && !down) { lastTrail = now; addRipple(x, y, 'small'); }
    }
    if (down) {
      const dx = e.clientX - down.x; moved += Math.abs(dx);
      dragV = dx * .09; rot += dx * .22; down.x = e.clientX;
    }
  });
  hero.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button, .hero__signals')) return;
    down = { x: e.clientX }; moved = 0;
  });
  window.addEventListener('pointerup', (e) => {
    if (!down) return;
    down = null;
    if (moved < 8 && !e.target.closest('a, button, .hero__signals') && hero.contains(e.target)) {
      const r = hero.getBoundingClientRect();
      drop(e.clientX - r.left, e.clientY - r.top, true);
    }
  });
  hero.addEventListener('mouseleave', () => { targetSpeed = .14; tiltTarget = 0; });

  /* --- headline split into letters --- */
  $$('.hero__title .ln__in').forEach((line) => {
    const walk = (node) => Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((word) => {
          if (!word) return;
          if (/^\s+$/.test(word)) { frag.appendChild(document.createTextNode(' ')); return; }
          const wd = document.createElement('span'); wd.className = 'wd';
          word.split('').forEach((ch) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; wd.appendChild(s); });
          frag.appendChild(wd);
        });
        node.replaceChild(frag, n);
      } else walk(n);
    });
    walk(line);
  });
  if (finePointer) {
    $$('.hero__title .ch').forEach((ch) => { ch.style.pointerEvents = 'auto'; ch.addEventListener('mouseenter', () => gsap.fromTo(ch, { y: 0, rotate: 0 }, { y: -22, rotate: gsap.utils.random(-8, 8), duration: .3, yoyo: true, repeat: 1, ease: 'power2.out' })); });
  }

  /* --- scroll exit --- */
  ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => { exitP = s.progress; } });
  gsap.to('.hero__title', { scale: 1.16, y: -50, opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '75% top', scrub: true } });
  gsap.to('.hero__eyebrow, .hero__foot, .hero__bar', { opacity: 0, y: -40, ease: 'none', scrollTrigger: { trigger: hero, start: '5% top', end: '55% top', scrub: true } });

  /* ---------- preloader → hero intro ---------- */
  const heroIntro = gsap.timeline({ paused: true })
    .from('.hero__title .ch', { yPercent: 120, rotateX: -90, opacity: 0, duration: 1.4, stagger: .04, ease: 'expo.out' })
    .to(orbitIn, { v: 1, duration: 2.6, ease: 'expo.out' }, 0)
    .add(() => { spinBoost = 16; drop(hero.clientWidth / 2, hero.clientHeight * .64, true); }, .05)
    .from('.hero__eyebrow', { y: 20, opacity: 0, duration: .8 }, .2)
    .from('.hero__lead > *, .hero__signals', { y: 40, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out' }, .6)
    .from('.hero__bar', { opacity: 0, y: 20, duration: .8 }, .9)
    .from('.hdr', { y: -40, opacity: 0, duration: .9, ease: 'power3.out', clearProps: 'transform,opacity' }, .2)
    .add(() => { layoutHero(); startAuto(); }, 1.2);

  const finishLoad = () => {
    body.classList.remove('is-loading');
    if (lenis) lenis.start();
    heroIntro.play();
    ScrollTrigger.refresh();
  };

  if (reduce) { $('.loader').remove(); finishLoad(); }
  else {
    const num = $('.loader__num'); const c = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => { $('.loader').remove(); } });
    tl.to('.loader__stone', { opacity: 1, y: 98, duration: .75, ease: 'power2.in' })
      .to('.loader__stone', { scaleY: .4, scaleX: 1.3, opacity: 0, duration: .25 })
      .to('.loader__ripples .rip', { attr: { rx: 190, ry: 46 }, opacity: 1, duration: 1.6, stagger: .22, ease: 'power2.out', onStart() {} }, '-=.15')
      .to('.loader__ripples .rip', { opacity: 0, duration: .8, stagger: .22 }, '-=1')
      .to('.loader__word span, .loader__word em', { y: 0, duration: 1, stagger: .1, ease: 'expo.out' }, '-=1.6')
      .to(c, { v: 100, duration: 2.1, ease: 'power2.inOut', onUpdate: () => num.textContent = Math.round(c.v) }, 0)
      .to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut', onStart: finishLoad }, '+=.15');
    gsap.set('.loader', { clipPath: 'inset(0 0 0% 0)' });
  }

  /* hero ticker rotate messages */
  const tickerMsgs = ['Shoreline Home Guide — reserve your placement for the next issue', 'Direct-to-home in East Haven, Branford & Guilford', 'Every ad tracked: calls, scans & offer codes'];
  const tick = $('.hero__ticker span'); let ti = 0;
  setInterval(() => {
    ti = (ti + 1) % tickerMsgs.length;
    gsap.to(tick, { yPercent: -110, opacity: 0, duration: .45, ease: 'power2.in', onComplete: () => {
      tick.textContent = tickerMsgs[ti];
      gsap.fromTo(tick, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'power3.out' });
    } });
  }, 3800);

  /* ---------- marquee helper (velocity-reactive) ---------- */
  function marquee(track, dir, speed) {
    const items = Array.from(track.children);
    items.forEach((n) => track.appendChild(n.cloneNode(true)));
    let x = 0, boost = 0, half = track.scrollWidth / 2;
    window.addEventListener('resize', () => { half = track.scrollWidth / 2; });
    let visible = true;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(track);
    gsap.ticker.add((_, dt) => {
      if (!visible || reduce) return;
      boost *= .92;
      x += dir * (speed + boost) * (dt / 16.67);
      if (x <= -half) x += half; if (x > 0) x -= half;
      track.style.transform = `translate3d(${x}px,0,0)`;
    });
    ScrollTrigger.create({ trigger: track, start: 'top bottom', end: 'bottom top', onUpdate: (s) => { boost = Math.min(Math.abs(s.getVelocity()) / 120, 14); } });
  }
  const bandTrack = $('.band__track');
  // band already contains a duplicated set; just loop it
  (function () {
    let x = 0, boost = 0, dir = -1;
    gsap.ticker.add((_, dt) => {
      if (reduce) return; boost *= .93;
      x += dir * (1.1 + boost) * (dt / 16.67);
      const half = bandTrack.scrollWidth / 2;
      if (x <= -half) x += half; if (x > 0) x -= half;
      bandTrack.style.transform = `translate3d(${x}px,0,0)`;
    });
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { boost = Math.min(Math.abs(s.getVelocity()) / 100, 16); dir = s.direction === 1 ? -1 : 1; } });
  })();
  $$('.who__row').forEach((row, i) => marquee($('.who__track', row), +row.dataset.dir, .6 + i * .15));

  /* ---------- generic heading reveals ---------- */
  $$('.sec-head, .who__head, .cover__head > .eyebrow, .cover__head > .h2').forEach((el) => {
    gsap.from(el.children.length && !el.classList.contains('h2') ? el.children : el, {
      y: 60, opacity: 0, duration: 1.1, stagger: .1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* ---------- manifesto: word fill on scroll ---------- */
  const mtext = $('[data-fill]');
  (function splitWords(el) {
    const nodes = Array.from(el.childNodes);
    el.innerHTML = '';
    nodes.forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) el.appendChild(document.createTextNode(' '));
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; el.appendChild(s); }
        });
      } else el.appendChild(n);
    });
  })(mtext);
  const words = $$('.w', mtext);
  ScrollTrigger.create({
    trigger: mtext, start: 'top 80%', end: 'bottom 45%', scrub: true,
    onUpdate: (s) => { const n = Math.round(s.progress * words.length); words.forEach((w, i) => w.classList.toggle('on', i < n)); }
  });
  $$('.pill', mtext).forEach((p) => gsap.to(p, { scale: 1, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: p, start: 'top 75%' } }));
  gsap.from('.manifesto__foot > *', { y: 40, opacity: 0, stagger: .12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.manifesto__foot', start: 'top 90%' } });

  /* ---------- services: hover image + accordion ---------- */
  const float = $('.svc__float'), floatIn = $('.svc__float-in');
  if (finePointer) {
    const fx = gsap.quickTo(float, 'x', { duration: .6, ease: 'power3' }), fy = gsap.quickTo(float, 'y', { duration: .6, ease: 'power3' });
    const fr = gsap.quickTo(float, 'rotation', { duration: .8, ease: 'power3' });
    let px = 0;
    window.addEventListener('mousemove', (e) => { fx(e.clientX + 40); fy(e.clientY); fr(gsap.utils.clamp(-12, 12, (e.clientX - px) * .6)); px = e.clientX; }, { passive: true });
    $('.svc').addEventListener('mouseenter', () => gsap.to(float, { opacity: 1, scale: 1, duration: .5, ease: 'power3.out' }));
    $('.svc').addEventListener('mouseleave', () => gsap.to(float, { opacity: 0, scale: .6, duration: .4 }));
    $$('.svc__item').forEach((it) => it.addEventListener('mouseenter', () => {
      floatIn.style.backgroundImage = `url('${it.dataset.img}')`;
      gsap.fromTo(floatIn, { scale: 1.25 }, { scale: 1, duration: .8, ease: 'power3.out' });
    }));
  }
  $$('.svc__item').forEach((it) => {
    const b = $('.svc__body', it);
    it.setAttribute('tabindex', '0'); it.setAttribute('role', 'button'); it.setAttribute('aria-expanded', 'false');
    const toggle = () => {
      const open = !it.classList.contains('is-open');
      $$('.svc__item.is-open').forEach((o) => { if (o !== it) { o.classList.remove('is-open'); o.setAttribute('aria-expanded', 'false'); gsap.to($('.svc__body', o), { height: 0, duration: .6, ease: 'power3.inOut' }); } });
      it.classList.toggle('is-open', open); it.setAttribute('aria-expanded', String(open));
      gsap.to(b, { height: open ? 'auto' : 0, duration: .7, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() });
    };
    it.addEventListener('click', toggle);
    it.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
  gsap.from('.svc__item', { y: 50, opacity: 0, stagger: .08, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.svc', start: 'top 80%' } });

  /* ---------- method ring ---------- */
  const ticks = $('.ring__ticks');
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2, r1 = 222, r2 = i % 15 === 0 ? 240 : 230;
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', 250 + Math.cos(a) * r1); l.setAttribute('y1', 250 + Math.sin(a) * r1);
    l.setAttribute('x2', 250 + Math.cos(a) * r2); l.setAttribute('y2', 250 + Math.sin(a) * r2);
    ticks.appendChild(l);
  }
  const ring = $('.ring'), rdot = $('.ring__dot'), rfill = $('.ring__fill');
  const steps = $$('.step'), nodes = $$('.rn');
  const C = 2 * Math.PI * 200;
  let curStep = -1;
  const placeNodes = () => {
    const r = ring.clientWidth * .4;
    nodes.forEach((n, i) => { const a = -Math.PI / 2 + i * Math.PI / 2; gsap.set(n, { x: Math.cos(a) * r, y: Math.sin(a) * r }); });
  };
  placeNodes();
  window.addEventListener('resize', placeNodes);
  function setRing(p) {
    const size = ring.clientWidth, r = size * .4;
    const ang = -Math.PI / 2 + p * Math.PI * 2;
    gsap.set(rdot, { x: Math.cos(ang) * r, y: Math.sin(ang) * r });
    rfill.style.strokeDashoffset = C * (1 - p);
    gsap.set('.method__bar', { scaleX: p });
    const s = Math.min(3, Math.floor(p * 4 + .02));
    if (s !== curStep) {
      curStep = s;
      steps.forEach((st, i) => st.classList.toggle('is-on', i === s));
      nodes.forEach((n, i) => n.classList.toggle('is-on', i <= s));
    }
  }
  setRing(0);
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const st = ScrollTrigger.create({ trigger: '.method', start: 'top top', end: '+=220%', pin: '.method__pin', scrub: true, onUpdate: (s) => setRing(s.progress) });
    return () => st.kill();
  });
  mm.add('(max-width: 900px)', () => {
    const o = { p: 0 };
    const tw = gsap.to(o, { p: 1, duration: 12, ease: 'none', repeat: -1, paused: true, onUpdate: () => setRing(o.p) });
    const st = ScrollTrigger.create({ trigger: '.method', start: 'top 70%', end: 'bottom 20%', onToggle: (s) => s.isActive ? tw.play() : tw.pause() });
    nodes.forEach((n, i) => n.addEventListener('click', () => { o.p = i / 4 + .01; tw.progress(o.p); }));
    return () => { tw.kill(); st.kill(); };
  });

  /* ---------- flagship: expanding reveal ---------- */
  mm.add('(min-width: 0px)', () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.flag__pin', start: 'top top', end: '+=120%', pin: true, scrub: true, invalidateOnRefresh: true } });
    tl.fromTo('.flag__media', { width: () => innerWidth < 700 ? '78vw' : '34vw', height: () => innerWidth < 700 ? '40vh' : '44vh', borderRadius: 24 }, { width: '100vw', height: '100vh', borderRadius: 0, ease: 'none' }, 0)
      .fromTo('.flag__img', { scale: 1.3 }, { scale: 1, ease: 'none' }, 0)
      .fromTo('.flag__title span', { xPercent: -30 }, { xPercent: 0, ease: 'none' }, 0)
      .fromTo('.flag__title em', { xPercent: 30 }, { xPercent: 0, ease: 'none' }, 0)
      .fromTo('.flag__label', { scale: .85 }, { scale: 1, ease: 'none' }, 0);
    return () => tl.kill();
  });
  // book opens as content scrolls in
  gsap.timeline({ scrollTrigger: { trigger: '.flag__content', start: 'top 75%', end: 'center 45%', scrub: 1 } })
    .fromTo('.book__3d', { rotateY: -28, rotateX: 10 }, { rotateY: -6, rotateX: 4, ease: 'none' }, 0)
    .fromTo('.book__cover', { rotateY: 0 }, { rotateY: -150, ease: 'none' }, .15);
  if (finePointer) {
    const book = $('.book');
    book.addEventListener('mousemove', (e) => {
      const r = book.getBoundingClientRect();
      gsap.to('.book', { rotateY: ((e.clientX - r.left) / r.width - .5) * 14, rotateX: -((e.clientY - r.top) / r.height - .5) * 10, duration: .8, ease: 'power3' });
    });
    book.addEventListener('mouseleave', () => gsap.to('.book', { rotateY: 0, rotateX: 0, duration: 1, ease: 'elastic.out(1,.5)' }));
  }
  gsap.from('.flag__copy > *', { y: 50, opacity: 0, stagger: .1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.flag__copy', start: 'top 80%' } });
  gsap.from('.flag__list li', { x: -30, opacity: 0, stagger: .08, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.flag__list', start: 'top 85%' } });

  /* ---------- coverage map ---------- */
  const TOWNS = [
    { pop: 27923, desc: 'Beachfront neighborhoods & established family homes' },
    { pop: 28273, desc: 'Thimble Islands, village green & waterfront homes' },
    { pop: 22073, desc: 'Historic town green & high-value colonial homes' }
  ];
  const popEl = $('.tcard__pop'), descEl = $('.tcard__desc');
  let popVal = { v: TOWNS[0].pop };
  function selectTown(i) {
    $$('.town').forEach((b, k) => { b.classList.toggle('is-on', k === i); b.setAttribute('aria-selected', String(k === i)); });
    $$('.region').forEach((r) => r.classList.toggle('is-on', +r.dataset.town === i));
    $$('.pin').forEach((p) => p.classList.toggle('is-on', +p.dataset.town === i));
    gsap.to(popVal, { v: TOWNS[i].pop, duration: 1, ease: 'power3.out', onUpdate: () => popEl.textContent = Math.round(popVal.v).toLocaleString('en-US') });
    gsap.to(descEl, { opacity: 0, y: 8, duration: .2, onComplete: () => { descEl.textContent = TOWNS[i].desc; gsap.to(descEl, { opacity: 1, y: 0, duration: .4 }); } });
  }
  $$('.town').forEach((b) => b.addEventListener('click', () => selectTown(+b.dataset.town)));
  $$('.region, .pin').forEach((r) => r.addEventListener('click', () => selectTown(+r.dataset.town)));
  selectTown(0);
  const coast = $('.map__coast'); const cl = coast.getTotalLength();
  gsap.set(coast, { strokeDasharray: cl, strokeDashoffset: cl });
  gsap.timeline({ scrollTrigger: { trigger: '.map', start: 'top 75%' } })
    .to(coast, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' })
    .from('.map__land', { opacity: 0, duration: 1 }, .4)
    .from('.pin', { scale: 0, transformOrigin: 'center', stagger: .15, duration: .8, ease: 'back.out(2)' }, 1)
    .from('.map__isles ellipse', { scale: 0, transformOrigin: 'center', stagger: .08, duration: .6 }, 1.2);
  gsap.to('.map__waves path', { x: -60, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: .5 });
  gsap.from('.towns, .tcard, .cover__lede', { y: 40, opacity: 0, stagger: .1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.towns', start: 'top 90%' } });

  /* ---------- planner ---------- */
  const SIZES = {
    q: { w: '46%', h: '28%', vis: 35, tier: 'Noticed' },
    h: { w: 'calc(100% - 32px)', h: '40%', vis: 58, tier: 'Strong' },
    f: { w: 'calc(100% - 32px)', h: 'calc(100% - 60px)', vis: 82, tier: 'Dominant' },
    b: { w: 'calc(100% - 32px)', h: 'calc(100% - 60px)', vis: 100, tier: 'Unmissable' }
  };
  const plan = { towns: new Set([0, 1]), size: 'h', issues: 2 };
  const outPeople = $('[data-out="people"]'), outImpr = $('[data-out="impr"]'), outTier = $('[data-out="tier"]');
  const shown = { people: 0, impr: 0 };
  const range = $('.prange');
  function renderPlan(first) {
    const people = Array.from(plan.towns).reduce((a, i) => a + TOWNS[i].pop, 0);
    const impr = Math.round(people * plan.issues * 2.5);
    gsap.to(shown, { people, impr, duration: first ? 0 : 1, ease: 'power3.out', onUpdate: () => {
      outPeople.textContent = Math.round(shown.people).toLocaleString('en-US');
      outImpr.textContent = Math.round(shown.impr).toLocaleString('en-US');
    } });
    const s = SIZES[plan.size];
    const ad = $('.ppage__ad');
    gsap.to(ad, { width: s.w, height: s.h, duration: first ? 0 : .8, ease: 'expo.out' });
    const page = $('.ppage');
    page.style.background = plan.size === 'b' ? 'var(--deep)' : '#fffdf8';
    $('.ppage__adl').textContent = plan.size === 'b' ? 'Your business — back cover' : 'Your business';
    const townBoost = plan.towns.size / 3;
    $('.meter__fill').style.width = Math.max(8, s.vis * (.55 + .45 * townBoost)) + '%';
    outTier.textContent = plan.towns.size ? s.tier : 'Pick a town';
    range.style.setProperty('--p', ((plan.issues - 1) / 3 * 100) + '%');
    $('.pissues').textContent = plan.issues;
    if (!first) gsap.fromTo('.ppage', { rotate: -5, scale: .96 }, { rotate: -2, scale: 1, duration: .8, ease: 'elastic.out(1,.5)' });
  }
  $$('[data-group="towns"] .pchip').forEach((b) => b.addEventListener('click', () => {
    const v = +b.dataset.val;
    plan.towns.has(v) ? plan.towns.delete(v) : plan.towns.add(v);
    b.classList.toggle('is-on', plan.towns.has(v)); b.setAttribute('aria-pressed', String(plan.towns.has(v)));
    renderPlan();
  }));
  $$('[data-group="size"] .pchip').forEach((b) => b.addEventListener('click', () => {
    plan.size = b.dataset.val;
    $$('[data-group="size"] .pchip').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    renderPlan();
  }));
  range.addEventListener('input', () => { plan.issues = +range.value; renderPlan(); });
  renderPlan(true);
  ScrollTrigger.create({ trigger: '.planner', start: 'top 75%', once: true, onEnter: () => { shown.people = 0; shown.impr = 0; renderPlan(); } });
  gsap.from('.planner > *', { y: 70, opacity: 0, stagger: .12, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.planner', start: 'top 85%' } });

  /* ---------- why: stacking cards ---------- */
  const scards = $$('.scard');
  scards.forEach((c, i) => {
    if (i === scards.length - 1) return;
    gsap.to(c, { scale: .9 + i * .02, ease: 'none', scrollTrigger: { trigger: scards[i + 1], start: 'top bottom', end: 'top 30%', scrub: true } });
  });
  gsap.from('.viz-bars i', { scaleY: 0, stagger: .08, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.scard--2', start: 'top 70%' } });
  $$('.viz-wave path').forEach((p) => {
    const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l });
    gsap.to(p, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: '.scard--3', start: 'top 70%' } });
  });

  /* ---------- founder note ---------- */
  gsap.from('.note__card', { rotate: -14, y: 120, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.note', start: 'top 70%' } });
  gsap.from('.note__quote', { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.note__quote', start: 'top 85%' } });
  $$('.note__quote mark').forEach((m, i) => gsap.to(m, { backgroundSize: '100% 32%', duration: 1.2, delay: .4 + i * .5, ease: 'power2.inOut', scrollTrigger: { trigger: '.note__quote', start: 'top 70%' } }));
  gsap.to('.sig', { clipPath: 'inset(0 0% 0 0)', duration: 2.2, ease: 'power2.inOut', scrollTrigger: { trigger: '.sig', start: 'top 85%' } });

  /* ---------- CTA ---------- */
  $$('.cta__line').forEach((line) => {
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split('').forEach((ch) => {
            if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else walk(n);
      });
    };
    walk(line);
  });
  gsap.from('.cta__title .ch', { yPercent: 120, rotate: 8, duration: 1.2, stagger: .025, ease: 'expo.out', scrollTrigger: { trigger: '.cta__title', start: 'top 80%' } });
  gsap.from('.orb', { scale: 0, rotate: -120, duration: 1.4, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.cta__row', start: 'top 85%' } });
  gsap.from('.cline', { x: 40, opacity: 0, stagger: .1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.cta__row', start: 'top 85%' } });
  if (finePointer) {
    $$('.cta__title .ch').forEach((ch) => ch.addEventListener('mouseenter', () => gsap.fromTo(ch, { y: 0 }, { y: -18, duration: .25, yoyo: true, repeat: 1, ease: 'power2.out' })));
  }

  /* ---------- footer ---------- */
  gsap.to('.foot__word', { backgroundSize: '100% 100%', ease: 'none', scrollTrigger: { trigger: '.foot__word', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  /* ---------- design notes (?notes=1) ---------- */
  if (/[?&]notes=1/.test(location.search)) {
    document.documentElement.classList.add('has-notes');
    const NOTES = [
      ['Preloader — the stone drop', 'A stone dropping into water and rippling outward is the brand story in two seconds: one placement, spreading reach. It also gives fonts and images time to load so the hero lands polished.'],
      ['Hero — "The Ripple Effect"', 'One big idea: drop one stone and the ripples spread. That is what Beachstone does for a local business. Ten real placements (the Guide, direct mail, a social ad, ROI and call tracking, QR scans, the coverage map) orbit the headline in 3D, so visitors see the whole service mix in five seconds. Visitors can drag to spin it, and each click drops a stone that ripples and shows a "+1 call tracked" style tag while the live signal counters tick up. Without reading a word, they learn targeted reach that is measured.'],
      ['Marquee band', 'A tilted, scroll-reactive band breaks the page rhythm and repeats the three towns and three values. Speeds up as you scroll for energy.'],
      ['Manifesto (About)', 'Words fill in as you read — it slows the visitor down on the one paragraph that explains who Beachstone is. Inline image pills keep it human without a generic "text + photo" layout.'],
      ['Services index', 'A large editorial index (like top agencies use) instead of icon cards. Hover shows a photo that follows the cursor; click expands details. Scannable for busy owners, rich for the curious.'],
      ['The Beachstone Method ring', 'A pinned, scroll-driven loop: Pinpoint → Place → Reach → Prove. The circle visualises that measuring feeds the next campaign — the ROI story told visually.'],
      ['Flagship: Shoreline Home Guide', 'The photo expands to full screen as you scroll — a cinematic "this is the main event" moment that drives traffic to Active Campaigns. The 3D guide then opens to reveal an ad page, so advertisers literally see where they would appear.'],
      ['Coverage map', 'An interactive coastline of East Haven, Branford and Guilford. Geography is a selling point for local advertisers; clicking towns shows census population. Easy to extend when new towns or campaigns launch.'],
      ['Who advertises', 'Three counter-scrolling rows of business categories let a roofer or realtor instantly see "this is for me". Doubles as SEO-friendly keyword text.'],
      ['Reach planner', 'The most persuasive section: prospects pick towns, ad size and frequency and watch their ad grow on the page while reach numbers count up. It turns browsing into a sales conversation and ends on "Request rates".'],
      ['Why Beachstone — stacking cards', 'Four differentiators stack like a deck as you scroll, each with its own animated visual (target, bars, waves, orbit). Memorable and compact.'],
      ['Founder note', 'A personal note with a signature that draws itself builds trust — local businesses buy from people. Photo placeholder awaits Braden\'s portrait.'],
      ['Final CTA + footer', 'A huge kinetic headline and a spinning "Start a campaign" orb make the next step unmistakable; direct email/phone sit beside it. The footer wordmark fills with colour as you reach the end.']
    ];
    $('.notes__panel').innerHTML = NOTES.map(([h, p]) => `<h4>${h}</h4><p>${p}</p>`).join('');
    $('.notes__toggle').addEventListener('click', () => $('.notes').classList.toggle('is-open'));
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
