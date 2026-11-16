(function () {
  'use strict';
  var API = 'https://renocomfort.ca/wp-json/custom-booking/v1/';
  var SERVICES = [[1, 'Handy Man Services'], [2, 'Legal Basements'], [3, 'Washrooms'], [4, 'Shower Glass']];
  var SLOW_MS = 2500, TIMEOUT_MS = 12000, HKEY = 'reno_monitor_history_v1';
  var $ = function (s) { return document.querySelector(s); };

  function torontoNow() { try { return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })); } catch (e) { return new Date(); } }
  var now = torontoNow();
  var MONTHS = [0, 1, 2].map(function (i) { var d = new Date(now.getFullYear(), now.getMonth() + i, 1); return [d.getFullYear(), d.getMonth() + 1, d.toLocaleString('en-CA', { month: 'short' }) + ' ' + d.getFullYear()]; });

  function timed(url) {
    var t0 = performance.now();
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var to = setTimeout(function () { if (ctrl) ctrl.abort(); }, TIMEOUT_MS);
    var sep = url.indexOf('?') === -1 ? '?' : '&';
    return fetch(API + url + sep + '_=' + Date.now(), { cache: 'no-store', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, status: r.status, data: d, ms: performance.now() - t0 }; }); })
      .catch(function (e) { return { ok: false, status: e.name === 'AbortError' ? 'timeout' : 'network', data: {}, ms: performance.now() - t0 }; })
      .then(function (r) { clearTimeout(to); return r; });
  }

  /* Grid skeleton */
  var thead = $('#grid thead tr');
  MONTHS.forEach(function (m) { var th = document.createElement('th'); th.scope = 'col'; th.textContent = m[2]; thead.appendChild(th); });
  $('#grid tbody').innerHTML = SERVICES.map(function (s) { return '<tr><th scope="row">' + s[1] + '</th>' + MONTHS.map(function (m, j) { return '<td><div class="cell" id="c-' + s[0] + '-' + j + '"><i></i><span>Not tested</span></div></td>'; }).join('') + '</tr>'; }).join('');

  function fmtDate(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' }); }
  function setStatus(state, label, title, meta) { $('#light').dataset.state = state; $('#s-label').textContent = label; $('#s-title').textContent = title; $('#s-meta').textContent = meta; }

  var running = false;
  function run() {
    if (running) return; running = true;
    var btn = $('#run'); btn.disabled = true; btn.textContent = 'Testing…';
    setStatus('run', 'Testing', 'Checking every service on renocomfort.ca…', 'This takes about 10–20 seconds because each month is one live request.');
    SERVICES.forEach(function (s) { MONTHS.forEach(function (m, j) { var c = $('#c-' + s[0] + '-' + j); c.className = 'cell run'; c.innerHTML = '<i></i><span>Checking…</span>'; }); });

    var results = [], jobs = [];
    SERVICES.forEach(function (s) { MONTHS.forEach(function (m, j) { jobs.push([s, m, j]); }); });
    // Run 3 at a time to behave like a few customers, not a flood.
    var idx = 0;
    function next() {
      if (idx >= jobs.length) return Promise.resolve();
      var job = jobs[idx++];
      return timed('availability/dates?service_id=' + job[0][0] + '&year=' + job[1][0] + '&month=' + job[1][1]).then(function (r) {
        var dates = (r.data && (r.data.available || r.data.dates)) || [];
        var full = (r.data && r.data.full) || [];
        var res = { sid: job[0][0], name: job[0][1], month: job[1], j: job[2], ok: r.ok && Array.isArray(dates), status: r.status, ms: r.ms, dates: dates, full: full };
        results.push(res);
        var c = $('#c-' + res.sid + '-' + res.j);
        if (!res.ok) { c.className = 'cell bad'; c.innerHTML = '<i></i><span>Failed (' + res.status + ')</span><small>' + (res.ms / 1000).toFixed(1) + 's</small>'; }
        else { c.className = 'cell ' + (res.ms > SLOW_MS ? 'slow' : 'ok'); c.innerHTML = '<i></i><span><b>' + dates.length + '</b> open days</span><small>' + (res.ms / 1000).toFixed(1) + 's</small>'; }
        return next();
      });
    }
    Promise.all([next(), next(), next()]).then(function () { return slotsFor(results); }).then(function (slotInfo) { finish(results, slotInfo); });
  }

  function slotsFor(results) {
    var first = SERVICES.map(function (s) {
      var all = [];
      results.filter(function (r) { return r.sid === s[0] && r.ok; }).forEach(function (r) { all = all.concat(r.dates); });
      all.sort();
      return { sid: s[0], name: s[1], date: all[0] || null };
    });
    return Promise.all(first.map(function (f) {
      if (!f.date) return Promise.resolve({ f: f, r: null });
      return timed('availability/slots?service_id=' + f.sid + '&date=' + f.date).then(function (r) { return { f: f, r: r }; });
    }));
  }

  function finish(results, slotInfo) {
    running = false;
    var btn = $('#run'); btn.disabled = false; btn.textContent = 'Test my calendar now';
    var pass = results.filter(function (r) { return r.ok; }).length, total = results.length;
    var avg = results.reduce(function (a, r) { return a + r.ms; }, 0) / total;
    var allDates = {}; results.forEach(function (r) { if (r.ok) r.dates.forEach(function (d) { allDates[d] = 1; }); });
    var slow = results.filter(function (r) { return r.ok && r.ms > SLOW_MS; }).length;

    /* Slots */
    var nextSlot = null;
    $('#slots').innerHTML = slotInfo.map(function (x) {
      if (!x.f.date) return '<div class="slotcard"><b>' + x.f.name + '</b><small>No open dates found in the next 3 months.</small></div>';
      var slots = (x.r && x.r.ok && x.r.data && x.r.data.slots) || [];
      var open = slots.filter(function (s) { return s.available === true || s.available === 1 || s.available === '1'; });
      if (open.length && (!nextSlot || x.f.date + open[0].time < nextSlot.key)) nextSlot = { key: x.f.date + open[0].time, label: fmtDate(x.f.date) + ', ' + (open[0].label || open[0].time).split(/\s[–-]\s/)[0] };
      var chips = slots.length ? slots.map(function (s) { var on = s.available === true || s.available === 1 || s.available === '1'; return '<span class="chip' + (on ? '' : ' full') + '">' + (s.label || s.time) + '</span>'; }).join('') : '<span class="empty">' + (x.r && !x.r.ok ? 'Time slots failed to load.' : 'No time slots returned.') + '</span>';
      return '<div class="slotcard"><b>' + x.f.name + '</b><small>First open date: ' + fmtDate(x.f.date) + '</small><div class="chips">' + chips + '</div></div>';
    }).join('');

    /* KPIs + status */
    $('#k-pass').textContent = pass + ' / ' + total;
    $('#k-speed').textContent = (avg / 1000).toFixed(1) + 's';
    $('#k-dates').textContent = Object.keys(allDates).length;
    $('#k-next').textContent = nextSlot ? nextSlot.label : 'None';
    var stamp = new Date().toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' });
    if (pass < total) setStatus('bad', 'Problem found', (total - pass) + ' of ' + total + ' checks failed. Customers would see a grey calendar.', 'Tested ' + stamp + '. Keep this page open and re-test, or send a screenshot to your developer.');
    else if (slow || avg > 1200) setStatus('warn', 'Working, but slow', 'Your calendar works right now, but answers slowly (' + (avg / 1000).toFixed(1) + 's per month, healthy is under 1s).', 'Tested ' + stamp + '. Slow answers are what turn the calendar grey on busy or mobile connections.');
    else setStatus('ok', 'All good', 'Your booking calendar is working for every service right now.', 'Tested ' + stamp + ' · average ' + (avg / 1000).toFixed(1) + 's per month.');

    /* Checks */
    var checks = [];
    checks.push(pass === total ? ['ok', 'Calendar loads for all services', 'All ' + total + ' month checks returned dates.'] : ['bad', 'Calendar failed to load', (total - pass) + ' checks failed. This is exactly when customers see grey dates.']);
    checks.push(avg <= 1200 ? ['ok', 'Fast answers', 'Average ' + (avg / 1000).toFixed(1) + 's per month.'] : ['warn', 'Slow calendar answers', 'Average ' + (avg / 1000).toFixed(1) + 's per month (healthy is under 1 second). Slow answers make the calendar grey out on weaker connections.']);
    var hol = ['-12-25', '-12-26', '-01-01'].filter(function (h) { return Object.keys(allDates).some(function (d) { return d.slice(4) === h; }); });
    checks.push(hol.length ? ['warn', 'Holidays can be booked', 'Christmas, Boxing Day or New Year\'s Day is open for bookings in the next 3 months.'] : ['ok', 'Holidays blocked', 'No major holidays are open in the next 3 months.']);
    var noFuture = results.filter(function (r) { return r.ok && r.dates.length === 0; }).length;
    if (noFuture) checks.push(['warn', 'Months with no open days', noFuture + ' service-months show zero open days. Customers browsing ahead would see a fully grey month.']);
    checks.push(['bad', 'Homepage booking form is cached with an expiring token', 'Found in our review: SiteGround serves the homepage from cache (sg-f-cache: HIT), including the booking form\'s security token. Tokens expire in 12–24h, so homepage bookings can fail until the cache refreshes.', true]);
    checks.push(['warn', 'Prices set to USD', 'Found in our review: the booking system is set to USD for a Canadian business. Customers should see CAD.', true]);
    checks.push(['warn', 'No spam protection on bookings', 'Found in our review: reCAPTCHA is turned off on the booking form.', true]);
    checks.push(['info', 'Custom-built booking plugin', 'Found in our review: the calendar is custom code (not a supported plugin), so fixes must be made in the code itself.', true]);
    $('#checks').innerHTML = checks.map(function (c) { return '<li class="' + c[0] + '"><div><b>' + c[1] + (c[3] ? '<span class="tag">Review</span>' : '<span class="tag">Live</span>') + '</b><span>' + c[2] + '</span></div></li>'; }).join('');

    /* History */
    var h = load(); h.push({ t: Date.now(), pass: pass, total: total, avg: Math.round(avg) }); if (h.length > 60) h = h.slice(-60); save(h); drawHistory();
  }

  function load() { try { return JSON.parse(localStorage.getItem(HKEY)) || []; } catch (e) { return []; } }
  function save(h) { try { localStorage.setItem(HKEY, JSON.stringify(h)); } catch (e) { /* storage unavailable */ } }
  function drawHistory() {
    var h = load(), log = $('#log');
    log.innerHTML = h.length ? h.slice().reverse().map(function (x) { var ok = x.pass === x.total; return '<li><span>' + new Date(x.t).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + '</span><span class="' + (ok ? 'ok' : 'bad') + '">' + (ok ? 'OK' : 'FAIL') + ' ' + x.pass + '/' + x.total + '</span><span>' + (x.avg / 1000).toFixed(1) + 's</span></li>'; }).join('') : '<li><span>No tests yet</span></li>';
    var cv = $('#chart'), dpr = window.devicePixelRatio || 1, w = cv.clientWidth, ht = 140;
    cv.width = w * dpr; cv.height = ht * dpr; var g = cv.getContext('2d'); g.scale(dpr, dpr); g.clearRect(0, 0, w, ht);
    var pad = 28, max = Math.max(3000, Math.max.apply(null, h.map(function (x) { return x.avg; }).concat([0])) * 1.15);
    g.strokeStyle = '#d8dee8'; g.fillStyle = '#5b6475'; g.font = '11px IBM Plex Mono, monospace'; g.lineWidth = 1;
    [0, max / 2, max].forEach(function (v) { var y = ht - pad + 6 - (v / max) * (ht - pad - 10); g.beginPath(); g.moveTo(pad + 10, y); g.lineTo(w - 8, y); g.stroke(); g.fillText((v / 1000).toFixed(1) + 's', 2, y + 4); });
    if (!h.length) { g.fillText('Your load-time history appears here', pad + 20, ht / 2); return; }
    var step = h.length > 1 ? (w - pad - 30) / (h.length - 1) : 0;
    g.beginPath(); g.strokeStyle = '#f97316'; g.lineWidth = 2;
    h.forEach(function (x, i) { var X = pad + 14 + i * step, Y = ht - pad + 6 - (x.avg / max) * (ht - pad - 10); if (i) g.lineTo(X, Y); else g.moveTo(X, Y); });
    g.stroke();
    h.forEach(function (x, i) { var X = pad + 14 + i * step, Y = ht - pad + 6 - (x.avg / max) * (ht - pad - 10); g.beginPath(); g.fillStyle = x.pass === x.total ? '#16a34a' : '#dc2626'; g.arc(X, Y, 4, 0, Math.PI * 2); g.fill(); });
  }
  $('#clear').addEventListener('click', function () { save([]); drawHistory(); });
  window.addEventListener('resize', drawHistory);

  /* Cost calculator */
  function money(n) { return '$' + Math.round(n).toLocaleString('en-CA'); }
  function cost() {
    var req = +$('#c-req').value, lost = +$('#c-lost').value / 100, close = +$('#c-close').value / 100, val = +$('#c-val').value;
    $('#o-req').textContent = req; $('#o-lost').textContent = Math.round(lost * 100) + '%'; $('#o-close').textContent = Math.round(close * 100) + '%'; $('#o-val').textContent = money(val);
    $('#c-out').textContent = money(req * 4.33 * lost * close * val) + ' CAD';
  }
  ['#c-req', '#c-lost', '#c-close', '#c-val'].forEach(function (s) { $(s).addEventListener('input', cost); });
  cost();

  /* Auto re-test */
  var timer = null;
  $('#auto').addEventListener('change', function () { clearInterval(timer); if (this.checked) { run(); timer = setInterval(run, 5 * 60 * 1000); } });
  $('#run').addEventListener('click', run);
  drawHistory();
  run();
})();
