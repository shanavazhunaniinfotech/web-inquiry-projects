/* The Psychology Alley · homepage concept v3 */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement, body = document.body;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  var hasGsap = !!(gsap && ST) && !reduced;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (hasGsap) gsap.registerPlugin(ST);

  /* ---------- Button text-roll markup ---------- */
  $$('.btn__t').forEach(function (t) {
    var txt = t.textContent; t.textContent = '';
    var r = document.createElement('span'); r.className = 'btn__r'; r.textContent = txt; r.setAttribute('data-text', txt);
    t.appendChild(r);
  });
  function setBtnText(t, txt) { var r = t.querySelector('.btn__r'); if (r) { r.textContent = txt; r.setAttribute('data-text', txt); } else t.textContent = txt; }

  /* ---------- Tracking (GA4 / GTM dataLayer) ---------- */
  window.dataLayer = window.dataLayer || [];
  var evLog = $('#evLog'), toastEl = $('#toast'), toastT;
  function track(name, params) {
    window.dataLayer.push(Object.assign({ event: name }, params || {}));
    if (evLog) {
      var m = evLog.querySelector('.muted'); if (m) m.remove();
      var li = document.createElement('li');
      li.textContent = new Date().toLocaleTimeString('en-AU', { hour12: false }) + '  ' + name + (params ? ' ' + JSON.stringify(params) : '');
      evLog.prepend(li);
    }
    if (body.classList.contains('notes-on')) {
      toastEl.textContent = 'GA4 event → ' + name; toastEl.classList.add('show');
      clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
    }
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-track]');
    if (t) track(t.getAttribute('data-track'), t.dataset.clinician ? { clinician: t.dataset.clinician } : null);
  });

  /* ---------- Smooth scroll ---------- */
  var lenis = null;
  if (hasGsap && window.Lenis) {
    try {
      lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } catch (e) { lenis = null; }
  }
  var HDR = function () { return (window.innerWidth <= 900 ? 64 : 64) + 40 + 12; };
  function scrollToEl(el, extra) {
    if (!el) return;
    var off = -(HDR() + (extra || 0));
    if (lenis) lenis.scrollTo(el, { offset: off, duration: 1.3 });
    else window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY + off), behavior: reduced ? 'auto' : 'smooth' });
  }
  var locks = 0;
  function lock(on) {
    locks = Math.max(0, locks + (on ? 1 : -1));
    var l = locks > 0;
    body.classList.toggle('locked', l);
    if (lenis) { if (l) lenis.stop(); else lenis.start(); }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var el = document.getElementById(id.slice(1)); if (!el) return;
    e.preventDefault(); closeNav();
    if (id === '#top') { if (lenis) lenis.scrollTo(0, { duration: 1.4 }); else window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    scrollToEl(el);
  });

  /* ---------- Header, mobile nav, sticky bar ---------- */
  var hdr = $('#hdr'), mbar = $('#mbar'), burger = $('#burger'), mnav = $('#mnav');
  var hero = $('.hero'), final = $('.final');
  var navLinks = $$('.nav a'), sections = navLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  function onScroll() {
    var y = window.scrollY;
    hdr.classList.toggle('is-solid', y > 24 || mnav.classList.contains('open'));
    var hb = $('#heroNext').getBoundingClientRect(), fr = final.getBoundingClientRect();
    var heroBtnVisible = hb.top < window.innerHeight - 80 && hb.bottom > 110;
    var show = !heroBtnVisible && fr.top > window.innerHeight * .55;
    mbar.classList.toggle('show', show);
    var mid = window.innerHeight * .35, act = -1;
    sections.forEach(function (s, i) { if (s) { var r = s.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) act = i; } });
    navLinks.forEach(function (a, i) { a.classList.toggle('is-active', i === act); });
  }
  window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); onScroll(); setTimeout(onScroll, 2600);
  function closeNav() {
    if (!mnav.classList.contains('open')) return;
    mnav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu');
    lock(false); onScroll();
  }
  burger.addEventListener('click', function () {
    if (mnav.classList.contains('open')) return closeNav();
    mnav.classList.add('open'); burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Close menu');
    hdr.classList.add('is-solid'); lock(true); track('mobile_menu_open');
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 1100) closeNav(); });

  /* ---------- Word splitting ---------- */
  function splitWords(el, mode) {
    var words = [];
    function make(word, em) {
      if (mode === 'fade') {
        var s = document.createElement('span'); s.className = 'w'; s.textContent = word; words.push(s);
        if (em) { var e = document.createElement('em'); e.appendChild(s); return e; }
        return s;
      }
      var o = document.createElement('span'); o.className = 'sw';
      var i = document.createElement('span');
      if (em) { var e2 = document.createElement('em'); e2.textContent = word; i.appendChild(e2); } else i.textContent = word;
      o.appendChild(i); words.push(i); return o;
    }
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    var frag = document.createDocumentFragment();
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      var em = n.nodeType === 1 && n.tagName === 'EM';
      if (n.nodeType === 3 || em) {
        n.textContent.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(' ')); else frag.appendChild(make(p, em));
        });
      } else frag.appendChild(n);
    });
    el.innerHTML = ''; el.appendChild(frag);
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', label);
    $$('.sw, .w', el).forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });
    return words;
  }

  /* ---------- Intro + hero ---------- */
  var intro = $('#intro');
  var firstVisit = !root.classList.contains('seen');
  try { sessionStorage.setItem('tpa_seen', '1'); } catch (e) {}

  function heroIn(tl) {
    var lines = $$('#heroH1 .ln').map(function (ln) { var s = document.createElement('span'); while (ln.firstChild) s.appendChild(ln.firstChild); ln.appendChild(s); return s; });
    gsap.set(lines, { yPercent: 108 });
    gsap.set('[data-h]', { y: 24, autoAlpha: 0 });
    gsap.set('.hero__arch', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 22px 22px)' });
    gsap.set('.hero__arch img', { scale: 1.3 });
    gsap.set(['.badge-spin', '.founder'], { autoAlpha: 0, scale: .6 });
    gsap.set('.hdr__in', { y: -24, autoAlpha: 0 });
    tl.to('.hdr__in', { y: 0, autoAlpha: 1, duration: .9, ease: 'power3.out' }, 0)
      .to(lines, { yPercent: 0, duration: 1.25, stagger: .1, ease: 'expo.out' }, .05)
      .to('.hero__arch', { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 22px 22px)', duration: 1.5, ease: 'expo.inOut' }, .1)
      .to('.hero__arch img', { scale: 1, duration: 2.2, ease: 'expo.out' }, .3)
      .to('[data-h]', { y: 0, autoAlpha: 1, duration: 1, stagger: .07, ease: 'power3.out' }, .45)
      .to(['.badge-spin', '.founder'], { autoAlpha: 1, scale: 1, duration: .9, stagger: .12, ease: 'back.out(1.7)' }, 1.05)
      .from('#heroChips .chip', { y: 14, autoAlpha: 0, duration: .6, stagger: .04, ease: 'power3.out' }, .8);
  }

  if (!hasGsap) {
    if (intro) intro.classList.add('done');
  } else {
    var tl = gsap.timeline({ paused: true });
    if (firstVisit && intro) {
      var cnt = $('#introCount'), o = { v: 0 };
      tl.to(o, { v: 100, duration: 1.05, ease: 'power2.inOut', onUpdate: function () { cnt.textContent = Math.round(o.v); } })
        .to('.intro__mid', { autoAlpha: 0, y: -16, duration: .35, ease: 'power2.in' })
        .to('.intro__panel--a', { yPercent: -101, duration: 1, ease: 'expo.inOut' }, '>-.05')
        .to('.intro__panel--b', { yPercent: 101, duration: 1, ease: 'expo.inOut', onComplete: function () { intro.classList.add('done'); } }, '<');
      var h = gsap.timeline(); heroIn(h); tl.add(h, '-=.75');
    } else { if (intro) intro.classList.add('done'); heroIn(tl); }
    tl.play();
    setTimeout(function () { if (intro) intro.classList.add('done'); if (tl.progress() < 1) tl.progress(1); }, 6000);
  }

  /* ---------- Scroll animations ---------- */
  if (hasGsap) {
    // headings: words rise
    $$('[data-split]').forEach(function (el) {
      var w = splitWords(el);
      gsap.set(w, { yPercent: 110 });
      ST.create({ trigger: el, start: 'top 90%', once: true, onEnter: function () { gsap.to(w, { yPercent: 0, duration: 1.15, stagger: .05, ease: 'expo.out' }); } });
    });
    // generic reveal (batch; fires even if user jumps past)
    gsap.set('[data-r]', { y: 34, autoAlpha: 0 });
    var reveal = function (els) { gsap.to(els, { y: 0, autoAlpha: 1, duration: 1, stagger: .08, ease: 'power3.out', overwrite: true }); };
    ST.batch('[data-r]', { start: 'top 92%', once: true, onEnter: reveal, onEnterBack: reveal });
    // safety net: once scrolling settles, reveal anything in view that is still hidden (e.g. after jumps)
    var sweep = function () {
      var vh = window.innerHeight, late = [];
      $$('[data-r], .rows li, .trust__logos li').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * .98 && r.bottom > 0 && parseFloat(getComputedStyle(el).opacity) < .05 && !gsap.isTweening(el)) late.push(el);
      });
      if (late.length) gsap.to(late, { y: 0, autoAlpha: 1, duration: .8, stagger: .05, ease: 'power3.out', overwrite: true });
      $$('[data-split]').forEach(function (h) {
        var r = h.getBoundingClientRect(); if (r.top > vh || r.bottom < 0) return;
        var w = $$('.sw > span', h).filter(function (x) { return !gsap.isTweening(x) && Math.abs(gsap.getProperty(x, 'yPercent')) > 50; });
        if (w.length) gsap.to(w, { yPercent: 0, duration: 1, stagger: .04, ease: 'expo.out' });
      });
    };
    var sweepT; window.addEventListener('scroll', function () { clearTimeout(sweepT); sweepT = setTimeout(sweep, 450); }, { passive: true });
    setTimeout(sweep, 3000);

    // rows
    gsap.from('.rows li', { y: 40, autoAlpha: 0, duration: .9, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: '.rows', start: 'top 88%', once: true } });
    gsap.from('.trust__logos li', { y: 20, autoAlpha: 0, duration: .8, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.trust', start: 'top 92%', once: true } });

    // manifesto: words light up
    var mw = splitWords($('#maniTxt'), 'fade');
    gsap.to(mw, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '#maniTxt', start: 'top 80%', end: 'bottom 45%', scrub: .5 } });
    gsap.from('.pimg', { scale: 0, duration: .9, ease: 'back.out(1.6)', stagger: .2, scrollTrigger: { trigger: '#maniTxt', start: 'top 75%', once: true } });

    var mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', function () {
      // expanding room
      var rt = gsap.timeline({ scrollTrigger: { trigger: '#room', start: 'top top', end: 'bottom bottom', scrub: .6 } });
      rt.fromTo('#roomFrame', { clipPath: 'inset(12% 30% 12% 30% round 999px 999px 24px 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'none', duration: 1 })
        .fromTo('#roomImg', { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1 }, 0)
        .to('#roomCap', { opacity: 1, duration: .25 }, .7);
      // hero arch parallax
      gsap.to('.hero__arch img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      // stacking cards recede
      var cards = $$('.scard');
      cards.forEach(function (c, i) {
        if (i === cards.length - 1) return;
        gsap.to(c, { scale: .94, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top 85%', end: 'top 30%', scrub: true } });
      });
      // Heather
      gsap.fromTo('#leadArch', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 22px 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 22px 22px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.lead', start: 'top 80%', once: true } });
      gsap.fromTo('#heatherImg', { yPercent: 6 }, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: '.lead', start: 'top bottom', end: 'bottom top', scrub: true } });
      return function () { gsap.set(['#roomFrame', '#roomImg', '#roomCap', '.scard', '#leadArch', '#heatherImg'], { clearProps: 'all' }); };
    });
    mm.add('(max-width: 900px)', function () { root.classList.add('no-room'); return function () { root.classList.remove('no-room'); }; });

    gsap.from('.final__icon', { rotate: -120, scale: 0, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.final', start: 'top 75%', once: true } });
    gsap.from('.ftr__logo', { yPercent: 40, autoAlpha: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.ftr__mark', start: 'top 95%', once: true } });

    // magnetic buttons
    if (fine) $$('[data-magnetic]').forEach(function (b) {
      var xT = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' }), yT = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
      b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); xT((e.clientX - r.left - r.width / 2) * .22); yT((e.clientY - r.top - r.height / 2) * .32); });
      b.addEventListener('mouseleave', function () { xT(0); yT(0); });
    });

    var refresh = function () { ST.refresh(); };
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    $$('img[loading="lazy"]').forEach(function (im) { if (!im.complete) im.addEventListener('load', function () { clearTimeout(refresh.t); refresh.t = setTimeout(refresh, 200); }, { once: true }); });
  } else {
    root.classList.add('no-room');
  }

  /* ---------- Cursor + list image preview (desktop) ---------- */
  if (fine && hasGsap) {
    var curEl = $('#cursor'), curL = $('#cursorLabel'), pv = $('#preview'), pvIn = $('#previewIn');
    var cx = gsap.quickTo(curEl, 'x', { duration: .25, ease: 'power3' }), cy = gsap.quickTo(curEl, 'y', { duration: .25, ease: 'power3' });
    var px = gsap.quickTo(pv, 'x', { duration: .7, ease: 'power3' }), py = gsap.quickTo(pv, 'y', { duration: .7, ease: 'power3' });
    window.addEventListener('mousemove', function (e) {
      curEl.classList.add('on'); cx(e.clientX); cy(e.clientY);
      px(e.clientX + 70); py(e.clientY - 150);
    }, { passive: true });
    document.addEventListener('mouseleave', function () { curEl.classList.remove('on'); });
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor]');
      curEl.classList.toggle('big', !!t); curL.textContent = t ? t.getAttribute('data-cursor') : '';
      curEl.classList.toggle('hide', !t && !!e.target.closest('a,button,input,select,textarea,label,.notes,.match,.modal'));
    });
    var pvShown = false, pvSrc = '';
    $$('.row[data-img]').forEach(function (r) {
      r.addEventListener('mouseenter', function () {
        var src = r.getAttribute('data-img');
        if (src !== pvSrc) {
          pvSrc = src;
          var im = new Image(); im.src = src; im.alt = ''; pvIn.appendChild(im);
          gsap.fromTo(im, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: .6, ease: 'expo.out' });
          var olds = pvIn.querySelectorAll('img'); if (olds.length > 3) olds[0].remove();
        }
        if (!pvShown) { pvShown = true; gsap.to(pv, { opacity: 1, scale: 1, rotate: -4, duration: .5, ease: 'power3.out' }); }
      });
    });
    $('#rows').addEventListener('mouseleave', function () { pvShown = false; gsap.to(pv, { opacity: 0, scale: .6, rotate: 0, duration: .4, ease: 'power3.in' }); });
  }

  /* ---------- First session story (desktop sticky image) ---------- */
  var sSteps = $$('.sstep'), sImgs = $$('.story__arch img'), sDots = $$('.story__dots i');
  if ('IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = +e.target.dataset.s;
        sSteps.forEach(function (s) { s.classList.toggle('is-on', s === e.target); });
        sImgs.forEach(function (im) { im.classList.toggle('on', +im.dataset.s === i); });
        sDots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sSteps.forEach(function (s) { sio.observe(s); });
  }

  /* ---------- Accordions (FAQ + therapies) ---------- */
  $$('.acc').forEach(function (acc) {
    $$('.acc__q', acc).forEach(function (q) {
      q.addEventListener('click', function () {
        var it = q.parentNode, open = !it.classList.contains('is-open');
        $$('.acc__item', acc).forEach(function (x) { x.classList.remove('is-open'); x.querySelector('.acc__q').setAttribute('aria-expanded', 'false'); });
        if (open) { it.classList.add('is-open'); q.setAttribute('aria-expanded', 'true'); track(acc.id === 'therapies' ? 'therapy_open' : 'faq_open', { q: q.textContent.replace(/^\d+/, '').trim() }); }
        if (hasGsap) { clearTimeout(acc.t); acc.t = setTimeout(function () { ST.refresh(); }, 650); }
      });
    });
  });

  /* ---------- Hero quick-start chips ---------- */
  var heroSel = [];
  $$('#heroChips .chip').forEach(function (c) {
    c.setAttribute('aria-pressed', 'false');
    c.addEventListener('click', function () {
      var v = c.dataset.concern, i = heroSel.indexOf(v);
      if (i > -1) heroSel.splice(i, 1); else heroSel.push(v);
      var on = i < 0; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on);
      if (on && heroSel.length === 1) track('match_hero_chip', { concern: v });
    });
  });
  $('#heroNext').addEventListener('click', function () { openMatch({ concerns: heroSel.slice(), step: heroSel.length ? 2 : 1, source: 'hero' }); });

  /* ---------- Matcher ---------- */
  var CLIN = [
    { id: 'heather', name: 'Dr Heather Gan', role: 'Clinical Psychologist · Founder', img: 'images/dr-heather-gan.webp', price: '$161.95',
      concerns: ['anxiety', 'emotions', 'identity', 'relationships', 'trauma'], times: ['day', 'afterhours'], mandarin: true, culture: true },
    { id: 'team', name: 'Next available psychologist', role: 'Registrar / Registered Psychologist', ini: '+', price: '$148.45',
      concerns: ['anxiety', 'mood', 'burnout', 'relationships', 'unsure'], times: ['day', 'afterhours'], lower: true, soonest: true }
  ];
  var LABEL = { anxiety: 'anxiety', mood: 'low mood', emotions: 'intense emotions', trauma: 'trauma', relationships: 'relationships', identity: 'cultural identity', burnout: 'burnout', unsure: 'working out what\'s going on' };
  var match = $('#match'), form = $('#mForm'), steps = $$('.mstep', form);
  var bar = $('#mBar'), count = $('#mCount'), back = $('#mBack'), next = $('#mNext'), nextT = $('#mNextT');
  var state, cur = 1, lastFocus, started = false, requested = null;
  function reset() { state = { concern: [], mode: [], time: [], mhcp: [], priority: [], pick: null }; }
  reset();
  try { var saved = JSON.parse(localStorage.getItem('tpa_match') || 'null'); if (saved && Array.isArray(saved.concern)) state = Object.assign(state, saved); } catch (e) {}
  function save() { try { localStorage.setItem('tpa_match', JSON.stringify(state)); } catch (e) {} }
  function syncChips() {
    $$('[data-group]', form).forEach(function (g) {
      var key = g.dataset.group;
      $$('[data-v]', g).forEach(function (b) { var on = state[key].indexOf(b.dataset.v) > -1; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
    });
  }
  $$('[data-group]', form).forEach(function (g) {
    var key = g.dataset.group, multi = key === 'concern' || g.hasAttribute('data-multi');
    g.addEventListener('click', function (e) {
      var b = e.target.closest('[data-v]'); if (!b) return;
      var v = b.dataset.v, arr = state[key], i = arr.indexOf(v);
      if (multi) { if (i > -1) arr.splice(i, 1); else arr.push(v); } else state[key] = i > -1 ? [] : [v];
      syncChips(); save();
    });
  });
  function score(c) {
    var s = 0, why = [];
    var hits = state.concern.filter(function (k) { return c.concerns.indexOf(k) > -1; });
    s += hits.length * 3; if (hits.length) why.push('Works with ' + hits.slice(0, 2).map(function (k) { return LABEL[k]; }).join(' & '));
    if (state.time.indexOf('afterhours') > -1 && c.times.indexOf('afterhours') > -1) why.push('After-5pm sessions');
    if (state.priority.indexOf('lower') > -1 && c.lower) { s += 4; why.unshift('Lower fee'); }
    if (state.priority.indexOf('soonest') > -1 && c.soonest) { s += 3; why.unshift('Shortest wait'); }
    if (state.priority.indexOf('mandarin') > -1) { if (c.mandarin) { s += 6; why.unshift('Speaks Mandarin'); } else s -= 2; }
    if (state.priority.indexOf('culture') > -1 && c.culture) { s += 3; why.unshift('Culturally informed'); }
    if (c.id === 'heather') s += .5;
    return { c: c, s: s, why: why };
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function renderResult(keep) {
    var ranked = CLIN.map(score).sort(function (a, b) { return b.s - a.s; });
    if (!keep || !state.pick) state.pick = ranked[0].c.id;
    $('#mResult').innerHTML = ranked.map(function (r, i) {
      var c = r.c;
      return '<button type="button" class="rcard' + (state.pick === c.id ? ' is-on' : '') + '" data-pick="' + c.id + '" aria-pressed="' + (state.pick === c.id) + '">' +
        '<span class="rcard__av">' + (c.img ? '<img src="' + c.img + '" alt="">' : c.ini) + '</span>' +
        '<span class="rcard__b"><h4>' + esc(c.name) + '</h4><p>' + esc(c.role) + ' · ' + c.price + ' after Medicare</p>' +
        (r.why.length ? '<span class="rcard__why">✓ ' + esc(r.why.slice(0, 2).join(' · ')) + '</span>' : '') + '</span>' +
        (i === 0 ? '<span class="rcard__badge">Best match</span>' : '') + '</button>';
    }).join('') + '<button type="button" class="rcard' + (state.pick === 'any' ? ' is-on' : '') + '" data-pick="any" aria-pressed="' + (state.pick === 'any') + '"><span class="rcard__av">?</span><span class="rcard__b"><h4>No preference</h4><p>Our intake team will match you on the call</p></span></button>';
  }
  $('#mResult').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pick]'); if (!b) return;
    state.pick = b.dataset.pick; save();
    $$('.rcard', $('#mResult')).forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
    track('match_select_clinician', { clinician: state.pick });
  });
  function show(n) {
    cur = n;
    steps.forEach(function (s) { var on = +s.dataset.step === n; s.hidden = !on; if (on) { s.classList.remove('anim'); void s.offsetWidth; s.classList.add('anim'); } });
    bar.style.width = (n >= 5 ? 100 : n / 4 * 100) + '%';
    count.textContent = n === 5 ? 'All done' : 'Step ' + n + ' of 4';
    back.style.visibility = n > 1 && n < 5 ? 'visible' : 'hidden';
    setBtnText(nextT, n === 4 ? 'Request my intake call' : n === 5 ? 'Close' : 'Continue');
    if (n === 4) { if (requested) state.pick = requested; renderResult(!!requested); }
    $('#mErr').hidden = true;
    var h = steps[n - 1].querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    $('.match__panel').scrollTop = 0;
    track('match_step_view', { step: n });
  }
  function openMatch(opts) {
    opts = opts || {};
    closeNav();
    if (opts.concerns && opts.concerns.length) state.concern = opts.concerns.slice();
    requested = opts.clinician ? ({ 'Dr Heather Gan': 'heather', 'Registrar': 'team' }[opts.clinician] || null) : null;
    syncChips();
    lastFocus = document.activeElement;
    if (match.hidden) { match.hidden = false; lock(true); }
    if (!started) { started = true; track('match_start', { source: opts.source || 'cta' }); }
    show(opts.step || 1);
  }
  function closeMatch() {
    if (match.hidden) return;
    match.hidden = true; lock(false);
    if (cur < 5) track('match_abandon', { step: cur });
    if (cur === 5) { reset(); form.reset(); try { localStorage.removeItem('tpa_match'); } catch (e) {} started = false; }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  window.openMatch = openMatch;
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open-match]'); if (!t) return;
    e.preventDefault();
    var v = t.getAttribute('data-open-match');
    openMatch({ concerns: v ? [v] : null, step: v ? 2 : 1, clinician: t.dataset.clinician, source: t.dataset.track || (v ? 'concern_' + v : 'cta') });
  });
  $$('[data-close]', match).forEach(function (b) { b.addEventListener('click', closeMatch); });
  back.addEventListener('click', function () { if (cur > 1) show(cur - 1); });
  next.addEventListener('click', function () {
    if (cur === 1 && !state.concern.length) { state.concern = ['unsure']; syncChips(); }
    if (cur < 4) { track('match_step_complete', { step: cur }); show(cur + 1); return; }
    if (cur === 4) {
      var f = form.elements, ok = true;
      var noName = !f.name.value.trim(); f.name.classList.toggle('is-err', noName); if (noName) ok = false;
      var hasContact = f.phone.value.replace(/\D/g, '').length >= 8 || /^\S+@\S+\.\S+$/.test(f.email.value.trim());
      f.phone.classList.toggle('is-err', !hasContact); f.email.classList.toggle('is-err', !hasContact); if (!hasContact) ok = false;
      $('.consent').classList.toggle('is-err', !f.consent.checked); if (!f.consent.checked) ok = false;
      if (!ok) { $('#mErr').hidden = false; track('match_form_error'); var firstBad = $('.is-err', form); if (firstBad && firstBad.focus) firstBad.focus(); return; }
      $('#dName').textContent = f.name.value.trim().split(' ')[0];
      track('generate_lead', { form: 'guided_intake', clinician: state.pick, concerns: state.concern.join(','), mode: state.mode[0] || 'any' });
      /* Production: POST to a Squarespace form block / Halaxy enquiry via Zapier webhook */
      show(5); return;
    }
    closeMatch();
  });
  $('#crisisBtn').addEventListener('click', function () { $('#crisisBox').hidden = false; track('crisis_info_view'); });

  var mhcpModal = $('#mhcpModal');
  function closeMhcp() { if (mhcpModal.hidden) return; mhcpModal.hidden = true; lock(false); }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-modal="mhcp"]');
    if (t && mhcpModal.hidden) { mhcpModal.hidden = false; lock(true); track('mhcp_explainer_open'); mhcpModal.querySelector('.xbtn').focus(); }
    if (e.target.closest('[data-close-modal]')) closeMhcp();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!mhcpModal.hidden) return closeMhcp();
      if (!match.hidden) return closeMatch();
      if (mnav.classList.contains('open')) return closeNav();
      if (!$('#notes').hidden) toggleNotes(false);
    }
    if (e.key === 'Tab') {
      var trap = !mhcpModal.hidden ? $('.modal__panel') : !match.hidden ? $('.match__panel') : null;
      if (!trap) return;
      var f = $$('button:not([disabled]), input, select, textarea, a[href]', trap).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- Fee calculator (no counting: exact figures only) ---------- */
  var FEES = { clinical: { std: 311, ah: 326, reb: 149.05 }, registrar: { std: 250, ah: 265, reb: 101.55 } };
  function calc(anim) {
    var tier = $('input[name=tier]:checked').value, time = $('input[name=time]:checked').value, m = $('#mhcp').checked;
    var fee = FEES[tier][time], reb = m ? FEES[tier].reb : 0;
    $('#cFee').textContent = '$' + fee.toFixed(2);
    $('#cReb').textContent = reb ? '−$' + reb.toFixed(2) : '$0.00';
    var n = $('#cNet'); n.textContent = '$' + (fee - reb).toFixed(2);
    if (anim) { n.classList.remove('tick'); void n.offsetWidth; n.classList.add('tick'); }
  }
  $$('.calc input').forEach(function (i) { i.addEventListener('change', function () { calc(true); track('fee_calc_change', { tier: $('input[name=tier]:checked').value, time: $('input[name=time]:checked').value, mhcp: $('#mhcp').checked }); }); });
  calc(false);

  /* ---------- Open now (Sydney time) ---------- */
  (function () {
    var el = $('#openNow'); if (!el) return;
    try {
      var parts = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      var g = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
      var day = g('weekday'), mins = (+g('hour') % 24) * 60 + +g('minute');
      if (['Mon', 'Thu', 'Fri'].indexOf(day) > -1 && mins >= 660 && mins < 1110) { el.textContent = 'Open now · until 6:30pm'; el.style.setProperty('--c', '#8fd07c'); }
      else el.textContent = 'Closed now · enquire online any time';
    } catch (e) {}
  })();

  /* ---------- Lead magnet ---------- */
  $('#guideForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var i = $('#gEmail'), msg = $('#guideMsg'), ok = /^\S+@\S+\.\S+$/.test(i.value.trim());
    msg.classList.remove('ok', 'err');
    if (!ok) { msg.textContent = 'Please enter a valid email address.'; msg.classList.add('err'); i.focus(); return; }
    i.value = ''; msg.textContent = 'Thank you. Your guide is on its way.'; msg.classList.add('ok');
    track('generate_lead', { form: 'guide_download' });
  });

  /* ---------- Scroll depth ---------- */
  var depths = [25, 50, 75, 90], hit = {};
  window.addEventListener('scroll', function () {
    var p = (window.scrollY + innerHeight) / root.scrollHeight * 100;
    depths.forEach(function (d) { if (p >= d && !hit[d]) { hit[d] = 1; track('scroll_depth', { percent: d }); } });
  }, { passive: true });

  /* ================= CRO NOTES (concept chrome) ================= */
  var NOTES = {
    1: ['Header: 5 links, one action, always visible',
      'Visitors in distress scan, they don\'t browse. The menu goes from about 17 links to the 5 questions people actually have. The header stays on screen the whole time (it never hides), so "Find my psychologist" and the phone number are always one tap away.',
      'Current site: long Therapies drop-down, a leftover shopping-cart icon, and six different labels for the same booking button.',
      'KPI: header CTA click-through, phone clicks'],
    2: ['Hero: your H1, a face, and step 1 starts here',
      'Your "Clinical psychology in Sydney CBD" heading stays (protects SEO), finished with your own idea of "the right fit". The first question of the matcher sits right in the hero, so starting takes one tap. Heather\'s face (trust), the rebate, "no referral needed", telehealth and Mandarin answer the top objections before any scrolling.',
      'Current hero: one "Book an appointment" button leading to a blank form, with no idea what happens next.',
      'KPI: hero chip interaction rate, match_start'],
    3: ['Trust logos, AHPRA-compliant',
      'Testimonials aren\'t allowed, so trust comes from verifiable facts: your real Ahpra, Medicare, ACPA, Pacifica Congress and FRWN logos, directly under the hero where people make the "is this legitimate?" judgement.',
      'These logos currently sit only in the footer and the About page.',
      'KPI: bounce rate, scroll past hero'],
    4: ['Your story, then your room',
      'Your own About copy, cut to the part that matters to a new client. The words light up as you scroll, so people actually read it. Then your banner photo opens up from your logo\'s arch shape to full screen: it shows the calm space they\'ll walk into, which makes the first visit feel less unknown.',
      'Current: two paragraphs of small text, and the banner only appears behind the hero heading.',
      'KPI: scroll depth, time on page'],
    5: ['Start with feelings, not therapy names',
      'People search for "anxiety" or "I don\'t feel like myself", not "Schema Therapy". Every row opens the matcher with that concern already filled in (one step skipped). "Something harder to name" catches unsure visitors, and the scope note filters out poor fits early, which saves your intake team time.',
      'Current homepage leads with CBT / DBT / Schema cards: clinician language.',
      'KPI: concern clicks → match_start'],
    6: ['How it works: removes fear of the unknown',
      'Your enquiry → intake call → booking process is not a weakness once it\'s explained. Framing the intake call as the step that gets you the right match turns friction into reassurance. The cards stack as you scroll, so each step gets full attention.',
      'The current site never explains what happens after you click "Book".',
      'KPI: CTA clicks from this section'],
    7: ['Team: Heather leads, the group practice is visible',
      'Heather\'s real photo, quote, focus areas, fee after Medicare and registration number sit together, so a visitor can decide without opening another page. Emilie and Ana are shown accurately as clinical supervisors, which signals quality. The third card is ready for each new psychologist as the team grows.',
      'Current homepage shows one photo and a name; fees, availability and focus are on other pages.',
      'KPI: clinician CTA clicks'],
    8: ['Interactive fee & rebate calculator',
      'Cost uncertainty is the main silent reason people leave private-practice sites. Showing the out-of-pocket amount ($161.95, not just $311) reframes the price, and the registrar tier offers a lower-cost path instead of losing the visitor. Figures are always exact; nothing counts up.',
      'Fees are currently on a separate page, not the homepage.',
      'KPI: fee_calc_change → match_start rate'],
    9: ['What to expect in session one',
      'First-time clients are anxious about the unknown. Four calm steps (before, arriving, the 50 minutes, after) with the image changing as you read lower the emotional barrier, without any clinical outcome claims.',
      'This information is currently buried in the FAQ page.',
      'KPI: scroll depth, cta_expect clicks'],
    10: ['Therapies, explained in plain language',
      'Kept for informed visitors and for SEO (every link goes to your existing therapy page, so URLs are preserved), but placed after the decision-making content so it doesn\'t delay action.',
      'Current: 8-item drop-down, with some therapy pages filed under the blog.',
      'KPI: therapy_open'],
    11: ['Location & telehealth side by side',
      'Practical details remove last-minute doubts: nearest station, parking, and that telehealth has the same fees and rebates. A live "open now" line shows the practice is active.',
      'Current hours omit Tuesday and Wednesday, which looks ambiguous.',
      'KPI: directions clicks, phone clicks'],
    12: ['FAQ: objection handling before the final ask',
      'Ordered by what stops people booking: referral, wait time, choosing a psychologist, the first session, cancellation. Placed just before the final CTA so the last doubts are resolved at the moment of decision.',
      'Current FAQ page is titled "FAQs for Psychologists" and has a contradictory cancellation policy.',
      'KPI: faq_open → match_start'],
    13: ['Soft conversion for "not ready yet" visitors',
      'Most first-time visitors won\'t enquire on visit one. A free guide captures their email so your marketing team can follow up gently, instead of losing them to Google.',
      'There is currently no option except "book now".',
      'KPI: guide sign-ups, email → enquiry rate'],
    14: ['Your blog, working for bookings',
      'Your four latest articles with their real images and links. They answer pre-booking questions and keep your SEO content on the homepage.',
      'Two of the current homepage cards show the same excerpt.',
      'KPI: article clicks, returning visitors'],
    15: ['Final CTA in your own words',
      '"We are ready when you are" is your line from the team page. One consistent action label through the whole page lowers mental load, and phone is the alternative for people who prefer to talk.',
      'Currently: Book / Make / Schedule / Request an appointment.',
      'KPI: cta_final click rate'],
    16: ['Footer: safety and respect',
      'Crisis lines on every page (duty of care), an Acknowledgement of Country, your registration numbers, and existing-client Halaxy booking kept separate from new enquiries.',
      'Crisis lines are currently only on the booking page.',
      'KPI: n/a (trust & safety)'],
    17: ['Sticky mobile action bar',
      'Most first visits happen on a phone. After the hero, a thumb-reach bar keeps "Call" and "Find my psychologist" one tap away, and hides at the final CTA so it never doubles up.',
      '',
      'KPI: cta_sticky_mobile, mobile conversion rate'],
    18: ['The guided matcher (the core of this redesign)',
      'Four short steps instead of one long form: concerns → attendance & time → preferences → suggested match + contact. It has a progress bar, saved progress, a "help right now" safety exit and a clear "what happens next" screen. Your team starts every intake call already knowing what the person needs. In Squarespace this is built with a form block or embedded form that feeds Halaxy.',
      'Current flow: generic enquiry form → wait → intake call → match.',
      'KPI: match_start → generate_lead rate, step drop-off']
  };
  var notesOn = false, pinsLayer = null, pop = $('#pop'), notesEl = $('#notes'), list = $('#notesList'), toggleBtn = $('#notesToggle');
  list.innerHTML = Object.keys(NOTES).map(function (k) {
    var n = NOTES[k];
    return '<li data-n="' + k + '" tabindex="0"><span class="n">' + k + '</span><h4>' + n[0] + '</h4><p>' + n[1] + '</p>' + (n[2] ? '<p class="fix">Fixes: ' + n[2] + '</p>' : '') + '<span class="kpi">' + n[3] + '</span></li>';
  }).join('');
  function placePins() {
    if (pinsLayer) { pinsLayer.remove(); pinsLayer = null; }
    if (!notesOn) return;
    pinsLayer = document.createElement('div');
    $$('[data-cro]').forEach(function (el) {
      var n = el.getAttribute('data-cro');
      if (el.hidden || getComputedStyle(el).display === 'none') return;
      var r = el.getBoundingClientRect();
      var pin = document.createElement('button');
      pin.className = 'pin'; pin.textContent = n; pin.dataset.n = n; pin.setAttribute('aria-label', 'CRO note ' + n + ': ' + NOTES[n][0]);
      if (el.id === 'mbar') { pin.style.position = 'fixed'; pin.style.bottom = '84px'; pin.style.right = '18px'; }
      else if (el.id === 'hdr') { pin.style.position = 'fixed'; pin.style.top = 'calc(var(--bar) + 4px)'; pin.style.left = '50%'; pin.style.zIndex = 55; }
      else {
        var top = r.top + window.scrollY + (el.classList.contains('hero') ? HDR() + 20 : 20);
        pin.style.top = top + 'px';
        pin.style.left = Math.min(Math.max(r.left, 0) + 14, root.clientWidth - 48) + 'px';
      }
      pinsLayer.appendChild(pin);
    });
    body.appendChild(pinsLayer);
  }
  function toggleNotes(on) {
    notesOn = on;
    body.classList.toggle('notes-on', on);
    toggleBtn.setAttribute('aria-pressed', on);
    var wide = window.innerWidth > 1300;
    notesEl.hidden = !(on && wide);
    body.classList.toggle('notes-docked', on && wide);
    pop.hidden = true;
    if (hasGsap) ST.refresh();
    placePins();
    if (on) track('cro_notes_open');
  }
  window.toggleNotes = toggleNotes;
  toggleBtn.addEventListener('click', function () {
    if (notesOn && notesEl.hidden) { notesEl.hidden = false; return; }
    toggleNotes(!notesOn);
    if (notesOn && window.innerWidth <= 1300) notesEl.hidden = false;
  });
  $('#notesClose').addEventListener('click', function () { toggleNotes(false); });
  window.addEventListener('resize', function () { clearTimeout(placePins.t); placePins.t = setTimeout(placePins, 250); });
  if (hasGsap) ST.addEventListener('refresh', function () { clearTimeout(placePins.t); placePins.t = setTimeout(placePins, 60); });
  function goTo(n) {
    if (n === '18') { openMatch({ source: 'cro_note' }); return; }
    if (n === '1' || n === '2') { if (lenis) lenis.scrollTo(0, { duration: 1.2 }); else window.scrollTo(0, 0); return; }
    if (n === '17') return;
    scrollToEl($('[data-cro="' + n + '"]'), -20);
  }
  function openNote(li) { if (window.innerWidth <= 1300) notesEl.hidden = true; goTo(li.dataset.n); }
  document.addEventListener('click', function (e) {
    var pin = e.target.closest('.pin');
    if (pin) {
      e.stopPropagation();
      var n = NOTES[pin.dataset.n];
      $$('li', list).forEach(function (li) { li.classList.toggle('is-hl', li.dataset.n === pin.dataset.n); });
      var hl = list.querySelector('.is-hl'); if (!notesEl.hidden && hl) notesEl.scrollTo({ top: hl.offsetTop - 90, behavior: 'smooth' });
      pop.innerHTML = '<h4>' + pin.dataset.n + '. ' + n[0] + '</h4><p>' + n[1] + '</p><span class="kpi">' + n[3] + '</span>';
      pop.hidden = false;
      var r = pin.getBoundingClientRect(), pw = Math.min(320, window.innerWidth - 32);
      var x = Math.max(16, Math.min(r.left, window.innerWidth - pw - 16 - (notesEl.hidden ? 0 : 420)));
      var y = r.bottom + 10; if (y + 260 > window.innerHeight) y = Math.max(56, r.top - 270);
      pop.style.left = x + 'px'; pop.style.top = y + 'px';
      return;
    }
    if (!e.target.closest('.pop')) pop.hidden = true;
    var li = e.target.closest('#notesList li'); if (li) openNote(li);
  });
  list.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var li = e.target.closest('li'); if (li) openNote(li); } });
  window.addEventListener('scroll', function () { pop.hidden = true; }, { passive: true });
  if (/[?&]notes=1/.test(location.search)) setTimeout(function () { toggleNotes(true); if (window.innerWidth <= 1300) notesEl.hidden = false; }, firstVisit ? 2600 : 1200);
})();
