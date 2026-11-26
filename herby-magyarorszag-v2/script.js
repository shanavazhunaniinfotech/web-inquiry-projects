(() => {
  const CDN = 'https://cdn.shopify.com/s/files/1/1082/3408/0595/files/';
  const im = (f, w = 700) => `${CDN}${f}&width=${w}`;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ft = n => n.toLocaleString('de-DE') + ' Ft';
  const UNIT = 8990, UNIT_CMP = 17980, FREE_SHIP = 14990, SHIP = 1490, PROT = 890;
  const ORDER = ['lung', 'energy', 'liver', 'sleep'];

  /* ---------- data ---------- */
  const F = {
    lung: { bg: '#9be15d', fg: '#0d2b14', cut: 'uj.webp?v=1788009251', herb: 'ezgif-3efcab05e8584b9b.webp?v=1788541053',
      name: { hu: 'Tüdő&shy;tisztító', en: 'Lung Cleanse' }, plain: { hu: 'Tüdőtisztító', en: 'Lung Cleanse' }, time: { hu: 'Bármikor, bárhol', en: 'Any time, anywhere' },
      tag: { hu: 'Friss, mentás formula a légutak támogatására.', en: 'A fresh, minty formula to support your airways.' },
      herbs: { hu: ['Ökörfarkkóró', 'Kakukkfű', 'Menta'], en: ['Mullein', 'Thyme', 'Mint'] }, st: { hu: ['Best', 'seller'], en: ['Best', 'seller'] } },
    energy: { bg: '#ff9a3c', fg: '#2e1100', cut: 'ezgif-12dcdb7b1051afe8.webp?v=1788634410', herb: 'ezgif-38f1f834de31b8d3.webp?v=1788541059',
      name: { hu: 'Energi&shy;záló', en: 'Energy Boost' }, plain: { hu: 'Energizáló', en: 'Energy Boost' }, time: { hu: 'Reggel, a kávé mellé', en: 'Mornings, with coffee' },
      tag: { hu: 'Frissítő, kávés formula a lendületesebb napokért.', en: 'A refreshing coffee formula for days with more momentum.' },
      herbs: { hu: ['Guarana', 'Zöld tea', 'Kávébab', 'Mentol'], en: ['Guarana', 'Green tea', 'Coffee bean', 'Menthol'] }, st: { hu: ['Kávés', 'íz'], en: ['Coffee', 'kick'] } },
    liver: { bg: '#c4a1ff', fg: '#22094a', cut: 'ezgif-3b6a1156b1892a5d.webp?v=1788542558', herb: 'ezgif-37ca167824935917.webp?v=1788541041',
      name: { hu: 'Máj&shy;támogató', en: 'Liver Support' }, plain: { hu: 'Májtámogató', en: 'Liver Support' }, time: { hu: 'Napközben, evés után', en: 'Daytime, after meals' },
      tag: { hu: 'Gyógynövényes formula a mindennapi egyensúlyért.', en: 'A herbal formula for everyday balance.' },
      herbs: { hu: ['Máriatövis', 'Articsóka', 'Gyermekláncfű', 'Kamilla'], en: ['Milk thistle', 'Artichoke', 'Dandelion', 'Chamomile'] }, st: { hu: ['Lágy', 'íz'], en: ['Soft', 'taste'] } },
    sleep: { bg: '#6fa0ff', fg: '#0a1a45', cut: 'Kaching-Bundles-ezgif-1cedbac2471da28e.webp?v=1788775577', herb: 'ezgif-3b0f6f6dbb1b410d.webp?v=1788541063',
      name: { hu: 'Alvás&shy;támogató', en: 'Sleep Support' }, plain: { hu: 'Alvástámogató', en: 'Sleep Support' }, time: { hu: 'Este, lefekvés előtt', en: 'Evenings, before bed' },
      tag: { hu: 'Nyugtató esti formula a lelassuláshoz.', en: 'A calming evening formula to help you slow down.' },
      herbs: { hu: ['Levendula', 'Kamilla', 'Ashwagandha'], en: ['Lavender', 'Chamomile', 'Ashwagandha'] }, st: { hu: ['Esti', 'rutin'], en: ['Night', 'ritual'] } }
  };
  const ACC = {
    spray: { price: 3890, img: 'ezgif-6a405effea74eecc.webp?v=1788802392', name: { hu: 'Gyógynövényes szájspray', en: 'Herbal Mouth Spray' } },
    guide: { price: 3190, img: 'ezgif-60f33e3fb63e2472.webp?v=1788802387', name: { hu: '21 napos útmutató', en: '21-Day Quit Guide' } },
    drops: { price: 6290, img: 'ezgif-2b7071b809139e73.webp?v=1791832982', name: { hu: 'Leheletfrissítő cseppek', en: 'Breath Drops' } },
    car: { price: 3990, img: 'ezgif-3831567f0ba453ce.webp?v=1791837577', name: { hu: 'Autós szagtalanító', en: 'Car Odour Kit' } },
    strips: { price: 2990, img: 'ezgif-60969cc14a3cd7d3_fc9eaad9-f44a-4f44-a15f-639665f1d8c6.webp?v=1788802441', name: { hu: 'Orrtágító csíkok', en: 'Nasal Strips' } }
  };
  const BUNDLE_IMG = 'ezgif-8c598b2ba6afbc63.webp?v=1788516127';
  const TIERS = { 1: { pay: 1, n: 2 }, 2: { pay: 2, n: 4 }, 3: { pay: 3, n: 6 } };
  const REVIEWS = [
    { n: 'Kata D., Debrecen', f: 'energy', hu: 'A reggeli kávé melletti cigi volt a legnehezebb. Az Energizáló pont ezt a pillanatot vette át. Három hete nem gyújtottam rá.', en: 'The cigarette with my morning coffee was the hardest. Energy Boost took over exactly that moment. Three weeks without lighting up.' },
    { n: 'Eszter V., Győr', f: 'lung', hu: 'A 2+2 csomaggal mind a négyet kipróbáltam. A mentás Tüdőtisztító lett a kedvencem a kocsiban.', en: 'With the 2+2 bundle I tried all four. The minty Lung Cleanse is now my favourite in the car.' },
    { n: 'Gábor K., Budapest', f: 'sleep', hu: 'Esténként az Alvástámogató a rituálém. Levendulás, nyugis – és másnap már meg is jött GLS-sel.', en: 'Sleep Support is my evening ritual. Lavender, calm – and it arrived the next day with GLS.' },
    { n: 'Anna B., Pécs', f: 'liver', hu: 'Ebéd után mindig rágyújtottam. Most a Májtámogató van a zsebemben. Nincs szag, nincs füst.', en: 'I always lit up after lunch. Now Liver Support lives in my pocket. No smell, no smoke.' }
  ];

  /* ---------- i18n ---------- */
  const EN = {
    pr1: 'BLACK FRIDAY · THE SECOND ONE IS FREE', pr2: 'FREE SHIPPING OVER 14.990 FT', pr3: '30-DAY GUARANTEE', pr4: 'CASH ON DELIVERY',
    n1: 'Formulas', n2: 'Bundles', n3: 'Reviews', cart: 'Cart',
    h1a: 'NICOTINE?', h1b: 'NO', h1c: 'THANKS.', mgNic: 'MG<br>NICOTINE',
    heroSub: 'A herbal inhaler. The familiar motion stays – the nicotine, smoke and combustion don’t.', heroCta: 'Get the 2+2 bundle', heroRate: '1,000+ customers',
    m1: '0 MG NICOTINE', m2: 'NON-COMBUSTIBLE', m3: 'SMOKE-FREE', m4: 'MADE IN HUNGARY',
    fKick: '4 FORMULAS · 4 MOMENTS', fTitle: 'PICK YOUR <span class="mark">MOOD.</span>',
    ends: 'Ends in:', bTitle: 'PAY FOR ONE, <span class="mark mark--green">GET TWO.</span>', bLead: 'Choose a bundle – mix the flavours below.',
    p1q: '2 inhalers', p2q: '4 inhalers · free shipping', p3q: '6 inhalers · free shipping + guide', per: '4.495 Ft / pc', pop: '★ MOST POPULAR', best: 'BEST VALUE',
    mixT: 'Which flavours should be inside?', addCart: 'Add to cart', bt1: '🚚 GLS 1–2 working days', bt2: '💳 Card or cash on delivery', bt3: '🛡️ 30-day money-back',
    rvBased: 'based on 1,000+ reviews',
    s1: 'nicotine. Not in a single puff.', dayU: 'days', s2: 'money-back guarantee. Zero risk.', s3: 'and it’s with you via GLS. Home or parcel point.',
    faqT: 'QUESTIONS?', q1: 'How do I use it?', a1: 'When the urge hits, take it out and draw on it slowly a few times. No refilling, no prep.',
    q2: 'Does it contain nicotine?', a2: 'No. Herby is completely nicotine-free, non-combustible and smoke-free.',
    q3: 'Which formula should I choose?', a3: 'Fresh and minty: Lung Cleanse. Mornings: Energy Boost. Daytime: Liver Support. Evenings: Sleep Support. Can’t decide? The 2+2 bundle has all four.',
    q4: 'What if it doesn’t work for me?', a4: 'You’re covered by our 30-day money-back guarantee. If you don’t like it, we refund you.',
    q5: 'How much is shipping?', a5: 'GLS in 1–2 working days, to your home or a parcel point. Pay by card or cash on delivery.',
    finT: 'START<br>TOMORROW.', finP: 'Order today and it can be with you tomorrow. If it doesn’t work, you get your money back.', finCta: 'Choose a bundle', nlPh: 'Your email (−10%)', nlBtn: 'Subscribe',
    ft1: 'Terms', ft2: 'Privacy', ft3: 'Shipping', ft4: 'Returns', mbar: 'Get it →',
    cartT: 'CART', emptyT: 'Your cart is empty.', emptyCta: '2+2 bundle – 17.980 Ft', upsT: 'OFTEN BOUGHT TOGETHER',
    protT: 'Package protection', protS: 'against damage & loss', sub: 'Subtotal', saved: 'You save', ship: 'Shipping', checkout: 'Checkout', cartTrust: '🔒 Secure payment · 💳 Cash on delivery · 🛡️ 30-day guarantee'
  };
  const T = {
    hu: { add: 'Kosárba', inh: 'inhalátor', bundle: t => `${t}+${t} Black Friday csomag`, free: 'Ingyen', remove: 'Törlés',
      toShip: v => `Még ${ft(v)} és <u>ingyenes a szállítás</u> 🚚`, shipOk: '🎉 Ingyenes szállítás – megvan!', nudge1: f => `🎁 Válts 1+1-re: a második ${f} <b>ingyen</b>.`, nudgeN: (t, v) => `⚡ ${t}+${t}-re bővítés csak +${ft(v)}.`, up: 'Bővítés',
      added: n => `✓ ${n} – kosárban`, checkout: 'Prototípus – itt indulna a Shopify pénztár.', nl: 'Köszi! A −10% kódot elküldtük.', mixNote: (n, k) => `${n} inhalátor, ${k} ízből egyenlően elosztva`, pickOne: 'Válassz legalább egy ízt', sale: '−50%', bestseller: 'Bestseller' },
    en: { add: 'Add to cart', inh: 'inhaler', bundle: t => `${t}+${t} Black Friday bundle`, free: 'Free', remove: 'Remove',
      toShip: v => `${ft(v)} away from <u>free shipping</u> 🚚`, shipOk: '🎉 Free shipping – unlocked!', nudge1: f => `🎁 Switch to 1+1: the second ${f} is <b>free</b>.`, nudgeN: (t, v) => `⚡ Upgrade to ${t}+${t} for just +${ft(v)}.`, up: 'Upgrade',
      added: n => `✓ ${n} – added`, checkout: 'Prototype – Shopify checkout would start here.', nl: 'Thanks! Your −10% code is on its way.', mixNote: (n, k) => `${n} inhalers, split evenly across ${k} flavour${k > 1 ? 's' : ''}`, pickOne: 'Pick at least one flavour', sale: '−50%', bestseller: 'Bestseller' }
  };
  let lang = 'hu';
  try { lang = localStorage.getItem('herby4-lang') || 'hu'; } catch (e) {}
  const HU = {};
  $$('[data-i18n]').forEach(el => { if (!(el.dataset.i18n in HU)) HU[el.dataset.i18n] = el.innerHTML; });
  $$('[data-i18n-ph]').forEach(el => HU[el.dataset.i18nPh] = el.placeholder);
  const tr = k => lang === 'en' ? (EN[k] ?? HU[k]) : HU[k];
  const t = () => T[lang];

  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => el.innerHTML = tr(el.dataset.i18n));
    $$('[data-i18n-ph]').forEach(el => el.placeholder = tr(el.dataset.i18nPh));
    document.title = lang === 'en' ? 'Herby – Nicotine? No thanks. | Black Friday −50%' : 'Herby – Nikotin? Nem köszi. | Black Friday −50%';
    $$('#lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
    renderStack(); renderMix(); renderQuote(); renderCart();
  }
  $$('#lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === lang) return;
    lang = b.dataset.l; try { localStorage.setItem('herby4-lang', lang); } catch (e) {}
    applyLang();
  }));

  /* ---------- formula stack ---------- */
  function renderStack() {
    $('#stack').innerHTML = ORDER.map((k, i) => {
      const f = F[k];
      return `<article class="fc" style="--i:${i};--bg:${f.bg};--fg:${f.fg}">
        <div class="fc__body">
          <div class="fc__top"><span class="fc__num">0${i + 1}/04</span><span class="fc__time">${f.time[lang]}</span></div>
          <h3 class="fc__name">${f.name[lang]}</h3>
          <p class="fc__tag">${f.tag[lang]}</p>
          <div class="fc__herbs">${f.herbs[lang].map(h => `<span>${h}</span>`).join('')}</div>
          <div class="fc__buy">
            <div class="fc__price"><b>8.990 Ft</b><s>17.980 Ft</s><em>${t().sale}</em></div>
            <button class="btn btn--xl" data-add="${k}">${t().add} →</button>
          </div>
        </div>
        <div class="fc__media">
          <img class="fc__herb" src="${im(f.herb, 500)}" alt="" loading="lazy">
          <img class="fc__cut" src="${im(f.cut, 700)}" alt="${f.plain[lang]}" loading="lazy">
          <div class="fc__sticker"><b>${f.st[lang][0]}</b>${f.st[lang][1]}</div>
        </div></article>`;
    }).join('');
  }

  /* ---------- bundle ---------- */
  let tier = 2, mix = new Set(ORDER);
  const picksFor = n => { const arr = ORDER.filter(k => mix.has(k)); return Array.from({ length: n }, (_, i) => arr[i % arr.length]); };
  function renderMix() {
    $('#mixChips').innerHTML = ORDER.map(k => `<button class="mchip ${mix.has(k) ? 'on' : ''}" style="--c:${F[k].bg}" data-mix="${k}"><img src="${im(F[k].cut, 120)}" alt=""><span>${F[k].plain[lang]}</span><i>${mix.has(k) ? '✓' : ''}</i></button>`).join('')
      + `<p class="mixer__note" style="flex-basis:100%">${mix.size ? t().mixNote(TIERS[tier].n, mix.size) : t().pickOne}</p>`;
    $('#bPrice').textContent = ft(TIERS[tier].pay * UNIT);
    $('#bAdd').disabled = !mix.size; $('#bAdd').style.opacity = mix.size ? 1 : .5;
  }
  $('#plans').addEventListener('click', e => {
    const p = e.target.closest('.plan'); if (!p) return;
    tier = +p.dataset.t; $$('.plan').forEach(x => x.classList.toggle('on', x === p)); renderMix();
  });
  $('#mixChips').addEventListener('click', e => {
    const c = e.target.closest('[data-mix]'); if (!c) return;
    const k = c.dataset.mix; mix.has(k) ? mix.delete(k) : mix.add(k); renderMix();
  });
  $('#bAdd').addEventListener('click', () => { if (mix.size) addLine(bundleLine(tier, picksFor(TIERS[tier].n))); });
  function bundleLine(tr_, picks) { return { key: `b${tr_}-${[...picks].sort().join('.')}`, kind: 'bundle', tier: tr_, picks, price: TIERS[tr_].pay * UNIT, compare: TIERS[tr_].n * UNIT_CMP }; }

  /* countdown */
  let end = new Date('2026-11-30T23:59:59+01:00').getTime();
  const pad = v => String(v).padStart(2, '0');
  function tick() {
    let d = end - Date.now(); if (d <= 0) { end = Date.now() + 3 * 864e5; d = end - Date.now(); }
    $('#cd').textContent = `${Math.floor(d / 864e5)}${lang === 'en' ? 'd' : 'n'} ${pad(Math.floor(d / 36e5) % 24)}:${pad(Math.floor(d / 6e4) % 60)}:${pad(Math.floor(d / 1e3) % 60)}`;
  }
  tick(); setInterval(tick, 1000);

  /* ---------- reviews slider ---------- */
  let qi = 0, qTimer;
  function renderQuote() {
    const r = REVIEWS[qi], f = F[r.f];
    $('#quote').style.background = '#fff';
    $('#quoteBody').innerHTML = `<div class="quote__body"><span class="stars">★★★★★</span><p class="quote__text">${lang === 'en' ? '“' : '„'}${r[lang]}”</p>
      <div class="quote__who" style="--c:${f.bg}"><img src="${im(f.cut, 120)}" alt=""><div><b>${r.n}</b><small>✓ ${lang === 'en' ? 'Verified buyer' : 'Ellenőrzött vásárló'} · ${f.plain[lang]}</small></div></div></div>`;
    $('#qDots').innerHTML = REVIEWS.map((_, i) => `<i class="${i === qi ? 'on' : ''}"></i>`).join('');
    clearTimeout(qTimer); qTimer = setTimeout(() => { qi = (qi + 1) % REVIEWS.length; renderQuote(); }, 6500);
  }
  $('#qPrev').addEventListener('click', () => { qi = (qi - 1 + REVIEWS.length) % REVIEWS.length; renderQuote(); });
  $('#qNext').addEventListener('click', () => { qi = (qi + 1) % REVIEWS.length; renderQuote(); });

  /* ---------- cart ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('herby4-cart') || '[]'); } catch (e) {}
  const save = () => { try { localStorage.setItem('herby4-cart', JSON.stringify(cart)); } catch (e) {} };
  const nameOf = l => l.kind === 'single' ? `${F[l.f].plain[lang]} ${t().inh}` : l.kind === 'bundle' ? t().bundle(l.tier) : ACC[l.id].name[lang];
  const imgOf = l => l.kind === 'single' ? `<div class="ln__img" style="--c:${F[l.f].bg}"><img src="${im(F[l.f].cut, 200)}" alt=""></div>`
    : l.kind === 'bundle' ? `<div class="ln__img"><img class="cover" src="${im(BUNDLE_IMG, 200)}" alt=""></div>`
    : `<div class="ln__img"><img class="cover" src="${im(ACC[l.id].img, 200)}" alt=""></div>`;

  function add(k) {
    if (F[k]) addLine({ key: 's-' + k, kind: 'single', f: k, price: UNIT, compare: UNIT_CMP });
    else addLine({ key: 'a-' + k, kind: 'acc', id: k, price: ACC[k].price, compare: 0 });
  }
  function addLine(l) {
    const ex = cart.find(c => c.key === l.key); ex ? ex.qty++ : cart.push({ ...l, qty: 1 });
    save(); renderCart(); openCart(); toast(t().added(nameOf(l)));
    const b = $('#cartCount'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  }
  document.addEventListener('click', e => { const a = e.target.closest('[data-add]'); if (a) add(a.dataset.add); });

  function renderCart() {
    const sub = cart.reduce((s, l) => s + l.price * l.qty, 0);
    const saved = cart.reduce((s, l) => s + (l.compare ? (l.compare - l.price) * l.qty : 0), 0);
    const n = cart.reduce((s, l) => s + l.qty, 0);
    $('#cartCount').textContent = n; $('#cartN').textContent = n;
    $('#cartEmpty').classList.toggle('show', !cart.length);
    $('#lines').innerHTML = cart.map((l, i) => `<div class="ln">${imgOf(l)}
      <div><h5>${nameOf(l)}</h5>${l.kind === 'bundle' ? `<small>${ORDER.filter(k => l.picks.includes(k)).map(k => `${l.picks.filter(x => x === k).length}× ${F[k].plain[lang]}`).join(' · ')}</small>` : ''}
        <div class="qty"><button data-q="-1" data-i="${i}">−</button><span>${l.qty}</span><button data-q="1" data-i="${i}">+</button></div></div>
      <div class="ln__r"><div><b>${ft(l.price * l.qty)}</b>${l.compare ? `<s>${ft(l.compare * l.qty)}</s>` : ''}</div><button class="ln__rm" data-rm="${i}">${t().remove}</button></div></div>`).join('');
    $('#shipFill').style.width = Math.min(100, sub / FREE_SHIP * 100) + '%';
    $('#shipMsg').innerHTML = !cart.length ? t().toShip(FREE_SHIP) : sub >= FREE_SHIP ? t().shipOk : t().toShip(FREE_SHIP - sub);

    const single = cart.find(l => l.kind === 'single'), bun = cart.filter(l => l.kind === 'bundle').sort((a, b) => a.tier - b.tier)[0];
    $('#nudge').innerHTML = single ? `<div class="nudge"><span>${t().nudge1(F[single.f].plain[lang])}</span><button class="btn btn--black" data-up="s">${t().up}</button></div>`
      : bun && bun.tier < 3 ? `<div class="nudge"><span>${t().nudgeN(bun.tier + 1, UNIT)}</span><button class="btn btn--black" data-up="b">${t().up}</button></div>` : '';

    const have = new Set(cart.map(l => l.id || l.f));
    const ups = [...Object.keys(ACC).filter(k => !have.has(k)), ...ORDER.filter(k => !have.has(k))].slice(0, 6);
    $('#ups').innerHTML = ups.map(k => {
      const isF = !!F[k];
      return `<div class="up"><div class="up__img" style="--c:${isF ? F[k].bg : '#f3ead7'}"><img class="${isF ? 'cut' : ''}" src="${im(isF ? F[k].cut : ACC[k].img, 300)}" alt=""></div>
        <div class="up__b"><h6>${isF ? F[k].plain[lang] : ACC[k].name[lang]}</h6><div class="up__row"><b>${ft(isF ? UNIT : ACC[k].price)}</b><button data-add="${k}" aria-label="${t().add}">+</button></div></div></div>`;
    }).join('');

    const prot = cart.length && $('#prot').checked ? PROT : 0, ship = !cart.length || sub >= FREE_SHIP ? 0 : SHIP;
    $('#sSub').textContent = ft(sub);
    $('#sSave').textContent = '−' + ft(saved); $('#sSaveRow').style.display = saved ? '' : 'none';
    $('#sShip').textContent = !cart.length ? '–' : ship ? ft(ship) : t().free;
    $('#sTotal').textContent = ft(sub + ship + prot);
    $('.prot').style.display = cart.length ? '' : 'none';
  }
  $('#lines').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    if (q) { const l = cart[+q.dataset.i]; l.qty += +q.dataset.q; if (l.qty < 1) cart.splice(+q.dataset.i, 1); }
    else if (rm) cart.splice(+rm.dataset.rm, 1); else return;
    save(); renderCart();
  });
  $('#nudge').addEventListener('click', e => {
    const b = e.target.closest('[data-up]'); if (!b) return;
    if (b.dataset.up === 's') {
      const i = cart.findIndex(l => l.kind === 'single'), s = cart[i]; s.qty > 1 ? s.qty-- : cart.splice(i, 1);
      const nl = bundleLine(1, [s.f, s.f]), ex = cart.find(c => c.key === nl.key); ex ? ex.qty++ : cart.push({ ...nl, qty: 1 });
    } else {
      const bun = cart.filter(l => l.kind === 'bundle').sort((a, b) => a.tier - b.tier)[0], i = cart.indexOf(bun);
      const nt = bun.tier + 1, np = [...bun.picks];
      while (np.length < TIERS[nt].n) np.push(ORDER.find(k => !np.includes(k)) || ORDER[np.length % 4]);
      bun.qty > 1 ? bun.qty-- : cart.splice(i, 1); cart.push({ ...bundleLine(nt, np), qty: 1 });
    }
    save(); renderCart();
  });
  $('#prot').addEventListener('change', renderCart);
  $('#emptyAdd').addEventListener('click', () => addLine(bundleLine(2, ORDER)));
  $('#checkout').addEventListener('click', () => toast(t().checkout));
  const openCart = () => { document.body.classList.add('open'); $('#cart').setAttribute('aria-hidden', 'false'); };
  const closeCart = () => { document.body.classList.remove('open'); $('#cart').setAttribute('aria-hidden', 'true'); };
  $('#cartBtn').addEventListener('click', openCart);
  $('#cartX').addEventListener('click', closeCart);
  $('#veil').addEventListener('click', closeCart);
  addEventListener('keydown', e => e.key === 'Escape' && closeCart());

  let tt;
  function toast(m) { const el = $('#toast'); el.textContent = m; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2400); }
  $('#nl').addEventListener('submit', e => { e.preventDefault(); toast(t().nl); e.target.reset(); });

  /* ---------- scroll fx ---------- */
  const hdr = $('#hdr'), prod = $('#heroProd'), mbar = $('#mbar');
  function onScroll() {
    const y = scrollY;
    hdr.classList.toggle('sc', y > innerHeight * .7);
    if (innerWidth > 1000) prod.style.transform = `translate(-50%,-50%) rotate(${-8 + y * .04}deg) translateY(${y * .12}px)`;
    // stacking cards scale-down
    if (innerWidth > 1000) {
      const cards = $$('.fc');
      cards.forEach((c, i) => {
        const next = cards[i + 1]; if (!next) { c.style.transform = ''; return; }
        const nr = next.getBoundingClientRect(), cr = c.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, 1 - (nr.top - cr.top) / cr.height));
        c.style.transform = `scale(${1 - p * .06})`; c.style.filter = `brightness(${1 - p * .25})`;
      });
    }
    const b = $('#bundle').getBoundingClientRect();
    mbar.classList.toggle('show', y > 600 && !(b.top < innerHeight && b.bottom > 0) && !document.body.classList.contains('open'));
  }
  addEventListener('scroll', onScroll, { passive: true });

  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .15 });
  $$('.quote,.faq__list details').forEach(el => { el.classList.add('rv'); io.observe(el); });

  applyLang(); onScroll();
})();
