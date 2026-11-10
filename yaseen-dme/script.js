/* Siddiqui Medical Supply — shared interactions for Version A and Version B */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var on = function (el, ev, fn, o) { if (el) el.addEventListener(ev, fn, o); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year + open status ---------- */
  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();
  (function () {
    var el = $('#openStatus'); if (!el) return;
    var d = new Date(), day = d.getDay(), h = d.getHours() + d.getMinutes() / 60;
    var open = (day >= 1 && day <= 5 && h >= 8 && h < 18) || (day === 6 && h >= 9 && h < 14);
    if (!open) { el.textContent = '24/7 support line open'; el.classList.add('is-closed'); }
  })();

  /* ---------- Header, mobile bar ---------- */
  var header = $('.header'), mbar = $('#mbar'), hero = $('.hero');
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 20);
    var show = hero ? y > hero.offsetHeight * 0.55 : y > 500;
    if (mbar) mbar.classList.toggle('is-visible', show);
    document.body.classList.toggle('mbar-on', show);
  }
  on(window, 'scroll', onScroll, { passive: true }); onScroll();

  var burger = $('#burger'), nav = $('#nav'), scrim = $('#navScrim');
  function setNav(open) {
    if (!nav) return;
    nav.classList.toggle('is-open', open);
    if (scrim) scrim.classList.toggle('is-on', open);
    if (burger) { burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
  }
  on(burger, 'click', function () { setNav(!nav.classList.contains('is-open')); });
  on(scrim, 'click', function () { setNav(false); });

  var drop = $('.nav__drop'), dropBtn = $('.nav__btn');
  var hoverable = window.matchMedia('(hover: hover) and (min-width: 1061px)');
  function setDrop(open) { if (!drop) return; drop.classList.toggle('is-open', open); dropBtn.setAttribute('aria-expanded', String(open)); }
  on(dropBtn, 'click', function (e) { e.stopPropagation(); setDrop(!drop.classList.contains('is-open')); });
  on(drop, 'mouseenter', function () { if (hoverable.matches) setDrop(true); });
  on(drop, 'mouseleave', function () { if (hoverable.matches) setDrop(false); });
  on(document, 'click', function (e) { if (drop && !drop.contains(e.target)) setDrop(false); });
  on(document, 'keydown', function (e) { if (e.key === 'Escape') { setDrop(false); setNav(false); closeModal(); hideNote(); } });
  $$('.nav a').forEach(function (a) { on(a, 'click', function () { setNav(false); setDrop(false); }); });

  /* ---------- Marquee duplicate ---------- */
  $$('.marquee__track').forEach(function (track) {
    $$('li', track).forEach(function (li) { var c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
  });

  /* ---------- Multi-step lead form ---------- */
  var form = $('#leadForm');
  var field = function (n) { return form ? form.elements.namedItem(n) : null; };
  var current = 1;
  var labels = ['What do you need?', 'Your coverage', 'Where should we call you?'];
  function invalid(el, bad) { if (!el) return bad; el.classList.toggle('is-invalid', bad); el.setAttribute('aria-invalid', String(bad)); return bad; }
  function go(n) {
    if (!form) return;
    current = n;
    $$('.lf-step', form).forEach(function (s) { s.classList.toggle('is-active', +s.dataset.step === n); });
    var bar = $('#lfBar'); if (bar) bar.style.width = (n / 3 * 100) + '%';
    var lab = $('#lfStepLabel'); if (lab) lab.textContent = labels[n - 1];
    var cnt = $('#lfCount'); if (cnt) cnt.textContent = 'Step ' + n + ' of 3';
  }
  if (form) {
    $$('input[name=equipment]', form).forEach(function (r) { on(r, 'change', function () { setTimeout(function () { go(2); }, 240); }); });
    $$('[data-back]', form).forEach(function (b) { on(b, 'click', function () { go(current - 1); }); });
    $$('[data-next]', form).forEach(function (b) {
      on(b, 'click', function () {
        var zip = field('zip'), ins = $('input[name=insurance]:checked', form), seg = $('.seg', form);
        var badZip = invalid(zip, !/^\d{5}$/.test(zip.value.trim()));
        if (seg) seg.classList.toggle('is-invalid', !ins);
        if (!badZip && ins) go(3); else (ins ? zip : $('input[name=insurance]', form)).focus();
      });
    });
    $$('input[name=insurance]', form).forEach(function (r) { on(r, 'change', function () { var s = $('.seg', form); if (s) s.classList.remove('is-invalid'); }); });
    on(field('zip'), 'input', function () { this.value = this.value.replace(/\D/g, '').slice(0, 5); if (this.value.length === 5) invalid(this, false); });
    on(form, 'submit', function (e) {
      e.preventDefault();
      var n = field('name'), p = field('phone');
      var b1 = invalid(n, n.value.trim().length < 2), b2 = invalid(p, p.value.replace(/\D/g, '').length < 10);
      if (b1 || b2) { (b1 ? n : p).focus(); return; }
      // Prototype only: production posts to the CRM / HIPAA-compliant form service.
      $$('.lf-step', form).forEach(function (s) { s.classList.remove('is-active'); });
      form.classList.add('is-done');
      $('#lfName').textContent = n.value.trim().split(' ')[0];
      $('.lf-done', form).hidden = false;
    });
  }
  function openForm(pick) {
    if (!form) return;
    if (pick && !form.classList.contains('is-done')) {
      var m = $$('input[name=equipment]', form).filter(function (r) { return r.value === pick; })[0];
      if (m) m.checked = true;
      go(2);
    }
    var target = $('#start');
    var top = target.getBoundingClientRect().top + window.scrollY - (window.innerWidth < 1061 ? 90 : 120);
    window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    form.classList.remove('pulse'); void form.offsetWidth; form.classList.add('pulse');
  }
  window.SMSopenForm = openForm;
  on(document, 'click', function (e) {
    var a = e.target.closest('[data-open-form], [data-pick]');
    if (!a || a.closest('.finder__list')) return;
    e.preventDefault(); setNav(false); openForm(a.getAttribute('data-pick'));
  });
  // Mega-menu: highlight matching category
  $$('[data-cat]').forEach(function (a) {
    if (!a.closest('.mega, .mega-list')) return;
    on(a, 'click', function () {
      var t = $$('.tile[data-cat], .cat-row[data-cat], .cat[data-cat]').filter(function (x) { return x.dataset.cat === a.dataset.cat; })[0];
      if (!t) return;
      setTimeout(function () { t.classList.add('is-hit'); setTimeout(function () { t.classList.remove('is-hit'); }, 2200); }, 500);
    });
  });

  /* ---------- Equipment finder ---------- */
  var catalog = [
    ['Manual wheelchair', 'Wheelchair / Mobility'], ['Lightweight wheelchair', 'Wheelchair / Mobility'], ['Transport chair', 'Wheelchair / Mobility'], ['Power wheelchair', 'Wheelchair / Mobility'], ['Mobility scooter', 'Wheelchair / Mobility'],
    ['Hospital bed', 'Hospital Bed'], ['Semi-electric bed', 'Hospital Bed'], ['Pressure relief mattress', 'Hospital Bed'], ['Bed rails', 'Hospital Bed'], ['Overbed table', 'Hospital Bed'],
    ['Oxygen concentrator', 'Oxygen'], ['Portable oxygen (POC)', 'Oxygen'], ['Nebulizer', 'Oxygen'], ['Pulse oximeter', 'Oxygen'],
    ['CPAP machine', 'CPAP / Sleep'], ['BiPAP machine', 'CPAP / Sleep'], ['CPAP masks & supplies', 'CPAP / Sleep'],
    ['Walker', 'Walker / Rollator'], ['Rollator with seat', 'Walker / Rollator'], ['Cane', 'Walker / Rollator'], ['Knee scooter', 'Walker / Rollator'], ['Crutches', 'Walker / Rollator'],
    ['Shower chair', 'Bathroom Safety'], ['Bedside commode', 'Bathroom Safety'], ['Raised toilet seat', 'Bathroom Safety'], ['Grab bars', 'Bathroom Safety'], ['Transfer bench', 'Bathroom Safety'],
    ['Lift chair recliner', 'Lift Chair / Patient Lift'], ['Patient lift (Hoyer)', 'Lift Chair / Patient Lift'],
    ['Glucose meter', 'Orthopedic / Daily Supplies'], ['Test strips', 'Orthopedic / Daily Supplies'], ['Knee brace', 'Orthopedic / Daily Supplies'], ['Wrist brace', 'Orthopedic / Daily Supplies'], ['Compression stockings', 'Orthopedic / Daily Supplies'], ['Back brace', 'Orthopedic / Daily Supplies']
  ];
  var fin = $('#finderInput'), list = $('#finderList'), active = -1;
  function render(q) {
    q = q.trim().toLowerCase();
    if (!q) { list.hidden = true; return; }
    var hits = catalog.filter(function (c) { return c[0].toLowerCase().indexOf(q) > -1 || c[1].toLowerCase().indexOf(q) > -1; }).slice(0, 6);
    active = -1;
    list.innerHTML = hits.length
      ? hits.map(function (h) { return '<li role="option" data-item="' + h[1] + '">' + h[0] + ' <small>Request →</small></li>'; }).join('')
      : '<li class="empty">No exact match, but we can likely get it. <a href="#start" data-dyn>Ask a specialist →</a></li>';
    list.hidden = false;
  }
  if (fin && list) {
    on(fin, 'input', function () { render(fin.value); });
    on(fin, 'focus', function () { if (fin.value) render(fin.value); });
    on(fin, 'keydown', function (e) {
      var items = $$('li[data-item]', list); if (!items.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, items.length - 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); }
      else if (e.key === 'Enter') { e.preventDefault(); (items[active] || items[0]).click(); return; }
      items.forEach(function (it, i) { it.classList.toggle('is-active', i === active); });
    });
    on(list, 'click', function (e) {
      if (e.target.closest('[data-dyn]')) { e.preventDefault(); list.hidden = true; openForm(); return; }
      var li = e.target.closest('li[data-item]'); if (!li) return;
      list.hidden = true; fin.value = li.firstChild.textContent.trim(); openForm(li.dataset.item);
    });
    on(document, 'click', function (e) { if (!e.target.closest('.finder')) list.hidden = true; });
  }

  /* ---------- Coverage checker (pills or selects) ---------- */
  var eqName = { wheelchair: 'A wheelchair', bed: 'A hospital bed', oxygen: 'Home oxygen', cpap: 'A CPAP machine', walker: 'A walker or rollator', bath: 'Shower chairs and grab bars', lift: 'A lift chair' };
  function coverage(ins, eq) {
    var item = eqName[eq];
    if (ins === 'self') return { k: 'info', tag: 'Affordable options', pct: 0, pctTxt: '$', sub: 'flexible ways to pay', t: 'No insurance? No problem. Rent short-term or buy with HSA/FSA, card or a payment plan. We\'ll find you the lowest-cost option.' };
    if (eq === 'bath') {
      if (ins === 'medicare') return { k: 'part', tag: 'Usually not covered', pct: 0, pctTxt: '0%', sub: 'Original Medicare', t: 'Original Medicare treats shower chairs and grab bars as convenience items. A bedside commode may be covered. Self-pay prices start around $45.' };
      return { k: 'part', tag: 'Depends on plan', pct: 50, pctTxt: 'Varies', sub: 'by plan', t: 'Some ' + (ins === 'medicaid' ? 'Medicaid programs' : ins === 'advantage' ? 'Medicare Advantage plans' : 'private plans') + ' cover bathroom safety items. We\'ll check yours for free.' };
    }
    if (eq === 'lift') {
      if (ins === 'medicare' || ins === 'advantage') return { k: 'part', tag: 'Partly covered', pct: 30, pctTxt: 'Part', sub: 'lift mechanism only', t: 'Medicare may cover the seat-lift mechanism when medically necessary; the chair itself is usually your cost. We\'ll give you the exact split.' };
      return { k: 'part', tag: 'Depends on plan', pct: 50, pctTxt: 'Varies', sub: 'by plan', t: 'Coverage for lift chairs varies by plan. We\'ll check yours for free.' };
    }
    if (ins === 'medicare') return { k: 'good', tag: 'Usually covered', pct: 80, pctTxt: '80%', sub: 'typically paid by Medicare', t: item + ' is usually covered by Medicare Part B at 80% of the approved amount after your yearly deductible, when your doctor prescribes it.' };
    if (ins === 'advantage') return { k: 'good', tag: 'Usually covered', pct: 80, pctTxt: '80%+', sub: 'copay set by your plan', t: item + ' is usually covered by Medicare Advantage plans. Your copay depends on your plan, and prior approval may be needed (we handle it).' };
    if (ins === 'medicaid') return { k: 'good', tag: 'Often covered', pct: 100, pctTxt: 'Up to 100%', sub: 'little or no cost', t: item + ' is often covered by Medicaid with little or no cost to you when medically necessary. Rules vary by state; we\'ll confirm.' };
    return { k: 'good', tag: 'Usually covered', pct: 75, pctTxt: '70–90%', sub: 'typical after deductible', t: item + ' is covered by most private plans as durable medical equipment. Your cost depends on your deductible and coinsurance.' };
  }
  function getVal(id) {
    var el = $('#' + id); if (!el) return null;
    if (el.tagName === 'SELECT') return el.value;
    var c = $('[aria-checked="true"]', el); return c ? c.dataset.v : null;
  }
  function updateCov() {
    var ins = getVal('covIns'), eq = getVal('covEq'); if (!ins || !eq) return;
    var r = coverage(ins, eq);
    var tag = $('#covTag'), txt = $('#covText'), fg = $('#ringFg'), pct = $('#ringPct'), sub = $('#ringSub');
    if (tag) { tag.className = 'tag tag--' + r.k; tag.textContent = r.tag; }
    if (txt) txt.textContent = r.t;
    if (fg) fg.style.strokeDashoffset = String(326.7 * (1 - r.pct / 100));
    if (pct) pct.textContent = r.pctTxt;
    if (sub) sub.textContent = r.sub;
    document.dispatchEvent(new CustomEvent('coverage:update', { detail: r }));
  }
  ['covIns', 'covEq'].forEach(function (id) {
    var el = $('#' + id); if (!el) return;
    if (el.tagName === 'SELECT') { on(el, 'change', updateCov); return; }
    $$('[role=radio]', el).forEach(function (b) {
      on(b, 'click', function () { $$('[role=radio]', el).forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); }); updateCov(); });
    });
  });
  updateCov();

  /* ---------- Rent / Buy toggle ---------- */
  $$('.toggle').forEach(function (tg) {
    $$('button', tg).forEach(function (b) {
      on(b, 'click', function () {
        var mode = b.dataset.mode;
        $$('button', tg).forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
        tg.classList.toggle('is-buy', mode === 'buy');
        $$('.price').forEach(function (p) {
          var small = $('small', p) ? '<small>' + $('small', p).textContent + '</small>' : '';
          p.innerHTML = small + '<strong>' + p.dataset[mode] + '</strong><span>' + p.dataset[mode + 'U'] + '</span>';
          if (window.gsap && !reduce) gsap.fromTo(p, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .35 });
        });
      });
    });
  });

  /* ---------- Rail: buttons + drag ---------- */
  var rail = $('#rail');
  if (rail) {
    $$('[data-rail]').forEach(function (b) { on(b, 'click', function () { var c = rail.querySelector('.prod'); rail.scrollBy({ left: (+b.dataset.rail) * ((c ? c.offsetWidth : 340) + 20), behavior: 'smooth' }); }); });
    var down = false, sx = 0, sl = 0, moved = false;
    on(rail, 'pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    on(window, 'pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; rail.classList.add('is-drag'); } rail.scrollLeft = sl - dx; });
    on(window, 'pointerup', function () { if (!down) return; down = false; rail.classList.remove('is-drag'); });
    on(rail, 'click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  }

  /* ---------- Reviews carousel ---------- */
  var quotes = $$('#revStage .quote'), qi = 0, qTimer;
  function showQ(i) {
    if (!quotes.length) return;
    qi = (i + quotes.length) % quotes.length;
    quotes.forEach(function (q, k) { q.classList.toggle('is-active', k === qi); });
    var c = $('#revCount'); if (c) c.textContent = ('0' + (qi + 1)).slice(-2) + ' / ' + ('0' + quotes.length).slice(-2);
  }
  function autoQ() { clearInterval(qTimer); if (!reduce) qTimer = setInterval(function () { showQ(qi + 1); }, 7000); }
  on($('#revNext'), 'click', function () { showQ(qi + 1); autoQ(); });
  on($('#revPrev'), 'click', function () { showQ(qi - 1); autoQ(); });
  if (quotes.length) autoQ();

  /* ---------- ZIP check ---------- */
  var zipForm = $('#zipForm');
  on(zipForm, 'submit', function (e) {
    e.preventDefault();
    var inp = $('#zipIn'), msg = $('#zipMsg'), v = inp.value.trim();
    if (!/^\d{5}$/.test(v)) { invalid(inp, true); msg.className = 'zip__msg bad'; msg.textContent = 'Please enter a 5-digit ZIP code.'; return; }
    invalid(inp, false);
    // Prototype: real version checks the business's delivery ZIP list.
    msg.className = 'zip__msg ok';
    msg.innerHTML = '✓ Great news! We deliver to ' + v + ', free. <a href="#start" data-open-form>Start your order →</a>';
    if (field('zip')) field('zip').value = v;
  });
  on($('#zipIn'), 'input', function () { this.value = this.value.replace(/\D/g, '').slice(0, 5); });

  /* ---------- Simple forms ---------- */
  ['#refForm', '#cbForm', '#exitForm'].forEach(function (sel) {
    var f = $(sel); if (!f) return;
    on(f, 'submit', function (e) {
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
  });

  /* ---------- Exit intent ---------- */
  var modal = $('#exitModal'), lastFocus = null;
  function closeModal() { if (modal && !modal.hidden) { modal.hidden = true; if (lastFocus) lastFocus.focus(); } }
  function openModal() {
    try { if (sessionStorage.getItem('sms_exit')) return; sessionStorage.setItem('sms_exit', '1'); } catch (e) { /* storage blocked */ }
    if (form && form.classList.contains('is-done')) return;
    lastFocus = document.activeElement; modal.hidden = false; var f = $('input', modal); if (f) f.focus();
  }
  if (modal) {
    on(modal, 'click', function (e) { if (e.target === modal || e.target.closest('[data-close]')) closeModal(); });
    var armed = false; setTimeout(function () { armed = true; }, 15000);
    on(document, 'mouseout', function (e) {
      if (!armed || e.relatedTarget || e.clientY > 8 || window.innerWidth < 1061 || document.body.classList.contains('notes-on')) return;
      openModal();
    });
  }

  /* ---------- Design notes ---------- */
  var toggle = $('#notesToggle'), pop = $('#notePop');
  function hideNote() { if (pop) pop.hidden = true; }
  function showNote(sec) {
    $('.note-pop__n', pop).textContent = 'Design note ' + sec.dataset.note;
    $('h3', pop).textContent = sec.dataset.noteTitle;
    $('.note-pop__t', pop).textContent = sec.dataset.noteText;
    pop.hidden = false;
  }
  if (toggle && pop) {
    on($('.note-pop__x', pop), 'click', hideNote);
    on(toggle, 'click', function () {
      var onn = !document.body.classList.contains('notes-on');
      document.body.classList.toggle('notes-on', onn);
      toggle.setAttribute('aria-pressed', String(onn));
      var t = $('.notes-toggle__txt', toggle); if (t) t.textContent = onn ? 'Hide notes' : 'Design notes';
      $$('.note-pin').forEach(function (p) { p.remove(); });
      hideNote();
      if (onn) {
        $$('[data-note]').forEach(function (sec) {
          var pin = document.createElement('button');
          pin.className = 'note-pin'; pin.type = 'button'; pin.textContent = sec.dataset.note;
          pin.setAttribute('aria-label', 'Design note ' + sec.dataset.note + ': ' + sec.dataset.noteTitle);
          on(pin, 'click', function (e) { e.stopPropagation(); showNote(sec); });
          sec.appendChild(pin);
        });
        showNote($('[data-note="1"]'));
      }
    });
    if (/[?&]notes=1/.test(location.search)) toggle.click();
  }

  /* ---------- Split headings into words ---------- */
  $$('.split').forEach(function (el) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span'); w.className = 'w';
            var inner = document.createElement('span'); inner.textContent = part; w.appendChild(inner); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains('w')) { walk(n); }
      });
    };
    walk(el);
  });

  /* ---------- Magnetic buttons ---------- */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    $$('.magnetic').forEach(function (b) {
      on(b, 'mousemove', function (e) { var r = b.getBoundingClientRect(); b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .18) + 'px,' + ((e.clientY - r.top - r.height / 2) * .25) + 'px)'; });
      on(b, 'mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- GSAP motion ---------- */
  on(window, 'load', function () {
    if (!window.gsap || reduce) return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    var heroH1 = $('.hero h1');
    if (heroH1) gsap.from($$('.w > span', heroH1), { yPercent: 110, duration: 1, stagger: .06, ease: 'power4.out', delay: .1 });
    gsap.from($$('.hero__copy > :not(h1)'), { y: 24, opacity: 0, duration: .9, stagger: .08, ease: 'power3.out', delay: .35 });
    gsap.from('.hero__form, .hero__visual', { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out', delay: .45 });
    if (!window.ScrollTrigger) return;
    var hm = $('.hero__media img');
    if (hm) gsap.to(hm, { yPercent: 12, scale: 1.14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    $$('.split').forEach(function (h) {
      if (h.closest('.hero')) return;
      gsap.from($$('.w > span', h), { yPercent: 110, duration: .9, stagger: .035, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
    });
    $$('[data-reveal]').forEach(function (g) {
      var kids = g.children.length > 1 ? g.children : [g];
      gsap.from(kids, { y: 36, opacity: 0, duration: .9, stagger: .08, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: g, start: 'top 88%', once: true } });
    });
    $$('[data-count]').forEach(function (el) {
      var end = +el.dataset.count; if (!end) return; var o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true }, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
    document.dispatchEvent(new Event('sms:gsap'));
  });
})();
