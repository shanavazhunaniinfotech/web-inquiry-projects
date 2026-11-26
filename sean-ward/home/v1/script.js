/* Ward Homes · CRO homepage concept · plain JS (+ GSAP / Leaflet from CDN, both optional) */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var U = function (id, w, h, q) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + w + (h ? '&h=' + h : '') + '&q=' + (q || 72); };
  var ic = function (name, cls) { return '<svg class="i' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; };
  var money = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var short = function (n) { return n >= 1e6 ? '$' + (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M' : '$' + Math.round(n / 1000) + 'k'; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  var ss = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ---------- data (sample projects, same as the /sean-ward/ feature demo) ---------- */
  var STAGES = ['Foundation', 'Framing', 'Dried in', 'Exterior', 'Keys'];
  var ST = {
    'Available': { c: 'avail', label: 'Available now', color: '#2e7d55', cta: 'Schedule a tour' },
    'Under construction': { c: 'build', label: 'Under construction', color: '#b97a1f', cta: 'Ask about this home' },
    'Completed': { c: 'done', label: 'Completed', color: '#4a6894', cta: 'Build one like this' }
  };
  var P = [
    { id: 'southlake', n: 'The Southlake Estate', city: 'Southlake', ll: [32.9412, -97.1342], s: 'Available', stage: 5, beds: 5, baths: 5, sqft: 5200, garage: 3,
      img: '1613977257363-707ba9348227', gal: ['1600596542815-ffad4c1539a9', '1600210491892-03d54c0aaf87', '1507089947368-19c1da9775ae'],
      price: '$1,895,000', note: 'Move-in ready',
      blurb: 'A resort-style estate on a full acre: walls of glass, a pool terrace made for Texas evenings, and a chef’s kitchen at the heart of it all.',
      feat: ['Resort pool & spa', 'Chef’s kitchen, 12 ft island', 'Spa-style primary suite', 'Media & game room', 'Spray-foam insulation', '3-car garage'] },
    { id: 'celina', n: 'Celina Hill Country', city: 'Celina', ll: [33.3246, -96.7845], s: 'Available', stage: 5, beds: 4, baths: 3, sqft: 3100, garage: 2,
      img: '1592595896551-12b371d546d5', gal: ['1615529182904-14819c35db37', '1556912173-3bb406ef7e77', '1560185007-cde436f6a4d0'],
      price: '$749,900', note: 'Move-in ready',
      blurb: 'Painted brick, warm wood and a big covered patio, on a quiet street a few minutes from Celina’s town square.',
      feat: ['Covered patio with ceiling fans', 'Open kitchen & family room', 'Study with French doors', 'Quartz throughout', 'Tankless water heater', 'Smart thermostat'] },
    { id: 'prosper', n: 'The Prosper Residence', city: 'Prosper', ll: [33.2362, -96.8011], s: 'Under construction', stage: 3, beds: 4, baths: 3.5, sqft: 3450, garage: 3,
      img: '1605276374104-dee2a0ed3cd6', gal: ['1600210491892-03d54c0aaf87', '1507089947368-19c1da9775ae', '1600566752355-35792bedcfea'],
      price: 'From $865,000', note: 'Ready spring 2027', render: true,
      blurb: 'Stone and brick transitional on an oversized lot. Dried in this week, which means there’s still time to choose your own finishes.',
      feat: ['Pick your own finishes', 'Two-story family room', 'Game room upstairs', 'Covered outdoor kitchen', 'Spray-foam insulation', '3-car garage'] },
    { id: 'rockwall', n: 'Rockwall Lakeside', city: 'Rockwall', ll: [32.9312, -96.4597], s: 'Under construction', stage: 2, beds: 4, baths: 3.5, sqft: 3800, garage: 3,
      img: '1600585154340-be6161a56a0c', gal: ['1600607687939-ce8a6c25118c', '1600566753086-00f18fb6b3ea', '1600566752355-35792bedcfea'],
      price: 'From $1,150,000', note: 'Ready summer 2027', render: true,
      blurb: 'A modern lake house framed for big views and long weekends. Framing is up, and floor plan changes are still possible.',
      feat: ['Floor plan still flexible', 'Lake-view great room', 'Glass wall to the patio', 'Wine room', 'Energy package', 'Workshop garage'] },
    { id: 'frisco', n: 'Frisco Modern Farmhouse', city: 'Frisco', ll: [33.1507, -96.8236], s: 'Completed', stage: 5, beds: 5, baths: 4, sqft: 4100, garage: 3,
      img: '1570129477492-45c003edd2be', gal: ['1600047508788-786f3865b4b9', '1600585152220-90363fe7e115', '1595526114035-0d45ed16cfbf'],
      price: 'Similar from $985k', note: 'Custom build · 2025',
      blurb: 'A wraparound porch, a light-filled open plan and a kitchen built for a family of seven. Delivered two weeks ahead of schedule.',
      feat: ['Wraparound porch', 'Floating oak staircase', 'Two kitchen islands', 'Mudroom & drop zone', 'Guest suite downstairs', 'Delivered early'] },
    { id: 'mckinney', n: 'The McKinney Traditional', city: 'McKinney', ll: [33.1972, -96.6398], s: 'Completed', stage: 5, beds: 3, baths: 2.5, sqft: 2650, garage: 2,
      img: '1598228723793-52759bba239c', gal: ['1600121848594-d8644e57abab', '1484154218962-a197022b5858', '1595526114035-0d45ed16cfbf'],
      price: 'Similar from $575k', note: 'Custom build · 2024',
      blurb: 'Classic red brick and black shutters on a tree-lined lot, with a modern open plan inside. A first custom home for a young family.',
      feat: ['Classic brick exterior', 'Open-concept living', 'Home office', 'Large backyard', 'Walk-in pantry', '4-item punch list'] }
  ];
  var byId = {}; P.forEach(function (p) { byId[p.id] = p; });

  var UPS = [
    { id: 'outdoor', n: 'Outdoor living & summer kitchen', d: 'Covered patio, fireplace, grill station', c: 'Outdoor living', ic: 'flame', lo: 45000, hi: 75000, tag: 'Most popular' },
    { id: 'pool', n: 'Resort-style pool & spa', d: 'Designed with your home, not after it', c: 'Pool & spa', ic: 'waves', lo: 85000, hi: 140000 },
    { id: 'energy', n: 'Energy package', d: 'Spray foam, solar-ready, tankless water', c: 'Energy package', ic: 'sun', lo: 18000, hi: 30000, tag: 'Lower bills' },
    { id: 'smart', n: 'Whole-home smart package', d: 'Lighting, security, Wi-Fi, shades', c: 'Smart home', ic: 'wifi', lo: 12500, hi: 25000 },
    { id: 'media', n: 'Media or game room', d: 'Wired for sound, built for movie night', c: 'Media room', ic: 'film', lo: 32000, hi: 55000 },
    { id: 'shop', n: 'Workshop garage', d: 'Extra bay, 220V power, storage', c: 'Workshop', ic: 'wrench', lo: 38000, hi: 60000 }
  ];
  var upById = {}; UPS.forEach(function (u) { upById[u.id] = u; });

  var state = {
    saved: store.get('wh_saved', []).filter(function (id) { return byId[id]; }),
    ups: store.get('wh_ups', []).filter(function (id) { return upById[id]; }),
    lead: ss.get('wh_lead') === '1'
  };

  /* ---------- scroll lock + focus trap ---------- */
  var locks = 0;
  function lock() { if (locks++ === 0) { root.style.overflow = 'hidden'; } }
  function unlock() { if (--locks <= 0) { locks = 0; root.style.overflow = ''; } }
  function trap(container) {
    return function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', container).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
  }

  /* ---------- toast ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(html, action, fn) {
    toastEl.innerHTML = html + (action ? '<button type="button">' + action + '</button>' : '');
    if (action) $('button', toastEl).onclick = function () { toastEl.classList.remove('is-on'); fn(); };
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 4200);
  }

  /* ---------- header ---------- */
  var hdr = $('#hdr'), hero = $('.hero'), menuBtn = $('.menu-btn'), mnav = $('#mnav');
  function onScroll() {
    var y = window.scrollY;
    hdr.classList.toggle('is-solid', y > 30);
    var mbar = $('#mbar');
    var contactTop = $('#contact').getBoundingClientRect().top;
    mbar.classList.toggle('is-on', y > hero.offsetHeight * 0.55 && contactTop > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    $('use', menuBtn).setAttribute('href', open ? '#i-x' : '#i-menu');
    mnav.hidden = !open;
    hdr.classList.toggle('is-open', open);
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1180) setMenu(false); });

  // active nav link
  if ('IntersectionObserver' in window) {
    var navLinks = $$('.nav a');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { io.observe(s); });
  }

  /* ---------- project cards ---------- */
  var grid = $('#pgrid');
  function srcset(id, ratio) {
    return [600, 900, 1200].map(function (w) { return U(id, w, Math.round(w / ratio), 70) + ' ' + w + 'w'; }).join(', ');
  }
  function specs(p) { return p.beds + ' bed · ' + p.baths + ' bath · ' + p.sqft.toLocaleString('en-US') + ' sq ft'; }
  function progHTML(p) {
    var bars = STAGES.map(function (s, i) { return '<i class="' + (i < p.stage ? 'on' : '') + '"></i>'; }).join('');
    return '<div class="prog" aria-hidden="true">' + bars + '</div><div class="prog-l"><span>Stage ' + p.stage + ' of 5 · ' + STAGES[p.stage - 1] + '</span><span>Updated Friday</span></div>';
  }
  function cardHTML(p) {
    var st = ST[p.s];
    return '<article class="pcard" data-s="' + p.s + '" data-id="' + p.id + '">' +
      '<div class="pcard__media">' +
        '<img src="' + U(p.img, 900, 763, 70) + '" srcset="' + srcset(p.img, 1.18) + '" sizes="(max-width: 760px) 100vw, (max-width: 1020px) 50vw, 410px" alt="' + esc(p.n) + ', ' + esc(p.city) + ', Texas" loading="lazy" decoding="async">' +
        '<button class="pcard__open" type="button" data-open-project="' + p.id + '" aria-label="View details: ' + esc(p.n) + '"></button>' +
        '<span class="badge"><i class="dot dot--' + st.c + '"></i>' + st.label + '</span>' +
        '<button class="save" type="button" data-save="' + p.id + '" aria-pressed="false" aria-label="Save ' + esc(p.n) + '">' + ic('heart') + '</button>' +
        (p.render ? '<span class="pcard__render">Artist’s rendering</span>' : '') +
        '<span class="pcard__view">View home ' + ic('arrow') + '</span>' +
      '</div>' +
      '<div class="pcard__body">' +
        '<p class="pcard__city">' + ic('pin') + esc(p.city) + ', TX</p>' +
        '<h3>' + esc(p.n) + '</h3>' +
        '<p class="pcard__specs">' + specs(p) + '</p>' +
        (p.s === 'Under construction' ? progHTML(p) : '') +
        '<div class="pcard__row"><span class="pcard__price">' + p.price + '</span><span class="pcard__note">' + p.note + '</span></div>' +
        '<div class="pcard__cta"><a class="btn btn--dark" href="#contact" data-cta="' + p.id + '">' + st.cta + '</a><button class="btn btn--line" type="button" data-open-project="' + p.id + '">Details</button></div>' +
      '</div>' +
    '</article>';
  }
  grid.innerHTML = P.map(cardHTML).join('');

  // filters
  var filter = 'all';
  $('.filters').addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]'); if (!b) return;
    filter = b.dataset.f;
    $$('.filters button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    var shown = [];
    $$('.pcard', grid).forEach(function (c) {
      var on = filter === 'all' || c.dataset.s === filter;
      c.hidden = !on; if (on) shown.push(c);
    });
    grid.scrollLeft = 0;
    if (window.gsap && !reduce) gsap.fromTo(shown, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, ease: 'expo.out', stagger: .06, overwrite: true });
    if (map) filterMarkers();
  });

  /* ---------- contact prefill ---------- */
  var cform = $('#cform');
  function prefill(msg, interest) {
    if (msg) {
      var ta = cform.elements.message;
      ta.value = msg;
    }
    if (interest) {
      var r = $$('input[name="interest"]', cform).filter(function (x) { return x.value === interest; })[0];
      if (r) r.checked = true;
    }
  }
  function goContact() {
    var t = $('#contact');
    t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(function () { cform.elements.name.focus({ preventScroll: true }); }, reduce ? 0 : 900);
  }
  function ctaFor(p) {
    if (p.s === 'Available') return { msg: 'I’d like to tour ' + p.n + ' in ' + p.city + '.', interest: 'An available home' };
    if (p.s === 'Under construction') return { msg: 'I’m interested in ' + p.n + ' in ' + p.city + ' (under construction). Is it still available, and can I still choose finishes?', interest: 'An available home' };
    return { msg: 'I’d like to build a home like ' + p.n + '.', interest: 'Not sure yet' };
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-cta]');
    if (a) { e.preventDefault(); var c = ctaFor(byId[a.dataset.cta]); prefill(c.msg, c.interest); closePM(); goContact(); return; }
    var pf = e.target.closest('[data-prefill]');
    if (pf) { prefill(pf.dataset.prefill); }
    var op = e.target.closest('[data-open-project]');
    if (op) { e.preventDefault(); openPM(op.dataset.openProject, op); return; }
    var sv = e.target.closest('[data-save]');
    if (sv) { e.preventDefault(); toggleSave(sv.dataset.save, sv); }
  });

  /* ---------- saved homes (shortlist drawer with upsells) ---------- */
  var drawer = $('#drawer'), dPanel = $('.drawer__panel', drawer), savedBtn = $('.saved-btn'), lastFocus = null;
  var dTrap = trap(dPanel);
  function persist() { store.set('wh_saved', state.saved); store.set('wh_ups', state.ups); }
  function isSaved(id) { return state.saved.indexOf(id) > -1; }
  function syncSaveButtons() {
    $$('[data-save]').forEach(function (b) {
      var on = isSaved(b.dataset.save), p = byId[b.dataset.save];
      b.setAttribute('aria-pressed', String(on));
      if (b.classList.contains('save')) b.setAttribute('aria-label', (on ? 'Remove ' : 'Save ') + p.n + (on ? ' from saved homes' : ''));
    });
    var pmSave = $('#pmSave');
    if (pmSave.dataset.id) {
      var on = isSaved(pmSave.dataset.id);
      pmSave.setAttribute('aria-pressed', String(on));
      $('span', pmSave).textContent = on ? 'Saved' : 'Save';
    }
    var n = state.saved.length, badge = $('.saved-btn__n');
    badge.textContent = n; badge.hidden = n === 0;
    savedBtn.classList.toggle('has-items', n > 0);
    savedBtn.setAttribute('aria-label', 'Saved homes, ' + n + ' saved');
  }
  function toggleSave(id, btn) {
    var p = byId[id]; if (!p) return;
    var adding = !isSaved(id);
    if (adding) state.saved.push(id); else state.saved = state.saved.filter(function (x) { return x !== id; });
    persist(); syncSaveButtons(); renderDrawer();
    if (btn && btn.classList.contains('save')) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
    savedBtn.classList.remove('bump'); void savedBtn.offsetWidth; savedBtn.classList.add('bump');
    if (adding) {
      var first = !ss.get('wh_drawer_seen');
      if (first && pm.hidden && !drawer.classList.contains('is-open')) { ss.set('wh_drawer_seen', '1'); openDrawer(btn); }
      else if (!drawer.classList.contains('is-open')) toast(ic('heart') + '<span>Saved <b>' + esc(p.n) + '</b></span>', 'View shortlist', function () { openDrawer(savedBtn); });
    } else if (!drawer.classList.contains('is-open')) {
      toast('<span>Removed from your shortlist</span>', 'Undo', function () { toggleSave(id); });
    }
  }
  function renderDrawer() {
    var n = state.saved.length, m = state.ups.length;
    $('#dCount').textContent = n;
    $('#dItems').innerHTML = n ? state.saved.map(function (id) {
      var p = byId[id], st = ST[p.s];
      return '<div class="ditem"><img src="' + U(p.img, 200, 166, 60) + '" alt="">' +
        '<div><b>' + esc(p.n) + '</b><small>' + esc(p.city) + ', TX · ' + p.sqft.toLocaleString('en-US') + ' sq ft · ' + p.price + '</small>' +
        '<span class="st"><i class="dot dot--' + st.c + '"></i>' + st.label + '</span></div>' +
        '<button class="ditem__x" type="button" data-remove="' + id + '" aria-label="Remove ' + esc(p.n) + '">' + ic('x') + '</button></div>';
    }).join('') : '<div class="dempty">' + ic('heart') + '<b>Your shortlist is empty</b><p>Tap the heart on any home to save it. Sean will send floor plans and pricing for each one.</p></div>';
    $('#dUps').innerHTML = UPS.map(function (u) {
      var on = state.ups.indexOf(u.id) > -1;
      return '<li class="dup' + (on ? ' is-on' : '') + '"><span class="dup__ic">' + ic(u.ic) + '</span>' +
        '<div><b>' + u.n + (u.tag ? '<span class="dup__tag">' + u.tag + '</span>' : '') + '</b><small>' + u.d + ' · from ' + short(u.lo) + '</small></div>' +
        '<button type="button" data-up="' + u.id + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Remove ' : 'Add ') + u.n + '">' + (on ? ic('check') + 'Added' : ic('plus') + 'Add') + '</button></li>';
    }).join('');
    var recs = P.filter(function (p) { return !isSaved(p.id); }).slice(0, 2);
    $('#dRecWrap').hidden = !recs.length;
    $('#dRecs').innerHTML = recs.map(function (p) {
      return '<button class="drec" type="button" data-save="' + p.id + '" aria-pressed="false"><img src="' + U(p.img, 320, 192, 60) + '" alt="">' +
        '<div><b>' + esc(p.n) + '</b><small>' + esc(p.city) + ' · ' + p.price + '</small><span>' + ic('plus') + 'Save home</span></div></button>';
    }).join('');
    var lo = 0; state.ups.forEach(function (id) { lo += upById[id].lo; });
    $('#dSum').textContent = n + (n === 1 ? ' home' : ' homes') + ' · ' + m + (m === 1 ? ' upgrade' : ' upgrades');
    $('#dUpTotal').textContent = m ? 'Upgrades from ' + short(lo) : '';
    $('#dCta').innerHTML = (n ? 'Get floor plans &amp; pricing' : 'Book a free consultation') + ' ' + ic('arrow');
    syncSaveButtons();
  }
  function toggleUp(id) {
    var i = state.ups.indexOf(id);
    if (i > -1) state.ups.splice(i, 1); else state.ups.push(id);
    persist(); renderDrawer(); renderEstChips(); calc();
  }
  drawer.addEventListener('click', function (e) {
    var up = e.target.closest('[data-up]'); if (up) { toggleUp(up.dataset.up); var again = $('[data-up="' + up.dataset.up + '"]', drawer); if (again) again.focus(); return; }
    var rm = e.target.closest('[data-remove]'); if (rm) { toggleSave(rm.dataset.remove); return; }
    if (e.target.closest('[data-close-drawer]')) closeDrawer();
  });
  function openDrawer(from) {
    lastFocus = from || document.activeElement;
    renderDrawer();
    drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false');
    lock();
    setTimeout(function () { dPanel.focus(); }, 60);
    document.addEventListener('keydown', dKeys);
  }
  function closeDrawer() {
    if (!drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true');
    unlock();
    document.removeEventListener('keydown', dKeys);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function dKeys(e) { if (e.key === 'Escape') closeDrawer(); else dTrap(e); }
  $$('[data-open-drawer]').forEach(function (b) { b.addEventListener('click', function () { openDrawer(b); }); });
  $('#dCta').addEventListener('click', function (e) {
    e.preventDefault();
    var lines = [];
    if (state.saved.length) lines.push('Homes I saved: ' + state.saved.map(function (id) { return byId[id].n; }).join(', ') + '.');
    if (state.ups.length) lines.push('Upgrades I’m interested in: ' + state.ups.map(function (id) { return upById[id].n; }).join(', ') + '.');
    if (lines.length) lines.push('Please send floor plans and pricing.');
    prefill(lines.join('\n'));
    closeDrawer();
    goContact();
  });

  /* ---------- project modal ---------- */
  var pm = $('#pm'), pmPanel = $('.pm__panel', pm), pmTrap = trap(pmPanel), pmFrom = null, pmCur = null;
  function setMain(id, p) {
    var img = $('#pmImg');
    img.src = U(id, 1200, 960, 72);
    img.alt = p.n + ', ' + p.city + ', Texas';
    $('#pmRender').hidden = !(p.render && id === p.img);
    $$('#pmThumbs button').forEach(function (b) { b.setAttribute('aria-current', String(b.dataset.img === id)); });
  }
  function openPM(id, from) {
    var p = byId[id]; if (!p) return;
    pmCur = p; pmFrom = from || document.activeElement;
    var st = ST[p.s], gal = [p.img].concat(p.gal);
    gal.forEach(function (g) { var im = new Image(); im.src = U(g, 1200, 960, 72); }); // instant thumbnail switching
    $('#pmStatus').innerHTML = '<i class="dot dot--' + st.c + '"></i>' + st.label;
    $('#pmTitle').textContent = p.n;
    $('#pmCity').innerHTML = ic('pin') + esc(p.city) + ', Texas';
    $('#pmSpecs').innerHTML = [['Beds', p.beds], ['Baths', p.baths], ['Sq ft', p.sqft.toLocaleString('en-US')], ['Garage', p.garage + '-car']].map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('');
    $('#pmPrice').innerHTML = p.price + '<small>' + p.note + '</small>';
    $('#pmBlurb').textContent = p.blurb;
    $('#pmFeat').innerHTML = p.feat.map(function (f) { return '<li>' + ic('check') + esc(f) + '</li>'; }).join('');
    var prog = $('#pmProg');
    if (p.s === 'Under construction') {
      prog.hidden = false;
      prog.innerHTML = '<p>Build progress · Stage ' + p.stage + ' of 5: ' + STAGES[p.stage - 1] + '</p>' + '<ol class="track" style="margin:10px 0 0">' + STAGES.map(function (s, i) {
        return '<li class="' + (i < p.stage - 1 ? 'is-done' : i === p.stage - 1 ? 'is-now' : '') + '"><span></span>' + s + '</li>';
      }).join('') + '</ol>';
    } else prog.hidden = true;
    $('#pmThumbs').innerHTML = gal.map(function (g, i) {
      return '<button type="button" data-img="' + g + '" aria-label="Show photo ' + (i + 1) + ' of ' + gal.length + '"><img src="' + U(g, 300, 230, 60) + '" alt="" loading="lazy"></button>';
    }).join('');
    setMain(p.img, p);
    var cta = $('#pmCta');
    cta.innerHTML = st.cta + ' ' + ic('arrow');
    cta.dataset.cta = p.id;
    $('#pmSave').dataset.id = p.id;
    syncSaveButtons();
    pm.hidden = false; lock();
    pmPanel.scrollTop = 0;
    setTimeout(function () { pmPanel.focus(); }, 30);
    document.addEventListener('keydown', pmKeys);
  }
  function closePM() {
    if (pm.hidden) return;
    pm.hidden = true; unlock();
    document.removeEventListener('keydown', pmKeys);
    if (pmFrom && pmFrom.focus && document.body.contains(pmFrom)) pmFrom.focus({ preventScroll: true });
  }
  function pmKeys(e) {
    if (e.key === 'Escape') return closePM();
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && pmCur && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      var gal = [pmCur.img].concat(pmCur.gal), cur = $('#pmThumbs [aria-current="true"]').dataset.img, i = gal.indexOf(cur);
      setMain(gal[(i + (e.key === 'ArrowRight' ? 1 : gal.length - 1)) % gal.length], pmCur);
    }
    pmTrap(e);
  }
  pm.addEventListener('click', function (e) {
    if (e.target.closest('[data-close-pm]')) return closePM();
    var t = e.target.closest('[data-img]'); if (t) setMain(t.dataset.img, pmCur);
  });
  $('#pmSave').addEventListener('click', function () { toggleSave(this.dataset.id, this); });

  /* ---------- hero quick-start (multi-step) ---------- */
  var qs = $('#qs'), qStep = 1, qPanes = $$('.qs__pane', qs), qBack = $('.qs__back', qs), qNext = null;
  function qGo(n) {
    qStep = n;
    qPanes.forEach(function (p) { p.classList.toggle('is-on', +p.dataset.step === n); });
    $('.qs__bar span', qs).style.width = (n / 4 * 100) + '%';
    $('.qs__step', qs).textContent = 'Step ' + n + ' of 4';
    qBack.hidden = n === 1;
    if (qNext) syncNext();
    if (n === 4) setTimeout(function () { qs.elements.name.focus({ preventScroll: true }); }, 80);
  }
  var ptr = 0; qNext = $('.qs__next', qs);
  function syncNext() { qNext.hidden = qStep >= 4 || !$('.qs__pane.is-on input:checked', qs); }
  qs.addEventListener('pointerdown', function () { ptr = Date.now(); });
  qs.addEventListener('change', syncNext);
  qs.addEventListener('click', function (e) {
    var inp = e.target.closest('.opt input'); if (!inp) return;
    syncNext();
    if (Date.now() - ptr > 900) return; // keyboard: choose with arrows, then Continue
    var n = +inp.closest('.qs__pane').dataset.step;
    setTimeout(function () { if (qStep === n) qGo(n + 1); }, reduce ? 0 : 260);
  });
  qNext.addEventListener('click', function () { if (qStep < 4) { qGo(qStep + 1); var f = $('.qs__pane.is-on input', qs); if (f) f.focus({ preventScroll: true }); } });
  qBack.addEventListener('click', function () { if (qStep > 1) qGo(qStep - 1); });

  /* ---------- validation ---------- */
  function clearErr(form) { $$('.fld.is-err', form).forEach(function (f) { f.classList.remove('is-err'); var m = $('.err', f); if (m) m.remove(); }); }
  function err(input, msg) {
    var f = input.closest('.fld'); if (!f) return;
    f.classList.add('is-err');
    var m = document.createElement('span'); m.className = 'err'; m.textContent = msg; f.appendChild(m);
  }
  function validate(form) {
    clearErr(form);
    var bad = [], el = form.elements;
    if (el.name && !el.name.value.trim()) { err(el.name, 'Please enter your name'); bad.push(el.name); }
    if (el.phone && (el.phone.value.replace(/\D/g, '').length < 10)) { err(el.phone, 'Please enter a 10-digit phone number'); bad.push(el.phone); }
    if (el.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.email.value.trim())) { err(el.email, 'Please enter a valid email'); bad.push(el.email); }
    if (bad.length) bad[0].focus();
    return !bad.length;
  }
  function leadDone() { state.lead = true; ss.set('wh_lead', '1'); }

  qs.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(qs)) return;
    var name = qs.elements.name.value.trim().split(' ')[0];
    $('[data-name]', qs).textContent = name ? ', ' + name : '';
    qPanes.forEach(function (p) { p.classList.remove('is-on'); });
    $('.qs__head', qs).hidden = true; qBack.hidden = true; qNext.hidden = true; $('.qs__perks', qs).hidden = true;
    var done = $('.qs__done', qs); done.hidden = false; done.focus({ preventScroll: true });
    // carry details into the main form, so nothing is typed twice
    cform.elements.name.value = qs.elements.name.value; cform.elements.phone.value = qs.elements.phone.value; cform.elements.email.value = qs.elements.email.value;
    leadDone();
  });

  cform.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(cform)) return;
    var name = cform.elements.name.value.trim().split(' ')[0];
    $('[data-name]', cform).textContent = name ? ', ' + name : '';
    $('.cform__body', cform).hidden = true;
    var done = $('.cform__done', cform); done.hidden = false; done.focus({ preventScroll: true });
    leadDone();
  });
  $$('.fld input').forEach(function (i) { i.addEventListener('input', function () { var f = i.closest('.fld'); if (f.classList.contains('is-err')) { f.classList.remove('is-err'); var m = $('.err', f); if (m) m.remove(); } }); });

  /* ---------- cost estimator ---------- */
  var RATES = { signature: [205, 240], premium: [240, 290], estate: [290, 370] };
  var FIN_NAME = { signature: 'Signature', premium: 'Premium', estate: 'Estate' };
  var est = $('#est'), size = $('#estSize'), lowEl = $('#estLow'), highEl = $('#estHigh'), cur = { lo: 0, hi: 0 };
  function renderEstChips() {
    $('#estUps').innerHTML = UPS.map(function (u) {
      var on = state.ups.indexOf(u.id) > -1;
      return '<button type="button" class="chip" data-est-up="' + u.id + '" aria-pressed="' + on + '">' + ic(on ? 'check' : u.ic) + u.c + '</button>';
    }).join('');
  }
  function estValues() {
    var sq = +size.value, fin = (est.elements.finish.value || 'premium'), st = +(est.elements.stories.value || 2);
    var f = st === 1 ? 1.06 : 1, r = RATES[fin];
    var uLo = 0, uHi = 0; state.ups.forEach(function (id) { uLo += upById[id].lo; uHi += upById[id].hi; });
    var lo = Math.round((sq * r[0] * f + uLo) / 5000) * 5000, hi = Math.round((sq * r[1] * f + uHi) / 5000) * 5000;
    var m = Math.round(7 + (sq - 2000) / 1300 + ({ signature: 0, premium: .6, estate: 1.6 })[fin]);
    return { sq: sq, fin: fin, st: st, lo: lo, hi: hi, psf: [Math.round(r[0] * f), Math.round(r[1] * f)], months: [m, m + 2] };
  }
  function tween(from, to, fn) {
    if (reduce) return fn(to);
    var t0 = performance.now();
    (function step(t) { var k = Math.min(1, (t - t0) / 450), e = 1 - Math.pow(1 - k, 3); fn(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); })(t0);
  }
  function calc() {
    var v = estValues();
    $('#estSizeOut').textContent = v.sq.toLocaleString('en-US') + ' sq ft';
    size.style.setProperty('--fill', ((v.sq - 2000) / 5000 * 100) + '%');
    var lo0 = cur.lo || v.lo, hi0 = cur.hi || v.hi;
    tween(lo0, v.lo, function (x) { lowEl.textContent = short(Math.round(x / 5000) * 5000); });
    tween(hi0, v.hi, function (x) { highEl.textContent = short(Math.round(x / 5000) * 5000); });
    cur = { lo: v.lo, hi: v.hi };
    $('#estPsf').textContent = '$' + v.psf[0] + '–$' + v.psf[1];
    $('#estTime').textContent = v.months[0] + '–' + v.months[1] + ' months';
    var min = 2000 * 205, max = 7000 * 370 * 1.06 + 385000;
    var bar = $('#estBar');
    bar.style.marginLeft = ((v.lo - min) / (max - min) * 100) + '%';
    bar.style.width = Math.max(6, (v.hi - v.lo) / (max - min) * 100) + '%';
  }
  size.addEventListener('input', calc);
  est.addEventListener('change', calc);
  $('#estUps').addEventListener('click', function (e) { var b = e.target.closest('[data-est-up]'); if (b) { toggleUp(b.dataset.estUp); var again = $('[data-est-up="' + b.dataset.estUp + '"]'); if (again) again.focus(); } });
  renderEstChips(); calc();
  $('#estTalk').addEventListener('click', function (e) {
    e.preventDefault();
    var v = estValues();
    var ups = state.ups.length ? ', with ' + state.ups.map(function (id) { return upById[id].n.toLowerCase(); }).join(', ') : '';
    prefill('My estimate: ' + v.sq.toLocaleString('en-US') + ' sq ft, ' + FIN_NAME[v.fin] + ' finishes, ' + (v.st === 1 ? 'one story' : 'two stories') + ups + ' (' + short(v.lo) + '–' + short(v.hi) + '). I’d like to talk it through.');
    goContact();
  });
  function emailOnly(form, okSel) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = form.elements.email, box = inp.closest('.inline-field');
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inp.value.trim());
      box.classList.toggle('is-err', !ok);
      if (!ok) { inp.focus(); inp.setAttribute('aria-invalid', 'true'); return; }
      inp.removeAttribute('aria-invalid');
      box.hidden = true; $(okSel, form).hidden = false;
      leadDone();
    });
  }
  emailOnly($('#estLead'), '.est__ok');
  emailOnly($('#xmForm'), '.xm__ok');

  /* ---------- FAQ: one open at a time ---------- */
  $$('#faqList details').forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) $$('#faqList details').forEach(function (o) { if (o !== d) o.open = false; }); });
  });

  /* ---------- map (Leaflet, lazy) ---------- */
  var map = null, markers = {};
  function initMap() {
    if (map || !window.L) return;
    map = L.map('map', { scrollWheelZoom: false, dragging: !L.Browser.mobile, zoomControl: true, attributionControl: true });
    map.on('popupopen', function (ev) {
      var b = ev.popup.getElement().querySelector('[data-open-project]');
      if (b) b.addEventListener('click', function () { openPM(b.dataset.openProject, b); });
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 18
    }).addTo(map);
    var pts = [];
    P.forEach(function (p) {
      var st = ST[p.s];
      var icon = L.divIcon({ className: '', html: '<div class="pin" style="background:' + st.color + ';color:' + st.color + '"></div>', iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -12] });
      var m = L.marker(p.ll, { icon: icon, title: p.n, keyboard: true }).addTo(map);
      m.bindPopup('<b>' + esc(p.n) + '</b>' + esc(p.city) + ', TX · ' + st.label + '<br>' + p.price + '<br><button type="button" data-open-project="' + p.id + '">View home</button>');
      markers[p.id] = m; pts.push(p.ll);
    });
    var hq = L.divIcon({ className: '', html: '<div class="hq"><svg viewBox="0 0 40 40"><use href="#i-logo"/></svg></div>', iconSize: [34, 34], iconAnchor: [17, 17] });
    L.marker([32.7876, -96.7985], { icon: hq, title: 'Ward Homes design studio' }).addTo(map).bindPopup('<b>Design studio</b>Dallas, TX · by appointment');
    pts.push([32.7876, -96.7985]);
    map.fitBounds(pts, { padding: [36, 36] });
    filterMarkers();
  }
  function filterMarkers() {
    P.forEach(function (p) {
      var m = markers[p.id], on = filter === 'all' || p.s === filter;
      if (on && !map.hasLayer(m)) m.addTo(map);
      if (!on && map.hasLayer(m)) map.removeLayer(m);
    });
  }
  if ('IntersectionObserver' in window) {
    var mio = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { initMap(); mio.disconnect(); } }, { rootMargin: '400px 0px' });
    mio.observe($('#map'));
  } else initMap();

  /* ---------- exit intent (desktop, once per session) ---------- */
  var xm = $('#xm'), xmPanel = $('.xm__panel', xm), xmTrap = trap(xmPanel), xmFrom = null, t0 = Date.now();
  function openXM() {
    if (state.lead || ss.get('wh_xm') || !pm.hidden || drawer.classList.contains('is-open')) return;
    ss.set('wh_xm', '1'); xmFrom = document.activeElement;
    xm.hidden = false; lock();
    setTimeout(function () { xmPanel.focus(); }, 30);
    document.addEventListener('keydown', xmKeys);
  }
  function closeXM() { if (xm.hidden) return; xm.hidden = true; unlock(); document.removeEventListener('keydown', xmKeys); if (xmFrom && xmFrom.focus) xmFrom.focus({ preventScroll: true }); }
  function xmKeys(e) { if (e.key === 'Escape') closeXM(); else xmTrap(e); }
  xm.addEventListener('click', function (e) { if (e.target.closest('[data-close-xm]')) closeXM(); });
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget && e.clientY <= 0 && Date.now() - t0 > 15000) openXM();
    });
  }

  /* ---------- count-up ---------- */
  function countUp(el) {
    var to = +el.dataset.count;
    if (reduce) { el.textContent = to; return; }
    var t1 = performance.now();
    (function step(t) { var k = Math.min(1, (t - t1) / 1600), e = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(to * e); if (k < 1) requestAnimationFrame(step); })(t1);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { countUp(x.target); cio.unobserve(x.target); } }); }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { el.textContent = '0'; cio.observe(el); });
  }

  /* ---------- motion (GSAP) ---------- */
  function splitWords(el) {
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var inner = document.createElement('span'); inner.textContent = part; w.appendChild(inner); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    }
    el.setAttribute('aria-label', el.textContent);
    walk(el);
    $$('.w', el).forEach(function (w) { w.setAttribute('aria-hidden', 'true'); });
  }
  if (window.gsap && !reduce) {
    root.classList.add('js-motion');
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    var title = $('[data-split]'); splitWords(title);
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo('.hero__media img', { scale: 1.16 }, { scale: 1, duration: 2.6, ease: 'power2.out' }, 0)
      .from('.hero__title .w > span', { yPercent: 115, duration: 1.2, stagger: .045 }, .1)
      .from(['.hero .eyebrow', '.hero__lede', '.hero__ctas', '.hero__micro', '.hero__trust'], { y: 26, opacity: 0, duration: 1, stagger: .08 }, .35)
      .from('.qs', { y: 50, opacity: 0, duration: 1.2 }, .45)
      .from('.hero__caption', { opacity: 0, duration: 1 }, 1);
    if (window.ScrollTrigger) {
      gsap.to('.hero__media img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      ScrollTrigger.batch('.reveal', { start: 'top 88%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .08 }); } });
      gsap.set('.pcard', { opacity: 0, y: 40 });
      ScrollTrigger.batch('.pcard', { start: 'top 92%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .08 }); } });
      gsap.set('.pillar, .step, .rcard', { opacity: 0, y: 36 });
      ScrollTrigger.batch('.pillar, .step, .rcard', { start: 'top 92%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .09 }); } });
      gsap.fromTo('.steps', { '--p': 0 }, { '--p': 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 80%', end: 'bottom 55%', scrub: true } });
      gsap.fromTo('.arch img', { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'center center', scrub: true } });
      gsap.fromTo('.follow__photos figure:nth-child(1)', { y: 30 }, { y: -10, ease: 'none', scrollTrigger: { trigger: '.follow', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('.contact__bg img', { yPercent: -8, scale: 1.12 }, { yPercent: 8, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from('.feature__img img', { scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.feature', start: 'top bottom', end: 'center center', scrub: true } });
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    }
  }

  /* ---------- design notes (open the page with ?notes to explain the layout) ---------- */
  var NOTES = {
    hero: ['The first 5 seconds', [
      'The headline speaks to the biggest fear of building a home (surprise costs and delays) and answers it: fixed price, written schedule, weekly photos.',
      'One main action, “Book a free consultation”, repeated in the sticky header, so there’s never a question about what to do next.',
      'The 60-second quick-start form catches visitors who aren’t ready to call. Easy taps first, contact details last: multi-step forms usually convert better than one long form.',
      'Trust cues (rating, warranty) sit right under the button, exactly where people hesitate.']],
    proof: ['Proof before the pitch', [
      'Numbers are more believable than adjectives: “150+ homes, 98% on schedule” beats “quality builder”.',
      'Placed straight after the promise, so visitors browse the homes already trusting Ward.',
      'The moving strip repeats the guarantees for fast scrollers.']],
    homes: ['What visitors came for', [
      'Sean asked for a place to host projects, and it’s the #1 reason people visit a builder’s site, so it comes first.',
      'Status filters split ready-to-buy shoppers (Available now, with prices) from custom-build leads. The hottest homes are listed first.',
      'Each card’s button matches its status: Schedule a tour, Ask about this home, Build one like this. Sean knows exactly which home a lead is calling about.',
      '♡ Save builds a shortlist (heart, top right) with popular upgrades. Undecided visitors stay instead of leaving, and their picks arrive with the enquiry.',
      'The map shows the cities people search for (“custom home builder Frisco”): good for local SEO and it makes Ward feel close.']],
    why: ['Taking the risk out', [
      'Once someone likes the homes, the next thought is “what could go wrong?”. Four guarantees answer the four big fears: budget, schedule, communication and quality.',
      'Each ends with a proof line, so it reads as a fact, not a slogan.',
      'The comparison makes choosing Ward easy without naming any competitor.']],
    process: ['Making the first step feel small', [
      'People hold back when they don’t know what happens next. Five steps with timeframes remove that uncertainty.',
      'Step 1 is free and low-pressure, so booking a call feels safe.',
      'Follow the build turns site photos into a selling point. Texas has no state license for home builders, so seeing the work behind the walls is how buyers decide who to trust.']],
    cost: ['Answering “how much?”', [
      'Price is everyone’s first question, and most builder sites dodge it. An honest range builds trust immediately.',
      'Interactive tools keep people on the page and pre-qualify them: Sean sees size, finishes and budget before the call.',
      'The full breakdown is offered for an email: a lead from someone not ready to call yet. Upgrades picked here also appear in the saved-homes panel.']],
    reviews: ['Social proof at decision time', [
      'Placed just before the enquiry form, when doubt is highest.',
      'Specific stories (“moved in two weeks early”, “four items on the punch list”) persuade far more than stars, and each answers a different fear: budget, relocating, a tricky lot, quality.',
      'These will be replaced with Sean’s real Google reviews.']],
    about: ['People hire people', [
      'Against big production builders, Sean himself is the advantage. A first-person promise and a signature make Ward feel personal.',
      '“A limited number of homes each year” explains the personal attention and creates honest urgency, with no fake countdowns.',
      'Placeholder photo: a photo of Sean on site goes here.']],
    faq: ['Clearing the last objections', [
      'Answers the questions that stop people from getting in touch: cost, land, timeline, what’s included, financing, warranty.',
      'Answers link back to the estimator and homes, with a direct line to Sean alongside.',
      'Ready to be marked up for FAQ results in Google.']],
    contact: ['The ask', [
      '“What happens next” removes the fear of a hard sales pitch.',
      'Only 3 required fields, interest is one tap, and the message is pre-filled from saved homes, the estimate or the home they clicked.',
      'Site-wide: sticky header with phone and button, a Call / Text / Book bar on phones, and a one-time cost-guide offer when a desktop visitor is about to leave.']]
  };
  var wantNotes = /[?&#]notes\b/.test(location.search + location.hash) || ss.get('wh_notes') === '1';
  if (wantNotes) {
    ss.set('wh_notes', '1');
    var k = 0;
    $$('[data-note]').forEach(function (sec) {
      var n = NOTES[sec.dataset.note]; if (!n) return; k++;
      var box = document.createElement('details');
      box.className = 'dnote';
      box.innerHTML = '<summary><b>' + k + '</b><span>Why this is here: ' + n[0] + '</span>' + ic('chev') + '</summary><ul>' + n[1].map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
      sec.appendChild(box);
    });
    var tg = document.createElement('button');
    tg.type = 'button'; tg.className = 'dn-toggle';
    tg.innerHTML = ic('note') + '<span>Hide design notes</span>';
    tg.addEventListener('click', function () {
      var on = document.body.classList.toggle('notes-on');
      $('span', tg).textContent = on ? 'Hide design notes' : 'Show design notes';
    });
    var all = document.createElement('button');
    all.type = 'button'; all.className = 'dn-toggle dn-toggle--all';
    all.textContent = 'Open all notes';
    all.addEventListener('click', function () {
      var open = all.textContent === 'Open all notes';
      $$('.dnote').forEach(function (d) { d.open = open; });
      all.textContent = open ? 'Close all notes' : 'Open all notes';
    });
    document.body.appendChild(tg); document.body.appendChild(all);
    document.body.classList.add('notes-on');
  }

  /* ---------- misc ---------- */
  $('#yr').textContent = new Date().getFullYear();
  renderDrawer();
})();
