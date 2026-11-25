/* FaithFits — home page concept interactions */
(function () {
  "use strict";

  /* ---------- Data (names, colors and photos from faithfitswear.com) ---------- */
  var COLORS = {
    maroon:   { word: "Chosen",    color: "Maroon",        hex: "#6b1d2c", ref: "1 Peter 2:9",          verse: "But ye are a chosen generation, a royal priesthood." },
    ceil:     { word: "Covered",   color: "Ceil Blue",     hex: "#6fa0d6", ref: "Psalm 91:4",           verse: "He shall cover thee with his feathers, and under his wings shalt thou trust." },
    navy:     { word: "Anchored",  color: "Navy Blue",     hex: "#1f2a48", ref: "Hebrews 6:19",         verse: "Which hope we have as an anchor of the soul, both sure and stedfast." },
    black:    { word: "Blessed",   color: "Black",         hex: "#151515", ref: "Numbers 6:24",         verse: "The Lord bless thee, and keep thee." },
    red:      { word: "Redeemed",  color: "Red",           hex: "#d42037", ref: "Ephesians 1:7",        verse: "In whom we have redemption through his blood." },
    pink:     { word: "Loved",     color: "Pink",          hex: "#e9a3b4", ref: "1 John 4:19",          verse: "We love him, because he first loved us." },
    purple:   { word: "Crowned",   color: "Purple",        hex: "#6a4bb0", ref: "Psalm 103:4",          verse: "Who crowneth thee with lovingkindness and tender mercies." },
    teal:     { word: "Called",    color: "Teal",          hex: "#1fb2b6", ref: "Romans 8:28",          verse: "All things work together for good… to them who are the called." },
    gray:     { word: "Rooted",    color: "Gray",          hex: "#b0aca6", ref: "Colossians 2:7",       verse: "Rooted and built up in him, and stablished in the faith." },
    charcoal: { word: "Steadfast", color: "Charcoal Gray", hex: "#45464a", ref: "1 Corinthians 15:58",  verse: "Be ye stedfast, unmoveable, always abounding in the work of the Lord." },
    royal:    { word: "Faithful",  color: "Royal Blue",    hex: "#1f6fd1", ref: "Lamentations 3:23",    verse: "They are new every morning: great is thy faithfulness." },
    green:    { word: "Grounded",  color: "Green",         hex: "#1d5a44", ref: "Ephesians 3:17",       verse: "That ye, being rooted and grounded in love…" },
    coral:    { word: "Clothed",   color: "Coral",         hex: "#ef8a7e", ref: "Colossians 3:12",      verse: "Put on… a heart of compassion, kindness, humility." }
  };
  var ORDER = ["maroon", "ceil", "navy", "black", "red", "pink", "purple", "teal", "gray", "charcoal", "royal"];
  var WIDE = ["royal", "teal", "navy", "maroon", "green", "coral"];
  var BADGES = { maroon: "Best seller", navy: "Best seller", ceil: "Most loved", black: "Best seller" };

  var PRODUCTS = [];
  ORDER.forEach(function (c, i) {
    PRODUCTS.push({ id: "w-" + c, line: "women", c: c, img: "images/w-" + c + ".jpg", img2: "images/w-" + c + "-2.jpg", type: "Jogger set", rank: i });
    PRODUCTS.push({ id: "m-" + c, line: "men", c: c, img: "images/m-" + c + ".jpg", img2: "images/m-" + c + "-2.jpg", type: "Jogger set", rank: i });
  });
  WIDE.forEach(function (c, i) {
    PRODUCTS.push({ id: "wl-" + c, line: "wide", c: c, img: "images/wl-" + c + ".jpg", img2: "images/wl-" + c + "-2.jpg", type: "Wide leg set", rank: i, isNew: true });
  });
  var PRICE = 120;
  function byId(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function title(p) { var c = COLORS[p.c]; return c.word + " in " + c.color; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Announcement rotator ---------- */
  var msgs = $$(".announce__msg"), mi = 0;
  setInterval(function () {
    if (document.body.classList.contains("notes-on")) return;
    var cur = msgs[mi]; cur.classList.remove("is-on"); cur.classList.add("is-out");
    mi = (mi + 1) % msgs.length;
    var nx = msgs[mi]; nx.classList.remove("is-out"); nx.classList.add("is-on");
    setTimeout(function () { cur.classList.remove("is-out"); }, 600);
  }, 4200);

  /* ---------- Header + mobile bar on scroll ---------- */
  var header = $("#header"), mbar = $("#mbar"), heroEl = $(".hero");
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 10);
    var past = heroEl.getBoundingClientRect().bottom < 0;
    var footer = $(".footer").getBoundingClientRect().top < window.innerHeight;
    mbar.classList.toggle("is-on", past && !footer);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Product grid ---------- */
  var grid = $("#productGrid"), currentTab = "women";
  function dotsFor(p) {
    var list = p.line === "wide" ? WIDE : ORDER;
    var html = list.slice(0, 5).map(function (c) {
      return '<button class="dot' + (c === p.c ? " is-on" : "") + '" style="--c:' + COLORS[c].hex + '" aria-label="' + COLORS[c].color + '" data-swap="' + p.line + '|' + c + '"></button>';
    }).join("");
    return html + "<small>+" + (list.length - 5) + "</small>";
  }
  function cardHTML(p) {
    var c = COLORS[p.c];
    var badge = p.isNew ? '<span class="badge badge--gold">New</span>' : (BADGES[p.c] ? '<span class="badge">' + BADGES[p.c] + "</span>" : "");
    return '<article class="card" data-id="' + p.id + '">' +
      '<div class="card__media">' + badge +
        '<img src="' + p.img + '" alt="' + title(p) + ' ' + p.type + '" loading="lazy" width="760" height="1013">' +
        '<img class="alt" src="' + p.img2 + '" alt="" loading="lazy" width="760" height="1013">' +
        '<button class="card__add" data-quick="' + p.id + '">+ Quick add</button>' +
      "</div>" +
      '<div class="card__body">' +
        '<div class="card__top"><h3 class="card__name"><button data-quick="' + p.id + '">' + title(p) + '</button></h3><span class="card__price">$' + PRICE + "</span></div>" +
        '<p class="card__verse">' + c.ref + "</p>" +
        '<div class="card__dots">' + dotsFor(p) + "</div>" +
        '<div class="card__rate"><span class="stars">★★★★★</span>' + p.type + " · top + pants</div>" +
      "</div></article>";
  }
  function renderGrid(tab, animate) {
    currentTab = tab;
    var items = PRODUCTS.filter(function (p) { return p.line === tab; }).sort(function (a, b) { return a.rank - b.rank; }).slice(0, 8);
    grid.innerHTML = items.map(cardHTML).join("");
    $$(".tab").forEach(function (t) { var on = t.dataset.tab === tab; t.classList.toggle("is-on", on); t.setAttribute("aria-selected", on); });
    if (animate && window.gsap && !reduce) {
      gsap.fromTo(grid.children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .05, ease: "power3.out" });
    }
  }
  renderGrid("women");
  $$(".tab").forEach(function (t) { t.addEventListener("click", function () { renderGrid(t.dataset.tab, true); }); });
  grid.addEventListener("click", function (e) {
    var sw = e.target.closest("[data-swap]");
    if (sw) {
      var parts = sw.dataset.swap.split("|"); var prod = byId((parts[0] === "wide" ? "wl-" : parts[0][0] + "-") + parts[1]);
      var card = sw.closest(".card"); var tmp = document.createElement("div"); tmp.innerHTML = cardHTML(prod);
      card.replaceWith(tmp.firstChild); return;
    }
  });
  $$("[data-tab-link]").forEach(function (a) {
    a.addEventListener("click", function () { renderGrid(a.dataset.tabLink, true); });
  });

  /* ---------- Find your calling color ---------- */
  var swWrap = $("#swatches"), cg = "w", cc = "maroon";
  swWrap.innerHTML = ORDER.map(function (c) {
    var o = COLORS[c];
    return '<button class="sw' + (c === cc ? " is-on" : "") + '" role="radio" aria-checked="' + (c === cc) + '" style="--c:' + o.hex + '" data-c="' + c + '" aria-label="' + o.word + " in " + o.color + '"><span>' + o.word + "</span></button>";
  }).join("");
  $("#menuColors").innerHTML = ORDER.map(function (c) {
    return '<a class="sw" href="#calling" style="--c:' + COLORS[c].hex + '" data-menu-c="' + c + '" data-close aria-label="' + COLORS[c].color + '"></a>';
  }).join("");
  function setCalling(c, g) {
    cc = c || cc; cg = g || cg;
    var o = COLORS[cc], img = $("#callingImg");
    var src = "images/" + cg + "-" + cc + ".jpg";
    $$(".sw", swWrap).forEach(function (b) { var on = b.dataset.c === cc; b.classList.toggle("is-on", on); b.setAttribute("aria-checked", on); });
    $$(".pill").forEach(function (b) { b.classList.toggle("is-on", b.dataset.cg === cg); });
    $(".calling").style.setProperty("--glow", o.hex);
    function swap() {
      img.src = src; img.alt = o.word + " in " + o.color + " scrub set";
      $("#callingName").textContent = o.word + " in " + o.color;
      $("#callingVerse").textContent = "“" + o.verse + "”";
      $("#callingRef").textContent = o.ref;
      $("#callingAdd").textContent = "Choose size · " + o.word + " in " + o.color;
    }
    if (window.gsap && !reduce) {
      gsap.to([img, ".calling__card"], { opacity: 0, y: 10, duration: .2, onComplete: function () {
        swap();
        var done = function () { gsap.to([img, ".calling__card"], { opacity: 1, y: 0, duration: .45, ease: "power3.out" }); };
        if (img.complete) done(); else img.onload = done;
      } });
    } else swap();
  }
  swWrap.addEventListener("click", function (e) { var b = e.target.closest(".sw"); if (b) setCalling(b.dataset.c); });
  swWrap.addEventListener("keydown", function (e) {
    if (["ArrowRight", "ArrowLeft"].indexOf(e.key) < 0) return;
    var i = ORDER.indexOf(cc) + (e.key === "ArrowRight" ? 1 : -1); i = (i + ORDER.length) % ORDER.length;
    setCalling(ORDER[i]); $$(".sw", swWrap)[i].focus(); e.preventDefault();
  });
  $$(".pill").forEach(function (b) { b.addEventListener("click", function () { setCalling(null, b.dataset.cg); }); });
  $("#callingAdd").addEventListener("click", function () { openQuick((cg === "w" ? "w-" : "m-") + cc); });
  document.addEventListener("click", function (e) { var m = e.target.closest("[data-menu-c]"); if (m) setCalling(m.dataset.menuC); });
  // preload calling images on idle
  window.addEventListener("load", function () { setTimeout(function () { ORDER.forEach(function (c) { new Image().src = "images/w-" + c + ".jpg"; }); }, 1500); });

  /* ---------- Hotspots ---------- */
  var HS = [
    ["Scripture on the sleeve", "Every top carries a verse embroidered on the sleeve, like Mark 10:45, so the reminder goes wherever you go."],
    ["The FF badge", "A woven FF badge on the chest pocket: a quiet signature colleagues and patients notice."],
    ["Fabric you can feel", "72% polyester, 21% rayon, 7% spandex woven twill. Breathable, anti-microbial and four-way stretch."]
  ];
  var pop = $("#hsPop");
  $$(".hotspot").forEach(function (h) {
    h.addEventListener("click", function () {
      var on = h.classList.contains("is-on");
      $$(".hotspot").forEach(function (x) { x.classList.remove("is-on"); });
      if (on) { pop.classList.remove("is-on"); return; }
      h.classList.add("is-on");
      var d = HS[+h.dataset.hs]; pop.innerHTML = "<strong>" + d[0] + "</strong>" + d[1]; pop.classList.add("is-on");
    });
  });

  /* ---------- Reviews nav ---------- */
  var track = $("#revTrack");
  $$("[data-rev]").forEach(function (b) {
    b.addEventListener("click", function () { var card = track.children[0].getBoundingClientRect().width + 18; track.scrollBy({ left: card * +b.dataset.rev, behavior: "smooth" }); });
  });

  /* ---------- Fit finder ---------- */
  var SIZES = ["XS", "S", "M", "L", "XL"], fitForm = $("#fitForm");
  function fit() {
    var i = SIZES.indexOf(fitForm.top.value) + (+fitForm.querySelector("[name=feel]:checked").value);
    i = Math.min(i, 4);
    var relaxed = fitForm.querySelector("[name=feel]:checked").value === "1";
    $("#fitOut").innerHTML = "Your FaithFits size: <strong>" + SIZES[i] + "</strong>" + (relaxed && i === 4 && fitForm.top.value === "XL" ? " <small>(our largest size)</small>" : relaxed ? " <small>(one size up for a relaxed feel)</small>" : " <small>(true to size)</small>");
  }
  fitForm.addEventListener("change", fit); fit();

  /* ---------- Overlays ---------- */
  var scrim = $(".scrim"), openEl = null, lastFocus = null;
  function open(id) {
    var el = document.getElementById(id); if (!el) return;
    if (openEl && openEl !== el) close(true);
    lastFocus = document.activeElement;
    el.classList.add("is-on"); el.setAttribute("aria-hidden", "false"); scrim.classList.add("is-on");
    document.body.style.overflow = "hidden"; openEl = el;
    setTimeout(function () { var f = el.querySelector("input, button:not([data-close]), a"); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  function close(silent) {
    if (!openEl) return;
    openEl.classList.remove("is-on"); openEl.setAttribute("aria-hidden", "true");
    openEl = null;
    if (!silent) { scrim.classList.remove("is-on"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus({ preventScroll: true }); }
  }
  document.addEventListener("click", function (e) {
    var o = e.target.closest("[data-open]"); if (o) { e.preventDefault(); if (o.dataset.open === "sizes" && openEl && openEl.id === "quick") { sizesFromQuick = true; } open(o.dataset.open); return; }
    var q = e.target.closest("[data-quick]"); if (q) { openQuick(q.dataset.quick); return; }
    if (e.target.closest("[data-close]")) {
      if (sizesFromQuick && openEl && openEl.id === "sizes") { sizesFromQuick = false; open("quick"); return; }
      close();
    }
  });
  var sizesFromQuick = false;
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  /* ---------- Quick add ---------- */
  var qp = null, sel = { top: null, bottom: null };
  $$("[data-size]").forEach(function (box) {
    box.innerHTML = SIZES.map(function (s) { return "<button type=\"button\" data-s=\"" + s + "\">" + s + "</button>"; }).join("");
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      $$("button", box).forEach(function (x) { x.classList.toggle("is-on", x === b); });
      sel[box.dataset.size] = b.dataset.s;
      // auto-suggest matching pants size
      if (box.dataset.size === "top" && !sel.bottom) {
        var bb = $("[data-size=bottom] [data-s=" + b.dataset.s + "]"); if (bb) { bb.classList.add("is-on"); sel.bottom = b.dataset.s; }
      }
      updateQBtn();
    });
  });
  function updateQBtn() {
    var btn = $("#qAdd"), ok = sel.top && sel.bottom;
    btn.disabled = !ok; btn.textContent = ok ? "Add to cart · $" + PRICE : (sel.top ? "Select pants size" : "Select your sizes");
  }
  function openQuick(id) {
    qp = byId(id); if (!qp) return; var c = COLORS[qp.c];
    sel = { top: null, bottom: null }; $$("[data-size] button").forEach(function (x) { x.classList.remove("is-on"); });
    $("#qImg").src = qp.img; $("#qImg").alt = title(qp);
    $("#qTitle").textContent = title(qp) + (qp.line === "wide" ? " Wide Leg" : "");
    $("#qRef").textContent = c.ref + " · " + (qp.line === "men" ? "Men's " : "Women's ") + qp.type.toLowerCase();
    updateQBtn(); open("quick");
  }
  $("#qAdd").addEventListener("click", function () { if (!qp) return; addToCart(qp, sel.top, sel.bottom); close(); setTimeout(function () { open("cart"); }, 250); });

  /* ---------- Cart ---------- */
  var cart = [];
  function addToCart(p, t, b) {
    var key = p.id + "|" + t + "|" + b, ex = cart.filter(function (x) { return x.key === key; })[0];
    if (ex) ex.qty++; else cart.push({ key: key, p: p, t: t, b: b, qty: 1 });
    renderCart(true);
  }
  function renderCart(bump) {
    var n = cart.reduce(function (s, x) { return s + x.qty; }, 0), total = n * PRICE;
    $$("[data-cart-count]").forEach(function (el) {
      el.textContent = n; el.classList.toggle("has", n > 0);
      if (bump && el.classList.contains("cart-count")) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    });
    $("#cartTotal").textContent = "$" + total;
    $("#shipBar").style.width = n ? "100%" : "0";
    $("#shipMsg").innerHTML = n >= 2 ? "🙌 Your rotation is set. Free US shipping included" : n === 1 ? "🎉 Free US shipping unlocked. Most nurses own 2–3 sets for the week" : "🚚 Free US shipping on every order";
    var items = $("#cartItems");
    if (!n) {
      items.innerHTML = '<div class="cart__empty"><p>Your cart is empty.</p><a class="btn btn--dark" href="#bestsellers" data-close>Shop best sellers</a></div>';
      $("#cartUpsell").innerHTML = ""; $("#checkoutBtn").disabled = true; return;
    }
    $("#checkoutBtn").disabled = false;
    items.innerHTML = cart.map(function (x, i) {
      return '<div class="ci"><img src="' + x.p.img + '" alt=""><div><h4>' + title(x.p) + "</h4><p>" + (x.p.line === "men" ? "Men's " : "Women's ") + x.p.type.toLowerCase() + " · Top " + x.t + " / Pants " + x.b + '</p><div class="qty"><button aria-label="Decrease" data-q="' + i + '|-1">−</button><span>' + x.qty + '</span><button aria-label="Increase" data-q="' + i + '|1">+</button></div><br><button class="ci__rm" data-rm="' + i + '">Remove</button></div><strong>$' + PRICE * x.qty + "</strong></div>";
    }).join("");
    // upsell: a complementary color for the same line
    var have = cart.map(function (x) { return x.p.c; }), line = cart[0].p.line;
    var pool = (line === "wide" ? WIDE : ORDER).filter(function (c) { return have.indexOf(c) < 0; });
    var pick = pool.slice(0, 2).map(function (c) { return byId((line === "wide" ? "wl-" : line[0] + "-") + c); });
    $("#cartUpsell").innerHTML = '<p class="eyebrow" style="margin:14px 0 0">Complete your rotation</p>' + pick.map(function (p) {
      return '<div class="up"><img src="' + p.img + '" alt=""><p><strong>' + title(p) + "</strong><small>" + COLORS[p.c].ref + " · $" + PRICE + '</small></p><button class="btn btn--line" data-quick="' + p.id + '">Add</button></div>';
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
  function search(q) {
    q = (q || "").trim().toLowerCase();
    if (!q) { sRes.innerHTML = ""; return; }
    var hits = PRODUCTS.filter(function (p) { var c = COLORS[p.c]; return (c.word + " " + c.color + " " + p.line + " " + p.type + " " + (p.line === "wide" ? "wide leg women" : "")).toLowerCase().indexOf(q) > -1; }).slice(0, 6);
    sRes.innerHTML = hits.length ? hits.map(function (p) {
      return '<button class="sr-item" data-quick="' + p.id + '"><img src="' + p.img + '" alt=""><span><strong>' + title(p) + "</strong><small>" + (p.line === "men" ? "Men" : p.line === "wide" ? "Women · Wide leg" : "Women") + " · " + COLORS[p.c].ref + "</small></span><span>$" + PRICE + "</span></button>";
    }).join("") : '<p class="muted small">No match. Try a color like "navy" or "teal".</p>';
  }
  sIn.addEventListener("input", function () { search(sIn.value); });
  $$("[data-q]", $("#search")).forEach(function (b) { b.addEventListener("click", function () { sIn.value = b.dataset.q; search(b.dataset.q); }); });

  /* ---------- Email forms ---------- */
  $$("[data-email]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      try { sessionStorage.setItem("ff_popup", "1"); } catch (err) {}
      f.innerHTML = '<p style="margin:0;font-weight:600">You\'re in. Your code <span style="color:var(--gold-2)">FAITH15</span> is on its way. 🙏</p>';
      if (openEl && openEl.id === "popup") setTimeout(close, 2200);
    });
  });

  /* ---------- Welcome popup: after 30s or exit intent, once per session ---------- */
  function seen() { try { return sessionStorage.getItem("ff_popup"); } catch (e) { return "1"; } }
  function showPopup() { if (seen() || openEl || document.body.classList.contains("notes-on")) return; try { sessionStorage.setItem("ff_popup", "1"); } catch (e) {} open("popup"); }
  setTimeout(showPopup, 30000);
  document.addEventListener("mouseout", function (e) { if (!e.relatedTarget && e.clientY < 8) showPopup(); });

  /* ---------- Toast ---------- */
  var tEl = $("#toast"), tT;
  function toast(m) { tEl.textContent = m; tEl.classList.add("is-on"); clearTimeout(tT); tT = setTimeout(function () { tEl.classList.remove("is-on"); }, 2800); }

  /* ---------- CRO notes ---------- */
  $$("[data-note]").forEach(function (s) {
    var d = document.createElement("div"); d.className = "note-badge"; d.setAttribute("role", "note");
    d.innerHTML = "<b>" + s.dataset.note + "</b>" + s.dataset.noteText; s.appendChild(d);
  });
  var nt = $("#notesToggle");
  nt.addEventListener("click", function () {
    var on = document.body.classList.toggle("notes-on");
    nt.setAttribute("aria-pressed", on); $(".notes-toggle__txt", nt).textContent = on ? "Hide CRO notes" : "Show CRO notes";
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
  if (/[?&]notes=1/.test(location.search)) nt.click();

  /* ---------- Motion (GSAP) ---------- */
  (function motion() {
    if (!window.gsap || !window.ScrollTrigger || reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    document.fonts && document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero__title .line > span", { yPercent: 110, duration: 1.1, stagger: .12 })
      .from(".hero__copy .reveal", { y: 18, opacity: 0, duration: .8, stagger: .08 }, "-=.7")
      .from(".hero__media img", { scale: 1.08, duration: 1.6, ease: "power2.out" }, 0)
      .from(".hero__tag", { y: 14, opacity: 0, duration: .6, stagger: .15 }, "-=.9");
    gsap.to(".hero__media img", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    gsap.utils.toArray(".sec-head, .detail__copy, .story__copy, .fit__card, .faq__head, .email__inner, .final__copy, .compare .table").forEach(function (el) {
      gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    });
    gsap.from(".cat", { y: 60, opacity: 0, duration: 1, stagger: .12, ease: "power3.out", scrollTrigger: { trigger: ".cats__grid", start: "top 85%", once: true } });
    gsap.from("#productGrid .card", { y: 40, opacity: 0, duration: .8, stagger: .06, ease: "power3.out", scrollTrigger: { trigger: "#productGrid", start: "top 85%", once: true } });
    gsap.from(".rev", { x: 60, opacity: 0, duration: .9, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: "#revTrack", start: "top 85%", once: true } });
    gsap.from(".calling__stage", { clipPath: "inset(12% 12% 12% 12% round 24px)", duration: 1.3, ease: "power3.out", scrollTrigger: { trigger: ".calling", start: "top 70%", once: true } });
    gsap.from("#swatches", { y: 20, opacity: 0, duration: .8, ease: "power3.out", scrollTrigger: { trigger: "#swatches", start: "top 92%", once: true } });
    gsap.from(".detail__media img", { scale: 1.15, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: ".detail", start: "top 75%", once: true } });
    gsap.from(".tr", { x: -20, opacity: 0, duration: .6, stagger: .06, scrollTrigger: { trigger: ".table", start: "top 85%", once: true } });
    gsap.to(".final__img", { yPercent: -6, ease: "none", scrollTrigger: { trigger: ".final", start: "top bottom", end: "bottom top", scrub: true } });
  })();
})();
