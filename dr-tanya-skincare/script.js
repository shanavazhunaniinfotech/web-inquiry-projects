/* By Dr Tanya — "Just what the doctor ordered" — V2 CRO home page (prototype) */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => "$" + n.toFixed(2);
  const FREE_SHIP = 79;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* ---------- Catalogue (real products & prices from drtanya.com.au) ---------- */
  const P = {
    "super-c-serum": { name: "Super C Serum", price: 75, img: "images/cut-super-c.webp", tone: "#f8e2cf", cat: "skin", ben: "Brighten & firm", badge: "Bestseller", rating: 4.9, rev: 312,
      desc: "Antioxidant-rich Vitamin C day serum for brighter, firmer, more hydrated-looking skin.", dir: "2–3 drops every morning, under SPF.",
      bul: ["Vitamin C + Vitamin E antioxidant blend", "Use AM, always under SPF", "Targets dullness & uneven tone"], forTxt: "Dullness, uneven tone, pigmentation", tags: "vitamin c brightening pigmentation dull glow" },
    "advanced-retinol-serum": { name: "Advanced Retinol Serum", price: 80, img: "images/cut-retinol.webp", tone: "#e4e9f1", cat: "skin", ben: "Renew overnight", rating: 4.8, rev: 204,
      desc: "The ultimate overnight elixir to rewind, renew and reveal a more radiant you.", dir: "Pea-size at night, 2–3× a week to start.",
      bul: ["Retinyl Palmitate (Vitamin A)", "Use PM, build up slowly", "Texture, fine lines & breakouts"], forTxt: "Texture, fine lines, breakouts", tags: "retinol vitamin a acne texture ageing" },
    "hyaluronic-acid-serum": { name: "Hyaluronic Acid Serum", price: 65, img: "images/cut-hyaluronic.webp", tone: "#dcebef", cat: "skin", ben: "Deep hydration", rating: 4.9, rev: 268,
      desc: "Doctor-formulated serum for optimal hydration, plumpness and anti-ageing support.", dir: "On damp skin, morning and night.",
      bul: ["Multi-weight Hyaluronic Acid", "Panthenol (Vitamin B5) to soothe", "All skin types, AM & PM"], forTxt: "Dry, dehydrated, tight skin", tags: "hyaluronic hydration dry dehydrated sensitive panthenol" },
    "holy-basil-day-night-cream": { name: "Holy Basil Day & Night Cream", price: 59.95, img: "images/cut-cream.webp", wide: true, tone: "#e6ece1", cat: "skin", ben: "Moisturise AM–PM", badge: "Bestseller", rating: 4.8, rev: 351,
      desc: "A gentle, results-driven hydrating cream with ancient Holy Basil to keep skin moisturised, restored and youthful.", dir: "Last step, morning and night.",
      bul: ["Holy Basil (Tulsi) complex", "Niacinamide + Vitamin E", "Sensitive-friendly, day and night"], forTxt: "Every skin type — the step everyone needs", tags: "holy basil moisturiser cream niacinamide sensitive dry" },
    "nusonic-facial-exfoliator": { name: "NuSonic Facial Exfoliator", price: 89.95, img: "images/cut-nusonic.webp", wide: true, tone: "#e9efe7", cat: "tools", ben: "Sonic exfoliation", badge: "Doctor’s pick", rating: 4.7, rev: 143,
      desc: "Pocket-sized sonic exfoliator that loosens dead-skin build-up to reveal a rejuvenated, glowing complexion.", dir: "60 seconds with cleanser, 3× a week.",
      bul: ["Gentle sonic pulses", "Rechargeable & waterproof", "Helps serums absorb better"], forTxt: "Congestion, dullness, rough texture", tags: "nusonic exfoliator tool acne congestion glow" },
    "holy-basil-hair-serum": { name: "Holy Basil Hair Serum", price: 32.95, img: "images/cut-hair-serum.webp", tone: "#efe6d6", cat: "hair", ben: "Revive dull hair", rating: 4.7, rev: 121,
      desc: "Scalp and hair serum with sacred Indian Holy Basil to revive dull, tired-looking hair instantly.", dir: "A few drops into scalp, massage with NuBrush.",
      bul: ["Holy Basil + botanical oils", "Pairs with NuBrush", "Lightweight, non-greasy"], forTxt: "Dull hair, thinning, tired scalp", tags: "hair serum holy basil scalp thinning" },
    "holy-basil-conditioner": { name: "Holy Basil Conditioner", price: 29.95, img: "images/cut-conditioner.webp", tone: "#e2ebe2", cat: "hair", ben: "Soft, luscious hair", rating: 4.8, rev: 102,
      desc: "Modern therapeutics meet ancient beauty rituals: a mindful blend of conditioning botanicals.", dir: "Mid-lengths to ends, rinse after 2 min.",
      bul: ["Holy Basil + botanicals", "Detangles & softens", "Paraben & sulphate-free"], forTxt: "Dry, frizzy, damaged hair", tags: "hair conditioner holy basil" },
    "nubrush": { name: "NuBrush", price: 40, img: "images/cut-nubrush.webp", wide: true, tone: "#ebe7e1", cat: "tools", ben: "Scalp massager", rating: 4.6, rev: 98,
      desc: "Serum-dispensing hair massager and scalp rejuvenating technology.", dir: "Fill with Hair Serum, massage 2 min daily.",
      bul: ["Dispenses Holy Basil Hair Serum", "Stimulating scalp massage", "Pairs with the hair range"], forTxt: "Scalp care, thinning hair", tags: "nubrush hair scalp tool" },
    "holy-basil-shampoo": { name: "Holy Basil Shampoo", price: 29.95, img: "images/cut-shampoo.webp", tone: "#e2ebe2", cat: "hair", ben: "Strengthen & repair", rating: 4.7, rev: 88, soldOut: true,
      desc: "Paraben and sulphate-free shampoo with Holy Basil for healthier, stronger hair.", dir: "Massage into wet scalp, rinse.",
      bul: ["Paraben & sulphate-free", "Tulsi complex", "Strengthens & repairs"], forTxt: "Weak, thinning hair", tags: "hair shampoo holy basil" }
  };
  const SHOP = ["holy-basil-day-night-cream", "advanced-retinol-serum", "hyaluronic-acid-serum", "nusonic-facial-exfoliator", "holy-basil-hair-serum", "holy-basil-conditioner", "nubrush", "holy-basil-shampoo"];
  const imgTag = (id, cls = "") => `<img src="${P[id].img}" alt="" class="${P[id].wide ? "wide " : ""}${cls}" loading="lazy">`;

  const toast = msg => { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2600); };
  const miniHTML = (id, btn = "Add", sub) => { const p = P[id]; return `<div class="mini"><span class="mini__img" style="--tone:${p.tone}"><img src="${p.img}" alt="" loading="lazy"></span><div><strong>${p.name}</strong><small>${sub || money(p.price)}</small></div>${btn ? `<button class="btn btn--dark" data-add="${id}">${btn}</button>` : ""}</div>`; };

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  const lock = on => { document.documentElement.style.overflow = on ? "hidden" : ""; if (lenis) on ? lenis.stop() : lenis.start(); };

  /* ---------- Loader ---------- */
  const endLoad = () => {
    document.body.classList.remove("is-loading"); document.body.classList.add("ready");
    setTimeout(() => $("#loader").classList.add("gone"), 1100);
    try { sessionStorage.setItem("drt-seen", "1"); } catch (e) {}
    if (heroIntro) heroIntro();
  };
  let seen = false; try { seen = !!sessionStorage.getItem("drt-seen"); } catch (e) {}
  let heroIntro = null;

  /* =========================================================
     HERO — product stage with 4 "prescriptions"
     ========================================================= */
  const HERO = [
    { id: "super-c-serum", theme: "c", chips: ["Vitamin C", "Vitamin E", "Brightens & firms"], sub: "Brighter, firmer, more hydrated-looking skin with our antioxidant-rich <strong>Super C Serum</strong> — chosen by a doctor, not a marketing team." },
    { id: "advanced-retinol-serum", theme: "r", chips: ["Vitamin A", "Overnight renewal", "Smoother texture"], sub: "Rewind, renew and wake up more radiant with <strong>Advanced Retinol Serum</strong> — the overnight elixir, dosed properly." },
    { id: "holy-basil-day-night-cream", theme: "b", chips: ["Holy Basil", "Niacinamide", "Day & night"], sub: "Ancient Holy Basil meets modern therapeutics. <strong>Day &amp; Night Cream</strong> keeps skin moisturised, restored and youthful." },
    { id: "hyaluronic-acid-serum", theme: "h", chips: ["Hyaluronic Acid", "Vitamin B5", "Plump & dewy"], sub: "Optimal hydration and plumpness with <strong>Hyaluronic Acid Serum</strong> — the doctor-formulated drink your skin is craving." }
  ];
  let hi = 0, heroTimer = null;
  const hero = $("#hero"), stageImg = $("#stageImg");
  const setHero = (i, instant) => {
    hi = (i + HERO.length) % HERO.length;
    const h = HERO[hi], p = P[h.id];
    hero.dataset.theme = h.theme;
    $$("#heroTabs button").forEach((b, k) => { b.setAttribute("aria-selected", k === hi); const pr = $(".prog", b); pr.style.animation = "none"; pr.offsetHeight; pr.style.animation = ""; });
    const swap = () => {
      stageImg.src = p.img; stageImg.alt = "Dr Tanya " + p.name; stageImg.classList.toggle("is-wide", !!p.wide);
      ["chip1", "chip2", "chip3"].forEach((c, k) => $("#" + c).textContent = h.chips[k]);
      $("#rxDir").textContent = p.dir; $("#heroSub").innerHTML = h.sub;
      $("#heroPrice").textContent = money(p.price); $("#heroAdd").dataset.add = h.id;
      $("#mbarImg").src = p.img; $("#mbarName").textContent = p.name; $("#mbarPrice").textContent = `${money(p.price)} · ★ ${p.rating}`; $("#mbarAdd").dataset.add = h.id;
    };
    if (instant || !window.gsap || reduce) { swap(); return; }
    gsap.timeline()
      .to([stageImg, ".chipf", ".rxlabel", "#heroSub"], { opacity: 0, y: (k) => k === 0 ? -30 : 10, rotate: (k) => k === 0 ? -6 : 0, duration: .35, ease: "power2.in", stagger: .02 })
      .add(swap)
      .fromTo(stageImg, { opacity: 0, y: 60, rotate: 8, scale: .92 }, { opacity: 1, y: 0, rotate: 0, scale: 1, duration: 1, ease: "expo.out" })
      .fromTo([".chipf", ".rxlabel", "#heroSub"], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, stagger: .07, ease: "power3.out" }, "<.15");
  };
  const autoHero = () => { clearInterval(heroTimer); heroTimer = setInterval(() => { if (!hero.classList.contains("paused")) setHero(hi + 1); }, 6500); };
  $$("#heroTabs button").forEach(b => b.addEventListener("click", () => { setHero(+b.dataset.i); autoHero(); }));
  hero.addEventListener("mouseenter", () => hero.classList.add("paused"));
  hero.addEventListener("mouseleave", () => hero.classList.remove("paused"));
  setHero(0, true); autoHero();
  // parallax
  if (fine && !reduce) {
    const stage = $("#heroStage");
    hero.addEventListener("mousemove", e => {
      if (!window.gsap) return;
      const r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      gsap.to("#stageProd", { x: x * 26, y: y * 18, rotateY: x * 10, duration: 1.2, ease: "power3.out" });
      $$("[data-depth]", stage).forEach(el => gsap.to(el, { x: x * 40 * el.dataset.depth, y: y * 30 * el.dataset.depth, duration: 1.4, ease: "power3.out" }));
    });
  }

  /* =========================================================
     CONCERNS — big type list with cursor image + inline Rx
     ========================================================= */
  const CON = [
    { k: "acne", t: "Acne &amp; <em>breakouts</em>", img: "images/concern-acne.webp", tags: ["Congestion", "Oily T-zone", "Adult acne"], note: "Keep it gentle. Retinol 2–3 nights a week, exfoliate twice, never skip moisturiser.", ids: ["advanced-retinol-serum", "nusonic-facial-exfoliator", "holy-basil-day-night-cream"] },
    { k: "pigmentation", t: "Pigmentation &amp; <em>dullness</em>", img: "images/concern-pigmentation.webp", tags: ["Dark spots", "Uneven tone", "Dull"], note: "Vitamin C by day, Retinol by night — and SPF every single morning.", ids: ["super-c-serum", "advanced-retinol-serum", "nusonic-facial-exfoliator"] },
    { k: "sensitive", t: "Sensitive &amp; <em>redness</em>", img: "images/concern-sensitive.webp", tags: ["Reactive", "Redness", "Stinging"], note: "Fewer, gentler ingredients. Hydrate and calm first — actives can wait.", ids: ["hyaluronic-acid-serum", "holy-basil-day-night-cream"] },
    { k: "dry", t: "Dry &amp; <em>dehydrated</em>", img: "images/concern-normal.webp", tags: ["Tight", "Flaky", "Fine lines"], note: "Dry lacks oil, dehydrated lacks water. Layer HA under a rich cream to fix both.", ids: ["hyaluronic-acid-serum", "holy-basil-day-night-cream", "super-c-serum"] },
    { k: "hair", t: "Thinning <em>hair</em>", img: "images/j-hair.webp", tags: ["Scalp", "Shedding", "Dull hair"], note: "Treat the scalp like skin: daily massage with serum, and a gentle routine.", ids: ["holy-basil-hair-serum", "nubrush", "holy-basil-conditioner"] }
  ];
  $("#clist").innerHTML = CON.map((c, i) => `<div class="crow" data-i="${i}">
    <button class="crow__btn" aria-expanded="false" data-img="${c.img}">
      <span class="crow__n">0${i + 1}</span><img class="crow__thumb" src="${c.img}" alt="" loading="lazy">
      <span class="crow__t">${c.t}</span>
      <span class="crow__tags">${c.tags.map(t => `<span>${t}</span>`).join("")}</span>
      <span class="crow__ic"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span>
    </button>
    <div class="crow__body"><div class="crow__inner"><div class="crow__content">
      <div class="crow__img"><img src="${c.img}" alt="" loading="lazy"></div>
      <div class="crow__note"><b><span>℞</span> Dr Tanya’s note</b><p>${c.note}</p><button class="btn btn--line" data-open-quiz>Get my full routine</button></div>
      <div class="crow__prods">${c.ids.map(id => miniHTML(id, "Add", `${P[id].ben} · ${money(P[id].price)}`)).join("")}</div>
    </div></div></div></div>`).join("");
  const openConcern = (i, scroll) => {
    $$(".crow").forEach((r, k) => { const on = k === i && !r.classList.contains("open"); r.classList.toggle("open", on); $(".crow__btn", r).setAttribute("aria-expanded", on); });
    if (scroll) { const el = $$(".crow")[i]; lenis ? lenis.scrollTo(el, { offset: -110 }) : el.scrollIntoView({ behavior: "smooth" }); }
  };
  $$(".crow__btn").forEach((b, i) => b.addEventListener("click", () => openConcern(i)));
  $$("[data-concern-link]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); const i = +a.dataset.concernLink; const r = $$(".crow")[i]; if (!r.classList.contains("open")) openConcern(i); setTimeout(() => openConcern === openConcern && (lenis ? lenis.scrollTo(r, { offset: -110 }) : r.scrollIntoView()), 50); }));
  if (fine) {
    const cf = $("#cfollow"), cfi = $("#cfollowImg");
    let mx = 0, my = 0, cx = 0, cy = 0;
    $$(".crow__btn").forEach(b => {
      b.addEventListener("mouseenter", () => { if (b.closest(".crow").classList.contains("open")) return; cfi.src = b.dataset.img; cf.classList.add("on"); });
      b.addEventListener("mouseleave", () => cf.classList.remove("on"));
      b.addEventListener("click", () => cf.classList.remove("on"));
    });
    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
    const loop = () => { cx += (mx - cx) * .14; cy += (my - cy) * .14; cf.style.left = cx + "px"; cf.style.top = cy + "px"; requestAnimationFrame(loop); };
    loop();
  }

  /* =========================================================
     SHOP — bento cards
     ========================================================= */
  const plus = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
  const check = '<svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg>';
  $("#bento").insertAdjacentHTML("beforeend", SHOP.map(id => {
    const p = P[id];
    return `<article class="pc" data-cat="${p.cat}">
      <div class="pc__media" style="--tone:${p.tone}" data-qv="${id}" data-cursor="View" role="button" tabindex="0" aria-label="Quick view ${p.name}">
        ${p.badge ? `<span class="pill ${p.badge === "Bestseller" ? "pill--pink" : ""} pc__badge">${p.badge}</span>` : ""}
        <img src="${p.img}" alt="${p.name}" class="${p.wide ? "wide" : ""}" loading="lazy">
        <div class="pc__for"><b>Prescribed for</b>${p.forTxt}</div>
      </div>
      <div class="pc__body">
        <span class="pc__ben">${p.ben}</span>
        <h3 class="pc__name">${p.name}</h3>
        <div class="pc__rate"><span class="stars">★★★★★</span> ${p.rating} (${p.rev})</div>
        <div class="pc__foot">
          <div class="pc__price">${money(p.price)}<small>or 4 × ${money(p.price / 4)}</small></div>
          ${p.soldOut ? `<button class="pc__sold" data-notify>Notify me</button>` : `<button class="pc__add" data-add="${id}" aria-label="Add ${p.name} to bag">${plus}<span>Add</span></button>`}
        </div>
      </div></article>`;
  }).join(""));
  $$(".seg button").forEach(b => b.addEventListener("click", () => {
    $$(".seg button").forEach(x => x.setAttribute("aria-selected", x === b));
    const f = b.dataset.f;
    $$("#bento > *").forEach(c => c.classList.toggle("is-hidden", f !== "all" && c.dataset.cat !== f));
    if (window.gsap) gsap.fromTo("#bento > :not(.is-hidden)", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .05, ease: "power3.out" });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }));
  // 3D tilt
  if (fine && !reduce) $$(".pc__media").forEach(m => {
    m.addEventListener("mousemove", e => { const r = m.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; m.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`; });
    m.addEventListener("mouseleave", () => m.style.transform = "");
  });

  /* =========================================================
     PROTOCOL — sticky stage, AM/PM
     ========================================================= */
  const PROTO = {
    am: [
      { id: "nusonic-facial-exfoliator", t: "Prep", h: "NuSonic Facial Exfoliator", p: "Sonic pulses loosen dead-skin build-up so everything after it actually sinks in.", how: ["60 seconds", "3× a week", "With cleanser"] },
      { id: "super-c-serum", t: "Treat", h: "Super C Serum", p: "Antioxidant Vitamin C brightens, firms and defends against the day. Your morning glow, in three drops.", how: ["2–3 drops", "Every morning", "Under SPF"] },
      { id: "holy-basil-day-night-cream", t: "Moisturise", h: "Holy Basil Day & Night Cream", p: "Holy Basil and Niacinamide lock in hydration and calm the skin barrier — then SPF on top.", how: ["Pea-size", "AM & PM", "Last step"] }
    ],
    pm: [
      { id: "nusonic-facial-exfoliator", t: "Prep", h: "NuSonic Facial Exfoliator", p: "Wash off the day properly. Clean skin means your night active can do its job.", how: ["60 seconds", "3× a week", "With cleanser"] },
      { id: "advanced-retinol-serum", t: "Treat", h: "Advanced Retinol Serum", p: "Vitamin A renews skin overnight for smoother texture, fewer breakouts and a more radiant morning.", how: ["Pea-size", "2–3 nights to start", "Never with Vit C"] },
      { id: "holy-basil-day-night-cream", t: "Moisturise", h: "Holy Basil Day & Night Cream", p: "Seal it all in. Holy Basil soothes while you sleep, so retinol stays comfortable.", how: ["Pea-size", "AM & PM", "Last step"] }
    ]
  };
  let mode = "am";
  const proto = $("#protocol");
  const renderProto = () => {
    const steps = PROTO[mode];
    $("#protoImgs").innerHTML = steps.map((s, i) => `<img src="${P[s.id].img}" alt="" data-i="${i}" class="${i === 0 ? "on" : ""}" loading="lazy">`).join("");
    $("#protoSteps").innerHTML = steps.map((s, i) => `<li class="pstep ${i === 0 ? "on" : ""}" data-i="${i}">
      <img class="pstep__m" src="${P[s.id].img}" alt="" loading="lazy">
      <span class="pstep__n">Step 0${i + 1}</span><h3>${s.t}</h3><h4>${s.h}</h4><p>${s.p}</p>
      <div class="pstep__how">${s.how.map(x => `<span>${x}</span>`).join("")}</div>
      <div class="pstep__buy"><button class="btn btn--line" data-add="${s.id}">Add · ${money(P[s.id].price)}</button><button class="btn--link" data-qv="${s.id}" style="text-decoration:underline;text-underline-offset:3px;font-size:.88rem">Details</button></div></li>`).join("");
    const ids = steps.map(s => s.id), sum = ids.reduce((a, id) => a + P[id].price, 0);
    $("#bundleImgs").innerHTML = ids.map(id => `<span><img src="${P[id].img}" alt=""></span>`).join("");
    $("#bundleTitle").textContent = mode === "am" ? "The Morning Protocol" : "The Night Protocol";
    $("#bundleItems").textContent = ids.map(id => P[id].name.replace(" Facial Exfoliator", "").replace(" Day & Night", "")).join(" + ");
    $("#bundleWas").textContent = money(sum); $("#bundleNow").textContent = money(sum * .85);
    $("#bundleAdd").textContent = `Add the protocol · save ${money(sum * .15)}`;
    observeSteps();
  };
  let stepObs;
  const observeSteps = () => {
    if (stepObs) stepObs.disconnect();
    stepObs = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const i = +e.target.dataset.i;
      $$(".pstep").forEach(s => s.classList.toggle("on", +s.dataset.i === i));
      $$("#protoImgs img").forEach(m => m.classList.toggle("on", +m.dataset.i === i));
      $("#protoNum").textContent = "0" + (i + 1);
    }), { rootMargin: "-45% 0px -45% 0px" });
    $$(".pstep").forEach(s => stepObs.observe(s));
  };
  $$(".ampm button").forEach(b => b.addEventListener("click", () => {
    mode = b.dataset.mode; proto.dataset.mode = mode;
    $$(".ampm button").forEach(x => x.setAttribute("aria-pressed", x === b));
    renderProto();
  }));
  $("#bundleAdd").addEventListener("click", () => { PROTO[mode].forEach(s => addToBag(s.id, 1, .15)); openBag(); });
  renderProto();

  /* =========================================================
     PROOF — swipeable review stack
     ========================================================= */
  const REV = [
    { n: "Emily K", p: "super-c-serum", t: "I've been really wanting a good brightening serum and this new Super C Serum came out at the perfect time. It's really lightweight and feels amazing on my skin.", real: true },
    { n: "Sarah M.", p: "holy-basil-day-night-cream", t: "I have reactive skin and most creams sting. This one doesn’t — and it lasts all day without feeling heavy." },
    { n: "Jess T.", p: "advanced-retinol-serum", t: "Started 2 nights a week like the card said. A month in, my foundation sits so much smoother." },
    { n: "Priya R.", p: "nusonic-facial-exfoliator", t: "Tiny but mighty. My serums actually sink in now — and it’s waterproof, so it lives in my shower." },
    { n: "Olivia W.", p: "hyaluronic-acid-serum", t: "Dewy, not sticky. Under the Day & Night Cream my skin stays plump through a full air-con office day." },
    { n: "Hannah L.", p: "holy-basil-hair-serum", t: "With the NuBrush my scalp feels amazing and my hair looks so much shinier. Smells like a spa." }
  ];
  let si = 0;
  $("#stackCards").innerHTML = REV.map((r, i) => `<article class="rcard" data-i="${i}">
    <div class="rcard__top"><span class="stars">★★★★★</span><span class="verified">✓ Verified buyer</span>${r.real ? "" : '<span class="sample">Sample</span>'}</div>
    <p class="rcard__q">“${r.t}”</p>
    <div class="rcard__who"><span class="av">${r.n[0]}</span><div><strong>${r.n}</strong><br><small style="color:var(--muted)">Australia</small></div></div>
    <div class="rcard__prod"><img src="${P[r.p].img}" alt="" loading="lazy"><div><small style="color:var(--muted)">Reviewed</small><br><strong>${P[r.p].name}</strong></div><button class="btn btn--dark" data-add="${r.p}">Add · ${money(P[r.p].price)}</button></div>
  </article>`).join("");
  const layoutStack = () => {
    $$(".rcard").forEach((c, i) => {
      const d = (i - si + REV.length) % REV.length;
      c.style.zIndex = REV.length - d;
      c.style.opacity = d > 2 ? 0 : 1;
      c.style.pointerEvents = d === 0 ? "auto" : "none";
      c.style.transform = `translate(${d * 16}px, ${d * 16}px) rotate(${d * 2.5}deg) scale(${1 - d * .04})`;
    });
    $("#stackPos").textContent = `${si + 1} / ${REV.length}`;
  };
  const stackGo = dir => { si = (si + dir + REV.length) % REV.length; layoutStack(); };
  $("#stackNext").addEventListener("click", () => stackGo(1));
  $("#stackPrev").addEventListener("click", () => stackGo(-1));
  layoutStack();
  // drag / swipe
  let sx = null, card = null;
  $("#stackCards").addEventListener("pointerdown", e => { if (e.target.closest("button")) return; card = e.target.closest(".rcard"); if (!card) return; sx = e.clientX; card.style.transition = "none"; });
  addEventListener("pointermove", e => { if (sx === null || !card) return; const dx = e.clientX - sx; card.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`; });
  addEventListener("pointerup", e => { if (sx === null || !card) return; const dx = e.clientX - sx; card.style.transition = ""; sx = null; card = null; if (Math.abs(dx) > 80) stackGo(dx < 0 ? 1 : -1); else layoutStack(); });

  /* =========================================================
     INGREDIENT LAB — periodic table
     ========================================================= */
  const ING = [
    { s: "Vc", n: "Vitamin C", no: "01", tone: "#f8dcc6", aka: "Ascorbic acid derivative · antioxidant", b: ["Brightens dull skin and evens tone", "Defends against daily environmental stress", "Supports the look of firmer skin"], p: "super-c-serum" },
    { s: "Ra", n: "Retinol", no: "02", tone: "#dfe6f1", aka: "Retinyl Palmitate · Vitamin A", b: ["Speeds up natural skin renewal", "Smooths texture and fine lines", "Helps keep pores clear"], p: "advanced-retinol-serum" },
    { s: "Ha", n: "Hyaluronic Acid", no: "03", tone: "#d6e9ee", aka: "Humectant · holds up to 1000× its weight in water", b: ["Instant plumping hydration", "Suits every skin type", "Layers under any moisturiser"], p: "hyaluronic-acid-serum" },
    { s: "Hb", n: "Holy Basil", no: "04", tone: "#d7e3d2", aka: "Tulsi · sacred Ayurvedic botanical", b: ["Rich in antioxidants", "Soothes the look of redness", "Used in skin & hair rituals for centuries"], p: "holy-basil-day-night-cream" },
    { s: "Nc", n: "Niacinamide", no: "05", tone: "#efe4f1", aka: "Vitamin B3", b: ["Strengthens the skin barrier", "Helps balance oil", "Visibly refines pores"], p: "holy-basil-day-night-cream" },
    { s: "B5", n: "Panthenol", no: "06", tone: "#f3ecd5", aka: "Pro-Vitamin B5", b: ["Soothes and comforts", "Supports barrier repair", "Boosts hydration"], p: "hyaluronic-acid-serum" },
    { s: "Ve", n: "Vitamin E", no: "07", tone: "#f6e1d3", aka: "Tocopherol · antioxidant", b: ["Partners with Vitamin C", "Nourishes and softens", "Protects skin lipids"], p: "super-c-serum" },
    { s: "Kp", n: "Kakadu Plum", no: "08", tone: "#e3ecc9", aka: "Native Australian superfruit", b: ["One of nature’s richest Vitamin C sources", "Brightening antioxidant power", "Featured in Glow by Dr Tanya"], p: "super-c-serum" }
  ];
  $("#ptable").innerHTML = ING.map((x, i) => `<button class="el" role="tab" aria-selected="${i === 0}" data-i="${i}" style="--tone:${x.tone}"><span class="el__no">${x.no}</span><span class="el__sym">${x.s}</span><span class="el__name">${x.n}</span></button>`).join("");
  const showIng = i => {
    const x = ING[i], p = P[x.p], pan = $("#labPanel");
    pan.dataset.sym = x.s;
    pan.innerHTML = `<div class="fadein"><h3>${x.n}</h3><p class="lab__aka">${x.aka}</p><ul>${x.b.map(b => `<li>${b}</li>`).join("")}</ul></div>
      <div class="lab__prod fadein"><img src="${p.img}" alt="" loading="lazy"><div><small>Find it in</small><strong>${p.name}</strong></div><button class="btn btn--pink" data-add="${x.p}">Add · ${money(p.price)}</button></div>`;
  };
  $("#ptable").addEventListener("click", e => { const b = e.target.closest(".el"); if (!b) return; $$(".el").forEach(x => x.setAttribute("aria-selected", x === b)); showIng(+b.dataset.i); });
  showIng(0);

  /* ---------- Review wall ---------- */
  const WALL = [
    ["Finally a routine I stick to", "Three steps, done. My skin has never been this consistent.", "holy-basil-day-night-cream"],
    ["Brightest my skin has looked", "Super C every morning and people keep asking what I changed.", "super-c-serum"],
    ["Gentle retinol, real results", "No peeling, no drama — just smoother skin after a month.", "advanced-retinol-serum"],
    ["My dry skin’s best friend", "Drinks it up. My makeup doesn’t cling to flaky bits anymore.", "hyaluronic-acid-serum"],
    ["Obsessed with the NuSonic", "Feels like a facial at home. Tiny, waterproof, love it.", "nusonic-facial-exfoliator"],
    ["Hair feels thicker", "Scalp massage with the serum is my new nightly ritual.", "nubrush"],
    ["Smells divine", "The Holy Basil conditioner leaves my hair so soft.", "holy-basil-conditioner"],
    ["Trust a doctor-made brand", "Love that it’s honest, no BS claims. Just works.", "super-c-serum"]
  ];
  const wcard = w => `<article class="wcard"><span class="stars">★★★★★</span><h4>${w[0]}</h4><p>${w[1]}</p><div class="wcard__f"><img src="${P[w[2]].img}" alt="" loading="lazy">${P[w[2]].name}<span class="sample">Sample</span></div></article>`;
  const half = WALL.slice(0, 4), half2 = WALL.slice(4);
  $("#wallA").innerHTML = [...half, ...half2, ...half, ...half2].map(wcard).join("");
  $("#wallB").innerHTML = [...half2, ...half, ...half2, ...half].map(wcard).join("");

  /* =========================================================
     BAG
     ========================================================= */
  let bag = [];
  try { bag = JSON.parse(localStorage.getItem("drt-bag2") || "[]").filter(l => P[l.id]); } catch (e) { bag = []; }
  const saveBag = () => { try { localStorage.setItem("drt-bag2", JSON.stringify(bag)); } catch (e) {} };
  const lineTot = l => P[l.id].price * l.qty * (1 - (l.disc || 0));
  function addToBag(id, qty = 1, disc = 0) {
    if (!P[id] || P[id].soldOut) return;
    const l = bag.find(x => x.id === id && (x.disc || 0) === disc);
    if (l) l.qty += qty; else bag.push({ id, qty, disc });
    saveBag(); renderBag();
    const n = $("#bagN"); n.classList.add("bump"); setTimeout(() => n.classList.remove("bump"), 350);
  }
  const renderBag = () => {
    const count = bag.reduce((a, l) => a + l.qty, 0), tot = bag.reduce((a, l) => a + lineTot(l), 0), left = FREE_SHIP - tot;
    $("#bagN").textContent = count; $("#bagCount").textContent = count ? `(${count})` : "";
    $("#shipMsg").innerHTML = left > 0 ? `You’re <strong>${money(left)}</strong> away from <strong>free shipping</strong>` : `🎉 Free shipping unlocked — nice one.`;
    const pct = Math.min(100, tot / FREE_SHIP * 100);
    $("#shipFill").style.width = pct + "%"; $(".ship__truck").style.left = `calc(${pct}% )`;
    $("#bagTotal").textContent = money(tot);
    $("#bagAfterpay").textContent = `or 4 interest-free payments of ${money(tot / 4)} with Afterpay`;
    $("#checkout").disabled = !count;
    $("#bagItems").innerHTML = count ? bag.map((l, i) => { const p = P[l.id]; return `<li><span class="mini__img" style="--tone:${p.tone}"><img src="${p.img}" alt=""></span><div><strong>${p.name}</strong>
      ${l.disc ? `<span class="disc">Protocol bundle · ${Math.round(l.disc * 100)}% off</span>` : `<small style="color:var(--muted)">${p.ben}</small>`}
      <div class="qty"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="${i}" data-d="1" aria-label="Increase">+</button></div></div><strong>${money(lineTot(l))}</strong></li>`; }).join("")
      : `<li class="empty">Your bag is empty.<br><button class="btn btn--dark" data-open-quiz>℞ Get my skin prescription</button></li>`;
    const has = new Set(bag.map(l => l.id));
    const ups = SHOP.concat("super-c-serum").filter(id => !has.has(id) && !P[id].soldOut)
      .sort((a, b) => left > 0 ? Math.abs(P[a].price - left) - Math.abs(P[b].price - left) : P[b].rating - P[a].rating).slice(0, 2);
    $("#ups").innerHTML = count ? `<h4>${left > 0 ? "Pairs perfectly — and unlocks free shipping" : "Complete your protocol"}</h4>${ups.map(id => miniHTML(id)).join("")}` : "";
  };
  $("#bagItems").addEventListener("click", e => { const b = e.target.closest("[data-q]"); if (!b) return; const l = bag[+b.dataset.q]; l.qty += +b.dataset.d; if (l.qty <= 0) bag.splice(+b.dataset.q, 1); saveBag(); renderBag(); });
  const openBag = () => { $("#drawer").hidden = false; lock(true); };
  const closeBag = () => { $("#drawer").hidden = true; lock(false); };
  $("#bagBtn").addEventListener("click", openBag);
  $("#checkout").addEventListener("click", () => toast("Prototype: continues to Shopify checkout (Shop Pay, Afterpay, Apple Pay)"));
  renderBag();

  /* ---------- Quick view ---------- */
  const openQV = id => {
    const p = P[id];
    $("#qvBody").innerHTML = `<div class="qv"><div class="qv__img" style="--tone:${p.tone}"><img src="${p.img}" alt="${p.name}"></div><div>
      <span class="pc__ben">${p.ben}</span><h3>${p.name}</h3><div class="pc__rate"><span class="stars">★★★★★</span> ${p.rating} · ${p.rev} reviews</div>
      <div class="qv__price">${money(p.price)}</div><p class="fine">or 4 interest-free payments of ${money(p.price / 4)} with Afterpay</p>
      <p style="margin-top:14px">${p.desc}</p><ul>${p.bul.map(b => `<li>${b}</li>`).join("")}</ul>
      <p class="hand" style="font-size:1.3rem;color:var(--green)">℞ ${p.dir}</p>
      ${p.soldOut ? `<button class="btn btn--line btn--block" data-notify>Notify me when it’s back</button>` : `<button class="btn btn--dark btn--xl btn--block" data-add="${id}" data-close-qv>Add to bag · ${money(p.price)}</button>`}
      <p class="fine center">Free AU shipping over $79 · 30-day skin promise</p></div></div>`;
    $("#qv").hidden = false; lock(true);
  };
  const closeQV = () => { $("#qv").hidden = true; lock(false); };

  /* =========================================================
     QUIZ → personal prescription
     ========================================================= */
  const QZ = [
    { q: "What’s your #1 concern right now?", s: "Pick the one that bothers you most.", k: "goal", o: [["acne", "🔴", "Breakouts", "Spots, congestion"], ["pigmentation", "✨", "Dullness & spots", "Uneven tone"], ["dry", "💧", "Dryness", "Tight, flaky, dehydrated"], ["sensitive", "🌿", "Sensitivity", "Redness, reactive"], ["hair", "💆‍♀️", "Hair & scalp", "Thinning, dull hair"]] },
    { q: "By midday, your skin feels…", s: "No judgement — this tunes your directions.", k: "type", o: [["oily", "🫧", "Shiny", "Especially the T-zone"], ["dry", "🏜️", "Tight", "Wants more moisture"], ["combo", "☯️", "Bit of both", "Oily T, dry cheeks"], ["normal", "😌", "Comfortable", "Pretty balanced"]] },
    { q: "How many steps will you actually do?", s: "Dr Tanya’s rule: the routine you’ll do beats the perfect one you won’t.", k: "steps", o: [["2", "⚡", "Keep it minimal", "2 steps · save 10%"], ["3", "℞", "The full protocol", "3 steps · save 15% (recommended)"]] }
  ];
  const discFor = n => n >= 3 ? .15 : n === 2 ? .10 : 0;
  let qi = 0; const ans = {};
  const renderQuiz = () => {
    $("#quizFill").style.width = (qi / QZ.length * 100) + "%";
    if (qi < QZ.length) {
      const q = QZ[qi];
      $("#quizBody").innerHTML = `<p class="kick"><span>${qi + 1}/${QZ.length}</span> Your skin consult</p><h3 id="quizTitle">${q.q}</h3><p class="lead">${q.s}</p>
        <div class="qopts">${q.o.map(o => `<button data-a="${o[0]}"><span class="em">${o[1]}</span>${o[2]}<small>${o[3]}</small></button>`).join("")}</div>
        ${qi ? '<button class="back" data-back>← Back</button>' : ""}`;
      return;
    }
    const c = CON.find(x => x.k === ans.goal);
    let ids = c.ids.filter(id => !P[id].soldOut);
    if (ans.goal !== "hair" && !ids.includes("holy-basil-day-night-cream")) ids.push("holy-basil-day-night-cream");
    if (ans.steps === "3" && ids.length < 3) ids.unshift(ans.goal === "sensitive" ? "super-c-serum" : "nusonic-facial-exfoliator");
    ids = ids.slice(0, +ans.steps);
    const sum = ids.reduce((a, id) => a + P[id].price, 0), d = discFor(ids.length);
    const typeNote = { oily: "Lightweight layers — a little goes a long way.", dry: "Apply serums on damp skin and don’t skimp on cream.", combo: "Cream on cheeks, lighter on the T-zone.", normal: "Lucky you — keep it consistent." }[ans.type];
    $("#quizBody").innerHTML = `<p class="kick"><span>℞</span> Your prescription is ready</p><h3 id="quizTitle">Your ${c.t.replace(/<[^>]+>/g, "").toLowerCase()} routine</h3>
      <div class="rxres"><div class="rxres__top"><img src="images/logo.png" alt="By Dr Tanya"><span>Skin prescription · ${new Date().toLocaleDateString("en-AU")}</span></div>
      ${ids.map(id => `${miniHTML(id, "", P[id].ben)}<span class="rxres__dir">↳ ${P[id].dir}</span>`).join("")}
      <span class="rxres__dir" style="margin-top:8px">✎ ${typeNote}</span>
      <div class="rxres__sig"><span class="hand">Dr Tanya</span><span class="stamp" style="opacity:.9;transform:rotate(-10deg)">Doctor<br>approved</span></div></div>
      <div class="price-line"><span class="pill pill--pink">${Math.round(d * 100)}% off</span><strong>${money(sum * (1 - d))}</strong><s>${money(sum)}</s><small class="fine" style="margin:0">or 4 × ${money(sum * (1 - d) / 4)}</small></div>
      <button class="btn btn--pink btn--xl btn--block" data-add-rx="${ids.join(",")}">Add my prescription · save ${money(sum * d)}</button>
      <p class="fine center">Free AU shipping over $79 · 30-day skin promise</p><button class="back" data-restart>Retake consult</button>`;
    $("#quizFill").style.width = "100%";
  };
  $("#quizBody").addEventListener("click", e => {
    const a = e.target.closest("[data-a]");
    if (a) { ans[QZ[qi].k] = a.dataset.a; qi++; renderQuiz(); return; }
    if (e.target.closest("[data-back]")) { qi--; renderQuiz(); return; }
    if (e.target.closest("[data-restart]")) { qi = 0; renderQuiz(); return; }
    const r = e.target.closest("[data-add-rx]");
    if (r) { const ids = r.dataset.addRx.split(","); ids.forEach(id => addToBag(id, 1, discFor(ids.length))); closeQuiz(); openBag(); }
  });
  const openQuiz = () => { qi = 0; renderQuiz(); $("#quiz").hidden = false; lock(true); };
  const closeQuiz = () => { $("#quiz").hidden = true; lock(false); };

  /* ---------- Search ---------- */
  const sIn = $("#searchIn");
  const openSearch = () => { $("#search").hidden = false; lock(true); setTimeout(() => sIn.focus(), 50); };
  const closeSearch = () => { $("#search").hidden = true; lock(false); };
  $("#searchBtn").addEventListener("click", openSearch);
  const doSearch = q => {
    q = q.trim().toLowerCase();
    const hits = q ? Object.keys(P).filter(id => (P[id].name + " " + P[id].ben + " " + P[id].tags + " " + P[id].desc).toLowerCase().includes(q)) : [];
    $("#searchRes").innerHTML = hits.map(id => `<div data-qv="${id}">${miniHTML(id, "", money(P[id].price))}</div>`).join("") || (q ? `<p class="fine">No match — try the <button data-open-quiz style="text-decoration:underline">skin consult</button>.</p>` : "");
  };
  sIn.addEventListener("input", () => doSearch(sIn.value));
  $$(".search__chips button").forEach(b => b.addEventListener("click", () => { sIn.value = b.dataset.q; doSearch(b.dataset.q); }));
  $("#search").addEventListener("click", e => { if (e.target.id === "search") closeSearch(); });

  /* ---------- Mobile nav ---------- */
  const closeMnav = () => { $("#mnav").hidden = true; $("#burger").setAttribute("aria-expanded", "false"); lock(false); };
  $("#burger").addEventListener("click", () => { $("#mnav").hidden = false; $("#burger").setAttribute("aria-expanded", "true"); lock(true); });
  $("#mnav").addEventListener("click", e => { if (e.target.id === "mnav") closeMnav(); });

  /* ---------- Squad signup ---------- */
  $("#squadForm").addEventListener("submit", e => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#squadEmail").value.trim());
    $("#squadMsg").textContent = ok ? "Welcome to the Skin Squad! Your 15% code is on its way 💌" : "Please enter a valid email address.";
  });

  /* ---------- Global delegation ---------- */
  document.addEventListener("click", e => {
    const t = e.target;
    const add = t.closest("[data-add]");
    if (add) {
      const id = add.dataset.add; addToBag(id);
      if (add.classList.contains("pc__add")) { add.classList.add("done"); add.innerHTML = check + "<span>Added</span>"; setTimeout(() => { add.classList.remove("done"); add.innerHTML = plus + "<span>Add</span>"; }, 1500); }
      toast(`✓ ${P[id].name} added to your bag`);
      if (add.closest("#qv")) { closeQV(); openBag(); }
      return;
    }
    if (t.closest("[data-open-quiz]")) { e.preventDefault(); closeBag(); closeMnav(); closeSearch(); openQuiz(); return; }
    const qv = t.closest("[data-qv]");
    if (qv) { e.preventDefault(); closeSearch(); openQV(qv.dataset.qv); return; }
    if (t.closest("[data-close-bag]")) closeBag();
    if (t.closest("[data-close-quiz]")) closeQuiz();
    if (t.closest("[data-close-qv]")) closeQV();
    if (t.closest("[data-close-mnav]")) closeMnav();
    if (t.closest("[data-close-search]")) closeSearch();
    if (t.closest("[data-notify]")) toast("Prototype: opens a Klaviyo sign-up for this");
    const a = t.closest('a[href^="#"]');
    if (a && lenis && a.getAttribute("href").length > 1) { const el = $(a.getAttribute("href")); if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -90 }); } }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeBag(); closeQuiz(); closeQV(); closeMnav(); closeSearch(); }
    if (e.key === "Enter" && e.target.matches(".pc__media")) openQV(e.target.dataset.qv);
  });

  /* ---------- Header hide/show + sticky mobile bar ---------- */
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY, hdr = $("#hdr");
    hdr.classList.toggle("is-hidden", y > 400 && y > lastY && !$(".has-mega:hover"));
    lastY = y;
    const pastHero = hero.getBoundingClientRect().bottom < 60;
    const nearEnd = innerHeight + y > document.documentElement.scrollHeight - 700;
    $("#mbar").classList.toggle("show", pastHero && !nearEnd);
  };
  addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Reveal-on-view helpers (no GSAP needed) ---------- */
  const io = (sel, cls, opts = { threshold: .35 }) => { const o = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add(cls); o.unobserve(en.target); } }), opts); $$(sel).forEach(el => o.observe(el)); };
  io(".pad", "on"); io(".doc__sig", "on");
  const count = el => { const end = +el.dataset.count, t0 = performance.now(); const st = n => { const k = Math.min(1, (n - t0) / 1500); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(st); }; requestAnimationFrame(st); };
  const so = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { $$("[data-count]", en.target).forEach(reduce ? (x => x.textContent = x.dataset.count) : count); so.unobserve(en.target); } }), { threshold: .4 });
  so.observe($(".stats"));
  // scroll-lit manifesto: split into words
  const lit = $("#lit");
  lit.innerHTML = lit.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(" ");
  const words = $$(".w", lit);
  const litScroll = () => { const r = lit.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .35))); const n = Math.round(p * words.length); words.forEach((w, i) => w.classList.toggle("on", i < n)); };
  addEventListener("scroll", litScroll, { passive: true }); litScroll();

  /* ---------- Custom cursor + magnetic buttons ---------- */
  if (fine && !reduce) {
    const cur = $("#cursor"), ct = $("#cursorT");
    let x = 0, y = 0, X = 0, Y = 0;
    addEventListener("mousemove", e => { x = e.clientX; y = e.clientY; cur.style.opacity = 1; });
    const tick = () => { X += (x - X) * .2; Y += (y - Y) * .2; cur.style.left = X + "px"; cur.style.top = Y + "px"; requestAnimationFrame(tick); }; tick();
    document.addEventListener("mouseover", e => { const c = e.target.closest("[data-cursor]"); cur.classList.toggle("big", !!c); ct.textContent = c ? c.dataset.cursor : ""; });
    $$(".rcard").forEach(c => c.dataset.cursor = "Drag");
    $$(".magnet").forEach(m => {
      m.addEventListener("mousemove", e => { const r = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`; });
      m.addEventListener("mouseleave", () => m.style.transform = "");
    });
  }

  /* =========================================================
     DESIGN NOTES — the "why" behind every section
     ========================================================= */
  const NOTES = {
    ticker: ["Announcement ticker", "Uses their own line “Just what the doctor ordered” and answers the 3 biggest buying doubts — shipping cost, payment and risk — before anyone scrolls.", ["15% first-order offer matches their current pop-up", "$79 threshold & 30-day promise are placeholders to confirm"], "↑ AOV · ↓ abandonment"],
    hero: ["Hero — a product stage, not a banner", "The current hero is a lifestyle banner with no product or price. This one puts the bestseller front and centre with its price and a 1-click Add, while the headline uses the brand’s own tagline.", ["4 ‘prescriptions’ rotate, each re-theming the whole hero — the range is shown without leaving the fold", "Two CTAs split traffic: buyers → Add to bag, unsure → 60-sec consult", "Rx label with Dr Tanya’s directions = doctor authority in one glance", "Rating, shipping & promise directly under the CTAs"], "↑ add-to-cart from hero · ↓ bounce"],
    pillars: ["Brand pillars + manifesto", "Keeps their 4 icons but adds the ‘why it matters’ line under each. The giant scroll-reactive marquee repeats the brand promise so it sticks.", ["Breaks the page into memorable chapters"], "Brand recall · trust"],
    concerns: ["Shop by concern — editorial list", "People shop skincare by problem. Each concern opens Dr Tanya’s note + her picks inline, with Add buttons — no collection page, no getting lost.", ["Adds Hair (a real category they sell)", "Hover preview image on desktop, thumbnails on mobile", "Quiz fallback in every panel"], "↑ product discovery · −2 clicks to cart"],
    shop: ["Bestseller bento", "The hero product gets a big tile with real before/after proof and a review; the rest sit on soft colour tiles like the current brand style — but every card now has rating, Afterpay price, ‘Prescribed for’ on hover and a quick-add.", ["Quick View on click — no page load", "Sold-out shampoo turns into ‘Notify me’ (captures demand)"], "↑ add-to-cart rate"],
    protocol: ["The Skin Doctor Protocol — bundle builder", "Turns their existing ‘Skin Doctor Protocol’ idea into the page’s biggest AOV lever. The product swaps as you scroll through 3 steps, and the Morning/Night switch re-themes the section.", ["Ends in a one-click bundle at 15% off", "Teaches the routine, which reduces ‘which one do I buy?’ paralysis", "Discount % is a suggestion — easy to set in Shopify bundles"], "↑ AOV · ↑ items per order"],
    proof: ["Proof — swipeable review stack", "Big outcome numbers + a tactile review deck you can swipe. Each review has the product and an Add button so proof converts straight away.", ["Only Emily K is a real review; others marked ‘Sample’", "Stats are placeholders for real trial data"], "↑ trust · ↑ conversion"],
    doctor: ["Meet Dr Tanya — the brand’s moat", "A real doctor founder is the strongest trust signal this brand has. Their organic sage curves frame it, the manifesto lights up word by word as you scroll, and a signature draws itself in.", ["Copy is a draft for Dr Tanya to personalise", "Two CTAs: learn the protocol, or get a prescription"], "↑ trust · ↑ time on page"],
    lab: ["Ingredient lab", "A ‘periodic table’ of actives makes the science feel premium and simple. Every element links straight to the product it’s in.", ["Kakadu Plum ties into the new Glow launch", "Great for SEO when built as Shopify metaobjects"], "↑ engagement · SEO"],
    glow: ["Glow launch moment", "Glow has a playful pink/orange identity, so it gets its own world instead of fighting the doctor-led hero. Their flower shapes become animated stickers.", ["‘Get launch access’ = email capture for the new line"], "New-range awareness"],
    rxcta: ["Free skin prescription", "The quiz is reframed as a free doctor’s consult. The prescription pad writes itself and gets stamped ‘Doctor approved’ — memorable, shareable, on-brand.", ["Result = personal Rx card with directions + bundle price", "Captures undecided visitors who would otherwise leave"], "↑ conversion of unsure visitors"],
    wall: ["Review wall", "Two moving rows of reviews create a feeling of volume and community (‘Skin Squad’, their own term).", ["Powered by Judge.me/Okendo on the live store", "All wall reviews here are samples"], "Social proof"],
    journal: ["Skin Journal", "Their real articles in an editorial grid. Content builds SEO authority and internal links to products.", ["Uses their real article images and titles"], "SEO · organic traffic"],
    faq: ["FAQ + risk reversal", "Answers the last objections (results timing, sensitivity, mixing actives, shipping, Afterpay) next to a 30-day promise seal.", ["Native accordion → FAQ schema for Google"], "↓ objections · ↓ support tickets"],
    squad: ["Skin Squad — 15% off", "Matches their current 15% offer, but inline instead of an instant pop-up that blocks the first impression.", ["Exit-intent pop-up can still run on the live site"], "↑ list growth · ↑ returning buyers"]
  };
  $$("[data-note]").forEach(sec => {
    const n = NOTES[sec.dataset.note]; if (!n) return;
    const d = document.createElement("aside"); d.className = "note";
    d.innerHTML = `<b><i>Why</i> ${n[0]}</b><p>${n[1]}</p><ul>${n[2].map(x => `<li>${x}</li>`).join("")}</ul><span class="kpi">Goal: ${n[3]}</span>`;
    sec.prepend(d);
  });
  const nb = $("#notesBtn");
  const setNotes = on => { document.body.classList.toggle("show-notes", on); nb.setAttribute("aria-pressed", on); $(".notes-btn__t").textContent = on ? "Hide design notes" : "Why this layout?"; if (window.ScrollTrigger) ScrollTrigger.refresh(); };
  nb.addEventListener("click", () => setNotes(!document.body.classList.contains("show-notes")));
  if (/[?&]notes/.test(location.search)) setNotes(true);

  /* =========================================================
     MOTION — GSAP + Lenis (progressive enhancement)
     ========================================================= */
  const initMotion = () => {
    if (window.Lenis && !reduce) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      if (window.gsap) { lenis.on("scroll", () => window.ScrollTrigger && ScrollTrigger.update()); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
      else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
    }
    if (!window.gsap || reduce) { heroIntro = null; return; }
    gsap.registerPlugin(ScrollTrigger);
    heroIntro = () => {
      gsap.from(".hero__h .ln>span", { yPercent: 110, rotate: 4, duration: 1.2, ease: "expo.out", stagger: .1 });
      gsap.from(".hero__rxno, .hero__sub, .hero__ctas, .hero__proof", { y: 24, opacity: 0, duration: .9, stagger: .08, delay: .3, ease: "power3.out" });
      gsap.from(".stage__disc", { scale: .6, opacity: 0, duration: 1.4, ease: "expo.out" });
      gsap.from("#stageImg", { y: 120, rotate: 10, opacity: 0, duration: 1.4, delay: .15, ease: "expo.out" });
      gsap.from(".chipf, .rxlabel", { scale: .6, opacity: 0, duration: .9, delay: .6, stagger: .1, ease: "back.out(1.7)" });
      gsap.from(".hero__switch button", { y: 30, opacity: 0, duration: .8, delay: .5, stagger: .06, ease: "power3.out" });
    };
    // hero scroll-out
    gsap.to(".hero__stage", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__copy", { yPercent: -10, opacity: .3, ease: "none", scrollTrigger: { trigger: ".hero", start: "center top", end: "bottom top", scrub: true } });
    // velocity marquee
    const mq = $("#bigMarq"); let mx = 0, vel = 0;
    ScrollTrigger.create({ trigger: ".pillars", start: "top bottom", end: "bottom top", onUpdate: s => { vel = s.getVelocity() / 300; } });
    gsap.ticker.add(() => { mx -= 1 + Math.abs(vel); vel *= .9; const w = mq.scrollWidth / 2; if (-mx > w) mx += w; mq.style.transform = `translateX(${mx}px)`; });
    mq.innerHTML += mq.innerHTML;
    // reveals
    const groups = [".pillar", ".shead", ".crow", "#bento > *", ".proto__head", ".bundle", ".stats li", ".stack", ".doc__photo", ".doc__copy > *", ".el", ".lab__panel", ".glow__copy > *", ".gp", ".rxcta__grid > div:first-child > *", ".pad", ".jcard", ".acc details", ".seal", ".squad__in > *"];
    groups.forEach(sel => {
      $$(sel).forEach(el => el.classList.add("rv"));
      ScrollTrigger.batch(sel, { start: "top 90%", once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1, stagger: .08, ease: "expo.out", overwrite: true }) });
    });
    gsap.fromTo(".doc__photo img", { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".doc", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(".gp--1", { yPercent: 10 }, { yPercent: -8, ease: "none", scrollTrigger: { trigger: ".glow", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(".gp--2", { yPercent: -6 }, { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".glow", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(".foot__word", { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".foot", start: "top bottom", end: "center bottom", scrub: true } });
    $$(".doc__curves path").forEach(p => { const l = p.getTotalLength(); gsap.fromTo(p, { strokeDasharray: l, strokeDashoffset: l }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".doc", start: "top 80%", end: "center center", scrub: true } }); });
  };

  const boot = () => {
    initMotion();
    onScroll();
    if (seen) { $("#loader").classList.add("gone"); endLoad(); }
    else setTimeout(endLoad, 1300);
  };
  if (document.readyState === "complete") boot(); else addEventListener("load", boot);
  // safety: never trap content behind the loader
  setTimeout(() => { if (document.body.classList.contains("is-loading")) endLoad(); }, 4000);
})();
