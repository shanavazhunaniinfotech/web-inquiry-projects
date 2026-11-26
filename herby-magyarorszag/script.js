(() => {
  const CDN = 'https://cdn.shopify.com/s/files/1/1082/3408/0595/files/';
  const img = (f, w = 600) => `${CDN}${f}&width=${w}`;
  const FREE_SHIP = 14990, SHIP = 1490, PROTECT = 890;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ft = n => n.toLocaleString('de-DE') + ' Ft';

  /* ---------------- data ---------------- */
  const F = {
    lung: { n: '01', c: '#4f9a3a', name: { hu: 'Tüdőtisztító', en: 'Lung Cleanse' },
      product: img('Gyogynovenyestudotisztito30naposgaranciaval.webp?v=1794946867', 700),
      herb: img('ezgif-3efcab05e8584b9b.webp?v=1788541053', 1000),
      tag: { hu: 'Friss, mentás formula a légutak támogatására.', en: 'A fresh, minty formula to support your airways.' },
      herbs: { hu: ['Ökörfarkkóró', 'Kakukkfű', 'Menta'], en: ['Mullein', 'Thyme', 'Mint'] },
      profile: { hu: 'Friss, mentás', en: 'Fresh & minty' },
      when: { hu: 'Bármikor, bárhol', en: 'Any time, anywhere' },
      ing: { hu: 'ökörfarkkóró, kakukkfű, menta, mentol, növényi glicerin, tisztított víz', en: 'mullein, thyme, mint, menthol, vegetable glycerin, purified water' } },
    energy: { n: '02', c: '#e07b1f', name: { hu: 'Energizáló', en: 'Energy Boost' },
      product: img('ezgif-856b1e34197a4520.webp?v=1788516083', 700),
      herb: img('ezgif-38f1f834de31b8d3.webp?v=1788541059', 1000),
      tag: { hu: 'Frissítő formula a lendületesebb napokért.', en: 'A refreshing formula for days with more momentum.' },
      herbs: { hu: ['Guarana', 'Zöld tea', 'Kávébab', 'Mentol'], en: ['Guarana', 'Green tea', 'Coffee bean', 'Menthol'] },
      profile: { hu: 'Kávés, élénkítő', en: 'Coffee, uplifting' },
      when: { hu: 'Reggel, a kávé mellé', en: 'Mornings, with coffee' },
      ing: { hu: 'guarana kivonat, zöld tea kivonat, kávébab aroma, mentol, növényi glicerin, tisztított víz', en: 'guarana extract, green tea extract, coffee bean aroma, menthol, vegetable glycerin, purified water' } },
    liver: { n: '03', c: '#7b4fa6', name: { hu: 'Májtámogató', en: 'Liver Support' },
      product: img('ezgif-500d27a7d1bbc338.webp?v=1788618795', 700),
      herb: img('ezgif-37ca167824935917.webp?v=1788541041', 1000),
      tag: { hu: 'Gyógynövényes formula a mindennapi egyensúlyért.', en: 'A herbal formula for everyday balance.' },
      herbs: { hu: ['Máriatövis', 'Articsóka', 'Gyermekláncfű', 'Kamilla'], en: ['Milk thistle', 'Artichoke', 'Dandelion', 'Chamomile'] },
      profile: { hu: 'Lágy, gyógynövényes', en: 'Soft & herbal' },
      when: { hu: 'Napközben, étkezés után', en: 'Daytime, after meals' },
      ing: { hu: 'máriatövis, articsóka, gyermekláncfű, kamilla, növényi glicerin, tisztított víz', en: 'milk thistle, artichoke, dandelion, chamomile, vegetable glycerin, purified water' } },
    sleep: { n: '04', c: '#3f7fc4', name: { hu: 'Alvástámogató', en: 'Sleep Support' },
      product: img('ezgif-8654bea4d0addf27.webp?v=1788516101', 700),
      herb: img('ezgif-3b0f6f6dbb1b410d.webp?v=1788541063', 1000),
      tag: { hu: 'Nyugtató esti formula a lelassuláshoz.', en: 'A calming evening formula to help you slow down.' },
      herbs: { hu: ['Levendula', 'Kamilla', 'Ashwagandha'], en: ['Lavender', 'Chamomile', 'Ashwagandha'] },
      profile: { hu: 'Virágos, nyugtató', en: 'Floral & calming' },
      when: { hu: 'Este, lefekvés előtt', en: 'Evenings, before bed' },
      ing: { hu: 'levendula, kamilla, ashwagandha, növényi glicerin, tisztított víz', en: 'lavender, chamomile, ashwagandha, vegetable glycerin, purified water' } }
  };
  const ADDONS = [
    { id: 'pack4', name: { hu: '4 az 1-ben inhalátor csomag', en: '4-in-1 Inhaler Pack' }, price: 15990, compare: 23990, img: img('ezgif-8c598b2ba6afbc63.webp?v=1788516127') },
    { id: 'spray', name: { hu: 'Gyógynövényes szájspray, 30 ml', en: 'Herbal Mouth Spray, 30 ml' }, price: 3890, img: img('ezgif-6a405effea74eecc.webp?v=1788802392') },
    { id: 'drops', name: { hu: 'Leheletfrissítő cseppek', en: 'Breath Freshening Drops' }, price: 6290, img: img('ezgif-2b7071b809139e73.webp?v=1791832982') },
    { id: 'guide', name: { hu: '21 napos leszokási útmutató', en: '21-Day Quit Guide' }, price: 3190, img: img('ezgif-60f33e3fb63e2472.webp?v=1788802387') },
    { id: 'car', name: { hu: 'Autós cigarettaszag-eltávolító készlet', en: 'Car Smoke-Odour Removal Kit' }, price: 3990, img: img('ezgif-3831567f0ba453ce.webp?v=1791837577') },
    { id: 'strips', name: { hu: 'Orrtágító csíkok', en: 'Nasal Breathing Strips' }, price: 2990, img: img('ezgif-60969cc14a3cd7d3_fc9eaad9-f44a-4f44-a15f-639665f1d8c6.webp?v=1788802441') },
    { id: 'filters', name: { hu: 'Higiéniai szájfilterek', en: 'Hygienic Mouth Filters' }, price: 1890, img: img('ezgif-68e331c49f7d00d7.webp?v=1788802394') }
  ];
  const TIERS = { 1: { pay: 1, n: 2 }, 2: { pay: 2, n: 4 }, 3: { pay: 3, n: 6 } };
  const UNIT = 8990, UNIT_CMP = 17980;

  /* ---------------- i18n ---------------- */
  const EN = {
    ann1: 'Black Friday · 1+1 · 2+2 · 3+3 – Herby’s best offer of the year', ann2: 'Free shipping over 14.990 Ft', ann3: 'Giveaway · 3 winners · prizes worth 550.000 Ft', ann4: '30-day money-back guarantee',
    navFormulas: 'Formulas', navOffer: 'Black Friday', navHow: 'How it works', navReviews: 'Reviews', navFaq: 'FAQ',
    heroRating: '· 1,000+ customer reviews', heroT1: 'Keep the ritual.', heroT2: 'Let go of the nicotine.',
    heroSub: 'Four carefully blended herbal formulas, with zero nicotine. Non-combustible, smoke-free, and ready whenever the urge hits.',
    heroCta1: 'Black Friday deal', heroCta2: 'Find your formula', tick1: 'Nicotine-free', tick2: '1–2 day GLS delivery', tick3: '30-day guarantee',
    f_lung: 'Lung Cleanse', f_sleep: 'Sleep Support', f_liver: 'Liver Support', f_energy: 'Energy Boost',
    fs_lung: 'Mint · Thyme', fs_sleep: 'Lavender · Chamomile', sealText: 'MONEY-BACK GUARANTEE • 30 DAYS • ',
    from: 'From', perPiece: '/ piece in the 2+2 bundle',
    tb1: 'Made in Hungary', tb1s: 'Local development & warehouse', tb2: 'GLS 1–2 working days', tb2s: 'Home or parcel point', tb3: '30-day guarantee', tb3s: 'Try it risk-free', tb4: 'Secure payment', tb4s: 'Card or cash on delivery',
    fEyebrow: 'One system · Four formulas', fTitle: 'Which moment needs <em>a hand?</em>', fLead: 'Pick a time of day or a mood – we’ll show you the formula that fits.',
    m_lung: 'Any time', m_energy: 'Morning', m_liver: 'Daytime', m_sleep: 'Evening',
    promo50: '−50% PROMO', profile: 'Flavour', bestFor: 'When', puffs: 'Format', puffsVal: '1 pc · non-combustible', fullIng: 'Full ingredient list',
    save50: 'You save 8.990 Ft', addToCart: 'Add to cart', shipNote: 'Order by 2 pm and it can be with you tomorrow',
    bfEyebrow: 'Black Friday · limited time', bfTitle: 'Buy one, <em>we’ll gift you the second.</em>', bfLead: 'Build your own bundle from any formula. The more you pick, the more you save.',
    days: 'days', hours: 'hrs', mins: 'min', secs: 'sec',
    perk1: 'Mix any of the 4 formulas', perk2: 'Free shipping on 2+2 and 3+3', perk3: 'Free 21-day guide with 3+3',
    t1q: '2 pcs', t2q: '4 pcs', t3q: '6 pcs', popular: 'Most popular', bestValue: 'Best value', pickFormulas: 'Choose your formulas', total: 'Total',
    autoFill: 'Can’t decide? <button id="autoFill" class="linkbtn">Pick for me</button>',
    howEyebrow: 'As simple as a breath', howTitle: 'No refills, no prep. <em>Just you and a deep breath.</em>',
    s1t: 'The urge hits', s1p: 'With coffee, while driving or after a stressful meeting – reach for your Herby.',
    s2t: 'Breathe through it', s2p: 'A few slow draws with the familiar hand-to-mouth motion. Nothing burns, no smoke.',
    s3t: 'Keep going', s3p: 'The ritual stays, the nicotine doesn’t. Each day gets a little easier.',
    nicotine: 'nicotine', whyEyebrow: 'Why is Herby different?', whyTitle: 'What matters <em>stays.</em>', others: 'Other alternatives',
    cmp1: 'Nicotine-free', cmp2: 'Familiar hand-to-mouth routine', cmp3: 'Targeted herbal formulas', cmp4: 'Non-combustible, smoke-free', cmp5: '30-day money-back',
    varies: 'Varies', oftenNo: 'Often not', oftenNone: 'Often none', whyCta: 'Try it risk-free',
    revEyebrow: 'What customers say', revTitle: 'Over 1,000 people <em>have already chosen it.</em>', revBased: 'Based on 1,000+ verified reviews',
    r1: '“The cigarette with my morning coffee was the hardest. Energy Boost took over exactly that moment. Three weeks without lighting up.”',
    r2: '“I use Sleep Support in the evenings – lovely lavender taste. Fast delivery, beautiful packaging.”',
    r3: '“I got the 2+2 bundle so I could try all four. Minty Lung Cleanse became my favourite in the car.”',
    r4: '“I keep the motion, which I would have really missed. It arrived the next day with GLS.”',
    verified: 'Verified buyer · Energy Boost', verified2: 'Verified buyer · Sleep Support', verified3: 'Verified buyer · 2+2 bundle', verified4: 'Verified buyer · Lung Cleanse',
    addEyebrow: 'Complete the ritual', addTitle: 'Little companions for <em>smoke-free days.</em>',
    faqEyebrow: 'Frequently asked questions', faqTitle: 'Got a <em>question?</em>', faqLead: 'Write to us – we usually reply within a few hours.',
    q1: 'How do I use it?', a1: 'When the urge hits, take it out and draw on it slowly a few times. No refilling, no preparation.',
    q2: 'Does it contain nicotine?', a2: 'No. Herby is completely nicotine-free, non-combustible and smoke-free.',
    q3: 'Which formula should I choose?', a3: 'Lung Cleanse is fresh and minty. Energy Boost is for busy days, Sleep Support for evenings, Liver Support for everyday balance. Not sure? The 2+2 bundle lets you try all four.',
    q4: 'What if it doesn’t work for me?', a4: 'You’re covered by our 30-day money-back guarantee. If you don’t like it, we refund you.',
    q5: 'How long is delivery?', a5: '1–2 working days with GLS. Choose home delivery or a parcel point, and pay by card or cash on delivery.',
    finalTitle: 'Your first smoke-free morning <em>arrives tomorrow.</em>', finalLead: 'Order today and try it for 30 days. If it doesn’t work for you, you get your money back.', finalCta: 'Get the Black Friday bundle',
    nlTitle: '−10% off your first order', nlSub: 'Join our newsletter and we’ll send tips for smoke-free days, too.', nlPh: 'Your email address', nlBtn: 'Subscribe',
    footAbout: 'Herbal inhalers for smoke-free everyday life. Made in Hungary.', footShop: 'Shop', footInfo: 'Information', footContact: 'Contact',
    ft1: 'Terms of service', ft2: 'Privacy policy', ft3: 'Shipping', ft4: 'Returns & withdrawal', cod: 'Cash on delivery',
    stickyT: '2+2 Black Friday', stickyBtn: 'Build mine',
    cartTitle: 'Your cart', emptyT: 'Your cart is empty for now.', emptyCta: 'Black Friday bundles', upsellT: 'Frequently bought together',
    protectT: 'Package protection', protectS: 'Lost or damaged parcel? We reship immediately', subtotal: 'Subtotal', youSave: 'You save', shipping: 'Shipping (GLS)',
    checkout: 'Secure checkout', cartTrust: '30-day guarantee · Card or cash on delivery · SSL'
  };
  const T = { // dynamic strings
    hu: { add: 'Kosárba', added: 'Hozzáadva ✓', free: 'INGYEN', fill: n => `Válassz még ${n} formulát`, addBundle: 'Csomag a kosárba', bundle: t => `Black Friday ${t}+${t} csomag`,
      saveX: v => `Spórolj ${ft(v)}-ot`, shipLeft: v => `Még <b>${ft(v)}</b> és ingyenes a szállítás!`, shipFree: '🎉 <b>Ingyenes szállítás</b> – megszerezted!',
      free2: 'Ingyenes', toastAdd: n => `${n} – a kosárban`, upTo1: 'Válts 1+1-re: <b>a második ajándék</b>, ugyanennyiért.', upNext: (t, v) => `Bővítsd ${t}+${t}-re csak <b>+${ft(v)}</b>-ért: ${t >= 3 ? '+2 db és ajándék 21 napos útmutató' : '+2 db és ingyenes szállítás'}.`,
      upBtn: 'Frissítés', remove: 'Törlés', nlOk: 'Köszönjük! A kuponkódot elküldtük e-mailben.', checkoutMsg: 'Prototípus – itt indulna a Shopify pénztár.', bonus: '+ ajándék 21 napos útmutató' },
    en: { add: 'Add', added: 'Added ✓', free: 'FREE', fill: n => `Choose ${n} more`, addBundle: 'Add bundle to cart', bundle: t => `Black Friday ${t}+${t} bundle`,
      saveX: v => `You save ${ft(v)}`, shipLeft: v => `Only <b>${ft(v)}</b> away from free shipping!`, shipFree: '🎉 You’ve unlocked <b>free shipping</b>!',
      free2: 'Free', toastAdd: n => `${n} – added to cart`, upTo1: 'Switch to 1+1: <b>get the second one free</b>, same price.', upNext: (t, v) => `Upgrade to ${t}+${t} for just <b>+${ft(v)}</b>: ${t >= 3 ? '+2 pcs and a free 21-day guide' : '+2 pcs and free shipping'}.`,
      upBtn: 'Upgrade', remove: 'Remove', nlOk: 'Thank you! Your coupon code is on its way.', checkoutMsg: 'Prototype – Shopify checkout would start here.', bonus: '+ free 21-day guide' }
  };
  let lang = 'hu';
  try { lang = localStorage.getItem('herby-lang') || 'hu'; } catch (e) {}
  const HU = {};
  $$('[data-i18n]').forEach(el => { HU[el.dataset.i18n] = HU[el.dataset.i18n] || el.innerHTML; });
  $$('[data-i18n-ph]').forEach(el => { HU[el.dataset.i18nPh] = el.placeholder; });
  const tr = k => (lang === 'en' ? EN[k] : HU[k]) ?? HU[k];
  const t = () => T[lang];

  function applyLang(animate) {
    const run = () => {
      document.documentElement.lang = lang;
      $$('[data-i18n]').forEach(el => { const v = tr(el.dataset.i18n); if (v != null) el.innerHTML = v; });
      $$('[data-i18n-ph]').forEach(el => el.placeholder = tr(el.dataset.i18nPh));
      document.title = lang === 'en' ? 'Herby – Herbal Inhalers | The nicotine-free ritual' : 'Herby – Gyógynövényes inhalátorok | Nikotinmentes rituálé';
      $('.lang').dataset.active = lang;
      $$('.lang__btn').forEach(b => { const on = b.dataset.lang === lang; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on); });
      renderFormula(curF, false); renderBuilder(); renderAddons(); renderCart();
    };
    if (!animate) return run();
    document.body.classList.add('lang-fade');
    setTimeout(() => { run(); document.body.classList.remove('lang-fade'); }, 160);
  }
  $$('.lang__btn').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang; try { localStorage.setItem('herby-lang', lang); } catch (e) {}
    applyLang(true);
  }));

  /* ---------------- header / nav ---------------- */
  const header = $('#header'), sticky = $('#stickyAtc');
  addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', scrollY > 10);
    const offer = $('#offer').getBoundingClientRect();
    sticky.classList.toggle('show', scrollY > 700 && !(offer.top < innerHeight && offer.bottom > 0));
  }, { passive: true });
  $('#menuBtn').addEventListener('click', () => $('#nav').classList.toggle('open'));
  $$('#nav a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('open')));

  /* hero parallax */
  const hv = $('#heroVisual');
  if (matchMedia('(pointer:fine)').matches) {
    hv.addEventListener('mousemove', e => {
      const r = hv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      $$('.float-card,.price-tag,.leaf', hv).forEach((el, i) => el.style.translate = `${x * (14 + i * 6)}px ${y * (14 + i * 6)}px`);
      $('.hero__product').style.translate = `${x * -10}px ${y * -10}px`;
    });
    hv.addEventListener('mouseleave', () => $$('*', hv).forEach(el => el.style.translate = ''));
  }

  /* ---------------- formula explorer ---------------- */
  let curF = 'lung';
  const stage = $('#formulaStage');
  function renderFormula(k, anim = true) {
    const f = F[k]; curF = k;
    const paint = () => {
      stage.style.setProperty('--fc', f.c);
      $('#fHerb').src = f.herb; $('#fProduct').src = f.product; $('#fProduct').alt = f.name[lang];
      $('#fNum').textContent = f.n + ' / 04';
      $('#fTitle').textContent = f.name[lang];
      $('#fTag').textContent = f.tag[lang];
      $('#fHerbs').innerHTML = f.herbs[lang].map(h => `<span>${h}</span>`).join('');
      $('#fProfile').textContent = f.profile[lang]; $('#fWhen').textContent = f.when[lang]; $('#fIng').textContent = f.ing[lang];
      $('#fAdd').style.background = f.c;
    };
    if (!anim) return paint();
    stage.classList.add('is-swapping');
    setTimeout(() => { paint(); requestAnimationFrame(() => stage.classList.remove('is-swapping')); }, 320);
  }
  $$('.mtab').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.f === curF) return;
    $$('.mtab').forEach(x => x.classList.toggle('is-active', x === b));
    renderFormula(b.dataset.f);
  }));
  $('#fAdd').addEventListener('click', () => addItem({ key: 'single-' + curF, kind: 'single', f: curF, price: UNIT, compare: UNIT_CMP, img: F[curF].product }));

  /* ---------------- bundle builder ---------------- */
  let tier = 2, picks = [];
  function renderBuilder() {
    const n = TIERS[tier].n, pay = TIERS[tier].pay;
    const slots = $('#slots'); slots.style.setProperty('--n', n);
    slots.innerHTML = Array.from({ length: n }, (_, i) => {
      const k = picks[i];
      if (!k) return `<div class="slot">+</div>`;
      return `<div class="slot filled" style="--c:${F[k].c}"><img src="${F[k].product.replace('width=700', 'width=200')}" alt="${F[k].name[lang]}"><button class="x" data-i="${i}" aria-label="remove">×</button>${i >= pay ? `<span class="free">${t().free}</span>` : ''}</div>`;
    }).join('');
    $('#slotCount').textContent = `${picks.length} / ${n}`;
    $$('.pick').forEach(p => p.disabled = picks.length >= n);
    const total = pay * UNIT, cmp = n * UNIT_CMP;
    $('#bTotal').textContent = ft(total);
    $('#bSave').textContent = t().saveX(cmp - total) + (tier === 3 ? ' ' + t().bonus : '');
    const left = n - picks.length, btn = $('#bAdd');
    btn.disabled = left > 0;
    $('#bAddLabel').textContent = left > 0 ? t().fill(left) : t().addBundle;
  }
  $$('.tier').forEach(b => b.addEventListener('click', () => {
    tier = +b.dataset.tier; picks = picks.slice(0, TIERS[tier].n);
    $$('.tier').forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-checked', x === b); });
    renderBuilder();
  }));
  $$('.pick').forEach(p => p.addEventListener('click', () => { if (picks.length < TIERS[tier].n) { picks.push(p.dataset.f); renderBuilder(); } }));
  $('#slots').addEventListener('click', e => { const x = e.target.closest('.x'); if (x) { picks.splice(+x.dataset.i, 1); renderBuilder(); } });
  document.addEventListener('click', e => {
    if (e.target.id !== 'autoFill') return;
    const order = ['lung', 'energy', 'liver', 'sleep'];
    while (picks.length < TIERS[tier].n) picks.push(order[picks.length % 4]);
    renderBuilder();
  });
  $('#bAdd').addEventListener('click', () => {
    addItem(bundleItem(tier, [...picks]));
    picks = []; renderBuilder();
  });
  function bundleItem(tr, list) {
    const s = [...list].sort().join(',');
    return { key: `bundle-${tr}-${s}`, kind: 'bundle', tier: tr, picks: list, price: TIERS[tr].pay * UNIT, compare: TIERS[tr].n * UNIT_CMP, img: img('ezgif-8c598b2ba6afbc63.webp?v=1788516127', 200) };
  }

  /* countdown – ends Monday 30 Nov 2026 23:59 (Cyber Monday), rolls forward so it never shows zeros */
  let end = new Date('2026-11-30T23:59:59+01:00').getTime();
  const pad = v => String(v).padStart(2, '0');
  function tick() {
    let d = end - Date.now();
    if (d <= 0) { end = Date.now() + 3 * 864e5; d = end - Date.now(); }
    $('#cdD').textContent = Math.floor(d / 864e5);
    $('#cdH').textContent = pad(Math.floor(d / 36e5) % 24);
    $('#cdM').textContent = pad(Math.floor(d / 6e4) % 60);
    $('#cdS').textContent = pad(Math.floor(d / 1e3) % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------------- add-ons grid ---------------- */
  function renderAddons() {
    $('#addonGrid').innerHTML = ADDONS.slice(0, 4).map(a => `
      <article class="addon reveal in">
        <div class="addon__img"><img src="${a.img}" alt="${a.name[lang]}"></div>
        <div class="addon__body"><h3>${a.name[lang]}</h3>
          <div class="addon__row"><strong>${ft(a.price)}</strong><button class="add-mini" data-addon="${a.id}" aria-label="${t().add}">+</button></div>
        </div>
      </article>`).join('');
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-addon]'); if (!b) return;
    const a = ADDONS.find(x => x.id === b.dataset.addon);
    addItem({ key: 'addon-' + a.id, kind: 'addon', id: a.id, price: a.price, compare: a.compare || 0, img: a.img.replace('width=600', 'width=200') });
    if (b.closest('.up')) { b.textContent = t().added; b.classList.add('added'); }
  });

  /* ---------------- cart ---------------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('herby-cart') || '[]'); } catch (e) {}
  const save = () => { try { localStorage.setItem('herby-cart', JSON.stringify(cart)); } catch (e) {} };
  const itemName = it => it.kind === 'single' ? `${F[it.f].name[lang]} ${lang === 'en' ? 'Inhaler' : 'Inhalátor'}`
    : it.kind === 'bundle' ? t().bundle(it.tier) : ADDONS.find(a => a.id === it.id).name[lang];
  const itemMeta = it => it.kind === 'bundle' ? it.picks.map(k => F[k].name[lang]).join(' · ') + (it.tier === 3 ? ' ' + t().bonus : '') : '';

  function addItem(it) {
    const ex = cart.find(c => c.key === it.key);
    ex ? ex.qty++ : cart.push({ ...it, qty: 1 });
    save(); renderCart(); openCart();
    const cc = $('#cartCount'); cc.classList.remove('bump'); void cc.offsetWidth; cc.classList.add('bump');
  }
  function renderCart() {
    const count = cart.reduce((s, c) => s + c.qty, 0);
    $('#cartCount').textContent = count; $('#cartN').textContent = `(${count})`;
    $('#cartEmpty').classList.toggle('show', !cart.length);
    $('#cartItems').innerHTML = cart.map((c, i) => `
      <div class="ci">
        <img src="${c.img}" alt="">
        <div><h5>${itemName(c)}</h5>${itemMeta(c) ? `<small>${itemMeta(c)}</small>` : ''}
          <div class="ci__qty"><button data-q="-1" data-i="${i}" aria-label="-">−</button><span>${c.qty}</span><button data-q="1" data-i="${i}" aria-label="+">+</button></div>
        </div>
        <div class="ci__price">${ft(c.price * c.qty)}${c.compare ? `<s>${ft(c.compare * c.qty)}</s>` : ''}<button class="ci__rm" data-rm="${i}">${t().remove}</button></div>
      </div>`).join('');

    const sub = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const savings = cart.reduce((s, c) => s + (c.compare ? (c.compare - c.price) * c.qty : 0), 0);
    const prot = cart.length && $('#protect').checked ? PROTECT : 0;
    const ship = !cart.length || sub >= FREE_SHIP ? 0 : SHIP;
    $('#cSub').textContent = ft(sub);
    $('#cSave').textContent = '−' + ft(savings); $('#cSaveRow').style.display = savings ? '' : 'none';
    $('#cShip').textContent = ship ? ft(ship) : t().free2;
    $('#cTotal').textContent = ft(sub + ship + prot);
    const pct = Math.min(100, sub / FREE_SHIP * 100);
    $('#shipFill').style.width = pct + '%'; $('#shipTruck').style.left = Math.max(3, Math.min(97, pct)) + '%';
    $('#shipMsg').innerHTML = sub >= FREE_SHIP ? t().shipFree : t().shipLeft(FREE_SHIP - sub);
    $('.protect').style.display = cart.length ? '' : 'none';

    // upgrade nudge
    const up = $('#upgrade'); up.innerHTML = '';
    const single = cart.find(c => c.kind === 'single');
    const bundle = cart.filter(c => c.kind === 'bundle').sort((a, b) => a.tier - b.tier)[0];
    if (single) up.innerHTML = `<div class="upgrade__card"><span>🎁</span><span>${t().upTo1}</span><button class="btn btn--primary" data-up="single">${t().upBtn}</button></div>`;
    else if (bundle && bundle.tier < 3) up.innerHTML = `<div class="upgrade__card"><span>⚡</span><span>${t().upNext(bundle.tier + 1, UNIT)}</span><button class="btn btn--primary" data-up="bundle">${t().upBtn}</button></div>`;

    // upsells (exclude items already in cart)
    const inCart = new Set(cart.filter(c => c.kind === 'addon').map(c => c.id));
    const list = ADDONS.filter(a => !inCart.has(a.id));
    $('#upsellTrack').innerHTML = list.map(a => `
      <div class="up"><img src="${a.img.replace('width=600', 'width=300')}" alt="" loading="lazy"><h6>${a.name[lang]}</h6>
        <div class="up__row"><strong>${ft(a.price)}</strong><button data-addon="${a.id}">+ ${t().add}</button></div></div>`).join('');
    $('.upsell').style.display = list.length ? '' : 'none';
  }
  $('#cartItems').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    if (q) { const c = cart[+q.dataset.i]; c.qty += +q.dataset.q; if (c.qty < 1) cart.splice(+q.dataset.i, 1); }
    else if (rm) cart.splice(+rm.dataset.rm, 1); else return;
    save(); renderCart();
  });
  $('#upgrade').addEventListener('click', e => {
    const b = e.target.closest('[data-up]'); if (!b) return;
    const order = ['lung', 'energy', 'liver', 'sleep'];
    if (b.dataset.up === 'single') {
      const i = cart.findIndex(c => c.kind === 'single'), s = cart[i];
      s.qty > 1 ? s.qty-- : cart.splice(i, 1);
      const it = bundleItem(1, [s.f, s.f]); const ex = cart.find(c => c.key === it.key);
      ex ? ex.qty++ : cart.push({ ...it, qty: 1 });
    } else {
      const bs = cart.filter(c => c.kind === 'bundle').sort((a, b) => a.tier - b.tier)[0];
      const i = cart.indexOf(bs);
      const nt = bs.tier + 1, np = [...bs.picks];
      while (np.length < TIERS[nt].n) np.push(order.find(k => !np.includes(k)) || order[np.length % 4]);
      bs.qty > 1 ? bs.qty-- : cart.splice(i, 1);
      cart.push({ ...bundleItem(nt, np), qty: 1 });
    }
    save(); renderCart();
  });
  $('#protect').addEventListener('change', renderCart);
  $('#upNext').addEventListener('click', () => $('#upsellTrack').scrollBy({ left: 200 }));
  $('#upPrev').addEventListener('click', () => $('#upsellTrack').scrollBy({ left: -200 }));
  $('#checkout').addEventListener('click', () => toast(t().checkoutMsg));

  function openCart() { document.body.classList.add('cart-open'); $('#cart').setAttribute('aria-hidden', 'false'); }
  function closeCart() { document.body.classList.remove('cart-open'); $('#cart').setAttribute('aria-hidden', 'true'); }
  $('#cartBtn').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  $('#cartOverlay').addEventListener('click', closeCart);
  $('#emptyCta').addEventListener('click', closeCart);
  addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  /* newsletter + toast */
  let tt;
  function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2800); }
  $('#newsletter').addEventListener('submit', e => { e.preventDefault(); toast(t().nlOk); e.target.reset(); });

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));

  /* init */
  applyLang(false);
})();
