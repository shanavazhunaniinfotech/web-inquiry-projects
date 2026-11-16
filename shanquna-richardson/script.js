/* Stable Futures: homepage concept interactions */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var money = function (n) { return '$' + (Math.round(n * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); };
  var store = { get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };

  /* ---------- Toast ---------- */
  var toastEl = $('.toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2800);
  }

  /* ---------- Concept bar ---------- */
  $('.concept__x').addEventListener('click', function () { $('.concept').remove(); });

  /* ---------- Header ---------- */
  var hdr = $('.hdr'), burger = $('.burger'), mnav = $('#mnav');
  function onScroll() { hdr.classList.toggle('is-stuck', window.scrollY > 120); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mnav.hidden = !open;
  });
  $$('a', mnav).concat($$('button', mnav)).forEach(function (a) { a.addEventListener('click', function () { burger.setAttribute('aria-expanded', 'false'); mnav.hidden = true; }); });

  // Active nav link
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var secIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'programs', 'stories', 'involved', 'blog', 'contact'].forEach(function (id) { var el = document.getElementById(id); if (el) secIO.observe(el); });
  }

  /* ---------- Impact copy ---------- */
  var IMPACT = {
    monthly: {
      25: '$25/month stocks a young adult’s fridge with a week of groceries, every month.',
      50: '$50/month covers a young adult’s bus pass, so they never miss a shift.',
      100: '$100/month funds weekly 1:1 coaching for one young adult.',
      250: '$250/month covers rent support for a young adult facing eviction.',
      500: '$500/month sponsors a full transitional apartment bed for a month.'
    },
    once: {
      25: '$25 covers ID & birth certificate fees: the first step to a job and a lease.',
      50: '$50 builds a move-in kit with bedding, cookware and essentials.',
      100: '$100 seeds a matched savings account, doubled to $200.',
      250: '$250 pays the utility deposits on a first apartment.',
      500: '$500 covers a security deposit for a first apartment.'
    }
  };
  function impactFor(freq, amt) {
    var t = IMPACT[freq][amt];
    if (t) return t;
    var per = freq === 'monthly' ? '/month' : '';
    if (amt >= 500) return money(amt) + per + ' can cover a security deposit for a young adult’s first apartment.';
    if (amt >= 100) return money(amt) + per + ' funds 1:1 coaching and savings matching for a young adult.';
    if (amt >= 40) return money(amt) + per + ' keeps a young adult moving with transit and groceries.';
    return 'Every ' + money(amt || 0) + per + ' adds up: it helps cover IDs, groceries and bus fare.';
  }
  var freqLabel = function (f) { return f === 'monthly' ? 'monthly' : 'one-time'; };

  function radioGroup(btns, attr, cb) {
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
        cb(b.getAttribute(attr), b);
      });
    });
  }

  /* ---------- Quick donate (hero) ---------- */
  var qd = { freq: 'monthly', amt: 50 };
  var qdForm = $('#give');
  function qdRender() {
    $('.js-qd-impact').textContent = impactFor(qd.freq, qd.amt);
    $('.js-qd-label').textContent = '$' + qd.amt + ' ' + freqLabel(qd.freq);
  }
  radioGroup($$('[data-freq]', qdForm), 'data-freq', function (v) { qd.freq = v; qdRender(); });
  radioGroup($$('[data-amt]', qdForm), 'data-amt', function (v) { qd.amt = +v; qdRender(); });
  qdForm.addEventListener('submit', function (e) { e.preventDefault(); openDonate(qd.amt, qd.freq); });

  /* ---------- Counters ---------- */
  function countUp(el) {
    var to = +el.getAttribute('data-to'), start = null, dur = 1600;
    if (reduce) { el.textContent = to.toLocaleString('en-US'); return; }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0'; requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cIO.unobserve(e.target); } });
    }, { threshold: .6 });
    $$('.js-count').forEach(function (el) { cIO.observe(el); });
  }

  /* ---------- Eligibility check ---------- */
  var elig = $('.elig'), ans = {};
  function eligGo(n) {
    $$('.elig__panel', elig).forEach(function (p) { p.classList.toggle('is-on', +p.getAttribute('data-step') === n); });
    $('.js-elig-step').textContent = n > 3 ? 'Done' : 'Step ' + n + ' of 3';
    $('.js-elig-bar').style.width = Math.min(n, 3) / 3 * 100 + '%';
  }
  $$('[data-step="1"] .chip', elig).forEach(function (c) {
    c.addEventListener('click', function () {
      var v = c.getAttribute('data-v');
      if (v === 'ok') { eligGo(2); return; }
      var p = $('[data-step="4"]', elig);
      $('.js-done-h', p).innerHTML = v === 'young' ? 'We’ve got you, still.' : 'Let’s find the right fit.';
      $('.js-done-p', p).innerHTML = v === 'young'
        ? 'Our programs start at 18, but we partner with youth services that can help now. Text <b>START</b> and a coach will connect you personally.'
        : 'Our programs are for ages 18–24, but we can point you to trusted adult programs nearby. Text <b>START</b> and we’ll share them.';
      eligGo(4);
    });
  });
  $$('[data-step="2"] .chip', elig).forEach(function (c) {
    c.addEventListener('click', function () { ans.need = c.getAttribute('data-v'); eligGo(3); setTimeout(function () { $('.js-elig-form input').focus({ preventScroll: true }); }, 60); });
  });
  var NEED = { Housing: 'a safe, stable place to live', Work: 'finding a job or training', Money: 'money and budgeting', Mentor: 'having someone in your corner' };
  $('.js-elig-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(this)) return;
    var p = $('[data-step="4"]', elig), name = this.name.value.trim().split(' ')[0];
    $('.js-done-h', p).innerHTML = 'You’re in, <span>' + esc(name) + '</span>.';
    $('.js-done-p', p).innerHTML = 'A coach will reach out within 2 business days to talk about <b>' + NEED[ans.need] + '</b>. You’ve already taken the hardest step.';
    eligGo(4);
  });
  $('.js-elig-reset').addEventListener('click', function () { ans = {}; $('.js-elig-form').reset(); eligGo(1); });

  function esc(s) { return s.replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function validate(form) {
    var ok = true, first = null;
    $$('input[required]', form).forEach(function (i) {
      var bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value.trim()));
      i.classList.toggle('is-err', bad);
      i.setAttribute('aria-invalid', bad);
      if (bad && !first) first = i;
      if (bad) ok = false;
    });
    if (first) { first.focus(); toast('Please fill in the highlighted field' + (first.type === 'email' ? ' with a valid email' : '')); }
    return ok;
  }
  document.addEventListener('input', function (e) { if (e.target.classList && e.target.classList.contains('is-err')) { e.target.classList.remove('is-err'); e.target.removeAttribute('aria-invalid'); } });

  /* ---------- Impact calculator ---------- */
  var range = $('#calc-range'), calc = { freq: 'monthly', amt: 50 };
  function calcRender() {
    var a = calc.amt, total = calc.freq === 'monthly' ? a * 12 : a;
    var pct = (a - range.min) / (range.max - range.min) * 100;
    range.style.setProperty('--fill', pct + '%');
    range.setAttribute('aria-valuetext', a + ' dollars ' + freqLabel(calc.freq));
    $('.js-calc-amt').textContent = '$' + a;
    $('.js-calc-per').textContent = calc.freq === 'monthly' ? '/month' : ' once';
    $('.js-calc-btn').textContent = '$' + a + ' ' + freqLabel(calc.freq);
    var fmt = function (n) { return n >= 10 ? Math.round(n).toLocaleString('en-US') : (Math.round(n * 10) / 10).toString(); };
    var per = calc.freq === 'monthly' ? ' each year' : '';
    var items = [
      [fmt(total / 25), 'hours of 1:1 coaching' + per],
      [fmt(total / 40), 'nights of safe housing' + per],
      [money(total * 2).replace('.00', ''), 'saved by a young adult, with our match']
    ];
    $('.js-yields').innerHTML = items.map(function (i) { return '<li><b>' + i[0] + '</b><span>' + i[1] + '</span></li>'; }).join('');
  }
  range.addEventListener('input', function () { calc.amt = +range.value; calcRender(); });
  radioGroup($$('[data-cfreq]'), 'data-cfreq', function (v) { calc.freq = v; calcRender(); });
  $('.js-calc-go').addEventListener('click', function () { openDonate(calc.amt, calc.freq); });
  calcRender();

  /* ---------- Voices carousel ---------- */
  var track = $('.voices__track');
  function vStep(dir) { var card = $('.voice', track); track.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: reduce ? 'auto' : 'smooth' }); }
  $('.js-v-prev').addEventListener('click', function () { vStep(-1); });
  $('.js-v-next').addEventListener('click', function () { vStep(1); });

  /* ---------- Story video placeholder ---------- */
  $('.story__play').addEventListener('click', function () { toast('Video placeholder: Jasmine’s 90-second story will play here'); });

  /* ---------- Simple forms ---------- */
  var vform = $('.js-vform');
  vform.addEventListener('submit', function (e) {
    e.preventDefault(); if (!validate(vform)) return;
    $('.vform__ok', vform).hidden = false; $('button[type="submit"]', vform).disabled = true;
  });
  $$('.js-news').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var i = $('input', f);
      if (!/^\S+@\S+\.\S+$/.test(i.value.trim())) { i.classList.add('is-err'); i.focus(); toast('Please enter a valid email'); return; }
      $('.news__ok', f).hidden = false; i.value = ''; store.set('sf-sub', '1');
      if (f.classList.contains('js-exit-form')) setTimeout(function () { exitDlg.close(); }, 1600);
    });
  });

  /* ---------- FAQ tabs ---------- */
  var tabs = $$('.faq__tabs [role="tab"]');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', on); document.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
    });
  });

  /* ---------- Mobile action bar ---------- */
  var mbar = $('.mbar'), hero = $('.hero'), final = $('.final');
  function mbarCheck() {
    var past = hero.getBoundingClientRect().bottom < 0;
    var fr = final.getBoundingClientRect();
    var atFinal = fr.top < window.innerHeight && fr.bottom > 0;
    mbar.classList.toggle('is-on', past && !atFinal);
  }
  window.addEventListener('scroll', mbarCheck, { passive: true }); mbarCheck();

  /* ---------- Donation dialog ---------- */
  var dlg = $('#donate-dlg'), d = { amt: 50, freq: 'monthly', fees: true, step: 1, upsold: false };
  var amtBtns = $$('[data-damt]', dlg), other = $('.js-dother', dlg);
  function dFee() { return Math.round((d.amt * 0.029 + 0.30) * 100) / 100; }
  function dTotal() { return d.amt + (d.fees ? dFee() : 0); }
  function dRender() {
    amtBtns.forEach(function (b) { b.setAttribute('aria-checked', +b.getAttribute('data-damt') === d.amt && !other.value ? 'true' : 'false'); });
    $$('[data-dfreq]', dlg).forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-dfreq') === d.freq ? 'true' : 'false'); });
    $('.js-d-impact', dlg).textContent = impactFor(d.freq, d.amt);
    $('.js-fee', dlg).textContent = money(dFee());
    var t = money(dTotal()) + (d.freq === 'monthly' ? '/mo' : '');
    $$('.js-d-total', dlg).forEach(function (el) { el.textContent = t; });
  }
  function dGo(n) {
    d.step = n;
    $$('.dstep', dlg).forEach(function (s) { s.classList.toggle('is-on', +s.getAttribute('data-dstep') === n); });
    $$('.dlg__steps li', dlg).forEach(function (li, i) { li.classList.toggle('is-on', i < n); });
    $('.dlg__steps', dlg).style.visibility = n > 3 ? 'hidden' : '';
    $('.dlg__main', dlg).scrollTop = 0;
  }
  function openDonate(amt, freq) {
    d.amt = +amt || 50; d.freq = freq || 'monthly'; d.upsold = false; other.value = '';
    if (!amtBtns.some(function (b) { return +b.getAttribute('data-damt') === d.amt; })) other.value = d.amt;
    dRender(); dGo(1);
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    store.set('sf-engaged', '1');
  }
  window.openDonate = openDonate;
  $$('.js-donate').forEach(function (b) {
    b.addEventListener('click', function () { openDonate(b.getAttribute('data-amount') || qd.amt, b.getAttribute('data-freq') || qd.freq); });
  });
  amtBtns.forEach(function (b) { b.addEventListener('click', function () { other.value = ''; d.amt = +b.getAttribute('data-damt'); dRender(); }); });
  other.addEventListener('input', function () { var v = parseFloat(other.value); if (v > 0) { d.amt = v; dRender(); } });
  $$('[data-dfreq]', dlg).forEach(function (b) { b.addEventListener('click', function () { d.freq = b.getAttribute('data-dfreq'); dRender(); }); });
  $('.js-fees', dlg).addEventListener('change', function () { d.fees = this.checked; dRender(); });
  $('.js-tribute', dlg).addEventListener('change', function () { $('.js-tribute-fld', dlg).hidden = !this.checked; });
  $('.js-d-next', dlg).addEventListener('click', function () {
    if (!(d.amt >= 5)) { other.focus(); toast('Minimum gift is $5'); return; }
    var up = $('.js-upsell', dlg);
    var showUp = d.freq === 'once' && !d.upsold && d.amt >= 20;
    up.hidden = !showUp;
    if (showUp) { var m = Math.max(10, Math.round(d.amt / 2 / 5) * 5); up.setAttribute('data-m', m); $$('.js-up-amt', up).forEach(function (x) { x.textContent = '$' + m; }); }
    dGo(2);
  });
  $('.js-up-yes', dlg).addEventListener('click', function () {
    var up = $('.js-upsell', dlg); d.amt = +up.getAttribute('data-m'); d.freq = 'monthly'; d.upsold = true; up.hidden = true; other.value = ''; dRender(); toast('Switched to $' + d.amt + '/month, thank you!');
  });
  $('.js-up-no', dlg).addEventListener('click', function () { d.upsold = true; $('.js-upsell', dlg).hidden = true; });
  $('.js-dform', dlg).addEventListener('submit', function (e) { e.preventDefault(); if (validate(this)) dGo(3); });
  $$('.js-d-back', dlg).forEach(function (b) { b.addEventListener('click', function () { dGo(d.step - 1); }); });
  $$('.js-pay', dlg).forEach(function (b) {
    b.addEventListener('click', function () {
      var fn = $('.js-dform input[name="fn"]', dlg).value.trim();
      $('.js-thx-name', dlg).textContent = fn || 'friend';
      $('.js-thx-amt', dlg).textContent = money(dTotal()) + ' ' + freqLabel(d.freq);
      store.set('sf-gave', '1'); dGo(4);
    });
  });
  $('.js-copy', dlg).addEventListener('click', function () {
    var url = location.href.split('#')[0];
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast('Link copied'); }, function () { toast('Link: ' + url); });
    else toast('Link: ' + url);
  });
  $('.js-close', dlg).addEventListener('click', function () { dlg.close(); });
  $('.dlg__x', dlg).addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  // Recent-donor ticker (social proof)
  var RECENT = ['Laura from Austin gave $50 monthly · 4 min ago', 'A neighbor gave $100 · 11 min ago', 'Marcus joined the Foundation Builders · 26 min ago', 'Bright Dental matched $500 · 1 hr ago'];
  var ri = 0;
  setInterval(function () { if (dlg.open) { ri = (ri + 1) % RECENT.length; $('.js-recent', dlg).textContent = RECENT[ri]; } }, 3800);

  /* ---------- Exit intent (desktop, once per session) ---------- */
  var exitDlg = $('#exit-dlg'), armed = false;
  setTimeout(function () { armed = true; }, 12000);
  document.addEventListener('mouseout', function (e) {
    if (!armed || e.relatedTarget || e.clientY > 8) return;
    if (window.innerWidth < 900 || store.get('sf-exit') || store.get('sf-gave') || store.get('sf-sub') || dlg.open || document.body.classList.contains('notes-on')) return;
    store.set('sf-exit', '1');
    if (typeof exitDlg.showModal === 'function') exitDlg.showModal();
  });
  $('.dlg__x', exitDlg).addEventListener('click', function () { exitDlg.close(); });
  exitDlg.addEventListener('click', function (e) { if (e.target === exitDlg) exitDlg.close(); });
  $('.js-exit-give', exitDlg).addEventListener('click', function () { exitDlg.close(); openDonate(10, 'once'); });

  /* ---------- Design notes ---------- */
  var NOTES = {
    1: ['Campaign bar: urgency with a goal', '<p>A specific, time-bound goal ("$24,860 of $40,000 · 18 days left") converts far better than a generic "Donate" link. People are drawn to help finish something already in motion, the <b>goal-gradient effect</b>.</p><p>It’s also the first thing every visitor sees, so the biggest current need gets top billing. Swap it for each campaign (Giving Tuesday, back-to-school, etc.).</p>'],
    2: ['Header: two audiences, one clear action', '<ul><li><b>Donate</b> is always visible in the brightest color on the page. It’s the one button your eye finds first.</li><li><b>Get support</b> sits beside it so young adults are never lost in donor messaging.</li><li>Six short menu items (About, Programs, Stories, Volunteer, Blog, Contact) cover every page in the brief. Fewer choices = faster decisions.</li><li>The header sticks on scroll, so the next step is always one tap away.</li></ul>'],
    3: ['Hero: mission, two paths and a gift above the fold', '<p>Your tagline becomes the headline, so visitors know in 3 seconds who you serve and why.</p><ul><li><b>Two path cards</b> split traffic right away: "I need support" vs "I want to help". Each audience gets its own journey.</li><li>The <b>quick-donate card</b> lets ready donors give without hunting for a donate page, cutting a step from the most valuable conversion.</li><li><b>Monthly + $50 are pre-selected</b> and marked "Most chosen" (default &amp; social-proof effects). Monthly donors are worth far more over time.</li><li>Each amount shows a <b>tangible impact</b> ("covers a bus pass"). Concrete outcomes beat abstract asks.</li><li>Trust ticks (501(c)(3), 87¢ to programs, free &amp; confidential) answer the first doubts of both audiences.</li></ul>'],
    4: ['Proof straight after the ask', '<p>Right after the first call to action, visitors look for reasons to believe. Specific numbers (1,240 young adults, 89% still housed) build more trust than adjectives.</p><p>The partner strip borrows credibility from organizations people already know. Replace these placeholders with your real funders and partners.</p>'],
    5: ['The problem: why this matters now', '<p>Donors give to problems they understand. This section frames the gap ("At 18, support ends. The bills don’t.") with two credible national statistics and one reassuring fact for young adults: <b>it’s free</b>.</p><p>The heading stays pinned on desktop while the fact cards scroll past, which keeps the story focused and the section memorable.</p>'],
    6: ['Programs: four clear pillars', '<p>This is the "Programs / Services" requirement in a scannable format: a photo, a one-line promise, 3 specifics and a <b>proven outcome</b> for each pillar.</p><p>Outcome numbers turn services into results, which is what both funders and young adults want to see. Each card will link to its own program page.</p>'],
    7: ['Getting support: lower the barrier', '<p>Young adults in crisis won’t fill out a long form. So we use a <b>3-question, 30-second check</b>: one tap per question, contact details last. Small first commitments (the foot-in-the-door effect) lead to far more completed sign-ups.</p><ul><li>A 4-step "what happens next" removes the fear of the unknown.</li><li>"Text START" offers a channel this age group prefers.</li><li>The <b>211 / 911 safety note</b> is responsible, and it builds trust with funders too.</li></ul>'],
    8: ['One story beats a hundred stats', '<p>People respond more to <b>one named person</b> than to large numbers (the identifiable-victim effect). Jasmine’s timeline shows the full transformation, month by month, so the program feels real and proven.</p><p>The CTA ("Help the next Jasmine") arrives at peak emotion. The video button is ready for a 60–90 second graduate story, your most powerful asset.</p>'],
    9: ['Impact calculator + transparency', '<p>The slider lets donors <b>see what their money does</b> (coaching hours, nights of housing, savings matched), which nudges them toward higher amounts.</p><ul><li>Monthly is the default and comes with an identity: the <b>Foundation Builders</b> club.</li><li>The 87¢ chart, EIN and annual report answer the #1 donor objection: "Where does my money go?"</li><li>The dark background makes this the visual climax of the page.</li></ul>'],
    10: ['Voices from every audience', '<p>Testimonials from a <b>graduate, a mentor, a donor and an employer</b>: each visitor finds someone like themselves. Real faces and specifics ("2 hours a month") handle objections better than generic praise.</p>'],
    11: ['Volunteer: make the commitment clear', '<p>Each role shows its <b>time commitment up front</b> (2 hrs/month, one afternoon), the biggest unknown that stops people volunteering. Corporate partners get their own card.</p><p>The interest form is only <b>3 fields</b>. A short form gets far more sign-ups, and the coordinator gathers details later.</p>'],
    12: ['Founder note: a human face', '<p>A personal note from the founder adds warmth and accountability: people give to people. It also links visitors to the full About page. We’ll swap in your real photo, story and signature.</p>'],
    13: ['Blog: SEO + freshness', '<p>Helpful guides ("Your first apartment checklist") rank on Google and bring in both young adults and donors. News and events show the organization is active.</p><p>This will be managed from the CMS, so your team can publish without a developer.</p>'],
    14: ['FAQ: answer objections before they leave', '<p>Two tabs, one for donors and volunteers and one for young adults, so each group only sees its own questions. These cover the last-minute doubts that stop conversions: tax-deductibility, cancelling monthly gifts, cost, confidentiality and documents.</p>'],
    15: ['Final call to action: both paths again', '<p>Visitors who scroll to the bottom are interested but not yet convinced. We repeat both paths with a strong closing line, so nobody reaches the end of the page without a clear next step.</p>'],
    16: ['Footer: capture "not yet" visitors', '<p>Most visitors won’t act on their first visit. The monthly newsletter captures them so you can build a relationship and ask again later. Email is still the top channel for nonprofit fundraising.</p><p>Address, phone, EIN and policy links complete the trust picture (and help local SEO).</p>'],
    17: ['Mobile: thumb-reach actions', '<p>On phones (most nonprofit traffic), a slim bar appears after the hero with <b>Get support</b> and <b>Donate</b> always within thumb reach. It hides itself at the final CTA so it never doubles up.</p>'],
    18: ['The donation flow + extras', '<ul><li><b>3 short steps</b> (amount, details, payment) with a progress bar, so it never feels endless.</li><li>One-time donors get a gentle <b>"Make it monthly?"</b> upsell at half the amount.</li><li><b>Cover the fees</b> checkbox (most donors accept) and an <b>In honor of</b> option.</li><li>Apple Pay, Google Pay and PayPal for one-tap giving. A live campaign meter and recent-gift ticker on the side add social proof.</li><li>The thank-you screen asks donors to share.</li><li>On desktop, a one-time <b>exit-intent</b> message offers the newsletter or a $10 gift to visitors who are about to leave.</li></ul><p>In production this connects to a secure processor (e.g. Givebutter, Donorbox or Stripe) with recurring giving and receipts.</p><p><button type="button" class="btn btn--sun btn--sm js-try-donate">Try the donate flow</button></p>']
  };
  var NMAX = 18, nCur = 1, notesOn = false;
  var nPanel = $('.notes'), nToggle = $('.js-notes-toggle');
  $$('[data-note]').forEach(function (s) {
    var n = s.getAttribute('data-note'), pin = document.createElement('button');
    pin.type = 'button'; pin.className = 'note-pin'; pin.textContent = n; pin.hidden = true;
    pin.setAttribute('aria-label', 'Design note ' + n + ': ' + NOTES[n][0]);
    pin.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); showNote(+n, false); });
    s.appendChild(pin);
  });
  function showNote(n, scroll) {
    nCur = n; nPanel.hidden = false;
    var dd = NOTES[n];
    $('.js-n-k').textContent = n + ' / ' + NMAX + ' · Design note';
    $('.js-n-t').textContent = dd[0];
    $('.js-n-b').innerHTML = dd[1];
    $$('.note-pin').forEach(function (p) { p.classList.toggle('is-cur', +p.textContent === n); });
    $$('[data-note]').forEach(function (s) { s.classList.toggle('is-noted', +s.getAttribute('data-note') === n); });
    var t = $('[data-note="' + n + '"]');
    if (scroll && t && t.offsetParent !== null && n !== 2 && n !== 17) {
      var y = t.getBoundingClientRect().top + window.scrollY - (n === 1 ? 0 : 90);
      window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
    }
    var tryBtn = $('.js-try-donate', nPanel);
    if (tryBtn) tryBtn.addEventListener('click', function () { openDonate(100, 'once'); });
    $('.js-n-prev').disabled = n === 1;
    $('.js-n-next').textContent = n === NMAX ? 'Finish' : 'Next →';
  }
  function setNotes(on) {
    notesOn = on;
    document.body.classList.toggle('notes-on', on);
    nToggle.setAttribute('aria-pressed', on);
    $('.js-notes-label').textContent = on ? 'Hide notes' : 'Why this layout?';
    $$('.note-pin').forEach(function (p) { p.hidden = !on; });
    if (on) showNote(nCur, true); else { nPanel.hidden = true; $$('.is-noted').forEach(function (s) { s.classList.remove('is-noted'); }); }
  }
  nToggle.addEventListener('click', function () { setNotes(!notesOn); });
  $('.notes__x').addEventListener('click', function () { setNotes(false); });
  $('.js-n-prev').addEventListener('click', function () { if (nCur > 1) showNote(nCur - 1, true); });
  $('.js-n-next').addEventListener('click', function () { if (nCur < NMAX) showNote(nCur + 1, true); else setNotes(false); });
  document.addEventListener('keydown', function (e) {
    if (!notesOn || dlg.open || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight' && nCur < NMAX) showNote(nCur + 1, true);
    if (e.key === 'ArrowLeft' && nCur > 1) showNote(nCur - 1, true);
  });
  if (/[?&]notes=1/.test(location.search)) setNotes(true);

  /* ---------- Motion (GSAP) ---------- */
  function motion() {
    if (reduce || !window.gsap) { $$('.rv').forEach(function (el) { el.classList.remove('rv'); }); return; }
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    // Hero intro
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero__h .line > span', { yPercent: 110, duration: 1.1, stagger: .09 })
      .from('.scribble path', { strokeDashoffset: 230, duration: .9, ease: 'power2.inOut' }, '-=.4')
      .from('.hero .eyebrow, .hero__lede, .paths .path, .hero__trust li', { y: 18, opacity: 0, duration: .7, stagger: .06 }, '-=1.1')
      .fromTo('.hero__photo--a', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut', clearProps: 'clipPath' }, 0.1)
      .from('.hero__photo--a img', { scale: 1.25, duration: 1.6, ease: 'power3.out' }, 0.1)
      .from('.hero__photo--b', { scale: .6, opacity: 0, duration: 1, ease: 'back.out(1.6)' }, .55)
      .from('.hero__badge', { scale: 0, rotate: -90, duration: .9, ease: 'back.out(1.8)' }, .8)
      .from('.qd', { y: 50, opacity: 0, duration: 1 }, .7);

    if (!window.ScrollTrigger) return;
    var ST = window.ScrollTrigger;

    // Generic reveals
    var groups = ['.stats li', '.fact', '.pillar', '.steps li', '.tl li', '.voice', '.way', '.post', '.faq__list details', '.fcard', '.seal', '.legend li'];
    groups.forEach(function (sel) {
      gsap.set(sel, { y: 36, opacity: 0 });
      ST.batch(sel, {
        start: 'top 88%', once: true,
        onEnter: function (els) { gsap.fromTo(els, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power3.out', stagger: .08, overwrite: true }); }
      });
    });
    gsap.utils.toArray('.h2, .final__h, .sec-head__p, .why__p, .story__by, .calc, .vform, .founder__copy > p, .elig').forEach(function (el) {
      gsap.from(el, { y: 30, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    // Parallax images
    gsap.utils.toArray('.story__photo img, .final__bg img').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -8 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.to('.hero__photo--b', { y: -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Programs panel scales in
    gsap.from('.programs', { scale: .96, borderRadius: 80, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.programs', start: 'top 95%', end: 'top 40%', scrub: true } });

    // Steps light up as you scroll
    $$('.steps li').forEach(function (li) {
      ST.create({ trigger: li, start: 'top 70%', onEnter: function () { li.classList.add('is-lit'); }, onLeaveBack: function () { li.classList.remove('is-lit'); } });
    });

    // Story timeline fill
    var tlEl = $('.tl'), fill = document.createElement('span');
    fill.className = 'tl__fill'; tlEl.appendChild(fill);
    gsap.to(fill, { height: function () { return tlEl.offsetHeight - 20; }, ease: 'none', scrollTrigger: { trigger: tlEl, start: 'top 75%', end: 'bottom 60%', scrub: true, invalidateOnRefresh: true } });

    // Donut draws in
    $$('.donut__seg').forEach(function (c, i) {
      var da = c.getAttribute('stroke-dasharray');
      gsap.fromTo(c, { attr: { 'stroke-dasharray': '0 301.6' } }, { attr: { 'stroke-dasharray': da }, duration: 1.2, delay: i * .25, ease: 'power2.out', scrollTrigger: { trigger: '.donut', start: 'top 80%', once: true } });
    });

    // Refresh once fonts / images settle
    window.addEventListener('load', function () { ST.refresh(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', motion); else motion();
})();
