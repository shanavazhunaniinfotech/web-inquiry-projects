/* filthy clean · homepage prototype interactions */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var store = {
    get: function (k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} }
  };
  var money = function (n) { return '$' + n.toFixed(2); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- product data (from filthyclean.com) ---------- */
  var P = {
    linen: {
      name: 'Lethal Linen', price: 9.99, img: 'images/linen-3.webp', tag: 'Fresh & airy', meta: 'Fresh & airy · 4 mL',
      desc: 'Clean sheets with a bite. A pocket-sized instant stain remover pen with a bright, airy scent that smells like you got away with it.',
      list: ['Scent: fresh, airy, clean sheets', 'Size: 4 mL / 0.14 fl oz', 'Twist, dab and let dry', 'No bleach, parabens, sulfates or optical brighteners'],
      gallery: ['images/linen.webp', 'images/linen-2.webp', 'images/hero-denim.webp', 'images/meet-nostab.webp']
    },
    santal: {
      name: 'Sultry Santal', price: 9.99, img: 'images/santal-3.webp', tag: 'Warm & woody', meta: 'Warm & woody · 4 mL',
      desc: 'Creamy sandalwood with a moody edge. A pocket-sized instant stain remover pen that fixes the damage and leaves you smelling expensive.',
      list: ['Scent: warm, woody, sandalwood', 'Size: 4 mL / 0.14 fl oz', 'Twist, dab and let dry', 'No bleach, parabens, sulfates or optical brighteners'],
      gallery: ['images/santal.webp', 'images/meet-scent.webp', 'images/meet-looks.webp', 'images/santal-2.webp']
    },
    duo: {
      name: 'Dangerous Duo', price: 17.98, compare: 19.98, img: 'images/duo-2.webp', tag: 'Best value', meta: 'Linen + Santal · 2 × 4 mL',
      desc: 'Fresh and airy meets warm and woody. Both filthy clean pens in one set: keep one in your bag and one by the door.',
      list: ['Includes 1 Lethal Linen + 1 Sultry Santal', 'Size: 2 × 4 mL / 0.14 fl oz', 'Costs less than buying both separately'],
      gallery: ['images/duo.webp', 'images/duo-2.webp']
    }
  };

  /* ---------- small helpers ---------- */
  var toastT;
  function toast(msg) {
    var t = $('[data-toast]'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2800);
  }
  var lenis = null;
  var locks = 0;
  function lock(on) {
    locks = Math.max(0, locks + (on ? 1 : -1));
    document.documentElement.style.overflow = locks ? 'hidden' : '';
    if (lenis) { locks ? lenis.stop() : lenis.start(); }
  }

  /* ---------- marquees: duplicate content for a seamless loop ---------- */
  $$('[data-marquee]').forEach(function (tr) {
    var row = tr.firstElementChild;
    for (var i = 0; i < 3; i++) { var c = row.cloneNode(true); c.setAttribute('aria-hidden', 'true'); tr.appendChild(c); }
  });

  /* ---------- split headings into masked words ---------- */
  $$('[data-split]').forEach(function (h) {
    var out = [];
    Array.prototype.forEach.call(h.childNodes, function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/\s+/).filter(Boolean).forEach(function (w) { out.push('<span class="ln"><span class="wi">' + esc(w) + '</span></span>'); });
      } else if (n.nodeType === 1) {
        var tag = n.tagName.toLowerCase();
        if (tag === 'br') { out.push('<br>'); return; }
        n.textContent.split(/\s+/).filter(Boolean).forEach(function (w) { out.push('<span class="ln"><span class="wi"><' + tag + '>' + esc(w) + '</' + tag + '></span></span>'); });
      }
    });
    h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
    h.innerHTML = out.join(' ');
    $$('.ln', h).forEach(function (l) { l.setAttribute('aria-hidden', 'true'); });
  });

  /* manifesto: words light up while scrolling */
  var scrub = $('[data-scrub-text]');
  if (scrub) {
    var parts = [];
    Array.prototype.forEach.call(scrub.childNodes, function (n) {
      var words = n.textContent.split(/\s+/).filter(Boolean);
      words.forEach(function (w) { parts.push(n.nodeType === 1 ? '<span class="w"><em>' + esc(w) + '</em></span>' : '<span class="w">' + esc(w) + '</span>'); });
    });
    scrub.setAttribute('aria-label', scrub.textContent.replace(/\s+/g, ' ').trim());
    scrub.innerHTML = parts.join(' ');
  }

  /* ---------- header ---------- */
  var hdr = $('[data-hdr]'), lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    hdr.classList.toggle('is-scrolled', y > 10);
    var menuOpen = $('[data-burger]').getAttribute('aria-expanded') === 'true';
    hdr.classList.toggle('is-hidden', !menuOpen && y > 600 && y > lastY + 4);
    if (y < lastY - 4 || y < 600) hdr.classList.remove('is-hidden');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  var burger = $('[data-burger]'), mnav = $('[data-mnav]');
  function menu(open) {
    if ((burger.getAttribute('aria-expanded') === 'true') === open) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mnav.classList.toggle('on', open); lock(open);
  }
  burger.addEventListener('click', function () { menu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });

  /* anchor links (works with smooth scroll) */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var t = $(id); if (!t) return;
    e.preventDefault();
    if (id === '#top') { lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); return; }
    var off = -(hdr.offsetHeight) + 1;
    setTimeout(function () {
      if (lenis) lenis.scrollTo(t, { offset: off, duration: 1.4 });
      else window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY + off, behavior: RM ? 'auto' : 'smooth' });
    }, locks ? 60 : 0);
  });

  /* ---------- hero image rotator ---------- */
  (function () {
    var vis = $('[data-hero-vis]'); if (!vis) return;
    var imgs = $$('.hv-img', vis), tabs = $$('[data-hv]', vis), bar = $('[data-hv-bar]'), cur = 0, t0 = performance.now(), paused = false, seen = true, DUR = 5200, elapsed = 0, last = t0;
    function go(i) {
      cur = (i + imgs.length) % imgs.length; elapsed = 0;
      imgs.forEach(function (im, k) { im.classList.toggle('is-on', k === cur); });
      tabs.forEach(function (b, k) { b.setAttribute('aria-selected', String(k === cur)); });
    }
    tabs.forEach(function (b, k) {
      b.addEventListener('mouseenter', function () { if (FINE) go(k); });
      b.addEventListener('click', function () { go(k); });
    });
    vis.addEventListener('mouseenter', function () { paused = true; });
    vis.addEventListener('mouseleave', function () { paused = false; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { seen = en[0].isIntersecting; }).observe(vis);
    (function loop(now) {
      var dt = now - last; last = now;
      if (!paused && seen && !document.hidden && !RM) { elapsed += dt; if (elapsed >= DUR) go(cur + 1); }
      bar.style.transform = 'scaleX(' + Math.min(1, elapsed / DUR) + ')';
      requestAnimationFrame(loop);
    })(t0);
  })();

  /* ---------- mess list: cursor-following stain preview ---------- */
  (function () {
    var list = $('[data-mess]'), prev = $('[data-mess-prev]'); if (!list) return;
    var tx = 0, ty = 0, x = 0, y = 0, on = false, cleanT, raf;
    $$('li', list).forEach(function (li) { li.style.setProperty('--c', li.dataset.color); });
    function tick() { x += (tx - x) * .18; y += (ty - y) * .18; prev.style.left = x + 'px'; prev.style.top = y + 'px'; if (on) raf = requestAnimationFrame(tick); }
    function enter(li, e) {
      prev.style.setProperty('--c', li.dataset.color);
      prev.classList.remove('clean'); void prev.offsetWidth;
      if (!on) { on = true; if (e) { x = tx = e.clientX + 150; y = ty = e.clientY; } tick(); }
      prev.classList.add('on');
      clearTimeout(cleanT); cleanT = setTimeout(function () { prev.classList.add('clean'); }, 900);
    }
    if (FINE) {
      $$('li', list).forEach(function (li) { li.addEventListener('mouseenter', function (e) { enter(li, e); }); });
      list.addEventListener('mousemove', function (e) { tx = e.clientX + 150; ty = e.clientY; });
      list.addEventListener('mouseleave', function () { on = false; cancelAnimationFrame(raf); prev.classList.remove('on', 'clean'); clearTimeout(cleanT); });
    }
  })();

  /* ---------- Try it: wipe the stain canvas ---------- */
  (function () {
    var stage = $('[data-try]'); if (!stage) return;
    var cv = $('[data-try-canvas]', stage), ctx = cv.getContext('2d');
    var fab = document.createElement('canvas'), fctx = fab.getContext('2d');
    var st = document.createElement('canvas'), sctx = st.getContext('2d', { willReadFrequently: true });
    var pen = $('[data-try-pen]', stage), hint = $('[data-try-hint]', stage);
    var pctEl = $('[data-try-pct]'), barEl = $('[data-try-bar]'), doneEl = $('[data-try-done]');
    var W = 0, H = 0, dpr = 1, lastW = 0, total = 1, color = '#6b1a2b', down = false, last = null, dirty = true, done = false, checkT = 0, fade = 1;
    if (!FINE) hint.lastChild.textContent = 'Swipe side to side to dab';

    function rand(a, b) { return a + Math.random() * (b - a); }
    function drawFabric() {
      fab.width = W; fab.height = H;
      fctx.fillStyle = '#f5f0e7'; fctx.fillRect(0, 0, W, H);
      var s = Math.max(2, Math.round(3 * dpr));
      for (var y = 0; y < H; y += s) { fctx.fillStyle = 'rgba(80,60,40,' + (0.03 + Math.random() * 0.025) + ')'; fctx.fillRect(0, y, W, Math.max(1, dpr * .8)); }
      for (var x = 0; x < W; x += s) { fctx.fillStyle = 'rgba(80,60,40,' + (0.02 + Math.random() * 0.02) + ')'; fctx.fillRect(x, 0, Math.max(1, dpr * .8), H); }
      for (var i = 0; i < 2600; i++) { fctx.fillStyle = 'rgba(70,50,30,' + Math.random() * 0.06 + ')'; fctx.fillRect(Math.random() * W, Math.random() * H, dpr * 1.5, dpr * .8); }
      // soft folds
      for (var f = 0; f < 4; f++) {
        var gx = rand(0, W), g = fctx.createLinearGradient(gx - W * .2, 0, gx + W * .2, H);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, f % 2 ? 'rgba(120,95,70,.07)' : 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        fctx.fillStyle = g; fctx.fillRect(0, 0, W, H);
      }
      var v = fctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .3, W / 2, H / 2, Math.max(W, H) * .75);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(60,40,25,.18)');
      fctx.fillStyle = v; fctx.fillRect(0, 0, W, H);
    }
    function blob(c, cx, cy, R, n) {
      var p1 = rand(0, 6), p2 = rand(0, 6), pts = [];
      for (var i = 0; i < n; i++) {
        var a = i / n * Math.PI * 2, r = R * (1 + .17 * Math.sin(3 * a + p1) + .09 * Math.sin(7 * a + p2) + rand(-.04, .04));
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * .86]);
      }
      c.beginPath(); c.moveTo((pts[0][0] + pts[n - 1][0]) / 2, (pts[0][1] + pts[n - 1][1]) / 2);
      for (var k = 0; k < n; k++) { var p = pts[k], q = pts[(k + 1) % n]; c.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
      c.closePath();
    }
    function newStain() {
      st.width = W; st.height = H; done = false; fade = 1;
      sctx.clearRect(0, 0, W, H);
      var cx = W * rand(.46, .56), cy = H * rand(.45, .55), R = Math.min(W, H) * .25;
      sctx.globalCompositeOperation = 'source-over';
      sctx.globalAlpha = .82; sctx.fillStyle = color;
      blob(sctx, cx, cy, R, 40); sctx.fill();
      // darker rim like a dried stain
      sctx.globalAlpha = .55; sctx.lineWidth = R * .045; sctx.strokeStyle = color; sctx.shadowColor = color; sctx.shadowBlur = 8 * dpr;
      sctx.stroke(); sctx.shadowBlur = 0;
      // satellite drops
      sctx.globalAlpha = .8;
      for (var d = 0; d < 9; d++) { var a = rand(0, Math.PI * 2), dist = R * rand(1.2, 1.75), r = R * rand(.03, .1); blob(sctx, cx + Math.cos(a) * dist, cy + Math.sin(a) * dist, r, 12); sctx.fill(); }
      // lighter centre
      sctx.globalAlpha = 1; sctx.globalCompositeOperation = 'destination-out';
      var g = sctx.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, 'rgba(0,0,0,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      sctx.fillStyle = g; sctx.fillRect(0, 0, W, H);
      sctx.globalCompositeOperation = 'source-over';
      total = count() || 1;
      update(0); doneEl.hidden = true; dirty = true;
    }
    function count() {
      var d = sctx.getImageData(0, 0, W, H).data, n = 0, step = Math.max(4, Math.round(6 * dpr)) * 4;
      for (var i = 3; i < d.length; i += step) if (d[i] > 40) n++;
      return n;
    }
    function update(p) {
      var v = Math.max(0, Math.min(100, Math.round(p * 100)));
      pctEl.textContent = v + '%'; barEl.style.width = v + '%';
    }
    function check() {
      if (done) return;
      var p = 1 - count() / total; update(p);
      if (p > .86) finish();
    }
    function finish() {
      done = true; update(1);
      var t0 = performance.now();
      (function f(now) { fade = Math.max(0, 1 - (now - t0) / 700); dirty = true; if (fade > 0) requestAnimationFrame(f); })(t0);
      doneEl.hidden = false;
      if (window.gsap && !RM) gsap.from(doneEl.children, { y: 20, opacity: 0, stagger: .1, duration: .7, ease: 'power3.out' });
      stage.classList.add('is-done');
    }
    function resize() {
      var r = stage.getBoundingClientRect();
      if (!r.width || Math.abs(r.width - lastW) < 2) return;
      lastW = r.width; dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.round(r.width * dpr); H = Math.round(r.height * dpr);
      cv.width = W; cv.height = H; drawFabric(); newStain();
    }
    function render() {
      if (dirty && W) { dirty = false; ctx.clearRect(0, 0, W, H); ctx.drawImage(fab, 0, 0); ctx.globalAlpha = fade; ctx.drawImage(st, 0, 0); ctx.globalAlpha = 1; }
      requestAnimationFrame(render);
    }
    function pos(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left), y: (e.clientY - r.top) }; }
    function wipe(a, b) {
      sctx.globalCompositeOperation = 'destination-out';
      sctx.lineCap = 'round'; sctx.lineJoin = 'round'; sctx.lineWidth = 44 * dpr; sctx.strokeStyle = 'rgba(0,0,0,.5)';
      sctx.beginPath(); sctx.moveTo(a.x * dpr, a.y * dpr); sctx.lineTo(b.x * dpr + .01, b.y * dpr); sctx.stroke();
      sctx.globalCompositeOperation = 'source-over';
      dirty = true;
      var now = performance.now(); if (now - checkT > 140) { checkT = now; check(); }
    }
    function movePen(p) { pen.style.transform = 'translate(' + (p.x - 13) + 'px,' + (p.y + 12) + 'px)'; }
    stage.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.try-reset')) return;
      down = true; last = pos(e); hint.classList.add('off'); pen.classList.add('on'); movePen(last); wipe(last, last);
      if (e.pointerType === 'mouse') stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', function (e) {
      var p = pos(e); movePen(p);
      if (e.pointerType === 'mouse') pen.classList.add('on');
      if (!down) return;
      wipe(last, p); last = p;
    });
    function up() { down = false; last = null; check(); }
    stage.addEventListener('pointerup', function (e) { up(); if (e.pointerType !== 'mouse') pen.classList.remove('on'); });
    stage.addEventListener('pointercancel', function () { up(); pen.classList.remove('on'); });
    stage.addEventListener('pointerleave', function () { pen.classList.remove('on'); if (down) up(); });
    stage.style.touchAction = 'pan-y';
    $('[data-try-reset]').addEventListener('click', function () { stage.classList.remove('is-done'); newStain(); });
    $$('[data-stain]').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-stain]').forEach(function (o) { o.setAttribute('aria-checked', String(o === b)); });
        color = b.dataset.stain; newStain();
      });
    });
    window.addEventListener('resize', resize);
    resize(); render();
  })();

  /* ---------- quantity steppers ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-qty] button'); if (!b || b.closest('.dr-items')) return;
    var o = $('output', b.parentNode), v = parseInt(o.textContent, 10) || 1;
    v = b === b.parentNode.firstElementChild ? Math.max(1, v - 1) : Math.min(20, v + 1);
    o.textContent = v;
  });

  /* ---------- scents hover expand ---------- */
  (function () {
    var wrap = $('[data-scents]'); if (!wrap || !FINE) return;
    var vs = $('.scents-vs', wrap);
    $$('.scent', wrap).forEach(function (s, i) {
      s.addEventListener('mouseenter', function () { wrap.classList.add('has-hover'); $$('.scent', wrap).forEach(function (o) { o.classList.toggle('is-hover', o === s); }); vs.style.left = i === 0 ? '56%' : '44%'; });
    });
    wrap.addEventListener('mouseleave', function () { wrap.classList.remove('has-hover'); $$('.scent', wrap).forEach(function (o) { o.classList.remove('is-hover'); }); vs.style.left = '50%'; });
    // subtle 3D tilt on product media
    $$('.scent-media', wrap).forEach(function (m) {
      m.addEventListener('mousemove', function (e) {
        var r = m.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        $$('img', m).forEach(function (im) { im.style.translate = (x * -14) + 'px ' + (y * -14) + 'px'; });
      });
      m.addEventListener('mouseleave', function () { $$('img', m).forEach(function (im) { im.style.translate = ''; }); });
    });
  })();

  /* ---------- cart ---------- */
  var cart = { linen: 0, santal: 0, duo: 0 };
  try { var saved = JSON.parse(store.get('fc-cart') || 'null'); if (saved) Object.keys(cart).forEach(function (k) { cart[k] = Math.max(0, parseInt(saved[k], 10) || 0); }); } catch (e) {}
  var drawer = $('[data-drawer]'), scrim = $('[data-scrim]');
  function cartCount() { return cart.linen + cart.santal + cart.duo; }
  function save() { store.set('fc-cart', JSON.stringify(cart)); }
  function renderCart() {
    var n = cartCount(), cnt = $('[data-cart-count]');
    cnt.textContent = n; cnt.classList.toggle('has', n > 0);
    $('[data-cart-open]').setAttribute('aria-label', 'Open cart, ' + n + ' item' + (n === 1 ? '' : 's'));
    $('[data-cart-n]').textContent = n ? '(' + n + ')' : '';
    var list = $('[data-dr-items]'), html = '', sub = 0;
    ['duo', 'linen', 'santal'].forEach(function (k) {
      if (!cart[k]) return;
      var p = P[k]; sub += p.price * cart[k];
      html += '<li><img src="' + p.img + '" alt=""><div><h3>' + p.name + '</h3><p class="dr-meta">' + esc(p.meta) + '</p>' +
        '<div class="qty" data-qty><button type="button" data-dq="-1" data-k="' + k + '" aria-label="Decrease ' + p.name + '">−</button><output>' + cart[k] + '</output><button type="button" data-dq="1" data-k="' + k + '" aria-label="Increase ' + p.name + '">+</button></div></div>' +
        '<div class="dr-p">' + money(p.price * cart[k]) + (p.compare ? '<br><s style="font-weight:500;opacity:.5;font-size:12px">' + money(p.compare * cart[k]) + '</s>' : '') + '<button type="button" class="dr-rm" data-rm="' + k + '">Remove</button></div></li>';
    });
    if (!n) html = '<li class="dr-empty" style="display:grid;grid-template-columns:1fr;border:0"><strong>Your stash is empty.</strong><span>Clean slate. Time to make a mess.</span><a class="btn btn-plum" href="#duo" data-close-go><span>Shop the Dangerous Duo</span></a></li>';
    list.innerHTML = html;
    $('[data-dr-sub]').textContent = money(sub);
    // savings/goal bar
    var goal = $('[data-dr-goal]'), bar = $('[data-dr-bar]');
    if (cart.duo) { goal.textContent = 'Nice. You\'re saving ' + money(2 * cart.duo) + ' with the Dangerous Duo.'; bar.style.width = '100%'; }
    else if (cart.linen && cart.santal) { goal.textContent = 'You have both scents. Swap to the Duo and save $2.'; bar.style.width = '85%'; }
    else if (n) { goal.textContent = 'Add the other scent as the Duo and save $2.'; bar.style.width = '50%'; }
    else { goal.textContent = 'Both scents together in the Duo save you $2.'; bar.style.width = '0%'; }
    // upsell
    var up = $('[data-dr-up]'), u = '';
    if (cart.linen && cart.santal) u = '<img src="images/duo-2.webp" alt=""><div><strong>Swap to the Dangerous Duo</strong>Same two pens, $2 less.</div><button type="button" class="btn btn-plum" data-swap><span>Swap</span></button>';
    else if ((cart.linen || cart.santal) && !cart.duo) { var other = cart.linen ? 'santal' : 'linen'; u = '<img src="' + P[other].img + '" alt=""><div><strong>Make it a Duo</strong>Add ' + P[other].name + ', pay $17.98 for both.</div><button type="button" class="btn btn-plum" data-upgrade="' + (cart.linen ? 'linen' : 'santal') + '"><span>+ $7.99</span></button>'; }
    up.innerHTML = u; up.hidden = !u;
    $('[data-checkout]').disabled = !n; $('[data-checkout]').style.opacity = n ? '' : '.45';
    save();
  }
  function openCart() { if (drawer.classList.contains('on')) return; drawer.classList.add('on'); scrim.classList.add('on'); drawer.setAttribute('aria-hidden', 'false'); lock(true); updateSticky(); setTimeout(function () { $('[data-cart-close]').focus({ preventScroll: true }); }, 100); }
  function closeCart() { if (!drawer.classList.contains('on')) return; drawer.classList.remove('on'); scrim.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); lock(false); updateSticky(); }
  function fly(from) {
    var btn = $('[data-cart-open]'); if (!from || RM || !btn.animate) return;
    var a = from.getBoundingClientRect(), b = btn.getBoundingClientRect();
    if (b.top < 0 || hdr.classList.contains('is-hidden')) { btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump'); return; }
    var d = document.createElement('span');
    d.style.cssText = 'position:fixed;z-index:400;width:16px;height:16px;border-radius:50%;background:#E3B182;box-shadow:0 0 0 4px rgba(227,177,130,.35);pointer-events:none;left:' + (a.left + a.width / 2 - 8) + 'px;top:' + (a.top + a.height / 2 - 8) + 'px';
    document.body.appendChild(d);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    d.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: 'translate(' + dx * .5 + 'px,' + (dy * .5 - 120) + 'px) scale(1.3)', offset: .5 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.4)' }], { duration: 750, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = function () { d.remove(); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump'); };
  }
  function add(k, q, from) {
    cart[k] = Math.min(99, cart[k] + q); renderCart(); fly(from);
    if (from && from.classList.contains('btn')) {
      var s = $('span', from), old = s.innerHTML; from.classList.add('is-added'); s.textContent = 'Added ✓';
      setTimeout(function () { from.classList.remove('is-added'); s.innerHTML = old; }, 1600);
    }
    setTimeout(openCart, RM ? 0 : 650);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-add]');
    if (a) {
      var box = a.closest('.buy, .duo-buy'), o = box && $('[data-qty] output', box);
      add(a.dataset.add, o ? parseInt(o.textContent, 10) || 1 : 1, a);
      return;
    }
    var dq = e.target.closest('[data-dq]');
    if (dq) { var k = dq.dataset.k; cart[k] = Math.max(0, cart[k] + parseInt(dq.dataset.dq, 10)); renderCart(); return; }
    var rm = e.target.closest('[data-rm]');
    if (rm) { cart[rm.dataset.rm] = 0; renderCart(); return; }
    if (e.target.closest('[data-swap]')) { var m = Math.min(cart.linen, cart.santal); cart.linen -= m; cart.santal -= m; cart.duo += m; renderCart(); toast('Swapped to the Dangerous Duo. You just saved ' + money(2 * m) + '.'); return; }
    var upg = e.target.closest('[data-upgrade]');
    if (upg) { cart[upg.dataset.upgrade] -= 1; cart.duo += 1; renderCart(); toast('Upgraded to the Dangerous Duo.'); return; }
    if (e.target.closest('[data-close-go]')) { closeCart(); return; }
    if (e.target.closest('[data-cart-open]')) { openCart(); return; }
    if (e.target.closest('[data-cart-close]') || e.target === scrim) { closeCart(); return; }
    if (e.target.closest('[data-checkout]')) { toast('Prototype: this button hands off to Shopify secure checkout.'); }
  });
  renderCart();

  /* ---------- quick view ---------- */
  var qv = $('[data-qv-modal]'), qvKey = null, qvLast = null;
  function openQV(k) {
    var p = P[k]; qvKey = k; qvLast = document.activeElement;
    $('[data-qv-tag]').textContent = p.tag; $('[data-qv-name]').textContent = p.name;
    $('[data-qv-price]').innerHTML = money(p.price) + (p.compare ? ' <s style="opacity:.5;font-size:16px">' + money(p.compare) + '</s>' : '');
    $('[data-qv-desc]').textContent = p.desc;
    $('[data-qv-list]').innerHTML = p.list.map(function (l) { return '<li><svg><use href="#i-check"/></svg>' + esc(l) + '</li>'; }).join('');
    var main = $('[data-qv-main]'); main.src = p.gallery[0]; main.alt = p.name;
    $('[data-qv-thumbs]').innerHTML = p.gallery.map(function (g, i) { return '<button type="button" aria-label="Image ' + (i + 1) + '" aria-current="' + (i === 0) + '" data-g="' + g + '"><img src="' + g + '" alt=""></button>'; }).join('');
    $('output', $('[data-qv-qty]')).textContent = 1;
    qv.classList.add('on'); qv.setAttribute('aria-hidden', 'false'); lock(true);
    setTimeout(function () { $('[data-qv-close]').focus({ preventScroll: true }); }, 80);
  }
  function closeQV() { if (!qv.classList.contains('on')) return; qv.classList.remove('on'); qv.setAttribute('aria-hidden', 'true'); lock(false); if (qvLast) qvLast.focus({ preventScroll: true }); }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-qv]'); if (b) { openQV(b.dataset.qv); return; }
    var g = e.target.closest('[data-g]');
    if (g) { $('[data-qv-main]').src = g.dataset.g; $$('[data-g]').forEach(function (o) { o.setAttribute('aria-current', String(o === g)); }); return; }
    if (e.target.closest('[data-qv-close]') || e.target === qv) { closeQV(); return; }
    var qa = e.target.closest('[data-qv-add]');
    if (qa) { var q = parseInt($('output', $('[data-qv-qty]')).textContent, 10) || 1; closeQV(); add(qvKey, q, null); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeQV(); closeCart(); menu(false); }
  });

  /* ---------- scent finder ---------- */
  (function () {
    var f = $('[data-finder]'); if (!f) return;
    var Q = [
      ['Your Sunday looks like…', 'Open windows, clean sheets', 'Candles lit, records on'],
      ['Your go-to order…', 'Iced coffee, extra oat milk', 'Red wine, the good bottle'],
      ['Pick a fit…', 'Crisp white linen shirt', 'Leather jacket, black denim']
    ];
    var i = 0, score = { linen: 0, santal: 0 }, qBox = $('[data-finder-q]'), rBox = $('[data-finder-r]'), res = 'linen';
    function show() {
      $('[data-fq-n]').textContent = i + 1; $('[data-fq-q]').textContent = Q[i][0];
      $('[data-fq-a]').textContent = Q[i][1]; $('[data-fq-b]').textContent = Q[i][2];
      if (window.gsap && !RM) gsap.fromTo(qBox.children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .06, duration: .5, ease: 'power3.out' });
    }
    $$('[data-pick]', f).forEach(function (b) {
      b.addEventListener('click', function () {
        score[b.dataset.pick]++; i++;
        if (i < Q.length) return show();
        res = score.linen >= score.santal ? 'linen' : 'santal';
        $('[data-fr-name]').textContent = P[res].name;
        $('[data-fr-why]').textContent = res === 'linen' ? 'Bright, airy and a little reckless. Fresh sheets, clean air, a little trouble.' : 'Warm, woody and anything but innocent. Creamy sandalwood with a moody edge.';
        qBox.hidden = true; rBox.hidden = false;
        if (window.gsap && !RM) gsap.from(rBox.children, { opacity: 0, y: 18, stagger: .08, duration: .6, ease: 'power3.out' });
        var card = $('[data-scent="' + res + '"]'); if (card) { card.classList.add('is-match'); setTimeout(function () { card.classList.remove('is-match'); }, 2400); }
      });
    });
    $('[data-fr-add]').addEventListener('click', function (e) { add(res, 1, e.currentTarget); });
    $('[data-finder-reset]').addEventListener('click', function () { i = 0; score = { linen: 0, santal: 0 }; rBox.hidden = true; qBox.hidden = false; show(); });
  })();

  /* ---------- how it works: active step ---------- */
  (function () {
    var steps = $$('.how-step'), imgs = $$('.how-img'), n = $('[data-how-n]'); if (!steps.length || !('IntersectionObserver' in window)) return;
    var cur = 0;
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        var i = +x.target.dataset.step; if (i === cur) return;
        steps.forEach(function (s, k) { s.classList.toggle('is-on', k <= i); });
        imgs.forEach(function (im, k) { im.classList.toggle('was', k === cur); im.classList.remove('is-on'); });
        void imgs[i].offsetWidth; imgs[i].classList.add('is-on'); cur = i;
        n.textContent = '0' + (i + 1);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { io.observe(s); });
  })();

  /* ---------- accordion with height animation ---------- */
  $$('[data-acc] details').forEach(function (d) {
    var s = $('summary', d), b = $('.acc-b', d);
    s.addEventListener('click', function (e) {
      if (RM || !b.animate) return;
      e.preventDefault();
      if (d.open) {
        var h = b.offsetHeight;
        b.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = function () { d.open = false; };
      } else {
        $$('[data-acc] details[open]').forEach(function (o) { if (o !== d) $('summary', o).click(); });
        d.open = true; var h2 = b.offsetHeight;
        b.animate([{ height: '0px', opacity: 0 }, { height: h2 + 'px', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
    });
  });

  /* ---------- email capture ---------- */
  $$('[data-sub]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = $('input', f), msg = $('[data-sub-msg]', f), v = inp.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { inp.classList.add('err'); msg.textContent = 'That email looks a little messy. Try again?'; inp.focus(); return; }
      inp.classList.remove('err');
      f.classList.add('done');
      f.innerHTML = '<p class="sub-ok" style="font:400 22px/1.4 var(--serif);color:var(--cream)">You\'re in, Filthy Animal. <span style="color:var(--gold)">Check your inbox for 20% off.</span></p>';
      store.set('fc-sub', '1');
    });
  });

  /* ---------- sticky buy bar ---------- */
  var sticky = $('[data-sticky]'), heroGone = false, blockers = new Set();
  function updateSticky() {
    var on = heroGone && !blockers.size && !drawer.classList.contains('on') && cart.duo === 0;
    sticky.classList.toggle('on', on); sticky.setAttribute('aria-hidden', String(!on));
    $('button', sticky).tabIndex = on ? 0 : -1;
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { heroGone = !en[0].isIntersecting && en[0].boundingClientRect.top < 0; updateSticky(); }).observe($('.hero'));
    var bo = new IntersectionObserver(function (en) { en.forEach(function (x) { x.isIntersecting ? blockers.add(x.target) : blockers.delete(x.target); }); updateSticky(); });
    ['#duo', '#join', '.ftr', '#shop .scents'].forEach(function (s) { var el = $(s); if (el) bo.observe(el); });
  }
  var _render = renderCart; renderCart = function () { _render(); updateSticky(); };

  /* ---------- magnetic buttons ---------- */
  if (FINE && !RM) $$('[data-magnetic]').forEach(function (b) {
    b.addEventListener('mousemove', function (e) {
      var r = b.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      b.style.transform = 'translate(' + x * .18 + 'px,' + y * .3 + 'px)';
    });
    b.addEventListener('mouseleave', function () { b.style.transform = ''; });
  });

  /* =========================================================
     GSAP choreography (progressive: page works without it)
     ========================================================= */
  function hidePre() { var p = $('[data-pre]'); if (p) p.remove(); document.body.classList.add('is-ready'); }
  (function initFx() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST || RM) {
      hidePre(); document.documentElement.classList.add('no-js-fx');
      if (scrub) $$('.w', scrub).forEach(function (w) { w.style.opacity = 1; });
      return;
    }
    gsap.registerPlugin(ST);

    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, prevent: function (n) { return !!(n.closest && n.closest('.drawer, .qv, .mnav, .meet-track')); } });
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      if (locks) lenis.stop();
    }

    /* --- preloader + hero intro --- */
    var first = !store.get('fc-pre', true);
    store.set('fc-pre', '1', true);
    var heroWords = $$('.hero-h .wi');
    gsap.set(heroWords, { yPercent: 115 });
    gsap.set('.hero-splat', { scale: 0, transformOrigin: '50% 50%' });
    gsap.set(['.hero .kick', '.hero-lede', '.hero-ctas > *', '.hero-proof li'], { y: 26, opacity: 0 });
    gsap.set('.hero-frame', { clipPath: 'inset(100% 0% 0% 0% round 240px 240px 16px 16px)' });
    gsap.set('.hv-thumbs button', { scale: 0 });
    gsap.set('.hero-badge', { scale: 0, rotate: -120 });
    gsap.set('.hero-chip', { x: -40, opacity: 0 });

    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    if (first) {
      gsap.set('.pre-stain', { scale: 0, transformOrigin: '50% 50%' });
      gsap.set('.pre-logo', { opacity: 0, scale: .9 });
      tl.to('.pre-stain', { scale: 1, duration: .55, ease: 'back.out(2)' })
        .from('.pre-line', { opacity: 0, y: 10, duration: .5 }, '<.1')
        .to('.pre-wipe', { opacity: 1, duration: .1 }, '+=.05')
        .fromTo('.pre-wipe', { left: '-40%' }, { left: '140%', duration: .75, ease: 'power2.inOut' }, '<')
        .to('.pre-stain', { clipPath: 'inset(0 0 0 100%)', duration: .75, ease: 'power2.inOut' }, '<')
        .to('.pre-logo', { opacity: 1, scale: 1, duration: .6, ease: 'power2.out' }, '<.25')
        .to('.pre', { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'expo.inOut' }, '+=.15');
    } else {
      tl.to('.pre', { opacity: 0, duration: .25 });
    }
    tl.add(hidePre)
      .to('.hero-frame', { clipPath: 'inset(0% 0% 0% 0% round 240px 240px 16px 16px)', duration: 1.4, ease: 'expo.out' }, '-=.45')
      .fromTo('.hv-img.is-on', { scale: 1.3 }, { scale: 1, duration: 2, ease: 'expo.out', clearProps: 'transform' }, '<')
      .to(heroWords, { yPercent: 0, duration: 1.1, stagger: .08 }, '<.1')
      .to('.hero-splat', { scale: 1, duration: 1, ease: 'elastic.out(1, .55)' }, '<.35')
      .to('.hero .kick', { y: 0, opacity: 1, duration: .8 }, '<-.2')
      .to('.hero-lede', { y: 0, opacity: 1, duration: .9 }, '<.35')
      .to('.hero-ctas > *', { y: 0, opacity: 1, duration: .9, stagger: .08 }, '<.1')
      .to('.hero-proof li', { y: 0, opacity: 1, duration: .8, stagger: .06 }, '<.1')
      .to('.hv-thumbs button', { scale: 1, duration: .8, stagger: .07, ease: 'back.out(2)' }, '<-.3')
      .to('.hero-badge', { scale: 1, rotate: 0, duration: 1.2, ease: 'back.out(1.6)' }, '<')
      .to('.hero-chip', { x: 0, opacity: 1, duration: 1, ease: 'expo.out' }, '<.1')
      .add(function () { gsap.set(['.hero-ctas > *', '.hero-proof li'], { clearProps: 'transform' }); });
    setTimeout(function () { if ($('[data-pre]')) { tl.progress(1); hidePre(); } }, 6000);

    // hero parallax + chip float
    gsap.to('.hero-frame', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-copy', { yPercent: -10, opacity: .4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center center', end: 'bottom top', scrub: true } });
    gsap.to('.hero-chip', { y: -10, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3 });

    /* --- generic reveals --- */
    $$('[data-split]').forEach(function (h) {
      gsap.from($$('.wi', h), { yPercent: 115, duration: 1.1, stagger: .05, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
    });
    $$('main .kick, .sec-head .lede, .mess-head .lede, .try-copy > .lede, .try-chips, .try-meter, .duo-copy > *:not(h2), .meet-head .lede, .faq-more, .join .lede, .sub, .join .fine').forEach(function (el) {
      if (el.closest('.hero')) return;
      gsap.from(el, { opacity: 0, y: 24, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    function rise(sel, trig, extra) {
      if (!$$(sel).length) return;
      gsap.from(sel, Object.assign({ opacity: 0, y: 60, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: trig || sel, start: 'top 86%', once: true } }, extra || {}));
    }
    rise('.mess-list li', '.mess-list', { y: 40, stagger: .07 });
    rise('.scent', '.scents', { y: 80, stagger: .15 });
    rise('.scents-vs span', '.scents', { y: 0, scale: 0, ease: 'back.out(2)', delay: .5 });
    rise('.finder', '.finder', { y: 40 });
    rise('.without li', '.without', { y: 50, stagger: .08 });
    rise('.cmp-row', '.cmp', { y: 24, stagger: .06 });
    rise('.acc details', '.acc', { y: 24, stagger: .06 });
    rise('.post', '.spill', { y: 50 });
    rise('.ftr-cols > div', '.ftr', { y: 30, stagger: .08 });

    /* manifesto word scrub */
    if (scrub) {
      var ws = $$('.w', scrub);
      ST.create({ trigger: scrub, start: 'top 80%', end: 'bottom 45%', scrub: true, onUpdate: function (s) {
        var n = s.progress * ws.length * 1.05;
        ws.forEach(function (w, i) { w.style.opacity = Math.max(.14, Math.min(1, n - i + .14)); });
      } });
    }

    /* try-it stage */
    gsap.fromTo('.try-stage', { clipPath: 'inset(12% 12% 12% 12% round 28px)', scale: .94 }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', scale: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.try-stage', start: 'top 85%', once: true } });
    gsap.from('.try', { borderRadius: '120px 120px 0 0', ease: 'none', scrollTrigger: { trigger: '.try', start: 'top bottom', end: 'top 30%', scrub: true } });

    /* duo */
    gsap.fromTo('.duo-frame', { clipPath: 'inset(100% 0 0 0 round 28px)' }, { clipPath: 'inset(0% 0 0 0 round 28px)', duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: '.duo-frame', start: 'top 80%', once: true } });
    gsap.fromTo('.duo-frame img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.duo', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.duo-sticker b, .duo-sticker span', { scale: 0, duration: 1, ease: 'back.out(2)', stagger: .1, scrollTrigger: { trigger: '.duo-frame', start: 'top 70%', once: true } });
    gsap.fromTo('.duo-sticker', { rotate: -14 }, { rotate: 22, ease: 'none', scrollTrigger: { trigger: '.duo', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.duo-mini-a', { x: -60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.duo-frame', start: 'top 60%', once: true } });
    gsap.from('.duo-mini-b', { x: 60, opacity: 0, duration: 1, ease: 'expo.out', delay: .15, scrollTrigger: { trigger: '.duo-frame', start: 'top 60%', once: true } });
    gsap.to('.duo-mini-a', { y: -12, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.duo-mini-b', { y: 12, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    var cnt = $('[data-count]');
    if (cnt) { var o = { v: 0 }; gsap.to(o, { v: 17.98, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: cnt, start: 'top 90%', once: true }, onUpdate: function () { cnt.textContent = o.v.toFixed(2); } }); }

    /* how: frame entrance */
    gsap.from('.how-frame', { clipPath: 'inset(20% 20% 20% 20% round 28px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.how-grid', start: 'top 80%', once: true } });

    /* formula: strikes draw on */
    gsap.fromTo('.wo-strike', { '--s': 0 }, { '--s': 1, duration: .6, stagger: .12, ease: 'power2.out', scrollTrigger: { trigger: '.without', start: 'top 75%', once: true }, delay: .5 });

    /* join stains drift + footer word */
    gsap.to('.join-stains i:nth-child(1)', { x: 80, y: 60, rotate: 20, ease: 'none', scrollTrigger: { trigger: '.join', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.to('.join-stains i:nth-child(2)', { x: -60, y: -80, rotate: -25, ease: 'none', scrollTrigger: { trigger: '.join', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.join-spark', { rotate: -180, scale: 0, duration: 1.2, ease: 'back.out(2)', scrollTrigger: { trigger: '.join', start: 'top 75%', once: true } });
    gsap.fromTo('.ftr-word', { xPercent: 8 }, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '.ftr', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    /* meet the pen: pinned horizontal scroll on desktop */
    var mm = gsap.matchMedia();
    mm.add('(min-width: 961px)', function () {
      var track = $('[data-meet-track]');
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth + 40); };
      var tw = gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: '[data-meet-pin]', start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1 } });
      $$('.mc-img img', track).forEach(function (im) {
        gsap.fromTo(im, { scale: 1.25, xPercent: -6 }, { scale: 1.05, xPercent: 6, ease: 'none', scrollTrigger: { trigger: im.closest('.mc'), containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
      });
      return function () { gsap.set(track, { clearProps: 'transform' }); };
    });
    mm.add('(max-width: 960px)', function () { rise('.mc', '.meet-track', { y: 40, stagger: .08 }); });

    // refresh after fonts/images settle
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
    window.addEventListener('load', function () { ST.refresh(); });
  })();

  /* safety net: never leave the preloader up */
  setTimeout(function () { if (!window.gsap) hidePre(); }, 2500);
})();
