(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };

  var STAGES = [
    { t: 'Foundation', d: 'Post-tension slab poured and cured, with plumbing set in place before a single wall goes up.', wk: 'Weeks 1–3' },
    { t: 'Framing', d: 'Walls and roof trusses go up. The bones of the home: straight, square and inspected.', wk: 'Weeks 4–7' },
    { t: 'Dried in', d: 'Roof decking, wall sheathing and house wrap. The home is closed against the weather.', wk: 'Weeks 8–10' },
    { t: 'Exterior', d: 'Brick, roofing, windows and the front door. The home takes its final shape.', wk: 'Weeks 11–16' },
    { t: 'Keys', d: 'Interiors finished, landscaping planted, final walkthrough. Ready to move in.', wk: 'Weeks 17–22' }
  ];
  var COLORS = { 'Available': '#2f8a5c', 'Under construction': '#c9842e', 'Completed': '#4a6fa5' };

  /* Sample projects across DFW */
  var P = [
    { n: 'The Prosper Residence', city: 'Prosper', ll: [33.2362, -96.8011], s: 'Under construction', stage: 3, spec: '4 bed · 3.5 bath · 3,450 sq ft' },
    { n: 'Frisco Modern Farmhouse', city: 'Frisco', ll: [33.1507, -96.8236], s: 'Completed', stage: 5, spec: '5 bed · 4 bath · 4,100 sq ft' },
    { n: 'Celina Hill Country', city: 'Celina', ll: [33.3246, -96.7845], s: 'Available', stage: 5, spec: '4 bed · 3 bath · 3,100 sq ft' },
    { n: 'McKinney Craftsman', city: 'McKinney', ll: [33.1972, -96.6398], s: 'Completed', stage: 5, spec: '3 bed · 2.5 bath · 2,650 sq ft' },
    { n: 'Rockwall Lakeside', city: 'Rockwall', ll: [32.9312, -96.4597], s: 'Under construction', stage: 2, spec: '4 bed · 3.5 bath · 3,800 sq ft' },
    { n: 'Southlake Estate', city: 'Southlake', ll: [32.9412, -97.1342], s: 'Available', stage: 5, spec: '5 bed · 5 bath · 5,200 sq ft' }
  ];

  /* Mini house thumbnails reuse the big illustration at the project's stage */
  var houseSVG = $('#house').innerHTML;
  function thumb(stage) { return '<svg viewBox="0 0 600 340" class="s' + stage + '" aria-hidden="true">' + houseSVG.replace(/id="(brick|osb|shingle)"/g, 'id="$1-t' + stage + '"').replace(/url\(#(brick|osb|shingle)\)/g, 'url(#$1-t' + stage + ')') + '</svg>'; }
  var thumbStyle = document.createElement('style');
  thumbStyle.textContent = '.pc svg .sky{fill:#e9eef3}.pc svg.s5 .sky{fill:#f3e6d2}.pc svg .dirt{fill:#b99a76}.pc svg .L{opacity:0}' + [1, 2, 3, 4, 5].map(function (s) { var on = { 1: [1], 2: [1, 2], 3: [1, 2, 3], 4: [1, 3, 4], 5: [1, 4, 5] }[s]; return on.map(function (l) { return '.pc svg.s' + s + ' .L' + l; }).join(',') + '{opacity:1}'; }).join('');
  document.head.appendChild(thumbStyle);

  /* Map */
  var map = L.map('map', { scrollWheelZoom: false }).setView([33.08, -96.78], 9);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19, className: 'soft-tiles' }).addTo(map);
  var markers = P.map(function (p, i) {
    var icon = L.divIcon({ className: '', html: '<div class="pin" style="background:' + COLORS[p.s] + '"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
    var m = L.marker(p.ll, { icon: icon, title: p.n }).addTo(map);
    m.bindPopup('<b>' + p.n + '</b><br>' + p.city + ' · ' + p.s);
    m.on('click', function () { select(i, false); });
    return m;
  });

  var filter = 'all', cur = 0, stage = 1;
  function drawList() {
    $('#list').innerHTML = P.map(function (p, i) {
      if (filter !== 'all' && p.s !== filter) return '';
      return '<button type="button" class="pc" data-i="' + i + '" aria-current="' + (i === cur) + '">' + thumb(p.stage) + '<span><b>' + p.n + '</b><small>' + p.city + ', TX · ' + p.spec + '</small><span class="status st-' + p.s.split(' ')[0] + '">' + p.s + '</span></span></button>';
    }).join('');
    markers.forEach(function (m, i) { var show = filter === 'all' || P[i].s === filter; if (show && !map.hasLayer(m)) m.addTo(map); if (!show && map.hasLayer(m)) map.removeLayer(m); });
  }
  document.querySelector('.filters').addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]'); if (!b) return;
    filter = b.dataset.f;
    document.querySelectorAll('.filters button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    drawList();
  });
  $('#list').addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) select(+b.dataset.i, true); });

  function select(i, scroll) {
    cur = i; var p = P[i];
    $('#pName').textContent = p.n;
    $('#pMeta').textContent = p.city + ', Texas · ' + p.spec;
    var st = $('#pStatus'); st.textContent = p.s; st.className = 'status st-' + p.s.split(' ')[0];
    $('#pAsk').textContent = p.s === 'Available' ? 'Ask about this home' : p.s === 'Completed' ? 'Build one like this' : 'Ask about this build';
    map.panTo(p.ll); markers[i].openPopup();
    drawChips(); setStage(p.stage);
    drawList();
    if (scroll) $('#build').scrollIntoView({ behavior: 'smooth' });
  }
  function drawChips() {
    var p = P[cur];
    $('#chips').innerHTML = STAGES.map(function (s, k) {
      var n = k + 1, locked = n > p.stage;
      return '<button type="button" role="tab" data-s="' + n + '" aria-selected="false"' + (locked ? ' disabled title="Coming soon"' : '') + '>' + s.t + '<small>' + (locked ? 'coming next' : s.wk) + '</small></button>';
    }).join('');
  }
  function setStage(n) {
    stage = n; var s = STAGES[n - 1], p = P[cur];
    $('#house').setAttribute('class', 's' + n);
    $('#sK').textContent = 'Stage ' + n + ' of 5' + (n === p.stage && p.s === 'Under construction' ? ' · current' : '');
    $('#sT').textContent = s.t;
    $('#sD').textContent = s.d;
    $('#sDate').textContent = s.wk + (p.s === 'Under construction' && n === p.stage ? ' · updated this week' : '');
    document.querySelectorAll('#chips button').forEach(function (b) { b.setAttribute('aria-selected', String(+b.dataset.s === n)); });
  }
  $('#chips').addEventListener('click', function (e) { var b = e.target.closest('[data-s]'); if (b && !b.disabled) setStage(+b.dataset.s); });
  $('#chips').addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var n = Math.min(P[cur].stage, Math.max(1, stage + (e.key === 'ArrowRight' ? 1 : -1))); setStage(n);
    var b = document.querySelector('#chips [data-s="' + n + '"]'); if (b) b.focus();
  });

  select(0, false);
  map.closePopup();
})();
