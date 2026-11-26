(function () {
  'use strict';

  /* ---------- Data ---------- */
  var ICONS = {
    vitality: '<path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z"/>',
    female: '<circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/>',
    mood: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    daily: '<rect x="4" y="8" width="16" height="13" rx="3"/><path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M12 12v5M9.5 14.5h5"/>',
    memory: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
    muscle: '<path d="M6 6v12M18 6v12M3 9v6M21 9v6M6 12h12"/>',
    joints: '<path d="M8 3a2 2 0 0 1 2 2v4l4 6v4a2 2 0 0 1-4 0v-3l-4-6V5a2 2 0 0 1 2-2Z"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/><path d="M5 12h3l2-3 3 6 2-3h4"/>',
    immune: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="M12 9v6M9 12h6"/>',
    sugar: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>',
    prostate: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>',
    sleep: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
    vision: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'
  };

  var P = [
    { id: 'damiana', name: 'Damiana', area: 'Male Vitality', icon: 'vitality', cat: 'vitality', price: 32, img: 'images/damiana.webp', badge: 'Bestseller', benefit: 'Energy, vitality & natural drive', key: 'Liboost® · L-Citrulline · B5 & B6', rating: 4.9, reviews: 21 },
    { id: 'damiana-her', name: 'Damiana for Her', area: "Women's Vitality", icon: 'female', cat: 'vitality', price: 32, img: 'images/damiana-her.webp', badge: 'New', benefit: 'Balance, energy & feminine vitality', key: 'Standardized Damiana', rating: 4.8, reviews: 14 },
    { id: 'saffron', name: 'Saffron', area: 'Mood', icon: 'mood', cat: 'mind', price: 42, img: 'images/saffron.webp', badge: 'Top rated', benefit: 'Mental well-being & a balanced mood', key: 'Affron® · Magnesium · B6 & B12', rating: 4.9, reviews: 18 },
    { id: 'multivitamin', name: 'Multivitamin', area: 'Essential Integration', icon: 'daily', cat: 'daily', price: 54, img: 'images/multivitamin.webp', badge: 'Essential', benefit: 'Everyday energy & cellular vitality', key: '13 vitamins + 5 minerals · CoQ10 · PQQ', rating: 4.8, reviews: 16 },
    { id: 'bacopa', name: 'Bacopa', area: 'Memory & Focus', icon: 'memory', cat: 'mind', price: 59, img: 'images/bacopa.webp', benefit: 'Supports memory & concentration', key: 'Standardized Bacopa monnieri', rating: 4.8, reviews: 12 },
    { id: 'creatine', name: 'Creatine', area: 'Muscles & Strength', icon: 'muscle', cat: 'body', price: 24, img: 'images/creatine.webp', benefit: 'Maintains strength & muscle tone', key: 'Pure creatine monohydrate', rating: 4.7, reviews: 9 },
    { id: 'boswellia', name: 'Boswellia', area: 'Joints', icon: 'joints', cat: 'body', price: 44, img: 'images/boswellia.webp', badge: 'Popular', benefit: 'Flexible, comfortable joints', key: 'Standardized Boswellia serrata', rating: 4.8, reviews: 15 },
    { id: 'black-garlic', name: 'Black Garlic', area: 'Heart', icon: 'heart', cat: 'body', price: 39, img: 'images/black-garlic.webp', benefit: 'Heart & circulation support', key: 'Aged black garlic extract', rating: 4.7, reviews: 8 },
    { id: 'echinacea', name: 'Echinacea', area: 'Immune System', icon: 'immune', cat: 'daily', price: 30, img: 'images/echinacea.webp', benefit: 'Natural immune defences', key: 'Standardized Echinacea', rating: 4.8, reviews: 10 },
    { id: 'carob', name: 'Carob', area: 'Blood Sugar', icon: 'sugar', cat: 'body', price: 35, img: 'images/carob.webp', benefit: 'Supports healthy glucose balance', key: 'Carob fruit extract', rating: 4.7, reviews: 7 },
    { id: 'saw-palmetto', name: 'Saw Palmetto', area: 'Prostate', icon: 'prostate', cat: 'vitality', price: 34, img: 'images/saw-palmetto.webp', benefit: 'Prostate & urinary comfort', key: 'Standardized Serenoa repens', rating: 4.8, reviews: 11 },
    { id: 'melatonin', name: 'Melatonin + Valerian + Magnesium', short: 'Sleep Formula', area: 'Sleep', icon: 'sleep', cat: 'mind', price: 29, img: 'images/melatonin.webp', benefit: 'Fall asleep faster, wake refreshed', key: 'Melatonin · Valerian · Magnesium', rating: 4.9, reviews: 13 },
    { id: 'lutein', name: 'Lutein + Zeaxanthin', short: 'Lutein + Zeaxanthin', area: 'Vision', icon: 'vision', cat: 'daily', price: 37, img: 'images/lutein.webp', benefit: 'Protects & supports healthy vision', key: 'Lutein · Zeaxanthin', rating: 4.8, reviews: 9 }
  ];
  var byId = {};
  P.forEach(function (p) { byId[p.id] = p; });

  var PAIRS = {
    'damiana': ['saw-palmetto', 'creatine', 'multivitamin'],
    'damiana-her': ['saffron', 'multivitamin', 'melatonin'],
    'saffron': ['melatonin', 'bacopa', 'multivitamin'],
    'multivitamin': ['bacopa', 'lutein', 'echinacea'],
    'bacopa': ['saffron', 'multivitamin', 'lutein'],
    'creatine': ['boswellia', 'multivitamin', 'damiana'],
    'boswellia': ['creatine', 'black-garlic', 'multivitamin'],
    'black-garlic': ['carob', 'boswellia', 'multivitamin'],
    'echinacea': ['multivitamin', 'melatonin', 'lutein'],
    'carob': ['black-garlic', 'multivitamin', 'creatine'],
    'saw-palmetto': ['damiana', 'black-garlic', 'multivitamin'],
    'melatonin': ['saffron', 'bacopa', 'multivitamin'],
    'lutein': ['multivitamin', 'bacopa', 'echinacea']
  };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var euro = function (n) { return '€' + n.toFixed(2).replace('.', ','); };
  var icon = function (k) { return '<svg viewBox="0 0 24 24">' + ICONS[k] + '</svg>'; };
  var arrow = '<svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  var plus = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
  var starStr = '★★★★★';

  /* ---------- Render: areas, mega menu ---------- */
  $('#areaTrack').innerHTML = P.map(function (p) {
    return '<a class="area-card" href="#bestsellers" data-area="' + p.cat + '"><i>' + icon(p.icon) + '</i><strong>' + p.area + '</strong><small>' + (p.short || p.name) + '</small><span class="arrow">' + arrow + '</span><img src="' + p.img + '" alt="" loading="lazy"></a>';
  }).join('');
  $('#megaList').innerHTML = P.map(function (p) {
    return '<a href="#bestsellers" data-area="' + p.cat + '"><i>' + icon(p.icon) + '</i>' + p.area + '</a>';
  }).join('');
  $('#mnavAreas').innerHTML = P.map(function (p) {
    return '<a href="#bestsellers" data-area="' + p.cat + '">' + p.area + '</a>';
  }).join('');

  /* ---------- Render: products ---------- */
  var grid = $('#productGrid');
  function renderProducts(filter) {
    var list = P.filter(function (p) { return filter === 'all' || p.cat === filter; });
    grid.innerHTML = list.map(function (p, i) {
      var badge = p.badge ? '<span class="badge' + (p.badge === 'Bestseller' ? ' badge--dark' : p.badge === 'New' ? ' badge--rust' : '') + '">' + p.badge + '</span>' : '';
      return '<article class="pcard" style="animation-delay:' + (i * 50) + 'ms">' +
        '<div class="pcard__media">' + badge + '<img src="' + p.img + '" alt="Horizon 120 ' + p.name + '" loading="lazy">' +
        '<button class="btn btn--dark btn--block btn--small pcard__quick" data-add="' + p.id + '">Quick add — ' + euro(p.price) + '</button></div>' +
        '<div class="pcard__body"><span class="pcard__area">' + p.area + '</span><h3>' + (p.short || p.name) + '</h3>' +
        '<p class="pcard__benefit">' + p.benefit + '</p>' +
        '<div class="pcard__rating"><span class="stars">' + starStr + '</span>' + p.rating + ' (' + p.reviews + ')</div>' +
        '<div class="pcard__foot"><span class="price">' + euro(p.price) + '<small>or ' + euro(p.price * 0.85) + ' with subscription</small></span>' +
        '<button class="add-mini" data-add="' + p.id + '" aria-label="Add ' + p.name + ' to cart">' + plus + '</button></div></div></article>';
    }).join('') + (filter === 'all' ? '<article class="promo-tile"><div><span class="eyebrow">Build your routine</span><h3>Combine 2+ formulas and <em>save 10%</em>.</h3><p>Answer three quick questions and we\'ll build a routine around your priorities.</p><a href="#quiz" class="btn btn--gold">Take the 60-second quiz</a></div><div class="promo-tile__imgs" aria-hidden="true"><img src="images/bacopa.webp" alt=""><img src="images/multivitamin.webp" alt=""><img src="images/saffron.webp" alt=""></div></article>' : '');
  }
  renderProducts('all');

  function setFilter(f) {
    $$('.tab').forEach(function (t) { t.classList.toggle('is-active', t.dataset.filter === f); });
    renderProducts(f);
  }
  $('#tabs').addEventListener('click', function (e) {
    var t = e.target.closest('.tab'); if (t) setFilter(t.dataset.filter);
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-area]');
    if (a) { setFilter(a.dataset.area); closeMenu(); }
  });

  /* ---------- Sliders ---------- */
  $$('[data-scroll]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = document.getElementById(b.dataset.scroll);
      t.scrollBy({ left: Number(b.dataset.dir) * t.clientWidth * 0.7, behavior: 'smooth' });
    });
  });

  /* ---------- Reviews ---------- */
  var REVIEWS = [
    { n: 'Marco R.', a: 58, c: 'Milan', p: 'damiana', t: 'I feel like myself again', b: 'After about three weeks I noticed real, steady energy in the afternoons. Discreet delivery, quick shipping. Already on my second bottle.' },
    { n: 'Giulia B.', a: 61, c: 'Turin', p: 'saffron', t: 'A calmer, brighter me', b: 'I was skeptical, but my mood feels more even and I sleep better too. I love that it is made in Spain and lab-tested.' },
    { n: 'Antonio L.', a: 66, c: 'Rome', p: 'boswellia', t: 'Morning walks are back', b: 'My knees have been the issue for years. I take two capsules with breakfast and the morning stiffness is much easier to manage.' },
    { n: 'Lucia M.', a: 54, c: 'Bologna', p: 'bacopa', t: 'Sharper at work', b: 'Names, appointments, details — I feel more focused. Paired it with the Multivitamin and the subscription makes it effortless.' },
    { n: 'Franco D.', a: 63, c: 'Naples', p: 'melatonin', t: 'Finally sleeping through', b: 'Falling asleep used to take an hour. Now I am out within 20 minutes and I wake up without grogginess.' },
    { n: 'Elena V.', a: 57, c: 'Verona', p: 'multivitamin', t: 'Quality you can feel', b: 'You can tell this is formulated for our age. Fewer capsules than my old brand, better results. Beautiful packaging too.' }
  ];
  $('#reviewTrack').innerHTML = REVIEWS.map(function (r) {
    var p = byId[r.p];
    return '<article class="review"><div class="review__top"><span class="stars">' + starStr + '</span><span class="verified">✓ Verified buyer</span></div>' +
      '<blockquote>“' + r.t + '”</blockquote><p>' + r.b + '</p>' +
      '<div class="review__who"><span class="av">' + r.n[0] + '</span><div><b>' + r.n + '</b><small>' + r.a + ' · ' + r.c + '</small></div>' +
      '<a href="#bestsellers" class="review__prod" data-add="' + p.id + '"><img src="' + p.img + '" alt="">' + (p.short || p.name) + '</a></div></article>';
  }).join('');

  /* ---------- Cart ---------- */
  var STORE = 'h120-cart';
  var state = { lines: [], sub: false };
  try { var saved = JSON.parse(localStorage.getItem(STORE)); if (saved && saved.lines) state = saved; } catch (e) {}
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }

  var cartEl = $('#cart'), overlay = $('#overlay');
  function openCart() { cartEl.classList.add('is-open'); overlay.classList.add('is-open'); cartEl.setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll'); }
  function closeCart() { cartEl.classList.remove('is-open'); overlay.classList.remove('is-open'); cartEl.setAttribute('aria-hidden', 'true'); document.body.classList.remove('no-scroll'); }
  $('#cartOpen').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeCart(); closeMenu(); } });
  cartEl.addEventListener('click', function (e) { if (e.target.closest('[data-close-cart]')) closeCart(); });

  function lineKey(id, disc) { return id + '|' + (disc || 0); }
  function addItem(id, qty, disc, silent) {
    qty = qty || 1; disc = disc || 0;
    var k = lineKey(id, disc);
    var l = state.lines.filter(function (x) { return lineKey(x.id, x.disc) === k; })[0];
    if (l) l.qty += qty; else state.lines.push({ id: id, qty: qty, disc: disc });
    save(); renderCart();
    if (!silent) { openCart(); }
    var c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    setTimeout(function () { c.classList.remove('bump'); }, 300);
  }
  function linePrice(l) {
    var base = byId[l.id].price * l.qty;
    var after = base * (1 - l.disc) * (state.sub ? 0.85 : 1);
    return { base: base, after: after };
  }

  function renderCart() {
    var items = $('#cartItems');
    var count = 0, sub = 0, full = 0;
    items.innerHTML = state.lines.map(function (l, i) {
      var p = byId[l.id], pr = linePrice(l);
      count += l.qty; sub += pr.after; full += pr.base;
      var note = [];
      if (l.disc) note.push('Bundle −' + Math.round(l.disc * 100) + '%');
      if (state.sub) note.push('Subscription −15%');
      return '<li class="ci"><div class="ci__img"><img src="' + p.img + '" alt=""></div>' +
        '<div><h5>' + (p.short || p.name) + '</h5><small>' + p.area + ' · 30-day supply</small>' +
        (note.length ? '<small class="sub-note">' + note.join(' · ') + '</small>' : '') +
        '<div class="qty"><button data-q="-1" data-i="' + i + '" aria-label="Decrease">−</button><span>' + l.qty + '</span><button data-q="1" data-i="' + i + '" aria-label="Increase">+</button></div></div>' +
        '<div class="ci__right"><div>' + (pr.after < pr.base ? '<s>' + euro(pr.base) + '</s>' : '') + '<b>' + euro(pr.after) + '</b></div><button class="ci__rm" data-rm="' + i + '">Remove</button></div></li>';
    }).join('');

    $('#cartCount').textContent = count;
    $('#cartHeadCount').textContent = '(' + count + ')';
    cartEl.classList.toggle('is-empty', count === 0);
    $('#cartSubtotal').textContent = euro(sub);
    $('#cartSavings').textContent = euro(full - sub);
    $('#savingsRow').classList.toggle('show', full - sub > 0.001);
    $('#subToggle').checked = state.sub;

    // Shipping meter: €60 free shipping, €90 free gift
    var pct = sub >= 90 ? 100 : sub >= 60 ? 66.6 + (sub - 60) / 30 * 33.4 : sub / 60 * 66.6;
    $('#shipBar').style.width = pct + '%';
    var meter = $('.ship-meter');
    meter.classList.toggle('done', sub >= 60);
    meter.classList.toggle('done2', sub >= 90);
    $('#shipMsg').innerHTML = sub >= 90 ? '🎉 You unlocked <b>free shipping</b> + a <b>free guide &amp; gift</b>!'
      : sub >= 60 ? '✓ <b>Free shipping</b> unlocked! Add <b>' + euro(90 - sub) + '</b> for a free gift'
      : 'You\'re <b>' + euro(60 - sub) + '</b> away from <b>free shipping</b>';

    // Upsells
    var inCart = state.lines.map(function (l) { return l.id; });
    var recs = [];
    (inCart.length ? inCart : ['damiana', 'multivitamin']).forEach(function (id) {
      (PAIRS[id] || []).forEach(function (r) { if (recs.indexOf(r) < 0 && inCart.indexOf(r) < 0) recs.push(r); });
    });
    ['multivitamin', 'saffron', 'boswellia', 'bacopa', 'melatonin'].forEach(function (r) { if (recs.indexOf(r) < 0 && inCart.indexOf(r) < 0) recs.push(r); });
    $('#upsellTrack').innerHTML = recs.slice(0, 6).map(function (id) {
      var p = byId[id];
      return '<div class="uc"><img src="' + p.img + '" alt=""><b>' + (p.short || p.name) + '</b><small>' + p.benefit + '</small>' +
        '<div class="uc__foot"><span>' + euro(p.price) + '</span><button data-up="' + p.id + '" aria-label="Add ' + p.name + '">+</button></div></div>';
    }).join('');

    var hasDuo = inCart.indexOf('multivitamin') >= 0 && inCart.indexOf('bacopa') >= 0;
    $('#bundleOffer').classList.toggle('is-hidden', hasDuo);
  }

  cartEl.addEventListener('click', function (e) {
    var q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]'), up = e.target.closest('[data-up]');
    if (q) {
      var l = state.lines[+q.dataset.i]; l.qty += +q.dataset.q;
      if (l.qty < 1) state.lines.splice(+q.dataset.i, 1);
      save(); renderCart();
    } else if (rm) {
      state.lines.splice(+rm.dataset.rm, 1); save(); renderCart();
    } else if (up) {
      addItem(up.dataset.up, 1, 0, true); toast(byId[up.dataset.up].name + ' added to your routine');
    }
  });
  $('#subToggle').addEventListener('change', function (e) { state.sub = e.target.checked; save(); renderCart(); });
  $('#bundleAdd').addEventListener('click', function () {
    addItem('multivitamin', 1, 0.15, true); addItem('bacopa', 1, 0.15, true); toast('50+ Essentials duo added — 15% off');
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b || cartEl.contains(b)) return;
    e.preventDefault();
    addItem(b.dataset.add, 1, 0);
  });

  /* ---------- Featured buy box ---------- */
  var featQty = 1;
  function featTotal() {
    var sub = $('input[name="plan"]:checked').value === 'sub';
    var disc = featQty === 2 ? 0.05 : featQty === 3 ? 0.10 : 0;
    return 32 * featQty * (1 - disc) * (sub ? 0.85 : 1);
  }
  function updateFeat() {
    $$('.plan').forEach(function (p) { p.classList.toggle('is-selected', $('input', p).checked); });
    $('#featTotal').textContent = euro(featTotal());
  }
  $$('input[name="plan"]').forEach(function (r) { r.addEventListener('change', updateFeat); });
  $$('.qb').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.qb').forEach(function (x) { x.classList.remove('is-selected'); });
      b.classList.add('is-selected'); featQty = +b.dataset.qty; updateFeat();
    });
  });
  $('#featAdd').addEventListener('click', function () {
    state.sub = $('input[name="plan"]:checked').value === 'sub';
    addItem('damiana', featQty, featQty === 2 ? 0.05 : featQty === 3 ? 0.10 : 0);
  });

  /* ---------- Quiz ---------- */
  var answers = [];
  var QMAP = {
    energy: { m: ['damiana', 'creatine'], f: ['damiana-her', 'creatine'] },
    mind: { m: ['bacopa', 'saffron'], f: ['bacopa', 'saffron'] },
    joints: { m: ['boswellia', 'creatine'], f: ['boswellia', 'creatine'] },
    sleep: { m: ['melatonin', 'saffron'], f: ['melatonin', 'saffron'] },
    heart: { m: ['black-garlic', 'carob'], f: ['black-garlic', 'carob'] },
    mood: { m: ['saffron', 'melatonin'], f: ['saffron', 'damiana-her'] }
  };
  var recIds = [];
  function quizGo(step) {
    $$('.quiz__step').forEach(function (s) { s.classList.toggle('is-active', +s.dataset.step === step); });
    $('#quizBar').style.width = Math.min(100, step * 33.4) + '%';
  }
  $('#quizCard').addEventListener('click', function (e) {
    var b = e.target.closest('.quiz__opts button'); if (!b) return;
    var step = +b.closest('.quiz__step').dataset.step;
    answers[step - 1] = b.dataset.v;
    if (step < 3) { quizGo(step + 1); return; }
    recIds = QMAP[answers[0]][answers[1]].slice();
    if (answers[2] === 'no') recIds.push('multivitamin');
    $('#quizRecs').innerHTML = recIds.map(function (id) {
      var p = byId[id];
      return '<div class="rec"><img src="' + p.img + '" alt=""><div><b>' + (p.short || p.name) + '</b><small>' + p.benefit + '</small></div><span class="price">' + euro(p.price) + '</span></div>';
    }).join('');
    quizGo(4);
  });
  $('#quizAddAll').addEventListener('click', function () {
    recIds.forEach(function (id) { addItem(id, 1, 0.10, true); });
    openCart(); toast('Your routine was added — 10% off');
  });
  $('#quizRestart').addEventListener('click', function () { answers = []; quizGo(1); });

  /* ---------- Header, sticky ATC, announcements ---------- */
  var header = $('#header'), sticky = $('#stickyAtc'), feat = $('#featured'), heroEl = $('.hero');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-solid', y > 40);
    var fr = feat.getBoundingClientRect();
    sticky.classList.toggle('is-visible', y > heroEl.offsetHeight * 0.8 && !(fr.top < window.innerHeight && fr.bottom > 0));
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var ann = $$('#announceTrack p'), ai = 0;
  setInterval(function () {
    var cur = ann[ai]; cur.classList.remove('is-active'); cur.classList.add('is-out');
    setTimeout(function () { cur.classList.remove('is-out'); }, 600);
    ai = (ai + 1) % ann.length; ann[ai].classList.add('is-active');
  }, 4000);

  /* ---------- Mobile menu ---------- */
  var mnav = $('#mnav');
  function closeMenu() { mnav.classList.remove('is-open'); mnav.setAttribute('aria-hidden', 'true'); document.body.classList.remove('no-scroll'); }
  $('#menuOpen').addEventListener('click', function () { mnav.classList.add('is-open'); mnav.setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll'); });
  $('#menuClose').addEventListener('click', closeMenu);
  mnav.addEventListener('click', function (e) { if (e.target === mnav || e.target.closest('.mnav__links a')) closeMenu(); });

  /* ---------- Newsletter ---------- */
  $('#guideForm').addEventListener('submit', function (e) {
    e.preventDefault(); e.target.reset(); toast('Thank you! Your guide is on its way 📖');
  });

  /* ---------- Toast ---------- */
  var tt;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ---------- Reveal + counters ---------- */
  $$('.section-head, .why-card, .journey__steps li, .compare, .feature__gallery, .feature__info, .stat, .guide__grid, .accordion, .quiz__card').forEach(function (el) { el.classList.add('reveal'); });
  function countUp(el) {
    var end = +el.dataset.count, t0 = null; el.textContent = '0';
    function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        var c = en.target.querySelector('[data-count]'); if (c) countUp(c);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
    $$('[data-count]').forEach(function (el) { el.textContent = el.dataset.count; });
  }

  renderCart();
})();
