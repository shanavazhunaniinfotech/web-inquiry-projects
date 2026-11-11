(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Art ---------- */
  var uid = 0;
  function svg(vb, inner) { return '<svg viewBox="' + vb + '" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>'; }
  function pouch(x, y, s) {
    var g = 'p' + (++uid);
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><defs><linearGradient id="' + g + '" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9ece2"/></linearGradient></defs>' +
      '<path d="M8 10 Q8 0 18 0 H102 Q112 0 112 10 V150 Q112 160 102 160 H18 Q8 160 8 150 Z" fill="url(#' + g + ')"/>' +
      '<rect x="8" y="8" width="104" height="5" fill="#dfe3d6"/>' +
      '<path d="M8 96 Q60 82 112 96 V150 Q112 160 102 160 H18 Q8 160 8 150 Z" fill="#3d5a1f"/>' +
      '<circle cx="60" cy="130" r="20" fill="#f3a712"/><ellipse cx="54" cy="124" rx="6" ry="3" fill="#fff" opacity=".6"/>' +
      '<text x="60" y="30" text-anchor="middle" font-family="Unbounded, sans-serif" font-size="7" font-weight="800" fill="#3d5a1f">yourbrand</text>' +
      '<text x="60" y="56" text-anchor="middle" font-family="Unbounded, sans-serif" font-size="9" fill="#121410">oil of</text>' +
      '<text x="60" y="74" text-anchor="middle" font-family="Unbounded, sans-serif" font-size="15" font-weight="800" fill="#121410">oregano</text>' +
      '<text x="60" y="86" text-anchor="middle" font-family="Manrope, sans-serif" font-size="6" font-weight="700" fill="#5d6556">+ BLACK SEED OIL · 60 SOFTGELS</text></g>';
  }
  function gel(x, y, s, r) {
    var g = 'g' + (++uid);
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (r || 0) + ') scale(' + s + ')"><defs><linearGradient id="' + g + '" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#ffe49a"/><stop offset=".55" stop-color="#f3a712"/><stop offset="1" stop-color="#b86d00"/></linearGradient></defs><rect x="-30" y="-15" width="60" height="30" rx="15" fill="url(#' + g + ')"/><ellipse cx="-12" cy="-6" rx="10" ry="4" fill="#fff" opacity=".55"/></g>';
  }
  function jar(x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="4" y="0" width="72" height="16" rx="4" fill="#c79a5b"/><rect x="0" y="18" width="80" height="82" rx="12" fill="#f4f8f5" stroke="#d6dccd" stroke-width="1.5"/>' +
      '<g fill="#f3a712"><ellipse cx="18" cy="84" rx="9" ry="6"/><ellipse cx="38" cy="86" rx="9" ry="6"/><ellipse cx="58" cy="84" rx="9" ry="6"/><ellipse cx="28" cy="72" rx="9" ry="6"/><ellipse cx="48" cy="72" rx="9" ry="6"/><ellipse cx="64" cy="70" rx="9" ry="6"/><ellipse cx="38" cy="58" rx="9" ry="6"/></g></g>';
  }
  function softCase(x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="0" y="10" width="44" height="74" rx="14" fill="#3d5a1f"/><rect x="4" y="0" width="36" height="18" rx="7" fill="#2b4115"/><circle cx="22" cy="48" r="9" fill="#f3a712"/></g>'; }
  function truck(x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="0" y="6" width="56" height="34" rx="6" fill="#7da23a"/><path d="M56 16 H72 L82 28 V40 H56 Z" fill="#3d5a1f"/><circle cx="16" cy="42" r="7" fill="#121410"/><circle cx="68" cy="42" r="7" fill="#121410"/></g>'; }
  function tierArt(units) { var o = ''; for (var i = 0; i < units; i++) o += pouch(i * 34, 4 + (i % 2) * 6, .45); return svg('0 0 ' + (60 + (units - 1) * 34) + ' 84', o); }

  var VIEWS = [
    svg('0 0 140 175', pouch(10, 6, 1)),
    '<img class="stage__photo" src="../assets/softgels-close.jpg" alt="Close-up of golden oregano softgels">',
    svg('0 0 300 300', jar(30, 70, 1.25) + softCase(170, 90, 1.5) + truck(150, 230, .9))
  ];
  var PEOPLE = ['w1', 'm3', 'w2', 'm1', 'w4', 'm2', 'w3', 'm4'];
  var SKIN = ['#e9b88e', '#c98f6a', '#8b5a3c', '#f0c9a8', '#5b3a29', '#d9a77b'];
  var BG = ['#d7dccb', '#c9d3d8', '#e8d9c3', '#d4cbd8', '#c6d6c0', '#e6d2c6', '#cfd6e2'];

  /* Stage views */
  var art = $('#stage-art');
  art.innerHTML = VIEWS[0];
  $$('[data-view]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-view]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      art.classList.add('out');
      setTimeout(function () { art.innerHTML = VIEWS[+b.dataset.view]; art.classList.remove('out'); }, reduce ? 0 : 250);
    });
  });

  /* ---------- Buy module (two synced instances) ---------- */
  var OFFERS = [
    { id: 1, q: '1', label: 'pouch', units: 1, price: 3499, compare: 5999, badge: '', name: '1 pouch' },
    { id: 2, q: '2', label: 'pouches + jar', units: 2, price: 5499, compare: 14498, badge: 'Most popular', name: '2 pouches + bamboo jar' },
    { id: 3, q: '3', label: 'pouches + 2 gifts', units: 3, price: 7999, compare: 21997, badge: 'Best value', name: '3 pouches + jar + case' }
  ];
  var GIFTS = [
    { name: 'Free shipping', value: '$4.95', unlock: 1, art: function () { return svg('0 0 90 54', truck(4, 2, 1)); } },
    { name: 'Bamboo jar', value: '$24.99', unlock: 2, art: function () { return svg('0 0 90 104', jar(5, 2, 1)); } },
    { name: 'Travel case', value: '$14.99', unlock: 3, art: function () { return svg('0 0 60 90', softCase(8, 2, 1)); } }
  ];
  var st = { sel: 2, sub: true };
  function money(c) { return '$' + (Math.round(c) / 100).toFixed(2); }
  function offer(id) { return OFFERS.filter(function (o) { return o.id === id; })[0]; }
  function price(o) { return st.sub ? Math.round(o.price * 0.85) : o.price; }
  function deliveryDate() { var d = new Date(), left = 3; while (left > 0) { d.setDate(d.getDate() + 1); if (d.getDay() % 6 !== 0) left--; } return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }); }
  var ic = {
    shield: '<path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" fill="none" stroke="currentColor" stroke-width="2"/>',
    truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="7" cy="17" r="2" fill="currentColor"/><circle cx="17" cy="17" r="2" fill="currentColor"/>',
    leaf: '<path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Zm0 0 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  };
  $$('[data-buy]').forEach(function (box) {
    var k = box.dataset.buy;
    box.innerHTML =
      '<div class="tiers" role="radiogroup" aria-label="Choose your bundle">' + OFFERS.map(function (o) {
        return '<label class="tier" data-id="' + o.id + '"><input type="radio" name="tier-' + k + '" value="' + o.id + '">' + (o.badge ? '<span class="tier__badge">' + o.badge + '</span>' : '') +
          '<span class="tier__art">' + tierArt(o.units) + '</span><span class="tier__q">' + o.q + '</span><span class="tier__l">' + o.label + '</span>' +
          '<span class="tier__p" data-tp></span><span class="tier__u" data-tu></span><span class="tier__s">' + money(o.compare) + '</span></label>';
      }).join('') + '</div>' +
      '<label class="toggle"><span><b>Refill every 30 days, save 15%</b><small>Skip or cancel anytime in two clicks</small></span><input type="checkbox" data-sub><span class="toggle__sw" aria-hidden="true"></span></label>' +
      '<div class="track"><div class="track__head"><b>GIFTS UNLOCKED</b><span data-gnote></span></div><div class="track__line"><span class="track__fill" data-fill></span>' + GIFTS.map(function (g) {
        return '<div class="node" data-unlock="' + g.unlock + '"><span class="node__dot">' + g.art() + '</span>' + g.name + '<small>' + g.value + ' value</small></div>';
      }).join('') + '</div></div>' +
      '<button type="button" class="cta" data-cta><span data-cta-l>Add to cart</span><span class="cta__price"><s data-cc></s><span data-cp></span></span></button>' +
      (k === 'hero' ? '<div class="meta"><span><svg viewBox="0 0 24 24">' + ic.shield + '</svg>30-day risk-free</span><span><svg viewBox="0 0 24 24">' + ic.truck + '</svg>Ships in 24h</span><span><svg viewBox="0 0 24 24">' + ic.leaf + '</svg>Third-party tested</span></div>' : '') +
      '<p class="ship">Order now, arrives by <b>' + deliveryDate() + '</b></p>';
    box.addEventListener('change', function (e) {
      if (e.target.name && e.target.name.indexOf('tier-') === 0) { st.sel = +e.target.value; render(); }
      if (e.target.matches('[data-sub]')) { st.sub = e.target.checked; render(); }
    });
    $('[data-cta]', box).addEventListener('click', function () { add(this); });
  });
  function render() {
    var o = offer(st.sel), p = price(o);
    $$('[data-buy]').forEach(function (box) {
      $$('.tier', box).forEach(function (t) {
        var of = offer(+t.dataset.id), pp = price(of);
        t.classList.toggle('is-sel', of.id === st.sel); $('input', t).checked = of.id === st.sel;
        $('[data-tp]', t).textContent = money(pp); $('[data-tu]', t).textContent = money(pp / of.units) + ' / pouch';
      });
      $('[data-sub]', box).checked = st.sub;
      $('[data-cp]', box).textContent = money(p); $('[data-cc]', box).textContent = money(o.compare);
      $$('.node', box).forEach(function (n) { n.classList.toggle('on', o.id >= +n.dataset.unlock); });
      $('[data-fill]', box).style.width = ((o.id - 1) / 2 * 66.8) + '%';
      $('[data-gnote]', box).textContent = o.id < 3 ? 'Add ' + (3 - o.id) + ' more pouch' + (o.id === 1 ? 'es' : '') + ' to unlock everything' : 'Everything unlocked';
    });
    $('#bar-t').textContent = o.name + (st.sub ? ' · refills' : '');
    $('#bar-p').textContent = money(p);
  }
  render();

  /* ---------- Cart ---------- */
  var cart = [];
  function add(btn) {
    var o = offer(st.sel), key = o.id + (st.sub ? 's' : '');
    var l = cart.filter(function (x) { return x.key === key; })[0];
    if (l) l.qty++; else cart.push({ key: key, o: o, sub: st.sub, qty: 1 });
    renderCart(); openCart();
    var b = $('#cart-count'); b.classList.add('bump'); setTimeout(function () { b.classList.remove('bump'); }, 300);
    if (btn && btn.matches('[data-cta]')) { var lab = $('[data-cta-l]', btn); btn.classList.add('added'); lab.textContent = 'Added ✓'; setTimeout(function () { btn.classList.remove('added'); lab.textContent = 'Add to cart'; }, 1600); }
  }
  function renderCart() {
    var total = 0, count = 0, best = 0, html = '';
    cart.forEach(function (l, i) {
      var p = (l.sub ? Math.round(l.o.price * 0.85) : l.o.price) * l.qty; total += p; count += l.qty; best = Math.max(best, l.o.id);
      html += '<div class="ci">' + tierArt(l.o.units) + '<span>' + l.o.name + (l.qty > 1 ? ' ×' + l.qty : '') + '<small>' + (l.sub ? 'Refills every 30 days · −15%' : 'One-time') + ' · <a href="#" data-rm="' + i + '">Remove</a></small></span><span>' + money(p) + '</span></div>';
    });
    GIFTS.forEach(function (g) { if (cart.length && best >= g.unlock) html += '<div class="ci">' + g.art() + '<span>' + g.name + '<small>Gift · ' + g.value + ' value</small></span><span class="free">FREE</span></div>'; });
    $('#cart-items').innerHTML = html || '<p class="cart__empty">Your cart is empty.</p>';
    $('#cart-total').textContent = money(total);
    $('#cart-count').textContent = count;
    var pct = cart.length ? Math.round(best / 3 * 100) : 0;
    $('#cart-prog').style.width = pct + '%';
    $('#cart-prog-t').textContent = !cart.length ? 'Add a bundle to start unlocking gifts' : best >= 3 ? 'All gifts unlocked 🎉' : 'Upgrade to ' + (best + 1) + ' pouches to unlock the next gift';
  }
  renderCart();
  $('#cart-items').addEventListener('click', function (e) { var a = e.target.closest('[data-rm]'); if (!a) return; e.preventDefault(); cart.splice(+a.dataset.rm, 1); renderCart(); });
  var scrim = $('#scrim');
  function openCart() { $('#cart').classList.add('is-open'); $('#cart').setAttribute('aria-hidden', 'false'); scrim.hidden = false; $('#cart-close').focus(); }
  function closeCart() { $('#cart').classList.remove('is-open'); $('#cart').setAttribute('aria-hidden', 'true'); scrim.hidden = true; }
  $('#cart-open').addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  scrim.addEventListener('click', closeCart);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCart(); });
  $('#bar-atc').addEventListener('click', function () { add(this); });

  /* Sticky bar */
  var heroCta = $('[data-buy="hero"] [data-cta]'), finalBox = $('[data-buy="final"]'), bar = $('#bar');
  function barCheck() {
    var passed = heroCta.getBoundingClientRect().bottom < 0;
    var fr = finalBox.getBoundingClientRect();
    var show = passed && !(fr.top < window.innerHeight && fr.bottom > 0);
    bar.classList.toggle('show', show); bar.setAttribute('aria-hidden', String(!show));
  }
  window.addEventListener('scroll', barCheck, { passive: true }); barCheck();

  /* Countdown */
  var end = Date.now() + 2 * 3600 * 1000 - 1000;
  function tick() {
    var left = end - Date.now(); if (left <= 0) { end = Date.now() + 2 * 3600 * 1000; left = end - Date.now(); }
    var h = Math.floor(left / 3600000), m = Math.floor(left / 60000) % 60, s = Math.floor(left / 1000) % 60;
    $('#cd').textContent = [h, m, s].map(function (n) { return String(n).padStart(2, '0'); }).join(':');
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Inside the softgel ---------- */
  var C = [
    { t: 'Oregano Oil', img: 'oil-drip', n: '300', u: 'mg', d: 'A concentrated 20:1 extract, equal to 6,000mg of fresh oregano herb in every serving. Used for over 2,000 years to support gut and immune health.†', bar: 100, note: '20:1 extract · 6,000mg herb equivalent' },
    { t: 'Black Seed Oil', img: 'seeds-spoon', n: '200', u: 'mg', d: 'Cold-pressed from Nigella sativa seeds, a staple of traditional wellness from Egypt to India.', bar: 67, note: 'Cold-pressed · Nigella sativa' },
    { t: 'Thymoquinone', img: 'amber-jars', n: 'TQ', u: '', d: "Black seed oil's signature active compound. It supports antioxidant activity and helps protect against everyday oxidative stress.†", bar: 45, note: 'Naturally occurring in black seed oil' },
    { t: 'Carvacrol', img: 'herbs-leafy', n: '165', u: 'mg', d: "Oregano's most studied active compound. It supports the body's natural defenses and provides antioxidant support.†", bar: 55, note: '55% of the oregano oil · standardized' }
  ];
  var tabs = $('#ctabs');
  tabs.innerHTML = C.map(function (c, i) { return '<button role="tab" aria-selected="' + (i === 0) + '" data-c="' + i + '">' + c.t + '</button>'; }).join('');
  function showC(i) {
    var c = C[i], body = $('.cinfo__body');
    $('#c-n').innerHTML = c.n + (c.u ? '<small>' + c.u + '</small>' : '');
    $('#c-t').textContent = c.t; $('#c-img').src = '../assets/' + c.img + '.jpg'; $('#c-img').alt = c.t; $('#c-d').textContent = c.d; $('#c-note').textContent = c.note;
    $('#c-bar').style.width = c.bar + '%';
    body.classList.remove('swap'); void body.offsetWidth; body.classList.add('swap');
    $$('[role=tab]', tabs).forEach(function (b, j) { b.setAttribute('aria-selected', j === i); });
    $$('.hot').forEach(function (h, j) { h.setAttribute('aria-pressed', j === i); });
  }
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-c]'); if (b) showC(+b.dataset.c); });
  $$('.hot').forEach(function (h) { h.addEventListener('mouseenter', function () { showC(+h.dataset.c); }); });
  showC(0);

  /* ---------- 90-day journey ---------- */
  var J = [
    { w: 'Week 1', img: 'breakfast', d: 'Day 7', t: 'Your body meets oregano.', p: 'Two softgels with breakfast. Most people notice nothing dramatic yet, and that is normal. Consistency matters most this week.', l: ['Easy routine', 'No aftertaste'], pct: .08 },
    { w: 'Week 2', img: 'meditate', d: 'Day 14', t: 'Digestion starts to settle.', p: 'Customers most often mention calmer meals and less bloating around the two-week mark.*', l: ['Calmer meals', 'Less bloating'], pct: .2 },
    { w: 'Week 4', img: 'run-feet', d: 'Day 30', t: 'A steadier everyday.', p: 'With a full month of daily use, many describe steadier energy and fewer afternoon crashes.*', l: ['Steady energy', 'Feeling regular'], pct: .45 },
    { w: 'Week 12', img: 'yoga-arms', d: 'Day 90', t: 'It just becomes you.', p: "By now it's part of the morning. Immune support through the seasons and a gut that feels like yours again.*", l: ['Seasonal support', 'Long-term routine', 'Clearer focus'], pct: 1 }
  ];
  var range = $('#j-range');
  function showJ(i) {
    var j = J[i], copy = $('.journey__copy');
    $('#j-week').textContent = j.w; $('#j-photo').style.backgroundImage = 'url(../assets/' + j.img + '.jpg)'; $('#j-day').textContent = j.d; $('#j-title').textContent = j.t; $('#j-text').textContent = j.p;
    $('#j-list').innerHTML = j.l.map(function (x) { return '<li>' + x + '</li>'; }).join('');
    $('#ring').style.strokeDashoffset = String(327 - 327 * j.pct);
    copy.classList.remove('swap'); void copy.offsetWidth; copy.classList.add('swap');
  }
  range.addEventListener('input', function () { showJ(+range.value); });
  showJ(0);

  /* ---------- Stats count-up ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return; co.unobserve(en.target);
        var el = en.target, to = +el.dataset.count, suf = el.dataset.suffix || '', t0 = null;
        (function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1300); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('en-US') + suf; if (k < 1) requestAnimationFrame(step); })(performance.now());
      });
    }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { co.observe(el); });
  }

  /* ---------- Reviews ---------- */
  var CAP = ['Week 3 update', 'Honest review', 'My morning routine', 'Bloat check', 'Why I switched', 'Unboxing'];
  $('#reels').innerHTML = CAP.map(function (c, i) {
    return '<button type="button" class="reel" style="background:' + BG[i % BG.length] + '" aria-label="Play video: ' + c + '"><img class="reel__img" src="../assets/' + PEOPLE[i] + '.jpg" alt="" loading="lazy"><span class="reel__time">0:' + (20 + i * 7) + '</span><span class="reel__play">' + c + '</span><span class="reel__bar"></span></button>';
  }).join('');
  $('#reels').addEventListener('click', function (e) {
    var r = e.target.closest('.reel'); if (!r) return;
    var on = r.classList.contains('is-playing'); $$('.reel').forEach(function (x) { x.classList.remove('is-playing'); }); if (!on) r.classList.add('is-playing');
  });
  var R = [
    { f: 'gut', big: true, h: 'My gut feels normal for the first time in years.', p: "I've dealt with bloating as long as I can remember. In under two weeks I noticed a real difference. Calm after meals, way more regular.", n: 'Dana H.' },
    { f: 'energy', h: 'Finally stopped chasing energy all day.', p: 'Coffee, snacks, nothing lasted. A few months in, my afternoons are steadier.', n: 'Hailey A.' },
    { f: 'clean', h: 'A clean product that actually works.', p: "Just two oils. Most supplements have twenty ingredients I can't pronounce.", n: 'Mike M.' },
    { f: 'immune', h: 'Part of my winter routine now.', p: 'Every time I feel something coming on, I reach for it first.', n: 'Priya S.' },
    { f: 'energy', h: 'Subtle at first, game-changing over time.', p: 'After three weeks: more energy, less brain fog, calmer stomach after meals.', n: 'Jordan K.' },
    { f: 'gut', h: 'No burn, no aftertaste.', p: "I tried oregano drops before and couldn't handle them. These are completely tasteless.", n: 'Elena R.' },
    { f: 'clean', big: true, h: 'I read every label. This one passed.', p: 'No gluten, dairy, sugar or binders, and clear doses on the front. That is rare.', n: 'Marcus T.' },
    { f: 'immune', h: 'The kids got sick, I didn’t.', p: "Can't promise it was this, but it's the first winter I made it through without a cold.", n: 'Sarah L.' }
  ];
  $('#masonry').innerHTML = R.map(function (r, i) {
    return '<article class="rv' + (r.big ? ' big' : '') + '" data-f="' + r.f + '"><span class="rv__stars">★★★★★</span><h3>"' + r.h + '"</h3><p>' + r.p + '</p><div class="rv__by"><i style="background-image:url(../assets/' + PEOPLE[i % PEOPLE.length] + '.jpg)"></i>' + r.n + '<em>✓ Verified</em></div></article>';
  }).join('');
  $$('[data-f]', $('.filters')).forEach(function (b) {
    b.addEventListener('click', function () {
      $$('button', $('.filters')).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      $$('.rv').forEach(function (r) { r.classList.toggle('hide', b.dataset.f !== 'all' && r.dataset.f !== b.dataset.f); });
    });
  });

  /* ---------- Compare switch ---------- */
  var US = [['Clearly dosed', '300mg oregano oil + 200mg black seed oil, on the front of the pouch'], ['Two ingredients', 'Nothing hidden in a "proprietary blend"'], ['No aftertaste', 'Sealed softgel, gentle on the stomach'], ['Clean label', 'No gluten, dairy, GMOs, sugar or binders'], ['Built for daily use', 'A long-term routine, not a 7-day cleanse']];
  var THEM = [['Vague doses', '"Oregano complex" with no mg per active compound'], ['Long ingredient lists', 'Fillers, flavors and binders to cut cost'], ['Harsh burn', 'Drops and capsules that repeat on you'], ['Added sugar & dyes', 'To mask the taste of low-grade oil'], ['Short-term hype', 'Built around a quick cleanse, not a habit']];
  var cmp = $('#cmp'), sw = $('#cmp-switch');
  function showCmp(them) {
    var rows = them ? THEM : US;
    cmp.classList.toggle('them', them);
    cmp.innerHTML = rows.map(function (r) { return '<li><i>' + (them ? '✕' : '✓') + '</i><span><b>' + r[0] + '</b><span>' + r[1] + '</span></span></li>'; }).join('');
    sw.setAttribute('aria-checked', String(them));
  }
  sw.addEventListener('click', function () { showCmp(sw.getAttribute('aria-checked') !== 'true'); });
  showCmp(false);
})();
