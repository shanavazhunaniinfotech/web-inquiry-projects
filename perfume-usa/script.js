/* Perfume USA: homepage concept interactions */
(function () {
  "use strict";

  const U = (id, w) => `https://images.unsplash.com/${id}?w=${w || 700}&q=78&auto=format&fit=crop`;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const money = n => "$" + n.toFixed(2);

  /* ---------------- Image library ---------------- */
  const IMG = {
    no5: "photo-1541643600914-78b084683601",
    cocoMlle: "photo-1592945403244-b3fbafd7f539",
    cocoMlleDark: "photo-1592914610354-fd354ea45e48",
    cocoNoirRose: "photo-1594035910387-fea47794261f",
    cocoNoir: "photo-1592842232655-e5d345cbc2d0",
    cocoNoirPink: "photo-1585386959984-a4155224a1ad",
    bleu: "photo-1523293182086-7651a899d37f",
    amber: "photo-1588405748880-12d1d2a59f75",
    vintage: "photo-1615634260167-c8cdede054de",
    miumiu: "photo-1557170334-a9632e77c6e4",
    gabrielle: "photo-1563170351-be82bc888aa4",
    prada: "photo-1610461888750-10bfc601b874",
    gio: "photo-1619994403073-2cec844b8e63",
    red: "photo-1608528577891-eb055944f2e7",
    eros: "photo-1587017539504-67cfbddac569",
    opium: "photo-1600612253971-422e7f7faeb6",
    theOne: "photo-1616949755610-8c9bbc08f138",
    lavie: "photo-1613521140785-e85e427f8002",
    goldBottles: "photo-1622618991746-fe6004db3a47",
    candy: "photo-1630573133526-8d090e0269af",
    eauPremiere: "photo-1585120040315-2241b774ad0f",
    vials: "photo-1602928321679-560bb453f190",
    redCap: "photo-1615160460367-dcccd27e11ad",
    darkWood: "photo-1588514912908-8f5891714f8d",
    bar: "photo-1557827983-012eb6ea8dc1",
    laurissi: "photo-1566977776052-6e61e35bf9be",
    clear: "photo-1594125311687-3b1b3eafa9f4",
    dropper: "photo-1608571423902-eed4a5ad8108"
  };

  /* ---------------- Products ----------------
     Each product holds its fragrance types; each type holds its own sizes and prices.
     This mirrors how the Shopify product will be set up: Option 1 = Type, Option 2 = Size. */
  const sz = (a, b, c, r) => [
    { s: "1.0 oz", ml: "30 ml", p: a, r: r[0] },
    { s: "1.7 oz", ml: "50 ml", p: b, r: r[1] },
    { s: "3.4 oz", ml: "100 ml", p: c, r: r[2] }
  ];
  const P = [
    { id: "coco-mlle", brand: "Chanel", name: "Coco Mademoiselle", img: IMG.cocoMlle, badge: "Best Seller", rating: 4.9, reviews: 2318,
      notes: "Fresh orange, May rose and jasmine over a sensual patchouli and vetiver base.",
      types: { EDP: sz(89, 118, 152, [118, 152, 195]), EDT: sz(72, 96, 124, [98, 128, 162]) }, tags: ["her", "floral", "evening", "edp"] },
    { id: "bleu", brand: "Chanel", name: "Bleu de Chanel", img: IMG.bleu, badge: "Best Seller", rating: 4.9, reviews: 3104,
      notes: "Grapefruit and incense with a dry cedar and sandalwood trail. Effortlessly modern.",
      types: { EDP: sz(92, 121, 158, [120, 155, 200]), EDT: sz(76, 99, 128, [100, 130, 165]), Parfum: sz(108, 139, 179, [140, 180, 225]) }, tags: ["him", "woody", "signature", "edp"] },
    { id: "eros", brand: "Versace", name: "Eros", img: IMG.eros, badge: "-48%", rating: 4.8, reviews: 1876,
      notes: "Mint, green apple and tonka bean wrapped in Madagascar vanilla.",
      types: { EDT: sz(39, 52, 68, [72, 98, 126]), EDP: sz(46, 61, 79, [84, 112, 142]) }, tags: ["him", "fresh", "evening", "edt"] },
    { id: "opium", brand: "Yves Saint Laurent", name: "Black Opium", img: IMG.opium, badge: "Trending", rating: 4.8, reviews: 2210,
      notes: "Black coffee, white flowers and vanilla: addictive, glamorous, after-dark.",
      types: { EDP: sz(74, 98, 129, [105, 135, 168]), Parfum: sz(88, 116, 149, [120, 152, 190]) }, tags: ["her", "gourmand", "evening", "parfum"] },
    { id: "gio", brand: "Giorgio Armani", name: "Acqua di Giò", img: IMG.gio, badge: "-41%", rating: 4.7, reviews: 2890,
      notes: "Marine notes, bergamot and rosemary over white musk. The original aquatic.",
      types: { EDT: sz(52, 69, 88, [82, 110, 140]), EDP: sz(61, 82, 105, [95, 125, 155]) }, tags: ["him", "fresh", "day", "edt"] },
    { id: "luna", brand: "Prada", name: "Luna Rossa Carbon", img: IMG.prada, badge: "", rating: 4.7, reviews: 964,
      notes: "Bergamot, lavender and a mineral, metallic ambroxan heart.",
      types: { EDT: sz(48, 64, 84, [80, 106, 135]) }, tags: ["him", "woody", "day", "edt"] },
    { id: "lavie", brand: "Lancôme", name: "La Vie Est Belle", img: IMG.lavie, badge: "Best Seller", rating: 4.9, reviews: 2655,
      notes: "Iris, praline and vanilla: a joyful, luminous gourmand floral.",
      types: { EDP: sz(64, 86, 112, [98, 128, 162]), EDT: sz(54, 72, 94, [84, 110, 140]) }, tags: ["her", "gourmand", "signature", "edp"] },
    { id: "theone", brand: "Dolce & Gabbana", name: "The One for Men", img: IMG.theOne, badge: "-45%", rating: 4.8, reviews: 1432,
      notes: "Grapefruit, cardamom and tobacco over a warm amber base.",
      types: { EDP: sz(49, 66, 86, [86, 115, 148]), EDT: sz(42, 56, 74, [76, 100, 128]) }, tags: ["him", "oriental", "evening", "edp"] },
    { id: "no5", brand: "Chanel", name: "N°5", img: IMG.no5, badge: "Icon", rating: 4.8, reviews: 1980,
      notes: "Aldehydes, ylang-ylang and May rose. The most famous fragrance in the world.",
      types: { EDP: sz(98, 129, 168, [125, 165, 210]), Parfum: sz(129, 168, 219, [165, 215, 275]) }, tags: ["her", "floral", "signature", "parfum"] },
    { id: "cocoNoir", brand: "Chanel", name: "Coco Noir", img: IMG.cocoNoir, badge: "", rating: 4.8, reviews: 842,
      notes: "Grapefruit and bergamot leading to rose, patchouli and tonka.",
      types: { EDP: sz(94, 124, 162, [120, 160, 205]) }, tags: ["her", "oriental", "evening", "edp"] },
    { id: "miumiu", brand: "Miu Miu", name: "Miu Miu L'Eau Rosée", img: IMG.miumiu, badge: "New", rating: 4.6, reviews: 318,
      notes: "Lily of the valley, blackcurrant and rose in a dewy, playful bloom.",
      types: { EDT: sz(44, 59, 76, [78, 104, 132]), EDP: sz(52, 69, 89, [88, 118, 150]) }, tags: ["her", "floral", "day", "edt"] },
    { id: "candy", brand: "Prada", name: "Candy Florale", img: IMG.candy, badge: "-44%", rating: 4.7, reviews: 527,
      notes: "Juicy lemon, peony and caramel: a sparkling floral treat.",
      types: { EDT: sz(46, 62, 82, [82, 110, 140]) }, tags: ["her", "gourmand", "day", "edt"] },
    { id: "gabrielle", brand: "Chanel", name: "Gabrielle", img: IMG.gabrielle, badge: "", rating: 4.7, reviews: 610,
      notes: "A radiant white-floral bouquet of jasmine, ylang-ylang, orange blossom and tuberose.",
      types: { EDP: sz(92, 121, 158, [118, 155, 198]), Parfum: sz(112, 146, 189, [145, 188, 240]) }, tags: ["her", "floral", "signature", "edp"] },
    { id: "premiere", brand: "Chanel", name: "N°5 Eau Première", img: IMG.eauPremiere, badge: "", rating: 4.7, reviews: 402,
      notes: "A softer, airier take on the legend: aldehydes, rose and velvety musk.",
      types: { EDP: sz(95, 126, 164, [122, 162, 208]) }, tags: ["her", "floral", "day", "edp"] },
    { id: "cocoMlleIntense", brand: "Chanel", name: "Coco Mademoiselle Intense", img: IMG.cocoMlleDark, badge: "Exclusive", rating: 4.9, reviews: 734,
      notes: "Deeper patchouli and vanilla for a more voluptuous Mademoiselle.",
      types: { EDP: sz(99, 131, 169, [128, 168, 215]) }, tags: ["her", "oriental", "evening", "parfum"] }
  ];
  const byId = id => P.find(p => p.id === id);

  const BEST = ["coco-mlle", "bleu", "eros", "opium", "gio", "lavie", "theone", "luna"];
  const REC = ["no5", "cocoNoir", "miumiu", "candy", "gabrielle", "premiere", "cocoMlleIntense", "eros"];

  /* ---------------- Brands ---------------- */
  const BRANDS = [
    { name: "Chanel", origin: "Paris · Est. 1910", count: 64, img: IMG.cocoMlleDark, mono: "C", top: [["Coco Mademoiselle", 89], ["Bleu de Chanel", 76], ["N°5 Eau de Parfum", 98]] },
    { name: "Versace", origin: "Milan · Est. 1978", count: 48, img: IMG.eros, mono: "V", top: [["Eros Eau de Toilette", 39], ["Dylan Blue", 44], ["Bright Crystal", 41]] },
    { name: "Yves Saint Laurent", origin: "Paris · Est. 1961", count: 52, img: IMG.opium, mono: "Y", top: [["Black Opium", 74], ["Libre", 82], ["Y Eau de Parfum", 79]] },
    { name: "Prada", origin: "Milan · Est. 1913", count: 37, img: IMG.prada, mono: "P", top: [["Luna Rossa Carbon", 48], ["Paradoxe", 86], ["Candy Florale", 46]] },
    { name: "Giorgio Armani", origin: "Milan · Est. 1975", count: 58, img: IMG.gio, mono: "A", top: [["Acqua di Giò", 52], ["Sì Eau de Parfum", 78], ["Code", 61]] },
    { name: "Lancôme", origin: "Paris · Est. 1935", count: 31, img: IMG.lavie, mono: "L", top: [["La Vie Est Belle", 64], ["Idôle", 72], ["Trésor", 58]] },
    { name: "Dolce & Gabbana", origin: "Milan · Est. 1985", count: 44, img: IMG.theOne, mono: "D", top: [["The One for Men", 49], ["Light Blue", 45], ["K by D&G", 58]] },
    { name: "Miu Miu", origin: "Milan · Est. 1993", count: 12, img: IMG.miumiu, mono: "M", top: [["L'Eau Rosée", 44], ["Twist", 62], ["Miu Miu EDP", 52]] }
  ];

  /* ---------------- Fragrance types ---------------- */
  const TYPES = [
    { abbr: "Parfum", key: "Parfum", name: "Parfum · Extrait", short: "The richest, most precious form", desc: "The purest concentration: intimate, opulent and made to last all day and night.",
      oil: "20–30%", oilPct: 100, wear: "8–12+ hours", wearPct: 100, best: "Special occasions & cold nights",
      imgs: [[IMG.cocoNoir, "Coco Noir"], [IMG.amber, "Amber extrait"], [IMG.redCap, "Rose oud"], [IMG.red, "Red Diamond"]] },
    { abbr: "EDP", key: "EDP", name: "Eau de Parfum", short: "Our most-loved concentration", desc: "Rich, long-wearing and the most popular choice for a signature scent.",
      oil: "15–20%", oilPct: 75, wear: "6–8 hours", wearPct: 72, best: "Evenings & signature wear",
      imgs: [[IMG.cocoMlle, "Coco Mademoiselle"], [IMG.opium, "Black Opium"], [IMG.lavie, "La Vie Est Belle"], [IMG.bleu, "Bleu de Chanel"]] },
    { abbr: "EDT", key: "EDT", name: "Eau de Toilette", short: "Lighter, fresher, everyday", desc: "Bright and versatile, easy to wear from the office to the weekend.",
      oil: "5–15%", oilPct: 50, wear: "4–6 hours", wearPct: 50, best: "Daytime, office & warm weather",
      imgs: [[IMG.eros, "Versace Eros"], [IMG.gio, "Acqua di Giò"], [IMG.prada, "Luna Rossa"], [IMG.candy, "Candy Florale"]] },
    { abbr: "EDC", key: "EDC", name: "Eau de Cologne", short: "Crisp, classic, refreshing", desc: "A light citrus splash, perfect for a quick lift after the gym or shower.",
      oil: "2–5%", oilPct: 25, wear: "2–3 hours", wearPct: 26, best: "Gym, summer & re-applying",
      imgs: [[IMG.theOne, "The One"], [IMG.clear, "Citrus cologne"], [IMG.darkWood, "Woody cologne"], [IMG.dropper, "Neroli splash"]] },
    { abbr: "Mist", key: "Mist", name: "Body Mist", short: "A soft veil of scent", desc: "The lightest touch: layer it over lotion or spritz on hair and clothes.",
      oil: "1–3%", oilPct: 12, wear: "1–2 hours", wearPct: 14, best: "Layering & a light refresh",
      imgs: [[IMG.miumiu, "Miu Miu"], [IMG.goldBottles, "Golden mists"], [IMG.laurissi, "Floral mist"], [IMG.vials, "Travel sprays"]] }
  ];

  /* ---------------- Reviews ---------------- */
  const REVIEWS = [
    { name: "Jessica M.", loc: "Austin, TX", avatar: "photo-1438761681033-6461ffad8d80", product: "coco-mlle", variant: "Eau de Parfum · 3.4 oz", date: "Oct 28, 2026",
      title: "Exactly like the department store, half the price", text: "I've worn Coco Mademoiselle for ten years and was nervous ordering online. It's 100% genuine: same batch code, same gorgeous projection. Arrived in two days, beautifully packed." },
    { name: "Marcus T.", loc: "Charlotte, NC", avatar: "photo-1500648767791-00dcc994a43e", product: "bleu", variant: "Eau de Parfum · 1.7 oz", date: "Oct 19, 2026",
      title: "My go-to store for years now", text: "Third bottle of Bleu from Perfume USA. Lasts all day at work and I always get compliments. Being able to pick EDP or EDT on the same page made choosing so easy." },
    { name: "Priya S.", loc: "Edison, NJ", avatar: "photo-1494790108377-be9c29b29330", product: "lavie", variant: "Eau de Parfum · 3.4 oz", date: "Nov 2, 2026",
      title: "Perfect gift, arrived same week", text: "Bought La Vie Est Belle for my sister's birthday. Sealed, authentic and the price was unbeatable. The free shipping threshold is easy to hit. Already planning my next order!" },
    { name: "Daniel R.", loc: "San Diego, CA", avatar: "photo-1507003211169-0a1dd7228f2d", product: "eros", variant: "Eau de Toilette · 3.4 oz", date: "Nov 6, 2026",
      title: "Incredible value, fast shipping", text: "Saved almost $60 on Versace Eros versus the mall. Shipped the same day I ordered. Fresh, sweet, lasts through a night out. 25 years in business and it shows." }
  ];


  /* Header state on scroll */
  const onScroll = () => document.body.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ===================================================
     Hero slider: 4 slides, 6 second autoplay
     =================================================== */
  (function hero() {
    const DURATION = 6000;
    const slides = $$(".slide");
    const dots = $$(".hero__dot");
    let idx = 0, timer;
    document.documentElement.style.setProperty("--hero-ms", DURATION + "ms");

    function go(n) {
      slides[idx].classList.remove("is-active");
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add("is-active");
      dots.forEach((d, i) => {
        d.classList.remove("is-active");
        d.classList.toggle("is-done", i < idx);
        d.setAttribute("aria-selected", i === idx);
      });
      void dots[idx].offsetWidth; // restart progress animation
      dots[idx].classList.add("is-active");
      clearTimeout(timer);
      timer = setTimeout(() => go(idx + 1), DURATION);
    }
    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
    $("[data-hero=prev]").addEventListener("click", () => go(idx - 1));
    $("[data-hero=next]").addEventListener("click", () => go(idx + 1));

    // swipe on touch
    let sx = null;
    const hero = $(".hero");
    hero.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener("touchend", e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
    go(0);
  })();

  /* ===================================================
     Product card markup
     =================================================== */
  const typeKeys = p => Object.keys(p.types);
  const typeLabel = { EDP: "Eau de Parfum", EDT: "Eau de Toilette", Parfum: "Parfum", EDC: "Eau de Cologne" };

  function cardHTML(p, hanger) {
    const keys = typeKeys(p);
    const t0 = keys[0];
    const sizes = p.types[t0];
    const def = Math.min(1, sizes.length - 1);
    const s = sizes[def];
    const off = Math.round((1 - s.p / s.r) * 100);
    const segs = keys.length > 1
      ? keys.map((k, i) => `<button type="button" class="${i === 0 ? "is-on" : ""}" data-type="${k}">${k}</button>`).join("")
      : `<span class="seg__single">${t0}</span>`;
    const card = `
      <article class="p-card" data-id="${p.id}" data-type="${t0}" data-size="${def}">
        <div class="p-card__media">
          <img src="${U(p.img, 640)}" alt="${p.brand} ${p.name}" loading="lazy" draggable="false">
          <div class="p-card__badges">${p.badge ? `<span class="badge ${p.badge.startsWith("-") ? "badge--plum" : ""}">${p.badge}</span>` : ""}</div>
          <button class="p-card__wish" type="button" aria-label="Add to wishlist" data-act="wish"><svg><use href="#i-heart"/></svg></button>
          <button class="p-card__qv" type="button" data-act="qv"><svg><use href="#i-eye"/></svg>Quick View</button>
        </div>
        <div class="p-card__body">
          <div class="p-card__top">
            <span class="p-card__brand">${p.brand}</span>
            <span class="p-card__rating"><svg><use href="#i-star"/></svg>${p.rating} (${p.reviews.toLocaleString()})</span>
          </div>
          <h3 class="p-card__name">${p.name}</h3>
          <div class="seg" role="group" aria-label="Fragrance type">${segs}</div>
          <div class="sizes" role="group" aria-label="Bottle size">${sizesHTML(sizes, def)}</div>
          <div class="p-card__price"><strong>${money(s.p)}</strong><s>${money(s.r)}</s><em>Save ${off}%</em></div>
          <button class="btn btn--plum p-card__add" type="button" data-act="add"><svg><use href="#i-bag"/></svg>Add to Bag</button>
        </div>
      </article>`;
    if (!hanger) return card;
    return `<div class="hang">
      <span class="hang__hook" aria-hidden="true"><svg viewBox="0 0 46 92"><path d="M23 92V44M23 44c0-7-11-8-11-19 0-6 5-10 11-10s11 4 11 10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M23 92V44" stroke="currentColor" stroke-width="1.2" opacity=".5"/></svg></span>
      <span class="hang__tag" aria-hidden="true"></span>
      ${card}
    </div>`;
  }
  function sizesHTML(sizes, sel) {
    return sizes.map((x, i) => `<button type="button" class="${i === sel ? "is-on" : ""}" data-size="${i}">${x.s}</button>`).join("");
  }
  function refreshCard(card) {
    const p = byId(card.dataset.id);
    const t = card.dataset.type;
    const sizes = p.types[t];
    let si = +card.dataset.size;
    if (si >= sizes.length) si = sizes.length - 1;
    card.dataset.size = si;
    const s = sizes[si];
    $(".sizes", card).innerHTML = sizesHTML(sizes, si);
    $$(".seg button", card).forEach(b => b.classList.toggle("is-on", b.dataset.type === t));
    const off = Math.round((1 - s.p / s.r) * 100);
    $(".p-card__price", card).innerHTML = `<strong>${money(s.p)}</strong><s>${money(s.r)}</s><em>Save ${off}%</em>`;
  }

  /* Render rails (content duplicated for a seamless loop) */
  function renderRail(trackId, ids, hanger) {
    const html = ids.map(id => cardHTML(byId(id), hanger)).join("");
    const track = document.getElementById(trackId);
    track.innerHTML = html + html;
    $$(".p-card", track).forEach((c, i) => { if (i >= ids.length) c.setAttribute("aria-hidden", "true"); });
  }
  renderRail("bestTrack", BEST, true);
  renderRail("recTrack", REC, false);

  /* Brand cards */
  (function brands() {
    const html = BRANDS.map(b => `
      <article class="brand-card">
        <img class="brand-card__img" src="${U(b.img, 760)}" alt="${b.name} fragrance" loading="lazy" draggable="false">
        <div class="brand-card__shade"></div>
        <span class="brand-card__count">${b.count} fragrances</span>
        <span class="brand-card__mono" aria-hidden="true">${b.mono}</span>
        <div class="brand-card__body">
          <p class="brand-card__origin">${b.origin}</p>
          <h3 class="brand-card__name">${b.name}</h3>
          <ul class="brand-card__list">
            ${b.top.map(t => `<li><span>${t[0]}</span><span>from $${t[1]}</span></li>`).join("")}
          </ul>
          <a href="#brands" class="brand-card__cta">View All ${b.name.length > 14 ? "" : b.name}<i><svg><use href="#i-arrow"/></svg></i></a>
        </div>
      </article>`).join("");
    const track = $("#brandTrack");
    track.innerHTML = html + html;
  })();

  /* ===================================================
     Auto-sliding marquees (pause on hover, drag, nudge)
     =================================================== */
  const marquees = {};
  $$("[data-marquee]").forEach(el => {
    const track = $(".marquee__track", el);
    const speed = parseFloat(el.dataset.speed) || 30; // px per second, negative = left-to-right
    const st = { x: 0, paused: false, extra: 0, drag: null, moved: false };
    marquees[el.dataset.marquee] = st;
    const half = () => track.scrollWidth / 2;

    el.addEventListener("mouseenter", () => { st.paused = true; });
    el.addEventListener("mouseleave", () => { st.paused = false; });
    el.addEventListener("focusin", () => { st.paused = true; });
    el.addEventListener("focusout", () => { st.paused = false; });

    el.addEventListener("pointerdown", e => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      st.drag = { x0: e.clientX, start: st.x };
      st.moved = false;
    });
    window.addEventListener("pointermove", e => {
      if (!st.drag) return;
      const dx = e.clientX - st.drag.x0;
      if (Math.abs(dx) > 6) { st.moved = true; el.classList.add("is-dragging"); }
      if (st.moved) st.x = st.drag.start - dx;
    });
    window.addEventListener("pointerup", () => {
      if (!st.drag) return;
      st.drag = null;
      el.classList.remove("is-dragging");
    });
    el.addEventListener("click", e => { if (st.moved) { e.preventDefault(); e.stopPropagation(); st.moved = false; } }, true);
    el.addEventListener("touchstart", () => { st.paused = true; clearTimeout(st.t); }, { passive: true });
    el.addEventListener("touchend", () => { clearTimeout(st.t); st.t = setTimeout(() => { st.paused = false; }, 2500); }, { passive: true });

    st.nudge = dir => {
      const card = track.firstElementChild;
      const w = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(card).marginRight || 0) : 320;
      st.extra += dir * w;
    };

    let last = performance.now();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function tick(now) {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      if (!st.paused && !st.drag) st.x += speed * (reduce ? 0.6 : 1) * dt;
      if (st.extra) {
        const step = st.extra * 0.12;
        st.x += step; st.extra -= step;
        if (Math.abs(st.extra) < 0.5) st.extra = 0;
      }
      const h = half();
      if (h > 0) {
        const x = ((st.x % h) + h) % h;
        track.style.transform = `translate3d(${-x}px,0,0)`;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
  $$("[data-nudge]").forEach(b => b.addEventListener("click", () => {
    const m = marquees[b.dataset.nudge];
    if (m) m.nudge(+b.dataset.dir);
  }));

  /* ===================================================
     Product card interactions (delegated)
     =================================================== */
  document.addEventListener("click", e => {
    const card = e.target.closest(".p-card");
    if (!card) return;
    const typeBtn = e.target.closest(".seg button[data-type]");
    const sizeBtn = e.target.closest(".sizes button[data-size]");
    const act = e.target.closest("[data-act]");
    if (typeBtn) { card.dataset.type = typeBtn.dataset.type; refreshCard(card); return; }
    if (sizeBtn) { card.dataset.size = sizeBtn.dataset.size; refreshCard(card); return; }
    if (!act) return;
    const p = byId(card.dataset.id);
    if (act.dataset.act === "wish") {
      act.classList.toggle("is-on");
      toast(act.classList.contains("is-on") ? `♡ ${p.name} saved to your wishlist` : `Removed from wishlist`);
    }
    if (act.dataset.act === "qv") openQV(p.id, card.dataset.type, +card.dataset.size);
    if (act.dataset.act === "add") {
      addToCart(p.id, card.dataset.type, +card.dataset.size, 1);
      act.classList.add("is-added");
      act.innerHTML = `✓ Added`;
      setTimeout(() => { act.classList.remove("is-added"); act.innerHTML = `<svg><use href="#i-bag"/></svg>Add to Bag`; }, 1600);
    }
  });

  /* ===================================================
     Fragrance types
     =================================================== */
  (function types() {
    const list = $("#typeList");
    list.innerHTML = TYPES.map((t, i) => `
      <li class="type-item ${i === 1 ? "is-active" : ""}">
        <button type="button" role="tab" data-i="${i}" aria-selected="${i === 1}">
          <span class="type-item__num">0${i + 1}</span>
          <span class="type-item__name">${t.name}<small>${t.short} · ${t.oil} oils</small></span>
          <span class="type-item__abbr">${t.abbr}</span>
        </button>
      </li>`).join("");

    // preload all type images so hover feels instant
    TYPES.forEach(t => t.imgs.forEach(([id]) => { const im = new Image(); im.src = U(id, 620); }));

    let cur = -1;
    function show(i) {
      if (i === cur) return;
      cur = i;
      const t = TYPES[i];
      $$(".type-item", list).forEach((li, j) => {
        li.classList.toggle("is-active", j === i);
        $("button", li).setAttribute("aria-selected", j === i);
      });
      $("#typeGallery").innerHTML = t.imgs.map(([id, cap]) =>
        `<figure><img src="${U(id, 620)}" alt="${cap}"><figcaption>${cap}</figcaption></figure>`).join("");
      $("#typeAbbr").textContent = t.abbr;
      $("#typeName").textContent = t.name;
      $("#typeDesc").textContent = t.desc;
      $("#typeOil").textContent = t.oil;
      $("#typeWear").textContent = t.wear;
      $("#typeBest").textContent = t.best;
      $("#typeCta").innerHTML = `Shop ${t.name.split(" · ")[0]} <svg><use href="#i-arrow"/></svg>`;
      const mo = $("#typeMeterOil"), mw = $("#typeMeterWear");
      mo.style.width = "0"; mw.style.width = "0";
      requestAnimationFrame(() => requestAnimationFrame(() => { mo.style.width = t.oilPct + "%"; mw.style.width = t.wearPct + "%"; }));
    }
    $$(".type-item button", list).forEach(b => {
      const i = +b.dataset.i;
      b.addEventListener("mouseenter", () => show(i));
      b.addEventListener("focus", () => show(i));
      b.addEventListener("click", () => show(i));
    });
    show(1);
  })();

  /* ===================================================
     Quiz
     =================================================== */
  (function quiz() {
    const stage = $("#quizStage");
    const ico = {
      her: `<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="5.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M12 14.5V22M8.5 18.5h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
      him: `<svg viewBox="0 0 24 24"><circle cx="10" cy="14" r="5.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M14 10l6.5-6.5M15 3.5h5.5V9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
      both: `<svg viewBox="0 0 24 24"><circle cx="9" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="15" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>`,
      gift: `<svg><use href="#i-gift"/></svg>`,
      sun: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
      moon: `<svg viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
      star: `<svg><use href="#i-spark"/></svg>`,
      drop1: `<svg viewBox="0 0 24 24"><path d="M12 4s-5 6-5 9.5a5 5 0 0010 0C17 10 12 4 12 4z" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>`,
      drop2: `<svg viewBox="0 0 24 24"><path d="M12 3s-6 7-6 11a6 6 0 0012 0c0-4-6-11-6-11z" fill="currentColor" opacity=".35" stroke="currentColor" stroke-width="1.4"/></svg>`,
      drop3: `<svg viewBox="0 0 24 24"><path d="M12 2s-7 8-7 12.5a7 7 0 0014 0C19 10 12 2 12 2z" fill="currentColor" stroke="currentColor" stroke-width="1.4"/></svg>`
    };
    const STEPS = [
      { key: "who", q: "Who are we <em>finding</em> a scent for?", opts: [
        { v: "her", label: "For Her", desc: "Feminine florals & gourmands", icon: ico.her },
        { v: "him", label: "For Him", desc: "Fresh, woody & aromatic", icon: ico.him },
        { v: "both", label: "Unisex", desc: "Beyond the rules", icon: ico.both },
        { v: "gift", label: "A Gift", desc: "Crowd-pleasing icons", icon: ico.gift } ] },
      { key: "mood", q: "Which <em>mood</em> draws you in?", opts: [
        { v: "fresh", label: "Fresh & Clean", desc: "Citrus, sea breeze, green", img: IMG.gio },
        { v: "floral", label: "Romantic Floral", desc: "Rose, jasmine, peony", img: IMG.cocoMlle },
        { v: "woody", label: "Warm & Woody", desc: "Cedar, vetiver, sandalwood", img: IMG.darkWood },
        { v: "gourmand", label: "Sweet & Sensual", desc: "Vanilla, praline, amber", img: IMG.opium } ] },
      { key: "when", q: "When will you <em>wear</em> it most?", opts: [
        { v: "day", label: "Every Day", desc: "Office, errands, brunch", icon: ico.sun },
        { v: "evening", label: "After Dark", desc: "Dinners, dates, nights out", icon: ico.moon },
        { v: "signature", label: "Signature", desc: "The one they remember", icon: ico.star },
        { v: "any", label: "Anytime", desc: "Versatile all-rounder", icon: ico.both } ] },
      { key: "power", q: "How <em>noticeable</em> should it be?", opts: [
        { v: "edt", label: "Subtle", desc: "Eau de Toilette · 4–6 hrs", icon: ico.drop1 },
        { v: "edp", label: "Balanced", desc: "Eau de Parfum · 6–8 hrs", icon: ico.drop2 },
        { v: "parfum", label: "Statement", desc: "Parfum · 8–12+ hrs", icon: ico.drop3 },
        { v: "any", label: "Surprise Me", desc: "Show me the best match", icon: ico.star } ] }
    ];
    const ans = {};
    let step = 0;

    function progress(n) {
      $("#quizNum").textContent = String(Math.min(n + 1, 4)).padStart(2, "0");
      $("#quizBar").style.width = Math.min(100, (n + 1) * 25) + "%";
    }
    function renderStep() {
      const s = STEPS[step];
      progress(step);
      stage.innerHTML = `
        <div class="q-step">
          <div class="q-step__meta"><span>Question ${String(step + 1).padStart(2, "0")} of 04</span>
            ${step > 0 ? `<button type="button" class="q-back"><svg><use href="#i-left"/></svg>Back</button>` : ""}</div>
          <h3 class="q-step__q">${s.q}</h3>
          <div class="q-opts">
            ${s.opts.map(o => `
              <button type="button" class="q-opt ${o.img ? "has-img" : ""} ${ans[s.key] === o.v ? "is-on" : ""}" data-v="${o.v}">
                ${o.img ? `<img src="${U(o.img, 520)}" alt="" loading="lazy">` : `<span class="q-opt__icon">${o.icon}</span>`}
                <span class="q-opt__check"></span>
                <span class="q-opt__label">${o.label}</span>
                <span class="q-opt__desc">${o.desc}</span>
              </button>`).join("")}
          </div>
        </div>`;
      $$(".q-opt", stage).forEach(b => b.addEventListener("click", () => {
        ans[s.key] = b.dataset.v;
        $$(".q-opt", stage).forEach(x => x.classList.toggle("is-on", x === b));
        setTimeout(() => { step++; step < STEPS.length ? renderStep() : renderResult(); }, 420);
      }));
      const back = $(".q-back", stage);
      if (back) back.addEventListener("click", () => { step--; renderStep(); });
    }
    function score(p) {
      let sc = 60;
      const t = p.tags;
      if (ans.who === "her" && t.includes("her")) sc += 14;
      if (ans.who === "him" && t.includes("him")) sc += 14;
      if (ans.who === "both" || ans.who === "gift") sc += p.rating >= 4.8 ? 10 : 6;
      if ((ans.who === "her" && t.includes("him")) || (ans.who === "him" && t.includes("her"))) sc -= 30;
      if (t.includes(ans.mood)) sc += 12;
      if (ans.mood === "woody" && t.includes("oriental")) sc += 6;
      if (ans.mood === "gourmand" && t.includes("oriental")) sc += 6;
      if (t.includes(ans.when) || ans.when === "any") sc += 7;
      if (t.includes(ans.power) || ans.power === "any") sc += 6;
      return Math.max(70, Math.min(98, sc + Math.round(p.rating)));
    }
    function renderResult() {
      progress(3);
      const ranked = P.map(p => ({ p, s: score(p) })).sort((a, b) => b.s - a.s).slice(0, 3);
      const moodName = { fresh: "Fresh", floral: "Floral", woody: "Woody", gourmand: "Sensual" }[ans.mood];
      const powerName = { edt: "Eau de Toilette", edp: "Eau de Parfum", parfum: "Parfum", any: "Any strength" }[ans.power];
      const whoName = { her: "For Her", him: "For Him", both: "Unisex", gift: "Gift" }[ans.who];
      const whenName = { day: "Daytime", evening: "After dark", signature: "Signature", any: "Anytime" }[ans.when];
      stage.innerHTML = `
        <div class="q-step q-result">
          <div class="q-step__meta"><span>Your scent profile</span></div>
          <h3>You're <em>${moodName}</em>, through and through.</h3>
          <div class="q-result__tags"><span>${whoName}</span><span>${moodName}</span><span>${whenName}</span><span>${powerName}</span></div>
          <div class="q-matches">
            ${ranked.map(({ p, s }) => {
              const k = Object.keys(p.types)[0];
              return `<div class="q-match">
                <img src="${U(p.img, 200)}" alt="${p.name}">
                <div><small>${p.brand}</small><strong>${p.name}</strong><span>${k} · from ${money(p.types[k][0].p)}</span></div>
                <div class="q-match__pct">${s}% match<button type="button" data-qv="${p.id}">Quick View</button></div>
              </div>`;
            }).join("")}
          </div>
          <div class="q-result__actions">
            <a href="#best" class="btn btn--light">Shop My Matches <svg><use href="#i-arrow"/></svg></a>
            <button type="button" class="btn btn--ghost-light" id="quizRetake">Retake Quiz</button>
          </div>
        </div>`;
      $$("[data-qv]", stage).forEach(b => b.addEventListener("click", () => openQV(b.dataset.qv)));
      $("#quizRetake").addEventListener("click", () => { step = 0; for (const k in ans) delete ans[k]; renderStep(); });
    }
    renderStep();
  })();

  /* ===================================================
     Reviews
     =================================================== */
  $("#reviewGrid").innerHTML = REVIEWS.map(r => {
    const p = byId(r.product);
    return `<article class="review reveal">
      <div class="review__media">
        <img src="${U(p.img, 600)}" alt="${p.brand} ${p.name}" loading="lazy">
        <div class="review__product"><b>${p.brand} ${p.name}</b>Purchased: ${r.variant}</div>
      </div>
      <div class="review__inner">
        <div class="review__top">
          <span class="stars" aria-label="5 out of 5 stars">${'<svg><use href="#i-star"/></svg>'.repeat(5)}</span>
          <time>${r.date}</time>
        </div>
        <h3 class="review__title">"${r.title}"</h3>
        <p class="review__text">${r.text}</p>
        <div class="review__person">
          <img src="https://images.unsplash.com/${r.avatar}?w=120&h=120&q=75&auto=format&fit=crop&crop=faces" alt="${r.name}" loading="lazy">
          <div><strong>${r.name}<svg aria-label="Verified buyer"><use href="#i-verified"/></svg></strong><span>Verified Buyer · ${r.loc}</span></div>
        </div>
      </div>
    </article>`;
  }).join("");

  /* ===================================================
     Cart
     =================================================== */
  const FREE = 59;
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("pusa-cart") || "[]"); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem("pusa-cart", JSON.stringify(cart)); } catch (e) { /* ignore */ } };

  function addToCart(id, type, size, qty) {
    const key = `${id}|${type}|${size}`;
    const line = cart.find(l => l.key === key);
    if (line) line.qty += qty; else cart.push({ key, id, type, size, qty });
    save(); renderCart();
    const p = byId(id), s = p.types[type][size];
    toast(`Added: ${p.name} · ${type} ${s.s}`);
    const c = $("#cartCount");
    c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
  }
  function renderCart() {
    let count = 0, sub = 0, retail = 0;
    cart.forEach(l => {
      const s = byId(l.id).types[l.type][l.size];
      count += l.qty; sub += s.p * l.qty; retail += s.r * l.qty;
    });
    $("#cartCount").textContent = count;
    $("#cartHeadCount").textContent = `(${count})`;
    $("#cartSubtotal").textContent = money(sub);
    $("#cartSave").textContent = "-" + money(retail - sub);
    const left = FREE - sub;
    $("#shipMsg").innerHTML = left > 0 ? `You're <strong>${money(left)}</strong> away from free shipping` : `<strong>You've unlocked free US shipping!</strong>`;
    $("#shipBar").style.width = Math.min(100, (sub / FREE) * 100) + "%";
    const items = $("#cartItems");
    if (!cart.length) {
      items.innerHTML = `<div class="cart__empty"><strong>Your bag is empty</strong>Discover 18,000+ authentic fragrances.<br><br><a href="#best" class="btn btn--outline" data-close>Shop Best Sellers</a></div>`;
      return;
    }
    items.innerHTML = cart.map((l, i) => {
      const p = byId(l.id), s = p.types[l.type][l.size];
      return `<div class="c-item">
        <img src="${U(p.img, 200)}" alt="${p.name}">
        <div><small>${p.brand}</small><strong>${p.name}</strong><span>${typeLabel[l.type] || l.type} · ${s.s} (${s.ml})</span><br>
          <span class="c-item__qty"><button type="button" data-cq="${i}" data-d="-1" aria-label="Decrease">−</button>${l.qty}<button type="button" data-cq="${i}" data-d="1" aria-label="Increase">+</button></span></div>
        <div class="c-item__right"><b>${money(s.p * l.qty)}</b><button type="button" class="c-item__rm" data-rm="${i}">Remove</button></div>
      </div>`;
    }).join("");
  }
  $("#cartItems").addEventListener("click", e => {
    const q = e.target.closest("[data-cq]"), rm = e.target.closest("[data-rm]");
    if (q) { const l = cart[+q.dataset.cq]; l.qty += +q.dataset.d; if (l.qty < 1) cart.splice(+q.dataset.cq, 1); }
    if (rm) cart.splice(+rm.dataset.rm, 1);
    if (q || rm) { save(); renderCart(); }
  });
  renderCart();

  /* ===================================================
     Panels: drawer, cart, search, quick view
     =================================================== */
  const overlay = $("#overlay");
  let openPanel = null;
  function open(id) {
    closeAll();
    const el = document.getElementById(id);
    el.hidden = false;
    if (id !== "qv") overlay.hidden = false;
    openPanel = el;
    document.body.style.overflow = "hidden";
    const f = el.querySelector("button, a, input");
    if (f) setTimeout(() => f.focus(), 60);
  }
  function closeAll() {
    ["drawer", "cart", "qv"].forEach(id => { document.getElementById(id).hidden = true; });
    overlay.hidden = true;
    openPanel = null;
    document.body.style.overflow = "";
  }
  $$("[data-open]").forEach(b => b.addEventListener("click", () => {
    const t = b.dataset.open;
    if (t === "search") {
      const s = $("#search");
      s.hidden = !s.hidden;
      if (!s.hidden) $("input", s).focus();
      return;
    }
    open(t);
  }));
  overlay.addEventListener("click", closeAll);
  document.addEventListener("click", e => {
    if (e.target.closest("[data-close]")) closeAll();
    if (e.target.closest(".drawer__nav a")) closeAll();
    if (e.target === $("#qv")) closeAll();
    if (!e.target.closest("#search") && !e.target.closest("[data-open=search]")) $("#search").hidden = true;
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeAll(); $("#search").hidden = true; } });

  /* Quick view */
  const qv = { id: null, type: null, size: 1, qty: 1 };
  function openQV(id, type, size) {
    const p = byId(id);
    qv.id = id;
    qv.type = type && p.types[type] ? type : typeKeys(p)[0];
    qv.size = size != null ? size : 1;
    qv.qty = 1;
    $("#qvImg").src = U(p.img, 1000);
    $("#qvImg").alt = `${p.brand} ${p.name}`;
    $("#qvBrand").textContent = p.brand;
    $("#qvName").textContent = p.name;
    $("#qvReviews").textContent = `${p.rating} · ${p.reviews.toLocaleString()} reviews`;
    $("#qvNotes").textContent = p.notes;
    $("#qvBadge").textContent = p.badge || "Authentic";
    renderQV();
    open("qv");
  }
  function renderQV() {
    const p = byId(qv.id);
    const sizes = p.types[qv.type];
    if (qv.size >= sizes.length) qv.size = sizes.length - 1;
    const s = sizes[qv.size];
    $("#qvTypes").innerHTML = typeKeys(p).map(k => `<button type="button" class="${k === qv.type ? "is-on" : ""}" data-t="${k}">${typeLabel[k] || k}</button>`).join("");
    $("#qvSizes").innerHTML = sizes.map((x, i) => `<button type="button" class="${i === qv.size ? "is-on" : ""}" data-s="${i}">${x.s}<small>${x.ml} · ${money(x.p)}</small></button>`).join("");
    $("#qvTypeLabel").textContent = typeLabel[qv.type] || qv.type;
    $("#qvSizeLabel").textContent = `${s.s} / ${s.ml}`;
    $("#qvPrice").textContent = money(s.p);
    $("#qvRetail").textContent = "Retail " + money(s.r);
    $("#qvSave").textContent = `You save ${money(s.r - s.p)}`;
    $("#qvQty").textContent = qv.qty;
    $("#qvAdd").textContent = `Add to Bag · ${money(s.p * qv.qty)}`;
  }
  $("#qvTypes").addEventListener("click", e => { const b = e.target.closest("[data-t]"); if (b) { qv.type = b.dataset.t; renderQV(); } });
  $("#qvSizes").addEventListener("click", e => { const b = e.target.closest("[data-s]"); if (b) { qv.size = +b.dataset.s; renderQV(); } });
  $("#qvMinus").addEventListener("click", () => { qv.qty = Math.max(1, qv.qty - 1); renderQV(); });
  $("#qvPlus").addEventListener("click", () => { qv.qty = Math.min(10, qv.qty + 1); renderQV(); });
  $("#qvAdd").addEventListener("click", () => {
    addToCart(qv.id, qv.type, qv.size, qv.qty);
    open("cart");
  });

  /* Toast */
  let tt;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(tt);
    tt = setTimeout(() => t.classList.remove("is-on"), 2400);
  }

  /* Newsletter */
  $("#newsForm").addEventListener("submit", e => {
    e.preventDefault();
    const inp = $("#newsEmail");
    const msg = $("#newsMsg");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) {
      msg.textContent = "Please enter a valid email address.";
      msg.classList.remove("is-ok");
      inp.focus();
      return;
    }
    msg.innerHTML = "Welcome to the Inner Circle ✦ Your 15% code <strong>INNER15</strong> is on its way.";
    msg.classList.add("is-ok");
    inp.value = "";
  });

  /* Reveal on scroll */
  $$(".section__head, .types__left, .type-card, .quiz__intro, .quiz__stage, .news__card, .footer__top").forEach(el => el.classList.add("reveal"));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(el => io.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("is-in"));
  }
})();
