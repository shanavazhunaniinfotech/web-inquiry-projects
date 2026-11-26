/* Ward Homes · Design B "Limestone & Moss" · plain JS. GSAP, ScrollTrigger and Lenis are optional enhancements. */
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
  if (motion) { gsap.registerPlugin(ScrollTrigger); root.classList.add('js-motion'); }
  var nav = $('#nav');

  /* ================= data (same sample projects as Design A and the feature demo) ================= */
  var STG = ['Design', 'Foundation', 'Framing', 'Dried in', 'Interiors', 'Keys'];
  var ST = {
    'Available': { c: 'avail', label: 'Available now', color: '#2f7d55', cta: 'Schedule a tour' },
    'Under construction': { c: 'build', label: 'Under construction', color: '#c38a2a', cta: 'Ask about it' },
    'Completed': { c: 'done', label: 'Completed', color: '#4d6a92', cta: 'Build one like it' }
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
    saved: store.get('whb_saved', []).filter(function (id) { return byId[id]; }),
    ups: store.get('whb_ups', []).filter(function (id) { return upById[id]; }),
    lead: ss.get('whb_lead') === '1'
  };
  function leadDone() { state.lead = true; ss.set('whb_lead', '1'); }

  /* ================= smooth scroll + locking ================= */
  var lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true });
    if (motion) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
  }
  var navOff = function () { return -(nav.offsetHeight + 24); };
  function scrollToEl(el, off) {
    if (!el) return;
    var o = off == null ? navOff() : off;
    if (lenis) lenis.scrollTo(el, { offset: o, duration: 1.3 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + o, behavior: reduce ? 'auto' : 'smooth' });
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
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var t = id === '#top' ? document.body : $(id);
    if (!t) return;
    e.preventDefault();
    if (!mnav.hidden) setMenu(false);
    if (id === '#top') { if (lenis) lenis.scrollTo(0, { duration: 1.3 }); else window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else scrollToEl(t, id === '#process' && procPinned ? 0 : undefined);
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

  /* ================= nav, menu, mobile bar ================= */
  var mnav = $('#mnav'), menuBtn = $('.nav__menu'), mbar = $('#mbar');
  function onScroll() {
    var heroB = $('.hero').getBoundingClientRect().bottom, ct = $('#contact').getBoundingClientRect().top;
    mbar.classList.toggle('is-on', heroB < window.innerHeight * .5 && ct > window.innerHeight * .5);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mnav.hidden = !open;
    if (open) lock(); else unlock();
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  mnav.addEventListener('click', function (e) { if (e.target === mnav) setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !mnav.hidden) setMenu(false); });
  if ('IntersectionObserver' in window) {
    var navLinks = $$('.nav__links a');
    var nio = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + x.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { nio.observe(s); });
  }

  /* ================= hero slideshow + quick start ================= */
  var slides = $$('.hero__slides img'), dots = $$('.hero__dots button'), sIdx = 0, sT = null, SDUR = 6500;
  function showSlide(i) {
    sIdx = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-on', k === sIdx); });
    dots.forEach(function (d, k) { d.classList.remove('is-on'); d.setAttribute('aria-selected', String(k === sIdx)); });
    void $('.hero__dots').offsetWidth;
    dots[sIdx].classList.add('is-on'); dots[sIdx].style.setProperty('--dur', SDUR + 'ms');
    clearTimeout(sT);
    if (!reduce) sT = setTimeout(function () { showSlide(sIdx + 1); }, SDUR);
  }
  dots.forEach(function (d) { d.addEventListener('click', function () { showSlide(+d.dataset.slide); }); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(sT); else showSlide(sIdx); });
  showSlide(0);
  $$('.qcard__opts [data-goal]').forEach(function (b) { b.addEventListener('click', function () { openPlanner({ goal: b.dataset.goal }); }); });

  /* ================= homes: bento gallery ================= */
  var galEl = $('#gal');
  function specs(p) { return p.beds + ' bd · ' + p.baths + ' ba · ' + p.sqft.toLocaleString('en-US') + ' sq ft'; }
  function progHTML(p) { return '<div class="prog" aria-hidden="true">' + STG.map(function (s, i) { return '<i class="' + (i < p.stage ? 'on' : '') + '"></i>'; }).join('') + '</div>'; }
  galEl.innerHTML = P.map(function (p) {
    var st = ST[p.s];
    return '<article class="gc" data-s="' + p.s + '" data-id="' + p.id + '">' +
      '<img src="' + U(p.img, 1400, 0, 72) + '" srcset="' + U(p.img, 700, 0, 70) + ' 700w, ' + U(p.img, 1400, 0, 72) + ' 1400w" sizes="(max-width: 760px) 86vw, (max-width: 1023px) 50vw, 60vw" alt="' + esc(p.n) + ', ' + esc(p.city) + ', Texas" loading="lazy" decoding="async">' +
      '<button class="gc__open" type="button" data-open-project="' + p.id + '" aria-label="View details: ' + esc(p.n) + '"></button>' +
      '<span class="gc__chip"><i class="dot dot--' + st.c + '"></i>' + st.label + '</span>' +
      (p.render ? '<span class="gc__ren">Rendering</span>' : '') +
      '<button class="save" type="button" data-save="' + p.id + '" aria-pressed="false" aria-label="Save ' + esc(p.n) + '">' + ic('heart') + '</button>' +
      '<div class="gc__info"><div><h3 class="gc__name">' + esc(p.n) + '</h3><p class="gc__meta">' + esc(p.city) + ', TX · ' + p.beds + ' bd · ' + p.sqft.toLocaleString('en-US') + ' sq ft' + (p.s === 'Under construction' ? ' · stage ' + p.stage + '/6' : '') + '</p>' +
        (p.s === 'Under construction' ? progHTML(p) : '') + '<p class="gc__blurb">' + esc(p.blurb) + '</p></div>' +
        '<div class="gc__r"><span class="gc__price">' + p.price + '</span><a class="btn btn--moss gc__cta" href="#contact" data-cta="' + p.id + '">' + st.cta + ic('arrow') + '</a></div></div>' +
    '</article>';
  }).join('');
  var filter = 'all';
  function layoutGal() {
    var vis = $$('.gc', galEl).filter(function (c) { return !c.hidden; });
    vis.forEach(function (c) { c.classList.remove('is-feat', 'is-half', 'is-full'); });
    if (vis.length === 1) vis[0].classList.add('is-full');
    else if (vis.length === 2) vis.forEach(function (c) { c.classList.add('is-half'); });
    else if (vis.length) vis[0].classList.add('is-feat');
  }
  layoutGal();
  $('.homes__tools .seg').addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]'); if (!b) return;
    filter = b.dataset.f;
    $$('[data-f]', this).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    var shown = [];
    $$('.gc', galEl).forEach(function (c) { var on = filter === 'all' || c.dataset.s === filter; c.hidden = !on; if (on) shown.push(c); });
    $$('.mrow').forEach(function (r) { r.hidden = !(filter === 'all' || byId[r.dataset.row].s === filter); });
    layoutGal(); galEl.scrollLeft = 0;
    if (motion) { gsap.fromTo(shown, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, ease: 'expo.out', stagger: .05, overwrite: true }); ScrollTrigger.refresh(); }
    syncMapFilter();
  });
  $('.seg--icons').addEventListener('click', function (e) {
    var b = e.target.closest('[data-view]'); if (!b) return;
    $$('[data-view]', this).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    var map = b.dataset.view === 'map';
    galEl.hidden = map; $('#mapview').hidden = !map;
    if (map && motion) { drawMap(); gsap.fromTo('#mapview', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7, ease: 'expo.out' }); }
    if (motion) ScrollTrigger.refresh();
  });

  /* ================= map (hand-drawn DFW, same geography as Design A) ================= */
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
  var cityKey = function (name) { return name.toLowerCase().replace(/[^a-z]/g, ''); };
  var svg = $('#dfw'), mapCard = $('#mapCard'), mapBox = $('.mapview__map'), mapDrawn = false;
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
      o.push('<text class="ring-t" x="' + (hq[0] + r * .5 + 4).toFixed(1) + '" y="' + (hq[1] - r * .866 - 4).toFixed(1) + '">' + mi + ' mi</text>');
    });
    HWY.forEach(function (h) {
      o.push('<polyline class="hwy" points="' + pts(h[1]) + '"/>');
      var a = px(h[1][h[2]][0], h[1][h[2]][1]);
      o.push('<text class="hwy-t" x="' + (a[0] + 5).toFixed(1) + '" y="' + (a[1] - 5).toFixed(1) + '">' + h[0] + '</text>');
    });
    CITIES.forEach(function (c) {
      var q = px(c[2], c[3]), big = c[0] === 'dallas' || c[0] === 'fortworth';
      o.push('<g class="city" data-city="' + c[0] + '"><circle class="cdot" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + (big ? 4.5 : 3) + '"/><text class="ctxt" x="' + (q[0] + c[4]).toFixed(1) + '" y="' + (q[1] + c[5]).toFixed(1) + '"' + (big ? ' style="font-size:18px"' : '') + '>' + c[1] + '</text></g>');
    });
    o.push('<g class="hq" transform="translate(' + (hq[0] - 16).toFixed(1) + ' ' + (hq[1] - 16).toFixed(1) + ')"><rect width="32" height="32" rx="10"/><g transform="translate(4 3) scale(.6)" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 19 20 8.5 34 19" stroke="#dce5da"/><path d="M10.5 21.5 14.6 32l5.4-7.6 5.4 7.6 4.1-10.5"/></g></g>');
    P.forEach(function (p) {
      var q = px(p.ll[0], p.ll[1]), col = ST[p.s].color;
      o.push('<g class="pin" data-pin="' + p.id + '" data-city="' + cityKey(p.city) + '" tabindex="0" role="button" aria-label="' + esc(p.n) + ', ' + ST[p.s].label + '">' +
        '<circle class="pulse" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="11" stroke="' + col + '"/><circle class="core" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="10" fill="' + col + '"/></g>');
    });
    svg.innerHTML = o.join('');
    $('#mapList').innerHTML = P.map(function (p) {
      return '<button class="mrow" type="button" data-row="' + p.id + '" data-open-project="' + p.id + '"><img src="' + U(p.img, 200, 160, 60) + '" alt="" loading="lazy"><span><b>' + esc(p.n) + '</b><small><i class="dot dot--' + ST[p.s].c + '"></i>' + esc(p.city) + ' · ' + p.price + '</small></span>' + ic('arrow') + '</button>';
    }).join('');
  })();
  function drawMap() {
    if (mapDrawn || !motion) return; mapDrawn = true;
    $$('.dfw .hwy').forEach(function (l) { var len = l.getTotalLength(); l.style.strokeDasharray = len; l.style.strokeDashoffset = len; });
    gsap.to('.dfw .hwy', { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', stagger: .1 });
    gsap.from('.dfw .pin', { scale: 0, transformOrigin: 'center', duration: .9, ease: 'back.out(2)', stagger: .08, delay: .4 });
  }
  var cardHide;
  function showCard(id) {
    var p = byId[id]; if (!p) return;
    clearTimeout(cardHide);
    mapCard.innerHTML = '<img src="' + U(p.img, 480, 256, 65) + '" alt=""><b>' + esc(p.n) + '</b><p>' + esc(p.city) + ' · ' + ST[p.s].label + ' · ' + p.price + '</p><button type="button" data-open-project="' + p.id + '">View home</button>';
    mapCard.hidden = false;
    var pin = $('[data-pin="' + id + '"] .core', svg), r = pin.getBoundingClientRect(), b = mapBox.getBoundingClientRect();
    var x = r.left - b.left + r.width / 2 + 18, y = r.top - b.top - 40;
    if (x + 250 > b.width) x = r.left - b.left - 254;
    y = clamp(y, 10, b.height - mapCard.offsetHeight - 10);
    mapCard.style.left = Math.max(10, x) + 'px'; mapCard.style.top = y + 'px';
  }
  function hideCard(now) { clearTimeout(cardHide); cardHide = setTimeout(function () { mapCard.hidden = true; }, now ? 0 : 260); }
  function hl(id, on) {
    var p = byId[id]; if (!p) return;
    var g = $('[data-pin="' + id + '"]', svg); if (g) g.classList.toggle('is-hl', on);
    $$('[data-city="' + cityKey(p.city) + '"]', svg).forEach(function (c) { c.classList.toggle('is-hl', on); });
    var row = $('[data-row="' + id + '"]'); if (row) row.classList.toggle('is-hl', on);
  }
  svg.addEventListener('mouseover', function (e) { var g = e.target.closest('.pin'); if (g) { showCard(g.dataset.pin); hl(g.dataset.pin, true); } });
  svg.addEventListener('mouseout', function (e) { var g = e.target.closest('.pin'); if (g) { hideCard(); hl(g.dataset.pin, false); } });
  svg.addEventListener('click', function (e) { var g = e.target.closest('.pin'); if (g) { if (fine) openPM(g.dataset.pin, g); else showCard(g.dataset.pin); } });
  svg.addEventListener('keydown', function (e) { var g = e.target.closest('.pin'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openPM(g.dataset.pin, g); } });
  mapCard.addEventListener('mouseenter', function () { clearTimeout(cardHide); });
  mapCard.addEventListener('mouseleave', function () { hideCard(); });
  $('#mapList').addEventListener('mouseover', function (e) { var r = e.target.closest('.mrow'); if (r) { hl(r.dataset.row, true); showCard(r.dataset.row); } });
  $('#mapList').addEventListener('mouseout', function (e) { var r = e.target.closest('.mrow'); if (r) { hl(r.dataset.row, false); hideCard(); } });
  function syncMapFilter() { P.forEach(function (p) { $('[data-pin="' + p.id + '"]', svg).style.opacity = (filter === 'all' || p.s === filter) ? 1 : .15; }); }

  /* ================= why: auto-cycling promise tabs ================= */
  var tabsEl = $('#tabs'), tabs = $$('.tab', tabsEl), timgs = $$('.tabs__media img', tabsEl), tIdx = 0, tT = null, TDUR = 6500;
  var BADGE = [['Fixed price', '$0', 'surprise change orders'], ['On schedule', '98%', 'of homes delivered on time'], ['Every Friday', '40+', 'photo updates per build'], ['Warranty', '10 yr', 'structural, in writing']];
  function showTab(i, user) {
    tIdx = (i + tabs.length) % tabs.length;
    tabs.forEach(function (t, k) { t.classList.toggle('is-on', k === tIdx); t.setAttribute('aria-selected', String(k === tIdx)); });
    timgs.forEach(function (m, k) { m.classList.toggle('is-on', k === tIdx); });
    var bd = $('#tabBadge'); bd.innerHTML = '<span>' + BADGE[tIdx][0] + '</span><b>' + BADGE[tIdx][1] + '</b><small>' + BADGE[tIdx][2] + '</small>';
    if (motion) gsap.fromTo(bd, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'expo.out' });
    tabs[tIdx].style.setProperty('--dur', TDUR + 'ms');
    var bar = $('.tab__bar', tabs[tIdx]); bar.style.display = 'none'; void bar.offsetWidth; bar.style.display = '';
    clearTimeout(tT);
    if (!reduce && tabsEl.classList.contains('is-run') && !tabsEl.classList.contains('is-paused')) tT = setTimeout(function () { showTab(tIdx + 1); }, TDUR);
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { showTab(+t.dataset.tab, true); }); });
  tabsEl.addEventListener('mouseenter', function () { if (!fine) return; tabsEl.classList.add('is-paused'); clearTimeout(tT); });
  tabsEl.addEventListener('mouseleave', function () { tabsEl.classList.remove('is-paused'); showTab(tIdx); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      var on = en[0].isIntersecting;
      tabsEl.classList.toggle('is-run', on);
      if (on) showTab(tIdx); else clearTimeout(tT);
    }, { threshold: .35 }).observe(tabsEl);
  }
  showTab(0);

  /* ================= process: pinned stage timeline ================= */
  var stages = $$('.pstage'), nodes = $$('#tlNodes li'), procPinned = false, pCur = -1;
  function setStage(i, frac) {
    $('#tlFill').style.width = (frac * 100).toFixed(2) + '%';
    if (i === pCur) return; pCur = i;
    stages.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
    nodes.forEach(function (n, k) { n.classList.toggle('is-on', k === i); n.classList.toggle('is-done', k < i); });
  }

  /* ================= saved homes (shortlist drawer with upsells) ================= */
  var drawer = $('#drawer'), dPanel = $('.drawer__panel', drawer), savedBtn = $('.nav__saved'), dFrom = null, dTrap = trap(dPanel);
  function persist() { store.set('whb_saved', state.saved); store.set('whb_ups', state.ups); }
  function isSaved(id) { return state.saved.indexOf(id) > -1; }
  function syncSave() {
    $$('[data-save]').forEach(function (b) {
      var on = isSaved(b.dataset.save), p = byId[b.dataset.save];
      b.setAttribute('aria-pressed', String(on));
      if (b.classList.contains('save')) b.setAttribute('aria-label', (on ? 'Remove ' : 'Save ') + p.n + (on ? ' from saved homes' : ''));
    });
    var ps = $('#pmSave');
    if (ps.dataset.id) { var on = isSaved(ps.dataset.id); ps.setAttribute('aria-pressed', String(on)); $('span', ps).textContent = on ? 'Saved' : 'Save'; }
    var n = state.saved.length, badge = $('.nav__n');
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
      if (!ss.get('whb_drawer_seen') && pm.hidden) { ss.set('whb_drawer_seen', '1'); openDrawer(btn); }
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
  function goContact() { scrollToEl($('#contact')); setTimeout(function () { cform.elements.name.focus({ preventScroll: true }); }, reduce ? 0 : 1400); }
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

  /* ================= home detail (side sheet) ================= */
  var pm = $('#pm'), pmPanel = $('.pm__panel', pm), pmTrap = trap(pmPanel), pmFrom = null, pmCur = null, pmIdx = 0;
  function gal() { return [pmCur.img].concat(pmCur.gal); }
  function setMain(i) {
    var g = gal(); pmIdx = (i + g.length) % g.length;
    var img = $('#pmImg'); img.src = U(g[pmIdx], 1300, 900, 74); img.alt = pmCur.n + ', ' + pmCur.city + ', Texas';
    $('#pmRender').hidden = !(pmCur.render && pmIdx === 0);
    $$('#pmThumbs button').forEach(function (b, k) { b.setAttribute('aria-current', String(k === pmIdx)); });
  }
  function openPM(id, from) {
    var p = byId[id]; if (!p) return;
    pmCur = p; pmFrom = from || document.activeElement;
    var st = ST[p.s];
    gal().forEach(function (g) { var im = new Image(); im.src = U(g, 1300, 900, 74); });
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
    $('#pmThumbs').innerHTML = gal().map(function (g, i) { return '<button type="button" data-thumb="' + i + '" aria-label="Show photo ' + (i + 1) + ' of 4"><img src="' + U(g, 320, 220, 60) + '" alt=""></button>'; }).join('');
    setMain(0);
    var cta = $('#pmCta'); cta.innerHTML = st.cta + ' ' + ic('arrow'); cta.dataset.cta = p.id;
    $('#pmSave').dataset.id = p.id;
    syncSave(); hideCard(true);
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
  var SPLIT = [['Design & permits', '#9fc4a3', 7], ['Site & foundation', '#d9c49a', 12], ['Structure', '#2e5a3f', 24], ['Systems', '#7d8f83', 18], ['Finishes', '#14241c', 32], ['Outdoor', '#c9d6c4', 7]];
  var est = $('#est'), size = $('#estSize'), stories = 2, cur = { lo: 0, hi: 0 };
  function estimate(sq, fin, st, ups) {
    var f = st === 1 ? 1.06 : 1, r = RATES[fin], uLo = 0, uHi = 0;
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
      return '<button type="button" class="chip-b" data-est-up="' + u.id + '" aria-pressed="' + on + '">' + ic(on ? 'check' : u.ic) + u.c + '</button>';
    }).join('');
  }
  function estVals() { return { sq: +size.value, fin: est.elements.finish.value || 'premium', st: stories }; }
  function calc() {
    var v = estVals(), r = estimate(v.sq, v.fin, v.st, state.ups);
    $('#estSizeOut').textContent = v.sq.toLocaleString('en-US');
    size.style.setProperty('--fill', ((v.sq - 2000) / 5000 * 100) + '%');
    var lo0 = cur.lo || r.lo, hi0 = cur.hi || r.hi;
    tween(lo0, r.lo, function (x) { $('#estLow').textContent = short(Math.round(x / 5000) * 5000); });
    tween(hi0, r.hi, function (x) { $('#estHigh').textContent = short(Math.round(x / 5000) * 5000); });
    cur = { lo: r.lo, hi: r.hi };
    $('#estPsf').textContent = '$' + r.psf[0] + '–$' + r.psf[1];
    $('#estTime').textContent = r.months[0] + '–' + r.months[1] + ' mo';
    $('#estBeds').textContent = beds(v.sq) + ' beds';
    var fx = v.fin === 'estate' ? 6 : v.fin === 'signature' ? -4 : 0, up = Math.round(r.uLo / Math.max(r.lo, 1) * 100);
    var parts = SPLIT.map(function (s) { return [s[0], s[1], s[2] + (s[0] === 'Finishes' ? fx : s[0] === 'Structure' ? -fx / 2 : s[0] === 'Outdoor' ? up : 0)]; });
    var tot = parts.reduce(function (a, s) { return a + s[2]; }, 0), C = 2 * Math.PI * 46, off = 0, o = [];
    parts.forEach(function (s) { var len = s[2] / tot * C; o.push('<circle cx="60" cy="60" r="46" stroke="' + s[1] + '" stroke-dasharray="' + Math.max(0, len - 1.5).toFixed(2) + ' ' + C.toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '"/>'); off += len; });
    $('#donut').innerHTML = o.join('');
    $('#donutKey').innerHTML = parts.map(function (s) { return '<li><i style="background:' + s[1] + '"></i>' + s[0] + '<b>' + Math.round(s[2] / tot * 100) + '%</b></li>'; }).join('');
  }
  size.addEventListener('input', calc);
  est.addEventListener('change', calc);
  $$('[data-step]', est).forEach(function (b) { b.addEventListener('click', function () { size.value = clamp(+size.value + (+b.dataset.step), 2000, 7000); calc(); }); });
  $$('[data-stories]', est).forEach(function (b) { b.addEventListener('click', function () { stories = +b.dataset.stories; $$('[data-stories]', est).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); calc(); }); });
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

  /* ================= reviews ================= */
  var feat = $('#feat'), fqs = $$('.fq', feat), fimgs = $$('#feat > img'), fdots = $$('.feat__dots button', feat), fIdx = 0, fT = null;
  function showFq(i) {
    fIdx = (i + fqs.length) % fqs.length;
    fqs.forEach(function (q, k) { q.classList.toggle('is-on', k === fIdx); });
    fimgs.forEach(function (m, k) { m.classList.toggle('is-on', k === fIdx); });
    fdots.forEach(function (d, k) { d.classList.toggle('is-on', k === fIdx); });
    clearTimeout(fT);
    if (!reduce) fT = setTimeout(function () { showFq(fIdx + 1); }, 7000);
  }
  fdots.forEach(function (d) { d.addEventListener('click', function () { showFq(+d.dataset.fq); }); });
  showFq(0);
  $$('.vcol__track').forEach(function (t) { t.innerHTML += t.innerHTML; $$('figure', t).slice(t.children.length / 2).forEach(function (f) { f.setAttribute('aria-hidden', 'true'); }); });

  /* ================= FAQ ================= */
  $$('#faqList details').forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) $$('#faqList details').forEach(function (o) { if (o !== d) o.open = false; }); if (motion) refreshSoon(); });
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
  $('#xmForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = this, inp = form.elements.email, box = inp.closest('.inline-field'), ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inp.value.trim());
    box.classList.toggle('is-err', !ok);
    if (!ok) { inp.focus(); inp.setAttribute('aria-invalid', 'true'); return; }
    box.hidden = true; $('.okmsg', form).hidden = false; leadDone();
  });

  /* ================= planner (centered sheet) ================= */
  var planner = $('#planner'), plSheet = $('.planner__sheet', planner), plForm = $('#plForm'), plSteps = $$('.pl__step', plForm), plStep = 1, plFrom = null, plTrap = trap(plSheet);
  var plBack = $('.pl__back', planner), plNext = $('.pl__next', planner), plSize = $('#plSize'), plPtr = 0;
  function plVal(name) { var r = $('input[name="' + name + '"]:checked', plForm); return r ? r.value : ''; }
  function plCalc() {
    var sq = +plSize.value, fin = plVal('plFinish') || 'premium';
    $('#plSizeOut').textContent = sq.toLocaleString('en-US');
    $('#plBeds').textContent = 'sq ft · about ' + beds(sq) + ' bedrooms';
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
    $('#plStep').textContent = 'Step ' + n + ' of 5';
    $$('.planner__steps i', planner).forEach(function (b, k) { b.classList.toggle('on', k < n); });
    if (n === 5) { plCalc(); setTimeout(function () { plForm.elements.name.focus({ preventScroll: true }); }, 120); }
    plSyncNav(); plSheet.scrollTop = 0;
  }
  function openPlanner(pre) {
    plFrom = document.activeElement;
    if (pre && pre.size) plSize.value = pre.size;
    if (pre && pre.finish) { var f = $('input[name="plFinish"][value="' + pre.finish + '"]', plForm); if (f) f.checked = true; }
    plCalc();
    if ($('.pl__done', plForm).hidden) {
      if (pre && pre.goal) { var g = $('input[name="goal"][value="' + pre.goal + '"]', plForm); if (g) g.checked = true; plGo(2); }
      else plGo(plStep || 1);
    }
    planner.hidden = false; lock();
    setTimeout(function () { plSheet.focus(); }, 60);
    document.addEventListener('keydown', plKeys);
    mbar.classList.remove('is-on');
  }
  function closePlanner(go) {
    if (planner.hidden) return;
    planner.hidden = true; unlock(); document.removeEventListener('keydown', plKeys);
    if (go) scrollToEl($(go)); else if (plFrom && plFrom.focus) plFrom.focus({ preventScroll: true });
    onScroll();
  }
  function plKeys(e) { if (e.key === 'Escape') closePlanner(); else plTrap(e); }
  planner.addEventListener('click', function (e) { var c = e.target.closest('[data-close-planner]'); if (c) closePlanner(c.dataset.go); });
  plForm.addEventListener('pointerdown', function () { plPtr = Date.now(); });
  plForm.addEventListener('change', function (e) { if (e.target.name === 'plFinish') plCalc(); plSyncNav(); });
  plForm.addEventListener('click', function (e) {
    var inp = e.target.closest('.plo input'); if (!inp) return;
    plSyncNav();
    if (Date.now() - plPtr > 900) return; // keyboard: arrows choose, Continue moves on
    var n = +inp.closest('.pl__step').dataset.step;
    setTimeout(function () { if (plStep === n) plGo(n + 1); }, reduce ? 0 : 300);
  });
  plSize.addEventListener('input', plCalc);
  $$('[data-plstep]', planner).forEach(function (b) { b.addEventListener('click', function () { plSize.value = clamp(+plSize.value + (+b.dataset.plstep), 2000, 7000); plCalc(); }); });
  plNext.addEventListener('click', function () { if (plStep < 5) { plGo(plStep + 1); var f = $('.pl__step.is-on input', plForm); if (f && plStep !== 5) f.focus({ preventScroll: true }); } });
  plBack.addEventListener('click', function () { if (plStep > 1) plGo(plStep - 1); });
  plForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(plForm)) return;
    var name = plForm.elements.name.value.trim().split(' ')[0];
    $('[data-name]', plForm).textContent = name ? ', ' + name : '';
    plSteps.forEach(function (s) { s.classList.remove('is-on'); });
    var done = $('.pl__done', plForm); done.hidden = false; done.focus({ preventScroll: true });
    $('#plStep').textContent = 'Done'; $$('.planner__steps i', planner).forEach(function (b) { b.classList.add('on'); });
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
    if (state.lead || ss.get('whb_xm') || !pm.hidden || !planner.hidden || drawer.classList.contains('is-open')) return;
    ss.set('whb_xm', '1'); xmFrom = document.activeElement;
    xm.hidden = false; lock();
    setTimeout(function () { xmPanel.focus(); }, 30);
    document.addEventListener('keydown', xmKeys);
  }
  function closeXM() { if (xm.hidden) return; xm.hidden = true; unlock(); document.removeEventListener('keydown', xmKeys); if (xmFrom && xmFrom.focus) xmFrom.focus({ preventScroll: true }); }
  function xmKeys(e) { if (e.key === 'Escape') closeXM(); else xmTrap(e); }
  xm.addEventListener('click', function (e) { if (e.target.closest('[data-close-xm]')) closeXM(); });
  if (fine) document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY <= 0 && Date.now() - t0 > 15000) openXM(); });

  /* ================= counters + ring ================= */
  function countUp(el) {
    var to = +el.dataset.count;
    if (reduce) { el.textContent = to; return; }
    var t1 = performance.now();
    (function step(t) { var k = Math.min(1, (t - t1) / 1800), e = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(to * e); if (k < 1) requestAnimationFrame(step); })(t1);
  }
  if ('IntersectionObserver' in window && !reduce) {
    var cio = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { countUp(x.target); cio.unobserve(x.target); } }); }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { el.textContent = '0'; cio.observe(el); });
    var rio = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { $('.ring').classList.add('is-on'); rio.disconnect(); } }, { threshold: .6 });
    rio.observe($('.ring'));
  }

  /* ================= motion ================= */
  var refreshT;
  function refreshSoon() { if (!motion) return; clearTimeout(refreshT); refreshT = setTimeout(function () { ScrollTrigger.refresh(); }, 150); }
  function setupMotion() {
    if (!motion) { setStage(0, 0); return; }
    // process: pin and step through the six stages on large screens
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', function () {
      var sec = $('#process'); sec.classList.add('is-pin'); procPinned = true;
      ScrollTrigger.create({ trigger: sec, pin: true, start: 'top top', end: function () { return '+=' + Math.round(window.innerHeight * 2.8); }, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (s) { setStage(Math.min(5, Math.floor(s.progress * 6)), s.progress); } });
      return function () { sec.classList.remove('is-pin'); procPinned = false; stages.forEach(function (s) { s.classList.add('is-on'); }); };
    });
    mm.add('(max-width: 1023px)', function () { stages.forEach(function (s) { s.classList.add('is-on'); }); });
    // hero entrance
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo('.hero__frame', { clipPath: 'inset(4% 4% 4% 4% round 48px)' }, { clipPath: 'inset(0% 0% 0% 0% round 34px)', duration: 1.6, ease: 'expo.inOut' }, 0)
      .to('.hero__title .ln > span', { y: 0, duration: 1.3, stagger: .1 }, .55)
      .to('.hero .rv', { opacity: 1, y: 0, duration: 1.1, stagger: .08 }, .75)
      .from('.nav__in', { y: -30, opacity: 0, duration: 1 }, .6);
    gsap.to('.hero__frame', { scale: .96, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    // scroll reveals
    var rvs = $$('.rv').filter(function (el) { return !el.closest('.hero'); });
    ScrollTrigger.batch(rvs, { start: 'top 90%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .08 }); } });
    gsap.set('.gc', { opacity: 0, y: 40 });
    ScrollTrigger.batch('.gc', { start: 'top 92%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .08 }); } });
    gsap.fromTo('.bx--img img', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.bento', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.banner > img', { yPercent: -8 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.banner', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('#sign', { clipPath: 'inset(-30% 100% -30% -10%)' }, { clipPath: 'inset(-30% -30% -30% -10%)', duration: 2, ease: 'power2.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: '#sign', start: 'top 90%' } });
    gsap.from('.contact__box', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.contact__box', start: 'top 88%' } });
    gsap.from('.foot__mark', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.foot__mark', start: 'top 98%' } });
    if (document.readyState === 'complete') refreshSoon(); else window.addEventListener('load', refreshSoon);
  }
  var started = false;
  function go() { if (started) return; started = true; setupMotion(); onScroll(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
  setTimeout(go, 1200);
  onScroll();

  /* ================= design notes (?notes) ================= */
  var NOTES = {
    hero: ['The first 5 seconds', [
      'Big, real photography sells the dream; a soft slideshow shows three different home styles so more visitors see “their” house, while the headline and buttons never move.',
      'The headline says what Ward does and answers the biggest fear (surprises). Two buttons: book a consultation, or get a price in 60 seconds.',
      'The glass “Start your plan” card lets visitors answer the first question right in the hero, one tap opens the planner already on step 2. Starting with an easy click raises completion.']],
    proof: ['Proof at a glance', [
      'A bento grid packs five proof points into one screen: homes built, on-time rate, Google rating, years in business and the four promises.',
      'Numbers count up and the ring fills as it scrolls into view, so the eye lands on them.']],
    homes: ['What visitors came for', [
      'A gallery with one featured home and the rest around it; each card shows price and a button that matches its status (Schedule a tour, Ask about it, Build one like it).',
      'Filters split ready-to-buy shoppers from custom-build leads; the Map view shows every home on a hand-drawn DFW map for local relevance.',
      'The heart builds a shortlist in the saved-homes panel with popular upgrades, and the cities strip helps local SEO.']],
    why: ['Taking the risk out', [
      'Four promises cycle on their own like a story, each with a matching photo and a big proof number, so visitors absorb all four without scrolling.',
      'The side-by-side comparison ends with a consultation button: the moment someone agrees, the next step is right there.']],
    process: ['Making the first step feel small', [
      'The section holds in place while you scroll through six stages with real site photos and a timeline, from first call to keys.',
      'Knowing exactly what happens next (and when) removes the fear of starting. Texas has no state license for home builders, so seeing the work stage by stage builds trust.']],
    cost: ['Answering “how much?”', [
      'A clean calculator: plus/minus buttons, finish levels with real per-square-foot prices, upgrades and a donut chart of where the money goes.',
      '“Get my detailed plan” opens the planner with these numbers filled in; upgrades sync with the saved-homes panel.']],
    reviews: ['Social proof at decision time', [
      'One big featured story with the family’s home behind it, beside two slowly scrolling walls of reviews that show volume without taking space.',
      'Placed right before the ask. These will be replaced with Sean’s real Google reviews.']],
    about: ['People hire people', [
      'A full-width photo with Sean’s promise and signature, plus a short story card with a “Book a call with Sean” button.',
      'Three value cards (limited builds, locally owned, his cell number) explain why a smaller builder is the safer choice.']],
    faq: ['Clearing the last objections', [
      'Clean cards answer cost, land, timeline, what’s included, financing and warranty, with a call/text strip for anyone who would rather talk.']],
    contact: ['The ask', [
      '“Let’s build yours” with what happens next, contact details and a short form: only 3 required fields, interest is one tap, and the message is pre-filled from the planner, estimate, saved homes or the home they clicked.',
      'Site-wide: floating nav with phone and button, a Call / Text / Get my price bar on phones, and a one-time cost-guide offer when a desktop visitor is about to leave.']]
  };
  if (/[?&#]notes\b/.test(location.search + location.hash) || ss.get('whb_notes') === '1') {
    ss.set('whb_notes', '1');
    var k = 0;
    $$('[data-note]').forEach(function (sec) {
      var n = NOTES[sec.dataset.note]; if (!n) return; k++;
      var box = document.createElement('details');
      box.className = 'dnote';
      box.innerHTML = '<summary><b>' + k + '</b><span>Why this is here: ' + n[0] + '</span><svg class="i" aria-hidden="true"><use href="#i-chev"/></svg></summary><ul>' + n[1].map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
      (sec.classList.contains('process') ? $('.process__pin', sec) : sec).appendChild(box);
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
    $('.process__pin').style.position = 'relative';
  }

  /* ================= misc ================= */
  $('#yr').textContent = new Date().getFullYear();
  renderDrawer();
})();
