/* =========================================================
   SURECHECK · "The Line" homepage concept
   - Lenis smooth scroll + GSAP ScrollTrigger
   - One product (the Streamer) flies between anchors in every section
   - Background colour morphs so the page reads as one continuous story
   ========================================================= */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const mqMobile = matchMedia('(max-width: 900px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const MOTION = hasGsap && !reduced;
  const flyer = $('#flyer');

  /* ---------- shared: product result lines ---------- */
  const lineTargets = () => [flyer, $('.anchor--read')].filter(Boolean);
  const readerState = { c: 1, t: 1, tf: 1 };

  /* ---------- static fallback (reduced motion / no CDN) ---------- */
  function buildStatic() {
    root.classList.add('static');
    const intro = $('#intro'); if (intro) intro.remove();
    flyer.style.display = 'none';
    $$('[data-fly]').forEach(a => {
      if (a.dataset.op === '0') return;
      const rot = a.dataset.rotStatic || a.dataset.rot || 0;
      a.innerHTML = `<svg viewBox="0 0 1000 150" style="transform:rotate(${Math.max(-30, Math.min(30, rot))}deg)"><use href="#sc-streamer"/></svg>`;
    });
    $$('.particles').forEach(buildParticles);
    $$('[data-count]').forEach(el => (el.textContent = el.dataset.count));
  }

  /* ---------- particles (colloidal gold forming the line) ---------- */
  function buildParticles(box) {
    box.innerHTML = '<span class="bar"></span>';
    const n = 34;
    for (let k = 0; k < n; k++) {
      const i = document.createElement('i');
      i.style.left = ((k + 0.5) / n) * 100 + '%';
      i.style.top = 'calc(50% - 5px)';
      box.appendChild(i);
    }
  }

  /* =========================================================
     MOTION BUILD
     ========================================================= */
  let lenis = null;
  function scrollToTarget(el) {
    const y = el.getBoundingClientRect().top + window.scrollY - (mqMobile.matches ? 70 : 90);
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }

  if (!MOTION) buildStatic();
  else {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ toggleActions: 'play play none none' }); // also play if the visitor jumps past (nav links)

    /* Lenis smooth scroll */
    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    /* ---- Intro: the control line draws itself, once per session ---- */
    const intro = $('#intro');
    const seen = (() => { try { return sessionStorage.getItem('sc-intro'); } catch (e) { return 1; } })();
    const introState = { k: 0 };   // 0 = product hidden below, 1 = in place
    const heroIn = gsap.timeline({ paused: true })
      .from('.hero__title .w', { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.08 })
      .from('.hero .eyebrow, .hero__sub, .hero__ctas, .trust', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07 }, 0.15)
      .from('.hero__stripe', { scaleY: 0, transformOrigin: 'top', duration: 1.1, ease: 'expo.inOut' }, 0)
      .from('.badge', { scale: 0, rotate: -90, duration: 0.9, ease: 'back.out(1.6)' }, 0.5)
      .to(introState, { k: 1, duration: 1.4, ease: 'expo.out' }, 0.05);

    if (seen || !intro) {
      intro && intro.remove();
      heroIn.play(0.25);
    } else {
      try { sessionStorage.setItem('sc-intro', '1'); } catch (e) {}
      lenis && lenis.stop();
      gsap.timeline({ onComplete: () => { intro.remove(); lenis && lenis.start(); } })
        .to('.intro__line', { scaleY: 1, duration: 0.7, ease: 'expo.inOut' })
        .to('.intro__logo', { opacity: 1, duration: 0.35 }, '-=0.2')
        .to('.intro__line', { scaleX: 60, duration: 0.6, ease: 'expo.in' }, '+=0.25')
        .to(intro, { opacity: 0, duration: 0.45, ease: 'power2.out' })
        .add(() => heroIn.play(), '-=0.45');
    }

    /* ---- Background colour morph: sections hand over to each other ---- */
    const bg = $('#bgLayer');
    $$('[data-bg]').forEach(sec => {
      ScrollTrigger.create({
        trigger: sec, start: 'top 55%', end: 'bottom 55%',
        onToggle: s => { if (s.isActive) gsap.to(bg, { backgroundColor: sec.dataset.bg, duration: 0.8, ease: 'power2.out', overwrite: true }); }
      });
    });

    /* ---- Story line (brand stripe = control line) fills with progress ---- */
    gsap.to('#storyLine', { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    /* ---- Reveals ---- */
    $$('.reveal').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));
    gsap.utils.toArray('.pcard').forEach((c, i) => gsap.from(c, { y: 80, opacity: 0, duration: 1.1, delay: i * 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.tests__grid', start: 'top 85%' } }));
    gsap.from('.quote', { y: 60, opacity: 0, stagger: 0.12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.stories', start: 'top 85%' } });
    gsap.from('.post', { x: 120, opacity: 0, stagger: 0.06, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.rail', start: 'top 85%' } });
    gsap.from('.acc details', { y: 30, opacity: 0, stagger: 0.07, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.acc', start: 'top 85%' } });
    gsap.from('.calc', { y: 80, rotate: 2, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.calc', start: 'top 88%' } });

    /* ---- Statement: kinetic type rows slide against each other ---- */
    gsap.fromTo('.big-row.r1', { xPercent: 8 }, { xPercent: -28, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.big-row.r2', { xPercent: -30 }, { xPercent: 4, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top bottom', end: 'bottom top', scrub: true } });

    /* ---- Campaign image parallax + stripe wipe ---- */
    gsap.fromTo('.campaign__img img', { scale: 1.25 }, { scale: 1.02, ease: 'none', scrollTrigger: { trigger: '.campaign__img', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.campaign__img', { clipPath: 'inset(0 0 100% 0 round 28px)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.campaign__img', start: 'top 80%' } });

    /* ---- Colloidal gold: particles converge into one line ---- */
    const pbox = $('#particles');
    buildParticles(pbox);
    const dots = $$('i', pbox);
    dots.forEach(d => gsap.set(d, { x: gsap.utils.random(-200, 200), y: gsap.utils.random(-140, 140), scale: gsap.utils.random(0.4, 1.6) }));
    gsap.to(dots, { x: 0, y: 0, scale: 1, ease: 'power2.inOut', stagger: { each: 0.01, from: 'random' }, scrollTrigger: { trigger: pbox, start: 'top 95%', end: 'top 35%', scrub: 0.6 } });
    gsap.from('.particles .bar', { scaleX: 0, transformOrigin: 'left', ease: 'none', scrollTrigger: { trigger: pbox, start: 'top 70%', end: 'top 35%', scrub: true } });

    /* ---- Counters ---- */
    $$('[data-count]').forEach(el => {
      const o = { v: 0 };
      gsap.to(o, { v: +el.dataset.count, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => (el.textContent = Math.round(o.v)) });
    });

    /* ---- HOW TO USE: pinned 3-step story (desktop) / per-step triggers (mobile) ---- */
    const steps = $$('.step');
    const howState = { p: 0, c: 0, tilt: 0 };
    const timerTxt = $('#timerTxt');
    const setStep = idx => steps.forEach((s, k) => s.classList.toggle('is-on', k === idx));
    const setTimer = f => { const sec = Math.round(Math.max(0, Math.min(1, f)) * 180); timerTxt.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); };
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
      root.classList.add('pinned');
      const st = ScrollTrigger.create({
        trigger: '.how', pin: '.how__pin', start: 'top top', end: '+=230%', scrub: true, refreshPriority: 10,
        onUpdate: s => {
          const p = s.progress; howState.p = p;
          setStep(p < 0.3 ? 0 : p < 0.6 ? 1 : 2);
          gsap.set('#howBar', { scaleX: p });
          const f = (p - 0.6) / 0.35; setTimer(f);
          howState.c = Math.max(0, Math.min(1, (f - 0.35) / 0.3));
          howState.tilt = p < 0.3 ? 0 : p < 0.6 ? Math.sin(((p - 0.3) / 0.3) * Math.PI) * 18 : 0;
        }
      });
      return () => { root.classList.remove('pinned'); st.kill(); };
    });
    mm.add('(max-width: 900px)', () => {
      const ts = steps.map((s, k) => ScrollTrigger.create({ trigger: s, start: 'top 70%', end: 'bottom 30%', onToggle: e => e.isActive && setStep(k) }));
      const t3 = ScrollTrigger.create({ trigger: steps[2], start: 'top 75%', end: 'bottom top', onUpdate: s => { const f = Math.min(1, s.progress * 2.2); setTimer(f); howState.c = f > .6 ? 1 : 0; gsap.set('#howBar', { scaleX: f }); } });
      return () => { ts.forEach(t => t.kill()); t3.kill(); };
    });

    /* =========================================================
       THE FLIGHT: one product travels through the whole page
       ========================================================= */
    const anchors = $$('[data-fly]');
    anchors.forEach(a => {
      const k = [...a.classList].find(c => c.startsWith('anchor--'));
      a.dataset.key = k ? k.replace('anchor--', '') : '';
    });
    const W = 1000;
    const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
    const ease = t => t * t * (3 - 2 * t);
    const lerp = (a, b, t) => a + (b - a) * t;
    let mx = 0, my = 0, smx = 0, smy = 0;
    window.addEventListener('pointermove', e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });

    function stateOf(a) {
      const r = a.getBoundingClientRect();
      if (!r.width) return null;
      const mobile = mqMobile.matches;
      let rot = +(mobile && a.dataset.key === 'how' && !root.classList.contains('pinned') ? -12 : (mobile && a.dataset.rotM) || a.dataset.rot || 0);
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, s: r.width / W, rot, op: a.dataset.op === undefined ? 1 : +a.dataset.op, key: a.dataset.key };
    }

    function render(time) {
      const vh = innerHeight, mid = vh * 0.5;
      const st = anchors.map(stateOf).filter(Boolean);
      if (!st.length) return;
      let i = -1;
      for (let k = 0; k < st.length; k++) if (st[k].y <= mid) i = k;
      let A, B, p;
      if (i < 0) { A = B = st[0]; p = 0; }
      else if (i >= st.length - 1) { A = B = st[st.length - 1]; p = 0; }
      else { A = st[i]; B = st[i + 1]; p = ease(clamp(((mid - A.y) / (B.y - A.y) - 0.12) / 0.76)); }

      let x = lerp(A.x, B.x, p), y = lerp(A.y, B.y, p), s = lerp(A.s, B.s, p);
      let rot = lerp(A.rot, B.rot, p), op = lerp(A.op, B.op, p);
      // hops to/from hidden "ghost" anchors: fade out early, fade in late (never hovers over content half-visible)
      if (A !== B && (A.op === 0 || B.op === 0)) op = A.op * (1 - ease(clamp(p / 0.35))) + B.op * ease(clamp((p - 0.65) / 0.35));
      // travelling spin: a little extra turn mid-flight makes it feel alive
      rot += Math.sin(p * Math.PI) * 24;
      // small screens: long hops fade through instead of crossing reading content
      if (mqMobile.matches && A !== B && Math.abs(B.y - A.y) > vh * 1.1) {
        op *= 1 - ease(clamp((p - 0.04) / 0.22)) * ease(clamp((0.96 - p) / 0.22));
      }

      const near = p < 0.5 ? A : B;
      const t = time || 0;
      // idle float
      y += Math.sin(t * 1.3) * 7 * Math.max(s, 0.35);
      rot += Math.sin(t * 0.9) * 1.2;
      // hero parallax
      smx += (mx - smx) * 0.06; smy += (my - smy) * 0.06;
      if (near.key === 'hero') { x += smx * 40; y += smy * 30; rot += smx * 6; }
      if (near.key === 'how') rot += howState.tilt;
      // intro entrance
      const k = introState.k;
      y += (1 - k) * vh * 0.7; rot += (1 - k) * 50; op *= k;

      flyer.style.transform = `translate(${x - W / 2}px, ${y - 75}px) rotate(${rot}deg) scale(${s})`;
      flyer.style.opacity = op.toFixed(3);

      // result lines on the flying product depend on where it is
      let c = 0, tt = 0, tf = 1;
      if (near.key === 'how') { c = howState.c; }
      else if (near.key === 'read') { c = readerState.c; tt = readerState.t; tf = readerState.tf; }
      flyer.style.setProperty('--c', c.toFixed(2));
      flyer.style.setProperty('--t', (tt * tf).toFixed(2));
    }
    gsap.ticker.add(render);

    ScrollTrigger.sort(); ScrollTrigger.refresh();
    window.addEventListener('load', () => ScrollTrigger.refresh());
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* =========================================================
     INTERACTIONS (work with or without motion)
     ========================================================= */

  /* anchor links */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) { e.preventDefault(); return; }
    const el = $(id);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(el);
  });

  /* header: dropdowns, hide on scroll down */
  $$('.dd').forEach(dd => {
    const b = $('.dd__btn', dd);
    b.addEventListener('click', e => {
      e.stopPropagation();
      const open = !dd.classList.contains('is-open');
      $$('.dd').forEach(d => { d.classList.remove('is-open'); $('.dd__btn', d).setAttribute('aria-expanded', 'false'); });
      dd.classList.toggle('is-open', open); b.setAttribute('aria-expanded', open);
    });
  });
  document.addEventListener('click', () => $$('.dd').forEach(d => { d.classList.remove('is-open'); $('.dd__btn', d).setAttribute('aria-expanded', 'false'); }));
  const hdr = $('#hdr'), mbar = $('#mbar');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    hdr.classList.toggle('is-hidden', y > 400 && y > lastY && !root.classList.contains('menu-open'));
    mbar.classList.toggle('is-on', y > innerHeight * 0.7);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* mobile menu */
  const burger = $('#burger'), mnav = $('#mnav');
  function closeMenu() {
    if (!mnav || mnav.hidden) return;
    mnav.hidden = true; burger.setAttribute('aria-expanded', 'false'); root.classList.remove('menu-open');
    lenis && lenis.start();
  }
  burger.addEventListener('click', () => {
    const open = mnav.hidden;
    if (!open) return closeMenu();
    mnav.hidden = false; burger.setAttribute('aria-expanded', 'true'); root.classList.add('menu-open');
    lenis && lenis.stop();
    window.gsap && gsap.from('.mnav nav a', { y: 30, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'expo.out' });
  });

  /* test picker */
  $$('[data-pick]').forEach(b => b.addEventListener('click', () => {
    $$('[data-pick]').forEach(x => x.classList.toggle('is-on', x === b));
    $$('[data-card]').forEach(c => c.classList.toggle('is-pick', c.dataset.card === b.dataset.pick));
  }));

  /* result reader */
  const RES = {
    pos: { c: 1, t: 1, tf: 1, h: 'Pregnant', p: 'Two lines, one in the test region (T) and one in the control region (C), mean you are pregnant. A visit to your doctor is a good next step.' },
    faint: { c: 1, t: 1, tf: 0.3, h: 'Still pregnant', p: 'A faint or pale line in the test region (T) still means you are pregnant. Colloidal Gold technology makes even low hCG levels visible.' },
    neg: { c: 1, t: 0, tf: 1, h: 'Not pregnant', p: 'Only the control line (C) appears, so you are not pregnant. If your period still hasn\'t started, test again after 48 hours.' },
    inv: { c: 0, t: 1, tf: 1, h: 'Invalid: test again', p: 'If no line appears in the control region (C), the test hasn\'t worked. Use a new test and follow the instructions carefully.' }
  };
  const zoom = $('#zoom');
  let userPicked = false;
  function setResult(key, fromUser) {
    const r = RES[key];
    Object.assign(readerState, { c: r.c, t: r.t, tf: r.tf });
    zoom.style.setProperty('--c', r.c); zoom.style.setProperty('--t', r.t); zoom.style.setProperty('--tf', r.tf);
    const ra = $('.anchor--read'); if (ra) { ra.style.setProperty('--c', r.c); ra.style.setProperty('--t', r.t * r.tf); }
    $('#vTitle').textContent = r.h; $('#vText').textContent = r.p;
    $$('.seg button').forEach(b => b.setAttribute('aria-selected', b.dataset.res === key));
    if (fromUser) userPicked = true;
  }
  $$('.seg button').forEach(b => b.addEventListener('click', () => setResult(b.dataset.res, true)));
  $('.seg').addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const bs = $$('.seg button'); const i = bs.findIndex(b => b.getAttribute('aria-selected') === 'true');
    const n = bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length]; n.focus(); n.click();
  });
  setResult('pos');
  // gentle auto-demo until the visitor interacts
  if (!reduced) {
    const order = ['pos', 'faint', 'neg', 'inv']; let oi = 0, inView = false;
    new IntersectionObserver(es => es.forEach(e => (inView = e.isIntersecting)), { threshold: 0.4 }).observe($('#read'));
    setInterval(() => { if (inView && !userPicked) { oi = (oi + 1) % order.length; setResult(order[oi]); } }, 3200);
  }

  /* when-to-test calculator */
  const lmp = $('#lmp'), cycle = $('#cycle'), cycleOut = $('#cycleOut'), altRow = $('#altRow'), conc = $('#conc');
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d0 = new Date(today); d0.setDate(d0.getDate() - 20);
  lmp.value = iso(d0); lmp.max = iso(today); conc.max = iso(today);
  let irregular = false, resultDate = null;
  const cycDots = $('#cycDots');
  const paintRange = () => {
    const n = +cycle.value;
    cycleOut.textContent = n + ' days'; cycle.style.setProperty('--p', ((n - 21) / 12) * 100 + '%');
    if (cycDots) { // ovulation ≈ 14 days before the next period
      const ov = n - 14;
      cycDots.innerHTML = Array.from({ length: n + 1 }, (_, d) => `<i class="${d < 5 ? 'per' : d === n ? 'tst' : (d >= ov - 4 && d <= ov + 1) ? 'ov' : ''}"></i>`).join('');
    }
  };
  cycle.addEventListener('input', paintRange);
  $$('.cycle__b').forEach(b => b.addEventListener('click', () => { cycle.value = +cycle.value + +b.dataset.d; paintRange(); }));
  paintRange();
  $('#irregular').addEventListener('click', () => {
    irregular = !irregular; altRow.hidden = !irregular;
    $('#irregular').textContent = irregular ? 'Use my regular cycle instead' : 'My cycle is irregular / I don\'t know';
    $$('.cycle__b, #cycle').forEach(x => (x.disabled = irregular));
    $('.cycle').style.opacity = cycle.style.opacity = irregular ? 0.35 : 1;
    window.ScrollTrigger && ScrollTrigger.refresh();
  });
  $('#calc').addEventListener('submit', e => {
    e.preventDefault();
    const err = $('#calcErr'); err.hidden = true;
    let base, add;
    if (irregular) { if (!conc.value) { err.textContent = 'Please choose the date you think you may have conceived.'; err.hidden = false; return; } base = new Date(conc.value + 'T00:00'); add = 19; }
    else { if (!lmp.value) { err.textContent = 'Please choose the first day of your last period.'; err.hidden = false; return; } base = new Date(lmp.value + 'T00:00'); add = +cycle.value; }
    if (base > today) { err.textContent = 'That date is in the future. Please check it.'; err.hidden = false; return; }
    const d = new Date(base); d.setDate(d.getDate() + add); resultDate = d;
    const diff = Math.round((d - today) / 864e5);
    $('#calcDate').textContent = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    $('#calcIn').textContent = diff > 0 ? `That's in ${diff} day${diff === 1 ? '' : 's'}. Any time of day works.` : 'You can test today, at any time of day.';
    $('#ics').hidden = diff <= 0;
    const res = $('#calcRes'); res.hidden = false;
    window.ScrollTrigger && ScrollTrigger.refresh();
  });
  $('#ics').addEventListener('click', () => {
    if (!resultDate) return;
    const f = d => d.toISOString().slice(0, 10).replace(/-/g, '');
    const n = new Date(resultDate); n.setDate(n.getDate() + 1);
    const local = new Date(resultDate.getTime() - resultDate.getTimezoneOffset() * 6e4);
    const nl = new Date(n.getTime() - n.getTimezoneOffset() * 6e4);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Surecheck//When to test//EN', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@surecheck', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART;VALUE=DATE:' + f(local), 'DTEND;VALUE=DATE:' + f(nl), 'SUMMARY:Surecheck test day', 'DESCRIPTION:You can test with Surecheck from today, at any time of day. Read your result within 3-10 minutes.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'surecheck-test-day.ics'; document.body.appendChild(a); a.click(); a.remove();
  });

  /* where-to-buy drawer */
  const drawer = $('#drawer'), shops = $('#shops'), country = $('#country');
  const SHOPS = {
    bg: ['Online pharmacy', 'Drugstore chain', 'Marketplace', 'Pharmacy chain'],
    ro: ['Online pharmacy', 'Pharmacy chain', 'Drugstore chain', 'Marketplace'],
    mk: ['Pharmacy chain', 'Online pharmacy'],
    al: ['Pharmacy chain', 'Online pharmacy'],
    other: ['Distributor enquiry', 'International marketplace']
  };
  const renderShops = () => { shops.innerHTML = SHOPS[country.value].map(n => `<a class="shop" href="where-to-buy/"><span class="shop__logo">RETAILER LOGO</span><b>${n}</b><span>Shop now →</span></a>`).join(''); };
  country.addEventListener('change', renderShops); renderShops();
  let lastFocus = null;
  function openDrawer(product) {
    lastFocus = document.activeElement;
    $('#drProduct').textContent = product ? product : '';
    drawer.hidden = false; requestAnimationFrame(() => drawer.classList.add('is-open'));
    lenis && lenis.stop(); closeMenu();
    setTimeout(() => $('.drawer__x').focus(), 60);
  }
  function closeDrawer() {
    drawer.classList.remove('is-open'); lenis && lenis.start();
    setTimeout(() => { drawer.hidden = true; lastFocus && lastFocus.focus(); }, 450);
  }
  document.addEventListener('click', e => { const b = e.target.closest('.js-buy'); if (b) { e.preventDefault(); openDrawer(b.dataset.product); } });
  $$('[data-close]', drawer).forEach(x => x.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!drawer.hidden) closeDrawer(); else closeMenu();
  });
  drawer.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = $$('button, a, select, input', $('.drawer__panel')).filter(x => !x.disabled && x.offsetParent);
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  /* blog filters + rail */
  const rail = $('#rail');
  $$('[data-cat]').filter(b => b.tagName === 'BUTTON').forEach(b => b.addEventListener('click', () => {
    $$('.cats .chip').forEach(x => x.classList.toggle('is-on', x === b));
    $$('.post[data-cat]').forEach(p => p.classList.toggle('is-out', b.dataset.cat !== 'all' && p.dataset.cat !== b.dataset.cat));
    rail.scrollTo({ left: 0, behavior: 'smooth' });
  }));
  $$('.rbtn').forEach(b => b.addEventListener('click', () => rail.scrollBy({ left: +b.dataset.dir * (rail.querySelector('.post').offsetWidth + 20), behavior: 'smooth' })));
  let drag = null;
  rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; drag = { x: e.clientX, l: rail.scrollLeft, moved: false }; });
  window.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 5) { drag.moved = true; rail.classList.add('is-drag'); } rail.scrollLeft = drag.l - dx; });
  window.addEventListener('pointerup', () => { if (drag && drag.moved) { rail.addEventListener('click', ev => ev.preventDefault(), { once: true, capture: true }); } drag = null; rail.classList.remove('is-drag'); });
  rail.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.stopPropagation(); }, { passive: true });

  /* FAQ: one open at a time */
  $$('#acc details').forEach(d => d.addEventListener('toggle', () => {
    if (d.open) $$('#acc details').forEach(o => o !== d && (o.open = false));
    window.ScrollTrigger && setTimeout(() => ScrollTrigger.refresh(), 50);
  }));

  /* newsletter */
  $('#news').addEventListener('submit', e => {
    e.preventDefault();
    const em = $('#email'), ok = $('#consent'), msg = $('#newsMsg');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) { msg.textContent = 'Please enter a valid email address.'; em.focus(); return; }
    if (!ok.checked) { msg.textContent = 'Please accept the Privacy Policy to subscribe.'; ok.focus(); return; }
    msg.textContent = 'You\'re in! Check your inbox to confirm.'; e.target.reset();
  });
})();
