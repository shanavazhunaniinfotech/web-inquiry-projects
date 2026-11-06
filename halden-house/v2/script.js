/* Halden House — Design B. GSAP + ScrollTrigger + Lenis from CDN, with graceful fallback. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var animate = hasGsap && !reduce;
  if (!animate) doc.classList.add('no-anim');
  var notesOn = false;

  /* ---------- Toast ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 4500); }

  /* ---------- Smooth scroll ---------- */
  var lenis = null;
  if (animate && typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function scrollToEl(el, off) {
    off = off == null ? -100 : off;
    if (lenis) lenis.scrollTo(el, { offset: off, duration: 1.3 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + off, behavior: reduce ? 'auto' : 'smooth' });
  }
  $$('a[href^="#"]').forEach(function (a) {
    if (a.hasAttribute('data-book') || a.hasAttribute('data-table')) return;
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var t = document.querySelector(id); if (!t) return;
      e.preventDefault(); setMenu(false); scrollToEl(t);
    });
  });

  /* ---------- Nav: hide on scroll down, show on up ---------- */
  var nav = $('#nav'), lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    var hide = y > lastY + 2 && y > 500 && !document.body.classList.contains('menu-open') && !notesOn;
    if (y < lastY - 2 || y < 500) nav.style.transform = '';
    else if (hide) nav.style.transform = 'translateY(-130%)';
    lastY = y;
    updateMbar();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if ('IntersectionObserver' in window) {
    var links = $$('.nav__links a');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['rooms', 'dining', 'escapes', 'gather'].forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------- Overlay menu ---------- */
  var burger = $('.nav__burger'), overlay = $('#overlay'), ovImg = $('.overlay__img img');
  function setMenu(open) {
    if (!overlay) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    if (open) { overlay.hidden = false; requestAnimationFrame(function () { overlay.classList.add('is-open'); }); nav.style.transform = ''; if (lenis) lenis.stop(); }
    else { overlay.classList.remove('is-open'); if (lenis) lenis.start(); setTimeout(function () { if (!overlay.classList.contains('is-open')) overlay.hidden = true; }, 900); }
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('.overlay__links a').forEach(function (a) { a.addEventListener('mouseenter', function () { ovImg.src = a.dataset.img; }); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (document.body.classList.contains('menu-open')) setMenu(false);
    if (notesOn) setNotes(false);
  });

  /* ---------- Booking ---------- */
  var arrive = $('#arrive'), depart = $('#depart'), gOut = $('#guests'), guests = 2;
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function fromIso(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function pretty(s) { return fromIso(s).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }); }
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var start = new Date(today); start.setDate(start.getDate() + 14);
  while (start.getDay() !== 5) start.setDate(start.getDate() + 1);
  var end = new Date(start); end.setDate(end.getDate() + 2);
  arrive.min = iso(today); arrive.value = iso(start); depart.value = iso(end);
  function sync() {
    var a = fromIso(arrive.value || iso(start)); var md = new Date(a); md.setDate(md.getDate() + 1);
    depart.min = iso(md);
    if (!depart.value || fromIso(depart.value) <= a) depart.value = iso(md);
    $('#arriveTxt').textContent = pretty(arrive.value); $('#departTxt').textContent = pretty(depart.value);
  }
  arrive.addEventListener('change', sync); depart.addEventListener('change', sync); sync();
  [arrive, depart].forEach(function (inp) {
    inp.closest('.pfield').addEventListener('click', function (e) { if (inp.showPicker) { try { inp.showPicker(); e.preventDefault(); } catch (err) { /* native fallback */ } } });
  });
  var steps = $$('.count button');
  steps.forEach(function (b) {
    b.addEventListener('click', function () {
      guests = Math.max(1, Math.min(6, guests + Number(b.dataset.step)));
      gOut.textContent = guests; steps[0].disabled = guests <= 1; steps[1].disabled = guests >= 6;
    });
  });
  $('#checkBtn').addEventListener('click', function () {
    var n = Math.round((fromIso(depart.value) - fromIso(arrive.value)) / 864e5);
    // Live site: location.href = 'https://book.haldenhouse.com/?arrive=' + arrive.value + '&depart=' + depart.value + '&guests=' + guests;
    toast('Concept: opens your booking engine with ' + n + ' night' + (n > 1 ? 's' : '') + ' from ' + pretty(arrive.value) + ', ' + guests + ' guest' + (guests > 1 ? 's' : '') + '.');
  });
  $$('[data-book]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); setMenu(false);
      var plan = $('#plan');
      scrollToEl(plan, -(window.innerHeight - plan.offsetHeight) / 2);
      setTimeout(function () { plan.animate([{ boxShadow: '0 0 0 0 rgba(181,83,47,.7)' }, { boxShadow: '0 0 0 16px rgba(181,83,47,0)' }], { duration: 1100 }); }, 1100);
    });
  });
  $$('[data-table]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); setMenu(false);
      var r = $('#dining').getBoundingClientRect();
      if (r.top < window.innerHeight * .5 && r.bottom > window.innerHeight * .5) toast('Concept: opens your table booking tool (OpenTable, SevenRooms or similar).');
      else scrollToEl($('#dining'));
    });
  });

  /* ---------- Room selector ---------- */
  var rooms = [
    { d: 'Our simplest rooms, and the ones guests most often ask for again. Linen, oak and a window full of meadow.', c: ['24 m²', 'Sleeps 2', 'Meadow view', 'Rain shower'] },
    { d: 'Under old oak beams, with a door straight onto your own terrace and the grass beyond. Dogs welcome.', c: ['32 m²', 'Sleeps 2', 'Private terrace', 'Dog friendly'] },
    { d: 'A room to sit in, a room to sleep in, and a deep bath set right by the window.', c: ['48 m²', 'Sleeps 2–3', 'Bath with a view', 'Sitting room'] },
    { d: 'A covered terrace with an open-air bed above the lake, for nights under the stars.', c: ['55 m²', 'Sleeps 2', 'Open-air bed', 'Lake view'] },
    { d: 'Two bedrooms, a kitchen and your own garden gate, for families or friends who want their own door.', c: ['70 m²', 'Sleeps 4', 'Own garden', 'Kitchen'] }
  ];
  var tabs = $$('.selector__list button'), rImgs = $$('.selector__imgs img');
  function selectRoom(i) {
    tabs.forEach(function (t, j) { t.setAttribute('aria-selected', String(j === i)); t.tabIndex = j === i ? 0 : -1; });
    rImgs.forEach(function (im, j) { im.classList.toggle('is-on', j === i); });
    $('#roomDesc').textContent = rooms[i].d;
    $('#roomChips').innerHTML = rooms[i].c.map(function (c) { return '<li>' + c + '</li>'; }).join('');
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      selectRoom(i);
      if (window.innerWidth <= 860) { var pn = $('.selector__panel').getBoundingClientRect(); if (pn.top < 60) scrollToEl($('.selector__panel'), -90); }
    });
    t.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover)').matches) selectRoom(i); });
    t.addEventListener('keydown', function (e) {
      var k = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (!k) return; e.preventDefault(); var n = (i + k + tabs.length) % tabs.length; selectRoom(n); tabs[n].focus();
    });
  });

  /* ---------- Day rail: buttons, progress, drag ---------- */
  var rail = $('#dayRail'), bar = $('#dayBar'), dayBtns = $$('[data-day]');
  function railProgress() {
    var max = rail.scrollWidth - rail.clientWidth;
    var p = max > 0 ? rail.scrollLeft / max : 1;
    bar.style.width = (20 + p * 80) + '%';
    if (dayBtns.length) { dayBtns[0].disabled = rail.scrollLeft < 4; dayBtns[1].disabled = rail.scrollLeft > max - 4; }
  }
  rail.addEventListener('scroll', railProgress, { passive: true });
  window.addEventListener('resize', railProgress);
  dayBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var m = $('.moment', rail); var step = m ? m.getBoundingClientRect().width + 20 : 400;
      rail.scrollBy({ left: step * Number(b.dataset.day), behavior: reduce ? 'auto' : 'smooth' });
    });
  });
  (function drag() {
    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('mousedown', function (e) { down = true; moved = false; sx = e.pageX; sl = rail.scrollLeft; rail.classList.add('is-drag'); });
    window.addEventListener('mouseup', function () { if (!down) return; down = false; rail.classList.remove('is-drag'); });
    window.addEventListener('mousemove', function (e) { if (!down) return; var dx = e.pageX - sx; if (Math.abs(dx) > 3) moved = true; rail.scrollLeft = sl - dx; });
    rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  })();
  railProgress();

  /* ---------- FAQ ---------- */
  var faqs = $$('.faq__list details');
  faqs.forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; }); if (window.ScrollTrigger) ScrollTrigger.refresh(); }); });

  /* ---------- Mobile bar ---------- */
  var mbar = $('#mbar'), planEl = $('#plan'), ctaEl = $('.cta');
  function updateMbar() {
    var past = planEl.getBoundingClientRect().bottom < 0;
    var near = ctaEl.getBoundingClientRect().top < window.innerHeight * .8;
    var show = (past && !near) || notesOn;
    mbar.classList.toggle('is-visible', show);
    doc.classList.toggle('mbar-on', show && window.innerWidth <= 860);
  }

  /* =========================================================
     GSAP
     ========================================================= */
  function splitWords(el) {
    var frag = document.createDocumentFragment();
    (function walk(node, target) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { target.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
            var i = document.createElement('span'); i.textContent = p; w.appendChild(i); target.appendChild(w);
          });
        } else if (n.nodeType === 1) { var c = n.cloneNode(false); walk(n, c); target.appendChild(c); }
      });
    })(el, frag);
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    el.innerHTML = ''; el.appendChild(frag);
    return $$('.w > span', el);
  }

  if (animate) {
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();

    // Hero intro
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.nav__bar', { y: -40, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, .2)
      .from('.hero__top .eyebrow', { y: 20, opacity: 0, duration: 1 }, .2)
      .from('.hero__title .li', { yPercent: 105, duration: 1.4, stagger: .1 }, .3)
      .from('.hero__inline', { width: 0, duration: 1.4, ease: 'expo.inOut' }, .7)
      .from('.hero__aside > *', { y: 24, opacity: 0, duration: 1.1, stagger: .1 }, .8)
      .from('.hero__frame', { y: 80, opacity: 0, duration: 1.6 }, .6)
      .from('.hero__frame img', { scale: 1.3, duration: 2.4, ease: 'power3.out' }, .6)
      .from('.plan', { y: 50, opacity: 0, duration: 1.3 }, 1.1)
      .from('.hero__tag', { opacity: 0, duration: 1 }, 1.4);

    // Hero image grows to full-bleed on scroll (desktop)
    mm.add('(min-width: 861px)', function () {
      gsap.fromTo('.hero__frame', { clipPath: 'inset(0% 0% 0% 0% round 28px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
        scrollTrigger: { trigger: '.hero__stage', start: 'top 70%', end: 'top top', scrub: true }
      });
      var stage = $('.hero__stage'); stage.style.padding = ''; var pad0 = parseFloat(getComputedStyle(stage).paddingLeft);
      gsap.fromTo(stage, { paddingLeft: pad0, paddingRight: pad0 }, {
        paddingLeft: 0, paddingRight: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero__stage', start: 'top 70%', end: 'top top', scrub: true, invalidateOnRefresh: true }
      });
    });
    gsap.to('.hero__frame img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero__stage', start: 'top top', end: 'bottom top', scrub: true } });

    // Split headings
    $$('.split').forEach(function (h) {
      var w = splitWords(h);
      gsap.from(w, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: .04, scrollTrigger: { trigger: h, start: 'top 86%' } });
    });

    // Manifesto: words light up, pictures pop in
    var man = $('.reveal-words');
    if (man) {
      Array.prototype.slice.call(man.childNodes).forEach(function (n) {
        if (n.nodeType !== 3 || !n.textContent.trim()) return;
        var f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { f.appendChild(document.createTextNode(' ')); return; }
          var s = document.createElement('span'); s.className = 'rw'; s.textContent = p; f.appendChild(s);
        });
        man.replaceChild(f, n);
      });
      gsap.to($$('.rw', man), { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: man, start: 'top 78%', end: 'bottom 50%', scrub: true } });
      gsap.from($$('.pic', man), { scale: 0, duration: 1, ease: 'back.out(1.6)', stagger: .2, scrollTrigger: { trigger: man, start: 'top 65%' } });
    }

    // Counters
    $$('[data-count]').forEach(function (el) {
      var to = +el.dataset.count, sfx = el.dataset.suffix || '', o = { v: 0 };
      gsap.to(o, { v: to, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: function () { el.textContent = Math.round(o.v) + sfx; } });
    });

    // Fade-ups
    gsap.utils.toArray('.awards li, .figures li, .sec-head__lede, .selector__list li, .selector__panel, .tile, .moment, .rcard, .direct__list li, .find__card, .lede, .faq__list details, .gather__row, .cta__assure, .btns, .footer__grid > div, .score').forEach(function (el) {
      if (el.closest('.hero') || el.closest('.overlay')) return;
      gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
    });

    // Stacking cards: earlier cards shrink and dim as the next arrives
    var cards = $$('.scard');
    cards.forEach(function (c, i) {
      if (i === cards.length - 1) return;
      gsap.to(c, { scale: .92, filter: 'brightness(.88)', ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 30%', scrub: true } });
    });

    // Parallax
    gsap.to('.gather__img', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.gather__box', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.to('.cta__img--l', { y: -80, rotate: -10, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.to('.cta__img--r', { y: 80, rotate: 9, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.footer__word', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.footer__word', start: 'top 95%' } });

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }

  /* =========================================================
     Design notes (presentation layer)
     ========================================================= */
  var toggle = $('#notesToggle'), body = $('#notesBody'), noted = $$('[data-note]');
  var intro = document.createElement('div');
  intro.innerHTML =
    '<p class="notes-intro">Design B: light, editorial and interactive. The same conversion strategy as Design A, in a different art direction.</p>' +
    '<p class="notes-flow"><strong>The order:</strong> feel it (hero) → act early (dates) → trust it (awards) → believe it (philosophy) → choose (rooms, dining) → ' +
    'picture it (a day here) → a reason to book now (escapes) → go bigger (whole house) → remove doubts (reviews, book direct, travel, questions) → act (final invitation).<br><br>' +
    '<strong>Brief kept:</strong> no portfolio grid, no founder portrait, no contact forms, no prices. Every section maps to standard Squarespace 7.1 sections plus custom CSS, and motion is light on phones so the page stays fast.</p>';
  body.appendChild(intro);
  var items = [];
  noted.forEach(function (el, i) {
    var n = i + 1, title = el.getAttribute('data-note-title'), text = el.getAttribute('data-note');
    var it = document.createElement('button'); it.type = 'button'; it.className = 'note-item';
    it.innerHTML = '<span class="note-item__num">' + n + '</span><h4></h4><p></p>';
    $('h4', it).textContent = title; $('p', it).textContent = text;
    it.addEventListener('click', function () { if (el.id === 'nav' || el.id === 'mbar') { focusItem(i); return; } scrollToEl(el, -90); });
    body.appendChild(it); items.push(it);
    var pin = document.createElement('button'); pin.type = 'button'; pin.className = 'note-pin';
    pin.innerHTML = '<b>' + n + '</b><span></span>'; $('span', pin).textContent = title;
    pin.setAttribute('aria-label', 'Design note ' + n + ': ' + title);
    pin.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); if (!notesOn) setNotes(true); focusItem(i); });
    if (getComputedStyle(el).position === 'static') el.classList.add('has-pin');
    el.appendChild(pin);
  });
  function focusItem(i) {
    items.forEach(function (it, j) { it.classList.toggle('is-current', j === i); });
    noted.forEach(function (el, j) { el.classList.toggle('is-noted', j === i); });
    if (items[i]) body.scrollTo({ top: items[i].offsetTop - body.offsetTop - 8, behavior: reduce ? 'auto' : 'smooth' });
  }
  var secNotes = noted.filter(function (el) { return /^(SECTION|FOOTER)$/.test(el.tagName); });
  if ('IntersectionObserver' in window) {
    var nIO = new IntersectionObserver(function (es) { if (!notesOn) return; es.forEach(function (e) { if (e.isIntersecting) focusItem(noted.indexOf(e.target)); }); }, { rootMargin: '-40% 0px -55% 0px' });
    secNotes.forEach(function (el) { nIO.observe(el); });
  }
  function setNotes(on) {
    notesOn = on;
    doc.classList.toggle('notes-on', on);
    toggle.setAttribute('aria-pressed', String(on));
    $('.notes-toggle__label', toggle).textContent = on ? 'Hide notes' : 'Design notes';
    try { localStorage.setItem('halden-b-notes', on ? '1' : '0'); } catch (e) { /* unavailable */ }
    if (on) {
      nav.style.transform = '';
      var mid = window.innerHeight * .45, cur = 0;
      secNotes.forEach(function (el) { if (el.getBoundingClientRect().top < mid) cur = noted.indexOf(el); });
      focusItem(cur);
    }
    updateMbar();
    if (window.ScrollTrigger) setTimeout(function () { ScrollTrigger.refresh(); }, 650);
  }
  toggle.addEventListener('click', function () { setNotes(!notesOn); });
  $('#notesClose').addEventListener('click', function () { setNotes(false); });
  var saved = null; try { saved = localStorage.getItem('halden-b-notes'); } catch (e) { /* ignore */ }
  if (new URLSearchParams(location.search).has('notes') || saved === '1') setNotes(true);
  onScroll();
})();
