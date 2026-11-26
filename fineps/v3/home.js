/* FinePS — homepage sections */
(function () {
  'use strict';
  const FPS = window.FPS; const B = FPS.B;
  const { $, $$, esc, money, icon, im, fine, fmtSize, fmtLen, fmtYd, unitWord, CAT, BY, num, short, TAPE_F, singles, famAll, minP, imgFor, ILL, visual, MASK, MK, NET, netInfo, ftLen, tapeItems, dotsCount, LINES, LINE_ORDER, INDS, ut, toast, addToCart, openQuote, cardItems, slug, CATS, PBY, purl, pFrom } = FPS;
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
  $('#cats').innerHTML = `<a class="cat cat--main" href="${CATS.masking.page}"><span class="cat__t"><span class="top">#1 product line</span><b>Masking Tapes</b><small>Green PET, glass cloth, paper, polyimide &amp; more</small><span class="cat__go">Shop masking tapes ${icon('arrow')}</span></span><span class="cat__v"><img src="${im('cut-pet-stack')}" alt="Green polyester masking tape" loading="lazy"></span></a>` +
    LINE_ORDER.map(k => { const L = LINES[k]; return `<a class="cat" href="${CATS[k].page}"><span class="cat__t">${L.isNew ? '<span class="new">New</span>' : ''}<b>${L.n}</b><small>${L.d}</small><span class="cat__go">Shop ${L.short.toLowerCase()} ${icon('arrow')}</span></span><span class="cat__v">${L.img ? `<img src="${im(L.img)}" alt="${esc(L.n)}" loading="lazy">` : ILL[L.ill]}</span></a>`; }).join('');

  /* ================= Masking list + panel ================= */
  let tapeSel = 'pet';
  const tState = {};
  function renderTabs() {
    const tab = m => `<button class="mt" role="tab" aria-selected="${m.id === tapeSel}" data-tape="${m.id}"><span class="mt__th">${visual(m)}</span><span><b>${m.n.replace(' Tape', '')}</b>${m.soon && m.opts ? `<small>${m.opts}</small>` : ''}</span><em class="${m.soon ? 'q' : ''}">${m.soon ? 'Quote' : money(minP(tapeItems(m)))}</em></button>`;
    $('#mkList').innerHTML = `<p class="mk__lbl">In stock</p>` + MASK.filter(m => !m.soon).map(tab).join('') + `<p class="mk__lbl">Available on request</p>` + MASK.filter(m => m.soon).map(tab).join('');
  }
  function renderPanel() {
    const m = MK[tapeSel], P = $('#mkPanel');
    if (m.soon) {
      P.innerHTML = `<div class="mp"><div class="mp__media"><span class="req-b mp__tag">Available on request</span>${ILL[m.ill]}</div>
        <div class="mp__b"><h3>${m.n}</h3><p>We're adding ${m.n.toLowerCase()} to our range. Tell us the size and quantity you need and we'll send availability and pricing.</p>
        ${m.opts ? `<dl class="spec"><div><dt>Thickness options</dt><dd>${m.opts}</dd></div></dl>` : ''}
        <div class="req"><b>Request this tape</b><div class="fld"><span class="fld__l">Width you need ${ut()}</span><div class="req__f"><input id="reqW" placeholder="${FPS.UNIT === 'mm' ? 'e.g. 25 mm' : 'e.g. 1 inch'}" aria-label="Width you need"><button class="bt bt--dark" data-quote="${esc(m.n)}" data-vis="${m.ill}" data-note="Available on request" id="reqBtn">Request a quote</button></div></div></div></div></div>`;
      $('#reqW').addEventListener('input', e => { $('#reqBtn').dataset.size = e.target.value; });
      return;
    }
    const items = tapeItems(m);
    const st = tState[m.id] || (tState[m.id] = { h: (items.find(p => p.a && /^1"$/.test(p.s)) || items.find(p => p.a) || items[0]).h, q: 1 });
    const p = BY[st.h], size = fmtSize(p.s);
    P.innerHTML = `<div class="mp"><div class="mp__media">${m.badge ? `<span class="new mp__tag" style="background:var(--g);color:#fff">${m.badge}</span>` : ''}<img src="${im(m.id === 'pet' ? 'cut-pet-lineup' : m.img)}" alt="${esc(m.n)}"></div>
      <div class="mp__b"><h3>${m.n}</h3><p>${m.d} <a class="tl" href="${purl(m.id)}">Full details</a></p>
      <div class="tempx">${icon('thermo')}<span><b>Temperature range: ${m.temp}</b><small>${m.tnote}</small></span></div>
      <dl class="spec"><div><dt>Adhesive</dt><dd>${m.adh}</dd></div><div><dt>Roll length</dt><dd>${fmtYd(m.yd)}</dd></div><div><dt>Sold as</dt><dd>Single roll</dd></div></dl>
      ${m.thick ? `<div class="chips"><span>Thickness:</span><button class="ch" aria-pressed="true">2 mil</button><button class="ch" data-quote="${esc(m.n)} — 1 mil" data-vis="${m.img}" data-note="1 mil — available on request">1 mil <small>· request</small></button><button class="ch" data-quote="${esc(m.n)} — 5 mil" data-vis="${m.img}" data-note="5 mil — available on request">5 mil <small>· request</small></button></div>` : ''}
      <div class="buy">
        <div class="buy__row">
          <div class="fld"><span class="fld__l">Width · ${items.length} sizes ${ut()}</span><span class="sel"><select id="mkSize" aria-label="Width">${items.map(x => `<option value="${x.h}" ${x.h === st.h ? 'selected' : ''}>${fmtSize(x.s)} — ${money(x.p)}${x.a ? '' : ' (contact us)'}</option>`).join('')}</select></span></div>
          <div class="fld"><span class="fld__l">Rolls</span><div class="qty"><button type="button" data-st="-1" aria-label="Fewer rolls">${icon('minus')}</button><input id="mkQty" type="number" min="1" value="${st.q}" aria-label="Number of rolls"><button type="button" data-st="1" aria-label="More rolls">${icon('plus')}</button></div></div>
        </div>
        <div class="price"><b>${money(p.p)}</b><small>per roll</small>${p.a ? `<span class="stk"><i></i>In stock</span>` : `<span class="stk stk--o"><i></i>Out of stock</span>`}</div>
        ${p.a ? `<button class="bt bt--green bt--lg bt--block" data-add="${p.h}" data-qty="${st.q}">${icon('cart')}Add ${st.q > 1 ? st.q + ' rolls' : 'to cart'} · ${money(p.p * st.q)}</button>` : `<button class="bt bt--dark bt--lg bt--block" data-quote="${esc(m.n)}" data-size="${esc(size)}" data-vis="${m.img}" data-note="Out of stock — we'll confirm availability">${icon('chat')}Contact us for this size</button>`}
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
  function card(c, i) {
    const key = lineSel + i, items = cardItems(c);
    const st = lState[key] || (lState[key] = (() => { const p = items.find(x => x.a && (!c.def || x.s === c.def)) || items.find(x => x.a) || items[0]; return { s: p.s, k: p.k, v: (p.v || [])[0] || '' }; })());
    const sizes = [...new Set(items.map(p => p.s).filter(Boolean))].sort((a, b) => num(a) - num(b));
    const lens = [...new Set(items.filter(p => p.s === st.s).map(p => p.k).filter(Boolean))];
    if (st.k && !lens.includes(st.k)) st.k = lens[0];
    const p = items.find(x => (!st.s || x.s === st.s) && (!st.k || x.k === st.k)) || items[0];
    const extra = o => c.fam === 'dots' ? ' · ' + dotsCount(items.find(x => x.s === o)) : c.fam === 'netting' && netInfo(o) ? ' · ' + netInfo(o)[2] + ' · ' + ftLen(netInfo(o)[3]) : '';
    const sel = (k2, label, opts, cur, fmt, u) => opts.length > 1 ? `<div class="fld"><span class="fld__l">${label}${u ? ut() : ''}</span><span class="sel"><select data-k="${k2}" data-card="${key}" aria-label="${label}">${opts.map(o => `<option value="${esc(o)}" ${o === cur ? 'selected' : ''}>${fmt(o)}${k2 === 's' ? extra(o) : ''}</option>`).join('')}</select></span></div>` : '';
    const ni = c.fam === 'netting' && netInfo(p.s);
    return `<article class="pc"><div class="pc__m">${c.badge ? `<span class="bd">${c.badge}</span>` : ''}<img src="${im(imgFor(p))}" alt="${esc(c.t)}" loading="lazy"></div><div class="pc__b"><h3 class="pc__t">${c.t}</h3><p class="pc__s">${c.sub}</p>
      ${sel('s', c.lbl.s || 'Size', sizes, st.s, fmtSize, true)}${ni ? `<span class="pc__len">${icon('ruler')}${ftLen(ni[3])} roll · ${ni[2]} · ${ni[1]}</span>` : ''}${sel('k', c.lbl.k || 'Length', lens, st.k, fmtLen)}${c.lbl.v && p.v.length > 1 ? sel('v', 'Color', p.v, st.v, x => x) : ''}
      <div class="pc__f"><div class="pc__p">${money(p.p)}<small>${ni ? 'per ' + ftLen(ni[3]) + ' roll' : p.k && p.k !== 'Single roll' ? fmtLen(p.k) : c.fam === 'dots' ? 'per roll' : 'each'}</small></div>${p.a ? `<button class="add" data-add="${p.h}" data-variant="${esc(c.lbl.v ? st.v : '')}">${icon('plus')}Add</button>` : `<button class="add add--q" data-quote="${esc(c.t)}" data-size="${esc(fmtSize(p.s))}" data-vis="${imgFor(p)}" data-note="Out of stock — we'll confirm availability">Contact us</button>`}</div></div></article>`;
  }
  const reqCard = (n, ill, L) => `<article class="pc pc--req"><div class="pc__m"><span class="req-b">On request</span>${ILL[ill]}</div><div class="pc__b"><h3 class="pc__t">${n}</h3><p class="pc__s">${L.n} · sizes in inches or mm</p><div class="pc__f"><div class="pc__p">Quote<small>Tell us size &amp; quantity</small></div><button class="add add--q" data-quote="${esc(n)}" data-vis="${ill}" data-note="${esc(L.n)} · available on request">Request</button></div></div></article>`;
  function renderMore() {
    const L = LINES[lineSel];
    $('#moreTabs').innerHTML = LINE_ORDER.map(k => `<button role="tab" aria-selected="${k === lineSel}" data-line="${k}">${LINES[k].n}${LINES[k].isNew ? ' <span class="new">New</span>' : ''}</button>`).join('');
    const stocked = (L.cards || []).slice(0, 2);
    const req = (L.range || []).slice(0, 2 - stocked.length);
    const rest = [...(L.range || []).slice(req.length).map(r => r[0]), ...(L.also || [])];
    const html = stocked.map(card).join('') + req.map(([n, ill]) => reqCard(n, ill, L)).join('');
    const all = `<div class="allc"><b>More ${L.short.toLowerCase()}</b><p>${L.d}. ${L.cards ? 'In-stock sizes ship now — anything else we quote quickly.' : "Tell us what you need and we'll send pricing."}</p>${rest.length ? `<ul>${rest.map(n => `<li>${n}</li>`).join('')}</ul>` : ''}<button class="bt bt--dark" data-quote="${esc(L.n)}">Ask about ${L.short.toLowerCase()}</button></div>`;
    $('#moreBody').innerHTML = html + all;
    $('#moreBody').classList.remove('one');
  }
  function selLine(k) { lineSel = k; renderMore(); }
  $('#moreBody').addEventListener('change', e => { const s = e.target.closest('select[data-card]'); if (!s) return; lState[s.dataset.card][s.dataset.k] = s.value; renderMore(); });

  /* ================= Industries ================= */
  $('#ind').innerHTML = INDS.map(i => `<article class="in"><img src="${im(i.img)}" alt="${esc(i.n)}" loading="lazy"><div class="in__b"><b>${i.n}</b><p>${i.d}</p><div class="in__r">${i.rec.map(([t, id]) => t === 'tape' ? `<a href="${purl(id)}">${MK[id].n.replace(' Tape', '')}</a>` : `<a href="${CATS[id].page}">${LINES[id].n}</a>`).join('')}</div></div></article>`).join('');

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

  /* ================= Init ================= */
  FPS.onTape = id => selTape(id);
  FPS.onLine = (k, e) => { if (e && e.target.closest('#moreTabs')) selLine(k); };
  FPS.onUnit(() => { renderQb(); renderPanel(); renderMore(); });
  renderTabs(); renderQb(); renderPanel(); renderMore();
})();
