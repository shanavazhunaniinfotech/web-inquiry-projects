/* FinePS — shared core (header, menus, search, cart, quote form, units, catalog) */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const money = n => '$' + n.toFixed(2);
  const icon = (id, cls = 'ic') => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;
  const B = document.body.dataset.base || '';
  const im = n => B + '../images/' + n + '.webp';
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
    if (p.f === 'netting' && !p.s) { const m = p.t.match(/(\d?\.\d+)\D{0,4}to\s*(\d?\.\d+)/i); if (m) p.s = (m[1].startsWith('.') ? '0' + m[1] : m[1]) + '–' + m[2] + '"'; else if (/450/.test(p.t)) p.s = '4.50–5.00"'; }
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
    { id: 'pet', n: 'Green Polyester (PET) Tape', s: 'Green PET', fam: 'pet', img: 'cut-green-tape', temp: 'Up to 428°F (220°C)', tnote: 'Continuous use to 356°F (180°C), short-term to 428°F (220°C). Holds through powder-coat, E-coat and Cerakote cures.', adh: 'Silicone', yd: 72, best: 'Powder coating, E-coating, plating', badge: 'Best seller', thick: true,
      d: 'Strong green polyester (PET) film with silicone adhesive for powder coating, E-coating, Cerakote, anodizing and plating. Won\'t shrink in the oven and peels off clean with no residue.' },
    { id: 'glass', n: 'Glass Cloth Tape', s: 'Glass Cloth', fam: 'glass', img: 'cut-glass-cloth', temp: '−100°F to 500°F (−73°C to 260°C)', tnote: 'For extreme heat where plastic or paper tapes would fail: thermal and plasma spray, heat treating.', adh: 'Silicone', yd: 32, best: 'Thermal spray, heavy industrial finishing',
      d: 'Woven fiberglass cloth with silicone adhesive for extreme-heat masking. Flame-retardant, tough at high temperature and resistant to abrasion and solvents. Also used to insulate motors, coils and transformers.' },
    { id: 'paper', n: 'Paper Masking Tape', s: 'Paper', fam: 'paper', img: 'cut-paper-tape', temp: 'Up to 176°F (80°C)', tnote: 'For painting and room-temperature curing — not for oven cures.', adh: 'Water-based', yd: 54, best: 'General painting, room-temp curing',
      d: 'Easy-tear crepe paper masking tape with a water-based adhesive. Conforms to curves, holds well and removes cleanly. Great for painting, auto refinish and general finishing.' },
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
  /* Poly netting roll chart (client sheet): stretch range start -> [part no., colour, feet per roll] */
  const NET = [[0.25, 'Poly32', 'Orange', 1500], [0.5, 'Poly50', 'Blue', 1500], [1, 'Poly100', 'Yellow', 1000], [2, 'Poly200', 'Green', 750], [2.5, 'Poly250', 'White', 500], [3, 'Poly300', 'Red', 600], [3.5, 'Poly350', 'Black', 450], [4, 'Poly400', 'Gray', 400], [4.5, 'Poly450', 'Brown', 300], [5, 'Poly500', 'Orange', 350]];
  const PN = {
    pet: { '0.5"': 'FGPT50072', '1"': 'FGPT100072', '2"': 'FGPT200072', '3"': 'FGPT300072', '5"': 'FGPT500072', '6"': 'FGPT600072' },
    glass: { '1"': 'FGCT100032', '1.5"': 'FGCT150032', '2"': 'FGCT200032', '3"': 'FGCT300032', '4"': 'FGCT400032', '5"': 'FGCT500032', '6"': 'FGCT600032' },
    paper: { '0.5"': 'FPTLP50054', '1"': 'FPTLP100054', '1.5"': 'FPTLP150054', '2"': 'FPTLP200054', '3"': 'FPTLP300054' },
    dots: { '1"': 'FGD10005K', '1.5"': 'FGD15002K', '2"': 'FGD20001K', '3"': 'FGD30005H', '4"': 'FGD4000250H', '5"': 'FGD5000100H', '6"': 'FGD6000100H' }
  };
  const partNo = (fam, s) => fam === 'netting' ? ((netInfo(s) || [])[1] || '') : ((PN[fam] || {})[s] || '');
  const NETIMG = { Orange: 'cut-netting-orange', Blue: 'cut-netting-blue', Yellow: 'cut-netting-yellow', Green: 'app-green-netting', White: 'app-white-netting', Red: 'cut-netting-red', Black: 'cut-black-spool', Gray: 'cut-netting-gray', Brown: 'cut-netting-brown' };
  const netInfo = s => NET.find(r => Math.abs(r[0] - num(s)) < .01);
  const ftLen = ft => UNIT === 'mm' ? Math.round(ft * 0.3048) + ' m' : ft.toLocaleString() + ' ft';
  const tapeItems = m => m.soon ? [] : singles(m.fam).sort((a, b) => num(a.s) - num(b.s));
  const dotsCount = p => { const m = p.t.match(/x\s*([\d,]+)\s*Dots/i); return m ? m[1] + ' dots / roll' : ''; };

  /* ================= Other product lines ================= */
  const LINES = {
    diecut: { n: 'Die-Cut Dots & Shapes', short: 'Die-Cuts', d: 'Masking dots, discs, donuts & custom shapes', img: 'cut-dots-hero',
      cards: [{ t: 'Green Masking Dots', sub: 'Pre-cut polyester discs · up to 400°F', fam: 'dots', lbl: { s: 'Dot diameter' }, badge: 'In stock' }],
      range: [['Green Discs', 'disc'], ['Green Donuts (Washer Dots)', 'donut'], ['Squares & Rectangles', 'square'], ['Discs with Pull Tab', 'pulldisc'], ['Polyimide Discs', 'disc'], ['Plating & Anodizing Discs', 'disc'], ['Custom Die-Cut Shapes', 'diecut']] },
    protect: { n: 'Netting & Spiral Wrap', short: 'Netting & Wrap', d: 'PE netting, sleeves & hose wrap', img: 'cut-netting-red',
      cards: [
        { t: 'PE Protective Netting', sub: '10 stretch ranges · colour-coded rolls', fam: 'netting', lbl: { s: 'Stretch range' }, def: '2.00–2.50"', badge: 'Full roll' },
        { t: 'Spiral Cable & Hose Wrap', sub: 'Polyethylene · black or yellow', fam: 'spiral', lbl: { s: 'Size', k: 'Length', v: 'Color' } }],
      range: [['Netting on Sewing Cones', 'tube'], ['Custom Cut Sleeves', 'tube']] },
    caps: { n: 'Caps & Plugs', short: 'Caps & Plugs', d: 'Silicone caps, plugs, tubing & cord', ill: 'cap', isNew: true,
      range: [['Silicone Caps', 'cap'], ['Silicone Flange Caps', 'flangecap'], ['Pull-Tab Vinyl Caps', 'vinylcap'], ['Silicone Tapered Plugs', 'plug'], ['Tapered Plugs with Handles', 'pulltab'], ['Silicone Pull Plugs', 'pulltab'], ['Silicone Flange Plugs', 'flangeplug'], ['Hollow Core Plugs', 'hollow'], ['Silicone Tubing & Cord', 'tube']] },
    hooks: { n: 'Hooks', short: 'Hooks', d: 'Powder-coating & racking hooks', ill: 'rack', isNew: true,
      range: [['S Hooks', 'shook'], ['C Hooks', 'chook'], ['V Hooks', 'vhook'], ['90° Twist Hooks', 'twist'], ['Snap Hooks', 'snap'], ['Spring Hooks', 'spring'], ['Claw Hooks', 'claw'], ['Stainless Steel Hooks', 'ss'], ['Racking & Multi-Hooks', 'rack']] },
    screen: { n: 'Screen & Spline', short: 'Screen & Spline', d: '40+ spline sizes, tools & bug seals', img: 'cut-round-spline',
      cards: [
        { t: 'Round Retainer Spline', sub: 'Serrated black vinyl', fam: 'spline', lbl: { s: 'Diameter', k: 'Length' }, def: '0.185', badge: 'Best seller' },
        { t: 'Flat Screen Spline', sub: 'Pool cages & patio enclosures', fam: 'flat', lbl: { s: 'Width', k: 'Length' } }],
      also: ['Smooth Spline', 'Screen Roller Tool', 'Bug Seals', 'Screen Clips'] }
  };
  const LINE_ORDER = ['diecut', 'protect', 'caps', 'hooks', 'screen'];
  function cardItems(c) { return (c.filt ? famAll(c.fam).filter(c.filt) : famAll(c.fam)).filter(p => p.k !== 'Case'); }

  /* ================= Pages & product registry ================= */
  const slug = t => t.toLowerCase().replace(/&/g, 'and').replace(/°/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const CATS = {
    masking: { n: 'Masking Tapes', page: B + 'masking-tapes/', img: 'cut-pet-stack', d: 'High-temperature and general masking tape for powder coating, plating, painting and electronics. In-stock tapes sell by the single roll at a flat price.' },
    diecut: { n: 'Die-Cut Dots & Shapes', page: B + 'die-cuts/', img: 'cut-dots-hero', d: 'Pre-cut masking dots, discs, donuts, squares and custom die-cut shapes that mask holes, studs and grounding points in seconds.' },
    protect: { n: 'Netting & Spiral Wrap', page: B + 'netting-spiral-wrap/', img: 'cut-netting-red', d: 'Expandable PE netting and spiral wrap that protect machined parts, hoses and cables during handling, storage and shipping.' },
    caps: { n: 'Caps & Plugs', page: B + 'caps-plugs/', ill: 'cap', isNew: true, d: 'Silicone and vinyl caps, plugs, tubing and cord for masking studs, threads and holes through powder coating and plating.' },
    hooks: { n: 'Hooks', page: B + 'hooks/', ill: 'rack', isNew: true, d: 'Powder-coating and racking hooks to hang parts through the spray booth and the cure oven.' },
    screen: { n: 'Screen & Spline', page: B + 'screen-spline/', img: 'cut-round-spline', d: 'Round, serrated, flat and smooth screen spline in 40+ sizes, plus the roller tools, clips and bug seals to finish the job.' },
    auto: { n: 'Automotive', page: B + 'shop/#auto', img: 'cut-tender-spring', d: 'Heavy-duty parts for trucks and trailers.' }
  };
  const FAMINFO = {
    pet: { imgs: ['p-pet-1', 'p-pet-2', 'p-pet-3', 'p-pet-4', 'cut-pet-lineup'], lbl: 'Width',
      spec: [['Carrier', 'Polyester (PET) film, 2 mil (50 micron)'], ['Total thickness', '3.5 mil (90 micron)'], ['Adhesive', 'Silicone'], ['Colour', 'Green'], ['Temperature', 'Continuous 356°F (180°C) · short-term 428°F (220°C)'], ['Adhesion to steel', '10 N/25 mm'], ['Elongation at break', '80%'], ['Roll length', '72 yd (66 m)'], ['Features', 'No residue, corrosion resistant, good insulation, easy to die-cut']],
      uses: ['Powder coating', 'E-coating', 'Cerakote & ceramic coating', 'Plating & anodizing', 'Paint spray protection', 'Die cutting'] },
    glass: { imgs: ['p-glass-2', 'p-glass-1', 'p-glass-3', 'cut-glass-cloth'], lbl: 'Width',
      spec: [['Carrier', 'Woven glass cloth (fiberglass)'], ['Adhesive', 'Silicone'], ['Total thickness', '7 mil (0.18 mm)'], ['Colour', 'White'], ['Temperature', '−100°F to 500°F (−73°C to 260°C)'], ['Adhesion', '≥ 8 N/25 mm'], ['Voltage resistance', '≥ 3 kV'], ['Elongation', '≥ 5%'], ['Roll length', '32 yd (30 m)']],
      uses: ['Thermal & plasma spray', 'Heat treating', 'Aerospace & heavy industrial finishing', 'Motor, coil & transformer insulation', 'Extreme high-heat masking'] },
    paper: { imgs: ['p-paper-1', 'p-paper-2', 'p-paper-3', 'cut-paper-tape'], lbl: 'Width',
      spec: [['Carrier', 'Crepe paper'], ['Adhesive', 'Water-based pressure-sensitive'], ['Thickness', '6.3 mil (160 micron)'], ['Colour', 'Beige'], ['Temperature', 'Up to 176°F (80°C)'], ['Peel strength', '6.5 N/25 mm'], ['Tensile strength', '≥ 28 N/cm'], ['Roll length', '54 yd (50 m)'], ['Shelf life', '12 months (store at 60–80°F, 40–50% RH)']],
      uses: ['Painting', 'Auto refinish', 'Appliances', 'Interior finishing'] },
    dots: { n: 'Green Masking Dots', line: 'diecut', imgs: ['p-dots-1', 'p-dots-2', 'cut-dots-hero', 'cut-green-dots'], lbl: 'Dot diameter',
      d: 'Pre-cut green polyester discs with silicone adhesive. They keep powder coat, Cerakote and paint off holes, nuts, mating surfaces and grounding points — no trimming needed.',
      spec: [['Material', 'High-temperature polyester film, silicone adhesive'], ['Colour', 'Green'], ['Temperature', 'Up to 392°F (200°C)+ bake cycles'], ['Dots per roll', '1" × 5,000 · 1.5" × 2,000 · 2" × 1,000 · 3" × 500 · 4" × 250 · 5" & 6" × 100'], ['Sold as', 'Single roll']],
      uses: ['Holes & studs', 'Nuts & threads', 'Grounding points', 'Mating surfaces'] },
    netting: { n: 'PE Protective Netting', line: 'protect', imgs: ['cut-netting-red', 'cut-netting-orange', 'cut-netting-blue', 'cut-netting-yellow', 'cut-netting-gray', 'cut-netting-brown', 'cut-black-spool', 'app-valve-netting', 'app-pump-netting', 'app-white-netting', 'app-red-netting', 'app-green-netting'], lbl: 'Stretch range',
      d: 'Expandable polyethylene mesh that slides over parts to stop scratches, scuffs and metal-on-metal contact. Open mesh keeps parts visible and lets air through. Colour-coded by size, sold by the full roll.',
      spec: [['Material', 'Polyethylene (PE)'], ['Type', 'Expandable open-mesh sleeve'], ['Sizes', '10 stretch ranges, 0.25" to 5.50"'], ['Roll length', '300 – 1,500 ft by size'], ['Reusable', 'Yes']],
      uses: ['Machined parts', 'Threaded components', 'Shafts & fasteners', 'Tooling', 'Warehouse & packing lines'] },
    spiral: { n: 'Spiral Cable & Hose Wrap', line: 'protect', imgs: ['cut-spiral-wrap', 'app-hydraulic-wrap', 'app-cable-wrap'], lbl: 'Size',
      d: 'Flexible polyethylene spiral wrap that protects and organises hoses, wires and cable bundles. Individual lines can exit the wrap wherever you need.',
      spec: [['Material', 'Polyethylene (PE)'], ['Colours', 'Black, Yellow'], ['Sizes', '3/4", 1.1", 2"'], ['Lengths', '25, 50 & 100 ft']],
      uses: ['Hydraulic hoses', 'Cable management', 'Automotive', 'Construction', 'Electronics'] },
    spline: { n: 'Round Retainer Screen Spline', line: 'screen', imgs: ['cut-round-spline', 'cut-spline-15lb', 'cut-spline-coil', 'app-screened-porch'], lbl: 'Diameter',
      d: 'Serrated black vinyl spline that locks screen mesh into window and door frames. UV-resistant and crack-resistant, in more sizes than big-box stores carry.',
      spec: [['Material', 'Vinyl'], ['Profile', 'Round, serrated'], ['Colour', 'Black'], ['Sizes', '.105" to .250"'], ['Lengths', '100 ft, 250 ft, 15 lb roll']],
      uses: ['Window screens', 'Door screens', 'Patio & porch', 'Contractors'] },
    flat: { n: 'Flat Screen Spline', line: 'screen', imgs: ['cut-flat-spline', 'cut-flat-1000', 'app-pool-enclosure'], lbl: 'Width',
      d: 'Flat-profile vinyl spline for frames with shallow grooves, such as pool cages and patio enclosures, where round spline won’t sit securely.',
      spec: [['Material', 'Vinyl'], ['Profile', 'Flat'], ['Colour', 'Black'], ['Widths', '.290", .315"'], ['Lengths', '100 – 1,000 ft']],
      uses: ['Pool cages', 'Patio enclosures', 'Lanais'] },
    smooth: { n: 'Smooth Screen Spline', line: 'screen', imgs: ['cut-smooth-spline'], lbl: 'Diameter',
      d: 'Smooth gray vinyl spline for frames that call for a non-serrated profile.', spec: [['Material', 'Vinyl'], ['Colour', 'Gray'], ['Sizes', '.090", .110"'], ['Length', '100 ft']], uses: ['Window screens', 'Door screens'] },
    tool: { n: 'Screen Roller Tool', line: 'screen', imgs: ['cut-roller-tool', 'app-installer'], d: 'Convex and concave steel-bearing wheels on a hardwood handle — the one tool every screen job needs.', spec: [['Wheels', 'Steel, convex & concave'], ['Handle', 'Hardwood']], uses: ['Screen installs', 'Screen repair'] },
    bugseal: { n: 'Bug Seal', line: 'screen', imgs: ['cut-bug-seal', 'cut-bug-seal-2'], d: 'Adjustable 8 ft vinyl seals for sliding screen doors. Trim to fit and press in.', spec: [['Length', '8 ft'], ['Material', 'Vinyl']], uses: ['Sliding screen doors'] },
    clips: { n: 'Window Screen Clips', line: 'screen', imgs: ['cut-screen-clips'], d: '7/16" diecast zinc clips that hold screen frames securely in the window. 100 per pack.', spec: [['Size', '7/16"'], ['Material', 'Diecast zinc'], ['Pack', '100 clips']], uses: ['Window screens'] },
    spring: { n: 'Heavy-Duty Tender Spring Kit', line: 'auto', imgs: ['cut-tender-spring'], d: '25" heavy-duty tracker tender spring kit for semi-trucks and trailers.', spec: [['Length', '25"'], ['Use', 'Semi-truck & trailer']], uses: ['Trucks', 'Trailers'] }
  };
  const PRODUCTS = [
    ...MASK.map(m => ({ id: m.id, n: m.n, line: 'masking', fam: m.fam, soon: m.soon, img: m.img, ill: m.ill, opts: m.opts })),
    { id: 'dots', fam: 'dots' },
    ...LINES.diecut.range.map(([n, ill]) => ({ id: slug(n), n, line: 'diecut', soon: true, ill })),
    { id: 'netting', fam: 'netting' }, { id: 'spiral', fam: 'spiral' },
    ...LINES.protect.range.map(([n, ill]) => ({ id: slug(n), n, line: 'protect', soon: true, ill })),
    ...LINES.caps.range.map(([n, ill]) => ({ id: slug(n), n, line: 'caps', soon: true, ill })),
    ...LINES.hooks.range.map(([n, ill]) => ({ id: slug(n), n, line: 'hooks', soon: true, ill })),
    ...['spline', 'flat', 'smooth', 'tool', 'bugseal', 'clips', 'spring'].map(f => ({ id: f, fam: f }))
  ].map(p => { const fi = FAMINFO[p.fam] || {}; return Object.assign({ n: fi.n, line: fi.line, img: fi.imgs && fi.imgs[0] }, p); });
  const PBY = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const purl = id => B + 'product/?id=' + id;
  const pItems = p => p.soon || !p.fam ? [] : (['pet', 'glass', 'paper', 'dots'].includes(p.fam) ? singles(p.fam) : famAll(p.fam).filter(x => x.k !== 'Case')).sort((a, b) => num(a.s) - num(b.s));
  const pFrom = p => { const it = pItems(p).filter(x => x.a); return it.length ? minP(it) : (pItems(p).length ? minP(pItems(p)) : 0); };
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
    if (!$('#cart').classList.contains('is-open')) openCart();
  }
  /* free-shipping goal: set to 0 to show "free shipping" on every order */
  const FREE_SHIP = 50;
  const UPSELL = { pet: ['dots', 'glass', 'paper'], glass: ['pet', 'dots', 'paper'], paper: ['pet', 'dots', 'glass'], dots: ['pet', 'glass', 'paper'], netting: ['spiral', 'pet', 'dots'], spiral: ['netting', 'pet'], spline: ['tool', 'clips', 'bugseal'], flat: ['tool', 'clips', 'bugseal'], smooth: ['tool', 'clips', 'bugseal'], tool: ['spline', 'clips'], clips: ['spline', 'tool'], bugseal: ['spline', 'tool'], spring: ['pet', 'dots'] };
  const pickOf = f => { const l = singles(f).filter(p => p.a); return l.find(p => p.s === '1"') || l.sort((a, b) => a.p - b.p)[0]; };
  const prodOf = f => PRODUCTS.find(p => p.fam === f);
  function upsells() {
    const fams = [...new Set(cart.map(i => BY[i.h].f))];
    const want = [...new Set((fams.length ? fams : ['pet']).flatMap(f => UPSELL[f] || ['pet', 'dots', 'paper']).concat(['pet', 'dots', 'paper']))].filter(f => !fams.includes(f));
    return want.map(f => [f, pickOf(f), prodOf(f)]).filter(x => x[1] && x[2]).slice(0, 3);
  }
  function renderCart() {
    const n = cart.reduce((a, i) => a + i.q, 0), sub = cart.reduce((a, i) => a + BY[i.h].p * i.q, 0);
    $('#cartCount').textContent = n; $('#cartN').textContent = n ? `(${n})` : '';
    // shipping bar
    const left = Math.max(0, FREE_SHIP - sub), pct = FREE_SHIP ? Math.min(100, sub / FREE_SHIP * 100) : 100;
    $('#shipBar').innerHTML = `<p>${icon('truck')}<span>${left > 0 ? `You're <b>${money(left)}</b> away from <b>FREE shipping</b>` : `<b>You've unlocked FREE shipping!</b>`}</span></p><div class="sb__t" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"><i style="width:${pct}%"></i></div>`;
    $('#shipBar').classList.toggle('is-done', left <= 0);
    // items
    const ups = upsells();
    const upHtml = ups.length ? `<div class="up"><p class="up__h">${cart.length ? 'Customers also add' : 'Popular picks'}</p><div class="up__l">${ups.map(([f, p, P]) => `<div class="up__i"><a href="${purl(P.id)}"><img src="${im(imgFor(p))}" alt=""></a><div><a href="${purl(P.id)}"><b>${P.n}</b></a><small>${[p.s && fmtSize(p.s), f === 'dots' ? dotsCount(p) : p.k === 'Single roll' ? 'single roll' : p.k && fmtLen(p.k)].filter(Boolean).join(' · ')}</small><span>${money(p.p)}</span></div><button class="up__a" data-add="${p.h}" data-variant="${esc((p.v || [])[0] || '')}" aria-label="Add ${esc(P.n)}">${icon('plus')}Add</button></div>`).join('')}</div></div>` : '';
    $('#cartItems').innerHTML = cart.length ? cart.map((i, x) => {
      const p = BY[i.h], P = PRODUCTS.find(q => q.fam === p.f), m = P && MK[P.id], ni = p.f === 'netting' && netInfo(p.s), pn = partNo(p.f, p.s);
      const det = [p.s && fmtSize(p.s), i.v, ni ? ni[2] + ' · ' + ftLen(ni[3]) + ' roll' : m && m.yd ? fmtYd(m.yd) + ' roll' : p.f === 'dots' ? dotsCount(p) : p.k && p.k !== 'Single roll' ? fmtLen(p.k) : 'Single roll'].filter(Boolean).join(' · ');
      return `<div class="ci"><a href="${P ? purl(P.id) : '#'}"><img src="${im(imgFor(p))}" alt=""></a><div class="ci__b"><a href="${P ? purl(P.id) : '#'}"><b>${P ? P.n : short(p)}</b></a><small>${det}</small><small class="ci__u">${pn ? `<span class="ci__pn">Part no. ${pn}</span> · ` : ''}${p.a ? '<i class="ok"></i>In stock' : 'Ships when available'}</small>
        <div class="ci__row"><div class="qty"><button data-q="-1" data-i="${x}" aria-label="Decrease">${icon('minus')}</button><span>${i.q}</span><button data-q="1" data-i="${x}" aria-label="Increase">${icon('plus')}</button></div><button class="ci__rm" data-rm="${x}">Remove</button></div></div><div class="ci__p">${money(p.p * i.q)}${i.q > 1 ? `<small>${money(p.p)} each</small>` : ''}</div></div>`;
    }).join('') + (n >= 10 ? `<div class="ci__bulk">${icon('chat')}<span><b>Ordering ${n}+ rolls?</b> You may qualify for bulk pricing. <button class="bulk__a" data-quote="Bulk order from cart" data-note="${n} items in cart">Get a quote</button></span></div>` : '') + upHtml
      : `<div class="ce">${icon('cart')}<p><b>Your cart is empty</b></p><p>Masking tape sold by the single roll, at a flat price.</p><div class="ce__b"><a class="bt bt--dark bt--sm" href="${B}masking-tapes/">Shop masking tapes</a><a class="bt bt--line bt--sm" href="${B}shop/">Shop all</a></div></div>` + upHtml;
    $('#cartSub').textContent = money(sub); $('#cartSub2').textContent = money(sub);
    $('#cartNi').textContent = n ? `(${n} item${n > 1 ? 's' : ''})` : '';
    $('#cartShip').innerHTML = left <= 0 ? '<b class="g">FREE</b>' : 'calculated at checkout';
    $('#cartFoot').classList.toggle('is-empty', !cart.length);
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
    if (ctx && ctx.name) { pr.hidden = false; pr.innerHTML = `${ctx.vis || ''}<span><b>${ctx.name}</b><small>${ctx.note || 'Bulk quantity pricing'}</small></span>`; $('#qfProduct').value = ctx.name + (ctx.size ? ' — ' + ctx.size : ''); }
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
    if (t && MK[t.dataset.tape] && FPS.onTape) FPS.onTape(t.dataset.tape, e);
    const l = e.target.closest('[data-line]');
    if (l && LINES[l.dataset.line] && FPS.onLine) FPS.onLine(l.dataset.line, e);
  });

  /* ================= Header menus ================= */
  const nvUl = $('#nvUl');
  const menuLink = x => `<a class="mm__l" href="${x.href}" ${x.attr || ''}><span class="th">${x.vis}</span><span><b>${x.n}${x.isNew ? ' <span class="new">New</span>' : ''}</b><small>${x.d}</small></span></a>`;
  function buildNav() {
    const maskLinks = MASK.map(m => ({ n: m.n.replace(' Tape', ''), d: m.soon ? 'Available on request' + (m.opts ? ' · ' + m.opts : '') : 'from ' + money(minP(tapeItems(m))) + ' / roll', vis: visual(m), href: purl(m.id) }));
    const lineLinks = k => PRODUCTS.filter(p => p.line === k).map(p => ({ n: p.n, d: p.soon ? 'Available on request' : 'from ' + money(pFrom(p)), vis: visual(p), href: purl(p.id) }));
    const mega = (title, links, promo, page) => `<div class="mm"><div class="w mm__in"><div><div class="mm__h"><b>${title}</b>${page ? `<a class="tl" href="${page}">View all ${icon('arrow')}</a>` : ''}</div><div class="mm__g">${links.map(menuLink).join('')}</div></div>${promo}</div></div>`;
    const promo = (h, s, vis, btn, attr) => `<div class="mm__p"><b>${h}</b><small>${s}</small>${vis}<button class="bt bt--dark bt--sm" ${attr}>${btn}</button></div>`;
    const items = [
      { n: 'Masking Tapes', main: true, panel: mega('Masking tapes', maskLinks, promo('Not sure which tape?', 'Tell us your coating and cure temperature.', `<img src="${im('cut-green-tape')}" alt="">`, 'Ask our team', 'data-quote="Masking tape recommendation"'), CATS.masking.page) },
      ...LINE_ORDER.map(k => ({ n: LINES[k].n, isNew: LINES[k].isNew, panel: mega(LINES[k].n, lineLinks(k), promo('Bulk orders', 'Deeper pricing on larger quantities.', LINES[k].img ? `<img src="${im(LINES[k].img)}" alt="">` : ILL[LINES[k].ill], 'Request a quote', `data-quote="${esc(LINES[k].n)}"`), CATS[k].page) })),
      { n: 'Industries', panel: mega('Shop by industry', INDS.map(i => ({ n: i.n, d: i.d, vis: `<img src="${im(i.img)}" alt="" style="width:50px;height:50px;object-fit:cover">`, href: B + 'industries/#' + slug(i.n) })), promo('One supplier', 'For coating, plating, packaging and screens.', `<img src="${im('cut-glass-cloth')}" alt="">`, 'Talk to sales', 'data-quote="Industry supply"'), B + 'industries/') }
    ];
    nvUl.innerHTML = items.map(x => `<li class="nv__i" data-menu><button class="nv__b ${x.main ? 'nv__b--main' : ''}" aria-expanded="false">${x.n}${x.isNew ? ' <span class="new">New</span>' : ''}${icon('chev', 'ic chev')}</button>${x.panel}</li>`).join('') +
      `<li class="nv__sp"></li><li class="nv__i"><a class="nv__b" href="${B}about/">About</a></li><li class="nv__i"><a class="nv__b" href="${B}contact/">Contact</a></li>`;
    $('#mnavList').innerHTML = items.map((x, i) => `<details class="macc" ${i === 0 ? 'open' : ''}><summary>${x.n}${x.isNew ? ' <span class="new">New</span>' : ''}${icon('chev', 'ic chev')}</summary><div class="macc__b">${(i === 0 ? maskLinks : i === items.length - 1 ? INDS.map(d => ({ n: d.n, href: B + 'industries/#' + slug(d.n) })) : lineLinks(LINE_ORDER[i - 1])).map(l => `<a href="${l.href}">${l.n}</a>`).join('')}<a href="${i === 0 ? CATS.masking.page : i === items.length - 1 ? B + 'industries/' : CATS[LINE_ORDER[i - 1]].page}"><b>View all</b></a></div></details>`).join('') + [B + 'shop/|Shop all products', B + 'bulk-quote/|Bulk quote', B + 'about/|About us', B + 'contact/|Contact', B + 'help/|FAQ & shipping'].map(x => `<a class="mnav__l" href="${x.split('|')[0]}">${x.split('|')[1]}</a>`).join('');
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
    if (c.kind === 'tape') return `<a class="ps__r" role="option" href="${purl(c.id)}"><span class="th">${c.vis}</span><span><b>${name}</b><small>${c.soon ? 'Masking tape · available on request' : 'Masking tape · single roll'}</small></span><em class="${c.soon ? 'q' : ''}">${c.soon ? 'Quote' : 'from ' + money(c.price)}</em></a>`;
    return `<a class="ps__r" role="option" href="${purl(slug(c.name))}"><span class="th">${c.vis}</span><span><b>${name}</b><small>${LINES[c.line].n} · available on request</small></span><em class="q">Quote</em></a>`;
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

  /* ================= FAQ accordion / newsletter / wordmark ================= */
  document.addEventListener('click', e => { const b = e.target.closest('.qa .q>button'); if (!b) return; const q = b.parentElement, box = q.parentElement, on = !q.classList.contains('is-open'); $$('.q', box).forEach(x => { x.classList.remove('is-open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); }); if (on) { q.classList.add('is-open'); b.setAttribute('aria-expanded', 'true'); } });
  $$('form.nl').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); const ok = $('.nl__ok', f); if (ok) ok.hidden = false; $('input', f).value = ''; }));
  const wm = $('#wm'), WL = wm ? $$('span', wm) : [];
  const hot = i => WL.forEach((l, j) => { l.classList.toggle('is-hot', j === i); l.classList.toggle('is-near', Math.abs(j - i) === 1); });
  if (wm) { wm.addEventListener('mousemove', e => { let b = 0, bd = 1e9; WL.forEach((l, j) => { const r = l.getBoundingClientRect(), dd = Math.abs(e.clientX - (r.left + r.width / 2)); if (dd < bd) { bd = dd; b = j; } }); hot(b); }); wm.addEventListener('mouseleave', () => hot(-9)); }

  /* ================= Init + shared API for page scripts ================= */
  const hooks = [];
  function renderAll() { renderCart(); hooks.forEach(f => f()); if (ps.classList.contains('is-open')) runSearch(); }
  const FPS = window.FPS = { B, PN, partNo, NETIMG, $, $$, esc, money, icon, im, fine, fmtSize, fmtLen, fmtYd, unitWord, CAT, BY, num, short, TAPE_F, singles, famAll, minP, imgFor, ILL, visual,
    MASK, MK, NET, netInfo, ftLen, tapeItems, dotsCount, LINES, LINE_ORDER, INDS, ut, toast, addToCart, openQuote, cardItems, slug, CATS, FAMINFO, PRODUCTS, PBY, purl, pItems, pFrom,
    get cart() { return cart; }, setCart(c) { cart = c; save(); renderCart(); }, onUnit(f) { hooks.push(f); }, onTape: null, onLine: null };
  Object.defineProperty(FPS, 'UNIT', { get: () => UNIT });
  buildNav(); renderCart();
})();
