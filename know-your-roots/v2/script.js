/* Know Your Roots · Version 2 */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) document.documentElement.classList.add('reduced');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + n.toFixed(2); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var IMG = '../images/';

  /* ---------- Products (names, prices and copy from the current store) ---------- */
  var T = { green: '#E9EFD3', hot: '#F6E2D4', purple: '#F1E2EC', gold: '#F7EBD3', beet: '#F2DEE3', white: '#FFFFFF' };
  var P = [
    { id: 'garlicdill', name: 'Garlic Dill Pickles', img: 'jar-p1', tint: T.green, stage: '#D6E79A', heat: 0, cats: ['best', 'pickles'], badge: 'Bestseller', kicker: 'Our #1 seller',
      desc: 'Mild, crispy, fresh and flavourful. The classic that started it all.', v: [['16 oz', 12.5]] },
    { id: 'ghostly', name: 'Ghostly Fire Pickles', img: 'jar-p48', tint: T.hot, stage: '#F4C463', heat: 8, cats: ['best', 'pickles', 'hot'], badge: 'Cult favourite', kicker: 'For heat lovers',
      desc: 'A whole ghost pepper in every jar, plus a dusting of ghost pepper powder.', v: [['16 oz', 12.5], ['32 oz', 20.5]] },
    { id: 'spicyg', name: 'Spicy G! Giardiniera', img: 'jar-spicyg', tint: T.white, heat: 5, cats: ['best', 'veg', 'hot'], badge: 'Deli favourite',
      desc: 'A Colorado twist on a Chicago favourite. Denver delis put it on everything.', v: [['16 oz', 12.5]] },
    { id: 'reaper', name: 'Fear the Reaper', img: 'jar-p3', tint: T.hot, stage: '#F0A35E', heat: 10, cats: ['best', 'pickles', 'hot'], badge: 'Hottest', kicker: 'Our hottest jar',
      desc: 'Our hottest pickle, made with Carolina Reaper. Consider yourself warned.', v: [['16 oz', 12.5]] },
    { id: 'purple', name: 'Purple-licious Sauerkraut Slaw', img: 'jar-p83', tint: T.purple, stage: '#EBB5CF', heat: 0, cats: ['best', 'ferments'], kicker: 'Live & fermented',
      desc: 'Bright, crunchy red-cabbage slaw. Live and naturally fermented.', v: [['16 oz', 12.5]] },
    { id: 'golden', name: 'Golden Goddess Supertonic', img: 'jar-p77', tint: T.gold, stage: '#F5D08F', heat: 0, cats: ['best', 'tonics'], badge: 'Gut health', kicker: 'Sip 2 oz a day',
      desc: 'Fermented golden beet kvass. Sip 2 oz a day for a probiotic boost.', v: [['Small', 10.25], ['Large', 22.25]] },
    { id: 'krautchi', name: 'Kraut-chi', img: 'jar-p81', tint: T.gold, heat: 2, cats: ['best', 'ferments'],
      desc: 'Soy-free kimchi meets sauerkraut. Tangy, garlicky and a little warm.', v: [['16 oz', 12.5]] },
    { id: 'habanero', name: 'Habanero Garlic Dill', img: 'jar-p35', tint: T.hot, heat: 7, cats: ['best', 'pickles', 'hot'],
      desc: 'Our classic garlic dill with a fruity habanero kick.', v: [['16 oz', 12.5]] },
    { id: 'blazin', name: "Blazin' Bread 'n' Butter", img: 'jar-p5', tint: T.gold, heat: 6, cats: ['pickles', 'hot'],
      desc: 'Sweet, tangy bread and butters that bite back.', v: [['16 oz', 12.5]] },
    { id: 'halfsour', name: 'Half Sour Pickles', img: 'jar-p54', tint: T.green, heat: 0, cats: ['pickles', 'ferments'], soldOut: true,
      desc: 'Lacto-fermented, deli-style and super crunchy. Sold out fast.', v: [['16 oz', 12.5]] },
    { id: 'lemondill', name: 'Lemon Dill Sauerkraut', img: 'jar-p80', tint: T.green, heat: 0, cats: ['ferments'],
      desc: 'Fresh lemon and dill through a classic live kraut.', v: [['16 oz', 12.5]] },
    { id: 'naked', name: 'Naked Red Supertonic', img: 'jar-p78', tint: T.beet, heat: 0, cats: ['tonics'],
      desc: 'Deep red beet kvass, naturally fermented. Drink 2 oz each day.', v: [['Small', 10.25], ['Large', 22.25]] },
    { id: 'beets', name: 'Maple Ginger Pickled Beets', img: 'jar-p40', tint: T.beet, heat: 0, cats: ['veg'],
      desc: 'Earthy beets with maple sweetness and warm ginger.', v: [['16 oz', 12.5]] },
    { id: 'brussels', name: 'Spicy Brussels Sprouts', img: 'jar-p14', tint: T.hot, heat: 4, cats: ['veg', 'hot'],
      desc: 'Snappy little sprouts with chilli and garlic. A great snack jar.', v: [['16 oz', 12.5]] },
    { id: 'cauli', name: 'Pickled Cauliflower', img: 'jar-p53', tint: T.green, heat: 0, cats: ['veg'],
      desc: 'Crunchy florets in a bright, garlicky brine.', v: [['16 oz', 12.5]] },
    { id: 'okra', name: 'Pickled Okra', img: 'jar-p8', tint: T.green, heat: 0, cats: ['veg'],
      desc: 'Tender-crisp okra pods. Perfect in a Bloody Mary.', v: [['16 oz', 12.5]] },
    { id: 'frank', name: 'The Frankenstein Jar', img: 'jar-p60', tint: T.beet, heat: 0, cats: ['veg'],
      desc: 'A bit of everything we pickle, all in one big jar.', v: [['32 oz', 20.5]] }
  ];
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });
  var src = function (p) { return IMG + p.img + '.webp'; };
  var heatLabel = function (h) { return h === 0 ? 'Mild' : '🌶 ' + h + '/10'; };

  var TIERS = [{ q: 12, pct: 20 }, { q: 6, pct: 15 }, { q: 3, pct: 10 }];
  function tierFor(q) { for (var i = 0; i < TIERS.length; i++) if (q >= TIERS[i].q) return TIERS[i]; return null; }
  function nextTier(q) { var n = null; TIERS.forEach(function (t) { if (q < t.q && (!n || t.q < n.q)) n = t; }); return n; }

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };
  var toastEl = $('#toast'), toastT;
  function toast(m) { var ce = document.getElementById('cart'); if (ce && ce.classList.contains('open')) return; toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2600); }

  /* ---------- Hero stage ---------- */
  var heroIds = ['garlicdill', 'ghostly', 'purple', 'golden', 'reaper'];
  var hi = 0, heroTimer, heroTween, HERO_MS = 5200;
  $('#heroThumbs').innerHTML = heroIds.map(function (id, i) {
    var p = byId[id];
    return '<button class="thumb" role="tab" type="button" aria-selected="' + (i === 0) + '" aria-label="' + esc(p.name) + '" data-hero="' + i + '"><img src="' + src(p) + '" alt=""><span class="bar"><i></i></span></button>';
  }).join('');
  function setHero(i, animate) {
    hi = i; var p = byId[heroIds[i]];
    $('#stage').style.setProperty('--stage', p.stage);
    $('#stage').style.backgroundColor = p.stage;
    var jar = $('#heroJar');
    var swap = function () {
      jar.src = src(p); jar.alt = p.name + ' jar';
      $('#heroKicker').textContent = p.kicker || 'Bestseller';
      $('#heroName').textContent = p.name;
      $('#heroDesc').textContent = p.desc;
      $('#heroPrice').textContent = money(p.v[0][1]);
      $('#heroHeat').textContent = heatLabel(p.heat);
    };
    if (animate && window.gsap && !reduced) {
      gsap.timeline()
        .to(jar, { y: -40, opacity: 0, rotate: -6, duration: .35, ease: 'power2.in' })
        .to('#heroCard > *', { opacity: 0, y: -8, duration: .2, stagger: .02 }, 0)
        .add(swap)
        .fromTo(jar, { y: 60, opacity: 0, rotate: 6 }, { y: 0, opacity: 1, rotate: 0, duration: .8, ease: 'power3.out' })
        .to('#heroCard > *', { opacity: 1, y: 0, duration: .45, stagger: .04, ease: 'power3.out' }, '-=.6');
    } else swap();
    $$('.thumb').forEach(function (t, k) { t.setAttribute('aria-selected', k === i); $('.bar i', t).style.width = '0'; });
    runBar();
  }
  function runBar() {
    clearTimeout(heroTimer);
    if (heroTween) heroTween.kill();
    if (reduced || !window.gsap) return;
    var bar = $('.thumb[aria-selected="true"] .bar i');
    heroTween = gsap.fromTo(bar, { width: '0%' }, { width: '100%', duration: HERO_MS / 1000, ease: 'none', onComplete: function () { setHero((hi + 1) % heroIds.length, true); } });
  }
  $('#heroThumbs').addEventListener('click', function (e) { var b = e.target.closest('[data-hero]'); if (b) setHero(+b.dataset.hero, true); });
  var stageEl = $('#stage');
  stageEl.addEventListener('mouseenter', function () { if (heroTween) heroTween.pause(); });
  stageEl.addEventListener('mouseleave', function () { if (heroTween) heroTween.resume(); });
  $('#heroAdd').addEventListener('click', function (e) { addToCart(heroIds[hi], 0, 1, $('#heroJar'), e.currentTarget); });

  /* ---------- Product grid ---------- */
  var grid = $('#productGrid'), selV = {};
  function card(p) {
    var vi = selV[p.id] || 0, price = p.v[vi][1];
    var tag = p.soldOut ? '<span class="pc-tag dark">Sold out</span>' : p.badge ? '<span class="pc-tag">' + p.badge + '</span>' : '';
    var heat = p.heat ? '<span class="pc-heat" aria-label="Heat ' + p.heat + ' of 10">🌶 ' + p.heat + '</span>' : '';
    var btn = p.soldOut ? '<button type="button" class="pc-quick notify" data-notify="' + p.id + '"><span class="pq-l">Notify me when back</span><span class="pq-s">Notify me</span></button>'
      : '<button type="button" class="pc-quick" data-add="' + p.id + '" aria-label="Add ' + esc(p.name) + ' to basket"><span class="pq-l">Add to basket · ' + money(price) + '</span><span class="pq-s">+ Add</span></button>';
    var vars = p.v.length > 1 ? '<div class="pc-var" role="group" aria-label="Size">' + p.v.map(function (v, i) { return '<button type="button" data-variant="' + i + '" aria-pressed="' + (i === vi) + '">' + v[0] + '</button>'; }).join('') + '</div>' : '';
    return '<article class="pc" data-id="' + p.id + '"><div class="pc-media" style="--tint:' + p.tint + '">' + tag + heat +
      '<img src="' + src(p) + '" alt="' + esc(p.name) + ' jar" loading="lazy" width="300" height="360">' + btn + '</div>' +
      '<div class="pc-row"><h3>' + esc(p.name) + '</h3><span class="pc-price">' + money(price) + '</span></div>' +
      '<p class="pc-sub">' + (p.soldOut ? 'Back with the next batch' : 'Mix any 3: <b>' + money(price * .9) + ' each</b>') + '</p>' + vars + '</article>';
  }
  function show(els) {
    if (window.gsap && !reduced) gsap.to(els, { opacity: 1, y: 0, duration: .7, stagger: .06, ease: 'power3.out' });
    else els.forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
  }
  function renderGrid(f) {
    grid.innerHTML = P.filter(function (p) { return p.cats.indexOf(f) > -1; }).slice(0, 8).map(card).join('');
    show($$('.pc', grid));
  }
  $('#tabs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter]'); if (!b) return;
    $$('#tabs button').forEach(function (t) { t.setAttribute('aria-selected', t === b); });
    renderGrid(b.dataset.filter);
  });
  grid.addEventListener('click', function (e) {
    var vb = e.target.closest('[data-variant]');
    if (vb) {
      var c = vb.closest('.pc'), id = c.dataset.id; selV[id] = +vb.dataset.variant;
      var t = document.createElement('div'); t.innerHTML = card(byId[id]); var n = t.firstChild; n.style.opacity = 1; n.style.transform = 'none'; c.replaceWith(n); return;
    }
    var ab = e.target.closest('[data-add]');
    if (ab) { addToCart(ab.dataset.add, selV[ab.dataset.add] || 0, 1, ab.closest('.pc').querySelector('img'), ab); return; }
    var nb = e.target.closest('[data-notify]'); if (nb) openNotify(byId[nb.dataset.notify]);
  });

  /* ---------- Cart ---------- */
  var cart = store.get('kyr2-cart', []).filter(function (l) { return byId[l.id] && byId[l.id].v[l.v]; });
  var zipState = store.get('kyr-zip', null);
  var cartEl = $('#cart'), scrim = $('#scrim'), lastFocus;
  var key = function (id, v) { return id + ':' + v; };
  function totals() {
    var q = 0, s = 0; cart.forEach(function (l) { q += l.q; s += byId[l.id].v[l.v][1] * l.q; });
    var t = tierFor(q), d = t ? s * t.pct / 100 : 0; return { qty: q, sub: s, tier: t, disc: d, total: s - d };
  }
  function save() { store.set('kyr2-cart', cart); }
  function addLine(id, v, q) { var l = cart.filter(function (x) { return key(x.id, x.v) === key(id, v); })[0]; if (l) l.q += q; else cart.push({ id: id, v: v, q: q }); }
  function addToCart(id, v, q, imgEl, btn) {
    var p = byId[id]; if (!p || p.soldOut) return;
    var before = totals().tier; addLine(id, v, q); save(); renderCart();
    if (btn) { var h = btn.innerHTML; btn.classList.add('done'); btn.innerHTML = '✓ Added'; setTimeout(function () { btn.classList.remove('done'); btn.innerHTML = h; }, 1300); }
    if (imgEl) fly(imgEl);
    var after = totals().tier;
    if (after && (!before || after.pct > before.pct)) toast('Nice! ' + after.pct + '% off unlocked');
    if (!cartEl.classList.contains('open')) setTimeout(openCart, imgEl && !reduced ? 650 : 0);
  }
  function fly(imgEl) {
    if (!window.gsap || reduced) return;
    var dock = $('#stickyCta'), tgt = window.innerWidth <= 960 && dock.classList.contains('show') ? $('[data-open-cart]', dock) : $('#cartBtn');
    var a = imgEl.getBoundingClientRect(), b = tgt.getBoundingClientRect();
    var f = document.createElement('img'); f.src = imgEl.src; f.className = 'fly'; f.alt = '';
    f.style.left = (a.left + a.width / 2 - 30) + 'px'; f.style.top = (a.top + a.height / 2 - 40) + 'px';
    document.body.appendChild(f);
    gsap.to(f, { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: .3, rotation: 18, duration: .65, ease: 'power2.in', onComplete: function () { f.remove(); } });
  }
  function upsells() {
    var inC = {}; cart.forEach(function (l) { inC[l.id] = 1; });
    var has = function (fn) { return cart.some(function (l) { return fn(byId[l.id]); }); };
    var order = [];
    if (has(function (p) { return p.heat >= 5; })) order.push('ghostly', 'habanero', 'reaper', 'spicyg', 'brussels');
    if (!has(function (p) { return p.cats.indexOf('ferments') > -1; })) order.push('krautchi', 'purple');
    if (!has(function (p) { return p.cats.indexOf('tonics') > -1; })) order.push('golden');
    order.push('garlicdill', 'spicyg', 'beets', 'okra', 'frank', 'lemondill', 'naked');
    var out = []; order.forEach(function (id) { if (!inC[id] && out.indexOf(id) < 0 && !byId[id].soldOut) out.push(id); });
    return out.slice(0, 4);
  }
  function renderCart() {
    var t = totals();
    $('#cartCount').textContent = t.qty; $('#stickyCount').textContent = t.qty;
    $('#cartBtn').setAttribute('aria-label', 'Open basket, ' + t.qty + ' items');
    var bag = $('#cartBtn'); bag.classList.remove('bump'); void bag.offsetWidth; bag.classList.add('bump');
    $('#cartHeadCount').textContent = t.qty + (t.qty === 1 ? ' jar' : ' jars') + (t.tier ? ' · saving ' + t.tier.pct + '%' : '');
    cartEl.classList.toggle('empty', t.qty === 0);
    var jars = ''; for (var i = 1; i <= 12; i++) jars += '<i class="' + (i <= t.qty ? 'f' : '') + (i === 3 || i === 6 || i === 12 ? ' m' : '') + '" data-l="' + (i === 3 ? '10%' : i === 6 ? '15%' : i === 12 ? '20%' : '') + '"></i>';
    $('#cartJars').innerHTML = jars;
    var nt = nextTier(t.qty), m;
    if (!t.tier) m = 'Add <b>' + (3 - t.qty) + ' more jar' + (3 - t.qty === 1 ? '' : 's') + '</b> to save 10%';
    else if (nt) m = 'Saving <b>' + t.tier.pct + '%</b>. Add ' + (nt.q - t.qty) + ' more for ' + nt.pct + '% off';
    else m = 'Maximum saving unlocked: <b>20% off</b>';
    $('#cartTierMsg').innerHTML = m;
    $('#cartItems').innerHTML = cart.map(function (l) {
      var p = byId[l.id], pr = p.v[l.v][1] * l.q, d = t.tier ? pr * (1 - t.tier.pct / 100) : pr;
      return '<li class="ci" data-key="' + key(l.id, l.v) + '"><div class="ci-img" style="--tint:' + p.tint + '"><img src="' + src(p) + '" alt=""></div><div><h4>' + esc(p.name) + '</h4><small>' + p.v[l.v][0] + (p.heat ? ' · heat ' + p.heat : '') + '</small><br>' +
        '<span class="ci-qty"><button type="button" data-dec aria-label="Decrease quantity">−</button><span>' + l.q + '</span><button type="button" data-inc aria-label="Increase quantity">+</button></span></div>' +
        '<div class="ci-right"><b>' + money(d) + '</b>' + (t.tier ? '<s>' + money(pr) + '</s>' : '') + '<button type="button" class="ci-rm" data-rm>Remove</button></div></li>';
    }).join('');
    var ups = upsells();
    $('#upsell').style.display = ups.length ? '' : 'none';
    $('#upsell h3').textContent = t.qty ? 'Pairs perfectly with' : 'Start with a favourite';
    $('#upsellRow').innerHTML = ups.map(function (id) {
      var p = byId[id];
      return '<div class="up"><div class="up-img" style="--tint:' + p.tint + '"><img src="' + src(p) + '" alt="" loading="lazy"></div><div><b>' + esc(p.name) + '</b><small>' + money(p.v[0][1]) + (p.heat ? ' · heat ' + p.heat : '') + '</small></div><button type="button" data-up="' + id + '" aria-label="Add ' + esc(p.name) + '">+</button></div>';
    }).join('');
    $('#cSub').textContent = money(t.sub);
    $('#cDiscRow').hidden = !t.tier;
    if (t.tier) { $('#cDiscLabel').textContent = 'Multi-buy saving (' + t.tier.pct + '%)'; $('#cDisc').textContent = '-' + money(t.disc); }
    $('#cShip').textContent = zipState === true ? 'FREE local delivery' : zipState === false ? 'Flat rate at checkout' : 'Enter ZIP below';
    $('#cTotal').textContent = money(t.total);
  }
  $('#cartItems').addEventListener('click', function (e) {
    var li = e.target.closest('.ci'); if (!li) return; var idx = -1;
    cart.forEach(function (l, i) { if (key(l.id, l.v) === li.dataset.key) idx = i; }); if (idx < 0) return;
    if (e.target.closest('[data-inc]')) cart[idx].q++;
    else if (e.target.closest('[data-dec]')) { if (!--cart[idx].q) cart.splice(idx, 1); }
    else if (e.target.closest('[data-rm]')) cart.splice(idx, 1); else return;
    save(); renderCart();
  });
  $('#upsellRow').addEventListener('click', function (e) { var b = e.target.closest('[data-up]'); if (!b) return; addToCart(b.dataset.up, 0, 1, null, null); toast(byId[b.dataset.up].name + ' added'); });
  function openCart() {
    lastFocus = document.activeElement; scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.add('show'); });
    cartEl.classList.add('open'); cartEl.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    setTimeout(function () { $('#cartClose').focus({ preventScroll: true }); }, 60);
  }
  function closeCart() {
    scrim.classList.remove('show'); cartEl.classList.remove('open'); cartEl.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
    setTimeout(function () { scrim.hidden = true; }, 400); if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $('#cartBtn').addEventListener('click', openCart);
  $$('[data-open-cart]').forEach(function (b) { b.addEventListener('click', openCart); });
  $('#cartClose').addEventListener('click', closeCart); scrim.addEventListener('click', closeCart);
  cartEl.addEventListener('click', function (e) { if (e.target.closest('[data-close-cart]')) closeCart(); });
  document.addEventListener('keydown', function (e) {
    if (!cartEl.classList.contains('open')) return;
    if (e.key === 'Escape') closeCart();
    if (e.key === 'Tab') {
      var f = $$('button, a[href], input', cartEl).filter(function (x) { return x.offsetParent !== null; }); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  $('#checkoutBtn').addEventListener('click', function () { toast('Prototype: this opens Shopify\'s secure checkout'); });

  /* ---------- ZIP (Denver Metro + ~20 mi of Longmont; edit when confirmed) ---------- */
  function zipFree(z) {
    if (!/^\d{5}$/.test(z)) return null;
    if (['800', '801', '802', '803'].indexOf(z.slice(0, 3)) > -1) return true;
    return ['8050', '8051', '8053', '8054', '8060', '8061', '8062', '8064'].indexOf(z.slice(0, 4)) > -1;
  }
  function bindZip(form, input, out) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var r = zipFree(input.value.trim()); out.classList.remove('ok', 'no');
      if (r === null) { out.textContent = 'Please enter a 5-digit ZIP code.'; out.classList.add('no'); return; }
      zipState = r; store.set('kyr-zip', r);
      out.textContent = r ? '✓ Delivery to ' + input.value + ' is FREE.' : 'Flat-rate shipping to ' + input.value + '. Or find us at a market!';
      out.classList.add(r ? 'ok' : 'no');
      ['#zipInput', '#zipInput2', '#cartZip'].forEach(function (s) { $(s).value = input.value; });
      renderCart();
    });
  }
  bindZip($('#zipForm'), $('#zipInput'), $('#zipResult'));
  bindZip($('#zipForm2'), $('#zipInput2'), $('#zipResult2'));
  bindZip($('#cartZipForm'), $('#cartZip'), $('#cartZipResult'));

  /* ---------- Pantry Box (crate) ---------- */
  var box = {}, boxIds = ['garlicdill', 'ghostly', 'spicyg', 'purple', 'krautchi', 'habanero', 'golden', 'beets', 'reaper', 'okra'];
  var boxCount = function () { return Object.keys(box).reduce(function (s, k) { return s + box[k]; }, 0); };
  function renderBox() {
    var q = boxCount(), t = tierFor(q), nt = nextTier(q);
    var flat = []; boxIds.forEach(function (id) { for (var i = 0; i < (box[id] || 0); i++) flat.push(id); });
    var slots = ''; for (var i = 0; i < 12; i++) slots += flat[i] ? '<div class="slot"><img src="' + src(byId[flat[i]]) + '" alt="' + esc(byId[flat[i]].name) + '"><button type="button" data-unbox="' + flat[i] + '" aria-label="Remove one ' + esc(byId[flat[i]].name) + '"></button></div>' : '<div class="slot" aria-hidden="true"></div>';
    $('#boxSlots').innerHTML = slots;
    $$('#tiers span').forEach(function (s) { s.classList.toggle('hit', !!t && +s.dataset.tier === t.q); });
    var sub = flat.reduce(function (s, id) { return s + byId[id].v[0][1]; }, 0), sv = t ? sub * t.pct / 100 : 0;
    $('#boxMsg').textContent = !q ? 'Add 3 jars to unlock 10% off' : !t ? q + ' in the crate. ' + (3 - q) + ' more to unlock 10% off'
      : q + ' jars · you save ' + money(sv) + (nt ? '. ' + (nt.q - q) + ' more for ' + nt.pct + '% off' : '. Maximum saving!');
    $$('.bl').forEach(function (li) {
      var c = box[li.dataset.id] || 0; li.classList.toggle('has', c > 0); $('.step span', li).textContent = c;
      $('[data-minus]', li).disabled = !c; $('[data-plus]', li).disabled = q >= 12;
    });
    var add = $('#boxAdd'); add.disabled = !q; add.textContent = q ? 'Add crate to basket · ' + money(sub - sv) : 'Add crate to basket';
  }
  $('#pickGrid').innerHTML = boxIds.map(function (id) {
    var p = byId[id];
    return '<li class="bl" data-id="' + id + '"><div class="bl-img" style="--tint:' + p.tint + '"><img src="' + src(p) + '" alt="" loading="lazy"></div><div><b>' + esc(p.name) + '</b><small>' + money(p.v[0][1]) + (p.heat ? ' · heat ' + p.heat : '') + '</small></div>' +
      '<div class="step"><button type="button" data-minus aria-label="Remove ' + esc(p.name) + '">−</button><span>0</span><button type="button" data-plus aria-label="Add ' + esc(p.name) + '">+</button></div></li>';
  }).join('');
  $('#pickGrid').addEventListener('click', function (e) {
    var li = e.target.closest('.bl'); if (!li) return; var id = li.dataset.id;
    if (e.target.closest('[data-plus]') && boxCount() < 12) {
      box[id] = (box[id] || 0) + 1; renderBox();
      if (window.gsap && !reduced) { var filled = $$('#boxSlots .slot img'); var last = filled[filled.length - 1]; if (last) gsap.from(last, { y: -40, opacity: 0, duration: .5, ease: 'bounce.out' }); }
    } else if (e.target.closest('[data-minus]') && box[id]) { box[id]--; renderBox(); }
  });
  $('#boxSlots').addEventListener('click', function (e) { var b = e.target.closest('[data-unbox]'); if (b && box[b.dataset.unbox]) { box[b.dataset.unbox]--; renderBox(); } });
  $('#boxClear').addEventListener('click', function () { box = {}; renderBox(); });
  $('#boxAdd').addEventListener('click', function () {
    var n = boxCount(); if (!n) return; var before = totals().tier;
    Object.keys(box).forEach(function (id) { if (box[id]) addLine(id, 0, box[id]); });
    box = {}; save(); renderBox(); renderCart();
    var after = totals().tier;
    toast(n + ' jars added' + (after && (!before || after.pct > before.pct) ? ' · ' + after.pct + '% off unlocked' : ''));
    openCart();
  });
  renderBox();

  /* ---------- Heat line ---------- */
  var heatPool = ['garlicdill', 'krautchi', 'brussels', 'spicyg', 'blazin', 'habanero', 'ghostly', 'reaper'];
  $('#heatJars').innerHTML = heatPool.map(function (id) { var p = byId[id]; return '<img class="hj" data-id="' + id + '" src="' + src(p) + '" alt="" style="left:calc(15px + (100% - 30px) * ' + (p.heat / 10) + ')">'; }).join('');
  function renderHeat(v) {
    var best = heatPool[0], d = 99;
    heatPool.forEach(function (id) { var dd = Math.abs(byId[id].heat - v); if (dd < d) { d = dd; best = id; } });
    var p = byId[best];
    $$('.hj').forEach(function (j) { j.classList.toggle('on', j.dataset.id === best); });
    var tag = v <= 1 ? 'Mild & tangy' : v <= 4 ? 'A gentle warmth' : v <= 7 ? 'Proper kick' : v <= 9 ? 'Serious heat' : 'Only for the brave';
    $('#heatCard').innerHTML = '<div class="hp-img" style="--tint:' + p.tint + '"><img src="' + src(p) + '" alt="' + esc(p.name) + ' jar"></div>' +
      '<div><p class="hp-k">' + tag + ' · heat ' + p.heat + '/10</p><h3>' + esc(p.name) + '</h3><p>' + esc(p.desc) + '</p></div>' +
      '<button class="b b-wine" type="button" data-add-heat="' + p.id + '">Add · ' + money(p.v[0][1]) + '</button>';
  }
  var hr = $('#heatRange'); hr.addEventListener('input', function () { renderHeat(+hr.value); });
  $('#heatCard').addEventListener('click', function (e) { var b = e.target.closest('[data-add-heat]'); if (b) addToCart(b.dataset.addHeat, 0, 1, $('#heatCard img'), null); });
  renderHeat(+hr.value);

  /* ---------- Reviews slider ---------- */
  var rvs = $$('.rv'), ri = 0, rvTimer;
  function setRv(i) { ri = (i + rvs.length) % rvs.length; rvs.forEach(function (r, k) { r.classList.toggle('on', k === ri); }); $('#rvCount').textContent = (ri + 1) + ' / ' + rvs.length; }
  function autoRv() { clearInterval(rvTimer); if (!reduced) rvTimer = setInterval(function () { setRv(ri + 1); }, 7000); }
  $('#rvPrev').addEventListener('click', function () { setRv(ri - 1); autoRv(); });
  $('#rvNext').addEventListener('click', function () { setRv(ri + 1); autoRv(); });
  autoRv();

  /* ---------- Find tabs + shops ---------- */
  $$('.seg [role=tab]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.seg [role=tab]').forEach(function (x) { var on = x === b; x.setAttribute('aria-selected', on); $('#fp-' + x.dataset.tab).hidden = !on; });
    });
  });
  var SHOPS = [
    ['Leevers Locavore', '2630 W 38th Ave, Denver'], ['The Little Bodega', '613 22nd St, Denver'], ['Sunmarket', '2201 Lafayette, Denver'],
    ['Homestead in the Hood', '1385 Carr St, Lakewood'], ['Littleton Meats', '3615 W Bowles, Littleton'],
    ["All Bjorn's Colorado Honey", 'DIA, Golden, Boulder, Ft. Collins, Aspen Grove, Steamboat, Breckenridge, Vail'],
    ["Lucky's Market", '3960 Broadway, Boulder'], ['East &amp; Co', '2100 Central Ave, Boulder'], ['Cheese Importers', '103 Main St, Longmont'],
    ['Local Goods Colorado', '409 S Public Rd, Lafayette'], ['The Mountain Fountain', '11809 N 75th St, Hygiene'], ['Niwot Market', '7980 Niwot Rd, Niwot'],
    ['Your Butcher Frank', '900 Coffman, Longmont'], ["The Rancher's Wife", '600 Third St, Berthoud'], ['The Cupboard', '152 S College, Fort Collins'],
    ['The Warehouse Urban Grocer', '29 W Cimarron St, Colorado Springs'], ['Blackfox Provisions', '27780 Hwy-74, Evergreen'],
    ['Mountain Market &amp; Supply', '112 West 2nd St, Eagle'], ['Gunnison Jerky', '235 N Main St, Gunnison'],
    ['Colorado Bagel Westside Market', '2851 Riverside Plz, Steamboat Springs']
  ];
  function renderShops(q) {
    q = (q || '').toLowerCase().trim();
    var l = SHOPS.filter(function (s) { return !q || (s[0] + ' ' + s[1]).toLowerCase().indexOf(q) > -1; });
    $('#shopList').innerHTML = l.length ? l.map(function (s) { return '<li><b>' + s[0] + '</b><small>' + s[1] + '</small></li>'; }).join('') : '<li><small>No shop there yet. Try free delivery!</small></li>';
  }
  $('#shopSearch').addEventListener('input', function (e) { renderShops(e.target.value); }); renderShops('');
  var names = SHOPS.map(function (s) { return '<span>' + s[0] + '</span>'; }).join('');
  $('#logosTrack').innerHTML = names + names; $('#logosTrack').setAttribute('aria-hidden', 'true');

  /* ---------- Recipes rail ---------- */
  var U = function (id) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=800&q=70'; };
  var REC = [
    { t: 'The smash burger upgrade', d: 'Two thick Garlic Dill coins and a splash of brine in the sauce.', img: U('1550547660-d9450f859349'), p: 'garlicdill' },
    { t: 'Denver deli sandwich', d: 'How The Little Bodega does it: a heap of Spicy G! on a toasted sub.', img: U('1553909489-cd47e0907980'), p: 'spicyg' },
    { t: "Lesley's grilled cheese night", d: 'Sourdough, sharp cheddar, pickles on the side and a glass of Naked Red.', img: IMG + 'grilled.webp', p: 'naked' },
    { t: 'The gut-happy grain bowl', d: 'Finish any bowl with a forkful of Kraut-chi for crunch and tang.', img: U('1546069901-ba9599a7e63c'), p: 'krautchi' },
    { t: 'Friday pizza, turned up', d: 'Scatter Ghostly Fire slices over a hot pie. Trust us.', img: U('1565299624946-b28f40a0ae38'), p: 'ghostly' }
  ];
  $('#pairRow').innerHTML = REC.map(function (r) {
    var p = byId[r.p];
    return '<article class="rc"><div class="rc-img"><img src="' + r.img + '" alt="' + esc(r.t) + '" loading="lazy" width="800" height="640"></div><div class="rc-body"><h3>' + esc(r.t) + '</h3><p>' + esc(r.d) + '</p>' +
      '<button type="button" class="rc-add" data-add-pair="' + p.id + '"><img src="' + src(p) + '" alt=""><span>' + esc(p.name) + '<br><small>' + money(p.v[0][1]) + '</small></span><em aria-hidden="true">+</em><span class="sr">Add to basket</span></button></div></article>';
  }).join('');
  $('#pairRow').addEventListener('click', function (e) { var b = e.target.closest('[data-add-pair]'); if (b) addToCart(b.dataset.addPair, 0, 1, $('img', b), null); });
  var rail = $('#pairRow');
  $('#railPrev').addEventListener('click', function () { rail.scrollBy({ left: -rail.clientWidth * .7, behavior: reduced ? 'auto' : 'smooth' }); });
  $('#railNext').addEventListener('click', function () { rail.scrollBy({ left: rail.clientWidth * .7, behavior: reduced ? 'auto' : 'smooth' }); });

  /* ---------- Notify + club ---------- */
  var modal = $('#notifyModal'), nf;
  function openNotify(p) { nf = p; $('#notifyText').textContent = p.name + ' sold out. We\'ll email you the moment the next batch is ready.'; if (modal.showModal) modal.showModal(); else toast('We\'ll let you know'); }
  modal.addEventListener('close', function () { if (modal.returnValue === 'ok' && nf) toast('You\'re on the list for ' + nf.name); $('#notifyEmail').value = ''; });
  $('#clubForm').addEventListener('submit', function (e) {
    e.preventDefault(); var v = $('#clubEmail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { $('#clubMsg').textContent = 'Please enter a valid email address.'; return; }
    $('#clubMsg').textContent = 'Welcome to the club! Your 10% code is on its way.'; $('#clubEmail').value = '';
  });

  /* ---------- Nav, dock, menu ---------- */
  var nav = $('#nav'), dock = $('#stickyCta'), hero = $('.hero');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    var s = window.scrollY > hero.offsetTop + hero.offsetHeight - 120;
    dock.classList.toggle('show', s); dock.setAttribute('aria-hidden', !s);
    $$('a,button', dock).forEach(function (x) { x.tabIndex = s ? 0 : -1; });
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var menu = $('#menuBtn'), dn = $('#drawerNav');
  menu.addEventListener('click', function () { var o = dn.hidden; dn.hidden = !o; menu.setAttribute('aria-expanded', o); });
  dn.addEventListener('click', function (e) { if (e.target.closest('a')) { dn.hidden = true; menu.setAttribute('aria-expanded', 'false'); } });
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Design notes ---------- */
  var nb = $('#notesToggle'), n = 0;
  $$('[data-note]').forEach(function (s) {
    var parts = s.getAttribute('data-note').split('|'), d = document.createElement('aside'); d.className = 'dnote';
    d.innerHTML = '<b><i>' + (++n) + '</i>' + esc(parts[0]) + '</b>' + esc(parts[1] || ''); s.appendChild(d);
  });
  function setNotes(on) { document.body.classList.toggle('notes-on', on); nb.setAttribute('aria-pressed', on); $('.nt-label', nb).textContent = on ? 'Hide design notes' : 'Why it\'s designed this way'; }
  nb.addEventListener('click', function () { setNotes(!document.body.classList.contains('notes-on')); });
  if (/[?&]notes=1/.test(location.search)) setNotes(true);

  /* ---------- Manifesto words ---------- */
  var man = $('#manifesto');
  man.innerHTML = man.textContent.split(' ').map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');

  renderGrid('best'); renderCart(); setHero(0, false);

  /* ---------- Motion ---------- */
  function motion() {
    if (!window.gsap || reduced) { $$('.w').forEach(function (w) { w.classList.add('on'); }); return; }
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('.stage', { scale: .96, opacity: 0, duration: 1.1 })
      .from('.display', { y: 60, opacity: 0, duration: 1 }, .15)
      .from('.pill, .lede, .ctas', { y: 24, opacity: 0, duration: .8, stagger: .08 }, .35)
      .from('#heroJar', { y: 120, opacity: 0, rotate: 8, duration: 1.2 }, .25)
      .from('.stage-card, .thumb, .stage-proof li', { y: 24, opacity: 0, duration: .7, stagger: .05 }, .55);
    gsap.to('.halo', { scale: 1.06, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    if (!window.ScrollTrigger) { $$('.w').forEach(function (w) { w.classList.add('on'); }); return; }
    var words = $$('.w');
    ScrollTrigger.create({
      trigger: man, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: function (s) { var k = Math.round(s.progress * words.length); words.forEach(function (w, i) { w.classList.toggle('on', i < k); }); }
    });
    $$('.tile, .sp, .bl, .heat-stage, .rc, .find-panel, .acc details, .club, .head, .box-left > *').forEach(function (el) { el.classList.add('rvl'); });
    ScrollTrigger.batch('.rvl', { start: 'top 90%', once: true, onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: .9, stagger: .07, ease: 'power3.out' }); } });
    gsap.from('.t-jar', { y: 80, rotate: 10, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.t-big', start: 'top 75%' } });
    gsap.to('.mega', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    ScrollTrigger.refresh();
  }
  if (document.readyState === 'complete') motion(); else window.addEventListener('load', motion);
})();
