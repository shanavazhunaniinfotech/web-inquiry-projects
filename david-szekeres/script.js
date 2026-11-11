(function () {
  'use strict';

  /* ---------- Artwork (inline SVG, placeholder brand) ---------- */
  var uid = 0;
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
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<rect x="0" y="10" width="44" height="74" rx="12" fill="#3e6b4f"/><rect x="4" y="0" width="36" height="18" rx="6" fill="#2f5540"/>' +
      '<rect x="12" y="34" width="20" height="28" rx="4" fill="#5c8a6c"/></g>';
  }
  function truck(x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<rect x="0" y="6" width="56" height="34" rx="4" fill="#16956d"/><path d="M56 16 H72 L82 28 V40 H56 Z" fill="#0f7253"/>' +
      '<circle cx="16" cy="42" r="7" fill="#1b1f24"/><circle cx="68" cy="42" r="7" fill="#1b1f24"/>' +
      '<text x="28" y="22" text-anchor="middle" font-family="Sora, sans-serif" font-size="9" font-weight="700" fill="#fff">FREE</text>' +
      '<text x="28" y="33" text-anchor="middle" font-family="Sora, sans-serif" font-size="6" fill="#fff">SHIPPING</text></g>';
  }
  function svg(vb, inner) { return '<svg viewBox="' + vb + '" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>'; }

  var slides = [
    svg('0 0 300 300', pouch(150, 50, 1.05) + pouch(40, 80, 1.05) + jar(30, 190, .9) + '<g transform="translate(256 38) rotate(12) scale(.82)"><path d="M0 -38 L11 -26 L27 -30 L28 -14 L42 -6 L34 8 L42 22 L28 30 L27 46 L11 42 L0 54 L-11 42 L-27 46 L-28 30 L-42 22 L-34 8 L-42 -6 L-28 -14 L-27 -30 L-11 -26 Z" fill="#165c3c"/><text x="0" y="4" text-anchor="middle" font-family="Sora,sans-serif" font-size="13" font-weight="700" fill="#fff">FREE</text><text x="0" y="20" text-anchor="middle" font-family="Sora,sans-serif" font-size="13" font-weight="700" fill="#fff">GIFTS</text></g>'),
    svg('0 0 300 300', pouch(90, 60, 1.15)),
    svg('0 0 300 300', jar(95, 70, 1.4)),
    svg('0 0 300 300', pouch(40, 70, 1) + '<text x="180" y="150" font-family="Sora,sans-serif" font-size="40" fill="#4f7a32">+</text>' + jar(200, 110, 1)),
    svg('0 0 300 300', softCase(120, 90, 1.3) + jar(30, 120, .9) + pouch(190, 90, .7))
  ];

  function offerArt(units, extras) {
    var w = 40 + units * 34 + extras.length * 46;
    var out = '';
    for (var i = 0; i < units; i++) out += pouch(4 + i * 30, 10, .42);
    var x = 4 + units * 30 + 16;
    extras.forEach(function (e) {
      out += '<text x="' + (x - 6) + '" y="52" font-family="Sora,sans-serif" font-size="18" fill="#16956d">+</text>';
      out += e === 'jar' ? jar(x + 8, 20, .5) : softCase(x + 12, 18, .58);
      x += 52;
    });
    return svg('0 0 ' + Math.max(w, 120) + ' 84', out);
  }

  var icons = {
    leaf: '<path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Zm0 0 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" fill="currentColor"/>',
    shield: '<path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" fill="currentColor"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill="currentColor"/>',
    gut: '<path d="M8 4c-3 0-4 3-2 5s6 1 6 5-5 3-5 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    lungs: '<path d="M11 4v8M11 9c-2-3-6-2-6 3v6c0 2 3 2 6-1M13 9c2-3 6-2 6 3v6c0 2-3 2-6-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  };
  var benefits = [['leaf', 'Inflammation Support†'], ['heart', 'Metabolic Support†'], ['lungs', 'Immune Wellness†'], ['gut', 'Gut & Digestion†'], ['bolt', 'Daily Energy†'], ['shield', 'Cardiovascular Wellness†']];

  /* ---------- Data ---------- */
  var OFFERS = [
    { id: 1, title: 'Buy One', units: 1, price: 3499, compare: 5999, badge: '', gift: '', giftSub: '', extras: [] },
    { id: 2, title: 'Buy 2 Get 1 Free Gift', units: 2, price: 5499, compare: 14498, badge: 'Most Popular', gift: 'FREE Bamboo Lid Glass Jar ($24.99 Value)', giftSub: 'Premium Softgel Storage', extras: ['jar'] },
    { id: 3, title: 'Buy 3 Get 2 Free Gifts', units: 3, price: 7999, compare: 21997, badge: 'Free Shipping', gift: 'FREE Bamboo Jar + On-the-Go Softgel Case', giftSub: 'Travel-ready storage ($39.98 value)', extras: ['jar', 'case'] }
  ];
  var GIFTS = [
    { name: 'FREE Shipping', value: '$4.95', unlock: 1, art: function () { return svg('0 0 90 54', truck(4, 2, 1)); } },
    { name: 'FREE Bamboo Glass Jar', value: '$24.99', unlock: 2, art: function () { return svg('0 0 90 104', jar(5, 2, 1)); } },
    { name: 'FREE On-the-Go Case', value: '$14.99', unlock: 3, art: function () { return svg('0 0 60 90', softCase(8, 2, 1)); } }
  ];
  var SUB_RATE = 0.85;

  var DEFAULTS = { accent: '#0f5a43', soft: '#dff3ec', badgeColor: '#16956d', hd: 28, hm: 24, imgD: 120, imgM: 84, radius: 8, title: 'A Calmer Gut Starts Here', save: 'EARLY BLACK FRIDAY - Save [savings]', badge2: 'Most Popular', def: 1, subs: true, gifts: true, delivery: true };
  var state = {};
  var order = [];
  var selectedId = 2;
  var lastLevel = null;

  var $ = function (id) { return document.getElementById(id); };
  var bb = $('bb');
  if (!bb) return;

  function money(c) { return '$' + (Math.round(c) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function offerById(id) { return OFFERS.filter(function (o) { return o.id === id; })[0]; }
  function isSub() { return state.subs && $('bb-sub').checked; }
  function priceOf(o) { return isSub() ? Math.round(o.price * SUB_RATE) : o.price; }

  /* ---------- Render ---------- */
  function renderGallery() {
    $('bb-main').innerHTML = slides[0];
    $('bb-thumbs').innerHTML = slides.map(function (s, i) {
      return '<button type="button" class="bb__thumb" data-i="' + i + '" aria-label="Show image ' + (i + 1) + '" aria-current="' + (i === 0) + '">' + s + '</button>';
    }).join('');
    $('bb-thumbs').addEventListener('click', function (e) {
      var b = e.target.closest('.bb__thumb'); if (!b) return;
      $('bb-main').innerHTML = slides[+b.dataset.i];
      [].forEach.call($('bb-thumbs').children, function (t) { t.setAttribute('aria-current', t === b); });
    });
    $('bb-benefits').innerHTML = benefits.map(function (b) {
      return '<span class="bb__benefit"><svg viewBox="0 0 24 24" aria-hidden="true">' + icons[b[0]] + '</svg>' + b[1] + '</span>';
    }).join('');
  }

  function renderOffers() {
    $('bb-offers').innerHTML = order.map(function (id) {
      var o = offerById(id);
      var badge = o.id === 2 ? state.badge2 : o.badge;
      return '<label class="bb__offer' + (o.id === selectedId ? ' is-selected' : '') + '" data-id="' + o.id + '">' +
        '<input type="radio" name="bb-offer" value="' + o.id + '"' + (o.id === selectedId ? ' checked' : '') + '>' +
        (badge ? '<span class="bb__badge">' + escapeHtml(badge) + '</span>' : '') +
        '<span class="bb__row"><span class="bb__offer-art">' + offerArt(o.units, o.extras) + '</span>' +
        '<span><span class="bb__offer-title">' + o.title + '</span><span class="bb__offer-unit" data-unit></span></span>' +
        '<span class="bb__prices"><span class="bb__op" data-op></span><span class="bb__oc">' + money(o.compare) + '</span></span></span>' +
        (o.gift ? '<span class="bb__gift"><span class="bb__tick">✓</span><span><strong>' + o.gift + '</strong><small>' + o.giftSub + '</small></span></span>' : '') +
        '</label>';
    }).join('');
  }

  function renderGifts() {
    $('bb-giftlist').innerHTML = GIFTS.map(function (g, i) {
      return (i ? '<span class="bb__plus" aria-hidden="true">+</span>' : '') +
        '<div class="bb__g" data-unlock="' + g.unlock + '">' + g.art() +
        '<span class="bb__g-val">' + g.value + '</span><span class="bb__g-name">' + g.name + '</span>' +
        '<span class="bb__g-lock"><svg viewBox="0 0 16 18" width="16" height="18" fill="currentColor" aria-hidden="true"><path d="M3 8V5a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1Zm2 0h6V5a3 3 0 0 0-6 0v3Z"/></svg>Locked</span></div>';
    }).join('');
  }

  function renderBlocklist() {
    $('blocklist').innerHTML = order.map(function (id, i) {
      var o = offerById(id);
      return '<li><span>' + o.title + '</span>' +
        '<button type="button" data-move="-1" data-id="' + id + '" aria-label="Move ' + o.title + ' up"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
        '<button type="button" data-move="1" data-id="' + id + '" aria-label="Move ' + o.title + ' down"' + (i === order.length - 1 ? ' disabled' : '') + '>↓</button></li>';
    }).join('');
  }

  function update() {
    var o = offerById(selectedId);
    var price = priceOf(o);
    $('bb-price').textContent = money(price);
    $('bb-compare').textContent = money(o.compare);
    $('bb-save').textContent = state.save.replace('[savings]', money(o.compare - price));
    $('bb-save').hidden = !state.save;
    $('bb-atc-p').textContent = money(price);
    $('bb-atc-c').textContent = money(o.compare);
    [].forEach.call($('bb-offers').children, function (el) {
      var of = offerById(+el.dataset.id);
      var p = priceOf(of);
      el.classList.toggle('is-selected', of.id === selectedId);
      el.querySelector('input').checked = of.id === selectedId;
      el.querySelector('[data-op]').textContent = money(p);
      el.querySelector('[data-unit]').textContent = money(p / of.units) + ' per bag';
    });
    var level = o.id;
    [].forEach.call(document.querySelectorAll('.bb__g'), function (g) {
      var locked = level < +g.dataset.unlock;
      var was = g.classList.contains('is-locked');
      g.classList.toggle('is-locked', locked);
      if (!locked && was && lastLevel !== null) { g.classList.remove('pop'); void g.offsetWidth; g.classList.add('pop'); }
    });
    lastLevel = level;
    $('bb-note').textContent = isSub()
      ? '↻ Refills ship every 30 days (' + money(price) + ' each)  |  Stop or cancel anytime'
      : '30-day risk-free trial  |  Free returns';
  }

  function applySettings() {
    bb.style.setProperty('--bb-accent', state.accent);
    bb.style.setProperty('--bb-soft', state.soft);
    bb.style.setProperty('--bb-badge', state.badgeColor);
    bb.style.setProperty('--bb-hd', state.hd + 'px');
    bb.style.setProperty('--bb-hm', state.hm + 'px');
    bb.style.setProperty('--bb-img-d', state.imgD + 'px');
    bb.style.setProperty('--bb-img-m', state.imgM + 'px');
    bb.style.setProperty('--bb-radius', state.radius + 'px');
    $('cart').style.setProperty('--bb-accent', state.accent);
    $('bb-title').textContent = state.title || 'A Calmer Gut Starts Here';
    $('bb-subs').hidden = !state.subs;
    $('bb-gifts').hidden = !state.gifts;
    $('bb-delivery').hidden = !state.delivery;
    $('o-hd').textContent = state.hd + 'px';
    $('o-hm').textContent = state.hm + 'px';
    $('o-id').textContent = state.imgD + 'px';
    $('o-im').textContent = state.imgM + 'px';
    $('o-r').textContent = state.radius + 'px';
    document.querySelectorAll('.swatches button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.accent === state.accent); });
  }

  function syncControls() {
    $('s-hd').value = state.hd; $('s-hm').value = state.hm; $('s-id').value = state.imgD; $('s-im').value = state.imgM; $('s-r').value = state.radius;
    $('s-title').value = state.title; $('s-save').value = state.save; $('s-badge').value = state.badge2; $('s-default').value = String(state.def);
    $('s-subs').checked = state.subs; $('s-gifts').checked = state.gifts; $('s-delivery').checked = state.delivery;
  }

  function reset() {
    state = JSON.parse(JSON.stringify(DEFAULTS));
    order = [1, 2, 3];
    selectedId = OFFERS[state.def].id;
    $('bb-sub').checked = false;
    lastLevel = null;
    syncControls(); applySettings(); renderOffers(); renderBlocklist(); update();
  }

  function setDelivery() {
    var d = new Date(), left = 3;
    while (left > 0) { d.setDate(d.getDate() + 1); if (d.getDay() % 6 !== 0) left--; }
    $('bb-date').textContent = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- Cart (demo) ---------- */
  function openCart() {
    var o = offerById(selectedId);
    var lines = [{ art: offerArt(o.units, []), name: 'Oil of Oregano Softgels × ' + o.units, sub: isSub() ? 'Refill every 30 days · 15% off' : 'One-time purchase', price: money(priceOf(o)) }];
    if (state.gifts) GIFTS.forEach(function (g) {
      if (o.id >= g.unlock && g.unlock > 1) lines.push({ art: g.art(), name: g.name.replace('FREE ', ''), sub: 'Free gift · was ' + g.value, price: '<span class="free">FREE</span>' });
    });
    if (state.gifts && o.id >= 1) lines.push({ art: svg('0 0 90 54', truck(4, 2, 1)), name: 'Shipping', sub: 'Unlocked with your order', price: '<span class="free">FREE</span>' });
    $('cart-items').innerHTML = lines.map(function (l) {
      return '<div class="cart__item">' + l.art + '<span>' + l.name + '<small>' + l.sub + '</small></span><span>' + l.price + '</span></div>';
    }).join('');
    $('cart-total').textContent = money(priceOf(o));
    $('cart').classList.add('is-open');
    $('cart').setAttribute('aria-hidden', 'false');
    $('cart-close').focus();
  }
  function closeCart() {
    $('cart').classList.remove('is-open');
    $('cart').setAttribute('aria-hidden', 'true');
    $('bb-atc').focus();
  }

  /* ---------- Events ---------- */
  $('bb-offers').addEventListener('change', function (e) {
    if (e.target.name === 'bb-offer') { selectedId = +e.target.value; update(); }
  });
  $('bb-sub').addEventListener('change', update);
  $('bb-atc').addEventListener('click', openCart);
  $('cart-close').addEventListener('click', closeCart);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $('cart').classList.contains('is-open')) closeCart(); });

  function bindRange(id, key) {
    $(id).addEventListener('input', function () { state[key] = +this.value; applySettings(); });
  }
  bindRange('s-hd', 'hd'); bindRange('s-hm', 'hm'); bindRange('s-id', 'imgD'); bindRange('s-im', 'imgM'); bindRange('s-r', 'radius');
  $('s-title').addEventListener('input', function () { state.title = this.value; applySettings(); });
  $('s-save').addEventListener('input', function () { state.save = this.value; update(); });
  $('s-badge').addEventListener('input', function () { state.badge2 = this.value; renderOffers(); update(); });
  $('s-default').addEventListener('change', function () { state.def = +this.value; selectedId = OFFERS[state.def].id; update(); });
  $('s-subs').addEventListener('change', function () { state.subs = this.checked; applySettings(); update(); });
  $('s-gifts').addEventListener('change', function () { state.gifts = this.checked; applySettings(); });
  $('s-delivery').addEventListener('change', function () { state.delivery = this.checked; applySettings(); });
  document.querySelector('.swatches').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.accent = b.dataset.accent; state.soft = b.dataset.soft; state.badgeColor = b.dataset.badge; applySettings();
  });
  $('blocklist').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-move]'); if (!b) return;
    var id = +b.dataset.id, i = order.indexOf(id), j = i + (+b.dataset.move);
    if (j < 0 || j >= order.length) return;
    order.splice(i, 1); order.splice(j, 0, id);
    renderOffers(); renderBlocklist(); update();
    var again = $('blocklist').querySelector('button[data-id="' + id + '"][data-move="' + b.dataset.move + '"]');
    if (again && !again.disabled) again.focus();
  });
  $('reset').addEventListener('click', reset);

  document.querySelectorAll('.device button').forEach(function (b) {
    b.addEventListener('click', function () {
      var mobile = b.dataset.device === 'mobile';
      $('frame').classList.toggle('is-mobile', mobile);
      document.querySelectorAll('.device button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    });
  });

  renderGallery();
  renderGifts();
  setDelivery();
  reset();
})();

/* ---------- Page: section map, hero fan, counters, reveal, nav ---------- */
(function () {
  'use strict';
  var TYPES = {
    ann: ['Announcement / countdown bar', 'chrome'], hdr: ['Header + sticky nav', 'chrome'], ftr: ['Footer', 'chrome'],
    gal: ['Image gallery', 'commerce'], buy: ['Buy box: tiered bundles', 'commerce'], gift: ['Gift unlock', 'commerce'], sub: ['Subscribe & save', 'commerce'], sticky: ['Sticky add-to-cart', 'commerce'],
    rev: ['Review slider', 'trust'], vid: ['Video testimonials', 'trust'], stat: ['Clinical stats + counters', 'trust'], cmp: ['Comparison table', 'trust'], guar: ['Guarantee banner', 'trust'],
    story: ['Image + text story', 'content'], ing: ['Ingredient cards', 'content'], ben: ['Benefit icons', 'content'], how: ['How it works steps', 'content'], time: ['"What to expect" timeline', 'content'], mq: ['Marquee / ticker', 'content'], faq: ['FAQ accordion / tabs', 'content'], pop: ['Pop-up content', 'content']
  };
  var GROUPS = [['commerce', 'Commerce', 'var(--c-commerce)'], ['trust', 'Trust', 'var(--c-trust)'], ['content', 'Content', 'var(--c-content)'], ['chrome', 'Store chrome', 'var(--c-chrome)']];
  var COLOR = { chrome: 'var(--c-chrome)', commerce: 'var(--c-commerce)', trust: 'var(--c-trust)', content: 'var(--c-content)' };
  var PAGES = [
    ['P1', 'Aurivita', 'Home', ['hdr', 'story', 'mq', 'ing', 'rev', 'vid', 'cmp', 'stat', 'gal', 'buy', 'faq', 'guar', 'pop', 'ftr']],
    ['P2', 'Aurivita', 'Cayenne', ['ann', 'hdr', 'gal', 'buy', 'gift', 'sub', 'ben', 'rev', 'how', 'time', 'ing', 'cmp', 'mq', 'faq', 'pop', 'sticky', 'ftr']],
    ['P3', 'Aurivita', 'Garlic', ['ann', 'hdr', 'gal', 'buy', 'story', 'story', 'story', 'sticky', 'ftr']],
    ['P4', 'Lymphoria', 'Home', ['ann', 'hdr', 'story', 'mq', 'story', 'ing', 'stat', 'rev', 'story', 'buy', 'faq', 'ftr']],
    ['P5', 'EverWell', 'Home', ['ann', 'hdr', 'ing', 'mq', 'ben', 'time', 'how', 'vid', 'gal', 'buy', 'guar', 'faq', 'ftr']],
    ['P6', 'Resilia', 'Home', ['ann', 'hdr', 'story', 'story', 'stat', 'vid', 'rev', 'faq', 'ftr']],
    ['P7', 'Resilia', 'Oregano', ['ann', 'hdr', 'mq', 'gal', 'buy', 'gift', 'sub', 'ben', 'vid', 'stat', 'ing', 'rev', 'cmp', 'guar', 'ftr']],
    ['P8', 'Resilia', 'Garlic', ['ann', 'hdr', 'gal', 'buy', 'gift', 'sub', 'ben', 'story', 'story', 'story', 'time', 'cmp', 'story', 'faq', 'ftr']],
    ['P9', 'Resilia', 'Cinnamon', ['ann', 'hdr', 'gal', 'buy', 'gift', 'sub', 'ben', 'story', 'story', 'story', 'time', 'cmp', 'story', 'faq', 'ftr']]
  ];
  var TALL = { buy: 1, gal: 1 };
  function pagesUsing(key) { return PAGES.filter(function (p) { return p[3].indexOf(key) > -1; }).length; }

  var stacks = document.getElementById('stacks');
  var legend = document.getElementById('legend');
  if (stacks && legend) {
    stacks.innerHTML = PAGES.map(function (p) {
      return '<div class="pg"><div class="pg__head"><b>' + p[0] + '</b>' + p[1] + '<br>' + p[2] + '</div><div class="pg__body">' +
        p[3].map(function (k) {
          return '<button type="button" class="sb' + (TALL[k] ? ' tall' : '') + '" data-k="' + k + '" style="background:' + COLOR[TYPES[k][1]] + '" aria-label="' + p[0] + ': ' + TYPES[k][0] + '" title="' + TYPES[k][0] + '"></button>';
        }).join('') + '</div></div>';
    }).join('');
    legend.innerHTML = GROUPS.map(function (g) {
      var keys = Object.keys(TYPES).filter(function (k) { return TYPES[k][1] === g[0]; });
      return '<div class="legend__group"><h3><i style="background:' + g[2] + '"></i>' + g[1] + '</h3><div class="legend__chips">' +
        keys.map(function (k) { return '<button type="button" class="lchip" data-k="' + k + '" aria-pressed="false">' + TYPES[k][0] + ' <small>' + pagesUsing(k) + '/9</small></button>'; }).join('') +
        '</div></div>';
    }).join('');
    var n = document.getElementById('map-n'), label = document.getElementById('map-label');
    var focus = function (k) {
      stacks.querySelectorAll('.sb').forEach(function (b) { b.classList.toggle('hit', b.dataset.k === k); });
      legend.querySelectorAll('.lchip').forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.k === k); });
      var c = pagesUsing(k);
      n.textContent = c + ' / 9';
      label.textContent = (c === 1 ? 'page uses ' : 'pages use ') + (k === 'buy' ? 'the buy box' : 'the “' + TYPES[k][0] + '” section') + (c > 1 ? ', so it\'s built once and reused.' : '.');
    };
    legend.addEventListener('click', function (e) { var c = e.target.closest('.lchip'); if (c) focus(c.dataset.k); });
    stacks.addEventListener('click', function (e) { var b = e.target.closest('.sb'); if (b) focus(b.dataset.k); });
    stacks.addEventListener('mouseover', function (e) { var b = e.target.closest('.sb'); if (b) focus(b.dataset.k); });
    focus('buy');
  }

  /* Hero fan of nine pages */
  var fan = document.getElementById('fan');
  if (fan) {
    var html = PAGES.map(function (p, i) {
      var mid = (PAGES.length - 1) / 2, off = i - mid;
      var r = (off * 9).toFixed(1) + 'deg', y = (Math.abs(off) * 6 - 40) + 'px';
      return '<div class="fan__page" aria-hidden="true" style="--i:' + i + ';--r:' + r + ';--y:' + y + ';z-index:' + (10 - Math.abs(Math.round(off))) + '"><b><span>' + p[0] + '</span><span>' + p[1] + '</span></b>' +
        p[3].map(function (k) { return '<i style="background:' + COLOR[TYPES[k][1]] + (TALL[k] ? ';flex-grow:2.2' : '') + '"></i>'; }).join('') + '</div>';
    }).join('');
    fan.insertAdjacentHTML('afterbegin', html);
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Count-up (values are already correct in the HTML) */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target, to = +el.dataset.count, t0 = null;
        if (!to) return;
        var step = function (t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
    }, { threshold: .6 });
    document.querySelectorAll('[data-count]').forEach(function (el) { io.observe(el); });
  }

  /* Reveal on scroll (content stays visible; only slides up) */
  if (!reduce && 'IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add('in'); else ro.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* Active nav link */
  var links = [].slice.call(document.querySelectorAll('.nav__links a'));
  if ('IntersectionObserver' in window) {
    var no = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) no.observe(s); });
  }
})();
