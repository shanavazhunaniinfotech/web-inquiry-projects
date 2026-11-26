/* Ellevate Legacy, Version B: interactions */
(function () {
  'use strict';
  var D = document, H = D.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  H.classList.add('js');
  var lenis = null;
  function $(s, c) { return (c || D).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || D).querySelectorAll(s)); }

  /* ---------------- 1. Language ---------------- */
  var HT = {
    'skip':'Ale nan kontni an','nav.about':'Konsènan','nav.about2':'Konsènan Christelle','nav.re':'Imobilye','nav.int':'Entèpretasyon','nav.ev':'Evènman','nav.contact':'Kontak',
    'cta.free':'Konsiltasyon Gratis','cta.free2':'Pran yon Konsiltasyon Gratis','tb.area':'Massachusetts ak Florid',
    'hero.tag':'Imobilye · Entèpretasyon · Evènman','hero.lead':'Yon touch pèsonèl pou',
    'hero.p':'Sèvis eksepsyonèl ak yon touch pèsonèl, nan men Christelle. Achte oswa vann yon kay nan Massachusetts ak Florid, fè moun konprann ou nèt an Kreyòl oswa an Angle, epi selebre gwo moman lavi w avèk bèlte.',
    'b.like':'Mwen ta renmen','b.what':'Kisa w bezwen?','b.o1':'achte yon kay','b.o2':'vann kay mwen','b.o3':'rezève yon entèprèt','b.o4':'planifye yon evènman','b.in':'nan','b.detail':'Detay','b.go':'Kòmanse',
    'hero.p1':'Imobilye ak lisans','hero.p2':'Entèpretasyon pwofesyonèl','hero.p3':'Repons pèsonèl',
    'fl.1':'Lisans nan MA ak FL','fl.1s':'Imobilye rezidansyèl','fl.2s':'Chak mo, byen konprann','fl.3':'Bonjou! Kijan m ka ede w jodi a? M reponn ou mwen menm nan 24è.',
    'sv.k':'Twa sèvis. Yon sèl angajman pou ekselans.','sv.h1':'Tout sa w bezwen,','sv.h2':'anba yon sèl non ou ka fè konfyans.',
    're.search':'Chèche kay ki a vann','re.view':'Gade lis yo ↗','re.h':'Imobilye, nan yon lòt nivo.',
    're.p':'Kit w ap achte, vann, oswa chèche pwochen opòtinite w, w ap jwenn konsèy pèsonèl ak bon jan atansyon pandan tout pakou imobilye w, an Angle oswa an Kreyòl.',
    're.l1':'Gid pou premye achtè','re.l2':'Pri ak estrateji pou vann','re.l3':'Deplasman MA ⇄ FL','re.l4':'Chak dokiman eksplike','re.buy':'M ap Achte','re.sell':'M ap Vann',
    'int.live':'Ap entèprete kounye a','int.h':'Vwa w. Istwa w. Konprann.',
    'int.p':'Bon kominikasyon enpòtan, sitou nan gwo moman lavi a. Entèpretasyon Kreyòl–Angle ki kraze baryè lang avèk pwofesyonalis, swen ak respè.',
    'int.l1':'Entèvyou imigrasyon','int.l2':'Randevou medikal','int.l3':'Reyinyon legal ak avoka','int.l4':'Reyinyon lekòl ak fanmi','int.cta':'Mande yon Entèprèt','int.cta2':'Randevou a pwòch?',
    'ev.cal':'N ap pran rezèvasyon','ev.m1':'Prentan','ev.m2':'Ete','ev.m3':'Otòn','ev.m4':'Fèt fen ane','ev.note':'Bon dat yo ale vit, verifye pa w la.',
    'ev.h':'Moman ki merite selebre.','ev.p':'Soti nan ti rasanbleman entim rive nan gwo selebrasyon, yon planifikasyon byen panse ak atansyon sou chak detay ap reyalize vizyon ou, pou ou ka jis jwi moman an.',
    'ev.l1':'Maryaj ak renouvèlman ve','ev.l2':'Gwo anivèsè','ev.l3':'Chower ak fiyansay','ev.l4':'Kowòdinasyon jou a','ev.cta':'Verifye Dat Mwen','ev.cta2':'Planifye Evènman Mwen',
    'bt.k':'Diferans Ellevate','bt.h1':'Sèvis dwe','bt.h2':'pèsonèl.','bt.p':'Nou pa vle sèlman satisfè atant ou. Nou vle leve eksperyans lan pi wo, avèk onètete, atansyon sou detay ak vrè swen.',
    'bt.f.k':'Fondasyon nou','bt.f1':'Anrasinen nan Lafwa.','bt.f2':'Gide pa Sèvis.','bt.m':'De eta, yon sèl defansè','bt.l':'Nou pale toude','bt.r':'Repons pèsonèl, chak fwa',
    'df.1':'Entegrite','df.1p':'Bati relasyon sou onètete, respè ak konfyans.','df.2':'Ekselans','df.2p':'Bay atansyon sou ti detay ki fè diferans.',
    'df.3':'Pèsonalizasyon','df.3p':'Konprann chak kliyan ak chak okazyon inik.','df.4':'Objektif','df.4p':'Abòde chak opòtinite avèk entansyon ak swen.',
    'pr.k':'Kijan sa mache','pr.h1':'Fasil pou kòmanse.','pr.h2':'Pèsonèl depi bonjou.',
    'pr.1':'Di nou sa w bezwen','pr.1p':'Chwazi sèvis ou epi pataje kèk detay. Sa pran apeprè de minit.',
    'pr.2':'Yon konsiltasyon pèsonèl gratis','pr.2p':'Christelle ap kontakte w nan 24 èdtan pou l koute w, reponn kesyon w epi rekòmande pwochen etap yo.',
    'pr.3':'Nou leve eksperyans lan','pr.3p':'Depi premye rankont rive nan dènye detay, w ap jwenn sipò avèk swen, klète ak ekselans.',
    'ab.tag':'Foto w isit la','ab.k':'Yon eritaj bati sou sèvis','ab.h1':'Bonjou, mwen se',
    'ab.p1':'Ellevate Legacy fèt sou yon kwayans: fason nou sèvi lòt moun enpòtan. Objektif mwen se bati relasyon ki gen sans, kreye bèl eksperyans, epi bay yon sèvis ki kite yon mak ki dire.',
    'ab.p2':'Kit m ap ede yon fanmi jwenn premye kay li, kit m kanpe bò kote yon moun nan yon randevou enpòtan, kit m ap bay yon selebrasyon lavi, m pote menm kè a bay chak kliyan.',
    'ab.f1':'Eta','ab.f2':'Lang','ab.f3':'Sèvis',
    'rv.k':'Bèl pawòl','rv.h1':'Moun fè nou konfyans','rv.h2':'nan moman enpòtan lavi yo.','rv.all':'Tout',
    'rv.1':'«Christelle fè achte premye kay nou an vin kalm e klè. Li eksplike tout bagay de fwa, yon fwa an Angle, yon fwa an Kreyòl pou manman m.»',
    'rv.2':'«M te pè anpil pou entèvyou imigrasyon m nan. Christelle te prepare, pwofesyonèl e janti. Pou premye fwa, m santi yo vrèman konprann mwen.»',
    'rv.3':'«25yèm anivèsè maryaj nou an te bèl anpil. Chak detay te sanble ak nou, epi nou te jis jwi aswè a ak fanmi nou.»',
    'rv.4':'«Nou te deplase soti Boston pou Orlando, e Christelle te okipe toude bò yo. Bon konsèy, repons rapid, zewo estrès.»',
    'rv.5':'«Nan randevou medikal papa m, li te asire pa gen anyen ki pèdi nan tradiksyon an. Pasyan, presi e tèlman respektye.»',
    'rv.6':'«Fèt 16 an pitit fi m nan te sanble ak yon magazin. Christelle te panse ak bagay nou pa t ap janm panse.»',
    'rv.note':'Temwayaj egzanp pou apèsi.',
    'ct.k':'Konsiltasyon gratis','ct.h1':'Ann leve','ct.h2':'pwochen moman ou.',
    'ct.p':'Di nou yon ti kras sou sa w bezwen. Christelle reponn ou li menm nan 24 èdtan, an Angle oswa an Kreyòl. San angajman, anyen pou peye sou entènèt.',
    'ct.call':'Rele oswa voye tèks','ct.wa':'Ekri nenpòt lè',
    'f.name':'Non konplè','f.phone':'Telefòn','f.email':'Imèl','f.re.q':'M ap chèche','f.re.1':'Achte','f.re.2':'Vann','f.re.3':'Achte ak vann','f.both':'Toude / deplase','f.state':'Eta','f.t1':'0–3 mwa','f.t2':'3–6 mwa','f.t3':'6 mwa +','f.time':'Delè',
    'f.other':'Lòt','f.apt':'Kalite randevou','f.idate':'Dat randevou a','f.inp':'An pèsòn','f.rem':'Telefòn / videyo',
    'f.e1':'Maryaj','f.e2':'Gwo anivèsè','f.e3':'Chower oswa fiyansay','f.e4':'Anivèsè maryaj','f.evt':'Kalite evènman','f.edate':'Dat evènman an',
    'f.msg':'Lòt bagay? (opsyonèl)','f.pref':'Lang ou prefere','f.send':'Mande Konsiltasyon Gratis Mwen','f.fine':'Prive e an sekirite · Gratis, san angajman · Repons nan 24è',
    'f.d1':'Mèsi','f.d2':'Demann ou rive kot Christelle. L ap kontakte w li menm nan 24 èdtan. Si se ijan, rele oswa voye tèks nan (617) 555-0142.','f.dwa':'Kontinye sou WhatsApp',
    'fq.h1':'Bon','fq.h2':'kesyon.','fq.p':'Ou pa jwenn repons ou? Christelle ap kontan ede w li menm.',
    'fq.q1':'Èske premye konsiltasyon an vrèman gratis?','fq.a1':'Wi. Premye konvèsasyon an gratis e san angajman. Se jis yon okazyon pou konprann bezwen w epi wè si nou fè ansanm.',
    'fq.q2':'Ki zòn nou sèvi pou imobilye?','fq.a2':'Kliyan rezidansyèl toupatou nan Massachusetts ak Florid, enkli fanmi k ap deplase ant de eta sa yo.',
    'fq.q3':'Èske nou fè entèpretasyon nan randevou imigrasyon?','fq.a3':'Wi. Entèpretasyon Kreyòl–Angle disponib pou kèk randevou ki gen rapò ak imigrasyon, ansanm ak randevou medikal, legal, lekòl ak pèsonèl.',
    'fq.q4':'Konbyen tan davans mwen ta dwe rezève?','fq.a4':'Pou entèpretasyon, pi bonè posib. Ban nou dat la, n ap fè tout sa nou kapab menm si li prese. Pou evènman, 3 a 12 mwa davans se ideyal.',
    'fq.q5':'Kijan peman an fèt?','fq.a5':'Pa gen anyen pou peye sou entènèt. Pri ak peman ap regle avè w pèsonèlman yon fwa sèvis ou konfime.',
    'fn.k':'Ellevate Legacy','fn.h1':'Nou pa jis satisfè atant ou.','fn.h2':'Nou leve eksperyans lan pi wo.','fn.call':'Rele',
    'ft.s':'Sèvis','ft.r':'Kontakte nou','ft.f':'Swiv nou','ft.rights':'Tout dwa rezève.','ft.eh':'Opòtinite Egal nan Lojman'
  };
  var WORDS = { en: ['home.', 'voice.', 'celebration.'], ht: ['kay ou.', 'vwa ou.', 'fèt ou.'] };
  var DETAIL = {
    en: { buy: ['in', ['Massachusetts', 'Florida', 'both states']], sell: ['in', ['Massachusetts', 'Florida']], int: ['for', ['an immigration interview', 'a medical appointment', 'a legal meeting', 'a school meeting']], ev: ['for', ['a wedding', 'a milestone birthday', 'a shower or engagement', 'an anniversary']] },
    ht: { buy: ['nan', ['Massachusetts', 'Florid', 'toude eta yo']], sell: ['nan', ['Massachusetts', 'Florid']], int: ['pou', ['yon entèvyou imigrasyon', 'yon randevou medikal', 'yon reyinyon legal', 'yon reyinyon lekòl']], ev: ['pou', ['yon maryaj', 'yon gwo anivèsè', 'yon chower oswa fiyansay', 'yon anivèsè maryaj']] }
  };
  var nodes = $$('[data-i18n]');
  nodes.forEach(function (n) { n.__en = n.innerHTML; });
  var lang = 'en';
  function setLang(l, save) {
    lang = l;
    nodes.forEach(function (n) { var v = HT[n.getAttribute('data-i18n')]; n.innerHTML = (l === 'ht' && v) ? v : n.__en; });
    H.lang = l;
    $$('.seg').forEach(function (s) { s.classList.toggle('is-ht', l === 'ht'); });
    $$('.seg__b').forEach(function (b) { var on = b.getAttribute('data-lang') === l; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
    $('.js-rot').textContent = WORDS[l][rotI];
    fillDetail();
    if (save) { try { localStorage.setItem('elb-lang', l); } catch (e) {} }
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  $$('.seg__b').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); }); });

  /* ---------------- 2. Header ---------------- */
  var nav = $('.nav'), burger = $('.burger'), lastY = 0;
  addEventListener('scroll', function () {
    var y = scrollY;
    if (y > 400 && y > lastY + 6 && !nav.classList.contains('is-open')) nav.classList.add('is-hidden');
    else if (y < lastY - 6 || y < 400) nav.classList.remove('is-hidden');
    lastY = y;
  }, { passive: true });
  function menu(open) { nav.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); $('#sheet').setAttribute('aria-hidden', !open); }
  burger.addEventListener('click', function () { menu(!nav.classList.contains('is-open')); });
  $('#sheet').addEventListener('click', function (e) { if (e.target.closest('a')) menu(false); });

  /* ---------------- 3. Hero rotator ---------------- */
  var rot = $('.js-rot'), rotI = 0, imgs = $$('.stack__img'), ticks = $$('.stack__ticks span');
  function rotate() {
    var next = (rotI + 1) % 3;
    rot.classList.add('is-out');
    setTimeout(function () {
      rot.textContent = WORDS[lang][next];
      rot.classList.remove('is-out'); rot.classList.add('is-in');
      void rot.offsetWidth; rot.classList.remove('is-in');
    }, 450);
    imgs.forEach(function (im, k) { im.classList.toggle('was', k === rotI); im.classList.toggle('is-on', k === next); });
    ticks.forEach(function (t, k) { t.classList.remove('is-on', 'is-done'); if (k < next) t.classList.add('is-done'); });
    void ticks[next].offsetWidth; ticks[next].classList.add('is-on');
    rotI = next;
  }
  if (!reduce) setInterval(rotate, 3600);

  /* ---------------- 4. Sentence builder ---------------- */
  var bWhat = $('#b-what'), bDet = $('#b-detail'), bMid = $('.js-bmid');
  function fillDetail() {
    var d = DETAIL[lang][bWhat.value], keep = bDet.selectedIndex;
    bMid.textContent = d[0];
    bDet.innerHTML = d[1].map(function (o) { return '<option>' + o + '</option>'; }).join('');
    if (keep > -1 && keep < d[1].length) bDet.selectedIndex = keep;
    if (typeof fitAll === 'function' && meas) fitAll();
  }
  var meas = D.createElement('span'); meas.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:-9999px'; D.body.appendChild(meas);
  function fit(sel) { var cs = getComputedStyle(sel); meas.style.font = cs.font; meas.textContent = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : ''; sel.style.width = (meas.offsetWidth + 30) + 'px'; }
  function fitAll() { fit(bWhat); fit(bDet); }
  bWhat.addEventListener('change', function () { bDet.selectedIndex = 0; fillDetail(); bDet.selectedIndex = 0; fitAll(); });
  bDet.addEventListener('change', fitAll);
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(fitAll);
  $('#builder').addEventListener('submit', function (e) {
    e.preventDefault();
    var w = bWhat.value, i = bDet.selectedIndex;
    if (w === 'buy' || w === 'sell') {
      setForm('realestate');
      form.querySelector('input[name=re_goal][value=' + (w === 'buy' ? 'Buying' : 'Selling') + ']').checked = true;
      $('#f-state').selectedIndex = Math.min(i, 2);
    } else if (w === 'int') { setForm('interpretation'); $('#f-apt').selectedIndex = i; }
    else { setForm('events'); $('#f-evt').selectedIndex = i; }
    go('#contact', function () { $('#f-name').focus({ preventScroll: true }); });
  });

  /* ---------------- 5. Service tabs ---------------- */
  var tabs = $$('.tab'), panels = $$('.panel'), tabOrder = ['realestate', 'interpretation', 'events'], cur = 0, auto = !reduce, tTimer;
  function showTab(i, user) {
    cur = i;
    tabs.forEach(function (t, k) {
      var on = k === i; t.classList.toggle('is-on', on); t.setAttribute('aria-selected', on);
      var bar = $('.tab__bar i', t); bar.classList.remove('run', 'full');
      if (on) { void bar.offsetWidth; bar.classList.add(auto ? 'run' : 'full'); }
    });
    panels.forEach(function (p, k) { var on = k === i; p.hidden = !on; p.classList.toggle('is-on', on); });
    if (user) { auto = false; clearTimeout(tTimer); $$('.tab__bar i').forEach(function (b) { b.classList.remove('run'); }); $('.tab.is-on .tab__bar i').classList.add('full'); }
    else if (auto) { clearTimeout(tTimer); tTimer = setTimeout(function () { showTab((cur + 1) % 3); }, 8000); }
  }
  tabs.forEach(function (t, i) { t.addEventListener('click', function () { showTab(i, true); }); });
  if ('IntersectionObserver' in window) {
    var started = false;
    new IntersectionObserver(function (e) { if (e[0].isIntersecting && !started) { started = true; showTab(0); } }, { threshold: .35 }).observe($('.panels'));
  }
  $$('[data-tab-link]').forEach(function (a) { a.addEventListener('click', function () { showTab(tabOrder.indexOf(a.getAttribute('data-tab-link')), true); }); });

  // interpretation phrase loop
  var phrases = [['“Please state your full name.”', '“Tanpri di non konplè w.”'], ['“Do you have any allergies?”', '“Èske ou fè alèji ak kichòy?”'], ['“Do you understand the document?”', '“Èske ou konprann dokiman an?”'], ['“Welcome to your new home.”', '“Byenvini lakay ou.”']];
  var pI = 0, pen = $('.js-pen'), pht = $('.js-pht');
  if (!reduce) setInterval(function () {
    pI = (pI + 1) % phrases.length; pen.classList.add('is-out'); pht.classList.add('is-out');
    setTimeout(function () { pen.textContent = phrases[pI][0]; pht.textContent = phrases[pI][1]; pen.classList.remove('is-out'); setTimeout(function () { pht.classList.remove('is-out'); }, 500); }, 400);
  }, 3400);

  /* ---------------- 6. Bento bits ---------------- */
  var sw = $('.js-swap'), swords = ['Bonjou', 'Hello', 'Byenvini', 'Welcome', 'Mèsi', 'Thank you'], sI = 0;
  if (!reduce) setInterval(function () { sw.classList.add('is-out'); setTimeout(function () { sI = (sI + 1) % swords.length; sw.textContent = swords[sI]; sw.classList.remove('is-out'); }, 380); }, 2200);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { $('.b--reply').classList.add('is-in'); o.disconnect(); } }, { threshold: .5 }).observe($('.b--reply'));
  else $('.b--reply').classList.add('is-in');

  /* ---------------- 7. Review filter ---------------- */
  $$('.chip').forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      $$('.chip').forEach(function (x) { x.classList.toggle('is-on', x === c); });
      $$('.rv').forEach(function (r) { var show = f === 'all' || r.getAttribute('data-s') === f; r.classList.toggle('is-hide', !show); r.classList.remove('is-pop'); if (show) { void r.offsetWidth; r.classList.add('is-pop'); } });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  /* ---------------- 8. Form ---------------- */
  var form = $('#inquiry'), ftabs = $$('.ftab'), thumb = $('.ftabs__thumb'), card = $('.formcard');
  var accs = { realestate: '#0E3B2F', interpretation: '#1F4D62', events: '#B07A66' };
  function setForm(s) {
    form.service.value = s;
    var i = tabOrder.indexOf(s);
    ftabs.forEach(function (t, k) { t.classList.toggle('is-on', k === i); t.setAttribute('aria-selected', k === i); });
    thumb.style.transform = 'translateX(' + i * 100 + '%)';
    card.style.setProperty('--acc', accs[s]);
    $$('.fs', form).forEach(function (f) { f.hidden = f.getAttribute('data-fs') !== s; });
  }
  ftabs.forEach(function (t) { t.addEventListener('click', function () { setForm(t.getAttribute('data-ft')); }); });
  $$('[data-go]').forEach(function (a) {
    a.addEventListener('click', function () {
      setForm(a.getAttribute('data-go'));
      var sub = a.getAttribute('data-sub');
      if (sub === 'Buying' || sub === 'Selling') form.querySelector('input[name=re_goal][value=' + sub + ']').checked = true;
      if (sub === 'Urgent') setTimeout(function () { $('#f-idate').focus({ preventScroll: true }); }, 1500);
    });
  });
  form.addEventListener('input', function (e) { var f = e.target.closest('.fl'); if (f) f.classList.remove('err'); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    ['f-name', 'f-phone', 'f-email'].forEach(function (id) {
      var el = D.getElementById(id), v = el.value.trim();
      var good = id === 'f-email' ? /^\S+@\S+\.\S+$/.test(v) : id === 'f-phone' ? v.replace(/\D/g, '').length >= 7 : v.length > 1;
      el.closest('.fl').classList.toggle('err', !good);
      if (!good && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;
    /* Production: POST to a Google Form "formResponse" URL (free; answers land in a Google Sheet). */
    $('.js-dname').textContent = ', ' + $('#f-name').value.trim().split(' ')[0];
    form.hidden = true; $('.ftabs').hidden = true; $('.done').hidden = false;
  });

  /* ---------------- 9. Mobile bar + CRO notes ---------------- */
  var mbar = $('.mbar');
  if ('IntersectionObserver' in window) {
    var past = false, atForm = false, upd = function () { mbar.classList.toggle('is-on', past && !atForm); };
    new IntersectionObserver(function (e) { past = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; upd(); }).observe($('#builder'));
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
      popShow('Every section has a job', 'Each tag explains why that section is there and why it sits where it does. Version B follows the same path to an inquiry as Version A, in a lighter, more modern style: understand → choose a service → why her → how it works → proof → inquire. Tap any tag to read its note.');
    } else pop.hidden = true;
  });
  $('.cro-pop__x').addEventListener('click', function () { pop.hidden = true; });

  /* ---------------- 10. Smooth anchors ---------------- */
  function go(id, cb) {
    var t = id === '#top' ? null : $(id);
    var y = t ? t.getBoundingClientRect().top + scrollY - 90 : 0;
    if (lenis) lenis.scrollTo(y, { duration: 1.4, onComplete: cb });
    else { scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }); if (cb) setTimeout(cb, 900); }
  }
  D.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    e.preventDefault(); go(id);
  });

  /* ---------------- 11. Motion ---------------- */
  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger || reduce) { H.classList.add('no-motion'); return; }
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.nav__pill', { y: -30, opacity: 0, duration: 1.2 })
      .from('.pill-tag, .hero__h > *, .hero__p, .builder, .hero__proof li', { y: 40, opacity: 0, duration: 1.3, stagger: .08 }, '<.1')
      .from('.stack', { clipPath: 'inset(100% 0 0 0 round 36px)', duration: 1.6, ease: 'expo.inOut' }, '<')
      .from('.float', { y: 30, opacity: 0, scale: .9, duration: 1.1, stagger: .12 }, '-=.6');
    gsap.to('.stack', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    $$('.head, .tabs, .panels, .b, .process__side, .founder__box, .rv, .contact__side, .formcard, .acc details, .cta__box, .ft__top').forEach(function (el) {
      gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    gsap.from('.founder__img img', { scale: 1.2, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.founder__box', start: 'top 80%', once: true } });
    gsap.from('.cta__h', { y: 50, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.cta__box', start: 'top 80%', once: true } });
    gsap.from('.ft__word', { yPercent: 60, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.ft', start: 'top 85%', once: true } });

    // stacking cards: earlier cards scale down as the next arrives
    var cards = $$('.card');
    cards.forEach(function (c, i) {
      if (i === cards.length - 1) return;
      gsap.to(c, { scale: .94 - (cards.length - i - 2) * .02, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top 85%', end: 'top 200px', scrub: true } });
    });

    $$('[data-count]').forEach(function (el) {
      var o = { v: 0 }, end = +el.getAttribute('data-count');
      gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true }, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
    ScrollTrigger.refresh();
  }

  /* ---------------- 12. Boot ---------------- */
  setForm('realestate');
  fillDetail();
  var initial = 'en';
  try { initial = localStorage.getItem('elb-lang') || 'en'; } catch (e) {}
  var qp = new URLSearchParams(location.search).get('lang'); if (qp === 'ht' || qp === 'en') initial = qp;
  if (initial !== 'en') setLang(initial, false);
  ticks[0].classList.add('is-on');
  if (D.readyState === 'complete') initMotion(); else addEventListener('load', initMotion);
})();
