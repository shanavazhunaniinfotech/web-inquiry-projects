(() => {
  "use strict";
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  /* ================= i18n (HU captured from HTML, EN below) ================= */
  const EN = {
    ann1: "✦ Black Friday: −50% on every kit", ann2: "🚚 Free shipping over 20,000 Ft", ann3: "📦 Ships within 1–3 business days – GLS",
    endsIn: "Sale ends in:",
    nav1: "Skin tags", nav2: "Ear & nose care", nav3: "How it works", nav4: "Results", nav5: "Reviews", nav6: "FAQ",
    dropK: "Categories", dr1: "Removal kits", dr2: "Refill micro-bands", dr3: "Botanical patches", dr4: "Bundle deals",
    pKit: "Removal kit", pRing: "Micro-bands (40 pcs)", pEar: "Electric ear cleaner", pNose: "Electric nose cleaner",
    heroPill: "happy customers in 2025",
    heroTitle: "Clear skin.<br><em>No clinic needed.</em>",
    heroLead: "Professional-grade skin tag removal in the comfort of your home – safe, painless and with scar-free results.",
    tick1: "Painless", tick2: "Scar-free results", tick3: "In as little as 7 days",
    heroCta: "Add to cart", heroCta2: "View bundles", eta: "Order today – estimated delivery:",
    miniT: "2 minutes", miniS: "at-home treatment",
    floatA: "gone within 7 days", floatB: "Dermatologically tested", floatC: "“Gone in five days!”",
    mq1: "Clinically tested", mq2: "10,000+ happy customers", mq3: "24/7 customer support", mq4: "GLS delivery in 2–3 days", mq5: "Secure payment",
    catKicker: "Collections", catTitle: "At-home care, <em>clinical precision</em>", viewAll: "All products →",
    catBadge: "−50% Black Friday", cat1: "Skin tag removal", cat1p: "Kit, refill micro-bands and botanical patches – all in one place.",
    shopNow: "Shop now →", cat2: "Refills", cat3: "Patches", cat4: "Ear & nose",
    bestseller: "#1 Bestseller", bestseller2: "Bestseller", ratingTxt: "· 10,000+ customers",
    inBox: "What’s in the box?", ib1: "NUVAI device", ib2: "adapter heads", ib3: "micro-bands", ib4: "wipes",
    pTitle: "At-Home Skin Tag <em>Removal Kit</em>",
    pSub: "One device, up to 40 treatments. For 1–8 mm skin tags – sterile and simple.",
    pick: "Choose your bundle:",
    b1: "1× Kit", b1s: "Starter pack", popular: "Most popular", b2: "Kit + 20 refill bands", b2s: "You save 990 Ft",
    bestValue: "Best value", b3: "Complete treatment", b3s: "Kit + 40 bands + 72 patches · free shipping",
    stock: "Popular – selling fast at Black Friday prices",
    addToCart: "Add to cart", buyNow: "Buy now",
    as1: "Encrypted checkout", as2: "24/7 customer support", as3: "Package protection",
    inBoxQ: "Full contents",
    inBoxP: "1 NUVAI removal device, 2 adapter heads (1–4 mm and 5–8 mm), micro-bands, antiseptic wipes and a detailed step-by-step guide.",
    howKicker: "How it works", howTitle: "Three steps to <em>clear skin</em>",
    s1t: "Position", s1p: "Clean the area and place the NUVAI device over the skin tag.",
    s2t: "Press", s2p: "One click applies the micro-band, which cuts off the blood supply.",
    s3t: "Let it be", s3p: "Within 3–14 days the skin tag falls off naturally – no scar, no pain.",
    day: "Day", d0: "Day 0", d10: "Day 10", simDone: "Clear, smooth skin", simHint: "↔ Drag the slider to see what happens day by day",
    rq: "“We don’t say it – the results prove it.”",
    resKicker: "Proven results", resTitle: "Real results, <em>from real people</em>",
    st1: "fully removed their skin tag within 7 days",
    st2: "saw a noticeable reduction in size and irritation within 72 hours",
    st3: "reported smoother, clearer skin with no pain, scarring or recurrence",
    resCta: "Try it now",
    cmpKicker: "Comparison", cmpTitle: "Why NUVAI™ is <em>the best choice</em>",
    cmpLaser: "Clinic laser", cmpOthers: "Others",
    c1: "Safe", c2: "Painless", c3: "Visible results", c4: "Clinically tested", c5: "Use at home", c6: "Price",
    cmpCta: "Choose NUVAI",
    bsKicker: "Bestsellers", bsTitle: "Complete <em>at-home hygiene</em>",
    tabAll: "All", tabSkin: "Skin", tabEar: "Ear & nose", tabSale: "On sale",
    fbtKicker: "Build your routine", fbtTitle: "Frequently <em>bought together</em>",
    fbtSel: "Total", fbtSave: "You save:", fbtAdd: "Add all to cart", fbtNote: "✓ Free shipping over 20,000 Ft",
    revKicker: "Customer reviews", revTitle: "10,000+ customers <em>already love it</em>",
    rvBased: "based on verified reviews", rvRec: "would recommend it to a friend",
    verified: "Verified purchase",
    r1t: "Gone in five days!", r1: "“A skin tag on my neck bothered me for years. It fell off in five days – no pain and no scar. I wish I had found this sooner!”",
    r2t: "It took two minutes", r2: "“I was afraid it would be complicated, but with the guide it took two minutes. The price is a fraction of a dermatologist visit.”",
    r3t: "Three tags, one week", r3: "“Fast shipping, premium packaging. I removed three tags from under my arm and all fell off within a week.”",
    r4t: "Professional team", r4: "“Customer service answered my question at 10 pm. Professional product, professional team.”",
    g1: "24/7 customer support", g1p: "We’re always by your side – reach us any time you have a question.",
    g2: "Secure payment", g2p: "Total peace of mind at checkout – every transaction is encrypted.",
    g3: "Fast GLS delivery", g3p: "Every order ships within 1–3 business days.",
    g4: "10,000+ happy customers", g4p: "Over 10,000 people joined us in 2025.",
    faqKicker: "FAQ", faqTitle: "Frequently asked <em>questions</em>",
    faqLead: "Can’t find your answer? Write to us – we reply within 24 hours.", helpT: "Personal help",
    q1: "Does the treatment hurt?", a1: "No. You’ll feel at most a light pressure when the micro-band is applied. The skin tag then dries out and falls off gradually, without pain.",
    q2: "How long until the skin tag falls off?", a2: "Usually 3–14 days, depending on size. For 98% of our customers it was completely gone within 7 days.",
    q3: "What size skin tags is it for?", a3: "Skin tags between 1 and 8 mm. The kit includes two adapter heads: 1–4 mm and 5–8 mm.",
    q4: "Will it leave a scar?", a4: "The method works without cutting or burning, so 93% of our customers reported smooth, scar-free skin.",
    q5: "How fast will my order arrive?", a5: "Every order ships within 1–3 business days, and GLS delivers most parcels within 2–3 days.",
    nlKicker: "Join our community", nlTitle: "Get <em>10% off</em> your first order",
    nlP: "Be the first to hear about exclusive skincare tips and new products.", subscribe: "Subscribe",
    ftTag: "Professional skincare at home – safe and painless.",
    ftShop: "Shop", ftL1: "Skin tag removal kit", ftL2: "Refills", ftL3: "Ear & nose cleaners",
    ftHelp: "Useful links", ftL4: "Shipping information", ftL5: "Contact",
    ftLegal: "Legal", ftL7: "Privacy policy (GDPR)", ftL8: "Terms of service", ftL9: "Withdrawal statement",
    copy: "© 2026 NUVAI Hungary. All rights reserved.",
    stickyName: "NUVAI Skin Tag Removal Kit", stickySub: "10,000+ happy customers",
    popSearch: "Popular searches",
    cartTitle: "Your cart", items: "item(s)", tShip: "Free shipping", tGift: "Free e-book",
    emptyT: "Your cart is empty", empty: "Start with the bestseller – now −50%.", startShop: "Add the kit – 15,900 Ft",
    upTitle: "Perfect add-ons", protect: "Package protection", protectS: "Instant replacement if lost or damaged",
    youSave: "You save", subtotal: "Total", checkout: "Secure checkout",
  };
  const EN_PH = { emailPh: "Email address", searchPh: "Search products…" };
  const UI = {
    hu: {
      tShip: n => `Még <b>${n}</b> és a szállítás <b>ingyenes</b>!`,
      tGift: n => `Ingyenes szállítás ✓ – még <b>${n}</b> és jár az <b>ajándék e-könyv</b>`,
      tDone: "🎉 Gratulálunk! <b>Ingyenes szállítás + ajándék e-könyv</b>",
      add: "Kosárba", added: "✓ Kosárban", qv: "Gyorsnézet", sale: "Akció", best: "Bestseller", newb: "Új",
      remove: "Eltávolítás", inStock: "● Raktáron – feladás 1–3 napon belül",
      nl: "Köszönjük! A kuponkódot elküldtük e-mailben.", checkout: "Prototípus – itt indulna a Shopify fizetés.",
      wish: "♥ Kedvencekhez adva", noRes: "Nincs találat.", small: "1–4 mm", large: "5–8 mm",
      status: ["Felhelyezés", "Mikrogyűrű a helyén", "Zsugorodik", "Kiszárad", "Leesett ✓"],
      date: d => d.toLocaleDateString("hu-HU", { month: "short", day: "numeric", weekday: "short" }),
    },
    en: {
      tShip: n => `You’re <b>${n}</b> away from <b>free shipping</b>!`,
      tGift: n => `Free shipping ✓ – <b>${n}</b> more for a <b>free e-book</b>`,
      tDone: "🎉 Congrats! <b>Free shipping + free e-book</b>",
      add: "Add", added: "✓ Added", qv: "Quick view", sale: "Sale", best: "Bestseller", newb: "New",
      remove: "Remove", inStock: "● In stock – ships in 1–3 days",
      nl: "Thank you! Your code is on its way.", checkout: "Prototype – Shopify checkout would start here.",
      wish: "♥ Added to wishlist", noRes: "No results.", small: "1–4 mm", large: "5–8 mm",
      status: ["Positioning", "Micro-band applied", "Shrinking", "Drying out", "Fallen off ✓"],
      date: d => d.toLocaleDateString("en-GB", { month: "short", day: "numeric", weekday: "short" }),
    },
  };

  const HU = {}, HU_PH = {};
  $$("[data-i18n]").forEach(el => (HU[el.dataset.i18n] = el.innerHTML));
  $$("[data-i18n-ph]").forEach(el => (HU_PH[el.dataset.i18nPh] = el.placeholder));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  let lang = store.get("nuvai-v2-lang", "hu");
  if (!["hu", "en"].includes(lang)) lang = "hu";

  /* ================= Products ================= */
  const P = {
    kit:     { img: "images/kit.webp", alt: "images/kit-lifestyle.webp", price: 15900, was: 31800, cat: "skin", badge: ["sale", "best"],
               hu: "Otthoni Bőrkinövés Eltávolító Készlet", en: "At-Home Skin Tag Removal Kit",
               dhu: "Egy eszköz, akár 40 kezelés. Két adapterfej (1–4 mm és 5–8 mm), mikrogyűrűk, fertőtlenítő kendők és magyar útmutató.",
               den: "One device, up to 40 treatments. Two adapter heads (1–4 mm and 5–8 mm), micro-bands, antiseptic wipes and a guide." },
    b2:      { img: "images/kit.webp", price: 18900, was: 35790, cat: "skin", hu: "Készlet + 20 db utántöltő", en: "Kit + 20 refill bands" },
    b3:      { img: "images/kit-lifestyle.webp", price: 23900, was: 43780, cat: "skin", hu: "Teljes kúra csomag", en: "Complete treatment bundle" },
    ear:     { img: "images/ear-cleaner.webp", price: 19900, was: 39900, cat: "ear", badge: ["sale"],
               hu: "Elektromos Fülzsír Eltávolító Készlet", en: "Electric Ear Wax Removal Kit",
               dhu: "Kíméletes, elektromos fülöblítő a tiszta és egészséges hallójáratért – otthon, percek alatt.",
               den: "A gentle electric ear irrigator for clean, healthy ear canals – at home, in minutes." },
    nose:    { img: "images/nose-cleaner.webp", price: 19900, was: 39800, cat: "ear", badge: ["sale"],
               hu: "Kétfunkciós Elektromos Orrtisztító", en: "Dual-Function Electric Nose Cleaner",
               dhu: "Orröblítés és szívás egy eszközben – puha, cserélhető szilikonfejjel.",
               den: "Nasal rinse and suction in one device – with a soft, replaceable silicone tip." },
    ring40:  { img: "images/refill-40.webp", price: 4990, cat: "skin", badge: ["best"],
               hu: "Hipoallergén Mikrogyűrűk (40 db)", en: "Hypoallergenic Micro-Bands (40 pcs)",
               dhu: "Vegyes méretű utántöltő mikrogyűrűk a NUVAI készlethez.", den: "Mixed-size refill micro-bands for the NUVAI kit." },
    patch72: { img: "images/patch-72.webp", price: 6990, cat: "skin", badge: ["new"],
               hu: "Növényi Kivonatos Tapasz (72 db)", en: "Botanical Skin Tag Patches (72 pcs)",
               dhu: "Teafa olajjal, E-vitaminnal és növényi kivonatokkal dúsított tapaszok.", den: "Patches with tea tree oil, vitamin E and botanical extracts." },
    ring20:  { img: "images/refill-20.webp", price: 3990, cat: "skin", vars: true,
               hu: "Hipoallergén Mikrogyűrűk (20 db)", en: "Hypoallergenic Micro-Bands (20 pcs)",
               dhu: "20 db utántöltő mikrogyűrű – válaszd ki a méretet. Csak a NUVAI készlettel használható.",
               den: "20 refill micro-bands – choose your size. For use with the NUVAI kit only." },
    prot28:  { img: "images/protect-28.webp", price: 1990, cat: "skin",
               hu: "Védőtapasz dörzsölődés ellen (28 db)", en: "Anti-Friction Protective Patches (28)",
               dhu: "Védi a kezelt területet a ruha dörzsölésétől.", den: "Protects the treated area from clothing friction." },
    ebook:   { img: "images/ebook.webp", price: 990, was: 2990, cat: "skin", badge: ["sale"],
               hu: "30 nap a tökéletes bőrért – e-könyv", en: "30 Days to Perfect Skin – e-book",
               dhu: "Teljes útmutató a tiszta, egészséges bőrhöz – azonnal letölthető.", den: "A complete guide to clear, healthy skin – instant download." },
  };
  const GRID = ["kit", "ear", "nose", "ring40", "patch72", "ring20", "prot28", "ebook"];
  const UPS = ["ring40", "patch72", "prot28", "ebook", "ring20", "ear", "nose"];
  const FBT = ["kit", "ring40", "patch72", "ebook"];
  const SHIP = 20000, GIFT = 25000, PROT = 990;
  const fmt = n => n.toLocaleString("hu-HU").replace(/ /g, " ") + " Ft";
  const nm = id => P[id][lang];
  const pct = p => Math.round((1 - p.price / p.was) * 100);

  /* ================= Language ================= */
  function applyLang(l, anim) {
    const run = () => {
      lang = l;
      const d = l === "en" ? EN : HU, ph = l === "en" ? EN_PH : HU_PH;
      $$("[data-i18n]").forEach(el => { const v = d[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
      $$("[data-i18n-ph]").forEach(el => (el.placeholder = ph[el.dataset.i18nPh]));
      document.documentElement.lang = l;
      document.title = l === "en" ? "NUVAI™ — At-home skin tag removal | NUVAI Hungary" : "NUVAI™ — Bőrkinövés eltávolítás otthon | NUVAI Magyarország";
      const sw = $(".lang"); sw.dataset.active = l;
      sw.querySelectorAll(".lang__btn").forEach(b => { const on = b.dataset.lang === l; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on); });
      store.set("nuvai-v2-lang", l);
      renderGrid(); renderFBT(); renderCart(); setDay(+range.value); setEta(); renderSearch(searchInput.value);
    };
    if (!anim) return run();
    document.body.classList.add("is-switching");
    setTimeout(() => { run(); document.body.classList.remove("is-switching"); }, 200);
  }
  $$(".lang__btn").forEach(b => b.addEventListener("click", () => b.dataset.lang !== lang && applyLang(b.dataset.lang, true)));

  /* ================= Announcement + countdown ================= */
  const anns = $$(".announce__rot span"); let ai = 0; anns[0].classList.add("is-on");
  setInterval(() => {
    const cur = anns[ai]; cur.classList.remove("is-on"); cur.classList.add("is-out");
    setTimeout(() => cur.classList.remove("is-out"), 650);
    ai = (ai + 1) % anns.length; anns[ai].classList.add("is-on");
  }, 3800);
  let END = new Date("2026-11-30T23:59:59+01:00").getTime();
  if (END < Date.now()) END = Date.now() + 3 * 864e5;
  const tick = () => {
    const s = Math.max(0, Math.floor((END - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    $$("[data-cd]").forEach(el => (el.textContent = String(v[el.dataset.cd]).padStart(2, "0")));
  };
  tick(); setInterval(tick, 1000);

  /* ================= ETA ================= */
  const addBiz = (d, n) => { const x = new Date(d); while (n > 0) { x.setDate(x.getDate() + 1); if (x.getDay() % 6) n--; } return x; };
  function setEta() { const t = new Date(); $$("[data-eta]").forEach(el => (el.textContent = `${UI[lang].date(addBiz(t, 2))} – ${UI[lang].date(addBiz(t, 4))}`)); }

  /* ================= Bundle picker + gallery ================= */
  let bqty = 1;
  const bundleVal = () => $(".bundle input:checked").value;
  function syncBundle() {
    const p = P[bundleVal()];
    $("[data-bundle-price]").textContent = fmt(p.price * bqty);
    $("[data-sticky-price]").textContent = fmt(p.price);
    $("[data-sticky-was]").textContent = fmt(p.was);
  }
  $$(".bundle input").forEach(inp => inp.addEventListener("change", () => {
    $$(".bundle").forEach(b => b.classList.toggle("is-selected", b.contains(inp))); syncBundle();
  }));
  $$("[data-bq]").forEach(b => b.addEventListener("click", () => { bqty = Math.max(1, bqty + +b.dataset.bq); $("[data-bqty]").textContent = bqty; syncBundle(); }));
  $$("[data-add-bundle]").forEach(b => b.addEventListener("click", () => add(bundleVal(), b.closest(".sticky-atc") ? 1 : bqty)));
  $("[data-express]").addEventListener("click", () => toast(UI[lang].checkout));
  const mainImg = $("[data-gallery-main]");
  $$("[data-thumb]").forEach(t => t.addEventListener("click", () => {
    $$("[data-thumb]").forEach(x => x.classList.toggle("is-active", x === t));
    mainImg.style.opacity = 0; setTimeout(() => { mainImg.src = t.dataset.thumb; mainImg.style.opacity = 1; }, 200);
  }));

  /* ================= Product grid ================= */
  const gridEl = $("[data-product-grid]");
  let filter = "all";
  const wish = new Set(store.get("nuvai-v2-wish", []));
  const variant = {};
  const heart = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>';
  const bag = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';
  const visible = id => filter === "all" || (filter === "sale" ? !!P[id].was : P[id].cat === filter);
  function renderGrid() {
    const t = UI[lang];
    gridEl.innerHTML = GRID.map((id, i) => {
      const p = P[id];
      const badges = (p.badge || []).map(b => `<span class="card__badge ${b === "sale" ? "card__badge--sale" : b === "new" ? "card__badge--new" : ""}">${b === "sale" ? `−${pct(p)}% ${t.sale}` : b === "new" ? t.newb : t.best}</span>`).join("");
      const vars = p.vars ? `<div class="card__vars">${["small", "large"].map(v => `<button class="${(variant[id] || "small") === v ? "is-on" : ""}" data-var="${id}:${v}">${t[v]}</button>`).join("")}</div>` : "";
      return `<article class="card ${visible(id) ? "" : "is-hidden"}" style="animation-delay:${i * 50}ms">
        <div class="card__media">
          <div class="card__badges">${badges}</div>
          <button class="card__wish ${wish.has(id) ? "is-on" : ""}" data-wish="${id}" aria-label="Wishlist">${heart}</button>
          <img src="${p.img}" alt="${nm(id)}" loading="lazy">
          ${p.alt ? `<img class="alt" src="${p.alt}" alt="" loading="lazy">` : ""}
          <button class="card__qv" data-qv-open="${id}">${t.qv}</button>
        </div>
        <div class="card__body">
          <div class="card__rate"><span class="stars">★★★★★</span><span>4.9</span></div>
          <h3 class="card__name">${nm(id)}</h3>
          ${vars}
          <div class="card__foot">
            <div class="card__price ${p.was ? "is-sale" : ""}"><strong>${fmt(p.price)}</strong>${p.was ? `<s>${fmt(p.was)}</s>` : ""}</div>
            <button class="card__add" data-add="${id}">${bag}<span>${t.add}</span></button>
          </div>
        </div>
      </article>`;
    }).join("");
  }
  $$(".tab").forEach(tab => tab.addEventListener("click", () => {
    $$(".tab").forEach(x => x.classList.toggle("is-active", x === tab));
    filter = tab.dataset.filter; renderGrid();
  }));

  /* ================= Day simulator ================= */
  const range = $("[data-day-range]");
  const tagG = $("[data-tag-group]"), heal = $("[data-heal]"), band = $("[data-band]");
  const tagA = $("[data-tag-a]"), tagB = $("[data-tag-b]");
  const mix = (a, b, k) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join(""); };
  function setDay(d) {
    range.value = d;
    range.style.setProperty("--fill", d * 10 + "%");
    $("[data-day-num]").textContent = d;
    const k = Math.min(1, Math.max(0, (d - 1) / 5)), fallen = d >= 7;
    tagG.setAttribute("transform", `translate(200 ${fallen ? 245 : 175}) scale(${fallen ? .3 : 1 - k * .42})`);
    tagG.style.opacity = fallen ? 0 : 1;
    band.style.opacity = d >= 1 ? 1 : 0;
    tagA.setAttribute("stop-color", mix("#d79a80", "#7a4636", k));
    tagB.setAttribute("stop-color", mix("#b8735a", "#4a2219", k));
    heal.style.opacity = fallen ? Math.max(0, 1 - (d - 7) / 3.5) : 0;
    const st = UI[lang].status;
    $("[data-day-status]").textContent = d === 0 ? st[0] : d < 3 ? st[1] : d < 5 ? st[2] : d < 7 ? st[3] : st[4];
    $("[data-done]").classList.toggle("is-on", fallen);
    const idx = d < 2 ? 0 : d < 7 ? 1 : 2;
    $$(".step").forEach((s, i) => s.classList.toggle("is-on", i === idx));
  }
  range.addEventListener("input", () => { clearInterval(animT); setDay(+range.value); });
  let animT;
  const animateTo = target => { clearInterval(animT); animT = setInterval(() => { const v = +range.value; if (v === target) return clearInterval(animT); setDay(v + Math.sign(target - v)); }, 150); };
  $$(".step").forEach(s => s.addEventListener("click", () => animateTo(+s.dataset.day)));

  /* ================= Bought together ================= */
  const fbtSel = new Set(FBT);
  function renderFBT() {
    $("[data-fbt]").innerHTML = FBT.map(id => {
      const p = P[id], on = fbtSel.has(id);
      return `<label class="fitem ${on ? "is-on" : "is-off"}"><input type="checkbox" ${on ? "checked" : ""} data-fbt-id="${id}">
        <span class="fitem__chk">✓</span><img src="${p.img}" alt="" loading="lazy"><b>${nm(id)}</b>
        <span>${fmt(p.price)}${p.was ? `<s>${fmt(p.was)}</s>` : ""}</span></label>`;
    }).join("");
    const ids = [...fbtSel];
    const tot = ids.reduce((s, id) => s + P[id].price, 0), was = ids.reduce((s, id) => s + (P[id].was || P[id].price), 0);
    $("[data-fbt-total]").textContent = fmt(tot);
    $("[data-fbt-was]").textContent = was > tot ? fmt(was) : "";
    $("[data-fbt-save]").textContent = fmt(was - tot);
    $("[data-fbt-count]").textContent = ids.length;
    $("[data-fbt-add]").disabled = !ids.length;
  }
  $("[data-fbt]").addEventListener("change", e => { const id = e.target.dataset.fbtId; if (!id) return; e.target.checked ? fbtSel.add(id) : fbtSel.delete(id); renderFBT(); });
  $("[data-fbt-add]").addEventListener("click", () => { if (!fbtSel.size) return; [...fbtSel].forEach(id => add(id, 1, true)); renderCart(); openCart(); });

  /* ================= Cart ================= */
  let cart = store.get("nuvai-v2-cart", []).filter(l => l && P[l.id] && l.key);
  let protect = false;
  const cartEl = $("[data-cart]"), overlay = $("[data-overlay]");
  const keyOf = id => P[id].vars ? `${id}:${variant[id] || "small"}` : id;
  const save = () => store.set("nuvai-v2-cart", cart);

  function add(id, qty = 1, silent) {
    const key = keyOf(id), l = cart.find(x => x.key === key);
    l ? (l.qty += qty) : cart.push({ key, id, qty });
    save();
    $$("[data-cart-count]").forEach(el => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
    $$(`.card__add[data-add="${id}"]`).forEach(b => { b.classList.add("is-done"); b.querySelector("span").textContent = UI[lang].added; setTimeout(() => { b.classList.remove("is-done"); b.querySelector("span").textContent = UI[lang].add; }, 1600); });
    if (!silent) { renderCart(); openCart(); }
  }

  function renderCart() {
    const t = UI[lang];
    const count = cart.reduce((s, l) => s + l.qty, 0);
    const sub = cart.reduce((s, l) => s + P[l.id].price * l.qty, 0);
    const saved = cart.reduce((s, l) => s + ((P[l.id].was || P[l.id].price) - P[l.id].price) * l.qty, 0);
    const freeShip = sub >= SHIP || cart.some(l => l.id === "b3");
    $$("[data-cart-count]").forEach(el => (el.textContent = count));

    $("[data-cart-items]").innerHTML = cart.map(l => {
      const p = P[l.id], v = l.key.includes(":") ? ` · ${t[l.key.split(":")[1]]}` : "";
      return `<li class="line"><img src="${p.img}" alt="">
        <div><div class="line__name">${nm(l.id)}${v}</div><div class="line__meta">${t.inStock}</div>
          <div class="qty"><button data-q="${l.key}" data-d="-1" aria-label="−">−</button><span>${l.qty}</span><button data-q="${l.key}" data-d="1" aria-label="+">+</button></div></div>
        <div class="line__right"><div class="line__price">${fmt(p.price * l.qty)}${p.was ? `<s>${fmt(p.was * l.qty)}</s>` : ""}</div>
          <button class="line__rm" data-rm="${l.key}" aria-label="${t.remove}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg></button></div></li>`;
    }).join("");
    $("[data-cart-empty]").classList.toggle("is-on", !cart.length);

    let w, msg;
    if (!cart.length) { w = 0; msg = t.tShip(fmt(SHIP)); }
    else if (sub >= GIFT) { w = 100; msg = t.tDone; }
    else if (freeShip) { w = 80 + Math.max(0, (sub - SHIP) / (GIFT - SHIP)) * 20; msg = t.tGift(fmt(GIFT - sub)); }
    else { w = (sub / SHIP) * 80; msg = t.tShip(fmt(SHIP - sub)); }
    $("[data-tier-fill]").style.width = Math.min(100, w) + "%";
    $("[data-tier-msg]").innerHTML = msg;
    $('[data-tier="ship"]').classList.toggle("is-hit", !!(cart.length && freeShip));
    $('[data-tier="gift"]').classList.toggle("is-hit", sub >= GIFT);

    const inCart = new Set(cart.map(l => l.id));
    $("[data-upsells]").innerHTML = UPS.filter(id => !inCart.has(id)).map(id => {
      const p = P[id];
      return `<div class="up"><div class="up__img"><img src="${p.img}" alt="" loading="lazy">${p.was ? `<span class="card__badge card__badge--sale">−${pct(p)}%</span>` : ""}</div>
        <div class="up__name">${nm(id)}</div><div class="up__price">${fmt(p.price)}${p.was ? `<s>${fmt(p.was)}</s>` : ""}</div>
        <button class="up__add" data-add="${id}">+ ${t.add}</button></div>`;
    }).join("");

    $("[data-subtotal]").textContent = fmt(sub + (protect && cart.length ? PROT : 0));
    $("[data-savings]").textContent = saved ? "−" + fmt(saved) : fmt(0);
  }
  function openCart() { cartEl.classList.add("is-open"); overlay.classList.add("is-on"); cartEl.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function closeCart() { cartEl.classList.remove("is-open"); overlay.classList.remove("is-on"); cartEl.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  $$("[data-up]").forEach(b => b.addEventListener("click", () => $("[data-upsells]").scrollBy({ left: +b.dataset.up * 190, behavior: "smooth" })));
  $("[data-protect]").addEventListener("change", e => { protect = e.target.checked; renderCart(); });
  $$("[data-checkout]").forEach(b => b.addEventListener("click", () => toast(UI[lang].checkout)));

  /* ================= Quick view ================= */
  const qv = $("[data-qv]"); let qvId = null, qvQty = 1;
  function openQV(id) {
    const p = P[id]; qvId = id; qvQty = 1;
    $("[data-qv-img]").src = p.img;
    $("[data-qv-name]").textContent = nm(id);
    $("[data-qv-price]").textContent = fmt(p.price);
    $("[data-qv-was]").textContent = p.was ? fmt(p.was) : "";
    const bd = $("[data-qv-badge]"); bd.style.display = p.was ? "" : "none"; bd.textContent = p.was ? `−${pct(p)}%` : "";
    $("[data-qv-desc]").textContent = lang === "en" ? p.den : p.dhu;
    $("[data-qv-qty]").textContent = 1;
    qv.classList.add("is-on"); qv.setAttribute("aria-hidden", "false");
  }
  const closeQV = () => { qv.classList.remove("is-on"); qv.setAttribute("aria-hidden", "true"); };
  $$("[data-qv-q]").forEach(b => b.addEventListener("click", () => { qvQty = Math.max(1, qvQty + +b.dataset.qvQ); $("[data-qv-qty]").textContent = qvQty; }));
  $("[data-qv-add]").addEventListener("click", () => { closeQV(); add(qvId, qvQty); });
  qv.addEventListener("click", e => { if (e.target === qv || e.target.closest("[data-qv-close]")) closeQV(); });

  /* ================= Search ================= */
  const search = $("[data-search]"), searchInput = $("[data-search-input]");
  function renderSearch(q) {
    q = (q || "").trim().toLowerCase();
    const res = $("[data-search-res]");
    if (!q) { res.innerHTML = ""; return; }
    const hits = GRID.filter(id => (P[id].hu + " " + P[id].en).toLowerCase().includes(q));
    res.innerHTML = hits.length ? hits.map(id => `<button class="sres" data-sres="${id}"><img src="${P[id].img}" alt=""><div><b>${nm(id)}</b><span>${fmt(P[id].price)}</span></div></button>`).join("") : `<p class="muted" style="padding:10px">${UI[lang].noRes}</p>`;
  }
  const openSearch = () => { search.classList.add("is-on"); search.setAttribute("aria-hidden", "false"); setTimeout(() => searchInput.focus(), 100); };
  const closeSearch = () => { search.classList.remove("is-on"); search.setAttribute("aria-hidden", "true"); };
  searchInput.addEventListener("input", () => renderSearch(searchInput.value));
  $$("[data-sq]").forEach(b => b.addEventListener("click", () => { searchInput.value = b.dataset.sq; renderSearch(b.dataset.sq); }));
  search.addEventListener("click", e => {
    if (e.target === search || e.target.closest("[data-close-search]")) return closeSearch();
    const r = e.target.closest("[data-sres]"); if (r) { closeSearch(); openQV(r.dataset.sres); }
  });

  /* ================= Global clicks ================= */
  const menu = $("[data-menu]");
  const toggleMenu = on => { menu.classList.toggle("is-open", on); menu.setAttribute("aria-hidden", !on); };
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-add]");
    if (a) { e.preventDefault(); add(a.dataset.add); return; }
    const w = e.target.closest("[data-wish]");
    if (w) { const id = w.dataset.wish; wish.has(id) ? wish.delete(id) : (wish.add(id), toast(UI[lang].wish)); w.classList.toggle("is-on", wish.has(id)); store.set("nuvai-v2-wish", [...wish]); $("[data-wish-count]").textContent = wish.size; return; }
    const v = e.target.closest("[data-var]");
    if (v) { const [id, val] = v.dataset.var.split(":"); variant[id] = val; v.parentElement.querySelectorAll("button").forEach(b => b.classList.toggle("is-on", b === v)); return; }
    const o = e.target.closest("[data-qv-open]");
    if (o) { openQV(o.dataset.qvOpen); return; }
    const q = e.target.closest("[data-q]");
    if (q) { const l = cart.find(x => x.key === q.dataset.q); l.qty += +q.dataset.d; if (l.qty < 1) cart = cart.filter(x => x !== l); save(); renderCart(); return; }
    const rm = e.target.closest("[data-rm]");
    if (rm) { cart = cart.filter(x => x.key !== rm.dataset.rm); save(); renderCart(); return; }
    if (e.target.closest("[data-open-cart]")) return openCart();
    if (e.target.closest("[data-close-cart]") || e.target === overlay) return closeCart();
    if (e.target.closest("[data-open-search]")) return openSearch();
    if (e.target.closest("[data-open-menu]")) return toggleMenu(true);
    if (e.target.closest("[data-close-menu]") || e.target === menu || (menu.classList.contains("is-open") && e.target.closest(".mmenu a"))) return toggleMenu(false);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeCart(); closeQV(); closeSearch(); toggleMenu(false); } });
  $("[data-wish-count]").textContent = wish.size;

  /* ================= Reviews slider + newsletter ================= */
  const rev = $("[data-reviews]");
  $$("[data-rev]").forEach(b => b.addEventListener("click", () => { const c = rev.querySelector(".review"); rev.scrollBy({ left: +b.dataset.rev * (c.offsetWidth + 22), behavior: "smooth" }); }));
  $("[data-nl]").addEventListener("submit", e => { e.preventDefault(); $("[data-nl-msg]").textContent = UI[lang].nl; e.target.reset(); });

  /* ================= Toast ================= */
  let tt; const toastEl = $("[data-toast]");
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("is-on"), 2400); }

  /* ================= Scroll effects ================= */
  const header = $("[data-header]"), sticky = $("[data-sticky]"), shop = $("#shop"), hero = $(".hero");
  function onScroll() {
    header.classList.toggle("is-scrolled", scrollY > 10);
    const heroBottom = hero.getBoundingClientRect().bottom, r = shop.getBoundingClientRect();
    const inShop = r.top < innerHeight && r.bottom > 0;
    const nearEnd = innerHeight + scrollY > document.documentElement.scrollHeight - 250;
    sticky.classList.toggle("is-on", heroBottom < 0 && !inShop && !nearEnd);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const count = el => {
    const T = +el.dataset.count, t0 = performance.now(), ring = el.closest(".stat__ring");
    const f = now => { const k = Math.min(1, (now - t0) / 1600), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(T * e); if (ring) ring.style.setProperty("--v", T * e); if (k < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  };
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in");
    en.target.querySelectorAll("[data-count]").forEach(count);
    io.unobserve(en.target);
  }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));
  const simIO = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { setTimeout(() => animateTo(7), 600); simIO.disconnect(); } }), { threshold: .5 });
  simIO.observe($(".sim"));

  syncBundle();
  applyLang(lang, false);
})();
