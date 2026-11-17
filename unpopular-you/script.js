/* =========================================================
   UNPOPULAR YOU — prototype script
   Shared data + header/footer/cart + page renderers + GSAP motion
   NOTE: prices, sizes, review counts and press quotes are
   placeholders to confirm with the client before launch.
   ========================================================= */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  const FREE_SHIP = 60;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const money = (n) => "$" + (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0);

  /* ---------------- Icons ---------------- */
  const I = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h12"/></svg>',
    close: '<svg viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:1.6;width:20px;height:20px"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8L12 2.8Z"/></svg>',
    nurse: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z"/><path d="M12 9v5M9.5 11.5h5"/></svg>',
    drop: '<svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9 14a3 3 0 0 0 3 3"/></svg>',
    users: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.6-5.5 6.5-5.5s5.5 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.8.7 3 2.4 3.5 5.2"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5.5c0 4.6 3 8.3 7 9.5 4-1.2 7-4.9 7-9.5V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    truck: '<svg viewBox="0 0 24 24"><path d="M2 6h12v10H2zM14 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7"/></svg>',
    tick: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6" fill="none"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5-13-7.5Z"/></svg>',
    sound: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    muted: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="m17 9 5 6M22 9l-5 6"/></svg>',
    return: '<svg viewBox="0 0 24 24"><path d="M4 10h11a5 5 0 0 1 0 10H9"/><path d="M8 6 4 10l4 4"/></svg>',
    leaf: '<svg viewBox="0 0 24 24"><path d="M5 19C5 10 11 5 20 4c0 9-5 15-14 15"/><path d="M5 19 13 11"/></svg>',
    ig: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5"/></svg>',
    tt: '<svg viewBox="0 0 24 24"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 3 2.5 5 5.5 5"/></svg>',
    fb: '<svg viewBox="0 0 24 24"><path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2V3Z"/></svg>',
  };
  const stars = (r, n) => `<span class="stars"><i aria-hidden="true">${I.star.repeat(5)}</i><span>${r.toFixed(1)}${n != null ? ` (${n})` : ""}</span><span class="sr-only">${r} out of 5 stars</span></span>`;

  /* ---------------- Product data ---------------- */
  const P = {
    cleanser: {
      id: "cleanser", step: "01", stepName: "Cleanse", name: "Maroon Silk Cleanser",
      sub: "A gentle cleanser that removes the day without disrupting your barrier.",
      price: 28, size: "120 ml / 4 fl oz", rating: 4.9, reviews: 3,
      concern: "Dryness + sensitivity", concerns: ["sensitive", "barrier"],
      sig: "Amino acids + colloidal oat",
      ingredients: [["Amino acid cleansers", "Korean-inspired", "Lift away sunscreen, oil and the day without the tight, squeaky feel."], ["Colloidal oat", "Barrier", "Calms and softens so skin feels comfortable straight after rinsing."], ["Glycerin", "Hydration", "Draws in water so skin is never left stripped."]],
      bullets: ["Cleanses without the tight, stripped feel", "Made for melanin-rich skin", "Fragrance-free and gentle on sensitive skin", "Amino acids + colloidal oat"],
      desc: "A silky, low-foam gel cleanser that melts away sunscreen, makeup and the day while leaving your moisture barrier exactly where it should be. The first step of a barrier-first routine: nothing harsh, nothing stripping, just clean, soft, comfortable skin.",
      how: ["Massage a small amount onto damp skin for 30–60 seconds.", "Rinse with lukewarm water and pat dry.", "Follow with Glow Ritual Rice Essence Toner. Use morning and night."],
      inci: "Full ingredient list to be supplied by Unpopular You.",
      imgs: ["images/cleanser-1.jpg", "images/cleanser-2.jpg", "images/cleanser-editorial.jpg", "images/morning-ritual-hero.jpg"],
      video: "video/cleanser-real-life.mp4",
    },
    toner: {
      id: "toner", step: "02", stepName: "Prep", name: "Glow Ritual Rice Essence Toner",
      sub: "A lightweight rice essence toner that preps and hydrates for a natural glow.",
      price: 34, size: "150 ml / 5.07 fl oz", rating: 4.9, reviews: 4, badge: "As seen in Blissim",
      concern: "Dull, dehydrated skin", concerns: ["glow", "barrier"],
      sig: "Rice ferment + ginseng",
      ingredients: [["Rice ferment filtrate", "Korean-inspired", "Softens and brightens the look of skin for a natural, lit-from-within glow."], ["Ginseng", "Korean-inspired", "Revives tired, stressed-looking skin."], ["Triple ceramides (NP, AP, EOP)", "Barrier", "Replenish the lipids your barrier is made of."], ["Peptide complex", "Support", "Helps skin look smoother and more resilient."], ["2% Niacinamide", "Tone", "Evens the look of tone and supports the barrier."]],
      bullets: ["Preps skin and boosts natural glow", "Made for melanin-rich skin", "Hydrating, never stripping", "Rice ferment, ginseng + 2% niacinamide"],
      desc: "A hydration bath for sensitive skin. This milky essence toner layers fermented rice, ginseng and 2% niacinamide with triple ceramides and peptides, so skin is prepped, plumped and glowing before your serum. Selected for the limited-edition Blissim Glow Up Beauty Box.",
      how: ["After cleansing, shake gently and pour a few drops into your palms.", "Press into face and neck — no cotton pad needed.", "Layer twice on drier days, then follow with Rooted Radiance Serum."],
      inci: "Full ingredient list to be supplied by Unpopular You.",
      imgs: ["images/toner-1.jpg", "images/toner-2.jpg", "images/blissim-product-listing.jpg", "images/ritual-out.jpg"],
    },
    serum: {
      id: "serum", step: "03", stepName: "Correct", name: "Rooted Radiance Brightening Serum",
      sub: "A brightening serum that targets the look of dark spots while it hydrates.",
      price: 42, size: "30 ml / 1 fl oz", rating: 4.9, reviews: 2, badge: "New formula",
      concern: "Dark spots + uneven tone", concerns: ["spots", "glow"],
      sig: "Tranexamic acid + 3% niacinamide",
      ingredients: [["Tranexamic acid", "Targeted", "Targets the look of dark spots and post-blemish marks without irritation."], ["3% Niacinamide", "Tone", "Evens the look of skin tone and refines texture."], ["Pumpkin enzyme", "Gentle resurfacing", "A soft enzyme that smooths and brightens without harsh acids."], ["Guava leaf", "Botanical", "An antioxidant-rich leaf for brighter, calmer-looking skin."], ["Adenosine", "Support", "Helps skin look smoother and more refreshed."]],
      bullets: ["Targets the look of dark spots and uneven tone", "Made for melanin-rich skin", "Gentle on sensitive skin", "Tranexamic acid, 3% niacinamide + guava leaf"],
      desc: "Our new and improved brightening step. Rooted Radiance pairs tranexamic acid and 3% niacinamide with a gentle pumpkin enzyme and guava leaf to target the look of dark spots and uneven tone — without the redness, peeling or sensitivity stronger actives can cause on melanin-rich skin.",
      how: ["After toner, apply 2–3 drops to face and neck.", "Start a few nights a week, then build to daily use.", "In the morning, always finish with broad-spectrum SPF."],
      inci: "Full ingredient list to be supplied by Unpopular You.",
      imgs: ["images/serum-1.jpg", "images/serum-2.jpg", "images/serum-3.jpg", "images/serum-box.jpg"],
      video: "video/serum-real-life.mp4",
    },
    moisturizer: {
      id: "moisturizer", step: "04", stepName: "Seal", name: "Soothing Barrier Moisturizer",
      sub: "A lightweight water cream that calms, hydrates and seals in your barrier.",
      price: 38, size: "50 ml / 1.7 fl oz", rating: 5.0, reviews: 3,
      concern: "Weak or stressed barrier", concerns: ["sensitive", "barrier"],
      sig: "Soursop leaf + triple ceramides",
      ingredients: [["Colloidal oatmeal", "Soothing", "Calms the look of redness and relieves dry, tight skin."], ["Moringa leaf extract", "Jamaican botanical", "Nutrient-rich and antioxidant, a staple of Jamaican plant care."], ["Soursop leaf extract", "Jamaican botanical", "A traditional Caribbean leaf used to soothe and comfort skin."], ["Triple ceramide complex (NP, AP, EOP)", "Barrier", "Seals in moisture and strengthens the skin barrier."]],
      bullets: ["Calms, hydrates and repairs the barrier", "Made for melanin-rich skin", "Soothing for sensitive, reactive skin", "Colloidal oat, soursop + triple ceramides"],
      desc: "The step that seals it all in. A cushiony water cream with colloidal oatmeal, Jamaican moringa and soursop leaf, and a triple ceramide complex — hydrating without heaviness, calming without clogging, and leaving your barrier stronger every day.",
      how: ["Warm a pea-sized amount between fingertips.", "Press over face and neck as the last step of your routine.", "Use morning (before SPF) and night."],
      inci: "Full ingredient list to be supplied by Unpopular You.",
      imgs: ["images/moisturizer-1.jpg", "images/moisturizer-2.jpg", "images/moisturizer-3.jpg", "images/handbag-editorial-hero.jpg"],
      video: "video/moisturizer-real-life.mp4",
    },
    "core-four": {
      id: "core-four", step: "01–04", stepName: "Full routine", name: "The Core Four Routine",
      sub: "The complete barrier-first routine: cleanse, prep, correct and seal.",
      price: 118, compare: 142, size: "4 full-size products", rating: 4.9, reviews: 12, badge: "Save $24",
      concern: "Dark spots + a stronger barrier", concerns: ["spots", "sensitive", "glow", "barrier"],
      sig: "Everything, in the right order",
      bullets: ["Targets the look of dark spots", "Made for melanin-rich skin", "Barrier-first, gentle on sensitive skin", "All 4 full-size steps, save $24"],
      desc: "Everything you need to target the look of dark spots and strengthen your barrier, in the order it's meant to be used. Four full-size, fragrance-free formulas that combine Jamaican botanicals with Korean-inspired gentleness — built to work together, morning and night.",
      how: ["01 Cleanse with Maroon Silk Cleanser.", "02 Prep with Glow Ritual Rice Essence Toner.", "03 Correct with Rooted Radiance Brightening Serum.", "04 Seal with Soothing Barrier Moisturizer — then SPF in the morning."],
      inci: "See each product page for full ingredient lists.",
      imgs: ["images/core-four-1.jpg", "images/morning-ritual-hero.jpg", "images/ritual-pouch.jpg", "images/travel-flatlay.jpg"],
      video: "video/core-four-real-life.mp4",
      bundle: ["cleanser", "toner", "serum", "moisturizer"],
    },
  };
  P["core-four"].ingredients = [["Rice ferment + ginseng", "Korean-inspired", "Glow and softness from the toner."], ["Tranexamic acid + niacinamide", "Targeted", "Dark-spot correction from the serum."], ["Soursop + moringa leaf", "Jamaican botanical", "Comfort and nourishment from the moisturizer."], ["Triple ceramides", "Barrier", "In the toner and moisturizer to seal it all in."]];
  const ROUTINE = ["cleanser", "toner", "serum", "moisturizer"];
  const url = (id) => `product.html?p=${id}`;

  /* ---------------- Reviews (placeholder — swap for real reviews) ---------------- */
  const REVIEWS = [
    { p: "serum", name: "Tasha", skin: "Hyperpigmentation", t: "I've tried so many brightening serums that left my skin red and peeling. This one actually works on my dark spots and my skin stays calm. My marks look so much softer." },
    { p: "toner", name: "Aaliyah", skin: "Dry, sensitive skin", t: "The toner feels like a drink of water for my face. No sting at all, and my skin has this soft glow by the end of the day." },
    { p: "moisturizer", name: "Renée", skin: "Sensitive, reactive", t: "Finally a moisturiser that doesn't break me out or feel greasy. My skin barrier feels so much stronger — no more tight, itchy patches." },
    { p: "core-four", name: "Kemi", skin: "Combination, acne-prone", t: "The full routine is so simple to follow. Two weeks in and my skin texture is smoother and my tone looks more even. I love that it's made for skin like mine." },
    { p: "cleanser", name: "Danielle", skin: "Oily, sensitive", t: "Gentle but it still gets everything off, even sunscreen. My face never feels stripped after." },
  ];

  /* ---------------- Cart ---------------- */
  const store = {
    get() { try { return JSON.parse(localStorage.getItem("uy_cart") || "[]"); } catch (e) { return this._m || []; } },
    set(v) { this._m = v; try { localStorage.setItem("uy_cart", JSON.stringify(v)); } catch (e) {} },
  };
  const cart = {
    items: store.get().filter((i) => P[i.id]),
    add(id, qty = 1) {
      const it = this.items.find((i) => i.id === id);
      if (it) it.qty += qty; else this.items.push({ id, qty });
      this.save();
    },
    setQty(id, q) {
      const it = this.items.find((i) => i.id === id);
      if (!it) return;
      it.qty = q;
      if (q <= 0) this.items = this.items.filter((i) => i.id !== id);
      this.save();
    },
    count() { return this.items.reduce((s, i) => s + i.qty, 0); },
    subtotal() { return this.items.reduce((s, i) => s + P[i.id].price * i.qty, 0); },
    savings() { return this.items.reduce((s, i) => s + ((P[i.id].compare || P[i.id].price) - P[i.id].price) * i.qty, 0); },
    owned() {
      const s = new Set();
      this.items.forEach((i) => (P[i.id].bundle ? P[i.id].bundle.forEach((b) => s.add(b)) : s.add(i.id)));
      return s;
    },
    save() { store.set(this.items); renderCart(); },
  };

  /* ---------------- Shared chrome ---------------- */
  const LOGO_PATHS = '<path d="M 155.59375 397.460938 L 155.59375 328.875 L 183.203125 328.875 L 183.203125 395.523438 C 183.203125 412.230469 190.941406 420.496094 203.605469 420.496094 C 215.386719 420.496094 224.707031 412.058594 224.707031 395.523438 L 224.707031 328.875 L 251.964844 328.875 L 251.964844 397.460938 C 251.964844 427.882812 231.566406 444.765625 203.605469 444.765625 C 173.355469 444.765625 155.59375 428.058594 155.59375 397.460938 "/><path d="M 372.773438 328.875 L 372.773438 442.65625 L 357.648438 442.65625 L 302.601562 379.523438 L 302.601562 442.480469 L 276.046875 442.480469 L 276.046875 328.523438 L 291.523438 328.523438 L 346.570312 391.65625 L 346.570312 328.875 Z M 372.773438 328.875 "/><path d="M 453.480469 368.617188 C 453.480469 358.945312 447.328125 352.617188 436.070312 352.617188 L 425.695312 352.617188 L 425.695312 384.445312 L 436.070312 384.445312 C 447.328125 384.445312 453.480469 378.464844 453.480469 368.617188 M 436.597656 408.1875 L 425.695312 408.363281 L 425.695312 442.480469 L 398.085938 442.480469 L 398.085938 328.875 L 436.773438 328.875 C 464.914062 328.875 480.035156 343.472656 480.210938 367.386719 C 480.390625 391.832031 464.738281 407.835938 436.597656 408.1875 "/><path d="M 581.148438 385.5 C 581.148438 365.804688 568.664062 351.03125 549.320312 351.03125 C 530.328125 351.03125 517.839844 365.804688 517.839844 385.5 C 517.839844 405.195312 530.328125 419.96875 549.320312 419.96875 C 568.664062 419.96875 581.148438 405.195312 581.148438 385.5 M 490.230469 385.5 C 490.230469 352.261719 515.027344 326.234375 549.320312 326.234375 C 585.898438 326.234375 608.757812 352.261719 608.757812 385.5 C 608.757812 418.738281 583.964844 444.765625 549.320312 444.765625 C 513.269531 444.765625 490.230469 418.738281 490.230469 385.5 "/><path d="M 682.789062 368.617188 C 682.789062 358.945312 676.632812 352.617188 665.375 352.617188 L 655 352.617188 L 655 384.445312 L 665.375 384.445312 C 676.632812 384.445312 682.789062 378.464844 682.789062 368.617188 M 665.90625 408.1875 L 655 408.363281 L 655 442.480469 L 627.390625 442.480469 L 627.390625 328.875 L 666.082031 328.875 C 694.21875 328.875 709.34375 343.472656 709.519531 367.386719 C 709.695312 391.832031 694.042969 407.835938 665.90625 408.1875 "/><path d="M 725.164062 397.460938 L 725.164062 328.875 L 752.773438 328.875 L 752.773438 395.523438 C 752.773438 412.230469 760.511719 420.496094 773.175781 420.496094 C 784.957031 420.496094 794.277344 412.058594 794.277344 395.523438 L 794.277344 328.875 L 821.535156 328.875 L 821.535156 397.460938 C 821.535156 427.882812 801.132812 444.765625 773.175781 444.765625 C 742.925781 444.765625 725.164062 428.058594 725.164062 397.460938 "/><path d="M 918.246094 416.980469 L 918.246094 442.480469 L 845.617188 442.480469 L 845.617188 328.875 L 873.226562 328.875 L 873.226562 416.980469 Z M 918.246094 416.980469 "/><path d="M 1086.566406 440.820312 L 1056.402344 440.820312 L 1041.191406 414.589844 L 1040.433594 413.285156 L 1035.230469 404.292969 L 1009.960938 360.644531 L 984.691406 404.292969 L 978.726562 414.589844 L 963.535156 440.820312 L 933.371094 440.820312 L 1001.003906 333.925781 L 1004.195312 328.867188 L 1015.742188 328.867188 L 1018.933594 333.925781 Z M 1086.566406 440.820312 "/><path d="M 1129.300781 380.050781 L 1136.863281 380.050781 C 1147.0625 380.050781 1153.746094 374.949219 1153.746094 366.15625 C 1153.746094 357.1875 1147.414062 351.558594 1137.214844 351.558594 L 1129.300781 351.558594 Z M 1134.929688 400.625 L 1129.300781 400.625 L 1129.300781 442.480469 L 1101.691406 442.480469 L 1101.691406 328.875 L 1140.03125 328.875 C 1165.527344 328.875 1181.179688 341.535156 1181.179688 363.164062 C 1181.179688 378.113281 1173.441406 389.898438 1161.308594 396.054688 L 1185.753906 442.480469 L 1155.503906 442.480469 Z M 1134.929688 400.625 "/><path d="M 1286.332031 396.054688 L 1286.332031 442.480469 L 1258.546875 442.480469 L 1258.546875 396.933594 L 1218.277344 328.875 L 1251.160156 328.875 L 1272.441406 369.144531 L 1293.71875 328.875 L 1326.078125 328.875 Z M 1286.332031 396.054688 "/><path d="M 1416.992188 385.5 C 1416.992188 365.804688 1404.507812 351.03125 1385.164062 351.03125 C 1366.167969 351.03125 1353.683594 365.804688 1353.683594 385.5 C 1353.683594 405.195312 1366.167969 419.96875 1385.164062 419.96875 C 1404.507812 419.96875 1416.992188 405.195312 1416.992188 385.5 M 1326.074219 385.5 C 1326.074219 352.261719 1350.871094 326.234375 1385.164062 326.234375 C 1421.742188 326.234375 1444.601562 352.261719 1444.601562 385.5 C 1444.601562 418.738281 1419.808594 444.765625 1385.164062 444.765625 C 1349.113281 444.765625 1326.074219 418.738281 1326.074219 385.5 "/><path d="M 1462.179688 397.460938 L 1462.179688 328.875 L 1489.789062 328.875 L 1489.789062 395.523438 C 1489.789062 412.230469 1497.527344 420.496094 1510.191406 420.496094 C 1521.972656 420.496094 1531.292969 412.058594 1531.292969 395.523438 L 1531.292969 328.875 L 1558.550781 328.875 L 1558.550781 397.460938 C 1558.550781 427.882812 1538.152344 444.765625 1510.191406 444.765625 C 1479.941406 444.765625 1462.179688 428.058594 1462.179688 397.460938 "/><path d="M 1018.933594 333.921875 L 1001.003906 333.921875 L 1004.195312 328.867188 L 1015.742188 328.867188 Z M 1018.933594 333.921875 "/><path d="M 1041.738281 414.589844 C 1036.734375 423.363281 1024.261719 427.660156 1009.980469 427.660156 L 1009.6875 427.660156 C 995.40625 427.660156 982.933594 423.363281 977.929688 414.589844 L 984.074219 404.292969 L 1035.59375 404.292969 Z M 1041.738281 414.589844 "/>';
  const LOGO = `<svg viewBox="150 322 1418 128" fill="currentColor" role="img" aria-label="Unpopular You">${LOGO_PATHS}</svg>`;
  function injectLogoSymbol() {}

  const page = document.body.dataset.page;
  function chrome() {
    const head = $("#chrome-top");
    if (head) head.innerHTML = `
      <a class="skip" href="#main">Skip to content</a>
      <div class="announce" role="region" aria-label="Announcements">
        <button class="announce__nav announce__nav--prev" aria-label="Previous announcement"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 6l-6 6 6 6"/></svg></button>
        <div class="announce__track" aria-live="polite">
          <p class="announce__msg is-on"><button type="button" data-signup>Sign up for 20% off your first order</button></p>
          <p class="announce__msg">Free US shipping on orders over $${FREE_SHIP}</p>
          <p class="announce__msg"><a href="product.html?p=toner">Our toner was featured in the Blissim Beauty Box</a></p>
        </div>
        <button class="announce__nav announce__nav--next" aria-label="Next announcement"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 6l6 6-6 6"/></svg></button>
      </div>
      <header class="header" id="header">
        <div class="wrap header__in">
          <div class="header__left" style="display:flex;align-items:center;gap:28px">
            <button class="icon-btn menu-btn" aria-label="Open menu" aria-controls="mnav" aria-expanded="false" data-open="mnav">${I.menu}</button>
            <nav class="header__nav" aria-label="Main">
              <a href="shop.html" ${page === "shop" ? 'aria-current="page"' : ""}>Shop all</a>
              <a href="index.html#routine">The routine</a>
              <a href="product.html?p=core-four">Core Four</a>
              <a href="index.html#story">Our story</a>
            </nav>
          </div>
          <a class="logo" href="index.html" aria-label="Unpopular You home">${LOGO}</a>
          <div class="header__icons">
            <a class="icon-btn hide-sm" href="#" aria-label="Search" onclick="return false">${I.search}</a>
            <a class="icon-btn hide-sm" href="#" aria-label="Account" onclick="return false">${I.user}</a>
            <button class="icon-btn" aria-label="Open cart" aria-controls="cart" data-open="cart" id="cartBtn">${I.bag}<span class="cart-count" data-count="0">0</span></button>
          </div>
        </div>
      </header>`;

    const foot = $("#chrome-bottom");
    if (foot) foot.innerHTML = `
      <footer class="footer">
        <div class="wrap">
          <div class="footer__top">
            <div class="news">
              <p class="eyebrow eyebrow--plain" style="color:var(--rose)">The Insider List</p>
              <h2>Get <span class="serif">20% off</span> your first order</h2>
              <p>Barrier-first tips from a nurse, early access to drops and your welcome code — straight to your inbox.</p>
              <form data-news novalidate>
                <label class="sr-only" for="news-email">Email address</label>
                <input id="news-email" type="email" placeholder="Your email address" required autocomplete="email">
                <button class="btn btn--rose" type="submit">Sign up</button>
              </form>
              <p class="news__ok" role="status">You're in. Check your inbox for your 20% code.</p>
              <div class="socials">
                <a href="#" aria-label="Instagram" onclick="return false">${I.ig}</a>
                <a href="#" aria-label="TikTok" onclick="return false">${I.tt}</a>
                <a href="#" aria-label="Facebook" onclick="return false">${I.fb}</a>
              </div>
            </div>
            <div><h3>Shop</h3><ul>
              <li><a href="shop.html">Shop all</a></li>
              <li><a href="product.html?p=core-four">The Core Four</a></li>
              ${ROUTINE.map((id) => `<li><a href="${url(id)}">${P[id].name.replace(/ (Rice Essence|Brightening)/, "")}</a></li>`).join("")}
            </ul></div>
            <div><h3>Learn</h3><ul>
              <li><a href="index.html#story">Our story</a></li>
              <li><a href="index.html#routine">Barrier First</a></li>
              <li><a href="index.html#faq">FAQ</a></li>
              <li><a href="#" onclick="return false">Ingredient glossary</a></li>
            </ul></div>
            <div><h3>Help</h3><ul>
              <li><a href="#" onclick="return false">Shipping</a></li>
              <li><a href="#" onclick="return false">Returns</a></li>
              <li><a href="#" onclick="return false">Contact us</a></li>
              <li><a href="#" onclick="return false">Track order</a></li>
            </ul></div>
          </div>
          <div class="footer__mark" aria-hidden="true">${LOGO}</div>
          <div class="footer__bottom">
            <span>© 2026 Unpopular You. Nurse-founded. Made for melanin-rich skin.</span>
            <span>Cruelty-free · Fragrance-free · Made in the USA</span>
          </div>
        </div>
      </footer>

      <div class="overlay" data-close></div>

      <aside class="drawer drawer--left" id="mnav" aria-label="Menu" aria-hidden="true">
        <div class="drawer__head"><a class="logo" href="index.html" aria-label="Home">${LOGO}</a><button class="icon-btn" data-close aria-label="Close menu">${I.close}</button></div>
        <div class="drawer__body"><div class="mnav">
          <div class="mnav__links">
            <a href="shop.html">Shop all <span>4 products</span></a>
            <a href="product.html?p=core-four">Bundles <span>Save $24</span></a>
          </div>
          <p class="eyebrow mnav__label">Build your routine</p>
          ${ROUTINE.map((id) => { const p = P[id]; return `
            <a class="mnav__prod" href="${url(id)}">
              <img src="${p.imgs[0]}" alt="" loading="lazy" width="64" height="76">
              <span><span class="step"><b>${p.step}</b>${p.stepName}</span><strong>${p.name}</strong><small>${p.sub}</small></span>
              <span>${money(p.price)}</span>
            </a>`; }).join("")}
          <a class="mnav__bundle" href="product.html?p=core-four">
            <span><strong>The Core Four Routine</strong><small>All 4 steps · <s>$142</s> $118</small></span>
            <span class="btn btn--primary btn--sm">Shop</span>
          </a>
          <div class="mnav__more"><a href="index.html#story">About us</a><a href="index.html#faq">Learn</a><a href="index.html#faq">FAQ</a></div>
          <p class="mnav__trust">${I.nurse}<span>Nurse-founded · Made for melanin-rich skin</span></p>
        </div></div>
      </aside>

      <aside class="drawer drawer--right" id="cart" aria-label="Your bag" aria-hidden="true">
        <div class="drawer__head"><h2>Your bag <span id="cartN" class="muted"></span></h2><button class="icon-btn" data-close aria-label="Close cart">${I.close}</button></div>
        <div class="cart__ship" id="cartShip"></div>
        <div class="drawer__body" id="cartBody"></div>
        <div class="cart__foot" id="cartFoot"></div>
      </aside>

      <div class="modal" id="signup" role="dialog" aria-modal="true" aria-labelledby="signupT" aria-hidden="true">
        <div class="modal__bg" data-close></div>
        <div class="modal__card">
          <button class="icon-btn modal__x" data-close aria-label="Close">${I.close}</button>
          <div class="modal__img"><img src="images/morning-ritual-hero.jpg" alt="The Core Four routine laid out on a tray" loading="lazy"></div>
          <div class="modal__body">
            <div class="modal__form">
              <p class="eyebrow">The Insider List</p>
              <h2 id="signupT">Take <span class="serif">20% off</span> your first order</h2>
              <p class="muted">Join for your welcome code, barrier-first skin tips from Shauna and first access to new drops.</p>
              <form data-modalform novalidate>
                <label class="sr-only" for="m-email">Email</label>
                <input class="field" id="m-email" type="email" placeholder="Email address" required autocomplete="email">
                <button class="btn btn--primary btn--block" type="submit">Unlock 20% off</button>
                <p class="tiny muted center" style="margin:4px 0 0">No spam. Unsubscribe anytime.</p>
              </form>
            </div>
            <div class="modal__ok" role="status">
              <p class="eyebrow eyebrow--plain">Welcome to the list</p>
              <h2>Here's your code</h2>
              <div class="code">GLOW20</div>
              <p class="muted small">Applied automatically at checkout.</p>
              <button class="btn btn--primary btn--block" data-close>Keep shopping</button>
            </div>
          </div>
        </div>
      </div>
      <div class="toast" id="toast" role="status" aria-live="polite">${I.check}<span></span></div>`;
  }

  /* ---------------- Drawers / modal ---------------- */
  let lastFocus = null;
  function open(id) {
    const el = document.getElementById(id);
    if (!el) return;
    closeAll(true);
    lastFocus = document.activeElement;
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    if (id !== "signup") $(".overlay").classList.add("is-open");
    document.body.classList.add("no-scroll");
    $$(`[data-open="${id}"]`).forEach((b) => b.setAttribute("aria-expanded", "true"));
    setTimeout(() => { const f = el.querySelector("input, button:not([disabled]), a[href]"); f && f.focus({ preventScroll: true }); }, 60);
    if (id === "mnav" && window.gsap && !reduce) {
      gsap.fromTo($$("#mnav .mnav__links a, #mnav .mnav__prod, #mnav .mnav__bundle"), { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: .6, stagger: .05, ease: "power3.out", delay: .15 });
    }
  }
  function closeAll(silent) {
    $$(".drawer.is-open, .modal.is-open").forEach((d) => { d.classList.remove("is-open"); d.setAttribute("aria-hidden", "true"); });
    $(".overlay") && $(".overlay").classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    $$("[data-open]").forEach((b) => b.setAttribute("aria-expanded", "false"));
    if (!silent && lastFocus) lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]");
    if (o) { e.preventDefault(); open(o.dataset.open); return; }
    if (e.target.closest("[data-close]")) { e.preventDefault(); closeAll(); return; }
    if (e.target.closest("[data-signup]")) { e.preventDefault(); open("signup"); return; }
    const add = e.target.closest("[data-add]");
    if (add) { e.preventDefault(); addToCart(add.dataset.add, +(add.dataset.qty || 1), add); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

  function toast(msg) {
    const t = $("#toast");
    if (!t) return;
    $("span", t).textContent = msg;
    t.classList.add("is-on");
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove("is-on"), 2600);
  }

  function addToCart(id, qty, btn) {
    if (!P[id]) return;
    cart.add(id, qty);
    if (btn) {
      const label = btn.innerHTML;
      btn.classList.add("is-added");
      btn.innerHTML = "Added ✓";
      setTimeout(() => { btn.classList.remove("is-added"); btn.innerHTML = label; }, 1500);
      flyToCart(btn, P[id].imgs[0]);
    }
    setTimeout(() => open("cart"), reduce ? 0 : 650);
  }
  function flyToCart(from, src) {
    const target = $("#cartBtn");
    if (!window.gsap || reduce || !target) return;
    const a = from.getBoundingClientRect(), b = target.getBoundingClientRect();
    const f = document.createElement("div");
    f.className = "fly";
    f.innerHTML = `<img src="${src}" alt="">`;
    f.style.left = a.left + a.width / 2 - 32 + "px";
    f.style.top = a.top + a.height / 2 - 39 + "px";
    document.body.appendChild(f);
    gsap.timeline({ onComplete: () => f.remove() })
      .to(f, { x: b.left + b.width / 2 - (a.left + a.width / 2), duration: .6, ease: "power2.in" }, 0)
      .to(f, { y: b.top + b.height / 2 - (a.top + a.height / 2), duration: .6, ease: "back.in(1.4)" }, 0)
      .to(f, { scale: .2, opacity: .3, borderRadius: 40, duration: .6, ease: "power2.in" }, 0)
      .fromTo(target, { scale: 1 }, { scale: 1.25, duration: .18, yoyo: true, repeat: 1, ease: "power2.out" }, .55);
  }

  function renderCart() {
    const n = cart.count();
    $$(".cart-count").forEach((c) => { c.textContent = n; c.dataset.count = n; });
    const body = $("#cartBody");
    if (!body) return;
    $("#cartN").textContent = n ? `(${n})` : "";
    const sub = cart.subtotal();
    const left = Math.max(0, FREE_SHIP - sub);
    $("#cartShip").innerHTML = `<p>${left > 0 ? `You're <strong>${money(left)}</strong> away from free shipping` : `<strong>You've unlocked free shipping</strong> 🎉`}</p><div class="progress" aria-hidden="true"><span style="width:${Math.min(100, (sub / FREE_SHIP) * 100)}%"></span></div>`;

    if (!n) {
      body.innerHTML = `<div class="cart__empty"><h3 class="h3">Your bag is empty</h3><p>Start with the full routine — it's the easiest way to see results.</p><a class="btn btn--primary" href="product.html?p=core-four">Shop the Core Four ${I.arrow}</a></div>${routineBlock()}`;
      $("#cartFoot").innerHTML = "";
      return;
    }
    body.innerHTML = `<div class="cart__items">${cart.items.map((i) => { const p = P[i.id]; return `
      <div class="citem">
        <img src="${p.imgs[0]}" alt="" width="78" height="96">
        <div>
          <span class="step"><b>${p.step}</b>${p.stepName}</span>
          <h4><a href="${url(p.id)}">${p.name}</a></h4>
          <small>${p.size}</small>
          <div><span class="qty"><button aria-label="Decrease quantity" data-q="${p.id}" data-d="-1">−</button><span>${i.qty}</span><button aria-label="Increase quantity" data-q="${p.id}" data-d="1">+</button></span><button class="citem__rm" data-q="${p.id}" data-d="rm">Remove</button></div>
        </div>
        <div class="citem__price">${p.compare ? `<s>${money(p.compare * i.qty)}</s>` : ""}${money(p.price * i.qty)}</div>
      </div>`; }).join("")}</div>${routineBlock()}`;
    const save = cart.savings();
    $("#cartFoot").innerHTML = `
      ${save ? `<div class="cart__save"><span>You're saving</span><span>${money(save)}</span></div>` : ""}
      <div class="cart__total"><span>Subtotal</span><strong>${money(sub)}</strong></div>
      <button class="btn btn--primary btn--block" onclick="alert('Prototype: this button goes to Shopify checkout.')">Secure checkout ${I.lock.replace("<svg", '<svg fill="none" stroke="currentColor" stroke-width="1.6"')}</button>
      <p class="cart__note">${I.return}30-day happiness guarantee · Taxes calculated at checkout</p>
      <div class="pay" aria-label="Accepted payments">${payIcons()}</div>`;
  }
  function payIcons() {
    return '<span class="vi">VISA</span><span class="mc">Mastercard</span><span class="ax">AMEX</span><span class="ap"> Pay</span><span class="sp">shop Pay</span><span class="pp">PayPal</span>';
  }
  function routineBlock() {
    const owned = cart.owned();
    const missing = ROUTINE.filter((id) => !owned.has(id));
    if (!missing.length) return `<div class="cart__routine"><h3>Your routine is complete</h3><p class="small muted" style="margin:0">All four steps — cleanse, prep, correct, seal. Your barrier thanks you.</p></div>`;
    return `<div class="cart__routine"><h3>Complete your routine</h3>${missing.map((id) => { const p = P[id]; return `
      <div class="mini"><img src="${p.imgs[0]}" alt="" width="56" height="66"><div><span class="step"><b>${p.step}</b>${p.stepName}</span><strong>${p.name}</strong><small>${money(p.price)}</small></div><button class="add-mini" data-add="${p.id}" aria-label="Add ${p.name}">+</button></div>`; }).join("")}</div>`;
  }
  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-q]");
    if (!q) return;
    const it = cart.items.find((i) => i.id === q.dataset.q);
    if (!it) return;
    cart.setQty(it.id, q.dataset.d === "rm" ? 0 : it.qty + +q.dataset.d);
  });

  /* ---------------- Forms ---------------- */
  document.addEventListener("submit", (e) => {
    const f = e.target;
    if (!f.matches("[data-news], [data-modalform]")) return;
    e.preventDefault();
    const inp = $("input[type=email]", f);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) { inp.focus(); inp.style.borderColor = "#c0392b"; toast("Please enter a valid email address"); return; }
    if (f.matches("[data-news]")) { f.style.display = "none"; f.nextElementSibling.style.display = "block"; }
    else { $(".modal__form").style.display = "none"; $(".modal__ok").style.display = "block"; }
  });

  /* ---------------- Announcement rotation (slow, 6s) ---------------- */
  function announce() {
    const msgs = $$(".announce__msg");
    if (!msgs.length) return;
    let i = 0, t;
    const go = (d) => {
      msgs[i].classList.remove("is-on"); msgs[i].classList.add("is-out");
      const old = msgs[i];
      setTimeout(() => old.classList.remove("is-out"), 600);
      i = (i + d + msgs.length) % msgs.length;
      msgs[i].classList.add("is-on");
    };
    const loop = () => { clearInterval(t); if (!reduce) t = setInterval(() => go(1), 6000); };
    $(".announce__nav--next").onclick = () => { go(1); loop(); };
    $(".announce__nav--prev").onclick = () => { go(-1); loop(); };
    $(".announce").addEventListener("mouseenter", () => clearInterval(t));
    $(".announce").addEventListener("mouseleave", loop);
    loop();
  }

  /* ---------------- Header hide/show ---------------- */
  function headerScroll() {
    const h = $("#header");
    let last = 0;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      h.classList.toggle("is-scrolled", y > 10);
      const hide = y > 400 && y > last && !document.body.classList.contains("no-scroll");
      h.classList.toggle("is-hidden", hide);
      const tools = $(".ctools");
      if (tools) tools.style.top = hide ? "0px" : "";
      last = y;
    }, { passive: true });
  }

  /* ---------------- Reusable bits ---------------- */
  function card(id, opts = {}) {
    const p = P[id];
    return `
      <article class="pcard" data-concerns="${p.concerns.join(" ")}" data-price="${p.price}" data-step="${p.step}" ${opts.reveal ? "data-reveal" : ""}>
        <a class="pcard__media" href="${url(id)}" aria-label="${p.name}">
          <img src="${p.imgs[0]}" alt="${p.name}" loading="lazy" width="1000" height="1250">
          <img class="alt" src="${p.imgs[1]}" alt="" loading="lazy" width="1000" height="1250">
          <span class="pcard__tags"><span class="step"><b>${p.step}</b>${p.stepName}</span>${p.badge ? `<span class="badge">${p.badge}</span>` : ""}</span>
        </a>
        <button class="btn btn--primary btn--block pcard__quick" data-add="${id}">Add to bag · ${money(p.price)}</button>
        <div class="pcard__body">
          ${stars(p.rating, p.reviews)}
          <h3 class="pcard__title"><a href="${url(id)}">${p.name}</a></h3>
          <p class="pcard__sub">${p.sub}</p>
          <div class="pcard__row">
            <span class="pcard__price">${p.compare ? `<s class="muted" style="margin-right:6px">${money(p.compare)}</s>` : ""}${money(p.price)}<small>${p.size.split(" / ")[0]}</small></span>
            <button class="btn btn--ghost btn--sm pcard__add" data-add="${id}">Add to bag</button>
          </div>
        </div>
      </article>`;
  }
  function accordions(root = document) {
    $$(".acc__btn", root).forEach((b) => {
      if (b._bound) return;
      b._bound = true;
      b.addEventListener("click", () => {
        const acc = b.closest(".acc");
        const openNow = !acc.classList.contains("is-open");
        if (b.closest("[data-single]")) $$(".acc.is-open", b.closest("[data-single]")).forEach((a) => { a.classList.remove("is-open"); $(".acc__btn", a).setAttribute("aria-expanded", "false"); });
        acc.classList.toggle("is-open", openNow);
        b.setAttribute("aria-expanded", openNow);
      });
    });
  }
  const acc = (q, a, isOpen) => `<div class="acc ${isOpen ? "is-open" : ""}"><button class="acc__btn" aria-expanded="${!!isOpen}">${q}<span class="acc__icon" aria-hidden="true"></span></button><div class="acc__panel"><div>${a}</div></div></div>`;

  function swipe(el, prev, next) {
    let x0 = null;
    el.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
      x0 = null;
    });
  }
  function railCtl(rail, prevB, nextB, prog) {
    const step = () => (rail.firstElementChild ? rail.firstElementChild.getBoundingClientRect().width + 20 : 300);
    prevB && (prevB.onclick = () => rail.scrollBy({ left: -step(), behavior: "smooth" }));
    nextB && (nextB.onclick = () => rail.scrollBy({ left: step(), behavior: "smooth" }));
    const upd = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const r = max > 0 ? rail.scrollLeft / max : 0;
      if (prog) { const vis = rail.clientWidth / rail.scrollWidth; prog.style.width = vis * 100 + "%"; prog.style.transform = `translateX(${(r * (1 - vis) / vis) * 100}%)`; }
      if (prevB) prevB.disabled = rail.scrollLeft < 5;
      if (nextB) nextB.disabled = rail.scrollLeft > max - 5;
    };
    rail.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    upd();
  }

  /* ---------------- Videos (tap to play, muted captions burned-in) ---------------- */
  function videos(root = document) {
    $$(".vcard", root).forEach((c) => {
      const v = $("video", c);
      const play = () => {
        $$(".vcard.is-playing").forEach((o) => { if (o !== c) { $("video", o).pause(); o.classList.remove("is-playing"); } });
        if (v.paused) { v.play(); c.classList.add("is-playing"); } else { v.pause(); c.classList.remove("is-playing"); }
      };
      $(".vcard__play", c).addEventListener("click", play);
      v.addEventListener("click", play);
      v.addEventListener("ended", () => c.classList.remove("is-playing"));
      const m = $(".vcard__mute", c);
      m.addEventListener("click", () => { v.muted = !v.muted; m.innerHTML = v.muted ? I.muted : I.sound; m.setAttribute("aria-label", v.muted ? "Unmute" : "Mute"); });
    });
  }
  const vcard = (id, src, poster, cap) => {
    const p = P[id];
    return `<div class="vcard" data-reveal>
      <div class="vcard__media">
        <video src="${src}" poster="${poster}" muted playsinline loop preload="none" aria-label="${cap}"></video>
        <button class="vcard__play" aria-label="Play video: ${cap}"><span>${I.play}</span></button>
        <button class="vcard__mute" aria-label="Unmute">${I.muted}</button>
        <p class="vcard__cap">${cap}</p>
      </div>
      <a class="vcard__prod" href="${url(id)}"><img src="${p.imgs[0]}" alt="" loading="lazy"><span><strong>${p.name}</strong><small>${money(p.price)} · ${stars(p.rating).replace(/<span class="sr-only">.*?<\/span>/, "")}</small></span><span class="link-u" style="font-size:.66rem">Shop</span></a>
    </div>`;
  };

  /* ================= HOME ================= */
  function home() {
    // Routine carousel
    const rail = $("#routineRail");
    if (rail) {
      rail.innerHTML = ROUTINE.map((id) => card(id, { reveal: true })).join("");
      railCtl(rail, $("#rPrev"), $("#rNext"), $("#rProg"));
    }

    // Routine map + concern filter
    const map = $("#map");
    if (map) {
      map.innerHTML = ROUTINE.map((id) => { const p = P[id]; return `
        <div class="mapcol" data-c="${p.concerns.join(" ")}" data-reveal>
          <span class="map__match">Start here</span>
          <div class="mapcol__top"><img src="${p.imgs[0]}" alt="" loading="lazy"><div><span class="step"><b>${p.step}</b>${p.stepName}</span><strong>${p.name}</strong></div></div>
          <dl><div><dt>Best for</dt><dd>${p.concern}</dd></div><div><dt>Signature ingredients</dt><dd>${p.sig}</dd></div><div><dt>When</dt><dd>${id === "serum" ? "PM, building to AM + PM" : "AM + PM"}</dd></div></dl>
          <a class="link-u" href="${url(id)}">View product</a>
        </div>`; }).join("");
      $$("#concerns .chip").forEach((c) => c.addEventListener("click", () => {
        $$("#concerns .chip").forEach((x) => { x.classList.toggle("is-on", x === c); x.setAttribute("aria-pressed", x === c); });
        const k = c.dataset.k;
        $$(".mapcol", map).forEach((m) => {
          const hit = k === "all" || m.dataset.c.includes(k);
          m.classList.toggle("is-dim", !hit);
          m.classList.toggle("is-match", k !== "all" && hit);
        });
        const rec = $("#mapRec");
        if (rec) rec.hidden = k === "all";
      }));
    }

    // UGC
    const ugc = $("#ugcRail");
    if (ugc) {
      ugc.innerHTML = [
        vcard("core-four", "video/core-four-real-life.mp4", "images/poster-core-four-real-life.jpg", "“And this is our Core Four” — the full relaunch routine"),
        vcard("serum", "video/serum-real-life.mp4", "images/poster-serum-real-life.jpg", "Our new and improved brightening serum"),
        vcard("cleanser", "video/cleanser-real-life.mp4", "images/poster-cleanser-real-life.jpg", "Unboxing the Maroon Silk Cleanser"),
        vcard("moisturizer", "video/moisturizer-real-life.mp4", "images/poster-moisturizer-real-life.jpg", "The barrier moisturizer, up close"),
      ].join("");
      videos(ugc);
      railCtl(ugc, $("#uPrev"), $("#uNext"));
    }

    // Reviews carousel
    const rs = $("#rvStage");
    if (rs) {
      rs.innerHTML = REVIEWS.map((r, k) => { const p = P[r.p]; return `
        <figure class="rv ${k === 0 ? "is-on" : ""}" aria-roledescription="slide" aria-label="Review ${k + 1} of ${REVIEWS.length}">
          ${stars(5).replace(/<span>5\.0<\/span>/, "")}
          <blockquote>“${r.t}”</blockquote>
          <figcaption class="rv__who"><b>${r.name}</b><span>· ${r.skin}</span><span class="rv__verified">${I.check}Verified buyer</span></figcaption>
          <a class="rv__prod" href="${url(p.id)}"><img src="${p.imgs[0]}" alt="" loading="lazy"><span><strong>${p.name}</strong><small>${money(p.price)}</small></span><span class="link-u" style="font-size:.66rem">Shop</span></a>
        </figure>`; }).join("");
      const slides = $$(".rv", rs);
      const dots = $("#rvDots");
      dots.innerHTML = slides.map((_, k) => `<button aria-label="Show review ${k + 1}" class="${k ? "" : "is-on"}"></button>`).join("");
      let i = 0;
      const show = (n) => {
        const prev = slides[i];
        i = (n + slides.length) % slides.length;
        slides.forEach((s, k) => s.classList.toggle("is-on", k === i));
        $$("button", dots).forEach((d, k) => d.classList.toggle("is-on", k === i));
        if (window.gsap && !reduce && prev !== slides[i]) gsap.fromTo(slides[i], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6, ease: "power3.out" });
      };
      $$("button", dots).forEach((d, k) => (d.onclick = () => show(k)));
      $("#rvPrev").onclick = () => show(i - 1);
      $("#rvNext").onclick = () => show(i + 1);
      swipe(rs, () => show(i - 1), () => show(i + 1));
    }

    // Press quotes (manual, swipeable)
    const ps = $("#pressStage");
    if (ps) {
      const qs = $$(".press__quote", ps), btns = $$(".press__logos button");
      let i = 0;
      const show = (n) => {
        i = (n + qs.length) % qs.length;
        qs.forEach((q, k) => q.classList.toggle("is-on", k === i));
        btns.forEach((b, k) => { b.classList.toggle("is-on", k === i); b.setAttribute("aria-selected", k === i); });
        if (window.gsap && !reduce) gsap.fromTo($("blockquote", qs[i]), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .7, ease: "power3.out" });
      };
      btns.forEach((b, k) => (b.onclick = () => show(k)));
      $("#pPrev").onclick = () => show(i - 1);
      $("#pNext").onclick = () => show(i + 1);
      swipe(ps, () => show(i - 1), () => show(i + 1));
    }
  }

  /* ================= COLLECTION ================= */
  function shop() {
    const g = $("#cgrid");
    if (!g) return;
    const b = P["core-four"];
    g.innerHTML = `
      <article class="bcard" data-concerns="${b.concerns.join(" ")}" data-price="${b.price}" data-step="00" data-reveal>
        <a class="bcard__media" href="${url(b.id)}"><img src="images/core-four-lineup.jpg" alt="The Core Four routine — all four products" loading="lazy"><span class="pcard__tags"><span class="badge">Most complete · Save $24</span></span></a>
        <div class="bcard__body">
          <p class="eyebrow">Bundle · Best value</p>
          <h2>${b.name}</h2>
          ${stars(b.rating, b.reviews)}
          <p class="muted" style="margin:0">Everything you need to target the look of dark spots and strengthen your barrier — in the order it's meant to be used.</p>
          <div class="bcard__steps">${ROUTINE.map((id) => `<span class="step"><b>${P[id].step}</b>${P[id].stepName}</span>`).join("")}</div>
          <div class="bcard__price"><strong>${money(b.price)}</strong><s>${money(b.compare)}</s><span class="small muted">Free shipping</span></div>
          <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn--primary" data-add="core-four">Add routine to bag</button><a class="btn btn--ghost" href="${url(b.id)}">Details</a></div>
        </div>
      </article>
      ${ROUTINE.map((id) => card(id, { reveal: true })).join("")}
      <div class="noresult" id="noresult"><p>No products match that concern yet. <button class="link-u" data-k="all">Show all</button></p></div>`;

    const chips = $$(".ctools .chip");
    const filter = (k) => {
      chips.forEach((c) => { c.classList.toggle("is-on", c.dataset.k === k); c.setAttribute("aria-pressed", c.dataset.k === k); });
      let shown = 0;
      $$(".pcard, .bcard", g).forEach((c) => { const hit = k === "all" || c.dataset.concerns.includes(k); c.classList.toggle("is-hidden", !hit); c.style.display = hit ? "" : "none"; if (hit) shown++; });
      $("#noresult").style.display = shown ? "none" : "block";
      $("#ccount").textContent = `${shown} ${shown === 1 ? "product" : "products"}`;
      if (window.gsap && !reduce) gsap.fromTo($$(".pcard:not(.is-hidden), .bcard:not(.is-hidden)", g), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .5, stagger: .06, ease: "power3.out" });
    };
    chips.forEach((c) => c.addEventListener("click", () => filter(c.dataset.k)));
    g.addEventListener("click", (e) => { const k = e.target.closest("[data-k]"); if (k) filter(k.dataset.k); });
    const params = new URLSearchParams(location.search);
    if (params.get("concern")) filter(params.get("concern"));
    $("#csort").addEventListener("change", (e) => {
      const v = e.target.value;
      const items = $$(".pcard", g);
      items.sort((a, z) => v === "low" ? a.dataset.price - z.dataset.price : v === "high" ? z.dataset.price - a.dataset.price : a.dataset.step.localeCompare(z.dataset.step));
      items.forEach((it) => g.insertBefore(it, $("#noresult")));
    });
  }

  /* ================= PRODUCT ================= */
  function pdp() {
    const id = new URLSearchParams(location.search).get("p");
    const p = P[id] || P.serum;
    const isB = !!p.bundle;
    document.title = `${p.name} | Unpopular You`;
    const md = $('meta[name="description"]');
    if (md) md.content = p.sub;

    // Gallery
    const main = $("#gMain"), th = $("#gThumbs");
    main.innerHTML = `<span class="gallery__tags"><span class="step"><b>${p.step}</b>${p.stepName}</span>${p.badge ? `<span class="badge">${p.badge}</span>` : ""}</span><img id="gImg" src="${p.imgs[0]}" alt="${p.name}" width="1000" height="1250" fetchpriority="high"><span class="gallery__count" id="gCount">1 / ${p.imgs.length}</span>`;
    th.innerHTML = p.imgs.map((s, k) => `<button class="${k ? "" : "is-on"}" aria-label="View image ${k + 1}"><img src="${s}" alt="" loading="lazy"></button>`).join("");
    let gi = 0;
    const show = (n) => {
      gi = (n + p.imgs.length) % p.imgs.length;
      const img = $("#gImg");
      $$("button", th).forEach((b, k) => b.classList.toggle("is-on", k === gi));
      $("#gCount").textContent = `${gi + 1} / ${p.imgs.length}`;
      if (window.gsap && !reduce) gsap.to(img, { opacity: 0, duration: .2, onComplete: () => { img.src = p.imgs[gi]; gsap.fromTo(img, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: .6, ease: "power3.out" }); } });
      else img.src = p.imgs[gi];
    };
    $$("button", th).forEach((b, k) => (b.onclick = () => show(k)));
    swipe(main, () => show(gi - 1), () => show(gi + 1));

    // Buy box
    const bundleUp = !isB;
    $("#buy").innerHTML = `
      <div class="buy__rating">${stars(p.rating, p.reviews)}<a href="#reviews">Read reviews</a></div>
      <h1>${p.name}</h1>
      <p class="buy__sub">${p.sub}</p>
      <div class="buy__price"><strong id="bPrice">${money(p.price)}</strong>${p.compare ? `<s>${money(p.compare)}</s>` : ""}<span class="size">${p.size}</span></div>
      <ul class="ticks">${p.bullets.map((b) => `<li>${I.tick}<span>${b}</span></li>`).join("")}</ul>
      ${bundleUp ? `
      <div class="opts" role="radiogroup" aria-label="Purchase option">
        <label class="opt"><input type="radio" name="opt" value="${p.id}" checked><span><strong>Just the ${p.stepName.toLowerCase()} step</strong><small>${p.name}</small></span><span class="opt__price">${money(p.price)}</span></label>
        <label class="opt"><span class="opt__flag">Best value · Save $24</span><input type="radio" name="opt" value="core-four"><span><strong>The full Core Four routine</strong><small>All 4 steps incl. this ${p.stepName.toLowerCase()} — free shipping</small></span><span class="opt__price"><s>$142</s>$118</span></label>
      </div>` : `
      <div class="opts">${p.bundle.map((b) => `<div class="mini" style="margin:0"><img src="${P[b].imgs[0]}" alt=""><div><span class="step"><b>${P[b].step}</b>${P[b].stepName}</span><strong>${P[b].name}</strong><small>${P[b].size}</small></div><a class="link-u" style="font-size:.64rem" href="${url(b)}">View</a></div>`).join("")}</div>`}
      <div class="buy__row">
        <span class="qty"><button aria-label="Decrease quantity" id="qm">−</button><span id="qv">1</span><button aria-label="Increase quantity" id="qp">+</button></span>
        <button class="btn btn--primary" id="atc" data-add="${p.id}" data-qty="1">Add to bag · <span id="atcP">${money(p.price)}</span></button>
      </div>
      <div class="buy__micro"><span>${I.truck}Free US shipping over $${FREE_SHIP}</span><span>${I.lock}Secure checkout</span><span>${I.return}30-day guarantee</span></div>
      <div class="pay" aria-label="Accepted payments" style="margin-top:-4px">${payIcons()}</div>
      <div class="offerbox"><p><strong>New here?</strong> Sign up and get 20% off your first order.</p><button data-signup>Get 20% off</button></div>
      <div class="values values--slim" aria-label="Brand values"><div class="values__track"><ul>${valuesLis()}</ul><ul aria-hidden="true">${valuesLis()}</ul></div></div>
      <div class="buy__accs" data-single>
        ${acc("Description", `<p>${p.desc}</p>`, true)}
        ${acc("How to use", `<ol class="howto">${p.how.map((h) => `<li>${h}</li>`).join("")}</ol>`)}
        ${acc("Key &amp; full ingredients", `<div class="ingr-list">${p.ingredients.map((x) => `<span>${x[0]}</span>`).join("")}</div><p class="small">${p.inci}</p>`)}
        ${acc("Shipping &amp; returns", `<p>Free US shipping on orders over $${FREE_SHIP}. Orders ship within 1–2 business days. Not right for your skin? Our 30-day happiness guarantee has you covered.</p>`)}
      </div>`;
    accordions($("#buy"));

    let qty = 1;
    const atc = $("#atc");
    const sync = () => {
      const sel = $('input[name="opt"]:checked');
      const pid = sel ? sel.value : p.id;
      atc.dataset.add = pid; atc.dataset.qty = qty;
      $("#qv").textContent = qty;
      const total = money(P[pid].price * qty);
      $("#atcP").textContent = total;
      $("#satcBtn").dataset.add = pid; $("#satcBtn").dataset.qty = qty;
      $("#satcP").textContent = `${money(P[pid].price)} · ${P[pid].size}`;
    };
    $("#qm").onclick = () => { qty = Math.max(1, qty - 1); sync(); };
    $("#qp").onclick = () => { qty = Math.min(9, qty + 1); sync(); };
    $$('input[name="opt"]').forEach((r) => r.addEventListener("change", sync));
    // Restore ATC label after "Added ✓" state
    atc.addEventListener("click", () => setTimeout(() => { atc.innerHTML = `Add to bag · <span id="atcP">${money(P[atc.dataset.add].price * qty)}</span>`; }, 1550));

    // Sticky ATC
    $("#satc").innerHTML = `<div class="wrap satc__in"><img src="${p.imgs[0]}" alt=""><div><strong>${p.name}</strong><small id="satcP">${money(p.price)} · ${p.size}</small></div><button class="btn btn--primary" id="satcBtn" data-add="${p.id}">Add to bag</button></div>`;
    sync();
    // Mobile: sticky bar whenever the main button is off-screen (audit #17). Desktop: only once scrolled past it.
    const mobile = window.matchMedia("(max-width: 900px)");
    const io = new IntersectionObserver(([e]) => $("#satc").classList.toggle("is-on", !e.isIntersecting && (mobile.matches ? window.scrollY > 40 || e.boundingClientRect.top > window.innerHeight : e.boundingClientRect.top < 0)), { threshold: 0 });
    io.observe(atc);

    // Ingredient spotlight
    $("#spotTitle").innerHTML = isB ? `What's inside <span class="serif">the routine</span>` : `What's inside, <span class="serif">and why</span>`;
    const fig = isB ? "images/morning-ritual-hero.jpg" : (p.id === "cleanser" ? "images/cleanser-editorial.jpg" : p.id === "moisturizer" ? "images/moisturizer-3.jpg" : p.imgs[p.id === "serum" ? 2 : 0]);
    const pts = [[30, 30], [72, 24], [24, 72], [74, 68]];
    const labs = p.ingredients.slice(0, 4);
    $("#spotFig").innerHTML = `<img src="${fig}" alt="${p.name} texture" loading="lazy">
      <svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${labs.map((_, k) => `<path d="M50 50 L${pts[k][0]} ${pts[k][1]}" pathLength="1"/><circle cx="50" cy="50" r=".9"/>`).join("")}</svg>
      ${labs.map((x, k) => `<span class="spot__lab" style="left:${pts[k][0]}%;top:${pts[k][1]}%">${x[0].replace(/\s*\(.*\)/, "")}</span>`).join("")}`;
    $("#spotList").innerHTML = p.ingredients.map((x, k) => `<div class="spot__item" data-reveal><span class="ic">${String(k + 1).padStart(2, "0")}</span><div><h3>${x[0]}<small>${x[1]}</small></h3><p>${x[2]}</p></div></div>`).join("");

    // Complete the routine
    const ctr = $("#ctr");
    ctr.innerHTML = ROUTINE.map((rid) => { const r = P[rid]; const cur = rid === p.id; return `
      <div class="ctr__card ${cur ? "is-current" : ""}" data-reveal>
        <a href="${url(rid)}"><img src="${r.imgs[0]}" alt="${r.name}" loading="lazy"></a>
        <span class="step"><b>${r.step}</b>${r.stepName}</span>
        <strong><a href="${url(rid)}">${r.name}</a></strong>
        <small>${r.sub}</small>
        <div class="pcard__row"><span>${money(r.price)}</span>${cur || isB ? "" : `<button class="btn btn--ghost btn--sm" data-add="${rid}">Add</button>`}</div>
      </div>`; }).join("");
    $("#ctrCta").innerHTML = isB
      ? `<p><strong>All four steps are included.</strong> <span class="muted">Each one is designed to layer with the next.</span></p><button class="btn btn--primary" data-add="core-four">Add the routine · $118</button>`
      : `<p><strong>Get all 4 steps for $118</strong> <span class="muted">— save $24 vs. buying separately.</span></p><button class="btn btn--primary" data-add="core-four">Upgrade to the Core Four</button>`;

    // Product FAQ
    const faqs = [
      [`Is ${isB ? "the routine" : "this"} suitable for sensitive skin?`, "Yes. Every formula is fragrance-free and built barrier-first for sensitive, reactive skin. As with any new skincare, patch test on your inner arm or jaw for 24 hours first."],
      p.id === "serum" || isB ? ["Can I use it if I have dark spots or hyperpigmentation?", "That's exactly who it's for. Tranexamic acid and niacinamide target the look of dark spots and uneven tone gently, without the irritation that can cause more pigmentation on melanin-rich skin. Always wear SPF in the day."] : ["Where does it fit in my routine?", `It's step ${p.step} (${p.stepName}). Use it ${p.id === "cleanser" ? "first" : p.id === "moisturizer" ? "last, before SPF in the morning" : "after cleansing and before serum"}.`],
      ["How and when should I use it?", p.how.join(" ")],
      ["How long before I see results?", "Most people notice softer, more comfortable skin within the first week. Changes in the look of dark spots and tone take consistent use — think 6–8 weeks. Results vary from person to person."],
      ["Can I use it alongside the rest of the routine?", "Yes — the four steps are formulated to layer together in order: 01 Cleanse, 02 Prep, 03 Correct, 04 Seal."],
      ["Is it safe during pregnancy or breastfeeding?", "Please check with your doctor or midwife before using any new skincare while pregnant or breastfeeding."],
    ];
    $("#pfaq").innerHTML = faqs.map((f, k) => acc(f[0], `<p>${f[1]}</p>`, k === 0)).join("");
    accordions($("#pfaq"));

    // Reviews
    const list = REVIEWS.filter((r) => r.p === p.id || isB || r.p === "core-four").slice(0, 3);
    while (list.length < 3) list.push(REVIEWS.find((r) => !list.includes(r)));
    $("#rsum").innerHTML = `<div class="rsum__big">${p.rating.toFixed(1)}</div><div>${stars(p.rating, p.reviews)}<div class="rbars" style="margin-top:10px">${[5, 4, 3, 2, 1].map((s) => { const w = s === 5 ? 90 : s === 4 ? 10 : 0; return `<div><span>${s} ★</span><i><b style="width:${w}%"></b></i><span>${s === 5 ? Math.max(1, p.reviews - 1) : s === 4 ? (p.reviews > 1 ? 1 : 0) : 0}</span></div>`; }).join("")}</div></div><button class="btn btn--ghost btn--sm" onclick="return false">Write a review</button>`;
    $("#rlist").innerHTML = list.map((r) => `<figure class="rv" data-reveal>${stars(5).replace(/<span>5\.0<\/span>/, "")}<blockquote>“${r.t}”</blockquote><figcaption class="rv__who"><b>${r.name}</b><span>· ${r.skin}</span><span class="rv__verified">${I.check}Verified</span></figcaption></figure>`).join("");

    // Related
    const rel = $("#related");
    rel.innerHTML = (isB ? ROUTINE : ["core-four", ...ROUTINE.filter((r) => r !== p.id)]).map((rid) => card(rid, { reveal: true })).join("");
    railCtl(rel, $("#relPrev"), $("#relNext"));

    // Video
    const vw = $("#pdpVideo");
    if (vw) {
      if (p.video) { vw.innerHTML = vcard(p.id, p.video, `images/poster-${p.video.split("/")[1].replace(".mp4", "")}.jpg`, `${p.name} in real life`).replace(/<a class="vcard__prod"[\s\S]*?<\/a>/, ""); videos(vw); }
      else vw.innerHTML = `<div class="vcard"><div class="vcard__media"><img src="${p.imgs[3] || p.imgs[0]}" alt="" loading="lazy"></div></div>`;
    }
  }
  const valuesLis = () => ["Barrier First", "Cruelty-free", "Fragrance-free", "Made in the USA", "Suitable for sensitive skin", "Made for melanin-rich skin"].map((v) => `<li>${v}</li>`).join("");

  /* ================= MOTION (GSAP) ================= */
  function motion() {
    if (!window.gsap || reduce) { $$("[data-reveal], .manifesto .w").forEach((e) => { e.style.opacity = 1; e.style.transform = "none"; }); return; }
    gsap.registerPlugin(ScrollTrigger);

    // Generic reveal
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 90%",
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: .09, ease: "power3.out", overwrite: "auto" }),
    });

    // Hero intro
    const hero = $(".hero");
    if (hero) {
      const words = $$(".hero h1 .w");
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero__img", { clipPath: "inset(100% 0 0 0 round 240px 240px 28px 28px)", duration: 1.4 }, 0)
        .from(".hero__img img", { scale: 1.25, duration: 1.8 }, 0)
        .from(".hero__kicker", { y: 20, opacity: 0, duration: .8 }, .25)
        .from(words, { yPercent: 110, opacity: 0, duration: 1, stagger: .05 }, .3)
        .from([".hero .lead", ".hero__ctas", ".hero__proof"], { y: 24, opacity: 0, duration: .9, stagger: .1 }, .7)
        .from(".hero__trust li", { y: 14, opacity: 0, duration: .7, stagger: .08 }, 1)
        .from(".hero__prod", { y: 60, rotate: -6, opacity: 0, duration: 1.2 }, .8)
        .from(".hero__card", { x: 30, opacity: 0, duration: 1 }, 1.1)
        .from(".hero__badge", { scale: 0, rotate: -90, duration: 1.2, ease: "back.out(1.6)" }, 1.2);
      gsap.to(".hero__badge svg", { rotate: 360, duration: 24, repeat: -1, ease: "none" });
      gsap.to(".hero__img img", { yPercent: -10, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero__prod", { y: -50, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero__card", { y: -12, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
    }

    // Two traditions: halves slide together
    if ($(".trad__origins")) {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px)", () => {
        gsap.from(".origin--ja", { xPercent: -14, opacity: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".trad__origins", start: "top 80%" } });
        gsap.from(".origin--ko", { xPercent: 14, opacity: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".trad__origins", start: "top 80%" } });
      });
      gsap.from(".trad__plus span", { scale: 0, rotate: -180, duration: 1, ease: "back.out(1.8)", scrollTrigger: { trigger: ".trad__origins", start: "top 70%" } });
      gsap.from(".origin li", { y: 12, opacity: 0, duration: .5, stagger: .04, ease: "power2.out", scrollTrigger: { trigger: ".trad__origins", start: "top 70%" } });
    }

    // Manifesto: word-by-word highlight on scroll
    const man = $(".manifesto p");
    if (man) {
      gsap.to($$(".w", man), { opacity: 1, stagger: .1, ease: "none", scrollTrigger: { trigger: man, start: "top 80%", end: "bottom 45%", scrub: true } });
      gsap.to(".manifesto__float--a", { y: -80, rotate: -14, ease: "none", scrollTrigger: { trigger: ".manifesto", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.to(".manifesto__float--b", { y: 80, rotate: 12, ease: "none", scrollTrigger: { trigger: ".manifesto", start: "top bottom", end: "bottom top", scrub: true } });
    }

    // Count-up stats
    $$("[data-count-to]").forEach((el) => {
      const to = +el.dataset.countTo;
      const o = { v: 0 };
      gsap.to(o, { v: to, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%", once: true }, onUpdate: () => (el.firstChild.nodeValue = Math.round(o.v)) });
    });

    // Parallax media
    $$("[data-parallax]").forEach((el) => {
      gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });

    // Image clip reveals
    $$("[data-clip]").forEach((el) => {
      gsap.from(el, { clipPath: "inset(18% 18% 18% 18% round 28px)", duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
    });

    // Bundle save badge spin-in
    if ($(".bundle__save")) gsap.from(".bundle__save", { scale: 0, rotate: -120, duration: 1.1, ease: "back.out(1.7)", scrollTrigger: { trigger: ".bundle", start: "top 75%" } });

    // PDP intro + spotlight lines draw
    if ($(".pdp")) {
      gsap.from(".gallery__main", { clipPath: "inset(0 0 100% 0 round 28px)", duration: 1.2, ease: "power4.out" });
      gsap.from("#buy > *", { y: 22, opacity: 0, duration: .8, stagger: .05, ease: "power3.out", delay: .2 });
      const lines = $$("#spotFig path");
      if (lines.length) {
        gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: "#spotFig", start: "top 70%" } });
        tl.to(lines, { strokeDashoffset: 0, duration: .9, stagger: .15, ease: "power2.out" })
          .from("#spotFig .spot__lab", { scale: .6, opacity: 0, duration: .5, stagger: .12, ease: "back.out(2)" }, .4);
      }
    }

    // Collection hero
    if ($(".chero")) gsap.from(".chero h1 .w", { yPercent: 110, opacity: 0, duration: 1, stagger: .05, ease: "power4.out" });

    // Magnetic primary buttons (desktop)
    if (window.matchMedia("(hover: hover)").matches) {
      $$(".btn--primary.magnetic").forEach((b) => {
        b.addEventListener("mousemove", (e) => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .3, duration: .4, ease: "power2.out" }); });
        b.addEventListener("mouseleave", () => gsap.to(b, { x: 0, y: 0, duration: .6, ease: "elastic.out(1, .4)" }));
      });
    }
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  // Split headline words for animation
  function splitWords() {
    $$("[data-split]").forEach((h) => {
      const walk = (node) => {
        Array.from(node.childNodes).forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach((t) => {
              if (!t) return;
              if (/^\s+$/.test(t)) frag.appendChild(document.createTextNode(t));
              else { const s = document.createElement("span"); s.className = "w"; s.textContent = t; frag.appendChild(s); }
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1 && !n.classList.contains("w")) {
            if (n.matches("br")) return;
            if (h.dataset.split === "inner") walk(n);
            else { n.classList.add("w"); }
          }
        });
      };
      walk(h);
      if (h.dataset.split !== "inner") $$(".w", h).forEach((w) => { const o = document.createElement("span"); o.style.cssText = "display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em"; w.style.display = "inline-block"; w.replaceWith(o); o.appendChild(w); });
    });
  }

  /* ---------------- Boot ---------------- */
  chrome();
  injectLogoSymbol();
  renderCart();
  announce();
  headerScroll();
  splitWords();
  if (page === "home") home();
  if (page === "shop") shop();
  if (page === "product") pdp();
  accordions();
  motion();
})();
