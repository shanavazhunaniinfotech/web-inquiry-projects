(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  document.documentElement.classList.add('js');

  /* ---------- tracking (GA4 dataLayer) ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(ev, p) { window.dataLayer.push(Object.assign({ event: ev }, p || {})); }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (el) track(el.dataset.track, { location: el.dataset.trackLabel || '', design: 'B' });
  });

  /* ---------- reveal ---------- */
  var rv = $$('[data-rv]');
  function showAll() { rv.forEach(function (el) { el.classList.add('in'); }); }
  if (reduce || !hasIO) showAll();
  else {
    var rio = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        var sib = $$(':scope > [data-rv]', x.target.parentElement);
        x.target.style.transitionDelay = (Math.max(sib.indexOf(x.target), 0) % 4) * 0.07 + 's';
        x.target.classList.add('in');
        rio.unobserve(x.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    rv.forEach(function (el) { rio.observe(el); });
  }

  /* ---------- menu ---------- */
  var burger = $('.burger'), menu = $('#menu');
  function openMenu() { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add('open'); }); burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Close menu'); document.documentElement.style.overflow = 'hidden'; }
  function closeMenu() { if (menu.hidden) return; menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); document.documentElement.style.overflow = ''; setTimeout(function () { if (!menu.classList.contains('open')) menu.hidden = true; }, 300); }
  burger.addEventListener('click', function () { menu.hidden ? openMenu() : closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    closeMenu();
    var id = a.getAttribute('href');
    if (id.length > 1) { var t = $(id); if (t) $$('[data-rv]', t).forEach(function (el) { el.classList.add('in'); }); }
  });

  /* ---------- scroll UI ---------- */
  var hd = $('.hd'), mbar = $('[data-mbar]'), consult = $('#consult'), hero = $('.hero'), ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    hd.classList.toggle('solid', y > 30);
    var r = consult.getBoundingClientRect();
    var inForm = r.top < innerHeight * 0.7 && r.bottom > innerHeight * 0.2;
    mbar.classList.toggle('show', y > hero.offsetHeight * 0.6 && !inForm && !document.body.classList.contains('notes'));
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  var navA = $$('.hd__nav a');
  if (hasIO) {
    var nio = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) navA.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + x.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navA.forEach(function (a) { var t = $(a.getAttribute('href')); if (t) nio.observe(t); });

    /* journey scroll-story */
    var steps = $$('.step'), jNum = $('[data-jstep]'), jBar = $('[data-jbar]');
    var sio = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        var n = +x.target.dataset.step;
        steps.forEach(function (s) { s.classList.toggle('on', s === x.target); });
        jNum.textContent = '0' + n;
        jBar.style.width = (n / steps.length * 100) + '%';
      });
    }, { rootMargin: '-40% 0px -45% 0px' });
    steps.forEach(function (s) { sio.observe(s); });
  }

  /* ---------- count-up ---------- */
  function countTo(el, end, dur) {
    if (reduce) { el.textContent = end; return; }
    var t0 = performance.now();
    (function f(t) { var p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0);
  }
  if (!reduce && hasIO) $$('[data-count]').forEach(function (el) {
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); countTo(el, +el.dataset.count, 1500); } }, { threshold: 0.6 });
    io.observe(el);
  });

  /* ---------- prefill ---------- */
  var form = $('#leadForm'), ctx = [];
  function setRadio(name, val) {
    var i = $$('input[name="' + name + '"]', form).filter(function (x) { return x.value === val; })[0];
    if (i) { i.checked = true; i.dispatchEvent(new Event('input', { bubbles: true })); return true; }
    return false;
  }
  function addCtx(line) { var k = line.split(':')[0]; ctx = ctx.filter(function (l) { return l.split(':')[0] !== k; }); ctx.push(line); }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-stage], [data-stage-type], [data-stage-country]');
    if (!el || el.hasAttribute('data-scroll-only')) return;
    if (el.dataset.stage && !setRadio('stage', el.dataset.stage)) addCtx('Interest: ' + el.dataset.stage);
    if (el.dataset.stageType) addCtx('Consultation type: ' + el.dataset.stageType);
    if (el.dataset.stageCountry) { var s = $('#fResidency'); var o = $$('option', s).filter(function (x) { return x.textContent === el.dataset.stageCountry; })[0]; if (o) s.value = o.textContent; }
    track('form_prefill', { value: el.dataset.stage || el.dataset.stageType || el.dataset.stageCountry });
  });

  /* ---------- readiness check ---------- */
  var quiz = $('#quiz'), qs = $$('.quiz__q', quiz), qBar = $('.quiz__bar span', quiz), qBack = $('[data-quiz-back]', quiz), qStep = $('[data-quiz-step]', quiz), qRes = $('.quiz__res', quiz), qi = 0;
  function showQ(i) { qs.forEach(function (q, n) { q.classList.toggle('is-active', n === i); }); qi = i; qBar.style.width = ((i + 1) / qs.length * 100) + '%'; qStep.textContent = i + 1; qBack.disabled = i === 0; }
  qs.forEach(function (q, n) { q.addEventListener('change', function () { if (n === 0) track('quiz_start'); setTimeout(function () { n < qs.length - 1 ? showQ(n + 1) : finish(); }, 250); }); });
  qBack.addEventListener('click', function () { if (qi > 0) showQ(qi - 1); });
  function finish() {
    var score = 0, labels = [];
    qs.forEach(function (q) { var c = $('input:checked', q); if (c) { score += +c.value; labels.push(c.dataset.label); } q.classList.remove('is-active'); });
    quiz.classList.add('done'); qRes.hidden = false;
    var v, a;
    if (score >= 8) { v = 'Well prepared'; a = 'You are in a strong position. A short consultation can confirm your budget and lender strategy, so you can move decisively when the right property appears.'; }
    else if (score >= 5) { v = 'Nearly ready'; a = 'A few points need clarity, typically deposit, income documentation or currency. These are exactly what a consultation resolves before you start viewing.'; }
    else { v = 'The ideal time to talk'; a = 'You are early in the journey, which is the best time to get advice. Understanding your options now saves time and avoids disappointment later.'; }
    $('[data-quiz-verdict]', quiz).textContent = v; $('[data-quiz-advice]', quiz).textContent = a;
    countTo($('[data-quiz-score]', quiz), score, 900);
    addCtx('Readiness check: ' + score + '/10 (' + v + ') · ' + labels.join(', '));
    var r = $('input[name="q1"]:checked', quiz); if (r && r.dataset.label === 'Barbados resident') $('#fResidency').value = 'Barbados';
    var t = $('input[name="q5"]:checked', quiz); if (t) setRadio('timeframe', { 'Within 3 months': 'Within 3 months', '3–12 months': '6–12 months', '12+ months': '12+ months' }[t.dataset.label]);
    track('quiz_complete', { score: score });
  }
  $('[data-quiz-restart]', quiz).addEventListener('click', function () { $$('input', quiz).forEach(function (i) { i.checked = false; }); qRes.hidden = true; quiz.classList.remove('done'); showQ(0); });

  /* ---------- calculator ---------- */
  var FX = 2, cur = 'USD', cP = $('#cPrice'), cD = $('#cDep'), cR = $('#cRate'), show = {}, out = {}, split = $('[data-split-p]');
  $$('[data-show]').forEach(function (el) { show[el.dataset.show] = el; });
  $$('[data-out]').forEach(function (el) { out[el.dataset.out] = el; });
  function fmt(v) { return Math.round(v).toLocaleString('en-US'); }
  function money(usd, c) { return (c === 'USD' ? 'US$' : 'BBD ') + fmt(c === 'USD' ? usd : usd * FX); }
  function fill(r) { r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%'); }
  function calc() {
    var P = +cP.value, pct = +cD.value, rate = +cR.value, yrs = +$('input[name="term"]:checked').value;
    var D = P * pct / 100, L = P - D, r = rate / 1200, n = yrs * 12;
    var m = r ? L * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : L / n;
    var tot = m * n, int = Math.max(tot - L, 0), other = cur === 'USD' ? 'BBD' : 'USD';
    show.price.textContent = money(P, cur); show.dep.textContent = pct + '% · ' + money(D, cur); show.rate.textContent = rate.toFixed(2) + '%';
    out.monthly.textContent = money(m, cur); out.alt.textContent = '≈ ' + money(m, other) + ' per month';
    out.loan.textContent = money(L, cur); out.loan2.textContent = money(L, cur); out.term.textContent = yrs + ' years';
    out.interest.textContent = money(int, cur); out.ltv.textContent = Math.round(L / P * 100) + '%';
    split.style.width = (tot ? L / tot * 100 : 100) + '%';
    [cP, cD, cR].forEach(fill);
    return { P: P, L: L, m: m, rate: rate, yrs: yrs };
  }
  var tracked = false;
  $('.calc__in').addEventListener('input', function () { calc(); if (!tracked) { tracked = true; track('calculator_use'); } });
  $('.calc__in').addEventListener('change', calc);
  $$('[data-cur]').forEach(function (b) { b.addEventListener('click', function () { cur = b.dataset.cur; $$('[data-cur]').forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); }); calc(); }); });
  $('[data-calc-cta]').addEventListener('click', function () {
    var c = calc();
    setRadio('budget', c.P < 500000 ? 'Under $500k' : c.P < 1000000 ? '$500k–$1M' : c.P < 3000000 ? '$1M–$3M' : '$3M+');
    addCtx('Calculator: price ' + money(c.P, cur) + ', mortgage ' + money(c.L, cur) + ' at ' + c.rate + '% over ' + c.yrs + ' yrs ≈ ' + money(c.m, cur) + '/month');
  });
  calc();

  /* ---------- faq: one open ---------- */
  $$('.acc details').forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) { $$('.acc details[open]').forEach(function (o) { if (o !== d) o.open = false; }); track('faq_open'); } }); });

  /* ---------- form ---------- */
  var steps2 = $$('.lf__step', form), prog = $$('.lf__steps span', form);
  function go(n) { steps2.forEach(function (s, i) { s.classList.toggle('on', i === n - 1); }); prog.forEach(function (p, i) { p.classList.toggle('on', i < n); }); }
  function valid(n) {
    var ok = true, st = steps2[n - 1];
    $$('.bad', st).forEach(function (x) { x.classList.remove('bad'); });
    $$('select[required], input[required]:not([type="radio"]):not([type="checkbox"])', st).forEach(function (f) { if (!f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value))) { f.classList.add('bad'); ok = false; } });
    $$('.pills', st).forEach(function (p) { if (!$('input:checked', p)) { p.classList.add('bad'); ok = false; } });
    var c = $('input[name="consent"]', st); if (c && !c.checked) { c.closest('.consent').classList.add('bad'); ok = false; }
    $('[data-err="' + n + '"]', form).hidden = ok;
    if (!ok) { var f = $('.bad', st); f = f && (f.matches('input,select') ? f : $('input', f)); if (f) f.focus({ preventScroll: true }); }
    return ok;
  }
  $('[data-next]', form).addEventListener('click', function () {
    if (!valid(1)) return;
    go(2); track('form_step', { step: 2 });
    var top = $('.fcard').getBoundingClientRect().top; if (top < 0) scrollTo({ top: top + scrollY - 96, behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(function () { $('#fName').focus({ preventScroll: true }); }, 60);
  });
  $('[data-prev]', form).addEventListener('click', function () { go(1); });
  form.addEventListener('input', function (e) {
    var t = e.target; t.classList.remove('bad');
    var w = t.closest('.pills, .consent'); if (w) w.classList.remove('bad');
    var st = t.closest('.lf__step'); if (st && !$('.bad', st)) $('[data-err="' + st.dataset.step + '"]', form).hidden = true;
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!valid(2) || form.website.value) return;
    var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; }); if (ctx.length) data.context = ctx.join(' | ');
    // Prototype only: in WordPress this posts to the Elementor / WPForms handler with email notification and spam protection.
    track('generate_lead', { stage: data.stage, budget: data.budget, residency: data.residency, contact_pref: data.contactPref });
    steps2.forEach(function (s) { s.classList.remove('on'); }); $('.lf__head', form).hidden = true;
    var done = $('.lf__done', form), first = (data.name || '').trim().split(' ')[0];
    $('[data-done-name]', done).textContent = first ? ', ' + first : '';
    done.hidden = false; done.focus({ preventScroll: true });
  });

  /* ---------- design notes (proposal only) ---------- */
  var nb = $('[data-notes-toggle]'), k = 0;
  $$('[data-note]').forEach(function (el) {
    var n = document.createElement('aside'); n.className = 'cro-note';
    var b = document.createElement('b'), s = document.createElement('span'); s.textContent = ++k;
    b.appendChild(s); b.appendChild(document.createTextNode(el.dataset.noteTitle));
    n.appendChild(b); n.appendChild(document.createTextNode(el.dataset.note)); el.appendChild(n);
  });
  function setNotes(on) {
    document.body.classList.toggle('notes', on); nb.setAttribute('aria-pressed', String(on));
    $('span', nb).textContent = on ? 'Hide design notes' : 'Why this layout?';
    if (on) showAll();
    try { history.replaceState(null, '', on ? '#notes' : location.pathname + location.search); } catch (err) { /* ignore */ }
    onScroll();
  }
  nb.addEventListener('click', function () { setNotes(!document.body.classList.contains('notes')); });
  if (location.hash === '#notes') setNotes(true);
})();
