/* Ellevate Legacy: homepage interactions */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.add('js');

  /* ------------------------------------------------------------------
     1. Bilingual: English (from the HTML) | Kreyòl (dictionary below)
     ------------------------------------------------------------------ */
  var HT = {
    'skip':'Ale nan kontni an',
    'tb.area':'Nou sèvi Massachusetts ak Florid',
    'tb.lang':'Nou pale Angle ak Kreyòl',
    'nav.home':'Akèy','nav.about':'Konsènan Christelle','nav.re':'Imobilye','nav.int':'Entèpretasyon','nav.ev':'Evènman','nav.contact':'Kontak',
    'cta.consult':'Konsiltasyon Gratis','cta.consult2':'Pran yon Konsiltasyon Gratis','cta.explore':'Dekouvri Sèvis Nou yo',
    'hero.eyebrow':'Anrasinen nan Lafwa. Gide pa Sèvis.',
    'hero.t1':'Sèvis Eksepsyonèl.','hero.t2':'Yon Touch Pèsonèl.',
    'hero.lead':'Imobilye nan Massachusetts ak Florid, entèpretasyon Kreyòl–Angle, ak selebrasyon ou p ap janm bliye. Yon sèl non ou ka fè konfyans, k ap akonpaye w nan gwo moman lavi w.',
    'hero.p1':'Imobilye ak lisans','hero.p2':'Entèpretasyon pwofesyonèl','hero.p3':'Repons pèsonèl',
    'router.t':'Kijan nou ka ede w jodi a?',
    'router.re':'Achte oswa vann yon kay','router.re.s':'Massachusetts ak Florid',
    'router.int':'Rezève yon entèprèt','router.int.s':'Kreyòl ⇄ Angle',
    'router.ev':'Planifye yon selebrasyon','router.ev.s':'Maryaj, anivèsè ak plis ankò',
    'router.note':'Gratis, san angajman. Christelle reponn ou li menm.',
    'sv.eyebrow':'Byenvini nan Ellevate Legacy','sv.t1':'Twa Sèvis.','sv.t2':'Yon Sèl Angajman pou Ekselans.',
    'sv.lead':'Kit w ap pran yon desizyon nan imobilye, kit ou bezwen èd pou kominike nan yon lòt lang, kit w ap planifye yon okazyon espesyal, nou la pou fè eksperyans lan pi fasil, pi pèsonèl, e pi siyifikatif.',
    'd1.t':'Imobilye, nan yon lòt nivo.','d1.p':'Kit w ap achte, vann, oswa chèche pwochen opòtinite w, w ap jwenn konsèy pèsonèl ak bon jan atansyon pandan tout pakou imobilye w.','d1.tag':'Massachusetts ak Florid','d1.cta':'Dekouvri Imobilye',
    'd2.t':'Vwa w. Istwa w. Konprann.','d2.p':'Bon kominikasyon enpòtan, sitou nan gwo moman lavi a. Entèpretasyon Kreyòl–Angle ki kraze baryè lang avèk pwofesyonalis, swen, ak respè.','d2.tag':'Enkli randevou imigrasyon','d2.cta':'Dekouvri Entèpretasyon',
    'd3.t':'Moman ki merite selebre.','d3.p':'Soti nan ti rasanbleman entim rive nan gwo selebrasyon, yon planifikasyon byen panse ak atansyon sou chak detay ap ede reyalize vizyon ou.','d3.tag':'Maryaj, anivèsè, beby chower ak plis ankò','d3.cta':'Dekouvri Evènman',
    're.t1':'Pwochen chapit ou,','re.t2':'avèk yon gid ki pran swen w.',
    're.lead':'Kit se premye kay w ap achte, kit se yon pwopriyete fanmi w ap vann, kit w ap deplase ant Massachusetts ak Florid, w ap gen yon moun devoue ki koute w anvan, epi ki eksplike w chak etap, an Angle oswa an Kreyòl.',
    're.c1':'Gid pou moun k ap achte premye kay, depi pre-apwobasyon rive nan kle yo','re.c2':'Estrateji pou vann, pri ak prezantasyon','re.c3':'Deplasman ant Massachusetts ak Florid','re.c4':'Chak dokiman eksplike nan lang ou',
    're.buy':'M ap Achte','re.sell':'M ap Vann','re.search':'Chèche kay ki a vann','re.ma.s':'Chèche pwopriyete nan','re.go':'Gade lis yo',
    're.note':'Lyen yo ouvri paj rechèch kabinè Christelle la nan yon nouvo onglè.',
    'int.t1':'Lè chak mo konte,','int.t2':'fè yo konprann ou nèt.',
    'int.lead':'Entèpretasyon pwofesyonèl Kreyòl–Angle pou randevou ki chanje lavi w, avèk presizyon, diskresyon, ak vrè swen.',
    'int.k1':'Entèvyou imigrasyon','int.k2':'Randevou medikal','int.k3':'Reyinyon legal ak avoka','int.k4':'Reyinyon lekòl ak paran','int.k5':'Siyati tranzaksyon imobilye','int.k6':'Evènman fanmi ak kominote',
    'int.tr1':'Konfidansyèl','int.tr1s':'Istwa w rete prive','int.tr2':'Prepare','int.tr2s':'Nou revize tèm yo davans','int.tr3':'Fleksib','int.tr3s':'An pèsòn oswa a distans',
    'int.cta':'Mande yon Entèprèt','int.cta2':'Randevou a pwòch? Ban nou dat la',
    'ev.t1':'Selebrasyon','ev.t2':'ki rete grave nan memwa.',
    'ev.lead':'Planifikasyon pèsonèl ak kowòdinasyon jou a pou moman w ap chéri yo, konsa ou ka viv moman an pandan nou okipe chak detay avèk gras.',
    'ev.cta':'Verifye Dat Mwen','ev.g1':'Maryaj','ev.g2':'Resepsyon ak dine','ev.g3':'Anivèsè espesyal','ev.g4':'Chower ak fiyansay',
    'ev.l1':'Maryaj ak renouvèlman ve','ev.l2':'Beby chower ak chower lamarye','ev.l3':'Anivèsè espesyal','ev.l4':'Batèm ak premye kominyon','ev.l5':'Anivèsè maryaj','ev.l6':'Evènman legliz ak kominote',
    'df.eyebrow':'Diferans Ellevate','df.t1':'Nan Ellevate Legacy, nou kwè','df.t2':'sèvis dwe pèsonèl.',
    'df.1':'Entegrite','df.1p':'Bati relasyon sou onètete, respè, ak konfyans.',
    'df.2':'Ekselans','df.2p':'Bay atansyon sou ti detay ki fè diferans.',
    'df.3':'Pèsonalizasyon','df.3p':'Konprann chak kliyan ak chak okazyon inik.',
    'df.4':'Objektif','df.4p':'Abòde chak opòtinite avèk entansyon ak swen.',
    'pr.eyebrow':'Kijan Sa Mache','pr.t1':'Fasil pou kòmanse.','pr.t2':'Pèsonèl depi premye bonjou a.',
    'pr.1':'Di nou sa w bezwen','pr.1p':'Chwazi sèvis ou epi pataje kèk detay. Sa pran apeprè de minit.',
    'pr.2':'Konsiltasyon pèsonèl gratis','pr.2p':'Christelle ap kontakte w nan 24 èdtan pou l koute w, reponn kesyon w, epi rekòmande pwochen etap yo.',
    'pr.3':'Nou leve eksperyans lan','pr.3p':'Depi premye rankont rive nan dènye detay, w ap jwenn sipò avèk swen, klète, ak ekselans.',
    'ab.badge':'Foto w isit la','ab.eyebrow':'Yon Eritaj Bati sou Sèvis','ab.t1':'Bonjou, mwen se',
    'ab.p1':'Ellevate Legacy fèt sou yon kwayans: fason nou sèvi lòt moun enpòtan. Objektif mwen se bati relasyon ki gen sans, kreye bèl eksperyans, epi bay yon sèvis ki kite yon mak ki dire.',
    'ab.p2':'Kit m ap ede yon fanmi jwenn premye kay li, kit m kanpe bò kote yon moun nan yon randevou enpòtan, kit m ap bay yon selebrasyon lavi, m pote menm kè a bay chak kliyan, anrasinen nan lafwa e gide pa sèvis.',
    'ab.q':'«Nou pa vle sèlman satisfè atant ou. Nou vle leve eksperyans lan pi wo.»',
    'ab.f1':'Eta nou sèvi','ab.f2':'Lang nou pale byen','ab.f3':'Sèvis, yon sèl estanda',
    'rv.eyebrow':'Bèl Pawòl','rv.t1':'Moun fè nou konfyans','rv.t2':'nan moman enpòtan lavi yo.',
    'rv.1':'«Christelle fè achte premye kay nou an vin kalm e klè. Li eksplike tout bagay de fwa, yon fwa an Angle, yon fwa an Kreyòl pou manman m.»',
    'rv.2':'«Pou entèvyou imigrasyon m nan, m te pè anpil. Christelle te prepare, pwofesyonèl e janti. Pou premye fwa, m santi yo konprann mwen.»',
    'rv.3':'«25yèm anivèsè maryaj nou an te bèl anpil. Chak detay te sanble ak nou. Nou te jis jwi aswè a ak fanmi nou.»',
    'rv.note':'Temwayaj egzanp pou apèsi.',
    'ct.eyebrow':'Kontakte Nou','ct.t1':'Ann kòmanse','ct.t2':'pwochen chapit ou.',
    'ct.lead':'Di nou yon ti kras sou sa w bezwen. Christelle reponn ou li menm nan 24 èdtan, an Angle oswa an Kreyòl.',
    'ct.call':'Rele oswa voye tèks','ct.wa':'Ekri nou nenpòt lè',
    'ct.a1':'Konsiltasyon gratis, san angajman','ct.a2':'Enfòmasyon w rete prive','ct.a3':'Peman fèt sèlman apre sèvis ou konfime',
    'f.tab1':'Imobilye','f.tab2':'Entèpretasyon','f.tab3':'Evènman','f.step':'Etap',
    'f.s1':'Premye bagay, kijan nou ka jwenn ou?','f.name':'Non konplè','f.phone':'Telefòn','f.email':'Imèl','f.pref':'Lang ou prefere','f.next':'Kontinye',
    'f.s2':'Kèk detay','f.re.q':'M ap chèche…','f.re.1':'Achte','f.re.2':'Vann','f.re.3':'Achte ak vann','f.re.4':'M ap jis gade',
    'f.re.state':'Eta','f.re.both':'Toude / deplase','f.re.time':'Delè','f.t1':'0–3 mwa','f.t2':'3–6 mwa','f.t3':'6 mwa oswa plis',
    'f.int.type':'Kalite randevou','f.other':'Lòt','f.int.date':'Dat randevou a','f.int.mode':'Fòma','f.inperson':'An pèsòn','f.remote':'Telefòn / videyo',
    'f.ev.type':'Kalite evènman','f.ev.date':'Dat evènman an','f.ev.guests':'Envite',
    'f.msg':'Èske gen lòt bagay nou ta dwe konnen? (opsyonèl)','f.back':'Retounen','f.send':'Mande Konsiltasyon Gratis Mwen',
    'f.done':'Mèsi! Nou resevwa demann ou.','f.done.p':'Christelle ap kontakte w li menm nan 24 èdtan. Si se ijan, rele oswa voye tèks nan (617) 555-0142.',
    'f.fine':'Prive e an sekirite. Nou pa janm pataje enfòmasyon w.',
    'fq.t1':'Kesyon,','fq.t2':'ak repons.','fq.lead':'Ou toujou gen kesyon? Voye yon mesaj, Christelle ap reponn ou li menm.','fq.ask':'Poze yon kesyon',
    'fq.q1':'Èske premye konsiltasyon an vrèman gratis?','fq.a1':'Wi. Premye konvèsasyon an gratis e san angajman. Se jis yon okazyon pou konprann bezwen w epi wè si nou fè ansanm.',
    'fq.q2':'Ki zòn nou sèvi pou imobilye?','fq.a2':'Kliyan rezidansyèl toupatou nan Massachusetts ak Florid, enkli fanmi k ap deplase ant de eta sa yo.',
    'fq.q3':'Èske nou fè entèpretasyon nan randevou imigrasyon?','fq.a3':'Wi, entèpretasyon Kreyòl–Angle disponib pou kèk randevou ki gen rapò ak imigrasyon, ansanm ak randevou medikal, legal, lekòl ak pèsonèl. Mande nou pou randevou pa w la.',
    'fq.q4':'Konbyen tan davans mwen ta dwe rezève?','fq.a4':'Pou entèpretasyon, pi bonè posib. Ban nou dat la, n ap fè tout sa nou kapab menm si li prese. Pou evènman, 3 a 12 mwa davans se ideyal.',
    'fq.q5':'Kijan peman an fèt?','fq.a5':'Pa gen anyen pou peye sou entènèt. Pri ak peman ap regle avè w pèsonèlman yon fwa sèvis ou konfime.',
    'fn.t1':'Nou pa jis satisfè atant ou.','fn.t2':'Nou leve eksperyans lan pi wo.','fn.call':'Rele',
    'ft.p':'Sèvis Eksepsyonèl. Yon Touch Pèsonèl. Anrasinen nan Lafwa. Gide pa Sèvis.',
    'ft.s':'Sèvis','ft.c':'Konpayi','ft.r':'Kontakte Nou','ft.rights':'Tout dwa rezève.','ft.eh':'Opòtinite Egal nan Lojman',
    'mb.inq':'Konsiltasyon Gratis'
  };
  var nodes = document.querySelectorAll('[data-i18n]');
  nodes.forEach(function (n) { n.__en = n.innerHTML; });
  var lang = 'en';

  function setLang(l, save) {
    lang = l;
    nodes.forEach(function (n) {
      var k = n.getAttribute('data-i18n');
      n.innerHTML = (l === 'ht' && HT[k]) ? HT[k] : n.__en;
    });
    doc.lang = l === 'ht' ? 'ht' : 'en';
    document.querySelectorAll('.lang__btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === l;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on);
    });
    if (save) { try { localStorage.setItem('ellevate-lang', l); } catch (e) {} }
    moveInk();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  document.querySelectorAll('.lang__btn').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); });
  });
  var initial = 'en';
  try { initial = localStorage.getItem('ellevate-lang') || 'en'; } catch (e) {}
  var qp = new URLSearchParams(location.search).get('lang');
  if (qp === 'ht' || qp === 'en') initial = qp;

  /* ------------------------------------------------------------------
     2. Header, drawer, active nav
     ------------------------------------------------------------------ */
  var header = document.querySelector('.header');
  var burger = document.querySelector('.burger');
  var drawer = document.getElementById('drawer');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  function toggleMenu(open) {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', !open);
    document.body.classList.toggle('menu-open', open);
    if (lenis) { open ? lenis.stop() : lenis.start(); }
  }
  burger.addEventListener('click', function () { toggleMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  drawer.addEventListener('click', function (e) { if (e.target.closest('a')) toggleMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('is-open')) toggleMenu(false); });

  var navLinks = document.querySelectorAll('.nav a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id === 'services' ? 'top' : en.target.id;
        navLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['top', 'services', 'real-estate', 'interpretation', 'events', 'about', 'contact'].forEach(function (id) {
      var el = document.getElementById(id); if (el) io.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     3. Smart inquiry form (tabs per service, 2 steps)
     ------------------------------------------------------------------ */
  var form = document.getElementById('inquiry');
  var tabs = document.querySelectorAll('.tab');
  var ink = document.querySelector('.tabs__ink');
  var inkColors = { realestate: '#0B2E24', interpretation: '#2C4A63', events: '#B9826F' };
  var current = 'realestate';

  function moveInk() {
    var i = ['realestate', 'interpretation', 'events'].indexOf(current);
    ink.style.transform = 'translateX(' + (i * 100) + '%)';
    ink.style.background = inkColors[current];
  }
  function setService(s) {
    current = s;
    form.service.value = s;
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === s;
      t.classList.toggle('is-active', on); t.setAttribute('aria-selected', on);
    });
    form.querySelectorAll('.svc').forEach(function (p) { p.hidden = p.getAttribute('data-svc') !== s; });
    moveInk();
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { setService(t.getAttribute('data-tab')); }); });

  // any button with data-service pre-selects the matching form
  document.querySelectorAll('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      setService(a.getAttribute('data-service'));
      var sub = a.getAttribute('data-sub');
      if (sub === 'Selling') { var r = form.querySelector('input[name="re_goal"][value="Selling"]'); if (r) r.checked = true; }
      if (sub === 'Urgent') form.__focusDate = true;
      if (!a.getAttribute('data-sub')) { var b = form.querySelector('input[name="re_goal"][value="Buying"]'); if (b && a.getAttribute('data-service') === 'realestate' && a.closest('.feature--re')) b.checked = true; }
      setTimeout(function () { var f = document.getElementById('f-name'); if (f && window.innerWidth > 860) f.focus({ preventScroll: true }); }, 900);
    });
  });

  var steps = form.querySelectorAll('.fstep');
  var bar = form.querySelector('.progress__bar');
  var stepNum = form.querySelector('.js-step');
  function goStep(n) {
    steps.forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-step') == n); });
    bar.style.width = n === 1 ? '50%' : '100%';
    stepNum.textContent = n;
    if (n === 2 && form.__focusDate && current === 'interpretation') { document.getElementById('f-date').focus(); form.__focusDate = false; }
  }
  function validStep1() {
    var ok = true;
    ['f-name', 'f-phone', 'f-email'].forEach(function (id) {
      var el = document.getElementById(id);
      var v = el.value.trim();
      var good = id === 'f-email' ? /^\S+@\S+\.\S+$/.test(v) : id === 'f-phone' ? v.replace(/\D/g, '').length >= 7 : v.length > 1;
      el.closest('.field').classList.toggle('is-error', !good);
      if (!good && ok) { el.focus(); ok = false; }
    });
    return ok;
  }
  form.querySelector('[data-next]').addEventListener('click', function () { if (validStep1()) goStep(2); });
  form.querySelector('[data-prev]').addEventListener('click', function () { goStep(1); });
  form.addEventListener('input', function (e) { var f = e.target.closest('.field'); if (f) f.classList.remove('is-error'); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    /* Production: POST these fields to a Google Form (formResponse URL)
       or Formspree. No monthly fees, and answers land in a Google Sheet. */
    steps.forEach(function (s) { s.classList.remove('is-active'); });
    form.querySelector('.progress').hidden = true;
    form.querySelector('.form__step-label').hidden = true;
    form.querySelector('.form__done').hidden = false;
  });

  /* ------------------------------------------------------------------
     4. Rotating Kreyòl / English phrases (interpretation section)
     ------------------------------------------------------------------ */
  var phrases = [
    ['Mwen la pou ede w.', "I'm here to help you."],
    ['Kijan ou santi w jodi a?', 'How are you feeling today?'],
    ['Pran tan ou, pa prese.', 'Take your time, no rush.'],
    ['Ou gen dwa poze kesyon.', 'You have the right to ask questions.']
  ];
  var pht = document.querySelector('.js-phrase-ht'), pen = document.querySelector('.js-phrase-en'), pi = 0;
  if (pht && !reduce) setInterval(function () {
    pi = (pi + 1) % phrases.length;
    [pht, pen].forEach(function (el) { el.classList.add('is-out'); });
    setTimeout(function () {
      pht.textContent = phrases[pi][0]; pen.textContent = phrases[pi][1];
      [pht, pen].forEach(function (el) { el.classList.remove('is-out'); });
    }, 420);
  }, 3600);

  /* ------------------------------------------------------------------
     5. Mobile sticky bar
     ------------------------------------------------------------------ */
  var mbar = document.querySelector('.mbar');
  var heroCtas = document.querySelector('.hero__ctas');
  var contact = document.getElementById('contact');
  if ('IntersectionObserver' in window) {
    var heroGone = false, inContact = false;
    var upd = function () { mbar.classList.toggle('is-on', heroGone && !inContact); };
    new IntersectionObserver(function (e) { heroGone = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; upd(); }).observe(heroCtas);
    new IntersectionObserver(function (e) { inContact = e[0].isIntersecting; upd(); }, { threshold: .15 }).observe(contact);
  }

  /* ------------------------------------------------------------------
     6. "Why this layout?" CRO notes
     ------------------------------------------------------------------ */
  var croBtn = document.querySelector('.cro-toggle');
  var pop = document.querySelector('.cro-pop');
  var croEls = document.querySelectorAll('[data-cro]');
  croBtn.addEventListener('click', function () {
    var on = !document.body.classList.contains('cro-on');
    document.body.classList.toggle('cro-on', on);
    croBtn.setAttribute('aria-pressed', on);
    croBtn.querySelector('.cro-toggle__txt').textContent = on ? 'Hide layout notes' : 'Why this layout?';
    if (on) {
      croEls.forEach(function (el, i) {
        var pin = document.createElement('button');
        pin.className = 'cro-pin'; pin.type = 'button';
        pin.innerHTML = '<b>' + (i + 1) + '</b>' + el.getAttribute('data-cro-title');
        pin.addEventListener('click', function (e) {
          e.preventDefault(); e.stopPropagation();
          pop.querySelector('.cro-pop__t').innerHTML = (i + 1) + '. ' + el.getAttribute('data-cro-title');
          pop.querySelector('.cro-pop__d').textContent = el.getAttribute('data-cro');
          pop.hidden = false;
        });
        el.appendChild(pin);
      });
      pop.querySelector('.cro-pop__t').textContent = 'Every section has a job';
      pop.querySelector('.cro-pop__d').textContent = 'Each gold tag explains why that section is there and where it sits on the page. The page follows the path a visitor takes before they get in touch: trust → find my service → why her → how it works → proof → inquire. Tap any tag to read its note.';
      pop.hidden = false;
    } else {
      document.querySelectorAll('.cro-pin').forEach(function (p) { p.remove(); });
      pop.hidden = true;
    }
  });
  document.addEventListener('click', function (e) {
    if (!pop.hidden && !e.target.closest('.cro-pop,.cro-pin,.cro-toggle')) pop.hidden = true;
  });

  /* ------------------------------------------------------------------
     7. Motion: Lenis smooth scroll + GSAP reveals
     ------------------------------------------------------------------ */
  var lenis = null;
  function revealAll() { document.querySelectorAll('[data-reveal]').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; }); }

  function initMotion() {
    if (reduce || !window.gsap) { doc.classList.add('no-motion'); revealAll(); return; }
    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // hero entrance
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero__title .line > *', { yPercent: 110, duration: 1.3, stagger: .14 })
      .from('.hero .eyebrow', { opacity: 0, y: 16, duration: .9 }, '-=1')
      .from('.hero__lead, .hero__ctas, .hero__proof', { opacity: 0, y: 24, duration: 1, stagger: .1 }, '-=.9')
      .from('.router', { opacity: 0, y: 40, duration: 1.2, clearProps: 'transform' }, '-=1')
      .from('.router__tile', { opacity: 0, duration: .8, stagger: .1, clearProps: 'opacity' }, '-=.8');

    // parallax
    gsap.to('.hero__bg', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.fromTo('.final__bg img', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom top', scrub: true } });

    // reveals
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%', once: true,
      onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: .12, overwrite: true }); }
    });
    gsap.utils.toArray('.sec-head .h2, .events__head .h2').forEach(function (h) {
      gsap.from(h, { opacity: 0, y: 30, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
    });
    gsap.from('.gallery .g', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, ease: 'power4.inOut', stagger: .12, scrollTrigger: { trigger: '.gallery', start: 'top 80%', once: true } });
    gsap.from('.facts strong', { textContent: 0, duration: 1.6, ease: 'power1.out', snap: { textContent: 1 }, scrollTrigger: { trigger: '.facts', start: 'top 90%', once: true } });

    // safety net: never leave content hidden
    setTimeout(function () {
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        if (getComputedStyle(el).opacity === '0' && el.getBoundingClientRect().top < innerHeight) gsap.to(el, { opacity: 1, y: 0, duration: .6 });
      });
    }, 2500);
  }

  // smooth anchor links (offset for sticky header)
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    var t = id === '#top' ? document.body : document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    var off = -(header.offsetHeight - 1);
    if (lenis) lenis.scrollTo(id === '#top' ? 0 : t, { offset: off, duration: 1.4 });
    else window.scrollTo({ top: id === '#top' ? 0 : t.getBoundingClientRect().top + scrollY + off, behavior: reduce ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', id === '#top' ? location.pathname + location.search : id);
  });

  setService('realestate');
  if (initial !== 'en') setLang(initial, false);
  if (document.readyState === 'complete') initMotion(); else window.addEventListener('load', initMotion);
  // if CDN scripts are slow, show content anyway
  setTimeout(function () { if (!window.gsap) { doc.classList.add('no-motion'); revealAll(); } }, 4000);
})();
