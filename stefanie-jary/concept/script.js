(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var A = '../assets/';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (min-width: 901px)').matches;

  /* ---------- Data (placeholder) ---------- */
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var CAT = { kids: ['Kids & families', '#ffe4d9', '#a33a1a', 'kids-paint'], well: ['Wellbeing', '#dcefe4', '#1c463a', 'yoga'], seniors: ['Seniors', '#e5e8fb', '#2c3a8a', 'seniors'], all: ['Everyone', '#fff1c7', '#7a5408', 'garden2'] };
  var EV = [
    [0, '9:30', 'Playgroup', 'Main hall · ages 0–5 · gold coin', 'kids'], [0, '10:00', 'Gentle Yoga', 'Studio · bring a mat', 'well'], [0, '13:00', 'Tech Help for Seniors', 'Library room · free', 'seniors'],
    [1, '10:00', 'Morning Tea & Chat', 'Café corner · gold coin', 'seniors'], [1, '15:30', 'After-School Art Club', 'Art room · ages 6–12', 'kids'], [1, '18:30', 'Tai Chi', 'Main hall', 'well'],
    [2, '9:00', 'Walking Group', 'Meet at the front door', 'well'], [2, '12:00', 'Community Lunch', 'Main hall · free for everyone', 'all'], [2, '16:00', 'Homework Club', 'Library room · free', 'kids'],
    [3, '10:00', 'Knit & Natter', 'Café corner', 'seniors'], [3, '12:00', 'Community Lunch', 'Main hall · free for everyone', 'all'], [3, '18:00', 'Pottery for Beginners', 'Art room · bookings', 'all'],
    [4, '9:30', 'Playgroup', 'Main hall · ages 0–5', 'kids'], [4, '11:00', 'Chair Yoga', 'Studio', 'well'], [4, '18:00', 'Family Movie Night', 'Main hall · free', 'all'],
    [5, '8:00', 'Community Garden', 'Garden · all welcome', 'all'], [5, '9:00', 'Makers Market', 'Car park · 40 local stalls', 'all'],
    [6, '10:00', 'Repair Café', 'Workshop · fix it together', 'all']
  ];
  var HOURS = [['8:30 am', '9:00 pm'], ['8:30 am', '9:00 pm'], ['8:30 am', '9:00 pm'], ['8:30 am', '9:00 pm'], ['8:30 am', '9:00 pm'], ['8:00 am', '4:00 pm'], ['10:00 am', '2:00 pm']];
  var ROOMS = [['Main Hall', 'Up to 120 · stage, kitchen', 60], ['Studio', 'Up to 30 · sprung floor', 35], ['Art Room', 'Up to 20 · sinks, tables', 30], ['Meeting Room', 'Up to 8 · screen, Wi-Fi', 20]];
  var GIVE = [[15, 'covers morning tea for our seniors group every week'], [35, 'buys art supplies for a whole term of Art Club', 'Most chosen'], [75, 'feeds 30 people at our Wednesday community lunch'], [150, 'keeps the doors open for a full day of free programs']];
  var QUOTES = [['“My kids have grown up at Playgroup and Art Club. It\'s the first place we found friends when we moved here.”', 'Priya S.', 'Parent, member since 2019'], ['“Tech Help changed my life. I can video-call my grandkids in Perth every Sunday now.”', 'Margaret D.', 'Tuesday regular, 81'], ['“We hire the Main Hall for our choir every week. Easy booking, lovely space, fair price.”', 'Daniel K.', 'Riverside Voices choir']];

  function syd() { try { return new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' })); } catch (e) { return new Date(); } }
  var now = syd(), today = (now.getDay() + 6) % 7, day = today, filter = 'any';
  function toMin(t) { var p = t.split(' '), hm = p[0].split(':'); return ((+hm[0] % 12) + (p[1] === 'pm' ? 12 : 0)) * 60 + +hm[1]; }
  function evMin(t) { var hm = t.split(':'), h = +hm[0]; if (h < 8) h += 12; return h * 60 + +hm[1]; }
  function ampm(t) { return evMin(t) >= 720 ? 'pm' : 'am'; }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-AU'); }

  /* ---------- Open status + next event ---------- */
  var mins = now.getHours() * 60 + now.getMinutes(), H = HOURS[today];
  var open = mins >= toMin(H[0]) && mins < toMin(H[1]);
  $('#open').textContent = open ? 'Open now · until ' + H[1] : (mins < toMin(H[0]) ? 'Opens today at ' + H[0] : 'Closed · opens tomorrow ' + HOURS[(today + 1) % 7][0]);
  $('#dot').classList.toggle('closed', !open);
  var nxt = null;
  for (var k = 0; k < 7 && !nxt; k++) {
    var d = (today + k) % 7;
    EV.filter(function (e) { return e[0] === d && (k > 0 || evMin(e[1]) > mins); }).some(function (e) { nxt = [e, k]; return true; });
  }
  if (nxt) { $('#next-title').textContent = nxt[0][2]; $('#next-meta').textContent = (nxt[1] === 0 ? 'Today' : nxt[1] === 1 ? 'Tomorrow' : DAYS[nxt[0][0]]) + ' · ' + nxt[0][1] + ' ' + ampm(nxt[0][1]) + ' · ' + nxt[0][3].split(' · ').pop(); }

  /* ---------- What's on ---------- */
  $('#filters').innerHTML = '<button type="button" aria-pressed="true" data-f="any">All</button>' + Object.keys(CAT).map(function (c) { return '<button type="button" aria-pressed="false" data-f="' + c + '">' + CAT[c][0] + '</button>'; }).join('');
  $('#days').innerHTML = DAYS.map(function (n, i) {
    var dt = new Date(now); dt.setDate(now.getDate() + ((i - today + 7) % 7));
    return '<button role="tab" aria-selected="' + (i === day) + '" data-d="' + i + '">' + (i === today ? 'Today' : n) + '<small>' + dt.getDate() + ' ' + dt.toLocaleString('en-AU', { month: 'short' }) + '</small></button>';
  }).join('');
  function renderEv() {
    var list = EV.filter(function (e) { return e[0] === day && (filter === 'any' || e[4] === filter); });
    var box = $('#events');
    box.innerHTML = list.length ? list.map(function (e) {
      var c = CAT[e[4]];
      return '<a class="ev" href="#visit" data-img="' + c[3] + '"><span class="ev__time">' + e[1] + '<small>' + ampm(e[1]) + '</small></span><span><h3>' + e[2] + '</h3><span>' + e[3] + '</span></span><span class="ev__tag" style="background:' + c[1] + ';color:' + c[2] + '">' + c[0] + '</span><span class="ev__go" aria-hidden="true">→</span></a>';
    }).join('') : '<p class="empty">Nothing in this category on ' + (day === today ? 'today' : DAYS[day]) + '. Try another day or "All".</p>';
    if (window.gsap && !reduce) gsap.from(box.children, { y: 24, opacity: 0, duration: .55, stagger: .06, ease: 'power3.out' });
  }
  $('#days').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; day = +b.dataset.d; $$('#days button').forEach(function (x) { x.setAttribute('aria-selected', x === b); }); renderEv(); });
  $('#filters').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; filter = b.dataset.f; $$('#filters button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); renderEv(); });

  /* hover image peek */
  var peek = $('#peek');
  if (fine && window.gsap) {
    var px = gsap.quickTo(peek, 'x', { duration: .5, ease: 'power3' }), py = gsap.quickTo(peek, 'y', { duration: .5, ease: 'power3' });
    $('#events').addEventListener('mousemove', function (e) { px(e.clientX + 150); py(e.clientY); });
    $('#events').addEventListener('mouseover', function (e) { var a = e.target.closest('.ev'); if (!a) return; $('img', peek).src = A + a.dataset.img + '.jpg'; gsap.to(peek, { opacity: 1, scale: 1, duration: .35 }); });
    $('#events').addEventListener('mouseleave', function () { gsap.to(peek, { opacity: 0, scale: .8, duration: .3 }); });
  }

  /* ---------- Hours ---------- */
  $('#hours').innerHTML = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(function (n, i) { return '<tr class="' + (i === today ? 'is-today' : '') + '"><td>' + n + (i === today ? ' · today' : '') + '</td><td>' + HOURS[i][0] + ' – ' + HOURS[i][1] + '</td></tr>'; }).join('');

  /* ---------- Room hire ---------- */
  var room = 0, hours = 3;
  $('#rooms').innerHTML = ROOMS.map(function (r, i) { return '<button type="button" class="room" role="radio" aria-checked="' + (i === 0) + '" data-r="' + i + '"><b>' + r[0] + '</b><span>' + r[1] + ' · $' + r[2] + '/hr</span></button>'; }).join('');
  var totalObj = { v: 0 };
  function calc() {
    var full = ROOMS[room][2] * hours, comm = $('#r-comm').checked, t = full * (comm ? .5 : 1);
    $('#r-hours').textContent = hours;
    $('#r-save').textContent = comm ? 'You save ' + money(full - t) : '';
    $('#r-book').textContent = 'Request ' + ROOMS[room][0] + ' · ' + hours + 'h →';
    if (window.gsap && !reduce) gsap.to(totalObj, { v: t, duration: .5, ease: 'power2.out', onUpdate: function () { $('#r-total').textContent = money(totalObj.v); } });
    else $('#r-total').textContent = money(t);
  }
  $('#rooms').addEventListener('click', function (e) { var b = e.target.closest('.room'); if (!b) return; room = +b.dataset.r; $$('.room').forEach(function (x) { x.setAttribute('aria-checked', x === b); }); calc(); });
  $$('[data-step]').forEach(function (b) { b.addEventListener('click', function () { hours = Math.max(1, Math.min(12, hours + +b.dataset.step)); calc(); }); });
  $('#r-comm').addEventListener('change', calc);
  calc();

  /* ---------- Quotes ---------- */
  var qi = 0, qTimer;
  $('#qdots').innerHTML = QUOTES.map(function (q, i) { return '<button role="tab" aria-selected="' + (i === 0) + '" aria-label="Story ' + (i + 1) + '" data-i="' + i + '"><i></i></button>'; }).join('');
  function showQ(i) {
    qi = i; var q = QUOTES[i];
    var set = function () { $('#q-text').textContent = q[0]; $('#q-name').textContent = q[1]; $('#q-role').textContent = q[2]; };
    if (window.gsap && !reduce) gsap.to('#quote', { opacity: 0, y: -14, duration: .3, onComplete: function () { set(); gsap.fromTo('#quote', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }); } });
    else set();
    $$('#qdots button').forEach(function (b, j) { b.setAttribute('aria-selected', 'false'); void b.offsetWidth; b.setAttribute('aria-selected', String(j === i)); });
    clearTimeout(qTimer); if (!reduce) qTimer = setTimeout(function () { showQ((qi + 1) % QUOTES.length); }, 6000);
  }
  $('#qdots').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) showQ(+b.dataset.i); });
  if (!reduce) qTimer = setTimeout(function () { showQ(1); }, 6000);

  /* ---------- Donate ---------- */
  var amt = 1, freq = 'month';
  $('#amounts').innerHTML = GIVE.map(function (g, i) { return '<button type="button" role="radio" aria-checked="' + (i === amt) + '" data-i="' + i + '">$' + g[0] + (g[2] ? '<small>' + g[2] + '</small>' : '') + '</button>'; }).join('');
  function renderGive() {
    var g = GIVE[amt];
    $('#impact').textContent = '$' + g[0] + (freq === 'month' ? ' a month ' : ' ') + g[1] + '.';
    $('#give').textContent = 'Give $' + g[0] + (freq === 'month' ? ' monthly' : ' today') + ' →';
    $('.freq').dataset.f = freq;
  }
  $('#amounts').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; amt = +b.dataset.i; $$('#amounts button').forEach(function (x) { x.setAttribute('aria-checked', x === b); }); renderGive(); });
  $$('.freq button').forEach(function (b) { b.addEventListener('click', function () { freq = b.dataset.f; $$('.freq button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); renderGive(); }); });
  $('#give').addEventListener('click', function () { this.textContent = 'Thank you! 💛 (Demo)'; });
  renderGive();

  /* ---------- Forms, nav ---------- */
  $$('.topics button').forEach(function (b) { b.addEventListener('click', function () { $$('.topics button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }); });
  $('#form').addEventListener('submit', function (e) { e.preventDefault(); $('#ok').hidden = false; this.reset(); });
  $('#news').addEventListener('submit', function (e) { e.preventDefault(); $('#news-ok').hidden = false; this.reset(); });
  var header = $('#header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var bg = $('#burger'), mn = $('#mnav');
  bg.addEventListener('click', function () { var o = mn.classList.toggle('open'); bg.setAttribute('aria-expanded', String(o)); header.classList.add('scrolled'); });
  $$('a', mn).forEach(function (a) { a.addEventListener('click', function () { mn.classList.remove('open'); bg.setAttribute('aria-expanded', 'false'); }); });

  renderEv();

  /* ---------- GSAP motion ---------- */
  if (!window.gsap || reduce) return;
  gsap.registerPlugin(ScrollTrigger);

  // hero intro
  var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('.hero .chip', { y: 20, opacity: 0, duration: .6 })
    .from('.hero h1 > span', { yPercent: 110, duration: 1.1, stagger: .1 }, '-=.3')
    .from('.hero__lede, .hero__cta, .trust', { y: 24, opacity: 0, duration: .8, stagger: .1 }, '-=.7')
    .from('.card', { y: 80, opacity: 0, rotate: function (i) { return [-6, 6, -3][i]; }, duration: 1.2, stagger: .12 }, '-=1.1')
    .from('.next', { y: 30, opacity: 0, scale: .9, duration: .8 }, '-=.6');

  // hero parallax
  $$('.card').forEach(function (c) {
    gsap.to(c, { yPercent: parseFloat(c.dataset.speed) * 100, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to($('img', c), { scale: 1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  });

  // stats counters
  $$('.count').forEach(function (el) {
    var to = +el.dataset.to, suf = el.dataset.suffix || '', o = { v: 0 };
    gsap.to(o, { v: to, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true }, onUpdate: function () { el.textContent = Math.round(o.v).toLocaleString('en-AU') + suf; } });
  });

  // section titles + elements
  $$('.reveal-title, .programs__intro h2').forEach(function (t) { gsap.from(t, { y: 60, opacity: 0, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: t, start: 'top 85%' } }); });
  gsap.from('.stat', { y: 40, opacity: 0, duration: .8, stagger: .1, scrollTrigger: { trigger: '.stats', start: 'top 85%' } });
  gsap.from('.room, .calc', { y: 30, opacity: 0, duration: .7, stagger: .07, scrollTrigger: { trigger: '.rooms', start: 'top 85%' } });
  gsap.from('.vol, .give', { y: 60, opacity: 0, duration: .9, stagger: .15, scrollTrigger: { trigger: '.involve', start: 'top 80%' } });
  gsap.from('.form', { y: 60, opacity: 0, duration: .9, scrollTrigger: { trigger: '.visit', start: 'top 75%' } });
  gsap.from('.footer__big', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.footer', start: 'top 85%' } });

  // image clip reveal
  gsap.fromTo('.clip', { clipPath: 'inset(18% 18% 18% 18% round 30px)' }, { clipPath: 'inset(0% 0% 0% 0% round 30px)', ease: 'none', scrollTrigger: { trigger: '.hire', start: 'top 85%', end: 'top 30%', scrub: true } });

  // horizontal programs (desktop)
  ScrollTrigger.matchMedia({
    '(min-width: 901px)': function () {
      var track = $('#ptrack');
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth + 40); };
      gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: '.programs', start: 'top top', end: function () { return '+=' + dist(); }, pin: '.programs__pin', scrub: 1, invalidateOnRefresh: true } });
    }
  });

  // marquee speed on scroll
  var mq = $('.marquee__track');
  ScrollTrigger.create({ trigger: '.marquee', start: 'top bottom', end: 'bottom top', onUpdate: function (s) { mq.style.animationDuration = Math.max(10, 32 - Math.abs(s.getVelocity()) / 120) + 's'; } });

  // magnetic buttons + cursor
  if (fine) {
    $$('.magnet').forEach(function (b) {
      var xTo = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' }), yTo = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
      b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .25); yTo((e.clientY - r.top - r.height / 2) * .35); });
      b.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
    var cur = $('#cursor'), cx = gsap.quickTo(cur, 'x', { duration: .25 }), cy = gsap.quickTo(cur, 'y', { duration: .25 });
    window.addEventListener('mousemove', function (e) { cur.style.opacity = 1; cx(e.clientX); cy(e.clientY); });
    document.addEventListener('mouseover', function (e) { cur.classList.toggle('big', !!e.target.closest('a, button, .prog')); });
  }
})();
