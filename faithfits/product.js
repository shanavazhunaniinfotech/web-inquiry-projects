/* FaithFits — product page interactions */
(function () {
  "use strict";
  var FF = window.FF, COLORS = FF.COLORS, PRICE = FF.PRICE, SIZES = FF.SIZES, title = FF.title;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Which product ---------- */
  var id = (location.search.match(/[?&]p=([a-z-]+)/) || [])[1];
  var P = FF.byId(id) || FF.byId("w-maroon");
  var C = COLORS[P.c];
  var lineList = P.line === "wide" ? FF.WIDE : FF.ORDER;
  var lineName = P.line === "men" ? "Men" : P.line === "wide" ? "Wide Leg" : "Women";
  var tabUrl = FF.ROOT + "?tab=" + P.line + "#bestsellers";

  document.title = title(P) + (P.line === "wide" ? " Wide Leg" : "") + " Scrub Set | FaithFits";
  document.documentElement.style.setProperty("--c", C.hex);
  $("#crumbLine").textContent = lineName; $("#crumbLine").href = tabUrl;
  $("#crumbName").textContent = title(P);
  $("#pTitle").textContent = title(P);
  $("#pEyebrow").textContent = FF.lineLabel(P) + " " + P.type.toLowerCase() + " · Top + pants";
  var badge = P.isNew ? "New" : FF.BADGES[P.c];
  if (badge) { $("#pBadge").textContent = badge; $("#pBadge").hidden = false; if (P.isNew) $("#pBadge").classList.add("badge--gold"); }
  $("#vRef").textContent = "The promise behind “" + C.word + "” · " + C.ref;
  $("#vTxt").textContent = "“" + C.verse + "”";
  $("#colorName").textContent = C.color + " · " + C.word;
  $("#colorCount").textContent = lineList.length + " colors";
  $("#allLink").href = tabUrl;

  /* swatches: same style, other colors */
  $("#pSwatches").innerHTML = lineList.map(function (c) {
    var p = FF.sibling(P.line, c);
    return '<a role="listitem" href="' + FF.url(p) + '" class="' + (c === P.c ? "is-on" : "") + '" style="--c:' + COLORS[c].hex + '" aria-label="' + title(p) + '"' + (c === P.c ? ' aria-current="true"' : "") + "><span>" + COLORS[c].word + " · " + COLORS[c].color + "</span></a>";
  }).join("");

  /* style chips: Women jogger / Men jogger / Women wide leg */
  var styles = [["women", "Women · Jogger"], ["men", "Men · Jogger"], ["wide", "Women · Wide leg"]];
  $("#styles").innerHTML = styles.map(function (s) {
    var p = FF.sibling(s[0], P.c);
    if (s[0] === P.line) return '<span class="is-on">' + s[1] + "</span>";
    if (!p) return '<span class="is-off" title="Not available in this color">' + s[1] + "</span>";
    return '<a href="' + FF.url(p) + '">' + s[1] + "</a>";
  }).join("");

  /* ---------- Gallery ---------- */
  var track = $("#gTrack"), thumbs = $("#thumbs"), imgs = P.imgs, gi = 0;
  track.innerHTML = imgs.map(function (src, i) {
    return '<button class="gslide" data-zoom="' + i + '" aria-label="Zoom photo ' + (i + 1) + '"><img src="' + src + '" alt="' + title(P) + " photo " + (i + 1) + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + ' width="760" height="1013"></button>';
  }).join("");
  thumbs.innerHTML = imgs.map(function (src, i) {
    return '<button class="gthumb' + (i ? "" : " is-on") + '" data-gi="' + i + '" aria-label="Show photo ' + (i + 1) + '"><img src="' + src + '" alt="" loading="lazy"></button>';
  }).join("");
  function go(i) { gi = (i + imgs.length) % imgs.length; track.scrollTo({ left: track.clientWidth * gi, behavior: reduce ? "auto" : "smooth" }); }
  function syncG() {
    var i = Math.round(track.scrollLeft / track.clientWidth); gi = i;
    $("#gCount").textContent = (i + 1) + " / " + imgs.length;
    $$(".gthumb").forEach(function (t, k) { t.classList.toggle("is-on", k === i); });
  }
  track.addEventListener("scroll", function () { window.requestAnimationFrame(syncG); }, { passive: true });
  thumbs.addEventListener("click", function (e) { var t = e.target.closest("[data-gi]"); if (t) go(+t.dataset.gi); });
  $$("[data-g]").forEach(function (b) { b.addEventListener("click", function () { go(gi + +b.dataset.g); }); });
  syncG();
  var lb = $("#lightbox");
  track.addEventListener("click", function (e) { var s = e.target.closest("[data-zoom]"); if (!s) return; $("#lbImg").src = imgs[+s.dataset.zoom]; $("#lbImg").alt = title(P); lb.classList.add("is-on"); lb.setAttribute("aria-hidden", "false"); });
  lb.addEventListener("click", function () { lb.classList.remove("is-on"); lb.setAttribute("aria-hidden", "true"); });

  /* ---------- Sizes ---------- */
  var sel = { top: null, bottom: null }, qty = 1;
  $$("[data-size]").forEach(function (box) {
    box.innerHTML = SIZES.map(function (s) { return '<button type="button" data-s="' + s + '" aria-pressed="false">' + s + "</button>"; }).join("");
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      pick(box.dataset.size, b.dataset.s);
      if (box.dataset.size === "top" && !sel.bottom) pick("bottom", b.dataset.s);
    });
  });
  function pick(which, s) {
    sel[which] = s;
    var box = $("[data-size=" + which + "]"); box.classList.remove("need");
    $$("button", box).forEach(function (x) { var on = x.dataset.s === s; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on); });
    $(which === "top" ? "#selTop" : "#selBottom").textContent = s;
    updateBtns();
  }
  function ready() { return sel.top && sel.bottom; }
  function updateBtns() {
    var ok = ready();
    $("#atcBtn").textContent = ok ? "Add to cart · $" + PRICE * qty : (sel.top ? "Select pants size" : "Select your sizes");
    $("#sBtn").textContent = ok ? "Add to cart · $" + PRICE * qty : "Choose sizes";
    $("#sSub").textContent = "$" + PRICE + (ok ? " · Top " + sel.top + " / Pants " + sel.bottom : " · Select sizes");
  }
  function needSizes() {
    ["top", "bottom"].forEach(function (w) {
      if (!sel[w]) { var box = $("[data-size=" + w + "]"); box.classList.add("need"); box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake"); }
    });
    toast("Please choose your top and pants sizes");
  }
  $$("[data-pq]").forEach(function (b) { b.addEventListener("click", function () { qty = Math.max(1, Math.min(9, qty + +b.dataset.pq)); $("#pQty").textContent = qty; updateBtns(); }); });
  $("#atcBtn").addEventListener("click", function () {
    if (!ready()) { needSizes(); return; }
    addToCart(P, sel.top, sel.bottom, qty); open("cart");
  });
  $("#shopPay").addEventListener("click", function () { if (!ready()) { needSizes(); return; } toast("Prototype: this opens Shop Pay express checkout on the live store"); });
  $("#sBtn").addEventListener("click", function () {
    if (ready()) { addToCart(P, sel.top, sel.bottom, qty); open("cart"); return; }
    $("#buy").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); setTimeout(needSizes, 500);
  });
  updateBtns();

  /* ETA: 3–6 business days from today (placeholder until real shipping data) */
  function addBiz(d, n) { d = new Date(d); while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) n--; } return d; }
  var fmt = function (d) { return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); };
  $("#eta").textContent = fmt(addBiz(new Date(), 3)) + " – " + fmt(addBiz(new Date(), 6));

  /* ---------- Complete your rotation ---------- */
  var rot = lineList.filter(function (c) { return c !== P.c; }).slice(0, 3).map(function (c) { return FF.sibling(P.line, c); });
  $("#rotList").innerHTML = rot.map(function (p) {
    return '<div class="rot"><a href="' + FF.url(p) + '"><img src="' + p.img + '" alt="' + title(p) + '" loading="lazy"></a><p><strong>' + title(p) + "</strong><small>" + COLORS[p.c].ref + " · $" + PRICE + '</small></p><button class="btn btn--line" data-rot="' + p.id + '">+ Add</button></div>';
  }).join("");
  $("#rotList").addEventListener("click", function (e) {
    var b = e.target.closest("[data-rot]"); if (!b) return;
    if (!ready()) { needSizes(); $("#buy").scrollIntoView({ behavior: "smooth" }); return; }
    var p = FF.byId(b.dataset.rot); addToCart(p, sel.top, sel.bottom, 1);
    b.textContent = "✓ Added"; b.disabled = true; toast(title(p) + " added in your sizes (Top " + sel.top + " / Pants " + sel.bottom + ")");
  });

  /* ---------- Meaning band ---------- */
  $("#mTitle").innerHTML = "<em>" + C.word + ".</em>";
  $("#mVerse").textContent = "“" + C.verse + "”";
  $("#mRef").textContent = C.ref;
  $("#mTxt").textContent = C.meaning;
  var detailImg = imgs[1];
  $("#mImg").src = detailImg; $("#mImg").alt = title(P) + " detail";
  $(".meaning").style.setProperty("--c", C.hex);

  /* ---------- Reviews (sample content) ---------- */
  var REVIEWS = [
    { n: "Tasha M.", role: "RN, ICU", g: "Nurse", t: "Finally scrubs that feel like me", b: "I wear " + C.word + " on my hardest days. Patients ask about the verse on the sleeve and it starts the best conversations.", s: "Top M / Pants S", d: "2 weeks ago" },
    { n: "Kayla P.", role: "CNA", g: "CNA", t: "True to size, great pockets", b: "Ordered my usual medium top and small pants and they fit perfectly. Pockets hold my phone, pens and shears.", s: "Top M / Pants S", d: "3 weeks ago" },
    { n: "Daniel R.", role: "Paramedic", g: "Medic", t: "Survived a 14-hour shift", b: "The stretch is real. Squatting, lifting, running to calls, nothing rides up. Still looked clean at the end of the night.", s: "Top L / Pants L", d: "1 month ago" },
    { n: "Jasmine W.", role: "Dental Hygienist", g: "Dental", t: "Bought a second color the next week", b: "Soft, breathable and doesn't wrinkle. Now I have three colors in my rotation.", s: "Top S / Pants S", d: "1 month ago" },
    { n: "Monique A.", role: "RN, Labor & Delivery", g: "Nurse", t: "Color is even richer in person", b: "The " + C.color.toLowerCase() + " is gorgeous and hasn't faded after many washes. The embroidery still looks brand new.", s: "Top L / Pants M", d: "1 month ago" },
    { n: "Chris T.", role: "Surgical Tech", g: "CNA", t: "Feels premium", b: "Comparable to the big brands I've worn, at a better price, and it means something. Sizing is spot on.", s: "Top M / Pants M", d: "2 months ago" },
    { n: "Ashley R.", role: "Nurse Practitioner", g: "Nurse", t: "My go-to set", b: "Professional, comfortable and the fit is flattering without being tight. I get compliments every shift.", s: "Top S / Pants XS", d: "2 months ago" }
  ];
  var rRole = "all", rShown = 4;
  function renderReviews() {
    var list = REVIEWS.filter(function (r) { return rRole === "all" || r.g === rRole; });
    $("#rList").innerHTML = list.slice(0, rShown).map(function (r) {
      return '<article class="ritem"><div class="ritem__who"><strong>' + r.n + "</strong><span>" + r.role + '</span><span class="ver">✓ Verified buyer</span><span class="ritem__bought">Bought: ' + r.s + '</span></div><div><span class="stars">★★★★★</span><span class="ritem__date">' + r.d + "</span><h3>" + r.t + "</h3><p>" + r.b + "</p></div></article>";
    }).join("") || '<p class="muted">No reviews from this role yet.</p>';
    $("#moreRev").hidden = list.length <= rShown;
  }
  $$(".chip").forEach(function (c) { c.addEventListener("click", function () { $$(".chip").forEach(function (x) { x.classList.toggle("is-on", x === c); }); rRole = c.dataset.role; rShown = 4; renderReviews(); }); });
  $("#moreRev").addEventListener("click", function () { rShown += 4; renderReviews(); });
  $("#writeRev").addEventListener("click", function () { toast("Prototype: opens the review form (Judge.me / Okendo)"); });
  renderReviews();

  /* ---------- More colors grid ---------- */
  function cardHTML(p) {
    var c = COLORS[p.c];
    var b = p.isNew ? '<span class="badge badge--gold">New</span>' : (FF.BADGES[p.c] ? '<span class="badge">' + FF.BADGES[p.c] + "</span>" : "");
    return '<article class="card"><div class="card__media">' + b +
      '<a href="' + FF.url(p) + '" class="card__link" aria-label="' + title(p) + '"><img src="' + p.img + '" alt="' + title(p) + '" loading="lazy" width="760" height="1013"><img class="alt" src="' + p.img2 + '" alt="" loading="lazy" width="760" height="1013"></a></div>' +
      '<div class="card__body"><div class="card__top"><h3 class="card__name"><a href="' + FF.url(p) + '">' + title(p) + '</a></h3><span class="card__price">$' + PRICE + '</span></div><p class="card__verse">' + c.ref + "</p></div></article>";
  }
  $("#moreGrid").innerHTML = lineList.filter(function (c) { return c !== P.c; }).slice(0, 4).map(function (c) { return cardHTML(FF.sibling(P.line, c)); }).join("");

  /* ---------- Recently viewed ---------- */
  try {
    var rv = JSON.parse(localStorage.getItem("ff_recent") || "[]").filter(function (x) { return x !== P.id && FF.byId(x); });
    if (rv.length) {
      $("#recent").innerHTML = rv.slice(0, 6).map(function (x) { var p = FF.byId(x); return '<a href="' + FF.url(p) + '"><img src="' + p.img + '" alt="" loading="lazy">' + title(p) + "</a>"; }).join("");
      $("#recentWrap").hidden = false;
    }
    rv.unshift(P.id); localStorage.setItem("ff_recent", JSON.stringify(rv.slice(0, 8)));
  } catch (e) {}

  /* ---------- Announcement ---------- */
  var msgs = $$(".announce__msg"), mi = 0;
  setInterval(function () {
    if (document.body.classList.contains("notes-on")) return;
    var cur = msgs[mi]; cur.classList.remove("is-on"); cur.classList.add("is-out");
    mi = (mi + 1) % msgs.length; var nx = msgs[mi]; nx.classList.remove("is-out"); nx.classList.add("is-on");
    setTimeout(function () { cur.classList.remove("is-out"); }, 600);
  }, 4200);

  /* ---------- Header + sticky ATC ---------- */
  var header = $("#header"), satc = $("#satc"), atcRow = $("#atcRow");
  $("#sImg").src = P.img; $("#sTitle").textContent = title(P);
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
    var past = atcRow.getBoundingClientRect().bottom < 0;
    var foot = $(".footer").getBoundingClientRect().top < window.innerHeight;
    var on = past && !foot; satc.classList.toggle("is-on", on); satc.setAttribute("aria-hidden", !on);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Overlays ---------- */
  var scrim = $(".scrim"), openEl = null, lastFocus = null, sizesBack = false;
  function open(oid) {
    var el = document.getElementById(oid); if (!el) return;
    if (openEl && openEl !== el) close(true);
    lastFocus = document.activeElement;
    el.classList.add("is-on"); el.setAttribute("aria-hidden", "false"); scrim.classList.add("is-on");
    document.body.style.overflow = "hidden"; openEl = el;
    setTimeout(function () { var f = el.querySelector("input, button:not([data-close]), a"); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  function close(silent) {
    if (!openEl) return;
    openEl.classList.remove("is-on"); openEl.setAttribute("aria-hidden", "true"); openEl = null;
    if (!silent) { scrim.classList.remove("is-on"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus({ preventScroll: true }); }
  }
  document.addEventListener("click", function (e) {
    var o = e.target.closest("[data-open]"); if (o) { e.preventDefault(); open(o.dataset.open); return; }
    if (e.target.closest("[data-close]")) close();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { close(); lb.classList.remove("is-on"); } });

  /* ---------- Cart (shared with home page via localStorage) ---------- */
  var cart = FF.loadCart();
  function addToCart(p, t, b, n) {
    var key = p.id + "|" + t + "|" + b, ex = cart.filter(function (x) { return x.key === key; })[0];
    if (ex) ex.qty += n; else cart.push({ key: key, p: p, t: t, b: b, qty: n });
    renderCart(true);
  }
  function renderCart(bump) {
    FF.saveCart(cart);
    var n = cart.reduce(function (s, x) { return s + x.qty; }, 0);
    $$("[data-cart-count]").forEach(function (el) {
      el.textContent = n; el.classList.toggle("has", n > 0);
      if (bump && el.classList.contains("cart-count")) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    });
    $("#cartTotal").textContent = "$" + n * PRICE;
    $("#shipBar").style.width = n ? "100%" : "0";
    $("#shipMsg").innerHTML = n >= 2 ? "🙌 Your rotation is set. Free US shipping included" : n === 1 ? "🎉 Free US shipping unlocked. Most nurses own 2–3 sets for the week" : "🚚 Free US shipping on every order";
    if (!n) { $("#cartItems").innerHTML = '<div class="cart__empty"><p>Your cart is empty.</p></div>'; $("#checkoutBtn").disabled = true; return; }
    $("#checkoutBtn").disabled = false;
    $("#cartItems").innerHTML = cart.map(function (x, i) {
      return '<div class="ci"><img src="' + x.p.img + '" alt=""><div><h4>' + title(x.p) + "</h4><p>" + FF.lineLabel(x.p) + " " + x.p.type.toLowerCase() + " · Top " + x.t + " / Pants " + x.b + '</p><div class="qty"><button aria-label="Decrease" data-q="' + i + '|-1">−</button><span>' + x.qty + '</span><button aria-label="Increase" data-q="' + i + '|1">+</button></div><br><button class="ci__rm" data-rm="' + i + '">Remove</button></div><strong>$' + PRICE * x.qty + "</strong></div>";
    }).join("");
  }
  $("#cartItems").addEventListener("click", function (e) {
    var q = e.target.closest("[data-q]"), r = e.target.closest("[data-rm]");
    if (q) { var a = q.dataset.q.split("|"); cart[+a[0]].qty += +a[1]; if (cart[+a[0]].qty < 1) cart.splice(+a[0], 1); renderCart(); }
    if (r) { cart.splice(+r.dataset.rm, 1); renderCart(); }
  });
  $("#checkoutBtn").addEventListener("click", function () { toast("Prototype: this goes to Shopify checkout on the live store"); });
  renderCart();

  /* ---------- Search ---------- */
  var sIn = $("#searchInput"), sRes = $("#searchRes");
  sIn.addEventListener("input", function () {
    var q = sIn.value.trim().toLowerCase();
    if (!q) { sRes.innerHTML = ""; return; }
    var hits = FF.PRODUCTS.filter(function (p) { var c = COLORS[p.c]; return (c.word + " " + c.color + " " + p.line + " " + p.type).toLowerCase().indexOf(q) > -1; }).slice(0, 6);
    sRes.innerHTML = hits.length ? hits.map(function (p) {
      return '<a class="sr-item" href="' + FF.url(p) + '"><img src="' + p.img + '" alt=""><span><strong>' + title(p) + "</strong><small>" + (p.line === "men" ? "Men" : p.line === "wide" ? "Women · Wide leg" : "Women") + "</small></span><span>$" + PRICE + "</span></a>";
    }).join("") : '<p class="muted small">No match. Try a color like "navy" or "teal".</p>';
  });

  /* ---------- Email / popup ---------- */
  $$("[data-email]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault(); try { sessionStorage.setItem("ff_popup", "1"); } catch (err) {}
      f.innerHTML = '<p style="margin:0;font-weight:600">You\'re in. Your code <span style="color:var(--gold)">FAITH15</span> is on its way. 🙏</p>';
      setTimeout(close, 2200);
    });
  });
  function seen() { try { return sessionStorage.getItem("ff_popup"); } catch (e) { return "1"; } }
  document.addEventListener("mouseout", function (e) {
    if (e.relatedTarget || e.clientY > 8 || seen() || openEl || document.body.classList.contains("notes-on")) return;
    try { sessionStorage.setItem("ff_popup", "1"); } catch (err) {} open("popup");
  });

  /* ---------- Toast ---------- */
  var tEl = $("#toast"), tT;
  function toast(m) { tEl.textContent = m; tEl.classList.add("is-on"); clearTimeout(tT); tT = setTimeout(function () { tEl.classList.remove("is-on"); }, 2800); }

  /* ---------- CRO notes ---------- */
  $$("[data-note]").forEach(function (s) {
    var d = document.createElement("div"); d.className = "note-badge"; d.setAttribute("role", "note");
    d.innerHTML = "<b>" + s.dataset.note + "</b>" + s.dataset.noteText;
    if (s.closest(".buy")) s.insertAdjacentElement("afterend", d); else s.appendChild(d);
  });
  var nt = $("#notesToggle");
  nt.addEventListener("click", function () {
    var on = document.body.classList.toggle("notes-on");
    nt.setAttribute("aria-pressed", on); $(".notes-toggle__txt", nt).textContent = on ? "Hide CRO notes" : "Show CRO notes";
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
  if (/[?&]notes=1/.test(location.search)) nt.click();

  /* ---------- Motion ---------- */
  (function () {
    if (!window.gsap || !window.ScrollTrigger || reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    gsap.from(".gallery__main", { opacity: 0, scale: .98, duration: .9, ease: "power3.out" });
    gsap.from(".buy__inner > *", { y: 18, opacity: 0, duration: .7, stagger: .04, ease: "power3.out", delay: .1 });
    gsap.utils.toArray(".meaning__copy, .previews__side, .best--pdp .sec-head, .faq__head").forEach(function (el) {
      gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    });
    gsap.from(".meaning__img img", { scale: 1.15, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: ".meaning", start: "top 75%", once: true } });
    gsap.from("#moreGrid .card", { y: 40, opacity: 0, duration: .8, stagger: .06, ease: "power3.out", scrollTrigger: { trigger: "#moreGrid", start: "top 88%", once: true } });
  })();
})();
