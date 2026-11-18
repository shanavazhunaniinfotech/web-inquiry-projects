/* =========================================================
   CARTER ANDRUES — Homepage v2 interactions
   GSAP 3 + ScrollTrigger + Lenis, with graceful fallbacks.
   ========================================================= */
(function () {
  "use strict";

  var hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var IMG = function (slug, w) { return "https://burst.shopifycdn.com/photos/" + slug + ".jpg?width=" + (w || 900) + "&format=pjpg&exif=0&iptc=0"; };

  /* ---------------- catalogue (placeholder products) ---------------- */
  var PRODUCTS = [
    { id: "jacket", name: "The Court Jacket", price: 450, sub: "Water-repellent cotton twill", img: "close-up-woman-posing-in-white-casual-jacket", alt: "young-woman-posing-in-white-jacket", badge: "Bestseller", hot: true, colors: ["#f4f3ef", "#0b2a3b"] },
    { id: "crew", name: "The Clubhouse Crew", price: 320, sub: "Cotton-cashmere knit", img: "model-blends-into-the-background", alt: "close-up-of-model-wearing-cream-sweater", badge: "New", colors: ["#eee8dc", "#c9c4ba", "#0d1117"] },
    { id: "stripe", name: "The Baseline Stripe Knit", price: 290, sub: "Short-sleeve merino stripe", img: "woman-wearing-grey-and-green-sweater", alt: "young-woman-in-comfortable-combo", badge: "New", colors: ["#16222b", "#9aa3a6"] },
    { id: "hoodie", name: "The Rally Hoodie", price: 260, sub: "Heavyweight loopback · Sand", img: "man-in-tan-hoodie-looks-up-at-camera", alt: "close-up-of-man-in-tan-hoodie", badge: "Bestseller", hot: true, colors: ["#b9a993", "#d9d8d4", "#0d1117"] },
    { id: "tee", name: "The Tipped Court Tee", price: 120, sub: "Supima jersey · navy & gold tipping", img: "white-t-shirt-with-blue-and-gold", alt: "white-t-shirt-with-colored-edges", badge: "New", colors: ["#ffffff", "#1d2c4f", "#d0b25a"] },
    { id: "set", name: "The Changeover Set", price: 390, sub: "Hoodie & pant · Chalk grey", img: "matching-hoodie-and-sweatpants", alt: "man-on-stool-in-hoodie-and-sweatpants", badge: "Set", colors: ["#d6d6d3", "#0d1117"] },
    { id: "skirt", name: "The Club Skirt", price: 210, sub: "Pleated twill · Blush", img: "close-up-pink-skirt-and-cream-top", alt: "woman-wearing-cream-top-and-pink-skirt", badge: "New", colors: ["#d9a79c", "#f4f3ef"] }
  ];
  var byId = function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; };

  var LOOKS = [
    [ { id: "stripe", note: "Size S · Petrol" }, { id: "jacket", note: "Size S · Chalk" }, { name: "The Club Sweat Short", price: 160, sub: "Size S · Heather", img: "woman-wearing-sweater-and-shorts" } ],
    [ { id: "hoodie", note: "Size M · Sand" }, { name: "The Changeover Pant", price: 190, sub: "Size M · Chalk", img: "man-in-white-and-light-tan-outfit" } ]
  ];

  /* ---------------- render product rail ---------------- */
  var railTrack = $("#railTrack");
  var heart = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
  if (railTrack) {
    railTrack.innerHTML = PRODUCTS.map(function (p) {
      var sizes = p.id === "set" || p.id === "hoodie" ? ["S", "M", "L", "XL"] : ["XS", "S", "M", "L"];
      return '<article class="pcard" data-id="' + p.id + '">' +
        '<div class="pcard__media" data-cursor="View">' +
          '<span class="pcard__badge' + (p.hot ? " pcard__badge--hot" : "") + '">' + p.badge + "</span>" +
          '<button type="button" class="pcard__wish" aria-label="Save ' + p.name + '" aria-pressed="false">' + heart + "</button>" +
          '<img src="' + IMG(p.img, 800) + '" alt="' + p.name + '" loading="lazy" draggable="false">' +
          '<img class="alt" src="' + IMG(p.alt, 800) + '" alt="" loading="lazy" draggable="false">' +
          '<div class="pcard__add"><span>Quick add</span>' + sizes.map(function (s) { return '<button type="button" data-add="' + p.id + '" data-size="' + s + '" aria-label="Add ' + p.name + " size " + s + '">' + s + "</button>"; }).join("") + "</div>" +
        "</div>" +
        '<div class="pcard__info"><h3 class="pcard__name">' + p.name + '</h3><span class="pcard__price">$' + p.price + "</span></div>" +
        '<p class="pcard__sub">' + p.sub + "</p>" +
        '<div class="pcard__sw">' + p.colors.map(function (c) { return '<i style="--c:' + c + '"></i>'; }).join("") + "</div>" +
      "</article>";
    }).join("");
  }

  /* ---------------- cart ---------------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem("ca_v3_cart") || "[]") || []; } catch (e) { cart = []; }
  var toastEl = $(".toast"), toastT;
  function toast(html) { toastEl.innerHTML = html; toastEl.classList.add("is-show"); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("is-show"); }, 2600); }
  function save() { try { localStorage.setItem("ca_v3_cart", JSON.stringify(cart)); } catch (e) {} }
  function render() {
    var n = 0, t = 0; cart.forEach(function (i) { n += i.qty; t += i.qty * i.price; });
    $$(".bag-count").forEach(function (el) { el.textContent = n; });
    $("#cartTotal").textContent = "$" + t.toLocaleString();
    $(".cart__ship em").style.transform = "scaleX(" + Math.min(t / 250, 1) + ")";
    $("#shipMsg").textContent = t >= 250 ? "You've unlocked free express shipping" : "$" + (250 - t) + " away from free express shipping";
    var ul = $("#cartItems");
    if (!cart.length) { ul.innerHTML = '<li class="cart__empty">Your bag is empty. Time for a first serve.</li>'; return; }
    ul.innerHTML = cart.map(function (i, k) {
      return '<li><img src="' + IMG(i.img, 200) + '" alt=""><div><b>' + i.name + "</b><small>" + i.variant + " · Qty " + i.qty + '</small><br><button type="button" class="rm" data-rm="' + k + '">Remove</button></div><span>$' + i.qty * i.price + "</span></li>";
    }).join("");
  }
  function add(item, silent) {
    var f = cart.filter(function (c) { return c.name === item.name && c.variant === item.variant; })[0];
    if (f) f.qty++; else cart.push({ name: item.name, price: item.price, img: item.img, variant: item.variant, qty: 1 });
    save(); render();
    $$(".bag-count").forEach(function (el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
    if (!silent) toast("<b>Added</b> · " + item.name);
  }
  function openCart() { document.body.classList.add("cart-open"); $(".cart").setAttribute("aria-hidden", "false"); if (window.__lenis) window.__lenis.stop(); }
  function closeCart() { document.body.classList.remove("cart-open"); $(".cart").setAttribute("aria-hidden", "true"); if (window.__lenis) window.__lenis.start(); }
  render();

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-add]");
    if (a) { var p = byId(a.getAttribute("data-add")); add({ name: p.name, price: p.price, img: p.img, variant: "Size " + a.getAttribute("data-size") }); return; }
    var w = e.target.closest(".pcard__wish");
    if (w) { var on = w.classList.toggle("is-on"); w.setAttribute("aria-pressed", String(on)); toast(on ? "<b>Saved</b> to your wishlist" : "Removed from wishlist"); return; }
    var rm = e.target.closest("[data-rm]");
    if (rm) { cart.splice(+rm.getAttribute("data-rm"), 1); save(); render(); return; }
    if (e.target.closest("[data-open-cart]")) { openCart(); return; }
    if (e.target.closest("[data-close-cart]")) { closeCart(); return; }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeCart(); menu(false); } });

  /* ---------------- mobile menu ---------------- */
  var mb = $(".menu-btn"), mm = $(".mmenu");
  function menu(open) {
    if (typeof open !== "boolean") open = mb.getAttribute("aria-expanded") !== "true";
    mb.setAttribute("aria-expanded", String(open)); mm.classList.toggle("is-open", open); mm.setAttribute("aria-hidden", String(!open));
    if (window.__lenis) { open ? window.__lenis.stop() : window.__lenis.start(); }
  }
  mb.addEventListener("click", function () { menu(); });
  $$(".mmenu a").forEach(function (l) { l.addEventListener("click", function () { menu(false); }); });

  /* ---------------- spotlight sizes + add ---------------- */
  var spotSize = "S";
  $$(".sz").forEach(function (b) { b.addEventListener("click", function () { $$(".sz").forEach(function (x) { x.classList.toggle("is-on", x === b); }); spotSize = b.textContent; }); });
  $("#spotAdd").addEventListener("click", function () { var p = byId("crew"); add({ name: p.name, price: p.price, img: p.img, variant: "Size " + spotSize + " · Ivory" }); });

  /* ---------------- shop the look ---------------- */
  var lookIdx = 0;
  function lookItem(it) { if (it.id) { var p = byId(it.id); return { name: p.name, price: p.price, img: p.img, sub: it.note }; } return it; }
  function renderLook(i) {
    lookIdx = i;
    $$(".ltab").forEach(function (t) { t.classList.toggle("is-active", +t.getAttribute("data-look") === i); });
    $$(".limg").forEach(function (f) { f.classList.toggle("is-active", +f.getAttribute("data-look") === i); });
    var items = LOOKS[i].map(lookItem), total = 0;
    $("#lookItems").innerHTML = items.map(function (it, k) {
      total += it.price;
      return '<li class="litem" data-k="' + k + '"><img src="' + IMG(it.img, 300) + '" alt="" loading="lazy"><div><b>' + it.name + "</b><small>" + it.sub + '</small></div><div class="litem__r"><span>$' + it.price + '</span><button type="button" data-lookadd="' + k + '" aria-label="Add ' + it.name + '">+</button></div></li>';
    }).join("");
    $("#lookTotal").textContent = "$" + total;
    if (hasGSAP && !reduce) gsap.from("#lookItems .litem", { x: 40, autoAlpha: 0, duration: .8, stagger: .08, ease: "expo.out" });
  }
  $$(".ltab").forEach(function (t) { t.addEventListener("click", function () { renderLook(+t.getAttribute("data-look")); }); });
  $$(".hot").forEach(function (h) {
    h.addEventListener("click", function () {
      var k = +h.getAttribute("data-item").split("-")[1];
      $$(".hot").forEach(function (x) { x.classList.toggle("is-on", x === h); });
      $$(".litem").forEach(function (li) { li.classList.toggle("is-on", +li.getAttribute("data-k") === k); });
    });
  });
  $("#lookItems").addEventListener("click", function (e) {
    var b = e.target.closest("[data-lookadd]"); if (!b) return;
    var it = lookItem(LOOKS[lookIdx][+b.getAttribute("data-lookadd")]);
    add({ name: it.name, price: it.price, img: it.img, variant: it.sub });
  });
  $("#addLook").addEventListener("click", function () {
    LOOKS[lookIdx].map(lookItem).forEach(function (it) { add({ name: it.name, price: it.price, img: it.img, variant: it.sub }, true); });
    toast("<b>Full look added</b> · " + LOOKS[lookIdx].length + " pieces");
    openCart();
  });
  renderLook(0);

  /* ---------------- reviews ---------------- */
  var rvs = $$(".rv"), rvd = $$(".rvd"), rvI = 0, rvT;
  function showRv(i) { rvI = (i + rvs.length) % rvs.length; rvs.forEach(function (r, k) { r.classList.toggle("is-active", k === rvI); }); rvd.forEach(function (d, k) { d.classList.toggle("is-active", k === rvI); }); clearTimeout(rvT); if (!reduce) rvT = setTimeout(function () { showRv(rvI + 1); }, 5500); }
  rvd.forEach(function (d, k) { d.addEventListener("click", function () { showRv(k); }); });
  showRv(0);

  /* ---------------- club form ---------------- */
  $("#clubForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var inp = $("#clubEmail"), ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim());
    inp.classList.toggle("is-err", !ok);
    $(".club__msg").textContent = ok ? "Welcome to the Club. Your 10% code is on its way." : "Please enter a valid email address.";
    if (ok) inp.value = "";
  });

  /* ---------------- header state ---------------- */
  var header = $("#header");
  function onScroll(y) { header.classList.toggle("is-scrolled", y > 10); }

  /* ---------------- hero looks ---------------- */
  var HERO = [ { name: "The Court Jacket", price: "$450" }, { name: "The Clubhouse Crew", price: "$320" }, { name: "The Rally Hoodie", price: "$260" } ];
  var looks = $$(".hlook"), pager = $$(".hp"), hI = 0, hT, HMS = 5600;
  function heroGo(i, instant) {
    var prev = looks[hI]; hI = (i + looks.length) % looks.length; var next = looks[hI];
    pager.forEach(function (p, k) {
      p.classList.toggle("is-active", k === hI);
      var bar = $("em", p);
      if (hasGSAP) { gsap.killTweensOf(bar); gsap.set(bar, { scaleX: 0 }); if (k === hI && !reduce) gsap.to(bar, { scaleX: 1, duration: HMS / 1000, ease: "none" }); }
    });
    if (prev !== next) {
      if (hasGSAP && !reduce && !instant) {
        looks.forEach(function (l) { l.style.zIndex = l === next ? 3 : (l === prev ? 2 : 1); });
        gsap.fromTo(next, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" });
        gsap.fromTo($("img", next), { scale: 1.25 }, { scale: 1.08, duration: 1.8, ease: "expo.out" });
        gsap.to($("img", prev), { scale: 1.2, duration: 1.3, ease: "expo.inOut" });
        gsap.to(["#tagName", "#tagPrice"], { yPercent: -60, autoAlpha: 0, duration: .35, ease: "power2.in", onComplete: function () {
          $("#tagName").textContent = HERO[hI].name; $("#tagPrice").textContent = HERO[hI].price;
          gsap.fromTo(["#tagName", "#tagPrice"], { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .6, ease: "expo.out" });
        } });
      } else {
        looks.forEach(function (l) { l.classList.toggle("is-active", l === next); l.style.clipPath = l === next ? "inset(0 0 0 0)" : ""; });
        $("#tagName").textContent = HERO[hI].name; $("#tagPrice").textContent = HERO[hI].price;
      }
      looks.forEach(function (l) { l.classList.toggle("is-active", l === next); });
    }
    clearTimeout(hT);
    if (!reduce) hT = setTimeout(function () { heroGo(hI + 1); }, HMS);
  }
  pager.forEach(function (p) { p.addEventListener("click", function () { heroGo(+p.getAttribute("data-go")); }); });

  /* ---------------- product rail (drag + arrows) ---------------- */
  var rail = $("#rail"), rx = 0, maxX = 0;
  function bounds() { maxX = Math.max(0, railTrack.scrollWidth - rail.clientWidth); }
  function setRail(x, dur) {
    rx = Math.max(-maxX, Math.min(0, x));
    var prog = maxX ? -rx / maxX : 0;
    if (hasGSAP) { gsap.to(railTrack, { x: rx, duration: dur == null ? .9 : dur, ease: "expo.out" }); gsap.to(".rail-progress i", { scaleX: .2 + prog * .8, duration: .6 }); }
    else { railTrack.style.transform = "translateX(" + rx + "px)"; }
  }
  bounds(); window.addEventListener("resize", function () { bounds(); setRail(rx, 0); });
  $$("[data-rail]").forEach(function (b) { b.addEventListener("click", function () { var step = ($(".pcard").offsetWidth + 22) * (window.innerWidth > 860 ? 2 : 1); setRail(rx - step * +b.getAttribute("data-rail")); }); });
  (function () {
    var down = false, sx = 0, start = 0, moved = 0, lastX = 0, vel = 0;
    rail.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return; // touch uses native swipe below
      if (e.target.closest("button")) return;
      down = true; moved = 0; sx = e.clientX; start = rx; lastX = e.clientX; rail.classList.add("is-drag");
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return; var dx = e.clientX - sx; moved = Math.abs(dx); vel = e.clientX - lastX; lastX = e.clientX; setRail(start + dx, .3);
    });
    window.addEventListener("pointerup", function () { if (!down) return; down = false; rail.classList.remove("is-drag"); setRail(rx + vel * 12); });
    rail.addEventListener("click", function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
    // touch: horizontal swipe
    var tsx = 0, tsy = 0, tstart = 0, horiz = null;
    rail.addEventListener("touchstart", function (e) { tsx = e.touches[0].clientX; tsy = e.touches[0].clientY; tstart = rx; horiz = null; }, { passive: true });
    rail.addEventListener("touchmove", function (e) {
      var dx = e.touches[0].clientX - tsx, dy = e.touches[0].clientY - tsy;
      if (horiz === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) horiz = Math.abs(dx) > Math.abs(dy);
      if (horiz) setRail(tstart + dx * 1.1, .25);
    }, { passive: true });
  })();

  /* ---------------- cursor ---------------- */
  var cursor = $(".cursor");
  if (fine && hasGSAP && !reduce) {
    var cx = gsap.quickTo(cursor, "x", { duration: .45, ease: "power3" }), cy = gsap.quickTo(cursor, "y", { duration: .45, ease: "power3" });
    window.addEventListener("pointermove", function (e) { cx(e.clientX); cy(e.clientY); });
    document.addEventListener("pointerover", function (e) {
      var t = e.target.closest("[data-cursor], .rail");
      if (t && !e.target.closest("button")) { $("span", cursor).textContent = t.classList.contains("rail") && !e.target.closest("[data-cursor]") ? "Drag" : (t.getAttribute("data-cursor") || "Drag"); gsap.to(cursor, { scale: 1, duration: .4, ease: "back.out(2)" }); }
      else gsap.to(cursor, { scale: 0, duration: .3 });
    });
  }

  /* =========================================================
     NO GSAP → static but complete
     ========================================================= */
  if (!hasGSAP) {
    var it = $(".intro"); if (it) it.remove();
    window.addEventListener("scroll", function () { onScroll(window.scrollY); }, { passive: true });
    heroGo(0, true);
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
      if (lenis) lenis.scrollTo(t, { offset: -70, duration: 1.5 }); else window.scrollTo({ top: t === 0 ? 0 : t.getBoundingClientRect().top + scrollY - 70, behavior: "smooth" });
    });
  });

  /* ---------------- intro → hero ---------------- */
  document.body.classList.add("is-intro");
  gsap.set(".hl > span", { yPercent: 115 });
  gsap.set([".hero__copy .eyebrow", ".hero__lede", ".hero__ctas", ".hero__usp"], { autoAlpha: 0, y: 24 });
  gsap.set(".hero__frame", { clipPath: "inset(100% 0% 0% 0% round 26px)" });
  gsap.set([".hero__thumb", ".shoptag", ".hero__pager"], { autoAlpha: 0, y: 40 });
  gsap.set(".hero__ball", { autoAlpha: 0, y: -260 });
  looks.forEach(function (l, k) { l.style.clipPath = k === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)"; });

  var heroTl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" }, onComplete: function () { heroGo(0, true); } });
  heroTl
    .to(".hero__frame", { clipPath: "inset(0% 0% 0% 0% round 26px)", duration: 1.5, ease: "expo.inOut" }, 0)
    .fromTo(".hlook.is-active img", { scale: 1.35 }, { scale: 1.08, duration: 2.2 }, 0.2)
    .to(".hero__copy .eyebrow", { autoAlpha: 1, y: 0, duration: 1 }, 0.3)
    .to(".hl > span", { yPercent: 0, duration: 1.3, stagger: .09 }, 0.35)
    .to([".hero__lede", ".hero__ctas", ".hero__usp"], { autoAlpha: 1, y: 0, duration: 1, stagger: .1 }, 0.8)
    .to([".hero__thumb", ".hero__pager", ".shoptag"], { autoAlpha: 1, y: 0, duration: 1.1, stagger: .12 }, 0.9)
    .to(".hero__ball", { autoAlpha: 1, y: 0, duration: 1.4, ease: "bounce.out" }, 1.0);

  var intro = $(".intro");
  var itl = gsap.timeline({ onComplete: function () { intro.remove(); document.body.classList.remove("is-intro"); ScrollTrigger.refresh(); } });
  if (reduce) { itl.to(intro, { autoAlpha: 0, duration: .3 }).add(function () { heroTl.progress(1); }); }
  else {
    itl.from(".intro__word span", { yPercent: 110, duration: .9, stagger: .1, ease: "expo.out" })
      .to(".intro__ball", { top: "58%", duration: .55, ease: "power2.in" }, 0.35)
      .to(".intro__ball", { top: "38%", duration: .4, ease: "power2.out" })
      .to(".intro__ball", { top: "58%", duration: .35, ease: "power2.in" })
      .to(".intro__ball", { scale: 80, duration: .9, ease: "expo.in" }, "-=0.05")
      .to(intro, { clipPath: "inset(0 0 100% 0)", duration: .9, ease: "expo.inOut" }, "-=0.25")
      .add(function () { heroTl.play(); }, "-=0.7");
    gsap.set(intro, { clipPath: "inset(0 0 0% 0)" });
  }
  setTimeout(function () { if (document.body.classList.contains("is-intro")) { itl.progress(1); heroTl.progress(1); } }, 5000);

  // ball keeps bouncing gently, stage reacts to the mouse
  if (!reduce) {
    gsap.to(".hero__ball img", { y: -26, rotation: 25, duration: .9, ease: "power1.inOut", yoyo: true, repeat: -1, delay: 3 });
    if (fine) {
      var fx = gsap.quickTo(".hero__frame", "x", { duration: 1.2, ease: "power3" }), tx = gsap.quickTo(".hero__thumb", "x", { duration: 1.2, ease: "power3" }), bx = gsap.quickTo(".hero__ball", "x", { duration: 1.2, ease: "power3" });
      $(".hero").addEventListener("pointermove", function (e) { var p = e.clientX / innerWidth - .5; fx(p * -14); tx(p * 26); bx(p * 40); });
    }
    gsap.to(".hero__stage", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }

  /* ---------------- section headings ---------------- */
  $$(".sec-head .h2, .court__intro .h2, .spot__head .h2").forEach(function (h) {
    gsap.from(h, { yPercent: 40, autoAlpha: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 88%" } });
  });

  /* ---------------- categories ---------------- */
  gsap.from(".cat", { y: 120, autoAlpha: 0, duration: 1.4, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: ".cats__row", start: "top 82%" } });
  gsap.from(".cat__arch", { clipPath: "inset(100% 0 0 0 round 999px 999px 26px 26px)", duration: 1.5, stagger: .12, ease: "expo.inOut", scrollTrigger: { trigger: ".cats__row", start: "top 82%" } });

  /* ---------------- rail entrance ---------------- */
  gsap.from(".pcard", { x: 160, autoAlpha: 0, duration: 1.4, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: "#rail", start: "top 85%" }, onComplete: bounds });

  /* ---------------- spotlight ---------------- */
  var spotImgs = $$(".spot__img"), steps = $$(".step"), count = $(".spot__count b");
  function setStep(i) {
    steps.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
    spotImgs.forEach(function (im, k) { im.classList.toggle("is-active", k <= i); im.style.zIndex = k + 1; });
    count.textContent = "0" + (i + 1);
  }
  gsap.matchMedia().add("(min-width: 861px)", function () {
    steps.forEach(function (s, i) { ScrollTrigger.create({ trigger: s, start: "top 60%", end: "bottom 60%", onToggle: function (self) { if (self.isActive) setStep(i); } }); });
  });
  gsap.matchMedia().add("(max-width: 860px)", function () {
    var k = 0; var iv = setInterval(function () { k = (k + 1) % 3; setStep(k); }, 3200);
    return function () { clearInterval(iv); };
  });

  /* ---------------- court zoom ---------------- */
  gsap.fromTo(".court__frame", { scale: .72, borderRadius: "200px" }, { scale: 1, borderRadius: "26px", ease: "none", scrollTrigger: { trigger: ".court__zoom", start: "top 90%", end: "top 15%", scrub: true } });
  gsap.fromTo(".court__frame img", { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".court__zoom", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".feat", { y: 100, autoAlpha: 0, duration: 1.3, stagger: .14, ease: "expo.out", scrollTrigger: { trigger: ".court__feats", start: "top 85%" } });

  /* ---------------- looks ---------------- */
  gsap.from(".looks__img", { clipPath: "inset(0 0 100% 0 round 26px)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: ".looks__body", start: "top 80%" } });
  gsap.fromTo(".hot", { scale: 0 }, { scale: 1, duration: .8, stagger: .12, ease: "back.out(2.5)", scrollTrigger: { trigger: ".looks__body", start: "top 75%" } });

  /* ---------------- reviews ---------------- */
  gsap.from(".reviews__big", { textContent: 0, duration: 2, ease: "power2.out", snap: { textContent: .1 }, scrollTrigger: { trigger: ".reviews", start: "top 80%" }, onUpdate: function () { var el = $(".reviews__big"); el.textContent = (+el.textContent).toFixed(1); } });

  /* ---------------- club ---------------- */
  gsap.fromTo(".club__ball img", { rotation: -120, x: -60 }, { rotation: 200, x: 30, ease: "none", scrollTrigger: { trigger: ".club", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".club", { y: 80, autoAlpha: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: ".club", start: "top 88%" } });

  /* ---------------- footer ---------------- */
  gsap.from(".footer__mark", { yPercent: 60, autoAlpha: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".footer__mark", start: "top 98%" } });

  window.addEventListener("load", function () { bounds(); ScrollTrigger.refresh(); });
})();
