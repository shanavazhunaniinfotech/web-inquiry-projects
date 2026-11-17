/* BetterBody360 — homepage interactions */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var params = new URLSearchParams(location.search);
  var notesMode = params.get('notes') === '1';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  if (!hasGsap || reduce) root.classList.add('no-anim');
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (window.Lenis && !reduce && finePointer) {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }
  function scrollToEl(el) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id === '#') { e.preventDefault(); return; }
    var el = document.querySelector(id);
    if (el) { e.preventDefault(); closeMenu(); scrollToEl(el); }
  });

  /* ---------- Loader + hero intro ---------- */
  var loader = $('#loader');
  function heroIntro() {
    document.body.classList.remove('is-loading');
    if (!hasGsap || reduce) { countScore(true); return; }
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to('.hero__title .fx-line', { y: 0, duration: 1.2, stagger: .12 })
      .to('.hero .fx-up', { opacity: 1, y: 0, duration: 1, stagger: .08 }, '-=.9')
      .fromTo('.orb', { opacity: 0, scale: .85, rotate: -20 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.6 }, '-=1.2')
      .fromTo('.glass', { opacity: 0, y: 30, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .9, stagger: .15, ease: 'back.out(1.6)', onStart: function () { countScore(); } }, '-=.9');
  }
  function finishLoader() {
    if (!loader) { heroIntro(); return; }
    if (hasGsap && !reduce) {
      gsap.to(loader, { yPercent: -100, duration: .9, ease: 'power4.inOut', onComplete: function () { loader.classList.add('is-done'); } });
      setTimeout(heroIntro, 350);
    } else { loader.classList.add('is-done'); heroIntro(); }
  }
  var skipLoader = reduce || notesMode || store('bb360_seen') === '1' || !hasGsap;
  store('bb360_seen', '1');
  if (skipLoader) {
    if (loader) loader.classList.add('is-done');
    heroIntro();
  } else {
    var num = $('#loaderNum'), bar = $('#loaderBar'), o = { v: 0 };
    gsap.to(o, { v: 360, duration: 1.3, ease: 'power2.inOut', onUpdate: function () {
      num.textContent = Math.round(o.v);
      bar.style.strokeDashoffset = 565.5 * (1 - o.v / 360);
    }, onComplete: finishLoader });
  }

  function countScore(instant) {
    var el = $('#heroScore'), g = $('#heroGauge');
    if (!el) return;
    if (instant || !hasGsap) { el.textContent = '82'; return; }
    var s = { v: 0 };
    g.style.strokeDashoffset = 169.6;
    gsap.to(s, { v: 82, duration: 1.6, ease: 'power2.out', onUpdate: function () {
      el.textContent = Math.round(s.v);
      g.style.strokeDashoffset = 169.6 * (1 - s.v / 100);
    } });
  }

  /* ---------- Countdown (resets nightly) ---------- */
  var cd = $('#cd');
  function tick() {
    var now = new Date(), end = new Date(now); end.setHours(23, 59, 59, 999);
    var s = Math.max(0, Math.floor((end - now) / 1000));
    var p = function (n) { return String(n).padStart(2, '0'); };
    if (cd) cd.textContent = p(Math.floor(s / 3600)) + ':' + p(Math.floor(s % 3600 / 60)) + ':' + p(s % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Nav ---------- */
  var nav = $('#nav'), burger = $('.nav__burger'), mnav = $('#mnav');
  var darkSecs = $$('.hero, .cred, .method, .coach, .partner, .final, .foot');
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    var probe = nav.getBoundingClientRect().bottom - 4;
    var onDark = darkSecs.some(function (s) { var r = s.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
    nav.classList.toggle('is-light', !onDark && y > 40);
    if (!document.body.classList.contains('menu-open')) nav.classList.toggle('is-hidden', y > 700 && y > lastY + 4);
    if (y < lastY - 4 || y < 700) nav.classList.remove('is-hidden');
    lastY = y;
    // sticky mobile CTA
    var hero = $('.hero'), fin = $('.final');
    var show = hero.getBoundingClientRect().bottom < 0 && fin.getBoundingClientRect().top > window.innerHeight * .6;
    $('#sticky').classList.toggle('is-on', show);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  function closeMenu() {
    if (!mnav || mnav.hidden) return;
    mnav.hidden = true; burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (lenis) lenis.start();
  }
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    if (open) { closeMenu(); return; }
    mnav.hidden = false; burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open'); nav.classList.remove('is-hidden');
    if (lenis) lenis.stop();
    if (hasGsap && !reduce) gsap.fromTo('.mnav nav a, .mnav .btn, .mnav__login', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .6, stagger: .05, ease: 'power3.out' });
  });

  /* ---------- Hero pointer FX ---------- */
  var hero = $('.hero'), glow = $('#heroGlow'), orb = $('#orb');
  if (finePointer && !reduce && hero) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      glow.style.left = (x * 100) + '%'; glow.style.top = (y * 100) + '%';
      if (hasGsap) {
        gsap.to('.glass--score', { x: (x - .5) * -30, y: (y - .5) * -20, duration: 1.2, ease: 'power3.out' });
        gsap.to('.glass--rx', { x: (x - .5) * 26, y: (y - .5) * 18, duration: 1.2, ease: 'power3.out' });
        gsap.to('.glass--coach', { x: (x - .5) * -18, y: (y - .5) * 24, duration: 1.2, ease: 'power3.out' });
        gsap.to('.orb__photo img', { x: (x - .5) * 18, y: (y - .5) * 18, duration: 1.4, ease: 'power3.out' });
      }
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduce && hasGsap) {
    $$('.magnetic').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .3, duration: .5, ease: 'power3.out' });
      });
      b.addEventListener('mouseleave', function () { gsap.to(b, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' }); });
    });
  }

  /* ---------- Statement: words light up on scroll ---------- */
  var st = $('#statementText');
  if (st) {
    var words = st.textContent.trim().split(/\s+/);
    st.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    var ws = $$('.w', st);
    if (hasGsap && !reduce) {
      ScrollTrigger.create({
        trigger: st, start: 'top 80%', end: 'bottom 45%', scrub: true,
        onUpdate: function (self) {
          var n = Math.round(self.progress * ws.length);
          ws.forEach(function (w, i) { w.classList.toggle('on', i < n); });
        }
      });
    } else ws.forEach(function (w) { w.classList.add('on'); });
  }

  /* ---------- Goal selector ---------- */
  var U = 'https://images.unsplash.com/photo-';
  var GOALS = {
    weight: { tag: 'Most chosen goal', img: U + '1571019613454-1cb2f99b2d8b?w=1000&h=700&fit=crop', title: 'Physician-guided weight loss',
      text: 'GLP-1 therapy to quiet cravings and improve metabolic health, with a coach and app that help you keep the weight off.',
      items: [['GLP', 'Tirzepatide or Semaglutide', 'Rx · weekly GLP-1 therapy', 'Most popular'], ['C360', 'Coaching360', '1:1 coach, plan & health app', '', true]] },
    body: { tag: 'Body recomposition', img: U + '1541534741688-6078c6bfb5c5?w=1000&h=700&fit=crop', title: 'Lose fat, keep the muscle',
      text: 'Improve body composition while protecting lean muscle, with peptide support for recovery and a strength-focused plan.',
      items: [['SRM', 'Sermorelin', 'Rx · growth-hormone support', ''], ['P360', 'Perfect360®', 'Creatine + essential amino acids', 'No Rx'], ['C360', 'Coaching360', 'Strength & protein plan', '', true]] },
    hormone: { tag: 'Energy & vitality', img: U + '1581009146145-b5ef050c2e1e?w=1000&h=700&fit=crop', title: 'Restore energy & hormone balance',
      text: 'Lab-guided hormone therapy to optimize energy, mood, libido and metabolism, monitored by a licensed physician.',
      items: [['TRT', 'Testosterone', 'Rx · lab-guided hormone therapy', ''], ['C360', 'Coaching360', 'Ongoing monitoring & coaching', '', true]] },
    aging: { tag: 'Healthspan', img: U + '1544367567-0f2fcb009e0b?w=1000&h=700&fit=crop', title: 'Feel younger, for longer',
      text: 'Support cellular energy, DNA repair, detoxification and immune function, so you stay sharp and active for years to come.',
      items: [['NAD', 'NAD+', 'Rx · cellular energy', ''], ['GSH', 'Glutathione', 'Rx · master antioxidant', ''], ['C360', 'Coaching360', 'Healthspan-focused plan', '', true]] },
    nutrition: { tag: 'Ships fast · No Rx', img: U + '1512621776951-a57141f2eefd?w=1000&h=700&fit=crop', title: 'Cover your daily essentials',
      text: 'One simple daily formula with methylated vitamins, minerals, electrolytes, creatine and essential amino acids.',
      items: [['P360', 'Perfect360®', 'Daily essentials formula', 'No Rx'], ['C360', 'Coaching360', 'Nutrition plan & tracking', '', true]] },
    skin: { tag: 'Glow from within', img: U + '1494790108377-be9c29b29330?w=1000&h=700&fit=crop&crop=faces', title: 'Healthier-looking skin & hair',
      text: 'GHK-Cu copper peptide cream to support healthier-looking skin, hair and overall appearance, prescribed by a licensed physician.',
      items: [['GHK', 'GHK-Cu Cream', 'Rx · topical copper peptide', ''], ['C360', 'Coaching360', 'Sleep, nutrition & recovery', '', true]] }
  };
  Object.keys(GOALS).forEach(function (k) { var i = new Image(); i.src = GOALS[k].img; });
  var goalBtns = $$('.goal');
  function setGoal(key, animate) {
    var g = GOALS[key];
    goalBtns.forEach(function (b) { var on = b.dataset.goal === key; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', String(on)); });
    var img = $('#planImg');
    var apply = function () {
      img.src = g.img;
      $('#planTag').textContent = g.tag;
      $('#planTitle').textContent = g.title;
      $('#planText').textContent = g.text;
      $('#planItems').innerHTML = g.items.map(function (it) {
        return '<li class="plan__item' + (it[4] ? ' plan__item--o' : '') + '"><i>' + it[0] + '</i><div><b>' + (it[4] ? '+ ' : '') + it[1] + '</b><small>' + it[2] + '</small></div>' + (it[3] ? '<span class="pill">' + it[3] + '</span>' : '') + '</li>';
      }).join('');
    };
    if (animate && hasGsap && !reduce) {
      gsap.to('#plan .plan__body > *:not(.btn), #planImg', { opacity: 0, y: 8, duration: .2, stagger: .015, onComplete: function () {
        apply();
        gsap.fromTo('#planImg', { opacity: 0, scale: 1.08, y: 0 }, { opacity: 1, scale: 1, duration: .8, ease: 'power3.out' });
        gsap.fromTo('#plan .plan__body > *:not(.btn), #planItems li', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, stagger: .04, ease: 'power3.out' });
      } });
    } else apply();
  }
  goalBtns.forEach(function (b) { b.addEventListener('click', function () { setGoal(b.dataset.goal, true); }); });
  setGoal('weight', false);

  /* ---------- 360 Method: active step + dial ---------- */
  var msteps = $$('.mstep'), segs = $$('.dial__seg');
  function setStep(i) {
    msteps.forEach(function (m, j) { m.classList.toggle('is-active', j === i); });
    segs.forEach(function (s, j) { s.classList.toggle('is-on', j === i); s.classList.toggle('is-done', j < i); });
    var m = msteps[i];
    $('#dialN').textContent = '0' + (i + 1);
    $('#dialLabel').textContent = m.dataset.label;
    $('#dialTime').textContent = m.dataset.time;
    if (hasGsap && !reduce) gsap.fromTo('.dial__center > *', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45, stagger: .05, ease: 'power3.out', overwrite: true });
  }
  var curStep = 0;
  var stepIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { var i = +e.target.dataset.step; if (i !== curStep) { curStep = i; setStep(i); } }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  msteps.forEach(function (m) { stepIO.observe(m); });
  setStep(0);

  /* ---------- Treatments rail ---------- */
  var rail = $('#rail'), bar = $('#railBar');
  function railProgress() {
    var max = rail.scrollWidth - rail.clientWidth;
    var vis = rail.clientWidth / rail.scrollWidth;
    bar.style.width = Math.max(10, vis * 100) + '%';
    bar.style.transform = 'translateX(' + (max > 0 ? (rail.scrollLeft / max) * ((1 / Math.max(vis, .1)) - 1) * 100 : 0) + '%)';
  }
  rail.addEventListener('scroll', railProgress, { passive: true });
  window.addEventListener('resize', railProgress);
  railProgress();
  function railStep(dir) {
    var card = $('.pc:not(.is-hidden)', rail);
    var w = card ? card.getBoundingClientRect().width + 22 : 360;
    rail.scrollBy({ left: dir * w * (window.innerWidth > 1100 ? 2 : 1), behavior: 'smooth' });
  }
  $('#railPrev').addEventListener('click', function () { railStep(-1); });
  $('#railNext').addEventListener('click', function () { railStep(1); });
  // drag to scroll (desktop)
  if (finePointer) {
    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { moved = true; rail.classList.add('is-drag'); }
      rail.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () { if (!down) return; down = false; setTimeout(function () { rail.classList.remove('is-drag'); }, 0); });
    rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    // 3D tilt
    if (!reduce) $$('.pc:not(.pc--help)').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        if (rail.classList.contains('is-drag')) return;
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = 'perspective(900px) rotateY(' + x * 8 + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-6px)';
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
  }
  rail.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') railStep(1); if (e.key === 'ArrowLeft') railStep(-1); });
  var chips = $$('.chip'), cards = $$('.pc[data-cat]');
  chips.forEach(function (ch) {
    ch.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.toggle('is-active', x === ch); });
      var f = ch.dataset.filter, shown = [];
      cards.forEach(function (c) {
        var ok = f === 'all' || c.dataset.cat === 'all' || c.dataset.cat.split(' ').indexOf(f) > -1;
        c.classList.toggle('is-hidden', !ok);
        if (ok) shown.push(c);
      });
      rail.scrollTo({ left: 0 });
      railProgress();
      if (hasGsap && !reduce) gsap.fromTo(shown, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: .6, stagger: .05, ease: 'power3.out', clearProps: 'opacity,transform' });
    });
  });

  /* ---------- Coaching360 phone ---------- */
  var cfs = $$('.cf'), scrs = $$('.scr'), curScr = 0;
  function setScreen(i) {
    curScr = i;
    cfs.forEach(function (c, j) { c.classList.toggle('is-active', j === i); });
    scrs.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
  }
  var mqDesk = window.matchMedia('(min-width: 961px)');
  var cfIO = new IntersectionObserver(function (es) {
    if (!mqDesk.matches) return;
    es.forEach(function (e) { if (e.isIntersecting) setScreen(+e.target.dataset.screen); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  cfs.forEach(function (c) {
    cfIO.observe(c);
    c.addEventListener('click', function () { setScreen(+c.dataset.screen); restartCycle(); });
  });
  // On mobile, auto-cycle the screens while the phone is in view
  var cycle = null, phoneVisible = false;
  function restartCycle() {
    clearInterval(cycle);
    if (mqDesk.matches || !phoneVisible || reduce) return;
    cycle = setInterval(function () { setScreen((curScr + 1) % scrs.length); }, 3800);
  }
  new IntersectionObserver(function (es) { phoneVisible = es[0].isIntersecting; restartCycle(); }, { threshold: .4 }).observe($('#phone'));
  mqDesk.addEventListener && mqDesk.addEventListener('change', restartCycle);

  /* ---------- Testimonials ---------- */
  var ts = $('#tslider'), qs = $$('.quote'), ims = $$('.tslider__media img'), dots = $$('.tdot'), tIdx = 0, tTimer = null;
  function showT(i) {
    tIdx = i;
    qs.forEach(function (q, j) { q.classList.toggle('is-active', j === i); });
    ims.forEach(function (m, j) { m.classList.toggle('is-active', j === i); });
    dots.forEach(function (d, j) { d.classList.remove('is-active'); if (j === i) { void d.offsetWidth; d.classList.add('is-active'); } });
  }
  function autoT() { clearInterval(tTimer); if (!reduce) tTimer = setInterval(function () { if (!ts.classList.contains('is-paused')) showT((tIdx + 1) % qs.length); }, 6000); }
  dots.forEach(function (d) { d.addEventListener('click', function () { showT(+d.dataset.i); autoT(); }); });
  ts.addEventListener('mouseenter', function () { ts.classList.add('is-paused'); });
  ts.addEventListener('mouseleave', function () { ts.classList.remove('is-paused'); });
  autoT();

  /* ---------- Counters ---------- */
  var cIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      cIO.unobserve(e.target);
      var el = e.target, to = +el.dataset.count;
      if (reduce || !hasGsap) { el.textContent = to; return; }
      var o = { v: 0 };
      gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
  }, { threshold: .6 });
  $$('[data-count]').forEach(function (el) { el.textContent = '0'; cIO.observe(el); });

  /* ---------- Partner earnings ---------- */
  var refs = $('#refs');
  function calc() {
    var n = +refs.value;
    $('#refsOut').textContent = n;
    $('#earnOut').textContent = '$' + (n * 150).toLocaleString('en-US');
    refs.style.setProperty('--p', ((n - 1) / 49 * 100) + '%');
  }
  refs.addEventListener('input', calc); calc();

  /* ---------- Forms ---------- */
  $('#news').addEventListener('submit', function (e) { e.preventDefault(); this.classList.add('is-ok'); this.innerHTML = '✓ You’re in. Watch your inbox.'; });
  $('#exitForm').addEventListener('submit', function (e) { e.preventDefault(); this.innerHTML = '<p class="ok">✓ Check your inbox. Your 20% code is on its way.</p>'; });

  /* ---------- Exit intent (desktop, once per session) ---------- */
  var modal = $('#exit'), armed = false;
  setTimeout(function () { armed = true; }, 10000);
  function openModal() {
    if (notesMode || store('bb360_exit') === '1') return;
    store('bb360_exit', '1'); modal.hidden = false;
    if (lenis) lenis.stop();
  }
  function closeModal() { if (modal.hidden) return; modal.hidden = true; if (lenis) lenis.start(); }
  document.addEventListener('mouseout', function (e) { if (armed && !e.relatedTarget && e.clientY <= 0 && window.innerWidth > 960) openModal(); });
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('.modal__x')) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeModal(); closeMenu(); } });

  /* ---------- Scroll reveals ---------- */
  if (hasGsap && !reduce) {
    var groups = [
      '.cred', '.statement .kicker', '.statement__pills > *',
      '.goals .head > *', '.goals__list li', '.plan',
      '.method .head > *', '.dial',
      '.products .head > *', '.pc',
      '.coach .head > *', '.phone', '.device__chip',
      '.guarantee__inner > *',
      '.compare .head > *', '.crow',
      '.results .head > *', '.tslider', '.stat',
      '.partner__copy > *', '.earn',
      '.learn .head > *', '.ac',
      '.faq__side > *', '.acc details',
      '.final__inner > *', '.foot__top > *', '.foot__word'
    ];
    groups.forEach(function (sel) {
      gsap.set(sel, { opacity: 0, y: 46 });
      ScrollTrigger.batch(sel, {
        start: 'top 88%', once: true,
        onEnter: function (els) {
          gsap.fromTo(els, { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 1, stagger: .08, ease: 'power3.out', clearProps: 'opacity,transform' });
        }
      });
    });
    // parallax touches
    gsap.to('.partner__bg img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.partner', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.final__orb', { scale: .7 }, { scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    gsap.fromTo('.foot__word', { xPercent: -6 }, { xPercent: 4, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    gsap.to('.orb', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* ---------- Design notes (?notes=1) ---------- */
  var NOTES = {
    1: ['Offer bar with a live countdown', 'The 20% offer from Jeff’s own mock-up is the strongest incentive the site has, so it sits above everything on every visit. The countdown resets nightly (honest urgency) and the link jumps straight to the goal selector, the page’s main conversion point.'],
    2: ['Cinematic hero: one promise, one action', 'Keeps the brand line “A better approach to better health”, then says exactly what members get: doctor-prescribed treatment + coach + app. One dominant orange CTA (“Find my treatment”) and one quiet secondary. The rotating 360° orb makes the brand name visual: every part of your health, around you. Floating cards show the real experience (health score, physician approval, coach message) in two seconds. Risk-reducers and the 5.0 rating sit right under the buttons, where hesitation happens.'],
    3: ['Credentials immediately after the hero', 'For online prescriptions, “is this legit?” is the first objection. On the current site LegitScript, HIPAA and 50-state licensing are at the very bottom. Here they scroll past right after the hero, so trust is settled before the visitor reads any product.'],
    4: ['A positioning statement that lights up as you read', 'One sentence explains why BetterBody360 is different from prescription-only competitors: physician + pharmacy + coach + app = 360°. The word-by-word reveal slows the reader down on the most important message on the page.'],
    5: ['Goal selector (self-segmentation)', 'Visitors think in goals (“I want to lose weight”), not product names (“Tirzepatide”). Picking a goal instantly builds a starting plan with the right treatment + Coaching360, and one CTA. This replaces the old benefits slider and is the main conversion engine. Coaching360 is attached to every plan, which raises order value.'],
    6: ['The 360 Method: how it works as a story', 'Telehealth is unfamiliar to many people. Four steps (Assess → Treat → Coach → Track) with time expectations remove uncertainty. The dial fills as you scroll, so the process feels short and guided. Step 3–4 show coaching, the key reason to choose BetterBody360 over cheaper prescription-only sites.'],
    7: ['Treatments as a premium, filterable rail', 'All 8 products in one swipeable rail (drag on desktop, swipe on mobile) with category filters. Each card leads with the benefit, adds two quick facts and one clear CTA. “Most popular” guides undecided visitors, and the last card catches anyone still unsure and sends them back to the goal selector. Vials/jars are styled renders until real product photos are ready.'],
    8: ['Coaching360: five pages condensed into one section', 'As Jeff asked, the whole Coaching360 menu becomes one clear story. The headline sets the positioning (“Treatment gets you started. Coaching gets you there.”). As you scroll the four features, the phone shows the matching app screen: coach chat, dashboard, assessment, daily plan. All 14 focus areas scroll below.'],
    9: ['The guarantee gets its own spotlight', '“Your goals. Our commitment.” is currently buried inside the Coaching360 page. It is one of the strongest risk-reversal tools the client has, so it gets a full-width orange band nobody can miss.'],
    10: ['Comparison table', 'Visitors compare options in other tabs. This table does the comparison for them, on BetterBody360’s strengths: physician + pharmacy + coach + app + guarantee, against typical telehealth and going it alone.'],
    11: ['Social proof with faces and numbers', 'The three real testimonials from the current site, presented as an editorial slider with photos and star ratings (auto-plays, pauses on hover). Big animated numbers (50 states, 50+ apps, 360°, 100%) back up the claims. Photos are placeholders until we have real members’ approval.'],
    12: ['Brand Partner: a separate audience, a separate chapter', 'Partners are not patients, so they get a distinct dark section with their own path: Apply → Market → Earn. The $99 one-time fee is stated up front (transparency builds trust), and the earnings slider makes the opportunity concrete. The commission figure is a placeholder for Jeff to confirm.'],
    13: ['Education builds authority (and SEO)', 'The existing articles show expertise. One featured story plus two compact cards support the decision without pulling people away from the main path.'],
    14: ['FAQ removes the last objections', 'Prescription, cost, insurance, delivery, privacy: the questions that stop people from starting are answered right before the final CTA.'],
    15: ['Final CTA: “Start your 360.”', 'One last focused ask, repeating the offer and the four trust points, so anyone who reads to the end has a clear next step. Plus: a sticky “Get started” bar on mobile after the hero, and a one-time exit-intent email offer on desktop to capture visitors who are about to leave.']
  };
  if (notesMode) {
    var toggle = $('#notesToggle'), panel = $('#notes'), list = $('#notesList');
    toggle.hidden = false;
    Object.keys(NOTES).forEach(function (k) {
      var li = document.createElement('li');
      li.innerHTML = '<b><i>' + k + '</i>' + NOTES[k][0] + '</b><p>' + NOTES[k][1] + '</p>';
      li.addEventListener('click', function () {
        var sec = $('[data-note="' + k + '"]');
        if (window.innerWidth < 960) panel.hidden = true;
        scrollToEl(sec);
        sec.classList.remove('flash'); void sec.offsetWidth; sec.classList.add('flash');
      });
      list.appendChild(li);
    });
    $$('[data-note]').forEach(function (sec) {
      var pin = document.createElement('button');
      pin.className = 'pin'; pin.textContent = sec.dataset.note;
      pin.setAttribute('aria-label', 'Design note ' + sec.dataset.note);
      pin.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        panel.hidden = false;
        var item = list.children[+sec.dataset.note - 1];
        if (item) { item.scrollIntoView({ block: 'center' }); item.classList.remove('flash'); void item.offsetWidth; item.classList.add('flash'); }
      });
      sec.appendChild(pin);
    });
    toggle.addEventListener('click', function () { panel.hidden = !panel.hidden; });
    $('#notesClose').addEventListener('click', function () { panel.hidden = true; });
  }
})();
