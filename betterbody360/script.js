/* BetterBody360 · Home + Brand Partner interactions */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var G = !!(window.gsap && window.ScrollTrigger) && !reduce;
  var notesMode = new URLSearchParams(location.search).get('notes') === '1';
  if (G) gsap.registerPlugin(ScrollTrigger);

  /* Smooth scroll */
  var lenis = null;
  if (window.Lenis && fine && !reduce) {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    if (G) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else (function f(t) { lenis.raf(t); requestAnimationFrame(f); })(0);
  }
  function go(el) { if (!el) return; if (lenis) lenis.scrollTo(el, { offset: -80 }); else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var el = document.querySelector(id); if (!el) return;
    e.preventDefault(); closeMenu(); closeDrops();
    if (a.dataset.cat) filter(a.dataset.cat);
    go(el);
  });

  /* Header */
  var hdr = $('#hdr'), lastY = 0, sticky = $('#sticky');
  function closeDrops(ex) { $$('.nav__i.is-o').forEach(function (i) { if (i !== ex) { i.classList.remove('is-o'); $('.nav__b', i).setAttribute('aria-expanded', 'false'); } }); }
  $$('.nav__b').forEach(function (b) {
    b.addEventListener('click', function (e) { e.stopPropagation(); var i = b.parentElement, o = !i.classList.contains('is-o'); closeDrops(i); i.classList.toggle('is-o', o); b.setAttribute('aria-expanded', String(o)); });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.nav__i')) closeDrops(); });
  var burger = $('.burger'), mnav = $('#mnav');
  function closeMenu() { if (!mnav || mnav.hidden) return; mnav.hidden = true; burger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); if (lenis) lenis.start(); }
  burger.addEventListener('click', function () {
    if (!mnav.hidden) { closeMenu(); return; }
    mnav.hidden = false; burger.setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-open'); hdr.classList.remove('is-h'); if (lenis) lenis.stop();
    if (G) gsap.fromTo('.mnav > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, stagger: .05, ease: 'power3.out' });
  });
  function onScroll() {
    var y = scrollY;
    hdr.classList.toggle('is-s', y > 10);
    if (!document.body.classList.contains('menu-open')) {
      if (y > 700 && y > lastY + 6) { hdr.classList.add('is-h'); closeDrops(); }
      else if (y < lastY - 6 || y < 700) hdr.classList.remove('is-h');
    }
    lastY = y;
    if (sticky) sticky.classList.toggle('is-on', y > innerHeight * .9 && y < document.body.scrollHeight - innerHeight * 1.8);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); closeDrops(); } });

  /* Split headings into masked words */
  $$('[data-split]').forEach(function (h) {
    function wrap(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var o = document.createElement('span'); o.className = 'wm';
            var i = document.createElement('span'); i.className = 'wi'; i.textContent = p;
            o.appendChild(i); frag.appendChild(o);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) wrap(n);
      });
    }
    wrap(h);
  });

  /* Animations */
  if (G) {
    // hero headline on load
    var heroH = $('.hhero h1, .bphero h1, .h4 h1, .ch h1');
    $$('[data-split]').forEach(function (h) {
      var ws = $$('.wi', h);
      gsap.set(ws, { yPercent: 110 });
      var cfg = { yPercent: 0, duration: 1.1, stagger: .045, ease: 'power4.out' };
      if (h === heroH) gsap.to(ws, Object.assign(cfg, { delay: .15 }));
      else gsap.to(ws, Object.assign(cfg, { scrollTrigger: { trigger: h, start: 'top 88%', once: true } }));
    });
    // fade up blocks
    gsap.set('[data-reveal]', { opacity: 0, y: 34 });
    ScrollTrigger.batch('[data-reveal]', { start: 'top 92%', once: true, onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: .08, ease: 'power3.out', clearProps: 'transform' }); } });
    // image cards clip-reveal (hims-style)
    $$('[data-clip]').forEach(function (c) {
      var img = $('img', c);
      gsap.fromTo(c, { clipPath: 'inset(12% 6% 12% 6% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.5, ease: 'power3.inOut', scrollTrigger: { trigger: c, start: 'top 90%', once: true }, onComplete: function () { c.style.clipPath = ''; } });
      if (img) gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 90%', once: true }, clearProps: 'transform' });
    });
    // parallax backgrounds
    $$('[data-parallax]').forEach(function (p) {
      gsap.fromTo(p, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: p.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // statement / bp hero: subtle scale while scrolling
    $$('.statement, .final').forEach(function (s) {
      gsap.fromTo(s, { scale: .96 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'top 40%', scrub: true } });
    });
    addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* Counters */
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      var el = e.target, to = +el.dataset.count;
      if (!G) { el.textContent = to; return; }
      var o = { v: 0 }; gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
  }, { threshold: .5 });
  $$('[data-count]').forEach(function (el) { cio.observe(el); });

  /* Products rail + filters (home) */
  var rail = $('#rail'), bar = $('#railBar');
  function railProg() {
    if (!rail) return;
    var max = rail.scrollWidth - rail.clientWidth, vis = rail.clientWidth / rail.scrollWidth;
    bar.style.width = Math.min(100, vis * 100) + '%';
    bar.style.transform = 'translateX(' + (max > 0 ? rail.scrollLeft / max * (1 / vis - 1) * 100 : 0) + '%)';
  }
  function filter(f) {
    var grid = $('#pgrid4');
    if (grid) {
      $$('.chip').forEach(function (c) { c.classList.toggle('is-on', c.dataset.f === f); });
      var vis = [];
      $$('.pk', grid).forEach(function (p) { var ok = f === 'all' || p.dataset.cat.split(' ').indexOf(f) > -1; p.classList.toggle('is-x', !ok); if (ok) vis.push(p); });
      if (G) { gsap.fromTo(vis, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .6, stagger: .05, ease: 'power3.out', clearProps: 'all' }); ScrollTrigger.refresh(); }
      return;
    }
    if (!rail) return;
    $$('.chip').forEach(function (c) { c.classList.toggle('is-on', c.dataset.f === f); });
    var shown = [];
    $$('.pc', rail).forEach(function (p) { var ok = f === 'all' || p.dataset.cat.split(' ').indexOf(f) > -1; p.classList.toggle('is-x', !ok); if (ok) shown.push(p); });
    rail.scrollTo({ left: 0 }); railProg();
    if (G) gsap.fromTo(shown, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: .7, stagger: .06, ease: 'power3.out', clearProps: 'all' });
  }
  if (rail) {
    rail.addEventListener('scroll', railProg, { passive: true }); addEventListener('resize', railProg); railProg();
    $$('.chip').forEach(function (c) { c.addEventListener('click', function () { filter(c.dataset.f); }); });
    var step = function (d) { var c = $('.pc:not(.is-x)', rail); rail.scrollBy({ left: d * ((c ? c.offsetWidth : 300) + 18) * 2, behavior: 'smooth' }); };
    $('#rPrev').addEventListener('click', function () { step(-1); });
    $('#rNext').addEventListener('click', function () { step(1); });
  }

  /* Product grid chips (home rev 4) */
  if ($('#pgrid4')) $$('.chip').forEach(function (c) { c.addEventListener('click', function () { filter(c.dataset.f); }); });

  /* Home hero: slideshow synced with the three pillars */
  var show = $('#show'), pills = $$('#pillars button');
  if (show && pills.length) {
    var SH = [['Products', 'GLP-1s, hormones, peptides and supplements'], ['Personalized Coaching', 'A personal coach and a monthly plan'], ['Coaching360 Health App', 'All of your health in one place']];
    var slides = $$('.show__i', show), si = 0, sTimer;
    var setS = function (i) {
      si = (i + slides.length) % slides.length;
      slides.forEach(function (s, j) { s.classList.toggle('is-on', j === si); });
      pills.forEach(function (b, j) { b.classList.remove('is-on'); if (j === si) { void b.offsetWidth; b.classList.add('is-on'); } });
      $('#sK').textContent = SH[si][0]; $('#sT').textContent = SH[si][1];
    };
    var autoS = function () { clearInterval(sTimer); if (!reduce) sTimer = setInterval(function () { setS(si + 1); }, 5500); };
    pills.forEach(function (b, j) { b.addEventListener('click', function () { setS(j); autoS(); }); });
    autoS();
  }

  /* Goal rows: cursor-follow photo preview */
  var peek = $('#peek');
  if (peek && fine) {
    var pimgs = $$('img', peek), px = 0, py = 0, cx = 0, cy = 0, praf = null;
    var ploop = function () { cx += (px - cx) * .14; cy += (py - cy) * .14; peek.style.left = cx + 'px'; peek.style.top = cy + 'px'; praf = requestAnimationFrame(ploop); };
    $$('.grow').forEach(function (r) {
      r.addEventListener('mouseenter', function (e) { pimgs.forEach(function (im, j) { im.classList.toggle('is-on', j === +r.dataset.img); }); if (!peek.classList.contains('is-on')) { cx = px = e.clientX + 170; cy = py = e.clientY; } peek.classList.add('is-on'); if (!praf) ploop(); });
      r.addEventListener('mousemove', function (e) { px = e.clientX + 170; py = e.clientY; });
    });
    $('#glist').addEventListener('mouseleave', function () { peek.classList.remove('is-on'); cancelAnimationFrame(praf); praf = null; });
  }

  /* Program toggle */
  var seg = $('.seg');
  if (seg) {
    var sb = $$('button', seg), sInk = $('i', seg);
    var PG = [{ n: 'Weight Loss Program', p: 299 }, { n: 'Guaranteed Weight Loss Program', p: 499 }];
    var mvS = function (b) { sInk.style.width = b.offsetWidth + 'px'; sInk.style.transform = 'translateX(' + (b.offsetLeft - 5) + 'px)'; };
    var setPg = function (i) {
      sb.forEach(function (b, j) { b.classList.toggle('is-on', j === i); b.setAttribute('aria-selected', String(j === i)); });
      mvS(sb[i]); $('#pName').textContent = PG[i].n;
      var el = $('#pPrice'), from = +el.textContent.replace(/\D/g, '');
      if (G) { var o = { v: from }; gsap.to(o, { v: PG[i].p, duration: .9, ease: 'power3.out', onUpdate: function () { el.textContent = '$' + Math.round(o.v); } }); } else el.textContent = '$' + PG[i].p;
      $$('#pFeat span[data-a]').forEach(function (s) { s.textContent = i ? s.dataset.b : s.dataset.a; });
      var g = $('#pFeat [data-g]'); if (g) g.classList.toggle('off', !i);
    };
    sb.forEach(function (b, j) { b.addEventListener('click', function () { setPg(j); }); });
    addEventListener('resize', function () { mvS($('button.is-on', seg)); }); addEventListener('load', function () { mvS($('button.is-on', seg)); });
    mvS(sb[0]);
  }

  /* Newsletter */
  $$('.js-news').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var inp = $('input', f);
      if (!inp.value || inp.value.indexOf('@') < 1) { inp.focus(); inp.setAttribute('placeholder', 'Please enter a valid email'); return; }
      f.innerHTML = '<p class="ok">Thank you. You’re subscribed.</p>';
    });
  });

  /* Coaching360 steps: photo + caption follow scroll */
  var csteps = $$('.cstep'), cimgs = $$('#cMedia img'), cdots = $$('.coach__dots i');
  if (csteps.length) {
    var setC = function (i) {
      csteps.forEach(function (s, j) { s.classList.toggle('is-on', j === i); });
      cimgs.forEach(function (m, j) { m.classList.toggle('is-on', j === i); });
      cdots.forEach(function (d, j) { d.classList.toggle('is-on', j === i); });
      $('#cCap').textContent = $('h3', csteps[i]).textContent;
    };
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) setC(+e.target.dataset.i); }); }, { rootMargin: '-45% 0px -45% 0px' });
    csteps.forEach(function (s) { io.observe(s); s.addEventListener('click', function () { setC(+s.dataset.i); }); });
  }

  /* Testimonial slider with photos */
  var tsEl = $('#ts');
  if (tsEl) {
    var tss = $$('.ts__s', tsEl), tsd = $$('#tsDots button'), tsi = 0, tst;
    var showTs = function (i) { tsi = (i + tss.length) % tss.length; tss.forEach(function (s, j) { s.classList.toggle('is-on', j === tsi); }); tsd.forEach(function (d, j) { d.classList.toggle('is-on', j === tsi); }); };
    var autoTs = function () { clearInterval(tst); if (!reduce) tst = setInterval(function () { showTs(tsi + 1); }, 7000); };
    $('#tsPrev').addEventListener('click', function () { showTs(tsi - 1); autoTs(); });
    $('#tsNext').addEventListener('click', function () { showTs(tsi + 1); autoTs(); });
    tsd.forEach(function (d, j) { d.addEventListener('click', function () { showTs(j); autoTs(); }); });
    tsEl.addEventListener('mouseenter', function () { clearInterval(tst); });
    tsEl.addEventListener('mouseleave', autoTs);
    autoTs();
  }

  /* Testimonials */
  var tq = $$('#tq figure'), td = $$('#tdots button'), ti = 0, tt;
  if (tq.length) {
    var showT = function (i) { ti = (i + tq.length) % tq.length; tq.forEach(function (f, j) { f.classList.toggle('is-on', j === ti); }); td.forEach(function (d, j) { d.classList.toggle('is-on', j === ti); }); };
    var auto = function () { clearInterval(tt); if (!reduce) tt = setInterval(function () { showT(ti + 1); }, 6000); };
    td.forEach(function (d, j) { d.addEventListener('click', function () { showT(j); auto(); }); });
    auto();
  }

  /* Brand Partner: four ways → browser preview */
  var ways = $$('.way'), br = $('#browser');
  if (ways.length && br) {
    var setW = function (w) {
      ways.forEach(function (x) { x.classList.toggle('is-on', x === w); });
      br.dataset.mode = w.dataset.mode;
      $('#bUrl').textContent = w.dataset.url;
      $('#bLogo').innerHTML = w.dataset.logo;
      if (G) gsap.fromTo('#browser .site__hero, #browser .site__prods > *', { opacity: .3, y: 8 }, { opacity: 1, y: 0, duration: .6, stagger: .04, ease: 'power3.out' });
    };
    ways.forEach(function (w) { w.addEventListener('click', function () { setW(w); }); });
  }

  /* Brand Partner: "everything you need" carousel */
  var pT = $('#plsTrack');
  if (pT) {
    var pDots = $('#plsDots'), pItems = $$('.pl', pT), pTimer;
    var perView = function () { return Math.max(1, Math.round(pT.clientWidth / pItems[0].offsetWidth)); };
    var pages = function () { return Math.max(1, pItems.length - perView() + 1); };
    var cur = function () { return Math.round(pT.scrollLeft / pItems[0].offsetWidth); };
    var buildDots = function () {
      pDots.innerHTML = '';
      for (var i = 0; i < pages(); i++) { var b = document.createElement('button'); b.setAttribute('aria-label', 'Slide ' + (i + 1)); (function (i) { b.addEventListener('click', function () { goP(i); autoP(); }); })(i); pDots.appendChild(b); }
      syncDots();
    };
    var syncDots = function () { var c = Math.min(cur(), pages() - 1); $$('button', pDots).forEach(function (d, j) { d.classList.toggle('is-on', j === c); }); };
    var goP = function (i) { var n = pages(); i = (i + n) % n; pT.scrollTo({ left: i * pItems[0].offsetWidth, behavior: 'smooth' }); };
    var autoP = function () { clearInterval(pTimer); if (!reduce) pTimer = setInterval(function () { goP(cur() + 1); }, 3500); };
    $('#plsPrev').addEventListener('click', function () { goP(cur() - 1); autoP(); });
    $('#plsNext').addEventListener('click', function () { goP(cur() + 1); autoP(); });
    pT.addEventListener('scroll', function () { syncDots(); }, { passive: true });
    pT.addEventListener('mouseenter', function () { clearInterval(pTimer); });
    pT.addEventListener('mouseleave', autoP);
    addEventListener('resize', buildDots);
    buildDots(); autoP();
  }

  /* Brand Partner: calculator */
  var cN = $('#cN'), cA = $('#cA');
  if (cN && cA) {
    var fmt = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
    var calc = function () {
      var n = +cN.value, a = +cA.value, m = n * a * .2;
      $('#cNo').textContent = n; $('#cAo').textContent = fmt(a);
      var net = cN.closest('.calc3') ? ' · ' + fmt(Math.max(0, m - 99)) + '/mo after the $99 monthly fee' : '';
      $('#cOut').textContent = fmt(m); $('#cYr').textContent = '≈ ' + fmt(m * 12) + ' per year' + net;
      cN.style.setProperty('--p', ((n - 1) / 199 * 100) + '%');
      cA.style.setProperty('--p', ((a - +cA.min) / (+cA.max - +cA.min) * 100) + '%');
    };
    cN.addEventListener('input', calc); cA.addEventListener('input', calc); calc();
  }

  /* Design notes (?notes=1) */
  var nd = $('#notesData');
  if (notesMode && nd) {
    var NOTES = JSON.parse(nd.textContent), nt = $('#notesT'), np = $('#notes'), nl = $('#notesL');
    nt.hidden = false;
    Object.keys(NOTES).forEach(function (k) {
      var li = document.createElement('li');
      li.innerHTML = '<b><i>' + k + '</i>' + NOTES[k][0] + '</b><p>' + NOTES[k][1] + '</p>';
      li.addEventListener('click', function () { if (innerWidth < 900) np.hidden = true; go($('[data-note="' + k + '"]')); });
      nl.appendChild(li);
    });
    $$('[data-note]').forEach(function (s) {
      var p = document.createElement('button'); p.className = 'pin'; p.textContent = s.dataset.note; p.setAttribute('aria-label', 'Design note ' + s.dataset.note);
      p.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); np.hidden = false; var it = nl.children[+s.dataset.note - 1]; if (it) it.scrollIntoView({ block: 'center' }); });
      s.appendChild(p);
    });
    nt.addEventListener('click', function () { np.hidden = !np.hidden; });
    $('#notesX').addEventListener('click', function () { np.hidden = true; });
  }
})();
