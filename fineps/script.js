/* FinePS homepage concept — interactions */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
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
      ? `<label class="opt"><span class="opt__l">${FAM[cfg.f].sz}</span><select data-o="s">${sizes.map(s => `<option ${s === st.s ? 'selected' : ''} value="${s}">${fmtSize(s)}</option>`).join('')}</select></label>`
      : `<div class="opt"><span class="opt__l">${FAM[cfg.f].sz}</span><div class="opt__row">${sizes.map(s => `<button class="chip" data-o="s" data-v="${s}" aria-pressed="${s === st.s}">${fmtSize(s)}</button>`).join('')}</div></div>`) : '';
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

  /* ---------------- Featured solution ---------------- */
  const SOL = [
    { img: 'app-red-netting', problem: 'Finished parts get nicked, scratched and tangled in transit.',
      k: 'SOLUTION 01 — PART PROTECTION', h: 'Ship precision parts without a single scratch.',
      p: 'FinePS PE netting stretches over flanges, threads and odd shapes to form a protective sleeve — light, breathable and fast to apply on the line.',
      steps: ['Measure the part’s largest diameter', 'Choose a stretch range that covers it', 'Cut to length and slide it on — done'],
      hot: [[52, 40, 'Stretch-fit sleeve', 'Expands over flanges and odd-shaped housings.'], [70, 80, 'Cut to length', 'Use only what you need from the spool.'], [24, 60, 'Breathable mesh', 'Protects surfaces without trapping moisture.']],
      prods: ['poly200green-net', 'mesh-protective-sleeves-1x4-to-1x2-inch'] },
    { img: 'app-screened-porch', problem: 'Torn or sagging screens let bugs in and look neglected.',
      k: 'SOLUTION 02 — SCREEN REPAIR', h: 'Tight, professional screens in one afternoon.',
      p: 'The right spline diameter is the difference between a screen that pops out and one that stays drum-tight for years. Pair it with a roller tool for a clean finish.',
      steps: ['Pull the old spline and check its size', 'Lay new mesh over the frame', 'Roll the spline into the channel and trim'],
      hot: [[30, 40, 'Exact-fit spline', '40+ diameters so it locks into your channel.'], [74, 30, 'UV-stabilised vinyl', 'Stays flexible in full sun.'], [60, 70, 'Bug-free space', 'Add bug seals to sliding doors.']],
      prods: ['0-185-inch-window-screen-spline-250ft-roll', 'screen-roller-tool-door-window-screen-installation-repair', '7-16-inch-window-screen-clips-diecast-zinc-fasteners'] },
    { img: 'app-hydraulic-wrap', problem: 'Exposed hoses and cables chafe, crack and fail early.',
      k: 'SOLUTION 03 — HOSE & CABLE', h: 'Add years to hoses, lines and wiring.',
      p: 'Spiral wrap coils around hydraulic hoses and cable bundles to shield them from abrasion — and keeps runs organised and easy to identify.',
      steps: ['Measure the hose or bundle diameter', 'Pick 3/4", 1.1" or 2" wrap in black or high-vis yellow', 'Twist it on — no tools needed'],
      hot: [[48, 64, 'Abrasion shield', 'Polyethylene coil takes the wear instead of the hose.'], [30, 32, 'High-vis yellow', 'Spot lines at a glance on the shop floor.']],
      prods: ['spiral-cable-wrap-3-4-inch-hose-protector-flexible-polyethylene-wire-conduit-tubing-cable-sleeve-cord-cover-to-organize-wires-and-hose', '2-inch-spiral-hydraulic-hose-wrap-100-ft-flexible-polyethylene-hose-and-wire-protector'] }
  ];
  function renderSol(i) {
    const s = SOL[i];
    $('#solStage').innerHTML = `
      <div class="sol__img"><img src="images/${s.img}.webp" alt="${s.h}" loading="lazy">
        <div class="sol__problem"><span class="mono">PROBLEM</span>${s.problem}</div>
        ${s.hot.map((h, j) => `<button class="hot" style="--x:${h[0]}%;--y:${h[1]}%" data-h="${j}" aria-label="${h[2]}"><span>${j + 1}</span></button><div class="hot__tip" style="--x:${h[0]}%;--y:${h[1]}%" data-t="${j}"><b>${h[2]}</b>${h[3]}</div>`).join('')}
      </div>
      <div class="sol__panel"><p class="mono" style="color:var(--green-d);margin:0">${s.k}</p><h3>${s.h}</h3><p>${s.p}</p>
        <ol class="sol__steps">${s.steps.map(x => `<li>${x}</li>`).join('')}</ol>
        <div class="sol__prods">${s.prods.map(h => BY[h]).filter(Boolean).map(p => `<div class="sol__prod"><img src="images/${imgFor(p)}.webp" alt=""><div><b>${shortTitle(p).slice(0, 52)}</b><small>${money(p.p)}${p.c ? ' · was ' + money(p.c) : ''}</small></div><button class="add" ${p.a ? `data-add="${p.h}"` : 'disabled'}>${p.a ? icon('plus') + 'Add' : 'Sold out'}</button></div>`).join('')}</div>
      </div>`;
  }
  renderSol(0);
  tabs($('#solTabs'), b => renderSol(+b.dataset.s));
  $('#solStage').addEventListener('mouseover', e => { const h = e.target.closest('.hot'); $$('#solStage .hot__tip').forEach(t => t.classList.toggle('is-on', h && t.dataset.t === h.dataset.h)); });
  $('#solStage').addEventListener('mouseout', e => { if (e.target.closest('.hot')) $$('#solStage .hot__tip').forEach(t => t.classList.remove('is-on')); });
  $('#solStage').addEventListener('click', e => { const h = e.target.closest('.hot'); if (h) $$('#solStage .hot__tip').forEach(t => t.classList.toggle('is-on', t.dataset.t === h.dataset.h && !t.classList.contains('is-on'))); });

  /* ---------------- Product finder ---------------- */
  const APPS = [
    { id: 'window', n: 'Window & door screens', d: 'Repair or install screens, doors & pool cages', ic: 'home', f: ['spline', 'flat', 'smooth', 'tool', 'bugseal', 'clips'] },
    { id: 'pack', n: 'Protecting parts & packaging', d: 'Prevent nicks & scratches in transit', ic: 'package', f: ['netting', 'spiral'] },
    { id: 'hose', n: 'Hoses, cables & wiring', d: 'Shield & organise lines', ic: 'zap', f: ['spiral', 'netting'] },
    { id: 'mask', n: 'Masking for coating', d: 'Powder coat, paint & high-heat', ic: 'roller', f: ['pet', 'dots', 'glass', 'paper'] },
    { id: 'auto', n: 'Truck & trailer', d: 'Semi-truck & trailer components', ic: 'truck', f: ['spring', 'spiral'] }
  ];
  const fs = { app: null, fam: null, s: null, k: null };
  const step = n => {
    $$('#finderPanel .fstep').forEach(x => x.hidden = +x.dataset.step !== n);
    $$('#fSteps li').forEach((li, i) => { li.classList.toggle('is-active', i === n - 1); li.classList.toggle('is-done', i < n - 1); });
  };
  $('#fApps').innerHTML = APPS.map(a => `<button class="fopt" data-app="${a.id}"><span class="fopt__ic">${icon(a.ic)}</span><span><b>${a.n}</b><small>${a.d}</small></span>${icon('arrow')}</button>`).join('');
  $('#fApps').addEventListener('click', e => { const b = e.target.closest('[data-app]'); if (b) chooseApp(b.dataset.app); });
  function chooseApp(id) {
    fs.app = id; const a = APPS.find(x => x.id === id);
    $('#fFams').innerHTML = a.f.map(f => { const it = famItems(f); return `<button class="fopt" data-f="${f}"><img src="images/${FAM[f].img}.webp" alt=""><span><b>${FAM[f].n}</b><small>${it.length} option${it.length > 1 ? 's' : ''} · from ${money(Math.min(...it.map(p => p.p)))}</small></span>${icon('arrow')}</button>`; }).join('') +
      `<button class="fopt" data-back><span class="fopt__ic">${icon('arrow', 'ic flip')}</span><span><b>Back</b><small>Change application</small></span></button>`;
    step(2);
  }
  $('#fFams').addEventListener('click', e => { if (e.target.closest('[data-back]')) return step(1); const b = e.target.closest('[data-f]'); if (b) chooseFam(b.dataset.f); });
  function chooseFam(f) {
    fs.fam = f; const sizes = sizesOf(f); fs.s = sizes.length ? (f === 'spline' ? '0.185' : sizes[0]) : null; fs.k = null;
    if (!fs.app) fs.app = APPS.find(a => a.f.includes(f)).id;
    $('#fSizeQ').textContent = sizes.length ? `${FAM[f].n}: choose ${FAM[f].sz.toLowerCase()}` : FAM[f].n;
    $('#fTip').innerHTML = icon('help') + '<span>' + FAM[f].tip + '</span>';
    renderFinder(); step(3);
  }
  function renderFinder() {
    const f = fs.fam, sizes = sizesOf(f), packs = [...new Set(famItems(f).filter(p => !fs.s || p.s === fs.s).map(p => p.k).filter(Boolean))].sort((a, b) => PACK_ORDER.indexOf(a) - PACK_ORDER.indexOf(b));
    $('#fSizes').innerHTML = sizes.length ? `<span class="flabel">${FAM[f].sz}</span>` + sizes.map(s => `<button class="chip" data-fs="${s}" aria-pressed="${s === fs.s}">${fmtSize(s)}</button>`).join('') : '';
    if (fs.k && !packs.includes(fs.k)) fs.k = null;
    $('#fPacks').innerHTML = packs.length > 1 ? `<span class="flabel">Quantity</span><button class="chip" data-fk="" aria-pressed="${!fs.k}">All</button>` + packs.map(k => `<button class="chip" data-fk="${k}" aria-pressed="${k === fs.k}">${packLabel(k)}</button>`).join('') : '';
    const res = famItems(f).filter(p => (!fs.s || p.s === fs.s) && (!fs.k || p.k === fs.k)).sort((a, b) => (b.a - a.a) || PACK_ORDER.indexOf(a.k) - PACK_ORDER.indexOf(b.k));
    $('#fResults').innerHTML = res.length ? res.map((p, i) => `<div class="fres ${i === 0 && p.a ? 'fres--best' : ''}"><img src="images/${imgFor(p)}.webp" alt=""><div><b>${shortTitle(p)}</b><small>${[fmtSize(p.s), p.k && packLabel(p.k), p.v.length ? p.v.join(' / ') : ''].filter(Boolean).join(' · ')}</small>${p.a ? '' : '<span class="oos">Sold out — notify me</span>'}</div><div class="fres__r"><span class="fres__price">${money(p.p)}</span><button class="add" ${p.a ? `data-add="${p.h}" data-variant="${p.v[0] || ''}"` : 'disabled'}>${p.a ? icon('cart') + 'Add' : 'Sold out'}</button></div></div>`).join('')
      : `<p class="ftip">No exact match — <a class="tlink" href="#wholesale">request it</a></p>`;
  }
  $('#fSizes').addEventListener('click', e => { const c = e.target.closest('[data-fs]'); if (c) { fs.s = c.dataset.fs; renderFinder(); } });
  $('#fPacks').addEventListener('click', e => { const c = e.target.closest('[data-fk]'); if (c) { fs.k = c.dataset.fk || null; renderFinder(); } });
  $('#fBack').addEventListener('click', () => { chooseApp(fs.app); });
  step(1);

  // Any [data-fam] link jumps to finder pre-filtered
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-fam]'); if (!a || !FAM[a.dataset.fam]) return;
    chooseFam(a.dataset.fam);
  });

  // Hero quick finder
  const qfApp = $('#qfApp'), qfFam = $('#qfFam');
  const fillQf = () => { const a = APPS.find(x => x.id === qfApp.value); qfFam.innerHTML = a.f.map(f => `<option value="${f}">${FAM[f].n}</option>`).join(''); };
  qfApp.addEventListener('change', fillQf); fillQf();
  $('#qfind').addEventListener('submit', e => { e.preventDefault(); fs.app = qfApp.value; chooseFam(qfFam.value); $('#finder').scrollIntoView({ behavior: 'smooth' }); });

  /* ---------------- Deals ---------------- */
  const DEALS = [
    { h: 'spiral-cable-wrap-3-4-inch-hose-protector-flexible-polyethylene-wire-conduit-tubing-cable-sleeve-cord-cover-to-organize-wires-and-hose', note: 'Save 5% · Black or yellow' },
    { h: 'mesh-protective-sleeves-1x4-to-1x2-inch', note: 'Save $11.31 on the spool' },
    { h: 'low-temperature-paper-masking-tape-2-inch-x-54-yard-case-24-pcs', note: 'Case of 24 · $12.00/roll vs $13.50 single', was: 13.5 * 24 }
  ];
  $('#dealsRow').innerHTML = DEALS.map(d => { const p = BY[d.h]; if (!p) return ''; const was = p.c || d.was; return `<div class="deal"><img src="images/${imgFor(p)}.webp" alt=""><div><span class="badge badge--amber">${was ? '-' + Math.round((1 - p.p / was) * 100) + '%' : 'Deal'}</span><b>${shortTitle(p)}</b><div class="deal__p"><em>${money(p.p)}</em>${was ? `<s>${money(was)}</s>` : ''}</div><small style="color:var(--muted-l)">${d.note}</small><br><button class="add" data-add="${p.h}" data-variant="${p.v[0] || ''}">${icon('cart')}Add to cart</button></div></div>`; }).join('');

  /* ---------------- Wholesale form + newsletter ---------------- */
  $('#wform').addEventListener('submit', e => {
    e.preventDefault(); let ok = true;
    $$('#wform input[required]').forEach(i => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.classList.toggle('is-err', bad); if (bad) ok = false; });
    if (ok) $('#wform .wform__ok').hidden = false; else toast('Please complete the highlighted fields');
  });
  $('#news').addEventListener('submit', e => { e.preventDefault(); $('#news .news__ok').hidden = false; $('#newsEmail').value = ''; });

  /* ---------------- Quality cross-section ---------------- */
  (function teeth() {
    const g = $('#xsecTeeth'); let d = ''; const N = 30, cx = 200, cy = 200, r1 = 110, r2 = 124;
    for (let i = 0; i < N; i++) {
      const a = i / N * Math.PI * 2, w = Math.PI / N * .55;
      const p = (r, t) => `${(cx + r * Math.cos(t)).toFixed(1)},${(cy + r * Math.sin(t)).toFixed(1)}`;
      d += `<path d="M${p(r1, a - w * 1.25)} L${p(r2, a - w * .6)} L${p(r2, a + w * .6)} L${p(r1, a + w * 1.25)} Z"/>`;
    }
    g.innerHTML = d;
  })();
  const qItems = $$('#qList li'), qHots = $$('#xsec .hot');
  const qOn = i => { qItems.forEach(li => li.classList.toggle('is-on', li.dataset.q === String(i))); qHots.forEach(h => h.classList.toggle('is-on', h.dataset.q === String(i))); };
  [...qItems, ...qHots].forEach(el => { el.addEventListener('mouseenter', () => qOn(el.dataset.q)); el.addEventListener('click', () => qOn(el.dataset.q)); });
  let qi = 0; const qTimer = setInterval(() => { qOn(qi = (qi + 1) % 4); }, 2800);
  $('#xsec').addEventListener('mouseenter', () => clearInterval(qTimer)); $('#qList').addEventListener('mouseenter', () => clearInterval(qTimer));
  qOn(0);

  /* ---------------- Hero parallax ---------------- */
  const hv = $('#heroVisual');
  if (fine.matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $('.hero').addEventListener('mousemove', e => {
      const r = hv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      $$('[data-depth]', hv).forEach(el => { const d = +el.dataset.depth; el.style.transform = `translate(${x * d}px,${y * d}px)`; });
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { const t = en.target; t.classList.add('is-in'); io.unobserve(t); setTimeout(() => { t.style.transitionDelay = ''; }, 1000); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal, .ladder, .speeds').forEach(el => io.observe(el));
  // stagger
  $$('#catGrid .cat').forEach((c, i) => c.style.transitionDelay = (i % 6) * 50 + 'ms');
  $$('#bestGrid .pcard').forEach((c, i) => c.style.transitionDelay = (i % 4) * 70 + 'ms');

  renderCart();
})();
