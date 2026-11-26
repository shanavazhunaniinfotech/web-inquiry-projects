/* 1090 Kipling — homepage proposal interactions */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Hero: unit video carousel ---------------- */
  // Each entry will map to a CMS "unit type" record (video, poster, label, SF).
  const UNITS = [
    { name: '2-Bedroom Residence', sf: 800, video: 'media/hero-2bed.mp4', poster: 'media/hero-2bed.jpg', pick: '2-Bedroom Residence — 800 SF' },
    { name: '1-Bedroom Residence', sf: 400, video: 'media/hero-1bed.mp4', poster: 'media/hero-1bed.jpg', pick: '1-Bedroom Residence — 400 SF' },
    { name: '2-Bedroom Garden Suite', sf: 900, video: 'media/hero-garden.mp4', poster: 'media/hero-garden.jpg', pick: '2-Bedroom Garden Suite — 900 SF' }
  ];
  let current = 0; // default: 2-Bedroom Residence
  const vids = $$('.hero__video');
  let activeVid = 0;
  const now = $('.now');
  const pager = $('#nowPager');
  const prevBtn = $('#unitPrev');
  const nextBtn = $('#unitNext');

  UNITS.forEach((u, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', u.name + ', ' + u.sf + ' square feet');
    b.addEventListener('click', () => go(i));
    pager.appendChild(b);
  });

  function fmt(u) { return u.sf + ' Square Feet'; }
  function paintLabels() {
    const u = UNITS[current];
    const p = UNITS[(current - 1 + UNITS.length) % UNITS.length];
    const n = UNITS[(current + 1) % UNITS.length];
    $('#nowName').textContent = u.name;
    $('#nowSf').textContent = fmt(u);
    $('.unit-nav__name', prevBtn).textContent = p.name;
    $('.unit-nav__sf', prevBtn).textContent = fmt(p);
    $('.unit-nav__name', nextBtn).textContent = n.name;
    $('.unit-nav__sf', nextBtn).textContent = fmt(n);
    prevBtn.setAttribute('aria-label', 'Previous: ' + p.name);
    nextBtn.setAttribute('aria-label', 'Next: ' + n.name);
    $$('button', pager).forEach((b, i) => b.setAttribute('aria-selected', i === current ? 'true' : 'false'));
    $('#nowCta').dataset.unitPick = u.pick;
  }

  function go(i) {
    if (i === current) return;
    current = (i + UNITS.length) % UNITS.length;
    const u = UNITS[current];
    const next = vids[1 - activeVid];
    const prev = vids[activeVid];
    next.poster = u.poster;
    next.src = u.video;
    next.load();
    const show = () => {
      next.classList.add('is-on');
      prev.classList.remove('is-on');
      setTimeout(() => { if (!prev.classList.contains('is-on')) prev.pause(); }, 1200);
    };
    if (!reduceMotion) {
      const pr = next.play();
      if (pr && pr.catch) pr.catch(() => {});
    }
    // show immediately (poster), video fades in over it
    show();
    activeVid = 1 - activeVid;
    now.classList.add('is-swapping');
    setTimeout(() => { paintLabels(); now.classList.remove('is-swapping'); }, 300);
    track('hero_unit_change', { unit: u.name });
  }
  prevBtn.addEventListener('click', () => go(current - 1));
  nextBtn.addEventListener('click', () => go(current + 1));
  paintLabels();

  // keyboard + swipe on hero
  const hero = $('#home');
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input,select,textarea')) return;
    const r = hero.getBoundingClientRect();
    if (r.bottom < 100) return;
    if (e.key === 'ArrowLeft') go(current - 1);
    if (e.key === 'ArrowRight') go(current + 1);
  });
  let sx = null, sy = null;
  hero.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  hero.addEventListener('touchend', (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(current + (dx < 0 ? 1 : -1));
    sx = null;
  }, { passive: true });

  if (reduceMotion) vids.forEach(v => { v.removeAttribute('autoplay'); v.pause(); });

  // keep the unit labels sitting above the feature strip, whatever its height
  const strip = $('.strip');
  const setStrip = () => hero.style.setProperty('--strip-h', strip.offsetHeight + 'px');
  setStrip();
  window.addEventListener('resize', setStrip);

  /* ---------------- Header state + mobile menu ---------------- */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = $('#burger');
  const nav = $('.nav');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('.nav a').forEach(a => a.addEventListener('click', () => {
    if (nav.classList.contains('is-open')) burger.click();
  }));

  /* ---------------- Section dots ("page section scrollers") ---------------- */
  const sections = $$('main > section[data-label]');
  const dots = $('#dots');
  sections.forEach(s => {
    const a = document.createElement('a');
    a.href = '#' + s.id;
    a.innerHTML = '<span>' + s.dataset.label + '</span>';
    a.setAttribute('aria-label', 'Go to ' + s.dataset.label);
    dots.appendChild(a);
  });
  const dotLinks = $$('a', dots);
  const navMap = { home: 'home', overview: 'home', design: 'home', interiors: 'interiors', location: 'location', residences: 'residences', about: 'about', register: null };
  const navLinks = $$('.nav__list a');
  function setActive(id) {
    const idx = sections.findIndex(s => s.id === id);
    dotLinks.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    dots.classList.toggle('on-light', sections[idx] && sections[idx].dataset.theme === 'light');
    const target = navMap[id];
    navLinks.forEach(l => {
      const on = target && l.getAttribute('href') === '#' + target;
      l.classList.toggle('is-active', !!on);
      if (on) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
    });
  }
  const secIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => secIO.observe(s));
  new IntersectionObserver(([e]) => dots.classList.toggle('is-hidden', e.isIntersecting), { rootMargin: '0px 0px -40% 0px' }).observe($('.footer'));

  /* ---------------- Reveal on scroll ---------------- */
  const revIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); revIO.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = ((i % 4) * 0.08) + 's';
    revIO.observe(el);
  });

  /* ---------------- GSAP: parallax on feature imagery ---------------- */
  window.addEventListener('load', () => {
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    $$('.feature__media img').forEach(img => {
      gsap.fromTo(img, { yPercent: -5 }, {
        yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    $$('.type__img img').forEach(img => {
      gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'center center', scrub: true } });
    });
  });

  /* ---------------- Count-up on key facts ---------------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const end = +e.target.dataset.count;
      if (reduceMotion) return;
      let t0 = null;
      const step = (t) => {
        if (!t0) t0 = t;
        const p = Math.min((t - t0) / 1100, 1);
        e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => countIO.observe(el));

  /* ---------------- Site plan / availability ---------------- */
  const uinfo = $('#uinfo');
  $$('.u').forEach(btn => {
    const show = () => {
      $$('.u').forEach(b => b.classList.toggle('is-active', b === btn));
      const [title, spec] = btn.dataset.u.split('|');
      const isGS = btn.classList.contains('u--gs');
      const is1 = /1 Bedroom/.test(spec);
      const pick = isGS ? UNITS[2].pick : is1 ? UNITS[1].pick : UNITS[0].pick;
      uinfo.innerHTML = '<div><strong></strong><br><span></span></div><a href="#register" class="js-register" data-cta="siteplan">Register for this unit →</a>';
      $('strong', uinfo).textContent = title;
      $('span', uinfo).textContent = spec.replace(/&amp;/g, '&') + ' · Available';
      $('a', uinfo).dataset.unitPick = pick;
    };
    btn.addEventListener('mouseenter', show);
    btn.addEventListener('focus', show);
    btn.addEventListener('click', show);
  });

  /* ---------------- Register CTAs: smooth scroll + unit pre-select ---------------- */
  const unitSelect = $('#ut');
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.js-register');
    if (!a) return;
    e.preventDefault();
    const pick = a.dataset.unitPick;
    if (pick) unitSelect.value = pick;
    track('cta_click', { cta: a.dataset.cta || 'register', unit: pick || '' });
    const reg = $('#register');
    reg.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => { const f = $('#fn'); if (f && window.innerWidth > 760) f.focus({ preventScroll: true }); }, 900);
    history.replaceState(null, '', '#register');
  });

  /* ---------------- Mobile sticky CTA ---------------- */
  const mbar = $('#mbar');
  let heroVisible = true, regVisible = false;
  const updateBar = () => mbar.classList.toggle('is-on', !heroVisible && !regVisible);
  new IntersectionObserver(([e]) => { heroVisible = e.intersectionRatio > 0.35; updateBar(); }, { threshold: [0, 0.35, 1] }).observe(hero);
  new IntersectionObserver(([e]) => { regVisible = e.isIntersecting; updateBar(); }, { rootMargin: '0px 0px -30% 0px' }).observe($('#regForm'));

  /* ---------------- Form validation (front-end prototype) ---------------- */
  const form = $('#regForm');
  const status = $('#formStatus');
  const startedAt = Date.now();
  let started = false;
  const msg = {
    valueMissing: 'This field is required.',
    typeMismatch: 'Please enter a valid email address.',
    phone: 'Please enter a valid phone number.'
  };
  function check(el) {
    const field = el.closest('.field');
    if (!field) return el.checkValidity();
    let err = '';
    if (el.validity.valueMissing) err = msg.valueMissing;
    else if (el.validity.typeMismatch) err = msg.typeMismatch;
    else if (el.type === 'tel' && el.value && el.value.replace(/\D/g, '').length < 10) err = msg.phone;
    let e = $('.err', field);
    if (err) {
      if (!e) { e = document.createElement('span'); e.className = 'err'; e.id = el.id + '-err'; field.appendChild(e); }
      e.textContent = err;
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', e.id);
    } else if (e) { e.remove(); el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); }
    field.classList.toggle('is-invalid', !!err);
    field.classList.toggle('is-valid', !err && !!el.value);
    return !err;
  }
  $$('input, select', form).forEach(el => {
    el.addEventListener('blur', () => { if (el.closest('.field') && (el.value || el.dataset.touched)) check(el); el.dataset.touched = '1'; });
    el.addEventListener('input', () => { if (el.closest('.field.is-invalid')) check(el); });
    el.addEventListener('change', () => { if (el.closest('.field')) check(el); });
    el.addEventListener('focus', () => { if (!started) { started = true; track('form_start'); } }, { once: true });
  });
  const consent = $('#consent');
  consent.addEventListener('change', () => consent.closest('.consent').classList.toggle('is-invalid', !consent.checked));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true, first = null;
    $$('.field input, .field select', form).forEach(el => { if (!check(el)) { ok = false; first = first || el; } });
    if (!consent.checked) { ok = false; consent.closest('.consent').classList.add('is-invalid'); first = first || consent; }
    if (!ok) {
      status.textContent = 'Please complete the highlighted fields.';
      first.focus();
      return;
    }
    // spam protection: honeypot + minimum fill time (real build adds server-side checks / reCAPTCHA v3 or Turnstile)
    if ($('#website').value || Date.now() - startedAt < 2500) { status.textContent = 'Submission blocked.'; return; }
    status.textContent = '';
    const btn = $('#submitBtn');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    // Prototype: in production this posts to the CMS form handler (email + stored entry + CSV export).
    setTimeout(() => {
      const name = $('#fn').value.trim();
      $('#thanksName').textContent = name ? ', ' + name : '';
      form.hidden = true;
      const t = $('#thanks');
      t.hidden = false;
      t.focus();
      track('generate_lead', { unit: unitSelect.value || 'none' });
    }, 900);
  });

  /* ---------------- Footer logo + misc ---------------- */
  $('#footLogo').appendChild($('.brand .logo').cloneNode(true));
  $$('.js-privacy').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  /* ---------------- Analytics hook (GA4 / GTM ready) ---------------- */
  function track(event, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: event }, params || {}));
  }

  /* ---------------- Design rationale notes (proposal mode) ---------------- */
  const NOTES = {
    home: { pos: 'top:calc(var(--hdr) + 40px);right:64px', t: 'Hero — show the product', p: 'The selected residence plays as a muted, looping video (default: 2-Bedroom). Arrows let buyers self-select a home type, which is the first micro-commitment. The small "Register for this residence" link pre-fills that unit in the form, so the visitor never re-enters what they already told us. "Register Now" and click-to-call stay visible in the header on every screen.' },
    overview: { pos: 'top:calc(var(--hdr) + 30px);left:40px', t: 'Answer the first 4 questions', p: 'Buyers first want to know when, how many, how big and where. "Move In 2027", the facts bar (10 homes · 400–900 SF · 5 min to subway · 2027) and "A limited number of units remain" answer that in about 5 seconds and add honest scarcity. There is a Register button at each decision point, as in your PDF.' },
    design: { pos: 'top:calc(var(--hdr) + 24px);right:40px', t: 'Emotion before specs', p: 'Your architectural rendering at full height builds desire before any numbers appear. The CTA here is soft ("Explore the residences") because visitors this early are still browsing. The image moves with a slight parallax for a premium feel.' },
    interiors: { pos: 'top:calc(var(--hdr) + 24px);left:40px', t: 'Handle objections + offer a lead magnet', p: 'It states up front what is included (outdoor space, parking, locker), which are common reasons people leave a boutique project. Instead of a hard sell, the CTA offers something worth an email address: the finishes package.' },
    location: { pos: 'top:calc(var(--hdr) + 24px);right:40px', t: 'Commute sells Toronto homes', p: 'Travel times are shown as large numbers so they can be scanned. The "neighbourhood guide" lead magnet gives a second reason to register. (Times are approximate placeholders, to be confirmed by you.)' },
    residences: { pos: 'top:calc(var(--hdr) + 10px);left:40px', t: 'Choose → convert', p: 'Three cards that mirror the hero. "Get Floor Plans" is the main conversion trigger: pricing stays hidden at launch, so first access to plans and pricing is the strongest reason to register. The Garden Suite is highlighted ("Only 2 available"). The site map shows that only 10 homes exist, which is real scarcity, and it can later show live availability and pricing from the CMS.' },
    about: { pos: 'top:calc(var(--hdr) + 10px);right:40px', t: 'Remove fear of the unknown', p: 'Many visitors don\'t register because they fear sales pressure. The 4-step path shows exactly what happens after they register, and the FAQ answers objections before they become a reason to leave. About Us replaces Team, as you requested.' },
    register: { pos: 'top:calc(var(--hdr) + 10px);left:40px', t: 'Low-friction registration', p: 'This is your PDF form, plus the optional Preferred Unit Type field, which is pre-filled when someone clicked a unit earlier. Errors show inline as the visitor types. A reassurance line sits under the button. Spam protection is invisible (honeypot + timing), so there is no annoying captcha. The CASL consent checkbox is included. The thank-you screen sets expectations and offers a call. Every Register button on the site scrolls here.' }
  };
  Object.keys(NOTES).forEach((id, i) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const n = NOTES[id];
    const d = document.createElement('aside');
    d.className = 'note';
    d.setAttribute('style', n.pos);
    d.innerHTML = '<b><i>' + (i + 1) + '</i></b><p></p>';
    d.querySelector('b').appendChild(document.createTextNode(n.t));
    d.querySelector('p').textContent = n.p;
    if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
    sec.appendChild(d);
  });
  const toggle = $('#notesToggle');
  const setNotes = (on) => {
    document.body.classList.toggle('notes-on', on);
    toggle.setAttribute('aria-pressed', String(on));
    $('.notes-toggle__t', toggle).textContent = on ? 'Hide design notes' : 'Why this layout?';
  };
  toggle.addEventListener('click', () => setNotes(!document.body.classList.contains('notes-on')));
  if (/[?&]notes=1/.test(location.search)) { document.body.classList.add('notes-avail'); setNotes(true); }
})();
