(function () {
  'use strict';

  /* ---------- Icons ---------- */
  var ICONS = {
    vitality: '<path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z"/>',
    male: '<circle cx="10" cy="14" r="5"/><path d="M14 10l6-6M15 4h5v5"/>',
    female: '<circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/>',
    mood: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2"/><path d="M9 9.5h.01M15 9.5h.01"/>',
    daily: '<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="m9.5 9.5 5 5"/>',
    memory: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>',
    muscle: '<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',
    joints: '<circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="m8.8 8.8 6.4 6.4"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/><path d="M8 12h2l1-2 2 4 1-2h2"/>',
    immune: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    sugar: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M10 15a2 2 0 0 0 2 2"/>',
    prostate: '<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z"/><path d="M5 19 13 11"/>',
    sleep: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/><path d="M16 3h3l-3 3h3"/>',
    vision: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>'
  };
  var icon = function (k) { return '<svg viewBox="0 0 24 24">' + ICONS[k] + '</svg>'; };

  /* ---------- Products (order = goal grid order) ---------- */
  var P = [
    { id: 'multivitamin', name: 'Multivitamin', area: 'Essential integration', icon: 'daily', g: 'body', price: 54, img: 'images/multivitamin.webp', rating: 4.8, reviews: 16,
      benefit: 'Everyday energy & cellular vitality', desc: 'With 13 vitamins, 5 minerals, CoQ10, PQQ and NR: a complete daily formula designed to support energy and vitality every day.', chips: ['13 vitamins', '5 minerals', 'CoQ10', 'PQQ', 'NR'] },
    { id: 'boswellia', name: 'Boswellia', area: 'Joints', icon: 'joints', g: 'body', price: 44, img: 'images/boswellia.webp', rating: 4.8, reviews: 15,
      benefit: 'Flexible, comfortable joints', desc: 'Standardized Boswellia serrata extract to support joint flexibility and comfortable, everyday movement.', chips: ['Boswellia serrata', 'Standardized', 'Daily mobility'] },
    { id: 'black-garlic', name: 'Black Garlic', area: 'Heart', icon: 'heart', g: 'body', price: 39, img: 'images/black-garlic.webp', rating: 4.7, reviews: 8,
      benefit: 'Heart & circulation support', desc: 'Aged black garlic extract, chosen to support a healthy heart and normal circulation — without the odour.', chips: ['Aged black garlic', 'Odourless', 'Heart care'] },
    { id: 'carob', name: 'Carob', area: 'Blood sugar', icon: 'sugar', g: 'body', price: 35, img: 'images/carob.webp', rating: 4.7, reviews: 7,
      benefit: 'Healthy glucose balance', desc: 'Carob fruit extract to help maintain balanced blood sugar levels as part of a healthy diet.', chips: ['Carob extract', 'Glucose balance', 'Plant-based'] },
    { id: 'creatine', name: 'Creatine', area: 'Muscles and strength', icon: 'muscle', g: 'body', price: 24, img: 'images/creatine.webp', rating: 4.7, reviews: 9,
      benefit: 'Maintains strength & muscle tone', desc: 'Pure creatine in easy capsules to help maintain muscle strength and performance after 50.', chips: ['Creatine monohydrate', 'Strength', 'Easy capsules'] },
    { id: 'echinacea', name: 'Echinacea', area: 'Immune system', icon: 'immune', g: 'body', price: 30, img: 'images/echinacea.webp', rating: 4.8, reviews: 10,
      benefit: 'Natural immune defences', desc: 'Standardized Echinacea extract to support your natural defences all year round.', chips: ['Echinacea', 'Standardized', 'Seasonal support'] },
    { id: 'lutein', name: 'Lutein + Zeaxanthin', area: 'Vision', icon: 'vision', g: 'body', price: 37, img: 'images/lutein.webp', rating: 4.8, reviews: 9,
      benefit: 'Supports healthy vision', desc: 'Lutein and Zeaxanthin, the key carotenoids of the eye, to help protect and maintain healthy vision.', chips: ['Lutein', 'Zeaxanthin', 'Eye health'] },
    { id: 'bacopa', name: 'Bacopa', area: 'Memory and concentration', icon: 'memory', g: 'mind', price: 59, img: 'images/bacopa.webp', rating: 4.8, reviews: 12,
      benefit: 'Memory & concentration', desc: 'Standardized Bacopa monnieri to support memory, focus and mental clarity in everyday life.', chips: ['Bacopa monnieri', 'Standardized', 'Focus'] },
    { id: 'melatonin', name: 'Melatonin + Valerian + Magnesium', short: 'Sleep Formula', area: 'Sleep', icon: 'sleep', g: 'mind', price: 29, img: 'images/melatonin.webp', rating: 4.9, reviews: 13,
      benefit: 'Fall asleep faster, wake refreshed', desc: 'Melatonin helps reduce the time it takes to fall asleep, with Valerian and Magnesium for a calm, restful night.', chips: ['Melatonin', 'Valerian', 'Magnesium'] },
    { id: 'saffron', name: 'Saffron', area: 'Mood', icon: 'mood', g: 'mind', price: 42, img: 'images/saffron.webp', rating: 4.9, reviews: 18,
      benefit: 'Mental well-being & balanced mood', desc: 'Affron® standardized saffron with Magnesium bisglycinate and Vitamins B6 & B12 for mental well-being and a balanced mood.', chips: ['Affron®', 'Magnesium', 'B6 & B12'] },
    { id: 'saw-palmetto', name: 'Saw Palmetto', area: 'Prostate', icon: 'prostate', g: 'hs', price: 34, img: 'images/saw-palmetto.webp', rating: 4.8, reviews: 11,
      benefit: 'Prostate & urinary comfort', desc: 'Standardized Saw Palmetto (Serenoa repens) to support prostate health and urinary comfort.', chips: ['Serenoa repens', 'Standardized', "Men's health"] },
    { id: 'damiana-her', name: 'Damiana for Her', area: 'Female vitality', icon: 'female', g: 'hs', price: 32, img: 'images/damiana-her.webp', rating: 4.8, reviews: 14,
      benefit: 'Balance, energy & feminine vitality', desc: 'Standardized Damiana formulated for women, to support energy, balance and feminine vitality.', chips: ['Damiana', 'For women', 'Vitality'] },
    { id: 'damiana', name: 'Damiana', area: 'Male vitality', icon: 'male', g: 'hs', price: 32, img: 'images/damiana.webp', rating: 4.9, reviews: 21,
      benefit: 'Energy, vitality & natural drive', desc: 'Liboost® standardized Damiana with L-Citrulline and Vitamins B5 & B6: energy, vitality and natural drive in a single formula.', chips: ['Liboost®', 'L-Citrulline', 'B5 & B6'] }
  ];
  var byId = {};
  P.forEach(function (p, i) { p.i = i; byId[p.id] = p; });

  var PAIRS = {
    'damiana': ['saw-palmetto', 'creatine', 'multivitamin'], 'damiana-her': ['saffron', 'multivitamin', 'melatonin'],
    'saffron': ['melatonin', 'bacopa', 'multivitamin'], 'multivitamin': ['bacopa', 'lutein', 'echinacea'],
    'bacopa': ['saffron', 'multivitamin', 'lutein'], 'creatine': ['boswellia', 'multivitamin', 'damiana'],
    'boswellia': ['creatine', 'black-garlic', 'multivitamin'], 'black-garlic': ['carob', 'boswellia', 'multivitamin'],
    'echinacea': ['multivitamin', 'melatonin', 'lutein'], 'carob': ['black-garlic', 'multivitamin', 'creatine'],
    'saw-palmetto': ['damiana', 'black-garlic', 'multivitamin'], 'melatonin': ['saffron', 'bacopa', 'multivitamin'],
    'lutein': ['multivitamin', 'bacopa', 'echinacea']
  };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var euro = function (n) { return '€' + n.toFixed(2).replace('.', ','); };
  var nm = function (p) { return p.short || p.name; };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ---------- Menus ---------- */
  $('#megaList').innerHTML = P.map(function (p) {
    return '<a href="#areas" data-goal="' + p.id + '"><i>' + icon(p.icon) + '</i>' + p.area + '</a>';
  }).join('');
  $('#mnavAreas').innerHTML = P.map(function (p) {
    return '<a href="#areas" data-goal="' + p.id + '">' + p.area + '</a>';
  }).join('');
  var mf = $('.mega__feature'); if (mf) mf.setAttribute('data-goal', 'damiana');

  /* ---------- Shop by goal ---------- */
  var goalGrid = $('#goalGrid');
  goalGrid.innerHTML = P.map(function (p) {
    return '<button class="gt" data-id="' + p.id + '" data-g="' + p.g + '"><i>' + icon(p.icon) + '</i><b>' + p.area + '</b><small>' + p.name + '</small></button>';
  }).join('') + '<a class="gt gt--all" href="#quiz"><i>' + icon('grid') + '</i><b>Not sure?</b><small>Find my formula · 60 sec</small></a>';

  var current = byId.multivitamin;
  function selectGoal(id, noAnim) {
    var p = byId[id]; if (!p) return;
    current = p;
    $$('.gt[data-id]').forEach(function (t) { t.classList.toggle('is-active', t.dataset.id === id); });
    var img = $('#gpImg');
    var apply = function () {
      img.src = p.img; img.alt = 'Horizon 120 ' + p.name;
      $('#gpChip').textContent = p.area;
      $('#gpChipIcon').innerHTML = icon(p.icon);
      $('#gpIndex').textContent = pad(p.i + 1);
      $('#gpEyebrow').textContent = 'The formula for ' + p.area.toLowerCase();
      $('#gpName').textContent = p.name;
      $('#gpRating').textContent = p.rating + ' · ' + p.reviews + ' reviews';
      $('#gpDesc').textContent = p.desc;
      $('#gpChips').innerHTML = p.chips.map(function (c) { return '<span>' + c + '</span>'; }).join('');
      $('#gpPrice').textContent = euro(p.price);
      $('#gpSub').textContent = 'or ' + euro(p.price * 0.85) + ' with Subscribe & Save';
      $('#gpPairs').innerHTML = PAIRS[p.id].slice(0, 2).map(function (r) {
        var q = byId[r]; return '<button data-goal="' + q.id + '"><img src="' + q.img + '" alt="">' + nm(q) + '</button>';
      }).join('');
      // sticky bar
      $('#stImg').src = p.img; $('#stName').textContent = nm(p); $('#stPrice').textContent = euro(p.price);
      requestAnimationFrame(function () { img.classList.remove('swap'); });
    };
    if (noAnim) { apply(); return; }
    img.classList.add('swap');
    setTimeout(apply, 220);
  }
  selectGoal('multivitamin', true);

  goalGrid.addEventListener('click', function (e) {
    var t = e.target.closest('.gt[data-id]'); if (t) selectGoal(t.dataset.id);
  });
  $('#goalFilters').addEventListener('click', function (e) {
    var b = e.target.closest('.gf'); if (!b) return;
    var g = b.dataset.g;
    $$('.gf').forEach(function (x) { x.classList.toggle('is-active', x === b); });
    $$('.gt[data-id]').forEach(function (t) { t.classList.toggle('is-hidden', g !== 'all' && t.dataset.g !== g); });
    if (g !== 'all' && current.g !== g) selectGoal($('.gt[data-g="' + g + '"]').dataset.id);
  });
  function visibleIds() { return $$('.gt[data-id]:not(.is-hidden)').map(function (t) { return t.dataset.id; }); }
  function stepGoal(d) { var v = visibleIds(); var i = v.indexOf(current.id); selectGoal(v[(i + d + v.length) % v.length]); }
  $('#gpPrev').addEventListener('click', function () { stepGoal(-1); });
  $('#gpNext').addEventListener('click', function () { stepGoal(1); });
  $('#gpAdd').addEventListener('click', function () { addItem(current.id, 1, 0); });
  $('#stAdd').addEventListener('click', function () { addItem(current.id, 1, 0); });

  // any [data-goal] link (menus, footer, pairs) selects that goal
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-goal]'); if (!a) return;
    var id = a.dataset.goal;
    $$('.gf').forEach(function (x) { x.classList.toggle('is-active', x.dataset.g === 'all'); });
    $$('.gt').forEach(function (t) { t.classList.remove('is-hidden'); });
    selectGoal(id);
    closeMenu();
    if (a.closest('.gp-pairs')) return;
  });

  /* ---------- Quiz ---------- */
  $$('[data-ic]').forEach(function (i) { i.innerHTML = icon(i.dataset.ic); });
  var answers = [], recIds = [], qStep = 1;
  var QMAP = {
    energy: { m: ['damiana', 'creatine'], f: ['damiana-her', 'creatine'] },
    mind: { m: ['bacopa', 'saffron'], f: ['bacopa', 'saffron'] },
    joints: { m: ['boswellia', 'creatine'], f: ['boswellia', 'creatine'] },
    sleep: { m: ['melatonin', 'saffron'], f: ['melatonin', 'saffron'] },
    heart: { m: ['black-garlic', 'carob'], f: ['black-garlic', 'carob'] },
    mood: { m: ['saffron', 'melatonin'], f: ['saffron', 'damiana-her'] }
  };
  function quizGo(step) {
    qStep = step;
    $$('.quiz__step').forEach(function (s) { s.classList.toggle('is-active', +s.dataset.step === step); });
    $('#quizBar').style.width = Math.min(100, step * 25) + '%';
    $('#quizNum').textContent = step < 4 ? step + ' / 3' : 'Done';
    $('#quizBack').classList.toggle('show', step > 1);
    $$('#quizSteps li').forEach(function (li, i) {
      li.classList.toggle('is-active', i === step - 1);
      li.classList.toggle('is-done', i < step - 1);
    });
  }
  quizGo(1);
  $('#quizCard').addEventListener('click', function (e) {
    var b = e.target.closest('.quiz__opts button'); if (!b) return;
    var step = +b.closest('.quiz__step').dataset.step;
    $$('button', b.parentNode).forEach(function (x) { x.classList.toggle('is-picked', x === b); });
    answers[step - 1] = b.dataset.v;
    if (step === 1) {
      var imgs = $$('#quizStack img'), ids = QMAP[b.dataset.v].m.concat(['multivitamin']);
      imgs.forEach(function (im, i) { im.src = byId[ids[i]].img; });
    }
    if (step < 3) { setTimeout(function () { quizGo(step + 1); }, 180); return; }
    recIds = QMAP[answers[0]][answers[1]].slice();
    if (answers[2] === 'no') recIds.push('multivitamin');
    var total = 0;
    $('#quizRecs').innerHTML = recIds.map(function (id, i) {
      var p = byId[id]; total += p.price;
      return '<div class="rec" style="animation-delay:' + (i * 90) + 'ms"><img src="' + p.img + '" alt=""><div><span class="eyebrow">' + p.area + '</span><b>' + nm(p) + '</b><small>' + p.benefit + '</small></div>' +
        '<div class="rec__foot"><span>' + euro(p.price) + '</span><button data-up="' + p.id + '" aria-label="Add ' + p.name + '">+</button></div></div>';
    }).join('');
    $('#quizWas').textContent = euro(total);
    $('#quizNow').textContent = euro(total * 0.9);
    setTimeout(function () { quizGo(4); }, 180);
  });
  $('#quizRecs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-up]'); if (b) addItem(b.dataset.up, 1, 0);
  });
  $('#quizBack').addEventListener('click', function () { if (qStep > 1) quizGo(qStep - 1); });
  $('#quizAddAll').addEventListener('click', function () {
    recIds.forEach(function (id) { addItem(id, 1, 0.10, true); });
    openCart(); toast('Your routine was added — 10% off');
  });
  $('#quizRestart').addEventListener('click', function () { answers = []; $$('.is-picked').forEach(function (x) { x.classList.remove('is-picked'); }); quizGo(1); });

  /* ---------- Why Horizon: link cards to pins ---------- */
  $$('.wf').forEach(function (card) {
    var pin = $('.pin--' + card.dataset.pin);
    card.addEventListener('mouseenter', function () { card.classList.add('is-hot'); if (pin) pin.classList.add('is-hot'); });
    card.addEventListener('mouseleave', function () { card.classList.remove('is-hot'); if (pin) pin.classList.remove('is-hot'); });
  });

  /* ---------- Source to capsule: auto-advancing stages ---------- */
  var jTabs = $$('.jt__tab'), jPanels = $$('.jp'), jI = 0, jTimer = null, jStarted = false;
  function setStage(i) {
    jI = (i + jPanels.length) % jPanels.length;
    jTabs.forEach(function (t, k) {
      t.classList.remove('is-active');
      t.classList.toggle('is-done', k < jI);
      t.setAttribute('aria-selected', k === jI ? 'true' : 'false');
    });
    void jTabs[jI].offsetWidth;
    jTabs[jI].classList.add('is-active');
    jPanels.forEach(function (p, k) { p.classList.toggle('is-active', k === jI); });
    clearTimeout(jTimer);
    jTimer = setTimeout(function () { setStage(jI + 1); }, 7000);
  }
  jTabs.forEach(function (t, k) { t.addEventListener('click', function () { setStage(k); }); });
  var jStage = $('#jStage');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting && !jStarted) { jStarted = true; setStage(0); }
      });
    }, { threshold: 0.3 }).observe(jStage);
  } else { setStage(0); }

  /* ---------- Reviews ---------- */
  var REVIEWS = [
    { ph: 'marco', n: 'Marco R.', a: 58, c: 'Milan', p: 'damiana', h: 'my energy is back', t: 'After three weeks I noticed real, steady energy in the afternoons. I feel like myself again.' },
    { ph: 'giulia', n: 'Giulia B.', a: 61, c: 'Turin', p: 'saffron', h: 'calmer & brighter', t: 'I was skeptical, but my mood feels more even and I sleep better too. It has become part of my morning.' },
    { ph: 'antonio', n: 'Antonio L.', a: 66, c: 'Rome', p: 'boswellia', h: 'morning walks are back', t: 'My knees have been the issue for years. Two capsules with breakfast and mornings are so much easier.' },
    { ph: 'lucia', n: 'Lucia M.', a: 54, c: 'Bologna', p: 'bacopa', h: 'sharper at work', t: 'Names, appointments, details — I feel more focused. Paired with the Multivitamin, it is effortless.' },
    { ph: 'franco', n: 'Franco D.', a: 63, c: 'Naples', p: 'melatonin', h: 'finally sleeping through', t: 'Falling asleep used to take an hour. Now I am out within 20 minutes and wake up without grogginess.' },
    { ph: 'elena', n: 'Elena V.', a: 57, c: 'Verona', p: 'multivitamin', h: 'quality you can feel', t: 'You can tell this is formulated for our age. Fewer capsules than my old brand and I feel the difference.' },
    { ph: 'paolo', n: 'Paolo S.', a: 69, c: 'Genoa', p: 'black-garlic', h: 'no garlic breath!', t: 'My doctor suggested garlic for my heart. This one has no smell at all and the quality is obvious.' },
    { ph: 'rita', n: 'Rita C.', a: 59, c: 'Florence', p: 'damiana-her', h: 'a real game changer', t: 'I feel more balanced and more like me. Discreet delivery and lovely, premium packaging.' }
  ];
  $('#rvTotal').textContent = pad(REVIEWS.length);
  $('#rvThumbs').innerHTML = REVIEWS.map(function (r, i) {
    return '<button data-i="' + i + '" aria-label="Review by ' + r.n + '"><img src="images/customers/' + r.ph + '.webp" alt="' + r.n + '" loading="lazy"><em><img src="' + byId[r.p].img + '" alt=""></em></button>';
  }).join('');
  var rvI = 0, rvTimer;
  function setReview(i) {
    rvI = (i + REVIEWS.length) % REVIEWS.length;
    var r = REVIEWS[rvI], p = byId[r.p];
    $$('#rvThumbs button').forEach(function (b, k) { b.classList.toggle('is-active', k === rvI); });
    var q = $('#rvQuote'), img = $('#rvImg'), hl = $('#rvHighlight');
    q.classList.add('fade'); img.classList.add('swap'); hl.style.opacity = 0;
    setTimeout(function () {
      img.src = p.img; img.alt = 'Horizon 120 ' + p.name;
      hl.textContent = r.h; hl.style.opacity = 1;
      $('#rvProdName').textContent = nm(p);
      $('#rvTag').dataset.goal = p.id;
      $('#rvText').textContent = '“' + r.t + '”';
      $('#rvName').textContent = r.n;
      $('#rvAvatar').src = 'images/customers/' + r.ph + '.webp'; $('#rvAvatar').alt = r.n;
      $('#rvMeta').textContent = r.a + ' · ' + r.c + ' · Verified buyer of ' + nm(p);
      $('#rvIdx').textContent = pad(rvI + 1);
      q.classList.remove('fade'); img.classList.remove('swap');
      var bar = $('#rvBar'); bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run');
    }, 280);
    clearTimeout(rvTimer);
    rvTimer = setTimeout(function () { setReview(rvI + 1); }, 6300);
  }
  $('#rvThumbs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setReview(+b.dataset.i); });
  $('#rvPrev').addEventListener('click', function () { setReview(rvI - 1); });
  $('#rvNext').addEventListener('click', function () { setReview(rvI + 1); });
  setReview(0);

  /* ---------- Cart ---------- */
  var STORE = 'h120-cart';
  var state = { lines: [], sub: false };
  try { var saved = JSON.parse(localStorage.getItem(STORE)); if (saved && saved.lines) state = saved; } catch (e) {}
  state.lines = state.lines.filter(function (l) { return byId[l.id]; });
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }

  var cartEl = $('#cart'), overlay = $('#overlay');
  function openCart() { cartEl.classList.add('is-open'); overlay.classList.add('is-open'); cartEl.setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll'); }
  function closeCart() { cartEl.classList.remove('is-open'); overlay.classList.remove('is-open'); cartEl.setAttribute('aria-hidden', 'true'); document.body.classList.remove('no-scroll'); }
  $('#cartOpen').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeCart(); closeMenu(); } });
  cartEl.addEventListener('click', function (e) { if (e.target.closest('[data-close-cart]')) closeCart(); });

  function addItem(id, qty, disc, silent) {
    qty = qty || 1; disc = disc || 0;
    var l = state.lines.filter(function (x) { return x.id === id && x.disc === disc; })[0];
    if (l) l.qty += qty; else state.lines.push({ id: id, qty: qty, disc: disc });
    save(); renderCart();
    if (!silent) openCart();
    var c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    setTimeout(function () { c.classList.remove('bump'); }, 300);
  }
  function linePrice(l) {
    var base = byId[l.id].price * l.qty;
    return { base: base, after: base * (1 - l.disc) * (state.sub ? 0.85 : 1) };
  }

  function renderCart() {
    var count = 0, sub = 0, full = 0;
    $('#cartItems').innerHTML = state.lines.map(function (l, i) {
      var p = byId[l.id], pr = linePrice(l);
      count += l.qty; sub += pr.after; full += pr.base;
      var note = [];
      if (l.disc) note.push('Bundle −' + Math.round(l.disc * 100) + '%');
      if (state.sub) note.push('Subscription −15%');
      return '<li class="ci"><div class="ci__img"><img src="' + p.img + '" alt=""></div>' +
        '<div><h5>' + nm(p) + '</h5><small>' + p.area + ' · 30-day supply</small>' +
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

    var pct = sub >= 90 ? 100 : sub >= 60 ? 66.6 + (sub - 60) / 30 * 33.4 : sub / 60 * 66.6;
    $('#shipBar').style.width = pct + '%';
    var meter = $('.ship-meter');
    meter.classList.toggle('done', sub >= 60);
    meter.classList.toggle('done2', sub >= 90);
    $('#shipMsg').innerHTML = sub >= 90 ? '🎉 You unlocked <b>free shipping</b> + a <b>free gift</b>!'
      : sub >= 60 ? '✓ <b>Free shipping</b> unlocked! Add <b>' + euro(90 - sub) + '</b> for a free gift'
      : 'You\'re <b>' + euro(60 - sub) + '</b> away from <b>free shipping</b>';

    var inCart = state.lines.map(function (l) { return l.id; });
    var recs = [];
    (inCart.length ? inCart : ['damiana', 'multivitamin']).forEach(function (id) {
      (PAIRS[id] || []).forEach(function (r) { if (recs.indexOf(r) < 0 && inCart.indexOf(r) < 0) recs.push(r); });
    });
    ['multivitamin', 'saffron', 'boswellia', 'bacopa', 'melatonin'].forEach(function (r) { if (recs.indexOf(r) < 0 && inCart.indexOf(r) < 0) recs.push(r); });
    $('#upsellTrack').innerHTML = recs.slice(0, 6).map(function (id) {
      var p = byId[id];
      return '<div class="uc"><img src="' + p.img + '" alt=""><b>' + nm(p) + '</b><small>' + p.benefit + '</small>' +
        '<div class="uc__foot"><span>' + euro(p.price) + '</span><button data-up="' + p.id + '" aria-label="Add ' + p.name + '">+</button></div></div>';
    }).join('');
    $('#bundleOffer').classList.toggle('is-hidden', inCart.indexOf('multivitamin') >= 0 && inCart.indexOf('bacopa') >= 0);
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
      addItem(up.dataset.up, 1, 0, true); toast(nm(byId[up.dataset.up]) + ' added to your routine');
    }
  });
  $('#subToggle').addEventListener('change', function (e) { state.sub = e.target.checked; save(); renderCart(); });
  $('#bundleAdd').addEventListener('click', function () {
    addItem('multivitamin', 1, 0.15, true); addItem('bacopa', 1, 0.15, true); toast('50+ Essentials duo added — 15% off');
  });

  /* ---------- Header, sticky bar, announcements ---------- */
  var header = $('#header'), sticky = $('#stickyAtc'), panel = $('#goalPanel'), heroEl = $('.hero'), footer = $('.footer');
  function onScroll() {
    var y = window.scrollY, vh = window.innerHeight;
    header.classList.toggle('is-solid', y > 40);
    var pr = panel.getBoundingClientRect(), fr = footer.getBoundingClientRect();
    var panelInView = pr.top < vh && pr.bottom > 0;
    sticky.classList.toggle('is-visible', y > heroEl.offsetHeight * 0.8 && !panelInView && fr.top > vh);
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
  function closeMenu() { mnav.classList.remove('is-open'); mnav.setAttribute('aria-hidden', 'true'); if (!cartEl.classList.contains('is-open')) document.body.classList.remove('no-scroll'); }
  $('#menuOpen').addEventListener('click', function () { mnav.classList.add('is-open'); mnav.setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll'); });
  $('#menuClose').addEventListener('click', closeMenu);
  mnav.addEventListener('click', function (e) { if (e.target === mnav || e.target.closest('.mnav__links a')) closeMenu(); });

  /* ---------- Forms ---------- */
  $('#guideForm').addEventListener('submit', function (e) { e.preventDefault(); e.target.reset(); toast('Thank you! Your guide is on its way 📖'); });
  $('#footNews').addEventListener('submit', function (e) { e.preventDefault(); e.target.reset(); toast('Welcome! Your 10% code is on its way ✉️'); });

  /* ---------- Toast ---------- */
  var tt;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ---------- Reveal + counters ---------- */
  $$('.goals__head, .goal-panel, .quiz-shell, .why__head, .wf, .why-core, .journey__head, .jt, .seals, .rv-left, .rv-product, .rv-quote, .stat, .guide__grid, .accordion, .footer__cta').forEach(function (el) { el.classList.add('reveal'); });
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
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  renderCart();
})();
