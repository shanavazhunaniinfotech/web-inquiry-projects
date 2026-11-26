(() => {
  "use strict";
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  /* =================== i18n =================== */
  // HU text is read from the HTML on load; EN lives here.
  const EN = {
    heroPill: "Hungary’s #1 at-home skin tag remover",
    heroH1: "Clear skin. <em>No clinic needed.</em>",
    heroSub: "Professional-grade skin tag removal at home – safe, painless and with scar-free results.",
    heroBtn: "Shop now", heroBtn2: "How does it work?", heroFrom: "Now only",
    co1: "Painless", co1s: "Light pressure at most", co2: "Scar-free", co2s: "No cutting or burning", co3: "Sterile", co3s: "With antiseptic wipes",
    co4: "3–14 days", co4s: "Falls off on its own", co5: "1–8 mm", co5s: "Two adapter heads", co6: "40× treatments", co6s: "With a single kit",
    promo: "−50% on every NUVAI kit + free e-book over 25,000 Ft",
    endsIn: "Ends in:", cdD: "d", cdH: "h", cdM: "m", cdS: "s",
    nav1: "Skin tags", nav2: "Ear & nose", nav3: "How it works", nav4: "Reviews", nav5: "FAQ",
    megaK1: "Categories", mg1: "Removal kits", mg2: "Refill micro-bands", mg3: "Botanical patches", mg4: "Protective patches", mg5: "Bundle deals",
    pKitShort: "Removal kit", pRingShort: "Micro-bands (40 pcs)", megaPromo: "on the complete treatment bundle",
    pEarShort: "Electric ear cleaner", pNoseShort: "Electric nose cleaner",
    chipA: "gone within 7 days", chipB: "Painless", chipC: "Sterile · CE marked",
    badgeBest: "#1 Bestseller", ratingCount: "10,000+ happy customers",
    heroTitle: "Remove skin tags at home – <span class=\"grad\">no pain, no scars.</span>",
    heroLead: "Professional results without a clinic. One kit, up to 40 treatments, for skin tags 1–8 mm.",
    t1: "Clinically tested, sterile method", t2: "Falls off on its own in 3–14 days", t3: "No cutting, burning or freezing",
    o1: "1× Kit", o1s: "Starter pack", popular: "🔥 Most popular", o2: "Kit + 20 bands", o2s: "Save 990 Ft",
    bestValue: "💎 Best value", o3: "Complete treatment", o3s: "+40 bands +72 patches · free shipping",
    stock: "Low stock – only a few left at Black Friday prices",
    addToCart: "Add to cart", buyNow: "Buy now",
    etaA: "Order today, estimated delivery:",
    tr1: "Encrypted checkout", tr2: "24/7 customer support", tr3: "Package protection",
    tk1: "10,000+ happy customers", tk2: "Clinically tested", tk3: "GLS delivery in 2–3 days", tk4: "98% results in 7 days", tk5: "24/7 customer support",
    catK: "Shop by category", catT: "Everything your skin <span class=\"grad\">needs</span>", viewAll: "All products →",
    c1: "Skin tag removal", c1s: "Kits & bundles →", c2: "Refills", c2s: "3 products →", c3: "Patches", c3s: "2 products →",
    c4: "Ear cleaning", c4s: "Electric kit →", c5: "Nose cleaning", c5s: "Dual-function device →",
    bsK: "Bestsellers", bsT: "Our customers’ <span class=\"grad\">favourites</span>",
    fAll: "All", fSkin: "Skincare", fEar: "Ear & nose", fSale: "On sale",
    howK: "How it works", howT: "Drag the slider and <span class=\"grad\">see the result</span>",
    howP: "The NUVAI micro-band cuts off the skin tag’s blood supply, so it falls off by itself in a few days – without a scar.",
    hs1: "Position", hs1s: "Disinfect + place the device", hs2: "Click", hs2s: "The micro-band locks into place", hs3: "It falls off", hs3s: "In 3–14 days, without pain",
    howCta: "Try it now – 15,900 Ft", day: "Day", d0: "Day 0", d10: "Day 10", simDone: "Clear, smooth skin",
    resK: "Proven results", resT: "We don’t say it – <span class=\"grad grad--light\">the results prove it</span>",
    st1: "fully removed their skin tag within 7 days", st2: "saw reduced size and irritation within 72 hours", st3: "reported smoother skin with no scar or recurrence",
    cmpL: "Laser", cmpO: "Others", cm1: "Painless", cm2: "Scar-free result", cm3: "Use at home", cm4: "Clinically tested", cm5: "Price",
    cmpCta: "Choose NUVAI →",
    fbtK: "Build your routine", fbtT: "Frequently <span class=\"grad\">bought together</span>",
    fbtSel: "Selected", fbtProd: "products", fbtSave: "You save:", fbtAdd: "Add all to cart", fbtNote: "✓ Free shipping over 20,000 Ft",
    rvK: "Customer reviews", rvT: "10,000+ customers <span class=\"grad\">already love it</span>",
    rvBased: "based on verified reviews", rvRec: "would recommend it to a friend", rvWrite: "Write a review",
    verified: "✓ Verified purchase",
    r1t: "Gone in five days!", r1: "A skin tag on my neck bothered me for years. It fell off in five days – no pain and no scar.",
    r2t: "It took two minutes", r2: "I was afraid it would be complicated, but with the guide it took two minutes. A fraction of a dermatologist’s price.",
    r3t: "Three tags, one week", r3: "Fast shipping, premium packaging. I removed three skin tags and all fell off within a week.",
    r4t: "Professional team", r4: "Customer service answered my question at 10 pm. Professional product, professional team.",
    g1: "24/7 customer support", g1p: "We’re always by your side.", g2: "Secure payment", g2p: "Every transaction is encrypted.",
    g3: "Fast GLS delivery", g3p: "Ships within 1–3 business days.", g4: "10,000+ customers", g4p: "Joined us in 2025.",
    faqK: "FAQ", faqT: "Got a question? <span class=\"grad\">We’re here to help!</span>", helpT: "Personal help within 24 hours",
    q1: "Does the treatment hurt?", a1: "No. You’ll feel at most a light pressure when the micro-band is applied. The skin tag then dries out and falls off gradually, without pain.",
    q2: "How long until the skin tag falls off?", a2: "Usually 3–14 days, depending on size. For 98% of our customers it was completely gone within 7 days.",
    q3: "What size skin tags is it for?", a3: "Skin tags between 1 and 8 mm. The kit includes two adapter heads: 1–4 mm and 5–8 mm.",
    q4: "Will it leave a scar?", a4: "The method works without cutting or burning, so 93% of our customers reported smooth, scar-free skin.",
    q5: "How fast will my order arrive?", a5: "Every order ships within 1–3 business days, and GLS delivers most parcels within 2–3 days.",
    q6: "What’s in the box?", a6: "1 NUVAI removal device, 2 adapter heads (1–4 mm and 5–8 mm), micro-bands, antiseptic wipes and a detailed step-by-step guide.",
    finT: "Clear skin, half price. <span>Only for a few days.</span>",
    cdDays: "days", cdHours: "hours", cdMins: "min", cdSecs: "sec", finCta: "Get it at −50%",
    nlT: "Get 10% off your first order", nlP: "Exclusive skincare tips and news – first.", subscribe: "Subscribe",
    ftTag: "Professional skincare at home – safe and painless.",
    ftShop: "Shop", ftL1: "Removal kit", ftL2: "Refills", ftL3: "Ear & nose cleaners",
    ftHelp: "Help", ftL4: "Shipping information", ftL5: "Contact",
    ftLegal: "Legal", ftL7: "Privacy (GDPR)", ftL8: "Terms of service", ftL9: "Withdrawal statement",
    copy: "© 2026 NUVAI Hungary. All rights reserved.",
    satcName: "NUVAI Skin Tag Removal Kit", satcSub: "10,000+ happy customers",
    popular2: "Popular searches",
    popK: "Just for you", popT: "An extra 10% off Black Friday prices", popP: "Enter your email and we’ll send your code instantly.",
    popCta: "Send my code", popNo: "No thanks, I’ll pay full price",
    cartT: "Your cart", items: "item(s)", tShip: "Free shipping", tGift: "Free e-book",
    emptyT: "Your cart is empty", empty: "Start with the bestseller – now −50%.", emptyCta: "Add the kit – 15,900 Ft",
    upT: "Perfect add-ons", protect: "Package protection", protectS: "Instant replacement if lost or damaged",
    youSave: "You save", subtotal: "Total", checkout: "Secure checkout",
  };
  const EN_PH = { emailPh: "Email address", searchPh: "Search…" };

  const UI = {
    hu: {
      tShip: n => `Még <b>${n}</b> és a szállítás <b>ingyenes</b> 🚚`,
      tGift: n => `Ingyenes szállítás ✓ – még <b>${n}</b> és jár az <b>ajándék e-könyv</b> 🎁`,
      tDone: "🎉 Minden jutalom feloldva: <b>ingyenes szállítás + ajándék e-könyv</b>",
      added: n => `✓ ${n} – kosárba került`, add: "Kosárba", added2: "✓ Kosárban", qv: "Gyorsnézet",
      sale: "AKCIÓ", best: "BESTSELLER", newb: "ÚJ", remove: "Eltávolítás", inStock: "● Raktáron – feladás 1–3 napon belül",
      nl: "Köszönjük! A kuponkódot elküldtük e-mailben.", checkout: "Prototípus – itt indulna a Shopify fizetés.",
      wish: "♥ Kedvencekhez adva", noRes: "Nincs találat.", small: "1–4 mm", large: "5–8 mm",
      status: ["Felhelyezés", "Mikrogyűrű a helyén", "Zsugorodik", "Kiszárad", "Leesett ✓"],
      date: d => d.toLocaleDateString("hu-HU", { month: "short", day: "numeric", weekday: "short" }),
    },
    en: {
      tShip: n => `<b>${n}</b> away from <b>free shipping</b> 🚚`,
      tGift: n => `Free shipping ✓ – <b>${n}</b> more for a <b>free e-book</b> 🎁`,
      tDone: "🎉 All rewards unlocked: <b>free shipping + free e-book</b>",
      added: n => `✓ ${n} – added to cart`, add: "Add", added2: "✓ Added", qv: "Quick view",
      sale: "SALE", best: "BESTSELLER", newb: "NEW", remove: "Remove", inStock: "● In stock – ships in 1–3 days",
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
  let lang = store.get("nv2-lang", "hu");
  if (!["hu", "en"].includes(lang)) lang = "hu";

  /* =================== Products =================== */
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
               dhu: "Orröblítés és szívás egy eszközben – puha, cserélhető szilikonfejjel az egész családnak.",
               den: "Nasal rinse and suction in one device – with a soft, replaceable silicone tip for the whole family." },
    ring40:  { img: "images/refill-40.webp", price: 4990, cat: "skin", badge: ["best"],
               hu: "Hipoallergén Mikrogyűrűk (40 db)", en: "Hypoallergenic Micro-Bands (40 pcs)",
               dhu: "Vegyes méretű utántöltő mikrogyűrűk a NUVAI készlethez – 20 db 1–4 mm + 20 db 5–8 mm.",
               den: "Mixed-size refill micro-bands for the NUVAI kit – 20 × 1–4 mm + 20 × 5–8 mm." },
    patch72: { img: "images/patch-72.webp", price: 6990, cat: "skin", badge: ["new"],
               hu: "Növényi Kivonatos Tapasz (72 db)", en: "Botanical Skin Tag Patches (72 pcs)",
               dhu: "Teafa olajjal, E-vitaminnal és növényi kivonatokkal dúsított tapaszok a bőr ápolásáért.",
               den: "Patches enriched with tea tree oil, vitamin E and botanical extracts to care for your skin." },
    ring20:  { img: "images/refill-20.webp", price: 3990, cat: "skin", vars: true,
               hu: "Hipoallergén Mikrogyűrűk (20 db)", en: "Hypoallergenic Micro-Bands (20 pcs)",
               dhu: "20 db utántöltő mikrogyűrű – válaszd ki a méretet. Csak a NUVAI készlettel használható.",
               den: "20 refill micro-bands – choose your size. For use with the NUVAI kit only." },
    prot28:  { img: "images/protect-28.webp", price: 1990, cat: "skin",
               hu: "Védőtapasz dörzsölődés ellen (28 db)", en: "Anti-Friction Protective Patches (28)",
               dhu: "Védi a kezelt területet a ruha dörzsölésétől a gyorsabb, kényelmes gyógyulásért.",
               den: "Protects the treated area from clothing friction for faster, more comfortable healing." },
    ebook:   { img: "images/ebook.webp", price: 990, was: 2990, cat: "skin", badge: ["sale"],
               hu: "30 nap a tökéletes bőrért – e-könyv", en: "30 Days to Perfect Skin – e-book",
               dhu: "Teljes útmutató a tiszta, egészséges bőrhöz – azonnal letölthető.",
               den: "A complete guide to clear, healthy skin – instant download." },
  };
  const GRID = ["kit", "ear", "nose", "ring40", "patch72", "ring20", "prot28", "ebook"];
  const UPS = ["ring40", "patch72", "prot28", "ebook", "ring20", "ear", "nose"];
  const FBT = ["kit", "ring40", "patch72", "ebook"];
  const SHIP = 20000, GIFT = 25000, PROT = 990;
  const fmt = n => n.toLocaleString("hu-HU").replace(/ /g, " ") + " Ft";
  const nm = id => P[id][lang];

  /* =================== Language =================== */
  function applyLang(l, anim) {
    const run = () => {
      lang = l;
      const d = l === "en" ? EN : HU, ph = l === "en" ? EN_PH : HU_PH;
      $$("[data-i18n]").forEach(el => { const v = d[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
      $$("[data-i18n-ph]").forEach(el => (el.placeholder = ph[el.dataset.i18nPh]));
      document.documentElement.lang = l;
      document.title = l === "en" ? "NUVAI™ — At-home skin tag removal | Black Friday −50%" : "NUVAI™ — Bőrkinövés eltávolítás otthon | Black Friday −50%";
      const sw = $(".lang"); sw.dataset.active = l;
      sw.querySelectorAll("button").forEach(b => { const on = b.dataset.lang === l; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on); });
      store.set("nv2-lang", l);
      renderGrid(); renderFBT(); renderCart(); setDay(+range.value); setEta(); renderSearch(searchInput.value);
    };
    if (!anim) return run();
    document.body.classList.add("is-sw");
    setTimeout(() => { run(); document.body.classList.remove("is-sw"); }, 200);
  }
  $$(".lang button").forEach(b => b.addEventListener("click", () => b.dataset.lang !== lang && applyLang(b.dataset.lang, true)));

  /* =================== Countdown (Black Friday → Cyber Monday end) =================== */
  let END = new Date("2026-11-30T23:59:59+01:00").getTime();
  if (END < Date.now()) END = Date.now() + 3 * 864e5;
  function tick() {
    let s = Math.max(0, Math.floor((END - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    $$("[data-cd]").forEach(el => (el.textContent = String(v[el.dataset.cd]).padStart(2, "0")));
  }
  tick(); setInterval(tick, 1000);

  /* =================== ETA =================== */
  function addBiz(d, n) { const x = new Date(d); while (n > 0) { x.setDate(x.getDate() + 1); if (x.getDay() % 6) n--; } return x; }
  function setEta() { const t = new Date(); $("[data-eta]").textContent = `${UI[lang].date(addBiz(t, 2))} – ${UI[lang].date(addBiz(t, 4))}`; }

  /* =================== Hero offer =================== */
  const offerVal = () => $(".offer input:checked").value;
  function syncOffer() {
    const p = P[offerVal()];
    $("[data-offer-price]").textContent = fmt(p.price);
    $("[data-satc-price]").textContent = fmt(p.price);
    $("[data-satc-was]").textContent = fmt(p.was);
  }
  $$(".offer input").forEach(i => i.addEventListener("change", () => { $$(".offer").forEach(o => o.classList.toggle("is-on", o.contains(i))); syncOffer(); }));
  $$("[data-add-offer]").forEach(b => b.addEventListener("click", () => add(offerVal())));
  $("[data-express]").addEventListener("click", () => toast(UI[lang].checkout));
  const heroImg = $("[data-hero-img]");
  $$("[data-hthumb]").forEach(t => t.addEventListener("click", () => {
    $$("[data-hthumb]").forEach(x => x.classList.toggle("is-on", x === t));
    heroImg.style.opacity = 0; setTimeout(() => { heroImg.src = t.dataset.hthumb; heroImg.style.opacity = 1; }, 200);
  }));

  /* =================== Product grid =================== */
  const grid = $("[data-grid]");
  let filter = "all";
  const wish = new Set(store.get("nv2-wish", []));
  const variant = {};
  const heart = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>';
  const bag = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';
  const visible = id => filter === "all" || (filter === "sale" ? !!P[id].was : P[id].cat === filter);

  function renderGrid() {
    const t = UI[lang];
    grid.innerHTML = GRID.map((id, i) => {
      const p = P[id];
      const badges = (p.badge || []).map(b => `<span class="pb ${b === "sale" ? "pb--sale" : b === "new" ? "pb--new" : ""}">${b === "sale" ? "−" + Math.round((1 - p.price / p.was) * 100) + "% " + t.sale : b === "new" ? t.newb : t.best}</span>`).join("");
      const vars = p.vars ? `<div class="pcard__vars">${["small", "large"].map(v => `<button class="${(variant[id] || "small") === v ? "is-on" : ""}" data-var="${id}:${v}">${t[v]}</button>`).join("")}</div>` : "";
      return `<article class="pcard ${visible(id) ? "" : "is-hidden"}" data-id="${id}" style="animation-delay:${i * 50}ms">
        <div class="pcard__media">
          <div class="pcard__badges">${badges}</div>
          <button class="pcard__wish ${wish.has(id) ? "is-on" : ""}" data-wish="${id}" aria-label="Wishlist">${heart}</button>
          <img src="${p.img}" alt="${nm(id)}" loading="lazy">
          ${p.alt ? `<img class="alt" src="${p.alt}" alt="" loading="lazy">` : ""}
          <button class="pcard__qv" data-qv-open="${id}">${t.qv}</button>
        </div>
        <div class="pcard__body">
          <div class="pcard__rate"><span class="stars">★★★★★</span><span>4.9</span></div>
          <h3 class="pcard__name">${nm(id)}</h3>
          ${vars}
          <div class="pcard__foot">
            <div class="pcard__price ${p.was ? "is-sale" : ""}"><b>${fmt(p.price)}</b>${p.was ? `<s>${fmt(p.was)}</s>` : ""}</div>
            <button class="pcard__add" data-add="${id}">${bag}<span>${t.add}</span></button>
          </div>
        </div>
      </article>`;
    }).join("");
  }
  $$(".seg button").forEach(b => b.addEventListener("click", () => {
    $$(".seg button").forEach(x => x.classList.toggle("is-on", x === b));
    filter = b.dataset.filter; renderGrid();
  }));

  /* =================== Day simulator =================== */
  const range = $("[data-day-range]");
  const tagG = $("[data-tag-group]"), heal = $("[data-heal]"), band = $("[data-band]");
  const tagA = $("[data-tag-a]"), tagB = $("[data-tag-b]");
  const mix = (a, b, k) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join(""); };
  function setDay(d) {
    range.value = d;
    range.style.setProperty("--fill", (d / 10) * 100 + "%");
    $("[data-day-num]").textContent = d;
    const k = Math.min(1, Math.max(0, (d - 1) / 5));
    const fallen = d >= 7;
    const sc = 1 - k * .42;
    tagG.setAttribute("transform", `translate(200 ${fallen ? 260 : 190}) scale(${fallen ? .3 : sc})`);
    tagG.style.opacity = fallen ? 0 : 1;
    band.style.opacity = d >= 1 ? 1 : 0;
    tagA.setAttribute("stop-color", mix("#d79a80", "#7a4636", k));
    tagB.setAttribute("stop-color", mix("#b8735a", "#4a2219", k));
    heal.style.opacity = fallen ? Math.max(0, 1 - (d - 7) / 3.5) : 0;
    const st = UI[lang].status;
    $("[data-day-status]").textContent = d === 0 ? st[0] : d < 3 ? st[1] : d < 5 ? st[2] : d < 7 ? st[3] : st[4];
    $("[data-done]").classList.toggle("is-on", fallen);
    const idx = d < 2 ? 0 : d < 7 ? 1 : 2;
    $$(".hstep").forEach((s, i) => s.classList.toggle("is-on", i === idx));
  }
  range.addEventListener("input", () => setDay(+range.value));
  $$(".hstep").forEach(s => s.addEventListener("click", () => animateTo(+s.dataset.day)));
  let animT;
  function animateTo(target) {
    clearInterval(animT);
    animT = setInterval(() => { const v = +range.value; if (v === target) return clearInterval(animT); setDay(v + Math.sign(target - v)); }, 140);
  }

  /* =================== FBT =================== */
  const fbtSel = new Set(FBT);
  function renderFBT() {
    $("[data-fbt]").innerHTML = FBT.map(id => {
      const p = P[id], on = fbtSel.has(id);
      return `<label class="fitem ${on ? "is-on" : "is-off"}">
        <input type="checkbox" ${on ? "checked" : ""} data-fbt-id="${id}">
        <span class="fitem__chk">✓</span>
        <img src="${p.img}" alt="" loading="lazy">
        <b>${nm(id)}</b>
        <span>${fmt(p.price)}${p.was ? `<s>${fmt(p.was)}</s>` : ""}</span>
      </label>`;
    }).join("");
    const ids = [...fbtSel];
    const tot = ids.reduce((s, id) => s + P[id].price, 0);
    const was = ids.reduce((s, id) => s + (P[id].was || P[id].price), 0);
    $("[data-fbt-count]").textContent = ids.length;
    $("[data-fbt-total]").textContent = fmt(tot);
    $("[data-fbt-was]").textContent = was > tot ? fmt(was) : "";
    $("[data-fbt-save]").textContent = fmt(was - tot);
    $("[data-fbt-add]").disabled = !ids.length;
  }
  $("[data-fbt]").addEventListener("change", e => {
    const id = e.target.dataset.fbtId; if (!id) return;
    e.target.checked ? fbtSel.add(id) : fbtSel.delete(id); renderFBT();
  });
  $("[data-fbt-add]").addEventListener("click", () => { if (!fbtSel.size) return; [...fbtSel].forEach(id => add(id, 1, true)); renderCart(); openCart(); });

  /* =================== Cart =================== */
  let cart = store.get("nv2-cart", []).filter(l => P[l.id]);
  let protect = false;
  const cartEl = $("[data-cart]"), scrim = $("[data-scrim]");
  const keyOf = (id) => P[id].vars ? `${id}:${variant[id] || "small"}` : id;

  function add(id, qty = 1, silent) {
    const key = keyOf(id);
    const l = cart.find(x => x.key === key);
    l ? (l.qty += qty) : cart.push({ key, id, qty });
    store.set("nv2-cart", cart);
    $$("[data-cart-count]").forEach(el => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
    $$(`.pcard__add[data-add="${id}"]`).forEach(b => { b.classList.add("is-done"); b.querySelector("span").textContent = UI[lang].added2; setTimeout(() => { b.classList.remove("is-done"); b.querySelector("span").textContent = UI[lang].add; }, 1600); });
    if (!silent) { renderCart(); openCart(); }
  }

  function renderCart() {
    const t = UI[lang];
    cart = cart.map(l => l.key ? l : { ...l, key: l.id });
    const count = cart.reduce((s, l) => s + l.qty, 0);
    const sub = cart.reduce((s, l) => s + P[l.id].price * l.qty, 0);
    const save = cart.reduce((s, l) => s + ((P[l.id].was || P[l.id].price) - P[l.id].price) * l.qty, 0);
    const freeShip = sub >= SHIP || cart.some(l => l.id === "b3");
    $$("[data-cart-count]").forEach(el => (el.textContent = count));

    $("[data-lines]").innerHTML = cart.map(l => {
      const p = P[l.id], v = l.key.includes(":") ? ` · ${t[l.key.split(":")[1]]}` : "";
      return `<li class="line"><img src="${p.img}" alt="">
        <div><div class="line__name">${nm(l.id)}${v}</div><div class="line__meta">${t.inStock}</div>
          <div class="qty"><button data-q="${l.key}" data-d="-1" aria-label="−">−</button><span>${l.qty}</span><button data-q="${l.key}" data-d="1" aria-label="+">+</button></div></div>
        <div class="line__r"><div class="line__p">${fmt(p.price * l.qty)}${p.was ? `<s>${fmt(p.was * l.qty)}</s>` : ""}</div>
          <button class="line__rm" data-rm="${l.key}" aria-label="${t.remove}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg></button></div></li>`;
    }).join("");
    $("[data-empty]").classList.toggle("is-on", !cart.length);

    let pct, msg;
    if (!cart.length) { pct = 0; msg = t.tShip(fmt(SHIP)); }
    else if (sub >= GIFT) { pct = 100; msg = t.tDone; }
    else if (freeShip) { pct = 80 + Math.max(0, (sub - SHIP) / (GIFT - SHIP)) * 20; msg = t.tGift(fmt(GIFT - sub)); }
    else { pct = (sub / SHIP) * 80; msg = t.tShip(fmt(SHIP - sub)); }
    $("[data-tier-fill]").style.width = Math.min(100, pct) + "%";
    $("[data-tier-msg]").innerHTML = msg;
    $('[data-tier="ship"]').classList.toggle("is-hit", !!(cart.length && freeShip));
    $('[data-tier="gift"]').classList.toggle("is-hit", sub >= GIFT);

    const inCart = new Set(cart.map(l => l.id));
    $("[data-ups-track]").innerHTML = UPS.filter(id => !inCart.has(id)).map(id => {
      const p = P[id];
      return `<div class="ucard"><div class="ucard__img"><img src="${p.img}" alt="" loading="lazy">${p.was ? `<span class="pb pb--sale">−${Math.round((1 - p.price / p.was) * 100)}%</span>` : ""}</div>
        <b>${nm(id)}</b><div class="ucard__p">${fmt(p.price)}${p.was ? `<s>${fmt(p.was)}</s>` : ""}</div>
        <button data-add="${id}">+ ${t.add}</button></div>`;
    }).join("");

    $("[data-total]").textContent = fmt(sub + (protect && cart.length ? PROT : 0));
    $("[data-save]").textContent = save ? "−" + fmt(save) : fmt(0);
  }
  function openCart() { cartEl.classList.add("is-open"); scrim.classList.add("is-on"); cartEl.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function closeCart() { cartEl.classList.remove("is-open"); scrim.classList.remove("is-on"); cartEl.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  $$("[data-ups]").forEach(b => b.addEventListener("click", () => $("[data-ups-track]").scrollBy({ left: +b.dataset.ups * 200, behavior: "smooth" })));
  $("[data-protect]").addEventListener("change", e => { protect = e.target.checked; renderCart(); });
  $$("[data-checkout]").forEach(b => b.addEventListener("click", () => toast(UI[lang].checkout)));

  /* =================== Quick view =================== */
  const qv = $("[data-qv]");
  let qvId = null, qvQty = 1;
  function openQV(id) {
    const p = P[id]; qvId = id; qvQty = 1;
    $("[data-qv-img]").src = p.img;
    $("[data-qv-name]").textContent = nm(id);
    $("[data-qv-price]").textContent = fmt(p.price);
    $("[data-qv-was]").textContent = p.was ? fmt(p.was) : "";
    $("[data-qv-badge]").style.display = p.was ? "" : "none";
    $("[data-qv-badge]").textContent = p.was ? `−${Math.round((1 - p.price / p.was) * 100)}%` : "";
    $("[data-qv-rev]").textContent = "4.9";
    $("[data-qv-desc]").textContent = lang === "en" ? p.den : p.dhu;
    $("[data-qv-qty]").textContent = 1;
    qv.classList.add("is-on"); qv.setAttribute("aria-hidden", "false");
  }
  const closeQV = () => { qv.classList.remove("is-on"); qv.setAttribute("aria-hidden", "true"); };
  $$("[data-qv-q]").forEach(b => b.addEventListener("click", () => { qvQty = Math.max(1, qvQty + +b.dataset.qvQ); $("[data-qv-qty]").textContent = qvQty; }));
  $("[data-qv-add]").addEventListener("click", () => { closeQV(); add(qvId, qvQty); });
  qv.addEventListener("click", e => { if (e.target === qv || e.target.closest("[data-qv-close]")) closeQV(); });

  /* =================== Search =================== */
  const search = $("[data-search]"), searchInput = $("[data-search-input]");
  function renderSearch(q) {
    q = (q || "").trim().toLowerCase();
    const res = $("[data-search-res]");
    if (!q) { res.innerHTML = ""; return; }
    const hits = GRID.filter(id => (P[id].hu + " " + P[id].en).toLowerCase().includes(q));
    res.innerHTML = hits.length ? hits.map(id => `<button class="sres" data-sres="${id}"><img src="${P[id].img}" alt=""><div><b>${nm(id)}</b><span>${fmt(P[id].price)}</span></div></button>`).join("") : `<p style="padding:10px;color:var(--muted)">${UI[lang].noRes}</p>`;
  }
  const openSearch = () => { search.classList.add("is-on"); search.setAttribute("aria-hidden", "false"); setTimeout(() => searchInput.focus(), 100); };
  const closeSearch = () => { search.classList.remove("is-on"); search.setAttribute("aria-hidden", "true"); };
  searchInput.addEventListener("input", () => renderSearch(searchInput.value));
  $$("[data-sq]").forEach(b => b.addEventListener("click", () => { searchInput.value = b.dataset.sq; renderSearch(b.dataset.sq); }));
  search.addEventListener("click", e => {
    if (e.target === search || e.target.closest("[data-close-search]")) return closeSearch();
    const r = e.target.closest("[data-sres]"); if (r) { closeSearch(); openQV(r.dataset.sres); }
  });

  /* =================== Popup =================== */
  const pop = $("[data-pop]");
  const closePop = () => { pop.classList.remove("is-on"); pop.setAttribute("aria-hidden", "true"); try { sessionStorage.setItem("nv2-pop", "1"); } catch (e) {} };
  let popSeen = false; try { popSeen = !!sessionStorage.getItem("nv2-pop"); } catch (e) {}
  if (!popSeen) setTimeout(() => { if (!cartEl.classList.contains("is-open") && !qv.classList.contains("is-on")) { pop.classList.add("is-on"); pop.setAttribute("aria-hidden", "false"); } }, 18000);
  pop.addEventListener("click", e => { if (e.target === pop || e.target.closest("[data-pop-close]")) closePop(); });
  $("[data-pop-form]").addEventListener("submit", e => { e.preventDefault(); closePop(); toast(UI[lang].nl); });

  /* =================== Global clicks =================== */
  const menu = $("[data-menu]");
  const toggleMenu = on => { menu.classList.toggle("is-open", on); menu.setAttribute("aria-hidden", !on); };
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-add]");
    if (a) { e.preventDefault(); add(a.dataset.add); return; }
    const w = e.target.closest("[data-wish]");
    if (w) { const id = w.dataset.wish; wish.has(id) ? wish.delete(id) : (wish.add(id), toast(UI[lang].wish)); w.classList.toggle("is-on", wish.has(id)); store.set("nv2-wish", [...wish]); $("[data-wish-count]").textContent = wish.size; return; }
    const v = e.target.closest("[data-var]");
    if (v) { const [id, val] = v.dataset.var.split(":"); variant[id] = val; v.parentElement.querySelectorAll("button").forEach(b => b.classList.toggle("is-on", b === v)); return; }
    const o = e.target.closest("[data-qv-open]");
    if (o) { openQV(o.dataset.qvOpen); return; }
    const q = e.target.closest("[data-q]");
    if (q) { const l = cart.find(x => x.key === q.dataset.q); l.qty += +q.dataset.d; if (l.qty < 1) cart = cart.filter(x => x !== l); store.set("nv2-cart", cart); renderCart(); return; }
    const rm = e.target.closest("[data-rm]");
    if (rm) { cart = cart.filter(x => x.key !== rm.dataset.rm); store.set("nv2-cart", cart); renderCart(); return; }
    if (e.target.closest("[data-open-cart]")) return openCart();
    if (e.target.closest("[data-close-cart]") || e.target === scrim) return closeCart();
    if (e.target.closest("[data-open-search]")) return openSearch();
    if (e.target.closest("[data-open-menu]")) return toggleMenu(true);
    if (e.target.closest("[data-close-menu]") || e.target === menu || (menu.classList.contains("is-open") && e.target.closest(".mmenu a"))) return toggleMenu(false);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeCart(); closeQV(); closeSearch(); closePop(); toggleMenu(false); } });
  $("[data-wish-count]").textContent = wish.size;
  $("[data-nl]").addEventListener("submit", e => { e.preventDefault(); e.target.reset(); toast(UI[lang].nl); });

  /* =================== Toast =================== */
  let tt; const tEl = $("[data-toast]");
  function toast(m) { tEl.textContent = m; tEl.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(() => tEl.classList.remove("is-on"), 2400); }

  /* =================== Scroll =================== */
  const hdr = $("[data-hdr]"), satc = $("[data-satc]"), buy = $(".buy__ctas");
  function onScroll() {
    hdr.classList.toggle("is-sc", scrollY > 10);
    const b = buy.getBoundingClientRect();
    const nearEnd = innerHeight + scrollY > document.documentElement.scrollHeight - 300;
    satc.classList.toggle("is-on", b.bottom < 0 && !nearEnd);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const count = el => { const T = +el.dataset.count, t0 = performance.now(), ring = el.closest(".ring");
    const f = now => { const k = Math.min(1, (now - t0) / 1600), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(T * e); if (ring) ring.style.setProperty("--v", T * e); if (k < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f); };
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in");
    en.target.querySelectorAll("[data-count]").forEach(count);
    io.unobserve(en.target);
  }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  $$(".rv").forEach(el => io.observe(el));

  // auto-demo the simulator once when it comes into view
  const simIO = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { setTimeout(() => animateTo(7), 500); simIO.disconnect(); } }), { threshold: .5 });
  simIO.observe($(".sim"));

  syncOffer();
  applyLang(lang, false);
})();
