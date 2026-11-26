/* Ellevate Legacy, Version C "The Residence": interactions */
(function () {
  'use strict';
  var D = document, H = D.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  H.classList.add('js');
  var lenis = null;
  function $(s, c) { return (c || D).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || D).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- 1. Kreyòl ---------- */
  var HT = {
    'skip':'Ale nan kontni an','ann.1':'Kounye a n ap sèvi Massachusetts ak Florid','ann.2':'Nou pale Kreyòl',
    'nav.search':'Chèche Kay','nav.services':'Sèvis','nav.about':'Konsènan','nav.ev':'Evènman','nav.int':'Entèpretasyon','nav.contact':'Kontak','nav.re2':'Imobilye',
    'cta.free':'Konsiltasyon Gratis','cta.free2':'Pran yon Konsiltasyon Gratis',
    'hero.k':'Imobilye · Entèpretasyon · Evènman','hero.h1':'Sèvis eksepsyonèl.','hero.h2':'Yon touch pèsonèl.',
    'hero.p':'Kay nan Massachusetts ak Florid, entèpretasyon Kreyòl–Angle ak selebrasyon ou p ap janm bliye, avèk Christelle k ap gide w pèsonèlman.',
    'hero.scroll':'Dekouvri',
    'ct.home':'Jwenn yon Kay','ct.int':'Rezève yon Entèprèt','ct.ev':'Planifye yon Evènman',
    'cp.buy':'Achte','cp.sell':'Vann','cp.loc':'Kote','cp.locph':'Vil, kòd postal oswa katye','cp.state':'Eta','cp.both':'MA ak FL','cp.price':'Pri maksimòm','cp.any':'Nenpòt','cp.beds':'Chanm',
    'cp.search':'Chèche Kay','cp.addr':'Adrès pwopriyete w','cp.addrph':'Ri, vil, eta','cp.value':'Konnen Valè Kay Mwen',
    'cp.apt':'Randevou','cp.date':'Dat','cp.fmt':'Fòma','cp.inp':'An pèsòn','cp.rem':'Telefòn / videyo','cp.avail':'Verifye Disponiblite',
    'cp.evt':'Selebrasyon','cp.guests':'Envite','cp.check':'Verifye Dat Mwen',
    'int.l1':'Entèvyou imigrasyon','int.l2':'Randevou medikal','int.l3':'Reyinyon legal / avoka','int.l4':'Reyinyon lekòl','int.l5':'Siyati imobilye',
    'ev.o1':'Maryaj','ev.o2':'Gwo anivèsè','ev.o3':'Chower oswa fiyansay','ev.o4':'Anivèsè maryaj','ev.o5':'Batèm oswa kominyon',
    'tr.1':'Imobilye ak lisans','tr.2':'Rechèch kay an dirèk','tr.3':'Entèpretasyon pwofesyonèl','tr.4':'Repons pèsonèl',
    'ls.k':'Ellevate Imobilye','ls.h1':'Kay ki a vann,','ls.h2':'isit la menm.',
    'ls.p':'Chèche kay nan Massachusetts ak Florid dirèkteman sou sit nou an, sere sa w renmen yo, epi mande yon vizit prive ak yon sèl klik.',
    'ls.count':'kay jwenn','ls.sort':'Klase','ls.s1':'Pi nouvo','ls.s2':'Pri: piti rive gwo','ls.s3':'Pri: gwo rive piti',
    'ls.empty':'Pa gen kay ki koresponn ankò. Eseye yon rechèch pi laj, oswa mande Christelle mete yon alèt pèsonèl pou ou.',
    'ls.idx':'Se egzanp kay yo ye. Fil MLS / IDX Christelle la ap konekte isit la.','ls.alert':'Resevwa Alèt Nouvo Kay',
    'ls.sk':'W ap panse vann?','ls.sh1':'Konbyen kay ou','ls.sh2':'vrèman vo?','ls.sp':'Resevwa yon analiz mache gratis e pèsonèl nan men Christelle, san estimasyon otomatik, san angajman.',
    'sv.k':'Twa sèvis, yon sèl eritaj','sv.h1':'Twa sèvis.','sv.h2':'Yon sèl angajman pou ekselans.',
    'd1.t':'Imobilye, nan yon lòt nivo.','d1.p':'Kit w ap achte, vann oswa chèche pwochen opòtinite w, w ap jwenn konsèy pèsonèl ak bon jan atansyon pandan tout pakou imobilye w.',
    'd1.l1':'Premye achtè, depi pre-apwobasyon rive nan kle yo','d1.l2':'Pri, prezantasyon ak estrateji pou vann','d1.l3':'Deplasman ant MA ak FL','d1.c':'Chèche kay',
    'd2.t':'Vwa w. Istwa w. Konprann.','d2.p':'Bon kominikasyon enpòtan, sitou nan gwo moman lavi a. Entèpretasyon Kreyòl–Angle avèk pwofesyonalis, swen ak respè.',
    'd2.l1':'Randevou ki gen rapò ak imigrasyon','d2.l2':'Reyinyon medikal, legal ak lekòl','d2.l3':'An pèsòn oswa pa telefòn / videyo','d2.c':'Mande yon entèprèt',
    'd3.t':'Moman ki merite selebre.','d3.p':'Soti nan ti rasanbleman entim rive nan gwo selebrasyon, yon planifikasyon byen panse ak atansyon sou chak detay ap reyalize vizyon ou.',
    'd3.l1':'Maryaj ak renouvèlman ve','d3.l2':'Anivèsè, chower ak fèt','d3.l3':'Planifikasyon konplè oswa kowòdinasyon jou a','d3.c':'Gade selebrasyon yo',
    'ev.h1':'Selebrasyon,','ev.h2':'ki rete grave nan memwa.','ev.p':'Planifikasyon pèsonèl ak kowòdinasyon jou a, pou ou ka viv moman an pandan nou okipe chak detay avèk gras.',
    'ev.g1':'Maryaj','ev.g2':'Resepsyon','ev.g3':'Gwo anivèsè','ev.g4':'Chower ak fiyansay','ev.g5':'Anivèsè maryaj ak renouvèlman ve','ev.g6':'Legliz ak kominote','ev.drag':'Glise pou dekouvri',
    'ab.tag':'Foto w isit la','ab.k':'Yon eritaj bati sou sèvis','ab.q':'«Nou pa vle sèlman satisfè atant ou. Nou vle leve eksperyans lan pi wo.»',
    'ab.p':'Ellevate Legacy fèt sou yon kwayans: fason nou sèvi lòt moun enpòtan. Kit m ap ede yon fanmi jwenn premye kay li, kit m kanpe bò kote yon moun nan yon randevou enpòtan, kit m ap bay yon selebrasyon lavi, m pote menm kè a bay chak kliyan, anrasinen nan lafwa e gide pa sèvis.',
    'ab.role':'Fondatris, Ellevate Legacy','ab.cta':'Rankontre Christelle',
    'df.1':'Entegrite','df.1p':'Bati relasyon sou onètete, respè ak konfyans.','df.2':'Ekselans','df.2p':'Bay atansyon sou ti detay ki fè diferans.','df.3':'Pèsonalizasyon','df.3p':'Konprann chak kliyan ak chak okazyon inik.','df.4':'Objektif','df.4p':'Abòde chak opòtinite avèk entansyon ak swen.',
    'rv.k':'Bèl pawòl','rv.h1':'Moun fè nou konfyans','rv.h2':'nan moman enpòtan lavi yo.',
    'rv.1':'«Christelle fè achte premye kay nou an vin kalm e klè, li eksplike an Angle ak an Kreyòl pou manman m.»',
    'rv.2':'«Pou entèvyou imigrasyon m nan, li te prepare, pwofesyonèl e janti. Finalman m santi yo konprann mwen.»',
    'rv.3':'«25yèm anivèsè maryaj nou an te bèl anpil. Chak detay te sanble ak nou.»',
    'rv.4':'«Li vann kay nou nan Brockton pi chè pase pri nou te mande, epi li ede nou jwenn kay nou nan Orlando. De eta, zewo estrès.»',
    'rv.5':'«Nan randevou medikal papa m, pa gen anyen ki pèdi nan tradiksyon an. Pasyan, presi e respektye.»',
    'rv.6':'«Fèt 16 an pitit fi m nan te sanble ak yon magazin. Christelle te panse ak tout bagay.»',
    'rv.note':'Temwayaj egzanp pou apèsi.',
    'cs.k':'Konsiltasyon gratis','cs.h1':'Ann kòmanse','cs.h2':'pwochen chapit ou.',
    'pr.1':'Di nou sa w bezwen','pr.1p':'De minit, san angajman.','pr.2':'Christelle reponn nan 24è','pr.2p':'Yon konsiltasyon gratis e pèsonèl.','pr.3':'Nou leve eksperyans lan','pr.3p':'Depi premye rankont rive nan dènye detay.',
    'cs.call':'Rele oswa voye tèks','cs.wa':'Ekri nenpòt lè',
    'f.need':'Mwen bezwen èd pou','f.o1':'Imobilye: achte oswa vann','f.o2':'Entèpretasyon: Kreyòl ⇄ Angle','f.o3':'Evènman: planifye yon selebrasyon',
    'f.name':'Non konplè','f.phone':'Telefòn','f.email':'Imèl','f.goal':'M ap chèche','f.both':'Achte ak vann','f.rel':'Toude / deplase','f.home':'Kay ki enterese m',
    'f.msg':'Mesaj (opsyonèl)','f.pref':'Reponn mwen an','f.send':'Mande Konsiltasyon Gratis Mwen','f.fine':'Gratis · San angajman · Prive · Repons nan 24 èdtan',
    'f.d1':'Mèsi','f.d2':'Demann ou rive kot Christelle. L ap kontakte w li menm nan 24 èdtan. Si se ijan, rele oswa voye tèks nan (617) 555-0142.','f.dwa':'Kontinye sou WhatsApp',
    'fq.h1':'Kesyon,','fq.h2':'ak repons.',
    'fq.q1':'Èske premye konsiltasyon an vrèman gratis?','fq.a1':'Wi. Premye konvèsasyon an gratis e san angajman. Se jis yon okazyon pou konprann bezwen w epi wè si nou fè ansanm.',
    'fq.q6':'Èske m ka chèche kay MLS sou sit sa a?','fq.a6':'Wi. Chèche kay ki a vann nan Massachusetts ak Florid isit la menm, sere sa w renmen yo, epi mande yon vizit ak yon sèl klik.',
    'fq.q3':'Èske nou fè entèpretasyon nan randevou imigrasyon?','fq.a3':'Wi. Entèpretasyon Kreyòl–Angle disponib pou kèk randevou ki gen rapò ak imigrasyon, ansanm ak randevou medikal, legal, lekòl ak pèsonèl.',
    'fq.q4':'Konbyen tan davans mwen ta dwe rezève?','fq.a4':'Pou entèpretasyon, pi bonè posib. Ban nou dat la, n ap fè tout sa nou kapab menm si li prese. Pou evènman, 3 a 12 mwa davans se ideyal.',
    'fq.q5':'Kijan peman an fèt?','fq.a5':'Pa gen anyen pou peye sou entènèt. Pri ak peman ap regle avè w pèsonèlman yon fwa sèvis ou konfime.',
    'al.k':'Rete enfòme','al.h1':'Nouvo kay,','al.h2':'an premye.','al.ph':'Adrès imèl ou','al.go':'Resevwa Alèt Kay','al.ok':'Ou sou lis la. Byenvini!',
    'ft.r':'Kontakte nou','ft.f':'Swiv nou','ft.rights':'Tout dwa rezève.','ft.eh':'Opòtinite Egal nan Lojman','ft.mls':'Done kay yo soti nan MLS (lè l konekte)',
    'mb.s':'Kay','mb.c':'Rele'
  };
  var T = { en: { bd: 'bd', ba: 'ba', sqft: 'sq ft', show: 'Request a showing', nw: 'New', saved: 'Saved to your favorites', unsaved: 'Removed from favorites', sub: 'You\'re on the list!' },
            ht: { bd: 'ch', ba: 'tw', sqft: 'pi²', show: 'Mande yon vizit', nw: 'Nouvo', saved: 'Sere nan favori w yo', unsaved: 'Retire nan favori', sub: 'Ou sou lis la!' } };
  var nodes = $$('[data-i18n]'); nodes.forEach(function (n) { n.__en = n.innerHTML; });
  var phs = $$('[data-i18n-ph]'); phs.forEach(function (n) { n.__en = n.placeholder; });
  var lang = 'en';
  function setLang(l, save) {
    lang = l;
    nodes.forEach(function (n) { var v = HT[n.getAttribute('data-i18n')]; n.innerHTML = (l === 'ht' && v) ? v : n.__en; });
    phs.forEach(function (n) { var v = HT[n.getAttribute('data-i18n-ph')]; n.placeholder = (l === 'ht' && v) ? v : n.__en; });
    H.lang = l;
    $$('.lang__b').forEach(function (b) { var on = b.getAttribute('data-lang') === l; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
    render();
    if (save) store('elc-lang', l);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  $$('.lang__b').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); }); });

  /* ---------- 2. Header + menu ---------- */
  var hd = $('.hd'), burger = $('.burger'), menu = $('#menu'), lastY = 0;
  function onScroll() {
    var y = scrollY;
    hd.classList.toggle('is-fixed', y > 140);
    if (y > 700 && y > lastY + 6 && !D.body.classList.contains('menu-open')) hd.classList.add('is-hidden');
    else if (y < lastY - 6 || y < 700) hd.classList.remove('is-hidden');
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  function toggleMenu(o) { burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); menu.classList.toggle('is-open', o); menu.setAttribute('aria-hidden', !o); D.body.classList.toggle('menu-open', o); if (lenis) o ? lenis.stop() : lenis.start(); }
  burger.addEventListener('click', function () { toggleMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) toggleMenu(false); });

  /* ---------- 3. Toast ---------- */
  var toastEl = $('.toast'), tT;
  function toast(msg) { toastEl.textContent = msg; toastEl.hidden = false; toastEl.style.animation = 'none'; void toastEl.offsetWidth; toastEl.style.animation = ''; clearTimeout(tT); tT = setTimeout(function () { toastEl.hidden = true; }, 2600); }

  /* ---------- 4. Concierge tabs ---------- */
  var ctabs = $$('.ctab'), cpanes = $$('.cpane'), bgs = $$('.hero__bg img');
  ctabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var k = t.getAttribute('data-ct');
      ctabs.forEach(function (x) { var on = x === t; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', on); });
      cpanes.forEach(function (p) { var on = p.getAttribute('data-cp') === k; p.hidden = !on; p.classList.toggle('is-on', on); });
      bgs.forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-bg') === k); });
    });
  });
  var mode = 'buy';
  $$('.mode__b').forEach(function (b) {
    b.addEventListener('click', function () {
      mode = b.getAttribute('data-mode');
      $$('.mode__b').forEach(function (x) { x.classList.toggle('is-on', x === b); });
      $('.js-buy').hidden = mode !== 'buy'; $('.js-sell').hidden = mode !== 'sell';
    });
  });

  /* ---------- 5. Listings (MLS/IDX-ready) ---------- */
  var U = 'https://images.unsplash.com/';
  var homes = [
    { id: 1, st: 'MA', city: 'Newton', addr: '48 Elm Ridge Road', price: 1249000, bd: 4, ba: 3, sf: 3120, img: 'photo-1570129477492-45c003edd2be', nw: 1 },
    { id: 2, st: 'FL', city: 'Miami', addr: '1210 Bayview Terrace', price: 1650000, bd: 5, ba: 4, sf: 3900, img: 'photo-1564013799919-ab600027ffc6', nw: 1 },
    { id: 3, st: 'MA', city: 'Concord', addr: '7 Lantern Hill Lane', price: 985000, bd: 3, ba: 2.5, sf: 2460, img: 'photo-1568605114967-8130f3a36994', nw: 0 },
    { id: 4, st: 'FL', city: 'Orlando', addr: '3305 Lakeshore Drive', price: 689000, bd: 4, ba: 3, sf: 2900, img: 'photo-1580587771525-78b9dba3b914', nw: 1 },
    { id: 5, st: 'MA', city: 'Milton', addr: '22 Brook Meadow Way', price: 739000, bd: 4, ba: 2, sf: 2280, img: 'photo-1583608205776-bfd35f0d9f83', nw: 1 },
    { id: 6, st: 'FL', city: 'Boca Raton', addr: '880 Palm Grove Court', price: 2350000, bd: 5, ba: 5, sf: 4700, img: 'photo-1613490493576-7fde63acd811', nw: 0 },
    { id: 7, st: 'MA', city: 'Brockton', addr: '164 Maple Crest Avenue', price: 529000, bd: 3, ba: 2, sf: 1840, img: 'photo-1605276374104-dee2a0ed3cd6', nw: 0 },
    { id: 8, st: 'FL', city: 'Naples', addr: '19 Coral Sands Boulevard', price: 1195000, bd: 3, ba: 3, sf: 2650, img: 'photo-1512917774080-9991f1c4c750', nw: 0 }
  ];
  var F = { st: 'all', max: 0, beds: 0, q: '', sort: 'new' };
  var saved = []; try { saved = JSON.parse(store('elc-saved') || '[]'); } catch (e) { saved = []; }
  var grid = $('.js-grid'), countEl = $('.js-count'), emptyEl = $('.lempty');
  function money(n) { return '$' + n.toLocaleString('en-US'); }
  function render() {
    var t = T[lang], q = F.q.toLowerCase().trim();
    var list = homes.filter(function (h) {
      if (F.st !== 'all' && h.st !== F.st) return false;
      if (F.max && h.price > F.max) return false;
      if (F.beds && h.bd < F.beds) return false;
      if (q) {
        var hay = (h.city + ', ' + h.st + ' ' + h.addr + (h.st === 'MA' ? ' massachusetts' : ' florida')).toLowerCase();
        var city = q.split(',')[0].trim();
        if (hay.indexOf(city) === -1) return false;
      }
      return true;
    });
    if (F.sort === 'lo') list.sort(function (a, b) { return a.price - b.price; });
    else if (F.sort === 'hi') list.sort(function (a, b) { return b.price - a.price; });
    else list.sort(function (a, b) { return b.nw - a.nw || a.id - b.id; });
    countEl.textContent = list.length;
    emptyEl.hidden = list.length > 0;
    grid.innerHTML = list.map(function (h, i) {
      var on = saved.indexOf(h.id) > -1;
      return '<article class="home" style="animation-delay:' + (i * 60) + 'ms">' +
        '<div class="home__img"><img src="' + U + h.img + '?w=700&q=72&auto=format&fit=crop" alt="Home in ' + h.city + ', ' + h.st + '" loading="lazy">' +
        '<span class="home__badge' + (h.nw ? ' home__badge--new' : '') + '">' + (h.nw ? t.nw : h.st) + '</span>' +
        '<button class="home__heart' + (on ? ' is-on' : '') + '" data-id="' + h.id + '" aria-pressed="' + on + '" aria-label="Save home"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg></button></div>' +
        '<div class="home__body"><p class="home__price" style="margin:0">' + money(h.price) + '</p>' +
        '<p class="home__addr" style="margin:0">' + h.addr + ', ' + h.city + ', ' + h.st + '</p>' +
        '<p class="home__specs" style="margin-bottom:12px"><span><b>' + h.bd + '</b> ' + t.bd + '</span><span><b>' + h.ba + '</b> ' + t.ba + '</span><span><b>' + h.sf.toLocaleString('en-US') + '</b> ' + t.sqft + '</span></p>' +
        '<a class="home__cta" href="#contact" data-show="' + h.id + '">' + t.show + ' →</a></div></article>';
    }).join('');
    $('.js-saved').textContent = saved.length;
  }
  grid.addEventListener('click', function (e) {
    var hb = e.target.closest('.home__heart');
    if (hb) {
      var id = +hb.getAttribute('data-id'), k = saved.indexOf(id);
      if (k > -1) saved.splice(k, 1); else saved.push(id);
      store('elc-saved', JSON.stringify(saved));
      hb.classList.toggle('is-on', k === -1); hb.setAttribute('aria-pressed', k === -1);
      $('.js-saved').textContent = saved.length;
      var s = $('.saved'); s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump');
      toast(k === -1 ? T[lang].saved : T[lang].unsaved);
      return;
    }
    var sh = e.target.closest('[data-show]');
    if (sh) {
      var h = homes.filter(function (x) { return x.id === +sh.getAttribute('data-show'); })[0];
      setForm('realestate'); $('#f-goal').value = 'Buying'; $('#f-state').selectedIndex = h.st === 'MA' ? 0 : 1;
      var fh = $('.js-home'); fh.hidden = false; $('#f-home').value = h.addr + ', ' + h.city + ', ' + h.st + ' (' + money(h.price) + ')';
    }
  });
  function setChip(st) { F.st = st; $$('.chip').forEach(function (c) { c.classList.toggle('is-on', c.getAttribute('data-st') === st); }); }
  $$('.chip').forEach(function (c) { c.addEventListener('click', function () { setChip(c.getAttribute('data-st')); render(); }); });
  $('#sort').addEventListener('change', function () { F.sort = this.value; render(); });

  $('#homeSearch').addEventListener('submit', function (e) {
    e.preventDefault();
    if (mode === 'sell') {
      setForm('realestate'); $('#f-goal').value = 'Selling';
      var a = $('#s-addr').value.trim(); if (a) $('#f-msg').value = (lang === 'ht' ? 'Adrès pwopriyete: ' : 'Property address: ') + a;
      go('#contact'); return;
    }
    F.q = $('#s-loc').value; F.max = +$('#s-price').value; F.beds = +$('#s-beds').value;
    var st = $('#s-state').value;
    if (/,\s*(ma|massachusetts)\b/i.test(F.q)) st = 'MA'; else if (/,\s*(fl|florida)\b/i.test(F.q)) st = 'FL';
    setChip(st); render(); go('#search');
  });
  $$('.cpane[data-cp=int], .cpane[data-cp=ev]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f.getAttribute('data-cp') === 'int') { setForm('interpretation'); $('#f-apt').selectedIndex = $('#q-apt').selectedIndex; $('#f-idate').value = $('#q-idate').value; }
      else { setForm('events'); $('#f-evt').selectedIndex = $('#q-evt').selectedIndex; $('#f-edate').value = $('#q-edate').value; $('#f-msg').value = (lang === 'ht' ? 'Envite: ' : 'Guests: ') + $('#q-g').value; }
      go('#contact');
    });
  });

  /* ---------- 6. Services sticky media ---------- */
  var sImgs = $$('.svc__frame img'), sBadge = $('.js-svcb'), sCur = 0, roman = ['I', 'II', 'III'];
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = +en.target.getAttribute('data-si'); if (i === sCur) return;
        sImgs.forEach(function (im, k) { im.classList.toggle('was', k === sCur); im.classList.toggle('is-on', k === i); });
        sCur = i; sBadge.textContent = roman[i] + ' / III';
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    $$('.sblock').forEach(function (b) { so.observe(b); });
  }
  var phrases = [['“Please state your full name.”', '“Tanpri di non konplè w.”'], ['“Do you have any allergies?”', '“Èske ou fè alèji ak kichòy?”'], ['“Do you understand the document?”', '“Èske ou konprann dokiman an?”'], ['“Welcome to your new home.”', '“Byenvini lakay ou.”']];
  var pI = 0, cen = $('.js-cen'), cht = $('.js-cht');
  if (!reduce) setInterval(function () {
    pI = (pI + 1) % phrases.length; cen.classList.add('is-out'); cht.classList.add('is-out');
    setTimeout(function () { cen.textContent = phrases[pI][0]; cht.textContent = phrases[pI][1]; cen.classList.remove('is-out'); setTimeout(function () { cht.classList.remove('is-out'); }, 450); }, 400);
  }, 3400);

  /* ---------- 7. Drag rail ---------- */
  var rail = $('.rail'), hint = $('.rail__hint i'), down = false, sx = 0, sl = 0, moved = 0;
  rail.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = rail.scrollLeft; });
  addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; moved = Math.abs(dx); if (moved > 4) rail.classList.add('is-drag'); rail.scrollLeft = sl - dx; });
  addEventListener('pointerup', function () { down = false; rail.classList.remove('is-drag'); });
  rail.addEventListener('scroll', function () { var m = rail.scrollWidth - rail.clientWidth; hint.style.setProperty('--p', Math.max(.15, m ? rail.scrollLeft / m : 1)); }, { passive: true });

  /* ---------- 8. Inquiry form ---------- */
  var form = $('#inquiry'), svcSel = $('#f-svc');
  function setForm(s) { svcSel.value = s; $$('.fsvc', form).forEach(function (f) { f.hidden = f.getAttribute('data-fs') !== s; }); if (s !== 'realestate') $('.js-home').hidden = true; }
  svcSel.addEventListener('change', function () { setForm(svcSel.value); });
  $$('[data-go]').forEach(function (a) {
    a.addEventListener('click', function () {
      setForm(a.getAttribute('data-go'));
      if (a.getAttribute('data-sub') === 'Selling') $('#f-goal').value = 'Selling';
    });
  });
  form.addEventListener('input', function (e) { var f = e.target.closest('.ff'); if (f) f.classList.remove('err'); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    ['f-name', 'f-phone', 'f-email'].forEach(function (id) {
      var el = D.getElementById(id), v = el.value.trim();
      var good = id === 'f-email' ? /^\S+@\S+\.\S+$/.test(v) : id === 'f-phone' ? v.replace(/\D/g, '').length >= 7 : v.length > 1;
      el.closest('.ff').classList.toggle('err', !good);
      if (!good && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;
    /* Production: POST to a Google Form "formResponse" URL (free; answers land in a Google Sheet). */
    $('.js-dname').textContent = ', ' + $('#f-name').value.trim().split(' ')[0];
    form.hidden = true; $('.done').hidden = false;
  });
  $('#alerts').addEventListener('submit', function (e) {
    e.preventDefault(); var i = $('#a-email');
    if (!/^\S+@\S+\.\S+$/.test(i.value.trim())) { i.focus(); return; }
    $('.alerts__ok').hidden = false; i.value = ''; toast(T[lang].sub);
  });

  /* ---------- 9. Mobile bar + CRO ---------- */
  var mbar = $('.mbar');
  if ('IntersectionObserver' in window) {
    var past = false, atForm = false, upd = function () { mbar.classList.toggle('is-on', past && !atForm); };
    new IntersectionObserver(function (e) { past = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; upd(); }).observe($('.concierge'));
    new IntersectionObserver(function (e) { atForm = e[0].isIntersecting; upd(); }, { threshold: .1 }).observe($('#contact'));
  }
  var croBtn = $('.cro-toggle'), pop = $('.cro-pop'), croEls = $$('[data-cro]');
  function popShow(t, d) { $('.cro-pop__t').textContent = t; $('.cro-pop__d').textContent = d; pop.hidden = false; }
  croBtn.addEventListener('click', function () {
    var on = !D.body.classList.contains('cro-on');
    D.body.classList.toggle('cro-on', on); croBtn.setAttribute('aria-pressed', on);
    $('.cro-toggle__txt').textContent = on ? 'Hide layout notes' : 'Why this layout?';
    $$('.cro-pin').forEach(function (p) { p.remove(); });
    if (on) {
      croEls.forEach(function (el, i) {
        var pin = D.createElement('button'); pin.type = 'button'; pin.className = 'cro-pin';
        pin.innerHTML = '<b>' + (i + 1) + '</b>' + el.getAttribute('data-cro-title');
        pin.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); popShow((i + 1) + '. ' + el.getAttribute('data-cro-title'), el.getAttribute('data-cro')); });
        el.appendChild(pin);
      });
      popShow('Built around search', 'Version C is designed like a luxury property site. Home search sits at the centre, because that is what buyers come for and what brings them back. Interpretation and events clients still get their own path from the very first screen. Tap any gold tag to see why a section is there.');
    } else pop.hidden = true;
  });
  $('.cro-pop__x').addEventListener('click', function () { pop.hidden = true; });

  /* ---------- 10. Anchors ---------- */
  function go(id) {
    var t = id === '#top' ? null : $(id);
    var y = t ? t.getBoundingClientRect().top + scrollY - (id === '#contact' ? 0 : 70) : 0;
    if (lenis) lenis.scrollTo(y, { duration: 1.5 }); else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }
  D.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    e.preventDefault(); go(id);
  });

  /* ---------- 11. Motion ---------- */
  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger || reduce) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.hero__h .ln > *', { yPercent: 110, duration: 1.5, stagger: .12 })
      .from('.hero__k, .hero__p', { opacity: 0, y: 20, duration: 1.2, stagger: .1 }, '<.2')
      .from('.concierge', { opacity: 0, y: 50, duration: 1.4 }, '<.2')
      .from('.hero__trust li', { opacity: 0, y: 20, duration: 1, stagger: .08 }, '<.3')
      .from('.hd__in > *', { opacity: 0, y: -16, duration: 1, stagger: .08 }, 0);
    gsap.to('.hero__bg', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    $$('.lhead, .lbar, .lfoot, .worth, .svc__intro, .sblock, .founder__copy > *, .val, .faq .h2, .acc details, .contact__side > *, .fcard, .alerts, .ft__grid > *, .reviews .h2').forEach(function (el) {
      gsap.from(el, { opacity: 0, y: 40, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    gsap.from('.worth__img img', { scale: 1.25, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.worth', start: 'top 85%', once: true } });
    gsap.from('.founder__img', { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.founder', start: 'top 70%', once: true } });
    gsap.fromTo('.founder__img img', { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.founder', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.rcard', { opacity: 0, x: 80, duration: 1.2, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.rail', start: 'top 85%', once: true } });
    ScrollTrigger.refresh();
  }

  /* ---------- 12. Boot ---------- */
  setForm('realestate');
  render();
  var initial = store('elc-lang') || 'en';
  var qp = new URLSearchParams(location.search).get('lang'); if (qp === 'ht' || qp === 'en') initial = qp;
  if (initial !== 'en') setLang(initial, false);
  if (D.readyState === 'complete') initMotion(); else addEventListener('load', initMotion);
})();
