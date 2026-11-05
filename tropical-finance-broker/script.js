(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lenis = null;

  /* ---------------- Analytics-ready tracking (GA4 via dataLayer) ---------------- */
  window.dataLayer = window.dataLayer || [];
  function track(event, params) { window.dataLayer.push(Object.assign({ event: event }, params || {})); }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (el) track(el.dataset.track, { location: el.dataset.trackLabel || '' });
  });

  /* ---------------- Smooth anchor scrolling ---------------- */
  function scrollToEl(target) {
    var offset = target.id === 'consultation' ? -70 : -80;
    if (lenis) lenis.scrollTo(target, { offset: offset, duration: 1.4 });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id === '#' || id === '#privacy') return;
    var target = id === '#top' ? document.body : $(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (id === '#top') { if (lenis) lenis.scrollTo(0, { duration: 1.4 }); else window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    scrollToEl(target);
  });

  /* ---------------- Mobile menu ---------------- */
  var menuBtn = $('.menu-btn');
  var mnav = $('#mobileNav');
  function openMenu() {
    mnav.hidden = false;
    requestAnimationFrame(function () { mnav.classList.add('is-open'); });
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
    document.documentElement.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }
  function closeMenu() {
    if (mnav.hidden) return;
    mnav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    document.documentElement.style.overflow = '';
    if (lenis) lenis.start();
    setTimeout(function () { if (!mnav.classList.contains('is-open')) mnav.hidden = true; }, 450);
  }
  menuBtn.addEventListener('click', function () { mnav.hidden ? openMenu() : closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------------- Scroll-driven UI ---------------- */
  var header = $('.header');
  var bar = $('.progress span');
  var mbar = $('[data-mbar]');
  var waFloat = $('.wa-float');
  var hero = $('.hero');
  var consult = $('#consultation');
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-solid', y > 40);
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    var past = y > hero.offsetHeight * 0.75;
    var r = consult.getBoundingClientRect();
    var inForm = r.top < window.innerHeight * 0.7 && r.bottom > window.innerHeight * 0.2;
    mbar.classList.toggle('is-visible', past && !inForm && !document.body.classList.contains('show-notes'));
    waFloat.classList.toggle('is-visible', past && !inForm);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var t = $(a.getAttribute('href')); if (t) navIO.observe(t); });

    /* play videos only when visible */
    var vidIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
      });
    }, { threshold: 0.05 });
    $$('video').forEach(function (v) { if (reduce) { v.removeAttribute('autoplay'); v.pause(); } else vidIO.observe(v); });
  }

  /* ---------------- Lead form prefill from anywhere ---------------- */
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

  /* ---------------- Readiness quiz ---------------- */
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
      setTimeout(function () { n < qs.length - 1 ? showQ(n + 1) : finishQuiz(); }, 280);
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
    else if (score >= 5) { v = 'Nearly ready'; adv = 'A few points need clarity, typically deposit, income documentation or currency. These are exactly what a planning session resolves before you start viewing.'; }
    else { v = 'The ideal time to talk'; adv = 'You are early in the journey, which is the best time to get advice. Understanding your options now saves time and avoids disappointment later.'; }
    var scoreEl = $('[data-quiz-score]', quiz);
    $('[data-quiz-verdict]', quiz).textContent = v;
    $('[data-quiz-advice]', quiz).textContent = adv;
    var gauge = $('[data-gauge]', quiz);
    requestAnimationFrame(function () { gauge.style.strokeDashoffset = 326.7 * (1 - score / 10); });
    countTo(scoreEl, score, 1200);
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

  /* ---------------- Tabs ---------------- */
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

  /* ---------------- World clocks ---------------- */
  function tick() {
    $$('[data-tz]').forEach(function (el) {
      try { el.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: el.dataset.tz }).format(new Date()); } catch (e) { /* ignore */ }
    });
  }
  tick(); setInterval(tick, 30000);

  /* ---------------- Calculator ---------------- */
  var FX = 2, cur = 'USD';
  var cPrice = $('#cPrice'), cDep = $('#cDep'), cRate = $('#cRate');
  var show = {}, out = {};
  $$('[data-show]').forEach(function (el) { show[el.dataset.show] = el; });
  $$('[data-out]').forEach(function (el) { out[el.dataset.out] = el; });
  var ringP = $('[data-ring-p]');
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
    var total = m * n, interest = Math.max(total - L, 0);
    var other = cur === 'USD' ? 'BBD' : 'USD';
    show.price.textContent = money(P, cur);
    show.dep.textContent = pct + '% · ' + money(D, cur);
    show.rate.textContent = rate.toFixed(2) + '%';
    out.monthly.textContent = money(m, cur);
    out.alt.textContent = '≈ ' + money(m, other);
    out.loan.textContent = money(L, cur);
    out.interest.textContent = money(interest, cur);
    out.ltv.textContent = Math.round(L / P * 100) + '%';
    ringP.style.strokeDashoffset = 414.69 * (1 - (total ? L / total : 1));
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

  /* ---------------- Case study carousel ---------------- */
  var cases = $$('.case');
  var caseN = $('[data-case-n]');
  var caseBar = $('.cases__bar span');
  var ci = 0, caseTimer = null, caseStart = 0, CASE_MS = 7000, casesVisible = false, casePaused = false;
  function showCase(i) {
    ci = (i + cases.length) % cases.length;
    cases.forEach(function (c, n) { c.classList.toggle('is-active', n === ci); });
    caseN.textContent = '0' + (ci + 1);
    caseStart = performance.now();
  }
  function caseLoop(t) {
    if (casesVisible && !casePaused && !reduce) {
      var p = (t - caseStart) / CASE_MS;
      if (p >= 1) { showCase(ci + 1); p = 0; }
      caseBar.style.transform = 'scaleX(' + p + ')';
    } else { caseStart = t - (parseFloat((caseBar.style.transform.match(/[\d.]+/) || [0])[0]) * CASE_MS); }
    caseTimer = requestAnimationFrame(caseLoop);
  }
  $('[data-case-next]').addEventListener('click', function () { showCase(ci + 1); track('case_nav'); });
  $('[data-case-prev]').addEventListener('click', function () { showCase(ci - 1); track('case_nav'); });
  var casesEl = $('.cases');
  casesEl.addEventListener('mouseenter', function () { casePaused = true; });
  casesEl.addEventListener('mouseleave', function () { casePaused = false; });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { casesVisible = en[0].isIntersecting; }, { threshold: 0.3 }).observe(casesEl);
  caseStart = performance.now(); caseTimer = requestAnimationFrame(caseLoop);
  var tx = 0;
  casesEl.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  casesEl.addEventListener('touchend', function (e) { var d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) showCase(ci + (d < 0 ? 1 : -1)); });

  /* ---------------- Accordion (smooth height) ---------------- */
  $$('.accordion details').forEach(function (d) {
    var s = $('summary', d), body = $('.acc__body', d);
    s.addEventListener('click', function (e) {
      if (reduce || !body.animate) return;
      e.preventDefault();
      if (d.open) {
        var a = body.animate({ height: [body.offsetHeight + 'px', '0px'], opacity: [1, 0] }, { duration: 380, easing: 'cubic-bezier(.22,.8,.2,1)' });
        a.onfinish = function () { d.open = false; if (lenis) lenis.resize(); };
      } else {
        $$('.accordion details[open]').forEach(function (o) { if (o !== d) o.open = false; });
        d.open = true;
        var h = body.offsetHeight;
        body.animate({ height: ['0px', h + 'px'], opacity: [0, 1] }, { duration: 450, easing: 'cubic-bezier(.22,.8,.2,1)' }).onfinish = function () { if (lenis) lenis.resize(); };
        track('faq_open', { q: s.textContent });
      }
    });
  });

  /* ---------------- Two-step form ---------------- */
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
    if (form.getBoundingClientRect().top < 0) scrollToEl($('.form-card'));
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
    // Prototype only: in WordPress this posts to the Elementor / WPForms handler (email notification + Turnstile).
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
    try { history.replaceState(null, '', on ? '#notes' : location.pathname + location.search); } catch (err) { /* ignore */ }
    onScroll();
    if (window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 50);
  }
  notesBtn.addEventListener('click', function () { setNotes(!document.body.classList.contains('show-notes')); });
  if (location.hash === '#notes') setNotes(true);

  /* ---------------- Helpers ---------------- */
  function countTo(el, end, dur) {
    if (reduce) { el.textContent = end; return; }
    var t0 = performance.now();
    (function step(t) {
      var p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  function splitWords(el) {
    if (el.dataset.splitDone) return;
    var frag = document.createDocumentFragment();
    function wrap(text, wrapperTag) {
      text.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        var w = document.createElement('span'); w.className = 'w';
        var wi = document.createElement('span'); wi.className = 'wi';
        if (wrapperTag) { var em = document.createElement(wrapperTag); em.textContent = part; wi.appendChild(em); } else wi.textContent = part;
        w.appendChild(wi); frag.appendChild(w);
      });
    }
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) wrap(node.textContent);
      else if (node.nodeType === 1) wrap(node.textContent, node.tagName.toLowerCase());
    });
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    el.textContent = '';
    el.appendChild(frag);
    $$('.w', el).forEach(function (w) { w.setAttribute('aria-hidden', 'true'); });
    el.dataset.splitDone = '1';
  }

  /* counters without GSAP */
  function initCounters() {
    $$('[data-count]').forEach(function (el) {
      var end = +el.dataset.count;
      if (reduce || !('IntersectionObserver' in window)) return;
      el.textContent = '0';
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); countTo(el, end, 1800); } }, { threshold: 0.4 });
      io.observe(el);
    });
  }
  initCounters();

  /* ---------------- Motion: Lenis + GSAP ---------------- */
  window.addEventListener('load', function () {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (reduce || !gsap) return;
    if (ST) gsap.registerPlugin(ST);

    if (window.Lenis) {
      lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
      if (ST) lenis.on('scroll', ST.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* hero intro */
    var heroTitle = $('.hero__title');
    splitWords(heroTitle);
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero__video', { scale: 1.18, duration: 2.6, ease: 'power2.out' }, 0)
      .from($$('.wi', heroTitle), { yPercent: 115, rotate: 3, duration: 1.4, stagger: 0.06 }, 0.2)
      .from('[data-hero-fade]', { y: 26, opacity: 0, duration: 1.1, stagger: 0.12 }, 0.6)
      .from('[data-hero-card]', { y: 50, opacity: 0, duration: 1.3 }, 0.8)
      .from('.journey-pick a', { x: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 1.0)
      .from('.header', { y: -30, opacity: 0, duration: 1 }, 0.3);

    if (!ST) return;

    /* hero scroll-out */
    gsap.to('.hero__video', { scale: 1.12, yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__grid', { yPercent: -10, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });

    /* split headings */
    $$('[data-split]').forEach(function (el) {
      if (el === heroTitle) return;
      splitWords(el);
      gsap.from($$('.wi', el), { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: 0.045, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* generic reveals */
    $$('[data-reveal]').forEach(function (el) {
      if (el.dataset.reveal === 'mask') {
        gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
        var img = $('img', el);
        if (img) gsap.from(img, { scale: 1.3, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      } else {
        gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      }
    });

    /* staggered groups */
    [['.svc-list li', '.svc-list'], ['.tier', '.tiers'], ['.stat', '.stats'], ['.facts li', '.facts'], ['.next li', '.next']].forEach(function (g) {
      var items = $$(g[0]);
      if (!items.length) return;
      gsap.from(items, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: g[1], start: 'top 85%', once: true } });
    });

    /* parallax */
    $$('[data-parallax]').forEach(function (img) {
      var amt = +img.dataset.parallax || 8;
      gsap.fromTo(img, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* horizontal journey (desktop only) */
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', function () {
      document.documentElement.classList.add('has-pin');
      var track = $('.journey-track');
      var dist = function () { return Math.max(track.scrollWidth - window.innerWidth, 0); };
      gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: '.journey-pin', start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 }
      });
      gsap.fromTo('.journey-progress span', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.journey-pin', start: 'top top', end: function () { return '+=' + dist(); }, scrub: true, invalidateOnRefresh: true } });
      gsap.from('.step', { y: 60, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.journey-pin', start: 'top 70%', once: true } });
      return function () { document.documentElement.classList.remove('has-pin'); };
    });

    /* magnetic buttons */
    if (finePointer) {
      $$('[data-magnetic]').forEach(function (btn) {
        var xTo = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'power3' });
        var yTo = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'power3' });
        btn.addEventListener('mousemove', function (e) {
          var r = btn.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.22);
          yTo((e.clientY - r.top - r.height / 2) * 0.3);
        });
        btn.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
      });

      /* service image preview following the cursor */
      var prev = $('.svc-preview'), prevImg = $('img', prev);
      var px = gsap.quickTo(prev, 'x', { duration: 0.7, ease: 'power3' });
      var py = gsap.quickTo(prev, 'y', { duration: 0.7, ease: 'power3' });
      gsap.set(prev, { xPercent: -50, yPercent: -50 });
      var list = $('.svc-list');
      list.addEventListener('mousemove', function (e) { px(e.clientX + 160); py(e.clientY); });
      $$('.svc').forEach(function (s) {
        s.addEventListener('mouseenter', function () {
          if (window.innerWidth < 901) return;
          prevImg.src = s.dataset.img;
          gsap.to(prev, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' });
        });
      });
      list.addEventListener('mouseleave', function () { gsap.to(prev, { opacity: 0, scale: 0.6, duration: 0.5, ease: 'expo.out' }); });
    }

    /* refresh after fonts/images settle */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
    setTimeout(function () { ST.refresh(); }, 600);
  });
})();
