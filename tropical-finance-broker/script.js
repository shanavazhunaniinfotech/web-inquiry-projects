(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Analytics-ready event tracking (GA4 via dataLayer) ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(event, params) {
    window.dataLayer.push(Object.assign({ event: event }, params || {}));
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (el) track(el.dataset.track, { location: el.dataset.trackLabel || '' });
  });

  /* ---------- Header state + mobile menu ---------- */
  var header = $('.header');
  var menuBtn = $('.menu-btn');
  var mobileNav = $('#mobileNav');
  function closeMenu() { mobileNav.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Open menu'); }
  menuBtn.addEventListener('click', function () {
    var open = !mobileNav.classList.contains('is-open');
    mobileNav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('a', mobileNav).forEach(function (a) { a.addEventListener('click', closeMenu); });

  var mbar = $('[data-mbar]');
  var waFloat = $('.wa-float');
  var hero = $('.hero');
  var consult = $('#consultation');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    var pastHero = y > hero.offsetHeight * 0.7;
    var r = consult.getBoundingClientRect();
    var inForm = r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.3;
    mbar.classList.toggle('is-visible', pastHero && !inForm);
    waFloat.classList.toggle('is-visible', pastHero);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* active nav link */
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var t = $(a.getAttribute('href')); if (t) io.observe(t); });
  }

  /* ---------- Lead form helpers: prefill from anywhere on the page ---------- */
  var form = $('#leadForm');
  var context = { source: '', extra: [] };
  function setRadio(name, value) {
    var input = $$('input[name="' + name + '"]', form).filter(function (i) { return i.value === value; })[0];
    if (input) { input.checked = true; return true; }
    return false;
  }
  function addContext(line) {
    if (!line) return;
    context.extra = context.extra.filter(function (l) { return l.split(':')[0] !== line.split(':')[0]; });
    context.extra.push(line);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-stage], [data-stage-type], [data-stage-country]');
    if (!el || el.hasAttribute('data-scroll-only')) return;
    if (el.dataset.stage) {
      if (!setRadio('stage', el.dataset.stage)) addContext('Interest: ' + el.dataset.stage);
    }
    if (el.dataset.stageType) addContext('Consultation type: ' + el.dataset.stageType);
    if (el.dataset.stageCountry) {
      var sel = $('#fResidency');
      var match = $$('option', sel).filter(function (o) { return o.textContent === el.dataset.stageCountry; })[0];
      if (match) sel.value = match.textContent;
    }
    track('form_prefill', { stage: el.dataset.stage || el.dataset.stageType || el.dataset.stageCountry });
  });

  /* ---------- Readiness quiz ---------- */
  var quiz = $('#quiz');
  var qs = $$('.quiz__q', quiz);
  var qi = 0;
  var bar = $('.quiz__bar span', quiz);
  var back = $('[data-quiz-back]', quiz);
  var stepEl = $('[data-quiz-step]', quiz);
  var result = $('.quiz__result', quiz);
  function showQ(i) {
    qs.forEach(function (q, n) { q.classList.toggle('is-active', n === i); });
    qi = i;
    bar.style.width = ((i + 1) / qs.length * 100) + '%';
    stepEl.textContent = i + 1;
    back.disabled = i === 0;
  }
  qs.forEach(function (q, n) {
    q.addEventListener('change', function () {
      if (n === 0) track('quiz_start');
      setTimeout(function () { if (n < qs.length - 1) showQ(n + 1); else finishQuiz(); }, 260);
    });
  });
  back.addEventListener('click', function () { if (qi > 0) showQ(qi - 1); });
  function finishQuiz() {
    var score = 0, labels = [];
    qs.forEach(function (q) { var c = $('input:checked', q); if (c) { score += +c.value; labels.push(c.dataset.label); } });
    qs.forEach(function (q) { q.classList.remove('is-active'); });
    bar.style.width = '100%';
    quiz.classList.add('is-done');
    result.hidden = false;
    var verdict, advice;
    if (score >= 8) { verdict = 'Well prepared'; advice = 'You are in a strong position. A short consultation can confirm your budget and lender strategy so you can move decisively when the right property appears.'; }
    else if (score >= 5) { verdict = 'Nearly ready'; advice = 'A few points need clarity, typically deposit, income documentation or currency. These are exactly what a planning session resolves before you start viewing.'; }
    else { verdict = 'The ideal time to talk'; advice = 'You are early in the journey, which is the best time to get advice. Understanding your options now saves time and avoids disappointment later.'; }
    $('[data-quiz-score]', quiz).textContent = score;
    $('[data-quiz-verdict]', quiz).textContent = verdict;
    $('[data-quiz-advice]', quiz).textContent = advice;
    addContext('Readiness check: ' + score + '/10 (' + verdict + ') · ' + labels.join(', '));
    var res = $('input[name="q1"]:checked', quiz);
    if (res && res.dataset.label === 'Barbados resident') $('#fResidency').value = 'Barbados';
    var tf = $('input[name="q5"]:checked', quiz);
    if (tf) setRadio('timeframe', { 'Within 3 months': 'Within 3 months', '3–12 months': '6–12 months', '12+ months': '12+ months' }[tf.dataset.label]);
    track('quiz_complete', { score: score });
  }
  $('[data-quiz-restart]', quiz).addEventListener('click', function () {
    $$('input', quiz).forEach(function (i) { i.checked = false; });
    result.hidden = true; quiz.classList.remove('is-done'); showQ(0);
  });

  /* ---------- Tabs (accessible) ---------- */
  $$('[data-tabs]').forEach(function (wrap) {
    var tabs = $$('[role="tab"]', wrap);
    function select(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        $('#' + x.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); track('intl_tab', { country: t.textContent }); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
  });

  /* ---------- Mortgage calculator ---------- */
  var cur = 'USD';
  var FX = 2; // BBD per USD (fixed peg)
  var price = $('#cPrice'), range = $('input[type="range"]'), depPct = $('#cDepPct'), dep = $('#cDep'), rate = $('#cRate'), term = $('#cTerm');
  var out = {};
  $$('[data-out]').forEach(function (el) { out[el.dataset.out] = el; });
  function num(v) { return parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0; }
  function fmt(v) { return Math.round(v).toLocaleString('en-US'); }
  function sym(c) { return c === 'USD' ? 'US$' : 'BBD '; }
  function setRangeFill() {
    var p = (num(range.value) - range.min) / (range.max - range.min) * 100;
    range.style.setProperty('--p', p + '%');
  }
  function calc() {
    var P = num(price.value), d = num(dep.value);
    var L = Math.max(P - d, 0);
    var r = num(rate.value) / 100 / 12, n = num(term.value) * 12;
    var m = r ? L * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : L / n;
    var other = cur === 'USD' ? 'BBD' : 'USD';
    var mOther = cur === 'USD' ? m * FX : m / FX;
    out.monthly.textContent = sym(cur) + fmt(m);
    out.alt.textContent = '≈ ' + sym(other) + fmt(mOther) + ' per month';
    out.loan.textContent = sym(cur) + fmt(L);
    out.ltv.textContent = P ? Math.round(L / P * 100) + '%' : '–';
    out.interest.textContent = sym(cur) + fmt(Math.max(m * n - L, 0));
    return { P: P, L: L, m: m };
  }
  function syncDepFromPct() { dep.value = fmt(num(price.value) * Math.min(num(depPct.value), 100) / 100); }
  function syncPctFromDep() { var P = num(price.value); depPct.value = P ? Math.round(num(dep.value) / P * 100) : 0; }
  price.addEventListener('input', function () {
    var v = num(price.value);
    var usd = cur === 'USD' ? v : v / FX;
    range.value = Math.min(Math.max(usd, +range.min), +range.max);
    setRangeFill(); syncDepFromPct(); calc();
  });
  price.addEventListener('blur', function () { price.value = fmt(num(price.value)); });
  range.addEventListener('input', function () {
    var v = num(range.value) * (cur === 'USD' ? 1 : FX);
    price.value = fmt(v); setRangeFill(); syncDepFromPct(); calc();
  });
  depPct.addEventListener('input', function () { syncDepFromPct(); calc(); });
  dep.addEventListener('input', function () { syncPctFromDep(); calc(); });
  dep.addEventListener('blur', function () { dep.value = fmt(num(dep.value)); });
  rate.addEventListener('input', calc);
  term.addEventListener('change', calc);
  var calcTracked = false;
  $('.calc__form').addEventListener('input', function () { if (!calcTracked) { calcTracked = true; track('calculator_use'); } });
  $$('[data-cur]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.cur === cur) return;
      var f = b.dataset.cur === 'BBD' ? FX : 1 / FX;
      cur = b.dataset.cur;
      $$('[data-cur]').forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
      $$('.cur-sym').forEach(function (s) { s.textContent = sym(cur).trim(); });
      $('.calc__fx').textContent = 'BBD 2.00 = USD 1.00 (fixed peg)';
      price.value = fmt(num(price.value) * f);
      dep.value = fmt(num(dep.value) * f);
      calc();
    });
  });
  $('[data-calc-cta]').addEventListener('click', function () {
    var c = calc();
    var usdP = cur === 'USD' ? c.P : c.P / FX;
    var b = usdP < 500000 ? 'Under $500k' : usdP < 1000000 ? '$500k–$1M' : usdP < 3000000 ? '$1M–$3M' : '$3M+';
    setRadio('budget', b);
    addContext('Calculator: price ' + sym(cur) + fmt(c.P) + ', mortgage ' + sym(cur) + fmt(c.L) + ' at ' + rate.value + '% over ' + term.value + ' yrs ≈ ' + sym(cur) + fmt(c.m) + '/month');
  });
  setRangeFill(); calc();

  /* ---------- Two-step lead form ---------- */
  var steps = $$('.lead__step', form);
  var prog = $$('.lead__progress span', form);
  function goStep(n) {
    steps.forEach(function (s, i) { s.classList.toggle('is-active', i === n - 1); });
    prog.forEach(function (p, i) { p.classList.toggle('is-on', i < n); });
  }
  function validStep(n) {
    var ok = true;
    var step = steps[n - 1];
    $$('.is-invalid', step).forEach(function (x) { x.classList.remove('is-invalid'); });
    $$('select[required], input[required]:not([type="radio"]):not([type="checkbox"])', step).forEach(function (f) {
      var bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
      if (bad) { f.classList.add('is-invalid'); ok = false; }
    });
    $$('.chips', step).forEach(function (c) {
      if (!$('input:checked', c)) { c.classList.add('is-invalid'); ok = false; }
    });
    var consent = $('input[name="consent"]', step);
    if (consent && !consent.checked) { consent.closest('.consent').classList.add('is-invalid'); ok = false; }
    $('[data-err="' + n + '"]', form).hidden = ok;
    if (!ok) { var first = $('.is-invalid', step); if (first) (first.matches('input,select') ? first : $('input', first) || first).focus({ preventScroll: false }); }
    return ok;
  }
  $('[data-next]', form).addEventListener('click', function () {
    if (!validStep(1)) return;
    goStep(2); track('form_step', { step: 2 });
    var top = form.getBoundingClientRect().top + window.scrollY - 110;
    if (form.getBoundingClientRect().top < 80) window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(function () { $('#fName').focus({ preventScroll: true }); }, 50);
  });
  $('[data-prev]', form).addEventListener('click', function () { goStep(1); });
  form.addEventListener('input', function (e) {
    var t = e.target;
    t.classList.remove('is-invalid');
    var c = t.closest('.chips, .consent'); if (c) c.classList.remove('is-invalid');
    var step = t.closest('.lead__step');
    if (step && !$('.is-invalid', step)) $('[data-err="' + step.dataset.step + '"]', form).hidden = true;
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validStep(2)) return;
    if (form.website.value) return; // honeypot
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    if (context.extra.length) data.context = context.extra.join(' | ');
    // Prototype: in WordPress this posts to the Elementor/WPForms handler with email notification + Turnstile/reCAPTCHA.
    track('generate_lead', { stage: data.stage, budget: data.budget, residency: data.residency, contact_pref: data.contactPref });
    steps.forEach(function (s) { s.classList.remove('is-active'); });
    $('.lead__progress', form).hidden = true;
    var done = $('.lead__done', form);
    var first = (data.name || '').trim().split(' ')[0];
    $('[data-done-name]', done).textContent = first ? ', ' + first : '';
    done.hidden = false;
    done.focus();
    try { console.info('Lead (prototype):', data); } catch (err) { /* ignore */ }
  });

  /* ---------- Design notes overlay (proposal only) ---------- */
  var notesBtn = $('[data-notes-toggle]');
  var noteN = 0;
  $$('[data-note]').forEach(function (el) {
    var n = document.createElement('aside');
    n.className = 'cro-note';
    var title = document.createElement('b');
    var badge = document.createElement('span');
    badge.textContent = ++noteN;
    title.appendChild(badge);
    title.appendChild(document.createTextNode(el.dataset.noteTitle));
    n.appendChild(title);
    n.appendChild(document.createTextNode(el.dataset.note));
    el.appendChild(n);
  });
  function setNotes(on) {
    document.body.classList.toggle('show-notes', on);
    notesBtn.setAttribute('aria-pressed', String(on));
    $('span', notesBtn).textContent = on ? 'Hide design notes' : 'Why this layout?';
    try { history.replaceState(null, '', on ? '#notes' : location.pathname + location.search); } catch (err) { /* ignore */ }
  }
  notesBtn.addEventListener('click', function () { setNotes(!document.body.classList.contains('show-notes')); });
  if (location.hash === '#notes') setNotes(true);

  /* ---------- Motion (GSAP, progressive enhancement) ---------- */
  function counters() {
    $$('[data-count]').forEach(function (el) {
      var end = +el.dataset.count;
      if (reduceMotion || !('IntersectionObserver' in window)) { el.textContent = end; return; }
      var ob = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        ob.disconnect();
        var t0 = performance.now();
        (function tick(t) {
          var p = Math.min((t - t0) / 1400, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
      ob.observe(el);
    });
  }
  counters();

  window.addEventListener('load', function () {
    if (reduceMotion || !window.gsap) return;
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    gsap.from('.hero__copy > *', { y: 24, opacity: 0, duration: .9, stagger: .09, ease: 'power3.out' });
    gsap.from('.hero__card', { y: 40, opacity: 0, duration: 1.1, delay: .35, ease: 'power3.out' });
    gsap.fromTo('.hero__media img', { scale: 1.08 }, { scale: 1, duration: 2.4, ease: 'power2.out' });
    if (!window.ScrollTrigger) return;
    gsap.to('.hero__media img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    var groups = ['.section-head', '.advisor__photo', '.advisor__copy > *', '.svc', '.journey li', '.quiz', '.tier', '.role', '.intl__intro > *', '.tabs', '.case', '.calc__intro', '.calc__card', '.partners__inner', '.faq__intro', '.accordion details', '.consult__aside', '.form-card', '.closing__inner > *'];
    groups.forEach(function (sel) {
      gsap.utils.toArray(sel).forEach(function (el, i) {
        gsap.from(el, { y: 28, opacity: 0, duration: .8, delay: (i % 3) * .08, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
    });
  });
})();
