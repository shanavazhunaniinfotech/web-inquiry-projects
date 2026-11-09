/* Version A "Skyline" — renderers + animation choreography (behaviours live in core.js) */
(function () {
  'use strict';
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.3C1.1 8.3 3.4 5 6.8 5c2 0 3.5 1.1 4.2 2.4h2C13.7 6.1 15.2 5 17.2 5c3.4 0 5.7 3.3 4.3 6.7C19.5 16.4 12 21 12 21z"/></svg>';

  /* ---------- Houston skyline generator (echoes the skyline inside the HOU logo) ---------- */
  function skyline(el, opts) {
    var W = 1600, H = opts.h || 240, seed = opts.seed || 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var b = [ // [x, w, h, cap]
      [0, 70, 60], [66, 50, 85], [112, 80, 52], [188, 46, 110, 'slant'], [230, 64, 74], [290, 40, 128], [326, 70, 92, 'step'],
      [392, 54, 150, 'spire'], [442, 66, 108], [504, 44, 176, 'step'], [544, 72, 132], [612, 52, 205, 'dome'], [660, 60, 158, 'slant'],
      [716, 48, 226, 'spire'], [760, 74, 172, 'step'], [830, 56, 198], [882, 66, 150, 'slant'], [944, 50, 214, 'step'], [990, 70, 128],
      [1056, 46, 168, 'spire'], [1098, 76, 112], [1170, 52, 142, 'dome'], [1218, 64, 96], [1278, 44, 120, 'slant'], [1318, 70, 80],
      [1384, 56, 104], [1436, 62, 66], [1494, 50, 88], [1540, 60, 58]
    ];
    var shapes = '', wins = '';
    b.forEach(function (s) {
      var x = s[0], w = s[1], h = s[2] * (opts.scale || 1), y = H - h, cap = s[3], d;
      if (cap === 'step') d = 'M' + x + ',' + H + 'V' + (y + 14) + 'H' + (x + w * 0.15) + 'V' + y + 'H' + (x + w * 0.85) + 'V' + (y + 14) + 'H' + (x + w) + 'V' + H + 'Z';
      else if (cap === 'spire') d = 'M' + x + ',' + H + 'V' + (y + 10) + 'L' + (x + w / 2) + ',' + (y - 26) + 'L' + (x + w) + ',' + (y + 10) + 'V' + H + 'Z';
      else if (cap === 'slant') d = 'M' + x + ',' + H + 'V' + (y + 18) + 'L' + (x + w) + ',' + y + 'V' + H + 'Z';
      else if (cap === 'dome') d = 'M' + x + ',' + H + 'V' + (y + 12) + 'Q' + (x + w / 2) + ',' + (y - 18) + ' ' + (x + w) + ',' + (y + 12) + 'V' + H + 'Z';
      else d = 'M' + x + ',' + H + 'V' + y + 'H' + (x + w) + 'V' + H + 'Z';
      shapes += '<path d="' + d + '"/>';
      if (opts.windows) {
        for (var wy = y + 22; wy < H - 10; wy += 13) for (var wx = x + 8; wx < x + w - 8; wx += 11) {
          if (rnd() < 0.42) wins += '<rect class="win" x="' + wx + '" y="' + wy + '" width="5" height="6"/>';
        }
      }
    });
    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMax slice"><g class="bld">' + shapes + '</g><g class="wins">' + wins + '</g></svg>';
  }

  /* ---------- Renderers ---------- */
  window.SH_RENDER = function (D, F) {
    function card(l, i, set) {
      var label = F.price(l.price) + ' home in ' + l.city;
      return '<article class="lc' + (set === 'ours' && i === 0 ? ' lc-feature' : '') + '">' +
        '<div class="lc-media"><img src="' + l.img + '" alt="' + esc(l.city) + ' home listed at ' + F.price(l.price) + '" loading="lazy">' +
        (l.tag ? '<span class="lc-tag">' + esc(l.tag) + '</span>' : '') +
        '<button type="button" class="lc-fav js-fav" aria-pressed="false" aria-label="Save ' + esc(label) + '">' + heart + '</button>' +
        '<span class="lc-num">' + String(i + 1).padStart(2, '0') + '</span></div>' +
        '<div class="lc-body"><p class="lc-price">' + F.price(l.price) + '</p><p class="lc-city">' + esc(l.city) + ', TX <span>· ' + esc(l.type) + '</span></p>' +
        '<ul class="lc-meta"><li><b>' + l.beds + '</b> beds</li><li><b>' + l.baths + '</b> baths</li><li><b>' + F.num(l.sqft) + '</b> sqft</li></ul>' +
        '<button type="button" class="lc-tour" data-tour="' + esc(label) + '">Schedule a tour <span aria-hidden="true">→</span></button></div></article>';
    }
    ['ours', 'just', 'open'].forEach(function (set) {
      var el = document.querySelector('[data-render="' + set + '"]');
      if (!el) return;
      el.innerHTML = D.listings[set].map(function (l, i) { return card(l, i, set); }).join('') +
        '<a class="lc lc-more" href="' + D.idx.search + '" target="_blank" rel="noopener"><span class="lc-more-ico" aria-hidden="true">↗</span><strong>Search every home for sale</strong><span>Live HAR MLS data, map search and saved favorites.</span></a>';
    });

    var team = document.querySelector('[data-render="team"]');
    if (team) team.innerHTML = D.team.map(function (a) {
      return '<article class="agent"><div class="agent-img"><img src="images/' + a.img + '" alt="' + esc(a.name) + '" loading="lazy"></div>' +
        '<div class="agent-body"><h3>' + esc(a.name) + '</h3><p>' + esc(a.role) + '</p><p class="agent-lic">TX Lic. #' + a.lic + ' · Speaks English</p>' +
        '<div class="agent-act"><a href="tel:+1' + a.cell.replace(/\D/g, '') + '" class="btn btn-ind btn-sm">Call ' + a.cell + '</a>' +
        '<button type="button" class="btn btn-line btn-sm" data-open="ask" data-message="Hi ' + esc(a.name.split(' ')[0]) + ', ">Email me</button></div></div></article>';
    }).join('');

    var hoods = document.querySelector('[data-render="hoods"]');
    if (hoods) hoods.innerHTML = D.hoods.map(function (h, i) {
      return '<article class="hood' + (i === 0 ? ' is-active' : '') + '" tabindex="0"><img src="' + h.img + '" alt="' + esc(h.name) + ' neighborhood" loading="lazy">' +
        '<div class="hood-in"><span class="hood-n">' + String(i + 1).padStart(2, '0') + '</span><h3>' + esc(h.name) + '</h3>' +
        '<div class="hood-more"><span class="hood-tag">' + esc(h.tag) + '</span><p>' + esc(h.text) + '</p>' +
        '<button type="button" class="lnk lnk-light" data-open="ask" data-topic="Buying a home" data-message="I\'d like to learn more about homes in ' + esc(h.name) + '.">Homes in ' + esc(h.name) + ' <span>→</span></button></div></div></article>';
    }).join('');

    var areas = document.querySelector('[data-render="areas"]');
    if (areas) areas.innerHTML = D.areas.map(function (a) { return '<li><a href="' + D.idx.search + '" target="_blank" rel="noopener">' + esc(a) + ' <span aria-hidden="true">↗</span></a></li>'; }).join('');

    var feat = document.querySelector('[data-render="reviews-feature"]');
    if (feat) feat.innerHTML = D.reviews.slice(0, 5).map(function (r) {
      return '<figure class="rf js-slide"><blockquote>' + esc(r.text) + '</blockquote><figcaption><span class="rf-av" aria-hidden="true">' + esc(r.name.charAt(0)) + '</span><div><strong>' + esc(r.name) + '</strong><span>' + esc(r.role) + '</span></div></figcaption></figure>';
    }).join('');
    function wall(list) { var h = list.map(function (r) { return '<div class="rc"><span class="stars">★★★★★</span><p>“' + esc(r.text) + '”</p><strong>' + esc(r.name) + '</strong><span>' + esc(r.role) + '</span></div>'; }).join(''); return h + h; }
    var wa = document.querySelector('[data-render="reviews-wall-a"]'), wb = document.querySelector('[data-render="reviews-wall-b"]');
    if (wa) wa.innerHTML = wall(D.reviews.slice(5, 10));
    if (wb) wb.innerHTML = wall(D.reviews.slice(10));

    var sky = document.querySelector('[data-skyline]');
    if (sky) skyline(sky, { h: 260, windows: true, seed: 11 });
    var fsky = document.querySelector('[data-skyline-foot]');
    if (fsky) skyline(fsky, { h: 200, scale: 0.8, windows: false, seed: 3 });

    /* neighborhood panels: hover / focus / tap to expand */
    document.querySelectorAll('.hood').forEach(function (h) {
      function act() { document.querySelectorAll('.hood').forEach(function (o) { o.classList.toggle('is-active', o === h); }); }
      h.addEventListener('mouseenter', act); h.addEventListener('focus', act); h.addEventListener('click', act);
    });
    /* nav: "Search with AI" jumps to the AI mode */
    document.querySelectorAll('.dd-menu a[href="#top"]').forEach(function (a) {
      a.addEventListener('click', function () { var m = /AI/.test(a.textContent) ? 'ai' : 'classic'; var b = document.querySelector('[data-search-mode="' + m + '"]'); var t = document.querySelector('[data-search-tab="buy"]'); if (t) t.click(); if (b) b.click(); });
    });
  };

  /* ---------- Animation choreography ---------- */
  window.SH_FX = function (k) {
    var gsap = k.gsap, $$ = k.$$, $ = k.$;
    var wins = $$('.skyline .win');
    gsap.set(wins, { opacity: 0.08 });

    /* intro */
    var heroWords = $$('.hero-h .wi');
    gsap.set(heroWords, { yPercent: 115 });
    gsap.set(['.hero .kick', '.hero-lede', '.hero-proof'], { y: 30, opacity: 0 });
    gsap.set('.search', { y: 60, opacity: 0 });
    gsap.set('.hs-card', { x: 40, opacity: 0 });
    gsap.set('.hero-img', { scale: 1.25 });
    gsap.set('.skyline .bld path', { yPercent: 100 });

    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    if (!k.store.get('preA')) {
      k.store.set('preA', '1');
      var c = { v: 0 }, cEl = $('.pre-count');
      tl.from('.pre-word span, .pre-word i', { y: 40, opacity: 0, stagger: 0.07, duration: 0.7 })
        .to(c, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: function () { cEl.textContent = Math.round(c.v); } }, 0)
        .to('.pre', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '+=0.1');
    } else tl.to('.pre', { opacity: 0, duration: 0.3 });
    tl.add(k.done)
      .to('.hero-img', { scale: 1.08, duration: 2.2, ease: 'expo.out' }, '-=0.5')
      .to('.skyline .bld path', { yPercent: 0, duration: 1.3, stagger: { each: 0.025, from: 'center' }, ease: 'expo.out' }, '<')
      .to(heroWords, { yPercent: 0, duration: 1.1, stagger: 0.06 }, '<0.15')
      .to('.hero .kick', { y: 0, opacity: 1, duration: 0.8 }, '<')
      .to('.hero-lede', { y: 0, opacity: 1, duration: 0.9 }, '<0.4')
      .to('.hero-proof', { y: 0, opacity: 1, duration: 0.9 }, '<0.1')
      .to('.search', { y: 0, opacity: 1, duration: 1.1 }, '<0.05')
      .to('.hs-card', { x: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'back.out(1.5)' }, '<0.2')
      .add(function () {
        /* city lights switch on, then twinkle */
        gsap.to(wins, { opacity: function () { return Math.random() < 0.7 ? 1 : 0.15; }, duration: 0.25, stagger: { each: 0.004, from: 'random' } });
        (function twinkle() {
          var w = wins[Math.floor(Math.random() * wins.length)];
          if (w) gsap.to(w, { opacity: w.style.opacity > 0.5 ? 0.12 : 1, duration: 0.4 });
          gsap.delayedCall(0.12 + Math.random() * 0.3, twinkle);
        })();
      }, '<0.2');

    gsap.to('.hs-sold', { y: -10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.hero-img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    /* split headings */
    $$('[data-split]').forEach(function (h) {
      if (h.classList.contains('hero-h')) return;
      gsap.from($$('.wi', h), { yPercent: 115, duration: 1.1, stagger: 0.045, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 86%', once: true } });
    });
    $$('.sec-head .kick, .team-copy .kick, .faq .kick, .contact .kick, .sell-head .kick, .rev-top .kick, .remax .kick').forEach(function (e) {
      gsap.from(e, { opacity: 0, x: -24, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: e, start: 'top 90%', once: true } });
    });
    function rise(sel, trig, extra) {
      $$(sel).length && gsap.from(sel, Object.assign({ opacity: 0, y: 60, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: trig || sel, start: 'top 85%', once: true } }, extra || {}));
    }
    rise('.path', '.paths-grid');
    rise('.stat', '.stats');
    rise('.agent', '.agents');
    rise('.res-card', '.res-grid');
    rise('.reel', '.reels', { rotate: 3 });
    rise('.acc details', '.acc', { y: 30 });
    rise('.areas li', '.areas', { y: 20, stagger: 0.04 });
    $$('.lede, .team-copy > p, .ticks li, .row-btns, .ct-list li, .faq-aside, .vband-note, .remax-join, .guide-copy > *').forEach(function (el) {
      gsap.from(el, { opacity: 0, y: 26, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });

    /* listings slide in from the right on each tab */
    function listIn(panel) { gsap.fromTo($$('.lc', panel), { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 1, stagger: 0.07, ease: 'power3.out', clearProps: 'transform' }); }
    k.ST.create({ trigger: '.l-stage', start: 'top 85%', once: true, onEnter: function () { listIn($('.l-panel.is-active')); } });
    gsap.set('.l-panel.is-active .lc', { opacity: 0 });
    $('.listings').addEventListener('sh:tab', function () { listIn($('.l-panel.is-active')); });

    /* sell: steps light up with a red progress rail */
    gsap.fromTo('.steps', { '--rail': 0 }, { '--rail': 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 60%', scrub: true } });
    $$('.step-i').forEach(function (s) {
      k.ST.create({ trigger: s, start: 'top 65%', onEnter: function () { s.classList.add('is-on'); }, onLeaveBack: function () { s.classList.remove('is-on'); } });
      gsap.from(s, { opacity: 0, x: 60, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 88%', once: true } });
    });
    gsap.from('.quote-band blockquote', { opacity: 0, y: 40, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.quote-band', start: 'top 85%', once: true } });

    /* value band parallax */
    gsap.fromTo('.vband-img img', { yPercent: -10, scale: 1.15 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.vband', start: 'top bottom', end: 'bottom top', scrub: true } });
    rise('.vband-form', '.vband', { y: 40 });

    /* team hero clip reveal */
    gsap.fromTo('.team-hero', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.team-hero', start: 'top 80%', once: true } });
    gsap.fromTo('.team-hero img', { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.team-hero', start: 'top 80%', once: true } });

    /* neighborhoods */
    rise('.hood', '.hoods', { y: 80, stagger: 0.08 });
    gsap.from('.guide-book .book', { rotateY: -70, opacity: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '.guide', start: 'top 80%', once: true } });
    rise('.guide', '.guide', { y: 50, stagger: 0 });

    /* RE/MAX balloon floats */
    gsap.to('.remax-balloon', { y: -18, rotation: 2, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.from('.remax-balloon', { y: 200, opacity: 0, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: '.remax', start: 'top 80%', once: true } });

    /* review score */
    gsap.from('.rev-score', { scale: 0.6, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.rev-top', start: 'top 80%', once: true } });

    /* footer skyline rises */
    gsap.from('.ftr-sky path', { yPercent: 100, duration: 1.2, stagger: { each: 0.02, from: 'random' }, ease: 'expo.out', scrollTrigger: { trigger: '.ftr', start: 'top 90%', once: true } });
  };
})();
