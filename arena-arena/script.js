/* Arena Legal Consulting GmbH — home page interactions */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  var isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()); };

  /* ---------- toast ---------- */
  var toastEl = $('.toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3600);
  }

  /* ---------- header ---------- */
  var header = $('.header');
  var mbar = $('.mbar');
  var hero = $('.hero');
  var book = $('#book');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    // sticky mobile CTA: show after hero, hide when booking form is on screen
    var heroBottom = hero.getBoundingClientRect().bottom;
    var b = book.getBoundingClientRect();
    var bookVisible = b.top < window.innerHeight && b.bottom > 0;
    var on = heroBottom < 0 && !bookVisible;
    mbar.classList.toggle('is-on', on);
    document.body.classList.toggle('has-mbar', on);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  var burger = $('.burger'), mnav = $('#mnav');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mnav.classList.toggle('is-open', open);
  });
  $$('a', mnav).forEach(function (a) {
    a.addEventListener('click', function () {
      burger.setAttribute('aria-expanded', 'false');
      mnav.classList.remove('is-open');
    });
  });

  /* active nav link */
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (l) { var t = $(l.getAttribute('href')); if (t) secObs.observe(t); });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = $$('.reveal');
  // once revealed, drop the reveal transition so hover effects stay snappy
  function finish(el) {
    setTimeout(function () { el.classList.remove('reveal', 'is-in'); el.style.transitionDelay = ''; }, 1300);
  }
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          // small stagger for siblings
          var sibs = $$('.reveal', el.parentElement);
          var i = Math.max(0, sibs.indexOf(el));
          el.style.transitionDelay = Math.min(i * 80, 320) + 'ms';
          el.classList.add('is-in');
          io.unobserve(el);
          finish(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }
  // safety net: never leave content hidden
  setTimeout(function () {
    reveals.forEach(function (el) {
      if (el.classList.contains('reveal') && el.getBoundingClientRect().top < window.innerHeight) { el.classList.add('is-in'); finish(el); }
    });
  }, 2500);

  /* ---------- counters ---------- */
  function countUp(el) {
    var end = +el.getAttribute('data-count');
    if (reduced) { el.textContent = end.toLocaleString('en-US'); return; }
    var start = null, dur = 1600;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else counters.forEach(countUp);

  /* ---------- GSAP hero intro + parallax (progressive enhancement) ---------- */
  window.addEventListener('load', function () {
    if (!window.gsap || reduced) return;
    var gsap = window.gsap;
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero .eyebrow', { y: 16, opacity: 0, duration: .6 })
      .from('.hero__title .line > span', { yPercent: 110, duration: 1, stagger: .12 }, '-=.3')
      .from('.hero__lead, .hero__actions, .hero__assure, .hero__proof', { y: 20, opacity: 0, duration: .7, stagger: .08 }, '-=.6')
      .from('.hero__photo img', { clipPath: 'inset(100% 0 0 0)', duration: 1.1, ease: 'power4.inOut' }, 0.2)
      .from('.triage', { y: 40, opacity: 0, duration: .8 }, '-=.6')
      .from('.chip--float', { scale: .8, opacity: 0, duration: .5, stagger: .15 }, '-=.4');

    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
      gsap.to('.hero__photo img', { yPercent: 8, scale: 1.06, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__glow', { yPercent: 30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.utils.toArray('.step__n').forEach(function (n, i) {
        gsap.from(n, { scale: .4, opacity: 0, duration: .6, delay: i * .15, ease: 'back.out(2)', scrollTrigger: { trigger: '.steps', start: 'top 80%' } });
      });
    }
  });

  /* ---------- hero triage (multi-step micro-commitment form) ---------- */
  var tri = $('#triage');
  var triPanes = $$('.triage__pane', tri);
  var triBar = $('.triage__bar span', tri);
  var triStep = $('.triage__step b', tri);
  var triStepWrap = $('.triage__step', tri);
  function triGo(n) {
    triPanes.forEach(function (p) { p.classList.toggle('is-active', +p.getAttribute('data-step') === n); });
    triBar.style.width = (n / 3 * 100) + '%';
    triStep.textContent = n;
    if (n === 3) { var f = $('#t-name'); if (f && window.innerWidth > 720) f.focus({ preventScroll: true }); }
  }
  $$('input[name="area"]', tri).forEach(function (r) { r.addEventListener('change', function () { setTimeout(function () { triGo(2); }, 220); }); });
  $$('input[name="urgency"]', tri).forEach(function (r) { r.addEventListener('change', function () { setTimeout(function () { triGo(3); }, 220); }); });
  $$('.triage__back', tri).forEach(function (b) {
    b.addEventListener('click', function () { var cur = +b.closest('.triage__pane').getAttribute('data-step'); triGo(cur - 1); });
  });

  function validate(form, rules) {
    var ok = true;
    rules.forEach(function (r) {
      var el = form.querySelector(r.sel);
      if (!el) return;
      var good = r.test(el);
      var wrap = el.closest('.field') || el.closest('.consent');
      if (wrap) wrap.classList.toggle('is-error', !good);
      if (!good && ok) { el.focus(); ok = false; }
      if (!good) ok = false;
    });
    return ok;
  }
  var notEmpty = function (el) { return el.value.trim().length > 1; };
  var mailOk = function (el) { return isEmail(el.value); };
  var checked = function (el) { return el.checked; };

  tri.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = validate(tri, [
      { sel: '[name="name"]', test: notEmpty },
      { sel: '[name="email"]', test: mailOk },
      { sel: '[name="consent"]', test: checked }
    ]);
    if (!ok) { toast('Please complete the highlighted fields.'); return; }
    triPanes.forEach(function (p) { p.classList.remove('is-active'); });
    $('.triage__head', tri).hidden = true;
    $('.triage__done', tri).hidden = false;
    triStepWrap.textContent = '';
    // prefill booking form for a seamless next step
    var area = tri.querySelector('[name="area"]:checked');
    $('#b-name').value = $('#t-name').value;
    $('#b-mail').value = $('#t-mail').value;
    $('#b-tel').value = $('#t-tel').value;
    if (area) setArea(area.value.replace('&amp;', '&'));
  });

  /* ---------- service cards preselect the topic ---------- */
  function setArea(v) {
    var sel = $('#b-area');
    $$('option', sel).forEach(function (o) { if (o.textContent === v) sel.value = o.value || o.textContent; });
  }
  $$('.card[data-area]').forEach(function (c) {
    c.addEventListener('click', function () { setArea(c.getAttribute('data-area')); });
  });

  /* ---------- booking widget ---------- */
  var daysEl = $('.days'), timesEl = $('.times');
  var TIMES = ['09:00', '10:30', '12:00', '13:30', '14:30', '15:30', '16:30', '18:00'];
  var selDay = null, selTime = null;
  var now = new Date();
  var days = [];
  var d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  while (days.length < 5) {
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var isToday = function (x) { return x.toDateString() === now.toDateString(); };

  function radioKeys(container) {
    container.addEventListener('keydown', function (e) {
      var items = $$('.slot:not(:disabled)', container);
      var i = items.indexOf(document.activeElement);
      if (i < 0) return;
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = items[(i + 1) % items.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = items[(i - 1 + items.length) % items.length];
      if (n) { e.preventDefault(); n.focus(); n.click(); }
    });
  }

  days.forEach(function (day, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'slot';
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', 'false');
    b.innerHTML = '<small>' + (isToday(day) ? 'Today' : wd[day.getDay()]) + '</small><b>' + day.getDate() + '</b><span class="m">' + mo[day.getMonth()] + '</span>';
    b.addEventListener('click', function () {
      $$('.slot', daysEl).forEach(function (s) { s.setAttribute('aria-checked', 'false'); s.tabIndex = -1; });
      b.setAttribute('aria-checked', 'true'); b.tabIndex = 0;
      selDay = day; renderTimes(day, i);
    });
    b.tabIndex = i === 0 ? 0 : -1;
    daysEl.appendChild(b);
  });
  radioKeys(daysEl); radioKeys(timesEl);

  function renderTimes(day, idx) {
    timesEl.innerHTML = '';
    selTime = null;
    var first = true;
    TIMES.forEach(function (t, j) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'slot';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', 'false');
      b.textContent = t;
      var hm = t.split(':');
      var past = isToday(day) && (+hm[0] * 60 + +hm[1]) <= (now.getHours() * 60 + now.getMinutes() + 30);
      var booked = ((idx * 3 + j * 5) % 7) === 0; // realistic "already booked" slots
      if (past || booked) { b.disabled = true; b.setAttribute('aria-label', t + ' unavailable'); }
      else { b.tabIndex = first ? 0 : -1; first = false; }
      b.addEventListener('click', function () {
        $$('.slot', timesEl).forEach(function (s) { s.setAttribute('aria-checked', 'false'); if (!s.disabled) s.tabIndex = -1; });
        b.setAttribute('aria-checked', 'true'); b.tabIndex = 0;
        selTime = t;
      });
      timesEl.appendChild(b);
    });
    if (first) { // no slots left today → jump to next day
      var nextBtn = $$('.slot', daysEl)[idx + 1];
      if (nextBtn) nextBtn.click();
    }
  }
  // preselect first day with free slots
  $$('.slot', daysEl)[0].click();
  // hero chip mirrors the real next free slot
  var firstFree = $('.slot:not(:disabled)', timesEl);
  var chipStrong = $('.chip--a strong');
  if (firstFree && selDay && chipStrong) {
    chipStrong.textContent = (isToday(selDay) ? 'today' : wd[selDay.getDay()]) + ', ' + firstFree.textContent;
  }

  var booker = $('#booker');
  var bNote = $('.booker__note', booker);
  booker.addEventListener('submit', function (e) {
    e.preventDefault();
    bNote.textContent = '';
    if (!selTime) { bNote.textContent = 'Please choose a time slot.'; var f = $('.slot:not(:disabled)', timesEl); if (f) f.focus(); return; }
    var ok = validate(booker, [
      { sel: '[name="name"]', test: notEmpty },
      { sel: '[name="phone"]', test: function (el) { return el.value.replace(/\D/g, '').length >= 6; } },
      { sel: '[name="email"]', test: mailOk },
      { sel: '[name="area"]', test: function (el) { return !!el.value; } },
      { sel: '[name="consent"]', test: checked }
    ]);
    if (!ok) { bNote.textContent = 'Please complete the highlighted fields.'; return; }
    $('.booker__pane', booker).classList.remove('is-active');
    var done = $('.booker__done', booker);
    done.hidden = false;
    $('.booker__summary', booker).textContent = wd[selDay.getDay()] + ', ' + selDay.getDate() + ' ' + mo[selDay.getMonth()] + ' at ' + selTime + ' (CET)';
    booker.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  });
  // clear error state on input
  $$('.field input, .field select, .consent input').forEach(function (el) {
    el.addEventListener('input', function () { var w = el.closest('.field') || el.closest('.consent'); if (w) w.classList.remove('is-error'); });
    el.addEventListener('change', function () { var w = el.closest('.field') || el.closest('.consent'); if (w) w.classList.remove('is-error'); });
  });

  /* ---------- lead magnet forms ---------- */
  function magnet(form, after) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = form.querySelector('input');
      if (!isEmail(inp.value)) { form.classList.add('is-error'); inp.focus(); toast('Please enter a valid email address.'); return; }
      form.classList.remove('is-error');
      form.innerHTML = '<p style="padding:12px 18px;font-weight:600;color:#0d1b2a">✓ On its way — check your inbox.</p>';
      store.set('arena_lead', '1');
      toast('Checklist sent! Check your inbox.');
      if (after) after();
    });
  }
  magnet($('#magnet-form'));
  magnet($('#exit-form'), function () { setTimeout(closeModal, 1400); });

  /* ---------- exit-intent modal (desktop, once per session) ---------- */
  var modal = $('#exit-modal');
  var lastFocus = null;
  function openModal() {
    if (store.sget('arena_exit') || store.get('arena_lead') || document.body.classList.contains('cro-on')) return;
    store.sset('arena_exit', '1');
    lastFocus = document.activeElement;
    modal.hidden = false;
    $('#x-mail').focus();
  }
  function closeModal() { modal.hidden = true; if (lastFocus) lastFocus.focus(); }
  $('.modal__x', modal).addEventListener('click', closeModal);
  $('.modal__no', modal).addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  var armed = false;
  setTimeout(function () { armed = true; }, 12000); // never on arrival
  document.addEventListener('mouseout', function (e) {
    if (!armed || e.relatedTarget || e.clientY > 8) return;
    if (window.matchMedia('(hover: hover) and (min-width: 900px)').matches) openModal();
  });

  /* ---------- cookie consent ---------- */
  var cookie = $('#cookie');
  // shown after first scroll interaction (or 8s) so it never hides the hero CTA on arrival.
  // No non-essential cookies are set before consent.
  if (!store.get('arena_cookie')) {
    var showCookie = function () {
      window.removeEventListener('scroll', onFirstScroll);
      if (!store.get('arena_cookie')) cookie.hidden = false;
    };
    var onFirstScroll = function () { if (window.scrollY > 300) showCookie(); };
    window.addEventListener('scroll', onFirstScroll, { passive: true });
    setTimeout(showCookie, 8000);
  }
  $$('[data-cookie]').forEach(function (b) {
    b.addEventListener('click', function () {
      store.set('arena_cookie', b.getAttribute('data-cookie'));
      cookie.hidden = true;
      toast(b.getAttribute('data-cookie') === 'all' ? 'Thanks — preferences saved.' : 'Only essential cookies will be used.');
    });
  });
  $$('[data-open-cookies]').forEach(function (b) { b.addEventListener('click', function () { cookie.hidden = false; }); });

  /* ---------- placeholder legal links ---------- */
  $$('a[href="#privacy"]').forEach(function (a) {
    if (a.closest('.footer__legal') || a.closest('.consent') || a.closest('.cookie')) {
      a.addEventListener('click', function (e) { e.preventDefault(); toast('Imprint & privacy pages will be added in the WordPress build.'); });
    }
  });

  /* ---------- design-rationale mode (CRO notes for the client) ---------- */
  var NOTES = {
    topbar: ['Reassurance bar', 'Answers the 3 biggest fears before the visitor reads a word: “Will they reply?”, “Is it confidential?”, “Do they speak my language?” A live green dot signals availability.'],
    header: ['Sticky header with one CTA', 'Navigation follows the buyer’s questions (what, how, how much, who). The single gold button and phone number stay visible on every scroll position, so the next step is never more than one click away.'],
    hero: ['Hero = the 5-second test', 'Headline states outcome + the #1 objection (price) answered. One primary CTA, one secondary. Risk-reversal ticks and a 4.9★ rating sit right under the buttons. The 3-step case check uses micro-commitments (tap → tap → details), which typically converts far better than a long contact form.'],
    trust: ['Proof before pitch', 'Hard numbers and client logos immediately after the hero borrow credibility while the visitor decides whether to scroll. (All figures are placeholders — to be replaced with your real data.)'],
    pain: ['Problem → solution mirroring', 'Visitors see their own thoughts written in quotes, each paired with a concrete Arena promise. Feeling understood is the strongest trigger for a legal enquiry.'],
    services: ['Services with visible prices', 'Every card shows a “from” fixed fee. Price transparency removes the main reason SMEs avoid lawyers. Each card links to booking and pre-selects the topic in the form.'],
    process: ['Reduce perceived effort', 'Three numbered steps with timeframes show how easy it is to start. The CTA repeats “it’s free” — a low-risk first step for a high-trust service.'],
    compare: ['Positioning by contrast', 'A side-by-side table makes the differentiation obvious in seconds and answers “why not just call any lawyer?”'],
    reviews: ['Social proof with results', 'A featured case story with a concrete result, plus short reviews from different client types (founder, e-commerce, SME, international) so every visitor finds “someone like me”.'],
    band: ['Mid-page conversion point', 'Catches visitors who are already convinced after the reviews — no need to scroll to the end.'],
    team: ['Put a face to the firm', 'Legal advice is bought from people. A personal founder statement, credentials and the team build the trust that photos of gavels never will.'],
    fees: ['Transparent pricing + anchoring', 'Three clear options; the middle “Most popular” retainer is highlighted (decoy/anchor effect) and creates recurring revenue. The free assessment is the zero-risk entry. A written fixed-fee promise closes the objection.'],
    magnet: ['Capture the not-ready-yet', 'Most visitors won’t book on their first visit. A useful free checklist turns them into email leads you can nurture — instead of losing them.'],
    faq: ['Objection handling', 'FAQs answer the last doubts (cost, confidentiality, language, urgency) right before the final form. Each answer ends the doubt and points back to contact.'],
    book: ['Final conversion: calendar booking', 'Visible free slots create gentle urgency and let people self-schedule without back-and-forth emails. Short form, consent checkbox for GDPR, all contact options next to it.'],
    footer: ['Legal-compliant footer', 'Imprint (Impressum), privacy policy and cookie settings are mandatory in Germany. The footer repeats the CTA for visitors who scroll to the very end.']
  };
  var croBtn = $('.cro-toggle');
  var croTxt = $('.cro-toggle__txt');
  var croOn = false;
  function renderCro(on) {
    $$('.cro-pin').forEach(function (p) { p.remove(); });
    document.body.classList.toggle('cro-on', on);
    croBtn.setAttribute('aria-pressed', String(on));
    croTxt.textContent = on ? 'Hide design rationale' : 'Show design rationale';
    if (!on) return;
    var n = 0;
    $$('[data-cro]').forEach(function (sec) {
      var k = sec.getAttribute('data-cro');
      var note = NOTES[k];
      if (!note) return;
      n++;
      var pin = document.createElement('div');
      pin.className = 'cro-pin' + (k === 'hero' || k === 'book' || k === 'compare' ? ' cro-pin--right' : '');
      pin.innerHTML = '<b class="n">' + n + '</b><span><strong></strong></span>';
      pin.querySelector('strong').textContent = note[0];
      pin.querySelector('span').appendChild(document.createTextNode(note[1]));
      sec.appendChild(pin);
    });
  }
  croBtn.addEventListener('click', function () {
    croOn = !croOn;
    renderCro(croOn);
    if (croOn) toast('Design rationale on — scroll to see why each section is there.');
  });
  if (/[?&]notes=1/.test(location.search)) { croOn = true; renderCro(true); }
})();
