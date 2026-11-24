/* FinePS homepage — Version 3 (masking-first, light) */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const money = n => '$' + n.toFixed(2);
  const icon = (id, cls = 'ic') => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;
  const im = n => '../images/' + n + '.webp';
  const fine = matchMedia('(hover:hover) and (pointer:fine)');

  /* ================= Units (mm / inch) ================= */
  let UNIT = 'in';
  try { UNIT = localStorage.getItem('fineps-unit') === 'mm' ? 'mm' : 'in'; } catch (e) {}
  const mmNum = inch => { const v = inch * 25.4; return v < 10 ? v.toFixed(1).replace(/\.0$/, '') : String(Math.round(v)); };
  const frac = s => s.includes('/') ? s.split('/').reduce((a, b) => parseFloat(a) / parseFloat(b)) : parseFloat(s);
  function fmtSize(s) {
    if (!s) return '';
    const nums = String(s).match(/\d+\/\d+|\d*\.?\d+/g) || [];
    if (UNIT === 'mm') return nums.map(n => mmNum(frac(n))).join('–') + ' mm';
    if (/^\d\.\d{3}$/.test(s)) return s.replace(/^0/, '') + '"';
    return /"$/.test(s) ? s : s + '"';
  }
  function fmtLen(k) {
    if (!k) return '';
    const ft = k.match(/^(\d+)ft$/);
    if (ft) return UNIT === 'mm' ? (ft[1] * 0.3048).toFixed(1).replace(/\.0$/, '') + ' m' : (+ft[1]).toLocaleString() + ' ft';
    return k;
  }
  const fmtYd = yd => UNIT === 'mm' ? (yd * 0.9144).toFixed(1) + ' m' : yd + ' yd';
  const unitWord = () => UNIT === 'mm' ? 'mm' : 'inches';

  /* ================= Catalog ================= */
  const CAT = (window.FINEPS_CATALOG || []).map(p => {
    if (p.f === 'netting' && !p.s) { const m = p.t.match(/(\d?\.\d+)\D{0,4}to\s*(\d?\.\d+)/i); if (m) p.s = (m[1].startsWith('.') ? '0' + m[1] : m[1]) + '–' + m[2] + '"'; }
    return p;
  });
  const BY = Object.fromEntries(CAT.map(p => [p.h, p]));
  const num = s => { if (!s) return 999; const m = String(s).match(/\d+\/\d+|\d*\.?\d+/); return m ? frac(m[0]) : 999; };
  const short = p => p.t.replace(/\s*[|–-]\s*(Flexible Polyethylene.*|Durable.*|Easy.*)$/i, '').replace(/\s+/g, ' ');
  const TAPE_F = ['pet', 'dots', 'glass', 'paper'];
  const singles = f => CAT.filter(p => p.f === f && p.s && (TAPE_F.includes(f) ? p.k === 'Single roll' : p.k !== 'Case'));
  const famAll = f => CAT.filter(p => p.f === f);
  const minP = list => list.length ? Math.min(...list.map(p => p.p)) : 0;
  const imgFor = p => {
    if (p.f === 'netting') { const t = p.t.toLowerCase(); for (const c of ['red', 'orange', 'blue', 'yellow', 'gray', 'brown']) if (t.includes(c)) return 'cut-netting-' + c; const s = num(p.s); return 'cut-netting-' + (s < 1 ? 'blue' : s < 2.5 ? 'yellow' : s < 3.5 ? 'red' : s < 4.5 ? 'gray' : 'orange'); }
    if (p.f === 'spline') return p.k === '15 lb roll' ? 'cut-spline-15lb' : p.k === '100ft' ? 'cut-spline-coil' : 'cut-round-spline';
    if (p.f === 'flat') return p.k === '1000ft' || p.k === '500ft' ? 'cut-flat-1000' : 'cut-flat-spline';
    return ({ pet: 'cut-green-tape', dots: 'cut-green-dots', glass: 'cut-glass-cloth', paper: 'cut-paper-tape', spiral: 'cut-spiral-wrap', smooth: 'cut-smooth-spline', tool: 'cut-roller-tool', bugseal: 'cut-bug-seal', clips: 'cut-screen-clips', spring: 'cut-tender-spring' })[p.f];
  };

  /* ================= Illustrations for upcoming lines ================= */
  function roll(c, edge, core = '#F2F1EC') {
    return `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="104" rx="40" ry="6" fill="rgba(17,26,21,.12)"/><path d="M22 40v40c0 12 17 22 38 22s38-10 38-22V40" fill="${edge}"/><ellipse cx="60" cy="40" rx="38" ry="22" fill="${c}"/><ellipse cx="60" cy="40" rx="20" ry="11" fill="${core}"/><ellipse cx="60" cy="40" rx="16" ry="8.5" fill="#fff" opacity=".85"/><path d="M28 52c8 8 20 11 32 11" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
  }
  const ILL = {
    hpaper: roll('#EADDB4', '#D8C68F'), polyimide: roll('#D99A2B', '#B97A15'), alu: roll('#D9DEE2', '#AEB6BD'), ds: roll('#FAFAF7', '#E1DED5'), vinyl: roll('#3D7BD6', '#2A5DAE'), silicone: roll('#D6533A', '#B13D27'),
    diecut: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><rect x="16" y="20" width="88" height="80" rx="10" fill="#EEF4EE" stroke="#CFE2CF"/><g fill="#4CB24F" opacity=".85"><circle cx="38" cy="44" r="10"/><circle cx="64" cy="44" r="10"/><rect x="80" y="34" width="16" height="20" rx="4"/><circle cx="38" cy="74" r="10"/><path d="M56 64h18l6 10-6 10H56l-6-10Z"/><rect x="82" y="66" width="12" height="16" rx="6"/></g></svg>`,
    cap: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="104" rx="36" ry="6" fill="rgba(17,26,21,.12)"/><path d="M34 36h52v54c0 7-12 12-26 12s-26-5-26-12Z" fill="#D6533A"/><ellipse cx="60" cy="36" rx="26" ry="9" fill="#E8735B"/><ellipse cx="60" cy="36" rx="17" ry="5.5" fill="#B83F29"/><path d="M42 48v40" stroke="#fff" stroke-opacity=".3" stroke-width="4" stroke-linecap="round"/></svg>`,
    plug: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="106" rx="30" ry="5" fill="rgba(17,26,21,.12)"/><path d="M38 30h44l-10 70H48Z" fill="#3D7BD6"/><ellipse cx="60" cy="30" rx="22" ry="7" fill="#6A9BE6"/><path d="M46 40l6 54" stroke="#fff" stroke-opacity=".3" stroke-width="4" stroke-linecap="round"/></svg>`,
    pulltab: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="106" rx="30" ry="5" fill="rgba(17,26,21,.12)"/><path d="M42 44h36l-8 58H50Z" fill="#E2A32B"/><ellipse cx="60" cy="44" rx="18" ry="6" fill="#F0BF5C"/><path d="M60 40V24a10 10 0 1 1 20 0v6" fill="none" stroke="#E2A32B" stroke-width="7" stroke-linecap="round"/></svg>`,
    shook: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><path d="M60 14c-14 0-14 22 0 22s14 22 0 22-14 22 0 22 14 22 0 22" fill="none" stroke="#7C868D" stroke-width="6" stroke-linecap="round"/><path d="M60 14c-14 0-14 22 0 22" fill="none" stroke="#B5BDC2" stroke-width="2" stroke-linecap="round"/></svg>`,
    jhook: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><path d="M60 12v60a16 16 0 1 1-32 0v-6" fill="none" stroke="#7C868D" stroke-width="6" stroke-linecap="round"/><circle cx="60" cy="12" r="5" fill="none" stroke="#7C868D" stroke-width="4"/></svg>`,
    rack: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><path d="M20 22h80" stroke="#5E676E" stroke-width="7" stroke-linecap="round"/><g fill="none" stroke="#7C868D" stroke-width="4" stroke-linecap="round"><path d="M36 22v40a8 8 0 1 1-16 0"/><path d="M60 22v52a8 8 0 1 1-16 0"/><path d="M84 22v40a8 8 0 1 1-16 0"/></g></svg>`
  };
  const visual = (x, cls = '') => x.img ? `<img src="${im(x.img)}" alt="" loading="lazy" class="${cls}">` : ILL[x.ill];

  /* ================= Masking tape types ================= */
  const MASK = [
    { id: 'pet', n: 'Green Polyester (PET) Tape', s: 'Green PET', fam: 'pet', img: 'cut-green-tape', temp: '400°F / 204°C', tShort: '400°F', adh: 'Silicone', car: 'Polyester (PET) film', yd: 72, badge: 'Best seller',
      d: 'High-temperature polyester film with silicone adhesive. Removes cleanly with no residue when used within the process window, and supports die cutting for detailed masking.', uses: ['Powder coating', 'Cerakote', 'Plating & anodizing', 'Sublimation'] },
    { id: 'dots', n: 'Die-Cut Masking Dots', s: 'Masking dots', fam: 'dots', img: 'cut-green-dots', temp: '400°F / 204°C (20 min)', tShort: '400°F', adh: 'Silicone', car: 'Polyester film',
      d: 'Pre-cut green polyester discs keep powder coat, Cerakote and paint off holes, studs, nuts and grounding points — no trimming, no wasted time.', uses: ['Holes & studs', 'Grounding points', 'Mating surfaces', 'Nuts & threads'] },
    { id: 'glass', n: 'Glass Cloth Tape', s: 'Glass cloth', fam: 'glass', img: 'cut-glass-cloth', temp: 'High-temperature', tShort: 'High', adh: 'Silicone', car: 'Woven glass cloth', yd: 32,
      d: 'Glass cloth carrier with silicone adhesive for high tear strength and abrasion resistance — built for high-heat, spray and electrical insulation work.', uses: ['Flame & plasma spray', 'Electrical insulation', 'Motor & coil wrapping', 'Bundling'] },
    { id: 'paper', n: 'Low-Temp Paper Masking Tape', s: 'Paper masking', fam: 'paper', img: 'cut-paper-tape', temp: 'Low-temperature', tShort: 'Low', adh: 'Water-based', car: 'Crepe paper', yd: 54,
      d: 'Crepe paper masking tape with water-based adhesive — strong hold, clean removal and no residue for paint and finishing work.', uses: ['Painting', 'Auto refinish', 'Appliances', 'Interior finishing'] },
    { id: 'hpaper', n: 'High-Temp Paper Masking Tape', s: 'High-temp paper', ill: 'hpaper', soon: true, uses: ['Bake ovens', 'Paint lines', 'Auto refinish'] },
    { id: 'polyimide', n: 'Polyimide Film Tape', s: 'Polyimide', ill: 'polyimide', soon: true, uses: ['Electronics', 'PCB & wave solder', 'High-heat masking'] },
    { id: 'diecut', n: 'Custom Die-Cut Tabs & Shapes', s: 'Die-cut shapes', ill: 'diecut', soon: true, uses: ['Custom shapes', 'Tabs & strips', 'Production runs'] },
    { id: 'vinyl', n: 'Plating & Anodizing Vinyl Tape', s: 'Plating vinyl', ill: 'vinyl', soon: true, uses: ['Plating', 'Anodizing', 'Chemical baths'] },
    { id: 'alu', n: 'Aluminum Foil Tape', s: 'Aluminum foil', ill: 'alu', soon: true, uses: ['Thermal shielding', 'Blast masking', 'Sealing'] },
    { id: 'silicone', n: 'Silicone Rubber Tape', s: 'Silicone rubber', ill: 'silicone', soon: true, uses: ['Wrapping', 'Sealing', 'High-heat masking'] },
    { id: 'ds', n: 'Double-Sided Tape', s: 'Double-sided', ill: 'ds', soon: true, uses: ['Mounting', 'Splicing', 'Assembly'] }
  ];
  const MK = Object.fromEntries(MASK.map(m => [m.id, m]));
  const tapeItems = m => m.soon ? [] : singles(m.fam).sort((a, b) => num(a.s) - num(b.s));
  const dotsCount = p => { const m = p.t.match(/x\s*([\d,]+)\s*Dots/i); return m ? m[1] + ' dots / roll' : ''; };

  /* ================= Product lines ================= */
  const LINES = {
    masking: { n: 'Masking Tapes', ic: 'roller', d: 'PET, dots, glass cloth, paper & more' },
    protect: { n: 'Netting & Spiral Wrap', ic: 'shield', d: 'PE netting, sleeves & hose wrap', img: 'cut-netting-red', photo: 'app-red-netting', intro: 'Expandable PE netting and spiral wrap protect machined parts, hoses and cables in handling, storage and shipping.' },
    caps: { n: 'Caps & Plugs', ic: 'plug', d: 'Silicone caps & masking plugs', ill: 'cap', isNew: true, intro: 'High-temperature silicone caps and plugs for masking studs, threads and holes through powder coating and plating.' },
    hooks: { n: 'Hooks', ic: 'hook', d: 'Powder-coating & racking hooks', ill: 'shook', isNew: true, intro: 'S-hooks, J-hooks and racking hooks to hang parts through the spray booth and cure oven.' },
    screen: { n: 'Screen & Spline', ic: 'home', d: 'Spline, roller tools, bug seals', img: 'cut-round-spline', photo: 'app-screened-porch', intro: 'Round, serrated, flat and smooth spline in 40+ sizes, plus the roller tools, clips and bug seals to finish the job.' }
  };
  const CARDS = {
    protect: [
      { t: 'Heavy-Duty PE Netting', sub: 'Expandable stretch-fit spools', fam: 'netting', filt: p => num(p.s) >= 2, lbl: { s: 'Stretch range' }, badge: 'Bulk spool' },
      { t: 'Protective Mesh Sleeves', sub: 'For small parts & threads', fam: 'netting', filt: p => num(p.s) < 2, lbl: { s: 'Stretch range' } },
      { t: 'Spiral Cable & Hose Wrap', sub: 'Polyethylene · black or yellow', fam: 'spiral', lbl: { s: 'Size', k: 'Length', v: 'Color' } }
    ],
    screen: [
      { t: 'Round Retainer Spline', sub: 'Serrated black vinyl', fam: 'spline', lbl: { s: 'Diameter', k: 'Length' }, def: '0.185', badge: 'Best seller' },
      { t: 'Flat Screen Spline', sub: 'Pool cages & patio enclosures', fam: 'flat', lbl: { s: 'Width', k: 'Length' } },
      { t: 'Screen Roller Tool', sub: 'Steel bearing wheels', fam: 'tool', lbl: {} }
    ],
    caps: [
      { t: 'Silicone Caps', sub: 'Mask studs, bolts & threads', ill: 'cap', soon: true },
      { t: 'Tapered Silicone Plugs', sub: 'Mask holes of many sizes', ill: 'plug', soon: true },
      { t: 'Plugs with Pull Tab', sub: 'Fast removal after cure', ill: 'pulltab', soon: true }
    ],
    hooks: [
      { t: 'Powder-Coating S-Hooks', sub: 'Hang parts on the line', ill: 'shook', soon: true },
      { t: 'J-Hooks & Wire Hooks', sub: 'Steel hooks, many lengths', ill: 'jhook', soon: true },
      { t: 'Racking & Multi-Hooks', sub: 'Hang several parts at once', ill: 'rack', soon: true }
    ]
  };
  const INDS = [
    { n: 'Powder coating', img: 'app-machined-parts', d: 'Clean edges through 400°F cures on every batch.', rec: [['tape', 'pet'], ['tape', 'dots'], ['line', 'caps'], ['line', 'hooks']] },
    { n: 'Plating & anodizing', img: 'app-shaft-netting', d: 'Hold-tight masking for baths and chemical processes.', rec: [['tape', 'pet'], ['tape', 'vinyl'], ['line', 'caps']] },
    { n: 'Paint & auto refinish', img: 'app-gear-netting', d: 'Sharp paint lines that lift off without residue.', rec: [['tape', 'paper'], ['tape', 'hpaper'], ['tape', 'pet']] },
    { n: 'Electrical & electronics', img: 'app-cable-wrap', d: 'Insulation, wrapping and cable protection.', rec: [['tape', 'glass'], ['tape', 'polyimide'], ['line', 'protect']] },
    { n: 'Machining & packaging', img: 'app-red-netting', d: 'Ship finished parts without nicks or scratches.', rec: [['line', 'protect'], ['tape', 'pet']] },
    { n: 'Window & door', img: 'app-screened-porch', d: 'Screens that stay tight, season after season.', rec: [['line', 'screen']] }
  ];

  /* ================= Toast ================= */
  let tT;
  const toast = m => { const t = $('#toast'); t.innerHTML = icon('check') + m; t.classList.add('is-on'); clearTimeout(tT); tT = setTimeout(() => t.classList.remove('is-on'), 2600); };

  /* ================= Cart ================= */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('fineps-cart-3') || '[]').filter(i => BY[i.h]); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem('fineps-cart-3', JSON.stringify(cart)); } catch (e) {} };
  function addToCart(h, q = 1, v = '') {
    const p = BY[h]; if (!p) return;
    const ex = cart.find(i => i.h === h && i.v === v); ex ? ex.q += q : cart.push({ h, q, v });
    save(); renderCart();
    const c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    toast(`Added ${q > 1 ? q + ' × ' : ''}${short(p).slice(0, 44)}${short(p).length > 44 ? '…' : ''}`);
  }
  function renderCart() {
    const n = cart.reduce((a, i) => a + i.q, 0);
    $('#cartCount').textContent = n; $('#cartN').textContent = n ? `(${n})` : '';
    $('#cartItems').innerHTML = cart.length ? cart.map((i, x) => { const p = BY[i.h]; return `<div class="ci"><img src="${im(imgFor(p))}" alt=""><div><b>${short(p)}</b><small>${[p.s && fmtSize(p.s), i.v, p.k && p.k !== 'Single roll' ? fmtLen(p.k) : 'Single roll'].filter(Boolean).join(' · ')}</small><div class="qty"><button data-q="-1" data-i="${x}" aria-label="Decrease">${icon('minus')}</button><span>${i.q}</span><button data-q="1" data-i="${x}" aria-label="Increase">${icon('plus')}</button></div></div><div class="ci__p">${money(p.p * i.q)}<button class="ci__rm" data-rm="${x}">Remove</button></div></div>`; }).join('')
      : `<div class="ce">${icon('cart')}<p><b>Your cart is empty</b></p><a class="bt bt--dark bt--sm" href="#masking" data-close-cart>Shop masking tapes</a></div>`;
    $('#cartSub').textContent = money(cart.reduce((a, i) => a + BY[i.h].p * i.q, 0));
  }
  $('#cartItems').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    if (q) { const i = cart[+q.dataset.i]; i.q += +q.dataset.q; if (i.q < 1) cart.splice(+q.dataset.i, 1); }
    if (rm) cart.splice(+rm.dataset.rm, 1);
    if (q || rm) { save(); renderCart(); }
  });
  const openCart = () => { closeMenus(); $('#cart').classList.add('is-open'); $('#cart').setAttribute('aria-hidden', 'false'); };
  const closeCart = () => { $('#cart').classList.remove('is-open'); $('#cart').setAttribute('aria-hidden', 'true'); };
  $('#openCart').addEventListener('click', openCart);
  $('#cart').addEventListener('click', e => { if (e.target.id === 'cart' || e.target.closest('[data-close-cart]')) closeCart(); });
  $('#checkout').addEventListener('click', () => toast('Prototype: this opens Shopify secure checkout'));

  /* ================= Quote modal ================= */
  const md = $('#quote');
  function openQuote(ctx) {
    closeMenus(); closeCart(); closeSearch(); closeMnav();
    $('#qf .md__ok').hidden = true;
    const pr = $('#qfProd');
    if (ctx && ctx.name) { pr.hidden = false; pr.innerHTML = `${ctx.vis || ''}<span><b>${ctx.name}</b><small>${ctx.note || 'Bulk & volume pricing'}</small></span>`; $('#qfProduct').value = ctx.name + (ctx.size ? ' — ' + ctx.size : ''); }
    else { pr.hidden = true; $('#qfProduct').value = ''; }
    md.classList.add('is-open'); md.setAttribute('aria-hidden', 'false');
    setTimeout(() => $('#qf input[name=name]').focus(), 80);
  }
  const closeQuote = () => { md.classList.remove('is-open'); md.setAttribute('aria-hidden', 'true'); };
  md.addEventListener('click', e => { if (e.target === md || e.target.closest('[data-close-quote]')) closeQuote(); });
  $('#qfQty').addEventListener('click', e => { const b = e.target.closest('button'); if (b) $$('button', $('#qfQty')).forEach(x => x.classList.toggle('is-on', x === b)); });
  $('#qf').addEventListener('submit', e => {
    e.preventDefault(); let ok = true;
    $$('#qf input[required]').forEach(i => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.classList.toggle('is-err', bad); if (bad) ok = false; });
    if (ok) $('#qf .md__ok').hidden = false; else toast('Please add your name and a valid email');
  });

  /* global click actions */
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]');
    if (a) { e.preventDefault(); const q = +(a.dataset.qty || 1); addToCart(a.dataset.add, q, a.dataset.variant || ''); if (a.classList.contains('add')) { const o = a.innerHTML; a.classList.add('is-done'); a.innerHTML = icon('check') + 'Added'; setTimeout(() => { a.classList.remove('is-done'); a.innerHTML = o; }, 1300); } return; }
    const q = e.target.closest('[data-quote]');
    if (q) { e.preventDefault(); const d = q.dataset; openQuote(d.quote ? { name: d.quote, size: d.size, note: d.note, vis: d.vis ? (ILL[d.vis] || `<img src="${im(d.vis)}" alt="">`) : '' } : null); return; }
    const t = e.target.closest('[data-tape]');
    if (t && MK[t.dataset.tape]) { selTape(t.dataset.tape); }
    const l = e.target.closest('[data-line]');
    if (l && LINES[l.dataset.line] && l.dataset.line !== 'masking') { selLine(l.dataset.line); }
  });

  /* ================= Header menus ================= */
  const nvUl = $('#nvUl');
  const menuLink = x => `<a class="mm__l" href="${x.href}" ${x.attr || ''}><span class="th">${x.vis}</span><span><b>${x.n}${x.isNew ? ' <span class="new">New</span>' : ''}</b><small>${x.d}</small></span></a>`;
  function buildNav() {
    const maskLinks = MASK.map(m => ({ n: m.s === 'Green PET' ? 'Green Polyester (PET)' : m.n.replace(' Tape', ''), d: m.soon ? 'Available on request' : `${m.tShort === 'High' || m.tShort === 'Low' ? m.temp : 'Up to ' + m.tShort} · from ${money(minP(tapeItems(m)))}`, vis: visual(m), href: '#masking', attr: `data-tape="${m.id}"` }));
    const lineLinks = k => (CARDS[k] || []).map(c => ({ n: c.t, d: c.soon ? 'Available on request' : c.sub, vis: visual(c.fam ? { img: imgFor((c.filt ? famAll(c.fam).filter(c.filt) : famAll(c.fam))[0]) } : c), href: '#more', attr: `data-line="${k}"`, isNew: c.soon }));
    const mega = (title, links, promo) => `<div class="mm"><div class="w mm__in"><div><div class="mm__h"><b>${title}</b></div><div class="mm__g">${links.map(menuLink).join('')}</div></div>${promo}</div></div>`;
    const promo = (h, s, img, btn, attr) => `<div class="mm__p"><b>${h}</b><small>${s}</small><img src="${im(img)}" alt="" loading="lazy"><button class="bt bt--dark bt--sm" ${attr}>${btn}</button></div>`;
    const items = [
      { n: 'Masking Tapes', ic: 'roller', main: true, panel: mega('Masking tapes — 11 types', maskLinks, promo('Not sure which tape?', 'Tell us your coating and cure temperature — we\'ll recommend one.', 'cut-green-dots', 'Ask a specialist', 'data-quote="Masking tape recommendation" data-note="Tell us your coating & cure temperature"')) },
      { n: 'Netting & Spiral Wrap', ic: 'shield', panel: mega('Netting & spiral wrap', lineLinks('protect'), promo('Protect every part you ship', 'Bulk spools and cut-to-length sleeves.', 'cut-netting-orange', 'Bulk netting quote', 'data-quote="PE netting — bulk spools"')) },
      { n: 'Caps & Plugs', ic: 'plug', isNew: true, panel: mega('Caps & plugs', lineLinks('caps'), promo('Coming to FinePS', 'Silicone caps and plugs — request sizes and pricing today.', 'cut-green-dots', 'Request caps & plugs', 'data-quote="Silicone caps & plugs" data-vis="cap"')) },
      { n: 'Hooks', ic: 'hook', isNew: true, panel: mega('Hooks', lineLinks('hooks'), promo('Hang it right', 'Powder-coating and racking hooks — request a quote.', 'cut-roller-tool', 'Request hooks', 'data-quote="Powder-coating hooks" data-vis="shook"')) },
      { n: 'Screen & Spline', ic: 'home', panel: mega('Screen & spline', lineLinks('screen'), promo('40+ spline sizes', 'Including the in-between sizes big-box stores miss.', 'cut-spline-15lb', 'Find my spline', 'data-line="screen"')) },
      { n: 'Industries', ic: 'factory', panel: mega('Shop by industry', INDS.map(i => ({ n: i.n, d: i.d, vis: `<img src="${im(i.img)}" alt="" loading="lazy" style="width:52px;height:52px;object-fit:cover">`, href: '#industries' })), promo('Multi-industry supply', 'One supplier for coating, plating, packaging and screens.', 'cut-glass-cloth', 'Talk to sales', 'data-quote="Industry supply"')) }
    ];
    nvUl.innerHTML = items.map(x => `<li class="nv__i" data-menu><button class="nv__b ${x.main ? 'nv__b--main' : ''}" aria-expanded="false">${icon(x.ic)}${x.n}${x.isNew ? ' <span class="new">New</span>' : ''}${icon('chev', 'ic chev')}</button>${x.panel}</li>`).join('') +
      `<li class="nv__sp"></li><li class="nv__i"><button class="nv__b nv__b--q" data-quote="">${icon('file')}Bulk Quotes</button></li>`;
    // mobile
    $('#mnavList').innerHTML = items.map((x, i) => `<details class="macc" ${i === 0 ? 'open' : ''}><summary>${icon(x.ic)}${x.n}${x.isNew ? ' <span class="new">New</span>' : ''}${icon('chev', 'ic chev')}</summary><div class="macc__b">${(i === 0 ? maskLinks : i === 5 ? INDS.map(d => ({ n: d.n, href: '#industries' })) : lineLinks(['', 'protect', 'caps', 'hooks', 'screen'][i])).map(l => `<a href="${l.href}" ${l.attr || ''}>${l.n}${l.isNew ? ' <span class="new">Soon</span>' : ''}</a>`).join('')}</div></details>`).join('');
    wireMenus();
  }
  let menus = [];
  const setOpen = (li, on) => { li.classList.toggle('is-open', on); const b = li.querySelector(':scope > button'); if (b) b.setAttribute('aria-expanded', on); };
  function closeMenus(ex) { menus.forEach(m => m !== ex && setOpen(m, false)); }
  function wireMenus() {
    menus = $$('[data-menu]', nvUl);
    menus.forEach(li => {
      let ti, to;
      li.addEventListener('mouseenter', () => { if (!fine.matches) return; clearTimeout(to); ti = setTimeout(() => { closeMenus(li); setOpen(li, true); }, menus.some(m => m.classList.contains('is-open')) ? 0 : 90); });
      li.addEventListener('mouseleave', () => { if (!fine.matches) return; clearTimeout(ti); to = setTimeout(() => setOpen(li, false), 220); });
      li.querySelector(':scope > button').addEventListener('click', () => { const on = !li.classList.contains('is-open'); closeMenus(li); setOpen(li, on); });
      li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) setOpen(li, false); });
      li.addEventListener('click', e => { if (e.target.closest('a, [data-quote], [data-line]') && e.target.closest('.mm')) setOpen(li, false); });
    });
  }
  document.addEventListener('pointerdown', e => { if (!e.target.closest('[data-menu]')) closeMenus(); if (!e.target.closest('#ps')) closeSearch(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeMenus(); closeCart(); closeQuote(); closeSearch(); closeMnav(); }
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); $('#psIn').focus(); }
  });
  // header shadow + mobile bar
  const onScroll = () => { $('#hd').classList.toggle('is-s', scrollY > 10); $('#mb').classList.toggle('is-on', scrollY > 700); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  // mobile nav
  const mnav = $('#mnav');
  function closeMnav() { mnav.classList.remove('is-open'); mnav.setAttribute('aria-hidden', 'true'); $('#burger').setAttribute('aria-expanded', 'false'); }
  $('#burger').addEventListener('click', () => { mnav.classList.add('is-open'); mnav.setAttribute('aria-hidden', 'false'); $('#burger').setAttribute('aria-expanded', 'true'); });
  mnav.addEventListener('click', e => { if (e.target === mnav || e.target.closest('[data-close-mnav]') || e.target.closest('.macc__b a')) closeMnav(); });
  // announcement: duplicate for seamless loop
  (function () { const t = $('#annTrack'), g = t.firstElementChild; let k = 0; while (g.scrollWidth < innerWidth + 200 && k++ < 4) g.insertAdjacentHTML('beforeend', g.innerHTML); const c = g.cloneNode(true); c.setAttribute('aria-hidden', 'true'); t.appendChild(c); })();

  /* ================= Predictive search ================= */
  const ps = $('#ps'), psIn = $('#psIn'), psPop = $('#psPop');
  const IDX = [
    ...MASK.map(m => ({ kind: 'tape', id: m.id, name: m.n, text: (m.n + ' ' + m.s + ' masking tape ' + (m.uses || []).join(' ')).toLowerCase(), vis: visual(m), soon: m.soon, price: m.soon ? 0 : minP(tapeItems(m)) })),
    ...['protect', 'caps', 'hooks', 'screen'].flatMap(k => (CARDS[k] || []).filter(c => c.soon).map(c => ({ kind: 'soon', line: k, name: c.t, text: (c.t + ' ' + c.sub + ' ' + LINES[k].n).toLowerCase(), vis: ILL[c.ill], soon: true })))
  ];
  const PROD = CAT.filter(p => TAPE_F.includes(p.f) ? (p.s && p.k === 'Single roll') : p.k !== 'Case');
  let psSel = -1;
  function openSearch() { ps.classList.add('is-open'); psIn.setAttribute('aria-expanded', 'true'); }
  function closeSearch() { ps.classList.remove('is-open'); psIn.setAttribute('aria-expanded', 'false'); psSel = -1; }
  function runSearch() {
    const raw = psIn.value.trim().toLowerCase();
    if (!raw) {
      psPop.innerHTML = `<p class="ps__h">Popular searches</p><div class="ps__cats">${['green PET tape', 'masking dots', 'glass cloth', '1 inch', '25 mm', 'polyimide', 'netting', 'spline .185'].map(s => `<a href="#" data-ps="${esc(s)}">${icon('search')}${s}</a>`).join('')}</div><p class="ps__h">Masking tapes</p>` + MASK.filter(m => !m.soon).map(m => psRow({ kind: 'tape', id: m.id, name: m.n, vis: visual(m), price: minP(tapeItems(m)) }, '')).join('');
      return;
    }
    let q = raw.replace(/(\d+(?:\.\d+)?)\s*(?:millimetres|millimeters|mm)\b/g, '$1mm').replace(/(\d+(?:\.\d+)?)\s*(?:inches|inch|in)\b/g, '$1"').replace(/(^|\s)\.(\d)/g, '$10.$2');
    const toks = q.split(/\s+/).filter(Boolean);
    const sizeTok = [];
    const words = toks.filter(t => {
      let m = t.match(/^(\d+(?:\.\d+)?)mm$/); if (m) { sizeTok.push(+m[1] / 25.4); return false; }
      m = t.match(/^(\d+(?:\.\d+)?|\d\/\d)"$/); if (m) { sizeTok.push(frac(m[1])); return false; }
      return true;
    });
    const sizeOk = p => !sizeTok.length || (p.s && sizeTok.every(v => Math.abs(num(p.s) - v) <= Math.max(.02, v * .04)));
    const cats = IDX.filter(x => words.length && words.every(w => x.text.includes(w))).slice(0, 5);
    const prods = PROD.filter(p => { const h = (p.t + ' ' + p.f + ' ' + (p.f === 'pet' ? 'polyester green pet' : '') + ' ' + (['pet', 'dots', 'glass', 'paper'].includes(p.f) ? 'masking tape' : '')).toLowerCase(); return words.every(w => h.includes(w)) && sizeOk(p); })
      .sort((a, b) => (['pet', 'dots', 'glass', 'paper'].includes(b.f) - ['pet', 'dots', 'glass', 'paper'].includes(a.f)) || (b.a - a.a)).slice(0, 6);
    const hl = s => { let o = esc(s); words.forEach(w => { if (w.length > 1) o = o.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); }); return o; };
    let html = '';
    if (cats.length) html += `<p class="ps__h">Categories</p>` + cats.map(c => psRow(c, hl)).join('');
    if (prods.length) html += `<p class="ps__h">Products ${sizeTok.length ? `· ${sizeTok.map(v => UNIT === 'mm' ? mmNum(v) + ' mm' : (+v.toFixed(3)) + '"').join(', ')}` : ''}</p>` + prods.map(p => `<div class="ps__r" role="option" data-add="${p.h}" data-variant="${esc(p.v[0] || '')}"><img src="${im(imgFor(p))}" alt=""><span><b>${hl(short(p))}</b><small>${[p.s && fmtSize(p.s), p.k && p.k !== 'Single roll' ? fmtLen(p.k) : 'Single roll', p.a ? 'In stock' : 'Contact us'].filter(Boolean).join(' · ')}</small></span><em>${money(p.p)}</em></div>`).join('');
    if (!html) html = `<p class="ps__none">No exact match for “${esc(psIn.value)}”. <button class="tl" data-quote="${esc(psIn.value)}" data-note="Product request from search">Ask us to source it ${icon('arrow')}</button></p>`;
    else html += `<div class="ps__all"><span>${prods.length + cats.length} results</span><button class="tl" data-quote="${esc(psIn.value)}" data-note="Bulk quote from search">Bulk quote ${icon('arrow')}</button></div>`;
    psPop.innerHTML = html;
  }
  function psRow(c, hl) {
    const name = hl ? hl(c.name) : c.name;
    if (c.kind === 'tape') return `<a class="ps__r" role="option" href="#masking" data-tape="${c.id}"><span class="th">${c.vis}</span><span><b>${name}</b><small>${c.soon ? 'Masking tape · available on request' : 'Masking tape · single roll'}</small></span><em class="${c.soon ? 'q' : ''}">${c.soon ? 'Quote' : 'from ' + money(c.price)}</em></a>`;
    return `<a class="ps__r" role="option" href="#more" data-line="${c.line}"><span class="th">${c.vis}</span><span><b>${name}</b><small>${LINES[c.line].n} · available on request</small></span><em class="q">Quote</em></a>`;
  }
  psIn.addEventListener('focus', () => { runSearch(); openSearch(); });
  psIn.addEventListener('input', () => { psSel = -1; runSearch(); openSearch(); });
  psIn.addEventListener('keydown', e => {
    const rows = $$('.ps__r', psPop);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); psSel = (psSel + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length; rows.forEach((r, i) => r.classList.toggle('is-k', i === psSel)); if (rows[psSel]) rows[psSel].scrollIntoView({ block: 'nearest' }); }
    if (e.key === 'Enter') { e.preventDefault(); const r = rows[psSel >= 0 ? psSel : 0]; if (r) r.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
  });
  psPop.addEventListener('click', e => {
    const s = e.target.closest('[data-ps]'); if (s) { e.preventDefault(); psIn.value = s.dataset.ps; runSearch(); psIn.focus(); return; }
    if (e.target.closest('.ps__r, [data-quote]')) closeSearch();
  });

  /* ================= Bento categories ================= */
  $('#bento').innerHTML = [
    `<a class="bx bx--main rv" href="#masking"><span class="bx__go">${icon('arrow')}</span><b>Masking Tapes</b><small>11 tape types for powder coating, plating, paint lines and electronics — the heart of FinePS.</small><span class="bx__chips"><span>Green PET</span><span>Die-cut dots</span><span>Glass cloth</span><span>Paper</span><span>+7 on request</span></span><span class="bx__v"><img src="${im('cut-pet-lineup')}" alt="Green polyester masking tape rolls" loading="lazy"></span><span class="bt bt--ink bx__cta">Shop 11 tape types ${icon('arrow')}</span></a>`,
    `<a class="bx bx--photo rv" href="#more" data-line="protect"><img src="${im('app-red-netting')}" alt="" loading="lazy"><span class="bx__go">${icon('arrow')}</span><span class="bx__info"><b>Netting &amp; Spiral Wrap</b><small>PE netting, sleeves &amp; hose wrap</small></span></a>`,
    `<a class="bx bx--warm rv" href="#more" data-line="caps"><span class="bx__go">${icon('arrow')}</span><b>Caps &amp; Plugs</b><small>Silicone caps &amp; masking plugs</small><span class="new">New</span><span class="bx__v">${ILL.cap}</span></a>`,
    `<a class="bx bx--cool rv" href="#more" data-line="hooks"><span class="bx__go">${icon('arrow')}</span><b>Hooks</b><small>Powder-coating &amp; racking hooks</small><span class="new">New</span><span class="bx__v">${ILL.rack}</span></a>`,
    `<a class="bx bx--photo rv" href="#more" data-line="screen"><img src="${im('app-screened-porch')}" alt="" loading="lazy"><span class="bx__go">${icon('arrow')}</span><span class="bx__info"><b>Screen &amp; Spline</b><small>40+ spline sizes, tools &amp; seals</small></span></a>`
  ].join('');

  /* ================= Masking: tape rail + stage ================= */
  const LOOK = { pet: ['#DDF0E1', '#1F8A4C', 400], dots: ['#D8F1EB', '#37BFA0', 400], glass: ['#ECEFF1', '#E9EDEF', null], paper: ['#F5EEDA', '#E2D2A0', null] };
  let tapeSel = 'pet';
  const tState = {};
  function renderTabs() {
    const tab = m => `<button class="tt" role="tab" aria-selected="${m.id === tapeSel}" data-tape="${m.id}"><span class="tt__v">${visual(m)}</span><b>${m.s === 'Green PET' ? 'Green Polyester (PET)' : m.n.replace(' Tape', '')}</b><small>${m.soon ? '<span>On request</span><em class="q">Quote</em>' : `<span>${m.tShort === 'High' || m.tShort === 'Low' ? m.temp : 'Up to ' + m.tShort}</span><em>${money(minP(tapeItems(m)))}</em>`}</small></button>`;
    $('#trail').innerHTML = MASK.filter(m => !m.soon).map(tab).join('') + `<span class="tt__sep">On request</span>` + MASK.filter(m => m.soon).map(tab).join('');
  }
  function meters(m, p) {
    const L = LOOK[m.id] || [];
    const max = UNIT === 'mm' ? 152 : 6, val = UNIT === 'mm' ? num(p.s) * 25.4 : num(p.s);
    const w = Math.max(4, Math.min(100, val / max * 100));
    const temp = L[2] ? `<div class="meter"><div class="meter__h"><span>Max cure temperature</span><b>${L[2]}°F · ${Math.round((L[2] - 32) / 1.8)}°C</b></div><div class="temp"><i style="--p:${L[2] / 600 * 100}%"></i></div><div class="temp__s"><span>0°F</span><span>200°F</span><span>400°F</span><span>600°F</span></div></div>` : `<div class="meter"><div class="meter__h"><span>Temperature class</span><b>${m.temp}</b></div></div>`;
    return temp + `<div class="meter"><div class="meter__h"><span>${m.id === 'dots' ? 'Dot diameter' : 'Width'} · actual scale</span><b>${fmtSize(p.s)}</b></div><div class="wv" style="--tick:${UNIT === 'mm' ? (25.4 / 152 * 100).toFixed(2) : (100 / 6).toFixed(2)}%"><span class="wv__b" style="--w:${w}%;--tape:${L[1] || '#2E8B4F'}"></span><span class="wv__l">${UNIT === 'mm' ? '0–152 mm' : '0–6"'}</span></div></div>`;
  }
  function renderPanel() {
    const m = MK[tapeSel], P = $('#stage');
    if (m.soon) {
      P.innerHTML = `<div class="sg"><div class="sg__media" style="--wash:#F3EFE6"><div class="sg__tags"><span>Masking tape</span><span class="g">Available on request</span></div><div class="sg__img">${ILL[m.ill]}</div></div>
        <div class="sg__b"><span class="sg__k">${icon('bell')}Coming to the FinePS range</span><h3>${m.n}</h3><p>Tell us the width, length and quantity you need and we'll confirm availability and pricing — usually within one business day.</p>
        <div class="uses">${m.uses.map(u => `<span>${icon('check')}${u}</span>`).join('')}</div>
        <div class="req"><b>Request sizes &amp; pricing</b><p>Widths quoted in ${unitWord()} — switch units at the top of the page.</p>
        <div class="req__f"><input id="reqW" placeholder="Width you need, e.g. ${UNIT === 'mm' ? '25 mm' : '1 inch'}" aria-label="Width you need"><button class="bt bt--green" data-quote="${esc(m.n)}" data-vis="${m.ill}" data-note="Available on request" id="reqBtn">Request a quote ${icon('arrow')}</button></div>
        <button class="tl" data-quote="${esc(m.n)}" data-vis="${m.ill}" data-note="Notify me when in stock">${icon('bell')}Notify me when it's in stock</button></div></div></div>`;
      $('#reqW').addEventListener('input', e => { $('#reqBtn').dataset.size = e.target.value; });
      return;
    }
    const items = tapeItems(m);
    const st = tState[m.id] || (tState[m.id] = { h: (items.find(p => p.a && /^1"$/.test(p.s)) || items.find(p => p.a) || items[0]).h, q: 1 });
    const p = BY[st.h];
    P.innerHTML = `<div class="sg"><div class="sg__media" style="--wash:${(LOOK[m.id] || [])[0] || '#E6F3E1'}"><div class="sg__tags">${m.badge ? `<span class="g">${m.badge}</span>` : ''}<span>${m.temp}</span><span>${m.adh} adhesive</span></div><div class="sg__img"><img src="${im(m.id === 'pet' ? 'cut-pet-lineup' : m.id === 'dots' ? 'cut-dots-hero' : m.img)}" alt="${esc(m.n)}"></div>${meters(m, p)}</div>
      <div class="sg__b"><span class="sg__k"><span class="stars">${icon('star').repeat(5)}</span>4.8 · Trusted by finishing shops</span><h3>${m.n}</h3><p>${m.d}</p>
      <dl class="spec"><div><dt>Max temperature</dt><dd>${m.temp}</dd></div><div><dt>Adhesive</dt><dd>${m.adh}</dd></div><div><dt>Carrier</dt><dd>${m.car}</dd></div><div><dt>${m.yd ? 'Roll length' : 'Per roll'}</dt><dd>${m.yd ? fmtYd(m.yd) : dotsCount(p) || 'Varies by size'}</dd></div></dl>
      <div class="uses">${m.uses.map(u => `<span>${icon('check')}${u}</span>`).join('')}</div>
      <div class="buy">
        <div class="buy__row">
          <label class="fld"><span>${m.id === 'dots' ? 'Dot diameter' : 'Width'} <em style="font-style:normal;color:var(--mut2)">${items.length} sizes · ${unitWord()}</em></span><span class="sel"><select id="mkSize">${items.map(x => `<option value="${x.h}" ${x.h === st.h ? 'selected' : ''}>${fmtSize(x.s)}${m.id === 'dots' ? ' · ' + dotsCount(x) : ''} — ${money(x.p)}${x.a ? '' : ' (contact us)'}</option>`).join('')}</select></span></label>
          <div class="fld" style="flex:0 0 auto;min-width:0"><span>Rolls</span><div class="qty"><button type="button" data-st="-1" aria-label="Fewer rolls">${icon('minus')}</button><input id="mkQty" type="number" min="1" value="${st.q}" aria-label="Number of rolls"><button type="button" data-st="1" aria-label="More rolls">${icon('plus')}</button></div></div>
        </div>
        <div class="price"><b>${money(p.p)}</b><small>per roll · flat price</small>${p.a ? `<span class="stk"><i></i>In stock</span>` : `<span class="stk stk--o"><i></i>Contact us</span>`}</div>
        <div class="buy__cta">${p.a ? `<button class="bt bt--green bt--lg" data-add="${p.h}" data-qty="${st.q}">${icon('cart')}Add ${st.q > 1 ? st.q + ' rolls' : 'to cart'} · ${money(p.p * st.q)}</button>` : `<button class="bt bt--green bt--lg" data-quote="${esc(m.n)}" data-size="${esc(fmtSize(p.s))}" data-vis="${m.img}" data-note="Out of stock — we'll confirm availability">${icon('chat')}Contact us for this size</button>`}<button class="bt bt--line bt--lg" data-quote="${esc(m.n)}" data-size="${esc(fmtSize(p.s))}" data-vis="${m.img}">${icon('file')}Bulk quote</button></div>
        ${st.q >= 10 ? `<p class="mini">${icon('chat')}<span>Buying ${st.q} rolls? You may qualify for bulk pricing — <button data-quote="${esc(m.n)}" data-size="${esc(fmtSize(p.s))}" data-vis="${m.img}">request a quote</button>.</span></p>` : `<div class="assure"><span>${icon('truck')}Ships to 50 states</span><span>${icon('return')}30-day returns</span><span>${icon('lock')}Secure checkout</span></div>`}
      </div></div></div>`;
    $('#mkSize').addEventListener('change', e => { st.h = e.target.value; renderPanel(); });
    const setQ = v => { st.q = Math.max(1, Math.min(999, v | 0 || 1)); renderPanel(); };
    $$('[data-st]', P).forEach(b => b.addEventListener('click', () => setQ(st.q + +b.dataset.st)));
    $('#mkQty').addEventListener('change', e => setQ(+e.target.value));
  }
  function selTape(id) { tapeSel = id; renderTabs(); renderPanel(); const t = $(`.tt[data-tape="${id}"]`); if (t) t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' }); }
  $('#trail').addEventListener('keydown', e => {
    if (!/Arrow(Left|Right)/.test(e.key)) return; e.preventDefault();
    const tabs = $$('.tt', $('#trail')), i = tabs.findIndex(t => t.dataset.tape === tapeSel), n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    selTape(n.dataset.tape); $(`.tt[data-tape="${n.dataset.tape}"]`).focus();
  });
  function renderCompare() {
    $('#cmpT').innerHTML = `<thead><tr><th>Tape</th><th>Max temp</th><th>Adhesive</th><th>Carrier</th><th>Roll length</th><th>Widths (${UNIT === 'mm' ? 'mm' : 'in'})</th><th>From</th></tr></thead><tbody>` + MASK.map(m => {
      const it = tapeItems(m);
      return `<tr data-tape="${m.id}" tabindex="0"><td>${visual(m)}${m.n}</td>${m.soon ? '<td class="m" colspan="4">Specifications on request</td><td class="m">On request</td>' : `<td>${m.temp}</td><td>${m.adh}</td><td>${m.car}</td><td>${m.yd ? fmtYd(m.yd) : 'Varies'}</td><td>${it.map(x => fmtSize(x.s).replace(' mm', '')).join(', ')}</td>`}<td>${m.soon ? '<span class="tl">Quote</span>' : `<b>${money(minP(it))}</b>`}</td></tr>`;
    }).join('') + '</tbody>';
  }
  $('#cmpT').addEventListener('click', e => { const r = e.target.closest('tr[data-tape]'); if (r) $('#stage').scrollIntoView({ behavior: 'smooth', block: 'center' }); });

  /* ================= Hero: quick order, rotating word, gauge, parallax ================= */
  let qoSel = 'pet';
  const qoState = {};
  function renderQo() {
    $('#qoTabs').innerHTML = MASK.filter(m => !m.soon).map(m => `<button type="button" class="qo__t" role="tab" aria-selected="${m.id === qoSel}" data-qo="${m.id}"><img src="${im(m.img)}" alt="">${m.s}</button>`).join('');
    const m = MK[qoSel], items = tapeItems(m).filter(p => p.a);
    const h = qoState[qoSel] || (qoState[qoSel] = (items.find(p => /^1"$/.test(p.s)) || items[0]).h);
    $('#qoLbl').textContent = (m.id === 'dots' ? 'Dot diameter' : 'Width') + ' (' + (UNIT === 'mm' ? 'mm' : 'in') + ')';
    $('#qoSize').innerHTML = items.map(p => `<option value="${p.h}" ${p.h === h ? 'selected' : ''}>${fmtSize(p.s)}${m.id === 'dots' ? ' · ' + dotsCount(p) : m.yd ? ' × ' + fmtYd(m.yd) : ''}</option>`).join('');
    $('#qoPrice').textContent = money(BY[h].p);
  }
  $('#qoTabs').addEventListener('click', e => { const b = e.target.closest('[data-qo]'); if (b) { qoSel = b.dataset.qo; renderQo(); } });
  $('#qoSize').addEventListener('change', e => { qoState[qoSel] = e.target.value; $('#qoPrice').textContent = money(BY[e.target.value].p); });
  $('#qo').addEventListener('submit', e => {
    e.preventDefault(); const h = qoState[qoSel]; addToCart(h, 1, '');
    const b = $('#qoAdd'); b.classList.add('is-done'); b.innerHTML = icon('check') + 'Added'; setTimeout(() => { b.classList.remove('is-done'); b.innerHTML = icon('cart') + 'Add'; }, 1400);
  });
  (function rotate() {
    const W = ['powder coating', 'Cerakote', 'anodizing & plating', 'paint lines', 'sublimation', 'flame spray'];
    let i = 0; const el = $('#rotW');
    setInterval(() => { el.classList.add('out'); setTimeout(() => { i = (i + 1) % W.length; el.textContent = W[i]; el.classList.remove('out'); }, 350); }, 2600);
  })();
  function heroUnits() { $('#chipW').textContent = UNIT === 'mm' ? '25 mm ≈ 1"' : '1" = 25.4 mm'; }
  (function gauge() {
    const run = () => { $('#gArc').style.strokeDashoffset = 100 - 400 / 600 * 100; const t0 = performance.now(); const tick = t => { const k = Math.min(1, (t - t0) / 1600), v = Math.round(400 * (1 - Math.pow(1 - k, 3))); $('#gNum').textContent = v + '°F'; if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
    setTimeout(run, 700);
  })();
  if (fine.matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const hv = $('#heroV');
    $('.hero__stage').addEventListener('mousemove', e => { const r = hv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; $$('[data-depth]', hv).forEach(el => { const d = +el.dataset.depth; el.style.transform = `translate(${x * d}px,${y * d}px)`; }); });
  }

  /* ================= More product lines ================= */
  let lineSel = 'protect';
  const lState = {};
  $('#moreTabs').innerHTML = ['protect', 'caps', 'hooks', 'screen'].map(k => `<button role="tab" aria-selected="${k === lineSel}" data-line="${k}">${icon(LINES[k].ic)}${LINES[k].n}${LINES[k].isNew ? ' <span class="new">New</span>' : ''}</button>`).join('');
  function cardItems(c) { return (c.filt ? famAll(c.fam).filter(c.filt) : famAll(c.fam)).filter(p => p.k !== 'Case'); }
  function card(c, i) {
    if (c.soon) return `<article class="pc" style="animation-delay:${i * 70}ms"><div class="pc__m"><span class="new">Coming soon</span>${ILL[c.ill]}</div><div class="pc__b"><h3 class="pc__t">${c.t}</h3><p class="pc__s">${c.sub}</p><p class="pc__s" style="margin:0">Sizes in ${unitWord()} on request.</p><div class="pc__f"><div class="pc__p">Quote<small>Bulk &amp; single orders</small></div><button class="add add--q" data-quote="${esc(c.t)}" data-vis="${c.ill}" data-note="Available on request">${icon('chat')}Request</button></div></div></article>`;
    const key = lineSel + i, items = cardItems(c);
    const st = lState[key] || (lState[key] = (() => { const p = items.find(x => x.a && (!c.def || x.s === c.def)) || items.find(x => x.a) || items[0]; return { s: p.s, k: p.k, v: (p.v || [])[0] || '' }; })());
    const sizes = [...new Set(items.map(p => p.s).filter(Boolean))].sort((a, b) => num(a) - num(b));
    const lens = [...new Set(items.filter(p => p.s === st.s).map(p => p.k).filter(Boolean))];
    if (st.k && !lens.includes(st.k)) st.k = lens[0];
    const p = items.find(x => (!st.s || x.s === st.s) && (!st.k || x.k === st.k)) || items[0];
    const sel = (key2, label, opts, cur, fmt) => opts.length > 1 ? `<label class="fld"><span>${label}</span><span class="sel"><select data-k="${key2}" data-card="${key}">${opts.map(o => `<option value="${esc(o)}" ${o === cur ? 'selected' : ''}>${fmt(o)}</option>`).join('')}</select></span></label>` : '';
    return `<article class="pc" style="animation-delay:${i * 70}ms"><div class="pc__m">${c.badge ? `<span class="bd">${c.badge}</span>` : ''}<img src="${im(imgFor(p))}" alt="${esc(c.t)}" loading="lazy"></div><div class="pc__b"><h3 class="pc__t">${c.t}</h3><p class="pc__s">${c.sub}</p>
      ${sel('s', c.lbl.s || 'Size', sizes, st.s, fmtSize)}${sel('k', c.lbl.k || 'Length', lens, st.k, fmtLen)}${c.lbl.v && p.v.length > 1 ? sel('v', 'Color', p.v, st.v, x => x) : ''}
      <div class="pc__f"><div class="pc__p">${money(p.p)}<small>${p.k ? fmtLen(p.k) : 'Each'}</small></div>${p.a ? `<button class="add" data-add="${p.h}" data-variant="${esc(c.lbl.v ? st.v : '')}">${icon('plus')}Add</button>` : `<button class="add add--q" data-quote="${esc(c.t)}" data-size="${esc(fmtSize(p.s))}" data-vis="${imgFor(p)}" data-note="Out of stock — we'll confirm availability">${icon('chat')}Contact us</button>`}</div></div></article>`;
  }
  function renderMore() {
    const L = LINES[lineSel];
    $$('#moreTabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.line === lineSel));
    $('#moreBody').innerHTML = `<div class="more__intro ${L.photo ? '' : 'more__intro--ill'}">${L.photo ? `<img src="${im(L.photo)}" alt="" loading="lazy">` : ILL[L.ill]}${L.isNew ? '<span class="new" style="align-self:flex-start">New line</span>' : ''}<b>${L.n}</b><p>${L.intro}</p><button class="tl" data-quote="${esc(L.n)}" data-note="Bulk & volume pricing">${L.isNew ? 'Request sizes & pricing' : 'Get bulk pricing'} ${icon('arrow')}</button></div>` + CARDS[lineSel].map(card).join('');
  }
  function selLine(k) { lineSel = k; renderMore(); }
  $('#moreBody').addEventListener('change', e => {
    const s = e.target.closest('select[data-card]'); if (!s) return;
    lState[s.dataset.card][s.dataset.k] = s.value; renderMore();
  });

  /* ================= Industries (interactive) ================= */
  let ixSel = 0;
  $('#ixList').innerHTML = INDS.map((d, i) => `<li><button class="ixl" role="tab" aria-selected="${i === 0}" data-ix="${i}"><span>0${i + 1}</span><b>${d.n}</b>${icon('arrow')}</button></li>`).join('');
  function renderIx() {
    const d = INDS[ixSel];
    $$('.ixl').forEach((b, i) => b.setAttribute('aria-selected', i === ixSel));
    const recs = d.rec.map(([t, id]) => {
      if (t === 'tape') { const m = MK[id]; return `<a href="#masking" data-tape="${id}"><span class="th">${visual(m)}</span><span><b>${m.n.replace(' Tape', '')}</b><small>${m.soon ? 'Available on request' : 'from ' + money(minP(tapeItems(m))) + ' / roll'}</small></span></a>`; }
      const L = LINES[id]; return `<a href="#more" data-line="${id}"><span class="th">${L.img ? `<img src="${im(L.img)}" alt="">` : ILL[L.ill]}</span><span><b>${L.n}</b><small>${L.isNew ? 'New line' : L.d}</small></span></a>`;
    }).join('');
    $('#ixStage').innerHTML = `<img src="${im(d.img)}" alt="${esc(d.n)}"><div class="ixc"><div class="ixc__h"><div><b>${d.n}</b><p>${d.d}</p></div><button class="bt bt--ink bt--sm" data-quote="${esc(d.n)} supplies" data-note="Industry supply quote">Get a quote ${icon('arrow')}</button></div><div class="ixc__r">${recs}</div></div>`;
  }
  $('#ixList').addEventListener('click', e => { const b = e.target.closest('[data-ix]'); if (b) { ixSel = +b.dataset.ix; renderIx(); } });
  $('#ixList').addEventListener('mouseover', e => { const b = e.target.closest('[data-ix]'); if (b && fine.matches && +b.dataset.ix !== ixSel) { ixSel = +b.dataset.ix; renderIx(); } });

  /* ================= Reviews ================= */
  const RV = [
    { n: 'Luis T.', r: 'Powder coater · Houston, TX', d: 'Oct 2026', t: 'Holds through the cure, peels clean', b: 'The green PET tape holds through the whole cure cycle and peels off clean. Being able to buy single rolls in odd widths is a game changer.', p: 'green-pet-tape-1-inch-x-72-yard-single-roll' },
    { n: 'Rosa M.', r: 'Paint line supervisor · Phoenix, AZ', d: 'Oct 2026', t: 'Dots save us real time', b: 'Masking dots go on in seconds and survive the oven. Our masking time on threaded holes dropped noticeably.', p: 'green-dots-2-inch-x-1-000-dots-single-roll' },
    { n: 'Dana K.', r: 'Operations lead · CNC shop, OH', d: 'Sep 2026', t: 'Zero scratch complaints', b: 'We wrap shafts and valve bodies before shipping. Not one scratch complaint since moving to FinePS netting.', p: 'poly200green-net' },
    { n: 'Kevin P.', r: 'Electrical contractor · Atlanta, GA', d: 'Sep 2026', t: 'Glass cloth that doesn’t quit', b: 'Strong, clean glass cloth tape for coil wrapping. The mm sizing made matching our spec sheet easy.', p: 'glass-cloth-tape-2-inch-x-32-yard-single-roll' },
    { n: 'Sam R.', r: 'Body shop owner · Tampa, FL', d: 'Aug 2026', t: 'Sharp lines, no residue', b: 'Paper masking that lifts off without leaving glue behind. Reordering by the roll is simple.', p: 'low-temperature-paper-masking-tape-1-inch-x-54-yard-single-roll' },
    { n: 'Mike R.', r: 'Screen contractor · Tampa, FL', d: 'Aug 2026', t: 'The size nobody else stocks', b: 'Found .175 spline for older pool-cage frames. Rolls in clean, and support answered my sizing question the same day.', p: '0-175-inch-window-screen-spline' }
  ];
  const STARS = icon('star').repeat(5);
  $('#rsStars').innerHTML = STARS;
  const rail = $('#rvRail');
  rail.innerHTML = RV.map(r => { const p = BY[r.p]; return `<article class="rq"><div class="rq__top"><span class="stars">${STARS}</span><span>${r.d}</span></div><h3>${r.t}</h3><p>“${r.b}”</p>${p ? `<div class="rq__p"><img src="${im(imgFor(p))}" alt=""><span><small>Purchased</small>${short(p).slice(0, 42)}${short(p).length > 42 ? '…' : ''}</span></div>` : ''}<div class="rq__w"><span class="av">${r.n.replace('.', '').split(' ').map(w => w[0]).join('')}</span><span><b>${r.n}</b><small>${r.r}</small></span><span class="vb">${icon('check')}Verified</span></div></article>`; }).join('');
  (function () {
    let d = null;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; d = { x: e.clientX, s: rail.scrollLeft, m: false }; });
    addEventListener('pointermove', e => { if (!d) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 4) { d.m = true; rail.classList.add('is-drag'); } rail.scrollLeft = d.s - dx; });
    addEventListener('pointerup', () => { if (!d) return; const m = d.m; d = null; rail.classList.remove('is-drag'); if (m) { const w = rail.firstElementChild.offsetWidth + 16; rail.scrollTo({ left: Math.round(rail.scrollLeft / w) * w, behavior: 'smooth' }); } });
    const upd = () => { const max = rail.scrollWidth - rail.clientWidth, w = rail.clientWidth / rail.scrollWidth, b = $('#rvProg'); b.style.width = w * 100 + '%'; b.style.left = (max ? rail.scrollLeft / max * (1 - w) * 100 : 0) + '%'; $$('.arw__b').forEach(x => x.disabled = +x.dataset.dir < 0 ? rail.scrollLeft < 4 : rail.scrollLeft > max - 4); };
    rail.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); setTimeout(upd, 60);
    $$('.arw__b').forEach(b => b.addEventListener('click', () => rail.scrollBy({ left: +b.dataset.dir * (rail.firstElementChild.offsetWidth + 16), behavior: 'smooth' })));
    rail.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') rail.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * (rail.firstElementChild.offsetWidth + 16), behavior: 'smooth' }); });
  })();
  $('#allReviews').addEventListener('click', e => { e.preventDefault(); toast('Prototype: opens the full reviews page'); });

  /* ================= FAQ ================= */
  $('#qa').addEventListener('click', e => { const b = e.target.closest('.q>button'); if (!b) return; const q = b.parentElement, on = !q.classList.contains('is-open'); $$('#qa .q').forEach(x => { x.classList.remove('is-open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); }); if (on) { q.classList.add('is-open'); b.setAttribute('aria-expanded', 'true'); } });

  /* ================= Newsletter ================= */
  $('#nl').addEventListener('submit', e => { e.preventDefault(); $('#nl .nl__ok').hidden = false; $('#nlE').value = ''; });

  /* ================= Footer wordmark ================= */
  const wm = $('#wm'), L = $$('span', wm);
  const hot = i => L.forEach((l, j) => { l.classList.toggle('is-hot', j === i); l.classList.toggle('is-near', Math.abs(j - i) === 1); });
  wm.addEventListener('mousemove', e => { let b = 0, bd = 1e9; L.forEach((l, j) => { const r = l.getBoundingClientRect(), dd = Math.abs(e.clientX - (r.left + r.width / 2)); if (dd < bd) { bd = dd; b = j; } }); hot(b); });
  wm.addEventListener('mouseleave', () => hot(-9));
  const wio = new IntersectionObserver(es => es.forEach(en => { if (!en.isIntersecting) return; wio.unobserve(wm); L.forEach((l, j) => setTimeout(() => hot(j), 150 * j)); setTimeout(() => hot(-9), 150 * L.length + 300); }), { threshold: .5 });
  wio.observe(wm);

  /* ================= Unit switch ================= */
  function renderUnits() {
    $$('.unit').forEach(u => u.dataset.u = UNIT);
    $$('.unit button').forEach(b => b.setAttribute('aria-checked', b.dataset.unit === UNIT));
    renderPanel(); renderCompare(); renderMore(); renderCart(); renderQo(); heroUnits();
    if (ps.classList.contains('is-open')) runSearch();
  }
  $$('.unit').forEach(u => u.addEventListener('click', e => {
    const b = e.target.closest('[data-unit]'); if (!b || b.dataset.unit === UNIT) return;
    UNIT = b.dataset.unit; try { localStorage.setItem('fineps-unit', UNIT); } catch (er) {}
    renderUnits(); toast(`Showing sizes in ${UNIT === 'mm' ? 'millimetres' : 'inches'}`);
  }));

  /* ================= Scroll effects: reveal, counters, process line ================= */
  const count = el => { const to = +el.dataset.to, dec = +(el.dataset.dec || 0), suf = el.dataset.suf || '', t0 = performance.now(); const tick = t => { const k = Math.min(1, (t - t0) / 1500), v = to * (1 - Math.pow(1 - k, 3)); el.textContent = v.toFixed(dec) + suf; if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
  const io = new IntersectionObserver(es => es.forEach(en => { if (!en.isIntersecting) return; const t = en.target; io.unobserve(t); if (t.dataset.to) count(t); else t.classList.add('in'); }), { rootMargin: '0px 0px -10% 0px' });
  $$('[data-to]').forEach(el => io.observe(el));
  $$('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 5) * 80 + 'ms'; io.observe(el); });
  const steps = $$('.step'), fill = $('#stepsFill'), stepsBox = $('#steps');
  const onProc = () => {
    const r = stepsBox.getBoundingClientRect(), p = Math.max(0, Math.min(1, (innerHeight * .75 - r.top) / (r.height * .8)));
    fill.style.setProperty('--p', p); steps.forEach((s, i) => s.classList.toggle('on', p >= i / steps.length + .05));
  };
  addEventListener('scroll', onProc, { passive: true }); onProc();
  $('#drShip').innerHTML = `${icon('truck')} Free Regular Shipping (8–10 days) on eligible orders`;
  $('#drShip').style.display = 'flex'; $('#drShip').style.gap = '10px'; $('#drShip').style.alignItems = 'center';

  /* ================= Init ================= */
  buildNav();
  renderTabs(); renderIx(); renderUnits();
})();
