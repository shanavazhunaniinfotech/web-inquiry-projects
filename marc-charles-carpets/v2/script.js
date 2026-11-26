/* Marc Charles Carpets — Version B */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (reduced) root.classList.add("reduced");
  if (!hasGsap) root.classList.add("no-gsap");
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function track(ev, data) { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event: ev }, data || {})); }
  document.addEventListener("click", function (e) { var t = e.target.closest("[data-track]"); if (t) track(t.getAttribute("data-track")); });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Open / closed (Europe/London) ---------- */
  (function () {
    var hours = { 1: [510, 1020], 2: [510, 1020], 3: [510, 1020], 4: [510, 1020], 5: [510, 1020], 6: [510, 960] };
    var names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var d, m;
    try {
      var p = {}; new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      d = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday); m = (parseInt(p.hour, 10) % 24) * 60 + parseInt(p.minute, 10);
    } catch (e) { var n = new Date(); d = n.getDay(); m = n.getHours() * 60 + n.getMinutes(); }
    var f = function (x) { var h = Math.floor(x / 60), mm = x % 60, ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return h + (mm ? "." + (mm < 10 ? "0" : "") + mm : "") + ap; };
    var t = hours[d], open = t && m >= t[0] && m < t[1], s, l;
    if (open) { s = "Open now · till " + f(t[1]); l = "Open now — until " + f(t[1]) + " today"; }
    else {
      var lab;
      if (t && m < t[0]) lab = "today " + f(t[0]);
      else { var i, nd; for (i = 1; i <= 7; i++) { nd = (d + i) % 7; if (hours[nd]) break; } lab = (i === 1 ? "tomorrow " : names[nd] + " ") + f(hours[nd][0]); }
      s = "Opens " + lab; l = "Closed now — opens " + lab + ". Request a call-back below.";
    }
    $$("[data-open-dot]").forEach(function (e) { e.classList.toggle("is-open", !!open); });
    $$("[data-open-short]").forEach(function (e) { e.textContent = s; });
    $$("[data-open-long]").forEach(function (e) { e.textContent = l; });
  })();

  /* ---------- Lenis ---------- */
  var lenis = null;
  if (!reduced && window.Lenis && window.innerWidth > 900) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    if (hasGsap) { lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else { (function r(t) { lenis.raf(t); requestAnimationFrame(r); })(0); }
  }
  function goTo(target) {
    if (lenis) lenis.scrollTo(target, { offset: -90 });
    else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }

  /* ---------- Nav ---------- */
  var nav = $("[data-nav]"), mcta = $("[data-mcta]"), lastY = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (!document.body.classList.contains("is-locked")) {
      if (y > 400 && y > lastY + 6) nav.classList.add("is-hidden");
      else if (y < lastY - 6 || y < 400) nav.classList.remove("is-hidden");
    }
    mcta.classList.toggle("is-on", y > 600);
    lastY = y;
  }, { passive: true });

  var burger = $("[data-burger]"), sheet = $("[data-sheet]");
  function setSheet(o) {
    burger.setAttribute("aria-expanded", o ? "true" : "false");
    sheet.classList.toggle("is-open", o); sheet.setAttribute("aria-hidden", o ? "false" : "true");
    document.body.classList.toggle("is-locked", o);
    if (lenis) { if (o) lenis.stop(); else lenis.start(); }
  }
  burger.addEventListener("click", function () { setSheet(burger.getAttribute("aria-expanded") !== "true"); });

  /* ---------- Anchor links + presets into the booking wizard ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute("href"); if (id.length < 2) return;
    var el = document.querySelector(id); if (!el) return;
    e.preventDefault();
    if (sheet.classList.contains("is-open")) setSheet(false);
    var preset = a.getAttribute("data-preset") || (id === "#book" ? a.getAttribute("data-room") : null);
    if (preset) wizPreset(preset);
    goTo(el);
  });

  /* ---------- Marquee duplicate ---------- */
  $$("[data-mq] .mq__t").forEach(function (t) { t.innerHTML += t.innerHTML; });

  /* ================= RUNNER DESIGNER ================= */
  var rdState = { carpet: "sisal", tape: "#1c1f38", rods: "brass", stair: "white" };
  var rdLabels = { carpet: "Natural sisal", tape: "Navy tape", rods: "Brass rods", stair: "White risers, oak treads" };
  var NS = "http://www.w3.org/2000/svg";
  var svg = $("[data-rd-svg]");
  function el(tag, attrs, parent) { var n = document.createElementNS(NS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; }
  var STAIRS = {
    white: { riser: "#f5f2ec", tread: ["#c99c6c", "#a87a4c"], wall: "#efe9df" },
    oak: { riser: "#b98b5d", tread: ["#cfa475", "#a9794a"], wall: "#efe9df" },
    dark: { riser: "#2f3242", tread: ["#3d4052", "#2a2c3a"], wall: "#e8e2d8" }
  };
  var RODS = { brass: ["#f3d79a", "#b8893f", "#7a5a23"], chrome: ["#ffffff", "#b9bec7", "#6d727c"], black: ["#5a5a5e", "#222", "#000"] };
  function drawRunner() {
    if (!svg) return;
    while (svg.lastChild && svg.lastChild.nodeName !== "title") svg.removeChild(svg.lastChild);
    var st = STAIRS[rdState.stair];
    var defs = el("defs", {}, svg);
    var pat = el("pattern", { id: "rdPat", patternContentUnits: "objectBoundingBox", width: 1, height: 1 }, defs);
    var im = el("image", { width: 1, height: 1, preserveAspectRatio: "none" }, pat);
    im.setAttribute("href", "img/sw-" + rdState.carpet + ".jpg");
    var tg = el("linearGradient", { id: "rdTread", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el("stop", { offset: 0, "stop-color": st.tread[1] }, tg); el("stop", { offset: 1, "stop-color": st.tread[0] }, tg);
    var sh = el("linearGradient", { id: "rdShade", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el("stop", { offset: 0, "stop-color": "#000", "stop-opacity": .32 }, sh); el("stop", { offset: .4, "stop-color": "#000", "stop-opacity": 0 }, sh);
    var wl = el("linearGradient", { id: "rdWall", x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
    el("stop", { offset: 0, "stop-color": "#000", "stop-opacity": .14 }, wl); el("stop", { offset: .22, "stop-color": "#000", "stop-opacity": 0 }, wl);
    el("stop", { offset: .78, "stop-color": "#000", "stop-opacity": 0 }, wl); el("stop", { offset: 1, "stop-color": "#000", "stop-opacity": .14 }, wl);
    if (rdState.rods !== "none") {
      var rg = el("linearGradient", { id: "rdRod", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      var rc = RODS[rdState.rods];
      el("stop", { offset: 0, "stop-color": rc[0] }, rg); el("stop", { offset: .5, "stop-color": rc[1] }, rg); el("stop", { offset: 1, "stop-color": rc[2] }, rg);
    }
    el("rect", { x: 0, y: 0, width: 600, height: 640, fill: st.wall }, svg);
    // floor
    el("rect", { x: 0, y: 596, width: 600, height: 44, fill: "url(#rdTread)" }, svg);
    var N = 9, cx = 300, yb = 600, g = el("g", {}, svg);
    var rw = .6;
    for (var i = 0; i < N; i++) {
      var s = 1 - i * .068, sn = 1 - (i + 1) * .068;
      var W = 500 * s, Wn = 500 * sn, h = 60 * s, t = 21 * s;
      var x0 = cx - W / 2, yr = yb - h;
      // riser
      el("rect", { x: x0, y: yr, width: W, height: h, fill: st.riser }, g);
      // tread (trapezoid)
      el("polygon", { points: [x0, yr, x0 + W, yr, cx + Wn / 2, yr - t, cx - Wn / 2, yr - t].join(" "), fill: "url(#rdTread)" }, g);
      // runner on riser + tread
      var R = W * rw, Rn = Wn * rw;
      el("rect", { x: cx - R / 2, y: yr, width: R, height: h, fill: "url(#rdPat)" }, g);
      el("polygon", { points: [cx - R / 2, yr, cx + R / 2, yr, cx + Rn / 2, yr - t, cx - Rn / 2, yr - t].join(" "), fill: "url(#rdPat)" }, g);
      el("polygon", { points: [cx - R / 2, yr, cx + R / 2, yr, cx + Rn / 2, yr - t, cx - Rn / 2, yr - t].join(" "), fill: "#fff", "fill-opacity": .12 }, g);
      // border tape
      if (rdState.tape !== "none") {
        var b = R * .07, bn = Rn * .07;
        [[-1], [1]].forEach(function (sd) {
          var side = sd[0];
          var ox = side < 0 ? cx - R / 2 : cx + R / 2 - b, oxn = side < 0 ? cx - Rn / 2 : cx + Rn / 2 - bn;
          el("rect", { x: ox, y: yr, width: b, height: h, fill: rdState.tape }, g);
          el("polygon", { points: [ox, yr, ox + b, yr, oxn + bn, yr - t, oxn, yr - t].join(" "), fill: rdState.tape }, g);
        });
      }
      // shadow under nosing
      el("rect", { x: x0, y: yr, width: W, height: h, fill: "url(#rdShade)" }, g);
      // nosing highlight
      el("line", { x1: x0, y1: yr, x2: x0 + W, y2: yr, stroke: "#fff", "stroke-opacity": .35, "stroke-width": 1 }, g);
      // rods at riser foot
      if (rdState.rods !== "none") {
        var rl = R / 2 + 14 * s, ry = yb - 6 * s, rh = 6 * s;
        el("rect", { x: cx - rl, y: ry, width: rl * 2, height: rh, rx: rh / 2, fill: "url(#rdRod)" }, g);
        el("circle", { cx: cx - rl, cy: ry + rh / 2, r: rh * .85, fill: "url(#rdRod)" }, g);
        el("circle", { cx: cx + rl, cy: ry + rh / 2, r: rh * .85, fill: "url(#rdRod)" }, g);
      }
      yb = yr - t;
    }
    // landing wall above
    el("rect", { x: 0, y: 0, width: 600, height: 640, fill: "url(#rdWall)" }, svg);
    var sum = $("[data-rd-summary]");
    if (sum) sum.textContent = rdLabels.carpet + " · " + rdLabels.tape + " · " + rdLabels.rods;
  }
  $$("[data-rd-opt]").forEach(function (grp) {
    var key = grp.getAttribute("data-rd-opt");
    $$("button", grp).forEach(function (b) {
      b.addEventListener("click", function () {
        $$("button", grp).forEach(function (x) { x.classList.remove("is-on"); x.setAttribute("aria-pressed", "false"); });
        b.classList.add("is-on"); b.setAttribute("aria-pressed", "true");
        rdState[key] = b.getAttribute("data-v"); rdLabels[key] = b.getAttribute("data-label");
        drawRunner();
        if (hasGsap && !reduced) gsap.fromTo(svg, { scale: .985, opacity: .6 }, { scale: 1, opacity: 1, duration: .5, ease: "power3.out" });
        track("designer_change", { option: key, value: rdState[key] });
      });
    });
  });
  drawRunner();
  var rdCta = $("[data-rd-cta]");
  if (rdCta) rdCta.addEventListener("click", function () {
    wizPreset("Stair runner", "Runner design: " + rdLabels.carpet + ", " + rdLabels.tape + ", " + rdLabels.rods + ", stairs: " + rdLabels.stair + ".");
  });

  /* ================= BOOKING WIZARD ================= */
  var wiz = $("[data-wiz]"), form = $("[data-wiz-form]"), step = 1;
  var nextB = $("[data-wiz-next]"), backB = $("[data-wiz-back]"), subB = $("[data-wiz-submit]");
  function paneValid(n) {
    if (n === 1) return !!$('input[name="project"]:checked', form);
    if (n === 2) return !!$('input[name="when"]:checked', form);
    return true;
  }
  function showStep(n) {
    step = n;
    $$(".wiz__pane", form).forEach(function (p) { p.classList.toggle("is-on", +p.getAttribute("data-pane") === n); });
    $$(".wiz__steps span", wiz).forEach(function (s, i) { s.classList.toggle("is-on", i + 1 === n); s.classList.toggle("is-done", i + 1 < n); });
    backB.hidden = n === 1; nextB.hidden = n === 3; subB.hidden = n !== 3;
    nextB.disabled = !paneValid(n);
    if (n === 3 && window.innerWidth > 900) setTimeout(function () { var i = $('input[name="name"]', form); if (i) i.focus({ preventScroll: true }); }, 300);
  }
  function wizPreset(project, note) {
    if (!form) return;
    var match = $$('input[name="project"]', form).filter(function (r) { return r.value === project; })[0];
    if (match) { match.checked = true; if (step === 1) showStep(2); }
    if (note) { var t = $("[data-wiz-notes]", form); if (t) t.value = note; }
  }
  if (form) {
    $$('input[type="radio"]', form).forEach(function (r) {
      r.addEventListener("change", function () {
        nextB.disabled = !paneValid(step);
        setTimeout(function () { if (step < 3 && paneValid(step)) showStep(step + 1); }, 280);
      });
    });
    nextB.addEventListener("click", function () { if (paneValid(step)) showStep(step + 1); });
    backB.addEventListener("click", function () { if (step > 1) showStep(step - 1); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("[required]", form).forEach(function (inp) {
        var v = inp.value.trim(), bad = !v || (inp.type === "tel" && v.replace(/\D/g, "").length < 10);
        inp.closest(".f").classList.toggle("is-error", bad);
        if (bad && ok) { inp.focus(); ok = false; }
      });
      if (!ok) return;
      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; });
      track("generate_lead", { project: data.project, when: data.when });
      form.hidden = true; $(".wiz__head", wiz).hidden = true;
      var okEl = $("[data-wiz-ok]", wiz); okEl.hidden = false;
      if (hasGsap && !reduced) gsap.from(okEl.children, { y: 20, opacity: 0, stagger: .08, duration: .6, ease: "power3.out" });
    });
    $$("input", form).forEach(function (i) { i.addEventListener("input", function () { var f = i.closest(".f"); if (f) f.classList.remove("is-error"); }); });
  }

  /* ================= REVIEWS ================= */
  (function () {
    var qs = $$("[data-rv] .rv__q"); if (!qs.length) return;
    var i = 0, cnt = $("[data-rv-count]"), timer;
    function go(n) { qs[i].classList.remove("is-on"); i = (n + qs.length) % qs.length; qs[i].classList.add("is-on"); cnt.textContent = ("0" + (i + 1)).slice(-2) + " / " + ("0" + qs.length).slice(-2); }
    function auto() { clearInterval(timer); timer = setInterval(function () { if (!document.hidden) go(i + 1); }, 6500); }
    $("[data-rv-next]").addEventListener("click", function () { go(i + 1); auto(); });
    $("[data-rv-prev]").addEventListener("click", function () { go(i - 1); auto(); });
    auto();
  })();

  /* ================= COLLECTION PEEK (desktop) ================= */
  (function () {
    var peek = $("[data-peek]"), list = $("[data-index]");
    if (!peek || !list || !hasGsap || !window.matchMedia("(hover: hover) and (min-width: 900px)").matches) return;
    var img = $("img", peek);
    var qx = gsap.quickTo(peek, "x", { duration: .6, ease: "power3" }), qy = gsap.quickTo(peek, "y", { duration: .6, ease: "power3" });
    window.addEventListener("mousemove", function (e) { qx(e.clientX + 30); qy(e.clientY - 190); });
    $$("a", list).forEach(function (a) {
      a.addEventListener("mouseenter", function () { img.src = a.getAttribute("data-img"); gsap.to(peek, { opacity: 1, scale: 1, rotate: -3, duration: .5, ease: "power3.out" }); });
    });
    list.addEventListener("mouseleave", function () { gsap.to(peek, { opacity: 0, scale: .6, rotate: 0, duration: .4, ease: "power3.in" }); });
  })();

  /* ================= "VIEW" CURSOR on gallery ================= */
  (function () {
    var c = $("[data-cursor]"), cols = $("[data-cols]");
    if (!c || !cols || !hasGsap || !window.matchMedia("(hover: hover) and (min-width: 900px)").matches) return;
    var qx = gsap.quickTo(c, "x", { duration: .35, ease: "power3" }), qy = gsap.quickTo(c, "y", { duration: .35, ease: "power3" });
    window.addEventListener("mousemove", function (e) { qx(e.clientX); qy(e.clientY); });
    $$("img", cols).forEach(function (im) {
      im.addEventListener("mouseenter", function () { gsap.to(c, { scale: 1, duration: .35 }); });
      im.addEventListener("mouseleave", function () { gsap.to(c, { scale: 0, duration: .3 }); });
    });
  })();

  /* Magnetic */
  if (hasGsap && !reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("mousemove", function (e) { var r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .3, duration: .4 }); });
      b.addEventListener("mouseleave", function () { gsap.to(b, { x: 0, y: 0, duration: .7, ease: "elastic.out(1,.4)" }); });
    });
  }

  /* ================= GSAP SCENES ================= */
  if (!hasGsap || reduced) return;
  gsap.registerPlugin(ScrollTrigger);

  // Split headings
  $$("[data-split]").forEach(function (h) {
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var fr = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { fr.appendChild(document.createTextNode(" ")); return; }
            var o = document.createElement("span"); o.className = "w"; var i = document.createElement("span"); i.textContent = w; o.appendChild(i); fr.appendChild(o);
          });
          n.parentNode.replaceChild(fr, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(h);
    gsap.from($$(".w > span", h), { yPercent: 110, rotate: 4, duration: 1.1, ease: "power4.out", stagger: .05, scrollTrigger: { trigger: h, start: "top 86%" } });
  });

  // Hero intro
  gsap.timeline({ defaults: { ease: "power4.out" } })
    .from(".hero__h .r", { yPercent: 105, duration: 1.4, stagger: .12 })
    .from(".hero__meta .chip", { y: 16, opacity: 0, stagger: .08, duration: .8 }, "-=1.1")
    .from(".hero__sub > *", { y: 24, opacity: 0, stagger: .1, duration: 1 }, "-=1")
    .from(".nav__pill", { y: -30, opacity: 0, duration: 1 }, "-=1.2")
    .from("[data-hero-window]", { y: 120, duration: 1.6 }, "-=1.3")
    .from("[data-hero-img]", { scale: 1.35, duration: 2 }, "<")
    .from("[data-float]", { y: 40, opacity: 0, stagger: .12, duration: 1 }, "-=1.2");

  // Hero expand on scroll
  var stage = $("[data-hero-stage]");
  var mm = gsap.matchMedia();
  mm.add({ d: "(min-width: 768px)", m: "(max-width: 767px)" }, function (ctx) {
    var inset = ctx.conditions.d ? "inset(0px 40px round 28px)" : "inset(0px 16px round 24px)";
    var tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: "top top", end: "+=90%", scrub: .6, pin: true, anticipatePin: 1 } });
    tl.fromTo("[data-hero-window]", { clipPath: inset }, { clipPath: "inset(0px 0px round 0px)", ease: "none" }, 0)
      .fromTo("[data-hero-img]", { scale: 1.12 }, { scale: 1, ease: "none" }, 0)
      .to("[data-float]", { y: -60, opacity: 0, stagger: .05, ease: "none", duration: .5 }, 0)
      .from("[data-hero-over] > *", { y: 50, opacity: 0, stagger: .1, duration: .6, ease: "none" }, .3);
  });

  // Scroll-lit statement
  (function () {
    var t = $("[data-lit]"); if (!t) return;
    var words = t.textContent.trim().split(/\s+/);
    t.innerHTML = words.map(function (w) { return '<span class="lw">' + w + "</span>"; }).join(" ");
    gsap.to($$(".lw", t), { opacity: 1, stagger: .1, ease: "none", scrollTrigger: { trigger: t, start: "top 80%", end: "bottom 45%", scrub: true } });
  })();

  // Counters
  $$("[data-count]").forEach(function (el) {
    var end = +el.getAttribute("data-count"), from = +(el.getAttribute("data-from") || 0), o = { v: from };
    gsap.to(o, { v: end, duration: 2, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%" }, onUpdate: function () { el.textContent = Math.round(o.v); } });
  });

  // Collections rows
  gsap.from(".index li", { y: 40, opacity: 0, stagger: .07, duration: .9, ease: "power3.out", scrollTrigger: { trigger: ".index", start: "top 82%" } });

  // Designer
  gsap.from(".rd__stage", { y: 60, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ".rd", start: "top 80%" } });
  gsap.from(".rd__group, .rd__panel > .btn", { y: 30, opacity: 0, stagger: .08, duration: .8, ease: "power3.out", scrollTrigger: { trigger: ".rd__panel", start: "top 80%" } });

  // Work parallax columns
  mm.add("(min-width: 768px)", function () {
    $$(".work__col").forEach(function (c) {
      var sp = +c.getAttribute("data-speed");
      gsap.fromTo(c, { yPercent: -sp / 2 }, { yPercent: sp / 2, ease: "none", scrollTrigger: { trigger: ".work", start: "top bottom", end: "bottom top", scrub: true } });
    });
  });
  $$(".work__col img").forEach(function (im) {
    gsap.from(im, { clipPath: "inset(18% 0 18% 0 round 20px)", scale: 1.1, duration: 1.3, ease: "power3.out", scrollTrigger: { trigger: im, start: "top 92%" } });
  });

  // Bento
  gsap.from(".b", { y: 60, opacity: 0, stagger: .08, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".bento", start: "top 82%" } });

  // Process stacking — scale back earlier cards (desktop)
  mm.add("(min-width: 1000px)", function () {
    var cards = $$(".stack .card");
    cards.forEach(function (c, i) {
      if (i === cards.length - 1) return;
      gsap.to(c, { scale: .94 - (cards.length - i) * .01, ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top 85%", end: "top 30%", scrub: true } });
    });
  });

  // Commercial card reveal
  gsap.from("[data-reveal-card]", { clipPath: "inset(12% 8% 12% 8% round 32px)", duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: "[data-reveal-card]", start: "top 85%" } });
  gsap.fromTo("[data-reveal-card] > img", { yPercent: -8, scale: 1.15 }, { yPercent: 8, scale: 1.15, ease: "none", scrollTrigger: { trigger: "[data-reveal-card]", start: "top bottom", end: "bottom top", scrub: true } });

  // Booking
  gsap.from(".wiz, .visit", { y: 70, opacity: 0, stagger: .12, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ".book", start: "top 75%" } });

  // Footer wordmark
  gsap.from(".foot__word", { yPercent: 30, opacity: 0, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: ".foot", start: "top 90%" } });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
