/* Siligrams concept — shared script (home + product page) */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  var isPdp = document.body.classList.contains("page-pdp");
  var store = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------------- pricing (demo values) ---------------- */
  var TIERS = [[50, 14.0], [100, 12.5], [250, 10.75], [500, 9.5], [1000, 8.25]];
  var CAV_ADJ = { 2: -2.0, 4: 0, 6: 2.5 };
  var PANTONE_FEE = 75, RUSH_FEE = 150;
  function tierFor(q) { var t = TIERS[0]; TIERS.forEach(function (x) { if (q >= x[0]) t = x; }); return t; }
  function nextTier(q) { for (var i = 0; i < TIERS.length; i++) if (TIERS[i][0] > q) return TIERS[i]; return null; }
  function each(q, cav) { return Math.max(1, tierFor(q)[1] + (CAV_ADJ[cav] || 0)); }
  function money(n, d) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: d === 0 ? 0 : 2, maximumFractionDigits: d === 0 ? 0 : 2 }); }
  var MOLD = { black: "#151417", navy: "#1d2f5c", red: "#a91f2b" };

  /* ---------------- header ---------------- */
  var hdr = $("#hdr");
  function onScroll() {
    var y = window.scrollY;
    if (hdr) hdr.classList.toggle("is-scrolled", y > 10);
    var mbar = $("[data-mbar]");
    if (mbar) mbar.classList.toggle("is-on", y > window.innerHeight * 0.7);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  var burger = $(".hdr__burger"), mnav = $("#mnav");
  if (burger && mnav) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") !== "true";
      burger.setAttribute("aria-expanded", open);
      mnav.classList.toggle("is-open", open);
    });
    $$("a", mnav).forEach(function (a) { a.addEventListener("click", function () { burger.setAttribute("aria-expanded", "false"); mnav.classList.remove("is-open"); }); });
  }

  /* ---------------- logo processing: any logo -> frosted white mark ---------------- */
  function processLogo(file, cb) {
    if (!file || !/^image\//.test(file.type)) return;
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 320, s = Math.min(1, max / Math.max(img.width, img.height));
        var w = Math.max(1, Math.round(img.width * s)), h = Math.max(1, Math.round(img.height * s));
        var c = document.createElement("canvas"); c.width = w; c.height = h;
        var x = c.getContext("2d"); x.drawImage(img, 0, 0, w, h);
        var out;
        try {
          var d = x.getImageData(0, 0, w, h), p = d.data, transparent = false, bgL = 0, n = 0;
          for (var i = 3; i < p.length; i += 4 * 7) if (p[i] < 200) { transparent = true; break; }
          [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]].forEach(function (pt) {
            var k = (pt[1] * w + pt[0]) * 4; bgL += 0.299 * p[k] + 0.587 * p[k + 1] + 0.114 * p[k + 2]; n++;
          });
          var lightBg = bgL / n > 128;
          for (var j = 0; j < p.length; j += 4) {
            var L = 0.299 * p[j] + 0.587 * p[j + 1] + 0.114 * p[j + 2], a;
            if (transparent) a = p[j + 3];
            else a = lightBg ? Math.min(255, (255 - L) * 1.6) : Math.min(255, L * 1.4);
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
  function setMarks(text, logo) {
    $$("[data-mark]").forEach(function (el) {
      if (logo) el.innerHTML = '<img src="' + logo + '" alt="">';
      else el.textContent = text || "YOUR LOGO";
    });
  }

  /* ---------------- Ice Lab (home) ---------------- */
  var lab = $("#lab");
  if (lab) {
    var ice = $(".ice", lab), input = $("#labText"), go = $("[data-lab-go]"), logoData = null, shape = "square";
    function syncGo() {
      var q = new URLSearchParams({ shape: shape });
      if (input.value.trim()) q.set("text", input.value.trim());
      go.href = "custom-ice-cube-mold/?" + q.toString();
    }
    input.addEventListener("input", function () {
      logoData = null; store.set("sg_logo", "");
      setMarks(input.value.trim().toUpperCase() || "SILIGRAMS");
      syncGo();
    });
    $$(".seg button", lab).forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".seg button", lab).forEach(function (x) { x.setAttribute("aria-checked", x === b); });
        shape = b.dataset.shape; ice.dataset.shape = shape; syncGo();
      });
    });
    $("[data-logo-input]", lab).addEventListener("change", function (e) {
      processLogo(e.target.files[0], function (mark, name) {
        logoData = mark; store.set("sg_logo", mark); store.set("sg_logo_name", name);
        setMarks("", mark);
      });
    });
    syncGo();
    // motion: gentle sway + pointer tilt
    if (hasGsap && !reduce) {
      var cube = $(".ice__cube", lab);
      gsap.set(cube, { rotationX: -18, rotationY: -28 });
      var sway = gsap.to(cube, { rotationY: 22, duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(ice, { y: -10, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      var stage = $(".lab__stage", lab);
      lab.addEventListener("pointermove", function (e) {
        var r = stage.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        sway.pause(); gsap.to(cube, { rotationY: px * 70, rotationX: -18 - py * 30, duration: 0.6, overwrite: "auto" });
      });
      lab.addEventListener("pointerleave", function () { gsap.to(cube, { rotationX: -18, rotationY: -28, duration: 0.8, onComplete: function () { sway.restart(); } }); });
    }
  }

  /* ---------------- Home mini configurator ---------------- */
  var mini = $("[data-mini]");
  if (mini) {
    var ms = { shape: "square", cav: 4, color: "black", qty: 250 };
    var range = $("[data-mini-range]", mini);
    function renderMini() {
      var e = each(ms.qty, ms.cav), base = each(50, ms.cav);
      $("[data-mini-qty]", mini).textContent = ms.qty.toLocaleString() + (ms.qty >= 1000 ? "+" : "") + " molds";
      $("[data-mini-each]", mini).textContent = money(e);
      $("[data-mini-total]", mini).textContent = money(e * ms.qty + (ms.color === "pantone" ? PANTONE_FEE : 0));
      var save = Math.round((1 - e / base) * 100);
      var nt = nextTier(ms.qty);
      $("[data-mini-save]", mini).textContent = save > 0
        ? "You save " + save + "% per mold vs. 50 molds" + (nt ? " · next price break at " + nt[0].toLocaleString() : "")
        : "Price drops at 100 molds. Add 50 more to save " + Math.round((1 - each(100, ms.cav) / base) * 100) + "%";
      range.style.setProperty("--p", ((ms.qty - 50) / 950 * 100) + "%");
      var t = tierFor(ms.qty)[0];
      $$("[data-t]", mini).forEach(function (s) { s.classList.toggle("is-on", +s.dataset.t === t); });
      $("[data-mini-go]", mini).href = "custom-ice-cube-mold/?" + new URLSearchParams({ shape: ms.shape, cav: ms.cav, color: ms.color, qty: ms.qty }).toString();
    }
    $$("[data-group]", mini).forEach(function (g) {
      $$("button", g).forEach(function (b) {
        b.addEventListener("click", function () {
          $$("button", g).forEach(function (x) { x.classList.toggle("is-on", x === b); });
          var k = g.dataset.group; ms[k] = k === "cav" ? +b.dataset.v : b.dataset.v;
          if (k === "color") {
            var feat = $("[data-feat-img]");
            if (feat) feat.src = b.dataset.v === "pantone" ? "img/molds-pantone.jpg" : "img/molds-colors.jpg";
          }
          renderMini();
        });
      });
    });
    range.addEventListener("input", function () { ms.qty = +range.value; renderMini(); });
    $$("[data-t]", mini).forEach(function (s) { s.style.cursor = "pointer"; s.addEventListener("click", function () { ms.qty = +s.dataset.t; range.value = ms.qty; renderMini(); }); });
    renderMini();
    $$(".feat__thumbs button").forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".feat__thumbs button").forEach(function (x) { x.classList.toggle("is-on", x === b); });
        var im = $("[data-feat-img]"); im.style.opacity = 0;
        setTimeout(function () { im.src = b.dataset.src; im.style.opacity = 1; }, 200);
      });
    });
  }

  /* ---------------- Reviews slider ---------------- */
  var rv = $("[data-rv]");
  if (rv) {
    var track = $("[data-rv-track]", rv), cards = $$(".rvc", rv), dots = $("[data-rv-dots]", rv), idx = 0, timer;
    function per() { return window.innerWidth <= 640 ? 1 : window.innerWidth <= 960 ? 2 : 3; }
    function pages() { return cards.length - per() + 1; }
    function buildDots() {
      dots.innerHTML = "";
      for (var i = 0; i < pages(); i++) {
        var b = document.createElement("button"); b.setAttribute("aria-label", "Go to review " + (i + 1));
        (function (n) { b.addEventListener("click", function () { go2(n); }); })(i);
        dots.appendChild(b);
      }
    }
    function go2(n) {
      idx = (n + pages()) % pages();
      var w = cards[0].getBoundingClientRect().width + 20;
      track.style.transform = "translateX(" + (-idx * w) + "px)";
      $$("button", dots).forEach(function (d, i) { d.classList.toggle("is-on", i === idx); });
    }
    $("[data-rv-prev]", rv).addEventListener("click", function () { go2(idx - 1); restart(); });
    $("[data-rv-next]", rv).addEventListener("click", function () { go2(idx + 1); restart(); });
    function restart() { clearInterval(timer); if (!reduce) timer = setInterval(function () { go2(idx + 1); }, 6000); }
    var sx = null;
    track.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { go2(idx + (dx < 0 ? 1 : -1)); restart(); } sx = null; });
    window.addEventListener("resize", function () { buildDots(); go2(Math.min(idx, pages() - 1)); });
    buildDots(); go2(0); restart();
  }

  /* ---------------- Use cases buttons (mobile / no pin) ---------------- */
  var ut = $("[data-uses-track]");
  if (ut) {
    var step = function () { return ut.querySelector(".use").getBoundingClientRect().width + 20; };
    var p = $("[data-uses-prev]"), n = $("[data-uses-next]");
    if (p) p.addEventListener("click", function () { ut.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (n) n.addEventListener("click", function () { ut.scrollBy({ left: step(), behavior: "smooth" }); });
  }

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

  /* ---------------- Magnetic buttons ---------------- */
  if (hasGsap && !reduce && window.matchMedia("(hover:hover)").matches) {
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4, ease: "power3.out" });
      });
      b.addEventListener("pointerleave", function () { gsap.to(b, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" }); });
    });
  }

  /* ---------------- Count-up ---------------- */
  function countUp(el) {
    var end = +el.dataset.count;
    if (!hasGsap || reduce) { el.textContent = end.toLocaleString(); return; }
    var o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.8, ease: "power2.out", onUpdate: function () { el.textContent = Math.round(o.v).toLocaleString(); } });
  }

  /* ---------------- GSAP scroll choreography ---------------- */
  function splitWords(el) {
    var frag = document.createDocumentFragment();
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      var isEm = node.nodeType === 1, text = node.textContent;
      text.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
        var w = document.createElement("span"); w.className = "w";
        var inner = document.createElement("span");
        if (isEm) { var em = document.createElement("em"); em.textContent = part; inner.appendChild(em); }
        else inner.textContent = part;
        w.appendChild(inner); frag.appendChild(w);
      });
    });
    el.innerHTML = ""; el.appendChild(frag);
    return $$(".w>span", el);
  }

  if (hasGsap && typeof window.ScrollTrigger !== "undefined" && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("js-anim");

    if (typeof window.Lenis !== "undefined") {
      var lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) {
          var id = a.getAttribute("href"); if (id.length < 2) return;
          var t = $(id); if (!t) return; e.preventDefault(); lenis.scrollTo(t, { offset: -70 });
        });
      });
    }

    $$(".split").forEach(function (el) {
      var words = splitWords(el);
      var inHero = !!el.closest(".hero");
      gsap.from(words, {
        yPercent: 110, rotate: 4, duration: 1.1, ease: "expo.out", stagger: 0.06, delay: inHero ? 0.15 : 0,
        scrollTrigger: inHero ? null : { trigger: el, start: "top 85%" }
      });
    });
    $$(".reveal").forEach(function (el, i) {
      var inHero = !!el.closest(".hero");
      gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: inHero ? 0.45 + i * 0.08 : 0, scrollTrigger: inHero ? null : { trigger: el, start: "top 88%" } });
    });

    // Hero entrance + parallax
    if ($(".hero")) {
      gsap.from(".hero__photo", { clipPath: "inset(12% 10% 12% 10% round 32px)", duration: 1.6, ease: "expo.out" });
      gsap.to(".hero__photo img", { scale: 1, duration: 2.2, ease: "power2.out" });
      gsap.from(".lab", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", delay: 0.55 });
      gsap.to(".hero__photo img", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".f1", { x: 60, y: 40, duration: 8, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".f2", { x: -40, y: -30, duration: 9, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }

    // Stats count
    $$("[data-count]").forEach(function (el) { ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: function () { countUp(el); } }); });
    gsap.from(".stat", { y: 30, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".stats", start: "top 85%" } });

    // How it works
    if ($(".steps")) {
      gsap.from(".step", { y: 60, opacity: 0, stagger: 0.12, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".steps", start: "top 80%" } });
      gsap.to(".how__line span", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".steps", start: "top 75%", end: "bottom 45%", scrub: true } });
    }

    // Featured product
    if ($(".feat")) {
      gsap.from(".feat__main", { clipPath: "inset(0 0 100% 0 round 32px)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".feat", start: "top 75%" } });
      gsap.from(".mini", { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".mini", start: "top 90%" } });
    }

    // Use cases: pinned horizontal scroll on desktop
    var mm = gsap.matchMedia();
    mm.add("(min-width: 961px)", function () {
      var tr = $("[data-uses-track]"); if (!tr) return;
      tr.style.overflow = "visible";
      var nav = $(".uses__nav"); if (nav) nav.style.display = "none";
      var dist = function () { return tr.scrollWidth - window.innerWidth + 40; };
      var tw = gsap.to(tr, { x: function () { return -dist(); }, ease: "none",
        scrollTrigger: { trigger: ".uses", start: "top top", end: function () { return "+=" + dist(); }, pin: true, scrub: 0.8, invalidateOnRefresh: true } });
      gsap.from(".use", { y: 80, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".uses", start: "top 70%" } });
      return function () { tr.style.overflow = ""; if (nav) nav.style.display = ""; tw.kill(); gsap.set(tr, { x: 0 }); };
    });

    // Wedding images
    if ($(".wed")) {
      gsap.from(".wed__a", { y: 80, rotate: -4, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: ".wed", start: "top 75%" } });
      gsap.from(".wed__b", { y: 120, rotate: 5, opacity: 0, duration: 1.3, delay: 0.15, ease: "expo.out", scrollTrigger: { trigger: ".wed", start: "top 75%" } });
      gsap.from(".wd", { y: 30, opacity: 0, stagger: 0.1, duration: 0.9, ease: "back.out(1.6)", scrollTrigger: { trigger: ".wed__designs", start: "top 90%" } });
    }

    // Comparison rows
    gsap.from(".cmp__row", { x: -30, opacity: 0, stagger: 0.06, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".cmp", start: "top 80%" } });
    gsap.from(".cmp__us i.yes", { scale: 0, stagger: 0.08, duration: 0.6, ease: "back.out(2.5)", scrollTrigger: { trigger: ".cmp", start: "top 70%" } });

    // Work grid
    $$(".wk").forEach(function (w, i) {
      gsap.from(w, { y: 60 + (i % 2) * 30, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: w, start: "top 92%" } });
    });

    // Paths, art, faq
    gsap.from(".path", { y: 60, opacity: 0, stagger: 0.12, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".paths", start: "top 85%" } });
    gsap.from(".art__card", { y: 40, rotate: function (i) { return i ? 6 : -6; }, opacity: 0, stagger: 0.15, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".art", start: "top 75%" } });
    gsap.from(".acc details", { y: 24, opacity: 0, stagger: 0.07, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".acc", start: "top 85%" } });
    gsap.from(".rvc", { y: 50, opacity: 0, stagger: 0.1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".rv", start: "top 85%" } });

    // Final CTA ice float
    $$(".final__ice span").forEach(function (s, i) {
      gsap.to(s, { y: (i % 2 ? -1 : 1) * (20 + i * 6), rotate: "+=" + (i % 2 ? 12 : -10), duration: 4 + i, yoyo: true, repeat: -1, ease: "sine.inOut" });
    });

    // PDP
    if (isPdp) {
      gsap.from(".gal__main", { opacity: 0, scale: 0.97, duration: 1.2, ease: "expo.out" });
      gsap.from(".bb > *", { y: 24, opacity: 0, stagger: 0.05, duration: 0.9, ease: "power3.out", delay: 0.1 });
      gsap.from(".tray", { rotateX: 70, rotateZ: -50, y: 80, opacity: 0, duration: 1.6, ease: "expo.out", delay: 0.2 });
    }

    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  } else {
    $$("[data-count]").forEach(function (el) { el.textContent = (+el.dataset.count).toLocaleString(); });
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
    text: (Q.get("text") || "").slice(0, 14),
    logo: store.get("sg_logo") || null,
    logoName: store.get("sg_logo_name") || "",
    help: false
  };

  var tray = $("[data-tray]");
  function addBiz(d, n) { d = new Date(d); while (n > 0) { d.setDate(d.getDate() + 1); var w = d.getDay(); if (w !== 0 && w !== 6) n--; } return d; }
  function fmt(d) { return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); }
  var stdDate = addBiz(new Date(), 18), rushDate = addBiz(new Date(), 11);
  $("[data-date-std]").textContent = "Estimated arrival " + fmt(stdDate);
  $("[data-date-rush]").textContent = "Estimated arrival " + fmt(rushDate);

  function renderTray() {
    var c = S.color === "pantone" ? S.hex : MOLD[S.color];
    tray.style.setProperty("--mold", c);
    tray.dataset.cav = S.cav; tray.dataset.shape = S.shape;
    var html = "";
    var mark = S.logo ? '<img src="' + S.logo + '" alt="">' : (S.text ? S.text.toUpperCase() : "YOUR LOGO").replace(/[<>&]/g, "");
    for (var i = 0; i < S.cav; i++) html += '<div class="cav"><span class="cav__mark">' + mark + "</span></div>";
    tray.innerHTML = html;
    $$(".tray-stage .ice").forEach(function (el) { el.dataset.shape = S.shape; });
    setMarks(S.text ? S.text.toUpperCase() : "YOUR LOGO", S.logo);
  }

  function render() {
    var e = each(S.qty, S.cav), pf = S.color === "pantone" ? PANTONE_FEE : 0, rf = S.rush ? RUSH_FEE : 0;
    var sub = e * S.qty + pf + rf;
    // header price
    $("[data-from]").textContent = money(each(1000, S.cav));
    // chips
    $$("[data-opt]").forEach(function (b) {
      var k = b.dataset.opt, v = b.dataset.v;
      b.classList.toggle("is-on", String(S[k]) === v);
      if (b.getAttribute("role") === "radio") b.setAttribute("aria-checked", String(S[k]) === v);
    });
    $(".pms").classList.toggle("is-on", S.color === "pantone");
    $("[data-color-name]").textContent = S.color === "pantone" ? "Custom Pantone" : S.color[0].toUpperCase() + S.color.slice(1);
    // tiers
    $$("[data-tier]").forEach(function (b) {
      var q = +b.dataset.tier;
      $("b", b).textContent = money(each(q, S.cav));
      b.classList.toggle("is-on", tierFor(S.qty)[0] === q);
    });
    var qi = $("[data-qty]"); if (document.activeElement !== qi) qi.value = S.qty;
    var nx = nextTier(S.qty), nudge = $("[data-nudge]");
    if (nx) {
      var saveEach = e - each(nx[0], S.cav);
      nudge.innerHTML = "<span>Add " + (nx[0] - S.qty).toLocaleString() + " more to save " + money(saveEach) + " per mold</span><button type=\"button\" data-jump=\"" + nx[0] + "\">Make it " + nx[0].toLocaleString() + "</button>";
      nudge.style.display = "";
    } else { nudge.innerHTML = "<span>Best price tier unlocked. Over 5,000? Ask for a custom quote.</span>"; }
    // delivery
    $("[data-rush-fee]").textContent = "+" + money(RUSH_FEE, 0);
    // summary
    $("[data-s-each]").textContent = money(e);
    $("[data-s-eachlbl]").textContent = "Est. price / mold (" + S.qty.toLocaleString() + ")";
    $("[data-s-qty]").textContent = S.qty.toLocaleString();
    $("[data-s-mold]").textContent = (S.shape === "round" ? "Round" : "Square") + " · " + S.cav + " cavities · " + $("[data-color-name]").textContent;
    var pr = $("[data-s-pms-row]"); pr.hidden = !pf;
    $("[data-s-del]").textContent = S.rush ? "Rush (+" + money(RUSH_FEE, 0) + ")" : "Standard (included)";
    $("[data-s-art]").textContent = S.logo ? "Uploaded" : S.text ? "Text: " + S.text : S.help ? "Designer help requested" : "Add later";
    $$("[data-s-total]").forEach(function (el) { el.textContent = money(sub); });
    // step completion
    $("[data-step='art']").classList.toggle("is-done", !!(S.logo || S.text || S.help));
    $("[data-step='qty']").classList.toggle("is-done", S.qty >= 50);
    renderTray();
    // quote data
    $("[data-quote]").innerHTML =
      "<tr><td>Custom Ice Cube Mold · " + $("[data-s-mold]").textContent + "</td><td>" + S.qty.toLocaleString() + " × " + money(e) + "</td></tr>" +
      (pf ? "<tr><td>Pantone color match (one-time)</td><td>" + money(pf) + "</td></tr>" : "") +
      "<tr><td>Delivery: " + (S.rush ? "Rush · est. " + fmt(rushDate) : "Standard · est. " + fmt(stdDate)) + "</td><td>" + (rf ? money(rf) : "Included") + "</td></tr>" +
      "<tr class=\"tot\"><td>Estimated subtotal</td><td>" + money(sub) + "</td></tr>";
    $("[data-quote-date]").textContent = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  $$("[data-opt]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.dataset.opt; S[k] = k === "cav" ? +b.dataset.v : b.dataset.v; render();
      if (hasGsap && !reduce) gsap.fromTo(tray, { scale: 0.96 }, { scale: 1, duration: 0.6, ease: "back.out(2)" });
      showLive();
    });
  });
  var pmsInput = $("[data-pms]");
  pmsInput.addEventListener("input", function () { S.hex = pmsInput.value; S.color = "pantone"; render(); showLive(); });
  $(".pms").addEventListener("click", function (e) { if (e.target !== pmsInput) { S.color = "pantone"; render(); showLive(); } });

  var qtyWrap = $("[data-qtywrap]"), qtyIn = $("[data-qty]");
  function setQty(v) {
    v = parseInt(v, 10); if (isNaN(v)) v = 50;
    qtyWrap.classList.toggle("is-err", v < 50);
    S.qty = Math.max(50, Math.min(100000, v)); render();
  }
  $("[data-minus]").addEventListener("click", function () { setQty(S.qty - (S.qty > 100 ? 50 : 10)); });
  $("[data-plus]").addEventListener("click", function () { setQty(S.qty + (S.qty >= 100 ? 50 : 10)); });
  qtyIn.addEventListener("input", function () { var v = parseInt(qtyIn.value, 10); qtyWrap.classList.toggle("is-err", !isNaN(v) && v < 50); if (v >= 50) { S.qty = Math.min(100000, v); render(); } });
  qtyIn.addEventListener("blur", function () { setQty(qtyIn.value); });
  $$("[data-tier]").forEach(function (b) { b.addEventListener("click", function () { setQty(b.dataset.tier); }); });
  $("[data-nudge]").addEventListener("click", function (e) { var j = e.target.closest("[data-jump]"); if (j) setQty(j.dataset.jump); });
  $$("input[name=delivery]").forEach(function (r) { r.addEventListener("change", function () { S.rush = r.value === "rush"; render(); }); });

  // artwork
  var drop = $("[data-drop]"), fileIn = $("[data-file]"), fileRow = $("[data-filerow]");
  function useFile(f) {
    processLogo(f, function (mark, name, orig) {
      S.logo = mark; S.logoName = name; store.set("sg_logo", mark); store.set("sg_logo_name", name);
      $("img", fileRow).src = orig; $("span", fileRow).textContent = name;
      fileRow.classList.add("is-on"); drop.classList.add("has-file"); render(); showLive();
    });
  }
  fileIn.addEventListener("change", function () { if (fileIn.files[0]) useFile(fileIn.files[0]); });
  ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("is-drag"); }); });
  drop.addEventListener("drop", function (e) { var f = e.dataTransfer.files[0]; if (f) useFile(f); });
  $("button", fileRow).addEventListener("click", function () {
    S.logo = null; store.set("sg_logo", ""); fileRow.classList.remove("is-on"); drop.classList.remove("has-file"); fileIn.value = ""; render();
  });
  if (S.logo) { $("img", fileRow).src = S.logo; $("span", fileRow).textContent = S.logoName || "Your logo"; fileRow.classList.add("is-on"); drop.classList.add("has-file"); }
  var tIn = $("[data-text]");
  tIn.value = S.text;
  tIn.addEventListener("input", function () { S.text = tIn.value.slice(0, 14); render(); showLive(); });
  $("[data-help]").addEventListener("change", function (e) { S.help = e.target.checked; render(); });

  // gallery
  var gm = $(".gal__main"), gphoto = $(".gal__photo");
  function showLive() {
    gm.classList.remove("show-photo");
    $$(".gal__tabs button").forEach(function (b) { b.classList.toggle("is-on", b.dataset.view === "live"); });
    $$(".gal__thumbs button").forEach(function (b, i) { b.classList.toggle("is-on", i === 0); });
  }
  function showPhoto(src) {
    gphoto.src = src; gm.classList.add("show-photo");
    $$(".gal__tabs button").forEach(function (b) { b.classList.toggle("is-on", b.dataset.view === "photo"); });
  }
  $$(".gal__tabs button").forEach(function (b) {
    b.addEventListener("click", function () { if (b.dataset.view === "live") showLive(); else showPhoto($$(".gal__thumbs button")[1].dataset.src); if (b.dataset.view === "photo") $$(".gal__thumbs button").forEach(function (x, i) { x.classList.toggle("is-on", i === 1); }); });
  });
  $$(".gal__thumbs button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".gal__thumbs button").forEach(function (x) { x.classList.toggle("is-on", x === b); });
      if (b.dataset.src) showPhoto(b.dataset.src); else showLive();
    });
  });

  // modal + quote
  var modal = $("[data-modal]"), lastFocus = null;
  function openModal() {
    lastFocus = document.activeElement;
    $("[data-modal-sum]").textContent = S.qty.toLocaleString() + " molds · " + $("[data-s-mold]").textContent + " · est. " + $("[data-s-total]").textContent;
    $("[data-form]").hidden = false; $("[data-ok]").hidden = true;
    modal.classList.add("is-on"); modal.setAttribute("aria-hidden", "false");
    setTimeout(function () { var f = $("input", modal); if (f) f.focus(); }, 100);
  }
  function closeModal() { modal.classList.remove("is-on"); modal.setAttribute("aria-hidden", "true"); if (lastFocus) lastFocus.focus(); }
  $$("[data-request]").forEach(function (b) { b.addEventListener("click", openModal); });
  $$("[data-close]").forEach(function (b) { b.addEventListener("click", closeModal); });
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("is-on")) closeModal(); });
  $("[data-form]").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!e.target.checkValidity()) { e.target.reportValidity(); return; }
    $("[data-form]").hidden = true; $("[data-ok]").hidden = false;
    $("[data-ok-date]").textContent = fmt(addBiz(new Date(), 3));
  });
  $$("[data-pdf]").forEach(function (b) { b.addEventListener("click", function () { render(); window.print(); }); });

  // restore url selections for delivery
  render();
})();
