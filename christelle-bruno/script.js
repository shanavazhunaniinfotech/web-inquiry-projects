/* Ellevate Legacy by Christelle — home page interactions */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     1. Language (English | Kreyòl)
     Kreyòl copy for the hero, services and values comes from the
     client's own brief. Other strings are drafts for her review.
  ------------------------------------------------------------ */
  var HT = {
    'skip': 'Ale nan kontni an',
    'top.msg': 'Nou sèvi Massachusetts ak Florida · Nou pale Anglè ak Kreyòl',
    'top.short': 'MA ak FL · Anglè ak Kreyòl',
    'nav.about': 'Rankontre Christelle', 'nav.re': 'Imobilye', 'nav.int': 'Entèpretasyon', 'nav.ev': 'Evènman', 'nav.contact': 'Kontakte Nou',
    'cta.inquiry': 'Kòmanse Demann Ou', 'cta.learn': 'Aprann plis', 'cta.search': 'Chèche Kay',
    'hero.eyebrow': 'Ellevate Legacy by Christelle',
    'hero.t1': 'Sèvis Eksepsyonèl.', 'hero.t2': 'Yon Atansyon Pèsonalize.',
    'hero.lead': 'Imobilye nan Massachusetts ak Florida, entèpretasyon ant kreyòl ayisyen ak anglè, ak planifikasyon evènman, tout avèk atansyon pèsonèl yon pwofesyonèl bileng ou ka fè konfyans.',
    'hero.q': 'Kisa ki mennen w isit la jodi a?',
    'hero.i1': 'Achte oswa vann yon kay', 'hero.i1s': 'MA ak FL',
    'hero.i2': 'Mande yon entèprèt', 'hero.i2s': 'Kreyòl ⇄ Anglè',
    'hero.i3': 'Planifye yon evènman', 'hero.i3s': 'Selebrasyon ak plis ankò',
    'hero.alt': 'Ou jis ap gade kay?', 'hero.altlink': 'Chèche kay nan MA oswa FL →',
    'trust.1': 'ane eksperyans nan sèvis kliyan, sèvis finansye ak konfòmite',
    'trust.2': 'Bileng nèt: Anglè ak Kreyòl Ayisyen',
    'trust.3': 'Imobilye nan Massachusetts ak Florida',
    'trust.4': 'Ou pa peye anyen pou fè yon demann.',
    'svc.eyebrow': 'Sèvis Nou yo',
    'svc.title': 'Twa Sèvis. <em>Yon Sèl Angajman</em> pou Ekselans.',
    'svc.sub': 'Chwazi kote ou vle kòmanse. Chak chemen mennen nan menm atansyon pèsonèl Christelle.',
    'svc.re.t': 'Imobilye, Nan Yon Pi Bon Nivo.',
    'svc.re.d': 'Kit w ap achte, vann, oswa eksplore pwochen opòtinite ou, w ap jwenn konsèy pèsonalize pandan tout pwosesis la. Nou sèvi Massachusetts ak Florida.',
    'svc.re.l1': 'Reprezantasyon achtè ak vandè', 'svc.re.l2': 'Resous pou demenaje ak lokasyon', 'svc.re.l3': 'Rechèch kay nan MA ak FL',
    'svc.re.cta': 'Mande yon Konsiltasyon',
    'svc.int.t': 'Vwa Ou. Istwa Ou. Konprann.',
    'svc.int.d': 'Entèpretasyon ant kreyòl ayisyen ak anglè pou moman enpòtan nan lavi, avèk pwofesyonalis, respè, ak atansyon.',
    'svc.int.l1': 'Randevou ki gen rapò ak imigrasyon', 'svc.int.l2': 'A distans oswa an pèsòn', 'svc.int.l3': 'Konfidansyèl ak san patipri',
    'svc.int.cta': 'Mande yon Entèprèt',
    'svc.ev.t': 'Moman Ki Merite Selebre.',
    'svc.ev.d': 'Soti nan ti rankont entim rive nan gwo selebrasyon, planifikasyon avèk swen ak bèl detay ki fè vizyon ou tounen reyalite.',
    'svc.ev.l1': 'Planifikasyon konplè oswa a la kat', 'svc.ev.l2': 'Kowòdinasyon machann ak sal', 'svc.ev.l3': 'Kowòdinasyon jou evènman an',
    'svc.ev.cta': 'Mande yon Pri pou Evènman',
    're.title': 'Pwochen adrès ou, <em>avèk swen.</em>',
    're.sub': 'Imobilye se plis pase yon tranzaksyon. Se jwenn bon opòtinite a, pran bon desizyon, epi santi w gen sipò pandan tout pwosesis la, kit se premye kay ou, yon vant, yon demenajman oswa yon envestisman.',
    're.s.loc': 'Vil oswa kòd postal', 're.s.price': 'Pri maksimòm', 're.s.beds': 'Chanm', 're.s.go': 'Chèche Kay',
    're.s.note': 'Gade lis kay yo lib, ou pa bezwen enskri. Kreye yon kont si ou vle sere kay ou renmen yo epi resevwa alèt.',
    're.ma': 'Chèche Kay nan MA', 're.fl': 'Chèche Kay nan FL',
    're.l1t': 'Achte', 're.l1': 'Rechèch kay, vizit, òf ak gid sou depans',
    're.l2t': 'Vann', 're.l2': 'Estrateji pri, preparasyon ak maketing',
    're.l3t': 'Demenajman', 're.l3': 'Resous lokal pou demenaje ant eta yo',
    're.l4t': 'Lokasyon', 're.l4': 'Resous pou lwe ak opsyon pou pwopriyetè',
    'calc.buy': 'M ap achte', 'calc.sell': 'M ap vann',
    'calc.buyT': 'Estime peman chak mwa ou', 'calc.price': 'Pri kay la', 'calc.down': 'Premye vèsman', 'calc.rate': 'To enterè',
    'calc.est': 'Peman chak mwa estime*', 'calc.pi': 'Kapital ak enterè', 'calc.tax': 'Taks', 'calc.ins': 'Asirans',
    'calc.sellT': 'Estime kòb ou ka resevwa', 'calc.sale': 'Pri vant ou espere', 'calc.payoff': 'Balans ipotèk', 'calc.costs': 'Frè vant (estime)',
    'calc.net': 'Kòb nèt estime*', 'calc.cta': 'Resevwa Detay Pèsonalize Mwen',
    'calc.fine': '*Se sèlman yon estimasyon ki baze sou chif ou mete yo. Se pa yon òf prè, yon evalyasyon, ni yon deklarasyon fèmen.',
    'int.title': 'Vwa ou. Istwa ou. <em>Konprann.</em>',
    'int.sub': 'Bon kominikasyon enpòtan anpil, sitou nan moman ki gen anpil enpòtans nan lavi. Christelle bay sèvis entèpretasyon ant kreyòl ayisyen ak anglè pou ou ka pale alèz epi yo konprann ou, avèk pwofesyonalis, netralite ak diskresyon.',
    'int.lbl': 'Ou ka mande entèpretasyon pou:',
    'int.c1': 'Entèvyou azil', 'int.c2': 'Entèvyou baze sou maryaj', 'int.c3': 'Ajisteman estati', 'int.c4': 'Lòt randevou imigrasyon', 'int.c5': 'Randevou pèsonèl ak administratif',
    'int.h1': 'Konfidansyèl ak prive', 'int.h2': 'San patipri ak egzak', 'int.h3': 'A distans oswa an pèsòn',
    'int.disc': 'Se entèpretasyon lang sèlman. Nou pa bay konsèy legal oswa konsèy sou imigrasyon, nou pa reprezante moun, ni prepare dokiman. Nou revize kondisyon randevou a anvan nou aksepte yon demann.',
    'ev.title': 'Moman ki merite <em>selebre.</em>',
    'ev.sub': 'Selebrasyon ki rete nan memwa se sa kote chak detay fèt avèk entansyon. Planifikasyon ak kowòdinasyon pèsonalize, avèk kreyativite, òganizasyon ak swen.',
    'ev.lbl': 'Kisa w ap selebre?',
    'ev.t1': 'Maryaj', 'ev.t2': 'Anivèsè nesans ak gwo etap', 'ev.t3': 'Bebi ak brayidal chower', 'ev.t4': 'Anivèsè maryaj', 'ev.t5': 'Lansman albòm ak konsè', 'ev.t6': 'Gala ak bankè', 'ev.t7': 'Antrepriz ak kominote',
    'ev.s1t': 'Sèvis Konplè', 'ev.s1': 'Soti nan lide a rive nan dènye tòs la',
    'ev.s2t': 'A la Kat', 'ev.s2': 'Jis èd ou bezwen an',
    'ev.s3t': 'Jou a Menm', 'ev.s3': 'Egzekisyon kalm epi san pwoblèm',
    'about.ph': 'Foto egzanp: pòtrè Christelle ap vin la',
    'about.badge': 'ane ap dirije ekip ak pwojè kliyan konplèks',
    'about.eyebrow': 'Rankontre Christelle',
    'about.title': 'Objektif. Pwofesyonalis. <em>Yon atansyon pèsonalize.</em>',
    'about.p1': 'Ellevate Legacy te fonde sou yon prensip senp: bon sèvis kòmanse lè nou konprann moun, respekte bezwen yo, epi trete chak entèraksyon avèk swen.',
    'about.p2': 'Christelle gen plis pase 12 ane eksperyans nan sèvis finansye, konsiltasyon, ak ankèt sou fwod finansye ak konfòmite, kote li te jere pwojè konplèks epi dirije gwo ekip. Eksperyans sa a ba li yon apwòch ki chita sou òganizasyon, diskresyon, responsabilite ak atansyon pou detay, menm valè li pote bay chak kliyan jodi a.',
    'val.1t': 'Entegrite', 'val.1': 'Onètete, respè ak konfyans.',
    'val.2t': 'Ekselans', 'val.2': 'Detay ki fè diferans.',
    'val.3t': 'Sèvis Pèsonalize', 'val.3': 'Chak kliyan ak chak okazyon diferan.',
    'val.4t': 'Objektif', 'val.4': 'Entansyon ak swen nan tout sa nou fè.',
    'about.q': '“Nou pa sèlman vle satisfè atant ou. Nou vle fè eksperyans ou vin pi bon toujou.”',
    'about.role': 'Fondatris, Ellevate Legacy',
    'steps.eyebrow': 'Senp epi Pèsonèl', 'steps.title': 'Kijan nou <em>kòmanse travay ansanm.</em>',
    'steps.1t': 'Pataje kèk detay', 'steps.1': 'Chwazi sèvis ou bezwen an epi di nou kisa ou vle. Sa pran apeprè de minit, san okenn angajman.',
    'steps.2t': 'Revizyon pèsonèl', 'steps.2': 'Christelle li demann ou li menm epi li kontakte w pou pale sou disponiblite, detay ak opsyon yo.',
    'steps.3t': 'Plan ou, konfime', 'steps.3': 'Lè nou dakò sou sèvis la, li konfime. Peman fèt apa, janm sou sit sa a.',
    'words.eyebrow': 'Bon Pawòl', 'words.title': 'Yon eritaj ki bati sou <em>sèvis.</em>',
    'words.1': '“Christelle fè premye acha kay nou an vin kalm epi klè. Li te eksplike nou chak etap e li te toujou disponib.”',
    'words.2': '“Pou yon randevou ki tèlman enpòtan, gen yon moun ki pwofesyonèl ak respektye konsa bò kote m te vle di anpil.”',
    'words.3': '“Chak detay nan dine anivèsè nou an te bèl. Nou te ka jwi pwòp selebrasyon nou.”',
    'words.note': 'Modèl paj. Temwayaj egzanp sa yo ap ranplase ak vrè temwayaj kliyan anvan lansman.',
    'form.eyebrow': 'Ann Konekte', 'form.title': 'Di nou kijan nou ka <em>ede w.</em>',
    'form.sub': 'Chwazi yon sèvis epi pataje kèk detay. Christelle ap revize demann ou li menm epi kontakte w pou pwochen etap yo.',
    'form.a1': 'Ou pa peye ni angaje w pou fè yon demann', 'form.a2': 'Enfòmasyon ou rete prive', 'form.a3': 'Nou reponn an Anglè oswa an Kreyòl, jan ou vle',
    'form.direct': 'Ou pito kontakte nou dirèkteman?',
    'f.name': 'Non konplè', 'f.email': 'Imèl', 'f.phone': 'Telefòn', 'f.pref': 'Kijan pou nou kontakte w',
    'f.pref1': 'Apèl telefòn', 'f.pref2': 'Mesaj tèks', 'f.pref3': 'Imèl',
    'f.re.leg': 'Detay imobilye', 'f.re.state': 'Eta ki enterese w', 'f.both': 'Toude', 'f.re.reason': 'Mwen enterese nan',
    'f.re.time': 'Delè', 'f.t1': 'Pi vit posib', 'f.t2': '1–3 mwa', 'f.t3': '3–6 mwa', 'f.t4': 'M ap jis gade',
    'f.re.budget': 'Bidjè oswa pri ou espere (opsyonèl)',
    'f.int.leg': 'Detay entèpretasyon', 'f.int.type': 'Kalite randevou', 'f.int.date': 'Dat randevou a', 'f.int.fmt': 'Fòma',
    'f.inperson': 'An pèsòn', 'f.remote': 'A distans',
    'f.int.warn': 'Tanpri pa mete nimewo dosye, A-number, nimewo paspò oswa Sekirite Sosyal, ni dokiman dosye nan fòm sa a.',
    'f.ev.leg': 'Detay evènman', 'f.ev.type': 'Kalite evènman', 'f.ev.date': 'Dat ou prefere', 'f.ev.guests': 'Kantite envite', 'f.ev.loc': 'Kote evènman an',
    'f.msg': 'Èske gen lòt bagay nou ta dwe konnen? (opsyonèl)',
    'f.consent': 'Mwen dakò pou yo kontakte m sou demann mwen an. Voye fòm nan pa konfime yon randevou.',
    'f.submit': 'Voye Demann Mwen', 'f.fine': 'Christelle li chak demann li menm. Peman fèt sèlman apre yon sèvis konfime.',
    'ok.t': 'Mèsi. Nou resevwa demann ou.', 'ok.p': 'Christelle ap revize detay ou yo li menm epi kontakte w pou pwochen etap yo. Se ta yon plezi pou nou sèvi ou.', 'ok.again': 'Voye yon lòt demann',
    'faq.title': 'Bon kesyon, <em>repons klè.</em>', 'faq.sub': 'Ou poko sèten? Voye yon demann. Mande pa koute anyen.',
    'faq.q1': 'Èske mwen peye pou voye yon demann?', 'faq.a1': 'Non. Demann yo gratis e san angajman. Nou pale sou pri lè Christelle fin konprann bezwen ou, e peman fèt apa apre sèvis la konfime.',
    'faq.q2': 'Ki zòn nou sèvi pou imobilye?', 'faq.a2': 'Massachusetts ak Florida, atravè afilyasyon kous Christelle nan chak eta. W ap demenaje ant de eta sa yo? Se egzakteman sa nou ka ede w fè.',
    'faq.q3': 'Èske m oblije enskri pou chèche kay?', 'faq.a3': 'Non. Ou ka gade lis ak detay kay yo lib. Yon kont gratis opsyonèl pèmèt ou sere kay ak rechèch ou renmen epi resevwa alèt pou nouvo kay ak chanjman pri.',
    'faq.q4': 'Èske nou bay konsèy legal oswa sou imigrasyon?', 'faq.a4': 'Non. Ellevate Interpretation Services bay entèpretasyon lang sèlman. Nou pa bay konsèy legal, reprezantasyon, ni prepare dokiman, epi nou revize kondisyon entèprèt chak randevou anvan nou aksepte.',
    'faq.q5': 'Èske entèpretasyon ka fèt a distans?', 'faq.a5': 'Wi. Gen opsyon a distans ak an pèsòn, selon randevou a, kote li ye, ak konfimasyon kondisyon yo.',
    'faq.q6': 'Konbyen tan davans pou m planifye evènman mwen?', 'faq.a6': 'Pi bonè pi bon, sitou pou maryaj ak gwo selebrasyon. Pataje dat ou epi n ap di w sa ki posib, menm kowòdinasyon jou a pou evènman ki pre.',
    'final.title': 'Se ta yon privilèj <em>pou nou sèvi ou.</em>',
    'final.sub': 'Sèvis eksepsyonèl. Yon atansyon pèsonalize. Rasin nou nan Lafwa. Se Sèvis ki Gide nou.',
    'ftr.tag': 'Sèvis Eksepsyonèl. Yon Atansyon Pèsonalize. Rasin nou nan Lafwa. Se Sèvis ki Gide nou.',
    'ftr.svc': 'Sèvis', 'ftr.explore': 'Eksplore', 'ftr.lang': 'Lang',
    'ftr.legal': 'Sèvis imobilye yo bay atravè afilyasyon kous ki gen lisans. Sèvis entèpretasyon limite a entèpretasyon lang epi yo pa gen ladan konsèy legal oswa reprezantasyon. Enfòmasyon sou kous ak lisans ap parèt isit la anvan piblikasyon.',
    'ftr.rights': 'Tout dwa rezève.',
    'toast.link': 'Lyen sa a ap ajoute lè kliyan an bay li.',
    'toast.search': 'Rechèch kay la ap konekte ak IDX/sit kous la nan vèsyon final la.',
    'err.req': 'Tanpri ranpli chan obligatwa yo.'
  };
  var EN_TOAST = {
    'toast.link': 'This link will be added once the final URL is confirmed.',
    'toast.search': 'In the live site this opens the integrated IDX search for ',
    'err.req': 'Please complete the highlighted fields.'
  };
  var original = new Map();
  var lang = 'en';
  function t(key) { return lang === 'ht' && HT[key] ? HT[key] : EN_TOAST[key] || ''; }

  function setLang(l, save) {
    lang = l === 'ht' ? 'ht' : 'en';
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (!original.has(el)) original.set(el, el.textContent);
      el.textContent = lang === 'ht' && HT[k] ? HT[k] : original.get(el);
    });
    $$('[data-i18n-html]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-html');
      if (!original.has(el)) original.set(el, el.innerHTML);
      el.innerHTML = lang === 'ht' && HT[k] ? HT[k] : original.get(el);
    });
    $$('.lang__btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on);
    });
    if (save) { try { localStorage.setItem('ellevate-lang', lang); } catch (e) {} }
  }
  $$('.lang__btn').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); });
  });
  var startLang = 'en';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    startLang = q || localStorage.getItem('ellevate-lang') || 'en';
  } catch (e) {}
  if (startLang === 'ht') setLang('ht');

  /* ------------------------------------------------------------
     2. Toast (for placeholder links)
  ------------------------------------------------------------ */
  var toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.setAttribute('role', 'status');
      toastEl.style.cssText = 'position:fixed;left:50%;bottom:100px;transform:translate(-50%,20px);z-index:150;max-width:min(92vw,440px);background:#072219;color:#F5F0E5;border:1px solid rgba(228,207,156,.45);padding:14px 18px;border-radius:14px;font-size:14px;line-height:1.45;box-shadow:0 20px 40px -16px rgba(0,0,0,.5);opacity:0;transition:opacity .3s,transform .3s;text-align:center';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(function () { toastEl.style.opacity = '1'; toastEl.style.transform = 'translate(-50%,0)'; });
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.style.opacity = '0'; toastEl.style.transform = 'translate(-50%,20px)'; }, 3200);
  }
  $$('[data-placeholder-link]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); toast(t('toast.link')); });
  });

  /* ------------------------------------------------------------
     3. Header, mobile nav, mobile sticky bar, active nav link
  ------------------------------------------------------------ */
  var hdr = $('.hdr'), mbar = $('.mbar');
  function onScroll() {
    var y = window.scrollY;
    hdr.classList.toggle('is-scrolled', y > 10);
    var formTop = $('#contact').getBoundingClientRect().top;
    mbar.classList.toggle('is-on', y > 500 && formTop > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = $('.burger'), mnav = $('#mnav');
  function closeNav() { burger.setAttribute('aria-expanded', 'false'); mnav.hidden = true; }
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); mnav.hidden = !open;
  });
  $$('a', mnav).forEach(function (a) { a.addEventListener('click', closeNav); });

  if ('IntersectionObserver' in window) {
    var navLinks = $$('.nav a');
    var spy = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'real-estate', 'interpretation', 'events', 'contact'].forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ------------------------------------------------------------
     4. Inquiry form: tabs, routing from every CTA, validation
  ------------------------------------------------------------ */
  var SERVICE = { re: 'Real Estate', int: 'Interpretation', ev: 'Events' };
  var form = $('#inq'), ok = $('.form__ok');
  function setTab(key) {
    if (!SERVICE[key]) return;
    $$('.form__tabs [role=tab]').forEach(function (b) {
      var on = b.getAttribute('data-tab') === key;
      b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on);
    });
    $$('.tabf').forEach(function (f) {
      var on = f.getAttribute('data-for') === key;
      f.classList.toggle('is-on', on); f.hidden = !on; f.disabled = !on;
    });
    form.elements.service.value = SERVICE[key];
  }
  $$('.form__tabs [role=tab]').forEach(function (b) { b.addEventListener('click', function () { setTab(b.getAttribute('data-tab')); }); });
  $$('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      setTab(a.getAttribute('data-service'));
      if (!form.hidden) setTimeout(function () { var n = form.elements.name; try { n.focus({ preventScroll: true }); } catch (e) {} }, 700);
    });
  });

  // Calculator CTA pre-selects buying / selling
  var calcCta = $('.calc .btn');
  calcCta.addEventListener('click', function () {
    var mode = $('.calc__tabs .is-on').getAttribute('data-calc');
    var r = form.querySelector('input[name=reason][value=' + (mode === 'sell' ? 'Selling' : 'Buying') + ']');
    if (r) r.checked = true;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [];
    ['name', 'email', 'phone'].forEach(function (n) {
      var el = form.elements[n], fld = el.closest('.fld');
      var invalid = !el.value.trim() || (n === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
      fld.classList.toggle('is-err', invalid);
      if (invalid) bad.push(el);
    });
    var c = form.elements.consent;
    c.closest('.consent').classList.toggle('is-err', !c.checked);
    if (!c.checked) bad.push(c);
    if (bad.length) { bad[0].focus(); toast(t('err.req')); return; }
    // Production: POST to Google Forms (formResponse) or Formspree here.
    form.hidden = true; $('.form__tabs').hidden = true; ok.hidden = false; ok.focus();
  });
  $$('input', form).forEach(function (i) { i.addEventListener('input', function () { var f = i.closest('.fld'); if (f) f.classList.remove('is-err'); }); });
  $('#okAgain').addEventListener('click', function () { form.reset(); form.hidden = false; $('.form__tabs').hidden = false; ok.hidden = true; setTab('re'); });

  /* ------------------------------------------------------------
     5. Property search (MA / FL)
  ------------------------------------------------------------ */
  var searchState = 'MA', locInput = $('#search input[name=loc]');
  $$('.search__tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      searchState = b.getAttribute('data-state');
      $$('.search__tabs button').forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', on); });
      locInput.placeholder = locInput.getAttribute(searchState === 'MA' ? 'data-ph-ma' : 'data-ph-fl');
    });
  });
  $('#search').addEventListener('submit', function (e) {
    e.preventDefault();
    var state = searchState === 'MA' ? 'Massachusetts (MLS PIN)' : 'Florida (Stellar MLS)';
    toast(lang === 'ht' ? t('toast.search') : t('toast.search') + state + '.');
  });

  /* ------------------------------------------------------------
     6. Buyer / seller estimators
  ------------------------------------------------------------ */
  var money = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  function fill(input) {
    var p = (input.value - input.min) / (input.max - input.min) * 100;
    input.style.setProperty('--p', p + '%');
  }
  function calcBuy() {
    var price = +$('#cPrice').value, down = +$('#cDown').value, rate = +$('#cRate').value;
    var loan = price * (1 - down / 100), r = rate / 100 / 12, n = 360;
    var pi = loan * r / (1 - Math.pow(1 + r, -n));
    var tax = price * 0.012 / 12, ins = price * 0.0045 / 12, total = pi + tax + ins;
    $('#oPrice').textContent = money(price);
    $('#oDown').textContent = down + '% · ' + money(price * down / 100);
    $('#oRate').textContent = rate.toFixed(rate % 1 ? 3 : 1).replace(/0+$/, '').replace(/\.$/, '') + '%';
    $('#oMonthly').textContent = money(total);
    $('#bPI').style.width = (pi / total * 100) + '%';
    $('#bTax').style.width = (tax / total * 100) + '%';
    $('#bIns').style.width = (ins / total * 100) + '%';
  }
  function calcSell() {
    var sale = +$('#cSale').value, pay = +$('#cPay').value, cost = +$('#cCost').value;
    $('#oSale').textContent = money(sale);
    $('#oPay').textContent = money(pay);
    $('#oCost').textContent = cost + '% · ' + money(sale * cost / 100);
    $('#oNet').textContent = money(Math.max(0, sale - pay - sale * cost / 100));
  }
  $$('.calc input[type=range]').forEach(function (i) {
    fill(i);
    i.addEventListener('input', function () { fill(i); calcBuy(); calcSell(); });
  });
  calcBuy(); calcSell();
  $$('.calc__tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-calc');
      $$('.calc__tabs button').forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', on); });
      $$('.calc__pane').forEach(function (p) { var on = p.getAttribute('data-pane') === k; p.hidden = !on; p.classList.toggle('is-on', on); });
    });
  });

  /* ------------------------------------------------------------
     7. Interpretation phrase card (rotating Kreyòl ⇄ English)
  ------------------------------------------------------------ */
  var phrases = [
    ['“Mwen la pou ede w.”', '“I\'m here to help you.”'],
    ['“Pran tan ou, pa gen prese.”', '“Take your time, there\'s no rush.”'],
    ['“Mwen konprann ou.”', '“I understand you.”'],
    ['“Ou ka poze tout kesyon ou.”', '“You can ask all your questions.”']
  ];
  var pi = 0, phrase = $('.phrase');
  if (!reduce) setInterval(function () {
    phrase.classList.add('is-swap');
    setTimeout(function () {
      pi = (pi + 1) % phrases.length;
      $('#phKr').textContent = phrases[pi][0]; $('#phEn').textContent = phrases[pi][1];
      phrase.classList.remove('is-swap');
    }, 400);
  }, 3600);

  /* ------------------------------------------------------------
     8. Event type chips → pre-fill the event form
  ------------------------------------------------------------ */
  $$('.ev__types button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.ev__types button').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
      $('#evType').value = b.getAttribute('data-ev');
    });
  });
  $('#evCta').addEventListener('click', function () {
    var on = $('.ev__types .is-on'); if (on) $('#evType').value = on.getAttribute('data-ev');
  });

  /* ------------------------------------------------------------
     9. Design notes drawer ("Why this layout?")
  ------------------------------------------------------------ */
  var NOTES = [
    ['hero', 'Hero: brand promise + "What brings you here?"', 'Visitors arrive with one of three very different needs. Instead of a generic "Learn more" button, the hero asks one question and gives three one-tap answers. Each answer opens the matching inquiry form with the right service already selected, so a visitor is two clicks from contacting Christelle. Real-estate browsers get their own shortcut straight to property search.'],
    ['hero', 'Trust bar right under the hero', 'The first worry of a new visitor is "Can I trust her?". 12+ years of experience, bilingual service, the two states served and "no payment to inquire" answer that before they scroll. All four facts come from the brief, so nothing is invented.'],
    ['services', 'Three services, one parent brand', 'Same card layout and gold arch keep the parent brand unified; each division gets its own accent (emerald, deep teal, rosewood) so it still feels like its own identity, as requested. Every card has its own primary CTA, so no visitor has to hunt for the next step.'],
    ['re', 'Real estate first, with search above the fold of the section', 'Real estate is the highest-value service and the one with repeat search traffic. Search is placed first, with a clear "no sign-up required" note (her stated IDX goal), plus direct MA / FL brokerage links.'],
    ['calc', 'Buyer & seller estimator = lead magnet', 'Calculators keep visitors engaged and lead naturally to "Get my personalized breakdown", which pre-selects Buying or Selling in the form. This was listed as a Phase 2 idea in her brief, so we show it now to demonstrate value. Includes the estimate disclaimer she asked for.'],
    ['int', 'Interpretation: calm, private, clearly scoped', 'A darker, quieter section signals discretion. Appointment types are listed exactly as in her brief so the right people recognise themselves. The rotating Kreyòl ⇄ English card shows the service in action. Her "interpretation only, not legal advice" disclaimer is visible here, which builds trust instead of hiding the limits.'],
    ['ev', 'Events: pick what you\'re celebrating', 'Tappable event types make the section interactive. The one chosen is carried into the event inquiry form, which cuts form effort. Three service levels (full-service, à la carte, day-of) help every budget see a fit.'],
    ['about', 'Meet Christelle after the services', 'Once visitors know what is offered, they want to know who. Her compliance and leadership background is the differentiator: it proves organisation and discretion. Values from her brief and her signature line close the section.'],
    ['steps', '3-step "how it works"', 'Removes the fear of commitment: share details, personal review, confirmed plan. It also states that no payment is taken on the website, which is how she wants to work.'],
    ['words', 'Review section (placeholder)', 'Social proof is one of the strongest conversion drivers. Her brief says not to publish unverified testimonials, so these are clearly marked as samples and will be swapped for real reviews (for example from her Google Business Profile) before launch.'],
    ['form', 'One form, three tabs (Google Forms ready)', 'Separate fields per service as in her form spec, but in one place so nobody gets lost. Every CTA on the page opens the right tab. Short first step (name, email, phone), sensitive-data warning for interpretation, consent line and no-booking note from her brief. Can post straight to Google Forms, so no monthly fees.'],
    ['faq', 'FAQ = objection handling', 'Answers the questions that stop people from inquiring: cost, areas, whether they must register, legal advice limits, remote interpretation, event lead time. Each answer ends near a CTA.'],
    ['final', 'Closing CTA + sticky actions', 'A final, emotional close ("It would be a privilege to serve you") with two clear actions. On mobile a sticky bar keeps "Search Homes" and "Start Your Inquiry" one tap away throughout the page. EN | Kreyòl is in the top bar and footer and is remembered on return visits.']
  ];
  var list = $('#notesList');
  NOTES.forEach(function (n) {
    var li = document.createElement('li');
    var b = document.createElement('button'); b.type = 'button'; b.textContent = n[1];
    var p = document.createElement('p'); p.textContent = n[2];
    b.addEventListener('click', function () {
      var target = document.querySelector('[data-note="' + n[0] + '"]');
      closeNotes();
      if (target) {
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        target.classList.remove('flash'); void target.offsetWidth; target.classList.add('flash');
      }
    });
    li.appendChild(b); li.appendChild(p); list.appendChild(li);
  });
  var notes = $('#notes'), nBtn = $('.notes-btn'), scrim = $('.scrim');
  function openNotes() { notes.classList.add('is-open'); notes.setAttribute('aria-hidden', 'false'); nBtn.setAttribute('aria-expanded', 'true'); scrim.hidden = false; $('.notes__x').focus(); }
  function closeNotes() { notes.classList.remove('is-open'); notes.setAttribute('aria-hidden', 'true'); nBtn.setAttribute('aria-expanded', 'false'); scrim.hidden = true; }
  nBtn.addEventListener('click', openNotes);
  $('.notes__x').addEventListener('click', function () { closeNotes(); nBtn.focus(); });
  scrim.addEventListener('click', closeNotes);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (notes.classList.contains('is-open')) { closeNotes(); nBtn.focus(); } closeNav(); }
  });

  /* ------------------------------------------------------------
     10. Reveal on scroll + hero intro (GSAP when available)
  ------------------------------------------------------------ */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(function (el, i) { el.style.transitionDelay = (el.parentElement.children.length > 1 ? (Array.prototype.indexOf.call(el.parentElement.children, el) % 4) * 0.08 : 0) + 's'; io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  function loaded() {
    document.documentElement.classList.add('is-loaded');
    var g = window.gsap;
    if (!g || reduce) return;
    if (window.ScrollTrigger) g.registerPlugin(window.ScrollTrigger);
    var tl = g.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero__title .ln > *', { yPercent: 110, duration: 1.2, stagger: 0.12 }, 0.35)
      .from('.hero .eyebrow, .hero__lead', { opacity: 0, y: 20, duration: 1, stagger: 0.1 }, 0.5)
      .from('.intent', { opacity: 0, y: 30, duration: 1 }, 0.75)
      .from('.arch', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, stagger: 0.15, ease: 'power4.out' }, 0.4)
      .from('.seal', { scale: 0, opacity: 0, duration: 1, ease: 'back.out(1.6)' }, 1.1)
      .from('.trust li', { opacity: 0, y: 20, duration: 0.8, stagger: 0.08 }, 0.9);
    if (window.ScrollTrigger) {
      g.to('.arch--main img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      g.to('.arch--a', { y: -40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      g.to('.arch--b', { y: -70, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      g.utils.toArray('.ev__mosaic img, .int__photo img, .about__photo img').forEach(function (img) {
        g.fromTo(img, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    }
  }
  // Reveal after the monogram draws (~1.2s); don't wait for every image to load.
  setTimeout(loaded, 1250);

  $('#yr').textContent = new Date().getFullYear();
})();
