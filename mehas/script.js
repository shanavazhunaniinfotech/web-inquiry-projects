/* MEHAS prototype — shared logic for home + product page */
(function () {
  "use strict";

  /* ---------------- Data (real products from mehas.com) ---------------- */
  var CUR = "AED";
  var GIFT_AT = 400; // complimentary 10 mL travel spray threshold (proposal)
  var PRODUCTS = {
    monarch: {
      id: "monarch", name: "Monarch", tagline: "Leave a legacy", tone: "#7b2430", toneBg: "#4a1820",
      family: "Oriental · Amber", price: 200, rating: 4.9, reviews: 128,
      img: "images/monarch.jpg", box: "images/monarch-box.jpg", mood: "images/desert.jpg",
      short: "Smoky, syrupy vanilla wrapped in incense and refined woods.",
      desc: "A rich oriental-amber composition built around an elegant, smoky and syrupy vanilla. Incense adds depth and mystery, while a refined woody heart gives the fragrance structure before melting into its warm vanilla drydown.",
      story: "Monarch is crafted to leave behind a legacy, inspired by the timeless grandeur of royal dynasties. Its elegant, commanding sillage fills the room with distinction, lingering like the memory of kings and queens long after they have departed.",
      notes: { top: "Incense, smoked resin", heart: "Refined woods", base: "Syrupy vanilla, warm amber" },
      noteTiles: [["Opening", "Incense", "Smoke and resin that announce you before you speak."], ["Heart", "Refined woods", "A polished, structured core that gives Monarch its posture."], ["Drydown", "Vanilla & amber", "A warm, syrupy finish that lingers for hours."]],
      noteImgs: ["images/desert.jpg", "images/atelier.jpg", "images/monarch-box.jpg"],
      character: { longevity: [5, "10–12 h"], sillage: [5, "Room-filling"], intensity: [4, "Rich"] },
      wear: "Evenings, weddings, majlis gatherings", season: "Autumn · Winter", vibe: "Regal, magnetic"
    },
    silverback: {
      id: "silverback", name: "Silverback", tagline: "Strength. Composure. Presence.", tone: "#2433a8", toneBg: "#141c5c",
      family: "Marine · Woody", price: 200, rating: 4.8, reviews: 96,
      img: "images/silverback.jpg", box: "images/silverback-box.jpg", mood: "images/ocean.jpg",
      short: "Fresh citrus and salty ocean air over suede and mineral amber.",
      desc: "A bold marine-woody composition that opens with fresh citrus and crisp, salty ocean air. Smooth suede adds refined depth, while mineral amber and earthy woods create a powerful, oceanic drydown.",
      story: "Silverback was forged to embody strength, composure and refinement, leaving behind a commanding presence of strength, power, and calmness.",
      notes: { top: "Fresh citrus, salty sea air", heart: "Smooth suede", base: "Mineral amber, earthy woods" },
      noteTiles: [["Opening", "Citrus & sea air", "Crisp, salty and instantly clean."], ["Heart", "Suede", "Soft, refined depth that keeps it grown-up."], ["Drydown", "Mineral amber", "Earthy woods and amber for a calm, powerful trail."]],
      noteImgs: ["images/ocean.jpg", "images/silverback-box.jpg", "images/atelier.jpg"],
      character: { longevity: [4, "8–10 h"], sillage: [4, "Strong"], intensity: [3, "Balanced"] },
      wear: "Daytime, the office, warm weather", season: "Spring · Summer", vibe: "Calm, assured"
    },
    "beast-mode": {
      id: "beast-mode", name: "Beast Mode", tagline: "Make your presence unmissable", tone: "#c3161f", toneBg: "#1f1416",
      family: "Fruity · Floral · Woody", price: 200, rating: 4.9, reviews: 112,
      img: "images/beast-mode.jpg", box: "images/beast-mode-box.jpg", mood: "images/citrus.jpg",
      short: "Grapefruit, crisp apple and geranium over woods and musk.",
      desc: "A high-impact fruity-floral composition that opens with vibrant grapefruit, crisp apple and fresh geranium. As it develops, the fragrance becomes sweeter and more floral before settling into a rich, woody and musky drydown.",
      story: "Beast Mode is built to fill the room with an unmistakable presence, ensuring that the moment you walk in, everyone knows you are there.",
      notes: { top: "Grapefruit, crisp apple, geranium", heart: "Sweet florals", base: "Rich woods, musk" },
      noteTiles: [["Opening", "Grapefruit & apple", "A bright, juicy burst with a green geranium edge."], ["Heart", "Sweet florals", "It warms and blooms as it settles on skin."], ["Drydown", "Woods & musk", "Rich, sensual and built to be noticed."]],
      noteImgs: ["images/citrus.jpg", "images/beast-mode-box.jpg", "images/atelier.jpg"],
      character: { longevity: [4, "8–10 h"], sillage: [5, "Room-filling"], intensity: [5, "Bold"] },
      wear: "Nights out, celebrations, statement days", season: "All year", vibe: "Bold, energetic"
    }
  };
  var ORDER = ["monarch", "silverback", "beast-mode"];
  var SETS = {
    trilogy: { id: "trilogy", name: "The Trilogy", sub: "All three · 100 mL each", price: 540, was: 600, img: "images/monarch-box.jpg" },
    discovery: { id: "discovery", name: "Discovery Set", sub: "3 × 10 mL · AED 95 credit on a full bottle", price: 95, img: "images/silverback-box.jpg" }
  };

  /* ---------------- Helpers ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return CUR + " " + n.toLocaleString("en-US"); };
  var I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 7h18M3 12h18M3 17h12"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    arrow: '<svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M0 5h15M11 1l4 4-4 4"/></svg>',
    chevL: '<svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M7 1 2 6l5 5"/></svg>',
    chevR: '<svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" stroke-width="1.3"><path d="m1 1 5 5-5 5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m4 12 5 5L20 6"/></svg>',
    truck: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 8h16v14H3zM19 13h6l4 5v4h-10"/><circle cx="9" cy="24" r="2.5"/><circle cx="24" cy="24" r="2.5"/></svg>',
    gift: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 13h22v15H5zM3 9h26v4H3zM16 9v19"/><path d="M16 9c-2-4-7-5-7-2s4 2 7 2Zm0 0c2-4 7-5 7-2s-4 2-7 2Z"/></svg>',
    shield: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M16 3 5 7v8c0 7 5 12 11 14 6-2 11-7 11-14V7L16 3Z"/><path d="m11 16 4 4 7-8"/></svg>',
    card: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="7" width="26" height="18" rx="2"/><path d="M3 12h26M7 20h6"/></svg>',
    drop: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M16 3s9 10 9 16a9 9 0 0 1-18 0c0-6 9-16 9-16Z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="10" width="14" height="10" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    wa: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5v-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.7.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.3.2-1.5l-.5-.2Z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v7h4v-7h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="14"/><path d="m3 6 9 7 9-7"/></svg>'
  };
  var stars = function (n) { var s = ""; for (var i = 0; i < 5; i++) s += I.star; return '<span class="stars" aria-label="' + n + ' out of 5 stars">' + s + "</span>"; };
  var pdpUrl = function (id) { return "product.html?p=" + id; };

  /* ---------------- Shared chrome ---------------- */
  var ANNOUNCE = [
    "Free express delivery across the UAE — Dubai &amp; Abu Dhabi next day",
    "Pay in 4 interest-free instalments with Tabby or Tamara",
    'Not sure yet? <a href="index.html#discovery">Try all three with the Discovery Set</a>',
    "Complimentary gift wrapping &amp; handwritten note on every order"
  ];

  function chrome() {
    var a = $("[data-announce]");
    if (a) {
      a.innerHTML = '<div class="announce" role="region" aria-label="Announcements"><button class="announce__nav announce__nav--prev" aria-label="Previous message">' + I.chevL + '</button><div class="announce__track">' +
        ANNOUNCE.map(function (t, i) { return '<p class="announce__item' + (i ? "" : " is-on") + '" style="margin:0">' + t + "</p>"; }).join("") +
        '</div><button class="announce__nav announce__nav--next" aria-label="Next message">' + I.chevR + "</button></div>";
    }
    var h = $("[data-header]");
    if (h) {
      var cards = ORDER.map(function (id) { var p = PRODUCTS[id]; return '<a class="mega__card" href="' + pdpUrl(id) + '"><div class="ph"><img src="' + p.img + '" alt="' + p.name + ' bottle" loading="lazy"></div><strong>' + p.name + "</strong><span>" + p.family + " · " + money(p.price) + "</span></a>"; }).join("");
      h.outerHTML =
        '<header class="header" id="top"><div class="wrap header__inner">' +
        '<div class="header__left"><button class="icon-btn menu-toggle" aria-label="Open menu" data-open-mnav>' + I.menu + "</button>" +
        '<nav class="nav" aria-label="Primary"><button aria-expanded="false" aria-controls="mega" data-mega>Fragrances</button><a href="index.html#discovery">Sets &amp; Gifts</a><a href="index.html#finder">Scent Finder</a><a href="index.html#story">Our Story</a></nav></div>' +
        '<a class="logo" href="index.html" aria-label="MEHAS home"><img src="images/logo.png" alt="MEHAS" width="600" height="165"></a>' +
        '<div class="header__tools"><button class="icon-btn" aria-label="Search" data-open-search>' + I.search + '</button><a class="icon-btn hide-m" href="#" aria-label="Account" data-noop>' + I.user + '</a><button class="icon-btn" aria-label="Open bag" data-open-cart>' + I.bag + '<span class="cart-count" data-count>0</span></button></div>' +
        "</div>" +
        '<div class="mega" id="mega"><div class="mega__inner"><div class="mega__col"><h4>Shop</h4><ul><li><a href="index.html#collection">All fragrances</a></li><li><a href="index.html#discovery">The Trilogy</a></li><li><a href="index.html#discovery">Discovery Set</a></li><li><a href="index.html#gifting">Gifting</a></li><li><a href="index.html#finder">Scent Finder</a></li></ul></div>' + cards +
        '<a class="mega__card" href="index.html#discovery"><div class="ph" style="background:#1d1a17;display:grid;place-items:center;color:#efe6d8;padding:20px;text-align:center"><span style="font-family:var(--serif);font-size:30px;line-height:1.1;color:#efe6d8">Can’t choose?<br><em style="color:#b8925c">Take all three.</em></span></div><strong>The Trilogy</strong><span>Save AED 60</span></a>' +
        "</div></div></header>";
    }
    // Mobile nav, search, drawer, toast, WhatsApp
    var extra = document.createElement("div");
    extra.innerHTML =
      '<div class="mnav" id="mnav" aria-hidden="true"><div class="mnav__top"><a class="logo" href="index.html"><img src="images/logo.png" alt="MEHAS"></a><button class="icon-btn" aria-label="Close menu" data-close-mnav>' + I.close + "</button></div>" +
      '<div class="mnav__body"><p class="eyebrow">The collection</p><div class="mnav__products">' +
      ORDER.map(function (id) { var p = PRODUCTS[id]; return '<a href="' + pdpUrl(id) + '"><img src="' + p.img + '" alt="" loading="lazy">' + p.name + "</a>"; }).join("") +
      '</div><a href="index.html#collection">All fragrances</a><a href="index.html#discovery">Sets &amp; Gifts</a><a href="index.html#finder">Scent Finder</a><a href="index.html#story">Our Story</a><a href="index.html#faq">Help &amp; FAQ</a>' +
      '<div class="mnav__meta"><span>Free express delivery across the UAE</span><span>online@mehas.com</span></div></div></div>' +
      '<div class="search" id="search" aria-hidden="true"><div class="search__panel" role="dialog" aria-label="Search"><div class="search__row">' + I.search + '<input type="search" placeholder="Search fragrances, notes…" aria-label="Search" data-search-input><button class="icon-btn" aria-label="Close search" data-close-search>' + I.close + '</button></div><div class="search__results" data-search-results></div><p class="search__hint">Try “vanilla”, “fresh”, “citrus”, “evening”.</p></div></div>' +
      '<div class="scrim" data-scrim></div>' +
      '<aside class="drawer" id="drawer" aria-label="Your bag" aria-hidden="true"><div class="drawer__head"><h2>Your bag</h2><button class="icon-btn" aria-label="Close bag" data-close-cart>' + I.close + '</button></div><div class="ship" data-ship></div><div class="drawer__items" data-items></div><div class="upsell" data-upsell></div>' +
      '<div class="drawer__foot"><label class="gift-toggle"><input type="checkbox" data-giftwrap checked> Gift wrap with a handwritten note (complimentary)</label><div class="drawer__total"><span>Subtotal</span><b data-subtotal>AED 0</b></div><button class="btn btn--block" data-checkout>Secure checkout</button><small>or 4 interest-free payments with Tabby / Tamara · Cash on delivery available</small>' +
      '<div class="trust-mini"><span>' + I.lock + 'Secure SSL</span><span>' + I.check + '100% authentic</span><span>' + I.check + 'Easy returns</span></div></div></aside>' +
      '<div class="toast" role="status" aria-live="polite" data-toast></div>' +
      '<a class="wa" href="https://wa.me/" target="_blank" rel="noopener" aria-label="Chat with a fragrance advisor on WhatsApp" data-noop>' + I.wa + '<span class="wa__tip">Ask a fragrance advisor</span></a>';
    document.body.appendChild(extra);

    var f = $("[data-footer]");
    if (f) {
      f.outerHTML = '<footer class="footer"><div class="wrap"><div class="footer__grid">' +
        '<div><img class="footer__logo" src="images/logo.png" alt="MEHAS"><p style="max-width:34ch;margin:0">Luxury perfumery from the UAE. A fragrance that becomes your signature.</p><div class="social"><a href="https://www.instagram.com/mehasofficial/" target="_blank" rel="noopener" aria-label="Instagram">' + I.ig + '</a><a href="https://www.facebook.com/profile.php?id=61594731578189" target="_blank" rel="noopener" aria-label="Facebook">' + I.fb + '</a><a href="mailto:online@mehas.com" aria-label="Email">' + I.mail + "</a></div></div>" +
        '<div><h4>Shop</h4><ul><li><a href="' + pdpUrl("monarch") + '">Monarch</a></li><li><a href="' + pdpUrl("silverback") + '">Silverback</a></li><li><a href="' + pdpUrl("beast-mode") + '">Beast Mode</a></li><li><a href="index.html#discovery">The Trilogy</a></li><li><a href="index.html#discovery">Discovery Set</a></li></ul></div>' +
        '<div><h4>Help</h4><ul><li><a href="index.html#faq">Delivery &amp; returns</a></li><li><a href="index.html#faq">FAQ</a></li><li><a href="index.html#finder">Scent Finder</a></li><li><a href="mailto:online@mehas.com">online@mehas.com</a></li></ul></div>' +
        '<div><h4>MEHAS</h4><ul><li><a href="index.html#story">Our story</a></li><li><a href="index.html#ritual">How to wear</a></li><li><a href="index.html#gifting">Gifting</a></li><li><a href="#" data-noop>Privacy policy</a></li></ul></div>' +
        '</div><div class="footer__bottom"><span>© 2026 MEHAS Perfumes UAE. All rights reserved.</span><div class="pay" aria-label="Accepted payments"><span>VISA</span><span>MASTERCARD</span><span>APPLE PAY</span><span>GOOGLE PAY</span><span>TABBY</span><span>TAMARA</span><span>COD</span></div></div></div></footer>';
    }
  }

  /* ---------------- UI plumbing ---------------- */
  var scrim, drawer;
  function lock(on) { document.documentElement.style.overflow = on ? "hidden" : ""; }
  function openDrawer() { closeAll(); drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false"); scrim.classList.add("is-on"); lock(true); setTimeout(function () { $("[data-close-cart]").focus(); }, 50); }
  function closeAll() {
    [drawer, $("#mnav"), $("#search")].forEach(function (el) { if (el) { el.classList.remove("is-open"); el.setAttribute("aria-hidden", "true"); } });
    if (scrim) scrim.classList.remove("is-on");
    var m = $("#mega"); if (m) { m.classList.remove("is-open"); var b = $("[data-mega]"); if (b) b.setAttribute("aria-expanded", "false"); }
    lock(false);
  }
  var toastT;
  function toast(msg) { var t = $("[data-toast]"); t.innerHTML = msg; t.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("is-on"); }, 2600); }

  /* ---------------- Cart ---------------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem("mehas-cart") || "[]"); } catch (e) { cart = []; }
  function save() { try { localStorage.setItem("mehas-cart", JSON.stringify(cart)); } catch (e) {} }
  function itemInfo(id) {
    if (PRODUCTS[id]) { var p = PRODUCTS[id]; return { name: p.name, sub: "Eau de Parfum · 100 mL", price: p.price, img: p.img }; }
    var s = SETS[id]; return { name: s.name, sub: s.sub, price: s.price, img: s.img };
  }
  function add(id, qty) {
    qty = qty || 1;
    var l = cart.filter(function (x) { return x.id === id; })[0];
    if (l) l.q += qty; else cart.push({ id: id, q: qty });
    save(); renderCart();
    var c = $("[data-count]"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
    openDrawer();
  }
  function renderCart() {
    var n = 0, sub = 0;
    cart.forEach(function (l) { n += l.q; sub += itemInfo(l.id).price * l.q; });
    var c = $("[data-count]"); if (c) { c.textContent = n; c.classList.toggle("has", n > 0); }
    $("[data-subtotal]").textContent = money(sub);
    var left = GIFT_AT - sub;
    $("[data-ship]").innerHTML = (left > 0
      ? "You’re <b>" + money(left) + "</b> away from a <b>complimentary 10 mL travel spray</b>."
      : "<b>You’ve unlocked a complimentary 10 mL travel spray.</b> Free express UAE delivery included.") +
      '<div class="ship__bar"><i style="width:' + Math.min(100, (sub / GIFT_AT) * 100) + '%"></i></div>';
    var items = $("[data-items]");
    if (!cart.length) {
      items.innerHTML = '<div class="empty"><h3>Your bag is empty</h3><p>Three signatures are waiting to be discovered.</p><a class="btn btn--ghost" href="index.html#collection" data-close-cart>Shop fragrances</a></div>';
    } else {
      items.innerHTML = cart.map(function (l) {
        var it = itemInfo(l.id);
        return '<div class="line"><img src="' + it.img + '" alt=""><div><h3>' + it.name + "</h3><small>" + it.sub + '</small><div class="qty" aria-label="Quantity"><button data-dec="' + l.id + '" aria-label="Decrease">−</button><span>' + l.q + '</span><button data-inc="' + l.id + '" aria-label="Increase">+</button></div><button class="rm" data-rm="' + l.id + '">Remove</button></div><div class="line__price">' + money(it.price * l.q) + "</div></div>";
      }).join("");
    }
    // Upsell: complete the trilogy (a fragrance not in the bag), else the set
    var inBag = cart.map(function (l) { return l.id; });
    var up = ORDER.filter(function (id) { return inBag.indexOf(id) < 0; })[0];
    var u = $("[data-upsell]");
    if (cart.length && inBag.indexOf("trilogy") < 0 && up) {
      var p = PRODUCTS[up];
      u.style.display = "";
      u.innerHTML = "<h4>Complete your wardrobe</h4><div class=\"upsell__row\"><img src=\"" + p.img + '" alt=""><div><b>' + p.name + "</b><small>" + p.family + " · " + money(p.price) + '</small></div><button data-add="' + up + '">Add</button></div>';
    } else { u.style.display = "none"; }
  }

  /* ---------------- Global events ---------------- */
  function bind() {
    scrim = $("[data-scrim]"); drawer = $("#drawer");
    document.addEventListener("click", function (e) {
      var t = e.target.closest("button, a"); if (!t) { return; }
      if (t.hasAttribute("data-noop")) { e.preventDefault(); toast("Prototype link — connects to Shopify in the build."); return; }
      if (t.hasAttribute("data-add")) { e.preventDefault(); add(t.getAttribute("data-add"), +(t.getAttribute("data-qty") || 1)); return; }
      if (t.hasAttribute("data-open-cart")) { openDrawer(); return; }
      if (t.hasAttribute("data-close-cart")) { closeAll(); return; }
      if (t.hasAttribute("data-inc") || t.hasAttribute("data-dec") || t.hasAttribute("data-rm")) {
        var id = t.getAttribute("data-inc") || t.getAttribute("data-dec") || t.getAttribute("data-rm");
        cart = cart.map(function (l) { if (l.id === id) { if (t.hasAttribute("data-inc")) l.q++; else if (t.hasAttribute("data-dec")) l.q--; else l.q = 0; } return l; }).filter(function (l) { return l.q > 0; });
        save(); renderCart(); return;
      }
      if (t.hasAttribute("data-checkout")) { toast("Checkout opens Shopify’s secure checkout in the live store."); return; }
      if (t.hasAttribute("data-open-mnav")) { closeAll(); var m = $("#mnav"); m.classList.add("is-open"); m.setAttribute("aria-hidden", "false"); lock(true); return; }
      if (t.hasAttribute("data-close-mnav")) { closeAll(); return; }
      if (t.hasAttribute("data-open-search")) { closeAll(); var s = $("#search"); s.classList.add("is-open"); s.setAttribute("aria-hidden", "false"); lock(true); doSearch(""); setTimeout(function () { $("[data-search-input]").focus(); }, 60); return; }
      if (t.hasAttribute("data-close-search")) { closeAll(); return; }
      if (t.hasAttribute("data-mega")) { var mg = $("#mega"); var o = !mg.classList.contains("is-open"); mg.classList.toggle("is-open", o); t.setAttribute("aria-expanded", o); return; }
      // close overlays when following an in-page link from mobile nav / mega
      if (t.tagName === "A" && (t.closest("#mnav") || t.closest("#mega") || t.closest("#drawer"))) closeAll();
    });
    scrim.addEventListener("click", closeAll);
    $("#search").addEventListener("click", function (e) { if (e.target.id === "search") closeAll(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeAll(); closeLightbox(); } });
    $("[data-search-input]").addEventListener("input", function (e) { doSearch(e.target.value); });

    // Mega menu on hover (desktop)
    var mb = $("[data-mega]"), mega = $("#mega"), hideT;
    if (mb && mega) {
      var show = function () { clearTimeout(hideT); mega.classList.add("is-open"); mb.setAttribute("aria-expanded", "true"); };
      var hide = function () { hideT = setTimeout(function () { mega.classList.remove("is-open"); mb.setAttribute("aria-expanded", "false"); }, 160); };
      mb.addEventListener("mouseenter", show); mb.addEventListener("mouseleave", hide);
      mega.addEventListener("mouseenter", show); mega.addEventListener("mouseleave", hide);
    }

    // Header state
    var hd = $(".header");
    var onScroll = function () { if (hd) hd.classList.toggle("is-scrolled", window.scrollY > 10); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    // Announcement rotation
    var items = $$(".announce__item"), ai = 0, aT;
    var go = function (d) { if (!items.length) return; items[ai].classList.remove("is-on"); ai = (ai + d + items.length) % items.length; items[ai].classList.add("is-on"); };
    var loop = function () { clearInterval(aT); aT = setInterval(function () { go(1); }, 4500); };
    if (items.length) {
      $(".announce__nav--next").addEventListener("click", function () { go(1); loop(); });
      $(".announce__nav--prev").addEventListener("click", function () { go(-1); loop(); });
      loop();
    }

    // Reveal on scroll
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
      $$(".rv").forEach(function (el) { io.observe(el); });
    } else { $$(".rv").forEach(function (el) { el.classList.add("in"); }); }
  }

  function doSearch(q) {
    q = (q || "").toLowerCase().trim();
    var res = ORDER.map(function (id) { return PRODUCTS[id]; }).filter(function (p) {
      if (!q) return true;
      var hay = [p.name, p.family, p.short, p.desc, p.notes.top, p.notes.heart, p.notes.base, p.wear, p.season].join(" ").toLowerCase();
      var syn = { fresh: "citrus sea marine", sweet: "vanilla fruity floral", evening: "evenings weddings", night: "nights evenings", oud: "woods", woody: "woods", summer: "summer" };
      return hay.indexOf(q) > -1 || (syn[q] && syn[q].split(" ").some(function (w) { return hay.indexOf(w) > -1; }));
    });
    $("[data-search-results]").innerHTML = res.length ? res.map(function (p) {
      return '<a href="' + pdpUrl(p.id) + '"><img src="' + p.img + '" alt=""><span><b style="font-family:var(--serif);font-size:20px;font-weight:500">' + p.name + "</b><small>" + p.family + " · " + money(p.price) + "</small></span></a>";
    }).join("") : '<p style="color:var(--muted);margin:0">No match — try “vanilla”, “fresh” or “citrus”, or take the <a href="index.html#finder">Scent Finder</a>.</p>';
  }

  /* ---------------- Home: scent finder ---------------- */
  var QUIZ = [
    { q: "When do you most want to be noticed?", o: [["☾", "Evenings & occasions", "Weddings, dinners, majlis", "monarch"], ["☀", "Every day", "Office, daytime, warm weather", "silverback"], ["✦", "Nights out", "Parties, celebrations", "beast-mode"], ["∞", "All the time", "I want a statement", "beast-mode"]] },
    { q: "Which of these draws you in?", o: [["◐", "Warm vanilla & incense", "Smoky, sweet, enveloping", "monarch"], ["≈", "Sea air & citrus", "Clean, crisp, cool", "silverback"], ["❀", "Juicy fruit & florals", "Bright, vibrant, sweet", "beast-mode"], ["▲", "Smooth suede & woods", "Refined, grounded", "silverback"]] },
    { q: "How should people describe you after you leave?", o: [["♛", "Regal", "Elegant and commanding", "monarch"], ["◆", "Composed", "Calm, strong, assured", "silverback"], ["✸", "Unforgettable", "Bold, magnetic, loud", "beast-mode"], ["◇", "Mysterious", "Deep, intriguing", "monarch"]] }
  ];
  function finder() {
    var stage = $("[data-finder]"); if (!stage) return;
    var answers = [];
    var steps = $("[data-finder-steps]");
    function bar() { steps.innerHTML = QUIZ.map(function (_, i) { return "<i class=\"" + (i < answers.length + 1 ? "on" : "") + '"></i>'; }).join(""); }
    function ask() {
      var i = answers.length;
      if (i >= QUIZ.length) return result();
      bar();
      var s = QUIZ[i];
      stage.innerHTML = '<div class="finder__panel"><p class="eyebrow">Question ' + (i + 1) + " of " + QUIZ.length + '</p><h3 class="finder__q">' + s.q + '</h3><div class="finder__opts">' +
        s.o.map(function (o, k) { return '<button class="finder__opt" data-k="' + k + '"><span class="emo" aria-hidden="true">' + o[0] + "</span><span><b>" + o[1] + "</b><small>" + o[2] + "</small></span></button>"; }).join("") +
        "</div>" + (i ? '<button class="finder__back" data-back>← Back</button>' : "") + "</div>";
    }
    function result() {
      steps.innerHTML = QUIZ.map(function () { return '<i class="on"></i>'; }).join("");
      var score = {}; answers.forEach(function (a) { score[a] = (score[a] || 0) + 1; });
      var best = answers[answers.length - 1];
      Object.keys(score).forEach(function (k) { if (score[k] > score[best]) best = k; });
      var p = PRODUCTS[best];
      var match = score[best] === 3 ? 98 : score[best] === 2 ? 91 : 84;
      try { localStorage.setItem("mehas-match", best); } catch (e) {}
      stage.innerHTML = '<div class="finder__panel finder__result"><img src="' + p.img + '" alt="' + p.name + '"><div><span class="finder__match">' + match + '% match · Your signature</span><h3>' + p.name + "</h3><p>" + p.short + " Best worn for " + p.wear.toLowerCase() + '.</p><div class="btns"><button class="btn btn--gold" data-add="' + p.id + '">Add to bag · ' + money(p.price) + '</button><a class="btn btn--ghost" href="' + pdpUrl(p.id) + '">Explore ' + p.name + '</a></div><button class="finder__back" data-restart>↺ Retake the quiz</button></div></div>';
    }
    stage.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-k")) { answers.push(QUIZ[answers.length].o[+b.getAttribute("data-k")][3]); ask(); }
      else if (b.hasAttribute("data-back")) { answers.pop(); ask(); }
      else if (b.hasAttribute("data-restart")) { answers = []; ask(); }
    });
    ask();
  }

  /* ---------------- Home: fragrance explorer tabs ---------------- */
  function meters(c) {
    var row = function (lab, v) { var bars = ""; for (var i = 0; i < 5; i++) bars += "<i" + (i < v[0] ? ' class="on"' : "") + "></i>"; return '<div class="meter"><span>' + lab + '</span><span class="meter__bar" aria-label="' + v[0] + ' of 5">' + bars + "</span><span>" + v[1] + "</span></div>"; };
    return '<div class="meters">' + row("Longevity", c.longevity) + row("Projection", c.sillage) + row("Intensity", c.intensity) + "</div>";
  }
  function explorer() {
    var root = $("[data-explorer]"); if (!root) return;
    var tabs = '<div class="explorer__tabs" role="tablist">' + ORDER.map(function (id, i) { var p = PRODUCTS[id]; return '<button class="explorer__tab" role="tab" id="tab-' + id + '" aria-controls="panel-' + id + '" aria-selected="' + (i === 0) + '" style="--tone:' + p.tone + '">' + p.name + "</button>"; }).join("") + "</div>";
    var panels = ORDER.map(function (id, i) {
      var p = PRODUCTS[id];
      return '<div class="explorer__panel" role="tabpanel" id="panel-' + id + '" aria-labelledby="tab-' + id + '" style="--tone:' + p.tone + '"' + (i ? " hidden" : "") + ">" +
        '<div class="explorer__visual"><img class="mood" src="' + p.mood + '" alt="" loading="lazy"><span class="tagline">' + p.tagline + '</span><img class="bottle" src="' + p.img + '" alt="' + p.name + ' bottle" loading="lazy"></div>' +
        '<div class="explorer__info"><h3>' + p.name + '</h3><p class="family">' + p.family + '</p><p class="desc">' + p.desc + "</p>" +
        '<dl class="pyramid"><div><dt>Top</dt><dd>' + p.notes.top + "</dd></div><div><dt>Heart</dt><dd>" + p.notes.heart + "</dd></div><div><dt>Base</dt><dd>" + p.notes.base + "</dd></div><div><dt>Wear it for</dt><dd>" + p.wear + "</dd></div></dl>" +
        meters(p.character) +
        '<div class="explorer__buy"><span class="price">' + money(p.price) + '</span><button class="btn" data-add="' + id + '">Add to bag</button><a class="link-arrow" href="' + pdpUrl(id) + '">Full details ' + I.arrow + "</a></div></div></div>";
    }).join("");
    root.innerHTML = tabs + panels;
    var tabEls = $$(".explorer__tab", root);
    function select(btn) {
      tabEls.forEach(function (b) { var on = b === btn; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; $("#" + b.getAttribute("aria-controls")).hidden = !on; });
    }
    tabEls.forEach(function (b, i) {
      b.tabIndex = i ? -1 : 0;
      b.addEventListener("click", function () { select(b); });
      b.addEventListener("keydown", function (e) {
        var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!k) return;
        var n = tabEls[(i + k + tabEls.length) % tabEls.length]; select(n); n.focus();
      });
    });
  }

  /* ---------------- Home: offer chooser ---------------- */
  function offer() {
    var f = $("[data-offer]"); if (!f) return;
    f.addEventListener("submit", function (e) { e.preventDefault(); var v = (f.querySelector("input:checked") || {}).value; if (v) add(v); });
  }

  /* ---------------- Newsletter ---------------- */
  function club() {
    var f = $("[data-club]"); if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = f.querySelector("input").value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { toast("Please enter a valid email address."); return; }
      f.parentNode.innerHTML = '<p class="club__ok">Welcome to the House of MEHAS.</p><p style="color:#b9ad9b;margin:8px 0 0">Your 10% welcome code: <span class="code">SIGNATURE10</span></p>';
    });
  }

  /* ---------------- Story parallax ---------------- */
  function parallax() {
    var bg = $(".story__bg"); if (!bg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var sec = bg.parentNode, ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var r = sec.getBoundingClientRect(), vh = window.innerHeight;
        if (r.bottom > 0 && r.top < vh) { var p = (r.top + r.height / 2 - vh / 2) / vh; bg.style.transform = "translate3d(0," + (p * -60).toFixed(1) + "px,0)"; }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------------- Product page ---------------- */
  var lb;
  function closeLightbox() { if (lb) lb.classList.remove("is-on"); }
  function pdp() {
    var root = $("[data-pdp]"); if (!root) return;
    var id = new URLSearchParams(location.search).get("p");
    if (!PRODUCTS[id]) id = "monarch";
    var p = PRODUCTS[id];
    document.title = p.name + " — " + p.family + " Eau de Parfum | MEHAS";
    document.documentElement.style.setProperty("--tone", p.tone);
    $$("[data-p]").forEach(function (el) { var k = el.getAttribute("data-p"); el.innerHTML = k === "price" ? money(p.price) : p[k]; });

    // Gallery (desktop grid + mobile slider)
    var shots = [[p.img, p.name + " Eau de Parfum bottle", "The bottle"], [p.box, p.name + " gift box", "Signature box"], [p.mood, "", "The mood"]];
    var notesCard = '<figure class="notes-card" style="--tone-bg:' + p.toneBg + '"><h3>The composition</h3><ol><li><small>Top</small><span>' + p.notes.top + "</span></li><li><small>Heart</small><span>" + p.notes.heart + "</span></li><li><small>Base</small><span>" + p.notes.base + "</span></li></ol></figure>";
    $("[data-gallery]").innerHTML = shots.map(function (s, i) { return '<figure data-zoom="' + s[0] + '"><img src="' + s[0] + '" alt="' + s[1] + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + "><figcaption>" + s[2] + "</figcaption></figure>"; }).join("") + notesCard;
    $("[data-slider]").innerHTML = '<div class="slider__track" data-track>' + shots.map(function (s, i) { return '<figure><img src="' + s[0] + '" alt="' + s[1] + '"' + (i ? ' loading="lazy"' : "") + "></figure>"; }).join("") + notesCard + '</div><div class="slider__dots" data-dots>' + "<i class=\"on\"></i><i></i><i></i><i></i></div>";
    var track = $("[data-track]");
    track.addEventListener("scroll", function () { var i = Math.round(track.scrollLeft / track.clientWidth); $$("[data-dots] i").forEach(function (d, k) { d.classList.toggle("on", k === i); }); }, { passive: true });

    // Lightbox
    lb = document.createElement("div"); lb.className = "lightbox"; lb.innerHTML = '<button aria-label="Close">' + I.close + '</button><img alt="">';
    document.body.appendChild(lb);
    lb.addEventListener("click", closeLightbox);
    $("[data-gallery]").addEventListener("click", function (e) { var f = e.target.closest("[data-zoom]"); if (!f) return; lb.querySelector("img").src = f.getAttribute("data-zoom"); lb.classList.add("is-on"); });

    // Facts
    $("[data-facts]").innerHTML = '<div><dt>Scent family</dt><dd>' + p.family + "</dd></div><div><dt>Key notes</dt><dd>" + [p.notes.top, p.notes.heart, p.notes.base].join(" · ") + "</dd></div><div><dt>Wear it for</dt><dd>" + p.wear + "</dd></div><div><dt>Season</dt><dd>" + p.season + "</dd></div><div><dt>Size</dt><dd>100 mL Eau de Parfum</dd></div>";
    $("[data-rating]").innerHTML = stars(p.rating) + " <b>" + p.rating + '</b> <a href="#reviews">' + p.reviews + " reviews</a>";
    $("[data-story]").textContent = p.story;

    // Options
    var opts = $("[data-options]");
    opts.innerHTML =
      '<label class="choice"><input type="radio" name="opt" value="' + id + '" checked><span><b>' + p.name + ' · 100 mL</b><small>Eau de Parfum in signature gift box</small></span><span class="p">' + money(p.price) + "</span></label>" +
      '<label class="choice"><span class="choice__flag">Best value</span><input type="radio" name="opt" value="trilogy"><span><b>The Trilogy</b><small>' + p.name + ' + the other two signatures</small></span><span class="p">' + money(540) + '<small class="save">Save AED 60</small></span></label>' +
      '<label class="choice"><input type="radio" name="opt" value="discovery"><span><b>Discovery Set · 3 × 10 mL</b><small>Try first — AED 95 back on a full bottle</small></span><span class="p">' + money(95) + "</span></label>";
    var qty = 1;
    var price = function () { var v = $("input[name=opt]:checked").value; return itemInfo(v).price; };
    var upd = function () {
      var pr = price() * qty;
      $("[data-atc-label]").textContent = "Add to bag · " + money(pr);
      $("[data-bnpl]").textContent = money(Math.ceil((pr / 4) * 100) / 100);
      $("[data-q]").textContent = qty;
      $("[data-sticky-price]").textContent = money(pr);
    };
    opts.addEventListener("change", upd);
    $("[data-qminus]").addEventListener("click", function () { qty = Math.max(1, qty - 1); upd(); });
    $("[data-qplus]").addEventListener("click", function () { qty = Math.min(10, qty + 1); upd(); });
    var atc = function () { add($("input[name=opt]:checked").value, qty); };
    $("[data-atc]").addEventListener("click", atc);
    $("[data-sticky-atc]").addEventListener("click", atc);
    $("[data-buynow]").addEventListener("click", function () { toast("Express checkout (Apple Pay / Google Pay) opens in the live store."); });
    upd();

    // Delivery ETA (Dubai time, cut-off 6pm)
    var eta = function () {
      var now = new Date(), dub = new Date(now.getTime() + (now.getTimezoneOffset() + 240) * 60000);
      var cut = new Date(dub); cut.setHours(18, 0, 0, 0);
      var dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var txt;
      if (dub < cut) { var m = Math.floor((cut - dub) / 60000); txt = "Order within <b>" + Math.floor(m / 60) + "h " + (m % 60) + "m</b> for delivery <b>tomorrow</b> in Dubai &amp; Abu Dhabi."; }
      else { var d = new Date(dub); d.setDate(d.getDate() + 2); txt = "Order now for delivery by <b>" + dayName[d.getDay()] + "</b> in Dubai &amp; Abu Dhabi."; }
      $("[data-eta]").innerHTML = txt + "<br><small style=\"color:var(--muted)\">2–3 days to other Emirates · Free express delivery</small>";
    };
    eta(); setInterval(eta, 30000);

    // Character + notes band
    var c = p.character;
    $("[data-character]").innerHTML = [["Longevity", c.longevity[1], c.longevity], ["Projection", c.sillage[1], c.sillage], ["Intensity", c.intensity[1], c.intensity], ["Mood", p.vibe, null]].map(function (r) {
      var bars = ""; if (r[2]) { for (var i = 0; i < 5; i++) bars += "<i" + (i < r[2][0] ? ' class="on"' : "") + "></i>"; }
      return "<div><small>" + r[0] + "</small><b>" + r[1] + "</b>" + (bars ? '<span class="meter__bar" style="--tone:' + p.tone + '">' + bars + "</span>" : '<span style="color:var(--muted);font-size:13px">' + p.season + "</span>") + "</div>";
    }).join("");
    $("[data-notes-band]").innerHTML = p.noteTiles.map(function (t, i) { return '<div class="note-tile rv"><img src="' + p.noteImgs[i] + '" alt="" loading="lazy"><div><small>' + t[0] + "</small><h3>" + t[1] + "</h3><p>" + t[2] + "</p></div></div>"; }).join("");

    // Related
    $("[data-related]").innerHTML = ORDER.filter(function (k) { return k !== id; }).map(card).join("") + setCard();

    // Reviews
    $("[data-rev-score]").textContent = p.rating;
    $("[data-rev-count]").textContent = p.reviews;

    // Sticky ATC
    $("[data-sticky-img]").src = p.img;
    var trig = $("[data-atc]");
    var sticky = $(".sticky-atc");
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        var e = es[0]; var past = !e.isIntersecting && e.boundingClientRect.top < 0;
        sticky.classList.toggle("is-on", past); document.body.classList.toggle("has-sticky", past);
      }).observe(trig);
    }
  }

  /* ---------------- Product card (shared) ---------------- */
  function card(id) {
    var p = PRODUCTS[id];
    var badge = id === "monarch" ? "Bestseller" : id === "beast-mode" ? "Most complimented" : "New season";
    return '<article class="pcard rv"><a class="pcard__media" href="' + pdpUrl(id) + '" aria-label="' + p.name + '"><span class="pcard__badge">' + badge + '</span><img src="' + p.img + '" alt="' + p.name + ' Eau de Parfum" loading="lazy"><img class="alt" src="' + p.box + '" alt="" loading="lazy"></a>' +
      '<button class="btn pcard__quick" data-add="' + id + '">Add to bag · ' + money(p.price) + "</button>" +
      '<div class="pcard__body"><span class="pcard__family">' + p.family + '</span><div class="pcard__top"><h3 class="pcard__name"><a href="' + pdpUrl(id) + '">' + p.name + '</a></h3><span class="pcard__price">' + money(p.price) + '</span></div><p class="pcard__notes">' + p.short + '</p><div class="pcard__rating">' + stars(p.rating) + " " + p.rating + " (" + p.reviews + ')</div><button class="btn btn--ghost pcard__mobile-add" data-add="' + id + '">Add to bag</button></div></article>';
  }
  function setCard() {
    return '<article class="pcard pcard--set rv"><a class="pcard__media" href="index.html#discovery" aria-label="The Trilogy set"><span class="pcard__badge">Save AED 60</span><span class="set-visual"><img src="images/monarch.jpg" alt=""><img src="images/beast-mode.jpg" alt=""><img src="images/silverback.jpg" alt=""></span></a>' +
      '<button class="btn btn--gold pcard__quick" data-add="trilogy">Add the set · AED 540</button>' +
      '<div class="pcard__body"><span class="pcard__family">The complete wardrobe</span><div class="pcard__top"><h3 class="pcard__name"><a href="index.html#discovery">The Trilogy</a></h3><span class="pcard__price"><span class="strike">AED 600</span>AED 540</span></div><p class="pcard__notes">All three signatures — one for every mood, day to night.</p><div class="pcard__rating">' + stars(5) + ' 5.0 (41)</div><button class="btn btn--gold pcard__mobile-add" data-add="trilogy">Add the set</button></div></article>';
  }
  function grid() {
    var g = $("[data-grid]"); if (!g) return;
    g.innerHTML = ORDER.map(card).join("") + setCard();
  }

  /* ---------------- Boot ---------------- */
  chrome();
  grid();
  pdp();
  bind();
  renderCart();
  finder();
  explorer();
  offer();
  club();
  parallax();
})();
