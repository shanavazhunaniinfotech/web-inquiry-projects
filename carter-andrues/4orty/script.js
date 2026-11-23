/* =========================================================
   4ORTY — homepage interactions
   GSAP 3 + ScrollTrigger + Lenis, with graceful fallbacks.
   ========================================================= */
(function () {
  "use strict";

  var hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- Collection 001 (concept pricing) ---------------- */
  var PRODUCTS = [
    { id: "cap", name: "The Tour Cap", price: 65, kicker: "Hero piece · Accessories", spec: "Structured, curved brim, laser-perforated", flag: "Hero piece", sizes: ["One size"],
      colors: [ { name: "Phthalo", hex: "#293D32", img: "assets/tour-cap-phthalo.jpg" }, { name: "Chalk", hex: "#F1EFE8", img: "assets/tour-cap-chalk.jpg" } ] },
    { id: "polo", name: "Heritage Performance Polo", price: 145, kicker: "Polos", spec: "Tailored technical piqué", flag: "New", sizes: ["S", "M", "L", "XL"],
      colors: [ { name: "Phthalo", hex: "#293D32", img: "assets/heritage-polo-phthalo.jpg" }, { name: "Mineral", hex: "#64766B", img: "assets/heritage-polo-mineral.jpg" } ] },
    { id: "jacket", name: "Club Jacket", price: 295, kicker: "Outerwear", spec: "Stand collar, zip, contrast detailing", flag: "New", sizes: ["XS", "S", "M", "L", "XL"],
      colors: [ { name: "Chalk", hex: "#F1EFE8", img: "assets/club-jacket-chalk.jpg" } ] },
    { id: "tee", name: "Court Performance Tee", price: 95, kicker: "Performance", spec: "Breathable athletic jersey", flag: "New", sizes: ["S", "M", "L", "XL"],
      colors: [ { name: "Chalk", hex: "#F1EFE8", img: "assets/court-tee-chalk.jpg" } ] }
  ];
  var byId = function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; };

  var grid = $("#productGrid");
  grid.innerHTML = PRODUCTS.map(function (p) {
    return '<article class="card" data-id="' + p.id + '">' +
      '<div class="card__media">' +
        '<span class="card__flag">' + p.flag + "</span>" +
        p.colors.map(function (c, k) { return '<img src="' + c.img + '" alt="' + p.name + " in " + c.name + '" loading="lazy"' + (k === 0 ? ' class="is-on"' : "") + ">"; }).join("") +
        '<span class="card__tag"><span class="card__tagc">' + p.colors[0].name + "</span> · concept colourway</span>" +
      "</div>" +
      '<div class="card__body">' +
        '<span class="card__kicker">' + p.kicker + "</span>" +
        '<div class="card__row"><h3 class="card__name">' + p.name + '</h3><span class="card__price">$' + p.price + "</span></div>" +
        '<p class="card__spec">' + p.spec + "</p>" +
        '<div class="card__colors"><small>Colour <b class="card__cname">' + p.colors[0].name + "</b></small>" +
          '<div class="sw-row">' + p.colors.map(function (c, k) { return '<button type="button" class="sw' + (k === 0 ? " is-on" : "") + '" style="--c:' + c.hex + '" data-k="' + k + '" aria-label="' + c.name + '"></button>'; }).join("") + "</div>" +
        "</div>" +
      "</div>" +
      '<div class="card__actions">' +
        '<select aria-label="Choose size for ' + p.name + '">' + (p.sizes.length > 1 ? '<option value="">Choose size</option>' : "") + p.sizes.map(function (s) { return "<option>" + s + "</option>"; }).join("") + "</select>" +
        '<button type="button" data-add="' + p.id + '">Add to bag</button>' +
      "</div>" +
    "</article>";
  }).join("");

  // colourway switching on cards
  grid.addEventListener("click", function (e) {
    var sw = e.target.closest(".sw"); if (!sw) return;
    var card = sw.closest(".card"), p = byId(card.getAttribute("data-id")), k = +sw.getAttribute("data-k");
    $$(".sw", card).forEach(function (s) { s.classList.toggle("is-on", s === sw); });
    $$(".card__media img", card).forEach(function (im, i) { im.classList.toggle("is-on", i === k); });
    $(".card__cname", card).textContent = p.colors[k].name;
    $(".card__tagc", card).textContent = p.colors[k].name;
    card.setAttribute("data-color", k);
  });

  /* ---------------- cart ---------------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem("fourty_cart") || "[]") || []; } catch (e) { cart = []; }
  var toastEl = $(".toast"), toastT;
  function toast(t) { toastEl.textContent = t; toastEl.classList.add("is-show"); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("is-show"); }, 2600); }
  function save() { try { localStorage.setItem("fourty_cart", JSON.stringify(cart)); } catch (e) {} }
  function render() {
    var n = 0, t = 0; cart.forEach(function (i) { n += i.qty; t += i.qty * i.price; });
    $$(".bag-count").forEach(function (el) { el.textContent = n; });
    $("#cartTotal").textContent = "$" + t;
    $(".cart__ship em").style.transform = "scaleX(" + Math.min(t / 200, 1) + ")";
    $("#shipMsg").textContent = t >= 200 ? "You've unlocked complimentary shipping" : "$" + (200 - t) + " away from complimentary shipping";
    var ul = $("#cartItems");
    if (!cart.length) { ul.innerHTML = '<li class="cart__empty">Your bag is empty.</li>'; return; }
    ul.innerHTML = cart.map(function (i, k) {
      return '<li><img src="' + i.img + '" alt=""><div><b>' + i.name + "</b><small>" + i.variant + " · Qty " + i.qty + '</small><br><button type="button" class="rm" data-rm="' + k + '">Remove</button></div><span>$' + i.qty * i.price + "</span></li>";
    }).join("");
  }
  function add(item) {
    var f = cart.filter(function (c) { return c.name === item.name && c.variant === item.variant; })[0];
    if (f) f.qty++; else cart.push({ name: item.name, price: item.price, img: item.img, variant: item.variant, qty: 1 });
    save(); render();
    $$(".bag-count").forEach(function (el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
    toast(item.name + " added to your bag");
  }
  function openCart() { document.body.classList.add("cart-open"); $(".cart").setAttribute("aria-hidden", "false"); if (window.__lenis) window.__lenis.stop(); }
  function closeCart() { document.body.classList.remove("cart-open"); $(".cart").setAttribute("aria-hidden", "true"); if (window.__lenis) window.__lenis.start(); }
  render();

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-add]");
    if (a) {
      var card = a.closest(".card"), p = byId(a.getAttribute("data-add")), sel = $("select", card), k = +(card.getAttribute("data-color") || 0);
      if (!sel.value) { sel.focus(); toast("Please choose a size first"); sel.style.color = "#B76C53"; setTimeout(function () { sel.style.color = ""; }, 1600); return; }
      add({ name: p.name, price: p.price, img: p.colors[k].img, variant: p.colors[k].name + " · " + sel.value });
      return;
    }
    var rm = e.target.closest("[data-rm]");
    if (rm) { cart.splice(+rm.getAttribute("data-rm"), 1); save(); render(); return; }
    if (e.target.closest("[data-open-cart]")) { openCart(); return; }
    if (e.target.closest("[data-close-cart]")) { closeCart(); return; }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeCart(); menu(false); } });

  /* ---------------- Tour Cap colourways ---------------- */
  var capColor = "phthalo";
  $$(".cap .sw").forEach(function (sw) {
    sw.addEventListener("click", function () {
      capColor = sw.getAttribute("data-cap");
      $$(".cap .sw").forEach(function (s) { s.classList.toggle("is-on", s === sw); });
      $$(".cap__img").forEach(function (f) { f.classList.toggle("is-active", f.getAttribute("data-color") === capColor); });
      $("#capColor").textContent = sw.getAttribute("data-name");
    });
  });
  $("#capAdd").addEventListener("click", function () {
    var p = byId("cap"), c = capColor === "chalk" ? p.colors[1] : p.colors[0];
    add({ name: p.name, price: p.price, img: c.img, variant: c.name + " · One size" });
  });

  /* ---------------- mobile menu ---------------- */
  var mb = $(".menu-btn"), mm = $(".mmenu");
  function menu(open) {
    if (typeof open !== "boolean") open = mb.getAttribute("aria-expanded") !== "true";
    mb.setAttribute("aria-expanded", String(open)); mm.classList.toggle("is-open", open); mm.setAttribute("aria-hidden", String(!open));
    if (window.__lenis) { open ? window.__lenis.stop() : window.__lenis.start(); }
  }
  mb.addEventListener("click", function () { menu(); });
  $$(".mmenu a").forEach(function (l) { l.addEventListener("click", function () { menu(false); }); });

  /* ---------------- club form ---------------- */
  $("#clubForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var inp = $("#clubEmail"), ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim());
    inp.classList.toggle("is-err", !ok);
    $(".club__msg").textContent = ok ? "Welcome to the Club. Your 10% code is on its way." : "Please enter a valid email address.";
    if (ok) inp.value = "";
  });

  /* ---------------- header ---------------- */
  var header = $("#header"), lastY = 0;
  function onScroll(y) {
    header.classList.toggle("is-scrolled", y > 10);
    header.classList.toggle("is-hidden", y > 500 && y > lastY && !document.body.classList.contains("cart-open"));
    lastY = y;
  }

  /* =========================================================
     Without GSAP: everything visible and usable
     ========================================================= */
  if (!hasGSAP) {
    var i0 = $(".intro"); if (i0) i0.remove();
    window.addEventListener("scroll", function () { onScroll(window.scrollY); }, { passive: true });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  var lenis = null;
  if (typeof window.Lenis !== "undefined" && !reduce) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", function (e) { ScrollTrigger.update(); onScroll(e.scroll); });
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  } else window.addEventListener("scroll", function () { onScroll(window.scrollY); }, { passive: true });
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href"); if (id.length < 2) { e.preventDefault(); return; }
      var t = id === "#top" ? 0 : $(id); if (t === null) return; e.preventDefault();
      if (lenis) lenis.scrollTo(t, { offset: -60, duration: 1.4 }); else window.scrollTo({ top: t === 0 ? 0 : t.getBoundingClientRect().top + scrollY - 60, behavior: "smooth" });
    });
  });

  /* ---------------- intro → hero ---------------- */
  document.body.classList.add("is-intro");
  gsap.set(".ln > span", { yPercent: 110 });
  gsap.set([".hero__content .label", ".hero__lede", ".hero__ctas", ".hero__foot"], { autoAlpha: 0, y: 20 });
  gsap.set(".hero__piece", { autoAlpha: 0, x: 40 });
  gsap.set(".hero__media img", { scale: 1.18 });

  var heroTl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
  heroTl
    .to(".hero__media img", { scale: 1, duration: 2.4 }, 0)
    .to(".hero__content .label", { autoAlpha: 1, y: 0, duration: 1 }, 0.25)
    .to(".ln > span", { yPercent: 0, duration: 1.4, stagger: .12 }, 0.3)
    .to([".hero__lede", ".hero__ctas", ".hero__foot"], { autoAlpha: 1, y: 0, duration: 1.1, stagger: .1 }, 0.75)
    .to(".hero__piece", { autoAlpha: 1, x: 0, duration: 1.3 }, 1.0);

  var intro = $(".intro");
  var itl = gsap.timeline({ onComplete: function () { intro.remove(); document.body.classList.remove("is-intro"); ScrollTrigger.refresh(); } });
  if (reduce) { itl.to(intro, { autoAlpha: 0, duration: .3 }).add(function () { heroTl.progress(1); }); }
  else {
    itl.from(".intro__mark", { autoAlpha: 0, scale: .85, rotation: -8, duration: 1, ease: "expo.out" })
      .from(".intro__tag", { autoAlpha: 0, y: 10, letterSpacing: ".8em", duration: .9, ease: "expo.out" }, 0.25)
      .to(intro, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, 1.3)
      .add(function () { heroTl.play(); }, 1.55);
    gsap.set(intro, { clipPath: "inset(0 0 0% 0)" });
  }
  setTimeout(function () { if (document.body.classList.contains("is-intro")) { itl.progress(1); heroTl.progress(1); } }, 5000);

  if (!reduce) {
    gsap.to(".hero__media", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }

  /* ---------------- statement words ---------------- */
  var st = $("[data-words]");
  (function split(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          var w = document.createElement("span"); w.className = "w"; w.textContent = part; frag.appendChild(w);
        });
        n.parentNode.replaceChild(frag, n);
      } else split(n);
    });
  })(st);
  gsap.to(".statement__title .w", { opacity: 1, stagger: .1, ease: "none", scrollTrigger: { trigger: st, start: "top 80%", end: "bottom 50%", scrub: reduce ? false : .5 } });
  gsap.from(".statement__side", { y: 40, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".statement", start: "top 70%" } });

  /* ---------------- headings ---------------- */
  $$(".sec-head .h2, .cap__info .h2, .details__head .h2, .band__card .h2, .club__copy .h2").forEach(function (h) {
    gsap.from(h, { y: 50, autoAlpha: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 88%" } });
  });

  /* ---------------- Tour Cap ---------------- */
  gsap.fromTo(".cap__media", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: ".cap", start: "top 75%" } });
  gsap.from(".cap__specs div", { x: 30, autoAlpha: 0, duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: ".cap__specs", start: "top 85%" } });
  if (!reduce) gsap.fromTo(".cap__img img", { scale: 1.07 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".cap", start: "top bottom", end: "bottom top", scrub: true } });

  /* ---------------- collection cards ---------------- */
  gsap.from(".card", { y: 80, autoAlpha: 0, duration: 1.2, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".grid", start: "top 82%" } });
  gsap.from(".next", { y: 30, autoAlpha: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".next", start: "top 95%" } });

  /* ---------------- tiles ---------------- */
  gsap.fromTo(".tile", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.5, stagger: .12, ease: "expo.inOut", scrollTrigger: { trigger: ".shopby__grid", start: "top 80%" } });
  gsap.from(".tile__txt", { y: 30, autoAlpha: 0, duration: 1.1, stagger: .12, delay: .6, ease: "expo.out", scrollTrigger: { trigger: ".shopby__grid", start: "top 80%" } });

  /* ---------------- details ---------------- */
  gsap.from(".dt", { y: 90, autoAlpha: 0, duration: 1.3, stagger: .14, ease: "expo.out", scrollTrigger: { trigger: ".details__row", start: "top 82%" } });
  if (!reduce) $$(".dt__img img").forEach(function (im) { gsap.to(im, { scale: 1, ease: "none", scrollTrigger: { trigger: im.parentNode, start: "top bottom", end: "bottom top", scrub: true } }); });

  /* ---------------- band ---------------- */
  if (!reduce) gsap.fromTo(".band__img", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".band__card", { y: 80, autoAlpha: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: ".band", start: "top 60%" } });

  /* ---------------- promises + club ---------------- */
  gsap.from(".pr", { y: 30, autoAlpha: 0, duration: 1, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".promises", start: "top 90%" } });
  if (!reduce) gsap.fromTo(".club__mark", { rotation: -25 }, { rotation: 15, ease: "none", scrollTrigger: { trigger: ".club", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".club__mark", { scale: .7, autoAlpha: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".club", start: "top 75%" } });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
