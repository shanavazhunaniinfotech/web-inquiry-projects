/* Golden Oak Properties — Version B "Isometric district" */
(function () {
  'use strict';

  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hasGsap) document.documentElement.classList.add('js');

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < (a || 0) ? (a || 0) : v > (b === undefined ? 1 : b) ? (b === undefined ? 1 : b) : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var eo = function (t) { return 1 - Math.pow(1 - t, 3); };
  var eio = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var back = function (t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  var NS = 'http://www.w3.org/2000/svg';

  /* =====================================================
     DATA
     ===================================================== */
  var PROJECTS = [
    { name: 'Six Senses Residences', area: 'Palm Jumeirah', price: 9400000, type: 'villa', status: 'offplan', img: '../img/palm.webp', dev: 'Select Group' },
    { name: 'Davinci Tower', area: 'Dubai Water Canal', price: 5450000, type: 'apartment', status: 'offplan', img: '../img/davinci.webp', dev: 'Pagani' },
    { name: 'Dubai Hills Vista', area: 'Dubai Hills', price: 27600000, type: 'villa', status: 'offplan', img: '../img/hills-vista.webp', dev: 'Dubai Hills' },
    { name: 'Cavalli Tower', area: 'Dubai Marina', price: 2939000, type: 'apartment', status: 'offplan', img: '../img/marina-night.webp', dev: 'DAMAC' },
    { name: 'Elie Saab at Arabian Ranches III', area: 'Arabian Ranches', price: 4650000, type: 'villa', status: 'offplan', img: '../img/elie-saab.webp', dev: 'Emaar' },
    { name: 'Tilal Al Furjan', area: 'Al Furjan', price: 3500000, type: 'villa', status: 'offplan', img: '../img/furjan.webp', dev: 'Nakheel' },
    { name: 'DAMAC Lagoons', area: 'DAMAC Lagoons', price: 1530000, type: 'villa', status: 'offplan', img: '../img/lagoons.webp', dev: 'DAMAC' },
    { name: 'Beach Mansion', area: 'Emaar Beachfront', price: 1922888, type: 'apartment', status: 'offplan', img: '../img/beachfront.webp', dev: 'Emaar' },
    { name: 'Rosewater', area: 'Creek Beach', price: 1450000, type: 'apartment', status: 'offplan', img: '../img/creek.webp', dev: 'Emaar' },
    { name: 'W Residences', area: 'Downtown', price: 1666777, type: 'apartment', status: 'ready', img: '../img/downtown.webp', dev: 'Dar Al Arkan' },
    { name: 'Le Ciel, Port de La Mer', area: 'Jumeirah 1', price: 1700000, type: 'apartment', status: 'ready', img: '../img/port-de-la-mer.webp', dev: 'Meraas' }
  ];
  var RATES = { AED: 1, USD: 0.2723, EUR: 0.2510 };
  var SYM = { AED: 'AED ', USD: '$', EUR: '€' };
  var cur = 'AED';
  var fmt = function (aed, c) {
    c = c || cur;
    return SYM[c] + Math.round(aed * RATES[c]).toLocaleString('en-US');
  };

  /* =====================================================
     ISOMETRIC ENGINE
     ===================================================== */
  var S = 30, C = 0.8660254, OX = 500, OY = 262;
  function P(x, y, z) { return [OX + (x - y) * C * S, OY + (x + y) * 0.5 * S - (z || 0) * S]; }
  function pts(arr) { var o = ''; for (var i = 0; i < arr.length; i++) o += arr[i][0].toFixed(1) + ',' + arr[i][1].toFixed(1) + ' '; return o; }
  function poly(cls, arr, extra) { return '<polygon class="' + cls + '" points="' + pts(arr) + '"' + (extra || '') + '/>'; }
  function flat(x, y, w, d, z) { z = z || 0; return [P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)]; }
  // a quad on a vertical face. face L: plane y = y+d, u runs along x. face R: plane x = x+w, u runs along y
  function fq(b, face, u0, u1, z0, z1) {
    if (face === 'L') { var Y = b.y + b.d; return [P(u0, Y, z0), P(u1, Y, z0), P(u1, Y, z1), P(u0, Y, z1)]; }
    var X = b.x + b.w; return [P(X, u0, z0), P(X, u1, z0), P(X, u1, z1), P(X, u0, z1)];
  }
  function fl(b, face, u, z0, z1) { // vertical line on a face
    var a = face === 'L' ? P(u, b.y + b.d, z0) : P(b.x + b.w, u, z0);
    var c = face === 'L' ? P(u, b.y + b.d, z1) : P(b.x + b.w, u, z1);
    return 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + c[0].toFixed(1) + ' ' + c[1].toFixed(1);
  }
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  var rnd = (function () { var s = 7; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })();

  /* box renderers ---------------------------------------- */
  function basicBox(b, h, t, l, r) {
    var bb = { x: b.x, y: b.y, z: b.z, w: b.w, d: b.d, h: h };
    return poly(l, fq(bb, 'L', b.x, b.x + b.w, b.z, b.z + h)) +
           poly(r, fq(bb, 'R', b.y, b.y + b.d, b.z, b.z + h)) +
           poly(t, flat(b.x, b.y, b.w, b.d, b.z + h));
  }
  // raw concrete frame: slab band + dark void + columns
  function rawBox(b, h) {
    if (h <= 0.001) return '';
    var bb = { x: b.x, y: b.y, z: b.z, w: b.w, d: b.d, h: h };
    var z0 = b.z, z1 = b.z + h, band = Math.min(h, b.h * 0.2), s = '';
    ['L', 'R'].forEach(function (f) {
      var u0 = f === 'L' ? b.x : b.y, len = f === 'L' ? b.w : b.d;
      s += poly(f === 'L' ? 'rv' : 'rv', fq(bb, f, u0, u0 + len, z0, z1));
      if (h > band) {
        var n = Math.max(2, Math.round(len / 0.9));
        for (var i = 0; i <= n; i++) {
          var u = u0 + len * i / n, cw = 0.12;
          var a = Math.max(u0, u - cw / 2), c = Math.min(u0 + len, u + cw / 2);
          s += poly(f === 'L' ? 'rl' : 'rr', fq(bb, f, a, c, z0, z1));
        }
      }
      s += poly(f === 'L' ? 'rl' : 'rr', fq(bb, f, u0, u0 + len, z1 - band, z1));
    });
    s += poly('rt', flat(b.x, b.y, b.w, b.d, z1));
    return s;
  }
  // finished glass tower floor
  function glassBox(b, lobby) {
    var z0 = b.z, z1 = b.z + b.h, band = b.h * (lobby ? 0.12 : 0.2), s = '';
    ['L', 'R'].forEach(function (f) {
      var u0 = f === 'L' ? b.x : b.y, len = f === 'L' ? b.w : b.d;
      s += poly(f === 'L' ? 'gl' : 'gr', fq(b, f, u0, u0 + len, z0, z1 - band));
      var n = Math.round(len / 0.5), path = '';
      for (var i = 0; i < n; i++) {
        var a = u0 + len * i / n, c = u0 + len * (i + 1) / n;
        if (rnd() < (lobby ? 0.9 : 0.62)) s += poly('lw lw' + Math.floor(rnd() * 4), fq(b, f, a + 0.04, c - 0.04, z0 + 0.03, z1 - band - 0.03));
        if (i > 0) path += fl(b, f, a, z0, z1 - band);
      }
      s += '<path class="mu" d="' + path + '"/>';
      s += poly(f === 'L' ? 'fl' : 'fr', fq(b, f, u0, u0 + len, z1 - band, z1));
      if (lobby) s += poly('gd', fq(b, f, u0, u0 + len, z1 - band, z1 - band + 0.06));
    });
    s += poly('ft', flat(b.x, b.y, b.w, b.d, z1));
    return s;
  }
  // finished villa block: white render + big glass + wood screen
  function villaBox(b, upper) {
    var z0 = b.z, z1 = b.z + b.h, s = '';
    s += poly('vl', fq(b, 'L', b.x, b.x + b.w, z0, z1));
    s += poly('vr', fq(b, 'R', b.y, b.y + b.d, z0, z1));
    // glass on L face
    var gx0 = b.x + 0.18, gx1 = b.x + b.w * (upper ? 0.62 : 0.7);
    s += poly('gl', fq(b, 'L', gx0, gx1, z0 + 0.08, z1 - 0.18));
    s += poly('lw lw' + Math.floor(rnd() * 4), fq(b, 'L', gx0 + 0.04, gx1 - 0.04, z0 + 0.1, z1 - 0.2));
    // wood screen on L face
    s += poly('wd', fq(b, 'L', gx1 + 0.12, b.x + b.w - 0.14, z0 + 0.08, z1 - 0.18));
    // glass on R face
    s += poly('gr', fq(b, 'R', b.y + 0.2, b.y + b.d - 0.25, z0 + 0.12, z1 - 0.2));
    s += poly('lw lw' + Math.floor(rnd() * 4), fq(b, 'R', b.y + 0.24, b.y + b.d - 0.29, z0 + 0.14, z1 - 0.22));
    s += poly('vt', flat(b.x, b.y, b.w, b.d, z1));
    // roof parapet line
    s += poly('gd', fq(b, 'L', b.x, b.x + b.w, z1 - 0.06, z1));
    s += poly('gd', fq(b, 'R', b.y, b.y + b.d, z1 - 0.06, z1));
    return s;
  }

  /* =====================================================
     SCENE
     ===================================================== */
  var svg = $('#iso');
  var sceneEl = $('#scene');
  var pinsEl = $('#pins');
  var layers = svg ? { base: $('#base'), ground: $('#ground'), blue: $('#blue'), world: $('#world'), fx: $('#fx') } : null;

  var floors = [];      // { b, kind, raw, fin, g0, g1, f0, f1, last }
  var worldItems = [];  // { key, node }
  var anim = [];        // generic animated pieces { node, fn(p) }
  var towerA = { x: 3, y: 3, w: 3, d: 3 }, towerB = { x: 3, y: 10, w: 3, d: 3 };
  var VILLAS = [[9.4, 0.9], [12.8, 0.9], [9.4, 4.2], [12.8, 4.2]];
  var groundBits = {};
  var crane = {}, cars = [], spark, lvlEl, bpLabels = [], pins = [];
  var A_TOP = 0;

  function addWorld(key, node) { worldItems.push({ key: key, node: node }); }

  function buildScene() {
    var g = layers;
    /* ---- plot base (earth block) ---- */
    var base = { x: 0, y: 0, z: -0.75, w: 16, d: 16 };
    var bh = 0.75;
    var bs = poly('sl', fq({ x: 0, y: 0, w: 16, d: 16 }, 'L', 0, 16, -bh, 0)) +
             poly('sr', fq({ x: 0, y: 0, w: 16, d: 16 }, 'R', 0, 16, -bh, 0)) +
             poly('st', flat(0, 0, 16, 16, 0));
    // strata lines on the base
    var sp = '';
    [-0.28, -0.52].forEach(function (z) {
      var a = P(0, 16, z), b2 = P(16, 16, z), c = P(16, 0, z);
      sp += 'M' + a[0] + ' ' + a[1] + 'L' + b2[0] + ' ' + b2[1] + 'L' + c[0] + ' ' + c[1];
    });
    g.base.innerHTML = bs + '<path d="' + sp + '" stroke="rgba(0,0,0,.08)" stroke-width="1" fill="none"/>';

    /* ---- dunes (only on empty plot) ---- */
    var dunes = el('g', { id: 'dunes' }, g.ground);
    var dd = '';
    for (var i = 0; i < 26; i++) {
      var x = 0.8 + rnd() * 14, y = 0.8 + rnd() * 14, l = 0.8 + rnd() * 1.4;
      var a = P(x, y, 0), b3 = P(x + l, y - l * 0.2, 0), m = P(x + l / 2, y - 0.25, 0);
      dd += 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'Q' + m[0].toFixed(1) + ' ' + m[1].toFixed(1) + ' ' + b3[0].toFixed(1) + ' ' + b3[1].toFixed(1);
    }
    dunes.innerHTML = '<path class="dune" d="' + dd + '"/>';
    groundBits.dunes = dunes;

    /* ---- excavation pits ---- */
    var pits = el('g', { opacity: 0 }, g.ground);
    var pitsHtml = poly('pit', flat(2.7, 2.7, 3.6, 3.6)) + poly('pit', flat(2.7, 9.7, 3.6, 3.6));
    VILLAS.forEach(function (v) { pitsHtml += poly('pit', flat(v[0] - 0.1, v[1] - 0.1, 2.6, 2.1)); });
    pits.innerHTML = pitsHtml;
    groundBits.pits = pits;

    /* ---- landscape layers (fade in at handover) ---- */
    var L = function (html) { var n = el('g', { opacity: 0 }, g.ground); n.innerHTML = html; return n; };
    groundBits.lawn = L(poly('gs2', flat(0.15, 0.15, 15.7, 15.7)));
    var paveH = poly('pv', flat(2.2, 2.2, 4.6, 4.6)) + poly('pv', flat(2.2, 9.2, 4.6, 4.6)) + poly('pv', flat(9.6, 9.6, 5.6, 4.6));
    groundBits.pave = L(paveH);
    var grassH = '';
    VILLAS.forEach(function (v) { grassH += poly('gs', flat(v[0] - 0.25, v[1] - 0.25, 3.0, 3.0)); });
    grassH += poly('gs', flat(9.2, 14.4, 6.6, 1.4)) + poly('gs', flat(0.5, 0.5, 1.4, 6.4)) + poly('gs', flat(0.5, 9.2, 1.4, 6.4));
    groundBits.grass = L(grassH);
    var roadH = poly('rd', flat(0, 7.4, 16, 1.2)) + poly('rd', flat(7.4, 0, 1.2, 16));
    var r1 = P(0, 8, 0), r2 = P(7.4, 8, 0), r3 = P(8.6, 8, 0), r4 = P(16, 8, 0);
    var r5 = P(8, 0, 0), r6 = P(8, 7.4, 0), r7 = P(8, 8.6, 0), r8 = P(8, 16, 0);
    var ln = function (a, b4) { return 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b4[0].toFixed(1) + ' ' + b4[1].toFixed(1); };
    roadH += '<path class="rdl" d="' + ln(r1, r2) + ln(r3, r4) + ln(r5, r6) + ln(r7, r8) + '"/>';
    groundBits.road = L(roadH);
    // lagoon + villa pools
    var wH = poly('wt', flat(10, 10, 4.8, 3.8, 0.01));
    VILLAS.forEach(function (v) { wH += poly('wt', flat(v[0] + 0.1, v[1] + 2.05, 1.8, 0.45, 0.01)); });
    var sh = '';
    for (var k = 0; k < 7; k++) {
      var sx = 10.4 + rnd() * 3.8, sy = 10.4 + rnd() * 3.0, a2 = P(sx, sy, 0.02), b5 = P(sx + 0.5, sy, 0.02);
      sh += 'M' + a2[0].toFixed(1) + ' ' + a2[1].toFixed(1) + 'L' + b5[0].toFixed(1) + ' ' + b5[1].toFixed(1);
    }
    wH += '<path class="wts" id="shimmer" d="' + sh + '"/>';
    groundBits.water = L(wH);

    /* ---- blueprint ---- */
    var gridP = '';
    for (var q = 1; q < 16; q++) { gridP += ln(P(q, 0, 0), P(q, 16, 0)) + ln(P(0, q, 0), P(16, q, 0)); }
    var bpGrid = el('path', { class: 'bp', d: gridP, 'stroke-width': .6, opacity: 0 }, g.blue);
    var foot = [flat(3, 3, 3, 3), flat(3, 10, 3, 3), flat(10, 10, 4.8, 3.8)];
    VILLAS.forEach(function (v) { foot.push(flat(v[0], v[1], 2.4, 1.9)); });
    var outlines = foot.map(function (f) {
      return el('polygon', { class: 'bpf', points: pts(f), pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1, 'fill-opacity': 0 }, g.blue);
    });
    // dimension line for tower A
    var dim = el('path', { class: 'bp', 'stroke-width': 1, d: ln(P(3, 2.2, 0), P(6, 2.2, 0)) + ln(P(3, 2.0, 0), P(3, 2.4, 0)) + ln(P(6, 2.0, 0), P(6, 2.4, 0)), opacity: 0 }, g.blue);
    groundBits.bpGrid = bpGrid; groundBits.outlines = outlines; groundBits.dim = dim;

    /* ---- survey stakes + sign ---- */
    [[0.6, 0.6], [15.4, 0.6], [15.4, 15.4], [0.6, 15.4], [3, 3], [6, 6], [3, 13], [14.8, 13.8]].forEach(function (s, idx) {
      var n = el('g', { class: 'stake' });
      var b6 = P(s[0], s[1], 0), t = P(s[0], s[1], 0.75);
      n.innerHTML = '<line x1="' + b6[0] + '" y1="' + b6[1] + '" x2="' + t[0] + '" y2="' + t[1] + '" stroke="#7a5b33" stroke-width="2.4"/>' +
        '<path d="M' + t[0] + ' ' + t[1] + 'l11 4-11 4z" fill="#d0533a"/>';
      addWorld(s[0] + s[1], n);
      anim.push({ kind: 'stake', node: n, i: idx });
    });
    var sign = el('g');
    var sb = P(1.6, 14.9, 0);
    sign.innerHTML =
      '<rect x="' + (sb[0] - 44) + '" y="' + (sb[1] - 30) + '" width="3" height="30" fill="#6d5536"/>' +
      '<rect x="' + (sb[0] + 41) + '" y="' + (sb[1] - 30) + '" width="3" height="30" fill="#6d5536"/>' +
      '<rect x="' + (sb[0] - 52) + '" y="' + (sb[1] - 76) + '" width="104" height="48" rx="4" fill="#16140f"/>' +
      '<rect x="' + (sb[0] - 48) + '" y="' + (sb[1] - 72) + '" width="96" height="40" rx="2" fill="none" stroke="#c9a24f" stroke-width="1"/>' +
      '<g id="signA"><text x="' + sb[0] + '" y="' + (sb[1] - 57) + '" text-anchor="middle" font-family="Inter Tight,sans-serif" font-size="7.5" font-weight="700" letter-spacing="1.4" fill="#c9a24f">PLOT AVAILABLE</text>' +
      '<text x="' + sb[0] + '" y="' + (sb[1] - 42) + '" text-anchor="middle" font-family="Instrument Serif,serif" font-size="14" fill="#f5efe2">Golden Oak</text></g>' +
      '<g id="signB" opacity="0"><text x="' + sb[0] + '" y="' + (sb[1] - 57) + '" text-anchor="middle" font-family="Inter Tight,sans-serif" font-size="7.5" font-weight="700" letter-spacing="1.4" fill="#c9a24f">100% SOLD</text>' +
      '<text x="' + sb[0] + '" y="' + (sb[1] - 42) + '" text-anchor="middle" font-family="Instrument Serif,serif" font-size="14" fill="#f5efe2">Welcome home</text></g>';
    addWorld(16.5, sign);
    groundBits.signA = sign.querySelector('#signA'); groundBits.signB = sign.querySelector('#signB');

    /* ---- buildings ---- */
    function building(key, list) {
      var g2 = el('g');
      list.forEach(function (f) {
        var fg = el('g', {}, g2);
        var raw = el('g', {}, fg), fin = el('g', { opacity: 0 }, fg);
        f.raw = raw; f.fin = fin; f.last = -1;
        if (f.kind === 'slab') fin.innerHTML = basicBox(f.b, f.b.h, 'ft', 'fl', 'fr');
        else if (f.kind === 'tower') fin.innerHTML = glassBox(f.b, false);
        else if (f.kind === 'lobby') fin.innerHTML = glassBox(f.b, true);
        else if (f.kind === 'villa') fin.innerHTML = villaBox(f.b, f.upper);
        else if (f.kind === 'crown') { fin.innerHTML = f.html; raw.style.display = 'none'; }
        floors.push(f);
      });
      addWorld(key, g2);
    }
    // Tower A — signature residences
    var listA = [{ kind: 'slab', b: { x: 2.7, y: 2.7, z: 0, w: 3.6, d: 3.6, h: 0.25 }, g0: .27, g1: .33, f0: .60, f1: .62 }];
    var z = 0.25;
    listA.push({ kind: 'lobby', b: { x: 3, y: 3, z: z, w: 3, d: 3, h: 0.85 }, g0: .345, g1: .37, f0: .60, f1: .625 }); z += 0.85;
    var nA = 14;
    for (var fA = 0; fA < nA; fA++) {
      var s0 = .37 + fA * (0.205 / nA);
      listA.push({ kind: 'tower', b: { x: 3, y: 3, z: z, w: 3, d: 3, h: 0.6 }, g0: s0, g1: s0 + 0.205 / nA * 1.15, f0: .61 + fA * (0.1 / nA), f1: .61 + fA * (0.1 / nA) + 0.02, lvl: fA + 1 });
      z += 0.6;
    }
    A_TOP = z;
    var crownB = { x: 3.35, y: 3.35, z: z, w: 2.3, d: 2.3, h: 0.45 };
    var spire = { x: 4.35, y: 4.35, z: z + 0.45, w: 0.3, d: 0.3, h: 1.5 };
    listA.push({ kind: 'crown', b: crownB, f0: .71, f1: .74, html: basicBox(crownB, crownB.h, 'gd', 'gd', 'rr') + basicBox(spire, spire.h, 'gd', 'fl', 'gd') });
    building(9, listA);

    // Tower B — residences
    var listB = [{ kind: 'slab', b: { x: 2.7, y: 9.7, z: 0, w: 3.6, d: 3.6, h: 0.25 }, g0: .28, g1: .335, f0: .60, f1: .62 }];
    z = 0.25;
    listB.push({ kind: 'lobby', b: { x: 3, y: 10, z: z, w: 3, d: 3, h: 0.85 }, g0: .36, g1: .385, f0: .605, f1: .63 }); z += 0.85;
    for (var fB = 0; fB < 7; fB++) {
      var s1 = .385 + fB * 0.022;
      listB.push({ kind: 'tower', b: { x: 3, y: 10, z: z, w: 3, d: 3, h: 0.6 }, g0: s1, g1: s1 + 0.026, f0: .63 + fB * 0.012, f1: .63 + fB * 0.012 + 0.02 });
      z += 0.6;
    }
    var roofB = { x: 3.5, y: 10.4, z: z, w: 1.6, d: 1.2, h: 0.4 };
    listB.push({ kind: 'crown', b: roofB, f0: .72, f1: .745, html: basicBox(roofB, roofB.h, 'ft', 'fl', 'fr') + poly('wt', flat(3.4, 11.9, 2.2, 0.8, z + 0.01)) });
    building(16, listB);

    // Villas
    VILLAS.forEach(function (v, vi) {
      var lx = v[0], ly = v[1], d0 = 0.03 * vi;
      building(lx + ly + 2.2, [
        { kind: 'slab', b: { x: lx - 0.1, y: ly - 0.1, z: 0, w: 2.6, d: 2.1, h: 0.2 }, g0: .29 + d0, g1: .33 + d0, f0: .64, f1: .66 },
        { kind: 'villa', b: { x: lx, y: ly, z: 0.2, w: 2.4, d: 1.9, h: 0.85 }, g0: .40 + d0, g1: .44 + d0, f0: .66 + d0 * .6, f1: .69 + d0 * .6 },
        { kind: 'villa', upper: true, b: { x: lx + 0.6, y: ly, z: 1.05, w: 1.8, d: 1.35, h: 0.75 }, g0: .45 + d0, g1: .49 + d0, f0: .68 + d0 * .6, f1: .71 + d0 * .6 }
      ]);
    });

    /* ---- palms ---- */
    [[0.9, 6.7], [6.8, 6.7], [6.8, 0.9], [0.9, 9.3], [6.8, 9.3], [9.3, 9.3], [15.1, 9.3], [9.3, 15.1], [15.1, 15.1], [6.8, 15.1], [9.1, 3.85], [15.5, 3.85]].forEach(function (pp, i) {
      var b7 = P(pp[0], pp[1], 0), top = [b7[0] + 4, b7[1] - 40];
      var n = el('g', { transform: 'translate(' + b7[0] + ' ' + b7[1] + ') scale(0)' });
      var fr = '';
      for (var a = 0; a < 7; a++) {
        var ang = -Math.PI / 2 + (a - 3) * 0.55 + (a % 2 ? 0.1 : -0.1), len = 15 + (a % 3) * 2;
        var ex = Math.cos(ang) * len, ey = Math.sin(ang) * len * 0.75 + 6;
        fr += '<path class="fd" d="M4 -40 Q' + (4 + ex * 0.5) + ' ' + (-40 + ey * 0.2 - 8) + ' ' + (4 + ex) + ' ' + (-40 + ey) + ' Q' + (4 + ex * 0.45) + ' ' + (-40 + ey * 0.35 - 2) + ' 4 -40Z"/>';
      }
      n.innerHTML = '<ellipse cx="0" cy="0" rx="9" ry="4.5" fill="rgba(60,45,20,.18)"/><path class="tk" d="M0 0 Q5 -20 4 -40"/>' + fr;
      addWorld(pp[0] + pp[1] + 0.3, n);
      anim.push({ kind: 'palm', node: n, base: b7, t0: .79 + i * 0.008 });
    });

    /* ---- street lamps ---- */
    [[1.6, 8.75], [4.6, 8.75], [10.6, 8.75], [13.6, 8.75], [8.75, 1.8], [8.75, 4.8], [8.75, 10.8], [8.75, 13.8]].forEach(function (lp) {
      var b8 = P(lp[0], lp[1], 0), t8 = P(lp[0], lp[1], 1);
      var n = el('g', { opacity: 0 });
      n.innerHTML = '<circle class="glow" cx="' + t8[0] + '" cy="' + (t8[1] + 2) + '" r="16" fill="url(#gLamp)"/>' +
        '<line x1="' + b8[0] + '" y1="' + b8[1] + '" x2="' + t8[0] + '" y2="' + t8[1] + '" stroke="#3a3833" stroke-width="1.6"/>' +
        '<circle cx="' + t8[0] + '" cy="' + t8[1] + '" r="2.2" fill="#ffe2a0"/>';
      addWorld(lp[0] + lp[1] + 0.2, n);
      anim.push({ kind: 'lamp', node: n });
    });

    /* ---- crane ---- */
    var cg = el('g');
    crane.base = P(6.75, 3.45, 0);
    crane.node = cg;
    crane.mast = el('path', { class: 'cr', 'stroke-width': 1.6 }, cg);
    crane.top = el('g', {}, cg);
    crane.jib = el('g', {}, crane.top);
    crane.jib.innerHTML =
      '<path class="cr" stroke-width="1.4" d="M-180 0H70M-180 9H70M-180 0L-180 9' + (function () { var s = ''; for (var x = -180; x < 70; x += 12) s += 'M' + x + ' 9L' + (x + 6) + ' 0L' + (x + 12) + ' 9'; return s; })() + '"/>' +
      '<rect class="crf" x="40" y="9" width="28" height="16"/>' +
      '<path class="cr" stroke-width="1" d="M0 -28L-170 0M0 -28L64 0"/>' +
      '<path class="crf" d="M-5 -28h10l2 28h-14z"/>';
    crane.cab = el('rect', { x: 6, y: 9, width: 16, height: 14, rx: 2, fill: '#2b2a29' }, crane.top);
    crane.trolley = el('g', {}, crane.jib);
    crane.trolley.innerHTML = '<rect x="-7" y="9" width="14" height="6" fill="#3a3833"/>';
    crane.cable = el('line', { x1: 0, y1: 15, x2: 0, y2: 60, stroke: '#3a3833', 'stroke-width': 1.2 }, crane.trolley);
    crane.hook = el('g', {}, crane.trolley);
    crane.hook.innerHTML = '<path d="M-2 0h4v4a4 4 0 11-4 4" fill="none" stroke="#3a3833" stroke-width="2"/><rect x="-26" y="12" width="52" height="5" fill="#9c958a"/>';
    crane.tx = P(4.5, 4.5, 0)[0] - crane.base[0];
    addWorld(10.4, cg);

    /* ---- cars ---- */
    function carNode(alongX) {
      var n = el('g', { opacity: 0 });
      var b9 = alongX ? { x: 0, y: -0.2, z: 0, w: 0.8, d: 0.4 } : { x: -0.2, y: 0, z: 0, w: 0.4, d: 0.8 };
      var cb = alongX ? { x: 0.18, y: -0.17, z: 0.2, w: 0.4, d: 0.34 } : { x: -0.17, y: 0.18, z: 0.2, w: 0.34, d: 0.4 };
      var head = alongX ? P(0.85, 0, 0.1) : P(0, 0.85, 0.1);
      n.innerHTML = '<circle class="glow" cx="' + head[0] + '" cy="' + head[1] + '" r="8" fill="url(#gLamp)"/>' +
        basicBox(b9, 0.2, 'ft', 'fl', 'fr') + basicBox(cb, 0.16, 'gr', 'gl', 'gr');
      return n;
    }
    var carLayer = el('g', {}, g.ground);
    cars.push({ node: carLayer.appendChild(carNode(true)), axis: 'x', lane: 8.25, dir: 1, speed: 0.055, u: 1 });
    cars.push({ node: carLayer.appendChild(carNode(false)), axis: 'y', lane: 7.85, dir: -1, speed: 0.045, u: 12 });

    /* ---- paint world in depth order ---- */
    worldItems.sort(function (a, b) { return a.key - b.key; }).forEach(function (w) { g.world.appendChild(w.node); });

    /* ---- fx: plot marker + welding spark ---- */
    var mk = el('g', {}, g.fx);
    var c0 = P(8, 8, 0);
    mk.innerHTML = '<ellipse cx="' + c0[0] + '" cy="' + c0[1] + '" rx="46" ry="23" fill="none" stroke="#b8893f" stroke-width="1.4"><animate attributeName="rx" values="20;70" dur="2.4s" repeatCount="indefinite"/><animate attributeName="ry" values="10;35" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="2.4s" repeatCount="indefinite"/></ellipse>' +
      '<ellipse cx="' + c0[0] + '" cy="' + c0[1] + '" rx="5" ry="2.5" fill="#b8893f"/>';
    groundBits.marker = mk;
    spark = el('g', { opacity: 0 }, g.fx);
    spark.innerHTML = '<circle class="spark" r="3.2" fill="#ffe7a6" filter="url(#fGlow)"/><circle class="spark" r="1.4" cx="5" cy="3" fill="#fff"/>';

    /* ---- HTML overlays ---- */
    var pct = function (pt) { return 'left:' + (pt[0] / 10) + '%;top:' + (pt[1] / 8.2) + '%'; };
    [['Signature tower · G+14', P(4.5, 4.5, 0)], ['Residences · G+7', P(4.5, 11.5, 0)], ['Villas × 4', P(12.1, 3.9, 0)], ['Lagoon park', P(12.4, 11.9, 0)]].forEach(function (lb) {
      var d = document.createElement('span'); d.className = 'bp-label'; d.textContent = lb[0]; d.setAttribute('style', pct(lb[1]));
      pinsEl.appendChild(d); bpLabels.push(d);
    });
    lvlEl = document.createElement('span'); lvlEl.className = 'lvl'; pinsEl.appendChild(lvlEl);
    [
      { t: 'Off-plan apartments', b: 'Signature towers', s: 'from AED 1.45M', at: P(4.5, 4.5, A_TOP + 2.1), atM: P(3.6, 6, 6.2), type: 'apartment' },
      { t: 'Villas & townhouses', b: 'Family villas', s: 'from AED 1.53M', at: P(11.2, 2.3, 1.9), type: 'villa' },
      { t: 'Waterfront', b: 'Lagoon living', s: 'Creek Beach from AED 1.45M', at: P(13.2, 12.6, 0.2), area: 'Creek Beach' }
    ].forEach(function (pn) {
      var a = document.createElement('a');
      a.className = 'pin'; a.href = '#projects'; a.setAttribute('style', pct(pn.at));
      if (pn.atM) { a.dataset.d = pct(pn.at); a.dataset.m = pct(pn.atM); }
      if (pn.type) a.dataset.type = pn.type;
      if (pn.area) a.dataset.area = pn.area;
      a.innerHTML = '<span class="pin__card"><small>' + pn.t + '</small><b>' + pn.b + '</b><span>' + pn.s + '</span></span><i class="pin__stem"></i><i class="pin__dot"></i>';
      pinsEl.appendChild(a); pins.push(a);
    });

    /* ---- stars ---- */
    var st = $('#stars'), sh2 = '';
    for (var si = 0; si < 60; si++) sh2 += '<i style="left:' + (rnd() * 100).toFixed(1) + '%;top:' + (rnd() * 100).toFixed(1) + '%;animation-delay:' + (rnd() * 3).toFixed(2) + 's"></i>';
    st.innerHTML = sh2;
  }

  /* ---- palette: [day, golden hour, night] ---- */
  var PAL = {
    rt: ['#d6d0c5', '#e3c9a3', '#4a4f5e'], rl: ['#b7b0a4', '#c4a482', '#393d4a'], rr: ['#9c958a', '#a6876a', '#2e313c'], rv: ['#58534c', '#5f4c3c', '#1d1f27'],
    ft: ['#f4efe6', '#fbe3c0', '#5d6274'], fl: ['#ebe4d7', '#f2d3a8', '#4a4f5f'], fr: ['#d3c8b6', '#dcb68a', '#3b3f4d'],
    gl: ['#9bbac7', '#dcb48a', '#26344c'], gr: ['#6f90a2', '#ad8968', '#1c273a'], mu: ['#f3efe7', '#f6dfbd', '#5f6577'],
    gd: ['#c9a24f', '#d9a94f', '#a07b33'], vt: ['#faf7f1', '#ffe9c8', '#666c7e'], vl: ['#eee7db', '#f6d7ac', '#50566a'], vr: ['#d8cebe', '#e0bb8f', '#40455a'],
    wd: ['#8a6a45', '#8f6a42', '#3d3128'], st: ['#e9d6b0', '#efcd98', '#4b4851'], sl: ['#d0b78a', '#d6ad78', '#3a3840'], sr: ['#b79b6e', '#bd9260', '#2e2d35'],
    gs: ['#a8b98a', '#b6b07a', '#2e3a34'], gs2: ['#97aa7a', '#a7a06b', '#28322d'], pv: ['#efe7d8', '#f5dcb4', '#535766'], rd: ['#4a4743', '#574a3f', '#23242b'],
    rdl: ['#e8d6a8', '#f0cf8f', '#8d7a52'], wt: ['#6fcbd6', '#8cc6c2', '#2b86a3'], tk: ['#8c6d4a', '#8b6643', '#3a3029'], fd: ['#6f8f4e', '#7f8a48', '#26362c'],
    cr: ['#dcae45', '#e6ac52', '#7d6332']
  };
  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  var PALN = {};
  for (var k in PAL) PALN[k] = PAL[k].map(hex);
  function mixc(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
  var lastSky = '';
  function paint(gold, night) {
    var key = gold.toFixed(3) + night.toFixed(3);
    if (key === lastSky) return;
    lastSky = key;
    var st = svg.style;
    for (var k2 in PALN) {
      var c = mixc(mixc(PALN[k2][0], PALN[k2][1], gold), PALN[k2][2], night);
      st.setProperty('--' + k2, 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')');
    }
    for (var j = 0; j < 4; j++) st.setProperty('--n' + j, clamp((night - j * 0.12) / 0.45).toFixed(3));
  }

  /* =====================================================
     RENDER (progress 0 → 1)
     ===================================================== */
  var T = function (p, a, b) { return clamp((p - a) / (b - a)); };
  var STAGE_AT = [0, 0.10, 0.24, 0.36, 0.58, 0.80];
  var STAGE_NAMES = ['Empty plot', 'Blueprint', 'Foundation', 'Structure', 'Facade', 'Handover'];
  var stageEls = $$('.stage'), stepEls = $$('#hudSteps li');
  var hudPct = $('#hudPct'), hudBar = $('#hudBar'), hudLabel = $('#hudLabel');
  var buildEl = $('#build'), hdr = $('#hdr'), cue = $('#cue');
  var skyGold = $('#skyGold'), skyNight = $('#skyNight'), sun = $('#sun'), stars = $('#stars');
  var curStage = 0, isNight = false, curP = -1, tgtP = 0;

  function setStage(i) {
    if (i === curStage) return;
    stageEls.forEach(function (s, j) {
      s.classList.toggle('is-on', j === i);
      s.classList.toggle('is-out', j < i);
    });
    stepEls.forEach(function (s, j) { s.classList.toggle('is-on', j <= i); });
    hudLabel.textContent = STAGE_NAMES[i];
    curStage = i;
  }

  function render(p) {
    /* stage copy */
    var si = 0;
    for (var i = 0; i < STAGE_AT.length; i++) if (p >= STAGE_AT[i]) si = i;
    setStage(si);
    var built = Math.round(clamp(p / 0.95) * 100);
    hudPct.textContent = built;
    hudBar.style.transform = 'scaleX(' + clamp(p / 0.95) + ')';
    cue.style.opacity = p > 0.03 ? 0 : 1;

    /* sky */
    var gold = eio(T(p, .74, .86)) * (1 - T(p, .9, .97) * 0.4);
    var night = eio(T(p, .86, .96));
    skyGold.style.opacity = gold;
    skyNight.style.opacity = night;
    sun.style.transform = 'translateY(' + (T(p, .72, .95) * 40) + 'vh)';
    sun.style.opacity = 1 - night;
    stars.style.opacity = night;
    paint(gold, night);
    var nightNow = night > 0.5;
    if (nightNow !== isNight) { isNight = nightNow; buildEl.classList.toggle('is-night', isNight); hdr.classList.toggle('is-night', isNight); }

    /* empty plot */
    var land = T(p, .74, .84);
    groundBits.dunes.setAttribute('opacity', (1 - T(p, .26, .32)).toFixed(3));
    groundBits.marker.setAttribute('opacity', (1 - T(p, .1, .16)).toFixed(3));
    anim.forEach(function (a) {
      if (a.kind === 'stake') a.node.setAttribute('opacity', (1 - T(p, .3, .36)).toFixed(3));
    });
    groundBits.signA.setAttribute('opacity', (1 - T(p, .88, .92)).toFixed(3));
    groundBits.signB.setAttribute('opacity', T(p, .9, .94).toFixed(3));

    /* blueprint */
    var bpOut = 1 - T(p, .36, .46);
    groundBits.bpGrid.setAttribute('opacity', (T(p, .10, .15) * 0.55 * bpOut).toFixed(3));
    groundBits.outlines.forEach(function (o, j) {
      var t = T(p, .12 + j * 0.012, .19 + j * 0.012);
      o.setAttribute('stroke-dashoffset', (1 - eo(t)).toFixed(3));
      o.setAttribute('fill-opacity', (T(p, .18, .22)).toFixed(3));
      o.setAttribute('opacity', bpOut.toFixed(3));
    });
    groundBits.dim.setAttribute('opacity', (T(p, .17, .2) * bpOut).toFixed(3));
    var lblOn = p > .15 && p < .40;
    bpLabels.forEach(function (l) { l.classList.toggle('is-on', lblOn); });

    /* excavation */
    groundBits.pits.setAttribute('opacity', (T(p, .24, .28) * (1 - T(p, .76, .8))).toFixed(3));

    /* floors */
    var growingTop = null;
    floors.forEach(function (f) {
      if (f.kind !== 'crown') {
        var gt = eo(T(p, f.g0, f.g1));
        if (Math.abs(gt - f.last) > 0.0005) {
          f.last = gt;
          f.raw.innerHTML = gt > 0 ? (f.kind === 'slab' ? basicBox(f.b, f.b.h * gt, 'rt', 'rl', 'rr') : rawBox(f.b, f.b.h * gt)) : '';
        }
        if (gt > 0 && gt < 1 && f.b.x === 3 && f.b.y === 3) growingTop = f;
      }
      var ft = T(p, f.f0, f.f1);
      f.fin.setAttribute('opacity', ft.toFixed(3));
      if (f.kind !== 'crown') f.raw.style.visibility = ft >= 1 ? 'hidden' : 'visible';
    });

    /* current tower height (tower A) for crane + level label */
    var topZ = 0, lvl = 0;
    floors.forEach(function (f) {
      if (f.b.x === 3 && f.b.y === 3 && f.kind !== 'crown' && f.last > 0) { topZ = Math.max(topZ, f.b.z + f.b.h * f.last); if (f.lvl && f.last > 0.5) lvl = f.lvl; }
    });
    if (growingTop) {
      var sp = P(6, 6, growingTop.b.z + growingTop.b.h * growingTop.last);
      spark.setAttribute('transform', 'translate(' + sp[0] + ' ' + sp[1] + ')');
      spark.setAttribute('opacity', p > .36 && p < .58 ? 1 : 0);
    } else spark.setAttribute('opacity', 0);
    var lvlOn = p > .37 && p < .6;
    lvlEl.classList.toggle('is-on', lvlOn);
    if (lvlOn) {
      var lp = P(6, 3, topZ);
      lvlEl.style.left = (lp[0] / 10) + '%'; lvlEl.style.top = (lp[1] / 8.2) + '%';
      lvlEl.textContent = lvl ? 'Level ' + (lvl < 10 ? '0' : '') + lvl + ' / 14' : 'Lobby';
    }

    /* crane */
    var up = eo(T(p, .25, .35)), down = eio(T(p, .70, .77));
    var mh = 12.2 * up * (1 - down);
    var cb = crane.base, topPt = [cb[0], cb[1] - mh * S];
    if (mh < 0.05) crane.node.setAttribute('opacity', 0);
    else {
      crane.node.setAttribute('opacity', 1);
      var d = 'M' + (cb[0] - 6) + ' ' + cb[1] + 'V' + topPt[1] + 'M' + (cb[0] + 6) + ' ' + cb[1] + 'V' + topPt[1];
      for (var yy = cb[1]; yy - 12 > topPt[1]; yy -= 12) d += 'M' + (cb[0] - 6) + ' ' + yy + 'L' + (cb[0] + 6) + ' ' + (yy - 12);
      crane.mast.setAttribute('d', d);
      crane.top.setAttribute('transform', 'translate(' + cb[0] + ' ' + topPt[1] + ')');
      crane.top.setAttribute('opacity', T(p, .3, .34).toFixed(3));
      var hookY = Math.max(30, (P(4.5, 4.5, topZ)[1] - 26) - topPt[1]);
      crane.cable.setAttribute('y2', hookY);
      crane.hook.setAttribute('transform', 'translate(0 ' + hookY + ')');
    }

    /* landscape */
    groundBits.lawn.setAttribute('opacity', eo(T(p, .74, .8)).toFixed(3));
    groundBits.road.setAttribute('opacity', eo(T(p, .76, .81)).toFixed(3));
    groundBits.pave.setAttribute('opacity', eo(T(p, .77, .82)).toFixed(3));
    groundBits.grass.setAttribute('opacity', eo(T(p, .78, .83)).toFixed(3));
    groundBits.water.setAttribute('opacity', eo(T(p, .79, .85)).toFixed(3));
    anim.forEach(function (a) {
      if (a.kind === 'palm') {
        var s2 = back(T(p, a.t0, a.t0 + .04)) * 1.45;
        a.node.setAttribute('transform', 'translate(' + a.base[0] + ' ' + a.base[1] + ') scale(' + Math.max(0, s2).toFixed(3) + ')');
      } else if (a.kind === 'lamp') a.node.setAttribute('opacity', T(p, .8, .84).toFixed(3));
    });
    carsOn = p > .84;

    /* pins */
    var pinOn = p > .93;
    buildEl.classList.toggle('is-late', p > .8);
    pins.forEach(function (pn, j) { pn.classList.toggle('is-on', pinOn); pn.style.transitionDelay = pinOn ? (j * 0.12) + 's' : '0s'; });
  }

  /* idle loops (cars, crane swing, water) */
  var carsOn = false, tLast = 0;
  function idle(time) {
    var dt = Math.min(0.05, (time - tLast) / 1000 || 0); tLast = time;
    var o = P(0, 0, 0);
    cars.forEach(function (c) {
      if (!carsOn) { c.node.setAttribute('opacity', 0); return; }
      c.u += c.dir * c.speed * dt * 60;
      if (c.u > 16.6) c.u = -0.8; if (c.u < -0.8) c.u = 16.6;
      var pt = c.axis === 'x' ? P(c.u, c.lane, 0) : P(c.lane, c.u, 0);
      var edge = Math.min(clamp((c.u + 0.8) / 1.2), clamp((16.6 - c.u) / 1.2));
      c.node.setAttribute('transform', 'translate(' + (pt[0] - o[0]).toFixed(1) + ' ' + (pt[1] - o[1]).toFixed(1) + ')' + (c.dir < 0 && c.axis === 'y' ? '' : ''));
      c.node.setAttribute('opacity', edge.toFixed(2));
    });
    if (crane.jib) {
      var sw = Math.sin(time / 2400);
      crane.jib.setAttribute('transform', 'scale(' + (0.82 + 0.18 * sw).toFixed(3) + ' 1)');
      crane.trolley.setAttribute('transform', 'translate(' + (crane.tx / (0.82 + 0.18 * sw)).toFixed(1) + ' 0)');
    }
  }

  /* =====================================================
     INIT BUILD
     ===================================================== */
  function initBuild() {
    if (!svg) return;
    buildScene();
    var mq = window.matchMedia('(max-width: 720px)');
    var placePins = function () { pins.forEach(function (a) { if (a.dataset.m) a.setAttribute('style', mq.matches ? a.dataset.m : a.dataset.d); }); };
    placePins();
    if (mq.addEventListener) mq.addEventListener('change', placePins);
    render(0);
    curP = 0;
    if (!hasGsap) { render(1); return; }

    var mobile = window.matchMedia('(max-width: 1024px)').matches;
    ScrollTrigger.create({
      trigger: buildEl,
      start: 'top top',
      end: function () { return '+=' + Math.round(window.innerHeight * (mobile ? 4.2 : 5)); },
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: function (self) { tgtP = self.progress; },
      onLeave: function () { tgtP = 1; },
      onEnterBack: function () { },
    });
    gsap.ticker.add(function (time) {
      var d = tgtP - curP;
      if (Math.abs(d) > 0.0004) { curP += d * (reduce ? 1 : 0.14); render(curP); }
      else if (curP !== tgtP) { curP = tgtP; render(curP); }
      idle(time * 1000);
    });
  }

  /* =====================================================
     PROJECTS
     ===================================================== */
  var grid = $('#grid');
  var filt = { status: '', area: '', type: '', budget: '' };
  function cardHtml(p, i) {
    return '<article class="card" data-i="' + i + '">' +
      '<div class="card__img"><img src="' + p.img + '" alt="' + p.name + ', ' + p.area + '" loading="lazy">' +
      '<div class="card__tags"><span class="tag ' + (p.status === 'offplan' ? 'tag--gold' : '') + '">' + (p.status === 'offplan' ? 'Off-plan' : 'Ready') + '</span><span class="tag">' + (p.type === 'villa' ? 'Villa' : 'Apartment') + '</span></div></div>' +
      '<div class="card__body"><p class="card__area"><svg><use href="#i-pin"/></svg>' + p.area + '</p><h3>' + p.name + '</h3>' +
      '<div class="card__row"><div class="card__price"><small>Starting from</small><b data-aed="' + p.price + '">' + fmt(p.price) + '</b></div>' +
      '<button class="card__btn" type="button" data-open="' + i + '">Brochure &amp; plan</button></div></div></article>';
  }
  function renderGrid() {
    grid.innerHTML = PROJECTS.map(cardHtml).join('');
    applyFilter(false);
  }
  function match(p) {
    if (filt.status && p.status !== filt.status) return false;
    if (filt.area && p.area !== filt.area) return false;
    if (filt.type && p.type !== filt.type) return false;
    if (filt.budget) { var r = filt.budget.split('-'); if (p.price < +r[0] || p.price > +r[1]) return false; }
    return true;
  }
  function applyFilter(animate) {
    var n = 0, first = true;
    $$('.card', grid).forEach(function (c) {
      var ok = match(PROJECTS[+c.dataset.i]);
      c.classList.toggle('is-hidden', !ok);
      c.classList.remove('is-big');
      if (ok) { n++; if (first && !filt.status && !filt.area && !filt.type && !filt.budget) c.classList.add('is-big'); first = false; }
    });
    $('#resCount').textContent = n;
    $('#empty').hidden = n > 0;
    if (animate && hasGsap && !reduce) gsap.fromTo($$('.card:not(.is-hidden)', grid), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, stagger: .05, ease: 'power3.out' });
    if (hasGsap) ScrollTrigger.refresh();
  }
  function countFor() { var n = 0; PROJECTS.forEach(function (p) { if (match(p)) n++; }); $('#resCount').textContent = n; }
  function initFinder() {
    var areas = PROJECTS.map(function (p) { return p.area; }).filter(function (a, i, arr) { return arr.indexOf(a) === i; }).sort();
    var fArea = $('#fArea');
    areas.forEach(function (a) { var o = document.createElement('option'); o.value = a; o.textContent = a; fArea.appendChild(o); });
    $$('.finder__tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.finder__tabs button').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        filt.status = b.dataset.status; countFor();
      });
    });
    fArea.addEventListener('change', function () { filt.area = fArea.value; countFor(); });
    $('#fType').addEventListener('change', function () { filt.type = this.value; countFor(); });
    $('#fBudget').addEventListener('change', function () { filt.budget = this.value; countFor(); });
    $('#finder').addEventListener('submit', function (e) { e.preventDefault(); applyFilter(true); scrollToEl($('#projects')); });
    $$('.cur button').forEach(function (b) {
      b.addEventListener('click', function () {
        cur = b.dataset.cur;
        $$('.cur button').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        $$('[data-aed]', grid).forEach(function (x) { x.textContent = fmt(+x.dataset.aed); });
      });
    });
    // links that preset a filter (nav, pins, area tiles)
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-type],[data-area]');
      if (!a || a.tagName === 'SELECT') return;
      if (a.dataset.type !== undefined || a.dataset.area !== undefined) {
        filt = { status: '', area: a.dataset.area || '', type: a.dataset.type || '', budget: '' };
        $('#fArea').value = filt.area; $('#fType').value = filt.type; $('#fBudget').value = '';
        $$('.finder__tabs button').forEach(function (x, j) { x.classList.toggle('is-on', j === 0); });
        applyFilter(true);
      }
    });
  }

  /* modal */
  var modal = $('#modal'), lastFocus;
  function openModal(i) {
    var p = PROJECTS[i];
    $('#mImg').src = p.img; $('#mImg').alt = p.name;
    $('#mArea').textContent = p.area + (p.status === 'offplan' ? ' · Off-plan' : ' · Ready');
    $('#mTitle').textContent = p.name;
    $('#mPrice').textContent = 'From ' + fmt(p.price);
    $('#mForm').hidden = false; $('#mOk').hidden = true; $('#mForm').reset();
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    setTimeout(function () { var f = $('#mForm input'); if (f) f.focus(); }, 50);
  }
  function closeModal() {
    modal.hidden = true; document.body.style.overflow = '';
    if (lenis) lenis.start();
    if (lastFocus) lastFocus.focus();
  }
  function initModal() {
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('[data-open]');
      if (b) { openModal(+b.dataset.open); return; }
      var c = e.target.closest('.card__img');
      if (c) openModal(+c.closest('.card').dataset.i);
    });
    $$('[data-close]', modal).forEach(function (x) { x.addEventListener('click', closeModal); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
    $('#mForm').addEventListener('submit', function (e) { e.preventDefault(); this.hidden = true; $('#mOk').hidden = false; });
  }

  /* =====================================================
     PAYMENT PLAN STACK
     ===================================================== */
  function initCalc() {
    var sel = $('#cProject'), price = $('#cPrice'), down = $('#cDown'), hand = $('#cHand');
    PROJECTS.forEach(function (p, i) { var o = document.createElement('option'); o.value = i; o.textContent = p.name + ' · ' + p.area; sel.appendChild(o); });
    sel.value = 7;
    var stack = $('#stack');
    // mini iso engine for the stack
    var s = 19, ox = 120, oy = 196;
    var Q = function (x, y, z) { return [ox + (x - y) * C * s, oy + (x + y) * 0.5 * s - z * s]; };
    var qflat = function (x, y, w, d, z) { return [Q(x, y, z), Q(x + w, y, z), Q(x + w, y + d, z), Q(x, y + d, z)]; };
    var qbox = function (z, h, cols) {
      return '<polygon fill="' + cols[1] + '" points="' + pts([Q(0, 4, z), Q(4, 4, z), Q(4, 4, z + h), Q(0, 4, z + h)]) + '"/>' +
             '<polygon fill="' + cols[2] + '" points="' + pts([Q(4, 0, z), Q(4, 4, z), Q(4, 4, z + h), Q(4, 0, z + h)]) + '"/>' +
             '<polygon fill="' + cols[0] + '" points="' + pts(qflat(0, 0, 4, 4, z + h)) + '"/>';
    };
    var COLS = [['#e2c27d', '#c9a24f', '#a9823a'], ['#d6d0c5', '#b7b0a4', '#9c958a'], ['#9bbac7', '#6f90a2', '#4d6f82']];
    var cur3 = [10, 50, 40];
    function drawStack(v) {
      var H = 8.6, z = 0, html = '<polygon fill="#e6dccb" points="' + pts(qflat(-0.6, -0.6, 5.2, 5.2, 0)) + '"/>';
      var labels = ['Booking', 'Construction', 'Handover'];
      var lab = '';
      v.forEach(function (pc, i) {
        var h = H * pc / 100;
        if (h > 0.02) html += qbox(z, h, COLS[i]);
        if (pc > 0) {
          var lp = Q(4, 0, z + h / 2);
          lab += '<text x="' + (lp[0] + 8) + '" y="' + (lp[1] + 4) + '" font-family="Inter Tight,sans-serif" font-size="11" font-weight="700" fill="#16140f">' + Math.round(pc) + '%</text>';
        }
        z += h;
      });
      stack.innerHTML = html + lab;
    }
    function upd(animate) {
      var pr = +price.value, dv = +down.value, hv = +hand.value;
      if (dv + hv > 100) { hv = 100 - dv; hand.value = hv; }
      var bv = 100 - dv - hv;
      $('#cPriceOut').textContent = fmt(pr, 'AED');
      $('#cDownOut').textContent = dv + '%';
      $('#cHandOut').textContent = hv + '%';
      $('#oBook').textContent = fmt(pr * dv / 100, 'AED');
      $('#oBuild').textContent = fmt(pr * bv / 100, 'AED');
      $('#oHand').textContent = fmt(pr * hv / 100, 'AED');
      $('#oDld').textContent = fmt(pr * 0.04, 'AED');
      [price, down, hand].forEach(function (r) { r.style.setProperty('--v', ((r.value - r.min) / (r.max - r.min) * 100) + '%'); });
      var ok = pr >= 2000000, chip = $('#visaChip');
      chip.classList.toggle('is-no', !ok);
      $('#visaTxt').textContent = ok ? 'This price qualifies for the 10-year UAE Golden Visa (AED 2M and above).' : 'AED ' + (2000000 - pr).toLocaleString('en-US') + ' more would qualify you for the 10-year Golden Visa.';
      var target = [dv, bv, hv];
      if (hasGsap && animate && !reduce) gsap.to(cur3, { 0: target[0], 1: target[1], 2: target[2], duration: .5, ease: 'power3.out', onUpdate: function () { drawStack(cur3); }, overwrite: true });
      else { cur3[0] = target[0]; cur3[1] = target[1]; cur3[2] = target[2]; drawStack(cur3); }
      $('#calcCta').dataset.goal = PROJECTS[+sel.value] ? PROJECTS[+sel.value].name : '';
    }
    sel.addEventListener('change', function () { price.value = PROJECTS[+sel.value].price; upd(true); });
    [price, down, hand].forEach(function (r) { r.addEventListener('input', function () { upd(true); }); });
    upd(false);
  }

  /* =====================================================
     REVIEWS, WIZARD, SELL, NAV, NOTES
     ===================================================== */
  function initReviews() {
    var revs = $$('.rev'), i = 0, timer;
    function go(n) { i = (n + revs.length) % revs.length; revs.forEach(function (r, j) { r.classList.toggle('is-on', j === i); }); $('#revNum').textContent = (i + 1) + ' / ' + revs.length; }
    function auto() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 6500); }
    $('#revPrev').addEventListener('click', function () { go(i - 1); auto(); });
    $('#revNext').addEventListener('click', function () { go(i + 1); auto(); });
    auto();
  }
  function initWizard() {
    var steps = $$('.wiz__step'), i = 0, bar = $('#wizBar'), back = $('#wizBack'), num = $('#wizNum');
    function show(n) {
      i = n;
      steps.forEach(function (s, j) { s.classList.toggle('is-on', j === i); });
      bar.style.width = ((i + 1) / steps.length * 100) + '%';
      back.hidden = i === 0; num.textContent = 'Step ' + (i + 1) + ' of ' + steps.length;
    }
    $$('.chips').forEach(function (c) {
      c.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        $$('button', c).forEach(function (x) { x.classList.toggle('is-on', x === b); });
        setTimeout(function () { show(Math.min(i + 1, steps.length - 1)); }, 260);
      });
    });
    back.addEventListener('click', function () { show(Math.max(0, i - 1)); });
    $('#wiz').addEventListener('submit', function (e) {
      e.preventDefault();
      var n = $('#wName').value.trim(), ph = $('#wPhone').value.trim();
      if (!n || ph.replace(/\D/g, '').length < 7) { $('#wizErr').hidden = false; return; }
      $('#wizErr').hidden = true;
      steps.forEach(function (s) { s.classList.remove('is-on'); });
      $('.wiz__nav').hidden = true; $('.wiz__prog').hidden = true;
      $('#doneName').textContent = n.split(' ')[0];
      $('#wizDone').hidden = false;
    });
    // goal shortcuts (Golden Visa etc.)
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-goal]'); if (!a) return;
      var g = a.dataset.goal;
      if (g === 'Golden Visa') {
        $$('.chips[data-name="goal"] button').forEach(function (b) { b.classList.toggle('is-on', b.textContent === 'Golden Visa'); });
        show(1);
      }
    });
  }
  function initSell() {
    $$('.seg2 button').forEach(function (b) { b.addEventListener('click', function () { $$('.seg2 button').forEach(function (x) { x.classList.toggle('is-on', x === b); }); }); });
    $('#sellForm').addEventListener('submit', function (e) { e.preventDefault(); $$('label,button[type=submit]', this).forEach(function (x) { x.hidden = true; }); $('.sell__ok').hidden = false; });
  }

  var lenis = null;
  function scrollToEl(t) {
    if (!t) return;
    var off = -(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hdr'), 10) || 72) + (t.id === 'projects' || t.classList.contains('finder') ? 0 : 0);
    if (t.id === 'top') { lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); return; }
    var y = t.getBoundingClientRect().top + window.pageYOffset + off;
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }
  function initNav() {
    var burger = $('#burger'), mnav = $('#mnav');
    function setMenu(open) {
      burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mnav.hidden = !open; document.body.style.overflow = open ? 'hidden' : '';
      if (lenis) open ? lenis.stop() : lenis.start();
    }
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.getElementById(id.slice(1));
      if (!t) return;
      e.preventDefault();
      if (!mnav.hidden) setMenu(false);
      var notes = $('#notes'); if (notes && !notes.hidden && !notes.contains(a)) { notes.hidden = true; $('#notesBtn').setAttribute('aria-expanded', 'false'); }
      setTimeout(function () { scrollToEl(t); }, a.dataset.type !== undefined || a.dataset.area !== undefined ? 60 : 0);
    });
    var nb = $('#notesBtn'), notes = $('#notes');
    nb.addEventListener('click', function () { var o = notes.hidden; notes.hidden = !o; nb.setAttribute('aria-expanded', o); });
    $('#notesX').addEventListener('click', function () { notes.hidden = true; nb.setAttribute('aria-expanded', 'false'); });
  }

  /* =====================================================
     SCROLL FX
     ===================================================== */
  function initScrollFx() {
    var hdr2 = $('#hdr'), mbar = $('#mbar');
    if (!hasGsap) { hdr2.classList.add('is-solid'); mbar.classList.add('is-on'); return; }
    ScrollTrigger.create({
      trigger: '.finder-sec', start: 'top bottom-=10',
      onEnter: function () { hdr2.classList.add('is-solid'); mbar.classList.add('is-on'); },
      onLeaveBack: function () { hdr2.classList.remove('is-solid'); mbar.classList.remove('is-on'); }
    });
    ScrollTrigger.batch('.rv', {
      start: 'top 88%', once: true,
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: reduce ? 0 : 1, stagger: .08, ease: 'power3.out' }); }
    });
    $$('.count').forEach(function (c) {
      var to = +c.dataset.to, dec = +(c.dataset.dec || 0), o = { v: 0 };
      c.textContent = (0).toFixed(dec);
      ScrollTrigger.create({ trigger: c, start: 'top 90%', once: true, onEnter: function () { gsap.to(o, { v: to, duration: reduce ? 0 : 1.6, ease: 'power2.out', onUpdate: function () { c.textContent = o.v.toFixed(dec); } }); } });
    });
    var steps = $('#steps');
    gsap.to(steps, { '--p': 1, ease: 'none', scrollTrigger: { trigger: steps, start: 'top 75%', end: 'bottom 60%', scrub: true } });
    if (!reduce) {
      gsap.fromTo('.visa__bg', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.visa', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from('.finder', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.finder-sec', start: 'top 92%', once: true } });
    }
  }

  /* =====================================================
     BOOT
     ===================================================== */
  function boot() {
    if (hasGsap) {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      if (window.Lenis && !reduce && window.matchMedia('(pointer: fine)').matches) {
        lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
        gsap.ticker.lagSmoothing(0);
      }
    }
    renderGrid();
    initFinder();
    initModal();
    initCalc();
    initReviews();
    initWizard();
    initSell();
    initNav();
    initBuild();
    initScrollFx();
    if (hasGsap) {
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
