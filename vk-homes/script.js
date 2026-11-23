/* VK Homes — "Elegant Living" homepage interactions */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var motion = hasGsap && !reduce;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!motion) root.classList.remove("motion"); // show everything plainly if GSAP failed / reduced motion
  if (motion) root.classList.add("gsap-on");

  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var header = $(".header"), hero = $(".hero");

  /* ======================================================
     1. Smooth scroll (Lenis) + anchor links
     ====================================================== */
  var lenis = null;
  if (motion && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop(); // locked while the preloader plays
  }
  function goTo(hash) {
    var target = hash === "#top" ? 0 : $(hash);
    if (target === null) return;
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var h = a.getAttribute("href");
      if (h.length < 2) return;
      e.preventDefault();
      if (!mmenu.hidden) closeMenu();
      goTo(h);
    });
  });

  /* ======================================================
     2. Hero slideshow — a new image every 3 seconds (client requirement)
     ====================================================== */
  var SLIDE_MS = 3000;
  var slides = $$(".slide"), dots = $$(".hero__index button");
  var nameEl = $("#h-name"), statusEl = $("#h-status");
  var cur = 0, timer = null;
  hero.style.setProperty("--slide-ms", SLIDE_MS + "ms");

  function show(i) {
    var prev = cur;
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) {
      s.classList.remove("is-prev");
      if (k === prev && prev !== cur) s.classList.add("is-prev");
      if (k !== cur) s.classList.remove("is-active");
    });
    var s = slides[cur];
    s.classList.remove("is-active"); void s.offsetWidth; s.classList.add("is-active");
    dots.forEach(function (d, k) {
      d.classList.remove("is-active");
      d.classList.toggle("is-done", k < cur);
    });
    var d = dots[cur]; void d.offsetWidth; d.classList.add("is-active");
    if (nameEl) swapText(nameEl, s.getAttribute("data-name"));
    if (statusEl) statusEl.textContent = s.getAttribute("data-status");
  }
  function swapText(el, txt) {
    if (!motion) { el.textContent = txt; return; }
    gsap.to(el, { yPercent: -60, opacity: 0, duration: .3, ease: "power2.in", onComplete: function () {
      el.textContent = txt; gsap.fromTo(el, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5, ease: "power3.out" });
    } });
  }
  function startSlides() { stopSlides(); timer = setInterval(function () { show(cur + 1); }, SLIDE_MS); hero.classList.remove("is-paused"); }
  function stopSlides() { if (timer) clearInterval(timer); timer = null; }
  dots.forEach(function (d, k) { d.addEventListener("click", function () { if (k !== cur) show(k); startSlides(); }); });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { stopSlides(); hero.classList.add("is-paused"); } else { startSlides(); }
  });

  /* ======================================================
     3. Header, progress, floating CTAs, active nav
     ====================================================== */
  var mbar = $(".mbar"), floatCta = $(".float-cta"), progress = $(".progress i");
  var lastY = window.scrollY;
  var secs = ["top", "approach", "available", "completed", "process", "contact"].map(function (id) { return [id, document.getElementById(id)]; });
  var navLinks = $$(".nav__link");
  function inView(el, frac) {
    var r = el.getBoundingClientRect(), m = window.innerHeight * frac;
    return r.top < m && r.bottom > m;
  }
  function onScroll() {
    var y = window.scrollY, vh = window.innerHeight;
    var menuOpen = document.body.classList.contains("menu-open");
    var pastHero = y > hero.offsetHeight - 90;
    header.classList.toggle("is-solid", pastHero && !menuOpen);
    header.classList.toggle("is-hidden", y > lastY + 2 && pastHero && y > vh * 1.3 && !menuOpen && !document.body.classList.contains("notes-on"));
    if (y < lastY - 2) header.classList.remove("is-hidden");
    lastY = y;

    var max = document.documentElement.scrollHeight - vh;
    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0).toFixed(4) + ")";

    var cr = $("#completed").getBoundingClientRect();
    var inGallery = cr.top < vh * .5 && cr.bottom > vh * .5;
    var nearConvert = inView($("#available"), .5) || inView($("#contact"), .6) || inGallery || y > max - 200;
    floatCta.classList.toggle("is-on", y > vh * .9 && !nearConvert);
    mbar.classList.toggle("is-on", y > vh * .6);

    var active = "top";
    secs.forEach(function (s) { if (s[1] && inView(s[1], .42)) active = s[0]; });
    if (active === "approach") active = "top";
    navLinks.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("data-sec") === active); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ======================================================
     4. Mobile menu
     ====================================================== */
  var burger = $(".burger"), mmenu = $("#mmenu");
  function closeMenu() {
    burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu");
    mmenu.hidden = true; document.body.classList.remove("menu-open");
    if (lenis) lenis.start();
    onScroll();
  }
  burger.addEventListener("click", function () {
    if (burger.getAttribute("aria-expanded") === "true") { closeMenu(); return; }
    burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", "Close menu");
    mmenu.hidden = false; document.body.classList.add("menu-open"); onScroll();
    if (lenis) lenis.stop();
    if (motion) gsap.from($$("nav a", mmenu), { yPercent: 60, opacity: 0, duration: .8, stagger: .06, ease: "power4.out" });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mmenu.hidden) closeMenu(); });

  /* ======================================================
     5. Copy email + toast
     ====================================================== */
  var toast = $(".toast"), toastT;
  function say(msg) { toast.textContent = msg; toast.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove("is-on"); }, 2200); }
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      var v = b.getAttribute("data-copy");
      var done = function () { say("Email copied — " + v); b.textContent = "Copied ✓"; setTimeout(function () { b.textContent = "Copy"; }, 2000); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(v).then(done, function () { say(v); });
      else { var t = document.createElement("textarea"); t.value = v; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (er) { say(v); } t.remove(); }
    });
  });

  /* ======================================================
     6. Design-rationale notes (to walk the client through the layout)
     ====================================================== */
  var NOTES = {
    1: ["Header", "Exactly the menu Venkat asked for (Homepage · Completed · Available · Build Process · Contact ↗). A 'call' button with a green 'available' dot sits top-right on every screen. The header tucks away while reading and returns the moment you scroll up."],
    2: ["Cinematic hero", "Required: a new image every 3 seconds, automatically. Each slide wipes in like a film cut and is labelled 'Available now' or 'Completed', so even the slideshow sells. The logo's own tagline is the headline. One main action (See available homes), one for callers, and a '3 homes available now' card that answers the #1 buyer question instantly."],
    3: ["Our approach", "Venkat's own words, presented as a manifesto that lights up word by word as you scroll — it forces a slower, emotional read. Three short promises turn the paragraph into scannable reasons to trust VK Homes."],
    4: ["Available homes first", "These are the homes that make money today, so they come before the portfolio. Large, magazine-style imagery with a live 'Available now' signal; the whole card is one tap to enquire, opening an email already titled with that home's name. Phase 1 keeps it to image + title, exactly as agreed."],
    5: ["Safety net", "If none of the homes fit, we don't lose the visitor — we offer first access to upcoming homes. The email even pre-fills what to tell us (bedrooms, area, timing), so the lead arrives qualified."],
    6: ["Completed homes = proof", "Finished homes are a builder's strongest trust signal. A dark, cinematic chapter that pins and glides sideways as you scroll (swipe on phones) makes the portfolio feel premium. It ends by pointing back to the available homes while excitement is highest."],
    7: ["Build process", "Uncertainty is what stops people enquiring. Five plain-English steps stack on top of each other as you scroll — one idea at a time. The last card ends with the easiest possible first step: a phone call."],
    8: ["Contact", "As requested: phone and email only, no form. Huge, tappable rows (tap-to-call / tap-to-email) plus a Copy button for desktop. Hours and reply time set expectations; 'currently taking enquiries' adds gentle urgency. Throughout the page a floating 'View & enquire' pill (desktop) and a Call · Email bar (mobile) keep the next step one tap away."]
  };
  $$("[data-note]").forEach(function (el) {
    var n = el.getAttribute("data-note"), d = NOTES[n];
    if (!d) return;
    var box = document.createElement("aside");
    box.className = "note";
    box.innerHTML = "<b><i>" + n + "</i>" + d[0] + "</b><p>" + d[1] + "</p>";
    if (el === header) { box.classList.add("note--header"); hero.appendChild(box); }
    else if (el.classList.contains("completed")) $(".completed__pin", el).appendChild(box);
    else el.appendChild(box);
  });
  var notesBtn = $(".notes-toggle");
  function setNotes(on) {
    document.body.classList.toggle("notes-on", on);
    notesBtn.setAttribute("aria-pressed", on ? "true" : "false");
    $(".notes-toggle__txt").textContent = on ? "Hide notes" : "Why this layout?";
    $$(".notes-link").forEach(function (x) { x.textContent = on ? "Hide design notes" : "Why this layout? — design notes"; });
    if (on) header.classList.remove("is-hidden");
  }
  notesBtn.addEventListener("click", function () { setNotes(!document.body.classList.contains("notes-on")); });
  $$(".notes-link").forEach(function (l) {
    l.addEventListener("click", function () {
      if (!mmenu.hidden) closeMenu();
      var on = !document.body.classList.contains("notes-on");
      setNotes(on);
      if (on) goTo("#top");
    });
  });
  if (/[?&]notes\b/.test(location.search)) setNotes(true);

  /* ======================================================
     No-motion path: show everything, start slides, done.
     ====================================================== */
  if (!motion) {
    root.classList.add("loaded", "gone");
    show(0); startSlides();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ======================================================
     7. Custom cursor + magnetic buttons (desktop only)
     ====================================================== */
  if (finePointer) {
    var cursor = $(".cursor"), label = $(".cursor__label");
    var cx = gsap.quickTo(cursor, "x", { duration: .45, ease: "power3" });
    var cy = gsap.quickTo(cursor, "y", { duration: .45, ease: "power3" });
    window.addEventListener("mousemove", function (e) { cx(e.clientX); cy(e.clientY); });
    $$("[data-cursor]").forEach(function (el) {
      el.addEventListener("mouseenter", function () { label.textContent = el.getAttribute("data-cursor"); cursor.classList.add("has-label"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("has-label"); });
    });
    $$("a, button").forEach(function (el) {
      if (el.closest("[data-cursor]")) return;
      el.addEventListener("mouseenter", function () { cursor.classList.add("is-link"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("is-link"); });
    });
    $$(".magnetic").forEach(function (el) {
      var mx = gsap.quickTo(el, "x", { duration: .6, ease: "elastic.out(1, .4)" });
      var my = gsap.quickTo(el, "y", { duration: .6, ease: "elastic.out(1, .4)" });
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * .28); my((e.clientY - r.top - r.height / 2) * .38);
      });
      el.addEventListener("mouseleave", function () { mx(0); my(0); });
    });
  }

  /* ======================================================
     8. Preloader → hero intro
     ====================================================== */
  var counter = $(".loader__count b"), count = { v: 0 };
  var pageLoaded = document.readyState === "complete";
  window.addEventListener("load", function () { pageLoaded = true; });
  gsap.to(count, {
    v: 100, duration: 1.7, ease: "power2.inOut",
    onUpdate: function () { counter.textContent = ("00" + Math.round(count.v)).slice(-3); },
    onComplete: function () { revealPage(); }
  });
  var revealed = false;
  function revealPage() {
    if (revealed) return; revealed = true;
    root.classList.add("loaded");
    setTimeout(function () { root.classList.add("gone"); }, 1500);
    if (lenis) lenis.start();
    heroIntro();
  }
  setTimeout(revealPage, 3800); // hard cap

  function heroIntro() {
    show(0);
    var tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: .45, onStart: startSlides });
    tl.fromTo(".slide.is-active img", { scale: 1.35 }, { scale: 1.06, duration: 2.4, ease: "power3.out" }, 0)
      .to(".hero__title .ln > span", { y: 0, duration: 1.4, stagger: .12 }, .15)
      .fromTo(".hero__kicker", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1 }, .3)
      .fromTo(".header__inner", { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 1 }, .3)
      .fromTo(".hero__side", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.1 }, .7)
      .fromTo(".hero__now", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1.1 }, .85)
      .fromTo(".hero__foot", { opacity: 0 }, { opacity: 1, duration: 1.2 }, 1);
  }

  /* ======================================================
     9. Scroll choreography
     ====================================================== */
  // Hero: image frame zooms out into a rounded card, copy drifts away
  gsap.to(".hero__media", {
    clipPath: "inset(6% 3% 0% 3% round 22px)", ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true }
  });
  gsap.to(".hero__grid", { yPercent: -14, opacity: 0, ease: "none", scrollTrigger: { trigger: hero, start: "35% top", end: "bottom top", scrub: true } });

  // Split headings into masked words
  function splitWords(el) {
    var out = [];
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { out.push(document.createTextNode(" ")); return; }
          var w = document.createElement("span"); w.className = "w";
          var i = document.createElement("span"); i.textContent = part; w.appendChild(i); out.push(w);
        });
      } else {
        var w2 = document.createElement("span"); w2.className = "w";
        var i2 = document.createElement("span"); i2.appendChild(node.cloneNode(true)); w2.appendChild(i2); out.push(w2);
      }
    });
    el.innerHTML = ""; out.forEach(function (n) { el.appendChild(n); });
    return $$(".w > span", el);
  }
  $$(".split-words").forEach(function (h) {
    var words = splitWords(h);
    gsap.from(words, { yPercent: 115, rotate: 4, duration: 1.3, ease: "power4.out", stagger: .07, scrollTrigger: { trigger: h, start: "top 85%" } });
  });

  // Manifesto: words light up as you read
  $$(".scroll-lit").forEach(function (p) {
    splitWords(p);
    var ws = $$(".w", p);
    gsap.to(ws, { opacity: 1, stagger: .08, ease: "none", scrollTrigger: { trigger: p, start: "top 78%", end: "bottom 42%", scrub: true } });
  });
  gsap.fromTo(".float-img--a", { yPercent: 30 }, { yPercent: -25, ease: "none", scrollTrigger: { trigger: ".manifesto", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.fromTo(".float-img--b", { yPercent: 70 }, { yPercent: -60, ease: "none", scrollTrigger: { trigger: ".manifesto", start: "top bottom", end: "bottom top", scrub: true } });
  $$(".float-img").forEach(function (f) {
    gsap.fromTo(f, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "power4.inOut", scrollTrigger: { trigger: ".manifesto", start: "top 60%" } });
  });

  // Marquee that speeds up with scroll velocity
  var marq = gsap.to(".marquee__row", { xPercent: -50, duration: 32, ease: "none", repeat: -1 });
  var marqST = ScrollTrigger.create({
    trigger: ".marquee", start: "top bottom", end: "bottom top",
    onUpdate: function (self) {
      var v = self.getVelocity();
      gsap.to(marq, { timeScale: (v < 0 ? -1 : 1) * (1 + Math.min(Math.abs(v) / 260, 6)), duration: .2, overwrite: true });
      gsap.to(marq, { timeScale: v < 0 ? -1 : 1, duration: 1.4, delay: .2, overwrite: false });
    }
  });

  // Generic fade-ups
  gsap.utils.toArray(".label, .eyebrow, .avail__meta, .process__sub, .link-line, .promise, .contact__note, .footer__top > *").forEach(function (el) {
    if (el.closest(".hero")) return;
    gsap.from(el, { opacity: 0, y: 28, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
  });

  // Available homes: curtain reveal + inner parallax
  $$(".home").forEach(function (h, i) {
    var media = $(".home__media", h), img = $("img", media);
    gsap.fromTo(media, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.5, delay: (i % 3) * .12, ease: "power4.inOut", scrollTrigger: { trigger: h, start: "top 88%" } });
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: h, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from($(".home__row", h), { opacity: 0, y: 20, duration: 1, delay: .4 + (i % 3) * .12, ease: "power3.out", scrollTrigger: { trigger: h, start: "top 88%" } });
  });
  gsap.from(".firstdibs", { opacity: 0, y: 40, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".firstdibs", start: "top 90%" } });

  // Completed: pinned horizontal gallery with velocity skew (desktop), native swipe (touch)
  var completed = $(".completed"), track = $(".track"), bar = $(".completed__bar i"), cnum = $("#c-num");
  var tiles = $$(".tile:not(.tile--cta)");
  var mm = gsap.matchMedia();
  mm.add("(min-width: 1101px)", function () {
    completed.classList.add("is-pinned");
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    var skew = gsap.quickTo(".tile", "skewX", { duration: .5, ease: "power3" });
    var tw = gsap.to(track, {
      x: function () { return -dist(); }, ease: "none",
      scrollTrigger: {
        trigger: completed, start: "top top", end: function () { return "+=" + dist(); },
        pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (self) {
          bar.style.transform = "scaleX(" + self.progress.toFixed(3) + ")";
          cnum.textContent = ("0" + Math.min(6, 1 + Math.floor(self.progress * 6))).slice(-2);
          skew(gsap.utils.clamp(-6, 6, self.getVelocity() / -400));
        },
        onScrubComplete: function () { skew(0); }
      }
    });
    gsap.to(".completed__ghost", { xPercent: -30, ease: "none", scrollTrigger: { trigger: completed, start: "top top", end: function () { return "+=" + dist(); }, scrub: true } });
    tiles.forEach(function (t) {
      gsap.fromTo($("img", t), { xPercent: 6 }, { xPercent: -6, ease: "none", scrollTrigger: { trigger: t, containerAnimation: tw, start: "left right", end: "right left", scrub: true } });
    });
    return function () { completed.classList.remove("is-pinned"); gsap.set(track, { x: 0 }); gsap.set(".tile", { skewX: 0 }); };
  });
  mm.add("(max-width: 1100px)", function () {
    var hint = $(".completed__hint"); hint.textContent = "Swipe to explore";
    var upd = function () {
      var max = track.scrollWidth - track.clientWidth, p = max > 0 ? track.scrollLeft / max : 0;
      bar.style.transform = "scaleX(" + p.toFixed(3) + ")";
      cnum.textContent = ("0" + Math.min(6, 1 + Math.floor(p * 6))).slice(-2);
    };
    track.addEventListener("scroll", upd, { passive: true });
    return function () { track.removeEventListener("scroll", upd); hint.textContent = "Scroll to explore"; };
  });
  gsap.from(".tile", { opacity: 0, y: 80, duration: 1.3, stagger: .08, ease: "power4.out", scrollTrigger: { trigger: completed, start: "top 65%" } });

  // Process: each card recedes as the next one stacks on top
  var cards = $$(".pcard");
  cards.forEach(function (c, i) {
    var img = $(".pcard__img img", c);
    gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "top 30%", scrub: true } });
    if (i === cards.length - 1) return;
    gsap.to(c, {
      scale: .9 + i * .015, filter: "brightness(.72)", ease: "none",
      scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 25%", scrub: true }
    });
  });

  // Contact: giant lines rise, image parallax, rows slide in
  gsap.fromTo(".contact__title .ln > span", { yPercent: 110 }, { yPercent: 0, duration: 1.4, stagger: .12, ease: "power4.out", scrollTrigger: { trigger: ".contact__title", start: "top 85%" } });
  gsap.fromTo(".contact__img", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "power4.inOut", scrollTrigger: { trigger: ".contact__top", start: "top 70%" } });
  gsap.fromTo(".contact__img img", { yPercent: -10 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".row", { opacity: 0, y: 50, duration: 1.1, stagger: .12, ease: "power3.out", scrollTrigger: { trigger: ".rows", start: "top 88%" } });

  // Footer wordmark rises in
  gsap.fromTo(".footer__word", { yPercent: 35, opacity: .2 }, { yPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
