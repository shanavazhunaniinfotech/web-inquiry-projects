/* Brutally Dad® — homepage concept (V3) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const money = v => '$' + v.toFixed(2);
  const PRICE = 9.95;

  /* ---------------- PRODUCTS ---------------- */
  const P = [
    { id: 'oil', t: 'You pay someone else to change your oil.', prop: 'car', cat: 'everyday', tags: ['car'], inside: 'Happy Birthday. We’ll pay for this one too.', r: 412, badge: 'Bestseller' },
    { id: 'fluid', t: 'You use lighter fluid to start a bonfire.', prop: 'fire', cat: 'everyday', tags: ['fire'], inside: 'Stay 20 feet from the fire pit this year. Love you.', r: 288 },
    { id: 'ketchup', t: 'You eat your steak with ketchup.', prop: 'steak', cat: 'fathers', tags: ['food', 'grill'], inside: 'We still love you. The steak doesn’t.', r: 356, badge: 'Bestseller' },
    { id: 'mow', t: 'Your mow lines are trash.', prop: 'mow', cat: 'fathers', tags: ['lawn'], inside: 'Happy Father’s Day. Hire a professional.', r: 301 },
    { id: 'thermo', t: 'You guard the thermostat like it’s Fort Knox.', prop: 'thermo', cat: 'christmas', tags: ['thermo'], inside: 'Merry Christmas. We turned it up to 70°.', r: 174, badge: 'New' },
    { id: 'grill', t: 'You call it “seasoning.” We call it 15 years of grease.', prop: 'grill', cat: 'fathers', tags: ['grill'], inside: 'Happy Father’s Day, Grill Master (self-appointed).', r: 219 },
    { id: 'noise', t: 'You now make a noise every time you sit down.', prop: 'chair', cat: 'birthday', tags: ['nap'], inside: 'Happy Birthday, old man. Mind your back.', r: 397, badge: 'Bestseller' },
    { id: 'story', t: 'You’ve told that story 47 times. Still not funny.', prop: 'bubble', cat: 'birthday', tags: ['story'], inside: 'Happy Birthday. Tell it once more. We’ll pretend.', r: 163 },
    { id: 'lost', t: 'You’d rather be lost for 3 hours than ask for directions.', prop: 'map', cat: 'fathers', tags: ['lost', 'car'], inside: 'Happy Father’s Day. Here’s a map. Use it.', r: 142 },
    { id: 'okayest', t: 'Congrats on being the World’s Okayest Dad.', prop: 'trophy', cat: 'fathers', tags: ['story', 'nap'], inside: 'Honestly? Could’ve been worse. Love you.', r: 451, badge: 'Fan fave' },
    { id: 'nap', t: 'You’re not sleeping. You’re “resting your eyes.”', prop: 'chair', cat: 'birthday', tags: ['nap', 'thermo'], inside: 'Happy Birthday. Enjoy your 4pm “rest.”', r: 208 },
    { id: 'wrap', t: 'Your gift wrapping looks like a crime scene.', prop: 'gift', cat: 'christmas', tags: ['story'], inside: 'Merry Christmas. We bought tape.', r: 96, badge: 'New' }
  ];
  const CAT = { birthday: 'Birthday', fathers: 'Father’s Day', everyday: 'Everyday Roast', christmas: 'Christmas' };
  const byId = id => P.find(p => p.id === id);

  const cardHTML = p => `<p class="card__t">${p.t}</p><svg class="card__art" viewBox="0 0 300 210" aria-hidden="true"><use href="#dad" x="6" y="6" width="120" height="200"/><use href="#p-${p.prop}" x="124" y="86" width="168" height="124"/></svg>`;
  const paint = el => { const p = el.dataset.id === 'custom' ? { t: el.dataset.t || 'My dad… mows the lawn in socks and sandals.', prop: 'bubble' } : byId(el.dataset.id); if (p) { el.innerHTML = cardHTML(p); el.setAttribute('role', 'img'); el.setAttribute('aria-label', 'Card: ' + p.t); } };

  /* ---------------- GRID ---------------- */
  const grid = $('#grid');
  function renderGrid(f = 'all') {
    const list = P.filter(p => f === 'all' || p.cat === f).slice(0, 8);
    grid.innerHTML = list.map((p, i) => `
      <article class="pc rv" style="transition-delay:${(i % 4) * 60}ms">
        <div class="pc__stage" data-qv="${p.id}" tabindex="0" role="button" aria-label="Preview: ${p.t}">
          <span class="pc__env"></span>
          <div class="pc__card"><div class="card" data-id="${p.id}"></div></div>
          ${p.badge ? `<span class="badge ${p.badge === 'Bestseller' ? 'badge--black' : ''}">${p.badge}</span>` : ''}
          <span class="pc__peek">Peek inside</span>
        </div>
        <span class="price">${money(PRICE)}</span>
        <p class="pc__meta"><b>${CAT[p.cat]}</b>★★★★★ (${p.r})</p>
        <button class="btn btn--black btn--sm pc__add" data-add="${p.id}">Add to cart</button>
      </article>`).join('');
    $$('.card', grid).forEach(paint);
    observe($$('.rv', grid));
  }
  const setFilter = f => {
    $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.f === f));
    renderGrid(f);
  };
  $('#tabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setFilter(b.dataset.f); });
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-filter]'); if (!a) return;
    setFilter(a.dataset.filter);
    document.body.classList.remove('menu-open');
  });

  /* reveal */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' }) : null;
  function observe(els) { els.forEach(el => io ? io.observe(el) : el.classList.add('in')); }
  renderGrid();
  $$('.card[data-id]').forEach(paint);
  $$('.title, .finder__in, .ot, .inside__copy, .inside__stage, .pack__copy, .rev, .submit__in, .about__in, .news__in').forEach(el => el.classList.add('rv'));
  observe($$('.rv'));

  /* marquee */
  const mq = P.map(p => `<span>${p.t}</span>`).join('');
  $('#marquee').innerHTML = mq + mq;

  /* reviews */
  const REV = [
    ['He read it, said “that’s not true,” then put it on the fridge. It’s been there 4 months.', 'Megan R.', 'Your mow lines are trash.', 'Kept it'],
    ['My dad laughed so hard he had to sit down. Then he made the noise. Proved the card right.', 'Tyler B.', 'You now make a noise…', 'Cried laughing'],
    ['Finally a card that sounds like my family. Bought 5 so I’m set until 2027.', 'Chris D.', 'Roast Pack ×5', 'Asked for more'],
    ['Gave it to my husband from the kids. He’s denying the ketchup thing. He’s lying.', 'Alana P.', 'You eat your steak with ketchup.', 'In denial'],
    ['Fast shipping, thick card, kraft envelope. And brutal. 10/10, would roast again.', 'Jordan K.', 'You use lighter fluid…', 'Laughed, then lit a fire'],
    ['My father-in-law has told the same fishing story since 1998. This card was therapy.', 'Sam W.', 'You’ve told that story 47 times.', 'Still telling it']
  ];
  $('#revGrid').innerHTML = REV.map(([q, n, prod, react]) => `
    <figure class="rev"><span>★★★★★</span><q>${q}</q>
      <div class="rev__dad"><span>Dad’s reaction:</span><b>${react}</b></div>
      <footer><b>${n} ✓</b><span>${prod}</span></footer></figure>`).join('');
  observe($$('.rev'));

  /* ---------------- HEADER / NAV ---------------- */
  const ann = $$('#barTrack p'); let ai = 0;
  setInterval(() => { ann[ai].classList.remove('on'); ai = (ai + 1) % ann.length; ann[ai].classList.add('on'); }, 3800);
  $('#burger').addEventListener('click', () => { const o = document.body.classList.toggle('menu-open'); $('#burger').setAttribute('aria-expanded', o); });
  $$('#mnav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
  const mbar = $('#mbar');
  addEventListener('scroll', () => mbar.classList.toggle('on', scrollY > 600), { passive: true });

  /* hero bubble */
  const lines = ['You call it “resting your eyes.”', 'Best Dad Ever? Let’s not get carried away.', 'Nobody touches the thermostat.', 'Ask for directions? Never.', 'Ketchup on steak. Unforgivable.'];
  let bi = 0; const bub = $('#heroBubble');
  setInterval(() => { bub.classList.add('swap'); setTimeout(() => { bi = (bi + 1) % lines.length; $('span', bub).textContent = lines[bi]; bub.classList.remove('swap'); }, 300); }, 3200);

  /* search */
  const search = $('#search'), sIn = $('#searchIn'), sRes = $('#searchRes');
  $('#searchBtn').addEventListener('click', () => { search.hidden = !search.hidden; if (!search.hidden) sIn.focus(); });
  sIn.addEventListener('input', () => {
    const q = sIn.value.trim().toLowerCase(); if (!q) { sRes.innerHTML = ''; return; }
    const hits = P.filter(p => (p.t + ' ' + p.prop + ' ' + p.tags.join(' ') + ' ' + CAT[p.cat]).toLowerCase().includes(q));
    sRes.innerHTML = hits.length ? hits.map(p => `<a class="sr" href="#shop" data-qv="${p.id}"><div class="card" data-id="${p.id}"></div><span>${p.t}</span></a>`).join('') : `<p class="kalam">No roast for “${q}” yet. <a class="link" href="#submit">Submit one →</a></p>`;
    $$('.card', sRes).forEach(paint);
  });

  /* ---------------- FINDER ---------------- */
  const chosen = new Set();
  let finderIds = [];
  $('#crimes').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    b.classList.toggle('on'); chosen.has(b.dataset.t) ? chosen.delete(b.dataset.t) : chosen.add(b.dataset.t);
    const score = p => p.tags.filter(t => chosen.has(t)).length;
    finderIds = chosen.size ? P.filter(p => score(p) > 0).sort((a, b) => score(b) - score(a) || b.r - a.r).slice(0, 3).map(p => p.id) : [];
    if (chosen.size && finderIds.length < 3) P.filter(p => !finderIds.includes(p.id)).sort((a, b) => b.r - a.r).slice(0, 3 - finderIds.length).forEach(p => finderIds.push(p.id));
    const box = $('#finderCards');
    box.innerHTML = finderIds.length ? finderIds.map(id => `<div class="fc" data-qv="${id}"><div class="card" data-id="${id}"></div></div>`).join('') : `<p class="finder__empty"><svg viewBox="0 0 300 380"><use href="#dad-shrug"/></svg>Pick at least one crime.<br>He knows what he did.</p>`;
    $$('.card', box).forEach(paint);
    $('#finderBuy').hidden = !finderIds.length;
    $('#finderN').textContent = finderIds.length + ' cards';
    $('#finderPrice').innerHTML = `for $24.00 <s>$29.85</s>`;
  });
  $('#finderAdd').addEventListener('click', () => { finderIds.forEach(id => addToCart(id, 1, false)); openCart(); toast('His roast pack is in the cart. 3 for $24 applied.'); });

  /* ---------------- LIVE SUBMIT CARD ---------------- */
  const crime = $('#crime'), live = $('#liveCard');
  const updLive = () => { live.dataset.t = 'My dad… ' + (crime.value.trim() || 'mows the lawn in socks and sandals.'); paint(live); };
  crime.addEventListener('input', updLive); updLive();
  $('#submitForm').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); updLive(); toast('Roast received. If we print it, 5 free cards are yours.'); });
  $('#newsForm').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('Code ROASTED10 is on its way. Be gentle.'); });

  /* ---------------- QUICK VIEW ---------------- */
  const qv = $('#qv'); let qvItem = null, qvQty = 1, qvInside = 'blank';
  const openQV = id => {
    const p = byId(id); if (!p) return; qvItem = p; qvQty = 1; qvInside = 'blank';
    $('#qvFront').dataset.id = id; paint($('#qvFront'));
    $('#qvTitle').textContent = p.t; $('#qvCat').textContent = CAT[p.cat]; $('#qvRev').textContent = `(${p.r} reviews)`;
    $('#qvInside').textContent = 'Blank inside, for your own words (or insults).';
    $('#qvQty').textContent = 1; $('#qvFlip').classList.remove('flipped');
    $$('#qv .qv__toggle button').forEach((b, i) => b.classList.toggle('on', i === 0));
    $$('#qvSeg button').forEach((b, i) => b.classList.toggle('on', i === 0));
    qv.hidden = false; document.body.style.overflow = 'hidden';
  };
  const closeQV = () => { qv.hidden = true; document.body.style.overflow = ''; };
  document.addEventListener('click', e => {
    if (e.target.closest('[data-add]')) return;
    const t = e.target.closest('[data-qv]'); if (!t) return;
    e.preventDefault(); search.hidden = true; openQV(t.dataset.qv);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('[data-qv]')) openQV(e.target.dataset.qv);
    if (e.key === 'Escape') { closeQV(); closeCart(); search.hidden = true; }
  });
  $('#qvX').addEventListener('click', closeQV);
  qv.addEventListener('click', e => { if (e.target === qv) closeQV(); });
  $('.qv__toggle').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('.qv__toggle button').forEach(x => x.classList.toggle('on', x === b));
    $('#qvFlip').classList.toggle('flipped', b.dataset.side === 'inside');
  });
  $('#qvSeg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#qvSeg button').forEach(x => x.classList.toggle('on', x === b)); qvInside = b.dataset.in;
    $('#qvInside').textContent = qvInside === 'punch' ? qvItem.inside : 'Blank inside, for your own words (or insults).';
    $('#qvFlip').classList.add('flipped'); $$('.qv__toggle button').forEach((x, i) => x.classList.toggle('on', i === 1));
  });
  $('#qvMinus').addEventListener('click', () => { qvQty = Math.max(1, qvQty - 1); $('#qvQty').textContent = qvQty; });
  $('#qvPlus').addEventListener('click', () => { qvQty++; $('#qvQty').textContent = qvQty; });
  $('#qvAdd').addEventListener('click', () => { addToCart(qvItem.id, qvQty, true, qvInside === 'punch'); closeQV(); });

  /* ---------------- CART (auto Roast Pack pricing) ---------------- */
  const cart = [];
  const openCart = () => { document.body.classList.add('cart-open'); $('#cart').setAttribute('aria-hidden', 'false'); };
  function closeCart() { document.body.classList.remove('cart-open'); $('#cart').setAttribute('aria-hidden', 'true'); }
  $('#cartBtn').addEventListener('click', openCart); $('#cartX').addEventListener('click', closeCart); $('#scrim').addEventListener('click', closeCart);
  function addToCart(id, q = 1, open = true, punch = false) {
    const key = id + (punch ? '-p' : '');
    const ex = cart.find(i => i.key === key);
    ex ? ex.q += q : cart.push({ key, id, q, punch });
    renderCart(); if (open) openCart();
    const c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  }
  const packPrice = n => { let t = 0; t += Math.floor(n / 5) * 35; n %= 5; t += Math.floor(n / 3) * 24; n %= 3; return t + n * PRICE; };
  function renderCart() {
    const n = cart.reduce((s, i) => s + i.q, 0), sub = n * PRICE, tot = packPrice(n), save = sub - tot;
    $('#cartCount').textContent = n; $('#cartN').textContent = `(${n})`;
    $('#cartSub').textContent = money(sub); $('#cartTot').textContent = money(tot);
    $('#saveRow').hidden = save < .01; $('#cartSave').textContent = '−' + money(save);
    const msg = n === 0 ? 'Add 3 cards: <b>3 for $24</b> + free shipping'
      : n < 3 ? `Add <b>${3 - n} more</b> to unlock 3 for $24 + free shipping`
      : n < 5 ? `✓ Roast Pack unlocked. Add <b>${5 - n} more</b> for 5 for $35`
      : '✓ Max savings. Dad is thoroughly roasted.';
    $('#dealMsg').innerHTML = msg; $('#dealBar').style.width = Math.min(100, n / 5 * 100) + '%';
    $('#cartItems').innerHTML = cart.length ? cart.map(i => { const p = byId(i.id); return `
      <li><div class="card" data-id="${i.id}"></div><div><strong>${p.t}</strong><small>${i.punch ? 'Printed punchline' : 'Blank inside'} · ${money(PRICE)}</small>
        <div class="qty"><button data-q="-1" data-k="${i.key}" aria-label="Less">−</button><span>${i.q}</span><button data-q="1" data-k="${i.key}" aria-label="More">+</button></div></div><b>${money(PRICE * i.q)}</b></li>`; }).join('')
      : `<li class="empty"><svg viewBox="0 0 300 380"><use href="#dad-shrug"/></svg>Your cart is empty.<br>Dad’s getting off easy.</li>`;
    $$('#cartItems .card').forEach(paint);
  }
  $('#cartItems').addEventListener('click', e => {
    const b = e.target.closest('[data-q]'); if (!b) return;
    const it = cart.find(i => i.key === b.dataset.k); it.q += +b.dataset.q; if (it.q <= 0) cart.splice(cart.indexOf(it), 1); renderCart();
  });
  document.addEventListener('click', e => { const b = e.target.closest('[data-add]'); if (b) { e.stopPropagation(); addToCart(b.dataset.add); } });
  renderCart();

  /* ---------------- NOTES ---------------- */
  const nb = $('#notesBtn');
  const setNotes = on => {
    nb.setAttribute('aria-pressed', on); nb.textContent = on ? 'Hide notes' : 'Why this layout?';
    $$('.cro-note').forEach(n => n.remove());
    if (on) $$('[data-note]').forEach(s => { const d = document.createElement('div'); d.className = 'cro-note'; d.innerHTML = `<div><b>Design / CRO note</b>${s.dataset.note}</div>`; s.before(d); });
  };
  nb.addEventListener('click', () => setNotes(nb.getAttribute('aria-pressed') !== 'true'));
  if (/notes=1/.test(location.search)) setNotes(true);

  let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2800); }
})();
