(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var F = '../assets/fig/', S = '../assets/';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Placeholder content (replaced with the real menu) ---------- */
  var MENU = [
    ['Pasta', 'Classics', 'Savor authentic Italian pasta, tossed in rich sauces and crafted with love using traditional family recipes.', F + 'pasta.jpg', [['Pappardelle al Ragù', 'Slow-cooked beef & pork ragù, parmigiano', '$22'], ['Shrimp Fettuccine', 'Garlic, cherry tomato, white wine, basil', '$24'], ['Spaghetti Carbonara', 'Guanciale, egg yolk, pecorino, black pepper', '$20'], ['Penne Arrabbiata', 'Spicy tomato, garlic, parsley (V)', '$17']]],
    ['Fired', 'Pizza', 'Enjoy golden, crispy crusts, bubbling cheese, and fresh toppings baked to perfection in every bite.', S + 'ita-hero.jpg', [['Margherita', 'San Marzano tomato, fior di latte, basil (V)', '$17'], ['Diavola', 'Spicy salami, chili oil, mozzarella', '$19'], ['Quattro Formaggi', 'Four cheeses, honey drizzle (V)', '$19'], ['Prosciutto & Arugula', 'Prosciutto di Parma, arugula, parmigiano', '$21']]],
    ['Chef', 'Specials', 'Discover seasonal chef-inspired creations with bold flavors and signature touches for every palate.', F + 'chicken.jpg', [['Chicken Piccata', 'Lemon-caper butter, risotto, greens', '$26'], ['Salmon Livornese', 'Tomato, olives, capers, creamy mash', '$28'], ['Bistecca', 'Grilled ribeye, rosemary potatoes', '$36'], ['Eggplant Parmigiana', 'Layered, baked, fresh basil (V)', '$21']]],
    ['Sweet', 'Treats', 'Indulge in irresistible Italian desserts, from delicate pastries to decadent delights, perfect for every meal.', F + 'tiramisu.jpg', [['Tiramisu', 'Mascarpone, espresso, cocoa', '$10'], ['Chocolate Brownie & Gelato', 'Warm, with fresh berries', '$11'], ['Panna Cotta', 'Vanilla bean, berry compote', '$9'], ['Cannoli (2)', 'Sweet ricotta, pistachio', '$9']]]
  ];
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var WEEK = [['Meatball Monday', 'Nonna’s meatballs with spaghetti', '$18'], ['Pizza Tuesday', 'Any classic pizza, all day', '$14'], ['Wine Wednesday', 'Half-price bottles with dinner', '50% off'], ['Family Thursday', '2 pizzas, a salad & garlic knots for 4', '$45'], ['Fish Friday', 'Linguine with clams & white wine', '$24'], ['Steak Saturday', 'Bistecca for two with sides', '$58'], ['Sunday Supper', 'Lasagna, salad & tiramisu', '$29']];
  var HOURS = [['11:00', '21:00'], ['11:00', '21:00'], ['11:00', '21:00'], ['11:00', '21:00'], ['11:00', '22:00'], ['11:00', '22:00'], ['12:00', '20:00']];
  var REVIEWS = [['Family Dining Experience', 'The food was delicious, the atmosphere was welcoming, and the service made us feel right at home. Definitely a place we’ll love coming back to!', 'Sarah M.', '#2f6b2a'], ['Fresh Food and Fantastic Service', 'Every dish was full of flavor, beautifully prepared, and served with a smile. You can really feel the care and passion that goes into the food.', 'Michael R.', '#e0a325'], ['Our New Favorite Local Spot', 'From the delicious menu to the warm hospitality, everything made our visit special. It’s the perfect place to enjoy a great meal with family and friends.', 'Emily T.', '#2f6fe0']];
  var PACKS = [['Pasta Bar', 'Two pastas, salad, garlic bread', 19], ['Pizza Party', 'Assorted pizzas & salad', 15], ['Famiglia Feast', 'Antipasti, pasta, mains & dessert', 32]];

  function laNow() { try { return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })); } catch (e) { return new Date(); } }
  var now = laNow(), today = (now.getDay() + 6) % 7;
  function fmt(t) { var h = +t.split(':')[0], m = t.split(':')[1]; return (h % 12 || 12) + (m !== '00' ? ':' + m : '') + (h < 12 ? ' AM' : ' PM'); }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

  /* ---------- Menu accordion ---------- */
  $('#menu-list').innerHTML = MENU.map(function (m, i) {
    return '<div class="mrow' + (i === 0 ? ' open' : '') + '"><button type="button" aria-expanded="' + (i === 0) + '" aria-controls="mp' + i + '"><span class="mrow__name">' + m[0] + ' <em>' + m[1] + '</em></span><span class="mrow__desc">' + m[2] + '</span><span class="mrow__icon" aria-hidden="true"></span></button>' +
      '<div class="mrow__panel" id="mp' + i + '"><div><div class="mrow__inner"><img src="' + m[3] + '" alt="' + m[0] + ' ' + m[1] + '" loading="lazy"><ul class="dishes">' +
      m[4].map(function (d) { return '<li><b>' + d[0] + '</b><span class="p">' + d[2] + '</span><small>' + d[1] + '</small></li>'; }).join('') + '</ul></div></div></div></div>';
  }).join('');
  $('#menu-list').addEventListener('click', function (e) {
    var b = e.target.closest('.mrow > button'); if (!b) return;
    var row = b.parentNode, open = !row.classList.contains('open');
    $$('.mrow', $('#menu-list')).forEach(function (r) { r.classList.remove('open'); $('button', r).setAttribute('aria-expanded', 'false'); });
    if (open) { row.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
  });

  /* ---------- Weekly specials ---------- */
  function showDay(i) {
    var w = WEEK[i];
    $('#today').innerHTML = '<small>' + (i === today ? "Today's special · " : '') + DAYS[i] + '</small><b>' + w[0] + '</b><span class="p">' + w[2] + '</span><span>' + w[1] + '. Dine-in, pickup or delivery.</span>';
    $$('#week li').forEach(function (li, j) { li.setAttribute('aria-current', j === i ? 'true' : 'false'); });
  }
  $('#week').innerHTML = WEEK.map(function (w, i) { return '<li class="' + (i === today ? 'is-today' : '') + '" tabindex="0" data-d="' + i + '"><span class="d">' + DAYS[i].slice(0, 3) + (i === today ? ' · Today' : '') + '</span><b>' + w[0] + '</b><span class="p">' + w[2] + '</span></li>'; }).join('');
  $('#week').addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) showDay(+li.dataset.d); });
  $('#week').addEventListener('keydown', function (e) { if (e.key === 'Enter') { var li = e.target.closest('li'); if (li) showDay(+li.dataset.d); } });
  showDay(today);

  /* ---------- Reviews ---------- */
  $('#rgrid').innerHTML = REVIEWS.map(function (r) {
    return '<article class="rv"><div class="rv__top"><h3>' + r[0] + '</h3><span class="rv__q" aria-hidden="true">&#8221;</span></div><p>' + r[1] + '</p><div class="rv__foot"><span class="rv__av" style="background:' + r[3] + '">' + r[2][0] + '</span><span><b>' + r[2] + '</b><small>Google review</small></span><span class="gstars" aria-label="5 stars">★★★★★</span></div></article>';
  }).join('');

  /* ---------- Hours & open status ---------- */
  $('#hours').innerHTML = DAYS.map(function (d, i) { return '<tr class="' + (i === today ? 'is-today' : '') + '"><td>' + d + '</td><td>' + fmt(HOURS[i][0]) + ' – ' + fmt(HOURS[i][1]) + '</td></tr>'; }).join('');
  var h = HOURS[today], mins = now.getHours() * 60 + now.getMinutes(), o = +h[0].split(':')[0] * 60, c = +h[1].split(':')[0] * 60, isOpen = mins >= o && mins < c;
  var status = isOpen ? 'Open now · until ' + fmt(h[1]) : (mins < o ? 'Opens today at ' + fmt(h[0]) : 'Closed · opens tomorrow at ' + fmt(HOURS[(today + 1) % 7][0]));
  $('#open-status').textContent = status; $('#v-open').textContent = status;
  $('#open-dot').classList.toggle('closed', !isOpen);

  /* ---------- Catering ---------- */
  $('#packs').innerHTML = PACKS.map(function (p) { return '<div class="pack"><b>' + p[0] + '</b><small>' + p[1] + '</small><span>' + money(p[2]) + ' / person</span></div>'; }).join('');
  $('#c-pack').innerHTML = PACKS.map(function (p, i) { return '<option value="' + i + '">' + p[0] + ' · ' + money(p[2]) + '/person</option>'; }).join('');
  function est() { var p = PACKS[+$('#c-pack').value || 0], g = Math.max(10, +$('#c-guests').value || 10); $('#c-est').textContent = money(p[2] * g); }
  $('#c-guests').addEventListener('input', est); $('#c-pack').addEventListener('change', est); est();
  var dt = new Date(); dt.setDate(dt.getDate() + 7); $('#c-date').value = dt.toISOString().slice(0, 10);
  var pt = $('#packs-toggle');
  pt.addEventListener('click', function () { var hid = $('#packs').hidden; $('#packs').hidden = !hid; pt.setAttribute('aria-expanded', String(hid)); pt.textContent = hid ? 'Hide Catering Options' : 'View Catering Options'; });
  var cm = $('#cater-modal'), om = $('#order-modal');
  $('#cater-open').addEventListener('click', function () { $('#c-ok').hidden = true; cm.showModal(); });
  $('#cform').addEventListener('submit', function (e) { e.preventDefault(); $('#c-ok').hidden = false; });

  /* ---------- Order buttons, dialogs ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-order]'); if (a) { e.preventDefault(); om.showModal(); return; }
    var x = e.target.closest('[data-close]'); if (x) { x.closest('dialog').close(); }
  });
  [om, cm].forEach(function (d) { d.addEventListener('click', function (e) { if (e.target === d) d.close(); }); });

  /* ---------- Header, mobile nav ---------- */
  var header = $('#header');
  function onScroll() { header.classList.toggle('solid', window.scrollY > 60); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var burger = $('#burger'), mnav = $('#mnav');
  burger.addEventListener('click', function () { var op = mnav.classList.toggle('open'); burger.setAttribute('aria-expanded', String(op)); header.classList.add('solid'); });
  $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { mnav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }); });

  /* ---------- Newsletter ---------- */
  $('#news').addEventListener('submit', function (e) { e.preventDefault(); $('#news-ok').hidden = false; this.reset(); });

  /* ---------- SEO panel + schema ---------- */
  var base = location.href.split('#')[0];
  var schema = [{
    '@context': 'https://schema.org', '@type': 'Restaurant', name: 'The Family Table', servesCuisine: 'Italian', priceRange: '$$',
    telephone: '+1-949-555-0123', url: base, image: new URL(F + 'hero.jpg', base).href,
    address: { '@type': 'PostalAddress', streetAddress: '123 Avenida Del Mar', addressLocality: 'San Clemente', addressRegion: 'CA', postalCode: '92672', addressCountry: 'US' },
    openingHoursSpecification: DAYS.map(function (d, i) { return { '@type': 'OpeningHoursSpecification', dayOfWeek: d, opens: HOURS[i][0], closes: HOURS[i][1] }; }),
    hasMenu: base + '#menu', acceptsReservations: 'True',
    potentialAction: { '@type': 'OrderAction', target: 'https://your-ordering-page.example' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '620' }
  }];
  var json = JSON.stringify(schema, null, 2);
  $('#schema').textContent = json; $('#schema-view').textContent = json;
  var seo = $('#seo'), scrim = $('#scrim');
  function seoToggle(op) { seo.classList.toggle('open', op); seo.setAttribute('aria-hidden', String(!op)); scrim.hidden = !op; if (op) $('#seo-close').focus(); }
  $('#seo-open').addEventListener('click', function () { seoToggle(true); });
  $('#seo-close').addEventListener('click', function () { seoToggle(false); });
  scrim.addEventListener('click', function () { seoToggle(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') seoToggle(false); });

  /* ---------- Scroll reveal ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    var els = $$('.plate, .mrow, .book, .rv, .feats > div, .vlist li, .cater__img, .week li, .head');
    els.forEach(function (el, i) { el.classList.add('rv-in'); el.style.transitionDelay = ((i % 4) * 70) + 'ms'; });
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('on'); else io.observe(el); });
  }
})();
