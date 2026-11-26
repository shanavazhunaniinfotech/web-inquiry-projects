/* FowlMouth Outdoors — shared prototype engine (cart, cards, PDP, notes, popups).
   Both design concepts use this file; only markup + CSS differ. */
(function () {
  'use strict';
  var P = window.FM_PRODUCTS || [];
  var CDN = window.FM_CDN;
  var BODY = document.body;
  var ROOT = BODY.getAttribute('data-root') || '';         // relative path to the client root
  var VER = BODY.getAttribute('data-v') || 'a';            // a | b
  var PAGE = BODY.getAttribute('data-page') || 'home';     // home | pdp
  var PDP = BODY.getAttribute('data-pdp') || 'product/';   // relative path to this concept's PDP
  var FREE_SHIP = 65;
  var HOME = ROOT + (VER === 'b' ? 'b/' : '');
  var MAP = {};
  P.forEach(function (p) { MAP[p.h] = p; });

  /* ---------- helpers ---------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function img(p, i, w) {
    var s = p.img[i] || p.img[0];
    return CDN + s + (s.indexOf('?') > -1 ? '&' : '?') + 'width=' + (w || 600) + '&format=pjpg';
  }
  function money(n) { return '$' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, ''); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  // SAMPLE ratings (deterministic) — replace with Judge.me / Okendo data on the live store
  function rating(p) { var h = hash(p.h); return { r: (4.7 + (h % 4) / 10).toFixed(1), n: 18 + (h % 140) }; }
  function stars(r) {
    var out = '', full = Math.round(r);
    for (var i = 0; i < 5; i++) out += '<svg viewBox="0 0 20 20" aria-hidden="true" class="' + (i < full ? 'on' : '') + '"><path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z"/></svg>';
    return '<span class="stars" aria-label="' + r + ' out of 5">' + out + '</span>';
  }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function multi(p) { return p.o.filter(function (o) { return o.v.length > 1; }); }
  function firstAvail(p) { for (var i = 0; i < p.v.length; i++) if (p.v[i].a) return p.v[i]; return p.v[0]; }
  function colorsCount(p) { var c = p.o.filter(function (o) { return o.n !== 'Size' && o.v.length > 1; })[0]; return c ? c.v.length : 0; }

  // Curated groupings (proposed collection structure for the store)
  var GROUPS = {
    best: ['duckin-raw', 'untitled-sep1_16-51-40', 'the-benavides-bobcat', 'teal-szn', 'fowlmouth-blackout-pearl-snap-button-up', 'flyrack', 'gsp-hunter', 'fowlmouth-hoodie'],
    newest: ['the-benavides-bobcat', 'jingle-my-bells-humor-hat-by-fm', 'after-hours-tee', 'teal-szn', 'untitled-sep1_16-51-40', 'the-good-boy', 'thermal-yote', 'sandhill-crane'],
    waterfowl: ['teal-szn', 'duckin-raw', 'duckin-raw-fowlmouth', 'fowlmouth-outdoors-duck', 'flyrack', 'fowlmouth-feather-1', 'fmo-outdoors', 'sandhill-crane', 'fowl-otdr', 'fowlmouth-outdoor'],
    upland: ['untitled-sep1_16-51-40', 'the-benavides-bobcat', 'thermal-yote', 'gsp-hunter', 'the-good-boy', 'hogs-dogs', 'seed-and-breed', 'fowl-otdr-1'],
    saltwater: ['the-marlin', 'texas-redfish', 'crawfish-szn', 'vintage-fm', 'punchy-spade', 'purple-spade', 'spade-with-fm', 'camo-puffed-fowlmouth'],
    texas: ['southeast-tx-fowl', 'green-and-gold-tx-fowlmouth', 'dos-gringos-fm', 'darlin', 'livin', 'fowlest-behavior', 'limits', 'jingle-my-bells-humor-hat-by-fm'],
    hats: null, apparel: null, decal: null
  };
  var HIDE_FROM_HOME = ['cuntry', 'horny', 'my-little-woody', 'hat-of-the-month-2'];
  function group(key) {
    if (key === 'hats') return P.filter(function (p) { return p.ty === 'hat' && HIDE_FROM_HOME.indexOf(p.h) < 0; });
    if (key === 'apparel') return P.filter(function (p) { return p.ty === 'apparel'; });
    if (key === 'decal') return P.filter(function (p) { return p.ty === 'decal'; });
    return (GROUPS[key] || []).map(function (h) { return MAP[h]; }).filter(Boolean);
  }
  function badgeFor(p) {
    if (!p.av) return '<span class="badge badge-out">Sold out</span>';
    if (GROUPS.best.indexOf(p.h) > -1 && GROUPS.best.indexOf(p.h) < 3) return '<span class="badge badge-hot">Best seller</span>';
    if (GROUPS.newest.slice(0, 4).indexOf(p.h) > -1) return '<span class="badge badge-new">New</span>';
    if (p.v.some(function (v) { return !v.a; })) return '<span class="badge badge-low">Selling fast</span>';
    return '';
  }

  /* ---------- product card ---------- */
  function card(p) {
    var rt = rating(p), m = multi(p), qa, opt = m[0];
    if (p.ty === 'sub') return '';
    if (opt && p.av) {
      qa = '<div class="qa" role="group" aria-label="Quick add ' + esc(opt.n) + '"><span class="qa-l">Quick add · ' + esc(opt.n) + '</span><div class="qa-chips">' +
        opt.v.map(function (val) {
          var ok = p.v.some(function (v) { return v.o[p.o.indexOf(opt)] === val && v.a; });
          return '<button type="button" class="qa-chip" data-qa="' + p.h + '" data-val="' + esc(val) + '"' + (ok ? '' : ' disabled') + '>' + esc(val) + '</button>';
        }).join('') + '</div></div>';
    } else if (p.av) {
      qa = '<button type="button" class="qa-btn" data-qa="' + p.h + '" aria-label="Quick add ' + esc(p.t) + '"><i>+</i><span>Quick add</span></button>';
    } else qa = '';
    var cc = colorsCount(p);
    return '<article class="pcard" data-h="' + p.h + '" data-ty="' + p.ty + '">' +
      '<div class="pcard-mw"><a class="pcard-media" href="' + PDP + '?p=' + p.h + '" aria-label="' + esc(p.t) + '">' +
      '<img loading="lazy" src="' + img(p, 0, 600) + '" alt="' + esc(p.t) + ' hat by FowlMouth Outdoors" width="600" height="600">' +
      (p.img[1] ? '<img loading="lazy" class="alt" src="' + img(p, 1, 600) + '" alt="" width="600" height="600">' : '') +
      badgeFor(p) + '</a>' + qa + '</div>' +
      '<div class="pcard-body"><a href="' + PDP + '?p=' + p.h + '" class="pcard-t">' + esc(p.t) + '</a>' +
      '<div class="pcard-meta">' + stars(rt.r) + '<span class="rc">(' + rt.n + ')</span></div>' +
      '<div class="pcard-row"><span class="price">' + money(p.p) + '</span>' + (cc ? '<span class="cc">' + cc + ' colors</span>' : '') + '</div></div></article>';
  }
  function renderGrid(el, list, limit) {
    el.innerHTML = list.slice(0, limit || 8).map(card).join('');
    reveal(el);
  }

  /* ---------- cart ---------- */
  var cart = store('fm_cart') || [];
  function lineKey(l) { return l.h + '|' + l.o.join('/'); }
  function save() { store('fm_cart', cart); paintCart(); }
  function subtotal() { return cart.reduce(function (s, l) { var p = MAP[l.h]; return s + (p ? p.p * l.q : 0); }, 0); }
  function count() { return cart.reduce(function (s, l) { return s + l.q; }, 0); }
  function add(h, o, q, silent) {
    var p = MAP[h]; if (!p) return;
    o = o || firstAvail(p).o;
    var k = h + '|' + o.join('/'), f = cart.filter(function (l) { return lineKey(l) === k; })[0];
    if (f) f.q += (q || 1); else cart.push({ h: h, o: o, q: q || 1 });
    save();
    if (!silent) openCart(p);
  }
  function paintCart() {
    $$('[data-cart-count]').forEach(function (e) { e.textContent = count(); e.classList.toggle('has', count() > 0); });
    var list = $('#cart-lines'); if (!list) return;
    var st = subtotal(), left = Math.max(0, FREE_SHIP - st), pct = Math.min(100, st / FREE_SHIP * 100);
    $('#cart-ship').innerHTML = left > 0 ? 'You’re <b>' + money(left) + '</b> away from <b>free shipping</b>' : '<b>Nice — you’ve unlocked free shipping.</b>';
    $('#cart-bar').style.width = pct + '%';
    if (!cart.length) {
      list.innerHTML = '<div class="cart-empty"><p>Your cart is empty.</p><a class="btn btn-primary" href="' + ROOT + '#shop" data-close-cart>Shop best sellers</a></div>';
    } else {
      list.innerHTML = cart.map(function (l, i) {
        var p = MAP[l.h]; if (!p) return '';
        var vi = p.v.filter(function (v) { return v.o.join('/') === l.o.join('/'); })[0], ii = vi && vi.i > -1 ? vi.i : 0;
        var label = l.o.filter(function (x) { return x && x !== 'Default Title' && x !== 'UV protection'; }).join(' / ');
        return '<div class="cl"><img src="' + img(p, ii, 200) + '" alt="" width="72" height="72"><div class="cl-i"><b>' + esc(p.t) + '</b>' + (label ? '<span>' + esc(label) + '</span>' : '') +
          '<div class="qty"><button type="button" data-q="' + i + '" data-d="-1" aria-label="Decrease">−</button><span>' + l.q + '</span><button type="button" data-q="' + i + '" data-d="1" aria-label="Increase">+</button></div></div>' +
          '<div class="cl-r"><b>' + money(p.p * l.q) + '</b><button type="button" class="link" data-rm="' + i + '">Remove</button></div></div>';
      }).join('');
    }
    // upsell: decal first (low-friction $10 add-on that usually tips the order over free shipping), else a best seller
    var up = $('#cart-upsell');
    if (up) {
      var inCart = cart.map(function (l) { return l.h; });
      var cand = ['truck-decal', 'teal-szn', 'duckin-raw', 'the-benavides-bobcat', 'untitled-sep1_16-51-40'].filter(function (h) { return inCart.indexOf(h) < 0; })[0];
      var u = MAP[cand];
      up.innerHTML = u && cart.length ? '<p class="up-h">' + (left > 0 && u.p >= left ? 'Add this & ship free' : 'Pairs well with your order') + '</p><div class="up"><img src="' + img(u, 0, 160) + '" alt="" width="56" height="56"><div><b>' + esc(u.t) + '</b><span>' + money(u.p) + '</span></div><button type="button" class="btn btn-sm" data-qa="' + u.h + '" data-silent="1">+ Add</button></div>' : '';
    }
    $('#cart-total').textContent = money(st);
    $('#cart-pay4') && ($('#cart-pay4').textContent = st ? 'or 4 interest-free payments of ' + money(st / 4) + ' with Shop Pay' : '');
  }
  function openCart() {
    var d = $('#cart'); if (!d) return;
    d.classList.add('open'); d.setAttribute('aria-hidden', 'false'); BODY.classList.add('lock');
    setTimeout(function () { var b = $('.cart-x', d); b && b.focus(); }, 50);
  }
  function closeCart() { var d = $('#cart'); if (!d) return; d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); BODY.classList.remove('lock'); }
  function cartShell() {
    if ($('#cart')) return;
    var d = document.createElement('div');
    d.id = 'cart'; d.className = 'cart'; d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<div class="cart-bg" data-close-cart></div><aside class="cart-p" role="dialog" aria-modal="true" aria-label="Your cart">' +
      '<header class="cart-h"><h2>Your cart <span data-cart-count></span></h2><button type="button" class="cart-x" data-close-cart aria-label="Close cart">✕</button></header>' +
      '<div class="cart-ship"><p id="cart-ship"></p><div class="bar"><i id="cart-bar"></i></div></div>' +
      '<div class="cart-lines" id="cart-lines"></div><div id="cart-upsell" class="cart-upsell"></div>' +
      '<footer class="cart-f"><div class="cart-tot"><span>Subtotal</span><b id="cart-total">$0</b></div><p class="cart-pay4" id="cart-pay4"></p>' +
      '<button type="button" class="btn btn-primary btn-block" data-checkout>Secure checkout</button>' +
      '<button type="button" class="btn btn-shop btn-block" data-checkout aria-label="Buy with Shop Pay">Buy with <b>shop</b><span class="pay">Pay</span></button>' +
      '<p class="cart-trust">🔒 Secure checkout · 15-day returns · Damaged? We’ll make it right</p></footer></aside>';
    BODY.appendChild(d);
  }

  /* ---------- toast ---------- */
  function toast(msg) {
    var t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); BODY.appendChild(t); }
    t.textContent = msg; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('on'); }, 2600);
  }

  /* ---------- global clicks ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-qa],[data-close-cart],[data-open-cart],[data-q],[data-rm],[data-checkout],[data-filter],[data-acc],[data-copy]');
    if (!t) return;
    if (t.hasAttribute('data-qa')) {
      var p = MAP[t.getAttribute('data-qa')], val = t.getAttribute('data-val'), o;
      if (val) { var opt = multi(p)[0], idx = p.o.indexOf(opt); var v = p.v.filter(function (v) { return v.o[idx] === val && v.a; })[0]; o = v && v.o; }
      add(p.h, o, 1, !!t.getAttribute('data-silent'));
      if (t.getAttribute('data-silent')) toast(p.t + ' added');
    } else if (t.hasAttribute('data-close-cart')) { closeCart(); }
    else if (t.hasAttribute('data-open-cart')) { e.preventDefault(); openCart(); }
    else if (t.hasAttribute('data-q')) { var l = cart[+t.getAttribute('data-q')]; l.q += +t.getAttribute('data-d'); if (l.q < 1) cart.splice(+t.getAttribute('data-q'), 1); save(); }
    else if (t.hasAttribute('data-rm')) { cart.splice(+t.getAttribute('data-rm'), 1); save(); }
    else if (t.hasAttribute('data-checkout')) { toast('Prototype: this opens Shopify checkout on the live store'); }
    else if (t.hasAttribute('data-filter')) { setFilter(t.getAttribute('data-filter'), t); }
    else if (t.hasAttribute('data-acc')) { var it = t.closest('.acc-i'); var open = it.classList.toggle('open'); t.setAttribute('aria-expanded', open); }
    else if (t.hasAttribute('data-copy')) { try { navigator.clipboard.writeText(t.getAttribute('data-copy')); } catch (x) {} toast('Code copied: ' + t.getAttribute('data-copy')); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeCart(); closeModal(); } });

  /* ---------- shop filter tabs (home) ---------- */
  function setFilter(key, btn) {
    var grid = $('#shop-grid'); if (!grid) return;
    $$('[data-filter]').forEach(function (b) { var on = b.getAttribute('data-filter') === key; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    var lim = +(grid.getAttribute('data-limit') || 8);
    renderGrid(grid, key === 'best' ? group('best') : group(key), lim);
    var all = $('#shop-all'); if (all) { var n = group(key === 'best' ? 'hats' : key).length; all.textContent = 'View all ' + (key === 'best' || key === 'hats' ? group('hats').length + ' hats' : n + ' styles') + ' →'; }
    if (btn && btn.hasAttribute('data-scroll')) { var s = $('#shop'); s && s.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
  function hashFilter() {
    var m = location.hash.match(/^#shop-(\w+)/);
    if (m && $('#shop-grid')) { setFilter(m[1]); var s = $('#shop'); s && setTimeout(function () { s.scrollIntoView({ block: 'start' }); }, 60); }
  }

  /* ---------- reveal ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  function reveal(scope) { $$('[data-reveal], .pcard', scope).forEach(function (el, i) { if (!io) return el.classList.add('in'); el.style.transitionDelay = (el.classList.contains('pcard') ? (i % 4) * 60 : 0) + 'ms'; io.observe(el); }); }

  /* ---------- modal (email capture) ---------- */
  function closeModal() { var m = $('.modal.open'); if (m) { m.classList.remove('open'); BODY.classList.remove('lock'); } }
  function emailPopup() {
    var m = $('#pop'); if (!m || /notes=1/.test(location.search)) return;
    var shown = false;
    try { if (sessionStorage.getItem('fm_pop')) return; } catch (e) {}
    function show() { if (shown || $('#cart.open')) return; shown = true; m.classList.add('open'); BODY.classList.add('lock'); try { sessionStorage.setItem('fm_pop', 1); } catch (e) {} }
    setTimeout(show, 28000);
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY < 8) show(); });
    window.addEventListener('scroll', function () { if (window.innerWidth < 760 && scrollY > document.body.scrollHeight * 0.55) show(); }, { passive: true });
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-close-modal]')) closeModal(); });
  }
  $$('form[data-email]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = $('input[type=email]', f);
      if (!inp.value || !/.+@.+\..+/.test(inp.value)) { inp.focus(); inp.setAttribute('aria-invalid', 'true'); return; }
      f.innerHTML = '<p class="ok">You’re in. Use code <button type="button" class="code" data-copy="FOWL10">FOWL10</button> for 10% off your first order.</p>';
    });
  });

  /* ---------- Hat of the Month plan toggle + cut-off ---------- */
  $$('[data-plan]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-plan]').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); });
      var cta = $('#hotm-cta'); if (cta) cta.textContent = b.getAttribute('data-plan') === '6' ? 'Start 6 months — $150 (save $30)' : 'Start monthly — $30/mo';
    });
  });
  var hc = $('#hotm-cta'); hc && hc.addEventListener('click', function () { add('hat-of-the-month-2'); });
  function cutoff() {
    var el = $$('[data-cutoff]'); if (!el.length) return;
    var now = new Date(), c = new Date(now.getFullYear(), now.getMonth(), 20, 23, 59);
    if (now > c) c = new Date(now.getFullYear(), now.getMonth() + 1, 20, 23, 59);
    var mo = c.toLocaleString('en-US', { month: 'long' });
    var nextMo = new Date(c.getFullYear(), c.getMonth() + 1, 1).toLocaleString('en-US', { month: 'long' });
    function tick() {
      var d = c - new Date(), dd = Math.floor(d / 864e5), hh = Math.floor(d / 36e5) % 24, mm = Math.floor(d / 6e4) % 60;
      el.forEach(function (e) { e.innerHTML = 'Join by <b>' + mo + ' 20</b> for the <b>' + nextMo + '</b> drop · <span class="cd">' + dd + 'd ' + hh + 'h ' + mm + 'm</span>'; });
    }
    tick(); setInterval(tick, 30000);
  }

  /* ---------- recently viewed ---------- */
  function recent(h) {
    var r = store('fm_recent') || [];
    if (h) { r = r.filter(function (x) { return x !== h; }); r.unshift(h); r = r.slice(0, 10); store('fm_recent', r); }
    return r.map(function (x) { return MAP[x]; }).filter(Boolean);
  }
  function paintRecent(exclude) {
    var w = $('#recent'); if (!w) return;
    var list = recent().filter(function (p) { return p.h !== exclude; });
    if (!list.length) { w.hidden = true; return; }
    w.hidden = false; renderGrid($('.grid', w), list, 4);
  }

  /* ---------- delivery estimate ---------- */
  function addBiz(d, n) { d = new Date(d); while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) n--; } return d; }
  function fmt(d) { return d.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }
  function delivery() {
    var el = $$('[data-delivery]'); if (!el.length) return;
    var now = new Date(), cut = new Date(now); cut.setHours(14, 0, 0, 0);
    var shipToday = now < cut && now.getDay() % 6;
    var left = cut - now, hh = Math.floor(left / 36e5), mm = Math.floor(left / 6e4) % 60;
    var a = addBiz(now, shipToday ? 3 : 4), b = addBiz(now, shipToday ? 5 : 6);
    el.forEach(function (e) {
      e.innerHTML = (shipToday ? 'Order within <b>' + hh + 'h ' + mm + 'm</b> to ship today. ' : 'Ships next business day. ') + 'Arrives <b>' + fmt(a) + ' – ' + fmt(b) + '</b>';
    });
  }

  /* ---------- PDP ---------- */
  function pdp() {
    var q = new URLSearchParams(location.search).get('p');
    var p = MAP[q] || MAP['duckin-raw'];
    var sel = firstAvail(p).o.slice();
    var rt = rating(p);
    document.title = p.t + ' — FowlMouth Outdoors';
    recent(p.h);
    $$('[data-p-title]').forEach(function (e) { e.textContent = p.t; });
    $$('[data-p-price]').forEach(function (e) { e.textContent = money(p.p); });
    $$('[data-p-pay4]').forEach(function (e) { e.textContent = money(p.p / 4); });
    $$('[data-p-rating]').forEach(function (e) { e.innerHTML = stars(rt.r) + '<span><b>' + rt.r + '</b> · ' + rt.n + ' reviews</span>'; });
    $$('[data-p-type]').forEach(function (e) { e.textContent = p.ty === 'hat' ? 'Hats' : p.ty === 'apparel' ? 'Apparel' : p.ty === 'decal' ? 'Decals' : 'Hat of the Month'; });
    $$('[data-p-crumb]').forEach(function (e) { e.setAttribute('href', HOME + '#shop-' + (p.ty === 'hat' ? 'hats' : p.ty)); });
    $$('[data-p-badge]').forEach(function (e) { e.innerHTML = badgeFor(p); });
    $$('[data-p-desc]').forEach(function (e) {
      var d = p.d && p.d.length > 30 ? p.d : (p.ty === 'hat' ? (p.d ? p.d + '. ' : '') + 'Clean, raised embroidery on a premium cap that holds its shape from the blind to the bar. Designed in Southeast Texas.' : p.d || '');
      e.textContent = d;
    });
    $$('[data-hat-only]').forEach(function (e) { e.hidden = p.ty !== 'hat'; });
    $$('[data-apparel-only]').forEach(function (e) { e.hidden = p.ty !== 'apparel'; });
    var bigRt = $('#rev-score'); if (bigRt) { bigRt.textContent = rt.r; $('#rev-stars').innerHTML = stars(rt.r); $('#rev-count').textContent = 'Based on ' + rt.n + ' reviews'; }

    // gallery
    var track = $('#pdp-track'), thumbs = $('#pdp-thumbs'), dots = $('#pdp-dots');
    track.innerHTML = p.img.map(function (s, i) {
      return '<div class="slide" data-i="' + i + '"><img src="' + img(p, i, 1100) + '" srcset="' + img(p, i, 600) + ' 600w, ' + img(p, i, 1100) + ' 1100w, ' + img(p, i, 1600) + ' 1600w" sizes="(max-width: 860px) 100vw, 60vw" alt="' + esc(p.t) + ' — photo ' + (i + 1) + '" ' + (i ? 'loading="lazy"' : 'fetchpriority="high"') + ' width="1100" height="1100"></div>';
    }).join('');
    if (thumbs) thumbs.innerHTML = p.img.map(function (s, i) { return '<button type="button" data-go="' + i + '" aria-label="Show photo ' + (i + 1) + '"><img src="' + img(p, i, 160) + '" alt="" width="80" height="80" loading="lazy"></button>'; }).join('');
    if (dots) dots.innerHTML = p.img.length > 1 ? p.img.map(function (s, i) { return '<i data-go="' + i + '"></i>'; }).join('') : '';
    function go(i, smooth) {
      var s = track.children[i]; if (!s) return;
      var vertical = getComputedStyle(track).getPropertyValue('--stack').trim() === '1';
      if (vertical) { // stacked gallery: show the chosen variant in the lead slot instead of jumping the page
        var lead = $('img', track.children[0]);
        lead.removeAttribute('srcset'); lead.src = img(p, i, 1100); lead.alt = p.t + ' \u2014 selected option';
        return;
      } track.scrollTo({ left: s.offsetLeft - track.offsetLeft, behavior: smooth === false ? 'auto' : 'smooth' });
      mark(i);
    }
    function mark(i) {
      thumbs && $$('button', thumbs).forEach(function (b, k) { b.classList.toggle('on', k === i); });
      dots && $$('i', dots).forEach(function (b, k) { b.classList.toggle('on', k === i); });
    }
    mark(0);
    track.addEventListener('scroll', function () { var i = Math.round(track.scrollLeft / (track.clientWidth || 1)); mark(i); }, { passive: true });
    [thumbs, dots].forEach(function (w) { w && w.addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); b && go(+b.getAttribute('data-go')); }); });
    $$('[data-gal]').forEach(function (b) { b.addEventListener('click', function () { var i = Math.round(track.scrollLeft / track.clientWidth) + (+b.getAttribute('data-gal')); go((i + p.img.length) % p.img.length); }); });

    // options
    var box = $('#pdp-options');
    function avail(idx, val) {
      return p.v.some(function (v) { return v.a && v.o[idx] === val && v.o.every(function (x, k) { return k === idx || p.o[k].v.length < 2 || x === sel[k]; }); });
    }
    function current() { return p.v.filter(function (v) { return v.o.join('/') === sel.join('/'); })[0]; }
    function paintOpts() {
      box.innerHTML = p.o.map(function (o, idx) {
        if (o.v.length < 2) return '';
        var isSwatch = o.n !== 'Size';
        return '<fieldset class="opt"><legend>' + esc(o.n === 'Hat type' ? 'Style' : o.n) + ': <b>' + esc(sel[idx]) + '</b>' + (o.n === 'Size' ? '<button type="button" class="link" data-open-fit>Size guide</button>' : '') + '</legend><div class="opt-v ' + (isSwatch ? 'sw' : 'sz') + '">' +
          o.v.map(function (val) {
            var ok = avail(idx, val), v = p.v.filter(function (v) { return v.o[idx] === val && v.i > -1; })[0];
            var thumb = isSwatch && v ? '<img src="' + img(p, v.i, 140) + '" alt="" width="56" height="56" loading="lazy">' : '';
            return '<button type="button" class="ov' + (sel[idx] === val ? ' on' : '') + (ok ? '' : ' x') + (thumb ? ' has-img' : '') + '" data-oi="' + idx + '" data-ov="' + esc(val) + '" aria-pressed="' + (sel[idx] === val) + '"' + (ok ? '' : ' aria-label="' + esc(val) + ' (sold out)"') + '>' + thumb + '<span>' + esc(val) + '</span></button>';
          }).join('') + '</div></fieldset>';
      }).join('');
      var v = current(), ok = v && v.a;
      $$('[data-atc]').forEach(function (b) { b.disabled = !ok; $('span', b) ? ($('span', b).textContent = ok ? 'Add to cart — ' + money(p.p * qty) : 'Sold out — notify me') : 0; });
      $$('[data-sticky-var]').forEach(function (e) { e.textContent = sel.filter(function (x) { return x !== 'Default Title' && x !== 'UV protection'; }).join(' / '); });
      var stock = $('#pdp-stock');
      if (stock) {
        var n = 3 + hash(p.h + sel.join()) % 9; // SAMPLE inventory signal — wire to real inventory on Shopify
        stock.innerHTML = ok ? (n < 7 ? '<i class="dot low"></i> Low stock — only <b>' + n + '</b> left in this ' + (p.ty === 'hat' ? 'color' : 'option') : '<i class="dot"></i> In stock, ready to ship') : '<i class="dot out"></i> This option is sold out';
      }
    }
    var qty = 1;
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-oi]'); if (!b) return;
      var idx = +b.getAttribute('data-oi'); sel[idx] = b.getAttribute('data-ov');
      if (!current() || !current().a) { // pick nearest available combo for the other options
        var alt = p.v.filter(function (v) { return v.a && v.o[idx] === sel[idx]; })[0]; if (alt) sel = alt.o.slice();
      }
      paintOpts();
      var v = current(); if (v && v.i > -1) go(v.i);
    });
    var qn = $('#pdp-qty');
    $$('[data-qd]').forEach(function (b) { b.addEventListener('click', function () { qty = Math.max(1, Math.min(9, qty + +b.getAttribute('data-qd'))); qn.textContent = qty; paintOpts(); }); });
    paintOpts();
    var v0 = current(); if (v0 && v0.i > 0) go(v0.i, false);

    $$('[data-atc]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = current(); if (!v || !v.a) { toast('We’ll email you when it’s back (prototype)'); return; }
        add(p.h, sel.slice(), qty, true);
        var addon = $('#addon-decal');
        if (addon && addon.checked && p.h !== 'truck-decal') add('truck-decal', null, 1, true);
        b.classList.add('done'); setTimeout(function () { b.classList.remove('done'); }, 1400);
        openCart();
      });
    });
    $$('[data-buy-now]').forEach(function (b) { b.addEventListener('click', function () { toast('Prototype: Shop Pay express checkout opens here'); }); });

    // sticky ATC
    var main = $('#pdp-atc-main'), sticky = $('#sticky-atc');
    if (main && sticky && 'IntersectionObserver' in window) {
      $('img', sticky) && ($('img', sticky).src = img(p, 0, 120));
      new IntersectionObserver(function (es) { sticky.classList.toggle('on', !es[0].isIntersecting && es[0].boundingClientRect.top < 0); }).observe(main);
    }

    // FBT bundle
    var fbt = $('#fbt');
    if (fbt) {
      var pick = [p.h, p.h === 'truck-decal' ? 'teal-szn' : 'truck-decal', p.ty === 'hat' ? (p.h === 'teal-szn' ? 'duckin-raw' : 'teal-szn') : 'duckin-raw'];
      if (p.ty === 'hat' && pick[2] === p.h) pick[2] = 'the-benavides-bobcat';
      var items = pick.map(function (h) { return MAP[h]; });
      $('.fbt-items', fbt).innerHTML = items.map(function (it, i) {
        return (i ? '<span class="plus">+</span>' : '') + '<label class="fbt-i"><input type="checkbox" checked data-fbt="' + it.h + '"' + (i ? '' : ' disabled') + '><img src="' + img(it, 0, 300) + '" alt="" width="150" height="150" loading="lazy"><span class="fbt-t">' + (i ? '' : '<em>This item: </em>') + esc(it.t) + '</span><b>' + money(it.p) + '</b></label>';
      }).join('');
      function tot() {
        var s = 0, n = 0; $$('[data-fbt]', fbt).forEach(function (c) { if (c.checked) { s += MAP[c.getAttribute('data-fbt')].p; n++; } });
        $('#fbt-total').textContent = money(s); $('#fbt-add').textContent = 'Add ' + n + ' to cart';
        $('#fbt-note').textContent = s >= FREE_SHIP ? '✓ This bundle ships free' : money(FREE_SHIP - s) + ' more for free shipping';
      }
      fbt.addEventListener('change', tot); tot();
      $('#fbt-add').addEventListener('click', function () { $$('[data-fbt]', fbt).forEach(function (c) { if (c.checked) add(c.getAttribute('data-fbt'), c.getAttribute('data-fbt') === p.h ? sel.slice() : null, 1, true); }); openCart(); });
    }

    // related
    var rel = $('#related .grid');
    if (rel) {
      var pool = p.ty === 'hat' ? group('best').concat(group('newest')) : group('apparel').concat(group('best'));
      var seen = {}; pool = pool.filter(function (x) { if (x.h === p.h || seen[x.h] || !x.av) return false; seen[x.h] = 1; return true; });
      renderGrid(rel, pool, 4);
    }
    paintRecent(p.h);

    // fit guide modal
    document.addEventListener('click', function (e) { if (e.target.closest('[data-open-fit]')) { var m = $('#fit'); m && (m.classList.add('open'), BODY.classList.add('lock')); } });
    var fm = $('#fit'); fm && fm.addEventListener('click', function (e) { if (e.target === fm || e.target.closest('[data-close-modal]')) closeModal(); });
  }

  /* ---------- presenter bar: concept switch + "Why this layout?" notes ---------- */
  function presenter() {
    var q = new URLSearchParams(location.search), ph = q.get('p');
    var keep = ph ? '?p=' + ph : '';
    var links = {
      a: PAGE === 'pdp' ? ROOT + 'product/' + keep : ROOT,
      b: PAGE === 'pdp' ? ROOT + 'b/product/' + keep : ROOT + 'b/'
    };
    var bar = document.createElement('div');
    bar.className = 'presenter';
    bar.innerHTML = '<span class="pr-l">Concept</span><a href="' + links.a + '"' + (VER === 'a' ? ' class="on" aria-current="page"' : '') + '>A · Heritage</a><a href="' + links.b + '"' + (VER === 'b' ? ' class="on" aria-current="page"' : '') + '>B · After Hours</a>' +
      '<button type="button" class="pr-notes" aria-pressed="false">Why this layout?</button><a class="pr-s" href="' + ROOT + 'strategy/">Strategy</a><button type="button" class="pr-min" aria-label="Minimise">–</button>';
    BODY.appendChild(bar);
    var nb = $('.pr-notes', bar);
    function setNotes(on) {
      BODY.classList.toggle('notes-on', on); nb.setAttribute('aria-pressed', on);
      if (on && !$('.note-pin')) buildNotes();
    }
    nb.addEventListener('click', function () { setNotes(!BODY.classList.contains('notes-on')); });
    $('.pr-min', bar).addEventListener('click', function () { bar.classList.toggle('min'); });
    if (q.get('notes') === '1') setNotes(true);
  }
  function buildNotes() {
    $$('[data-note]').forEach(function (el, i) {
      var parts = el.getAttribute('data-note').split('|');
      var pin = document.createElement('div');
      pin.className = 'note-pin';
      pin.innerHTML = '<button type="button" aria-expanded="false"><b>' + (i + 1) + '</b><span>' + esc(parts[0]) + '</span></button><div class="note-card" role="note"><h4>' + esc(parts[0]) + '</h4><p>' + esc(parts[1] || '') + '</p>' + (parts[2] ? '<p class="note-kpi">↗ ' + esc(parts[2]) + '</p>' : '') + '</div>';
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.appendChild(pin);
      $('button', pin).addEventListener('click', function () { var o = pin.classList.toggle('open'); this.setAttribute('aria-expanded', o); });
    });
  }

  /* ---------- header behaviour ---------- */
  function header() {
    var h = $('.hdr'); if (!h) return;
    var last = 0;
    window.addEventListener('scroll', function () {
      var y = scrollY; h.classList.toggle('scrolled', y > 10);
      h.classList.toggle('hide', y > 400 && y > last && !BODY.classList.contains('lock')); last = y;
    }, { passive: true });
    var mb = $('[data-menu]'), mn = $('#mnav');
    mb && mn && mb.addEventListener('click', function () { var o = mn.classList.toggle('open'); mb.setAttribute('aria-expanded', o); BODY.classList.toggle('lock', o); });
    mn && mn.addEventListener('click', function (e) { if (e.target.closest('a') || e.target === mn) { mn.classList.remove('open'); BODY.classList.remove('lock'); mb.setAttribute('aria-expanded', false); } });
    // announcement rotator
    var ann = $$('.ann-i'); if (ann.length > 1) { var k = 0; setInterval(function () { ann[k].classList.remove('on'); k = (k + 1) % ann.length; ann[k].classList.add('on'); }, 3800); }
  }

  /* ---------- predictive search ---------- */
  function search() {
    var m = $('#search'); if (!m) return;
    var inp = $('#sq', m), res = $('#sr-res', m);
    function run() {
      var q = inp.value.trim().toLowerCase();
      var list = (q ? P.filter(function (p) { return HIDE_FROM_HOME.indexOf(p.h) < 0 && (p.t + ' ' + p.ty + ' ' + p.d + ' ' + p.o.map(function (o) { return o.v.join(' '); }).join(' ')).toLowerCase().indexOf(q) > -1; }) : group('best')).slice(0, 6);
      res.innerHTML = (q ? '' : '<p class="sr-h">Trending now</p>') + (list.length ? list.map(function (p) {
        return '<a class="sr-i" href="' + PDP + '?p=' + p.h + '"><img src="' + img(p, 0, 160) + '" alt="" width="64" height="64" loading="lazy"><span><b>' + esc(p.t) + '</b><small>' + money(p.p) + '</small></span></a>';
      }).join('') : '<p class="sr-h">No matches — try “duck” or “pearl snap”.</p>');
    }
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-search]')) { m.classList.add('open'); BODY.classList.add('lock'); run(); setTimeout(function () { inp.focus(); }, 60); }
      var c = e.target.closest('[data-sq]'); if (c) { inp.value = c.getAttribute('data-sq'); run(); }
    });
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-close-modal]') || e.target.closest('.sr-i')) closeModal(); });
    inp.addEventListener('input', run);
  }

  /* ---------- boot ---------- */
  search();
  cartShell(); paintCart(); header(); presenter();
  $$('[data-grid]').forEach(function (g) { renderGrid(g, group(g.getAttribute('data-grid')), +(g.getAttribute('data-limit') || 8)); });
  if ($('#shop-grid')) setFilter('best');
  hashFilter(); window.addEventListener('hashchange', hashFilter);
  document.addEventListener('click', function (e) { var a = e.target.closest('a[href*="#shop-"]'); if (a && a.hash === location.hash && a.pathname === location.pathname) { e.preventDefault(); hashFilter(); } });
  if (PAGE === 'pdp') pdp(); else paintRecent();
  reveal(document); cutoff(); delivery(); emailPopup();
  $$('[data-count]').forEach(function (e) { e.textContent = group(e.getAttribute('data-count')).length; });
  $$('[data-img]').forEach(function (e) { var a = e.getAttribute('data-img').split(':'), p = MAP[a[0]]; if (p) { e.src = img(p, +(a[1] || 0), +(a[2] || 800)); } });

  window.FM = { add: add, img: img, MAP: MAP, group: group, money: money, openCart: openCart, card: card, rating: rating, stars: stars, toast: toast, renderGrid: renderGrid };
})();
