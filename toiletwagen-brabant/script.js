/* Toiletwagen Brabant — "Noir & Gold" home page */
(function () {
  'use strict';

  /* ================= DATA (from the live WooCommerce store) ================= */
  var BASE = { 'Stroom': '220V', 'Voorzien van': '2 fonteintjes met spiegel, 2 elektrische handdrogers en zeepautomaat', 'Geleverd met': 'Wc-papier, zonder meerprijs' };
  var DRAIN = '5 meter (Ø110 mm), septictank bij te leveren';
  var P = [
    { id: 'mini-grijs', name: 'Mini Grijs', short: 'Grijs', img: ['mini-grijs.jpg'], day: 225, wk: 270, lay: { f: 1, m: 1 }, pos: 2, dims: '2,4 × 1,65 × 2,9 m', drain: DRAIN, guests: 'tot ca. 80 gasten' },
    { id: 'mini-hout', name: 'Mini Hout', short: 'Hout', img: ['mini-hout.jpg'], day: 250, wk: 290, lay: { f: 1, m: 1 }, pos: 2, dims: '2,4 × 1,65 × 2,9 m', drain: DRAIN, guests: 'tot ca. 80 gasten' },
    { id: 'mini-wit', name: 'Mini Wit met vermalers', short: 'Wit', img: ['mini-wit.jpg', 'interieur-wasbak.jpg'], day: 260, wk: 295, lay: { f: 1, m: 1 }, pos: 2, dims: '2,4 × 1,65 × 2,9 m', drain: DRAIN, guests: 'tot ca. 80 gasten' },
    { id: 'mini-vacuum', name: 'Mini Vacuümtoilet', short: 'Vacuüm', img: ['mini-vacuum.jpg'], day: null, wk: null, lay: { f: 1, m: 1 }, pos: 2, dims: '2,4 × 1,65 × 2,9 m', drain: 'Geen afvoer nodig, alles compleet', guests: 'tot ca. 80 gasten' },
    { id: 'type-a', name: 'Type A', short: 'Type A', img: ['type-a.jpg'], day: 275, wk: 305, lay: { f: 2, m: 1, u: 2 }, pos: 5, dims: '3,6 × 2,2 × 2,9 m', drain: DRAIN, guests: 'tot ca. 200 gasten', km: '€0,90' },
    { id: 'wit-type-a', name: 'Wit Type A', short: 'Wit', img: ['wit-type-a.jpg'], day: 300, wk: 325, lay: { f: 2, m: 1, u: 2 }, pos: 5, dims: '3,6 × 2,2 × 2,9 m', drain: DRAIN, guests: 'tot ca. 200 gasten', tag: 'Nieuw' },
    { id: 'type-a-grey', name: 'Type A Grey Edition', short: 'Grey Edition', img: ['type-a-grey.jpg'], day: 325, wk: 375, lay: { f: 2, m: 1, u: 2 }, pos: 5, dims: '3,6 × 2,5 × 2,9 m', drain: DRAIN, guests: 'tot ca. 200 gasten' },
    { id: 'type-b', name: 'Type B Deluxe', short: 'Deluxe', img: ['type-b-deluxe.jpg'], day: 350, wk: 385, lay: { f: 3, m: 1, u: 3 }, pos: 7, dims: '5 × 2,2 × 2,9 m', drain: DRAIN, guests: 'tot ca. 300 gasten' },
    { id: 'vip-hout', name: 'VIP Hout', short: 'Hout', img: ['vip-hout.jpg', 'vip-hout-2.jpg', 'vip-hout-3.jpg'], day: 395, wk: 445, lay: { f: 3, m: 1, u: 3 }, pos: 7, dims: '5 × 2,2 × 2,9 m', drain: DRAIN, guests: 'tot ca. 300 gasten', tag: 'Meest gekozen', extra: { 'Beschikbaar': '6 identieke wagens, voor een uniforme uitstraling' } },
    { id: 'vip-grijs', name: 'VIP Grijs', short: 'Grijs', img: ['vip-grijs.jpg'], day: 375, wk: 425, lay: { f: 3, m: 1, u: 3 }, pos: 7, dims: '5 × 2,2 × 2,9 m', drain: DRAIN, guests: 'tot ca. 300 gasten' },
    { id: 'event', name: 'Event', short: 'Event', img: ['event.jpg', 'event-2.jpg'], day: 450, wk: 495, lay: { f: 6, m: 3, u: 4 }, pos: 13, dims: '3,6 × 2,5 × 2,9 m', drain: DRAIN, guests: 'tot ca. 600 gasten per wagen', extra: { 'Voorzien van': '4 fonteintjes met spiegel, 2 elektrische handdrogers en zeepautomaat' } },
    { id: 'miva', name: 'MIVA Toilet', short: 'MIVA', img: ['miva.jpg', 'miva-binnen.jpg'], day: null, wk: null, lay: { a: 1 }, pos: 1, dims: '2,4 × 1,65 × 2,9 m', drain: 'Geen afvoer nodig', guests: 'rolstoeltoegankelijk', extra: { 'Toegang': 'Antislip oprijplaat voor rolstoelen', 'Veiligheid': 'Voldoet aan alle eisen anno 2025' } },
    { id: 'plaszuil', name: 'Plaszuil', short: 'Plaszuil', img: ['plaszuil.png'], contain: true, day: 60, wk: null, lay: { u: 4 }, pos: 4, dims: 'Mobiel urinoir', drain: 'Geen aansluiting nodig', guests: 'voorkomt wildplassen', noBase: true, extra: { 'Privacy': 'Hoge scheidingswanden' } }
  ];
  var BY = {}; P.forEach(function (p) { BY[p.id] = p; });
  var SERIES = [
    { id: 'mini', name: 'Mini serie', title: 'Mini', tagline: 'Compact en luxe. Perfect voor tuinfeesten en verjaardagen.', vars: ['mini-grijs', 'mini-hout', 'mini-wit', 'mini-vacuum'], badge: 'Vanaf €225' },
    { id: 'typea', name: 'Type A serie', title: 'Type A', tagline: 'De allrounder: twee damestoiletten, een herentoilet en twee urinoirs.', vars: ['type-a-grey', 'wit-type-a', 'type-a'] },
    { id: 'typeb', name: 'Type B', title: 'Type B Deluxe', tagline: 'Ruim en strak, met zeven toiletplaatsen voor grotere feesten.', vars: ['type-b'] },
    { id: 'vip', name: 'VIP serie', title: 'VIP', tagline: 'Antraciet afgewerkt, ledverlichting, design meubels en waterloze urinoirs.', vars: ['vip-hout', 'vip-grijs'], badge: 'Meest gekozen' },
    { id: 'event', name: 'Grote evenementen', title: 'Event', tagline: 'Dertien toiletplaatsen in één wagen. Gebouwd voor festivals en grote events.', vars: ['event'], badge: 'Tot 1000 gasten' },
    { id: 'miva', name: 'Toegankelijk', title: 'MIVA Toilet', tagline: 'Rolstoeltoegankelijk via een antislip oprijplaat. Geen afvoer nodig.', vars: ['miva'], badge: 'Nieuw 2025' },
    { id: 'plaszuil', name: 'Extra', title: 'Plaszuil', tagline: 'Vier mannen tegelijk. Kortere rijen en geen wildplassen.', vars: ['plaszuil'] }
  ];
  var CITIES = { 'Boxtel': 0, 'Den Bosch': 12, "'s-Hertogenbosch": 12, 'Vught': 9, 'Oisterwijk': 10, 'Sint-Michielsgestel': 8, 'Schijndel': 9, 'Best': 14, 'Eindhoven': 25, 'Tilburg': 22, 'Waalwijk': 25, 'Veghel': 18, 'Uden': 25, 'Oss': 28, 'Helmond': 35, 'Breda': 50, 'Nijmegen': 50, 'Venlo': 70, 'Arnhem': 70, 'Utrecht': 60, 'Roosendaal': 70, 'Bergen op Zoom': 80, 'Dordrecht': 65, 'Rotterdam': 85, 'Den Haag': 105, 'Amsterdam': 100, 'Maastricht': 105, 'Zwolle': 140, 'Groningen': 230, 'Antwerpen': 85, 'Turnhout': 50, 'Hasselt': 85, 'Brussel': 125, 'Gent': 140, 'Leuven': 115, 'Düsseldorf': 110, 'Keulen': 140, 'Aken': 125 };
  var PIN = { 'Den Bosch': 'Den Bosch', "'s-Hertogenbosch": 'Den Bosch', 'Vught': 'Den Bosch', 'Eindhoven': 'Eindhoven', 'Best': 'Eindhoven', 'Helmond': 'Eindhoven', 'Tilburg': 'Tilburg', 'Oisterwijk': 'Tilburg', 'Waalwijk': 'Tilburg', 'Breda': 'Breda', 'Roosendaal': 'Breda', 'Nijmegen': 'Nijmegen', 'Oss': 'Nijmegen', 'Arnhem': 'Nijmegen', 'Utrecht': 'Utrecht', 'Amsterdam': 'Utrecht', 'Rotterdam': 'Rotterdam', 'Den Haag': 'Rotterdam', 'Dordrecht': 'Rotterdam', 'Antwerpen': 'Antwerpen', 'Turnhout': 'Antwerpen', 'Brussel': 'Antwerpen', 'Gent': 'Antwerpen', 'Düsseldorf': 'Düsseldorf', 'Keulen': 'Düsseldorf', 'Venlo': 'Düsseldorf', 'Boxtel': 'Boxtel' };

  /* ================= HELPERS ================= */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var eur = function (n) { return '€' + n.toLocaleString('nl-NL'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var isDesk = function () { return window.matchMedia('(min-width: 1025px)').matches; };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  var tT; function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('is-on'); clearTimeout(tT); tT = setTimeout(function () { t.classList.remove('is-on'); }, 2600); }
  function layHTML(l) {
    var o = [];
    if (l.f) o.push('<span><svg><use href="#i-f"/></svg>' + l.f + ' dames</span>');
    if (l.m) o.push('<span><svg><use href="#i-m"/></svg>' + l.m + ' heren</span>');
    if (l.u) o.push('<span><svg><use href="#i-u"/></svg>' + l.u + ' urinoirs</span>');
    if (l.a) o.push('<span><svg><use href="#i-a"/></svg>rolstoeltoegankelijk</span>');
    return o.join('');
  }
  function layText(l) { var o = []; if (l.f) o.push(l.f + ' dames'); if (l.m) o.push(l.m + ' heren'); if (l.u) o.push(l.u + ' urinoirs'); if (l.a) o.push('rolstoeltoegankelijk'); return o.join(' · '); }

  var lenis = null;
  function scrollToEl(el, off) {
    if (!el) return;
    if (typeof el === 'number') { lenis ? lenis.scrollTo(el, { duration: 1.4 }) : window.scrollTo({ top: el, behavior: 'smooth' }); return; }
    if (lenis) lenis.scrollTo(el, { offset: off || -70, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (off || -70), behavior: 'smooth' });
  }
  function lock(on) { if (lenis) on ? lenis.stop() : lenis.start(); document.documentElement.style.overflow = on ? 'hidden' : ''; }

  /* ================= QUOTE ================= */
  var quote = store('twb2-quote') || {};
  function qInfo() { var n = 0, s = 0, req = false; Object.keys(quote).forEach(function (id) { var p = BY[id]; if (!p) return; n += quote[id]; if (p.day) s += p.day * quote[id]; else req = true; }); return { n: n, s: s, req: req }; }
  function addQ(id, q, silent) {
    quote[id] = (quote[id] || 0) + (q || 1); saveQ();
    if (!silent) toast('✓ ' + BY[id].name + ' staat in uw offertelijst');
    $$('[data-qcount]').forEach(function (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); });
  }
  function saveQ() { store('twb2-quote', quote); renderQ(); }
  function row(id) {
    var p = BY[id];
    return '<div class="qitem"><img src="images/' + p.img[0] + '" alt=""><span>' + esc(p.name) + '<small>' + (p.day ? eur(p.day) + ' per dag' : 'Prijs op aanvraag') + '</small></span><span class="qty"><button type="button" data-q="-1" data-id="' + id + '" aria-label="Minder">−</button><b>' + quote[id] + '</b><button type="button" data-q="1" data-id="' + id + '" aria-label="Meer">+</button></span></div>';
  }
  function renderQ() {
    var i = qInfo(), ids = Object.keys(quote), rows = ids.map(row).join('');
    $$('[data-qcount]').forEach(function (b) { b.textContent = i.n; });
    var body = rows || '<div class="drawer__empty"><p>Uw offertelijst is nog leeg.</p><a class="btn btn--dark" href="#collectie" data-close-drawer><span>Bekijk de collectie</span></a></div>';
    if (ids.length) {
      var xs = ['plaszuil', 'miva'].filter(function (id) { return !quote[id]; });
      if (xs.length) body += '<div class="xsell"><h4>Vaak samen gehuurd</h4>' + xs.map(function (id) { var p = BY[id]; return '<div class="xsell__row"><img src="images/' + p.img[0] + '" alt=""><span>' + p.name + '<small>' + (p.day ? eur(p.day) + ' per dag · ' : '') + p.guests + '</small></span><button type="button" data-xadd="' + id + '">+ Toevoegen</button></div>'; }).join('') + '</div>';
    }
    $('#drawer-body').innerHTML = body;
    $('#drawer-total').textContent = i.n ? eur(i.s) + (i.req ? ' +' : '') : '€0';
    $('#qform-items').innerHTML = rows;
    $$('[data-add]').forEach(function (b) { var on = !!quote[b.dataset.add]; b.classList.toggle('is-added', on); if (b.classList.contains('add')) b.textContent = on ? '✓ In offerte' : '+ Offerte'; else b.textContent = on ? '✓' : '+'; });
  }

  /* ================= COLLECTION ================= */
  var period = 'day';
  function priceHTML(p) {
    if (p.day === null) return '<small>Prijs</small><b class="req">Op aanvraag</b>';
    var v = period === 'wk' && p.wk ? p.wk : p.day;
    var lbl = period === 'wk' && p.wk ? 'Per weekend' : 'Per dag';
    return '<small>' + lbl + '</small><b>' + eur(v) + '</b><em>ex btw</em>';
  }
  function slideHTML(s, i) {
    var p = BY[s.vars[0]];
    return '<article class="slide" data-series="' + s.id + '" data-cur="' + p.id + '">' +
      '<div class="slide__media' + (p.contain ? ' contain' : '') + '" data-cursor="Bekijk">' +
      (s.badge ? '<span class="slide__badge">' + s.badge + '</span>' : '') +
      '<img src="images/' + p.img[0] + '" alt="Toiletwagen ' + esc(p.name) + '" loading="lazy"><button type="button" class="slide__hit" data-qv-cur aria-label="Bekijk foto\'s en details"></button></div>' +
      (s.vars.length > 1 ? '<div class="slide__vars-wrap"></div>' : '') +
      '<div class="slide__body"><span class="slide__n">' + String(i + 1).padStart(2, '0') + '</span><p class="slide__series">' + s.name + '</p><h3 data-f="name">' + esc(p.name) + '</h3><p class="slide__tag">' + s.tagline + '</p>' +
      '<div class="lay" data-f="lay">' + layHTML(p.lay) + '</div>' +
      '<ul class="slide__specs"><li><b>Geschikt</b><span data-f="guests">' + p.guests + '</span></li><li><b>Afmeting</b><span data-f="dims">' + p.dims + '</span></li><li><b>Afvoer</b><span data-f="drain">' + p.drain + '</span></li></ul>' +
      '<div class="slide__foot"><div class="slide__price" data-f="price">' + priceHTML(p) + '</div><div class="slide__btns"><button type="button" class="more" data-qv-cur aria-label="Details">↗</button><button type="button" class="add" data-add="' + p.id + '">+ Offerte</button></div></div></div></article>';
  }
  function renderColl() {
    var t = $('#coll-track');
    t.innerHTML = SERIES.map(slideHTML).join('') +
      '<article class="slide slide--end"><p class="kicker">Twijfelt u?</p><h3>Laat de adviseur het voor u uitrekenen.</h3><p>In tien seconden het juiste model en de juiste prijs.</p><a class="btn btn--dark" href="#adviseur"><span>Naar de adviseur</span><svg><use href="#i-arrow"/></svg></a></article>';
    $$('.slide[data-series]').forEach(function (el) {
      var s = SERIES.filter(function (x) { return x.id === el.dataset.series; })[0];
      if (s.vars.length > 1) {
        var w = document.createElement('div'); w.className = 'slide__vars';
        w.innerHTML = s.vars.map(function (id, k) { return '<button type="button" class="' + (k ? '' : 'is-on') + '" data-var="' + id + '">' + BY[id].short + '</button>'; }).join('');
        $('.slide__media', el).appendChild(w); $('.slide__vars-wrap', el).remove();
      }
    });
    $('#coll-n').textContent = String(SERIES.length).padStart(2, '0');
  }
  function setVar(el, id) {
    var p = BY[id]; el.dataset.cur = id;
    var img = $('.slide__media img', el);
    img.style.opacity = 0;
    setTimeout(function () { img.src = 'images/' + p.img[0]; img.alt = 'Toiletwagen ' + p.name; img.onload = function () { img.style.opacity = 1; }; if (img.complete) img.style.opacity = 1; }, 220);
    $('[data-f=name]', el).textContent = p.name;
    $('[data-f=lay]', el).innerHTML = layHTML(p.lay);
    $('[data-f=guests]', el).textContent = p.guests;
    $('[data-f=dims]', el).textContent = p.dims;
    $('[data-f=drain]', el).textContent = p.drain;
    $('[data-f=price]', el).innerHTML = priceHTML(p);
    var a = $('.add', el); a.dataset.add = id;
    $$('.slide__vars button', el).forEach(function (b) { b.classList.toggle('is-on', b.dataset.var === id); });
    renderQ();
  }
  function updatePrices() { $$('.slide[data-series]').forEach(function (el) { $('[data-f=price]', el).innerHTML = priceHTML(BY[el.dataset.cur]); }); }

  function renderTable() {
    $('#ptable').innerHTML = P.map(function (p) {
      return '<tr data-qv="' + p.id + '" tabindex="0"><td>' + esc(p.name) + (p.tag ? '<span class="tg">' + p.tag + '</span>' : '') + '<small>' + layText(p.lay) + '</small></td><td>' + (p.day ? eur(p.day) : 'Op aanvraag') + '</td><td>' + (p.wk ? eur(p.wk) : (p.day ? '–' : 'Op aanvraag')) + '</td><td><button type="button" class="pa" data-add="' + p.id + '" aria-label="' + esc(p.name) + ' toevoegen aan offerte">+</button></td></tr>';
    }).join('');
  }

  /* ================= MODAL / DRAWER ================= */
  var cur = null, lastF = null;
  function openModal(id) {
    var p = BY[id]; if (!p) return; cur = p; lastF = document.activeElement;
    var im = $('#m-img'); im.src = 'images/' + p.img[0]; im.alt = 'Toiletwagen ' + p.name; im.classList.toggle('contain', !!p.contain);
    $('#m-thumbs').innerHTML = p.img.length > 1 ? p.img.map(function (s, i) { return '<button type="button" class="' + (i ? '' : 'is-on') + '" data-src="' + s + '" aria-label="Foto ' + (i + 1) + '"><img src="images/' + s + '" alt=""></button>'; }).join('') : '';
    $('#m-cat').textContent = p.guests;
    $('#m-title').textContent = p.name;
    $('#m-lay').innerHTML = layHTML(p.lay);
    $('#m-prices').innerHTML = p.day ? '<div><small>Dagprijs</small><b>' + eur(p.day) + '</b></div><div><small>Weekendprijs</small><b>' + (p.wk ? eur(p.wk) : '–') + '</b></div>' : '<div style="grid-column:1/-1"><small>Prijs</small><b>Op aanvraag</b></div>';
    var sp = { 'Afmetingen': p.dims, 'Indeling': layText(p.lay), 'Afvoer': p.drain };
    if (!p.noBase) Object.assign(sp, BASE);
    if (p.extra) Object.assign(sp, p.extra);
    sp['Vervoer'] = (p.km || '€1') + ' per gereden km ex btw';
    $('#m-specs').innerHTML = Object.keys(sp).map(function (k) { return '<dt>' + k + '</dt><dd>' + esc(sp[k]) + '</dd>'; }).join('');
    $('#modal').hidden = false; lock(true); $('#modal .x').focus();
  }
  function closeModal() { $('#modal').hidden = true; lock(false); if (lastF) lastF.focus(); }
  function openDrawer() { lastF = document.activeElement; $('#drawer').hidden = false; lock(true); $('#drawer .x').focus(); }
  function closeDrawer() { $('#drawer').hidden = true; lock(false); }

  /* ================= ADVISOR ================= */
  var advice = [];
  function calc() {
    var g = +$('#c-guests').value, per = +$('input[name=dur]:checked').value;
    var drinks = $('#c-drinks').checked, acc = $('#c-access').checked, lux = $('#c-lux').checked;
    var need = Math.max(2, Math.ceil(g / per * (drinks ? 1.25 : 1)));
    var r = need, L = {};
    function add(id, n) { L[id] = (L[id] || 0) + (n || 1); }
    while (r > 13) { add('event'); r -= 13; }
    if (r > 0) add(r <= 2 ? (lux ? 'mini-hout' : 'mini-grijs') : r <= 5 ? (lux ? 'type-a-grey' : 'type-a') : r <= 7 ? (lux ? 'vip-hout' : 'type-b') : 'event');
    if (g >= 500 && drinks) add('plaszuil', Math.floor(g / 500));
    if (acc) add('miva');
    advice = Object.keys(L).map(function (id) { return [id, L[id]]; });
    var sum = 0, req = false, supply = 0;
    advice.forEach(function (a) { var p = BY[a[0]]; supply += p.pos * a[1]; if (p.day) sum += p.day * a[1]; else req = true; });
    $('#c-guests-out').textContent = g.toLocaleString('nl-NL');
    $('#c-guests').style.setProperty('--p', ((g - 20) / 1980 * 100) + '%');
    $('#r-pos').textContent = need;
    $('#r-price').textContent = eur(sum) + (req ? '+' : '');
    var shown = Math.min(supply, 48), seats = '';
    for (var i = 0; i < shown; i++) seats += '<i class="' + (i < need ? 'on' : '') + '" style="animation-delay:' + (i * 12) + 'ms"></i>';
    $('#r-seats').innerHTML = seats + (supply > 48 ? '<span style="align-self:center;color:var(--t-d);font-size:13px;margin-left:6px">+' + (supply - 48) + '</span>' : '');
    var ratio = need / supply;
    $('#r-meter').style.width = Math.max(10, Math.min(100, ratio * 70)) + '%';
    $('#r-queue').textContent = ratio < .7 ? 'Vrijwel geen' : 'Kort';
    $('#r-list').innerHTML = advice.map(function (a) {
      var p = BY[a[0]];
      return '<li><img src="images/' + p.img[0] + '" alt=""><span><span class="nm">' + a[1] + '× ' + esc(p.name) + '</span><small>' + layText(p.lay) + '</small></span><span class="q">' + (p.day ? eur(p.day * a[1]) : 'op aanvraag') + '</span></li>';
    }).join('');
  }
  function setCalc(o) {
    if (o.guests) $('#c-guests').value = Math.min(2000, Math.max(20, o.guests));
    if (o.dur) { var r = $('input[name=dur][value="' + o.dur + '"]'); if (r) r.checked = true; }
    if (typeof o.drinks === 'boolean') $('#c-drinks').checked = o.drinks;
    if (typeof o.lux === 'boolean') $('#c-lux').checked = o.lux;
    calc();
  }

  /* ================= AREA ================= */
  function area(e) {
    if (e) e.preventDefault();
    var v = $('#a-city').value.trim(), out = $('#area-out');
    $$('.pin').forEach(function (p) { p.classList.remove('is-hit'); });
    if (!v) { out.textContent = 'Typ eerst uw plaatsnaam.'; return; }
    var lv = v.toLowerCase(), keys = Object.keys(CITIES);
    var k = keys.filter(function (c) { return c.toLowerCase() === lv; })[0] || keys.filter(function (c) { return c.toLowerCase().indexOf(lv) === 0; })[0];
    if (k) {
      out.innerHTML = '<b>✓ Wij leveren in ' + esc(k) + '.</b> Ca. ' + CITIES[k] + ' km vanaf ons depot in Boxtel. Vervoer: €1 per gereden km.';
      $$('.pin').forEach(function (p) { if (p.textContent === PIN[k]) p.classList.add('is-hit'); });
    } else out.innerHTML = '<b>✓ Wij leveren in heel NL, BE en DE</b>, dus ook in ' + esc(v) + '. Vraag een offerte aan voor de exacte vervoerskosten.';
  }

  /* ================= SPLIT ================= */
  function splitWords(el) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (t) {
          if (!t) return;
          if (/^\s+$/.test(t)) frag.appendChild(document.createTextNode(' '));
          else { var s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.appendChild(s); }
        });
        n.parentNode.replaceChild(frag, n);
      } else if (n.nodeType === 1) {
        var w = document.createElement('span'); w.className = 'w'; n.parentNode.replaceChild(w, n); w.appendChild(n);
      }
    });
  }

  /* ================= INIT ================= */
  function init() {
    renderColl(); renderTable(); renderQ(); calc();
    $('#cities').innerHTML = Object.keys(CITIES).map(function (c) { return '<option value="' + esc(c) + '">'; }).join('');
    var t = new Date(); t.setDate(t.getDate() + 1); var min = t.toISOString().slice(0, 10);
    $('#b-date').min = min; $('#q-date').min = min;
    $$('.split-lines .ln').forEach(splitWords);
    splitWords($('#statement'));

    // Header + mobile bar
    var hdr = $('#hdr'), mbar = $('.mbar'), lastY = 0;
    function onScroll() {
      var y = window.scrollY;
      hdr.classList.toggle('is-stuck', y > 30);
      hdr.classList.toggle('is-hidden', y > 600 && y > lastY + 4 && $('#menu').hidden);
      if (y < lastY - 4) hdr.classList.remove('is-hidden');
      mbar.classList.toggle('is-on', y > window.innerHeight * .6);
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // Burger
    var burger = $('.burger'), menu = $('#menu');
    function setMenu(open) { burger.setAttribute('aria-expanded', open); menu.hidden = !open; lock(open); }
    burger.addEventListener('click', function () { setMenu(menu.hidden); });
    $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

    // Active nav
    if ('IntersectionObserver' in window) {
      var links = $$('.hdr__nav a');
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
      links.forEach(function (l) { var s = $(l.getAttribute('href')); if (s) io.observe(s); });
    }

    // Hero slideshow
    var hImgs = $$('#hero-arch img'), hDots = $$('#hero-dots i'), hi = 0;
    setInterval(function () {
      if (document.hidden) return;
      hImgs[hi].classList.remove('is-on'); hDots[hi].classList.remove('is-on');
      hi = (hi + 1) % hImgs.length;
      hImgs[hi].classList.add('is-on'); hDots[hi].classList.add('is-on');
      $('#hero-cap').textContent = hImgs[hi].dataset.cap;
      $('#hero-price').textContent = '€' + hImgs[hi].dataset.price + ' per dag';
    }, 4200);

    // Global clicks
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (a && a.getAttribute('href').length > 1) {
        var tg = $(a.getAttribute('href'));
        if (tg) { e.preventDefault(); if (a.hasAttribute('data-close-drawer')) closeDrawer(); if (a.dataset.gotoSeries) gotoSeries(a.dataset.gotoSeries); else scrollToEl(tg); return; }
      }
      var q = e.target.closest('[data-q]'); if (q) { var id = q.dataset.id, n = (quote[id] || 0) + +q.dataset.q; if (n <= 0) delete quote[id]; else quote[id] = n; saveQ(); return; }
      var v = e.target.closest('[data-var]'); if (v) { e.stopPropagation(); setVar(v.closest('.slide'), v.dataset.var); return; }
      var ad = e.target.closest('[data-add]'); if (ad) { e.stopPropagation(); addQ(ad.dataset.add); return; }
      var xa = e.target.closest('[data-xadd]'); if (xa) { addQ(xa.dataset.xadd); return; }
      var qc = e.target.closest('[data-qv-cur]'); if (qc) { openModal(qc.closest('.slide').dataset.cur); return; }
      var qv = e.target.closest('[data-qv]'); if (qv) { openModal(qv.dataset.qv); return; }
      var th = e.target.closest('#m-thumbs button'); if (th) { $('#m-img').src = 'images/' + th.dataset.src; $$('#m-thumbs button').forEach(function (b) { b.classList.toggle('is-on', b === th); }); return; }
      if (e.target.closest('[data-close]')) { closeModal(); return; }
      if (e.target.closest('[data-open-quote]')) { openDrawer(); return; }
      if (e.target.closest('[data-close-drawer]')) closeDrawer();
    });
    $('#ptable').addEventListener('keydown', function (e) { var r = e.target.closest('tr[data-qv]'); if (r && e.target === r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openModal(r.dataset.qv); } });
    $('#m-add').addEventListener('click', function () { if (cur) { addQ(cur.id); closeModal(); } });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!$('#modal').hidden) closeModal(); else if (!$('#drawer').hidden) closeDrawer(); else if (!$('#menu').hidden) setMenu(false);
      var pp = $('.note-pop'); if (pp) pp.remove();
    });
    $$('.toggle button').forEach(function (b) { b.addEventListener('click', function () { period = b.dataset.period; $$('.toggle button').forEach(function (x) { x.classList.toggle('is-on', x === b); }); updatePrices(); }); });

    // Advisor
    ['#c-guests', '#c-drinks', '#c-access', '#c-lux'].forEach(function (s) { $(s).addEventListener('input', calc); });
    $$('input[name=dur]').forEach(function (r) { r.addEventListener('change', calc); });
    $('#r-add').addEventListener('click', function () { advice.forEach(function (a) { addQ(a[0], a[1], true); }); $('#q-guests').value = $('#c-guests').value; toast('✓ Advies toegevoegd aan uw offerte'); openDrawer(); });

    // Booking
    $('#booking').addEventListener('submit', function (e) {
      e.preventDefault();
      var g = +$('#b-guests').value, d = $('#b-date').value, pl = $('#b-place').value.trim(), ty = $('#b-type').value;
      if (g) { setCalc({ guests: g }); $('#q-guests').value = g; }
      if (d) $('#q-date').value = d;
      if (pl) { $('#q-place').value = pl; $('#a-city').value = pl; area(); }
      if (!$('#q-msg').value) $('#q-msg').value = 'Soort evenement: ' + ty;
      scrollToEl($('#adviseur'));
      toast(g ? 'Ons advies voor ' + g + ' gasten staat klaar' : 'Vul uw aantal gasten in voor direct advies');
    });

    // Occasions
    $$('[data-occ]').forEach(function (b) {
      b.addEventListener('click', function () { var o = JSON.parse(b.dataset.occ); setCalc(o); $('#q-guests').value = o.guests; $('#q-msg').value = 'Soort evenement: ' + o.type; scrollToEl($('#adviseur')); toast('Advies ingevuld voor: ' + o.type); });
    });
    var fl = $('#occ-float'), flImg = $('img', fl);
    $$('#occ-list button').forEach(function (b) {
      b.addEventListener('mouseenter', function () { flImg.src = b.dataset.img; fl.classList.add('is-on'); document.body.classList.add('occ-hover'); });
      b.addEventListener('mouseleave', function () { fl.classList.remove('is-on'); });
    });
    var fx = 0, fy = 0, tx = 0, ty2 = 0;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty2 = e.clientY; }, { passive: true });
    (function loop() { fx += (tx - fx) * .12; fy += (ty2 - fy) * .12; fl.style.transform = 'translate(' + (fx - 150) + 'px,' + (fy - 190) + 'px)' + (fl.classList.contains('is-on') ? ' scale(1)' : ' scale(.6)'); requestAnimationFrame(loop); })();

    // Reviews
    var rq = $$('.rev__q'), rd = $$('#rev-dots i'), ri = 0, rT;
    function rev(n) { rq[ri].classList.remove('is-on'); rd[ri].classList.remove('is-on'); ri = (n + rq.length) % rq.length; rq[ri].classList.add('is-on'); rd[ri].classList.add('is-on'); }
    $$('[data-rev]').forEach(function (b) { b.addEventListener('click', function () { rev(ri + +b.dataset.rev); clearInterval(rT); }); });
    rT = setInterval(function () { if (!document.hidden) rev(ri + 1); }, 6500);

    // Luxe sticky images
    var lImgs = $$('#lux-frame img');
    if ('IntersectionObserver' in window) {
      var lio = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) return;
          var i = +en.target.dataset.i;
          $$('.lux__item').forEach(function (x) { x.classList.toggle('is-on', x === en.target); });
          lImgs.forEach(function (im, k) { im.classList.toggle('was', im.classList.contains('is-on') && k !== i); im.classList.toggle('is-on', k === i); });
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      $$('.lux__item').forEach(function (it) { lio.observe(it); });
    }
    $('.lux__item').classList.add('is-on');

    // Area + forms
    $('#area-check').addEventListener('submit', area);
    $('#qform').addEventListener('submit', function (e) {
      e.preventDefault(); var ok = true;
      $$('[required]', this).forEach(function (i) { var bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.closest('.f').classList.toggle('is-err', bad); if (bad && ok) { i.focus(); ok = false; } });
      if (!ok) { toast('Vul de verplichte velden in'); return; }
      $('.qform__done', this).hidden = false; quote = {}; saveQ();
    });
    $$('#qform [required]').forEach(function (i) { i.addEventListener('input', function () { i.closest('.f').classList.remove('is-err'); }); });

    cursor(); magnetic(); motion();
  }

  /* ================= SERIES JUMP ================= */
  var hsST = null;
  function gotoSeries(id) {
    var el = $('.slide[data-series="' + id + '"]'); if (!el) return;
    if (hsST && isDesk()) {
      var track = $('#coll-track'), max = track.scrollWidth - window.innerWidth;
      var x = Math.min(max, Math.max(0, el.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft)));
      scrollToEl(hsST.start + (x / max) * (hsST.end - hsST.start));
    } else {
      scrollToEl($('#collectie'));
      var tr = $('#coll-track'); setTimeout(function () { tr.scrollTo({ left: el.offsetLeft - 16, behavior: 'smooth' }); }, 500);
    }
  }

  /* ================= CURSOR & MAGNETIC ================= */
  function cursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reduce) return;
    document.documentElement.classList.add('has-cursor');
    var c = $('.cursor'), d = $('.cursor__dot'), r = $('.cursor__ring'), lab = $('.cursor__ring span');
    var x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    window.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; d.style.transform = 'translate(' + x + 'px,' + y + 'px)'; }, { passive: true });
    (function loop() { rx += (x - rx) * .16; ry += (y - ry) * .16; r.style.transform = 'translate(' + rx + 'px,' + ry + 'px)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', function (e) {
      var l = e.target.closest('[data-cursor]');
      if (l) { lab.textContent = l.dataset.cursor; c.classList.add('is-label'); c.classList.remove('is-hover'); return; }
      c.classList.remove('is-label');
      c.classList.toggle('is-hover', !!e.target.closest('a, button, input, select, textarea, label, summary, tr[data-qv]'));
    });
  }
  function magnetic() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reduce) return;
    $$('.magnetic').forEach(function (b) {
      b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .22 + 'px,' + (e.clientY - r.top - r.height / 2) * .3 + 'px)'; });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* ================= MOTION ================= */
  function motion() {
    var gsap = window.gsap, ST = window.ScrollTrigger, loader = $('#loader');
    if (!gsap || !ST || reduce) {
      document.documentElement.classList.add('no-anim'); loader.classList.add('is-gone');
      $$('.statement__text .w').forEach(function (w) { w.style.opacity = 1; });
      return;
    }
    gsap.registerPlugin(ST);
    if (window.Lenis) {
      lenis = new window.Lenis({ lerp: .1, smoothWheel: true });
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // Hero intro (after loader)
    gsap.set('.hero__title .w', { yPercent: 115 });
    gsap.set('.pill, .hero__sub, .hero__ctas, .hero__trust, .book, .book__note', { opacity: 0, y: 30 });
    gsap.set('.arch', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 32px 32px)' });
    gsap.set('.seal', { scale: 0, rotate: -90 });
    gsap.set('.hdr__in', { opacity: 0, y: -20 });
    var seen = false; try { seen = sessionStorage.getItem('twb2-seen') === '1'; sessionStorage.setItem('twb2-seen', '1'); } catch (e) {}
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    if (!seen) {
      if (lenis) lenis.stop();
      tl.from('.loader__crown', { y: 30, opacity: 0, scale: .8, duration: .9 })
        .from('.loader__word', { opacity: 0, y: 12, duration: .7 }, '-=.6')
        .to('.loader__bar i', { scaleX: 1, duration: .9, ease: 'power2.inOut' }, '-=.4')
        .to('.loader__in', { opacity: 0, y: -20, duration: .5, ease: 'power2.in' })
        .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut', onComplete: function () { loader.classList.add('is-gone'); if (lenis) lenis.start(); } }, '-=.1');
    } else { loader.classList.add('is-gone'); }
    tl.to('.hdr__in', { opacity: 1, y: 0, duration: 1 }, seen ? 0 : '-=.5')
      .to('.hero__title .w', { yPercent: 0, duration: 1.4, stagger: .06 }, '<')
      .to('.arch', { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 32px 32px)', duration: 1.6, ease: 'expo.inOut' }, '<.1')
      .to('.pill, .hero__sub, .hero__ctas, .hero__trust', { opacity: 1, y: 0, duration: 1.1, stagger: .08 }, '<.4')
      .to('.seal', { scale: 1, rotate: 0, duration: 1.2, ease: 'back.out(1.5)' }, '<.2')
      .to('.book, .book__note', { opacity: 1, y: 0, duration: 1.1, stagger: .1 }, '<.1');

    // Hero parallax
    gsap.to('.arch', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__copy', { yPercent: -10, opacity: .3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Band skew on velocity
    var skew = gsap.quickTo('.band__track', 'skewX', { duration: .5, ease: 'power3' });
    ST.create({ onUpdate: function (s) { skew(gsap.utils.clamp(-12, 12, s.getVelocity() / -250)); } });

    // Statement words
    gsap.to('.statement__text .w', { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.statement__text', start: 'top 80%', end: 'bottom 45%', scrub: true } });

    // Counters
    $$('[data-count]').forEach(function (el) {
      var end = +el.dataset.count, o = { v: 0 };
      el.textContent = '0';
      gsap.to(o, { v: end, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });

    // Generic reveals
    $$('.h2, .lead, .sec-head__aside, .kicker').forEach(function (el) {
      if (el.closest('.hero') || el.closest('.coll__head')) return;
      gsap.from(el, { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    gsap.from('.adv__ctrl, .adv__out', { y: 80, opacity: 0, duration: 1.3, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.adv__grid', start: 'top 85%', once: true } });
    gsap.from('.occ__list li', { y: 50, opacity: 0, duration: 1, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: '.occ__list', start: 'top 85%', once: true } });
    gsap.from('.ptable tbody tr', { x: 40, opacity: 0, duration: .9, stagger: .04, ease: 'expo.out', scrollTrigger: { trigger: '.ptable', start: 'top 80%', once: true } });
    gsap.from('.proc__steps li', { y: 60, opacity: 0, duration: 1.1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.proc__steps', start: 'top 85%', once: true } });
    gsap.to('#proc-line', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.proc__line', start: 'top 85%', end: 'top 40%', scrub: true } });
    gsap.from('.pin:not(.pin--home)', { opacity: 0, duration: .6, stagger: .07, scrollTrigger: { trigger: '.area__map', start: 'top 80%', once: true } });
    gsap.from('.final__title .w', { yPercent: 115, duration: 1.3, stagger: .05, ease: 'expo.out', scrollTrigger: { trigger: '.final__title', start: 'top 85%', once: true } });
    gsap.from('.qform, .final__person', { y: 60, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.final__grid', start: 'top 85%', once: true } });
    gsap.from('.ftr__word', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.ftr__word', start: 'top 95%', once: true } });
    gsap.fromTo('.lux__frame', { clipPath: 'inset(12% 12% 12% 12% round 999px 999px 32px 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 32px 32px)', ease: 'none', scrollTrigger: { trigger: '.lux', start: 'top 85%', end: 'top 20%', scrub: true } });

    // Horizontal collection (desktop)
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1025px)', function () {
      var track = $('#coll-track');
      var dist = function () { return track.scrollWidth - window.innerWidth; };
      var tw = gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: {
        trigger: '.coll', pin: '.coll__pin', start: 'top top', end: function () { return '+=' + dist(); }, scrub: 1, invalidateOnRefresh: true,
        onUpdate: function (s) {
          $('#coll-bar').style.transform = 'scaleX(' + s.progress + ')';
          var n = Math.min(SERIES.length, Math.floor(s.progress * (SERIES.length + .6)) + 1);
          $('#coll-i').textContent = String(n).padStart(2, '0');
        }
      } });
      hsST = tw.scrollTrigger;
      $$('.slide__media img').forEach(function (im) {
        gsap.fromTo(im, { xPercent: -6, scale: 1.12 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: im.closest('.slide'), containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
      });
      return function () { hsST = null; };
    });
    mm.add('(max-width: 1024px)', function () {
      var tr = $('#coll-track');
      var h = function () { var max = tr.scrollWidth - tr.clientWidth; var p = max > 0 ? tr.scrollLeft / max : 0; $('#coll-bar').style.transform = 'scaleX(' + p + ')'; $('#coll-i').textContent = String(Math.min(SERIES.length, Math.round(p * (SERIES.length - 1)) + 1)).padStart(2, '0'); };
      tr.addEventListener('scroll', h, { passive: true });
      return function () { tr.removeEventListener('scroll', h); };
    });

    window.addEventListener('load', function () { ST.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
  }

  /* ================= DESIGN NOTES ================= */
  function notes() {
    var btn = $('#notes-toggle'), on = false, N = window.NOTES || [];
    function close() { var p = $('.note-pop'); if (p) p.remove(); }
    function show(n, i) {
      close();
      var d = document.createElement('div'); d.className = 'note-pop'; d.setAttribute('role', 'dialog'); d.setAttribute('data-lenis-prevent', '');
      d.innerHTML = '<button class="xx" type="button" aria-label="Sluiten">×</button><span class="k">Design note ' + (i + 1) + ' / ' + N.length + '</span><h4>' + n.title + '</h4><p>' + n.why + '</p>' + (n.cro ? '<ul>' + n.cro.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>' : '');
      document.body.appendChild(d); $('.xx', d).addEventListener('click', close); $('.xx', d).focus();
    }
    function toggle(f) {
      on = typeof f === 'boolean' ? f : !on; btn.setAttribute('aria-pressed', on);
      $$('.note-pin').forEach(function (p) { p.remove(); }); close();
      if (!on) return;
      N.forEach(function (n, i) {
        var host = $('[data-note="' + n.key + '"]'); if (!host) return;
        var pin = document.createElement('button'); pin.type = 'button'; pin.className = 'note-pin';
        pin.innerHTML = '<b>' + (i + 1) + '</b>' + n.title;
        pin.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); show(n, i); });
        host.appendChild(pin);
      });
    }
    btn.addEventListener('click', function () { toggle(); });
    if (/[?&]notes=1/.test(location.search)) toggle(true);
  }

  function boot() { init(); notes(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
