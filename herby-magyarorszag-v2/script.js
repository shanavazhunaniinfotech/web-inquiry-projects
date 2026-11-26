(() => {
  const CDN = 'https://cdn.shopify.com/s/files/1/1082/3408/0595/files/';
  const im = (f, w = 600) => `${CDN}${f}&width=${w}`;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ft = n => n.toLocaleString('de-DE') + ' Ft';
  const UNIT = 8990, UNIT_CMP = 17980, FREE_SHIP = 14990, GIFT = 24990, SHIP = 1490, GUARD = 890;
  const ORDER = ['lung', 'energy', 'liver', 'sleep'];

  /* ---------- data ---------- */
  const F = {
    lung: { c: '#4f9a3a', bg: '#dcecce', fg: '#10241a', strong: '#2f6e22', name: { hu: 'Tüdőtisztító', en: 'Lung Cleanse' },
      pack: im('Gyogynovenyestudotisztito30naposgaranciaval.webp?v=1794946867', 700), herb: im('ezgif-3efcab05e8584b9b.webp?v=1788541053', 1100),
      moment: { hu: 'Bármikor, bárhol', en: 'Any time, anywhere' },
      tag: { hu: 'Friss, mentás formula a légutak támogatására.', en: 'A fresh, minty formula to support your airways.' },
      herbs: { hu: ['Ökörfarkkóró', 'Kakukkfű', 'Menta'], en: ['Mullein', 'Thyme', 'Mint'] },
      ing: { hu: 'Összetevők: ökörfarkkóró, kakukkfű, menta, mentol, növényi glicerin, tisztított víz.', en: 'Ingredients: mullein, thyme, mint, menthol, vegetable glycerin, purified water.' } },
    energy: { c: '#e07b1f', bg: '#f6d9b2', fg: '#2a1808', strong: '#a4500a', name: { hu: 'Energizáló', en: 'Energy Boost' },
      pack: im('ezgif-856b1e34197a4520.webp?v=1788516083', 700), herb: im('ezgif-38f1f834de31b8d3.webp?v=1788541059', 1100),
      moment: { hu: 'Reggel, a kávé mellé', en: 'Mornings, with coffee' },
      tag: { hu: 'Frissítő formula a lendületesebb napokért.', en: 'A refreshing formula for days with more momentum.' },
      herbs: { hu: ['Guarana', 'Zöld tea', 'Kávébab', 'Mentol'], en: ['Guarana', 'Green tea', 'Coffee bean', 'Menthol'] },
      ing: { hu: 'Összetevők: guarana kivonat, zöld tea kivonat, kávébab aroma, mentol, növényi glicerin, tisztított víz.', en: 'Ingredients: guarana extract, green tea extract, coffee bean aroma, menthol, vegetable glycerin, purified water.' } },
    liver: { c: '#7b4fa6', bg: '#e4d8f1', fg: '#1d1030', strong: '#5d3590', name: { hu: 'Májtámogató', en: 'Liver Support' },
      pack: im('ezgif-500d27a7d1bbc338.webp?v=1788618795', 700), herb: im('ezgif-37ca167824935917.webp?v=1788541041', 1100),
      moment: { hu: 'Napközben, étkezés után', en: 'Daytime, after meals' },
      tag: { hu: 'Gyógynövényes formula a mindennapi egyensúlyért.', en: 'A herbal formula for everyday balance.' },
      herbs: { hu: ['Máriatövis', 'Articsóka', 'Gyermekláncfű', 'Kamilla'], en: ['Milk thistle', 'Artichoke', 'Dandelion', 'Chamomile'] },
      ing: { hu: 'Összetevők: máriatövis, articsóka, gyermekláncfű, kamilla, növényi glicerin, tisztított víz.', en: 'Ingredients: milk thistle, artichoke, dandelion, chamomile, vegetable glycerin, purified water.' } },
    sleep: { c: '#3f7fc4', bg: '#18264a', fg: '#f3f0e8', strong: '#9cc3f2', name: { hu: 'Alvástámogató', en: 'Sleep Support' },
      pack: im('ezgif-8654bea4d0addf27.webp?v=1788516101', 700), herb: im('ezgif-3b0f6f6dbb1b410d.webp?v=1788541063', 1100),
      moment: { hu: 'Este, lefekvés előtt', en: 'Evenings, before bed' },
      tag: { hu: 'Nyugtató esti formula a lelassuláshoz.', en: 'A calming evening formula to help you slow down.' },
      herbs: { hu: ['Levendula', 'Kamilla', 'Ashwagandha'], en: ['Lavender', 'Chamomile', 'Ashwagandha'] },
      ing: { hu: 'Összetevők: levendula, kamilla, ashwagandha, növényi glicerin, tisztított víz.', en: 'Ingredients: lavender, chamomile, ashwagandha, vegetable glycerin, purified water.' } }
  };
  const ADDONS = [
    { id: 'pack4', name: { hu: '4 az 1-ben inhalátor csomag', en: '4-in-1 Inhaler Pack' }, price: 15990, compare: 23990, img: 'ezgif-8c598b2ba6afbc63.webp?v=1788516127', tag: { hu: 'Mind a 4 íz', en: 'All 4 flavours' } },
    { id: 'spray', name: { hu: 'Gyógynövényes szájspray, 30 ml', en: 'Herbal Mouth Spray, 30 ml' }, price: 3890, img: 'ezgif-6a405effea74eecc.webp?v=1788802392' },
    { id: 'drops', name: { hu: 'Leheletfrissítő cseppek', en: 'Breath Freshening Drops' }, price: 6290, img: 'ezgif-2b7071b809139e73.webp?v=1791832982' },
    { id: 'guide', name: { hu: '21 napos leszokási útmutató', en: '21-Day Quit Guide' }, price: 3190, img: 'ezgif-60f33e3fb63e2472.webp?v=1788802387' },
    { id: 'car', name: { hu: 'Autós szageltávolító készlet', en: 'Car Odour Removal Kit' }, price: 3990, img: 'ezgif-3831567f0ba453ce.webp?v=1791837577' },
    { id: 'strips', name: { hu: 'Orrtágító csíkok', en: 'Nasal Breathing Strips' }, price: 2990, img: 'ezgif-60969cc14a3cd7d3_fc9eaad9-f44a-4f44-a15f-639665f1d8c6.webp?v=1788802441' },
    { id: 'filters', name: { hu: 'Higiéniai szájfilterek', en: 'Hygienic Mouth Filters' }, price: 1890, img: 'ezgif-68e331c49f7d00d7.webp?v=1788802394' }
  ];
  const PLANS = { 1: { pay: 1, n: 2 }, 2: { pay: 2, n: 4 }, 3: { pay: 3, n: 6 } };
  const REVIEWS = [
    { n: 'Kata, Debrecen', f: 'energy', s: 5, hu: 'A reggeli kávé melletti cigi volt a legnehezebb. Az Energizáló pont ezt a pillanatot vette át.', en: 'The cigarette with my morning coffee was the hardest. Energy Boost took over exactly that moment.' },
    { n: 'Gábor, Budapest', f: 'sleep', s: 5, hu: 'Esténként az Alvástámogatót használom – nagyon kellemes, levendulás.', en: 'I use Sleep Support in the evenings – really pleasant, lavender-y.' },
    { n: 'Eszter, Győr', f: 'lung', s: 5, hu: 'A 2+2 csomaggal mind a négyet kipróbáltam. A mentás lett a kedvencem a kocsiban.', en: 'With the 2+2 bundle I tried all four. The minty one became my favourite in the car.' },
    { n: 'Péter, Szeged', f: 'lung', s: 4, hu: 'Megmarad a mozdulat, ami nagyon hiányzott volna. Másnap meg is érkezett.', en: 'I keep the motion, which I would have really missed. It arrived the next day.' },
    { n: 'Anna, Pécs', f: 'liver', s: 5, hu: 'Ebéd után a Májtámogató lett az új szokásom. Szép, igényes csomagolás.', en: 'Liver Support after lunch is my new habit. Beautiful, premium packaging.' },
    { n: 'Zoltán, Miskolc', f: 'energy', s: 5, hu: 'Utánvéttel rendeltem, gyors és korrekt. Az ügyfélszolgálat is nagyon kedves.', en: 'Ordered with cash on delivery, fast and fair. Customer service was lovely too.' },
    { n: 'Réka, Székesfehérvár', f: 'sleep', s: 5, hu: 'Végre valami, ami nem csak egy újabb tabletta. Imádom az esti rutinomat.', en: 'Finally something that isn’t just another pill. I love my evening routine.' },
    { n: 'Bence, Budapest', f: 'liver', s: 5, hu: 'A 30 napos garancia miatt mertem kipróbálni. Nem bántam meg.', en: 'The 30-day guarantee is why I dared to try it. No regrets.' }
  ];
  const DAY = [
    { to: 11, f: 'energy', sky: 'linear-gradient(160deg,#fde7c0,#f7cf9c 45%,#f1ebdf)', m: { hu: 'Reggeli kávé', en: 'Morning coffee' },
      why: { hu: 'A nap első késztetése gyakran a kávé mellé jön. A guaranás, zöld teás Energizáló friss lendületet ad helyette.', en: 'The day’s first urge often comes with coffee. Guarana and green tea Energy Boost brings a fresh lift instead.' } },
    { to: 17, f: 'liver', sky: 'linear-gradient(160deg,#e7f1dc,#d4e7f0 55%,#f1ebdf)', m: { hu: 'Ebéd után', en: 'After lunch' },
      why: { hu: 'Étkezés utáni szünet? A máriatövises, kamillás Májtámogató lágy, gyógynövényes pillanatot ad.', en: 'A break after a meal? Milk thistle and chamomile Liver Support gives you a soft, herbal moment.' } },
    { to: 21, f: 'lung', sky: 'linear-gradient(160deg,#f7c79e,#e79a98 55%,#c98aa8)', m: { hu: 'Hazafelé, vezetés közben', en: 'Commute & driving' },
      why: { hu: 'Dugóban, hazafelé – a friss, mentás Tüdőtisztító bármikor, bárhol kéznél van.', en: 'Stuck in traffic on the way home – fresh, minty Lung Cleanse is always at hand.' } },
    { to: 24, f: 'sleep', sky: 'linear-gradient(160deg,#27305e,#141a3a 55%,#0b1a13)', night: true, m: { hu: 'Lefekvés előtt', en: 'Before bed' },
      why: { hu: 'Lassíts le. A levendulás, ashwagandhás Alvástámogató nyugodt esti rituálét ad.', en: 'Slow down. Lavender and ashwagandha Sleep Support makes for a calm evening ritual.' } }
  ];

  /* ---------- i18n ---------- */
  const EN = {
    topTxt: '1+1 · 2+2 · 3+3 – the second one is free. Ends in:', topLink: 'See deal →',
    nav1: 'Formulas', nav2: 'Your day', nav3: 'Offer', nav4: 'Reviews', nav5: 'FAQ', cart: 'Cart',
    heroEyebrow: 'Herbal inhaler · 0 mg nicotine', heroW1: 'Breathe', heroW2: 'differently.', inhale: 'Inhale',
    heroSub: 'Four herbal formulas that keep the familiar motion – without nicotine, smoke or combustion.',
    heroCta1: 'Black Friday bundles', heroCta2: 'Explore formulas', heroProof: '1,000+ customer reviews',
    w1: 'Nicotine-free', w2: 'Smoke-free', w3: 'Non-combustible', w4: 'Made in Hungary', w5: '30-day guarantee',
    stKicker: '(01) Our philosophy', stText: 'Smoking was never just about nicotine. It’s a motion, a pause, a moment for yourself. Herby keeps the ritual and lets go of what you don’t need.',
    stat1: 'nicotine', stat2: 'targeted formulas', days: 'days', stat3: 'money-back guarantee', stat4: 'happy customers',
    fKicker: '(02) Four formulas',
    dayKicker: '(03) Your day with Herby', dayTitle: 'Every moment has <em>its formula.</em>', daySub: 'Drag the slider – we’ll show you what we recommend for that part of the day.', recTag: 'Our pick right now', add: 'Add to cart',
    bKicker: '(04) Why Herby', bTitle: 'What matters <em>stays.</em> What doesn’t, goes.',
    b1: 'nicotine – not in a single puff', b2t: 'The familiar motion', b2p: 'A hand-to-mouth routine that helps you ride out the urge.', b3p: 'separate formulas for 4 situations',
    b4t: 'GLS 1–2 working days', b4p: 'From our Hungarian warehouse, home or parcel point. Cash on delivery too.', sealTxt: '30 DAYS · MONEY-BACK GUARANTEE · ', b5p: 'Try it risk-free. If you don’t like it, we refund you.',
    b6t: 'Made in Hungary', b6p: 'Local development, local warehouse, local customer support.',
    oKicker: '(05) Black Friday', oTitle: 'Pay for one, <em>get two.</em>', oSub: 'Mix the formulas however you like. Bigger bundles ship free.',
    cdD: 'days', cdH: 'hrs', cdM: 'min', cdS: 'sec', ot1: '✓ 30-day guarantee', ot2: '✓ Cash on delivery', ot3: '✓ GLS 1–2 days',
    p1: '2 inhalers · 4.495 Ft each', p2: '4 inhalers · all 4 flavours · free shipping', p3: '6 inhalers · free shipping + guide', popular: 'Most popular', best: 'Best value',
    mixT: 'Mix & match', mixAuto: 'One of each →',
    lKicker: '(06) Our customers', lTitle: 'Over 1,000 people <em>already breathe differently.</em>', lBased: '1,000+ reviews',
    xKicker: '(07) Add-ons', xTitle: 'The complete <em>smoke-free</em> kit.',
    qKicker: '(08) Questions', qTitle: 'Everything <em>worth knowing.</em>', qMail: 'Write to us',
    q1: 'How do I use it?', a1: 'When the urge hits, take it out and draw on it slowly a few times. No refilling, no prep.',
    q2: 'Does it contain nicotine?', a2: 'No. Herby is completely nicotine-free, non-combustible and smoke-free.',
    q3: 'Which formula should I choose?', a3: 'Lung Cleanse is fresh and minty. Energy Boost is for busy days, Sleep Support for evenings, Liver Support for everyday balance. The 2+2 bundle lets you try all four.',
    q4: 'What if it doesn’t work for me?', a4: 'You’re covered by our 30-day money-back guarantee. If you don’t like it, we refund you.',
    q5: 'How long is delivery?', a5: '1–2 working days with GLS, to your home or a parcel point. Pay by card or cash on delivery.',
    fin1: 'Start', fin2: 'tomorrow morning.', finSub: 'Order today and it can be with you tomorrow. 30 days, risk-free.', finCta: 'Build my bundle',
    nlT: '−10% off your first order when you subscribe:', nlPh: 'Your email address', nlBtn: 'Subscribe',
    ftShop: 'Shop', fl: 'Lung Cleanse', fe: 'Energy Boost', fv: 'Liver Support', fs: 'Sleep Support', ftInfo: 'Information', ft1: 'Terms of service', ft2: 'Privacy', ft3: 'Shipping', ft4: 'Returns & withdrawal',
    ftContact: 'Contact', ftPay: 'Payment', cod: 'Cash on delivery', ftMade: 'Made in Hungary · SSL encrypted', mstick: 'Black Friday – the second one free',
    cartT: 'Cart', lad1: 'Free shipping', lad2: 'Free mouth spray', emptyT: 'Your cart is still empty.', emptyCta: 'See the bundles', upsT: 'Complete your routine',
    guardT: 'Package protection', guardS: 'against damage & loss', sub: 'Subtotal', saved: 'You saved', ship: 'Shipping', checkout: 'Checkout', dTrust: '🔒 Secure payment · 30-day guarantee · Cash on delivery'
  };
  const T = {
    hu: { inhale: 'Belégzés', exhale: 'Kilégzés', add: 'Kosárba', save: v => `Spórolj ${ft(v)}-ot`, bundle: p => `Black Friday ${p}+${p} csomag`, inhaler: 'Inhalátor',
      fill: n => `Válassz még ${n} inhalátort`, addB: (p, v) => `${p}+${p} csomag a kosárba · ${ft(v)}`, free: 'Ingyenes', remove: 'Törlés',
      toShip: v => `Még <b>${ft(v)}</b> az ingyenes szállításig`, toGift: v => `Ingyenes szállítás ✓ · még <b>${ft(v)}</b> és ajándék szájspray jár`, allDone: '<b>Ingyenes szállítás + ajándék szájspray</b> – mindkettő a tiéd! 🎉',
      nudge1: 'Válts <b>1+1</b>-re: a második inhalátor ajándék.', nudgeN: (p, v) => `Bővítsd <b>${p}+${p}</b>-re csak +${ft(v)}-ért.`, up: 'Váltás', gift: 'Ajándék szájspray', guide: '+ ajándék útmutató',
      nl: 'Köszönjük! A −10% kuponkódot elküldtük.', checkout: 'Prototípus – itt indulna a Shopify pénztár.', added: n => `${n} a kosárba került` },
    en: { inhale: 'Inhale', exhale: 'Exhale', add: 'Add to cart', save: v => `You save ${ft(v)}`, bundle: p => `Black Friday ${p}+${p} bundle`, inhaler: 'Inhaler',
      fill: n => `Choose ${n} more inhaler${n > 1 ? 's' : ''}`, addB: (p, v) => `Add ${p}+${p} bundle · ${ft(v)}`, free: 'Free', remove: 'Remove',
      toShip: v => `<b>${ft(v)}</b> away from free shipping`, toGift: v => `Free shipping ✓ · <b>${ft(v)}</b> more for a free mouth spray`, allDone: '<b>Free shipping + free mouth spray</b> – both unlocked! 🎉',
      nudge1: 'Switch to <b>1+1</b>: the second inhaler is free.', nudgeN: (p, v) => `Upgrade to <b>${p}+${p}</b> for just +${ft(v)}.`, up: 'Upgrade', gift: 'Free mouth spray', guide: '+ free guide',
      nl: 'Thank you! Your −10% code is on its way.', checkout: 'Prototype – Shopify checkout would start here.', added: n => `${n} added to cart` }
  };
  let lang = 'hu';
  try { lang = localStorage.getItem('herby2-lang') || 'hu'; } catch (e) {}
  const HU = {};
  $$('[data-i18n]').forEach(el => { if (!(el.dataset.i18n in HU)) HU[el.dataset.i18n] = el.innerHTML; });
  $$('[data-i18n-ph]').forEach(el => HU[el.dataset.i18nPh] = el.placeholder);
  const tr = k => lang === 'en' ? (EN[k] ?? HU[k]) : HU[k];
  const t = () => T[lang];

  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => el.innerHTML = tr(el.dataset.i18n));
    $$('[data-i18n-ph]').forEach(el => el.placeholder = tr(el.dataset.i18nPh));
    document.title = lang === 'en' ? 'Herby – Breathe differently | Herbal inhalers' : 'Herby – Lélegezz másképp | Gyógynövényes inhalátorok';
    $$('.lang__opt').forEach(o => o.classList.toggle('on', o.dataset.l === lang));
    splitStatement(); renderPanels(); renderDay(); renderMixer(); renderReviews(); renderExtras(); renderCart(); onScroll();
  }
  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'hu' ? 'en' : 'hu';
    try { localStorage.setItem('herby2-lang', lang); } catch (e) {}
    document.body.animate([{ opacity: 1 }, { opacity: .4 }, { opacity: 1 }], { duration: 420, easing: 'ease-out' });
    setTimeout(applyLang, 140);
  });

  /* ---------- header ---------- */
  const pill = $('#pill');
  let lastY = 0;
  $('#burger').addEventListener('click', () => pill.classList.toggle('menu-open'));
  $$('#pillNav a').forEach(a => a.addEventListener('click', () => pill.classList.remove('menu-open')));

  /* breath cue */
  let inh = true;
  setInterval(() => { inh = !inh; $('#breathCue').textContent = inh ? t().inhale : t().exhale; }, 4000);

  /* ---------- statement word highlight ---------- */
  function splitStatement() {
    const el = $('#statementText');
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="wd">${w}</span>`).join(' ');
  }

  /* ---------- formula panels ---------- */
  function renderPanels() {
    $('#fTrack').innerHTML = ORDER.map((k, i) => {
      const f = F[k];
      return `<article class="fpanel" style="--bg:${f.bg};--fg:${f.fg};--c:${f.c};--c-strong:${f.strong}">
        <div class="fpanel__media"><img class="herb" src="${f.herb}" alt="" loading="lazy"><img class="pack" src="${f.pack}" alt="${f.name[lang]}" loading="lazy"></div>
        <div class="fpanel__body">
          <span class="fpanel__n">0${i + 1}</span>
          <span class="fpanel__moment"><i></i>${f.moment[lang]}</span>
          <h3>${f.name[lang]}</h3>
          <p>${f.tag[lang]}</p>
          <div class="herbs">${f.herbs[lang].map(h => `<span>${h}</span>`).join('')}</div>
          <p class="fpanel__ing">${f.ing[lang]}</p>
          <div class="fpanel__buy">
            <div class="fpanel__price"><b>8.990 Ft</b><s>17.980 Ft</s><small>−50% · ${t().save(UNIT_CMP - UNIT)}</small></div>
            <button class="btn" data-single="${k}">${t().add} →</button>
          </div>
        </div></article>`;
    }).join('');
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-single]'); if (!b) return;
    const k = b.dataset.single;
    addLine({ key: 's-' + k, kind: 'single', f: k, price: UNIT, compare: UNIT_CMP, img: F[k].pack.replace('width=700', 'width=200') });
  });

  /* ---------- scroll engine ---------- */
  const fSec = $('#formulas'), fTrack = $('#fTrack');
  function onScroll() {
    const y = scrollY;
    pill.classList.toggle('is-scrolled', y > 30);
    pill.classList.toggle('is-hidden', y > 600 && y > lastY + 4 && !pill.classList.contains('menu-open'));
    if (y < lastY - 4) pill.classList.remove('is-hidden');
    lastY = y;

    // statement
    const st = $('#statementText'), r = st.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .35)));
    const ws = $$('.wd', st), on = Math.round(p * ws.length);
    ws.forEach((w, i) => w.classList.toggle('on', i < on));

    // pinned formulas
    if (innerWidth > 900) {
      const top = fSec.offsetTop, h = fSec.offsetHeight - innerHeight;
      const pr = Math.min(1, Math.max(0, (y - top) / h));
      const dist = fTrack.scrollWidth - innerWidth + Math.max(24, (innerWidth - 1280) / 2);
      fTrack.style.transform = `translate3d(${-pr * dist}px,0,0)`;
      $('#fProg').style.transform = `scaleX(${.25 + pr * .75})`;
      $('#fIdx').textContent = '0' + Math.min(4, Math.floor(pr * 3.999) + 1);
    }
    // mobile sticky
    const off = $('#offer').getBoundingClientRect();
    $('#mstick').classList.toggle('show', y > 600 && !(off.top < innerHeight && off.bottom > 0));
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  /* count up */
  const cio = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; cio.unobserve(en.target);
    const el = en.target, end = +el.dataset.count, t0 = performance.now();
    const step = now => { const k = Math.min(1, (now - t0) / 1600), v = Math.round(end * (1 - Math.pow(1 - k, 3))); el.textContent = end >= 1000 ? v.toLocaleString(lang === 'en' ? 'en-US' : 'hu-HU') : v; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));
  const rio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => rio.observe(el));

  /* ---------- day dial ---------- */
  const range = $('#dayRange');
  let dayF = null;
  function renderDay() {
    const h = +range.value, slot = DAY.find(d => h < d.to), f = F[slot.f];
    $('#dayClock').textContent = `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`;
    $('#dayMoment').textContent = slot.m[lang];
    $('#daySky').style.background = slot.sky;
    $('#day').classList.toggle('is-night', !!slot.night);
    const swap = dayF !== slot.f;
    const paint = () => { $('#recImg').src = f.herb.replace('width=1100', 'width=800'); $('#recName').textContent = f.name[lang]; $('#recName').style.color = f.c; $('#recWhy').textContent = slot.why[lang]; $('#recAdd').dataset.single = slot.f; };
    if (swap && dayF) { $('#dayRec').classList.add('swap'); setTimeout(() => { paint(); $('#dayRec').classList.remove('swap'); }, 180); } else paint();
    dayF = slot.f;
  }
  range.addEventListener('input', renderDay);

  /* ---------- countdown ---------- */
  let end = new Date('2026-11-30T23:59:59+01:00').getTime();
  const pad = v => String(v).padStart(2, '0');
  function tick() {
    let d = end - Date.now();
    if (d <= 0) { end = Date.now() + 3 * 864e5; d = end - Date.now(); }
    const D = Math.floor(d / 864e5), H = pad(Math.floor(d / 36e5) % 24), M = pad(Math.floor(d / 6e4) % 60), S = pad(Math.floor(d / 1e3) % 60);
    $('#cdD').textContent = D; $('#cdH').textContent = H; $('#cdM').textContent = M; $('#cdS').textContent = S;
    $('#topCd').textContent = `${D}${lang === 'en' ? 'd' : 'n'} ${H}:${M}:${S}`;
  }
  tick(); setInterval(tick, 1000);

  /* ---------- mixer ---------- */
  let plan = 2, mix = { lung: 0, energy: 0, liver: 0, sleep: 0 };
  const mixTotal = () => Object.values(mix).reduce((a, b) => a + b, 0);
  function renderMixer() {
    const n = PLANS[plan].n, tot = mixTotal();
    $('#mixCount').textContent = `${tot} / ${n}`;
    const seq = ORDER.flatMap(k => Array(mix[k]).fill(F[k].c));
    $('#mixBar').innerHTML = Array.from({ length: n }, (_, i) => `<i style="${seq[i] ? 'background:' + seq[i] : ''}"></i>`).join('');
    $('#mixRows').innerHTML = ORDER.map(k => `<div class="mrow" style="--c:${F[k].c}"><img src="${F[k].pack.replace('width=700', 'width=120')}" alt=""><span class="mrow__n"><i></i>${F[k].name[lang]}</span>
      <div class="step"><button data-m="${k}" data-d="-1" ${mix[k] ? '' : 'disabled'} aria-label="−">−</button><span>${mix[k]}</span><button data-m="${k}" data-d="1" ${tot >= n ? 'disabled' : ''} aria-label="+">+</button></div></div>`).join('');
    const btn = $('#mixAdd'), left = n - tot;
    btn.disabled = left > 0;
    $('#mixAddLabel').textContent = left > 0 ? t().fill(left) : t().addB(plan, PLANS[plan].pay * UNIT);
  }
  $$('.plan input').forEach(r => r.addEventListener('change', () => {
    plan = +r.value;
    $$('.plan').forEach(p => p.classList.toggle('is-on', p.contains(r)));
    let over = mixTotal() - PLANS[plan].n;
    for (const k of [...ORDER].reverse()) { while (over > 0 && mix[k] > 0) { mix[k]--; over--; } }
    renderMixer();
  }));
  $('#mixRows').addEventListener('click', e => {
    const b = e.target.closest('[data-m]'); if (!b) return;
    mix[b.dataset.m] = Math.max(0, mix[b.dataset.m] + +b.dataset.d); renderMixer();
  });
  $('#mixAuto').addEventListener('click', () => {
    mix = { lung: 0, energy: 0, liver: 0, sleep: 0 };
    for (let i = 0; i < PLANS[plan].n; i++) mix[ORDER[i % 4]]++;
    renderMixer();
  });
  $('#mixAdd').addEventListener('click', () => {
    const picks = ORDER.flatMap(k => Array(mix[k]).fill(k));
    addLine(bundleLine(plan, picks));
    mix = { lung: 0, energy: 0, liver: 0, sleep: 0 }; renderMixer();
  });
  function bundleLine(p, picks) {
    return { key: `b${p}-${[...picks].sort().join('.')}`, kind: 'bundle', plan: p, picks, price: PLANS[p].pay * UNIT, compare: PLANS[p].n * UNIT_CMP, img: im('ezgif-8c598b2ba6afbc63.webp?v=1788516127', 200) };
  }

  /* ---------- reviews ---------- */
  function renderReviews() {
    const card = r => `<article class="rv"><i>${'★'.repeat(r.s)}${'☆'.repeat(5 - r.s)}</i><p>${lang === "en" ? "“" : "„"}${r[lang]}”</p>
      <footer style="--c:${F[r.f].c}"><span>${r.n[0]}</span><div><b>${r.n}</b><small>${lang === 'en' ? 'Verified buyer' : 'Ellenőrzött vásárló'} · ${F[r.f].name[lang]}</small></div></footer></article>`;
    const a = REVIEWS.slice(0, 4).map(card).join(''), b = REVIEWS.slice(4).map(card).join('');
    $('#loveRow1').innerHTML = a + a + a; $('#loveRow2').innerHTML = b + b + b;
  }

  /* ---------- extras ---------- */
  function renderExtras() {
    $('#xTrack').innerHTML = ADDONS.map(a => `<article class="xcard">${a.tag ? `<span class="xcard__tag">${a.tag[lang]}</span>` : ''}
      <div class="xcard__img"><img src="${im(a.img, 640)}" alt="${a.name[lang]}" loading="lazy"></div>
      <div class="xcard__body"><div><h3>${a.name[lang]}</h3><strong>${ft(a.price)}${a.compare ? `<s>${ft(a.compare)}</s>` : ''}</strong></div>
      <button class="xadd" data-addon="${a.id}" aria-label="${t().add}">+</button></div></article>`).join('');
  }
  $('#xNext').addEventListener('click', () => $('#xTrack').scrollBy({ left: 340 }));
  $('#xPrev').addEventListener('click', () => $('#xTrack').scrollBy({ left: -340 }));
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-addon]'); if (!b) return;
    const a = ADDONS.find(x => x.id === b.dataset.addon);
    addLine({ key: 'a-' + a.id, kind: 'addon', id: a.id, price: a.price, compare: a.compare || 0, img: im(a.img, 200) });
  });

  /* ---------- FAQ ---------- */
  $('#faqList').addEventListener('click', e => {
    const b = e.target.closest('.q__btn'); if (!b) return;
    const q = b.parentElement, open = q.classList.contains('is-open');
    $$('.q').forEach(x => x.classList.remove('is-open'));
    if (!open) q.classList.add('is-open');
  });

  /* ---------- cart ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('herby2-cart') || '[]'); } catch (e) {}
  const persist = () => { try { localStorage.setItem('herby2-cart', JSON.stringify(cart)); } catch (e) {} };
  const nameOf = l => l.kind === 'single' ? `${F[l.f].name[lang]} ${t().inhaler}` : l.kind === 'bundle' ? t().bundle(l.plan) : l.kind === 'gift' ? t().gift : ADDONS.find(a => a.id === l.id).name[lang];
  const metaOf = l => l.kind === 'bundle' ? ORDER.filter(k => l.picks.includes(k)).map(k => `${l.picks.filter(x => x === k).length}× ${F[k].name[lang]}`).join(' · ') + (l.plan === 3 ? ' ' + t().guide : '') : '';

  function addLine(l) {
    const ex = cart.find(c => c.key === l.key);
    ex ? ex.qty++ : cart.push({ ...l, qty: 1 });
    persist(); renderCart(); openCart();
    const b = $('#cartCount'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  }
  function renderCart() {
    const lines = cart;
    const sub = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const saved = lines.reduce((s, l) => s + (l.compare ? (l.compare - l.price) * l.qty : 0), 0);
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const giftOn = sub >= GIFT;
    $('#cartCount').textContent = count; $('#drawerN').textContent = count;
    $('#dEmpty').classList.toggle('show', !lines.length);

    const all = giftOn ? [...lines, { key: 'gift', kind: 'gift', price: 0, compare: 3890, qty: 1, img: im('ezgif-6a405effea74eecc.webp?v=1788802392', 200) }] : lines;
    $('#lines').innerHTML = all.map((l, i) => `<div class="line"><img src="${l.img}" alt="">
      <div><h5>${nameOf(l)}</h5>${metaOf(l) ? `<small>${metaOf(l)}</small>` : ''}
        ${l.kind === 'gift' ? '' : `<div class="step"><button data-q="-1" data-i="${i}" aria-label="−">−</button><span>${l.qty}</span><button data-q="1" data-i="${i}" aria-label="+">+</button></div>`}</div>
      <div class="line__r"><div><b>${l.price ? ft(l.price * l.qty) : t().free}</b>${l.compare ? `<s>${ft(l.compare * l.qty)}</s>` : ''}</div>${l.kind === 'gift' ? '' : `<button class="line__rm" data-rm="${i}">${t().remove}</button>`}</div></div>`).join('');

    // ladder
    const pct = Math.min(100, sub / GIFT * 100);
    $('#ladderFill').style.width = pct + '%';
    $('#lp1').classList.toggle('hit', sub >= FREE_SHIP); $('#lp2').classList.toggle('hit', giftOn);
    $('#ladderMsg').innerHTML = sub < FREE_SHIP ? t().toShip(FREE_SHIP - sub) : !giftOn ? t().toGift(GIFT - sub) : t().allDone;

    // nudge
    const single = lines.find(l => l.kind === 'single');
    const bun = lines.filter(l => l.kind === 'bundle').sort((a, b) => a.plan - b.plan)[0];
    $('#nudge').innerHTML = single ? `<div class="nudge"><span>🎁</span><span>${t().nudge1}</span><button class="btn btn--dark btn--sm" data-up="s">${t().up}</button></div>`
      : bun && bun.plan < 3 ? `<div class="nudge"><span>⚡</span><span>${t().nudgeN(bun.plan + 1, UNIT)}</span><button class="btn btn--dark btn--sm" data-up="b">${t().up}</button></div>` : '';

    // upsells: missing formulas first, then add-ons
    const have = new Set(lines.filter(l => l.kind === 'addon').map(l => l.id));
    const ups = ADDONS.filter(a => !have.has(a.id)).slice(0, 4);
    $('#ups').innerHTML = ups.map(a => `<div class="up"><img src="${im(a.img, 160)}" alt=""><div><h6>${a.name[lang]}</h6><small>${ft(a.price)}${a.compare ? `<s>${ft(a.compare)}</s>` : ''}</small></div><button data-addon="${a.id}" aria-label="${t().add}">+</button></div>`).join('');
    $('.ups').style.display = ups.length ? '' : 'none';

    const guard = lines.length && $('#guard').checked ? GUARD : 0;
    const ship = !lines.length || sub >= FREE_SHIP ? 0 : SHIP;
    $('#sSub').textContent = ft(sub);
    $('#sSave').textContent = ft(saved + (giftOn ? 3890 : 0)); $('#sSaveRow').style.display = saved ? '' : 'none';
    $('#sShip').textContent = !lines.length ? '–' : ship ? ft(ship) : t().free;
    $('#sTotal').textContent = ft(sub + ship + guard);
    $('.guard').style.display = lines.length ? '' : 'none';
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
      const nl = bundleLine(1, [s.f, s.f]), ex = cart.find(c => c.key === nl.key);
      ex ? ex.qty++ : cart.push({ ...nl, qty: 1 });
    } else {
      const bun = cart.filter(l => l.kind === 'bundle').sort((a, b) => a.plan - b.plan)[0], i = cart.indexOf(bun);
      const np = bun.plan + 1, picks = [...bun.picks];
      while (picks.length < PLANS[np].n) picks.push(ORDER.find(k => !picks.includes(k)) || ORDER[picks.length % 4]);
      bun.qty > 1 ? bun.qty-- : cart.splice(i, 1);
      cart.push({ ...bundleLine(np, picks), qty: 1 });
    }
    persist(); renderCart();
  });
  $('#guard').addEventListener('change', renderCart);
  const openCart = () => { document.body.classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); };
  const closeCart = () => { document.body.classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); };
  $('#cartBtn').addEventListener('click', openCart);
  $('#drawerX').addEventListener('click', closeCart);
  $('#veil').addEventListener('click', closeCart);
  $('#dEmptyCta').addEventListener('click', closeCart);
  addEventListener('keydown', e => e.key === 'Escape' && closeCart());

  let tt;
  const toast = m => { const el = $('#toast'); el.textContent = m; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2800); };
  $('#checkout').addEventListener('click', () => toast(t().checkout));
  $('#nl').addEventListener('submit', e => { e.preventDefault(); toast(t().nl); e.target.reset(); });

  /* magnetic buttons */
  if (matchMedia('(pointer:fine)').matches) $$('.magnetic').forEach(b => {
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });

  applyLang();
})();
