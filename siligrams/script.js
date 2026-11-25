/* Siligrams V3 — shared script (home + product page) */
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

  /* ---------- pricing (demo values) ---------- */
  var TIERS = [[50, 14.0], [100, 12.5], [250, 10.75], [500, 9.5], [1000, 8.25]];
  var CAV_ADJ = { 2: -2.0, 4: 0, 6: 2.5 };
  var PANTONE_FEE = 75, RUSH_FEE = 150;
  var MOLD = { black: "#151417", navy: "#1d2f5c", red: "#a91f2b", pantone: "#2f8f83" };
  var NAMES = { black: "Black", navy: "Navy", red: "Red", pantone: "Custom Pantone" };
  function tierFor(q) { var t = TIERS[0]; TIERS.forEach(function (x) { if (q >= x[0]) t = x; }); return t; }
  function nextTier(q) { for (var i = 0; i < TIERS.length; i++) if (TIERS[i][0] > q) return TIERS[i]; return null; }
  function each(q, cav) { return Math.max(1, tierFor(q)[1] + (CAV_ADJ[cav] || 0)); }
  function money(n, d) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: d === 0 ? 0 : 2, maximumFractionDigits: d === 0 ? 0 : 2 }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function renderTray(el, s) {
    if (!el) return;
    el.style.setProperty("--mold", s.color === "pantone" ? (s.hex || MOLD.pantone) : MOLD[s.color]);
    el.dataset.cav = s.cav; el.dataset.shape = s.shape;
    var mark = s.logo ? '<img src="' + s.logo + '" alt="">' : esc((s.text || "YOUR LOGO").toUpperCase());
    var h = ""; for (var i = 0; i < s.cav; i++) h += '<div class="cav"><span class="cav__mark">' + mark + "</span></div>";
    el.innerHTML = h;
  }
  function setMarks(text, logo) {
    $$("[data-mark]").forEach(function (el) {
      if (logo) el.innerHTML = '<img src="' + logo + '" alt="">'; else el.textContent = (text || "YOUR LOGO").toUpperCase();
    });
  }

  /* ---------- logo -> white mark with alpha ---------- */
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

  /* ---------- header ---------- */
  var hdr = $("#hdr");
  function onScroll() {
    var y = window.scrollY;
    if (hdr) hdr.classList.toggle("is-scrolled", y > 8);
    var mb = $("[data-mbar]"); if (mb) mb.classList.toggle("is-on", y > window.innerHeight * 0.75);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var burger = $(".burger"), mnav = $("#mnav");
  if (burger && mnav) {
    burger.addEventListener("click", function () { var o = burger.getAttribute("aria-expanded") !== "true"; burger.setAttribute("aria-expanded", o); mnav.classList.toggle("is-open", o); });
    $$("a", mnav).forEach(function (a) { a.addEventListener("click", function () { burger.setAttribute("aria-expanded", "false"); mnav.classList.remove("is-open"); }); });
  }

  /* ---------- hero try-it ---------- */
  var tryIn = $("#tryText"), heroCta = $("[data-hero-cta]");
  if (tryIn) {
    tryIn.addEventListener("input", function () {
      var t = tryIn.value.trim(); store.set("sg_logo", "");
      setMarks(t || "YOUR LOGO");
      if (heroCta) heroCta.href = "custom-ice-cube-mold/" + (t ? "?text=" + encodeURIComponent(t) : "");
      if (G && !reduce) gsap.fromTo(".try .cube", { scale: 0.92 }, { scale: 1, duration: 0.6, ease: "back.out(2.5)", overwrite: true });
    });
    var up = $("[data-logo-input]");
    if (up) up.addEventListener("change", function () {
      processLogo(up.files[0], function (mark, name) { store.set("sg_logo", mark); store.set("sg_logo_name", name); setMarks("", mark); if (window._renderMini) window._renderMini(); });
    });
  }

  /* ---------- home builder ---------- */
  var mini = $("[data-mini]");
  if (mini) {
    var ms = { shape: "square", cav: 6, color: "black", qty: 250 };
    var range = $("[data-mini-range]", mini), mtray = $("[data-mini-tray]", mini);
    var renderMini = window._renderMini = function () {
      var e = each(ms.qty, ms.cav), base = each(50, ms.cav), nt = nextTier(ms.qty);
      var txt = (tryIn && tryIn.value.trim()) || "";
      $("[data-mini-qty]", mini).textContent = ms.qty.toLocaleString() + (ms.qty >= 1000 ? "+" : "") + " molds";
      $("[data-mini-each]", mini).textContent = money(e);
      $("[data-mini-total]", mini).textContent = money(e * ms.qty + (ms.color === "pantone" ? PANTONE_FEE : 0));
      $("[data-color-lbl]", mini).textContent = NAMES[ms.color];
      var save = Math.round((1 - e / base) * 100);
      $("[data-mini-save]", mini).textContent = save > 0
        ? "You save " + save + "% per mold vs. 50 molds" + (nt ? " · next price break at " + nt[0].toLocaleString() : " · best price tier")
        : "Order 100+ to save " + Math.round((1 - each(100, ms.cav) / base) * 100) + "% per mold";
      range.style.setProperty("--p", ((ms.qty - 50) / 950 * 100) + "%");
      var t = tierFor(ms.qty)[0];
      $$("[data-t]", mini).forEach(function (s) { s.classList.toggle("on", +s.dataset.t === t); });
      renderTray(mtray, { shape: ms.shape, cav: ms.cav, color: ms.color, text: txt || "YOUR LOGO", logo: store.get("sg_logo") || null });
      var q = { shape: ms.shape, cav: ms.cav, color: ms.color, qty: ms.qty }; if (txt) q.text = txt;
      $("[data-mini-go]", mini).href = "custom-ice-cube-mold/?" + new URLSearchParams(q).toString();
    };
    $$("[data-group]", mini).forEach(function (g) {
      $$("button", g).forEach(function (b) {
        b.addEventListener("click", function () {
          $$("button", g).forEach(function (x) { x.classList.toggle("on", x === b); });
          var k = g.dataset.group; ms[k] = k === "cav" ? +b.dataset.v : b.dataset.v; renderMini();
          if (G && !reduce) gsap.fromTo(mtray, { scale: 0.95 }, { scale: 1, duration: 0.7, ease: "back.out(2)" });
        });
      });
    });
    range.addEventListener("input", function () { ms.qty = +range.value; renderMini(); });
    $$("[data-t]", mini).forEach(function (s) { s.addEventListener("click", function () { ms.qty = +s.dataset.t; range.value = ms.qty; renderMini(); }); });
    if (tryIn) tryIn.addEventListener("input", renderMini);
    renderMini();
  }

  /* ---------- use-case tabs ---------- */
  var UC = [
    { img: "img/bar-s-cube.jpg", h: "Make your signature serve unforgettable.", p: "Guests photograph a logo cube. They post it, tag you and come back for it. A Siligrams mold turns every cocktail into marketing.", l: ["Freezes crisp, slow-melting 2″ cubes", "Holds up to daily bar use", "Reorder the same design in one click"], c: "Design for your bar" },
    { img: "img/uc-corporate.jpg", h: "Brand the serve, not just the bottle.", p: "Put your mark in the glass at tastings, activations and on-premise accounts, exactly where the drinking happens.", l: ["Exact Pantone match to your brand", "Great for sampling and trade events", "Unbranded proofs for your agency"], c: "Brand your serve" },
    { img: "img/uc-spirits.jpg", h: "A client gift they actually use.", p: "Logo ice molds live in the freezer and come out every weekend. Your brand, remembered with every drink.", l: ["Gift-ready for clients and teams", "Net terms for approved accounts", "Blind shipping available"], c: "Plan your gifts" },
    { img: "img/uc-greek.jpg", h: "Your logo in every photo of the night.", p: "Galas, reunions, launches and conferences. Logo ice is the detail guests notice, photograph and talk about.", l: ["Rush production for fixed dates", "Estimated arrival shown upfront", "Multiple designs per order"], c: "Plan your event" },
    { img: "img/uc-date.jpg", h: "Toast with your initials on the rocks.", p: "Three ready designs with your initials and date. Pay at checkout, approve your proof, and we freeze the rest.", l: ["Initials, initials + date or heart", "10% below custom pricing", "Proof before production"], c: "Shop wedding favors", href: "#wedding" }
  ];
  var tabs = $$("[data-tab]");
  if (tabs.length) {
    var ucImg = $("[data-uc-img]"), copy = $(".usecase__copy");
    var setUC = function (i) {
      var d = UC[i];
      tabs.forEach(function (t, k) { t.setAttribute("aria-selected", k === i); });
      ucImg.style.opacity = 0; $$(":scope > *", copy).forEach(function (el) { el.classList.add("fade"); });
      setTimeout(function () {
        ucImg.src = d.img; ucImg.alt = d.h;
        $("[data-uc-h]").textContent = d.h; $("[data-uc-p]").textContent = d.p;
        $("[data-uc-list]").innerHTML = d.l.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
        var cta = $("[data-uc-cta]"); cta.firstChild.textContent = d.c + " "; cta.href = d.href || "custom-ice-cube-mold/";
        ucImg.style.opacity = 1; $$(":scope > *", copy).forEach(function (el) { el.classList.remove("fade"); });
      }, 260);
    };
    tabs.forEach(function (t, i) { t.addEventListener("click", function () { setUC(i); }); });
    $("[data-uc-img]").alt = UC[0].h;
  }

  /* ---------- gallery nav ---------- */
  var gt = $("[data-gal-track]");
  $$("[data-gal]").forEach(function (b) {
    b.addEventListener("click", function () { var f = gt.querySelector("figure"); gt.scrollBy({ left: (+b.dataset.gal) * (f.getBoundingClientRect().width + 16) * 2, behavior: "smooth" }); });
  });

  /* ---------- wedding live preview ---------- */
  var w1 = $("[data-w1]"), w2 = $("[data-w2]"), wd = $("[data-wd]");
  if (w1) {
    var upd = function () {
      var a = (w1.value || "A").toUpperCase(), b = (w2.value || "J").toUpperCase();
      $$("[data-wt]").forEach(function (el) { el.textContent = a + "&" + b; });
      $("[data-wdate]").textContent = wd.value || "06.20.27";
    };
    [w1, w2, wd].forEach(function (i) { i.addEventListener("input", upd); i.addEventListener("focus", function () { i.select(); }); });
  }

  /* ---------- CRO notes ---------- */
  var nt = $("[data-notes-toggle]");
  if (nt && window.CRO_NOTES) {
    var set = window.CRO_NOTES[isPdp ? "pdp" : "home"];
    nt.addEventListener("click", function () {
      var on = !document.body.classList.contains("notes-on");
      document.body.classList.toggle("notes-on", on); nt.setAttribute("aria-pressed", on);
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

  /* ---------- motion: restrained, smooth ---------- */
  if (G && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    if (typeof window.Lenis !== "undefined") {
      var lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) { var id = a.getAttribute("href"); if (id.length < 2) return; var t = $(id); if (!t) return; e.preventDefault(); lenis.scrollTo(t, { offset: -80 }); });
      });
    }
    var rise = function (targets, trigger, opts) {
      gsap.from(targets, Object.assign({ y: 32, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: trigger || targets, start: "top 86%" } }, opts || {}));
    };
    if ($(".hero")) {
      var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".rating", { y: 16, opacity: 0, duration: 0.7 })
        .from(".hero__h .ln", { y: 40, opacity: 0, duration: 1, stagger: 0.1 }, 0.05)
        .from(".hero__p, .hero__ctas, .hero .ticks", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.3)
        .from(".hero__main", { y: 30, opacity: 0, scale: 0.97, duration: 1.2 }, 0.15)
        .from(".hero__photo, .try", { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, 0.35)
        .from(".hero__main img", { scale: 1.12, duration: 1.6 }, 0.15);
      gsap.to(".hero__main img", { yPercent: -4, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }
    if (!isPdp) {
    $$(".head, .reviews__top > div, .gal__head > div").forEach(function (h) { rise(h.children, h); });
    rise(".prop", ".props");
    rise(".step", ".steps", { y: 50, stagger: 0.1 });
    rise(".bld__vis, .bld__ui", ".bld", { y: 50 });
    gsap.from("[data-mini-tray]", { rotateX: 70, rotateZ: -50, scale: 0.8, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".bld", start: "top 75%" } });
    rise(".tabs, .usecase", ".uses .tabs");
    rise(".rc", ".rgrid", { y: 40 });
    rise(".why__grid > div:first-child > *, .cmp", ".why");
    gsap.from(".cmp__r", { x: -20, opacity: 0, duration: 0.6, stagger: 0.05, ease: "power2.out", scrollTrigger: { trigger: ".cmp", start: "top 80%" } });
    rise(".gal__track figure", ".gal__track", { x: 40, y: 0 });
    rise(".wed__copy > *", ".wed__panel");
    gsap.from(".wc", { y: 60, rotate: function (i) { return [-8, 3, 8][i]; }, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".wed__cubes", start: "top 85%" } });
    rise(".mc", ".more__grid");
    rise(".faq__grid > div:first-child > *, .acc details", ".faq");
    rise(".cta__panel", ".cta", { y: 50 });
    }
    if (isPdp) {
      gsap.from(".gal-p__main", { opacity: 0, y: 20, duration: 1, ease: "power3.out" });
      gsap.from(".bb > *", { y: 20, opacity: 0, stagger: 0.04, duration: 0.8, ease: "power3.out", delay: 0.1 });
      gsap.from("[data-tray]", { rotateX: 70, rotateZ: -50, scale: 0.85, opacity: 0, duration: 1.6, ease: "expo.out", delay: 0.15 });
    }
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
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
  function addBiz(d, n) { d = new Date(d); while (n > 0) { d.setDate(d.getDate() + 1); var w = d.getDay(); if (w !== 0 && w !== 6) n--; } return d; }
  function fmt(d) { return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); }
  var stdDate = addBiz(new Date(), 18), rushDate = addBiz(new Date(), 11);
  $("[data-date-std]").textContent = "Estimated arrival " + fmt(stdDate);
  $("[data-date-rush]").textContent = "Estimated arrival " + fmt(rushDate);

  function render() {
    var e = each(S.qty, S.cav), pf = S.color === "pantone" ? PANTONE_FEE : 0, rf = S.rush ? RUSH_FEE : 0, sub = e * S.qty + pf + rf;
    $("[data-from]").textContent = money(each(1000, S.cav));
    $$("[data-opt]").forEach(function (b) { var on = String(S[b.dataset.opt]) === b.dataset.v; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); });
    $(".pmsbtn").classList.toggle("on", S.color === "pantone");
    $("[data-color-name]").textContent = NAMES[S.color];
    $$("[data-tier]").forEach(function (b) { var q = +b.dataset.tier; $("b", b).textContent = money(each(q, S.cav)); b.classList.toggle("on", tierFor(S.qty)[0] === q); });
    var qi = $("[data-qty]"); if (document.activeElement !== qi) qi.value = S.qty;
    var nx = nextTier(S.qty);
    $("[data-nudge]").innerHTML = nx
      ? "<span>Add " + (nx[0] - S.qty).toLocaleString() + " more to save " + money(e - each(nx[0], S.cav)) + " per mold</span><button type=\"button\" data-jump=\"" + nx[0] + "\">Make it " + nx[0].toLocaleString() + "</button>"
      : "<span>Best price tier unlocked. Over 5,000? Ask for a custom quote.</span>";
    $("[data-rush-fee]").textContent = "+" + money(RUSH_FEE, 0);
    $("[data-s-each]").textContent = money(e);
    $("[data-s-eachlbl]").textContent = "Est. price / mold (" + S.qty.toLocaleString() + ")";
    $("[data-s-qty]").textContent = S.qty.toLocaleString();
    var moldTxt = (S.shape === "round" ? "Round" : "Square") + " · " + S.cav + " cavities · " + NAMES[S.color];
    $("[data-s-mold]").textContent = moldTxt;
    $("[data-s-pms-row]").hidden = !pf;
    $("[data-s-del]").textContent = S.rush ? "Rush (+" + money(RUSH_FEE, 0) + ")" : "Standard (included)";
    $("[data-s-art]").textContent = S.logo ? "Logo uploaded" : S.text ? "Text: " + S.text : S.help ? "Designer help requested" : "Add later";
    $$("[data-s-total]").forEach(function (el) { el.textContent = money(sub); });
    $("[data-step='art']").classList.toggle("is-done", !!(S.logo || S.text || S.help));
    renderTray(tray, S);
    setMarks(S.text || "YOUR LOGO", S.logo);
    $("[data-quote]").innerHTML =
      "<tr><td>Custom Ice Cube Mold · " + moldTxt + "</td><td>" + S.qty.toLocaleString() + " × " + money(e) + "</td></tr>" +
      (pf ? "<tr><td>Pantone color match (one-time)</td><td>" + money(pf) + "</td></tr>" : "") +
      "<tr><td>Delivery: " + (S.rush ? "Rush · est. " + fmt(rushDate) : "Standard · est. " + fmt(stdDate)) + "</td><td>" + (rf ? money(rf) : "Included") + "</td></tr>" +
      "<tr class=\"tot\"><td>Estimated subtotal</td><td>" + money(sub) + "</td></tr>";
    $("[data-quote-date]").textContent = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  var gm = $(".gal-p__main"), gphoto = $(".gal-p__photo");
  function showLive() {
    gm.classList.remove("show-photo");
    $$(".gal-p__tabs button").forEach(function (b) { b.classList.toggle("on", b.dataset.view === "live"); });
    $$(".gal-p__thumbs button").forEach(function (b, i) { b.classList.toggle("on", i === 0); });
  }
  function showPhoto(src, idx) {
    gphoto.src = src; gm.classList.add("show-photo");
    $$(".gal-p__tabs button").forEach(function (b) { b.classList.toggle("on", b.dataset.view === "photo"); });
    $$(".gal-p__thumbs button").forEach(function (b, i) { b.classList.toggle("on", i === idx); });
  }
  $$(".gal-p__tabs button").forEach(function (b) { b.addEventListener("click", function () { if (b.dataset.view === "live") showLive(); else showPhoto($$(".gal-p__thumbs button")[1].dataset.src, 1); }); });
  $$(".gal-p__thumbs button").forEach(function (b, i) { b.addEventListener("click", function () { if (b.dataset.src) showPhoto(b.dataset.src, i); else showLive(); }); });

  $$("[data-opt]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.dataset.opt; S[k] = k === "cav" ? +b.dataset.v : b.dataset.v; render(); showLive();
      if (G && !reduce) gsap.fromTo(tray, { scale: 0.96 }, { scale: 1, duration: 0.7, ease: "back.out(2)" });
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
      render(); showLive();
    });
  }
  fIn.addEventListener("change", function () { if (fIn.files[0]) useFile(fIn.files[0]); });
  ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("is-drag"); }); });
  drop.addEventListener("drop", function (e) { var f = e.dataTransfer.files[0]; if (f) useFile(f); });
  $("button", fRow).addEventListener("click", function () { S.logo = null; store.set("sg_logo", ""); fRow.classList.remove("is-on"); drop.classList.remove("has-file"); fIn.value = ""; render(); });
  if (S.logo) { $("img", fRow).src = S.logo; $("span", fRow).textContent = S.logoName || "Your logo"; fRow.classList.add("is-on"); drop.classList.add("has-file"); }
  var tIn = $("[data-text]"); tIn.value = S.text;
  tIn.addEventListener("input", function () { S.text = tIn.value.slice(0, 16); render(); showLive(); });
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
