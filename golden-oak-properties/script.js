/* Golden Oak Properties — homepage concept */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
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
     BUILD — real time-lapse journey
     ======================================================= */
  const build = $('#build');
  const stages = $$('.stage'), shots = $$('.shot'), jLis = $$('#journey li');
  const jBar = $('#journeyBar'), clock = $('#clock'), paidEl = $('#hudPaid');
  const PAID = [0, 10, 30, 50, 100];
  let cur = 0;
  function setStage(n) {
    if (n === cur) return;
    cur = n;
    stages.forEach((s, i) => s.classList.toggle('is-on', i === n));
    shots.forEach((s, i) => {
      const on = i === n, v = s.querySelector('video');
      s.classList.toggle('is-on', on);
      if (v) { if (on) { const pr = v.play(); if (pr) pr.catch(() => {}); } else v.pause(); }
    });
    jLis.forEach((li, i) => li.classList.toggle('is-on', i <= n));
    paidEl.textContent = PAID[n] + '%';
  }
  function progress(p) {
    jBar.style.width = (p * 100).toFixed(2) + '%';
    clock.textContent = 'Month ' + Math.round(p * 30);
    setStage(Math.min(4, Math.round(p * 4)));
  }
  // warm up the second clip once the page is idle
  setTimeout(() => { const v = $('.shot[data-shot="2"] video'); if (v) v.preload = 'auto'; }, 2500);

  buildST = ScrollTrigger.create({
    trigger: build,
    start: 'top top',
    end: () => '+=' + Math.round(window.innerHeight * 3.4),
    pin: true,
    scrub: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    snap: reduced ? false : { snapTo: 1 / 4, duration: { min: .4, max: .9 }, delay: .15, ease: 'power2.inOut' },
    onUpdate: self => progress(self.progress),
    onToggle: self => document.body.classList.toggle('in-build', self.isActive),
  });
  progress(0);
  document.body.classList.toggle('in-build', buildST.isActive || scrollY < 10);

  $('.skip').addEventListener('click', e => { e.preventDefault(); scrollTo('#trust'); });

  /* =======================================================
     INTRO
     ======================================================= */
  function intro() {
    gsap.from('.hdr', { y: -24, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'transform,opacity' });
    gsap.from(stages[0].children, { y: 30, opacity: 0, duration: 1.2, stagger: .08, ease: 'power3.out', delay: .15, clearProps: 'transform,opacity' });
    gsap.from('#media', { clipPath: 'inset(10% 6% 10% 6% round 28px)', duration: 1.8, ease: 'expo.out', clearProps: 'clipPath' });
    gsap.from('#journey', { opacity: 0, y: 16, duration: 1, delay: .6, ease: 'power3.out', clearProps: 'transform,opacity' });
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
