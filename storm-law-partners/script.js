/* Storm Law Partners — CRO home page concept */
(function () {
  'use strict';
  var d = document, w = window;
  var reduced = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) d.documentElement.classList.add('reduced');
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* ---------- attorney photos: fall back to monogram if hotlink fails ---------- */
  $$('.atty__ph img').forEach(function (img) {
    var fail = function () { img.remove(); };
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0 && img.src) fail();
  });

  /* ---------- header state + mobile bar ---------- */
  var hdr = $('.hdr'), mbar = $('.mbar'), hero = $('.hero');
  function onScroll() {
    var y = w.scrollY;
    hdr.classList.toggle('is-scrolled', y > 40);
    var heroBottom = hero.offsetTop + hero.offsetHeight * 0.6;
    var finalEl = $('.final');
    var nearFinal = finalEl && (finalEl.getBoundingClientRect().top < w.innerHeight * 0.5 && finalEl.getBoundingClientRect().bottom > 0);
    mbar.classList.toggle('is-on', y > heroBottom && !nearFinal);
  }
  w.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- active nav link ---------- */
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in w) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var t = $(a.getAttribute('href')); if (t) io.observe(t); });
  }

  /* ---------- drawer ---------- */
  var burger = $('.burger'), drawer = $('#drawer');
  function setDrawer(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.hidden = !open;
    d.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setDrawer(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) setDrawer(false); });

  /* ---------- quick form (3 steps) ---------- */
  var qf = $('.qf'), form = $('.qf__form'), panes = $$('.qf__pane', form);
  var bar = $('.qf__bar span'), stepTxt = $('.qf__step b'), data = {};
  var step = 1;
  function go(n) {
    step = n;
    panes.forEach(function (p) {
      var on = +p.dataset.step === n;
      p.classList.toggle('is-on', on);
      p.disabled = !on;
    });
    bar.style.width = (n / 3 * 100) + '%';
    stepTxt.textContent = n;
  }
  function select(btn) {
    $$('.opt[data-k="' + btn.dataset.k + '"]', form).forEach(function (b) { b.classList.toggle('is-sel', b === btn); });
    data[btn.dataset.k] = btn.dataset.v;
  }
  $$('.opt', form).forEach(function (btn) {
    btn.addEventListener('click', function () {
      select(btn);
      if (btn.dataset.k === 'issue') setTimeout(function () { go(2); }, 220);
    });
  });
  function validate(scope) {
    var ok = true;
    $$('[required]', scope).forEach(function (el) {
      var v = el.value.trim(), bad = !v;
      if (!bad && el.type === 'email') bad = !/^\S+@\S+\.\S+$/.test(v);
      if (!bad && el.type === 'tel') bad = v.replace(/\D/g, '').length < 10;
      if (!bad && el.name === 'zip') bad = !/^\d{5}$/.test(v);
      el.closest('.fld').classList.toggle('is-err', bad);
      if (bad && ok) { el.focus(); ok = false; }
    });
    return ok;
  }
  $('.qf__next', form).addEventListener('click', function () {
    var p = panes[1];
    if (!data.ptype) { var first = $('.opt[data-k="ptype"]', p); first.focus(); $$('.opt[data-k="ptype"]', p).forEach(function (b) { b.animate && b.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 300 }); }); return; }
    if (validate(p)) go(3);
  });
  $$('.qf__back', form).forEach(function (b) { b.addEventListener('click', function () { go(step - 1); }); });
  $$('input,select', d).forEach(function (el) { el.addEventListener('input', function () { var f = el.closest('.fld'); if (f) f.classList.remove('is-err'); }); });
  // phone mask
  $$('input[type="tel"]').forEach(function (el) {
    el.addEventListener('input', function () {
      var n = el.value.replace(/\D/g, '').slice(0, 10), o = n;
      if (n.length > 6) o = '(' + n.slice(0, 3) + ') ' + n.slice(3, 6) + '-' + n.slice(6);
      else if (n.length > 3) o = '(' + n.slice(0, 3) + ') ' + n.slice(3);
      el.value = o;
    });
  });
  $$('input[name="zip"]').forEach(function (el) { el.addEventListener('input', function () { el.value = el.value.replace(/\D/g, '').slice(0, 5); }); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(panes[2])) return;
    panes.forEach(function (p) { p.classList.remove('is-on'); p.disabled = true; });
    $('.qf__head', qf).style.display = 'none';
    $('.qf__done', form).hidden = false;
    track('lead_submit_hero');
  });

  // Path cards + claim tiles preselect the form, then scroll to it
  function focusForm(issue, damage) {
    if (issue) {
      var b = $('.opt[data-k="issue"][data-v="' + issue + '"]', form);
      if (b && $('.qf__done', form).hidden) { select(b); go(2); }
    }
    if (damage) {
      var s = $('select[name="damage"]', form);
      if (s) s.value = damage;
      if (!issue && step === 1 && $('.qf__done', form).hidden) { /* stay on step 1 so they still pick the issue */ }
    }
    qf.classList.remove('flash'); void qf.offsetWidth; qf.classList.add('flash');
  }
  $$('[data-pick]').forEach(function (a) { a.addEventListener('click', function () { focusForm(a.dataset.pick); }); });
  $$('[data-pick-damage]').forEach(function (a) { a.addEventListener('click', function () { focusForm(null, a.dataset.pickDamage); }); });

  /* ---------- final form ---------- */
  var ff = $('.ff');
  ff.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(ff)) return;
    $$('.ff__row,.fld,.btn,.ff__fine', ff).forEach(function (el) { el.style.display = 'none'; });
    $('.ff__done', ff).hidden = false;
    track('lead_submit_final');
  });

  /* ---------- decoder tabs ---------- */
  var tabs = $$('.decoder__tabs [role="tab"]');
  function openTab(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      var p = $('#' + x.getAttribute('aria-controls'));
      p.hidden = !on; p.classList.toggle('is-on', on);
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { openTab(t); });
    t.addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
      if (n === null) return;
      e.preventDefault();
      var nt = tabs[(n + tabs.length) % tabs.length]; nt.focus(); openTab(nt);
    });
  });

  /* ---------- FAQ: one open at a time ---------- */
  var dets = $$('.acc details');
  dets.forEach(function (dt) { dt.addEventListener('toggle', function () { if (dt.open) dets.forEach(function (o) { if (o !== dt) o.open = false; }); }); });

  /* ---------- exit intent (desktop, once per session) ---------- */
  var exit = $('.exit');
  function seen() { try { return sessionStorage.getItem('slp_exit') === '1'; } catch (e) { return false; } }
  function markSeen() { try { sessionStorage.setItem('slp_exit', '1'); } catch (e) {} }
  function closeExit() { exit.hidden = true; }
  var armed = false;
  setTimeout(function () { armed = true; }, 12000);
  d.addEventListener('mouseout', function (e) {
    if (!armed || e.relatedTarget || e.clientY > 8 || seen() || w.innerWidth < 900 || d.body.classList.contains('notes-on')) return;
    if (!$('.qf__done').hidden || !$('.ff__done').hidden) return;
    markSeen(); exit.hidden = false; $('.exit__x').focus();
  });
  $$('[data-exit-close], .exit__x', exit).forEach(function (b) { b.addEventListener('click', closeExit); });
  exit.addEventListener('click', function (e) { if (e.target === exit) closeExit(); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !exit.hidden) closeExit(); });

  /* ---------- lightweight event tracking stub (wire to GA4/GTM) ---------- */
  function track(name) { (w.dataLayer = w.dataLayer || []).push({ event: name }); }
  $$('[data-track]').forEach(function (a) { a.addEventListener('click', function () { track(a.dataset.track); }); });

  /* ---------- magnetic buttons (desktop pointer only) ---------- */
  if (!reduced && w.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.18, y = (e.clientY - r.top - r.height / 2) * 0.3;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- GSAP motion ---------- */
  function initMotion() {
    var gsap = w.gsap, ST = w.ScrollTrigger;
    if (!gsap || !ST || reduced) {
      $$('.rv').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }
    gsap.registerPlugin(ST);

    // Hero entrance
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero .eyebrow', { y: 16, opacity: 0, duration: .8 })
      .from('.hero__h1 .line>span', { yPercent: 110, duration: 1.2, stagger: .1 }, '-=.55')
      .from('.hero__lede, .hero__ticks li, .hero__ctas', { y: 22, opacity: 0, duration: .9, stagger: .07 }, '-=.85')
      .from('.qf', { y: 40, opacity: 0, duration: 1.1 }, '-=1')
      .from('.trust__i', { y: 18, opacity: 0, duration: .8, stagger: .06 }, '-=.8');

    // Lightning flicker in hero background
    (function flash() {
      var t = gsap.timeline({ onComplete: function () { gsap.delayedCall(4 + Math.random() * 5, flash); } });
      t.to('.hero__flash', { opacity: .9, duration: .06 })
       .to('.hero__flash', { opacity: .1, duration: .08 })
       .to('.hero__flash', { opacity: .6, duration: .05 })
       .to('.hero__flash', { opacity: 0, duration: .6, ease: 'power2.out' });
    })();

    // Hero parallax
    gsap.to('.hero__bg img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.band__bg img', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.versus__bigv', { yPercent: -10, rotate: -6 }, { yPercent: 18, rotate: 4, ease: 'none', scrollTrigger: { trigger: '.versus', start: 'top bottom', end: 'bottom top', scrub: true } });

    // Section headings: word-by-word mask reveal
    $$('.split').forEach(function (h) {
      var words = [];
      (function walk(node, wrapEm) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var parts = n.textContent.split(/(\s+)/), frag = d.createDocumentFragment();
            parts.forEach(function (p) {
              if (!p) return;
              if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(' ')); return; }
              var o = d.createElement('span'); o.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em';
              var i = d.createElement('span'); i.style.display = 'inline-block'; i.textContent = p;
              o.appendChild(i); frag.appendChild(o); words.push(i);
            });
            node.replaceChild(frag, n);
          } else if (n.nodeType === 1) walk(n);
        });
      })(h);
      gsap.from(words, { yPercent: 105, duration: 1, ease: 'expo.out', stagger: .035, scrollTrigger: { trigger: h, start: 'top 85%' } });
    });

    // Generic reveals (batched)
    gsap.set('.rv', { opacity: 0, y: 28 });
    ST.batch('.rv', {
      start: 'top 88%',
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .08, overwrite: true }); }
    });

    // Count-up numbers
    $$('.count').forEach(function (el) {
      var to = +el.dataset.to, o = { v: 0 };
      gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' }, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });

    // Process line fill + active steps
    var steps = $('.steps');
    var fill = d.createElement('span'); fill.className = 'steps__fill'; steps.prepend(fill);
    gsap.to(fill, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: steps, start: 'top 60%', end: 'bottom 60%', scrub: .4 } });
    $$('.step').forEach(function (s) {
      ST.create({ trigger: s, start: 'top 62%', onEnter: function () { s.classList.add('is-active'); }, onLeaveBack: function () { s.classList.remove('is-active'); } });
      gsap.from($('img', s), { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 70%' } });
    });

    // v. badge pop
    gsap.from('.vs__mid span', { scale: 0, rotate: -90, duration: 1, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.vs', start: 'top 75%' } });

    // Numbers band slight sweep
    gsap.from('.num b', { y: 30, opacity: 0, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.nums', start: 'top 85%' } });

    w.addEventListener('load', function () { ST.refresh(); });
  }
  if (d.readyState === 'complete') initMotion(); else w.addEventListener('load', initMotion);

  /* ---------- Design notes (?notes=1) ---------- */
  var NOTES = {
    1: ['Utility bar: 24/7 + Spanish', '<p>The live "available 24/7" pulse and the <b>24-hour insurer contact promise</b> answer the #1 anxiety of someone with a damaged property: <i>"Will anyone actually pick up?"</i></p><p><b>Hablamos Español</b> stays visible at the very top — the firm serves Texas, Florida and California, where a large share of policyholders prefer Spanish. Hiding it in the footer loses those leads.</p>'],
    2: ['Hero: name the pain, then the promise', '<p>The headline mirrors the exact words visitors type into Google — <b>"denied, delayed, underpaid"</b>. When a page repeats a visitor\'s problem in their own words, they stay.</p><p>The sub-line reframes the fight: <i>the insurer has lawyers; now you do too.</i> Three ticks remove the three biggest objections: <b>cost</b> ($0 upfront), <b>loyalty</b> (never insurers), <b>trust</b> (honest answer).</p><p>Two CTAs serve two personalities: form-fillers and callers. Phone is shown as a number, not "Call us", because a visible number itself builds trust.</p><p>The lightning photo + subtle flash animation ties the brand name "Storm" to the visual instantly.</p>'],
    3: ['Above-the-fold multi-step form', '<p>The form sits <b>in the hero</b> so a ready visitor never has to scroll. It starts with one-tap buttons (no typing) — <b>micro-commitments</b>. Once someone has answered step 1, they\'re far more likely to finish.</p><p>Multi-step forms typically convert better than one long form in legal lead-gen because personal details come last, after the visitor has invested. The progress bar shows it\'s short.</p><p>Bonus: the answers (issue, property type, damage, ZIP) pre-qualify leads for the intake team.</p>'],
    4: ['Trust strip: proof before scrolling', '<p>Stars, years, $1B+, 24/7 and ABA appear immediately under the hero, where the visitor decides whether to stay.</p><p>All figures are the firm\'s own published claims (with the $1B+ footnote kept for bar-advertising compliance). Numbers animate up once to draw the eye.</p>'],
    5: ['"Where did the carrier leave you?" — self-segmentation', '<p>Visitors arrive at different stages. Letting them <b>choose their situation</b> makes the site feel personal and keeps them moving.</p><p>Each card jumps to the hero form and <b>pre-selects their answer</b> — one fewer step, and the form gently highlights to show it\'s ready.</p><p>Card 4 ("I just had damage") captures early-stage leads before a public adjuster or another firm reaches them.</p>'],
    6: ['Denial letter decoder (interactive)', '<p>Most visitors are holding a denial letter. This tool turns jargon ("wear and tear", "pre-existing") into plain English and shows <b>what the firm checks</b> — demonstrating expertise instead of claiming it.</p><p>Interactive elements increase time on page and engagement signals. The CTA "Have an attorney read my letter — free" is the most natural next step after reading.</p>'],
    7: ['Practice areas as a visual grid', '<p>Hurricane gets the big tile because it is the highest-volume claim type in the firm\'s core states (TX, FL, NC). Bad Faith gets a wide tile because it\'s the firm\'s differentiator and highest-value matter.</p><p>Every tile is clickable and pre-fills the damage type in the form. The chips below cover homeowners/commercial, matching the current site menu, so no service is lost.</p>'],
    8: ['"One side of the v." — the differentiator', '<p>The single strongest reason to choose this firm: they <b>never represent insurers</b>. The "v." (as in Smith v. Insurer) makes that idea memorable and ownable — and it matches the language in the firm\'s new practice-page designs.</p><p>The "alone vs. with us" comparison works on loss aversion: people act more to avoid a loss than to gain. The three pillars (Speed, Experts, Results) are taken from the current site\'s "Storm Law Difference".</p>'],
    9: ['Numbers band', '<p>A bold crimson band breaks the scroll rhythm and resets attention mid-page. "$0 upfront" is repeated here deliberately — fee fear is the top reason people don\'t call a lawyer.</p><p>Compliance footnote stays attached to the claims.</p>'],
    10: ['How it works — 3 steps', '<p>Uncertainty kills conversions. Showing exactly what happens after you submit ("Day 1… Weeks 1–4… Resolution") makes the first step feel safe and small.</p><p>The left column stays pinned with a CTA on desktop, so a convinced reader can act at any point. The red line fills as you scroll — progress you can feel.</p>'],
    11: ['Real attorneys, real faces', '<p>Legal clients hire <b>people</b>. Showing the four attorneys (from the current site) by name answers "Is this a call center?" Black-and-white photos turn to colour on hover — premium, consistent, and forgiving of mismatched headshots.</p><p>Photos are pulled from the current site for this concept; we\'ll use high-res originals in the build.</p>'],
    12: ['Reviews', '<p>Social proof placed <b>after</b> the team section: once visitors meet the lawyers, they want to hear from people like them.</p><p>Reviews are taken from the firm\'s current Our Firm page (two verbatim; two lightly shortened — marked for approval). Next step: embed the live Google rating + count, which is stronger than any on-page quote.</p>'],
    13: ['Urgency band', '<p>Honest urgency: claim and notice deadlines are real and vary by state. This converts "I\'ll deal with it later" visitors. The deadline line is flagged for attorney verification before launch.</p>'],
    14: ['Areas we serve', '<p>Local relevance builds trust ("they work in my state") and supports local SEO. The full city list mirrors the current site menu. The Houston HQ address adds legitimacy.</p><p>In the full build each city links to its location page.</p>'],
    15: ['FAQ — objection handling', '<p>Each question removes one reason not to call: cost, "is it too late?", "I already cashed a check", timing, commercial properties. The side CTA lets anyone who doesn\'t see their question call immediately.</p><p>FAQs also earn rich results in Google when FAQ schema is added.</p>'],
    16: ['Final CTA + footer', '<p>A visitor who reaches the bottom is interested but unconvinced — so the final block restates the three guarantees (24 hrs, $0, 24/7) next to a short form and a large phone number.</p><p>The mobile action bar (Call / Free Review) is always reachable after the hero — most storm-claim traffic is mobile, often from the damaged property itself. A one-time exit-intent offer catches desktop visitors about to leave.</p><p>Footer keeps the attorney-advertising disclaimer required by state bars.</p>']
  };
  var notesOn = /[?&]notes=1/.test(location.search);
  if (notesOn) {
    var panel = $('.notes'), keys = Object.keys(NOTES).map(Number), cur = 0;
    d.body.classList.add('notes-on');
    panel.hidden = false;
    var show = function (i) {
      cur = (i + keys.length) % keys.length;
      var k = keys[cur], n = NOTES[k];
      $('.notes__k', panel).textContent = 'Why this layout · ' + k + ' / ' + keys.length;
      $('.notes__t', panel).textContent = n[0];
      $('.notes__b', panel).innerHTML = n[1];
      $$('[data-note]').forEach(function (el) { el.classList.toggle('is-noted', +el.dataset.note === k); });
    };
    var jump = function (i) { show(i); var el = $('[data-note="' + keys[cur] + '"]'); if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); };
    $('.notes__next', panel).addEventListener('click', function () { jump(cur + 1); });
    $('.notes__prev', panel).addEventListener('click', function () { jump(cur - 1); });
    $('.notes__x', panel).addEventListener('click', function () { panel.hidden = true; d.body.classList.remove('notes-on'); $$('.is-noted').forEach(function (e) { e.classList.remove('is-noted'); }); });
    $$('[data-note]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var r = el.getBoundingClientRect();
        if (e.clientX > r.right - 50 && e.clientY < r.top + 50) { e.preventDefault(); e.stopPropagation(); panel.hidden = false; d.body.classList.add('notes-on'); show(keys.indexOf(+el.dataset.note)); }
      }, true);
    });
    show(0);
  }
})();
