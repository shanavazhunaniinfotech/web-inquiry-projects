/* =========================================================
   SURECHECK · Version B "Clinical Light"
   One pinned scene: hero → product anatomy (window, legend,
   colloidal gold, use anywhere), then editorial sections.
   ========================================================= */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOTION = !!(window.gsap && window.ScrollTrigger) && !reduced;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  let lenis = null;

  /* ---------- manifesto words ---------- */
  const man = $('#manifesto');
  const KEY = ['20', 'years,', 'accurate', 'answer', 'right.'];
  man.innerHTML = man.textContent.trim().split(/\s+/).map(w => `<span class="w${KEY.includes(w) ? ' k' : ''}">${w}</span>`).join(' ');
  /* mask inner wrappers */
  $$('.mask').forEach(m => { if (!(m.children.length === 1 && m.firstElementChild.tagName === 'SPAN' && !m.firstElementChild.classList.length)) m.innerHTML = `<span>${m.innerHTML}</span>`; });

  /* ---------- gold particles (inside product space) ---------- */
  const gold = $('#gold');
  for (let k = 0; k < 36; k++) gold.appendChild(document.createElement('i'));
  const dots = $$('i', gold);

  function scrollToEl(el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 60;
    if (lenis) lenis.scrollTo(y, { duration: 1.6 }); else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }

  if (!MOTION) {
    root.classList.add('static');
    $('#loader') && $('#loader').remove();
    $$('[data-count]').forEach(el => (el.textContent = el.dataset.count));
  } else {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ toggleActions: 'play play none none' });
    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.09 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    /* ---------- loader + intro ---------- */
    const intro = gsap.timeline({ paused: true })
      .from('.hl > span', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.1 })
      .from('.stage', { y: 160, opacity: 0, rotate: 0, duration: 1.4, ease: 'expo.out' }, 0.1)
      .from('.hero__label, .hero__foot > *', { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07 }, 0.35)
      .from('.callout', { opacity: 0, y: 14, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.8)
      .from('.callout i', { scaleY: 0, transformOrigin: 'top', duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.8);
    const loader = $('#loader');
    const seen = (() => { try { return sessionStorage.getItem('sc2-intro'); } catch (e) { return 1; } })();
    if (seen || !loader) { loader && loader.remove(); intro.play(0.2); }
    else {
      try { sessionStorage.setItem('sc2-intro', '1'); } catch (e) {}
      lenis && lenis.stop();
      const o = { v: 0 };
      gsap.timeline({ onComplete: () => { loader.remove(); lenis && lenis.start(); } })
        .to(o, { v: 99, duration: 1.3, ease: 'power2.inOut', onUpdate: () => { $('#loadNum').textContent = String(Math.round(o.v)).padStart(2, '0'); } })
        .to('#loadBar', { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0)
        .to(loader, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '+=0.15')
        .add(() => intro.play(), '-=0.55');
    }

    /* ---------- the pinned story ---------- */
    const prod = $('#prod');
    const W = () => prod.offsetWidth;
    const chaps = $$('.chap');
    const mm = gsap.matchMedia();
    mm.add({ desk: '(min-width: 901px)', mob: '(max-width: 900px)' }, ctx => {
      const desk = ctx.conditions.desk;
      // product states for each chapter
      const S = desk ? {
        c1: { rotation: -90, scale: 1.55, x: () => innerWidth * 0.2, y: () => 0.08 * W() * 1.55 },
        c2: { rotation: -90, scale: 1.55, x: () => innerWidth * 0.2, y: () => -0.08 * W() * 1.55 },
        c3: { rotation: -90, scale: 0.6, x: () => innerWidth * 0.2, y: 0 },
        c4: { rotation: -26, scale: 0.72, x: () => innerWidth * 0.2, y: 0 }
      } : {
        c1: { rotation: 0, scale: 2.3, x: () => -0.09 * W() * 2.3, y: 0 },
        c2: { rotation: 0, scale: 2.3, x: () => 0.08 * W() * 2.3, y: 0 },
        c3: { rotation: 0, scale: 0.95, x: 0, y: 0 },
        c4: { rotation: -14, scale: 0.92, x: 0, y: 0 }
      };
      gsap.set(prod, { rotation: -6, scale: 1, x: 0, y: 0 });
      gsap.set(dots, { x: () => gsap.utils.random(-520, 520), y: () => gsap.utils.random(-260, 260), scale: () => gsap.utils.random(0.5, 1.8) });
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: '.story', pin: '.story__pin', start: 'top top', end: '+=460%', scrub: 0.8, invalidateOnRefresh: true,
          onUpdate: s => {
            const t = s.animation ? s.animation.time() : 0;
            $('#chapNum').textContent = '0' + (t < 1.95 ? 1 : t < 3.1 ? 2 : t < 4.3 ? 3 : 4);
            gsap.set('#chapBar', { scaleX: s.progress });
          }
        }
      });
      const inC = (el, at) => tl.fromTo(el, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }, at);
      const outC = (el, at) => tl.to(el, { autoAlpha: 0, y: -50, duration: 0.3, ease: 'power2.in' }, at);
      tl.to('.hl--1', { yPercent: -60, opacity: 0, duration: 0.6 }, 0)
        .to('.hl--2', { yPercent: 60, opacity: 0, duration: 0.6 }, 0)
        .to('.hero__label, .hero__foot', { opacity: 0, y: 30, duration: 0.4 }, 0)
        .to('.cos', { opacity: 0, duration: 0.25 }, 0)
        .to('.aura', { opacity: 0.45, duration: 1 }, 0)
        .to(prod, { ...S.c1, duration: 1 }, 0)
        .to('.chap-meter', { opacity: 1, duration: 0.3 }, 0.6);
      inC(chaps[0], 0.75);
      tl.to(prod, { '--c': 1, duration: 0.35 }, 1.05);
      outC(chaps[0], 1.6);
      tl.to(prod, { ...S.c2, duration: 0.8 }, 1.6);
      inC(chaps[1], 1.95);
      outC(chaps[1], 2.75);
      tl.to(prod, { ...S.c3, '--c': 0, duration: 0.8 }, 2.75)
        .to(dots, { opacity: 1, duration: 0.2, stagger: 0.004 }, 2.95)
        .to(dots, { x: () => gsap.utils.random(-1.5, 1.5), y: () => gsap.utils.random(-17, 17), scale: 1, duration: 0.7, ease: 'power3.inOut', stagger: { each: 0.008, from: 'random' } }, 3.0);
      inC(chaps[2], 3.1);
      tl.to(prod, { '--c': 1, duration: 0.2 }, 3.65)
        .to(dots, { opacity: 0, duration: 0.25 }, 3.75);
      outC(chaps[2], 4.0);
      tl.to(prod, { ...S.c4, duration: 0.8 }, 4.0);
      inC(chaps[3], 4.3);
      tl.to({}, { duration: 0.5 }, 4.65);
      return () => {};
    });

    /* ---------- reveals ---------- */
    $$('.mask > span').forEach(s => gsap.from(s, { yPercent: 110, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: s.parentElement, start: 'top 90%' } }));
    const rv = (sel, trig, opt = {}) => $$(sel).forEach((el, i) => gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', delay: (opt.stagger || 0) * i, scrollTrigger: { trigger: trig ? $(trig) : el, start: 'top 88%' } }));
    rv('.sec-head .lead, .compare__stage, .compare__info, .feat, .help, .final__sub, .news, .ftr__links');
    rv('.bento .b', '.bento', { stagger: 0.07 });
    rv('.q', '.stories__grid', { stagger: 0.1 });
    rv('.row', '.journal__list', { stagger: 0.05 });
    rv('.acc details', '.acc', { stagger: 0.06 });
    gsap.from('.bigwin', { scale: 0.85, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.bigwin', start: 'top 85%' } });
    gsap.from('.final__prod', { x: '-60vw', rotate: -30, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.final__prod', start: 'top 85%' } });

    /* manifesto word scrub */
    gsap.to('#manifesto .w', { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '#manifesto', start: 'top 80%', end: 'bottom 45%', scrub: true } });
    gsap.from('.stripes i', { scaleX: 0, ease: 'none', scrollTrigger: { trigger: '.stripes', start: 'top 95%', end: 'top 60%', scrub: true } });

    /* counters */
    $$('[data-count]').forEach(el => { const o = { v: 0 }; gsap.to(o, { v: +el.dataset.count, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' }, onUpdate: () => (el.textContent = Math.round(o.v)) }); });

    /* how-to: horizontal (desktop) */
    const ringArc = $('#ringArc'), ringTxt = $('#ringTxt');
    const setRing = f => { f = clamp(f); ringArc.style.strokeDashoffset = 326.7 * (1 - f); const s = Math.round(f * 180); ringTxt.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
    mm.add('(min-width: 901px)', () => {
      const track = $('#howTrack');
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const t = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.how', pin: '.how__pin', start: 'top top', end: () => '+=' + (dist() + innerHeight * 0.4), scrub: 0.6, invalidateOnRefresh: true, onUpdate: s => { gsap.set('#howBar', { scaleX: s.progress }); setRing((s.progress - 0.3) / 0.5); } } });
      return () => t.scrollTrigger && t.scrollTrigger.kill();
    });
    mm.add('(max-width: 900px)', () => {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const o = { f: 0 }; gsap.to(o, { f: 1, duration: 3, ease: 'none', onUpdate: () => setRing(o.f) }); io.disconnect(); } }), { threshold: 0.6 });
      io.observe($('.hcard--timer'));
      return () => io.disconnect();
    });

    /* campaign: expand to full bleed */
    gsap.timeline({ scrollTrigger: { trigger: '.campaign', pin: '.campaign__pin', start: 'top top', end: '+=130%', scrub: 0.6 } })
      .to('.campaign__media', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 1 })
      .to('.campaign__media img', { scale: 1, ease: 'power2.inOut', duration: 1 }, 0)
      .to('.campaign__copy', { opacity: 1, y: 0, duration: 0.35 }, 0.45)
      .from('.campaign__copy h2', { y: 60, duration: 0.35 }, 0.45);

    /* footer word slide */
    gsap.fromTo('.ftr__big span', { xPercent: 4 }, { xPercent: -22, ease: 'none', scrollTrigger: { trigger: '.ftr__big', start: 'top bottom', end: 'bottom top', scrub: true } });

    /* section indicator */
    $$('[data-name]').forEach((sec, i) => ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: s => { if (s.isActive) { $('#indNum').textContent = String(i + 1).padStart(2, '0'); $('#indName').textContent = sec.dataset.name; } } }));

    ScrollTrigger.sort(); ScrollTrigger.refresh();
    window.addEventListener('load', () => ScrollTrigger.refresh());
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());

    /* cursor + magnetic */
    if (fine) {
      const cur = $('#cursor'), txt = $('#cursorTxt');
      const pos = { x: innerWidth / 2, y: innerHeight / 2 }, rp = { ...pos };
      const dot = $('.cursor__dot'), ring = $('.cursor__ring');
      addEventListener('pointermove', e => { pos.x = e.clientX; pos.y = e.clientY; cur.classList.add('is-live'); }, { passive: true });
      document.addEventListener('pointerleave', () => cur.classList.remove('is-live'));
      gsap.ticker.add(() => {
        rp.x += (pos.x - rp.x) * 0.18; rp.y += (pos.y - rp.y) * 0.18;
        dot.style.transform = `translate(${pos.x}px,${pos.y}px)`; ring.style.transform = `translate(${rp.x}px,${rp.y}px)`;
      });
      document.addEventListener('pointerover', e => {
        const l = e.target.closest('[data-cursor]'); const h = e.target.closest('a,button,summary,input,select,label');
        cur.classList.toggle('is-label', !!l); cur.classList.toggle('is-hover', !l && !!h);
        txt.textContent = l ? l.dataset.cursor : '';
      });
      $$('.mag').forEach(m => {
        m.addEventListener('pointermove', e => { const r = m.getBoundingClientRect(); gsap.to(m, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.5, ease: 'power3.out' }); });
        m.addEventListener('pointerleave', () => gsap.to(m, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,.4)' }));
      });
    }
  }

  /* =========================================================
     INTERACTIONS
     ========================================================= */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) { e.preventDefault(); return; }
    const el = $(id); if (!el) return;
    e.preventDefault(); closeMenu(); scrollToEl(el);
  });

  /* header */
  const hdr = $('#hdr'), mbar = $('#mbar'); let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    hdr.classList.toggle('is-solid', y > 40);
    hdr.classList.toggle('is-hidden', y > 700 && y > lastY && !root.classList.contains('menu-open'));
    const past = $('.manifesto').getBoundingClientRect().top < innerHeight * 0.6;
    mbar.classList.toggle('is-on', past);
    $('#indicator').classList.toggle('is-on', past);
    lastY = y;
  }, { passive: true });

  /* language */
  const langBtn = $('#langBtn'), langMenu = $('#langMenu');
  langBtn.addEventListener('click', e => { e.stopPropagation(); langMenu.hidden = !langMenu.hidden; langBtn.setAttribute('aria-expanded', !langMenu.hidden); });
  document.addEventListener('click', () => { langMenu.hidden = true; langBtn.setAttribute('aria-expanded', 'false'); });

  /* mobile menu */
  const burger = $('#burger'), mnav = $('#mnav');
  function closeMenu() { if (mnav.hidden) return; mnav.hidden = true; burger.setAttribute('aria-expanded', 'false'); root.classList.remove('menu-open'); lenis && lenis.start(); }
  burger.addEventListener('click', () => {
    if (!mnav.hidden) return closeMenu();
    mnav.hidden = false; burger.setAttribute('aria-expanded', 'true'); root.classList.add('menu-open'); lenis && lenis.stop();
    window.gsap && gsap.from('.mnav nav a', { y: 40, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'expo.out' });
  });

  /* sliding ink for segmented controls */
  const moveInk = (wrap, btn) => { const ink = $('i[class$="__ink"]', wrap); if (!ink) return; ink.style.width = btn.offsetWidth + 'px'; ink.style.transform = `translateX(${btn.offsetLeft - 5}px)`; };

  /* test compare */
  const tog = $('.toggle');
  $$('button', tog).forEach(b => b.addEventListener('click', () => {
    const t = b.dataset.t;
    $$('button', tog).forEach(x => x.setAttribute('aria-selected', x === b));
    moveInk(tog, b);
    $$('.art').forEach(a => a.classList.toggle('is-on', a.classList.contains('art--' + t)));
    $$('.info').forEach(i => i.classList.toggle('is-on', i.dataset.info === t));
    $('#cmpCap').textContent = t === 'streamer' ? 'Fig. A: Surecheck Streamer, midstream test' : 'Fig. B: Surecheck Cassette, sample test';
  }));

  /* result reader */
  const RES = {
    pos: { c: 1, t: 1, tf: 1, h: 'Pregnant', p: 'Two lines, one in the test region (T) and one in the control region (C), mean you are pregnant. A visit to your doctor is a good next step.' },
    faint: { c: 1, t: 1, tf: 0.3, h: 'Still pregnant', p: 'A faint or pale line in the test region (T) still means you are pregnant. Colloidal Gold technology makes even low hCG levels visible.' },
    neg: { c: 1, t: 0, tf: 1, h: 'Not pregnant', p: 'Only the control line (C) appears, so you are not pregnant. If your period still hasn\'t started, test again after 48 hours.' },
    inv: { c: 0, t: 1, tf: 1, h: 'Invalid: test again', p: 'If no line appears in the control region (C), the test hasn\'t worked. Use a new test and follow the instructions carefully.' }
  };
  const seg = $('.seg'), win = $('#bigwin'); let picked = false;
  function setRes(k, user) {
    const r = RES[k];
    win.style.setProperty('--c', r.c); win.style.setProperty('--t', r.t); win.style.setProperty('--tf', r.tf);
    $('#vTitle').textContent = r.h; $('#vText').textContent = r.p;
    $$('button', seg).forEach(b => { b.setAttribute('aria-selected', b.dataset.res === k); if (b.dataset.res === k) moveInk(seg, b); });
    if (user) picked = true;
  }
  $$('button', seg).forEach(b => b.addEventListener('click', () => setRes(b.dataset.res, true)));
  seg.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const bs = $$('button', seg); const i = bs.findIndex(b => b.getAttribute('aria-selected') === 'true');
    const n = bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length]; n.focus(); n.click();
  });
  const initInks = () => { moveInk(tog, $('button[aria-selected=true]', tog)); moveInk(seg, $('button[aria-selected=true]', seg)); };
  setRes('pos'); initInks();
  addEventListener('resize', initInks); document.fonts && document.fonts.ready.then(initInks);
  if (!reduced) {
    const order = ['pos', 'faint', 'neg', 'inv']; let oi = 0, vis = false;
    new IntersectionObserver(es => es.forEach(e => (vis = e.isIntersecting)), { threshold: 0.5 }).observe($('#read'));
    setInterval(() => { if (vis && !picked) { oi = (oi + 1) % 4; setRes(order[oi]); } }, 3200);
  }

  /* calculator */
  const lmp = $('#lmp'), cycle = $('#cycle'), cycleOut = $('#cycleOut'), altRow = $('#altRow'), conc = $('#conc'), cycDots = $('#cycDots');
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d0 = new Date(today); d0.setDate(d0.getDate() - 20);
  lmp.value = iso(d0); lmp.max = iso(today); conc.max = iso(today);
  let irregular = false, resultDate = null;
  const paint = () => {
    const n = +cycle.value; cycleOut.textContent = n + ' days'; cycle.style.setProperty('--p', ((n - 21) / 12) * 100 + '%');
    const ov = n - 14;
    cycDots.innerHTML = Array.from({ length: n + 1 }, (_, d) => `<i class="${d < 5 ? 'per' : d === n ? 'tst' : (d >= ov - 4 && d <= ov + 1) ? 'ov' : ''}"></i>`).join('');
  };
  cycle.addEventListener('input', paint);
  $$('.cycle__b').forEach(b => b.addEventListener('click', () => { cycle.value = +cycle.value + +b.dataset.d; paint(); }));
  paint();
  $('#irregular').addEventListener('click', () => {
    irregular = !irregular; altRow.hidden = !irregular;
    $('#irregular').textContent = irregular ? 'Use my regular cycle instead' : 'My cycle is irregular / I don\'t know';
    $$('.cycle__b, #cycle').forEach(x => (x.disabled = irregular));
    [$('.cycle'), cycle, $('.cyc')].forEach(x => (x.style.opacity = irregular ? 0.3 : 1));
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
    $('#calcRes').hidden = false;
    window.ScrollTrigger && ScrollTrigger.refresh();
  });
  $('#ics').addEventListener('click', () => {
    if (!resultDate) return;
    const loc = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10).replace(/-/g, '');
    const n = new Date(resultDate); n.setDate(n.getDate() + 1);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Surecheck//When to test//EN', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@surecheck', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART;VALUE=DATE:' + loc(resultDate), 'DTEND;VALUE=DATE:' + loc(n), 'SUMMARY:Surecheck test day', 'DESCRIPTION:You can test with Surecheck from today, at any time of day. Read your result within 3-10 minutes.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'surecheck-test-day.ics'; document.body.appendChild(a); a.click(); a.remove();
  });

  /* journal filters + hover peek */
  $$('.f').forEach(b => b.addEventListener('click', () => {
    $$('.f').forEach(x => x.classList.toggle('is-on', x === b));
    $$('#jlist [data-cat]').forEach(p => p.classList.toggle('is-out', b.dataset.cat !== 'all' && p.dataset.cat !== b.dataset.cat));
    window.ScrollTrigger && ScrollTrigger.refresh();
  }));
  const peek = $('#peek'), pimg = $('img', peek);
  if (fine) {
    let px = 0, py = 0, tx = 0, ty = 0, raf = null;
    const loop = () => { px += (tx - px) * 0.15; py += (ty - py) * 0.15; peek.style.left = px + 'px'; peek.style.top = py + 'px'; raf = requestAnimationFrame(loop); };
    $$('.row').forEach(r => {
      r.addEventListener('pointerenter', e => { pimg.src = r.dataset.img; tx = px = e.clientX + 24; ty = py = e.clientY - 100; peek.classList.add('is-on'); if (!raf) loop(); });
      r.addEventListener('pointermove', e => { tx = e.clientX + 24; ty = e.clientY - 100; });
      r.addEventListener('pointerleave', () => { peek.classList.remove('is-on'); cancelAnimationFrame(raf); raf = null; });
    });
  }

  /* FAQ */
  $$('#acc details').forEach(d => d.addEventListener('toggle', () => {
    if (d.open) $$('#acc details').forEach(o => o !== d && (o.open = false));
    window.ScrollTrigger && setTimeout(() => ScrollTrigger.refresh(), 60);
  }));

  /* drawer */
  const drawer = $('#drawer'), shops = $('#shops'), country = $('#country');
  const SHOPS = { bg: ['Online pharmacy', 'Drugstore chain', 'Marketplace', 'Pharmacy chain'], ro: ['Online pharmacy', 'Pharmacy chain', 'Drugstore chain', 'Marketplace'], mk: ['Pharmacy chain', 'Online pharmacy'], al: ['Pharmacy chain', 'Online pharmacy'], other: ['Distributor enquiry', 'International marketplace'] };
  const renderShops = () => { shops.innerHTML = SHOPS[country.value].map(n => `<a class="shop" href="#" onclick="return false"><span class="shop__logo">RETAILER LOGO</span><b>${n}</b><span>Shop now →</span></a>`).join(''); };
  country.addEventListener('change', renderShops); renderShops();
  let lastFocus = null;
  const openDrawer = p => { lastFocus = document.activeElement; $('#drProduct').textContent = p || ''; drawer.hidden = false; requestAnimationFrame(() => drawer.classList.add('is-open')); lenis && lenis.stop(); closeMenu(); setTimeout(() => $('.drawer__x').focus(), 80); };
  const closeDrawer = () => { drawer.classList.remove('is-open'); lenis && lenis.start(); setTimeout(() => { drawer.hidden = true; lastFocus && lastFocus.focus(); }, 600); };
  document.addEventListener('click', e => { const b = e.target.closest('.js-buy'); if (b) { e.preventDefault(); openDrawer(b.dataset.product); } });
  $$('[data-close]', drawer).forEach(x => x.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!drawer.hidden) closeDrawer(); else closeMenu(); } });
  drawer.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = $$('button, a, select, input', $('.drawer__panel')).filter(x => x.offsetParent);
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  /* newsletter */
  $('#news').addEventListener('submit', e => {
    e.preventDefault();
    const em = $('#email'), ok = $('#consent'), msg = $('#newsMsg');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) { msg.textContent = 'Please enter a valid email address.'; em.focus(); return; }
    if (!ok.checked) { msg.textContent = 'Please accept the Privacy Policy to subscribe.'; ok.focus(); return; }
    msg.textContent = 'You\'re in! Check your inbox to confirm.'; e.target.reset();
  });
})();
