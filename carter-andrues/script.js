/* =========================================================
   CARTER ANDRUES — homepage interactions (v2)
   GSAP 3 + ScrollTrigger + Lenis. Everything degrades gracefully.
   ========================================================= */
(function () {
  "use strict";

  var hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var IMG = function (id, w) { return "https://images.unsplash.com/photo-" + id + "?w=" + (w || 900) + "&q=78&auto=format&fit=crop"; };

  /* ---------------- product data (placeholders) ---------------- */
  var FLATS = {
    polo: '<path d="M70 30 L55 36 L25 60 L38 84 L55 74 L55 175 L145 175 L145 74 L162 84 L175 60 L145 36 L130 30"/><path d="M70 30 L82 52 L100 44 L118 52 L130 30"/><path d="M70 30 Q100 42 130 30"/><path d="M94 44 L94 80 L106 80 L106 44"/><path d="M30 69 L43 79 M170 69 L157 79"/><path d="M55 165 L145 165" stroke-dasharray="3 3"/><path d="M55 165 L61 175 M145 165 L139 175"/><circle cx="100" cy="54" r="1.6"/><circle cx="100" cy="66" r="1.6"/><text x="122" y="76" font-size="7" font-family="Cinzel, serif" fill="currentColor" stroke="none">CA</text>',
    knit: '<path d="M65 30 L35 45 L18 140 L36 145 L55 82 L55 178 L145 178 L145 82 L164 145 L182 140 L165 45 L135 30"/><path d="M65 30 L100 72 L135 30"/><path d="M72 30 L100 64 L128 30" stroke="#5a1824"/><path d="M84 88 q6 6 0 12 q-6 6 0 12 q6 6 0 12 q-6 6 0 12 q6 6 0 12"/><path d="M100 82 q6 6 0 12 q-6 6 0 12 q6 6 0 12 q-6 6 0 12 q6 6 0 12 q-6 6 0 12"/><path d="M116 88 q6 6 0 12 q-6 6 0 12 q6 6 0 12 q-6 6 0 12 q6 6 0 12"/><path d="M55 166 L145 166 M20 130 L38 135 M180 130 L162 135"/>',
    skirt: '<path d="M62 36 L138 36 L138 50 L62 50 Z"/><path d="M62 50 L38 172 L162 172 L138 50"/><path d="M71 50 L52 172 M80 50 L66 172 M89 50 L80 172 M100 50 L94 172 M100 50 L108 172 M111 50 L122 172 M120 50 L136 172 M129 50 L150 172"/><path d="M38 164 L162 164" stroke="#5a1824"/><circle cx="130" cy="43" r="1.8"/>',
    trouser: '<path d="M62 28 L138 28 L140 42 L152 178 L110 178 L100 72 L90 178 L48 178 L60 42 Z"/><path d="M60 42 L140 42"/><path d="M80 48 L72 178 M120 48 L128 178" stroke-dasharray="3 3"/><path d="M100 42 L100 72"/><path d="M64 48 Q76 58 70 72 M136 48 Q124 58 130 72"/><path d="M74 28 L74 42 M126 28 L126 42 M100 28 L100 42"/>',
    cardigan: '<path d="M65 30 L35 45 L18 140 L36 145 L55 82 L55 178 L145 178 L145 82 L164 145 L182 140 L165 45 L135 30"/><path d="M65 30 L97 86 L97 178 M135 30 L103 86 L103 178"/><path d="M58 166 L142 166" stroke="#5a1824"/><circle cx="106" cy="100" r="2"/><circle cx="106" cy="120" r="2"/><circle cx="106" cy="140" r="2"/><circle cx="106" cy="160" r="2"/><path d="M66 128 L88 128 L88 150 L66 150 Z M112 128 L134 128 L134 150 L112 150 Z"/><path d="M20 130 L38 135 M180 130 L162 135"/>',
    cap: '<path d="M44 122 Q42 56 100 50 Q158 56 156 122 Z"/><path d="M44 122 Q24 132 22 150 Q70 158 118 128"/><path d="M100 50 L100 122 M100 50 Q74 70 70 122 M100 50 Q126 70 130 122"/><circle cx="100" cy="49" r="3"/><circle cx="82" cy="70" r="1.4"/><circle cx="118" cy="70" r="1.4"/><text x="100" y="100" text-anchor="middle" font-size="12" font-family="Cinzel, serif" fill="currentColor" stroke="none">CA</text>'
  };

  var PRODUCTS = [
    { id: "polo", name: "Centre Court <em>Polo</em>", plain: "Centre Court Polo", price: 185, desc: "Supima piqué · knitted tipped collar", img: "1586363104862-3a5e2ab60d99", spec: "CA-001 · 220 gsm", colors: ["#f2ece0", "#1b2c45", "#0f2d25"] },
    { id: "knit", name: "Baseline <em>Cable Knit</em>", plain: "Baseline Cable Knit", price: 345, desc: "Merino-cashmere · V-neck with bordeaux tipping", img: "1509319117193-57bab727e09d", spec: "CA-002 · 7 gauge", colors: ["#efe7d6", "#9a9387"] },
    { id: "skirt", name: "Clay <em>Pleated Skirt</em>", plain: "Clay Pleated Skirt", price: 220, desc: "Knife pleats · stretch cotton twill", img: "1595435934249-5df7ed86e1c0", spec: "CA-003 · 16 pleats", colors: ["#f2ece0", "#5a1824"] },
    { id: "trouser", name: "Grass Court <em>Trouser</em>", plain: "Grass Court Trouser", price: 260, desc: "Pressed crease · cotton drill · side adjusters", img: "1552374196-1ab2a1c593e8", spec: "CA-004 · 280 gsm", colors: ["#ece3cf", "#1b2c45"] },
    { id: "cardigan", name: "Match Point <em>Cardigan</em>", plain: "Match Point Cardigan", price: 395, desc: "Cashmere blend · mother-of-pearl buttons", img: "1611042553484-d61f84d22784", spec: "CA-005 · 12 gauge", colors: ["#efe7d6", "#0f2d25", "#b8955a"] },
    { id: "cap", name: "The Club <em>Cap</em>", plain: "The Club Cap", price: 85, desc: "Six-panel washed cotton · embroidered crest", img: "1521369909029-2afed882baee", spec: "CA-006 · one size", colors: ["#8d8d88", "#0f2d25", "#1b2c45"] }
  ];

  /* ---------------- render collection ---------------- */
  var track = $("#productTrack");
  if (track) {
    var heart = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
    var html = PRODUCTS.map(function (p, i) {
      var sizes = p.id === "cap" ? ["OS"] : ["S", "M", "L"];
      return '<article class="product" data-id="' + p.id + '">' +
        '<div class="product__media">' +
          '<span class="product__no">' + String(i + 1).padStart(2, "0") + '</span>' +
          '<button type="button" class="product__wish" aria-label="Save ' + p.plain + ' to wishlist" aria-pressed="false">' + heart + '</button>' +
          '<img src="' + IMG(p.img, 820) + '" alt="' + p.plain + ' (placeholder image)" loading="lazy">' +
          '<div class="product__flat" aria-hidden="true"><span class="product__flat-label">Technical flat · front</span>' +
            '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">' + FLATS[p.id] + '</svg>' +
            '<span class="product__flat-spec">' + p.spec + '</span></div>' +
          '<div class="product__quick"><span>Quick add</span>' + sizes.map(function (s) { return '<button type="button" data-add="' + p.id + '" data-size="' + s + '" aria-label="Add ' + p.plain + ' size ' + s + ' to bag">' + s + '</button>'; }).join("") + '</div>' +
        '</div>' +
        '<div class="product__info"><h3 class="product__name">' + p.name + '</h3><span class="product__price">$' + p.price + '</span></div>' +
        '<p class="product__desc">' + p.desc + '</p>' +
        '<div class="product__meta"><div class="product__swatches">' + p.colors.map(function (c) { return '<i style="--c:' + c + '"></i>'; }).join("") + '</div>' +
        '<button type="button" class="product__flip" data-flip>View flat</button></div>' +
      '</article>';
    }).join("");
    html += '<div class="collection__end"><div class="frame"><img src="' + IMG("1544441893-675973e31985", 700) + '" alt="Folded club kit and white sneakers" loading="lazy"></div><p>Rendered, specified &amp; <em>ready to serve.</em></p><a href="#techpack" class="btn btn--champ btn--sm"><span>See a tech pack</span></a></div>';
    track.innerHTML = html;
  }

  /* ---------------- cart ---------------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem("ca_cart_v2") || "[]") || []; } catch (e) { cart = []; }
  var drawerItems = $(".drawer__items"), toastEl = $(".toast"), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add("is-show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("is-show"); }, 2600);
  }
  function saveCart() { try { localStorage.setItem("ca_cart_v2", JSON.stringify(cart)); } catch (e) {} }
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
    var w = e.target.closest(".product__wish");
    if (w) { var on = w.classList.toggle("is-on"); w.setAttribute("aria-pressed", String(on)); toast(on ? "Saved to your wishlist" : "Removed from your wishlist"); return; }
    var f = e.target.closest("[data-flip]");
    if (f) { var card = f.closest(".product"); var shown = card.classList.toggle("show-flat"); f.textContent = shown ? "View photo" : "View flat"; return; }
    var rm = e.target.closest("[data-rm]");
    if (rm) { cart.splice(+rm.getAttribute("data-rm"), 1); saveCart(); renderCart(); return; }
    if (e.target.closest("[data-open-cart]")) { openCart(); return; }
    if (e.target.closest("[data-close-cart]")) { closeCart(); return; }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeCart(); toggleMenu(false); setMega(false); } });
  renderCart();

  /* ---------------- header: utility rotator, mega menu, mobile menu ---------------- */
  var rot = $(".utility__rotator"), rotIdx = 0;
  if (rot && !reduce) {
    var rotItems = $$("span", rot);
    setInterval(function () {
      rotIdx = (rotIdx + 1) % rotItems.length;
      rotItems.forEach(function (s) { s.style.transform = "translateY(-" + rotIdx * 100 + "%)"; s.style.transition = "transform .8s cubic-bezier(.22,1,.36,1)"; });
    }, 4200);
  }

  var megaBtn = $(".has-mega .navlink"), mega = $("#mega"), megaTimer;
  function setMega(open) {
    if (!mega) return;
    clearTimeout(megaTimer);
    mega.classList.toggle("is-open", open);
    mega.setAttribute("aria-hidden", String(!open));
    megaBtn.setAttribute("aria-expanded", String(open));
  }
  if (megaBtn) {
    megaBtn.addEventListener("click", function () { setMega(!mega.classList.contains("is-open")); });
    var hoverable = window.matchMedia("(hover: hover)").matches;
    if (hoverable) {
      [megaBtn, mega].forEach(function (el) {
        el.addEventListener("mouseenter", function () { setMega(true); });
        el.addEventListener("mouseleave", function () { megaTimer = setTimeout(function () { setMega(false); }, 220); });
      });
    }
    $$("a", mega).forEach(function (a) { a.addEventListener("click", function () { setMega(false); }); });
  }

  var burger = $(".burger"), mMenu = $(".mobile-menu");
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

  var header = $("#header");
  function onScrollHeader(y) { header.classList.toggle("is-compact", y > 60); if (y > 60) setMega(false); }

  /* ---------------- hero slider ---------------- */
  var slides = $$(".hero__slide"), dots = $$(".hdot"), cur = 0, slideTimer, SLIDE_MS = 6500;
  function goSlide(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle("is-active", k === cur); });
    dots.forEach(function (d, k) {
      d.classList.toggle("is-active", k === cur);
      var bar = $("em", d);
      bar.style.transition = "none"; bar.style.transform = "scaleX(0)";
      if (k === cur && !reduce) { void bar.offsetWidth; bar.style.transition = "transform " + SLIDE_MS + "ms linear"; bar.style.transform = "scaleX(1)"; }
    });
    clearTimeout(slideTimer);
    if (!reduce) slideTimer = setTimeout(function () { goSlide(cur + 1); }, SLIDE_MS);
  }
  dots.forEach(function (d) { d.addEventListener("click", function () { goSlide(+d.getAttribute("data-slide")); }); });

  /* ---------------- tech pack: compare, hotspots, tabs, sizes ---------------- */
  var compare = $("#compare");
  function syncHot(v) {
    $$(".hotspot").forEach(function (h) { h.classList.toggle("is-under", parseFloat(h.style.getPropertyValue("--x")) < +v + 2); });
  }
  if (compare) {
    var range = $(".compare__range", compare);
    var setPos = function (v) { compare.style.setProperty("--pos", v + "%"); syncHot(v); };
    range.addEventListener("input", function () { setPos(range.value); });
    setPos(range.value);
    // hotspots sit above the range input so they stay clickable
  }

  var SPECS = [
    { t: "Knitted collar", d: "Flat-knit collar with a 3 mm bordeaux tipping stripe. Holds its roll through every wash.", a: ["Spec", "7.5 cm point"], b: ["Tolerance", "± 0.3 cm"] },
    { t: "Three-button placket", d: "Clean-finish placket with three mother-of-pearl buttons, hand-sewn with a shank.", a: ["Placket", "13 × 2.4 cm"], b: ["Buttons", "14L MOP"] },
    { t: "Embroidered crest", d: "The CA crest in satin stitch, 11,000 stitches, placed 18 cm from the high point shoulder.", a: ["Size", "3.2 cm"], b: ["Thread", "Forest"] },
    { t: "Ribbed sleeve", d: "Set-in sleeve finished with a 2 cm rib cuff, cut slightly longer for the serve.", a: ["Cuff", "2 cm 1×1 rib"], b: ["Opening", "17 cm"] },
    { t: "Tennis tail & vents", d: "Drop-back hem keeps the polo tucked through every overhead. 4 cm side vents.", a: ["Drop", "+3 cm back"], b: ["Vents", "4 cm"] }
  ];
  var specCard = $(".spec-card");
  function showTab(name) {
    $$(".tab").forEach(function (t) { var on = t.getAttribute("data-tab") === name; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", String(on)); });
    $$(".tabpanel").forEach(function (p) { p.classList.toggle("is-active", p.getAttribute("data-panel") === name); });
  }
  function setSpec(i) {
    var s = SPECS[i]; if (!s || !specCard) return;
    $$(".hotspot").forEach(function (h) { h.classList.toggle("is-active", +h.getAttribute("data-spec") === i); });
    showTab("details");
    var fill = function () {
      $(".spec-card__no", specCard).textContent = String(i + 1).padStart(2, "0");
      $(".spec-card__title", specCard).textContent = s.t;
      $(".spec-card__text", specCard).textContent = s.d;
      var dts = $$("dt", specCard), dds = $$("dd", specCard);
      dts[0].textContent = s.a[0]; dds[0].textContent = s.a[1];
      dts[1].textContent = s.b[0]; dds[1].textContent = s.b[1];
    };
    if (hasGSAP && !reduce) gsap.to(specCard, { autoAlpha: 0, y: 10, duration: .2, onComplete: function () { fill(); gsap.to(specCard, { autoAlpha: 1, y: 0, duration: .45, ease: "power3.out" }); } });
    else fill();
  }
  $$(".hotspot").forEach(function (h) {
    h.addEventListener("click", function () {
      setSpec(+h.getAttribute("data-spec"));
      if (compare) { $(".compare__range", compare).value = 0; compare.style.setProperty("--pos", "0%"); syncHot(0); }
    });
  });
  if ($(".hotspot")) $(".hotspot").classList.add("is-active");
  $$(".tab").forEach(function (t) { t.addEventListener("click", function () { showTab(t.getAttribute("data-tab")); }); });

  var GRADE = { chest: [50, 52, 54, 56.5, 59], length: [70, 72, 74, 76, 78], sleeve: [20.5, 21, 22, 22.5, 23], collar: [7, 7.25, 7.5, 7.75, 8] };
  $$(".size").forEach(function (b) {
    b.addEventListener("click", function () {
      var i = +b.getAttribute("data-size");
      $$(".size").forEach(function (x) { x.classList.toggle("is-active", x === b); });
      Object.keys(GRADE).forEach(function (k) { var cell = $('[data-m="' + k + '"]'); if (cell) cell.textContent = GRADE[k][i]; });
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
  var mono = { font: "classic", color: "#0f2d25", name: "Forest" };
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
      addToCart({ name: "Centre Court Polo", price: 185, img: PRODUCTS[0].img, variant: "Monogram " + (monoInput.value || "CA") + " · " + mono.name });
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
  if (card3d && window.matchMedia("(hover: hover)").matches && !reduce && hasGSAP) {
    var inner = $(".card3d__inner", card3d);
    var rx = gsap.quickTo(inner, "rotationY", { duration: .6, ease: "power3" });
    var ry = gsap.quickTo(inner, "rotationX", { duration: .6, ease: "power3" });
    card3d.addEventListener("pointermove", function (e) {
      var r = card3d.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      inner.style.setProperty("--mx", px * 100 + "%"); inner.style.setProperty("--my", py * 100 + "%");
      rx((px - .5) * 22); ry((.5 - py) * 16);
    });
    card3d.addEventListener("pointerleave", function () { rx(0); ry(0); });
  }

  /* ---------------- scoreboard reels ---------------- */
  $$(".flips").forEach(function (f) {
    var v = f.getAttribute("data-value");
    f.setAttribute("aria-label", v);
    f.innerHTML = v.split("").map(function (d) {
      var digits = ""; for (var k = 0; k <= 9; k++) digits += "<span>" + k + "</span>";
      return '<span class="flip" aria-hidden="true"><span class="flip__reel" data-d="' + d + '">' + digits + digits + "</span></span>";
    }).join("");
  });

  /* =========================================================
     NO GSAP → show everything and stop
     ========================================================= */
  if (!hasGSAP) {
    var l = $(".loader"); if (l) l.remove();
    document.body.classList.remove("is-loading");
    $$(".flip__reel").forEach(function (r) { r.style.transform = "translateY(-" + (10 + +r.getAttribute("data-d")) * 5 + "%)"; });
    window.addEventListener("scroll", function () { onScrollHeader(window.scrollY); }, { passive: true });
    goSlide(0);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- smooth scroll ---------------- */
  var lenis = null;
  if (typeof window.Lenis !== "undefined" && !reduce) {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", function (e) { ScrollTrigger.update(); onScrollHeader(e.scroll); });
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  } else {
    window.addEventListener("scroll", function () { onScrollHeader(window.scrollY); }, { passive: true });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) { e.preventDefault(); return; }
      var target = id === "#top" ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: id === "#top" ? 0 : -80, duration: 1.6 });
      else window.scrollTo({ top: id === "#top" ? 0 : target.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    });
  });

  /* ---------------- intro ---------------- */
  gsap.set(".hero__title .line > span", { yPercent: 110 });
  gsap.set([".hero__eyebrow", ".hero__sub", ".hero__ctas", ".hero__foot", ".hero__badge"], { autoAlpha: 0, y: 26 });
  gsap.set(".hero__card", { clipPath: "inset(6% 4% 6% 4% round 32px)" });
  gsap.set(".site-header", { yPercent: -100 });

  var intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" }, onStart: function () { goSlide(0); } });
  intro
    .to(".hero__card", { clipPath: "inset(0% 0% 0% 0% round 32px)", duration: 1.6, ease: "expo.inOut", clearProps: "clipPath" }, 0)
    .to(".site-header", { yPercent: 0, duration: 1.2 }, 0.5)
    .to(".hero__eyebrow", { autoAlpha: 1, y: 0, duration: 1 }, 0.8)
    .to(".hero__title .line > span", { yPercent: 0, duration: 1.4, stagger: .12 }, 0.85)
    .to([".hero__sub", ".hero__ctas", ".hero__foot", ".hero__badge"], { autoAlpha: 1, y: 0, duration: 1.1, stagger: .1 }, 1.15);

  var loader = $(".loader");
  var ltl = gsap.timeline({ onComplete: function () { document.body.classList.remove("is-loading"); if (loader) loader.remove(); ScrollTrigger.refresh(); } });
  if (reduce) {
    ltl.to(loader, { autoAlpha: 0, duration: .3 }).add(function () { intro.progress(1); });
  } else {
    ltl.to(".loader__bar i", { scaleX: 1, duration: 1.7, ease: "power2.inOut" }, 0)
      .to(".loader__track", { yPercent: -80, duration: 1.7, ease: "steps(4)" }, 0)
      .to(".loader", { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, 1.95)
      .add(function () { intro.play(); }, 2.1);
  }
  setTimeout(function () { if (document.body.classList.contains("is-loading")) { ltl.progress(1); intro.progress(1); } }, 6000);

  /* =========================================================
     SCROLL ANIMATIONS
     ========================================================= */
  var mm = gsap.matchMedia();

  // hero card gently recedes as you scroll away
  if (!reduce) {
    gsap.to(".hero__slides", { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__content", { y: -60, autoAlpha: .2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }

  // house: words light up + images reveal
  var st = $("[data-reveal-words]");
  if (st) {
    var words = st.textContent.trim().split(/\s+/);
    st.innerHTML = words.map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    gsap.to(st.querySelectorAll(".w"), { opacity: 1, stagger: .08, ease: "none", scrollTrigger: { trigger: st, start: "top 80%", end: "bottom 50%", scrub: reduce ? false : .6 } });
  }
  gsap.from(".house .frame", { clipPath: "inset(100% 0 0 0)", duration: 1.6, stagger: .15, ease: "expo.inOut", scrollTrigger: { trigger: ".house__grid", start: "top 78%" } });
  gsap.from([".house__body", ".house__sign", ".house__stats"], { y: 30, autoAlpha: 0, duration: 1.1, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: ".house__text", start: "top 75%" } });

  // headings rise
  $$(".display").forEach(function (d) {
    gsap.from(d, { y: 60, autoAlpha: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: d, start: "top 90%" } });
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
      scrollTrigger: { trigger: ".collection", start: "top top", end: function () { return "+=" + dist(); }, pin: true, scrub: reduce ? true : .8, invalidateOnRefresh: true, anticipatePin: 1, onUpdate: function (self) { setCount(self.progress); } }
    });
    gsap.from(".product", { y: 120, autoAlpha: 0, duration: 1.3, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".collection", start: "top 70%" } });
    return function () { if (tw.scrollTrigger) tw.scrollTrigger.kill(); gsap.set(track, { x: 0 }); };
  });
  mm.add("(max-width: 900px)", function () {
    var onS = function () { var max = track.scrollWidth - track.clientWidth; setCount(max > 0 ? track.scrollLeft / max : 0); };
    track.addEventListener("scroll", onS, { passive: true });
    return function () { track.removeEventListener("scroll", onS); };
  });

  // tech pack: draw flat, then sweep the compare handle
  var flatPaths = $$(".flat-lines path, .measure path").filter(function (p) { return !p.getAttribute("stroke-dasharray"); });
  flatPaths.forEach(function (p) { var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  var posObj = { v: 100 };
  gsap.timeline({ scrollTrigger: { trigger: ".techpack__sheet", start: "top 72%" } })
    .to(posObj, { v: 38, duration: 1.8, ease: "power3.inOut", onUpdate: function () { compare.style.setProperty("--pos", posObj.v + "%"); $(".compare__range").value = posObj.v; syncHot(posObj.v); } }, 0)
    .to(flatPaths, { strokeDashoffset: 0, duration: 2, stagger: .07, ease: "power2.inOut" }, 0.2)
    .fromTo(".hotspot", { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .7, stagger: .1, ease: "back.out(2)" }, 1.2)
    .from(".techpack__panel", { x: 40, autoAlpha: 0, duration: 1.2, ease: "expo.out" }, 0.3);
  compare.style.setProperty("--pos", "100%");

  // surfaces
  gsap.from(".surface", { y: 80, autoAlpha: 0, duration: 1.3, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: ".surfaces__row", start: "top 85%" } });

  // lookbook: frames reveal, images drift inside their frames (no overlap)
  gsap.from(".lb__item .frame", { clipPath: "inset(100% 0 0 0)", duration: 1.6, stagger: .12, ease: "expo.inOut", scrollTrigger: { trigger: ".lb", start: "top 78%" } });
  if (!reduce) {
    $$(".lb__item .frame img, .clubhouse__room .frame img").forEach(function (img) {
      gsap.fromTo(img, { yPercent: -12 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: img.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }
  gsap.from(".lb__q2 em", { scale: .6, autoAlpha: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".lb__quote", start: "top 80%" } });

  // scoreboard
  ScrollTrigger.create({
    trigger: ".board", start: "top 75%", once: true,
    onEnter: function () {
      $$(".flip__reel").forEach(function (r, i) {
        var d = +r.getAttribute("data-d");
        gsap.fromTo(r, { yPercent: 0 }, { yPercent: -(10 + d) * 5, duration: reduce ? 0 : 1.8 + (i % 3) * .25, ease: "power4.out", delay: i * .06 });
      });
    }
  });
  gsap.from(".board", { y: 80, rotationX: 16, autoAlpha: 0, transformPerspective: 1200, duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: ".scoreboard", start: "top 75%" } });
  gsap.from(".sb-photo--l", { x: -80, rotation: -20, autoAlpha: 0, duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: ".scoreboard", start: "top 70%" } });
  gsap.from(".sb-photo--r", { x: 80, rotation: 20, autoAlpha: 0, duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: ".scoreboard", start: "top 60%" } });

  // atelier
  gsap.from(".craft li", { y: 80, autoAlpha: 0, duration: 1.3, stagger: .15, ease: "expo.out", scrollTrigger: { trigger: ".craft", start: "top 80%" } });
  gsap.from(".studio", { y: 80, autoAlpha: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".studio", start: "top 85%" } });

  // letter collage
  gsap.set(".paper__sig", { clipPath: "inset(0 100% 0 0)" });
  gsap.timeline({ scrollTrigger: { trigger: ".letter__stage", start: "top 70%" } })
    .from(".paper", { y: 120, rotation: 4, autoAlpha: 0, duration: 1.4, ease: "expo.out" })
    .from(".polaroid", { y: 80, rotation: -24, autoAlpha: 0, duration: 1.4, stagger: .15, ease: "expo.out" }, 0.15)
    .from(".ticket", { x: 100, rotation: 22, autoAlpha: 0, duration: 1.4, ease: "expo.out" }, 0.35)
    .to(".paper__sig", { clipPath: "inset(0 0% 0 0)", duration: 1.8, ease: "power2.inOut" }, 0.7)
    .from(".seal", { scale: 2.2, autoAlpha: 0, rotation: -40, duration: .9, ease: "back.out(1.8)" }, 1.4);

  // clubhouse
  gsap.from(".card3d", { y: 120, rotationX: 40, autoAlpha: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".clubhouse__panel", start: "top 85%" } });

  // social
  gsap.from(".social__item", { y: 60, autoAlpha: 0, duration: 1.2, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ".social__grid", start: "top 88%" } });

  // footer wordmark
  gsap.from(".footer__word > *", { yPercent: 60, autoAlpha: 0, duration: 1.4, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: ".footer__word", start: "top 95%" } });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
