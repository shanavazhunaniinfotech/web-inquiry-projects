/* The Profitable Portrait Studio · Member Experience Prototype */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var hasGsap = typeof window.gsap !== 'undefined';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var anim = hasGsap && !reduce;

  if (/[?&]frame=1/.test(location.search)) document.body.classList.add('framed');

  /* ---------------- data ---------------- */
  var STAGES = [
    { n: 'Lead Generation', q: 'Are the right people finding your studio?', why: 'A steady flow of well-matched inquiries from partners, events and your own clients.',
      lessons: [['Charitable Organizations: Basics', 'done'], ['Display Marketing Partnerships', 'done'], ['3rd Party Gifting Resources', 'done']], metric: ['New inquiries / month', '14'], light: 'green' },
    { n: 'Lead Follow-up', q: 'Does every inquiry receive timely, personal guidance?', why: 'Every person who reaches out hears from a real person quickly, and nobody slips through.',
      lessons: [['Email and SMS Follow-up Marketing', 'done'], ['SK400 Marketing Resource Items', 'done']], metric: ['Reply time', '45 min'], light: 'green' },
    { n: 'Discovery Call & Booking', q: 'Do your calls turn the right people into booked consultations?', why: 'The phone is where interest becomes a commitment. A structured call books more of the people who already want you.',
      lessons: [['SK600 Telephone Basic Script Structure', 'now'], ['SK650 Telephone Presentations', '18 min'], ['Handling Objections', '22 min']], metric: ['Booking rate', '50% → 60%'] },
    { n: 'Planning Consultation', q: 'Is every portrait designed before the camera comes out?', why: 'Plan the wall, the products and the feeling with your client first, so the session and the sale follow the plan.',
      lessons: [['SK950 Customer Journey Presentations', '26 min'], ['Designing the wall before the session', '15 min']], metric: ['Sessions with a wall plan', 'Coming up'] },
    { n: 'Portrait Session', q: 'Does the session deliver technical excellence and an exceptional emotional experience?', why: 'Prepared, on time, and memorable: the kind of session clients tell their friends about.',
      lessons: [['Session flow & client experience', '20 min']], metric: ['Prepared, on-time sessions', 'Coming up'] },
    { n: 'Pre-Sale Momentum', q: 'Does excitement build between the session and ordering?', why: 'The days after a session are where anticipation grows, or fades. Keep it growing.',
      lessons: [['SK550 Pre-Sale Presentations', '24 min']], metric: ['Pre-sale touches per client', 'Coming up'] },
    { n: 'Ordering Appointment', q: 'Does the reveal guide an emotional, confident purchase decision?', why: 'The reveal is the payoff: the right images, beautifully shown, with every decision-maker in the room.',
      lessons: [['SK500 Sales System', '30 min'], ['Going For The Close', '16 min']], metric: ['Average sale', '$1,940'] },
    { n: 'Production & Quality', q: 'Is every purchased product produced accurately and predictably?', why: 'Orders that arrive exactly right, on the date you promised.',
      lessons: [['Order workflow & quality checks', '14 min']], metric: ['Remakes & corrections', 'Coming up'] },
    { n: 'Delivery & Installation', q: 'Does delivery feel like a celebration?', why: 'The moment the artwork goes on the wall is the moment the next referral is born.',
      lessons: [['Delivery as a celebration', '12 min']], metric: ['On-time deliveries', 'Coming up'] },
    { n: 'Relationship Growth', q: 'Do clients come back, and send their friends?', why: 'Birthdays, anniversaries and milestones turn one session into a lifetime client.',
      lessons: [['Referrals, reviews & anniversaries', '18 min']], metric: ['Repeat & referral sales', 'Coming up'] }
  ];
  var CURRENT = 2; // stage index (0-based) → Stage 3

  var NOTES = {
    cover: 'One page that lets you review every screen, or walk the full member flow from login to feedback.',
    login: 'A calm, branded front door. It sets the tone (warm, premium, personal) before the member sees a single number.',
    home: 'This screen answers the RFP\'s four questions. The one next step is the biggest thing on the page, progress is a single ring rather than a chart, and wins are celebrated before any to-do list. Four menu items in total.',
    journey: 'Your real 10-stage Client Journey drawn as a road. The "dashes between the dots" become literal, the traffic lights are your green, yellow and red framework, and every stage finishes in the same four moves: learn, use, measure, verified.',
    action: 'Learn → Use it → Report, unlocked one at a time so the member never faces the whole curriculum. "Why this matters" turns the action into dollars, and "You\'re done when…" removes any guessing.',
    lms: 'Lessons stay in TalentLMS. The member jumps in with a clear banner and one button home. In the build, completion syncs back automatically, so the member never marks a lesson done twice.',
    results: 'Built for members who don\'t love statistics: five numbers, plain-English captions, the same traffic lights, and a check-in that asks one question at a time and does the math for them. Badges are earned for business results, not clicks.',
    community: 'Only what\'s next, rather than a full calendar grid: upcoming calls, one featured conversation, wins, and the resources for the member\'s current stage. "Picked for Stage 3" filters everything down.',
    site: 'The public page uses the same look as the member area, so the promise matches the product. It tells visitors who it\'s for, the transformation and the 10-stage journey, gives them a peek inside, and offers one clear call to action: a free strategy call.'
  };

  var state = { lesson: false, impl: [false, false, false], reported: false, booked: 3, scrollTo: null };

  /* ---------------- helpers ---------------- */
  var toastTimer;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }
  function fmt(v, prefix) { return (prefix || '') + Math.round(v).toLocaleString('en-US'); }
  function countUp(root) {
    $$('[data-count]', root).forEach(function (el) {
      var end = +el.getAttribute('data-count'), pre = el.getAttribute('data-prefix') || '';
      if (!anim) { el.textContent = fmt(end, pre); return; }
      var o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.4, ease: 'power3.out', onUpdate: function () { el.textContent = fmt(o.v, pre); } });
    });
  }
  function enter(screen) {
    if (!anim) return;
    var items = $$('[data-a]', screen).filter(function (el) { return !el.closest('.site'); });
    if (items.length) gsap.fromTo(items, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .75, stagger: .06, ease: 'power3.out', clearProps: 'transform,opacity' });
  }

  /* ---------------- router ---------------- */
  var APP = ['home', 'journey', 'action', 'lms', 'results', 'community'];
  var ALL = ['cover', 'login', 'site'].concat(APP);
  var hooks = {};

  function route() {
    var r = (location.hash || '#cover').slice(1);
    if (ALL.indexOf(r) === -1) {
      // in-page anchor on marketing page, ignore
      if (document.getElementById(r) && $('[data-screen="site"]').classList.contains('is-active')) return;
      r = 'cover';
    }
    $$('.screen').forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-screen') === r); });
    document.body.classList.toggle('in-app', APP.indexOf(r) > -1);
    $$('[data-nav]').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-nav') === r || (r === 'lms' && a.getAttribute('data-nav') === 'action')); });
    $$('.proto__links a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + r); });
    var screen = $('[data-screen="' + r + '"]');
    $('#crumb').textContent = screen.getAttribute('data-title').replace('&amp;', '&');
    $('#protoScreen').textContent = screen.getAttribute('data-title').replace('&amp;', '&');
    $('#protoNote').textContent = NOTES[r] || '';
    document.title = screen.getAttribute('data-title').replace('&amp;', '&') + ' · The Profitable Portrait Studio';
    window.scrollTo(0, 0);
    enter(screen);
    if (hooks[r]) hooks[r](screen);
    if (state.scrollTo) {
      var el = document.getElementById(state.scrollTo); state.scrollTo = null;
      if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 350);
    }
  }
  window.addEventListener('hashchange', route);

  document.addEventListener('click', function (e) {
    var s = e.target.closest('[data-scroll]');
    if (s) state.scrollTo = s.getAttribute('data-scroll');
    var j = e.target.closest('[data-jump]');
    if (j) {
      e.preventDefault();
      var id = j.getAttribute('href').slice(1), t = document.getElementById(id);
      if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 10, behavior: 'smooth' });
    }
  });

  window.addEventListener('scroll', function () {
    document.body.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ---------------- login ---------------- */
  $('#loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); location.hash = '#home';
    setTimeout(function () { toast('Welcome back, Maya. You have one next step today.'); }, 500);
  });

  /* ---------------- home ---------------- */
  hooks.home = function (s) {
    var ring = $('.ring', s), pct = +ring.getAttribute('data-ring') + (state.reported ? 3 : 0);
    var bar = $('.ring__bar', ring), C = 2 * Math.PI * 60;
    bar.style.strokeDasharray = C;
    $('.ring__label strong', ring).setAttribute('data-count', pct);
    if (anim) { gsap.fromTo(bar, { strokeDashoffset: C }, { strokeDashoffset: C * (1 - pct / 100), duration: 1.6, ease: 'power3.out', delay: .2 }); }
    else bar.style.strokeDashoffset = C * (1 - pct / 100);
    countUp(s);
    var t = $('.next-card__title', s), cta = $('.next-card__cta .btn', s);
    if (state.reported) {
      $('.pill', s).textContent = 'Waiting on David';
      cta.innerHTML = 'See where you are <span class="arr">→</span>'; cta.setAttribute('href', '#results');
    } else if (state.lesson) {
      cta.innerHTML = 'Continue: step 2 of 3 <span class="arr">→</span>';
    }
  };

  /* ---------------- journey ---------------- */
  var roadBuilt = false, selected = CURRENT;
  function stageStatus(i) { return i < CURRENT ? 'done' : i === CURRENT ? 'now' : 'todo'; }

  function buildRoad() {
    var base = $('#roadBase'), L = base.getTotalLength(), g = $('#roadStops'), NS = 'http://www.w3.org/2000/svg';
    var pts = STAGES.map(function (_, i) { var len = L * (0.03 + i * (0.94 / 9)); var p = base.getPointAtLength(len); return { x: p.x, y: p.y, len: len }; });
    g.innerHTML = '';
    pts.forEach(function (p, i) {
      var st = stageStatus(i), el = document.createElementNS(NS, 'g');
      el.setAttribute('class', 'stop ' + st); el.setAttribute('data-i', i); el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button'); el.setAttribute('aria-label', 'Stage ' + (i + 1) + ': ' + STAGES[i].n);
      var below = p.y > 165, ly = below ? p.y + 46 : p.y - 40;
      var html = '';
      if (st === 'now') html += '<circle class="pulse" cx="' + p.x + '" cy="' + p.y + '" r="24"/>';
      html += '<circle class="halo" cx="' + p.x + '" cy="' + p.y + '" r="25"/>' +
        '<circle class="core" cx="' + p.x + '" cy="' + p.y + '" r="18"/>' +
        '<text class="n" x="' + p.x + '" y="' + p.y + '">' + (st === 'done' ? '✓' : i + 1) + '</text>';
      var words = STAGES[i].n.replace(' & ', ' &amp; ').split(' '), l1 = words.slice(0, Math.ceil(words.length / 2)).join(' '), l2 = words.slice(Math.ceil(words.length / 2)).join(' ');
      if (st === 'now') {
        var fy = below ? p.y - 66 : p.y + 36;
        html += '<g class="flag"><rect x="' + (p.x - 52) + '" y="' + fy + '" width="104" height="28" rx="14"/><text fill="#fff" x="' + p.x + '" y="' + (fy + 14) + '">You are here</text></g>';
      }
      html += '<text class="lbl" x="' + p.x + '" y="' + (below ? ly : ly - 16) + '">' + l1 + '</text>';
      if (l2) html += '<text class="lbl" x="' + p.x + '" y="' + (below ? ly + 16 : ly) + '">' + l2 + '</text>';
      el.innerHTML = html;
      g.appendChild(el);
    });
    var done = $('#roadDone');
    done.style.strokeDasharray = L;
    done.setAttribute('data-off', L - pts[CURRENT].len);
    done.style.strokeDashoffset = L;
    g.addEventListener('click', function (e) { var st = e.target.closest('.stop'); if (st) selectStage(+st.getAttribute('data-i'), true); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var st = e.target.closest('.stop'); if (st) selectStage(+st.getAttribute('data-i'), true); } });

    var list = $('#stopList');
    list.innerHTML = STAGES.map(function (s, i) {
      var st = stageStatus(i), sub = st === 'done' ? 'Verified by David' : st === 'now' ? 'You are here' : 'Coming up';
      return '<li class="' + st + '" data-i="' + i + '"><span class="n">' + (st === 'done' ? '✓' : i + 1) + '</span><div><strong>' + s.n.replace('&', '&amp;') + '</strong><small>' + sub + '</small></div></li>';
    }).join('');
    list.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) selectStage(+li.getAttribute('data-i'), true); });
    roadBuilt = true;
  }

  function selectStage(i, scroll) {
    selected = i;
    $$('.stop').forEach(function (s) { s.classList.toggle('sel', +s.getAttribute('data-i') === i); });
    $$('#stopList li').forEach(function (s) { s.classList.toggle('sel', +s.getAttribute('data-i') === i); });
    var s = STAGES[i], st = stageStatus(i);
    var statusHtml = st === 'done' ? '<span class="sd__status sd__status--done"><i class="tl tl--green"></i>World class · verified</span>'
      : st === 'now' ? '<span class="sd__status sd__status--now"><i class="tl tl--amber"></i>Your focus now</span>'
      : '<span class="sd__status sd__status--todo">Unlocks after Stage ' + i + '</span>';
    var moves = ['Learn it', 'Use it', 'Measure it', 'Verified'];
    var mState = moves.map(function (_, k) {
      if (st === 'done') return 'ok';
      if (st === 'todo') return '';
      if (k === 0) return state.lesson ? 'ok' : 'cur';
      if (k === 1) return state.reported ? 'ok' : state.lesson ? 'cur' : '';
      if (k === 2) return state.reported ? 'cur' : '';
      return '';
    });
    var movesHtml = moves.map(function (m, k) {
      var sub = ['Short lessons', 'In your studio', 'One number', 'By David'][k];
      return '<div class="move ' + mState[k] + '"><i>' + (mState[k] === 'ok' ? '✓' : k + 1) + '</i><b>' + m + '</b>' + sub + '</div>';
    }).join('');
    var lessons = s.lessons.map(function (l) {
      var right = l[1] === 'done' ? '<span class="ok">✓ Done</span>' : l[1] === 'now' ? (state.lesson ? '<span class="ok">✓ Done</span>' : '<small style="color:var(--apricot-2);font-weight:700">Up next</small>') : '<small>' + l[1] + '</small>';
      return '<li>' + l[0] + right + '</li>';
    }).join('');
    var cta = st === 'now' ? '<a href="#action" class="btn btn--apricot sd__cta">Go to my next step <span class="arr">→</span></a>'
      : st === 'done' ? '<a href="#results" class="btn btn--line sd__cta">See David\'s feedback</a>' : '';
    $('#stageDetail').innerHTML =
      '<div class="sd"><div class="sd__top"><span class="sd__n">Stage ' + (i + 1) + ' of 10</span>' + statusHtml + '</div>' +
      '<h2>' + s.n.replace('&', '&amp;') + '</h2><p class="sd__q">“' + s.q + '”</p><p class="sd__why">' + s.why + '</p>' +
      '<div class="sd__moves">' + movesHtml + '</div></div>' +
      '<div class="sd__side"><h4>Lessons in your Learning Center</h4><ul class="sd__lessons">' + lessons + '</ul>' +
      '<h4>The number that proves it</h4><div class="sd__metric"><div><small>' + s.metric[0] + '</small><strong>' + s.metric[1] + '</strong></div>' +
      (s.light ? '<i class="tl tl--' + s.light + '"></i>' : '') + '</div>' + cta + '</div>';
    if (anim) gsap.fromTo('#stageDetail > *', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .08, ease: 'power2.out', clearProps: 'all' });
    if (scroll && window.innerWidth < 980) $('#stageDetail').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  hooks.journey = function () {
    if (!roadBuilt) buildRoad();
    var done = $('#roadDone'), off = +done.getAttribute('data-off');
    if (anim) {
      gsap.fromTo(done, { strokeDashoffset: done.getTotalLength() }, { strokeDashoffset: off, duration: 1.8, ease: 'power2.inOut', delay: .3 });
      gsap.fromTo('.stop', { scale: 0, transformOrigin: 'center', transformBox: 'fill-box' }, { scale: 1, duration: .5, stagger: .08, ease: 'back.out(2)', delay: .2 });
    } else done.style.strokeDashoffset = off;
    selectStage(selected, false);
  };

  /* ---------------- next action ---------------- */
  var stepEls = $$('.step');
  function renderSteps() {
    var allImpl = state.impl.every(Boolean);
    var done = [state.lesson, state.lesson && allImpl, state.reported];
    var open = done.indexOf(false);
    stepEls.forEach(function (el, k) {
      el.classList.toggle('is-done', done[k]);
      el.classList.toggle('is-open', k === open);
      el.classList.toggle('is-locked', open > -1 && k > open);
      $('.step__state', el).textContent = done[k] ? 'Done' : k === open ? 'Now' : 'Locked';
      $('.step__num', el).textContent = done[k] ? '✓' : k + 1;
    });
    var n = done.filter(Boolean).length;
    $$('#actionSeg i').forEach(function (i, k) { i.classList.toggle('on', k < n); });
    $('#actionSegTxt').textContent = n + ' of 3 done';
    var lessonBtn = $('#openLesson');
    if (state.lesson) { lessonBtn.classList.add('is-done'); lessonBtn.innerHTML = '✓ Lesson complete · watch again'; }
    var sticky = $('#stickyCta a');
    if (open === 0) { sticky.textContent = 'Open lesson in TalentLMS ↗'; sticky.setAttribute('href', '#lms'); sticky.removeAttribute('data-act'); }
    else if (open === 1) { sticky.textContent = 'Tick off your 3 to-dos above'; sticky.setAttribute('href', '#action'); sticky.setAttribute('data-act', 'impl'); }
    else if (open === 2) { sticky.textContent = 'Send to David →'; sticky.setAttribute('href', '#action'); sticky.setAttribute('data-act', 'submit'); }
    else { sticky.textContent = 'See David\'s feedback →'; sticky.setAttribute('href', '#results'); sticky.removeAttribute('data-act'); }
    var dw = $$('.done-when li'); dw[0].classList.toggle('ok', state.lesson && allImpl); dw[1].classList.toggle('ok', state.reported);
    var sb = $('#scriptBadge'); sb.classList.toggle('badge-ico--locked', !state.reported);
    var submit = $('#submitReport');
    if (state.reported) { submit.classList.add('is-done'); submit.innerHTML = '✓ Sent to David'; }
  }
  stepEls.forEach(function (el, k) {
    $('.step__head', el).addEventListener('click', function () {
      if (el.classList.contains('is-locked')) { toast('Finish the step above first. One thing at a time.'); return; }
      el.classList.toggle('is-open');
    });
  });
  $$('#implChecks input').forEach(function (cb, k) {
    cb.addEventListener('change', function () {
      state.impl[k] = cb.checked;
      if (state.impl.every(Boolean)) { toast('Nice work. Step 3 is unlocked.'); }
      renderSteps();
    });
  });
  $('#stickyCta a').addEventListener('click', function (e) {
    var act = this.getAttribute('data-act');
    if (act === 'submit') { e.preventDefault(); submitReport(); }
    else if (act === 'impl') { e.preventDefault(); $('#implChecks').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });
  $$('#bookStepper button').forEach(function (b) {
    b.addEventListener('click', function () {
      state.booked = Math.max(0, Math.min(5, state.booked + +b.getAttribute('data-d')));
      $('#bookVal').textContent = state.booked;
      var pct = state.booked * 20;
      $('#bookCalc').innerHTML = 'That\'s a <b>' + pct + '%</b> booking rate on scripted calls. Before the script you were at <b>40%</b>.';
      if (anim) gsap.fromTo('#bookVal', { scale: 1.25 }, { scale: 1, duration: .4, ease: 'back.out(3)' });
    });
  });
  function submitReport() {
    if (state.reported) { location.hash = '#results'; return; }
    state.reported = true; renderSteps(); celebrate();
  }
  $('#submitReport').addEventListener('click', submitReport);
  hooks.action = function () { renderSteps(); };

  /* ---------------- LMS ---------------- */
  hooks.lms = function () { $('#lmsProg').style.width = state.lesson ? '100%' : '0'; };
  $('#lmsPlay').addEventListener('click', function () {
    var bar = $('#lmsProg');
    if (anim) gsap.to(bar, { width: '100%', duration: 2.4, ease: 'none' }); else bar.style.width = '100%';
    this.textContent = '❚❚';
  });
  $('#lmsComplete').addEventListener('click', function () {
    state.lesson = true; location.hash = '#action';
    setTimeout(function () { toast('Lesson complete. Welcome back! Step 2 is ready.'); }, 400);
  });

  /* ---------------- celebrate ---------------- */
  function celebrate() {
    var m = $('#celebrate'); m.hidden = false;
    if (anim) {
      gsap.fromTo('#celebrate .modal__card', { y: 40, opacity: 0, scale: .94 }, { y: 0, opacity: 1, scale: 1, duration: .6, ease: 'back.out(1.6)' });
      gsap.fromTo('#celebrate .badge-ico--xl', { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: .9, ease: 'elastic.out(1,.5)', delay: .25 });
    }
    confetti();
  }
  $('#seeFeedback').addEventListener('click', function () {
    $('#celebrate').hidden = true; state.scrollTo = 'feedback'; location.hash = '#results';
  });
  function confetti() {
    if (reduce) return;
    var c = $('#confetti'), ctx = c.getContext('2d'), W = c.width = innerWidth, H = c.height = innerHeight;
    var cols = ['#f2b26b', '#e89a46', '#3f9b6b', '#fffdf9', '#e3ac2f', '#2f5a4b'];
    var P = []; for (var i = 0; i < 160; i++) P.push({ x: W / 2 + (Math.random() - .5) * 200, y: H * .45, vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 4, r: Math.random() * 6 + 3, c: cols[i % cols.length], a: Math.random() * 6, s: (Math.random() - .5) * .3 });
    var t0 = performance.now();
    (function f(t) {
      ctx.clearRect(0, 0, W, H);
      P.forEach(function (p) { p.vy += .42; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.s; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
      if (t - t0 < 3200) requestAnimationFrame(f); else ctx.clearRect(0, 0, W, H);
    })(t0);
  }

  /* ---------------- results ---------------- */
  hooks.results = function (s) {
    countUp(s);
    var gb = $('.goal__bar', s); gb.classList.remove('go'); void gb.offsetWidth; setTimeout(function () { gb.classList.add('go'); }, 200);
    if (anim) gsap.fromTo($$('.spark i', s), { scaleY: 0 }, { scaleY: 1, duration: .7, stagger: .03, ease: 'power3.out', delay: .3 });
    if (anim) gsap.fromTo($$('.people i', s), { scale: 0 }, { scale: 1, duration: .4, stagger: .03, ease: 'back.out(2)', delay: .4 });
    if (state.reported && !$('#fbNew')) {
      var art = document.createElement('article');
      art.className = 'fb fb--new'; art.id = 'fbNew';
      art.innerHTML = '<div class="fb__light"><i class="tl tl--green"></i></div><div><p class="fb__meta">New · Stage 3 · Discovery calls report · Green light</p>' +
        '<p>“Green light on the script, Maya. ' + state.booked + ' of 5 calls booked a consultation. That\'s ' + state.booked * 20 + '% on scripted calls against 40% before. Next week: slow down at question 4, “Why now?” That\'s where the calls that didn\'t book stalled. Proud of you.” <b>— David</b></p></div>';
      $('#fbList').prepend(art);
      var b = $('#badgeScript'); b.classList.add('earned', 'just'); $('small', b).textContent = 'Earned today';
      $('#msgBadge').textContent = '2';
      if (anim) gsap.fromTo(art, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: .6, delay: .5 });
      setTimeout(function () { toast('David replied: green light on your discovery calls.'); }, 900);
    }
  };

  /* check-in */
  var ci = 0, CI_N = 5;
  function showCi() {
    $$('.ci').forEach(function (el, k) { el.hidden = k !== ci; });
    $('#ciProg').style.width = ((ci + 1) / CI_N * 100) + '%';
    $('#ciBack').style.visibility = ci === 0 ? 'hidden' : 'visible';
    $('#ciNext').innerHTML = ci === CI_N - 1 ? 'Send to David <span class="arr">→</span>' : ci === CI_N - 2 ? 'Show my month <span class="arr">→</span>' : 'Next <span class="arr">→</span>';
    if (ci === CI_N - 1) {
      var v = {}; $$('#checkin [data-k]').forEach(function (i) { v[i.getAttribute('data-k')] = +i.value || 0; });
      var rate = v.inq ? Math.round(v.book / v.inq * 100) : 0, avg = v.orders ? Math.round(v.sales / v.orders) : 0;
      $('#ciSum').innerHTML =
        '<li><i class="tl tl--' + (rate >= 60 ? 'green' : rate >= 45 ? 'amber' : 'red') + '"></i><div><b>' + v.book + ' of ' + v.inq + ' people booked</b>: a ' + rate + '% booking rate. ' + (rate >= 60 ? 'World class.' : 'Your goal is 60%; the discovery script is how you close the gap.') + '</div></li>' +
        '<li><i class="tl tl--' + (avg >= 1900 ? 'green' : 'amber') + '"></i><div><b>Average portrait sale: ' + fmt(avg, '$') + '</b>. ' + (avg >= 1940 ? 'Up again, nice!' : 'Holding steady.') + '</div></li>' +
        '<li><i class="tl tl--green"></i><div><b>' + fmt(v.sales, '$') + ' in sales</b> this month keeps you on pace for your 2026 goal.</div></li>';
    }
    var cur = $('.ci[data-ci="' + ci + '"] input');
    if (cur && window.innerWidth > 760) setTimeout(function () { cur.focus(); cur.select && cur.select(); }, 60);
    if (anim) gsap.fromTo('.ci[data-ci="' + ci + '"]', { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: .4, ease: 'power2.out' });
  }
  $('#openCheckin').addEventListener('click', function () { ci = 0; $('#checkin').hidden = false; showCi(); });
  $('#ciNext').addEventListener('click', function () {
    if (ci < CI_N - 1) { ci++; showCi(); return; }
    $('#checkin').hidden = true; toast('Check-in sent. David will reply within 48 hours.');
  });
  $('#ciBack').addEventListener('click', function () { if (ci > 0) { ci--; showCi(); } });
  $('#checkin').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); $('#ciNext').click(); } });

  /* ---------------- community ---------------- */
  hooks.community = function () {};
  $$('.seg-tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.seg-tabs button').forEach(function (x) { x.classList.toggle('on', x === b); });
      $('.cc-grid').classList.toggle('is-filtered', b.getAttribute('data-filter') === 'stage');
    });
  });
  $$('[data-rsvp]').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = b.classList.toggle('is-done');
      b.textContent = on ? '✓ Seat saved' : 'Save my seat';
      if (on) toast('Saved. A calendar invite and reminder are on the way.');
    });
  });
  $$('[data-cheer]').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = b.classList.toggle('on'), n = $('b', b); n.textContent = +n.textContent + (on ? 1 : -1);
      if (anim) gsap.fromTo(b, { scale: 1.2 }, { scale: 1, duration: .4, ease: 'back.out(3)' });
    });
  });

  /* ---------------- marketing site ---------------- */
  var siteIO;
  hooks.site = function (s) {
    if (!anim) return;
    var h1 = $('[data-split]', s);
    if (!h1.getAttribute('data-done')) {
      h1.innerHTML = h1.innerHTML.replace(/(<em>|<\/em>)|([^\s<>]+)/g, function (m, tag, word) { return tag ? tag : '<span class="w" style="display:inline-block">' + word + '</span>'; });
      h1.setAttribute('data-done', '1');
    }
    gsap.fromTo($$('.w', h1), { yPercent: 60, opacity: 0, rotate: 2 }, { yPercent: 0, opacity: 1, rotate: 0, duration: .9, stagger: .04, ease: 'power4.out', delay: .1 });
    gsap.fromTo($$('.s-hero [data-a]', s), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .08, delay: .5, ease: 'power3.out' });
    gsap.fromTo('.float-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .15, delay: .8, ease: 'power3.out' });
    gsap.to('.fc-1', { y: -12, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.8 });
    gsap.to('.fc-2', { y: 10, duration: 3.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.8 });
    gsap.to('.fc-3', { y: -8, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.8 });
    var later = $$('[data-a]', s).filter(function (el) { return !el.closest('.s-hero'); });
    if (siteIO) siteIO.disconnect();
    gsap.set(later, { y: 34, opacity: 0 });
    siteIO = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { gsap.to(en.target, { y: 0, opacity: 1, duration: .9, ease: 'power3.out', clearProps: 'transform' }); siteIO.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    later.forEach(function (el, k) { el.style.transitionDelay = ''; siteIO.observe(el); });
  };
  window.addEventListener('scroll', function () {
    if (!anim || !$('[data-screen="site"]').classList.contains('is-active')) return;
    var y = window.scrollY;
    if (y < 1000) gsap.set('.s-hero__bg img', { y: y * .25 });
    var how = $('.s-how__img img'), r = how.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) gsap.set(how, { yPercent: -((r.top / innerHeight) * 8) - 4 });
  }, { passive: true });

  /* magnetic buttons */
  if (anim && window.matchMedia('(hover:hover)').matches) {
    $$('.magnetic').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .3, duration: .4, ease: 'power3.out' });
      });
      b.addEventListener('mouseleave', function () { gsap.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' }); });
    });
  }

  /* ---------------- phones ---------------- */
  function fitPhones() {
    var s = Math.min(1, Math.max(.5, (innerHeight - 290) / 868), (innerWidth - 60) / 414);
    $$('.iphone__frame').forEach(function (f) { f.style.setProperty('--s', s.toFixed(3)); });
  }
  $$('[data-open-phones]').forEach(function (b) {
    b.addEventListener('click', function () {
      $('#phones').hidden = false; $('#proto').classList.remove('open');
      $$('#phones iframe').forEach(function (f) { if (!f.getAttribute('src')) f.setAttribute('src', f.getAttribute('data-src')); });
      fitPhones();
      if (anim) gsap.fromTo('.iphone', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .15, ease: 'power3.out' });
    });
  });
  window.addEventListener('resize', function () { if (!$('#phones').hidden) fitPhones(); });

  /* ---------------- modals / proto bar ---------------- */
  $$('[data-close]').forEach(function (b) { b.addEventListener('click', function () { b.closest('.modal').hidden = true; }); });
  $$('.modal').forEach(function (m) { m.addEventListener('click', function (e) { if (e.target === m && m.id !== 'celebrate') m.hidden = true; }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { $$('.modal').forEach(function (m) { if (m.id !== 'celebrate') m.hidden = true; }); $('#proto').classList.remove('open'); } });
  $('#protoToggle').addEventListener('click', function () {
    var o = $('#proto').classList.toggle('open'); this.setAttribute('aria-expanded', o);
  });
  $$('.proto__links a').forEach(function (a) { a.addEventListener('click', function () { $('#proto').classList.remove('open'); }); });
  $('#resetProto').addEventListener('click', function () {
    state.lesson = false; state.impl = [false, false, false]; state.reported = false; state.booked = 3;
    $$('#implChecks input').forEach(function (c) { c.checked = false; });
    $('#bookVal').textContent = '3';
    var lb = $('#openLesson'); lb.classList.remove('is-done'); lb.innerHTML = 'Open lesson in TalentLMS <span class="arr">↗</span>';
    var sb = $('#submitReport'); sb.classList.remove('is-done'); sb.innerHTML = 'Send to David <span class="arr">→</span>';
    var n = $('#fbNew'); if (n) n.remove();
    var b = $('#badgeScript'); b.classList.remove('earned', 'just'); $('small', b).textContent = '5 scripted calls';
    $('#msgBadge').textContent = '1';
    $('.next-card .pill').textContent = 'Your one next step';
    var cta = $('.next-card__cta .btn'); cta.setAttribute('href', '#action'); cta.innerHTML = 'Start this step <span class="arr">→</span>';
    $('#proto').classList.remove('open');
    location.hash = '#login'; toast('Walkthrough reset.');
  });

  route();
})();
