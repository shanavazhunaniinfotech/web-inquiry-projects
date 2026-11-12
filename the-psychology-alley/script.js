/* The Psychology Alley · homepage concept */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Tracking (GA4 / GTM dataLayer) ---------- */
  window.dataLayer = window.dataLayer || [];
  var evLog = $('#evLog'), toastEl = $('#toast'), toastT;
  function track(name, params) {
    var ev = Object.assign({ event: name }, params || {});
    window.dataLayer.push(ev);
    if (evLog) {
      var first = evLog.querySelector('.muted'); if (first) first.remove();
      var li = document.createElement('li');
      var p = params ? ' ' + JSON.stringify(params) : '';
      li.textContent = new Date().toLocaleTimeString('en-AU', { hour12: false }) + '  ' + name + p;
      evLog.prepend(li);
    }
    if (document.body.classList.contains('notes-on')) {
      toastEl.textContent = 'GA4 event → ' + name;
      toastEl.classList.add('show');
      clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
    }
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-track]');
    if (t) track(t.getAttribute('data-track'), t.dataset.clinician ? { clinician: t.dataset.clinician } : null);
  });

  /* ---------- Header + mobile nav + sticky bar ---------- */
  var hdr = $('#hdr'), mbar = $('#mbar'), burger = $('#burger'), mnav = $('#mnav');
  var hero = $('.hero'), final = $('.final');
  function onScroll() {
    var y = window.scrollY;
    hdr.classList.toggle('is-scrolled', y > 8);
    var heroBottom = hero.offsetTop + hero.offsetHeight - 200;
    var finalTop = final.getBoundingClientRect().top;
    mbar.classList.toggle('show', y > heroBottom && finalTop > window.innerHeight * .6);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); mnav.classList.toggle('open', open);
  });
  $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { burger.setAttribute('aria-expanded', 'false'); mnav.classList.remove('open'); }); });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$('.reveal');
  $$('.concern, .doc, .step, .post, .visit__card, .hours, .acc details, .timeline li').forEach(function (el, i) {
    el.classList.add('reveal'); el.style.transitionDelay = (i % 4) * 70 + 'ms'; revealEls.push(el);
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else revealEls.forEach(function (el) { el.classList.add('in'); });

  /* ---------- Hero quick-start chips ---------- */
  var heroSel = new Set();
  $$('#heroChips .chip').forEach(function (c) {
    c.addEventListener('click', function () {
      var v = c.dataset.concern;
      if (heroSel.has(v)) heroSel.delete(v); else heroSel.add(v);
      c.classList.toggle('is-on');
      if (heroSel.size === 1 && c.classList.contains('is-on')) track('match_hero_chip', { concern: v });
    });
  });
  $('#heroNext').addEventListener('click', function () {
    openMatch({ concerns: Array.from(heroSel), step: heroSel.size ? 2 : 1 });
  });

  /* ---------- Matcher ---------- */
  var CLIN = [
    { id: 'heather', name: 'Dr Heather Gan', role: 'Clinical Psychologist · Founder', ini: 'HG', h: 150, fee: 'clinical',
      concerns: ['anxiety', 'emotions', 'identity', 'relationships', 'mood', 'unsure'], modes: ['inperson', 'telehealth'], times: ['day', 'afterhours'], mandarin: true, culture: true },
    { id: 'emilie', name: 'Emilie', role: 'Clinical Psychologist', ini: 'E', h: 25, fee: 'clinical',
      concerns: ['anxiety', 'mood', 'relationships', 'burnout', 'unsure'], modes: ['telehealth'], times: ['day', 'afterhours'] },
    { id: 'ana', name: 'Ana', role: 'Clinical Psychologist', ini: 'A', h: 200, fee: 'clinical',
      concerns: ['trauma', 'mood', 'emotions', 'unsure'], modes: ['inperson', 'telehealth'], times: ['day'] },
    { id: 'registrar', name: 'Clinical Psychology Registrar', role: 'Supervised · lower fee', ini: '+', h: 100, fee: 'lower',
      concerns: ['anxiety', 'mood', 'burnout', 'relationships', 'unsure'], modes: ['inperson', 'telehealth'], times: ['day', 'afterhours'], soonest: true }
  ];
  var LABEL = { anxiety: 'anxiety', mood: 'low mood', emotions: 'intense emotions', trauma: 'trauma', relationships: 'relationships', identity: 'cultural identity', burnout: 'burnout', unsure: 'working out what\'s going on' };

  var match = $('#match'), form = $('#mForm'), steps = $$('.mstep', form);
  var bar = $('#mBar'), count = $('#mCount'), back = $('#mBack'), next = $('#mNext');
  var state, cur = 1, lastFocus, started = false;
  function reset() { state = { concern: [], mode: [], time: [], mhcp: [], priority: [], pick: null }; }
  reset();
  try { var saved = JSON.parse(localStorage.getItem('tpa_match') || 'null'); if (saved && saved.concern) state = Object.assign(state, saved); } catch (e) {}

  function syncChips() {
    $$('[data-group]', form).forEach(function (g) {
      var key = g.dataset.group;
      $$('[data-v]', g).forEach(function (b) { b.classList.toggle('is-on', state[key].indexOf(b.dataset.v) > -1); b.setAttribute('aria-pressed', state[key].indexOf(b.dataset.v) > -1); });
    });
  }
  $$('[data-group]', form).forEach(function (g) {
    var key = g.dataset.group, multi = key === 'concern' || g.hasAttribute('data-multi');
    g.addEventListener('click', function (e) {
      var b = e.target.closest('[data-v]'); if (!b) return;
      var v = b.dataset.v, arr = state[key], i = arr.indexOf(v);
      if (multi) { if (i > -1) arr.splice(i, 1); else arr.push(v); }
      else { state[key] = i > -1 ? [] : [v]; }
      syncChips(); save();
      if (!multi && key === 'mode' && state.mode.length) { /* auto-advance feel */ }
    });
  });
  function save() { try { localStorage.setItem('tpa_match', JSON.stringify(state)); } catch (e) {} }

  function score(c) {
    var s = 0, why = [];
    var hits = state.concern.filter(function (k) { return c.concerns.indexOf(k) > -1; });
    s += hits.length * 3; if (hits.length) why.push('Works with ' + hits.map(function (k) { return LABEL[k]; }).join(', '));
    var m = state.mode[0];
    if (m && m !== 'either') { if (c.modes.indexOf(m) > -1) s += 2; else s -= 4; }
    if (state.time.indexOf('afterhours') > -1) { if (c.times.indexOf('afterhours') > -1) { s += 2; why.push('After-5pm sessions'); } else s -= 2; }
    if (state.priority.indexOf('lower') > -1 && c.fee === 'lower') { s += 3; why.push('Lower fee'); }
    if (state.priority.indexOf('soonest') > -1 && c.soonest) { s += 2; why.push('Shortest wait'); }
    if (state.priority.indexOf('mandarin') > -1) { if (c.mandarin) { s += 4; why.push('Speaks Mandarin'); } else s -= 1; }
    if (state.priority.indexOf('culture') > -1 && c.culture) { s += 2; why.push('Culturally informed focus'); }
    return { c: c, s: s, why: why };
  }
  function renderResult() {
    var ranked = CLIN.map(score).sort(function (a, b) { return b.s - a.s; }).slice(0, 2);
    if (!state.pick) state.pick = ranked[0].c.id;
    var html = ranked.map(function (r, i) {
      var c = r.c;
      return '<button type="button" class="rcard' + (state.pick === c.id ? ' is-on' : '') + '" data-pick="' + c.id + '">' +
        '<span class="avatar" style="--h:' + c.h + '"><span>' + c.ini + '</span></span>' +
        '<span><h4>' + c.name + '</h4><p>' + c.role + ' · ' + (c.fee === 'lower' ? '$148.45' : '$161.95') + ' after Medicare</p>' +
        (r.why.length ? '<span class="rcard__why">✓ ' + r.why.slice(0, 2).join(' · ') + '</span>' : '') + '</span>' +
        (i === 0 ? '<span class="rcard__badge">Best match</span>' : '') + '</button>';
    }).join('') + '<button type="button" class="rcard' + (state.pick === 'any' ? ' is-on' : '') + '" data-pick="any"><span class="avatar avatar--dash"><span>?</span></span><span><h4>No preference</h4><p>Our intake team will match you on the call</p></span></button>';
    $('#mResult').innerHTML = html;
  }
  $('#mResult').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pick]'); if (!b) return;
    state.pick = b.dataset.pick; save();
    $$('.rcard', $('#mResult')).forEach(function (x) { x.classList.toggle('is-on', x === b); });
    track('match_select_clinician', { clinician: state.pick });
  });

  function show(n) {
    cur = n;
    steps.forEach(function (s) { var on = +s.dataset.step === n; s.hidden = !on; if (on) { s.classList.remove('anim'); void s.offsetWidth; s.classList.add('anim'); } });
    var pct = Math.min(n, 4) / 4 * 100; bar.style.width = (n === 5 ? 100 : pct) + '%';
    count.textContent = n === 5 ? 'All done' : 'Step ' + n + ' of 4';
    back.style.visibility = n > 1 && n < 5 ? 'visible' : 'hidden';
    next.textContent = n === 4 ? 'Request my free intake call' : n === 5 ? 'Close' : 'Continue';
    if (n === 4) renderResult();
    $('#mErr').hidden = true;
    var h = steps[n - 1].querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    $('.match__panel').scrollTop = 0;
    track('match_step_view', { step: n });
  }
  function openMatch(opts) {
    opts = opts || {};
    if (opts.concerns && opts.concerns.length) { state.concern = opts.concerns.slice(); }
    if (opts.clinician) { state.pick = { 'Dr Heather Gan': 'heather', 'Emilie': 'emilie', 'Ana': 'ana', 'Registrar': 'registrar' }[opts.clinician] || null; }
    syncChips();
    lastFocus = document.activeElement;
    match.hidden = false; document.body.style.overflow = 'hidden';
    if (!started) { started = true; track('match_start', { source: opts.source || 'cta' }); }
    show(opts.step || 1);
  }
  function closeMatch() {
    match.hidden = true; document.body.style.overflow = '';
    if (cur < 5) track('match_abandon', { step: cur });
    if (cur === 5) { reset(); form.reset(); try { localStorage.removeItem('tpa_match'); } catch (e) {} started = false; }
    if (lastFocus) lastFocus.focus();
  }
  window.openMatch = openMatch;

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open-match]'); if (!t) return;
    e.preventDefault();
    var v = t.getAttribute('data-open-match');
    burger.setAttribute('aria-expanded', 'false'); mnav.classList.remove('open');
    openMatch({ concerns: v ? [v] : null, step: v ? 2 : (t.dataset.clinician ? 2 : 1), clinician: t.dataset.clinician, source: t.dataset.track || (v ? 'concern_' + v : 'cta') });
  });
  $$('[data-close]', match).forEach(function (b) { b.addEventListener('click', closeMatch); });
  back.addEventListener('click', function () { if (cur > 1) show(cur - 1); });
  next.addEventListener('click', function () {
    if (cur === 1 && !state.concern.length) { state.concern = ['unsure']; syncChips(); }
    if (cur < 4) { track('match_step_complete', { step: cur }); show(cur + 1); return; }
    if (cur === 4) {
      var f = form.elements, ok = true;
      ['name'].forEach(function (k) { var bad = !f[k].value.trim(); f[k].classList.toggle('is-err', bad); if (bad) ok = false; });
      var hasContact = f.phone.value.trim() || /\S+@\S+\.\S+/.test(f.email.value);
      f.phone.classList.toggle('is-err', !hasContact); f.email.classList.toggle('is-err', !hasContact);
      if (!hasContact) ok = false;
      if (!f.consent.checked) ok = false;
      if (!ok) { $('#mErr').hidden = false; track('match_form_error'); return; }
      $('#dName').textContent = f.name.value.trim().split(' ')[0];
      track('generate_lead', { form: 'guided_intake', clinician: state.pick, concerns: state.concern.join(','), mode: state.mode[0] || 'any' });
      /* Production: POST to Halaxy enquiry / Squarespace form block / Zapier webhook */
      show(5); return;
    }
    closeMatch();
  });
  $('#crisisBtn').addEventListener('click', function () { $('#crisisBox').hidden = false; track('crisis_info_view'); });

  /* modals + focus trap + esc */
  var mhcpModal = $('#mhcpModal');
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-modal="mhcp"]'); if (t) { mhcpModal.hidden = false; track('mhcp_explainer_open'); mhcpModal.querySelector('.match__x').focus(); }
    if (e.target.closest('[data-close-modal]')) mhcpModal.hidden = true;
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!mhcpModal.hidden) { mhcpModal.hidden = true; return; }
      if (!match.hidden) closeMatch();
      else if (!$('#notes').hidden) toggleNotes(false);
    }
    if (e.key === 'Tab' && !match.hidden && mhcpModal.hidden) {
      var f = $$('button:not([disabled]), input, select, textarea, a[href]', $('.match__panel')).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- Team filters ---------- */
  $$('.filt').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.filt').forEach(function (x) { x.classList.toggle('is-on', x === b); });
      var f = b.dataset.filter;
      $$('.doc').forEach(function (d) { d.classList.toggle('is-dim', f !== 'all' && d.dataset.tags.split(' ').indexOf(f) < 0); });
      track('team_filter', { filter: f });
    });
  });

  /* ---------- Fee calculator ---------- */
  var FEES = { clinical: { std: 311, ah: 326, reb: 149.05 }, registrar: { std: 250, ah: 265, reb: 101.55 } };
  function money(n) { return '$' + n.toFixed(2); }
  function calc() {
    var tier = $('input[name=tier]:checked').value, time = $('input[name=time]:checked').value, m = $('#mhcp').checked;
    var fee = FEES[tier][time], reb = m ? FEES[tier].reb : 0;
    $('#cFee').textContent = money(fee);
    $('#cReb').textContent = m ? '−' + money(reb) : '$0.00';
    $('#cNet').textContent = money(fee - reb);
  }
  $$('.calc input').forEach(function (i) { i.addEventListener('change', function () { calc(); track('fee_calc_change', { tier: $('input[name=tier]:checked').value, time: $('input[name=time]:checked').value, mhcp: $('#mhcp').checked }); }); });
  calc();

  /* ---------- Therapy tabs ---------- */
  var TH = [
    ['Cognitive Behavioural Therapy', 'Notice the link between thoughts, feelings and actions, and change the patterns that keep you stuck. Practical and structured.', 'anxiety, low mood, panic, worry', 'cbt', 'CBT'],
    ['Dialectical Behaviour Therapy', 'Skills for riding out intense emotions, tolerating distress and improving relationships, balancing acceptance with change.', 'BPD, intense emotions, self-harm urges, relationship instability', 'dbt', 'DBT'],
    ['Schema Therapy', 'Understand the deep, long-standing patterns formed earlier in life, and how they still shape how you feel and relate today.', 'long-standing patterns, BPD, chronic low mood', 'schema-therapy', 'Schema Therapy'],
    ['Acceptance & Commitment Therapy', 'Make room for difficult thoughts and feelings, and move towards what matters to you, rather than fighting yourself.', 'anxiety, burnout, chronic stress, life transitions', 'act', 'ACT'],
    ['STAIR & Trauma-Focused CBT', 'A phased, paced approach: first building emotional and relationship skills, then gently working through traumatic memories.', 'complex PTSD, childhood trauma, trauma-related shame', 'psych-blog/stair-therapy', 'STAIR'],
    ['Motivational Interviewing', 'A collaborative conversation to explore mixed feelings about change and strengthen your own reasons for it.', 'ambivalence, habits, substance use, readiness for change', 'motivational-interviewing', 'Motivational Interviewing']
  ];
  $$('.tabs [role=tab]').forEach(function (t, i, all) {
    t.addEventListener('click', function () {
      all.forEach(function (x) { x.setAttribute('aria-selected', x === t); });
      var d = TH[+t.dataset.t];
      $('#tpTitle').textContent = d[0]; $('#tpBody').textContent = d[1]; $('#tpFor').textContent = d[2];
      var l = $('#tpLink'); l.href = 'https://thepsychologyalley.com.au/' + d[3]; l.textContent = 'Read more about ' + d[4];
      var p = $('.tabpanel__txt'); p.classList.remove('fade'); void p.offsetWidth; p.classList.add('fade');
      track('therapy_tab', { therapy: d[4] });
    });
    t.addEventListener('keydown', function (e) {
      var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!k) return;
      var n = all[(i + k + all.length) % all.length]; n.focus(); n.click();
    });
  });

  /* ---------- Open now (Sydney time) ---------- */
  (function () {
    var el = $('#openNow'); if (!el) return;
    try {
      var parts = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      var g = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
      var day = g('weekday'), mins = (+g('hour') % 24) * 60 + +g('minute');
      var openDay = ['Mon', 'Thu', 'Fri'].indexOf(day) > -1;
      if (openDay && mins >= 660 && mins < 1110) { el.textContent = 'Open now · until 6:30pm'; el.style.setProperty('--c', '#5fd398'); }
      else { el.textContent = 'Closed now · enquire online any time, 24/7'; }
    } catch (e) { el.textContent = 'Enquire online any time, 24/7'; }
  })();

  /* ---------- Lead magnet ---------- */
  $('#guideForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var i = $('#gEmail'), ok = /\S+@\S+\.\S+/.test(i.value);
    i.classList.toggle('is-err', !ok);
    if (!ok) { i.focus(); return; }
    $('#guideOk').hidden = false; i.value = '';
    track('generate_lead', { form: 'guide_download' });
  });

  /* ---------- Scroll depth ---------- */
  var depths = [25, 50, 75, 90], hit = {};
  window.addEventListener('scroll', function () {
    var p = (window.scrollY + innerHeight) / document.documentElement.scrollHeight * 100;
    depths.forEach(function (d) { if (p >= d && !hit[d]) { hit[d] = 1; track('scroll_depth', { percent: d }); } });
  }, { passive: true });

  /* ================= CRO NOTES (concept chrome) ================= */
  var NOTES = {
    1: ['Sticky header: 5 links + one CTA',
      'Visitors in distress scan, they don\'t browse. We cut the menu from ~17 links to 5 that answer the real questions (who, how much, how). The phone number stays visible because many people would rather call.',
      'Current site: long Therapies drop-down, a leftover shopping-cart icon, and four different labels for the same booking button.',
      'KPI: header CTA click-through, phone clicks'],
    2: ['Hero: a clear promise, and step 1 starts right here',
      'The headline speaks to the visitor\'s real worry ("which psychologist is right for me?"). The first question of the matcher sits in the hero, so starting feels effortless. A small first "yes" (foot-in-the-door) lifts form starts. Fees, rebate and "no referral needed" answer the top three objections above the fold.',
      'Current hero: a single "Book an appointment" button that leads to a form, with no idea what happens next.',
      'KPI: hero chip interaction rate, match_start'],
    3: ['Trust bar, AHPRA-compliant',
      'No testimonials are allowed, so trust comes from verifiable facts: registration, Medicare, values and language. These are placed directly under the hero, where people make the "is this legit?" judgement.',
      'Currently these logos only appear in the footer.',
      'KPI: bounce rate, scroll past hero'],
    4: ['Start with feelings, not therapy names',
      'People search for "anxiety" or "I don\'t feel like myself", not for "Schema Therapy". Each card opens the matcher with that concern pre-filled, which skips a step. The "Something harder to name" card catches unsure visitors, and the scope note filters out poor fits early.',
      'Current homepage leads with CBT/DBT/Schema cards, which is clinician language.',
      'KPI: concern card clicks → match_start'],
    5: ['How it works: removes fear of the unknown',
      'The current enquiry → intake call → booking process is not a weakness when it\'s explained. Framing the intake as a free, short call that gets you the right match turns friction into reassurance. Timing on each step sets expectations.',
      'Current site never explains what happens after you click "Book".',
      'KPI: CTA clicks from this section'],
    6: ['Team cards built for choosing',
      'This is the shift from solo to group practice. Each card answers: what do they help with, when are they available, and what will it cost me? Filters (telehealth, after 5pm, Mandarin, lower fee) mirror real decision criteria. "Request" buttons pre-select the clinician in the matcher.',
      'Current homepage shows only one psychologist; the team page has no surnames, availability or fees.',
      'KPI: clinician CTA clicks, filter usage'],
    7: ['Interactive fee & rebate calculator',
      'Cost uncertainty is the No.1 silent reason people leave private-practice sites. Showing the out-of-pocket amount ($161.95, not just $311) reframes the price. The registrar tier gives a lower-cost path instead of losing the visitor.',
      'Fees are currently only on a separate page, not the homepage.',
      'KPI: fee_calc_change → match_start rate'],
    8: ['What to expect in session one',
      'First-time therapy clients are anxious about the unknown. A plain timeline (before, arriving, the 50 minutes, after) and "no lock-in" reassurance lower the emotional barrier, without making clinical outcome claims.',
      'Current site has this buried in FAQs.',
      'KPI: time on page, scroll depth'],
    9: ['Therapies, explained in plain language',
      'Kept for informed visitors and for SEO (links preserve your existing therapy pages and URLs), but moved below the decision-making content so it doesn\'t delay action.',
      'Current: 8-item drop-down, some therapy pages filed under /blog.',
      'KPI: therapy_tab views (content interest)'],
    10: ['Location & telehealth side by side',
      'Practical details remove last-minute doubts: nearest station, parking, and that telehealth carries the same fees and rebates. A live "open now" indicator shows the practice is active.',
      'Current hours omit Tue/Wed, which creates ambiguity.',
      'KPI: directions clicks, telehealth enquiries'],
    11: ['FAQ: objection handling before the final ask',
      'Ordered by what stops people booking: referral, wait time, choosing a psychologist, cost, cancellation. Placing it just before the final CTA resolves the last doubts at the moment of decision.',
      'Current FAQ page is titled "FAQs for Psychologists", has a contradictory cancellation policy and leftover template text.',
      'KPI: FAQ opens → match_start'],
    12: ['Soft conversion for "not ready yet" visitors',
      'Most first-time visitors won\'t enquire on visit one. A free guide captures their email, so the practice can gently nurture them (via your marketing team) instead of losing them to Google.',
      'There is currently no option except "book now".',
      'KPI: guide sign-ups, email → enquiry rate'],
    13: ['Articles that answer pre-booking questions',
      'Keeps your SEO content working on the homepage, but only articles that move people towards booking. The current homepage has duplicate excerpts.',
      '',
      'KPI: article clicks, returning visitors'],
    14: ['Final CTA: same label, every time',
      'One consistent action ("Find my psychologist") repeated through the page lowers cognitive load. Phone is the alternative for people who prefer to talk.',
      'Currently: Book / Make / Schedule / Request an appointment, six labels for one action.',
      'KPI: final CTA click rate'],
    15: ['Footer: safety and respect',
      'Crisis lines in the footer on every page (duty of care, and expected by AHPRA-aware visitors). Also an Acknowledgement of Country, a GP referral link for a referral channel, and existing-client Halaxy booking separated from new enquiries.',
      'Crisis lines are currently only on the booking page, and there is no Acknowledgement of Country.',
      'KPI: n/a (trust & safety)'],
    16: ['Sticky mobile action bar',
      'Most first visits happen on mobile. After the hero, a thumb-reach bar keeps "Call" and "Find my psychologist" one tap away, and hides at the final CTA so it doesn\'t double up.',
      '',
      'KPI: cta_sticky_mobile, mobile conversion rate'],
    17: ['The guided matcher (the core of this redesign)',
      '4 short steps instead of one long form: concerns → attendance & time → preferences → suggested match + contact. Progress bar, saved progress, a "help right now" safety exit, and a clear "what happens next" screen. It feeds the intake call with everything needed, so your team can match faster. In production it posts to a Squarespace form / Halaxy enquiry via Zapier.',
      'Current flow: generic enquiry form → wait → intake call → match. No expectation-setting.',
      'KPI: match_start → generate_lead completion rate, step drop-off']
  };

  var notesOn = false, pinsLayer = null, pop = $('#pop');
  var notesEl = $('#notes'), list = $('#notesList'), toggleBtn = $('#notesToggle');
  list.innerHTML = Object.keys(NOTES).map(function (k) {
    var n = NOTES[k];
    return '<li data-n="' + k + '"><span class="n">' + k + '</span><h4>' + n[0] + '</h4><p>' + n[1] + '</p>' + (n[2] ? '<p class="fix">Fixes: ' + n[2] + '</p>' : '') + '<span class="kpi">' + n[3] + '</span></li>';
  }).join('');

  function placePins() {
    if (pinsLayer) pinsLayer.remove();
    if (!notesOn) return;
    pinsLayer = document.createElement('div');
    $$('[data-cro]').forEach(function (el) {
      var n = el.getAttribute('data-cro');
      if (el.hidden || el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return;
      if (el.id === 'mbar' && getComputedStyle(el).display === 'none') return;
      var r = el.getBoundingClientRect();
      var pin = document.createElement('button');
      pin.className = 'pin'; pin.textContent = n; pin.dataset.n = n; pin.setAttribute('aria-label', 'CRO note ' + n + ': ' + NOTES[n][0]);
      if (el.id === 'mbar') { pin.style.position = 'fixed'; pin.style.bottom = '64px'; pin.style.right = '16px'; }
      else {
        var top = r.top + window.scrollY + (el.id === 'hdr' ? 4 : 18);
        var left = Math.min(r.left + window.scrollX + (el.id === 'hdr' ? r.width / 2 : 18), document.documentElement.clientWidth - 44);
        if (el.id === 'hdr') { pin.style.position = 'fixed'; pin.style.top = (r.top + 18) + 'px'; } else pin.style.top = top + 'px';
        pin.style.left = left + 'px';
      }
      pinsLayer.appendChild(pin);
    });
    document.body.appendChild(pinsLayer);
  }
  function toggleNotes(on) {
    notesOn = on;
    document.body.classList.toggle('notes-on', on);
    toggleBtn.setAttribute('aria-pressed', on);
    var wide = window.innerWidth > 1300;
    notesEl.hidden = !(on && wide);
    document.body.classList.toggle('notes-docked', on && wide);
    pop.hidden = true;
    placePins();
    if (on) track('cro_notes_open');
  }
  toggleBtn.addEventListener('click', function () {
    if (notesOn && notesEl.hidden) { notesEl.hidden = false; return; }
    toggleNotes(!notesOn);
    if (notesOn && window.innerWidth <= 1300) notesEl.hidden = false;
  });
  $('#notesClose').addEventListener('click', function () { toggleNotes(false); });
  window.addEventListener('resize', function () { clearTimeout(placePins.t); placePins.t = setTimeout(placePins, 150); });
  window.addEventListener('load', placePins);

  function goTo(n) {
    if (n === '17') { openMatch({ source: 'cro_note' }); return; }
    var el = $('[data-cro="' + n + '"]');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.addEventListener('click', function (e) {
    var pin = e.target.closest('.pin');
    if (pin) {
      e.stopPropagation();
      var n = NOTES[pin.dataset.n];
      $$('li', list).forEach(function (li) { li.classList.toggle('is-hl', li.dataset.n === pin.dataset.n); });
      var hl = list.querySelector('.is-hl'); if (!notesEl.hidden && hl) hl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      pop.innerHTML = '<h4>' + pin.dataset.n + '. ' + n[0] + '</h4><p>' + n[1] + '</p><span class="kpi">' + n[3] + '</span>';
      pop.hidden = false;
      var r = pin.getBoundingClientRect(), pw = Math.min(320, window.innerWidth - 32);
      var x = Math.max(16, Math.min(r.left, window.innerWidth - pw - 16 - (notesEl.hidden ? 0 : 420)));
      var y = r.bottom + 10; if (y + 220 > window.innerHeight) y = Math.max(56, r.top - 230);
      pop.style.left = x + 'px'; pop.style.top = y + 'px';
      return;
    }
    if (!e.target.closest('.pop')) pop.hidden = true;
    var li = e.target.closest('#notesList li');
    if (li) { goTo(li.dataset.n); if (window.innerWidth <= 880) notesEl.hidden = true; }
  });
  window.addEventListener('scroll', function () { pop.hidden = true; }, { passive: true });

  // Deep link: ?notes=1 opens notes
  if (/[?&]notes=1/.test(location.search)) setTimeout(function () { toggleNotes(true); if (window.innerWidth <= 1300) notesEl.hidden = false; }, 400);
})();
