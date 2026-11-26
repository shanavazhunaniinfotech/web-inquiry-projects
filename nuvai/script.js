(() => {
  "use strict";

  /* ================= i18n ================= */
  // Hungarian text lives in the HTML; it is captured on load. English below.
  const EN = {
    ann1: "🚚 Orders ship within 1–3 business days – GLS home delivery",
    ann2: "✦ Free shipping on orders over 20,000 Ft",
    ann3: "🔒 Encrypted, secure checkout · Apple Pay · Google Pay",
    nav1: "Skin tags", nav2: "Ear & nose care", nav3: "How it works", nav4: "Results", nav5: "FAQ", nav6: "Contact",
    heroEyebrow: "Hungary’s #1 at-home skin tag remover",
    heroTitle: "Clear skin.<br><em>No clinic needed.</em>",
    heroLead: "Professional-grade skin tag removal in the comfort of your home – safe, painless and with scar-free results.",
    tick1: "Painless", tick2: "Scar-free results", tick3: "In as little as 7 days",
    heroCta: "Get the kit", save50: "−50%", heroProof: "happy customers in 2025",
    floatA: "gone within 7 days", floatB: "Dermatologically tested", floatC: "Scar-free",
    mq1: "Clinically tested", mq2: "10,000+ happy customers", mq3: "24/7 customer support", mq4: "GLS delivery in 2–3 days", mq5: "Secure payment",
    catKicker: "Collections", catTitle: "At-home care, <em>clinical precision</em>",
    cat1count: "5 products", cat1: "Skin tag removal", cat1p: "Kit, refill micro-bands and botanical patches.",
    cat2count: "6 products", cat2: "Ear & nose cleaners", cat2p: "Electric cleaners and accessories for everyday hygiene.",
    shopNow: "Shop now →",
    bestseller: "Bestseller", stockLow: "🔥 Low stock",
    pTitle: "At-Home Skin Tag Removal Kit",
    pSub: "One device, up to 40 treatments. For 1–8 mm skin tags – sterile and simple.",
    b1: "1× Kit", b1s: "Starter pack",
    popular: "Most popular", b2: "Kit + 20 refill bands", b2s: "You save 990 Ft",
    bestValue: "Best value", b3: "Complete treatment", b3s: "Kit + 40 bands + 72 patches · free shipping",
    addToCart: "Add to cart",
    as1: "Ships in 1–3 business days", as2: "Encrypted checkout", as3: "24/7 customer support",
    inBox: "What’s in the box?",
    inBoxP: "1 NUVAI removal device, 2 adapter heads (1–4 mm and 5–8 mm), micro-bands, antiseptic wipes and a detailed step-by-step guide.",
    howKicker: "How it works", howTitle: "Three steps to <em>clear skin</em>",
    s1t: "Position", s1p: "Clean the area and place the NUVAI device over the skin tag.",
    s2t: "Press", s2p: "One click applies the micro-band, which cuts off the blood supply.",
    s3t: "Let it be", s3p: "Within 3–14 days the skin tag falls off naturally – no scar, no pain.",
    rq: "“We don’t say it – the results prove it.”",
    resKicker: "Proven results", resTitle: "Real results, <em>from real people</em>",
    st1: "fully removed their skin tag within 7 days",
    st2: "saw a noticeable reduction in size and irritation within 72 hours",
    st3: "reported smoother, clearer skin with no pain, scarring or recurrence",
    resCta: "Try it now",
    cmpKicker: "Comparison", cmpTitle: "Why NUVAI™ is <em>the best choice</em>",
    cmpLaser: "Clinic laser", cmpOthers: "Others",
    c1: "Safe", c2: "Painless", c3: "Visible results", c4: "Clinically tested", c5: "Use at home", c6: "Budget-friendly",
    cmpCta: "Shop now",
    bsKicker: "Bestsellers", bsTitle: "Complete <em>at-home hygiene</em>",
    tabAll: "All", tabSkin: "Skin", tabEar: "Ear & nose",
    revKicker: "Customer reviews", revTitle: "10,000+ customers <em>already love it</em>",
    r1: "“A skin tag on my neck bothered me for years. It fell off in five days – no pain and no scar. I wish I had found this sooner!”",
    r2: "“I was afraid it would be complicated, but with the guide it took two minutes. The price is a fraction of a dermatologist visit.”",
    r3: "“Fast shipping, premium packaging. I removed three tags from under my arm and all fell off within a week.”",
    r4: "“Customer service answered my question at 10 pm. Professional product, professional team.”",
    verified: "Verified purchase",
    g1: "24/7 customer support", g1p: "We’re always by your side – reach us any time you have a question.",
    g2: "Secure payment", g2p: "Total peace of mind at checkout – every transaction is encrypted.",
    g3: "10,000+ happy customers", g3p: "Over 10,000 people joined us in 2025 – and the number keeps growing.",
    faqKicker: "FAQ", faqTitle: "Frequently asked <em>questions</em>",
    faqLead: "Can’t find your answer? Write to us – we reply within 24 hours.", faqCta: "Ask us",
    q1: "Does the treatment hurt?", a1: "No. You’ll feel at most a light pressure when the micro-band is applied. The skin tag then dries out and falls off gradually, without pain.",
    q2: "How long until the skin tag falls off?", a2: "Usually 3–14 days, depending on size. For 98% of our customers it was completely gone within 7 days.",
    q3: "What size skin tags is it for?", a3: "Skin tags between 1 and 8 mm. The kit includes two adapter heads: 1–4 mm and 5–8 mm.",
    q4: "Will it leave a scar?", a4: "The method works without cutting or burning, so 93% of our customers reported smooth, scar-free skin.",
    q5: "How fast will my order arrive?", a5: "Every order ships within 1–3 business days, and GLS delivers most parcels within 2–3 days.",
    nlKicker: "Join our community", nlTitle: "Get <em>10% off</em> your first order",
    nlP: "Be the first to hear about exclusive skincare tips and new products.", subscribe: "Subscribe",
    ftTag: "Professional skincare at home – safe and painless.",
    ftShop: "Shop", ftL1: "Skin tag removal kit", ftL2: "Refills", ftL3: "Ear & nose cleaners",
    ftHelp: "Useful links", ftL4: "Shipping information", ftL5: "Contact", ftL6: "Our mission",
    ftLegal: "Legal", ftL7: "Privacy policy (GDPR)", ftL8: "Terms of service", ftL9: "Withdrawal statement",
    copy: "© 2026 NUVAI Hungary. All rights reserved.",
    stickyName: "NUVAI kit", stickyCta: "Buy now",
    cartTitle: "Your cart", items: "item(s)",
    empty: "Your cart is empty.", startShop: "Start with the kit",
    upTitle: "Perfect add-ons", upSub: "Frequently bought together",
    protect: "Package protection", protectS: "Instant replacement if lost or damaged",
    subtotal: "Subtotal", youSave: "You save", checkout: "Secure checkout",
  };
  const EN_PH = { emailPh: "Email address" };

  const UI = {
    hu: {
      shipLeft: n => `Még <b>${n}</b> és a szállítás <b>ingyenes</b>!`,
      shipDone: "🎉 Gratulálunk! A szállításod <b>ingyenes</b>.",
      added: n => `✓ ${n} a kosárba került`,
      quick: "Gyors kosárba", add: "Kosárba", sale: "Akció", best: "Bestseller",
      remove: "Eltávolítás", nl: "Köszönjük! A kuponkódot elküldtük e-mailben.",
      checkout: "Prototípus – itt indulna a Shopify fizetés.",
    },
    en: {
      shipLeft: n => `You’re <b>${n}</b> away from <b>free shipping</b>!`,
      shipDone: "🎉 Congrats! You’ve unlocked <b>free shipping</b>.",
      added: n => `✓ ${n} added to cart`,
      quick: "Quick add", add: "Add", sale: "Sale", best: "Bestseller",
      remove: "Remove", nl: "Thank you! Your code is on its way.",
      checkout: "Prototype – Shopify checkout would start here.",
    },
  };

  const HU = {}, HU_PH = {};
  document.querySelectorAll("[data-i18n]").forEach(el => { HU[el.dataset.i18n] = el.innerHTML; });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => { HU_PH[el.dataset.i18nPh] = el.placeholder; });

  let lang = "hu";
  try { lang = localStorage.getItem("nuvai-lang") || "hu"; } catch (e) {}
  if (!["hu", "en"].includes(lang)) lang = "hu";

  function applyLang(l, animate) {
    const run = () => {
      lang = l;
      const dict = l === "en" ? EN : HU;
      const ph = l === "en" ? EN_PH : HU_PH;
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const v = dict[el.dataset.i18n];
        if (v != null) el.innerHTML = v;
      });
      document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = ph[el.dataset.i18nPh]; });
      document.documentElement.lang = l;
      document.title = l === "en"
        ? "NUVAI™ — At-home skin tag removal | NUVAI Hungary"
        : "NUVAI™ — Bőrkinövés eltávolítás otthon | NUVAI Magyarország";
      const sw = document.querySelector(".lang");
      sw.dataset.active = l;
      sw.querySelectorAll(".lang__btn").forEach(b => {
        const on = b.dataset.lang === l;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on);
      });
      try { localStorage.setItem("nuvai-lang", l); } catch (e) {}
      renderGrid(); renderCart();
    };
    if (!animate) return run();
    document.body.classList.add("is-switching");
    setTimeout(() => { run(); document.body.classList.remove("is-switching"); }, 200);
  }
  document.querySelectorAll(".lang__btn").forEach(b =>
    b.addEventListener("click", () => b.dataset.lang !== lang && applyLang(b.dataset.lang, true)));

  /* ================= Products ================= */
  const P = {
    kit:     { img: "images/kit.webp",          price: 15900, was: 31800, cat: "skin", badge: "best", hu: "Otthoni Bőrkinövés Eltávolító Készlet", en: "At-Home Skin Tag Removal Kit" },
    b2:      { img: "images/kit.webp",          price: 18900, was: 35790, cat: "skin", hu: "Készlet + 20 db utántöltő", en: "Kit + 20 refill bands" },
    b3:      { img: "images/kit-lifestyle.webp",price: 23900, was: 43780, cat: "skin", hu: "Teljes kúra csomag", en: "Complete treatment bundle" },
    ear:     { img: "images/ear-cleaner.webp",  price: 19900, was: 39900, cat: "ear",  badge: "sale", hu: "Elektromos Fülzsír Eltávolító Készlet", en: "Electric Ear Wax Removal Kit" },
    nose:    { img: "images/nose-cleaner.webp", price: 19900, was: 39800, cat: "ear",  badge: "sale", hu: "Kétfunkciós Elektromos Orrtisztító", en: "Dual-Function Electric Nose Cleaner" },
    ring20:  { img: "images/refill-20.webp",    price: 3990,  cat: "skin", hu: "Hipoallergén Mikrogyűrűk (20 db)", en: "Hypoallergenic Micro-Bands (20 pcs)" },
    ring40:  { img: "images/refill-40.webp",    price: 4990,  cat: "skin", hu: "Hipoallergén Mikrogyűrűk (40 db)", en: "Hypoallergenic Micro-Bands (40 pcs)" },
    patch72: { img: "images/patch-72.webp",     price: 6990,  cat: "skin", hu: "Növényi Kivonatos Tapasz (72 db)", en: "Botanical Skin Tag Patches (72 pcs)" },
    prot28:  { img: "images/protect-28.webp",   price: 1990,  cat: "skin", hu: "Védőtapasz dörzsölődés ellen (28 db)", en: "Anti-Friction Protective Patches (28)" },
    ebook:   { img: "images/ebook.webp",        price: 990,   was: 2990, cat: "skin", hu: "30 nap a tökéletes bőrért – e-könyv", en: "30 Days to Perfect Skin – e-book" },
  };
  const GRID = ["ear", "nose", "ring40", "patch72", "ring20", "prot28", "ebook", "kit"];
  const UPSELLS = ["ring40", "patch72", "prot28", "ebook", "ring20", "ear", "nose"];
  const FREE_SHIP = 20000, PROTECT = 990;

  const fmt = n => n.toLocaleString("hu-HU").replace(/ /g, " ") + " Ft";
  const name = id => P[id][lang];
  const plus = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M12 5v14M5 12h14"/></svg>';

  /* ================= Product grid ================= */
  const gridEl = document.querySelector("[data-product-grid]");
  let filter = "all";
  function renderGrid() {
    const t = UI[lang];
    gridEl.innerHTML = GRID.map(id => {
      const p = P[id];
      const badge = p.badge ? `<span class="card__badge ${p.badge === "sale" ? "card__badge--sale" : ""}">${p.badge === "sale" ? "−50% " + t.sale : t.best}</span>` : "";
      return `<article class="card ${filter !== "all" && p.cat !== filter ? "is-hidden" : ""}">
        <div class="card__media">${badge}<img src="${p.img}" alt="${name(id)}" loading="lazy">
          <button class="btn btn--primary btn--sm btn--block card__quick" data-add="${id}">${plus}${t.quick}</button>
        </div>
        <div class="card__body">
          <span class="card__stars">★★★★★</span>
          <h3 class="card__name">${name(id)}</h3>
          <div class="card__price"><strong>${fmt(p.price)}</strong>${p.was ? `<s>${fmt(p.was)}</s>` : ""}</div>
          <button class="btn btn--primary btn--sm card__add-m" data-add="${id}">${plus}${t.add}</button>
        </div>
      </article>`;
    }).join("");
  }
  document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.toggle("is-active", x === tab));
    filter = tab.dataset.filter;
    gridEl.querySelectorAll(".card").forEach((c, i) => c.classList.toggle("is-hidden", filter !== "all" && P[GRID[i]].cat !== filter));
  }));

  /* ================= Cart ================= */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("nuvai-cart") || "[]").filter(l => P[l.id]); } catch (e) { cart = []; }
  let protect = false;
  const $ = s => document.querySelector(s);
  const cartEl = $("[data-cart]"), overlay = $("[data-overlay]");

  function save() { try { localStorage.setItem("nuvai-cart", JSON.stringify(cart)); } catch (e) {} }

  function add(id, qty = 1) {
    const line = cart.find(l => l.id === id);
    line ? (line.qty += qty) : cart.push({ id, qty });
    save(); renderCart(); openCart();
    document.querySelectorAll("[data-cart-count]").forEach(el => {
      el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
    });
  }

  function renderCart() {
    const t = UI[lang];
    const count = cart.reduce((s, l) => s + l.qty, 0);
    const sub = cart.reduce((s, l) => s + P[l.id].price * l.qty, 0);
    const saved = cart.reduce((s, l) => s + ((P[l.id].was || P[l.id].price) - P[l.id].price) * l.qty, 0);
    const hasB3 = cart.some(l => l.id === "b3");

    document.querySelectorAll("[data-cart-count]").forEach(el => (el.textContent = count));
    $("[data-cart-items]").innerHTML = cart.map(l => {
      const p = P[l.id];
      return `<li class="line">
        <img src="${p.img}" alt="">
        <div>
          <div class="line__name">${name(l.id)}</div>
          <div class="line__meta">${fmt(p.price)}</div>
          <div class="qty"><button data-q="${l.id}" data-d="-1" aria-label="−">−</button><span>${l.qty}</span><button data-q="${l.id}" data-d="1" aria-label="+">+</button></div>
        </div>
        <div class="line__right">
          <div class="line__price">${fmt(p.price * l.qty)}${p.was ? `<s>${fmt(p.was * l.qty)}</s>` : ""}</div>
          <button class="line__rm" data-rm="${l.id}">${t.remove}</button>
        </div>
      </li>`;
    }).join("");
    $("[data-cart-empty]").classList.toggle("is-on", !cart.length);

    // Free shipping progress
    const left = Math.max(0, FREE_SHIP - sub);
    const done = cart.length && (left === 0 || hasB3);
    $(".ship").classList.toggle("is-done", !!done);
    $("[data-ship-msg]").innerHTML = done ? t.shipDone : t.shipLeft(fmt(left));
    $("[data-ship-bar]").style.width = (done ? 100 : Math.min(100, (sub / FREE_SHIP) * 100)) + "%";

    // Upsells: skip what's already in cart; skip kits
    const inCart = new Set(cart.map(l => l.id));
    $("[data-upsells]").innerHTML = UPSELLS.filter(id => !inCart.has(id)).slice(0, 5).map(id => {
      const p = P[id];
      return `<div class="up">
        <img src="${p.img}" alt="" loading="lazy">
        <div class="up__name">${name(id)}</div>
        <div class="up__row"><div><strong>${fmt(p.price)}</strong>${p.was ? `<s>${fmt(p.was)}</s>` : ""}</div>
        <button class="up__add" data-add="${id}" aria-label="Add">${plus}</button></div>
      </div>`;
    }).join("");

    const total = sub + (protect && cart.length ? PROTECT : 0);
    $("[data-subtotal]").textContent = fmt(total);
    $("[data-savings]").textContent = "−" + fmt(saved);
    $("[data-save-row]").style.display = saved > 0 ? "" : "none";
  }

  function openCart() { cartEl.classList.add("is-open"); overlay.classList.add("is-on"); cartEl.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function closeCart() { cartEl.classList.remove("is-open"); overlay.classList.remove("is-on"); cartEl.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }

  document.addEventListener("click", e => {
    const a = e.target.closest("[data-add]");
    if (a) { e.preventDefault(); add(a.dataset.add); return; }
    const q = e.target.closest("[data-q]");
    if (q) {
      const l = cart.find(x => x.id === q.dataset.q);
      l.qty += +q.dataset.d;
      if (l.qty < 1) cart = cart.filter(x => x !== l);
      save(); renderCart(); return;
    }
    const rm = e.target.closest("[data-rm]");
    if (rm) { cart = cart.filter(x => x.id !== rm.dataset.rm); save(); renderCart(); return; }
    if (e.target.closest("[data-open-cart]")) { openCart(); return; }
    if (e.target.closest("[data-close-cart]") || e.target === overlay) closeCart();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeCart(); closeMenu(); } });
  $("[data-protect]").addEventListener("change", e => { protect = e.target.checked; renderCart(); });
  $("[data-checkout]").addEventListener("click", () => toast(UI[lang].checkout));

  /* ================= Bundle picker + gallery ================= */
  const bundleMap = { b1: "kit", b2: "b2", b3: "b3" };
  document.querySelectorAll(".bundle input").forEach(inp => inp.addEventListener("change", () => {
    document.querySelectorAll(".bundle").forEach(b => b.classList.toggle("is-selected", b.contains(inp)));
    $("[data-bundle-price]").textContent = fmt(P[bundleMap[inp.value]].price);
  }));
  $("[data-add-bundle]").addEventListener("click", () => {
    const v = document.querySelector(".bundle input:checked").value;
    add(bundleMap[v]);
  });
  const mainImg = $("[data-gallery-main]");
  document.querySelectorAll("[data-thumb]").forEach(t => t.addEventListener("click", () => {
    document.querySelectorAll("[data-thumb]").forEach(x => x.classList.toggle("is-active", x === t));
    mainImg.style.opacity = 0;
    setTimeout(() => { mainImg.src = t.dataset.thumb; mainImg.style.opacity = 1; }, 200);
  }));

  /* ================= Mobile menu ================= */
  const menu = $("[data-mmenu]");
  function closeMenu() { menu.classList.remove("is-open"); menu.setAttribute("aria-hidden", "true"); }
  $("[data-open-menu]").addEventListener("click", () => { menu.classList.add("is-open"); menu.setAttribute("aria-hidden", "false"); });
  menu.addEventListener("click", e => { if (e.target === menu || e.target.closest("a,[data-close-menu]")) closeMenu(); });

  /* ================= Announcement rotator ================= */
  const anns = [...document.querySelectorAll(".announce__track span")];
  let ai = 0; anns[0].classList.add("is-on");
  setInterval(() => {
    const cur = anns[ai]; cur.classList.remove("is-on"); cur.classList.add("is-out");
    setTimeout(() => cur.classList.remove("is-out"), 650);
    ai = (ai + 1) % anns.length; anns[ai].classList.add("is-on");
  }, 3800);

  /* ================= Reviews slider ================= */
  const rev = $("[data-reviews]");
  document.querySelectorAll("[data-rev]").forEach(b => b.addEventListener("click", () => {
    const card = rev.querySelector(".review");
    rev.scrollBy({ left: +b.dataset.rev * (card.offsetWidth + 22), behavior: "smooth" });
  }));

  /* ================= Newsletter ================= */
  $("[data-nl]").addEventListener("submit", e => {
    e.preventDefault(); $("[data-nl-msg]").textContent = UI[lang].nl; e.target.reset();
  });

  /* ================= Toast ================= */
  let tt; const toastEl = $("[data-toast]");
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("is-on"), 2200); }

  /* ================= Scroll effects ================= */
  const header = $(".header"), sticky = $("[data-sticky]"), shop = $("#shop"), hero = $(".hero");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", scrollY > 10);
    const heroBottom = hero.getBoundingClientRect().bottom;
    const r = shop.getBoundingClientRect();
    const inShop = r.top < innerHeight && r.bottom > 0;
    sticky.classList.toggle("is-on", heroBottom < 0 && !inShop);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const animateRing = el => {
    const ring = el.querySelector(".stat__ring"), num = el.querySelector("[data-count]");
    if (!ring) return;
    const target = +num.dataset.count, start = performance.now(), dur = 1600;
    const step = now => {
      const k = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - k, 3), v = Math.round(target * e);
      num.textContent = v; ring.style.setProperty("--v", target * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("is-in");
    if (en.target.classList.contains("stat")) animateRing(en.target);
    io.unobserve(en.target);
  }), { threshold: .15, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  /* ================= Init ================= */
  applyLang(lang, false);
})();
