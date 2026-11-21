/* =========================================================
   ErgoGraphene — V3 homepage (CoreChair look) interactions
   GSAP + ScrollTrigger + Lenis
   ========================================================= */
(function () {
  'use strict';
  var d = document, w = window;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = w.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = typeof w.gsap !== 'undefined' && typeof w.ScrollTrigger !== 'undefined';
  var lenis = null;

  /* ---------- Currency (shopping region) ---------- */
  var RATES = { EUR: 1, GBP: 0.86, CHF: 0.94, SEK: 11.4, DKK: 7.46, PLN: 4.3, USD: 1.08, CAD: 1.5 };
  var CUR_LOC = { EUR: 'de-DE', GBP: 'en-GB', USD: 'en-US', CAD: 'en-CA', CHF: 'de-CH', SEK: 'sv-SE', DKK: 'da-DK', PLN: 'pl-PL' };
  var cur = 'EUR';
  try { var s = localStorage.getItem('eg3-cur'); if (s && RATES[s]) cur = s; } catch (e) {}
  function money(eur) {
    var v = eur * RATES[cur], whole = ['SEK', 'DKK', 'PLN'].indexOf(cur) > -1;
    if (whole) v = Math.round(v / 5) * 5; else if (cur !== 'EUR') v = Math.ceil(v) - 0.05;
    return new Intl.NumberFormat(CUR_LOC[cur], { style: 'currency', currency: cur, minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 }).format(v);
  }
  function applyPrices() { $$('[data-price]').forEach(function (el) { el.textContent = money(+el.dataset.price); }); renderCart(); }
  var sel = $('.region__sel'); sel.value = cur;
  sel.addEventListener('change', function () { cur = sel.value; try { localStorage.setItem('eg3-cur', cur); } catch (e) {} applyPrices(); });

  /* ---------- Cart ---------- */
  var qty = 0;
  function total(q) { return q <= 0 ? 0 : q === 1 ? 92.95 : q === 2 ? 167.31 : q === 3 ? 237.02 : +(q * 92.95 * .85).toFixed(2); }
  function renderCart() {
    var box = $('.cart__items');
    box.innerHTML = qty ? '<div class="ci"><img src="../images/cushion-sm.webp" alt=""><div><b>Lumbar Support Seat Cushion</b><small>' + (qty === 1 ? 'The Single' : qty === 2 ? 'The Duo · save 10%' : qty === 3 ? 'The Trio · save 15%' : qty + ' cushions · save 15%') + '</small><div class="ci__q"><button type="button" data-q="-1" aria-label="Decrease">−</button><span>' + qty + '</span><button type="button" data-q="1" aria-label="Increase">+</button></div></div><b>' + money(total(qty)) + '</b></div>' : '<p class="cart__empty">Your cart is empty.</p>';
    $('.cart__sum').textContent = money(total(qty));
    var c = $('.cart-count'); c.textContent = qty; c.hidden = !qty;
    $('.cart__msg').innerHTML = qty >= 3 ? 'Free shipping ✓ · <b>You save 15%</b>' : qty === 2 ? 'Free shipping ✓ · You save 10% — <b>add 1 more to save 15%</b>' : 'Free shipping ✓ · <b>Add a 2nd cushion for the car and save 10%</b>';
  }
  $('.cart__items').addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (!b) return; qty = Math.max(0, qty + (+b.dataset.q)); renderCart(); });
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]'); if (!b) return;
    qty += +b.dataset.add; renderCart();
    var c = $('.cart-count'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    closeAll(); open('.cart');
  });

  /* ---------- Overlays ---------- */
  function open(selc) {
    var o = $(selc); o.hidden = false; requestAnimationFrame(function () { o.classList.add('is-on'); });
    d.body.classList.add('locked'); if (lenis) lenis.stop();
  }
  function closeAll() {
    $$('.overlay').forEach(function (o) {
      if (o.hidden) return; o.classList.remove('is-on');
      setTimeout(function () { if (!o.classList.contains('is-on')) o.hidden = true; }, 350);
    });
    var v = $('.vplayer video'); v.pause();
    d.body.classList.remove('locked'); if (lenis) lenis.start();
  }
  $$('[data-open-cart]').forEach(function (b) { b.addEventListener('click', function () { open('.cart'); }); });
  $$('[data-close]').forEach(function (b) { b.addEventListener('click', closeAll); });
  $$('.overlay').forEach(function (o) { o.addEventListener('click', function (e) { if (e.target === o) closeAll(); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); closeMenu(); } });

  /* ---------- Menu ---------- */
  var menu = $('.menu'), mnav = $('.mnav');
  function closeMenu() { mnav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); mnav.setAttribute('aria-hidden', 'true'); }
  menu.addEventListener('click', function () { var o = !mnav.classList.contains('is-open'); mnav.classList.toggle('is-open', o); menu.setAttribute('aria-expanded', o); mnav.setAttribute('aria-hidden', !o); });
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (a.hasAttribute('data-open-quiz')) return;
      var id = a.getAttribute('href'); if (id.length < 2) return; var t = $(id); if (!t) return;
      e.preventDefault(); closeMenu();
      if (lenis) lenis.scrollTo(t, { offset: -64, duration: 1.3 }); else t.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- Quiz + prompt ---------- */
  (function () {
    var steps = $$('.quiz__step'), pick = 1;
    function go(q) { steps.forEach(function (s) { s.classList.toggle('is-on', s.dataset.q === q); }); }
    $$('[data-open-quiz]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); go('1'); hidePrompt(); open('.quiz'); }); });
    $$('.quiz__opts').forEach(function (g, i) {
      g.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (i === 0) pick = +b.dataset.v;
        if (i < 2) { go(String(i + 2)); return; }
        var names = { 1: 'Lumbar Support Seat Cushion', 2: 'Lumbar Support Seat Cushion', 3: 'Lumbar Support Seat Cushion' };
        var why = { 1: 'Strap it to your desk chair and feel the support from the first sit.', 2: 'Use it at your desk, then take it to the car — it is light and moves in seconds.', 3: 'One light cushion that moves with you: desk, car and sofa.' };
        $('.quiz__res').textContent = names[pick]; $('.quiz__why').textContent = why[pick];
        $('.quiz__add').dataset.add = 1; go('r');
      });
    });
    var prompt = $('.prompt'), dismissed = false;
    function hidePrompt() { prompt.classList.remove('is-on'); dismissed = true; }
    $('.prompt__x').addEventListener('click', hidePrompt);
    w.addEventListener('scroll', function () {
      if (dismissed) return;
      var p = w.scrollY / (d.documentElement.scrollHeight - innerHeight);
      if (p > .5) { prompt.hidden = false; prompt.classList.add('is-on'); }
    }, { passive: true });
  })();

  /* ---------- Benefits tabs ---------- */
  var benGo;
  (function () {
    var sec = $('.ben'), tabs = $$('.ben__tabs button'), panes = $$('.bp'), line = $('.ben__line'), i0 = 0, timer, vis = false, user = false;
    if (!tabs.length || !line) return;
    benGo = function (i) {
      i0 = i;
      tabs.forEach(function (t, j) { t.classList.toggle('is-on', j === i); t.setAttribute('aria-selected', j === i); });
      panes.forEach(function (p, j) { p.classList.toggle('is-on', j === i); });
      line.style.transform = 'translateX(' + (i * 100) + '%)';
    };
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { user = true; benGo(i); }); });
    function tick() { if (vis && !user) benGo((i0 + 1) % tabs.length); timer = setTimeout(tick, 5500); }
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }, { threshold: .35 }).observe(sec);
    timer = setTimeout(tick, 5500);
  })();

  /* ---------- Reviews ---------- */
  (function () {
    var revs = $$('.rev'), dots = $('.revs__dots'), i0 = 0, timer, thumbs = $$('.rv-th');
    revs.forEach(function (r) {
      var q = $('blockquote', r); q.innerHTML = q.textContent.split(' ').map(function (wd) { return '<span class="w">' + wd + '</span>'; }).join(' ');
    });
    revs.forEach(function (_, i) { var b = d.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Review ' + (i + 1)); b.addEventListener('click', function () { go(i); }); dots.appendChild(b); });
    var db = $$('button', dots);
    function show(i, instant) {
      var r = revs[i];
      revs.forEach(function (x, j) { x.classList.toggle('is-on', j === i); });
      db.forEach(function (b, j) { b.classList.toggle('is-on', j === i); });
      thumbs.forEach(function (b, j) { b.classList.toggle('is-on', j === i); });
      if (!hasGsap || reduce || instant) { revs.forEach(function (x, j) { x.style.opacity = j === i ? 1 : 0; }); return; }
      gsap.set(r, { opacity: 1 });
      gsap.fromTo($$('.w', r), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, stagger: .02, ease: 'expo.out' });
      gsap.fromTo($('figcaption', r), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .8, delay: .3, ease: 'expo.out' });
      var im = $('.rev2__img img', r); if (im) gsap.fromTo(im, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1, ease: 'expo.out' });
    }
    function go(i) {
      i = (i + revs.length) % revs.length; if (i === i0) return;
      var old = revs[i0]; i0 = i;
      if (hasGsap && !reduce) gsap.to(old, { opacity: 0, duration: .3, onComplete: function () { old.classList.remove('is-on'); } });
      show(i);
      clearInterval(timer); timer = setInterval(function () { go(i0 + 1); }, 7000);
    }
    $$('.arw[data-dir]').forEach(function (a) { a.addEventListener('click', function () { go(i0 + (+a.dataset.dir)); }); });
    thumbs.forEach(function (b, j) { b.addEventListener('click', function () { go(j); }); });
    show(0, true);
    timer = setInterval(function () { go(i0 + 1); }, 7000);
    var sx = null, st = $('.revs__stage');
    st.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    st.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(i0 + (dx < 0 ? 1 : -1)); sx = null; });
  })();

  /* ---------- Real-world videos ---------- */
  (function () {
    var track = $('.wild__track'), pv = $('.vplayer video');
    $$('.wc').forEach(function (c) {
      var v = $('video', c);
      if (!v) return;
      if (fine) {
        c.addEventListener('mouseenter', function () { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); });
        c.addEventListener('mouseleave', function () { v.pause(); });
      }
    });
    $$('[data-src]').forEach(function (b) {
      b.addEventListener('click', function () { pv.src = b.dataset.src; open('.vplayer'); var p = pv.play(); if (p && p.catch) p.catch(function () {}); });
    });
    if (!fine) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { var v = $('video', e.target); if (!v) return; if (e.isIntersecting) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }); }, { threshold: .7 });
      $$('.wc').forEach(function (c) { io.observe(c); });
    }
    $$('[data-wdir]').forEach(function (b) { b.addEventListener('click', function () { track.scrollBy({ left: +b.dataset.wdir * 600, behavior: 'smooth' }); }); });
  })();

  /* ---------- Header ---------- */
  var hdr = $('.hdr');
  w.addEventListener('scroll', function () { hdr.classList.toggle('is-scrolled', w.scrollY > 10); }, { passive: true });

  /* ---------- Design notes (?notes=1) ---------- */
  var NOTES = {
    1: ['Hero — your lifestyle image and wording', 'Your current hero lifestyle photo and the exact text from your current page, with the button matched to your current size and glow.'],
    2: ['One clear benefit + use cases', 'One outcome headline, one desk photo, a lumbar-ribs close-up, plain-language benefits and one main button, then three static cards: At your desk, In the car, At home.'],
    3: ['The product in use', 'A short sequence showing the cushion on a chair, at the desk, through the day and at home, with a "Shop the seat cushion" button.'],
    4: ['Before / after', 'The before/after posture slider from the first design, in your colours. It plays once on arrival to show how it works, then visitors can drag it.'],
    5: ['Why people choose ErgoGraphene', 'All five reasons visible at once as compact cards, each with a small image that explains the point: rib close-up, posture, everyday comfort, graphene inset and mesh detail.'],
    6: ['The graphene advantage', 'The graphene section with the interactive warmth panel and four technology points from the first design, re-coloured to your navy and blue.'],
    7: ['Your first month', 'The posture figure straightens as you scroll past — a shorter version with no long pinned scrolling.'],
    8: ['The principle', 'One short brand belief that fills with colour as you scroll.'],
    9: ['Customer feedback numbers', 'Four large, easy-to-read cards with your real 96 / 94 / 91 / 97% figures and plain explanations.'],
    10: ['As seen on', 'A short, single row of the media logos from your current site.'],
    11: ['Text testimonials with photos', 'Each review now shows a customer photo, the stars and the quote, with photo thumbnails to switch between reviewers.'],
    12: ['Try it in your chair', 'One clear offer — the seat cushion — with the guarantee and trust points. The Duo has been removed.'],
    13: ['Video testimonials', 'Blank video slots ready for your customer videos.'],
    14: ['Sign Up & Save', 'Email sign-up in the same style as your current site, just above the footer.']
  };
  if (/[?&]notes=1/.test(location.search)) {
    var panel = $('.notes'), keys = Object.keys(NOTES).map(Number), nc = 0;
    var show = function (i) {
      nc = (i + keys.length) % keys.length; var k = keys[nc];
      $('.notes__k', panel).textContent = 'Why this layout · ' + k + ' / ' + keys.length;
      $('.notes__t', panel).textContent = NOTES[k][0]; $('.notes__b', panel).innerHTML = NOTES[k][1]; panel.hidden = false;
      $$('.is-noted').forEach(function (e) { e.classList.remove('is-noted'); });
      var el = $('[data-note="' + k + '"]'); if (el) el.classList.add('is-noted');
    };
    var jump = function (i) { show(i); var el = $('[data-note="' + keys[nc] + '"]'); if (el) { if (lenis) lenis.scrollTo(el, { offset: -64 }); else el.scrollIntoView(); } };
    $$('[data-note]').forEach(function (el) {
      var pin = d.createElement('button'); pin.type = 'button'; pin.className = 'note-pin'; pin.textContent = el.dataset.note;
      pin.addEventListener('click', function (e) { e.stopPropagation(); show(keys.indexOf(+el.dataset.note)); });
      el.appendChild(pin);
    });
    $('.notes__next', panel).addEventListener('click', function () { jump(nc + 1); });
    $('.notes__prev', panel).addEventListener('click', function () { jump(nc - 1); });
    $('.notes__x', panel).addEventListener('click', function () { panel.hidden = true; });
    show(0);
  }

  /* ---------- Before / after slider ---------- */
  (function () {
    var cmp = $('.ba2__cmp'); if (!cmp) return;
    var deg = $('.ba2__deg'), dot = $('.ba2__dot'), drag = false;
    function setX(v) {
      v = Math.max(3, Math.min(97, v)); cmp.style.setProperty('--x', v + '%'); cmp.setAttribute('aria-valuenow', Math.round(v));
      var bad = v > 50; deg.textContent = bad ? 'Slouched' : 'Aligned'; deg.style.color = bad ? '#d9442f' : ''; dot.style.background = bad ? '#d9442f' : '';
    }
    function fromEvt(e) { var r = cmp.getBoundingClientRect(); setX((e.clientX - r.left) / r.width * 100); }
    cmp.addEventListener('pointerdown', function (e) { drag = true; fromEvt(e); });
    w.addEventListener('pointermove', function (e) { if (drag) fromEvt(e); });
    w.addEventListener('pointerup', function () { drag = false; });
    cmp.addEventListener('keydown', function (e) { var v = parseFloat(cmp.style.getPropertyValue('--x')) || 50; if (e.key === 'ArrowLeft') v -= 5; else if (e.key === 'ArrowRight') v += 5; else return; e.preventDefault(); setX(v); });
    setX(50);
    cmp._intro = function () {
      if (!hasGsap || reduce) return;
      var o = { v: 88 }; setX(88);
      gsap.timeline().to(o, { v: 14, duration: 1.6, ease: 'expo.inOut', onUpdate: function () { setX(o.v); } }).to(o, { v: 50, duration: 1.1, ease: 'expo.inOut', onUpdate: function () { setX(o.v); } });
    };
  })();

  /* ---------- Posture figure (compact, no pinning) ---------- */
  var jrRender = (function () {
    var spine = $('.j-spine'); if (!spine) return null;
    var body = $('.j-body'), head = $('.j-head'), leg = $('.j-leg'), arm = $('.j-arm'), num = $('.j-num'), st = $('.j-state'), weeks = $$('.jr__weeks li'), wi = -1;
    var A = { hip: [222, 296], c1: [292, 250], c2: [252, 150], sh: [200, 138], hd: [176, 100], deg: 24 }, B = { hip: [262, 292], c1: [282, 236], c2: [264, 168], sh: [258, 118], hd: [254, 72], deg: 4 };
    function L(a, b, t) { return a + (b - a) * t; }
    function P(k, t) { return [L(A[k][0], B[k][0], t), L(A[k][1], B[k][1], t)]; }
    return function (t) {
      var hip = P('hip', t), c1 = P('c1', t), c2 = P('c2', t), sh = P('sh', t), hd = P('hd', t), dp = 'M' + hip + ' C' + c1 + ' ' + c2 + ' ' + sh;
      spine.setAttribute('d', dp); body.setAttribute('d', dp); head.setAttribute('cx', hd[0]); head.setAttribute('cy', hd[1]);
      leg.setAttribute('d', 'M' + hip + ' L 104 300 L 104 400');
      arm.setAttribute('d', 'M' + sh + ' L ' + (sh[0] - 26) + ' 222 L ' + (sh[0] - 96) + ' 226');
      num.textContent = Math.round(L(A.deg, B.deg, t)) + '°';
      st.textContent = t < .35 ? 'slouched' : t < .75 ? 'improving' : 'aligned';
      var i = Math.min(3, Math.floor(t * 4 - .001)); if (i < 0) i = 0;
      if (i !== wi) { wi = i; weeks.forEach(function (x, j) { x.classList.toggle('is-on', j === i); }); }
    };
  })();
  if (jrRender) jrRender(0);

  /* ---------- Graphene warmth panel (blue tones) ---------- */
  (function () {
    var cv = $('.gwarm__cv'); if (!cv) return;
    var panel = $('.gwarm__panel'), ctx = cv.getContext('2d'), W = 96, H = 72, img, run = false, mx = .5, my = .55, heat = 0, over = false;
    function size() { var r = panel.getBoundingClientRect(); H = Math.max(40, Math.round(W * r.height / Math.max(1, r.width))); cv.width = W; cv.height = H; img = ctx.createImageData(W, H); }
    size(); w.addEventListener('resize', function () { clearTimeout(cv._t); cv._t = setTimeout(size, 200); });
    function mv(x, y) { var r = panel.getBoundingClientRect(); mx = (x - r.left) / r.width; my = (y - r.top) / r.height; over = true; }
    panel.addEventListener('pointermove', function (e) { mv(e.clientX, e.clientY); });
    panel.addEventListener('pointerleave', function () { over = false; });
    panel.addEventListener('touchmove', function (e) { var t = e.touches[0]; mv(t.clientX, t.clientY); }, { passive: true });
    var stops = [[0, [9, 40, 70]], [.35, [16, 70, 130]], [.55, [40, 120, 210]], [.72, [79, 169, 255]], [.86, [170, 215, 255]], [.95, [255, 190, 150]], [1, [255, 236, 220]]], pal = [];
    for (var i = 0; i < 256; i++) {
      var v = i / 255;
      for (var j = 1; j < stops.length; j++) if (v <= stops[j][0]) { var a = stops[j - 1], b = stops[j], t = (v - a[0]) / (b[0] - a[0]); pal.push([a[1][0] + (b[1][0] - a[1][0]) * t, a[1][1] + (b[1][1] - a[1][1]) * t, a[1][2] + (b[1][2] - a[1][2]) * t]); break; }
    }
    function frame(t) {
      if (!run) return;
      var s2 = t / 1000, dt = img.data, asp = H / W;
      heat += ((over ? 1 : 0) - heat) * .05;
      var src = [[.5 + Math.sin(s2 * .3) * .2, .5 + Math.cos(s2 * .4) * .16, .22, .5], [.25 + Math.cos(s2 * .23) * .12, .7 + Math.sin(s2 * .31) * .12, .17, .4], [.78 + Math.sin(s2 * .27) * .1, .3 + Math.cos(s2 * .21) * .12, .17, .4], [mx, my, .15 + heat * .08, .3 + heat * .8]];
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
        var nx = x / W, ny = y / H, vv = 0;
        for (var k = 0; k < 4; k++) { var dx = nx - src[k][0], dy = (ny - src[k][1]) * asp, r = src[k][2]; vv += Math.exp(-(dx * dx + dy * dy) / (r * r * .35)) * src[k][3]; }
        vv += Math.sin(nx * 18 + s2) * Math.cos(ny * 14 - s2 * .8) * .03;
        var c = pal[Math.max(0, Math.min(255, (vv * 280) | 0))], i2 = (y * W + x) * 4;
        dt[i2] = c[0]; dt[i2 + 1] = c[1]; dt[i2 + 2] = c[2]; dt[i2 + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      requestAnimationFrame(frame);
    }
    new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !run) { run = true; requestAnimationFrame(frame); } else if (!v) run = false; }).observe(panel);
  })();

  /* ---------- Newsletter ---------- */
  (function () {
    var f = $('.nl__f'); if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var inp = $('input', f);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value)) { f.classList.remove('err'); void f.offsetWidth; f.classList.add('err'); inp.focus(); return; }
      f.hidden = true; $('.nl__ok').hidden = false;
    });
  })();

  applyPrices();

  /* =========================================================
     Motion
     ========================================================= */
  if (!hasGsap || reduce) {
    $$('.ln--fade').forEach(function (l) { l.style.color = 'var(--accent)'; });
    $$('.cnt').forEach(function (c) { c.textContent = c.dataset.to; });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  if (typeof w.Lenis !== 'undefined') {
    lenis = new w.Lenis({ lerp: .1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // line-mask helper
  function wrapLines(sel) {
    $$(sel).forEach(function (ln) { var inner = d.createElement('span'); inner.style.display = 'block'; while (ln.firstChild) inner.appendChild(ln.firstChild); ln.appendChild(inner); });
  }
  wrapLines('.hero__t .ln, .shift__t .ln, .proof .h2 .ln');

  // HERO intro
  gsap.timeline({ delay: .15 })
    .from('.hero__bg', { opacity: 0, duration: 1.2, ease: 'power2.out' })
    .from('.hero__photo img', { scale: 1.14, opacity: 0, duration: 2, ease: 'expo.out' }, .05)
    .from('.hero__t .ln > span', { yPercent: 110, duration: 1.2, stagger: .12, ease: 'expo.out' }, .3)
    .from(['.hero__pill', '.hero__p', '.hero .btn-main', '.hero__checks li'], { y: 24, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out' }, .55);
  gsap.to('.hero__photo img', { yPercent: 3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__copy', { y: -60, opacity: .3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  if (fine) {
    var hx = gsap.quickTo('.hero__photo img', 'x', { duration: 1.4, ease: 'power3' }), hy = gsap.quickTo('.hero__photo img', 'y', { duration: 1.4, ease: 'power3' });
    $('.hero').addEventListener('pointermove', function (e) { hx((e.clientX / innerWidth - .5) * -18); hy((e.clientY / innerHeight - .5) * -10); });
  }

  // generic reveals
  function reveal(targets, trig, vars) {
    gsap.from(targets, Object.assign({ y: 40, opacity: 0, duration: 1.1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: trig, start: 'top 82%' } }, vars || {}));
  }
  reveal('.bo__copy > *', '.bo');
  gsap.from('.bo__main', { clipPath: 'inset(12% 12% 12% 12% round 14px)', opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.bo', start: 'top 78%' } });
  gsap.from('.bo__inset', { y: 60, rotate: 3, opacity: 0, duration: 1.3, delay: .35, ease: 'expo.out', scrollTrigger: { trigger: '.bo', start: 'top 70%' } });
  reveal('.use', '.uses', { y: 50, stagger: .12 });
  reveal('.ba2__copy > *', '.ba2');
  gsap.from('.ba2__cmp', { y: 60, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.ba2__cmp', start: 'top 88%' } });
  ScrollTrigger.create({ trigger: '.ba2__cmp', start: 'top 65%', once: true, onEnter: function () { var c = $('.ba2__cmp'); if (c && c._intro) c._intro(); } });
  reveal('.why2__head > *', '.why2');
  reveal('.wy', '.why2__grid', { y: 50, stagger: .09 });
  reveal('.gwarm__panel, .gwarm__cards .gcard', '.gwarm', { y: 40, stagger: .08 });
  reveal('.jr__copy > .eyebrow, .jr__copy > .h2', '.jr');
  if (jrRender) { var jo = { t: 0 }; gsap.to(jo, { t: 1, ease: 'none', onUpdate: function () { jrRender(jo.t); }, scrollTrigger: { trigger: '.jr', start: 'top 70%', end: 'bottom 45%', scrub: .6 } }); }
  reveal('.st2', '.stats2', { y: 40, stagger: .1 });

  reveal('.rv-thumbs', '.rv-thumbs', { y: 20 });
  reveal('.nl__row > *', '.nl', { y: 24 });
  reveal('.gtech__k, .gtech__t, .gtech__p', '.gtech');
  gsap.from('.gtech__img', { y: 90, scale: .86, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.gtech__stage', start: 'top 80%' } });
  gsap.from('.gtech__ring', { scale: .6, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.gtech__stage', start: 'top 80%' } });
  gsap.from('.gcall', { opacity: 0, x: function (i) { return i === 0 ? -30 : 30; }, duration: 1, stagger: .14, delay: .5, ease: 'expo.out', scrollTrigger: { trigger: '.gtech__stage', start: 'top 75%' } });
  reveal('.gtech .btn-main', '.gwarm');
  reveal('.proof__head > div > .eyebrow, .proof__intro', '.proof');
  gsap.from('.proof .h2 .ln > span', { yPercent: 110, duration: 1.2, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.proof .h2', start: 'top 80%' } });
  reveal('.rrow', '.rtable');
  reveal('.wild__head > *', '.wild');
  reveal('.wc', '.wild__track', { y: 0, scale: .94, stagger: .08 });

  // SHIFT: video zoom + lines
  (function () {
    var slides = $$('.ss'), steps = $$('.ss-steps li'), cur = 0, timer = null, DUR = 3600;
    if (!slides.length) return;
    function go(i) {
      cur = i;
      slides.forEach(function (sl, j) { sl.classList.toggle('is-on', j === i); });
      steps.forEach(function (st, j) { st.classList.toggle('is-on', j === i); st.classList.toggle('done', j < i); var b = $('i', st); b.style.animation = 'none'; void b.offsetWidth; b.style.animation = ''; });
    }
    function play() { stop(); timer = setInterval(function () { go((cur + 1) % slides.length); }, DUR); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    steps.forEach(function (st, i) { st.addEventListener('click', function () { go(i); play(); }); });
    ScrollTrigger.create({ trigger: '.shift', start: 'top 70%', end: 'bottom 20%', onToggle: function (stg) { if (stg.isActive) { go(0); play(); } else stop(); } });
    gsap.from(['.shift .btn-main', '.ss-steps'], { opacity: 0, y: 20, duration: 1, stagger: .2, delay: .5, ease: 'expo.out', scrollTrigger: { trigger: '.shift', start: 'top 55%' } });
  })();
  gsap.from('.shift__t .ln > span', { yPercent: 110, duration: 1.3, stagger: .14, ease: 'expo.out', scrollTrigger: { trigger: '.shift', start: 'top 55%' } });
  gsap.from(['.shift .eyebrow', '.shift__p'], { opacity: 0, y: 20, duration: 1, stagger: .4, delay: .2, ease: 'expo.out', scrollTrigger: { trigger: '.shift', start: 'top 55%' } });


  // MANTRA: colour fill on scroll
  (function () {
    var l = $('.ln--fade'); var txt = l.textContent;
    l.innerHTML = txt.split('').map(function (c) { return '<span class="mc">' + c + '</span>'; }).join('');
    var em = d.createElement('em'); // keep italic on "hurt"
    var spans = $$('.mc', l);
    for (var i = 0; i < 4; i++) { spans[i].style.fontStyle = 'italic'; }
    ScrollTrigger.create({ trigger: '.mantra', start: 'top 75%', end: 'bottom 45%', scrub: true, onUpdate: function (st) {
      var n = Math.round(st.progress * spans.length); spans.forEach(function (s, i) { s.style.color = i < n ? 'var(--accent)' : ''; });
    } });
    void em;
  })();

  // PROOF counters
  $$('.cnt').forEach(function (c) {
    var o = { v: 0 };
    ScrollTrigger.create({ trigger: c, start: 'top 85%', once: true, onEnter: function () { gsap.to(o, { v: +c.dataset.to, duration: 1.8, ease: 'expo.out', onUpdate: function () { c.textContent = Math.round(o.v); } }); } });
  });

  // TRY: scale-in scene
  gsap.fromTo('.try__scene img', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.try__scene', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  gsap.from('.try__copy > *', { y: 40, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.try__scene', start: 'top 45%' } });

  (function () {
    var cv = $('.gtech__lattice'); if (!cv) return;
    var ctx = cv.getContext('2d'), dpr = Math.min(2, w.devicePixelRatio || 1), W, H, pts = [], mx = -999, my = -999, tx = -999, ty = -999, run = false;
    function resize() {
      W = cv.offsetWidth; H = cv.offsetHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = []; var st = innerWidth <= 760 ? 30 : 40, hh = st * Math.sqrt(3) / 2;
      for (var row = 0, y = 0; y < H + st; y += hh, row++) for (var x = (row % 2) * st / 2; x < W + st; x += st) pts.push([x, y]);
    }
    resize(); w.addEventListener('resize', function () { clearTimeout(cv._t); cv._t = setTimeout(resize, 200); });
    var sec = $('.gtech');
    sec.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; });
    sec.addEventListener('pointerleave', function () { tx = -999; });
    function frame(t) {
      if (!run) return;
      var s2 = t / 1000, ax = tx < -900 ? W / 2 + Math.cos(s2 * .45) * W * .3 : tx, ay = tx < -900 ? H * .5 + Math.sin(s2 * .6) * H * .25 : ty;
      mx += (ax - mx) * .08; my += (ay - my) * .08;
      ctx.clearRect(0, 0, W, H);
      var R = Math.max(W, H) * .2;
      for (var i = 0; i < pts.length; i++) {
        var q = pts[i], dx = q[0] - mx, dy = q[1] - my, k = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / R);
        ctx.fillStyle = k > .02 ? 'rgba(' + Math.round(108 + k * 120) + ',' + Math.round(194 + k * 50) + ',255,' + (.08 + k * .8) + ')' : 'rgba(220,236,255,.07)';
        ctx.beginPath(); ctx.arc(q[0], q[1], 1 + k * 2.4, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !run) { run = true; requestAnimationFrame(frame); } else if (!v) run = false; }).observe(sec);
    if (fine) {
      var gx = gsap.quickTo('.gtech__img', 'rotationY', { duration: .8, ease: 'power3' }), gy = gsap.quickTo('.gtech__img', 'rotationX', { duration: .8, ease: 'power3' });
      gsap.set('.gtech__stage', { perspective: 1000 });
      sec.addEventListener('pointermove', function (e) { var r = sec.getBoundingClientRect(); gx(((e.clientX - r.left) / r.width - .5) * 14); gy(-((e.clientY - r.top) / r.height - .5) * 8); });
    }
  })();

  w.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
