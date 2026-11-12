/* The Psychology Alley · homepage concept v2 */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduced;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  if (hasGsap) gsap.registerPlugin(ST);

  /* ---------- Tracking (GA4 / GTM dataLayer) ---------- */
  window.dataLayer = window.dataLayer || [];
  var evLog = $('#evLog'), toastEl = $('#toast'), toastT;
  function track(name, params) {
    var ev = Object.assign({ event: name }, params || {});
    window.dataLayer.push(ev);
    if (evLog) {
      var first = evLog.querySelector('.muted'); if (first) first.remove();
      var li = document.createElement('li');
      li.textContent = new Date().toLocaleTimeString('en-AU', { hour12: false }) + '  ' + name + (params ? ' ' + JSON.stringify(params) : '');
      evLog.prepend(li);
    }
    if (document.body.classList.contains('notes-on')) {
      toastEl.textContent = 'GA4 event → ' + name;
      toastEl.classList.add('show');
      clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
    }
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-track]');
    if (t) track(t.getAttribute('data-track'), t.dataset.clinician ? { clinician: t.dataset.clinician } : null);
  });

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (hasGsap && window.Lenis) {
    try {
      lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } catch (e) { lenis = null; }
  }
  function scrollToEl(el, offset) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: offset == null ? -96 : offset, duration: 1.2 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (offset == null ? -96 : offset), behavior: reduced ? 'auto' : 'smooth' });
  }
  var locks = 0;
  function lock(on) {
    locks = Math.max(0, locks + (on ? 1 : -1));
    var l = locks > 0;
    root.style.overflow = l ? 'hidden' : '';
    if (lenis) { if (l) lenis.stop(); else lenis.start(); }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var el = $(id); if (!el) return;
    e.preventDefault(); closeNav(); scrollToEl(el, id === '#top' ? -200 : -90);
  });

  /* ---------- Header, mobile nav, sticky bar, progress ---------- */
  var hdr = $('#hdr'), mbar = $('#mbar'), burger = $('#burger'), mnav = $('#mnav'), prog = $('#progress');
  var hero = $('.hero'), final = $('.final'), lastY = 0;
  mnav.removeAttribute('hidden');
  function onScroll() {
    var y = window.scrollY;
    hdr.classList.toggle('is-scrolled', y > 40);
    var navOpen = mnav.classList.contains('open');
    if (!navOpen) hdr.classList.toggle('is-hidden', y > 500 && y > lastY + 2 ? true : (y < lastY - 2 ? false : hdr.classList.contains('is-hidden')));
    lastY = y;
    var heroBottom = hero.offsetTop + hero.offsetHeight - 200;
    var finalTop = final.getBoundingClientRect().top;
    mbar.classList.toggle('show', y > heroBottom && finalTop > window.innerHeight * .6);
    var max = root.scrollHeight - window.innerHeight;
    if (prog) prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  function closeNav() {
    if (!mnav.classList.contains('open')) return;
    mnav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); lock(false);
  }
  burger.addEventListener('click', function () {
    if (mnav.classList.contains('open')) return closeNav();
    mnav.classList.add('open'); burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Close menu');
    hdr.classList.remove('is-hidden'); lock(true); track('mobile_menu_open');
  });

  /* ---------- Text splitting ---------- */
  function splitWords(el, cls) {
    var out = [];
    function wrap(word, em) {
      var o = document.createElement('span'); o.className = cls === 'w' ? 'w' : 'sw';
      if (cls === 'w') { o.textContent = word; if (em) { var e1 = document.createElement('em'); e1.appendChild(o); out.push(o); return e1; } out.push(o); return o; }
      var i = document.createElement('span');
      if (em) { var e2 = document.createElement('em'); e2.textContent = word; i.appendChild(e2); } else i.textContent = word;
      o.appendChild(i); out.push(i); return o;
    }
    var frag = document.createDocumentFragment();
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      var em = n.nodeType === 1 && n.tagName === 'EM';
      if (n.nodeType === 3 || em) {
        n.textContent.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(' ')); else frag.appendChild(wrap(p, em));
        });
      } else frag.appendChild(n);
    });
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    el.innerHTML = ''; el.appendChild(frag);
    return out;
  }

  /* ---------- Animations ---------- */
  function finishLoad() { root.classList.add('loaded'); }
  if (!hasGsap) { finishLoad(); }
  else {
    // hero intro
    var h1Words = splitWords($('.hero__h1'));
    gsap.set(h1Words, { yPercent: 115 });
    gsap.set('[data-hero]', { y: 26, autoAlpha: 0 });
    gsap.set('#quick', { y: 70, autoAlpha: 0, rotate: 2 });
    gsap.set('#heroChips .chip', { scale: .7, autoAlpha: 0 });
    gsap.set('.hero__bg img', { scale: 1.22 });
    gsap.set('.hdr__in', { y: -90, autoAlpha: 0 });
    var intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
    intro.to('.loader__bar i', { scaleX: 1, duration: .8, ease: 'power2.inOut' })
      .to('.loader__in', { autoAlpha: 0, y: -20, duration: .35, ease: 'power2.in' })
      .to('#loader', { yPercent: -100, duration: .85, ease: 'power4.inOut', onComplete: finishLoad })
      .to('.hero__bg img', { scale: 1, duration: 2.4, ease: 'power3.out' }, '-=.75')
      .to('.hdr__in', { y: 0, autoAlpha: 1, duration: 1 }, '-=2.1')
      .to(h1Words, { yPercent: 0, duration: 1.15, stagger: .055 }, '-=2.05')
      .to('[data-hero]', { y: 0, autoAlpha: 1, duration: .9, stagger: .09 }, '-=1.45')
      .to('#quick', { y: 0, autoAlpha: 1, rotate: 0, duration: 1.2 }, '-=1.5')
      .to('#heroChips .chip', { scale: 1, autoAlpha: 1, duration: .5, stagger: .045, ease: 'back.out(2)' }, '-=.8');

    // hero parallax
    gsap.to('.hero__bg', { yPercent: 9, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // headings: word reveal
    $$('[data-split]').forEach(function (el) {
      var w = splitWords(el);
      gsap.from(w, { yPercent: 115, duration: 1, stagger: .045, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    // generic fade-up
    ST.batch('[data-anim]', { start: 'top 90%', once: true, onEnter: function (els) { gsap.to(els, { y: 0, autoAlpha: 1, duration: .9, stagger: .09, ease: 'power3.out', overwrite: true }); } });
    gsap.set('[data-anim]', { y: 28, autoAlpha: 0 });

    // grouped staggers
    [['.trust__logos li', '.trust', 24], ['.help__list li', '.help__list', 40], ['.step', '.steps', 60], ['.mate', '.crew__grid', 50],
     ['.visit > *', '.visit', 50], ['.acc__item', '.acc', 30], ['.post', '.posts', 50], ['.tabs button', '.tabs', 20]].forEach(function (g) {
      if (!$(g[1])) return;
      gsap.from(g[0], { y: g[2], autoAlpha: 0, duration: .95, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: g[1], start: 'top 86%', once: true } });
    });
    gsap.from('.calc', { y: 80, autoAlpha: 0, rotate: 3, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.calc', start: 'top 88%', once: true } });
    gsap.from('.tabpanel', { y: 60, autoAlpha: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.appr__grid', start: 'top 82%', once: true } });
    gsap.from('.soft__in', { scale: .94, autoAlpha: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.soft', start: 'top 88%', once: true } });

    // statement: words light up as you scroll
    var sw = splitWords($('#stateTxt'), 'w');
    gsap.to(sw, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '#stateTxt', start: 'top 82%', end: 'bottom 52%', scrub: .6 } });

    // counters
    $$('[data-count]').forEach(function (el) {
      var end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, o = { v: 0 };
      ST.create({ trigger: el, start: 'top 92%', once: true, onEnter: function () {
        gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = o.v.toFixed(dec); } });
      } });
    });

    // marquee with scroll-velocity boost
    var mq = gsap.to('#marquee', { xPercent: -50, repeat: -1, duration: 34, ease: 'none' });
    ST.create({ onUpdate: function (s) {
      var v = Math.min(6, 1 + Math.abs(s.getVelocity()) / 400);
      gsap.to(mq, { timeScale: v * (s.direction < 0 ? -1 : 1), duration: .3, overwrite: true });
      gsap.to(mq, { timeScale: s.direction < 0 ? -1 : 1, duration: 1.2, delay: .3 });
    } });

    // steps line
    gsap.to('#stepsLine', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 78%', end: 'top 30%', scrub: .6 } });

    // Heather: arch reveal, portrait parallax, floating chips
    gsap.fromTo('.lead__arch', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 22px 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 22px 22px)', duration: 1.5, ease: 'power4.inOut', scrollTrigger: { trigger: '.lead', start: 'top 78%', once: true } });
    gsap.fromTo('#heatherImg', { yPercent: 9 }, { yPercent: -3, ease: 'none', scrollTrigger: { trigger: '.lead', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.float', { scale: 0, autoAlpha: 0, duration: .8, stagger: .15, ease: 'back.out(1.8)', delay: .7, scrollTrigger: { trigger: '.lead', start: 'top 70%', once: true } });
    $$('.float').forEach(function (f, i) { gsap.to(f, { y: i % 2 ? 10 : -10, duration: 2.6 + i * .4, yoyo: true, repeat: -1, ease: 'sine.inOut' }); });

    // image parallax
    $$('.visit__img:not(.visit__img--tele) img').forEach(function (im) {
      gsap.fromTo(im, { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: im.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.fromTo('#finalImg', { yPercent: -8, scale: 1.1 }, { yPercent: 8, scale: 1, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.final__icon', { rotate: -180, scale: 0, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.final', start: 'top 70%', once: true } });

    // fees + final: rounded sections scale in
    ['.fees', '.final'].forEach(function (s) {
      gsap.from(s, { scale: .94, borderRadius: 60, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'top 35%', scrub: true } });
    });

    // first session: pinned horizontal scroll (desktop)
    var mm = gsap.matchMedia();
    mm.add('(min-width: 981px)', function () {
      gsap.to('.hero__grid', { yPercent: -6, autoAlpha: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '55% top', end: 'bottom top', scrub: true } });
      var track = $('#expectTrack');
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var tw = gsap.to(track, { x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: '.expect', start: 'top top', end: function () { return '+=' + dist(); }, pin: '.expect__pin', scrub: .8, invalidateOnRefresh: true, anticipatePin: 1 } });
      $$('.xcard__img img', track).forEach(function (im) {
        gsap.fromTo(im, { xPercent: -6, scale: 1.14 }, { xPercent: 6, scale: 1.14, ease: 'none', scrollTrigger: { trigger: im, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
      });
      root.classList.add('h-pin');
      return function () { root.classList.remove('h-pin'); };
    });
    mm.add('(max-width: 980px)', function () {
      gsap.from('.xcard', { x: 60, autoAlpha: 0, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '#expectTrack', start: 'top 86%', once: true } });
    });

    // magnetic buttons
    if (fine) $$('[data-magnetic]').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4, ease: 'power3.out' });
      });
      b.addEventListener('mouseleave', function () { gsap.to(b, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.45)' }); });
    });
    // quick card: gentle tilt
    var quick = $('#quick');
    if (fine && quick) {
      quick.addEventListener('mousemove', function (e) {
        var r = quick.getBoundingClientRect();
        gsap.to(quick, { rotateY: ((e.clientX - r.left) / r.width - .5) * 5, rotateX: -((e.clientY - r.top) / r.height - .5) * 5, transformPerspective: 900, duration: .5, ease: 'power2.out' });
      });
      quick.addEventListener('mouseleave', function () { gsap.to(quick, { rotateX: 0, rotateY: 0, duration: .8, ease: 'power3.out' }); });
    }

    window.addEventListener('load', function () { ST.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
    setTimeout(finishLoad, 4000);
  }

  /* ---------- What we help with: image follows the hovered row ---------- */
  var archImgs = $$('.help__arch img');
  $$('#helpList .row').forEach(function (r) {
    var k = r.getAttribute('data-open-match');
    var on = function () { archImgs.forEach(function (im) { im.classList.toggle('on', im.dataset.k === k); }); };
    r.addEventListener('mouseenter', on); r.addEventListener('focus', on);
  });

  /* ---------- Hero quick-start chips ---------- */
  var heroSel = new Set();
  $$('#heroChips .chip').forEach(function (c) {
    c.addEventListener('click', function () {
      var v = c.dataset.concern;
      if (heroSel.has(v)) heroSel.delete(v); else heroSel.add(v);
      c.classList.toggle('is-on'); c.setAttribute('aria-pressed', c.classList.contains('is-on'));
      if (heroSel.size === 1 && c.classList.contains('is-on')) track('match_hero_chip', { concern: v });
    });
  });
  $('#heroNext').addEventListener('click', function () { openMatch({ concerns: Array.from(heroSel), step: heroSel.size ? 2 : 1 }); });

  /* ---------- Matcher ---------- */
  var CLIN = [
    { id: 'heather', name: 'Dr Heather Gan', role: 'Clinical Psychologist · Founder', img: 'images/dr-heather-gan.webp', price: '$161.95',
      concerns: ['anxiety', 'emotions', 'identity', 'relationships', 'trauma'], modes: ['inperson', 'telehealth'], times: ['day', 'afterhours'], mandarin: true, culture: true },
    { id: 'team', name: 'Next available psychologist', role: 'Registrar / Registered Psychologist', ini: '+', price: '$148.45',
      concerns: ['anxiety', 'mood', 'burnout', 'relationships', 'unsure'], modes: ['inperson', 'telehealth'], times: ['day', 'afterhours'], lower: true, soonest: true }
  ];
  var LABEL = { anxiety: 'anxiety', mood: 'low mood', emotions: 'intense emotions', trauma: 'trauma', relationships: 'relationships', identity: 'cultural identity', burnout: 'burnout', unsure: 'working out what\'s going on' };

  var match = $('#match'), form = $('#mForm'), steps = $$('.mstep', form);
  var bar = $('#mBar'), count = $('#mCount'), back = $('#mBack'), next = $('#mNext');
  var state, cur = 1, lastFocus, started = false;
  function reset() { state = { concern: [], mode: [], time: [], mhcp: [], priority: [], pick: null }; }
  reset();
  try { var saved = JSON.parse(localStorage.getItem('tpa_match') || 'null'); if (saved && saved.concern) state = Object.assign(state, saved); } catch (e) {}
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
      if (multi) { if (i > -1) arr.splice(i, 1); else arr.push(v); }
      else { state[key] = i > -1 ? [] : [v]; }
      state.pick = key === 'pick' ? state.pick : state.pick;
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
  function renderResult(keepPick) {
    var ranked = CLIN.map(score).sort(function (a, b) { return b.s - a.s; });
    if (!keepPick || !state.pick) state.pick = ranked[0].c.id;
    var html = ranked.map(function (r, i) {
      var c = r.c;
      return '<button type="button" class="rcard' + (state.pick === c.id ? ' is-on' : '') + '" data-pick="' + c.id + '">' +
        '<span class="rcard__av">' + (c.img ? '<img src="' + c.img + '" alt="">' : c.ini) + '</span>' +
        '<span><h4>' + c.name + '</h4><p>' + c.role + ' · ' + c.price + ' after Medicare</p>' +
        (r.why.length ? '<span class="rcard__why">✓ ' + r.why.slice(0, 2).join(' · ') + '</span>' : '') + '</span>' +
        (i === 0 ? '<span class="rcard__badge">Best match</span>' : '') + '</button>';
    }).join('') + '<button type="button" class="rcard' + (state.pick === 'any' ? ' is-on' : '') + '" data-pick="any"><span class="rcard__av">?</span><span><h4>No preference</h4><p>Our intake team will match you on the call</p></span></button>';
    $('#mResult').innerHTML = html;
  }
  $('#mResult').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pick]'); if (!b) return;
    state.pick = b.dataset.pick; save();
    $$('.rcard', $('#mResult')).forEach(function (x) { x.classList.toggle('is-on', x === b); });
    track('match_select_clinician', { clinician: state.pick });
  });

  var requested = null;
  function show(n) {
    cur = n;
    steps.forEach(function (s) { var on = +s.dataset.step === n; s.hidden = !on; if (on) { s.classList.remove('anim'); void s.offsetWidth; s.classList.add('anim'); } });
    bar.style.width = (n >= 5 ? 100 : n / 4 * 100) + '%';
    count.textContent = n === 5 ? 'All done' : 'Step ' + n + ' of 4';
    back.style.visibility = n > 1 && n < 5 ? 'visible' : 'hidden';
    next.firstElementChild.textContent = n === 4 ? 'Request my intake call' : n === 5 ? 'Close' : 'Continue';
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
    match.hidden = false; lock(true);
    if (!started) { started = true; track('match_start', { source: opts.source || 'cta' }); }
    show(opts.step || 1);
  }
  function closeMatch() {
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
      var hasContact = f.phone.value.trim() || /\S+@\S+\.\S+/.test(f.email.value);
      f.phone.classList.toggle('is-err', !hasContact); f.email.classList.toggle('is-err', !hasContact);
      if (!hasContact) ok = false;
      if (!f.consent.checked) ok = false;
      if (!ok) { $('#mErr').hidden = false; track('match_form_error'); return; }
      $('#dName').textContent = f.name.value.trim().split(' ')[0];
      track('generate_lead', { form: 'guided_intake', clinician: state.pick, concerns: state.concern.join(','), mode: state.mode[0] || 'any' });
      /* Production: POST to a Squarespace form block / Halaxy enquiry via Zapier webhook */
      show(5); return;
    }
    closeMatch();
  });
  $('#crisisBtn').addEventListener('click', function () { $('#crisisBox').hidden = false; track('crisis_info_view'); });

  /* modals + focus trap + esc */
  var mhcpModal = $('#mhcpModal');
  function closeMhcp() { if (mhcpModal.hidden) return; mhcpModal.hidden = true; lock(false); }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-modal="mhcp"]');
    if (t && mhcpModal.hidden) { mhcpModal.hidden = false; lock(true); track('mhcp_explainer_open'); mhcpModal.querySelector('.match__x').focus(); }
    if (e.target.closest('[data-close-modal]')) closeMhcp();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!mhcpModal.hidden) return closeMhcp();
      if (!match.hidden) return closeMatch();
      if (mnav.classList.contains('open')) return closeNav();
      if (!$('#notes').hidden) toggleNotes(false);
    }
    if (e.key === 'Tab' && !match.hidden && mhcpModal.hidden) {
      var f = $$('button:not([disabled]), input, select, textarea, a[href]', $('.match__panel')).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- Fee calculator ---------- */
  var FEES = { clinical: { std: 311, ah: 326, reb: 149.05 }, registrar: { std: 250, ah: 265, reb: 101.55 } };
  var shown = { fee: 311, reb: 149.05, net: 161.95 };
  function paint() {
    $('#cFee').textContent = '$' + shown.fee.toFixed(2);
    $('#cReb').textContent = shown.reb > 0.004 ? '−$' + shown.reb.toFixed(2) : '$0.00';
    $('#cNet').textContent = '$' + shown.net.toFixed(2);
  }
  function calc(animate) {
    var tier = $('input[name=tier]:checked').value, time = $('input[name=time]:checked').value, m = $('#mhcp').checked;
    var fee = FEES[tier][time], reb = m ? FEES[tier].reb : 0, tgt = { fee: fee, reb: reb, net: fee - reb };
    if (hasGsap && animate) gsap.to(shown, Object.assign({ duration: .7, ease: 'power3.out', onUpdate: paint, overwrite: true }, tgt));
    else { shown = tgt; paint(); }
  }
  $$('.calc input').forEach(function (i) { i.addEventListener('change', function () { calc(true); track('fee_calc_change', { tier: $('input[name=tier]:checked').value, time: $('input[name=time]:checked').value, mhcp: $('#mhcp').checked }); }); });
  calc(false);

  /* ---------- Therapy tabs ---------- */
  var TH = [
    ['Cognitive Behavioural Therapy', 'Notice the link between thoughts, feelings and actions, and change the patterns that keep you stuck. Practical and structured.', 'anxiety, low mood, panic, worry', 'cbt', 'CBT', 'cbt.jpg'],
    ['Dialectical Behaviour Therapy', 'Skills for riding out intense emotions, tolerating distress and improving relationships, balancing acceptance with change.', 'BPD, intense emotions, relationship instability', 'dbt', 'DBT', 'dbt.jpg'],
    ['Schema Therapy', 'Understand the deep, long-standing patterns formed earlier in life, and how they still shape how you feel and relate today.', 'long-standing patterns, BPD, chronic low mood', 'schema-therapy', 'Schema Therapy', 'schema.jpg'],
    ['Acceptance & Commitment Therapy', 'Make room for difficult thoughts and feelings, and move towards what matters to you, rather than fighting yourself.', 'anxiety, burnout, chronic stress, life transitions', 'act', 'ACT', 'therapy.jpg'],
    ['STAIR & Trauma-Focused CBT', 'A phased, paced approach: first building emotional and relationship skills, then gently working through traumatic memories.', 'complex PTSD, childhood trauma', 'psych-blog/stair-therapy', 'STAIR', 'hands.jpg'],
    ['Motivational Interviewing', 'A collaborative conversation to explore mixed feelings about change and strengthen your own reasons for it.', 'ambivalence, habits, readiness for change', 'motivational-interviewing', 'Motivational Interviewing', 'reports.jpg']
  ];
  TH.forEach(function (d) { var im = new Image(); im.src = 'images/' + d[5]; });
  var tabs = $$('.tabs [role=tab]');
  function setTab(d) {
    $('#tpTitle').textContent = d[0]; $('#tpBody').textContent = d[1]; $('#tpFor').textContent = d[2];
    var l = $('#tpLink'); l.href = 'https://thepsychologyalley.com.au/' + d[3]; l.textContent = 'Read more about ' + d[4];
    $('#tpImg').src = 'images/' + d[5];
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      if (t.getAttribute('aria-selected') === 'true') return;
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t); });
      var d = TH[+t.dataset.t];
      if (hasGsap) {
        gsap.timeline()
          .to(['.tabpanel__txt', '#tpImg'], { autoAlpha: 0, y: 12, duration: .22, ease: 'power2.in', onComplete: function () { setTab(d); } })
          .fromTo('#tpImg', { scale: 1.12, autoAlpha: 0, y: 0 }, { scale: 1, autoAlpha: 1, duration: .9, ease: 'power3.out' })
          .fromTo('.tabpanel__txt', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .6, ease: 'power3.out' }, '<.1');
      } else setTab(d);
      track('therapy_tab', { therapy: d[4] });
    });
    t.addEventListener('keydown', function (e) {
      var k = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0; if (!k) return;
      e.preventDefault(); var n = tabs[(i + k + tabs.length) % tabs.length]; n.focus(); n.click();
    });
  });

  /* ---------- FAQ accordion ---------- */
  $$('.acc__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var it = q.parentNode, open = !it.classList.contains('is-open');
      $$('.acc__item').forEach(function (x) { x.classList.remove('is-open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); });
      if (open) { it.classList.add('is-open'); q.setAttribute('aria-expanded', 'true'); track('faq_open', { q: q.textContent.trim() }); }
      if (hasGsap) setTimeout(function () { ST.refresh(); }, 550);
    });
  });

  /* ---------- Open now (Sydney time) ---------- */
  (function () {
    var el = $('#openNow'); if (!el) return;
    try {
      var parts = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      var g = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
      var day = g('weekday'), mins = (+g('hour') % 24) * 60 + +g('minute');
      if (['Mon', 'Thu', 'Fri'].indexOf(day) > -1 && mins >= 660 && mins < 1110) { el.textContent = 'Open now · until 6:30pm'; el.style.setProperty('--c', '#8fd07c'); }
      else el.textContent = 'Closed now · enquire online any time';
    } catch (e) { el.textContent = 'Enquire online any time'; }
  })();

  /* ---------- Lead magnet ---------- */
  $('#guideForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var i = $('#gEmail'), ok = /\S+@\S+\.\S+/.test(i.value);
    i.classList.toggle('is-err', !ok);
    if (!ok) { i.focus(); return; }
    $('#guideOk').hidden = false; i.value = '';
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
    1: ['Floating header: 5 links, one action',
      'Visitors in distress scan, they don\'t browse. The menu goes from about 17 links to the 5 questions people actually have (what, who, how much, how). The phone number stays visible for people who would rather call, and the header tucks away while reading and returns the moment you scroll up.',
      'Current site: long Therapies drop-down, a leftover shopping-cart icon, and six different labels for the same booking button.',
      'KPI: header CTA click-through, phone clicks'],
    2: ['Hero: your photo, your H1, and step 1 starts here',
      'Your own banner photo and "Clinical psychology in Sydney CBD" heading stay (protects SEO), but the message now answers the visitor\'s real worry: "will I find the right person?" The first question of the matcher sits in the hero, so starting takes one tap. Rebate, "no referral needed" and telehealth answer the top three objections before any scrolling.',
      'Current hero: one "Book an appointment" button leading to a blank form, with no idea what happens next.',
      'KPI: hero chip interaction rate, match_start'],
    3: ['Trust logos, AHPRA-compliant',
      'Testimonials aren\'t allowed, so trust comes from verifiable facts: your real Ahpra, Medicare, ACPA, Pacifica Congress and FRWN logos, directly under the hero where people make the "is this legitimate?" judgement. The moving line repeats your values in your own words.',
      'These logos currently sit in the footer and on the About page only.',
      'KPI: bounce rate, scroll past hero'],
    4: ['Your story, in two sentences',
      'Your existing "About" copy, cut to the part that matters to a new client: a small, intentional team and "the right fit". The words light up as you scroll so people actually read it. Four facts underneath answer practical questions at a glance.',
      'Current: two paragraphs of small text between the hero and services.',
      'KPI: scroll depth, time on page'],
    5: ['Start with feelings, not therapy names',
      'People search for "anxiety" or "I don\'t feel like myself", not "Schema Therapy". Each row opens the matcher with that concern pre-filled (one step skipped). "Something harder to name" catches unsure visitors, and the scope note filters out poor fits early, which saves your intake team time.',
      'Current homepage leads with CBT / DBT / Schema cards, which is clinician language.',
      'KPI: concern clicks → match_start'],
    6: ['How it works: removes fear of the unknown',
      'Your enquiry → intake call → booking process is not a weakness once it is explained. Framing the intake call as the step that gets you the right match turns friction into reassurance, and a time on each step sets expectations.',
      'The current site never explains what happens after you click "Book".',
      'KPI: CTA clicks from this section'],
    7: ['Team: Heather leads, and the group practice is visible',
      'Heather\'s real photo, bio, quote, focus areas, fee after Medicare and registration number sit together, so a visitor can decide without opening another page. Emilie and Ana are shown honestly as clinical supervisors (which signals quality), and the third card is ready for each new psychologist as the team grows.',
      'Current homepage shows one photo and a name. Fees, availability and focus areas are on other pages.',
      'KPI: clinician CTA clicks'],
    8: ['Interactive fee & rebate calculator',
      'Cost uncertainty is the main silent reason people leave private-practice sites. Showing the out-of-pocket amount ($161.95, not just $311) reframes the price, and the registrar tier offers a lower-cost path instead of losing the visitor.',
      'Fees are currently on a separate page, not the homepage.',
      'KPI: fee_calc_change → match_start rate'],
    9: ['What to expect in session one',
      'First-time clients are anxious about the unknown. A simple four-part walkthrough (before, arriving, the 50 minutes, after) lowers the emotional barrier without making any clinical outcome claims. The sideways scroll keeps it short and keeps people engaged.',
      'This information is currently buried in the FAQ page.',
      'KPI: scroll depth, cta_expect clicks'],
    10: ['Therapies, explained in plain language',
      'Kept for informed visitors and for SEO (every link goes to your existing therapy page, so URLs are preserved), but placed after the decision-making content so it doesn\'t delay action.',
      'Current: 8-item drop-down, with some therapy pages filed under the blog.',
      'KPI: therapy_tab views'],
    11: ['Location & telehealth side by side',
      'Practical details remove last-minute doubts: nearest station, parking, and that telehealth has the same fees and rebates. A live "open now" line shows the practice is active.',
      'Current hours omit Tuesday and Wednesday, which looks ambiguous.',
      'KPI: directions clicks, phone clicks'],
    12: ['FAQ: objection handling before the final ask',
      'Ordered by what stops people booking: referral, wait time, choosing a psychologist, the first session, cancellation. Placed just before the final CTA so the last doubts are resolved at the moment of decision.',
      'Current FAQ page is titled "FAQs for Psychologists", has a contradictory cancellation policy and leftover template text.',
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
      '"We are ready when you are" is your line from the team page. One consistent action label through the whole page lowers the mental load, and phone is the alternative for people who prefer to talk.',
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

  var notesOn = false, pinsLayer = null, pop = $('#pop');
  var notesEl = $('#notes'), list = $('#notesList'), toggleBtn = $('#notesToggle');
  list.innerHTML = Object.keys(NOTES).map(function (k) {
    var n = NOTES[k];
    return '<li data-n="' + k + '"><span class="n">' + k + '</span><h4>' + n[0] + '</h4><p>' + n[1] + '</p>' + (n[2] ? '<p class="fix">Fixes: ' + n[2] + '</p>' : '') + '<span class="kpi">' + n[3] + '</span></li>';
  }).join('');

  function placePins() {
    if (pinsLayer) { pinsLayer.remove(); pinsLayer = null; }
    if (!notesOn) return;
    pinsLayer = document.createElement('div');
    $$('[data-cro]').forEach(function (el) {
      var n = el.getAttribute('data-cro');
      if (el.hidden) return;
      var cs = getComputedStyle(el);
      if (cs.display === 'none') return;
      var r = el.getBoundingClientRect();
      var pin = document.createElement('button');
      pin.className = 'pin'; pin.textContent = n; pin.dataset.n = n; pin.setAttribute('aria-label', 'CRO note ' + n + ': ' + NOTES[n][0]);
      if (el.id === 'mbar') { pin.style.position = 'fixed'; pin.style.bottom = '84px'; pin.style.right = '18px'; }
      else if (el.id === 'hdr') { pin.style.position = 'fixed'; pin.style.top = 'calc(var(--bar) + 8px)'; pin.style.left = (r.left + r.width / 2 - 17) + 'px'; pin.style.zIndex = 55; }
      else {
        pin.style.top = (r.top + window.scrollY + (el.classList.contains('hero') ? 128 : 22)) + 'px';
        pin.style.left = Math.min(Math.max(r.left, 0) + 22, root.clientWidth - 48) + 'px';
      }
      pinsLayer.appendChild(pin);
    });
    document.body.appendChild(pinsLayer);
  }
  function toggleNotes(on) {
    notesOn = on;
    document.body.classList.toggle('notes-on', on);
    toggleBtn.setAttribute('aria-pressed', on);
    var wide = window.innerWidth > 1300;
    notesEl.hidden = !(on && wide);
    document.body.classList.toggle('notes-docked', on && wide);
    pop.hidden = true;
    if (hasGsap) ST.refresh();
    placePins();
    if (on) track('cro_notes_open');
  }
  toggleBtn.addEventListener('click', function () {
    if (notesOn && notesEl.hidden) { notesEl.hidden = false; return; }
    toggleNotes(!notesOn);
    if (notesOn && window.innerWidth <= 1300) notesEl.hidden = false;
  });
  $('#notesClose').addEventListener('click', function () { toggleNotes(false); });
  window.addEventListener('resize', function () { clearTimeout(placePins.t); placePins.t = setTimeout(placePins, 200); });
  if (hasGsap) ST.addEventListener('refresh', function () { clearTimeout(placePins.t); placePins.t = setTimeout(placePins, 50); });

  function goTo(n) {
    if (n === '18') { openMatch({ source: 'cro_note' }); return; }
    var el = $('[data-cro="' + n + '"]');
    if (!el) return;
    if (n === '1' || n === '2') return scrollToEl(document.body, 0);
    var top = 0, pinSpacer = el.closest('.pin-spacer');
    scrollToEl(pinSpacer || el, -70);
  }
  document.addEventListener('click', function (e) {
    var pin = e.target.closest('.pin');
    if (pin) {
      e.stopPropagation();
      var n = NOTES[pin.dataset.n];
      $$('li', list).forEach(function (li) { li.classList.toggle('is-hl', li.dataset.n === pin.dataset.n); });
      var hl = list.querySelector('.is-hl');
      if (!notesEl.hidden && hl) notesEl.scrollTo({ top: hl.offsetTop - 90, behavior: 'smooth' });
      pop.innerHTML = '<h4>' + pin.dataset.n + '. ' + n[0] + '</h4><p>' + n[1] + '</p><span class="kpi">' + n[3] + '</span>';
      pop.hidden = false;
      var r = pin.getBoundingClientRect(), pw = Math.min(320, window.innerWidth - 32);
      var x = Math.max(16, Math.min(r.left, window.innerWidth - pw - 16 - (notesEl.hidden ? 0 : 420)));
      var y = r.bottom + 10; if (y + 240 > window.innerHeight) y = Math.max(56, r.top - 250);
      pop.style.left = x + 'px'; pop.style.top = y + 'px';
      return;
    }
    if (!e.target.closest('.pop')) pop.hidden = true;
    var li = e.target.closest('#notesList li');
    if (li) { if (window.innerWidth <= 1300) notesEl.hidden = true; goTo(li.dataset.n); }
  });
  window.addEventListener('scroll', function () { pop.hidden = true; }, { passive: true });

  if (/[?&]notes=1/.test(location.search)) setTimeout(function () { toggleNotes(true); if (window.innerWidth <= 1300) notesEl.hidden = false; }, 2600);
})();
