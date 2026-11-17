/* =====================================================================
   UNPOPULAR YOU — v3 "Bento Studio" prototype
   GSAP + ScrollTrigger + Lenis. Prices, sizes, reviews, quotes and
   discount tiers are placeholders to confirm with the client.
   ===================================================================== */
(function () {
  "use strict";
  const root = document.documentElement;
  root.classList.add("js");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) root.classList.add("reduced");
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const money = (n) => "$" + (Number.isInteger(+n.toFixed(2)) ? n.toFixed(0) : n.toFixed(2));
  const A = "../"; // asset prefix (pages resolve against /unpopular-you/v2/)
  const FREE = 60;
  const page = document.body.dataset.page;
  const G = () => window.gsap;

  /* ---------------- icons ---------------- */
  const I = {
    arr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
    l: '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
    r: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M3 8h18M3 16h12"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="width:20px;height:20px"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8L12 2.8Z"/></svg>',
    sp: '<svg viewBox="0 0 24 24"><path d="M12 0c.6 6 5.4 11.4 12 12-6.6.6-11.4 6-12 12-.6-6-5.4-11.4-12-12C6.6 11.4 11.4 6 12 0Z"/></svg>',
    nurse: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z"/><path d="M12 9v5M9.5 11.5h5"/></svg>',
    drop: '<svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9 14a3 3 0 0 0 3 3"/></svg>',
    users: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.6-5.5 6.5-5.5s5.5 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.8.7 3 2.4 3.5 5.2"/></svg>',
    truck: '<svg viewBox="0 0 24 24"><path d="M2 6h12v10H2zM14 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    ret: '<svg viewBox="0 0 24 24"><path d="M4 10h11a5 5 0 0 1 0 10H9"/><path d="M8 6 4 10l4 4"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7"/></svg>',
    tick: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6" fill="none"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5-13-7.5Z"/></svg>',
    sound: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    muted: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="m17 9 5 6M22 9l-5 6"/></svg>',
    lr: '<svg viewBox="0 0 24 24"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/></svg>',
    ig: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>',
    tt: '<svg viewBox="0 0 24 24"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 3 2.5 5 5.5 5"/></svg>',
    fb: '<svg viewBox="0 0 24 24"><path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2V3Z"/></svg>',
  };
  const stars = (r, n) => `<span class="stars"><i aria-hidden="true">${I.star.repeat(5)}</i><span>${r.toFixed(1)}${n != null ? ` (${n})` : ""}</span><span class="sr-only">${r} out of 5</span></span>`;
  const LOGO_PATHS = '<path d="M 155.59375 397.460938 L 155.59375 328.875 L 183.203125 328.875 L 183.203125 395.523438 C 183.203125 412.230469 190.941406 420.496094 203.605469 420.496094 C 215.386719 420.496094 224.707031 412.058594 224.707031 395.523438 L 224.707031 328.875 L 251.964844 328.875 L 251.964844 397.460938 C 251.964844 427.882812 231.566406 444.765625 203.605469 444.765625 C 173.355469 444.765625 155.59375 428.058594 155.59375 397.460938 "/><path d="M 372.773438 328.875 L 372.773438 442.65625 L 357.648438 442.65625 L 302.601562 379.523438 L 302.601562 442.480469 L 276.046875 442.480469 L 276.046875 328.523438 L 291.523438 328.523438 L 346.570312 391.65625 L 346.570312 328.875 Z M 372.773438 328.875 "/><path d="M 453.480469 368.617188 C 453.480469 358.945312 447.328125 352.617188 436.070312 352.617188 L 425.695312 352.617188 L 425.695312 384.445312 L 436.070312 384.445312 C 447.328125 384.445312 453.480469 378.464844 453.480469 368.617188 M 436.597656 408.1875 L 425.695312 408.363281 L 425.695312 442.480469 L 398.085938 442.480469 L 398.085938 328.875 L 436.773438 328.875 C 464.914062 328.875 480.035156 343.472656 480.210938 367.386719 C 480.390625 391.832031 464.738281 407.835938 436.597656 408.1875 "/><path d="M 581.148438 385.5 C 581.148438 365.804688 568.664062 351.03125 549.320312 351.03125 C 530.328125 351.03125 517.839844 365.804688 517.839844 385.5 C 517.839844 405.195312 530.328125 419.96875 549.320312 419.96875 C 568.664062 419.96875 581.148438 405.195312 581.148438 385.5 M 490.230469 385.5 C 490.230469 352.261719 515.027344 326.234375 549.320312 326.234375 C 585.898438 326.234375 608.757812 352.261719 608.757812 385.5 C 608.757812 418.738281 583.964844 444.765625 549.320312 444.765625 C 513.269531 444.765625 490.230469 418.738281 490.230469 385.5 "/><path d="M 682.789062 368.617188 C 682.789062 358.945312 676.632812 352.617188 665.375 352.617188 L 655 352.617188 L 655 384.445312 L 665.375 384.445312 C 676.632812 384.445312 682.789062 378.464844 682.789062 368.617188 M 665.90625 408.1875 L 655 408.363281 L 655 442.480469 L 627.390625 442.480469 L 627.390625 328.875 L 666.082031 328.875 C 694.21875 328.875 709.34375 343.472656 709.519531 367.386719 C 709.695312 391.832031 694.042969 407.835938 665.90625 408.1875 "/><path d="M 725.164062 397.460938 L 725.164062 328.875 L 752.773438 328.875 L 752.773438 395.523438 C 752.773438 412.230469 760.511719 420.496094 773.175781 420.496094 C 784.957031 420.496094 794.277344 412.058594 794.277344 395.523438 L 794.277344 328.875 L 821.535156 328.875 L 821.535156 397.460938 C 821.535156 427.882812 801.132812 444.765625 773.175781 444.765625 C 742.925781 444.765625 725.164062 428.058594 725.164062 397.460938 "/><path d="M 918.246094 416.980469 L 918.246094 442.480469 L 845.617188 442.480469 L 845.617188 328.875 L 873.226562 328.875 L 873.226562 416.980469 Z M 918.246094 416.980469 "/><path d="M 1086.566406 440.820312 L 1056.402344 440.820312 L 1041.191406 414.589844 L 1040.433594 413.285156 L 1035.230469 404.292969 L 1009.960938 360.644531 L 984.691406 404.292969 L 978.726562 414.589844 L 963.535156 440.820312 L 933.371094 440.820312 L 1001.003906 333.925781 L 1004.195312 328.867188 L 1015.742188 328.867188 L 1018.933594 333.925781 Z M 1086.566406 440.820312 "/><path d="M 1129.300781 380.050781 L 1136.863281 380.050781 C 1147.0625 380.050781 1153.746094 374.949219 1153.746094 366.15625 C 1153.746094 357.1875 1147.414062 351.558594 1137.214844 351.558594 L 1129.300781 351.558594 Z M 1134.929688 400.625 L 1129.300781 400.625 L 1129.300781 442.480469 L 1101.691406 442.480469 L 1101.691406 328.875 L 1140.03125 328.875 C 1165.527344 328.875 1181.179688 341.535156 1181.179688 363.164062 C 1181.179688 378.113281 1173.441406 389.898438 1161.308594 396.054688 L 1185.753906 442.480469 L 1155.503906 442.480469 Z M 1134.929688 400.625 "/><path d="M 1286.332031 396.054688 L 1286.332031 442.480469 L 1258.546875 442.480469 L 1258.546875 396.933594 L 1218.277344 328.875 L 1251.160156 328.875 L 1272.441406 369.144531 L 1293.71875 328.875 L 1326.078125 328.875 Z M 1286.332031 396.054688 "/><path d="M 1416.992188 385.5 C 1416.992188 365.804688 1404.507812 351.03125 1385.164062 351.03125 C 1366.167969 351.03125 1353.683594 365.804688 1353.683594 385.5 C 1353.683594 405.195312 1366.167969 419.96875 1385.164062 419.96875 C 1404.507812 419.96875 1416.992188 405.195312 1416.992188 385.5 M 1326.074219 385.5 C 1326.074219 352.261719 1350.871094 326.234375 1385.164062 326.234375 C 1421.742188 326.234375 1444.601562 352.261719 1444.601562 385.5 C 1444.601562 418.738281 1419.808594 444.765625 1385.164062 444.765625 C 1349.113281 444.765625 1326.074219 418.738281 1326.074219 385.5 "/><path d="M 1462.179688 397.460938 L 1462.179688 328.875 L 1489.789062 328.875 L 1489.789062 395.523438 C 1489.789062 412.230469 1497.527344 420.496094 1510.191406 420.496094 C 1521.972656 420.496094 1531.292969 412.058594 1531.292969 395.523438 L 1531.292969 328.875 L 1558.550781 328.875 L 1558.550781 397.460938 C 1558.550781 427.882812 1538.152344 444.765625 1510.191406 444.765625 C 1479.941406 444.765625 1462.179688 428.058594 1462.179688 397.460938 "/><path d="M 1018.933594 333.921875 L 1001.003906 333.921875 L 1004.195312 328.867188 L 1015.742188 328.867188 Z M 1018.933594 333.921875 "/><path d="M 1041.738281 414.589844 C 1036.734375 423.363281 1024.261719 427.660156 1009.980469 427.660156 L 1009.6875 427.660156 C 995.40625 427.660156 982.933594 423.363281 977.929688 414.589844 L 984.074219 404.292969 L 1035.59375 404.292969 Z M 1041.738281 414.589844 "/>';
  const LOGO = `<svg viewBox="150 322 1418 128" fill="currentColor" role="img" aria-label="Unpopular You">${LOGO_PATHS}</svg>`;

  /* ---------------- data ---------------- */
  const IMG = (f) => A + "images/" + f;
  const V2 = (f) => A + "images/v2/" + f;
  const P = {
    cleanser: { id: "cleanser", step: "01", sn: "Cleanse", name: "Maroon Silk Cleanser", short: "Maroon Silk Cleanser", sub: "A gentle cleanser that removes the day without disrupting your barrier.", price: 28, size: "120 ml / 4 fl oz", rating: 4.9, reviews: 3, tint: "#F1E7E0", c: ["sensitive", "barrier"], concern: "Dryness + sensitivity", sig: "Amino acids + rice ferment",
      ing: [["Amino acids", "Gentle cleansing", "Lift away sunscreen, oil and the day without the tight, squeaky feel."], ["Colloidal oatmeal", "Soothing", "Calms and softens, so skin feels comfortable straight after rinsing."], ["Rice ferment extract", "Korean-inspired", "Softens and brightens the look of skin as you cleanse."], ["Bifida ferment filtrate", "Barrier support", "Helps skin feel stronger, calmer and more resilient."], ["Aloe vera", "Hydration", "Soothes and hydrates so skin is never left stripped."], ["Bamboo extract", "Botanical", "Gently refreshes and purifies without harshness."]],
      ticks: ["Cleanses without the tight, stripped feel", "Made for melanin-rich skin", "Fragrance-free, gentle on sensitive skin", "Amino acids, oat + rice ferment"],
      desc: "A silky, low-foam cleanser with amino acids, colloidal oatmeal, rice ferment, bifida ferment, aloe vera and bamboo extract that melts away sunscreen, makeup and the day while leaving your moisture barrier exactly where it should be. Nothing harsh, nothing stripping — just clean, soft, comfortable skin.",
      how: ["Massage a small amount onto damp skin for 30–60 seconds.", "Rinse with lukewarm water and pat dry.", "Follow with Glow Ritual Rice Essence Toner. AM + PM."],
      cut: V2("cut-cleanser.png"), cutBox: V2("cut-cleanser-box.png"), life: [IMG("cleanser-editorial.jpg"), V2("apply-1.jpg"), IMG("cleanser-2.jpg")], video: A + "video/cleanser-real-life.mp4", poster: IMG("poster-cleanser-real-life.jpg") },
    toner: { id: "toner", step: "02", sn: "Prep", name: "Glow Ritual Rice Essence Toner", short: "Glow Ritual Toner", sub: "A lightweight rice essence toner that preps and hydrates for a natural glow.", price: 34, size: "150 ml / 5.07 fl oz", rating: 4.9, reviews: 4, badge: "As seen in Blissim", tint: "#EADDD2", c: ["glow", "barrier"], concern: "Dull, dehydrated skin", sig: "Rice ferment + ginseng",
      ing: [["Rice ferment filtrate", "Korean-inspired", "Softens and brightens the look of skin for a natural, lit-from-within glow."], ["Ginseng", "Korean-inspired", "Revives tired, stressed-looking skin."], ["Triple ceramides", "Barrier", "NP, AP and EOP replenish the lipids your barrier is made of."], ["Peptide complex", "Support", "Helps skin look smoother and more resilient."], ["2% Niacinamide", "Tone", "Evens the look of tone and supports the barrier."]],
      ticks: ["Preps skin and boosts natural glow", "Made for melanin-rich skin", "Hydrating, never stripping", "Rice ferment, ginseng + 2% niacinamide"],
      desc: "A hydration bath for sensitive skin. Fermented rice, ginseng and 2% niacinamide layered with triple ceramides and peptides, so skin is prepped, plumped and glowing before your serum. Selected for the limited-edition Blissim Glow Up Beauty Box.",
      how: ["After cleansing, pour a few drops into your palms.", "Press into face and neck — no cotton pad needed.", "Layer twice on drier days, then follow with serum."],
      cut: V2("cut-toner.png"), cutBox: V2("cut-toner-box.png"), life: [IMG("blissim-product-listing.jpg"), V2("tex-trio.jpg"), IMG("ritual-out.jpg")] },
    serum: { id: "serum", step: "03", sn: "Correct", name: "Rooted Radiance Brightening Serum", short: "Rooted Radiance Serum", sub: "A brightening serum that targets the look of dark spots while it hydrates.", price: 42, size: "30 ml / 1 fl oz", rating: 4.9, reviews: 2, badge: "New formula", tint: "#F6D5DA", c: ["spots", "glow"], concern: "Dark spots + uneven tone", sig: "Tranexamic acid + 3% niacinamide",
      ing: [["Tranexamic acid", "Targeted", "Targets the look of dark spots and post-blemish marks without irritation."], ["3% Niacinamide", "Tone", "Evens the look of skin tone and refines texture."], ["Pumpkin enzyme", "Gentle resurfacing", "A soft enzyme that smooths and brightens without harsh acids."], ["Guava leaf", "Jamaican botanical", "Antioxidant-rich, for brighter, calmer-looking skin."], ["Adenosine", "Support", "Helps skin look smoother and refreshed."]],
      ticks: ["Targets the look of dark spots and uneven tone", "Made for melanin-rich skin", "Gentle on sensitive skin", "Tranexamic acid, 3% niacinamide + guava leaf"],
      desc: "Our new and improved brightening step. Tranexamic acid and 3% niacinamide with a gentle pumpkin enzyme and guava leaf target the look of dark spots and uneven tone — without the redness, peeling or sensitivity stronger actives can cause on melanin-rich skin.",
      how: ["After toner, apply 2–3 drops to face and neck.", "Start a few nights a week, then build to daily.", "In the morning, always finish with SPF."],
      cut: V2("cut-serum.png"), cutBox: V2("cut-serum-box.png"), life: [V2("tex-serum.jpg"), V2("apply-2.jpg"), IMG("serum-box.jpg")], video: A + "video/serum-real-life.mp4", poster: IMG("poster-serum-real-life.jpg") },
    moisturizer: { id: "moisturizer", step: "04", sn: "Seal", name: "Soothing Barrier Moisturizer", short: "Barrier Moisturizer", sub: "A lightweight water cream that calms, hydrates and seals in your barrier.", price: 38, size: "50 ml / 1.7 fl oz", rating: 5.0, reviews: 3, tint: "#E4D2CC", c: ["sensitive", "barrier"], concern: "Weak or stressed barrier", sig: "Soursop leaf + triple ceramides",
      ing: [["Colloidal oatmeal", "Soothing", "Calms the look of redness and relieves dry, tight skin."], ["Moringa leaf", "Jamaican botanical", "Nutrient-rich and antioxidant, a staple of Jamaican plant care."], ["Soursop leaf", "Jamaican botanical", "A traditional Caribbean leaf used to soothe and comfort skin."], ["Triple ceramides", "Barrier", "NP, AP and EOP seal in moisture and strengthen the barrier."]],
      ticks: ["Calms, hydrates and repairs the barrier", "Made for melanin-rich skin", "Soothing for sensitive, reactive skin", "Colloidal oat, soursop + triple ceramides"],
      desc: "The step that seals it all in. A cushiony water cream with colloidal oatmeal, Jamaican moringa and soursop leaf, and a triple ceramide complex — hydrating without heaviness, calming without clogging.",
      how: ["Warm a pea-sized amount between fingertips.", "Press over face and neck as your last step.", "Use AM (before SPF) and PM."],
      cut: V2("cut-moisturizer.png"), life: [IMG("moisturizer-3.jpg"), V2("apply-3.jpg"), IMG("handbag-editorial-hero.jpg")], video: A + "video/moisturizer-real-life.mp4", poster: IMG("poster-moisturizer-real-life.jpg") },
    "core-four": { id: "core-four", step: "01–04", sn: "Full routine", name: "The Core Four Routine", short: "The Core Four", sub: "The complete barrier-first routine: cleanse, prep, correct and seal.", price: 118, compare: 142, size: "4 full-size products", rating: 4.9, reviews: 12, badge: "Save $24", tint: "#F8E3E6", c: ["spots", "sensitive", "glow", "barrier"], concern: "Dark spots + a stronger barrier", sig: "Everything, in order", wide: true,
      ing: [["Rice ferment + ginseng", "Korean-inspired", "Glow and softness, from the toner."], ["Tranexamic acid + niacinamide", "Targeted", "Dark-spot correction, from the serum."], ["Soursop + moringa leaf", "Jamaican botanical", "Comfort and nourishment, from the moisturizer."], ["Triple ceramides", "Barrier", "In the toner and moisturizer to seal it all in."]],
      ticks: ["Targets the look of dark spots", "Made for melanin-rich skin", "Barrier-first, gentle on sensitive skin", "4 full-size steps — save $24"],
      desc: "Everything you need to target the look of dark spots and strengthen your barrier, in the order it's meant to be used. Four full-size, fragrance-free formulas combining Jamaican botanicals with Korean-inspired gentleness.",
      how: ["01 Cleanse — Maroon Silk Cleanser.", "02 Prep — Glow Ritual Rice Essence Toner.", "03 Correct — Rooted Radiance Serum.", "04 Seal — Soothing Barrier Moisturizer, then SPF in the AM."],
      cut: V2("cut-lineup.png"), life: [IMG("morning-ritual-hero.jpg"), IMG("ritual-pouch.jpg"), IMG("travel-flatlay.jpg")], video: A + "video/core-four-real-life.mp4", poster: IMG("poster-core-four-real-life.jpg"), bundle: ["cleanser", "toner", "serum", "moisturizer"] },
  };
  const R4 = ["cleanser", "toner", "serum", "moisturizer"];
  const url = (id) => `product/?p=${id}`;
  const REV = [
    { p: "serum", n: "Tasha", s: "Hyperpigmentation", a: V2("smile-turban.jpg"), t: "I've tried so many brightening serums that left my skin red and peeling. This one actually works on my dark spots and my skin stays calm." },
    { p: "toner", n: "Aaliyah", s: "Dry, sensitive skin", a: V2("model-afro.jpg"), t: "The toner feels like a drink of water for my face. No sting at all, and I have this soft glow by the end of the day." },
    { p: "moisturizer", n: "Renée", s: "Sensitive, reactive", a: V2("smile-glasses.jpg"), t: "Finally a moisturiser that doesn't break me out or feel greasy. My barrier feels so much stronger — no more tight, itchy patches." },
    { p: "core-four", n: "Kemi", s: "Combination, acne-prone", a: V2("smile-mask.jpg"), t: "The full routine is so simple to follow. Two weeks in and my texture is smoother and my tone looks more even." },
    { p: "cleanser", n: "Danielle", s: "Oily, sensitive", a: V2("model-hands.jpg"), t: "Gentle but it still gets everything off, even sunscreen. My face never feels stripped after." },
  ];

  /* ---------------- cart ---------------- */
  const SUB = 0.15; // subscribe & save
  const TIERS = { 2: 0.10, 3: 0.15 }; // build-your-routine
  const st = { get() { try { return JSON.parse(localStorage.getItem("uy3_cart") || "[]"); } catch (e) { return this.m || []; } }, set(v) { this.m = v; try { localStorage.setItem("uy3_cart", JSON.stringify(v)); } catch (e) {} } };
  const cart = {
    items: st.get().filter((i) => P[i.id]),
    key: (id, sub) => id + (sub ? ":s" : ""),
    add(id, qty = 1, sub = false) { const k = this.key(id, sub); const it = this.items.find((i) => i.k === k); if (it) it.qty += qty; else this.items.push({ k, id, qty, sub }); this.save(); },
    set(k, q) { const it = this.items.find((i) => i.k === k); if (!it) return; it.qty = q; if (q <= 0) this.items = this.items.filter((i) => i.k !== k); this.save(); },
    count() { return this.items.reduce((s, i) => s + i.qty, 0); },
    line(i) { const p = P[i.id]; return p.price * (i.sub ? 1 - SUB : 1) * i.qty; },
    sub() { return this.items.reduce((s, i) => s + this.line(i), 0); },
    steps() { return [...new Set(this.items.filter((i) => !P[i.id].bundle).map((i) => i.id))]; },
    routineOff() { const s = this.steps(); if (s.length === 4) return 142 - 118; const r = TIERS[s.length]; return r ? s.reduce((a, id) => a + P[id].price, 0) * r : 0; },
    total() { return this.sub() - this.routineOff(); },
    saved() { return this.items.reduce((s, i) => s + ((P[i.id].compare || P[i.id].price) * i.qty - this.line(i)), 0) + this.routineOff(); },
    owned() { const s = new Set(); this.items.forEach((i) => (P[i.id].bundle ? P[i.id].bundle.forEach((b) => s.add(b)) : s.add(i.id))); return s; },
    save() { st.set(this.items); renderCart(); },
  };

  /* ---------------- chrome (v3) ---------------- */
  function chrome() {
    const top = $("#top");
    top.innerHTML = `
      <a class="skip" href="#main">Skip to content</a>
      <div class="ann" role="region" aria-label="Announcements">
        <button class="ann__n ann__n--p" aria-label="Previous announcement">${I.l.replace("<svg", '<svg fill="none" stroke="currentColor" stroke-width="1.6"')}</button>
        <div class="ann__t" aria-live="polite">
          <p class="ann__m on"><button type="button" data-signup>Sign up for 20% off your first order</button></p>
          <p class="ann__m">Free US shipping on orders over $${FREE}</p>
          <p class="ann__m"><a href="${url("toner")}">Our toner was featured in the Blissim Beauty Box</a></p>
        </div>
        <button class="ann__n ann__n--n" aria-label="Next announcement">${I.r.replace("<svg", '<svg fill="none" stroke="currentColor" stroke-width="1.6"')}</button>
      </div>
      <header class="hdr" id="hdr"><div class="hdr__in wrap">
        <a class="logo" href="./" aria-label="Unpopular You home">${LOGO}</a>
        <nav class="hdr__nav" aria-label="Main">
          <a href="shop/" ${page === "shop" ? 'aria-current="page"' : ""}>Shop all</a>
          <a href="./#routine">The routine</a>
          <a href="${url("core-four")}">Core Four <em>−$24</em></a>
          <a href="./#barrier">Barrier first</a>
          <button data-quiz>Skin quiz</button>
        </nav>
        <div class="hdr__r">
          <button class="ib mbtn" data-open="menu" aria-label="Open menu" aria-expanded="false">${I.menu}</button>
          <button class="ib hide-m" aria-label="Account">${I.user}</button>
          <button class="bagbtn" id="cartBtn" data-open="cart" aria-label="Open bag"><span class="hide-m">Bag</span>${I.bag}<span class="cc" data-n="0">0</span></button>
        </div>
      </div></header>`;

    const bot = $("#bot");
    bot.innerHTML = `
      <footer class="ft"><div class="wrap">
        <div class="ft__cta">
          <div class="news">
            <p class="eyebrow">The Insider List</p>
            <h2>GET <span class="rose">20% OFF</span><br>YOUR FIRST ORDER</h2>
            <p>Barrier-first tips from a nurse, early access to drops and your welcome code.</p>
            <form data-news novalidate><label class="sr-only" for="nEmail">Email</label><input id="nEmail" type="email" placeholder="Your email address" autocomplete="email" required><button class="btn btn--ink" type="submit"><span class="bt">Sign up</span></button></form>
            <p class="news__ok" role="status">You're in — check your inbox for your code.</p>
          </div>
          <div class="ft__cols">
            <div><h3>Shop</h3><ul><li><a href="shop/">Shop all</a></li><li><a href="${url("core-four")}">The Core Four</a></li>${R4.map((id) => `<li><a href="${url(id)}">${P[id].short}</a></li>`).join("")}</ul></div>
            <div><h3>Learn</h3><ul><li><a href="./#founder">Our story</a></li><li><a href="./#barrier">Barrier First</a></li><li><button data-quiz>Skin quiz</button></li><li><a href="./#faq">FAQ</a></li></ul></div>
            <div><h3>Help</h3><ul><li><a href="#" onclick="return false">Shipping</a></li><li><a href="#" onclick="return false">Returns</a></li><li><a href="#" onclick="return false">Contact</a></li><li><a href="#" onclick="return false">Track order</a></li></ul></div>
          </div>
        </div>
        <div class="ft__mark" aria-hidden="true">${LOGO}</div>
        <div class="ft__bot"><span>© 2026 Unpopular You · Nurse-founded · Made for melanin-rich skin</span><div class="socials"><a href="#" onclick="return false" aria-label="Instagram">${I.ig}</a><a href="#" onclick="return false" aria-label="TikTok">${I.tt}</a><a href="#" onclick="return false" aria-label="Facebook">${I.fb}</a></div><span>Cruelty-free · Fragrance-free · Made in the USA</span></div>
      </div></footer>

      <div class="ovl" data-close></div>

      <div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true">
        <div class="menu__h"><a class="logo" href="./" aria-label="Home">${LOGO}</a><button class="ib" data-close aria-label="Close menu">${I.x}</button></div>
        <div class="menu__g">
          <div class="menu__big">
            <a href="shop/">SHOP ALL <small>4 products</small></a>
            <a href="${url("core-four")}">CORE FOUR <small>Save $24</small></a>
            <a href="./#barrier">BARRIER FIRST</a>
            <a href="./#founder">OUR STORY</a>
            <a href="#" data-quiz>SKIN QUIZ <small>60 sec</small></a>
          </div>
          <div class="menu__prods">${R4.map((id) => { const p = P[id]; return `<a class="mp" href="${url(id)}"><span class="mp__img" style="background:${p.tint}"><img src="${p.cut}" alt="" loading="lazy"></span><span class="mp__t"><span class="step"><b>${p.step}</b>${p.sn}</span><strong>${p.name}</strong><small>${p.sub}</small></span></a>`; }).join("")}</div>
        </div>
        <div class="menu__foot"><span>Nurse-founded · Made for melanin-rich skin</span><span>Free US shipping over $${FREE}</span></div>
      </div>

      <aside class="drw" id="cart" aria-label="Your bag" aria-hidden="true">
        <div class="drw__h"><h2>YOUR BAG <span class="mut" id="cN"></span></h2><button class="ib" data-close aria-label="Close bag">${I.x}</button></div>
        <div class="ship" id="cShip"></div>
        <div class="drw__b" id="cBody"></div>
        <div class="cf" id="cFoot"></div>
      </aside>

      <div class="quiz" id="quiz" role="dialog" aria-modal="true" aria-label="Skin quiz" aria-hidden="true"></div>

      <div class="modal" id="signup" role="dialog" aria-modal="true" aria-labelledby="suT" aria-hidden="true">
        <div class="modal__bg" data-close></div>
        <div class="modal__c">
          <button class="ib modal__x" data-close aria-label="Close">${I.x}</button>
          <div class="modal__img"><img src="${V2("model-hands.jpg")}" alt="" loading="lazy"></div>
          <div class="modal__b">
            <div class="modal__f"><p class="eyebrow">The Insider List</p><h2 id="suT">TAKE <span class="rose">20% OFF</span> YOUR FIRST ORDER</h2><p class="mut" style="margin:0 0 16px">Your welcome code, barrier-first tips from Shauna and first access to new drops.</p>
              <form data-mform novalidate style="display:grid;gap:10px"><label class="sr-only" for="mEmail">Email</label><input class="field" id="mEmail" type="email" placeholder="Email address" autocomplete="email" required><button class="btn btn--ink btn--block" type="submit"><span class="bt">Unlock 20% off</span></button><p class="tiny mut" style="text-align:center;margin:0">No spam. Unsubscribe anytime.</p></form></div>
            <div class="modal__ok" role="status"><p class="eyebrow">Welcome</p><h2>HERE'S YOUR <span class="rose">CODE</span></h2><p><span class="code">GLOW20</span></p><p class="small mut">Applied automatically at checkout.</p><button class="btn btn--ink btn--block" data-close><span class="bt">Keep shopping</span></button></div>
          </div>
        </div>
      </div>
      <div class="toast" id="toast" role="status" aria-live="polite">${I.check}<span></span></div>
      <div class="cur" aria-hidden="true"><div class="cur__ring"><span></span></div><div class="cur__dot"></div></div>`;
  }

  /* ---------------- open / close ---------------- */
  let lenis = null, last = null;
  const lock = (on) => { document.body.classList.toggle("lock", on); if (lenis) on ? lenis.stop() : lenis.start(); };
  function open(id) {
    const el = document.getElementById(id);
    if (!el) return;
    closeAll(true);
    last = document.activeElement;
    el.classList.add("open");
    el.setAttribute("aria-hidden", "false");
    if (id === "cart") $(".ovl").classList.add("open");
    lock(true);
    $$(`[data-open="${id}"]`).forEach((b) => b.setAttribute("aria-expanded", "true"));
    setTimeout(() => { const f = el.querySelector("button, a[href], input"); f && f.focus({ preventScroll: true }); }, 80);
    if (id === "menu" && G() && !reduce) {
      gsap.fromTo($$("#menu .menu__big a"), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, stagger: .06, ease: "power4.out", delay: .35 });
      gsap.fromTo($$("#menu .mp"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .06, ease: "power3.out", delay: .5 });
    }
  }
  function closeAll(silent) {
    $$(".drw.open, .modal.open, .menu.open, .quiz.open").forEach((d) => { d.classList.remove("open"); d.setAttribute("aria-hidden", "true"); });
    $(".ovl") && $(".ovl").classList.remove("open");
    lock(false);
    $$("[data-open]").forEach((b) => b.setAttribute("aria-expanded", "false"));
    if (!silent && last) last.focus({ preventScroll: true });
  }
  document.addEventListener("click", (e) => {
    const h = e.target.closest('a[href^="#"]');
    if (h && h.getAttribute("href").length > 1) {
      const t = document.getElementById(h.getAttribute("href").slice(1));
      if (t) { e.preventDefault(); closeAll(true); lenis ? lenis.scrollTo(t, { offset: -20 }) : t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); return; }
    }
    const lk = e.target.closest('a[href^="./#"]');
    if (lk && page === "home") { const t = document.getElementById(lk.getAttribute("href").slice(3)); if (t) { e.preventDefault(); closeAll(true); lenis ? lenis.scrollTo(t, { offset: -20 }) : t.scrollIntoView(); return; } }
    if (e.target.closest("[data-quiz]")) { e.preventDefault(); openQuiz(); return; }
    const o = e.target.closest("[data-open]");
    if (o) { e.preventDefault(); open(o.dataset.open); return; }
    if (e.target.closest("[data-close]")) { e.preventDefault(); closeAll(); return; }
    if (e.target.closest("[data-signup]")) { e.preventDefault(); open("signup"); return; }
    const a = e.target.closest("[data-add]");
    if (a) { e.preventDefault(); addToCart(a.dataset.add, +(a.dataset.qty || 1), a.dataset.sub === "1", a); return; }
    const q = e.target.closest("[data-q]");
    if (q) { const it = cart.items.find((i) => i.k === q.dataset.q); if (it) cart.set(it.k, q.dataset.d === "rm" ? 0 : it.qty + +q.dataset.d); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

  function toast(m) { const t = $("#toast"); $("span", t).textContent = m; t.classList.add("on"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("on"), 2600); }
  function addToCart(id, qty, sub, btn) {
    if (!P[id]) return;
    cart.add(id, qty, sub);
    if (btn) {
      const h = btn.innerHTML;
      btn.classList.add("ok");
      btn.innerHTML = `<span class="bt">Added ✓</span>`;
      setTimeout(() => { btn.classList.remove("ok"); btn.innerHTML = h; }, 1400);
      fly(btn, P[id].cut);
    }
    setTimeout(() => open("cart"), reduce ? 0 : 700);
  }
  function fly(from, src) {
    const t = $("#cartBtn");
    if (!G() || reduce || !t) return;
    const a = from.getBoundingClientRect(), b = t.getBoundingClientRect();
    const f = document.createElement("img");
    f.className = "fly"; f.src = src; f.alt = "";
    f.style.left = a.left + a.width / 2 - 35 + "px"; f.style.top = a.top + a.height / 2 - 50 + "px";
    document.body.appendChild(f);
    gsap.timeline({ onComplete: () => f.remove() })
      .to(f, { x: b.left + b.width / 2 - (a.left + a.width / 2), duration: .7, ease: "power2.in" }, 0)
      .to(f, { y: b.top + b.height / 2 - (a.top + a.height / 2), duration: .7, ease: "back.in(1.6)" }, 0)
      .to(f, { scale: .15, rotate: 25, opacity: .4, duration: .7, ease: "power2.in" }, 0)
      .fromTo(t, { scale: 1 }, { scale: 1.3, duration: .18, yoyo: true, repeat: 1 }, .62);
  }
  const pay = () => '<span class="vi">VISA</span><span class="mc">Mastercard</span><span class="ax">AMEX</span><span class="ap"> Pay</span><span class="sp">shop Pay</span><span class="pp">PayPal</span>';

  function renderCart() {
    const n = cart.count();
    $$(".cc").forEach((c) => { c.textContent = n; c.dataset.n = n; });
    const body = $("#cBody");
    if (!body) return;
    $("#cN").textContent = n ? `(${n})` : "";
    const tot = cart.total(), left = Math.max(0, FREE - tot);
    $("#cShip").innerHTML = `<p>${left > 0 ? `You're <strong>${money(left)}</strong> away from free shipping` : `<strong>You've unlocked free shipping</strong>`}</p><div class="bar"><span style="width:${Math.min(100, (tot / FREE) * 100)}%"></span></div>`;
    const steps = cart.steps().length, hasBundle = cart.items.some((i) => P[i.id].bundle);
    const nudge = hasBundle || steps === 4 ? "" : steps === 0 ? "" : `<div class="nudge">${I.sp.replace("<svg", '<svg style="width:16px;height:16px;fill:var(--guava);flex:none"')}<span>${steps === 1 ? "Add <b>1 more step</b> to save 10% on your routine" : steps === 2 ? "Add <b>1 more step</b> to save 15%" : "Add the <b>last step</b> to get the Core Four price (save $24)"}</span></div>`;
    if (!n) {
      body.innerHTML = `<div class="empty"><h3 class="m">Your bag is empty</h3><p>Not sure where to start? Our 60-second quiz builds your routine.</p><button class="btn btn--ink" data-quiz><span class="bt">Take the skin quiz ${I.arr}</span></button></div>${upsell()}`;
      $("#cFoot").innerHTML = ""; return;
    }
    body.innerHTML = nudge + `<div class="citems">${cart.items.map((i) => { const p = P[i.id]; return `
      <div class="ci"><span class="ci__img" style="background:${p.tint}"><img src="${p.cut}" alt=""></span>
        <div><span class="step"><b>${p.step}</b>${p.sn}</span><h4><a href="${url(p.id)}">${p.name}</a></h4><small>${p.size}${i.sub ? " · Subscribe & save 15%, every 60 days" : ""}</small>
          <div><span class="qty"><button data-q="${i.k}" data-d="-1" aria-label="Decrease">−</button><span>${i.qty}</span><button data-q="${i.k}" data-d="1" aria-label="Increase">+</button></span><button class="rm" data-q="${i.k}" data-d="rm">Remove</button></div></div>
        <div class="ci__pr">${p.compare || i.sub ? `<s>${money((p.compare || p.price) * i.qty)}</s>` : ""}${money(cart.line(i))}</div></div>`; }).join("")}</div>${upsell()}`;
    const off = cart.routineOff(), saved = cart.saved();
    $("#cFoot").innerHTML = `
      <div class="cf__row"><span>Subtotal</span><span>${money(cart.sub())}</span></div>
      ${off ? `<div class="cf__row save"><span>Routine discount (${steps} steps)</span><span>−${money(off)}</span></div>` : ""}
      ${saved > 0 ? `<div class="cf__row save"><span>You're saving</span><span>${money(saved)}</span></div>` : ""}
      <div class="cf__tot"><span>Total</span><strong>${money(tot)}</strong></div>
      <button class="btn btn--ink btn--block" onclick="alert('Prototype — this goes to Shopify checkout.')"><span class="bt">Secure checkout ${I.lock.replace("<svg", '<svg fill="none" stroke="currentColor" stroke-width="1.6"')}</span></button>
      <p class="cf__note">30-day happiness guarantee · Taxes at checkout</p><div class="pay">${pay()}</div>`;
  }
  function upsell() {
    const own = cart.owned(), miss = R4.filter((id) => !own.has(id));
    if (!miss.length) return `<div class="cup"><h3>Routine complete</h3><p class="small mut" style="margin:0">All four steps. Your barrier thanks you.</p></div>`;
    return `<div class="cup"><h3>${cart.count() ? "Complete your routine" : "Start with a step"}</h3>${miss.map((id) => { const p = P[id]; return `<div class="mini"><span class="mini__img" style="background:${p.tint}"><img src="${p.cut}" alt=""></span><div><span class="step"><b>${p.step}</b>${p.sn}</span><strong>${p.name}</strong><small>${money(p.price)}</small></div><button class="plus" data-add="${id}" aria-label="Add ${p.name}">+</button></div>`; }).join("")}</div>`;
  }

  /* forms */
  document.addEventListener("submit", (e) => {
    const f = e.target;
    if (!f.matches("[data-news],[data-mform],[data-qform]")) return;
    e.preventDefault();
    const inp = $("input[type=email]", f);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) { inp.focus(); inp.style.borderColor = "#b3443a"; toast("Please enter a valid email"); return; }
    if (f.matches("[data-news]")) { f.style.display = "none"; f.nextElementSibling.style.display = "block"; }
    if (f.matches("[data-mform]")) { $(".modal__f").style.display = "none"; $(".modal__ok").style.display = "block"; }
    if (f.matches("[data-qform]")) { quiz.email = inp.value.trim(); quizGo(5); }
  });

  /* ---------------- announcement ---------------- */
  function ann() {
    const m = $$(".ann__m"); let i = 0, t;
    const go = (d) => { const o = m[i]; o.classList.remove("on"); o.classList.add("out"); setTimeout(() => o.classList.remove("out"), 800); i = (i + d + m.length) % m.length; m[i].classList.add("on"); };
    const loop = () => { clearInterval(t); if (!reduce) t = setInterval(() => go(1), 6000); };
    $(".ann__n--n").onclick = () => { go(1); loop(); };
    $(".ann__n--p").onclick = () => { go(-1); loop(); };
    loop();
  }
  function header() {
    const h = $("#hdr"); let ly = 0;
    const onS = (y) => { const hide = y > 500 && y > ly && !document.body.classList.contains("lock"); h.classList.toggle("hide", hide); const tl = $(".tools"); if (tl) tl.style.top = hide ? "8px" : ""; ly = y; };
    if (lenis) lenis.on("scroll", ({ scroll }) => onS(scroll)); else addEventListener("scroll", () => onS(scrollY), { passive: true });
  }

  /* ---------------- cursor ---------------- */
  function cursor() {
    if (!fine || reduce || !G()) return;
    root.classList.add("has-cursor");
    const c = $(".cur"), dot = $(".cur__dot"), ring = $(".cur__ring"), lab = $(".cur__ring span");
    const xd = gsap.quickTo(dot, "x", { duration: .1 }), yd = gsap.quickTo(dot, "y", { duration: .1 });
    const xr = gsap.quickTo(ring, "x", { duration: .45, ease: "power3" }), yr = gsap.quickTo(ring, "y", { duration: .45, ease: "power3" });
    addEventListener("mousemove", (e) => { xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY); });
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-cursor]");
      const h = e.target.closest("a, button, input, label, select");
      c.classList.toggle("big", !!t);
      c.classList.toggle("hov", !t && !!h);
      c.classList.toggle("dark", !!e.target.closest(".bg-i, .menu, .final3, .tile--ink"));
      lab.textContent = t ? t.dataset.cursor : "";
    });
    document.addEventListener("mouseleave", () => gsap.to(c, { opacity: 0 }));
    document.addEventListener("mouseenter", () => gsap.to(c, { opacity: 1 }));
  }
  function magnetic() {
    if (!fine || reduce || !G()) return;
    $$("[data-mag]").forEach((b) => {
      b.addEventListener("mousemove", (e) => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .5, ease: "power3" }); });
      b.addEventListener("mouseleave", () => gsap.to(b, { x: 0, y: 0, duration: .8, ease: "elastic.out(1,.4)" }));
    });
  }

  /* ---------------- helpers ---------------- */
  function acc(rootEl = document) {
    $$(".acc__b", rootEl).forEach((b) => {
      if (b._b) return; b._b = 1;
      b.addEventListener("click", () => {
        const a = b.closest(".acc"), on = !a.classList.contains("open"), grp = b.closest("[data-single]");
        if (grp) $$(".acc.open", grp).forEach((x) => { x.classList.remove("open"); $(".acc__b", x).setAttribute("aria-expanded", "false"); });
        a.classList.toggle("open", on); b.setAttribute("aria-expanded", on);
        setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 650);
      });
    });
  }
  const accH = (q, a, o) => `<div class="acc ${o ? "open" : ""}"><button class="acc__b" aria-expanded="${!!o}">${q}<span class="acc__i" aria-hidden="true"></span></button><div class="acc__p"><div>${a}</div></div></div>`;
  function swipe(el, prev, next) { let x0 = null; el.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true }); el.addEventListener("touchend", (e) => { if (x0 == null) return; const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 40) (d < 0 ? next : prev)(); x0 = null; }); }
  function dragRail(r) {
    let down = false, sx = 0, sl = 0, moved = false;
    r.addEventListener("mousedown", (e) => { down = true; moved = false; sx = e.pageX; sl = r.scrollLeft; r.classList.add("drag"); });
    addEventListener("mouseup", () => { down = false; r.classList.remove("drag"); });
    r.addEventListener("mousemove", (e) => { if (!down) return; const d = e.pageX - sx; if (Math.abs(d) > 4) moved = true; r.scrollLeft = sl - d; });
    r.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  }
  const vals = () => ["Barrier First", "Cruelty-free", "Fragrance-free", "Made in the USA", "Sensitive-skin friendly", "Nurse-founded"].map((v) => `<span>${v}${I.sp}</span>`).join("");

  function card(id, o = {}) {
    const p = P[id];
    const life = p.video && fine ? `<video class="life" src="${p.video}" muted playsinline loop preload="none" poster="${p.poster}"></video>` : `<img class="life" src="${p.life[0]}" alt="" loading="lazy">`;
    return `<article class="pc" data-c="${p.c.join(" ")}" data-price="${p.price}" data-step="${p.step}" data-id="${id}" ${o.r ? "data-r" : ""}>
      <div class="pc__mw"><a class="pc__m" href="${url(id)}" style="background:${p.tint}" data-cursor="View" aria-label="${p.name}">
        <img class="cut ${p.wide ? "cut--wide" : ""}" src="${p.cut}" alt="${p.name}" loading="lazy">${life}
        <span class="pc__tags"><span class="step"><b>${p.step}</b>${p.sn}</span>${p.badge ? `<span class="tag">${p.badge}</span>` : ""}</span>
      </a>
      <button class="btn btn--ink btn--block btn--sm pc__q" data-add="${id}"><span class="bt">Add to bag · ${money(p.price)}</span></button></div>
      <div class="pc__b">${stars(p.rating, p.reviews)}<h3 class="pc__t"><a href="${url(id)}">${p.name}</a></h3><p class="pc__s">${p.sub}</p>
        <div class="pc__r"><span class="pc__pr">${p.compare ? `<s>${money(p.compare)}</s>` : ""}${money(p.price)}<small>${p.size.split(" / ")[0]}</small></span>${o.pick && !p.bundle ? `<button class="pick" data-pick="${id}" aria-pressed="false">+ Routine</button>` : `<button class="btn btn--line btn--sm pc__add" data-add="${id}"><span class="bt">Add</span></button>`}</div>
      </div></article>`;
  }
  function hoverVideos(r = document) {
    if (!fine) return;
    $$(".pc", r).forEach((c) => { const v = $("video.life", c); if (!v) return; c.addEventListener("mouseenter", () => { v.play().catch(() => {}); }); c.addEventListener("mouseleave", () => { v.pause(); }); });
  }
  function videos(r = document) {
    $$(".vc", r).forEach((c) => {
      const v = $("video", c);
      if (!v) return;
      const tg = () => { $$(".vc.playing").forEach((o) => { if (o !== c) { $("video", o).pause(); o.classList.remove("playing"); } }); if (v.paused) { v.play(); c.classList.add("playing"); } else { v.pause(); c.classList.remove("playing"); } };
      $(".vc__play", c).addEventListener("click", tg);
      v.addEventListener("click", tg);
      const m = $(".vc__mute", c);
      m.addEventListener("click", () => { v.muted = !v.muted; m.innerHTML = v.muted ? I.muted : I.sound; m.setAttribute("aria-label", v.muted ? "Unmute" : "Mute"); });
    });
  }

  /* ---------------- QUIZ ---------------- */
  const quiz = { a: {}, step: 0, email: "" };
  const QS = [
    { k: "goal", q: "What's your main <span class='it'>skin goal</span>?", o: [["spots", "Fade dark spots", "Post-blemish marks, uneven tone"], ["sensitive", "Calm sensitivity", "Redness, stinging, reactive skin"], ["glow", "Get my glow back", "Dull, tired, dehydrated skin"], ["barrier", "Repair my barrier", "Dry, tight, flaky or over-treated"]], img: V2("model-hands.jpg"), lab: "Every routine starts with one goal." },
    { k: "type", q: "How does your skin <span class='it'>usually feel</span>?", o: [["oily", "Oily", "Shiny by midday"], ["combo", "Combination", "Oily T-zone, drier cheeks"], ["dry", "Dry", "Tight after cleansing"], ["normal", "Balanced", "Rarely too oily or dry"]], img: V2("apply-1.jpg"), lab: "Melanin-rich skin has its own rules." },
    { k: "react", q: "How does it react to <span class='it'>new products</span>?", o: [["rare", "Rarely reacts", "I can try most things"], ["some", "Sometimes stings", "Strong actives can be too much"], ["often", "Easily irritated", "Redness or dark marks after irritation"]], img: V2("apply-3.jpg"), lab: "On deeper skin tones, irritation can mean more dark spots." },
    { k: "steps", q: "How many steps do you <span class='it'>want</span>?", o: [["min", "Keep it minimal", "Two steps that do the most"], ["full", "The full ritual", "All four, morning and night"]], img: IMG("morning-ritual-hero.jpg"), lab: "Consistency beats complexity." },
  ];
  function openQuiz() {
    const q = $("#quiz");
    if (!q.innerHTML) buildQuiz();
    open("quiz");
  }
  function buildQuiz() {
    $("#quiz").innerHTML = `
      <div class="quiz__vis"><img id="qImg" src="${QS[0].img}" alt=""><div class="lab"><p class="kicker" style="color:var(--cream)"><i></i>Skin quiz · 60 seconds</p><strong id="qLab">${QS[0].lab}</strong></div></div>
      <div class="quiz__main">
        <div class="quiz__top"><span class="tiny mut" id="qCount">Step 1 of 5</span><div class="quiz__prog"><span id="qProg"></span></div><button class="ib" data-close aria-label="Close quiz">${I.x}</button></div>
        <div class="quiz__body">
          ${QS.map((s, i) => `<div class="qstep" data-i="${i}"><p class="kicker"><i></i>Question ${i + 1}</p><h2>${s.q}</h2><div class="qopts">${s.o.map((o) => `<button class="qopt" data-k="${s.k}" data-v="${o[0]}"><strong>${o[1]}</strong><small>${o[2]}</small></button>`).join("")}</div></div>`).join("")}
          <div class="qstep" data-i="4"><p class="kicker"><i></i>Almost there</p><h2>Your routine is <span class="it">ready</span></h2><p class="lede" style="margin-bottom:22px">Where should we send it? You'll also get <b>20% off</b> your first order.</p>
            <form class="qemail" data-qform novalidate><label class="sr-only" for="qEmail">Email</label><input class="field" id="qEmail" type="email" placeholder="Email address" autocomplete="email" required><button class="btn btn--ink" type="submit"><span class="bt">See my routine + 20% off</span></button></form>
            <button class="ulink" style="margin-top:16px" id="qSkip">Skip, just show me</button></div>
          <div class="qstep" data-i="5" id="qRes"></div>
        </div>
        <div class="quiz__nav"><button class="ulink" id="qBack">${I.l.replace("<svg", '<svg fill="none" stroke="currentColor" stroke-width="1.6"')} Back</button><span class="tiny mut">Nurse-designed · no wrong answers</span></div>
      </div>`;
    $$("#quiz .qopt").forEach((b) => b.addEventListener("click", () => {
      $$(`.qopt[data-k="${b.dataset.k}"]`).forEach((x) => x.classList.toggle("sel", x === b));
      quiz.a[b.dataset.k] = b.dataset.v;
      setTimeout(() => quizGo(quiz.step + 1), 280);
    }));
    $("#qBack").onclick = () => quizGo(Math.max(0, quiz.step - 1));
    $("#qSkip").onclick = () => quizGo(5);
    quizGo(0);
  }
  function quizGo(n) {
    quiz.step = n;
    $$("#quiz .qstep").forEach((s) => s.classList.toggle("on", +s.dataset.i === n));
    $("#qProg").style.width = Math.min(100, (n / 5) * 100) + "%";
    $("#qCount").textContent = n < 5 ? `Step ${n + 1} of 5` : "Your routine";
    $("#qBack").style.visibility = n === 0 || n === 5 ? "hidden" : "visible";
    const s = QS[Math.min(n, 3)];
    if (n <= 3) { $("#qImg").src = s.img; $("#qLab").textContent = s.lab; }
    if (n === 4) { $("#qImg").src = V2("hero-glow.jpg"); $("#qLab").textContent = "Barrier first. Glow follows."; }
    if (n === 5) quizResult();
    const cur = $(`#quiz .qstep[data-i="${n}"]`);
    if (G() && !reduce) gsap.fromTo(cur.children, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .06, ease: "power3.out" });
  }
  function quizResult() {
    const a = quiz.a, goal = a.goal || "spots";
    const hero = { spots: "serum", sensitive: "moisturizer", glow: "toner", barrier: "moisturizer" }[goal];
    const minimal = a.steps === "min";
    const pair = { spots: ["serum", "moisturizer"], sensitive: ["cleanser", "moisturizer"], glow: ["toner", "moisturizer"], barrier: ["cleanser", "moisturizer"] }[goal];
    const list = minimal ? pair : R4;
    const why = {
      spots: "Rooted Radiance targets the look of dark spots with tranexamic acid and niacinamide, while the moisturizer keeps your barrier calm — so brightening never turns into irritation.",
      sensitive: "Your skin needs comfort first. Colloidal oat, soursop leaf and triple ceramides calm and rebuild, so everything else can work without a reaction.",
      glow: "Rice ferment and ginseng bring back the glow, and ceramides lock in hydration so it lasts all day.",
      barrier: "Rebuild first: a non-stripping cleanse and a ceramide-rich seal restore what your barrier is missing.",
    }[goal];
    const sum = list.reduce((s, id) => s + P[id].price, 0);
    const price = minimal ? sum * 0.9 : 118;
    const tip = a.react === "often" ? "Because your skin reacts easily, introduce the serum 2–3 nights a week first." : a.type === "oily" ? "With oilier skin, one pump of moisturizer is plenty in the morning." : "Use morning and night, and finish with SPF in the AM.";
    $("#qRes").innerHTML = `<p class="kicker"><i></i>${quiz.email ? "Sent to " + quiz.email.replace(/</g, "") : "Your result"}</p><h2>Your Barrier-First <span class="it">${minimal ? "duo" : "ritual"}</span></h2>
      <p class="lede">${why}</p>
      <div class="qres__list">${list.map((id) => { const p = P[id]; return `<div class="qres__item ${id === hero ? "is-hero" : ""}"><span class="pi" style="background:${p.tint}"><img src="${p.cut}" alt=""></span><div><span class="step"><b>${p.step}</b>${p.sn}</span>${id === hero ? ' <span class="tag" style="box-shadow:none;background:var(--cream)">Your hero step</span>' : ""}<strong>${p.name}</strong><small>${p.sub}</small></div><span>${money(p.price)}</span></div>`; }).join("")}</div>
      <p class="small mut" style="margin:0 0 14px">Tip: ${tip}</p>
      <div class="qres__tot"><strong>${money(price)}</strong><s class="mut">${money(sum)}</s><span class="tag" style="background:var(--rose);box-shadow:none">${minimal ? "Routine discount 10%" : "Core Four · save $24"}</span></div>
      ${quiz.email ? `<p class="small" style="margin:0 0 14px">Your 20% code: <span class="code">GLOW20</span></p>` : ""}
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn--ink" id="qAdd" data-mag><span class="bt">Add my routine to bag ${I.arr}</span></button><button class="ulink" id="qRestart">Retake quiz</button></div>`;
    $("#qAdd").onclick = () => { if (minimal) list.forEach((id) => cart.add(id, 1)); else cart.add("core-four", 1); closeAll(true); setTimeout(() => open("cart"), 350); };
    $("#qRestart").onclick = () => { quiz.a = {}; $$("#quiz .qopt").forEach((x) => x.classList.remove("sel")); quizGo(0); };
  }

  /* ================= HOME (v3) ================= */
  function home() {
    // hero product carousel tile
    const hc = $("#heroCar");
    if (hc) {
      const ids = R4;
      hc.innerHTML = ids.map((id, k) => `<a class="hcar__i ${k ? "" : "on"}" href="${url(id)}" data-cursor="Shop"><img src="${P[id].cut}" alt="${P[id].name}"></a>`).join("") + `<div class="hcar__meta">${ids.map((id, k) => `<div class="hcar__m ${k ? "" : "on"}"><span class="step"><b>${P[id].step}</b>${P[id].sn}</span><strong>${P[id].short}</strong><span>${money(P[id].price)}</span></div>`).join("")}</div><div class="hcar__dots">${ids.map((_, k) => `<button class="${k ? "" : "on"}" aria-label="Show ${P[ids[k]].short}"></button>`).join("")}</div>`;
      const its = $$(".hcar__i", hc), ms = $$(".hcar__m", hc), ds = $$(".hcar__dots button", hc);
      let i = 0, t;
      const show = (n) => {
        const prev = i; i = (n + its.length) % its.length;
        [its, ms, ds].forEach((arr) => arr.forEach((x, k) => x.classList.toggle("on", k === i)));
        if (G() && !reduce) { gsap.fromTo(its[i], { yPercent: 18, rotate: 8, opacity: 0, scale: .9 }, { yPercent: 0, rotate: 0, opacity: 1, scale: 1, duration: 1, ease: "power4.out" }); gsap.to(its[prev], { yPercent: -14, rotate: -8, opacity: 0, duration: .5, ease: "power2.in" }); }
      };
      const loop = () => { clearInterval(t); if (!reduce) t = setInterval(() => !document.hidden && show(i + 1), 2800); };
      ds.forEach((d, k) => (d.onclick = () => { show(k); loop(); }));
      hc.addEventListener("mouseenter", () => clearInterval(t));
      hc.addEventListener("mouseleave", loop);
      loop();
    }

    // horizontal Core Four gallery
    const hs = $("#hTrack");
    if (hs) {
      hs.innerHTML = R4.map((id) => { const p = P[id]; return `
        <article class="hcard" style="--tint:${p.tint}">
          <div class="hcard__top"><span class="hcard__n">${p.step}</span><span class="step">${p.sn}</span></div>
          <a class="hcard__img" href="${url(id)}" data-cursor="View"><img src="${p.cut}" alt="${p.name}" loading="lazy"></a>
          <div class="hcard__b">
            ${stars(p.rating, p.reviews)}
            <h3><a href="${url(id)}">${p.name}</a></h3>
            <p>${p.sub}</p>
            <div class="hcard__ings">${p.ing.slice(0, 3).map((x) => `<span>${x[0]}</span>`).join("")}</div>
            <div class="hcard__r"><strong>${money(p.price)} <small>${p.size.split(" / ")[0]}</small></strong><button class="btn btn--ink btn--sm" data-add="${id}"><span class="bt">Add to bag</span></button></div>
          </div>
        </article>`; }).join("") + `
        <article class="hcard hcard--bundle">
          <div class="hcard__top"><span class="hcard__n">01—04</span><span class="tag">Save $24</span></div>
          <a class="hcard__img" href="${url("core-four")}" data-cursor="View"><img src="${P["core-four"].cut}" alt="The Core Four" loading="lazy"></a>
          <div class="hcard__b"><h3>The Core Four</h3><p>All four steps, in order. Free shipping.</p><div class="hcard__r"><strong>$118 <s>$142</s></strong><button class="btn btn--rose btn--sm" data-add="core-four"><span class="bt">Add routine</span></button></div></div>
        </article>`;
    }

    // traditions expanding panels
    $$(".panel").forEach((p) => {
      const act = () => $$(".panel").forEach((x) => { x.classList.toggle("on", x === p); x.setAttribute("aria-expanded", x === p); });
      p.addEventListener("mouseenter", () => fine && act());
      p.addEventListener("click", act);
      p.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), act()));
    });

    // finder chips (quiz banner)
    const fc = $("#finderChips");
    if (fc) {
      const map = { spots: "serum", sensitive: "moisturizer", glow: "toner", barrier: "cleanser" };
      const set = (k) => {
        $$(".chip", fc).forEach((c) => { c.classList.toggle("on", c.dataset.k === k); c.setAttribute("aria-pressed", c.dataset.k === k); });
        const p = P[map[k]];
        const r = $("#rec");
        r.innerHTML = `<span class="rec__img" style="background:${p.tint}"><img src="${p.cut}" alt=""></span><div><span class="step"><b>${p.step}</b>${p.sn}</span><strong>Start with ${p.name}</strong><small>${p.sub}</small></div><div class="rec__r"><strong>${money(p.price)}</strong><button class="btn btn--ink btn--sm" data-add="${p.id}"><span class="bt">Add</span></button></div>`;
        if (G() && !reduce) gsap.fromTo(r, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: "power3.out" });
      };
      $$(".chip", fc).forEach((c) => c.addEventListener("click", () => set(c.dataset.k)));
      set("spots");
    }

    // flip cards (tap on touch)
    $$(".flip").forEach((f) => f.addEventListener("click", (e) => { if (e.target.closest("a, button[data-add]")) return; f.classList.toggle("flipped"); f.setAttribute("aria-pressed", f.classList.contains("flipped")); }));

    // UGC grid
    const ugc = $("#ugc");
    if (ugc) {
      const V = [["core-four", "“And this is our Core Four”"], ["serum", "“Never change — this is our serum”"], ["cleanser", "Unboxing: the cleanser packaging"], ["moisturizer", "“Lastly, our moisturizer”"]];
      ugc.innerHTML = V.map(([id, cap]) => { const p = P[id]; return `<div class="vc"><div class="vc__m" data-cursor="Play"><video src="${p.video}" poster="${p.poster}" muted playsinline loop preload="none" aria-label="${cap}"></video><button class="vc__play" aria-label="Play: ${cap}"><span>${I.play}</span></button><button class="vc__mute" aria-label="Unmute">${I.muted}</button><p class="vc__cap">${cap}</p></div><a class="vc__p" href="${url(id)}"><span class="pi" style="background:${p.tint}"><img src="${p.cut}" alt=""></span><span><strong>${p.short}</strong><small>${money(p.price)} · ★ ${p.rating.toFixed(1)}</small></span>${I.arr}</a></div>`; }).join("");
      videos(ugc);
      if (fine) $$(".vc", ugc).forEach((c) => { const v = $("video", c); c.addEventListener("mouseenter", () => { if (!c.classList.contains("playing")) { v.play().catch(() => {}); } }); c.addEventListener("mouseleave", () => { if (!c.classList.contains("playing")) v.pause(); }); });
    }

    // reviews rail
    const rr = $("#rvRail");
    if (rr) {
      rr.innerHTML = REV.map((r) => { const p = P[r.p]; return `<figure class="rcard">${stars(5).replace(/<span>5\.0<\/span>/, "")}<blockquote>“${r.t}”</blockquote><figcaption class="rcard__who"><img src="${r.a}" alt="" loading="lazy"><div><b>${r.n}</b><span>${r.s}</span></div><span class="verified">${I.check}Verified</span></figcaption><a class="rcard__p" href="${url(p.id)}"><span class="pi" style="background:${p.tint}"><img src="${p.cut}" alt=""></span><span><strong>${p.short}</strong><small>${money(p.price)}</small></span>${I.arr}</a></figure>`; }).join("");
      railCtl(rr, $("#rvPrev"), $("#rvNext"), $("#rvProg"));
      dragRail(rr);
    }
  }
  function railCtl(r, pv, nx, prog) {
    const step = () => (r.firstElementChild ? r.firstElementChild.getBoundingClientRect().width + 16 : 300);
    pv && (pv.onclick = () => r.scrollBy({ left: -step(), behavior: "smooth" }));
    nx && (nx.onclick = () => r.scrollBy({ left: step(), behavior: "smooth" }));
    const up = () => { const m = r.scrollWidth - r.clientWidth, p = m > 0 ? r.scrollLeft / m : 0; if (prog) prog.style.transform = `scaleX(${Math.max(.08, p)})`; if (pv) pv.disabled = r.scrollLeft < 4; if (nx) nx.disabled = r.scrollLeft > m - 4; };
    r.addEventListener("scroll", up, { passive: true }); addEventListener("resize", up); up();
  }

  /* ================= SHOP (v3) ================= */
  function shop() {
    const g = $("#grid");
    if (!g) return;
    const b = P["core-four"];
    g.innerHTML = `<article class="feat pc" data-c="${b.c.join(" ")}" data-price="${b.price}" data-step="00" data-id="core-four">
        <a class="feat__m" href="${url("core-four")}" data-cursor="View"><img src="${b.cut}" alt="The Core Four routine" loading="lazy"></a>
        <div class="feat__b"><span class="tag">Best value · save $24</span><h2>THE CORE <span class="rose">FOUR</span></h2>${stars(b.rating, b.reviews)}<p class="mut" style="margin:0">Everything you need to target the look of dark spots and strengthen your barrier — in order.</p><div class="feat__steps">${R4.map((id) => `<span class="step"><b>${P[id].step}</b>${P[id].sn}</span>`).join("")}</div><div class="feat__pr"><strong>$118</strong><s>$142</s><span class="small mut">Free shipping</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn--ink" data-add="core-four"><span class="bt">Add routine to bag</span></button><a class="btn btn--line" href="${url("core-four")}"><span class="bt">Details</span></a></div></div>
      </article>${R4.map((id) => card(id, { pick: true })).join("")}`;
    hoverVideos(g);
    const chips = $$(".tools .chip");
    const filt = (k) => {
      chips.forEach((c) => { c.classList.toggle("on", c.dataset.k === k); c.setAttribute("aria-pressed", c.dataset.k === k); });
      let n = 0;
      $$(".pc", g).forEach((c) => { const hit = k === "all" || c.dataset.c.includes(k); c.classList.toggle("hid", !hit); if (hit) n++; });
      $("#count").textContent = n + (n === 1 ? " product" : " products");
      if (G() && !reduce) gsap.fromTo($$(".pc:not(.hid)", g), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .06, ease: "power3.out" });
      window.ScrollTrigger && ScrollTrigger.refresh();
    };
    chips.forEach((c) => c.addEventListener("click", () => filt(c.dataset.k)));
    $("#sort").addEventListener("change", (e) => { const v = e.target.value; const it = $$(".pc:not(.feat)", g); it.sort((a, z) => v === "low" ? a.dataset.price - z.dataset.price : v === "high" ? z.dataset.price - a.dataset.price : a.dataset.step.localeCompare(z.dataset.step)); it.forEach((x) => g.appendChild(x)); });

    const picked = new Set();
    const tray = $("#tray");
    const draw = () => {
      $$("[data-pick]").forEach((b) => { const on = picked.has(b.dataset.pick); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); b.textContent = on ? "✓ In routine" : "+ Routine"; });
      const n = picked.size, ids = R4.filter((id) => picked.has(id));
      const sum = ids.reduce((s, id) => s + P[id].price, 0);
      const off = n === 4 ? 24 : (TIERS[n] || 0) * sum;
      tray.classList.toggle("on", n > 0);
      tray.innerHTML = `<p class="tray__h">Build your routine</p><div class="tray__slots">${R4.map((id) => picked.has(id) ? `<button class="tray__slot f" data-pick="${id}" aria-label="Remove ${P[id].short}"><img src="${P[id].cut}" alt=""></button>` : `<button class="tray__slot" data-pick="${id}" aria-label="Add ${P[id].short}">${P[id].step}<small>${P[id].sn}</small></button>`).join("")}</div>
        <div class="tray__txt"><strong>${n < 2 ? (n ? "Add 1 more step" : "Pick 2+ steps to save") : `${money(sum - off)} <s>${money(sum)}</s>`}</strong><small>${n === 0 ? "2 steps −10% · 3 steps −15% · all 4 −$24" : n === 1 ? "Unlock 10% off with 2 steps" : n === 2 ? "Saving 10% · add 1 more for 15%" : n === 3 ? "Saving 15% · add the last step to save $24" : "Core Four price — saving $24"}</small></div>
        <button class="btn btn--ink btn--block" id="trayAdd" ${n ? "" : "disabled"}><span class="bt">Add ${n || ""} to bag</span></button>`;
      $("#trayAdd").onclick = () => { if (!n) return; if (n === 4) cart.add("core-four"); else ids.forEach((id) => cart.add(id)); picked.clear(); draw(); open("cart"); };
    };
    document.addEventListener("click", (e) => { const b = e.target.closest("[data-pick]"); if (!b) return; e.preventDefault(); const id = b.dataset.pick; picked.has(id) ? picked.delete(id) : picked.add(id); draw(); });
    draw();

    const ct = $("#ctab");
    if (ct) {
      const rows = [["Dark spots & uneven tone", { serum: 2, toner: 1 }], ["Sensitivity & redness", { moisturizer: 2, cleanser: 1, toner: 1 }], ["Dullness & glow", { toner: 2, serum: 1 }], ["Dryness & weak barrier", { moisturizer: 2, toner: 1, cleanser: 1 }], ["Gentle daily cleansing", { cleanser: 2 }]];
      ct.innerHTML = `<thead><tr><th>Concern</th>${R4.map((id) => `<th><a href="${url(id)}"><span class="ctab__img" style="background:${P[id].tint}"><img src="${P[id].cut}" alt="" loading="lazy"></span><span class="step"><b>${P[id].step}</b>${P[id].sn}</span></a></th>`).join("")}</tr></thead><tbody>${rows.map(([n, m]) => `<tr><td>${n}</td>${R4.map((id) => `<td>${m[id] === 2 ? '<span class="dot" title="Best for"></span>' : m[id] ? '<span class="dot half" title="Helps"></span>' : ""}</td>`).join("")}</tr>`).join("")}</tbody>`;
    }
  }

  /* ================= PRODUCT (v3) ================= */
  function pdp() {
    const id = new URLSearchParams(location.search).get("p");
    const p = P[id] || P.serum, isB = !!p.bundle;
    document.title = `${p.name} | Unpopular You`;
    const md = $('meta[name="description"]'); if (md) md.content = p.sub;
    $("#crumb").innerHTML = `<a href="shop/">Shop</a><span>/</span><span>${p.short}</span>`;

    // slider gallery
    const slides = [{ t: "cut", s: p.cut }].concat(p.life.map((s) => ({ t: "img", s }))).concat(p.video ? [{ t: "vid", s: p.video, po: p.poster }] : p.cutBox ? [{ t: "box", s: p.cutBox }] : []);
    $("#gMain").innerHTML = `<div class="gs__track">${slides.map((x, k) => `<div class="gs__s ${x.t === "cut" || x.t === "box" ? "gs__s--cut" : ""}" style="${x.t === "cut" || x.t === "box" ? `background:${p.tint}` : ""}" aria-label="Image ${k + 1} of ${slides.length}">${x.t === "vid" ? `<video src="${x.s}" poster="${x.po}" muted playsinline loop preload="none"></video>` : `<img class="${x.t === "cut" ? "cut " + (p.wide ? "wide" : "") : x.t === "box" ? "cut" : ""}" src="${x.s}" alt="${k ? "" : p.name}" ${k ? 'loading="lazy"' : 'fetchpriority="high"'}>`}</div>`).join("")}</div>
      <span class="gs__tags"><span class="step"><b>${p.step}</b>${p.sn}</span>${p.badge ? `<span class="tag">${p.badge}</span>` : ""}</span>
      <button class="gs__nav gs__nav--p" aria-label="Previous image">${I.l.replace("<svg", '<svg fill="none" stroke="currentColor" stroke-width="1.6"')}</button><button class="gs__nav gs__nav--n" aria-label="Next image">${I.r.replace("<svg", '<svg fill="none" stroke="currentColor" stroke-width="1.6"')}</button>
      <span class="gs__count" id="gsCount">01 / ${String(slides.length).padStart(2, "0")}</span>`;
    $("#gThumbs").innerHTML = slides.map((x, k) => `<button class="${k ? "" : "on"}" aria-label="View image ${k + 1}" style="${x.t === "cut" || x.t === "box" ? `background:${p.tint}` : ""}"><img src="${x.t === "vid" ? x.po : x.s}" alt="" loading="lazy" class="${x.t === "cut" || x.t === "box" ? "c" : ""}"></button>`).join("");
    const tr = $(".gs__track"); let gi = 0;
    const go = (n) => { gi = (n + slides.length) % slides.length; tr.style.transform = `translateX(${-gi * 100}%)`; $$("#gThumbs button").forEach((b, k) => b.classList.toggle("on", k === gi)); $("#gsCount").textContent = `${String(gi + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`; const v = $("video", tr); if (v) { slides[gi].t === "vid" ? v.play().catch(() => {}) : v.pause(); } };
    $(".gs__nav--p").onclick = () => go(gi - 1); $(".gs__nav--n").onclick = () => go(gi + 1);
    $$("#gThumbs button").forEach((b, k) => (b.onclick = () => go(k)));
    swipe($("#gMain"), () => go(gi - 1), () => go(gi + 1));

    // buy box (no accordions — details live in tabs below)
    $("#buy").innerHTML = `
      <div class="buy__rate">${stars(p.rating, p.reviews)}<a href="#reviews">Read reviews</a></div>
      <h1>${p.name.toUpperCase()}</h1><p class="buy__sub">${p.sub}</p>
      <div class="buy__pr"><strong id="bPr">${money(p.price)}</strong>${p.compare ? `<s>${money(p.compare)}</s>` : ""}<span class="sz">${p.size}</span></div>
      <ul class="ticks">${p.ticks.map((t) => `<li>${I.tick}<span>${t}</span></li>`).join("")}</ul>
      <div class="opts" role="radiogroup" aria-label="Purchase option">
        <label class="opt"><input type="radio" name="o" value="one" checked><span><strong>One-time</strong><small>${money(p.price)}</small></span></label>
        <label class="opt"><span class="opt__flag">−15%</span><input type="radio" name="o" value="sub"><span><strong>Subscribe</strong><small>${money(p.price * (1 - SUB))} · every 60 days</small></span></label>
        ${isB ? "" : `<label class="opt opt--b"><span class="opt__flag">Best value</span><input type="radio" name="o" value="bundle"><span><strong>Core Four</strong><small>All 4 · $118 <s>$142</s></small></span></label>`}
      </div>
      <div class="buy__row"><span class="qty"><button id="qm" aria-label="Decrease">−</button><span id="qv">1</span><button id="qp" aria-label="Increase">+</button></span><button class="btn btn--ink" id="atc" data-mag data-add="${p.id}"><span class="bt">Add to bag · <span id="atcP">${money(p.price)}</span></span></button></div>
      <div class="micro"><span>${I.truck}Free US shipping over $${FREE}</span><span>${I.lock}Secure checkout</span><span>${I.ret}30-day guarantee</span></div>
      <div class="pay">${pay()}</div>
      <div class="offer"><p><strong>New here?</strong> Get 20% off your first order.</p><button data-signup>Unlock 20%</button></div>
      <div class="vrow"><span>Cruelty-free</span><span>Fragrance-free</span><span>Made in the USA</span><span>Sensitive-skin friendly</span></div>`;
    let qty = 1;
    const atc = $("#atc");
    const sync = () => {
      const o = ($('input[name="o"]:checked') || {}).value || "one";
      const pid = o === "bundle" ? "core-four" : p.id, sub = o === "sub";
      const unit = P[pid].price * (sub ? 1 - SUB : 1);
      atc.dataset.add = pid; atc.dataset.qty = qty; atc.dataset.sub = sub ? "1" : "0";
      atc.innerHTML = `<span class="bt">Add to bag · <span id="atcP">${money(unit * qty)}</span></span>`;
      $("#qv").textContent = qty; $("#bPr").textContent = money(unit);
      const sb = $("#satcBtn"); sb.dataset.add = pid; sb.dataset.qty = qty; sb.dataset.sub = atc.dataset.sub;
      $("#satcP").textContent = `${money(unit)} · ${P[pid].size}`;
    };
    $("#qm").onclick = () => { qty = Math.max(1, qty - 1); sync(); };
    $("#qp").onclick = () => { qty = Math.min(9, qty + 1); sync(); };
    $$('input[name="o"]').forEach((r) => r.addEventListener("change", sync));
    atc.addEventListener("click", () => setTimeout(sync, 1450));
    $("#satc").innerHTML = `<span class="satc__i" style="background:${p.tint}"><img src="${p.cut}" alt=""></span><div><strong>${p.name}</strong><small id="satcP"></small></div><button class="btn btn--ink" id="satcBtn" data-add="${p.id}"><span class="bt">Add to bag</span></button>`;
    sync();
    const mob = matchMedia("(max-width: 1000px)");
    new IntersectionObserver(([e]) => $("#satc").classList.toggle("on", !e.isIntersecting && (mob.matches ? scrollY > 40 || e.boundingClientRect.top > innerHeight : e.boundingClientRect.top < 0)), { threshold: 0 }).observe(atc);

    // tabs
    const tabs = [["Benefits", `<div class="tabs__2"><p class="lede">${p.desc}</p><ul class="tlist">${p.ticks.map((t) => `<li>${I.tick}${t}</li>`).join("")}</ul></div>`], ["Ingredients", `<div class="chiplist">${p.ing.map((x) => `<span>${x[0]}</span>`).join("")}</div><p class="mut">${isB ? "See each product page for full ingredient lists." : "Full INCI list to be supplied by Unpopular You."} Fragrance-free · cruelty-free.</p>`], ["How to use", `<ol class="howto">${p.how.map((h) => `<li>${h}</li>`).join("")}</ol>`], ["Shipping & returns", `<p class="lede">Free US shipping over $${FREE}. Ships in 1–2 business days. 30-day happiness guarantee.</p>`]];
    $("#tabs").innerHTML = `<div class="tabs__l" role="tablist">${tabs.map((t, k) => `<button role="tab" id="tb${k}" aria-controls="tp${k}" aria-selected="${!k}" class="${k ? "" : "on"}">${t[0]}</button>`).join("")}<span class="tabs__ind"></span></div>${tabs.map((t, k) => `<div class="tabs__p" role="tabpanel" id="tp${k}" aria-labelledby="tb${k}" ${k ? "hidden" : ""}>${t[1]}</div>`).join("")}`;
    const tbs = $$("#tabs [role=tab]"), ind = $(".tabs__ind");
    const tset = (k, anim) => { tbs.forEach((b, j) => { b.classList.toggle("on", j === k); b.setAttribute("aria-selected", j === k); }); $$("#tabs .tabs__p").forEach((x, j) => (x.hidden = j !== k)); const b = tbs[k]; ind.style.width = b.offsetWidth + "px"; ind.style.transform = `translateX(${b.offsetLeft}px)`; if (anim && G() && !reduce) gsap.fromTo($$("#tabs .tabs__p")[k], { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: "power3.out" }); };
    tbs.forEach((b, k) => b.addEventListener("click", () => tset(k, true)));
    requestAnimationFrame(() => tset(0)); addEventListener("resize", () => tset(tbs.findIndex((b) => b.classList.contains("on"))));

    // ingredient bento
    const tex = [V2("tex-serum.jpg"), V2("tex-cream.jpg"), V2("tex-trio.jpg"), V2("tex-leaves.jpg"), V2("apply-2.jpg")];
    $("#ibento").innerHTML = p.ing.slice(0, 5).map((x, k) => `<div class="ib__t ${k === 0 ? "ib__t--big" : ""}" data-r>${k === 0 ? `<img src="${tex[k % tex.length]}" alt="" loading="lazy">` : ""}<span class="ib__n">${String(k + 1).padStart(2, "0")}</span><div><span class="tag">${x[1]}</span><h3>${x[0].toUpperCase()}</h3><p>${x[2]}</p></div></div>`).join("") + (Math.min(p.ing.length, 5) - 1 >= 4 ? "" : `<div class="ib__t ib__t--prod" style="background:${p.tint};--span:${4 - (Math.min(p.ing.length, 5) - 1)}" data-r><img src="${p.cut}" alt="" loading="lazy"></div>`);

    // complete routine
    $("#ctr").innerHTML = R4.map((rid, k) => { const r = P[rid], cur = rid === p.id; return `<div class="ctr__c ${cur ? "cur" : ""}"><span class="ctr__line"></span><a class="ctr__m" href="${url(rid)}" style="background:${r.tint}" data-cursor="View"><img src="${r.cut}" alt="${r.name}" loading="lazy"></a><span class="step"><b>${r.step}</b>${r.sn}</span><strong><a href="${url(rid)}">${r.name}</a></strong><div class="ctr__r"><span>${money(r.price)}</span>${cur || isB ? (cur ? '<span class="tag">You\'re here</span>' : "") : `<button class="plus" data-add="${rid}" aria-label="Add ${r.name}">+</button>`}</div></div>`; }).join("");
    $("#ctrCta").innerHTML = isB ? `<p><b>All four steps included</b> — each one designed to layer with the next.</p><button class="btn btn--rose" data-add="core-four"><span class="bt">Add the routine · $118</span></button>` : `<p><b>Get all 4 for $118</b> — save $24. Or any 2 for −10%, any 3 for −15%.</p><button class="btn btn--rose" data-add="core-four"><span class="bt">Upgrade to the Core Four</span></button>`;

    // FAQ
    const f = [[`Is ${isB ? "the routine" : "it"} suitable for sensitive skin?`, "Yes — every formula is fragrance-free and built barrier-first. Patch test for 24 hours before starting anything new."], p.id === "serum" || isB ? ["Will it help with dark spots and hyperpigmentation?", "That's who it's for. Tranexamic acid and niacinamide target the look of dark spots gently, without the irritation that can cause more pigmentation on melanin-rich skin. Wear SPF daily."] : ["Where does it fit in my routine?", `Step ${p.step} — ${p.sn}. ${p.how[p.how.length - 1]}`], ["How and when should I use it?", p.how.join(" ")], ["How long before I see results?", "Softer, more comfortable skin within a week; changes in dark spots and tone take 6–8 weeks of consistent use. Results vary."], ["Can I use it with the rest of the routine?", "Yes — the four steps layer in order: 01 Cleanse, 02 Prep, 03 Correct, 04 Seal."], ["Is it safe during pregnancy or breastfeeding?", "Please check with your doctor or midwife before using any new skincare while pregnant or breastfeeding."]];
    $("#pfaq").innerHTML = f.map((x, k) => accH(x[0], `<p>${x[1]}</p>`, k === 0)).join("");
    acc($("#pfaq"));

    // reviews + related
    const list = REV.filter((r) => r.p === p.id || r.p === "core-four" || isB).slice(0, 3);
    while (list.length < 3) list.push(REV.find((r) => !list.includes(r)));
    $("#rsum").innerHTML = `<div class="rsum__n">${p.rating.toFixed(1)}</div><div>${stars(p.rating, p.reviews)}<div class="rbars">${[5, 4, 3, 2, 1].map((s) => `<div><span>${s} ★</span><i><b style="width:${s === 5 ? 90 : s === 4 ? 10 : 0}%"></b></i><span>${s === 5 ? Math.max(1, p.reviews - 1) : s === 4 ? 1 : 0}</span></div>`).join("")}</div></div><button class="btn btn--line btn--sm"><span class="bt">Write a review</span></button>`;
    $("#rgrid").innerHTML = list.map((r) => `<figure class="rcard" data-r>${stars(5).replace(/<span>5\.0<\/span>/, "")}<blockquote>“${r.t}”</blockquote><figcaption class="rcard__who"><img src="${r.a}" alt="" loading="lazy"><div><b>${r.n}</b><span>${r.s}</span></div><span class="verified">${I.check}Verified</span></figcaption></figure>`).join("");
    $("#rel").innerHTML = (isB ? R4 : ["core-four", ...R4.filter((r) => r !== p.id)]).map((rid) => card(rid, { r: true })).join("");
    hoverVideos($("#rel"));
  }

  /* ================= MOTION (v3) ================= */
  function splitWords(el) {
    const walk = (n) => Array.from(n.childNodes).forEach((c) => {
      if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach((t) => { if (!t) return; if (/^\s+$/.test(t)) f.appendChild(document.createTextNode(t)); else { const s = document.createElement("span"); s.className = "w"; s.textContent = t; f.appendChild(s); } }); c.replaceWith(f); }
      else if (c.nodeType === 1 && c.tagName !== "BR") walk(c);
    });
    walk(el);
    return $$(".w", el);
  }
  function maskWords(el) {
    const ws = splitWords(el);
    ws.forEach((w) => { const m = document.createElement("span"); m.className = "line-mask"; m.style.display = "inline-block"; w.replaceWith(m); m.appendChild(w); });
    return ws;
  }

  function motion() {
    $$("[data-fill]").forEach((el) => splitWords(el));
    if (!G() || reduce) { $$("[data-r]").forEach((e) => { e.style.opacity = 1; e.style.transform = "none"; }); $$("[data-fill] .w").forEach((w) => (w.style.opacity = 1)); return; }
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      root.classList.add("lenis");
    }
    ScrollTrigger.batch("[data-r]", { start: "top 90%", onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: .08, ease: "power4.out", overwrite: "auto" }) });

    $$("[data-split]").forEach((h) => {
      const ws = maskWords(h);
      const inHero = h.closest(".bento, .chero, .pdp");
      gsap.from(ws, { yPercent: 115, duration: 1.1, stagger: .04, ease: "power4.out", delay: inHero ? .15 : 0, scrollTrigger: inHero ? null : { trigger: h, start: "top 88%" } });
    });

    // bento hero entrance
    if ($(".bento")) {
      gsap.from(".bento__t", { y: 60, opacity: 0, scale: .96, duration: 1.2, stagger: .09, ease: "power4.out" });
      gsap.from(".bento__img img", { scale: 1.25, duration: 2, ease: "power3.out" });
      gsap.to(".bento__img img", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".bento", start: "top top", end: "bottom top", scrub: true } });
      gsap.from(".bento__float", { y: 30, opacity: 0, duration: 1, delay: .9, ease: "power3.out" });
      gsap.to(".bento__float", { y: -10, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
    }
    // text fill
    $$("[data-fill]").forEach((el) => gsap.to($$(".w", el), { opacity: 1, stagger: .08, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } }));
    // barrier rings
    if ($("#rings")) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: "#rings", start: "top 75%", once: true } });
      tl.from("#rings .lr", { scale: 0, opacity: 0, duration: 1.4, stagger: .18, ease: "back.out(1.4)", transformOrigin: "50% 50%" })
        .from("#rings .lr__lab", { y: 16, opacity: 0, duration: .7, stagger: .12, ease: "power3.out" }, .6);
      gsap.to("#rings .lr--o", { rotate: 360, duration: 60, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
    }
    // horizontal Core Four
    const hs = $(".hscroll");
    if (hs) {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1001px)", () => {
        const tr = $("#hTrack");
        const dist = () => tr.scrollWidth - innerWidth + parseFloat(getComputedStyle(tr).paddingLeft);
        const tw = gsap.to(tr, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: hs, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, onUpdate: (s) => gsap.set("#hProg", { scaleX: Math.max(.04, s.progress) }) } });
        $$(".hcard img", tr).forEach((im) => gsap.fromTo(im, { rotate: -6, y: 30 }, { rotate: 6, y: -30, ease: "none", scrollTrigger: { trigger: im.closest(".hcard"), containerAnimation: tw, start: "left right", end: "right left", scrub: true } }));
        return () => {};
      });
    }
    // parallax
    $$("[data-px]").forEach((el) => gsap.fromTo(el, { yPercent: -(+el.dataset.px || 8) }, { yPercent: +el.dataset.px || 8, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));
    // tiles scale-in on scroll
    $$("[data-zoom]").forEach((el) => gsap.from(el, { scale: .92, borderRadius: 60, duration: 1.4, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 85%" } }));
    // count-ups
    $$("[data-count]").forEach((el) => { const to = +el.dataset.count, o = { v: 0 }; gsap.to(o, { v: to, duration: 2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true }, onUpdate: () => (el.textContent = Math.round(o.v)) }); });
    // bars in stats
    $$(".sbar i").forEach((b) => gsap.from(b, { scaleX: 0, transformOrigin: "left", duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: b, start: "top 90%" } }));
    // bundle
    if ($(".bun3__img")) gsap.from(".bun3__img img", { y: 80, scale: .85, opacity: 0, duration: 1.6, ease: "power4.out", scrollTrigger: { trigger: ".bun3", start: "top 75%" } });
    // marquee velocity
    const mqs = $$(".mq .mq__t");
    if (mqs.length && lenis) lenis.on("scroll", ({ velocity }) => mqs.forEach((m) => (m.style.animationDuration = Math.max(14, 44 - Math.abs(velocity) * 2) + "s")));
    // final CTA
    if ($(".final3")) gsap.from(".final3", { clipPath: "inset(12% 8% 12% 8% round 60px)", duration: 1.6, ease: "power4.out", scrollTrigger: { trigger: ".final3", start: "top 85%" } });
    gsap.from(".ft__mark svg", { yPercent: 70, duration: 1.6, ease: "power4.out", scrollTrigger: { trigger: ".ft__mark", start: "top 98%" } });
    if ($(".pdp")) { gsap.from(".gs, .gs__thumbs", { y: 40, opacity: 0, duration: 1.1, ease: "power4.out" }); gsap.from("#buy > *", { y: 24, opacity: 0, duration: .9, stagger: .04, ease: "power3.out", delay: .15 }); }
    if ($(".tl")) { const s = $$(".tl__s"); gsap.to(".tl__line", { width: "100%", ease: "none", scrollTrigger: { trigger: ".tl", start: "top 75%", end: "bottom 55%", scrub: true, onUpdate: (st) => s.forEach((x, i) => x.classList.toggle("on", st.progress >= i / s.length)) } }); }
    addEventListener("load", () => ScrollTrigger.refresh());
  }

  /* ---------------- preloader ---------------- */
  function preloader() {
    const pre = $("#pre");
    if (!pre) return;
    let seen = false; try { seen = sessionStorage.getItem("uy2_pre"); sessionStorage.setItem("uy2_pre", "1"); } catch (e) {}
    if (seen || reduce || !G()) { pre.classList.add("gone"); return; }
    window.__pre = true;
    $(".pre__logo", pre).innerHTML = LOGO;
    const c = { v: 0 };
    gsap.timeline({ onComplete: () => pre.classList.add("gone") })
      .from(".pre__logo svg", { yPercent: 110, duration: .9, ease: "power4.out" })
      .to(c, { v: 100, duration: .9, ease: "power2.inOut", onUpdate: () => ($(".pre__count", pre).textContent = Math.round(c.v) + "%") }, 0)
      .to(".pre__in", { yPercent: -40, opacity: 0, duration: .6, ease: "power3.in" }, .95)
      .to(pre, { clipPath: "inset(0 0 100% 0)", duration: .9, ease: "power4.inOut" }, 1.05);
  }

  /* ---------------- boot ---------------- */
  chrome();
  renderCart();
  ann();
  preloader();
  if (page === "home") home();
  if (page === "shop") shop();
  if (page === "product") pdp();
  acc();
  motion();
  header();
  cursor();
  magnetic();
})();
