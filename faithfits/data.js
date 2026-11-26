/* FaithFits shared catalogue + cart storage (names, colors, photos from faithfitswear.com) */
(function () {
  "use strict";
  var ROOT = window.FF_ROOT || "";
  var COLORS = {
    maroon:   { word: "Chosen",    color: "Maroon",        hex: "#6b1d2c", ref: "1 Peter 2:9",         verse: "But ye are a chosen generation, a royal priesthood.", meaning: "You were picked on purpose, for this work and for these people." },
    ceil:     { word: "Covered",   color: "Ceil Blue",     hex: "#6fa0d6", ref: "Psalm 91:4",          verse: "He shall cover thee with his feathers, and under his wings shalt thou trust.", meaning: "On the longest night shift, you are not unprotected." },
    navy:     { word: "Anchored",  color: "Navy Blue",     hex: "#1f2a48", ref: "Hebrews 6:19",        verse: "Which hope we have as an anchor of the soul, both sure and stedfast.", meaning: "When the floor gets chaotic, your hope holds steady." },
    black:    { word: "Blessed",   color: "Black",         hex: "#151515", ref: "Numbers 6:24",        verse: "The Lord bless thee, and keep thee.", meaning: "A blessing to carry in, and a blessing to give away." },
    red:      { word: "Redeemed",  color: "Red",           hex: "#d42037", ref: "Ephesians 1:7",       verse: "In whom we have redemption through his blood.", meaning: "Grace for the hard days, and a fresh start every shift." },
    pink:     { word: "Loved",     color: "Pink",          hex: "#e9a3b4", ref: "1 John 4:19",         verse: "We love him, because he first loved us.", meaning: "You can pour out care because you were cared for first." },
    purple:   { word: "Crowned",   color: "Purple",        hex: "#6a4bb0", ref: "Psalm 103:4",         verse: "Who crowneth thee with lovingkindness and tender mercies.", meaning: "Tender mercy, given to you so you can give it to others." },
    teal:     { word: "Called",    color: "Teal",          hex: "#1fb2b6", ref: "Romans 8:28",         verse: "All things work together for good… to them who are the called.", meaning: "This is not just a job. It's a calling with a purpose." },
    gray:     { word: "Rooted",    color: "Gray",          hex: "#b0aca6", ref: "Colossians 2:7",      verse: "Rooted and built up in him, and stablished in the faith.", meaning: "Deep roots keep you standing when the day pulls hard." },
    charcoal: { word: "Steadfast", color: "Charcoal Gray", hex: "#45464a", ref: "1 Corinthians 15:58", verse: "Be ye stedfast, unmoveable, always abounding in the work of the Lord.", meaning: "Your work is never in vain. Stand firm." },
    royal:    { word: "Faithful",  color: "Royal Blue",    hex: "#1f6fd1", ref: "Lamentations 3:23",   verse: "They are new every morning: great is thy faithfulness.", meaning: "New mercies for every 7 a.m. handoff." },
    green:    { word: "Grounded",  color: "Green",         hex: "#1d5a44", ref: "Ephesians 3:17",      verse: "That ye, being rooted and grounded in love…", meaning: "Grounded in love, so you can lead with it." },
    coral:    { word: "Clothed",   color: "Coral",         hex: "#ef8a7e", ref: "Colossians 3:12",     verse: "Put on… a heart of compassion, kindness, humility.", meaning: "Compassion is the uniform underneath the uniform." }
  };
  var ORDER = ["maroon", "ceil", "navy", "black", "red", "pink", "purple", "teal", "gray", "charcoal", "royal"];
  var WIDE = ["royal", "teal", "navy", "maroon", "green", "coral"];
  var BADGES = { maroon: "Best seller", navy: "Best seller", ceil: "Most loved", black: "Best seller" };
  var GALLERY = { "wl-royal": 4, "wl-green": 4 };
  var PRODUCTS = [];
  function mk(prefix, line, c, i, type, isNew) {
    var id = prefix + c, n = GALLERY[id] || 5, imgs = [];
    for (var k = 1; k <= n; k++) imgs.push(ROOT + "images/" + id + (k === 1 ? "" : "-" + k) + ".jpg");
    return { id: id, line: line, c: c, img: imgs[0], img2: imgs[1], imgs: imgs, type: type, rank: i, isNew: !!isNew };
  }
  ORDER.forEach(function (c, i) {
    PRODUCTS.push(mk("w-", "women", c, i, "Jogger set"));
    PRODUCTS.push(mk("m-", "men", c, i, "Jogger set"));
  });
  WIDE.forEach(function (c, i) { PRODUCTS.push(mk("wl-", "wide", c, i, "Wide leg set", true)); });

  function byId(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  function title(p) { var c = COLORS[p.c]; return c.word + " in " + c.color; }
  function lineLabel(p) { return p.line === "men" ? "Men's" : "Women's"; }
  function url(p) { return ROOT + "product/?p=" + p.id; }
  function sibling(line, c) { return byId((line === "wide" ? "wl-" : line[0] + "-") + c); }

  /* cart persisted per browser so it follows the shopper from home page to PDP */
  function loadCart() {
    try {
      var raw = JSON.parse(localStorage.getItem("ff_cart") || "[]");
      return raw.map(function (x) { var p = byId(x.id); return p ? { key: x.id + "|" + x.t + "|" + x.b, p: p, t: x.t, b: x.b, qty: x.qty } : null; }).filter(Boolean);
    } catch (e) { return []; }
  }
  function saveCart(cart) {
    try { localStorage.setItem("ff_cart", JSON.stringify(cart.map(function (x) { return { id: x.p.id, t: x.t, b: x.b, qty: x.qty }; }))); } catch (e) {}
  }

  window.FF = { ROOT: ROOT, COLORS: COLORS, ORDER: ORDER, WIDE: WIDE, BADGES: BADGES, PRODUCTS: PRODUCTS, PRICE: 120, SIZES: ["XS", "S", "M", "L", "XL"],
    byId: byId, title: title, lineLabel: lineLabel, url: url, sibling: sibling, loadCart: loadCart, saveCart: saveCart };
})();
