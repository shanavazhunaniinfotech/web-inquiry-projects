/* =========================================================
   CARTER ANDRUES — homepage interactions
   GSAP 3 + ScrollTrigger + Lenis. Everything degrades gracefully.
   ========================================================= */
(function () {
  "use strict";

  var hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var IMG = function (id, w) { return "https://images.unsplash.com/photo-" + id + "?w=" + (w || 900) + "&q=75&auto=format&fit=crop"; };

  /* ---------------- product data (placeholders) ---------------- */
  var FLATS = {
    polo: '<path d="M70 30 L55 36 L25 60 L38 84 L55 74 L55 175 L145 175 L145 74 L162 84 L175 60 L145 36 L130 30"/><path d="M70 30 L82 52 L100 44 L118 52 L130 30"/><path d="M70 30 Q100 42 130 30"/><path d="M94 44 L94 80 L106 80 L106 44"/><path d="M30 69 L43 79 M170 69 L157 79"/><path d="M55 165 L145 165" stroke-dasharray="3 3"/><path d="M55 165 L61 175 M145 165 L139 175"/><circle cx="100" cy="54" r="1.6"/><circle cx="100" cy="66" r="1.6"/><text x="122" y="76" font-size="7" font-family="serif" fill="currentColor" stroke="none">CA</text>',
    knit: '<path d="M65 30 L35 45 L18 140 L36 145 L55 82 L55 178 L145 178 L145 82 L164 145 L182 140 L165 45 L135 30"/><path d="M65 30 L100 72 L135 30"/><path d="M72 30 L100 64 L128 30" stroke="#b65a35"/><path d="M84 88 q6 6 0 12 q-6 6 0 12 q6 6 0 12 q-6 6 0 12 q6 6 0 12"/><path d="M100 82 q6 6 0 12 q-6 6 0 12 q6 6 0 12 q-6 6 0 12 q6 6 0 12 q-6 6 0 12"/><path d="M116 88 q6 6 0 12 q-6 6 0 12 q6 6 0 12 q-6 6 0 12 q6 6 0 12"/><path d="M55 166 L145 166 M20 130 L38 135 M180 130 L162 135"/>',
    skirt: '<path d="M62 36 L138 36 L138 50 L62 50 Z"/><path d="M62 50 L38 172 L162 172 L138 50"/><path d="M71 50 L52 172 M80 50 L66 172 M89 50 L80 172 M100 50 L94 172 M100 50 L108 172 M111 50 L122 172 M120 50 L136 172 M129 50 L150 172"/><path d="M38 164 L162 164" stroke="#b65a35"/><circle cx="130" cy="43" r="1.8"/>',
    trouser: '<path d="M62 28 L138 28 L140 42 L152 178 L110 178 L100 72 L90 178 L48 178 L60 42 Z"/><path d="M60 42 L140 42"/><path d="M80 48 L72 178 M120 48 L128 178" stroke-dasharray="3 3"/><path d="M100 42 L100 72"/><path d="M64 48 Q76 58 70 72 M136 48 Q124 58 130 72"/><path d="M74 28 L74 42 M126 28 L126 42 M100 28 L100 42"/>',
    cardigan: '<path d="M65 30 L35 45 L18 140 L36 145 L55 82 L55 178 L145 178 L145 82 L164 145 L182 140 L165 45 L135 30"/><path d="M65 30 L97 86 L97 178 M135 30 L103 86 L103 178"/><path d="M58 166 L142 166" stroke="#b65a35"/><circle cx="106" cy="100" r="2"/><circle cx="106" cy="120" r="2"/><circle cx="106" cy="140" r="2"/><circle cx="106" cy="160" r="2"/><path d="M66 128 L88 128 L88 150 L66 150 Z M112 128 L134 128 L134 150 L112 150 Z"/><path d="M20 130 L38 135 M180 130 L162 135"/>',
    cap: '<path d="M44 122 Q42 56 100 50 Q158 56 156 122 Z"/><path d="M44 122 Q24 132 22 150 Q70 158 118 128"/><path d="M100 50 L100 122 M100 50 Q74 70 70 122 M100 50 Q126 70 130 122"/><circle cx="100" cy="49" r="3"/><circle cx="82" cy="70" r="1.4"/><circle cx="118" cy="70" r="1.4"/><text x="100" y="100" text-anchor="middle" font-size="12" font-family="serif" fill="currentColor" stroke="none">CA</text>'
  };

  var PRODUCTS = [
    { id: "polo", name: "Centre Court <em>Polo</em>", plain: "Centre Court Polo", price: 185, desc: "Supima piqué · knitted tipped collar", img: "1586790170083-2f9ceadc732d", spec: "CA-001 · 220 gsm", colors: ["#f2ece0", "#1d2e4a", "#16352a"] },
    { id: "knit", name: "Baseline <em>Cable Knit</em>", plain: "Baseline Cable Knit", price: 345, desc: "Merino-cashmere · V-neck with clay tipping", img: "1500648767791-00dcc994a43e", spec: "CA-002 · 7 gauge", colors: ["#efe7d6", "#9a9387"] },
    { id: "skirt", name: "Clay <em>Pleated Skirt</em>", plain: "Clay Pleated Skirt", price: 220, desc: "Knife pleats · stretch cotton twill", img: "1595435934249-5df7ed86e1c0", spec: "CA-003 · 16 pleats", colors: ["#f2ece0", "#b65a35"] },
    { id: "trouser", name: "Grass Court <em>Trouser</em>", plain: "Grass Court Trouser", price: 260, desc: "Pressed crease · cotton drill · side adjusters", img: "1552374196-1ab2a1c593e8", spec: "CA-004 · 280 gsm", colors: ["#ece3cf", "#1d2e4a"] },
    { id: "cardigan", name: "Match Point <em>Cardigan</em>", plain: "Match Point Cardigan", price: 395, desc: "Cashmere blend · mother-of-pearl buttons", img: "1611042553484-d61f84d22784", spec: "CA-005 · 12 gauge", colors: ["#efe7d6", "#16352a", "#b4924f"] },
    { id: "cap", name: "The Club <em>Cap</em>", plain: "The Club Cap", price: 85, desc: "Six-panel cotton · embroidered crest", img: "1588850561407-ed78c282e89b", spec: "CA-006 · one size", colors: ["#f8f4eb", "#16352a", "#1d2e4a"] }
  ];

  /* ---------------- render collection ---------------- */
  var track = $("#productTrack");
  if (track) {
    var html = PRODUCTS.map(function (p, i) {
      var sizes = p.id === "cap" ? ["OS"] : ["S", "M", "L"];
      return '<article class="product" data-id="' + p.id + '">' +
        '<div class="product__media">' +
          '<span class="product__no">' + String(i + 1).padStart(2, "0") + '</span>' +
          '<span class="product__badge">Tech pack ready</span>' +
          '<img src="' + IMG(p.img, 800) + '" alt="' + p.plain + ' (placeholder image)" loading="lazy">' +
          '<div class="product__flat" aria-hidden="true"><span class="product__flat-label">Technical flat · front</span>' +
            '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">' + FLATS[p.id] + '</svg>' +
            '<span class="product__flat-spec">' + p.spec + '</span></div>' +
          '<div class="product__quick"><span>Quick add</span>' + sizes.map(function (s) { return '<button type="button" data-add="' + p.id + '" data-size="' + s + '" aria-label="Add ' + p.plain + ' size ' + s + ' to bag">' + s + '</button>'; }).join("") + '</div>' +
        '</div>' +
        '<div class="product__info"><h3 class="product__name">' + p.name + '</h3><span class="product__price">$' + p.price + '</span></div>' +
        '<p class="product__desc">' + p.desc + '</p>' +
        '<div class="product__swatches">' + p.colors.map(function (c) { return '<i style="--c:' + c + '"></i>'; }).join("") + '</div>' +
      '</article>';
    }).join("");
    html += '<div class="collection__end"><p>Rendered, specified &amp; <em>ready to serve.</em></p><a href="#techpack" class="btn btn--light"><span>See a tech pack</span></a></div>';
    track.innerHTML = html;
  }

  /* ---------------- cart ---------------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem("ca_cart") || "[]") || []; } catch (e) { cart = []; }
  var drawerItems = $(".drawer__items");
  var toastEl = $(".toast");
  var toastTimer;

  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-show"); }, 2600);
  }
  function saveCart() { try { localStorage.setItem("ca_cart", JSON.stringify(cart)); } catch (e) {} }
  function renderCart() {
    var count = cart.reduce(function (n, it) { return n + it.qty; }, 0);
    var total = cart.reduce(function (n, it) { return n + it.qty * it.price; }, 0);
    $$(".bag-count").forEach(function (el) { el.textContent = count; });
    var tEl = $("#cartTotal"); if (tEl) tEl.textContent = "$" + total.toLocaleString();
    var bar = $(".drawer__ship em"); if (bar) bar.style.transform = "scaleX(" + Math.min(total / 300, 1) + ")";
    var shipTxt = $(".drawer__ship span");
    if (shipTxt) shipTxt.textContent = total >= 300 ? "You've unlocked complimentary shipping" : "$" + (300 - total) + " away from complimentary shipping";
    if (!drawerItems) return;
    if (!cart.length) { drawerItems.innerHTML = '<li class="drawer__empty">Your bag is waiting for its first serve.</li>'; return; }
    drawerItems.innerHTML = cart.map(function (it, i) {
      return '<li><img src="' + IMG(it.img, 200) + '" alt=""><div><b>' + it.name + '</b><small>' + it.variant + ' · Qty ' + it.qty + '</small><br><button type="button" class="rm" data-rm="' + i + '">Remove</button></div><span>$' + (it.price * it.qty) + '</span></li>';
    }).join("");
  }
  function addToCart(item) {
    var key = item.name + "|" + item.variant;
    var found = cart.filter(function (c) { return c.name + "|" + c.variant === key; })[0];
    if (found) found.qty += 1; else { item.qty = 1; cart.push(item); }
    saveCart(); renderCart();
    $$(".bag-count").forEach(function (el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
    toast(item.name + " added to your bag");
  }
  function openCart() { document.body.classList.add("cart-open"); $(".drawer").setAttribute("aria-hidden", "false"); if (window.__lenis) window.__lenis.stop(); }
  function closeCart() { document.body.classList.remove("cart-open"); $(".drawer").setAttribute("aria-hidden", "true"); if (window.__lenis) window.__lenis.start(); }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-add]");
    if (t) {
      var p = PRODUCTS.filter(function (x) { return x.id === t.getAttribute("data-add"); })[0];
      addToCart({ name: p.plain, price: p.price, img: p.img, variant: "Size " + t.getAttribute("data-size") });
      return;
    }
    var rm = e.target.closest("[data-rm]");
    if (rm) { cart.splice(+rm.getAttribute("data-rm"), 1); saveCart(); renderCart(); return; }
    if (e.target.closest("[data-open-cart]")) { openCart(); return; }
    if (e.target.closest("[data-close-cart]")) { closeCart(); return; }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeCart(); toggleMenu(false); } });
  renderCart();

  /* ---------------- mobile menu ---------------- */
  var burger = $(".nav__burger"), mMenu = $(".mobile-menu");
  function toggleMenu(force) {
    if (!burger) return;
    var open = typeof force === "boolean" ? force : burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", String(open));
    mMenu.classList.toggle("is-open", open);
    mMenu.setAttribute("aria-hidden", String(!open));
    if (window.__lenis) { open ? window.__lenis.stop() : window.__lenis.start(); }
  }
  if (burger) burger.addEventListener("click", function () { toggleMenu(); });
  $$(".mobile-menu a").forEach(function (a) { a.addEventListener("click", function () { toggleMenu(false); }); });

  /* ---------------- tech pack: hotspots, tabs, sizes ---------------- */
  var SPECS = [
    { t: "Knitted collar", d: "Flat-knit collar with a 3 mm clay tipping stripe. Holds its roll through every wash.", a: ["Spec", "7.5 cm point"], b: ["Tolerance", "± 0.3 cm"] },
    { t: "Three-button placket", d: "Clean-finish placket with three mother-of-pearl buttons, hand-sewn with a shank.", a: ["Placket", "13 × 2.4 cm"], b: ["Buttons", "14L MOP"] },
    { t: "Embroidered crest", d: "The CA crest in satin stitch, 11,000 stitches, placed 18 cm from the high point shoulder.", a: ["Size", "3.2 cm"], b: ["Thread", "Court Green"] },
    { t: "Ribbed sleeve", d: "Set-in sleeve finished with a 2 cm rib cuff, cut slightly longer for the serve.", a: ["Cuff", "2 cm 1×1 rib"], b: ["Opening", "17 cm"] },
    { t: "Tennis tail & vents", d: "Drop-back hem keeps the polo tucked through every overhead. 4 cm side vents.", a: ["Drop", "+3 cm back"], b: ["Vents", "4 cm"] }
  ];
  var card = $(".spec-card");
  function setSpec(i) {
    var s = SPECS[i]; if (!s || !card) return;
    $$(".hotspot").forEach(function (h) { h.classList.toggle("is-active", +h.getAttribute("data-spec") === i); });
    showTab("details");
    var fill = function () {
      $(".spec-card__no", card).textContent = String(i + 1).padStart(2, "0");
      $(".spec-card__title", card).textContent = s.t;
      $(".spec-card__text", card).textContent = s.d;
      var dts = $$("dt", card), dds = $$("dd", card);
      dts[0].textContent = s.a[0]; dds[0].textContent = s.a[1];
      dts[1].textContent = s.b[0]; dds[1].textContent = s.b[1];
    };
    if (hasGSAP && !reduce) {
      gsap.to(card, { autoAlpha: 0, y: 10, duration: .2, onComplete: function () { fill(); gsap.to(card, { autoAlpha: 1, y: 0, duration: .45, ease: "power3.out" }); } });
    } else fill();
  }
  $$(".hotspot").forEach(function (h) { h.addEventListener("click", function () { setSpec(+h.getAttribute("data-spec")); }); });
  $$(".hotspot")[0] && $$(".hotspot")[0].classList.add("is-active");

  function showTab(name) {
    $$(".tab").forEach(function (t) { var on = t.getAttribute("data-tab") === name; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", String(on)); });
    $$(".tabpanel").forEach(function (p) { p.classList.toggle("is-active", p.getAttribute("data-panel") === name); });
  }
  $$(".tab").forEach(function (t) { t.addEventListener("click", function () { showTab(t.getAttribute("data-tab")); }); });

  var GRADE = { chest: [50, 52, 54, 56.5, 59], length: [70, 72, 74, 76, 78], sleeve: [20.5, 21, 22, 22.5, 23], collar: [7, 7.25, 7.5, 7.75, 8] };
  $$(".size").forEach(function (b) {
    b.addEventListener("click", function () {
      var i = +b.getAttribute("data-size");
      $$(".size").forEach(function (x) { x.classList.toggle("is-active", x === b); });
      Object.keys(GRADE).forEach(function (k) {
        var cell = $('[data-m="' + k + '"]'); if (cell) cell.textContent = GRADE[k][i];
      });
      var c = $(".m-chest"), l = $(".m-length");
      if (c) c.textContent = GRADE.chest[i];
      if (l) l.textContent = GRADE.length[i];
    });
  });

  /* ---------------- surfaces ---------------- */
  var surfaces = $$(".surface");
  function openSurface(s) { surfaces.forEach(function (x) { x.classList.toggle("is-open", x === s); }); }
  surfaces.forEach(function (s) {
    s.addEventListener("click", function () { openSurface(s); });
    s.addEventListener("focus", function () { openSurface(s); });
    s.addEventListener("mouseenter", function () { if (window.matchMedia("(hover: hover) and (min-width: 901px)").matches) openSurface(s); });
  });

  /* ---------------- atelier monogram ---------------- */
  var monoInput = $("#monoInput"), monoText = $("#monoText"), monoSub = $("#monoSub");
  var mono = { font: "classic", color: "#16352a", name: "Court Green" };
  function updateMono() {
    var v = (monoInput.value || "").replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3);
    if (monoInput.value !== v) monoInput.value = v;
    var shown = v || "CA";
    if (mono.font === "script") shown = shown.charAt(0) + shown.slice(1).toLowerCase();
    monoText.textContent = shown;
    monoText.setAttribute("class", "mono mono--" + mono.font);
    monoText.setAttribute("fill", mono.color);
    monoSub.setAttribute("fill", mono.color);
  }
  if (monoInput) {
    monoInput.addEventListener("input", updateMono);
    $$(".chip").forEach(function (c) { c.addEventListener("click", function () { $$(".chip").forEach(function (x) { x.classList.toggle("is-active", x === c); }); mono.font = c.getAttribute("data-font"); updateMono(); }); });
    $$(".thread").forEach(function (t) {
      t.addEventListener("click", function () {
        $$(".thread").forEach(function (x) { x.classList.toggle("is-active", x === t); });
        mono.color = t.getAttribute("data-color"); mono.name = t.getAttribute("data-name");
        $("#threadName").textContent = mono.name; updateMono();
      });
    });
    $("#addMono").addEventListener("click", function () {
      var initials = monoInput.value || "CA";
      addToCart({ name: "Centre Court Polo", price: 185, img: PRODUCTS[0].img, variant: "Monogram " + initials + " · " + mono.name });
    });
    updateMono();
  }

  /* ---------------- clubhouse card + form ---------------- */
  var cardName = $("#cardName"), joinName = $("#joinName"), cardNo = $("#cardNo");
  if (cardNo) cardNo.textContent = String(Math.floor(Math.random() * 240) + 10).padStart(4, "0");
  if (joinName) joinName.addEventListener("input", function () { cardName.textContent = joinName.value.trim() || "Your Name"; });
  var joinForm = $("#joinForm");
  if (joinForm) joinForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var em = $("#joinEmail"), msg = $(".join__msg");
    var okName = joinName.value.trim().length > 1, okMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim());
    joinName.classList.toggle("is-error", !okName); em.classList.toggle("is-error", !okMail);
    if (!okName || !okMail) { msg.textContent = !okName ? "Please add your name for the card." : "Please enter a valid email address."; return; }
    msg.textContent = "Thank you, " + joinName.value.trim().split(" ")[0] + ". Your invitation request is in the post.";
    joinForm.reset();
  });
  var card3d = $("#card3d");
  if (card3d && window.matchMedia("(hover: hover)").matches && !reduce) {
    var inner = $(".card3d__inner", card3d);
    var rx = hasGSAP ? gsap.quickTo(inner, "rotationY", { duration: .6, ease: "power3" }) : null;
    var ry = hasGSAP ? gsap.quickTo(inner, "rotationX", { duration: .6, ease: "power3" }) : null;
    card3d.addEventListener("pointermove", function (e) {
      var r = card3d.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      inner.style.setProperty("--mx", px * 100 + "%"); inner.style.setProperty("--my", py * 100 + "%");
      if (rx) { rx((px - .5) * 22); ry((.5 - py) * 16); }
    });
    card3d.addEventListener("pointerleave", function () { if (rx) { rx(0); ry(0); } });
  }

  /* ---------------- scoreboard reels (built always) ---------------- */
  $$(".flips").forEach(function (f) {
    var v = f.getAttribute("data-value");
    f.setAttribute("aria-label", v);
    f.innerHTML = v.split("").map(function (d) {
      var digits = ""; for (var k = 0; k <= 9; k++) digits += "<span>" + k + "</span>";
      return '<span class="flip" aria-hidden="true"><span class="flip__reel" data-d="' + d + '">' + digits + digits + "</span></span>";
    }).join("");
  });

  /* ---------------- nav state (works without GSAP) ---------------- */
  var nav = $("#nav"), lastY = 0;
  function onScrollNav(y) {
    nav.classList.toggle("is-scrolled", y > 40);
    nav.classList.toggle("is-hidden", y > 600 && y > lastY && !document.body.classList.contains("cart-open"));
    lastY = y;
  }

  /* =========================================================
     NO GSAP → show everything, stop here
     ========================================================= */
  function fallback() {
    var l = $(".loader"); if (l) l.remove();
    document.body.classList.remove("is-loading");
    $$(".flip__reel").forEach(function (r) { r.style.transform = "translateY(-" + (10 + +r.getAttribute("data-d")) * 5 + "%)"; });
    window.addEventListener("scroll", function () { onScrollNav(window.scrollY); }, { passive: true });
  }
  if (!hasGSAP) { fallback(); return; }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- smooth scroll ---------------- */
  var lenis = null;
  if (typeof window.Lenis !== "undefined" && !reduce) {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", function (e) { ScrollTrigger.update(); onScrollNav(e.scroll); });
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var target = id === "#top" ? 0 : $(id);
        if (target === null) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 1.6 });
      });
    });
  } else {
    window.addEventListener("scroll", function () { onScrollNav(window.scrollY); }, { passive: true });
  }

  /* ---------------- split helpers ---------------- */
  $$(".split").forEach(function (el) {
    var txt = el.textContent; el.textContent = "";
    txt.split("").forEach(function (ch) { var s = document.createElement("span"); s.className = "ch"; s.textContent = ch; el.appendChild(s); });
  });

  /* ---------------- initial states (set by JS so no-JS users still see content) ---------------- */
  var courtPaths = $$(".hero__court .draw");
  courtPaths.forEach(function (p) { var L = p.getTotalLength(); p.style.strokeDasharray = p.getAttribute("stroke-dasharray") ? "" : L; if (!p.getAttribute("stroke-dasharray")) p.style.strokeDashoffset = L; });
  gsap.set(".hero__line .ch", { yPercent: 110 });
  gsap.set(".hero__arch-img", { clipPath: "inset(100% 0% 0% 0% round 999px 999px 4px 4px)" });
  gsap.set([".hero__meta", ".hero__scroll", ".hero__arch figcaption"], { autoAlpha: 0, y: 24 });
  gsap.set(".nav", { autoAlpha: 0, y: -20 });

  /* ---------------- loader → hero intro ---------------- */
  var intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
  intro
    .to(".hero__arch-img", { clipPath: "inset(0% 0% 0% 0% round 999px 999px 4px 4px)", duration: 1.6, ease: "expo.inOut" }, 0)
    .to(".hero__arch-img img", { scale: 1, duration: 2.2 }, 0.2)
    .to(".hero__line--1 .ch", { yPercent: 0, duration: 1.4, stagger: .05 }, 0.5)
    .to(".hero__line--2 .ch", { yPercent: 0, duration: 1.4, stagger: .05 }, 0.65)
    .to(courtPaths.filter(function (p) { return !p.getAttribute("stroke-dasharray"); }), { strokeDashoffset: 0, duration: 2.2, stagger: .12, ease: "power2.inOut" }, 0.3)
    .to(".nav", { autoAlpha: 1, y: 0, duration: 1 }, 1)
    .to([".hero__meta", ".hero__arch figcaption", ".hero__scroll"], { autoAlpha: 1, y: 0, duration: 1.1, stagger: .1 }, 1.2)
    .add(ballServe, 1.1);

  function ballServe() {
    var path = $("#ballArc"), ball = $(".ball"), hero = $(".hero");
    if (!path || !ball || reduce) return;
    var L = path.getTotalLength(), o = { p: 0 };
    gsap.set(ball, { autoAlpha: 1 });
    gsap.to(o, {
      p: 1, duration: 2.6, ease: "power1.inOut",
      onUpdate: function () {
        var pt = path.getPointAtLength(o.p * L), w = hero.offsetWidth, h = hero.offsetHeight;
        gsap.set(ball, { x: pt.x / 1440 * w - 13, y: pt.y / 900 * h - 13, rotation: o.p * 900, scale: 1 - Math.abs(o.p - .5) * .6 });
      },
      onComplete: function () { gsap.to(ball, { autoAlpha: 0, duration: .4 }); }
    });
  }

  var loader = $(".loader");
  var ltl = gsap.timeline({
    onComplete: function () {
      document.body.classList.remove("is-loading");
      if (loader) loader.remove();
      ScrollTrigger.refresh();
    }
  });
  if (reduce) {
    ltl.to(loader, { autoAlpha: 0, duration: .3 }).add(function () { intro.progress(1); });
  } else {
    ltl.to(".loader__bar i", { scaleX: 1, duration: 1.7, ease: "power2.inOut" }, 0)
      .to(".loader__track", { yPercent: -80, duration: 1.7, ease: "steps(4)" }, 0)
      .to(".loader", { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, 1.95)
      .add(function () { intro.play(); }, 2.15);
  }
  // safety net: never trap the visitor behind the loader
  setTimeout(function () { if (document.body.classList.contains("is-loading")) { ltl.progress(1); intro.progress(1); } }, 6000);

  /* =========================================================
     SCROLL ANIMATIONS
     ========================================================= */
  var mm = gsap.matchMedia();

  // hero parallax
  if (!reduce) {
    gsap.to(".hero__arch-img img", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__line--1", { xPercent: -10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__line--2", { xPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }

  // manifesto: words light up as you read
  var mText = $("[data-reveal-words]");
  if (mText) {
    Array.prototype.slice.call(mText.childNodes).forEach(function (node) {
      if (node.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
        var w = document.createElement("span"); w.className = "w"; w.textContent = part; frag.appendChild(w);
      });
      mText.replaceChild(frag, node);
    });
    gsap.to(mText.querySelectorAll(".w"), {
      opacity: 1, stagger: .08, ease: "none",
      scrollTrigger: { trigger: mText, start: "top 78%", end: "bottom 45%", scrub: reduce ? false : .6 }
    });
    gsap.from(".pill", { scale: 0, duration: 1, ease: "back.out(1.6)", stagger: .1, scrollTrigger: { trigger: mText, start: "top 70%" } });
    gsap.from(".manifesto__foot > *", { y: 30, autoAlpha: 0, duration: 1.1, stagger: .15, ease: "expo.out", scrollTrigger: { trigger: ".manifesto__foot", start: "top 90%" } });
  }

  // section headings rise
  $$(".display").forEach(function (d) {
    if (d.closest(".hero")) return;
    gsap.from(d, { y: 70, autoAlpha: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: d, start: "top 88%" } });
  });

  // collection: horizontal pin on desktop
  var countEl = $(".collection__count b"), barEl = $(".collection__progress em");
  function setCount(p) {
    var idx = Math.min(6, Math.max(1, Math.round(p * 5) + 1));
    if (countEl) countEl.textContent = "0" + idx;
    if (barEl) barEl.style.transform = "scaleX(" + Math.max(p, 1 / 6) + ")";
  }
  mm.add("(min-width: 901px)", function () {
    var head = $(".collection__head");
    var dist = function () { return track.scrollWidth - (window.innerWidth - head.offsetWidth); };
    var tw = gsap.to(track, {
      x: function () { return -dist(); }, ease: "none",
      scrollTrigger: {
        trigger: ".collection", start: "top top", end: function () { return "+=" + dist(); },
        pin: true, scrub: reduce ? true : .8, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (self) { setCount(self.progress); }
      }
    });
    gsap.from(".product", { y: 120, autoAlpha: 0, duration: 1.3, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".collection", start: "top 70%" } });
    return function () { tw.scrollTrigger && tw.scrollTrigger.kill(); gsap.set(track, { x: 0 }); };
  });
  mm.add("(max-width: 900px)", function () {
    var onS = function () { var max = track.scrollWidth - track.clientWidth; setCount(max > 0 ? track.scrollLeft / max : 0); };
    track.addEventListener("scroll", onS, { passive: true });
    return function () { track.removeEventListener("scroll", onS); };
  });

  // tech pack: draw the flat
  var flatPaths = $$(".flat-lines path, .measure path");
  flatPaths.forEach(function (p) {
    if (p.getAttribute("stroke-dasharray")) return;
    var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
  });
  gsap.timeline({ scrollTrigger: { trigger: ".techpack__sheet", start: "top 75%" } })
    .to(flatPaths.filter(function (p) { return !p.getAttribute("stroke-dasharray"); }), { strokeDashoffset: 0, duration: 2, stagger: .08, ease: "power2.inOut" })
    .from(".hotspot", { scale: 0, autoAlpha: 0, duration: .7, stagger: .1, ease: "back.out(2)" }, "-=1")
    .from(".techpack__panel", { x: 40, autoAlpha: 0, duration: 1.2, ease: "expo.out" }, 0.3);

  // surfaces: rise in
  gsap.from(".surface", { y: 80, autoAlpha: 0, duration: 1.3, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: ".surfaces__row", start: "top 85%" } });

  // lookbook parallax (desktop)
  mm.add("(min-width: 901px)", function () {
    if (reduce) return;
    $$(".plate").forEach(function (pl) {
      var sp = +pl.getAttribute("data-speed") || 0;
      gsap.fromTo(pl, { yPercent: -sp }, { yPercent: sp, ease: "none", scrollTrigger: { trigger: ".lookbook__stage", start: "top bottom", end: "bottom top", scrub: true } });
    });
    gsap.from(".lookbook__q-xl", { scale: .7, autoAlpha: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".lookbook__quote", start: "top 80%" } });
  });
  gsap.from(".plate img", { clipPath: "inset(100% 0 0 0)", duration: 1.6, stagger: .12, ease: "expo.inOut", scrollTrigger: { trigger: ".lookbook__stage", start: "top 75%" } });

  // scoreboard reels
  ScrollTrigger.create({
    trigger: ".board", start: "top 75%", once: true,
    onEnter: function () {
      $$(".flip__reel").forEach(function (r, i) {
        var d = +r.getAttribute("data-d");
        gsap.fromTo(r, { yPercent: 0 }, { yPercent: -(10 + d) * 5, duration: reduce ? 0 : 1.8 + (i % 3) * .25, ease: "power4.out", delay: i * .06 });
      });
      gsap.to(".board__srv", { keyframes: [{ scale: 1.6, duration: .2 }, { scale: 1, duration: .3 }], stagger: .15 });
    }
  });
  gsap.from(".board", { y: 80, rotationX: 18, autoAlpha: 0, transformPerspective: 1200, duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: ".scoreboard", start: "top 75%" } });

  // atelier
  gsap.from(".studio", { y: 80, autoAlpha: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".studio", start: "top 85%" } });
  var jp = $(".journey__path path");
  if (jp) {
    gsap.fromTo(".journey__path", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "none", scrollTrigger: { trigger: ".journey", start: "top 85%", end: "top 40%", scrub: true } });
  }
  gsap.from(".journey li", { y: 50, autoAlpha: 0, duration: 1.2, stagger: .15, ease: "expo.out", scrollTrigger: { trigger: ".journey", start: "top 80%" } });

  // letter collage
  gsap.set(".paper__sig", { clipPath: "inset(0 100% 0 0)" });
  gsap.timeline({ scrollTrigger: { trigger: ".letter__stage", start: "top 70%" } })
    .from(".paper", { y: 120, rotation: 4, autoAlpha: 0, duration: 1.4, ease: "expo.out" })
    .from(".polaroid", { x: -120, rotation: -24, autoAlpha: 0, duration: 1.4, ease: "expo.out" }, 0.15)
    .from(".ticket", { x: 120, rotation: 22, autoAlpha: 0, duration: 1.4, ease: "expo.out" }, 0.3)
    .to(".paper__sig", { clipPath: "inset(0 0% 0 0)", duration: 1.8, ease: "power2.inOut" }, 0.7)
    .from(".seal", { scale: 2.2, autoAlpha: 0, rotation: -40, duration: .9, ease: "back.out(1.8)" }, 1.6);

  // clubhouse card
  gsap.from(".card3d", { y: 100, rotationX: 40, autoAlpha: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".card3d", start: "top 88%" } });

  // footer wordmark
  gsap.from(".footer__word span", { yPercent: 100, autoAlpha: 0, duration: 1.4, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: ".footer__word", start: "top 95%" } });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
