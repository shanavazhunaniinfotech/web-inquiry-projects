/* Tint N Tools · Design B "Lumière" */
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

  var tt;
  function toast(m) { var t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove("show"); }, 3400); }
  $$(".js-wholesale").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); toast("Demo: this opens your wholesale store login."); }); });

  /* smooth scroll */
  var lenis = null;
  if (hasGsap && window.Lenis && !reduce) {
    lenis = new window.Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function goTo(sel) {
    var el = $(sel); if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.4 }); else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  $$('a[href^="#"]').forEach(function (a) {
    var h = a.getAttribute("href"); if (h.length < 2) return;
    a.addEventListener("click", function (e) { if ($(h)) { e.preventDefault(); goTo(h); closeMenu(); } });
  });

  /* nav + dock */
  var nav = $("#nav"), burger = $("#burger"), links = $("#links"), dock = $("#dock");
  function closeMenu() { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", function () { var o = links.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle("solid", y > 30);
    var b = $("#book").getBoundingClientRect();
    dock.classList.toggle("show", y > window.innerHeight && !(b.top < window.innerHeight * .6 && b.bottom > 0));
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* magnetic */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce) {
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * .25 + "px," + (e.clientY - r.top - r.height / 2) * .35 + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }

  /* pricing state shared by calculator, tiers and summary */
  var P = window.TintPrice, sel = { v: "sedan", f: "ceramic", c: "std" }, shown = [319, 389];
  function money(n) { return Math.round(n).toLocaleString(); }
  function tween(el, to) {
    var from = +el.textContent.replace(/,/g, "") || 0;
    if (!hasGsap || reduce) { el.textContent = money(to); return; }
    var o = { n: from }; gsap.to(o, { n: to, duration: .7, ease: "power3.out", onUpdate: function () { el.textContent = money(o.n); } });
  }
  function update() {
    var r = P.calc(sel.v, sel.f, sel.c); shown = r;
    tween($("#pLow"), r[0]); tween($("#pHigh"), r[1]);
    $$("[data-tier]").forEach(function (el) { tween(el, P.calc(sel.v, el.dataset.tier, "std")[0]); });
    var s = api && api.state.service;
    if (!s || s === "Automotive Tint") $("#sumEst").textContent = "$" + money(r[0]) + "–$" + money(r[1]);
  }
  function setKey(k, v) {
    sel[k] = v;
    $$('.seg[data-key="' + k + '"] button').forEach(function (b) { b.classList.toggle("on", b.dataset.val === v); });
    if (k === "v") setVt(v);
    update();
  }
  $$(".seg").forEach(function (g) { $$("button", g).forEach(function (b) { b.addEventListener("click", function () { setKey(g.dataset.key, b.dataset.val); }); }); });

  // vehicle toggle in pricing
  var vtBtns = $$("#vt button"), pill = $("#vtPill");
  function setVt(v) {
    vtBtns.forEach(function (b) {
      var on = b.dataset.val === v; b.classList.toggle("on", on); b.setAttribute("aria-checked", on);
      if (on) { pill.style.left = b.offsetLeft + "px"; pill.style.width = b.offsetWidth + "px"; }
    });
  }
  vtBtns.forEach(function (b) { b.addEventListener("click", function () { setKey("v", b.dataset.val); }); });
  window.addEventListener("resize", function () { setVt(sel.v); });
  $$(".js-pick").forEach(function (b) { b.addEventListener("click", function () { setKey("f", b.dataset.film); toast(P.names[b.dataset.film] + " selected for your " + P.names[sel.v] + "."); }); });

  /* booking */
  var steps = $$(".step"), progLis = $$("#progress li"), stepNow = 1;
  var api = window.TintBooking({
    title: "#calTitle", prev: "#prevM", next: "#nextM", days: "#days", slots: "#slots", slotTitle: "#slotTitle",
    picked: "#picked", chips: "#chips", service: "#service", form: "#form", done: "#done", doneText: "#doneTxt", again: "#again",
    toast: toast,
    onChange: function (s) {
      $("#sumSvc").textContent = s.service || "Not chosen";
      $("#sumEst").textContent = !s.service || s.service === "Automotive Tint" ? "$" + money(shown[0]) + "–$" + money(shown[1]) : (s.service.indexOf("Paint") === 0 ? "From $499" : "Free on-site estimate");
      if (!s.service && !s.date) show(1);
    }
  });
  $("#slotsLeft").textContent = Math.max(3, Math.min(api.openThisWeek, 12));
  function show(n) {
    stepNow = n;
    steps.forEach(function (s) { var on = +s.dataset.step === n; s.hidden = !on; if (on) { s.classList.remove("enter"); void s.offsetWidth; s.classList.add("enter"); } });
    progLis.forEach(function (p, i) { p.classList.toggle("on", i < n); });
    $("#progBar").style.width = (n / 3 * 100) + "%";
    if (hasGsap) ScrollTrigger.refresh();
  }
  $$("[data-go]").forEach(function (b) {
    b.addEventListener("click", function () {
      var to = +b.dataset.go;
      if (to === 2 && !api.state.service) { $("#chips").classList.add("bad"); toast("Choose a service first."); return; }
      if (to === 3 && !api.state.time) toast("No time picked? No problem, we'll call to schedule.");
      show(to);
    });
  });
  $$("#chips [data-s]").forEach(function (c) { c.addEventListener("click", function () { setTimeout(function () { show(2); }, 350); }); });
  $$("[data-service]").forEach(function (a) { a.addEventListener("click", function () { if (stepNow === 1) setTimeout(function () { show(2); }, 50); }); });

  /* shade dial */
  var notes = [[10, "Limo dark. Maximum privacy, best for rear windows."], [25, "Dark and private. Our most-requested rear shade."], [42, "The sweet spot. Sleek look, clear night vision."], [60, "Subtle and classy, with crystal-clear visibility."], [101, "Barely there. Pure heat and UV protection."]];
  var vlt = $("#vlt");
  function shade() {
    var v = +vlt.value;
    $("#shadeFilm").style.opacity = ((1 - v / 100) * .93).toFixed(2);
    $("#vltNum").textContent = v;
    for (var i = 0; i < notes.length; i++) if (v < notes[i][0]) { $("#vltTxt").textContent = notes[i][1]; break; }
  }
  vlt.addEventListener("input", shade); shade();

  /* before/after */
  var baR = $("#baRange");
  function ba(v) { $("#baAfter").style.clipPath = "inset(0 0 0 " + v + "%)"; $("#baLine").style.left = v + "%"; }
  baR.addEventListener("input", function () { ba(baR.value); }); ba(baR.value);

  /* gallery */
  var gal = $("#gal");
  $$("#filters button").forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.dataset.f;
      $$("#filters button").forEach(function (x) { x.classList.toggle("on", x === b); });
      $$("figure", gal).forEach(function (fig) { fig.classList.toggle("hide", f !== "all" && fig.dataset.c !== f); });
      gal.scrollTo({ left: 0, behavior: "smooth" });
    });
  });
  $("#gPrev").addEventListener("click", function () { gal.scrollBy({ left: -gal.clientWidth * .6, behavior: "smooth" }); });
  $("#gNext").addEventListener("click", function () { gal.scrollBy({ left: gal.clientWidth * .6, behavior: "smooth" }); });
  var down = false, sx = 0, sl = 0;
  gal.addEventListener("mousedown", function (e) { down = true; sx = e.pageX; sl = gal.scrollLeft; gal.style.scrollSnapType = "none"; });
  window.addEventListener("mouseup", function () { if (down) { down = false; gal.style.scrollSnapType = ""; } });
  gal.addEventListener("mousemove", function (e) { if (down) { e.preventDefault(); gal.scrollLeft = sl - (e.pageX - sx); } });

  /* reviews */
  var qs = $$(".q"), qi = 0, timer;
  function showQ(i) { qi = (i + qs.length) % qs.length; qs.forEach(function (q, n) { q.classList.toggle("on", n === qi); }); $("#rCount").textContent = "0" + (qi + 1) + " / 0" + qs.length; }
  function auto() { clearInterval(timer); if (!reduce) timer = setInterval(function () { showQ(qi + 1); }, 6500); }
  $("#rPrev").addEventListener("click", function () { showQ(qi - 1); auto(); });
  $("#rNext").addEventListener("click", function () { showQ(qi + 1); auto(); });
  auto();

  /* split words for statement */
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
      } else if (n.nodeType === 1) { if (n.tagName === "EM") n.classList.add("sw"); else split(n); }
    });
  })($("#lead"));

  setVt(sel.v);

  function countEl(el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || "";
    if (!hasGsap || reduce) { el.textContent = end.toLocaleString() + suf; return; }
    var o = { n: 0 }; gsap.to(o, { n: end, duration: 2, ease: "power3.out", onUpdate: function () { el.textContent = Math.round(o.n).toLocaleString() + suf; } });
  }

  if (!hasGsap || reduce) {
    $("#curtain").classList.add("gone");
    $$(".sw").forEach(function (s) { s.style.opacity = 1; });
    $$(".tier").forEach(function (t) { t.classList.add("in"); });
    $$("[data-count]").forEach(countEl);
    return;
  }

  /* =================== GSAP =================== */
  gsap.registerPlugin(ScrollTrigger);
  gsap.set(".display .ln > span", { yPercent: 110 });
  gsap.set([".hero-top .kicker", ".hero-side"], { opacity: 0, y: 24 });
  gsap.set(".stage-img", { clipPath: "inset(18% 8% 0% 8% round 40px)" });
  gsap.set([".calc", ".chip-float"], { opacity: 0, y: 40 });

  gsap.timeline()
    .to("#curtain span", { opacity: 0, y: -20, duration: .5, delay: .5, ease: "power2.in" })
    .to("#curtain", { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "-=.1")
    .add(function () { $("#curtain").classList.add("gone"); })
    .to(".display .ln > span", { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: .09 }, "-=.55")
    .to([".hero-top .kicker", ".hero-side"], { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: .1 }, "-=1")
    .to(".stage-img", { clipPath: "inset(0% 0% 0% 0% round 40px)", duration: 1.6, ease: "expo.out" }, "-=1.1")
    .to(".calc", { opacity: 1, y: 0, duration: 1.1, ease: "expo.out" }, "-=1.1")
    .to(".chip-float", { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: .12, onStart: function () { $$(".hero [data-count]").forEach(countEl); } }, "-=.9");

  // hero image parallax
  gsap.to(".stage-img img", { yPercent: -14, ease: "none", scrollTrigger: { trigger: ".hero-stage", start: "top top", end: "bottom top", scrub: true } });

  // statement scrub
  gsap.to("#lead .sw", { opacity: 1, stagger: .05, ease: "none", scrollTrigger: { trigger: ".statement", start: "top 75%", end: "center 45%", scrub: .5 } });
  ScrollTrigger.create({ trigger: ".stats", start: "top 85%", once: true, onEnter: function () { $$(".stats [data-count]").forEach(countEl); } });

  var mm = gsap.matchMedia();

  // stacked cards shrink as next card arrives
  mm.add("(min-width: 981px)", function () {
    var cards = $$(".card-s");
    cards.forEach(function (c, i) {
      if (i === cards.length - 1) return;
      gsap.to(c, { scale: .92 + i * .015, filter: "brightness(.92)", ease: "none",
        scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top " + (118 + i * 18) + "px", scrub: true } });
    });
    // before/after pinned
    var st = { v: 85 };
    gsap.to(st, { v: 10, ease: "none", onUpdate: function () { baR.value = st.v; ba(st.v); },
      scrollTrigger: { trigger: ".ba-sec", start: "top top", end: "+=100%", pin: ".ba-pin", scrub: .6 } });
    gsap.from(".ba", { clipPath: "inset(10% 10% 10% 10% round 40px)", ease: "none", scrollTrigger: { trigger: ".ba-sec", start: "top 80%", end: "top top", scrub: true } });
  });
  mm.add("(max-width: 980px)", function () {
    var st = { v: 85 };
    gsap.to(st, { v: 20, ease: "none", onUpdate: function () { baR.value = st.v; ba(st.v); },
      scrollTrigger: { trigger: ".ba", start: "top 85%", end: "bottom 40%", scrub: .6 } });
  });

  // headings
  $$(".h2").forEach(function (h) {
    gsap.from(h, { y: 60, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 88%" } });
  });
  ScrollTrigger.batch(".reveal", { start: "top 88%", onEnter: function (els) { els.forEach(function (e) { e.classList.add("in"); }); gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: .12 }); } });

  // shade + gallery entrance
  gsap.from(".shade-view", { clipPath: "inset(15% 15% 15% 15% round 40px)", duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: ".shade-view", start: "top 80%" } });
  gsap.from(".gal figure", { x: 120, opacity: 0, duration: 1.3, ease: "expo.out", stagger: .08, scrollTrigger: { trigger: ".gal", start: "top 85%" } });

  // final
  gsap.fromTo(".final-img", { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".final", start: "top bottom", end: "bottom bottom", scrub: true } });
  gsap.from(".foot-word", { yPercent: 40, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".foot", start: "top 95%" } });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); setVt(sel.v); });
})();
