/* ==========================================================================
   Skoon — homepage interactions
   - CSS/SVG packaging renderer (front/back/sides) → swap for real renders
   - GSAP ScrollTrigger: hero, 360° bag rotation, text reveals, UGC wall
   - Skio subscription builder
   - Skoon Assistant (Shopify / Skio / Gorgias integration points stubbed)
   ========================================================================== */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile = function () { return window.matchMedia("(max-width: 760px)").matches; };

  /* ------------------------------------------------------------------
     1. Packaging renderer
     ------------------------------------------------------------------ */
  var VARIANTS = {
    original: { cls: "", sub: "All Natural <b>Cat Litter</b>", tag: "", foot: "8 lb" },
    lavender: { cls: "bag--lavender", sub: "Natural <b>Lavender Scent</b>", tag: "LAVENDER", foot: "8 lb" },
    fine: { cls: "bag--fine", sub: "All Natural <b>Cat Litter</b>", tag: "FINE GRAIN", foot: "8 lb" }
  };

  var CAT_SVG =
    '<svg viewBox="0 0 120 110" aria-hidden="true"><defs>' +
    '<radialGradient id="cf{id}" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#f1f1f1"/><stop offset=".6" stop-color="#c7c8ca"/><stop offset="1" stop-color="#8d8f93"/></radialGradient></defs>' +
    '<ellipse cx="60" cy="88" rx="44" ry="24" fill="url(#cf{id})"/>' +
    '<path d="M28 30 22 4l22 16M92 30l6-26-22 16" fill="#b9babd"/>' +
    '<path d="M30 26 26 10l13 10M90 26l4-16-13 10" fill="#e9c6c9"/>' +
    '<ellipse cx="60" cy="46" rx="36" ry="31" fill="url(#cf{id})"/>' +
    '<path d="M44 26q4 6 0 12M60 22v12M76 26q-4 6 0 12" stroke="#9a9ca0" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '<path d="M38 47q6 5 12 0M70 47q6 5 12 0" stroke="#2d2d2d" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
    '<path d="M56 55h8l-4 4z" fill="#d48b93"/>' +
    '<path d="M60 59q-3 5-9 4M60 59q3 5 9 4" stroke="#4a4a4a" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
    '<path d="M24 54l18 2M24 61l18-1M96 54l-18 2M96 61l-18-1" stroke="#fff" stroke-width="1" opacity=".8"/>' +
    '<ellipse cx="44" cy="100" rx="11" ry="7" fill="#e6e6e6"/><ellipse cx="76" cy="100" rx="11" ry="7" fill="#e6e6e6"/>' +
    '</svg>';
  var uid = 0;

  function frontHTML(v) {
    var d = VARIANTS[v] || VARIANTS.original;
    uid++;
    return '<div class="face front">' +
      '<div class="f-crimp"></div><div class="f-edge"></div>' +
      (d.tag ? '<div class="f-tag">' + d.tag + '</div>' : "") +
      '<div class="f-logo">Skoon</div>' +
      '<div class="f-sub">' + d.sub + '</div>' +
      '<div class="f-flag">ALL<br>NATURAL</div>' +
      '<div class="f-icons"><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
      '<div class="f-cat">' + CAT_SVG.replace(/\{id\}/g, uid) + '</div>' +
      '<div class="f-foot"><span>●</span> ' + d.foot + '</div>' +
      '</div>';
  }
  function backHTML(v) {
    var fine = v === "fine";
    return '<div class="face back">' +
      '<div class="back__logo">Skoon</div>' +
      '<div class="back__h">' + (fine ? "Fine grain · for sensitive paws" : "Why cats love Skoon") + '</div>' +
      '<ul>' +
      '<li>100% odor-free guarantee</li>' +
      '<li>Low dust, non-tracking</li>' +
      '<li>4× lighter than traditional cat litter</li>' +
      '<li>All natural, hypoallergenic &amp; toxin free</li>' +
      (fine ? '<li>Compatible with self-cleaning litter boxes</li>' : '<li>Non-clumping diatom pebbles</li>') +
      '</ul>' +
      '<div class="back__how"><b>How to use:</b> Pour into a clean box. Scoop the occasional solid. When pebbles turn off-white, dump &amp; replace.<div class="back__bar">' + new Array(22).join("<i></i>") + '</div></div>' +
      '</div>';
  }
  function sideHTML(cls) {
    return '<div class="face side ' + cls + '"><div class="side__txt">Skoon <small>ALL NATURAL CAT LITTER</small></div></div>';
  }
  function renderBags(root) {
    $$("[data-bag3d]", root).forEach(function (el) {
      var v = el.getAttribute("data-bag3d");
      el.className = "bag3d bag " + (VARIANTS[v] || VARIANTS.original).cls + (el.classList.contains("bag3d--xl") ? " bag3d--xl" : "");
      el.innerHTML = frontHTML(v) + backHTML(v) + sideHTML("side--r") + sideHTML("side--l") + '<div class="face top"></div><div class="face bottom"></div>';
    });
    $$("[data-bag-flat]", root).forEach(function (el) {
      var v = el.getAttribute("data-bag-flat");
      var keep = el.classList.contains("flat-bag--xs") ? " flat-bag--xs" : "";
      el.className = "flat-bag bag " + (VARIANTS[v] || VARIANTS.original).cls + keep;
      el.innerHTML = frontHTML(v);
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", "Skoon " + (v === "fine" ? "Fine Grain" : v === "lavender" ? "Natural Lavender" : "Original") + " cat litter bag");
    });
    $$("[data-bag-mini]", root).forEach(function (el) {
      var v = el.getAttribute("data-bag-mini");
      el.className = "mini-bag bag " + (VARIANTS[v] || VARIANTS.original).cls;
      el.innerHTML = frontHTML(v);
      el.setAttribute("aria-hidden", "true");
    });
  }
  renderBags(document);

  /* ------------------------------------------------------------------
     2. Nav, drawer
     ------------------------------------------------------------------ */
  var nav = $("#nav");
  var hero = $(".hero");
  function onScrollNav() {
    nav.classList.toggle("is-solid", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  var burger = $(".nav__burger"), drawer = $("#drawer");
  function setMenu(open) {
    burger.setAttribute("aria-expanded", open);
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", !open);
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  $$("#drawer a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  /* ------------------------------------------------------------------
     3. Split text helpers
     ------------------------------------------------------------------ */
  function splitWords(el) {
    var out = [];
    (function walk(node, parent) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"); w.className = "w";
            var i = document.createElement("span"); i.textContent = p;
            w.appendChild(i); frag.appendChild(w); out.push(i);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== "BR") {
          walk(n);
        }
      });
    })(el);
    return out;
  }
  var splitEls = $$(".split");
  splitEls.forEach(function (el) { el._words = splitWords(el); });
  var statement = $(".reveal-words");
  var statementWords = statement ? splitWords(statement).map(function (i) { return i.parentNode; }) : [];

  /* ------------------------------------------------------------------
     4. Pebbles
     ------------------------------------------------------------------ */
  $$("[data-pebbles]").forEach(function (box) {
    var n = parseInt(box.getAttribute("data-pebbles"), 10);
    if (isMobile()) n = Math.round(n * 0.5);
    var xmin = parseFloat(box.getAttribute("data-xmin") || 0);
    for (var i = 0; i < n; i++) {
      var p = document.createElement("span");
      p.className = "pebble";
      var s = 6 + Math.random() * 22;
      p.style.width = s + "px"; p.style.height = s * (0.8 + Math.random() * 0.3) + "px";
      p.style.left = xmin + Math.random() * (100 - xmin) + "%"; p.style.top = Math.random() * 100 + "%";
      p.style.opacity = (0.25 + Math.random() * 0.6).toFixed(2);
      p.dataset.depth = (0.2 + Math.random()).toFixed(2);
      box.appendChild(p);
    }
  });

  /* ------------------------------------------------------------------
     5. Counters
     ------------------------------------------------------------------ */
  function runCounter(el) {
    var target = +el.dataset.count, suf = el.dataset.suffix || "", t0 = null, dur = 1600;
    if (reduced) { el.textContent = target.toLocaleString() + suf; return; }
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(target * e).toLocaleString() + suf;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach(function (el) { cio.observe(el); });

  /* ------------------------------------------------------------------
     6. Motion (GSAP)
     ------------------------------------------------------------------ */
  var factEls = $$("#spinFacts li");
  function setFact(i) {
    factEls.forEach(function (li, k) { li.classList.toggle("is-active", k === i); });
  }

  function initMotion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST || reduced) {
      document.documentElement.classList.add("no-motion");
      statementWords.forEach(function (w) { w.classList.add("on"); });
      return;
    }
    gsap.registerPlugin(ST);

    /* hero intro */
    var heroWords = $(".hero__title")._words || [];
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(heroWords, { yPercent: 110, duration: 1.2, stagger: 0.07 })
      .from(".hero .eyebrow, .hero__lede, .hero__offer, .hero__ctas, .hero__trust", { y: 30, opacity: 0, duration: 1, stagger: 0.08 }, 0.3)
      .from("#heroBag", { y: -260, rotateZ: -8, opacity: 0, duration: 1.6, ease: "elastic.out(1, .65)" }, 0.2)
      .from(".hero__side--l .flat-bag", { x: -120, opacity: 0, duration: 1.2 }, 0.5)
      .from(".hero__side--r .flat-bag", { x: 120, opacity: 0, duration: 1.2 }, 0.55)
      .from(".float-chip", { scale: 0.6, opacity: 0, duration: 0.8, stagger: 0.12, ease: "back.out(2)" }, 1)
      .from(".hero__ring", { scale: 0.6, opacity: 0, duration: 1.6 }, 0);

    gsap.to(".hero__main", { y: -14, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(".float-chip--a", { y: -10, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(".float-chip--b", { y: 12, duration: 3.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(".float-chip--c", { y: -8, duration: 2.8, yoyo: true, repeat: -1, ease: "sine.inOut" });

    /* hero bag: pointer tilt + scroll spin */
    var heroBag = $("#heroBag .bag3d");
    var tilt = { x: 0, y: 0 };
    var heroSpin = { r: 0 };
    function applyHero() { heroBag.style.transform = "rotateX(" + (4 + tilt.y) + "deg) rotateY(" + (-24 + tilt.x + heroSpin.r) + "deg)"; }
    if (window.matchMedia("(hover: hover)").matches) {
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        gsap.to(tilt, { x: ((e.clientX - r.left) / r.width - 0.5) * 36, y: -((e.clientY - r.top) / r.height - 0.5) * 16, duration: 0.8, ease: "power3.out", onUpdate: applyHero });
      });
    }
    gsap.to(heroSpin, { r: 70, ease: "none", onUpdate: applyHero, scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 } });
    gsap.to(".hero__side--l", { yPercent: -60, rotate: -18, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__side--r", { yPercent: -10, rotate: 20, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    $$(".hero .pebble").forEach(function (p) {
      gsap.to(p, { y: -220 * p.dataset.depth, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    });
    gsap.to(".hero__copy", { y: -80, opacity: 0.2, ease: "none", scrollTrigger: { trigger: hero, start: "center center", end: "bottom top", scrub: true } });

    /* split headings */
    splitEls.forEach(function (el) {
      if (el.classList.contains("hero__title")) return;
      gsap.from(el._words, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: el, start: "top 85%" } });
    });

    /* intro statement scrub */
    if (statementWords.length) {
      ST.create({
        trigger: statement, start: "top 80%", end: "bottom 45%", scrub: true,
        onUpdate: function (s) {
          var n = Math.round(s.progress * statementWords.length);
          statementWords.forEach(function (w, i) { w.classList.toggle("on", i < n); });
        }
      });
    }

    /* generic reveals */
    var revealGroups = [".stat", ".pcard", ".process__step", ".howto__step", ".vs__row", ".step", ".sp", ".bx", ".acc-card", ".acc-list details", ".rev", ".checks li"];
    revealGroups.forEach(function (sel) {
      var els = $$(sel); if (!els.length) return;
      ST.batch(els, {
        start: "top 88%",
        onEnter: function (b) { gsap.fromTo(b, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.08, overwrite: true }); }
      });
      gsap.set(els, { opacity: 0 });
    });
    gsap.from(".summary", { y: 80, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".builder", start: "top 80%" } });
    gsap.from(".press", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".press", start: "top 85%" } });
    gsap.from(".seal", { rotate: -180, scale: 0.4, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".guarantee", start: "top 75%" } });
    gsap.from(".pcard .flat-bag", { y: 120, rotate: 8, duration: 1.4, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".products", start: "top 80%" } });

    /* 360 rotation (pinned) */
    var spinBag = $("#spinBag .bag3d");
    var dial = $("#dialFg"), deg = $("#dialDeg");
    var lastFact = -1;
    var spinState = { r: 0 };
    gsap.set(spinBag, { rotateX: -6 });
    gsap.timeline({
      scrollTrigger: {
        trigger: "#spin", start: "top top", end: function () { return "+=" + (isMobile() ? 2.2 : 3) * window.innerHeight; },
        pin: ".spin__pin", scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (s) {
          var i = Math.min(3, Math.floor(s.progress * 4));
          if (i !== lastFact) { setFact(i); lastFact = i; }
        }
      }
    })
      .to(spinState, {
        r: 360, ease: "none", onUpdate: function () {
          var r = spinState.r;
          spinBag.style.transform = "rotateX(-6deg) rotateY(" + r + "deg)";
          if (dial) dial.style.strokeDashoffset = 327 - (327 * r) / 360;
          if (deg) deg.textContent = Math.round(r) + "°";
        }
      }, 0)
      .fromTo("#spinBag", { scale: 0.85, y: 40 }, { scale: 1.05, y: 0, ease: "sine.inOut", duration: 0.5 }, 0)
      .to("#spinBag", { scale: 1, duration: 0.5, ease: "sine.inOut" }, 0.5)
      .to(".pebbles--orbit", { rotate: 120, scale: 1.2, ease: "none", duration: 1 }, 0);

    /* story pebble */
    gsap.from(".pebble-xl svg", { scale: 0.6, rotate: -30, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".story", start: "top 70%" } });
    gsap.from(".pebble-xl__label", { scale: 0.5, opacity: 0, duration: 0.8, ease: "back.out(2)", stagger: 0.25, scrollTrigger: { trigger: ".pebble-xl", start: "top 60%" } });
    gsap.to(".pebble-xl .pores circle", { scale: 1.6, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: { each: 0.12, from: "random" } });
    gsap.to(".pebble-xl .drops circle", { attr: { cx: 200, cy: 200 }, opacity: 0, duration: 2.2, ease: "power2.in", repeat: -1, stagger: 0.55 });
    gsap.to(".pebble-xl", { y: -60, ease: "none", scrollTrigger: { trigger: ".story", start: "top bottom", end: "bottom top", scrub: true } });

    /* bento tilt (desktop) */
    if (window.matchMedia("(hover: hover)").matches) {
      $$(".tilt").forEach(function (el) {
        el.addEventListener("pointermove", function (e) {
          var r = el.getBoundingClientRect();
          gsap.to(el, { rotateY: ((e.clientX - r.left) / r.width - 0.5) * 8, rotateX: -((e.clientY - r.top) / r.height - 0.5) * 8, transformPerspective: 900, duration: 0.5 });
        });
        el.addEventListener("pointerleave", function () { gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "expo.out" }); });
      });
      $$(".magnetic").forEach(function (b) {
        b.addEventListener("pointermove", function (e) {
          var r = b.getBoundingClientRect();
          gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.2, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4 });
        });
        b.addEventListener("pointerleave", function () { gsap.to(b, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, .4)" }); });
      });
    }

    /* UGC wall: set A exits left, set B rises from below (pinned) */
    var setA = $$(".ugc__set--a .vcard"), setB = $$(".ugc__set--b .vcard");
    gsap.set(setB, { yPercent: 120, rotate: 6, opacity: 0 });
    gsap.from(setA, { y: 120, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: "#ugc", start: "top 70%" } });
    var ugcSec = $("#ugc"), ugcPage = $("#ugcPage");
    gsap.timeline({
      scrollTrigger: {
        trigger: "#ugc", start: "top top", end: function () { return "+=" + 1.6 * window.innerHeight; },
        pin: ".ugc__pin", scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (s) {
          var b = s.progress > 0.45;
          if (b !== ugcSec.classList.contains("show-b")) {
            ugcSec.classList.toggle("show-b", b);
            ugcPage.textContent = b ? "02" : "01";
            if (b) loadVideos(".ugc__set--b");
          }
        }
      }
    })
      .to({}, { duration: 0.15 })
      .to(setA, { xPercent: -140, rotate: -8, opacity: 0, ease: "power2.in", stagger: 0.06, duration: 0.5 })
      .to(setB, { yPercent: 0, rotate: 0, opacity: 1, ease: "expo.out", stagger: 0.08, duration: 0.6 }, "-=0.25")
      .to({}, { duration: 0.2 });

    /* sticky buy bar (mobile) */
    var sticky = $("#stickyBuy");
    ST.create({
      trigger: hero, start: "bottom top", endTrigger: ".footer", end: "top bottom",
      onToggle: function (s) { sticky.classList.toggle("is-on", s.isActive); sticky.setAttribute("aria-hidden", !s.isActive); }
    });
    var stickyHold = {};
    ["#subscribe", "#spin", "#ugc"].forEach(function (sel) {
      ST.create({
        trigger: sel, start: sel === "#subscribe" ? "top bottom" : "top top", end: sel === "#subscribe" ? "bottom top" : function () { return "+=" + window.innerHeight * (sel === "#ugc" ? 2.6 : 4.2); },
        onToggle: function (s) {
          stickyHold[sel] = s.isActive;
          sticky.classList.toggle("is-hidden", Object.keys(stickyHold).some(function (k) { return stickyHold[k]; }));
        }
      });
    });

    window.addEventListener("load", function () { ST.refresh(); });
  }

  if (document.readyState === "complete") initMotion();
  else window.addEventListener("load", initMotion);

  /* ------------------------------------------------------------------
     7. UGC videos — lazy load + lightbox
     Each .vcard takes data-video="https://cdn.shopify.com/videos/…mp4".
     ------------------------------------------------------------------ */
  function loadVideos(scope) {
    $$(scope + " .vcard").forEach(function (c) {
      var src = c.getAttribute("data-video");
      if (!src || c.querySelector("video")) return;
      var v = document.createElement("video");
      v.src = src; v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = "metadata";
      v.poster = c.querySelector("img").src;
      c.insertBefore(v, c.firstChild.nextSibling);
    });
  }
  var vio = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { loadVideos(".ugc__set--a"); vio.disconnect(); } });
  }, { rootMargin: "300px" });
  vio.observe($("#ugc"));

  var vmodal = $("#vmodal"), vframe = $("#vframe"), lastFocus = null;
  function openVideo(card) {
    lastFocus = card;
    var src = card.getAttribute("data-video");
    var img = card.querySelector("img");
    vframe.innerHTML = src
      ? '<video src="' + src + '" controls autoplay playsinline poster="' + img.src + '"></video>'
      : '<img src="' + img.src + '" alt="' + img.alt + '"><p class="vmodal__note">▶ “' + card.getAttribute("data-caption") + '” — the customer video from Skoon\'s Shopify Files plays here, with sound.</p>';
    vmodal.hidden = false;
    $(".vmodal__close").focus();
    document.body.style.overflow = "hidden";
  }
  function closeVideo() {
    vmodal.hidden = true; vframe.innerHTML = ""; document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  $$(".vcard").forEach(function (c) { c.addEventListener("click", function () { openVideo(c); }); });
  $(".vmodal__close").addEventListener("click", closeVideo);
  vmodal.addEventListener("click", function (e) { if (e.target === vmodal) closeVideo(); });

  /* ------------------------------------------------------------------
     8. Subscription builder (Skio)
     ------------------------------------------------------------------ */
  var PRICE = 29.99, SUB_OFF = 0.10;
  var NAMES = { original: "Skoon Original", lavender: "Skoon Natural Lavender", fine: "Skoon Fine Grain" };
  var state = { product: "original", cats: 1, mode: "sub", freq: 4 };
  var money = function (n) { return "$" + n.toFixed(2); };

  function updateBuilder() {
    var qty = state.cats;
    var once = PRICE * qty;
    var sub = Math.round(PRICE * (1 - SUB_OFF) * 100) / 100 * qty;
    var isSub = state.mode === "sub";
    $("#sumTitle").textContent = NAMES[state.product] + " × " + qty + (qty > 1 ? " bags" : " bag");
    $("#sumMeta").textContent = isSub ? "Delivered every " + state.freq + " weeks · free shipping" : "One-time delivery";
    $("#sumNow").textContent = money(isSub ? sub : once);
    $("#sumWas").textContent = isSub ? money(once) : "";
    $("#sumPer").textContent = isSub ? "/ delivery" : "";
    var perYear = (once - sub) * (52 / state.freq);
    $("#sumSave").textContent = isSub
      ? "You save " + money(once - sub) + " every delivery (≈ " + money(perYear) + " a year)"
      : "Subscribe to save " + money(once - sub) + " + get free shipping forever";
    $$(".perks [data-sub]").forEach(function (li) { li.classList.toggle("is-off", !isSub); });
    $("#giftChip").classList.toggle("is-off", !isSub);
    $("#freqWrap").classList.toggle("is-off", !isSub);
    $("#addToCart").innerHTML = (isSub ? "Start my subscription" : "Add to cart") + ' <span aria-hidden="true">→</span>';
    $("#sumFine").textContent = isSub ? "Auto-renews. Skip or cancel anytime from your account. No commitment." : "Switch to Subscribe & Save anytime to get 10% off.";
    var bag = $("#summaryBag");
    if (bag.getAttribute("data-bag-flat") !== state.product) {
      bag.setAttribute("data-bag-flat", state.product);
      renderBags(bag.parentNode);
      if (window.gsap && !reduced) window.gsap.fromTo(bag, { y: 30, rotate: -8, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 0.7, ease: "back.out(1.8)" });
    }
  }
  $$('input[name="b-product"]').forEach(function (i) { i.addEventListener("change", function () { state.product = i.value; updateBuilder(); }); });
  $$('input[name="b-cats"]').forEach(function (i) { i.addEventListener("change", function () { state.cats = +i.value; updateBuilder(); }); });
  $$('input[name="b-mode"]').forEach(function (i) { i.addEventListener("change", function () { state.mode = i.value; updateBuilder(); }); });
  $("#b-freq").addEventListener("change", function (e) { state.freq = +e.target.value; updateBuilder(); });

  function pick(product, mode, cats) {
    if (product) { state.product = product; var r = $('input[name="b-product"][value="' + product + '"]'); if (r) r.checked = true; }
    if (mode) { state.mode = mode; var m = $('input[name="b-mode"][value="' + mode + '"]'); if (m) m.checked = true; }
    if (cats) { state.cats = Math.min(3, cats); var c = $('input[name="b-cats"][value="' + state.cats + '"]'); if (c) c.checked = true; }
    updateBuilder();
  }
  $$("[data-pick]").forEach(function (a) {
    a.addEventListener("click", function () { pick(a.getAttribute("data-pick"), a.getAttribute("data-mode") || "sub"); });
  });
  updateBuilder();

  var toast = $("#toast"), toastT;
  function showToast(html) {
    toast.innerHTML = html; toast.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove("is-on"); }, 3200);
  }
  var cartN = 0;
  $("#addToCart").addEventListener("click", function () {
    // Shopify: POST /cart/add.js { id: variantId, quantity, selling_plan: skioSellingPlanId }
    cartN += state.cats;
    var cc = $(".cart-count");
    cc.textContent = cartN; cc.classList.remove("bump"); void cc.offsetWidth; cc.classList.add("bump");
    $(".cart-btn").setAttribute("aria-label", "Cart, " + cartN + " items");
    showToast(state.mode === "sub" ? "<b>✓</b> Subscription added — every " + state.freq + " weeks, 10% off forever" : "<b>✓</b> Added to cart");
  });

  /* ------------------------------------------------------------------
     9. Skoon Assistant
     Production wiring (Shopify App Proxy → /apps/skoon-assistant):
       ask()            → LLM grounded on Skoon catalog, policies, FAQs
       lookupOrder()    → Shopify Admin API (order by # + email)
       getSubscription()→ Skio API (next order, skip, frequency, swap)
       createTicket()   → Gorgias API (ticket with full transcript)
     In this prototype they are local stubs; answers only use facts
     published on skooncatlitter.com, and anything else is handed off.
     ------------------------------------------------------------------ */
  var API = {
    lookupOrder: function (num, email) {
      return wait(900).then(function () {
        return { demo: true, number: num, email: email, status: "Shipped", carrier: "In transit", items: "Skoon Original × 1" };
      });
    },
    getSubscription: function () {
      return wait(700).then(function () { return { demo: true, product: NAMES[state.product], qty: state.cats, every: state.freq }; });
    },
    createTicket: function (payload) {
      return wait(1000).then(function () { return { demo: true, id: "G-" + Math.floor(10000 + Math.random() * 89999), email: payload.email }; });
    }
  };
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  var KB = [
    { k: /^(hi|hey|hello|yo|howdy)\b/i, a: "Hi there! 👋 I can help you pick a litter, track an order, manage your subscription, or answer anything about Skoon.", chips: ["Which litter fits my cat best?", "How much litter do I need?", "Track my order"] },
    { k: /(track|where.*order|order status|my order|package)/i, flow: "track" },
    { k: /(manage|skip|pause|change.*(frequency|date|delivery)|swap|my subscription)/i, flow: "manage" },
    { k: /(human|agent|person|someone|representative|support team|talk to)/i, flow: "human" },
    { k: /(which litter|best for|fit|recommend|choose|right litter|difference between)/i, flow: "pick" },
    { k: /(price|cost|how much is|how much does|\$|cheap|expensive)/i, a: "An 8 lb bag is $29.99. Subscribe & Save and it's 10% off forever ($26.99), plus free shipping forever.", chips: ["Build my subscription"], src: "Product page" },
    { k: /(how much|how many bags|how long.*(last|bag)|last)/i, a: "One 8 lb bag lasts 1 cat up to 1 month. Most homes subscribe to one bag per cat, delivered every 4 weeks — you can change that anytime.", chips: ["Build my subscription", "How do I maintain it?"], src: "Product page" },
    { k: /(maintain|clean|scoop|change.*litter|replace|use skoon|how do i use|how to use)/i, a: "Easy: pour Skoon into a clean box. The pebbles absorb and dry, so the only thing you scoop is the occasional solid. When the pebbles turn off-white, dump and replace the whole batch.", chips: ["How much litter do I need?", "Is it safe for kittens?"], src: "Dump the Clump guide" },
    { k: /(clump)/i, a: "Skoon doesn't clump at all — and that's the point. Diatom pebbles are extra porous, so they soak up moisture and trap odor instead of forming wet clumps you have to hunt for every day.", src: "Product details" },
    { k: /(safe|toxic|kitten|health|allerg|sensitive)/i, a: "Skoon is made from diatomite — compressed deposits of fossilized algae skeletons, not strip-mined clay or synthetic chemical additives. It's 100% natural, non-toxic, hypoallergenic, and meets or exceeds OECD Test Guidelines. Sensitive paws? Our Fine Grain has a finer, more traditional feel.", chips: ["Tell me about Fine Grain"], src: "Eco-Friendly & Safe" },
    { k: /(fine grain)/i, a: "Skoon Fine Grain has the same qualities as our original pebbles with a finer texture — made for sensitive paws who prefer a traditional litter feel. Odor-absorbing, fragrance-free, and compatible with self-cleaning litter boxes. 4.5★ from 337 reviews.", chips: ["Subscribe to Fine Grain"], src: "Fine Grain product page" },
    { k: /(automatic|self.?clean|robot|litter box machine)/i, a: "Yes — Skoon Fine Grain is compatible with self-cleaning litter boxes.", chips: ["Subscribe to Fine Grain"], src: "Fine Grain product page" },
    { k: /(dust|track(ing)?\b(?!.*order)|floor)/i, a: "Skoon is low-dust and non-tracking — we reduced the pebble size to be low-dust and hypoallergenic, so there's no trail of litter across your floors.", src: "Product page" },
    { k: /(weigh|heavy|light)/i, a: "Because of its unique porous structure, Skoon is 4× lighter than traditional cat litter — much easier to carry and pour.", src: "Product details" },
    { k: /(lavender|scent|fragrance|smell|odou?r|stink)/i, a: "Diatom pebbles absorb moisture and trap odor so effectively that we guarantee your litter box will be 100% odor-controlled. Skoon Original comes Unscented or in Natural Lavender Scent; Fine Grain is fragrance-free.", chips: ["Which litter fits my cat best?", "What's the guarantee?"], src: "Product details" },
    { k: /(made of|ingredient|diatom|what is skoon|material)/i, a: "Skoon is made from diatom pebbles (diatomite) — naturally porous mineral pebbles. We purr-fected a low heat-thermal activation process for maximum absorbency.", src: "Our story" },
    { k: /(eco|biodegrad|environment|planet|sustainab)/i, a: "Being made from 100% all-natural, non-toxic materials means Skoon is inherently biodegradable and eco-friendly.", src: "Product details" },
    { k: /(discount|coupon|promo|code|deal|offer|free gift|halloween|toy)/i, a: "Best value is Subscribe & Save: 10% off forever, free shipping forever, and a free gift with new subscription orders (right now: a free Halloween toy 🎃).", chips: ["Build my subscription"], src: "Current offers" },
    { k: /(cancel)/i, a: "You can cancel anytime — no commitment. You can also skip a delivery or change your schedule if you just need a break.", chips: ["Manage my subscription"], src: "Subscription terms" },
    { k: /(subscri|skio|auto.?ship|recurring)/i, a: "Subscribe & Save gets you 10% off forever, free shipping forever, and you can skip, swap or cancel anytime. Deliveries default to every 4 weeks — one bag per cat.", chips: ["Build my subscription", "Manage my subscription"], src: "Subscription terms" },
    { k: /(ship|deliver|arrive|when will)/i, a: "Subscriptions ship free, forever, within the contiguous US. For delivery status on an existing order I can look it up for you.", chips: ["Track my order", "Talk to a human"], src: "Shipping" },
    { k: /(start a return)/i, flow: "human" },
    { k: /(return|refund|money back|guarantee|risk)/i, a: "Skoon comes with a 30-day risk-free, 100% odor control guarantee. If you and your cat don't love it, you'll get your money back — no questions asked. Want me to start that with our team?", chips: ["Start a return", "Talk to a human"], src: "Guarantee" },
    { k: /(contact|phone|email|call|address)/i, a: "You can reach the Skoon team at <a href=\"tel:8884339089\">888 433 9089</a> or <a href=\"mailto:help@skooncatlitter.com\">help@skooncatlitter.com</a>. Or I can pass your question to them right now.", chips: ["Talk to a human"] },
    { k: /(build my subscription|subscribe to)/i, flow: "build" }
  ];

  var bot = $("#bot"), fab = $("#botFab"), panel = $("#botPanel"), log = $("#botLog"), chipsBox = $("#botChips"), form = $("#botForm"), input = $("#botInput"), teaser = $("#botTeaser");
  var transcript = [];
  var greeted = false;

  function openBot(open) {
    bot.classList.toggle("is-open", open);
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", open);
    fab.setAttribute("aria-label", open ? "Close Skoon assistant" : "Open Skoon assistant");
    teaser.classList.remove("is-on");
    if (open && !greeted) {
      greeted = true;
      botSay("Hi! I'm the Skoon assistant 🐾 Ask me anything about our litter, your order, shipping, returns, or your subscription.", ["Which litter fits my cat best?", "How much litter do I need?", "What makes Skoon easier to clean?", "Track my order"]);
    }
    if (open) setTimeout(function () { input.focus(); }, 100);
    if (isMobile()) document.body.style.overflow = open ? "hidden" : "";
  }
  fab.addEventListener("click", function () { openBot(!bot.classList.contains("is-open")); });
  $(".bot__min").addEventListener("click", function () { openBot(false); fab.focus(); });
  teaser.addEventListener("click", function (e) {
    if (e.target.closest(".bot__teaser-x")) { teaser.classList.remove("is-on"); return; }
    openBot(true); handle("Which litter fits my cat best?");
  });
  $$("[data-open-chat]").forEach(function (b) { b.addEventListener("click", function () { openBot(true); }); });
  setTimeout(function () {
    if (bot.classList.contains("is-open")) return;
    teaser.classList.add("is-on");
    setTimeout(function () { teaser.classList.remove("is-on"); }, 12000);
  }, 9000);
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!vmodal.hidden) closeVideo();
    else if (bot.classList.contains("is-open")) { openBot(false); fab.focus(); }
    else if (drawer.classList.contains("is-open")) setMenu(false);
  });

  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function scrollLog() { log.scrollTop = log.scrollHeight; }
  function addMsg(html, who, extra) {
    var m = document.createElement("div");
    m.className = "msg msg--" + who;
    m.innerHTML = html + (extra || "");
    log.appendChild(m); scrollLog();
    return m;
  }
  var chipOverride = null;
  function setChips(list) {
    chipsBox.innerHTML = "";
    (list || []).forEach(function (c) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = c;
      b.addEventListener("click", function () {
        var f = chipOverride; chipOverride = null;
        if (f) { userSay(c); f(c); } else handle(c);
      });
      chipsBox.appendChild(b);
    });
  }
  function typing() {
    var t = document.createElement("div"); t.className = "msg msg--bot typing"; t.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(t); scrollLog(); return t;
  }
  function botSay(html, chips, src, card) {
    var t = typing();
    return wait(450 + Math.min(900, html.length * 6)).then(function () {
      t.remove();
      transcript.push({ who: "bot", text: html.replace(/<[^>]+>/g, "") });
      var m = addMsg("<p>" + html + "</p>", "bot", (card || "") + (src ? '<span class="msg__src">Source: ' + src + "</span>" : ""));
      setChips(chips);
      return m;
    });
  }
  function askChoice(html, chips, fn, src) {
    return botSay(html, chips, src).then(function () { chipOverride = fn; });
  }
  function userSay(text) { transcript.push({ who: "user", text: text }); addMsg(esc(text), "user"); setChips([]); }

  function handle(text) {
    text = (text || "").trim(); if (!text) return;
    chipOverride = null;
    userSay(text);
    if (/^(build my subscription|subscribe to fine grain)$/i.test(text)) return flowBuild(/fine/i.test(text) ? "fine" : null);
    if (/^manage my subscription$/i.test(text)) return flowManage();
    if (/^track my order$/i.test(text)) return flowTrack();
    if (/^tell me about fine grain$/i.test(text)) return answer(KB.filter(function (x) { return x.src === "Fine Grain product page"; })[0]);
    var hit = null;
    for (var i = 0; i < KB.length; i++) { if (KB[i].k.test(text)) { hit = KB[i]; break; } }
    if (!hit) return fallback(text);
    answer(hit);
  }
  function answer(hit) {
    if (hit.flow === "track") return flowTrack();
    if (hit.flow === "manage") return flowManage();
    if (hit.flow === "human") return flowHuman();
    if (hit.flow === "pick") return flowPick();
    if (hit.flow === "build") return flowBuild();
    botSay(hit.a, hit.chips || ["Talk to a human"], hit.src);
  }
  function fallback() {
    botSay("Good question — I don't want to guess on that one. I can pass it to the Skoon care team with this chat attached so you don't have to repeat yourself.", ["Talk to a human", "Which litter fits my cat best?"]);
  }

  /* -- flows -- */
  function flowPick() {
    askChoice("Let's find your perfect match. Does your cat have sensitive paws, or do you use a self-cleaning litter box?", ["Yes", "No"], function (a) {
      if (a === "Yes") return askCats("fine");
      askChoice("Would you like a light, natural scent — or unscented?", ["Natural lavender", "Unscented"], function (b) {
        askCats(/lavender/i.test(b) ? "lavender" : "original");
      });
    });
  }
  function askCats(product) {
    askChoice("And how many cats share the litter box?", ["1 cat", "2 cats", "3+ cats"], function (c) {
      var n = parseInt(c, 10);
      var why = product === "fine" ? "a finer, traditional feel and it works with self-cleaning boxes" : product === "lavender" ? "our original pebbles with a natural lavender scent" : "our original unscented pebbles, loved in 2,701 reviews, with a 100% odor-free guarantee";
      var card = '<div class="msg-card"><div class="row"><b>' + NAMES[product] + '</b><b>' + money(Math.round(PRICE * 0.9 * 100) / 100 * n) + '</b></div><div class="row"><span>' + n + (n > 1 ? " bags" : " bag") + ' every 4 weeks</span><span><s>' + money(PRICE * n) + '</s></span></div><div class="btns"><button class="pri" data-build="' + product + '" data-n="' + n + '">Build this subscription →</button></div></div>';
      botSay("I'd go with <b>" + NAMES[product] + "</b> — " + why + ". One 8 lb bag lasts 1 cat up to 1 month, so " + n + (n > 1 ? " bags" : " bag") + " per delivery:", ["Talk to a human"], "Product pages", card).then(bindBuild);
    });
  }
  function bindBuild(m) {
    $$("[data-build]", m).forEach(function (b) {
      b.addEventListener("click", function () {
        pick(b.getAttribute("data-build"), "sub", +b.getAttribute("data-n"));
        openBot(false);
        document.getElementById("subscribe").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        showToast("<b>✓</b> Your subscription is pre-built — review and start below");
      });
    });
  }
  function flowBuild(product) {
    var p = product || state.product;
    var card = '<div class="msg-card"><div class="row"><b>' + NAMES[p] + '</b><b>10% off</b></div><div class="row"><span>Free shipping forever · cancel anytime</span></div><div class="btns"><button class="pri" data-build="' + p + '" data-n="' + state.cats + '">Open the builder →</button></div></div>';
    botSay("Here's a head start on your subscription:", [], null, card).then(bindBuild);
  }
  function flowTrack() {
    var card = '<div class="msg-card"><form class="track-f"><label>Order number<input name="n" placeholder="#1001" required></label><label>Email<input name="e" type="email" placeholder="you@email.com" required autocomplete="email"></label><div class="btns"><button class="pri">Look up order</button></div></form></div>';
    botSay("Sure — I'll pull that from your Shopify order. What's your order number and email?", ["Talk to a human"], null, card).then(function (m) {
      var f = m.querySelector("form");
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var n = f.n.value.trim(), em = f.e.value.trim();
        f.querySelector("button").disabled = true;
        userSay("Order " + n);
        API.lookupOrder(n, em).then(function (o) {
          var c = '<div class="msg-card"><div class="row"><b>Order ' + esc(o.number) + '</b><span>' + o.status + '</span></div><div class="bar"><i></i></div><div class="row"><span>Ordered</span><span>Shipped</span><span>Delivered</span></div><div class="row"><span>Items</span><b>' + o.items + '</b></div><div class="btns"><button data-h>Something wrong?</button></div></div>';
          botSay("Found it! Here's the latest:" + (o.demo ? " <small>(demo data — live version reads Shopify)</small>" : ""), ["Manage my subscription", "Talk to a human"], "Shopify", c).then(function (mm) {
            mm.querySelector("[data-h]").addEventListener("click", function () { userSay("Something's wrong with my order"); flowHuman(); });
          });
        });
      });
    });
  }
  function flowManage() {
    API.getSubscription().then(function (s) {
      var card = '<div class="msg-card"><div class="row"><b>' + s.product + ' × ' + s.qty + '</b><span>every ' + s.every + ' wks</span></div><div class="row"><span>Price</span><b>10% off · free shipping</b></div><div class="btns"><button data-a="skip">Skip next</button><button data-a="freq">Change frequency</button><button data-a="swap">Swap scent</button><button data-a="cancel">Cancel</button></div></div>';
      botSay("Here's your Skoon subscription (via Skio)." + (s.demo ? " <small>(demo)</small>" : "") + " What would you like to do?", [], "Skio", card).then(function (m) {
        $$("[data-a]", m).forEach(function (b) {
          b.addEventListener("click", function () {
            var a = b.getAttribute("data-a"); userSay(b.textContent);
            if (a === "skip") botSay("Done — your next delivery is skipped. Everything else stays the same. ✓", ["Manage my subscription"], "Skio");
            if (a === "freq") askChoice("How often should we deliver?", ["Every 4 weeks", "Every 6 weeks", "Every 8 weeks"], function (c) {
              botSay("Updated — " + c.toLowerCase() + " it is. ✓", ["Manage my subscription"], "Skio");
            });
            if (a === "swap") askChoice("Which litter should we send next time?", ["Original", "Natural Lavender", "Fine Grain"], function (c) {
              botSay("Swapped to " + c + " from your next delivery. ✓", ["Manage my subscription"], "Skio");
            });
            if (a === "cancel") askChoice("Sorry to see you go. Before you cancel — would skipping a delivery or switching to every 8 weeks help? Otherwise I can cancel or connect you with our team.", ["Skip next instead", "Cancel anyway", "Talk to a human"], function (c) {
              if (/skip/i.test(c)) botSay("Done — next delivery skipped. ✓", [], "Skio");
              else if (/cancel/i.test(c)) botSay("Your subscription is cancelled. You won't be charged again. You're always welcome back. 🐾", [], "Skio");
              else flowHuman();
            });
          });
        });
      });
    });
  }
  function flowHuman() {
    var card = '<div class="msg-card"><form class="hf"><label>Name<input name="n" required autocomplete="name"></label><label>Email<input name="e" type="email" required autocomplete="email"></label><div class="btns"><button class="pri">Send to Skoon team</button></div></form></div>';
    botSay("I'll hand this to the Skoon care team. Our whole conversation goes with it, so you won't need to repeat anything.", [], "Gorgias", card).then(function (m) {
      var f = m.querySelector("form");
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        f.querySelector("button").disabled = true;
        API.createTicket({ name: f.n.value, email: f.e.value, transcript: transcript }).then(function (t) {
          addMsg("Conversation transferred to Skoon support", "sys");
          botSay("You're all set — ticket <b>#" + t.id + "</b> is with our team, and they'll reply to <b>" + esc(t.email) + "</b>. Need us sooner? Call <a href=\"tel:8884339089\">888 433 9089</a>." + (t.demo ? " <small>(demo ticket)</small>" : ""), ["Which litter fits my cat best?"], "Gorgias");
        });
      });
    });
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); var v = input.value; input.value = ""; handle(v); });
  $$(".bot__actions [data-intent]").forEach(function (b) {
    b.addEventListener("click", function () {
      var i = b.getAttribute("data-intent");
      userSay(b.textContent.replace(/^\S+\s/, ""));
      if (i === "track") flowTrack();
      if (i === "manage") flowManage();
      if (i === "pick") flowPick();
      if (i === "human") flowHuman();
    });
  });
})();
