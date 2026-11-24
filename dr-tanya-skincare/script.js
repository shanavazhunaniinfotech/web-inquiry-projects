/* By Dr Tanya — CRO home page proposal (prototype) */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => "$" + n.toFixed(2);
  const FREE_SHIP = 79;

  /* ---------- Catalogue: real products & prices from drtanya.com.au ---------- */
  const P = {
    "super-c-serum": { name: "Super C Serum", price: 75, img: "images/super-c.webp", cat: "skin", step: "serum-am",
      benefit: "Brighten & firm", badge: "Bestseller", rating: 4.9, reviews: 312,
      desc: "Antioxidant-rich Vitamin C day serum for brighter, firmer, more hydrated-looking skin.",
      bullets: ["Vitamin C + Vitamin E antioxidant blend", "Use AM under SPF", "Targets dullness & uneven tone"], concerns: ["pigmentation"] },
    "advanced-retinol-serum": { name: "Advanced Retinol Serum", price: 80, img: "images/retinol.webp", cat: "skin", step: "serum-pm",
      benefit: "Renew overnight", rating: 4.8, reviews: 204,
      desc: "The ultimate overnight elixir to rewind, renew and reveal a more radiant you.",
      bullets: ["Retinyl Palmitate (Vitamin A)", "Use PM, 2–3 nights a week to start", "Texture, fine lines & breakouts"], concerns: ["acne", "pigmentation"] },
    "hyaluronic-acid-serum": { name: "Hyaluronic Acid Serum", price: 65, img: "images/hyaluronic.webp", cat: "skin", step: "serum-am",
      benefit: "Deep hydration", rating: 4.9, reviews: 268,
      desc: "Doctor-formulated serum for optimal hydration, plumpness and anti-ageing support.",
      bullets: ["Multi-weight Hyaluronic Acid", "Panthenol (Vitamin B5) to soothe", "AM & PM, all skin types"], concerns: ["dry", "sensitive"] },
    "holy-basil-day-night-cream": { name: "Holy Basil Day & Night Cream", price: 59.95, img: "images/day-night-cream.webp", img2: "images/day-night-cream-2.webp", cat: "skin", step: "moist",
      benefit: "Moisturise AM–PM", badge: "Bestseller", rating: 4.8, reviews: 351,
      desc: "A gentle, results-driven hydrating cream with ancient Holy Basil to keep skin moisturised, restored and youthful.",
      bullets: ["Holy Basil (Tulsi) complex", "Niacinamide + Vitamin E", "Day and night, sensitive-friendly"], concerns: ["dry", "sensitive", "acne"] },
    "nusonic-facial-exfoliator": { name: "NuSonic Facial Exfoliator", price: 89.95, img: "images/nusonic.webp", img2: "images/nusonic-2.webp", cat: "tools", step: "cleanse",
      benefit: "Sonic exfoliation", badge: "Doctor’s pick", rating: 4.7, reviews: 143,
      desc: "Pocket-sized sonic exfoliator that loosens dead-skin build-up to reveal a rejuvenated, glowing complexion.",
      bullets: ["Gentle sonic pulses", "Rechargeable, waterproof", "Boosts serum absorption"], concerns: ["acne", "pigmentation"] },
    "nubrush": { name: "NuBrush", price: 40, img: "images/nubrush.webp", cat: "tools",
      benefit: "Scalp massager", rating: 4.6, reviews: 98,
      desc: "Serum-dispensing hair massager and scalp rejuvenating technology.",
      bullets: ["Dispenses Holy Basil Hair Serum", "Stimulating scalp massage", "Pairs with the Holy Basil hair range"], concerns: [] },
    "holy-basil-hair-serum": { name: "Holy Basil Hair Serum", price: 32.95, img: "images/hair-serum.webp", cat: "hair",
      benefit: "Revive dull hair", rating: 4.7, reviews: 121,
      desc: "Scalp and hair serum with sacred Indian Holy Basil to revive dull, tired-looking hair instantly.",
      bullets: ["Holy Basil + botanical oils", "Use with NuBrush", "Lightweight, non-greasy"], concerns: [] },
    "holy-basil-shampoo": { name: "Holy Basil Shampoo", price: 29.95, img: "images/shampoo.webp", cat: "hair", soldOut: true,
      benefit: "Strengthen & repair", rating: 4.7, reviews: 88,
      desc: "Paraben and sulphate-free shampoo that unlocks the power of Holy Basil for healthier, stronger hair.",
      bullets: ["Paraben & sulphate-free", "Tulsi complex", "Strengthens & repairs"], concerns: [] },
    "holy-basil-conditioner": { name: "Holy Basil Conditioner", price: 29.95, img: "images/conditioner.webp", cat: "hair",
      benefit: "Soft, luscious hair", rating: 4.8, reviews: 102,
      desc: "A mindful blend of conditioning botanicals where modern therapeutics meet ancient beauty rituals.",
      bullets: ["Holy Basil + botanicals", "Detangles & softens", "Colour-safe"], concerns: [] }
  };
  const order = ["super-c-serum", "holy-basil-day-night-cream", "advanced-retinol-serum", "hyaluronic-acid-serum",
    "nusonic-facial-exfoliator", "holy-basil-conditioner", "holy-basil-hair-serum", "nubrush"];

  const toast = (msg) => {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2600);
  };

  /* ---------- Product cards ---------- */
  const plus = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
  const cardHTML = id => {
    const p = P[id];
    return `<article class="card" data-cat="${p.cat}">
      <div class="card__media ${p.img2 ? "has-alt" : ""}" data-qv="${id}" role="button" tabindex="0" aria-label="Quick view ${p.name}">
        ${p.badge ? `<span class="badge ${p.badge === "Bestseller" ? "badge--pink" : ""}">${p.badge}</span>` : ""}
        <img class="main" src="${p.img}" alt="${p.name}" loading="lazy" width="700" height="700">
        ${p.img2 ? `<img class="alt" src="${p.img2}" alt="" loading="lazy" width="700" height="700">` : ""}
        <div class="card__quick"><button class="btn btn--sm" data-qv="${id}">Quick view</button></div>
      </div>
      <div class="card__body">
        <span class="card__benefit">${p.benefit}</span>
        <h3 class="card__title">${p.name}</h3>
        <div class="card__rating"><span class="stars sm">★★★★★</span> ${p.rating} (${p.reviews})</div>
        <div class="card__foot">
          <div class="card__price">${money(p.price)}<small>or 4 × ${money(p.price / 4)}</small></div>
          ${p.soldOut ? '<span class="card__soldout">Back soon</span>' : `<button class="card__add" data-add="${id}" aria-label="Add ${p.name} to bag">${plus}</button>`}
        </div>
      </div>
    </article>`;
  };
  $("#productGrid").innerHTML = order.map(cardHTML).join("");

  $$(".tabs button").forEach(b => b.addEventListener("click", () => {
    $$(".tabs button").forEach(x => x.setAttribute("aria-selected", x === b));
    const f = b.dataset.filter;
    $$("#productGrid .card").forEach(c => c.classList.toggle("is-hidden", f !== "all" && c.dataset.cat !== f));
    if (window.gsap) gsap.fromTo("#productGrid .card:not(.is-hidden)", { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: .05, duration: .45, ease: "power2.out" });
  }));

  const miniHTML = id => {
    const p = P[id];
    return `<div class="mini"><img src="${p.img}" alt="" width="64" height="64" loading="lazy"><div><strong>${p.name}</strong><span>${money(p.price)}</span></div>
      <button class="btn btn--xs btn--primary" data-add="${id}">Add</button></div>`;
  };

  /* ---------- Shop by concern ---------- */
  const CONCERNS = {
    acne: { t: "Acne & breakouts", d: "Calm active breakouts and keep pores clear without stripping your skin barrier. Dr Tanya’s tip: introduce Retinol slowly — 2–3 nights a week.", ids: ["advanced-retinol-serum", "holy-basil-day-night-cream", "nusonic-facial-exfoliator"] },
    pigmentation: { t: "Pigmentation & dullness", d: "Fade the look of dark spots and bring back your glow with Vitamin C by day and Retinol by night. Always finish with SPF.", ids: ["super-c-serum", "advanced-retinol-serum", "nusonic-facial-exfoliator"] },
    sensitive: { t: "Sensitive & red", d: "Fewer, gentler ingredients. Hydrate and soothe first, then build up actives once your barrier is happy.", ids: ["hyaluronic-acid-serum", "holy-basil-day-night-cream"] },
    dry: { t: "Dry & dehydrated", d: "Dry skin lacks oil; dehydrated skin lacks water. Layer Hyaluronic Acid under a rich moisturiser to fix both.", ids: ["hyaluronic-acid-serum", "holy-basil-day-night-cream", "super-c-serum"] }
  };
  $$(".concern").forEach(btn => btn.addEventListener("click", () => {
    const c = CONCERNS[btn.dataset.concern];
    $$(".concern").forEach(x => x.setAttribute("aria-selected", x === btn));
    const r = $("#concernResult");
    r.hidden = false;
    r.innerHTML = `<div><p class="eyebrow">Dr Tanya recommends</p><h3>${c.t}</h3><p>${c.d}</p>
      <button class="btn btn--outline btn--sm" data-open-quiz>Get my full routine</button></div>
      <div class="mini-row">${c.ids.map(miniHTML).join("")}</div>`;
    r.style.animation = "none"; r.offsetHeight; r.style.animation = "";
    if (innerWidth < 960) r.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }));

  /* ---------- Cart (persists per browser) ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("drt-cart") || "[]"); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem("drt-cart", JSON.stringify(cart)); } catch (e) {} };

  const addToCart = (id, qty = 1, opts = {}) => {
    if (!P[id] || P[id].soldOut) return;
    const line = cart.find(l => l.id === id && !!l.routine === !!opts.routine);
    if (line) line.qty += qty; else cart.push({ id, qty, routine: !!opts.routine, disc: opts.disc || 0 });
    save(); renderCart();
    const cc = $("#cartCount"); cc.classList.add("bump"); setTimeout(() => cc.classList.remove("bump"), 300);
  };
  const lineTotal = l => P[l.id].price * l.qty * (1 - (l.disc || 0));
  const renderCart = () => {
    const count = cart.reduce((a, l) => a + l.qty, 0);
    const total = cart.reduce((a, l) => a + lineTotal(l), 0);
    $("#cartCount").textContent = count;
    $("#cartHeadCount").textContent = count ? `(${count})` : "";
    const left = FREE_SHIP - total;
    $("#shipMsg").innerHTML = left > 0 ? `You’re <strong>${money(left)}</strong> away from <strong>free shipping</strong>` : `🎉 You’ve unlocked <strong>free shipping</strong>`;
    $(".ship").classList.toggle("is-free", left <= 0);
    $("#shipFill").style.width = Math.min(100, (total / FREE_SHIP) * 100) + "%";
    $("#cartTotal").textContent = money(total);
    $("#afterpay").textContent = `or 4 interest-free payments of ${money(total / 4)} with Afterpay`;
    $("#checkoutBtn").disabled = !count;
    $("#cartItems").innerHTML = count ? cart.map((l, i) => {
      const p = P[l.id];
      return `<li><img src="${p.img}" alt="" width="72" height="72"><div><strong>${p.name}</strong>
        ${l.routine ? `<span class="disc">Routine bundle · ${Math.round(l.disc * 100)}% off</span>` : `<span class="muted" style="font-size:.8rem">${p.benefit}</span>`}
        <div class="qty"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="${i}" data-d="1" aria-label="Increase">+</button></div></div>
        <strong>${money(lineTotal(l))}</strong></li>`;
    }).join("") : `<li class="drawer__empty" style="display:block">Your bag is empty.<br><button class="btn btn--primary" data-open-quiz data-close-cart>Not sure where to start? Take the quiz</button></li>`;
    // Smart upsell: suggest a not-yet-added product that gets them closest to free shipping
    const inCart = new Set(cart.map(l => l.id));
    const ups = order.filter(id => !inCart.has(id) && !P[id].soldOut)
      .sort((a, b) => left > 0 ? Math.abs(P[a].price - left) - Math.abs(P[b].price - left) : P[b].rating - P[a].rating).slice(0, 2);
    $("#upsell").innerHTML = count ? `<h4>${left > 0 ? "Pairs well — and unlocks free shipping" : "Complete your routine"}</h4>${ups.map(miniHTML).join("")}` : "";
  };
  $("#cartItems").addEventListener("click", e => {
    const b = e.target.closest("[data-q]"); if (!b) return;
    const l = cart[+b.dataset.q]; l.qty += +b.dataset.d;
    if (l.qty <= 0) cart.splice(+b.dataset.q, 1);
    save(); renderCart();
  });
  const openCart = () => { $("#cart").hidden = false; document.body.style.overflow = "hidden"; $("#cart .drawer__head .icon-btn").focus(); };
  const closeCart = () => { $("#cart").hidden = true; document.body.style.overflow = ""; };
  $("#cartBtn").addEventListener("click", openCart);
  $("#checkoutBtn").addEventListener("click", () => toast("Prototype: this goes to Shopify checkout (Shop Pay, Afterpay, Apple Pay)"));
  renderCart();

  /* ---------- Quick view ---------- */
  const openQV = id => {
    const p = P[id];
    $("#qvBody").innerHTML = `<div class="qv"><div class="qv__img"><img src="${p.img}" alt="${p.name}" width="700" height="700"></div>
      <div><span class="card__benefit">${p.benefit}</span><h3>${p.name}</h3>
      <div class="card__rating"><span class="stars">★★★★★</span> ${p.rating} · ${p.reviews} reviews</div>
      <div class="qv__price">${money(p.price)}</div><p class="fine">or 4 interest-free payments of ${money(p.price / 4)} with Afterpay</p>
      <p style="margin-top:14px">${p.desc}</p><ul>${p.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
      ${p.soldOut ? `<button class="btn btn--outline btn--block" data-notify>Notify me when back</button>` : `<button class="btn btn--primary btn--block btn--lg" data-add="${id}" data-close-qv>Add to bag · ${money(p.price)}</button>`}
      <p class="fine center">✓ Free AU shipping over $79 · ✓ 30-day skin promise</p></div></div>`;
    $("#qv").hidden = false; document.body.style.overflow = "hidden";
  };
  const closeQV = () => { $("#qv").hidden = true; document.body.style.overflow = ""; };

  /* ---------- Routine builder (bundle discount) ---------- */
  const STEPS = [
    { key: "cleanse", t: "Prep & exfoliate", s: "Optional booster", ids: ["nusonic-facial-exfoliator"] },
    { key: "serum", t: "Treat", s: "Pick 1 serum", ids: ["super-c-serum", "advanced-retinol-serum", "hyaluronic-acid-serum"] },
    { key: "moist", t: "Moisturise", s: "Lock it in", ids: ["holy-basil-day-night-cream"] }
  ];
  const routine = {};
  const check = '<svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg>';
  $("#routineSteps").innerHTML = STEPS.map((s, i) => `<div class="step"><div class="step__head"><span class="step__num">${i + 1}</span><h3>${s.t}</h3><small>${s.s}</small></div>
    <div class="step__opts">${s.ids.map(id => `<button class="opt" aria-pressed="false" data-step="${s.key}" data-id="${id}"><img src="${P[id].img}" alt="" width="56" height="56" loading="lazy"><div><strong>${P[id].name}</strong><span>${money(P[id].price)}</span></div><span class="opt__check">${check}</span></button>`).join("")}</div></div>`).join("");
  const discFor = n => n >= 3 ? .15 : n === 2 ? .10 : 0;
  const renderRoutine = () => {
    const ids = Object.values(routine);
    const sub = ids.reduce((a, id) => a + P[id].price, 0);
    const d = discFor(ids.length);
    $("#routineList").innerHTML = ids.length ? ids.map(id => `<li><span>${P[id].name}</span><span>${money(P[id].price)}</span></li>`).join("") : `<li class="muted">Pick a product to start</li>`;
    $("#rtSub").textContent = money(sub);
    $("#rtSave").textContent = "–" + money(sub * d);
    $("#rtTotal").textContent = money(sub * (1 - d));
    $("#tierFill").style.width = Math.min(100, ids.length / 3 * 100) + "%";
    const btn = $("#routineAdd");
    btn.disabled = !ids.length;
    btn.textContent = ids.length < 2 ? (ids.length ? "Add 1 more to save 10%" : "Add routine to bag") : `Add routine · save ${money(sub * d)}`;
    btn.disabled = ids.length < 1;
  };
  $("#routineSteps").addEventListener("click", e => {
    const o = e.target.closest(".opt"); if (!o) return;
    const { step, id } = o.dataset;
    if (routine[step] === id) delete routine[step]; else routine[step] = id;
    $$(`.opt[data-step="${step}"]`).forEach(x => x.setAttribute("aria-pressed", routine[step] === x.dataset.id));
    renderRoutine();
  });
  $("#routineAdd").addEventListener("click", () => {
    const ids = Object.values(routine);
    if (ids.length < 2) { toast("Add one more step to unlock 10% off"); return; }
    const d = discFor(ids.length);
    ids.forEach(id => addToCart(id, 1, { routine: true, disc: d }));
    openCart();
  });
  // Pre-select a sensible default so the saving is visible immediately
  routine.serum = "super-c-serum"; routine.moist = "holy-basil-day-night-cream";
  $$(".opt").forEach(x => x.setAttribute("aria-pressed", routine[x.dataset.step] === x.dataset.id));
  renderRoutine();

  /* ---------- Ingredients glossary ---------- */
  const ING = [
    { n: "Vitamin C", aka: "Ascorbic acid derivative · antioxidant", p: "super-c-serum",
      b: ["Brightens dull skin and evens tone", "Defends against daily environmental stress", "Supports the look of firmer skin"] },
    { n: "Retinol", aka: "Retinyl Palmitate · Vitamin A", p: "advanced-retinol-serum",
      b: ["Speeds up natural skin renewal", "Smooths texture and fine lines", "Helps keep pores clear"] },
    { n: "Hyaluronic Acid", aka: "Humectant · holds up to 1000× its weight in water", p: "hyaluronic-acid-serum",
      b: ["Instant plumping hydration", "Suits every skin type, incl. sensitive", "Layers under any moisturiser"] },
    { n: "Holy Basil", aka: "Tulsi · sacred Ayurvedic botanical", p: "holy-basil-day-night-cream",
      b: ["Rich in antioxidants", "Soothes the look of redness", "Used in skin & hair rituals for centuries"] },
    { n: "Niacinamide", aka: "Vitamin B3", p: "holy-basil-day-night-cream",
      b: ["Strengthens the skin barrier", "Helps balance oil", "Visibly minimises pores"] }
  ];
  const ingList = $(".ing__list");
  ingList.innerHTML = ING.map((x, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}">${x.n}<small>${P[x.p].name.split(" ").slice(0, 2).join(" ")}</small></button>`).join("");
  const showIng = i => {
    const x = ING[i], p = P[x.p];
    $("#ingPanel").innerHTML = `<div class="ing__fade"><h3>${x.n}</h3><p class="ing__aka">${x.aka}</p><ul>${x.b.map(b => `<li>${b}</li>`).join("")}</ul>
      <button class="btn btn--outline btn--sm" style="color:#fff;border-color:rgba(255,255,255,.4)" data-open-quiz>Is it right for me?</button></div>
      <div class="ing__prod ing__fade"><img src="${p.img}" alt="" width="200" height="200" loading="lazy"><div><strong>${p.name}</strong><span>${money(p.price)}</span></div><button class="btn btn--primary btn--sm" data-add="${x.p}">Add to bag</button></div>`;
  };
  ingList.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", ingList).forEach(x => x.setAttribute("aria-selected", x === b));
    showIng(+b.dataset.i);
  });
  showIng(0);

  /* ---------- Reviews (sample layout; replace with review app) ---------- */
  const REV = [
    { n: "Emily K", p: "super-c-serum", t: "Perfect brightening serum", r: "I've been really wanting a good brightening serum and this new Super C Serum came out at the perfect time. It's really lightweight and feels amazing on my skin.", real: true },
    { n: "Sarah M.", p: "holy-basil-day-night-cream", t: "My skin finally feels calm", r: "I have reactive skin and most creams sting. This one doesn’t — and it lasts all day without feeling heavy." },
    { n: "Jess T.", p: "advanced-retinol-serum", t: "Texture is so much smoother", r: "Started 2 nights a week like the card said. A month in and my foundation sits so much better." },
    { n: "Priya R.", p: "nusonic-facial-exfoliator", t: "Tiny but mighty", r: "Use it 3 times a week with my cleanser. My serums actually sink in now. Love that it’s waterproof." },
    { n: "Olivia W.", p: "hyaluronic-acid-serum", t: "Dewy, not sticky", r: "Layer it under the Day & Night Cream — plump skin all day. Great for air-con office skin." },
    { n: "Hannah L.", p: "holy-basil-conditioner", t: "Smells amazing", r: "Hair is softer and shinier and the scent is subtle and herbal. Pair it with the hair serum." }
  ];
  $("#reviewRail").innerHTML = REV.map(x => `<article class="review"><div class="review__who"><span class="stars sm">★★★★★</span> <strong>${x.n}</strong> <span class="verified">✓ Verified</span>${x.real ? "" : '<span class="sample">Sample</span>'}</div>
    <h4>${x.t}</h4><p>${x.r}</p><div class="review__foot"><img src="${P[x.p].img}" alt="" width="40" height="40" loading="lazy"><div><small>Reviewed</small>${P[x.p].name}</div><button class="btn btn--xs btn--outline" style="margin-left:auto" data-add="${x.p}">Add</button></div></article>`).join("");

  /* ---------- Skin quiz ---------- */
  const QZ = [
    { q: "What’s your #1 skin goal?", s: "Pick the one that bothers you most.", k: "goal", o: [
      ["acne", "Clear breakouts", "Spots, congestion, oiliness"], ["pigmentation", "Even tone & glow", "Dark spots, dullness"],
      ["dry", "More hydration", "Tight, flaky, dehydrated"], ["sensitive", "Calm my skin", "Redness, reactivity"]] },
    { q: "How does your skin feel by midday?", s: "Be honest — no judgement here.", k: "type", o: [
      ["oily", "Shiny", "Especially T-zone"], ["dry", "Tight", "Needs more moisturiser"], ["combo", "Bit of both", "Oily T-zone, dry cheeks"], ["normal", "Comfortable", "Pretty balanced"]] },
    { q: "How many steps do you want?", s: "Dr Tanya’s rule: a routine you’ll actually do beats a perfect one you won’t.", k: "steps", o: [
      ["2", "Keep it minimal", "2 steps"], ["3", "The protocol", "3 steps (recommended)"]] }
  ];
  let qi = 0; const ans = {};
  const renderQuiz = () => {
    $("#quizFill").style.width = (qi / QZ.length * 100) + "%";
    if (qi < QZ.length) {
      const q = QZ[qi];
      $("#quizBody").innerHTML = `<p class="eyebrow">Question ${qi + 1} of ${QZ.length}</p><h3 id="quizTitle">${q.q}</h3><p>${q.s}</p>
        <div class="q-opts">${q.o.map(o => `<button data-a="${o[0]}">${o[1]}<small>${o[2]}</small></button>`).join("")}</div>
        ${qi ? '<button class="btn btn--link" data-back>← Back</button>' : ""}`;
      return;
    }
    const c = CONCERNS[ans.goal];
    let ids = c.ids.filter(id => P[id].cat === "skin");
    if (!ids.includes("holy-basil-day-night-cream")) ids.push("holy-basil-day-night-cream");
    if (ans.steps === "3" && ids.length < 3) ids.unshift(ans.goal === "sensitive" ? "super-c-serum" : "nusonic-facial-exfoliator");
    ids = ids.slice(0, +ans.steps);
    const sub = ids.reduce((a, id) => a + P[id].price, 0), d = discFor(ids.length);
    $("#quizBody").innerHTML = `<div class="q-result"><p class="eyebrow">Your Skin Doctor Protocol</p><h3 id="quizTitle">Your routine for ${c.t.toLowerCase()}</h3><p>${c.d}</p>
      <div class="q-result__head"><span class="btn__meta">${Math.round(d * 100)}% off</span> Bundle price <strong>${money(sub * (1 - d))}</strong> <s class="muted">${money(sub)}</s></div>
      ${ids.map(id => `<div class="mini"><img src="${P[id].img}" alt="" width="64" height="64"><div><strong>${P[id].name}</strong><span>${P[id].benefit}</span></div></div>`).join("")}
      <button class="btn btn--primary btn--block btn--lg" data-add-routine="${ids.join(",")}">Add my routine · save ${money(sub * d)}</button>
      <p class="fine center">Free AU shipping over $79 · 30-day skin promise</p>
      <button class="btn btn--link" data-restart>Retake quiz</button></div>`;
    $("#quizFill").style.width = "100%";
  };
  $("#quizBody").addEventListener("click", e => {
    const a = e.target.closest("[data-a]");
    if (a) { ans[QZ[qi].k] = a.dataset.a; qi++; renderQuiz(); return; }
    if (e.target.closest("[data-back]")) { qi--; renderQuiz(); return; }
    if (e.target.closest("[data-restart]")) { qi = 0; renderQuiz(); return; }
    const r = e.target.closest("[data-add-routine]");
    if (r) {
      const ids = r.dataset.addRoutine.split(",");
      ids.forEach(id => addToCart(id, 1, { routine: true, disc: discFor(ids.length) }));
      closeQuiz(); openCart();
    }
  });
  const openQuiz = () => { qi = 0; renderQuiz(); $("#quiz").hidden = false; document.body.style.overflow = "hidden"; };
  const closeQuiz = () => { $("#quiz").hidden = true; document.body.style.overflow = ""; };

  /* ---------- Global click delegation ---------- */
  document.addEventListener("click", e => {
    const t = e.target;
    const add = t.closest("[data-add]");
    if (add) {
      addToCart(add.dataset.add);
      if (add.classList.contains("card__add")) { add.classList.add("done"); add.innerHTML = check; setTimeout(() => { add.classList.remove("done"); add.innerHTML = plus; }, 1400); }
      toast(`✓ ${P[add.dataset.add].name} added to your bag`);
      if (add.closest("#qv")) { closeQV(); openCart(); }
      return;
    }
    if (t.closest("[data-open-quiz]")) { closeCart(); closeMnav(); openQuiz(); return; }
    const qv = t.closest("[data-qv]"); if (qv) { e.stopPropagation(); openQV(qv.dataset.qv); return; }
    if (t.closest("[data-close-cart]")) closeCart();
    if (t.closest("[data-close-quiz]")) closeQuiz();
    if (t.closest("[data-close-qv]")) closeQV();
    if (t.closest("[data-close-mnav]")) closeMnav();
    if (t.closest("[data-notify]")) toast("Prototype: opens a Klaviyo sign-up for launch offers");
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeCart(); closeQuiz(); closeQV(); closeMnav(); $("#search").hidden = true; }
    if (e.key === "Enter" && e.target.matches(".card__media[data-qv]")) openQV(e.target.dataset.qv);
  });

  /* ---------- Mobile menu ---------- */
  const closeMnav = () => { $("#mnav").hidden = true; $("#burger").setAttribute("aria-expanded", "false"); };
  $("#burger").addEventListener("click", () => { $("#mnav").hidden = false; $("#burger").setAttribute("aria-expanded", "true"); });
  $("#mnav").addEventListener("click", e => { if (e.target.id === "mnav") closeMnav(); });

  /* ---------- Predictive search ---------- */
  const sIn = $("#searchInput");
  $("#searchBtn").addEventListener("click", () => { const s = $("#search"); s.hidden = !s.hidden; if (!s.hidden) sIn.focus(); });
  const doSearch = q => {
    q = q.trim().toLowerCase();
    const hits = q ? Object.keys(P).filter(id => { const p = P[id]; return (p.name + " " + p.benefit + " " + p.desc + " " + p.bullets.join(" ") + " " + p.concerns.join(" ") + " " + p.cat).toLowerCase().includes(q); }) : [];
    $("#searchResults").innerHTML = hits.map(id => `<li data-qv="${id}"><img src="${P[id].img}" alt="" width="52" height="52"><div>${P[id].name}<small>${money(P[id].price)}</small></div></li>`).join("") || (q ? `<li style="cursor:default">No match — try the <button class="btn btn--link" data-open-quiz>skin quiz</button></li>` : "");
  };
  sIn.addEventListener("input", () => doSearch(sIn.value));
  $$(".search__chips button").forEach(b => b.addEventListener("click", () => { sIn.value = b.dataset.q; doSearch(b.dataset.q); }));

  /* ---------- Newsletter ---------- */
  $("#newsForm").addEventListener("submit", e => {
    e.preventDefault();
    const v = $("#newsEmail").value.trim();
    $("#newsMsg").textContent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "You’re in! Your code WELCOME10 is on its way 💌" : "Please enter a valid email address.";
  });

  /* ---------- Announcement rotator ---------- */
  const ann = $$(".announce__track p"); let ai = 0;
  setInterval(() => {
    ann[ai].classList.remove("is-on"); ann[ai].classList.add("is-out");
    const prev = ai; setTimeout(() => ann[prev].classList.remove("is-out"), 700);
    ai = (ai + 1) % ann.length; ann[ai].classList.add("is-on");
  }, 4200);

  /* ---------- Header shadow + sticky mobile CTA ---------- */
  const hero = $(".hero");
  const onScroll = () => {
    $("#header").classList.toggle("is-scrolled", scrollY > 10);
    const past = hero.getBoundingClientRect().bottom < 0;
    const nearEnd = innerHeight + scrollY > document.body.scrollHeight - 500;
    $("#stickyBar").classList.toggle("show", past && !nearEnd);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* =========================================================
     DESIGN NOTES — the "why" behind each section, for Indi
     ========================================================= */
  const NOTES = {
    announce: ["Announcement bar", "Removes the 3 biggest checkout doubts (shipping cost, payment, risk) before the visitor even scrolls. Rotates so each message gets read, not skimmed.", ["Free-shipping threshold lifts average order value", "Afterpay mention = proven AOV lift in AU beauty", "Values ($79 / 30-day promise) are placeholders to confirm"], "↑ AOV · ↓ cart abandonment"],
    hero: ["Hero — doctor-first", "Dr Tanya’s biggest edge over Mecca-shelf brands is that a real doctor stands behind it. So she is the hero, the headline promises the outcome, and the CTA pair splits visitors by intent: ‘ready to buy’ → bestsellers, ‘unsure’ → quiz.", ["Product + price + Add button visible above the fold (1-click to cart)", "Star rating, free shipping & promise right under the CTAs to answer ‘can I trust this?’", "Hero image is preloaded & WebP to keep LCP fast"], "↑ CTR to product · ↓ bounce"],
    values: ["Brand values strip", "Uses Dr Tanya’s own icon set. A slow marquee keeps the 4 brand pillars in view without taking vertical space.", ["Breaks the page into scannable chapters", "Pauses on hover for accessibility"], "Brand recall"],
    concerns: ["Shop by concern — moved up", "People shop skincare by problem, not by product name. Tapping a concern now shows Dr Tanya’s picks inline — no page load, no getting lost in a collection.", ["2nd section = fastest path from ‘my problem’ to ‘my product’", "Inline ‘Add’ buttons cut 2 clicks vs. the current flow", "Every result offers the quiz as a fallback"], "↑ product discovery · ↓ clicks to cart"],
    bestsellers: ["Bestsellers with quick-add", "Social-proof driven grid: badges, star ratings, benefit line, and Afterpay instalment price on every card.", ["Add-to-bag on the card — no PDP visit needed", "Hover shows texture / 2nd image; Quick View for details", "Tabs (Skin / Tools / Hair) so hair shoppers aren’t lost"], "↑ add-to-cart rate"],
    results: ["Proof: before/after + reviews", "Right after browsing products, visitors ask ‘does it actually work?’. We answer with visual proof, a real review (Emily K) and outcome stats, then an Add button right there.", ["Stats are placeholders — swap for real trial data", "CTA inside the proof block captures the ‘convinced’ moment"], "↑ conversion on Super C"],
    routine: ["Routine builder — bundle & save", "The biggest AOV lever on the page. Visitors build an AM/PM routine step by step and watch the saving grow (10% for 2, 15% for 3).", ["Pre-selected default so savings are visible instantly", "Mirrors Dr Tanya’s ‘Simple routines’ promise", "Discount % is a suggestion — easy to change in Shopify bundles"], "↑ AOV · ↑ items per order"],
    glow: ["Glow launch spotlight", "Gives the new Glow line its own moment without hijacking the hero (which stays focused on the core brand). The pink palette matches the Glow campaign creative.", ["Secondary CTA captures email for launch offers"], "New-range awareness"],
    doctor: ["Meet Dr Tanya — authority", "Trust is the #1 purchase barrier in skincare. A founder story from a real doctor is the most persuasive asset this brand has, so it gets a full section with clear credentials.", ["Copy is a draft for Dr Tanya to personalise", "Ends with a soft CTA into the routine"], "↑ trust · ↑ time on page"],
    ingredients: ["Interactive ingredient glossary", "Ingredient-savvy shoppers (a huge share of skincare buyers) want to know what’s inside. Each ingredient links straight to the product that contains it.", ["Turns education into a buying path", "Great for SEO when built as real Shopify metaobjects"], "↑ engagement · SEO"],
    reviews: ["Review wall", "A swipeable rail of verified reviews, each with an Add button. In Shopify this is powered by Judge.me / Okendo so it updates itself.", ["Only Emily K’s review is real — others are marked ‘Sample’", "Rating & count shown are placeholders"], "↑ trust · ↑ conversion"],
    insta: ["Shoppable UGC", "Real-skin content from @bydrtanya.au, each tile links to the product shown. Builds community and FOMO.", ["Images are placeholders — connect Instagram feed app"], "Social proof"],
    journal: ["Skin Journal", "Keeps the existing blog (great for SEO) but surfaces the 3 most search-driven articles with read times.", ["Internal links feed SEO authority to product pages"], "SEO · organic traffic"],
    faq: ["FAQ + risk reversal", "Answers the last objections before purchase (results timing, sensitivity, shipping, Afterpay) next to the 30-day promise.", ["Native accordion = fast, accessible, SEO-friendly (FAQ schema)", "Quiz CTA for anyone still undecided"], "↓ objections · ↓ support tickets"],
    news: ["Email capture — 10% off", "Most first-time visitors won’t buy on visit one. Capturing their email lets Klaviyo flows bring them back.", ["Offer % is a placeholder", "Pair with a timed exit-intent pop-up on the live site"], "↑ list growth · ↑ return visits"]
  };
  $$("[data-note]").forEach(sec => {
    const n = NOTES[sec.dataset.note]; if (!n) return;
    const d = document.createElement("aside");
    d.className = "note";
    d.innerHTML = `<b><i>Why</i> ${n[0]}</b><p>${n[1]}</p><ul>${n[2].map(x => `<li>${x}</li>`).join("")}</ul><span class="note__kpi">Goal: ${n[3]}</span>`;
    sec.prepend(d);
  });
  const nt = $("#notesToggle");
  const setNotes = on => {
    document.body.classList.toggle("show-notes", on); nt.setAttribute("aria-pressed", on);
    nt.lastChild.textContent = on ? " Hide design notes" : " Why this layout?";
  };
  nt.addEventListener("click", () => setNotes(!document.body.classList.contains("show-notes")));
  if (/[?&]notes/.test(location.search)) setNotes(true);

  /* =========================================================
     MOTION (GSAP) — subtle, never blocks content
     ========================================================= */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const countUp = el => {
    const end = +el.dataset.count; const t0 = performance.now();
    const step = now => { const k = Math.min(1, (now - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const statsObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { $$("[data-count]", e.target).forEach(reduce ? (el => el.textContent = el.dataset.count) : countUp); statsObs.unobserve(e.target); } }), { threshold: .4 });
  statsObs.observe($(".stats"));

  const initMotion = () => {
    if (!window.gsap || reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".hero__title .line>span", { yPercent: 105, duration: 1, ease: "power4.out", stagger: .09 });
    gsap.from(".hero__sub, .hero__ctas, .hero__proof", { y: 20, opacity: 0, duration: .8, stagger: .08, delay: .35, ease: "power3.out" });
    gsap.from(".hero__photo", { clipPath: "inset(12% 12% 12% 12% round 28px)", duration: 1.3, ease: "power3.out" });
    gsap.from(".float-card", { y: 30, opacity: 0, duration: .8, stagger: .15, delay: .7, ease: "back.out(1.6)" });
    gsap.to(".hero__photo img", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    const batchIn = sel => ScrollTrigger.batch(sel, { start: "top 88%", once: true,
      onEnter: b => gsap.fromTo(b, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .08, ease: "power3.out", overwrite: true }) });
    gsap.set(".sec-head, .concern, .card, .step, .review, .post, .insta__item, .results__media, .results__copy, .doctor__img, .doctor__copy, .glow__copy, .glow__img, .acc details", { opacity: 0 });
    [".sec-head", ".concern", ".card", ".step", ".review", ".post", ".insta__item", ".results__media, .results__copy", ".doctor__img, .doctor__copy", ".glow__copy, .glow__img", ".acc details"].forEach(batchIn);
    gsap.fromTo(".glow__img", { rotate: 4 }, { rotate: -1.5, ease: "none", scrollTrigger: { trigger: ".glow", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(".footer__word", { xPercent: 6 }, { xPercent: -6, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });
  };
  if (document.readyState === "complete") initMotion(); else addEventListener("load", initMotion);
})();
