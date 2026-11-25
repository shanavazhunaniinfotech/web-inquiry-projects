/* Ellevate Legacy V2: interactions */
(function () {
  'use strict';
  var D = document, H = D.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
  H.classList.add('js');
  var seen = H.classList.contains('seen');
  try { sessionStorage.setItem('el-seen', '1'); } catch (e) {}
  var lenis = null;
  function $(s, c) { return (c || D).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || D).querySelectorAll(s)); }

  /* =========================================================
     1. Bilingual (English from HTML, Kreyòl below)
     ========================================================= */
  var HT = {
    'skip':'Ale nan kontni an','nav.about':'Konsènan','nav.about2':'Konsènan Christelle','nav.re':'Imobilye','nav.int':'Entèpretasyon','nav.ev':'Evènman','nav.contact':'Kontak',
    'cta.book':'Pran Randevou','tb.area':'Massachusetts ak Florid',
    'hero.kicker':'Anrasinen nan Lafwa · Gide pa Sèvis','hero.h1':'Sèvis eksepsyonèl,','hero.h2':'yon touch pèsonèl.',
    'hero.lead':'Yon sèl non ou ka fè konfyans pou gwo moman lavi w: achte oswa vann yon kay nan Massachusetts ak Florid, fè moun konprann ou nèt an Kreyòl oswa an Angle, ak selebrasyon ki merite rete nan memwa.',
    'cta.free':'Pran yon Konsiltasyon Gratis','cta.callnow':'oswa rele','hero.t1':'Lisans nan MA ak FL','hero.t2':'Kreyòl ak Angle kouraman','hero.t3':'Repons pèsonèl nan 24è','hero.hint':'Chwazi yon pòt pou kòmanse',
    'door.re':'Imobilye, nan yon lòt nivo.','door.re.c':'Achte oswa vann yon kay','door.int':'Vwa w, Konprann.','door.int.c':'Rezève yon entèprèt','door.ev':'Moman ki merite selebre.','door.ev.c':'Planifye yon selebrasyon',
    'mf.k':'Byenvini nan Ellevate Legacy','mf.c':'Dekouvri twa sèvis yo',
    'mf.t':'Kote pwofesyonalis, objektif ak sèvis pèsonèl kontre. Kit w ap chèche yon {0} kay, kit w ap chèche bon mo yo {1} nan yon lòt lang, kit w ap planifye yon selebrasyon {2}, nou fè chak moman pi fasil, pi pèsonèl e pi siyifikatif.',
    're.h1':'Pwochen chapit ou,','re.h2':'avèk yon gid ki pran swen w.',
    're.p':'Kit se premye kay w ap achte, kit se yon pwopriyete fanmi w ap vann, kit w ap deplase ant Massachusetts ak Florid, w ap gen yon moun devoue ki koute w anvan, epi ki eksplike w chak etap, an Angle oswa an Kreyòl.',
    're.l1':'Premye achtè, depi pre-apwobasyon rive nan kle yo','re.l2':'Estrateji pou vann, pri ak prezantasyon','re.l3':'Deplasman MA ⇄ FL','re.buy':'M ap Achte','re.sell':'M ap Vann','re.search':'Chèche kay ki a vann','re.view':'Gade lis yo ↗',
    'int.h1':'Lè chak mo konte,','int.h2':'fè yo konprann ou nèt.',
    'int.p':'Entèpretasyon pwofesyonèl Kreyòl–Angle pou randevou ki chanje lavi w, avèk presizyon, diskresyon ak vrè swen.',
    'int.k1':'Entèvyou imigrasyon','int.k2':'Medikal','int.k3':'Legal ak avoka','int.k4':'Reyinyon lekòl','int.k5':'Siyati imobilye','int.cta':'Mande yon Entèprèt','int.cta2':'Randevou a pwòch?','int.live':'Entèpretasyon an dirèk',
    'ev.h1':'Selebrasyon,','ev.h2':'ki rete grave nan memwa.',
    'ev.p':'Soti nan ti rasanbleman entim rive nan gwo selebrasyon, planifikasyon pèsonèl ak kowòdinasyon jou a, pou ou ka viv moman an pandan nou okipe chak detay avèk gras.',
    'ev.check':'Verifye dat ou','ev.o1':'Maryaj','ev.o2':'Anivèsè espesyal','ev.o3':'Chower oswa fiyansay','ev.o4':'Anivèsè maryaj','ev.o5':'Batèm oswa kominyon','f.other':'Lòt','f.ev.type':'Kalite evènman','f.ev.date':'Dat evènman an','ev.go':'Verifye','ev.g1':'Maryaj','ev.g2':'Gwo fèt',
    'nb.1':'Eta nou sèvi<br>Massachusetts · Florid','nb.2':'Lang, kouraman<br>Kreyòl · Angle','nb.3':'Sèvis<br>yon sèl fanmi','nb.4':'Èdtan oswa mwens<br>pou yon repons pèsonèl',
    'df.k':'Diferans Ellevate','df.h1':'Nou kwè sèvis','df.h2':'dwe pèsonèl.',
    'df.1':'Entegrite','df.1p':'Bati relasyon sou onètete, respè ak konfyans.','df.2':'Ekselans','df.2p':'Bay atansyon sou ti detay ki fè diferans.',
    'df.3':'Pèsonalizasyon','df.3p':'Konprann chak kliyan ak chak okazyon inik.','df.4':'Objektif','df.4p':'Abòde chak opòtinite avèk entansyon ak swen.',
    'jr.k':'Pakou w','jr.h1':'Fasil pou kòmanse.','jr.h2':'Pèsonèl depi bonjou.',
    'jr.1':'Di nou sa w bezwen','jr.1p':'Chwazi sèvis ou epi reponn kèk ti kesyon rapid. Apeprè de minit.',
    'jr.2':'Yon konsiltasyon pèsonèl gratis','jr.2p':'Christelle ap kontakte w nan 24 èdtan pou l koute w, reponn kesyon w epi rekòmande pwochen etap yo.',
    'jr.3':'Nou leve eksperyans lan','jr.3p':'Depi premye rankont rive nan dènye detay, w ap jwenn sipò avèk swen, klète ak ekselans.',
    'ab.tag':'Foto w isit la','ab.k':'Yon Eritaj Bati sou Sèvis','ab.h1':'Bonjou, mwen se',
    'ab.q':'«Fason nou sèvi lòt moun enpòtan. Mwen pa vle sèlman satisfè atant ou. Mwen vle leve eksperyans ou pi wo.»',
    'ab.p':'Ellevate Legacy fèt pou bati relasyon ki gen sans epi bay yon sèvis ki kite yon mak ki dire. Kit m ap ede yon fanmi jwenn premye kay li, kit m kanpe bò kote yon moun nan yon randevou enpòtan, kit m ap bay yon selebrasyon lavi, m pote menm kè a bay chak kliyan.',
    'ab.cta':'Rankontre Christelle',
    'rv.k':'Bèl Pawòl',
    'rv.1':'«Christelle fè achte premye kay nou an vin kalm e klè. Li eksplike tout bagay de fwa, yon fwa an Angle, yon fwa an Kreyòl pou manman m.»',
    'rv.2':'«M te pè anpil pou entèvyou imigrasyon m nan. Christelle te prepare, pwofesyonèl e janti. Pou premye fwa, m santi yo vrèman konprann mwen.»',
    'rv.3':'«25yèm anivèsè maryaj nou an te bèl anpil. Chak detay te sanble ak nou, epi nou te jis jwi aswè a ak fanmi nou.»',
    'rv.note':'Temwayaj egzanp pou apèsi.',
    'cs.status':'Reponn li menm nan 24è','cs.h1':'Ann kòmanse','cs.h2':'pwochen chapit ou.',
    'cs.p':'Kèk ti kesyon rapid, epi Christelle ap kontakte w li menm an Angle oswa an Kreyòl. San angajman, san frè.',
    'cs.call':'Rele oswa voye tèks','cs.wa':'Ekri nenpòt lè','cs.a1':'Konsiltasyon gratis, san angajman','cs.a2':'Enfòmasyon w rete prive','cs.a3':'Anyen pou peye sou entènèt; n ap regle sa apre konfimasyon',
    'cf.step':'Etap','cf.of':'sou','cf.q1':'Kijan nou ka ede w?','cf.o1':'Achte, vann oswa deplase','cf.o2':'Kreyòl ⇄ Angle','cf.o3':'Planifye yon selebrasyon','cf.o4':'Pa sèten ankò','cf.o4s':'Ann pale sou sa',
    'cf.re.q':'M ap chèche…','cf.re.1':'Achte','cf.re.2':'Vann','cf.re.3':'Achte ak vann','cf.re.4':'Gade','cf.re.s':'Nan ki eta?','cf.both':'Toude','cf.re.t':'Delè','cf.t1':'0–3 mwa','cf.t2':'3–6 mwa','cf.t3':'6 mwa +',
    'cf.int.q':'Kalite randevou','cf.int.d':'Dat randevou a','cf.int.m':'Fòma','cf.inp':'An pèsòn','cf.rem':'Telefòn / videyo','cf.ev.g':'Envite','cf.oth':'Kisa w ap panse?','cf.next':'Kontinye',
    'cf.q3':'Kijan Christelle ka jwenn ou?','cf.name':'Non w','cf.phone':'Telefòn','cf.email':'Imèl','cf.pref':'Lang ak fason pou kontakte w','cf.v1':'Rele','cf.v2':'Tèks',
    'cf.send':'Mande Konsiltasyon Gratis Mwen','cf.fine':'Prive e an sekirite. Nou pa janm pataje enfòmasyon w.','cf.done1':'Mèsi',
    'cf.done2':'Demann ou rive kot Christelle. L ap kontakte w li menm nan 24 èdtan. Si se ijan, rele oswa voye tèks nan (617) 555-0142.','cf.donewa':'Kontinye sou WhatsApp',
    'fq.h1':'Kesyon,','fq.h2':'ak repons.','fq.ask':'Mande Christelle dirèkteman',
    'fq.q1':'Èske premye konsiltasyon an vrèman gratis?','fq.a1':'Wi. Premye konvèsasyon an gratis e san angajman. Se jis yon okazyon pou konprann bezwen w epi wè si nou fè ansanm.',
    'fq.q2':'Ki zòn nou sèvi pou imobilye?','fq.a2':'Kliyan rezidansyèl toupatou nan Massachusetts ak Florid, enkli fanmi k ap deplase ant de eta sa yo.',
    'fq.q3':'Èske nou fè entèpretasyon nan randevou imigrasyon?','fq.a3':'Wi. Entèpretasyon Kreyòl–Angle disponib pou kèk randevou ki gen rapò ak imigrasyon, ansanm ak randevou medikal, legal, lekòl ak pèsonèl. Mande nou pou randevou pa w la.',
    'fq.q4':'Konbyen tan davans mwen ta dwe rezève?','fq.a4':'Pou entèpretasyon, pi bonè posib. Ban nou dat la, n ap fè tout sa nou kapab menm si li prese. Pou evènman, 3 a 12 mwa davans se ideyal.',
    'fq.q5':'Kijan peman an fèt?','fq.a5':'Pa gen anyen pou peye sou entènèt. Pri ak peman ap regle avè w pèsonèlman yon fwa sèvis ou konfime.',
    'fn.h1':'Nou pa jis satisfè atant ou.','fn.h2':'Nou leve eksperyans lan pi wo.','fn.call':'Rele',
    'ft.s':'Sèvis','ft.r':'Kontakte Nou','ft.f':'Swiv nou','ft.l':'Lang','ft.rights':'Tout dwa rezève.','ft.eh':'Opòtinite Egal nan Lojman','ft.top':'Monte anlè','mb.c':'Konsiltasyon Gratis'
  };
  var Q2T = {
    en: { realestate:'Tell us about your move', interpretation:'Tell us about your appointment', events:'Tell us about your celebration', other:'Tell us a little more' },
    ht: { realestate:'Pale nou de pwojè kay ou', interpretation:'Pale nou de randevou w', events:'Pale nou de selebrasyon w', other:'Di nou yon ti kras plis' }
  };
  var q2Title = $('.js-q2t'); q2Title.removeAttribute('data-i18n');
  var inlines = $$('.manifesto__t .inl').map(function (n) { return n.outerHTML; });
  var nodes = $$('[data-i18n]');
  nodes.forEach(function (n) { n.__en = n.innerHTML; });
  var lang = 'en';

  function setLang(l, save) {
    lang = l;
    nodes.forEach(function (n) {
      var k = n.getAttribute('data-i18n'), v = HT[k];
      if (l === 'ht' && v) {
        if (k === 'mf.t') v = v.replace(/\{(\d)\}/g, function (_, i) { return inlines[i]; });
        n.innerHTML = v;
      } else n.innerHTML = n.__en;
    });
    H.lang = l;
    $$('.lang__b').forEach(function (b) { var on = b.getAttribute('data-lang') === l; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
    if (save) { try { localStorage.setItem('el-lang', l); } catch (e) {} }
    renderQ2();
    splitLit();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  $$('.lang__b').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); }); });

  /* =========================================================
     2. Scroll-lit text (word splitting, keeps inline images)
     ========================================================= */
  var litTriggers = [];
  function splitLit() {
    litTriggers.forEach(function (t) { t.kill(); }); litTriggers = [];
    $$('.js-lit').forEach(function (el) {
      var walker = D.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), tn, list = [];
      while ((tn = walker.nextNode())) list.push(tn);
      list.forEach(function (t) {
        if (!t.nodeValue.trim() || (t.parentNode.classList && t.parentNode.classList.contains('w'))) return;
        var frag = D.createDocumentFragment();
        t.nodeValue.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(D.createTextNode(part));
          else { var s = D.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); }
        });
        t.parentNode.replaceChild(frag, t);
      });
      var words = $$('.w, .inl', el);
      if (!window.ScrollTrigger || reduce) { words.forEach(function (w) { w.style.opacity = 1; }); return; }
      words.forEach(function (w) { if (w.classList.contains('inl')) w.style.opacity = .3; });
      litTriggers.push(ScrollTrigger.create({
        trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true,
        onUpdate: function (st) {
          var n = st.progress * words.length;
          for (var i = 0; i < words.length; i++) words[i].style.opacity = i < n ? 1 : (words[i].classList.contains('inl') ? .3 : .16);
        }
      }));
    });
  }

  /* =========================================================
     3. Header, menu, progress
     ========================================================= */
  var hd = $('.hd'), burger = $('.burger'), menu = $('#menu');
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    hd.classList.toggle('is-solid', y > 40);
    var hide = y > innerHeight && y > lastY + 4 && !D.body.classList.contains('menu-open');
    if (y < lastY - 4 || y < innerHeight) hd.classList.remove('is-hidden');
    else if (hide) hd.classList.add('is-hidden');
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  function toggleMenu(open) {
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open); menu.setAttribute('aria-hidden', !open);
    D.body.classList.toggle('menu-open', open);
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  burger.addEventListener('click', function () { toggleMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) toggleMenu(false); });
  D.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) toggleMenu(false); });
  $$('.menu__nav a').forEach(function (a) {
    a.addEventListener('mouseenter', function () {
      var m = a.getAttribute('data-m');
      $$('.menu__media img').forEach(function (i) { i.classList.toggle('is-on', i.getAttribute('data-m') === m); });
    });
  });

  /* =========================================================
     4. Cursor + magnetic buttons
     ========================================================= */
  if (finePointer && !reduce) {
    var cur = $('.cursor'), ring = $('.cursor__ring'), dot = $('.cursor__dot'), lab = $('.cursor__label');
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)'; }, { passive: true });
    (function loop() { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)'; requestAnimationFrame(loop); })();
    D.addEventListener('mouseover', function (e) {
      var c = e.target.closest('[data-cursor]');
      var l = e.target.closest('a,button,summary,label,select,input');
      cur.classList.toggle('is-label', !!c); lab.textContent = c ? c.getAttribute('data-cursor') : '';
      cur.classList.toggle('is-link', !c && !!l);
    });
    D.addEventListener('mouseleave', function () { cur.classList.add('is-hidden'); });
    D.addEventListener('mouseenter', function () { cur.classList.remove('is-hidden'); });
    $$('[data-magnetic]').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .25 + 'px,' + (e.clientY - r.top - r.height / 2) * .35 + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)'; b.style.transform = ''; setTimeout(function () { b.style.transition = ''; }, 600); });
    });
  }

  /* =========================================================
     5. Live interpretation demo
     ========================================================= */
  var liveBox = $('.js-live');
  var convo = [
    ['en', 'Officer · English', 'Please state your full name and date of birth.'],
    ['ht', 'Christelle · Kreyòl', 'Tanpri di non konplè w ak dat ou fèt.'],
    ['en', 'Doctor · English', 'Are you allergic to any medication?'],
    ['ht', 'Christelle · Kreyòl', 'Èske ou fè alèji ak kèk medikaman?'],
    ['en', 'Client · Kreyòl', '“Mwen gen kèk kesyon sou dokiman yo.”'],
    ['ht', 'Christelle · English', '“I have a few questions about the documents.”']
  ];
  var ci = 0;
  function addMsg() {
    if (!liveBox) return;
    var m = convo[ci % convo.length];
    var show = function () {
      var el = D.createElement('div'); el.className = 'msg msg--' + m[0];
      el.innerHTML = '<small>' + m[1] + '</small>' + m[2];
      liveBox.appendChild(el);
      while (liveBox.children.length > 3) liveBox.removeChild(liveBox.firstChild);
      ci++; setTimeout(addMsg, m[0] === 'en' ? 900 : 2400);
    };
    if (m[0] === 'ht') {
      var t = D.createElement('div'); t.className = 'msg msg--typing'; t.innerHTML = '<i></i><i></i><i></i>';
      liveBox.appendChild(t);
      while (liveBox.children.length > 3) liveBox.removeChild(liveBox.firstChild);
      setTimeout(function () { t.remove(); show(); }, 1300);
    } else show();
  }
  if (liveBox) {
    if (reduce) { convo.slice(0, 2).forEach(function (m) { liveBox.insertAdjacentHTML('beforeend', '<div class="msg msg--' + m[0] + '"><small>' + m[1] + '</small>' + m[2] + '</div>'); }); }
    else if ('IntersectionObserver' in window) {
      var lo = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { lo.disconnect(); addMsg(); } }); lo.observe(liveBox);
    } else addMsg();
  }

  /* =========================================================
     6. Concierge form
     ========================================================= */
  var form = $('#inquiry'), svc = form.service;
  var qs = $$('.q', form), fill = $('.cform__fill'), stepEl = $('.js-step');
  var current = '';
  function renderQ2() { q2Title.textContent = Q2T[lang][current || 'other']; }
  function go(n) {
    qs.forEach(function (q) { q.classList.toggle('is-on', q.getAttribute('data-q') == n); });
    if (n === 'done') { fill.style.width = '100%'; $('.cform__meta').style.visibility = 'hidden'; return; }
    fill.style.width = (n / 3 * 100) + '%'; stepEl.textContent = n;
  }
  function pick(s) {
    current = s; svc.value = s;
    $$('.opt', form).forEach(function (o) { o.classList.toggle('is-on', o.getAttribute('data-pick') === s); });
    $$('.svc', form).forEach(function (p) { p.hidden = p.getAttribute('data-svc') !== s; });
    renderQ2();
  }
  $$('.opt', form).forEach(function (o) { o.addEventListener('click', function () { pick(o.getAttribute('data-pick')); setTimeout(function () { go(2); }, 260); }); });
  $$('[data-back]', form).forEach(function (b) { b.addEventListener('click', function () { var on = $('.q.is-on', form); go(Math.max(1, +on.getAttribute('data-q') - 1)); }); });
  $('[data-next]', form).addEventListener('click', function () { go(3); });
  form.addEventListener('input', function (e) { var f = e.target.closest('.fld'); if (f) f.classList.remove('err'); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    ['f-name', 'f-phone', 'f-email'].forEach(function (id) {
      var el = D.getElementById(id), v = el.value.trim();
      var good = id === 'f-email' ? /^\S+@\S+\.\S+$/.test(v) : id === 'f-phone' ? v.replace(/\D/g, '').length >= 7 : v.length > 1;
      el.closest('.fld').classList.toggle('err', !good);
      if (!good && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;
    /* Production: POST to a Google Form "formResponse" URL (free; answers land in a Google Sheet). */
    $('.js-dname').textContent = ', ' + D.getElementById('f-name').value.trim().split(' ')[0];
    go('done');
  });
  function preselect(s, sub) {
    pick(s);
    if (sub === 'Selling' || sub === 'Buying') { var r = form.querySelector('input[name=re_goal][value=' + sub + ']'); if (r) r.checked = true; }
    go(2);
    if (sub === 'Urgent') setTimeout(function () { D.getElementById('f-idate').focus({ preventScroll: true }); }, 1400);
  }
  $$('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () { preselect(a.getAttribute('data-service'), a.getAttribute('data-sub')); });
  });
  $('#datecheck').addEventListener('submit', function (e) {
    e.preventDefault();
    var typeIdx = $('#dc-type').selectedIndex, date = $('#dc-date').value;
    preselect('events');
    var radios = $$('input[name=ev_type]', form); (radios[Math.min(typeIdx, radios.length - 1)] || radios[0]).checked = true;
    if (date) D.getElementById('f-edate').value = date;
    scrollToTarget('#concierge');
  });

  /* =========================================================
     7. Reviews slider
     ========================================================= */
  var slides = $$('.rslide'), ri = 0, rTimer, rbar = $('.rnav__bar b'), rcur = $('.js-rcur');
  function showR(i) {
    ri = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-on', k === ri); });
    rcur.textContent = '0' + (ri + 1);
    rbar.classList.remove('run'); void rbar.offsetWidth; if (!reduce) rbar.classList.add('run');
    clearTimeout(rTimer); if (!reduce) rTimer = setTimeout(function () { showR(ri + 1); }, 7000);
  }
  $$('.rnav__b').forEach(function (b) { b.addEventListener('click', function () { showR(ri + +b.getAttribute('data-dir')); }); });
  showR(0);

  /* =========================================================
     8. Difference: floating image
     ========================================================= */
  var flt = $('.diff__float'), fimg = flt.querySelector('img');
  if (finePointer) {
    var fx = 0, fy = 0, tx = 0, ty = 0, fOn = false;
    $$('.drow').forEach(function (r) {
      r.addEventListener('mouseenter', function () { fimg.src = r.getAttribute('data-img'); flt.classList.add('is-on'); fOn = true; });
      r.addEventListener('mouseleave', function () { flt.classList.remove('is-on'); fOn = false; });
    });
    addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function fl() { fx += (tx - fx) * .12; fy += (ty - fy) * .12; if (fOn || flt.classList.contains('is-on')) flt.style.left = fx + 'px', flt.style.top = fy + 'px'; requestAnimationFrame(fl); })();
  }

  /* =========================================================
     9. Mobile bar + CRO notes
     ========================================================= */
  var mbar = $('.mbar');
  if ('IntersectionObserver' in window) {
    var past = false, atForm = false, upd = function () { mbar.classList.toggle('is-on', past && !atForm); };
    new IntersectionObserver(function (e) { past = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; upd(); }).observe($('.hero__ctas'));
    new IntersectionObserver(function (e) { atForm = e[0].isIntersecting; upd(); }, { threshold: .1 }).observe($('#concierge'));
  }
  var croBtn = $('.cro-toggle'), pop = $('.cro-pop'), croEls = $$('[data-cro]');
  function popShow(t, d) { $('.cro-pop__t', pop).textContent = t; $('.cro-pop__d', pop).textContent = d; pop.hidden = false; }
  croBtn.addEventListener('click', function () {
    var on = !D.body.classList.contains('cro-on');
    D.body.classList.toggle('cro-on', on); croBtn.setAttribute('aria-pressed', on);
    $('.cro-toggle__txt', croBtn).textContent = on ? 'Hide layout notes' : 'Why this layout?';
    $$('.cro-pin').forEach(function (p) { p.remove(); });
    if (on) {
      croEls.forEach(function (el, i) {
        if (el.classList.contains('chapters')) return;
        var pin = D.createElement('button'); pin.type = 'button'; pin.className = 'cro-pin';
        pin.innerHTML = '<b>' + (i + 1) + '</b>' + el.getAttribute('data-cro-title');
        pin.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); popShow((i + 1) + '. ' + el.getAttribute('data-cro-title'), el.getAttribute('data-cro')); });
        (el.classList.contains('chapters') ? $('.ch--re') : el).appendChild(pin);
      });
      var chI = croEls.indexOf($('.chapters'));
      var chPin = D.createElement('button'); chPin.type = 'button'; chPin.className = 'cro-pin'; chPin.style.position = 'absolute';
      chPin.innerHTML = '<b>' + (chI + 1) + '</b>' + $('.chapters').getAttribute('data-cro-title');
      chPin.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); popShow((chI + 1) + '. ' + $('.chapters').getAttribute('data-cro-title'), $('.chapters').getAttribute('data-cro')); });
      $('.ch--re').appendChild(chPin);
      popShow('Every section has a job', 'Each gold tag explains why that section is there and why it sits where it does. The page follows the path a visitor takes before they get in touch: first impression and choosing a service, then brand story, the three services, why her, how it works, proof, and finally the concierge. Tap any tag to read its note.');
    } else pop.hidden = true;
  });
  $('.cro-pop__x').addEventListener('click', function () { pop.hidden = true; });

  /* =========================================================
     10. Anchor scrolling (aware of the horizontal chapters)
     ========================================================= */
  var hzST = null;
  function scrollToTarget(id) {
    var y;
    if (id === '#top') y = 0;
    else {
      var t = $(id); if (!t) return;
      var panelIdx = ['#real-estate', '#interpretation', '#events'].indexOf(id);
      if (hzST && panelIdx > -1) y = hzST.start + panelIdx * innerWidth + (panelIdx ? 2 : 0);
      else if (id === '#services' && hzST) y = hzST.start;
      else y = t.getBoundingClientRect().top + scrollY - (id === '#concierge' ? 0 : 60);
    }
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }
  D.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    e.preventDefault(); scrollToTarget(id);
  });

  /* =========================================================
     11. Motion (GSAP + Lenis)
     ========================================================= */
  function counters() {
    $$('[data-count]').forEach(function (el) {
      var end = +el.getAttribute('data-count');
      if (!window.gsap || reduce) return;
      var o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
  }

  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger || reduce) { H.classList.add('no-motion'); splitLit(); return; }
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // hero intro
    var d = seen ? .15 : 1.55;
    var tl = gsap.timeline({ delay: d, defaults: { ease: 'expo.out' } });
    tl.from('.hl__i', { yPercent: 115, duration: 1.6, stagger: .12 })
      .from('.hero__kicker', { opacity: 0, x: -20, duration: 1 }, '<.2')
      .from('.door', { clipPath: 'inset(100% 0% 0% 0% round 600px 600px 22px 22px)', duration: 1.6, stagger: .12, ease: 'expo.inOut', clearProps: 'clipPath' }, '<.1')
      .from('.door__img img', { scale: 1.5, duration: 2, stagger: .12, clearProps: 'transform' }, '<')
      .from('.hero__side > *', { opacity: 0, y: 24, duration: 1.1, stagger: .1 }, '<.5')
      .from('.seal', { scale: 0, rotate: -90, duration: 1.2, ease: 'back.out(1.6)' }, '<.3');

    // progress line
    gsap.to('.progress-line span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

    // hero parallax
    gsap.to('.hero__h', { yPercent: -30, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // marquee with scroll velocity
    var track = $('.mq__track'), mqX = 0, vel = 0;
    ScrollTrigger.create({ trigger: '.mq', start: 'top bottom', end: 'bottom top', onUpdate: function (s) { vel = s.getVelocity() / 300; } });
    gsap.ticker.add(function () {
      var w = track.scrollWidth / 2;
      mqX -= .6 + Math.min(Math.abs(vel), 14); vel *= .92;
      if (-mqX >= w) mqX += w;
      track.style.transform = 'translate3d(' + mqX + 'px,0,0)';
    });

    // horizontal chapters
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (min-height: 640px)', function () {
      H.classList.add('hz');
      var trackEl = $('.chapters__track'), panels = $$('.ch'), bars = $$('.ch-progress__bar b'), labels = $$('.ch-progress__i');
      var dist = function () { return trackEl.scrollWidth - innerWidth; };
      var tw = gsap.to(trackEl, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: {
          trigger: '.chapters__pin', pin: true, scrub: .8, start: 'top top', end: function () { return '+=' + dist(); }, invalidateOnRefresh: true,
          onUpdate: function (s) {
            var p = s.progress * (panels.length - 1);
            bars.forEach(function (b, i) { b.style.transform = 'scaleX(' + Math.max(0, Math.min(1, p - i)) + ')'; });
            labels.forEach(function (l, i) { l.classList.toggle('is-on', Math.round(p) === i); });
            hd.classList.toggle('is-dark', p < .5);
          },
          onLeave: function () { hd.classList.remove('is-dark'); }, onLeaveBack: function () { hd.classList.remove('is-dark'); }
        }
      });
      hzST = tw.scrollTrigger;
      panels.forEach(function (p, pi) {
        var img = $('.ch__arch img', p);
        if (pi === 0) { gsap.from($$('.ch__copy > *', p), { opacity: 0, y: 40, stagger: .07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.chapters', start: 'top 70%' } }); gsap.fromTo(img, { xPercent: 0 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left left', end: 'right left', scrub: true } }); return; }
        gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
        gsap.from($$('.ch__copy > *', p), { opacity: 0, y: 40, stagger: .07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left 65%', toggleActions: 'play none none reverse' } });
      });
      gsap.from('.polaroid', { y: 80, rotate: 0, opacity: 0, stagger: .15, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.ch--ev', containerAnimation: tw, start: 'left 60%' } });
      return function () { H.classList.remove('hz'); hzST = null; hd.classList.remove('is-dark'); };
    });
    mm.add('(max-width: 1023px), (max-height: 639px)', function () {
      $$('.ch').forEach(function (p) {
        gsap.from($$('.ch__copy > *', p), { opacity: 0, y: 40, stagger: .07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 75%' } });
        gsap.fromTo($('.ch__arch img', p), { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });

    // generic reveals
    $$('.kicker, .h2, .sec-head p, .manifesto__foot, .num, .drow, .jstep, .founder__copy > *, .acc details, .ft__grid > *, .cside > *, .cform').forEach(function (el) {
      if (el.closest('.hero') || el.closest('.ch')) return;
      gsap.from(el, { opacity: 0, y: 40, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    gsap.from('.journey__line', { clipPath: 'inset(0 100% 0 0)', ease: 'none', scrollTrigger: { trigger: '.journey__steps', start: 'top 80%', end: 'bottom 60%', scrub: true } });
    gsap.from('.founder__arch', { clipPath: 'inset(100% 0 0 0 round 600px 600px 24px 24px)', duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: '.founder', start: 'top 70%', once: true } });
    gsap.fromTo('.founder__arch img', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.founder', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.sig--big', { clipPath: 'inset(0 100% 0 0)', duration: 2, ease: 'power2.inOut', scrollTrigger: { trigger: '.sig--big', start: 'top 90%', once: true } });

    // final: arch opens to full screen
    gsap.fromTo('.final__mask', { clipPath: 'inset(12% 32% 12% 32% round 600px 600px 24px 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'none', scrollTrigger: { trigger: '.final', start: 'top 85%', end: 'top 10%', scrub: true } });
    gsap.fromTo('.final__mask img', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    gsap.from('.ft__word', { yPercent: 40, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.ft', start: 'top 70%', once: true } });

    counters();
    splitLit();
    ScrollTrigger.refresh();
  }

  /* =========================================================
     12. Boot
     ========================================================= */
  var initial = 'en';
  try { initial = localStorage.getItem('el-lang') || 'en'; } catch (e) {}
  var qp = new URLSearchParams(location.search).get('lang'); if (qp === 'ht' || qp === 'en') initial = qp;
  renderQ2();
  if (initial !== 'en') setLang(initial, false);
  setTimeout(function () { var l = $('.loader'); if (l) l.remove(); }, seen ? 0 : 2600);
  if (D.readyState === 'complete') initMotion(); else addEventListener('load', initMotion);
  setTimeout(function () { if (!window.gsap) { H.classList.add('no-motion'); splitLit(); } }, 5000);
})();
