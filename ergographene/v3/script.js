/* =========================================================
   ErgoGraphene — V3 homepage (CoreChair look) interactions
   GSAP + ScrollTrigger + Lenis
   ========================================================= */
(function () {
  'use strict';
  var d = document, w = window;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = w.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = typeof w.gsap !== 'undefined' && typeof w.ScrollTrigger !== 'undefined';
  var lenis = null;

  /* ---------- Currency (shopping region) ---------- */
  var RATES = { EUR: 1, GBP: 0.86, CHF: 0.94, SEK: 11.4, DKK: 7.46, PLN: 4.3, USD: 1.08, CAD: 1.5 };
  var CUR_LOC = { EUR: 'de-DE', GBP: 'en-GB', USD: 'en-US', CAD: 'en-CA', CHF: 'de-CH', SEK: 'sv-SE', DKK: 'da-DK', PLN: 'pl-PL' };
  var cur = 'EUR';
  try { var s = localStorage.getItem('eg3-cur'); if (s && RATES[s]) cur = s; } catch (e) {}
  function money(eur) {
    var v = eur * RATES[cur], whole = ['SEK', 'DKK', 'PLN'].indexOf(cur) > -1;
    if (whole) v = Math.round(v / 5) * 5; else if (cur !== 'EUR') v = Math.ceil(v) - 0.05;
    return new Intl.NumberFormat(CUR_LOC[cur], { style: 'currency', currency: cur, minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 }).format(v);
  }
  function applyPrices() { $$('[data-price]').forEach(function (el) { el.textContent = money(+el.dataset.price); }); renderCart(); }
  var sel = $('.region__sel'); sel.value = cur;
  sel.addEventListener('change', function () { cur = sel.value; try { localStorage.setItem('eg3-cur', cur); } catch (e) {} applyPrices(); });

  /* ---------- Cart ---------- */
  var qty = 0;
  function total(q) { return q <= 0 ? 0 : q === 1 ? 92.95 : q === 2 ? 167.31 : q === 3 ? 237.02 : +(q * 92.95 * .85).toFixed(2); }
  function renderCart() {
    var box = $('.cart__items');
    box.innerHTML = qty ? '<div class="ci"><img src="../images/cushion-sm.webp" alt=""><div><b>Lumbar Support Seat Cushion</b><small>' + (qty === 1 ? 'The Single' : qty === 2 ? 'The Duo · save 10%' : qty === 3 ? 'The Trio · save 15%' : qty + ' cushions · save 15%') + '</small><div class="ci__q"><button type="button" data-q="-1" aria-label="Decrease">−</button><span>' + qty + '</span><button type="button" data-q="1" aria-label="Increase">+</button></div></div><b>' + money(total(qty)) + '</b></div>' : '<p class="cart__empty">Your cart is empty.</p>';
    $('.cart__sum').textContent = money(total(qty));
    var c = $('.cart-count'); c.textContent = qty; c.hidden = !qty;
    $('.cart__msg').innerHTML = qty >= 3 ? 'Free shipping ✓ · <b>You save 15%</b>' : qty === 2 ? 'Free shipping ✓ · You save 10% — <b>add 1 more to save 15%</b>' : 'Free shipping ✓ · <b>Add a 2nd cushion for the car and save 10%</b>';
  }
  $('.cart__items').addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (!b) return; qty = Math.max(0, qty + (+b.dataset.q)); renderCart(); });
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]'); if (!b) return;
    qty += +b.dataset.add; renderCart();
    var c = $('.cart-count'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    closeAll(); open('.cart');
  });

  /* ---------- Overlays ---------- */
  function open(selc) {
    var o = $(selc); o.hidden = false; requestAnimationFrame(function () { o.classList.add('is-on'); });
    d.body.classList.add('locked'); if (lenis) lenis.stop();
  }
  function closeAll() {
    $$('.overlay').forEach(function (o) {
      if (o.hidden) return; o.classList.remove('is-on');
      setTimeout(function () { if (!o.classList.contains('is-on')) o.hidden = true; }, 350);
    });
    var v = $('.vplayer video'); v.pause();
    d.body.classList.remove('locked'); if (lenis) lenis.start();
  }
  $$('[data-open-cart]').forEach(function (b) { b.addEventListener('click', function () { open('.cart'); }); });
  $$('[data-close]').forEach(function (b) { b.addEventListener('click', closeAll); });
  $$('.overlay').forEach(function (o) { o.addEventListener('click', function (e) { if (e.target === o) closeAll(); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); closeMenu(); } });

  /* ---------- Menu ---------- */
  var menu = $('.menu'), mnav = $('.mnav');
  function closeMenu() { mnav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); mnav.setAttribute('aria-hidden', 'true'); }
  menu.addEventListener('click', function () { var o = !mnav.classList.contains('is-open'); mnav.classList.toggle('is-open', o); menu.setAttribute('aria-expanded', o); mnav.setAttribute('aria-hidden', !o); });
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (a.hasAttribute('data-open-quiz')) return;
      var id = a.getAttribute('href'); if (id.length < 2) return; var t = $(id); if (!t) return;
      e.preventDefault(); closeMenu();
      if (lenis) lenis.scrollTo(t, { offset: -64, duration: 1.3 }); else t.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- Quiz + prompt ---------- */
  (function () {
    var steps = $$('.quiz__step'), pick = 1;
    function go(q) { steps.forEach(function (s) { s.classList.toggle('is-on', s.dataset.q === q); }); }
    $$('[data-open-quiz]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); go('1'); hidePrompt(); open('.quiz'); }); });
    $$('.quiz__opts').forEach(function (g, i) {
      g.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (i === 0) pick = +b.dataset.v;
        if (i < 2) { go(String(i + 2)); return; }
        var names = { 1: 'The Single', 2: 'The Duo', 3: 'The Trio' };
        var why = { 1: 'One cushion for the chair you use the most — strap it on and sit.', 2: 'One for your desk and one for your car, so your support never stays behind. Saves 10%.', 3: 'Support at your desk, in your car and at home. Saves 15%.' };
        $('.quiz__res').textContent = names[pick]; $('.quiz__why').textContent = why[pick];
        $('.quiz__add').dataset.add = pick; go('r');
      });
    });
    var prompt = $('.prompt'), dismissed = false;
    function hidePrompt() { prompt.classList.remove('is-on'); dismissed = true; }
    $('.prompt__x').addEventListener('click', hidePrompt);
    w.addEventListener('scroll', function () {
      if (dismissed) return;
      var p = w.scrollY / (d.documentElement.scrollHeight - innerHeight);
      if (p > .18) { prompt.hidden = false; prompt.classList.add('is-on'); }
    }, { passive: true });
  })();

  /* ---------- Benefits tabs ---------- */
  var benGo;
  (function () {
    var sec = $('.ben'), tabs = $$('.ben__tabs button'), panes = $$('.bp'), line = $('.ben__line'), i0 = 0, timer, vis = false, user = false;
    benGo = function (i) {
      i0 = i;
      tabs.forEach(function (t, j) { t.classList.toggle('is-on', j === i); t.setAttribute('aria-selected', j === i); });
      panes.forEach(function (p, j) { p.classList.toggle('is-on', j === i); });
      line.style.transform = 'translateX(' + (i * 100) + '%)';
    };
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { user = true; benGo(i); }); });
    function tick() { if (vis && !user) benGo((i0 + 1) % tabs.length); timer = setTimeout(tick, 5500); }
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }, { threshold: .35 }).observe(sec);
    timer = setTimeout(tick, 5500);
  })();

  /* ---------- Reviews ---------- */
  (function () {
    var revs = $$('.rev'), dots = $('.revs__dots'), i0 = 0, timer;
    revs.forEach(function (r) {
      var q = $('blockquote', r); q.innerHTML = q.textContent.split(' ').map(function (wd) { return '<span class="w">' + wd + '</span>'; }).join(' ');
    });
    revs.forEach(function (_, i) { var b = d.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Review ' + (i + 1)); b.addEventListener('click', function () { go(i); }); dots.appendChild(b); });
    var db = $$('button', dots);
    function show(i, instant) {
      var r = revs[i];
      revs.forEach(function (x, j) { x.classList.toggle('is-on', j === i); });
      db.forEach(function (b, j) { b.classList.toggle('is-on', j === i); });
      if (!hasGsap || reduce || instant) { revs.forEach(function (x, j) { x.style.opacity = j === i ? 1 : 0; }); return; }
      gsap.set(r, { opacity: 1 });
      gsap.fromTo($$('.w', r), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, stagger: .02, ease: 'expo.out' });
      gsap.fromTo($('figcaption', r), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .8, delay: .3, ease: 'expo.out' });
    }
    function go(i) {
      i = (i + revs.length) % revs.length; if (i === i0) return;
      var old = revs[i0]; i0 = i;
      if (hasGsap && !reduce) gsap.to(old, { opacity: 0, duration: .3, onComplete: function () { old.classList.remove('is-on'); } });
      show(i);
      clearInterval(timer); timer = setInterval(function () { go(i0 + 1); }, 7000);
    }
    $$('.arw[data-dir]').forEach(function (a) { a.addEventListener('click', function () { go(i0 + (+a.dataset.dir)); }); });
    show(0, true);
    timer = setInterval(function () { go(i0 + 1); }, 7000);
    var sx = null, st = $('.revs__stage');
    st.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    st.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(i0 + (dx < 0 ? 1 : -1)); sx = null; });
  })();

  /* ---------- Real-world videos ---------- */
  (function () {
    var track = $('.wild__track'), pv = $('.vplayer video');
    $$('.wc').forEach(function (c) {
      var v = $('video', c);
      if (fine) {
        c.addEventListener('mouseenter', function () { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); });
        c.addEventListener('mouseleave', function () { v.pause(); });
      }
    });
    $$('[data-src]').forEach(function (b) {
      b.addEventListener('click', function () { pv.src = b.dataset.src; open('.vplayer'); var p = pv.play(); if (p && p.catch) p.catch(function () {}); });
    });
    if (!fine) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { var v = $('video', e.target); if (e.isIntersecting) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }); }, { threshold: .7 });
      $$('.wc').forEach(function (c) { io.observe(c); });
    }
    $$('[data-wdir]').forEach(function (b) { b.addEventListener('click', function () { track.scrollBy({ left: +b.dataset.wdir * 600, behavior: 'smooth' }); }); });
  })();

  /* ---------- Header ---------- */
  var hdr = $('.hdr');
  w.addEventListener('scroll', function () { hdr.classList.toggle('is-scrolled', w.scrollY > 10); }, { passive: true });

  /* ---------- Design notes (?notes=1) ---------- */
  var NOTES = {
    1: ['Hero — exactly the CoreChair pattern', 'Full-width dark studio scene with the <b>real product</b> on the right, a big serif headline with an italic accent line, and two stacked buttons ("See what changes" / "Shop"). The headline slides up line by line and the product drifts with the mouse — the motion you liked, kept calm.'],
    2: ['"A better way to feel while you sit"', 'CoreChair\'s benefit slider: five tabs with a sliding underline, a 4-photo collage of <b>real people</b> (no AI images) and one customer-feedback fact per tab. It auto-advances while in view.'],
    3: ['The shift — full-screen video', 'Like CoreChair\'s "Designed for alignment. Built for movement." — a real office video plays behind a huge two-line statement that reveals as you arrive and slowly zooms as you scroll.'],
    4: ['Meet ErgoGraphene', 'White chapter, giant headline, plain-language explanation and the product with four labelled support zones — mirrors CoreChair\'s "Meet CoreChair".'],
    5: ['How it works — sticky timeline', 'CoreChair\'s signature layout: the image column stays fixed on the left while the three steps scroll on the right. The blue rail fills as you read, the numbered dots light up and the image crossfades (photo → product with graphene glow → video).'],
    6: ['Choose your set', 'CoreChair lists its four chairs as clean product columns. We do the same with <b>The Single, The Duo and The Trio</b> — bundles that raise order value (discounts to confirm). "Find your set" opens a 3-question quiz with a 10% code.'],
    7: ['The principle', 'One short brand belief. The second line fills with colour as you scroll, like CoreChair\'s "always the best".'],
    8: ['The proof — dark chapter', 'Your real 96 / 94 / 91 / 97% customer-feedback numbers count up in CoreChair\'s big-number rows, followed by the research references from your science page.'],
    9: ['Seen on', 'CoreChair\'s "Seen, tested and awarded" cards, using the media logos from your current site. <b>Please confirm you can use these logos.</b>'],
    10: ['Text testimonials', 'Your 7 real reviews in CoreChair\'s big-quote carousel — words slide in one by one, auto-advance, arrows, dots and swipe on mobile.'],
    11: ['Try it in your chair', 'Full-width real photo with the 30-day guarantee, then dark offer rows with price and button — exactly CoreChair\'s "Try CoreChair at your desk".'],
    12: ['Video testimonials', 'CoreChair\'s "in the real world" UGC strip. Videos play on hover (or as you scroll on mobile) and open full-screen. <b>Sample clips</b> — to be replaced with your customers\' own videos.']
  };
  if (/[?&]notes=1/.test(location.search)) {
    var panel = $('.notes'), keys = Object.keys(NOTES).map(Number), nc = 0;
    var show = function (i) {
      nc = (i + keys.length) % keys.length; var k = keys[nc];
      $('.notes__k', panel).textContent = 'Why this layout · ' + k + ' / ' + keys.length;
      $('.notes__t', panel).textContent = NOTES[k][0]; $('.notes__b', panel).innerHTML = NOTES[k][1]; panel.hidden = false;
      $$('.is-noted').forEach(function (e) { e.classList.remove('is-noted'); });
      var el = $('[data-note="' + k + '"]'); if (el) el.classList.add('is-noted');
    };
    var jump = function (i) { show(i); var el = $('[data-note="' + keys[nc] + '"]'); if (el) { if (lenis) lenis.scrollTo(el, { offset: -64 }); else el.scrollIntoView(); } };
    $$('[data-note]').forEach(function (el) {
      var pin = d.createElement('button'); pin.type = 'button'; pin.className = 'note-pin'; pin.textContent = el.dataset.note;
      pin.addEventListener('click', function (e) { e.stopPropagation(); show(keys.indexOf(+el.dataset.note)); });
      el.appendChild(pin);
    });
    $('.notes__next', panel).addEventListener('click', function () { jump(nc + 1); });
    $('.notes__prev', panel).addEventListener('click', function () { jump(nc - 1); });
    $('.notes__x', panel).addEventListener('click', function () { panel.hidden = true; });
    show(0);
  }

  applyPrices();

  /* =========================================================
     Motion
     ========================================================= */
  if (!hasGsap || reduce) {
    $$('.ln--fade').forEach(function (l) { l.style.color = 'var(--accent)'; });
    $$('.cnt').forEach(function (c) { c.textContent = c.dataset.to; });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  if (typeof w.Lenis !== 'undefined') {
    lenis = new w.Lenis({ lerp: .1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // line-mask helper
  function wrapLines(sel) {
    $$(sel).forEach(function (ln) { var inner = d.createElement('span'); inner.style.display = 'block'; while (ln.firstChild) inner.appendChild(ln.firstChild); ln.appendChild(inner); });
  }
  wrapLines('.hero__t .ln, .shift__t .ln, .proof .h2 .ln');

  // HERO intro
  gsap.timeline({ delay: .15 })
    .from('.hero__bg', { opacity: 0, duration: 1.2, ease: 'power2.out' })
    .from('.hero__img', { xPercent: 12, opacity: 0, scale: .92, duration: 1.6, ease: 'expo.out' }, .1)
    .from('.hero__t .ln > span', { yPercent: 110, duration: 1.2, stagger: .12, ease: 'expo.out' }, .3)
    .from(['.hero__p', '.hero__cta .btn'], { y: 24, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out' }, .7);
  gsap.to('.hero__img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__copy', { y: -60, opacity: .3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  if (fine) {
    var hx = gsap.quickTo('.hero__img', 'x', { duration: 1.2, ease: 'power3' }), hr = gsap.quickTo('.hero__img', 'rotation', { duration: 1.2, ease: 'power3' });
    var sx = gsap.quickTo('.hero__spot', 'xPercent', { duration: 1.6, ease: 'power3' });
    $('.hero').addEventListener('pointermove', function (e) { var p = e.clientX / innerWidth - .5; hx(p * 30); hr(p * 2); sx(p * 30); });
  }

  // generic reveals
  function reveal(targets, trig, vars) {
    gsap.from(targets, Object.assign({ y: 40, opacity: 0, duration: 1.1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: trig, start: 'top 82%' } }, vars || {}));
  }
  reveal('.ben__head > *', '.ben');
  reveal('.ben__tabs', '.ben__tabs');
  reveal('.ben__panes', '.ben__panes', { y: 60 });
  reveal('.meet__copy > *', '.meet');
  gsap.from('.meet__fig img', { y: 80, rotate: -4, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.meet__fig', start: 'top 80%' } });
  gsap.from('.tag', { scale: .6, opacity: 0, duration: .8, stagger: .15, ease: 'back.out(2)', delay: .5, scrollTrigger: { trigger: '.meet__fig', start: 'top 70%' } });
  reveal('.how .wrap > *', '.how');
  reveal('.choose .wrap > .eyebrow, .choose .h2, .choose .btn--ink', '.choose');
  reveal('.model', '.models', { y: 70, stagger: .12 });
  reveal('.proof__head > div > .eyebrow, .proof__intro', '.proof');
  gsap.from('.proof .h2 .ln > span', { yPercent: 110, duration: 1.2, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.proof .h2', start: 'top 80%' } });
  reveal('.stat', '.stat', { stagger: .1 });
  reveal('.rrow', '.rtable');
  reveal('.seen__head > *', '.seen');
  reveal('.sc', '.seen__cards', { y: 50, stagger: .1 });
  reveal('.revs__side > *', '.revs');
  reveal('.wild__head > *', '.wild');
  reveal('.wc', '.wild__track', { y: 0, scale: .94, stagger: .08 });
  reveal('.offer', '.try__offers');

  // SHIFT: video zoom + lines
  gsap.fromTo('.shift__vid', { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.shift', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.shift__t .ln > span', { yPercent: 110, duration: 1.3, stagger: .14, ease: 'expo.out', scrollTrigger: { trigger: '.shift', start: 'top 55%' } });
  gsap.from(['.shift .eyebrow', '.shift__p'], { opacity: 0, y: 20, duration: 1, stagger: .4, delay: .2, ease: 'expo.out', scrollTrigger: { trigger: '.shift', start: 'top 55%' } });

  // HOW: sticky media + rail
  (function () {
    var steps = $$('.how__steps li'), media = $$('.hm'), vid = $('.hm video');
    function set(i) {
      steps.forEach(function (s, j) { s.classList.toggle('is-on', j === i); });
      media.forEach(function (m, j) { m.classList.toggle('is-on', j === i); });
      if (i === 2) { vid.preload = 'auto'; var p = vid.play(); if (p && p.catch) p.catch(function () {}); } else vid.pause();
    }
    steps.forEach(function (s, i) { ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: function (st) { if (st.isActive) set(i); } }); });
    gsap.to('.how__rail b', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.how__steps', start: 'top 60%', end: 'bottom 60%', scrub: true } });
    steps.forEach(function (s) { gsap.from($$('.eyebrow, h3, p:last-child', s), { y: 30, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 60%' } }); });
  })();

  // MANTRA: colour fill on scroll
  (function () {
    var l = $('.ln--fade'); var txt = l.textContent;
    l.innerHTML = txt.split('').map(function (c) { return '<span class="mc">' + c + '</span>'; }).join('');
    var em = d.createElement('em'); // keep italic on "hurt"
    var spans = $$('.mc', l);
    for (var i = 0; i < 4; i++) { spans[i].style.fontStyle = 'italic'; }
    ScrollTrigger.create({ trigger: '.mantra', start: 'top 75%', end: 'bottom 45%', scrub: true, onUpdate: function (st) {
      var n = Math.round(st.progress * spans.length); spans.forEach(function (s, i) { s.style.color = i < n ? 'var(--accent)' : ''; });
    } });
    void em;
  })();

  // PROOF counters
  $$('.cnt').forEach(function (c) {
    var o = { v: 0 };
    ScrollTrigger.create({ trigger: c, start: 'top 85%', once: true, onEnter: function () { gsap.to(o, { v: +c.dataset.to, duration: 1.8, ease: 'expo.out', onUpdate: function () { c.textContent = Math.round(o.v); } }); } });
  });

  // TRY: scale-in scene
  gsap.fromTo('.try__scene img', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.try__scene', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  gsap.from('.try__copy > *', { y: 40, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.try__scene', start: 'top 45%' } });

  w.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
