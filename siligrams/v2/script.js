/* Siligrams V2 — shared script (home + product page) */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var G = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var isPdp = document.body.classList.contains("pdp");
  var store = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------------- pricing (demo values) ---------------- */
  var TIERS = [[50, 14.0], [100, 12.5], [250, 10.75], [500, 9.5], [1000, 8.25]];
  var CAV_ADJ = { 2: -2.0, 4: 0, 6: 2.5 };
  var PANTONE_FEE = 75, RUSH_FEE = 150;
  var MOLD = { black: "#151417", navy: "#1d2f5c", red: "#a91f2b", pantone: "#2f8f83" };
  function tierFor(q) { var t = TIERS[0]; TIERS.forEach(function (x) { if (q >= x[0]) t = x; }); return t; }
  function nextTier(q) { for (var i = 0; i < TIERS.length; i++) if (TIERS[i][0] > q) return TIERS[i]; return null; }
  function each(q, cav) { return Math.max(1, tierFor(q)[1] + (CAV_ADJ[cav] || 0)); }
  function money(n, d) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: d === 0 ? 0 : 2, maximumFractionDigits: d === 0 ? 0 : 2 }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------------- tray renderer (home teaser + PDP) ---------------- */
  function renderTray(el, s) {
    if (!el) return;
    el.style.setProperty("--mold", s.color === "pantone" ? (s.hex || MOLD.pantone) : MOLD[s.color]);
    el.dataset.cav = s.cav; el.dataset.shape = s.shape;
    var mark = s.logo ? '<img src="' + s.logo + '" alt="">' : esc((s.text || "YOUR LOGO").toUpperCase());
    var h = ""; for (var i = 0; i < s.cav; i++) h += '<div class="cav"><span class="cav__mark">' + mark + "</span></div>";
    el.innerHTML = h;
  }

  /* ---------------- logo processing -> white mark with alpha ---------------- */
  function processLogo(file, cb) {
    if (!file || !/^image\//.test(file.type)) return;
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var s = Math.min(1, 360 / Math.max(img.width, img.height));
        var w = Math.max(1, Math.round(img.width * s)), h = Math.max(1, Math.round(img.height * s));
        var c = document.createElement("canvas"); c.width = w; c.height = h;
        var x = c.getContext("2d"); x.drawImage(img, 0, 0, w, h);
        var out;
        try {
          var d = x.getImageData(0, 0, w, h), p = d.data, transparent = false, bgL = 0;
          for (var i = 3; i < p.length; i += 28) if (p[i] < 200) { transparent = true; break; }
          [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]].forEach(function (pt) { var k = (pt[1] * w + pt[0]) * 4; bgL += 0.299 * p[k] + 0.587 * p[k + 1] + 0.114 * p[k + 2]; });
          var light = bgL / 4 > 128;
          for (var j = 0; j < p.length; j += 4) {
            var L = 0.299 * p[j] + 0.587 * p[j + 1] + 0.114 * p[j + 2];
            var a = transparent ? p[j + 3] : light ? Math.min(255, (255 - L) * 1.6) : Math.min(255, L * 1.4);
            p[j] = p[j + 1] = p[j + 2] = 255; p[j + 3] = a;
          }
          x.putImageData(d, 0, 0); out = c.toDataURL("image/png");
        } catch (e) { out = reader.result; }
        cb(out, file.name, reader.result);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  /* ---------------- nav ---------------- */
  var nav = $("#nav"), lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    if (nav) {
      nav.classList.toggle("is-scrolled", y > 30);
      var menuOpen = $(".menu.is-open");
      nav.classList.toggle("is-hidden", !menuOpen && y > 600 && y > lastY + 4);
      if (y < lastY - 4) nav.classList.remove("is-hidden");
    }
    var mb = $("[data-mbar]"); if (mb) mb.classList.toggle("is-on", y > window.innerHeight * 0.8);
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var burger = $(".nav__burger"), menu = $("#menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var o = burger.getAttribute("aria-expanded") !== "true";
      burger.setAttribute("aria-expanded", o); menu.classList.toggle("is-open", o);
    });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { burger.setAttribute("aria-expanded", "false"); menu.classList.remove("is-open"); }); });
  }

  /* ---------------- cursor ---------------- */
  var cur = $(".cursor");
  if (cur && window.matchMedia("(hover:hover) and (pointer:fine)").matches && !reduce) {
    var dot = $(".cursor__dot", cur), ring = $(".cursor__ring", cur), mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener("pointermove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; dot.style.transform = "translate(" + mx + "px," + my + "px)"; ring.style.transform = "translate(" + rx + "px," + ry + "px)"; requestAnimationFrame(loop); })();
    document.addEventListener("pointerover", function (e) { cur.classList.toggle("is-hover", !!e.target.closest("a,button,label,input,[data-hover],summary")); });
  }

  /* ---------------- HERO: 3D ice ---------------- */
  var ice = null, glc = $("#iceGL");
  if (glc) {
    ice = window.Ice3D ? window.Ice3D(glc, { text: "SILIGRAMS", offsetX: 1.15, offsetY: 0.18, scale: 0.72 }) : null;
    if (!ice) document.body.classList.add("no-gl");
    var tryIn = $("#tryText"), heroCta = $("[data-cta-hero]");
    var syncCta = function () {
      var t = tryIn.value.trim();
      if (heroCta) heroCta.href = "custom-ice-cube-mold/" + (t ? "?text=" + encodeURIComponent(t) : "");
    };
    tryIn.addEventListener("input", function () {
      var t = tryIn.value.trim();
      store.set("sg_logo", "");
      if (ice) ice.setText(t || "SILIGRAMS");
      syncCta();
    });
    var up = $("[data-logo-input]");
    if (up) up.addEventListener("change", function () {
      processLogo(up.files[0], function (mark, name) {
        store.set("sg_logo", mark); store.set("sg_logo_name", name);
        if (ice) ice.setLogo(mark);
      });
    });
  }

  /* ---------------- home: build-your-mold teaser ---------------- */
  var mini = $("[data-mini]");
  if (mini) {
    var ms = { shape: "square", cav: 6, color: "black", qty: 250, text: "" };
    var range = $("[data-mini-range]", mini), mtray = $("[data-mini-tray]", mini);
    var renderMini = function () {
      var e = each(ms.qty, ms.cav), base = each(50, ms.cav), nt = nextTier(ms.qty);
      $("[data-mini-qty]", mini).textContent = ms.qty.toLocaleString() + (ms.qty >= 1000 ? "+" : "") + " molds";
      $("[data-mini-each]", mini).textContent = money(e);
      $("[data-mini-total]", mini).textContent = money(e * ms.qty + (ms.color === "pantone" ? PANTONE_FEE : 0));
      var save = Math.round((1 - e / base) * 100);
      $("[data-mini-save]", mini).textContent = save > 0
        ? "You save " + save + "% per mold vs. 50 molds" + (nt ? " · next price break at " + nt[0].toLocaleString() : " · best tier")
        : "Add 50 more molds to save " + Math.round((1 - each(100, ms.cav) / base) * 100) + "% per mold";
      range.style.setProperty("--p", ((ms.qty - 50) / 950 * 100) + "%");
      var t = tierFor(ms.qty)[0];
      $$("[data-t]", mini).forEach(function (s) { s.classList.toggle("on", +s.dataset.t === t); });
      ms.text = (tryIn && tryIn.value.trim()) || "";
      renderTray(mtray, { shape: ms.shape, cav: ms.cav, color: ms.color, text: ms.text || "YOUR LOGO", logo: store.get("sg_logo") || null });
      var q = { shape: ms.shape, cav: ms.cav, color: ms.color, qty: ms.qty }; if (ms.text) q.text = ms.text;
      $("[data-mini-go]", mini).href = "custom-ice-cube-mold/?" + new URLSearchParams(q).toString();
    };
    $$("[data-group]", mini).forEach(function (g) {
      $$("button", g).forEach(function (b) {
        b.addEventListener("click", function () {
          $$("button", g).forEach(function (x) { x.classList.toggle("on", x === b); });
          var k = g.dataset.group; ms[k] = k === "cav" ? +b.dataset.v : b.dataset.v; renderMini();
          if (G && !reduce) gsap.fromTo(mtray, { scale: 0.94 }, { scale: 1, duration: 0.8, ease: "elastic.out(1,.5)" });
        });
      });
    });
    range.addEventListener("input", function () { ms.qty = +range.value; renderMini(); });
    $$("[data-t]", mini).forEach(function (s) { s.addEventListener("click", function () { ms.qty = +s.dataset.t; range.value = ms.qty; renderMini(); }); });
    if (tryIn) tryIn.addEventListener("input", renderMini);
    var lu = $("[data-logo-input]"); if (lu) lu.addEventListener("change", function () { setTimeout(renderMini, 400); });
    renderMini();
  }

  /* ---------------- use-case accordion ---------------- */
  var panels = $$(".panel");
  panels.forEach(function (p) {
    var open = function () { panels.forEach(function (x) { x.classList.toggle("is-open", x === p); }); };
    p.addEventListener("mouseenter", function () { if (window.innerWidth > 980) open(); });
    p.addEventListener("focus", open);
    p.addEventListener("click", function (e) { if (!p.classList.contains("is-open")) { e.preventDefault(); open(); } });
  });

  /* ---------------- reviews ---------------- */
  var RV = [
    "Responsive from my first inquiry all the way to rushing a custom molded product in 48–72 hours. When UPS delivered to the wrong address, they produced a replacement within 6 hours so it got to the event on time. I'm a forever fan!",
    "Clay and the team designed a customized mold with our client's logo that turned out fantastic. We could make adjustments so the molds were exactly what we needed. Quality molds, 200 cavities, on deadline. We'll definitely work with them again.",
    "So easy to work with. Customer service was wonderful and quick to respond to all questions. Delivery was quick and the quality of the finished product was exceptional.",
    "Great quality! Bought for my (now) husband's groomsmen for our wedding and it was a hit!"
  ];
  var rq = $("[data-rv-quote]");
  if (rq) {
    var ri = 0, bar = $("[data-rv-bar]"), rtw;
    var show = function (i) {
      ri = (i + RV.length) % RV.length;
      $$(".rv-names button").forEach(function (b) { b.classList.toggle("on", +b.dataset.rv === ri); });
      if (G && !reduce) {
        gsap.to(rq, { opacity: 0, y: 14, duration: 0.3, onComplete: function () { rq.textContent = RV[ri]; gsap.to(rq, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }); } });
        if (rtw) rtw.kill();
        rtw = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 7, ease: "none", onComplete: function () { show(ri + 1); } });
      } else rq.textContent = RV[ri];
    };
    $$(".rv-names button").forEach(function (b) { b.addEventListener("click", function () { show(+b.dataset.rv); }); });
    if (G && !reduce) ScrollTrigger.create({ trigger: ".reviews", start: "top 70%", once: true, onEnter: function () { show(0); } });
  }

  /* ---------------- wedding live preview ---------------- */
  var w1 = $("[data-w1]"), w2 = $("[data-w2]"), wd = $("[data-wd]");
  if (w1) {
    var upd = function () {
      var a = (w1.value || "A").toUpperCase(), b = (w2.value || "J").toUpperCase();
      $$("[data-wt='1'],[data-wt='2'],[data-wt='3']").forEach(function (el) { el.textContent = a + "&" + b; });
      $("[data-wt='date']").textContent = wd.value || "06.20.27";
    };
    [w1, w2, wd].forEach(function (i) { i.addEventListener("input", upd); i.addEventListener("focus", function () { i.select(); }); });
  }

  /* ---------------- bento pantone stagger ---------------- */
  $$(".pmsrow i").forEach(function (el, i) { el.style.setProperty("--i", (i % 2 ? 1 : 2) + i * 0.3); });

  /* ---------------- CRO notes ---------------- */
  var nt = $("[data-notes-toggle]");
  if (nt && window.CRO_NOTES) {
    var set = window.CRO_NOTES[isPdp ? "pdp" : "home"];
    nt.addEventListener("click", function () {
      var on = !document.body.classList.contains("notes-on");
      document.body.classList.toggle("notes-on", on);
      nt.setAttribute("aria-pressed", on);
      nt.lastChild.textContent = on ? "Hide CRO notes" : "Show CRO notes";
      $$(".note-pin").forEach(function (x) { x.remove(); });
      if (!on) return;
      $$("[data-note]").forEach(function (el) {
        var d = set[el.dataset.note]; if (!d) return;
        if (getComputedStyle(el).position === "static") el.style.position = "relative";
        var pin = document.createElement("div"); pin.className = "note-pin";
        pin.innerHTML = "<i>" + el.dataset.note + "</i><b>" + d[0] + "</b>" + d[1];
        el.appendChild(pin);
      });
    });
    if (/[?&]notes\b/.test(location.search)) nt.click();
  }

  /* ---------------- magnetic ---------------- */
  if (G && !reduce && window.matchMedia("(hover:hover)").matches) {
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.5, ease: "power3.out" });
      });
      b.addEventListener("pointerleave", function () { gsap.to(b, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,0.35)" }); });
    });
  }

  /* ---------------- word splitting ---------------- */
  function splitWords(el, wrapInner) {
    var frag = document.createDocumentFragment();
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      var isEm = node.nodeType === 1 && node.tagName === "EM";
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
        var w = document.createElement("span"); w.className = "w";
        var target = w;
        if (wrapInner) { var inner = document.createElement("span"); w.appendChild(inner); target = inner; }
        if (isEm) { var em = document.createElement("em"); em.textContent = part; target.appendChild(em); } else target.appendChild(document.createTextNode(part));
        frag.appendChild(w);
      });
    });
    el.innerHTML = ""; el.appendChild(frag);
    return wrapInner ? $$(".w>span", el) : $$(".w", el);
  }

  /* ---------------- marquee strips (velocity-aware) ---------------- */
  var strips = $$(".strip");
  strips.forEach(function (s) {
    var tr = $(".strip__track", s); tr.innerHTML += tr.innerHTML;
    s._x = 0; s._dir = +s.dataset.dir || -1; s._tr = tr;
  });
  var vel = 0;

  /* ================= GSAP choreography ================= */
  if (G && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("js-anim");

    if (typeof window.Lenis !== "undefined") {
      var lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on("scroll", function (e) { ScrollTrigger.update(); vel = e.velocity || 0; });
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) { var id = a.getAttribute("href"); if (id.length < 2) return; var t = $(id); if (!t) return; e.preventDefault(); lenis.scrollTo(t, { offset: -70, duration: 1.4 }); });
      });
    }

    // hero intro
    if ($(".hero")) {
      var tl = gsap.timeline({ delay: 1.05 });
      tl.from(".hero__title .ln>span", { yPercent: 115, rotate: 3, duration: 1.4, ease: "expo.out", stagger: 0.12 })
        .from(".kicker", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.1)
        .from(".hero__lead, .hero__ctas", { y: 30, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.1 }, 0.5)
        .from(".tryit", { y: 40, opacity: 0, duration: 1.1, ease: "expo.out" }, 0.7)
        .from(".orb", { scale: 0.6, opacity: 0, duration: 1, ease: "back.out(1.8)", stagger: 0.12 }, 0.9)
        .from(".hero__foot", { opacity: 0, duration: 1 }, 1);
      gsap.to(".orb--1", { y: -14, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".orb--2", { y: 12, duration: 3.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".orb--3", { y: -10, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
      ScrollTrigger.create({ trigger: ".hero", start: "top top", end: "bottom top", onUpdate: function (s) { if (ice) ice.setScroll(s.progress); } });
      gsap.to(".hero__content", { yPercent: -18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }

    // manifesto lit words
    var lit = $("[data-lit]");
    if (lit) {
      var ws = splitWords(lit, false);
      gsap.to(ws, { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: lit, start: "top 75%", end: "bottom 45%", scrub: true } });
      $$("[data-speed]").forEach(function (im) { gsap.to(im, { yPercent: +im.dataset.speed * 300, ease: "none", scrollTrigger: { trigger: ".manifesto", start: "top bottom", end: "bottom top", scrub: true } }); });
      gsap.from(".manifesto__imgs img", { scale: 0.7, opacity: 0, duration: 1.4, ease: "expo.out", stagger: 0.15, scrollTrigger: { trigger: ".manifesto", start: "top 70%" } });
    }

    // headings split
    $$(".h-xl").forEach(function (h) {
      var words = splitWords(h, true);
      gsap.from(words, { yPercent: 115, rotate: 4, duration: 1.2, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: h, start: "top 85%" } });
    });

    // count-up
    $$("[data-count]").forEach(function (el) {
      var end = +el.dataset.count, o = { v: 0 };
      ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: function () { gsap.to(o, { v: end, duration: 2, ease: "power3.out", onUpdate: function () { el.textContent = Math.round(o.v).toLocaleString(); } }); } });
    });
    gsap.from(".num", { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".numbers", start: "top 85%" } });

    // process steps -> screens
    var steps = $$(".pstep"), scrs = $$(".scr"), dots = $$(".process__dots i"), urls = ["siligrams.com/custom-ice-cube-mold", "siligrams.com/proofs/2481", "siligrams.com/proofs/2481/approve", "siligrams.com/account/orders/2481"];
    var setStep = function (i) {
      steps.forEach(function (s, k) { s.classList.toggle("is-on", k === i); });
      scrs.forEach(function (s, k) { s.classList.toggle("is-on", k === i); });
      dots.forEach(function (s, k) { s.classList.toggle("on", k === i); });
      var u = $("[data-screen-url]"); if (u) u.textContent = urls[i];
    };
    steps.forEach(function (s, i) { ScrollTrigger.create({ trigger: s, start: "top 60%", end: "bottom 60%", onToggle: function (st) { if (st.isActive) setStep(i); } }); });
    gsap.from(".screen", { y: 80, rotateX: 12, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".process", start: "top 70%" } });

    // build card
    gsap.from(".build__card", { y: 100, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".build__card", start: "top 90%" } });
    gsap.from("[data-mini-tray]", { rotateX: 75, rotateZ: -60, scale: 0.7, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: ".build__card", start: "top 75%" } });

    // panels
    gsap.from(".panel", { y: 80, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".acc-panels", start: "top 85%" } });

    // bento
    gsap.from(".bx", { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: ".bento", start: "top 85%" } });
    gsap.from(".cmp b.y", { scale: 0, duration: 0.6, ease: "back.out(2.5)", stagger: 0.08, scrollTrigger: { trigger: ".cmp", start: "top 85%" } });

    // wedding tiles
    gsap.from(".wtile", { y: 120, rotate: function (i) { return [-10, 4, 10][i]; }, opacity: 0, duration: 1.4, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".wedding__tiles", start: "top 85%" } });

    // paths, faq
    gsap.from(".path", { y: 80, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".paths__grid", start: "top 88%" } });
    gsap.from(".faq__list details", { y: 30, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.07, scrollTrigger: { trigger: ".faq__list", start: "top 85%" } });

    // final
    gsap.from(".final__orb", { scale: 0.4, rotate: -40, opacity: 0, duration: 1.4, ease: "back.out(1.6)", scrollTrigger: { trigger: ".final", start: "top 70%" } });
    gsap.from(".footer__word", { yPercent: 40, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".footer__word", start: "top 95%" } });

    // PDP entrance
    if (isPdp) {
      gsap.from(".gal__main", { opacity: 0, scale: 0.97, duration: 1.2, ease: "expo.out" });
      gsap.from(".bb > *", { y: 24, opacity: 0, stagger: 0.04, duration: 0.9, ease: "power3.out", delay: 0.1 });
      gsap.from("[data-tray]", { rotateX: 75, rotateZ: -60, y: 80, opacity: 0, duration: 1.8, ease: "expo.out", delay: 0.2 });
    }

    // strips ticker
    if (strips.length) {
      gsap.ticker.add(function () {
        var boost = Math.min(8, Math.abs(vel) * 0.25);
        strips.forEach(function (s) {
          var half = s._tr.scrollWidth / 2;
          s._x += s._dir * (0.6 + boost);
          if (s._x <= -half) s._x += half; if (s._x > 0) s._x -= half;
          s._tr.style.transform = "translate3d(" + s._x + "px,0,0)";
        });
        vel *= 0.92;
      });
    }
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  } else {
    $$("[data-count]").forEach(function (el) { el.textContent = (+el.dataset.count).toLocaleString(); });
    $$(".manifesto__txt .w").forEach(function (w) { w.style.opacity = 1; });
    if (rq) rq.textContent = RV[0];
  }

  /* =====================================================
     PRODUCT PAGE CONFIGURATOR
     ===================================================== */
  if (!isPdp) return;

  var Q = new URLSearchParams(location.search);
  var S = {
    shape: Q.get("shape") === "round" ? "round" : "square",
    cav: [2, 4, 6].indexOf(+Q.get("cav")) > -1 ? +Q.get("cav") : 6,
    color: ["black", "navy", "red", "pantone"].indexOf(Q.get("color")) > -1 ? Q.get("color") : "black",
    hex: "#2f8f83",
    qty: Math.max(50, Math.min(100000, parseInt(Q.get("qty"), 10) || 250)),
    rush: false,
    text: (Q.get("text") || "").slice(0, 16),
    logo: store.get("sg_logo") || null,
    logoName: store.get("sg_logo_name") || "",
    help: false
  };
  var tray = $("[data-tray]");
  var pIce = window.Ice3D && $("#pdpIce") ? window.Ice3D($("#pdpIce"), { text: S.text || "YOUR LOGO" }) : null;
  if (pIce && S.logo) pIce.setLogo(S.logo);
  if (!pIce && $(".gal__ice")) $(".gal__ice").hidden = true;

  function addBiz(d, n) { d = new Date(d); while (n > 0) { d.setDate(d.getDate() + 1); var w = d.getDay(); if (w !== 0 && w !== 6) n--; } return d; }
  function fmt(d) { return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); }
  var stdDate = addBiz(new Date(), 18), rushDate = addBiz(new Date(), 11);
  $("[data-date-std]").textContent = "Estimated arrival " + fmt(stdDate);
  $("[data-date-rush]").textContent = "Estimated arrival " + fmt(rushDate);

  function render() {
    var e = each(S.qty, S.cav), pf = S.color === "pantone" ? PANTONE_FEE : 0, rf = S.rush ? RUSH_FEE : 0, sub = e * S.qty + pf + rf;
    var colorName = S.color === "pantone" ? "Custom Pantone" : S.color[0].toUpperCase() + S.color.slice(1);
    $("[data-from]").textContent = money(each(1000, S.cav));
    $$("[data-opt]").forEach(function (b) { var on = String(S[b.dataset.opt]) === b.dataset.v; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); });
    $(".pmsbtn").classList.toggle("on", S.color === "pantone");
    $("[data-color-name]").textContent = colorName;
    $$("[data-tier]").forEach(function (b) { var q = +b.dataset.tier; $("b", b).textContent = money(each(q, S.cav)); b.classList.toggle("on", tierFor(S.qty)[0] === q); });
    var qi = $("[data-qty]"); if (document.activeElement !== qi) qi.value = S.qty;
    var nx = nextTier(S.qty), nudge = $("[data-nudge]");
    nudge.innerHTML = nx
      ? "<span>Add " + (nx[0] - S.qty).toLocaleString() + " more to save " + money(e - each(nx[0], S.cav)) + " per mold</span><button type=\"button\" data-jump=\"" + nx[0] + "\">Make it " + nx[0].toLocaleString() + "</button>"
      : "<span>Best price tier unlocked. Over 5,000? Ask for a custom quote.</span>";
    $("[data-rush-fee]").textContent = "+" + money(RUSH_FEE, 0);
    $("[data-s-each]").textContent = money(e);
    $("[data-s-eachlbl]").textContent = "Est. price / mold (" + S.qty.toLocaleString() + ")";
    $("[data-s-qty]").textContent = S.qty.toLocaleString();
    var moldTxt = (S.shape === "round" ? "Round" : "Square") + " · " + S.cav + " cavities · " + colorName;
    $("[data-s-mold]").textContent = moldTxt;
    $("[data-s-pms-row]").hidden = !pf;
    $("[data-s-del]").textContent = S.rush ? "Rush (+" + money(RUSH_FEE, 0) + ")" : "Standard (included)";
    $("[data-s-art]").textContent = S.logo ? "Logo uploaded" : S.text ? "Text: " + S.text : S.help ? "Designer help requested" : "Add later";
    $$("[data-s-total]").forEach(function (el) { el.textContent = money(sub); });
    $("[data-step='art']").classList.toggle("is-done", !!(S.logo || S.text || S.help));
    $("[data-step='qty']").classList.toggle("is-done", S.qty >= 50);
    renderTray(tray, S);
    $("[data-quote]").innerHTML =
      "<tr><td>Custom Ice Cube Mold · " + moldTxt + "</td><td>" + S.qty.toLocaleString() + " × " + money(e) + "</td></tr>" +
      (pf ? "<tr><td>Pantone color match (one-time)</td><td>" + money(pf) + "</td></tr>" : "") +
      "<tr><td>Delivery: " + (S.rush ? "Rush · est. " + fmt(rushDate) : "Standard · est. " + fmt(stdDate)) + "</td><td>" + (rf ? money(rf) : "Included") + "</td></tr>" +
      "<tr class=\"tot\"><td>Estimated subtotal</td><td>" + money(sub) + "</td></tr>";
    $("[data-quote-date]").textContent = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  var gm = $(".gal__main"), gphoto = $(".gal__photo");
  function showLive() {
    gm.classList.remove("show-photo");
    $$(".gal__tabs button").forEach(function (b) { b.classList.toggle("on", b.dataset.view === "live"); });
    $$(".gal__thumbs button").forEach(function (b, i) { b.classList.toggle("on", i === 0); });
  }
  function showPhoto(src, idx) {
    gphoto.src = src; gm.classList.add("show-photo");
    $$(".gal__tabs button").forEach(function (b) { b.classList.toggle("on", b.dataset.view === "photo"); });
    $$(".gal__thumbs button").forEach(function (b, i) { b.classList.toggle("on", i === idx); });
  }
  $$(".gal__tabs button").forEach(function (b) { b.addEventListener("click", function () { if (b.dataset.view === "live") showLive(); else showPhoto($$(".gal__thumbs button")[1].dataset.src, 1); }); });
  $$(".gal__thumbs button").forEach(function (b, i) { b.addEventListener("click", function () { if (b.dataset.src) showPhoto(b.dataset.src, i); else showLive(); }); });

  $$("[data-opt]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.dataset.opt; S[k] = k === "cav" ? +b.dataset.v : b.dataset.v; render(); showLive();
      if (G && !reduce) gsap.fromTo(tray, { scale: 0.95 }, { scale: 1, duration: 0.8, ease: "elastic.out(1,.5)" });
    });
  });
  var pmsIn = $("[data-pms]");
  pmsIn.addEventListener("input", function () { S.hex = pmsIn.value; S.color = "pantone"; render(); showLive(); });
  $(".pmsbtn").addEventListener("click", function (e) { if (e.target !== pmsIn) { S.color = "pantone"; render(); showLive(); } });

  var qWrap = $("[data-qtywrap]"), qIn = $("[data-qty]");
  function setQty(v) { v = parseInt(v, 10); if (isNaN(v)) v = 50; qWrap.classList.toggle("is-err", v < 50); S.qty = Math.max(50, Math.min(100000, v)); render(); }
  $("[data-minus]").addEventListener("click", function () { setQty(S.qty - (S.qty > 100 ? 50 : 10)); });
  $("[data-plus]").addEventListener("click", function () { setQty(S.qty + (S.qty >= 100 ? 50 : 10)); });
  qIn.addEventListener("input", function () { var v = parseInt(qIn.value, 10); qWrap.classList.toggle("is-err", !isNaN(v) && v < 50); if (v >= 50) { S.qty = Math.min(100000, v); render(); } });
  qIn.addEventListener("blur", function () { setQty(qIn.value); });
  $$("[data-tier]").forEach(function (b) { b.addEventListener("click", function () { setQty(b.dataset.tier); }); });
  $("[data-nudge]").addEventListener("click", function (e) { var j = e.target.closest("[data-jump]"); if (j) setQty(j.dataset.jump); });
  $$("input[name=delivery]").forEach(function (r) { r.addEventListener("change", function () { S.rush = r.value === "rush"; render(); }); });

  var drop = $("[data-drop]"), fIn = $("[data-file]"), fRow = $("[data-filerow]");
  function useFile(f) {
    processLogo(f, function (mark, name, orig) {
      S.logo = mark; S.logoName = name; store.set("sg_logo", mark); store.set("sg_logo_name", name);
      $("img", fRow).src = orig; $("span", fRow).textContent = name; fRow.classList.add("is-on"); drop.classList.add("has-file");
      if (pIce) pIce.setLogo(mark); render(); showLive();
    });
  }
  fIn.addEventListener("change", function () { if (fIn.files[0]) useFile(fIn.files[0]); });
  ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("is-drag"); }); });
  drop.addEventListener("drop", function (e) { var f = e.dataTransfer.files[0]; if (f) useFile(f); });
  $("button", fRow).addEventListener("click", function () {
    S.logo = null; store.set("sg_logo", ""); fRow.classList.remove("is-on"); drop.classList.remove("has-file"); fIn.value = "";
    if (pIce) pIce.setText(S.text || "YOUR LOGO"); render();
  });
  if (S.logo) { $("img", fRow).src = S.logo; $("span", fRow).textContent = S.logoName || "Your logo"; fRow.classList.add("is-on"); drop.classList.add("has-file"); }
  var tIn = $("[data-text]"); tIn.value = S.text;
  tIn.addEventListener("input", function () { S.text = tIn.value.slice(0, 16); if (pIce && !S.logo) pIce.setText(S.text || "YOUR LOGO"); render(); showLive(); });
  $("[data-help]").addEventListener("change", function (e) { S.help = e.target.checked; render(); });

  var modal = $("[data-modal]"), lastF = null;
  function openModal() {
    lastF = document.activeElement;
    $("[data-modal-sum]").textContent = S.qty.toLocaleString() + " molds · " + $("[data-s-mold]").textContent + " · est. " + $("[data-s-total]").textContent;
    $("[data-form]").hidden = false; $("[data-ok]").hidden = true;
    modal.classList.add("is-on"); modal.setAttribute("aria-hidden", "false");
    setTimeout(function () { var f = $("input", modal); if (f) f.focus(); }, 120);
  }
  function closeModal() { modal.classList.remove("is-on"); modal.setAttribute("aria-hidden", "true"); if (lastF) lastF.focus(); }
  $$("[data-request]").forEach(function (b) { b.addEventListener("click", openModal); });
  $$("[data-close]").forEach(function (b) { b.addEventListener("click", closeModal); });
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("is-on")) closeModal(); });
  $("[data-form]").addEventListener("submit", function (e) {
    e.preventDefault(); if (!e.target.checkValidity()) { e.target.reportValidity(); return; }
    $("[data-form]").hidden = true; $("[data-ok]").hidden = false; $("[data-ok-date]").textContent = fmt(addBiz(new Date(), 3));
  });
  $$("[data-pdf]").forEach(function (b) { b.addEventListener("click", function () { render(); window.print(); }); });

  render();
})();
