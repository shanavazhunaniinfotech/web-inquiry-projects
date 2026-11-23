/* VK Homes — Version B "Light Gallery" interactions */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var motion = hasGsap && !reduce;
  if (!motion) root.classList.remove("motion");
  var y0 = $("#year"); if (y0) y0.textContent = new Date().getFullYear();

  var pill = $(".pill"), hero = $(".hero"), sheet = $("#sheet"), burger = $(".pill__burger");

  /* ---------- smooth scroll ---------- */
  var lenis = null;
  if (motion) gsap.registerPlugin(ScrollTrigger);
  if (motion && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function goTo(h) {
    var t = h === "#top" ? 0 : $(h); if (t === null) return;
    var off = -90;
    if (lenis) lenis.scrollTo(t, { offset: t === 0 ? 0 : off, duration: 1.5 });
    else window.scrollTo({ top: t === 0 ? 0 : t.getBoundingClientRect().top + window.scrollY + off, behavior: reduce ? "auto" : "smooth" });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var h = a.getAttribute("href"); if (h.length < 2) return;
      e.preventDefault(); if (!sheet.hidden) closeMenu(); goTo(h);
    });
  });

  /* ---------- hero slideshow: every 3 s (client requirement) ---------- */
  var SLIDE_MS = 3000, slides = $$(".fslide"), thumbs = $$(".thumb"), cur = 0, timer = null;
  var fName = $("#f-name"), fStatus = $("#f-status");
  hero.style.setProperty("--slide-ms", SLIDE_MS + "ms");
  function show(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle("is-active", k === cur); });
    var img = $("img", slides[cur]); img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    thumbs.forEach(function (t) { t.classList.remove("is-active"); });
    void thumbs[cur].offsetWidth; thumbs[cur].classList.add("is-active");
    var s = slides[cur];
    if (motion) {
      gsap.to(".frame__chip > span", { y: -8, opacity: 0, duration: .25, stagger: .04, onComplete: function () {
        fName.textContent = s.getAttribute("data-name"); fStatus.textContent = s.getAttribute("data-status");
        gsap.fromTo(".frame__chip > span", { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: .45, stagger: .05, ease: "power3.out" });
      } });
    } else { fName.textContent = s.getAttribute("data-name"); fStatus.textContent = s.getAttribute("data-status"); }
  }
  function start() { stop(); timer = setInterval(function () { show(cur + 1); }, SLIDE_MS); hero.classList.remove("is-paused"); }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  thumbs.forEach(function (t, k) { t.addEventListener("click", function () { if (k !== cur) show(k); start(); }); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) { stop(); hero.classList.add("is-paused"); } else start(); });
  show(0); start();

  /* ---------- pill nav: sliding highlight + active section ---------- */
  var navLinks = $$(".pill__nav a"), ink = $(".pill__ink"), activeLink = navLinks[0];
  function moveInk(a) {
    if (!a || window.innerWidth <= 1024) return;
    ink.style.opacity = 1; ink.style.width = a.offsetWidth + "px"; ink.style.transform = "translateX(" + a.offsetLeft + "px)";
  }
  navLinks.forEach(function (a) { a.addEventListener("mouseenter", function () { moveInk(a); }); });
  $(".pill__nav").addEventListener("mouseleave", function () { moveInk(activeLink); });

  var mbar = $(".mbar"), prog = $(".progress i");
  var secs = ["top", "approach", "available", "completed", "process", "contact"].map(function (id) { return [id, document.getElementById(id)]; });
  function onScroll() {
    var y = window.scrollY, vh = window.innerHeight, max = document.documentElement.scrollHeight - vh;
    pill.classList.toggle("is-scrolled", y > 40);
    prog.style.transform = "scaleX(" + (max > 0 ? y / max : 0).toFixed(4) + ")";
    mbar.classList.toggle("is-on", y > vh * .5);
    var act = "top";
    secs.forEach(function (s) { var r = s[1].getBoundingClientRect(); if (r.top < vh * .4 && r.bottom > vh * .4) act = s[0]; });
    if (act === "approach") act = "top";
    navLinks.forEach(function (a) {
      var on = a.getAttribute("data-sec") === act;
      a.classList.toggle("is-active", on);
      if (on && a !== activeLink) { activeLink = a; moveInk(a); }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { moveInk(activeLink); onScroll(); });
  onScroll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveInk(activeLink); });
  else setTimeout(function () { moveInk(activeLink); }, 600);

  /* ---------- mobile sheet ---------- */
  function closeMenu() {
    burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu");
    sheet.hidden = true; document.body.classList.remove("menu-open"); if (lenis) lenis.start();
  }
  burger.addEventListener("click", function () {
    if (burger.getAttribute("aria-expanded") === "true") { closeMenu(); return; }
    burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", "Close menu");
    sheet.hidden = false; document.body.classList.add("menu-open"); if (lenis) lenis.stop();
    if (motion) gsap.from($$("nav a", sheet), { y: 30, opacity: 0, duration: .7, stagger: .05, ease: "power3.out" });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) closeMenu(); });

  /* ---------- available showroom: hover / focus / tap swaps the big image ---------- */
  var items = $$(".item"), showImgs = $$(".show__img"), letter = $("#show-letter");
  function setHome(i) {
    items.forEach(function (it, k) { it.classList.toggle("is-active", k === i); });
    showImgs.forEach(function (im, k) { im.classList.toggle("is-active", k === i); });
    var L = "ABC".charAt(i);
    if (letter.textContent !== L) {
      if (motion) gsap.fromTo(letter, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, ease: "power3.out" });
      letter.textContent = L;
    }
  }
  items.forEach(function (it, k) {
    it.addEventListener("mouseenter", function () { setHome(k); });
    it.addEventListener("focusin", function () { setHome(k); });
    it.addEventListener("click", function (e) { if (!e.target.closest("a")) setHome(k); });
  });

  /* ---------- process stepper (click on desktop; also scroll-driven when pinned) ---------- */
  var steps = $$(".step"), pimgs = $$(".pimg"), pnum = $("#p-num"), pbar = $(".process__bar i"), curStep = 0;
  function setStep(i) {
    if (i === curStep && steps[i].classList.contains("is-active")) return;
    curStep = i;
    steps.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
    pimgs.forEach(function (p, k) { p.classList.toggle("is-active", k === i); });
    pnum.textContent = "0" + (i + 1);
    pbar.style.transform = "scaleX(" + ((i + 1) / steps.length) + ")";
  }
  var stepST = null;
  steps.forEach(function (s, k) {
    $("button", s).addEventListener("click", function () {
      if (stepST) { // scroll to the matching point inside the pinned section
        var target = stepST.start + (stepST.end - stepST.start) * ((k + .5) / steps.length);
        if (lenis) lenis.scrollTo(target, { duration: 1.2 }); else window.scrollTo({ top: target, behavior: "smooth" });
      } else setStep(k);
    });
  });

  /* ---------- copy + toast ---------- */
  var toast = $(".toast"), tt;
  function say(m) { toast.textContent = m; toast.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("is-on"); }, 2200); }
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      var v = b.getAttribute("data-copy");
      var ok = function () { say("Email copied — " + v); b.textContent = "Copied ✓"; setTimeout(function () { b.textContent = "Copy"; }, 2000); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(v).then(ok, function () { say(v); });
      else { var t = document.createElement("textarea"); t.value = v; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); ok(); } catch (er) { say(v); } t.remove(); }
    });
  });

  /* ---------- design-rationale notes ---------- */
  var NOTES = {
    1: ["Floating menu", "The exact menu Venkat asked for, in a floating glass bar that never disappears — so 'Call us' is always one tap away. A soft highlight slides under each link as you hover, and marks where you are on the page."],
    2: ["Headline first, then the homes", "The promise is read first (the logo's own idea: elegant homes, thoughtfully built), with one main action and a live '3 homes available now' line. Below, the photo frame changes every 3 seconds as required — with thumbnails to jump to any image — and opens to full width as you scroll."],
    3: ["At-a-glance bento", "Five tiles answer the five things every buyer wants to know in 5 seconds: what's available, what's your philosophy, have you built before, how does it work, how do I reach you. Each tile is a shortcut to the right section — more entry points, more enquiries."],
    4: ["Our approach", "Venkat's own text, presented as an editorial statement with a wide panoramic image that opens up as you scroll. Three icon cards turn the paragraph into scannable reasons to trust VK Homes."],
    5: ["Available homes showroom", "A calm, shop-like showroom: hover a home's name and the big image swaps instantly. Every row has its own 'Enquire' button that opens an email already titled with that home. Phase 1 keeps it to image + title, exactly as agreed; on phones each home shows its own photo."],
    6: ["Safety net", "If none of the homes fit, the visitor can ask for first access to the next one — the email even pre-fills bedrooms, area and timing, so leads arrive qualified."],
    7: ["Completed homes", "A light, gallery-style wall of finished homes. The three columns drift at different speeds as you scroll, which makes the portfolio feel alive. It closes with 'Your home could be next' and a button back to the available homes."],
    8: ["Build process", "The section holds still while you scroll through the five steps — one idea at a time, with a matching photo. It finishes with the easiest first step: a phone call."],
    9: ["Contact", "Phone and email only (no form), as requested — big, tappable cards with icons, opening hours, reply time and a Copy button. 'Currently taking enquiries' adds gentle urgency. On phones a Call · Email · 3 homes available bar stays at the bottom."]
  };
  $$("[data-note]").forEach(function (el) {
    var n = el.getAttribute("data-note"), d = NOTES[n]; if (!d) return;
    var box = document.createElement("aside"); box.className = "note";
    box.innerHTML = "<b><i>" + n + "</i>" + d[0] + "</b><p>" + d[1] + "</p>";
    if (el === pill) { box.classList.add("note--pill"); hero.appendChild(box); }
    else if (el.classList.contains("process")) $(".process__pin", el).appendChild(box);
    else el.appendChild(box);
  });
  var nbtn = $(".notes-toggle");
  function setNotes(on) {
    document.body.classList.toggle("notes-on", on);
    nbtn.setAttribute("aria-pressed", on ? "true" : "false");
    $(".notes-toggle__txt").textContent = on ? "Hide notes" : "Why this layout?";
    $$(".notes-link").forEach(function (x) { x.textContent = on ? "Hide design notes" : "Why this layout?"; });
  }
  nbtn.addEventListener("click", function () { setNotes(!document.body.classList.contains("notes-on")); });
  $$(".notes-link").forEach(function (l) { l.addEventListener("click", function () { if (!sheet.hidden) closeMenu(); var on = !document.body.classList.contains("notes-on"); setNotes(on); if (on) goTo("#top"); }); });
  if (/[?&]notes\b/.test(location.search)) setNotes(true);

  if (!motion) return;

  /* =================== GSAP choreography =================== */
  // Hero intro
  var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  tl.fromTo(".pill", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0)
    .fromTo(".kicker", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .9 }, .15)
    .fromTo(".hero__title .ln > span", { yPercent: 110 }, { yPercent: 0, y: 0, duration: 1.3, stagger: .12 }, .2)
    .fromTo(".hero__aside", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, .55)
    .fromTo(".frame", { clipPath: "inset(14% 8% 0% 8% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.6, ease: "expo.out" }, .35)
    .fromTo(".frame .fslide.is-active img", { scale: 1.3 }, { scale: 1.1, duration: 1.8, ease: "power3.out" }, .35)
    .fromTo(".thumbs, .frame__chip", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .1 }, 1);

  // Frame opens to full-bleed while scrolling
  gsap.to(".frame-wrap", { paddingLeft: 0, paddingRight: 0, ease: "none", scrollTrigger: { trigger: ".frame-wrap", start: "top 70%", end: "bottom 40%", scrub: true } });
  gsap.to(".frame", { borderRadius: 0, ease: "none", scrollTrigger: { trigger: ".frame-wrap", start: "top 70%", end: "bottom 40%", scrub: true } });

  // Word-mask headline reveals
  $$(".reveal").forEach(function (h) {
    var out = [];
    Array.prototype.slice.call(h.childNodes).forEach(function (n) {
      if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(function (p) {
        if (!p) return; if (/^\s+$/.test(p)) { out.push(document.createTextNode(" ")); return; }
        var w = document.createElement("span"); w.className = "w"; var i = document.createElement("span"); i.textContent = p; w.appendChild(i); out.push(w);
      });
      else { var w2 = document.createElement("span"); w2.className = "w"; var i2 = document.createElement("span"); i2.appendChild(n.cloneNode(true)); w2.appendChild(i2); out.push(w2); }
    });
    h.innerHTML = ""; out.forEach(function (n) { h.appendChild(n); });
    gsap.from($$(".w > span", h), { yPercent: 110, duration: 1.2, stagger: .06, ease: "power4.out", scrollTrigger: { trigger: h, start: "top 86%" } });
  });

  // Bento cells
  gsap.from(".cell", { y: 60, opacity: 0, duration: 1.1, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".bento", start: "top 85%" } });

  // Fade-ups
  gsap.utils.toArray(".eyebrow, .approach__copy, .sec-head__aside, .pillar, .first, .next, .ccard__lead, .ccard__note, .act, .footer__mid > *").forEach(function (el) {
    if (el.closest(".hero")) return;
    gsap.from(el, { y: 30, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
  });

  // Panorama opens from a narrow slit + parallax
  gsap.fromTo(".panorama", { clipPath: "inset(0 18% 0 18% round 28px)" }, { clipPath: "inset(0 0% 0 0% round 28px)", ease: "none", scrollTrigger: { trigger: ".panorama", start: "top 90%", end: "center 55%", scrub: true } });
  gsap.fromTo(".panorama img", { yPercent: -12 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".panorama", start: "top bottom", end: "bottom top", scrub: true } });

  // Showroom
  gsap.fromTo(".show__stage", { clipPath: "inset(0 0 100% 0 round 28px)" }, { clipPath: "inset(0 0 0% 0 round 28px)", duration: 1.5, ease: "power4.inOut", scrollTrigger: { trigger: ".show", start: "top 80%" } });
  gsap.from(".item", { y: 30, opacity: 0, duration: 1, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: ".show", start: "top 80%" } });

  // Completed: columns move at different speeds
  var mm = gsap.matchMedia();
  mm.add("(min-width: 701px)", function () {
    $$(".col").forEach(function (c) {
      var sp = +c.getAttribute("data-speed");
      gsap.fromTo(c, { y: -sp / 2 }, { y: sp, ease: "none", scrollTrigger: { trigger: ".cols", start: "top bottom", end: "bottom top", scrub: true } });
    });
  });
  gsap.from(".ph", { y: 60, opacity: 0, duration: 1.1, stagger: .07, ease: "power3.out", scrollTrigger: { trigger: ".cols", start: "top 85%" } });

  // Process: pin and step through on desktop
  mm.add("(min-width: 1025px)", function () {
    stepST = ScrollTrigger.create({
      trigger: ".process__pin", start: "top top", end: "+=" + (steps.length * 55) + "%", pin: true, anticipatePin: 1,
      onUpdate: function (self) { setStep(Math.min(steps.length - 1, Math.floor(self.progress * steps.length))); }
    });
    return function () { stepST.kill(); stepST = null; };
  });

  // Contact card
  gsap.fromTo(".ccard", { clipPath: "inset(8% 4% 8% 4% round 36px)" }, { clipPath: "inset(0% 0% 0% 0% round 36px)", ease: "none", scrollTrigger: { trigger: ".ccard", start: "top 95%", end: "top 45%", scrub: true } });
  gsap.fromTo(".ccard__bg", { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".ccard", start: "top bottom", end: "bottom top", scrub: true } });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
