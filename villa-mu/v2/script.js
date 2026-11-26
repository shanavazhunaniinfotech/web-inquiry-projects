/* Villa Mu: Version 2 interactions */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var G = !!(window.gsap && window.ScrollTrigger) && !reduced;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  if (!G) doc.classList.remove('js-anim');
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- smooth scroll ---------- */
  var lenis = null;
  if (G && window.Lenis) {
    gsap.registerPlugin(ScrollTrigger);
    lenis = new window.Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  } else if (G) { gsap.registerPlugin(ScrollTrigger); }

  function goTo(el) {
    if (!el) return;
    var off = el.id === 'top' ? 0 : -90;
    if (lenis) lenis.scrollTo(el, { offset: off, duration: 1.5 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + pageYOffset + off, behavior: reduced ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    var el = $(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault(); closeMenu(); goTo(el);
  });

  /* ---------- header ---------- */
  var hdr = $('.hdr'), lastY = 0;
  var dock = $('.dock'), bar = $('#bar'), book = $('#book'), bookIn = false;
  function onScroll() {
    var y = pageYOffset;
    hdr.classList.toggle('is-scrolled', y > 30);
    if (!document.body.classList.contains('is-locked')) {
      if (y > 500 && y > lastY + 4) hdr.classList.add('is-hidden');
      else if (y < lastY - 4) hdr.classList.remove('is-hidden');
    }
    lastY = y;
    var barBottom = bar.getBoundingClientRect().bottom;
    dock.classList.toggle('is-on', barBottom < 0 && !bookIn);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { bookIn = en[0].isIntersecting; onScroll(); }, { threshold: 0.1 }).observe(book);
    var links = $$('.hdr__nav a');
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-on', l.getAttribute('href') === '#' + x.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) { var s = $(l.getAttribute('href')); if (s) io.observe(s); });
  }

  /* ---------- menu ---------- */
  var mBtn = $('.hdr__menu'), menu = $('#menu');
  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true; mBtn.setAttribute('aria-expanded', 'false'); mBtn.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('is-locked'); if (lenis) lenis.start();
  }
  mBtn.addEventListener('click', function () {
    if (!menu.hidden) { closeMenu(); return; }
    menu.hidden = false; mBtn.setAttribute('aria-expanded', 'true'); mBtn.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('is-locked'); hdr.classList.remove('is-hidden'); if (lenis) lenis.stop();
    if (G) gsap.from($$('#menu nav a, .menu__foot .pill'), { y: 40, opacity: 0, stagger: 0.05, duration: 0.7, ease: 'power3.out' });
  });

  /* ---------- dates ---------- */
  function iso(d) { return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
  function add(s, n) { var d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return iso(d); }
  function nights(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5); }
  function fmt(s) { return new Date(s + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
  var today = iso(new Date());
  function pair(a, d, out, empty) {
    a.min = today; d.min = add(today, 1);
    function u() {
      if (a.value) { d.min = add(a.value, 1); if (!d.value || d.value <= a.value) d.value = add(a.value, 7); }
      [a, d].forEach(function (x) { var p = x.closest('label'); p.classList.remove('bad'); });
      if (!out) return;
      if (a.value && d.value > a.value) { var n = nights(a.value, d.value); out.innerHTML = '<strong>' + n + ' night' + (n > 1 ? 's' : '') + '</strong> &middot; ' + fmt(a.value) + ' to ' + fmt(d.value); }
      else out.innerHTML = empty;
    }
    a.addEventListener('change', u); d.addEventListener('change', u);
    return u;
  }
  var bMsg = $('#bMsg'), bEmpty = bMsg.innerHTML;
  pair($('#bArrive'), $('#bDepart'), bMsg, bEmpty);
  var uF = pair($('#fArrive'), $('#fDepart'), $('#fNights'), '');
  function okDates(a, d) {
    var ok = true;
    if (!a.value || a.value < today) { a.closest('label').classList.add('bad'); ok = false; }
    if (!d.value || d.value <= a.value) { d.closest('label').classList.add('bad'); ok = false; }
    return ok;
  }

  /* ---------- form ---------- */
  var form = $('#form'), steps = $$('.step', form), dots = $$('.steps span', form), done = $('.done', form);
  function step(n) {
    steps.forEach(function (s) { s.hidden = s.dataset.step !== String(n); });
    dots.forEach(function (d, i) { d.classList.toggle('is-on', i < n); });
    if (n === 2) {
      var a = $('#fArrive').value, d = $('#fDepart').value, k = +$('#fKids').value;
      $('#fSum').textContent = a && d ? fmt(a) + ' to ' + fmt(d) + ' · ' + nights(a, d) + ' nights · ' + $('#fAdults').value + ' adults' + (k ? ', ' + k + ' children' : '') : '';
    }
    var s = steps[n - 1];
    if (G) gsap.from(s, { x: 24, opacity: 0, duration: 0.5, ease: 'power3.out' });
    var first = s.querySelector('input, select');
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 60);
  }
  bar.addEventListener('submit', function (e) {
    e.preventDefault();
    var a = $('#bArrive'), d = $('#bDepart');
    if (!okDates(a, d)) { bMsg.innerHTML = '<strong style="color:#b03a2e">Please choose your arrival and departure dates</strong>'; (a.value ? d : a).focus(); return; }
    $('#fArrive').value = a.value; $('#fDepart').value = d.value;
    $('#fAdults').value = $('#bGuests').value; $('#fKids').value = '0'; uF();
    track('bar_check'); goTo(book);
    setTimeout(function () { step(2); }, 1000);
  });
  form.querySelector('[data-next]').addEventListener('click', function () {
    var e1 = $('#e1'); e1.textContent = '';
    if (!okDates($('#fArrive'), $('#fDepart'))) { e1.textContent = 'Please choose valid arrival and departure dates.'; return; }
    if (+$('#fAdults').value + +$('#fKids').value > 8) { e1.textContent = 'Villa Mu sleeps up to 8 guests in total.'; return; }
    step(2);
  });
  form.querySelector('[data-back]').addEventListener('click', function () { step(1); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var e2 = $('#e2'), nm = form.elements.name, em = form.elements.email;
    e2.textContent = ''; [nm, em].forEach(function (x) { x.closest('label').classList.remove('bad'); });
    if (!nm.value.trim()) { nm.closest('label').classList.add('bad'); e2.textContent = 'Please add your name.'; nm.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) { em.closest('label').classList.add('bad'); e2.textContent = 'Please add a valid email so we can reply.'; em.focus(); return; }
    var a = $('#fArrive').value, d = $('#fDepart').value;
    var body = ['Hello, I would like to check availability at Villa Mu.', '', 'Arrive: ' + fmt(a), 'Depart: ' + fmt(d) + ' (' + nights(a, d) + ' nights)',
      'Guests: ' + $('#fAdults').value + ' adults, ' + $('#fKids').value + ' children', '', 'Name: ' + nm.value.trim(), 'Email: ' + em.value.trim(),
      'Phone: ' + (form.elements.phone.value.trim() || 'n/a'), '', form.elements.message.value.trim()].join('\n');
    /* TODO (go-live): post to a form backend / CRM instead of mailto */
    $('#waDone').href = 'https://wa.me/447714845140?text=' + encodeURIComponent(body);
    steps.forEach(function (s) { s.hidden = true; }); $('.steps', form).hidden = true; done.hidden = false;
    if (G) gsap.from(done.children, { y: 20, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out' });
    track('enquiry_submit');
    location.href = 'mailto:david50irvine@icloud.com?subject=' + encodeURIComponent('Villa Mu enquiry: ' + fmt(a) + ' to ' + fmt(d)) + '&body=' + encodeURIComponent(body);
  });
  function track(n) { try { if (window.gtag) gtag('event', n); if (window.plausible) plausible(n); } catch (x) { /* noop */ } }

  /* ---------- location ruler ---------- */
  var places = [
    ['cisternino', 'Cisternino', '3.6 km', 'A whitewashed hill town famous for its butcher-grill restaurants and lively piazzas, and home to the owners’ favourite dinner spots.'],
    ['acquedotto', 'Acquedotto walk', '5.1 km', 'A peaceful countryside path following the old Apulian aqueduct through the Valle d’Itria. Ideal for a morning walk or bike ride.'],
    ['martina-franca', 'Martina Franca', '9.1 km', 'Baroque palaces, elegant streets and the Valle d’Itria summer music festival.'],
    ['locorotondo', 'Locorotondo', '10.5 km', 'A circular old town of white houses overlooking vineyards and trulli.'],
    ['ostuni', 'Ostuni', '19.2 km', '“La Città Bianca”, the White City, rising above olive groves towards the Adriatic.'],
    ['alberobello', 'Alberobello', '19.8 km', 'The UNESCO-listed trulli: Puglia’s iconic cone-roofed stone houses.'],
    ['matera', 'Matera', '84.7 km', 'The ancient Sassi cave dwellings, a UNESCO World Heritage Site and an unforgettable day trip.'],
    ['lecce', 'Lecce', '103 km', '“The Florence of the South”, famed for its golden baroque architecture.']
  ];
  places.forEach(function (p) { var i = new Image(); i.src = '../images/' + p[0] + '.jpg'; });
  var stops = $$('.stop'), lImg = $('#locImg');
  function showPlace(i) {
    var p = places[i];
    stops.forEach(function (s, j) { s.classList.toggle('is-active', j === i); s.setAttribute('aria-pressed', j === i); });
    var set = function () { lImg.src = '../images/' + p[0] + '.jpg'; lImg.alt = p[1]; $('#locName').textContent = p[1]; $('#locKm').textContent = p[2] + ' from Villa Mu'; $('#locTxt').textContent = p[3]; };
    if (G) {
      gsap.to(['#locImg', '#locName', '#locTxt', '#locKm'], { opacity: 0, y: 10, duration: 0.2, onComplete: function () { set(); gsap.to(['#locImg', '#locName', '#locTxt', '#locKm'], { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out' }); } });
    } else set();
  }
  stops.forEach(function (s, i) {
    s.setAttribute('aria-pressed', i === 0);
    s.addEventListener('click', function () { showPlace(i); });
    if (fine) s.addEventListener('mouseenter', function () { if (!s.classList.contains('is-active')) showPlace(i); });
  });

  /* ---------- quotes ---------- */
  var qs = $$('.quote'), qi = 0, qTimer;
  function showQ(n) { qi = (n + qs.length) % qs.length; qs.forEach(function (q, i) { q.classList.toggle('is-active', i === qi); }); $('#qNow').textContent = qi + 1; }
  $$('[data-q]').forEach(function (b) { b.addEventListener('click', function () { showQ(qi + +b.dataset.q); clearInterval(qTimer); }); });
  if (!reduced) qTimer = setInterval(function () { showQ(qi + 1); }, 7000);

  /* ---------- gallery: duplicate tracks for seamless loop ---------- */
  var originals = $$('.gal .shot');
  $$('.gal__track').forEach(function (t) {
    $$('.shot', t).forEach(function (s) { var c = s.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1; c.dataset.clone = '1'; t.appendChild(c); });
  });

  /* ---------- lightbox ---------- */
  var lb = $('#lb'), lbImg = $('#lbImg'), li = 0, lastF;
  function openLb(i) {
    li = (i + originals.length) % originals.length;
    var o = originals[li];
    lbImg.src = o.dataset.full; lbImg.alt = o.querySelector('img').alt;
    $('#lbCount').textContent = (li + 1) + ' / ' + originals.length;
    if (lb.hidden) { lastF = document.activeElement; lb.hidden = false; document.body.classList.add('is-locked'); if (lenis) lenis.stop(); $('.lb__x').focus(); }
    if (G) gsap.fromTo(lbImg, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' });
  }
  function closeLb() { lb.hidden = true; document.body.classList.remove('is-locked'); if (lenis) lenis.start(); if (lastF) lastF.focus(); }
  $$('.gal .shot').forEach(function (s) {
    s.addEventListener('click', function () {
      var src = s.dataset.full, idx = originals.findIndex(function (o) { return o.dataset.full === src; });
      openLb(idx < 0 ? 0 : idx);
    });
  });
  $('.lb__x').addEventListener('click', closeLb);
  $('.lb__prev').addEventListener('click', function () { openLb(li - 1); });
  $('.lb__next').addEventListener('click', function () { openLb(li + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  var tx = 0;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) openLb(li + (dx < 0 ? 1 : -1)); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!lb.hidden) closeLb(); closeMenu(); }
    if (!lb.hidden && e.key === 'ArrowRight') openLb(li + 1);
    if (!lb.hidden && e.key === 'ArrowLeft') openLb(li - 1);
  });

  /* ---------- rooms: floating preview (desktop) ---------- */
  var rf = $('.rfloat'), rfImg = rf.querySelector('img');
  if (fine && G) {
    var fx = gsap.quickTo(rf, 'x', { duration: 0.6, ease: 'power3' }), fy = gsap.quickTo(rf, 'y', { duration: 0.6, ease: 'power3' });
    $$('.rrow[data-img]').forEach(function (r) {
      r.addEventListener('mouseenter', function () { rfImg.src = r.dataset.img; gsap.to(rf, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }); });
      r.addEventListener('mouseleave', function () { gsap.to(rf, { opacity: 0, scale: 0.7, duration: 0.4, ease: 'power3.out' }); });
      r.addEventListener('mousemove', function (e) {
        fx(e.clientX + 30); fy(e.clientY - 180);
        if (rfHidden) { rfHidden = false; rfImg.src = r.dataset.img; gsap.to(rf, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }); }
      });
    });
    var rfHidden = false;
    window.addEventListener('scroll', function () {
      if (rfHidden || +gsap.getProperty(rf, 'opacity') === 0) return;
      rfHidden = true; gsap.to(rf, { opacity: 0, scale: 0.7, duration: 0.3, overwrite: true });
    }, { passive: true });
  }

  if (!G) {
    /* simple CSS marquee fallback is not needed: rows just sit still */
    onScroll(); return;
  }

  /* =====================================================
     GSAP motion
     ===================================================== */
  function words(el) {
    var frag = document.createDocumentFragment();
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          var o = document.createElement('span'); o.className = 'wo'; o.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.1em;margin-bottom:-.1em';
          var w = document.createElement('span'); w.className = 'w'; w.style.display = 'inline-block'; w.textContent = p;
          o.appendChild(w); frag.appendChild(o);
        });
      } else if (n.nodeType === 1 && !n.classList.contains('chip')) {
        var c = n.cloneNode(false); c.appendChild(words(n)); frag.appendChild(c);
      } else frag.appendChild(n.cloneNode(true));
    });
    return frag;
  }

  /* loader → hero intro */
  var intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro.from('.loader__tree', { scale: 0.6, opacity: 0, duration: 0.6 })
    .from('.loader__word span', { yPercent: 100, duration: 0.7 }, 0.1)
    .to('.loader__bar span', { width: '100%', duration: 0.8, ease: 'power2.inOut' }, 0.1)
    .to('.loader', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, 0.95)
    .set('.loader', { display: 'none' })
    .fromTo('.hdr', { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, clearProps: 'transform,opacity' }, 1.3)
    .from('.ln > span', { yPercent: 110, duration: 1.3, stagger: 0.12 }, 1.25)
    .from('.hero__top > *', { y: 16, opacity: 0, duration: 0.8, stagger: 0.08 }, 1.4)
    .from('.hero__frame', { clipPath: 'inset(18% 12% 0% 12% round 28px)', duration: 1.6, ease: 'expo.out' }, 1.35)
    .from('.hero__img', { scale: 1.35, duration: 2.2, ease: 'expo.out' }, 1.35)
    .from('.bar', { y: 50, opacity: 0, duration: 1.1 }, 1.8);

  /* hero frame opens to full-bleed + parallax */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 761px)', function () {
    gsap.to('.hero__stage', { paddingLeft: 0, paddingRight: 0, ease: 'none', scrollTrigger: { trigger: '.hero__stage', start: 'top 70%', end: 'top 5%', scrub: true } });
    gsap.to('.hero__frame', { borderRadius: 0, ease: 'none', scrollTrigger: { trigger: '.hero__stage', start: 'top 40%', end: 'top 5%', scrub: true } });

    /* stacked cards recede */
    var cards = $$('.card');
    cards.forEach(function (c, i) {
      if (i === cards.length - 1) return;
      gsap.to(c, { scale: 0.92 + i * 0.02, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 100px', scrub: true } });
    });
  });
  gsap.to('.hero__img', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero__stage', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__title', { yPercent: 30, opacity: 0.3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '45% top', scrub: true } });

  /* statement: words fill in as you scroll */
  var st = $('#statement'); var f = words(st); st.innerHTML = ''; st.appendChild(f);
  gsap.to('#statement .w', { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: st, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  gsap.from('#statement .chip', { scale: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(2)', scrollTrigger: { trigger: st, start: 'top 70%' } });

  /* headings */
  $$('.h2').forEach(function (h) {
    var fr = words(h); h.innerHTML = ''; h.appendChild(fr);
    gsap.from(h.querySelectorAll('.w'), { yPercent: 110, duration: 1.1, stagger: 0.05, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
  });

  /* reveals */
  function up(sel, trig, opts) {
    gsap.from(sel, Object.assign({ y: 50, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: trig || sel, start: 'top 85%' } }, opts || {}));
  }
  up('.tile', '.bento', { y: 70, stagger: 0.07 });
  up('.rrow', '.rlist', { y: 30 });
  up('.compare__row', '.compare', { x: 30, y: 0 });
  up('.direct__head > p, .direct__cta', '.direct__head');
  up('.stop', '.ruler', { y: 20, stagger: 0.05 });
  up('.loc__panel > *', '.loc__panel');
  up('.faq__list details', '.faq__list', { y: 24, stagger: 0.05 });
  up('.statement__foot', '.statement__foot', { y: 24 });
  up('.book__card', '.book', { y: 80 });
  up('.foot__word', '.foot', { yPercent: 40, y: 0, duration: 1.4 });
  gsap.fromTo('.ruler__fill', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.ruler', start: 'top 85%', end: 'top 40%', scrub: true } });
  gsap.fromTo('.book__img img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.book', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* counters */
  $$('[data-count]').forEach(function (el) {
    var o = { v: 0 }, end = +el.dataset.count;
    gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: function () { el.textContent = Math.round(o.v); } });
  });

  /* gallery marquee rows, nudged by scroll velocity */
  var rows = $$('.gal__row').map(function (r) {
    var t = r.querySelector('.gal__track'), dir = +r.dataset.dir;
    var tw = dir > 0
      ? gsap.fromTo(t, { xPercent: -50 }, { xPercent: 0, duration: 55, ease: 'none', repeat: -1 })
      : gsap.fromTo(t, { xPercent: 0 }, { xPercent: -50, duration: 55, ease: 'none', repeat: -1 });
    var hover = false;
    r.addEventListener('mouseenter', function () { hover = true; gsap.to(tw, { timeScale: 0, duration: 0.6, overwrite: true }); });
    r.addEventListener('mouseleave', function () { hover = false; gsap.to(tw, { timeScale: 1, duration: 0.6, overwrite: true }); });
    return { tw: tw, isHover: function () { return hover; } };
  });
  ScrollTrigger.create({
    trigger: '.gal', start: 'top bottom', end: 'bottom top',
    onUpdate: function (s) {
      var v = Math.min(Math.abs(s.getVelocity()) / 300, 4);
      rows.forEach(function (x) {
        if (x.isHover()) return;
        gsap.to(x.tw, { timeScale: 1 + v, duration: 0.25, overwrite: true, onComplete: function () { gsap.to(x.tw, { timeScale: 1, duration: 1 }); } });
      });
    }
  });

  /* magnetic pills */
  if (fine) {
    $$('.bar__go, .hdr .pill, .dock__cta').forEach(function (b) {
      var xT = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' }), yT = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
      b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); xT((e.clientX - r.left - r.width / 2) * 0.2); yT((e.clientY - r.top - r.height / 2) * 0.3); });
      b.addEventListener('mouseleave', function () { xT(0); yT(0); });
    });
  }

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  onScroll();
})();
