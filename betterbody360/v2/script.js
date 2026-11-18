/* BetterBody360 · Version 2 interactions */
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
    lenis = new Lenis({ duration: 1.2, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    if (G) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else (function f(t) { lenis.raf(t); requestAnimationFrame(f); })(0);
  }
  function go(el) { if (!el) return; if (lenis) lenis.scrollTo(el, { offset: -70 }); else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var el = document.querySelector(id); if (!el) return;
    e.preventDefault(); closeMenu();
    if (a.dataset.cat) highlight(a.dataset.cat);
    go(el);
  });

  /* Header */
  var hd = $('#hd'), lastY = 0, stk = $('#stk');
  function onScroll() {
    var y = scrollY;
    hd.classList.toggle('is-s', y > 20);
    if (!document.body.classList.contains('lock')) {
      if (y > 700 && y > lastY + 6) hd.classList.add('is-h');
      else if (y < lastY - 6 || y < 700) hd.classList.remove('is-h');
    }
    lastY = y;
    if (stk) stk.classList.toggle('is-on', y > innerHeight * .9 && y < document.body.scrollHeight - innerHeight * 1.8);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var bg = $('.bg'), mm = $('#mm');
  function closeMenu() { if (!mm || mm.hidden) return; mm.hidden = true; bg.setAttribute('aria-expanded', 'false'); document.body.classList.remove('lock'); if (lenis) lenis.start(); }
  bg.addEventListener('click', function () {
    if (!mm.hidden) { closeMenu(); return; }
    mm.hidden = false; bg.setAttribute('aria-expanded', 'true'); document.body.classList.add('lock'); hd.classList.remove('is-h'); if (lenis) lenis.stop();
    if (G) gsap.fromTo('.mm nav a, .mm > a', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .7, stagger: .05, ease: 'power4.out' });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* Split words */
  $$('[data-split]').forEach(function (h) {
    (function wrap(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var f = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { f.appendChild(document.createTextNode(' ')); return; }
            var o = document.createElement('span'); o.className = 'wm';
            var i = document.createElement('span'); i.className = 'wi'; i.textContent = p;
            o.appendChild(i); f.appendChild(o);
          });
          n.parentNode.replaceChild(f, n);
        } else if (n.nodeType === 1) wrap(n);
      });
    })(h);
  });

  /* Core animations */
  if (G) {
    var h1 = $('h1[data-split]');
    $$('[data-split]').forEach(function (h) {
      var ws = $$('.wi', h);
      gsap.set(ws, { yPercent: 115, rotate: 4 });
      var c = { yPercent: 0, rotate: 0, duration: 1.3, stagger: .05, ease: 'power4.out' };
      if (h === h1) gsap.to(ws, Object.assign(c, { delay: .2 }));
      else gsap.to(ws, Object.assign(c, { scrollTrigger: { trigger: h, start: 'top 88%', once: true } }));
    });
    gsap.set('[data-r]', { opacity: 0, y: 40 });
    ScrollTrigger.batch('[data-r]', { start: 'top 92%', once: true, onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1.2, stagger: .09, ease: 'power3.out', clearProps: 'transform' }); } });
    $$('[data-clip]').forEach(function (c) {
      gsap.fromTo(c, { clipPath: 'inset(15% 10% 15% 10% round 40px)' }, { clipPath: 'inset(0% 0% 0% 0% round 40px)', duration: 1.6, ease: 'power3.inOut', delay: c.closest('.bh') ? .3 : 0, scrollTrigger: { trigger: c, start: 'top 90%', once: true } });
      var im = $('img', c); if (im) gsap.fromTo(im, { scale: 1.3 }, { scale: 1, duration: 2, ease: 'power3.out', delay: c.closest('.bh') ? .3 : 0, scrollTrigger: { trigger: c, start: 'top 90%', once: true } });
    });
    $$('[data-par]').forEach(function (im) {
      gsap.fromTo(im, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.panel').forEach(function (p) {
      gsap.fromTo(p, { borderRadius: '90px' }, { borderRadius: '48px', ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'top 40%', scrub: true } });
    });
    addEventListener('load', function () { ScrollTrigger.refresh(); });
    var refreshTimer;
    $$('img[loading="lazy"]').forEach(function (im) { if (!im.complete) im.addEventListener('load', function () { clearTimeout(refreshTimer); refreshTimer = setTimeout(function () { ScrollTrigger.refresh(); }, 250); }); });
  }

  /* Counters */
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      var el = e.target, to = +el.dataset.c;
      if (!G) { el.textContent = to; return; }
      var o = { v: 0 }; gsap.to(o, { v: to, duration: 2, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
  }, { threshold: .5 });
  $$('[data-c]').forEach(function (el) { cio.observe(el); });

  /* Hero slideshow */
  var show = $('#show');
  if (show) {
    var sl = $$('.show__i', show), bars = $$('.show__bars button', show), si = 0, st;
    var setS = function (i) {
      var prev = si; si = (i + sl.length) % sl.length;
      sl.forEach(function (s, j) { s.classList.remove('is-out'); if (j === prev && j !== si) s.classList.add('is-out'); s.classList.toggle('is-on', j === si); });
      setTimeout(function () { sl[prev] && prev !== si && sl[prev].classList.remove('is-out'); }, 1300);
      bars.forEach(function (b, j) { b.classList.remove('is-on'); b.classList.toggle('is-done', j < si); if (j === si) { void b.offsetWidth; b.classList.add('is-on'); } });
      var d = sl[si].dataset;
      $('#sLbl').textContent = d.label; $('#sTtl').innerHTML = d.title;
      var go_ = $('#sGo'); go_.setAttribute('href', d.href); if (d.cat) go_.dataset.cat = d.cat; else delete go_.dataset.cat;
      if (G) gsap.fromTo('.show__lbl > div > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .8, stagger: .06, ease: 'power3.out' });
    };
    var auto = function () { clearInterval(st); if (!reduce) st = setInterval(function () { setS(si + 1); }, 5000); };
    bars.forEach(function (b, j) { b.addEventListener('click', function () { if (j !== si) setS(j); auto(); }); });
    bars[0].classList.add('is-on'); auto();
  }

  /* Goal rows: cursor-follow preview */
  var peek = $('#peek');
  if (peek && fine) {
    var pimgs = $$('img', peek), px = 0, py = 0, cx = 0, cy = 0, raf;
    var loop = function () { cx += (px - cx) * .14; cy += (py - cy) * .14; peek.style.left = cx + 'px'; peek.style.top = cy + 'px'; raf = requestAnimationFrame(loop); };
    $$('.grow').forEach(function (r) {
      r.addEventListener('mouseenter', function (e) { pimgs.forEach(function (im, j) { im.classList.toggle('is-on', j === +r.dataset.img); }); if (!peek.classList.contains('is-on')) { cx = px = e.clientX; cy = py = e.clientY; } peek.classList.add('is-on'); if (!raf) loop(); });
      r.addEventListener('mousemove', function (e) { px = e.clientX + 170; py = e.clientY; });
    });
    $('#glist').addEventListener('mouseleave', function () { peek.classList.remove('is-on'); cancelAnimationFrame(raf); raf = null; });
  }

  /* Products: pinned horizontal scroll (desktop) */
  var track = $('#track'), pinEl = $('#pin');
  function highlight(cat) {
    if (!track) return;
    $$('.pk', track).forEach(function (p) {
      if (!p.dataset.cat) return;
      var ok = p.dataset.cat.split(' ').indexOf(cat) > -1;
      p.classList.toggle('dim', !ok); p.classList.toggle('hl', ok);
    });
    clearTimeout(highlight.t); highlight.t = setTimeout(function () { $$('.pk', track).forEach(function (p) { p.classList.remove('dim', 'hl'); }); }, 6000);
  }
  if (track && G) {
    ScrollTrigger.matchMedia({
      '(min-width: 961px)': function () {
        var dist = function () { return Math.max(0, track.scrollWidth - innerWidth + 80); };
        var tw = gsap.to(track, { x: function () { return -dist(); }, ease: 'none',
          scrollTrigger: { trigger: pinEl, start: 'top top+=40', end: function () { return '+=' + dist(); }, pin: true, scrub: .6, invalidateOnRefresh: true,
            onUpdate: function (s) { var pr = $('#tProg'); if (pr) pr.style.transform = 'scaleX(' + s.progress + ')'; } } });
        return function () { tw.kill(); gsap.set(track, { x: 0 }); };
      }
    });
  }

  /* Coaching stacking cards: scale down cards beneath */
  var cards = $$('.sc');
  if (cards.length && G) {
    cards.forEach(function (c, i) {
      if (i === cards.length - 1) return;
      gsap.to(c, { scale: .95 - (cards.length - i) * .005, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top 85%', end: 'top 200px', scrub: true } });
    });
  }

  /* Program toggle */
  var seg = $('.seg');
  if (seg) {
    var sb = $$('button', seg), ink = $('i', seg);
    var P = [{ n: 'Weight Loss Program', p: 299 }, { n: 'Guaranteed Weight Loss Program', p: 499 }];
    var mv = function (b) { ink.style.width = b.offsetWidth + 'px'; ink.style.transform = 'translateX(' + (b.offsetLeft - 5) + 'px)'; };
    var setP = function (i) {
      sb.forEach(function (b, j) { b.classList.toggle('is-on', j === i); b.setAttribute('aria-selected', String(j === i)); });
      mv(sb[i]);
      $('#pName').textContent = P[i].n;
      var el = $('#pPrice'), from = +el.textContent.replace(/\D/g, '');
      if (G) { var o = { v: from }; gsap.to(o, { v: P[i].p, duration: .9, ease: 'power3.out', onUpdate: function () { el.textContent = '$' + Math.round(o.v); } }); }
      else el.textContent = '$' + P[i].p;
      $$('#pFeat span[data-a]').forEach(function (s) { s.textContent = i ? s.dataset.b : s.dataset.a; });
      var g = $('#pFeat [data-g]'); if (g) g.classList.toggle('off', !i);
      if (G) gsap.fromTo('#pFeat li', { opacity: .3, x: 10 }, { opacity: 1, x: 0, duration: .5, stagger: .03, ease: 'power3.out', clearProps: 'all' });
    };
    sb.forEach(function (b, j) { b.addEventListener('click', function () { setP(j); }); });
    addEventListener('resize', function () { mv($('button.is-on', seg)); }); addEventListener('load', function () { mv($('button.is-on', seg)); });
    mv(sb[0]);
  }

  /* Quotes */
  var qs = $$('#qs blockquote'), qa = $$('#qa button'), qi = 0, qt;
  if (qs.length) {
    var setQ = function (i) { qi = i % qs.length; qs.forEach(function (q, j) { q.classList.toggle('is-on', j === qi); }); qa.forEach(function (b, j) { b.classList.toggle('is-on', j === qi); }); };
    var aq = function () { clearInterval(qt); if (!reduce) qt = setInterval(function () { setQ(qi + 1); }, 6500); };
    qa.forEach(function (b, j) { b.addEventListener('click', function () { setQ(j); aq(); }); }); aq();
  }

  /* BP: statement words */
  var say = $('#say');
  if (say) {
    say.innerHTML = say.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    var ws = $$('.w', say);
    if (G) ScrollTrigger.create({ trigger: say, start: 'top 80%', end: 'bottom 50%', scrub: true, onUpdate: function (s) { var n = Math.round(s.progress * ws.length); ws.forEach(function (w, i) { w.classList.toggle('on', i < n); }); } });
    else ws.forEach(function (w) { w.classList.add('on'); });
  }
  /* BP: handle rows light up */
  var hrs = $$('.hr');
  if (hrs.length) {
    if (G) ScrollTrigger.create({ trigger: '#hrs', start: 'top 75%', end: 'bottom 55%', scrub: true, onUpdate: function (s) { var n = Math.ceil(s.progress * hrs.length); hrs.forEach(function (h, i) { h.classList.toggle('on', i < Math.max(1, n)); }); } });
    else hrs.forEach(function (h) { h.classList.add('on'); });
  }
  /* BP: four ways tabs */
  var tabs = $('.tabs');
  if (tabs) {
    var tb = $$('button', tabs), tink = $('i', tabs), txt = $$('.wp__t > div'), br = $('#br');
    var W = [['code', 'betterbody360.com/checkout', 'BetterBody360'], ['site', 'jenny.betterbody360.com', 'Jenny · BetterBody360'], ['page', 'yourwebsite.com/wellness', 'Your Website'], ['site', 'renewwellness.com', 'Renew Aesthetics &amp; Wellness']];
    var mt = function (b) { tink.style.width = b.offsetWidth + 'px'; tink.style.transform = 'translateX(' + (b.offsetLeft - 6) + 'px)'; };
    var setW = function (i) {
      tb.forEach(function (b, j) { b.classList.toggle('is-on', j === i); b.setAttribute('aria-selected', String(j === i)); });
      txt.forEach(function (t, j) { t.classList.toggle('is-on', j === i); });
      mt(tb[i]); br.dataset.mode = W[i][0]; $('#brU').textContent = W[i][1]; $('#brL').innerHTML = W[i][2];
      if (G) gsap.fromTo('#br .st__h, #br .st__p > *', { opacity: .2, y: 10 }, { opacity: 1, y: 0, duration: .6, stagger: .04, ease: 'power3.out' });
    };
    tb.forEach(function (b, j) { b.addEventListener('click', function () { setW(j); b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }); });
    addEventListener('resize', function () { mt($('button.is-on', tabs)); }); addEventListener('load', function () { mt($('button.is-on', tabs)); });
    mt(tb[0]);
  }
  /* BP: timeline fill */
  var tlI = $('#tlI');
  if (tlI) {
    var vert = function () { return innerWidth <= 960; };
    if (G) ScrollTrigger.create({ trigger: '#tl', start: 'top 75%', end: 'bottom 60%', scrub: true, onUpdate: function (s) { tlI.style.transform = (vert() ? 'scaleY(' : 'scaleX(') + s.progress + ')'; } });
    else tlI.style.transform = 'none';
  }
  /* BP: calculator */
  var cN = $('#cN'), cA = $('#cA');
  if (cN && cA) {
    var fmt = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
    var calc = function () {
      var n = +cN.value, a = +cA.value, m = n * a * .2;
      $('#cNo').textContent = n; $('#cAo').textContent = fmt(a); $('#cOut').textContent = fmt(m); $('#cYr').textContent = '≈ ' + fmt(m * 12) + ' per year';
      cN.style.setProperty('--p', ((n - 1) / 199 * 100) + '%'); cA.style.setProperty('--p', ((a - 99) / 400 * 100) + '%');
    };
    cN.addEventListener('input', calc); cA.addEventListener('input', calc); calc();
  }

  /* Design notes */
  var nd = $('#notesData');
  if (notesMode && nd) {
    var N = JSON.parse(nd.textContent), nt = $('#nt'), np = $('#np'), nl = $('#npl');
    nt.hidden = false;
    Object.keys(N).forEach(function (k) {
      var li = document.createElement('li'); li.innerHTML = '<b><i>' + k + '</i>' + N[k][0] + '</b><p>' + N[k][1] + '</p>';
      li.addEventListener('click', function () { if (innerWidth < 960) np.hidden = true; go($('[data-note="' + k + '"]')); });
      nl.appendChild(li);
    });
    $$('[data-note]').forEach(function (s) {
      var p = document.createElement('button'); p.className = 'pin'; p.textContent = s.dataset.note; p.setAttribute('aria-label', 'Design note ' + s.dataset.note);
      p.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); np.hidden = false; var it = nl.children[+s.dataset.note - 1]; if (it) it.scrollIntoView({ block: 'center' }); });
      s.appendChild(p);
    });
    nt.addEventListener('click', function () { np.hidden = !np.hidden; });
    $('#npx').addEventListener('click', function () { np.hidden = true; });
  }
})();
