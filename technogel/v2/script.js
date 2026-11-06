/* Technogel® — Version B interactions */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var G = typeof window.gsap !== "undefined";
  var SHOP = "https://technogelusa.com/products/";
  var IMG = "../assets/img/";

  /* ---------- products (real US shop data) ---------- */
  var P = [
    { id: "contour", f: ["side", "back"], forTxt: "Side & back sleepers", name: "Contour Pillow", desc: "Our best seller. Dual-height ergonomic contour that keeps your neck aligned and cool all night.", price: 199, was: 215, img: "p_contour", badge: "Best seller", rate: "4.6 · 7 reviews", url: "technogel-contour-cooling-gel-pillow", feat: true },
    { id: "deluxe", f: ["combo"], forTxt: "All sleep positions", name: "Deluxe Pillow", desc: "Classic shape with Technogel® cube design and patented air channels.", price: 199, was: 215, img: "p_deluxe", url: "deluxe-cooling-gel-pillow" },
    { id: "anatomic", f: ["back"], forTxt: "Back sleepers", name: "Anatomic Pillow", desc: "Wave contour with a molded neck zone for healthy back sleeping.", price: 199, was: 215, img: "p_anatomic", url: "anatomic-cooling-gel-pillow" },
    { id: "side", f: ["side"], forTxt: "Side sleepers", name: "Side Sleeper Pillow", desc: "Shoulder cut-out lets you sink in while your neck stays aligned.", price: 199, was: 215, img: "s_side", mul: true, url: "technogel-side-sleeper-pillow" },
    { id: "vive", f: ["back", "side", "combo"], forTxt: "Ultimate luxury", name: "Vive® Deluxe", desc: "Extra-thick Technogel® layer and a soft cooling cover.", price: 249, was: 269, img: "p_vive", badge: "Premium", url: "vive-deluxe-gel-pillow" },
    { id: "seat", f: ["day"], forTxt: "Office & car", name: "Square Seat Pad", desc: "Even pressure distribution for long days in the chair.", price: 159, was: 175, img: "s_seat_square", mul: true, url: "square-seat-pad" },
    { id: "lumbar", f: ["day"], forTxt: "Lower back", name: "Lumbar Support", desc: "Supports the natural curve of your spine.", price: 89, was: 99, img: "p_lumbar", url: "lumbar-support" },
    { id: "travel", f: ["day"], forTxt: "Travel", name: "2-in-1 Travel Pillow", desc: "Neck pillow and lumbar support in one, with travel bag.", price: 69, was: 79, img: "s_2in1", mul: true, url: "2in1-cooling-neck-travel-support" },
    { id: "kids", f: ["day"], forTxt: "Kids", name: "Jr. Essential Pillow", desc: "Cooling gel comfort sized for kids.", price: 89, was: 99, img: "s_kids", mul: true, url: "essential-pillow" }
  ];
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });
  function price(p) { return "$" + p.price + (p.was ? " <s>$" + p.was + "</s>" : ""); }
  $("#grid").innerHTML = P.map(function (p) {
    return '<a class="card' + (p.feat ? " card--feat" : "") + '" data-f="' + p.f.join(" ") + '" href="' + SHOP + p.url + '" target="_blank" rel="noopener" data-cursor="Shop">' +
      '<div class="card__img"><div class="card__badges">' + (p.badge ? '<span class="badge badge--blue">' + p.badge + "</span>" : "<span></span>") +
      '<span class="badge badge--save">−$' + (p.was - p.price) + '</span></div><img src="' + IMG + p.img + '.webp" alt="Technogel ' + p.name + '" loading="lazy"' + (p.mul ? ' class="mul"' : "") + "></div>" +
      '<div class="card__body"><span class="card__for">' + p.forTxt + "</span><h3>" + p.name + "</h3>" +
      (p.rate ? '<p class="card__rate"><span class="stars">★★★★★</span> ' + p.rate + "</p>" : "") +
      '<p class="card__desc">' + p.desc + '</p><div class="card__foot"><span class="card__price">' + price(p) + '</span><span class="card__go" aria-hidden="true">→</span></div></div></a>';
  }).join("");

  /* ---------- segmented filter ---------- */
  var seg = $(".seg"), segBg = $(".seg__bg");
  function moveSeg(btn) { segBg.style.width = btn.offsetWidth + "px"; segBg.style.transform = "translateX(" + (btn.offsetLeft - 5) + "px)"; segBg.style.left = "5px"; }
  $$(".seg button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".seg button").forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
      moveSeg(b);
      var f = b.dataset.f, shown = [];
      $$(".card").forEach(function (c) { var on = f === "all" || c.dataset.f.split(" ").indexOf(f) > -1; c.classList.toggle("is-dim", !on); if (on) shown.push(c); });
      if (G && !reduce) gsap.fromTo(shown, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .05, ease: "expo.out" });
    });
  });
  window.addEventListener("resize", function () { moveSeg($('.seg button[aria-selected="true"]')); });
  requestAnimationFrame(function () { moveSeg($('.seg button[aria-selected="true"]')); });

  /* ---------- copy + toast ---------- */
  var tEl = $("#toast"), tt;
  function toast(m) { tEl.textContent = m; tEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { tEl.classList.remove("show"); }, 2400); }
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var c = b.dataset.copy, done = function () { toast(c + " copied. Paste it at checkout."); var l = $(".code__c", b); if (l) { l.textContent = "Copied ✓"; setTimeout(function () { l.textContent = "Copy"; }, 2000); } };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(c).then(done, done); else done();
    });
  });

  /* ---------- announcement rotator ---------- */
  var msgs = $$(".note__msg"), mi = 0;
  if (!reduce) setInterval(function () { msgs[mi].classList.remove("is-on"); mi = (mi + 1) % msgs.length; msgs[mi].classList.add("is-on"); }, 3800);

  /* ---------- header ---------- */
  var top = $(".top"), lastY = 0, dock = $("#dock");
  function onScroll() {
    var y = window.scrollY;
    top.classList.toggle("is-solid", y > 10);
    if (!document.body.classList.contains("sheet-open")) top.classList.toggle("is-hidden", y > lastY && y > 500);
    lastY = y;
    dock.classList.toggle("show", y > window.innerHeight && y < document.body.scrollHeight - window.innerHeight * 1.5);
  }
  var menu = $(".menu-btn"), sheet = $("#sheet");
  function setSheet(v) { menu.setAttribute("aria-expanded", v ? "true" : "false"); sheet.classList.toggle("open", v); sheet.setAttribute("aria-hidden", v ? "false" : "true"); document.body.classList.toggle("sheet-open", v); }
  menu.addEventListener("click", function () { setSheet(menu.getAttribute("aria-expanded") !== "true"); });
  $$("#sheet a").forEach(function (a) { a.addEventListener("click", function () { setSheet(false); }); });

  /* ---------- Lenis ---------- */
  var lenis = null;
  if (typeof window.Lenis !== "undefined" && !reduce) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    if (G) { gsap.registerPlugin(ScrollTrigger); lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    lenis.on("scroll", onScroll);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href"); if (id.length < 2) return; var el = document.querySelector(id); if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: id === "#top" ? 0 : -70, duration: 1.3 }); else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });

  /* ---------- hero gel floor (CSS 3D) ---------- */
  var floor = $("#floor");
  if (floor) {
    var cols = window.innerWidth < 700 ? 18 : 30, rows = window.innerWidth < 700 ? 9 : 13;
    floor.style.setProperty("--cols", cols);
    floor.style.height = (rows * (1900 / cols)) + "px";
    var frag = document.createDocumentFragment(), cells = [];
    for (var n = 0; n < cols * rows; n++) { var i = document.createElement("i"); frag.appendChild(i); cells.push(i); }
    floor.appendChild(frag);
    var hero = $(".hero"), raf = null, mx = -1, my = -1, t0 = 0;
    var rel = [];
    function measure() {
      cells.forEach(function (c) { c.style.setProperty("--p", 0); });
      var fr = floor.getBoundingClientRect();
      rel = cells.map(function (c) { var r = c.getBoundingClientRect(); return [r.left + r.width / 2 - fr.left, r.top + r.height / 2 - fr.top]; });
    }
    function paint(px, py) {
      if (!rel.length) measure();
      var fr = floor.getBoundingClientRect();
      for (var k = 0; k < cells.length; k++) {
        var d = Math.hypot(rel[k][0] + fr.left - px, (rel[k][1] + fr.top - py) * 1.6);
        var p = Math.max(0, 1 - d / 190);
        cells[k].style.setProperty("--p", (p * p).toFixed(3));
      }
    }
    window.addEventListener("resize", function () { rel = []; });
    if (fine && !reduce) {
      hero.addEventListener("pointermove", function (e) { mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(function () { raf = null; paint(mx, my); }); });
      hero.addEventListener("pointerleave", function () { cells.forEach(function (c) { c.style.setProperty("--p", 0); }); });
    }
    if (!reduce) {
      // gentle autonomous "press" wave so the floor is alive on touch devices too
      var auto = setInterval(function () {
        if (mx > -1 && fine) return;
        var r = floor.getBoundingClientRect(); if (r.bottom < 0) return;
        t0 += .5; paint(window.innerWidth * (.5 + .32 * Math.sin(t0 * .6)), r.top + 120 + 60 * Math.sin(t0));
      }, 500);
    }
  }

  /* ---------- quiz ---------- */
  var quiz = $("#quiz");
  if (quiz) {
    var qs = $$(".q", quiz), ans = [], step = 0, back = $("#quizBack"), fs = $$(".fsteps span");
    function go(n) {
      var a = qs[step], b = qs[n]; step = n; back.hidden = n === 0 || n === 3;
      fs.forEach(function (s, k) { s.classList.toggle("is-on", k <= n); });
      if (G && !reduce) gsap.to(a, { opacity: 0, x: -24, duration: .22, ease: "power2.in", onComplete: function () { a.classList.remove("is-on"); b.classList.add("is-on"); gsap.fromTo(b, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: .6, ease: "expo.out" }); gsap.fromTo($$("button, .res__img, .res__txt > *", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6, stagger: .05, ease: "expo.out" }); } });
      else { a.classList.remove("is-on"); b.classList.add("is-on"); }
    }
    function result() {
      var pos = ans[0], need = ans[1], sh = ans[2], id, why;
      if (need === "travel") { id = "travel"; why = "it gives you cooling neck support on the move and doubles as lumbar support."; }
      else if (need === "lux") { id = "vive"; why = "it has our thickest layer of Technogel® and a soft cooling cover."; }
      else if (pos === "back") { id = "anatomic"; why = "its wave contour and molded neck zone are built for back sleepers" + (need === "hot" ? ", and the gel pulls heat away all night." : ", relieving neck tension."); }
      else if (pos === "side" && sh === "broad") { id = "side"; why = "the shoulder cut-out lets broad shoulders sink in while your neck stays aligned."; }
      else if (pos === "side") { id = "contour"; why = "its ergonomic neck and shoulder contour is made for side sleepers" + (need === "hot" ? ", and the gel keeps you cool." : "."); }
      else { id = "deluxe"; why = "its universal shape and air channels adapt instantly whenever you change position."; }
      var p = byId[id], img = $("#rImg");
      img.src = IMG + p.img + ".webp"; img.alt = "Technogel " + p.name; img.className = p.mul ? "mul" : "";
      $("#rName").textContent = p.name;
      $("#rWhy").textContent = "Our pick for you, because " + why;
      $("#rFit").textContent = { narrow: "Fit tip: choose the lower height for narrow shoulders.", avg: "Fit tip: the standard height suits average shoulders.", broad: "Fit tip: choose the higher height for broad shoulders." }[sh];
      $("#rPrice").innerHTML = price(p);
      $("#rLink").href = SHOP + p.url;
    }
    quiz.addEventListener("click", function (e) {
      var b = e.target.closest(".q__opts button"); if (!b) return;
      $$("button", b.parentNode).forEach(function (x) { x.classList.remove("picked"); }); b.classList.add("picked");
      ans[step] = b.dataset.v;
      setTimeout(function () { if (step === 2) { result(); go(3); } else go(step + 1); }, 240);
    });
    back.addEventListener("click", function () { if (step > 0) go(step - 1); });
    $("#quizRestart").addEventListener("click", function () { ans = []; $$(".picked", quiz).forEach(function (x) { x.classList.remove("picked"); }); go(0); });
  }

  /* ---------- collections tabs ---------- */
  $$(".ctabs button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".ctabs button").forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
      $$(".cpane").forEach(function (p) { p.classList.toggle("is-on", p.dataset.t === b.dataset.t); });
      var on = $('.cpane[data-t="' + b.dataset.t + '"]');
      if (G && !reduce) gsap.fromTo(on.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, stagger: .08, ease: "expo.out" });
    });
  });

  /* ---------- industries pre-fill form ---------- */
  $$(".indc").forEach(function (a) { a.addEventListener("click", function () { var s = $("#b2bForm select"); if (s) s.value = a.dataset.ind; }); });

  /* ---------- inside layers ---------- */
  var layers = $$(".layer"), hots = $$(".hot"), chip = $("#insideChip"), ibar = $("#insideBar"), iImg = $("#insideImg");
  var names = ["Cooling cover", "Technogel® towers", "Ventilation channels", "Memory-foam core"];
  var curL = -1;
  function setLayer(i) {
    if (i === curL) return; curL = i;
    layers.forEach(function (l, k) { l.classList.toggle("is-on", k === i); });
    hots.forEach(function (h, k) { h.classList.toggle("is-on", k === i); });
    chip.textContent = names[i]; ibar.style.width = ((i + 1) * 25) + "%";
    if (iImg) iImg.style.transform = "rotate(" + (-3 + i * 2) + "deg) scale(" + (1 + i * .02) + ")";
  }
  layers.forEach(function (l, k) { l.addEventListener("click", function () { setLayer(k); }); });
  setLayer(0);

  /* ---------- modals ---------- */
  var fm = $("#filmModal"), fv = $("#filmVideo"), offer = $("#offer");
  function closeAll() { if (!fm.hidden) { fm.hidden = true; fv.pause(); } offer.hidden = true; if (lenis) lenis.start(); }
  $("#film").addEventListener("click", function () { fm.hidden = false; if (lenis) lenis.stop(); fv.play().catch(function () {}); });
  fm.addEventListener("click", function (e) { if (e.target === fm || e.target.closest(".modal__x")) closeAll(); });
  offer.addEventListener("click", function (e) { if (e.target === offer || e.target.closest(".modal__x") || e.target.closest(".offer__no")) closeAll(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeAll(); setSheet(false); } });
  (function () {
    var seen = false; try { seen = sessionStorage.getItem("tg_offer_b") === "1"; } catch (e) { /* ignore */ }
    if (seen) return; var armed = false; setTimeout(function () { armed = true; }, 12000);
    document.addEventListener("mouseout", function (e) {
      if (!armed || e.relatedTarget || e.clientY > 0 || window.innerWidth < 900 || !fm.hidden) return;
      armed = false; try { sessionStorage.setItem("tg_offer_b", "1"); } catch (er) { /* ignore */ }
      offer.hidden = false; if (lenis) lenis.stop();
      if (G && !reduce) gsap.fromTo(".offer", { y: 30, opacity: 0, scale: .95 }, { y: 0, opacity: 1, scale: 1, duration: .7, ease: "expo.out" });
    });
  })();

  /* ---------- forms ---------- */
  var okEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };
  var bf = $("#b2bForm");
  bf.addEventListener("submit", function (e) {
    e.preventDefault(); var ok = true;
    $$("[required]", bf).forEach(function (f) { var bad = !f.value.trim() || (f.type === "email" && !okEmail(f.value)); f.classList.toggle("invalid", bad); if (bad) ok = false; });
    if (!ok) return; $(".ok", bf).hidden = false; bf.reset();
  });
  var mail = $("#mail");
  mail.addEventListener("submit", function (e) {
    e.preventDefault(); var i = $("input", mail);
    if (!okEmail(i.value)) { mail.classList.add("invalid"); i.focus(); return; }
    mail.hidden = true; mail.nextElementSibling.hidden = false;
  });

  /* ---------- cursor + pill shine ---------- */
  var cur = $(".cursor");
  if (fine && !reduce) {
    var x = -50, y = -50, tx = -50, ty = -50, lab = $("span", cur);
    window.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; cur.style.opacity = 1; });
    (function loop() { x += (tx - x) * .22; y += (ty - y) * .22; cur.style.transform = "translate3d(" + x + "px," + y + "px,0)"; requestAnimationFrame(loop); })();
    document.addEventListener("mouseover", function (e) {
      var big = e.target.closest("[data-cursor]"), link = e.target.closest("a, button, summary, input, select, textarea");
      cur.classList.toggle("big", !!big); cur.classList.toggle("link", !big && !!link);
      if (big) lab.textContent = big.dataset.cursor;
    });
    document.addEventListener("mouseleave", function () { cur.style.opacity = 0; });
    $$(".pill").forEach(function (p) { p.addEventListener("pointermove", function (e) { var r = p.getBoundingClientRect(); p.style.setProperty("--mx", (e.clientX - r.left) + "px"); p.style.setProperty("--my", (e.clientY - r.top) + "px"); }); });
  }

  /* ---------- motion ---------- */
  if (!G || reduce) {
    $$("[data-count]").forEach(function (el) { el.textContent = el.dataset.count; });
    var ts = $(".tile--sleep"); if (ts) ts.classList.add("in");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // hero intro
  var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.from(".tagline", { y: 20, opacity: 0, duration: 1 })
    .from(".hero__h .line > span", { yPercent: 110, duration: 1.3, stagger: .1 }, .05)
    .from(".hero__sub, .hero__ctas > *", { y: 24, opacity: 0, duration: 1, stagger: .07 }, .4)
    .from(".pillow img", { y: 120, opacity: 0, scale: .9, duration: 1.8 }, .3)
    .from(".callout", { opacity: 0, x: function (i) { return i % 2 ? 30 : -30; }, duration: 1, stagger: .1 }, 1)
    .from(".buy, .hero__trust li", { y: 20, opacity: 0, duration: .9, stagger: .06 }, 1.1)
    .from(".hero__floor", { opacity: 0, duration: 2 }, .2);
  gsap.to(".pillow", { yPercent: -10, scale: .94, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  if (fine) {
    var pil = $("#heroPillow");
    $(".hero").addEventListener("pointermove", function (e) {
      var px = e.clientX / window.innerWidth - .5, py = e.clientY / window.innerHeight - .5;
      gsap.to(pil, { rotateY: px * 10, rotateX: -py * 8, x: px * 20, transformPerspective: 1200, duration: 1.2, ease: "power3.out" });
    });
  }

  // split titles into lines (word wrap) for reveal
  $$("[data-split]").forEach(function (el) {
    gsap.from(el, { y: 50, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });
  $$(".label").forEach(function (el) { gsap.from(el, { opacity: 0, x: -12, duration: .8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%" } }); });

  // bento
  gsap.from(".tile", { y: 60, opacity: 0, duration: 1.2, stagger: .07, ease: "expo.out", scrollTrigger: { trigger: ".bento", start: "top 85%" } });
  ScrollTrigger.create({ trigger: ".tile--sleep", start: "top 85%", once: true, onEnter: function () { $(".tile--sleep").classList.add("in"); } });
  $$("[data-count]").forEach(function (el) { var o = { v: 0 }; ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: function () { gsap.to(o, { v: +el.dataset.count, duration: 1.8, ease: "power3.out", onUpdate: function () { el.textContent = Math.round(o.v); } }); } }); });

  // products
  gsap.from(".card", { y: 70, opacity: 0, duration: 1.2, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: "#grid", start: "top 85%" } });
  gsap.from(".deal", { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".deal", start: "top 90%" } });

  // inside: pin + scrub layers (desktop)
  ScrollTrigger.matchMedia({
    "(min-width: 901px)": function () {
      ScrollTrigger.create({ trigger: ".inside__pin", start: "top top", end: "+=220%", pin: true, scrub: true, anticipatePin: 1,
        onUpdate: function (s) { setLayer(Math.min(3, Math.floor(s.progress * 4))); } });
    },
    "(max-width: 900px)": function () {
      layers.forEach(function (l, k) { ScrollTrigger.create({ trigger: l, start: "top 70%", end: "bottom 40%", onToggle: function (s) { if (s.isActive) setLayer(k); } }); });
    }
  });

  // compare rows
  gsap.from(".crow", { y: 20, opacity: 0, duration: .8, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: ".ctable", start: "top 80%" } });
  gsap.from(".fbox", { y: 80, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: ".fbox", start: "top 88%" } });
  gsap.from(".quote, .film, .mini-reviews figure, .assure li", { y: 50, opacity: 0, duration: 1.1, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: ".proof", start: "top 80%" } });
  gsap.from(".cpanes", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".cpanes", start: "top 88%" } });
  gsap.from(".indc", { opacity: 0, duration: .9, stagger: { each: .06, grid: [3, 3], from: "start" }, ease: "power2.out", scrollTrigger: { trigger: ".ind-grid", start: "top 82%" } });
  gsap.from(".biz__stats div, .bform", { y: 50, opacity: 0, duration: 1.1, stagger: .07, ease: "expo.out", scrollTrigger: { trigger: ".biz__bottom", start: "top 85%" } });
  gsap.from(".yr", { y: 50, opacity: 0, duration: 1, stagger: .07, ease: "expo.out", scrollTrigger: { trigger: ".years", start: "top 88%" } });
  gsap.from(".locs article", { y: 40, opacity: 0, duration: 1, stagger: .07, ease: "expo.out", scrollTrigger: { trigger: ".locs", start: "top 90%" } });
  gsap.from(".nrow", { y: 30, opacity: 0, duration: .9, stagger: .07, ease: "expo.out", scrollTrigger: { trigger: ".news__list", start: "top 85%" } });
  gsap.from(".acc details", { y: 30, opacity: 0, duration: .9, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: ".acc", start: "top 85%" } });
  gsap.from(".end__card", { y: 80, opacity: 0, scale: .97, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: ".end__card", start: "top 88%" } });
  gsap.fromTo(".end__art img", { y: 80, rotate: -16 }, { y: -20, rotate: -6, ease: "none", scrollTrigger: { trigger: ".end__card", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".foot__mark", { yPercent: 50, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".foot__mark", start: "top 98%" } });

  if (fine) $$(".magnet").forEach(function (b) {
    b.addEventListener("mousemove", function (e) { var r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .5, ease: "power3.out" }); });
    b.addEventListener("mouseleave", function () { gsap.to(b, { x: 0, y: 0, duration: .9, ease: "elastic.out(1,.4)" }); });
  });
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
