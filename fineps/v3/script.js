/* FinePS homepage — Version 3 (revision after call #3) */
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

  /* ---------- extra illustrations ---------- */
  const hook = d => `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><path d="${d}" fill="none" stroke="#6F7A81" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  Object.assign(ILL, {
    blue: roll('#2F6FE0', '#2254AE'), red: roll('#D64A33', '#AE3522'), clear: roll('#E6F0F4', '#C7D6DD'), sand: roll('#F4F4F0', '#D9D9D2'), ptfe: roll('#EDEDE8', '#CFCFC7'), copper: roll('#D2894A', '#A9692F'),
    disc: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><g fill="#4CB24F"><circle cx="40" cy="44" r="18"/><circle cx="82" cy="44" r="14" opacity=".8"/><circle cx="58" cy="82" r="16" opacity=".9"/></g></svg>`,
    donut: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><g fill="none" stroke="#4CB24F" stroke-width="12"><circle cx="42" cy="46" r="18"/><circle cx="80" cy="78" r="16" opacity=".8"/></g></svg>`,
    square: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><g fill="#4CB24F"><rect x="20" y="24" width="38" height="38" rx="5"/><rect x="66" y="30" width="34" height="22" rx="5" opacity=".8"/><rect x="40" y="70" width="44" height="26" rx="5" opacity=".9"/></g></svg>`,
    pulldisc: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><circle cx="54" cy="60" r="28" fill="#4CB24F"/><path d="M78 52h24v16H78" fill="#7CCB7E"/></svg>`,
    flangecap: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="98" rx="40" ry="9" fill="#C04A33"/><path d="M40 40h40v56H40Z" fill="#D6533A"/><ellipse cx="60" cy="40" rx="20" ry="7" fill="#E8735B"/></svg>`,
    vinylcap: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><path d="M38 34h44v56c0 6-10 10-22 10s-22-4-22-10Z" fill="#2F6FE0"/><ellipse cx="60" cy="34" rx="22" ry="7" fill="#6A9BE6"/></svg>`,
    flangeplug: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="34" rx="32" ry="9" fill="#E0A32E"/><path d="M44 36h32l-6 62H50Z" fill="#E9B54C"/></svg>`,
    hollow: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><path d="M38 30h44l-10 70H48Z" fill="#D6533A"/><ellipse cx="60" cy="30" rx="22" ry="7" fill="#E8735B"/><ellipse cx="60" cy="30" rx="10" ry="3.5" fill="#8E2E1E"/></svg>`,
    tube: `<svg class="ill" viewBox="0 0 120 120" aria-hidden="true"><path d="M20 80c20-40 60-40 80-10" fill="none" stroke="#D6533A" stroke-width="14" stroke-linecap="round"/><path d="M20 80c20-40 60-40 80-10" fill="none" stroke="#F0A08F" stroke-width="5" stroke-linecap="round"/></svg>`,
    chook: hook('M60 14v20a22 22 0 1 1-22 22'), vhook: hook('M60 14v30l-22 40M60 44l22 40'), twist: hook('M60 14v44M60 58h24v24'), snap: hook('M48 20h24v52a12 12 0 1 1-24 0V40'),
    spring: hook('M60 12v14m0 0c10 0 10 8 0 8s-10 8 0 8 10 8 0 8-10 8 0 8v20a12 12 0 1 1-20 6'), claw: hook('M60 14v40M60 54l-22 30M60 54l22 30M60 54v34'), ss: hook('M60 14v56a16 16 0 1 1-32 0'), shook2: ILL.shook
  });

  /* ================= Masking tape types ================= */
  const MASK = [
    { id: 'pet', n: 'Green Polyester (PET) Tape', s: 'Green PET', fam: 'pet', img: 'cut-green-tape', temp: 'Up to 400°F (204°C)', adh: 'Silicone', yd: 72, badge: 'Best seller', thick: true,
      d: 'High-temperature polyester tape with silicone adhesive for powder coating, Cerakote, plating and anodizing. Removes cleanly with no residue.' },
    { id: 'glass', n: 'Glass Cloth Tape', s: 'Glass Cloth', fam: 'glass', img: 'cut-glass-cloth', temp: 'High temperature', adh: 'Silicone', yd: 32,
      d: 'Strong, tear-resistant glass cloth with silicone adhesive for high-heat masking, flame and plasma spray, and electrical insulation.' },
    { id: 'paper', n: 'Paper Masking Tape', s: 'Paper', fam: 'paper', img: 'cut-paper-tape', temp: 'Low temperature', adh: 'Water-based', yd: 54,
      d: 'Crepe paper masking tape with strong hold and clean removal for painting and general finishing work.' },
    { id: 'polyimide', n: 'Polyimide Tape', s: 'Polyimide', ill: 'polyimide', soon: true, opts: '1, 2, 3 & 5 mil' },
    { id: 'blue', n: 'Blue Polyester Tape', s: 'Blue Polyester', ill: 'blue', soon: true, opts: '1, 2 & 5 mil' },
    { id: 'hpaper', n: 'High-Temp Paper Masking Tape', s: 'High-Temp Paper', ill: 'hpaper', soon: true },
    { id: 'vinyl', n: 'Yellow Plating Vinyl Tape', s: 'Plating Vinyl', ill: 'vinyl', soon: true },
    { id: 'red', n: 'Red High-Tack Polyester Tape', s: 'Red High-Tack', ill: 'red', soon: true },
    { id: 'clear', n: 'Clear High-Temp Tape', s: 'Clear High-Temp', ill: 'clear', soon: true },
    { id: 'sand', n: 'Sand Blasting Tape', s: 'Sand Blasting', ill: 'sand', soon: true },
    { id: 'ptfe', n: 'PTFE Tape', s: 'PTFE', ill: 'ptfe', soon: true },
    { id: 'copper', n: 'Copper Foil Tape', s: 'Copper Foil', ill: 'copper', soon: true }
  ];
  const MK = Object.fromEntries(MASK.map(m => [m.id, m]));
  const tapeItems = m => m.soon ? [] : singles(m.fam).sort((a, b) => num(a.s) - num(b.s));
  const dotsCount = p => { const m = p.t.match(/x\s*([\d,]+)\s*Dots/i); return m ? m[1] + ' dots / roll' : ''; };

  /* ================= Other product lines ================= */
  const LINES = {
    diecut: { n: 'Die-Cut Dots & Shapes', short: 'Die-Cuts', d: 'Masking dots, discs, donuts & custom shapes', img: 'cut-dots-hero',
      cards: [{ t: 'Green Masking Dots', sub: 'Pre-cut polyester discs · up to 400°F', fam: 'dots', lbl: { s: 'Dot diameter' }, badge: 'In stock' }],
      range: [['Green Discs', 'disc'], ['Green Donuts (Washer Dots)', 'donut'], ['Squares & Rectangles', 'square'], ['Discs with Pull Tab', 'pulldisc'], ['Polyimide Discs', 'disc'], ['Plating & Anodizing Discs', 'disc'], ['Custom Die-Cut Shapes', 'diecut']] },
    protect: { n: 'Netting & Spiral Wrap', short: 'Netting & Wrap', d: 'PE netting, sleeves & hose wrap', img: 'cut-netting-red',
      cards: [
        { t: 'Heavy-Duty PE Netting', sub: 'Expandable stretch-fit spools', fam: 'netting', filt: p => num(p.s) >= 2, lbl: { s: 'Stretch range' }, badge: 'Bulk spool' },
        { t: 'Protective Mesh Sleeves', sub: 'For small parts & threads', fam: 'netting', filt: p => num(p.s) < 2, lbl: { s: 'Stretch range' } },
        { t: 'Spiral Cable & Hose Wrap', sub: 'Polyethylene · black or yellow', fam: 'spiral', lbl: { s: 'Size', k: 'Length', v: 'Color' } }] },
    caps: { n: 'Caps & Plugs', short: 'Caps & Plugs', d: 'Silicone caps, plugs, tubing & cord', ill: 'cap', isNew: true,
      range: [['Silicone Caps', 'cap'], ['Silicone Flange Caps', 'flangecap'], ['Pull-Tab Vinyl Caps', 'vinylcap'], ['Silicone Tapered Plugs', 'plug'], ['Tapered Plugs with Handles', 'pulltab'], ['Silicone Pull Plugs', 'pulltab'], ['Silicone Flange Plugs', 'flangeplug'], ['Hollow Core Plugs', 'hollow'], ['Silicone Tubing & Cord', 'tube']] },
    hooks: { n: 'Hooks', short: 'Hooks', d: 'Powder-coating & racking hooks', ill: 'rack', isNew: true,
      range: [['S Hooks', 'shook'], ['C Hooks', 'chook'], ['V Hooks', 'vhook'], ['90° Twist Hooks', 'twist'], ['Snap Hooks', 'snap'], ['Spring Hooks', 'spring'], ['Claw Hooks', 'claw'], ['Stainless Steel Hooks', 'ss'], ['Racking & Multi-Hooks', 'rack']] },
    screen: { n: 'Screen & Spline', short: 'Screen & Spline', d: '40+ spline sizes, tools & bug seals', img: 'cut-round-spline',
      cards: [
        { t: 'Round Retainer Spline', sub: 'Serrated black vinyl', fam: 'spline', lbl: { s: 'Diameter', k: 'Length' }, def: '0.185', badge: 'Best seller' },
        { t: 'Flat Screen Spline', sub: 'Pool cages & patio enclosures', fam: 'flat', lbl: { s: 'Width', k: 'Length' } },
        { t: 'Screen Roller Tool', sub: 'Steel bearing wheels', fam: 'tool', lbl: {} }] }
  };
  const LINE_ORDER = ['diecut', 'protect', 'caps', 'hooks', 'screen'];
  const INDS = [
    { n: 'Powder coating', img: 'app-machined-parts', d: 'Clean edges through every cure.', rec: [['tape', 'pet'], ['line', 'diecut'], ['line', 'caps'], ['line', 'hooks']] },
    { n: 'Plating & anodizing', img: 'app-shaft-netting', d: 'Masking that holds in the bath.', rec: [['tape', 'vinyl'], ['tape', 'pet'], ['line', 'caps']] },
    { n: 'Paint & auto refinish', img: 'app-gear-netting', d: 'Sharp lines, no residue.', rec: [['tape', 'paper'], ['tape', 'hpaper']] },
    { n: 'Electronics', img: 'app-cable-wrap', d: 'Insulation, PCB and cable work.', rec: [['tape', 'polyimide'], ['tape', 'glass'], ['tape', 'copper']] },
    { n: 'Machining & packaging', img: 'app-red-netting', d: 'Ship parts without a scratch.', rec: [['line', 'protect'], ['tape', 'pet']] },
    { n: 'Window & door', img: 'app-screened-porch', d: 'Screens that stay tight.', rec: [['line', 'screen']] }
  ];

  /* ================= Unit toggle (next to sizes) ================= */
  const ut = () => `<span class="ut" role="group" aria-label="Units"><button type="button" data-unit="in" aria-pressed="${UNIT === 'in'}">in</button><button type="button" data-unit="mm" aria-pressed="${UNIT === 'mm'}">mm</button></span>`;

  /* ================= Toast & cart ================= */
  let tT;
  const toast = m => { const t = $('#toast'); t.innerHTML = icon('check') + m; t.classList.add('is-on'); clearTimeout(tT); tT = setTimeout(() => t.classList.remove('is-on'), 2600); };
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
    if (ctx && ctx.name) { pr.hidden = false; pr.innerHTML = `${ctx.vis || ''}<span><b>${ctx.name}</b><small>${ctx.note || 'Bulk, corporate & government pricing'}</small></span>`; $('#qfProduct').value = ctx.name + (ctx.size ? ' — ' + ctx.size : ''); }
    else { pr.hidden = true; $('#qfProduct').value = ''; }
    md.classList.add('is-open'); md.setAttribute('aria-hidden', 'false');
    setTimeout(() => $('#qf input[name=name]').focus(), 80);
  }
  const closeQuote = () => { md.classList.remove('is-open'); md.setAttribute('aria-hidden', 'true'); };
  md.addEventListener('click', e => { if (e.target === md || e.target.closest('[data-close-quote]')) closeQuote(); });
  $('#qfType').addEventListener('click', e => { const b = e.target.closest('button'); if (b) $$('button', $('#qfType')).forEach(x => x.classList.toggle('is-on', x === b)); });
  $('#qf').addEventListener('submit', e => {
    e.preventDefault(); let ok = true;
    $$('#qf input[required]').forEach(i => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.classList.toggle('is-err', bad); if (bad) ok = false; });
    if (ok) $('#qf .md__ok').hidden = false; else toast('Please add your name and a valid email');
  });

  /* ================= Global clicks ================= */
  document.addEventListener('click', e => {
    const u = e.target.closest('[data-unit]');
    if (u) { e.preventDefault(); if (u.dataset.unit !== UNIT) { UNIT = u.dataset.unit; try { localStorage.setItem('fineps-unit', UNIT); } catch (er) {} renderAll(); } return; }
    const a = e.target.closest('[data-add]');
    if (a) { e.preventDefault(); addToCart(a.dataset.add, +(a.dataset.qty || 1), a.dataset.variant || ''); if (a.classList.contains('add')) { const o = a.innerHTML; a.classList.add('is-done'); a.innerHTML = icon('check') + 'Added'; setTimeout(() => { a.classList.remove('is-done'); a.innerHTML = o; }, 1300); } return; }
    const q = e.target.closest('[data-quote]');
    if (q) { e.preventDefault(); const d = q.dataset; openQuote(d.quote ? { name: d.quote, size: d.size, note: d.note, vis: d.vis ? (ILL[d.vis] || `<img src="${im(d.vis)}" alt="">`) : '' } : null); return; }
    const t = e.target.closest('[data-tape]');
    if (t && MK[t.dataset.tape]) selTape(t.dataset.tape);
    const l = e.target.closest('[data-line]');
    if (l && LINES[l.dataset.line]) selLine(l.dataset.line);
  });

  /* ================= Header menus ================= */
  const nvUl = $('#nvUl');
  const menuLink = x => `<a class="mm__l" href="${x.href}" ${x.attr || ''}><span class="th">${x.vis}</span><span><b>${x.n}${x.isNew ? ' <span class="new">New</span>' : ''}</b><small>${x.d}</small></span></a>`;
  function buildNav() {
    const maskLinks = MASK.map(m => ({ n: m.n.replace(' Tape', ''), d: m.soon ? 'Available on request' + (m.opts ? ' · ' + m.opts : '') : 'from ' + money(minP(tapeItems(m))) + ' / roll', vis: visual(m), href: '#masking', attr: `data-tape="${m.id}"` }));
    const lineLinks = k => { const L = LINES[k]; return [...(L.cards || []).map(c => ({ n: c.t, d: c.sub, vis: `<img src="${im(imgFor(cardItems(c)[0]))}" alt="">`, href: '#more', attr: `data-line="${k}"` })), ...(L.range || []).map(([n, ill]) => ({ n, d: 'Available on request', vis: ILL[ill], href: '#more', attr: `data-line="${k}"` }))]; };
    const mega = (title, links, promo) => `<div class="mm"><div class="w mm__in"><div><div class="mm__h"><b>${title}</b></div><div class="mm__g">${links.map(menuLink).join('')}</div></div>${promo}</div></div>`;
    const promo = (h, s, vis, btn, attr) => `<div class="mm__p"><b>${h}</b><small>${s}</small>${vis}<button class="bt bt--dark bt--sm" ${attr}>${btn}</button></div>`;
    const items = [
      { n: 'Masking Tapes', main: true, panel: mega('Masking tapes', maskLinks, promo('Not sure which tape?', 'Tell us your coating and cure temperature.', `<img src="${im('cut-green-tape')}" alt="">`, 'Ask our team', 'data-quote="Masking tape recommendation"')) },
      ...LINE_ORDER.map(k => ({ n: LINES[k].n, isNew: LINES[k].isNew, panel: mega(LINES[k].n, lineLinks(k), promo('Bulk & government orders', 'Deeper pricing on larger quantities.', LINES[k].img ? `<img src="${im(LINES[k].img)}" alt="">` : ILL[LINES[k].ill], 'Request a quote', `data-quote="${esc(LINES[k].n)}"`)) })),
      { n: 'Industries', panel: mega('Shop by industry', INDS.map(i => ({ n: i.n, d: i.d, vis: `<img src="${im(i.img)}" alt="" style="width:50px;height:50px;object-fit:cover">`, href: '#industries' })), promo('One supplier', 'For coating, plating, packaging and screens.', `<img src="${im('cut-glass-cloth')}" alt="">`, 'Talk to sales', 'data-quote="Industry supply"')) }
    ];
    nvUl.innerHTML = items.map(x => `<li class="nv__i" data-menu><button class="nv__b ${x.main ? 'nv__b--main' : ''}" aria-expanded="false">${x.n}${x.isNew ? ' <span class="new">New</span>' : ''}${icon('chev', 'ic chev')}</button>${x.panel}</li>`).join('') +
      `<li class="nv__sp"></li><li class="nv__i"><button class="nv__b nv__b--q" data-quote="">${icon('file')}Bulk Quotes</button></li>`;
    $('#mnavList').innerHTML = items.map((x, i) => `<details class="macc" ${i === 0 ? 'open' : ''}><summary>${x.n}${x.isNew ? ' <span class="new">New</span>' : ''}${icon('chev', 'ic chev')}</summary><div class="macc__b">${(i === 0 ? maskLinks : i === items.length - 1 ? INDS.map(d => ({ n: d.n, href: '#industries' })) : lineLinks(LINE_ORDER[i - 1])).map(l => `<a href="${l.href}" ${l.attr || ''}>${l.n}</a>`).join('')}</div></details>`).join('');
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
      li.addEventListener('click', e => { if (e.target.closest('.mm a, .mm [data-quote]')) setOpen(li, false); });
    });
  }
  document.addEventListener('pointerdown', e => { if (!e.target.closest('[data-menu]')) closeMenus(); if (!e.target.closest('#ps')) closeSearch(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeMenus(); closeCart(); closeQuote(); closeSearch(); closeMnav(); }
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); $('#psIn').focus(); }
  });
  const onScroll = () => { $('#hd').classList.toggle('is-s', scrollY > 10); $('#mb').classList.toggle('is-on', scrollY > 700); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const mnav = $('#mnav');
  function closeMnav() { mnav.classList.remove('is-open'); mnav.setAttribute('aria-hidden', 'true'); $('#burger').setAttribute('aria-expanded', 'false'); }
  $('#burger').addEventListener('click', () => { mnav.classList.add('is-open'); mnav.setAttribute('aria-hidden', 'false'); $('#burger').setAttribute('aria-expanded', 'true'); });
  mnav.addEventListener('click', e => { if (e.target === mnav || e.target.closest('[data-close-mnav]') || e.target.closest('.macc__b a')) closeMnav(); });
  (function () { const t = $('#annTrack'), g = t.firstElementChild; let k = 0; while (g.scrollWidth < innerWidth + 200 && k++ < 4) g.insertAdjacentHTML('beforeend', g.innerHTML); const c = g.cloneNode(true); c.setAttribute('aria-hidden', 'true'); t.appendChild(c); })();

  /* ================= Search ================= */
  const ps = $('#ps'), psIn = $('#psIn'), psPop = $('#psPop');
  const IDX = [
    ...MASK.map(m => ({ kind: 'tape', id: m.id, name: m.n, text: (m.n + ' ' + m.s + ' masking tape ' + (m.opts || '')).toLowerCase(), vis: visual(m), soon: m.soon, price: m.soon ? 0 : minP(tapeItems(m)) })),
    ...LINE_ORDER.flatMap(k => (LINES[k].range || []).map(([n, ill]) => ({ kind: 'range', line: k, name: n, text: (n + ' ' + LINES[k].n).toLowerCase(), vis: ILL[ill] })))
  ];
  const PROD = CAT.filter(p => TAPE_F.includes(p.f) ? (p.s && p.k === 'Single roll') : p.k !== 'Case');
  let psSel = -1;
  function openSearch() { ps.classList.add('is-open'); psIn.setAttribute('aria-expanded', 'true'); }
  function closeSearch() { ps.classList.remove('is-open'); psIn.setAttribute('aria-expanded', 'false'); psSel = -1; }
  function psRow(c, hl) {
    const name = hl ? hl(c.name) : c.name;
    if (c.kind === 'tape') return `<a class="ps__r" role="option" href="#masking" data-tape="${c.id}"><span class="th">${c.vis}</span><span><b>${name}</b><small>${c.soon ? 'Masking tape · available on request' : 'Masking tape · single roll'}</small></span><em class="${c.soon ? 'q' : ''}">${c.soon ? 'Quote' : 'from ' + money(c.price)}</em></a>`;
    return `<a class="ps__r" role="option" href="#more" data-line="${c.line}"><span class="th">${c.vis}</span><span><b>${name}</b><small>${LINES[c.line].n} · available on request</small></span><em class="q">Quote</em></a>`;
  }
  function runSearch() {
    const raw = psIn.value.trim().toLowerCase();
    if (!raw) {
      psPop.innerHTML = `<p class="ps__h">Popular searches</p><div class="ps__cats">${['green PET tape', 'masking dots', 'glass cloth', 'polyimide', 'silicone plugs', 'hooks', '1 inch', '25 mm'].map(s => `<a href="#" data-ps="${esc(s)}">${icon('search')}${s}</a>`).join('')}</div><p class="ps__h">In-stock masking tape</p>` + MASK.filter(m => !m.soon).map(m => psRow({ kind: 'tape', id: m.id, name: m.n, vis: visual(m), price: minP(tapeItems(m)) })).join('');
      return;
    }
    const q = raw.replace(/(\d+(?:\.\d+)?)\s*(?:millimetres|millimeters|mm)\b/g, '$1mm').replace(/(\d+(?:\.\d+)?)\s*(?:inches|inch|in)\b/g, '$1"').replace(/(^|\s)\.(\d)/g, '$10.$2');
    const sizeTok = [];
    const words = q.split(/\s+/).filter(Boolean).filter(t => {
      let m = t.match(/^(\d+(?:\.\d+)?)mm$/); if (m) { sizeTok.push(+m[1] / 25.4); return false; }
      m = t.match(/^(\d+(?:\.\d+)?|\d\/\d)"$/); if (m) { sizeTok.push(frac(m[1])); return false; }
      return true;
    });
    const sizeOk = p => !sizeTok.length || (p.s && sizeTok.every(v => Math.abs(num(p.s) - v) <= Math.max(.02, v * .04)));
    const plural = w => [w, w.replace(/s$/, '')];
    const has = (h, w) => plural(w).some(x => h.includes(x));
    const cats = IDX.filter(x => words.length && words.every(w => has(x.text, w))).slice(0, 6);
    const prods = PROD.filter(p => { const h = (p.t + ' ' + p.f + (p.f === 'pet' ? ' polyester green pet' : '') + (TAPE_F.includes(p.f) ? ' masking tape' : '')).toLowerCase(); return words.every(w => has(h, w)) && sizeOk(p); })
      .sort((a, b) => (TAPE_F.includes(b.f) - TAPE_F.includes(a.f)) || (b.a - a.a)).slice(0, 6);
    const hl = s => { let o = esc(s); words.forEach(w => { if (w.length > 1) o = o.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); }); return o; };
    let html = '';
    if (cats.length) html += `<p class="ps__h">Categories</p>` + cats.map(c => psRow(c, hl)).join('');
    if (prods.length) html += `<p class="ps__h">Products</p>` + prods.map(p => `<div class="ps__r" role="option" data-add="${p.h}" data-variant="${esc(p.v[0] || '')}"><img src="${im(imgFor(p))}" alt=""><span><b>${hl(short(p))}</b><small>${[p.s && fmtSize(p.s), p.k && p.k !== 'Single roll' ? fmtLen(p.k) : 'Single roll', p.a ? 'In stock' : 'Contact us'].filter(Boolean).join(' · ')}</small></span><em>${money(p.p)}</em></div>`).join('');
    if (!html) html = `<p class="ps__none">No exact match for “${esc(psIn.value)}”. <button class="tl" data-quote="${esc(psIn.value)}" data-note="Product request from search">Ask us to source it</button></p>`;
    else html += `<div class="ps__all"><span>${prods.length + cats.length} results</span><button class="tl" data-quote="${esc(psIn.value)}">Bulk quote</button></div>`;
    psPop.innerHTML = html;
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

  /* ================= Hero quick buy ================= */
  let qbSel = 'pet';
  const qbState = {};
  const QB = ['pet', 'glass', 'paper', 'dots'];
  function renderQb() {
    $('#qbTabs').innerHTML = QB.map(id => { const m = MK[id] || { s: 'Masking Dots', img: 'cut-green-dots' }; return `<button type="button" class="qb__t" role="tab" aria-selected="${id === qbSel}" data-qb="${id}"><img src="${im(m.img)}" alt="">${m.s === 'Paper' ? 'Paper' : m.s}</button>`; }).join('');
    const items = (qbSel === 'dots' ? singles('dots').sort((a, b) => num(a.s) - num(b.s)) : tapeItems(MK[qbSel])).filter(p => p.a);
    const h = qbState[qbSel] || (qbState[qbSel] = (items.find(p => /^1"$/.test(p.s)) || items[0]).h);
    $('#qbLbl').textContent = qbSel === 'dots' ? 'Dot diameter' : 'Width';
    $('[data-ut]').innerHTML = ut();
    $('#qbSize').innerHTML = items.map(p => `<option value="${p.h}" ${p.h === h ? 'selected' : ''}>${fmtSize(p.s)}${qbSel === 'dots' ? ' · ' + dotsCount(p) : MK[qbSel].yd ? ' × ' + fmtYd(MK[qbSel].yd) : ''}</option>`).join('');
    $('#qbPrice').textContent = money(BY[h].p);
  }
  $('#qbTabs').addEventListener('click', e => { const b = e.target.closest('[data-qb]'); if (b) { qbSel = b.dataset.qb; renderQb(); } });
  $('#qbSize').addEventListener('change', e => { qbState[qbSel] = e.target.value; $('#qbPrice').textContent = money(BY[e.target.value].p); });
  $('#qb').addEventListener('submit', e => {
    e.preventDefault(); addToCart(qbState[qbSel], 1, '');
    const b = $('#qbAdd'); b.classList.add('is-done'); b.innerHTML = icon('check') + 'Added'; setTimeout(() => { b.classList.remove('is-done'); b.innerHTML = icon('cart') + 'Add'; }, 1400);
  });

  /* ================= Categories ================= */
  $('#cats').innerHTML = `<a class="cat cat--main" href="#masking"><span class="cat__t"><span class="top">#1 product line</span><b>Masking Tapes</b><small>Green PET, glass cloth, paper, polyimide &amp; more</small><span class="cat__go">Shop masking tapes ${icon('arrow')}</span></span><span class="cat__v"><img src="${im('cut-pet-stack')}" alt="Green polyester masking tape" loading="lazy"></span></a>` +
    LINE_ORDER.map(k => { const L = LINES[k]; return `<a class="cat" href="#more" data-line="${k}"><span class="cat__t">${L.isNew ? '<span class="new">New</span>' : ''}<b>${L.n}</b><small>${L.d}</small><span class="cat__go">Shop ${L.short.toLowerCase()} ${icon('arrow')}</span></span><span class="cat__v">${L.img ? `<img src="${im(L.img)}" alt="${esc(L.n)}" loading="lazy">` : ILL[L.ill]}</span></a>`; }).join('');

  /* ================= Masking list + panel ================= */
  let tapeSel = 'pet';
  const tState = {};
  function renderTabs() {
    const tab = m => `<button class="mt" role="tab" aria-selected="${m.id === tapeSel}" data-tape="${m.id}"><span class="mt__th">${visual(m)}</span><span><b>${m.n.replace(' Tape', '')}</b>${m.soon && m.opts ? `<small>${m.opts}</small>` : ''}</span><em class="${m.soon ? 'q' : ''}">${m.soon ? 'Quote' : money(minP(tapeItems(m)))}</em></button>`;
    $('#mkList').innerHTML = `<p class="mk__lbl">In stock</p>` + MASK.filter(m => !m.soon).map(tab).join('') + `<p class="mk__lbl">Available on request</p>` + MASK.filter(m => m.soon).map(tab).join('');
  }
  const bulkLine = (name, size, vis) => `<p class="ibulk">${icon('file')}<span>Buying in bulk, or for a company or government agency? <button data-quote="${esc(name)}" data-size="${esc(size || '')}" data-vis="${vis}">Get a quote</button></span></p>`;
  function renderPanel() {
    const m = MK[tapeSel], P = $('#mkPanel');
    if (m.soon) {
      P.innerHTML = `<div class="mp"><div class="mp__media"><span class="req-b mp__tag">Available on request</span>${ILL[m.ill]}</div>
        <div class="mp__b"><h3>${m.n}</h3><p>We're adding ${m.n.toLowerCase()} to our range. Tell us the size and quantity you need and we'll send availability and pricing.</p>
        ${m.opts ? `<dl class="spec"><div><dt>Thickness options</dt><dd>${m.opts}</dd></div></dl>` : ''}
        <div class="req"><b>Request this tape</b><div class="fld"><span class="fld__l">Width you need ${ut()}</span><div class="req__f"><input id="reqW" placeholder="${UNIT === 'mm' ? 'e.g. 25 mm' : 'e.g. 1 inch'}" aria-label="Width you need"><button class="bt bt--dark" data-quote="${esc(m.n)}" data-vis="${m.ill}" data-note="Available on request" id="reqBtn">Request a quote</button></div></div></div></div></div>`;
      $('#reqW').addEventListener('input', e => { $('#reqBtn').dataset.size = e.target.value; });
      return;
    }
    const items = tapeItems(m);
    const st = tState[m.id] || (tState[m.id] = { h: (items.find(p => p.a && /^1"$/.test(p.s)) || items.find(p => p.a) || items[0]).h, q: 1 });
    const p = BY[st.h], size = fmtSize(p.s);
    P.innerHTML = `<div class="mp"><div class="mp__media">${m.badge ? `<span class="new mp__tag" style="background:var(--g);color:#fff">${m.badge}</span>` : ''}<img src="${im(m.id === 'pet' ? 'cut-pet-lineup' : m.img)}" alt="${esc(m.n)}"></div>
      <div class="mp__b"><h3>${m.n}</h3><p>${m.d}</p>
      <dl class="spec"><div><dt>Temperature</dt><dd>${m.temp}</dd></div><div><dt>Adhesive</dt><dd>${m.adh}</dd></div><div><dt>Roll length</dt><dd>${fmtYd(m.yd)}</dd></div></dl>
      ${m.thick ? `<div class="chips"><span>Thickness:</span><button class="ch" aria-pressed="true">2 mil</button><button class="ch" data-quote="${esc(m.n)} — 1 mil" data-vis="${m.img}" data-note="1 mil — available on request">1 mil <small>· request</small></button><button class="ch" data-quote="${esc(m.n)} — 5 mil" data-vis="${m.img}" data-note="5 mil — available on request">5 mil <small>· request</small></button></div>` : ''}
      <div class="buy">
        <div class="buy__row">
          <div class="fld"><span class="fld__l">Width · ${items.length} sizes ${ut()}</span><span class="sel"><select id="mkSize" aria-label="Width">${items.map(x => `<option value="${x.h}" ${x.h === st.h ? 'selected' : ''}>${fmtSize(x.s)} — ${money(x.p)}${x.a ? '' : ' (contact us)'}</option>`).join('')}</select></span></div>
          <div class="fld"><span class="fld__l">Rolls</span><div class="qty"><button type="button" data-st="-1" aria-label="Fewer rolls">${icon('minus')}</button><input id="mkQty" type="number" min="1" value="${st.q}" aria-label="Number of rolls"><button type="button" data-st="1" aria-label="More rolls">${icon('plus')}</button></div></div>
        </div>
        <div class="price"><b>${money(p.p)}</b><small>per roll</small>${p.a ? `<span class="stk"><i></i>In stock</span>` : `<span class="stk stk--o"><i></i>Out of stock</span>`}</div>
        ${p.a ? `<button class="bt bt--green bt--lg bt--block" data-add="${p.h}" data-qty="${st.q}">${icon('cart')}Add ${st.q > 1 ? st.q + ' rolls' : 'to cart'} · ${money(p.p * st.q)}</button>` : `<button class="bt bt--dark bt--lg bt--block" data-quote="${esc(m.n)}" data-size="${esc(size)}" data-vis="${m.img}" data-note="Out of stock — we'll confirm availability">${icon('chat')}Contact us for this size</button>`}
        ${bulkLine(m.n, size, m.img)}
      </div></div></div>`;
    $('#mkSize').addEventListener('change', e => { st.h = e.target.value; renderPanel(); });
    const setQ = v => { st.q = Math.max(1, Math.min(999, v | 0 || 1)); renderPanel(); };
    $$('[data-st]', P).forEach(b => b.addEventListener('click', () => setQ(st.q + +b.dataset.st)));
    $('#mkQty').addEventListener('change', e => setQ(+e.target.value));
  }
  function selTape(id) { tapeSel = id; renderTabs(); renderPanel(); }
  $('#mkList').addEventListener('keydown', e => {
    if (!/Arrow(Down|Up|Left|Right)/.test(e.key)) return; e.preventDefault();
    const tabs = $$('.mt', $('#mkList')), i = tabs.findIndex(t => t.dataset.tape === tapeSel), n = tabs[(i + (/Down|Right/.test(e.key) ? 1 : -1) + tabs.length) % tabs.length];
    selTape(n.dataset.tape); $(`.mt[data-tape="${n.dataset.tape}"]`).focus();
  });

  /* ================= More lines ================= */
  let lineSel = 'diecut';
  const lState = {};
  function cardItems(c) { return (c.filt ? famAll(c.fam).filter(c.filt) : famAll(c.fam)).filter(p => p.k !== 'Case'); }
  function card(c, i) {
    const key = lineSel + i, items = cardItems(c);
    const st = lState[key] || (lState[key] = (() => { const p = items.find(x => x.a && (!c.def || x.s === c.def)) || items.find(x => x.a) || items[0]; return { s: p.s, k: p.k, v: (p.v || [])[0] || '' }; })());
    const sizes = [...new Set(items.map(p => p.s).filter(Boolean))].sort((a, b) => num(a) - num(b));
    const lens = [...new Set(items.filter(p => p.s === st.s).map(p => p.k).filter(Boolean))];
    if (st.k && !lens.includes(st.k)) st.k = lens[0];
    const p = items.find(x => (!st.s || x.s === st.s) && (!st.k || x.k === st.k)) || items[0];
    const sel = (k2, label, opts, cur, fmt, u) => opts.length > 1 ? `<div class="fld"><span class="fld__l">${label}${u ? ut() : ''}</span><span class="sel"><select data-k="${k2}" data-card="${key}" aria-label="${label}">${opts.map(o => `<option value="${esc(o)}" ${o === cur ? 'selected' : ''}>${fmt(o)}${c.fam === 'dots' ? ' · ' + dotsCount(items.find(x => x.s === o)) : ''}</option>`).join('')}</select></span></div>` : '';
    return `<article class="pc"><div class="pc__m">${c.badge ? `<span class="bd">${c.badge}</span>` : ''}<img src="${im(imgFor(p))}" alt="${esc(c.t)}" loading="lazy"></div><div class="pc__b"><h3 class="pc__t">${c.t}</h3><p class="pc__s">${c.sub}</p>
      ${sel('s', c.lbl.s || 'Size', sizes, st.s, fmtSize, true)}${sel('k', c.lbl.k || 'Length', lens, st.k, fmtLen)}${c.lbl.v && p.v.length > 1 ? sel('v', 'Color', p.v, st.v, x => x) : ''}
      <div class="pc__f"><div class="pc__p">${money(p.p)}<small>${p.k && p.k !== 'Single roll' ? fmtLen(p.k) : c.fam === 'dots' ? 'per roll' : 'each'}</small></div>${p.a ? `<button class="add" data-add="${p.h}" data-variant="${esc(c.lbl.v ? st.v : '')}">${icon('plus')}Add</button>` : `<button class="add add--q" data-quote="${esc(c.t)}" data-size="${esc(fmtSize(p.s))}" data-vis="${imgFor(p)}" data-note="Out of stock — we'll confirm availability">Contact us</button>`}</div>
      <button class="pc__q" data-quote="${esc(c.t)}" data-size="${esc(fmtSize(p.s))}" data-vis="${imgFor(p)}">Bulk or government quote</button></div></article>`;
  }
  function renderMore() {
    const L = LINES[lineSel];
    $('#moreTabs').innerHTML = LINE_ORDER.map(k => `<button role="tab" aria-selected="${k === lineSel}" data-line="${k}">${LINES[k].n}${LINES[k].isNew ? ' <span class="new">New</span>' : ''}</button>`).join('');
    const cards = (L.cards || []).map(card).join('');
    const range = L.range ? `<div class="rg"><div class="rg__h"><b>${L.cards ? 'More ' + L.short.toLowerCase() + ' — available on request' : 'Our ' + L.n.toLowerCase() + ' range — available on request'}</b><span>Tell us the size and quantity and we'll quote it.</span></div>${L.range.map(([n, ill]) => `<button class="ri" data-quote="${esc(n)}" data-vis="${ill}" data-note="${esc(L.n)} · available on request"><span class="th">${ILL[ill]}</span><span><b>${n}</b><small>Request a quote</small></span>${icon('arrow')}</button>`).join('')}</div>` : '';
    const intro = !L.cards ? '' : (L.cards.length < 3 ? `<div class="intro"><div><b>${L.n}</b><p>${L.d}. Order in-stock sizes now, or request custom sizes and bulk pricing.</p></div><button class="bt bt--dark" data-quote="${esc(L.n)}">Request a quote</button></div>` : '');
    $('#moreBody').innerHTML = cards + intro + range;
    $('#moreBody').classList.toggle('one', (L.cards || []).length === 1);
  }
  function selLine(k) { lineSel = k; renderMore(); }
  $('#moreBody').addEventListener('change', e => { const s = e.target.closest('select[data-card]'); if (!s) return; lState[s.dataset.card][s.dataset.k] = s.value; renderMore(); });

  /* ================= Industries ================= */
  $('#ind').innerHTML = INDS.map(i => `<article class="in"><img src="${im(i.img)}" alt="${esc(i.n)}" loading="lazy"><div class="in__b"><b>${i.n}</b><p>${i.d}</p><div class="in__r">${i.rec.map(([t, id]) => t === 'tape' ? `<a href="#masking" data-tape="${id}">${MK[id].n.replace(' Tape', '')}</a>` : `<a href="#more" data-line="${id}">${LINES[id].n}</a>`).join('')}</div></div></article>`).join('');

  /* ================= Reviews ================= */
  const RV = [
    { n: 'Luis T.', r: 'Powder coater · Houston, TX', d: 'Oct 2026', t: 'Holds through the cure, peels clean', b: 'The green PET tape holds through the whole cure cycle and peels off clean. Buying single rolls in the width I need is a big help.', p: 'green-pet-tape-1-inch-x-72-yard-single-roll' },
    { n: 'Rosa M.', r: 'Paint line supervisor · Phoenix, AZ', d: 'Oct 2026', t: 'Dots save us real time', b: 'The masking dots go on in seconds and survive the oven. Our masking time on threaded holes dropped noticeably.', p: 'green-dots-2-inch-x-1-000-dots-single-roll' },
    { n: 'Dana K.', r: 'Operations lead · CNC shop, OH', d: 'Sep 2026', t: 'Zero scratch complaints', b: 'We wrap shafts and valve bodies before shipping. Not one scratch complaint since moving to FinePS netting.', p: 'poly200green-net' },
    { n: 'Kevin P.', r: 'Electrical contractor · Atlanta, GA', d: 'Sep 2026', t: 'Easy to match our spec', b: 'Strong glass cloth tape for coil wrapping. Seeing sizes in mm made matching our spec sheet easy.', p: 'glass-cloth-tape-2-inch-x-32-yard-single-roll' },
    { n: 'Sam R.', r: 'Body shop owner · Tampa, FL', d: 'Aug 2026', t: 'Sharp lines, no residue', b: 'Paper masking that lifts off without leaving glue behind. Reordering by the roll is simple.', p: 'low-temperature-paper-masking-tape-1-inch-x-54-yard-single-roll' }
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
  })();
  $('#allReviews').addEventListener('click', e => { e.preventDefault(); toast('Prototype: opens the full reviews page'); });

  /* ================= FAQ / newsletter / wordmark ================= */
  $('#qa').addEventListener('click', e => { const b = e.target.closest('.q>button'); if (!b) return; const q = b.parentElement, on = !q.classList.contains('is-open'); $$('#qa .q').forEach(x => { x.classList.remove('is-open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); }); if (on) { q.classList.add('is-open'); b.setAttribute('aria-expanded', 'true'); } });
  $('#nl').addEventListener('submit', e => { e.preventDefault(); $('#nl .nl__ok').hidden = false; $('#nlE').value = ''; });
  const wm = $('#wm'), WL = $$('span', wm);
  const hot = i => WL.forEach((l, j) => { l.classList.toggle('is-hot', j === i); l.classList.toggle('is-near', Math.abs(j - i) === 1); });
  wm.addEventListener('mousemove', e => { let b = 0, bd = 1e9; WL.forEach((l, j) => { const r = l.getBoundingClientRect(), dd = Math.abs(e.clientX - (r.left + r.width / 2)); if (dd < bd) { bd = dd; b = j; } }); hot(b); });
  wm.addEventListener('mouseleave', () => hot(-9));

  /* ================= Init ================= */
  function renderAll() { renderQb(); renderPanel(); renderMore(); renderCart(); if (ps.classList.contains('is-open')) runSearch(); }
  buildNav(); renderTabs(); renderAll();
})();
