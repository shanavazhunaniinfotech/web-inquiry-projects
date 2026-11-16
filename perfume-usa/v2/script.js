/* Perfume USA: Version 2 interactions */
(function () {
  "use strict";
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const U = (id, w, h) => `https://images.unsplash.com/${id}?w=${w || 700}${h ? `&h=${h}` : ""}&q=78&auto=format&fit=crop`;
  const money = n => "$" + n.toFixed(2);
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ================= Data ================= */
  const IMG = {
    no5: "photo-1541643600914-78b084683601", cocoMlle: "photo-1592945403244-b3fbafd7f539", cocoMlleDark: "photo-1592914610354-fd354ea45e48",
    cocoNoir: "photo-1592842232655-e5d345cbc2d0", cocoNoirRose: "photo-1594035910387-fea47794261f", bleu: "photo-1523293182086-7651a899d37f",
    amber: "photo-1588405748880-12d1d2a59f75", vintage: "photo-1615634260167-c8cdede054de", miumiu: "photo-1557170334-a9632e77c6e4",
    gabrielle: "photo-1563170351-be82bc888aa4", prada: "photo-1610461888750-10bfc601b874", gio: "photo-1619994403073-2cec844b8e63",
    red: "photo-1608528577891-eb055944f2e7", eros: "photo-1587017539504-67cfbddac569", opium: "photo-1600612253971-422e7f7faeb6",
    theOne: "photo-1616949755610-8c9bbc08f138", lavie: "photo-1613521140785-e85e427f8002", gold: "photo-1622618991746-fe6004db3a47",
    candy: "photo-1630573133526-8d090e0269af", premiere: "photo-1585120040315-2241b774ad0f", vials: "photo-1602928321679-560bb453f190",
    redCap: "photo-1615160460367-dcccd27e11ad", wood: "photo-1588514912908-8f5891714f8d", bar: "photo-1557827983-012eb6ea8dc1",
    laurissi: "photo-1566977776052-6e61e35bf9be", clear: "photo-1594125311687-3b1b3eafa9f4", dropper: "photo-1608571423902-eed4a5ad8108",
    cocoNoirPink: "photo-1585386959984-a4155224a1ad"
  };
  const sz = (a, b, c, r) => [
    { s: "1.0 oz", ml: 30, p: a, r: r[0] }, { s: "1.7 oz", ml: 50, p: b, r: r[1] }, { s: "3.4 oz", ml: 100, p: c, r: r[2] }
  ];
  const P = [
    { id: "coco-mlle", brand: "Chanel", name: "Coco Mademoiselle", img: IMG.cocoMlle, g: "her", badge: "Best Seller", rating: 4.9, reviews: 2318, sold: 214, stock: 0,
      notes: "Fresh orange, May rose and jasmine over a sensual patchouli and vetiver base.", types: { EDP: sz(89, 118, 152, [118, 152, 195]), EDT: sz(72, 96, 124, [98, 128, 162]) } },
    { id: "bleu", brand: "Chanel", name: "Bleu de Chanel", img: IMG.bleu, g: "him", badge: "Best Seller", rating: 4.9, reviews: 3104, sold: 286, stock: 9,
      notes: "Grapefruit and incense with a dry cedar and sandalwood trail. Effortlessly modern.", types: { EDP: sz(92, 121, 158, [120, 155, 200]), EDT: sz(76, 99, 128, [100, 130, 165]), Parfum: sz(108, 139, 179, [140, 180, 225]) } },
    { id: "eros", brand: "Versace", name: "Eros", img: IMG.eros, g: "him", badge: "", rating: 4.8, reviews: 1876, sold: 178, stock: 0,
      notes: "Mint, green apple and tonka bean wrapped in Madagascar vanilla.", types: { EDT: sz(39, 52, 68, [72, 98, 126]), EDP: sz(46, 61, 79, [84, 112, 142]) } },
    { id: "opium", brand: "Yves Saint Laurent", name: "Black Opium", img: IMG.opium, g: "her", badge: "Trending", rating: 4.8, reviews: 2210, sold: 163, stock: 6,
      notes: "Black coffee, white flowers and vanilla: addictive, glamorous, after-dark.", types: { EDP: sz(74, 98, 129, [105, 135, 168]), Parfum: sz(88, 116, 149, [120, 152, 190]) } },
    { id: "gio", brand: "Giorgio Armani", name: "Acqua di Giò", img: IMG.gio, g: "him", badge: "", rating: 4.7, reviews: 2890, sold: 141, stock: 0,
      notes: "Marine notes, bergamot and rosemary over white musk. The original aquatic.", types: { EDT: sz(52, 69, 88, [82, 110, 140]), EDP: sz(61, 82, 105, [95, 125, 155]) } },
    { id: "lavie", brand: "Lancôme", name: "La Vie Est Belle", img: IMG.lavie, g: "her", badge: "Best Seller", rating: 4.9, reviews: 2655, sold: 197, stock: 0,
      notes: "Iris, praline and vanilla: a joyful, luminous gourmand floral.", types: { EDP: sz(64, 86, 112, [98, 128, 162]), EDT: sz(54, 72, 94, [84, 110, 140]) } },
    { id: "theone", brand: "Dolce & Gabbana", name: "The One for Men", img: IMG.theOne, g: "him", badge: "", rating: 4.8, reviews: 1432, sold: 96, stock: 4,
      notes: "Grapefruit, cardamom and tobacco over a warm amber base.", types: { EDP: sz(49, 66, 86, [86, 115, 148]), EDT: sz(42, 56, 74, [76, 100, 128]) } },
    { id: "luna", brand: "Prada", name: "Luna Rossa Carbon", img: IMG.prada, g: "him", badge: "New", rating: 4.7, reviews: 964, sold: 72, stock: 0,
      notes: "Bergamot, lavender and a mineral, metallic ambroxan heart.", types: { EDT: sz(48, 64, 84, [80, 106, 135]) } },
    { id: "no5", brand: "Chanel", name: "N°5", img: IMG.no5, g: "her", badge: "Icon", rating: 4.8, reviews: 1980, sold: 120, stock: 0,
      notes: "Aldehydes, ylang-ylang and May rose. The most famous fragrance in the world.", types: { EDP: sz(98, 129, 168, [125, 165, 210]), Parfum: sz(129, 168, 219, [165, 215, 275]) } },
    { id: "candy", brand: "Prada", name: "Candy Florale", img: IMG.candy, g: "her", badge: "", rating: 4.7, reviews: 527, sold: 58, stock: 7,
      notes: "Juicy lemon, peony and caramel: a sparkling floral treat.", types: { EDT: sz(46, 62, 82, [82, 110, 140]) } },
    { id: "miumiu", brand: "Miu Miu", name: "L'Eau Rosée", img: IMG.miumiu, g: "her", badge: "New", rating: 4.6, reviews: 318, sold: 44, stock: 0,
      notes: "Lily of the valley, blackcurrant and rose in a dewy, playful bloom.", types: { EDT: sz(44, 59, 76, [78, 104, 132]), EDP: sz(52, 69, 89, [88, 118, 150]) } },
    { id: "cocoNoir", brand: "Chanel", name: "Coco Noir", img: IMG.cocoNoir, g: "her", badge: "", rating: 4.8, reviews: 842, sold: 67, stock: 0,
      notes: "Grapefruit and bergamot leading to rose, patchouli and tonka.", types: { EDP: sz(94, 124, 162, [120, 160, 205]) } },
    { id: "gabrielle", brand: "Chanel", name: "Gabrielle", img: IMG.gabrielle, g: "her", badge: "", rating: 4.7, reviews: 610, sold: 39, stock: 0,
      notes: "A radiant white-floral bouquet of jasmine, ylang-ylang, orange blossom and tuberose.", types: { EDP: sz(92, 121, 158, [118, 155, 198]) } }
  ];
  const byId = id => P.find(p => p.id === id);
  const DEALS = ["eros", "theone", "gio", "candy", "opium", "lavie", "miumiu", "bleu"];
  const BEST = ["bleu", "coco-mlle", "lavie", "eros", "opium", "gio", "no5", "luna"];
  const typeName = { EDP: "Eau de Parfum", EDT: "Eau de Toilette", Parfum: "Parfum" };
  const offPct = s => Math.round((1 - s.p / s.r) * 100);
  const bestOff = p => Math.max(...Object.values(p.types).flat().map(offPct));
  const minPrice = p => Math.min(...Object.values(p.types).flat().map(s => s.p));

  /* ================= Split text ================= */
  $$("[data-split]").forEach(el => {
    let i = 0;
    const walk = node => {
      Array.from(node.childNodes).forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement("span"); w.className = "w";
            const s = document.createElement("span"); s.style.setProperty("--i", i++); s.textContent = part;
            w.appendChild(s); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
  });

  /* ================= Reveal on scroll ================= */
  $$(".show [data-anim]").forEach((el, i) => el.style.setProperty("--d", 500 + i * 120 + "ms"));
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in");
    io.unobserve(en.target);
  }), { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
  function observeReveals(root) {
    $$("[data-split], [data-anim], .rise, [data-reveal-img]", root).forEach(el => { if (!el.classList.contains("is-in")) io.observe(el); });
  }

  /* ================= Top bar + search ticker ================= */
  (function rotator() {
    const ps = $$(".topbar__rotator p"); let i = 0;
    setInterval(() => {
      const c = ps[i]; c.classList.remove("is-on"); c.classList.add("is-out");
      setTimeout(() => c.classList.remove("is-out"), 700);
      i = (i + 1) % ps.length; ps[i].classList.add("is-on");
    }, 4200);
    const words = ["Bleu de Chanel", "Black Opium", "Versace Eros", "La Vie Est Belle", "Acqua di Giò", "gift sets"];
    const t = $("#searchTicker"); let w = 0;
    setInterval(() => {
      t.classList.add("is-out");
      setTimeout(() => { w = (w + 1) % words.length; t.textContent = words[w]; t.classList.remove("is-out"); }, 380);
    }, 2600);
  })();

  /* ================= Scroll: header, progress, to top ================= */
  const header = $("#header"), prog = $("#progress"), totop = $("#totop"), totopFill = $("#totopFill");
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    const r = h > 0 ? y / h : 0;
    prog.style.transform = `scaleX(${r})`;
    totopFill.style.strokeDashoffset = 125.7 * (1 - r);
    totop.classList.toggle("is-on", y > 900);
    header.classList.toggle("is-scrolled", y > 60);
    if (y > 500 && y > lastY + 4 && !document.body.classList.contains("locked")) header.classList.add("is-hidden");
    else if (y < lastY - 4 || y < 500) header.classList.remove("is-hidden");
    lastY = y;
    statementTick();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  totop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ================= Cursor, magnetic, tilt ================= */
  if (fine) {
    const cur = $("#cursor");
    let mx = -100, my = -100, cx = -100, cy = -100;
    window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; cur.classList.add("is-on"); });
    document.addEventListener("mouseleave", () => cur.classList.remove("is-on"));
    (function loop() { cx += (mx - cx) * .2; cy += (my - cy) * .2; cur.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); })();
    document.addEventListener("mouseover", e => {
      const big = e.target.closest("[data-cursor], .card__media, .fam, .ugc figure");
      const link = !big && e.target.closest("a, button, summary, input");
      cur.classList.toggle("is-big", !!big);
      cur.classList.toggle("is-link", !!link);
    });

    document.addEventListener("mousemove", e => {
      const m = e.target.closest(".magnetic");
      $$(".magnetic.is-mag").forEach(b => { if (b !== m) { b.classList.remove("is-mag"); b.style.transform = ""; } });
      if (!m) return;
      const r = m.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * .25, dy = (e.clientY - r.top - r.height / 2) * .35;
      m.classList.add("is-mag"); m.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    document.addEventListener("mousemove", e => {
      const media = e.target.closest(".card__media");
      $$(".card__media.is-tilt").forEach(c => { if (c !== media) { c.classList.remove("is-tilt"); c.style.transform = ""; } });
      if (!media) return;
      const r = media.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      media.classList.add("is-tilt");
      media.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
    });
  }

  /* ================= Countdowns ================= */
  function tickCountdown() {
    const now = new Date(), end = new Date(now); end.setHours(24, 0, 0, 0);
    let s = Math.max(0, Math.floor((end - now) / 1000));
    const h = String(Math.floor(s / 3600)).padStart(2, "0"); s %= 3600;
    const m = String(Math.floor(s / 60)).padStart(2, "0"), sec = String(s % 60).padStart(2, "0");
    $$("[data-countdown]").forEach(c => { $("[data-h]", c).textContent = h; $("[data-m]", c).textContent = m; $("[data-s]", c).textContent = sec; });
  }
  tickCountdown(); setInterval(tickCountdown, 1000);
  (function xmas() {
    const now = new Date(); let target = new Date(now.getFullYear(), 11, 18);
    if (now > target) target = new Date(now.getFullYear() + 1, 11, 18);
    $("[data-xmas] [data-d]").textContent = Math.ceil((target - now) / 86400000);
  })();

  /* ================= Product cards ================= */
  function cardHTML(p) {
    const k = Object.keys(p.types)[0], sizes = p.types[k], off = bestOff(p);
    const signal = p.stock ? `<p class="card__signal card__signal--low"><svg><use href="#i-clock"/></svg>Only ${p.stock} left in stock</p>`
                           : `<p class="card__signal"><svg><use href="#i-fire"/></svg>${p.sold} sold in the last 24h</p>`;
    return `<article class="card rise" data-id="${p.id}" data-g="${p.g}" data-min="${minPrice(p)}">
      <div class="card__media">
        <img src="${U(p.img, 640)}" alt="${p.brand} ${p.name}" loading="lazy">
        <div class="card__badges"><span class="badge badge--hot">-${off}%</span>${p.badge ? `<span class="badge">${p.badge}</span>` : ""}</div>
        <button class="card__wish" type="button" aria-label="Save ${p.name}" data-act="wish"><svg><use href="#i-heart"/></svg></button>
        <div class="card__quick">
          <p>Quick add · ${k}<button type="button" data-act="qv">Details</button></p>
          <div class="card__sizes">${sizes.map((s, i) => `<button type="button" data-act="quick" data-type="${k}" data-size="${i}">${s.s}<small>${money(s.p)}</small></button>`).join("")}</div>
        </div>
      </div>
      <div class="card__body">
        <div class="card__row"><span class="card__brand">${p.brand}</span><span class="card__rating"><svg><use href="#i-star"/></svg>${p.rating} (${p.reviews.toLocaleString()})</span></div>
        <h3 class="card__name"><a href="#best" data-act="qv">${p.name}</a></h3>
        <div class="card__types">${Object.keys(p.types).map(t => `<span>${t}</span>`).join("")}</div>
        <div class="card__price"><small>From</small><b>${money(minPrice(p))}</b><s>${money(sizes[0].r)}</s><em>Save up to ${off}%</em></div>
        ${signal}
        <button class="card__add" type="button" aria-label="Choose options for ${p.name}" data-act="qv"><svg><use href="#i-plus"/></svg></button>
      </div>
    </article>`;
  }
  function renderGrid(id, ids) {
    const g = document.getElementById(id);
    g.innerHTML = ids.map(i => cardHTML(byId(i))).join("");
    $$(".card", g).forEach((c, i) => c.style.setProperty("--d", (i % 4) * 90 + "ms"));
    observeReveals(g);
  }
  renderGrid("dealGrid", DEALS);
  renderGrid("bestGrid", BEST);

  document.addEventListener("click", e => {
    const card = e.target.closest(".card");
    const act = e.target.closest("[data-act]");
    if (!card || !act) return;
    e.preventDefault();
    const p = byId(card.dataset.id);
    if (act.dataset.act === "wish") {
      act.classList.toggle("is-on"); act.classList.remove("pop"); void act.offsetWidth; act.classList.add("pop");
      const n = $$(".card__wish.is-on").length; $("#wishCount").textContent = n;
      toast(act.classList.contains("is-on") ? `Saved ${p.name} to your wishlist` : "Removed from wishlist");
    }
    if (act.dataset.act === "qv") openQV(p.id);
    if (act.dataset.act === "quick") { addToCart(p.id, act.dataset.type, +act.dataset.size, 1); open("cart"); }
  });

  /* Tabs */
  $$("[data-tabs]").forEach(tabs => {
    const ink = $(".tabs__ink", tabs), grid = tabs.dataset.tabs === "deals" ? $("#dealGrid") : $("#bestGrid");
    const place = b => { ink.style.left = b.offsetLeft + "px"; ink.style.width = b.offsetWidth + "px"; };
    const on = $("button.is-on", tabs); requestAnimationFrame(() => place(on));
    window.addEventListener("resize", () => place($("button.is-on", tabs)));
    $$("button", tabs).forEach(b => b.addEventListener("click", () => {
      $$("button", tabs).forEach(x => x.classList.toggle("is-on", x === b)); place(b);
      const f = b.dataset.filter;
      $$(".card", grid).forEach((c, i) => {
        const show = f === "all" || c.dataset.g === f || (f === "under75" && +c.dataset.min < 75);
        c.classList.toggle("is-hiding", !show);
        if (show) { c.classList.remove("is-in"); void c.offsetWidth; c.style.setProperty("--d", (i % 4) * 70 + "ms"); requestAnimationFrame(() => c.classList.add("is-in")); }
      });
    }));
  });
  document.fonts && document.fonts.ready.then(() => $$("[data-tabs]").forEach(t => { const b = $("button.is-on", t), ink = $(".tabs__ink", t); ink.style.left = b.offsetLeft + "px"; ink.style.width = b.offsetWidth + "px"; }));

  /* Copy code */
  $$("[data-copy]").forEach(b => b.addEventListener("click", () => {
    const code = b.dataset.copy;
    try { navigator.clipboard && navigator.clipboard.writeText(code); } catch (e) { /* ignore */ }
    $("small", b).textContent = "Copied!"; toast(`Code ${code} copied: extra 15% off at checkout`);
    setTimeout(() => { $("small", b).textContent = "Copy"; }, 2000);
  }));

  /* ================= Showcase hero ================= */
  const SHOW = [
    { id: "bleu", tint: "#2b3a8f", img: IMG.bleu },
    { id: "coco-mlle", tint: "#a8566c", img: IMG.cocoMlleDark },
    { id: "opium", tint: "#5d4c72", img: IMG.opium },
    { id: "eros", tint: "#16706f", img: IMG.eros },
    { id: "lavie", tint: "#b8607e", img: IMG.lavie }
  ];
  const showEl = $(".show"), slidesEl = $("#showSlides"), thumbsEl = $("#showThumbs"), cardEl = $("#showCard");
  const showState = { i: 0, type: null, size: 1 };
  slidesEl.innerHTML = SHOW.map((s, i) => {
    const p = byId(s.id);
    return `<div class="sl" data-i="${i}" role="group" aria-label="${p.brand} ${p.name}"><img src="${U(s.img, 900)}" alt="${p.brand} ${p.name}" ${i ? 'loading="lazy"' : ""}><span class="sl__tag">Next · ${p.name}</span></div>`;
  }).join("");
  thumbsEl.innerHTML = SHOW.map((s, i) => {
    const p = byId(s.id);
    return `<button class="show__thumb" type="button" role="tab" data-i="${i}" aria-label="${p.name}"><img src="${U(s.img, 120, 120)}" alt=""><b>${p.name}</b><i></i></button>`;
  }).join("");

  function showCard(animate) {
    if (!cardEl) return;
    const p = byId(SHOW[showState.i].id), sizes = p.types[showState.type], s = sizes[showState.size];
    const html = `
      <div class="sc__top"><span class="sc__brand">${p.brand}</span><span class="sc__rating"><svg><use href="#i-star"/></svg>${p.rating} · ${p.reviews.toLocaleString()} reviews</span></div>
      <h2 class="sc__name">${p.name}</h2>
      <p class="sc__notes">${p.notes.split(".")[0]}.</p>
      <div class="sc__types">${Object.keys(p.types).map(k => `<button type="button" class="${k === showState.type ? "is-on" : ""}" data-st="${k}">${k}</button>`).join("")}</div>
      <div class="sc__sizes">${sizes.map((x, i) => `<button type="button" class="${i === showState.size ? "is-on" : ""}" data-ss="${i}">${x.s}</button>`).join("")}</div>
      <div class="sc__price"><b>${money(s.p)}</b><s>${money(s.r)}</s><em>Save ${offPct(s)}%</em></div>
      <div class="sc__buy"><button class="btn btn--plum" type="button" data-sadd><svg><use href="#i-bag"/></svg><span>Add to Bag</span></button><button class="sc__qv" type="button" aria-label="Quick view ${p.name}" data-qv="${p.id}"><svg><use href="#i-eye"/></svg></button></div>
      <p class="sc__stock"><svg><use href="#i-fire"/></svg>${p.stock ? `Only ${p.stock} left at this price` : `${p.sold} sold in the last 24 hours`}</p>`;
    if (!animate) { cardEl.innerHTML = html; return; }
    cardEl.classList.add("is-swap");
    setTimeout(() => { cardEl.innerHTML = html; cardEl.classList.add("is-swap"); void cardEl.offsetWidth; cardEl.classList.remove("is-swap"); }, 380);
  }
  function showGo(n, first) {
    const N = SHOW.length;
    showState.i = (n + N) % N;
    const p = byId(SHOW[showState.i].id);
    showState.type = Object.keys(p.types)[0]; showState.size = 1;
    $$(".sl", slidesEl).forEach((el, i) => {
      const d = (i - showState.i + N) % N;
      el.dataset.pos = d === 0 ? "0" : d === 1 ? "1" : d === 2 ? "2" : d === N - 1 ? "-1" : "far";
    });
    $$(".show__thumb", thumbsEl).forEach((t, i) => {
      t.classList.remove("is-on"); t.classList.toggle("is-done", i < showState.i); t.setAttribute("aria-selected", i === showState.i);
    });
    const on = $$(".show__thumb", thumbsEl)[showState.i]; void on.offsetWidth; on.classList.add("is-on");
    showEl.style.setProperty("--tint", SHOW[showState.i].tint);
    const word = $("#showWord");
    const fill = () => { const t = `<span>${p.name}</span>`.repeat(3); word.innerHTML = t + t; };
    if (first) fill(); else { word.classList.add("is-swap"); setTimeout(() => { fill(); word.classList.remove("is-swap"); }, 500); }
    const badge = $("#showBadge");
    $("b", badge).textContent = `-${bestOff(p)}%`;
    badge.classList.remove("pop"); void badge.offsetWidth; badge.classList.add("pop");
    showCard(!first);
  }
  thumbsEl.addEventListener("click", e => { const t = e.target.closest(".show__thumb"); if (t) showGo(+t.dataset.i); });
  thumbsEl.addEventListener("animationend", e => { if (e.animationName === "fill") showGo(showState.i + 1); });
  $$("[data-show]").forEach(b => b.addEventListener("click", () => showGo(showState.i + +b.dataset.show)));
  slidesEl.addEventListener("click", e => {
    const sl = e.target.closest(".sl"); if (!sl) return;
    const pos = sl.dataset.pos;
    if (pos === "1") showGo(showState.i + 1); else if (pos === "2") showGo(showState.i + 2); else if (pos === "-1") showGo(showState.i - 1);
    else if (pos === "0") openQV(SHOW[showState.i].id);
  });
  if (cardEl) cardEl.addEventListener("click", e => {
    const t = e.target.closest("[data-st]"), s = e.target.closest("[data-ss]"), add = e.target.closest("[data-sadd]");
    if (t) { showState.type = t.dataset.st; const n = byId(SHOW[showState.i].id).types[showState.type].length; if (showState.size >= n) showState.size = n - 1; showCard(false); }
    if (s) { showState.size = +s.dataset.ss; showCard(false); }
    if (add) { addToCart(SHOW[showState.i].id, showState.type, showState.size, 1); open("cart"); }
  });
  /* pause on hover / when out of view / tab hidden */
  const stage = $("#showStage");
  stage.addEventListener("mouseenter", () => showEl.classList.add("is-paused"));
  stage.addEventListener("mouseleave", () => showEl.classList.remove("is-paused"));
  new IntersectionObserver(([en]) => showEl.classList.toggle("is-out", !en.isIntersecting), { threshold: .2 }).observe(showEl);
  const syncPause = () => showEl.classList.toggle("is-paused", document.hidden || showEl.classList.contains("is-out") || stage.matches(":hover"));
  document.addEventListener("visibilitychange", syncPause);
  new MutationObserver(syncPause).observe(showEl, { attributes: true, attributeFilter: ["class"] });
  /* swipe */
  let ssx = null;
  stage.addEventListener("touchstart", e => { ssx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", e => { if (ssx === null) return; const dx = e.changedTouches[0].clientX - ssx; if (Math.abs(dx) > 40) showGo(showState.i + (dx < 0 ? 1 : -1)); ssx = null; });
  /* pointer parallax */
  if (fine) {
    const glow = $("#showGlow");
    showEl.addEventListener("mousemove", e => {
      const r = showEl.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      slidesEl.style.transform = `rotateY(${px * 8}deg) rotateX(${-py * 6}deg)`;
      glow.style.translate = `${px * 60}px ${py * 50}px`;
      if (cardEl) cardEl.style.translate = `${px * -14}px ${py * -10}px`;
    });
    showEl.addEventListener("mouseleave", () => { slidesEl.style.transform = ""; glow.style.translate = ""; if (cardEl) cardEl.style.translate = ""; });
  }
  showGo(0, true);

  /* ================= Statement highlight ================= */
  const st = $("#statement");
  (function splitStatement() {
    const walk = node => Array.from(node.childNodes).forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else { const s = document.createElement("span"); s.className = "sw"; s.textContent = part; frag.appendChild(s); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
    walk(st);
  })();
  const sws = $$(".sw", st);
  function statementTick() {
    const r = st.getBoundingClientRect();
    const start = innerHeight * .85, end = innerHeight * .3;
    const prog = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height * .6)));
    const n = Math.round(prog * sws.length);
    sws.forEach((w, i) => w.classList.toggle("on", i < n));
  }

  /* ================= Counters ================= */
  const cio = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || "";
    const t0 = performance.now(), dur = 1800;
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur), v = to * (1 - Math.pow(1 - k, 4));
      el.textContent = v.toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
    cio.unobserve(el);
  }), { threshold: .6 });
  $$("[data-count]").forEach(el => cio.observe(el));

  /* Distribution bars */
  const dio = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    $$("em[data-w]", en.target).forEach((e, i) => setTimeout(() => { e.style.width = Math.max(1.5, +e.dataset.w) + "%"; }, i * 120));
    dio.unobserve(en.target);
  }), { threshold: .4 });
  dio.observe($(".dist"));

  /* ================= Sticky stack ================= */
  const cards = $$(".stack__card");
  cards.forEach((c, i) => c.style.setProperty("--i", i));
  if (hasGsap) {
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function () {
        cards.forEach((c, i) => {
          if (i === cards.length - 1) return;
          gsap.to(c, { scale: .94, opacity: .55, ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 200px", scrub: true } });
        });
      }
    });
  }

  /* ================= Families (pinned horizontal) ================= */
  const FAM = [
    { name: "Fresh", em: "& Clean", mood: "Energizing", img: IMG.gio, desc: "Citrus, sea breeze and green notes. Bright, crisp and easy to wear every day.", notes: ["Bergamot", "Sea salt", "Mint", "Neroli"], picks: "Acqua di Giò · Versace Eros · Luna Rossa" },
    { name: "Floral", em: "& Romantic", mood: "Feminine", img: IMG.cocoMlle, desc: "Rose, jasmine and peony. Timeless, elegant and quietly confident.", notes: ["Rose", "Jasmine", "Peony", "Iris"], picks: "Coco Mademoiselle · Gabrielle · N°5" },
    { name: "Woody", em: "& Warm", mood: "Grounded", img: IMG.wood, desc: "Cedar, sandalwood and vetiver. Smooth, sophisticated and long-lasting.", notes: ["Cedar", "Sandalwood", "Vetiver", "Oud"], picks: "Bleu de Chanel · The One · Terre" },
    { name: "Amber", em: "& Spice", mood: "Sensual", img: IMG.amber, desc: "Amber, resins and warm spices. Rich, enveloping and made for evenings.", notes: ["Amber", "Cardamom", "Tobacco", "Labdanum"], picks: "Coco Noir · The One · Opium" },
    { name: "Gourmand", em: "& Sweet", mood: "Addictive", img: IMG.opium, desc: "Vanilla, coffee and praline. Cozy, playful and impossible to forget.", notes: ["Vanilla", "Coffee", "Praline", "Tonka"], picks: "Black Opium · La Vie Est Belle · Candy" }
  ];
  const famTrack = $("#famTrack");
  famTrack.innerHTML = FAM.map((f, i) => `
    <article class="fam">
      <img src="${U(f.img, 800)}" alt="${f.name} fragrances" loading="lazy">
      <span class="fam__num">0${i + 1}</span><span class="fam__mood">${f.mood}</span>
      <h3>${f.name} <em>${f.em}</em></h3>
      <p>${f.desc}</p>
      <div class="fam__notes">${f.notes.map(n => `<span>${n}</span>`).join("")}</div>
      <div class="fam__picks">Customer favorites: <b>${f.picks}</b></div>
      <a href="#best" class="btn btn--white"><span>Shop ${f.name}</span><svg><use href="#i-arrow"/></svg></a>
    </article>`).join("");

  if (hasGsap) {
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function () {
        const dist = () => famTrack.scrollWidth - (innerWidth - famTrack.getBoundingClientRect().left) + 40;
        gsap.to(famTrack, {
          x: () => -Math.max(0, dist()), ease: "none",
          scrollTrigger: {
            trigger: ".families", start: "top top", end: () => "+=" + Math.max(400, dist()), pin: ".families__pin", scrub: 0.8, invalidateOnRefresh: true,
            onUpdate: self => { $("#famProgress").style.width = (self.progress * 100) + "%"; }
          }
        });
      }
    });

    /* Parallax */
    ScrollTrigger.matchMedia({ "(min-width: 1025px)": function () {
      gsap.to(".show__copy", { y: -90, opacity: .25, ease: "none", scrollTrigger: { trigger: ".show", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".show__stage", { y: 70, scale: .93, ease: "none", scrollTrigger: { trigger: ".show", start: "top top", end: "bottom top", scrub: true } });
    } });
    gsap.to(".show__word", { xPercent: -12, ease: "none", scrollTrigger: { trigger: ".show", start: "top top", end: "bottom top", scrub: true } });
    $$("[data-parallax-img]").forEach(img => {
      gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
    $$("[data-parallax]").forEach(el => {
      gsap.to(el, { yPercent: parseFloat(el.dataset.parallax) * 100, ease: "none", scrollTrigger: { trigger: el.closest("section"), start: "top top", end: "bottom top", scrub: true } });
    });
    /* brand marquee skews with scroll velocity */
    let skewTo = gsap.quickTo(".brandline__track", "skewX", { duration: .5, ease: "power3" });
    ScrollTrigger.create({ onUpdate: self => skewTo(Math.max(-8, Math.min(8, self.getVelocity() / -300))) });
    ScrollTrigger.addEventListener("scrollEnd", () => skewTo(0));
  }

  /* ================= Size guide ================= */
  (function sizeGuide() {
    const p = byId("bleu");
    let type = "EDP", si = 1;
    const sprays = ml => Math.round(ml * 11);
    const BOT = [{ h: 150, w: 70 }, { h: 200, w: 86 }, { h: 260, w: 104 }];
    $("#bottles").innerHTML = BOT.map((b, i) => `
      <button class="bottle" type="button" data-i="${i}" aria-label="${p.types.EDP[i].s}">
        <svg viewBox="0 0 ${b.w} ${b.h}" style="height:${b.h}px">
          <rect class="cap" x="${b.w * .32}" y="0" width="${b.w * .36}" height="${b.h * .14}" rx="3"/>
          <rect class="cap" x="${b.w * .4}" y="${b.h * .14}" width="${b.w * .2}" height="${b.h * .06}"/>
          <rect class="glass" x="1" y="${b.h * .2}" width="${b.w - 2}" height="${b.h * .8 - 1}" rx="${b.w * .14}"/>
          <rect class="liquid" x="7" y="${b.h * .3}" width="${b.w - 14}" height="${b.h * .66}" rx="${b.w * .1}"/>
        </svg>
        <span>${p.types.EDP[i].ml} ml</span>
      </button>`).join("");
    function render() {
      const sizes = p.types[type], s = sizes[si];
      $("#sizeType").innerHTML = Object.keys(p.types).map(k => `<button type="button" class="${k === type ? "is-on" : ""}" data-t="${k}">${typeName[k]}</button>`).join("");
      const pml = sizes.map(x => x.p / x.ml), best = pml.indexOf(Math.min(...pml));
      $("#sizePicks").innerHTML = sizes.map((x, i) => `<button type="button" class="${i === si ? "is-on" : ""}" data-s="${i}">${i === best ? "<em>Best value</em>" : ""}<b>${x.s}</b><span>${money(x.p)}</span></button>`).join("");
      $$(".bottle").forEach((b, i) => b.classList.toggle("is-on", i === si));
      const n = sprays(s.ml);
      animateNum($("#sizeSprays"), n, 0, "");
      animateNum($("#sizeDays"), n / 4 / 30, 1, " mo");
      animateNum($("#sizePml"), s.p / s.ml, 2, "", "$");
      $("#sizePrice").textContent = money(s.p);
      $("#sizeRetail").textContent = money(s.r);
      const smallest = sizes[0].p / sizes[0].ml;
      $("#sizeTip").textContent = si === 0 ? `Tip: the ${sizes[best].s} saves ${Math.round((1 - pml[best] / smallest) * 100)}% per ml.`
        : `You save ${Math.round((1 - s.p / s.ml / smallest) * 100)}% per ml vs the 1.0 oz, plus ${money(s.r - s.p)} off retail.`;
    }
    $("#sizeType").addEventListener("click", e => { const b = e.target.closest("[data-t]"); if (b) { type = b.dataset.t; render(); } });
    $("#sizePicks").addEventListener("click", e => { const b = e.target.closest("[data-s]"); if (b) { si = +b.dataset.s; render(); } });
    $("#bottles").addEventListener("click", e => { const b = e.target.closest(".bottle"); if (b) { si = +b.dataset.i; render(); } });
    $("#sizeAdd").addEventListener("click", () => { addToCart(p.id, type, si, 1); open("cart"); });
    render();
  })();
  function animateNum(el, to, dec, suf, pre) {
    const from = parseFloat((el.dataset.v || "0")), t0 = performance.now();
    el.dataset.v = to;
    (function step(t) {
      const k = Math.min(1, (t - t0) / 600), v = from + (to - from) * (1 - Math.pow(1 - k, 3));
      el.textContent = (pre || "") + v.toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ================= Reviews ================= */
  const REV = [
    { n: "Jessica M.", loc: "Austin, TX", a: "photo-1438761681033-6461ffad8d80", p: "coco-mlle", v: "EDP · 3.4 oz", d: "Nov 8, 2026", t: "Exactly like the department store, half the price", x: "I've worn Coco Mademoiselle for ten years. Same batch code, same gorgeous projection, and it arrived in two days, beautifully packed." },
    { n: "Marcus T.", loc: "Charlotte, NC", a: "photo-1500648767791-00dcc994a43e", p: "bleu", v: "EDP · 1.7 oz", d: "Nov 5, 2026", t: "My go-to store for years", x: "Third bottle of Bleu from Perfume USA. Picking EDP vs EDT on the same page made it easy, and the size guide sold me on the bigger bottle." },
    { n: "Priya S.", loc: "Edison, NJ", a: "photo-1494790108377-be9c29b29330", p: "lavie", v: "EDP · 3.4 oz", d: "Nov 2, 2026", t: "Perfect gift, arrived the same week", x: "Bought La Vie Est Belle for my sister. Sealed, authentic and the gift wrap was lovely. Unbeatable price, already planning my next order." },
    { n: "Daniel R.", loc: "San Diego, CA", a: "photo-1507003211169-0a1dd7228f2d", p: "eros", v: "EDT · 3.4 oz", d: "Oct 29, 2026", t: "Saved almost $60 on Eros", x: "Shipped the same day I ordered. Fresh, sweet and lasts through a night out. 25 years in business and it really shows." },
    { n: "Ashley K.", loc: "Denver, CO", a: "photo-1438761681033-6461ffad8d80", p: "opium", v: "EDP · 1.7 oz", d: "Oct 24, 2026", t: "Obsessed, and so affordable", x: "Black Opium for $98 instead of $135? Genuine bottle, fast delivery, and customer service answered my question in minutes." }
  ];
  $("#revTrack").innerHTML = REV.map(r => {
    const p = byId(r.p);
    return `<article class="rev">
      <div class="rev__top"><span class="stars">${'<svg><use href="#i-star"/></svg>'.repeat(5)}</span><time>${r.d}</time></div>
      <h3>"${r.t}"</h3><p>${r.x}</p>
      <div class="rev__product"><img src="${U(p.img, 120, 120)}" alt="${p.name}" loading="lazy"><div><small>Purchased · ${r.v}</small><b>${p.brand} ${p.name}</b></div><button type="button" data-qv="${p.id}">Shop</button></div>
      <div class="rev__who"><img src="${U(r.a, 100, 100)}&crop=faces" alt="${r.n}" loading="lazy"><div><b>${r.n}<svg aria-label="Verified buyer"><use href="#i-verified"/></svg></b><span>Verified buyer · ${r.loc}</span></div></div>
    </article>`;
  }).join("");
  let rIdx = 0;
  const revTrack = $("#revTrack");
  function revGo(d) {
    const cardsR = $$(".rev", revTrack), w = cardsR[0].getBoundingClientRect().width + 22;
    const visible = Math.max(1, Math.floor(revTrack.parentElement.getBoundingClientRect().width / w));
    rIdx = (rIdx + d + (cardsR.length - visible + 1)) % (cardsR.length - visible + 1);
    revTrack.style.transform = `translateX(${-rIdx * w}px)`;
  }
  $$("[data-rev]").forEach(b => b.addEventListener("click", () => { revGo(+b.dataset.rev); clearInterval(revAuto); }));
  let revAuto = setInterval(() => revGo(1), 5000);
  let rsx = null;
  revTrack.addEventListener("touchstart", e => { rsx = e.touches[0].clientX; }, { passive: true });
  revTrack.addEventListener("touchend", e => { if (rsx === null) return; const dx = e.changedTouches[0].clientX - rsx; if (Math.abs(dx) > 40) { revGo(dx < 0 ? 1 : -1); clearInterval(revAuto); } rsx = null; });

  const UGC = [[IMG.cocoMlle, "@jess.scents"], [IMG.bleu, "@marcus_t"], [IMG.lavie, "@priyaa"], [IMG.eros, "@danny.r"], [IMG.opium, "@ashleyk"], [IMG.gio, "@coastal.guy"], [IMG.no5, "@classic.chic"], [IMG.candy, "@sweetnotes"], [IMG.miumiu, "@miu.mood"], [IMG.cocoNoir, "@noir.night"]];
  const ug = UGC.map(([id, h]) => `<figure><img src="${U(id, 460)}" alt="Customer photo by ${h}" loading="lazy"><figcaption>${h}</figcaption></figure>`).join("");
  $("#ugcTrack").innerHTML = ug + ug;

  /* ================= Cart ================= */
  const FREE = 59;
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("pusa2-cart") || "[]"); } catch (e) { cart = []; }
  cart = cart.filter(l => byId(l.id) && byId(l.id).types[l.type]);
  const save = () => { try { localStorage.setItem("pusa2-cart", JSON.stringify(cart)); } catch (e) { /* ignore */ } };
  function addToCart(id, type, size, qty) {
    const key = `${id}|${type}|${size}`, line = cart.find(l => l.key === key);
    if (line) line.qty += qty; else cart.push({ key, id, type, size, qty });
    save(); renderCart();
    const p = byId(id); toast(`Added ${p.name} · ${type} ${p.types[type][size].s}`);
    ["#cartCount", "#mbarCount"].forEach(s => { const c = $(s); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); });
  }
  function renderCart() {
    let count = 0, sub = 0, ret = 0;
    cart.forEach(l => { const s = byId(l.id).types[l.type][l.size]; count += l.qty; sub += s.p * l.qty; ret += s.r * l.qty; });
    $("#cartCount").textContent = count; $("#mbarCount").textContent = count; $("#cartHeadCount").textContent = `(${count})`;
    $("#cartSub").textContent = money(sub); $("#cartSave").textContent = money(ret - sub);
    const left = FREE - sub;
    $("#shipMsg").innerHTML = left > 0 ? `Add <b>${money(left)}</b> more for <b>free US shipping</b>` : `<b>You've unlocked free shipping!</b> 🎉`;
    $("#shipBar").style.width = Math.min(100, sub / FREE * 100) + "%";
    const items = $("#cartItems");
    if (!cart.length) {
      items.innerHTML = `<div class="c-empty"><b>Your bag is empty</b>Discover 18,000+ authentic fragrances.<br><br><a href="#best" class="btn btn--line" data-close><span>Shop Best Sellers</span></a></div>`;
    } else {
      items.innerHTML = cart.map((l, i) => {
        const p = byId(l.id), s = p.types[l.type][l.size];
        return `<div class="c-item"><img src="${U(p.img, 200)}" alt="${p.name}">
          <div><small>${p.brand}</small><strong>${p.name}</strong><span>${typeName[l.type]} · ${s.s}</span><br>
          <span class="c-item__qty"><button type="button" data-cq="${i}" data-d="-1" aria-label="Decrease">−</button>${l.qty}<button type="button" data-cq="${i}" data-d="1" aria-label="Increase">+</button></span></div>
          <div class="c-item__right"><b>${money(s.p * l.qty)}</b><button type="button" data-rm="${i}">Remove</button></div></div>`;
      }).join("");
    }
    const inCart = new Set(cart.map(l => l.id));
    const up = P.find(p => !inCart.has(p.id) && minPrice(p) < 60) || P[2];
    $("#cartUpsell").innerHTML = `<p>${cart.length ? "Complete your order" : "Customers also love"}</p><div class="up"><img src="${U(up.img, 120, 120)}" alt=""><div><b>${up.name}</b>${up.brand} · from ${money(minPrice(up))}</div><button type="button" data-up="${up.id}">+ Add</button></div>`;
  }
  $("#cart").addEventListener("click", e => {
    const q = e.target.closest("[data-cq]"), rm = e.target.closest("[data-rm]"), up = e.target.closest("[data-up]");
    if (q) { const l = cart[+q.dataset.cq]; l.qty += +q.dataset.d; if (l.qty < 1) cart.splice(+q.dataset.cq, 1); }
    if (rm) cart.splice(+rm.dataset.rm, 1);
    if (up) { const p = byId(up.dataset.up); addToCart(p.id, Object.keys(p.types)[0], 0, 1); return; }
    if (q || rm) { save(); renderCart(); }
  });
  renderCart();

  /* ================= Panels ================= */
  const scrim = $("#scrim");
  const PANELS = ["menu", "cart", "qv", "search", "exit"];
  function open(id) {
    closeAll(true);
    $("#" + id).hidden = false;
    if (id === "menu" || id === "cart" || id === "search") scrim.hidden = false;
    document.body.classList.add("locked"); document.body.style.overflow = "hidden";
    header.classList.remove("is-hidden");
    if (id === "search") setTimeout(() => $("#searchInput").focus(), 50);
    else { const f = $("#" + id).querySelector("button, a, input"); if (f) setTimeout(() => f.focus({ preventScroll: true }), 60); }
  }
  function closeAll(silent) {
    PANELS.forEach(p => { $("#" + p).hidden = true; });
    scrim.hidden = true; document.body.classList.remove("locked"); document.body.style.overflow = "";
  }
  $$("[data-open]").forEach(b => b.addEventListener("click", () => open(b.dataset.open)));
  scrim.addEventListener("click", () => closeAll());
  document.addEventListener("click", e => {
    if (e.target.closest("[data-close]")) closeAll();
    if (e.target.closest(".menu__nav a")) closeAll();
    if (e.target.id === "qv" || e.target.id === "exit") closeAll();
    const qvb = e.target.closest("[data-qv]");
    if (qvb) { e.preventDefault(); openQV(qvb.dataset.qv); }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAll();
    if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); open("search"); }
  });

  /* Search */
  function renderSearch(q) {
    q = (q || "").trim().toLowerCase();
    const list = q ? P.filter(p => (p.brand + " " + p.name + " " + p.notes).toLowerCase().includes(q)) : P.slice(0, 8);
    $("#searchResults").innerHTML = list.length ? list.slice(0, 8).map((p, i) => `<button type="button" class="s-res" data-qv="${p.id}" style="animation-delay:${i * 40}ms"><img src="${U(p.img, 120, 120)}" alt=""><div><small>${p.brand}</small><b>${p.name}</b><span>From ${money(minPrice(p))}</span></div></button>`).join("")
      : `<p class="s-empty">No matches for "${q.replace(/[<>&"]/g, "")}". Try a brand like Chanel or a note like vanilla.</p>`;
  }
  $("#searchInput").addEventListener("input", e => renderSearch(e.target.value));
  $$(".search-ov__chips button").forEach(b => b.addEventListener("click", () => { $("#searchInput").value = b.dataset.q; renderSearch(b.dataset.q); }));
  renderSearch("");

  /* Quick view */
  const qv = { id: null, type: null, size: 1, qty: 1 };
  function openQV(id) {
    const p = byId(id); if (!p) return;
    qv.id = id; qv.type = Object.keys(p.types)[0]; qv.size = 1; qv.qty = 1;
    $("#qvImg").src = U(p.img, 1000); $("#qvImg").alt = `${p.brand} ${p.name}`;
    $("#qvBrand").textContent = p.brand; $("#qvName").textContent = p.name;
    $("#qvReviews").textContent = `${p.rating} · ${p.reviews.toLocaleString()} reviews`;
    $("#qvNotes").textContent = p.notes;
    $("#qvBadge").textContent = `Up to ${bestOff(p)}% off`;
    $("#qvStock").textContent = p.stock ? `Hurry, only ${p.stock} left at this price` : `${p.sold} people bought this in the last 24 hours`;
    renderQV(); open("qv");
  }
  function renderQV() {
    const p = byId(qv.id), sizes = p.types[qv.type], s = sizes[qv.size];
    const pml = sizes.map(x => x.p / x.ml), best = pml.indexOf(Math.min(...pml));
    $("#qvTypes").innerHTML = Object.keys(p.types).map(k => `<button type="button" class="${k === qv.type ? "is-on" : ""}" data-t="${k}">${typeName[k]}</button>`).join("");
    $("#qvSizes").innerHTML = sizes.map((x, i) => `<button type="button" class="${i === qv.size ? "is-on" : ""}" data-s="${i}">${i === best ? "<em>Best value</em>" : ""}<b>${x.s}</b><span>${money(x.p)} · ${money(x.p / x.ml)}/ml</span></button>`).join("");
    $("#qvTypeLabel").textContent = typeName[qv.type];
    $("#qvSizeLabel").textContent = `${s.s} (${s.ml} ml)`;
    $("#qvPrice").textContent = money(s.p); $("#qvRetail").textContent = money(s.r); $("#qvSave").textContent = `Save ${money(s.r - s.p)}`;
    $("#qvQty").textContent = qv.qty;
    $("#qvAdd").innerHTML = `<span>Add to Bag · ${money(s.p * qv.qty)}</span>`;
  }
  $("#qvTypes").addEventListener("click", e => { const b = e.target.closest("[data-t]"); if (b) { qv.type = b.dataset.t; renderQV(); } });
  $("#qvSizes").addEventListener("click", e => { const b = e.target.closest("[data-s]"); if (b) { qv.size = +b.dataset.s; renderQV(); } });
  $("#qvMinus").addEventListener("click", () => { qv.qty = Math.max(1, qv.qty - 1); renderQV(); });
  $("#qvPlus").addEventListener("click", () => { qv.qty = Math.min(10, qv.qty + 1); renderQV(); });
  $("#qvAdd").addEventListener("click", () => { addToCart(qv.id, qv.type, qv.size, qv.qty); open("cart"); });

  /* Toast */
  let tt;
  function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("is-on"), 2600); }

  /* ================= Social proof ================= */
  (function proof() {
    const box = $("#proof");
    const FEED = [["Sarah", "Austin, TX", "coco-mlle", 3], ["Michael", "Chicago, IL", "bleu", 6], ["Emily", "Miami, FL", "lavie", 9], ["James", "Seattle, WA", "eros", 12], ["Olivia", "Boston, MA", "opium", 15], ["David", "Phoenix, AZ", "gio", 21]];
    let i = 0, stopped = false;
    function show() {
      if (stopped || document.body.classList.contains("locked")) return;
      const [n, c, id, m] = FEED[i++ % FEED.length], p = byId(id);
      box.innerHTML = `<img src="${U(p.img, 120, 120)}" alt=""><p><b>${n}</b> in ${c} bought<br><b>${p.brand} ${p.name}</b><small><svg><use href="#i-verified"/></svg>${m} minutes ago · Verified</small></p><button type="button" aria-label="Dismiss">×</button>`;
      box.classList.add("is-on");
      $("button", box).onclick = () => { stopped = true; box.classList.remove("is-on"); };
      setTimeout(() => box.classList.remove("is-on"), 5500);
    }
    setTimeout(() => { show(); setInterval(show, 20000); }, 9000);
  })();

  /* ================= Exit intent ================= */
  (function exitIntent() {
    let seen = false;
    try { seen = sessionStorage.getItem("pusa2-exit") === "1"; } catch (e) { /* ignore */ }
    const armedAt = Date.now() + 8000;
    document.addEventListener("mouseout", e => {
      if (seen || e.relatedTarget || e.clientY > 10 || Date.now() < armedAt || document.body.classList.contains("locked")) return;
      seen = true; try { sessionStorage.setItem("pusa2-exit", "1"); } catch (err) { /* ignore */ }
      open("exit");
    });
  })();

  /* ================= Forms ================= */
  const okEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  $("#newsForm").addEventListener("submit", e => {
    e.preventDefault();
    const inp = $("#newsEmail"), msg = $("#newsMsg");
    if (!okEmail(inp.value)) { msg.textContent = "Please enter a valid email address."; msg.classList.remove("is-ok"); inp.focus(); return; }
    msg.innerHTML = "Welcome to the Inner Circle ✦ Your code <b>INNER15</b> is on its way."; msg.classList.add("is-ok"); inp.value = "";
  });
  $("#exitForm").addEventListener("submit", e => {
    e.preventDefault();
    const inp = $("input", e.target);
    if (!okEmail(inp.value)) { inp.focus(); inp.style.borderColor = "#9c2477"; return; }
    $(".exit__body").innerHTML = `<p class="eyebrow">You're in</p><h3>Your code: <em>INNER15</em></h3><p>We've also emailed it to you. It's valid on top of sale prices for the next 48 hours.</p><a href="#deals" class="btn btn--plum" data-close><span>Start Shopping</span></a>`;
  });

  /* ================= Init ================= */
  observeReveals(document);
  onScroll();
  window.addEventListener("load", () => { if (hasGsap) ScrollTrigger.refresh(); });
})();
