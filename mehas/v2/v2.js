/* MEHAS — Version B "Signature Rooms" (no dependencies) */
(function () {
  "use strict";
  var IN_PDP = /\/v2\/product\/?(index\.html)?$/.test(location.pathname);
  var IMG = IN_PDP ? "../../images/" : "../images/";
  var HOME = IN_PDP ? "../" : "./";
  var PDP = function (id) { return (IN_PDP ? "./" : "product/") + "?p=" + id; };
  var V1 = IN_PDP ? "../../product/" : "../";
  var CUR = "AED", GIFT_AT = 400;

  var P = {
    monarch: { id: "monarch", no: "01", name: "Monarch", tagline: "Leave a legacy", tone: "#7b2430", tcls: "t-m", family: "Oriental · Amber", price: 200, rating: 4.9, reviews: 128,
      cut: "cut-monarch.webp", img: "monarch.jpg", box: "monarch-box.jpg", mood: "desert.jpg",
      short: "Smoky, syrupy vanilla wrapped in incense and refined woods.",
      desc: "A rich oriental-amber composition built around an elegant, smoky and syrupy vanilla. Incense adds depth and mystery, while a refined woody heart gives the fragrance structure before melting into its warm vanilla drydown.",
      story: "Monarch is crafted to leave behind a legacy, inspired by the timeless grandeur of royal dynasties. Its elegant, commanding sillage fills the room with distinction, lingering like the memory of kings and queens long after they have departed.",
      notes: ["Incense, smoked resin", "Refined woods", "Syrupy vanilla, warm amber"],
      phases: [["First 15 minutes", "Incense", "Smoke and resin announce you before you speak."], ["Hours 1 – 4", "Refined woods", "A polished, structured heart gives Monarch its posture."], ["Hours 4 – 12", "Vanilla & amber", "A warm, syrupy drydown that lingers on fabric overnight."]],
      perf: { longevity: [5, "10–12 h"], projection: [5, "Room-filling"], intensity: [4, "Rich"] },
      wear: ["Evenings", "Weddings", "Majlis", "Autumn · Winter"], best: "Evenings & occasions", season: "Autumn · Winter", vibe: "Regal, magnetic" },
    silverback: { id: "silverback", no: "02", name: "Silverback", tagline: "Strength. Composure. Presence.", tone: "#2433a8", tcls: "t-s", family: "Marine · Woody", price: 200, rating: 4.8, reviews: 96,
      cut: "cut-silverback.webp", img: "silverback.jpg", box: "silverback-box.jpg", mood: "ocean.jpg",
      short: "Fresh citrus and salty ocean air over suede and mineral amber.",
      desc: "A bold marine-woody composition that opens with fresh citrus and crisp, salty ocean air. Smooth suede adds refined depth, while mineral amber and earthy woods create a powerful, oceanic drydown.",
      story: "Silverback was forged to embody strength, composure and refinement, leaving behind a commanding presence of strength, power, and calmness.",
      notes: ["Fresh citrus, salty sea air", "Smooth suede", "Mineral amber, earthy woods"],
      phases: [["First 15 minutes", "Citrus & sea air", "Crisp, salty and instantly clean."], ["Hours 1 – 4", "Suede", "Soft, refined depth that keeps it grown-up."], ["Hours 4 – 10", "Mineral amber", "Earthy woods and amber for a calm, powerful trail."]],
      perf: { longevity: [4, "8–10 h"], projection: [4, "Strong"], intensity: [3, "Balanced"] },
      wear: ["Daytime", "Office", "Warm weather", "Spring · Summer"], best: "Every day, office & heat", season: "Spring · Summer", vibe: "Calm, assured" },
    "beast-mode": { id: "beast-mode", no: "03", name: "Beast Mode", tagline: "Make your presence unmissable", tone: "#c3161f", tcls: "t-b", family: "Fruity · Floral · Woody", price: 200, rating: 4.9, reviews: 112,
      cut: "cut-beast-mode.webp", img: "beast-mode.jpg", box: "beast-mode-box.jpg", mood: "citrus.jpg",
      short: "Grapefruit, crisp apple and geranium over woods and musk.",
      desc: "A high-impact fruity-floral composition that opens with vibrant grapefruit, crisp apple and fresh geranium. As it develops, the fragrance becomes sweeter and more floral before settling into a rich, woody and musky drydown.",
      story: "Beast Mode is built to fill the room with an unmistakable presence, ensuring that the moment you walk in, everyone knows you are there.",
      notes: ["Grapefruit, crisp apple, geranium", "Sweet florals", "Rich woods, musk"],
      phases: [["First 15 minutes", "Grapefruit & apple", "A bright, juicy burst with a green geranium edge."], ["Hours 1 – 4", "Sweet florals", "It warms and blooms as it settles on skin."], ["Hours 4 – 10", "Woods & musk", "Rich, sensual and built to be noticed."]],
      perf: { longevity: [4, "8–10 h"], projection: [5, "Room-filling"], intensity: [5, "Bold"] },
      wear: ["Nights out", "Celebrations", "Statement days", "All year"], best: "Nights out & celebrations", season: "All year", vibe: "Bold, energetic" }
  };
  var ORDER = ["monarch", "silverback", "beast-mode"];
  var SETS = {
    trilogy: { name: "The Trilogy", sub: "3 × 100 mL", price: 540, cut: "cut-monarch.webp", tcls: "t-b" },
    discovery: { name: "Discovery Set", sub: "3 × 10 mL · AED 95 credit", price: 95, cut: "cut-silverback.webp", tcls: "t-s" }
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return CUR + " " + n.toLocaleString("en-US"); };
  var img = function (f) { return IMG + f; };
  var I = {
    arr: '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 9h16M4 15h10"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m4 12 5 5L20 6"/></svg>',
    truck: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 8h16v14H3zM19 13h6l4 5v4h-10"/><circle cx="9" cy="24" r="2.5"/><circle cx="24" cy="24" r="2.5"/></svg>',
    gift: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 13h22v15H5zM3 9h26v4H3zM16 9v19"/><path d="M16 9c-2-4-7-5-7-2s4 2 7 2Zm0 0c2-4 7-5 7-2s-4 2-7 2Z"/></svg>',
    shield: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M16 3 5 7v8c0 7 5 12 11 14 6-2 11-7 11-14V7L16 3Z"/><path d="m11 16 4 4 7-8"/></svg>',
    card: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="7" width="26" height="18" rx="3"/><path d="M3 12h26M7 20h6"/></svg>',
    back: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 16a10 10 0 1 0 3-7M6 4v5h5"/></svg>',
    drop: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M16 3s9 10 9 16a9 9 0 0 1-18 0c0-6 9-16 9-16Z"/></svg>',
    chevL: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 3 5 8l5 5"/></svg>',
    chevR: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m6 3 5 5-5 5"/></svg>',
    wa: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm5.9 15.7c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5v-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.7.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.3.2-1.5l-.5-.2Z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v7h4v-7h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
  };
  var stars = function (n) { var s = ""; for (var i = 0; i < 5; i++) s += I.star; return '<span class="stars" aria-label="' + n + ' out of 5">' + s + "</span>"; };
  var btn = function (label, attrs, cls) { return '<button class="b ' + (cls || "") + '" ' + (attrs || "") + "><span>" + label + '</span><span class="arr">' + I.arr + "</span></button>"; };
  var lnk = function (label, href, cls) { return '<a class="b ' + (cls || "") + '" href="' + href + '"><span>' + label + '</span><span class="arr">' + I.arr + "</span></a>"; };
  var thumb = function (id, cls) { var p = P[id] || SETS[id]; return '<span class="ln__t ' + p.tcls + (cls ? " " + cls : "") + '"><img src="' + img(p.cut) + '" alt=""></span>'; };

  /* ---------------- Chrome ---------------- */
  function chrome() {
    var t = $("[data-ticker]");
    if (t) {
      var msgs = ["Free express delivery across the UAE", "Next day in Dubai &amp; Abu Dhabi", "Pay in 4 with Tabby or Tamara", "Cash on delivery", "Complimentary gift wrapping", "4.9★ from 336 verified reviews"];
      var row = msgs.map(function (m) { return "<span>" + m + "</span>"; }).join("");
      t.outerHTML = '<div class="ticker" aria-label="Store benefits"><div class="ticker__track">' + row + row + "</div></div>";
    }
    var h = $("[data-hdr]");
    if (h) {
      h.outerHTML = '<header class="hdr"><div class="hdr__bar">' +
        '<div style="display:flex;align-items:center;gap:4px"><button class="ib hdr__menu" data-mm-open aria-label="Open menu">' + I.menu + '</button><nav class="hdr__nav" aria-label="Primary"><a href="' + HOME + '#collection">Fragrances</a><a href="' + HOME + '#sets">Sets</a><a href="' + HOME + '#finder">Scent Finder</a><a href="' + HOME + '#story">Story</a></nav></div>' +
        '<a class="hdr__logo" href="' + HOME + '" aria-label="MEHAS home"><img src="' + img("logo.png") + '" alt="MEHAS" width="600" height="165"></a>' +
        '<div class="hdr__tools"><button class="ib" data-srch-open aria-label="Search">' + I.search + '</button><a class="ib hdr__acct" href="#" data-noop aria-label="Account">' + I.user + '</a><button class="ib ib--bag" data-cart-open aria-label="Open bag">' + I.bag + '<span class="cnt" data-cnt>0</span></button></div>' +
        "</div></header>";
    }
    var x = document.createElement("div");
    x.innerHTML =
      '<div class="mm" id="mm" aria-hidden="true"><div class="mm__top"><img src="' + img("logo.png") + '" alt="MEHAS"><button class="ib" style="color:#fff" data-close aria-label="Close menu">' + I.close + '</button></div><nav class="mm__links">' +
      ORDER.map(function (id) { return '<a href="' + PDP(id) + '">' + P[id].name + "<small>" + P[id].no + "</small></a>"; }).join("") +
      '<a href="' + HOME + '#sets">Sets &amp; gifts<small>04</small></a><a href="' + HOME + '#finder">Scent Finder<small>05</small></a><a href="' + HOME + '#story">Our story<small>06</small></a></nav><div class="mm__foot"><span>Free express UAE delivery</span><span>online@mehas.com</span></div></div>' +
      '<div class="srch" id="srch" aria-hidden="true"><div class="srch__box" role="dialog" aria-label="Search"><div class="srch__row">' + I.search + '<input type="search" placeholder="Search notes, moods…" aria-label="Search" data-q><button class="ib" data-close aria-label="Close search">' + I.close + '</button></div><div class="srch__res" data-res></div><p class="srch__hint">Try “vanilla”, “fresh”, “night”, “office”.</p></div></div>' +
      '<div class="scrim" data-scrim></div>' +
      '<aside class="drw" id="drw" aria-label="Your bag" aria-hidden="true"><div class="drw__h"><h2>Your bag<sup data-n></sup></h2><button class="ib" data-close aria-label="Close bag">' + I.close + '</button></div><div class="gbar" data-gbar></div><div class="drw__items" data-items></div><div data-ups></div>' +
      '<div class="drw__f"><label class="chk"><input type="checkbox" checked> Complimentary gift wrap &amp; handwritten note</label><div class="drw__sum"><span>Subtotal</span><b data-sub>AED 0</b></div>' + btn("Secure checkout", "data-checkout", "b--full") + "<small>Free express delivery · Tabby · Tamara · Cash on delivery</small></div></aside>" +
      '<div class="toast2" role="status" aria-live="polite" data-toast></div>' +
      '<a class="wa2" href="#" data-noop aria-label="Chat with a fragrance advisor on WhatsApp"><i>' + I.wa + "</i><span>Ask an advisor</span></a>" +
      '<nav class="vswitch" aria-label="Design versions"><a href="' + V1 + (IN_PDP ? location.search : "") + '">Design A</a><span aria-current="page">Design B</span></nav>';
    document.body.appendChild(x);
    var f = $("[data-foot]");
    if (f) {
      f.outerHTML = '<footer class="foot"><div class="wrap"><div class="foot__top">' +
        '<div class="foot__news"><h3>10% off your first signature.</h3><p>Early access to new compositions and gifting reminders before Eid &amp; Ramadan.</p><div data-news-wrap><form data-news novalidate><label class="sr-only" for="nl">Email</label><input id="nl" type="email" placeholder="Your email" autocomplete="email"><button class="b" type="submit">Join</button></form><small>No spam. Unsubscribe anytime.</small></div>' +
        '<div class="socials"><a href="https://www.instagram.com/mehasofficial/" target="_blank" rel="noopener" aria-label="Instagram">' + I.ig + '</a><a href="https://www.facebook.com/profile.php?id=61594731578189" target="_blank" rel="noopener" aria-label="Facebook">' + I.fb + '</a><a href="mailto:online@mehas.com" aria-label="Email">' + I.mail + "</a></div></div>" +
        "<div><h4>Fragrances</h4><ul>" + ORDER.map(function (id) { return '<li><a href="' + PDP(id) + '">' + P[id].name + "</a></li>"; }).join("") + '<li><a href="' + HOME + '#sets">The Trilogy</a></li><li><a href="' + HOME + '#sets">Discovery Set</a></li></ul></div>' +
        '<div><h4>Help</h4><ul><li><a href="' + HOME + '#faq">Delivery &amp; returns</a></li><li><a href="' + HOME + '#faq">FAQ</a></li><li><a href="' + HOME + '#finder">Scent Finder</a></li><li><a href="mailto:online@mehas.com">online@mehas.com</a></li></ul></div>' +
        '<div><h4>House</h4><ul><li><a href="' + HOME + '#story">Our story</a></li><li><a href="' + HOME + '#gifting">Gifting</a></li><li><a href="#" data-noop>Privacy policy</a></li><li><a href="#" data-noop>Terms</a></li></ul></div>' +
        '</div></div><div class="foot__mark"><img src="' + img("logo.png") + '" alt="" loading="lazy"></div><div class="wrap"><div class="foot__bot"><span>© 2026 MEHAS Perfumes UAE</span><div class="paym"><span>VISA</span><span>MASTERCARD</span><span>APPLE PAY</span><span>GOOGLE PAY</span><span>TABBY</span><span>TAMARA</span><span>COD</span></div></div></div></footer>';
    }
  }

  /* ---------------- Overlays ---------------- */
  var lastFocus;
  function open(id) {
    closeAll(); lastFocus = document.activeElement;
    var el = $("#" + id); el.classList.add(id === "drw" ? "on" : "is-open"); el.setAttribute("aria-hidden", "false");
    if (id === "drw") $("[data-scrim]").classList.add("on");
    document.documentElement.style.overflow = "hidden";
    setTimeout(function () { var c = el.querySelector(id === "srch" ? "input" : "[data-close]"); if (c) c.focus(); }, 80);
  }
  function closeAll() {
    ["mm", "srch", "drw"].forEach(function (id) { var el = $("#" + id); if (el) { el.classList.remove("on", "is-open"); el.setAttribute("aria-hidden", "true"); } });
    var s = $("[data-scrim]"); if (s) s.classList.remove("on");
    document.documentElement.style.overflow = "";
  }
  var tT;
  function toast(m) { var t = $("[data-toast]"); t.innerHTML = m; t.classList.add("on"); clearTimeout(tT); tT = setTimeout(function () { t.classList.remove("on"); }, 2600); }

  /* ---------------- Cart ---------------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem("mehas-cart-b") || "[]"); } catch (e) {}
  var save = function () { try { localStorage.setItem("mehas-cart-b", JSON.stringify(cart)); } catch (e) {} };
  var info = function (id) { if (P[id]) return { name: P[id].name, sub: "Eau de Parfum · 100 mL", price: P[id].price }; return { name: SETS[id].name, sub: SETS[id].sub, price: SETS[id].price }; };
  function add(id, q) {
    q = q || 1; var l = cart.filter(function (x) { return x.id === id; })[0];
    if (l) l.q += q; else cart.push({ id: id, q: q });
    save(); render();
    var c = $("[data-cnt]"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
    open("drw");
  }
  function render() {
    var n = 0, sub = 0; cart.forEach(function (l) { n += l.q; sub += info(l.id).price * l.q; });
    var c = $("[data-cnt]"); c.textContent = n; c.classList.toggle("has", n > 0);
    $("[data-n]").textContent = n ? "(" + n + ")" : "";
    $("[data-sub]").textContent = money(sub);
    var left = GIFT_AT - sub;
    $("[data-gbar]").innerHTML = (left > 0 ? "Add <b>" + money(left) + "</b> for a complimentary 10 mL travel spray" : "<b>Unlocked:</b> complimentary 10 mL travel spray ✦") + '<div class="gbar__t"><i style="width:' + Math.min(100, sub / GIFT_AT * 100) + '%"></i></div>';
    $("[data-items]").innerHTML = cart.length ? cart.map(function (l) {
      var it = info(l.id);
      return '<div class="ln">' + thumb(l.id) + "<div><h3>" + it.name + "</h3><small>" + it.sub + '</small><div class="stp"><button data-dec="' + l.id + '" aria-label="Decrease">−</button><span>' + l.q + '</span><button data-inc="' + l.id + '" aria-label="Increase">+</button></div><button class="rm" data-rm="' + l.id + '">Remove</button></div><span class="pr">' + money(it.price * l.q) + "</span></div>";
    }).join("") : '<div class="drw__empty"><h3>Your bag is empty</h3><p>Three signatures are waiting.</p>' + lnk("Explore fragrances", HOME + "#collection", "b--line") + "</div>";
    var ids = cart.map(function (l) { return l.id; });
    var up = ORDER.filter(function (id) { return ids.indexOf(id) < 0; })[0];
    $("[data-ups]").innerHTML = cart.length && ids.indexOf("trilogy") < 0 && up ? '<div class="ups">' + thumb(up) + "<div><small>Pairs beautifully</small><b>" + P[up].name + '</b> <span class="muted" style="font-size:12px">' + money(P[up].price) + "</span></div>" + '<button class="b b--sm" data-add="' + up + '"><span>Add</span></button></div>' : "";
  }

  /* ---------------- Search ---------------- */
  function search(q) {
    q = (q || "").toLowerCase().trim();
    var syn = { fresh: "citrus sea", sweet: "vanilla fruity", night: "nights evenings", evening: "evenings", office: "office daytime", oud: "woods", summer: "summer" };
    var res = ORDER.map(function (id) { return P[id]; }).filter(function (p) {
      if (!q) return true;
      var hay = [p.name, p.family, p.short, p.desc, p.notes.join(" "), p.wear.join(" "), p.best].join(" ").toLowerCase();
      return hay.indexOf(q) > -1 || (syn[q] && syn[q].split(" ").some(function (w) { return hay.indexOf(w) > -1; }));
    });
    $("[data-res]").innerHTML = res.length ? res.map(function (p) { return '<a href="' + PDP(p.id) + '"><span class="t ' + p.tcls + '"><img src="' + img(p.cut) + '" alt=""></span><span><b>' + p.name + "</b><small>" + p.family + "</small></span><small>" + money(p.price) + "</small></a>"; }).join("") : '<p class="srch__hint">No match. Try the <a href="' + HOME + '#finder">Scent Finder</a>.</p>';
  }

  /* ---------------- Global binds ---------------- */
  function bind() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("button, a"); if (!t) return;
      if (t.hasAttribute("data-noop")) { e.preventDefault(); toast("Prototype link — goes live in the Shopify build."); return; }
      if (t.hasAttribute("data-add")) { e.preventDefault(); add(t.getAttribute("data-add")); return; }
      if (t.hasAttribute("data-cart-open")) return open("drw");
      if (t.hasAttribute("data-mm-open")) return open("mm");
      if (t.hasAttribute("data-srch-open")) { open("srch"); search(""); return; }
      if (t.hasAttribute("data-close")) { closeAll(); if (lastFocus) lastFocus.focus(); return; }
      if (t.hasAttribute("data-checkout")) return toast("Opens Shopify’s secure checkout in the live store.");
      var id = t.getAttribute("data-inc") || t.getAttribute("data-dec") || t.getAttribute("data-rm");
      if (id) {
        cart = cart.map(function (l) { if (l.id === id) l.q += t.hasAttribute("data-inc") ? 1 : t.hasAttribute("data-dec") ? -1 : -l.q; return l; }).filter(function (l) { return l.q > 0; });
        save(); render(); return;
      }
      if (t.tagName === "A" && t.closest("#mm, #srch, #drw")) closeAll();
    });
    $("[data-scrim]").addEventListener("click", closeAll);
    $("#srch").addEventListener("click", function (e) { if (e.target.id === "srch") closeAll(); });
    $("[data-q]").addEventListener("input", function (e) { search(e.target.value); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeAll(); var lb = $(".lb2"); if (lb) lb.classList.remove("on"); } });

    // Header hide on scroll down / show on scroll up
    var hdr = $(".hdr"), lastY = 0;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      document.body.classList.toggle("at-top", !!$("[data-stage]") && y < window.innerHeight * .6);
      if (hdr) hdr.classList.toggle("is-hidden", y > 300 && y > lastY + 4);
      if (y < lastY - 4 || y < 300) hdr && hdr.classList.remove("is-hidden");
      lastY = y;
    }, { passive: true });
    if ($("[data-stage]") && window.scrollY < window.innerHeight * .6) document.body.classList.add("at-top");

    // Newsletter
    var nf = $("[data-news]");
    if (nf) nf.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nf.querySelector("input").value)) return toast("Please enter a valid email.");
      $("[data-news-wrap]").innerHTML = '<p class="foot__ok">Welcome to the House. Your code: <span class="code2">SIGNATURE10</span></p>';
    });

    // Reveals
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -10% 0px" });
      $$(".rv, .tile--last, .tline, [data-gauges]").forEach(function (el) { io.observe(el); });
    } else $$(".rv").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------------- Home: hero stage ---------------- */
  function stage() {
    var st = $("[data-stage]"); if (!st) return;
    var slides = ORDER.map(function (id, i) {
      var p = P[id], H = i ? "h2" : "h1";
      return '<div class="slide' + (i ? "" : " on") + '" data-slide="' + id + '" role="tabpanel" id="sl-' + id + '" aria-labelledby="pk-' + id + '"' + (i ? ' aria-hidden="true"' : "") + ">" +
        '<p class="slide__name" aria-hidden="true">' + p.name + "</p>" +
        '<div class="slide__info"><p class="kicker">No. ' + p.no + " — " + p.family + "</p><" + H + ">" + (i ? "" : '<span class="sr-only">MEHAS luxury perfumes, Dubai — </span>') + p.name + ", <i>" + p.tagline.toLowerCase() + ".</i></" + H + "><p>" + p.short + "</p>" +
        '<div class="slide__cta">' + btn("Add to bag · " + money(p.price), 'data-add="' + id + '"', "b--light") + lnk("Discover", PDP(id), "b--line") + "</div>" +
        '<div class="slide__meta"><span>' + stars(p.rating) + " " + p.rating + " (" + p.reviews + ")</span><span>" + I.check.replace("<svg", '<svg width="14" height="14"') + "Free next-day delivery</span></div></div>" +
        '<div class="slide__bottle"><div class="float"><img src="' + img(p.cut) + '" alt="' + p.name + ' Eau de Parfum bottle"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + "></div></div>" +
        '<div class="slide__notes"><p class="slide__price">' + money(p.price) + "<small>Eau de Parfum · 100 mL · or 4 × AED 50</small></p><dl><div><dt>Top</dt><dd>" + p.notes[0] + "</dd></div><div><dt>Heart</dt><dd>" + p.notes[1] + "</dd></div><div><dt>Base</dt><dd>" + p.notes[2] + "</dd></div><div><dt>Wear</dt><dd>" + p.best + "</dd></div></dl></div></div>";
    }).join("");
    var picks = ORDER.map(function (id, i) { var p = P[id]; return '<button class="pick" role="tab" id="pk-' + id + '" aria-controls="sl-' + id + '" aria-selected="' + (i === 0) + '" data-pick="' + id + '"><img src="' + img(p.cut) + '" alt=""><span><small>' + p.family + "</small><b>" + p.name + '</b></span><span class="num">' + p.no + '</span><i class="bar"></i></button>'; }).join("");
    st.querySelector("[data-slides]").innerHTML = slides;
    st.querySelector("[data-picker]").innerHTML = picks;
    var bgs = $$(".stage__bg i", st), cur = 0, timer, DUR = 7000;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function go(i, user) {
      if (i === cur && !user) return;
      var prev = $$(".slide", st)[cur];
      prev.classList.remove("on"); prev.classList.add("out"); prev.setAttribute("aria-hidden", "true");
      setTimeout(function () { prev.classList.remove("out"); }, 700);
      cur = i;
      var s = $$(".slide", st)[i]; s.classList.add("on"); s.removeAttribute("aria-hidden");
      st.setAttribute("data-tone", ORDER[i]);
      bgs.forEach(function (b, k) { b.classList.toggle("on", k === i); });
      $$(".pick", st).forEach(function (p, k) { p.setAttribute("aria-selected", k === i); var bar = p.querySelector(".bar"); bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; });
      loop();
    }
    function loop() { clearTimeout(timer); if (reduce || st.classList.contains("paused")) return; timer = setTimeout(function () { go((cur + 1) % ORDER.length); }, DUR); }
    st.style.setProperty("--dur", DUR / 1000 + "s");
    $$(".pick", st).forEach(function (p, k) {
      p.addEventListener("click", function () { go(k, true); });
      p.addEventListener("keydown", function (e) { var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return; var n = (k + d + 3) % 3; go(n, true); $$(".pick", st)[n].focus(); });
    });
    // pause while the visitor is interacting with the copy / CTA, or tab hidden
    var pauseOn = function () { st.classList.add("paused"); clearTimeout(timer); };
    var pauseOff = function () { st.classList.remove("paused"); loop(); };
    $$(".slides", st).forEach(function (el) { el.addEventListener("mouseenter", pauseOn); el.addEventListener("mouseleave", pauseOff); el.addEventListener("focusin", pauseOn); el.addEventListener("focusout", pauseOff); });
    document.addEventListener("visibilitychange", function () { document.hidden ? pauseOn() : pauseOff(); });
    if (reduce) st.classList.add("paused");
    loop();
    // Mouse parallax on bottle
    if (!reduce && window.matchMedia("(pointer:fine)").matches) {
      st.addEventListener("mousemove", function (e) {
        var r = st.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        var b = $(".slide.on .slide__bottle", st); if (b) b.style.transform = "translate3d(" + (x * 24).toFixed(1) + "px," + (y * 16).toFixed(1) + "px,0) rotate(" + (x * 4).toFixed(2) + "deg)";
        var n = $(".slide.on .slide__name", st); if (n) n.style.marginLeft = (x * -40).toFixed(1) + "px";
      });
    }
  }

  /* ---------------- Home: manifesto word reveal ---------------- */
  function manifesto() {
    var m = $("[data-mani]"); if (!m) return;
    // wrap words (keep inline images intact)
    Array.prototype.slice.call(m.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (w) { if (!w) return; if (/^\s+$/.test(w)) frag.appendChild(document.createTextNode(w)); else { var s = document.createElement("span"); s.className = "w"; s.textContent = w; frag.appendChild(s); } });
        m.replaceChild(frag, n);
      } else if (n.nodeType === 1) n.classList.add("w");
    });
    var ws = $$(".w", m);
    var tick = function () {
      var r = m.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
      var k = Math.round(p * ws.length);
      ws.forEach(function (w, i) { w.classList.toggle("on", i < k); });
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { ws.forEach(function (w) { w.classList.add("on"); }); return; }
    window.addEventListener("scroll", function () { requestAnimationFrame(tick); }, { passive: true }); tick();
  }

  /* ---------------- Home: arches + trilogy ---------------- */
  function arches() {
    var a = $("[data-arches]"); if (!a) return;
    var tag = { monarch: "Bestseller", silverback: "Everyday signature", "beast-mode": "Most complimented" };
    a.innerHTML = ORDER.map(function (id, i) {
      var p = P[id];
      return '<article class="arch arch--' + id + ' rv rv-d' + (i + 1) + '"><a class="arch__frame" href="' + PDP(id) + '" aria-label="' + p.name + '"><span class="arch__tag">' + tag[id] + '</span><span class="big" aria-hidden="true">' + p.no + '</span><img class="bt" src="' + img(p.cut) + '" alt="' + p.name + ' bottle" loading="lazy"></a>' +
        '<div class="arch__reveal">' + btn("Add to bag · " + money(p.price), 'data-add="' + id + '"', "b--light b--full") + "</div>" +
        '<div class="arch__body"><h3><a href="' + PDP(id) + '">' + p.name + '</a></h3><span class="pr">' + money(p.price) + "</span><p>" + p.family + " — " + p.short + '</p><span class="rt">' + stars(p.rating) + " " + p.rating + " · " + p.reviews + " reviews</span>" +
        '<div class="arch__m-add">' + btn("Add to bag", 'data-add="' + id + '"', "b--full") + "</div></div></article>";
    }).join("");
  }

  /* ---------------- Home: bento live ETA ---------------- */
  function dubaiNow() { var n = new Date(); return new Date(n.getTime() + (n.getTimezoneOffset() + 240) * 60000); }
  function eta() {
    var els = $$("[data-clock]"); if (!els.length) return;
    var t = function () {
      var d = dubaiNow(), cut = new Date(d); cut.setHours(18, 0, 0, 0);
      var txt, sub;
      if (d < cut) { var s = Math.floor((cut - d) / 1000); var hh = Math.floor(s / 3600), mm = Math.floor(s % 3600 / 60), ss = s % 60; txt = hh + "h " + ("0" + mm).slice(-2) + "m " + ("0" + ss).slice(-2) + "s"; sub = "left to order for <b>tomorrow</b> in Dubai &amp; Abu Dhabi"; }
      else { txt = "Order tonight"; sub = "for delivery in <b>2 days</b> in Dubai &amp; Abu Dhabi"; }
      els.forEach(function (e) { e.innerHTML = txt; var n = e.nextElementSibling; if (n) n.innerHTML = sub + " · free express delivery"; });
    };
    t(); setInterval(t, 1000);
  }

  /* ---------------- Home: quiz ---------------- */
  var QUIZ = [
    { q: "When do you most want to be <i>noticed?</i>", o: [["☾", "Evenings & occasions", "monarch"], ["☀", "Every day, at work", "silverback"], ["✦", "Nights out", "beast-mode"], ["∞", "All the time", "beast-mode"]] },
    { q: "Which of these <i>draws you in?</i>", o: [["◐", "Vanilla & incense", "monarch"], ["≈", "Sea air & citrus", "silverback"], ["❀", "Juicy fruit & florals", "beast-mode"], ["▲", "Suede & woods", "silverback"]] },
    { q: "After you leave the room, they say you were…", o: [["♛", "Regal", "monarch"], ["◆", "Composed", "silverback"], ["✸", "Unforgettable", "beast-mode"], ["◇", "Mysterious", "monarch"]] }
  ];
  function quiz() {
    var root = $("[data-quiz]"); if (!root) return;
    var ans = [];
    var bar = function (n) { $("[data-quiz-bar]").innerHTML = QUIZ.map(function (_, i) { return "<i" + (i < n ? ' class="on"' : "") + "></i>"; }).join(""); };
    function ask() {
      var i = ans.length; if (i >= QUIZ.length) return result();
      bar(i + 1);
      root.innerHTML = '<div class="quiz__panel"><p class="kicker">Question ' + (i + 1) + " / " + QUIZ.length + '</p><h3 class="quiz__q">' + QUIZ[i].q + '</h3><div class="quiz__opts">' +
        QUIZ[i].o.map(function (o, k) { return '<button class="quiz__opt" data-k="' + k + '"><span aria-hidden="true">' + o[0] + "</span>" + o[1] + "</button>"; }).join("") + "</div>" + (i ? '<button class="quiz__back" data-back>← Previous question</button>' : '<p class="quiz__hint">3 questions · 20 seconds · no email needed</p>') + "</div>";
    }
    function result() {
      bar(3);
      var sc = {}; ans.forEach(function (a) { sc[a] = (sc[a] || 0) + 1; });
      var best = ans[ans.length - 1]; Object.keys(sc).forEach(function (k) { if (sc[k] > sc[best]) best = k; });
      var p = P[best], m = sc[best] === 3 ? 98 : sc[best] === 2 ? 91 : 84;
      root.innerHTML = '<div class="quiz__panel quiz__res"><div class="arch arch--' + best + '"><a class="arch__frame" href="' + PDP(best) + '"><span class="big" aria-hidden="true">' + p.no + '</span><img class="bt" src="' + img(p.cut) + '" alt="' + p.name + '"></a></div><div><span class="match">' + m + "% match</span><h3>" + p.name + "</h3><p>" + p.short + " Made for " + p.best.toLowerCase() + '.</p><div class="btns">' + btn("Add to bag · " + money(p.price), 'data-add="' + best + '"') + lnk("Explore " + p.name, PDP(best), "b--line") + '</div><button class="quiz__back" data-again>↺ Retake</button></div></div>';
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-k")) { ans.push(QUIZ[ans.length].o[+b.getAttribute("data-k")][2]); ask(); }
      else if (b.hasAttribute("data-back")) { ans.pop(); ask(); }
      else if (b.hasAttribute("data-again")) { ans = []; ask(); }
    });
    ask();
  }

  /* ---------------- Home: compare ---------------- */
  function compare() {
    var c = $("[data-compare]"); if (!c) return;
    var dots = function (v) { var s = ""; for (var i = 0; i < 5; i++) s += "<i" + (i < v[0] ? ' class="on"' : "") + "></i>"; return '<span class="dots">' + s + "</span>" + v[1]; };
    var rows = [["Character", function (p) { return p.vibe; }], ["Notes", function (p) { return p.notes.join(" · "); }], ["Best for", function (p) { return p.best; }], ["Longevity", function (p) { return dots(p.perf.longevity); }], ["Projection", function (p) { return dots(p.perf.projection); }], ["Season", function (p) { return p.season; }], ["", function (p) { return btn("Add · " + money(p.price), 'data-add="' + p.id + '"', "b--sm"); }]];
    c.innerHTML = '<table><caption class="sr-only">Compare MEHAS fragrances</caption><thead><tr><th scope="col"><span class="sr-only">Attribute</span></th>' + ORDER.map(function (id) { var p = P[id]; return '<th scope="col"><a class="cmp__head" href="' + PDP(id) + '" style="text-decoration:none"><span class="t ' + p.tcls + '"><img src="' + img(p.cut) + '" alt="" loading="lazy"></span><span><b>' + p.name + "</b><small>" + p.family + "</small></span></a></th>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function (r) { return "<tr><th scope=\"row\">" + r[0] + "</th>" + ORDER.map(function (id) { return "<td>" + r[1](P[id]) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table>";
  }

  /* ---------------- Story parallax ---------------- */
  function parallax() {
    var im = $("[data-par]"); if (!im || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var box = im.parentNode;
    window.addEventListener("scroll", function () {
      requestAnimationFrame(function () { var r = box.getBoundingClientRect(), vh = window.innerHeight; if (r.bottom < 0 || r.top > vh) return; var p = (r.top + r.height / 2 - vh / 2) / vh; im.style.transform = "translate3d(0," + (-8 + p * -12).toFixed(2) + "%,0)"; });
    }, { passive: true });
  }

  /* ---------------- Product page ---------------- */
  function pdp() {
    var root = $("[data-pdp]"); if (!root) return;
    var id = new URLSearchParams(location.search).get("p"); if (!P[id]) id = "monarch";
    var p = P[id];
    document.title = p.name + " — " + p.family + " Eau de Parfum | MEHAS";
    document.documentElement.style.setProperty("--tone", p.tone);
    $$("[data-f]").forEach(function (el) { var k = el.getAttribute("data-f"); el.innerHTML = k === "price" ? money(p.price) : p[k]; });

    // Stage views
    var ps = $("[data-pstage]"); ps.setAttribute("data-tone", id);
    var views = [["Bottle", '<div class="pview pview--bottle on"><img src="' + img(p.cut) + '" alt="' + p.name + ' Eau de Parfum bottle" fetchpriority="high" data-zoom="' + img(p.img) + '"></div>'],
      ["Gift box", '<div class="pview pview--photo"><figure><img src="' + img(p.box) + '" alt="' + p.name + ' gift box" loading="lazy" data-zoom="' + img(p.box) + '"></figure></div>'],
      ["Mood", '<div class="pview pview--photo"><figure><img src="' + img(p.mood) + '" alt="" loading="lazy"></figure></div>'],
      ["Notes", '<div class="pview pview--notes"><div class="ncard"><h3>The composition</h3><ol><li><small>Top</small><span>' + p.notes[0] + "</span></li><li><small>Heart</small><span>" + p.notes[1] + "</span></li><li><small>Base</small><span>" + p.notes[2] + "</span></li></ol></div></div>"]];
    ps.querySelector("[data-views]").innerHTML = views.map(function (v) { return v[1]; }).join("");
    ps.querySelector("[data-thumbs]").innerHTML = views.map(function (v, i) { return '<button role="tab" aria-selected="' + (i === 0) + '" data-v="' + i + '">' + v[0] + "</button>"; }).join("");
    var cur = 0;
    var show = function (i) { cur = (i + views.length) % views.length; $$(".pview", ps).forEach(function (v, k) { v.classList.toggle("on", k === cur); }); $$("[data-v]", ps).forEach(function (b, k) { b.setAttribute("aria-selected", k === cur); }); };
    ps.addEventListener("click", function (e) {
      var b = e.target.closest("[data-v]"); if (b) return show(+b.getAttribute("data-v"));
      if (e.target.closest("[data-prev]")) return show(cur - 1);
      if (e.target.closest("[data-next]")) return show(cur + 1);
      var z = e.target.closest("[data-zoom]"); if (z) { var lb = $(".lb2"); lb.querySelector("img").src = z.getAttribute("data-zoom"); lb.classList.add("on"); }
    });
    // swipe
    var sx = null;
    ps.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    ps.addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1)); sx = null; });
    // tilt
    if (window.matchMedia("(pointer:fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ps.addEventListener("mousemove", function (e) { var r = ps.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; var im = $(".pview--bottle img", ps); if (im) im.style.transform = "translate3d(" + (x * 20).toFixed(1) + "px," + (y * 14).toFixed(1) + "px,0) rotate(" + (x * 3).toFixed(2) + "deg)"; });
    }
    var lb = document.createElement("div"); lb.className = "lb2"; lb.innerHTML = '<img alt="">'; document.body.appendChild(lb);
    lb.addEventListener("click", function () { lb.classList.remove("on"); });

    $("[data-rate]").innerHTML = stars(p.rating) + " <b>" + p.rating + '</b> <a href="#reviews">' + p.reviews + " reviews</a>";
    // Formats
    $("[data-fmts]").innerHTML =
      '<label class="fmt"><input type="radio" name="fmt" value="' + id + '" checked><b>100 mL</b><small>Signature bottle</small><span class="p">' + money(p.price) + "</span></label>" +
      '<label class="fmt"><span class="fl">Save 60</span><input type="radio" name="fmt" value="trilogy"><b>The Trilogy</b><small>All three · 100 mL</small><span class="p">' + money(540) + "</span></label>" +
      '<label class="fmt"><input type="radio" name="fmt" value="discovery"><b>Discovery</b><small>3 × 10 mL · credit back</small><span class="p">' + money(95) + "</span></label>";
    var q = 1;
    var sel = function () { return $("input[name=fmt]:checked").value; };
    var upd = function () { var pr = info(sel()).price * q; $("[data-atc]").querySelector("span").textContent = "Add to bag — " + money(pr); $("[data-q]").textContent = q; $("[data-inst]").textContent = money(Math.ceil(pr / 4 * 100) / 100); $("[data-sprice]").textContent = money(pr) + " · Free express delivery"; };
    $("[data-fmts]").addEventListener("change", upd);
    $("[data-qm]").addEventListener("click", function () { q = Math.max(1, q - 1); upd(); });
    $("[data-qp]").addEventListener("click", function () { q = Math.min(10, q + 1); upd(); });
    var atc = function () { add(sel(), q); };
    $("[data-atc]").addEventListener("click", atc);
    $("[data-satc]").addEventListener("click", atc);
    $$("[data-express]").forEach(function (b) { b.addEventListener("click", function () { toast("Express checkout opens in the live store."); }); });
    upd();

    // ETA
    var etaT = function () {
      var d = dubaiNow(), cut = new Date(d); cut.setHours(18, 0, 0, 0);
      var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var m = Math.floor((cut - d) / 60000);
      $("[data-eta]").innerHTML = d < cut ? "Order within <b>" + Math.floor(m / 60) + "h " + m % 60 + "m</b> — arrives <b>tomorrow</b> in Dubai &amp; Abu Dhabi" : "Order now — arrives <b>" + days[(d.getDay() + 2) % 7] + "</b> in Dubai &amp; Abu Dhabi";
    };
    etaT(); setInterval(etaT, 30000);

    // Tabs
    var tabs = [["Details", '<dl><div><dt>Family</dt><dd>' + p.family + "</dd></div><div><dt>Top</dt><dd>" + p.notes[0] + "</dd></div><div><dt>Heart</dt><dd>" + p.notes[1] + "</dd></div><div><dt>Base</dt><dd>" + p.notes[2] + "</dd></div><div><dt>Best for</dt><dd>" + p.best + "</dd></div><div><dt>Size</dt><dd>100 mL Eau de Parfum</dd></div></dl>"],
      ["Story", "<p>" + p.story + "</p>"],
      ["How to wear", "<p>Spray 2–3 times on the neck and chest from 15 cm. Don’t rub. Mist lightly onto fabric (kandura, abaya, jacket) for a trail that lasts into the next day. Apply over moisturised skin for maximum longevity.</p>"],
      ["Delivery", "<p>Free express delivery across the UAE: next day in Dubai &amp; Abu Dhabi when ordered before 6pm, 2–3 working days to other Emirates. Cash on delivery available. Unopened bottles can be returned within 14 days.</p>"]];
    $("[data-tabs]").innerHTML = '<div class="ptabs__bar" role="tablist">' + tabs.map(function (t, i) { return '<button role="tab" id="tb' + i + '" aria-controls="tp' + i + '" aria-selected="' + (i === 0) + '">' + t[0] + "</button>"; }).join("") + "</div>" + tabs.map(function (t, i) { return '<div class="ptabs__p" role="tabpanel" id="tp' + i + '" aria-labelledby="tb' + i + '"' + (i ? " hidden" : "") + ">" + t[1] + "</div>"; }).join("");
    $$("[data-tabs] [role=tab]").forEach(function (b, i, all) { b.addEventListener("click", function () { all.forEach(function (x, k) { x.setAttribute("aria-selected", k === i); $("#tp" + k).hidden = k !== i; }); }); });

    // Timeline
    $("[data-phases]").innerHTML = p.phases.map(function (ph, i) { return '<div class="tphase rv rv-d' + (i + 1) + '"><span class="when">' + ph[0] + "</span><div><h3>" + ph[1] + "</h3><p>" + ph[2] + '</p></div><span class="ph" aria-hidden="true">0' + (i + 1) + "</span></div>"; }).join("");
    // Gauges
    var g = function (lab, v) { var off = 314 - 314 * v[0] / 5; return '<div class="gauge"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="bg" cx="60" cy="60" r="50"/><circle class="fg" cx="60" cy="60" r="50" data-off="' + off + '"/><text x="60" y="70" text-anchor="middle">' + v[0] + "/5</text></svg><div><small>" + lab + "</small><b>" + v[1] + "</b></div></div>"; };
    $("[data-gauges]").innerHTML = g("Longevity", p.perf.longevity) + g("Projection", p.perf.projection) + g("Intensity", p.perf.intensity) + '<div class="gauge gauge--wear"><small>Wear it for</small><b>' + p.vibe + '</b><div class="chips">' + p.wear.map(function (w) { return "<span>" + w + "</span>"; }).join("") + "</div></div>";
    var gEl = $("[data-gauges]");
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { $$(".fg", gEl).forEach(function (c) { c.style.strokeDashoffset = c.getAttribute("data-off"); }); o.disconnect(); } }, { threshold: .3 }).observe(gEl);
    } else $$(".fg", gEl).forEach(function (c) { c.style.strokeDashoffset = c.getAttribute("data-off"); });

    // Reviews
    $("[data-rscore]").textContent = p.rating; $("[data-rcount]").textContent = p.reviews;

    // Pair
    var others = ORDER.filter(function (k) { return k !== id; });
    $("[data-pair]").innerHTML = others.map(function (k, i) {
      var o = P[k];
      return '<article class="arch arch--' + k + ' rv rv-d' + (i + 1) + '"><a class="arch__frame" href="' + PDP(k) + '"><span class="big" aria-hidden="true">' + o.no + '</span><img class="bt" src="' + img(o.cut) + '" alt="' + o.name + '" loading="lazy"></a><div class="arch__reveal">' + btn("Add · " + money(o.price), 'data-add="' + k + '"', "b--light b--full") + '</div><div class="arch__body"><h3><a href="' + PDP(k) + '">' + o.name + '</a></h3><span class="pr">' + money(o.price) + "</span><p>" + o.family + '</p><div class="arch__m-add">' + btn("Add to bag", 'data-add="' + k + '"', "b--full") + "</div></div></article>";
    }).join("") + '<div class="set set--dark rv rv-d3"><div class="set__vis"><img src="' + img("cut-silverback.webp") + '" alt="" loading="lazy"><img src="' + img("cut-monarch.webp") + '" alt="" loading="lazy" style="z-index:2;height:86%"><img src="' + img("cut-beast-mode.webp") + '" alt="" loading="lazy"></div><span class="save-pill flag">Save AED 60</span><h3>Own all three.</h3><p>The Trilogy: one for day, one for occasions, one for the night.</p><div class="row"><span class="pr"><s>AED 600</s>AED 540</span>' + btn("Add the Trilogy", 'data-add="trilogy"') + "</div></div>";

    // Sticky
    $("[data-sthumb]").innerHTML = thumb(id);
    var satc = $(".satc"), trig = $("[data-atc]");
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { var e = es[0], on = !e.isIntersecting && e.boundingClientRect.top < 0; satc.classList.toggle("on", on); document.body.classList.toggle("sticky-on", on); }).observe(trig);
  }

  /* ---------------- Boot ---------------- */
  chrome();
  stage(); arches(); quiz(); compare(); pdp();
  bind(); render(); manifesto(); eta(); parallax();
})();
