/* FinePS — inner pages (shop, categories, product, industries, bulk quote, contact, cart) */
(function () {
  'use strict';
  const FPS = window.FPS; const B = FPS.B;
  const { $, $$, esc, money, icon, im, fmtSize, fmtLen, fmtYd, num, short, ILL, visual, MK, netInfo, ftLen, dotsCount, LINE_ORDER, INDS, ut, toast, openQuote, slug, CATS, FAMINFO, PRODUCTS, PBY, purl, pItems, pFrom, imgFor, BY } = FPS;
  const page = document.body.dataset.page, key = document.body.dataset.key;
  const params = new URLSearchParams(location.search);
  const ORDER = ['masking', ...LINE_ORDER];

  /* ---------- shared bits ---------- */
  const crumbs = list => `<nav class="crumbs" aria-label="Breadcrumb"><a href="${B || './'}">Home</a>${list.map(([n, h]) => `${icon('chev', 'ic cr')}${h ? `<a href="${h}">${n}</a>` : `<span aria-current="page">${n}</span>`}`).join('')}</nav>`;
  const bulkBox = (name) => `<aside class="bulk" aria-label="Bulk orders"><span class="bulk__ic">${icon('chat')}</span><p><b>Need a larger quantity?</b> We offer deeper pricing on bulk, corporate and government orders. <button class="bulk__a" data-quote="${esc(name || '')}">Request a quote</button> and we'll get right back to you.</p></aside>`;
  const lineName = k => (CATS[k] || {}).n || '';
  function gcard(p) {
    const items = pItems(p), sizes = [...new Set(items.map(x => x.s).filter(Boolean))];
    const inStock = !p.soon && items.some(x => x.a);
    const badge = p.soon ? '<span class="req-b">On request</span>' : inStock ? '<span class="gc__in">In stock</span>' : '<span class="req-b">Contact us</span>';
    return `<article class="gc" data-soon="${p.soon ? 1 : 0}"><a class="gc__m" href="${purl(p.id)}">${badge}${visual(p)}</a><div class="gc__b"><small>${lineName(p.line)}</small><h3><a href="${purl(p.id)}">${p.n}</a></h3>
      <p>${p.soon ? (p.opts ? p.opts + ' · ' : '') + 'Sizes in inches or mm on request' : (sizes.length > 1 ? sizes.length + ' sizes' : items.length > 1 ? items.length + ' options' : 'Single item') + (p.line === 'masking' ? ' · single roll' : '')}</p>
      <div class="gc__f"><b>${p.soon ? 'Quote' : (sizes.length > 1 || items.length > 1 ? '<small>from</small> ' : '') + money(pFrom(p))}</b>${p.soon ? `<button class="add add--q" data-quote="${esc(p.n)}" data-vis="${p.ill}" data-note="${esc(lineName(p.line))} · available on request">Request</button>` : `<a class="add" href="${purl(p.id)}">Choose size</a>`}</div></div></article>`;
  }
  const grid = list => `<div class="gg">${list.map(gcard).join('')}</div>`;

  /* ---------- collection pages ---------- */
  function collection() {
    const C = CATS[key], list = PRODUCTS.filter(p => p.line === key);
    const hasStock = list.some(p => !p.soon), hasReq = list.some(p => p.soon);
    let filter = 'all';
    const tapeTable = key !== 'masking' ? '' : `<details class="cmp"><summary><span>${icon('grid')}Compare masking tapes</span><small>Temperature, adhesive, roll length and widths side by side</small>${icon('chev', 'ic chev')}</summary><div class="cmp__wrap"><table class="cmp__t" id="cmpT"></table></div></details>`;
    $('#pg').innerHTML = `<section class="phd"><div class="w">${crumbs([[C.n]])}<div class="phd__g"><div><h1>${C.n}${C.isNew ? ' <span class="new">New</span>' : ''}</h1><p>${C.d}</p><p class="phd__n">${list.length} products · ${list.filter(p => !p.soon).length} in stock</p></div><div class="phd__v">${C.img ? `<img src="${im(C.img)}" alt="">` : ILL[C.ill]}</div></div></div></section>
      <section class="sec sec--top"><div class="w">
        ${hasStock && hasReq ? `<div class="tabs" id="cf" role="tablist"><button role="tab" aria-selected="true" data-f="all">All (${list.length})</button><button role="tab" aria-selected="false" data-f="0">In stock (${list.filter(p => !p.soon).length})</button><button role="tab" aria-selected="false" data-f="1">On request (${list.filter(p => p.soon).length})</button></div>` : ''}
        <div id="cg">${grid(list)}</div>
        ${tapeTable}
        ${bulkBox(C.n)}
      </div></section>
      <section class="sec sec--soft"><div class="w"><div class="sh"><div><p class="ey">Keep shopping</p><h2 class="h2">Other categories</h2></div><a class="tl" href="${B}shop/">Shop all products ${icon('arrow')}</a></div>
      <div class="oc">${ORDER.filter(k => k !== key).map(k => `<a class="oc__i" href="${CATS[k].page}"><span>${CATS[k].img ? `<img src="${im(CATS[k].img)}" alt="">` : ILL[CATS[k].ill]}</span><b>${CATS[k].n}</b>${icon('arrow')}</a>`).join('')}</div></div></section>`;
    const cf = $('#cf');
    if (cf) cf.addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; filter = b.dataset.f; $$('button', cf).forEach(x => x.setAttribute('aria-selected', x === b)); $('#cg').innerHTML = grid(list.filter(p => filter === 'all' || String(+!!p.soon) === filter)); });
    const cmp = () => { const t = $('#cmpT'); if (!t) return; t.innerHTML = `<thead><tr><th>Tape</th><th>Temperature</th><th>Best for</th><th>Adhesive</th><th>Roll length</th><th>Widths (${FPS.UNIT === 'mm' ? 'mm' : 'in'})</th><th>From</th></tr></thead><tbody>` + list.map(p => { const m = MK[p.id], it = pItems(p); return `<tr><td><a href="${purl(p.id)}">${visual(p)}${p.n}</a></td>${m.soon ? '<td colspan="5" class="m">On request</td>' : `<td>${m.temp}</td><td>${m.best || ''}</td><td>${m.adh}</td><td>${fmtYd(m.yd)}</td><td>${it.map(x => fmtSize(x.s).replace(' mm', '')).join(', ')}</td>`}<td>${m.soon ? `<button class="tl" data-quote="${esc(p.n)}">Quote</button>` : '<b>' + money(pFrom(p)) + '</b>'}</td></tr>`; }).join('') + '</tbody>'; };
    cmp(); FPS.onUnit(cmp);
  }

  /* ---------- shop all ---------- */
  function shop() {
    const groups = [...ORDER, 'auto'];
    $('#pg').innerHTML = `<section class="phd"><div class="w">${crumbs([['Shop all products']])}<div class="phd__g"><div><h1>Shop all products</h1><p>Masking tape, die-cuts, netting, spiral wrap, caps, plugs, hooks and screen supplies. In-stock items ship at a flat price; everything else we quote quickly.</p><p class="phd__n">${PRODUCTS.length} products</p></div><div class="phd__v"><img src="${im('cut-pet-lineup')}" alt=""></div></div></div></section>
      <div class="jump"><div class="w">${groups.map(k => `<a href="#${k}">${CATS[k].n}</a>`).join('')}</div></div>
      <section class="sec sec--top"><div class="w">${groups.map(k => { const list = PRODUCTS.filter(p => p.line === k); return `<div class="grp" id="${k}"><div class="grp__h"><h2>${CATS[k].n}${CATS[k].isNew ? ' <span class="new">New</span>' : ''}</h2>${k !== 'auto' ? `<a class="tl" href="${CATS[k].page}">View category ${icon('arrow')}</a>` : ''}</div>${grid(list)}</div>`; }).join('')}
      ${bulkBox()}</div></section>`;
  }

  /* ---------- product page ---------- */
  function product() {
    const id = params.get('id') || 'pet';
    const p = PBY[id] || PBY.pet;
    const fi = FAMINFO[p.fam] || {}, m = MK[p.id];
    const C = CATS[p.line] || CATS.masking;
    document.title = `${p.n} | FinePS`;
    const md = document.querySelector('meta[name=description]'); if (md) md.setAttribute('content', `${p.n} from FinePS. ${(m && m.d) || fi.d || C.d}`);
    const items = pItems(p);
    const st = { h: null, q: 1, v: '', img: 0 };
    const pick0 = items.find(x => x.a && (/^1"$/.test(x.s) || x.s === '0.185' || x.s === '2.00–2.50"')) || items.find(x => x.a) || items[0];
    if (pick0) { st.h = pick0.h; st.v = (pick0.v || [])[0] || ''; }
    const imgs0 = p.soon ? [] : (fi.imgs || [p.img]);
    if (pick0 && /^(spline|flat)$/.test(p.fam)) { const gi = imgs0.indexOf(imgFor(pick0)); if (gi > -1) st.img = gi; }
    if (pick0 && p.fam === 'netting' && netInfo(pick0.s)) { const gi = imgs0.indexOf(FPS.NETIMG[netInfo(pick0.s)[2]]); if (gi > -1) st.img = gi; }
    const desc = (m && m.d) || fi.d || `${p.n} for ${C.n.toLowerCase()} work. Tell us the size and quantity you need and we'll send availability and pricing — usually within one business day.`;
    const imgs = p.soon ? [] : (fi.imgs || [p.img]);
    const related = PRODUCTS.filter(x => x.line === p.line && x.id !== p.id).sort((a, b) => a.soon - b.soon).slice(0, 4);
    $('#pg').innerHTML = `<section class="sec sec--pd"><div class="w">${crumbs([[C.n, C.page.includes('shop/') ? B + 'shop/' : C.page], [p.n]])}<div class="pd" id="pd"></div></div></section>
      <section class="sec sec--soft"><div class="w pdx" id="pdx"></div></section>
      ${related.length ? `<section class="sec"><div class="w"><div class="sh"><div><p class="ey">${C.n}</p><h2 class="h2">You may also need</h2></div><a class="tl" href="${C.page}">View all ${icon('arrow')}</a></div>${grid(related)}</div></section>` : ''}`;
    function sel() { return BY[st.h]; }
    function render() {
      const x = sel();
      const gal = p.soon ? `<div class="gal"><div class="gal__m gal__m--ill">${ILL[p.ill]}</div></div>`
        : `<div class="gal"><div class="gal__m${/^(p|app|n)-/.test(imgs[st.img] || imgs[0]) ? ' gal__m--ph' : ''}"><img src="${im(imgs[st.img] || imgs[0])}" alt="${esc(p.n)}"></div>${imgs.length > 1 ? `<div class="gal__t">${imgs.map((g, i) => `<button class="${i === st.img ? 'is-on' : ''}${/^(p|app|n)-/.test(g) ? ' ph' : ''}" data-g="${i}" aria-label="Image ${i + 1}"><img src="${im(g)}" alt=""></button>`).join('')}</div>` : ''}</div>`;
      let buy;
      if (p.soon || !x) {
        buy = `<div class="req"><b>Request this product</b><p>Tell us the size and quantity — we'll reply with availability and pricing.</p>
          <div class="fld"><span class="fld__l">Size you need ${ut()}</span><div class="req__f"><input id="reqW" placeholder="${FPS.UNIT === 'mm' ? 'e.g. 25 mm' : 'e.g. 1 inch'}" aria-label="Size you need"><input id="reqQ" placeholder="Quantity" aria-label="Quantity" style="max-width:140px"></div></div>
          <button class="bt bt--dark bt--lg bt--block" id="reqBtn" data-quote="${esc(p.n)}" data-vis="${p.ill || p.img}" data-note="${esc(C.n)} · available on request">Request a quote ${icon('arrow')}</button></div>`;
      } else {
        const sizes = [...new Set(items.map(i => i.s).filter(Boolean))].sort((a, b) => num(a) - num(b));
        const lens = [...new Set(items.filter(i => i.s === x.s).map(i => i.k).filter(Boolean))];
        const extra = s => p.fam === 'dots' ? ' · ' + dotsCount(items.find(i => i.s === s)) : p.fam === 'netting' && netInfo(s) ? ' · ' + netInfo(s)[2] + ' · ' + ftLen(netInfo(s)[3]) : '';
        const sizeSel = sizes.length > 1 ? `<div class="fld"><span class="fld__l">${fi.lbl || 'Size'} · ${sizes.length} sizes ${ut()}</span><span class="sel"><select id="pdS" aria-label="${fi.lbl || 'Size'}">${sizes.map(s => `<option value="${esc(s)}" ${s === x.s ? 'selected' : ''}>${fmtSize(s)}${extra(s)}</option>`).join('')}</select></span></div>`
          : !sizes.length && items.length > 1 ? `<div class="fld"><span class="fld__l">Option</span><span class="sel"><select id="pdO" aria-label="Option">${items.map(i => `<option value="${i.h}" ${i.h === x.h ? 'selected' : ''}>${short(i)}</option>`).join('')}</select></span></div>` : '';
        const lenRow = lens.length > 1 ? `<div class="opt"><span class="fld__l">Length</span><div class="chips">${lens.map(k => `<button class="ch" data-k="${esc(k)}" aria-pressed="${k === x.k}">${fmtLen(k)}</button>`).join('')}</div></div>` : '';
        const colRow = x.v && x.v.length > 1 ? `<div class="opt"><span class="fld__l">Colour</span><div class="chips">${x.v.map(c => `<button class="ch" data-v="${esc(c)}" aria-pressed="${c === st.v}">${c}</button>`).join('')}</div></div>` : '';
        const thick = p.id === 'pet' ? `<div class="opt"><span class="fld__l">Thickness</span><div class="chips"><button class="ch" aria-pressed="true">2 mil</button><button class="ch" data-quote="${esc(p.n)} — 1 mil" data-vis="${p.img}" data-note="1 mil — available on request">1 mil <small>· request</small></button><button class="ch" data-quote="${esc(p.n)} — 5 mil" data-vis="${p.img}" data-note="5 mil — available on request">5 mil <small>· request</small></button></div></div>` : '';
        const ni = p.fam === 'netting' && netInfo(x.s);
        buy = `${thick}${sizeSel}${lenRow}${colRow}${ni ? `<span class="pc__len">${icon('ruler')}${ftLen(ni[3])} roll · ${ni[2]} · Part no. ${ni[1]}</span>` : FPS.partNo(p.fam, x.s) || (m && m.yd) ? `<span class="pc__len">${icon('ruler')}${[m && m.yd ? m.yd + ' yd (' + ({ pet: 66, glass: 30, paper: 50 }[m.id] || Math.round(m.yd * 0.9144)) + ' m) roll' : '', p.fam === 'dots' ? dotsCount(x) : '', FPS.partNo(p.fam, x.s) ? 'Part no. ' + FPS.partNo(p.fam, x.s) : ''].filter(Boolean).join(' · ')}</span>` : ''}
          <div class="price"><b>${money(x.p)}</b><small>${ni ? 'per ' + ftLen(ni[3]) + ' roll' : p.line === 'masking' || p.fam === 'dots' ? 'per roll' : x.k && x.k !== 'Single roll' ? 'per ' + fmtLen(x.k) : 'each'}</small>${x.a ? `<span class="stk"><i></i>In stock</span>` : `<span class="stk stk--o"><i></i>Out of stock</span>`}</div>
          <div class="buy__row"><div class="fld"><span class="fld__l">Quantity</span><div class="qty"><button type="button" data-st="-1" aria-label="Less">${icon('minus')}</button><input id="pdQ" type="number" min="1" value="${st.q}" aria-label="Quantity"><button type="button" data-st="1" aria-label="More">${icon('plus')}</button></div></div>
          ${x.a ? `<button class="bt bt--green bt--lg" data-add="${x.h}" data-qty="${st.q}" data-variant="${esc(st.v)}">${icon('cart')}Add to cart · ${money(x.p * st.q)}</button>` : `<button class="bt bt--dark bt--lg" data-quote="${esc(p.n)}" data-size="${esc(fmtSize(x.s))}" data-vis="${imgFor(x)}" data-note="Out of stock — we'll confirm availability">${icon('chat')}Contact us for this size</button>`}</div>`;
      }
      const temp = m && !m.soon ? `<div class="tempx">${icon('thermo')}<span><b>Temperature range: ${m.temp}</b><small>${m.tnote}</small></span></div>` : '';
      $('#pd').innerHTML = `${gal}<div class="pd__i">${p.soon ? '<span class="req-b">Available on request</span>' : p.isNew ? '<span class="new">New</span>' : ''}<p class="pd__k">${C.n}</p><h1>${p.n}</h1><p class="pd__d">${desc}</p>${temp}
        <div class="pd__buy">${buy}</div>
        <ul class="pd__ok"><li>${icon('truck')}Ships to all 50 states</li><li>${icon('return')}30-day returns</li><li>${icon('lock')}Secure checkout</li></ul>
        ${bulkBox(p.n)}</div>`;
      // details below
      const spec = fi.spec || (p.opts ? [['Thickness options', p.opts]] : []);
      const uses = fi.uses || (m && m.uses) || [];
      const chart = !p.soon && items.length > 1 ? `<div class="pdx__c"><div class="pdx__h"><h2>Sizes &amp; prices</h2>${items.some(i => i.s) ? ut() : ''}</div><div class="tw"><table class="tbl"><thead><tr><th>${fi.lbl || 'Size'}</th>${items.some(i => i.k && i.k !== 'Single roll') || p.fam === 'netting' ? '<th>Roll / length</th>' : ''}${p.fam === 'netting' ? '<th>Colour</th><th>Part no.</th>' : ''}${p.fam === 'dots' ? '<th>Per roll</th>' : ''}${FPS.PN[p.fam] ? '<th>Part no.</th>' : ''}<th>Price</th><th>Stock</th><th></th></tr></thead><tbody>${items.map(i => { const n2 = p.fam === 'netting' && netInfo(i.s); return `<tr><td><b>${i.s ? fmtSize(i.s) : short(i)}</b></td>${items.some(j => j.k && j.k !== 'Single roll') || p.fam === 'netting' ? `<td>${n2 ? ftLen(n2[3]) : fmtLen(i.k)}</td>` : ''}${p.fam === 'netting' ? `<td>${n2 ? n2[2] : ''}</td><td>${n2 ? n2[1] : ''}</td>` : ''}${p.fam === 'dots' ? `<td>${dotsCount(i).replace(' / roll', '')}</td>` : ''}${FPS.PN[p.fam] ? `<td>${FPS.partNo(p.fam, i.s) || '—'}</td>` : ''}<td>${money(i.p)}</td><td>${i.a ? '<span class="stk"><i></i>In stock</span>' : '<span class="stk stk--o"><i></i>Out</span>'}</td><td>${i.a ? `<button class="add" data-add="${i.h}" data-variant="${esc((i.v || [])[0] || '')}">${icon('plus')}Add</button>` : `<button class="add add--q" data-quote="${esc(p.n)}" data-size="${esc(fmtSize(i.s))}">Contact</button>`}</td></tr>`; }).join('')}</tbody></table></div></div>` : '';
      $('#pdx').innerHTML = `<div class="pdx__g"><div class="pdx__c"><h2>Specifications</h2>${spec.length ? `<table class="tbl tbl--spec"><tbody>${spec.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</tbody></table>` : '<p>Specifications available on request — we\'ll send the data sheet with your quote.</p>'}</div>
        <div class="pdx__c"><h2>Common uses</h2>${uses.length ? `<ul class="uses2">${uses.map(u => `<li>${icon('check')}${u}</li>`).join('')}</ul>` : '<p>Tell us your application and we\'ll confirm this is the right product.</p>'}<h2 style="margin-top:28px">Shipping &amp; returns</h2><p>Free Regular Shipping (8–10 days), or Expedited (2–4 days) priced by zone and order weight. Returns within 30 days with an RGA number (20% restocking fee; custom items can't be returned). <a class="tl" href="${B}help/#shipping">Details</a></p></div></div>${chart}`;
      const r = $('#reqW'); if (r) r.addEventListener('input', () => { $('#reqBtn').dataset.size = [r.value, $('#reqQ').value && 'Qty ' + $('#reqQ').value].filter(Boolean).join(' · '); });
      const rq = $('#reqQ'); if (rq) rq.addEventListener('input', () => r.dispatchEvent(new Event('input')));
    }
    $('#pg').addEventListener('click', e => {
      const g = e.target.closest('[data-g]'); if (g) { st.img = +g.dataset.g; render(); return; }
      const k = e.target.closest('.pd [data-k]'); if (k) { const x = sel(), n = items.find(i => i.s === x.s && i.k === k.dataset.k); if (n) { st.h = n.h; const gi = imgs.indexOf(imgFor(n)); if (gi > -1) st.img = gi; render(); } return; }
      const v = e.target.closest('.pd [data-v]'); if (v) { st.v = v.dataset.v; render(); return; }
      const s = e.target.closest('.pd [data-st]'); if (s) { st.q = Math.max(1, st.q + +s.dataset.st); render(); }
    });
    $('#pg').addEventListener('change', e => {
      if (e.target.id === 'pdS') { const x = sel(); const n = items.find(i => i.s === e.target.value && i.k === x.k && i.a) || items.find(i => i.s === e.target.value && i.a) || items.find(i => i.s === e.target.value); st.h = n.h; st.v = (n.v || [])[0] || ''; if (p.fam === 'netting' && netInfo(n.s)) { const gi = imgs.indexOf(FPS.NETIMG[netInfo(n.s)[2]]); if (gi > -1) st.img = gi; } render(); }
      if (e.target.id === 'pdO') { st.h = e.target.value; render(); }
      if (e.target.id === 'pdQ') { st.q = Math.max(1, +e.target.value | 0 || 1); render(); }
    });
    render(); FPS.onUnit(render);
  }

  /* ---------- industries ---------- */
  function industries() {
    const LONG = {
      'Powder coating': 'Mask threads, holes, studs and faces so they stay clean through spray and cure. Green PET tape and dots hold up to 400°F and peel off without residue.',
      'Plating & anodizing': 'Keep plating and anodizing chemicals off the areas that must stay bare, with tapes and caps that hold tight in the bath.',
      'Paint & auto refinish': 'Crisp paint lines on panels, trim and parts — paper masking that lifts off clean, plus high-temp paper for bake ovens.',
      'Electronics': 'Insulate, mask and protect boards, coils and cables with polyimide, glass cloth and copper foil tapes.',
      'Machining & packaging': 'Protect finished parts from nicks, scratches and tangles in storage and transit with expandable PE netting and spiral wrap.',
      'Window & door': 'Everything to build and repair window, door and pool-cage screens: spline in 40+ sizes, tools, clips and bug seals.'
    };
    $('#pg').innerHTML = `<section class="phd"><div class="w">${crumbs([['Industries']])}<div class="phd__g"><div><h1>Shop by industry</h1><p>We supply finishing shops, plating lines, paint shops, electronics makers, machine shops and screen contractors. Pick your process to see what fits.</p></div><div class="phd__v"><img src="${im('cut-glass-cloth')}" alt=""></div></div></div></section>
      <div class="jump"><div class="w">${INDS.map(i => `<a href="#${slug(i.n)}">${i.n}</a>`).join('')}</div></div>
      <section class="sec sec--top"><div class="w">${INDS.map((i, n) => { const recs = i.rec.flatMap(([t, id]) => t === 'tape' ? [PBY[id]] : PRODUCTS.filter(p => p.line === id).slice(0, 1)).filter(Boolean).slice(0, 4); return `<div class="ibk ${n % 2 ? "ibk--r" : ""}" id="${slug(i.n)}"><img src="${im(i.img)}" alt="${esc(i.n)}" loading="lazy"><div class="ibk__c"><p class="ey">Industry 0${n + 1}</p><h2>${i.n}</h2><p>${LONG[i.n] || i.d}</p><div class="ibk__r">${recs.map(p => `<a href="${purl(p.id)}"><span class="th">${visual(p)}</span><span><b>${p.n}</b><small>${p.soon ? 'Available on request' : 'from ' + money(pFrom(p))}</small></span>${icon('arrow')}</a>`).join('')}</div><button class="bt bt--dark" data-quote="${esc(i.n)} supplies">Get a quote for ${i.n.toLowerCase()}</button></div></div>`; }).join('')}
      ${bulkBox()}</div></section>`;
  }

  /* ---------- bulk quote page ---------- */
  function bulk() {
    const pre = params.get('p');
    const opts = PRODUCTS.map(p => `<option ${pre && PBY[pre] === p ? 'selected' : ''}>${p.n}</option>`).join('');
    const row = () => `<div class="bq__row"><label class="fl2"><span>Product</span><span class="sel"><select name="product">${opts}</select></span></label><label class="fl2"><span>Size (in or mm)</span><input name="size" placeholder="e.g. 1 inch or 25 mm"></label><label class="fl2"><span>Quantity</span><input name="qty" placeholder="e.g. 50 rolls"></label><button type="button" class="ib bq__x" aria-label="Remove line">${icon('x')}</button></div>`;
    $('#bqRows').innerHTML = row();
    $('#bqAdd').addEventListener('click', () => $('#bqRows').insertAdjacentHTML('beforeend', row()));
    $('#bqRows').addEventListener('click', e => { const x = e.target.closest('.bq__x'); if (x && $$('.bq__row').length > 1) x.parentElement.remove(); });
  }

  /* ---------- simple forms (bulk, contact) ---------- */
  $$('form.frm').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); let ok = true;
    $$('input[required]', f).forEach(i => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.classList.toggle('is-err', bad); if (bad) ok = false; });
    if (!ok) return toast('Please fill in the highlighted fields');
    f.hidden = true; const d = $('.frm__ok', f.parentElement); if (d) d.hidden = false; scrollTo({ top: f.parentElement.getBoundingClientRect().top + scrollY - 160, behavior: 'smooth' });
  }));

  /* ---------- cart page ---------- */
  function cartPage() {
    function render() {
      const c = FPS.cart;
      const sub = c.reduce((a, i) => a + BY[i.h].p * i.q, 0);
      $('#pg').innerHTML = `<section class="phd phd--s"><div class="w">${crumbs([['Cart']])}<h1>Your cart</h1></div></section><section class="sec sec--top"><div class="w">${c.length ? `<div class="cp"><div class="cp__l"><table class="tbl cp__t"><thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th></tr></thead><tbody>${c.map((i, x) => { const p = BY[i.h]; return `<tr><td><div class="cp__p"><img src="${im(imgFor(p))}" alt=""><span><b>${short(p)}</b><small>${[p.s && fmtSize(p.s), i.v, p.k && p.k !== 'Single roll' ? fmtLen(p.k) : 'Single roll'].filter(Boolean).join(' · ')}</small><button class="ci__rm" data-rm="${x}">Remove</button></span></div></td><td>${money(p.p)}</td><td><div class="qty"><button data-cq="-1" data-i="${x}" aria-label="Decrease">${icon('minus')}</button><span style="min-width:30px;text-align:center;font-weight:700">${i.q}</span><button data-cq="1" data-i="${x}" aria-label="Increase">${icon('plus')}</button></div></td><td><b>${money(p.p * i.q)}</b></td></tr>`; }).join('')}</tbody></table>${bulkBox()}</div>
        <aside class="cp__s"><h2>Order summary</h2><div class="cp__r"><span>Subtotal</span><b>${money(sub)}</b></div><div class="cp__r"><span>Shipping</span><span>Calculated at checkout</span></div><p class="cp__n">${icon('truck')}Free Regular Shipping (8–10 days) on eligible orders</p><button class="bt bt--dark bt--lg bt--block" id="checkout2">${icon('lock')}Secure checkout</button><a class="bt bt--line bt--block" href="${B}shop/">Continue shopping</a><ul class="pay"><li>VISA</li><li>Mastercard</li><li>AMEX</li><li>Discover</li><li>Apple Pay</li><li>G Pay</li><li>Shop Pay</li></ul></aside></div>`
        : `<div class="empty">${icon('cart')}<h2>Your cart is empty</h2><p>Start with our most popular masking tape.</p><div class="hero__cta" style="justify-content:center"><a class="bt bt--dark bt--lg" href="${B}masking-tapes/">Shop masking tapes</a><a class="bt bt--line bt--lg" href="${B}shop/">Shop all products</a></div></div>`}</div></section>`;
    }
    $('#pg').addEventListener('click', e => {
      const q = e.target.closest('[data-cq]'), rm = e.target.closest('#pg [data-rm]');
      if (!q && !rm) { if (e.target.closest('#checkout2')) toast('Prototype: this opens Shopify secure checkout'); return; }
      const c = FPS.cart.slice();
      if (q) { const i = c[+q.dataset.i]; i.q += +q.dataset.cq; if (i.q < 1) c.splice(+q.dataset.i, 1); }
      if (rm) c.splice(+rm.dataset.rm, 1);
      FPS.setCart(c); render();
    });
    render(); FPS.onUnit(render);
    new MutationObserver(() => { if (FPS.cart.length !== $$('.cp__t tbody tr').length) render(); }).observe($('#cartCount'), { childList: true });
  }

  if (page === 'collection') collection();
  if (page === 'shop') shop();
  if (page === 'product') product();
  if (page === 'industries') industries();
  if (page === 'bulk') bulk();
  if (page === 'cart') cartPage();
  if (page === 'account') {
    const t = $('#acTabs');
    t.addEventListener('click', e => { const b = e.target.closest('[data-ac]'); if (!b) return; $$('button', t).forEach(x => x.setAttribute('aria-selected', x === b)); $$('.ac__p').forEach(p => p.hidden = p.id !== b.dataset.ac); });
    if (location.hash === '#apply') t.querySelector('[data-ac="acApply"]').click();
  }
})();
