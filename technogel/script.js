/* ==========================================================
   Technogel® – Home page interactions
   ========================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------
     1. Interactive gel field (canvas)
     --------------------------------------------------------- */
  function hex(h) { h = h.replace("#", ""); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function rgb(c, a) { return "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + (a == null ? 1 : a) + ")"; }
  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  var C = {
    light: hex("#7fdcff"), cyan: hex("#1fb4ec"), deep: hex("#0079b8"), dark: hex("#0b4f7a"),
    warm: hex("#ffb35c"), hot: hex("#ff6a4d"), white: [255, 255, 255]
  };

  function GelField(canvas, opts) {
    this.c = canvas;
    this.ctx = canvas.getContext("2d");
    this.o = Object.assign({ cols: 12, bg: "#d6edf8", interactive: true, mode: "press", dark: false }, opts || {});
    this.mode = this.o.mode;
    this.modeT = 0;
    this.p = { x: -999, y: -999, tx: -999, ty: -999, active: false, s: 0 };
    this.t = 0;
    this.running = false;
    this.visible = true;
    this.onLabel = null;
    this.particles = [];
    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);
    this.resize();
    window.addEventListener("resize", this.resize);
    if (this.o.interactive) this.bindPointer();
    var self = this;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { self.visible = en[0].isIntersecting; if (self.visible) self.start(); }, { rootMargin: "100px" }).observe(canvas);
    }
    this.start();
  }
  GelField.prototype.resize = function () {
    var r = this.c.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = Math.max(r.width, 10); this.h = Math.max(r.height, 10);
    this.c.width = this.w * dpr; this.c.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cols = this.w < 360 ? Math.max(8, this.o.cols - 3) : this.o.cols;
    this.cell = this.w / cols;
    var rows = Math.ceil(this.h / this.cell) + 1;
    this.cubes = [];
    var offY = (this.h - rows * this.cell) / 2;
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        this.cubes.push({ x: (i + .5) * this.cell, y: offY + (j + .5) * this.cell, s: 1, v: 0, ox: 0, oy: 0, heat: 0, val: 0 });
      }
    }
    if (this.p) this.draw();
  };
  GelField.prototype.bindPointer = function () {
    var self = this, c = this.c;
    function pos(e) {
      var r = c.getBoundingClientRect();
      var pt = e.touches ? e.touches[0] : e;
      self.p.tx = pt.clientX - r.left; self.p.ty = pt.clientY - r.top;
      self.p.active = true; self.lastMove = performance.now();
    }
    c.addEventListener("pointermove", pos);
    c.addEventListener("pointerdown", function (e) { pos(e); self.p.down = true; });
    c.addEventListener("pointerup", function () { self.p.down = false; });
    c.addEventListener("pointerleave", function () { self.p.active = false; self.p.down = false; });
    c.addEventListener("touchmove", pos, { passive: true });
  };
  GelField.prototype.setMode = function (m) {
    if (m === this.mode) return;
    this.mode = m; this.modeT = 0; this.particles.length = 0;
  };
  GelField.prototype.start = function () {
    if (this.running || reduceMotion && this.drawnOnce) return;
    this.running = true;
    requestAnimationFrame(this.loop);
  };
  GelField.prototype.loop = function () {
    if (!this.visible) { this.running = false; return; }
    this.t += 1 / 60; this.modeT += 1 / 60;
    this.update();
    this.draw();
    this.drawnOnce = true;
    if (reduceMotion) { this.running = false; return; }
    requestAnimationFrame(this.loop);
  };
  GelField.prototype.update = function () {
    var p = this.p, w = this.w, h = this.h, t = this.t, cell = this.cell;
    var idle = !p.active || performance.now() - (this.lastMove || 0) > 2600;
    if (this.mode === "press") {
      if (idle) {
        // gentle autonomous "finger" path
        p.tx = w * (.5 + .3 * Math.sin(t * .55)); p.ty = h * (.5 + .26 * Math.sin(t * .9 + 1));
      }
      p.x += (p.tx - p.x) * .12; p.y += (p.ty - p.y) * .12;
      var target = idle ? .55 + .45 * Math.max(0, Math.sin(t * 1.6)) : (p.down ? 1.25 : 1);
      p.s += (target - p.s) * .08;
      var R = cell * (p.down ? 2.6 : 2.1);
      for (var i = 0; i < this.cubes.length; i++) {
        var q = this.cubes[i];
        var dx = q.x - p.x, dy = q.y - p.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
        var f = Math.exp(-(d * d) / (R * R)) * p.s;
        var ring = Math.exp(-Math.pow((d - R * 1.35) / (R * .55), 2)) * p.s;
        var ts = 1 - .42 * f + .09 * ring;
        q.v += (ts - q.s) * .2; q.v *= .74; q.s += q.v;
        var push = (f * .5 + ring * .18) * cell * .28;
        q.ox += ((dx / d) * push - q.ox) * .2; q.oy += ((dy / d) * push - q.oy) * .2;
        q.val += (f - q.val) * .2; q.heat += (0 - q.heat) * .1;
      }
    } else if (this.mode === "cool") {
      // body heat appears in the center, then the gel draws it away
      var cyc = (this.modeT % 6) / 6;
      var src = cyc < .3 ? cyc / .3 : Math.max(0, 1 - (cyc - .3) / .45);
      var cx = w / 2, cy = h * .52, RX = w * .3, RY = h * .2;
      for (var k = 0; k < this.cubes.length; k++) {
        var c2 = this.cubes[k];
        var ex = (c2.x - cx) / RX, ey = (c2.y - cy) / RY;
        var e = Math.exp(-(ex * ex + ey * ey));
        var target2 = e * src;
        c2.heat += (target2 - c2.heat) * (target2 > c2.heat ? .08 : .035);
        var ts2 = 1 - .2 * e * Math.min(1, src * 2) + .03 * Math.sin(t * 3 + c2.x * .05);
        c2.v += (ts2 - c2.s) * .15; c2.v *= .8; c2.s += c2.v;
        c2.ox *= .9; c2.oy *= .9; c2.val *= .9;
        if (c2.heat > .35 && Math.random() < .015 * c2.heat) {
          this.particles.push({ x: c2.x + (Math.random() - .5) * cell, y: c2.y, life: 1, vx: (c2.x - cx) * .004 + (Math.random() - .5) * .4, vy: -.6 - Math.random() * .8 });
        }
      }
    } else if (this.mode === "pressure") {
      // pressure map: memory foam (peaks) -> Technogel (evenly spread)
      var cyc3 = (this.modeT % 7) / 7;
      var spread = cyc3 < .4 ? 0 : cyc3 < .55 ? (cyc3 - .4) / .15 : cyc3 < .9 ? 1 : 1 - (cyc3 - .9) / .1;
      spread = spread * spread * (3 - 2 * spread);
      var label = spread > .5 ? "Technogel®: pressure spread out" : "Ordinary foam: pressure points";
      if (this.onLabel && label !== this._lab) { this._lab = label; this.onLabel(label, spread > .5); }
      var pts = [[.5, .16, .9], [.5, .38, 1], [.5, .62, .95], [.5, .86, .6]]; // head, shoulders, hips, heels
      for (var m = 0; m < this.cubes.length; m++) {
        var c3 = this.cubes[m], val = 0;
        for (var n = 0; n < pts.length; n++) {
          var px = pts[n][0] * w, py = pts[n][1] * h, amp = pts[n][2];
          var rX = (n === 1 || n === 2 ? w * .16 : w * .09) * (1 + spread * 1.2);
          var rY = h * .07 * (1 + spread * 1.1);
          var ddx = (c3.x - px) / rX, ddy = (c3.y - py) / rY;
          val += amp * (1 - spread * .62) * Math.exp(-(ddx * ddx + ddy * ddy));
        }
        val = Math.min(1, val);
        c3.heat += (val - c3.heat) * .1;
        var ts3 = 1 - .35 * c3.heat;
        c3.v += (ts3 - c3.s) * .15; c3.v *= .78; c3.s += c3.v;
        c3.ox *= .9; c3.oy *= .9; c3.val *= .9;
      }
    }
    for (var z = this.particles.length - 1; z >= 0; z--) {
      var pp = this.particles[z];
      pp.x += pp.vx; pp.y += pp.vy; pp.life -= .012;
      if (pp.life <= 0) this.particles.splice(z, 1);
    }
  };
  GelField.prototype.draw = function () {
    var ctx = this.ctx, cell = this.cell, dark = this.o.dark;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.fillStyle = this.o.bg;
    ctx.fillRect(0, 0, this.w, this.h);
    var base = cell * .82, rad = cell * .2;
    var pressureMode = this.mode === "pressure";
    for (var i = 0; i < this.cubes.length; i++) {
      var q = this.cubes[i];
      var s = Math.max(.35, q.s), size = base * s;
      var x = q.x + q.ox - size / 2, y = q.y + q.oy - size / 2;
      var top, bot;
      if (pressureMode) {
        var hv = q.heat;
        top = hv < .5 ? mix(C.light, C.warm, hv * 2) : mix(C.warm, C.hot, (hv - .5) * 2);
        bot = mix(top, C.dark, .35);
      } else {
        var press = Math.min(1, q.val * 1.2);
        top = mix(C.light, C.cyan, .35 + press * .65);
        bot = mix(C.cyan, C.dark, .25 + press * .6);
        if (q.heat > .01) {
          var heatTop = mix(C.warm, C.hot, q.heat);
          top = mix(top, heatTop, Math.min(1, q.heat * 1.3));
          bot = mix(bot, mix(C.hot, C.dark, .2), Math.min(1, q.heat * 1.1));
        }
      }
      // shadow
      ctx.fillStyle = dark ? "rgba(0,0,0,.35)" : "rgba(11,79,122,.18)";
      rr(ctx, x + size * .06, y + size * .1, size, size, rad * s); ctx.fill();
      // body
      var g = ctx.createLinearGradient(x, y, x + size, y + size);
      g.addColorStop(0, rgb(top)); g.addColorStop(1, rgb(bot));
      ctx.fillStyle = g;
      rr(ctx, x, y, size, size, rad * s); ctx.fill();
      // gloss
      ctx.fillStyle = "rgba(255,255,255," + (.38 - (1 - s) * .3) + ")";
      rr(ctx, x + size * .14, y + size * .12, size * .42, size * .16, size * .08); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.12)";
      rr(ctx, x + size * .12, y + size * .12, size * .76, size * .76, rad * s * .8); ctx.fill();
    }
    // heat particles
    for (var k = 0; k < this.particles.length; k++) {
      var p = this.particles[k];
      ctx.fillStyle = "rgba(255," + (170 + (1 - p.life) * 80 | 0) + "," + (110 + (1 - p.life) * 140 | 0) + "," + (p.life * .8) + ")";
      ctx.beginPath(); ctx.arc(p.x, p.y, 2 + (1 - p.life) * 3, 0, Math.PI * 2); ctx.fill();
    }
    // finger indicator in press mode
    if (this.mode === "press" && this.p.s > .05) {
      var pr = this.cell * 1.1 * (.8 + this.p.s * .3);
      var rg = ctx.createRadialGradient(this.p.x, this.p.y, 0, this.p.x, this.p.y, pr * 1.6);
      rg.addColorStop(0, "rgba(255,255,255," + (.22 * this.p.s) + ")");
      rg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(this.p.x, this.p.y, pr * 1.6, 0, Math.PI * 2); ctx.fill();
    }
  };

  var heroCanvas = $("#gelHero");
  if (heroCanvas) new GelField(heroCanvas, { cols: 11, bg: "#e9f5fb" });

  var demoCanvas = $("#gelDemo"), demo = null;
  if (demoCanvas) {
    demo = new GelField(demoCanvas, { cols: 12, bg: "#1a2b39", dark: true, mode: "press" });
  }

  /* ---------------------------------------------------------
     2. Product art (isometric SVG, generated)
     --------------------------------------------------------- */
  var uid = 0;
  function productSVG(kind) {
    var id = "p" + (++uid);
    var shapes = {
      pillow:   { w: 220, d: 140, h: 30, r: 46, gel: { x: -84, y: -50, w: 168, h: 100, r: 26 } },
      lab:      { w: 210, d: 140, h: 38, r: 40, gel: { x: -62, y: -50, w: 124, h: 100, r: 22 }, wings: true },
      vive:     { w: 230, d: 150, h: 34, r: 52, gel: { x: -100, y: -60, w: 200, h: 120, r: 36 }, band: true },
      mattress: { w: 260, d: 190, h: 46, r: 14, diag: true },
      seat:     { w: 170, d: 170, h: 26, r: 34, gel: { x: -62, y: -62, w: 124, h: 124, r: 24 } },
      travel:   { travel: true, h: 34 }
    };
    var s = shapes[kind] || shapes.pillow;
    var iso = "matrix(0.866 0.5 -0.866 0.5 200 150)";
    var shapeEl;
    if (s.travel) {
      shapeEl = function (fill) {
        return '<path d="M-90,-20 A90,90 0 1 1 90,-20 L90,40 A32,32 0 0 1 26,40 L26,-6 A26,26 0 1 0 -26,-6 L-26,40 A32,32 0 0 1 -90,40 Z" transform="rotate(180)" fill="' + fill + '"/>';
      };
    } else {
      shapeEl = function (fill) {
        return '<rect x="' + (-s.w / 2) + '" y="' + (-s.d / 2) + '" width="' + s.w + '" height="' + s.d + '" rx="' + s.r + '" fill="' + fill + '"/>';
      };
    }
    var layers = "";
    var L = 14;
    for (var i = L; i >= 1; i--) {
      var dy = (s.h / L) * i;
      var shade = i === L ? "#b9c6d0" : (s.band && i > L * .3 && i < L * .7 ? "#5b6b78" : (i > L * .55 ? "#d5dee5" : "#e6ecf1"));
      if (kind === "travel") shade = i > L * .5 ? "#6d7a85" : "#8b97a1";
      layers += '<g transform="translate(0 ' + dy.toFixed(1) + ')"><g transform="' + iso + '">' + shapeEl(shade) + "</g></g>";
    }
    var topFill = kind === "travel" ? "#a5b0b9" : "url(#" + id + "f)";
    var gel = "";
    if (s.gel) {
      gel = '<rect x="' + s.gel.x + '" y="' + s.gel.y + '" width="' + s.gel.w + '" height="' + s.gel.h + '" rx="' + s.gel.r + '" fill="url(#' + id + 'c)" stroke="rgba(255,255,255,.7)" stroke-width="2"/>';
    }
    if (s.diag) {
      gel = '<clipPath id="' + id + 'k"><rect x="' + (-s.w / 2 + 8) + '" y="' + (-s.d / 2 + 8) + '" width="' + (s.w - 16) + '" height="' + (s.d - 16) + '" rx="10"/></clipPath>' +
        '<polygon clip-path="url(#' + id + 'k)" points="' + (-s.w / 2) + ',' + (-s.d / 2) + ' ' + (s.w / 2) + ',' + (-s.d / 2) + ' ' + (s.w / 2) + ',' + (s.d * .1) + ' ' + (-s.w * .1) + ',' + (s.d / 2) + ' ' + (-s.w / 2) + ',' + (s.d / 2) + '" fill="url(#' + id + 'c)"/>';
    }
    if (kind === "travel") {
      gel = '<path transform="rotate(180)" d="M-70,-20 A70,70 0 1 1 70,-20 L70,30 A12,12 0 0 1 46,30 L46,-12 A46,46 0 1 0 -46,-12 L-46,30 A12,12 0 0 1 -70,30 Z" fill="url(#' + id + 'c)"/>';
    }
    if (s.wings) {
      gel += '<rect x="' + (-s.w / 2 + 12) + '" y="' + (-s.d / 2 + 14) + '" width="22" height="' + (s.d - 28) + '" rx="11" fill="#eef3f6"/><rect x="' + (s.w / 2 - 34) + '" y="' + (-s.d / 2 + 14) + '" width="22" height="' + (s.d - 28) + '" rx="11" fill="#eef3f6"/>';
    }
    var ext = s.travel ? 160 : (s.w + s.d) * .433, vh = s.travel ? 200 : (s.w + s.d) * .25;
    var vb = (200 - ext - 12).toFixed(0) + " " + (160 - vh - 14).toFixed(0) + " " + (2 * ext + 24).toFixed(0) + " " + (2 * vh + s.h + 34).toFixed(0);
    return '<svg viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      "<defs>" +
      '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fe1ff"/><stop offset=".55" stop-color="#1fb4ec"/><stop offset="1" stop-color="#0079b8"/></linearGradient>' +
      '<linearGradient id="' + id + 'f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#edf2f5"/></linearGradient>' +
      '<pattern id="' + id + 'c" width="15" height="15" patternUnits="userSpaceOnUse"><rect width="15" height="15" fill="#bfe9f9"/><rect x="1.6" y="1.6" width="11.8" height="11.8" rx="3.2" fill="url(#' + id + 'g)"/><rect x="3.4" y="3" width="5" height="2" rx="1" fill="rgba(255,255,255,.65)"/></pattern>' +
      "</defs>" +
      '<g transform="translate(0 10)">' + layers +
      '<g transform="' + iso + '">' + shapeEl(topFill) + gel + "</g></g></svg>";
  }

  var products = [
    { id: "deluxe", kind: "pillow", cat: "pillow", coll: "Original Collection", name: "Original Deluxe Pillow", desc: "Our signature cube design with patented air tunnels. Cool, adaptive support in any sleep position.", tags: ["Side & back", "Cooling", "Medium / High"], price: "$279", rating: "4.9", badge: "Best seller", badgeCls: "badge--hot" },
    { id: "lab", kind: "lab", cat: "pillow", coll: "Lab Collection", name: "Lab Back & Side", desc: "Orthopedic shape with a memory-foam core and cooling Technogel® top, designed with medical experts for neck relief.", tags: ["Back sleepers", "Orthopedic", "Medium / High"], price: "$229", rating: "4.8", badge: "Clinically designed", badgeCls: "badge--lab" },
    { id: "vive", kind: "vive", cat: "pillow", coll: "Vive Collection", name: "Vive Pillow", desc: "Our most exclusive pillow. A full gel surface and premium Italian craftsmanship for a truly luxurious night.", tags: ["All positions", "Full gel", "Luxury"], price: "$349", rating: "4.9", badge: "Premium" },
    { id: "mattress", kind: "mattress", cat: "mattress", coll: "Original Collection", name: "Technogel® Gel Mattress", desc: "Patented Technogel® towers over premium foam, for deep, cool sleep without pressure points.", tags: ["Twin – King", "Cooling", "Zoned support"], price: "$1,990", from: true, rating: "4.8", badge: "Sleep cooler" },
    { id: "seat", kind: "seat", cat: "living", coll: "Living Range", name: "Living Seatpad", desc: "Turns any chair into an ergonomic seat, with pressure relief for the office, the car or at home.", tags: ["Office & car", "Posture", "Portable"], price: "$119", rating: "4.7" },
    { id: "travel", kind: "travel", cat: "living", coll: "Original Travel", name: "Travel Neck Pillow", desc: "Ergonomic neck support with a cooling gel core, for flights, trains and road trips.", tags: ["Travel", "Neck support", "Cooling"], price: "$89", rating: "4.7" }
  ];
  var byId = {};
  products.forEach(function (p) { byId[p.id] = p; });

  var grid = $("#products");
  if (grid) {
    grid.innerHTML = products.map(function (p) {
      return '<article class="card" data-cat="' + p.cat + '">' +
        (p.badge ? '<span class="badge ' + (p.badgeCls || "") + '">' + p.badge + "</span>" : "") +
        '<div class="card__art">' + productSVG(p.kind) + "</div>" +
        '<div class="card__body">' +
        '<span class="card__coll">' + p.coll + "</span>" +
        "<h3>" + p.name + "</h3>" +
        '<p class="card__desc">' + p.desc + "</p>" +
        '<div class="card__meta">' + p.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("") + "</div>" +
        '<div class="card__rating"><span class="stars">★★★★★</span> ' + p.rating + " / 5</div>" +
        '<div class="card__foot"><div class="price">' + (p.from ? "<small>from</small>" : "") + p.price + "</div>" +
        '<a href="#shop" class="btn btn--primary">Shop now</a></div>' +
        "</div></article>";
    }).join("");
  }

  // Tabs
  $$(".tabs button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".tabs button").forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
      var f = b.dataset.filter, shown = [];
      $$(".card", grid).forEach(function (c) {
        var on = f === "all" || c.dataset.cat === f;
        c.classList.toggle("is-hidden", !on);
        if (on) shown.push(c);
      });
      if (hasGSAP && !reduceMotion) gsap.fromTo(shown, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .07, ease: "power3.out" });
    });
  });

  /* ---------------------------------------------------------
     3. Sleep finder quiz
     --------------------------------------------------------- */
  var quiz = $(".quiz");
  if (quiz) {
    var answers = [], step = 0;
    var steps = $$(".quiz__step", quiz), bar = $("#quizBar");
    function show(n) {
      var cur = steps[step], next = steps[n];
      step = n;
      bar.style.width = (n >= 3 ? 100 : 8 + n * 31) + "%";
      if (hasGSAP && !reduceMotion) {
        gsap.to(cur, { x: -30, opacity: 0, duration: .25, ease: "power2.in", onComplete: function () {
          cur.classList.remove("is-on"); next.classList.add("is-on");
          gsap.fromTo(next, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: .45, ease: "power3.out" });
          gsap.fromTo($$(".quiz__opts button", next), { y: 12, opacity: 0 }, { y: 0, opacity: 1, stagger: .06, duration: .4, delay: .1 });
        } });
      } else { cur.classList.remove("is-on"); next.classList.add("is-on"); }
    }
    function recommend() {
      var pos = answers[0], heat = answers[1], pri = answers[2], id, why = [];
      if (pri === "travel") { id = "travel"; why.push("you want cooling comfort on the move"); }
      else if (pri === "lux") { id = "vive"; why.push("you want the most luxurious Technogel® feel"); }
      else if (pri === "neck" && pos === "back") { id = "lab"; why.push("you sleep on your back and want neck & shoulder relief"); }
      else { id = "deluxe"; why.push(pos === "side" ? "side sleepers need adaptive support at the neck" : "it adapts instantly when you change position"); }
      if (heat === "hot") why.push("its gel draws heat away so you stay cool all night");
      else if (heat === "some") why.push("the cooling gel keeps warm nights comfortable");
      var p = byId[id];
      $("#resultArt").innerHTML = productSVG(p.kind);
      $("#resultName").textContent = p.name;
      $("#resultWhy").textContent = "Our pick for you, because " + why.join(", and ") + ".";
      $("#resultPrice").textContent = (p.from ? "From " : "") + p.price + " · Free US shipping · 100-night trial";
    }
    quiz.addEventListener("click", function (e) {
      var b = e.target.closest(".quiz__opts button");
      if (!b) return;
      b.classList.add("picked");
      answers[step] = b.dataset.v;
      setTimeout(function () {
        b.classList.remove("picked");
        if (step === 2) { recommend(); show(3); } else show(step + 1);
      }, 220);
    });
    $("#quizRestart").addEventListener("click", function () { answers = []; show(0); });
  }

  /* ---------------------------------------------------------
     4. Header, mega menu, drawer, sticky bar
     --------------------------------------------------------- */
  var hdr = $(".hdr"), mbar = $("#mbar"), hero = $(".hero");
  function onScroll() {
    var y = window.scrollY;
    hdr.classList.toggle("is-solid", y > 20);
    if (mbar && hero) mbar.classList.toggle("show", y > hero.offsetHeight * .8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  $$(".has-mega").forEach(function (item) {
    var btn = $(".nav__link", item), tmr;
    function open(v) {
      $$(".has-mega").forEach(function (o) { if (o !== item) { o.classList.remove("open"); $(".nav__link", o).setAttribute("aria-expanded", "false"); } });
      item.classList.toggle("open", v); btn.setAttribute("aria-expanded", v ? "true" : "false");
      hdr.classList.toggle("is-solid", v || window.scrollY > 20);
    }
    item.addEventListener("mouseenter", function () { clearTimeout(tmr); open(true); });
    item.addEventListener("mouseleave", function () { tmr = setTimeout(function () { open(false); }, 160); });
    btn.addEventListener("click", function () { open(!item.classList.contains("open")); });
    $$(".mega a", item).forEach(function (a) { a.addEventListener("click", function () { open(false); }); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { $$(".has-mega").forEach(function (o) { o.classList.remove("open"); }); closeModal(); }
  });

  var burger = $(".burger"), drawer = $("#drawer");
  function toggleDrawer(v) {
    burger.setAttribute("aria-expanded", v ? "true" : "false");
    drawer.classList.toggle("open", v);
    drawer.setAttribute("aria-hidden", v ? "false" : "true");
    document.body.style.overflow = v ? "hidden" : "";
    hdr.classList.toggle("is-solid", v || window.scrollY > 20);
  }
  burger.addEventListener("click", function () { toggleDrawer(burger.getAttribute("aria-expanded") !== "true"); });
  $$("#drawer a").forEach(function (a) { a.addEventListener("click", function () { toggleDrawer(false); }); });

  // Industry tiles pre-fill the B2B form
  var sel = $("#industrySelect");
  $$(".ind").forEach(function (b) {
    b.addEventListener("click", function () {
      if (sel) sel.value = $("b", b).textContent;
      var f = $("#b2bForm");
      f.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      setTimeout(function () { var n = f.querySelector("input"); if (n) n.focus({ preventScroll: true }); }, 600);
    });
  });

  /* ---------------------------------------------------------
     5. Forms (front-end only for the prototype)
     --------------------------------------------------------- */
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  var b2b = $("#b2bForm");
  if (b2b) b2b.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    $$("[required]", b2b).forEach(function (f) {
      var bad = !f.value.trim() || (f.type === "email" && !validEmail(f.value));
      f.classList.toggle("invalid", bad); if (bad) ok = false;
    });
    if (!ok) return;
    $(".form__ok", b2b).hidden = false;
    $("button[type=submit]", b2b).textContent = "Request sent ✓";
    b2b.reset();
  });
  function emailForm(form, okEl) {
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var inp = $("input", form);
      if (!validEmail(inp.value)) { form.classList.add("invalid"); inp.focus(); return; }
      form.classList.remove("invalid");
      form.hidden = true; okEl.hidden = false;
    });
  }
  emailForm($("#newsForm"), $("#newsForm + .form__ok"));
  emailForm($("#offerForm"), $("#offerForm + .form__ok"));

  /* ---------------------------------------------------------
     6. Exit-intent offer (desktop, once per session)
     --------------------------------------------------------- */
  var modal = $("#offer"), modalGel = null, armed = false;
  function seen() { try { return sessionStorage.getItem("tg_offer") === "1"; } catch (e) { return false; } }
  function markSeen() { try { sessionStorage.setItem("tg_offer", "1"); } catch (e) { /* ignore */ } }
  function openModal() {
    if (!modal || seen()) return;
    markSeen();
    modal.hidden = false;
    if (!modalGel) modalGel = new GelField($("#gelModal"), { cols: 7, bg: "#e9f5fb" });
    else modalGel.resize();
    if (hasGSAP && !reduceMotion) gsap.fromTo(".modal__card", { y: 40, opacity: 0, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: .6, ease: "power3.out" });
    var x = $(".modal__x", modal); if (x) x.focus();
  }
  function closeModal() { if (modal && !modal.hidden) modal.hidden = true; }
  if (modal) {
    setTimeout(function () { armed = true; }, 9000);
    document.addEventListener("mouseout", function (e) {
      if (armed && !e.relatedTarget && e.clientY <= 0 && window.innerWidth > 900) openModal();
    });
    modal.addEventListener("click", function (e) { if (e.target === modal || e.target.closest(".modal__x") || e.target.closest(".modal__no")) closeModal(); });
  }

  /* ---------------------------------------------------------
     7. Counters
     --------------------------------------------------------- */
  function countUp(el) {
    var end = +el.dataset.count;
    if (reduceMotion || !hasGSAP) { el.textContent = end; return; }
    var o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.8, ease: "power2.out", onUpdate: function () { el.textContent = Math.round(o.v); } });
  }

  /* ---------------------------------------------------------
     8. GSAP choreography
     --------------------------------------------------------- */
  var legend = $("#gelLegend"), legendBar = $(".gel__bar"), dots = $$(".gel__dots i");
  var modes = [
    { m: "press", label: "Pressure applied", cls: "press" },
    { m: "cool", label: "Body heat drawn away", cls: "heat" },
    { m: "pressure", label: "Ordinary foam: pressure points", cls: "heat" }
  ];
  function activateStep(i) {
    $$(".step").forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
    dots.forEach(function (d, k) { d.classList.toggle("on", k === i); });
    if (demo) demo.setMode(modes[i].m);
    if (legend) legend.textContent = modes[i].label;
    if (legendBar) legendBar.className = "gel__bar " + modes[i].cls;
  }
  if (demo) demo.onLabel = function (txt, good) {
    if (demo.mode !== "pressure") return;
    legend.textContent = txt;
    legendBar.className = "gel__bar " + (good ? "press" : "heat");
  };

  var isMobile = window.matchMedia("(max-width: 900px)");

  if (!hasGSAP || reduceMotion) {
    $$("[data-count]").forEach(function (el) { el.textContent = el.dataset.count; });
    // Fallback stepper for the gel demo
    var si = 0;
    if (!reduceMotion) setInterval(function () { si = (si + 1) % 3; activateStep(si); }, 5000);
    $$(".step").forEach(function (s, k) { s.addEventListener("click", function () { si = k; activateStep(k); }); });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero intro
  var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  tl.from(".hero__h .line > span", { yPercent: 110, duration: 1.2, stagger: .12 })
    .from(".hero [data-hero]:not(.hero__h)", { y: 24, opacity: 0, duration: .9, stagger: .08 }, "-=.9")
    .from(".gelcard", { scale: .85, rotate: -14, opacity: 0, duration: 1.4, ease: "expo.out" }, "-=1.1")
    .from(".chip", { y: 20, opacity: 0, scale: .9, duration: .8, stagger: .12, ease: "back.out(1.6)" }, "-=.8")
    .from(".gelcard__hint", { y: 10, opacity: 0, duration: .6 }, "-=.4")
    .from(".hdr__in > *", { y: -16, opacity: 0, duration: .8, stagger: .08, clearProps: "transform" }, 0);

  // Floating chips
  $$(".chip").forEach(function (c, i) {
    gsap.to(c, { y: i % 2 ? 10 : -10, duration: 2.6 + i * .4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.6 });
  });

  // Subtle 3D tilt on the hero gel card
  var visual = $("[data-hero-visual]");
  if (visual && window.matchMedia("(pointer:fine)").matches) {
    var card = $(".gelcard");
    visual.addEventListener("mousemove", function (e) {
      var r = visual.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      gsap.to(card, { rotateY: px * 10, rotateX: -py * 10, rotate: -4 + px * 2, transformPerspective: 900, duration: .8, ease: "power2.out" });
    });
    visual.addEventListener("mouseleave", function () { gsap.to(card, { rotateY: 0, rotateX: 0, rotate: -4, duration: 1, ease: "elastic.out(1,.5)" }); });
  }

  // Hero parallax on scroll
  gsap.to(".hero__glow--a", { yPercent: 40, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__visual", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  // Generic reveals
  gsap.set("[data-reveal]", { y: 40, opacity: 0 });
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 88%",
    onEnter: function (els) { gsap.to(els, { y: 0, opacity: 1, duration: 1, stagger: .09, ease: "power3.out", overwrite: true }); }
  });

  // Product cards stagger
  gsap.from(".card", { y: 60, opacity: 0, duration: 1, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: "#products", start: "top 85%" } });

  // Counters
  $$("[data-count]").forEach(function (el) {
    ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: function () { countUp(el); } });
  });

  // Image parallax
  $$(".area img").forEach(function (img) {
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
  });
  gsap.fromTo(".story__media img", { yPercent: -10 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".story__media", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.fromTo(".final__bg", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".final", start: "top bottom", end: "bottom top", scrub: true } });

  // Timeline line draw
  gsap.from(".timeline li", { x: -20, opacity: 0, stagger: .12, duration: .8, ease: "power3.out", scrollTrigger: { trigger: ".timeline", start: "top 80%" } });

  // Comparison table rows
  gsap.from(".trow:not(.thead)", { x: -30, opacity: 0, stagger: .08, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".table", start: "top 75%" } });

  // Industries grid wave
  gsap.from(".ind", { opacity: 0, y: 30, duration: .7, stagger: { each: .06, grid: [3, 3], from: "start" }, ease: "power3.out", scrollTrigger: { trigger: ".industries", start: "top 82%" } });

  // Discover-the-gel steps drive the canvas
  var stepEls = $$(".step");
  ScrollTrigger.matchMedia({
    "(min-width: 901px)": function () {
      stepEls.forEach(function (s, i) {
        ScrollTrigger.create({
          trigger: s, start: "top 60%", end: "bottom 40%",
          onEnter: function () { activateStep(i); }, onEnterBack: function () { activateStep(i); }
        });
      });
    },
    "(max-width: 900px)": function () {
      var si = 0;
      var iv = setInterval(function () { si = (si + 1) % 3; activateStep(si); }, 5200);
      stepEls.forEach(function (s, k) { s.addEventListener("click", function () { si = k; activateStep(k); }); });
      return function () { clearInterval(iv); };
    }
  });

  // Magnetic primary buttons
  if (window.matchMedia("(pointer:fine)").matches) {
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4, ease: "power2.out" });
      });
      b.addEventListener("mouseleave", function () { gsap.to(b, { x: 0, y: 0, duration: .7, ease: "elastic.out(1,.4)" }); });
    });
  }

  // Headline word-lift for section titles
  $$(".h2").forEach(function (h) {
    if (h.closest(".hero")) return;
    gsap.from(h, { clipPath: "inset(0 0 100% 0)", y: 20, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: h, start: "top 88%" } });
  });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
