(() => {
  const CDN = 'https://cdn.shopify.com/s/files/1/1082/3408/0595/files/';
  const im = (f, w = 700) => `${CDN}${f}&width=${w}`;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ft = n => n.toLocaleString('de-DE') + ' Ft';
  const UNIT = 8990, UNIT_CMP = 17980, FREE_SHIP = 14990, GIFT = 24990, SHIP = 1490, PROT = 890, GIFT_VAL = 3890;
  const ORDER = ['lung', 'energy', 'liver', 'sleep'];

  /* ================= DATA ================= */
  const F = {
    lung: { c: '#5aa53c', bg: '#e4f1d8', cut: 'uj.webp?v=1788009251', pack: 'Gyogynovenyestudotisztito30naposgaranciaval.webp?v=1794946867', herb: 'ezgif-3efcab05e8584b9b.webp?v=1788541053',
      name: { hu: 'Tüdőtisztító', en: 'Lung Cleanse' }, time: { hu: 'Bármikor', en: 'Any time' },
      tag: { hu: 'Friss, mentás formula a légutak támogatására.', en: 'A fresh, minty formula to support your airways.' },
      herbs: { hu: ['Ökörfarkkóró', 'Kakukkfű', 'Menta'], en: ['Mullein', 'Thyme', 'Mint'] }, rating: 4.9, rc: 612 },
    energy: { c: '#ef8a1f', bg: '#fde6c8', cut: 'ezgif-12dcdb7b1051afe8.webp?v=1788634410', pack: 'ezgif-856b1e34197a4520.webp?v=1788516083', herb: 'ezgif-38f1f834de31b8d3.webp?v=1788541059',
      name: { hu: 'Energizáló', en: 'Energy Boost' }, time: { hu: 'Reggel', en: 'Morning' },
      tag: { hu: 'Frissítő, kávés formula a lendületesebb napokért.', en: 'A refreshing coffee formula for days with more momentum.' },
      herbs: { hu: ['Guarana', 'Zöld tea', 'Kávébab', 'Mentol'], en: ['Guarana', 'Green tea', 'Coffee bean', 'Menthol'] }, rating: 4.8, rc: 341 },
    liver: { c: '#8a5cc0', bg: '#ece2f7', cut: 'ezgif-3b6a1156b1892a5d.webp?v=1788542558', pack: 'ezgif-500d27a7d1bbc338.webp?v=1788618795', herb: 'ezgif-37ca167824935917.webp?v=1788541041',
      name: { hu: 'Májtámogató', en: 'Liver Support' }, time: { hu: 'Napközben', en: 'Daytime' },
      tag: { hu: 'Gyógynövényes formula a mindennapi egyensúlyért.', en: 'A herbal formula for everyday balance.' },
      herbs: { hu: ['Máriatövis', 'Articsóka', 'Gyermekláncfű', 'Kamilla'], en: ['Milk thistle', 'Artichoke', 'Dandelion', 'Chamomile'] }, rating: 4.8, rc: 187 },
    sleep: { c: '#3f7fd0', bg: '#dde9f9', cut: 'Kaching-Bundles-ezgif-1cedbac2471da28e.webp?v=1788775577', pack: 'ezgif-8654bea4d0addf27.webp?v=1788516101', herb: 'ezgif-3b0f6f6dbb1b410d.webp?v=1788541063',
      name: { hu: 'Alvástámogató', en: 'Sleep Support' }, time: { hu: 'Este', en: 'Evening' },
      tag: { hu: 'Nyugtató esti formula a lelassuláshoz.', en: 'A calming evening formula to help you slow down.' },
      herbs: { hu: ['Levendula', 'Kamilla', 'Ashwagandha'], en: ['Lavender', 'Chamomile', 'Ashwagandha'] }, rating: 4.9, rc: 298 }
  };
  const ACC = {
    pack4: { type: 'bundle', price: 15990, compare: 23990, img: 'ezgif-8c598b2ba6afbc63.webp?v=1788516127', alt: 'ezgif-434251d2f7345bcd_16458030-5b4b-4be6-9cef-b42f5c4586fd.webp?v=1782319799', rating: 4.9, rc: 156,
      name: { hu: '4 az 1-ben inhalátor csomag', en: '4-in-1 Inhaler Pack' }, desc: { hu: 'Mind a 4 formula egy dobozban', en: 'All 4 formulas in one box' }, badge: { hu: 'Mind a 4 íz', en: 'All 4 flavours' } },
    spray: { type: 'acc', price: 3890, img: 'ezgif-6a405effea74eecc.webp?v=1788802392', rating: 4.7, rc: 94, name: { hu: 'Gyógynövényes szájspray 30 ml', en: 'Herbal Mouth Spray 30 ml' }, desc: { hu: 'Friss lehelet útközben', en: 'Fresh breath on the go' } },
    drops: { type: 'acc', price: 6290, img: 'ezgif-2b7071b809139e73.webp?v=1791832982', rating: 4.8, rc: 73, name: { hu: 'Leheletfrissítő cseppek', en: 'Breath Freshening Drops' }, desc: { hu: 'Ökörfarkkóró levél kivonat', en: 'Mullein leaf extract' }, badge: { hu: 'Új', en: 'New' } },
    guide: { type: 'acc', price: 3190, img: 'ezgif-60f33e3fb63e2472.webp?v=1788802387', rating: 4.9, rc: 88, name: { hu: '21 napos leszokási útmutató', en: '21-Day Quit Guide' }, desc: { hu: 'Napi rituálé lépésről lépésre', en: 'A daily ritual, step by step' } },
    car: { type: 'acc', price: 3990, img: 'ezgif-3831567f0ba453ce.webp?v=1791837577', rating: 4.7, rc: 41, name: { hu: 'Autós szageltávolító készlet', en: 'Car Odour Removal Kit' }, desc: { hu: 'Búcsú a cigarettaszagtól', en: 'Say goodbye to smoke smell' } },
    strips: { type: 'acc', price: 2990, img: 'ezgif-60969cc14a3cd7d3_fc9eaad9-f44a-4f44-a15f-639665f1d8c6.webp?v=1788802441', rating: 4.6, rc: 52, name: { hu: 'Orrtágító csíkok', en: 'Nasal Breathing Strips' }, desc: { hu: 'Könnyebb légzés alváshoz', en: 'Easier breathing for sleep' } },
    filters: { type: 'acc', price: 1890, img: 'ezgif-68e331c49f7d00d7.webp?v=1788802394', rating: 4.7, rc: 36, name: { hu: 'Higiéniai szájfilterek', en: 'Hygienic Mouth Filters' }, desc: { hu: 'Tiszta használat minden nap', en: 'Clean use, every day' } }
  };
  const GRID = ['lung', 'energy', 'sleep', 'liver', 'pack4', 'spray', 'drops', 'guide'];
  const GALLERY = ['ezgif-8c598b2ba6afbc63.webp?v=1788516127', 'ezgif-434251d2f7345bcd_16458030-5b4b-4be6-9cef-b42f5c4586fd.webp?v=1782319799', 'ezgif-4470daf8e7212ecb_7985f913-aabf-405e-8957-cf833c8c3518.webp?v=1782319799',
    'ezgif-48ef1d8fe664fa88_6a9dd51c-beaf-476d-b934-77ba916d4b68.webp?v=1782319799', 'ezgif-48f94e87932af448_a2096b9b-d5e4-4c5c-8991-40efa50163f8.webp?v=1782319799', 'ezgif-44e5c1a655178ee1_79eb3ce1-b238-4d27-a36f-93cd3e7b6617.webp?v=1782319799'];
  const TIERS = { 1: { pay: 1, n: 2 }, 2: { pay: 2, n: 4 }, 3: { pay: 3, n: 6 } };
  const REVIEWS = [
    { n: 'Kata D.', city: 'Debrecen', f: 'energy', s: 5, d: '2026-11-18', t: { hu: 'Pont a reggeli kávés pillanat', en: 'Exactly my morning coffee moment' }, b: { hu: 'A kávé melletti cigi volt a legnehezebb. Az Energizáló pont ezt a pillanatot vette át. Három hete nem gyújtottam rá.', en: 'The cigarette with my coffee was the hardest. Energy Boost took over exactly that moment. Three weeks without lighting up.' } },
    { n: 'Gábor K.', city: 'Budapest', f: 'sleep', s: 5, d: '2026-11-15', t: { hu: 'Az esti rutinom része lett', en: 'Now part of my evening routine' }, b: { hu: 'Esténként az Alvástámogatót használom, nagyon kellemes levendulás íze van. Gyors szállítás, szép csomagolás.', en: 'I use Sleep Support in the evenings – lovely lavender taste. Fast delivery, beautiful packaging.' } },
    { n: 'Eszter V.', city: 'Győr', f: 'lung', s: 5, d: '2026-11-12', t: { hu: 'Mind a négyet kipróbáltam', en: 'Tried all four' }, b: { hu: 'A 2+2 csomagot vettem, így mind a négyet kipróbálhattam. A mentás Tüdőtisztító lett a kedvencem a kocsiban.', en: 'I got the 2+2 bundle so I could try all four. The minty Lung Cleanse is my favourite in the car.' } },
    { n: 'Péter S.', city: 'Szeged', f: 'lung', s: 4, d: '2026-11-09', t: { hu: 'Megmarad a mozdulat', en: 'The motion stays' }, b: { hu: 'Ez hiányzott volna a legjobban. Másnap már meg is érkezett GLS-sel, utánvéttel fizettem.', en: 'That’s what I would have missed most. It arrived the next day with GLS, paid cash on delivery.' } },
    { n: 'Anna B.', city: 'Pécs', f: 'liver', s: 5, d: '2026-11-05', t: { hu: 'Ebéd utáni új szokás', en: 'My new after-lunch habit' }, b: { hu: 'Étkezés után mindig rágyújtottam. Most a Májtámogató van nálam, lágy, kellemes íz.', en: 'I always lit up after meals. Now I carry Liver Support – soft, pleasant taste.' } },
    { n: 'Zoltán M.', city: 'Miskolc', f: 'energy', s: 5, d: '2026-11-02', t: { hu: 'Korrekt ügyfélszolgálat', en: 'Great customer service' }, b: { hu: 'Kérdésem volt a csomagról, pár órán belül válaszoltak. A termék is szuper, ajánlom.', en: 'I had a question about my order and got an answer within hours. Great product too.' } },
    { n: 'Réka T.', city: 'Székesfehérvár', f: 'sleep', s: 5, d: '2026-10-29', t: { hu: 'Végre nem egy újabb tabletta', en: 'Finally not another pill' }, b: { hu: 'Imádom, hogy egy kis rituálé lett belőle este. A párom is átállt.', en: 'I love that it became a small evening ritual. My partner switched too.' } },
    { n: 'Bence H.', city: 'Budapest', f: 'liver', s: 5, d: '2026-10-25', t: { hu: 'A garancia miatt mertem', en: 'Tried it thanks to the guarantee' }, b: { hu: 'A 30 napos garancia miatt mertem kipróbálni. Nem bántam meg, azóta a 3+3-at rendeltem.', en: 'The 30-day guarantee made me try it. No regrets – I’ve since ordered the 3+3.' } },
    { n: 'Dóra L.', city: 'Kecskemét', f: 'lung', s: 5, d: '2026-10-20', t: { hu: 'Friss és diszkrét', en: 'Fresh and discreet' }, b: { hu: 'Nincs szag, nincs füst, a munkahelyen is bátran használom. A mentás íz nagyon friss.', en: 'No smell, no smoke – I can use it at work. The mint taste is really fresh.' } }
  ];
  const QUIZ = [
    { q: { hu: 'Mikor a legerősebb a késztetés?', en: 'When is the urge strongest?' }, o: [
      { e: '☕', t: { hu: 'Reggel, a kávé mellett', en: 'Mornings, with coffee' }, f: 'energy' }, { e: '🍽️', t: { hu: 'Étkezés után', en: 'After meals' }, f: 'liver' },
      { e: '🚗', t: { hu: 'Vezetés, stressz közben', en: 'Driving or stressed' }, f: 'lung' }, { e: '🌙', t: { hu: 'Este, lazításkor', en: 'Evenings, unwinding' }, f: 'sleep' }] },
    { q: { hu: 'Melyik íz áll hozzád közel?', en: 'Which flavour do you like most?' }, o: [
      { e: '🌿', t: { hu: 'Friss, mentás', en: 'Fresh & minty' }, f: 'lung' }, { e: '☕', t: { hu: 'Kávés, élénkítő', en: 'Coffee, uplifting' }, f: 'energy' },
      { e: '🌼', t: { hu: 'Lágy, gyógynövényes', en: 'Soft & herbal' }, f: 'liver' }, { e: '💜', t: { hu: 'Virágos, levendulás', en: 'Floral, lavender' }, f: 'sleep' }] },
    { q: { hu: 'Mit szeretnél elsősorban?', en: 'What do you want most?' }, o: [
      { e: '⚡', t: { hu: 'Több lendületet', en: 'More energy' }, f: 'energy' }, { e: '😮‍💨', t: { hu: 'Friss lélegzetet', en: 'Fresh breath' }, f: 'lung' },
      { e: '⚖️', t: { hu: 'Egyensúlyt', en: 'Balance' }, f: 'liver' }, { e: '😴', t: { hu: 'Nyugodt estéket', en: 'Calm evenings' }, f: 'sleep' }] }
  ];

  /* ================= I18N ================= */
  const EN = {
    ann1: '🔥 Black Friday: 1+1 · 2+2 · 3+3 – the second inhaler is free', ann2: '🚚 Free GLS shipping over 14.990 Ft · 1–2 working days', ann3: '🛡️ 30-day money-back guarantee · cash on delivery available', annEnds: 'Ends in:',
    navShop: 'Shop', megaT: 'Black Friday bundles', megaS: '1+1 · 2+2 · 3+3 – from 4.495 Ft each', megaCta: 'Build your bundle →', navBf: 'Black Friday', navQuiz: 'Formula finder', navRev: 'Reviews', navFaq: 'FAQ',
    heroRev: '· 1,000+ reviews', h1a: 'Keep the habit.', h1b: 'Lose the', h1c: 'nicotine.', heroSub: 'A herbal inhaler in 4 targeted formulas. The familiar hand-to-mouth motion – without nicotine, smoke or combustion.',
    ht1: '0 mg nicotine, non-combustible', ht2: 'Made in Hungary, GLS 1–2 days', ht3: '30-day money-back guarantee', heroCta: 'Get the 2+2 bundle', heroCta2: 'Which one suits me?', cod: 'Cash on delivery', nic: 'nicotine', heroHint: '↑ Hover over a formula',
    u1: 'Nicotine-free', u2: 'Made in Hungary', u3: 'GLS 1–2 working days', u4: 'Cash on delivery', u5: '30-day guarantee', u6: '4.9 / 5 – 1,000+ customers',
    momEy: 'Shop by moment', momT: 'For every craving, <span class="hl">there’s a formula.</span>', momAll: 'All products →',
    shopEy: 'Bestsellers', shopT: 'Favourites, <span class="hl">half price.</span>', tabAll: 'All', tabInh: 'Inhalers', tabBun: 'Bundles', tabAcc: 'Accessories',
    bbRev: '(1,000+ reviews)', bbT: 'Herby Black Friday bundle – mix your formulas', bbS: 'Choose your bundle and flavours. Every second inhaler is free.', bbCd: 'Offer ends in:', dd: 'days', hh: 'hrs', mm: 'min', ss: 'sec',
    t1: '2 inhalers', t2: '4 inhalers · free shipping', t3: '6 inhalers · free shipping + guide', perPc: '/pc', popular: '⭐ Most popular', bestVal: '💎 Best value', pickF: 'Choose your flavours', mixAll: 'All 4 flavours ↻',
    addCart: 'Add to cart', buyNow: 'Buy now',
    tr1: 'day guarantee', tr2: 'made in Hungary', tr3: 'cash on delivery', tr4: 'secure checkout',
    accA: 'What’s in the bundle?', accAp: 'Your chosen number of Herby herbal inhalers, each flavour in its own box. The 3+3 bundle comes with a free 21-day guide.',
    accB: 'Ingredients', accBp: 'Lung Cleanse: mullein, thyme, mint · Energy Boost: guarana, green tea, coffee bean · Liver Support: milk thistle, artichoke, dandelion, chamomile · Sleep Support: lavender, chamomile, ashwagandha. All: vegetable glycerin, purified water.',
    accC: 'Shipping & returns', accCp: 'GLS home delivery or parcel point in 1–2 working days. Pay by card or cash on delivery. 30-day money-back guarantee.',
    qzEy: '30-second formula finder', qzT: 'Which Herby <span class="hl hl--lime">suits you?</span>',
    howF1: 'steps, zero prep', howF2: '“It took over my morning coffee moment.”', howEy: 'How it works', howT: 'As simple as <span class="hl">a deep breath.</span>',
    s1t: 'The urge hits', s1p: 'With coffee, while driving or after a stressful day – reach for your Herby.', s2t: 'Breathe through it', s2p: 'A few slow draws with the familiar motion. No refilling, no smoke, no combustion.', s3t: 'Keep going', s3p: 'The ritual stays, the nicotine doesn’t. Switch formulas to suit the time of day.', howCta: 'Try it risk-free',
    cmpEy: 'Comparison', cmpT: 'Why people choose <span class="hl">Herby</span>', cig: 'Cigarette', ecig: 'E-cigarette', c1: '0 mg nicotine', c2: 'Non-combustible, smoke-free', c3: 'Familiar hand-to-mouth motion', c4: '4 targeted herbal formulas', c5: 'No refilling, no charging', c6: '30-day money-back',
    rvEy: 'Customer reviews', rvBased: '1,000+ verified reviews', rvRec: 'would recommend to a friend', rfAll: 'All', fLung: 'Lung Cleanse', fEnergy: 'Energy Boost', fLiver: 'Liver Support', fSleep: 'Sleep Support',
    gSeal: 'MONEY-BACK GUARANTEE • 30 DAYS • RISK-FREE • ', gDays: 'DAYS', gT: 'Try it for 30 days. <span class="hl hl--lime">Risk-free.</span>', gP: 'If it doesn’t work for you, we refund you. No small print, no questions – just write to us.', gCta: 'Choose a bundle →',
    faqEy: 'FAQ', faqT: 'Frequently asked <span class="hl">questions.</span>', helpT: 'We’ll help you choose', helpS: 'We usually reply within a few hours.', helpBtn: 'Write to us',
    q1: 'How do I use it?', a1: 'When the urge hits, take it out and draw on it slowly a few times. No refilling, no prep.',
    q2: 'Does it contain nicotine?', a2: 'No. Herby is completely nicotine-free, non-combustible and smoke-free.',
    q3: 'Which formula should I choose?', a3: 'Lung Cleanse is fresh and minty. Energy Boost is for busy days, Sleep Support for evenings, Liver Support for everyday balance. The 2+2 bundle lets you try all four – or take the formula finder.',
    q4: 'What if it doesn’t work for me?', a4: 'You’re covered by our 30-day money-back guarantee. If you don’t like it, we refund you.',
    q5: 'How long is delivery and how can I pay?', a5: '1–2 working days with GLS, to your home or a parcel point. Pay by card, Apple Pay, Google Pay or cash on delivery.',
    q6: 'How long does one inhaler last?', a6: 'Depending on use, it can last several weeks. If you use it several times a day, the 2+2 or 3+3 bundle is the best value.',
    nlT: '−10% off your first order.', nlP: 'Subscribe to hear first about offers, new products and tips for smoke-free days.', nlPh: 'Your email address', nlBtn: 'Get my code', nlNote: 'Unsubscribe any time. No spam.',
    ftAbout: 'Herbal inhalers for smoke-free everyday life. Developed and made in Hungary.', ftShop: 'Shop', ftInfo: 'Information', ft1: 'Terms of service', ft2: 'Privacy', ft3: 'Shipping', ft4: 'Returns & withdrawal', ft5: 'Legal notice', ftContact: 'Contact', ftRights: 'All rights reserved.',
    cartT: 'Your cart', cartTimer: '🔥 Black Friday prices end in:', g1: 'Free shipping', g2: 'Free mouth spray', emptyT: 'Your cart is empty', emptyS: 'Most people start with the 2+2 bundle.', emptyCta: 'Add 2+2 bundle – 17.980 Ft',
    xsT: 'Complete your routine', protT: 'Package protection', protS: 'We reship if your parcel is damaged or lost', sub: 'Subtotal', saved: 'You save', ship: 'Shipping', total: 'Total', checkout: 'Secure checkout', cartTrust: '🛡️ 30-day guarantee · 💳 Cash on delivery · 🔒 SSL'
  };
  const T = {
    hu: { add: 'Kosárba', quick: 'Gyors nézet', inhaler: 'inhalátor', bundle: t => `Black Friday ${t}+${t} csomag`, free: 'INGYEN', freeShip: 'Ingyenes', remove: 'Törlés', item: n => `${n} termék`,
      save: v => `🎉 ${ft(v)}-ot spórolsz ezzel a csomaggal`, perUnit: 'db',
      ship: (a, b, c) => c ? `Rendeld meg <b>${c}</b> belül, és várhatóan <b>${a} – ${b}</b> között nálad lehet.` : `Várható kézbesítés: <b>${a} – ${b}</b>.`,
      toShip: v => `Még <b>${ft(v)}</b> és <b>ingyenes a szállítás</b>`, toGift: v => `✓ Ingyenes szállítás! Még <b>${ft(v)}</b> és <b>ajándék szájspray</b> jár`, done: '🎉 <b>Ingyenes szállítás + ajándék szájspray</b> – megszerezted!',
      gift: 'Ajándék szájspray 30 ml', nudge1: f => `Válts <b>1+1</b>-re: kapsz mellé egy második ${f}-t <b>ingyen</b>.`, nudgeN: (t, v) => `Bővítsd <b>${t}+${t}</b>-re csak <b>+${ft(v)}</b>-ért – +2 inhalátor${t === 2 ? ' és ingyenes szállítás' : ' és ajándék útmutató'}.`, up: 'Bővítés',
      added: n => `✓ ${n} a kosárban`, checkout: 'Prototípus – itt indulna a Shopify pénztár.', nl: 'Köszönjük! A −10% kódot elküldtük e-mailben.',
      qStep: (i, n) => `${i}. kérdés / ${n}`, back: '← Vissza', match: 'A te formulád', why: f => `A válaszaid alapján a(z) ${f} illik hozzád a legjobban. Tipp: a 2+2 csomaggal mind a négy formulát kipróbálhatod, ugyanannyiért, mint 2 darab.`,
      addOne: 'Kosárba – 8.990 Ft', get22: '2+2 csomag – 17.980 Ft', retry: 'Újrakezdem', reviewsOf: n => `${n} értékelés`, verified: 'Ellenőrzött vásárló', helpful: 'Hasznos', guideGift: '+ ajándék 21 napos útmutató',
      qvUp: '💡 <b>Tipp:</b> a Black Friday 1+1 csomaggal ugyanennyiért <b>2 darabot</b> kapsz.', qvBundle: '1+1 csomag – 8.990 Ft', cartN: n => `${n} termék a kosárban` },
    en: { add: 'Add to cart', quick: 'Quick view', inhaler: 'inhaler', bundle: t => `Black Friday ${t}+${t} bundle`, free: 'FREE', freeShip: 'Free', remove: 'Remove', item: n => `${n} item${n === 1 ? '' : 's'}`,
      save: v => `🎉 You save ${ft(v)} with this bundle`, perUnit: 'pc',
      ship: (a, b, c) => c ? `Order within <b>${c}</b> and it should arrive <b>${a} – ${b}</b>.` : `Estimated delivery: <b>${a} – ${b}</b>.`,
      toShip: v => `<b>${ft(v)}</b> away from <b>free shipping</b>`, toGift: v => `✓ Free shipping! <b>${ft(v)}</b> more for a <b>free mouth spray</b>`, done: '🎉 <b>Free shipping + free mouth spray</b> – unlocked!',
      gift: 'Free mouth spray 30 ml', nudge1: f => `Switch to <b>1+1</b>: get a second ${f} <b>free</b>.`, nudgeN: (t, v) => `Upgrade to <b>${t}+${t}</b> for just <b>+${ft(v)}</b> – +2 inhalers${t === 2 ? ' and free shipping' : ' and a free guide'}.`, up: 'Upgrade',
      added: n => `✓ ${n} added to cart`, checkout: 'Prototype – Shopify checkout would start here.', nl: 'Thank you! Your −10% code is on its way.',
      qStep: (i, n) => `Question ${i} of ${n}`, back: '← Back', match: 'Your formula', why: f => `Based on your answers, ${f} suits you best. Tip: the 2+2 bundle lets you try all four formulas for the price of two.`,
      addOne: 'Add to cart – 8.990 Ft', get22: '2+2 bundle – 17.980 Ft', retry: 'Start over', reviewsOf: n => `${n} reviews`, verified: 'Verified buyer', helpful: 'Helpful', guideGift: '+ free 21-day guide',
      qvUp: '💡 <b>Tip:</b> with the Black Friday 1+1 bundle you get <b>2 pieces</b> for the same price.', qvBundle: '1+1 bundle – 8.990 Ft', cartN: n => `${n} item${n === 1 ? '' : 's'} in your cart` }
  };
  let lang = 'hu';
  try { lang = localStorage.getItem('herby3-lang') || 'hu'; } catch (e) {}
  const HU = {};
  $$('[data-i18n]').forEach(el => { if (!(el.dataset.i18n in HU)) HU[el.dataset.i18n] = el.innerHTML; });
  $$('[data-i18n-ph]').forEach(el => HU[el.dataset.i18nPh] = el.placeholder);
  const tr = k => lang === 'en' ? (EN[k] ?? HU[k]) : HU[k];
  const t = () => T[lang];
  const nm = k => F[k] ? F[k].name[lang] : ACC[k].name[lang];

  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => el.innerHTML = tr(el.dataset.i18n));
    $$('[data-i18n-ph]').forEach(el => el.placeholder = tr(el.dataset.i18nPh));
    document.title = lang === 'en' ? 'Herby – Herbal inhalers | Black Friday −50%' : 'Herby – Gyógynövényes inhalátorok | Black Friday −50%';
    $('#lang').dataset.l = lang;
    $$('#lang button').forEach(b => { b.classList.toggle('on', b.dataset.l === lang); b.setAttribute('aria-pressed', b.dataset.l === lang); });
    renderMega(); setHero(heroF); renderMoments(); renderGrid(); renderGallery(); renderSlots(); renderQuiz(); renderReviews(); shipEstimate(); renderCart();
  }
  $$('#lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === lang) return;
    lang = b.dataset.l; try { localStorage.setItem('herby3-lang', lang); } catch (e) {}
    $('main').animate([{ opacity: 1 }, { opacity: .3 }, { opacity: 1 }], { duration: 380 });
    setTimeout(applyLang, 120);
  }));

  /* ================= HEADER ================= */
  let ai = 0;
  setInterval(() => {
    const s = $$('#annRot span'), cur = s[ai]; ai = (ai + 1) % s.length;
    cur.classList.remove('is-on'); cur.classList.add('is-out');
    setTimeout(() => cur.classList.remove('is-out'), 600);
    s[ai].classList.add('is-on');
  }, 3800);
  $('#burger').addEventListener('click', () => $('#nav').classList.toggle('open'));
  $$('#nav a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('open')));
  function renderMega() {
    $('#megaGrid').innerHTML = ORDER.map(k => `<a href="#shop" class="mcard" style="--bg-c:${F[k].bg}" data-qv="${k}"><img src="${im(F[k].cut, 300)}" alt=""><b>${F[k].name[lang]}</b><small>${F[k].time[lang]} · 8.990 Ft</small></a>`).join('');
  }

  /* ================= HERO ================= */
  let heroF = 'lung';
  function setHero(k) {
    heroF = k; const f = F[k], card = $('#heroCard');
    card.style.setProperty('--hc', f.bg); card.style.setProperty('--hd', f.c);
    $('#heroFName').textContent = f.name[lang]; $('#heroFTag').textContent = f.herbs[lang].join(' · ');
    $$('.cut').forEach(c => c.classList.toggle('is-on', c.dataset.f === k));
  }
  $$('.cut').forEach(c => { c.addEventListener('mouseenter', () => setHero(c.dataset.f)); c.addEventListener('click', () => openQV(c.dataset.f)); });

  /* ================= MOMENTS ================= */
  function renderMoments() {
    $('#momentsGrid').innerHTML = ['energy', 'liver', 'lung', 'sleep'].map(k => {
      const f = F[k];
      return `<button class="mom reveal in" style="--bg-c:${f.bg};--c:${f.c}" data-qv="${k}">
        <img class="mom__img" src="${im(f.cut, 400)}" alt="${f.name[lang]}" loading="lazy">
        <span class="mom__time"><i></i>${f.time[lang]}</span>
        <h3>${f.name[lang]}</h3><p>${f.tag[lang]}</p>
        <div class="mom__foot"><span><b>8.990 Ft</b><s>17.980 Ft</s></span><span class="mom__go">→</span></div></button>`;
    }).join('');
  }

  /* ================= PRODUCT GRID ================= */
  let tab = 'all';
  const typeOf = k => F[k] ? 'inhaler' : ACC[k].type;
  function card(k) {
    const isF = !!F[k], p = isF ? F[k] : ACC[k];
    const price = isF ? UNIT : p.price, cmp = isF ? UNIT_CMP : p.compare;
    const media = isF
      ? `<img class="pc__main pc__cut" src="${im(p.cut, 500)}" alt="${p.name[lang]}" loading="lazy"><img class="pc__alt" src="${im(p.pack, 600)}" alt="" loading="lazy">`
      : `<img class="pc__main" src="${im(p.img, 600)}" alt="${p.name[lang]}" loading="lazy">${p.alt ? `<img class="pc__alt" src="${im(p.alt, 600)}" alt="" loading="lazy">` : ''}`;
    const badges = [cmp ? `<span class="bdg bdg--sale">−${Math.round((1 - price / cmp) * 100)}%</span>` : '', k === 'lung' ? `<span class="bdg bdg--dark">Bestseller</span>` : '', p.badge ? `<span class="bdg">${p.badge[lang]}</span>` : ''].join('');
    return `<article class="pc" style="--bg-c:${isF ? p.bg : '#f1ece1'}">
      <div class="pc__media" data-qv="${k}">${media}<div class="pc__badges">${badges}</div>
        <div class="pc__quick"><button data-add="${k}">${t().add}</button><button class="qvb" data-qv="${k}" aria-label="${t().quick}">👁</button></div></div>
      <div class="pc__body">
        <div class="pc__rate"><span class="stars">★★★★★</span>${p.rating.toString().replace('.', lang === 'hu' ? ',' : '.')} (${p.rc})</div>
        <h3>${p.name[lang]}${isF ? ` <span style="color:${p.c}">●</span>` : ''}</h3>
        <p class="pc__desc">${isF ? p.herbs[lang].join(' · ') : p.desc[lang]}</p>
        <div class="pc__row"><div class="pc__price"><b>${ft(price)}</b>${cmp ? `<s>${ft(cmp)}</s>` : ''}</div><button class="pc__add" data-add="${k}" aria-label="${t().add}">+</button></div>
      </div></article>`;
  }
  function renderGrid() { $('#pgrid').innerHTML = GRID.filter(k => tab === 'all' || typeOf(k) === tab).map(card).join(''); }
  $('#tabs').addEventListener('click', e => {
    const b = e.target.closest('[data-tab]'); if (!b) return;
    tab = b.dataset.tab; $$('#tabs button').forEach(x => x.classList.toggle('on', x === b)); renderGrid();
  });

  /* add / quick view delegation */
  function addProduct(k) {
    if (F[k]) addLine({ key: 's-' + k, kind: 'single', f: k, price: UNIT, compare: UNIT_CMP });
    else addLine({ key: 'a-' + k, kind: 'acc', id: k, price: ACC[k].price, compare: ACC[k].compare || 0 });
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]');
    if (a) { e.preventDefault(); e.stopPropagation(); addProduct(a.dataset.add); closeQV(); return; }
    const q = e.target.closest('[data-qv]');
    if (q) { e.preventDefault(); $('#nav').classList.remove('open'); openQV(q.dataset.qv); }
  });

  function openQV(k) {
    const isF = !!F[k], p = isF ? F[k] : ACC[k];
    const price = isF ? UNIT : p.price, cmp = isF ? UNIT_CMP : p.compare;
    $('#qvBody').innerHTML = `
      <div class="qv__media" style="--bg-c:${isF ? p.bg : '#f1ece1'}">${isF ? `<img src="${im(p.cut, 700)}" alt="">` : `<img class="full" src="${im(p.img, 900)}" alt="">`}</div>
      <div class="qv__body">
        <div class="pc__rate"><span class="stars">★★★★★</span> ${lang === 'hu' ? String(p.rating).replace('.', ',') : p.rating} · ${t().reviewsOf(p.rc)}</div>
        <h3>${p.name[lang]}</h3>
        <p style="color:var(--muted)">${isF ? p.tag[lang] : p.desc[lang]}</p>
        ${isF ? `<div class="herbs">${p.herbs[lang].map(h => `<span>${h}</span>`).join('')}</div>` : ''}
        <div class="qv__price"><b>${ft(price)}</b>${cmp ? `<s>${ft(cmp)}</s><em>−${Math.round((1 - price / cmp) * 100)}%</em>` : ''}</div>
        ${isF ? `<div class="qv__up">${t().qvUp}</div>` : ''}
        <button class="btn btn--primary btn--xl" data-add="${k}">${t().add} – ${ft(price)}</button>
        ${isF ? `<button class="btn btn--ghost" id="qvBundle" data-f="${k}">${t().qvBundle}</button>` : ''}
        <p style="font-size:13px;color:var(--muted)">🚚 GLS 1–2 · 🛡️ 30 · 💳 ${tr('cod')}</p>
      </div>`;
    $('#qv').classList.add('open'); $('#qv').setAttribute('aria-hidden', 'false');
    const qb = $('#qvBundle'); if (qb) qb.addEventListener('click', () => { addLine(bundleLine(1, [k, k])); closeQV(); });
  }
  function closeQV() { $('#qv').classList.remove('open'); $('#qv').setAttribute('aria-hidden', 'true'); }
  $$('#qv [data-close]').forEach(b => b.addEventListener('click', closeQV));

  /* ================= GALLERY ================= */
  let gi = 0;
  function renderGallery() {
    $('#galThumbs').innerHTML = GALLERY.map((g, i) => `<button class="${i === gi ? 'on' : ''}" data-g="${i}" aria-label="image ${i + 1}"><img src="${im(g, 200)}" alt="" loading="lazy"></button>`).join('');
  }
  function showG(i) {
    gi = (i + GALLERY.length) % GALLERY.length;
    const m = $('#galMain'); m.style.opacity = 0;
    setTimeout(() => { m.src = im(GALLERY[gi], 1100); m.onload = () => m.style.opacity = 1; }, 180);
    $$('#galThumbs button').forEach((b, j) => b.classList.toggle('on', j === gi));
  }
  $('#galThumbs').addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (b) showG(+b.dataset.g); });
  $('#galPrev').addEventListener('click', () => showG(gi - 1));
  $('#galNext').addEventListener('click', () => showG(gi + 1));

  /* ================= BUNDLE BUY BOX ================= */
  let tier = 2, qty = 1, picks = ['lung', 'energy', 'liver', 'sleep', 'lung', 'sleep'];
  function renderSlots() {
    const n = TIERS[tier].n, pay = TIERS[tier].pay;
    $('#slots').innerHTML = Array.from({ length: n }, (_, i) => {
      const k = picks[i];
      return `<div class="slot"><span class="slot__n">${i + 1}</span><span class="slot__name" style="color:${F[k].c}">${F[k].name[lang]}${i >= pay ? ` <em>${t().free}</em>` : ''}</span>
        <div class="sw">${ORDER.map(o => `<button style="--c:${F[o].c}" class="${o === k ? 'on' : ''}" data-slot="${i}" data-f="${o}" aria-label="${F[o].name[lang]}" title="${F[o].name[lang]}"></button>`).join('')}</div></div>`;
    }).join('');
    const price = TIERS[tier].pay * UNIT * qty, cmp = TIERS[tier].n * UNIT_CMP * qty;
    $('#bbPrice').textContent = ft(price);
    $('#bbSave').innerHTML = t().save(cmp - price) + (tier === 3 ? ' ' + t().guideGift : '');
    $('#satcName').textContent = `Black Friday ${tier}+${tier}`;
    $('#satcPrice').textContent = ft(price); $('#satcCmp').textContent = ft(cmp);
  }
  $('#tiers').addEventListener('click', e => {
    const b = e.target.closest('.tier'); if (!b) return;
    tier = +b.dataset.t; $$('.tier').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); }); renderSlots();
  });
  $('#slots').addEventListener('click', e => { const b = e.target.closest('[data-slot]'); if (b) { picks[+b.dataset.slot] = b.dataset.f; renderSlots(); } });
  $('#mixAll').addEventListener('click', () => { picks = ['lung', 'energy', 'liver', 'sleep', 'lung', 'sleep']; renderSlots(); });
  $('#qMinus').addEventListener('click', () => { qty = Math.max(1, qty - 1); $('#qVal').textContent = qty; renderSlots(); });
  $('#qPlus').addEventListener('click', () => { qty = Math.min(9, qty + 1); $('#qVal').textContent = qty; renderSlots(); });
  const addBundle = () => { const l = bundleLine(tier, picks.slice(0, TIERS[tier].n)); for (let i = 0; i < qty; i++) addLine(l, i < qty - 1); };
  $('#bbAdd').addEventListener('click', addBundle);
  $('#satcBtn').addEventListener('click', addBundle);
  $('#bbExpress').addEventListener('click', () => { addBundle(); toast(t().checkout); });
  function bundleLine(tr_, list) {
    return { key: `b${tr_}-${[...list].sort().join('.')}`, kind: 'bundle', tier: tr_, picks: list, price: TIERS[tr_].pay * UNIT, compare: TIERS[tr_].n * UNIT_CMP };
  }

  /* shipping estimate (1–2 working days, 14:00 cut-off) */
  function addWD(d, n) { const x = new Date(d); while (n > 0) { x.setDate(x.getDate() + 1); if (x.getDay() % 6) n--; } return x; }
  function shipEstimate() {
    const now = new Date(), wd = now.getDay() % 6 !== 0, cut = new Date(now); cut.setHours(14, 0, 0, 0);
    const today = wd && now < cut, dispatch = today ? now : addWD(now, 1);
    const fmt = d => d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'hu-HU', { weekday: 'short', month: 'short', day: 'numeric' });
    let left = '';
    if (today) { const m = Math.floor((cut - now) / 6e4); left = lang === 'en' ? `${Math.floor(m / 60)}h ${m % 60}m` : `${Math.floor(m / 60)} óra ${m % 60} percen`; }
    $('#shipEst').innerHTML = t().ship(fmt(addWD(dispatch, 1)), fmt(addWD(dispatch, 2)), left);
  }
  setInterval(shipEstimate, 60000);

  /* countdown */
  let end = new Date('2026-11-30T23:59:59+01:00').getTime();
  const pad = v => String(v).padStart(2, '0');
  function tick() {
    let d = end - Date.now(); if (d <= 0) { end = Date.now() + 3 * 864e5; d = end - Date.now(); }
    const D = Math.floor(d / 864e5), H = pad(Math.floor(d / 36e5) % 24), M = pad(Math.floor(d / 6e4) % 60), S = pad(Math.floor(d / 1e3) % 60);
    $('#cdD').textContent = D; $('#cdH').textContent = H; $('#cdM').textContent = M; $('#cdS').textContent = S;
    const short = `${D}${lang === 'en' ? 'd' : 'n'} ${H}:${M}:${S}`;
    $('#annCd').textContent = short; $('#satcCd').textContent = short; $('#cartCd').textContent = short;
  }
  tick(); setInterval(tick, 1000);

  /* ================= QUIZ ================= */
  let qi = 0, answers = [];
  function renderQuiz() {
    const body = $('#qzBody'), stack = $('#qzStack');
    $('#qzProg').style.width = `${Math.min(100, (qi + 1) / QUIZ.length * 100)}%`;
    if (qi < QUIZ.length) {
      stack.classList.remove('pick'); $$('img', stack).forEach(i => i.classList.remove('win'));
      $('#qzRight').style.background = '';
      const q = QUIZ[qi];
      body.innerHTML = `<p class="qz__q"><small>${t().qStep(qi + 1, QUIZ.length)}</small>${q.q[lang]}</p>
        <div class="qz__opts">${q.o.map((o, i) => `<button class="qz__opt" data-o="${i}"><span>${o.e}</span>${o.t[lang]}</button>`).join('')}</div>
        ${qi ? `<button class="qz__back" id="qzBack">${t().back}</button>` : ''}`;
    } else {
      const score = {}; answers.forEach((f, i) => score[f] = (score[f] || 0) + (i === 0 ? 1.5 : 1));
      const win = Object.keys(score).sort((a, b) => score[b] - score[a])[0], f = F[win];
      stack.classList.add('pick');
      const idx = { sleep: 0, liver: 1, energy: 2, lung: 3 }[win];
      $$('img', stack).forEach((im_, i) => im_.classList.toggle('win', i === idx));
      $('#qzRight').style.background = `radial-gradient(circle at 50% 60%, ${f.c}55, transparent 65%)`;
      body.innerHTML = `<div class="qz__res"><span class="eyebrow eyebrow--light">${t().match}</span><h3 style="color:${f.bg}">${f.name[lang]}</h3>
        <p>${t().why(f.name[lang])}</p><p class="price"><b>8.990 Ft</b> <s>17.980 Ft</s> · ${f.herbs[lang].join(' · ')}</p>
        <div class="row"><button class="btn btn--lime btn--xl" data-add="${win}">${t().addOne}</button><button class="btn btn--ghost btn--xl" id="qz22">${t().get22}</button></div>
        <button class="qz__back" id="qzRetry">${t().retry}</button></div>`;
      $('#qz22').addEventListener('click', () => addLine(bundleLine(2, [win, ...ORDER.filter(o => o !== win)])));
      $('#qzRetry').addEventListener('click', () => { qi = 0; answers = []; renderQuiz(); });
    }
  }
  $('#qzBody').addEventListener('click', e => {
    const o = e.target.closest('[data-o]');
    if (o) { answers[qi] = QUIZ[qi].o[+o.dataset.o].f; qi++; renderQuiz(); return; }
    if (e.target.id === 'qzBack') { qi = Math.max(0, qi - 1); answers.length = qi; renderQuiz(); }
  });

  /* ================= REVIEWS ================= */
  let rf = 'all';
  function renderReviews() {
    const list = REVIEWS.filter(r => rf === 'all' || r.f === rf).slice(0, 6);
    $('#rvGrid').innerHTML = list.map((r, i) => `<article class="rc" style="animation-delay:${i * 60}ms">
      <div class="rc__top"><span class="stars">${'★'.repeat(r.s)}${'☆'.repeat(5 - r.s)}</span><small>${new Date(r.d).toLocaleDateString(lang === 'en' ? 'en-GB' : 'hu-HU', { month: 'short', day: 'numeric' })}</small></div>
      <h4>${lang === 'en' ? '“' : '„'}${r.t[lang]}”</h4><p>${r.b[lang]}</p>
      <div class="rc__who"><span class="rc__av" style="--c:${F[r.f].c}">${r.n[0]}</span><div><b>${r.n}</b>, ${r.city}<small>✓ ${t().verified}</small></div>
        <span class="rc__prod"><img src="${im(F[r.f].cut, 80)}" alt="">${F[r.f].name[lang]}</span></div></article>`).join('');
  }
  $('#rvFilters').addEventListener('click', e => {
    const b = e.target.closest('[data-rf]'); if (!b) return;
    rf = b.dataset.rf; $$('#rvFilters button').forEach(x => x.classList.toggle('on', x === b)); renderReviews();
  });

  /* ================= CART ================= */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('herby3-cart') || '[]'); } catch (e) {}
  const persist = () => { try { localStorage.setItem('herby3-cart', JSON.stringify(cart)); } catch (e) {} };
  const lineName = l => l.kind === 'single' ? `${F[l.f].name[lang]} ${t().inhaler}` : l.kind === 'bundle' ? t().bundle(l.tier) : l.kind === 'gift' ? t().gift : ACC[l.id].name[lang];
  const lineImg = l => l.kind === 'single' ? `<div class="ln__img" style="--bg-c:${F[l.f].bg}"><img class="cutimg" src="${im(F[l.f].cut, 200)}" alt=""></div>`
    : l.kind === 'bundle' ? `<div class="ln__img"><img src="${im(GALLERY[0], 200)}" alt=""></div>`
    : `<div class="ln__img"><img src="${im(l.kind === 'gift' ? ACC.spray.img : ACC[l.id].img, 200)}" alt=""></div>`;
  function addLine(l, silent) {
    const ex = cart.find(c => c.key === l.key);
    ex ? ex.qty++ : cart.push({ ...l, qty: 1 });
    persist(); renderCart();
    if (silent) return;
    openCart(); toast(t().added(lineName(l)));
    const b = $('#cartCount'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  }
  function renderCart() {
    const sub = cart.reduce((s, l) => s + l.price * l.qty, 0);
    const saved = cart.reduce((s, l) => s + (l.compare ? (l.compare - l.price) * l.qty : 0), 0);
    const count = cart.reduce((s, l) => s + l.qty, 0), gift = sub >= GIFT;
    $('#cartCount').textContent = count; $('#cartSub').textContent = count ? t().cartN(count) : '';
    $('#cartEmpty').classList.toggle('show', !cart.length);
    const all = gift ? [...cart, { kind: 'gift', price: 0, compare: GIFT_VAL, qty: 1 }] : cart;
    $('#lines').innerHTML = all.map((l, i) => `<div class="ln ${l.kind === 'gift' ? 'ln--gift' : ''}">${lineImg(l)}
      <div><h5>${lineName(l)}</h5>
        ${l.kind === 'bundle' ? `<small>${ORDER.filter(k => l.picks.includes(k)).map(k => `${l.picks.filter(x => x === k).length}× ${F[k].name[lang]}`).join(' · ')}${l.tier === 3 ? ' ' + t().guideGift : ''}</small><div class="ln__dots">${l.picks.map(k => `<i style="--c:${F[k].c}"></i>`).join('')}</div>` : ''}
        ${l.kind === 'gift' ? '' : `<div class="qty"><button data-q="-1" data-i="${i}" aria-label="−">−</button><span>${l.qty}</span><button data-q="1" data-i="${i}" aria-label="+">+</button></div>`}</div>
      <div class="ln__r"><div><b>${l.price ? ft(l.price * l.qty) : t().freeShip}</b>${l.compare ? `<s>${ft(l.compare * l.qty)}</s>` : ''}</div>
        ${l.kind === 'gift' ? '<em>🎁</em>' : `<button class="ln__rm" data-rm="${i}">${t().remove}</button>`}</div></div>`).join('');

    $('#goalFill').style.width = Math.min(100, sub / GIFT * 100) + '%';
    $('#gp1').classList.toggle('hit', sub >= FREE_SHIP); $('#gp2').classList.toggle('hit', gift);
    $('#goalMsg').innerHTML = sub < FREE_SHIP ? t().toShip(FREE_SHIP - sub) : !gift ? t().toGift(GIFT - sub) : t().done;

    const single = cart.find(l => l.kind === 'single');
    const bun = cart.filter(l => l.kind === 'bundle').sort((a, b) => a.tier - b.tier)[0];
    $('#nudge').innerHTML = single ? `<div class="nudge"><span class="nudge__ic">🎁</span><span>${t().nudge1(F[single.f].name[lang])}</span><button class="btn btn--primary" data-up="s">${t().up}</button></div>`
      : bun && bun.tier < 3 ? `<div class="nudge"><span class="nudge__ic">⚡</span><span>${t().nudgeN(bun.tier + 1, UNIT)}</span><button class="btn btn--primary" data-up="b">${t().up}</button></div>` : '';

    const have = new Set(cart.filter(l => l.kind === 'acc').map(l => l.id));
    const inBundle = new Set(cart.flatMap(l => l.kind === 'bundle' ? l.picks : l.kind === 'single' ? [l.f] : []));
    const xs = [...ORDER.filter(k => cart.length && !inBundle.has(k)), ...['spray', 'drops', 'guide', 'car', 'strips', 'filters'].filter(k => !have.has(k))].slice(0, 6);
    $('#xsell').innerHTML = xs.map(k => {
      const isF = !!F[k], p = isF ? F[k] : ACC[k];
      return `<div class="xs"><div class="xs__img" style="--bg-c:${isF ? p.bg : '#efe9dc'}"><img class="${isF ? 'cutimg' : ''}" src="${im(isF ? p.cut : p.img, 300)}" alt=""></div>
        <div class="xs__b"><h6>${p.name[lang]}</h6><div class="xs__row"><b>${ft(isF ? UNIT : p.price)}</b><button data-add="${k}">+ ${lang === 'en' ? 'Add' : 'Kosár'}</button></div></div></div>`;
    }).join('');

    const prot = cart.length && $('#prot').checked ? PROT : 0, ship = !cart.length || sub >= FREE_SHIP ? 0 : SHIP;
    $('#tSub').textContent = ft(sub);
    $('#tSave').textContent = '−' + ft(saved + (gift ? GIFT_VAL : 0) + (cart.length && !ship ? SHIP : 0)); $('#tSaveRow').style.display = saved ? '' : 'none';
    $('#tShip').innerHTML = !cart.length ? '–' : ship ? ft(ship) : `<s style="color:var(--muted)">${ft(SHIP)}</s> ${t().freeShip}`;
    $('#tTotal').textContent = ft(sub + ship + prot);
    $('.prot').style.display = cart.length ? '' : 'none';
    $('#cartTimer').style.display = cart.length ? '' : 'none';
  }
  $('#lines').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    if (q) { const l = cart[+q.dataset.i]; l.qty += +q.dataset.q; if (l.qty < 1) cart.splice(+q.dataset.i, 1); }
    else if (rm) cart.splice(+rm.dataset.rm, 1); else return;
    persist(); renderCart();
  });
  $('#nudge').addEventListener('click', e => {
    const b = e.target.closest('[data-up]'); if (!b) return;
    if (b.dataset.up === 's') {
      const i = cart.findIndex(l => l.kind === 'single'), s = cart[i];
      s.qty > 1 ? s.qty-- : cart.splice(i, 1);
      const nl = bundleLine(1, [s.f, s.f]), ex = cart.find(c => c.key === nl.key); ex ? ex.qty++ : cart.push({ ...nl, qty: 1 });
    } else {
      const bun = cart.filter(l => l.kind === 'bundle').sort((a, b) => a.tier - b.tier)[0], i = cart.indexOf(bun);
      const nt = bun.tier + 1, np = [...bun.picks];
      while (np.length < TIERS[nt].n) np.push(ORDER.find(k => !np.includes(k)) || ORDER[np.length % 4]);
      bun.qty > 1 ? bun.qty-- : cart.splice(i, 1);
      cart.push({ ...bundleLine(nt, np), qty: 1 });
    }
    persist(); renderCart();
  });
  $('#prot').addEventListener('change', renderCart);
  $('#emptyAdd').addEventListener('click', () => addLine(bundleLine(2, ['lung', 'energy', 'liver', 'sleep'])));
  $('#xsN').addEventListener('click', () => $('#xsell').scrollBy({ left: 200 }));
  $('#xsP').addEventListener('click', () => $('#xsell').scrollBy({ left: -200 }));
  $('#checkout').addEventListener('click', () => toast(t().checkout));
  $$('.express__b').forEach(b => b.addEventListener('click', () => toast(t().checkout)));
  function openCart() { document.body.classList.add('cart-open'); $('#cart').setAttribute('aria-hidden', 'false'); }
  function closeCart() { document.body.classList.remove('cart-open'); $('#cart').setAttribute('aria-hidden', 'true'); }
  $('#cartBtn').addEventListener('click', openCart);
  $('#cartX').addEventListener('click', closeCart);
  $('#veil').addEventListener('click', closeCart);
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeQV(); } });

  /* ================= MISC ================= */
  let tt;
  function toast(m) { const el = $('#toast'); el.textContent = m; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2600); }
  $('#nlForm').addEventListener('submit', e => { e.preventDefault(); toast(t().nl); e.target.reset(); });

  const hdr = $('#hdr'), satc = $('#satc'), bb = $('#buybox');
  function onScroll() {
    hdr.classList.toggle('sc', scrollY > 10);
    const r = bb.getBoundingClientRect(), f = $('.ft').getBoundingClientRect();
    satc.classList.toggle('show', scrollY > 700 && (r.bottom < 0 || r.top > innerHeight) && f.top > innerHeight);
  }
  addEventListener('scroll', onScroll, { passive: true });

  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 });
  $$('.how__media,.ctable,.g__card,.rv__sum,.rv__ugc,.quiz__card').forEach(el => { el.classList.add('reveal'); io.observe(el); });

  applyLang(); onScroll();
})();
