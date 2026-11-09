/* Sell HOU 2 You Team — homepage interactions */
(function () {
  'use strict';

  var doc = document.documentElement;
  var body = document.body;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  doc.classList.add('js');
  if (reduced) doc.classList.add('reduced');
  if (!hasGsap) doc.classList.add('no-gsap');

  var store = {
    get: function (k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------- Year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Split text into words ---------- */
  function splitWords(el) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        var parts = node.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'); w.className = 'word';
          var i = document.createElement('span'); i.textContent = p;
          w.appendChild(i); frag.appendChild(w);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== 'BR') {
        splitWords(node);
      }
    });
  }
  if (hasGsap && !reduced) $$('[data-split]').forEach(function (el) { el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim()); splitWords(el); });

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = null;
  if (!reduced && typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1 });
    if (hasGsap) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  function headerOffset() { return -($('.header').offsetHeight + 12); }
  function scrollToEl(target) {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: headerOffset() });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset + headerOffset(), behavior: reduced ? 'auto' : 'smooth' });
  }

  /* ---------- Anchor links ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (a.hasAttribute('data-open-valuation')) return;
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = $(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (id === '#top') { if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      scrollToEl(target);
    });
  });

  /* ---------- Header behaviour + progress + sticky CTA ---------- */
  var header = $('.header');
  var progress = $('.scroll-progress span');
  var stickyCta = $('.sticky-cta');
  var hero = $('.hero');
  var contact = $('#contact');
  var lastY = 0;
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || doc.scrollTop;
    var max = doc.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    header.classList.toggle('is-scrolled', y > 60);
    if (!body.classList.contains('menu-open')) header.classList.toggle('is-hidden', y > lastY && y > 500);
    lastY = y;
    if (stickyCta) {
      var heroEnd = hero.offsetTop + hero.offsetHeight - 200;
      var contactTop = contact.getBoundingClientRect().top;
      stickyCta.classList.toggle('is-visible', y > heroEnd && contactTop > window.innerHeight * 0.6);
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* active nav link */
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) navLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['sell', 'relocate', 'listings', 'team', 'reviews'].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Mobile menu ---------- */
  var burger = $('.burger');
  var menu = $('#mobile-menu');
  function closeMenu() {
    if (!body.classList.contains('menu-open')) return;
    body.classList.remove('menu-open', 'is-locked');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
  burger.addEventListener('click', function () {
    var open = !body.classList.contains('menu-open');
    if (!open) { closeMenu(); return; }
    body.classList.add('menu-open', 'is-locked');
    header.classList.remove('is-hidden');
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    if (lenis) lenis.stop();
    if (hasGsap && !reduced) window.gsap.fromTo($$('#mobile-menu nav a'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.7, delay: 0.2, ease: 'power3.out' });
  });
  $$('#mobile-menu button').forEach(function (b) { b.addEventListener('click', closeMenu); });

  /* ---------- Toast ---------- */
  var toastEl = $('.toast'); var toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('is-show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-show'); }, 4200);
  }

  /* ---------- Modals ---------- */
  var lastFocus = null;
  function openModal(m) {
    if (!m) return;
    $$('.modal.is-open').forEach(function (o) { if (o !== m) closeModal(o, true); });
    lastFocus = document.activeElement;
    m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false');
    body.classList.add('is-locked'); if (lenis) lenis.stop();
    setTimeout(function () {
      var f = $('.msf__step.is-active input:not([type=radio]), .modal__content input', m) || $('.modal__close', m);
      if (f) f.focus({ preventScroll: true });
    }, 120);
  }
  function closeModal(m, keepLock) {
    if (!m) return;
    m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true');
    if (!keepLock) { body.classList.remove('is-locked'); if (lenis) lenis.start(); if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); }
  }
  $$('.modal').forEach(function (m) {
    $$('[data-close]', m).forEach(function (c) { c.addEventListener('click', function () { closeModal(m); }); });
    m.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('button, input, select, textarea, a[href]', m).filter(function (el) { return el.offsetParent !== null && !el.disabled; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { $$('.modal.is-open').forEach(function (m) { closeModal(m); }); closeMenu(); }
  });

  /* ---------- Valuation multi-step form ---------- */
  var valModal = $('#valuation');
  var msf = $('[data-msf]');
  var steps = $$('.msf__step', msf);
  var stepNum = $('[data-step-num]', valModal);
  var bar = $('.modal__progress span', valModal);
  var stepLabel = $('.modal__step-label', valModal);
  var current = 1;

  function showStep(n) {
    current = n;
    steps.forEach(function (s) { s.classList.toggle('is-active', String(s.dataset.step) === String(n)); });
    if (n === 'done') { bar.style.width = '100%'; stepLabel.style.visibility = 'hidden'; return; }
    stepLabel.style.visibility = 'visible';
    stepNum.textContent = n;
    bar.style.width = (n / 4 * 100) + '%';
    var f = $('.msf__step.is-active input:not([type=radio])', msf);
    if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 60);
  }
  function validateStep(n) {
    var step = $('.msf__step[data-step="' + n + '"]', msf);
    var ok = true;
    $$('input[required]', step).forEach(function (i) {
      var wrap = i.closest('.fl');
      var valid = i.value.trim() !== '' && i.checkValidity();
      if (wrap) wrap.classList.toggle('has-error', !valid);
      if (!valid && ok) { ok = false; i.focus(); }
    });
    if (!ok) shake(step);
    return ok;
  }
  function shake(el) {
    if (hasGsap && !reduced) window.gsap.fromTo(el, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  }
  $$('[data-next]', msf).forEach(function (b) { b.addEventListener('click', function () { if (validateStep(current)) showStep(current + 1); }); });
  $$('[data-prev]', msf).forEach(function (b) { b.addEventListener('click', function () { showStep(current - 1); }); });
  /* auto-advance on step 3 choice for less friction */
  $$('[data-group="timeline"] input', msf).forEach(function (r) { r.addEventListener('change', function () { setTimeout(function () { showStep(4); }, 260); }); });
  msf.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && current < 4) { e.preventDefault(); if (validateStep(current)) showStep(current + 1); }
  });
  msf.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateStep(4)) return;
    var name = ($('#m-name').value || '').trim().split(' ')[0];
    $('[data-done-name]').textContent = name ? ', ' + name : '';
    showStep('done');
  });

  function openValuation(address) {
    if (current === 'done') { msf.reset(); }
    var input = $('#m-address');
    if (address) { input.value = address; showStep(2); } else { showStep(1); }
    openModal(valModal);
  }
  $$('[data-open-valuation]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); closeMenu(); openValuation(''); });
  });
  [['[data-hero-sell]', '#hero-address'], ['[data-band-sell]', '#band-address']].forEach(function (pair) {
    var f = $(pair[0]);
    if (!f) return;
    f.addEventListener('submit', function (e) { e.preventDefault(); openValuation($(pair[1]).value.trim()); });
  });

  /* ---------- Guide modal + exit intent ---------- */
  var guideModal = $('#guide-modal');
  $$('[data-open-guide]').forEach(function (b) { b.addEventListener('click', function () { openModal(guideModal); }); });
  var heroBuy = $('[data-hero-buy]');
  if (heroBuy) heroBuy.addEventListener('submit', function (e) { e.preventDefault(); store.set('exitShown', '1'); openModal(guideModal); });

  $$('[data-guide-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      store.set('exitShown', '1');
      var nameInput = $('input[type=text]', f);
      var n = nameInput ? nameInput.value.trim() : '';
      f.reset();
      closeModal(guideModal);
      toast('Thanks' + (n ? ', ' + n : '') + '! Your Katy Family Guide is on its way to your inbox.');
    });
  });

  var armed = false;
  setTimeout(function () { armed = true; }, 9000);
  if (finePointer) {
    document.addEventListener('mouseout', function (e) {
      if (!armed || e.relatedTarget || e.clientY > 8) return;
      if (store.get('exitShown') || $('.modal.is-open')) return;
      store.set('exitShown', '1');
      openModal(guideModal);
    });
  }

  /* ---------- Lead widget tabs ---------- */
  var tabs = $$('.lead-widget__tabs [role=tab]');
  var tabWrap = $('.lead-widget__tabs');
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      tabs.forEach(function (o, j) {
        var on = i === j;
        o.classList.toggle('is-active', on);
        o.setAttribute('aria-selected', on ? 'true' : 'false');
        o.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(o.getAttribute('aria-controls'));
        panel.hidden = !on; panel.classList.toggle('is-active', on);
      });
      tabWrap.setAttribute('data-active', i);
    });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = tabs[(i + 1) % tabs.length]; n.click(); n.focus(); }
    });
  });

  /* ---------- Listing alerts + contact ---------- */
  var alertsForm = $('[data-alerts-form]');
  if (alertsForm) alertsForm.addEventListener('submit', function (e) {
    e.preventDefault(); alertsForm.reset();
    toast("You're on the list! We'll text you new matches first.");
  });

  var contactForm = $('[data-contact-form]');
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    $$('[required]', contactForm).forEach(function (i) {
      var valid = i.value.trim() !== '' && i.checkValidity();
      i.closest('.fl').classList.toggle('has-error', !valid);
      if (!valid && ok) { ok = false; i.focus(); }
    });
    if (!ok) { shake(contactForm); return; }
    var name = $('#c-name').value.trim().split(' ')[0];
    contactForm.innerHTML = '<div class="msf__done" style="padding:30px 0"><div class="done-check" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 27l7 7 15-15" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div><h3 class="h3">Talk soon, ' + escapeHtml(name || 'friend') + '!</h3><p style="color:var(--muted)">Colby or Kaylon will reach out within one business hour to set up your call.</p></div>';
  });
  $$('[required]', contactForm).forEach(function (i) { i.addEventListener('input', function () { i.closest('.fl').classList.remove('has-error'); }); });

  function escapeHtml(s) { return s.replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* tour links prefill */
  $$('[data-tour]').forEach(function (a) {
    a.addEventListener('click', function () {
      var card = a.closest('.listing');
      var price = $('.listing__price', card).textContent;
      var city = $('h3', card).textContent;
      var msg = $('#c-msg'); if (msg) msg.value = "I'd like to tour the " + price + ' home in ' + city + '.';
      var buy = $('[name=intent][value=buy]'); if (buy) buy.checked = true;
    });
  });

  /* ---------- Listings filter + favourites ---------- */
  var chips = $$('.chip');
  var listings = $$('.listing');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (o) { o.classList.toggle('is-active', o === c); });
      var f = c.dataset.filter;
      listings.forEach(function (l) { l.classList.toggle('is-hidden', !(f === 'all' || l.dataset.city === f || l.dataset.city === 'all')); });
      var shown = listings.filter(function (l) { return !l.classList.contains('is-hidden'); });
      if (hasGsap && !reduced) window.gsap.fromTo(shown, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out', clearProps: 'transform,opacity' });
      if (hasGsap) window.ScrollTrigger.refresh();
    });
  });
  $$('.listing__fav').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on) toast('Saved! Want alerts for homes like this? Enter your number below.');
      if (hasGsap && !reduced) window.gsap.fromTo(b, { scale: 0.7 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });

  /* ---------- Reviews slider ---------- */
  var slides = $$('.rf');
  var dotsWrap = $('.rf-dots');
  var idx = 0; var autoT;
  slides.forEach(function (_, i) {
    var d = document.createElement('button');
    d.setAttribute('role', 'tab'); d.setAttribute('aria-label', 'Review ' + (i + 1));
    d.addEventListener('click', function () { goTo(i); restart(); });
    dotsWrap.appendChild(d);
  });
  var dots = $$('button', dotsWrap);
  function goTo(i) {
    idx = (i + slides.length) % slides.length;
    slides.forEach(function (s, j) { s.classList.toggle('is-active', j === idx); });
    dots.forEach(function (d, j) { d.setAttribute('aria-selected', j === idx ? 'true' : 'false'); });
  }
  function restart() { clearInterval(autoT); if (!reduced) autoT = setInterval(function () { goTo(idx + 1); }, 7000); }
  $('[data-rf="prev"]').addEventListener('click', function () { goTo(idx - 1); restart(); });
  $('[data-rf="next"]').addEventListener('click', function () { goTo(idx + 1); restart(); });
  goTo(0); restart();

  /* ---------- Neighborhood drag scroller ---------- */
  var hoods = $('[data-drag]');
  if (hoods) {
    var track = $('.hoods__track', hoods);
    var pos = 0, startX = 0, startPos = 0, dragging = false, moved = false, velocity = 0, lastX = 0, lastT = 0, rafId;
    function maxPos() { return Math.max(0, track.scrollWidth - hoods.clientWidth); }
    function apply() { pos = Math.min(0, Math.max(-maxPos(), pos)); track.style.transform = 'translate3d(' + pos + 'px,0,0)'; }
    hoods.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      dragging = true; moved = false; startX = lastX = e.clientX; startPos = pos; lastT = performance.now(); velocity = 0;
      cancelAnimationFrame(rafId); hoods.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 5) moved = true;
      var now = performance.now();
      velocity = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX; lastT = now;
      pos = startPos + dx; apply();
    });
    window.addEventListener('pointerup', function () {
      if (!dragging) return;
      dragging = false; hoods.classList.remove('is-dragging');
      var v = velocity * 16;
      (function glide() {
        v *= 0.94; pos += v; apply();
        if (Math.abs(v) > 0.3) rafId = requestAnimationFrame(glide);
      })();
    });
    hoods.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    /* touch devices: let the browser pan vertically, we handle horizontal */
    hoods.style.touchAction = 'pan-y';
    hoods.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); pos -= e.deltaX; apply(); }
    }, { passive: false });
    window.addEventListener('resize', apply);
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && hasGsap && !reduced) {
    $$('.magnetic').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        window.gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: 'power3.out' });
      });
      b.addEventListener('mouseleave', function () { window.gsap.to(b, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' }); });
    });
  }

  /* ---------- Counters (no-GSAP fallback sets final values) ---------- */
  function formatCount(el, v) {
    var d = parseInt(el.dataset.decimals || '0', 10);
    var prefix = el.dataset.prefix ? el.dataset.prefix.replace('&lt;', '<') : '';
    el.textContent = prefix + v.toFixed(d) + (el.dataset.suffix || '');
  }
  var counters = $$('[data-count]');

  /* ---------- Preloader + GSAP choreography ---------- */
  var preloader = $('.preloader');
  function removePreloader() { if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader); body.classList.remove('is-loading'); }

  if (!hasGsap || reduced) {
    removePreloader();
    counters.forEach(function (el) { formatCount(el, parseFloat(el.dataset.count)); });
    return;
  }

  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);

  /* safety: never trap the user behind the preloader */
  var safety = setTimeout(removePreloader, 4500);

  var heroWords = $$('.hero__title .word > span');
  gsap.set(heroWords, { yPercent: 110 });
  gsap.set(['.hero__eyebrow', '.hero__lede', '.lead-widget', '.hero__proof'], { y: 30, opacity: 0 });
  gsap.set('.hero__arch', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 26px 26px)' });
  gsap.set('.hero__img', { scale: 1.25 });
  gsap.set(['.float-card', '.hero__seal'], { opacity: 0, scale: 0.8 });

  var intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  var skipPre = store.get('preSeen');
  if (!skipPre) {
    intro
      .to('.preloader__word', { y: 0, opacity: 1, stagger: 0.09, duration: 0.8 })
      .to('.preloader__bar span', { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, '<')
      .to('.preloader', { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '+=0.15');
    store.set('preSeen', '1');
  } else {
    intro.to('.preloader', { opacity: 0, duration: 0.35 });
  }
  intro
    .add(function () { clearTimeout(safety); removePreloader(); })
    .to('.hero__arch', { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 26px 26px)', duration: 1.4, ease: 'expo.out' }, '-=0.55')
    .to('.hero__img', { scale: 1.1, duration: 1.8, ease: 'expo.out' }, '<')
    .to(heroWords, { yPercent: 0, duration: 1.1, stagger: 0.05 }, '<0.1')
    .to('.hero__eyebrow', { y: 0, opacity: 1, duration: 0.9 }, '<')
    .to('.hero__lede', { y: 0, opacity: 1, duration: 0.9 }, '<0.35')
    .to('.lead-widget', { y: 0, opacity: 1, duration: 0.9 }, '<0.1')
    .to('.hero__proof', { y: 0, opacity: 1, duration: 0.9 }, '<0.1')
    .to('.float-card, .hero__seal', { opacity: 1, scale: 1, duration: 0.9, stagger: 0.12, ease: 'back.out(1.6)' }, '<0.1');

  /* continuous subtle motion */
  gsap.to('.hero__seal', { rotation: 360, duration: 30, repeat: -1, ease: 'none' });
  gsap.to('.float-card--sold', { y: -12, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.float-card--agent', { y: 10, duration: 3.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  /* hero parallax on scroll */
  gsap.to('.hero__img', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* split headings reveal */
  $$('[data-split]').forEach(function (h) {
    if (h.classList.contains('hero__title')) return;
    var words = $$('.word > span', h);
    gsap.from(words, { yPercent: 110, duration: 1.1, stagger: 0.04, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
  });

  /* eyebrows + generic reveals */
  $$('.section-head .eyebrow, .team__copy .eyebrow, .faq .eyebrow, .contact .eyebrow, .process .eyebrow, .value-band .eyebrow').forEach(function (e) {
    gsap.from(e, { opacity: 0, x: -20, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: e, start: 'top 90%', once: true } });
  });
  ST.batch('.reveal', {
    start: 'top 88%', once: true,
    onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out', overwrite: true }); }
  });
  $$('.section-head__lede, .team__copy > p, .team__copy .checks li, .team__actions, .contact__copy > p, .contact__list li, .value-band__lede, .faq__aside, .value-band__form, .contact__form, .accordion details').forEach(function (el) {
    gsap.from(el, { opacity: 0, y: 26, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  /* counters */
  counters.forEach(function (el) {
    var obj = { v: 0 }; var target = parseFloat(el.dataset.count);
    formatCount(el, 0);
    gsap.to(obj, { v: target, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: function () { formatCount(el, obj.v); } });
  });

  /* listings stagger */
  gsap.from('.listing', { opacity: 0, y: 50, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.listings__grid', start: 'top 85%', once: true }, clearProps: 'transform,opacity' });
  gsap.from('.hood', { opacity: 0, x: 80, duration: 1.1, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.hoods', start: 'top 85%', once: true } });
  gsap.from('.reel', { opacity: 0, y: 60, rotate: 2, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.reels', start: 'top 88%', once: true } });

  /* value band parallax */
  gsap.fromTo('.value-band__bg', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.value-band', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* team photos parallax */
  gsap.fromTo('.team__photo--a', { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.team', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.team__photo--b', { y: -30 }, { y: 50, ease: 'none', scrollTrigger: { trigger: '.team', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.team__badge', { scale: 0, rotate: -90, duration: 1.2, ease: 'back.out(1.7)', scrollTrigger: { trigger: '.team__photos', start: 'top 70%', once: true } });

  /* guide book tilt in */
  gsap.from('.guide__book', { rotateY: -60, opacity: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '.guide', start: 'top 80%', once: true } });

  /* pinned horizontal process (desktop only) */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', function () {
    var trackEl = $('.process__track');
    var dist = function () { return Math.max(0, trackEl.scrollWidth - window.innerWidth + 40); };
    var tween = gsap.to(trackEl, {
      x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: '.process', start: 'top top', end: function () { return '+=' + dist(); }, pin: '.process__pin', scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    gsap.to('.process__bar span', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.process', start: 'top top', end: function () { return '+=' + dist(); }, scrub: true, invalidateOnRefresh: true } });
    $$('.step').forEach(function (s) {
      gsap.from(s, { opacity: 0.25, scale: 0.94, duration: 0.6, scrollTrigger: { trigger: s, containerAnimation: tween, start: 'left 85%', end: 'left 55%', scrub: true } });
    });
    return function () { gsap.set(trackEl, { clearProps: 'transform' }); };
  });
  mm.add('(max-width: 900px)', function () {
    $$('.step').forEach(function (s) { gsap.from(s, { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 88%', once: true } }); });
  });

  /* refresh after images load (layout shifts) */
  window.addEventListener('load', function () { ST.refresh(); });
})();
