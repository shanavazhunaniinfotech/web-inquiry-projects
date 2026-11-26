/* Marc Charles Carpets — home page interactions */
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  doc.classList.add("js");
  if (reduced) doc.classList.add("reduced");
  if (!hasGsap) doc.classList.add("no-gsap");

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Analytics hook (wire to GA4 / GTM later) ---------- */
  function track(name, data) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, data || {}));
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-track]");
    if (t) track(t.getAttribute("data-track"));
  });

  /* ---------- Year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Live open / closed status (Europe/London) ---------- */
  (function openStatus() {
    var hours = { 1: [510, 1020], 2: [510, 1020], 3: [510, 1020], 4: [510, 1020], 5: [510, 1020], 6: [510, 960] };
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var now;
    try {
      var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
      var map = {}; parts.forEach(function (p) { map[p.type] = p.value; });
      var wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(map.weekday);
      now = { d: wd, m: (parseInt(map.hour, 10) % 24) * 60 + parseInt(map.minute, 10) };
    } catch (e) {
      var d = new Date(); now = { d: d.getDay(), m: d.getHours() * 60 + d.getMinutes() };
    }
    var fmt = function (m) { var h = Math.floor(m / 60), mm = m % 60; var ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return h + (mm ? "." + (mm < 10 ? "0" : "") + mm : "") + ap; };
    var today = hours[now.d];
    var open = today && now.m >= today[0] && now.m < today[1];
    var short, long;
    if (open) {
      short = "Open now · until " + fmt(today[1]);
      long = "Open now — come in until " + fmt(today[1]) + " today";
    } else {
      var nd = now.d, label = "";
      if (today && now.m < today[0]) { label = "today at " + fmt(today[0]); }
      else {
        for (var i = 1; i <= 7; i++) { nd = (now.d + i) % 7; if (hours[nd]) break; }
        label = (i === 1 ? "tomorrow" : days[nd]) + " at " + fmt(hours[nd][0]);
      }
      short = "Closed · opens " + label;
      long = "Closed now — we open " + label + ". Leave a request below and we'll call you.";
    }
    $$("[data-open-dot]").forEach(function (el) { el.classList.toggle("is-open", !!open); });
    $$("[data-open-text]").forEach(function (el) { el.textContent = short; });
    $$("[data-open-text-long]").forEach(function (el) { el.textContent = long; });
  })();

  /* ---------- Header: scrolled + hide on scroll down ---------- */
  var hdr = $("[data-hdr]");
  var mbar = $("[data-mbar]");
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    hdr.classList.toggle("is-scrolled", y > 40);
    if (!document.body.classList.contains("menu-open")) {
      hdr.classList.toggle("is-hidden", y > 600 && y > lastY + 4);
      if (y < lastY - 4) hdr.classList.remove("is-hidden");
    }
    if (mbar) mbar.classList.toggle("is-visible", y > 500);
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mega menu ---------- */
  var megaLi = $(".has-mega");
  if (megaLi) {
    var megaBtn = $(".nav__link", megaLi);
    var closeT;
    var setMega = function (o) { megaLi.classList.toggle("is-open", o); megaBtn.setAttribute("aria-expanded", o ? "true" : "false"); };
    megaLi.addEventListener("mouseenter", function () { clearTimeout(closeT); setMega(true); });
    megaLi.addEventListener("mouseleave", function () { closeT = setTimeout(function () { setMega(false); }, 160); });
    megaBtn.addEventListener("click", function () { setMega(!megaLi.classList.contains("is-open")); });
    $$("a", megaLi).forEach(function (a) { a.addEventListener("click", function () { setMega(false); megaBtn.blur(); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMega(false); });
  }

  /* ---------- Mobile menu ---------- */
  var burger = $("[data-burger]"), mnav = $("[data-mnav]");
  function setMenu(o) {
    burger.setAttribute("aria-expanded", o ? "true" : "false");
    mnav.classList.toggle("is-open", o);
    mnav.setAttribute("aria-hidden", o ? "false" : "true");
    document.body.classList.toggle("menu-open", o);
    document.body.classList.toggle("is-locked", o);
    if (lenis) o ? lenis.stop() : lenis.start();
  }
  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  $$("a", mnav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (!reduced && window.Lenis && window.innerWidth > 900) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    if (hasGsap) {
      lenis.on("scroll", window.ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href");
    if (id === "#" || id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -80 });
    else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  });

  /* ---------- Quote drawer ---------- */
  var drawer = $("[data-drawer]");
  var roomSelect = $("[data-room-select]");
  var lastFocus = null;
  function openQuote(room) {
    lastFocus = document.activeElement;
    if (room && roomSelect) {
      var found = false;
      $$("option", roomSelect).forEach(function (o) { if (o.textContent === room) { roomSelect.value = o.value; found = true; } });
      if (!found) { var op = document.createElement("option"); op.textContent = room; roomSelect.insertBefore(op, roomSelect.firstChild); roomSelect.value = room; }
    }
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    if (lenis) lenis.stop();
    setTimeout(function () { var f = $("input", drawer); if (f && window.innerWidth > 900) f.focus(); }, 350);
    track("quote_drawer_open", { room: room || "" });
  }
  function closeQuote() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    if (lenis) lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener("click", function (e) {
    var o = e.target.closest("[data-open-quote]");
    if (o) { e.preventDefault(); if (document.body.classList.contains("menu-open")) setMenu(false); openQuote(o.getAttribute("data-room")); }
    if (e.target.closest("[data-close-quote]")) closeQuote();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) closeQuote();
    if (e.key === "Tab" && drawer.classList.contains("is-open")) {
      var f = $$("button, a, input, select, textarea", $(".drawer__panel")).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- Forms (front-end only; connect to Formspree / CRM / email later) ---------- */
  $$("[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("[required]", form).forEach(function (inp) {
        var v = inp.value.trim();
        var bad = !v || (inp.type === "tel" && v.replace(/[^\d]/g, "").length < 10);
        inp.closest(".field").classList.toggle("is-error", bad);
        if (bad && ok) { inp.focus(); ok = false; }
      });
      if (!ok) return;
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = data[k] ? data[k] + ", " + v : v; });
      track("generate_lead", { form: form.closest("[data-drawer]") ? "drawer" : "visit", room: data.room || "" });
      form.hidden = true;
      var okEl = form.parentNode.querySelector("[data-form-ok]");
      if (okEl) { okEl.hidden = false; if (hasGsap && !reduced) gsap.from(okEl.children, { y: 20, opacity: 0, stagger: .08, duration: .6, ease: "power3.out" }); }
    });
    $$("input", form).forEach(function (inp) { inp.addEventListener("input", function () { inp.closest(".field") && inp.closest(".field").classList.remove("is-error"); }); });
  });

  /* ---------- Carpet finder quiz ---------- */
  (function quiz() {
    var root = $("[data-quiz]"); if (!root) return;
    var qs = $$(".quiz__q", root), bar = $("[data-quiz-bar]", root), stepEl = $("[data-quiz-step]", root);
    var result = $("[data-quiz-result]", root), back = $("[data-quiz-back]", root);
    var answers = {}, idx = 0;
    var REC = {
      natural: { t: "Natural sisal or wool-sisal", img: "img/kersaint-cobb2.jpg", d: "Sisal, seagrass and wool-sisal blends bring beautiful texture and are naturally hard-wearing — our speciality since day one, from makers like Crucial Trading and Kersaint Cobb.", room: "Naturals" },
      plain: { t: "Soft plain wool twist", img: "img/brockway-carpets1.jpg", d: "A deep, soft plain in a wool-rich twist feels luxurious underfoot and hides everyday wear well. Brockway and Cormar plains come in hundreds of shades.", room: "Plain carpets" },
      pattern: { t: "Woven patterned carpet", img: "img/ulster-carpets3.jpg", d: "Woven Axminster-style patterns from Ulster are incredibly durable and disguise marks — perfect where life gets busy, while looking timeless.", room: "Patterned carpets" },
      stripe: { t: "Bordered striped runner", img: "img/louisdepoortere-stripe-carpets1.jpg", d: "Stripes make a stunning statement on stairs and hallways. We bind and border runners to measure — choose the carpet, the tape colour and the rods.", room: "Stair runner" },
      wood: { t: "Karndean luxury vinyl", img: "img/kardean-vinyl-tiles1.jpg", d: "Realistic wood and stone looks that are waterproof, warm and practically maintenance-free — ideal for kitchens, bathrooms and busy hallways.", room: "Luxury vinyl" }
    };
    var ROOM = { stairs: "Stairs & hallway", living: "Living room", bedroom: "Bedroom", wet: "Kitchen / bathroom", commercial: "Commercial", whole: "Whole house" };
    var LIFE = { pets: "Pet-friendly", kids: "Family-proof", adults: "Luxury softness", heavy: "Heavy-duty" };

    function show(i) {
      idx = i;
      qs.forEach(function (q, n) { q.classList.toggle("is-active", n === i); });
      result.hidden = true;
      bar.style.width = ((i + 1) / 3 * 100) + "%";
      stepEl.textContent = "Question " + (i + 1) + " of 3";
      back.hidden = i === 0;
      if (hasGsap && !reduced) gsap.fromTo($$("legend, .opts button", qs[i]), { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: .04, duration: .5, ease: "power3.out" });
    }
    function finish() {
      var look = answers.look;
      // Practical overrides based on how the space is used
      if (answers.room === "wet") look = "wood";
      if (answers.room === "stairs" && look === "plain") look = "stripe";
      var r = REC[look] || REC.plain;
      var text = r.d;
      if (answers.life === "pets" && look === "natural") text += " With pets we'd steer you to a tighter-weave wool-sisal that's easier to clean.";
      else if (answers.life === "pets" || answers.life === "kids") text += " We'll show you stain-resistant options that suit busy homes.";
      $("[data-res-title]", root).textContent = r.t;
      $("[data-res-text]", root).textContent = text;
      var img = $("[data-res-img]", root); img.src = r.img; img.alt = r.t;
      var tags = $("[data-res-tags]", root); tags.innerHTML = "";
      [ROOM[answers.room], LIFE[answers.life], "Samples brought to you"].forEach(function (t) { if (!t) return; var li = document.createElement("li"); li.textContent = t; tags.appendChild(li); });
      $("[data-res-cta]", root).setAttribute("data-room", answers.room === "commercial" ? "Commercial project" : r.room);
      qs.forEach(function (q) { q.classList.remove("is-active"); });
      result.hidden = false; back.hidden = true;
      bar.style.width = "100%";
      stepEl.textContent = "Your result";
      track("finder_complete", answers);
      if (hasGsap && !reduced) gsap.from($$(".res__img, .res__body > *", result), { y: 24, opacity: 0, stagger: .07, duration: .7, ease: "power3.out" });
    }
    qs.forEach(function (q, i) {
      $$("button", q).forEach(function (b) {
        b.addEventListener("click", function () {
          $$("button", q).forEach(function (x) { x.classList.remove("is-picked"); });
          b.classList.add("is-picked");
          answers[q.getAttribute("data-q")] = b.getAttribute("data-v");
          setTimeout(function () { i < qs.length - 1 ? show(i + 1) : finish(); }, 260);
        });
      });
    });
    back.addEventListener("click", function () { if (idx > 0) show(idx - 1); });
    $("[data-quiz-restart]", root).addEventListener("click", function () { answers = {}; $$(".is-picked", root).forEach(function (x) { x.classList.remove("is-picked"); }); show(0); });
  })();

  /* ---------- Marquee: duplicate for seamless loop ---------- */
  $$("[data-marquee] .marquee__track").forEach(function (t) { t.innerHTML += t.innerHTML; });

  /* ---------- Magnetic buttons (desktop pointer only) ---------- */
  if (!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches && hasGsap) {
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .32, duration: .4, ease: "power3.out" });
      });
      b.addEventListener("mouseleave", function () { gsap.to(b, { x: 0, y: 0, duration: .6, ease: "elastic.out(1, .4)" }); });
    });
  }

  /* ================= GSAP ANIMATIONS ================= */
  var loader = $(".loader");
  if (!hasGsap || reduced) {
    if (loader) loader.remove();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Split headings into words for reveals
  $$(".split").forEach(function (el) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(" ")); return; }
            var o = document.createElement("span"); o.className = "w";
            var i = document.createElement("span"); i.textContent = w; o.appendChild(i); frag.appendChild(o);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    gsap.from($$(".w > span", el), {
      yPercent: 110, duration: 1, ease: "power4.out", stagger: .045,
      scrollTrigger: { trigger: el, start: "top 85%" }
    });
  });

  // Generic fade-ups
  $$(".reveal-up").forEach(function (el) {
    if (el.closest(".hero")) return;
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });

  // Loader -> hero intro
  var intro = gsap.timeline({ defaults: { ease: "power4.out" } });
  if (loader) {
    intro.to(".loader__line i", { scaleX: 1, duration: .8, ease: "power2.inOut" })
      .to(".loader__inner", { opacity: 0, y: -16, duration: .4 }, "+=.05")
      .to(loader, { yPercent: -100, duration: .9, ease: "power4.inOut" }, "-=.1")
      .set(loader, { display: "none" });
  }
  intro.from(".hero__title .ln > span", { yPercent: 110, duration: 1.2, stagger: .1 }, loader ? "-=.45" : 0)
    .to(".hero .reveal-up", { opacity: 1, y: 0, duration: 1, stagger: .1, ease: "power3.out" }, "-=.9")
    .from(".hero__img--main", { clipPath: "inset(100% 0 0 0 round 28px)", duration: 1.4, ease: "power4.inOut" }, "-=1.3")
    .from(".hero__img--main img", { scale: 1.3, duration: 1.8, ease: "power3.out" }, "<")
    .from(".hero__img--b, .hero__img--c", { y: 80, opacity: 0, duration: 1.1, stagger: .12, ease: "power3.out" }, "-=1.2")
    .from(".hero__badge", { scale: 0, rotate: -90, duration: 1, ease: "back.out(1.6)" }, "-=.8")
    .from(".hero__card", { x: -30, opacity: 0, duration: .8, ease: "power3.out" }, "-=.7");

  // Hero parallax
  gsap.to(".hero__img--b", { yPercent: -22, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__img--c", { yPercent: 28, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__img--main img", { yPercent: 10, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  // Collections: staggered clip reveal
  gsap.from(".col", {
    clipPath: "inset(0 0 100% 0 round 28px)", y: 40, duration: 1.2, stagger: .1, ease: "power4.out",
    scrollTrigger: { trigger: ".cols", start: "top 80%" }
  });

  // Stair stack: cards fan out then cycle
  (function stairStack() {
    var imgs = $$("[data-stack] img"); if (!imgs.length) return;
    gsap.set(imgs, { rotate: function (i) { return [-6, 4, -2, 0][i] || 0; }, x: function (i) { return [-24, 22, -8, 0][i] || 0; } });
    gsap.from(imgs, { y: 120, opacity: 0, stagger: .12, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ".stairs", start: "top 70%" } });
    var order = imgs.slice();
    setInterval(function () {
      if (document.hidden) return;
      var top = order[order.length - 1];
      gsap.timeline()
        .to(top, { x: 260, rotate: 14, opacity: 0, duration: .6, ease: "power2.in" })
        .add(function () { top.parentNode.insertBefore(top, top.parentNode.firstChild); order.unshift(order.pop()); })
        .set(top, { x: -24, rotate: -6, opacity: 1 })
        .to(order, { x: function (i) { return [-24, 22, -8, 0][i]; }, rotate: function (i) { return [-6, 4, -2, 0][i]; }, duration: .7, ease: "power3.out" });
    }, 3200);
  })();

  // Counters
  $$("[data-count]").forEach(function (el) {
    var end = parseInt(el.getAttribute("data-count"), 10);
    var from = parseInt(el.getAttribute("data-from") || "0", 10);
    var o = { v: from };
    el.textContent = from;
    gsap.to(o, { v: end, duration: 2, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%" }, onUpdate: function () { el.textContent = Math.round(o.v); } });
  });
  gsap.from(".usp", { y: 60, opacity: 0, stagger: .12, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".usps", start: "top 82%" } });

  // Horizontal gallery (desktop pin)
  ScrollTrigger.matchMedia({
    "(min-width: 900px)": function () {
      var track = $("[data-htrack]"), pin = $("[data-hscroll]");
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var tw = gsap.to(track, {
        x: function () { return -dist(); }, ease: "none",
        scrollTrigger: { trigger: pin, start: "top top", end: function () { return "+=" + dist(); }, pin: true, scrub: .8, invalidateOnRefresh: true, anticipatePin: 1 }
      });
      $$(".shot img", track).forEach(function (img) {
        gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img.parentNode, containerAnimation: tw, start: "left right", end: "right left", scrub: true } });
      });
    }
  });

  // Process line + steps
  gsap.to("[data-steps-line]", { scaleX: 1, ease: "none", scrollTrigger: { trigger: "[data-steps]", start: "top 70%", end: "bottom 60%", scrub: true } });
  gsap.from(".step", { y: 50, opacity: 0, stagger: .15, duration: .9, ease: "power3.out", scrollTrigger: { trigger: "[data-steps]", start: "top 80%" } });

  // Reviews
  gsap.from(".rev", { y: 50, opacity: 0, stagger: .1, duration: .9, ease: "power3.out", scrollTrigger: { trigger: "[data-revs]", start: "top 85%" } });

  // Story
  gsap.to("[data-parallax] img", { yPercent: -14, ease: "none", scrollTrigger: { trigger: "[data-parallax]", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".story__year", { xPercent: -20, opacity: 0, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: ".story", start: "top 70%" } });
  gsap.from(".tl", { x: -30, opacity: 0, stagger: .15, duration: .9, ease: "power3.out", scrollTrigger: { trigger: ".timeline", start: "top 82%" } });

  // Commercial bg parallax
  gsap.fromTo("[data-parallax-bg]", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".commercial", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".commercial__list li", { x: 40, opacity: 0, stagger: .08, duration: .8, ease: "power3.out", scrollTrigger: { trigger: ".commercial__list", start: "top 85%" } });

  // Visit form card
  gsap.from(".formcard", { y: 80, opacity: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".visit", start: "top 75%" } });

  // Footer wordmark
  gsap.from(".ftr__big", { yPercent: 40, opacity: 0, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: ".ftr", start: "top 90%" } });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
