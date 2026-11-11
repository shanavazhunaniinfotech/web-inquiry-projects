(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var A = '../assets/';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Content per cuisine (placeholder menu, swapped for the real one) ---------- */
  var C = {
    med: {
      name: 'Mediterranean', sub: 'Mediterranean Kitchen · Since 1998', color: '#2d3a1f',
      hero: 'med-hero', heroAlt: 'Grilled chicken fresh from the charcoal grill',
      title: 'Family recipes,<br><em>grilled fresh daily.</em>',
      lede: 'Three generations, one kitchen. Charcoal-grilled plates, warm pita and mezze made the way our grandmother taught us.',
      menu: {
        'Favorites': [['med-hero', 'Charcoal Chicken Plate', 'Half chicken, garlic toum, saffron rice, pickles, warm pita.', '$18.95', "Chef's pick", ['GF option']], ['med-skewers', 'Mixed Grill Skewers', 'Chicken, beef kofta and vegetables over rice.', '$22.50', 'Most ordered', []], ['med-falafel', 'Falafel & Hummus Plate', 'Crispy falafel, hummus, tomato salad, tahini.', '$15.95', '', ['Vegan']]],
        'Starters': [['med-hummus', 'Classic Hummus', 'Whipped chickpeas, tahini, olive oil, paprika.', '$8.95', '', ['Vegan', 'GF']], ['med-platter', 'Mezze Platter', 'Hummus, baba ghanoush, olives, falafel, pita.', '$16.95', 'Great to share', ['V']], ['med-salad', 'Greek Village Salad', 'Tomato, cucumber, olives, feta, oregano.', '$11.50', '', ['V', 'GF']]],
        'Mains': [['med-chicken', 'Lemon Chicken Tray', 'Roasted with potatoes, peppers and lemon.', '$19.95', '', ['GF']], ['med-skewers', 'Veggie Kebab Plate', 'Grilled seasonal vegetables, rice, salad.', '$16.50', '', ['Vegan']], ['med-hero', 'Shawarma Wrap', 'Chicken shawarma, garlic sauce, pickles.', '$12.95', '', []]],
        'Desserts': [['med-dessert', 'Orange Semolina Cake', 'Soaked in orange syrup, pistachio.', '$6.95', '', ['V']], ['latte', 'Cardamom Latte', 'Espresso, steamed milk, cardamom.', '$4.75', '', ['V']], ['med-dessert', 'Baklava (3 pcs)', 'Walnut, pistachio, honey syrup.', '$5.95', 'Family recipe', ['V']]]
      },
      week: [['Mezze Monday', 'Any mezze platter + 2 drinks', '$24', 'med-platter'], ['Kebab Tuesday', 'Mixed grill skewers for two', '$36', 'med-skewers'], ['Wrap Wednesday', 'Any wrap + fries + drink', '$14', 'med-hero'], ['Family Thursday', 'Whole chicken, rice, salad, pita for 4', '$49', 'med-chicken'], ['Falafel Friday', 'Falafel plate + lentil soup', '$16', 'med-falafel'], ['Grill Saturday', 'Lamb chops plate (weekend only)', '$29', 'med-skewers'], ['Sunday Supper', 'Lemon chicken tray + dessert', '$24', 'med-chicken']],
      packs: [['Mezze Spread', 'Dips, salads, pita, falafel', 16], ['Grill Feast', 'Chicken & kofta, rice, salad', 22], ['Family Banquet', 'Everything + desserts', 29]],
      dishes: ['the charcoal chicken', 'the hummus', 'the mixed grill']
    },
    ita: {
      name: 'Italian', sub: 'Italian Kitchen · Since 1998', color: '#2a1d1a',
      hero: 'ita-hero', heroAlt: 'Pizza coming out of the wood-fired oven',
      title: 'Nonna’s recipes,<br><em>wood-fired daily.</em>',
      lede: 'Three generations, one oven. Hand-stretched pizza, fresh pasta and Sunday sauce simmered every morning.',
      menu: {
        'Favorites': [['ita-pizza', 'Margherita Napoletana', 'San Marzano tomato, fior di latte, basil.', '$16.95', "Chef's pick", ['V']], ['ita-spaghetti', 'Spaghetti Pomodoro', 'Slow tomato sauce, basil, parmigiano.', '$17.50', 'Most ordered', ['V']], ['ita-special', 'Spinach & Ricotta Pizza', 'White base, garlic, spinach, ricotta.', '$18.50', '', ['V']]],
        'Starters': [['ita-salad', 'Caprese Pasta Salad', 'Tomato, basil, mozzarella, olive oil.', '$11.50', '', ['V']], ['ita-pasta', 'Garden Penne', 'Penne, seasonal vegetables, garlic oil.', '$15.95', '', ['Vegan']], ['spread', 'Antipasti Board', 'Cured meats, cheeses, olives, bread.', '$19.95', 'Great to share', []]],
        'Mains': [['ita-steak', 'Bistecca alla Griglia', 'Grilled steak, asparagus, roasted tomato.', '$32.00', '', ['GF']], ['ita-spaghetti', 'Spaghetti Carbonara', 'Guanciale, egg yolk, pecorino.', '$19.50', '', []], ['ita-pizza', 'Quattro Formaggi', 'Four cheeses, honey drizzle.', '$18.95', '', ['V']]],
        'Desserts': [['ita-dessert', 'Tiramisu', 'Mascarpone, espresso, cocoa.', '$7.95', 'Family recipe', ['V']], ['latte', 'Cappuccino', 'Double shot, silky milk.', '$4.50', '', ['V']], ['ita-dessert', 'Cannoli (2 pcs)', 'Sweet ricotta, pistachio.', '$6.95', '', ['V']]]
      },
      week: [['Margherita Monday', 'Any classic pizza', '$12', 'ita-pizza'], ['Pasta Tuesday', 'Any pasta + house salad', '$18', 'ita-spaghetti'], ['Wine Wednesday', 'Half-price bottles with dinner', '50%', 'spread'], ['Family Thursday', '2 large pizzas, salad, garlic knots', '$45', 'ita-special'], ['Friday Fish', 'Linguine with clams', '$24', 'ita-pasta'], ['Steak Saturday', 'Bistecca for two', '$58', 'ita-steak'], ['Sunday Sauce', 'Meatballs & rigatoni, family size', '$39', 'ita-spaghetti']],
      packs: [['Pizza Party', 'Assorted pizzas, salad', 14], ['Pasta Bar', 'Two pastas, salad, bread', 19], ['Famiglia Feast', 'Antipasti, pasta, mains, dessert', 28]],
      dishes: ['the Margherita', 'the Sunday sauce', 'the tiramisu']
    },
    mex: {
      name: 'Mexican', sub: 'Mexican Kitchen · Since 1998', color: '#0f4542',
      hero: 'mex-hero', heroAlt: 'A row of freshly made tacos',
      title: 'Abuela’s recipes,<br><em>made fresh daily.</em>',
      lede: 'Three generations, one kitchen. Hand-pressed tortillas, slow-cooked carnitas and salsas made every morning.',
      menu: {
        'Favorites': [['mex-hero', 'Taco Trio', 'Carnitas, al pastor and pollo asado, onion, cilantro.', '$14.95', "Chef's pick", ['GF']], ['mex-tacos2', 'Beef Birria Tacos', 'Slow-braised beef, consommé for dipping.', '$16.50', 'Most ordered', []], ['mex-asada', 'Carne Asada Plate', 'Grilled steak, rice, beans, tortillas.', '$21.95', '', ['GF']]],
        'Starters': [['mex-salsa', 'Chips & Fresh Pico', 'House chips, pico de gallo, salsa roja.', '$6.95', '', ['Vegan', 'GF']], ['mex-tostadas', 'Ceviche Tostadas', 'Shrimp, lime, avocado, cucumber.', '$15.50', 'Great to share', ['GF']], ['mex-bowl', 'Street Corn Salad', 'Corn, tomato, cotija, chili-lime.', '$9.95', '', ['V', 'GF']]],
        'Mains': [['mex-special', 'Fish Tacos Baja', 'Beer-battered fish, cabbage, chipotle crema.', '$17.50', '', []], ['mex-tacos', 'Veggie Tacos', 'Roasted peppers, black beans, queso fresco.', '$13.95', '', ['V']], ['mex-asada', 'Fajitas for Two', 'Steak & chicken, peppers, all the fixings.', '$34.00', '', ['GF']]],
        'Desserts': [['latte', 'Café de Olla', 'Cinnamon & piloncillo coffee.', '$4.50', '', ['Vegan']], ['ita-dessert', 'Tres Leches Cake', 'Three milks, whipped cream.', '$6.95', 'Family recipe', ['V']], ['med-dessert', 'Churros', 'Cinnamon sugar, chocolate dip.', '$6.50', '', ['V']]]
      },
      week: [['Molcajete Monday', 'Sizzling molcajete for two', '$32', 'mex-asada'], ['Taco Tuesday', '$2.50 street tacos all day', '$2.50', 'mex-hero'], ['Wing Wednesday', 'Chipotle wings + margarita', '$15', 'mex-bowl'], ['Family Thursday', 'Taco kit for 4: meats, tortillas, sides', '$48', 'mex-tacos'], ['Fish Friday', 'Baja fish tacos plate', '$15', 'mex-special'], ['Birria Saturday', 'Birria tacos + consommé', '$16', 'mex-tacos2'], ['Menudo Sunday', 'House menudo or pozole', '$14', 'mex-bowl']],
      packs: [['Taco Bar', 'Two meats, tortillas, salsas', 15], ['Fiesta Platter', 'Tacos, rice, beans, chips', 20], ['Full Fiesta', 'Everything + dessert & aguas frescas', 27]],
      dishes: ['the taco trio', 'the birria', 'the salsas']
    }
  };
  var HOURS = [['Monday', '11:00', '21:00'], ['Tuesday', '11:00', '21:00'], ['Wednesday', '11:00', '21:00'], ['Thursday', '11:00', '21:00'], ['Friday', '11:00', '22:00'], ['Saturday', '11:00', '22:00'], ['Sunday', '12:00', '20:00']];
  var REV = [['Maria G.', 'a week ago', 'Best family spot in town. We come every Friday and they know our order by heart. Try {0}!'], ['Josh T.', '2 weeks ago', 'Ordered online for pickup, ready in 12 minutes and still hot. {1} is unreal.'], ['Priya S.', 'a month ago', 'They catered our office lunch for 40 people. On time, generous portions, everyone asked where it was from.'], ['Dan R.', '3 weeks ago', 'Feels like eating at a friend’s house. Owner came by our table to check on us.'], ['Alicia M.', '2 months ago', 'Fresh, fast and fairly priced. {2} is my weekly treat.'], ['Kevin L.', 'a month ago', 'Great vegetarian options and they’re careful with allergies. Kids love it too.']];
  var AV = ['#e07a5f', '#3d405b', '#81b29a', '#f2cc8f', '#6d597a', '#457b9d'];
  var FAQ = [['Do you take reservations?', 'Walk-ins are always welcome. For groups of 8 or more, call us and we will save you a table.'], ['Do you offer delivery?', 'Yes. Order online for pickup or delivery. Pickup orders are usually ready in about 15 minutes.'], ['Do you have vegetarian or gluten-free options?', 'Yes. Look for V, Vegan and GF on the menu, and tell us about any allergy when you order.'], ['How much notice do you need for catering?', 'At least 48 hours for groups under 50, and one week for larger events.'], ['Is there parking?', 'Free street parking on Avenida Del Mar and a public lot one block away.'], ['Do you sell gift cards?', 'Yes, in the restaurant and through our online ordering page.']];

  var cur = 'med', tab = 'Favorites';
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function laNow() {
    try { var s = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }); return new Date(s); } catch (e) { return new Date(); }
  }
  var now = laNow(), todayIdx = (now.getDay() + 6) % 7;

  /* ---------- Render ---------- */
  function renderMenu() {
    var d = C[cur];
    $('#menu-tabs').innerHTML = Object.keys(d.menu).map(function (k) { return '<button role="tab" aria-selected="' + (k === tab) + '" data-tab="' + k + '">' + k + '</button>'; }).join('');
    $('#dishes').innerHTML = d.menu[tab].map(function (m, i) {
      return '<article class="dish" style="animation-delay:' + (i * 70) + 'ms"><div class="dish__img"><img src="' + A + m[0] + '.jpg" alt="' + m[1] + '" loading="lazy">' + (m[4] ? '<span class="dish__tag">' + m[4] + '</span>' : '') + '</div>' +
        '<div class="dish__body"><div class="dish__top"><h3>' + m[1] + '</h3><span class="price">' + m[3] + '</span></div><p>' + m[2] + '</p><div class="dish__meta">' + m[5].map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div></div></article>';
    }).join('');
  }
  function showSpecial(i) {
    var w = C[cur].week[i];
    $('#special-day').textContent = i === todayIdx ? "Today's Special" : HOURS[i][0] + "'s Special";
    $('#special-title').textContent = w[0];
    $('#special-desc').textContent = w[1] + '. Available all day ' + HOURS[i][0] + ' for dine-in, pickup or delivery.';
    $('#special-price').textContent = w[2];
    var img = $('#special-img'); img.style.opacity = 0; setTimeout(function () { img.src = A + w[3] + '.jpg'; img.alt = w[0]; img.style.opacity = 1; }, reduce ? 0 : 200);
  }
  function renderWeek() {
    $('#week').innerHTML = C[cur].week.map(function (w, i) {
      return '<li class="' + (i === todayIdx ? 'today' : '') + '" data-day="' + i + '" tabindex="0"><span class="d">' + HOURS[i][0].slice(0, 3) + '</span><span><b>' + w[0] + (i === todayIdx ? '<span class="now">TODAY</span>' : '') + '</b><small>' + w[1] + '</small></span><span class="p">' + w[2] + '</span></li>';
    }).join('');
    showSpecial(todayIdx);
  }
  function renderCatering() {
    var p = C[cur].packs;
    $('#packs').innerHTML = p.map(function (k) { return '<div class="pack"><b>' + k[0] + '</b><small>' + k[1] + '</small><span>' + money(k[2]) + ' / person</span></div>'; }).join('');
    $('#c-pack').innerHTML = p.map(function (k, i) { return '<option value="' + i + '">' + k[0] + ' · ' + money(k[2]) + '/person</option>'; }).join('');
    est();
  }
  function est() { var p = C[cur].packs[+$('#c-pack').value || 0]; var g = Math.max(10, +$('#c-guests').value || 10); $('#c-est').textContent = money(p[2] * g); }
  function renderReviews() {
    var d = C[cur].dishes;
    var g = '<svg class="rv__g" viewBox="0 0 48 48" aria-label="Google review"><path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/></svg>';
    $('#rgrid').innerHTML = REV.map(function (r, i) {
      var txt = r[2].replace('{0}', d[0]).replace('{1}', d[1].charAt(0).toUpperCase() + d[1].slice(1)).replace('{2}', d[2].charAt(0).toUpperCase() + d[2].slice(1));
      return '<article class="rv"><div class="rv__head"><span class="rv__av" style="background:' + AV[i] + '">' + r[0][0] + '</span><span><b>' + r[0] + '</b><small>' + r[1] + '</small></span>' + g + '</div><span class="gstars">★★★★★</span><p>' + txt + '</p></article>';
    }).join('');
  }
  function fmt(t) { var h = +t.split(':')[0], m = t.split(':')[1]; return (h % 12 || 12) + (m !== '00' ? ':' + m : '') + (h < 12 ? ' am' : ' pm'); }
  function renderHours() {
    $('#hours').innerHTML = HOURS.map(function (h, i) { return '<tr class="' + (i === todayIdx ? 'today' : '') + '"><td>' + h[0] + (i === todayIdx ? ' (today)' : '') + '</td><td>' + fmt(h[1]) + ' – ' + fmt(h[2]) + '</td></tr>'; }).join('');
    var h = HOURS[todayIdx], mins = now.getHours() * 60 + now.getMinutes();
    var o = +h[1].split(':')[0] * 60, c = +h[2].split(':')[0] * 60;
    var open = mins >= o && mins < c;
    $('#open-status').textContent = open ? 'Open now · until ' + fmt(h[2]) : (mins < o ? 'Opens today at ' + fmt(h[1]) : 'Closed now · opens tomorrow at ' + fmt(HOURS[(todayIdx + 1) % 7][1]));
    $('#open-dot').classList.toggle('closed', !open);
  }
  function renderFaq() { $('#faq').innerHTML = FAQ.map(function (f, i) { return '<details' + (i === 0 ? ' open' : '') + '><summary>' + f[0] + '</summary><p>' + f[1] + '</p></details>'; }).join(''); }
  function schema() {
    var d = C[cur];
    var data = [{
      '@context': 'https://schema.org', '@type': 'Restaurant', name: 'The Family Table', servesCuisine: d.name, priceRange: '$$',
      telephone: '+1-949-555-0123', url: location.href.split('#')[0], image: new URL(A + d.hero + '.jpg', location.href).href,
      address: { '@type': 'PostalAddress', streetAddress: '123 Avenida Del Mar', addressLocality: 'San Clemente', addressRegion: 'CA', postalCode: '92672', addressCountry: 'US' },
      openingHoursSpecification: HOURS.map(function (h) { return { '@type': 'OpeningHoursSpecification', dayOfWeek: h[0], opens: h[1], closes: h[2] }; }),
      acceptsReservations: 'True', hasMenu: location.href.split('#')[0] + '#menu',
      potentialAction: { '@type': 'OrderAction', target: 'https://your-ordering-page.example' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '620' }
    }, {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQ.map(function (f) { return { '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } }; })
    }];
    var json = JSON.stringify(data, null, 2);
    $('#schema').textContent = json;
    $('#schema-view').textContent = json;
  }
  function setCuisine(k) {
    cur = k; tab = 'Favorites';
    var d = C[k];
    document.body.dataset.cuisine = k;
    $('#theme-color').setAttribute('content', d.color);
    $('#logo-sub').textContent = d.sub;
    var img = $('#hero-img'); img.src = A + d.hero + '.jpg'; img.alt = d.heroAlt; img.classList.remove('swap'); void img.offsetWidth; img.classList.add('swap');
    $('#hero-title').innerHTML = d.title; $('#hero-sub').textContent = d.lede;
    $$('.switcher button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.c === k); });
    renderMenu(); renderWeek(); renderCatering(); renderReviews(); schema();
    try { localStorage.setItem('cuisine', k); } catch (e) {}
  }

  /* ---------- Events ---------- */
  $('#menu-tabs').addEventListener('click', function (e) { var b = e.target.closest('[data-tab]'); if (b) { tab = b.dataset.tab; renderMenu(); } });
  $('#week').addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) showSpecial(+li.dataset.day); });
  $('#week').addEventListener('keydown', function (e) { if (e.key === 'Enter') { var li = e.target.closest('li'); if (li) showSpecial(+li.dataset.day); } });
  $$('.switcher button').forEach(function (b) { b.addEventListener('click', function () { setCuisine(b.dataset.c); }); });
  $('#c-guests').addEventListener('input', est); $('#c-pack').addEventListener('change', est);
  var dt = new Date(); dt.setDate(dt.getDate() + 7); $('#c-date').value = dt.toISOString().slice(0, 10);
  $('#cform').addEventListener('submit', function (e) { e.preventDefault(); $('#c-ok').hidden = false; });
  var modal = $('#order-modal');
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-order]'); if (!o) return; e.preventDefault();
    if (modal.showModal) modal.showModal(); else alert('This opens your online ordering page.');
  });
  $('#order-close').addEventListener('click', function () { modal.close(); });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
  var burger = $('#burger'), mnav = $('#mnav');
  burger.addEventListener('click', function () { var o = mnav.classList.toggle('open'); burger.setAttribute('aria-expanded', String(o)); });
  $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { mnav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }); });
  var seo = $('#seo'), scrim = $('#scrim');
  function seoToggle(open) { seo.classList.toggle('open', open); seo.setAttribute('aria-hidden', String(!open)); scrim.hidden = !open; if (open) $('#seo-close').focus(); }
  $('#seo-open').addEventListener('click', function () { seoToggle(true); });
  $('#seo-close').addEventListener('click', function () { seoToggle(false); });
  scrim.addEventListener('click', function () { seoToggle(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') seoToggle(false); });

  renderHours(); renderFaq();
  var saved = null; try { saved = localStorage.getItem('cuisine'); } catch (e) {}
  setCuisine(C[saved] ? saved : 'med');
})();
