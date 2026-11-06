/* =========================================================
   Technogel® — Home page interactions
   ========================================================= */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var G = typeof window.gsap !== "undefined";
  var SHOP = "https://technogelusa.com/products/";

  /* ---------------- Products (real US shop data) ---------------- */
  var P = [
    { id: "contour", cat: "pillow", coll: "Original Collection", name: "Contour Pillow", desc: "Our best seller for neck support. Dual-height ergonomic contour for side and back sleepers.", feats: ["Side & back", "Dual height", "Cooling"], price: 199, was: 215, img: "p_contour", tag: "Best seller", rating: "4.6", reviews: 7, url: "technogel-contour-cooling-gel-pillow" },
    { id: "deluxe", cat: "pillow", coll: "Original Collection", name: "Deluxe Pillow", desc: "A classic shape redefined: Technogel® cube design with patented air channels, for every sleep position.", feats: ["All sleepers", "Air channels", "Universal"], price: 199, was: 215, img: "p_deluxe", url: "deluxe-cooling-gel-pillow" },
    { id: "anatomic", cat: "pillow", coll: "Original Collection", name: "Anatomic Pillow", desc: "Wave-shaped contour with a molded neck zone, optimized for back sleepers.", feats: ["Back sleepers", "Wave contour", "Cooling"], price: 199, was: 215, img: "p_anatomic", url: "anatomic-cooling-gel-pillow" },
    { id: "side", cat: "pillow", coll: "Original Collection", name: "Side Sleeper Pillow", desc: "A shoulder cut-out lets you sink in naturally while the gel keeps your neck aligned.", feats: ["Side sleepers", "Shoulder cut-out", "Cooling"], price: 199, was: 215, img: "s_side", mul: true, url: "technogel-side-sleeper-pillow" },
    { id: "vive", cat: "pillow", coll: "Vive® Collection", name: "Vive® Deluxe Pillow", desc: "Our most exclusive pillow: an extra-thick Technogel® layer and a soft cooling cover.", feats: ["Extra-thick gel", "Luxury", "Cooling cover"], price: 249, was: 269, img: "p_vive", tag: "Most exclusive", url: "vive-deluxe-gel-pillow" },
    { id: "seat", cat: "living", coll: "Living", name: "Square Seat Pad", desc: "Turns any chair into an ergonomic seat with even pressure distribution, all day long.", feats: ["Office & car", "Posture", "Pressure relief"], price: 159, was: 175, img: "s_seat_square", mul: true, url: "square-seat-pad" },
    { id: "lumbar", cat: "living", coll: "Living", name: "Lumbar Support", desc: "Supports the natural curve of your spine and relieves your lower back.", feats: ["Lower back", "Ergonomic", "Seat upgrade"], price: 89, was: 99, img: "p_lumbar", url: "lumbar-support" },
    { id: "pebble", cat: "living", coll: "Living", name: "Pebble Seat Pad", desc: "A compact, rounded cooling gel cushion for desk chairs, cars and stadium seats.", feats: ["Portable", "Cooling", "Compact"], price: 89, was: 99, img: "s_seat_pebble", mul: true, url: "cooling-gel-seat-cushion" },
    { id: "travel", cat: "travel", coll: "Original Travel", name: "2-in-1 Travel Pillow", desc: "Cooling neck pillow and lumbar support in one, with its own travel bag.", feats: ["Neck & lumbar", "Travel bag", "Cooling"], price: 69, was: 79, img: "s_2in1", url: "2in1-cooling-neck-travel-support" },
    { id: "kids", cat: "travel", coll: "Technogel Jr.", name: "Jr. Essential Pillow", desc: "Cooling gel comfort sized for kids, with the same OEKO-TEX® certified materials.", feats: ["For kids", "Cooling", "OEKO-TEX®"], price: 89, was: 99, img: "s_kids", mul: true, url: "essential-pillow" }
  ];
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });
  function priceHTML(p) { return "$" + p.price + (p.was ? " <s>$" + p.was + "</s>" : ""); }

  var track = $("#products");
  track.innerHTML = P.map(function (p) {
    return '<article class="pcard" data-cat="' + p.cat + '">' +
      '<a class="pcard__art" href="' + SHOP + p.url + '" target="_blank" rel="noopener" data-cursor="Shop" aria-label="Shop ' + p.name + '">' +
      '<div class="pcard__tags">' + (p.tag ? '<span class="tag tag--blue">' + p.tag + "</span>" : "<span></span>") +
      (p.was ? '<span class="tag tag--save">Save $' + (p.was - p.price) + "</span>" : "") + "</div>" +
      '<img src="assets/img/' + p.img + '.webp" alt="Technogel ' + p.name + '" loading="lazy"' + (p.mul ? ' class="mul"' : "") + ">" +
      "</a>" +
      '<div class="pcard__body"><span class="pcard__coll">' + p.coll + "</span><h3>" + p.name + "</h3>" +
      (p.rating ? '<p class="pcard__rating"><span class="stars">★★★★★</span> ' + p.rating + " (" + p.reviews + " reviews)</p>" : "") +
      '<p class="pcard__desc">' + p.desc + "</p>" +
      '<ul class="pcard__feats">' + p.feats.map(function (f) { return "<li>" + f + "</li>"; }).join("") + "</ul>" +
      '<div class="pcard__foot"><span class="price">' + priceHTML(p) + "</span>" +
      '<a class="btn btn--blue btn--sm" href="' + SHOP + p.url + '" target="_blank" rel="noopener"><span>Shop now</span><i class="btn__arr">→</i></a></div>' +
      "</div></article>";
  }).join("");

  /* ---------------- Rail: drag, buttons, progress ---------------- */
  var rail = $("#rail"), bar = $("#railBar");
  function railProgress() {
    var max = rail.scrollWidth - rail.clientWidth;
    var vis = rail.clientWidth / rail.scrollWidth;
    bar.style.width = Math.max(12, vis * 100) + "%";
    bar.style.transform = "translateX(" + (max > 0 ? (rail.scrollLeft / max) * ((1 / Math.max(vis, .12)) - 1) * 100 : 0) + "%)";
  }
  rail.addEventListener("scroll", railProgress, { passive: true });
  window.addEventListener("resize", railProgress);
  $$(".rbtn").forEach(function (b) {
    b.addEventListener("click", function () {
      var card = $(".pcard:not(.is-hidden)", rail);
      var step = card ? card.offsetWidth + 18 : 320;
      rail.scrollBy({ left: step * +b.dataset.dir, behavior: "smooth" });
    });
  });
  (function drag() {
    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    window.addEventListener("pointermove", function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; rail.classList.add("is-drag"); } rail.scrollLeft = sl - dx; });
    window.addEventListener("pointerup", function () { down = false; rail.classList.remove("is-drag"); });
    rail.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    rail.addEventListener("dragstart", function (e) { e.preventDefault(); });
  })();

  function filter(cat) {
    $$(".chips button").forEach(function (x) { x.setAttribute("aria-selected", x.dataset.filter === cat ? "true" : "false"); });
    var shown = [];
    $$(".pcard").forEach(function (c) { var on = cat === "all" || c.dataset.cat === cat; c.classList.toggle("is-hidden", !on); if (on) shown.push(c); });
    rail.scrollTo({ left: 0 });
    railProgress();
    if (G && !reduce) gsap.fromTo(shown, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .06, ease: "expo.out" });
  }
  $$(".chips button").forEach(function (b) { b.addEventListener("click", function () { filter(b.dataset.filter); }); });
  $$("[data-filter-link]").forEach(function (a) { a.addEventListener("click", function () { filter(a.dataset.filterLink); }); });

  /* ---------------- Copy code + toast ---------------- */
  var toastEl = $("#toast"), tt;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove("show"); }, 2400); }
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var code = b.dataset.copy;
      var done = function () { toast("Code " + code + " copied. Use it at checkout."); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, done); else done();
    });
  });

  /* ---------------- Header + drawer + mega ---------------- */
  var hdr = $(".hdr"), lastY = 0, darkSecs = $$("[data-theme='dark']");
  function headerState(y) {
    hdr.classList.toggle("is-scrolled", y > 40);
    var open = hdr.querySelector(".nav__item.open") || document.body.classList.contains("drawer-open");
    if (!open) hdr.classList.toggle("is-hidden", y > lastY && y > 600);
    lastY = y;
    // light/dark text depending on the section beneath the header
    var probe = 60, onDark = false;
    for (var i = 0; i < darkSecs.length; i++) { var r = darkSecs[i].getBoundingClientRect(); if (r.top <= probe && r.bottom >= probe) { onDark = true; break; } }
    hdr.classList.toggle("is-light", !onDark);
  }
  $$(".has-mega").forEach(function (item) {
    var btn = $(".nav__link", item), t;
    function set(v) { item.classList.toggle("open", v); btn.setAttribute("aria-expanded", v ? "true" : "false"); if (v) hdr.classList.remove("is-hidden"); }
    item.addEventListener("mouseenter", function () { clearTimeout(t); set(true); });
    item.addEventListener("mouseleave", function () { t = setTimeout(function () { set(false); }, 180); });
    btn.addEventListener("click", function () { set(!item.classList.contains("open")); });
    $$(".mega a", item).forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
  });
  var burger = $(".burger"), drawer = $("#drawer");
  function setDrawer(v) {
    burger.setAttribute("aria-expanded", v ? "true" : "false");
    drawer.classList.toggle("open", v); drawer.setAttribute("aria-hidden", v ? "false" : "true");
    document.body.classList.toggle("drawer-open", v);
    if (lenis) { v ? lenis.stop() : lenis.start(); } else document.body.style.overflow = v ? "hidden" : "";
    hdr.classList.toggle("drawer-on", v);
    if (v) { hdr.classList.remove("is-hidden"); hdr.classList.remove("is-light"); }
  }
  burger.addEventListener("click", function () { setDrawer(burger.getAttribute("aria-expanded") !== "true"); });
  $$("#drawer a").forEach(function (a) { a.addEventListener("click", function () { setDrawer(false); }); });

  /* ---------------- Smooth scroll (Lenis) ---------------- */
  var lenis = null;
  if (typeof window.Lenis !== "undefined" && !reduce) {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    if (G) { lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else { (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0); }
  }
  // anchor links
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href"); if (id.length < 2) return;
      var el = document.querySelector(id); if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: id === "#top" ? 0 : -20, duration: 1.4 }); else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });
  function onScroll() {
    var y = window.scrollY;
    headerState(y);
    var bb = $("#buybar"); if (bb) bb.classList.toggle("show", y > window.innerHeight * .9 && y < document.body.scrollHeight - window.innerHeight * 1.6);
  }
  if (lenis) lenis.on("scroll", onScroll); window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    $$(".has-mega").forEach(function (o) { o.classList.remove("open"); });
    closeModals(); if (drawer.classList.contains("open")) setDrawer(false);
  });

  /* ---------------- Cursor ---------------- */
  var cur = $(".cursor");
  if (fine && cur && !reduce) {
    var cx = -100, cy = -100, tx = -100, ty = -100, lab = $(".cursor__label", cur);
    window.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; cur.style.opacity = 1; });
    document.addEventListener("mouseleave", function () { cur.style.opacity = 0; });
    (function loop() { cx += (tx - cx) * .2; cy += (ty - cy) * .2; cur.style.transform = "translate3d(" + cx + "px," + cy + "px,0)"; requestAnimationFrame(loop); })();
    document.addEventListener("mouseover", function (e) {
      var big = e.target.closest("[data-cursor]");
      var link = e.target.closest("a, button, summary, input, select, textarea, [role=slider]");
      cur.classList.toggle("is-big", !!big);
      cur.classList.toggle("is-link", !big && !!link);
      if (big) lab.textContent = big.dataset.cursor;
    });
  }

  /* ---------------- Heat compare ---------------- */
  var heat = $("#heat");
  if (heat) {
    var handle = $(".heat__handle", heat), dragging = false;
    function setX(clientX) { var r = heat.getBoundingClientRect(); var p = Math.min(96, Math.max(4, (clientX - r.left) / r.width * 100)); heat.style.setProperty("--x", p + "%"); handle.setAttribute("aria-valuenow", Math.round(p)); }
    heat.addEventListener("pointerdown", function (e) { dragging = true; setX(e.clientX); heat.setPointerCapture(e.pointerId); });
    heat.addEventListener("pointermove", function (e) { if (dragging) setX(e.clientX); });
    heat.addEventListener("pointerup", function () { dragging = false; });
    handle.addEventListener("keydown", function (e) {
      var v = parseFloat(getComputedStyle(heat).getPropertyValue("--x")) || 50;
      if (e.key === "ArrowLeft") v -= 5; else if (e.key === "ArrowRight") v += 5; else return;
      e.preventDefault(); v = Math.min(96, Math.max(4, v)); heat.style.setProperty("--x", v + "%"); handle.setAttribute("aria-valuenow", v);
    });
  }

  /* ---------------- Collections accordion ---------------- */
  var cols = $$(".col");
  cols.forEach(function (c) {
    function open() { cols.forEach(function (o) { o.classList.toggle("is-open", o === c); }); }
    c.addEventListener("mouseenter", function () { if (fine) open(); });
    c.addEventListener("focus", open);
  });

  /* ---------------- Quiz ---------------- */
  var quiz = $("#quiz");
  if (quiz) {
    var panes = $$(".pane", quiz), ans = [], step = 0, qbar = $("#quizBar"), qlab = $("#quizLabel"), back = $("#quizBack");
    function go(n) {
      var cur = panes[step], nxt = panes[n]; step = n;
      qbar.style.width = (n >= 3 ? 100 : 10 + n * 30) + "%";
      qlab.textContent = n >= 3 ? "Your match" : "Step " + (n + 1) + " of 3";
      back.hidden = n === 0 || n >= 3;
      if (G && !reduce) {
        gsap.to(cur, { opacity: 0, y: -16, duration: .25, ease: "power2.in", onComplete: function () {
          cur.classList.remove("is-on"); nxt.classList.add("is-on");
          gsap.fromTo(nxt, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, ease: "expo.out" });
          gsap.fromTo($$("button, .result__art, .result__body > *", nxt), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .6, stagger: .05, ease: "expo.out", delay: .05 });
        } });
      } else { cur.classList.remove("is-on"); nxt.classList.add("is-on"); }
    }
    function result() {
      var pos = ans[0], need = ans[1], sh = ans[2], id, why;
      if (need === "travel") { id = "travel"; why = "it gives you cooling neck support on the move and doubles as lumbar support."; }
      else if (need === "lux") { id = "vive"; why = "it has our thickest layer of Technogel® and a soft cooling cover for the most luxurious feel."; }
      else if (pos === "back") { id = "anatomic"; why = "its wave contour and molded neck zone are optimized for back sleepers" + (need === "hot" ? ", and the gel pulls heat away all night." : ", which relieves neck and shoulder tension."); }
      else if (pos === "side" && sh === "broad") { id = "side"; why = "the shoulder cut-out lets broad shoulders sink in while your neck stays perfectly aligned."; }
      else if (pos === "side") { id = "contour"; why = "its ergonomic neck and shoulder contour is made for side sleepers" + (need === "hot" ? ", and the gel keeps you cool." : ", easing neck tension."); }
      else { id = "deluxe"; why = "its universal shape and patented air channels adapt instantly every time you change position."; }
      var p = byId[id];
      var fit = { narrow: "Tip: choose the lower height option for narrow shoulders.", avg: "Tip: the standard height suits most sleepers with average shoulders.", broad: "Tip: choose the higher height option to fill the space above broad shoulders." }[sh] || "";
      var img = $("#rImg"); img.src = "assets/img/" + p.img + ".webp"; img.alt = "Technogel " + p.name; img.className = p.mul ? "mul" : "";
      $("#rName").textContent = p.name;
      $("#rWhy").textContent = "We picked it because " + why;
      $("#rFit").textContent = fit;
      $("#rPrice").innerHTML = priceHTML(p);
      $("#rLink").href = SHOP + p.url;
    }
    quiz.addEventListener("click", function (e) {
      var b = e.target.closest(".opts button"); if (!b) return;
      $$(".opts button", b.parentNode).forEach(function (x) { x.classList.remove("picked"); });
      b.classList.add("picked"); ans[step] = b.dataset.v;
      setTimeout(function () { if (step === 2) { result(); go(3); } else go(step + 1); }, 260);
    });
    back.addEventListener("click", function () { if (step > 0) go(step - 1); });
    $("#quizRestart").addEventListener("click", function () { ans = []; $$(".picked", quiz).forEach(function (x) { x.classList.remove("picked"); }); go(0); });
  }

  /* ---------------- Modals ---------------- */
  var filmM = $("#filmModal"), filmV = $("#filmVideo"), offer = $("#offer");
  function openFilm() { filmM.hidden = false; if (lenis) lenis.stop(); filmV.play().catch(function () {}); }
  function closeModals() {
    if (!filmM.hidden) { filmM.hidden = true; filmV.pause(); }
    if (!offer.hidden) offer.hidden = true;
    if (lenis && !document.body.classList.contains("drawer-open")) lenis.start();
  }
  $("#film").addEventListener("click", openFilm);
  filmM.addEventListener("click", function (e) { if (e.target === filmM || e.target.closest(".modal__x")) closeModals(); });
  offer.addEventListener("click", function (e) { if (e.target === offer || e.target.closest(".modal__x") || e.target.closest(".offer__no")) closeModals(); });
  (function exitIntent() {
    var armed = false, seen = false;
    try { seen = sessionStorage.getItem("tg_offer") === "1"; } catch (e) { /* ignore */ }
    if (seen) return;
    setTimeout(function () { armed = true; }, 12000);
    document.addEventListener("mouseout", function (e) {
      if (!armed || e.relatedTarget || e.clientY > 0 || window.innerWidth < 900 || !filmM.hidden) return;
      armed = false; try { sessionStorage.setItem("tg_offer", "1"); } catch (er) { /* ignore */ }
      offer.hidden = false; if (lenis) lenis.stop();
      if (G && !reduce) gsap.fromTo(".offer", { y: 40, opacity: 0, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: .8, ease: "expo.out" });
    });
  })();

  /* ---------------- Forms ---------------- */
  var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };
  var b2b = $("#b2bForm");
  b2b.addEventListener("submit", function (e) {
    e.preventDefault(); var ok = true;
    $$("[required]", b2b).forEach(function (f) { var bad = !f.value.trim() || (f.type === "email" && !emailOk(f.value)); f.classList.toggle("invalid", bad); if (bad) ok = false; });
    if (!ok) return;
    $(".form__ok", b2b).hidden = false; b2b.reset(); $("button[type=submit] span", b2b).textContent = "Request sent ✓";
  });
  var su = $("#signup");
  su.addEventListener("submit", function (e) {
    e.preventDefault(); var i = $("input", su);
    if (!emailOk(i.value)) { su.classList.add("invalid"); i.focus(); return; }
    su.classList.remove("invalid"); $(".signup__row", su).hidden = true; $(".form__ok", su).hidden = false;
  });

  /* ---------------- Manifesto word split ---------------- */
  var mt = $("[data-words]");
  if (mt) {
    (function split(node) {
      $$(":scope > *", node).forEach(split);
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType !== 3 || !n.textContent.trim()) return;
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) frag.appendChild(document.createTextNode(w));
          else { var s = document.createElement("span"); s.className = "w"; s.textContent = w; frag.appendChild(s); }
        });
        node.replaceChild(frag, n);
      });
    })(mt);
  }

  /* ---------------- Tech chapters ---------------- */
  var chapters = $$(".chapter"), timgs = $$(".tech__img"), tnum = $("#techNum");
  function chapter(i) {
    chapters.forEach(function (c, k) { c.classList.toggle("is-on", k === i); });
    timgs.forEach(function (im, k) { im.classList.toggle("is-on", k === i); });
    if (tnum) tnum.textContent = "0" + (i + 1);
  }

  /* ---------------- Loader + GSAP choreography ---------------- */
  var loader = $(".loader"), cnt = $(".loader__count span"), lbar = $(".loader__bar i");
  function finishLoad() {
    document.body.classList.remove("is-loading");
    loader.classList.add("is-done");
    intro();
    railProgress();
  }
  if (reduce || !G) { finishLoad(); }
  else {
    var o = { v: 0 }, ready = false, minDone = false;
    window.addEventListener("load", function () { ready = true; });
    setTimeout(function () { ready = true; }, 3500); // never block longer than this
    gsap.to(o, { v: 100, duration: 1.1, ease: "power2.inOut", onUpdate: function () { cnt.textContent = Math.round(o.v); lbar.style.width = o.v + "%"; }, onComplete: function () { minDone = true; } });
    (function wait() { if (ready && minDone) { gsap.to(loader, { yPercent: -100, duration: .9, ease: "expo.inOut", onComplete: function () { loader.classList.add("is-done"); } }); document.body.classList.remove("is-loading"); intro(); railProgress(); } else setTimeout(wait, 60); })();
  }

  function intro() {
    if (!G || reduce) {
      $$(".manifesto__text .w").forEach(function (w) { w.style.opacity = 1; });
      $$("[data-count]").forEach(function (el) { el.textContent = el.dataset.count; });
      chapterFallback();
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    var tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: .35 });
    tl.from(".hero__video", { scale: 1.35, duration: 2.4, ease: "expo.out" }, 0)
      .from(".hero__title .ln > span", { yPercent: 115, duration: 1.4, stagger: .1 }, .1)
      .from(".hero__eyebrow, .hero__sub, .hero__ctas > *, .hero__proof li", { y: 30, opacity: 0, duration: 1.1, stagger: .06 }, .5)
      .from(".hero__card", { x: 60, opacity: 0, duration: 1.4 }, .7)
      .from(".hdr__in", { y: -30, opacity: 0, duration: 1.2, clearProps: "transform,opacity" }, .3);

    // hero parallax out
    gsap.to(".hero__in", { yPercent: -18, opacity: .2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__video", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    // manifesto words
    gsap.to(".manifesto__text .w", { opacity: 1, stagger: .05, ease: "none", scrollTrigger: { trigger: ".manifesto__text", start: "top 80%", end: "bottom 45%", scrub: true } });
    gsap.fromTo(".manifesto__img img", { yPercent: -12 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".manifesto__img", start: "top bottom", end: "bottom top", scrub: true } });
    $$("[data-count]").forEach(function (el) {
      var obj = { v: 0 };
      ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: function () { gsap.to(obj, { v: +el.dataset.count, duration: 1.8, ease: "power3.out", onUpdate: function () { el.textContent = Math.round(obj.v); } }); } });
    });

    // generic section heads
    $$(".head, .b2b__intro, .finder__intro, .reviews__score, .heat__copy, .faq__grid > div:first-child").forEach(function (h) {
      gsap.from(h.children, { y: 50, opacity: 0, duration: 1.2, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 85%" } });
    });
    $$(".h2").forEach(function (h) {
      if (h.closest(".press")) return;
      gsap.from(h, { clipPath: "inset(0 0 100% 0)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 88%" } });
    });

    // product cards
    gsap.from(".pcard", { x: 120, opacity: 0, duration: 1.4, stagger: .07, ease: "expo.out", scrollTrigger: { trigger: "#rail", start: "top 85%" } });
    gsap.from(".bundle", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".bundle", start: "top 88%" } });
    gsap.from(".bundle__art img", { y: 60, rotate: 0, opacity: 0, duration: 1.4, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: ".bundle", start: "top 80%" } });

    // press section text
    gsap.from(".press__in > *", { y: 60, opacity: 0, duration: 1.3, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".press", start: "top 65%" } });

    // tech chapters
    ScrollTrigger.matchMedia({
      "(min-width: 901px)": function () {
        chapters.forEach(function (c, i) {
          ScrollTrigger.create({ trigger: c, start: "top 55%", end: "bottom 55%", onToggle: function (s) { if (s.isActive) chapter(i); } });
        });
      },
      "(max-width: 900px)": function () {
        chapters.forEach(function (c, i) {
          ScrollTrigger.create({ trigger: c, start: "top 70%", end: "bottom 40%", onToggle: function (s) { if (s.isActive) chapter(i); } });
        });
      }
    });
    gsap.from(".heat__viz", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".heat", start: "top 80%" } });
    // auto-sweep the heat slider once when it appears
    ScrollTrigger.create({ trigger: ".heat__viz", start: "top 70%", once: true, onEnter: function () {
      var v = { x: 50 };
      gsap.timeline().to(v, { x: 22, duration: 1, ease: "power2.inOut", onUpdate: function () { heat.style.setProperty("--x", v.x + "%"); } })
        .to(v, { x: 78, duration: 1.4, ease: "power2.inOut", onUpdate: function () { heat.style.setProperty("--x", v.x + "%"); } })
        .to(v, { x: 50, duration: 1, ease: "power2.inOut", onUpdate: function () { heat.style.setProperty("--x", v.x + "%"); } });
    } });

    // collections
    gsap.from(".col", { y: 80, opacity: 0, duration: 1.3, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".acc-cols", start: "top 85%" } });
    gsap.from(".quiz", { y: 80, opacity: 0, rotate: 1.5, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: ".quiz", start: "top 85%" } });

    // film
    gsap.fromTo(".film", { clipPath: "inset(12% 10% 12% 10% round 34px)" }, { clipPath: "inset(0% 0% 0% 0% round 34px)", ease: "none", scrollTrigger: { trigger: ".film", start: "top 95%", end: "top 30%", scrub: true } });
    gsap.from(".rv", { y: 50, opacity: 0, duration: 1.1, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".reviews__grid", start: "top 85%" } });
    gsap.from(".g", { y: 30, opacity: 0, duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ".guarantee", start: "top 90%" } });

    // B2B horizontal scroll (desktop)
    ScrollTrigger.matchMedia({
      "(min-width: 901px)": function () {
        var trackH = $(".hscroll__track");
        var dist = function () { return Math.max(0, trackH.scrollWidth - window.innerWidth); };
        gsap.to(trackH, { x: function () { return -dist(); }, ease: "none", scrollTrigger: { trigger: "#hscroll", start: "center center", end: function () { return "+=" + dist(); }, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
      }
    });
    gsap.from(".caps > div", { y: 40, opacity: 0, duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ".caps", start: "top 88%" } });
    gsap.from(".steps li", { x: -30, opacity: 0, duration: .9, stagger: .07, ease: "expo.out", scrollTrigger: { trigger: ".steps", start: "top 85%" } });
    gsap.from(".form", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".form", start: "top 88%" } });

    // story
    var tlEl = $(".timeline");
    gsap.to(tlEl, { "--tl": "100%", ease: "none", scrollTrigger: { trigger: tlEl, start: "top 85%", end: "bottom 50%", scrub: true } });
    gsap.from(".tl", { y: 40, opacity: 0, duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: tlEl, start: "top 85%" } });
    gsap.from(".loc", { y: 60, opacity: 0, duration: 1.1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ".locations", start: "top 88%" } });
    gsap.from(".post", { y: 60, opacity: 0, duration: 1.1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ".news__grid", start: "top 88%" } });
    gsap.from(".acc details", { y: 30, opacity: 0, duration: .9, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: ".acc", start: "top 85%" } });

    // final
    gsap.fromTo(".final__bg", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".final", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".final__title", { y: 80, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".final", start: "top 70%" } });
    gsap.from(".ftr__big", { yPercent: 40, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".ftr__big", start: "top 95%" } });

    // magnetic buttons
    if (fine) $$(".magnetic").forEach(function (b) {
      b.addEventListener("mousemove", function (e) { var r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .5, ease: "power3.out" }); });
      b.addEventListener("mouseleave", function () { gsap.to(b, { x: 0, y: 0, duration: .9, ease: "elastic.out(1,.4)" }); });
    });
    // hero product card tilt
    var hc = $(".hero__card");
    if (fine && hc) {
      hc.addEventListener("mousemove", function (e) { var r = hc.getBoundingClientRect(); gsap.to(hc, { rotateY: ((e.clientX - r.left) / r.width - .5) * 14, rotateX: -((e.clientY - r.top) / r.height - .5) * 14, transformPerspective: 800, duration: .6 }); });
      hc.addEventListener("mouseleave", function () { gsap.to(hc, { rotateY: 0, rotateX: 0, duration: 1, ease: "elastic.out(1,.5)" }); });
    }
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    setTimeout(function () { ScrollTrigger.refresh(); }, 1500);
  }
  function chapterFallback() {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) chapter(+x.target.dataset.i); }); }, { rootMargin: "-45% 0px -45% 0px" });
    chapters.forEach(function (c) { io.observe(c); });
  }
})();
