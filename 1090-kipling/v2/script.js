/* 1090 Kipling — Homepage proposal · Version 2 */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const M = '../media/';
  const track = (event, p) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event }, p || {})); };

  /* ---------- unit types (CMS: "Unit Type" records) ---------- */
  const TYPES = [
    { key: '2bed', name: '2-Bedroom Residence', sf: 800, video: M + 'hero-2bed.mp4', poster: M + 'hero-2bed.jpg', pick: '2-Bedroom Residence — 800 SF' },
    { key: '1bed', name: '1-Bedroom Residence', sf: 400, video: M + 'hero-1bed.mp4', poster: M + 'hero-1bed.jpg', pick: '1-Bedroom Residence — 400 SF' },
    { key: 'garden', name: '2-Bedroom Garden Suite', sf: 900, video: M + 'hero-garden.mp4', poster: M + 'hero-garden.jpg', pick: '2-Bedroom Garden Suite — 900 SF' }
  ];

  /* ---------- HERO switcher ---------- */
  const vids = $$('.hero__v');
  const sw = $('.switch');
  let cur = 0, act = 0;
  const bars = $('#swBars');
  TYPES.forEach((t, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', t.name + ', ' + t.sf + ' square feet');
    b.addEventListener('click', () => go(i));
    bars.appendChild(b);
  });
  function paint() {
    const t = TYPES[cur], p = TYPES[(cur + 2) % 3], n = TYPES[(cur + 1) % 3];
    $('#swName').textContent = t.name;
    $('#swSf').textContent = t.sf + ' Square Feet';
    $('#swIdx').textContent = '0' + (cur + 1);
    $('#peekPrev').innerHTML = ''; $('#peekNext').innerHTML = '';
    $('#peekPrev').append(p.name.replace(' Residence', ''), Object.assign(document.createElement('small'), { textContent: p.sf + ' SF' }));
    $('#peekNext').append(n.name.replace(' Residence', ''), Object.assign(document.createElement('small'), { textContent: n.sf + ' SF' }));
    $('#swPrev').setAttribute('aria-label', 'Previous: ' + p.name);
    $('#swNext').setAttribute('aria-label', 'Next: ' + n.name);
    $$('button', bars).forEach((b, i) => b.setAttribute('aria-selected', String(i === cur)));
    $('#swCta').dataset.pick = t.pick;
  }
  function go(i) {
    i = (i + 3) % 3;
    if (i === cur) return;
    cur = i;
    const t = TYPES[cur], nx = vids[1 - act], pv = vids[act];
    nx.poster = t.poster; nx.src = t.video; nx.load();
    if (!reduce) { const pr = nx.play(); if (pr && pr.catch) pr.catch(() => {}); }
    nx.classList.add('is-on'); pv.classList.remove('is-on');
    setTimeout(() => { if (!pv.classList.contains('is-on')) pv.pause(); }, 1300);
    act = 1 - act;
    sw.classList.add('is-swap');
    setTimeout(() => { paint(); sw.classList.remove('is-swap'); }, 320);
    track('hero_unit_change', { unit: t.name });
  }
  $('#swPrev').addEventListener('click', () => go(cur - 1));
  $('#swNext').addEventListener('click', () => go(cur + 1));
  paint();
  if (reduce) vids.forEach(v => { v.removeAttribute('autoplay'); v.pause(); });

  const hero = $('#home');
  document.addEventListener('keydown', e => {
    if (e.target.closest('input,select,textarea') || !$('#lb').hidden) return;
    if (hero.getBoundingClientRect().bottom < 120) return;
    if (e.key === 'ArrowLeft') go(cur - 1);
    if (e.key === 'ArrowRight') go(cur + 1);
  });
  let sx = null, sy = 0;
  hero.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  hero.addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(cur + (dx < 0 ? 1 : -1));
    sx = null;
  }, { passive: true });

  const strip = $('.hstrip');
  const setStrip = () => hero.style.setProperty('--strip', strip.offsetHeight + 'px');
  setStrip(); window.addEventListener('resize', setStrip);

  /* ---------- header + menu ---------- */
  const hdr = $('#hdr');
  const onScroll = () => hdr.classList.toggle('is-solid', window.scrollY > hero.offsetHeight - 90);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  const burger = $('#burger'), nav = $('#nav');
  const setMenu = open => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- section dots + active nav ---------- */
  const secs = $$('main > section[data-label]');
  const dots = $('#dots');
  secs.forEach(s => {
    const a = document.createElement('a');
    a.href = '#' + s.id; a.setAttribute('aria-label', 'Go to ' + s.dataset.label);
    a.innerHTML = '<span>' + s.dataset.label + '</span>';
    dots.appendChild(a);
  });
  const dl = $$('a', dots);
  const navFor = { home: '#home', overview: '#home', experience: '#experience', residences: '#residences', location: '#location', about: '#about' };
  const setActive = id => {
    const i = secs.findIndex(s => s.id === id);
    dl.forEach((d, k) => d.classList.toggle('is-active', k === i));
    $$('a', nav).forEach(a => a.classList.toggle('is-active', !a.classList.contains('pill') && a.getAttribute('href') === navFor[id] && !(id === 'experience' && a.textContent === 'Gallery')));
  };
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => io.observe(s));
  new IntersectionObserver(([e]) => dots.classList.toggle('is-hidden', e.isIntersecting), { rootMargin: '0px 0px -40% 0px' }).observe($('.foot'));

  /* ---------- reveals + counters ---------- */
  const rio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in'); rio.unobserve(e.target);
  }), { rootMargin: '0px 0px -8% 0px', threshold: .05 });
  $$('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 3) * .09 + 's'; rio.observe(el); });
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    cio.unobserve(e.target);
    if (reduce) return;
    const end = +e.target.dataset.count; let t0;
    const step = t => { t0 = t0 || t; const p = Math.min((t - t0) / 1100, 1); e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- GSAP: horizontal experience + parallax ---------- */
  window.addEventListener('load', () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
      const trackEl = $('#expTrack');
      const dist = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);
      gsap.to(trackEl, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '.exp', start: 'top top', end: () => '+=' + dist(), pin: '.exp__pin', scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 }
      });
      gsap.fromTo('.loc__media img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.loc', start: 'top bottom', end: 'center center', scrub: true } });
    });
  });

  /* ---------- RESIDENCE EXPLORER (mirrors Units page from the design PDF) ---------- */
  const UNITS = [];
  ['Northern', 'Southern'].forEach(lot => {
    [
      { id: 'Unit 1', t: 0, bed: 2, bath: 2, out: 'Balcony', levels: ['Main Floor', 'Upper Floor'] },
      { id: 'Unit 2', t: 0, bed: 2, bath: 2, out: 'Balcony', levels: ['Main Floor', 'Upper Floor'] },
      { id: 'Unit 3', t: 1, bed: 1, bath: 1, out: 'Patio', levels: ['Lower Level'] },
      { id: 'Unit 4', t: 1, bed: 1, bath: 1, out: 'Patio', levels: ['Lower Level'] },
      { id: 'Garden Suite', t: 2, bed: 2, bath: 2, out: 'Private garden', levels: ['Garden Level'] }
    ].forEach(u => UNITS.push(Object.assign({ lot }, u)));
  });
  let uSel = 0, lvl = 0;
  const lists = { Northern: $('#lotN'), Southern: $('#lotS') };
  UNITS.forEach((u, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'radio');
    b.innerHTML = '<span></span><small></small>';
    b.firstChild.textContent = u.id;
    b.lastChild.textContent = TYPES[u.t].sf + ' sf · ' + u.bed + ' Bed';
    b.addEventListener('click', () => { uSel = i; lvl = 0; renderUnit(true); track('unit_select', { unit: u.lot + ' ' + u.id }); });
    li.appendChild(b); lists[u.lot].appendChild(li);
  });
  const plan = $('.ex__plan');
  function renderUnit(animate) {
    const u = UNITS[uSel], t = TYPES[u.t];
    $$('.ex__list button').forEach((b, i) => b.setAttribute('aria-checked', String(i === uSel)));
    const lv = $('#exLevels'); lv.innerHTML = '';
    if (u.levels.length > 1) {
      u.levels.forEach((name, k) => {
        const b = document.createElement('button');
        b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = name;
        b.setAttribute('aria-selected', String(k === lvl));
        b.addEventListener('click', () => { lvl = k; renderUnit(true); });
        lv.appendChild(b);
      });
    } else {
      const s = document.createElement('span'); s.textContent = u.levels[0]; lv.appendChild(s);
    }
    const swap = () => {
      $('#exTitle').textContent = u.id;
      $('#exType').textContent = u.lot + ' Lot · ' + t.name;
      $('#exBed').textContent = u.bed; $('#exBath').textContent = u.bath;
      $('#exSf').textContent = t.sf + ' SF'; $('#exOut').textContent = u.out;
      $('#exPlanCap').textContent = u.lot + ' Lot · ' + u.id + ' · ' + u.levels[lvl];
      const img = $('#exPlan');
      img.alt = 'Sample floor plan, ' + u.lot + ' Lot ' + u.id + ', ' + u.levels[lvl];
      $('#exCta').dataset.pick = t.pick;
      plan.classList.remove('is-swap');
    };
    if (animate && !reduce) { plan.classList.add('is-swap'); setTimeout(swap, 260); } else swap();
  }
  renderUnit(false);

  /* ---------- lightbox ---------- */
  const lb = $('#lb'), stage = $('#lbStage');
  let gal = [], gi = 0, lastFocus = null;
  const showImg = () => { stage.innerHTML = ''; const im = new Image(); im.src = gal[gi]; im.alt = 'Gallery image ' + (gi + 1) + ' of ' + gal.length; stage.appendChild(im); };
  function openLb(kind) {
    lastFocus = document.activeElement;
    const t = TYPES[UNITS[uSel].t];
    stage.innerHTML = '';
    const multi = kind === 'gallery';
    $('#lbPrev').hidden = !multi; $('#lbNext').hidden = !multi;
    if (kind === 'video') {
      const v = document.createElement('video');
      v.src = t.video; v.poster = t.poster; v.controls = true; v.muted = true; v.autoplay = true; v.loop = true; v.playsInline = true;
      stage.appendChild(v);
    } else {
      gal = [t.poster, M + 'rendering-courtyard.jpg', M + 'interior-living.jpg', M + 'hero-1bed.jpg']; gi = 0; showImg();
    }
    lb.hidden = false; document.body.style.overflow = 'hidden'; $('#lbClose').focus();
    track('unit_media_open', { kind });
  }
  const closeLb = () => { lb.hidden = true; stage.innerHTML = ''; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); };
  $$('[data-lightbox]').forEach(b => b.addEventListener('click', () => openLb(b.dataset.lightbox)));
  $('#lbClose').addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  $('#lbPrev').addEventListener('click', () => { gi = (gi + gal.length - 1) % gal.length; showImg(); });
  $('#lbNext').addEventListener('click', () => { gi = (gi + 1) % gal.length; showImg(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight' && !$('#lbNext').hidden) $('#lbNext').click();
    if (e.key === 'ArrowLeft' && !$('#lbPrev').hidden) $('#lbPrev').click();
    if (e.key === 'Tab') { e.preventDefault(); $('#lbClose').focus(); }
  });

  /* ---------- register CTAs: scroll + pre-select unit ---------- */
  const radios = $$('input[name="unit_type"]');
  document.addEventListener('click', e => {
    const a = e.target.closest('.js-reg');
    if (!a) return;
    e.preventDefault();
    if (a.dataset.pick) radios.forEach(r => { r.checked = r.value === a.dataset.pick; });
    track('cta_click', { cta: a.dataset.cta || 'register', unit: a.dataset.pick || '' });
    $('#register').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', '#register');
  });

  /* ---------- mobile sticky bar ---------- */
  const mbar = $('#mbar');
  let heroVis = true, regVis = false;
  const tools = $('.tools');
  const upd = () => { mbar.classList.toggle('is-on', !heroVis && !regVis); tools.classList.toggle('on-hero', heroVis); };
  new IntersectionObserver(([e]) => { heroVis = e.intersectionRatio > .35; upd(); }, { threshold: [0, .35, 1] }).observe(hero);
  new IntersectionObserver(([e]) => { regVis = e.isIntersecting; upd(); }, { rootMargin: '0px 0px -30% 0px' }).observe($('#regForm'));

  /* ---------- form ---------- */
  const form = $('#regForm'), status = $('#fstatus'), t0 = Date.now();
  let started = false;
  $$('select', form).forEach(s => s.addEventListener('change', () => s.classList.toggle('has-val', !!s.value)));
  function check(el) {
    const f = el.closest('.f'); if (!f) return true;
    let err = '';
    if (el.validity.valueMissing) err = 'Required';
    else if (el.validity.typeMismatch) err = 'Please enter a valid email';
    else if (el.type === 'tel' && el.value.replace(/\D/g, '').length < 10) err = 'Please enter a valid phone number';
    let s = $('.err', f);
    if (err) {
      if (!s) { s = document.createElement('span'); s.className = 'err'; s.id = el.id + '-err'; f.appendChild(s); }
      s.textContent = err; el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', s.id);
    } else if (s) { s.remove(); el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); }
    f.classList.toggle('is-bad', !!err);
    return !err;
  }
  $$('.f input, .f select', form).forEach(el => {
    el.addEventListener('blur', () => { if (el.value) check(el); });
    el.addEventListener('input', () => { if (el.closest('.is-bad')) check(el); });
    el.addEventListener('change', () => check(el));
    el.addEventListener('focus', () => { if (!started) { started = true; track('form_start'); } });
  });
  const consent = $('#consent');
  consent.addEventListener('change', () => consent.closest('.consent').classList.toggle('is-bad', !consent.checked));
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true, first = null;
    $$('.f input, .f select', form).forEach(el => { if (!check(el)) { ok = false; first = first || el; } });
    if (!consent.checked) { ok = false; consent.closest('.consent').classList.add('is-bad'); first = first || consent; }
    if (!ok) { status.textContent = 'Please complete the highlighted fields.'; first.focus({ preventScroll: false }); return; }
    if ($('#website').value || Date.now() - t0 < 2500) { status.textContent = 'Submission blocked.'; return; }
    status.textContent = '';
    const btn = $('#submitBtn'); btn.disabled = true; btn.textContent = 'Sending…';
    // Prototype only — production posts to the CMS form handler (email + stored entry + CSV export).
    setTimeout(() => {
      const n = $('#fn').value.trim();
      $('#thanksName').textContent = n ? ', ' + n : '';
      form.hidden = true; const th = $('#thanks'); th.hidden = false; th.focus();
      const sel = radios.find(r => r.checked);
      track('generate_lead', { unit: sel ? sel.value : 'none' });
    }, 900);
  });
  $$('.js-noop').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  /* ---------- design notes ---------- */
  const NOTES = {
    home: ['top:150px;left:40px', 'Framed, cinematic hero', 'The video sits in a rounded frame, which reads as a high-end editorial page rather than a template. The headline sells the core idea in 4 words ("Ten homes. One rare address.") and two CTAs sit right beside it. The glass "Now Viewing" card keeps your unit switcher (arrows, unit name, SF) and adds "Get this floor plan", which pre-fills that unit in the form. The translucent olive strip keeps your 4 highlights visible over the video.'],
    overview: ['top:40px;right:40px', 'Answer the 4 first questions', 'The large "Move In 2027" answers WHEN at a glance. The four stat tiles answer HOW MANY, HOW BIG and WHERE. The slowly rotating "Only ten residences" badge is a subtle, premium way to show real scarcity. The "Move In 2027" block stays pinned while the visitor reads, so the CTA never leaves the screen.'],
    experience: ['top:110px;right:40px', 'Your 3 feature areas as a scroll story', 'Your PDF asks for 3 image-and-text areas. Here they slide sideways as the visitor scrolls down. That holds attention far longer than stacked blocks and feels award-level. It ends on "Which one is yours?", which leads naturally into choosing a home.'],
    residences: ['top:40px;right:40px', 'Your Units page, previewed', 'A live preview of the 3-column Units page from your PDF: lots and units on the left, the plan in the centre, floor levels, specs, video and gallery on the right. Everything updates when a unit is clicked. Price shows "Registrants first" (hidden at launch, as you require), so the strongest reason to register sits right next to the CTA.'],
    location: ['top:40px;left:40px', 'Commute, visualised', 'Travel times animate as gold bars, making "close to everything" visual and easy to scan. The CTA offers a neighbourhood guide as a second reason to register. (Times are placeholders for you to confirm.)'],
    about: ['top:40px;right:40px', 'Trust + objection handling', 'About Us replaces Team. The 4 cards show exactly what happens after someone registers, which removes the fear of sales pressure. The FAQ answers the questions that make people leave a pre-construction site.'],
    register: ['top:40px;left:40px', 'High-converting registration', 'This is your PDF form in a modern card, with floating labels and inline validation. The preferred unit type is a one-tap choice and is pre-filled from earlier clicks. The perks on the left say exactly what registering gets them. Spam protection is invisible (no captcha), the CASL consent checkbox is included, and the thank-you screen offers an instant call.']
  };
  Object.keys(NOTES).forEach((id, i) => {
    const sec = document.getElementById(id); if (!sec) return;
    const [pos, title, txt] = NOTES[id];
    const d = document.createElement('aside'); d.className = 'note'; d.setAttribute('style', pos);
    d.innerHTML = '<b><i>' + (i + 1) + '</i></b><p></p>';
    d.querySelector('b').append(title); d.querySelector('p').textContent = txt;
    const host = id === 'home' ? $('.hero__frame') : id === 'experience' ? $('.exp__pin') : sec;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.appendChild(d);
  });
  const tg = $('#notesToggle');
  const setNotes = on => { document.body.classList.toggle('notes-on', on); tg.setAttribute('aria-pressed', String(on)); $('.tools__t', tg).textContent = on ? 'Hide design notes' : 'Why this layout?'; };
  tg.addEventListener('click', () => setNotes(!document.body.classList.contains('notes-on')));
  if (/[?&]notes=1/.test(location.search)) { document.body.classList.add('notes-avail'); setNotes(true); }
})();
