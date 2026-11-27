/* Know Your Roots · home page concept */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) document.documentElement.classList.add('reduced');

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + n.toFixed(2); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- Products (names, prices and copy from the current store) ---------- */
  var T = { green: '#E6EED3', hot: '#F7E1D3', purple: '#F0E1EC', gold: '#F8E8CC', beet: '#F3DCE2', white: '#FFFFFF' };
  var P = [
    { id: 'garlicdill', name: 'Garlic Dill Pickles', img: 'jar-p1', tint: T.green, heat: 0, cats: ['best', 'pickles'], badge: 'Bestseller',
      desc: 'Mild, crispy, fresh and flavourful. The classic that started it all.', v: [['16 oz', 12.5]] },
    { id: 'ghostly', name: 'Ghostly Fire Pickles', img: 'jar-p48', tint: T.hot, heat: 8, cats: ['best', 'pickles', 'hot'], badge: 'Cult favourite',
      desc: 'A whole ghost pepper in every jar, plus a dusting of ghost pepper powder.', v: [['16 oz', 12.5], ['32 oz', 20.5]] },
    { id: 'spicyg', name: 'Spicy G! Giardiniera', img: 'jar-spicyg', tint: T.white, heat: 5, cats: ['best', 'veg', 'hot'], badge: 'Deli favourite',
      desc: 'A Colorado twist on a Chicago favourite. Denver delis put it on everything.', v: [['16 oz', 12.5]] },
    { id: 'reaper', name: 'Fear the Reaper', img: 'jar-p3', tint: T.hot, heat: 10, cats: ['best', 'pickles', 'hot'], badge: 'Hottest',
      desc: 'Our hottest pickle, made with Carolina Reaper. Consider yourself warned.', v: [['16 oz', 12.5]] },
    { id: 'purple', name: 'Purple-licious Sauerkraut Slaw', img: 'jar-p83', tint: T.purple, heat: 0, cats: ['best', 'ferments'],
      desc: 'Bright, crunchy red-cabbage slaw. Live and naturally fermented.', v: [['16 oz', 12.5]] },
    { id: 'golden', name: 'Golden Goddess Supertonic', img: 'jar-p77', tint: T.gold, heat: 0, cats: ['best', 'tonics'], badge: 'Gut health',
      desc: 'Fermented golden beet kvass. Sip 2 oz a day for a probiotic boost.', v: [['Small', 10.25], ['Large', 22.25]] },
    { id: 'krautchi', name: 'Kraut-chi', img: 'jar-p81', tint: T.gold, heat: 2, cats: ['best', 'ferments'],
      desc: 'Soy-free kimchi meets sauerkraut. Tangy, garlicky and a little warm.', v: [['16 oz', 12.5]] },
    { id: 'habanero', name: 'Habanero Garlic Dill Pickles', img: 'jar-p35', tint: T.hot, heat: 7, cats: ['best', 'pickles', 'hot'],
      desc: 'Our classic garlic dill with a fruity habanero kick.', v: [['16 oz', 12.5]] },
    { id: 'blazin', name: "Blazin' Bread 'n' Butter", img: 'jar-p5', tint: T.gold, heat: 6, cats: ['pickles', 'hot'],
      desc: 'Sweet, tangy bread and butters that bite back.', v: [['16 oz', 12.5]] },
    { id: 'halfsour', name: 'Half Sour Pickles', img: 'jar-p54', tint: T.green, heat: 0, cats: ['pickles', 'ferments'], soldOut: true,
      desc: 'Lacto-fermented, deli-style and super crunchy. This batch sold out fast.', v: [['16 oz', 12.5]] },
    { id: 'lemondill', name: 'Lemon Dill Sauerkraut', img: 'jar-p80', tint: T.green, heat: 0, cats: ['ferments'],
      desc: 'Fresh lemon and dill through a classic live kraut.', v: [['16 oz', 12.5]] },
    { id: 'naked', name: 'Naked Red Supertonic', img: 'jar-p78', tint: T.beet, heat: 0, cats: ['tonics'],
      desc: 'Deep red beet kvass, naturally fermented. Drink 2 oz each day.', v: [['Small', 10.25], ['Large', 22.25]] },
    { id: 'beets', name: 'Maple Ginger Pickled Beets', img: 'jar-p40', tint: T.beet, heat: 0, cats: ['veg'],
      desc: 'Earthy beets with maple sweetness and warm ginger.', v: [['16 oz', 12.5]] },
    { id: 'brussels', name: 'Spicy Pickled Brussels Sprouts', img: 'jar-p14', tint: T.hot, heat: 4, cats: ['veg', 'hot'],
      desc: 'Snappy little sprouts with chilli and garlic. A great snack jar.', v: [['16 oz', 12.5]] },
    { id: 'cauli', name: 'Pickled Cauliflower', img: 'jar-p53', tint: T.green, heat: 0, cats: ['veg'],
      desc: 'Crunchy florets in a bright, garlicky brine.', v: [['16 oz', 12.5]] },
    { id: 'okra', name: 'Pickled Okra', img: 'jar-p8', tint: T.green, heat: 0, cats: ['veg'],
      desc: 'Tender-crisp okra pods. Perfect in a Bloody Mary.', v: [['16 oz', 12.5]] },
    { id: 'frank', name: 'The Frankenstein Jar', img: 'jar-p60', tint: T.beet, heat: 0, cats: ['veg'],
      desc: 'A bit of everything we pickle, all in one big jar.', v: [['32 oz', 20.5]] }
  ];
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });
  var imgSrc = function (p) { return 'images/' + p.img + '.webp'; };

  /* ---------- Discount tiers ---------- */
  var TIERS = [{ q: 12, pct: 20 }, { q: 6, pct: 15 }, { q: 3, pct: 10 }];
  function tierFor(q) { for (var i = 0; i < TIERS.length; i++) if (q >= TIERS[i].q) return TIERS[i]; return null; }
  function nextTier(q) { var n = null; TIERS.forEach(function (t) { if (q < t.q && (!n || t.q < n.q)) n = t; }); return n; }

  /* ---------- Storage (optional) ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };

  /* ---------- Toast ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  /* ---------- Heat meter markup ---------- */
  function heatMeter(h) {
    if (!h) return '';
    var s = '<span class="heatm" aria-label="Heat ' + h + ' out of 10">';
    for (var i = 1; i <= 5; i++) s += '<i class="' + (i * 2 <= h + 1 ? 'on' + (h < 6 ? ' warm' : '') : '') + '"></i>';
    return s + '&nbsp;' + h + '/10</span>';
  }

  /* ---------- Product grid ---------- */
  var grid = $('#productGrid');
  var selVariant = {};
  function card(p) {
    var vi = selVariant[p.id] || 0, price = p.v[vi][1];
    var variants = p.v.length > 1 ? '<div class="variants" role="group" aria-label="Size">' + p.v.map(function (v, i) {
      return '<button type="button" data-variant="' + i + '" aria-pressed="' + (i === vi) + '">' + v[0] + '</button>';
    }).join('') + '</div>' : '';
    var badge = p.soldOut ? '<span class="badge out">Sold out</span>' : p.badge ? '<span class="badge' + (p.heat >= 8 ? ' hot' : '') + '">' + p.badge + '</span>' : '';
    var btn = p.soldOut
      ? '<button class="add notify" type="button" data-notify="' + p.id + '">Notify me</button>'
      : '<button class="add" type="button" data-add="' + p.id + '" aria-label="Add ' + esc(p.name) + ' to cart"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>Add</button>';
    return '<article class="card rv" data-id="' + p.id + '">' +
      '<div class="card-media" style="--tint:' + p.tint + '">' + badge + heatMeter(p.heat) +
      '<img src="' + imgSrc(p) + '" alt="' + esc(p.name) + ' jar" loading="lazy" width="260" height="310"></div>' +
      '<h3>' + esc(p.name) + '</h3><p class="desc">' + esc(p.desc) + '</p>' + variants +
      '<div class="card-foot"><span class="price">' + money(price) + '<small>' + (p.soldOut ? 'Back soon' : 'or ' + money(price * 0.9) + ' in a 3-pack') + '</small></span>' + btn + '</div></article>';
  }
  var currentFilter = 'best';
  function renderGrid(filter) {
    currentFilter = filter;
    var list = P.filter(function (p) { return p.cats.indexOf(filter) > -1; }).slice(0, 8);
    grid.innerHTML = list.map(card).join('');
    if (window.gsap && !reduced) gsap.fromTo(grid.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, stagger: .05, ease: 'power3.out' });
    else $$('.rv', grid).forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
  }
  $('#tabs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter]'); if (!b) return;
    $$('#tabs [role=tab]').forEach(function (t) { t.setAttribute('aria-selected', t === b); });
    renderGrid(b.dataset.filter);
  });
  grid.addEventListener('click', function (e) {
    var vb = e.target.closest('[data-variant]');
    if (vb) {
      var c = vb.closest('.card'), id = c.dataset.id;
      selVariant[id] = +vb.dataset.variant;
      var tmp = document.createElement('div'); tmp.innerHTML = card(byId[id]);
      var fresh = tmp.firstChild; fresh.style.opacity = 1; fresh.style.transform = 'none';
      c.replaceWith(fresh); return;
    }
    var ab = e.target.closest('[data-add]');
    if (ab) { addToCart(ab.dataset.add, selVariant[ab.dataset.add] || 0, 1, ab.closest('.card').querySelector('img'), ab); return; }
    var nb = e.target.closest('[data-notify]');
    if (nb) openNotify(byId[nb.dataset.notify]);
  });

  /* ---------- Cart ---------- */
  var cart = store.get('kyr-cart', []);
  cart = cart.filter(function (l) { return byId[l.id] && byId[l.id].v[l.v]; });
  var cartEl = $('#cart'), scrim = $('#scrim'), lastFocus;
  var zipState = store.get('kyr-zip', null);

  function lineKey(id, v) { return id + ':' + v; }
  function totals() {
    var qty = 0, sub = 0;
    cart.forEach(function (l) { var p = byId[l.id]; qty += l.q; sub += p.v[l.v][1] * l.q; });
    var t = tierFor(qty), disc = t ? sub * t.pct / 100 : 0;
    return { qty: qty, sub: sub, tier: t, disc: disc, total: sub - disc };
  }
  function addToCart(id, v, q, imgEl, btn) {
    var p = byId[id]; if (!p || p.soldOut) return;
    var before = totals().tier;
    var k = lineKey(id, v), line = cart.filter(function (l) { return lineKey(l.id, l.v) === k; })[0];
    if (line) line.q += q; else cart.push({ id: id, v: v, q: q });
    save(); renderCart();
    if (btn) { var html = btn.innerHTML; btn.classList.add('done'); btn.innerHTML = '✓ Added'; setTimeout(function () { btn.classList.remove('done'); btn.innerHTML = html; }, 1300); }
    var after = totals().tier;
    if (imgEl) flyTo(imgEl);
    if (after && (!before || after.pct > before.pct)) toast('Nice! You just unlocked ' + after.pct + '% off 🎉');
    if (!cartEl.classList.contains('open')) setTimeout(openCart, imgEl && !reduced ? 650 : 0);
  }
  function save() { store.set('kyr-cart', cart); }
  function flyTo(imgEl) {
    if (!window.gsap || reduced) return;
    var target = window.innerWidth <= 920 && $('#stickyCta').classList.contains('show') ? $('#stickyCta [data-open-cart]') : $('#cartBtn');
    var a = imgEl.getBoundingClientRect(), b = target.getBoundingClientRect();
    var f = document.createElement('img'); f.src = imgEl.src; f.className = 'fly'; f.alt = '';
    f.style.left = (a.left + a.width / 2 - 30) + 'px'; f.style.top = (a.top + a.height / 2 - 40) + 'px';
    document.body.appendChild(f);
    gsap.to(f, { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: .3, rotation: 20, duration: .65, ease: 'power2.in', onComplete: function () { f.remove(); } });
  }
  function upsells() {
    var inCart = {}; cart.forEach(function (l) { inCart[l.id] = 1; });
    var hasHot = cart.some(function (l) { return byId[l.id].heat >= 5; });
    var hasFerment = cart.some(function (l) { return byId[l.id].cats.indexOf('ferments') > -1; });
    var hasTonic = cart.some(function (l) { return byId[l.id].cats.indexOf('tonics') > -1; });
    var order = [];
    if (hasHot) order.push('ghostly', 'habanero', 'reaper', 'spicyg', 'brussels');
    if (!hasFerment) order.push('krautchi', 'purple');
    if (!hasTonic) order.push('golden');
    order.push('garlicdill', 'spicyg', 'beets', 'okra', 'frank', 'lemondill', 'naked');
    var out = [];
    order.forEach(function (id) { if (!inCart[id] && out.indexOf(id) < 0 && !byId[id].soldOut) out.push(id); });
    return out.slice(0, 3);
  }
  function renderCart() {
    var t = totals();
    $('#cartCount').textContent = t.qty; $('#stickyCount').textContent = t.qty;
    $('#cartHeadCount').textContent = '(' + t.qty + (t.qty === 1 ? ' jar)' : ' jars)');
    $('#cartBtn').setAttribute('aria-label', 'Open cart, ' + t.qty + ' items');
    var cc = $('#cartCount'); cc.classList.remove('bump'); void cc.offsetWidth; cc.classList.add('bump');
    cartEl.classList.toggle('empty', t.qty === 0);

    // tier progress
    var nt = nextTier(t.qty), msg;
    if (!t.tier) msg = 'Add <b>' + (3 - t.qty) + ' more jar' + (3 - t.qty === 1 ? '' : 's') + '</b> to save 10%';
    else if (nt) msg = 'You\'re saving <b>' + t.tier.pct + '%</b>. Add ' + (nt.q - t.qty) + ' more to save ' + nt.pct + '%';
    else msg = '🎉 Max saving unlocked: <b>20% off</b> everything';
    $('#cartTierMsg').innerHTML = msg;
    $('#cartTierBar').style.width = Math.min(100, t.qty / 12 * 100) + '%';
    $$('.tier-bar i').forEach(function (i) { i.classList.toggle('hit', t.qty >= +i.dataset.t); });

    $('#cartItems').innerHTML = cart.map(function (l) {
      var p = byId[l.id], price = p.v[l.v][1] * l.q, d = t.tier ? price * (1 - t.tier.pct / 100) : price;
      return '<li class="ci" data-key="' + lineKey(l.id, l.v) + '"><div class="ci-img" style="--tint:' + p.tint + '"><img src="' + imgSrc(p) + '" alt=""></div>' +
        '<div><h4>' + esc(p.name) + '</h4><small>' + p.v[l.v][0] + (p.heat ? ' · heat ' + p.heat + '/10' : '') + '</small><br>' +
        '<span class="ci-qty"><button type="button" data-dec aria-label="Decrease quantity">−</button><span>' + l.q + '</span><button type="button" data-inc aria-label="Increase quantity">+</button></span></div>' +
        '<div class="ci-right"><b>' + money(d) + '</b>' + (t.tier ? '<s>' + money(price) + '</s>' : '') + '<button type="button" class="ci-remove" data-rm>Remove</button></div></li>';
    }).join('');

    var ups = upsells();
    $('#upsell').style.display = ups.length ? '' : 'none';
    $('#upsell h3').textContent = t.qty ? 'Pairs perfectly with' : 'Our bestsellers';
    $('#upsellRow').innerHTML = ups.map(function (id) {
      var p = byId[id];
      return '<div class="up"><img src="' + imgSrc(p) + '" alt="" loading="lazy"><b>' + esc(p.name) + '</b><small>' + money(p.v[0][1]) + '</small><button type="button" data-up="' + id + '">+ Add</button></div>';
    }).join('');

    $('#cSub').textContent = money(t.sub);
    $('#cDiscRow').hidden = !t.tier;
    if (t.tier) { $('#cDiscLabel').textContent = 'Multi-buy saving (' + t.tier.pct + '%)'; $('#cDisc').textContent = '-' + money(t.disc); }
    $('#cShip').textContent = zipState === true ? 'FREE local delivery' : zipState === false ? 'Flat rate at checkout' : 'Enter ZIP below';
    $('#cTotal').textContent = money(t.total);
  }
  $('#cartItems').addEventListener('click', function (e) {
    var li = e.target.closest('.ci'); if (!li) return;
    var k = li.dataset.key, idx = -1;
    cart.forEach(function (l, i) { if (lineKey(l.id, l.v) === k) idx = i; });
    if (idx < 0) return;
    if (e.target.closest('[data-inc]')) cart[idx].q++;
    else if (e.target.closest('[data-dec]')) { cart[idx].q--; if (!cart[idx].q) cart.splice(idx, 1); }
    else if (e.target.closest('[data-rm]')) cart.splice(idx, 1);
    else return;
    save(); renderCart();
  });
  $('#upsellRow').addEventListener('click', function (e) {
    var b = e.target.closest('[data-up]'); if (!b) return;
    addToCart(b.dataset.up, 0, 1, null, null);
    toast(byId[b.dataset.up].name + ' added');
  });

  function openCart() {
    lastFocus = document.activeElement;
    scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.add('show'); });
    cartEl.classList.add('open'); cartEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { $('#cartClose').focus({ preventScroll: true }); }, 50);
  }
  function closeCart() {
    scrim.classList.remove('show'); cartEl.classList.remove('open'); cartEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () { scrim.hidden = true; }, 400);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $('#cartBtn').addEventListener('click', openCart);
  $$('[data-open-cart]').forEach(function (b) { b.addEventListener('click', openCart); });
  $('#cartClose').addEventListener('click', closeCart);
  scrim.addEventListener('click', closeCart);
  cartEl.addEventListener('click', function (e) { if (e.target.closest('[data-close-cart]')) closeCart(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cartEl.classList.contains('open')) closeCart();
    if (e.key === 'Tab' && cartEl.classList.contains('open')) {
      var f = $$('button, a[href], input', cartEl).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  $('#checkoutBtn').addEventListener('click', function () { toast('Prototype: this opens Shopify\'s secure checkout'); });

  /* ---------- ZIP checker (Denver Metro + ~20 mi of Longmont; edit list when confirmed) ---------- */
  function zipFree(z) {
    if (!/^\d{5}$/.test(z)) return null;
    var p3 = z.slice(0, 3), p4 = z.slice(0, 4);
    if (['800', '801', '802', '803'].indexOf(p3) > -1) return true;
    if (['8050', '8051', '8053', '8054', '8060', '8061', '8062', '8064'].indexOf(p4) > -1) return true;
    return false;
  }
  function bindZip(form, input, out) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var r = zipFree(input.value.trim());
      out.className = 'zip-result';
      if (r === null) { out.textContent = 'Please enter a 5-digit ZIP code.'; out.classList.add('no'); return; }
      zipState = r; store.set('kyr-zip', r);
      out.textContent = r ? '✓ Good news! Delivery to ' + input.value + ' is FREE.' : 'We\'ll ship to ' + input.value + ' at a flat rate. Or find us at a market!';
      out.classList.add(r ? 'ok' : 'no');
      ['#zipInput', '#cartZip'].forEach(function (s) { $(s).value = input.value; });
      renderCart();
    });
  }
  bindZip($('#zipForm'), $('#zipInput'), $('#zipResult'));
  bindZip($('#cartZipForm'), $('#cartZip'), $('#cartZipResult'));
  $$('[data-open-zip]').forEach(function (b) {
    b.addEventListener('click', function () { $('#find').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); setTimeout(function () { $('#zipInput').focus({ preventScroll: true }); }, 700); });
  });

  /* ---------- Bundle builder ---------- */
  var box = [];
  var pickIds = ['garlicdill', 'ghostly', 'spicyg', 'purple', 'krautchi', 'habanero', 'golden', 'beets', 'reaper', 'brussels', 'okra', 'cauli'];
  $('#pickGrid').innerHTML = pickIds.map(function (id) {
    var p = byId[id];
    return '<button class="pick" type="button" data-pick="' + id + '" aria-label="Add ' + esc(p.name) + ' to box"><span class="qty"></span><img src="' + imgSrc(p) + '" alt="" loading="lazy">' + esc(p.name) + '</button>';
  }).join('');
  function renderBox() {
    var q = box.length, t = tierFor(q), nt = nextTier(q);
    $('#boxBar').style.width = Math.min(100, q / 12 * 100) + '%';
    $$('#tiers li').forEach(function (li) { li.classList.toggle('hit', t && +li.dataset.tier === t.q); });
    var sub = box.reduce(function (s, id) { return s + byId[id].v[0][1]; }, 0);
    var msg = !q ? 'Add 3 jars to unlock 10% off'
      : !t ? q + ' in your box. Add ' + (3 - q) + ' more to unlock 10% off'
        : q + ' jars · you save ' + money(sub * t.pct / 100) + (nt ? '. Add ' + (nt.q - q) + ' more for ' + nt.pct + '% off' : '. Maximum saving!');
    $('#boxMsg').textContent = msg;
    var slots = '', n = Math.max(q, nt ? nt.q : 12);
    for (var i = 0; i < Math.min(n, 12); i++) {
      slots += box[i] ? '<div class="slot"><img src="' + imgSrc(byId[box[i]]) + '" alt="' + esc(byId[box[i]].name) + '"><button type="button" data-unbox="' + i + '" aria-label="Remove ' + esc(byId[box[i]].name) + ' from box"></button></div>' : '<div class="slot" aria-hidden="true"></div>';
    }
    $('#boxSlots').innerHTML = slots;
    var counts = {}; box.forEach(function (id) { counts[id] = (counts[id] || 0) + 1; });
    $$('.pick').forEach(function (b) { var c = counts[b.dataset.pick] || 0; b.classList.toggle('has', c > 0); $('.qty', b).textContent = c; b.disabled = q >= 12; });
    var add = $('#boxAdd'); add.disabled = q === 0;
    add.textContent = q ? 'Add box to cart · ' + money(sub - (t ? sub * t.pct / 100 : 0)) : 'Add box to cart';
  }
  $('#pickGrid').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pick]'); if (!b || box.length >= 12) return;
    box.push(b.dataset.pick); renderBox();
    if (window.gsap && !reduced) { var s = $$('.slot', $('#boxSlots'))[box.length - 1]; if (s) gsap.from(s, { scale: .4, opacity: 0, duration: .4, ease: 'back.out(2)' }); }
  });
  $('#boxSlots').addEventListener('click', function (e) { var b = e.target.closest('[data-unbox]'); if (b) { box.splice(+b.dataset.unbox, 1); renderBox(); } });
  $('#boxClear').addEventListener('click', function () { box = []; renderBox(); });
  $('#boxAdd').addEventListener('click', function () {
    if (!box.length) return;
    var before = totals().tier;
    box.forEach(function (id) {
      var k = lineKey(id, 0), line = cart.filter(function (l) { return lineKey(l.id, l.v) === k; })[0];
      if (line) line.q++; else cart.push({ id: id, v: 0, q: 1 });
    });
    var n = box.length; box = []; save(); renderBox(); renderCart();
    var after = totals().tier;
    toast(n + ' jars added' + (after && (!before || after.pct > before.pct) ? ', ' + after.pct + '% off unlocked 🎉' : ''));
    openCart();
  });
  renderBox();

  /* ---------- Heat finder ---------- */
  var heatPool = ['garlicdill', 'krautchi', 'brussels', 'spicyg', 'blazin', 'habanero', 'ghostly', 'reaper'];
  function renderHeat(v) {
    $('#heatVal').textContent = v;
    var best = heatPool[0], d = 99;
    heatPool.forEach(function (id) { var dd = Math.abs(byId[id].heat - v); if (dd < d) { d = dd; best = id; } });
    var p = byId[best];
    var tag = v <= 1 ? 'Mild & tangy pick' : v <= 4 ? 'A gentle warmth' : v <= 7 ? 'Proper kick' : v <= 9 ? 'Serious heat' : 'Only for the brave';
    $('#heatCard').innerHTML = '<div class="hc-img" style="--tint:' + p.tint + '"><img src="' + imgSrc(p) + '" alt="' + esc(p.name) + ' jar"></div>' +
      '<div><span class="hc-tag">' + tag + ' · heat ' + p.heat + '/10</span><h3>' + esc(p.name) + '</h3><p>' + esc(p.desc) + '</p>' +
      '<button class="btn btn-primary" type="button" data-add-heat="' + p.id + '">Add to cart · ' + money(p.v[0][1]) + '</button></div>';
  }
  var hr = $('#heatRange');
  hr.addEventListener('input', function () { renderHeat(+hr.value); });
  $('#heatCard').addEventListener('click', function (e) { var b = e.target.closest('[data-add-heat]'); if (b) addToCart(b.dataset.addHeat, 0, 1, $('#heatCard img'), null); });
  renderHeat(+hr.value);

  /* ---------- Stockists ---------- */
  var SHOPS = [
    ['Leevers Locavore', '2630 W 38th Ave, Denver'], ['The Little Bodega', '613 22nd St, Denver'], ['Sunmarket', '2201 Lafayette, Denver'],
    ['Homestead in the Hood', '1385 Carr St, Lakewood'], ['Littleton Meats', '3615 W Bowles, Littleton'],
    ['All Bjorn\'s Colorado Honey stores', 'DIA, Golden, Boulder, Ft. Collins, Aspen Grove, Steamboat, Breckenridge, Vail'],
    ['Lucky\'s Market', '3960 Broadway, Boulder'], ['East &amp; Co', '2100 Central Ave, Boulder'], ['Cheese Importers', '103 Main St, Longmont'],
    ['Local Goods Colorado', '409 S Public Rd, Lafayette'], ['The Mountain Fountain', '11809 N 75th St, Hygiene'], ['Niwot Market', '7980 Niwot Rd, Niwot'],
    ['Your Butcher Frank', '900 Coffman, Longmont'], ['The Rancher\'s Wife', '600 Third St, Berthoud'], ['The Cupboard', '152 S College, Fort Collins'],
    ['The Warehouse Urban Grocer', '29 W Cimarron St, Colorado Springs'], ['Blackfox Provisions', '27780 Hwy-74, Evergreen'],
    ['Mountain Market &amp; Supply', '112 West 2nd St, Eagle'], ['Gunnison Jerky', '235 N Main St, Gunnison'],
    ['Colorado Bagel Westside Market &amp; Deli', '2851 Riverside Plz, Steamboat Springs']
  ];
  function renderShops(q) {
    q = (q || '').toLowerCase().trim();
    var list = SHOPS.filter(function (s) { return !q || (s[0] + ' ' + s[1]).toLowerCase().indexOf(q) > -1; });
    $('#shopList').innerHTML = list.length ? list.map(function (s) { return '<li><b>' + s[0] + '</b><small>' + s[1] + '</small></li>'; }).join('')
      : '<li class="none">No shop there yet. Try free delivery, or ask your local shop to stock us!</li>';
  }
  $('#shopSearch').addEventListener('input', function (e) { renderShops(e.target.value); });
  renderShops('');
  $('#marqueeTrack').innerHTML = (function () {
    var names = SHOPS.map(function (s) { return '<span>' + s[0].replace(' stores', '') + '</span>'; }).join('');
    return names + names;
  })();
  $('#marqueeTrack').setAttribute('aria-hidden', 'true');

  /* ---------- Pairings ---------- */
  var U = function (id) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=700&q=70'; };
  var PAIRS = [
    { t: 'The smash burger upgrade', d: 'Two thick Garlic Dill coins and a splash of brine in the sauce. Game over.', img: U('1550547660-d9450f859349'), p: 'garlicdill' },
    { t: 'Denver deli sandwich', d: 'How The Little Bodega does it: a heap of Spicy G! on a toasted sub.', img: U('1553909489-cd47e0907980'), p: 'spicyg' },
    { t: 'Lesley\'s grilled cheese night', d: 'Sourdough, sharp cheddar, pickles on the side and a glass of Naked Red.', img: 'images/grilled.webp', p: 'naked' },
    { t: 'The gut-happy grain bowl', d: 'Finish any bowl with a forkful of Kraut-chi for crunch, tang and probiotics.', img: U('1546069901-ba9599a7e63c'), p: 'krautchi' }
  ];
  $('#pairRow').innerHTML = PAIRS.map(function (x) {
    var p = byId[x.p];
    return '<article class="pair rv"><div class="pair-img"><img src="' + x.img + '" alt="' + esc(x.t) + '" loading="lazy" width="700" height="595"></div><div class="pair-body"><h3>' + esc(x.t) + '</h3><p>' + esc(x.d) + '</p>' +
      '<button class="pair-jar" type="button" data-add-pair="' + p.id + '"><img src="' + imgSrc(p) + '" alt=""><span>' + esc(p.name) + '<br><small>' + money(p.v[0][1]) + '</small></span><em aria-hidden="true">+</em><span class="sr">Add to cart</span></button></div></article>';
  }).join('');
  $('#pairRow').addEventListener('click', function (e) { var b = e.target.closest('[data-add-pair]'); if (b) addToCart(b.dataset.addPair, 0, 1, $('img', b), null); });

  /* Review link → filter to that product */
  $$('[data-scroll-product]').forEach(function (a) {
    a.addEventListener('click', function () { var b = $('#tabs [data-filter="best"]'); if (b) b.click(); });
  });

  /* ---------- Notify modal ---------- */
  var modal = $('#notifyModal'), notifyFor;
  function openNotify(p) {
    notifyFor = p; $('#notifyText').textContent = p.name + ' sold out. We\'ll email you the moment the next batch is ready.';
    if (modal.showModal) modal.showModal(); else toast('We\'ll let you know when it\'s back');
  }
  modal.addEventListener('close', function () {
    if (modal.returnValue === 'ok' && notifyFor) toast('You\'re on the list for ' + notifyFor.name);
    $('#notifyEmail').value = '';
  });

  /* ---------- Club form ---------- */
  $('#clubForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('#clubEmail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { $('#clubMsg').textContent = 'Please enter a valid email address.'; return; }
    $('#clubMsg').textContent = 'Welcome to the club! Your 10% code is on its way: PICKLECLUB10';
    $('#clubEmail').value = '';
  });

  /* ---------- Announcement rotator ---------- */
  var ann = $$('#announceTrack p'), ai = 0;
  ann[0].classList.add('on');
  if (ann.length > 1) setInterval(function () {
    if (document.querySelector('.announce:hover, .announce:focus-within')) return;
    var cur = ann[ai]; cur.classList.remove('on'); cur.classList.add('off');
    setTimeout(function () { cur.classList.remove('off'); }, 650);
    ai = (ai + 1) % ann.length; ann[ai].classList.add('on');
  }, 4200);

  /* ---------- Header / mobile nav / sticky CTA ---------- */
  var header = $('#header'), sticky = $('#stickyCta'), heroEl = $('.hero');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 10);
    var show = y > heroEl.offsetTop + heroEl.offsetHeight - 100;
    sticky.classList.toggle('show', show);
    sticky.setAttribute('aria-hidden', !show);
    $$('a,button', sticky).forEach(function (el) { el.tabIndex = show ? 0 : -1; });
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var menuBtn = $('#menuBtn'), mnav = $('#mobileNav');
  menuBtn.addEventListener('click', function () {
    var open = mnav.hidden; mnav.hidden = !open; menuBtn.setAttribute('aria-expanded', open);
  });
  mnav.addEventListener('click', function (e) { if (e.target.closest('a')) { mnav.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); } });

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Designer notes ---------- */
  var notesBtn = $('#notesToggle'), n = 0;
  $$('[data-note]').forEach(function (sec) {
    var parts = sec.getAttribute('data-note').split('|');
    var d = document.createElement('aside'); d.className = 'dnote';
    d.innerHTML = '<b><i>' + (++n) + '</i>' + esc(parts[0]) + '</b>' + esc(parts[1] || '');
    sec.appendChild(d);
  });
  function setNotes(on) {
    document.body.classList.toggle('notes-on', on);
    notesBtn.setAttribute('aria-pressed', on);
    $('.nt-label', notesBtn).textContent = on ? 'Hide design notes' : 'Why it\'s designed this way';
  }
  notesBtn.addEventListener('click', function () { setNotes(!document.body.classList.contains('notes-on')); });
  if (/[?&]notes=1/.test(location.search)) setNotes(true);

  /* ---------- Initial render ---------- */
  renderGrid('best');
  renderCart();

  /* ---------- Motion (GSAP) ---------- */
  function motion() {
    var rvs = $$('.rv');
    if (!window.gsap || reduced) { rvs.forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; }); return; }
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero-title .line', { yPercent: 110, opacity: 0, duration: 1, stagger: .1 })
      .from('.eyebrow, .hero-sub, .hero-ctas, .hero-trust', { y: 24, opacity: 0, duration: .8, stagger: .08 }, '-=.7')
      .from('.hero-blob', { scale: .6, opacity: 0, duration: 1.1 }, 0.1)
      .from('.jar', { y: 120, opacity: 0, duration: 1.1, stagger: .12 }, 0.25)
      .from('.float-card, .stamp', { scale: .6, opacity: 0, duration: .7, stagger: .1, ease: 'back.out(1.8)' }, '-=.5');
    gsap.to('.jar-a', { y: -14, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to('.jar-b', { y: -20, duration: 3.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: .4 });
    gsap.to('.jar-c', { y: -12, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: .8 });
    gsap.to('.float-card', { y: -8, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: .6 });
    if (!window.ScrollTrigger) { rvs.forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; }); return; }
    gsap.to('.hero-art', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    $$('.section .sec-head, .pillar, .quote, .find-card, .story-copy, .story-media, .bundle-copy, .bundle-pick, .heat-card, .accordion, .compare, .club-in > *').forEach(function (el) { el.classList.add('rv'); });
    ScrollTrigger.batch('.rv:not(.card)', {
      start: 'top 88%', once: true,
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out' }); }
    });
    gsap.from('.story-badge', { rotate: -40, scale: .5, opacity: 0, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.story', start: 'top 70%' } });
    // magnetic primary CTA
    $$('.magnetic').forEach(function (b) {
      b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4 }); });
      b.addEventListener('mouseleave', function () { gsap.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' }); });
    });
  }
  if (document.readyState === 'complete') motion(); else window.addEventListener('load', motion);
  // safety net: never leave content hidden
  setTimeout(function () { $$('.rv').forEach(function (el) { if (getComputedStyle(el).opacity === '0' && !window.ScrollTrigger) { el.style.opacity = 1; el.style.transform = 'none'; } }); }, 3000);
})();
