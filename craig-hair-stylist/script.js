(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Announcement rotator */
  var ann = $$('#announceTrack p'), ai = 0;
  if (ann.length > 1) setInterval(function () {
    var cur = ann[ai]; cur.classList.remove('is-active'); cur.classList.add('is-out');
    setTimeout(function () { cur.classList.remove('is-out'); }, 500);
    ai = (ai + 1) % ann.length; ann[ai].classList.add('is-active');
  }, 4200);

  /* Header shadow + mobile bar */
  var header = $('#header'), mbar = $('#mbar');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    var book = $('#book').getBoundingClientRect();
    var nearBook = book.top < window.innerHeight && book.bottom > 0;
    mbar.classList.toggle('is-on', y > 500 && !nearBook);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Mobile menu */
  var burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }); });

  /* Reveal on scroll */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('is-in'); }); }

  /* Count-up stats */
  var counted = false, stats = $('.about__stats');
  function countUp() {
    $$('[data-count]').forEach(function (el) {
      var end = +el.dataset.count, start = performance.now(), dur = 1600;
      (function tick(now) {
        var p = Math.min((now - start) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        el.textContent = v.toLocaleString() + (end >= 1000 && p === 1 ? '+' : '');
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }
  if (stats && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e, o) { if (e[0].isIntersecting && !counted) { counted = true; countUp(); o.disconnect(); } }, { threshold: .4 }).observe(stats);
  } else countUp();

  /* Service filter tabs */
  $$('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      $$('.tab').forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
      t.classList.add('is-active'); t.setAttribute('aria-selected', 'true');
      var f = t.dataset.filter;
      $$('.svc').forEach(function (s) { s.classList.toggle('is-hidden', f !== 'all' && s.dataset.cat !== f); });
    });
  });

  /* "Book this service" pre-selects the form */
  var fService = $('#fService');
  $$('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      var name = a.dataset.service.replace('&amp;', '&');
      $$('option', fService).forEach(function (o) { if (o.textContent === name) fService.value = o.value || o.textContent; });
      updateSteps();
    });
  });

  /* Before / after */
  var cases = [
    { b: '1522337360788-8b13dee7a37e', a: '1554519934-e32b1629d9ee', bAlt: 'Before: flat, one-tone brown hair', aAlt: 'After: dimensional blonde balayage' },
    { b: '1519699047748-de8e457a634e', a: '1611601322175-ef8ec8c85f01', bAlt: 'Before: undefined, frizzy curls', aAlt: 'After: defined, glossy curls' },
    { b: '1508214751196-bcfd4ca60f91', a: '1492106087820-71f1a00d2b11', bAlt: 'Before: faded blonde', aAlt: 'After: soft pastel lavender' }
  ];
  var url = function (id) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=1000&h=1100&q=80'; };
  cases.forEach(function (c) { new Image().src = url(c.a); new Image().src = url(c.b); });
  var ba = $('#ba'), range = $('#baRange');
  range.addEventListener('input', function () { ba.style.setProperty('--pos', range.value + '%'); });
  $$('.tcase').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.tcase').forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active'); btn.setAttribute('aria-selected', 'true');
      var c = cases[+btn.dataset.i];
      ba.classList.add('is-swapping');
      setTimeout(function () {
        $('#baAfter').src = url(c.a); $('#baAfter').alt = c.aAlt;
        $('#baBefore').src = url(c.b); $('#baBefore').alt = c.bAlt;
        range.value = 50; ba.style.setProperty('--pos', '50%');
        ba.classList.remove('is-swapping');
      }, 350);
    });
  });

  /* Portfolio filter */
  $$('.fchip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      $$('.fchip').forEach(function (x) { x.classList.remove('is-active'); });
      chip.classList.add('is-active');
      var f = chip.dataset.pf;
      $$('.pf').forEach(function (p) { p.classList.toggle('is-dim', f !== 'all' && p.dataset.pf !== f); });
    });
  });

  /* Gallery rail + lightbox */
  var rail = $('#galRail');
  $('#galPrev').addEventListener('click', function () { rail.scrollBy({ left: -420, behavior: 'smooth' }); });
  $('#galNext').addEventListener('click', function () { rail.scrollBy({ left: 420, behavior: 'smooth' }); });
  var lb = $('#lightbox'), lbImg = $('#lbImg');
  function openLb(src, alt) { lbImg.src = src; lbImg.alt = alt || ''; lb.hidden = false; $('#lbClose').focus(); }
  function closeLb() { lb.hidden = true; lbImg.src = ''; }
  $$('.g-item').forEach(function (g) { g.addEventListener('click', function () { openLb(g.dataset.full, $('img', g).alt); }); });
  $$('.pf').forEach(function (p) { p.addEventListener('click', function () { var i = $('img', p); openLb(i.src.replace(/w=\d+&h=\d+/, 'w=1400'), i.alt); }); });
  $('#lbClose').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  /* Reviews carousel */
  var track = $('#rvTrack'), cards = $$('.rv'), dotsWrap = $('#rvDots'), ri = 0;
  function perView() { return window.innerWidth <= 640 ? 1 : window.innerWidth <= 960 ? 2 : 3; }
  function maxIndex() { return Math.max(0, cards.length - perView()); }
  function renderDots() {
    dotsWrap.innerHTML = '';
    for (var i = 0; i <= maxIndex(); i++) {
      var d = document.createElement('button'); d.setAttribute('aria-label', 'Go to review ' + (i + 1));
      d.addEventListener('click', (function (n) { return function () { goRv(n); }; })(i));
      dotsWrap.appendChild(d);
    }
  }
  function goRv(n) {
    ri = Math.max(0, Math.min(n, maxIndex()));
    var step = cards[0].getBoundingClientRect().width + 22;
    track.style.transform = 'translateX(' + (-ri * step) + 'px)';
    $$('button', dotsWrap).forEach(function (d, i) { d.classList.toggle('is-active', i === ri); });
  }
  $('#rvPrev').addEventListener('click', function () { goRv(ri - 1); });
  $('#rvNext').addEventListener('click', function () { goRv(ri >= maxIndex() ? 0 : ri + 1); });
  window.addEventListener('resize', function () { renderDots(); goRv(ri); });
  renderDots(); goRv(0);
  var auto = setInterval(function () { goRv(ri >= maxIndex() ? 0 : ri + 1); }, 6000);
  $('.rv-wrap').addEventListener('mouseenter', function () { clearInterval(auto); });

  /* Booking form: days, times, validation */
  var DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var daysWrap = $('#days'), d = new Date(), made = 0, chosenDay = '', chosenTime = '';
  d.setDate(d.getDate() + 1);
  while (made < 6) {
    if (d.getDay() !== 0 && d.getDay() !== 1) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'day'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false');
      b.dataset.label = DAY[d.getDay()] + ' ' + d.getDate() + ' ' + MON[d.getMonth()];
      b.innerHTML = '<small>' + DAY[d.getDay()] + '</small><strong>' + d.getDate() + '</strong>';
      daysWrap.appendChild(b); made++;
    }
    d.setDate(d.getDate() + 1);
  }
  var first = $('.day');
  if (first) $('#nextSlot').textContent = first.dataset.label.split(' ')[0].replace('Tue', 'Tuesday').replace('Wed', 'Wednesday').replace('Thu', 'Thursday').replace('Fri', 'Friday').replace('Sat', 'Saturday') + ' · 11:00 am';

  function pick(group, sel, btn) {
    $$(sel, group).forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-checked', 'false'); });
    btn.classList.add('is-on'); btn.setAttribute('aria-checked', 'true');
  }
  daysWrap.addEventListener('click', function (e) { var b = e.target.closest('.day'); if (!b) return; pick(daysWrap, '.day', b); chosenDay = b.dataset.label; updateSteps(); });
  $('#times').addEventListener('click', function (e) { var b = e.target.closest('.slot'); if (!b || b.disabled) return; pick($('#times'), '.slot', b); chosenTime = b.textContent; updateSteps(); });
  fService.addEventListener('change', updateSteps);
  function updateSteps() {
    var s = $$('.steps span');
    s[0].classList.add('is-on');
    s[1].classList.toggle('is-on', !!fService.value);
    s[2].classList.toggle('is-on', !!(fService.value && chosenDay && chosenTime));
  }

  $('#bookForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('#formMsg'), name = $('#fName'), phone = $('#fPhone'), ok = true;
    [fService, name, phone].forEach(function (f) {
      var bad = !f.value.trim(); f.closest('.field').classList.toggle('has-error', bad); if (bad) ok = false;
    });
    msg.classList.remove('is-ok');
    if (!ok || !chosenDay || !chosenTime) {
      msg.textContent = !chosenDay || !chosenTime ? 'Please choose a day and time that suit you.' : 'Please fill in the highlighted fields.';
      return;
    }
    msg.classList.add('is-ok');
    msg.textContent = '🎉 Thanks ' + name.value.trim().split(' ')[0] + '! ' + fService.value + ' requested for ' + chosenDay + ' at ' + chosenTime + '. We\'ll text you to confirm shortly. (Demo: not actually sent)';
    this.reset(); chosenDay = chosenTime = '';
    $$('.day.is-on, .slot.is-on').forEach(function (x) { x.classList.remove('is-on'); });
    updateSteps();
  });

  /* Newsletter */
  $('#newsForm').addEventListener('submit', function (e) { e.preventDefault(); $('#newsMsg').textContent = 'You\'re on the list. Welcome! 💜'; this.reset(); });

  /* Opening hours: highlight today */
  var today = new Date().getDay(), badge = $('#openBadge');
  $$('#hours li').forEach(function (li) { if (+li.dataset.d === today) li.classList.add('is-today'); });
  var closed = today === 0 || today === 1;
  badge.textContent = closed ? 'Closed today' : 'Open today';
  badge.classList.toggle('is-closed', closed);

  $('#year').textContent = new Date().getFullYear();
})();
