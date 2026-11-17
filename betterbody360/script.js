/* BetterBody360 · homepage interactions */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var G = !!(window.gsap && window.ScrollTrigger);
  var notesMode = new URLSearchParams(location.search).get('notes') === '1';
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  if (!G || reduce) root.classList.add('no-fx');
  if (G) gsap.registerPlugin(ScrollTrigger);

  /* Smooth scroll */
  var lenis = null;
  if (window.Lenis && fine && !reduce) {
    lenis = new Lenis({ duration: 1.1 });
    if (G) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else (function f(t) { lenis.raf(t); requestAnimationFrame(f); })(0);
  }
  function go(el) { if (!el) return; if (lenis) lenis.scrollTo(el, { offset: -80 }); else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var el = $(id); if (!el) return;
    e.preventDefault(); closeMenu(); closeDrops();
    if (a.closest('.ben') && a.closest('.ben').dataset.cat) filter(a.closest('.ben').dataset.cat);
    go(el);
  });

  /* Countdown (resets nightly) */
  var cd = $('#cd');
  function tick() {
    var n = new Date(), e = new Date(n); e.setHours(23, 59, 59, 999);
    var s = Math.max(0, Math.floor((e - n) / 1000)), p = function (x) { return String(x).padStart(2, '0'); };
    if (cd) cd.textContent = p(Math.floor(s / 3600)) + ':' + p(Math.floor(s % 3600 / 60)) + ':' + p(s % 60);
  }
  tick(); setInterval(tick, 1000);

  /* Header: dropdowns, scroll state, mobile menu */
  var hdr = $('#hdr'), lastY = 0;
  function closeDrops(except) { $$('.menu__item.is-open').forEach(function (m) { if (m !== except) { m.classList.remove('is-open'); $('.menu__btn', m).setAttribute('aria-expanded', 'false'); } }); }
  $$('.menu__btn').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var item = b.parentElement, open = !item.classList.contains('is-open');
      closeDrops(item); item.classList.toggle('is-open', open); b.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.menu__item')) closeDrops(); });
  var burger = $('.burger'), mnav = $('#mnav');
  function closeMenu() { if (mnav.hidden) return; mnav.hidden = true; burger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); if (lenis) lenis.start(); }
  burger.addEventListener('click', function () {
    if (!mnav.hidden) { closeMenu(); return; }
    mnav.hidden = false; burger.setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-open'); hdr.classList.remove('is-h'); if (lenis) lenis.stop();
    if (G && !reduce) gsap.fromTo('.mnav__in > *', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .55, stagger: .05, ease: 'power3.out' });
  });
  var sticky = $('#sticky'), quick = $('#start'), finalBox = $('.final');
  function onScroll() {
    var y = scrollY;
    hdr.classList.toggle('is-s', y > 20);
    if (!document.body.classList.contains('menu-open')) {
      if (y > 900 && y > lastY + 6) { hdr.classList.add('is-h'); closeDrops(); }
      else if (y < lastY - 6 || y < 900) hdr.classList.remove('is-h');
    }
    lastY = y;
    var past = quick.getBoundingClientRect().bottom < 0, atEnd = finalBox.getBoundingClientRect().top < innerHeight * .7;
    sticky.classList.toggle('is-on', past && !atEnd);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Hero intro */
  function heroIntro() {
    if (!G || reduce) return;
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero__media img', { scale: 1.12, duration: 2.2, ease: 'power2.out' }, 0)
      .to('.hero__brand', { opacity: 1, y: 0, duration: .8 }, .15)
      .to('.hero__h1 .w', { opacity: 1, y: 0, duration: 1, stagger: .07 }, .25)
      .fromTo('.swoosh path', { strokeDashoffset: 320 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, .9)
      .to('.hero .r-up:not(.hero__brand)', { opacity: 1, y: 0, duration: .9, stagger: .1 }, .6)
      .fromTo('.fc', { opacity: 0, y: 30, scale: .92 }, { opacity: 1, y: 0, scale: 1, duration: .9, stagger: .15, ease: 'back.out(1.5)', onStart: gaugeUp }, 1)
      .from('.quick', { y: 40, opacity: 0, duration: 1 }, .9);
    $$('.fc').forEach(function (f, i) { gsap.to(f, { y: '+=8', duration: 2.6 + i * .5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 + i * .3 }); });
    gsap.to('.hero__media img', { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero__frame', start: 'top top', end: 'bottom top', scrub: true } });
  }
  function gaugeUp() {
    var n = $('#gNum'), g = $('#gFg'), o = { v: 0 };
    gsap.to(o, { v: 82, duration: 1.8, ease: 'power2.out', onUpdate: function () { n.textContent = Math.round(o.v); g.style.strokeDashoffset = 207.3 * (1 - o.v / 100); } });
  }
  heroIntro();

  /* Magnetic buttons */
  if (fine && G && !reduce) $$('.magnet').forEach(function (b) {
    b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .28, duration: .4, ease: 'power3.out' }); });
    b.addEventListener('mouseleave', function () { gsap.to(b, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.45)' }); });
  });

  /* Quick start goals */
  var REC = {
    weight: ['Tirzepatide or Semaglutide', 'from $259/mo', 'weight'],
    hormone: ['Testosterone', '$199/mo', 'hormone'],
    body: ['Sermorelin', '$249/mo', 'body'],
    aging: ['NAD+ or Glutathione', 'from $179/mo', 'aging'],
    nutrition: ['Perfect360™ daily essentials', '$99/mo · no prescription', 'nutrition'],
    skin: ['GHK-Cu Cream', 'from $179/mo', 'skin']
  };
  var curGoal = 'weight';
  $$('.qg').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.qg').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-checked', String(x === b)); });
      curGoal = b.dataset.goal; var r = REC[curGoal];
      $('#quickRec').innerHTML = 'Recommended: <b>' + r[0] + '</b> · ' + r[1];
      if (G && !reduce) gsap.fromTo('#quickRec', { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .4 });
    });
  });
  $('#quickBtn').addEventListener('click', function () { filter(REC[curGoal][2]); });

  /* Intro words light up */
  var it = $('#introTxt');
  if (it) {
    it.innerHTML = it.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    var ws = $$('.w', it);
    if (G && !reduce) ScrollTrigger.create({ trigger: it, start: 'top 80%', end: 'bottom 50%', scrub: true, onUpdate: function (s) { var n = Math.round(s.progress * ws.length); ws.forEach(function (w, i) { w.classList.toggle('on', i < n); }); } });
    else ws.forEach(function (w) { w.classList.add('on'); });
  }

  /* Benefits accordion */
  var bens = $$('.ben');
  function openBen(b) { bens.forEach(function (x) { x.classList.toggle('is-open', x === b); }); }
  bens.forEach(function (b) {
    if (fine) b.addEventListener('mouseenter', function () { openBen(b); });
    b.addEventListener('focus', function () { openBen(b); });
    b.addEventListener('click', function (e) {
      if (!b.classList.contains('is-open')) { e.preventDefault(); e.stopPropagation(); openBen(b); }
    }, true);
  });

  /* Product filter tabs with sliding ink */
  var tabs = $$('.tab'), ink = $('.tabs__ink'), cards = $$('.pc');
  function moveInk(t) { ink.style.width = t.offsetWidth + 'px'; ink.style.transform = 'translateX(' + (t.offsetLeft - 6) + 'px)'; }
  function filter(f) {
    var t = tabs.filter(function (x) { return x.dataset.f === f; })[0] || tabs[0];
    tabs.forEach(function (x) { x.classList.toggle('is-on', x === t); x.setAttribute('aria-selected', String(x === t)); });
    moveInk(t);
    var shown = [];
    cards.forEach(function (c) { var ok = f === 'all' || c.dataset.cat.split(' ').indexOf(f) > -1; c.classList.toggle('is-hide', !ok); if (ok) shown.push(c); });
    if (G && !reduce) gsap.fromTo(shown, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .6, stagger: .06, ease: 'power3.out', clearProps: 'opacity,transform' });
    if (G) ScrollTrigger.refresh();
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { filter(t.dataset.f); t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }); });
  addEventListener('resize', function () { moveInk($('.tab.is-on')); });
  addEventListener('load', function () { moveInk($('.tab.is-on')); });
  moveInk(tabs[0]);

  /* Orbit: 8 Coaching360 features */
  var FEATS = [
    ['Personalized Coaching', 'Work with our health and wellness team for expert guidance, accountability, and a plan built around your goals.'],
    ['Coaching360 Health App', 'All your health information in one place, properly analyzed and personalized, with easy access to the tools and support you need.'],
    ['Health Assessment', 'A comprehensive review of your blood work, health metrics, nutrition, exercise, goals and sleep to guide your personalized plan.'],
    ['Health Plan', 'A personalized plan that brings together clinically guided products, nutrition, exercise and lifestyle strategies.'],
    ['Health Notifications', 'Timely reminders, check-ins and updates to keep you consistent, informed and on track.'],
    ['Health Dashboard', 'Track key metrics, monitor progress, and see your results in a simple, easy-to-understand view.'],
    ['Coaching Meetings', 'Regular, scheduled check-ins with your coach to review progress, adjust your plan and keep you moving forward.'],
    ['Messaging Support', 'On-demand access to your coaching team for questions, clarification and ongoing support between meetings.']
  ];
  var nodes = $$('.node'), fi = 0, orbitTimer = null;
  function setFeat(i, user) {
    fi = i;
    nodes.forEach(function (n, j) { n.classList.toggle('is-on', j === i); });
    $('#featN').textContent = '0' + (i + 1); $('#featT').textContent = FEATS[i][0]; $('#featD').textContent = FEATS[i][1];
    if (G && !reduce) gsap.fromTo('#feat > *', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45, stagger: .06, ease: 'power3.out' });
    if (user) { clearInterval(orbitTimer); orbitTimer = null; }
  }
  nodes.forEach(function (n) { n.addEventListener('click', function () { setFeat(+n.dataset.i, true); }); });
  setFeat(0);
  new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { $('#orbit').classList.add('is-in'); if (!orbitTimer && !reduce) orbitTimer = setInterval(function () { setFeat((fi + 1) % nodes.length); }, 3200); }
      else if (orbitTimer) { clearInterval(orbitTimer); orbitTimer = null; }
    });
  }, { threshold: .35 }).observe($('#orbit'));

  /* Testimonials */
  var qs = $$('.q'), qd = $$('.qd'), qi = 0, qt;
  function showQ(i) { qi = (i + qs.length) % qs.length; qs.forEach(function (q, j) { q.classList.toggle('is-on', j === qi); }); qd.forEach(function (d, j) { d.classList.toggle('is-on', j === qi); }); }
  function autoQ() { clearInterval(qt); if (!reduce) qt = setInterval(function () { showQ(qi + 1); }, 6500); }
  $('#qPrev').addEventListener('click', function () { showQ(qi - 1); autoQ(); });
  $('#qNext').addEventListener('click', function () { showQ(qi + 1); autoQ(); });
  qd.forEach(function (d) { d.addEventListener('click', function () { showQ(+d.dataset.i); autoQ(); }); });
  autoQ();

  /* Partner commission calculator (20% of a $299/mo plan) */
  var refs = $('#refs');
  function calc() {
    var n = +refs.value;
    $('#refsOut').textContent = n;
    $('#earnOut').textContent = '$' + Math.round(n * 299 * .2).toLocaleString('en-US');
    refs.style.setProperty('--p', ((n - 1) / 99 * 100) + '%');
  }
  refs.addEventListener('input', calc); calc();

  /* Exit intent (desktop, once per session) */
  var modal = $('#exit'), armed = false;
  setTimeout(function () { armed = true; }, 12000);
  function openM() { if (notesMode || ss('bb_exit') === '1') return; ss('bb_exit', '1'); modal.hidden = false; if (lenis) lenis.stop(); }
  function closeM() { if (modal.hidden) return; modal.hidden = true; if (lenis) lenis.start(); }
  document.addEventListener('mouseout', function (e) { if (armed && !e.relatedTarget && e.clientY <= 0 && innerWidth > 900) openM(); });
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('.modal__x')) closeM(); });
  $('#exitForm').addEventListener('submit', function (e) { e.preventDefault(); this.innerHTML = '<p class="ok">✓ Check your inbox. Your 20% offer is on its way.</p>'; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeM(); closeMenu(); closeDrops(); } });

  /* Scroll reveals */
  if (G && !reduce) {
    var sel = ['.trust__b', '.ring360', '.sh', '.ben', '.tabs', '.pc', '.pnote', '.step', '.how__cta', '.coach__media', '.coach__copy > *', '.orbit', '.feat', '.cyc li', '.assess__card', '.apps', '.plan', '.guar', '.reviews__media', '.reviews__body > *', '.partner__hero', '.way', '.partner__img', '.psteps li', '.calc', '.pfacts', '.art', '.trusted__box', '.trusted__row > div', '.faq__side > *', '.acc details', '.final__box', '.final__copy > *', '.foot__top > *'];
    sel.forEach(function (s) {
      gsap.set(s, { opacity: 0, y: 40 });
      ScrollTrigger.batch(s, { start: 'top 90%', once: true, onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out', clearProps: 'opacity,transform' }); } });
    });
    gsap.fromTo('.cyc', { '--p': 0 }, { '--p': 1, ease: 'none', scrollTrigger: { trigger: '.cyc', start: 'top 80%', end: 'top 30%', scrub: true } });
    $$('.partner__hero > img, .final__box > img, .coach__media img').forEach(function (im) {
      gsap.fromTo(im, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* Design notes (?notes=1) */
  var NOTES = {
    1: ['Offer bar (from Jeff’s mock-up)', 'The “20% off your first 3 months” offer from the client’s own homepage mock-up is the strongest incentive the site has, so it leads every visit. A countdown that resets nightly adds honest urgency, and the link drops visitors straight into the quick-start bar.'],
    2: ['Hero: the client’s photo, headline and buttons', 'Uses BetterBody360’s real hero photo, the brand line “A Better Approach To Better Health”, and the two buttons from Jeff’s mock-up (Explore Products / Explore Coaching360). We added a one-line value statement, three real risk-reducers from the product pages (no doctor’s fees, no membership fees, free shipping) and floating cards for the health score, physician review and free 1–5 day shipping.'],
    3: ['Quick start: pick a goal, get a recommendation', 'Visitors think in goals, not product names. One tap on a goal shows the recommended real product and price, and “See my options” filters the product grid to that category. It turns browsing into a guided path, the biggest single conversion lever on the page. The real credential badges sit right below, so trust is settled before any product is shown.'],
    4: ['Brand statement', 'The client’s own intro paragraph from the mock-up, presented as an editorial statement that lights up as you read, with a rotating 360° seal tying it to the brand name.'],
    5: ['Measurable Health Benefits (client’s section, upgraded)', 'Jeff’s mock-up used a small card slider. This turns it into an interactive gallery using BetterBody360’s own lifestyle photos: hover (or tap) a benefit to expand it, then click through to the matching products.'],
    6: ['Products: real photos, real prices, filters', 'All 9 real products with the real product photography and real monthly prices from the live product pages. Category tabs match the six categories in Jeff’s mock-up. Each card shows price, key facts and the two buttons he asked for (See Pricing / Learn More), all linked to the live product and cart pages. “Most popular” guides undecided visitors, and the “Why a 3-month supply?” block answers a common objection using the FAQ’s own wording.'],
    7: ['How It Works (client’s three steps)', 'The exact three steps from Jeff’s mock-up (Pick your product → Licensed physician review → Medication at your door), with real lifestyle photos and the real time and shipping details, ending with a CTA at the moment of highest understanding.'],
    8: ['Coaching360: the five pages condensed into one', 'As Jeff asked, the whole Coaching360 menu is brought together in one story using his mock-up content: the app intro with the real app photo, his “8 features around the phone” diagram made interactive (auto-cycles; tap any feature), the “Five steps, repeated every month” cycle, the “What we assess” lab lists for hormone and metabolic health, and the 50+ app integrations.'],
    9: ['Pricing and the guarantee', 'Real programs and prices from the live pricing page: Weight Loss Program $299/mo and Guaranteed Weight Loss Program $499/mo (marked Most popular to anchor value). “Your Goals. Our Commitment.” sits right beside the prices, where it reduces risk the most.'],
    10: ['Testimonials', 'The three real client testimonials from the current site, in a large editorial slider beside a real BetterBody360 lifestyle photo. No invented faces or ratings: initials only until real client photos are approved.'],
    11: ['Brand Partner (from the Brand Partner mock-up)', 'The partner audience gets its own chapter with the content from Jeff’s Brand Partner PDF: “You market. We handle everything else.”, the four ways to partner, the four steps, and real facts from the FAQ ($99 one-time, no monthly fee, no license, cancel anytime). The calculator uses the real 20% monthly commission on a real $299 plan.'],
    12: ['Articles', 'The three real articles with their real cover images, building authority and SEO without distracting from the main path.'],
    13: ['Trusted. Licensed. Nationwide.', 'The trust block exactly as in Jeff’s mock-ups, with the real LegitScript, HIPAA, BelugaHealth and 50-state badges.'],
    14: ['FAQ with real answers', 'Six real questions and answers from the BetterBody360 FAQ page, covering the objections that stop people from starting: how it works, states, insurance, delivery time, 3-month supply and privacy.'],
    15: ['Final CTA (client’s closing section)', '“Ready to improve your health?” with the real Coaching360 photo and the two buttons from Jeff’s mock-up, repeating the 20% offer. On mobile a sticky “Get started” bar appears after the hero; on desktop a one-time exit offer captures visitors who are about to leave.']
  };
  if (notesMode) {
    var nt = $('#notesT'), np = $('#notes'), nl = $('#notesL');
    nt.hidden = false;
    Object.keys(NOTES).forEach(function (k) {
      var li = document.createElement('li');
      li.innerHTML = '<b><i>' + k + '</i>' + NOTES[k][0] + '</b><p>' + NOTES[k][1] + '</p>';
      li.addEventListener('click', function () { var s = $('[data-note="' + k + '"]'); if (innerWidth < 900) np.hidden = true; go(s); s.classList.remove('flash'); void s.offsetWidth; s.classList.add('flash'); });
      nl.appendChild(li);
    });
    $$('[data-note]').forEach(function (s) {
      var p = document.createElement('button'); p.className = 'pin'; p.textContent = s.dataset.note; p.setAttribute('aria-label', 'Design note ' + s.dataset.note);
      p.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); np.hidden = false; var it = nl.children[+s.dataset.note - 1]; if (it) { it.scrollIntoView({ block: 'center' }); it.classList.remove('flash'); void it.offsetWidth; it.classList.add('flash'); } });
      s.appendChild(p);
    });
    nt.addEventListener('click', function () { np.hidden = !np.hidden; });
    $('#notesX').addEventListener('click', function () { np.hidden = true; });
  }
})();
