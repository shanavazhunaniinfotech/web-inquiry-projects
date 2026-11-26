/* Golden Oak Properties — homepage concept */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  let buildST = null;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if (reduced) document.documentElement.classList.add('reduced');

  /* =======================================================
     DATA (prices from goldenoakproperties.com listings)
     ======================================================= */
  const PROJECTS = [
    { name: 'Six Senses Residences', area: 'Palm Jumeirah', price: 9400000, type: 'villa', status: 'offplan', featured: true, img: 'img/palm.webp' },
    { name: 'Davinci Tower', area: 'Dubai Water Canal', price: 5450000, type: 'apartment', status: 'offplan', featured: true, img: 'img/davinci.webp' },
    { name: 'Dubai Hills Vista', area: 'Dubai Hills', price: 27600000, type: 'villa', status: 'offplan', featured: true, img: 'img/hills-vista.webp' },
    { name: 'Cavalli Tower', area: 'Dubai Marina', price: 2939000, type: 'apartment', status: 'offplan', img: 'img/marina-night.webp' },
    { name: 'Elie Saab at Arabian Ranches III', area: 'Arabian Ranches', price: 4650000, type: 'villa', status: 'offplan', img: 'img/elie-saab.webp' },
    { name: 'Tilal Al Furjan', area: 'Al Furjan', price: 3500000, type: 'villa', status: 'offplan', img: 'img/furjan.webp' },
    { name: 'DAMAC Lagoons', area: 'DAMAC Lagoons', price: 1530000, type: 'villa', status: 'offplan', img: 'img/lagoons.webp' },
    { name: 'Beach Mansion', area: 'Emaar Beachfront', price: 1922888, type: 'apartment', status: 'offplan', img: 'img/beachfront.webp' },
    { name: 'Rosewater', area: 'Creek Beach', price: 1450000, type: 'apartment', status: 'offplan', img: 'img/creek.webp' },
    { name: 'W Residences', area: 'Downtown', price: 1666777, type: 'apartment', status: 'ready', img: 'img/downtown.webp' },
    { name: 'Le Ciel, Port de La Mer', area: 'Jumeirah 1', price: 1700000, type: 'apartment', status: 'ready', img: 'img/port-de-la-mer.webp' },
  ];
  const RATES = { AED: 1, USD: 1 / 3.6725, EUR: 1 / 3.98 };
  let currency = 'AED';
  const fmt = (aed, cur = currency) => {
    if (cur === 'AED') return 'AED ' + Math.round(aed).toLocaleString('en-US');
    const v = Math.round((aed * RATES[cur]) / 1000) * 1000;
    return (cur === 'USD' ? '≈ $' : '≈ €') + v.toLocaleString('en-US');
  };

  /* =======================================================
     LOADER
     ======================================================= */
  const loader = $('#loader');
  let pct = 0, forced = false;
  const tick = setInterval(() => {
    pct = Math.min(pct + Math.random() * 18, (forced || document.readyState === 'complete') ? 100 : 92);
    $('#loaderPct').textContent = Math.round(pct);
    $('#loaderBar').style.width = pct + '%';
    if (pct >= 100) { clearInterval(tick); setTimeout(finishLoad, 250); }
  }, 90);
  setTimeout(() => { forced = true; }, 3500); // safety
  let loaded = false;
  function finishLoad() {
    if (loaded) return; loaded = true;
    loader.classList.add('is-done');
    intro();
  }

  /* =======================================================
     SCENE GENERATION
     ======================================================= */
  const scene = $('#scene');
  const GROUND = 790, TOP = 300, FLOORS = 16, FH = (GROUND - TOP) / FLOORS;
  const TX = 730, TW = 200;

  // fit the scene: portrait screens get a taller viewBox so the tower sits below the copy
  function fitScene() {
    const r = innerWidth / innerHeight;
    const H = r < 1 ? Math.min(Math.max(660 / r, 900), 1700) : 900;
    scene.setAttribute('viewBox', `0 ${900 - H} 1600 ${H}`);
  }
  fitScene();
  addEventListener('resize', fitScene);

  // distant skyline
  const sky = $('#skyline'), skyL = $('#skylineLights');
  const blds = [[60,40,120],[110,28,80],[150,46,170],[205,30,95],[300,36,140],[345,24,70],[372,40,190],[420,30,110],[1150,40,150],[1200,26,90],[1235,44,210],[1290,30,120],[1330,40,170],[1380,24,80],[1410,50,240],[1470,32,130],[1510,40,180],[1560,40,100]];
  blds.forEach(([x, w, h]) => {
    el('rect', { x, y: 715 - h, width: w, height: h + 5, fill: '#c7b08b', opacity: .55 }, sky);
    for (let i = 0; i < Math.floor(h / 22); i++) {
      if (Math.random() > .55) el('rect', { x: x + 4 + Math.random() * (w - 10), y: 715 - h + 8 + i * 20, width: 3, height: 3, fill: '#ffd98f' }, skyL);
    }
  });
  // Burj-like spire
  el('path', { d: 'M238 715 L246 520 L252 430 L256 330 L258 250 L260 330 L264 430 L270 520 L280 715Z', fill: '#c2aa83', opacity: .6 }, sky);
  for (let i = 0; i < 16; i++) el('rect', { x: 255 + (Math.random() * 6 - 3), y: 360 + i * 22, width: 2.5, height: 2.5, fill: '#ffd98f' }, skyL);
  el('circle', { cx: 258, cy: 250, r: 2.5, fill: '#ff5a4a' }, skyL);

  // stars
  const stars = $('#stars');
  for (let i = 0; i < 70; i++) el('circle', { cx: Math.random() * 1600, cy: Math.random() * 1200 - 780, r: Math.random() * 1.3 + .3, fill: '#fff', opacity: Math.random() * .7 + .3 }, stars);

  // piles
  const piles = $('#piles');
  for (let i = 0; i < 9; i++) el('line', { x1: 722 + i * 27, y1: 792, x2: 722 + i * 27, y2: 822 }, piles);

  // tower floors
  const tower = $('#tower'), lights = $('#lights'), scaffold = $('#scaffold'), fins = $('#fins');
  const floors = [], glassPanels = [], winLights = [];
  for (let i = 0; i < FLOORS; i++) {
    const y = GROUND - (i + 1) * FH;
    const g = el('g', { class: 'floor' }, tower);
    // columns
    [0, 48, 96, 144, 193].forEach(cx => el('rect', { x: TX + cx, y: y + 4, width: 7, height: FH - 4, fill: 'url(#concrete)' }, g));
    // slab
    el('rect', { x: TX - 4, y, width: TW + 8, height: 5, fill: '#8a847a' }, g);
    // glass
    const gl = el('g', { opacity: 0 }, g);
    el('rect', { x: TX + 2, y: y + 5, width: TW - 4, height: FH - 5, fill: 'url(#glass)' }, gl);
    for (let m = 1; m < 6; m++) el('line', { x1: TX + m * 33.3, y1: y + 5, x2: TX + m * 33.3, y2: y + FH, stroke: '#1d3446', 'stroke-width': 1.2 }, gl);
    el('line', { x1: TX, y1: y + 5.5, x2: TX + TW, y2: y + 5.5, stroke: '#e2c27d', 'stroke-width': 1, opacity: .7 }, gl);
    floors.push({ g, y }); glassPanels.push(gl);
    // window lights
    for (let w = 0; w < 6; w++) {
      if (Math.random() > .62) continue;
      winLights.push(el('rect', { x: TX + 5 + w * 33.3, y: y + 8, width: 27, height: FH - 11, fill: Math.random() > .3 ? '#ffd88a' : '#fff0c8', opacity: 0 }, lights));
    }
  }
  // scaffold
  for (let i = 0; i <= FLOORS; i++) {
    const y = GROUND - i * FH;
    el('line', { x1: TX - 16, y1: y, x2: TX - 4, y2: y, stroke: '#a07c3b', 'stroke-width': 1.5 }, scaffold);
    el('line', { x1: TX + TW + 4, y1: y, x2: TX + TW + 16, y2: y, stroke: '#a07c3b', 'stroke-width': 1.5 }, scaffold);
    if (i < FLOORS) {
      el('line', { x1: TX - 16, y1: y, x2: TX - 4, y2: y - FH, stroke: '#a07c3b', 'stroke-width': 1 }, scaffold);
      el('line', { x1: TX + TW + 16, y1: y, x2: TX + TW + 4, y2: y - FH, stroke: '#a07c3b', 'stroke-width': 1 }, scaffold);
    }
  }
  [TX - 16, TX - 4, TX + TW + 4, TX + TW + 16].forEach(x => el('line', { x1: x, y1: GROUND, x2: x, y2: TOP, stroke: '#a07c3b', 'stroke-width': 1.5 }, scaffold));
  // fins
  [TX + 1, TX + 99, TX + TW - 3].forEach(x => el('rect', { x, y: TOP, width: 3, height: GROUND - TOP, fill: 'url(#gold)' }, fins));

  // villa + crown lights
  [[1075, 716, 150, 66], [1240, 716, 100, 66], [1115, 636, 120, 52]].forEach(([x, y, w, h]) =>
    winLights.push(el('rect', { x: x + 3, y: y + 3, width: w - 6, height: h - 6, fill: '#ffd98f', opacity: 0, class: 'vl' }, lights)));
  const crownLight = el('path', { d: 'M770 252 H890', stroke: '#ffe3a3', 'stroke-width': 4, opacity: 0 }, lights);

  // palms
  const palms = $('#palms');
  function palm(x, s, flip = 1) {
    const outer = el('g', { transform: `translate(${x} ${GROUND + 4})` }, palms);
    const g = el('g', { transform: `scale(${s * flip} ${s})` }, outer);
    el('path', { d: 'M0 0 C 4 -40 -2 -80 8 -120', stroke: '#7a5b36', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, g);
    for (let k = 0; k < 6; k++) el('path', { d: 'M8 -120 c 20 -10 40 -6 56 8 c -18 -6 -36 -4 -56 -8z', fill: k % 2 ? '#2f5a3a' : '#3e6f47', transform: `rotate(${-150 + k * 50} 8 -120)` }, g);
    el('circle', { cx: 8, cy: -118, r: 5, fill: '#5d4426' }, g);
    return outer;
  }
  const palmEls = [palm(650, .85), palm(1005, .95, -1), palm(1400, 1.05), palm(395, .7, -1), palm(1520, .8)];

  // lamps
  const lamps = $('#lamps'), lampGlows = $('#lampGlows');
  for (let x = 80; x < 1600; x += 190) {
    el('rect', { x, y: 800, width: 3, height: 42, fill: '#3a3a3a' }, lamps);
    el('rect', { x: x - 6, y: 798, width: 14, height: 3, fill: '#3a3a3a' }, lamps);
    el('circle', { cx: x + 1, cy: 806, r: 34, fill: 'url(#lampGlow)' }, lampGlows);
  }

  /* =======================================================
     NO-GSAP FALLBACK
     ======================================================= */
  if (!hasGSAP) {
    document.documentElement.classList.add('no-js');
    finishLoad();
    initUI();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* =======================================================
     SMOOTH SCROLL
     ======================================================= */
  let lenis = null;
  if (!reduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  ScrollTrigger.config({ ignoreMobileResize: true });
  const scrollTo = target => {
    const t = typeof target === 'string' ? $(target) : target;
    if (!t) return;
    const off = -(window.innerWidth < 1020 ? 70 : 80);
    lenis ? lenis.scrollTo(t, { offset: off, duration: 1.4 }) : window.scrollTo({ top: t.getBoundingClientRect().top + scrollY + off, behavior: 'smooth' });
  };

  /* =======================================================
     BUILD TIMELINE
     ======================================================= */
  const build = $('#build');
  const stages = $$('.stage');
  const drawPaths = $$('#blueprint .draw');
  drawPaths.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });

  gsap.set('#crane > rect', { scaleY: 0, transformOrigin: '50% 100%' });
  gsap.set('#craneTop', { autoAlpha: 0, y: -80 });
  gsap.set('#foundation', { scaleY: 0, transformOrigin: '50% 100%' });
  gsap.set('#piles line', { scaleY: 0, transformOrigin: '50% 0%' });
  gsap.set(floors.map(f => f.g), { autoAlpha: 0, y: -26 });
  gsap.set('#scaffold', { scaleY: 0, transformOrigin: '50% 100%' });
  gsap.set('#fins rect', { scaleY: 0, transformOrigin: '50% 100%' });
  gsap.set('#villaFrame', { scaleY: 0, transformOrigin: '50% 100%' });
  gsap.set(palmEls, { scale: 0, transformOrigin: '50% 100%' });
  gsap.set('#crown', { y: 24 });
  gsap.set('#tape path', { scaleX: 0, transformOrigin: '0% 50%' });

  gsap.set('#birds', { x: 1120, y: 250 });
  const tl = gsap.timeline({ defaults: { ease: 'none' } });
  tl.addLabel('s0', 0);

  // --- 01 plot → 02 foundation
  tl.to('#scrollcue', { autoAlpha: 0, duration: .3 }, 0)
    .to(stages[0], { autoAlpha: 0, y: -40, duration: .6, ease: 'power1.in' }, 0)
    .to('#birds', { x: 1560, y: 80, opacity: 0, duration: 1.4 }, .1)
    .to('#tape path', { scaleX: 1, duration: .6, stagger: .15 }, .2)
    .to('#blueprint', { opacity: 1, duration: .4 }, .3)
    .to(drawPaths, { strokeDashoffset: 0, duration: 1.1, stagger: .12 }, .35)
    .to(['#skyDayR', '#skyDayDiv'], { opacity: 1, duration: 1.4 }, .8)
    .to('#sun', { x: 1330, y: 200, duration: 4 }, .8)
    .fromTo(stages[1], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out' }, .9)
    .to('#pit', { opacity: 1, duration: .4 }, 1.1)
    .to('#piles line', { scaleY: 1, duration: .3, stagger: .06 }, 1.3)
    .to('#foundation', { scaleY: 1, duration: .4 }, 1.9)
    .to(['#tape', '#plot text'], { opacity: 0, duration: .4 }, 2.2)
    .to('#crane > rect', { scaleY: 1, duration: .7 }, 1.8)
    .to('#craneTop', { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out' }, 2.45)
    .addLabel('s1', 2.3);

  // --- 03 structure
  tl.to(stages[1], { autoAlpha: 0, y: -40, duration: .4 }, 3.1)
    .fromTo(stages[2], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out' }, 3.4)
    .to('#scaffold', { opacity: 1, duration: .3 }, 3)
    .to('#scaffold', { scaleY: 1, duration: 3.15 }, 3);
  floors.forEach((f, i) => {
    const t = 3 + i * .19;
    const L = f.y - 25 - 196;
    tl.to('#hook', { y: L, duration: .16, ease: 'power1.inOut' }, t - .02)
      .to('#cable', { attr: { y2: L }, duration: .16, ease: 'power1.inOut' }, t - .02)
      .to('#trolley', { x: 800 + (i % 3) * 30, duration: .16 }, t - .02)
      .to(f.g, { autoAlpha: 1, y: 0, duration: .26, ease: 'power2.out' }, t);
  });
  tl.to('#villaFrame', { opacity: 1, scaleY: 1, duration: 1.2 }, 3.9)
    .addLabel('s2', 5.3);

  // --- 04 facade
  tl.to(stages[2], { autoAlpha: 0, y: -40, duration: .4 }, 5.9)
    .fromTo(stages[3], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out' }, 6.1)
    .to('#blueprint', { opacity: 0, duration: .5 }, 6.1)
    .to(glassPanels, { opacity: 1, duration: .35, stagger: .08 }, 6.2)
    .to('#fins', { opacity: 1, duration: .2 }, 6.4)
    .to('#fins rect', { scaleY: 1, duration: 1.1, stagger: .1 }, 6.4)
    .to('#crown', { opacity: 1, y: 0, duration: .5, ease: 'power2.out' }, 7.3)
    .to('#scaffold', { opacity: 0, duration: .6 }, 7.1)
    .to('#villaSkin', { opacity: 1, duration: .8 }, 6.6)
    .to('#villaFrame', { opacity: 0, duration: .5 }, 7.0)
    .to('#hook', { y: 20, duration: .5 }, 7.0)
    .to('#cable', { attr: { y2: 20 }, duration: .5 }, 7.0)
    .to('#craneTop', { autoAlpha: 0, y: -120, duration: .5 }, 7.5)
    .to('#crane > rect', { scaleY: 0, duration: .5 }, 7.7)
    .to(['#pit', '#piles', '#stakes'], { opacity: 0, duration: .4 }, 7.4)
    .addLabel('s3', 7.6);

  // --- 05 handover
  tl.to(stages[3], { autoAlpha: 0, y: -40, duration: .4 }, 8.0)
    .fromTo(stages[4], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power2.out' }, 8.3)
    .to(['#skyDuskR', '#skyDuskDiv'], { opacity: 1, duration: 1.2 }, 8.0)
    .to('#sun', { y: 760, opacity: 0, duration: 1.2 }, 8.0)
    .to('#dusk', { opacity: .5, duration: 1.2 }, 8.0)
    .to('#road', { opacity: 1, duration: .5 }, 8.1)
    .to(palmEls, { scale: 1, duration: .6, stagger: .1, ease: 'back.out(1.6)' }, 8.2)
    .to('#poolR', { opacity: 1, duration: .4 }, 8.4)
    .to('#stars', { opacity: 1, duration: .8 }, 8.8)
    .to('#skylineLights', { opacity: 1, duration: .6 }, 8.8)
    .to('#lampGlows', { opacity: 1, duration: .5 }, 8.9)
    .to(gsap.utils.shuffle(winLights.slice()), { opacity: 1, duration: .15, stagger: .012 }, 8.7)
    .to(crownLight, { opacity: 1, duration: .3 }, 9.2)
    .to('#bbSoon', { opacity: 0, duration: .25 }, 8.9)
    .to('#bbSold', { opacity: 1, duration: .25 }, 9.15)
    .to('#car', { opacity: 1, duration: .1 }, 9.0)
    .fromTo('#car', { x: 0 }, { x: 1700, duration: 1 }, 9.0)
    .addLabel('s4', 9.6)
    .to({}, { duration: .4 }, 9.6);

  // HUD
  const hudPct = $('#hudPct'), hudBar = $('#hudBar'), hudPaid = $('#hudPaid'), hudSteps = $$('#hudSteps li');
  let night = false, lastStep = -1;
  function hud(p) {
    hudPct.textContent = Math.round(p * 100) + '%';
    hudBar.style.width = p * 100 + '%';
    const step = p < .1 ? 0 : p < .3 ? 1 : p < .58 ? 2 : p < .8 ? 3 : 4;
    if (step !== lastStep) { hudSteps.forEach((li, i) => li.classList.toggle('is-on', i <= step)); lastStep = step; }
    let paid = 0;
    if (p >= .9) paid = 100;
    else if (p >= .8) paid = 60;
    else if (p >= .3) paid = 10 + Math.round(((p - .3) / .5) * 10) * 5;
    else if (p >= .12) paid = 10;
    hudPaid.textContent = paid + '%';
    const n = p > .82;
    if (n !== night) { build.classList.toggle('is-night', n); document.body.classList.toggle('scene-night', n); night = n; }
  }

  const isMobile = () => window.innerWidth < 700;
  buildST = ScrollTrigger.create({
    trigger: build,
    start: 'top top',
    end: () => '+=' + Math.round(window.innerHeight * (isMobile() ? 4 : 4.6)),
    pin: true,
    scrub: reduced ? true : 1,
    animation: tl,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    snap: reduced ? false : { snapTo: 'labelsDirectional', duration: { min: .35, max: 1 }, delay: .12, ease: 'power1.inOut' },
    onUpdate: self => hud(self.progress),
    onToggle: self => document.body.classList.toggle('scene-night', self.isActive && night),
  });
  hud(0);

  // skip link
  $('.skip').addEventListener('click', e => { e.preventDefault(); scrollTo('#trust'); });

  /* =======================================================
     INTRO
     ======================================================= */
  function intro() {
    const s0 = stages[0];
    gsap.from(s0.children, { y: 40, opacity: 0, duration: 1.1, stagger: .09, ease: 'power3.out', delay: .1, clearProps: 'transform,opacity' });
    gsap.from('.hdr', { y: -30, opacity: 0, duration: .9, ease: 'power3.out', clearProps: 'transform,opacity' });
    gsap.from('.hud', { x: 30, opacity: 0, duration: 1, delay: .4, ease: 'power3.out', clearProps: 'transform,opacity' });
    gsap.from('#sun', { scale: .6, opacity: 0, duration: 1.6, transformOrigin: '50% 50%', ease: 'power2.out' });
    gsap.from('#billboard', { y: 60, opacity: 0, duration: 1, delay: .5, ease: 'power3.out' });
    gsap.from('#stakes rect, #stakes path', { scaleY: 0, transformOrigin: '50% 100%', duration: .6, stagger: .05, delay: .6, ease: 'back.out(2)' });
  }

  initUI();

  /* =======================================================
     GENERAL UI
     ======================================================= */
  function initUI() {
    const G = hasGSAP;

    // header
    const hdr = $('#hdr'), mbar = $('#mbar');
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      hdr.classList.toggle('is-solid', y > 20);
      const buildEnd = buildST ? buildST.end : 0;
      hdr.classList.toggle('is-hidden', y > buildEnd + 300 && y > lastY && !document.body.classList.contains('menu-open'));
      mbar.classList.toggle('is-on', y > (G ? buildEnd - 40 : 260));
      lastY = y;
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // mobile menu
    const burger = $('#burger'), mnav = $('#mnav');
    const toggleMenu = open => {
      burger.classList.toggle('is-open', open); mnav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open); mnav.setAttribute('aria-hidden', !open);
      if (lenis) open ? lenis.stop() : lenis.start();
    };
    burger.addEventListener('click', () => toggleMenu(!mnav.classList.contains('is-open')));

    // anchor links
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2 || a.classList.contains('skip')) return;
      const t = $(id); if (!t) return;
      e.preventDefault();
      if (mnav.classList.contains('is-open')) toggleMenu(false);
      if (a.dataset.filter) { $('#fType').value = a.dataset.filter; applyFilters(true); }
      if (a.dataset.goal) preselectGoal(a.dataset.goal);
      if (G) scrollTo(t); else t.scrollIntoView({ behavior: 'smooth' });
    }));

    /* ---------- projects ---------- */
    const grid = $('#grid');
    grid.innerHTML = PROJECTS.map((p, i) => `
      <article class="card" data-i="${i}">
        <div class="card__img">
          <img src="${p.img}" alt="${p.name}, ${p.area}" loading="lazy">
          <div class="chips-top">
            ${p.status === 'offplan' ? '<span class="chip"><i></i>Off-plan</span>' : '<span class="chip chip--ready">Ready</span>'}
            ${p.featured ? '<span class="chip chip--gold">★ Featured</span>' : ''}
          </div>
          <span class="card__handover">${p.status === 'offplan' ? 'Payment plan available' : 'Move-in ready'}</span>
        </div>
        <div class="card__body">
          <p class="card__loc"><svg><use href="#i-pin"/></svg>${p.area}, Dubai</p>
          <h3>${p.name}</h3>
          <div class="card__row">
            <div class="card__price"><small>Starting from</small><b data-aed="${p.price}">${fmt(p.price)}</b></div>
            <span class="card__type"><svg><use href="#i-bed"/></svg>${p.type}</span>
          </div>
          <div class="card__cta">
            <button class="btn btn--dark" data-brochure="${i}">Get brochure &amp; plan</button>
            <a class="wa-mini" href="https://wa.me/97144227328?text=${encodeURIComponent('Hi Golden Oak, I am interested in ' + p.name + ' (' + p.area + ').')}" target="_blank" rel="noopener" aria-label="Ask about ${p.name} on WhatsApp"><svg><use href="#i-wa"/></svg></a>
          </div>
        </div>
      </article>`).join('');
    const cards = $$('.card', grid);

    // area select
    const fArea = $('#fArea');
    [...new Set(PROJECTS.map(p => p.area))].sort().forEach(a => fArea.insertAdjacentHTML('beforeend', `<option>${a}</option>`));

    let status = 'all', expanded = false;
    const showAll = $('#showAll');
    function applyFilters(fromUser) {
      const area = fArea.value, type = $('#fType').value, budget = $('#fBudget').value;
      const [bMin, bMax] = budget ? budget.split('-').map(Number) : [0, Infinity];
      const filtered = area || type || budget || status !== 'all';
      let n = 0, shown = 0;
      PROJECTS.forEach((p, i) => {
        const ok = (!area || p.area === area) && (!type || p.type === type) && p.price >= bMin && p.price <= bMax && (status === 'all' || p.status === status);
        if (ok) n++;
        const vis = ok && (filtered || expanded || shown < 6);
        if (vis) shown++;
        cards[i].classList.toggle('is-hidden', !vis);
      });
      $('#resCount').textContent = n;
      $('#empty').hidden = n > 0;
      showAll.parentElement.hidden = filtered || expanded || n <= 6;
      if (G) ScrollTrigger.refresh();
      if (fromUser && G) gsap.fromTo(cards.filter(c => !c.classList.contains('is-hidden')), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .06, ease: 'power3.out' });
    }
    [fArea, $('#fType'), $('#fBudget')].forEach(s => s.addEventListener('change', () => applyFilters(true)));
    $$('.finder__tabs button').forEach(b => b.addEventListener('click', () => {
      $$('.finder__tabs button').forEach(x => x.classList.toggle('is-on', x === b));
      status = b.dataset.status; applyFilters(true);
    }));
    $('#finder').addEventListener('submit', e => { e.preventDefault(); applyFilters(true); G ? scrollTo(grid) : grid.scrollIntoView(); });
    showAll.addEventListener('click', () => { expanded = true; applyFilters(true); });
    applyFilters(false);

    // currency
    $$('.cur button').forEach(b => b.addEventListener('click', () => {
      $$('.cur button').forEach(x => x.classList.toggle('is-on', x === b));
      currency = b.dataset.cur;
      $$('[data-aed]').forEach(n => n.textContent = fmt(+n.dataset.aed));
    }));

    // tilt
    if (fine && !reduced) cards.forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
      });
      c.addEventListener('mouseleave', () => c.style.transform = '');
    });

    /* ---------- modal ---------- */
    const modal = $('#modal');
    const openModal = i => {
      const p = PROJECTS[i];
      $('#mImg').src = p.img; $('#mImg').alt = p.name;
      $('#mArea').textContent = p.area + ', Dubai';
      $('#mTitle').textContent = p.name;
      $('#mPrice').textContent = 'From ' + fmt(p.price);
      $('#mForm').hidden = false; $('#mOk').hidden = true; $('#mForm').reset();
      modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
      if (lenis) lenis.stop();
      setTimeout(() => $('#mForm input').focus(), 300);
    };
    const closeModal = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); if (lenis) lenis.start(); };
    grid.addEventListener('click', e => { const b = e.target.closest('[data-brochure]'); if (b) openModal(+b.dataset.brochure); });
    $('#mClose').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); notes.classList.remove('is-open'); } });
    $('#mForm').addEventListener('submit', e => { e.preventDefault(); $('#mForm').hidden = true; $('#mOk').hidden = false; });

    /* ---------- calculator ---------- */
    const cProject = $('#cProject'), cPrice = $('#cPrice'), cDown = $('#cDown');
    cProject.innerHTML = PROJECTS.map((p, i) => `<option value="${i}">${p.name} · ${p.area}</option>`).join('') + '<option value="custom">Custom amount</option>';
    cProject.value = '7';
    const setFill = r => r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min)) * 100 + '%');
    function calc() {
      const price = +cPrice.value, d = +cDown.value;
      const book = price * d / 100, buildPart = price * (60 - d) / 100, hand = price * .4;
      $('#cPriceOut').textContent = fmt(price, 'AED');
      $('#cDownOut').textContent = d + '%';
      $('#oBook').textContent = fmt(book, 'AED');
      $('#oBuild').textContent = fmt(buildPart, 'AED');
      $('#oHand').textContent = fmt(hand, 'AED');
      $('#oDld').textContent = fmt(price * .04, 'AED');
      $('#sBook').style.flexBasis = d + '%';
      $('#sBuild').style.flexBasis = (60 - d) + '%';
      $('#sHand').style.flexBasis = '40%';
      const ok = price >= 2000000, visa = $('#visa');
      visa.classList.toggle('is-no', !ok);
      $('#visaTxt').textContent = ok ? 'Qualifies for the 10-year UAE Golden Visa (AED 2M+)' : `${fmt(2000000 - price, 'AED')} more reaches Golden Visa eligibility`;
      setFill(cPrice); setFill(cDown);
    }
    cProject.addEventListener('change', () => { if (cProject.value !== 'custom') cPrice.value = PROJECTS[+cProject.value].price; calc(); });
    cPrice.addEventListener('input', () => { cProject.value = 'custom'; calc(); });
    cDown.addEventListener('input', calc);
    $('#calcCta').addEventListener('click', () => {
      const v = cProject.value;
      $('#wzProject').value = v === 'custom' ? 'Budget around ' + fmt(+cPrice.value, 'AED') : PROJECTS[+v].name;
      preselectGoal('Buy off-plan');
    });
    calc();

    /* ---------- areas hover ---------- */
    const afloat = $('#afloat'), aImg = $('#afloatImg');
    if (fine && G) {
      const qx = gsap.quickTo(afloat, 'x', { duration: .6, ease: 'power3' });
      const qy = gsap.quickTo(afloat, 'y', { duration: .6, ease: 'power3' });
      $('#alist').addEventListener('mousemove', e => { qx(e.clientX + 200); qy(e.clientY); });
      $$('#alist li').forEach(li => {
        li.addEventListener('mouseenter', () => { aImg.src = li.dataset.img; gsap.to(afloat, { opacity: 1, scale: 1, duration: .5, ease: 'power3.out' }); });
        li.addEventListener('mouseleave', () => gsap.to(afloat, { opacity: 0, scale: .6, duration: .4 }));
      });
    }
    $$('#alist li').forEach(li => li.addEventListener('click', () => {
      const a = li.dataset.area;
      fArea.value = [...fArea.options].some(o => o.value === a) ? a : '';
      applyFilters(true);
      G ? scrollTo('#projects') : $('#projects').scrollIntoView();
    }));

    /* ---------- reviews ---------- */
    const revs = $$('.rev'); let ri = 0;
    const showRev = n => { ri = (n + revs.length) % revs.length; revs.forEach((r, i) => r.classList.toggle('is-on', i === ri)); };
    $('#revPrev').addEventListener('click', () => { showRev(ri - 1); resetRev(); });
    $('#revNext').addEventListener('click', () => { showRev(ri + 1); resetRev(); });
    let revT = setInterval(() => showRev(ri + 1), 6500);
    const resetRev = () => { clearInterval(revT); revT = setInterval(() => showRev(ri + 1), 6500); };

    /* ---------- wizard ---------- */
    const wz = $('#wizard'), steps = $$('.wz', wz);
    let step = 1; const data = {};
    $$('.chips', wz).forEach(group => group.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('button', group).forEach(x => x.classList.toggle('is-on', x === b));
      data[group.dataset.name] = b.dataset.v;
      $('#wzErr').textContent = '';
      if (step === 1) setTimeout(() => go(2), 280);
    }));
    function go(n) {
      step = n;
      steps.forEach(s => s.classList.toggle('is-on', +s.dataset.step === n));
      $('#wzNo').textContent = Math.min(n, 3);
      $('#wzBar').style.width = (n >= 4 ? 100 : n * 33.3) + '%';
      $('#wzBack').hidden = n === 1 || n === 4;
      $('#wzNext').innerHTML = n === 3 ? 'Send my request' : 'Continue <svg><use href="#i-arrow"/></svg>';
      if (n === 4) wz.classList.add('is-done');
    }
    function preselectGoal(goal) {
      const btn = $$('.chips[data-name="goal"] button', wz).find(b => b.dataset.v === goal || b.dataset.v.startsWith(goal));
      if (btn) { $$('.chips[data-name="goal"] button', wz).forEach(x => x.classList.toggle('is-on', x === btn)); data.goal = btn.dataset.v; go(2); }
    }
    window.__preselectGoal = preselectGoal;
    $('#wzBack').addEventListener('click', () => go(step - 1));
    $('#wzNext').addEventListener('click', () => {
      const err = $('#wzErr');
      if (step === 1 && !data.goal) return err.textContent = 'Please choose an option.';
      if (step === 2 && !data.budget) return err.textContent = 'Please choose a budget range.';
      if (step === 3) {
        const name = $('#wzName').value.trim(), phone = $('#wzPhone').value.replace(/\D/g, ''), email = $('#wzEmail').value.trim();
        if (name.length < 2) return err.textContent = 'Please enter your name.';
        if (phone.length < 7) return err.textContent = 'Please enter a valid phone number.';
        if (!/^\S+@\S+\.\S+$/.test(email)) return err.textContent = 'Please enter a valid email.';
        if (!$('#wzConsent').checked) return err.textContent = 'Please tick the consent box.';
        $('#doneName').textContent = name.split(' ')[0];
        err.textContent = '';
        return go(4);
      }
      err.textContent = ''; go(step + 1);
    });

    $('#news').addEventListener('submit', e => { e.preventDefault(); e.target.innerHTML = '<p style="margin:10px 16px;color:#e2c27d;font-weight:700">You\'re on the list ✓</p>'; });

    /* ---------- notes ---------- */
    const notes = $('#notes');
    $('#notesBtn').addEventListener('click', () => notes.classList.add('is-open'));
    $('#notesX').addEventListener('click', () => notes.classList.remove('is-open'));
    if (/notes=1/.test(location.search)) notes.classList.add('is-open');

    if (!G) return;

    /* ---------- reveals ---------- */
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%',
      once: true,
      onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, stagger: .1, ease: 'power3.out' }),
    });

    // counters
    $$('.count').forEach(c => {
      const to = +c.dataset.to, dec = +(c.dataset.dec || 0), o = { v: 0 };
      ScrollTrigger.create({ trigger: c, start: 'top 90%', once: true, onEnter: () =>
        gsap.to(o, { v: to, duration: 1.8, ease: 'power2.out', onUpdate: () => c.textContent = o.v.toFixed(dec) }) });
    });

    // steps line draw
    const sp = $('#stepsPath');
    if (sp) {
      gsap.set(sp, { strokeDasharray: 1000, strokeDashoffset: 1000 });
      gsap.to(sp, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 80%', end: 'bottom 60%', scrub: 1 } });
    }

    // parallax
    gsap.to('.visa-band__bg', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.visa-band', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.sell__img img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.sell', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.founder__arch img', { scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'center center', scrub: true } });
    gsap.from('.ftr__word', { yPercent: 40, opacity: 0, ease: 'power2.out', scrollTrigger: { trigger: '.ftr', start: 'top 80%', end: 'bottom bottom', scrub: 1 } });

    // magnetic buttons
    if (fine && !reduced) $$('.magnetic').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .3, duration: .4, ease: 'power3.out' });
      });
      b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' }));
    });

    addEventListener('load', () => ScrollTrigger.refresh());
  }
})();
