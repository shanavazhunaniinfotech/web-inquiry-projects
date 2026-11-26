/* Multi-vendor marketplace concept: all demo state lives in memory */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = n => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- product art (inline SVG, no external images) ---------- */
  let gid = 0;
  const SHAPES = {
    bottle: c => `<rect x="86" y="40" width="28" height="22" rx="4" fill="#2a2420"/><rect x="92" y="60" width="16" height="12" fill="${c}"/><rect x="62" y="70" width="76" height="92" rx="20" fill="${c}"/><rect x="74" y="98" width="52" height="30" rx="4" fill="rgba(255,255,255,.55)"/>`,
    bag: c => `<path d="M72 78a28 28 0 0 1 56 0" stroke="#2a2420" stroke-width="7" fill="none"/><path d="M52 78h96l-10 84H62z" fill="${c}"/><path d="M52 78h96l-2 14H54z" fill="rgba(0,0,0,.12)"/>`,
    mug: c => `<path d="M132 92h10a18 18 0 0 1 0 36h-10" stroke="${c}" stroke-width="10" fill="none"/><rect x="58" y="74" width="80" height="88" rx="12" fill="${c}"/><rect x="58" y="74" width="80" height="12" rx="6" fill="rgba(0,0,0,.12)"/>`,
    candle: c => `<path d="M100 44c8 10 8 20 0 26-8-6-8-16 0-26z" fill="#F7A531"/><rect x="98" y="66" width="4" height="12" fill="#2a2420"/><rect x="62" y="78" width="76" height="84" rx="14" fill="${c}"/><rect x="62" y="104" width="76" height="30" fill="rgba(255,255,255,.5)"/>`,
    shoe: c => `<path d="M40 140c0-20 6-46 26-50 12 18 32 20 44 14l46 22c12 6 14 22 4 26H48c-6 0-8-6-8-12z" fill="${c}"/><path d="M40 150h120v8H44z" fill="#fff"/><path d="M76 104l8 10M88 102l8 10M100 100l8 10" stroke="#fff" stroke-width="3"/>`,
    headphones: c => `<path d="M56 120V100a44 44 0 0 1 88 0v20" stroke="#2a2420" stroke-width="9" fill="none"/><rect x="44" y="110" width="30" height="50" rx="12" fill="${c}"/><rect x="126" y="110" width="30" height="50" rx="12" fill="${c}"/>`,
    plant: c => `<path d="M100 110C80 90 64 70 70 50c18 6 30 26 30 60zM100 110c18-24 38-34 54-30-4 20-26 32-54 30zM100 110c-14-12-34-14-48-6 10 14 30 16 48 6z" fill="#2E7D5B"/><path d="M68 112h64l-8 50H76z" fill="${c}"/>`,
    watch: c => `<rect x="84" y="34" width="32" height="132" rx="10" fill="#2a2420"/><circle cx="100" cy="100" r="38" fill="${c}"/><circle cx="100" cy="100" r="29" fill="#fff"/><path d="M100 82v18l12 8" stroke="#2a2420" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    lamp: c => `<path d="M70 50h60l18 50H52z" fill="${c}"/><rect x="97" y="100" width="6" height="52" fill="#2a2420"/><ellipse cx="100" cy="156" rx="30" ry="8" fill="#2a2420"/>`,
    bowl: c => `<path d="M44 96h112c0 34-26 60-56 60s-56-26-56-60z" fill="${c}"/><ellipse cx="100" cy="96" rx="56" ry="12" fill="rgba(0,0,0,.18)"/><path d="M60 118c16 10 64 10 80 0" stroke="rgba(255,255,255,.5)" stroke-width="4" fill="none"/>`,
    speaker: c => `<rect x="60" y="44" width="80" height="118" rx="18" fill="${c}"/><circle cx="100" cy="122" r="24" fill="rgba(0,0,0,.25)"/><circle cx="100" cy="122" r="10" fill="rgba(255,255,255,.4)"/><circle cx="100" cy="72" r="10" fill="rgba(0,0,0,.25)"/>`,
    vase: c => `<path d="M84 44h32v14c0 10 22 22 22 54 0 30-18 50-38 50s-38-20-38-50c0-32 22-44 22-54z" fill="${c}"/><path d="M70 110c20 8 40 8 60 0" stroke="rgba(255,255,255,.45)" stroke-width="5" fill="none"/>`
  };
  function art(type, bg, c) {
    const id = 'g' + (++gid);
    return `<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><radialGradient id="${id}" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="${bg}"/></radialGradient></defs><rect width="200" height="200" fill="${bg}"/><rect width="200" height="200" fill="url(#${id})"/><ellipse cx="100" cy="166" rx="56" ry="8" fill="rgba(0,0,0,.12)"/>${(SHAPES[type] || SHAPES.bowl)(c)}</svg>`;
  }

  /* ---------- data ---------- */
  const vendors = [
    { id: 'oud', name: 'Oud & Amber House', short: 'OA', cat: 'Fragrance', color: '#7A4B2A', bg: '#F1E4D6', bio: 'Small-batch oud, attars and home scents, blended by hand.', rating: 4.9, sales: 1240, followers: 3800, since: 2021, status: 'live' },
    { id: 'loom', name: 'Loom Studio', short: 'LS', cat: 'Home', color: '#1F6F5C', bg: '#DCEDE6', bio: 'Calm, natural pieces for the home: lighting, textiles and plants.', rating: 4.8, sales: 860, followers: 2100, since: 2022, status: 'live' },
    { id: 'kiln', name: 'Kiln & Co.', short: 'KC', cat: 'Ceramics', color: '#C2562F', bg: '#F8E1D6', bio: 'Hand-thrown stoneware made in a two-person studio.', rating: 4.9, sales: 640, followers: 1650, since: 2023, status: 'live' },
    { id: 'volt', name: 'Volt Gear', short: 'VG', cat: 'Tech', color: '#2D3A8C', bg: '#E0E4F7', bio: 'Everyday tech accessories, tested and well made.', rating: 4.7, sales: 2100, followers: 5200, since: 2020, status: 'live' }
  ];
  const applications = [
    { id: 'stride', name: 'Stride Lab', short: 'SL', cat: 'Footwear', color: '#111317', bg: '#E6E6E6', bio: 'Minimal sneakers made in small batches.', rating: 0, sales: 0, followers: 0, since: 2026, status: 'pending', phone: '+966 5• ••• 4471', applied: '2 hours ago' },
    { id: 'petal', name: 'Petal & Stem', short: 'PS', cat: 'Home', color: '#B4457A', bg: '#F7DDE9', bio: 'Preserved flowers and gift sets.', rating: 0, sales: 0, followers: 0, since: 2026, status: 'pending', phone: '+971 5• ••• 2208', applied: 'Yesterday' }
  ];
  let pid = 0;
  const P = (v, name, price, type, rating, stock, status = 'live') => ({ id: 'p' + (++pid), v, name, price, type, rating, stock, status });
  const products = [
    P('oud', 'Royal Oud Eau de Parfum 100ml', 128, 'bottle', 4.9, 24),
    P('oud', 'Amber Musk Scented Candle', 38, 'candle', 4.8, 60),
    P('oud', 'Rose Attar Travel Oil', 46, 'bottle', 4.7, 35),
    P('loom', 'Linen Shade Table Lamp', 89, 'lamp', 4.8, 14),
    P('loom', 'Olive Tree in Terracotta Pot', 64, 'plant', 4.6, 9),
    P('loom', 'Woven Market Tote', 52, 'bag', 4.9, 40),
    P('kiln', 'Speckled Stoneware Mug', 28, 'mug', 4.9, 80),
    P('kiln', 'Glazed Serving Bowl', 56, 'bowl', 4.8, 22),
    P('kiln', 'Tall Ribbed Vase', 72, 'vase', 4.7, 11),
    P('volt', 'Studio ANC Headphones', 149, 'headphones', 4.7, 30),
    P('volt', 'Pocket Bluetooth Speaker', 59, 'speaker', 4.6, 55),
    P('volt', 'Minimal Leather Watch', 119, 'watch', 4.8, 18),
    P('loom', 'Hand-dyed Ceramic Mug Set', 42, 'mug', 4.5, 6, 'pending')
  ];
  const vById = id => vendors.concat(applications).find(v => v.id === id);
  const pById = id => products.find(p => p.id === id);
  const liveProducts = () => products.filter(p => p.status === 'live' && vById(p.v).status === 'live');

  const S = {
    view: 'market', vendor: 'oud', vtab: 'products', cat: 'All', q: '',
    cart: [], gift: false, loggedIn: false, me: 'loom', dtab: 'overview', commission: 12,
    following: new Set(),
    orders: [
      { id: '#1042', cust: 'Sara A.', items: [['p4', 1]], status: 'New', when: '12 min ago' },
      { id: '#1039', cust: 'Omar K.', items: [['p6', 2]], status: 'Packed', when: '2 h ago' },
      { id: '#1035', cust: 'Lina M.', items: [['p5', 1], ['p6', 1]], status: 'Shipped', when: 'Yesterday' },
      { id: '#1028', cust: 'Faisal R.', items: [['p4', 1]], status: 'Delivered', when: '3 days ago' },
      { id: '#1021', cust: 'Huda S.', items: [['p6', 1]], status: 'Delivered', when: '5 days ago' }
    ],
    feed: []
  };
  const FREE_SHIP = 150, SHIP_FEE = 9.5, GIFT = 6;

  /* ---------- toast ---------- */
  let tt;
  function toast(msg) {
    $('#toastText').textContent = msg;
    $('#toast').classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => $('#toast').classList.remove('show'), 3200);
  }
  function log(text, color = '#3ecf6e') { S.feed.unshift({ text, color, when: 'just now' }); }

  /* ---------- views ---------- */
  const URLS = {
    market: () => 'yourmarket.com',
    vendor: () => 'yourmarket.com/vendors/' + vById(S.vendor).name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/-$/, ''),
    otp: () => 'vendors.yourmarket.com/login',
    dash: () => 'vendors.yourmarket.com/' + (S.dtab === 'overview' ? 'dashboard' : S.dtab),
    admin: () => 'admin.shopify.com/store/yourmarket/apps/marketplace'
  };
  function go(view, opts = {}) {
    S.view = view;
    if (opts.vendor) S.vendor = opts.vendor;
    $$('.ptab').forEach(t => t.classList.toggle('on', t.dataset.go === view));
    $$('.pv').forEach(p => p.classList.toggle('on', p.dataset.view === view));
    const on = $(`.ptab[data-go="${view}"]`);
    if (on) { const bar = on.parentElement; bar.scrollTo({ left: on.offsetLeft - (bar.clientWidth - on.offsetWidth) / 2, behavior: 'smooth' }); }
    render();
    $('#fbody').scrollTop = 0;
  }
  function render() {
    $('#furl').textContent = URLS[S.view]();
    if (S.view === 'market') renderMarket();
    if (S.view === 'vendor') renderVendor();
    if (S.view === 'dash') renderDash();
    if (S.view === 'admin') renderAdmin();
    renderCount();
  }

  const plus = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  function pcard(p) {
    const v = vById(p.v);
    return `<article class="pcard"><div class="pimg">${art(p.type, v.bg, v.color)}${p.stock < 10 ? `<span class="ptag">Only ${p.stock} left</span>` : ''}</div>
      <div class="pinfo"><span class="pvend" data-vendor="${v.id}"><i style="background:${v.color}"></i>${esc(v.name)}</span>
      <span class="pname">${esc(p.name)}</span>
      <div class="prow"><div><div class="price">${money(p.price)}</div><div class="rate">★ ${p.rating.toFixed(1)}</div></div>
      <button class="add" data-add="${p.id}" aria-label="Add ${esc(p.name)} to cart">${plus}</button></div></div></article>`;
  }
  function vcard(v) {
    const n = liveProducts().filter(p => p.v === v.id).length;
    return `<button class="vcard" data-vendor="${v.id}"><span class="vav" style="background:${v.color}">${v.short}</span><span><b>${esc(v.name)}</b><span>${v.cat} · ${n} products · ★ ${v.rating ? v.rating.toFixed(1) : 'New'}</span></span></button>`;
  }

  function renderMarket() {
    const live = vendors.filter(v => v.status === 'live');
    $('#vendRow').innerHTML = live.slice(0, 4).map(vcard).join('');
    $('#b2Avatars').innerHTML = live.slice(0, 4).map(v => `<i style="background:${v.color}">${v.short}</i>`).join('');
    const cats = ['All', ...new Set(live.map(v => v.cat))];
    if (!cats.includes(S.cat)) S.cat = 'All';
    $('#catChips').innerHTML = cats.map(c => `<button class="chip ${c === S.cat ? 'on' : ''}" data-cat="${c}">${c}</button>`).join('');
    const q = S.q.trim().toLowerCase();
    const list = liveProducts().filter(p => (S.cat === 'All' || vById(p.v).cat === S.cat) && (!q || p.name.toLowerCase().includes(q) || vById(p.v).name.toLowerCase().includes(q)));
    $('#pCount').textContent = `${list.length} products from ${new Set(list.map(p => p.v)).size} vendors`;
    $('#pGrid').innerHTML = list.length ? list.map(pcard).join('') : '<div class="empty">No products match. Try another search.</div>';
  }

  function renderVendor() {
    const v = vById(S.vendor);
    $('#vsSwitch').innerHTML = 'Preview storefront: ' + vendors.filter(x => x.status === 'live').map(x => `<button class="chip ${x.id === v.id ? 'on' : ''}" data-vendor="${x.id}">${esc(x.name)}</button>`).join('');
    $('#vsCover').innerHTML = `<svg viewBox="0 0 1200 220" preserveAspectRatio="xMidYMid slice"><rect width="1200" height="220" fill="${v.color}"/><circle cx="1050" cy="40" r="200" fill="rgba(255,255,255,.08)"/><circle cx="900" cy="260" r="160" fill="rgba(255,255,255,.06)"/><circle cx="150" cy="-40" r="140" fill="rgba(0,0,0,.08)"/><path d="M0 170 Q300 120 600 170 T1200 160 V220 H0z" fill="rgba(0,0,0,.12)"/></svg>`;
    $('#vsLogo').style.background = v.color;
    $('#vsLogo').textContent = v.short;
    $('#vsName').textContent = v.name;
    $('#vsBio').textContent = v.bio;
    const n = liveProducts().filter(p => p.v === v.id).length;
    $('#vsStats').innerHTML = `<span><b>★ ${v.rating.toFixed(1)}</b> rating</span><span><b>${(v.followers + (S.following.has(v.id) ? 1 : 0)).toLocaleString()}</b> followers</span><span><b>${n}</b> products</span><span><b>${v.sales.toLocaleString()}</b> sales</span><span>Selling since ${v.since}</span>`;
    const fb = $('#followBtn');
    fb.classList.toggle('on', S.following.has(v.id));
    fb.textContent = S.following.has(v.id) ? '✓ Following' : '+ Follow';
    $$('#vsTabs button').forEach(b => b.classList.toggle('on', b.dataset.vt === S.vtab));
    const body = $('#vsBody');
    if (S.vtab === 'products') {
      const list = liveProducts().filter(p => p.v === v.id);
      body.innerHTML = `<div class="pgrid" style="margin-top:0">${list.map(pcard).join('') || '<div class="empty">No products yet.</div>'}</div>`;
    } else if (S.vtab === 'about') {
      body.innerHTML = `<div class="vs-about"><div class="box"><h5>About ${esc(v.name)}</h5><p>${esc(v.bio)} Every vendor controls this page from their dashboard: logo, cover colour, bio and policies.</p></div>
        <div class="box"><h5>Store policies</h5><p>Ships in 2–3 business days · Returns within 14 days · Questions answered within 24 hours.</p></div></div>`;
    } else {
      const revs = [['Noura', 'Beautiful quality, and it arrived faster than expected. Will order again.'], ['Khalid', 'Well packed and exactly as pictured.'], ['Maya', 'Great communication from the seller. Highly recommend.']];
      body.innerHTML = `<div class="box">${revs.map(r => `<div class="rev"><i>${r[0][0]}</i><div><div class="stars">★★★★★</div><b style="font-size:14px">${r[0]}</b><p style="margin:2px 0 0;color:var(--muted)">${r[1]}</p></div></div>`).join('')}</div>`;
    }
  }

  /* ---------- cart ---------- */
  function addToCart(id, el) {
    const p = pById(id);
    const line = S.cart.find(l => l.id === id);
    if (line) line.qty++; else S.cart.push({ id, qty: 1 });
    renderCart(); renderCount(true);
    if (el) { el.style.background = 'var(--accent-2)'; setTimeout(() => el.style.background = '', 600); }
    toast(`Added "${p.name}" from ${vById(p.v).name}`);
  }
  function totals() {
    const sub = S.cart.reduce((s, l) => s + pById(l.id).price * l.qty, 0) + (S.gift && S.cart.length ? GIFT : 0);
    const ship = !S.cart.length ? 0 : sub >= FREE_SHIP ? 0 : SHIP_FEE;
    return { sub, ship, total: sub + ship };
  }
  function renderCount(bump) {
    const n = S.cart.reduce((s, l) => s + l.qty, 0);
    $$('[data-count]').forEach(b => {
      b.textContent = n; b.classList.toggle('show', n > 0);
      if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    });
  }
  function renderCart() {
    const { sub, ship, total } = totals();
    const n = S.cart.reduce((s, l) => s + l.qty, 0);
    const groups = {};
    S.cart.forEach(l => { const v = pById(l.id).v; (groups[v] = groups[v] || []).push(l); });
    const gk = Object.keys(groups);
    $('#cartSub').textContent = n ? `${n} item${n > 1 ? 's' : ''} from ${gk.length} vendor${gk.length > 1 ? 's' : ''}` : 'Empty for now';
    const left = FREE_SHIP - sub;
    $('#shipMsg').innerHTML = !n ? `Free shipping on orders over <b>${money(FREE_SHIP)}</b>` : left > 0 ? `You're <b>${money(left)}</b> away from free shipping` : `<b>Free shipping unlocked.</b> Nice.`;
    $('#shipBar').style.width = Math.min(100, sub / FREE_SHIP * 100) + '%';

    let html = '';
    if (!n) {
      html = `<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg><b style="color:var(--ink)">Your bag is empty</b><p style="margin:4px 0 0;font-size:13px">Start with something popular below.</p></div>`;
    } else {
      html = gk.map(vid => {
        const v = vById(vid);
        return `<div class="cgroup"><div class="cg-h"><i style="background:${v.color}">${v.short}</i><b>${esc(v.name)}</b><span>Ships separately</span></div>${groups[vid].map(l => {
          const p = pById(l.id);
          return `<div class="citem">${art(p.type, v.bg, v.color)}<div class="ci"><b>${esc(p.name)}</b><small>${money(p.price)} each</small>
            <div class="ci-row"><span class="stock"><button data-dec="${p.id}" aria-label="Decrease">−</button><span>${l.qty}</span><button data-inc="${p.id}" aria-label="Increase">+</button></span>
            <span style="font-weight:700">${money(p.price * l.qty)}</span></div><button class="rm" data-rm="${p.id}">Remove</button></div></div>`;
        }).join('')}</div>`;
      }).join('');
    }
    // upsells: prefer same vendors, then the best-rated, excluding items already in the cart
    const inCart = new Set(S.cart.map(l => l.id));
    const ups = liveProducts().filter(p => !inCart.has(p.id))
      .sort((a, b) => (gk.includes(b.v) - gk.includes(a.v)) || (b.rating - a.rating)).slice(0, 5);
    if (ups.length) {
      html += `<div class="ups"><h5>Complete the look <span>${gk.length ? 'From your vendors' : 'Bestsellers'}</span></h5><p>${left > 0 && n ? `Add one more item to get closer to free shipping.` : 'Picked from what other shoppers add.'}</p><div class="ups-row">${ups.map(p => {
        const v = vById(p.v);
        return `<div class="ucard">${art(p.type, v.bg, v.color)}<div><small>${esc(v.name)}</small><b>${esc(p.name)}</b><div class="u-row"><span style="font-weight:700;font-size:13px">${money(p.price)}</span><button data-add="${p.id}">+ Add</button></div></div></div>`;
      }).join('')}</div></div>`;
    }
    if (n) html += `<div class="addon ${S.gift ? 'on' : ''}" id="giftToggle" role="switch" aria-checked="${S.gift}"><span class="tg"></span><span><b>Add premium gift wrap</b><small>Hand-wrapped with a handwritten note</small></span><em>+${money(GIFT)}</em></div>`;
    $('#cartBody').innerHTML = html;
    $('#subT').textContent = money(sub);
    $('#shipT').textContent = !n ? '—' : ship ? money(ship) : 'Free';
    $('#totT').textContent = money(total);
    $('#checkoutBtn').disabled = !n;
  }
  function openCart() { renderCart(); $('#cart').classList.add('show'); $('#scrim').classList.add('show'); $('#cart').setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function closeCart() { $('#cart').classList.remove('show'); $('#scrim').classList.remove('show'); $('#cart').setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }

  $('#cartBody').addEventListener('click', e => {
    const t = e.target.closest('button,[id=giftToggle]');
    if (!t) return;
    const find = id => S.cart.find(l => l.id === id);
    if (t.dataset.inc) find(t.dataset.inc).qty++;
    else if (t.dataset.dec) { const l = find(t.dataset.dec); l.qty--; if (!l.qty) S.cart = S.cart.filter(x => x !== l); }
    else if (t.dataset.rm) S.cart = S.cart.filter(x => x.id !== t.dataset.rm);
    else if (t.dataset.add) { addToCart(t.dataset.add); return; }
    else if (t.id === 'giftToggle') S.gift = !S.gift;
    renderCart(); renderCount();
  });
  $('#cartClose').onclick = closeCart;
  $('#scrim').onclick = closeCart;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); $('#addModal').classList.remove('show'); } });
  $('#checkoutBtn').onclick = () => {
    const vs = new Set(S.cart.map(l => pById(l.id).v)).size;
    toast(`Goes to Shopify checkout: one payment, automatically split into ${vs} vendor order${vs > 1 ? 's' : ''}.`);
    S.cart.forEach(l => { const p = pById(l.id); if (p.v === S.me) S.orders.unshift({ id: '#' + (1043 + S.orders.length), cust: 'You (demo)', items: [[p.id, l.qty]], status: 'New', when: 'just now' }); });
    log(`New order placed: ${money(totals().total)} across ${vs} vendor${vs > 1 ? 's' : ''}`);
    S.cart = []; S.gift = false; renderCart(); renderCount();
    setTimeout(closeCart, 900);
  };

  /* ---------- OTP ---------- */
  let code = '', expT, resT;
  const phone = $('#phone'), sendBtn = $('#sendBtn');
  phone.addEventListener('input', () => { phone.value = phone.value.replace(/\D/g, ''); sendBtn.disabled = phone.value.length < 7; });
  phone.addEventListener('keydown', e => { if (e.key === 'Enter' && !sendBtn.disabled) sendCode(); });
  sendBtn.onclick = sendCode;
  const boxes = $('#boxes');
  boxes.innerHTML = Array.from({ length: 6 }, (_, i) => `<input inputmode="numeric" maxlength="1" aria-label="Digit ${i + 1}" autocomplete="${i ? 'off' : 'one-time-code'}">`).join('');
  const inputs = $$('input', boxes);
  function otpStep(n) { $$('.otp-step').forEach((s, i) => s.classList.toggle('on', i === n - 1)); }
  function sendCode() {
    code = String(Math.floor(100000 + Math.random() * 900000));
    const num = `${$('#cc').value} ${phone.value}`;
    $('#sentTo').textContent = num.replace(/\d(?=\d{2})/g, (d, i) => i > 6 ? '•' : d);
    sendBtn.innerHTML = 'Sending…'; sendBtn.disabled = true;
    setTimeout(() => {
      sendBtn.innerHTML = 'Send code'; sendBtn.disabled = false;
      otpStep(2); inputs.forEach(i => i.value = ''); boxes.className = 'otp-boxes'; inputs[0].focus(); checkFilled();
      $('#smsText').innerHTML = `YourMarket: <b>${code.slice(0, 3)} ${code.slice(3)}</b> is your vendor login code. It expires in 5 minutes. Don't share it with anyone.`;
      $('#smsToast').classList.add('show');
      setTimeout(() => $('#smsToast').classList.remove('show'), 7000);
      startTimers();
    }, 700);
  }
  function startTimers() {
    clearInterval(expT); clearInterval(resT);
    let e = 300, r = 30;
    const rb = $('#resend');
    rb.disabled = true; rb.textContent = `Resend in ${r}s`;
    $('#expiry').textContent = 'Expires in 5:00';
    expT = setInterval(() => { e--; $('#expiry').textContent = e > 0 ? `Expires in ${Math.floor(e / 60)}:${String(e % 60).padStart(2, '0')}` : 'Code expired'; if (e <= 0) clearInterval(expT); }, 1000);
    resT = setInterval(() => { r--; if (r <= 0) { clearInterval(resT); rb.disabled = false; rb.textContent = 'Resend code'; } else rb.textContent = `Resend in ${r}s`; }, 1000);
  }
  $('#resend').onclick = sendCode;
  $('#editNum').onclick = () => { otpStep(1); phone.focus(); };
  function checkFilled() { $('#verifyBtn').disabled = inputs.some(i => !i.value); }
  inputs.forEach((inp, i) => {
    inp.addEventListener('input', () => {
      inp.value = inp.value.replace(/\D/g, '').slice(-1);
      boxes.classList.remove('err');
      if (inp.value && i < 5) inputs[i + 1].focus();
      checkFilled();
      if (inputs.every(x => x.value)) verify();
    });
    inp.addEventListener('keydown', e => { if (e.key === 'Backspace' && !inp.value && i) inputs[i - 1].focus(); });
    inp.addEventListener('paste', e => {
      const d = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
      if (!d) return; e.preventDefault();
      d.split('').forEach((c, k) => inputs[k] && (inputs[k].value = c));
      inputs[Math.min(d.length, 5)].focus(); checkFilled();
      if (d.length === 6) verify();
    });
  });
  $('#verifyBtn').onclick = verify;
  function verify() {
    const entered = inputs.map(i => i.value).join('');
    if (entered !== code) { boxes.className = 'otp-boxes err'; toast('That code is incorrect. Check the SMS at the top of the window.'); return; }
    boxes.className = 'otp-boxes ok';
    clearInterval(expT); clearInterval(resT);
    S.loggedIn = true;
    setTimeout(() => { otpStep(3); $('#smsToast').classList.remove('show'); }, 350);
    setTimeout(() => { go('dash'); otpStep(1); phone.value = ''; sendBtn.disabled = true; toast('Signed in as Loom Studio (demo vendor)'); }, 1700);
  }

  /* ---------- vendor dashboard ---------- */
  const IC = {
    overview: '<path d="M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z"/>',
    products: '<path d="M4 7l8-4 8 4-8 4z"/><path d="M4 7v10l8 4 8-4V7"/>',
    orders: '<path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
    payouts: '<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20"/>',
    store: '<path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/>'
  };
  const svgI = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</svg>`;
  const orderTotal = o => o.items.reduce((s, [id, q]) => s + pById(id).price * q, 0);

  function renderDash() {
    const el = $('#dashView');
    const me = vById(S.me);
    const mine = products.filter(p => p.v === S.me);
    const newOrders = S.orders.filter(o => o.status === 'New').length;
    const nav = [['overview', 'Overview'], ['products', 'Products'], ['orders', 'Orders'], ['payouts', 'Payouts'], ['store', 'Store settings']];
    let main = '';
    const gross = S.orders.reduce((s, o) => s + orderTotal(o), 0) + 3240;
    const comm = gross * S.commission / 100;

    if (S.dtab === 'overview') {
      const pts = [320, 410, 380, 520, 470, 610, 580, 690, 640, 760, 720, 880, 840, 960];
      const W = 600, H = 200, max = 1000;
      const xy = pts.map((v, i) => [i * (W / (pts.length - 1)), H - 14 - (v / max) * (H - 30)]);
      const line = xy.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
      main = `<div class="dh"><div><h4>Good evening, ${esc(me.name)}</h4><p>Here's how your store is doing this month.</p></div><button class="btn btn-dark btn-sm" data-dt="products" data-open-add>+ Add product</button></div>
      <div class="kpis">
        <div class="kpi"><span>Sales (30 days)</span><b>${money(gross)}</b><small>▲ 18.4% vs last month</small></div>
        <div class="kpi"><span>Orders</span><b>${S.orders.length + 41}</b><small>▲ 9 this week</small></div>
        <div class="kpi"><span>Avg. order value</span><b>${money(gross / (S.orders.length + 41))}</b><small>▲ 4.1%</small></div>
        <div class="kpi"><span>Pending payout</span><b>${money(gross - comm)}</b><small class="neg">${S.commission}% commission deducted</small></div>
      </div>
      <div class="dgrid">
        <div class="chart-box"><h5>Revenue <span>Last 14 days</span></h5>
          <svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FF5B35" stop-opacity=".28"/><stop offset="1" stop-color="#FF5B35" stop-opacity="0"/></linearGradient></defs>
          ${[0.25, 0.5, 0.75].map(f => `<line x1="0" x2="${W}" y1="${H * f}" y2="${H * f}" stroke="#EEE" />`).join('')}
          <path d="${line} L${W} ${H} L0 ${H}Z" fill="url(#cg)"/><path d="${line}" fill="none" stroke="#FF5B35" stroke-width="3" stroke-linejoin="round" vector-effect="non-scaling-stroke" class="draw"/>
          <circle cx="${xy.at(-1)[0] - 4}" cy="${xy.at(-1)[1]}" r="5" fill="#FF5B35" stroke="#fff" stroke-width="2"/></svg></div>
        <div class="chart-box"><h5>Recent orders <span><a style="cursor:pointer" data-dt="orders">View all</a></span></h5>
          <div class="recent">${S.orders.slice(0, 4).map(o => `<div><span><b>${o.id}</b> · ${esc(o.cust)}<small>${o.when}</small></span><span style="text-align:right"><b>${money(orderTotal(o))}</b><br><span class="st ${o.status}">${o.status}</span></span></div>`).join('')}</div></div>
      </div>`;
    } else if (S.dtab === 'products') {
      main = `<div class="dh"><div><h4>Products</h4><p>${mine.length} products · edit stock inline, or add new ones for approval.</p></div><button class="btn btn-dark btn-sm" data-open-add>+ Add product</button></div>
      <div class="tbl-wrap"><table><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead><tbody>
      ${mine.map(p => `<tr><td><div class="pmini">${art(p.type, me.bg, me.color)}<b>${esc(p.name)}</b></div></td><td>${money(p.price)}</td>
        <td><span class="stock"><button data-sdec="${p.id}" aria-label="Less stock">−</button><span>${p.stock}</span><button data-sinc="${p.id}" aria-label="More stock">+</button></span></td>
        <td><span class="st ${p.status}">${p.status === 'live' ? 'Live' : p.status === 'pending' ? 'Awaiting approval' : 'Rejected'}</span></td>
        <td><button class="mini-btn" data-del="${p.id}">Delete</button></td></tr>`).join('')}
      </tbody></table></div>`;
    } else if (S.dtab === 'orders') {
      main = `<div class="dh"><div><h4>Orders</h4><p>Only orders containing your products. Update the status and the customer is notified.</p></div></div>
      <div class="tbl-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>
      ${S.orders.map((o, i) => `<tr><td><b>${o.id}</b><br><small style="color:var(--muted)">${o.when}</small></td><td>${esc(o.cust)}</td>
        <td>${o.items.map(([id, q]) => `${q}× ${esc(pById(id).name)}`).join('<br>')}</td><td><b>${money(orderTotal(o))}</b></td>
        <td><select class="sel" data-ost="${i}">${['New', 'Packed', 'Shipped', 'Delivered'].map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td></tr>`).join('')}
      </tbody></table></div>`;
    } else if (S.dtab === 'payouts') {
      main = `<div class="dh"><div><h4>Payouts</h4><p>The commission rate is set by the admin. Try changing it in the Admin panel tab.</p></div></div>
      <div class="pay-grid">
        <div class="chart-box"><h5>Current period <span>Pays out on the 1st</span></h5>
          <div class="pay-line"><span>Gross sales</span><b>${money(gross)}</b></div>
          <div class="pay-line"><span>Marketplace commission (${S.commission}%)</span><b style="color:#C2410C">−${money(comm)}</b></div>
          <div class="pay-line"><span>Refunds</span><b>${money(0)}</b></div>
          <div class="pay-line total"><span>Net payout</span><span>${money(gross - comm)}</span></div></div>
        <div class="chart-box"><h5>Payout history</h5><div class="recent">
          ${[['Nov 1, 2026', 2980.4], ['Oct 1, 2026', 2412.75], ['Sep 1, 2026', 1890.1]].map(r => `<div><span><b>${r[0]}</b><small>Bank transfer</small></span><span style="text-align:right"><b>${money(r[1])}</b><br><span class="st Delivered">Paid</span></span></div>`).join('')}
        </div></div></div>`;
    } else {
      const sw = ['#1F6F5C', '#7A4B2A', '#C2562F', '#2D3A8C', '#B4457A', '#111317'];
      main = `<div class="dh"><div><h4>Store settings</h4><p>Changes show on your public storefront straight away.</p></div><button class="btn btn-ghost btn-sm" data-preview>Preview storefront →</button></div>
      <div class="chart-box"><div class="form-grid">
        <div><label class="lbl">Store name</label><input class="inp" id="stName" value="${esc(me.name)}"></div>
        <div><label class="lbl">Category</label><input class="inp" value="${esc(me.cat)}" disabled></div>
        <div class="full"><label class="lbl">Bio</label><textarea class="inp" id="stBio">${esc(me.bio)}</textarea></div>
        <div class="full"><label class="lbl">Brand colour</label><div class="swatches">${sw.map(c => `<button style="background:${c}" data-sw="${c}" class="${c === me.color ? 'on' : ''}" aria-label="Colour ${c}"></button>`).join('')}</div></div>
        <div class="full"><label class="lbl">Login phone (SMS OTP)</label><input class="inp" value="+966 5• ••• 1147" disabled></div>
      </div></div>`;
    }

    el.innerHTML = `<div class="dash"><aside class="dside">
      <div class="who"><span class="vav" style="background:${me.color}">${me.short}</span><div><b>${esc(me.name)}</b><span>Vendor · ★ ${me.rating}</span></div></div>
      ${nav.map(([k, l]) => `<button class="dnav ${S.dtab === k ? 'on' : ''}" data-dt="${k}">${svgI(k === 'store' ? 'store' : k)}${l}${k === 'orders' && newOrders ? `<em>${newOrders}</em>` : ''}</button>`).join('')}
      <button class="out" data-logout>Sign out</button></aside>
      <div class="dmain">${main}</div></div>
      ${S.loggedIn ? '' : `<div class="lock"><div class="lock-card"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></div><h5>Vendors only</h5><p>The dashboard is behind the SMS OTP login. Sign in first, or skip ahead to look around.</p><div class="row"><button class="btn btn-primary btn-sm" data-go="otp">Sign in with SMS code</button><button class="skip" data-skip>Skip for the demo</button></div></div></div>`}`;
    $('#furl').textContent = URLS.dash();
  }

  $('#dashView').addEventListener('click', e => {
    const t = e.target.closest('button,a');
    if (!t) return;
    if (t.dataset.dt) { S.dtab = t.dataset.dt; renderDash(); }
    if (t.hasAttribute('data-open-add')) { S.dtab = 'products'; renderDash(); openAdd(); }
    if (t.hasAttribute('data-skip')) { S.loggedIn = true; renderDash(); }
    if (t.hasAttribute('data-logout')) { S.loggedIn = false; renderDash(); toast('Signed out'); }
    if (t.hasAttribute('data-preview')) go('vendor', { vendor: S.me });
    if (t.dataset.sinc || t.dataset.sdec) { const p = pById(t.dataset.sinc || t.dataset.sdec); p.stock = Math.max(0, p.stock + (t.dataset.sinc ? 1 : -1)); renderDash(); }
    if (t.dataset.del) { const p = pById(t.dataset.del); if (confirm(`Delete "${p.name}"?`)) { products.splice(products.indexOf(p), 1); S.cart = S.cart.filter(l => l.id !== p.id); renderDash(); renderCount(); toast('Product deleted'); } }
    if (t.dataset.sw) { vById(S.me).color = t.dataset.sw; renderDash(); toast('Brand colour updated on your storefront'); }
  });
  $('#dashView').addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.ost !== undefined) { const o = S.orders[+t.dataset.ost]; o.status = t.value; log(`Order ${o.id} marked ${t.value} by ${vById(S.me).name}`, '#5B4BDB'); renderDash(); toast(`Order ${o.id} → ${t.value}. Customer notified by SMS and email.`); }
    if (t.id === 'stName' && t.value.trim()) { vById(S.me).name = t.value.trim(); renderDash(); toast('Store name saved'); }
    if (t.id === 'stBio') { vById(S.me).bio = t.value; toast('Bio saved'); }
  });

  function openAdd() { $('#addModal').classList.add('show'); setTimeout(() => $('#npName').focus(), 50); }
  $('#npCancel').onclick = () => $('#addModal').classList.remove('show');
  $('#addModal').addEventListener('click', e => { if (e.target.id === 'addModal') $('#addModal').classList.remove('show'); });
  $('#npSave').onclick = () => {
    const name = $('#npName').value.trim() || 'Untitled product';
    const price = Math.max(1, parseFloat($('#npPrice').value) || 1);
    const stock = Math.max(0, parseInt($('#npStock').value) || 0);
    products.push(P(S.me, name, price, $('#npType').value, 5, stock, 'pending'));
    log(`${vById(S.me).name} submitted "${name}" for approval`, '#E8B04A');
    $('#addModal').classList.remove('show'); $('#npName').value = '';
    renderDash();
    toast('Submitted. Approve it in the Admin panel tab to make it live.');
  };

  /* ---------- admin ---------- */
  function renderAdmin() {
    const pend = applications.filter(a => a.status === 'pending');
    const pendP = products.filter(p => p.status === 'pending');
    const gmv = 48620 + S.orders.reduce((s, o) => s + orderTotal(o), 0);
    if (!S.feed.length) S.feed = [
      { text: 'Order #1042 placed: $89.00 · Loom Studio', color: '#3ecf6e', when: '12 min ago' },
      { text: 'Volt Gear updated stock on 3 products', color: '#5B4BDB', when: '1 h ago' },
      { text: 'Payout batch sent to 4 vendors', color: '#3ecf6e', when: 'Nov 1' }
    ];
    $('#adminView').innerHTML = `<div class="adm">
      <div class="dh"><div><h4>Marketplace admin</h4><p>Runs inside your Shopify admin as an embedded app.</p></div><span class="st live">All systems normal</span></div>
      <div class="kpis">
        <div class="kpi"><span>GMV (30 days)</span><b>${money(gmv)}</b><small>▲ 22%</small></div>
        <div class="kpi"><span>Commission earned</span><b>${money(gmv * S.commission / 100)}</b><small>at ${S.commission}%</small></div>
        <div class="kpi"><span>Active vendors</span><b>${vendors.filter(v => v.status === 'live').length}</b><small>${pend.length} awaiting review</small></div>
        <div class="kpi"><span>Products pending</span><b>${pendP.length}</b><small class="${pendP.length ? 'neg' : ''}">${pendP.length ? 'Needs review' : 'All clear'}</small></div>
      </div>
      <div class="adm-cols">
        <div class="chart-box"><h5>Vendor applications <span>${pend.length} pending</span></h5>
          ${pend.length ? pend.map(a => `<div class="app-row"><span class="vav" style="background:${a.color}">${a.short}</span><div class="info"><b>${esc(a.name)}</b><span>${a.cat} · ${a.phone} · OTP verified · ${a.applied}</span></div><div class="acts"><button class="mini-btn" data-rejv="${a.id}">Reject</button><button class="mini-btn ok" data-appv="${a.id}">Approve</button></div></div>`).join('') : '<p style="color:var(--muted);font-size:14px;margin:14px 0 0">No pending applications 🎉</p>'}
        </div>
        <div class="chart-box"><h5>Product approvals <span>${pendP.length} pending</span></h5>
          ${pendP.length ? pendP.map(p => { const v = vById(p.v); return `<div class="app-row"><div class="pmini">${art(p.type, v.bg, v.color)}</div><div class="info"><b>${esc(p.name)}</b><span>${esc(v.name)} · ${money(p.price)} · ${p.stock} in stock</span></div><div class="acts"><button class="mini-btn" data-rejp="${p.id}">Reject</button><button class="mini-btn ok" data-appp="${p.id}">Approve</button></div></div>`; }).join('') : '<p style="color:var(--muted);font-size:14px;margin:14px 0 0">Nothing to review. Add a product from the Vendor dashboard to test this.</p>'}
        </div>
        <div class="chart-box"><h5>Commission rate <span>Applies to all vendors</span></h5>
          <div class="range-wrap"><input type="range" min="0" max="30" step="1" value="${S.commission}" id="commRange" aria-label="Commission rate"><b id="commVal">${S.commission}%</b></div>
          <p style="font-size:13px;color:var(--muted);margin:10px 0 0">On a $100 sale: the marketplace keeps <b id="commEx1">${money(S.commission)}</b> and the vendor gets <b id="commEx2">${money(100 - S.commission)}</b>. You can also set different rates per vendor or per category.</p></div>
        <div class="chart-box"><h5>Live activity</h5><div class="feed">${S.feed.slice(0, 8).map(f => `<div><i style="background:${f.color}"></i><span>${esc(f.text)}<small>${f.when}</small></span></div>`).join('')}</div></div>
      </div></div>`;
  }
  $('#adminView').addEventListener('click', e => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.appv) {
      const a = applications.find(x => x.id === t.dataset.appv);
      a.status = 'live'; a.rating = 5; vendors.push(a);
      products.push(P(a.id, a.cat === 'Footwear' ? 'Everyday Low Sneaker' : 'Preserved Rose Bouquet', a.cat === 'Footwear' ? 98 : 54, a.cat === 'Footwear' ? 'shoe' : 'vase', 5, 20));
      log(`Vendor "${a.name}" approved: storefront is live`); toast(`${a.name} approved. Their storefront is now live in the Marketplace.`);
    }
    if (t.dataset.rejv) { const a = applications.find(x => x.id === t.dataset.rejv); a.status = 'rejected'; log(`Vendor "${a.name}" rejected`, '#E5484D'); toast(`${a.name} rejected. They'll get an SMS with the reason.`); }
    if (t.dataset.appp) { const p = pById(t.dataset.appp); p.status = 'live'; log(`"${p.name}" approved and published`); toast(`"${p.name}" is now live in the Marketplace.`); }
    if (t.dataset.rejp) { const p = pById(t.dataset.rejp); p.status = 'rejected'; log(`"${p.name}" rejected`, '#E5484D'); toast('Product rejected. The vendor sees the reason in their dashboard.'); }
    renderAdmin();
  });
  $('#adminView').addEventListener('input', e => {
    if (e.target.id !== 'commRange') return;
    S.commission = +e.target.value;
    $('#commVal').textContent = S.commission + '%';
    $('#commEx1').textContent = money(S.commission);
    $('#commEx2').textContent = money(100 - S.commission);
  });
  $('#adminView').addEventListener('change', e => { if (e.target.id === 'commRange') { log(`Commission rate changed to ${S.commission}%`, '#5B4BDB'); renderAdmin(); } });

  /* ---------- global prototype events ---------- */
  document.addEventListener('click', e => {
    const goEl = e.target.closest('[data-go]');
    if (goEl) { e.preventDefault(); go(goEl.dataset.go); return; }
    const add = e.target.closest('[data-add]');
    if (add && !add.closest('#cartBody')) { addToCart(add.dataset.add, add); return; }
    const v = e.target.closest('[data-vendor]');
    if (v) { S.vtab = 'products'; go('vendor', { vendor: v.dataset.vendor }); return; }
    if (e.target.closest('[data-open-cart]')) { openCart(); return; }
    const cat = e.target.closest('[data-cat]');
    if (cat) { S.cat = cat.dataset.cat; renderMarket(); return; }
    if (e.target.closest('[data-scroll-products]')) { $('#fbody').scrollTo({ top: $('#productsAnchor').offsetTop - 70, behavior: 'smooth' }); }
  });
  $('#mkSearch').addEventListener('input', e => { S.q = e.target.value; renderMarket(); });
  $('#vsTabs').addEventListener('click', e => { const b = e.target.closest('[data-vt]'); if (b) { S.vtab = b.dataset.vt; renderVendor(); } });
  $('#followBtn').onclick = () => {
    const id = S.vendor;
    S.following.has(id) ? S.following.delete(id) : S.following.add(id);
    renderVendor();
    if (S.following.has(id)) toast(`Following ${vById(id).name}. You'll hear about new drops.`);
  };

  /* ---------- hero mock ---------- */
  $('#heroVendors').innerHTML = vendors.map(v => `<i style="background:${v.color}">${v.short}</i>`).join('');
  $('#heroGrid').innerHTML = [0, 3, 6, 9].map(i => { const p = products[i], v = vById(p.v); return `<div>${art(p.type, v.bg, v.color)}<p>${money(p.price)}</p></div>`; }).join('');

  /* ---------- comparison meters ---------- */
  $$('.dots').forEach(d => { const n = +d.dataset.v; d.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? 'f' : ''}"></i>`).join(''); });

  /* ---------- MVP builder (days are rough planning numbers) ---------- */
  const FEATS = [
    { n: 'Custom marketplace storefront', d: 'Home, categories, search, product pages from your designs', days: 12, on: true, core: true, c: '#FF5B35' },
    { n: 'Vendor storefront pages', d: 'Branded page per vendor with products and profile', days: 5, on: true, core: true, c: '#FF8A5B' },
    { n: 'SMS OTP vendor login', d: 'Phone + 6-digit code, rate limits, expiry', days: 4, on: true, core: true, c: '#1F6F5C' },
    { n: 'Vendor dashboard', d: 'Products, prices, stock, orders, store profile', days: 10, on: true, core: true, c: '#2E9A7C' },
    { n: 'Admin panel', d: 'Vendor and product approvals, vendor management', days: 6, on: true, core: true, c: '#5B4BDB' },
    { n: 'Checkout & order splitting', d: 'One Shopify checkout, orders routed per vendor', days: 5, on: true, core: true, c: '#8577F0' },
    { n: 'Commissions & payout ledger', d: 'Automatic commission, payout statements', days: 4, on: true, core: true, c: '#E8B04A' },
    { n: 'QA, launch & vendor onboarding', d: 'Testing on all devices, go-live support', days: 6, on: true, core: true, c: '#6B6F78' },
    { n: 'Arabic / RTL + multi-language', d: 'Full right-to-left layout, language switcher', days: 6, c: '#0EA5E9' },
    { n: 'Reviews & ratings', d: 'Product and vendor reviews with moderation', days: 4, c: '#F59E0B' },
    { n: 'Per-vendor shipping rules', d: 'Each vendor sets their own rates and zones', days: 5, c: '#10B981' },
    { n: 'Automated vendor payouts', d: 'Scheduled payouts through a payout provider', days: 6, c: '#EF4444' },
    { n: 'Vendor coupons & promotions', d: 'Discount codes owned by each vendor', days: 3, c: '#A855F7' },
    { n: 'Vendor subscription plans', d: 'Monthly plans or listing fees for vendors', days: 4, c: '#EC4899' },
    { n: 'Advanced analytics', d: 'Funnels, top products, exports for vendors and admin', days: 4, c: '#14B8A6' },
    { n: 'Mobile app (PWA)', d: 'Installable app experience for customers', days: 8, c: '#64748B' }
  ];
  const chk = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const featHTML = (f, i) => `<button class="feat ${f.on ? 'on' : ''}" data-f="${i}" aria-pressed="${!!f.on}"><span class="cb">${chk}</span><span><b>${f.n}${f.core ? '<em>MVP</em>' : ''}</b><small>${f.d}</small></span></button>`;
  function renderMVP() {
    $('#featCore').innerHTML = FEATS.map((f, i) => f.core ? featHTML(f, i) : '').join('');
    $('#featLater').innerHTML = FEATS.map((f, i) => !f.core ? featHTML(f, i) : '').join('');
    const on = FEATS.filter(f => f.on);
    const days = on.reduce((s, f) => s + f.days, 0);
    const wk = Math.max(1, Math.round(days / 5.2));
    animateNum($('#wk'), wk);
    $('#featCount').textContent = `${on.length} features selected · about ${days} working days`;
    $('#sumBar').innerHTML = on.map(f => `<i style="flex-grow:${f.days};background:${f.c}" title="${f.n}"></i>`).join('');
    $('#sumList').innerHTML = on.map(f => `<li>${f.n}<span>${f.days}d</span></li>`).join('');
  }
  function animateNum(el, to) {
    const from = +el.textContent || 0;
    if (from === to) return;
    const t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 500); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  $('#mvp').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; const f = FEATS[+b.dataset.f]; f.on = !f.on; renderMVP(); });
  renderMVP();

  /* ---------- similar work ---------- */
  const WORK = ['www.1antiq.in', 'www.zupppy.com', 'www.benchmarkbusiness.com.au', 'www.larket.co.uk', 'oppymarketplace.au', 'www.craftha.com', 'www.induscrafts.in'];
  $('#links').innerHTML = WORK.map(w => `<a href="https://${w}/" target="_blank" rel="noopener"><span><b>${w.replace(/^www\./, '')}</b><small>Live project</small></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 17L17 7M8 7h9v9"/></svg></a>`).join('');

  /* ---------- FAQ ---------- */
  const FAQ = [
    ['Can Shopify really run a multi-vendor marketplace?', "Not on its own. Shopify is built for one seller per store. That's why we add a marketplace layer: a custom app that links products and orders to vendors, plus a separate vendor dashboard. Shopify still handles what it does best: products, checkout, payments and orders."],
    ['Do vendors need their own Shopify accounts?', "No. Vendors sign in to our vendor dashboard with their phone number and an SMS code. They never touch your Shopify admin and don't use up staff accounts. Everything they do syncs to Shopify through its APIs."],
    ['How do vendors get paid?', "Customers pay once at Shopify checkout. The marketplace app records each vendor's share and your commission in a payout ledger. For the MVP, payouts are usually sent by bank transfer from that ledger. Automated payouts through a payout provider can come in phase 2, depending on your country."],
    ['What does SMS OTP cost to run?', "You pay the SMS provider per message, usually a few cents, depending on the country. A vendor typically logs in a few times a week, so it stays low. We'll pick the provider with the best delivery rates in your region."],
    ['Can the marketplace be in Arabic?', "Yes. Arabic with a full right-to-left layout is listed as a phase-2 option in the scope planner above. We can move it into the MVP if your launch audience needs it from day one."],
    ['Who owns the code and the data?', "You do. The theme, marketplace app and vendor dashboard are yours, on your hosting and your Shopify store. There are no per-vendor licence fees."]
  ];
  $('#faqList').innerHTML = FAQ.map(([q, a], i) => `<div class="qa ${i === 0 ? 'open' : ''}"><button aria-expanded="${i === 0}">${q}<i>+</i></button><div class="ans"><div><p>${a}</p></div></div></div>`).join('');
  $('#faqList').addEventListener('click', e => { const b = e.target.closest('.qa button'); if (!b) return; const qa = b.parentElement; const open = !qa.classList.contains('open'); qa.classList.toggle('open', open); b.setAttribute('aria-expanded', open); });

  /* ---------- checklist ---------- */
  const needs = $$('.need input');
  needs.forEach(n => n.addEventListener('change', () => { const c = needs.filter(x => x.checked).length; $('#needProg').textContent = c === needs.length ? 'All set. Send them over and we can start.' : `${c} of ${needs.length} ready`; }));

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 });
  $$('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });

  go('market');
  renderCart();
})();
