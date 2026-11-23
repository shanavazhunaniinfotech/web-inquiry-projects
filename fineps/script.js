/* FinePS homepage concept — interactions */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = v => String(v).replace(/"/g, '&quot;');
  const money = n => '$' + n.toFixed(2);
  const icon = (id, cls = 'ic') => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;
  const STARS = '<span class="stars">' + icon('star').repeat(5) + '</span>';

  /* ---------------- Catalog ---------------- */
  const CAT = (window.FINEPS_CATALOG || []).map(p => {
    if (p.f === 'netting' && !p.s) {
      const m = p.t.match(/(\d?\.\d+)\D{0,4}to\s*(\d?\.\d+)/i);
      if (m) p.s = (m[1].startsWith('.') ? '0' + m[1] : m[1]) + '–' + m[2] + '"';
      else if (/450/.test(p.t)) p.s = 'Poly450 (medium)';
    }
    if (p.f === 'netting' && p.s) p.s = p.s.replace(/^(\d\.\d+)–(\d\.\d+)"$/, (a, x, y) => `${x}–${y}"`);
    return p;
  });
  const BY = Object.fromEntries(CAT.map(p => [p.h, p]));
  const num = s => { if (!s) return 999; if (s.includes('/')) { const [a, b] = s.split('/'); return parseFloat(a) / parseFloat(b); } return parseFloat(s); };
  const PACK_ORDER = ['Single roll', 'Case', '25ft', '50ft', '100ft', '250ft', '500ft', '1000ft', '15 lb roll', '100-pack'];
  const packLabel = k => ({ '25ft': '25 ft', '50ft': '50 ft', '100ft': '100 ft', '250ft': '250 ft', '500ft': '500 ft', '1000ft': '1,000 ft' }[k] || k);

  const FAM = {
    spline:  { n: 'Retainer Screen Spline', img: 'cut-round-spline', g: 'window', d: 'Round & serrated vinyl', sz: 'Diameter', tip: 'Match the diameter on your old spline’s packaging, or measure it with calipers. Not sure? Send us a photo.' },
    flat:    { n: 'Flat Screen Spline', img: 'cut-flat-spline', g: 'window', d: 'Pool cages & patios', sz: 'Width', tip: 'Flat spline is made for shallow-groove frames such as pool cages and patio enclosures.' },
    smooth:  { n: 'Smooth Spline', img: 'cut-smooth-spline', g: 'window', d: 'Gray smooth vinyl', sz: 'Diameter', tip: 'Smooth gray spline for frames that call for a non-serrated profile.' },
    bugseal: { n: 'Bug Seals', img: 'cut-bug-seal', g: 'window', d: '8 ft adjustable', tip: 'Adjustable 8 ft seals for sliding screen doors — trim to fit.' },
    clips:   { n: 'Screen Clips', img: 'cut-screen-clips', g: 'window', d: 'Diecast zinc, 100-pack', tip: '7/16" diecast zinc clips hold screen frames securely in the window.' },
    tool:    { n: 'Screen Roller Tool', img: 'cut-roller-tool', g: 'window', d: 'Steel bearing wheels', tip: 'Convex and concave steel wheels on a hardwood handle — the one tool every screen job needs.' },
    netting: { n: 'PE Protective Netting', img: 'cut-netting-orange', g: 'protect', d: 'Stretch sleeves', sz: 'Stretch range', tip: 'Pick a stretch range that covers your part’s diameter — the netting expands to slide over odd shapes.' },
    spiral:  { n: 'Spiral Cable Wrap', img: 'cut-spiral-wrap', g: 'protect', d: 'Hose & wire protection', sz: 'Inner diameter', tip: 'Choose the size that wraps around your hose or cable bundle. Available in black and yellow.' },
    pet:     { n: 'Green PET Tape', img: 'cut-green-tape', g: 'mask', d: 'High-temp masking', sz: 'Width', tip: 'Green polyester tape built for high-temperature powder-coat masking. 72 yd rolls.' },
    dots:    { n: 'Green Masking Dots', img: 'cut-green-dots', g: 'mask', d: 'Pre-cut discs', sz: 'Diameter', tip: 'Pre-cut green discs mask holes and studs fast — no trimming.' },
    glass:   { n: 'Glass Cloth Tape', img: 'cut-glass-cloth', g: 'mask', d: '32 yd rolls', sz: 'Width', tip: 'Glass cloth tape for demanding high-heat masking jobs. 32 yd rolls.' },
    paper:   { n: 'Paper Masking Tape', img: 'cut-paper-tape', g: 'mask', d: 'Low-temp, 54 yd', sz: 'Width', tip: 'Low-temperature paper tape for painting and lower-heat coating. 54 yd rolls.' },
    spring:  { n: 'Tender Spring Kit', img: 'cut-tender-spring', g: 'auto', d: '25" heavy duty', tip: 'Heavy-duty 25" tracker tender spring kit for semi-trucks and trailers.' }
  };
  const famItems = f => CAT.filter(p => p.f === f);
  const imgFor = p => {
    if (p.f === 'netting') {
      const t = p.t.toLowerCase();
      for (const c of ['red', 'orange', 'blue', 'yellow', 'gray', 'brown']) if (t.includes(c)) return 'cut-netting-' + c;
      const s = num(p.s);
      return 'cut-netting-' + (s < 1 ? 'blue' : s < 2.5 ? 'yellow' : s < 3.5 ? 'red' : s < 4.5 ? 'gray' : 'orange');
    }
    if (p.f === 'spline') return p.k === '15 lb roll' ? 'cut-spline-15lb' : p.k === '100ft' ? 'cut-spline-coil' : 'cut-round-spline';
    if (p.f === 'flat') return p.k === '1000ft' || p.k === '500ft' ? 'cut-flat-1000' : 'cut-flat-spline';
    if (p.f === 'bugseal' && /vinyl/i.test(p.t)) return 'cut-bug-seal-2';
    if (p.f === 'pet' && p.k === 'Case') return 'cut-green-tape-2';
    return FAM[p.f].img;
  };
  const shortTitle = p => p.t.replace(/\s*[|–-]\s*(Flexible Polyethylene.*|Durable.*|Easy.*)$/i, '').replace(/\s+/g, ' ');
  const sizesOf = f => [...new Set(famItems(f).map(p => p.s).filter(Boolean))].sort((a, b) => num(a) - num(b));
  const packsOf = f => [...new Set(famItems(f).map(p => p.k).filter(Boolean))].sort((a, b) => PACK_ORDER.indexOf(a) - PACK_ORDER.indexOf(b));
  const fmtSize = s => (s && /^\d\.\d{3}$/.test(s)) ? s.replace(/^0/, '') + '"' : s;

  /* ---------------- Toast ---------------- */
  let tT;
  function toast(msg) { const t = $('#toast'); t.innerHTML = icon('check') + msg; t.classList.add('is-on'); clearTimeout(tT); tT = setTimeout(() => t.classList.remove('is-on'), 2600); }

  /* ---------------- Cart ---------------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('fineps-cart') || '[]').filter(i => BY[i.h]); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem('fineps-cart', JSON.stringify(cart)); } catch (e) {} };
  function addToCart(h, qty = 1, variant = '') {
    const p = BY[h]; if (!p) return;
    const ex = cart.find(i => i.h === h && i.v === variant);
    ex ? ex.q += qty : cart.push({ h, q: qty, v: variant });
    save(); renderCart();
    const c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    toast(`Added: ${shortTitle(p).slice(0, 48)}${shortTitle(p).length > 48 ? '…' : ''}`);
  }
  function renderCart() {
    const n = cart.reduce((a, i) => a + i.q, 0);
    $('#cartCount').textContent = n;
    $('#cartN').textContent = n ? `(${n})` : '';
    const box = $('#cartItems');
    if (!cart.length) box.innerHTML = `<div class="cempty">${icon('cart')}<p><b>Your cart is empty</b></p><a class="btn btn--dark btn--sm" href="#categories" data-close-cart>Start shopping</a></div>`;
    else box.innerHTML = cart.map((i, idx) => { const p = BY[i.h]; return `
      <div class="citem"><img src="images/${imgFor(p)}.webp" alt="">
        <div><b>${shortTitle(p)}</b><small>${[i.v, p.k && packLabel(p.k)].filter(Boolean).join(' · ')}</small>
          <div class="qty"><button data-q="-1" data-i="${idx}" aria-label="Decrease">${icon('minus')}</button><span>${i.q}</span><button data-q="1" data-i="${idx}" aria-label="Increase">${icon('plus')}</button></div></div>
        <div class="citem__p">${money(p.p * i.q)}<button class="citem__rm" data-rm="${idx}">Remove</button></div></div>`; }).join('');
    $('#cartSub').textContent = money(cart.reduce((a, i) => a + BY[i.h].p * i.q, 0));
    const hasScreen = cart.some(i => ['spline', 'flat', 'smooth'].includes(BY[i.h].f));
    const hasTool = cart.some(i => BY[i.h].f === 'tool');
    const up = $('#cartUpsell');
    const tool = CAT.find(p => p.f === 'tool');
    up.innerHTML = hasScreen && !hasTool && tool ? `<img src="images/cut-roller-tool.webp" alt=""><div><b>Add the Screen Roller Tool</b><small>Most spline buyers add one · ${money(tool.p)}</small></div><button class="add" data-add="${tool.h}">${icon('plus')}Add</button>` : '';
  }
  $('#cartItems').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    if (q) { const i = cart[+q.dataset.i]; i.q += +q.dataset.q; if (i.q < 1) cart.splice(+q.dataset.i, 1); }
    if (rm) cart.splice(+rm.dataset.rm, 1);
    if (q || rm) { save(); renderCart(); }
  });
  const openCart = () => { closeAll(); $('#cart').classList.add('is-open'); $('#cart').setAttribute('aria-hidden', 'false'); };
  const closeCart = () => { $('#cart').classList.remove('is-open'); $('#cart').setAttribute('aria-hidden', 'true'); };
  $('#openCart').addEventListener('click', openCart);
  $('#cart').addEventListener('click', e => { if (e.target.id === 'cart' || e.target.closest('[data-close-cart]')) closeCart(); });
  $('#checkout').addEventListener('click', () => toast('Prototype: this opens Shopify secure checkout'));

  // global [data-add] buttons
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    e.preventDefault(); addToCart(b.dataset.add, 1, b.dataset.variant || '');
    if (b.classList.contains('add')) { const o = b.innerHTML; b.classList.add('is-done'); b.innerHTML = icon('check') + 'Added'; setTimeout(() => { b.classList.remove('is-done'); b.innerHTML = o; }, 1400); }
  });

  /* ---------------- Header menus (hover intent + click + keyboard) ---------------- */
  const menus = $$('[data-menu]');
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)');
  function setOpen(li, on) {
    li.classList.toggle('is-open', on);
    const b = li.querySelector(':scope > button'); if (b) b.setAttribute('aria-expanded', on);
  }
  function closeAll(except) { menus.forEach(m => m !== except && setOpen(m, false)); }
  menus.forEach(li => {
    let tIn, tOut;
    li.addEventListener('mouseenter', () => { if (!fine.matches) return; clearTimeout(tOut); tIn = setTimeout(() => { closeAll(li); setOpen(li, true); }, 70); });
    li.addEventListener('mouseleave', () => { if (!fine.matches) return; clearTimeout(tIn); tOut = setTimeout(() => setOpen(li, false), 180); });
    const btn = li.querySelector(':scope > button');
    btn.addEventListener('click', () => { const on = !li.classList.contains('is-open'); closeAll(li); setOpen(li, on); });
    li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) setOpen(li, false); });
    li.addEventListener('click', e => { if (e.target.closest('a')) setOpen(li, false); });
  });
  document.addEventListener('click', e => { if (!e.target.closest('[data-menu]')) closeAll(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open = menus.find(m => m.classList.contains('is-open'));
    if (open) { setOpen(open, false); open.querySelector('button').focus(); }
    closeCart(); closeSearch(); closeMnav();
  });

  // header shadow + mobile sticky bar
  const hdr = $('#hdr'), mbar = $('#mbar');
  const onScroll = () => { hdr.classList.toggle('is-scrolled', scrollY > 10); mbar.classList.toggle('is-on', scrollY > 700); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------------- Mobile nav ---------------- */
  const mnav = $('#mnav');
  function closeMnav() { mnav.classList.remove('is-open'); mnav.setAttribute('aria-hidden', 'true'); $('#burger').setAttribute('aria-expanded', 'false'); }
  $('#burger').addEventListener('click', () => { mnav.classList.add('is-open'); mnav.setAttribute('aria-hidden', 'false'); $('#burger').setAttribute('aria-expanded', 'true'); });
  mnav.addEventListener('click', e => { if (e.target === mnav || e.target.closest('[data-close-mnav]') || e.target.closest('a')) closeMnav(); });
  $('[data-msearch]').addEventListener('keydown', e => { if (e.key === 'Enter') { closeMnav(); openSearch(e.target.value); } });

  /* ---------------- Search ---------------- */
  const search = $('#search'), sIn = $('#searchInput');
  function openSearch(q = '') { closeAll(); search.classList.add('is-open'); search.setAttribute('aria-hidden', 'false'); sIn.value = q; runSearch(); setTimeout(() => sIn.focus(), 60); }
  function closeSearch() { search.classList.remove('is-open'); search.setAttribute('aria-hidden', 'true'); }
  function runSearch() {
    let q = sIn.value.toLowerCase().trim().replace(/(^|\s)\.(\d)/g, '$10.$2');
    const words = q.split(/\s+/).filter(Boolean);
    let res = words.length ? CAT.filter(p => { const hay = (p.t + ' ' + FAM[p.f].n + ' ' + (p.s || '')).toLowerCase(); return words.every(w => hay.includes(w)); }) : CAT.filter(p => ['0-185-inch-window-screen-spline-250ft-roll', '0-290-inch-flat-screen-spline-250ft', 'screen-roller-tool-door-window-screen-installation-repair', 'spiral-cable-wrap-3-4-inch-hose-protector-flexible-polyethylene-wire-conduit-tubing-cable-sleeve-cord-cover-to-organize-wires-and-hose', 'poly200green-net', 'green-pet-tape-1-inch-x-72-yard-single-roll'].includes(p.h));
    res = res.sort((a, b) => b.a - a.a).slice(0, 10);
    $('#searchRes').innerHTML = res.length ? res.map(p => `<button class="sres" data-add="${p.h}"><img src="images/${imgFor(p)}.webp" alt=""><span><b>${shortTitle(p)}</b><small>${FAM[p.f].n}${p.a ? '' : ' · Sold out'}</small></span><em>${money(p.p)}</em></button>`).join('')
      : `<p class="search__empty">No exact match for “${sIn.value}”. Try the <a href="#finder" data-close-search>Product Finder</a> or <a href="#support" data-close-search>ask our team</a>.</p>`;
  }
  sIn.addEventListener('input', runSearch);
  $('#openSearch').addEventListener('click', () => openSearch());
  search.addEventListener('click', e => {
    if (e.target === search || e.target.closest('[data-close-search]')) closeSearch();
    const pop = e.target.closest('.search__pop button'); if (pop) { sIn.value = pop.textContent; runSearch(); sIn.focus(); }
  });
  document.addEventListener('keydown', e => { if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); } });

  /* ---------------- Shop by category ---------------- */
  const CATS = ['spline', 'flat', 'smooth', 'tool', 'bugseal', 'clips', 'netting', 'spiral', 'pet', 'dots', 'glass', 'paper', 'spring'];
  const catTag = { spline: 'Best seller', netting: 'Bulk spools', pet: 'High-temp', spiral: 'Sale' };
  $('#catGrid').innerHTML = CATS.map((f, i) => {
    const it = famItems(f), m = FAM[f], min = Math.min(...it.map(p => p.p)), sz = sizesOf(f);
    const g = f === 'spring' ? 'protect' : m.g;
    return `<a class="cat reveal ${i === 0 ? 'is-feature' : ''}" href="#finder" data-fam="${f}" data-g="${g}">
      ${catTag[f] ? `<span class="cat__tag">${catTag[f]}</span>` : ''}
      <span class="cat__go">${icon('arrow')}</span>
      <span class="cat__img"><img src="images/${f === 'spline' ? 'cut-spline-15lb' : m.img}.webp" alt="${m.n}" loading="lazy"></span>
      <span class="cat__body"><span class="cat__name">${m.n}</span>
        <span class="cat__meta"><span>${sz.length ? sz.length + ' sizes' : m.d}</span><span>from <b>${money(min)}</b></span></span>
        ${sz.length ? `<span class="cat__sizes">${sz.slice(0, i === 0 ? 10 : 4).map(s => `<span>${fmtSize(s)}</span>`).join('')}${sz.length > (i === 0 ? 10 : 4) ? '<span>+' + (sz.length - (i === 0 ? 10 : 4)) + '</span>' : ''}</span>` : ''}
      </span></a>`;
  }).join('') + `<a class="cat cat--all reveal" href="#bestsellers" data-g="all"><span class="cat__go">${icon('arrow')}</span><span><span class="cat__name">Shop all ${CAT.length} products</span><small>Every size, every roll, every case</small></span></a>`;
  function tabs(tablist, onSel) {
    tablist.addEventListener('click', e => {
      const b = e.target.closest('[role=tab]'); if (!b) return;
      $$('[role=tab]', tablist).forEach(x => x.setAttribute('aria-selected', x === b));
      onSel(b);
    });
  }
  tabs($('#catTabs'), b => $$('#catGrid .cat').forEach(c => c.classList.toggle('is-hidden', b.dataset.g !== 'all' && c.dataset.g !== b.dataset.g && c.dataset.g !== 'all')));

  /* ---------------- Best sellers (configurable cards) ---------------- */
  const BEST = [
    { f: 'spline', t: 'Round Retainer Screen Spline', sub: 'Serrated hollow-core black vinyl', badges: [['Best seller', 'green']], r: '4.9', rc: 214, def: { s: '0.185', k: '250ft' }, sizeSel: true },
    { f: 'flat', t: 'Flat Screen Spline', sub: 'For pool cages & patio enclosures', badges: [['Contractor pick', '']], r: '4.8', rc: 96, def: { s: '0.290', k: '250ft' } },
    { f: 'spiral', t: 'Spiral Cable Wrap', sub: 'Polyethylene hose & wire protector', badges: [['Sale', 'amber']], r: '4.8', rc: 71, def: { s: '3/4"', k: '25ft' }, colors: true },
    { f: 'tool', t: 'Screen Roller Tool', sub: 'Steel bearing wheels · hardwood handle', badges: [['Must-have', 'soft']], r: '4.7', rc: 158 },
    { f: 'netting', t: 'PE Protective Netting', sub: 'Expandable stretch sleeve spools', badges: [['Bulk spool', '']], r: '4.9', rc: 43, def: { s: '2.00–2.50"' }, sizeSel: true },
    { f: 'pet', t: 'Green Polyester PET Tape', sub: 'High-temp powder-coat masking · 72 yd', badges: [['High-temp', 'green']], r: '4.8', rc: 64, def: { s: '1"', k: 'Single roll' } },
    { f: 'paper', t: 'Low-Temp Paper Masking Tape', sub: '54 yd rolls · single or case of 24', badges: [['Case deal', 'amber']], r: '4.7', rc: 38, def: { s: '2"', k: 'Single roll' } },
    { f: 'clips', t: '7/16" Window Screen Clips', sub: 'Diecast zinc fasteners · 100-pack', badges: [['New', 'soft']], r: '4.8', rc: 27 }
  ];
  const state = {};
  function pick(cfg, st) {
    const it = famItems(cfg.f);
    return it.find(p => (!st.s || p.s === st.s) && (!st.k || p.k === st.k)) || null;
  }
  function cardHTML(cfg, i) {
    const st = state[i]; const p = pick(cfg, st); const sizes = sizesOf(cfg.f); const packs = packsOf(cfg.f);
    const sizeOpts = sizes.length > 1 ? (cfg.sizeSel
      ? `<label class="opt"><span class="opt__l">${FAM[cfg.f].sz}</span><select data-o="s">${sizes.map(s => `<option ${s === st.s ? 'selected' : ''} value="${esc(s)}">${fmtSize(s)}</option>`).join('')}</select></label>`
      : `<div class="opt"><span class="opt__l">${FAM[cfg.f].sz}</span><div class="opt__row">${sizes.map(s => `<button class="chip" data-o="s" data-v="${esc(s)}" aria-pressed="${s === st.s}">${fmtSize(s)}</button>`).join('')}</div></div>`) : '';
    const packOpts = packs.length > 1 ? `<div class="opt"><span class="opt__l">${cfg.f === 'netting' ? 'Spool' : 'Quantity'}</span><div class="opt__row">${packs.map(k => { const ok = famItems(cfg.f).some(x => x.s === st.s && x.k === k); return `<button class="chip" data-o="k" data-v="${k}" aria-pressed="${k === st.k}" ${ok ? '' : 'disabled'}>${packLabel(k)}</button>`; }).join('')}</div></div>` : '';
    const colorOpts = cfg.colors && p && p.v.length ? `<div class="opt"><span class="opt__l">Color</span><div class="opt__row">${p.v.map(c => `<button class="chip" data-o="c" data-v="${c}" aria-pressed="${c === (st.c || p.v[0])}">${c}</button>`).join('')}</div></div>` : '';
    const priceHTML = p ? `${money(p.p)}${p.c ? `<s>${money(p.c)}</s>` : ''}<small>${p.k ? packLabel(p.k) : 'Each'}${cfg.f === 'paper' && p.k === 'Case' ? ' · ' + money(p.p / 24) + '/roll' : ''}</small>` : '—';
    return `<article class="pcard reveal" data-i="${i}" data-g="${FAM[cfg.f].g}">
      <div class="pcard__media"><div class="pcard__badges">${cfg.badges.map(([t, c]) => `<span class="badge ${c ? 'badge--' + c : ''}">${t}</span>`).join('')}</div>
        <img src="images/${p ? imgFor(p) : FAM[cfg.f].img}.webp" alt="${cfg.t}" loading="lazy">${st.s ? `<span class="pcard__spec">${fmtSize(st.s)}</span>` : ''}</div>
      <div class="pcard__body">
        <div class="pcard__rate">${STARS}<span>${cfg.r} (${cfg.rc})</span></div>
        <h3 class="pcard__t">${cfg.t}</h3><p class="pcard__sub">${cfg.sub}</p>
        ${sizeOpts}${packOpts}${colorOpts}
        <div class="pcard__foot"><div class="price">${priceHTML}</div>
          <button class="add" ${p && p.a ? `data-add="${p.h}" data-variant="${cfg.colors ? (st.c || p.v[0] || '') : ''}"` : 'disabled'}>${p && p.a ? icon('cart') + 'Quick add' : 'Sold out'}</button></div>
      </div></article>`;
  }
  BEST.forEach((cfg, i) => {
    const st = state[i] = Object.assign({}, cfg.def || {});
    const p = pick(cfg, st);
    if (p && !p.a) { const alt = famItems(cfg.f).find(x => x.a && x.s === st.s) || famItems(cfg.f).find(x => x.a); if (alt) { st.s = alt.s; st.k = alt.k; } }
  });
  $('#bestGrid').innerHTML = BEST.map(cardHTML).join('');
  $('#bestGrid').addEventListener('click', e => {
    const c = e.target.closest('.chip[data-o]'); if (!c) return;
    const card = c.closest('.pcard'), i = +card.dataset.i, st = state[i], cfg = BEST[i];
    st[c.dataset.o] = c.dataset.v;
    if (c.dataset.o === 's' && !famItems(cfg.f).some(x => x.s === st.s && x.k === st.k)) { const alt = famItems(cfg.f).find(x => x.s === st.s); st.k = alt && alt.k; }
    rerender(card, i);
  });
  $('#bestGrid').addEventListener('change', e => {
    const s = e.target.closest('select[data-o]'); if (!s) return;
    const card = s.closest('.pcard'), i = +card.dataset.i, st = state[i], cfg = BEST[i];
    st.s = s.value; if (!famItems(cfg.f).some(x => x.s === st.s && x.k === st.k)) { const alt = famItems(cfg.f).find(x => x.s === st.s); st.k = alt && alt.k; }
    rerender(card, i);
  });
  function rerender(card, i) { const tmp = document.createElement('div'); tmp.innerHTML = cardHTML(BEST[i], i); const n = tmp.firstElementChild; n.classList.add('is-in'); n.classList.toggle('is-hidden', card.classList.contains('is-hidden')); card.replaceWith(n); }
  tabs($('#bestTabs'), b => $$('#bestGrid .pcard').forEach(c => c.classList.toggle('is-hidden', b.dataset.g !== 'all' && c.dataset.g !== b.dataset.g)));

  /* ---------------- Industries accordion ---------------- */
  const inds = $$('#indAcc .ind');
  function openInd(el) { inds.forEach(x => x.classList.toggle('is-open', x === el)); }
  inds.forEach(el => {
    el.addEventListener('click', e => { if (!el.classList.contains('is-open')) { e.preventDefault(); openInd(el); } });
    el.addEventListener('mouseenter', () => { if (fine.matches && innerWidth > 1060) openInd(el); });
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { if (e.target === el) { e.preventDefault(); openInd(el); } } });
  });
  $$('[data-ind]').forEach(a => a.tagName === 'A' && a.addEventListener('click', () => { const t = inds.find(x => x.dataset.ind === a.dataset.ind); t && openInd(t); }));

  /* ---------------- Featured solution (with kit builder) ---------------- */
  const SOL = [
    { img: 'app-red-netting', problem: 'Finished parts get nicked, scratched and tangled in transit.',
      k: 'SOLUTION 01 — PART PROTECTION', h: 'Ship precision parts without a single scratch.',
      bad: 'Scratched flanges and threads mean returns, rework and unhappy customers.',
      good: 'Stretch-fit PE netting slides over odd shapes and protects every surface.',
      steps: ['Measure the part', 'Pick a stretch range', 'Cut & slide on'],
      hot: [[44, 42, 'Stretch-fit sleeve', 'Expands over flanges and odd-shaped housings.'], [33, 62, 'Labelled & ready to ship', 'Clean, professional presentation for your customers.'], [56, 22, 'Breathable mesh', 'Protects surfaces without trapping moisture.']],
      prods: ['poly200green-net', 'mesh-protective-sleeves-1x4-to-1x2-inch'] },
    { img: 'app-screened-porch', problem: 'Torn or sagging screens let bugs in and look neglected.',
      k: 'SOLUTION 02 — SCREEN REPAIR', h: 'Tight, professional screens in one afternoon.',
      bad: 'The wrong spline size pops out of the channel and the mesh sags.',
      good: 'The exact diameter locks the mesh drum-tight — for years.',
      steps: ['Check the old size', 'Lay the new mesh', 'Roll in & trim'],
      hot: [[22, 34, 'Exact-fit spline', '40+ diameters so it locks into your channel.'], [46, 26, 'UV-stabilised vinyl', 'Stays flexible in full sun.'], [38, 72, 'Bug-free living', 'Add bug seals to sliding doors.']],
      prods: ['0-185-inch-window-screen-spline-250ft-roll', 'screen-roller-tool-door-window-screen-installation-repair', '7-16-inch-window-screen-clips-diecast-zinc-fasteners'] },
    { img: 'app-hydraulic-wrap', problem: 'Exposed hoses and cables chafe, crack and fail early.',
      k: 'SOLUTION 03 — HOSE & CABLE', h: 'Add years to hoses, lines and wiring.',
      bad: 'Abrasion wears through hose covers and cable jackets — costly downtime.',
      good: 'Spiral wrap takes the wear, keeps runs organised and easy to spot.',
      steps: ['Measure the hose', 'Pick size & colour', 'Twist it on'],
      hot: [[46, 70, 'Abrasion shield', 'Polyethylene coil takes the wear instead of the hose.'], [30, 40, 'High-vis yellow', 'Spot lines at a glance on the shop floor.']],
      prods: ['spiral-cable-wrap-3-4-inch-hose-protector-flexible-polyethylene-wire-conduit-tubing-cable-sleeve-cord-cover-to-organize-wires-and-hose', '2-inch-spiral-hydraulic-hose-wrap-100-ft-flexible-polyethylene-hose-and-wire-protector'] }
  ];
  let solI = 0;
  function renderSol(i) {
    solI = i; const s = SOL[i];
    const prods = s.prods.map(h => BY[h]).filter(p => p && p.a);
    $('#solStage').innerHTML = `
      <div class="sol__img"><img src="images/${s.img}.webp" alt="${s.h}" loading="lazy">
        <div class="sol__problem"><span class="mono">PROBLEM</span>${s.problem}</div>
        ${s.hot.map((h, j) => `<button class="hot" style="--x:${h[0]}%;--y:${h[1]}%" data-h="${j}" aria-label="${h[2]}"><span>${j + 1}</span></button><div class="hot__tip" style="--x:${h[0]}%;--y:${h[1]}%" data-t="${j}"><b>${h[2]}</b>${h[3]}</div>`).join('')}
      </div>
      <div class="sol__panel">
        <p class="mono sol__k">${s.k}</p><h3>${s.h}</h3>
        <ul class="sol__pf"><li class="is-bad">${icon('x')}<span>${s.bad}</span></li><li class="is-good">${icon('check')}<span>${s.good}</span></li></ul>
        <ol class="sol__steps">${s.steps.map(x => `<li>${x}</li>`).join('')}</ol>
        <div class="kit">
          <div class="kit__h"><b>Build your kit</b><span>${prods.length} items</span></div>
          ${prods.map(p => `<label class="kit__item"><input type="checkbox" checked value="${p.h}"><img src="images/${imgFor(p)}.webp" alt=""><span><b>${shortTitle(p).slice(0, 46)}${shortTitle(p).length > 46 ? '…' : ''}</b><small>${p.k ? packLabel(p.k) : 'Each'}${p.c ? ' · was ' + money(p.c) : ''}</small></span><em>${money(p.p)}</em></label>`).join('')}
          <div class="kit__foot"><div class="kit__tot"><small>Kit total</small><b id="kitTot"></b></div><button class="btn btn--green" id="kitAdd">${icon('cart')}<span>Add kit to cart</span></button></div>
          <p class="kit__trust"><span>${icon('truck')}Fast shipping</span><span>${icon('return')}30-day returns</span></p>
        </div>
      </div>`;
    kitTotal();
  }
  function kitTotal() {
    const items = $$('#solStage .kit__item');
    let t = 0, n = 0;
    items.forEach(l => { const c = l.querySelector('input'); l.classList.toggle('is-off', !c.checked); if (c.checked) { t += BY[c.value].p; n++; } });
    $('#kitTot').textContent = money(t);
    const b = $('#kitAdd'); b.disabled = !n; b.querySelector('span').textContent = n ? `Add ${n === items.length ? 'kit' : n + ' item' + (n > 1 ? 's' : '')} to cart` : 'Select items';
  }
  renderSol(0);
  const solTabs = $('#solTabs');
  let solTimer = null;
  const solAuto = () => { clearInterval(solTimer); solTimer = setInterval(() => { if (solTabs.classList.contains('is-paused')) return; const n = (solI + 1) % SOL.length; $$('[role=tab]', solTabs).forEach(x => x.setAttribute('aria-selected', +x.dataset.s === n)); renderSol(n); }, 9000); };
  tabs(solTabs, b => { renderSol(+b.dataset.s); solAuto(); });
  solAuto();
  $('#solution').addEventListener('mouseenter', () => solTabs.classList.add('is-paused'));
  $('#solution').addEventListener('mouseleave', () => solTabs.classList.remove('is-paused'));
  $('#solStage').addEventListener('change', e => { if (e.target.matches('.kit__item input')) kitTotal(); });
  $('#solStage').addEventListener('click', e => {
    if (e.target.closest('#kitAdd')) {
      const hs = $$('#solStage .kit__item input:checked').map(c => c.value);
      hs.forEach(h => addToCart(h, 1, (BY[h].v || [])[0] || ''));
      toast(`Added ${hs.length} item${hs.length > 1 ? 's' : ''} to your cart`); openCart();
      clearInterval(solTimer);
    }
    const h = e.target.closest('.hot'); if (h) $$('#solStage .hot__tip').forEach(t => t.classList.toggle('is-on', t.dataset.t === h.dataset.h && !t.classList.contains('is-on')));
  });
  $('#solStage').addEventListener('mouseover', e => { const h = e.target.closest('.hot'); if (h) $$('#solStage .hot__tip').forEach(t => t.classList.toggle('is-on', t.dataset.t === h.dataset.h)); });
  $('#solStage').addEventListener('mouseout', e => { if (e.target.closest('.hot')) $$('#solStage .hot__tip').forEach(t => t.classList.remove('is-on')); });

  /* ---------------- Product finder ---------------- */
  const APPS = [
    { id: 'window', n: 'Window & door screens', d: 'Screens, doors & pool cages', ic: 'home', img: 'app-screened-porch', f: ['spline', 'flat', 'smooth', 'tool', 'bugseal', 'clips'] },
    { id: 'pack', n: 'Parts & packaging', d: 'Prevent nicks & scratches in transit', ic: 'package', img: 'app-red-netting', f: ['netting', 'spiral'] },
    { id: 'hose', n: 'Hoses, cables & wiring', d: 'Shield & organise lines', ic: 'zap', img: 'app-cable-wrap', f: ['spiral', 'netting'] },
    { id: 'mask', n: 'Masking & coating', d: 'Powder coat, paint & high heat', ic: 'roller', img: 'app-machined-parts', f: ['pet', 'dots', 'glass', 'paper'] },
    { id: 'auto', n: 'Truck & trailer', d: 'Semi-truck & trailer parts', ic: 'truck', img: 'app-hydraulic-wrap', f: ['spring', 'spiral'] }
  ];
  const fs = { app: null, fam: null, s: null, k: null, sel: null };
  const step = n => {
    $$('#finderPanel .fstep').forEach(x => x.hidden = +x.dataset.step !== n);
    $$('#fSteps li').forEach((li, i) => { li.classList.toggle('is-active', i === n - 1); li.classList.toggle('is-done', i < n - 1); li.querySelector('span').innerHTML = i < n - 1 ? icon('check', 'ic ic--sm') : i + 1; });
    renderMatch();
  };
  $('#fApps').innerHTML = APPS.map(a => `<button class="fapp" data-app="${a.id}"><img src="images/${a.img}.webp" alt="" loading="lazy"><span class="fapp__go">${icon('arrow')}</span><span class="fapp__b">${icon(a.ic)}<b>${a.n}</b><small>${a.d}</small></span></button>`).join('');
  $('#fApps').addEventListener('click', e => { const b = e.target.closest('[data-app]'); if (b) chooseApp(b.dataset.app); });
  function chooseApp(id) {
    fs.app = id; fs.fam = null; fs.sel = null; const a = APPS.find(x => x.id === id);
    $('#fFams').innerHTML = a.f.map((f, i) => { const it = famItems(f); return `<button class="ffam" data-f="${f}" style="animation-delay:${i * 50}ms"><span class="ffam__img"><img src="images/${FAM[f].img}.webp" alt=""></span><span class="ffam__b"><b>${FAM[f].n}</b><small><span>${it.length} option${it.length > 1 ? 's' : ''}</span><em>from ${money(Math.min(...it.map(p => p.p)))}</em></small></span></button>`; }).join('');
    step(2);
  }
  $('#fFams').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (b) chooseFam(b.dataset.f); });
  $$('.fback').forEach(b => b.addEventListener('click', () => { const g = +b.dataset.goto; if (g === 2 && fs.app) chooseApp(fs.app); else step(1); }));
  function chooseFam(f) {
    fs.fam = f; const sizes = sizesOf(f); fs.s = sizes.length ? (f === 'spline' && sizes.includes('0.185') ? '0.185' : sizes[0]) : null; fs.k = null;
    if (!fs.app || !APPS.find(a => a.id === fs.app).f.includes(f)) fs.app = APPS.find(a => a.f.includes(f)).id;
    if (!$('#fFams').innerHTML.includes(`data-f="${f}"`)) { const a = APPS.find(x => x.id === fs.app); $('#fFams').innerHTML = a.f.map(x => `<button class="ffam" data-f="${x}"><span class="ffam__img"><img src="images/${FAM[x].img}.webp" alt=""></span><span class="ffam__b"><b>${FAM[x].n}</b><small><span>${famItems(x).length} options</span><em>from ${money(Math.min(...famItems(x).map(p => p.p)))}</em></small></span></button>`).join(''); }
    $('#fSizeQ').textContent = sizes.length ? `Choose ${FAM[f].sz.toLowerCase()}` : FAM[f].n;
    $('#fTip').innerHTML = icon('help') + '<span>' + FAM[f].tip + '</span>';
    renderFinder(); step(3);
  }
  function renderFinder() {
    const f = fs.fam, sizes = sizesOf(f), packs = [...new Set(famItems(f).filter(p => !fs.s || p.s === fs.s).map(p => p.k).filter(Boolean))].sort((a, b) => PACK_ORDER.indexOf(a) - PACK_ORDER.indexOf(b));
    $('#fSizes').innerHTML = sizes.length ? `<span class="flabel">${FAM[f].sz}</span>` + sizes.map(s => `<button class="chip" data-fs="${esc(s)}" aria-pressed="${s === fs.s}">${fmtSize(s)}</button>`).join('') : '';
    if (fs.k && !packs.includes(fs.k)) fs.k = null;
    $('#fPacks').innerHTML = packs.length > 1 ? `<span class="flabel">Quantity</span><button class="chip" data-fk="" aria-pressed="${!fs.k}">All</button>` + packs.map(k => `<button class="chip" data-fk="${k}" aria-pressed="${k === fs.k}">${packLabel(k)}</button>`).join('') : '';
    const res = famItems(f).filter(p => (!fs.s || p.s === fs.s) && (!fs.k || p.k === fs.k)).sort((a, b) => (b.a - a.a) || PACK_ORDER.indexOf(a.k) - PACK_ORDER.indexOf(b.k));
    if (!fs.sel || !res.includes(BY[fs.sel])) fs.sel = (res.find(p => p.a) || res[0] || {}).h || null;
    $('#fResults').innerHTML = res.length ? `<span class="flabel">${res.length} match${res.length > 1 ? 'es' : ''}</span>` + res.map((p, i) => `<div class="fres ${p.h === fs.sel ? 'is-sel' : ''}" data-sel="${p.h}" style="animation-delay:${i * 40}ms"><img src="images/${imgFor(p)}.webp" alt=""><div><b>${shortTitle(p)}</b><small>${[fmtSize(p.s), p.k && packLabel(p.k), p.v.length ? p.v.join(' / ') : ''].filter(Boolean).join(' · ')}</small>${p.a ? '' : '<span class="oos">Sold out — notify me</span>'}</div><div class="fres__r"><span class="fres__price">${money(p.p)}</span><button class="add" ${p.a ? `data-add="${p.h}" data-variant="${p.v[0] || ''}"` : 'disabled'}>${p.a ? icon('cart') + 'Add' : 'Sold out'}</button></div></div>`).join('')
      : `<p class="ftip">${icon('help')}<span>No exact match — <a class="tlink" href="#wholesale">request it</a></span></p>`;
    renderMatch();
  }
  function renderMatch() {
    const app = APPS.find(a => a.id === fs.app), p = fs.sel && BY[fs.sel], fam = fs.fam && FAM[fs.fam];
    const onStep3 = !$('#finderPanel [data-step="3"]').hidden;
    const img = p && onStep3 ? imgFor(p) : fam ? fam.img : null;
    $('#fMatch').innerHTML = `
      <div class="fmatch__h"><span class="mono">YOUR MATCH</span><span class="fmatch__st ${p && onStep3 ? 'is-ok' : ''}">${p && onStep3 ? 'Ready to order' : 'In progress'}</span></div>
      <div class="fmatch__img">${img ? `<img src="images/${img}.webp" alt="">${p && onStep3 && p.s ? `<span class="pcard__spec">${fmtSize(p.s)}</span>` : ''}` : `<div class="fmatch__ph">${icon('target')}<span>Pick an application to start matching</span></div>`}</div>
      <dl>
        <dt>Application</dt><dd class="${app ? '' : 'is-empty'}">${app ? app.n : '—'}</dd>
        <dt>Product</dt><dd class="${fam ? '' : 'is-empty'}">${fam ? fam.n : '—'}</dd>
        <dt>Size</dt><dd class="${p && onStep3 && p.s ? '' : 'is-empty'}">${p && onStep3 && p.s ? fmtSize(p.s) : '—'}</dd>
        <dt>Quantity</dt><dd class="${p && onStep3 && p.k ? '' : 'is-empty'}">${p && onStep3 && p.k ? packLabel(p.k) : '—'}</dd>
      </dl>
      ${p && onStep3 ? `<div class="fmatch__buy"><span class="fmatch__t">${shortTitle(p)}</span><div class="fmatch__p">${money(p.p)}${p.c ? `<small><s>${money(p.c)}</s></small>` : ''}</div><button class="btn btn--green btn--block" ${p.a ? `data-add="${p.h}" data-variant="${p.v[0] || ''}"` : 'disabled'}>${p.a ? icon('cart') + 'Add to cart' : 'Sold out'}</button></div>` : ''}
      <ul class="fmatch__ticks"><li>${icon('check')}Professional-grade, quality controlled</li><li>${icon('check')}Free Regular Shipping on eligible orders</li><li>${icon('check')}30-day returns · prepaid label</li></ul>
      <a class="fmatch__help" href="#faq">${icon('camera')}<span><b>Not sure? Send us a photo</b>We'll confirm the exact size for you.</span></a>`;
  }
  $('#fSizes').addEventListener('click', e => { const c = e.target.closest('[data-fs]'); if (c) { fs.s = c.dataset.fs; fs.sel = null; renderFinder(); } });
  $('#fPacks').addEventListener('click', e => { const c = e.target.closest('[data-fk]'); if (c) { fs.k = c.dataset.fk || null; fs.sel = null; renderFinder(); } });
  $('#fResults').addEventListener('click', e => { if (e.target.closest('.add')) return; const r = e.target.closest('[data-sel]'); if (r) { fs.sel = r.dataset.sel; $$('#fResults .fres').forEach(x => x.classList.toggle('is-sel', x === r)); renderMatch(); } });
  step(1);

  // Any [data-fam] link jumps to finder pre-filtered
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-fam]'); if (!a || !FAM[a.dataset.fam]) return;
    if (a.dataset.app) fs.app = a.dataset.app;
    chooseFam(a.dataset.fam);
  });

  /* ---------------- Hero: Find the right product ---------------- */
  let qfSel = 'window';
  $('#qfApps').innerHTML = APPS.map(a => `<button class="qfa" role="tab" aria-selected="${a.id === qfSel}" data-qa="${a.id}"><span class="qfa__ic">${icon(a.ic)}</span><span><b>${a.n}</b><small>${a.d}</small></span></button>`).join('');
  function renderQf() {
    const a = APPS.find(x => x.id === qfSel);
    $('#qfProds').innerHTML = `<span class="qf__lbl">Step 2 · Choose a product</span>` + a.f.map((f, i) => { const it = famItems(f); return `<a class="qfp" href="#finder" data-fam="${f}" data-app="${a.id}" style="animation-delay:${i * 45}ms"><img src="images/${FAM[f].img}.webp" alt=""><span>${FAM[f].n} <small>from ${money(Math.min(...it.map(p => p.p)))}</small></span>${icon('arrow')}</a>`; }).join('');
  }
  $('#qfApps').addEventListener('click', e => {
    const b = e.target.closest('[data-qa]'); if (!b) return;
    qfSel = b.dataset.qa; $$('#qfApps .qfa').forEach(x => x.setAttribute('aria-selected', x === b));
    $('#qfStep').innerHTML = '<i></i>Step 2 of 2 · Choose a product'; renderQf();
  });
  renderQf();

  /* ---------------- Wholesale form + newsletter ---------------- */
  $('#wform').addEventListener('submit', e => {
    e.preventDefault(); let ok = true;
    $$('#wform input[required]').forEach(i => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.classList.toggle('is-err', bad); if (bad) ok = false; });
    if (ok) $('#wform .wform__ok').hidden = false; else toast('Please complete the highlighted fields');
  });
  $('#news').addEventListener('submit', e => { e.preventDefault(); $('#news .news__ok').hidden = false; $('#newsEmail').value = ''; });

  /* ---------------- Reviews carousel (drag + arrows) ---------------- */
  const REVIEWS = [
    { n: 'Mike R.', r: 'Screen contractor · Tampa, FL', d: 'Oct 2026', t: 'Finally, the size nobody else stocks', b: 'Finally found .175 spline that actually fits our older pool-cage frames. Rolled in clean with no stretching, and the 15 lb roll covers a full week of jobs.', p: '0-175-inch-window-screen-spline', dark: true },
    { n: 'Dana K.', r: 'Operations lead · CNC shop, OH', d: 'Oct 2026', t: 'Zero scratch complaints since switching', b: 'We wrap machined shafts and valve bodies before shipping. Not one customer complaint about scratches since we moved to FinePS netting.', p: 'poly200green-net' },
    { n: 'Luis T.', r: 'Powder coater · Houston, TX', d: 'Sep 2026', t: 'Holds through the cure, peels clean', b: 'The green PET tape holds through the whole cure cycle and peels off clean. Case pricing beats our old distributor too.', p: 'green-pet-tape-1-inch-x-72-yard-single-roll' },
    { n: 'Angela S.', r: 'Homeowner · Phoenix, AZ', d: 'Sep 2026', t: 'They matched my size from a photo', b: 'I had no idea what size I needed. Sent a photo, got an answer the same day, and the screen door looks brand new.', p: 'screen-roller-tool-door-window-screen-installation-repair' },
    { n: 'Greg W.', r: 'Fleet maintenance · Dallas, TX', d: 'Aug 2026', t: 'Hydraulic lines finally protected', b: 'The yellow 2" spiral wrap makes our hydraulic lines easy to spot and it has stopped the rubbing on the trailer frames.', p: '2-inch-spiral-hydraulic-hose-wrap-100-ft-flexible-polyethylene-hose-and-wire-protector' },
    { n: 'Priya N.', r: 'Property manager · Orlando, FL', d: 'Aug 2026', t: 'One supplier for 140 units', b: 'We re-screen units on turnover. Having the right spline, clips and tools from one place has saved our maintenance team hours.', p: '7-16-inch-window-screen-clips-diecast-zinc-fasteners' },
    { n: 'Tom B.', r: 'DIY · Charlotte, NC', d: 'Jul 2026', t: 'Flat spline fixed my lanai', b: 'Big-box stores only had round spline. The .315 flat spline was exactly what my lanai frames needed. Easy install.', p: '0-315-inch-flat-screen-spline-250ft' },
    { n: 'Rosa M.', r: 'Paint line supervisor · Phoenix, AZ', d: 'Jul 2026', t: 'Pre-cut dots save us real time', b: 'The green dots go on in seconds and survive the oven. Our masking time on threaded holes dropped noticeably.', p: 'green-dots-2-inch-x-1-000-dots-single-roll' }
  ];
  const STAR5 = '<span class="stars">' + icon('star').repeat(5) + '</span>';
  $('#rTrack').innerHTML = REVIEWS.map(r => { const p = BY[r.p] || CAT.find(x => x.h.startsWith(r.p)); return `
    <article class="rv ${r.dark ? 'rv--dark' : ''}">
      <div class="rv__top">${STAR5}<span class="mono">${r.d}</span></div>
      ${r.dark ? icon('quote', 'ic rv__q') : ''}
      <h3>${r.t}</h3><p>“${r.b}”</p>
      ${p ? `<div class="rv__prod"><img src="images/${imgFor(p)}.webp" alt=""><span><small>Purchased</small><b>${shortTitle(p).slice(0, 44)}${shortTitle(p).length > 44 ? '…' : ''}</b></span></div>` : ''}
      <div class="rv__who"><span class="av">${r.n.split(' ').map(w => w[0]).join('').replace('.', '')}</span><span><b>${r.n}</b><small>${r.r}</small></span><span class="vb">${icon('check')}Verified</span></div>
    </article>`; }).join('');
  const rt = $('#rTrack');
  const rUpd = () => {
    const max = rt.scrollWidth - rt.clientWidth, w = rt.clientWidth / rt.scrollWidth;
    const bar = $('#rProg'); bar.style.width = (w * 100) + '%'; bar.style.left = (max ? rt.scrollLeft / max * (1 - w) * 100 : 0) + '%';
    $('#rPrev').disabled = rt.scrollLeft < 4; $('#rNext').disabled = rt.scrollLeft > max - 4;
  };
  rt.addEventListener('scroll', rUpd, { passive: true }); addEventListener('resize', rUpd); rUpd();
  const cardW = () => (rt.querySelector('.rv') ? rt.querySelector('.rv').offsetWidth + 16 : 300);
  $('#rPrev').addEventListener('click', () => rt.scrollBy({ left: -cardW(), behavior: 'smooth' }));
  $('#rNext').addEventListener('click', () => rt.scrollBy({ left: cardW(), behavior: 'smooth' }));
  rt.addEventListener('keydown', e => { if (e.key === 'ArrowRight') $('#rNext').click(); if (e.key === 'ArrowLeft') $('#rPrev').click(); });
  let drag = null;
  rt.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; drag = { x: e.clientX, s: rt.scrollLeft, moved: false }; });
  addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 4) { drag.moved = true; rt.classList.add('is-drag'); } rt.scrollLeft = drag.s - dx; });
  addEventListener('pointerup', () => { if (!drag) return; const moved = drag.moved; drag = null; rt.classList.remove('is-drag'); if (moved) { const w = cardW(); rt.scrollTo({ left: Math.round(rt.scrollLeft / w) * w, behavior: 'smooth' }); } });
  $('#allReviews').addEventListener('click', e => { e.preventDefault(); toast('Prototype: opens the full reviews page (612 reviews)'); });

  /* ---------------- FAQ ---------------- */
  $('#qaList').addEventListener('click', e => {
    const q = e.target.closest('.qa__q'); if (!q) return;
    const item = q.parentElement, open = !item.classList.contains('is-open');
    $$('#qaList .qa').forEach(x => { x.classList.remove('is-open'); x.querySelector('.qa__q').setAttribute('aria-expanded', 'false'); });
    if (open) { item.classList.add('is-open'); q.setAttribute('aria-expanded', 'true'); }
  });
  tabs($('#faqTabs'), b => $$('#qaList .qa').forEach(x => x.classList.toggle('is-hidden', b.dataset.c !== 'all' && x.dataset.c !== b.dataset.c)));

  /* ---------------- Stats counters ---------------- */
  const sio = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; sio.unobserve(en.target);
    $$('b[data-to]', en.target).forEach(b => { const to = +b.dataset.to, suf = b.dataset.suf || '', t0 = performance.now();
      const tick = t => { const k = Math.min(1, (t - t0) / 1400), v = Math.round(to * (1 - Math.pow(1 - k, 3))); b.textContent = v + suf; if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick); });
  }), { threshold: .4 });
  sio.observe($('#stats'));

  /* ---------------- Footer wordmark interaction ---------------- */
  const wm = $('#wordmark'), letters = $$('span', wm);
  const hotAt = i => letters.forEach((l, j) => { l.classList.toggle('is-hot', j === i); l.classList.toggle('is-near', Math.abs(j - i) === 1); });
  wm.addEventListener('mousemove', e => {
    let best = 0, bd = 1e9; letters.forEach((l, j) => { const r = l.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2)); if (d < bd) { bd = d; best = j; } });
    hotAt(best);
  });
  wm.addEventListener('mouseleave', () => hotAt(-9));
  const wio = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; wio.unobserve(wm);
    letters.forEach((l, j) => setTimeout(() => hotAt(j), 120 * j)); setTimeout(() => hotAt(-9), 120 * letters.length + 200);
  }), { threshold: .5 });
  wio.observe(wm);

  /* ---------------- Announcement marquee: fill the width ---------------- */
  (function () {
    const g = $$('.announce__group'); if (g.length < 2) return;
    const base = g[0].innerHTML; let guard = 0;
    while (g[0].scrollWidth < innerWidth + 200 && guard++ < 4) g[0].insertAdjacentHTML('beforeend', base);
    g[1].innerHTML = g[0].innerHTML; $$('a', g[1]).forEach(a => a.tabIndex = -1);
  })();

  /* ---------------- Reveal on scroll ---------------- */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { const t = en.target; t.classList.add('is-in'); io.unobserve(t); setTimeout(() => { t.style.transitionDelay = ''; }, 1000); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal, .ladder').forEach(el => io.observe(el));
  // stagger
  $$('#catGrid .cat').forEach((c, i) => c.style.transitionDelay = (i % 6) * 50 + 'ms');
  $$('#bestGrid .pcard').forEach((c, i) => c.style.transitionDelay = (i % 4) * 70 + 'ms');

  renderCart();
})();
