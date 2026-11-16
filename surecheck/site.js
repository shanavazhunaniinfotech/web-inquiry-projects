/* =========================================================
   SURECHECK · Concept A "The Line" · inner pages
   Shared behaviour + page modules (each guarded by presence)
   ========================================================= */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOTION = !!(window.gsap && window.ScrollTrigger) && !reduced;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const mobile = () => matchMedia('(max-width: 900px)').matches;
  let lenis = null;
  const refresh = () => window.ScrollTrigger && ScrollTrigger.refresh();

  const ICON_CHECK = '<svg><use href="#i-check"/></svg>';

  /* =============== motion =============== */
  if (!MOTION) {
    root.classList.add('static');
    $$('[data-count]').forEach(el => (el.textContent = el.dataset.count));
  } else {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ toggleActions: 'play play none none' });
    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    /* page hero entrance + product scroll */
    gsap.from('.phero__title .ln > span, .ahero h1', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.1 });
    gsap.from('.phero .crumbs, .phero .kicker, .phero .lead, .phero__ctas, .phero .trust, .phero .fsearch, .ahero .ameta, .ahero .crumbs', { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06, delay: 0.25 });
    gsap.from('.phero__stripe', { scaleY: 0, transformOrigin: 'top', duration: 1.2, ease: 'expo.inOut' });
    $$('.phero__art svg.prod').forEach(p => {
      gsap.from(p.parentElement, { y: 160, opacity: 0, duration: 1.4, ease: 'expo.out', delay: 0.15 });
      const m = mobile();
      gsap.fromTo(p, { rotate: m ? -14 : -24, y: 0 }, { rotate: m ? -6 : -10, y: m ? -20 : -50, ease: 'none', scrollTrigger: { trigger: p.closest('.phero'), start: 'top top', end: 'bottom top', scrub: true } });
    });
    gsap.from('.ahero__img', { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', delay: 0.3 });
    $$('.badge').forEach(b => gsap.from(b, { scale: 0, rotate: -90, duration: 0.9, ease: 'back.out(1.6)', delay: 0.6 }));

    /* background colour morph */
    const bg = $('#bgLayer');
    $$('[data-bg]').forEach(sec => ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onToggle: s => { if (s.isActive) gsap.to(bg, { backgroundColor: sec.dataset.bg, duration: 0.8, ease: 'power2.out', overwrite: true }); }
    }));
    gsap.to('#storyLine', { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    /* reveals */
    $$('.reveal').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));
    const group = (sel) => $$(sel).forEach(g => gsap.from(g.children, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: g, start: 'top 88%' } }));
    group('.feats'); group('.steps3'); group('.why'); group('.topics'); group('.partners'); group('.values'); group('.rules'); group('.smap'); group('.tips'); group('.stories');
    $$('.st__ill, .stat').length;
    $$('.xsell, .featpost, .reader__stage, .timerband, .cyclex, .form, .wtb__col, .cert__doc, .ctable-wrap, .spec, .video, .sexed-band, .side-card').forEach(el => gsap.from(el, { y: 70, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));
    gsap.utils.toArray('.pgrid .post').forEach((p, i) => gsap.from(p, { y: 60, opacity: 0, duration: 1, delay: (i % 3) * 0.08, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 92%' } }));
    $$('.acc').forEach(a => gsap.from($$('details', a), { y: 24, opacity: 0, stagger: 0.05, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: a, start: 'top 88%' } }));
    $$('.final__stage svg, .xsell svg').forEach(s => gsap.fromTo(s, { rotate: -30, x: -60 }, { rotate: -10, x: 0, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true } }));

    /* counters */
    $$('[data-count]').forEach(el => { const o = { v: 0 }; gsap.to(o, { v: +el.dataset.count, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' }, onUpdate: () => (el.textContent = Math.round(o.v)) }); });

    /* colloidal gold particles (if present) */
    const pbox = $('#particles');
    if (pbox) {
      pbox.innerHTML = '<span class="bar"></span>';
      for (let k = 0; k < 34; k++) { const i = document.createElement('i'); i.style.left = ((k + 0.5) / 34) * 100 + '%'; i.style.top = 'calc(50% - 5px)'; pbox.appendChild(i); }
      const dots = $$('i', pbox);
      dots.forEach(d => gsap.set(d, { x: gsap.utils.random(-200, 200), y: gsap.utils.random(-140, 140), scale: gsap.utils.random(0.4, 1.6) }));
      gsap.to(dots, { x: 0, y: 0, scale: 1, ease: 'power2.inOut', stagger: { each: 0.01, from: 'random' }, scrollTrigger: { trigger: pbox, start: 'top 95%', end: 'top 40%', scrub: 0.6 } });
    }

    window.addEventListener('load', refresh);
    document.fonts && document.fonts.ready.then(refresh);
  }

  /* =============== shared interactions =============== */
  function scrollToEl(el) {
    const y = el.getBoundingClientRect().top + window.scrollY - (mobile() ? 80 : 100);
    if (lenis) lenis.scrollTo(y, { duration: 1.3 }); else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) { e.preventDefault(); return; }
    const el = document.getElementById(id.slice(1));
    if (!el) return;
    e.preventDefault(); closeMenu(); scrollToEl(el);
  });

  /* header dropdowns + hide on scroll */
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
  const hdr = $('#hdr'), mbar = $('#mbar'); let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    hdr && hdr.classList.toggle('is-hidden', y > 400 && y > lastY && !root.classList.contains('menu-open'));
    mbar && mbar.classList.toggle('is-on', y > innerHeight * 0.6);
    lastY = y;
  }, { passive: true });

  /* mobile menu */
  const burger = $('#burger'), mnav = $('#mnav');
  function closeMenu() { if (!mnav || mnav.hidden) return; mnav.hidden = true; burger.setAttribute('aria-expanded', 'false'); root.classList.remove('menu-open'); lenis && lenis.start(); }
  burger && burger.addEventListener('click', () => {
    if (!mnav.hidden) return closeMenu();
    mnav.hidden = false; burger.setAttribute('aria-expanded', 'true'); root.classList.add('menu-open'); lenis && lenis.stop();
    window.gsap && gsap.from('.mnav nav a', { y: 30, opacity: 0, stagger: 0.04, duration: 0.6, ease: 'expo.out' });
  });

  /* drawer: where to buy */
  const drawer = $('#drawer');
  const SHOPS = {
    bg: ['Online pharmacy', 'Drugstore chain', 'Marketplace', 'Pharmacy chain'],
    ro: ['Online pharmacy', 'Pharmacy chain', 'Drugstore chain', 'Marketplace'],
    mk: ['Pharmacy chain', 'Online pharmacy'],
    al: ['Pharmacy chain', 'Online pharmacy'],
    other: ['Distributor enquiry', 'International marketplace']
  };
  if (drawer) {
    const shops = $('#shops'), country = $('#country');
    const render = () => { shops.innerHTML = SHOPS[country.value].map(n => `<a class="shop" href="${(root.dataset.base || '')}where-to-buy/"><span class="shop__logo">RETAILER LOGO</span><b>${n}</b><span>Shop now →</span></a>`).join(''); };
    country.addEventListener('change', render); render();
    let lastFocus = null;
    const open = p => { lastFocus = document.activeElement; $('#drProduct').textContent = p || ''; drawer.hidden = false; requestAnimationFrame(() => drawer.classList.add('is-open')); lenis && lenis.stop(); closeMenu(); setTimeout(() => $('.drawer__x').focus(), 60); };
    const close = () => { drawer.classList.remove('is-open'); lenis && lenis.start(); setTimeout(() => { drawer.hidden = true; lastFocus && lastFocus.focus(); }, 450); };
    document.addEventListener('click', e => { const b = e.target.closest('.js-buy'); if (b) { e.preventDefault(); open(b.dataset.product); } });
    $$('[data-close]', drawer).forEach(x => x.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!drawer.hidden) close(); else closeMenu(); } });
    drawer.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const f = $$('button, a, select, input', $('.drawer__panel')).filter(x => x.offsetParent);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  }

  /* accordions: one open per group */
  $$('.acc').forEach(acc => $$('details', acc).forEach(d => d.addEventListener('toggle', () => {
    if (d.open) $$('details', acc).forEach(o => o !== d && (o.open = false));
    setTimeout(refresh, 60);
  })));

  /* newsletter */
  const news = $('#news');
  news && news.addEventListener('submit', e => {
    e.preventDefault();
    const em = $('#email'), ok = $('#consent'), msg = $('#newsMsg');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) { msg.textContent = 'Please enter a valid email address.'; em.focus(); return; }
    if (!ok.checked) { msg.textContent = 'Please accept the Privacy Policy to subscribe.'; ok.focus(); return; }
    msg.textContent = 'You\'re in! Check your inbox to confirm.'; e.target.reset();
  });

  /* =============== modules =============== */

  /* tabs (Streamer / Cassette) with #hash support */
  $$('[data-tabs]').forEach(tw => {
    const btns = $$('[data-tab]', tw), panels = $$('[data-panel]', tw);
    const set = key => {
      btns.forEach(b => b.setAttribute('aria-selected', b.dataset.tab === key));
      panels.forEach(p => (p.hidden = p.dataset.panel !== key));
      tw.dispatchEvent(new CustomEvent('tabchange', { detail: key }));
      refresh();
    };
    btns.forEach(b => b.addEventListener('click', () => { set(b.dataset.tab); history.replaceState(null, '', '#' + b.dataset.tab); }));
    const h = location.hash.slice(1);
    set(btns.some(b => b.dataset.tab === h) ? h : btns[0].dataset.tab);
  });

  /* 3-minute ring timers */
  $$('[data-ring]').forEach(r => {
    const arc = $('circle.arc', r), txt = $('span', r), L = 2 * Math.PI * 52;
    arc.style.strokeDasharray = L; arc.style.strokeDashoffset = L;
    const paint = f => { arc.style.strokeDashoffset = L * (1 - f); const s = Math.round(f * 180); txt.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
    const run = () => { if (reduced || !window.gsap) return paint(1); const o = { f: 0 }; gsap.to(o, { f: 1, duration: 3.5, ease: 'none', onUpdate: () => paint(o.f) }); };
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(); io.disconnect(); } }), { threshold: 0.5 });
    io.observe(r);
    const again = r.parentElement.querySelector('[data-ring-again]');
    again && again.addEventListener('click', run);
  });

  /* result reader */
  const RES = {
    pos: { c: 1, t: 1, h: 'Pregnant', p: 'Two lines, one in the test region (T) and one in the control region (C), mean you are pregnant.', next: ['Take a moment for yourself. However you feel is okay.', 'Book a visit with your doctor or gynaecologist to confirm and talk about next steps.', 'Read our articles for the first weeks in the Journal.'] },
    faint: { c: 1, t: 1, h: 'Still pregnant', p: 'A faint or pale line in the test region (T) still means you are pregnant. Colloidal Gold technology makes even low hCG levels visible.', next: ['A faint line is a valid result, so there is no need to "wait for it to get darker".', 'Early in pregnancy hCG is still low, which is why the line can look pale.', 'Talk to your doctor to confirm and plan next steps.'] },
    neg: { c: 1, t: 0, h: 'Not pregnant', p: 'Only the control line (C) appears, so you are not pregnant.', next: ['If your period still hasn\'t started, test again after 48 hours.', 'With an irregular cycle, test 19 days after possible conception.', 'If your period is very late or you are worried, talk to your doctor.'] },
    inv: { c: 0, t: 1, h: 'Invalid: test again', p: 'If no line appears in the control region (C), the test hasn\'t worked properly.', next: ['Use a new test and follow the instructions carefully.', 'Make sure the sample reaches the test (3–5 seconds for Streamer, 3–4 drops for Cassette).', 'Lay the test flat and read it between 3 and 10 minutes.'] }
  };
  $$('[data-reader]').forEach(rd => {
    let key = 'pos', faint = 0.3, picked = false;
    const zoom = $('.window-zoom', rd), svgs = $$('.reader__prod', rd), slider = $('[data-faint]', rd), fwrap = $('.faint', rd);
    const paint = () => {
      const r = RES[key], tf = key === 'faint' ? faint : 1;
      zoom.style.setProperty('--c', r.c); zoom.style.setProperty('--t', r.t); zoom.style.setProperty('--tf', tf);
      svgs.forEach(s => { s.style.setProperty('--c', r.c); s.style.setProperty('--t', r.t * tf); });
      $('[data-v-title]', rd).textContent = r.h; $('[data-v-text]', rd).textContent = r.p;
      const nx = $('[data-next]', rd); if (nx) nx.innerHTML = r.next.map(n => `<li>${ICON_CHECK}<span>${n}</span></li>`).join('');
      $$('[data-res]', rd).forEach(b => b.setAttribute('aria-selected', b.dataset.res === key));
      if (fwrap) fwrap.hidden = key !== 'faint';
    };
    $$('[data-res]', rd).forEach(b => b.addEventListener('click', () => { key = b.dataset.res; picked = true; paint(); refresh(); }));
    $$('[data-prod]', rd).forEach(b => b.addEventListener('click', () => {
      $$('[data-prod]', rd).forEach(x => x.setAttribute('aria-selected', x === b));
      svgs.forEach(s => (s.hidden = !s.classList.contains('rp-' + b.dataset.prod)));
    }));
    slider && slider.addEventListener('input', () => { faint = slider.value / 100; picked = true; paint(); });
    const seg = $('.seg', rd);
    seg && seg.addEventListener('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const bs = $$('[data-res]', seg); const i = bs.findIndex(b => b.getAttribute('aria-selected') === 'true');
      const n = bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length]; n.focus(); n.click();
    });
    paint();
    if (!reduced && rd.hasAttribute('data-auto')) {
      const order = ['pos', 'faint', 'neg', 'inv']; let oi = 0, vis = false;
      new IntersectionObserver(es => es.forEach(e => (vis = e.isIntersecting)), { threshold: 0.4 }).observe(rd);
      setInterval(() => { if (vis && !picked) { oi = (oi + 1) % 4; key = order[oi]; paint(); } }, 3400);
    }
  });

  /* when-to-test calculator */
  const calc = $('#calc');
  if (calc) {
    const lmp = $('#lmp'), cycle = $('#cycle'), cycleOut = $('#cycleOut'), altRow = $('#altRow'), conc = $('#conc'), cycDots = $('#cycDots');
    const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const d0 = new Date(today); d0.setDate(d0.getDate() - 20);
    lmp.value = iso(d0); lmp.max = iso(today); conc.max = iso(today);
    let irregular = false, resultDate = null;
    const paint = () => {
      const n = +cycle.value; cycleOut.textContent = n + ' days'; cycle.style.setProperty('--p', ((n - 21) / 12) * 100 + '%');
      if (cycDots) { const ov = n - 14; cycDots.innerHTML = Array.from({ length: n + 1 }, (_, d) => `<i class="${d < 5 ? 'per' : d === n ? 'tst' : (d >= ov - 4 && d <= ov + 1) ? 'ov' : ''}"></i>`).join(''); }
    };
    cycle.addEventListener('input', paint);
    $$('.cycle__b').forEach(b => b.addEventListener('click', () => { cycle.value = +cycle.value + +b.dataset.d; paint(); }));
    paint();
    $('#irregular').addEventListener('click', () => {
      irregular = !irregular; altRow.hidden = !irregular;
      $('#irregular').textContent = irregular ? 'Use my regular cycle instead' : 'My cycle is irregular / I don\'t know';
      $$('.cycle__b, #cycle').forEach(x => (x.disabled = irregular));
      [$('.cycle'), cycle, $('.cyc')].forEach(x => x && (x.style.opacity = irregular ? 0.35 : 1));
      refresh();
    });
    calc.addEventListener('submit', e => {
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
      $('#calcRes').hidden = false; refresh();
    });
    $('#ics').addEventListener('click', () => {
      if (!resultDate) return;
      const loc = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10).replace(/-/g, '');
      const n = new Date(resultDate); n.setDate(n.getDate() + 1);
      const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Surecheck//When to test//EN', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@surecheck', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART;VALUE=DATE:' + loc(resultDate), 'DTEND;VALUE=DATE:' + loc(n), 'SUMMARY:Surecheck test day', 'DESCRIPTION:You can test with Surecheck from today, at any time of day. Read your result within 3-10 minutes.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'surecheck-test-day.ics'; document.body.appendChild(a); a.click(); a.remove();
    });
  }

  /* cycle explainer */
  const cday = $('#cday');
  if (cday) {
    const PH = [
      { to: 5, h: 'Period', p: 'Your period starts and the uterine lining sheds. Day 1 of bleeding is day 1 of your cycle.' },
      { to: 13, h: 'Follicular phase', p: 'Oestrogen rises and an egg matures in one of the ovaries. The uterine lining starts to rebuild.' },
      { to: 16, h: 'Ovulation & fertile window', p: 'An egg is released, usually around day 14 of a 28-day cycle. This is when pregnancy is most likely.' },
      { to: 28, h: 'Luteal phase', p: 'If an egg is fertilised and implants, the body starts producing hCG, the hormone Surecheck detects. If not, your next period begins.' }
    ];
    const out = () => {
      const d = +cday.value, ph = PH.find(x => d <= x.to);
      $('#cdayNum').textContent = d; $('#cdayH').textContent = ph.h; $('#cdayP').textContent = ph.p;
      cday.style.setProperty('--p', ((d - 1) / 27) * 100 + '%');
    };
    cday.addEventListener('input', out); out();
  }

  /* FAQ search + categories */
  const fsearch = $('#fsearch');
  if (fsearch) {
    const items = $$('.fgroup details'), groups = $$('.fgroup'), empty = $('#fempty');
    let cat = 'all';
    items.forEach(d => { d.dataset.q = d.textContent.toLowerCase(); $$('summary, p', d).forEach(x => (x.dataset.raw = x.innerHTML)); });
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const run = () => {
      const q = fsearch.value.trim().toLowerCase();
      let shown = 0;
      items.forEach(d => {
        const g = d.closest('.fgroup');
        const ok = (cat === 'all' || g.dataset.fgroup === cat) && (!q || d.dataset.q.includes(q));
        d.hidden = !ok; if (ok) shown++;
        $$('summary, p', d).forEach(x => { x.innerHTML = q ? x.dataset.raw.replace(new RegExp('(' + esc(q) + ')(?![^<]*>)', 'gi'), '<mark>$1</mark>') : x.dataset.raw; });
        if (q && ok) d.open = true; else if (!q) d.open = false;
      });
      groups.forEach(g => (g.hidden = !$$('details', g).some(d => !d.hidden)));
      empty.hidden = shown > 0;
      $('#fcount').textContent = shown + (shown === 1 ? ' answer' : ' answers');
      refresh();
    };
    fsearch.addEventListener('input', run);
    $$('[data-fcat]').forEach(b => b.addEventListener('click', () => { cat = b.dataset.fcat; $$('[data-fcat]').forEach(x => x.classList.toggle('is-on', x === b)); run(); }));
    run();
  }

  /* blog filters */
  const pgrid = $('.pgrid');
  if (pgrid) $$('[data-cat]').filter(b => b.tagName === 'BUTTON').forEach(b => b.addEventListener('click', () => {
    $$('.cats .chip').forEach(x => x.classList.toggle('is-on', x === b));
    $$('.post[data-cat]', pgrid).forEach(p => p.classList.toggle('is-out', b.dataset.cat !== 'all' && p.dataset.cat !== b.dataset.cat));
    refresh();
  }));

  /* article: progress, toc, share */
  const prog = $('#progress');
  if (prog) {
    const art = $('.prose');
    const heads = $$('.prose h2'), links = $$('.toc a');
    addEventListener('scroll', () => {
      const r = art.getBoundingClientRect();
      prog.style.transform = `scaleX(${clamp(-r.top / (r.height - innerHeight * 0.6))})`;
      let cur = 0; heads.forEach((h, i) => { if (h.getBoundingClientRect().top < 160) cur = i; });
      links.forEach((l, i) => l.classList.toggle('is-on', i === cur));
    }, { passive: true });
    const copy = $('[data-copy]');
    copy && copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); $('.share__ok').textContent = 'Link copied!'; }
      catch (e) { $('.share__ok').textContent = 'Copy the URL from your browser bar.'; }
      setTimeout(() => ($('.share__ok').textContent = ''), 2500);
    });
  }

  /* generic forms */
  $$('form[data-form]').forEach(f => {
    const ok = $('[data-ok]', f.parentElement);
    $$('textarea[maxlength]', f).forEach(t => { const c = t.parentElement.querySelector('.field__count'); const u = () => c && (c.textContent = t.value.length + ' / ' + t.maxLength); t.addEventListener('input', u); u(); });
    $$('.drop', f).forEach(dz => {
      const inp = $('input[type=file]', dz), lbl = $('[data-files]', dz);
      const show = files => { lbl.textContent = files.length ? [...files].map(x => x.name).join(', ') : ''; };
      dz.addEventListener('click', () => inp.click());
      dz.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inp.click(); } });
      inp.addEventListener('change', () => show(inp.files));
      ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('is-over'); }));
      ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('is-over'); }));
      dz.addEventListener('drop', e => { if (e.dataTransfer.files.length) { inp.files = e.dataTransfer.files; show(inp.files); } });
    });
    f.addEventListener('submit', e => {
      e.preventDefault();
      let first = null;
      $$('[required]', f).forEach(el => {
        const fld = el.closest('.field') || el.closest('.check');
        let bad = el.type === 'checkbox' ? !el.checked : !el.value.trim();
        if (!bad && el.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
        fld && fld.classList.toggle('is-err', bad);
        const msg = fld && $('.field__err', fld);
        if (msg) msg.textContent = bad ? (el.type === 'email' && el.value ? 'Please enter a valid email address.' : el.type === 'checkbox' ? 'Please accept to continue.' : 'This field is required.') : '';
        if (bad && !first) first = el;
      });
      if (first) { first.focus(); return; }
      f.hidden = true; ok.hidden = false; scrollToEl(ok); refresh();
    });
    const again = ok && $('[data-again]', ok);
    again && again.addEventListener('click', () => { f.reset(); $$('[data-files]', f).forEach(x => (x.textContent = '')); ok.hidden = true; f.hidden = false; refresh(); });
  });

  /* where to buy page */
  const wtb = $('#wtb');
  if (wtb) {
    const DATA = {
      bg: { name: 'Bulgaria', online: ['Online pharmacy', 'Drugstore chain', 'Marketplace'], stores: ['Pharmacy chain · nationwide', 'Drugstore chain · major cities', 'Independent pharmacies'] },
      ro: { name: 'Romania', online: ['Online pharmacy', 'Marketplace', 'Drugstore e-shop'], stores: ['Pharmacy chain · nationwide', 'Drugstore chain · major cities', 'Independent pharmacies'] },
      mk: { name: 'North Macedonia', online: ['Online pharmacy'], stores: ['Pharmacy chain · Skopje & major cities', 'Independent pharmacies'] },
      al: { name: 'Albania', online: ['Online pharmacy'], stores: ['Pharmacy chain · Tirana & major cities', 'Independent pharmacies'] }
    };
    const row = (n, cta, href) => `<div class="store"><span class="store__logo">LOGO</span><div><b>${n}</b><small>Retailer name to be supplied</small></div><a class="link" href="${href}" ${href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${cta}</a></div>`;
    const set = k => {
      const d = DATA[k];
      $$('.ctry button').forEach(b => b.setAttribute('aria-pressed', b.dataset.c === k));
      $('#onlineList').innerHTML = d.online.map(n => row(n, 'Shop →', '#')).join('');
      $('#storeList').innerHTML = d.stores.map(n => row(n, 'Find →', 'https://www.google.com/maps/search/pharmacy+near+me')).join('');
      $$('.wtbName').forEach(x => (x.textContent = d.name));
      const map = $('#mapPins'); map.innerHTML = '';
      for (let i = 0; i < 9; i++) { const p = document.createElement('i'); p.className = 'map__pin'; p.style.left = (12 + Math.random() * 76) + '%'; p.style.top = (12 + Math.random() * 70) + '%'; p.style.animationDelay = i * 0.06 + 's'; map.appendChild(p); }
    };
    $$('.ctry button').forEach(b => b.addEventListener('click', () => set(b.dataset.c)));
    set('bg');
  }
})();
