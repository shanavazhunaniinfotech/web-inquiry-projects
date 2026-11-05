(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  /* ---------------- Analytics-ready tracking (GA4 via dataLayer) ---------------- */
  window.dataLayer = window.dataLayer || [];
  function track(event, params) { window.dataLayer.push(Object.assign({ event: event }, params || {})); }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (el) track(el.dataset.track, { location: el.dataset.trackLabel || '' });
  });

  /* ---------------- Subtle one-time reveal ---------------- */
  var revealEls = $$('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var sib = el.parentElement ? $$(':scope > [data-reveal]', el.parentElement) : [];
        var idx = Math.max(sib.indexOf(el), 0) % 5;
        el.style.transitionDelay = (idx * 0.07) + 's';
        el.classList.add('is-in');
        rio.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { rio.observe(el); });
    // Safety: never leave content hidden (e.g. when jumping by anchor)
    window.addEventListener('hashchange', function () { revealEls.forEach(function (el) { el.classList.add('is-in'); }); });
  }
  function revealWithin(target) { $$('[data-reveal]', target).forEach(function (el) { el.classList.add('is-in'); }); if (target.hasAttribute && target.hasAttribute('data-reveal')) target.classList.add('is-in'); }

  /* ---------------- Mobile menu ---------------- */
  var menuBtn = $('.menu-btn');
  var mnav = $('#mobileNav');
  function openMenu() {
    mnav.hidden = false;
    requestAnimationFrame(function () { mnav.classList.add('is-open'); });
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (mnav.hidden) return;
    mnav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    document.documentElement.style.overflow = '';
    setTimeout(function () { if (!mnav.classList.contains('is-open')) mnav.hidden = true; }, 350);
  }
  menuBtn.addEventListener('click', function () { mnav.hidden ? openMenu() : closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* anchor links: close menu, make target content visible */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    closeMenu();
    if (id.length > 1) { var t = $(id); if (t) revealWithin(t); }
  });

  /* ---------------- Scroll-driven UI ---------------- */
  var header = $('.header');
  var bar = $('.progress span');
  var mbar = $('[data-mbar]');
  var waFloat = $('.wa-float');
  var hero = $('.hero');
  var consult = $('#consultation');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-solid', y > 40);
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    var past = y > hero.offsetHeight * 0.7;
    var r = consult.getBoundingClientRect();
    var inForm = r.top < window.innerHeight * 0.7 && r.bottom > window.innerHeight * 0.2;
    mbar.classList.toggle('is-visible', past && !inForm && !document.body.classList.contains('show-notes'));
    waFloat.classList.toggle('is-visible', past && !inForm);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var t = $(a.getAttribute('href')); if (t) navIO.observe(t); });
  }

  /* ---------------- Count-up (founder stat) ---------------- */
  function countTo(el, end, dur) {
    if (reduce) { el.textContent = end; return; }
    var t0 = performance.now();
    (function step(t) {
      var p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  if (!reduce && 'IntersectionObserver' in window) {
    $$('[data-count]').forEach(function (el) {
      var end = +el.dataset.count;
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); countTo(el, end, 1600); } }, { threshold: 0.5 });
      io.observe(el);
    });
  }

  /* ---------------- Lead form prefill from anywhere on the page ---------------- */
  var form = $('#leadForm');
  var context = [];
  function setRadio(name, value) {
    var input = $$('input[name="' + name + '"]', form).filter(function (i) { return i.value === value; })[0];
    if (input) { input.checked = true; input.dispatchEvent(new Event('input', { bubbles: true })); return true; }
    return false;
  }
  function addContext(line) {
    var key = line.split(':')[0];
    context = context.filter(function (l) { return l.split(':')[0] !== key; });
    context.push(line);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-stage], [data-stage-type], [data-stage-country]');
    if (!el || el.hasAttribute('data-scroll-only')) return;
    if (el.dataset.stage && !setRadio('stage', el.dataset.stage)) addContext('Interest: ' + el.dataset.stage);
    if (el.dataset.stageType) addContext('Consultation type: ' + el.dataset.stageType);
    if (el.dataset.stageCountry) {
      var sel = $('#fResidency');
      var opt = $$('option', sel).filter(function (o) { return o.textContent === el.dataset.stageCountry; })[0];
      if (opt) sel.value = opt.textContent;
    }
    track('form_prefill', { value: el.dataset.stage || el.dataset.stageType || el.dataset.stageCountry });
  });

  /* ---------------- Readiness check ---------------- */
  var quiz = $('#quiz');
  var qs = $$('.quiz__q', quiz);
  var qBar = $('.quiz__bar span', quiz);
  var qBack = $('[data-quiz-back]', quiz);
  var qStep = $('[data-quiz-step]', quiz);
  var qResult = $('.quiz__result', quiz);
  var qi = 0;
  function showQ(i) {
    qs.forEach(function (q, n) { q.classList.toggle('is-active', n === i); });
    qi = i;
    qBar.style.width = ((i + 1) / qs.length * 100) + '%';
    qStep.textContent = i + 1;
    qBack.disabled = i === 0;
  }
  qs.forEach(function (q, n) {
    q.addEventListener('change', function () {
      if (n === 0) track('quiz_start');
      setTimeout(function () { n < qs.length - 1 ? showQ(n + 1) : finishQuiz(); }, 250);
    });
  });
  qBack.addEventListener('click', function () { if (qi > 0) showQ(qi - 1); });
  function finishQuiz() {
    var score = 0, labels = [];
    qs.forEach(function (q) { var c = $('input:checked', q); if (c) { score += +c.value; labels.push(c.dataset.label); } q.classList.remove('is-active'); });
    quiz.classList.add('is-done');
    qResult.hidden = false;
    var v, adv;
    if (score >= 8) { v = 'Well prepared'; adv = 'You are in a strong position. A short consultation can confirm your budget and lender strategy, so you can move decisively when the right property appears.'; }
    else if (score >= 5) { v = 'Nearly ready'; adv = 'A few points need clarity, typically deposit, income documentation or currency. These are exactly what a consultation resolves before you start viewing.'; }
    else { v = 'The ideal time to talk'; adv = 'You are early in the journey, which is the best time to get advice. Understanding your options now saves time and avoids disappointment later.'; }
    $('[data-quiz-verdict]', quiz).textContent = v;
    $('[data-quiz-advice]', quiz).textContent = adv;
    var gauge = $('[data-gauge]', quiz);
    requestAnimationFrame(function () { gauge.style.strokeDashoffset = 326.7 * (1 - score / 10); });
    countTo($('[data-quiz-score]', quiz), score, 1000);
    addContext('Readiness check: ' + score + '/10 (' + v + ') · ' + labels.join(', '));
    var res = $('input[name="q1"]:checked', quiz);
    if (res && res.dataset.label === 'Barbados resident') $('#fResidency').value = 'Barbados';
    var tf = $('input[name="q5"]:checked', quiz);
    if (tf) setRadio('timeframe', { 'Within 3 months': 'Within 3 months', '3–12 months': '6–12 months', '12+ months': '12+ months' }[tf.dataset.label]);
    track('quiz_complete', { score: score });
  }
  $('[data-quiz-restart]', quiz).addEventListener('click', function () {
    $$('input', quiz).forEach(function (i) { i.checked = false; });
    qResult.hidden = true; quiz.classList.remove('is-done');
    $('[data-gauge]', quiz).style.strokeDashoffset = 326.7;
    showQ(0);
  });

  /* ---------------- Calculator ---------------- */
  var FX = 2, cur = 'USD';
  var cPrice = $('#cPrice'), cDep = $('#cDep'), cRate = $('#cRate');
  var show = {}, out = {};
  $$('[data-show]').forEach(function (el) { show[el.dataset.show] = el; });
  $$('[data-out]').forEach(function (el) { out[el.dataset.out] = el; });
  function fmt(v) { return Math.round(v).toLocaleString('en-US'); }
  function sym(c) { return c === 'USD' ? 'US$' : 'BBD '; }
  function money(usd, c) { return sym(c) + fmt(c === 'USD' ? usd : usd * FX); }
  function fill(r) { r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%'); }
  function term() { return +$('input[name="term"]:checked').value; }
  function calc() {
    var P = +cPrice.value, pct = +cDep.value, rate = +cRate.value, yrs = term();
    var D = P * pct / 100, L = P - D;
    var r = rate / 100 / 12, n = yrs * 12;
    var m = r ? L * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : L / n;
    var interest = Math.max(m * n - L, 0);
    var other = cur === 'USD' ? 'BBD' : 'USD';
    show.price.textContent = money(P, cur);
    show.dep.textContent = pct + '% · ' + money(D, cur);
    show.rate.textContent = rate.toFixed(2) + '%';
    out.monthly.textContent = money(m, cur);
    out.alt.textContent = '≈ ' + money(m, other) + ' per month';
    out.loan.textContent = money(L, cur);
    out.loan2.textContent = money(L, cur);
    out.term.textContent = yrs + ' years';
    out.interest.textContent = money(interest, cur);
    out.ltv.textContent = Math.round(L / P * 100) + '%';
    [cPrice, cDep, cRate].forEach(fill);
    return { P: P, L: L, m: m, rate: rate, yrs: yrs };
  }
  var calcTracked = false;
  $('.calc__form').addEventListener('input', function () { calc(); if (!calcTracked) { calcTracked = true; track('calculator_use'); } });
  $('.calc__form').addEventListener('change', calc);
  var curWrap = $('.currency');
  $$('[data-cur]').forEach(function (b) {
    b.addEventListener('click', function () {
      cur = b.dataset.cur;
      $$('[data-cur]').forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
      curWrap.classList.toggle('is-bbd', cur === 'BBD');
      calc();
    });
  });
  $('[data-calc-cta]').addEventListener('click', function () {
    var c = calc();
    var b = c.P < 500000 ? 'Under $500k' : c.P < 1000000 ? '$500k–$1M' : c.P < 3000000 ? '$1M–$3M' : '$3M+';
    setRadio('budget', b);
    addContext('Calculator: price ' + money(c.P, cur) + ', mortgage ' + money(c.L, cur) + ' at ' + c.rate + '% over ' + c.yrs + ' yrs ≈ ' + money(c.m, cur) + '/month');
  });
  calc();

  /* ---------------- FAQ: one open at a time ---------------- */
  $$('.accordion details').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) {
        $$('.accordion details[open]').forEach(function (o) { if (o !== d) o.open = false; });
        track('faq_open', { q: $('summary', d).textContent });
      }
    });
  });

  /* ---------------- Two-step consultation form ---------------- */
  var steps = $$('.lf__step', form);
  var prog = $$('.lf__progress span', form);
  function goStep(n) {
    steps.forEach(function (s, i) { s.classList.toggle('is-active', i === n - 1); });
    prog.forEach(function (p, i) { p.classList.toggle('is-on', i < n); });
  }
  function validStep(n) {
    var ok = true, step = steps[n - 1];
    $$('.is-invalid', step).forEach(function (x) { x.classList.remove('is-invalid'); });
    $$('select[required], input[required]:not([type="radio"]):not([type="checkbox"])', step).forEach(function (f) {
      var bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
      if (bad) { f.classList.add('is-invalid'); ok = false; }
    });
    $$('.chips', step).forEach(function (c) { if (!$('input:checked', c)) { c.classList.add('is-invalid'); ok = false; } });
    var consent = $('input[name="consent"]', step);
    if (consent && !consent.checked) { consent.closest('.consent').classList.add('is-invalid'); ok = false; }
    $('[data-err="' + n + '"]', form).hidden = ok;
    if (!ok) { var first = $('.is-invalid', step); var f = first && (first.matches('input,select') ? first : $('input', first)); if (f) f.focus({ preventScroll: true }); }
    return ok;
  }
  $('[data-next]', form).addEventListener('click', function () {
    if (!validStep(1)) return;
    goStep(2); track('form_step', { step: 2 });
    var top = $('.form-card').getBoundingClientRect().top;
    if (top < 0) window.scrollTo({ top: top + window.scrollY - 90, behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(function () { $('#fName').focus({ preventScroll: true }); }, 60);
  });
  $('[data-prev]', form).addEventListener('click', function () { goStep(1); });
  form.addEventListener('input', function (e) {
    var t = e.target;
    t.classList.remove('is-invalid');
    var c = t.closest('.chips, .consent'); if (c) c.classList.remove('is-invalid');
    var step = t.closest('.lf__step');
    if (step && !$('.is-invalid', step)) $('[data-err="' + step.dataset.step + '"]', form).hidden = true;
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validStep(2)) return;
    if (form.website.value) return; // honeypot
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    if (context.length) data.context = context.join(' | ');
    // Prototype only: in WordPress this posts to the Elementor / WPForms handler (email notification + spam protection).
    track('generate_lead', { stage: data.stage, budget: data.budget, residency: data.residency, contact_pref: data.contactPref });
    steps.forEach(function (s) { s.classList.remove('is-active'); });
    $('.lf__head', form).hidden = true;
    var done = $('.lf__done', form);
    var first = (data.name || '').trim().split(' ')[0];
    $('[data-done-name]', done).textContent = first ? ', ' + first : '';
    done.hidden = false;
    done.focus({ preventScroll: true });
    try { console.info('Lead (prototype):', data); } catch (err) { /* ignore */ }
  });

  /* ---------------- Design notes overlay (proposal only) ---------------- */
  var notesBtn = $('[data-notes-toggle]');
  var noteN = 0;
  $$('[data-note]').forEach(function (el) {
    var n = document.createElement('aside');
    n.className = 'cro-note';
    var b = document.createElement('b');
    var badge = document.createElement('span');
    badge.textContent = ++noteN;
    b.appendChild(badge);
    b.appendChild(document.createTextNode(el.dataset.noteTitle));
    n.appendChild(b);
    n.appendChild(document.createTextNode(el.dataset.note));
    el.appendChild(n);
  });
  function setNotes(on) {
    document.body.classList.toggle('show-notes', on);
    notesBtn.setAttribute('aria-pressed', String(on));
    $('span', notesBtn).textContent = on ? 'Hide design notes' : 'Why this layout?';
    if (on) revealEls.forEach(function (el) { el.classList.add('is-in'); });
    try { history.replaceState(null, '', on ? '#notes' : location.pathname + location.search); } catch (err) { /* ignore */ }
    onScroll();
  }
  notesBtn.addEventListener('click', function () { setNotes(!document.body.classList.contains('show-notes')); });
  if (location.hash === '#notes') setNotes(true);
})();
