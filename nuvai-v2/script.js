(() => {
  "use strict";
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  /* ================= i18n (HU captured from HTML) ================= */
  const EN = {
    top1: "Ships within 1–3 business days", top2: "Free shipping over 20,000 Ft", top3: "24/7 customer support",
    nav1: "The kit", nav2: "Method", nav3: "Results", nav4: "Shop", nav5: "FAQ", cartBtn: "Cart",
    heroLabel: "10,000+ happy customers in 2025",
    h1a: "Clear", h1b: "skin.", h1c: "No clinic needed.",
    heroLead: "Professional-grade skin tag removal at home – safe, painless and with scar-free results.",
    heroCta: "Order now – 15,900 Ft", heroCta2: "How does it work?",
    heroSale: "−50% today", hbStatL: "Clinical result", hbStat: "fully removed their skin tag within 7 days",
    hbRev: "“Gone in five days. No pain, no scar.”",
    chip1: "Painless", chip2: "Scar-free", chip3: "Sterile", chip4: "1–8 mm",
    n1: "happy customers", n2: "days to fall off", n3: "treatments per kit", n4: "customer support",
    whyIdx: "Why NUVAI", whyTitle: "The <em>precision</em> of a clinic, the <em>comfort</em> of home.",
    ta1: "Use at home", ta2: "Two minutes. In your own bathroom.",
    tb1: "Clinically tested", tb2: "No cutting, burning or freezing – the skin tag falls off naturally.",
    tc1: "Price comparison", tc2: "Clinic laser", tc3: "Up to 40 treatments with a single kit.",
    td1: "Painless", td2: "At most a light pressure when applying.",
    v1: "Safe", v2: "Painless", v3: "Visible results", v4: "Clinically tested", v5: "Budget-friendly", vOthers: "Others",
    bestseller: "#1 Bestseller", cfgIdx: "The kit",
    pTitle: "At-Home Skin Tag <em>Removal Kit</em>",
    pSub: "One device, up to 40 treatments. For 1–8 mm skin tags – sterile and simple.",
    ratingTxt: "10,000+ happy customers", choose: "Choose your pack",
    b1: "Kit", b2: "Kit + refill", b3: "Complete treatment", popular: "Most popular", bestValue: "Best value",
    note_kit: "1 removal device with 2 adapter heads · starter pack",
    note_b2: "Kit + 20 hypoallergenic micro-bands · save 990 Ft",
    note_b3: "Kit + 40 micro-bands + 72 botanical patches · free shipping",
    addToCart: "Add to cart",
    pk1: "Ships in 1–3 business days", pk2: "Encrypted checkout", pk3: "24/7 customer support",
    inBox: "What’s in the box?",
    inBoxP: "1 NUVAI removal device, 2 adapter heads (1–4 mm and 5–8 mm), micro-bands, antiseptic wipes and a detailed step-by-step guide.",
    mIdx: "The method", mTitle: "Three steps. <em>Zero scars.</em>",
    s1t: "Position", s1p: "Clean the area and place the NUVAI device over the skin tag. Two adapter heads cover every size from 1 to 8 mm.",
    s2t: "Press", s2p: "One click applies a hypoallergenic micro-band that cuts off the skin tag’s blood supply.",
    s3t: "Let it be", s3p: "Within 3–14 days the skin tag falls off by itself – no pain, no bleeding, no scar.",
    mCta: "Start now",
    prIdx: "Results", prTitle: "We don’t say it. <em>The results prove it.</em>",
    st1: "fully removed their skin tag within 7 days",
    st2: "saw a noticeable reduction in size and irritation within 72 hours",
    st3: "reported smoother, clearer skin with no pain, scarring or recurrence",
    shIdx: "Shop", shTitle: "The complete <em>NUVAI routine</em>",
    tabAll: "All", tabSkin: "Skin", tabEar: "Ear & nose",
    rvIdx: "Reviews", rvTitle: "10,000+ customers. <em>One shared experience.</em>",
    r1: "“A skin tag on my neck bothered me for years. It fell off in five days – no pain and no scar. I wish I had found this sooner!”",
    r2: "“I was afraid it would be complicated, but with the guide it took two minutes. The price is a fraction of a dermatologist visit.”",
    r3: "“Fast shipping, premium packaging. I removed three tags from under my arm and all fell off within a week.”",
    r4: "“Customer service answered my question at 10 pm. Professional product, professional team.”",
    verified: "Verified purchase",
    g1: "24/7 customer support", g1p: "We’re always by your side – reach us any time.",
    g2: "Secure payment", g2p: "Every transaction is encrypted – total peace of mind.",
    g3: "10,000+ customers", g3p: "Over 10,000 people chose us in 2025.",
    faqIdx: "FAQ", faqTitle: "Got a <em>question?</em>", faqLead: "Write to postmaster@nuvai.hu – we reply within 24 hours.",
    q1: "Does the treatment hurt?", a1: "No. You’ll feel at most a light pressure when the micro-band is applied. The skin tag then dries out and falls off gradually, without pain.",
    q2: "How long until the skin tag falls off?", a2: "Usually 3–14 days, depending on size. For 98% of our customers it was completely gone within 7 days.",
    q3: "What size skin tags is it for?", a3: "Skin tags between 1 and 8 mm. The kit includes two adapter heads: 1–4 mm and 5–8 mm.",
    q4: "Will it leave a scar?", a4: "The method works without cutting or burning, so 93% of our customers reported smooth, scar-free skin.",
    q5: "How fast will my order arrive?", a5: "Every order ships within 1–3 business days, and GLS delivers most parcels within 2–3 days.",
    finK: "Join our community", finTitle: "Start today. <em>Glow tomorrow.</em>",
    finP: "Subscribe and get 10% off your first order, plus exclusive skincare tips.", subscribe: "Subscribe",
    ftTag: "Professional skincare at home – safe and painless.",
    ftShop: "Shop", ftL1: "Removal kit", ftL2: "Refills", ftL3: "Ear & nose cleaners",
    ftHelp: "Help", ftL4: "Shipping information", ftL5: "Contact",
    ftLegal: "Legal", ftL7: "Privacy (GDPR)", ftL8: "Terms of service", ftL9: "Withdrawal statement",
    copy: "© 2026 NUVAI Hungary. All rights reserved.",
    dockName: "NUVAI kit", dockCta: "Buy now",
    cartK: "Your cart", items: "item(s)", gShip: "Free shipping", gGift: "Free e-book",
    empty: "Your cart is empty.", startShop: "Start with the kit",
    upTitle: "Complete your routine", upSub: "Frequently bought together",
    protect: "Package protection", protectS: "Instant replacement if lost/damaged",
    youSave: "You save", subtotal: "Total", checkout: "Continue to checkout",
    secure: "Encrypted checkout · Apple Pay · Google Pay · Visa",
  };
  const EN_PH = { emailPh: "Email address" };
  const UI = {
    hu: {
      goalShip: n => `Még <b>${n}</b> az <b>ingyenes szállításig</b>`,
      goalGift: n => `Szállítás ingyenes! Még <b>${n}</b> és jár az <b>ajándék e-könyv</b>`,
      goalDone: "🎉 Ingyenes szállítás + ajándék e-könyv – minden a tiéd!",
      added: n => `${n} – a kosárba került`, add: "Kosárba", addS: "+ Hozzáad",
      sale: "−50%", best: "Bestseller", gift: "Ajándék",
      remove: "Törlés", nl: "Köszönjük! A kuponkódot elküldtük.", checkout: "Prototípus – itt indulna a Shopify fizetés.",
      skin: "Bőrápolás", ear: "Fül & orr",
      notes: { kit: "1 db eltávolító eszköz 2 adapterfejjel · alapcsomag", b2: "Készlet + 20 db hipoallergén mikrogyűrű · 990 Ft megtakarítás", b3: "Készlet + 40 mikrogyűrű + 72 növényi tapasz · ingyenes szállítás" },
    },
    en: {
      goalShip: n => `<b>${n}</b> away from <b>free shipping</b>`,
      goalGift: n => `Free shipping unlocked! <b>${n}</b> more for a <b>free e-book</b>`,
      goalDone: "🎉 Free shipping + free e-book – all unlocked!",
      added: n => `${n} – added to cart`, add: "Add", addS: "+ Add",
      sale: "−50%", best: "Bestseller", gift: "Gift",
      remove: "Remove", nl: "Thank you! Your code is on its way.", checkout: "Prototype – Shopify checkout would start here.",
      skin: "Skincare", ear: "Ear & nose",
      notes: { kit: EN.note_kit, b2: EN.note_b2, b3: EN.note_b3 },
    },
  };

  const HU = {}, HU_PH = {};
  $$("[data-i18n]").forEach(el => (HU[el.dataset.i18n] = el.innerHTML));
  $$("[data-i18n-ph]").forEach(el => (HU_PH[el.dataset.i18nPh] = el.placeholder));

  let lang = "hu";
  try { lang = localStorage.getItem("nuvai2-lang") || "hu"; } catch (e) {}
  if (!["hu", "en"].includes(lang)) lang = "hu";

  function applyLang(l, animate) {
    const run = () => {
      lang = l;
      const d = l === "en" ? EN : HU, ph = l === "en" ? EN_PH : HU_PH;
      $$("[data-i18n]").forEach(el => { const v = d[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
      $$("[data-i18n-ph]").forEach(el => (el.placeholder = ph[el.dataset.i18nPh]));
      document.documentElement.lang = l;
      document.title = l === "en" ? "NUVAI™ — At-home skin tag removal | NUVAI Hungary" : "NUVAI™ — Bőrkinövés eltávolítás otthon | NUVAI Magyarország";
      const sw = $(".lang"); sw.dataset.active = l;
      sw.querySelectorAll("button").forEach(b => { const on = b.dataset.lang === l; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on); });
      try { localStorage.setItem("nuvai2-lang", l); } catch (e) {}
      updatePackNote(); renderRail(); renderCart();
    };
    if (!animate) return run();
    document.body.classList.add("is-switching");
    setTimeout(() => { run(); document.body.classList.remove("is-switching"); }, 200);
  }
  $$(".lang button").forEach(b => b.addEventListener("click", () => b.dataset.lang !== lang && applyLang(b.dataset.lang, true)));

  /* ================= Data ================= */
  const P = {
    kit:     { img: "images/kit.webp", price: 15900, was: 31800, cat: "skin", badge: "best", hu: "Otthoni Bőrkinövés Eltávolító Készlet", en: "At-Home Skin Tag Removal Kit" },
    b2:      { img: "images/kit.webp", price: 18900, was: 35790, cat: "skin", hu: "Készlet + 20 db utántöltő", en: "Kit + 20 refill bands" },
    b3:      { img: "images/kit-lifestyle.webp", price: 23900, was: 43780, cat: "skin", hu: "Teljes kúra csomag", en: "Complete treatment bundle" },
    ear:     { img: "images/ear-cleaner.webp", price: 19900, was: 39900, cat: "ear", badge: "sale", hu: "Elektromos Fülzsír Eltávolító Készlet", en: "Electric Ear Wax Removal Kit" },
    nose:    { img: "images/nose-cleaner.webp", price: 19900, was: 39800, cat: "ear", badge: "sale", hu: "Kétfunkciós Elektromos Orrtisztító", en: "Dual-Function Electric Nose Cleaner" },
    ring20:  { img: "images/refill-20.webp", price: 3990, cat: "skin", hu: "Hipoallergén Mikrogyűrűk (20 db)", en: "Hypoallergenic Micro-Bands (20 pcs)" },
    ring40:  { img: "images/refill-40.webp", price: 4990, cat: "skin", hu: "Hipoallergén Mikrogyűrűk (40 db)", en: "Hypoallergenic Micro-Bands (40 pcs)" },
    patch72: { img: "images/patch-72.webp", price: 6990, cat: "skin", hu: "Növényi Kivonatos Tapasz (72 db)", en: "Botanical Skin Tag Patches (72 pcs)" },
    prot28:  { img: "images/protect-28.webp", price: 1990, cat: "skin", hu: "Védőtapasz dörzsölődés ellen (28 db)", en: "Anti-Friction Protective Patches (28)" },
    ebook:   { img: "images/ebook.webp", price: 990, was: 2990, cat: "skin", hu: "30 nap a tökéletes bőrért – e-könyv", en: "30 Days to Perfect Skin – e-book" },
  };
  const RAIL = ["kit", "ear", "nose", "ring40", "patch72", "ring20", "prot28", "ebook"];
  const UPS = ["ring40", "patch72", "prot28", "ebook", "ring20", "nose", "ear"];
  const SHIP = 20000, GIFT = 25000, PROTECT = 990;
  const fmt = n => n.toLocaleString("hu-HU").replace(/ /g, " ") + " Ft";
  const nm = id => P[id][lang];

  /* ================= Rail ================= */
  const rail = $("[data-rail-track]");
  let filter = "all";
  function renderRail() {
    const t = UI[lang];
    rail.innerHTML = RAIL.map(id => {
      const p = P[id];
      const badge = p.badge ? `<span class="pc__badge ${p.badge === "sale" ? "pc__badge--sale" : ""}">${p.badge === "sale" ? t.sale : t.best}</span>` : "";
      return `<article class="pc ${filter !== "all" && p.cat !== filter ? "is-hidden" : ""}" data-cat="${p.cat}">
        <div class="pc__media">${badge}<img src="${p.img}" alt="${nm(id)}" loading="lazy" draggable="false"></div>
        <div class="pc__body">
          <span class="pc__cat mono">${t[p.cat]}</span>
          <h3 class="pc__name">${nm(id)}</h3>
          <div class="pc__foot">
            <div class="pc__price"><b>${fmt(p.price)}</b>${p.was ? `<s>${fmt(p.was)}</s>` : ""}</div>
            <button class="add" data-add="${id}" aria-label="${t.add}"><span class="add__p">+</span><span class="add__t">${t.add}</span></button>
          </div>
        </div>
      </article>`;
    }).join("");
  }
  $$(".chips button").forEach(c => c.addEventListener("click", () => {
    $$(".chips button").forEach(x => x.classList.toggle("is-on", x === c));
    filter = c.dataset.filter;
    rail.querySelectorAll(".pc").forEach(el => el.classList.toggle("is-hidden", filter !== "all" && el.dataset.cat !== filter));
    rail.scrollTo({ left: 0, behavior: "smooth" });
  }));
  $$("[data-rail]").forEach(b => b.addEventListener("click", () => rail.scrollBy({ left: +b.dataset.rail * 316, behavior: "smooth" })));
  // drag to scroll (desktop)
  let down = false, sx = 0, sl = 0, moved = false;
  rail.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
  addEventListener("pointermove", e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; rail.classList.add("is-drag"); } rail.scrollLeft = sl - dx; });
  addEventListener("pointerup", () => { down = false; rail.classList.remove("is-drag"); });
  rail.addEventListener("click", e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);

  /* ================= Cart ================= */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("nuvai2-cart") || "[]").filter(l => P[l.id]); } catch (e) {}
  let protect = false;
  const drawer = $("[data-cart]"), scrim = $("[data-scrim]");
  const save = () => { try { localStorage.setItem("nuvai2-cart", JSON.stringify(cart)); } catch (e) {} };

  function add(id) {
    const l = cart.find(x => x.id === id);
    l ? l.qty++ : cart.push({ id, qty: 1 });
    save(); renderCart(); openCart();
    $$("[data-cart-count]").forEach(el => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
  }

  function renderCart() {
    const t = UI[lang];
    const count = cart.reduce((s, l) => s + l.qty, 0);
    const sub = cart.reduce((s, l) => s + P[l.id].price * l.qty, 0);
    const saved = cart.reduce((s, l) => s + ((P[l.id].was || P[l.id].price) - P[l.id].price) * l.qty, 0);
    const freeShip = sub >= SHIP || cart.some(l => l.id === "b3");
    $$("[data-cart-count]").forEach(el => (el.textContent = count));

    $("[data-cart-items]").innerHTML = cart.map(l => {
      const p = P[l.id];
      return `<li class="it"><img src="${p.img}" alt="">
        <div><div class="it__name">${nm(l.id)}</div><div class="it__unit">${fmt(p.price)}</div>
          <div class="stepper"><button data-q="${l.id}" data-d="-1" aria-label="−">−</button><span>${l.qty}</span><button data-q="${l.id}" data-d="1" aria-label="+">+</button></div></div>
        <div class="it__right"><div class="it__price">${fmt(p.price * l.qty)}${p.was ? `<s>${fmt(p.was * l.qty)}</s>` : ""}</div>
          <button class="it__rm" data-rm="${l.id}">${t.remove}</button></div></li>`;
    }).join("");
    $("[data-cart-empty]").classList.toggle("is-on", !cart.length);

    // goal tracker: ship at 80% of track (20k), gift at 100% (25k)
    let pct, msg;
    if (!cart.length) { pct = 0; msg = t.goalShip(fmt(SHIP)); }
    else if (sub >= GIFT) { pct = 100; msg = t.goalDone; }
    else if (freeShip) { pct = 80 + Math.max(0, (sub - SHIP) / (GIFT - SHIP)) * 20; msg = t.goalGift(fmt(GIFT - sub)); }
    else { pct = (sub / SHIP) * 80; msg = t.goalShip(fmt(SHIP - sub)); }
    $("[data-goal-fill]").style.width = Math.min(100, pct) + "%";
    $("[data-goal-msg]").innerHTML = msg;
    $('[data-mark="ship"]').classList.toggle("is-hit", !!(cart.length && freeShip));
    $('[data-mark="gift"]').classList.toggle("is-hit", sub >= GIFT);

    const inCart = new Set(cart.map(l => l.id));
    $("[data-upsells]").innerHTML = UPS.filter(id => !inCart.has(id)).slice(0, 4).map(id => {
      const p = P[id];
      return `<div class="xs"><img src="${p.img}" alt="" loading="lazy">
        <div><div class="xs__name">${nm(id)}</div><div class="xs__price">${fmt(p.price)}${p.was ? `<s>${fmt(p.was)}</s>` : ""}</div></div>
        <button class="xs__add" data-add="${id}">${t.addS}</button></div>`;
    }).join("");

    $("[data-subtotal]").textContent = fmt(sub + (protect && cart.length ? PROTECT : 0));
    $("[data-savings]").textContent = saved ? "−" + fmt(saved) : fmt(0);
  }

  function openCart() { drawer.classList.add("is-open"); scrim.classList.add("is-on"); drawer.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function closeCart() { drawer.classList.remove("is-open"); scrim.classList.remove("is-on"); drawer.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }

  document.addEventListener("click", e => {
    const a = e.target.closest("[data-add]");
    if (a) { e.preventDefault(); add(a.dataset.add); return; }
    const q = e.target.closest("[data-q]");
    if (q) { const l = cart.find(x => x.id === q.dataset.q); l.qty += +q.dataset.d; if (l.qty < 1) cart = cart.filter(x => x !== l); save(); renderCart(); return; }
    const rm = e.target.closest("[data-rm]");
    if (rm) { cart = cart.filter(x => x.id !== rm.dataset.rm); save(); renderCart(); return; }
    if (e.target.closest("[data-open-cart]")) return openCart();
    if (e.target.closest("[data-close-cart]") || e.target === scrim) closeCart();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeCart(); toggleMenu(false); } });
  $("[data-protect]").addEventListener("change", e => { protect = e.target.checked; renderCart(); });
  $("[data-checkout]").addEventListener("click", () => toast(UI[lang].checkout));

  /* ================= Pack picker ================= */
  function updatePackNote() {
    const v = $(".pack input:checked").value;
    $("[data-pack-note]").textContent = UI[lang].notes[v];
    $("[data-pack-price]").textContent = fmt(P[v].price);
  }
  $$(".pack input").forEach(inp => inp.addEventListener("change", () => {
    $$(".pack").forEach(p => p.classList.toggle("is-on", p.contains(inp)));
    updatePackNote();
  }));
  $("[data-add-pack]").addEventListener("click", () => add($(".pack input:checked").value));
  const stage = $("[data-stage]");
  $$("[data-thumb]").forEach(t => t.addEventListener("click", () => {
    $$("[data-thumb]").forEach(x => x.classList.toggle("is-active", x === t));
    stage.style.opacity = 0; setTimeout(() => { stage.src = t.dataset.thumb; stage.style.opacity = 1; }, 220);
  }));

  /* ================= Menu ================= */
  const menu = $("[data-menu]");
  function toggleMenu(on) { menu.classList.toggle("is-open", on); document.body.classList.toggle("menu-open", on); menu.setAttribute("aria-hidden", !on); }
  $("[data-open-menu]").addEventListener("click", () => toggleMenu(!menu.classList.contains("is-open")));
  menu.addEventListener("click", e => { if (e.target.closest("a")) toggleMenu(false); });

  /* ================= Newsletter / toast ================= */
  $("[data-nl]").addEventListener("submit", e => { e.preventDefault(); $("[data-nl-msg]").textContent = UI[lang].nl; e.target.reset(); });
  let tt; const tEl = $("[data-toast]");
  function toast(m) { tEl.textContent = m; tEl.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(() => tEl.classList.remove("is-on"), 2400); }

  /* ================= Magnetic buttons ================= */
  if (matchMedia("(hover:hover)").matches) {
    $$(".magnetic").forEach(b => {
      b.addEventListener("mousemove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
      b.addEventListener("mouseleave", () => (b.style.transform = ""));
    });
  }

  /* ================= Counters ================= */
  function count(el) {
    const target = +el.dataset.count, t0 = performance.now(), dur = 1600;
    const step = now => { const k = Math.min(1, (now - t0) / dur); el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ================= Scroll ================= */
  const navWrap = $(".nav-wrap"), bar = $("[data-progress]"), dock = $("[data-dock]"), product = $("#product"), hero = $(".hero");
  let lastY = 0;
  function onScroll() {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    navWrap.classList.toggle("is-scrolled", y > 120 && y > lastY && !drawer.classList.contains("is-open"));
    lastY = y;
    const pr = product.getBoundingClientRect();
    dock.classList.toggle("is-on", hero.getBoundingClientRect().bottom < 0 && !(pr.top < innerHeight && pr.bottom > 0));
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in");
    en.target.querySelectorAll("[data-count]").forEach(count);
    io.unobserve(en.target);
  }), { threshold: .15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));
  $$(".hb--stat [data-count]").forEach(el => setTimeout(() => count(el), 500));

  // Method scrollytelling
  const steps = $$(".mstep"), num = $("[data-step-num]");
  const so = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    steps.forEach(s => s.classList.toggle("is-active", s === en.target));
    if (num.textContent !== en.target.dataset.step) {
      num.style.transform = "translateY(-8px)"; num.style.opacity = 0;
      setTimeout(() => { num.textContent = en.target.dataset.step; num.style.transform = ""; num.style.opacity = 1; }, 200);
    }
  }), { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach(s => so.observe(s));

  applyLang(lang, false);
})();
