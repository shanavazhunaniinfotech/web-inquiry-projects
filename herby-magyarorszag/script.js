(() => {
  const CDN = 'https://cdn.shopify.com/s/files/1/1082/3408/0595/files/';
  const im = (f, w = 600) => `${CDN}${f}&width=${w}`;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ft = n => n.toLocaleString('de-DE') + ' Ft';
  const UNIT = 8990, UNIT_CMP = 17980, FREE_SHIP = 14990, GIFT = 24990, SHIP = 1490, PROTECT = 890, GIFT_VAL = 3890;
  const ORDER = ['lung', 'energy', 'liver', 'sleep'];

  /* ---------------- data ---------------- */
  const F = {
    lung: { n: '01', c: '#4f9a3a', bg: '#e4f1d8', rating: 4.9, rc: 612, name: { hu: 'Tüdőtisztító', en: 'Lung Cleanse' },
      cut: 'uj.webp?v=1788009251', pack: 'Gyogynovenyestudotisztito30naposgaranciaval.webp?v=1794946867', herb: 'ezgif-3efcab05e8584b9b.webp?v=1788541053',
      tag: { hu: 'Friss, mentás formula a légutak támogatására.', en: 'A fresh, minty formula to support your airways.' },
      herbs: { hu: ['Ökörfarkkóró', 'Kakukkfű', 'Menta'], en: ['Mullein', 'Thyme', 'Mint'] },
      profile: { hu: 'Friss, mentás', en: 'Fresh & minty' }, when: { hu: 'Bármikor, bárhol', en: 'Any time, anywhere' },
      ing: { hu: 'ökörfarkkóró, kakukkfű, menta, mentol, növényi glicerin, tisztított víz', en: 'mullein, thyme, mint, menthol, vegetable glycerin, purified water' } },
    energy: { n: '02', c: '#e07b1f', bg: '#fde6c8', rating: 4.8, rc: 341, name: { hu: 'Energizáló', en: 'Energy Boost' },
      cut: 'ezgif-12dcdb7b1051afe8.webp?v=1788634410', pack: 'ezgif-856b1e34197a4520.webp?v=1788516083', herb: 'ezgif-38f1f834de31b8d3.webp?v=1788541059',
      tag: { hu: 'Frissítő formula a lendületesebb napokért.', en: 'A refreshing formula for days with more momentum.' },
      herbs: { hu: ['Guarana', 'Zöld tea', 'Kávébab', 'Mentol'], en: ['Guarana', 'Green tea', 'Coffee bean', 'Menthol'] },
      profile: { hu: 'Kávés, élénkítő', en: 'Coffee, uplifting' }, when: { hu: 'Reggel, a kávé mellé', en: 'Mornings, with coffee' },
      ing: { hu: 'guarana kivonat, zöld tea kivonat, kávébab aroma, mentol, növényi glicerin, tisztított víz', en: 'guarana extract, green tea extract, coffee bean aroma, menthol, vegetable glycerin, purified water' } },
    liver: { n: '03', c: '#7b4fa6', bg: '#ece2f7', rating: 4.8, rc: 187, name: { hu: 'Májtámogató', en: 'Liver Support' },
      cut: 'ezgif-3b6a1156b1892a5d.webp?v=1788542558', pack: 'ezgif-500d27a7d1bbc338.webp?v=1788618795', herb: 'ezgif-37ca167824935917.webp?v=1788541041',
      tag: { hu: 'Gyógynövényes formula a mindennapi egyensúlyért.', en: 'A herbal formula for everyday balance.' },
      herbs: { hu: ['Máriatövis', 'Articsóka', 'Gyermekláncfű', 'Kamilla'], en: ['Milk thistle', 'Artichoke', 'Dandelion', 'Chamomile'] },
      profile: { hu: 'Lágy, gyógynövényes', en: 'Soft & herbal' }, when: { hu: 'Napközben, étkezés után', en: 'Daytime, after meals' },
      ing: { hu: 'máriatövis, articsóka, gyermekláncfű, kamilla, növényi glicerin, tisztított víz', en: 'milk thistle, artichoke, dandelion, chamomile, vegetable glycerin, purified water' } },
    sleep: { n: '04', c: '#3f7fc4', bg: '#dde9f9', rating: 4.9, rc: 298, name: { hu: 'Alvástámogató', en: 'Sleep Support' },
      cut: 'Kaching-Bundles-ezgif-1cedbac2471da28e.webp?v=1788775577', pack: 'ezgif-8654bea4d0addf27.webp?v=1788516101', herb: 'ezgif-3b0f6f6dbb1b410d.webp?v=1788541063',
      tag: { hu: 'Nyugtató esti formula a lelassuláshoz.', en: 'A calming evening formula to help you slow down.' },
      herbs: { hu: ['Levendula', 'Kamilla', 'Ashwagandha'], en: ['Lavender', 'Chamomile', 'Ashwagandha'] },
      profile: { hu: 'Virágos, nyugtató', en: 'Floral & calming' }, when: { hu: 'Este, lefekvés előtt', en: 'Evenings, before bed' },
      ing: { hu: 'levendula, kamilla, ashwagandha, növényi glicerin, tisztított víz', en: 'lavender, chamomile, ashwagandha, vegetable glycerin, purified water' } }
  };
  const ACC = {
    pack4: { type: 'bundle', price: 15990, compare: 23990, rating: 4.9, rc: 156, img: 'ezgif-8c598b2ba6afbc63.webp?v=1788516127', alt: 'ezgif-434251d2f7345bcd_16458030-5b4b-4be6-9cef-b42f5c4586fd.webp?v=1782319799', name: { hu: '4 az 1-ben inhalátor csomag', en: '4-in-1 Inhaler Pack' }, desc: { hu: 'Mind a 4 formula egy dobozban', en: 'All 4 formulas in one box' }, badge: { hu: 'Mind a 4 íz', en: 'All 4 flavours' } },
    spray: { type: 'acc', price: 3890, rating: 4.7, rc: 94, img: 'ezgif-6a405effea74eecc.webp?v=1788802392', name: { hu: 'Gyógynövényes szájspray 30 ml', en: 'Herbal Mouth Spray 30 ml' }, desc: { hu: 'Friss lehelet útközben', en: 'Fresh breath on the go' } },
    drops: { type: 'acc', price: 6290, rating: 4.8, rc: 73, img: 'ezgif-2b7071b809139e73.webp?v=1791832982', name: { hu: 'Leheletfrissítő cseppek', en: 'Breath Freshening Drops' }, desc: { hu: 'Ökörfarkkóró levél kivonat', en: 'Mullein leaf extract' }, badge: { hu: 'Új', en: 'New' } },
    guide: { type: 'acc', price: 3190, rating: 4.9, rc: 88, img: 'ezgif-60f33e3fb63e2472.webp?v=1788802387', name: { hu: '21 napos leszokási útmutató', en: '21-Day Quit Guide' }, desc: { hu: 'Napi rituálé lépésről lépésre', en: 'A daily ritual, step by step' } },
    car: { type: 'acc', price: 3990, rating: 4.7, rc: 41, img: 'ezgif-3831567f0ba453ce.webp?v=1791837577', name: { hu: 'Autós szageltávolító készlet', en: 'Car Odour Removal Kit' }, desc: { hu: 'Búcsú a cigarettaszagtól', en: 'Say goodbye to smoke smell' } },
    strips: { type: 'acc', price: 2990, rating: 4.6, rc: 52, img: 'ezgif-60969cc14a3cd7d3_fc9eaad9-f44a-4f44-a15f-639665f1d8c6.webp?v=1788802441', name: { hu: 'Orrtágító csíkok', en: 'Nasal Breathing Strips' }, desc: { hu: 'Könnyebb légzés alváshoz', en: 'Easier breathing for sleep' } },
    filters: { type: 'acc', price: 1890, rating: 4.7, rc: 36, img: 'ezgif-68e331c49f7d00d7.webp?v=1788802394', name: { hu: 'Higiéniai szájfilterek', en: 'Hygienic Mouth Filters' }, desc: { hu: 'Tiszta használat minden nap', en: 'Clean use, every day' } }
  };
  const GRID = ['lung', 'energy', 'sleep', 'liver', 'pack4', 'spray', 'drops', 'guide'];
  const TIERS = { 1: { pay: 1, n: 2 }, 2: { pay: 2, n: 4 }, 3: { pay: 3, n: 6 } };
  const REVIEWS = [
    { n: 'Kata D.', city: 'Debrecen', f: 'energy', s: 5, d: '2026-11-18', t: { hu: 'Pont a reggeli kávés pillanat', en: 'Exactly my morning coffee moment' }, b: { hu: 'A kávé melletti cigi volt a legnehezebb. Az Energizáló pont ezt a pillanatot vette át. Három hete nem gyújtottam rá.', en: 'The cigarette with my coffee was the hardest. Energy Boost took over exactly that moment. Three weeks without lighting up.' } },
    { n: 'Gábor K.', city: 'Budapest', f: 'sleep', s: 5, d: '2026-11-15', t: { hu: 'Az esti rutinom része lett', en: 'Now part of my evening routine' }, b: { hu: 'Esténként az Alvástámogatót használom, nagyon kellemes levendulás íze van. Gyors szállítás, szép csomagolás.', en: 'I use Sleep Support in the evenings – lovely lavender taste. Fast delivery, beautiful packaging.' } },
    { n: 'Eszter V.', city: 'Győr', f: 'lung', s: 5, d: '2026-11-12', t: { hu: 'Mind a négyet kipróbáltam', en: 'Tried all four' }, b: { hu: 'A 2+2 csomagot vettem, így mind a négyet kipróbálhattam. A mentás Tüdőtisztító lett a kedvencem a kocsiban.', en: 'I got the 2+2 bundle so I could try all four. The minty Lung Cleanse is my favourite in the car.' } },
    { n: 'Péter S.', city: 'Szeged', f: 'lung', s: 4, d: '2026-11-09', t: { hu: 'Megmarad a mozdulat', en: 'The motion stays' }, b: { hu: 'Ez hiányzott volna a legjobban. Másnap már meg is érkezett GLS-sel, utánvéttel fizettem.', en: 'That’s what I would have missed most. It arrived the next day with GLS, paid cash on delivery.' } },
    { n: 'Anna B.', city: 'Pécs', f: 'liver', s: 5, d: '2026-11-05', t: { hu: 'Ebéd utáni új szokás', en: 'My new after-lunch habit' }, b: { hu: 'Étkezés után mindig rágyújtottam. Most a Májtámogató van nálam, lágy, kellemes íz.', en: 'I always lit up after meals. Now I carry Liver Support – soft, pleasant taste.' } },
    { n: 'Bence H.', city: 'Budapest', f: 'liver', s: 5, d: '2026-10-25', t: { hu: 'A garancia miatt mertem', en: 'Tried it thanks to the guarantee' }, b: { hu: 'A 30 napos garancia miatt mertem kipróbálni. Nem bántam meg, azóta a 3+3-at rendeltem.', en: 'The 30-day guarantee made me try it. No regrets – I’ve since ordered the 3+3.' } }
  ];

  /* ---------------- i18n ---------------- */
  const EN = {
    ann1: 'Black Friday · 1+1 · 2+2 · 3+3 – the second inhaler is free', ann2: 'Free GLS shipping over 14.990 Ft', ann3: '30-day money-back guarantee', ann4: 'Cash on delivery available', annEnds: 'Ends in',
    navFormulas: 'Formulas', navShop: 'Shop', navOffer: 'Black Friday', navHow: 'How it works', navReviews: 'Reviews', navFaq: 'FAQ',
    heroRating: '· 1,000+ customer reviews', heroT1: 'Keep the ritual.', heroT2: 'Let go of the nicotine.',
    heroSub: 'Four carefully blended herbal formulas, with zero nicotine. Non-combustible, smoke-free, and ready whenever the urge hits.',
    heroOfferT: '2+2 bundle – all 4 flavours', heroOfferS: 'with free shipping', pc: 'pc', heroCta1: 'Get the 2+2 bundle', heroCta2: 'Explore the formulas',
    tick1: '0 mg nicotine', tick2: 'GLS 1–2 working days', tick3: 'Cash on delivery',
    f_lung: 'Lung Cleanse', f_sleep: 'Sleep Support', f_liver: 'Liver Support', f_energy: 'Energy Boost', fs_lung: 'Mint · Thyme', fs_sleep: 'Lavender · Chamomile',
    sealText: 'MONEY-BACK GUARANTEE • 30 DAYS • ', sealText2: 'RISK-FREE • 30-DAY GUARANTEE • ', from: 'From', perPiece: '/ pc in bundles',
    tb1: 'Made in Hungary', tb1s: 'Local development & warehouse', tb2: 'GLS 1–2 working days', tb2s: 'Home or parcel point', tb3: '30-day guarantee', tb3s: 'Try it risk-free', tb4: 'Secure payment', tb4s: 'Card, Apple/Google Pay, COD',
    fEyebrow: 'One system · Four formulas', fTitle: 'Which moment needs <em>a hand?</em>', fLead: 'Pick a time of day – we’ll show you the formula that fits.',
    m_lung: 'Any time', m_energy: 'Morning', m_liver: 'Daytime', m_sleep: 'Evening', promo50: '−50% PROMO', profile: 'Flavour', bestFor: 'When', puffs: 'Format', puffsVal: '1 pc · non-combustible', fullIng: 'Full ingredient list',
    save50: 'You save 8.990 Ft (−50%)', addToCart: 'Add to cart',
    shopEyebrow: 'Bestsellers', shopTitle: 'Our favourites, <em>half price.</em>', tabAll: 'All', tabInh: 'Inhalers', tabBun: 'Bundles', tabAcc: 'Accessories',
    bfEyebrow: 'Black Friday · limited time', bfTitle: 'Buy one, <em>we’ll gift you the second.</em>', bfLead: 'Build your own bundle from any formula. The more you pick, the more you save.',
    days: 'days', hours: 'hrs', mins: 'min', secs: 'sec', perk1: 'Mix any of the 4 formulas freely', perk2: 'Free shipping on 2+2 and 3+3', perk3: 'Free 21-day guide with 3+3', perk4: '30-day guarantee – risk-free',
    t1q: '2 pcs', t2q: '4 pcs · free shipping', t3q: '6 pcs · + guide', popular: 'Most popular', bestValue: 'Best value', pickFormulas: 'Choose your formulas', total: 'Total',
    cantDecide: 'Can’t decide?', pickForMe: 'One of each →', bt1: '🛡️ 30-day guarantee', bt2: '🚚 GLS 1–2 days', bt3: '💳 Cash on delivery',
    howQuote: '“It replaced the cigarette with my morning coffee. Three weeks without lighting up.”', howEyebrow: 'As simple as a breath', howTitle: 'No refills, no prep. <em>Just you and a deep breath.</em>',
    s1t: 'The urge hits', s1p: 'With coffee, while driving or after a stressful meeting – reach for your Herby.', s2t: 'Breathe through it', s2p: 'A few slow draws with the familiar hand-to-mouth motion. Nothing burns, no smoke.', s3t: 'Keep going', s3p: 'The ritual stays, the nicotine doesn’t. Each day gets a little easier.', howCta: 'Try it risk-free',
    nicotine: 'nicotine', whyEyebrow: 'Why is Herby different?', whyTitle: 'What matters <em>stays.</em>', others: 'Other alternatives',
    cmp1: 'Nicotine-free', cmp2: 'Familiar hand-to-mouth routine', cmp3: 'Targeted herbal formulas', cmp4: 'Non-combustible, smoke-free', cmp5: 'No refilling, no charging', cmp6: '30-day money-back',
    varies: 'Varies', oftenNo: 'Often not', oftenNone: 'Often none', whyCta: 'Try it risk-free',
    revEyebrow: 'What customers say', revTitle: 'Over 1,000 people <em>have already chosen it.</em>', revBased: 'Based on 1,000+ verified reviews',
    gTitle: 'Try it for 30 days. <em>Risk-free.</em>', gLead: 'If it doesn’t work for you, we refund you. No small print – just write to us.', gCta: 'Choose a bundle',
    faqEyebrow: 'Frequently asked questions', faqTitle: 'Got a <em>question?</em>', faqLead: 'Write to us – we usually reply within a few hours.', helpT: 'Customer support',
    q1: 'How do I use it?', a1: 'When the urge hits, take it out and draw on it slowly a few times. No refilling, no preparation.',
    q2: 'Does it contain nicotine?', a2: 'No. Herby is completely nicotine-free, non-combustible and smoke-free.',
    q3: 'Which formula should I choose?', a3: 'Lung Cleanse is fresh and minty. Energy Boost is for busy days, Sleep Support for evenings, Liver Support for everyday balance. Not sure? The 2+2 bundle lets you try all four.',
    q4: 'What if it doesn’t work for me?', a4: 'You’re covered by our 30-day money-back guarantee. If you don’t like it, we refund you.',
    q5: 'How long is delivery and how can I pay?', a5: '1–2 working days with GLS, to your home or a parcel point. Pay by card, Apple Pay, Google Pay or cash on delivery.',
    finalTitle: 'Your first smoke-free morning <em>arrives tomorrow.</em>', finalLead: 'Order today and try it for 30 days. If it doesn’t work for you, you get your money back.', finalCta: 'Get the Black Friday bundle',
    nlTitle: '−10% off your first order', nlSub: 'Subscribe and we’ll send tips for smoke-free days, too.', nlPh: 'Your email address', nlBtn: 'Subscribe',
    footAbout: 'Herbal inhalers for smoke-free everyday life. Made in Hungary.', footShop: 'Shop', footInfo: 'Information', footContact: 'Contact', ft1: 'Terms of service', ft2: 'Privacy policy', ft3: 'Shipping', ft4: 'Returns & withdrawal', cod: 'Cash on delivery',
    stickyT: 'Black Friday 2+2 – all 4 flavours', stickyBtn: 'Add to cart',
    cartTitle: 'Your cart', cartBf: 'Black Friday prices end in', g1: 'Free shipping', g2: 'Free mouth spray', emptyT: 'Your cart is empty for now.', emptyS: 'Most people start with the 2+2 bundle.', emptyCta: 'Add 2+2 bundle – 17.980 Ft',
    upsellT: 'Frequently bought together', protectT: 'Package protection', protectS: 'Lost or damaged parcel? We reship immediately', subtotal: 'Subtotal', youSave: 'You save', shipping: 'Shipping (GLS)', checkout: 'Secure checkout', cartTrust: '30-day guarantee · Card or cash on delivery · SSL'
  };
  const T = {
    hu: { add: 'Kosárba', quickAdd: '+ Kosárba', added: n => `✓ ${n} a kosárban`, free: 'INGYEN', freeTxt: 'Ingyenes', remove: 'Törlés', inhaler: 'inhalátor', bundle: t => `Black Friday ${t}+${t} csomag`,
      fill: n => `Válassz még ${n} formulát`, addBundle: v => `Csomag a kosárba · ${ft(v)}`, saveX: v => `Spórolj ${ft(v)}-ot`, guide: '+ ajándék útmutató',
      tip: f => `Tipp: <b>1+1 csomagban</b> 8.990 Ft-ért <b>2 db ${f}</b> a tiéd.`,
      toShip: v => `Még <b>${ft(v)}</b> és <b>ingyenes a szállítás</b>`, toGift: v => `✓ Ingyenes szállítás! Még <b>${ft(v)}</b> és <b>ajándék szájspray</b> jár`, done: '🎉 <b>Ingyenes szállítás + ajándék szájspray</b> – megszerezted!',
      gift: 'Ajándék szájspray 30 ml', up1: f => `Válts <b>1+1</b>-re: kapsz mellé egy második ${f}-t <b>ingyen</b>.`, upN: (t, v) => `Bővítsd <b>${t}+${t}</b>-re csak <b>+${ft(v)}</b>-ért – +2 inhalátor${t === 2 ? ' és ingyenes szállítás' : ' és ajándék útmutató'}.`, upBtn: 'Bővítés',
      verified: 'Ellenőrzött vásárló', nl: 'Köszönjük! A −10% kódot elküldtük.', checkoutMsg: 'Prototípus – itt indulna a Shopify pénztár.' },
    en: { add: 'Add to cart', quickAdd: '+ Add to cart', added: n => `✓ ${n} added to cart`, free: 'FREE', freeTxt: 'Free', remove: 'Remove', inhaler: 'inhaler', bundle: t => `Black Friday ${t}+${t} bundle`,
      fill: n => `Choose ${n} more`, addBundle: v => `Add bundle · ${ft(v)}`, saveX: v => `You save ${ft(v)}`, guide: '+ free guide',
      tip: f => `Tip: in the <b>1+1 bundle</b> you get <b>2× ${f}</b> for 8.990 Ft.`,
      toShip: v => `<b>${ft(v)}</b> away from <b>free shipping</b>`, toGift: v => `✓ Free shipping! <b>${ft(v)}</b> more for a <b>free mouth spray</b>`, done: '🎉 <b>Free shipping + free mouth spray</b> – unlocked!',
      gift: 'Free mouth spray 30 ml', up1: f => `Switch to <b>1+1</b>: get a second ${f} <b>free</b>.`, upN: (t, v) => `Upgrade to <b>${t}+${t}</b> for just <b>+${ft(v)}</b> – +2 inhalers${t === 2 ? ' and free shipping' : ' and a free guide'}.`, upBtn: 'Upgrade',
      verified: 'Verified buyer', nl: 'Thank you! Your −10% code is on its way.', checkoutMsg: 'Prototype – Shopify checkout would start here.' }
  };
  let lang = 'hu';
  try { lang = localStorage.getItem('herbyv2-lang') || 'hu'; } catch (e) {}
  const HU = {};
  $$('[data-i18n]').forEach(el => { if (!(el.dataset.i18n in HU)) HU[el.dataset.i18n] = el.innerHTML; });
  $$('[data-i18n-ph]').forEach(el => HU[el.dataset.i18nPh] = el.placeholder);
  const tr = k => lang === 'en' ? (EN[k] ?? HU[k]) : HU[k];
  const t = () => T[lang];
  const rate = r => lang === 'hu' ? String(r).replace('.', ',') : String(r);

  function applyLang(animate) {
    const run = () => {
      document.documentElement.lang = lang;
      $$('[data-i18n]').forEach(el => el.innerHTML = tr(el.dataset.i18n));
      $$('[data-i18n-ph]').forEach(el => el.placeholder = tr(el.dataset.i18nPh));
      document.title = lang === 'en' ? 'Herby – Herbal Inhalers | The nicotine-free ritual' : 'Herby – Gyógynövényes inhalátorok | Nikotinmentes rituálé';
      $('#lang').dataset.active = lang;
      $$('.lang__btn').forEach(b => { const on = b.dataset.lang === lang; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on); });
      renderFormula(curF, false); renderGrid(); renderBuilder(); renderReviews(); renderCart();
    };
    if (!animate) return run();
    $('main').animate([{ opacity: 1 }, { opacity: .35 }, { opacity: 1 }], { duration: 380, easing: 'ease-out' });
    setTimeout(run, 130);
  }
  $$('.lang__btn').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang; try { localStorage.setItem('herbyv2-lang', lang); } catch (e) {}
    applyLang(true);
  }));

  /* ---------------- header ---------------- */
  $('#menuBtn').addEventListener('click', () => $('#nav').classList.toggle('open'));
  $$('#nav a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('open')));

  /* ---------------- hero ---------------- */
  const hv = $('#heroVisual');
  $$('.cut').forEach(c => {
    c.addEventListener('mouseenter', () => hv.style.setProperty('--disc', F[c.dataset.f].bg));
    c.addEventListener('click', () => { selectFormula(c.dataset.f); $('#formulas').scrollIntoView({ behavior: 'smooth' }); });
  });
  hv.addEventListener('mouseleave', () => hv.style.removeProperty('--disc'));
  if (matchMedia('(pointer:fine)').matches) {
    hv.addEventListener('mousemove', e => {
      const r = hv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      $$('.float-card,.price-tag,.leaf', hv).forEach((el, i) => el.style.translate = `${x * (12 + i * 5)}px ${y * (12 + i * 5)}px`);
    });
  }
  $('#heroAdd').addEventListener('click', () => addItem(bundleItem(2, ['lung', 'energy', 'liver', 'sleep'])));

  /* ---------------- formula explorer ---------------- */
  let curF = 'lung', fq = 1;
  const stage = $('#formulaStage');
  function renderFormula(k, anim = true) {
    const f = F[k]; curF = k;
    const paint = () => {
      stage.style.setProperty('--fc', f.c); stage.style.setProperty('--fbg', f.bg);
      $('#fHerb').src = im(f.herb, 1000); $('#fProduct').src = im(f.cut, 700); $('#fProduct').alt = f.name[lang];
      $('#fNum').textContent = f.n + ' / 04';
      $('#fTitle').textContent = f.name[lang]; $('#fTag').textContent = f.tag[lang];
      $('#fHerbs').innerHTML = f.herbs[lang].map(h => `<span>${h}</span>`).join('');
      $('#fProfile').textContent = f.profile[lang]; $('#fWhen').textContent = f.when[lang]; $('#fIng').textContent = f.ing[lang];
      $('#fRate').textContent = rate(f.rating); $('#fRc').textContent = `(${f.rc})`;
      $('#fAdd').style.background = f.c;
      $('#fTipTxt').innerHTML = t().tip(f.name[lang]);
    };
    if (!anim) return paint();
    stage.classList.add('is-swapping');
    setTimeout(() => { paint(); requestAnimationFrame(() => stage.classList.remove('is-swapping')); }, 320);
  }
  function selectFormula(k) {
    $$('.mtab').forEach(x => x.classList.toggle('is-active', x.dataset.f === k));
    if (k !== curF) renderFormula(k);
  }
  $$('.mtab').forEach(b => b.addEventListener('click', () => selectFormula(b.dataset.f)));
  $('#fqM').addEventListener('click', () => { fq = Math.max(1, fq - 1); $('#fqV').textContent = fq; });
  $('#fqP').addEventListener('click', () => { fq = Math.min(9, fq + 1); $('#fqV').textContent = fq; });
  $('#fAdd').addEventListener('click', () => { for (let i = 0; i < fq; i++) addItem(singleItem(curF), i < fq - 1); fq = 1; $('#fqV').textContent = 1; });
  $('#fTip').addEventListener('click', () => addItem(bundleItem(1, [curF, curF])));

  /* ---------------- product grid ---------------- */
  let tab = 'all';
  const typeOf = k => F[k] ? 'inhaler' : ACC[k].type;
  function card(k, i) {
    const isF = !!F[k], p = isF ? F[k] : ACC[k], price = isF ? UNIT : p.price, cmp = isF ? UNIT_CMP : p.compare;
    const media = isF
      ? `<img class="pc__main cutimg" src="${im(p.cut, 500)}" alt="${p.name[lang]}" loading="lazy"><img class="pc__alt" src="${im(p.pack, 600)}" alt="" loading="lazy">`
      : `<img class="pc__main" src="${im(p.img, 600)}" alt="${p.name[lang]}" loading="lazy">${p.alt ? `<img class="pc__alt" src="${im(p.alt, 600)}" alt="" loading="lazy">` : ''}`;
    const badges = [cmp ? `<span class="bdg bdg--sale">−${Math.round((1 - price / cmp) * 100)}%</span>` : '', k === 'lung' ? '<span class="bdg bdg--dark">Bestseller</span>' : '', p.badge ? `<span class="bdg">${p.badge[lang]}</span>` : ''].join('');
    return `<article class="pc" style="--bg:${isF ? p.bg : '#efe7d7'};animation-delay:${i * 50}ms">
      <div class="pc__media">${media}<div class="pc__badges">${badges}</div><div class="pc__quick"><button data-add="${k}">${t().quickAdd}</button></div></div>
      <div class="pc__body"><div class="pc__rate"><span class="stars">★★★★★</span> ${rate(p.rating)} (${p.rc})</div>
        <h3>${p.name[lang]}</h3><p class="pc__desc">${isF ? p.herbs[lang].join(' · ') : p.desc[lang]}</p>
        <div class="pc__row"><div class="pc__price"><b>${ft(price)}</b>${cmp ? `<s>${ft(cmp)}</s>` : ''}</div><button class="pc__add" data-add="${k}" aria-label="${t().add}">+</button></div></div></article>`;
  }
  function renderGrid() { $('#pgrid').innerHTML = GRID.filter(k => tab === 'all' || typeOf(k) === tab).map(card).join(''); }
  $('#tabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b) return; tab = b.dataset.tab; $$('#tabs button').forEach(x => x.classList.toggle('on', x === b)); renderGrid(); });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    const k = b.dataset.add;
    addItem(F[k] ? singleItem(k) : { key: 'a-' + k, kind: 'acc', id: k, price: ACC[k].price, compare: ACC[k].compare || 0 });
  });

  /* ---------------- bundle builder ---------------- */
  let tier = 2, picks = [];
  function renderBuilder() {
    const n = TIERS[tier].n, pay = TIERS[tier].pay;
    const slots = $('#slots'); slots.style.setProperty('--n', n);
    slots.innerHTML = Array.from({ length: n }, (_, i) => {
      const k = picks[i];
      if (!k) return `<div class="slot">+</div>`;
      return `<div class="slot filled" style="--c:${F[k].c};--bg:${F[k].bg}"><img src="${im(F[k].cut, 200)}" alt="${F[k].name[lang]}"><button class="x" data-i="${i}" aria-label="remove">×</button>${i >= pay ? `<span class="free">${t().free}</span>` : ''}</div>`;
    }).join('');
    $('#slotCount').textContent = `${picks.length} / ${n}`;
    $('#bProg').style.width = (picks.length / n * 100) + '%';
    $$('.pick').forEach(p => p.disabled = picks.length >= n);
    const total = pay * UNIT, cmp = n * UNIT_CMP;
    $('#bTotal').textContent = ft(total);
    $('#bSave').textContent = t().saveX(cmp - total) + (tier === 3 ? ' ' + t().guide : '');
    const left = n - picks.length;
    $('#bAdd').disabled = left > 0;
    $('#bAddLabel').textContent = left > 0 ? t().fill(left) : t().addBundle(total);
  }
  $$('.tier').forEach(b => b.addEventListener('click', () => {
    tier = +b.dataset.tier; picks = picks.slice(0, TIERS[tier].n);
    $$('.tier').forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-checked', x === b); });
    renderBuilder();
  }));
  $$('.pick').forEach(p => p.addEventListener('click', () => { if (picks.length < TIERS[tier].n) { picks.push(p.dataset.f); renderBuilder(); } }));
  $('#slots').addEventListener('click', e => { const x = e.target.closest('.x'); if (x) { picks.splice(+x.dataset.i, 1); renderBuilder(); } });
  $('#autoFill').addEventListener('click', () => { picks = []; for (let i = 0; i < TIERS[tier].n; i++) picks.push(ORDER[i % 4]); renderBuilder(); });
  $('#bAdd').addEventListener('click', () => { addItem(bundleItem(tier, [...picks])); picks = []; renderBuilder(); });
  const singleItem = k => ({ key: 's-' + k, kind: 'single', f: k, price: UNIT, compare: UNIT_CMP });
  function bundleItem(tr_, list) {
    return { key: `b${tr_}-${[...list].sort().join('.')}`, kind: 'bundle', tier: tr_, picks: list, price: TIERS[tr_].pay * UNIT, compare: TIERS[tr_].n * UNIT_CMP };
  }
  $('#stickyAdd').addEventListener('click', () => addItem(bundleItem(2, ['lung', 'energy', 'liver', 'sleep'])));

  /* countdown */
  let end = new Date('2026-11-30T23:59:59+01:00').getTime();
  const pad = v => String(v).padStart(2, '0');
  function tick() {
    let d = end - Date.now(); if (d <= 0) { end = Date.now() + 3 * 864e5; d = end - Date.now(); }
    const D = Math.floor(d / 864e5), H = pad(Math.floor(d / 36e5) % 24), M = pad(Math.floor(d / 6e4) % 60), S = pad(Math.floor(d / 1e3) % 60);
    $('#cdD').textContent = D; $('#cdH').textContent = H; $('#cdM').textContent = M; $('#cdS').textContent = S;
    const s = `${D}${lang === 'en' ? 'd' : 'n'} ${H}:${M}:${S}`;
    $('#annCd').textContent = s; $('#stickyCd').textContent = s; $('#cartCd').textContent = s;
  }
  tick(); setInterval(tick, 1000);

  /* ---------------- reviews slider ---------------- */
  let ri = 0;
  const perView = () => innerWidth > 900 ? 2 : 1;
  function renderReviews() {
    $('#revTrack').innerHTML = REVIEWS.map(r => `<article class="rev">
      <div class="rev__top"><span class="stars">${'★'.repeat(r.s)}${'☆'.repeat(5 - r.s)}</span><small>${new Date(r.d).toLocaleDateString(lang === 'en' ? 'en-GB' : 'hu-HU', { month: 'short', day: 'numeric' })}</small></div>
      <h4>${lang === 'en' ? '“' : '„'}${r.t[lang]}”</h4><p>${r.b[lang]}</p>
      <footer><span class="av" style="--c:${F[r.f].c}">${r.n[0]}</span><div><b>${r.n}</b>, ${r.city}<small>✓ ${t().verified}</small></div>
      <span class="rev__prod"><img src="${im(F[r.f].cut, 80)}" alt="">${F[r.f].name[lang]}</span></footer></article>`).join('');
    slide(ri);
  }
  function slide(i) {
    const pages = REVIEWS.length - perView() + 1;
    ri = (i + pages) % pages;
    const card = $('.rev'); if (!card) return;
    $('#revTrack').style.transform = `translateX(${-ri * (card.offsetWidth + 18)}px)`;
    $('#revDots').innerHTML = Array.from({ length: pages }, (_, j) => `<i class="${j === ri ? 'on' : ''}"></i>`).join('');
  }
  $('#revNext').addEventListener('click', () => slide(ri + 1));
  $('#revPrev').addEventListener('click', () => slide(ri - 1));
  addEventListener('resize', () => slide(ri));
  let auto = setInterval(() => slide(ri + 1), 6000);
  $('.rev-slider').addEventListener('mouseenter', () => clearInterval(auto));

  /* ---------------- cart ---------------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('herbyv2-cart') || '[]'); } catch (e) {}
  const save = () => { try { localStorage.setItem('herbyv2-cart', JSON.stringify(cart)); } catch (e) {} };
  const itemName = it => it.kind === 'single' ? `${F[it.f].name[lang]} ${t().inhaler}` : it.kind === 'bundle' ? t().bundle(it.tier) : it.kind === 'gift' ? t().gift : ACC[it.id].name[lang];
  const itemImg = it => it.kind === 'single' ? `<div class="ci__img" style="--bg:${F[it.f].bg}"><img class="cutimg" src="${im(F[it.f].cut, 200)}" alt=""></div>`
    : it.kind === 'bundle' ? `<div class="ci__img" style="--bg:${F[it.picks[0]].bg}"><img class="cutimg" src="${im(F[it.picks[0]].cut, 200)}" alt=""></div>`
    : `<div class="ci__img"><img src="${im(it.kind === 'gift' ? ACC.spray.img : ACC[it.id].img, 200)}" alt=""></div>`;

  function addItem(it, silent) {
    const ex = cart.find(c => c.key === it.key);
    ex ? ex.qty++ : cart.push({ ...it, qty: 1 });
    save(); renderCart();
    if (silent) return;
    openCart(); toast(t().added(itemName(it)));
    const cc = $('#cartCount'); cc.classList.remove('bump'); void cc.offsetWidth; cc.classList.add('bump');
  }
  function renderCart() {
    const sub = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const savings = cart.reduce((s, c) => s + (c.compare ? (c.compare - c.price) * c.qty : 0), 0);
    const count = cart.reduce((s, c) => s + c.qty, 0), gift = sub >= GIFT;
    $('#cartCount').textContent = count; $('#cartN').textContent = `(${count})`;
    $('#cartEmpty').classList.toggle('show', !cart.length);
    const all = gift ? [...cart, { kind: 'gift', price: 0, compare: GIFT_VAL, qty: 1 }] : cart;
    $('#cartItems').innerHTML = all.map((c, i) => `<div class="ci ${c.kind === 'gift' ? 'ci--gift' : ''}">${itemImg(c)}
      <div><h5>${itemName(c)}</h5>
        ${c.kind === 'bundle' ? `<small>${ORDER.filter(k => c.picks.includes(k)).map(k => `${c.picks.filter(x => x === k).length}× ${F[k].name[lang]}`).join(' · ')}${c.tier === 3 ? ' ' + t().guide : ''}</small><div class="ci__dots">${c.picks.map(k => `<i style="--c:${F[k].c}"></i>`).join('')}</div>` : ''}
        ${c.kind === 'gift' ? '' : `<div class="qty"><button data-q="-1" data-i="${i}" aria-label="−">−</button><span>${c.qty}</span><button data-q="1" data-i="${i}" aria-label="+">+</button></div>`}</div>
      <div class="ci__price"><div><b>${c.price ? ft(c.price * c.qty) : t().freeTxt}</b>${c.compare ? `<s>${ft(c.compare * c.qty)}</s>` : ''}</div>${c.kind === 'gift' ? '<em>🎁</em>' : `<button class="ci__rm" data-rm="${i}">${t().remove}</button>`}</div></div>`).join('');

    $('#goalFill').style.width = Math.min(100, sub / GIFT * 100) + '%';
    $('#gp1').classList.toggle('hit', sub >= FREE_SHIP); $('#gp2').classList.toggle('hit', gift);
    $('#goalMsg').innerHTML = sub < FREE_SHIP ? t().toShip(FREE_SHIP - sub) : !gift ? t().toGift(GIFT - sub) : t().done;

    const single = cart.find(c => c.kind === 'single');
    const bun = cart.filter(c => c.kind === 'bundle').sort((a, b) => a.tier - b.tier)[0];
    $('#upgrade').innerHTML = single ? `<div class="upgrade__card"><span>🎁</span><span>${t().up1(F[single.f].name[lang])}</span><button class="btn btn--primary" data-up="single">${t().upBtn}</button></div>`
      : bun && bun.tier < 3 ? `<div class="upgrade__card"><span>⚡</span><span>${t().upN(bun.tier + 1, UNIT)}</span><button class="btn btn--primary" data-up="bundle">${t().upBtn}</button></div>` : '';

    const have = new Set(cart.filter(c => c.kind === 'acc').map(c => c.id));
    const inCart = new Set(cart.flatMap(c => c.kind === 'bundle' ? c.picks : c.kind === 'single' ? [c.f] : []));
    const list = [...ORDER.filter(k => cart.length && !inCart.has(k)), ...['spray', 'drops', 'guide', 'car', 'strips', 'filters', 'pack4'].filter(k => !have.has(k))].slice(0, 7);
    $('#upsellTrack').innerHTML = list.map(k => {
      const isF = !!F[k], p = isF ? F[k] : ACC[k];
      return `<div class="up"><div class="up__img" style="--bg:${isF ? p.bg : '#efe7d7'}"><img class="${isF ? 'cutimg' : ''}" src="${im(isF ? p.cut : p.img, 300)}" alt="" loading="lazy"></div><h6>${p.name[lang]}</h6>
        <div class="up__row"><strong>${ft(isF ? UNIT : p.price)}</strong><button data-add="${k}">+ ${lang === 'en' ? 'Add' : 'Kosár'}</button></div></div>`;
    }).join('');

    const prot = cart.length && $('#protect').checked ? PROTECT : 0;
    const ship = !cart.length || sub >= FREE_SHIP ? 0 : SHIP;
    $('#cSub').textContent = ft(sub);
    $('#cSave').textContent = '−' + ft(savings + (gift ? GIFT_VAL : 0)); $('#cSaveRow').style.display = savings ? '' : 'none';
    $('#cShip').innerHTML = !cart.length ? '–' : ship ? ft(ship) : `<s style="color:var(--muted);font-weight:400">${ft(SHIP)}</s> ${t().freeTxt}`;
    $('#cTotal').textContent = ft(sub + ship + prot);
    $('.protect').style.display = cart.length ? '' : 'none';
    $('.cart__bf').style.display = cart.length ? '' : 'none';
  }
  $('#cartItems').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    if (q) { const c = cart[+q.dataset.i]; c.qty += +q.dataset.q; if (c.qty < 1) cart.splice(+q.dataset.i, 1); }
    else if (rm) cart.splice(+rm.dataset.rm, 1); else return;
    save(); renderCart();
  });
  $('#upgrade').addEventListener('click', e => {
    const b = e.target.closest('[data-up]'); if (!b) return;
    if (b.dataset.up === 'single') {
      const i = cart.findIndex(c => c.kind === 'single'), s = cart[i];
      s.qty > 1 ? s.qty-- : cart.splice(i, 1);
      const it = bundleItem(1, [s.f, s.f]), ex = cart.find(c => c.key === it.key); ex ? ex.qty++ : cart.push({ ...it, qty: 1 });
    } else {
      const bs = cart.filter(c => c.kind === 'bundle').sort((a, b) => a.tier - b.tier)[0], i = cart.indexOf(bs);
      const nt = bs.tier + 1, np = [...bs.picks];
      while (np.length < TIERS[nt].n) np.push(ORDER.find(k => !np.includes(k)) || ORDER[np.length % 4]);
      bs.qty > 1 ? bs.qty-- : cart.splice(i, 1);
      cart.push({ ...bundleItem(nt, np), qty: 1 });
    }
    save(); renderCart();
  });
  $('#protect').addEventListener('change', renderCart);
  $('#emptyAdd').addEventListener('click', () => addItem(bundleItem(2, ['lung', 'energy', 'liver', 'sleep'])));
  $('#upNext').addEventListener('click', () => $('#upsellTrack').scrollBy({ left: 200 }));
  $('#upPrev').addEventListener('click', () => $('#upsellTrack').scrollBy({ left: -200 }));
  $('#checkout').addEventListener('click', () => toast(t().checkoutMsg));
  $$('.express__b').forEach(b => b.addEventListener('click', () => toast(t().checkoutMsg)));

  function openCart() { document.body.classList.add('cart-open'); $('#cart').setAttribute('aria-hidden', 'false'); }
  function closeCart() { document.body.classList.remove('cart-open'); $('#cart').setAttribute('aria-hidden', 'true'); }
  $('#cartBtn').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  $('#cartOverlay').addEventListener('click', closeCart);
  addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  /* toast + newsletter */
  let tt;
  function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2600); }
  $('#newsletter').addEventListener('submit', e => { e.preventDefault(); toast(t().nl); e.target.reset(); });

  /* scroll: header + sticky ATC */
  const header = $('#header'), sticky = $('#stickyAtc');
  function onScroll() {
    header.classList.toggle('is-scrolled', scrollY > 10);
    const off = $('#offer').getBoundingClientRect(), foot = $('.footer').getBoundingClientRect();
    sticky.classList.toggle('show', scrollY > 800 && !(off.top < innerHeight && off.bottom > 0) && foot.top > innerHeight);
  }
  addEventListener('scroll', onScroll, { passive: true });

  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  applyLang(false); onScroll();
})();
