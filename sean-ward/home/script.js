/* Ward Homes · V2 "Texas Modern" · plain JS. GSAP, ScrollTrigger and Lenis load from CDN and are all optional:
   without them every section still shows its content and every form and button still works. */
(function () {
  'use strict';

  /* ================= helpers ================= */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var U = function (id, w, h, q) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + w + (h ? '&h=' + h : '') + '&q=' + (q || 72); };
  var ic = function (n) { return '<svg class="i" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var short = function (n) { return n >= 1e6 ? '$' + (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M' : '$' + Math.round(n / 1000) + 'k'; };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  var ss = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var motion = !!(window.gsap && window.ScrollTrigger) && !reduce;
  if (motion) { gsap.registerPlugin(ScrollTrigger); root.classList.add('js-motion'); } else root.classList.add('no-motion');
  var hdr = $('#hdr');
  var hdrH = function () { return hdr.offsetHeight; };
  var gut = function () { return parseFloat(getComputedStyle($('.hero .wrap')).paddingLeft) || 24; };

  /* ================= data (sample projects, as in the /sean-ward/ feature demo) ================= */
  var STG = ['Plans', 'Foundation', 'Framing', 'Dried in', 'Exterior & interiors', 'Keys'];
  var STG_T = ['Months 1–2', 'Month 3', 'Months 3–4', 'Month 5', 'Months 6–9', 'Month 10'];
  var ST = {
    'Available': { c: 'avail', label: 'Available now', color: '#2f7d55', cta: 'Schedule a tour' },
    'Under construction': { c: 'build', label: 'Under construction', color: '#c08321', cta: 'Ask about this home' },
    'Completed': { c: 'done', label: 'Completed', color: '#4c6a93', cta: 'Build one like this' }
  };
  var P = [
    { id: 'southlake', n: 'The Southlake Estate', city: 'Southlake', ll: [32.9412, -97.1342], s: 'Available', stage: 6, beds: 5, baths: 5, sqft: 5200, garage: 3,
      img: '1613977257363-707ba9348227', gal: ['1600596542815-ffad4c1539a9', '1600210491892-03d54c0aaf87', '1507089947368-19c1da9775ae'], price: '$1,895,000', note: 'Move-in ready',
      blurb: 'A resort-style estate on a full acre: walls of glass, a pool terrace made for Texas evenings, and a chef’s kitchen at the heart of it all.',
      feat: ['Resort pool & spa', 'Chef’s kitchen, 12 ft island', 'Spa-style primary suite', 'Media & game room', 'Spray-foam insulation', '3-car garage'] },
    { id: 'celina', n: 'Celina Hill Country', city: 'Celina', ll: [33.3246, -96.7845], s: 'Available', stage: 6, beds: 4, baths: 3, sqft: 3100, garage: 2,
      img: '1592595896551-12b371d546d5', gal: ['1615529182904-14819c35db37', '1556912173-3bb406ef7e77', '1560185007-cde436f6a4d0'], price: '$749,900', note: 'Move-in ready',
      blurb: 'Painted brick, warm wood and a big covered patio, on a quiet street a few minutes from Celina’s town square.',
      feat: ['Covered patio with fans', 'Open kitchen & family room', 'Study with French doors', 'Quartz throughout', 'Tankless water heater', 'Smart thermostat'] },
    { id: 'prosper', n: 'The Prosper Residence', city: 'Prosper', ll: [33.2362, -96.8011], s: 'Under construction', stage: 4, beds: 4, baths: 3.5, sqft: 3450, garage: 3,
      img: '1605276374104-dee2a0ed3cd6', gal: ['1600210491892-03d54c0aaf87', '1507089947368-19c1da9775ae', '1600566752355-35792bedcfea'], price: 'From $865,000', note: 'Ready spring 2027', render: true,
      blurb: 'Stone and brick transitional on an oversized lot. Dried in this week, which means there’s still time to choose your own finishes.',
      feat: ['Pick your own finishes', 'Two-story family room', 'Game room upstairs', 'Covered outdoor kitchen', 'Spray-foam insulation', '3-car garage'] },
    { id: 'rockwall', n: 'Rockwall Lakeside', city: 'Rockwall', ll: [32.9312, -96.4597], s: 'Under construction', stage: 3, beds: 4, baths: 3.5, sqft: 3800, garage: 3,
      img: '1600585154340-be6161a56a0c', gal: ['1600607687939-ce8a6c25118c', '1600566753086-00f18fb6b3ea', '1600566752355-35792bedcfea'], price: 'From $1,150,000', note: 'Ready summer 2027', render: true,
      blurb: 'A modern lake house framed for big views and long weekends. Framing is up, and floor plan changes are still possible.',
      feat: ['Floor plan still flexible', 'Lake-view great room', 'Glass wall to the patio', 'Wine room', 'Energy package', 'Workshop garage'] },
    { id: 'frisco', n: 'Frisco Modern Farmhouse', city: 'Frisco', ll: [33.1507, -96.8236], s: 'Completed', stage: 6, beds: 5, baths: 4, sqft: 4100, garage: 3,
      img: '1570129477492-45c003edd2be', gal: ['1600047508788-786f3865b4b9', '1600585152220-90363fe7e115', '1595526114035-0d45ed16cfbf'], price: 'Similar from $985k', note: 'Custom build · 2025',
      blurb: 'A wraparound porch, a light-filled open plan and a kitchen built for a family of seven. Delivered two weeks ahead of schedule.',
      feat: ['Wraparound porch', 'Floating oak staircase', 'Two kitchen islands', 'Mudroom & drop zone', 'Guest suite downstairs', 'Delivered early'] },
    { id: 'mckinney', n: 'The McKinney Traditional', city: 'McKinney', ll: [33.1972, -96.6398], s: 'Completed', stage: 6, beds: 3, baths: 2.5, sqft: 2650, garage: 2,
      img: '1598228723793-52759bba239c', gal: ['1600121848594-d8644e57abab', '1484154218962-a197022b5858', '1595526114035-0d45ed16cfbf'], price: 'Similar from $575k', note: 'Custom build · 2024',
      blurb: 'Classic red brick and black shutters on a tree-lined lot, with a modern open plan inside. A first custom home for a young family.',
      feat: ['Classic brick exterior', 'Open-concept living', 'Home office', 'Large backyard', 'Walk-in pantry', '4-item punch list'] }
  ];
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });
  var UPS = [
    { id: 'outdoor', n: 'Outdoor living & summer kitchen', c: 'Outdoor living', d: 'Covered patio, fireplace, grill station', ic: 'flame', lo: 45000, hi: 75000, tag: 'Most popular' },
    { id: 'pool', n: 'Resort-style pool & spa', c: 'Pool & spa', d: 'Designed with your home, not after it', ic: 'waves', lo: 85000, hi: 140000 },
    { id: 'energy', n: 'Energy package', c: 'Energy package', d: 'Spray foam, solar-ready, tankless water', ic: 'sun', lo: 18000, hi: 30000, tag: 'Lower bills' },
    { id: 'smart', n: 'Whole-home smart package', c: 'Smart home', d: 'Lighting, security, Wi-Fi, shades', ic: 'wifi', lo: 12500, hi: 25000 },
    { id: 'media', n: 'Media or game room', c: 'Media room', d: 'Wired for sound, built for movie night', ic: 'film', lo: 32000, hi: 55000 },
    { id: 'shop', n: 'Workshop garage', c: 'Workshop', d: 'Extra bay, 220V power, storage', ic: 'wrench', lo: 38000, hi: 60000 }
  ];
  var upById = {}; UPS.forEach(function (u) { upById[u.id] = u; });
  var state = {
    saved: store.get('wh2_saved', []).filter(function (id) { return byId[id]; }),
    ups: store.get('wh2_ups', []).filter(function (id) { return upById[id]; }),
    lead: ss.get('wh2_lead') === '1'
  };
  function leadDone() { state.lead = true; ss.set('wh2_lead', '1'); }

  /* ================= smooth scroll (Lenis) + locking ================= */
  var lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    if (motion) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    }
  }
  function scrollToEl(el, offset) {
    if (!el) return;
    var off = offset == null ? -hdrH() + 1 : offset;
    if (lenis) lenis.scrollTo(el, { offset: off, duration: 1.3 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + off, behavior: reduce ? 'auto' : 'smooth' });
  }
  var locks = 0;
  function lock() { if (locks++ === 0) { if (lenis) lenis.stop(); root.style.overflow = 'hidden'; } }
  function unlock() { if (--locks <= 0) { locks = 0; root.style.overflow = ''; if (lenis) lenis.start(); } }
  function trap(container) {
    return function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', container).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
  }
  // in-page anchors go through the smooth scroller
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    var id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    var t = id === '#top' ? document.body : $(id);
    if (!t) return;
    e.preventDefault();
    if (!mnav.hidden) setMenu(false);
    if (id === '#top') { if (lenis) lenis.scrollTo(0, { duration: 1.3 }); else window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else scrollToEl(t, id === '#homes' ? 0 : undefined);
  });

  /* ================= toast ================= */
  var toastEl = $('#toast'), toastT;
  function toast(html, action, fn) {
    toastEl.innerHTML = html + (action ? '<button type="button">' + action + '</button>' : '');
    if (action) $('button', toastEl).onclick = function () { toastEl.classList.remove('is-on'); fn(); };
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 4200);
  }

  /* ================= header, menu, mobile bar ================= */
  var mnav = $('#mnav'), menuBtn = $('.hdr__menu'), mbar = $('#mbar');
  var darkSecs = $$('.process, .contact, .foot');
  function onScroll() {
    var y = window.scrollY, h = hdrH();
    hdr.classList.toggle('is-solid', y > 20);
    var dark = darkSecs.some(function (s) { var r = s.getBoundingClientRect(); return r.top <= h * .5 && r.bottom >= h * .5; });
    hdr.classList.toggle('is-dark', dark && mnav.hidden);
    var heroB = $('.hero').getBoundingClientRect().bottom, ct = $('#contact').getBoundingClientRect().top;
    mbar.classList.toggle('is-on', heroB < window.innerHeight * .6 && ct > window.innerHeight * .5);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    mnav.hidden = !open;
    hdr.classList.toggle('is-dark', open);
    if (open) { lock(); if (motion) gsap.from('.mnav__links a', { yPercent: 60, opacity: 0, duration: .8, ease: 'expo.out', stagger: .05 }); }
    else { unlock(); onScroll(); }
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1240 && !mnav.hidden) setMenu(false); });
  if ('IntersectionObserver' in window) {
    var navLinks = $$('.nav a');
    var nio = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + x.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { nio.observe(s); });
  }

  /* ================= homes: render panels ================= */
  var hin = $('#hin'), hEnd = $('#hEnd'), track = $('#htrack'), homesSec = $('#homes');
  function specs(p) { return p.beds + ' bd · ' + p.baths + ' ba · ' + p.sqft.toLocaleString('en-US') + ' sf'; }
  function progHTML(p) {
    return '<div class="prog" aria-hidden="true">' + STG.map(function (s, i) { return '<i class="' + (i < p.stage ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<div class="prog-l mono"><span>Stage ' + p.stage + ' of 6 · ' + STG[p.stage - 1] + '</span><span>Updated Friday</span></div>';
  }
  P.forEach(function (p, i) {
    var st = ST[p.s];
    var el = document.createElement('article');
    el.className = 'hp'; el.dataset.s = p.s; el.dataset.id = p.id;
    el.innerHTML =
      '<div class="hp__media" data-cursor="View home">' +
        '<img src="' + U(p.img, 1000, 0, 72) + '" srcset="' + U(p.img, 700, 0, 70) + ' 700w, ' + U(p.img, 1000, 0, 72) + ' 1000w, ' + U(p.img, 1400, 0, 72) + ' 1400w" sizes="(max-width: 1023px) 80vw, 38vw" alt="' + esc(p.n) + ', ' + esc(p.city) + ', Texas" loading="lazy" decoding="async">' +
        '<button class="hp__open" type="button" data-open-project="' + p.id + '" aria-label="View details: ' + esc(p.n) + '"></button>' +
        '<span class="badge"><i class="dot dot--' + st.c + '"></i>' + st.label + '</span>' +
        '<button class="save" type="button" data-save="' + p.id + '" aria-pressed="false" aria-label="Save ' + esc(p.n) + '">' + ic('heart') + '</button>' +
        '<span class="hp__num mono">' + pad(i + 1) + ' / ' + pad(P.length) + '</span>' +
        (p.render ? '<span class="hp__render mono">Rendering</span>' : '') +
      '</div>' +
      '<div class="hp__body">' +
        '<div class="hp__top mono"><span>' + esc(p.city) + ', TX</span><span>' + specs(p) + '</span></div>' +
        '<h3 class="hp__name">' + esc(p.n) + '</h3>' +
        (p.s === 'Under construction' ? progHTML(p) : '') +
        '<div class="hp__foot"><div><b class="hp__price">' + p.price + '</b><span class="mono">' + p.note + '</span></div>' +
        '<div class="hp__ctas"><a class="btn btn--ink btn--sm" href="#contact" data-cta="' + p.id + '"><span>' + st.cta + '</span></a><button class="btn btn--line btn--sm" type="button" data-open-project="' + p.id + '"><span>Details</span></button></div></div>' +
      '</div>';
    hin.insertBefore(el, hEnd);
  });

  var filter = 'all', hTween = null;
  function visiblePanels() { return $$('.hp', hin).filter(function (x) { return !x.hidden; }); }
  function setHCount(prog) {
    var vis = visiblePanels(), n = vis.length - 1; // excludes the closing panel
    var k = clamp(Math.round(prog * (vis.length - 1)) + 1, 1, Math.max(1, n));
    $('#hCount').textContent = pad(k) + ' / ' + pad(Math.max(1, n));
    $('#hBar').style.transform = 'scaleX(' + Math.max(.04, prog) + ')';
  }
  track.addEventListener('scroll', function () {
    var max = track.scrollWidth - track.clientWidth;
    setHCount(max > 0 ? track.scrollLeft / max : 0);
  }, { passive: true });
  $('.filters', homesSec).addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]'); if (!b) return;
    filter = b.dataset.f;
    $$('.filters button', homesSec).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    var shown = [];
    $$('.hp:not(.hp--end)', hin).forEach(function (c) { var on = filter === 'all' || c.dataset.s === filter; c.hidden = !on; if (on) shown.push(c); });
    track.scrollLeft = 0;
    if (motion) {
      gsap.fromTo(shown, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8, ease: 'expo.out', stagger: .06, overwrite: true });
      ScrollTrigger.refresh();
    }
    setHCount(0);
    if (mapReady) syncMapFilter();
  });
  setHCount(0);

  /* ================= map: hand-drawn DFW ================= */
  var LON0 = -97.45, LON1 = -96.35, LAT0 = 32.52, LAT1 = 33.42, MW = 800, MH = 780;
  function px(lat, lon) { return [(lon - LON0) / (LON1 - LON0) * MW, (LAT1 - lat) / (LAT1 - LAT0) * MH]; }
  function pts(list) { return list.map(function (ll) { var q = px(ll[0], ll[1]); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' '); }
  var HWY = [
    ['I-35E', [[33.30, -97.16], [33.21, -97.13], [33.10, -97.02], [33.00, -96.91], [32.88, -96.86], [32.78, -96.81], [32.70, -96.80], [32.59, -96.76], [32.50, -96.75]], 3],
    ['I-35W', [[33.21, -97.13], [33.03, -97.27], [32.90, -97.30], [32.75, -97.33], [32.62, -97.32], [32.50, -97.32]], 2],
    ['US-75', [[32.78, -96.80], [32.86, -96.77], [32.95, -96.73], [33.02, -96.70], [33.10, -96.67], [33.20, -96.62], [33.33, -96.56], [33.44, -96.55]], 6],
    ['DNT', [[32.80, -96.81], [32.92, -96.83], [33.02, -96.83], [33.10, -96.82], [33.18, -96.81], [33.25, -96.80], [33.34, -96.79]], 3],
    ['I-30', [[32.75, -97.47], [32.75, -97.33], [32.75, -97.11], [32.77, -96.95], [32.78, -96.80], [32.82, -96.70], [32.88, -96.55], [32.93, -96.46], [32.96, -96.33]], 5],
    ['I-20', [[32.68, -97.47], [32.68, -97.25], [32.68, -97.11], [32.67, -96.95], [32.66, -96.80], [32.70, -96.62], [32.74, -96.45], [32.75, -96.33]], 1],
    ['SH-121', [[32.85, -97.25], [32.93, -97.13], [32.95, -97.06], [33.02, -96.98], [33.10, -96.88], [33.12, -96.80], [33.17, -96.68], [33.20, -96.62]], 2],
    ['I-635', [[32.93, -97.03], [32.92, -96.90], [32.92, -96.80], [32.91, -96.70], [32.85, -96.65], [32.78, -96.62], [32.70, -96.62]], 1]
  ];
  var LAKES = [[33.10, -97.00, 26, 46, -20], [32.97, -97.07, 22, 10, 20], [32.86, -96.52, 12, 44, 10], [33.05, -96.48, 24, 30, 20], [32.62, -97.00, 26, 9, -10], [32.83, -96.72, 6, 9, 0]];
  var CITIES = [
    ['dallas', 'Dallas', 32.7767, -96.7970, 12, 18], ['fortworth', 'Fort Worth', 32.7555, -97.3308, 10, -10], ['arlington', 'Arlington', 32.7357, -97.1081, 10, 18],
    ['plano', 'Plano', 33.0198, -96.6989, 10, 5], ['frisco', 'Frisco', 33.1507, -96.8236, -60, 5], ['mckinney', 'McKinney', 33.1972, -96.6398, 17, 5],
    ['prosper', 'Prosper', 33.2362, -96.8011, 17, 5], ['celina', 'Celina', 33.3246, -96.7845, 17, 5], ['allen', 'Allen', 33.1032, -96.6706, 10, 5],
    ['southlake', 'Southlake', 32.9412, -97.1342, -34, 31], ['rockwall', 'Rockwall', 32.9312, -96.4597, -30, 31], ['denton', 'Denton', 33.2148, -97.1331, 10, 5],
    ['highlandpark', 'Highland Park', 32.8335, -96.7920, -96, 4], ['irving', 'Irving', 32.8140, -96.9489, -46, 4], ['garland', 'Garland', 32.9126, -96.6389, 10, 5]
  ];
  var LIST = ['dallas', 'highlandpark', 'frisco', 'prosper', 'celina', 'mckinney', 'allen', 'plano', 'southlake', 'rockwall'];
  var cityKey = function (name) { return name.toLowerCase().replace(/[^a-z]/g, ''); };
  var mapReady = false, svg = $('#dfw'), mapCard = $('#mapCard'), mapBox = $('.where__map');
  (function buildMap() {
    var hq = px(32.7876, -96.7985), o = [];
    o.push('<g class="grid">');
    for (var gx = 80; gx < MW; gx += 80) o.push('<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="' + MH + '"/>');
    for (var gy = 80; gy < MH; gy += 80) o.push('<line x1="0" y1="' + gy + '" x2="' + MW + '" y2="' + gy + '"/>');
    o.push('</g>');
    LAKES.forEach(function (l) { var q = px(l[0], l[1]); o.push('<ellipse class="lake" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" rx="' + l[2] + '" ry="' + l[3] + '" transform="rotate(' + l[4] + ' ' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + ')"/>'); });
    [15, 30, 45].forEach(function (mi) {
      var r = mi * 12.53;
      o.push('<circle class="ring" cx="' + hq[0].toFixed(1) + '" cy="' + hq[1].toFixed(1) + '" r="' + r.toFixed(1) + '"/>');
      o.push('<text class="ring-t" x="' + (hq[0] + r * .5 + 4).toFixed(1) + '" y="' + (hq[1] - r * .866 - 4).toFixed(1) + '">' + mi + ' MI</text>');
    });
    HWY.forEach(function (h) {
      o.push('<polyline class="hwy" points="' + pts(h[1]) + '"/>');
      var a = px(h[1][h[2]][0], h[1][h[2]][1]);
      o.push('<text class="hwy-t" x="' + (a[0] + 5).toFixed(1) + '" y="' + (a[1] - 5).toFixed(1) + '">' + h[0] + '</text>');
    });
    CITIES.forEach(function (c) {
      var q = px(c[2], c[3]);
      o.push('<g class="city" data-city="' + c[0] + '"><circle class="cdot" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + (c[0] === 'dallas' || c[0] === 'fortworth' ? 4.5 : 3) + '"/>' +
        '<text class="ctxt" x="' + (q[0] + c[4]).toFixed(1) + '" y="' + (q[1] + c[5]).toFixed(1) + '"' + (c[0] === 'dallas' || c[0] === 'fortworth' ? ' style="font-size:18px"' : '') + '>' + c[1] + '</text></g>');
    });
    o.push('<g class="hq" transform="translate(' + (hq[0] - 16).toFixed(1) + ' ' + (hq[1] - 16).toFixed(1) + ')"><rect width="32" height="32" rx="9"/><g transform="translate(4 3) scale(.6)" fill="none" stroke="#ede8e0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 19 20 8.5 34 19" stroke="#e3895f"/><path d="M10.5 21.5 14.6 32l5.4-7.6 5.4 7.6 4.1-10.5"/></g></g>');
    P.forEach(function (p) {
      var q = px(p.ll[0], p.ll[1]), col = ST[p.s].color;
      o.push('<g class="pin" data-pin="' + p.id + '" data-city="' + cityKey(p.city) + '" tabindex="0" role="button" aria-label="' + esc(p.n) + ', ' + ST[p.s].label + '">' +
        '<circle class="pulse" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="11" stroke="' + col + '"/>' +
        '<circle class="core" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="10" fill="' + col + '"/></g>');
    });
    svg.innerHTML = o.join('');
    // city list
    $('#clist').innerHTML = LIST.map(function (k, i) {
      var c = CITIES.filter(function (x) { return x[0] === k; })[0];
      var n = P.filter(function (p) { return cityKey(p.city) === k; }).length;
      return '<li data-city="' + k + '" class="' + (n ? 'has' : '') + '"><span class="mono">' + pad(i + 1) + '</span><b>' + c[1] + '</b><small>' + (n ? n + (n > 1 ? ' homes' : ' home') : 'Ask us') + '</small></li>';
    }).join('');
    mapReady = true;
  })();
  var cardFor = null, cardHide;
  function showCard(id) {
    var p = byId[id]; if (!p) return;
    clearTimeout(cardHide);
    cardFor = id;
    mapCard.innerHTML = '<img src="' + U(p.img, 480, 256, 65) + '" alt=""><b>' + esc(p.n) + '</b><p>' + esc(p.city) + ' · ' + ST[p.s].label + ' · ' + p.price + '</p><button type="button" data-open-project="' + p.id + '">View home</button>';
    mapCard.hidden = false;
    var pin = $('[data-pin="' + id + '"] .core', svg), r = pin.getBoundingClientRect(), b = mapBox.getBoundingClientRect();
    var x = r.left - b.left + r.width / 2 + 18, y = r.top - b.top - 40;
    if (x + 250 > b.width) x = r.left - b.left - 258;
    y = clamp(y, 10, b.height - mapCard.offsetHeight - 10);
    mapCard.style.left = Math.max(10, x) + 'px'; mapCard.style.top = y + 'px';
  }
  function hideCard(now) { clearTimeout(cardHide); cardHide = setTimeout(function () { mapCard.hidden = true; cardFor = null; }, now ? 0 : 260); }
  function hlCity(k, on) {
    $$('[data-city="' + k + '"]', svg).forEach(function (g) { g.classList.toggle('is-hl', on); });
    $$('#clist [data-city="' + k + '"]').forEach(function (li) { li.classList.toggle('is-hl', on); });
  }
  svg.addEventListener('mouseover', function (e) { var g = e.target.closest('.pin'); if (g) { showCard(g.dataset.pin); hlCity(g.dataset.city, true); } });
  svg.addEventListener('mouseout', function (e) { var g = e.target.closest('.pin'); if (g) { hideCard(); hlCity(g.dataset.city, false); } });
  svg.addEventListener('click', function (e) { var g = e.target.closest('.pin'); if (g) { if (fine) openPM(g.dataset.pin, g); else showCard(g.dataset.pin); } });
  svg.addEventListener('keydown', function (e) { var g = e.target.closest('.pin'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openPM(g.dataset.pin, g); } });
  svg.addEventListener('focusin', function (e) { var g = e.target.closest('.pin'); if (g) showCard(g.dataset.pin); });
  mapCard.addEventListener('mouseenter', function () { clearTimeout(cardHide); });
  mapCard.addEventListener('mouseleave', function () { hideCard(); });
  $('#clist').addEventListener('mouseover', function (e) {
    var li = e.target.closest('li'); if (!li) return;
    hlCity(li.dataset.city, true);
    var p = P.filter(function (x) { return cityKey(x.city) === li.dataset.city; })[0];
    if (p) showCard(p.id); else hideCard(true);
  });
  $('#clist').addEventListener('mouseout', function (e) { var li = e.target.closest('li'); if (li) { hlCity(li.dataset.city, false); hideCard(); } });
  function syncMapFilter() {
    P.forEach(function (p) { var g = $('[data-pin="' + p.id + '"]', svg); g.style.opacity = (filter === 'all' || p.s === filter) ? 1 : .15; });
  }

  /* ================= the house that draws itself ================= */
  (function buildHouse() {
    var o = [];
    var rect = function (c, x, y, w, h) { return '<rect class="' + c + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>'; };
    var path = function (c, d) { return '<path class="' + c + '" d="' + d + '"/>'; };
    var gy = function (x) { return x <= 410 ? 230 - (x - 250) * 0.8125 : 230 - (570 - x) * 0.8125; }; // main gable line
    var WIN = [[300, 250, 44, 56], [476, 250, 44, 56], [396, 168, 28, 38], [290, 344, 40, 44], [490, 344, 40, 44], [140, 326, 80, 50]];
    var d, x, y;
    // stage 5 (back): sky sun, wall fills, lawn
    o.push('<g class="st" data-s="5">');
    o.push('<circle class="fl sun" cx="690" cy="92" r="30"/>');
    o.push(path('fl wall', 'M250 400V230L410 100L570 230V400Z M110 400V300H250V400Z M570 400V306H700V400Z'));
    o.push(path('fl lawn', 'M0 412H800V480H0Z'));
    o.push('</g>');
    // stage 0: plans
    o.push('<g class="st" data-s="0">');
    o.push(path('ln', 'M30 400H770'));
    o.push(path('ln tn', 'M100 444H710 M100 436V452 M710 436V452'));
    o.push(path('ln tn', 'M740 400V100 M732 400H748 M732 100H748'));
    o.push(path('fl dash', 'M110 400V300H250V230L410 100L570 230V306H700V400'));
    o.push('<text class="fl" x="405" y="468" text-anchor="middle">62′-0″</text>');
    o.push('<text class="fl" x="760" y="254" transform="rotate(-90 760 254)" text-anchor="middle">31′-6″</text>');
    o.push('<text class="fl" x="40" y="40">ELEVATION A · FRONT</text>');
    o.push('</g>');
    // stage 1: foundation
    o.push('<g class="st" data-s="1">');
    o.push(path('ln', 'M100 400H710V412H100Z'));
    o.push(path('ln tn', 'M118 412V426H150V412 M290 412V426H322V412 M498 412V426H530V412 M660 412V426H692V412'));
    o.push(path('ln tn', 'M190 400V389 M340 400V387 M346 400V387 M468 400V389 M620 400V391'));
    o.push('</g>');
    // stage 2: framing
    o.push('<g class="st" data-s="2">');
    d = ''; for (x = 118; x <= 242; x += 16) d += 'M' + x + ' 398V302 ';
    for (x = 258; x <= 562; x += 16) d += 'M' + x + ' 398V318 M' + x + ' 314V232 ';
    for (x = 274; x <= 546; x += 16) { y = gy(x); if (y < 226) d += 'M' + x + ' 228V' + (y + 4).toFixed(0) + ' '; }
    for (x = 578; x <= 694; x += 16) d += 'M' + x + ' 398V308 ';
    o.push(path('ln tn', d));
    o.push(path('ln', 'M110 398H700 M110 300H250 M250 316H570 M250 230H570 M570 306H700'));
    o.push(path('ln', 'M240 238L410 96L580 238'));
    o.push(path('ln tn', 'M330 165H490 M410 96V230'));
    o.push(path('ln', 'M98 304L136 266H250 M570 272H674L712 310'));
    o.push('</g>');
    // stage 3: dried in
    o.push('<g class="st" data-s="3">');
    o.push(path('ln', 'M250 400V230L410 100L570 230V400 M110 400V300H250 M570 306H700V400'));
    o.push(path('ln tn', 'M330 400V165 M410 400V100 M490 400V165 M250 316H570 M180 400V300 M635 400V306'));
    o.push(path('ln', 'M98 304H250V266H136Z M570 310H712L674 272H570 M236 240L410 92L584 240'));
    WIN.forEach(function (w) { o.push(rect('ln', w[0], w[1], w[2], w[3])); });
    o.push(rect('ln', 390, 334, 40, 66));
    o.push(rect('ln', 588, 330, 94, 70));
    o.push('</g>');
    // stage 4: exterior & interiors
    o.push('<g class="st" data-s="4">');
    o.push(path('fl roof', 'M98 304H250V266H136Z M570 310H712L674 272H570Z M256 334H564L552 314H268Z'));
    d = ''; for (x = 258; x <= 562; x += 10) { y = Math.max(gy(x), 104); d += 'M' + x + ' 398V' + (y + 3).toFixed(0) + ' '; }
    o.push(path('ln tn', d));
    d = ''; for (y = 310; y <= 394; y += 9) d += 'M112 ' + y + 'H248 ';
    for (y = 316; y <= 394; y += 9) d += 'M572 ' + y + 'H698 ';
    o.push(path('ln tn', d));
    d = ''; for (x = 104; x <= 246; x += 9) { y = x < 136 ? 304 - (x - 98) : 267; d += 'M' + x + ' 303V' + (y + 1) + ' '; }
    for (x = 574; x <= 708; x += 9) { y = x <= 674 ? 273 : 272 + (x - 674); d += 'M' + x + ' 309V' + (y + 1) + ' '; }
    for (x = 272; x <= 552; x += 10) d += 'M' + x + ' 333V315 ';
    o.push(path('ln tn', d));
    WIN.forEach(function (w) {
      o.push(rect('fl win', w[0], w[1], w[2], w[3]));
      o.push(rect('ln', w[0], w[1], w[2], w[3]));
      o.push(path('ln tn', 'M' + (w[0] + w[2] / 2) + ' ' + w[1] + 'V' + (w[1] + w[3]) + ' M' + w[0] + ' ' + (w[1] + w[3] / 2) + 'H' + (w[0] + w[2])));
    });
    o.push(rect('fl wood', 390, 334, 40, 66) + rect('ln', 390, 334, 40, 66) + '<circle class="ln" cx="423" cy="368" r="2"/>');
    o.push(rect('fl wood', 588, 330, 94, 70) + rect('ln', 588, 330, 94, 70));
    o.push(path('ln tn', 'M588 344H682 M588 358H682 M588 372H682 M588 386H682'));
    o.push(path('ln', 'M256 334H564L552 314H268Z M272 334V400 M276 334V400 M544 334V400 M548 334V400'));
    o.push(path('ln', 'M196 236H228 M200 236V286 M224 236V280'));
    o.push('</g>');
    // stage 5 (front): landscaping and glowing windows
    o.push('<g class="st" data-s="5">');
    WIN.forEach(function (w) { o.push(rect('fl glow', w[0] + 3, w[1] + 3, w[2] - 6, w[3] - 6)); });
    o.push('<circle class="fl glow" cx="380" cy="350" r="4"/><circle class="fl glow" cx="440" cy="350" r="4"/>');
    o.push('<circle class="fl leaf" cx="58" cy="330" r="46"/><circle class="fl leaf2" cx="34" cy="364" r="30"/><circle class="fl leaf" cx="748" cy="344" r="38"/><circle class="fl leaf2" cx="774" cy="372" r="24"/>');
    o.push(path('ln', 'M58 372V412 M748 378V412'));
    o.push('<ellipse class="fl leaf2" cx="150" cy="402" rx="34" ry="12"/><ellipse class="fl leaf2" cx="300" cy="402" rx="26" ry="10"/><ellipse class="fl leaf2" cx="520" cy="402" rx="26" ry="10"/><ellipse class="fl leaf2" cx="660" cy="404" rx="20" ry="8"/>');
    o.push(path('ln tn', 'M396 412L380 476 M424 412L440 476'));
    o.push('<text class="fl" x="760" y="468" text-anchor="end">WELCOME HOME · KEYS</text>');
    o.push('</g>');
    $('#house').innerHTML = o.join('');
  })();
  var bGroups = $$('#house .st'), bLines = [], bFills = [];
  bGroups.forEach(function (g) {
    var s = +g.dataset.s;
    $$('.ln', g).forEach(function (el) {
      var len = 0; try { len = el.getTotalLength(); } catch (e) { len = 0; }
      if (len > 0) bLines.push({ el: el, s: s, len: len });
    });
    $$('.fl', g).forEach(function (el) { bFills.push({ el: el, s: s }); });
  });
  var FADE = { 0: [1.3, .38], 2: [3.2, .14], 3: [4.3, .3] };
  var bCur = -1;
  function setBuild(p) {
    bLines.forEach(function (o) { var t = clamp(p - o.s, 0, 1); o.el.style.strokeDasharray = o.len; o.el.style.strokeDashoffset = (o.len * (1 - t)).toFixed(1); });
    bFills.forEach(function (o) { o.el.style.opacity = clamp(p - o.s, 0, 1); });
    bGroups.forEach(function (g) { var s = +g.dataset.s, f = FADE[s]; g.style.opacity = f ? 1 - clamp(p - f[0], 0, 1) * (1 - f[1]) : 1; });
    var cur = clamp(Math.floor(p), 0, 5);
    $('#bBar').style.transform = 'scaleX(' + clamp(p / 6, 0, 1) + ')';
    if (cur !== bCur) {
      bCur = cur;
      bGroups.forEach(function (g) { g.classList.toggle('is-cur', +g.dataset.s === cur && p < 5.98); });
      $('#bHud').textContent = 'Stage ' + pad(cur + 1) + ' — ' + STG[cur];
      $('#bWeek').textContent = STG_T[cur];
      $$('.bstep').forEach(function (s) { s.classList.toggle('is-on', +s.dataset.stage === cur); });
    }
  }
  function setupBuild() { // created after the homes pin, so its positions include the pin spacing
    setBuild(0.001);
    ScrollTrigger.create({
      trigger: '.build__steps',
      start: function () { return 'top ' + (window.innerWidth < 1024 ? '78%' : '55%'); },
      end: function () { return 'bottom ' + (window.innerWidth < 1024 ? '78%' : '55%'); },
      scrub: .5,
      invalidateOnRefresh: true,
      onUpdate: function (self) { setBuild(self.progress * 6); }
    });
  }
  if (!motion) setBuild(6);

  /* ================= saved homes (shortlist drawer with upsells) ================= */
  var drawer = $('#drawer'), dPanel = $('.drawer__panel', drawer), savedBtn = $('.hdr__saved'), dFrom = null, dTrap = trap(dPanel);
  function persist() { store.set('wh2_saved', state.saved); store.set('wh2_ups', state.ups); }
  function isSaved(id) { return state.saved.indexOf(id) > -1; }
  function syncSave() {
    $$('[data-save]').forEach(function (b) {
      var on = isSaved(b.dataset.save), p = byId[b.dataset.save];
      b.setAttribute('aria-pressed', String(on));
      if (b.classList.contains('save')) b.setAttribute('aria-label', (on ? 'Remove ' : 'Save ') + p.n + (on ? ' from saved homes' : ''));
    });
    var ps = $('#pmSave');
    if (ps.dataset.id) { var on = isSaved(ps.dataset.id); ps.setAttribute('aria-pressed', String(on)); $('span', ps).textContent = on ? 'Saved' : 'Save'; }
    var n = state.saved.length, badge = $('.hdr__n');
    badge.textContent = n; badge.hidden = n === 0;
    savedBtn.classList.toggle('has', n > 0);
    savedBtn.setAttribute('aria-label', 'Saved homes, ' + n + ' saved');
  }
  function toggleSave(id, btn) {
    var p = byId[id]; if (!p) return;
    var adding = !isSaved(id);
    if (adding) state.saved.push(id); else state.saved = state.saved.filter(function (x) { return x !== id; });
    persist(); renderDrawer();
    if (btn && btn.classList.contains('save')) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
    savedBtn.classList.remove('bump'); void savedBtn.offsetWidth; savedBtn.classList.add('bump');
    var open = drawer.classList.contains('is-open');
    if (adding && !open) {
      if (!ss.get('wh2_drawer_seen') && $('#pm').hidden) { ss.set('wh2_drawer_seen', '1'); openDrawer(btn); }
      else toast(ic('heart') + '<span>Saved <b>' + esc(p.n) + '</b></span>', 'View shortlist', function () { openDrawer(savedBtn); });
    } else if (!adding && !open) toast('<span>Removed from your shortlist</span>', 'Undo', function () { toggleSave(id); });
  }
  function renderDrawer() {
    var n = state.saved.length, m = state.ups.length;
    $('#dCount').textContent = n;
    $('#dItems').innerHTML = n ? state.saved.map(function (id) {
      var p = byId[id], st = ST[p.s];
      return '<div class="ditem"><img src="' + U(p.img, 220, 180, 62) + '" alt=""><div><b>' + esc(p.n) + '</b><small>' + esc(p.city) + ', TX · ' + p.sqft.toLocaleString('en-US') + ' sq ft · ' + p.price + '</small>' +
        '<span class="st"><i class="dot dot--' + st.c + '"></i>' + st.label + '</span></div><button class="ditem__x" type="button" data-remove="' + id + '" aria-label="Remove ' + esc(p.n) + '">' + ic('x') + '</button></div>';
    }).join('') : '<div class="dempty">' + ic('heart') + '<b>Your shortlist is empty</b><p>Tap the heart on any home to save it. Sean will send floor plans and pricing for each one.</p></div>';
    $('#dUps').innerHTML = UPS.map(function (u) {
      var on = state.ups.indexOf(u.id) > -1;
      return '<li class="dup' + (on ? ' is-on' : '') + '"><span class="dup__ic">' + ic(u.ic) + '</span><div><b>' + u.n + (u.tag ? '<span class="dup__tag">' + u.tag + '</span>' : '') + '</b><small>' + u.d + ' · from ' + short(u.lo) + '</small></div>' +
        '<button type="button" data-up="' + u.id + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Remove ' : 'Add ') + u.n + '">' + (on ? ic('check') + 'Added' : ic('plus') + 'Add') + '</button></li>';
    }).join('');
    var recs = P.filter(function (p) { return !isSaved(p.id); }).slice(0, 2);
    $('#dRecWrap').hidden = !recs.length;
    $('#dRecs').innerHTML = recs.map(function (p) {
      return '<button class="drec" type="button" data-save="' + p.id + '" aria-pressed="false"><img src="' + U(p.img, 340, 200, 62) + '" alt=""><div><b>' + esc(p.n) + '</b><small>' + esc(p.city) + ' · ' + p.price + '</small><span>' + ic('plus') + 'Save home</span></div></button>';
    }).join('');
    var lo = 0; state.ups.forEach(function (id) { lo += upById[id].lo; });
    $('#dSum').textContent = n + (n === 1 ? ' home' : ' homes') + ' · ' + m + (m === 1 ? ' upgrade' : ' upgrades');
    $('#dUpTotal').textContent = m ? 'Upgrades from ' + short(lo) : '';
    $('span', $('#dCta')).innerHTML = n ? 'Get floor plans &amp; pricing' : 'Book a free consultation';
    syncSave();
  }
  function toggleUp(id) {
    var i = state.ups.indexOf(id);
    if (i > -1) state.ups.splice(i, 1); else state.ups.push(id);
    persist(); renderDrawer(); renderChips(); calc();
  }
  drawer.addEventListener('click', function (e) {
    var up = e.target.closest('[data-up]'); if (up) { toggleUp(up.dataset.up); var again = $('[data-up="' + up.dataset.up + '"]', drawer); if (again) again.focus(); return; }
    var rm = e.target.closest('[data-remove]'); if (rm) { toggleSave(rm.dataset.remove); return; }
    if (e.target.closest('[data-close-drawer]')) closeDrawer();
  });
  function openDrawer(from) {
    dFrom = from || document.activeElement;
    renderDrawer();
    drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false');
    lock();
    setTimeout(function () { dPanel.focus(); }, 60);
    document.addEventListener('keydown', dKeys);
  }
  function closeDrawer() {
    if (!drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true');
    unlock(); document.removeEventListener('keydown', dKeys);
    if (dFrom && dFrom.focus) dFrom.focus({ preventScroll: true });
  }
  function dKeys(e) { if (e.key === 'Escape') closeDrawer(); else dTrap(e); }
  $$('[data-open-drawer]').forEach(function (b) { b.addEventListener('click', function () { openDrawer(b); }); });
  $('#dCta').addEventListener('click', function (e) {
    e.preventDefault();
    var lines = [];
    if (state.saved.length) lines.push('Homes I saved: ' + state.saved.map(function (id) { return byId[id].n; }).join(', ') + '.');
    if (state.ups.length) lines.push('Upgrades I’m interested in: ' + state.ups.map(function (id) { return upById[id].n; }).join(', ') + '.');
    if (lines.length) lines.push('Please send floor plans and pricing.');
    prefill(lines.join('\n'));
    closeDrawer(); goContact();
  });

  /* ================= contact prefill + global clicks ================= */
  var cform = $('#cform');
  function prefill(msg, interest) {
    if (msg) cform.elements.message.value = msg;
    if (interest) { var r = $$('input[name="interest"]', cform).filter(function (x) { return x.value === interest; })[0]; if (r) r.checked = true; }
  }
  function goContact() {
    scrollToEl($('#contact'));
    setTimeout(function () { cform.elements.name.focus({ preventScroll: true }); }, reduce ? 0 : 1400);
  }
  function ctaFor(p) {
    if (p.s === 'Available') return { msg: 'I’d like to tour ' + p.n + ' in ' + p.city + '.', interest: 'An available home' };
    if (p.s === 'Under construction') return { msg: 'I’m interested in ' + p.n + ' in ' + p.city + ' (under construction). Is it still available, and can I still choose finishes?', interest: 'An available home' };
    return { msg: 'I’d like to build a home like ' + p.n + '.', interest: 'Not sure yet' };
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-cta]');
    if (a) { e.preventDefault(); var c = ctaFor(byId[a.dataset.cta]); prefill(c.msg, c.interest); closePM(); goContact(); return; }
    var pf = e.target.closest('[data-prefill]');
    if (pf) prefill(pf.dataset.prefill);
    var op = e.target.closest('[data-open-project]');
    if (op && !op.closest('svg')) { e.preventDefault(); openPM(op.dataset.openProject, op); return; }
    var sv = e.target.closest('[data-save]');
    if (sv) { e.preventDefault(); toggleSave(sv.dataset.save, sv); return; }
    var pl = e.target.closest('[data-open-planner]');
    if (pl) { e.preventDefault(); if (!mnav.hidden) setMenu(false); openPlanner(); }
  });

  /* ================= project detail ================= */
  var pm = $('#pm'), pmPanel = $('.pm__panel', pm), pmTrap = trap(pmPanel), pmFrom = null, pmCur = null, pmIdx = 0;
  function gal() { return [pmCur.img].concat(pmCur.gal); }
  function setMain(i) {
    var g = gal(); pmIdx = (i + g.length) % g.length;
    var img = $('#pmImg'); img.src = U(g[pmIdx], 1400, 1050, 74); img.alt = pmCur.n + ', ' + pmCur.city + ', Texas';
    $('#pmRender').hidden = !(pmCur.render && pmIdx === 0);
    $$('#pmThumbs button').forEach(function (b, k) { b.setAttribute('aria-current', String(k === pmIdx)); });
  }
  function openPM(id, from) {
    var p = byId[id]; if (!p) return;
    pmCur = p; pmFrom = from || document.activeElement;
    var st = ST[p.s];
    gal().forEach(function (g) { var im = new Image(); im.src = U(g, 1400, 1050, 74); });
    $('#pmStatus').innerHTML = '<i class="dot dot--' + st.c + '"></i>' + st.label;
    $('#pmTitle').textContent = p.n;
    $('#pmCity').textContent = p.city + ', Texas';
    $('#pmSpecs').innerHTML = [['Beds', p.beds], ['Baths', p.baths], ['Sq ft', p.sqft.toLocaleString('en-US')], ['Garage', p.garage + '-car']].map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('');
    $('#pmPrice').innerHTML = p.price + '<small>' + p.note + '</small>';
    $('#pmBlurb').textContent = p.blurb;
    $('#pmFeat').innerHTML = p.feat.map(function (f) { return '<li>' + ic('check') + esc(f) + '</li>'; }).join('');
    var prog = $('#pmProg');
    if (p.s === 'Under construction') { prog.hidden = false; prog.innerHTML = '<p>Build progress · stage ' + p.stage + ' of 6: ' + STG[p.stage - 1] + '</p>' + progHTML(p); }
    else prog.hidden = true;
    $('#pmThumbs').innerHTML = gal().map(function (g, i) { return '<button type="button" data-thumb="' + i + '" aria-label="Show photo ' + (i + 1) + ' of 4"><img src="' + U(g, 320, 230, 60) + '" alt=""></button>'; }).join('');
    setMain(0);
    var cta = $('#pmCta'); cta.innerHTML = '<span>' + st.cta + '</span><i class="btn__arr">' + ic('arrow') + '</i>'; cta.dataset.cta = p.id;
    $('#pmSave').dataset.id = p.id;
    syncSave();
    hideCard(true);
    pm.hidden = false; lock(); pmPanel.scrollTop = 0;
    setTimeout(function () { pmPanel.focus(); }, 30);
    document.addEventListener('keydown', pmKeys);
  }
  function closePM() {
    if (pm.hidden) return;
    pm.hidden = true; unlock(); document.removeEventListener('keydown', pmKeys);
    if (pmFrom && pmFrom.focus && document.body.contains(pmFrom)) pmFrom.focus({ preventScroll: true });
  }
  function pmKeys(e) {
    if (e.key === 'Escape') return closePM();
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) setMain(pmIdx + (e.key === 'ArrowRight' ? 1 : -1));
    pmTrap(e);
  }
  pm.addEventListener('click', function (e) {
    if (e.target.closest('[data-close-pm]')) return closePM();
    var t = e.target.closest('[data-thumb]'); if (t) return setMain(+t.dataset.thumb);
    var a = e.target.closest('[data-gal]'); if (a) setMain(pmIdx + (+a.dataset.gal));
  });
  $('#pmSave').addEventListener('click', function () { toggleSave(this.dataset.id, this); });

  /* ================= cost estimator ================= */
  var RATES = { signature: [205, 240], premium: [240, 290], estate: [290, 370] };
  var FIN = { signature: 'Signature', premium: 'Premium', estate: 'Estate' };
  var SPLIT = [['Design & permits', '#e3895f', 7], ['Site & foundation', '#c9a36b', 12], ['Structure', '#d9cebd', 24], ['Systems', '#8f877b', 18], ['Finishes', '#ede8e0', 32], ['Outdoor & landscaping', '#6f8a5f', 7]];
  var est = $('#est'), size = $('#estSize'), cur = { lo: 0, hi: 0 };
  function estimate(sq, fin, stories, ups) {
    var f = stories === 1 ? 1.06 : 1, r = RATES[fin], uLo = 0, uHi = 0;
    (ups || []).forEach(function (id) { uLo += upById[id].lo; uHi += upById[id].hi; });
    var m = Math.round(7 + (sq - 2000) / 1300 + ({ signature: 0, premium: .6, estate: 1.6 })[fin]);
    return { lo: Math.round((sq * r[0] * f + uLo) / 5000) * 5000, hi: Math.round((sq * r[1] * f + uHi) / 5000) * 5000, psf: [Math.round(r[0] * f), Math.round(r[1] * f)], months: [m, m + 2], uLo: uLo };
  }
  function beds(sq) { return sq < 2600 ? 3 : sq < 3600 ? 4 : sq < 5000 ? 5 : 6; }
  function tween(from, to, fn) {
    if (reduce || from === to) return fn(to);
    var t0 = performance.now();
    (function step(t) { var k = Math.min(1, (t - t0) / 600), e = 1 - Math.pow(1 - k, 3); fn(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); })(t0);
  }
  function renderChips() {
    $('#estUps').innerHTML = UPS.map(function (u) {
      var on = state.ups.indexOf(u.id) > -1;
      return '<button type="button" class="chip" data-est-up="' + u.id + '" aria-pressed="' + on + '">' + ic(on ? 'check' : u.ic) + u.c + '</button>';
    }).join('');
  }
  function estVals() { return { sq: +size.value, fin: est.elements.finish.value || 'premium', st: +(est.elements.stories.value || 2) }; }
  function calc() {
    var v = estVals(), r = estimate(v.sq, v.fin, v.st, state.ups);
    $('#estSizeOut').textContent = v.sq.toLocaleString('en-US') + ' sq ft';
    size.style.setProperty('--fill', ((v.sq - 2000) / 5000 * 100) + '%');
    var lo0 = cur.lo || r.lo, hi0 = cur.hi || r.hi;
    tween(lo0, r.lo, function (x) { $('#estLow').textContent = short(Math.round(x / 5000) * 5000); });
    tween(hi0, r.hi, function (x) { $('#estHigh').textContent = short(Math.round(x / 5000) * 5000); });
    cur = { lo: r.lo, hi: r.hi };
    $('#estPsf').textContent = '$' + r.psf[0] + '–$' + r.psf[1];
    $('#estTime').textContent = r.months[0] + '–' + r.months[1] + ' months';
    $('#estBeds').textContent = beds(v.sq) + ' bedrooms';
    var fx = v.fin === 'estate' ? 6 : v.fin === 'signature' ? -4 : 0, up = Math.round(r.uLo / Math.max(r.lo, 1) * 100);
    var parts = SPLIT.map(function (s) { return [s[0], s[1], s[2] + (s[0] === 'Finishes' ? fx : s[0] === 'Structure' ? -fx / 2 : s[0] === 'Outdoor & landscaping' ? up : 0)]; });
    var tot = parts.reduce(function (a, s) { return a + s[2]; }, 0);
    $('#split').innerHTML = parts.map(function (s) { return '<i style="background:' + s[1] + ';flex-grow:' + s[2] + '" title="' + s[0] + '"></i>'; }).join('');
    $('#splitKey').innerHTML = parts.map(function (s) { return '<li><i style="background:' + s[1] + '"></i>' + s[0] + ' ' + Math.round(s[2] / tot * 100) + '%</li>'; }).join('');
  }
  size.addEventListener('input', calc);
  est.addEventListener('change', calc);
  $('#estUps').addEventListener('click', function (e) { var b = e.target.closest('[data-est-up]'); if (b) { toggleUp(b.dataset.estUp); var a = $('[data-est-up="' + b.dataset.estUp + '"]'); if (a) a.focus(); } });
  renderChips(); calc();
  $('#estTalk').addEventListener('click', function (e) {
    e.preventDefault();
    var v = estVals(), r = estimate(v.sq, v.fin, v.st, state.ups);
    var ups = state.ups.length ? ', with ' + state.ups.map(function (id) { return upById[id].n.toLowerCase(); }).join(', ') : '';
    prefill('My estimate: ' + v.sq.toLocaleString('en-US') + ' sq ft, ' + FIN[v.fin] + ' finishes, ' + (v.st === 1 ? 'one story' : 'two stories') + ups + ' (' + short(r.lo) + '–' + short(r.hi) + '). I’d like to talk it through.');
    goContact();
  });
  $('#estPlan').addEventListener('click', function () { var v = estVals(); openPlanner({ size: v.sq, finish: v.fin }); });

  /* ================= reviews slider ================= */
  var rsl = $('#rsl'), rq = $$('.rq', rsl), rimg = $$('.rsl__img img', rsl), rbar = $$('.rsl__prog i', rsl), rIdx = 0, rT = null, DUR = 7000;
  function rShow(i) {
    rIdx = (i + rq.length) % rq.length;
    rq.forEach(function (q, k) { q.classList.toggle('is-on', k === rIdx); });
    rimg.forEach(function (m, k) { m.classList.toggle('is-on', k === rIdx); });
    rbar.forEach(function (b, k) { b.classList.remove('run'); b.classList.toggle('done', k < rIdx); });
    void rsl.offsetWidth;
    if (!reduce) rbar[rIdx].classList.add('run'); else rbar[rIdx].classList.add('done');
    rbar[rIdx].style.setProperty('--dur', DUR + 'ms');
    $('#rslTag').textContent = rq[rIdx].dataset.tag;
    $('#rslN').textContent = pad(rIdx + 1) + ' / ' + pad(rq.length);
    clearTimeout(rT);
    if (!reduce && !rsl.classList.contains('is-paused')) rT = setTimeout(function () { rShow(rIdx + 1); }, DUR);
  }
  $('#rslPrev').addEventListener('click', function () { rShow(rIdx - 1); });
  $('#rslNext').addEventListener('click', function () { rShow(rIdx + 1); });
  rsl.addEventListener('mouseenter', function () { rsl.classList.add('is-paused'); clearTimeout(rT); });
  rsl.addEventListener('mouseleave', function () { rsl.classList.remove('is-paused'); rShow(rIdx); });
  rShow(0);

  /* ================= FAQ ================= */
  $$('#faqList details').forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) $$('#faqList details').forEach(function (o) { if (o !== d) o.open = false; }); if (motion) ScrollTrigger.refresh(); });
  });

  /* ================= validation + forms ================= */
  function clearErr(form) { $$('.fld.is-err', form).forEach(function (f) { f.classList.remove('is-err'); var m = $('.err', f); if (m) m.remove(); }); }
  function err(input, msg) { var f = input.closest('.fld'); if (!f) return; f.classList.add('is-err'); var m = document.createElement('span'); m.className = 'err'; m.textContent = msg; f.appendChild(m); }
  function validate(form) {
    clearErr(form);
    var bad = [], el = form.elements;
    if (el.name && !el.name.value.trim()) { err(el.name, 'Please enter your name'); bad.push(el.name); }
    if (el.phone && el.phone.value.replace(/\D/g, '').length < 10) { err(el.phone, 'Please enter a 10-digit phone number'); bad.push(el.phone); }
    if (el.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.email.value.trim())) { err(el.email, 'Please enter a valid email'); bad.push(el.email); }
    if (bad.length) bad[0].focus();
    return !bad.length;
  }
  $$('.fld input').forEach(function (i) { i.addEventListener('input', function () { var f = i.closest('.fld'); if (f.classList.contains('is-err')) { f.classList.remove('is-err'); var m = $('.err', f); if (m) m.remove(); } }); });
  cform.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(cform)) return;
    var name = cform.elements.name.value.trim().split(' ')[0];
    $('[data-name]', cform).textContent = name ? ', ' + name : '';
    $('.cform__body', cform).hidden = true;
    var done = $('.cform__done', cform); done.hidden = false; done.focus({ preventScroll: true });
    leadDone();
  });
  function emailOnly(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = form.elements.email, box = inp.closest('.inline-field'), ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inp.value.trim());
      box.classList.toggle('is-err', !ok);
      if (!ok) { inp.focus(); inp.setAttribute('aria-invalid', 'true'); return; }
      box.hidden = true; $('.okmsg', form).hidden = false; leadDone();
    });
  }
  emailOnly($('#xmForm'));

  /* ================= planner (full-screen) ================= */
  var planner = $('#planner'), plMain = $('.planner__main', planner), plForm = $('#plForm'), plSteps = $$('.pl__step', plForm), plStep = 1, plFrom = null, plTrap = trap(plMain);
  var plBack = $('.pl__back', planner), plNext = $('.pl__next', planner), plSize = $('#plSize'), plPtr = 0;
  var PL_MEDIA = {
    1: ['1599809275671-b5942cabc7a2', 'Step 1 · Your plan', 'Every Ward home starts with a conversation'],
    2: ['1570129477492-45c003edd2be', 'Step 2 · Your style', 'Modern farmhouse'],
    3: ['1600210491892-03d54c0aaf87', 'Step 3 · Your space', 'Room for the way you live'],
    4: ['1568605114967-8130f3a36994', 'Step 4 · Your timeline', 'Picture move-in day'],
    5: ['1600585154340-be6161a56a0c', 'Step 5 · Your ballpark', 'One fixed price, in writing']
  };
  function plMedia(id, k, cap) {
    var img = $('#plImg'), src = U(id, 1300, 0, 74);
    if (img.getAttribute('src') !== src) { img.style.opacity = .35; var im = new Image(); im.onload = function () { img.src = src; img.style.opacity = 1; }; im.src = src; }
    $('#plCapK').textContent = k; $('#plCap').textContent = cap;
  }
  function plVal(name) { var r = $('input[name="' + name + '"]:checked', plForm); return r ? r.value : ''; }
  function plCalc() {
    var sq = +plSize.value, fin = plVal('plFinish') || 'premium';
    $('#plSizeOut').textContent = sq.toLocaleString('en-US');
    $('#plBeds').textContent = 'About ' + beds(sq) + ' bedrooms · ' + FIN[fin] + ' finishes';
    plSize.style.setProperty('--fill', ((sq - 2000) / 5000 * 100) + '%');
    var r = estimate(sq, fin, 2, state.ups);
    $('#plLo').textContent = short(r.lo); $('#plHi').textContent = short(r.hi);
    $('#plSum').textContent = [sq.toLocaleString('en-US') + ' sq ft', FIN[fin] + ' finishes', plVal('style'), plVal('when') && 'move in ' + plVal('when').toLowerCase(), r.months[0] + '–' + r.months[1] + ' month build'].filter(Boolean).join(' · ');
  }
  function plSyncNav() {
    var done = !$('.pl__done', plForm).hidden;
    plBack.hidden = plStep === 1 || done;
    plNext.hidden = done || plStep === 5 || ((plStep === 1 || plStep === 2 || plStep === 4) && !$('.pl__step.is-on input:checked', plForm));
  }
  function plGo(n) {
    plStep = n;
    plSteps.forEach(function (s) { s.classList.toggle('is-on', +s.dataset.step === n); });
    $('#plStep').textContent = pad(n) + ' / 05';
    $('.planner__bar i', planner).style.width = (n / 5 * 100) + '%';
    var m = PL_MEDIA[n];
    if (n === 2 || n === 5) { var chosen = $('input[name="style"]:checked', plForm); if (chosen) { var l = chosen.closest('[data-img]'); m = [l.dataset.img, m[1], n === 2 ? chosen.value : m[2]]; } }
    plMedia(m[0], m[1], m[2]);
    if (n === 5) { plCalc(); setTimeout(function () { plForm.elements.name.focus({ preventScroll: true }); }, 120); }
    plSyncNav();
    plMain.scrollTop = 0;
  }
  function openPlanner(pre) {
    plFrom = document.activeElement;
    if (pre && pre.size) { plSize.value = pre.size; }
    if (pre && pre.finish) { var f = $('input[name="plFinish"][value="' + pre.finish + '"]', plForm); if (f) f.checked = true; }
    plCalc();
    if ($('.pl__done', plForm).hidden) plGo(plStep > 4 ? 5 : plStep || 1);
    planner.hidden = false; lock();
    requestAnimationFrame(function () { planner.classList.add('is-in'); });
    if (motion) gsap.fromTo(planner, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .9, ease: 'expo.inOut' });
    setTimeout(function () { plMain.focus(); }, 60);
    document.addEventListener('keydown', plKeys);
    mbar.classList.remove('is-on');
  }
  function closePlanner(go) {
    if (planner.hidden) return;
    var finish = function () { planner.hidden = true; planner.classList.remove('is-in'); planner.style.clipPath = ''; unlock(); if (go) scrollToEl($(go), go === '#homes' ? 0 : undefined); else if (plFrom && plFrom.focus) plFrom.focus({ preventScroll: true }); onScroll(); };
    document.removeEventListener('keydown', plKeys);
    if (motion) gsap.fromTo(planner, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: .7, ease: 'expo.inOut', onComplete: finish }); else finish();
  }
  function plKeys(e) { if (e.key === 'Escape') closePlanner(); else plTrap(e); }
  planner.addEventListener('click', function (e) { var c = e.target.closest('[data-close-planner]'); if (c) closePlanner(c.dataset.go); });
  plForm.addEventListener('pointerdown', function () { plPtr = Date.now(); });
  plForm.addEventListener('change', function (e) { if (e.target.name === 'plFinish') plCalc(); plSyncNav(); });
  plForm.addEventListener('click', function (e) {
    var inp = e.target.closest('.plo input'); if (!inp) return;
    plSyncNav();
    if (inp.name === 'style') { var l = inp.closest('[data-img]'); plMedia(l.dataset.img, PL_MEDIA[2][1], inp.value); }
    if (Date.now() - plPtr > 900) return; // keyboard: arrows choose, Continue moves on
    var n = +inp.closest('.pl__step').dataset.step;
    setTimeout(function () { if (plStep === n) plGo(n + 1); }, reduce ? 0 : 320);
  });
  plForm.addEventListener('mouseover', function (e) { var l = e.target.closest('.plo--img'); if (l && plStep === 2) plMedia(l.dataset.img, PL_MEDIA[2][1], $('b', l).textContent); });
  plSize.addEventListener('input', plCalc);
  plNext.addEventListener('click', function () { if (plStep < 5) { plGo(plStep + 1); var f = $('.pl__step.is-on input', plForm); if (f && plStep !== 5) f.focus({ preventScroll: true }); } });
  plBack.addEventListener('click', function () { if (plStep > 1) plGo(plStep - 1); });
  plForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(plForm)) return;
    var name = plForm.elements.name.value.trim().split(' ')[0];
    $('[data-name]', plForm).textContent = name ? ', ' + name : '';
    plSteps.forEach(function (s) { s.classList.remove('is-on'); });
    var done = $('.pl__done', plForm); done.hidden = false; done.focus({ preventScroll: true });
    $('#plStep').textContent = 'Done'; $('.planner__bar i', planner).style.width = '100%';
    plSyncNav();
    cform.elements.name.value = plForm.elements.name.value; cform.elements.phone.value = plForm.elements.phone.value; cform.elements.email.value = plForm.elements.email.value;
    var goal = plVal('goal');
    prefill('My plan: ' + $('#plSum').textContent + ' (' + $('#plLo').textContent + '–' + $('#plHi').textContent + ').' + (goal ? ' Goal: ' + goal + '.' : ''),
      goal === 'Build on my lot' ? 'Building on my lot' : goal === 'Find a lot and build' ? 'Finding a lot + building' : goal === 'Buy a move-in ready home' ? 'An available home' : 'Not sure yet');
    leadDone();
  });

  /* ================= exit intent (desktop, once per session) ================= */
  var xm = $('#xm'), xmPanel = $('.xm__panel', xm), xmTrap = trap(xmPanel), xmFrom = null, t0 = Date.now();
  function openXM() {
    if (state.lead || ss.get('wh2_xm') || !pm.hidden || !planner.hidden || drawer.classList.contains('is-open') || root.classList.contains('is-intro')) return;
    ss.set('wh2_xm', '1'); xmFrom = document.activeElement;
    xm.hidden = false; lock();
    setTimeout(function () { xmPanel.focus(); }, 30);
    document.addEventListener('keydown', xmKeys);
  }
  function closeXM() { if (xm.hidden) return; xm.hidden = true; unlock(); document.removeEventListener('keydown', xmKeys); if (xmFrom && xmFrom.focus) xmFrom.focus({ preventScroll: true }); }
  function xmKeys(e) { if (e.key === 'Escape') closeXM(); else xmTrap(e); }
  xm.addEventListener('click', function (e) { if (e.target.closest('[data-close-xm]')) closeXM(); });
  if (fine) document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY <= 0 && Date.now() - t0 > 15000) openXM(); });

  /* ================= counters ================= */
  function countUp(el) {
    var to = +el.dataset.count;
    if (reduce) { el.textContent = to; return; }
    var t1 = performance.now();
    (function step(t) { var k = Math.min(1, (t - t1) / 1800), e = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(to * e); if (k < 1) requestAnimationFrame(step); })(t1);
  }
  if ('IntersectionObserver' in window && !reduce) {
    var cio = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { countUp(x.target); cio.unobserve(x.target); } }); }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { el.textContent = '0'; cio.observe(el); });
  }

  /* ================= cursor + magnetic buttons ================= */
  if (fine && motion) {
    var cEl = $('.cursor'), cl = $('span', cEl), qx = gsap.quickTo(cEl, 'x', { duration: .45, ease: 'power3' }), qy = gsap.quickTo(cEl, 'y', { duration: .45, ease: 'power3' }), shown = false;
    window.addEventListener('mousemove', function (e) { qx(e.clientX); qy(e.clientY); }, { passive: true });
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor]');
      var over = t && !e.target.closest('button.save, .btn, .badge');
      if (over) { cl.textContent = t.dataset.cursor; if (!shown) { shown = true; gsap.to(cEl, { scale: 1, opacity: 1, duration: .5, ease: 'expo.out' }); } }
      else if (shown) { shown = false; gsap.to(cEl, { scale: 0, opacity: 0, duration: .4, ease: 'expo.out' }); }
    });
    $$('[data-magnetic]').forEach(function (b) {
      b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .6, ease: 'power3.out' }); });
      b.addEventListener('mouseleave', function () { gsap.to(b, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1, .45)' }); });
    });
  }

  /* ================= line splitting for headline reveals ================= */
  function splitLines(el) {
    var orig = el.innerHTML, tokens = [];
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      var words = n.textContent.split(/\s+/).filter(Boolean);
      words.forEach(function (w) {
        var s = document.createElement('span'); s.textContent = w;
        if (n.nodeType === 1) { var c = n.cloneNode(false); c.appendChild(s); tokens.push(c); } else tokens.push(s);
      });
    });
    el.textContent = '';
    tokens.forEach(function (t, i) { el.appendChild(t); if (i < tokens.length - 1) el.appendChild(document.createTextNode(' ')); });
    // group words into visual lines by their vertical centre (serif accents sit at a slightly different height)
    var lines = [], last = null, tol = parseFloat(getComputedStyle(el).fontSize) * .45;
    tokens.forEach(function (t) { var r = t.getBoundingClientRect(), mid = r.top + r.height / 2; if (last === null || Math.abs(mid - last) > tol) { lines.push([]); last = mid; } lines[lines.length - 1].push(t); });
    el.textContent = '';
    lines.forEach(function (line) {
      var rl = document.createElement('span'), inner = document.createElement('span');
      rl.className = 'rl';
      line.forEach(function (t, i) { inner.appendChild(t); if (i < line.length - 1) inner.appendChild(document.createTextNode(' ')); });
      rl.appendChild(inner); el.appendChild(rl);
    });
    return orig;
  }

  /* ================= motion setup ================= */
  function heroIn() {
    if (!motion) return;
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hl__in', { yPercent: 110, duration: 1.4, stagger: .09 }, .05)
      .from('.cap', { scaleX: 0, duration: 1.3, ease: 'expo.inOut', stagger: .15 }, .25)
      .from('.cap img', { scale: 1.8, duration: 1.6 }, .25)
      .to('.hero .rv-fade', { opacity: 1, y: 0, duration: 1.1, stagger: .08 }, .45)
      .from('.hero__frame', { yPercent: 12, opacity: 0, duration: 1.4 }, .5);
  }
  function setupScroll() {
    if (!motion) return;
    // homes: pinned horizontal scroll on large screens (created first: everything below depends on its spacing)
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', function () {
      homesSec.classList.add('is-h');
      var dist = function () { return Math.max(0, hin.scrollWidth - (track.clientWidth - parseFloat(getComputedStyle(track).paddingLeft))); };
      hTween = gsap.to(hin, { x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: homesSec, pin: true, start: 'top top', end: function () { return '+=' + dist(); }, scrub: .8, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function (s) { setHCount(s.progress); } } });
      gsap.fromTo('.hp__media img', { objectPosition: '30% 50%' }, { objectPosition: '70% 50%', ease: 'none', scrollTrigger: { trigger: homesSec, start: 'top top', end: function () { return '+=' + dist(); }, scrub: true, invalidateOnRefresh: true } });
      return function () { homesSec.classList.remove('is-h'); gsap.set(hin, { x: 0 }); };
    });
    setupBuild();
    // headline line reveals
    $$('.rv-lines').forEach(function (el) {
      var orig = splitLines(el), inner = $$('.rl > span', el);
      gsap.set(inner, { yPercent: 110 });
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: function () {
        gsap.to(inner, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: .1, onComplete: function () { el.innerHTML = orig; refreshSoon(); } });
      } });
    });
    var fades = $$('.rv-fade').filter(function (el) { return !el.closest('.hero'); });
    ScrollTrigger.batch(fades, { start: 'top 90%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .08 }); } });
    $$('.img-rv').forEach(function (el) {
      ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function () {
        gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' });
        gsap.from($('img', el), { scale: 1.3, duration: 1.8, ease: 'expo.out' });
      } });
    });
    // hero image: inset frame opens to full bleed, image drifts
    var frame = $('.hero__frame');
    gsap.fromTo(frame, { clipPath: function () { return 'inset(0px ' + gut() + 'px 0px ' + gut() + 'px round 28px)'; } }, {
      clipPath: 'inset(0px 0px 0px 0px round 0px)', ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top 80%', end: 'top 12%', scrub: true, invalidateOnRefresh: true }
    });
    gsap.fromTo('.hero__frame img', { yPercent: -10 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } });
    // stat strip + big marquee with scroll velocity
    gsap.from('.stat', { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.proof__grid', start: 'top 85%' } });
    var mq = gsap.to('.bigmq__track', { xPercent: -50, ease: 'none', duration: 32, repeat: -1 });
    ScrollTrigger.create({ trigger: '.bigmq', start: 'top bottom', end: 'bottom top', onUpdate: function (s) {
      var v = Math.abs(s.getVelocity());
      gsap.to(mq, { timeScale: 1 + Math.min(v / 350, 5), duration: .25, overwrite: true, onComplete: function () { gsap.to(mq, { timeScale: 1, duration: 1.2 }); } });
    } });
    gsap.from('.hp', { opacity: 0, y: 60, duration: 1.2, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: '.htrack', start: 'top 88%' } });
    // map: highways draw in
    $$('.dfw .hwy').forEach(function (l) { var len = l.getTotalLength(); l.style.strokeDasharray = len; l.style.strokeDashoffset = len; });
    gsap.to('.dfw .hwy', { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', stagger: .12, scrollTrigger: { trigger: '.where__map', start: 'top 75%' } });
    gsap.from('.dfw .pin', { scale: 0, transformOrigin: 'center', duration: .9, ease: 'back.out(2)', stagger: .08, scrollTrigger: { trigger: '.where__map', start: 'top 60%' } });
    gsap.from('.clist li', { opacity: 0, x: -20, duration: .8, ease: 'expo.out', stagger: .04, scrollTrigger: { trigger: '.clist', start: 'top 85%' } });
    // promise cards stack and recede
    var cards = $$('.scard');
    cards.forEach(function (c, i) {
      if (i === cards.length - 1) return;
      gsap.to(c, { scale: .9 + i * .025, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: function () { return 'top ' + (hdrH() + 40 + (i + 1) * 22); }, scrub: true, invalidateOnRefresh: true } });
      gsap.to($('.scard__img img', c), { scale: 1.12, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top top', scrub: true } });
    });
    gsap.from('.compare__row', { opacity: 0, y: 20, duration: .8, ease: 'expo.out', stagger: .06, scrollTrigger: { trigger: '.compare', start: 'top 85%' } });
    // cost readout + reviews + about + contact
    gsap.from('.readout', { y: 60, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.cost__grid', start: 'top 80%' } });
    gsap.fromTo('.rsl__img', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.rsl', start: 'top 80%' } });
    gsap.fromTo('#sign', { clipPath: 'inset(-30% 100% -30% -10%)' }, { clipPath: 'inset(-30% -30% -30% -10%)', duration: 2, ease: 'power2.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: '#sign', start: 'top 88%' } });
    gsap.fromTo('.about__arch img', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.about__stamp', { rotate: -40 }, { rotate: 20, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.contact__bg img', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.cform', { y: 80, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.contact__grid', start: 'top 85%' } });
    gsap.from('.foot__mark', { yPercent: 60, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.foot__mark', start: 'top 98%' } });
    if (document.readyState === 'complete') refreshSoon(); else window.addEventListener('load', refreshSoon);
  }
  var refreshT;
  function refreshSoon() { clearTimeout(refreshT); refreshT = setTimeout(function () { ScrollTrigger.refresh(); }, 150); }

  /* ================= intro, then everything else ================= */
  function start() {
    setupScroll();
    onScroll();
    if (root.classList.contains('is-intro') && motion) {
      if (lenis) lenis.stop();
      var cnt = { v: 0 }, num = $('.loader__count span'), paths = $$('.loader__mark path');
      paths.forEach(function (p) { var l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
      var tl = gsap.timeline({ onComplete: function () { root.classList.remove('is-intro'); ss.set('wh2_intro', '1'); if (lenis) lenis.start(); ScrollTrigger.refresh(); } });
      tl.to(paths, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: .15 }, 0)
        .from('.loader__word, .loader__meta', { y: 24, opacity: 0, duration: .8, ease: 'expo.out', stagger: .08 }, .2)
        .to(cnt, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: function () { num.textContent = Math.round(cnt.v); } }, 0)
        .fromTo('.loader', { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, 1.4)
        .add(heroIn, 1.65);
    } else {
      root.classList.remove('is-intro');
      ss.set('wh2_intro', '1');
      heroIn();
    }
  }
  var started = false;
  function go() { if (started) return; started = true; start(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
  setTimeout(go, 1500); // never wait on slow fonts
  onScroll();

  /* ================= design notes (open the page with ?notes) ================= */
  var NOTES = {
    hero: ['The first 5 seconds', [
      'The headline says what Ward does (custom homes) and answers the biggest fear of building one (surprises), at a size nobody can miss.',
      'The two buttons serve two kinds of visitor: ready to talk (free consultation) or still researching (ballpark price in 60 seconds).',
      'Proof sits right under the buttons, where people hesitate: rating, homes built, warranty. The photo expands as you scroll, so the first scroll already feels premium.']],
    proof: ['Proof before the pitch', [
      'Big, specific numbers are more believable than adjectives: “150+ homes, 98% on schedule” beats “quality builder”.',
      'The moving band repeats the four promises in huge type, and speeds up as you scroll, so even fast scrollers read them.']],
    homes: ['What visitors came for', [
      'Sean asked for a place to host projects, and it’s the main reason people visit a builder’s site, so it comes first.',
      'The section pins and scrolls sideways like a gallery: memorable, and it shows every home without a long page.',
      'Filters split ready-to-buy shoppers (Available now, with prices) from custom-build leads. Each button matches the home’s status: Schedule a tour, Ask about this home, Build one like this.',
      'The heart saves homes to a shortlist with popular upgrades. Undecided visitors stay instead of leaving, and their picks arrive with the enquiry.']],
    where: ['Local relevance', [
      'People search by city (“custom home builder Frisco”). Listing the cities helps local SEO and tells visitors “we build near you”.',
      'A hand-drawn map of DFW (highways, lakes, distance rings from the Dallas studio) instead of a generic Google map, with every project pinned.']],
    why: ['Taking the risk out', [
      'Once someone likes the homes, the next thought is “what could go wrong?”. Four promises answer the four big fears: budget, schedule, communication, quality.',
      'The cards stack as you scroll, so each promise gets the whole screen, and each ends with a proof line.',
      'The comparison makes choosing Ward easy without naming any competitor.']],
    process: ['Making the first step feel small', [
      'People hold back when they don’t know what happens next. Six stages with timeframes remove that.',
      'The house draws itself as you scroll, from plans to keys: the signature moment of the page, and a story Sean can tell in every meeting.',
      'Texas has no state license for home builders, so seeing the work stage by stage is how buyers decide who to trust.']],
    cost: ['Answering “how much?”', [
      'Price is everyone’s first question and most builder sites dodge it. An honest range builds trust immediately.',
      'The breakdown shows where the money goes, and upgrades picked here also appear in the saved-homes panel.',
      '“Get my detailed plan” opens the 60-second planner with these numbers already filled in, turning curiosity into a lead.']],
    reviews: ['Social proof at decision time', [
      'Placed just before the ask, when doubt is highest. Each featured story answers a different fear: budget, relocating, a tricky lot.',
      'The moving wall of short reviews below shows volume. These will be replaced with Sean’s real Google reviews.']],
    about: ['People hire people', [
      'Against big production builders, Sean himself is the advantage: a first-person promise, a signature that writes itself, and his cell number.',
      '“A limited number of homes each year” explains the personal attention and creates honest urgency, with no fake countdowns.',
      'Placeholder photos: a photo of Sean on site goes here.']],
    faq: ['Clearing the last objections', [
      'Answers the questions that stop people from getting in touch: cost, land, timeline, what’s included, financing, warranty.',
      'A direct line to Sean sits alongside, for people who would rather call.']],
    contact: ['The ask', [
      '“Let’s build yours” in huge type is the emotional close. “What happens next” removes the fear of a hard sales pitch.',
      'Only 3 required fields, interest is one tap, and the message is pre-filled from the planner, the estimate, saved homes or the home they clicked.',
      'Site-wide: sticky header with phone and button, a Call / Text / Get my price bar on phones, and a one-time cost-guide offer when a desktop visitor is about to leave.']]
  };
  var wantNotes = /[?&#]notes\b/.test(location.search + location.hash) || ss.get('wh2_notes') === '1';
  if (wantNotes) {
    ss.set('wh2_notes', '1');
    var k = 0;
    $$('[data-note]').forEach(function (sec) {
      var n = NOTES[sec.dataset.note]; if (!n) return; k++;
      var box = document.createElement('details');
      box.className = 'dnote';
      box.innerHTML = '<summary><b>' + k + '</b><span>Why this is here: ' + n[0] + '</span><svg class="i" aria-hidden="true"><use href="#i-chev"/></svg></summary><ul>' + n[1].map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
      (sec.classList.contains('homes') ? $('.homes__pin', sec) : sec).appendChild(box);
    });
    var tg = document.createElement('button');
    tg.type = 'button'; tg.className = 'dn-toggle';
    tg.innerHTML = '<svg class="i" aria-hidden="true"><use href="#i-note"/></svg><span>Hide design notes</span>';
    tg.addEventListener('click', function () { var on = document.body.classList.toggle('notes-on'); $('span', tg).textContent = on ? 'Hide design notes' : 'Show design notes'; });
    var all = document.createElement('button');
    all.type = 'button'; all.className = 'dn-toggle dn-toggle--all'; all.textContent = 'Open all notes';
    all.addEventListener('click', function () { var open = all.textContent === 'Open all notes'; $$('.dnote').forEach(function (d) { d.open = open; }); all.textContent = open ? 'Close all notes' : 'Open all notes'; });
    document.body.appendChild(tg); document.body.appendChild(all);
    document.body.classList.add('notes-on');
  }

  /* ================= misc ================= */
  $('#yr').textContent = new Date().getFullYear();
  renderDrawer();
})();
