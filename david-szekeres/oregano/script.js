(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Artwork (placeholder brand, inline SVG) ---------- */
  var uid = 0;
  function svg(vb, inner) { return '<svg viewBox="' + vb + '" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>'; }
  function pouch(x, y, s) {
    var g = 'pg' + (++uid);
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<defs><linearGradient id="' + g + '" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#eef1ec"/></linearGradient></defs>' +
      '<path d="M8 10 Q8 0 18 0 H102 Q112 0 112 10 V150 Q112 160 102 160 H18 Q8 160 8 150 Z" fill="url(#' + g + ')" stroke="#cfd8cc"/>' +
      '<rect x="8" y="8" width="104" height="6" fill="#e2e8df"/>' +
      '<path d="M8 100 Q60 86 112 100 V150 Q112 160 102 160 H18 Q8 160 8 150 Z" fill="#4f7a32"/>' +
      '<text x="60" y="38" text-anchor="middle" font-family="Sora, sans-serif" font-size="9" font-weight="700" fill="#4f7a32">YOUR BRAND</text>' +
      '<text x="60" y="58" text-anchor="middle" font-family="Sora, sans-serif" font-size="11" fill="#2d3b2a">OIL OF</text>' +
      '<text x="60" y="76" text-anchor="middle" font-family="Sora, sans-serif" font-size="17" font-weight="700" fill="#4f7a32">OREGANO</text>' +
      '<text x="60" y="88" text-anchor="middle" font-family="Sora, sans-serif" font-size="6.5" fill="#2d3b2a">WITH BLACK SEED OIL</text>' +
      '<ellipse cx="44" cy="122" rx="9" ry="6" fill="#e9b72d"/><ellipse cx="62" cy="126" rx="9" ry="6" fill="#f2c94c"/><ellipse cx="78" cy="120" rx="9" ry="6" fill="#e9b72d"/>' +
      '<text x="60" y="148" text-anchor="middle" font-family="Inter, sans-serif" font-size="7" fill="#fff">60 SOFTGELS</text></g>';
  }
  function jar(x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<rect x="4" y="0" width="72" height="16" rx="4" fill="#c79a5b"/><rect x="4" y="12" width="72" height="4" fill="#a87b42"/>' +
      '<rect x="0" y="18" width="80" height="82" rx="10" fill="#f4f8f5" stroke="#cfd8d2" stroke-width="1.5"/>' +
      '<g fill="#f2c94c" stroke="#d9a520" stroke-width=".8"><ellipse cx="18" cy="84" rx="9" ry="6"/><ellipse cx="38" cy="86" rx="9" ry="6"/><ellipse cx="58" cy="84" rx="9" ry="6"/><ellipse cx="28" cy="72" rx="9" ry="6"/><ellipse cx="48" cy="72" rx="9" ry="6"/><ellipse cx="64" cy="70" rx="9" ry="6"/><ellipse cx="18" cy="60" rx="9" ry="6"/><ellipse cx="38" cy="58" rx="9" ry="6"/><ellipse cx="56" cy="56" rx="9" ry="6"/></g>' +
      '<rect x="8" y="24" width="8" height="60" rx="4" fill="#fff" opacity=".6"/></g>';
  }
  function softCase(x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="0" y="10" width="44" height="74" rx="12" fill="#3e6b4f"/><rect x="4" y="0" width="36" height="18" rx="6" fill="#2f5540"/><rect x="12" y="34" width="20" height="28" rx="4" fill="#5c8a6c"/></g>';
  }
  function truck(x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="0" y="6" width="56" height="34" rx="4" fill="#16956d"/><path d="M56 16 H72 L82 28 V40 H56 Z" fill="#0f7253"/><circle cx="16" cy="42" r="7" fill="#1b1f24"/><circle cx="68" cy="42" r="7" fill="#1b1f24"/><text x="28" y="22" text-anchor="middle" font-family="Sora, sans-serif" font-size="9" font-weight="700" fill="#fff">FREE</text><text x="28" y="33" text-anchor="middle" font-family="Sora, sans-serif" font-size="6" fill="#fff">SHIPPING</text></g>';
  }
  var badge = '<g transform="translate(250 50) rotate(12) scale(.9)"><path d="M0 -38 L11 -26 L27 -30 L28 -14 L42 -6 L34 8 L42 22 L28 30 L27 46 L11 42 L0 54 L-11 42 L-27 46 L-28 30 L-42 22 L-34 8 L-42 -6 L-28 -14 L-27 -30 L-11 -26 Z" fill="#165c3c"/><text x="0" y="4" text-anchor="middle" font-family="Sora,sans-serif" font-size="13" font-weight="700" fill="#fff">FREE</text><text x="0" y="20" text-anchor="middle" font-family="Sora,sans-serif" font-size="13" font-weight="700" fill="#fff">GIFTS</text></g>';
  function infoSlide(title, rows, bg) {
    var out = '<rect width="300" height="300" fill="' + bg + '"/><text x="150" y="40" text-anchor="middle" font-family="Sora,sans-serif" font-size="17" font-weight="600" fill="#fff">' + title + '</text>';
    rows.forEach(function (r, i) {
      var y = 70 + i * 52;
      out += '<rect x="30" y="' + y + '" width="240" height="40" rx="8" fill="rgba(255,255,255,.1)"/><circle cx="52" cy="' + (y + 20) + '" r="9" fill="#f2c94c"/><text x="70" y="' + (y + 25) + '" font-family="Inter,sans-serif" font-size="13" fill="#fff">' + r + '</text>';
    });
    return svg('0 0 300 300', out);
  }
  var A = '../assets/';
  function photo(name, alt, extra) { return '<img src="' + A + name + '.jpg" alt="' + (alt || '') + '" loading="lazy">' + (extra || ''); }
  function ov(cls, inner) { return '<span class="ov ' + cls + '">' + inner + '</span>'; }
  var SLIDES = [
    photo('herbs-board', 'Oil of Oregano pouches with the free bamboo jar', ov('ov--hero', svg('0 0 300 300', pouch(150, 60, 1.05) + pouch(40, 90, 1.05) + jar(28, 190, .9) + badge))),
    photo('breakfast', 'Breakfast table with the daily softgels', ov('ov--br', svg('0 0 130 170', pouch(5, 5, 1)))),
    photo('softgels-jar', 'Golden softgels spilling from a glass jar'),
    photo('herbs-bowl', 'Fresh oregano and herbs with a mortar', ov('ov--bl', svg('0 0 130 170', pouch(5, 5, 1)))),
    photo('yoga-arms', 'Woman stretching outdoors in the morning')
  ];
  var PEOPLE = ['w1', 'm3', 'w2', 'm1', 'w4', 'm2', 'w3', 'm4'];
  function offerArt(units, extras) {
    var out = '';
    for (var i = 0; i < units; i++) out += pouch(4 + i * 30, 10, .42);
    var x = 4 + units * 30 + 16;
    extras.forEach(function (e) {
      out += '<text x="' + (x - 6) + '" y="52" font-family="Sora,sans-serif" font-size="20" fill="#16956d">+</text>';
      out += e === 'jar' ? jar(x + 8, 20, .5) : softCase(x + 12, 18, .58);
      x += 52;
    });
    return svg('0 0 ' + Math.max(40 + units * 34 + extras.length * 46, 120) + ' 84', out);
  }
  var ICONS = {
    leaf: '<path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Zm0 0 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" fill="currentColor"/>',
    shield: '<path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" fill="currentColor"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill="currentColor"/>',
    gut: '<path d="M8 4c-3 0-4 3-2 5s6 1 6 5-5 3-5 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    lungs: '<path d="M11 4v8M11 9c-2-3-6-2-6 3v6c0 2 3 2 6-1M13 9c2-3 6-2 6 3v6c0 2-3 2-6-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  };
  function icon(k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[k] + '</svg>'; }
  var SKIN = ['#e9b88e', '#c98f6a', '#8b5a3c', '#f0c9a8', '#5b3a29', '#d9a77b'];
  var BG = ['#d8cfc4', '#bfc8cf', '#e5d9c8', '#c9d3c0', '#d6c3c8', '#cfd8de', '#e2d4bd'];

  /* ---------- Static fills ---------- */
  var MQ = [['lungs', 'Metabolic Support†'], ['shield', 'Cardiovascular Wellness†'], ['leaf', 'Healthy Inflammation Response†'], ['heart', 'Immune Support†'], ['gut', 'Gut Health†'], ['bolt', 'Daily Energy†']];
  $$('[data-marquee]').forEach(function (t) {
    var one = MQ.map(function (m) { return '<span>' + icon(m[0]) + m[1] + '</span>'; }).join('');
    t.innerHTML = one + one + one + one;
  });
  $('#faces').innerHTML = ['w1', 'm3', 'w2', 'm1', 'w4'].map(function (n) { return '<i style="background-image:url(../assets/' + n + '.jpg)"></i>'; }).join('');
  $('#benefits').innerHTML = [['leaf', 'Inflammation Support†'], ['heart', 'Metabolic Support†'], ['lungs', 'Immune Wellness†'], ['gut', 'Gut & Digestion†'], ['bolt', 'Daily Energy†'], ['shield', 'Cardiovascular Wellness†']].map(function (b) { return '<span>' + icon(b[0]) + b[1] + '</span>'; }).join('');
  $('#feel-pouch').innerHTML = svg('0 0 130 170', pouch(5, 5, 1));
  $('#cmp-pack').innerHTML = svg('0 0 130 170', pouch(5, 5, 1));
  $('#stock-banner').innerHTML = svg('0 0 400 190', pouch(40, 40, .95) + pouch(250, 40, .95) + pouch(135, 10, 1.1));
  $('#risk-art').innerHTML = '<img src="../assets/w2.jpg" alt="Smiling customer" loading="lazy"><span class="risk__badge"><b>30</b>DAYS<br>MONEY BACK</span>';

  /* Gallery */
  var gMain = $('#g-main'), gThumbs = $('#g-thumbs');
  gMain.innerHTML = SLIDES[0];
  gThumbs.innerHTML = SLIDES.map(function (s, i) { return '<button type="button" data-i="' + i + '" aria-label="Show image ' + (i + 1) + '" aria-current="' + (i === 0) + '">' + s + '</button>'; }).join('');
  gThumbs.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    gMain.innerHTML = SLIDES[+b.dataset.i]; gMain.classList.remove('swap'); void gMain.offsetWidth; gMain.classList.add('swap');
    $$('button', gThumbs).forEach(function (t) { t.setAttribute('aria-current', t === b); });
  });

  /* Videos (UGC placeholders) */
  var CAPS = ['I used', 'This is why I regret', 'I got to a', 'My grandma', 'Week 3 update', 'Honest review'];
  function vid(i) {
    return '<button type="button" class="vid" aria-label="Play customer video ' + (i + 1) + '" style="background:' + BG[i % BG.length] + '">' +
      '<span class="vid__art"><img src="' + A + PEOPLE[i % PEOPLE.length] + '.jpg" alt="" loading="lazy">' + (i % 2 === 0 ? svg('0 0 130 170', pouch(5, 5, 1)) : '') + '</span>' +
      '<span class="vid__play"></span><span class="vid__cap">' + CAPS[i % CAPS.length] + '</span><span class="vid__bar"></span></button>';
  }
  $('#ugc-row').innerHTML = [0, 1, 2, 3, 4].map(vid).join('');
  $('#vids-track').innerHTML = [0, 1, 2, 3, 4, 5, 6, 7].map(vid).join('');
  document.addEventListener('click', function (e) {
    var v = e.target.closest('.vid'); if (!v) return;
    var on = v.classList.contains('is-playing');
    $$('.vid.is-playing').forEach(function (x) { x.classList.remove('is-playing'); });
    if (!on) v.classList.add('is-playing');
  });
  $$('[data-ugc]').forEach(function (b) {
    b.addEventListener('click', function () { var r = $('#ugc-row'); r.scrollBy({ left: (+b.dataset.ugc) * r.clientWidth / 2, behavior: 'smooth' }); });
  });

  /* Face wall */
  var tiles = '';
  for (var i = 0; i < 16; i++) tiles += '<span class="face"><img src="' + A + PEOPLE[i % PEOPLE.length] + '.jpg" alt="" loading="lazy"></span>';
  $('#facewall').innerHTML = tiles + tiles;

  /* ---------- Buy box (two synced instances) ---------- */
  var OFFERS = [
    { id: 1, title: 'Buy One', units: 1, price: 3499, compare: 5999, badge: '', gift: '', extras: [] },
    { id: 2, title: 'Buy 2 Get 1 Free Gift', units: 2, price: 5499, compare: 14498, badge: 'Most Popular', gift: 'FREE Bamboo Lid Glass Jar ($24.99 Value)', giftSub: 'Premium Softgel Storage', extras: ['jar'] },
    { id: 3, title: 'Buy 3 Get 2 Free Gifts', units: 3, price: 7999, compare: 21997, badge: 'Free Shipping', gift: 'FREE Bamboo Jar + On-the-Go Softgel Case', giftSub: 'Travel-ready storage ($39.98 value)', extras: ['jar', 'case'] }
  ];
  var GIFTS = [
    { name: 'FREE Shipping', value: '$4.95', unlock: 1, art: function () { return svg('0 0 90 54', truck(4, 2, 1)); } },
    { name: 'FREE Bamboo Glass Jar', value: '$24.99', unlock: 2, art: function () { return svg('0 0 90 104', jar(5, 2, 1)); } },
    { name: 'FREE On-the-Go Case', value: '$14.99', unlock: 3, art: function () { return svg('0 0 60 90', softCase(8, 2, 1)); } }
  ];
  var state = { sel: 2, sub: false, last: 2 };
  function money(c) { return '$' + (Math.round(c) / 100).toFixed(2); }
  function offer(id) { return OFFERS.filter(function (o) { return o.id === id; })[0]; }
  function price(o) { return state.sub ? Math.round(o.price * 0.85) : o.price; }
  function deliveryDate() { var d = new Date(), left = 3; while (left > 0) { d.setDate(d.getDate() + 1); if (d.getDay() % 6 !== 0) left--; } return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }

  $$('[data-buybox]').forEach(function (box) {
    var key = box.dataset.buybox;
    box.innerHTML =
      '<div class="pricebar"><span class="p" data-p></span><s data-c></s><span class="save" data-save></span></div>' +
      '<div class="offers" role="radiogroup" aria-label="Choose your bundle">' + OFFERS.map(function (o) {
        return '<label class="offer" data-id="' + o.id + '"><input type="radio" name="offer-' + key + '" value="' + o.id + '">' +
          (o.badge ? '<span class="offer__badge">' + o.badge + '</span>' : '') +
          '<span class="offer__row"><span class="offer__art">' + offerArt(o.units, o.extras) + '</span><span><span class="offer__t">' + o.title + '</span><span class="offer__u" data-u></span></span>' +
          '<span class="offer__pr"><b data-op></b><s>' + money(o.compare) + '</s></span></span>' +
          (o.gift ? '<span class="offer__gift"><i>✓</i><span><b>' + o.gift + '</b><small>' + o.giftSub + '</small></span></span>' : '') + '</label>';
      }).join('') + '</div>' +
      '<label class="refill"><span><b>Save More With Automatic Refills!</b><small>Save 15% on every refill · Cancel anytime</small></span><input type="checkbox" data-sub></label>' +
      '<div class="gifts"><span class="gifts__label">GIFTS UNLOCKED</span><div class="gifts__list">' + GIFTS.map(function (g, i) {
        return (i ? '<span class="plus" aria-hidden="true">+</span>' : '') + '<div class="gift" data-unlock="' + g.unlock + '">' + g.art() + '<s>' + g.value + '</s><b>' + g.name + '</b><span class="gift__lock"><svg viewBox="0 0 16 18" width="16" height="18" fill="currentColor" aria-hidden="true"><path d="M3 8V5a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1Zm2 0h6V5a3 3 0 0 0-6 0v3Z"/></svg>Locked</span></div>';
      }).join('') + '</div></div>' +
      '<div class="delivery"><span class="dot"></span>Order today for delivery by <b>' + deliveryDate() + '</b></div>' +
      '<button type="button" class="atc" data-atc><span data-atc-label>Add To Cart</span><span class="atc__pill"><s data-ac></s><span data-ap></span></span><span aria-hidden="true">→</span></button>' +
      '<p class="note" data-note></p>';
    box.addEventListener('change', function (e) {
      if (e.target.matches('input[type=radio]')) { state.sel = +e.target.value; render(); }
      if (e.target.matches('[data-sub]')) { state.sub = e.target.checked; render(); }
    });
    $('[data-atc]', box).addEventListener('click', function () { addToCart(this); });
  });

  function render() {
    var o = offer(state.sel), p = price(o);
    $$('[data-buybox]').forEach(function (box) {
      $('[data-p]', box).textContent = money(p);
      $('[data-c]', box).textContent = money(o.compare);
      $('[data-save]', box).textContent = 'EARLY BLACK FRIDAY - Save ' + money(o.compare - p);
      $('[data-ap]', box).textContent = money(p);
      $('[data-ac]', box).textContent = money(o.compare);
      $('[data-sub]', box).checked = state.sub;
      $('[data-note]', box).textContent = state.sub ? '↻ Refills ship every 30 days (' + money(p) + ' each)  |  ⏲ Stop or cancel anytime' : '↻ 30-day risk-free trial  |  ⏲ Ships in 24 hours';
      $$('.offer', box).forEach(function (el) {
        var of = offer(+el.dataset.id), pp = price(of);
        el.classList.toggle('is-sel', of.id === state.sel);
        $('input', el).checked = of.id === state.sel;
        $('[data-op]', el).textContent = money(pp);
        $('[data-u]', el).textContent = money(pp / of.units) + ' per bag';
      });
      $$('.gift', box).forEach(function (g) {
        var locked = o.id < +g.dataset.unlock, was = g.classList.contains('locked');
        g.classList.toggle('locked', locked);
        if (!locked && was && state.last !== o.id) { g.classList.remove('pop'); void g.offsetWidth; g.classList.add('pop'); }
      });
    });
    state.last = o.id;
    $('#sticky-title').textContent = o.title + (state.sub ? ' · Refills' : '');
    $('#sticky-p').textContent = money(p);
    $('#sticky-c').textContent = money(o.compare);
    $('#sticky-art').innerHTML = offerArt(o.units, o.extras);
  }
  render();

  /* ---------- Cart ---------- */
  var cart = [];
  function addToCart(btn) {
    var o = offer(state.sel);
    var key = o.id + (state.sub ? 's' : '');
    var line = cart.filter(function (l) { return l.key === key; })[0];
    if (line) line.qty++; else cart.push({ key: key, o: o, sub: state.sub, qty: 1 });
    renderCart(); openCart();
    if (btn) { var lab = btn.querySelector('[data-atc-label]'); btn.classList.add('added'); if (lab) lab.textContent = 'Added ✓'; setTimeout(function () { btn.classList.remove('added'); if (lab) lab.textContent = 'Add To Cart'; }, 1600); }
  }
  function renderCart() {
    var total = 0, count = 0, best = 0, html = '';
    cart.forEach(function (l, i) {
      var p = (l.sub ? Math.round(l.o.price * 0.85) : l.o.price) * l.qty;
      total += p; count += l.qty; best = Math.max(best, l.o.id);
      html += '<div class="cart__item">' + offerArt(l.o.units, []) + '<span>Oil of Oregano × ' + l.o.units + (l.qty > 1 ? ' (×' + l.qty + ')' : '') + '<small>' + (l.sub ? 'Refill every 30 days · 15% off' : 'One-time purchase') + ' · <a href="#" data-rm="' + i + '">Remove</a></small></span><span>' + money(p) + '</span></div>';
    });
    GIFTS.forEach(function (g) {
      if (cart.length && best >= g.unlock && g.unlock > 1) html += '<div class="cart__item">' + g.art() + '<span>' + g.name.replace('FREE ', '') + '<small>Free gift · was ' + g.value + '</small></span><span class="free">FREE</span></div>';
    });
    $('#cart-items').innerHTML = html || '<p class="cart__empty">Your cart is empty.</p>';
    $('#cart-total').textContent = money(total);
    $('#cart-ship').textContent = cart.length ? '🎉 You unlocked FREE shipping' : 'Add a bundle to unlock free shipping and gifts';
    var c = $('#cart-count'); c.hidden = !count; c.textContent = count;
  }
  renderCart();
  $('#cart-items').addEventListener('click', function (e) {
    var a = e.target.closest('[data-rm]'); if (!a) return; e.preventDefault();
    cart.splice(+a.dataset.rm, 1); renderCart();
  });
  var scrim = $('#scrim');
  function openCart() { $('#cart').classList.add('is-open'); $('#cart').setAttribute('aria-hidden', 'false'); scrim.hidden = false; $('#cart-close').focus(); }
  function closeAll() {
    $('#cart').classList.remove('is-open'); $('#cart').setAttribute('aria-hidden', 'true');
    $('#menu').classList.remove('is-open'); $('#menu').setAttribute('aria-hidden', 'true'); $('#menu-open').setAttribute('aria-expanded', 'false');
    scrim.hidden = true;
  }
  $('#cart-open').addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeAll);
  $('#menu-open').addEventListener('click', function () { $('#menu').classList.add('is-open'); $('#menu').setAttribute('aria-hidden', 'false'); this.setAttribute('aria-expanded', 'true'); scrim.hidden = false; });
  $('#menu-close').addEventListener('click', closeAll);
  $$('#menu a').forEach(function (a) { a.addEventListener('click', closeAll); });
  scrim.addEventListener('click', closeAll);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  $('#sticky-atc').addEventListener('click', function () { addToCart(this); });

  /* Sticky add-to-cart: shows after the main button scrolls past, hides at the stock-up buy box */
  var mainAtc = $('[data-buybox="main"] [data-atc]'), stockBox = $('[data-buybox="stock"]'), sticky = $('#sticky');
  function stickyCheck() {
    var passed = mainAtc.getBoundingClientRect().bottom < 0;
    var sr = stockBox.getBoundingClientRect();
    var atStock = sr.top < window.innerHeight && sr.bottom > 0;
    var show = passed && !atStock;
    sticky.classList.toggle('show', show);
    sticky.setAttribute('aria-hidden', String(!show));
  }
  window.addEventListener('scroll', stickyCheck, { passive: true });
  window.addEventListener('resize', stickyCheck);
  stickyCheck();

  /* Countdown (evergreen 2h) */
  var end = Date.now() + 2 * 3600 * 1000 - 1000;
  function tick() {
    var left = Math.max(0, end - Date.now());
    if (!left) end = Date.now() + 2 * 3600 * 1000;
    var h = Math.floor(left / 3600000), m = Math.floor(left / 60000) % 60, s = Math.floor(left / 1000) % 60;
    $('#cd-h').textContent = String(h).padStart(2, '0'); $('#cd-m').textContent = String(m).padStart(2, '0'); $('#cd-s').textContent = String(s).padStart(2, '0');
  }
  tick(); setInterval(tick, 1000);

  /* Count-up */
  if (!reduce && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return; co.unobserve(en.target);
        var el = en.target, to = +el.dataset.count, t0 = null;
        (function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('en-US'); if (k < 1) requestAnimationFrame(step); })(performance.now());
      });
    }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { co.observe(el); });
  }

  /* Sliders (reasons, videos) */
  function slider(root, dotsEl, btnAttr) {
    var track = $('.slider__track', root), items = track.children, idx = 0;
    function perView() { var w = items[0].getBoundingClientRect().width; return Math.max(1, Math.round(root.clientWidth / (w + 14))); }
    function max() { return Math.max(0, items.length - perView()); }
    function go(i) {
      idx = Math.max(0, Math.min(max(), i));
      var x = items[idx].offsetLeft - items[0].offsetLeft;
      track.style.transform = 'translateX(' + (-x) + 'px)';
      $$('button', dotsEl).forEach(function (d, j) { d.setAttribute('aria-current', j === idx); });
    }
    function dots() { dotsEl.innerHTML = ''; for (var j = 0; j <= max(); j++) dotsEl.insertAdjacentHTML('beforeend', '<button type="button" aria-label="Go to slide ' + (j + 1) + '"></button>'); go(Math.min(idx, max())); }
    dotsEl.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) go($$('button', dotsEl).indexOf(b)); });
    $$('[' + btnAttr + ']').forEach(function (b) { b.addEventListener('click', function () { go(idx + (+b.getAttribute(btnAttr))); }); });
    var sx = null;
    root.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    root.addEventListener('pointerup', function (e) { if (sx === null) return; var dx = e.clientX - sx; if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1)); sx = null; });
    window.addEventListener('resize', dots);
    dots();
  }
  slider($('#reasons'), $('#reasons-dots'), 'data-reason');
  slider($('#vids'), $('#vids-dots'), 'data-vid');

  /* Newsletter */
  $('#newsletter').addEventListener('submit', function (e) { e.preventDefault(); $('#nl-msg').hidden = false; this.reset(); });
})();
