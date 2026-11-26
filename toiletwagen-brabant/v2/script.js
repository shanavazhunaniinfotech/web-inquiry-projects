/* Toiletwagen Brabant — Version B "Atelier" */
(function () {
  'use strict';
  var D = window.TWB, P = D.P, SERIES = D.SERIES, BASE = D.BASE, CITIES = D.CITIES, IMG = '../images/';
  var BY = {}; P.forEach(function (p) { BY[p.id] = p; });
  var PIN = { 'Den Bosch': 'Den Bosch', "'s-Hertogenbosch": 'Den Bosch', 'Vught': 'Den Bosch', 'Eindhoven': 'Eindhoven', 'Best': 'Eindhoven', 'Helmond': 'Eindhoven', 'Tilburg': 'Tilburg', 'Oisterwijk': 'Tilburg', 'Waalwijk': 'Tilburg', 'Breda': 'Breda', 'Roosendaal': 'Breda', 'Nijmegen': 'Nijmegen', 'Oss': 'Nijmegen', 'Arnhem': 'Nijmegen', 'Utrecht': 'Utrecht', 'Amsterdam': 'Utrecht', 'Rotterdam': 'Rotterdam', 'Den Haag': 'Rotterdam', 'Dordrecht': 'Rotterdam', 'Antwerpen': 'Antwerpen', 'Turnhout': 'Antwerpen', 'Brussel': 'Antwerpen', 'Gent': 'Antwerpen', 'Düsseldorf': 'Düsseldorf', 'Keulen': 'Düsseldorf', 'Venlo': 'Düsseldorf', 'Boxtel': 'Boxtel' };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var eur = function (n) { return '€' + n.toLocaleString('nl-NL'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  var tT; function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('is-on'); clearTimeout(tT); tT = setTimeout(function () { t.classList.remove('is-on'); }, 2600); }
  function layHTML(l) { var o = []; if (l.f) o.push('<span><svg><use href="#i-f"/></svg>' + l.f + ' dames</span>'); if (l.m) o.push('<span><svg><use href="#i-m"/></svg>' + l.m + ' heren</span>'); if (l.u) o.push('<span><svg><use href="#i-u"/></svg>' + l.u + ' urinoirs</span>'); if (l.a) o.push('<span><svg><use href="#i-a"/></svg>rolstoeltoegankelijk</span>'); return o.join(''); }
  function layText(l) { var o = []; if (l.f) o.push(l.f + ' dames'); if (l.m) o.push(l.m + ' heren'); if (l.u) o.push(l.u + ' urinoirs'); if (l.a) o.push('rolstoeltoegankelijk'); return o.join(' · '); }
  var lenis = null;
  function go(el, off) { if (!el) return; if (lenis) lenis.scrollTo(el, { offset: off || -90, duration: 1.2 }); else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + (off || -90), behavior: 'smooth' }); }
  function lock(on) { if (lenis) on ? lenis.stop() : lenis.start(); document.documentElement.style.overflow = on ? 'hidden' : ''; }

  /* Quote */
  var quote = store('twb-v2-quote') || {};
  function qInfo() { var n = 0, s = 0, r = false; Object.keys(quote).forEach(function (id) { var p = BY[id]; if (!p) return; n += quote[id]; if (p.day) s += p.day * quote[id]; else r = true; }); return { n: n, s: s, r: r }; }
  function addQ(id, q, silent) { quote[id] = (quote[id] || 0) + (q || 1); saveQ(); if (!silent) toast('✓ ' + BY[id].name + ' staat in uw offertelijst'); $$('[data-qcount]').forEach(function (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }); }
  function saveQ() { store('twb-v2-quote', quote); renderQ(); }
  function row(id) { var p = BY[id]; return '<div class="qitem"><img src="' + IMG + p.img[0] + '" alt=""><span>' + esc(p.name) + '<small>' + (p.day ? eur(p.day) + ' per dag' : 'Prijs op aanvraag') + '</small></span><span class="qty"><button type="button" data-q="-1" data-id="' + id + '" aria-label="Minder">−</button><b>' + quote[id] + '</b><button type="button" data-q="1" data-id="' + id + '" aria-label="Meer">+</button></span></div>'; }
  function renderQ() {
    var i = qInfo(), ids = Object.keys(quote), rows = ids.map(row).join('');
    $$('[data-qcount]').forEach(function (b) { b.textContent = i.n; });
    var body = rows || '<div class="drawer__empty"><p>Uw offertelijst is nog leeg.</p><a class="btn btn--ink" href="#collectie" data-close-drawer>Bekijk de collectie</a></div>';
    if (ids.length) { var xs = ['plaszuil', 'miva'].filter(function (id) { return !quote[id]; }); if (xs.length) body += '<div class="xsell"><h4>Vaak samen gehuurd</h4>' + xs.map(function (id) { var p = BY[id]; return '<div class="xsell__row"><img src="' + IMG + p.img[0] + '" alt=""><span>' + p.name + '<small>' + (p.day ? eur(p.day) + ' per dag · ' : '') + p.guests + '</small></span><button type="button" data-xadd="' + id + '">+ Toevoegen</button></div>'; }).join('') + '</div>'; }
    $('#drawer-body').innerHTML = body;
    $('#drawer-total').textContent = i.n ? eur(i.s) + (i.r ? ' +' : '') : '€0';
    $('#qform-items').innerHTML = rows;
    $$('.pa').forEach(function (b) { var on = !!quote[b.dataset.add]; b.classList.toggle('is-added', on); b.textContent = on ? '✓' : '+'; });
    if (curEx) { var a = $('#ex-add'), on = !!quote[curEx.id]; a.classList.toggle('is-added', on); a.textContent = on ? '✓ In uw offerte' : '+ Toevoegen aan offerte'; }
  }

  /* Explorer */
  var period = 'day', curS = SERIES[0], curEx = null;
  function priceHTML(p, lbl) {
    if (p.day === null) return '<small>Prijs</small><b class="req">Op aanvraag</b>';
    var wk = period === 'wk' && p.wk;
    return '<small>' + (lbl || (wk ? 'Per weekend' : 'Per dag')) + '</small><b>' + eur(wk ? p.wk : p.day) + '</b> <em>ex btw</em>';
  }
  function fromPrice(s) { var v = s.vars.map(function (id) { return BY[id]; }).filter(function (p) { return p.day; }); return v.length ? 'vanaf ' + eur(Math.min.apply(null, v.map(function (p) { return p.day; }))) : 'op aanvraag'; }
  function renderList() {
    $('#ex-list').innerHTML = SERIES.map(function (s, i) {
      var p = BY[s.vars[0]];
      return '<button type="button" class="ex__tab" role="tab" aria-selected="' + (i ? 'false' : 'true') + '" data-series="' + s.id + '"><img src="' + IMG + p.img[0] + '" alt=""><span><b>' + s.name + '</b><small>' + fromPrice(s) + (s.vars.length > 1 ? ' · ' + s.vars.length + ' uitvoeringen' : '') + '</small></span>' + (s.badge ? '<em>' + s.badge + '</em>' : '') + '</button>';
    }).join('');
  }
  function showSeries(id) {
    curS = SERIES.filter(function (s) { return s.id === id; })[0] || SERIES[0];
    $$('.ex__tab').forEach(function (t) { t.setAttribute('aria-selected', t.dataset.series === curS.id); });
    $('#ex-series').textContent = curS.name;
    $('#ex-tag').textContent = curS.tagline;
    $('#ex-badge').textContent = curS.badge || '';
    $('#ex-vars').innerHTML = curS.vars.length > 1 ? curS.vars.map(function (vid) { var p = BY[vid]; return '<button type="button" data-var="' + vid + '"><img src="' + IMG + p.img[0] + '" alt="">' + p.short + '</button>'; }).join('') : '';
    showVar(curS.vars[0]);
  }
  function showVar(id) {
    var p = BY[id]; curEx = p;
    var box = $('.ex__img'), img = $('#ex-img');
    box.classList.add('swap');
    setTimeout(function () { img.src = IMG + p.img[0]; img.alt = 'Toiletwagen ' + p.name; img.classList.toggle('contain', !!p.contain); var done = function () { box.classList.remove('swap'); }; if (img.complete) done(); else img.onload = done; }, 200);
    $('#ex-name').textContent = p.name;
    $('#ex-lay').innerHTML = layHTML(p.lay);
    $('#ex-specs').innerHTML = [['Geschikt voor', p.guests], ['Afmetingen', p.dims], ['Afvoer', p.drain], ['Stroom', p.noBase ? 'Niet nodig' : '220V']].map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');
    $('#ex-price').innerHTML = priceHTML(p);
    $$('#ex-vars button').forEach(function (b) { b.classList.toggle('is-on', b.dataset.var === id); });
    renderQ();
  }
  function renderTiers() { $$('[data-tier]').forEach(function (el) { var p = BY[el.dataset.tier]; var wk = period === 'wk' && p.wk; el.innerHTML = '<small>vanaf</small><b>' + eur(wk ? p.wk : p.day) + '</b> <em>' + (wk ? 'per weekend' : 'per dag') + '</em>'; }); }
  function renderTable() {
    $('#ptable').innerHTML = P.map(function (p) { return '<tr data-qv="' + p.id + '" tabindex="0"><td>' + esc(p.name) + (p.tag ? '<span class="tg2">' + p.tag + '</span>' : '') + '<small>' + layText(p.lay) + '</small></td><td>' + (p.day ? eur(p.day) : 'Op aanvraag') + '</td><td>' + (p.wk ? eur(p.wk) : (p.day ? '–' : 'Op aanvraag')) + '</td><td><button type="button" class="pa" data-add="' + p.id + '" aria-label="' + esc(p.name) + ' toevoegen">+</button></td></tr>'; }).join('');
  }
  function gotoSeries(id) { showSeries(id); go($('#collectie')); }

  /* Modal / drawer */
  var cur = null, lastF = null;
  function openModal(id) {
    var p = BY[id]; if (!p) return; cur = p; lastF = document.activeElement;
    var im = $('#m-img'); im.src = IMG + p.img[0]; im.alt = 'Toiletwagen ' + p.name; im.classList.toggle('contain', !!p.contain);
    $('#m-thumbs').innerHTML = p.img.length > 1 ? p.img.map(function (s, i) { return '<button type="button" class="' + (i ? '' : 'is-on') + '" data-src="' + s + '" aria-label="Foto ' + (i + 1) + '"><img src="' + IMG + s + '" alt=""></button>'; }).join('') : '';
    $('#m-cat').textContent = p.guests; $('#m-title').textContent = p.name; $('#m-lay').innerHTML = layHTML(p.lay);
    $('#m-prices').innerHTML = p.day ? '<div><small>Dagprijs</small><b>' + eur(p.day) + '</b></div><div><small>Weekendprijs</small><b>' + (p.wk ? eur(p.wk) : '–') + '</b></div>' : '<div style="grid-column:1/-1"><small>Prijs</small><b>Op aanvraag</b></div>';
    var sp = { 'Afmetingen': p.dims, 'Indeling': layText(p.lay), 'Afvoer': p.drain }; if (!p.noBase) Object.assign(sp, BASE); if (p.extra) Object.assign(sp, p.extra); sp['Vervoer'] = (p.km || '€1') + ' per gereden km ex btw';
    $('#m-specs').innerHTML = Object.keys(sp).map(function (k) { return '<dt>' + k + '</dt><dd>' + esc(sp[k]) + '</dd>'; }).join('');
    $('#modal').hidden = false; lock(true); $('#modal .x').focus();
  }
  function closeModal() { $('#modal').hidden = true; lock(false); if (lastF) lastF.focus(); }
  function openDrawer() { $('#drawer').hidden = false; lock(true); $('#drawer .x').focus(); }
  function closeDrawer() { $('#drawer').hidden = true; lock(false); }

  /* Advisor */
  var advice = [];
  function calc() {
    var g = +$('#c-guests').value, per = +$('input[name=dur]:checked').value, drinks = $('#c-drinks').checked, acc = $('#c-access').checked, lux = $('#c-lux').checked;
    var need = Math.max(2, Math.ceil(g / per * (drinks ? 1.25 : 1))), r = need, L = {};
    function add(id, n) { L[id] = (L[id] || 0) + (n || 1); }
    while (r > 13) { add('event'); r -= 13; }
    if (r > 0) add(r <= 2 ? (lux ? 'mini-hout' : 'mini-grijs') : r <= 5 ? (lux ? 'type-a-grey' : 'type-a') : r <= 7 ? (lux ? 'vip-hout' : 'type-b') : 'event');
    if (g >= 500 && drinks) add('plaszuil', Math.floor(g / 500));
    if (acc) add('miva');
    advice = Object.keys(L).map(function (id) { return [id, L[id]]; });
    var sum = 0, req = false; advice.forEach(function (a) { var p = BY[a[0]]; if (p.day) sum += p.day * a[1]; else req = true; });
    $('#c-guests-out').textContent = g.toLocaleString('nl-NL');
    $('#c-guests').style.setProperty('--p', ((g - 20) / 1980 * 100) + '%');
    $('#r-pos').textContent = need;
    $('#r-price').textContent = eur(sum) + (req ? '+' : '');
    $('#r-list').innerHTML = advice.map(function (a, i) { var p = BY[a[0]]; return '<div class="ac" style="animation-delay:' + i * 70 + 'ms"><img src="' + IMG + p.img[0] + '" alt=""><span><b>' + a[1] + '× ' + esc(p.name) + '</b><small>' + layText(p.lay) + '</small></span><span class="q">' + (p.day ? eur(p.day * a[1]) : 'op aanvraag') + '</span></div>'; }).join('');
  }
  function setCalc(o) {
    if (o.guests) $('#c-guests').value = Math.min(2000, Math.max(20, o.guests));
    if (o.dur) { var r = $('input[name=dur][value="' + o.dur + '"]'); if (r) r.checked = true; }
    if (typeof o.drinks === 'boolean') $('#c-drinks').checked = o.drinks;
    if (typeof o.lux === 'boolean') $('#c-lux').checked = o.lux;
    calc();
  }

  /* Area */
  function area(e) {
    if (e) e.preventDefault();
    var v = $('#a-city').value.trim(), out = $('#area-out'); $$('.pin').forEach(function (p) { p.classList.remove('is-hit'); });
    if (!v) { out.textContent = 'Typ eerst uw plaatsnaam.'; return; }
    var lv = v.toLowerCase(), ks = Object.keys(CITIES);
    var k = ks.filter(function (c) { return c.toLowerCase() === lv; })[0] || ks.filter(function (c) { return c.toLowerCase().indexOf(lv) === 0; })[0];
    if (k) { out.innerHTML = '<b>✓ Wij leveren in ' + esc(k) + '.</b> Ca. ' + CITIES[k] + ' km vanaf Boxtel · vervoer €1 per gereden km.'; $$('.pin').forEach(function (p) { if (p.textContent === PIN[k]) p.classList.add('is-hit'); }); }
    else out.innerHTML = '<b>✓ Wij leveren in heel NL, BE en DE</b>, ook in ' + esc(v) + '.';
  }

  /* Wizard */
  var step = 1;
  function setStep(n) {
    step = n;
    $$('.wiz__pane').forEach(function (p) { p.classList.toggle('is-on', +p.dataset.pane === n); });
    $('#wiz-bar').style.width = (n / 3 * 100) + '%';
    $('#wiz-step').textContent = 'Stap ' + n + ' van 3';
    $('#wiz-back').disabled = n === 1;
    $('#wiz-next').innerHTML = (n === 3 ? 'Toon advies &amp; prijs' : 'Volgende') + '<svg><use href="#i-arrow"/></svg>';
  }

  function init() {
    renderList(); showSeries('mini'); renderTiers(); renderTable(); renderQ(); calc();
    $('#cities').innerHTML = Object.keys(CITIES).map(function (c) { return '<option value="' + esc(c) + '">'; }).join('');
    var t = new Date(); t.setDate(t.getDate() + 1); var min = t.toISOString().slice(0, 10); $('#w-date').min = min; $('#q-date').min = min;

    var hdr = $('#hdr'), mbar = $('.mbar');
    function onScroll() { hdr.classList.toggle('is-stuck', scrollY > 40); mbar.classList.toggle('is-on', scrollY > innerHeight * .6); }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    var burger = $('.burger'), menu = $('#menu');
    burger.addEventListener('click', function () { var o = menu.hidden; menu.hidden = !o; burger.setAttribute('aria-expanded', o); });
    $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { menu.hidden = true; burger.setAttribute('aria-expanded', false); }); });
    if ('IntersectionObserver' in window) {
      var links = $$('.hdr__nav a');
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
      links.forEach(function (l) { var s = $(l.getAttribute('href')); if (s) io.observe(s); });
    }

    // Wizard
    $$('input[name=w-type]').forEach(function (r) { r.addEventListener('change', function () { $('#w-guests').value = r.dataset.g; setTimeout(function () { setStep(2); }, 180); }); });
    $$('[data-step]').forEach(function (b) { b.addEventListener('click', function () { var i = $('#w-guests'); i.value = Math.max(10, Math.min(2000, (+i.value || 0) + +b.dataset.step)); }); });
    $$('[data-set]').forEach(function (b) { b.addEventListener('click', function () { $('#w-guests').value = b.dataset.set; setTimeout(function () { setStep(3); }, 150); }); });
    $('#wiz-back').addEventListener('click', function () { setStep(Math.max(1, step - 1)); });
    $('#wiz').addEventListener('submit', function (e) {
      e.preventDefault();
      if (step < 3) { setStep(step + 1); return; }
      var g = +$('#w-guests').value || 100, ty = $('input[name=w-type]:checked').value, d = $('#w-date').value, pl = $('#w-place').value.trim();
      setCalc({ guests: g, lux: ty === 'Bruiloft' || ty === 'Bedrijfsevent' });
      $('#q-guests').value = g; if (d) $('#q-date').value = d; if (pl) { $('#q-place').value = pl; $('#a-city').value = pl; area(); }
      $('#q-msg').value = 'Soort evenement: ' + ty;
      go($('#adviseur')); toast('Uw advies voor ' + g + ' gasten staat klaar');
    });

    // Clicks
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (a && a.getAttribute('href').length > 1) { var tg = $(a.getAttribute('href')); if (tg) { e.preventDefault(); if (a.hasAttribute('data-close-drawer')) closeDrawer(); if (a.dataset.goto) gotoSeries(a.dataset.goto); else go(tg); return; } }
      var gt = e.target.closest('button[data-goto]'); if (gt) { gotoSeries(gt.dataset.goto); return; }
      var q = e.target.closest('[data-q]'); if (q) { var id = q.dataset.id, n = (quote[id] || 0) + +q.dataset.q; if (n <= 0) delete quote[id]; else quote[id] = n; saveQ(); return; }
      var tab = e.target.closest('.ex__tab'); if (tab) { showSeries(tab.dataset.series); return; }
      var v = e.target.closest('[data-var]'); if (v) { showVar(v.dataset.var); return; }
      var ad = e.target.closest('[data-add]'); if (ad) { e.stopPropagation(); addQ(ad.dataset.add); return; }
      var xa = e.target.closest('[data-xadd]'); if (xa) { addQ(xa.dataset.xadd); return; }
      var qv = e.target.closest('[data-qv]'); if (qv) { openModal(qv.dataset.qv); return; }
      var th = e.target.closest('#m-thumbs button'); if (th) { $('#m-img').src = IMG + th.dataset.src; $$('#m-thumbs button').forEach(function (b) { b.classList.toggle('is-on', b === th); }); return; }
      if (e.target.closest('[data-close]')) { closeModal(); return; }
      if (e.target.closest('[data-open-quote]')) { openDrawer(); return; }
      if (e.target.closest('[data-close-drawer]')) closeDrawer();
    });
    $('#ex-zoom').addEventListener('click', function () { if (curEx) openModal(curEx.id); });
    $('#ex-add').addEventListener('click', function () { if (curEx) addQ(curEx.id); });
    $('#m-add').addEventListener('click', function () { if (cur) { addQ(cur.id); closeModal(); } });
    $('#ptable').addEventListener('keydown', function (e) { var r = e.target.closest('tr[data-qv]'); if (r && e.target === r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openModal(r.dataset.qv); } });
    document.addEventListener('keydown', function (e) { if (e.key !== 'Escape') return; if (!$('#modal').hidden) closeModal(); else if (!$('#drawer').hidden) closeDrawer(); var pp = $('.note-pop'); if (pp) pp.remove(); });
    $$('.seg-t button').forEach(function (b) { b.addEventListener('click', function () { period = b.dataset.period; $$('.seg-t button').forEach(function (x) { x.classList.toggle('is-on', x.dataset.period === period); }); if (curEx) $('#ex-price').innerHTML = priceHTML(curEx); renderTiers(); }); });

    // Advisor
    ['#c-guests', '#c-drinks', '#c-access', '#c-lux'].forEach(function (s) { $(s).addEventListener('input', calc); });
    $$('input[name=dur]').forEach(function (r) { r.addEventListener('change', calc); });
    $('#r-add').addEventListener('click', function () { advice.forEach(function (a) { addQ(a[0], a[1], true); }); $('#q-guests').value = $('#c-guests').value; toast('✓ Advies toegevoegd aan uw offerte'); openDrawer(); });

    // Occasions
    $$('[data-occ]').forEach(function (b) { b.addEventListener('click', function () { var o = JSON.parse(b.dataset.occ); setCalc(o); $('#q-guests').value = o.guests; $('#q-msg').value = 'Soort evenement: ' + o.type; go($('#adviseur')); toast('Advies ingevuld voor: ' + o.type); }); });

    // Gallery drag
    var gal = $('#gal'), down = false, sx = 0, sl = 0, moved = false;
    gal.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = gal.scrollLeft; gal.classList.add('is-drag'); });
    addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; gal.scrollLeft = sl - dx; });
    addEventListener('pointerup', function () { down = false; gal.classList.remove('is-drag'); });
    gal.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.stopPropagation(); }, { passive: true });

    // Area + form
    $('#area-check').addEventListener('submit', area);
    $('#qform').addEventListener('submit', function (e) {
      e.preventDefault(); var ok = true;
      $$('[required]', this).forEach(function (i) { var bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.closest('.f').classList.toggle('is-err', bad); if (bad && ok) { i.focus(); ok = false; } });
      if (!ok) { toast('Vul de verplichte velden in'); return; }
      $('.qform__done', this).hidden = false; quote = {}; saveQ();
    });
    $$('#qform [required]').forEach(function (i) { i.addEventListener('input', function () { i.closest('.f').classList.remove('is-err'); }); });

    motion();
  }

  function motion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST || reduce) return;
    document.documentElement.classList.add('js-anim');
    gsap.registerPlugin(ST);
    if (window.Lenis) { lenis = new window.Lenis({ lerp: .11 }); lenis.on('scroll', ST.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero__meta', { y: 20, opacity: 0, duration: 1 })
      .from('.hero__title', { y: 50, opacity: 0, duration: 1.3 }, '<.05')
      .from('.hero__sub, .hero__ctas, .ticks', { y: 30, opacity: 0, duration: 1.1, stagger: .08 }, '<.2')
      .from('.hero__img', { clipPath: 'inset(8% 8% 8% 8% round 40px)', scale: .96, opacity: 0, duration: 1.6 }, 0.1)
      .from('.hero__img img', { scale: 1.2, duration: 2 }, 0.1)
      .from('.wiz', { y: 60, opacity: 0, duration: 1.2 }, '<.5')
      .from('.hero__tag', { y: -14, opacity: 0, duration: .8 }, '<.3');
    gsap.to('.hero__img img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    ST.batch('.rv', { start: 'top 88%', once: true, onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: .08, ease: 'expo.out', overwrite: true, clearProps: 'transform' }); } });
    $$('.head').forEach(function (h) { gsap.from(h.children, { y: 30, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } }); });
    $$('[data-count]').forEach(function (el) { var end = +el.dataset.count, o = { v: 0 }; el.textContent = '0'; gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true }, onUpdate: function () { el.textContent = Math.round(o.v); } }); });
    gsap.from('.ex__stage', { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.explorer', start: 'top 85%', once: true } });
    gsap.from('.ex__list', { x: -30, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.explorer', start: 'top 85%', once: true } });
    gsap.from('.qcard, .adv__res', { y: 50, opacity: 0, duration: 1.1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.adv__qs', start: 'top 85%', once: true } });
    gsap.from('.gal__track figure', { x: 120, opacity: 0, duration: 1.2, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: '.gal__track', start: 'top 85%', once: true } });
    gsap.from('.final__panel', { y: 60, opacity: 0, scale: .97, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.final', start: 'top 80%', once: true } });
    gsap.from('.pin:not(.pin--home)', { opacity: 0, y: 8, duration: .6, stagger: .06, scrollTrigger: { trigger: '.area__map', start: 'top 85%', once: true } });
    addEventListener('load', function () { ST.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
  }

  function notes() {
    var btn = $('#notes-toggle'), on = false, N = window.NOTES || [];
    function close() { var p = $('.note-pop'); if (p) p.remove(); }
    function show(n, i) { close(); var d = document.createElement('div'); d.className = 'note-pop'; d.setAttribute('data-lenis-prevent', ''); d.innerHTML = '<button class="xx" type="button" aria-label="Sluiten">×</button><span class="k">Design note ' + (i + 1) + ' / ' + N.length + '</span><h4>' + n.title + '</h4><p>' + n.why + '</p>' + (n.cro ? '<ul>' + n.cro.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>' : ''); document.body.appendChild(d); $('.xx', d).addEventListener('click', close); $('.xx', d).focus(); }
    function toggle(f) {
      on = typeof f === 'boolean' ? f : !on; btn.setAttribute('aria-pressed', on); $$('.note-pin').forEach(function (p) { p.remove(); }); close(); if (!on) return;
      N.forEach(function (n, i) { var host = $('[data-note="' + n.key + '"]'); if (!host) return; var pin = document.createElement('button'); pin.type = 'button'; pin.className = 'note-pin'; pin.innerHTML = '<b>' + (i + 1) + '</b>' + n.title; pin.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); show(n, i); }); host.appendChild(pin); });
    }
    btn.addEventListener('click', function () { toggle(); });
    if (/[?&]notes=1/.test(location.search)) toggle(true);
  }

  function boot() { init(); notes(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
