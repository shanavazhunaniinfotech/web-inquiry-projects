/* VK Homes — homepage interactions */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 1. Hero slideshow: changes every 3 seconds (client requirement) ---------- */
  var SLIDE_MS = 3000;
  var hero = $(".hero");
  var slides = $$(".slide");
  var dots = $$(".hero__progress button");
  var nameEl = $("#slide-name"), statusEl = $("#slide-status"), numEl = $("#slide-num");
  var current = 0, timer = null;
  hero.style.setProperty("--slide-ms", SLIDE_MS + "ms");

  // Lazy images in hidden slides: force-load the next ones early so the change is seamless
  slides.forEach(function (s) { var img = $("img", s); if (img) img.loading = "eager"; });

  function show(i) {
    var prev = current;
    current = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle("is-active", k === current); });
    dots.forEach(function (d, k) {
      d.classList.remove("is-active");
      d.classList.toggle("is-done", k < current);
      d.setAttribute("aria-selected", k === current ? "true" : "false");
    });
    // restart CSS fill animation
    var d = dots[current]; void d.offsetWidth; d.classList.add("is-active");
    // restart Ken Burns on the new slide
    var img = $("img", slides[current]);
    if (img && prev !== current) { img.style.animation = "none"; void img.offsetWidth; img.style.animation = ""; }
    var s = slides[current];
    if (nameEl) nameEl.textContent = s.getAttribute("data-caption");
    if (statusEl) statusEl.textContent = s.getAttribute("data-status");
    if (numEl) numEl.textContent = ("0" + (current + 1)).slice(-2);
  }
  function start() { stop(); timer = setInterval(function () { show(current + 1); }, SLIDE_MS); hero.classList.remove("is-paused"); }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  dots.forEach(function (d, k) { d.addEventListener("click", function () { show(k); start(); }); });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { stop(); hero.classList.add("is-paused"); } else { show(current); start(); }
  });
  show(0); start();

  /* ---------- 2. Header: transparent over hero, solid after; hides on scroll down ---------- */
  var header = $(".header");
  var mbar = $(".mbar");
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    var heroEnd = hero.offsetHeight - 90;
    header.classList.toggle("is-solid", y > heroEnd || document.body.classList.contains("menu-open"));
    var goingDown = y > lastY && y > heroEnd + 200;
    header.classList.toggle("is-hidden", goingDown && !document.body.classList.contains("menu-open") && !document.body.classList.contains("notes-on"));
    mbar.classList.toggle("is-on", y > hero.offsetHeight * 0.6);
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Active nav link ---------- */
  var navLinks = $$(".nav__link");
  var map = { top: 0, completed: 1, available: 2, process: 3, contact: 4 };
  var watched = [["top", hero], ["available", $("#available")], ["approach", $("#approach")], ["completed", $("#completed")], ["process", $("#process")], ["contact", $("#contact")]];
  function setActive() {
    var mid = window.innerHeight * 0.4, active = "top";
    watched.forEach(function (w) {
      var r = w[1].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) active = w[0];
    });
    if (active === "approach") active = "available";
    navLinks.forEach(function (l, k) { l.classList.toggle("is-active", k === map[active]); });
  }
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  /* ---------- 4. Mobile menu ---------- */
  var burger = $(".burger"), mmenu = $("#mobile-menu");
  function closeMenu() {
    burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu");
    mmenu.hidden = true; document.body.classList.remove("menu-open"); onScroll();
  }
  burger.addEventListener("click", function () {
    var open = burger.getAttribute("aria-expanded") === "true";
    if (open) { closeMenu(); return; }
    burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", "Close menu");
    mmenu.hidden = false; document.body.classList.add("menu-open"); header.classList.add("is-solid");
  });
  $$("a", mmenu).forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mmenu.hidden) closeMenu(); });

  /* ---------- 5. Copy email ---------- */
  var toast = $(".toast"), toastT;
  function say(msg) { toast.textContent = msg; toast.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove("is-on"); }, 2200); }
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy");
      var done = function () { say("Email copied — " + v); $("span", b).textContent = "Copied"; setTimeout(function () { $("span", b).textContent = "Copy"; }, 2000); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(v).then(done, function () { say(v); });
      else {
        var t = document.createElement("textarea"); t.value = v; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); done(); } catch (e) { say(v); }
        t.remove();
      }
    });
  });

  /* ---------- 6. Build process — highlight step in view ---------- */
  var steps = $$(".step"), pimgs = $$(".pimg"), stamp = $("#pstamp"), stepsList = $(".steps");
  function setStep(i) {
    steps.forEach(function (s, k) { s.classList.toggle("is-active", k === i); s.classList.toggle("is-past", k < i); });
    pimgs.forEach(function (p, k) { p.classList.toggle("is-active", k === i); });
    if (stamp) stamp.textContent = "Step " + ("0" + (i + 1)).slice(-2);
  }
  function stepScroll() {
    var mid = window.innerHeight * 0.5, idx = 0;
    steps.forEach(function (s, k) { if (s.getBoundingClientRect().top < mid) idx = k; });
    setStep(idx);
    var r = stepsList.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
    stepsList.style.setProperty("--p", p.toFixed(3));
  }
  window.addEventListener("scroll", stepScroll, { passive: true });
  stepScroll();

  /* ---------- 7. Design rationale notes (for the client review) ---------- */
  var NOTES = {
    1: ["Header", "Same menu the client asked for (Homepage · Completed · Available · Build Process · Contact ↗). A phone button is always visible on desktop, and the header hides while reading but slides back the moment you scroll up — so 'call' is never more than one move away."],
    2: ["Hero slideshow", "Required: images change automatically every 3 seconds. Each slide is labelled (Available now / Completed) so even the slideshow sells. One clear main action — 'See available homes' — plus a softer 'Talk to the builder' for people who prefer to call. Tagline from the logo keeps the brand consistent."],
    3: ["At-a-glance strip", "Visitors decide in seconds. These four facts answer 'what can I buy, can I trust you, and how easy is this?' before they even scroll. Numbers match what's actually on the page — no inflated claims."],
    4: ["Available homes first", "These are the homes that make money today, so they come before the portfolio. Green 'Available now' signals create urgency; every card has its own 'Enquire' button that opens an email already titled with the home's name — less typing = more enquiries. Phase 1 keeps it to image + title, exactly as agreed."],
    5: ["Safety net", "If none of the available homes fit, we don't lose the visitor — we invite them to get first access to upcoming homes. This catches buyers who would otherwise just leave."],
    6: ["Our approach", "Uses the client's own words and layout (01 / Our Approach · 'Good design is how a home feels'). Placed after the homes so it builds trust right when the visitor is weighing up an enquiry. Three short promises turn the paragraph into scannable reasons to choose VK Homes."],
    7: ["Completed homes = proof", "Real finished homes are the strongest trust signal a builder has. A cinematic dark gallery makes them feel premium; on desktop it glides sideways as you scroll, on phones it swipes. It ends with a CTA back to available homes so the visitor's excitement turns into action."],
    8: ["Build process", "Uncertainty stops people enquiring. Five plain-English steps show exactly what happens, with the image and progress line following along. It ends on 'Step one takes just a phone call' — making the first move feel small and easy."],
    9: ["Contact", "As requested: phone + email only, no form. Both are one-tap (tap-to-call / tap-to-email) with a 'Copy' button for desktop users. Hours and reply time set expectations, and the 'currently taking enquiries' line adds gentle urgency. On phones, a sticky Call · Email · Available homes bar is always within thumb reach."]
  };
  $$("[data-note]").forEach(function (el) {
    var n = el.getAttribute("data-note"), d = NOTES[n];
    if (!d) return;
    var box = document.createElement("aside");
    box.className = "note";
    box.innerHTML = "<b><i>" + n + "</i>" + d[0] + "</b><p>" + d[1] + "</p>";
    if (el === header) { box.classList.add("note--header"); hero.appendChild(box); }
    else el.appendChild(box);
  });
  var notesBtn = $(".notes-toggle");
  notesBtn.addEventListener("click", function () {
    var on = document.body.classList.toggle("notes-on");
    notesBtn.setAttribute("aria-pressed", on ? "true" : "false");
    $(".notes-toggle__txt").textContent = on ? "Hide notes" : "Why this layout?";
    if (on) header.classList.remove("is-hidden");
  });
  $$(".notes-link").forEach(function (l) {
    l.addEventListener("click", function () {
      if (!mmenu.hidden) closeMenu();
      notesBtn.click();
      var on = document.body.classList.contains("notes-on");
      $$(".notes-link").forEach(function (x) { x.textContent = on ? "Hide design notes" : "Why this layout?"; });
      if (on) window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  if (/[?&]notes\b/.test(location.search)) notesBtn.click();

  /* ---------- 8. GSAP motion ---------- */
  if (!hasGsap || reduce) {
    document.documentElement.classList.remove("js-anim");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Split headings into words for a masked reveal
  $$(".reveal-words").forEach(function (h) {
    var out = [];
    Array.prototype.slice.call(h.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) out.push(document.createTextNode(" "));
          else { var w = document.createElement("span"); w.className = "w"; w.innerHTML = "<span>" + part + "</span>"; out.push(w); }
        });
      } else {
        var w2 = document.createElement("span"); w2.className = "w";
        var inner = document.createElement("span"); inner.appendChild(node.cloneNode(true));
        w2.appendChild(inner); out.push(w2);
      }
    });
    h.innerHTML = ""; out.forEach(function (n) { h.appendChild(n); });
    gsap.from($$(".w > span", h), {
      yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.05,
      scrollTrigger: { trigger: h, start: "top 85%" }
    });
  });

  // Hero intro
  var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  tl.to(".hero__title .line > span", { y: 0, yPercent: 0, duration: 1.3, stagger: 0.12 }, 0.15)
    .fromTo(".hero__eyebrow", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .9 }, 0.1)
    .fromTo(".hero__lead", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, 0.55)
    .fromTo(".hero__cta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, 0.7)
    .fromTo(".hero__bar", { opacity: 0 }, { opacity: 1, duration: 1 }, 0.9)
    .fromTo(".header__inner", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 1 }, 0.2);

  // Hero content drifts as you scroll away
  gsap.to(".hero__content", { yPercent: -18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });

  // Count-up facts
  $$(".fact__num").forEach(function (el) {
    var end = +el.getAttribute("data-count"), o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%" },
      onUpdate: function () { el.textContent = ("0" + Math.round(o.v)).slice(-2); } });
  });
  gsap.from(".fact", { opacity: 0, y: 24, duration: .9, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".facts", start: "top 90%" } });

  // Generic fades
  gsap.utils.toArray(".sec-index, .eyebrow:not(.hero__eyebrow), .sec-head__aside, .body-lg, .link-arrow, .nudge, .process__cta, .contact__lead, .contact__cards > *").forEach(function (el) {
    gsap.from(el, { opacity: 0, y: 26, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
  });

  // Available cards: clip reveal
  gsap.from(".card", { opacity: 0, y: 60, duration: 1.1, stagger: .12, ease: "power3.out", scrollTrigger: { trigger: ".cards", start: "top 82%" } });
  $$(".card__media").forEach(function (m) {
    gsap.fromTo(m, { clipPath: "inset(18% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "power4.out", scrollTrigger: { trigger: m, start: "top 88%" } });
  });

  // Approach images
  $$(".clip").forEach(function (c, i) {
    gsap.fromTo(c, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.5, delay: i * .15, ease: "power4.inOut", scrollTrigger: { trigger: ".approach__media", start: "top 80%" } });
  });
  gsap.fromTo(".parallax", { yPercent: -8 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: ".approach__media", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".pillar", { opacity: 0, y: 30, duration: 1, stagger: .12, ease: "power3.out", scrollTrigger: { trigger: ".pillars", start: "top 85%" } });

  // Completed homes — horizontal scroll pinned on desktop
  var mm = gsap.matchMedia();
  var completed = $(".completed"), track = $(".track"), bar = $(".completed__bar i");
  mm.add("(min-width: 1025px)", function () {
    completed.classList.add("is-pinned");
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    var tw = gsap.to(track, {
      x: function () { return -dist(); }, ease: "none",
      scrollTrigger: {
        trigger: completed, start: "top top", end: function () { return "+=" + dist(); },
        pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (self) { bar.style.transform = "scaleX(" + self.progress.toFixed(3) + ")"; }
      }
    });
    return function () { completed.classList.remove("is-pinned"); gsap.set(track, { x: 0 }); tw.kill(); };
  });
  mm.add("(max-width: 1024px)", function () {
    var upd = function () {
      var max = track.scrollWidth - track.clientWidth;
      bar.style.transform = "scaleX(" + (max > 0 ? track.scrollLeft / max : 0).toFixed(3) + ")";
    };
    track.addEventListener("scroll", upd, { passive: true });
    $(".completed__hint").textContent = "Swipe to explore";
    return function () { track.removeEventListener("scroll", upd); $(".completed__hint").textContent = "Scroll to explore"; };
  });
  gsap.from(".tile", { opacity: 0, y: 50, duration: 1.1, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: completed, start: "top 70%" } });

  // Contact background parallax
  gsap.fromTo(".contact__bg img", { yPercent: -6, scale: 1.1 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom top", scrub: true } });

  // Refresh once images settle
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
