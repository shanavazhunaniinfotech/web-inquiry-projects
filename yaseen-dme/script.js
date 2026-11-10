/* CareWay Medical Supply — home page interactions */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Year + open/closed status ---------- */
  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();
  (function () {
    var el = $('#openStatus'); if (!el) return;
    var d = new Date(), day = d.getDay(), h = d.getHours() + d.getMinutes() / 60;
    var open = (day >= 1 && day <= 5 && h >= 8 && h < 18) || (day === 6 && h >= 9 && h < 14);
    if (!open) { el.textContent = '24/7 support line open'; el.classList.add('is-closed'); }
  })();

  /* ---------- Header: sticky shadow, mobile menu, mega menu ---------- */
  var header = $('.header');
  var mbar = $('#mbar');
  var hero = $('.hero');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    if (mbar && hero) mbar.classList.toggle('is-visible', y > hero.offsetHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var burger = $('#burger'), nav = $('#nav');
  var scrim = $('#navScrim');
  scrim.addEventListener('click', function () { closeNav(); });
  function closeNav() { scrim.classList.remove('is-on'); nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); }
  burger.addEventListener('click', function () {
    var open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    scrim.classList.toggle('is-on', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  var drop = $('.nav__drop'), dropBtn = $('.nav__btn');
  var hoverable = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  function setDrop(open) { drop.classList.toggle('is-open', open); dropBtn.setAttribute('aria-expanded', String(open)); }
  dropBtn.addEventListener('click', function (e) { e.stopPropagation(); setDrop(!drop.classList.contains('is-open')); });
  drop.addEventListener('mouseenter', function () { if (hoverable.matches) setDrop(true); });
  drop.addEventListener('mouseleave', function () { if (hoverable.matches) setDrop(false); });
  document.addEventListener('click', function (e) { if (!drop.contains(e.target)) setDrop(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setDrop(false); closeNav(); closeModal(); hideNote(); } });
  $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { closeNav(); setDrop(false); }); });

  /* ---------- Marquee: duplicate items for seamless loop ---------- */
  var track = $('.marquee__track');
  if (track) {
    $$('li', track).forEach(function (li) { var c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
  }

  /* ---------- Multi-step lead form ---------- */
  var form = $('#leadForm');
  var steps = $$('.lf-step', form);
  var bar = $('#lfBar'), label = $('#lfStepLabel');
  var labels = ['Step 1 of 3: What do you need?', 'Step 2 of 3: Your coverage', 'Step 3 of 3: Where should we call you?'];
  var current = 1;

  function go(n) {
    current = n;
    steps.forEach(function (s) { s.classList.toggle('is-active', +s.dataset.step === n); });
    bar.style.width = (n / 3 * 100) + '%';
    label.textContent = labels[n - 1];
    var first = $('.lf-step.is-active input:not([type=radio]), .lf-step.is-active input[type=radio]', form);
    if (first && n > 1) setTimeout(function () { first.focus({ preventScroll: true }); }, 50);
  }
  function invalid(el, bad) { el.classList.toggle('is-invalid', bad); el.setAttribute('aria-invalid', String(bad)); return bad; }

  // Step 1: picking an equipment chip advances automatically (fewer clicks = more completions)
  $$('input[name=equipment]', form).forEach(function (r) {
    r.addEventListener('change', function () { setTimeout(function () { go(2); }, 220); });
  });
  $$('[data-back]', form).forEach(function (b) { b.addEventListener('click', function () { go(current - 1); }); });
  $$('[data-next]', form).forEach(function (b) {
    b.addEventListener('click', function () {
      var zip = form.elements.namedItem('zip');
      var ins = $('input[name=insurance]:checked', form);
      var bad = invalid(zip, !/^\d{5}$/.test(zip.value.trim()));
      var seg = $('.seg', form);
      seg.style.outline = ins ? '' : '2px solid #c81e1e'; seg.style.outlineOffset = '4px'; seg.style.borderRadius = '12px';
      if (!bad && ins) go(3); else (ins ? zip : $('input[name=insurance]', form)).focus();
    });
  });
  $$('input[name=insurance]', form).forEach(function (r) { r.addEventListener('change', function () { $('.seg', form).style.outline = ''; }); });
  form.elements.namedItem('zip').addEventListener('input', function () { this.value = this.value.replace(/\D/g, '').slice(0, 5); if (/^\d{5}$/.test(this.value)) invalid(this, false); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = form.elements.namedItem('name'), p = form.elements.namedItem('phone');
    var b1 = invalid(n, n.value.trim().length < 2);
    var b2 = invalid(p, p.value.replace(/\D/g, '').length < 10);
    if (b1 || b2) { (b1 ? n : p).focus(); return; }
    // Prototype: in production this posts to the CRM / email / HIPAA-compliant form service.
    steps.forEach(function (s) { s.classList.remove('is-active'); });
    $('.leadform__head', form).hidden = true;
    $('#lfName').textContent = n.value.trim().split(' ')[0];
    $('.lf-done', form).hidden = false;
  });

  // Any "Check coverage" / "Request" link scrolls to the form; data-pick pre-selects the equipment
  function openForm(pick) {
    if (pick) {
      var match = $$('input[name=equipment]', form).filter(function (r) { return r.value === pick; })[0];
      if (match) { match.checked = true; go(2); }
      else { go(2); }
    }
    var target = $('#start');
    var top = target.getBoundingClientRect().top + window.scrollY - (window.innerWidth < 1025 ? 80 : 120);
    window.scrollTo({ top: top, behavior: 'smooth' });
    form.classList.remove('pulse'); void form.offsetWidth; form.classList.add('pulse');
  }
  $$('[data-open-form], [data-pick]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); openForm(a.getAttribute('data-pick')); });
  });
  // Mega-menu links jump to the matching category card
  $$('.mega a').forEach(function (a) {
    a.addEventListener('click', function () {
      var name = a.dataset.cat.split(' ')[0].toLowerCase();
      var card = $$('.cat').filter(function (c) { return c.textContent.toLowerCase().indexOf(name) > -1; })[0];
      if (card) flashCard(card);
    });
  });
  function flashCard(card) {
    $$('.cat.is-hit').forEach(function (c) { c.classList.remove('is-hit'); });
    card.classList.add('is-hit');
    setTimeout(function () { card.classList.remove('is-hit'); }, 2400);
  }

  /* ---------- Equipment finder (search with suggestions) ---------- */
  var catalog = [
    ['Manual wheelchair', 'Wheelchair / Mobility'], ['Lightweight wheelchair', 'Wheelchair / Mobility'], ['Transport chair', 'Wheelchair / Mobility'], ['Power wheelchair', 'Wheelchair / Mobility'], ['Mobility scooter', 'Wheelchair / Mobility'],
    ['Hospital bed', 'Hospital Bed'], ['Semi-electric bed', 'Hospital Bed'], ['Pressure relief mattress', 'Hospital Bed'], ['Bed rails', 'Hospital Bed'], ['Overbed table', 'Hospital Bed'],
    ['Oxygen concentrator', 'Oxygen'], ['Portable oxygen (POC)', 'Oxygen'], ['Nebulizer', 'Oxygen'], ['Pulse oximeter', 'Oxygen'],
    ['CPAP machine', 'CPAP / Sleep'], ['BiPAP machine', 'CPAP / Sleep'], ['CPAP masks & supplies', 'CPAP / Sleep'],
    ['Walker', 'Walker / Rollator'], ['Rollator with seat', 'Walker / Rollator'], ['Cane', 'Walker / Rollator'], ['Knee scooter', 'Walker / Rollator'], ['Crutches', 'Walker / Rollator'],
    ['Shower chair', 'Bathroom Safety'], ['Bedside commode', 'Bathroom Safety'], ['Raised toilet seat', 'Bathroom Safety'], ['Grab bars', 'Bathroom Safety'], ['Transfer bench', 'Bathroom Safety'],
    ['Lift chair recliner', 'Lift Chair / Patient Lift'], ['Patient lift (Hoyer)', 'Lift Chair / Patient Lift'],
    ['Glucose meter', 'Diabetic / Daily Supplies'], ['Test strips', 'Diabetic / Daily Supplies'], ['Knee brace', 'Diabetic / Daily Supplies'], ['Compression stockings', 'Diabetic / Daily Supplies'], ['Back brace', 'Diabetic / Daily Supplies']
  ];
  var fin = $('#finderInput'), list = $('#finderList'), active = -1;
  function render(q) {
    q = q.trim().toLowerCase();
    if (!q) { list.hidden = true; return; }
    var hits = catalog.filter(function (c) { return c[0].toLowerCase().indexOf(q) > -1 || c[1].toLowerCase().indexOf(q) > -1; }).slice(0, 6);
    active = -1;
    if (!hits.length) {
      list.innerHTML = '<li class="empty">No exact match, but we can likely get it. <a href="#start" data-open-form-dyn>Ask a specialist →</a></li>';
    } else {
      list.innerHTML = hits.map(function (h) { return '<li role="option" data-pick="' + h[1] + '">' + h[0] + ' <small>Request →</small></li>'; }).join('');
    }
    list.hidden = false;
  }
  fin.addEventListener('input', function () { render(fin.value); });
  fin.addEventListener('focus', function () { if (fin.value) render(fin.value); });
  fin.addEventListener('keydown', function (e) {
    var items = $$('li[data-pick]', list);
    if (!items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, items.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); }
    else if (e.key === 'Enter') { e.preventDefault(); (items[active] || items[0]).click(); return; }
    items.forEach(function (it, i) { it.classList.toggle('is-active', i === active); });
  });
  list.addEventListener('click', function (e) {
    var li = e.target.closest('li[data-pick]');
    if (e.target.closest('[data-open-form-dyn]')) { e.preventDefault(); list.hidden = true; openForm(); return; }
    if (!li) return;
    list.hidden = true; fin.value = li.firstChild.textContent.trim();
    openForm(li.dataset.pick);
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.finder')) list.hidden = true; });

  /* ---------- Coverage checker ---------- */
  var covIns = $('#covIns'), covEq = $('#covEq'), covRes = $('#covResult');
  var eqName = { wheelchair: 'A wheelchair', bed: 'A hospital bed', oxygen: 'Home oxygen', cpap: 'A CPAP machine', walker: 'A walker or rollator', bath: 'Shower chairs and grab bars', lift: 'A lift chair' };
  function coverage(ins, eq) {
    var item = eqName[eq];
    if (ins === 'self') return ['info', 'Affordable options', 'No insurance? No problem. Rent short-term or buy with HSA/FSA, card or a payment plan. We\'ll show you the lowest-cost option.'];
    if (eq === 'bath') {
      if (ins === 'medicare') return ['part', 'Usually not covered', 'Original Medicare usually treats shower chairs and grab bars as convenience items. A bedside commode may be covered. Self-pay prices start around $45.'];
      return ['part', 'Depends on plan', 'Some ' + (ins === 'medicaid' ? 'Medicaid programs' : ins === 'advantage' ? 'Medicare Advantage plans' : 'private plans') + ' cover bathroom safety items. We\'ll check yours for free.'];
    }
    if (eq === 'lift') {
      if (ins === 'medicare' || ins === 'advantage') return ['part', 'Partly covered', 'Medicare may cover the seat-lift mechanism when medically necessary; the chair itself is usually your cost. We\'ll give you the exact split.'];
      return ['part', 'Depends on plan', 'Coverage for lift chairs varies by plan. We\'ll check yours for free.'];
    }
    if (ins === 'medicare') return ['good', 'Usually covered', item + ' is usually covered by Medicare Part B at 80% of the approved amount after your yearly deductible, when your doctor prescribes it.'];
    if (ins === 'advantage') return ['good', 'Usually covered', item + ' is usually covered by Medicare Advantage plans. Your copay depends on your plan, and we may need prior approval, which we handle.'];
    if (ins === 'medicaid') return ['good', 'Often covered', item + ' is often covered by Medicaid with little or no cost to you when medically necessary. Rules vary by state; we\'ll confirm.'];
    return ['good', 'Usually covered', item + ' is covered by most private plans as durable medical equipment. Your cost depends on your deductible and coinsurance.'];
  }
  function updateCov() {
    var r = coverage(covIns.value, covEq.value);
    covRes.innerHTML = '<p class="cov__status"><span class="pill pill--' + r[0] + '">' + r[1] + '</span></p><p class="cov__text">' + r[2] + '</p>';
    covRes.classList.remove('flash'); void covRes.offsetWidth; covRes.classList.add('flash');
  }
  covIns.addEventListener('change', updateCov); covEq.addEventListener('change', updateCov);

  /* ---------- Rent / Buy toggle ---------- */
  $$('.toggle button').forEach(function (b) {
    b.addEventListener('click', function () {
      var mode = b.dataset.mode;
      $$('.toggle button').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
      $$('.price').forEach(function (p) {
        var v = p.dataset[mode], u = p.dataset[mode + 'U'];
        p.innerHTML = '<strong>' + v + '</strong><span>' + u + '</span>';
        if (window.gsap) gsap.fromTo(p, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .3 });
      });
    });
  });

  /* ---------- ZIP check ---------- */
  var zipForm = $('#zipForm');
  zipForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var inp = $('#zipIn'), msg = $('#zipMsg'), v = inp.value.trim();
    if (!/^\d{5}$/.test(v)) { invalid(inp, true); msg.className = 'zip__msg bad'; msg.textContent = 'Please enter a 5-digit ZIP code.'; return; }
    invalid(inp, false);
    // Prototype: real version checks the business's actual delivery ZIP list.
    msg.className = 'zip__msg ok';
    msg.innerHTML = '✓ Great news! We deliver to ' + v + ', free. <a href="#start" data-open-form-zip>Start your order →</a>';
    form.elements.namedItem('zip').value = v;
  });
  $('#zipIn').addEventListener('input', function () { this.value = this.value.replace(/\D/g, '').slice(0, 5); });
  $('#zipMsg').addEventListener('click', function (e) { if (e.target.closest('[data-open-form-zip]')) { e.preventDefault(); openForm(); } });

  /* ---------- Simple forms (referral, callback, exit) ---------- */
  function simpleForm(f) {
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      $$('input[required]', f).forEach(function (i) {
        var isBad = i.type === 'tel' ? i.value.replace(/\D/g, '').length < 10 : i.value.trim().length < 2;
        invalid(i, isBad); if (isBad && !bad) bad = i;
      });
      if (bad) { bad.focus(); return; }
      $$('input, select, button[type=submit]', f).forEach(function (i) { i.disabled = true; });
      $('.formok', f).hidden = false;
    });
  }
  simpleForm($('#refForm')); simpleForm($('#cbForm')); simpleForm($('#exitForm'));

  /* ---------- Exit-intent (desktop, once per session, not after converting) ---------- */
  var modal = $('#exitModal'), lastFocus = null;
  function closeModal() { if (!modal.hidden) { modal.hidden = true; if (lastFocus) lastFocus.focus(); } }
  function openModal() {
    try { if (sessionStorage.getItem('cw_exit')) return; sessionStorage.setItem('cw_exit', '1'); } catch (e) { /* ignore */ }
    if (!$('.lf-done', form).hidden) return;
    lastFocus = document.activeElement; modal.hidden = false; $('#exName').focus();
  }
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('[data-close]')) closeModal(); });
  var armed = false; setTimeout(function () { armed = true; }, 12000);
  document.addEventListener('mouseout', function (e) {
    if (!armed || e.relatedTarget || e.clientY > 8 || window.innerWidth < 1025 || document.body.classList.contains('notes-on')) return;
    openModal();
  });

  /* ---------- Design notes (proposal mode) ---------- */
  var toggle = $('#notesToggle'), pop = $('#notePop');
  function hideNote() { pop.hidden = true; }
  function showNote(sec) {
    $('.note-pop__n', pop).textContent = 'Design note ' + sec.dataset.note;
    $('h3', pop).textContent = sec.dataset.noteTitle;
    $('.note-pop__t', pop).textContent = sec.dataset.noteText;
    pop.hidden = false;
  }
  $('.note-pop__x', pop).addEventListener('click', hideNote);
  toggle.addEventListener('click', function () {
    var on = !document.body.classList.contains('notes-on');
    document.body.classList.toggle('notes-on', on);
    toggle.setAttribute('aria-pressed', String(on));
    $('span:last-child', toggle).textContent = on ? 'Hide design notes' : 'Show design notes';
    $$('.note-pin').forEach(function (p) { p.remove(); });
    hideNote();
    if (on) {
      $$('[data-note]').forEach(function (sec) {
        var pin = document.createElement('button');
        pin.className = 'note-pin'; pin.textContent = sec.dataset.note;
        pin.setAttribute('aria-label', 'Design note ' + sec.dataset.note + ': ' + sec.dataset.noteTitle);
        pin.addEventListener('click', function (e) { e.stopPropagation(); showNote(sec); });
        sec.appendChild(pin);
      });
      showNote($('[data-note="1"]'));
    }
  });
  if (/[?&]notes=1/.test(location.search)) toggle.click();

  /* ---------- Animations (GSAP, progressive enhancement) ---------- */
  window.addEventListener('load', function () {
    if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero__copy > *', { y: 24, opacity: 0, duration: .7, stagger: .08, ease: 'power3.out' });
    gsap.from('.leadform', { y: 30, opacity: 0, duration: .8, delay: .25, ease: 'power3.out' });
    gsap.from('.hero__photo', { y: 20, opacity: 0, duration: 1, delay: .1, ease: 'power3.out' });

    if (!window.ScrollTrigger) return;
    var groups = ['.stats .stat', '.cats .cat', '.steps .step', '.products .prod', '.feats .feat', '.reviews .review', '.faq__list details', '.compare__row'];
    groups.forEach(function (sel) {
      var els = $$(sel); if (!els.length) return;
      gsap.from(els, { y: 28, opacity: 0, duration: .6, stagger: .07, ease: 'power2.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: els[0], start: 'top 88%', once: true } });
    });
    $$('.sec-head, .cov__copy, .cov__tool, .why__media, .prov__copy, .prov__form, .area__copy, .area__card, .faq__head, .final__in').forEach(function (el) {
      gsap.from(el, { y: 30, opacity: 0, duration: .7, ease: 'power2.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    gsap.from('.why__media img', { scale: 1.08, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: '.why__media', start: 'top 85%', once: true } });
    // Count-up stats
    $$('[data-count]').forEach(function (el) {
      var end = +el.dataset.count; if (!end) return;
      var o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.2, ease: 'power1.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true }, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
  });
})();
