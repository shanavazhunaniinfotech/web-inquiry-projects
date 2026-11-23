/* Arena Legal — Version B "Clarity" */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  var isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };

  var toastEl = $('.toast'), toastT;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3600); }

  /* ---------- smooth anchors ---------- */
  var lenis = null;
  function scrollToEl(el) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -96, duration: 1.3 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id === '#' || id === '#privacy') return;
    var t = $(id); if (!t) return;
    e.preventDefault(); closeSheet(); scrollToEl(t);
  });

  /* ---------- header / mobile bar ---------- */
  var hdr = $('.hdr'), mbar = $('.mbar'), hero = $('.hero'), book = $('#book');
  function onScroll() {
    var y = window.scrollY;
    hdr.classList.toggle('is-solid', y > 30);
    var heroOut = hero.getBoundingClientRect().bottom < 120;
    var b = book.getBoundingClientRect();
    var show = heroOut && !(b.top < window.innerHeight * .9 && b.bottom > 0);
    mbar.classList.toggle('is-on', show);
    document.body.classList.toggle('has-mbar', show);
    processProgress();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ---------- mobile sheet ---------- */
  var burger = $('.burger'), sheet = $('#sheet');
  function closeSheet() {
    if (!root.classList.contains('sheet-open')) return;
    root.classList.remove('sheet-open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); sheet.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
  }
  burger.addEventListener('click', function () {
    if (root.classList.contains('sheet-open')) { closeSheet(); return; }
    root.classList.add('sheet-open'); burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Close menu'); sheet.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
  });
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });

  /* ---------- active nav ---------- */
  var navLinks = $$('.hdr__nav a');
  if ('IntersectionObserver' in window) {
    var nio = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) navLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (l) { var t = $(l.getAttribute('href')); if (t) nio.observe(t); });
  }

  /* ---------- reveals ---------- */
  var ups = $$('.up');
  function done(el) { setTimeout(function () { el.classList.remove('up', 'is-in'); el.style.transitionDelay = ''; }, 1300); }
  if ('IntersectionObserver' in window && !reduced) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, sib = $$('.up', el.parentElement);
        el.style.transitionDelay = Math.min(Math.max(0, sib.indexOf(el)) * 70, 350) + 'ms';
        el.classList.add('is-in'); rio.unobserve(el); done(el);
      });
    }, { threshold: .08, rootMargin: '0px 0px -5% 0px' });
    ups.forEach(function (el) { rio.observe(el); });
  } else ups.forEach(function (el) { el.classList.add('is-in'); });
  setTimeout(function () { ups.forEach(function (el) { if (el.classList.contains('up') && el.getBoundingClientRect().top < innerHeight) { el.classList.add('is-in'); done(el); } }); }, 3000);

  /* ---------- rotating audience word ---------- */
  var words = $$('.rot__w'), wi = 0;
  if (!reduced && words.length) {
    setInterval(function () {
      var cur = words[wi]; wi = (wi + 1) % words.length; var nx = words[wi];
      cur.classList.remove('is-on'); cur.classList.add('is-out');
      nx.classList.remove('is-out'); nx.classList.add('is-on');
      setTimeout(function () { cur.classList.remove('is-out'); }, 650);
    }, 2200);
  }

  /* ---------- hero stage mouse parallax ---------- */
  var stage = $('.stage'), floats = $$('.float');
  if (fine && !reduced) {
    var tx = 0, ty = 0, cx = 0, cy = 0;
    stage.addEventListener('mousemove', function (e) {
      var r = stage.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5;
    });
    stage.addEventListener('mouseleave', function () { tx = 0; ty = 0; });
    (function loop() {
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      floats.forEach(function (f) { var d = +f.getAttribute('data-d'); f.style.transform = 'translate3d(' + (cx * d * 2) + 'px,' + (cy * d * 2) + 'px,0)'; });
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- spotlight cards ---------- */
  if (fine) {
    $$('.spot').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- switch: traditional vs Arena ---------- */
  var tog = $('.toggle'), cmp = $('.cmp'), sum = $('.cmp__sum'), userTouched = false;
  function setMode(m) {
    tog.setAttribute('data-mode', m);
    $$('.toggle__b', tog).forEach(function (b) { var on = b.getAttribute('data-mode') === m; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', String(on)); });
    cmp.classList.toggle('is-old', m === 'old'); sum.classList.toggle('is-old', m === 'old');
  }
  $$('.toggle__b', tog).forEach(function (b) { b.addEventListener('click', function () { userTouched = true; setMode(b.getAttribute('data-mode')); }); });
  // demo the switch once when it scrolls into view: show the "before", then flip to Arena
  if ('IntersectionObserver' in window && !reduced) {
    setMode('old');
    var swio = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      swio.disconnect();
      setTimeout(function () { if (!userTouched) setMode('new'); }, 1400);
    }, { threshold: .45 });
    swio.observe(cmp);
  } else setMode('new');

  /* ---------- process: rail + scaling stacked cards ---------- */
  var procSec = $('.process'), rail = $('.rail'), railI = $$('.rail i'), cards = $$('.sc'), ring = $('.ring');
  function processProgress() {
    if (!procSec) return;
    var r = $('.stack').getBoundingClientRect();
    var p = clamp((innerHeight * .5 - r.top) / (r.height - innerHeight * .3), 0, 1);
    rail.style.setProperty('--p', p.toFixed(3));
    railI.forEach(function (el, i) { el.classList.toggle('is-on', p >= i / 2 - .02); });
    if (p > .85 && ring) ring.classList.add('is-in');
    if (reduced || innerWidth < 640) return;
    cards.forEach(function (c, i) {
      var next = cards[i + 1]; if (!next) { c.style.transform = ''; return; }
      var nr = next.getBoundingClientRect(), cr = c.getBoundingClientRect();
      var overlap = clamp((cr.bottom - nr.top) / cr.height, 0, 1);
      c.style.transform = 'scale(' + (1 - overlap * .06) + ')';
      c.style.filter = 'brightness(' + (1 - overlap * .08) + ')';
    });
  }

  /* ---------- counters ---------- */
  function countUp(el) {
    var end = +el.getAttribute('data-count');
    if (reduced) { el.textContent = fmt(end); return; }
    var t0 = null;
    (function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1700, 1); el.textContent = fmt(end * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); })(performance.now());
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } }); }, { threshold: .5 });
    $$('[data-count]').forEach(function (c) { cio.observe(c); });
  } else $$('[data-count]').forEach(countUp);

  /* ---------- live Berlin clock ---------- */
  function berlin() {
    var parts = {};
    try { new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; }); }
    catch (e) { var d = new Date(); parts = { weekday: 'Mon', hour: String(d.getHours()), minute: String(d.getMinutes()) }; }
    var h = +parts.hour % 24, m = +parts.minute;
    var open = ['Sat', 'Sun'].indexOf(parts.weekday) < 0 && h * 60 + m >= 480 && h * 60 + m < 1140;
    $$('.js-clock').forEach(function (el) { el.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'); });
    $$('.js-open-text').forEach(function (el) { el.textContent = open ? "● We're open — avg. reply 3 h" : '● Closed — we reply first thing tomorrow'; el.classList.toggle('is-off', !open); });
    $$('.js-open-status').forEach(function (el) { el.textContent = open ? 'Advisors online now' : 'Online booking open 24/7'; });
    $$('.badge .live').forEach(function (el) { el.classList.toggle('is-off', !open); });
  }
  berlin(); setInterval(berlin, 30000);

  /* ---------- review wall: duplicate for a seamless loop ---------- */
  $$('.wall__move').forEach(function (m) {
    $$('.rv', m).forEach(function (r) { var c = r.cloneNode(true); c.setAttribute('aria-hidden', 'true'); m.appendChild(c); });
  });

  /* ---------- team panels ---------- */
  var panels = $$('.panel');
  function openPanel(p) { panels.forEach(function (o) { var on = o === p; o.classList.toggle('is-open', on); o.setAttribute('aria-expanded', String(on)); }); }
  panels.forEach(function (p) {
    p.addEventListener('click', function () { openPanel(p); });
    if (fine) p.addEventListener('mouseenter', function () { openPanel(p); });
  });

  /* ---------- fixed-fee estimator ---------- */
  var est = { p: 490, m: 1, x: false, v: 'Contracts' }, estEl = $('.js-est'), oldEl = $('.js-est-old'), shown = 490;
  function calc() {
    var price = Math.round(est.p * est.m * (est.x ? 1.25 : 1) / 10) * 10;
    var hourly = Math.round(price * 3.6 / 50) * 50;
    oldEl.textContent = fmt(hourly);
    if (reduced) { estEl.textContent = fmt(price); shown = price; return; }
    var from = shown, t0 = null;
    (function step(t) { if (!t0) t0 = t; var k = Math.min((t - t0) / 500, 1), e = 1 - Math.pow(1 - k, 3); estEl.textContent = fmt(from + (price - from) * e); if (k < 1) requestAnimationFrame(step); else shown = price; })(performance.now());
  }
  $$('.seg').forEach(function (seg) {
    $$('button', seg).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', seg).forEach(function (o) { o.classList.toggle('is-on', o === b); });
        if (seg.getAttribute('data-k') === 'svc') { est.p = +b.getAttribute('data-p'); est.v = b.getAttribute('data-v'); }
        else est.m = +b.getAttribute('data-m');
        calc();
      });
    });
  });
  $('#express').addEventListener('change', function (e) { est.x = e.target.checked; calc(); });
  $('.js-est-cta').addEventListener('click', function () { setArea(est.v); });

  /* =====================================================
     Hero triage
     ===================================================== */
  var tri = $('#triage'), panes = $$('.tri__pane', tri), triBar = $('.tri__bar span', tri), triN = $('.tri__count b', tri);
  function go(n) {
    panes.forEach(function (p) { p.classList.toggle('is-on', +p.getAttribute('data-step') === n); });
    triBar.style.width = (n / 3 * 100) + '%'; triN.textContent = n;
    if (n === 3 && innerWidth > 720) $('#t-name').focus({ preventScroll: true });
  }
  $$('input[name="area"]', tri).forEach(function (r) { r.addEventListener('change', function () { setTimeout(function () { go(2); }, 240); }); });
  $$('input[name="urgency"]', tri).forEach(function (r) { r.addEventListener('change', function () { setTimeout(function () { go(3); }, 240); }); });
  $$('.tri__back', tri).forEach(function (b) { b.addEventListener('click', function () { go(+b.closest('.tri__pane').getAttribute('data-step') - 1); }); });

  function validate(form, rules) {
    var ok = true;
    rules.forEach(function (r) {
      var el = form.querySelector(r.sel); if (!el) return;
      var good = r.test(el), w = el.closest('.fld') || el.closest('.consent');
      if (w) w.classList.toggle('is-err', !good);
      if (!good && ok) { el.focus(); ok = false; }
    });
    return ok;
  }
  var filled = function (el) { return el.value.trim().length > 1; };
  var mailOk = function (el) { return isEmail(el.value); };
  var checked = function (el) { return el.checked; };
  $$('.fld input, .fld select, .consent input').forEach(function (el) {
    ['input', 'change'].forEach(function (ev) { el.addEventListener(ev, function () { var w = el.closest('.fld') || el.closest('.consent'); if (w) w.classList.remove('is-err'); }); });
  });
  tri.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(tri, [{ sel: '[name="name"]', test: filled }, { sel: '[name="email"]', test: mailOk }, { sel: '[name="consent"]', test: checked }])) { toast('Please complete the highlighted fields.'); return; }
    panes.forEach(function (p) { p.classList.remove('is-on'); });
    $('.tri__bar span', tri).style.width = '100%';
    $('.tri__done', tri).hidden = false;
    $('#b-name').value = $('#t-name').value; $('#b-mail').value = $('#t-mail').value; $('#b-tel').value = $('#t-tel').value;
    var a = tri.querySelector('[name="area"]:checked'); if (a) setArea(a.value);
  });
  function setArea(v) {
    var sel = $('#b-area');
    $$('option', sel).forEach(function (o) { if (o.textContent === v) sel.value = o.value || o.textContent; });
  }
  $$('[data-area]').forEach(function (b) { b.addEventListener('click', function () { setArea(b.getAttribute('data-area')); }); });

  /* =====================================================
     Booking
     ===================================================== */
  var daysEl = $('.days'), timesEl = $('.times');
  var TIMES = ['09:00', '10:30', '12:00', '13:30', '14:30', '15:30', '16:30', '18:00'];
  var WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var now = new Date(), selDay = null, selTime = null, days = [];
  var d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  while (days.length < 5) { if (d.getDay() % 6 !== 0) days.push(new Date(d)); d.setDate(d.getDate() + 1); }
  var isToday = function (x) { return x.toDateString() === now.toDateString(); };
  function mk(html, label) { var b = document.createElement('button'); b.type = 'button'; b.className = 'slot'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false'); b.innerHTML = html; if (label) b.setAttribute('aria-label', label); return b; }
  function pick(c, b) { $$('.slot', c).forEach(function (s) { s.setAttribute('aria-checked', 'false'); if (!s.disabled) s.tabIndex = -1; }); b.setAttribute('aria-checked', 'true'); b.tabIndex = 0; }
  function keys(c) {
    c.addEventListener('keydown', function (e) {
      var it = $$('.slot:not(:disabled)', c), i = it.indexOf(document.activeElement), n = null; if (i < 0) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = it[(i + 1) % it.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = it[(i - 1 + it.length) % it.length];
      if (n) { e.preventDefault(); n.focus(); n.click(); }
    });
  }
  days.forEach(function (day, i) {
    var b = mk('<small>' + (isToday(day) ? 'Today' : WD[day.getDay()]) + '</small><b>' + day.getDate() + '</b><span class="m">' + MO[day.getMonth()] + '</span>', WD[day.getDay()] + ' ' + day.getDate() + ' ' + MO[day.getMonth()]);
    b.tabIndex = i ? -1 : 0;
    b.addEventListener('click', function () { pick(daysEl, b); selDay = day; renderTimes(day, i); });
    daysEl.appendChild(b);
  });
  keys(daysEl); keys(timesEl);
  function renderTimes(day, idx) {
    timesEl.innerHTML = ''; selTime = null; var first = true;
    TIMES.forEach(function (t, j) {
      var b = mk(t), hm = t.split(':');
      var past = isToday(day) && +hm[0] * 60 + +hm[1] <= now.getHours() * 60 + now.getMinutes() + 30;
      var taken = ((idx * 3 + j * 5) % 7) === 0;
      if (past || taken) { b.disabled = true; b.setAttribute('aria-label', t + ' unavailable'); } else { b.tabIndex = first ? 0 : -1; first = false; }
      b.addEventListener('click', function () { pick(timesEl, b); selTime = t; });
      timesEl.appendChild(b);
    });
    if (first) { var nx = $$('.slot', daysEl)[idx + 1]; if (nx) nx.click(); }
  }
  $$('.slot', daysEl)[0].click();
  (function () { var ff = $('.slot:not(:disabled)', timesEl); if (ff && selDay) $$('.js-next-slot').forEach(function (el) { el.textContent = (isToday(selDay) ? 'today' : WD[selDay.getDay()]) + ', ' + ff.textContent; }); })();

  var bk = $('#booker'), note = $('.bk__note', bk);
  bk.addEventListener('submit', function (e) {
    e.preventDefault(); note.textContent = '';
    if (!selTime) { note.textContent = 'Please choose a time slot.'; var f = $('.slot:not(:disabled)', timesEl); if (f) f.focus(); return; }
    if (!validate(bk, [
      { sel: '[name="name"]', test: filled },
      { sel: '[name="phone"]', test: function (el) { return el.value.replace(/\D/g, '').length >= 6; } },
      { sel: '[name="email"]', test: mailOk },
      { sel: '[name="area"]', test: function (el) { return !!el.value; } },
      { sel: '[name="consent"]', test: checked }
    ])) { note.textContent = 'Please complete the highlighted fields.'; return; }
    $('.bk__pane', bk).classList.remove('is-on'); $('.bk__done', bk).hidden = false;
    $('.bk__sum', bk).textContent = WD[selDay.getDay()] + ', ' + selDay.getDate() + ' ' + MO[selDay.getMonth()] + ' · ' + selTime + ' CET';
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    scrollToEl(bk);
  });

  /* ---------- lead magnet ---------- */
  function magnet(form, after) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = form.querySelector('input');
      if (!isEmail(inp.value)) { form.classList.add('is-err'); inp.focus(); toast('Please enter a valid email address.'); return; }
      form.innerHTML = '<p class="inl__ok">✓ On its way — check your inbox.</p>';
      store.set('arena_lead', '1'); toast('Checklist sent — check your inbox.'); if (after) after();
    });
  }
  magnet($('#magnet-form')); magnet($('#exit-form'), function () { setTimeout(closeModal, 1400); });

  /* ---------- exit intent ---------- */
  var modal = $('#exit-modal'), lastF = null, armed = false;
  function openModal() {
    if (store.sget('arena_exit') || store.get('arena_lead') || document.body.classList.contains('cro-on') || !$('.bk__done').hidden) return;
    store.sset('arena_exit', '1'); lastF = document.activeElement; modal.hidden = false; $('#x-mail').focus(); if (lenis) lenis.stop();
  }
  function closeModal() { modal.hidden = true; if (lenis) lenis.start(); if (lastF) lastF.focus(); }
  $('.modal__x', modal).addEventListener('click', closeModal);
  $('.modal__no', modal).addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  setTimeout(function () { armed = true; }, 15000);
  document.addEventListener('mouseout', function (e) { if (!armed || e.relatedTarget || e.clientY > 8) return; if (window.matchMedia('(hover: hover) and (min-width: 900px)').matches) openModal(); });

  /* ---------- cookies ---------- */
  var cookie = $('#cookie');
  if (!store.get('arena_cookie')) {
    var showC = function () { removeEventListener('scroll', firstS); if (!store.get('arena_cookie')) cookie.hidden = false; };
    var firstS = function () { if (scrollY > 400) showC(); };
    addEventListener('scroll', firstS, { passive: true }); setTimeout(showC, 9000);
  }
  $$('[data-cookie]').forEach(function (b) { b.addEventListener('click', function () { store.set('arena_cookie', b.getAttribute('data-cookie')); cookie.hidden = true; toast(b.getAttribute('data-cookie') === 'all' ? 'Thanks — preferences saved.' : 'Only essential cookies will be used.'); }); });
  $$('[data-open-cookies]').forEach(function (b) { b.addEventListener('click', function () { cookie.hidden = false; }); });
  $$('a[href="#privacy"]').forEach(function (a) { if (a.closest('.ftr__legal') || a.closest('.consent') || a.closest('.cookie')) a.addEventListener('click', function (e) { e.preventDefault(); toast('Impressum & Datenschutz pages are added in the WordPress build.'); }); });

  /* =====================================================
     Design-rationale mode
     ===================================================== */
  var NOTES = {
    header: ['Centered logo, one CTA', 'A calm, symmetrical header: navigation on the left follows the buyer’s questions, the blue “Free assessment” button is the only coloured element — so it is always the obvious next step.'],
    hero: ['Hero = product-style stage', 'The headline answers the #1 objection (price). The rotating word speaks directly to each audience. Below, the case check is presented like a live app, framed by floating proof (online advisor, accepted fixed quote, reply time, review) — trust and action in the same glance.'],
    logos: ['Borrowed credibility', 'An endless logo strip right after the hero says “companies like mine already trust them”. (Placeholder logos.)'],
    switch: ['Interactive before/after', 'Visitors flip between “Traditional law firm” and “Arena”. Interaction makes the difference memorable, and it automatically demonstrates itself when scrolled into view. Ends on the cost comparison and a CTA.'],
    services: ['Spotlight bento with prices', 'Each service is a card with a visible “from €” price and mini visuals (red-flag contract, GmbH steps). A light follows the cursor for a premium feel. The retainer card is blue to steer SMEs to recurring revenue.'],
    process: ['Stacking steps', 'The three steps stack on top of each other as you scroll while a progress rail fills — it feels effortless, which is exactly the message.'],
    numbers: ['Hard numbers + live status', 'Animated key figures and a live Berlin clock (“We’re open”) prove responsiveness in real time.'],
    reviews: ['Wall of love', 'An endlessly scrolling review wall shows volume of proof; a blue case card highlights a measurable result (9 days, fixed fee).'],
    team: ['Faces that expand', 'Hover or tap a person to expand their panel and read their personal promise. Humans sell legal services — not gavels.'],
    pricing: ['Pricing + live estimator', 'Three clear plans (decoy-anchored by the dark “Most popular”), then an interactive fixed-fee estimator. Playing with the estimator builds commitment; its CTA “Lock in this price” pre-fills the booking form.'],
    magnet: ['Capture the not-ready-yet', 'A free checklist turns undecided visitors into email leads instead of lost traffic.'],
    faq: ['Objection handling', 'Short, scannable answers to the last doubts, with a direct “Ask an advisor” link.'],
    book: ['Final conversion: self-booking', 'Big promise (“Get clarity in 15 minutes”), real free slots, a short form and every contact option side by side — no back-and-forth emails.'],
    footer: ['Clean, compliant footer', 'Repeats the CTA, lists every contact option, and includes the legally required Impressum, Datenschutz and cookie settings.']
  };
  var croBtn = $('.cro-toggle'), croTxt = $('.cro-toggle__txt'), croOn = false;
  function renderCro(on) {
    $$('.cro-pin').forEach(function (p) { p.remove(); });
    document.body.classList.toggle('cro-on', on); croBtn.setAttribute('aria-pressed', String(on));
    croTxt.textContent = on ? 'Hide design rationale' : 'Show design rationale';
    if (!on) return;
    var n = 0;
    $$('[data-cro]').forEach(function (sec) {
      var k = sec.getAttribute('data-cro'), nt = NOTES[k]; if (!nt) return; n++;
      var pin = document.createElement('div');
      pin.className = 'cro-pin' + (['hero', 'switch', 'pricing', 'faq'].indexOf(k) > -1 ? ' cro-pin--r' : '');
      if (k === 'hero') pin.style.top = '100px';
      pin.innerHTML = '<b class="n">' + n + '</b><span><strong></strong></span>';
      pin.querySelector('strong').textContent = nt[0]; pin.querySelector('span').appendChild(document.createTextNode(nt[1]));
      sec.appendChild(pin);
    });
  }
  croBtn.addEventListener('click', function () { croOn = !croOn; renderCro(croOn); if (croOn) toast('Design rationale on — scroll to see why each section exists.'); });
  if (/[?&]notes=1/.test(location.search)) { croOn = true; renderCro(true); }

  /* =====================================================
     Motion layer
     ===================================================== */
  (function motion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!reduced && window.Lenis) {
      lenis = new window.Lenis({ lerp: .1 });
      if (gsap) { gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
      else (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
      if (ST) lenis.on('scroll', ST.update);
    }
    if (gsap && !reduced) {
      if (ST) gsap.registerPlugin(ST);
      var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.badge', { y: 16, opacity: 0, duration: .9 }, .1)
        .from('.hero__title .split', { y: 60, opacity: 0, filter: 'blur(12px)', duration: 1.3, stagger: .12 }, .2)
        .from('.hero__sub, .hero__cta, .hero__trust', { y: 20, opacity: 0, duration: 1, stagger: .08 }, .55)
        .from('.stage', { y: 80, opacity: 0, scale: .96, duration: 1.4 }, .6)
        .from('.float', { scale: .6, opacity: 0, duration: 1, stagger: .1, ease: 'back.out(1.6)' }, 1.0)
        .from('.hdr__in', { y: -20, opacity: 0, duration: .9 }, .1);
      if (ST) {
        gsap.to('.stage', { yPercent: -4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
        addEventListener('load', function () { ST.refresh(); });
      }
    }
    onScroll();
  })();
})();
