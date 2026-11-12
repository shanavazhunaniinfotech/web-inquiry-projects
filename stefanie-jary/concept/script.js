(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var CAT = { kids: ['Kids & families', '#ffe3d6', '#9a3a1d'], well: ['Wellbeing', '#d9efe3', '#1f4d3f'], seniors: ['Seniors', '#e3e7fb', '#2c3a8a'], all: ['Everyone', '#fdeccb', '#7a5408'] };
  var EV = [
    [0, '9:30', 'Playgroup', 'Main hall · ages 0–5', 'kids'], [0, '10:00', 'Gentle Yoga', 'Studio · bring a mat', 'well'], [0, '13:00', 'Tech Help for Seniors', 'Library room', 'seniors'],
    [1, '10:00', 'Morning Tea & Chat', 'Café corner · gold coin', 'seniors'], [1, '15:30', 'After-School Art Club', 'Art room · ages 6–12', 'kids'], [1, '18:30', 'Tai Chi', 'Main hall', 'well'],
    [2, '9:00', 'Walking Group', 'Meet at front door', 'well'], [2, '12:00', 'Community Lunch', 'Main hall · free', 'all'], [2, '16:00', 'Homework Club', 'Library room', 'kids'],
    [3, '10:00', 'Knit & Natter', 'Café corner', 'seniors'], [3, '18:00', 'Pottery for Beginners', 'Art room · bookings', 'all'],
    [4, '9:30', 'Playgroup', 'Main hall · ages 0–5', 'kids'], [4, '11:00', 'Chair Yoga', 'Studio', 'well'], [4, '18:00', 'Family Movie Night', 'Main hall · free', 'all'],
    [5, '8:00', 'Community Garden', 'Garden · all welcome', 'all'], [5, '9:00', 'Makers Market', 'Car park · 40 stalls', 'all'],
    [6, '10:00', 'Repair Café', 'Workshop · fix it together', 'all']
  ];
  var HOURS = [['8:30 am', '9:00 pm'], ['8:30 am', '9:00 pm'], ['8:30 am', '9:00 pm'], ['8:30 am', '9:00 pm'], ['8:30 am', '9:00 pm'], ['8:00 am', '4:00 pm'], ['10:00 am', '2:00 pm']];
  var ROOMS = [['Main Hall', 'Up to 120 · stage, kitchen', 60], ['Studio', 'Up to 30 · sprung floor', 35], ['Art Room', 'Up to 20 · sinks, tables', 30], ['Meeting Room', 'Up to 8 · screen, Wi-Fi', 20]];
  var GIVE = [[25, 'covers a week of morning tea for our seniors group'], [50, 'buys art supplies for a term of Art Club'], [100, 'feeds 40 people at our Wednesday community lunch'], [250, 'keeps the doors open for a full day of free programs']];

  function sydNow() { try { return new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' })); } catch (e) { return new Date(); } }
  var now = sydNow(), today = (now.getDay() + 6) % 7, day = today, filter = 'any';

  /* What's on */
  $('#filters').innerHTML = '<button type="button" aria-pressed="true" data-f="any">All</button>' + Object.keys(CAT).map(function (k) { return '<button type="button" aria-pressed="false" data-f="' + k + '">' + CAT[k][0] + '</button>'; }).join('');
  $('#days').innerHTML = DAYS.map(function (d, i) {
    var dt = new Date(now); dt.setDate(now.getDate() + ((i - today + 7) % 7));
    return '<button role="tab" aria-selected="' + (i === day) + '" data-d="' + i + '">' + (i === today ? 'Today' : d) + '<small>' + dt.getDate() + ' ' + dt.toLocaleString('en-AU', { month: 'short' }) + '</small></button>';
  }).join('');
  function renderEv() {
    var list = EV.filter(function (e) { return e[0] === day && (filter === 'any' || e[4] === filter); });
    $('#events').innerHTML = list.length ? list.map(function (e, i) {
      var c = CAT[e[4]], h = +e[1].split(':')[0];
      return '<article class="ev" style="animation-delay:' + i * 60 + 'ms"><span class="ev__time">' + e[1] + '<small>' + (h < 12 ? 'am' : 'pm') + '</small></span><span><b>' + e[2] + '</b><span>' + e[3] + '</span></span><span class="ev__tag" style="background:' + c[1] + ';color:' + c[2] + '">' + c[0] + '</span></article>';
    }).join('') : '<p class="empty">Nothing in this category today. Try another day.</p>';
  }
  $('#days').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; day = +b.dataset.d; $$('#days button').forEach(function (x) { x.setAttribute('aria-selected', x === b); }); renderEv(); });
  $('#filters').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; filter = b.dataset.f; $$('#filters button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); renderEv(); });
  renderEv();

  /* Open status + hours */
  $('#hours').innerHTML = DAYS.map(function (d, i) { return '<tr class="' + (i === today ? 'is-today' : '') + '"><td>' + d + (i === today ? ' (today)' : '') + '</td><td>' + HOURS[i][0] + ' – ' + HOURS[i][1] + '</td></tr>'; }).join('');
  function mins(t) { var p = t.split(' '), hm = p[0].split(':'), h = +hm[0] % 12 + (p[1] === 'pm' ? 12 : 0); return h * 60 + +hm[1]; }
  var m = now.getHours() * 60 + now.getMinutes(), op = m >= mins(HOURS[today][0]) && m < mins(HOURS[today][1]);
  $('#open').textContent = op ? 'Open now until ' + HOURS[today][1] : 'Closed now · opens ' + (m < mins(HOURS[today][0]) ? 'today ' + HOURS[today][0] : 'tomorrow ' + HOURS[(today + 1) % 7][0]);
  $('#dot').classList.toggle('closed', !op);

  /* Room hire */
  $('#rooms').innerHTML = ROOMS.map(function (r) { return '<div class="room"><b>' + r[0] + '</b><span>' + r[1] + ' · $' + r[2] + '/hr</span></div>'; }).join('');
  $('#r-room').innerHTML = ROOMS.map(function (r, i) { return '<option value="' + i + '">' + r[0] + '</option>'; }).join('');
  function calc() { var r = ROOMS[+$('#r-room').value], h = Math.max(1, +$('#r-hours').value || 1), t = r[2] * h * ($('#r-comm').checked ? .5 : 1); $('#r-total').textContent = '$' + t.toLocaleString('en-AU'); }
  ['#r-room', '#r-hours', '#r-comm'].forEach(function (s) { $(s).addEventListener('input', calc); $(s).addEventListener('change', calc); }); calc();

  /* Donate */
  var amt = 1, freq = 'once';
  $('#amounts').innerHTML = GIVE.map(function (g, i) { return '<button type="button" role="radio" aria-checked="' + (i === amt) + '" data-i="' + i + '">$' + g[0] + '</button>'; }).join('');
  function renderGive() {
    var g = GIVE[amt];
    $('#impact').textContent = '$' + g[0] + (freq === 'month' ? ' a month ' : ' ') + g[1] + (freq === 'month' ? ', every month.' : '.');
    $('#give').textContent = 'Donate $' + g[0] + (freq === 'month' ? ' monthly' : '');
  }
  $('#amounts').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; amt = +b.dataset.i; $$('#amounts button').forEach(function (x) { x.setAttribute('aria-checked', x === b); }); renderGive(); });
  $$('.freq button').forEach(function (b) { b.addEventListener('click', function () { freq = b.dataset.f; $$('.freq button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); renderGive(); }); });
  $('#give').addEventListener('click', function () { this.textContent = 'Thank you! 💛 (Demo)'; });
  renderGive();

  /* Forms, nav */
  $('#cform').addEventListener('submit', function (e) { e.preventDefault(); $('#ok').hidden = false; this.reset(); });
  $('#news').addEventListener('submit', function (e) { e.preventDefault(); $('#news-ok').hidden = false; this.reset(); });
  var bg = $('#burger'), mn = $('#mnav');
  bg.addEventListener('click', function () { var o = mn.classList.toggle('open'); bg.setAttribute('aria-expanded', String(o)); });
  $$('#mnav a').forEach(function (a) { a.addEventListener('click', function () { mn.classList.remove('open'); bg.setAttribute('aria-expanded', 'false'); }); });
})();
