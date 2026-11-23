/* Arena Legal Consulting GmbH — home page concept v2 */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  var isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- toast ---------- */
  var toastEl = $('.toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3600);
  }

  /* =====================================================
     Smooth scroll (Lenis) + GSAP wiring — runs after libs load
     ===================================================== */
  var lenis = null;
  function scrollToEl(el) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id === '#' || id === '#privacy') return;
    var t = $(id);
    if (!t) return;
    e.preventDefault();
    closeMenu();
    scrollToEl(t);
    if (id === '#book') setTimeout(function () { var f = $('#b-name'); if (f && window.innerWidth > 720) f.focus({ preventScroll: true }); }, 1500);
  });

  /* ---------- header, progress, mobile bar ---------- */
  var hdr = $('.hdr');
  var bar = $('.progress span');
  var mbar = $('.mbar');
  var hero = $('.hero');
  var book = $('#book');
  var darkSecs = $$('.hero, .process, .magnet, .book, .ftr');
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    hdr.classList.toggle('is-solid', y > 40);
    var onDark = darkSecs.some(function (s) { var r = s.getBoundingClientRect(); return r.top <= 44 && r.bottom >= 44; });
    hdr.classList.toggle('on-dark', onDark);
    var heroOut = hero.getBoundingClientRect().bottom < 80;
    var b = book.getBoundingClientRect();
    var bookIn = b.top < window.innerHeight * .9 && b.bottom > 0;
    var show = heroOut && !bookIn;
    mbar.classList.toggle('is-on', show);
    document.body.classList.toggle('has-mbar', show);
    words();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ---------- menu ---------- */
  var burger = $('.burger'), menu = $('#menu');
  function closeMenu() {
    if (!root.classList.contains('menu-open')) return;
    root.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    menu.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
  }
  burger.addEventListener('click', function () {
    if (root.classList.contains('menu-open')) { closeMenu(); return; }
    root.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    menu.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- active nav ---------- */
  var navLinks = $$('.hdr__nav a');
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) navLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (l) { var t = $(l.getAttribute('href')); if (t) navIO.observe(t); });
  }

  /* ---------- reveals ---------- */
  var rvs = $$('.rv');
  function finish(el) { setTimeout(function () { el.classList.remove('rv', 'is-in'); el.style.transitionDelay = ''; }, 1400); }
  if ('IntersectionObserver' in window && !reduced) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var sib = $$('.rv', el.parentElement);
        el.style.transitionDelay = Math.min(Math.max(0, sib.indexOf(el)) * 90, 360) + 'ms';
        el.classList.add('is-in');
        rio.unobserve(el);
        finish(el);
      });
    }, { threshold: .1, rootMargin: '0px 0px -6% 0px' });
    rvs.forEach(function (el) { rio.observe(el); });
  } else rvs.forEach(function (el) { el.classList.add('is-in'); });
  setTimeout(function () { rvs.forEach(function (el) { if (el.classList.contains('rv') && el.getBoundingClientRect().top < window.innerHeight) { el.classList.add('is-in'); finish(el); } }); }, 3000);

  /* ---------- manifesto: words light up while scrolling ---------- */
  var wordsEl = $('.js-words');
  var wordSpans = [];
  (function split(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
      if (ch.nodeType === 3) {
        var frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); wordSpans.push(s);
        });
        node.replaceChild(frag, ch);
      } else if (ch.nodeType === 1) split(ch);
    });
  })(wordsEl);
  function words() {
    if (reduced) return;
    var r = wordsEl.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = clamp((vh * .82 - r.top) / (r.height + vh * .25), 0, 1);
    var n = Math.round(p * wordSpans.length);
    for (var i = 0; i < wordSpans.length; i++) wordSpans[i].classList.toggle('on', i < n);
  }
  if (reduced) wordSpans.forEach(function (w) { w.classList.add('on'); });

  /* ---------- counters ---------- */
  function countUp(el) {
    var end = +el.getAttribute('data-count');
    if (reduced) { el.textContent = end.toLocaleString('en-US'); return; }
    var t0 = null;
    (function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1800, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * e).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  var cnt = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } }); }, { threshold: .5 });
    cnt.forEach(function (c) { cio.observe(c); });
  } else cnt.forEach(countUp);

  /* ---------- signature draw ---------- */
  var sig = $('.sig');
  if ('IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { sig.classList.add('is-in'); sio.disconnect(); } }, { threshold: .6 });
    sio.observe(sig);
  } else sig.classList.add('is-in');

  /* ---------- live Berlin clock & opening status ---------- */
  function berlin() {
    var parts = {};
    try {
      new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
        .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    } catch (e) { var d = new Date(); parts = { weekday: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()], hour: String(d.getHours()).padStart(2, '0'), minute: String(d.getMinutes()).padStart(2, '0') }; }
    var h = +parts.hour % 24, m = +parts.minute;
    var open = ['Sat', 'Sun'].indexOf(parts.weekday) < 0 && (h * 60 + m) >= 480 && (h * 60 + m) < 1140;
    $$('.js-clock').forEach(function (el) { el.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'); });
    $$('.js-open-text').forEach(function (el) { el.textContent = open ? "We're open — average reply 3 h" : 'Closed now — we reply first thing tomorrow'; });
    $$('.js-open-status').forEach(function (el) { el.textContent = open ? 'Open now · Berlin' : 'Online booking open'; });
    $$('.hdr__status .live, .b__open .live').forEach(function (el) { el.classList.toggle('is-off', !open); });
  }
  berlin(); setInterval(berlin, 30000);

  /* ---------- services: accordion + floating image ---------- */
  var svcItems = $$('.svc__item');
  svcItems.forEach(function (it) {
    var btn = $('.svc__row', it);
    btn.addEventListener('click', function () {
      var open = !it.classList.contains('is-open');
      svcItems.forEach(function (o) { o.classList.remove('is-open'); $('.svc__row', o).setAttribute('aria-expanded', 'false'); });
      if (open) { it.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
      setTimeout(function () { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); }, 700);
    });
  });
  var hov = $('.hover-img'), hovIn = $('.hover-img__in');
  var mx = innerWidth / 2, my = innerHeight / 2, hx = mx, hy = my;
  window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
  if (finePointer) {
    svcItems.forEach(function (it) {
      var row = $('.svc__row', it);
      var img = it.getAttribute('data-img');
      var pre = new Image(); pre.src = img;
      row.addEventListener('mouseenter', function () { hovIn.style.backgroundImage = 'url("' + img + '")'; hov.classList.add('is-on'); });
      row.addEventListener('mouseleave', function () { hov.classList.remove('is-on'); });
    });
  }

  /* ---------- custom cursor ---------- */
  var cur = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
  var rx = mx, ry = my;
  if (finePointer && !reduced) {
    root.classList.add('has-cursor');
    document.addEventListener('mouseover', function (e) {
      var t = e.target;
      var lab = t.closest('.svc__row') ? (t.closest('.svc__item').classList.contains('is-open') ? 'Close' : 'Open') : t.closest('.slider') ? 'Drag' : '';
      cur.classList.toggle('is-label', !!lab);
      label.textContent = lab;
      cur.classList.toggle('is-link', !lab && !!t.closest('a, button, label, input, select, summary'));
    });
    // content moves under a still pointer while scrolling — re-evaluate the label
    window.addEventListener('scroll', function () {
      var el = document.elementFromPoint(mx, my);
      if (el) el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    }, { passive: true });
    document.addEventListener('mouseleave', function () { cur.classList.add('is-hidden'); });
    document.addEventListener('mouseenter', function () { cur.classList.remove('is-hidden'); });
  }
  (function loop() {
    hx += (mx - hx) * .12; hy += (my - hy) * .12;
    rx += (mx - rx) * .2; ry += (my - ry) * .2;
    if (hov) hov.style.left = hx + 'px', hov.style.top = hy + 'px';
    if (finePointer && !reduced) {
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
    }
    requestAnimationFrame(loop);
  })();

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduced) {
    $$('.magnetic').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .22) + 'px,' + ((e.clientY - r.top - r.height / 2) * .3) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- review slider drag ---------- */
  var slider = $('.slider');
  (function () {
    var down = false, sx = 0, sl = 0, moved = 0;
    slider.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = 0; sx = e.clientX; sl = slider.scrollLeft; slider.classList.add('is-drag');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      moved = Math.abs(e.clientX - sx);
      slider.scrollLeft = sl - (e.clientX - sx) * 1.2;
    });
    window.addEventListener('pointerup', function () { if (down) { down = false; slider.classList.remove('is-drag'); } });
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') slider.scrollBy({ left: 360, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') slider.scrollBy({ left: -360, behavior: 'smooth' });
    });
  })();

  /* ---------- 3D paper tilt ---------- */
  var paper = $('.paper'), mv = $('.magnet__visual');
  if (finePointer && !reduced && paper) {
    mv.addEventListener('mousemove', function (e) {
      var r = mv.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      paper.style.transform = 'rotateY(' + (x * 24) + 'deg) rotateX(' + (-y * 18) + 'deg) rotate(-2deg)';
    });
    mv.addEventListener('mouseleave', function () { paper.style.transform = ''; });
  }

  /* =====================================================
     Hero triage — micro-commitment multi-step form
     ===================================================== */
  var tri = $('#triage');
  var panes = $$('.tri__pane', tri);
  var triBar = $('.tri__bar span', tri), triN = $('.tri__count b', tri);
  function go(n) {
    panes.forEach(function (p) { p.classList.toggle('is-on', +p.getAttribute('data-step') === n); });
    triBar.style.width = (n / 3 * 100) + '%';
    triN.textContent = '0' + n;
    if (n === 3 && window.innerWidth > 720) $('#t-name').focus({ preventScroll: true });
  }
  $$('input[name="area"]', tri).forEach(function (r) { r.addEventListener('change', function () { setTimeout(function () { go(2); }, 260); }); });
  $$('input[name="urgency"]', tri).forEach(function (r) { r.addEventListener('change', function () { setTimeout(function () { go(3); }, 260); }); });
  $$('.tri__back', tri).forEach(function (b) { b.addEventListener('click', function () { go(+b.closest('.tri__pane').getAttribute('data-step') - 1); }); });

  function validate(form, rules) {
    var ok = true;
    rules.forEach(function (r) {
      var el = form.querySelector(r.sel); if (!el) return;
      var good = r.test(el);
      var w = el.closest('.fld') || el.closest('.consent');
      if (w) w.classList.toggle('is-err', !good);
      if (!good && ok) { el.focus({ preventScroll: false }); ok = false; }
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
    $('.tri__bar', tri).style.visibility = 'hidden';
    $('.tri__top', tri).style.visibility = 'hidden';
    $('.tri__done', tri).hidden = false;
    $('#b-name').value = $('#t-name').value;
    $('#b-mail').value = $('#t-mail').value;
    $('#b-tel').value = $('#t-tel').value;
    var a = tri.querySelector('[name="area"]:checked');
    if (a) setArea(a.value);
    $$('#booker .fld input').forEach(function (i) { i.dispatchEvent(new Event('input')); });
  });

  function setArea(v) {
    var sel = $('#b-area');
    $$('option', sel).forEach(function (o) { if (o.textContent === v) sel.value = o.value || o.textContent; });
  }
  $$('[data-area]').forEach(function (b) { b.addEventListener('click', function () { setArea(b.getAttribute('data-area')); }); });

  /* =====================================================
     Booking widget
     ===================================================== */
  var daysEl = $('.days'), timesEl = $('.times');
  var TIMES = ['09:00', '10:30', '12:00', '13:30', '14:30', '15:30', '16:30', '18:00'];
  var WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var now = new Date(), selDay = null, selTime = null, days = [];
  var d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  while (days.length < 5) { if (d.getDay() % 6 !== 0) days.push(new Date(d)); d.setDate(d.getDate() + 1); }
  var isToday = function (x) { return x.toDateString() === now.toDateString(); };
  function radioKeys(c) {
    c.addEventListener('keydown', function (e) {
      var items = $$('.slot:not(:disabled)', c), i = items.indexOf(document.activeElement), n = null;
      if (i < 0) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = items[(i + 1) % items.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = items[(i - 1 + items.length) % items.length];
      if (n) { e.preventDefault(); n.focus(); n.click(); }
    });
  }
  function mk(html, label) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'slot'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false');
    b.innerHTML = html; if (label) b.setAttribute('aria-label', label);
    return b;
  }
  function pick(c, b) {
    $$('.slot', c).forEach(function (s) { s.setAttribute('aria-checked', 'false'); if (!s.disabled) s.tabIndex = -1; });
    b.setAttribute('aria-checked', 'true'); b.tabIndex = 0;
  }
  days.forEach(function (day, i) {
    var b = mk('<small>' + (isToday(day) ? 'Today' : WD[day.getDay()]) + '</small><b>' + day.getDate() + '</b><span class="m">' + MO[day.getMonth()] + '</span>', WD[day.getDay()] + ' ' + day.getDate() + ' ' + MO[day.getMonth()]);
    b.tabIndex = i ? -1 : 0;
    b.addEventListener('click', function () { pick(daysEl, b); selDay = day; renderTimes(day, i); });
    daysEl.appendChild(b);
  });
  radioKeys(daysEl); radioKeys(timesEl);
  function renderTimes(day, idx) {
    timesEl.innerHTML = ''; selTime = null;
    var first = true;
    TIMES.forEach(function (t, j) {
      var b = mk(t);
      var hm = t.split(':');
      var past = isToday(day) && (+hm[0] * 60 + +hm[1]) <= now.getHours() * 60 + now.getMinutes() + 30;
      var taken = ((idx * 3 + j * 5) % 7) === 0;
      if (past || taken) { b.disabled = true; b.setAttribute('aria-label', t + ' unavailable'); }
      else { b.tabIndex = first ? 0 : -1; first = false; }
      b.addEventListener('click', function () { pick(timesEl, b); selTime = t; });
      timesEl.appendChild(b);
    });
    if (first) { var nx = $$('.slot', daysEl)[idx + 1]; if (nx) nx.click(); }
  }
  $$('.slot', daysEl)[0].click();
  (function () {
    var ff = $('.slot:not(:disabled)', timesEl);
    if (ff && selDay) $$('.js-next-slot').forEach(function (el) { el.textContent = (isToday(selDay) ? 'today' : WD[selDay.getDay()]) + ', ' + ff.textContent; });
  })();

  var bk = $('#booker'), note = $('.bk__note', bk);
  bk.addEventListener('submit', function (e) {
    e.preventDefault();
    note.textContent = '';
    if (!selTime) { note.textContent = 'Please choose a time slot.'; var f = $('.slot:not(:disabled)', timesEl); if (f) f.focus(); return; }
    if (!validate(bk, [
      { sel: '[name="name"]', test: filled },
      { sel: '[name="phone"]', test: function (el) { return el.value.replace(/\D/g, '').length >= 6; } },
      { sel: '[name="email"]', test: mailOk },
      { sel: '[name="area"]', test: function (el) { return !!el.value; } },
      { sel: '[name="consent"]', test: checked }
    ])) { note.textContent = 'Please complete the highlighted fields.'; return; }
    $('.bk__pane', bk).classList.remove('is-on');
    $('.bk__done', bk).hidden = false;
    $('.bk__sum', bk).textContent = WD[selDay.getDay()] + ', ' + selDay.getDate() + ' ' + MO[selDay.getMonth()] + ' · ' + selTime + ' CET';
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    scrollToEl(bk);
  });

  /* ---------- lead magnet forms ---------- */
  function magnet(form, after) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = form.querySelector('input');
      if (!isEmail(inp.value)) { form.classList.add('is-err'); inp.focus(); toast('Please enter a valid email address.'); return; }
      form.classList.remove('is-err');
      form.innerHTML = '<p class="inl__ok">✓ On its way — check your inbox.</p>';
      store.set('arena_lead', '1');
      toast('Checklist sent — check your inbox.');
      if (after) after();
    });
  }
  magnet($('#magnet-form'));
  magnet($('#exit-form'), function () { setTimeout(closeModal, 1400); });

  /* ---------- exit intent (desktop, once per session, never on arrival) ---------- */
  var modal = $('#exit-modal'), lastF = null, armed = false;
  function openModal() {
    if (store.sget('arena_exit') || store.get('arena_lead') || document.body.classList.contains('cro-on') || !$('.bk__done').hidden) return;
    store.sset('arena_exit', '1');
    lastF = document.activeElement; modal.hidden = false; $('#x-mail').focus();
    if (lenis) lenis.stop();
  }
  function closeModal() { modal.hidden = true; if (lenis) lenis.start(); if (lastF) lastF.focus(); }
  $('.modal__x', modal).addEventListener('click', closeModal);
  $('.modal__no', modal).addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  setTimeout(function () { armed = true; }, 15000);
  document.addEventListener('mouseout', function (e) {
    if (!armed || e.relatedTarget || e.clientY > 8) return;
    if (window.matchMedia('(hover: hover) and (min-width: 900px)').matches) openModal();
  });

  /* ---------- cookie consent (shown after first scroll, never over the hero CTA) ---------- */
  var cookie = $('#cookie');
  if (!store.get('arena_cookie')) {
    var showC = function () { window.removeEventListener('scroll', firstS); if (!store.get('arena_cookie')) cookie.hidden = false; };
    var firstS = function () { if (window.scrollY > 400) showC(); };
    window.addEventListener('scroll', firstS, { passive: true });
    setTimeout(showC, 9000);
  }
  $$('[data-cookie]').forEach(function (b) {
    b.addEventListener('click', function () {
      store.set('arena_cookie', b.getAttribute('data-cookie')); cookie.hidden = true;
      toast(b.getAttribute('data-cookie') === 'all' ? 'Thanks — preferences saved.' : 'Only essential cookies will be used.');
    });
  });
  $$('[data-open-cookies]').forEach(function (b) { b.addEventListener('click', function () { cookie.hidden = false; }); });
  $$('a[href="#privacy"]').forEach(function (a) {
    if (a.closest('.ftr__legal') || a.closest('.consent') || a.closest('.cookie')) a.addEventListener('click', function (e) { e.preventDefault(); toast('Impressum & Datenschutz pages are added in the WordPress build.'); });
  });

  /* =====================================================
     Design-rationale mode (for presenting to the client)
     ===================================================== */
  var NOTES = {
    header: ['Floating header, one CTA', 'Navigation follows the buyer’s questions (what → how → why → price). The terracotta “Free assessment” button and a live “Open now” status stay visible on every scroll position.'],
    hero: ['Hero = the 5-second test', 'Big promise + the #1 objection (price) answered in the headline. One primary CTA, phone as backup, and review proof directly under the buttons. The bright 3-step case check on the dark background is the first thing the eye lands on — tap, tap, details — micro-commitments convert far better than a long form.'],
    logos: ['Borrowed credibility', 'Client logos straight after the hero reassure visitors that “companies like mine” already trust Arena. (Placeholder logos.)'],
    manifesto: ['Empathy before selling', 'The statement lights up word by word as you scroll — it holds attention and names the three real fears. Below, each fear is mirrored with a concrete Arena promise.'],
    services: ['Interactive price-transparent services', 'An editorial index with a “from €” price on every line removes the biggest reason SMEs avoid lawyers. Hovering previews an image; clicking opens details and a CTA that pre-selects the topic in the booking form.'],
    process: ['Reduce perceived effort', 'A pinned, horizontal three-step journey (each with a timeframe) shows how easy it is to begin. The last panel ends on a free CTA.'],
    why: ['Proof in one glance (bento)', 'Fixed fee vs hourly billing, a LIVE Berlin clock with “open now” status, rating, comparison table, languages and confidentiality — every tile kills one objection.'],
    reviews: ['Social proof with results', 'One featured story with a measurable result, then a draggable row of reviews from different client types so every visitor finds “someone like me”.'],
    team: ['Put a face to the firm', 'Legal advice is bought from people. A personal letter from the founder with an animated signature, credentials and the team builds trust no stock gavel ever will.'],
    fees: ['Transparent pricing + anchoring', 'Three options; the dark “Most popular” retainer in the middle anchors attention and creates recurring revenue. €0 assessment = zero-risk entry. A written fixed-fee promise closes the deal.'],
    magnet: ['Capture the not-ready-yet', 'Most visitors won’t book on their first visit. A genuinely useful checklist turns them into email leads instead of lost traffic.'],
    faq: ['Objection handling', 'The last doubts (cost, confidentiality, language, urgency) are answered right before the final booking step.'],
    book: ['Final conversion: self-booking', 'A huge “Let’s talk. It’s free.” plus a calendar with real free slots creates gentle urgency and removes email back-and-forth. Short form, GDPR consent, every contact option beside it.'],
    footer: ['Last chance + legal compliance', 'The CTA repeats for visitors who scroll to the end. Impressum, Datenschutz and cookie settings are mandatory in Germany. The giant wordmark ends the page memorably.']
  };
  var croBtn = $('.cro-toggle'), croTxt = $('.cro-toggle__txt'), croOn = false;
  function renderCro(on) {
    $$('.cro-pin').forEach(function (p) { p.remove(); });
    document.body.classList.toggle('cro-on', on);
    croBtn.setAttribute('aria-pressed', String(on));
    croTxt.textContent = on ? 'Hide design rationale' : 'Show design rationale';
    if (!on) return;
    var n = 0;
    $$('[data-cro]').forEach(function (sec) {
      var k = sec.getAttribute('data-cro'), note = NOTES[k];
      if (!note) return;
      n++;
      var pin = document.createElement('div');
      pin.className = 'cro-pin' + (['hero', 'why', 'book', 'process'].indexOf(k) > -1 ? ' cro-pin--r' : '');
      if (k === 'hero') pin.style.top = '96px';
      pin.innerHTML = '<b class="n">' + n + '</b><span><strong></strong></span>';
      pin.querySelector('strong').textContent = note[0];
      pin.querySelector('span').appendChild(document.createTextNode(note[1]));
      (k === 'process' ? $('.process__pin') : sec).appendChild(pin);
    });
  }
  croBtn.addEventListener('click', function () { croOn = !croOn; renderCro(croOn); if (croOn) toast('Design rationale on — scroll to see why each section exists.'); });
  if (/[?&]notes=1/.test(location.search)) { croOn = true; renderCro(true); }

  /* =====================================================
     Motion layer (GSAP + Lenis) — progressive enhancement
     ===================================================== */
  function motion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!reduced && window.Lenis) {
      lenis = new window.Lenis({ lerp: .1, smoothWheel: true });
      if (gsap) {
        gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
        gsap.ticker.lagSmoothing(0);
      } else {
        (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
      }
      if (ST) lenis.on('scroll', ST.update);
    }
    if (!gsap || reduced) { onScroll(); return; }
    if (ST) gsap.registerPlugin(ST);

    // hero intro
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero__title .ln__in', { yPercent: 115, duration: 1.4, stagger: .12 }, .1)
      .from('.h-img', { width: 0, duration: 1.4, ease: 'expo.inOut' }, .35)
      .from('.hero .kicker, .hero__lead, .hero__cta, .hero__proof', { y: 24, opacity: 0, duration: 1, stagger: .08 }, .6)
      .from('.tri', { y: 60, opacity: 0, rotate: 2, duration: 1.2 }, .55)
      .from('.hdr__bar', { y: -30, opacity: 0, duration: 1 }, .2)
      .from('.hero__marquee', { opacity: 0, duration: 1 }, 1);
    var arches = $$('.hero__arches path');
    arches.forEach(function (p) { var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
    tl.to(arches, { strokeDashoffset: 0, duration: 2.4, stagger: .15, ease: 'power2.inOut' }, .2);

    if (!ST) { onScroll(); return; }

    // hero parallax
    gsap.to('.hero__arches', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__glow', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // image parallax
    gsap.fromTo('.team__portrait img', { yPercent: -8 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.team__portrait', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.manifesto__img img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.story__img img', { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'center center', scrub: true } });
    gsap.from('.ftr__word', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '.ftr', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    gsap.from('.book__title .ln__in', { yPercent: 115, duration: 1.3, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.book__title', start: 'top 85%' } });
    gsap.from('.svc__item', { y: 40, opacity: 0, duration: 1, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: '.svc', start: 'top 85%' } });

    // process: horizontal pinned scroll on desktop
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1025px)', function () {
      var sec = $('.process'), track = $('.process__track');
      sec.classList.add('is-hz');
      var archesP = $$('.pp__arch');
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var tw = gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: {
          trigger: sec, start: 'top top', end: function () { return '+=' + dist(); },
          pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function (self) {
            archesP.forEach(function (a, i) { a.style.setProperty('--fill', Math.round(clamp(self.progress * 3.2 - i * .9, .1, 1) * 100) + '%'); });
          }
        }
      });
      return function () { sec.classList.remove('is-hz'); tw.kill(); gsap.set(track, { clearProps: 'transform' }); };
    });
    window.addEventListener('load', function () { ST.refresh(); });
    onScroll();
  }
  // deferred scripts run in order, so GSAP/Lenis are ready here — start immediately to avoid a flash before the intro
  motion();
})();
