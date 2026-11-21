/* Silicon Maps: "Cartographer's Edition" home page concept */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var G = window.gsap, ST = window.ScrollTrigger;
  var hasG = !!(G && ST);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var isMobile = function () { return window.innerWidth <= 900; };
  var money = function (n) { return "$" + Math.round(n).toLocaleString("en-US"); };
  var money2 = function (n) { return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); };
  var store = {
    get: function (k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) {} }
  };
  if (reduce) root.classList.add("rm");
  if (hasG) G.registerPlugin(ST);

  /* ================= DATA (from siliconmaps.com) ================= */
  var REGIONS = [
    { id: "silicon-valley", name: "Silicon Valley", cat: "tech", place: "Northern California", lat: 37.37, lon: -121.95, img: "p-silicon-valley.jpg", desc: "The flagship map since 1989, with 200+ innovators. Also shown on backlit displays at SFO and SJC." },
    { id: "silicon-hills", name: "Silicon Hills", cat: "tech", place: "Austin, Texas", lat: 30.27, lon: -97.74, img: "p-silicon-hills.jpg", desc: "Austin's fast-growing corridor of chipmakers, software companies and startups." },
    { id: "silicon-forest", name: "Silicon Forest", cat: "tech", place: "Portland, Oregon", lat: 45.52, lon: -122.68, img: "p-silicon-forest.jpg", desc: "Oregon's high-tech hub, on display at Portland International Airport." },
    { id: "silicon-desert", name: "Silicon Desert", cat: "tech", place: "Phoenix, Arizona", lat: 33.45, lon: -112.07, img: "p-silicon-desert.jpg", desc: "Arizona's semiconductor and advanced-manufacturing powerhouse." },
    { id: "dfw", name: "DFW Technoplex", cat: "tech", place: "Dallas–Fort Worth", lat: 32.82, lon: -96.95, img: "p-dfw.jpg", desc: "North Texas's cluster of tech, telecom and corporate headquarters." },
    { id: "lone-star", name: "Lone Star Tech", cat: "tech", place: "Texas", lat: 29.76, lon: -95.37, img: "poster-soon.svg", desc: "Texas technology innovators on one statewide map.", noProduct: true },
    { id: "east-coast-tech", name: "East Coast Tech", cat: "tech", place: "Boston & the Northeast", lat: 42.36, lon: -71.06, img: "p-east-coast-tech.jpg", desc: "Technology leaders along the Eastern Seaboard." },
    { id: "tech-coast", name: "Tech Coast", cat: "tech", place: "Southern California", lat: 33.9, lon: -118.2, img: "p-tech-coast.jpg", desc: "Southern California's aerospace, med-tech and software economy." },
    { id: "ny-photonics", name: "New York Photonics", cat: "tech", place: "Rochester, NY", lat: 43.16, lon: -77.61, img: "poster-soon.svg", desc: "Upstate New York's optics, photonics and imaging cluster.", noProduct: true },
    { id: "tech-triangle", name: "Tech Triangle", cat: "tech", place: "Raleigh–Durham, NC", lat: 35.78, lon: -78.64, img: "p-tech-triangle.jpg", desc: "Research Triangle Park and North Carolina's tech ecosystem." },
    { id: "south-florida", name: "South Florida Tech Gateway", cat: "tech", place: "Miami, Florida", lat: 25.76, lon: -80.19, img: "poster-soon.svg", desc: "South Florida's growing tech scene and gateway to Latin America.", noProduct: true },
    { id: "silicon-europe", name: "Silicon Europe", cat: "tech", place: "Europe", lat: 50.85, lon: 4.35, img: "p-silicon-europe.jpg", desc: "Europe's leading technology regions on one map." },
    { id: "malaga", name: "Málaga", cat: "tech", place: "Málaga, Spain", lat: 36.72, lon: -4.42, img: "poster-soon.svg", desc: "Southern Europe's emerging tech hub on the Costa del Sol.", noProduct: true },
    { id: "techno-tokyo", name: "Techno Tokyo", cat: "tech", place: "Tokyo, Japan", lat: 35.68, lon: 139.69, img: "p-techno-tokyo.jpg", desc: "Japan's technology capital and its global brands." },
    { id: "silicon-world", name: "Silicon World", cat: "tech", place: "Global", lat: 20, lon: -40, img: "p-silicon-world.jpg", desc: "The world's technology hubs on one global map.", global: true },
    { id: "bioscience-west", name: "Bioscience West", cat: "bio", place: "California", lat: 32.88, lon: -117.22, img: "p-bioscience-west.jpg", desc: "Biotech, pharma and med-device leaders of the West Coast." },
    { id: "bioscience-east", name: "Bioscience East", cat: "bio", place: "New Jersey & Northeast", lat: 40.35, lon: -74.66, img: "p-bioscience-east.jpg", desc: "The life-science corridor of the East Coast." },
    { id: "bio-midwest", name: "Bioscience Midwest", cat: "bio", place: "Chicago & Midwest", lat: 41.88, lon: -87.63, img: "p-bio-midwest.jpg", desc: "Bioscience, ag-bio and medical innovators of the Midwest." },
    { id: "bio-triangle", name: "BIO Triangle", cat: "bio", place: "Research Triangle, NC", lat: 35.99, lon: -78.9, img: "p-bio-triangle.jpg", desc: "North Carolina's world-class life-science cluster." },
    { id: "bio-europe", name: "BIO Europe", cat: "bio", place: "Europe", lat: 47.5, lon: 8.5, img: "p-bio-europe.jpg", desc: "Europe's biotech and pharma leaders." },
    { id: "global-bio", name: "Global BIO", cat: "bio", place: "Global", lat: -5, lon: 20, img: "p-global-bio.jpg", desc: "The world's life-science hubs on one map.", global: true }
  ];
  var byId = {}; REGIONS.forEach(function (r) { byId[r.id] = r; });
  var PRODUCTS = REGIONS.filter(function (r) { return !r.noProduct; }).map(function (r) {
    return { sku: r.id, name: r.name + " 2026", short: r.name, cat: r.cat, price: 25, img: r.img };
  });
  PRODUCTS.push({ sku: "sv-puzzle", name: "Silicon Valley 150-piece Puzzle", short: "SV Puzzle · 150 pc", cat: "gift", price: 29, img: "p-puzzle.jpg" });
  PRODUCTS.push({ sku: "sv-mousepad", name: "Silicon Valley Mouse Pad", short: "SV Mouse Pad", cat: "gift", price: 16, img: "p-silicon-valley.jpg" });
  var prodBySku = {}; PRODUCTS.forEach(function (p) { prodBySku[p.sku] = p; });
  var FEATURED = ["silicon-valley", "sv-puzzle", "bioscience-west", "silicon-hills", "techno-tokyo", "silicon-forest", "bio-triangle", "tech-coast", "sv-mousepad", "silicon-europe", "east-coast-tech", "bioscience-east"];

  /* ================= Toast ================= */
  var toastT;
  function toast(m) { var t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("show"); }, 2400); }

  /* ================= Smooth scroll (Lenis) ================= */
  var lenis = null;
  if (!reduce && window.Lenis && hasG) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    lenis.on("scroll", ST.update);
    G.ticker.add(function (t) { lenis.raf(t * 1000); });
    G.ticker.lagSmoothing(0);
  }
  ["#cartItems", ".modal__box", ".exit__box", ".menu__in", "#rlist", ".drawer__panel"].forEach(function (s) { var e = $(s); if (e) e.setAttribute("data-lenis-prevent", ""); });
  var locks = 0;
  function lock() { locks++; if (lenis) lenis.stop(); document.body.style.overflow = "hidden"; }
  function unlock() { locks = Math.max(0, locks - 1); if (!locks) { if (lenis) lenis.start(); document.body.style.overflow = ""; } }
  function goTo(target) {
    var el = typeof target === "string" ? $(target) : target; if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: el.id === "top" ? 0 : 0, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute("href"); if (id.length < 2) return;
    var el = $(id); if (!el) return;
    e.preventDefault(); closeMenu(); closeExit();
    if (a.dataset.interest) setInterest(a.dataset.interest);
    if (a.dataset.region) selectRegion(a.dataset.region, true);
    goTo(el);
  });

  /* ================= Loader ================= */
  function heroIntro() {
    document.body.classList.remove("is-loading");
    if (!hasG || reduce) return;
    var tl = G.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".hero__title .w", { yPercent: 110, rotate: 4, duration: 1.4, stagger: .1 })
      .from(".hero [data-anim]", { y: 30, opacity: 0, duration: 1.1, stagger: .08 }, "-=1.1")
      .from("#heroPoster", { rotateY: -40, rotateX: 18, y: 120, z: -300, opacity: 0, duration: 1.8 }, "-=1.4")
      .from(".float", { scale: .6, opacity: 0, y: 30, duration: 1, stagger: .12, ease: "back.out(1.8)" }, "-=1.1")
      .from(".nav__in", { y: -30, opacity: 0, duration: 1 }, "-=1.6")
      .from(".hero__foot", { opacity: 0, duration: 1 }, "-=.8");
    G.to(".float--a", { y: -12, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2.5 });
    G.to(".float--b", { y: 10, duration: 3.4, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2.5 });
    G.to(".float--c", { y: -8, duration: 2.8, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2.5 });
    G.fromTo(".hero__shine", { backgroundPosition: "120% 0" }, { backgroundPosition: "-80% 0", duration: 2.4, ease: "power2.inOut", repeat: -1, repeatDelay: 4, delay: 2.4 });
  }
  (function loader() {
    var L = $("#loader");
    if (!hasG || reduce || store.get("sm-seen")) { root.classList.add("no-loader"); L.remove(); heroIntro(); return; }
    store.set("sm-seen", "1");
    var c = { v: 0 }, cnt = $("#loaderCount"), coord = $("#loaderCoord");
    var tl = G.timeline({ onComplete: function () { L.remove(); } });
    tl.to(c, { v: 100, duration: 1.5, ease: "power3.inOut", onUpdate: function () {
        var v = Math.round(c.v); cnt.textContent = ("00" + v).slice(-3);
        coord.textContent = (37.3875 - (100 - v) * .021).toFixed(4) + "° N · " + (122.0575 + (100 - v) * .033).toFixed(4) + "° W";
      } })
      .to("#loaderBar", { width: "100%", duration: 1.5, ease: "power3.inOut" }, 0)
      .to(L.children, { opacity: 0, y: -30, duration: .5, stagger: .04, ease: "power2.in" }, "+=.1")
      .to(L, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=.25")
      .add(heroIntro, "-=.6");
  })();

  /* ================= Cursor ================= */
  if (fine && hasG) {
    var cur = $("#cursor"), dot = $("#cursorDot"), lab = $("#cursorLabel");
    var cx = G.quickTo(cur, "x", { duration: .45, ease: "power3" }), cy = G.quickTo(cur, "y", { duration: .45, ease: "power3" });
    var dx = G.quickTo(dot, "x", { duration: .08 }), dy = G.quickTo(dot, "y", { duration: .08 });
    window.addEventListener("mousemove", function (e) { cx(e.clientX); cy(e.clientY); dx(e.clientX); dy(e.clientY); });
    document.addEventListener("mouseover", function (e) {
      var l = e.target.closest("[data-cursor]"), h = e.target.closest("a, button, label, select, summary");
      if (l && !e.target.closest(".rcard")) { cur.classList.add("is-label"); cur.classList.remove("is-hover"); lab.textContent = l.dataset.cursor; }
      else if (h) { cur.classList.add("is-hover"); cur.classList.remove("is-label"); }
      else { cur.classList.remove("is-hover", "is-label"); }
    });
    document.addEventListener("mouseleave", function () { G.to([cur, dot], { opacity: 0, duration: .2 }); });
    document.addEventListener("mouseenter", function () { G.to([cur, dot], { opacity: 1, duration: .2 }); });
  }

  /* ================= Magnetic ================= */
  if (fine && hasG && !reduce) {
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("mousemove", function (e) { var r = b.getBoundingClientRect(); G.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .5, ease: "power3" }); });
      b.addEventListener("mouseleave", function () { G.to(b, { x: 0, y: 0, duration: .8, ease: "elastic.out(1,.35)" }); });
    });
  }

  /* ================= Nav ================= */
  var nav = $("#nav"), lastY = 0, menuOpen = false;
  function onScrollNav() {
    var y = window.scrollY;
    nav.classList.toggle("is-solid", y > 40);
    nav.classList.toggle("is-hidden", !menuOpen && y > 700 && y > lastY + 2);
    if (y < lastY - 2) nav.classList.remove("is-hidden");
    lastY = y;
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ================= Menu ================= */
  var menu = $("#menu"), menuBtn = $("#menuBtn"), prev = $("#menuPreview");
  REGIONS.forEach(function (r) {
    var a = document.createElement("a"); a.href = "#explorer"; a.textContent = r.name; a.dataset.region = r.id;
    a.addEventListener("mouseenter", function () { prev.src = "images/" + r.img; });
    $('.menu__list[data-list="' + (r.cat === "tech" && !/europe|tokyo|world|malaga/.test(r.id) ? "tech" : "other") + '"]').appendChild(a);
  });
  function openMenu() { menuOpen = true; menu.classList.add("open"); menu.setAttribute("aria-hidden", "false"); menuBtn.setAttribute("aria-expanded", "true"); nav.classList.remove("is-hidden"); lock(); }
  function closeMenu() { if (!menuOpen) return; menuOpen = false; menu.classList.remove("open"); menu.setAttribute("aria-hidden", "true"); menuBtn.setAttribute("aria-expanded", "false"); unlock(); }
  menuBtn.addEventListener("click", function () { menuOpen ? closeMenu() : openMenu(); });

  /* ================= Hero: live topographic canvas ================= */
  (function topo() {
    var cv = $("#topo"); if (!cv) return;
    var ctx = cv.getContext("2d"), W, H, cell = 18, cols, rows, field, t = 0, mx = -999, my = -999, tmx = -999, tmy = -999, visible = true, raf;
    var perm = new Uint8Array(512); var p = []; for (var i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), tt = p[i]; p[i] = p[j]; p[j] = tt; }
    for (i = 0; i < 512; i++) perm[i] = p[i & 255];
    function fade(x) { return x * x * x * (x * (x * 6 - 15) + 10); }
    function grad(h, x, y) { var u = (h & 1) ? x : -x, v = (h & 2) ? y : -y; return (h & 4) ? u + v : u - v * .5; }
    function noise(x, y) {
      var X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y);
      var u = fade(x), v = fade(y), a = perm[X] + Y, b = perm[X + 1] + Y;
      var n = (1 - v) * ((1 - u) * grad(perm[a], x, y) + u * grad(perm[b], x - 1, y)) + v * ((1 - u) * grad(perm[a + 1], x, y - 1) + u * grad(perm[b + 1], x - 1, y - 1));
      return n;
    }
    function resize() {
      var r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 1.5);
      W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      cell = W < 700 ? 22 : 18; cols = Math.ceil(W / cell) + 1; rows = Math.ceil(H / cell) + 1; field = new Float32Array(cols * rows);
    }
    function compute() {
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
        var nx = x * cell / 340, ny = y * cell / 340;
        var v = noise(nx + t * .05, ny - t * .03) * .7 + noise(nx * 2.1 - t * .04, ny * 2.1 + 10) * .3;
        var ddx = x * cell - mx, ddy = y * cell - my, d2 = ddx * ddx + ddy * ddy;
        v += .55 * Math.exp(-d2 / 26000);
        field[y * cols + x] = v;
      }
    }
    function lerp(a, b, lv) { return (lv - a) / (b - a || 1e-6); }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var L = -6; L <= 10; L++) {
        var lv = L * .075, major = L % 4 === 0, hot = L === 6;
        ctx.beginPath();
        ctx.strokeStyle = hot ? "rgba(244,117,36,.42)" : major ? "rgba(143,195,234,.20)" : "rgba(143,195,234,.08)";
        ctx.lineWidth = hot ? 1.2 : major ? 1 : .8;
        for (var y = 0; y < rows - 1; y++) for (var x = 0; x < cols - 1; x++) {
          var a = field[y * cols + x], b = field[y * cols + x + 1], c = field[(y + 1) * cols + x + 1], d = field[(y + 1) * cols + x];
          var idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
          if (idx === 0 || idx === 15) continue;
          var px = x * cell, py = y * cell;
          var top = [px + cell * lerp(a, b, lv), py], right = [px + cell, py + cell * lerp(b, c, lv)], bot = [px + cell * lerp(d, c, lv), py + cell], left = [px, py + cell * lerp(a, d, lv)];
          var segs;
          switch (idx) {
            case 1: case 14: segs = [left, bot]; break;
            case 2: case 13: segs = [bot, right]; break;
            case 3: case 12: segs = [left, right]; break;
            case 4: case 11: segs = [top, right]; break;
            case 5: segs = [left, top, bot, right]; break;
            case 6: case 9: segs = [top, bot]; break;
            case 7: case 8: segs = [left, top]; break;
            case 10: segs = [left, bot, top, right]; break;
          }
          for (var s = 0; s < segs.length; s += 2) { ctx.moveTo(segs[s][0], segs[s][1]); ctx.lineTo(segs[s + 1][0], segs[s + 1][1]); }
        }
        ctx.stroke();
      }
    }
    function loop() {
      if (!visible) { raf = null; return; }
      t += reduce ? 0 : .016; mx += (tmx - mx) * .06; my += (tmy - my) * .06;
      compute(); draw(); raf = requestAnimationFrame(loop);
    }
    resize(); compute(); draw();
    window.addEventListener("resize", function () { resize(); compute(); draw(); });
    $(".hero").addEventListener("mousemove", function (e) { var r = cv.getBoundingClientRect(); tmx = e.clientX - r.left; tmy = e.clientY - r.top; if (mx < -900) { mx = tmx; my = tmy; } });
    $(".hero").addEventListener("mouseleave", function () { tmx = -999; tmy = -999; });
    if (!reduce) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible && !raf) loop(); }).observe(cv);
    }
  })();

  /* ================= Hero poster: tilt + lens ================= */
  (function heroPoster() {
    var art = $(".hero__art"), poster = $("#heroPoster"), img = $("#heroImg"), lens = $("#lens");
    if (!fine) return;
    var full = false;
    $(".hero").addEventListener("mousemove", function (e) {
      if (!hasG || reduce) return;
      var nx = e.clientX / window.innerWidth - .5, ny = e.clientY / window.innerHeight - .5;
      G.to(poster, { rotateY: nx * 16 - 6, rotateX: -ny * 10 + 2, duration: 1.2, ease: "power3.out" });
      G.to(".float--a", { x: nx * -30, duration: 1.2 }); G.to(".float--b", { x: nx * 40, duration: 1.2 }); G.to(".float--c", { x: nx * -24, duration: 1.2 });
    });
    img.addEventListener("mouseenter", function () {
      if (!full) { full = true; lens.style.backgroundImage = "url('images/sv27-900.jpg')"; var hi = new Image(); hi.onload = function () { lens.style.backgroundImage = "url('" + hi.src + "')"; }; hi.src = "images/sv27-preview.jpg"; }
      art.classList.add("zooming");
    });
    img.addEventListener("mouseleave", function () { art.classList.remove("zooming"); });
    img.addEventListener("mousemove", function (e) {
      var r = img.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, Z = 3.4, h = 100;
      lens.style.transform = "translate(" + (x + 12 - h) + "px," + (y + 12 - h) + "px) scale(1)";
      lens.style.backgroundSize = r.width * Z + "px " + r.height * Z + "px";
      lens.style.backgroundPosition = (-x * Z + h) + "px " + (-y * Z + h) + "px";
    });
  })();

  /* ================= Ticker (velocity-reactive) ================= */
  (function ticker() {
    var tr = $("#ticker"); if (!hasG || !tr || reduce) return;
    var x = 0, dir = -1, speed = 1;
    G.ticker.add(function () {
      var w = tr.scrollWidth / 2; if (!w) return;
      var v = ST.getAll().length ? Math.abs(lastV) : 0;
      speed += ((1 + Math.min(v / 300, 6)) - speed) * .08;
      x += dir * speed * .9; if (x <= -w) x += w; if (x > 0) x -= w;
      G.set(tr, { x: x });
    });
    var lastV = 0;
    ST.create({ trigger: ".ticker", start: "top bottom", end: "bottom top", onUpdate: function (s) { lastV = s.getVelocity(); dir = s.direction === 1 ? -1 : 1; } });
  })();

  /* ================= Split headings into words ================= */
  function splitWords(el) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          var o = document.createElement("span"); o.className = "wd"; var i = document.createElement("span"); i.className = "wi"; i.textContent = part; o.appendChild(i); frag.appendChild(o);
        });
        n.parentNode.replaceChild(frag, n);
      } else if (n.nodeType === 1) splitWords(n);
    });
  }
  if (hasG && !reduce) {
    var css = document.createElement("style");
    css.textContent = ".wd{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em}.wi{display:inline-block;will-change:transform}";
    document.head.appendChild(css);
    $$("main .h-xl, main .h-xxl").forEach(function (h) {
      splitWords(h);
      G.from($$(".wi", h), { yPercent: 115, rotate: 3, duration: 1.2, stagger: .045, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 85%" } });
    });
    $$("main .kicker").forEach(function (k) { G.from(k, { opacity: 0, x: -20, duration: 1, ease: "power3.out", scrollTrigger: { trigger: k, start: "top 90%" } }); });
  }

  /* ================= Trust ================= */
  if (hasG && !reduce) G.from(".trust__names li", { opacity: 0, y: 24, duration: .9, stagger: .05, ease: "power3.out", scrollTrigger: { trigger: ".trust", start: "top 80%" } });

  /* ================= DIVE (pinned zoom) ================= */
  (function dive() {
    var stage = $("#diveStage"), poster = $("#divePoster"), slot = $("#slot"), imprint = $("#imprint"), steps = $$("#diveSteps li"), bar = $("#diveBar"), cta = $("#diveCta");
    function setStep(i) { steps.forEach(function (s, k) { s.classList.toggle("is-on", k === i); }); cta.classList.toggle("show", i === 4); }
    if (!hasG || reduce) { G && G.set && G.set(slot, { xPercent: -50, yPercent: -50 }); imprint.style.opacity = 1; setStep(4); return; }
    G.set(slot, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
    var W = function () { return poster.offsetWidth; }, H = function () { return poster.offsetHeight; };
    function fx(px, s) { return function () { return (.5 - px) * W() * s; }; }
    function fy(py, s) { return function () { return (.5 - py) * H() * s; }; }
    G.set(poster, { scale: .74, rotateX: 26, rotateZ: -7, y: 60, transformOrigin: "50% 50%" });
    var tl = G.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: stage, start: "top top", end: function () { return "+=" + Math.round(window.innerHeight * 4.2); },
        pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
      },
      onUpdate: function () {
        var t = tl.time(), i = t < 1.3 ? 0 : t < 2.6 ? 1 : t < 4.1 ? 2 : t < 5.6 ? 3 : 4;
        bar.style.width = (tl.progress() * 100) + "%";
        setStep(i);
      }
    });
    tl.to(poster, { scale: 1, rotateX: 0, rotateZ: 0, y: 0, x: 0, duration: 1.2 })
      .to(".dive__intro", { opacity: 0, y: -40, duration: .6 }, 1)
      .to(poster, { scale: 2.5, x: fx(.66, 2.5), y: fy(.47, 2.5), duration: 1.3 }, 1.3)
      .to(poster, { scale: 4.4, x: fx(.33, 4.4), y: fy(.555, 4.4), duration: 1.4 }, 2.6)
      .to(slot, { scale: 1, opacity: 1, duration: .5, ease: "back.out(2.2)" }, 3.6)
      .to(poster, { scale: 2.5, x: fx(.5, 2.5), y: fy(.822, 2.5), duration: 1.4 }, 4.1)
      .to(imprint, { opacity: 1, duration: .4 }, 5.1)
      .to(poster, { scale: .92, x: function () { return isMobile() ? 0 : W() * .05; }, y: 0, rotateY: isMobile() ? 0 : -10, duration: 1.4 }, 5.6)
      .to({}, { duration: .5 });
  })();

  /* ================= Bento ================= */
  function countUp(el) {
    var end = +el.dataset.count, o = { v: 0 };
    if (!hasG || reduce) { el.textContent = end.toLocaleString("en-US"); return; }
    ST.create({ trigger: el, start: "top 88%", once: true, onEnter: function () {
      G.to(o, { v: end, duration: 2.2, ease: "power3.out", onUpdate: function () { el.textContent = Math.round(o.v).toLocaleString("en-US"); } });
    } });
  }
  $$("[data-count]").forEach(countUp);
  if (hasG && !reduce) {
    G.from(".tile", { y: 80, opacity: 0, duration: 1.2, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ".bento__grid", start: "top 85%" } });
    G.to("#donut", { strokeDashoffset: 314.16 * .05, duration: 2, ease: "power3.out", scrollTrigger: { trigger: ".tile--c", start: "top 85%" } });
    var stack = $$(".stack img");
    G.set(stack, { xPercent: -50 });
    G.fromTo(stack, { rotate: 0, x: 0 }, { rotate: function (i) { return (i - 1.5) * 9; }, x: function (i) { return (i - 1.5) * 48; }, duration: 1.6, ease: "expo.out", stagger: .05, scrollTrigger: { trigger: ".tile--a", start: "top 75%" } });
    var sp = $("#spark"); if (sp) { var len = sp.getTotalLength(); G.fromTo(sp, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2, ease: "power2.out", scrollTrigger: { trigger: ".tile--e", start: "top 85%" } }); }
    if (fine) $$("[data-tilt]").forEach(function (t) {
      t.addEventListener("mousemove", function (e) { var r = t.getBoundingClientRect(); G.to(t, { rotateY: ((e.clientX - r.left) / r.width - .5) * 6, rotateX: -((e.clientY - r.top) / r.height - .5) * 6, transformPerspective: 900, duration: .6 }); });
      t.addEventListener("mouseleave", function () { G.to(t, { rotateY: 0, rotateX: 0, duration: .8 }); });
    });
  } else { $$(".stack img").forEach(function (im, i) { im.style.transform = "translateX(-50%) translateX(" + (i - 1.5) * 48 + "px) rotate(" + (i - 1.5) * 9 + "deg)"; }); $("#donut").style.strokeDashoffset = 314.16 * .05; }

  /* ================= Region list + globe ================= */
  var selected = "silicon-valley", cat = "all";
  var rlist = $("#rlist");
  REGIONS.forEach(function (r) {
    var li = document.createElement("li"); li.className = r.cat; li.dataset.id = r.id;
    li.innerHTML = '<button type="button"><span class="dot"></span><span class="nm">' + r.name + '</span><span class="pl">' + r.place + "</span></button>";
    li.firstChild.addEventListener("click", function () { selectRegion(r.id); });
    rlist.appendChild(li);
  });
  $$(".tabs [data-cat]").forEach(function (b) {
    b.addEventListener("click", function () {
      cat = b.dataset.cat; $$(".tabs [data-cat]").forEach(function (x) { x.setAttribute("aria-selected", x === b); });
      $$("li", rlist).forEach(function (li) { li.classList.toggle("hide", cat !== "all" && !li.classList.contains(cat)); });
      if (hasG && !reduce) G.from($$("li:not(.hide)", rlist), { opacity: 0, x: -14, duration: .5, stagger: .025 });
    });
  });
  var globe = null;
  function selectRegion(id, quiet) {
    var r = byId[id]; if (!r) return; selected = id;
    $$("li", rlist).forEach(function (li) { li.firstChild.classList.toggle("active", li.dataset.id === id); });
    var card = $("#rcard");
    var upd = function () {
      $("#rcImg").src = "images/" + r.img; $("#rcImg").alt = r.name + " poster";
      $("#rcCat").textContent = (r.cat === "bio" ? "Life Science" : "High Tech") + " · " + r.place;
      $("#rcName").textContent = r.name; $("#rcDesc").textContent = r.desc;
      var b = $("#rcBuy"); b.dataset.sku = r.id; b.hidden = !!r.noProduct;
    };
    if (hasG && !reduce && !quiet) G.timeline().to(card, { opacity: 0, y: 14, duration: .2, onComplete: upd }).to(card, { opacity: 1, y: 0, duration: .5, ease: "expo.out" });
    else upd();
    if (globe) globe.focus(r);
    var pk = $("#pkRegion"); if (pk) { pk.value = id; updateBuilder(); }
    var lr = $("#leadRegion"); if (lr) lr.value = id;
    $(".sticky__txt small").textContent = "2027 · " + r.name;
  }
  $("#rcBuy").addEventListener("click", function () { addToCart(this.dataset.sku); });

  (function makeGlobe() {
    var cv = $("#globe"); if (!cv || typeof d3 === "undefined" || typeof topojson === "undefined") return;
    var ctx = cv.getContext("2d"), S, R, dpr = Math.min(window.devicePixelRatio || 1, 2), dots = [], rot = [100, -25], vel = [0, 0], drag = false, tween = null, visible = false, raf, t0 = performance.now();
    var proj = d3.geoOrthographic().clipAngle(90), path = d3.geoPath(proj, ctx), grat = d3.geoGraticule10();
    function size() { var r = cv.getBoundingClientRect(); S = r.width; cv.width = S * dpr; cv.height = S * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); R = S / 2 * .86; proj.scale(R).translate([S / 2, S / 2]); }
    size(); window.addEventListener("resize", size);
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json").then(function (topo) {
      var land = topojson.feature(topo, topo.objects.land);
      var w = 720, h = 360, off = document.createElement("canvas"); off.width = w; off.height = h;
      var oc = off.getContext("2d"), eq = d3.geoEquirectangular().fitSize([w, h], { type: "Sphere" });
      oc.fillStyle = "#000"; oc.beginPath(); d3.geoPath(eq, oc)(land); oc.fill();
      var data = oc.getImageData(0, 0, w, h).data, step = 1.55;
      for (var lat = -56; lat <= 80; lat += step) {
        var n = Math.max(1, Math.round(360 * Math.cos(lat * Math.PI / 180) / step));
        for (var k = 0; k < n; k++) {
          var lon = -180 + k * 360 / n, p = eq([lon, lat]), x = Math.min(w - 1, Math.max(0, Math.round(p[0]))), y = Math.min(h - 1, Math.max(0, Math.round(p[1])));
          if (data[(y * w + x) * 4 + 3] > 120) dots.push([lon, lat]);
        }
      }
      if (visible && !raf) loop();
    }).catch(function () {});
    var origin = byId["silicon-valley"];
    function draw(now) {
      ctx.clearRect(0, 0, S, S);
      proj.rotate([rot[0], rot[1]]);
      var c = [S / 2, S / 2];
      // halo
      var g = ctx.createRadialGradient(c[0], c[1], R * .9, c[0], c[1], R * 1.2);
      g.addColorStop(0, "rgba(39,107,172,.28)"); g.addColorStop(1, "rgba(39,107,172,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], R * 1.2, 0, 7); ctx.fill();
      var g2 = ctx.createRadialGradient(c[0] - R * .35, c[1] - R * .4, R * .1, c[0], c[1], R);
      g2.addColorStop(0, "#143a5c"); g2.addColorStop(1, "#081828");
      ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(c[0], c[1], R, 0, 7); ctx.fill();
      ctx.beginPath(); path(grat); ctx.strokeStyle = "rgba(143,195,234,.07)"; ctx.lineWidth = .6; ctx.stroke();
      // dots
      var center = [-rot[0], -rot[1]], ds = Math.max(1.1, S / 420);
      for (var i = 0; i < dots.length; i++) {
        var d = d3.geoDistance(dots[i], center); if (d > 1.5708) continue;
        var p = proj(dots[i]), a = .25 + .75 * Math.cos(d);
        ctx.fillStyle = "rgba(170,205,235," + (a * .75).toFixed(3) + ")";
        ctx.fillRect(p[0] - ds / 2, p[1] - ds / 2, ds, ds);
      }
      // arcs from Silicon Valley
      ctx.lineWidth = 1.2; ctx.setLineDash([3, 5]); ctx.lineDashOffset = -(now - t0) * .02;
      REGIONS.forEach(function (r) {
        if (r.id === origin.id || (cat !== "all" && r.cat !== cat)) return;
        ctx.beginPath(); path({ type: "LineString", coordinates: [[origin.lon, origin.lat], [r.lon, r.lat]] });
        ctx.strokeStyle = r.id === selected ? "rgba(244,117,36,.95)" : "rgba(244,117,36,.22)"; ctx.stroke();
      });
      ctx.setLineDash([]);
      // pins
      var pulse = (Math.sin((now - t0) / 380) + 1) / 2;
      REGIONS.forEach(function (r) {
        var d = d3.geoDistance([r.lon, r.lat], center); r._p = null; if (d > 1.5) return;
        var p = proj([r.lon, r.lat]); r._p = p;
        var dim = cat !== "all" && r.cat !== cat, col = r.cat === "bio" ? "63,208,174" : "244,117,36", on = r.id === selected;
        ctx.globalAlpha = dim ? .2 : 1;
        if (on) { ctx.beginPath(); ctx.arc(p[0], p[1], 10 + pulse * 14, 0, 7); ctx.fillStyle = "rgba(" + col + "," + (.35 * (1 - pulse)) + ")"; ctx.fill(); }
        ctx.beginPath(); ctx.arc(p[0], p[1], on ? 6.5 : 4.2, 0, 7); ctx.fillStyle = "rgb(" + col + ")"; ctx.fill();
        ctx.lineWidth = on ? 2.5 : 1.5; ctx.strokeStyle = "#f4eee2"; ctx.stroke();
        if (on || (r._hover && !dim)) {
          ctx.font = "500 " + (S < 500 ? 12 : 14) + "px 'Inter Tight', sans-serif";
          var tw = ctx.measureText(r.name).width, lx = p[0] + 14, ly = p[1] - 14;
          ctx.fillStyle = "rgba(7,19,31,.85)"; roundRect(lx - 8, ly - 15, tw + 16, 24, 12); ctx.fill();
          ctx.fillStyle = "#f4eee2"; ctx.fillText(r.name, lx, ly + 2);
        }
        ctx.globalAlpha = 1;
      });
      ctx.beginPath(); ctx.arc(c[0], c[1], R, 0, 7); ctx.strokeStyle = "rgba(143,195,234,.25)"; ctx.lineWidth = 1; ctx.stroke();
    }
    function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
    function loop(now) {
      now = now || performance.now();
      if (tween) {
        var k = Math.min(1, (now - tween.t) / 1300), e = 1 - Math.pow(1 - k, 4);
        rot[0] = tween.from[0] + (tween.to[0] - tween.from[0]) * e; rot[1] = tween.from[1] + (tween.to[1] - tween.from[1]) * e;
        if (k >= 1) tween = null;
      } else if (!drag) {
        rot[0] += vel[0]; rot[1] = Math.max(-60, Math.min(60, rot[1] + vel[1])); vel[0] *= .94; vel[1] *= .94;
        if (Math.abs(vel[0]) < .05 && !reduce) rot[0] += .06;
      }
      $("#hudCoord").textContent = Math.abs(rot[1]).toFixed(2) + "° " + (rot[1] <= 0 ? "N" : "S") + " · " + Math.abs(((-rot[0] + 540) % 360) - 180).toFixed(2) + "° " + ((((-rot[0] + 540) % 360) - 180) < 0 ? "W" : "E");
      draw(now);
      raf = visible ? requestAnimationFrame(loop) : null;
    }
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }, { rootMargin: "200px" }).observe(cv);
    var last = null, moved = 0;
    cv.addEventListener("pointerdown", function (e) { drag = true; tween = null; last = [e.clientX, e.clientY]; moved = 0; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", function (e) {
      var r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
      REGIONS.forEach(function (rg) { rg._hover = rg._p && Math.hypot(rg._p[0] - mx, rg._p[1] - my) < 16; });
      cv.style.cursor = REGIONS.some(function (rg) { return rg._hover; }) ? "pointer" : "";
      if (!drag) return;
      var dx = e.clientX - last[0], dy = e.clientY - last[1]; moved += Math.abs(dx) + Math.abs(dy);
      var k = 120 / R; vel = [dx * k * .5, -dy * k * .5]; rot[0] += dx * k * .5; rot[1] = Math.max(-60, Math.min(60, rot[1] - dy * k * .5)); last = [e.clientX, e.clientY];
    });
    cv.addEventListener("pointerup", function (e) {
      drag = false;
      if (moved < 6) {
        var r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, best = null, bd = 22;
        REGIONS.forEach(function (rg) { if (!rg._p) return; var d = Math.hypot(rg._p[0] - mx, rg._p[1] - my); if (d < bd) { bd = d; best = rg; } });
        if (best) selectRegion(best.id);
      }
    });
    globe = { focus: function (r) {
      var target = [-r.lon, -r.lat * .75], from = rot.slice();
      var dl = ((target[0] - from[0]) % 360 + 540) % 360 - 180; target[0] = from[0] + dl;
      tween = { from: from, to: target, t: performance.now() }; vel = [0, 0];
    } };
    rot = [-origin.lon + 30, -origin.lat * .6];
  })();
  selectRegion("silicon-valley", true);

  /* ================= Packages ================= */
  var pkRegion = $("#pkRegion"), leadRegion = $("#leadRegion");
  function fillSelect(sel) {
    [["High Tech", "tech"], ["Life Science", "bio"]].forEach(function (g) {
      var og = document.createElement("optgroup"); og.label = g[0];
      REGIONS.filter(function (r) { return r.cat === g[1]; }).forEach(function (r) { var o = document.createElement("option"); o.value = r.id; o.textContent = r.name; og.appendChild(o); });
      sel.appendChild(og);
    });
    sel.value = "silicon-valley";
  }
  fillSelect(pkRegion); fillSelect(leadRegion);
  var adMaps = $("#adMaps");
  function state() {
    var t = $("input[name=tier]:checked"), total = +t.dataset.price;
    $$(".addons input[type=checkbox]").forEach(function (c) { if (c.checked && !c.disabled) total += +c.dataset.price; });
    return { region: byId[pkRegion.value] || byId["silicon-valley"], tier: t.dataset.name, total: total };
  }
  function updateBuilder() {
    if (!pkRegion || !pkRegion.value) return;
    var t = $("input[name=tier]:checked"), basic = t.value === "basic";
    adMaps.disabled = basic; if (basic) adMaps.checked = false;
    adMaps.closest(".addon").classList.toggle("disabled", basic);
    var s = state(), el = $("#sumTotal"), from = +(el.dataset.v || s.total);
    $("#sumRegion").textContent = s.region.name; $("#pkRegionName").textContent = s.region.name; $("#sumTier").textContent = s.tier;
    el.dataset.v = s.total;
    if (hasG && !reduce && from !== s.total) { var o = { v: from }; G.to(o, { v: s.total, duration: .7, ease: "power3.out", onUpdate: function () { el.textContent = money(o.v); } }); }
    else el.textContent = money(s.total);
    $("#sumDay").textContent = money2(s.total / 365);
  }
  $$("input[name=tier], .addons input").forEach(function (i) { i.addEventListener("change", updateBuilder); });
  pkRegion.addEventListener("change", function () { selectRegion(pkRegion.value, true); });
  $("#rcAdvertise").addEventListener("click", function () { pkRegion.value = selected; updateBuilder(); });
  updateBuilder();
  $$("[data-spot]").forEach(function (c) {
    c.addEventListener("mousemove", function (e) { var r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px"); });
  });
  if (hasG && !reduce) {
    G.from(".tier", { y: 70, opacity: 0, duration: 1.2, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".tiers", start: "top 85%" } });
    G.from(".checkout > *", { y: 60, opacity: 0, duration: 1.2, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".checkout", start: "top 88%" } });
  }

  /* ================= Collection (horizontal) ================= */
  var track = $("#colTrack");
  FEATURED.forEach(function (sku) {
    var p = prodBySku[sku]; if (!p) return;
    var a = document.createElement("article"); a.className = "pcard";
    a.innerHTML = '<div class="pcard__img" data-cursor="Add"><span class="pcard__tag ' + p.cat + '">' + (p.cat === "bio" ? "Life Science" : p.cat === "gift" ? "Gift" : "High Tech") + '</span><img src="images/' + p.img + '" alt="' + p.name + '" loading="lazy" width="345" height="495"><button class="btn btn--ink btn--sm pcard__add" data-add="' + p.sku + '"><span>Add to cart · $' + p.price + '</span></button></div><div class="pcard__row"><h3>' + p.short + '</h3><span class="pcard__price">$' + p.price + "</span></div>";
    track.appendChild(a);
  });
  var end = document.createElement("article"); end.className = "pcard pcard--end";
  end.innerHTML = '<div><span class="mono" style="color:var(--orange)">+ 7 more maps</span><h3>Every region, one store.</h3><p>Silicon Desert, DFW Technoplex, Tech Triangle, Global BIO, BIO Europe, Silicon World and Bioscience Midwest.</p></div><a href="#explorer" class="btn btn--orange"><span>Browse all regions</span></a>';
  track.appendChild(end);
  if (hasG && !reduce) {
    var mm = G.matchMedia();
    mm.add("(min-width: 901px)", function () {
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      G.to(track, { x: function () { return -dist(); }, ease: "none", scrollTrigger: { trigger: ".collection", start: "top top", end: function () { return "+=" + dist(); }, pin: ".collection__pin", scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
      G.utils.toArray(".pcard__img img").forEach(function (im) { G.fromTo(im, { rotate: -4 }, { rotate: 4, ease: "none", scrollTrigger: { trigger: ".collection", start: "top top", end: function () { return "+=" + dist(); }, scrub: true } }); });
    });
  }

  /* ================= Wild parallax ================= */
  if (hasG && !reduce) {
    $$(".wf").forEach(function (f, i) {
      var inn = $(".wf__in", f), im = $("img", f);
      G.fromTo(inn, { clipPath: "inset(18% 12% 18% 12% round 14px)" }, { clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: f, start: "top 88%" } });
      G.fromTo(im, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: f, start: "top bottom", end: "bottom top", scrub: true } });
    });
  } else $$(".wf img").forEach(function (i) { i.style.transform = "none"; });

  /* ================= Voices ================= */
  (function voices() {
    var vs = $$(".voice"), dotsWrap = $("#voiceDots"), cur = 0, timer, prog;
    vs.forEach(function (v, i) {
      var b = document.createElement("button"); b.setAttribute("role", "tab"); b.setAttribute("aria-label", "Testimonial " + (i + 1)); b.innerHTML = "<i></i>";
      b.addEventListener("click", function () { show(i); }); dotsWrap.appendChild(b);
    });
    var dots = $$("button", dotsWrap);
    function show(i) {
      cur = (i + vs.length) % vs.length;
      vs.forEach(function (v, k) { v.classList.toggle("is-on", k === cur); }); $("#sealNum").textContent = "0" + (cur + 1);
      dots.forEach(function (d, k) { d.setAttribute("aria-selected", k === cur); var bar = d.firstChild; if (hasG) { G.killTweensOf(bar); G.set(bar, { scaleX: k < cur ? 1 : 0 }); } });
      if (hasG && !reduce) {
        G.from($$(".wi, blockquote", vs[cur]).slice(0, 1), { opacity: 0, y: 30, duration: 1, ease: "expo.out" });
        prog = G.to(dots[cur].firstChild, { scaleX: 1, duration: 7, ease: "none", onComplete: function () { show(cur + 1); } });
      }
    }
    $("#vPrev").addEventListener("click", function () { show(cur - 1); });
    $("#vNext").addEventListener("click", function () { show(cur + 1); });
    $("#voices").addEventListener("mouseenter", function () { if (prog) prog.pause(); });
    $("#voices").addEventListener("mouseleave", function () { if (prog) prog.resume(); });
    show(0);
  })();

  /* ================= Steps / FAQ ================= */
  if (hasG && !reduce) {
    G.from(".step", { y: 60, opacity: 0, duration: 1.1, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: ".steps", start: "top 85%" } });
    G.from(".acc details", { y: 30, opacity: 0, duration: 1, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: ".acc", start: "top 85%" } });
  }
  $$(".acc details").forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      $$(".acc details").forEach(function (o) { if (o !== d) o.open = false; });
      if (hasG && !reduce) G.from($("div", d), { height: 0, opacity: 0, duration: .6, ease: "expo.out", clearProps: "height,opacity" });
      if (ST) setTimeout(function () { ST.refresh(); }, 650);
    });
  });

  /* ================= Cart ================= */
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem("sm-cart2") || "{}") || {}; } catch (e) { cart = {}; }
  function saveCart() { try { localStorage.setItem("sm-cart2", JSON.stringify(cart)); } catch (e) {} }
  function renderCart() {
    var box = $("#cartItems"), n = 0, sub = 0; box.innerHTML = "";
    Object.keys(cart).forEach(function (sku) {
      var p = prodBySku[sku]; if (!p || cart[sku] < 1) { delete cart[sku]; return; }
      n += cart[sku]; sub += cart[sku] * p.price;
      var row = document.createElement("div"); row.className = "citem";
      row.innerHTML = '<img src="images/' + p.img + '" alt=""><div><b>' + p.name + "</b><small>" + money(p.price) + ' each</small><br><span class="qty"><button data-q="-1" aria-label="Decrease quantity">−</button><span>' + cart[sku] + '</span><button data-q="1" aria-label="Increase quantity">+</button></span></div><b>' + money(cart[sku] * p.price) + "</b>";
      $$("[data-q]", row).forEach(function (b) { b.addEventListener("click", function () { cart[sku] += +b.dataset.q; saveCart(); renderCart(); }); });
      box.appendChild(row);
    });
    if (!n) box.innerHTML = '<div class="drawer__empty"><b>Your cart is empty.</b>Every 2026 map is $25.</div>';
    $("#cartCount").textContent = n; $("#cartBtn").setAttribute("aria-label", "Open cart, " + n + " items");
    $("#cartSub").textContent = money2(sub);
    $("#cartUpsell").hidden = !n || !!cart["sv-puzzle"];
    $("#checkoutBtn").disabled = !n;
  }
  function addToCart(sku) {
    if (!prodBySku[sku]) return;
    cart[sku] = (cart[sku] || 0) + 1; saveCart(); renderCart();
    var b = $("#cartBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
    nav.classList.remove("is-hidden");
    if (!drawer.classList.contains("open")) openDrawer(); else toast(prodBySku[sku].name + " added");
  }
  document.addEventListener("click", function (e) { var a = e.target.closest("[data-add]"); if (a) { e.preventDefault(); addToCart(a.dataset.add); } });
  var drawer = $("#drawer");
  function openDrawer() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); lock(); setTimeout(function () { $(".circ", drawer).focus(); }, 60); }
  function closeDrawer() { if (!drawer.classList.contains("open")) return; drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); unlock(); }
  $("#cartBtn").addEventListener("click", openDrawer);
  $$("[data-close]", drawer).forEach(function (b) { b.addEventListener("click", closeDrawer); });
  $("#checkoutBtn").addEventListener("click", function () { toast("Prototype: this opens the store's secure checkout"); });
  renderCart();

  /* ================= Reserve modal ================= */
  var modal = $("#modal"), lastFocus;
  function openModal() {
    var s = state(); lastFocus = document.activeElement;
    $("#mRegion").textContent = s.region.name;
    var adds = $$(".addons input:checked").map(function (c) { return c.closest(".addon").querySelector("b").textContent; });
    $("#mSum").textContent = s.tier + " · " + money(s.total) + " first year" + (adds.length ? " · incl. " + adds.join(", ") : "");
    $(".modal__form").hidden = false; $(".modal__ok").hidden = true;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); lock();
    setTimeout(function () { $("#r-name").focus(); }, 120);
  }
  function closeModal() { if (!modal.classList.contains("open")) return; modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); unlock(); if (lastFocus) lastFocus.focus(); }
  $("#reserveBtn").addEventListener("click", openModal);
  $$("[data-mclose]").forEach(function (b) { b.addEventListener("click", closeModal); });
  function validate(form) {
    var ok = true;
    $$("input[required]", form).forEach(function (i) {
      var bad = !i.value.trim() || (i.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value));
      i.classList.toggle("invalid", bad); if (bad && ok) { i.focus(); ok = false; }
    });
    return ok;
  }
  var converted = false;
  $("#reserveForm").addEventListener("submit", function (e) {
    e.preventDefault(); if (!validate(this)) return; converted = true;
    $(".modal__form").hidden = true; $(".modal__ok").hidden = false;
    if (hasG) G.from(".modal__ok .okmark", { scale: 0, rotate: -120, duration: .8, ease: "back.out(2)" });
  });

  /* ================= Lead form ================= */
  function setInterest(v) { var s = $("#leadInterest"); $$("option", s).forEach(function (o) { if (o.textContent === v) s.value = o.value; }); }
  $("#leadForm").addEventListener("submit", function (e) {
    e.preventDefault(); if (!validate(this)) return; converted = true;
    $("#okRegion").textContent = byId[leadRegion.value].name;
    var ok = $(".form__ok"); ok.hidden = false;
    if (hasG) G.from(ok, { opacity: 0, scale: .96, duration: .6, ease: "expo.out" });
  });

  /* ================= Exit intent ================= */
  var exitEl = $("#exit"), armed = false;
  setTimeout(function () { armed = true; }, 15000);
  function openExit() { exitEl.classList.add("open"); exitEl.setAttribute("aria-hidden", "false"); lock(); store.set("sm-exit", "1"); }
  function closeExit() { if (!exitEl.classList.contains("open")) return; exitEl.classList.remove("open"); exitEl.setAttribute("aria-hidden", "true"); unlock(); }
  if (fine) document.addEventListener("mouseout", function (e) {
    if (!armed || converted || e.relatedTarget || e.clientY > 10 || store.get("sm-exit") || locks) return;
    openExit();
  });
  $$("[data-xclose]").forEach(function (b) { b.addEventListener("click", closeExit); });

  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeMenu(); closeDrawer(); closeModal(); closeExit(); } });

  /* ================= Sticky CTA ================= */
  var sticky = $("#sticky");
  function stickyCheck() {
    var y = window.scrollY, vh = window.innerHeight;
    var hero = $(".hero"), pk = $("#packages"), fin = $("#contact");
    var past = y > hero.offsetHeight * .9;
    var inPk = pk.getBoundingClientRect().top < vh * .8 && pk.getBoundingClientRect().bottom > vh * .2;
    var atEnd = fin.getBoundingClientRect().top < vh * .9;
    var dv = $("#dive").getBoundingClientRect(), inDive = dv.top < vh * .5 && dv.bottom > vh * .5;
    sticky.classList.toggle("show", past && !inPk && !atEnd && !inDive && !menuOpen);
  }
  window.addEventListener("scroll", stickyCheck, { passive: true });

  /* ================= Footer region links ================= */
  REGIONS.forEach(function (r) {
    var a = document.createElement("a"); a.href = "#explorer"; a.dataset.region = r.id; a.textContent = r.name;
    (r.cat === "bio" ? $("#footBio") : $("#footTech")).appendChild(a);
  });
  if (hasG && !reduce) G.from(".foot__cta h2", { yPercent: 40, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".foot__cta", start: "top 95%" } });

  window.addEventListener("load", function () { if (ST) ST.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (ST) ST.refresh(); });
})();
