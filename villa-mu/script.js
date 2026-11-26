/* Villa Mu: home page interactions */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  if (!hasGsap || reduced) doc.classList.remove('js-anim');

  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Smooth scroll (Lenis) ---------------- */
  var lenis = null;
  if (window.Lenis && hasGsap && !reduced) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target) {
    var el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    var offset = el.id === 'top' ? 0 : -70;
    if (lenis) lenis.scrollTo(el, { offset: offset, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset + offset, behavior: reduced ? 'auto' : 'smooth' });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var el = $(id);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(el);
    if (id === '#enquire') setTimeout(function () { var f = $('#fArrive'); if (f && !f.value) f.focus({ preventScroll: true }); }, 1300);
  });

  /* ---------------- Nav ---------------- */
  var nav = $('.nav');
  var lastY = 0;
  function onScroll() {
    var y = window.pageYOffset;
    nav.classList.toggle('is-scrolled', y > 40);
    var menuOpen = document.body.classList.contains('menu-open');
    nav.classList.toggle('is-hidden', !menuOpen && y > 600 && y > lastY + 4);
    if (y < lastY - 4) nav.classList.remove('is-hidden');
    lastY = y;
    updateMbar(y);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  var burger = $('.nav__burger');
  var menu = $('#mobileMenu');
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    if (lenis) lenis.start();
  }
  burger.addEventListener('click', function () {
    var open = menu.hidden;
    if (!open) { closeMenu(); return; }
    menu.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('menu-open');
    nav.classList.remove('is-hidden');
    if (lenis) lenis.stop();
    if (hasGsap && !reduced) gsap.from($$('#mobileMenu nav a, #mobileMenu .btn'), { y: 30, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'power3.out' });
  });

  /* active section highlight */
  var navLinks = $$('.nav__links a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (l) { var s = $(l.getAttribute('href')); if (s) io.observe(s); });
  }

  /* ---------------- Mobile action bar ---------------- */
  var mbar = $('.mbar');
  var hero = $('.hero');
  var enquire = $('#enquire');
  var enquireVisible = false;
  if ('IntersectionObserver' in window && enquire) {
    new IntersectionObserver(function (en) { enquireVisible = en[0].isIntersecting; updateMbar(window.pageYOffset); }, { threshold: 0.15 }).observe(enquire);
  }
  function updateMbar(y) {
    if (!mbar) return;
    mbar.classList.toggle('is-visible', y > hero.offsetHeight * 0.6 && !enquireVisible);
  }

  /* ---------------- Dates ---------------- */
  function iso(d) { var z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 10); }
  function addDays(str, n) { var d = new Date(str + 'T12:00:00'); d.setDate(d.getDate() + n); return iso(d); }
  function nightsBetween(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000); }
  function fmt(str) { return new Date(str + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
  var today = iso(new Date());

  function linkDates(arr, dep, out) {
    arr.min = today; dep.min = addDays(today, 1);
    function update() {
      if (arr.value) {
        dep.min = addDays(arr.value, 1);
        if (!dep.value || dep.value <= arr.value) dep.value = addDays(arr.value, 7);
      }
      arr.closest('.field').classList.remove('is-invalid');
      dep.closest('.field').classList.remove('is-invalid');
      if (out) {
        if (arr.value && dep.value && dep.value > arr.value) {
          var n = nightsBetween(arr.value, dep.value);
          out.innerHTML = '<strong>' + n + ' night' + (n === 1 ? '' : 's') + '</strong> &middot; ' + fmt(arr.value) + ' to ' + fmt(dep.value);
        } else {
          out.textContent = out.dataset.empty || '';
        }
      }
    }
    arr.addEventListener('change', update);
    dep.addEventListener('change', update);
    return update;
  }
  var qNights = $('#qNights');
  qNights.dataset.empty = qNights.textContent;
  var updQ = linkDates($('#qArrive'), $('#qDepart'), qNights);
  var updF = linkDates($('#fArrive'), $('#fDepart'), $('#fNights'));

  function validDates(a, d) {
    var ok = true;
    if (!a.value || a.value < today) { a.closest('.field').classList.add('is-invalid'); ok = false; }
    if (!d.value || (a.value && d.value <= a.value)) { d.closest('.field').classList.add('is-invalid'); ok = false; }
    return ok;
  }

  /* ---------------- Enquiry form ---------------- */
  var form = $('#enquiryForm');
  var steps = $$('.form__step', form);
  var done = $('.form__done', form);
  function showStep(n) {
    steps.forEach(function (s) {
      var on = s.dataset.step === String(n);
      s.hidden = !on;
      s.classList.toggle('is-active', on);
    });
    if (n === 2) {
      var fa = $('#fArrive').value, fd = $('#fDepart').value;
      var kids = parseInt($('#fChildren').value, 10);
      $('#fSummary').textContent = (fa && fd) ? fmt(fa) + ' to ' + fmt(fd) + ' \u00b7 ' + nightsBetween(fa, fd) + ' nights \u00b7 ' + $('#fAdults').value + ' adults' + (kids ? ', ' + kids + ' children' : '') : '';
    }
    var active = steps[n - 1];
    if (hasGsap && !reduced) gsap.from(active, { x: 30, opacity: 0, duration: 0.5, ease: 'power3.out' });
    var first = active.querySelector('input, select');
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 50);
  }

  /* Quick check in hero → prefill and jump to step 2 */
  $('#quickCheck').addEventListener('submit', function (e) {
    e.preventDefault();
    var a = $('#qArrive'), d = $('#qDepart');
    if (!validDates(a, d)) {
      qNights.innerHTML = '<span style="color:#c0392b">Please choose your arrival and departure dates</span>';
      (a.value ? d : a).focus();
      return;
    }
    $('#fArrive').value = a.value;
    $('#fDepart').value = d.value;
    var g = parseInt($('#qGuests').value, 10);
    $('#fAdults').value = String(Math.min(g, 8));
    $('#fChildren').value = '0';
    updF();
    track('quick_check');
    scrollToTarget(enquire);
    setTimeout(function () { showStep(2); }, 900);
  });

  form.querySelector('[data-next]').addEventListener('click', function () {
    var a = $('#fArrive'), d = $('#fDepart'), err = $('#err1');
    var total = parseInt($('#fAdults').value, 10) + parseInt($('#fChildren').value, 10);
    err.textContent = '';
    if (!validDates(a, d)) { err.textContent = 'Please choose valid arrival and departure dates.'; return; }
    if (total > 8) { err.textContent = 'Villa Mu sleeps up to 8 guests in total.'; return; }
    showStep(2);
  });
  form.querySelector('[data-back]').addEventListener('click', function () { showStep(1); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = $('#err2');
    var name = form.elements.name, email = form.elements.email;
    err.textContent = '';
    [name, email].forEach(function (f) { f.closest('.field').classList.remove('is-invalid'); });
    if (!name.value.trim()) { name.closest('.field').classList.add('is-invalid'); err.textContent = 'Please add your name.'; name.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.closest('.field').classList.add('is-invalid'); err.textContent = 'Please add a valid email so we can reply.'; email.focus(); return; }

    var a = $('#fArrive').value, d = $('#fDepart').value;
    var n = nightsBetween(a, d);
    var lines = [
      'Hello, I would like to check availability at Villa Mu.',
      '',
      'Arrive: ' + fmt(a),
      'Depart: ' + fmt(d) + ' (' + n + ' nights)',
      'Guests: ' + $('#fAdults').value + ' adults, ' + $('#fChildren').value + ' children',
      '',
      'Name: ' + name.value.trim(),
      'Email: ' + email.value.trim(),
      'Phone: ' + (form.elements.phone.value.trim() || 'n/a'),
      '',
      form.elements.message.value.trim()
    ];
    var body = lines.join('\n');
    var subject = 'Villa Mu enquiry: ' + fmt(a) + ' to ' + fmt(d);
    /* TODO (go-live): send to a form backend (e.g. Formspree / Netlify Forms / CRM) instead of mailto */
    var mailto = 'mailto:david50irvine@icloud.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    $('#waDone').href = 'https://wa.me/447714845140?text=' + encodeURIComponent(body);
    steps.forEach(function (s) { s.hidden = true; });
    done.hidden = false;
    if (hasGsap && !reduced) gsap.from(done.children, { y: 24, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out' });
    track('enquiry_submit');
    window.location.href = mailto;
  });

  ['input', 'change'].forEach(function (ev) {
    form.addEventListener(ev, function () { formTouched = true; });
  });
  var formTouched = false;

  /* lightweight analytics hook: wire to GA4/Plausible at go-live */
  function track(name) { try { if (window.gtag) window.gtag('event', name); if (window.plausible) window.plausible(name); } catch (e) { /* noop */ } }

  /* ---------------- Amenity tabs ---------------- */
  var tabs = $$('.am-tabs [role="tab"]');
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      var p = $('#' + t.getAttribute('aria-controls'));
      p.hidden = !on;
      p.classList.toggle('is-active', on);
      if (on && hasGsap && !reduced) gsap.from(p.children, { y: 20, opacity: 0, stagger: 0.04, duration: 0.5, ease: 'power2.out' });
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        next.focus(); selectTab(next);
      }
    });
  });

  /* ---------------- Location places ---------------- */
  var placeImg = $('#placeImg'), placeCap = $('#placeCap');
  var places = $$('.place');
  places.forEach(function (p) { var i = new Image(); i.src = p.dataset.img; });
  function showPlace(p) {
    if (p.classList.contains('is-active')) return;
    places.forEach(function (x) { x.classList.toggle('is-active', x === p); });
    var name = p.querySelector('.place__name').textContent;
    var dist = p.querySelector('.place__dist').textContent;
    var swap = function () { placeImg.src = p.dataset.img; placeImg.alt = name; placeCap.textContent = name + ' · ' + dist; };
    if (hasGsap && !reduced) {
      gsap.killTweensOf(placeImg);
      gsap.to(placeImg, { opacity: 0, scale: 1.04, duration: 0.2, onComplete: function () { swap(); gsap.to(placeImg, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }); } });
    } else swap();
  }
  places.forEach(function (p) {
    p.tabIndex = 0;
    p.addEventListener('mouseenter', function () { showPlace(p); });
    p.addEventListener('focus', function () { showPlace(p); });
    p.addEventListener('click', function () { showPlace(p); });
  });
  if (places[0]) places[0].classList.add('is-active');

  /* ---------------- Lightbox ---------------- */
  var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCount = $('#lbCount');
  var items = $$('.m-item');
  var idx = 0, lastFocus = null;
  function openLb(i) {
    idx = (i + items.length) % items.length;
    var it = items[idx], im = it.querySelector('img');
    lbImg.src = it.dataset.full; lbImg.alt = im.alt;
    lbCount.textContent = (idx + 1) + ' / ' + items.length;
    if (lb.hidden) {
      lastFocus = document.activeElement;
      lb.hidden = false;
      if (lenis) lenis.stop();
      document.body.style.overflow = 'hidden';
      $('.lightbox__close').focus();
      if (hasGsap && !reduced) gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }
    if (hasGsap && !reduced) gsap.fromTo(lbImg, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
  }
  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lenis) lenis.start();
    if (lastFocus) lastFocus.focus();
  }
  items.forEach(function (it, i) { it.addEventListener('click', function () { openLb(i); }); });
  $('.lightbox__close').addEventListener('click', closeLb);
  $('.lightbox__prev').addEventListener('click', function () { openLb(idx - 1); });
  $('.lightbox__next').addEventListener('click', function () { openLb(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  var tx = 0;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) openLb(idx + (dx < 0 ? 1 : -1)); });

  /* ---------------- Exit intent ---------------- */
  var exitM = $('#exitModal');
  var exitShown = false;
  try { exitShown = sessionStorage.getItem('vm_exit') === '1'; } catch (e) { /* noop */ }
  var armed = false;
  setTimeout(function () { armed = true; }, 12000);
  function openExit() {
    if (exitShown || !armed || formTouched || !lb.hidden) return;
    exitShown = true;
    try { sessionStorage.setItem('vm_exit', '1'); } catch (e) { /* noop */ }
    exitM.hidden = false;
    if (lenis) lenis.stop();
    if (hasGsap && !reduced) {
      gsap.fromTo(exitM, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo('.exit__card', { y: 40, scale: 0.96 }, { y: 0, scale: 1, duration: 0.6, ease: 'power3.out' });
    }
    $('.exit__close').focus();
    track('exit_intent_shown');
  }
  function closeExit() { exitM.hidden = true; if (lenis) lenis.start(); }
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY <= 0) openExit(); });
  }
  $('.exit__close').addEventListener('click', closeExit);
  $('.exit__dismiss').addEventListener('click', closeExit);
  $('[data-exit-cta]').addEventListener('click', closeExit);
  exitM.addEventListener('click', function (e) { if (e.target === exitM) closeExit(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!lb.hidden) closeLb(); if (!exitM.hidden) closeExit(); closeMenu(); }
    if (!lb.hidden) { if (e.key === 'ArrowRight') openLb(idx + 1); if (e.key === 'ArrowLeft') openLb(idx - 1); }
  });

  /* ---------------- FAQ smooth open ---------------- */
  $$('.qa').forEach(function (d) {
    var sum = d.querySelector('summary'), body = d.querySelector('.qa__a');
    sum.addEventListener('click', function (e) {
      if (!hasGsap || reduced) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(body, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut', onComplete: function () { d.open = false; gsap.set(body, { clearProps: 'all' }); ScrollTrigger.refresh(); } });
      } else {
        d.open = true;
        gsap.fromTo(body, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out', onComplete: function () { gsap.set(body, { clearProps: 'all' }); ScrollTrigger.refresh(); } });
      }
    });
  });

  /* =====================================================
     GSAP motion
     ===================================================== */
  if (!hasGsap || reduced) { onScroll(); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* split headings into words for line reveals */
  function splitWords(el) {
    var out = document.createDocumentFragment();
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { out.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'); w.className = 'w';
          w.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em';
          var wi = document.createElement('span'); wi.className = 'wi'; wi.style.display = 'inline-block';
          wi.textContent = part; w.appendChild(wi); out.appendChild(w);
        });
      } else if (node.nodeType === 1) {
        var clone = node.cloneNode(false);
        clone.appendChild(splitWords(node));
        out.appendChild(clone);
      }
    });
    return out;
  }
  $$('.reveal-lines').forEach(function (h) {
    var frag = splitWords(h); h.innerHTML = ''; h.appendChild(frag);
    gsap.from(h.querySelectorAll('.wi'), {
      yPercent: 110, rotate: 4, duration: 1.1, ease: 'power4.out', stagger: 0.06,
      scrollTrigger: { trigger: h, start: 'top 85%' }
    });
  });

  /* hero intro */
  var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.fromTo('.hero__img', { scale: 1.25 }, { scale: 1.06, duration: 2.6, ease: 'power2.out' }, 0)
    .from('.hero__title .split > span', { yPercent: 105, duration: 1.3, stagger: 0.12 }, 0.25)
    .from('.hero__eyebrow', { y: 20, opacity: 0, duration: 0.9 }, 0.2)
    .from('.hero__sub', { y: 24, opacity: 0, duration: 1 }, 0.6)
    .from('.hero__trust li', { y: 16, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.75)
    .from('.widget', { y: 60, opacity: 0, duration: 1.2 }, 0.55)
    .from('.nav__inner > *', { y: -20, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.3)
    .from('.hero__scroll', { opacity: 0, duration: 1 }, 1.2);

  gsap.to('.hero__img', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__copy', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });

  /* counters */
  $$('[data-count]').forEach(function (el) {
    var end = parseFloat(el.dataset.count), dec = parseInt(el.dataset.decimals || '0', 10);
    var o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: function () { el.textContent = o.v.toFixed(dec); }
    });
  });
  gsap.from('.fact', { y: 30, opacity: 0, stagger: 0.07, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.facts', start: 'top 90%' } });

  /* generic reveals */
  ScrollTrigger.batch('.reveal, .reveal-up', {
    start: 'top 88%',
    onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: 'power3.out', overwrite: true }); }
  });
  $$('.reveal-clip').forEach(function (el) {
    gsap.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power4.inOut', scrollTrigger: { trigger: el, start: 'top 80%' } });
    gsap.fromTo(el.querySelector('img'), { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%' } });
  });

  /* story collage */
  gsap.from('.story__img', { y: 80, opacity: 0, duration: 1.3, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.story__media', start: 'top 80%' } });
  gsap.from('.story__badge', { scale: 0, rotate: -90, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.story__media', start: 'top 60%' } });

  var mm = gsap.matchMedia();
  mm.add('(min-width: 981px)', function () {
    /* parallax collage */
    $$('.parallax').forEach(function (el) {
      var s = parseFloat(el.dataset.speed || 0);
      gsap.to(el, { yPercent: s * 100, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* horizontal day story */
    var track = $('.day__track');
    var getDist = function () { return Math.max(0, track.scrollWidth - (window.innerWidth - track.getBoundingClientRect().left + gsap.getProperty(track, 'x'))); };
    var horiz = gsap.to(track, {
      x: function () { return -getDist(); }, ease: 'none',
      scrollTrigger: {
        trigger: '.day', start: 'top top', end: function () { return '+=' + getDist(); },
        pin: '.day__pin', scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (self) { gsap.set('.day__progress span', { width: (self.progress * 100) + '%' }); }
      }
    });
    $$('.day-card figure img').forEach(function (img) {
      gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: img.closest('.day-card'), containerAnimation: horiz, start: 'left right', end: 'right left', scrub: true } });
    });
    gsap.from('.day-card', { y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.day', start: 'top 60%' } });

    /* 3D tilt on USP cards */
    $$('.tilt').forEach(function (card) {
      var rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
      var ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
      gsap.set(card, { transformPerspective: 900 });
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
      });
      card.addEventListener('mouseleave', function () { rx(0); ry(0); });
    });
  });

  gsap.from('.usp-card', { y: 70, opacity: 0, stagger: 0.12, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.usp__grid', start: 'top 85%' } });
  gsap.from('.am-panel.is-active .am-item', { y: 30, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.am-panels', start: 'top 85%' } });
  gsap.from('.review', { y: 50, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.reviews__track', start: 'top 85%' } });
  gsap.from('.place', { x: -30, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.places', start: 'top 85%' } });
  gsap.from('.airport', { y: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.airports', start: 'top 90%' } });
  gsap.from('.m-item', { y: 60, opacity: 0, stagger: 0.05, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.masonry', start: 'top 85%' } });
  gsap.from('.qa', { y: 24, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.faq__list', start: 'top 85%' } });
  gsap.fromTo('.enquire__bg img', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.enquire', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.enquire__copy > *', { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.enquire', start: 'top 70%' } });
  gsap.from('.form', { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.enquire', start: 'top 70%' } });

  /* magnetic buttons + cursor (fine pointers only) */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.magnetic').forEach(function (btn) {
      var xT = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
      var yT = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        xT((e.clientX - r.left - r.width / 2) * 0.25);
        yT((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener('mouseleave', function () { xT(0); yT(0); });
    });

    var cursor = $('.cursor');
    cursor.classList.add('is-on');
    var cx = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3' });
    var cy = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3' });
    window.addEventListener('mousemove', function (e) { cursor.classList.add('is-moved'); cx(e.clientX); cy(e.clientY); }, { passive: true });
    document.addEventListener('mouseover', function (e) {
      cursor.classList.toggle('is-hover', !!e.target.closest('a, button, .place, summary, input, select, textarea'));
    });
  }

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  onScroll();
})();
