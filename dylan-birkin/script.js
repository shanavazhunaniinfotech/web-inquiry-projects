(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };

  /* Colours: approximate screen colours; absorptance (0–1) used for the heat meter. */
  var COLOURS = [
    ['Surfmist', '#E4E2D5', .32], ['Classic Cream', '#E9DCB8', .32], ['Paperbark', '#CABFA4', .43], ['Evening Haze', '#C5C2AA', .43],
    ['Shale Grey', '#BDBFBA', .43], ['Dune', '#B1ADA3', .47], ['Bluegum', '#969799', .56], ['Windspray', '#888B8A', .58],
    ['Wallaby', '#7F7C78', .61], ['Gully', '#857E73', .6], ['Jasper', '#6C6153', .67], ['Basalt', '#6D6C6E', .65],
    ['Woodland Grey', '#4B4C46', .72], ['Ironstone', '#3E434C', .74], ['Deep Ocean', '#364152', .77], ['Cottage Green', '#304C3C', .77],
    ['Manor Red', '#5E1D0E', .73], ['Monument', '#323233', .73], ['Night Sky', '#1D1D1F', .96]
  ];
  var RIBS = { corro: [10, 2.2, 1.2], trim: [14, 3, 1.5], klip: [22, 4, 2] };
  var state = { colour: 'Monument', profile: 'trim' };

  function colour(n) { return COLOURS.filter(function (c) { return c[0] === n; })[0]; }
  $('#swatches').innerHTML = COLOURS.map(function (c) { return '<button type="button" class="sw" role="radio" aria-checked="' + (c[0] === state.colour) + '" data-c="' + c[0] + '"><i style="background-color:' + c[1] + '"></i>' + c[0] + '</button>'; }).join('');

  function paint() {
    var c = colour(state.colour);
    $('#roof').setAttribute('fill', c[1]); $('#ridge').setAttribute('fill', c[1]);
    var trim = $('#matchTrim').checked ? c[1] : '#E4E2D5';
    $('#gutter').setAttribute('fill', trim); $('#downpipe').setAttribute('fill', trim);
    $('#tag').textContent = c[0] + '® · ' + { corro: 'Corrugated', trim: 'Trimdek', klip: 'Klip-Lok' }[state.profile];
    var a = c[2], pct = Math.round((a - .3) / (.96 - .3) * 100);
    $('#heatBar').style.left = Math.max(3, Math.min(97, pct)) + '%';
    $('#heatLabel').textContent = a < .45 ? 'Cool' : a < .65 ? 'Moderate' : a < .8 ? 'Hot' : 'Very hot';
    $('#heatTip').textContent = a < .45 ? 'Light roofs reflect most of the sun. A great choice for Queensland summers.' : a < .65 ? 'A good balance between a darker look and staying cool.' : 'Darker roofs absorb more sun. Pair with a roof insulation blanket to keep the house cool.';
    $('#heat').setAttribute('opacity', a >= .65 ? Math.min(1, (a - .55) * 2.2) : 0);
    var r = RIBS[state.profile], pat = $('#ribs');
    pat.setAttribute('width', r[0]);
    var rects = pat.querySelectorAll('rect');
    rects[0].setAttribute('width', r[0]); rects[1].setAttribute('width', r[1]); rects[2].setAttribute('x', r[1]); rects[2].setAttribute('width', r[2]);
    $$('.sw').forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.c === state.colour)); });
    renderLead();
  }
  $('#swatches').addEventListener('click', function (e) { var b = e.target.closest('.sw'); if (!b) return; state.colour = b.dataset.c; paint(); });
  $$('.profile button').forEach(function (b) { b.addEventListener('click', function () { state.profile = b.dataset.p; $$('.profile button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); paint(); }); });
  $('#matchTrim').addEventListener('change', paint);

  /* Estimate (example SEQ ranges per m² incl. GST; Dylan sets his own) */
  var RATES = { reroof: [95, 130], 'new': [65, 90], storm: [110, 160] };
  var EXTRAS = { gutter: [55, 80, 'per lin. m'], insul: [12, 18], vent: [480, 700] };
  var est = { lo: 0, hi: 0, sqm: 0 };
  function money(n) { return '$' + (Math.round(n / 100) * 100).toLocaleString('en-AU'); }
  function val(name) { var el = document.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : null; }
  function calc() {
    var area = +$('#area').value, pitch = +val('pitch'), storeys = +val('storey'), job = val('job');
    $('#o-area').textContent = area + ' m²';
    var roof = area * pitch * (storeys === 2 ? .62 : 1.12); // double-storey: roof covers part of floor area; single adds eaves
    var r = RATES[job], access = storeys === 2 ? 1.12 : 1;
    var lo = roof * r[0] * access, hi = roof * r[1] * access, lines = [['Roofing (' + Math.round(roof) + ' m²)', money(lo) + ' – ' + money(hi)]];
    if ($('#x-gutter').checked) { var lm = Math.sqrt(roof) * 4 * .8; lo += lm * EXTRAS.gutter[0]; hi += lm * EXTRAS.gutter[1]; lines.push(['Gutters & downpipes', money(lm * EXTRAS.gutter[0]) + ' – ' + money(lm * EXTRAS.gutter[1])]); }
    if ($('#x-insul').checked) { lo += roof * EXTRAS.insul[0]; hi += roof * EXTRAS.insul[1]; lines.push(['Insulation blanket', money(roof * EXTRAS.insul[0]) + ' – ' + money(roof * EXTRAS.insul[1])]); }
    if ($('#x-vent').checked) { lo += EXTRAS.vent[0]; hi += EXTRAS.vent[1]; lines.push(['Whirlybirds ×2', money(EXTRAS.vent[0]) + ' – ' + money(EXTRAS.vent[1])]); }
    if (job === 'storm') lines.push(['Insurance claim help', 'Included']);
    est = { lo: lo, hi: hi, sqm: Math.round(roof), job: job };
    $('#lo').textContent = money(lo); $('#hi').textContent = money(hi); $('#sqm').textContent = Math.round(roof);
    $('#estList').innerHTML = lines.map(function (l) { return '<li><span>' + l[0] + '</span><span>' + l[1] + '</span></li>'; }).join('');
    renderLead();
  }
  $$('.est__form input').forEach(function (i) { i.addEventListener('input', calc); i.addEventListener('change', calc); });

  /* Service area */
  var SUBURBS = ['Brisbane', 'North Lakes', 'Redcliffe', 'Strathpine', 'Petrie', 'Kallangur', 'Burpengary', 'Morayfield', 'Caboolture', 'Bribie Island', 'Beerwah', 'Glass House Mountains', 'Caloundra', 'Kawana Waters', 'Mooloolaba', 'Maroochydore', 'Buderim', 'Sippy Downs', 'Nambour', 'Coolum Beach', 'Noosa Heads', 'Tewantin', 'Cooroy', 'Gympie', 'Tin Can Bay', 'Rainbow Beach', 'Tiaro', 'Maryborough', 'Hervey Bay', 'Chermside', 'Aspley', 'Albany Creek', 'Everton Park', 'Stafford', 'Kedron', 'Nundah', 'Sandgate', 'Brendale', 'Narangba', 'Deception Bay', 'Landsborough', 'Maleny', 'Palmwoods', 'Yandina', 'Eumundi', 'Peregian Beach'];
  $('#suburbs').innerHTML = SUBURBS.map(function (s) { return '<option value="' + s + '">'; }).join('');
  $('#q-sub').addEventListener('input', function () {
    var v = this.value.trim().toLowerCase(), m = $('#areaMsg');
    if (!v) { m.textContent = ''; m.className = 'area'; return; }
    var hit = SUBURBS.some(function (s) { return s.toLowerCase() === v; });
    m.textContent = hit ? '✓ Great, ' + this.value.trim() + ' is in our service area (Maryborough to Brisbane).' : 'We cover Maryborough to Brisbane. Not sure? Send it anyway and we\'ll let you know.';
    m.className = 'area ' + (hit ? 'ok' : 'no');
  });

  /* Photos */
  var photos = [];
  $('#files').addEventListener('change', function () {
    photos = [].slice.call(this.files || [], 0, 4).map(function (f) { return URL.createObjectURL(f); });
    $('#thumbs').innerHTML = photos.map(function (u) { return '<img src="' + u + '" alt="Roof photo preview">'; }).join('');
  });

  /* Lead preview */
  var sent = false;
  var JOBS = { reroof: 'Re-roof', 'new': 'New build', storm: 'Storm / insurance' };
  function renderLead() {
    if (!sent) return;
    var c = colour(state.colour);
    $('#bubble').innerHTML = '<b>🔔 New quote request</b>' +
      $('#q-name').value.trim() + ' · ' + $('#q-phone').value.trim() + '<br>' +
      '📍 ' + $('#q-sub').value.trim() + '<br>' +
      '🏠 ' + JOBS[est.job] + ' · ~' + est.sqm + ' m²<br>' +
      '<span class="sw2" style="background:' + c[1] + '"></span>' + c[0] + ' · ' + { corro: 'Corrugated', trim: 'Trimdek', klip: 'Klip-Lok' }[state.profile] + '<br>' +
      '💰 Estimate ' + money(est.lo) + ' – ' + money(est.hi) +
      (photos.length ? '<span class="imgs">' + photos.map(function (u) { return '<img src="' + u + '" alt="">'; }).join('') + '</span>' : '<br>📷 No photos yet') +
      '<span class="call">Tap to call back</span>';
  }
  $('#qform').addEventListener('submit', function (e) {
    e.preventDefault();
    var miss = ['#q-name', '#q-phone', '#q-sub'].filter(function (s) { return !$(s).value.trim(); });
    var err = $('#err');
    if (miss.length) { err.textContent = 'Please add your name, mobile and suburb so we can call you back.'; err.hidden = false; $(miss[0]).focus(); return; }
    err.hidden = true; sent = true; renderLead();
    var b = $('#bubble'); b.classList.remove('new'); void b.offsetWidth; b.classList.add('new');
    this.querySelector('button[type=submit]').textContent = '✓ Sent! See it arrive on Dylan\'s phone';
  });

  /* Step navigation + progress */
  $$('[data-next]').forEach(function (b) { b.addEventListener('click', function () { $('#s' + b.dataset.next).scrollIntoView({ behavior: 'smooth' }); }); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { var n = en.target.id.slice(1); $$('.progress li').forEach(function (li) { li.classList.toggle('on', +li.dataset.s <= +n); }); } }); }, { rootMargin: '-40% 0px -50% 0px' });
    $$('.step').forEach(function (s) { io.observe(s); });
  }

  paint(); calc();
})();
