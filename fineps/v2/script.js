/* FinePS homepage — Version B interactions */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = v => String(v).replace(/"/g, '&quot;');
  const IMG = '../images/';
  const money = n => '$' + n.toFixed(2);
  const icon = (id, cls = 'ic') => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;
  const STARS = '<span class="stars">' + icon('star').repeat(5) + '</span>';
  const fine = matchMedia('(hover:hover) and (pointer:fine)');

  /* ---------------- Catalog ---------------- */
  const CAT = (window.FINEPS_CATALOG || []).map(p => {
    if (p.f === 'netting' && !p.s) {
      const m = p.t.match(/(\d?\.\d+)\D{0,4}to\s*(\d?\.\d+)/i);
      if (m) p.s = (m[1].startsWith('.') ? '0' + m[1] : m[1]) + '–' + m[2] + '"';
      else if (/450/.test(p.t)) p.s = 'Poly450 (medium)';
    }
    return p;
  });
  const BY = Object.fromEntries(CAT.map(p => [p.h, p]));
  const num = s => { if (!s) return 999; if (s.includes('/')) { const [a, b] = s.split('/'); return parseFloat(a) / parseFloat(b); } return parseFloat(s); };
  const PACK = ['Single roll', 'Case', '25ft', '50ft', '100ft', '250ft', '500ft', '1000ft', '15 lb roll', '100-pack'];
  const packLabel = k => ({ '25ft': '25 ft', '50ft': '50 ft', '100ft': '100 ft', '250ft': '250 ft', '500ft': '500 ft', '1000ft': '1,000 ft' }[k] || k);
  const FAM = {
    spline:  { n: 'Retainer Screen Spline', img: 'cut-round-spline', g: 'window', d: 'Round & serrated black vinyl for windows and doors.', sz: 'Diameter', tip: 'Match the diameter on your old spline’s packaging, or measure it with calipers.' },
    flat:    { n: 'Flat Screen Spline', img: 'cut-flat-spline', g: 'window', d: 'Flat profile for pool cages & patio enclosures.', sz: 'Width', tip: 'Flat spline fits shallow-groove frames like pool cages and patios.' },
    smooth:  { n: 'Smooth Spline', img: 'cut-smooth-spline', g: 'window', d: 'Gray smooth vinyl for non-serrated channels.', sz: 'Diameter', tip: 'Smooth gray spline for frames that call for a non-serrated profile.' },
    tool:    { n: 'Screen Roller Tool', img: 'cut-roller-tool', g: 'window', d: 'Steel bearing wheels on a hardwood handle.', tip: 'The one tool every screen job needs.' },
    bugseal: { n: 'Bug Seals', img: 'cut-bug-seal', g: 'window', d: '8 ft adjustable seals for sliding screen doors.', tip: 'Trim-to-fit seals for sliding screen doors.' },
    clips:   { n: 'Screen Clips', img: 'cut-screen-clips', g: 'window', d: '7/16" diecast zinc clips, 100-pack.', tip: 'Holds screen frames securely in the window.' },
    netting: { n: 'PE Protective Netting', img: 'cut-netting-orange', g: 'protect', d: 'Expandable stretch sleeves for parts & surfaces.', sz: 'Stretch range', tip: 'Pick a stretch range that covers your part’s diameter.' },
    spiral:  { n: 'Spiral Cable Wrap', img: 'cut-spiral-wrap', g: 'protect', d: 'Polyethylene hose & wire protection.', sz: 'Inner diameter', tip: 'Choose the size that wraps your hose or cable bundle.' },
    pet:     { n: 'Green PET Tape', img: 'cut-green-tape', g: 'mask', d: 'High-temp polyester masking for powder coat.', sz: 'Width', tip: 'Built for high-temperature powder-coat masking. 72 yd rolls.' },
    dots:    { n: 'Green Masking Dots', img: 'cut-green-dots', g: 'mask', d: 'Pre-cut discs that mask holes in seconds.', sz: 'Diameter', tip: 'Pre-cut discs mask holes and studs fast.' },
    glass:   { n: 'Glass Cloth Tape', img: 'cut-glass-cloth', g: 'mask', d: 'For demanding high-heat masking jobs.', sz: 'Width', tip: 'Glass cloth tape for high-heat jobs. 32 yd rolls.' },
    paper:   { n: 'Paper Masking Tape', img: 'cut-paper-tape', g: 'mask', d: 'Low-temp paper tape, 54 yd rolls.', sz: 'Width', tip: 'Low-temperature paper tape for painting and lower-heat coating.' },
    spring:  { n: 'Tender Spring Kit', img: 'cut-tender-spring', g: 'auto', d: '25" heavy-duty kit for semi-truck & trailer.', tip: 'Heavy-duty 25" tracker tender spring kit.' }
  };
  const famItems = f => CAT.filter(p => p.f === f);
  const sizesOf = f => [...new Set(famItems(f).map(p => p.s).filter(Boolean))].sort((a, b) => num(a) - num(b));
  const packsOf = f => [...new Set(famItems(f).map(p => p.k).filter(Boolean))].sort((a, b) => PACK.indexOf(a) - PACK.indexOf(b));
  const fmtSize = s => (s && /^\d\.\d{3}$/.test(s)) ? s.replace(/^0/, '') + '"' : s;
  const minP = f => Math.min(...famItems(f).map(p => p.p));
  const imgFor = p => {
    if (p.f === 'netting') { const t = p.t.toLowerCase(); for (const c of ['red', 'orange', 'blue', 'yellow', 'gray', 'brown']) if (t.includes(c)) return 'cut-netting-' + c; const s = num(p.s); return 'cut-netting-' + (s < 1 ? 'blue' : s < 2.5 ? 'yellow' : s < 3.5 ? 'red' : s < 4.5 ? 'gray' : 'orange'); }
    if (p.f === 'spline') return p.k === '15 lb roll' ? 'cut-spline-15lb' : p.k === '100ft' ? 'cut-spline-coil' : 'cut-round-spline';
    if (p.f === 'flat') return p.k === '1000ft' || p.k === '500ft' ? 'cut-flat-1000' : 'cut-flat-spline';
    if (p.f === 'bugseal' && /vinyl/i.test(p.t)) return 'cut-bug-seal-2';
    if (p.f === 'pet' && p.k === 'Case') return 'cut-green-tape-2';
    return FAM[p.f].img;
  };
  const im = n => IMG + n + '.webp';
  const short = p => p.t.replace(/\s*[|–-]\s*(Flexible Polyethylene.*|Durable.*|Easy.*)$/i, '').replace(/\s+/g, ' ');
  const GROUPS = { window: ['spline', 'flat', 'smooth', 'tool', 'bugseal', 'clips'], protect: ['netting', 'spiral'], mask: ['pet', 'dots', 'glass', 'paper'], auto: ['spring', 'spiral'] };

  /* ---------------- Toast & cart ---------------- */
  let tT;
  const toast = m => { const t = $('#toast'); t.innerHTML = icon('check') + m; t.classList.add('is-on'); clearTimeout(tT); tT = setTimeout(() => t.classList.remove('is-on'), 2600); };
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('fineps-cart-b') || '[]').filter(i => BY[i.h]); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem('fineps-cart-b', JSON.stringify(cart)); } catch (e) {} };
  function addToCart(h, q = 1, v = '', quiet) {
    const p = BY[h]; if (!p) return;
    const ex = cart.find(i => i.h === h && i.v === v); ex ? ex.q += q : cart.push({ h, q, v });
    save(); renderCart();
    const c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    if (!quiet) toast('Added: ' + short(p).slice(0, 46) + (short(p).length > 46 ? '…' : ''));
  }
  function renderCart() {
    const n = cart.reduce((a, i) => a + i.q, 0);
    $('#cartCount').textContent = n; $('#cartN').textContent = n ? `(${n})` : '';
    $('#cartItems').innerHTML = cart.length ? cart.map((i, x) => { const p = BY[i.h]; return `<div class="ci"><img src="${im(imgFor(p))}" alt=""><div><b>${short(p)}</b><small>${[i.v, p.k && packLabel(p.k)].filter(Boolean).join(' · ')}</small><div class="qty"><button data-q="-1" data-i="${x}" aria-label="Decrease">${icon('minus')}</button><span>${i.q}</span><button data-q="1" data-i="${x}" aria-label="Increase">${icon('plus')}</button></div></div><div class="ci__p">${money(p.p * i.q)}<button class="ci__rm" data-rm="${x}">Remove</button></div></div>`; }).join('')
      : `<div class="ce">${icon('cart')}<p><b>Your cart is empty</b></p><a class="bt bt--ink bt--sm" href="#cats" data-close-cart>Start shopping</a></div>`;
    $('#cartSub').textContent = money(cart.reduce((a, i) => a + BY[i.h].p * i.q, 0));
    const tool = CAT.find(p => p.f === 'tool');
    const need = cart.some(i => ['spline', 'flat', 'smooth'].includes(BY[i.h].f)) && !cart.some(i => BY[i.h].f === 'tool');
    $('#cartUpsell').innerHTML = need && tool ? `<img src="${im('cut-roller-tool')}" alt=""><div><b>Add the Screen Roller Tool</b><small>Most spline buyers add one · ${money(tool.p)}</small></div><button class="add" data-add="${tool.h}">${icon('plus')}Add</button>` : '';
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
  $('#checkout').addEventListener('click', () => toast('Prototype: opens Shopify secure checkout'));
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    e.preventDefault(); addToCart(b.dataset.add, 1, b.dataset.variant || '');
    if (b.classList.contains('add')) { const o = b.innerHTML; b.classList.add('is-done'); b.innerHTML = icon('check') + 'Added'; setTimeout(() => { b.classList.remove('is-done'); b.innerHTML = o; }, 1400); }
  });

  /* ---------------- Menus ---------------- */
  const menus = $$('[data-menu]');
  const setOpen = (li, on) => { li.classList.toggle('is-open', on); const b = li.querySelector(':scope > button'); b && b.setAttribute('aria-expanded', on); };
  function closeAll(ex) { menus.forEach(m => m !== ex && setOpen(m, false)); }
  menus.forEach(li => {
    let ti, to;
    li.addEventListener('mouseenter', () => { if (!fine.matches) return; clearTimeout(to); ti = setTimeout(() => { closeAll(li); setOpen(li, true); }, 70); });
    li.addEventListener('mouseleave', () => { if (!fine.matches) return; clearTimeout(ti); to = setTimeout(() => setOpen(li, false), 200); });
    li.querySelector(':scope > button').addEventListener('click', () => { const on = !li.classList.contains('is-open'); closeAll(li); setOpen(li, on); });
    li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) setOpen(li, false); });
    li.addEventListener('click', e => { if (e.target.closest('a')) setOpen(li, false); });
  });
  document.addEventListener('click', e => { if (!e.target.closest('[data-menu]')) closeAll(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { const o = menus.find(m => m.classList.contains('is-open')); if (o) { setOpen(o, false); o.querySelector('button').focus(); } closeCart(); closeSearch(); closeMnav(); closePicks(); }
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  });
  // products mega: group tabs
  const pmRender = g => { $('#pmGrid').innerHTML = GROUPS[g].map((f, i) => `<a class="pmc" href="#finder" data-fam="${f}" style="animation-delay:${i * 35}ms"><span><img src="${im(FAM[f].img)}" alt="" loading="lazy"></span><b>${FAM[f].n}</b><small>${sizesOf(f).length ? sizesOf(f).length + ' sizes · ' : ''}from ${money(minP(f))}</small></a>`).join(''); };
  $$('.pm__tab').forEach(t => { const go = () => { $$('.pm__tab').forEach(x => x.classList.toggle('is-on', x === t)); pmRender(t.dataset.pg); }; t.addEventListener('mouseenter', go); t.addEventListener('click', go); t.addEventListener('focus', go); });
  pmRender('window');
  // deals drop
  const DEALS = [['spiral-cable-wrap-3-4-inch-hose-protector-flexible-polyethylene-wire-conduit-tubing-cable-sleeve-cord-cover-to-organize-wires-and-hose'], ['mesh-protective-sleeves-1x4-to-1x2-inch'], ['low-temperature-paper-masking-tape-2-inch-x-54-yard-case-24-pcs', 13.5 * 24]];
  $('#dealDrop').innerHTML = `<p class="mono" style="margin:6px 8px 8px;color:var(--mut)">Current deals</p>` + DEALS.map(([h, was]) => { const p = BY[h]; if (!p) return ''; const w = p.c || was; return `<a class="dl" href="#best"><img src="${im(imgFor(p))}" alt=""><span><b>${short(p).slice(0, 34)}…</b><small>${w ? `<s>${money(w)}</s> ` : ''}<em>${money(p.p)}</em></small></span></a>`; }).join('');
  // mobile products list
  $('#mProducts').innerHTML = [['Window & Door', 'window'], ['Protection & Packaging', 'protect'], ['Masking & Coating', 'mask'], ['Automotive', 'auto']].map(([n, g]) => `<p>${n}</p>` + GROUPS[g].map(f => `<a href="#finder" data-fam="${f}">${FAM[f].n}</a>`).join('')).join('');
  // header shadow + mobile bar
  const onScroll = () => { $('#hd').classList.toggle('is-s', scrollY > 20); $('#mb').classList.toggle('is-on', scrollY > 700); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  // mobile nav
  const mnav = $('#mnav');
  function closeMnav() { mnav.classList.remove('is-open'); mnav.setAttribute('aria-hidden', 'true'); $('#burger').setAttribute('aria-expanded', 'false'); }
  $('#burger').addEventListener('click', () => { mnav.classList.add('is-open'); mnav.setAttribute('aria-hidden', 'false'); $('#burger').setAttribute('aria-expanded', 'true'); });
  mnav.addEventListener('click', e => { if (e.target === mnav || e.target.closest('[data-close-mnav]') || e.target.closest('a')) closeMnav(); });
  // announcement fill
  (function () { const g = $$('.ann__g'); const base = g[0].innerHTML; let k = 0; while (g[0].scrollWidth < innerWidth + 200 && k++ < 4) g[0].insertAdjacentHTML('beforeend', base); g[1].innerHTML = g[0].innerHTML; })();

  /* ---------------- Search ---------------- */
  const srch = $('#search'), sIn = $('#sIn');
  function openSearch(q = '') { closeAll(); srch.classList.add('is-open'); srch.setAttribute('aria-hidden', 'false'); sIn.value = q; runSearch(); setTimeout(() => sIn.focus(), 60); }
  function closeSearch() { srch.classList.remove('is-open'); srch.setAttribute('aria-hidden', 'true'); }
  function runSearch() {
    const q = sIn.value.toLowerCase().trim().replace(/(^|\s)\.(\d)/g, '$10.$2'), w = q.split(/\s+/).filter(Boolean);
    let r = w.length ? CAT.filter(p => { const h = (p.t + ' ' + FAM[p.f].n + ' ' + (p.s || '')).toLowerCase(); return w.every(x => h.includes(x)); }) : ['0-185-inch-window-screen-spline-250ft-roll', '0-290-inch-flat-screen-spline-250ft', 'screen-roller-tool-door-window-screen-installation-repair', 'poly200green-net', 'green-pet-tape-1-inch-x-72-yard-single-roll'].map(h => BY[h]).filter(Boolean);
    r = r.sort((a, b) => b.a - a.a).slice(0, 8);
    $('#sRes').innerHTML = r.length ? r.map(p => `<button class="sr2" data-add="${p.h}"><img src="${im(imgFor(p))}" alt=""><span><b>${short(p)}</b><small>${FAM[p.f].n}${p.a ? '' : ' · Sold out'}</small></span><em>${money(p.p)}</em></button>`).join('') : `<p style="padding:10px;color:var(--mut)">No exact match. Try the <a href="#finder" data-close-search>Product Finder</a>.</p>`;
  }
  sIn.addEventListener('input', runSearch);
  $('#openSearch').addEventListener('click', () => openSearch());
  srch.addEventListener('click', e => { if (e.target === srch || e.target.closest('[data-close-search]')) closeSearch(); const p = e.target.closest('.srch__pop button'); if (p) { sIn.value = p.textContent; runSearch(); } });

  /* ---------------- Generic tabs + rails ---------------- */
  function tabs(list, cb) { list.addEventListener('click', e => { const b = e.target.closest('[role=tab]'); if (!b) return; $$('[role=tab]', list).forEach(x => x.setAttribute('aria-selected', x === b)); cb(b); }); }
  function rail(el, onUpd) {
    let d = null;
    el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.target.closest('button,select,a,input')) return; d = { x: e.clientX, s: el.scrollLeft, m: false }; });
    addEventListener('pointermove', e => { if (!d) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 4) { d.m = true; el.classList.add('is-drag'); } el.scrollLeft = d.s - dx; });
    addEventListener('pointerup', () => { if (!d) return; const m = d.m; d = null; el.classList.remove('is-drag'); if (m) { const c = el.firstElementChild; const w = c ? c.offsetWidth + 16 : 300; el.scrollTo({ left: Math.round(el.scrollLeft / w) * w, behavior: 'smooth' }); } });
    const upd = () => { const max = el.scrollWidth - el.clientWidth; $$(`[data-rail="${el.id}"]`).forEach(b => b.disabled = +b.dataset.dir < 0 ? el.scrollLeft < 4 : el.scrollLeft > max - 4); onUpd && onUpd(el, max); };
    el.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); setTimeout(upd, 50);
  }
  document.addEventListener('click', e => { const b = e.target.closest('[data-rail]'); if (!b) return; const el = $('#' + b.dataset.rail); const c = [...el.children].find(x => !x.classList.contains('is-hidden')); el.scrollBy({ left: (+b.dataset.dir) * ((c ? c.offsetWidth : 300) + 16), behavior: 'smooth' }); });

  /* ---------------- Hero: sentence builder ---------------- */
  const APPS = [
    { id: 'window', n: 'window & door screens', d: 'Screens, doors & pool cages', ic: 'home', f: GROUPS.window },
    { id: 'pack', n: 'protecting parts & packaging', d: 'Stop nicks & scratches in transit', ic: 'package', f: ['netting', 'spiral'] },
    { id: 'hose', n: 'hoses, cables & wiring', d: 'Shield & organise lines', ic: 'zap', f: ['spiral', 'netting'] },
    { id: 'mask', n: 'masking for coating', d: 'Powder coat, paint & high heat', ic: 'roller', f: GROUPS.mask },
    { id: 'auto', n: 'truck & trailer parts', d: 'Semi-truck & trailer', ic: 'truck', f: ['spring', 'spiral'] }
  ];
  const sb = { app: 'window', fam: 'spline' };
  const picks = Object.fromEntries($$('.sb__pick').map(p => [p.dataset.sb, p]));
  const pops = {};
  const bd = document.createElement('div'); bd.className = 'sb__bd'; document.body.appendChild(bd);
  // move each list to <body> so it is never clipped by the hero card or hidden under the sticky header
  Object.entries(picks).forEach(([k, p]) => { const pop = p.querySelector('.sb__pop'); pop.dataset.for = k; pop.id = 'sbPop-' + k; p.querySelector('.sb__btn').setAttribute('aria-controls', pop.id); document.body.appendChild(pop); pops[k] = pop; });
  let sbOpen = null;
  function placePop(k) {
    const pop = pops[k], r = picks[k].querySelector('.sb__btn').getBoundingClientRect();
    if (innerWidth <= 720) { pop.classList.add('sb__pop--sheet'); bd.classList.add('is-open'); return; }
    pop.classList.remove('sb__pop--sheet'); bd.classList.remove('is-open');
    const pill = $('#hd .hd__pill'), hdr = (pill ? pill.getBoundingClientRect().bottom : 0) + 8;
    const w = pop.offsetWidth || 320, want = Math.min(pop.scrollHeight || 340, 380);
    const below = innerHeight - r.bottom - 12, above = r.top - hdr - 8;
    pop.style.left = Math.max(8, Math.min(r.left, innerWidth - w - 8)) + 'px';
    if (below >= want || below >= above) { pop.style.top = (r.bottom + 8) + 'px'; pop.style.bottom = 'auto'; pop.style.maxHeight = Math.max(160, Math.min(380, below)) + 'px'; }
    else { pop.style.top = 'auto'; pop.style.bottom = (innerHeight - r.top + 8) + 'px'; pop.style.maxHeight = Math.max(160, Math.min(380, above)) + 'px'; }
  }
  function setPick(p, on) {
    const k = p.dataset.sb;
    p.classList.toggle('is-open', on); p.querySelector('.sb__btn').setAttribute('aria-expanded', on);
    pops[k].classList.toggle('is-open', on);
    if (on) { sbOpen = k; placePop(k); const sel = pops[k].querySelector('[aria-selected=true]'); if (sel) setTimeout(() => sel.focus({ preventScroll: true }), 60); }
    else if (sbOpen === k) { sbOpen = null; bd.classList.remove('is-open'); }
  }
  function closePicks() { Object.values(picks).forEach(p => setPick(p, false)); }
  function sbRender() {
    const a = APPS.find(x => x.id === sb.app);
    if (!a.f.includes(sb.fam)) sb.fam = a.f[0];
    picks.app.querySelector('.sb__btn').innerHTML = `${icon(a.ic, 'ic sb__ic')}<b>${a.n}</b>${icon('chev', 'ic chev')}`;
    pops.app.innerHTML = `<p class="sb__ph">I'm working on…<button type="button" data-sb-close aria-label="Close">${icon('x')}</button></p>` + APPS.map(x => `<button type="button" class="sb__opt" role="option" aria-selected="${x.id === sb.app}" data-v="${x.id}">${icon(x.ic)}<span>${x.n[0].toUpperCase() + x.n.slice(1)}<small>${x.d}</small></span></button>`).join('');
    picks.fam.querySelector('.sb__btn').innerHTML = `<img class="sb__th" src="${im(FAM[sb.fam].img)}" alt=""><b>${FAM[sb.fam].n.toLowerCase()}</b>${icon('chev', 'ic chev')}`;
    pops.fam.innerHTML = `<p class="sb__ph">I need…<button type="button" data-sb-close aria-label="Close">${icon('x')}</button></p>` + a.f.map(f => `<button type="button" class="sb__opt" role="option" aria-selected="${f === sb.fam}" data-v="${f}"><img src="${im(FAM[f].img)}" alt=""><span>${FAM[f].n}<small>from ${money(minP(f))}</small></span></button>`).join('');
  }
  Object.entries(picks).forEach(([k, p]) => {
    p.querySelector('.sb__btn').addEventListener('click', e => { e.stopPropagation(); const on = !p.classList.contains('is-open'); closePicks(); setPick(p, on); });
    pops[k].addEventListener('click', e => {
      e.stopPropagation();
      if (e.target.closest('[data-sb-close]')) return closePicks();
      const o = e.target.closest('.sb__opt'); if (!o) return;
      const changed = sb[k] !== o.dataset.v; sb[k] = o.dataset.v;
      closePicks(); sbRender();
      if (k === 'app' && changed) setTimeout(() => setPick(picks.fam, true), 180);
    });
    pops[k].addEventListener('keydown', e => {
      const os = $$('.sb__opt', pops[k]), i = os.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (os[i + 1] || os[0]).focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); (os[i - 1] || os[os.length - 1]).focus(); }
      if (e.key === 'Escape') { closePicks(); p.querySelector('.sb__btn').focus(); }
    });
  });
  document.addEventListener('pointerdown', e => { if (sbOpen && !e.target.closest('.sb__pick, .sb__pop')) closePicks(); });
  bd.addEventListener('click', closePicks);
  addEventListener('resize', () => { if (sbOpen) placePop(sbOpen); });
  addEventListener('scroll', () => { if (sbOpen && innerWidth > 720) placePop(sbOpen); }, { passive: true });
  sbRender();
  $('#sb').addEventListener('submit', e => { e.preventDefault(); fdJump(sb.app, sb.fam); $('#finder').scrollIntoView({ behavior: 'smooth' }); });

  /* ---------------- Category index ---------------- */
  const CATS = ['spline', 'flat', 'smooth', 'tool', 'bugseal', 'clips', 'netting', 'spiral', 'pet', 'dots', 'glass', 'paper', 'spring'];
  const tagOf = { spline: 'Best seller', netting: 'Bulk spools', pet: 'High-temp', spiral: 'Sale' };
  $('#cxList').innerHTML = CATS.map((f, i) => { const sz = sizesOf(f); return `<li><a class="cxr ${i === 0 ? 'is-on' : ''}" href="#finder" data-fam="${f}" data-c="${f}" data-g="${f === 'spring' ? 'protect' : FAM[f].g}"><span class="cxr__n">${String(i + 1).padStart(2, '0')}</span><span class="cxr__t"><img src="${im(FAM[f].img)}" alt="" loading="lazy"></span><span class="cxr__name">${FAM[f].n}<small>${sz.length ? sz.length + ' sizes · ' : ''}${famItems(f).length} products</small></span><span class="cxr__p">from<b>${money(minP(f))}</b></span><span class="cxr__go">${icon('arrow')}</span></a></li>`; }).join('');
  function cxShow(f) {
    const sz = sizesOf(f), it = famItems(f);
    $('#cxPv').innerHTML = `<div class="pv"><div class="pv__img"><img src="${im(f === 'spline' ? 'cut-spline-15lb' : FAM[f].img)}" alt="${FAM[f].n}"><div class="pv__tag"><span>${FAM[f].g === 'window' ? 'Window & Door' : FAM[f].g === 'protect' ? 'Protection' : FAM[f].g === 'mask' ? 'Masking' : 'Automotive'}</span>${tagOf[f] ? `<span>${tagOf[f]}</span>` : ''}</div></div>
      <div class="pv__b"><div class="pv__h"><b>${FAM[f].n}</b><span><small>from </small>${money(minP(f))}</span></div><p class="pv__d">${FAM[f].d} ${it.length} products in stock.</p>
      ${sz.length ? `<div class="pv__sz">${sz.slice(0, 12).map(s => `<span>${fmtSize(s)}</span>`).join('')}${sz.length > 12 ? `<span>+${sz.length - 12}</span>` : ''}</div>` : ''}
      <div class="pv__cta"><a class="bt bt--ink" href="#finder" data-fam="${f}">Shop ${FAM[f].n.split(' ').slice(-1)[0].toLowerCase()} ${icon('arrow')}</a><a class="bt bt--line" href="#finder" data-fam="${f}">${icon('ruler')}Find my size</a></div></div></div>`;
  }
  $$('#cxList .cxr').forEach(r => r.addEventListener('mouseenter', () => { $$('#cxList .cxr').forEach(x => x.classList.toggle('is-on', x === r)); cxShow(r.dataset.c); }));
  cxShow('spline');
  tabs($('#catTabs'), b => { let first = null; $$('#cxList .cxr').forEach(r => { const hide = b.dataset.g !== 'all' && r.dataset.g !== b.dataset.g; r.classList.toggle('is-hidden', hide); if (!hide && !first) first = r; }); if (first) { $$('#cxList .cxr').forEach(x => x.classList.toggle('is-on', x === first)); cxShow(first.dataset.c); } });

  /* ---------------- Best sellers ---------------- */
  const BEST = [
    { f: 'spline', t: 'Round Retainer Screen Spline', sub: 'Serrated hollow-core black vinyl', b: [['Best seller', 'g']], r: '4.9', rc: 214, def: { s: '0.185', k: '250ft' }, sel: true },
    { f: 'flat', t: 'Flat Screen Spline', sub: 'For pool cages & patio enclosures', b: [['Contractor pick', 'i']], r: '4.8', rc: 96, def: { s: '0.290', k: '250ft' } },
    { f: 'spiral', t: 'Spiral Cable Wrap', sub: 'Polyethylene hose & wire protector', b: [['Sale', 'a']], r: '4.8', rc: 71, def: { s: '3/4"', k: '25ft' }, col: true },
    { f: 'tool', t: 'Screen Roller Tool', sub: 'Steel bearing wheels · hardwood handle', b: [['Must-have', '']], r: '4.7', rc: 158 },
    { f: 'netting', t: 'PE Protective Netting', sub: 'Expandable stretch sleeve spools', b: [['Bulk spool', 'i']], r: '4.9', rc: 43, def: { s: '2.00–2.50"' }, sel: true },
    { f: 'pet', t: 'Green Polyester PET Tape', sub: 'High-temp powder-coat masking · 72 yd', b: [['High-temp', 'g']], r: '4.8', rc: 64, def: { s: '1"', k: 'Single roll' } },
    { f: 'paper', t: 'Low-Temp Paper Masking Tape', sub: '54 yd rolls · single or case of 24', b: [['Case deal', 'a']], r: '4.7', rc: 38, def: { s: '2"', k: 'Single roll' } },
    { f: 'clips', t: '7/16" Window Screen Clips', sub: 'Diecast zinc fasteners · 100-pack', b: [['New', '']], r: '4.8', rc: 27 }
  ];
  const st = {};
  const pick = (c, s) => famItems(c.f).find(p => (!s.s || p.s === s.s) && (!s.k || p.k === s.k)) || null;
  BEST.forEach((c, i) => { const s = st[i] = Object.assign({}, c.def || {}); const p = pick(c, s); if (p && !p.a) { const a = famItems(c.f).find(x => x.a && x.s === s.s) || famItems(c.f).find(x => x.a); if (a) { s.s = a.s; s.k = a.k; } } });
  function card(c, i) {
    const s = st[i], p = pick(c, s), sizes = sizesOf(c.f), packs = packsOf(c.f);
    const so = sizes.length > 1 ? (c.sel ? `<label class="op"><span class="op__l">${FAM[c.f].sz}</span><select data-o="s">${sizes.map(x => `<option ${x === s.s ? 'selected' : ''} value="${esc(x)}">${fmtSize(x)}</option>`).join('')}</select></label>` : `<div class="op"><span class="op__l">${FAM[c.f].sz}</span><div class="op__r">${sizes.map(x => `<button class="ch" data-o="s" data-v="${esc(x)}" aria-pressed="${x === s.s}">${fmtSize(x)}</button>`).join('')}</div></div>`) : '';
    const po = packs.length > 1 ? `<div class="op"><span class="op__l">Quantity</span><div class="op__r">${packs.map(k => `<button class="ch" data-o="k" data-v="${k}" aria-pressed="${k === s.k}" ${famItems(c.f).some(x => x.s === s.s && x.k === k) ? '' : 'disabled'}>${packLabel(k)}</button>`).join('')}</div></div>` : '';
    const co = c.col && p && p.v.length ? `<div class="op"><span class="op__l">Color</span><div class="op__r">${p.v.map(x => `<button class="ch" data-o="c" data-v="${esc(x)}" aria-pressed="${x === (s.c || p.v[0])}">${x}</button>`).join('')}</div></div>` : '';
    return `<article class="pc" data-i="${i}" data-g="${FAM[c.f].g}"><div class="pc__m"><div class="pc__bd">${c.b.map(([t, k]) => `<span class="bd ${k ? 'bd--' + k : ''}">${t}</span>`).join('')}</div><img src="${im(p ? imgFor(p) : FAM[c.f].img)}" alt="${c.t}" loading="lazy">${s.s ? `<span class="pc__sp">${fmtSize(s.s)}</span>` : ''}</div>
      <div class="pc__b"><div class="pc__r">${STARS}${c.r} (${c.rc})</div><h3 class="pc__t">${c.t}</h3><p class="pc__s">${c.sub}</p>${so}${po}${co}
      <div class="pc__f"><div class="pr">${p ? money(p.p) + (p.c ? `<s>${money(p.c)}</s>` : '') + `<small>${p.k ? packLabel(p.k) : 'Each'}</small>` : '—'}</div><button class="add" ${p && p.a ? `data-add="${p.h}" data-variant="${c.col ? (s.c || p.v[0] || '') : ''}"` : 'disabled'}>${p && p.a ? icon('plus') + 'Add' : 'Sold out'}</button></div></div></article>`;
  }
  const bestRail = $('#bestRail');
  bestRail.innerHTML = BEST.map(card).join('');
  const reCard = (el, i) => { const t = document.createElement('div'); t.innerHTML = card(BEST[i], i); const n = t.firstElementChild; n.classList.toggle('is-hidden', el.classList.contains('is-hidden')); el.replaceWith(n); };
  const fixK = (c, s) => { if (!famItems(c.f).some(x => x.s === s.s && x.k === s.k)) { const a = famItems(c.f).find(x => x.s === s.s); s.k = a && a.k; } };
  bestRail.addEventListener('click', e => { const b = e.target.closest('.ch[data-o]'); if (!b) return; const el = b.closest('.pc'), i = +el.dataset.i; st[i][b.dataset.o] = b.dataset.v; if (b.dataset.o === 's') fixK(BEST[i], st[i]); reCard(el, i); });
  bestRail.addEventListener('change', e => { const s = e.target.closest('select[data-o]'); if (!s) return; const el = s.closest('.pc'), i = +el.dataset.i; st[i].s = s.value; fixK(BEST[i], st[i]); reCard(el, i); });
  tabs($('#bestTabs'), b => { $$('#bestRail .pc').forEach(c => c.classList.toggle('is-hidden', b.dataset.g !== 'all' && c.dataset.g !== b.dataset.g)); bestRail.scrollTo({ left: 0, behavior: 'smooth' }); });
  rail(bestRail);

  /* ---------------- Industries ---------------- */
  const igs = $$('#ig .ic2');
  igs.forEach(c => c.addEventListener('click', e => { if (!e.target.closest('a')) igs.forEach(x => x.classList.toggle('is-on', x === c && !x.classList.contains('is-on'))); }));
  $$('a[data-ind]').forEach(a => a.addEventListener('click', () => { igs.forEach(x => x.classList.toggle('is-on', x.dataset.i === a.dataset.ind)); }));

  /* ---------------- Solutions ---------------- */
  const SOL = [
    { n: 'Part protection', s: 'Packaging & shipping', img: 'app-red-netting', prob: 'Finished parts get nicked, scratched and tangled in transit.', bad: 'Scratched flanges mean returns, rework and unhappy customers.', good: 'Stretch-fit PE netting protects every surface, any shape.', steps: ['Measure', 'Pick a range', 'Slide on'],
      hot: [[44, 40, 'Stretch-fit sleeve', 'Expands over flanges and odd-shaped housings.'], [33, 58, 'Ready to ship', 'Clean, professional presentation.'], [62, 22, 'Breathable mesh', 'Protects without trapping moisture.']], prods: ['poly200green-net', 'mesh-protective-sleeves-1x4-to-1x2-inch'] },
    { n: 'Screen repair', s: 'Windows, doors & porches', img: 'app-screened-porch', prob: 'Torn or sagging screens let bugs in and look neglected.', bad: 'The wrong spline size pops out and the mesh sags.', good: 'The exact diameter locks the mesh drum-tight for years.', steps: ['Check size', 'Lay mesh', 'Roll & trim'],
      hot: [[22, 34, 'Exact-fit spline', '40+ diameters to lock into your channel.'], [52, 26, 'UV-stabilised vinyl', 'Stays flexible in full sun.'], [40, 60, 'Bug-free living', 'Add bug seals to sliding doors.']], prods: ['0-185-inch-window-screen-spline-250ft-roll', 'screen-roller-tool-door-window-screen-installation-repair', '7-16-inch-window-screen-clips-diecast-zinc-fasteners'] },
    { n: 'Hose & cable', s: 'Shop floor & fleet', img: 'app-hydraulic-wrap', prob: 'Exposed hoses and cables chafe, crack and fail early.', bad: 'Abrasion wears through hose covers — costly downtime.', good: 'Spiral wrap takes the wear and keeps runs organised.', steps: ['Measure hose', 'Pick size & colour', 'Twist on'],
      hot: [[46, 56, 'Abrasion shield', 'The coil takes the wear instead of the hose.'], [32, 34, 'High-vis yellow', 'Spot lines at a glance.']], prods: ['spiral-cable-wrap-3-4-inch-hose-protector-flexible-polyethylene-wire-conduit-tubing-cable-sleeve-cord-cover-to-organize-wires-and-hose', '2-inch-spiral-hydraulic-hose-wrap-100-ft-flexible-polyethylene-hose-and-wire-protector'] }
  ];
  let soI = 0, soT;
  $('#soList').innerHTML = SOL.map((s, i) => `<button class="sol ${i === 0 ? 'is-on' : ''}" role="tab" aria-selected="${i === 0}" data-s="${i}"><span class="sol__h"><span class="sol__n">0${i + 1}</span><span><b>${s.n}</b><small>${s.s}</small></span></span><span class="sol__x"><div><ul class="sol__pf"><li class="b">${icon('x')}<span>${s.bad}</span></li><li class="g">${icon('check')}<span>${s.good}</span></li></ul><ol class="sol__st">${s.steps.map(x => `<li>${x}</li>`).join('')}</ol></div></span></button>`).join('');
  function soRender(i) {
    soI = i; const s = SOL[i], ps = s.prods.map(h => BY[h]).filter(p => p && p.a);
    $$('#soList .sol').forEach((b, j) => { b.classList.toggle('is-on', j === i); b.setAttribute('aria-selected', j === i); });
    $('#soStage').innerHTML = `<div class="so__img"><img src="${im(s.img)}" alt="${s.n}" loading="lazy"><div class="so__prob"><span class="mono">Problem</span>${s.prob}</div>${s.hot.map((h, j) => `<button class="hot" style="--x:${h[0]}%;--y:${h[1]}%" data-h="${j}" aria-label="${h[2]}">${j + 1}</button><div class="tip" style="--x:${h[0]}%;--y:${h[1]}%" data-t="${j}"><b>${h[2]}</b>${h[3]}</div>`).join('')}</div>
      <div class="kit"><span class="kit__l">Solution kit<b>Build yours</b></span>${ps.map(p => `<label class="ki is-on"><input type="checkbox" checked value="${p.h}"><img src="${im(imgFor(p))}" alt=""><span>${short(p).slice(0, 28)}…<small>${money(p.p)}</small></span></label>`).join('')}<div class="kit__t"><span>Kit total<b id="kitT"></b></span><button class="bt bt--ink" id="kitAdd">${icon('cart')}<span>Add kit</span></button></div></div>`;
    kitSum();
  }
  function kitSum() { const c = $$('#soStage .ki input'); let t = 0, n = 0; c.forEach(x => { x.parentElement.classList.toggle('is-on', x.checked); if (x.checked) { t += BY[x.value].p; n++; } }); $('#kitT').textContent = money(t); const b = $('#kitAdd'); b.disabled = !n; b.querySelector('span').textContent = n === c.length ? 'Add kit' : n ? `Add ${n} item${n > 1 ? 's' : ''}` : 'Select items'; }
  const soAuto = () => { clearInterval(soT); soT = setInterval(() => { if (!$('.so').classList.contains('is-paused')) soRender((soI + 1) % SOL.length); }, 9000); };
  $('#soList').addEventListener('click', e => { const b = e.target.closest('.sol'); if (b) { soRender(+b.dataset.s); soAuto(); } });
  $('.so').addEventListener('mouseenter', () => $('.so').classList.add('is-paused'));
  $('.so').addEventListener('mouseleave', () => $('.so').classList.remove('is-paused'));
  $('#soStage').addEventListener('change', e => { if (e.target.matches('.ki input')) kitSum(); });
  $('#soStage').addEventListener('click', e => {
    if (e.target.closest('#kitAdd')) { const hs = $$('#soStage .ki input:checked').map(c => c.value); hs.forEach(h => addToCart(h, 1, (BY[h].v || [])[0] || '', true)); toast(`Added ${hs.length} item${hs.length > 1 ? 's' : ''} to your cart`); openCart(); clearInterval(soT); }
    const h = e.target.closest('.hot'); if (h) $$('#soStage .tip').forEach(t => t.classList.toggle('is-on', t.dataset.t === h.dataset.h && !t.classList.contains('is-on')));
  });
  $('#soStage').addEventListener('mouseover', e => { const h = e.target.closest('.hot'); if (h) $$('#soStage .tip').forEach(t => t.classList.toggle('is-on', t.dataset.t === h.dataset.h)); });
  $('#soStage').addEventListener('mouseout', e => { if (e.target.closest('.hot')) $$('#soStage .tip').forEach(t => t.classList.remove('is-on')); });
  soRender(0); soAuto();

  /* ---------------- Conversational finder ---------------- */
  const th = $('#fdThread');
  const F = { app: null, fam: null, s: null, k: null, sel: null };
  const scrollT = () => requestAnimationFrame(() => { th.scrollTop = th.scrollHeight; });
  function bot(html, delay = 380) {
    return new Promise(res => {
      const t = document.createElement('div'); t.className = 'msg msg--bot'; t.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>'; th.appendChild(t); scrollT();
      setTimeout(() => { t.innerHTML = html; scrollT(); res(t); }, delay);
    });
  }
  function me(txt) { const m = document.createElement('div'); m.className = 'msg msg--me'; m.innerHTML = `<span class="bub">${txt}</span>`; th.appendChild(m); scrollT(); }
  function lock(el, val) { const o = el.querySelector('.opts'); if (!o) return; $$('.opt', o).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === val)); o.classList.add('is-done'); }
  async function fdStart() {
    Object.assign(F, { app: null, fam: null, s: null, k: null, sel: null }); th.innerHTML = ''; fdSum();
    await bot(`<span class="bub">Hi! I'll help you find the exact product. <b>What are you working on?</b></span><div class="opts" data-q="app">${APPS.map(a => `<button class="opt" data-v="${a.id}">${icon(a.ic)}<span>${a.n[0].toUpperCase() + a.n.slice(1)}<small>${a.d}</small></span></button>`).join('')}</div>`, 250);
  }
  async function askFam() {
    const a = APPS.find(x => x.id === F.app);
    await bot(`<span class="bub">Great choice. <b>Which product do you need?</b></span><div class="opts" data-q="fam">${a.f.map(f => `<button class="opt" data-v="${f}"><img src="${im(FAM[f].img)}" alt=""><span>${FAM[f].n}<small>from ${money(minP(f))}</small></span></button>`).join('')}</div>`);
  }
  async function askSize() {
    const sz = sizesOf(F.fam);
    if (!sz.length) return showRes();
    await bot(`<span class="bub"><b>Which ${FAM[F.fam].sz.toLowerCase()}?</b> ${FAM[F.fam].tip}</span><div class="opts" data-q="s">${sz.map(s => `<button class="opt opt--c" data-v="${esc(s)}">${fmtSize(s)}</button>`).join('')}</div>`);
  }
  async function askPack() {
    const ps = [...new Set(famItems(F.fam).filter(p => p.s === F.s).map(p => p.k).filter(Boolean))].sort((a, b) => PACK.indexOf(a) - PACK.indexOf(b));
    if (ps.length < 2) return showRes();
    await bot(`<span class="bub"><b>How much do you need?</b></span><div class="opts" data-q="k">${ps.map(k => `<button class="opt opt--c" data-v="${k}">${packLabel(k)}</button>`).join('')}<button class="opt opt--c" data-v="">Show all</button></div>`);
  }
  async function showRes() {
    const r = famItems(F.fam).filter(p => (!F.s || p.s === F.s) && (!F.k || p.k === F.k)).sort((a, b) => (b.a - a.a) || PACK.indexOf(a.k) - PACK.indexOf(b.k));
    F.sel = (r.find(p => p.a) || r[0] || {}).h || null;
    await bot(`<span class="bub">Here ${r.length > 1 ? `are your <b>${r.length} matches</b>` : 'is your <b>match</b>'} — the best one is highlighted.</span><div class="res">${r.map(p => `<div class="re ${p.h === F.sel ? 'is-sel' : ''}" data-sel="${p.h}"><img src="${im(imgFor(p))}" alt=""><div><b>${short(p)}</b><small>${[fmtSize(p.s), p.k && packLabel(p.k), p.v.join(' / ')].filter(Boolean).join(' · ')}</small>${p.a ? '' : '<span class="oos">Sold out — notify me</span>'}</div><div class="re__r"><span class="re__p">${money(p.p)}</span><button class="add" ${p.a ? `data-add="${p.h}" data-variant="${p.v[0] || ''}"` : 'disabled'}>${p.a ? icon('plus') + 'Add' : 'Sold out'}</button></div></div>`).join('')}</div>`, 520);
    fdSum();
  }
  th.addEventListener('click', async e => {
    const o = e.target.closest('.opt'); if (o && !o.closest('.is-done')) {
      const q = o.closest('.opts').dataset.q, v = o.dataset.v; lock(o.closest('.msg'), v);
      if (q === 'app') { F.app = v; me(APPS.find(a => a.id === v).n[0].toUpperCase() + APPS.find(a => a.id === v).n.slice(1)); fdSum(); askFam(); }
      if (q === 'fam') { F.fam = v; me(FAM[v].n); fdSum(); askSize(); }
      if (q === 's') { F.s = v; me(fmtSize(v)); fdSum(); askPack(); }
      if (q === 'k') { F.k = v || null; me(v ? packLabel(v) : 'Show all options'); showRes(); }
      return;
    }
    const r = e.target.closest('[data-sel]'); if (r && !e.target.closest('.add')) { F.sel = r.dataset.sel; $$('.re', r.parentElement).forEach(x => x.classList.toggle('is-sel', x === r)); fdSum(); }
  });
  function fdSum() {
    const a = APPS.find(x => x.id === F.app), p = F.sel && BY[F.sel], fam = F.fam && FAM[F.fam];
    const img = p ? imgFor(p) : fam ? fam.img : null;
    const row = (k, v) => `<div><dt>${k}</dt><dd class="${v ? '' : 'e'}">${v || '—'}</dd></div>`;
    $('#fdSum').innerHTML = `<div class="fs__h"><span class="mono">Your match</span><span class="fs__st ${p ? 'fs__st--ok' : ''}">${p ? 'Ready to order' : 'In progress'}</span></div>
      <div class="fs__img">${img ? `<img src="${im(img)}" alt="">${p && p.s ? `<span class="pc__sp">${fmtSize(p.s)}</span>` : ''}` : `<div class="fs__ph">${icon('target')}<span>Answer the questions to see your match</span></div>`}</div>
      <dl class="fs__dl">${row('Application', a && a.n[0].toUpperCase() + a.n.slice(1))}${row('Product', fam && fam.n)}${row('Size', (p && fmtSize(p.s)) || (F.s && fmtSize(F.s)))}${row('Quantity', p && p.k && packLabel(p.k))}</dl>
      ${p ? `<div class="fs__buy"><span class="fs__t">${short(p)}</span><span class="fs__p">${money(p.p)}${p.c ? `<s>${money(p.c)}</s>` : ''}</span><button class="bt bt--green bt--block" ${p.a ? `data-add="${p.h}" data-variant="${p.v[0] || ''}"` : 'disabled'}>${p.a ? icon('cart') + 'Add to cart' : 'Sold out'}</button></div>` : ''}
      <ul class="fs__ok"><li>${icon('check')}Professional-grade, quality controlled</li><li>${icon('check')}Free Regular Shipping on eligible orders</li><li>${icon('check')}30-day returns · prepaid label</li></ul>`;
  }
  async function fdJump(app, fam) {
    Object.assign(F, { app, fam, s: null, k: null, sel: null }); th.innerHTML = '';
    await bot(`<span class="bub">Hi! <b>What are you working on?</b></span><div class="opts is-done" data-q="app">${APPS.map(a => `<button class="opt" data-v="${a.id}" aria-pressed="${a.id === app}">${icon(a.ic)}<span>${a.n[0].toUpperCase() + a.n.slice(1)}</span></button>`).join('')}</div>`, 10);
    me(APPS.find(a => a.id === app).n[0].toUpperCase() + APPS.find(a => a.id === app).n.slice(1));
    me(FAM[fam].n); fdSum(); askSize();
  }
  $('#fdReset').addEventListener('click', fdStart);
  document.addEventListener('click', e => { const a = e.target.closest('a[data-fam]'); if (!a || !FAM[a.dataset.fam]) return; const f = a.dataset.fam; fdJump((APPS.find(x => x.f.includes(f)) || APPS[0]).id, f); });
  fdStart();

  /* ---------------- Wholesale ---------------- */
  $('#volSteps').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('#volSteps button').forEach(x => x.classList.toggle('is-on', x === b)); $('#volFill').style.width = ((+b.dataset.v + 1) * 20) + '%'; });
  let vi = 0; const vT = setInterval(() => { vi = (vi + 1) % 5; $$('#volSteps button')[vi].click(); }, 1800);
  $('#volSteps').addEventListener('mouseenter', () => clearInterval(vT));
  $$('.wf__chips').forEach(g => g.addEventListener('click', e => { const b = e.target.closest('button'); if (b) $$('button', g).forEach(x => x.classList.toggle('is-on', x === b)); }));
  $('#wf').addEventListener('submit', e => { e.preventDefault(); let ok = true; $$('#wf input[required]').forEach(i => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.classList.toggle('is-err', bad); if (bad) ok = false; }); if (ok) $('#wf .wf__ok').hidden = false; else toast('Please complete the highlighted fields'); });

  /* ---------------- About: scroll-lit statement ---------------- */
  const big = $('#abBig');
  const HL = ['exact', 'nobody', 'complete', 'professional-grade', 'expert', 'support.'];
  big.innerHTML = big.textContent.split(/\s+/).map(w => `<span class="wd ${HL.includes(w.toLowerCase()) ? 'hl' : ''}">${w}</span>`).join(' ');
  const words = $$('.wd', big);
  const lit = () => { const r = big.getBoundingClientRect(), vh = innerHeight; const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35))); const n = Math.round(p * words.length); words.forEach((w, i) => w.classList.toggle('lit', i < n)); };
  addEventListener('scroll', lit, { passive: true }); lit();
  const sio = new IntersectionObserver(es => es.forEach(en => { if (!en.isIntersecting) return; sio.unobserve(en.target); $$('b[data-to]', en.target).forEach(b => { const to = +b.dataset.to, suf = b.dataset.suf || '', t0 = performance.now(); const tick = t => { const k = Math.min(1, (t - t0) / 1400); b.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }); }), { threshold: .4 });
  sio.observe($('#stats'));

  /* ---------------- Reviews ---------------- */
  const RV = [
    { n: 'Mike R.', r: 'Screen contractor · Tampa, FL', d: 'Oct 2026', b: 'Finally found .175 spline that fits our older pool-cage frames. Rolls in clean, and the 15 lb roll covers a full week of jobs.', p: '0-175-inch-window-screen-spline', k: 'ink' },
    { n: 'Dana K.', r: 'Ops lead · CNC shop, OH', d: 'Oct 2026', b: 'We wrap shafts and valve bodies before shipping. Not one scratch complaint since we moved to FinePS netting.', p: 'poly200green-net' },
    { n: 'Luis T.', r: 'Powder coater · Houston, TX', d: 'Sep 2026', b: 'Green PET tape holds through the whole cure cycle and peels off clean. Case pricing beats our old distributor.', p: 'green-pet-tape-1-inch-x-72-yard-single-roll', k: 'g' },
    { n: 'Angela S.', r: 'Homeowner · Phoenix, AZ', d: 'Sep 2026', b: 'No idea what size I needed. Sent a photo, got an answer the same day — the screen door looks brand new.', p: 'screen-roller-tool-door-window-screen-installation-repair' },
    { n: 'Greg W.', r: 'Fleet maintenance · Dallas, TX', d: 'Aug 2026', b: 'The yellow 2" spiral wrap makes hydraulic lines easy to spot and stopped the rubbing on our trailer frames.', p: '2-inch-spiral-hydraulic-hose-wrap-100-ft-flexible-polyethylene-hose-and-wire-protector' },
    { n: 'Priya N.', r: 'Property manager · Orlando, FL', d: 'Aug 2026', b: 'We re-screen units at turnover. Spline, clips and tools from one place has saved our team hours.', p: '7-16-inch-window-screen-clips-diecast-zinc-fasteners', k: 'ink' },
    { n: 'Tom B.', r: 'DIY · Charlotte, NC', d: 'Jul 2026', b: 'Big-box stores only had round spline. The .315 flat spline was exactly what my lanai needed.', p: '0-315-inch-flat-screen-spline-250ft' },
    { n: 'Rosa M.', r: 'Paint line supervisor · Phoenix, AZ', d: 'Jul 2026', b: 'Green dots go on in seconds and survive the oven. Our masking time on threaded holes dropped noticeably.', p: 'green-dots-2-inch-x-1-000-dots-single-roll' }
  ];
  const rvRail = $('#rvRail');
  rvRail.innerHTML = RV.map(r => { const p = BY[r.p]; return `<article class="rq ${r.k ? 'rq--' + r.k : ''}"><div class="rq__top">${STARS}<span class="mono">${r.d}</span></div><blockquote>${r.b}</blockquote>${p ? `<div class="rq__p"><img src="${im(imgFor(p))}" alt=""><span><small>Purchased</small>${short(p).slice(0, 40)}${short(p).length > 40 ? '…' : ''}</span></div>` : ''}<div class="rq__w"><span class="av">${r.n.replace('.', '').split(' ').map(w => w[0]).join('')}</span><span><b>${r.n}</b><small>${r.r}</small></span><span class="vb">${icon('check')}Verified</span></div></article>`; }).join('');
  rail(rvRail, (el, max) => { const w = el.clientWidth / el.scrollWidth, b = $('#rvProg'); b.style.width = w * 100 + '%'; b.style.left = (max ? el.scrollLeft / max * (1 - w) * 100 : 0) + '%'; });
  rvRail.addEventListener('keydown', e => { if (e.key === 'ArrowRight') rvRail.scrollBy({ left: 436, behavior: 'smooth' }); if (e.key === 'ArrowLeft') rvRail.scrollBy({ left: -436, behavior: 'smooth' }); });
  $('#allReviews').addEventListener('click', e => { e.preventDefault(); toast('Prototype: opens the full reviews page (612 reviews)'); });

  /* ---------------- FAQ ---------------- */
  $('#qa').addEventListener('click', e => { const b = e.target.closest('.q>button'); if (!b) return; const q = b.parentElement, on = !q.classList.contains('is-open'); $$('#qa .q').forEach(x => { x.classList.remove('is-open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); }); if (on) { q.classList.add('is-open'); b.setAttribute('aria-expanded', 'true'); } });
  tabs($('#faqTabs'), b => $$('#qa .q').forEach(q => q.classList.toggle('is-hidden', b.dataset.c !== 'all' && q.dataset.c !== b.dataset.c)));

  /* ---------------- Final CTA product marquee ---------------- */
  const MQ = ['spline', 'netting', 'spiral', 'pet', 'flat', 'tool', 'paper', 'dots', 'glass', 'bugseal', 'clips', 'smooth'];
  const mqHtml = MQ.map(f => `<a class="fin__it" href="#finder" data-fam="${f}"><img src="${im(f === 'netting' ? 'cut-netting-red' : FAM[f].img)}" alt="" loading="lazy"><span><b>${FAM[f].n}</b><small>from ${money(minP(f))}</small></span></a>`).join('');
  $('#finTrack').innerHTML = mqHtml + mqHtml;
  $('#nl').addEventListener('submit', e => { e.preventDefault(); $('#nl .nl__ok').hidden = false; $('#nlE').value = ''; });

  /* ---------------- Footer wordmark ---------------- */
  const wm = $('#wm'), L = $$('span', wm);
  const hot = i => L.forEach((l, j) => { l.classList.toggle('is-hot', j === i); l.classList.toggle('is-near', Math.abs(j - i) === 1); });
  wm.addEventListener('mousemove', e => { let b = 0, bd = 1e9; L.forEach((l, j) => { const r = l.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2)); if (d < bd) { bd = d; b = j; } }); hot(b); });
  wm.addEventListener('mouseleave', () => hot(-9));
  const wio = new IntersectionObserver(es => es.forEach(en => { if (!en.isIntersecting) return; wio.unobserve(wm); L.forEach((l, j) => setTimeout(() => hot(j), 160 * j)); setTimeout(() => hot(-9), 160 * L.length + 300); }), { threshold: .5 });
  wio.observe(wm);

  /* ---------------- Reveal ---------------- */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv-in').forEach((el, i) => { el.style.transitionDelay = (i % 5) * 70 + 'ms'; io.observe(el); });

  renderCart();
})();
