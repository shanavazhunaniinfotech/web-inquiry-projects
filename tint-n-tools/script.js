/* Tint N Tools · Design A "Noir" */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (!hasGsap) root.classList.add("no-gsap");
  if (reduce) root.classList.add("no-motion");

  $("#yr").textContent = new Date().getFullYear();

  /* ---------- toast ---------- */
  var tt;
  function toast(m) { var t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove("show"); }, 3400); }
  $$(".js-wholesale").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); toast("Demo: this opens your wholesale store login."); }); });

  /* ---------- smooth scroll ---------- */
  var lenis = null;
  if (hasGsap && window.Lenis && !reduce) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function goTo(target) {
    var el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  $$('a[href^="#"]').forEach(function (a) {
    var h = a.getAttribute("href");
    if (h.length < 2) return;
    a.addEventListener("click", function (e) { if ($(h)) { e.preventDefault(); goTo(h); closeMenu(); } });
  });

  /* ---------- nav ---------- */
  var nav = $("#nav"), burger = $("#burger"), links = $("#links"), dock = $("#dock");
  function closeMenu() { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", function () { var o = links.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle("solid", y > 60);
    var book = $("#book").getBoundingClientRect();
    var inBook = book.top < window.innerHeight * .6 && book.bottom > 0;
    dock.classList.toggle("show", y > window.innerHeight * .8 && !inBook);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- cursor + magnetic ---------- */
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine && !reduce) {
    var cur = $("#cursor"), ctxt = $("#cursorTxt"), cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; cur.classList.add("on"); });
    (function loop() { cx += (tx - cx) * .2; cy += (ty - cy) * .2; cur.style.transform = "translate(" + cx + "px," + cy + "px)"; requestAnimationFrame(loop); })();
    $$("[data-cursor]").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ctxt.textContent = el.dataset.cursor; cur.classList.add("big"); });
      el.addEventListener("mouseleave", function () { cur.classList.remove("big"); });
    });
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * .3, y = (e.clientY - r.top - r.height / 2) * .4;
        b.style.transform = "translate(" + x + "px," + y + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }

  /* ---------- instant price ---------- */
  var P = window.TintPrice, sel = { v: "sedan", f: "ceramic", c: "std" }, shownLow = 319, shownHigh = 389;
  function money(n) { return Math.round(n).toLocaleString(); }
  function updatePrice() {
    var r = P.calc(sel.v, sel.f, sel.c);
    if (hasGsap && !reduce) {
      var o = { a: shownLow, b: shownHigh };
      gsap.to(o, { a: r[0], b: r[1], duration: .7, ease: "power3.out", onUpdate: function () { $("#pLow").textContent = money(o.a); $("#pHigh").textContent = money(o.b); } });
    } else { $("#pLow").textContent = money(r[0]); $("#pHigh").textContent = money(r[1]); }
    shownLow = r[0]; shownHigh = r[1];
    $("#sumEst").textContent = "$" + money(r[0]) + "–$" + money(r[1]);
  }
  function setSeg(key, val) {
    sel[key] = val;
    $$('.seg[data-key="' + key + '"] button').forEach(function (b) { b.classList.toggle("on", b.dataset.val === val); });
    updatePrice();
  }
  $$(".seg").forEach(function (g) {
    $$("button", g).forEach(function (b) { b.addEventListener("click", function () { setSeg(g.dataset.key, b.dataset.val); }); });
  });
  $$(".js-pick").forEach(function (b) { b.addEventListener("click", function () { setSeg("f", b.dataset.film); toast(P.names[b.dataset.film] + " selected. Your estimate is updated."); }); });

  /* ---------- booking ---------- */
  var steps = $$(".step"), prog = $$("#progress li"), stepNow = 1;
  var api = window.TintBooking({
    title: "#calTitle", prev: "#prevM", next: "#nextM", days: "#days", slots: "#slots", slotTitle: "#slotTitle",
    picked: "#picked", chips: "#chips", service: "#service", form: "#form", done: "#done", doneText: "#doneTxt", again: "#again",
    toast: toast,
    onChange: function (s) {
      $("#sumSvc").textContent = s.service || "Not chosen";
      var auto = !s.service || s.service === "Automotive Tint";
      $("#sumEst").textContent = auto ? "$" + money(shownLow) + "–$" + money(shownHigh) : (s.service === "Paint Protection / Ceramic Coating" ? "From $499" : "Free on-site estimate");
      if (!s.service && !s.date) show(1);
    }
  });
  $("#slotsLeft").textContent = Math.max(3, Math.min(api.openThisWeek, 12));
  function show(n) {
    stepNow = n;
    steps.forEach(function (s) { var on = +s.dataset.step === n; s.hidden = !on; if (on) { s.classList.remove("enter"); void s.offsetWidth; s.classList.add("enter"); } });
    prog.forEach(function (p, i) { p.classList.toggle("on", i < n); });
    if (hasGsap) ScrollTrigger.refresh();
  }
  $$("[data-go]").forEach(function (b) {
    b.addEventListener("click", function () {
      var to = +b.dataset.go;
      if (to === 2 && !api.state.service) { $("#chips").classList.add("bad"); toast("Pick what we're tinting first."); return; }
      if (to === 3 && !api.state.time) toast("No time picked. No problem, we'll call you to schedule.");
      show(to);
    });
  });
  $$("[data-service]").forEach(function (a) { a.addEventListener("click", function () { if (stepNow === 1) setTimeout(function () { show(2); }, 50); }); });

  /* ---------- shade guide ---------- */
  function shade(v) {
    $("#shadeFilm").style.opacity = ((1 - v / 100) * .93).toFixed(2);
    $$("#shadeList button").forEach(function (b) { var on = +b.dataset.v === v; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); });
    var el = $("#shadeNum");
    if (hasGsap && !reduce) { var o = { n: +el.textContent }; gsap.to(o, { n: v, duration: .6, ease: "power3.out", onUpdate: function () { el.textContent = Math.round(o.n); } }); }
    else el.textContent = v;
  }
  $$("#shadeList button").forEach(function (b) { b.addEventListener("click", function () { shade(+b.dataset.v); }); });
  shade(35);

  /* ---------- before / after ---------- */
  var baR = $("#baRange");
  function ba(v) { $("#baAfter").style.clipPath = "inset(0 0 0 " + v + "%)"; $("#baLine").style.left = v + "%"; }
  baR.addEventListener("input", function () { ba(baR.value); });
  ba(baR.value);

  /* ---------- hero film helpers ---------- */
  var film = $("#film"), vltNum = $("#vltNum"), vltBar = $("#vltBar");
  function setFilm(p) {
    film.style.setProperty("--p", p + "%");
    var v = Math.round(100 - p * .8);
    vltNum.textContent = v; vltBar.style.width = p + "%";
  }

  /* ---------- split words for scrub ---------- */
  var scrub = $("#scrub");
  (function split(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) frag.appendChild(document.createTextNode(w));
          else { var s = document.createElement("span"); s.className = "sw"; s.textContent = w; frag.appendChild(s); }
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === 1) split(n);
    });
  })(scrub);

  /* ---------- no animation fallback ---------- */
  function countAll() {
    $$("[data-count]").forEach(function (el) {
      var end = +el.dataset.count, suf = el.dataset.suffix || "";
      if (!hasGsap || reduce) { el.textContent = end.toLocaleString() + suf; return; }
      var o = { n: 0 }; gsap.to(o, { n: end, duration: 2, ease: "power3.out", onUpdate: function () { el.textContent = Math.round(o.n).toLocaleString() + suf; } });
    });
  }

  if (!hasGsap || reduce) {
    $("#pre").classList.add("gone");
    setFilm(45);
    $$(".sw").forEach(function (s) { s.style.opacity = 1; });
    $$(".pk").forEach(function (p) { p.classList.add("in"); });
    countAll();
    return;
  }

  /* =================== GSAP =================== */
  gsap.registerPlugin(ScrollTrigger);

  // Preloader → intro
  var pre = $("#pre"), num = $("#preNum"), o = { n: 0 };
  setFilm(0);
  gsap.set(".h-hero .w", { yPercent: 115 });
  gsap.set([".hero-sub", ".hero-proof", ".vlt", ".eyebrow:first-child"], { opacity: 0, y: 20 });
  gsap.set(".quote-card", { opacity: 0, y: 60 });
  gsap.set(".hero-foot", { opacity: 0 });

  var intro = gsap.timeline({ paused: true });
  intro
    .to(".hero-img", { scale: 1.02, duration: 2.2, ease: "expo.out" }, 0)
    .to(".h-hero .w", { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: .07 }, .1)
    .to([".hero-copy .eyebrow", ".hero-sub", ".hero-proof", ".vlt"], { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: .08 }, .5)
    .to(".quote-card", { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }, .6)
    .to(".hero-foot", { opacity: 1, duration: 1, onStart: countAll }, .9)
    .to({ p: 0 }, { p: 28, duration: 1.6, ease: "power2.inOut", onUpdate: function () { setFilm(this.targets()[0].p); } }, .7);

  gsap.timeline()
    .to(o, { n: 100, duration: 1.3, ease: "power2.inOut", onUpdate: function () { num.textContent = Math.round(o.n); } })
    .to(".pre-film", { width: "100%", duration: 1.3, ease: "power2.inOut" }, 0)
    .to(pre, { yPercent: -100, duration: .9, ease: "expo.inOut" }, "+=.1")
    .add(function () { intro.play(); }, "-=.45")
    .add(function () { pre.classList.add("gone"); });

  var mm = gsap.matchMedia();

  // Hero: film sweeps as you scroll
  mm.add("(min-width: 981px)", function () {
    ScrollTrigger.create({
      trigger: ".hero", start: "top top", end: "+=70%", pin: true, scrub: .6,
      onUpdate: function (self) { if (intro.progress() > .9) setFilm(28 + self.progress * 72); }
    });
  });
  mm.add("(max-width: 980px)", function () {
    ScrollTrigger.create({ trigger: ".hero", start: "top top", end: "bottom top", scrub: .6,
      onUpdate: function (self) { if (intro.progress() > .9) setFilm(28 + self.progress * 72); } });
  });

  // Manifesto scrub
  gsap.to(".sw", { opacity: 1, stagger: .05, ease: "none",
    scrollTrigger: { trigger: ".manifesto", start: "top 75%", end: "bottom 60%", scrub: .5 } });

  // Horizontal services
  mm.add("(min-width: 981px)", function () {
    var track = $("#hsTrack");
    var dist = function () { return track.scrollWidth - window.innerWidth; };
    var tl = gsap.timeline({ scrollTrigger: { trigger: ".hs", start: "top top", end: function () { return "+=" + dist(); }, pin: ".hs-pin", scrub: .8, invalidateOnRefresh: true } });
    tl.to(track, { x: function () { return -dist(); }, ease: "none" }, 0)
      .to(".hs-head", { opacity: 0, x: -80, ease: "none", duration: .25 }, 0);
    $$(".panel img").forEach(function (img) {
      gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: ".hs", start: "top top", end: function () { return "+=" + dist(); }, scrub: true } });
    });
  });

  // Before/after: pinned auto-reveal
  mm.add("(min-width: 981px)", function () {
    var st = { v: 80 };
    gsap.to(st, { v: 12, ease: "none", onUpdate: function () { baR.value = st.v; ba(st.v); },
      scrollTrigger: { trigger: ".ba-sec", start: "top top", end: "+=90%", pin: ".ba-pin", scrub: .6 } });
  });
  mm.add("(max-width: 980px)", function () {
    var st = { v: 80 };
    gsap.to(st, { v: 25, ease: "none", onUpdate: function () { baR.value = st.v; ba(st.v); },
      scrollTrigger: { trigger: ".ba-frame", start: "top 85%", end: "bottom 40%", scrub: .6 } });
  });

  // Section heads: big type rises
  $$(".h2").forEach(function (h) {
    if (h.closest(".hero")) return;
    gsap.from(h, { yPercent: 30, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 88%" } });
  });

  // Reveal batches
  ScrollTrigger.batch(".reveal", {
    start: "top 88%",
    onEnter: function (els) { els.forEach(function (e) { e.classList.add("in"); }); gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: .1 }); }
  });

  // Work parallax
  $$(".wk img").forEach(function (img) {
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
  });

  // Shade view zoom
  gsap.from(".shade-view", { clipPath: "inset(12% 12% 12% 12% round 30px)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".shade-view", start: "top 80%" } });

  // Final mega
  gsap.fromTo(".final-bg", { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".final", start: "top bottom", end: "bottom bottom", scrub: true } });
  gsap.from(".mega", { scale: .7, opacity: 0, ease: "none", scrollTrigger: { trigger: ".final", start: "top 80%", end: "center center", scrub: true } });
  gsap.from(".foot-word", { yPercent: 60, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".foot-word", start: "top 95%" } });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
