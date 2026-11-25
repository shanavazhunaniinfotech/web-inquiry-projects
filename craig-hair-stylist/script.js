(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var PX = function (id, w, h) { return 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=' + w + (h ? '&h=' + h + '&fit=crop' : ''); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ---------------- Loader ---------------- */
  var loader = $('#loader');
  $$('.loader__word span').forEach(function (s, i) { s.style.animationDelay = (i * 45) + 'ms'; });
  var seen = false;
  try { seen = sessionStorage.getItem('hs-intro') === '1'; sessionStorage.setItem('hs-intro', '1'); } catch (e) {}
  function endLoader() {
    loader.classList.add('is-done');
    document.body.classList.remove('is-loading');
    setTimeout(function () { loader.style.display = 'none'; }, 1100);
    heroIntro();
  }
  if (seen || reduce) { loader.style.display = 'none'; document.body.classList.remove('is-loading'); setTimeout(heroIntro, 50); }
  else { window.addEventListener('load', function () { setTimeout(endLoader, 700); }); setTimeout(function () { if (!loader.classList.contains('is-done')) endLoader(); }, 3200); }

  var heroDone = false;
  function heroIntro() {
    if (heroDone) return; heroDone = true;
    startHero();
  }

  /* ---------------- Smooth scroll ---------------- */
  var lenis = null;
  if (typeof window.Lenis !== 'undefined' && !reduce) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    if (hasGsap) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else { (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0); }
  }
  function goTo(sel) {
    var el = typeof sel === 'string' ? $(sel) : sel; if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.3 }); else el.scrollIntoView({ behavior: 'smooth' });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var t = $(id); if (!t) return; e.preventDefault(); goTo(t);
      closeNav();
    });
  });

  /* ---------------- Announcement + hero rotator ---------------- */
  function rotate(items, ms) {
    var i = 0; if (items.length < 2) return;
    setInterval(function () {
      var cur = items[i]; cur.classList.remove('is-on'); cur.classList.add('is-out');
      setTimeout(function () { cur.classList.remove('is-out'); }, 700);
      i = (i + 1) % items.length; items[i].classList.add('is-on');
    }, ms);
  }
  rotate($$('#announceRot p'), 4200);

  /* ---------------- Header ---------------- */
  var header = $('#header'), lastY = 0, floatBook = $('#floatBook'), mbar = $('#mbar');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-scrolled', y > 20);
    header.classList.toggle('is-hidden', y > 600 && y > lastY && !$('#nav').classList.contains('is-open'));
    lastY = y;
    var book = $('#book').getBoundingClientRect(), foot = $('.footer').getBoundingClientRect();
    var hideNear = (book.top < innerHeight && book.bottom > 0) || foot.top < innerHeight;
    floatBook.classList.toggle('is-on', y > 900 && !hideNear);
    mbar.classList.toggle('is-on', y > 500 && !hideNear);
    // active nav
    var cur = '';
    ['services', 'transformations', 'lookbook', 'reviews', 'visit'].forEach(function (id) {
      var el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * .4) cur = id;
    });
    $$('.nav a').forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + cur); });
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', function () { var o = nav.classList.toggle('is-open'); burger.setAttribute('aria-expanded', o); });
  function closeNav() { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }

  /* ---------------- Split headings ---------------- */
  $$('.split').forEach(function (el) {
    var d = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var o = document.createElement('span'); o.className = 'sw';
            var i = document.createElement('span'); i.textContent = p; i.style.setProperty('--d', d++);
            o.appendChild(i); frag.appendChild(o);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
  });

  /* fade-up targets */
  $$('.sec-head__side, .plan__svcs, .plan__foot, .sv-menu, .sv-foot, .tf__side, .ba, .why__head p, .why__head .btn, .promise, .rv, .igx__card, .book__card, .vcard, .map, .footer__cta .footer__btns, .eyebrow').forEach(function (el) { el.classList.add('fade-up'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: .15, rootMargin: '0px 0px -60px 0px' });
    $$('.split, .fade-up').forEach(function (el) { io.observe(el); });
    // clipped images have zero visible area, so watch their parent instead
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { $$('.reveal-img', e.target).forEach(function (r, i) { setTimeout(function () { r.classList.add('is-in'); }, i * 250); }); rio.unobserve(e.target); } });
    }, { threshold: .1 });
    $$('.reveal-img').map(function (r) { return r.parentNode; }).filter(function (p, i, a) { return a.indexOf(p) === i; }).forEach(function (p) { rio.observe(p); });
  } else $$('.split, .fade-up, .reveal-img').forEach(function (el) { el.classList.add('is-in'); });

  /* ---------------- Count up ---------------- */
  function countUp(el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now(), dur = 1800;
    (function tick(now) {
      var p = Math.min(1, (now - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 4)));
      el.textContent = v.toLocaleString() + (p === 1 ? suf : '');
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } }); }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (window.matchMedia('(hover: hover)').matches && !reduce) {
    $$('.magnetic').forEach(function (b) {
      b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .18 + 'px,' + (e.clientY - r.top - r.height / 2) * .3 + 'px)'; });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------------- HERO slider (4 cards, 6s) ---------------- */
  var hx = $('#hx'), hSlides = $$('.hx__slide', hx), tabs = $$('.hx__tabs button', hx), hi = 0, hTimer = null, HDUR = 6000, hStarted = false;
  function goHero(n) {
    n = (n + hSlides.length) % hSlides.length; if (n === hi) return restartHero();
    var prev = hSlides[hi];
    prev.classList.add('is-leaving'); prev.classList.remove('is-on');
    setTimeout(function () { prev.classList.remove('is-leaving'); }, 1300);
    hi = n;
    var img = $('.hx__img', hSlides[hi]); if (img.loading === 'lazy') img.loading = 'eager';
    hSlides[hi].classList.add('is-on');
    tabs.forEach(function (t, i) {
      t.classList.toggle('is-on', i === hi); t.setAttribute('aria-selected', i === hi);
      var b = $('i b', t); b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
    });
    restartHero();
  }
  function restartHero() { clearTimeout(hTimer); if (!reduce) hTimer = setTimeout(function () { goHero(hi + 1); }, HDUR); }
  function startHero() { if (hStarted) return; hStarted = true; hSlides.forEach(function (s) { var i = $('.hx__img', s); if (i.loading === 'lazy') { var pre = new Image(); pre.src = i.src; } }); restartHero(); }
  tabs.forEach(function (t, i) { t.addEventListener('click', function () { goHero(i); }); });
  $('#hxPrev').addEventListener('click', function () { goHero(hi - 1); });
  $('#hxNext').addEventListener('click', function () { goHero(hi + 1); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) { clearTimeout(hTimer); hx.classList.add('is-paused'); } else { hx.classList.remove('is-paused'); goHeroReset(); } });
  function goHeroReset() { var t = tabs[hi], b = $('i b', t); b.style.animation = 'none'; void b.offsetWidth; b.style.animation = ''; restartHero(); }
  var tsx = null;
  hx.addEventListener('touchstart', function (e) { tsx = e.touches[0].clientX; }, { passive: true });
  hx.addEventListener('touchend', function (e) { if (tsx === null) return; var dx = e.changedTouches[0].clientX - tsx; if (Math.abs(dx) > 50) goHero(hi + (dx < 0 ? 1 : -1)); tsx = null; });
  setTimeout(startHero, 4000);

  /* ---------------- Visit selector ---------------- */
  var plan = { s: 'Cut & Blow-dry', w: 'this week' };
  function swapText(el, txt) { el.classList.add('is-swap'); setTimeout(function () { el.textContent = txt; el.classList.remove('is-swap'); }, 220); }
  $$('.pchip').forEach(function (c) {
    c.addEventListener('click', function () {
      $$('.pchip').forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-checked', 'false'); });
      c.classList.add('is-on'); c.setAttribute('aria-checked', 'true');
      plan.s = c.dataset.s;
      swapText($('#planSvcTxt'), c.dataset.t);
      $('#planPrice').textContent = '$' + c.dataset.p; $('#planDur').textContent = c.dataset.d;
    });
  });
  $$('.plan__when button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.plan__when button').forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-checked', 'false'); });
      b.classList.add('is-on'); b.setAttribute('aria-checked', 'true');
      plan.w = b.dataset.w; swapText($('#planWhenTxt'), b.dataset.w);
    });
  });
  $('#planGo').addEventListener('click', function () { bwSelect(plan.s, 1); goTo('#book'); });

  /* ---------------- Signature services ---------------- */
  $$('.sv-menu__item').forEach(function (m) {
    m.addEventListener('click', function () {
      $$('.sv-menu__item').forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-selected', 'false'); });
      m.classList.add('is-on'); m.setAttribute('aria-selected', 'true');
      $$('.sv-group').forEach(function (g) { g.classList.toggle('is-on', g.dataset.g === m.dataset.g); });
      if (hasGsap) ScrollTrigger.refresh();
    });
  });
  $$('.sv-card').forEach(function (card) {
    var main = $('.sv-gal__main img', card);
    function show(t) {
      if (t.classList.contains('is-on')) return;
      $$('.sv-thumb', card).forEach(function (x) { x.classList.remove('is-on'); });
      t.classList.add('is-on');
      main.classList.add('is-swap');
      var pre = new Image(); pre.src = t.dataset.src;
      setTimeout(function () { main.src = t.dataset.src; main.alt = t.dataset.alt; main.classList.remove('is-swap'); }, 220);
    }
    $$('.sv-thumb', card).forEach(function (t) {
      t.addEventListener('mouseenter', function () { show(t); });
      t.addEventListener('focus', function () { show(t); });
      t.addEventListener('click', function () { show(t); });
      var pre = new Image(); pre.src = t.dataset.src;
    });
  });
  $$('[data-service]').forEach(function (el) { el.addEventListener('click', function () { bwSelect(el.dataset.service, 1); }); });

  /* ---------------- Hair Match quiz ---------------- */
  var MATCH = {
    fresh: { n: 'Signature Cut & Blow-dry', s: 'Cut & Blow-dry', p: 'from $65', img: '3993458', w: 'A precision cut shaped around your face, texture and morning routine, finished with a bouncy blow-dry.' },
    bright: { n: 'Balayage & Lived-in Blonde', s: 'Balayage / Highlights', p: 'from $185', img: '7440132', w: 'Hand-painted brightness that grows out softly, so you can go 4–6 months between colour visits.' },
    curl: { n: 'Curl Cut & Definition', s: 'Curl Cut', p: 'from $85', img: '3065207', w: 'A curl-by-curl dry cut plus a 10-minute routine, so your curls look this good at home too.' },
    health: { n: 'Repair Ritual & Gloss', s: 'Treatment', p: 'from $45', img: '3993449', w: 'Bond-building repair, a scalp massage and a mirror-shine gloss for softer, stronger hair.' },
    event: { n: 'Bridal & Occasion Styling', s: 'Bridal / Event', p: 'from $120', img: '3065208', w: 'A trial to perfect your look, then long-lasting styling on the day, in studio or on location.' }
  };
  var answers = [], qEls = $$('.q'), bar = $('#matchBar');
  function showQ(i) { qEls.forEach(function (q, k) { q.classList.toggle('is-on', k === i); }); bar.style.width = [8, 40, 72, 100][i] + '%'; }
  $$('.q__opts button').forEach(function (b) {
    b.addEventListener('click', function () {
      var qi = +b.closest('.q').dataset.q; answers[qi] = b.dataset.v;
      if (qi < 2) return showQ(qi + 1);
      var m = MATCH[answers[0]] || MATCH.fresh;
      $('#mImg').src = PX(m.img, 400, 400); $('#mName').textContent = m.n; $('#mPrice').textContent = m.p;
      var why = m.w;
      if (answers[1] === 'low') why += ' Designed to need minimal upkeep.';
      if (answers[1] === 'high') why += ' Pair it with a gloss every 6 weeks for extra shine.';
      $('#mWhy').textContent = why;
      $('#mSlot').textContent = answers[2] === 'plan' ? 'Booking up to 8 weeks ahead' : 'Next opening: ' + nextOpenLabel();
      $('#mBook').dataset.service = m.s;
      showQ(3);
    });
  });
  $('#mBook').addEventListener('click', function () { bwSelect(this.dataset.service || 'Cut & Blow-dry', 1); });
  $('#mRestart').addEventListener('click', function () { answers = []; showQ(0); });

  /* ---------------- Before / after ---------------- */
  var CASES = [
    { b: '3993311', a: '3993469', t: '2 hrs 30 min', p: 'from $165', l: '8–10 weeks', q: '“I walked in hiding under a bun and walked out not wanting to leave the mirror.”' },
    { b: '7440125', a: '7440132', t: '1 hr 45 min', p: 'from $140', l: '10–12 weeks', q: '“Exactly the soft, expensive-looking blonde I’d been chasing for years.”' },
    { b: '3065168', a: '3065207', t: '1 hr 15 min', p: 'from $95', l: 'All night (and the next day)', q: '“My curls lasted through the whole wedding and the after-party.”' }
  ];
  var ba = $('#ba'), range = $('#baRange');
  CASES.forEach(function (c) { new Image().src = PX(c.a, 1000, 1250); new Image().src = PX(c.b, 1000, 1250); });
  range.addEventListener('input', function () { ba.style.setProperty('--p', range.value + '%'); });
  $$('.tf__tab').forEach(function (t) {
    t.addEventListener('click', function () {
      $$('.tf__tab').forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-selected', 'false'); });
      t.classList.add('is-on'); t.setAttribute('aria-selected', 'true');
      var c = CASES[+t.dataset.i]; ba.classList.add('is-swap');
      setTimeout(function () {
        $('#baAfter').src = PX(c.a, 1000, 1250); $('#baBefore').src = PX(c.b, 1000, 1250);
        $('#tfTime').textContent = c.t; $('#tfPrice').textContent = c.p; $('#tfLast').textContent = c.l; $('#tfQuote').textContent = c.q;
        range.value = 50; ba.style.setProperty('--p', '50%'); ba.classList.remove('is-swap');
      }, 400);
    });
  });

  /* ---------------- Lookbook ---------------- */
  $$('.seg--lb button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.seg--lb button').forEach(function (x) { x.classList.remove('is-on'); }); b.classList.add('is-on');
      $$('.look').forEach(function (l) { l.classList.toggle('is-dim', b.dataset.lb !== 'all' && l.dataset.lb !== b.dataset.lb); });
    });
  });

  /* custom cursor */
  var cur = $('#cursor');
  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', function (e) { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; }, { passive: true });
    $$('.look').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cur.classList.add('is-on'); });
      el.addEventListener('mouseleave', function () { cur.classList.remove('is-on'); });
    });
  }

  /* lightbox */
  var lb = $('#lightbox');
  function openLb(src, cap) { $('#lbImg').src = src; $('#lbImg').alt = cap; $('#lbCap').textContent = cap; lb.hidden = false; cur.classList.remove('is-on'); if (lenis) lenis.stop(); }
  function closeLb() { lb.hidden = true; if (lenis) lenis.start(); }
  $$('.look').forEach(function (el) {
    el.addEventListener('click', function () {
      var img = $('img', el), cap = $('figcaption b', el);
      openLb(img.src.replace(/w=\d+&h=\d+&fit=crop/, 'w=1400'), cap ? cap.textContent : img.alt);
    });
  });
  $('#lbX').addEventListener('click', closeLb);
  $('#lbBook').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  /* ---------------- GSAP scroll scenes ---------------- */
  if (hasGsap && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();
    mm.add('(min-width: 761px)', function () {
      // lookbook column parallax
      $$('.lb-col').forEach(function (c) {
        gsap.fromTo(c, { y: -(+c.dataset.speed) }, { y: +c.dataset.speed, ease: 'none', scrollTrigger: { trigger: '#lbCols', start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      // hero card subtle scale on scroll
      gsap.to('#hx', { scale: .96, ease: 'none', scrollTrigger: { trigger: '.hx', start: 'top top', end: 'bottom top', scrub: true } });
      // footer wordmark
      gsap.from('.footer__word', { yPercent: 40, opacity: 0, ease: 'power2.out', scrollTrigger: { trigger: '.footer__word', start: 'top bottom', end: 'bottom 85%', scrub: true } });
    });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
  $$('.promise').forEach(function (p, i) { p.style.setProperty('--i', i); });

  /* ---------------- Reviews ---------------- */
  var slides = $$('#rvSlides blockquote'), ri = 0, rvImg = $('#rvImg');
  $('#rvAll').textContent = ('0' + slides.length).slice(-2);
  function goRv(n) {
    ri = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('is-on', i === ri); });
    $('#rvNow').textContent = ('0' + (ri + 1)).slice(-2);
    rvImg.classList.add('is-swap');
    setTimeout(function () { rvImg.src = slides[ri].dataset.img; $('#rvChip').textContent = slides[ri].dataset.chip; rvImg.classList.remove('is-swap'); }, 300);
  }
  $('#rvPrev').addEventListener('click', function () { goRv(ri - 1); stopRv(); });
  $('#rvNext').addEventListener('click', function () { goRv(ri + 1); stopRv(); });
  var rvTimer = setInterval(function () { goRv(ri + 1); }, 7000);
  function stopRv() { clearInterval(rvTimer); }

  /* ---------------- Opening hours ---------------- */
  var HOURS = { 0: null, 1: null, 2: [9.5, 18], 3: [9.5, 18], 4: [10, 20], 5: [9.5, 19], 6: [9, 16] };
  var DN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var fmt = function (h) { var hh = Math.floor(h), m = h % 1 ? ':30' : ''; return (hh > 12 ? hh - 12 : hh) + m + (hh >= 12 ? ' pm' : ' am'); };
  var now = new Date(), d = now.getDay(), hr = now.getHours() + now.getMinutes() / 60, today = HOURS[d];
  var open = today && hr >= today[0] && hr < today[1];
  var st = $('#status'), on = $('#openNow');
  st.textContent = open ? 'Open now' : 'Closed now'; st.classList.toggle('is-closed', !open);
  on.textContent = open ? 'Open today until ' + fmt(today[1]) : (today && hr < today[0] ? 'Opens today at ' + fmt(today[0]) : 'Closed now · book online 24/7');
  on.classList.toggle('is-closed', !open);
  $$('#hours li').forEach(function (li) { if (+li.dataset.d === d || (d === 1 && li.dataset.d === '0')) li.classList.add('is-today'); });
  function nextOpenLabel() {
    var t = new Date(); t.setDate(t.getDate() + 1);
    while (!HOURS[t.getDay()]) t.setDate(t.getDate() + 1);
    return DN[t.getDay()] + ' ' + t.getDate() + ' ' + MN[t.getMonth()] + ', 11:00 am';
  }

  /* ---------------- Booking widget ---------------- */
  var step = 0, sel = { s: '', p: null, day: '', time: '' };
  var panels = $$('.bw__panel'), stepsEls = $$('.bw__steps li'), nextBtn = $('#bwNext'), backBtn = $('#bwBack'), err = $('#bwErr');
  var daysWrap = $('#bwDays'), timesWrap = $('#bwTimes');
  var t = new Date(), made = 0;
  while (made < 7) {
    t.setDate(t.getDate() + 1);
    if (!HOURS[t.getDay()]) continue;
    var b = document.createElement('button'); b.type = 'button';
    b.dataset.label = DN[t.getDay()] + ' ' + t.getDate() + ' ' + MN[t.getMonth()];
    b.dataset.dow = t.getDay();
    b.innerHTML = '<small>' + DN[t.getDay()] + '</small><b>' + t.getDate() + '</b>';
    daysWrap.appendChild(b); made++;
  }
  function renderTimes(dow) {
    var h = HOURS[dow], out = '', seed = dow * 7;
    for (var x = h[0]; x <= h[1] - 1; x += 1.5) {
      seed = (seed * 9301 + 49297) % 233280;
      var r = seed / 233280, taken = r < .3, hot = !taken && r > .85;
      out += '<button type="button"' + (taken ? ' disabled' : '') + (hot ? ' class="hot"' : '') + '>' + fmt(x) + '</button>';
    }
    timesWrap.innerHTML = out;
  }
  renderTimes(+daysWrap.firstChild.dataset.dow);
  daysWrap.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    $$('button', daysWrap).forEach(function (x) { x.classList.remove('is-on'); }); b.classList.add('is-on');
    sel.day = b.dataset.label; sel.time = ''; renderTimes(+b.dataset.dow); summary();
  });
  timesWrap.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    $$('button', timesWrap).forEach(function (x) { x.classList.remove('is-on'); }); b.classList.add('is-on');
    sel.time = b.textContent; summary();
  });
  $('#bwSvcs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; bwSelect(b.dataset.s, null);
  });
  function bwSelect(name, goStep) {
    name = (name || '').replace(/&amp;/g, '&');
    var btn = $$('#bwSvcs button').filter(function (b) { return b.dataset.s.replace(/&amp;/g, '&') === name; })[0];
    if (!btn) return;
    $$('#bwSvcs button').forEach(function (x) { x.classList.remove('is-on'); }); btn.classList.add('is-on');
    sel.s = name; sel.p = +btn.dataset.p; summary();
    if (goStep != null && step < goStep && step !== 3) show(goStep);
  }
  window.bwSelect = bwSelect;
  function summary() {
    $('#sumSvc').textContent = sel.s || 'Not chosen';
    $('#sumWhen').textContent = sel.day ? sel.day + (sel.time ? ', ' + sel.time : '') : '-';
    $('#sumPrice').textContent = sel.p == null ? '-' : sel.p === 0 ? 'Free' : '$' + sel.p;
    err.textContent = '';
  }
  function show(n) {
    step = n;
    panels.forEach(function (p, i) { p.classList.toggle('is-on', i === n); });
    stepsEls.forEach(function (s, i) { s.classList.toggle('is-on', i === n); s.classList.toggle('is-done', i < n); });
    backBtn.hidden = n === 0 || n === 3;
    nextBtn.style.display = n === 3 ? 'none' : '';
    nextBtn.innerHTML = n === 2 ? 'Request my appointment <span class="btn__arrow">→</span>' : 'Continue <span class="btn__arrow">→</span>';
    $('#bwSummary').style.display = n === 3 ? 'none' : '';
  }
  nextBtn.addEventListener('click', function () {
    if (step === 0 && !sel.s) { err.textContent = 'Pick a service to continue (or choose the free consultation).'; return; }
    if (step === 1 && (!sel.day || !sel.time)) { err.textContent = 'Choose a day and an available time.'; return; }
    if (step === 2) {
      var nm = $('#bwName').value.trim(), ph = $('#bwPhone').value.trim();
      if (!nm || ph.replace(/\D/g, '').length < 7) { err.textContent = 'Please add your first name and a valid mobile number.'; return; }
      $('#bwDoneText').textContent = 'Thanks ' + nm + '! ' + sel.s + ' on ' + sel.day + ' at ' + sel.time + ' is held for you. We\'ll text ' + ph + ' to confirm within the hour.';
    }
    err.textContent = ''; show(step + 1);
  });
  backBtn.addEventListener('click', function () { show(Math.max(0, step - 1)); });

  /* live-ish urgency */
  var v = $('#viewers');
  setInterval(function () { v.textContent = (4 + Math.floor(Math.random() * 6)) + ' people'; }, 8000);

  /* newsletter + year */
  $('#news').addEventListener('submit', function (e) { e.preventDefault(); $('#newsMsg').textContent = 'You\'re on the list 💜 Watch for last-minute openings.'; this.reset(); });
  $('#yr').textContent = new Date().getFullYear();
})();
