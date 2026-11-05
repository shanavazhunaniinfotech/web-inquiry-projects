/* Halden House — home page concept (v2)
   GSAP + ScrollTrigger + Lenis, loaded from CDN. Falls back gracefully without them. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var animate = hasGsap && !reduce;
  if (!animate) doc.classList.add('no-anim');

  /* ---------- Toast ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 4500);
  }

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (animate && typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  var header = $('#header');
  function scrollToEl(el, offset) {
    var off = offset == null ? -((header && header.offsetHeight) || 0) - 20 : offset;
    if (lenis) lenis.scrollTo(el, { offset: off, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + off, behavior: reduce ? 'auto' : 'smooth' });
  }
  // In-page anchors use the smooth scroller
  $$('a[href^="#"]').forEach(function (a) {
    if (a.hasAttribute('data-book') || a.hasAttribute('data-table')) return;
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      setMenu(false);
      scrollToEl(t);
    });
  });

  /* ---------- Header: solid after hero, hide on scroll down ---------- */
  var hero = $('.hero'), lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-solid', y > 60);
    var goingDown = y > lastY && y > window.innerHeight * .9;
    if (!document.body.classList.contains('menu-open')) header.classList.toggle('is-hidden', goingDown && !notesOn);
    lastY = y;
    updateMbar();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Active nav */
  if ('IntersectionObserver' in window) {
    var navLinks = $$('.header__nav a[href^="#"]');
    var navIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['stay', 'dine', 'escapes', 'gather'].forEach(function (id) { var el = document.getElementById(id); if (el) navIO.observe(el); });
  }

  /* ---------- Menu ---------- */
  var burger = $('.burger'), menu = $('#menu');
  function setMenu(open) {
    if (!menu) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    if (open) { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add('is-open'); }); header.classList.remove('is-hidden'); if (lenis) lenis.stop(); }
    else { menu.classList.remove('is-open'); if (lenis) lenis.start(); setTimeout(function () { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 800); }
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (document.body.classList.contains('menu-open')) setMenu(false);
    if (notesOn) setNotes(false);
  });

  /* ---------- Booking ---------- */
  var arrive = $('#arrive'), depart = $('#depart'), guestsOut = $('#guests');
  var guests = 2;
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function fromIso(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function pretty(s) { return s ? fromIso(s).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }) : 'Select date'; }
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var start = new Date(today); start.setDate(start.getDate() + 14);
  while (start.getDay() !== 5) start.setDate(start.getDate() + 1); // next Friday, two weeks out
  var end = new Date(start); end.setDate(end.getDate() + 2);
  arrive.min = iso(today);
  arrive.value = iso(start);
  depart.value = iso(end);
  function syncDates() {
    var a = fromIso(arrive.value || iso(start));
    var minDep = new Date(a); minDep.setDate(minDep.getDate() + 1);
    depart.min = iso(minDep);
    if (!depart.value || fromIso(depart.value) <= a) depart.value = iso(minDep);
    $('#arrivePretty').textContent = pretty(arrive.value);
    $('#departPretty').textContent = pretty(depart.value);
  }
  arrive.addEventListener('change', syncDates);
  depart.addEventListener('change', syncDates);
  syncDates();
  [arrive, depart].forEach(function (inp) {
    inp.closest('.bfield').addEventListener('click', function (e) {
      if (inp.showPicker) { try { inp.showPicker(); e.preventDefault(); } catch (err) { /* fallback to native */ } }
    });
  });
  $$('.stepper__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      guests = Math.max(1, Math.min(6, guests + Number(b.dataset.step)));
      guestsOut.textContent = guests;
      $$('.stepper__btn')[0].disabled = guests <= 1;
      $$('.stepper__btn')[1].disabled = guests >= 6;
    });
  });
  $('#checkBtn').addEventListener('click', function () {
    var nights = Math.round((fromIso(depart.value) - fromIso(arrive.value)) / 864e5);
    // Live site: window.location.href = 'https://book.haldenhouse.com/?arrive=' + arrive.value + '&depart=' + depart.value + '&guests=' + guests;
    toast('Concept: opens your booking engine with ' + nights + ' night' + (nights > 1 ? 's' : '') + ' from ' + pretty(arrive.value) + ', ' + guests + ' guest' + (guests > 1 ? 's' : '') + '.');
  });
  $$('[data-book]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      setMenu(false);
      scrollToEl($('#book'), -window.innerHeight * .3);
      setTimeout(function () { $('.booking__fields').animate([{ boxShadow: '0 0 0 0 rgba(198,164,108,.7)' }, { boxShadow: '0 0 0 14px rgba(198,164,108,0)' }], { duration: 1100 }); }, 1100);
    });
  });
  $$('[data-table]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      setMenu(false);
      var r = $('#dine').getBoundingClientRect();
      if (r.top < window.innerHeight * .5 && r.bottom > window.innerHeight * .5) {
        toast('Concept: opens your table booking tool (OpenTable, SevenRooms or similar).');
      } else { scrollToEl($('#dine')); }
    });
  });

  /* ---------- Reviews carousel ---------- */
  var quotes = $$('.quote'), qi = 0, qTimer;
  function showQuote(i) {
    qi = (i + quotes.length) % quotes.length;
    quotes.forEach(function (q, j) { q.classList.toggle('is-active', j === qi); q.setAttribute('aria-hidden', String(j !== qi)); });
    $('#qNow').textContent = String(qi + 1).padStart(2, '0');
  }
  function autoQuotes() { clearInterval(qTimer); if (!reduce) qTimer = setInterval(function () { showQuote(qi + 1); }, 7000); }
  $$('[data-q]').forEach(function (b) { b.addEventListener('click', function () { showQuote(qi + Number(b.dataset.q)); autoQuotes(); }); });
  showQuote(0); autoQuotes();

  /* ---------- FAQ: one open at a time ---------- */
  var faqs = $$('.faq__list details');
  faqs.forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; }); if (window.ScrollTrigger) ScrollTrigger.refresh(); }); });

  /* ---------- A day here: active moment ---------- */
  var moments = $$('.moment'), stageImgs = $$('.day__stage img'), clock = $('#dayClock');
  function setMoment(i) {
    moments.forEach(function (m, j) { m.classList.toggle('is-active', j === i); });
    stageImgs.forEach(function (im, j) { im.classList.toggle('is-active', j === i); });
    if (clock) clock.textContent = moments[i].dataset.time;
  }
  if ('IntersectionObserver' in window) {
    var mIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setMoment(moments.indexOf(e.target)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    moments.forEach(function (m) { mIO.observe(m); });
  }

  /* ---------- Mobile bar ---------- */
  var mbar = $('#mbar'), bookEl = $('#book'), finalEl = $('.final');
  function updateMbar() {
    var past = bookEl.getBoundingClientRect().bottom < 0;
    var nearEnd = finalEl.getBoundingClientRect().top < window.innerHeight * .7;
    var show = (past && !nearEnd) || notesOn;
    mbar.classList.toggle('is-visible', show);
    doc.classList.toggle('mbar-on', show && window.innerWidth <= 860);
  }

  /* ---------- Custom cursor + magnetic buttons (desktop only) ---------- */
  if (finePointer && !reduce) {
    doc.classList.add('has-cursor');
    var cur = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)'; }, { passive: true });
    (function loop() { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', function (e) {
      var v = e.target.closest('[data-cursor="view"]');
      var h = e.target.closest('a, button, summary, [data-cursor="hover"]');
      cur.classList.toggle('is-view', !!v && !h);
      cur.classList.toggle('is-hover', !!h);
      label.textContent = v && !h ? 'View' : '';
    });
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * .25, y = (e.clientY - r.top - r.height / 2) * .35;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
      el.style.transition = 'transform .5s cubic-bezier(.22,.8,.2,1), color .5s, border-color .5s, background-color .5s, box-shadow .5s';
    });
  }

  /* =========================================================
     GSAP animations
     ========================================================= */
  function splitWords(el) {
    var frag = document.createDocumentFragment();
    function walk(node, target) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { target.appendChild(document.createTextNode(' ')); return; }
            var mask = document.createElement('span'); mask.className = 'split-line';
            var w = document.createElement('span'); w.className = 'split-word'; w.textContent = part;
            mask.appendChild(w); target.appendChild(mask);
          });
        } else if (n.nodeType === 1) {
          var clone = n.cloneNode(false); walk(n, clone); target.appendChild(clone);
        }
      });
    }
    walk(el, frag);
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    el.innerHTML = '';
    el.appendChild(frag);
    $$('.split-line', el).forEach(function (m) { m.setAttribute('aria-hidden', 'true'); });
    return $$('.split-word', el);
  }

  if (animate) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero intro
    var heroWords = splitWords($('.hero__title'));
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero__media img', { scale: 1.25, duration: 2.6, ease: 'power3.out' }, 0)
      .from('.hero__veil', { opacity: 0, duration: 1.6 }, 0)
      .from('.hero__kicker', { y: 20, opacity: 0, duration: 1.2 }, .4)
      .from(heroWords, { yPercent: 110, duration: 1.4, stagger: .06 }, .5)
      .from('.hero__lede, .hero__ctas', { y: 30, opacity: 0, duration: 1.3, stagger: .12 }, 1.1)
      .from('.hero__badge', { scale: .6, opacity: 0, duration: 1.4 }, 1.3)
      .from('.booking__fields', { y: 60, opacity: 0, duration: 1.4 }, 1.2)
      .from('.booking__assure li', { y: 14, opacity: 0, duration: 1, stagger: .08 }, 1.5)
      .from('.header__inner', { y: -30, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, .8);

    // Hero parallax
    gsap.to('.hero__media img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__content', { y: -80, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Headings: word mask reveal
    $$('[data-split]').forEach(function (h) {
      if (h.classList.contains('hero__title')) return;
      var w = splitWords(h);
      gsap.from(w, { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: .05, scrollTrigger: { trigger: h, start: 'top 85%' } });
    });

    // Kickers, body copy, generic fade-ups
    gsap.utils.toArray('.kicker, .body, .rooms__aside p, .menu-card, .hours, .cta-row, .travel li, .score, .score__src, .score__bars, .quotes, .faq__list details, .stat, .gather__list li, .perk, .escape__body, .final__assure, .footer__top, .footer__grid > div').forEach(function (el) {
      if (el.closest('.hero') || el.closest('.notes-panel')) return;
      gsap.from(el, { y: 36, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });

    // Image reveals: curtain wipe + settle
    gsap.utils.toArray('.img-reveal').forEach(function (fig) {
      var img = $('img', fig);
      var t = gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 85%' } });
      t.fromTo(fig, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' })
       .from(img, { scale: 1.35, duration: 2.2, ease: 'expo.out' }, .2);
    });

    // Parallax depth on layered images
    gsap.utils.toArray('[data-speed]').forEach(function (el) {
      gsap.to(el, { yPercent: parseFloat(el.dataset.speed) * 100, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.to('.intro__img--b', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.intro__media', start: 'top bottom', end: 'bottom top', scrub: true } });
    ['.gather__media img', '.final__media img'].forEach(function (s) {
      gsap.fromTo(s, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: $(s).closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.from('.gather__card', { y: 80, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.gather', start: 'top 60%' } });

    // Statement: words light up with scroll
    var st = $('[data-words]');
    if (st) {
      var txt = st.textContent.trim().split(/\s+/);
      st.setAttribute('aria-label', st.textContent.trim());
      st.innerHTML = txt.map(function (w) { return '<span class="w" aria-hidden="true">' + w + '</span>'; }).join(' ');
      gsap.to($$('.w', st), { opacity: 1, stagger: .08, ease: 'none', scrollTrigger: { trigger: st, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    }

    // Counters
    $$('[data-count]').forEach(function (el) {
      var to = +el.dataset.count, suffix = el.dataset.suffix || '', o = { v: 0 };
      gsap.to(o, { v: to, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: function () { el.textContent = Math.round(o.v) + suffix; } });
    });

    // Rooms: pinned horizontal scroll on desktop
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1025px)', function () {
      var track = $('.rooms__track');
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth + 40); };
      var tween = gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: {
          trigger: '.rooms__pin', start: 'top top', end: function () { return '+=' + dist(); },
          pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function (self) { gsap.set('.rooms__progress span', { scaleX: .18 + self.progress * .82 }); }
        }
      });
      $$('.room__img img', track).forEach(function (img) {
        gsap.fromTo(img, { xPercent: -8, scale: 1.15 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: img.closest('.room'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      });
      return function () { gsap.set(track, { clearProps: 'transform' }); };
    });
    mm.add('(max-width: 1024px)', function () {
      var track = $('.rooms__track');
      var onS = function () { var p = track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth); gsap.set('.rooms__progress span', { scaleX: .18 + p * .82 }); };
      track.addEventListener('scroll', onS, { passive: true });
      return function () { track.removeEventListener('scroll', onS); };
    });

    // Refresh once images/fonts settle
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  } else {
    // Without GSAP, keep the rooms progress bar useful on swipe
    var track = $('.rooms__track'), bar = $('.rooms__progress span');
    track.addEventListener('scroll', function () { var p = track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth); bar.style.transform = 'scaleX(' + (.18 + p * .82) + ')'; }, { passive: true });
  }

  /* =========================================================
     Design notes (presentation layer)
     ========================================================= */
  var notesOn = false;
  var toggle = $('#notesToggle'), body = $('#notesBody');
  var noted = $$('[data-note]');
  var intro = document.createElement('div');
  intro.innerHTML =
    '<p class="notes-intro">Every section has one job: move a visitor one step closer to booking, without ever feeling sold to.</p>' +
    '<p class="notes-flow"><strong>The order:</strong> feel it (hero) → act early (dates) → trust it (awards) → believe it (philosophy) → ' +
    'choose (rooms, dining) → picture it (a day here) → a reason to book now (escapes) → go bigger (whole house) → ' +
    'remove doubts (reviews, book direct, travel, questions) → act (final invitation).<br><br>' +
    '<strong>Brief kept:</strong> no portfolio grid, no founder portrait, no contact forms, no prices. Every section maps to standard ' +
    'Squarespace 7.1 sections plus custom CSS. Motion is light on phones, so the page stays fast.</p>';
  body.appendChild(intro);

  var items = [];
  noted.forEach(function (el, i) {
    var n = i + 1, title = el.getAttribute('data-note-title'), text = el.getAttribute('data-note');
    var item = document.createElement('button');
    item.type = 'button'; item.className = 'note-item';
    item.innerHTML = '<span class="note-item__num">' + n + '</span><h4></h4><p></p>';
    $('h4', item).textContent = title; $('p', item).textContent = text;
    item.addEventListener('click', function () {
      if (el.id === 'header' || el.id === 'mbar') { focusItem(i); return; }
      scrollToEl(el, -((header && header.offsetHeight) || 0));
    });
    body.appendChild(item); items.push(item);

    var pin = document.createElement('button');
    pin.type = 'button'; pin.className = 'note-pin';
    pin.innerHTML = '<b>' + n + '</b><span></span>';
    $('span', pin).textContent = title;
    pin.setAttribute('aria-label', 'Design note ' + n + ': ' + title);
    pin.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); if (!notesOn) setNotes(true); focusItem(i); });
    var host = el.classList.contains('rooms') ? $('.rooms__pin', el) : el;
    if (getComputedStyle(host).position === 'static') host.classList.add('has-pin');
    host.appendChild(pin);
  });

  function focusItem(i) {
    items.forEach(function (it, j) { it.classList.toggle('is-current', j === i); });
    noted.forEach(function (el, j) { el.classList.toggle('is-noted', j === i); });
    var it = items[i];
    if (it) body.scrollTo({ top: it.offsetTop - body.offsetTop - 8, behavior: reduce ? 'auto' : 'smooth' });
  }
  var sectionNotes = noted.filter(function (el) { return el.tagName === 'SECTION' || el.tagName === 'FOOTER'; });
  if ('IntersectionObserver' in window) {
    var nIO = new IntersectionObserver(function (es) {
      if (!notesOn) return;
      es.forEach(function (e) { if (e.isIntersecting) focusItem(noted.indexOf(e.target)); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sectionNotes.forEach(function (el) { nIO.observe(el); });
  }
  function setNotes(on) {
    notesOn = on;
    doc.classList.toggle('notes-on', on);
    toggle.setAttribute('aria-pressed', String(on));
    $('.notes-toggle__label', toggle).textContent = on ? 'Hide design notes' : 'Show design notes';
    try { localStorage.setItem('halden-notes', on ? '1' : '0'); } catch (e) { /* unavailable */ }
    if (on) {
      header.classList.remove('is-hidden');
      var mid = window.innerHeight * .45, cur = 0;
      sectionNotes.forEach(function (el) { if (el.getBoundingClientRect().top < mid) cur = noted.indexOf(el); });
      focusItem(cur);
    }
    updateMbar();
    if (window.ScrollTrigger) setTimeout(function () { ScrollTrigger.refresh(); }, 650);
  }
  toggle.addEventListener('click', function () { setNotes(!notesOn); });
  $('#notesClose').addEventListener('click', function () { setNotes(false); });
  // Keep wheel scrolling inside the notes panel
  $('#notesPanel').setAttribute('data-lenis-prevent', '');

  var saved = null;
  try { saved = localStorage.getItem('halden-notes'); } catch (e) { /* ignore */ }
  if (new URLSearchParams(location.search).has('notes') || saved === '1') setNotes(true);
  onScroll();
})();
