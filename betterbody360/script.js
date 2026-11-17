(function () {
  'use strict';
  var doc = document.documentElement;
  var params = new URLSearchParams(location.search);
  var notesMode = params.get('notes') === '1';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Offer countdown (resets nightly at local midnight) ---------- */
  var cd = document.getElementById('cd');
  function tick() {
    var now = new Date(), end = new Date(now);
    end.setHours(23, 59, 59, 999);
    var s = Math.max(0, Math.floor((end - now) / 1000));
    var h = String(Math.floor(s / 3600)).padStart(2, '0');
    var m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    var ss = String(s % 60).padStart(2, '0');
    if (cd) cd.textContent = h + ':' + m + ':' + ss;
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.querySelector('.nav__burger');
  var mnav = document.getElementById('mnav');
  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 10);
    var hero = document.querySelector('.hero');
    var sticky = document.getElementById('sticky');
    var finalSec = document.querySelector('.final');
    var pastHero = hero && hero.getBoundingClientRect().bottom < 0;
    var atFinal = finalSec && finalSec.getBoundingClientRect().top < window.innerHeight;
    if (sticky) sticky.classList.toggle('is-on', !!pastHero && !atFinal);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    mnav.hidden = open;
  });
  mnav.addEventListener('click', function (e) {
    if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); mnav.hidden = true; }
  });

  /* ---------- Goal selector ---------- */
  var GOALS = {
    weight: {
      title: 'Physician-guided weight loss',
      text: 'Clinically guided GLP-1 therapy to reduce appetite and improve metabolic health, with a coach and app that help you keep the weight off.',
      list: ['Reduce appetite & cravings', 'Improve metabolic health', 'Weekly progress tracking', 'Nutrition plan from your coach'],
      prods: [['GLP', 'Tirzepatide or Semaglutide', 'Rx · weekly GLP-1 therapy'], ['C360', 'Coaching360', '1:1 coach + health app', true]]
    },
    body: {
      title: 'Lose fat, keep the muscle',
      text: 'Improve body fat while protecting lean muscle, with peptide support for recovery and a strength-focused plan from your coach.',
      list: ['Lower body fat', 'Protect lean muscle', 'Better sleep & recovery', 'Strength & protein plan'],
      prods: [['SRM', 'Sermorelin', 'Rx · growth hormone support'], ['P360', 'Perfect360®', 'Creatine + amino acids'], ['C360', 'Coaching360', '1:1 coach + health app', true]]
    },
    hormone: {
      title: 'Restore energy & hormone balance',
      text: 'Lab-guided hormone therapy to optimize energy, mood, libido and metabolism, monitored by a licensed physician.',
      list: ['More energy & drive', 'Better mood & focus', 'Lab-guided dosing', 'Ongoing monitoring'],
      prods: [['TRT', 'Testosterone', 'Rx · hormone therapy'], ['C360', 'Coaching360', '1:1 coach + health app', true]]
    },
    aging: {
      title: 'Feel younger, for longer',
      text: 'Support cellular energy, DNA repair, detoxification and immune function, so you can stay sharp and active for years to come.',
      list: ['Cellular energy', 'Mental clarity', 'Detox & immune support', 'Healthspan-focused plan'],
      prods: [['NAD', 'NAD+', 'Rx · cellular energy'], ['GSH', 'Glutathione', 'Rx · master antioxidant'], ['C360', 'Coaching360', '1:1 coach + health app', true]]
    },
    nutrition: {
      title: 'Cover your daily essentials',
      text: 'One simple daily formula with methylated vitamins, minerals, electrolytes, creatine and essential amino acids. No prescription needed.',
      list: ['One scoop a day', 'No prescription needed', 'Supports energy & recovery', 'Ships fast'],
      prods: [['P360', 'Perfect360®', 'Daily essentials formula'], ['C360', 'Coaching360', '1:1 coach + health app', true]]
    },
    skin: {
      title: 'Healthier-looking skin & hair',
      text: 'GHK-Cu copper peptide cream to support healthier-looking skin, hair and overall appearance, prescribed by a licensed physician.',
      list: ['Smoother-looking skin', 'Hair support', 'Simple daily routine', 'Physician guided'],
      prods: [['GHK', 'GHK-Cu Cream', 'Rx · topical copper peptide'], ['C360', 'Coaching360', '1:1 coach + health app', true]]
    }
  };
  var goals = document.querySelectorAll('.goal');
  var mTitle = document.getElementById('matchTitle');
  var mText = document.getElementById('matchText');
  var mList = document.getElementById('matchList');
  var mProds = document.getElementById('matchProducts');
  function setGoal(key, animate) {
    var g = GOALS[key];
    goals.forEach(function (b) {
      var on = b.dataset.goal === key;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    mTitle.textContent = g.title;
    mText.textContent = g.text;
    mList.innerHTML = g.list.map(function (l) { return '<li><i class="chk"></i>' + l + '</li>'; }).join('');
    mProds.innerHTML = g.prods.map(function (p, i) {
      return (i ? '' : '') + '<div class="mprod"><span class="mprod__dot' + (p[3] ? ' mprod__dot--o' : '') + '">' + p[0] + '</span><div><b>' + (p[3] ? '+ ' : '') + p[1] + '</b><small>' + p[2] + '</small></div></div>';
    }).join('');
    if (animate && window.gsap && !reduce) {
      gsap.fromTo('#match .match__left > *, #match .mprod', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .45, stagger: .04, ease: 'power2.out' });
    }
  }
  goals.forEach(function (b) {
    b.addEventListener('click', function () { setGoal(b.dataset.goal, true); });
  });
  setGoal('weight', false);

  /* ---------- Product filter ---------- */
  var tabs = document.querySelectorAll('.tab');
  var cards = document.querySelectorAll('.pcard');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.toggle('is-active', x === t); });
      var f = t.dataset.filter;
      var shown = [];
      cards.forEach(function (c) {
        var show = f === 'all' || c.dataset.cat.split(' ').indexOf(f) > -1;
        c.classList.toggle('is-hidden', !show);
        if (show) shown.push(c);
      });
      if (window.gsap && !reduce) gsap.fromTo(shown, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .45, stagger: .05, ease: 'power2.out' });
    });
  });

  /* ---------- Partner earnings slider ---------- */
  var refs = document.getElementById('refs');
  var refsOut = document.getElementById('refsOut');
  var earnOut = document.getElementById('earnOut');
  function calc() {
    var n = +refs.value;
    refsOut.textContent = n;
    earnOut.textContent = '$' + (n * 150).toLocaleString('en-US');
  }
  refs.addEventListener('input', calc); calc();

  /* ---------- Counters & app ring ---------- */
  function countUp(el) {
    var target = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = target + suf; return; }
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      if (e.target.dataset.count) countUp(e.target);
      if (e.target.classList.contains('app__ring')) e.target.classList.add('is-on');
      io.unobserve(e.target);
    });
  }, { threshold: .4 });
  document.querySelectorAll('[data-count], .app__ring').forEach(function (el) { io.observe(el); });

  /* ---------- Exit-intent offer (desktop, once per session) ---------- */
  var modal = document.getElementById('exit');
  function seen() { try { return sessionStorage.getItem('bb360_exit') === '1'; } catch (e) { return false; } }
  function markSeen() { try { sessionStorage.setItem('bb360_exit', '1'); } catch (e) {} }
  function openModal() {
    if (seen() || notesMode) return;
    markSeen(); modal.hidden = false;
    var inp = modal.querySelector('input'); if (inp) inp.focus();
  }
  function closeModal() { modal.hidden = true; }
  var armed = false;
  setTimeout(function () { armed = true; }, 8000);
  document.addEventListener('mouseout', function (e) {
    if (armed && !e.relatedTarget && e.clientY <= 0 && window.innerWidth > 900) openModal();
  });
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('.modal__x')) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  /* ---------- GSAP motion ---------- */
  if (window.gsap && window.ScrollTrigger && !reduce) {
    doc.classList.add('js');
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero .reveal', { opacity: 1, y: 0, duration: .9, stagger: .09, ease: 'power3.out', delay: .1 });
    gsap.from('.hero__photo', { clipPath: 'inset(100% 0 0 0 round 200px 200px 28px 28px)', duration: 1.3, ease: 'power3.inOut' });
    gsap.from('.hero__photo img', { scale: 1.25, duration: 1.8, ease: 'power3.out' });
    gsap.from('.float', { opacity: 0, y: 30, scale: .9, duration: .8, stagger: .18, delay: .8, ease: 'back.out(1.6)' });
    gsap.from('.ring', { opacity: 0, scale: .6, duration: .8, delay: .6, ease: 'back.out(1.6)' });
    // gentle float loop
    gsap.utils.toArray('.float').forEach(function (f, i) {
      gsap.to(f, { y: '+=10', duration: 2.6 + i * .4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.8 });
    });
    gsap.to('.hero__photo img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    var groups = [
      ['.trust__item', '.trust'],
      ['.goals .sec-head > *', '.goals'],
      ['.goal', '.goals__grid'],
      ['.match', '.match'],
      ['.products .sec-head', '.products'],
      ['.pcard', '.pgrid'],
      ['.how .sec-head > *', '.how'],
      ['.step', '.steps'],
      ['.coach__copy > *', '.coach__copy'],
      ['.phone', '.coach__visual'],
      ['.coach__chip', '.coach__visual'],
      ['.guarantee', '.guarantee'],
      ['.compare .sec-head > *', '.compare'],
      ['.trow', '.table'],
      ['.reviews .sec-head', '.reviews'],
      ['.rcard', '.rgrid'],
      ['.partner__copy > *', '.partner'],
      ['.partner__card', '.partner'],
      ['.acard', '.agrid'],
      ['.acc details', '.acc'],
      ['.final__inner > *', '.final']
    ];
    groups.forEach(function (g) {
      var els = document.querySelectorAll(g[0]);
      if (!els.length) return;
      gsap.fromTo(els, { opacity: 0, y: 36 }, {
        opacity: 1, y: 0, duration: .8, stagger: .08, ease: 'power3.out', clearProps: 'opacity,transform',
        scrollTrigger: { trigger: g[1], start: 'top 85%', once: true }
      });
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (r) { r.style.opacity = 1; r.style.transform = 'none'; });
  }

  /* ---------- Design notes (?notes=1) ---------- */
  var NOTES = {
    1: ['Offer bar with live countdown', 'The 20% offer from the client’s own mock-up is the strongest incentive on the site, so it sits at the very top on every visit. The countdown adds honest urgency (it resets nightly) and the link drops visitors straight into the goal selector instead of a generic page.'],
    2: ['Hero: outcome headline + one primary action', 'Keeps the brand line “A Better Approach to Better Health” but backs it up with what members actually get: physician-guided treatment + coaching + app. One orange primary CTA (“Find my treatment”) and one quiet secondary. Risk-reducers (free assessment, licensed physicians, discreet delivery) and a real member quote sit right under the button, where hesitation happens. Floating cards show the product experience (score, approval, coach) in two seconds.'],
    3: ['Trust strip directly under the hero', 'For prescription treatments online, “is this legit?” is the first objection. On the current site, LegitScript / HIPAA / 50-state badges are at the bottom where few people scroll. Moving them right under the hero answers that objection immediately.'],
    4: ['Goal selector (self-segmentation)', 'Visitors think in goals (“I want to lose weight”), not product names (“Tirzepatide”). Picking a goal instantly shows a recommended starting plan plus Coaching360 as an add-on, then one CTA. This is the main conversion engine of the page and replaces the old “Measurable Health Benefits” slider.'],
    5: ['Treatment cards with filters', 'All 8 products in one consistent grid, with category tabs so visitors find their category in one tap. Each card leads with the benefit, adds two quick facts and a clear primary CTA. A “Most popular” tag guides undecided visitors. Product imagery is styled vials/jars so the grid looks premium and consistent until real product photos are ready.'],
    6: ['How it works, with timing', 'Telehealth feels unfamiliar to many people. Four simple steps with time expectations (“~3 minutes”, “24–48 hrs”) remove uncertainty. The 4th step adds Coaching360, which sets BetterBody360 apart from prescription-only competitors. Ends with a CTA at the moment of highest understanding.'],
    7: ['Coaching360 as ONE story', 'As requested, the 5 Coaching360 sub-pages are condensed into one clear section: the core message (“Treatment gets you started. Coaching gets you there.”), an app mock-up, 6 features, and all 14 focus areas in a moving strip. This also positions coaching as the reason to choose BetterBody360 over cheaper prescription-only sites.'],
    8: ['Results guarantee', 'The “Your Goals. Our Commitment.” guarantee is currently hidden deep in the Coaching360 page. It is one of the strongest risk-reversal tools the client has, so it gets its own high-contrast block.'],
    9: ['Comparison table', 'Visitors are comparing options in other tabs. This table makes the comparison for them, on our terms: physician + pharmacy + coach + app + guarantee, versus typical telehealth and going it alone.'],
    10: ['Social proof with a face', 'The three real testimonials from the current site, made more credible with photos, star ratings and a featured story. Key numbers (50 states, 50+ apps, 100% commitment) animate into view. Photos are placeholders; we will swap in real member photos or initials with the client’s approval.'],
    11: ['Brand Partner block: second audience', 'Brand Partners are a separate audience, so this is a distinct, dark section with its own clear path: Apply → Market → Earn, the one-time $99 fee stated upfront (transparency builds trust), and an interactive earnings slider that makes the opportunity tangible. The commission figure is a placeholder to be confirmed by the client.'],
    12: ['Education builds authority', 'The client’s existing articles show expertise and help SEO. Kept compact so they support the sale without distracting from it.'],
    13: ['FAQ handles the final objections', 'Prescription, cost, insurance, delivery, privacy: the questions that stop people from starting are answered right before the final CTA. Uses native accordions, so it is fast and accessible.'],
    14: ['Final CTA', 'A last, focused ask that repeats the offer and the four trust points, so anyone who scrolled the whole page has a clear next step without scrolling back up.'],
    15: ['Sticky mobile CTA', 'Most traffic is on mobile. After the hero, a slim bar keeps the offer and “Get started” always one tap away. It hides when the final CTA is on screen. On desktop, a one-time exit-intent offer captures emails from visitors who are about to leave.']
  };
  if (notesMode) {
    var toggle = document.getElementById('notesToggle');
    var panel = document.getElementById('notes');
    var list = document.getElementById('notesList');
    var closeBtn = document.getElementById('notesClose');
    toggle.hidden = false;
    Object.keys(NOTES).forEach(function (k) {
      var li = document.createElement('li');
      li.innerHTML = '<b><i>' + k + '</i>' + NOTES[k][0] + '</b><p>' + NOTES[k][1] + '</p>';
      li.addEventListener('click', function () {
        var sec = document.querySelector('[data-note="' + k + '"]');
        if (!sec) return;
        if (k === '15') { panel.hidden = true; return; }
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        sec.classList.remove('note-flash'); void sec.offsetWidth; sec.classList.add('note-flash');
        if (window.innerWidth < 900) panel.hidden = true;
      });
      list.appendChild(li);
    });
    document.querySelectorAll('[data-note]').forEach(function (sec) {
      var pin = document.createElement('button');
      pin.className = 'pin'; pin.textContent = sec.dataset.note;
      pin.setAttribute('aria-label', 'Design note ' + sec.dataset.note);
      pin.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        panel.hidden = false;
        var item = list.children[+sec.dataset.note - 1];
        if (item) { item.scrollIntoView({ block: 'center' }); item.classList.remove('note-flash'); void item.offsetWidth; item.classList.add('note-flash'); }
      });
      sec.appendChild(pin);
    });
    toggle.addEventListener('click', function () { panel.hidden = !panel.hidden; });
    closeBtn.addEventListener('click', function () { panel.hidden = true; });
  }
})();
