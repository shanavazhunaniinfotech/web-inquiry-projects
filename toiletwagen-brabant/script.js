/* Toiletwagen Brabant — home page prototype */
(function () {
  'use strict';

  /* ---------- Data (from the live WooCommerce store) ---------- */
  var BASE_SPECS = {
    'Stroom': '220V',
    'Voorzien van': '2 fonteintjes met spiegel, 2 elektrische handdrogers en zeepautomaat',
    'Geleverd met': 'Wc-papier, zonder meerprijs'
  };
  var MINI = { dims: '2,4 × 1,65 × 2,9 m', layout: ['1 dames', '1 heren', '2 wasbakken'], pos: 2, afvoer: '5 meter (Ø110 mm), septictank bij te leveren' };
  var A = { dims: '3,6 × 2,2 × 2,9 m', layout: ['2 dames', '1 heren', '2 urinoirs'], pos: 5, afvoer: '5 meter (Ø110 mm), septictank bij te leveren' };
  var B = { dims: '5 × 2,2 × 2,9 m', layout: ['3 dames', '1 heren', '3 urinoirs'], pos: 7, afvoer: '5 meter (Ø110 mm), septictank bij te leveren' };

  var PRODUCTS = [
    { id: 'mini-grijs', name: 'Mini Grijs', cat: 'Mini', tags: ['mini'], badge: ['Laagste prijs', 'ok'], imgs: ['mini-grijs.jpg'], day: 225, wk: 270, base: MINI, guests: 'tot ca. 80 gasten' },
    { id: 'mini-hout', name: 'Mini Hout', cat: 'Mini', tags: ['mini'], imgs: ['mini-hout.jpg'], day: 250, wk: 290, base: MINI, guests: 'tot ca. 80 gasten' },
    { id: 'mini-wit', name: 'Mini Wit met vermalers', cat: 'Mini', tags: ['mini'], imgs: ['mini-wit.jpg', 'interieur-wasbak.jpg'], day: 260, wk: 295, base: MINI, guests: 'tot ca. 80 gasten' },
    { id: 'mini-vacuum', name: 'Mini Vacuümtoilet', cat: 'Mini', tags: ['mini'], badge: ['Geen afvoer nodig'], imgs: ['mini-vacuum.jpg'], day: null, wk: null, base: Object.assign({}, MINI, { afvoer: 'Geen afvoer nodig, alles compleet' }), guests: 'tot ca. 80 gasten' },
    { id: 'type-a', name: 'Type A', cat: 'Standaard', tags: ['standaard'], imgs: ['type-a.jpg'], day: 275, wk: 305, base: A, km: '€0,90', guests: 'tot ca. 200 gasten' },
    { id: 'wit-type-a', name: 'Wit Type A', cat: 'Standaard', tags: ['standaard'], badge: ['Nieuw'], imgs: ['wit-type-a.jpg'], day: 300, wk: 325, base: A, guests: 'tot ca. 200 gasten' },
    { id: 'type-a-grey', name: 'Type A Grey Edition', cat: 'Standaard', tags: ['standaard'], imgs: ['type-a-grey.jpg'], day: 325, wk: 375, base: Object.assign({}, A, { dims: '3,6 × 2,5 × 2,9 m' }), guests: 'tot ca. 200 gasten' },
    { id: 'type-b', name: 'Type B Deluxe', cat: 'Standaard', tags: ['standaard', 'groot'], imgs: ['type-b-deluxe.jpg'], day: 350, wk: 385, base: B, guests: 'tot ca. 300 gasten' },
    { id: 'vip-grijs', name: 'VIP Grijs', cat: 'Luxe & VIP', tags: ['vip', 'groot'], imgs: ['vip-grijs.jpg'], day: 375, wk: 425, base: B, guests: 'tot ca. 300 gasten' },
    { id: 'vip-hout', name: 'VIP Hout', cat: 'Luxe & VIP', tags: ['vip', 'groot'], badge: ['Meest gekozen', 'gold'], imgs: ['vip-hout.jpg', 'vip-hout-2.jpg', 'vip-hout-3.jpg'], day: 395, wk: 445, base: B, guests: 'tot ca. 300 gasten', extra: { 'Beschikbaar': '6 identieke wagens: ideaal voor een uniforme uitstraling op grote events' } },
    { id: 'event', name: 'Event', cat: 'Grote evenementen', tags: ['groot'], badge: ['Tot 1000 gasten'], imgs: ['event.jpg', 'event-2.jpg'], day: 450, wk: 495, base: { dims: '3,6 × 2,5 × 2,9 m', layout: ['6 dames', '3 heren', '4 urinoirs'], pos: 13, afvoer: '5 meter (Ø110 mm), septictank bij te leveren' }, guests: 'tot ca. 600 gasten', extra: { 'Voorzien van': '4 fonteintjes met spiegel, 2 elektrische handdrogers en zeepautomaat' } },
    { id: 'miva', name: 'MIVA Toilet', cat: 'Mindervalide', tags: ['toegankelijk'], badge: ['Nieuw 2025', 'gold'], imgs: ['miva.jpg', 'miva-binnen.jpg'], day: null, wk: null, base: { dims: '2,4 × 1,65 × 2,9 m', layout: ['Rolstoeltoegankelijk', 'Antislip oprijplaat'], pos: 1, afvoer: 'Geen afvoer nodig' }, guests: 'toegankelijk toilet', extra: { 'Veiligheid': 'Voldoet aan alle veiligheidseisen anno 2025' } },
    { id: 'plaszuil', name: 'Plaszuil', cat: 'Grote evenementen', tags: ['groot'], imgs: ['plaszuil.png'], contain: true, day: 60, wk: null, base: { dims: 'Mobiel urinoir', layout: ['4 mannen tegelijk', 'Hoge scheidingswanden'], pos: 4, afvoer: 'Geen aansluiting nodig' }, guests: 'voorkomt wildplassen', noBase: true }
  ];
  var BY_ID = {};
  PRODUCTS.forEach(function (p) { BY_ID[p.id] = p; });

  var CITIES = { 'Boxtel': 0, 'Den Bosch': 12, "'s-Hertogenbosch": 12, 'Vught': 9, 'Oisterwijk': 10, 'Sint-Michielsgestel': 8, 'Schijndel': 9, 'Best': 14, 'Eindhoven': 25, 'Tilburg': 22, 'Waalwijk': 25, 'Veghel': 18, 'Uden': 25, 'Oss': 28, 'Helmond': 35, 'Breda': 50, 'Nijmegen': 50, 'Venlo': 70, 'Arnhem': 70, 'Utrecht': 60, 'Roosendaal': 70, 'Bergen op Zoom': 80, 'Dordrecht': 65, 'Rotterdam': 85, 'Den Haag': 105, 'Amsterdam': 100, 'Maastricht': 105, 'Zwolle': 140, 'Groningen': 230, 'Antwerpen': 85, 'Turnhout': 50, 'Hasselt': 85, 'Brussel': 125, 'Gent': 140, 'Leuven': 115, 'Düsseldorf': 110, 'Keulen': 140, 'Aken': 125 };
  var PIN_MAP = { 'Den Bosch': 'Den Bosch', "'s-Hertogenbosch": 'Den Bosch', 'Vught': 'Den Bosch', 'Eindhoven': 'Eindhoven', 'Best': 'Eindhoven', 'Helmond': 'Eindhoven', 'Tilburg': 'Tilburg', 'Oisterwijk': 'Tilburg', 'Waalwijk': 'Tilburg', 'Breda': 'Breda', 'Roosendaal': 'Breda', 'Nijmegen': 'Nijmegen', 'Oss': 'Nijmegen', 'Arnhem': 'Nijmegen', 'Utrecht': 'Utrecht', 'Amsterdam': 'Utrecht', 'Rotterdam': 'Rotterdam', 'Den Haag': 'Rotterdam', 'Dordrecht': 'Rotterdam', 'Antwerpen': 'Antwerpen', 'Turnhout': 'Antwerpen', 'Brussel': 'Antwerpen', 'Gent': 'Antwerpen', 'Düsseldorf': 'Düsseldorf', 'Keulen': 'Düsseldorf', 'Venlo': 'Düsseldorf' };

  /* ---------- Helpers ---------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var eur = function (n) { return '€' + n.toLocaleString('nl-NL'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }
  var toastT;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('is-on'); }, 2600);
  }
  function smoothTo(sel) {
    var el = typeof sel === 'string' ? $(sel) : sel;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Quote list ---------- */
  var quote = store('twb-quote') || {};
  function qTotal() {
    var n = 0, sum = 0, onReq = false;
    Object.keys(quote).forEach(function (id) {
      var p = BY_ID[id]; if (!p) return;
      n += quote[id];
      if (p.day) sum += p.day * quote[id]; else onReq = true;
    });
    return { n: n, sum: sum, onReq: onReq };
  }
  function addQuote(id, qty, silent) {
    quote[id] = (quote[id] || 0) + (qty || 1);
    saveQuote();
    if (!silent) toast('✓ ' + BY_ID[id].name + ' staat in uw offertelijst');
    $$('[data-qcount]').forEach(function (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); });
  }
  function setQty(id, q) {
    if (q <= 0) delete quote[id]; else quote[id] = q;
    saveQuote();
  }
  function saveQuote() { store('twb-quote', quote); renderQuote(); }
  function itemRow(id) {
    var p = BY_ID[id];
    return '<div class="qitem"><img src="images/' + p.imgs[0] + '" alt=""><span>' + esc(p.name) + '<br><small style="color:var(--muted);font-weight:500">' + (p.day ? eur(p.day) + ' /dag' : 'Prijs op aanvraag') + '</small></span>' +
      '<span class="qty"><button type="button" data-q="-1" data-id="' + id + '" aria-label="Minder">−</button><b>' + quote[id] + '</b><button type="button" data-q="1" data-id="' + id + '" aria-label="Meer">+</button></span></div>';
  }
  function renderQuote() {
    var t = qTotal(), ids = Object.keys(quote);
    $$('[data-qcount]').forEach(function (b) { b.textContent = t.n; });
    var rows = ids.map(itemRow).join('');
    $('#drawer-body').innerHTML = rows || '<div class="drawer__empty"><p>Uw offertelijst is nog leeg.</p><a class="btn btn--dark" href="#assortiment" data-close-drawer>Bekijk het assortiment</a></div>';
    if (ids.length) {
      var xs = ['plaszuil', 'miva'].filter(function (id) { return !quote[id]; });
      if (xs.length) $('#drawer-body').insertAdjacentHTML('beforeend', '<div class="xsell"><h4>Vaak samen gehuurd</h4>' + xs.map(function (id) {
        var p = BY_ID[id];
        return '<div class="xsell__row"><img src="images/' + p.imgs[0] + '" alt=""><span>' + p.name + '<small>' + (p.day ? eur(p.day) + ' /dag · ' : '') + p.guests + '</small></span><button type="button" data-xadd="' + id + '">+ Toevoegen</button></div>';
      }).join('') + '</div>');
    }
    $('#drawer-total').textContent = t.n ? eur(t.sum) + (t.onReq ? ' +' : '') : '€0';
    $('#qform-items').innerHTML = rows;
    $$('.card__add').forEach(function (b) {
      var on = !!quote[b.dataset.id];
      b.classList.toggle('is-added', on);
      b.innerHTML = on ? '✓ In offerte' : '+ Offerte';
    });
  }
  document.addEventListener('click', function (e) {
    var q = e.target.closest('[data-q]');
    if (q) { var id = q.dataset.id; setQty(id, (quote[id] || 0) + Number(q.dataset.q)); }
  });

  /* ---------- Products ---------- */
  var period = 'day';
  function priceHTML(p) {
    var v = period === 'day' ? p.day : (p.wk || null);
    if (p.day === null) return '<small>Prijs</small><strong style="font-size:24px">Op aanvraag</strong>';
    if (v === null) return '<small>Per dag</small><strong>' + eur(p.day) + '</strong> <em>ex btw</em>';
    return '<small>' + (period === 'day' ? 'Per dag' : 'Per weekend') + '</small><strong>' + eur(v) + '</strong> <em>ex btw</em>';
  }
  function renderProducts() {
    $('#products').innerHTML = PRODUCTS.map(function (p) {
      var b = p.badge ? '<span class="badge' + (p.badge[1] ? ' badge--' + p.badge[1] : '') + '">' + p.badge[0] + '</span>' : '';
      var wide = p.id === 'plaszuil';
      return '<article class="card reveal' + (wide ? ' card--wide' : '') + '" data-tags="' + p.tags.join(' ') + '">' + b +
        '<button type="button" class="card__media' + (p.contain ? ' contain' : '') + '" data-qv="' + p.id + '" aria-label="Bekijk details van ' + esc(p.name) + '"><img src="images/' + p.imgs[0] + '" alt="Toiletwagen ' + esc(p.name) + '" loading="lazy"><span class="card__qv">Snel bekijken</span></button>' +
        '<div class="card__body"><span class="card__cat">' + p.cat + ' · ' + p.guests + '</span><h3>' + esc(p.name) + '</h3>' +
        (wide ? '<p class="card__upsell">Handig extraatje bij grotere feesten en festivals: één plaszuil verwerkt 4 mannen tegelijk, verkort de rijen bij de toiletwagens en voorkomt wildplassen.</p>' : '') +
        '<ul class="card__layout">' + p.base.layout.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul>' +
        '<div class="card__foot"><div class="card__price" data-price="' + p.id + '">' + priceHTML(p) + '</div>' +
        '<button type="button" class="card__add" data-id="' + p.id + '">+ Offerte</button></div></div></article>';
    }).join('');
    $('#ptable').innerHTML = PRODUCTS.map(function (p) {
      var b = p.badge && p.badge[1] === 'gold' ? '<span class="badge badge--gold">' + p.badge[0] + '</span>' : '';
      return '<tr data-qv="' + p.id + '" tabindex="0"><td>' + esc(p.name) + b + '<small>' + p.base.layout.join(' · ') + '</small></td><td>' + (p.day ? eur(p.day) : 'Op aanvraag') + '</td><td>' + (p.wk ? eur(p.wk) : (p.day ? '–' : 'Op aanvraag')) + '</td></tr>';
    }).join('');
  }
  function updatePrices() {
    PRODUCTS.forEach(function (p) { var el = $('[data-price="' + p.id + '"]'); if (el) el.innerHTML = priceHTML(p); });
  }
  function applyFilter(f) {
    $$('.chip').forEach(function (c) { c.classList.toggle('is-on', c.dataset.filter === f); });
    $$('#products .card').forEach(function (c) {
      var show = f === 'all' || c.dataset.tags.split(' ').indexOf(f) > -1;
      c.classList.toggle('is-hidden', !show);
      if (show) { c.style.opacity = 1; c.style.transform = 'none'; }
    });
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  /* ---------- Modal ---------- */
  var current = null, lastFocus = null;
  function openModal(id) {
    var p = BY_ID[id]; if (!p) return; current = p; lastFocus = document.activeElement;
    var m = $('#modal');
    var img = $('#m-img'); img.src = 'images/' + p.imgs[0]; img.alt = 'Toiletwagen ' + p.name; img.classList.toggle('contain', !!p.contain);
    $('#m-thumbs').innerHTML = p.imgs.length > 1 ? p.imgs.map(function (s, i) { return '<button type="button" class="' + (i ? '' : 'is-on') + '" data-src="' + s + '" aria-label="Foto ' + (i + 1) + '"><img src="images/' + s + '" alt=""></button>'; }).join('') : '';
    var b = $('#m-badge'); b.textContent = p.cat; b.className = 'badge' + (p.badge && p.badge[1] ? ' badge--' + p.badge[1] : '');
    $('#m-title').textContent = p.name;
    $('#m-layout').textContent = p.base.layout.join(' · ') + ' — ' + p.guests;
    $('#m-prices').innerHTML = p.day ? '<div><small>Dagprijs</small><strong>' + eur(p.day) + '</strong></div><div><small>Weekendprijs</small><strong>' + (p.wk ? eur(p.wk) : '–') + '</strong></div>' : '<div style="grid-column:1/-1"><small>Prijs</small><strong>Op aanvraag</strong></div>';
    var specs = { 'Afmetingen (L×B×H)': p.base.dims, 'Indeling': p.base.layout.join(', '), 'Afvoer': p.base.afvoer };
    if (!p.noBase) Object.assign(specs, BASE_SPECS);
    if (p.extra) Object.assign(specs, p.extra);
    specs['Vervoer'] = (p.km || '€1') + ' per gereden km ex btw';
    $('#m-specs').innerHTML = Object.keys(specs).map(function (k) { return '<dt>' + k + '</dt><dd>' + esc(specs[k]) + '</dd>'; }).join('');
    m.hidden = false; document.body.style.overflow = 'hidden';
    $('.modal__x', m).focus();
  }
  function closeModal() { $('#modal').hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  function openDrawer() { lastFocus = document.activeElement; $('#drawer').hidden = false; document.body.style.overflow = 'hidden'; $('#drawer .modal__x').focus(); }
  function closeDrawer() { $('#drawer').hidden = true; document.body.style.overflow = ''; }

  /* ---------- Advisor ---------- */
  var advice = [];
  function calc() {
    var g = Number($('#c-guests').value);
    var per = Number($('input[name=dur]:checked').value);
    var drinks = $('#c-drinks').checked, access = $('#c-access').checked;
    var pos = Math.max(2, Math.ceil(g / per * (drinks ? 1.25 : 1)));
    var r = pos, list = {};
    function add(id, n) { list[id] = (list[id] || 0) + (n || 1); }
    while (r > 13) { add('event'); r -= 13; }
    if (r > 0) add(r <= 2 ? 'mini-grijs' : r <= 5 ? 'type-a-grey' : r <= 7 ? 'vip-hout' : 'event');
    if (g >= 500 && drinks) add('plaszuil', Math.floor(g / 500));
    if (access) add('miva');
    advice = Object.keys(list).map(function (id) { return [id, list[id]]; });
    var sum = 0, onReq = false;
    advice.forEach(function (a) { var p = BY_ID[a[0]]; if (p.day) sum += p.day * a[1]; else onReq = true; });
    $('#c-guests-out').textContent = g.toLocaleString('nl-NL');
    $('#c-guests').style.setProperty('--p', ((g - 20) / (2000 - 20) * 100) + '%');
    $('#r-positions').textContent = pos;
    $('#r-price').textContent = eur(sum) + (onReq ? ' +' : '');
    $('#r-list').innerHTML = advice.map(function (a) {
      var p = BY_ID[a[0]];
      return '<li><img src="images/' + p.imgs[0] + '" alt=""><span><b>' + a[1] + '× ' + esc(p.name) + '</b><br><small style="opacity:.65">' + p.base.layout.join(' · ') + '</small></span><span class="q">' + (p.day ? eur(p.day * a[1]) : 'op aanvraag') + '</span></li>';
    }).join('');
  }
  function setCalc(o) {
    if (o.guests) $('#c-guests').value = Math.min(2000, Math.max(20, o.guests));
    if (o.dur) { var r = $('input[name=dur][value="' + o.dur + '"]'); if (r) r.checked = true; }
    if (typeof o.drinks === 'boolean') $('#c-drinks').checked = o.drinks;
    calc();
  }

  /* ---------- Area check ---------- */
  function areaCheck(e) {
    if (e) e.preventDefault();
    var v = $('#a-city').value.trim(), out = $('#area-out');
    $$('.pin').forEach(function (p) { p.classList.remove('is-hit'); });
    if (!v) { out.textContent = 'Typ eerst uw plaatsnaam.'; return; }
    var key = Object.keys(CITIES).filter(function (c) { return c.toLowerCase() === v.toLowerCase(); })[0] ||
      Object.keys(CITIES).filter(function (c) { return c.toLowerCase().indexOf(v.toLowerCase()) === 0; })[0];
    if (key) {
      out.innerHTML = '<b>✓ Wij leveren in ' + esc(key) + '.</b> Dat is ca. ' + CITIES[key] + ' km vanaf ons depot in Boxtel. Vervoer: €1 per gereden km.';
      var pin = PIN_MAP[key] || (CITIES[key] === 0 ? 'Boxtel' : null);
      $$('.pin').forEach(function (p) { if (p.textContent === pin) p.classList.add('is-hit'); });
    } else {
      out.innerHTML = '<b>✓ Wij leveren in heel Nederland, België en Duitsland</b>, dus ook in ' + esc(v) + '. Vraag een offerte aan voor de exacte vervoerskosten.';
    }
  }

  /* ---------- Forms ---------- */
  function validate(form) {
    var ok = true;
    $$('[required]', form).forEach(function (i) {
      var bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value));
      i.closest('.f').classList.toggle('is-err', bad);
      if (bad && ok) { i.focus(); ok = false; }
    });
    return ok;
  }

  /* ---------- Init ---------- */
  function init() {
    renderProducts(); renderQuote(); calc();
    $('#cities').innerHTML = Object.keys(CITIES).map(function (c) { return '<option value="' + esc(c) + '">'; }).join('');
    var today = new Date(); today.setDate(today.getDate() + 1);
    var min = today.toISOString().slice(0, 10);
    $('#b-date').min = min; $('#q-date').min = min;

    // Header
    var header = $('#header'), mbar = $('.mbar'), hero = $('.hero');
    function onScroll() {
      header.classList.toggle('is-stuck', window.scrollY > 40);
      mbar.classList.toggle('is-on', window.scrollY > hero.offsetHeight * 0.7);
    }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    var burger = $('.burger'), mnav = $('#mnav');
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', open); mnav.classList.toggle('is-open', open);
    });
    $$('#mnav a').forEach(function (a) { a.addEventListener('click', function () { burger.setAttribute('aria-expanded', 'false'); mnav.classList.remove('is-open'); }); });

    // Active nav
    if ('IntersectionObserver' in window) {
      var links = $$('.nav a');
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      links.forEach(function (l) { var s = $(l.getAttribute('href')); if (s) io.observe(s); });
    }

    // Products
    $$('.chip').forEach(function (c) { c.addEventListener('click', function () { applyFilter(c.dataset.filter); }); });
    $$('[data-jump-filter]').forEach(function (a) { a.addEventListener('click', function () { applyFilter(a.dataset.jumpFilter); }); });
    $$('.price-toggle button').forEach(function (b) {
      b.addEventListener('click', function () {
        period = b.dataset.period;
        $$('.price-toggle button').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        updatePrices();
      });
    });
    document.addEventListener('click', function (e) {
      var qv = e.target.closest('[data-qv]'); if (qv) { openModal(qv.dataset.qv); return; }
      var add = e.target.closest('.card__add'); if (add) { addQuote(add.dataset.id); return; }
      var xa = e.target.closest('[data-xadd]'); if (xa) { addQuote(xa.dataset.xadd); return; }
      var th = e.target.closest('#m-thumbs button');
      if (th) { $('#m-img').src = 'images/' + th.dataset.src; $$('#m-thumbs button').forEach(function (b) { b.classList.toggle('is-on', b === th); }); return; }
      if (e.target.closest('[data-close]')) { closeModal(); return; }
      if (e.target.closest('[data-open-quote]')) { openDrawer(); return; }
      if (e.target.closest('[data-close-drawer]')) closeDrawer();
    });
    $('#ptable').addEventListener('keydown', function (e) { var r = e.target.closest('[data-qv]'); if (r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openModal(r.dataset.qv); } });
    $('#m-add').addEventListener('click', function () { if (current) { addQuote(current.id); closeModal(); } });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!$('#modal').hidden) closeModal(); else if (!$('#drawer').hidden) closeDrawer();
      var pop = $('.note-pop'); if (pop) pop.remove();
    });

    // Advisor
    ['#c-guests', '#c-drinks', '#c-access'].forEach(function (s) { $(s).addEventListener('input', calc); });
    $$('input[name=dur]').forEach(function (r) { r.addEventListener('change', calc); });
    $('#r-add').addEventListener('click', function () {
      advice.forEach(function (a) { addQuote(a[0], a[1], true); });
      $('#q-guests').value = $('#c-guests').value;
      toast('✓ Advies toegevoegd aan uw offerte');
      openDrawer();
    });

    // Booking bar
    $('#booking').addEventListener('submit', function (e) {
      e.preventDefault();
      var g = Number($('#b-guests').value), d = $('#b-date').value, pl = $('#b-place').value, ty = $('#b-type').value;
      if (g) { setCalc({ guests: g }); $('#q-guests').value = g; }
      if (d) $('#q-date').value = d;
      if (pl) { $('#q-place').value = pl; $('#a-city').value = pl; areaCheck(); }
      if (ty && !$('#q-msg').value) $('#q-msg').value = 'Soort evenement: ' + ty;
      smoothTo('#advies');
      toast(g ? 'Hier is ons advies voor ' + g + ' gasten' : 'Vul uw aantal gasten in voor direct advies');
    });

    // Occasions
    $$('[data-occ]').forEach(function (b) {
      b.addEventListener('click', function () {
        var o = JSON.parse(b.dataset.occ);
        setCalc(o); $('#q-guests').value = o.guests; $('#q-msg').value = 'Soort evenement: ' + o.type;
        smoothTo('#advies'); toast('Advies ingevuld voor: ' + o.type);
      });
    });

    // Area
    $('#area-check').addEventListener('submit', areaCheck);

    // Quote form
    $('#qform').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(this)) { toast('Vul de verplichte velden in'); return; }
      $('.qform__done', this).hidden = false;
      quote = {}; saveQuote();
    });
    $$('#qform [required]').forEach(function (i) { i.addEventListener('input', function () { i.closest('.f').classList.remove('is-err'); }); });

    animate();
  }

  /* ---------- Motion (GSAP) ---------- */
  function animate() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var gsap = window.gsap;
    if (!gsap || reduce) return;
    document.documentElement.classList.add('js');
    gsap.registerPlugin(window.ScrollTrigger);
    window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { window.ScrollTrigger.refresh(); });
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero__title .line > span', { yPercent: 110, duration: 1.1, stagger: .1 })
      .from('.hero .eyebrow, .hero__sub, .hero__ctas, .checks', { y: 24, opacity: 0, duration: .8, stagger: .08 }, '-=.7')
      .from('.arch', { clipPath: 'inset(100% 0 0 0 round 300px 300px 28px 28px)', duration: 1.3, ease: 'expo.inOut' }, 0.1)
      .from('.arch img', { scale: 1.35, duration: 1.8 }, 0.1)
      .from('.float', { y: 30, opacity: 0, scale: .9, duration: .8, stagger: .12, ease: 'back.out(1.6)' }, '-=.9')
      .from('.booking', { y: 40, opacity: 0, duration: .9 }, '-=.8');

    gsap.to('.arch img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.float--a', { y: -40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.float--b', { y: -70, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    window.ScrollTrigger.batch('.reveal', {
      start: 'top 88%', once: true,
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out', overwrite: true }); }
    });

    $$('[data-count]').forEach(function (el) {
      var end = Number(el.dataset.count), o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });

    gsap.from('.luxe__img', { y: 80, opacity: 0, duration: 1.2, stagger: .15, ease: 'power3.out', scrollTrigger: { trigger: '.luxe', start: 'top 70%' } });
    gsap.to('.luxe__img--1 img', { yPercent: -10, scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.luxe', scrub: true } });
    gsap.to('.luxe__img--3', { y: -50, ease: 'none', scrollTrigger: { trigger: '.luxe', scrub: true } });
    gsap.from('.luxe__copy > *', { y: 30, opacity: 0, duration: .9, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.luxe__copy', start: 'top 75%' } });
    gsap.from('.occ__card', { y: 60, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.occ__grid', start: 'top 80%' } });
    window.ScrollTrigger.create({ trigger: '.area__map', start: 'top 80%', once: true, onEnter: function () { $('.area__map').classList.add('is-in'); } });
  }

  /* ---------- Design notes (prototype only) ---------- */
  function notes() {
    var btn = $('#notes-toggle'), on = false;
    var N = window.NOTES || [];
    function close() { var p = $('.note-pop'); if (p) p.remove(); }
    function show(n, i) {
      close();
      var d = document.createElement('div'); d.className = 'note-pop'; d.setAttribute('role', 'dialog');
      d.innerHTML = '<button class="x" type="button" aria-label="Sluiten">×</button><span class="k">Design note ' + (i + 1) + ' / ' + N.length + '</span><h4>' + n.title + '</h4><p>' + n.why + '</p>' + (n.cro ? '<ul>' + n.cro.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>' : '');
      document.body.appendChild(d); $('.x', d).addEventListener('click', close); $('.x', d).focus();
    }
    function toggle(force) {
      on = typeof force === 'boolean' ? force : !on;
      btn.setAttribute('aria-pressed', on);
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); notes(); });
  else { init(); notes(); }
})();
