/* Version B "Grand Estate" — renderers + animation choreography (behaviours live in ../core.js) */
(function () {
  'use strict';
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.3C1.1 8.3 3.4 5 6.8 5c2 0 3.5 1.1 4.2 2.4h2C13.7 6.1 15.2 5 17.2 5c3.4 0 5.7 3.3 4.3 6.7C19.5 16.4 12 21 12 21z"/></svg>';
  var roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  window.SH_RENDER = function (D, F) {
    /* listings: editorial gallery, hover a row to swap the large image */
    ['ours', 'just', 'open'].forEach(function (set) {
      var el = document.querySelector('[data-render="' + set + '"]');
      if (!el) return;
      var L = D.listings[set];
      var imgs = L.map(function (l, i) {
        return '<img class="lg-img' + (i === 0 ? ' is-on' : '') + '" src="' + l.img + '" alt="' + esc(l.city) + ' home listed at ' + F.price(l.price) + '" loading="lazy">';
      }).join('');
      var rows = L.map(function (l, i) {
        var label = F.price(l.price) + ' home in ' + l.city;
        return '<li class="lg-row' + (i === 0 ? ' is-on' : '') + '" data-i="' + i + '" tabindex="0">' +
          '<span class="lg-n">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<img class="lg-thumb" src="' + l.img + '" alt="" loading="lazy">' +
          '<div class="lg-info"><strong>' + F.price(l.price) + '</strong><span>' + esc(l.city) + ', TX · ' + esc(l.type) + '</span></div>' +
          '<span class="lg-meta">' + l.beds + ' bd · ' + l.baths + ' ba · ' + F.num(l.sqft) + ' sqft</span>' +
          '<button type="button" class="lg-fav js-fav" aria-pressed="false" aria-label="Save ' + esc(label) + '">' + heart + '</button>' +
          '<button type="button" class="lg-tour" data-tour="' + esc(label) + '">Tour <span aria-hidden="true">→</span></button></li>';
      }).join('');
      var first = L[0];
      el.innerHTML = '<div class="lg"><div class="lg-media">' + imgs +
        '<div class="lg-cap"><span class="lg-tag">' + esc(first.tag || (set === 'ours' ? 'Our listing' : '')) + '</span><strong data-lg-price>' + F.price(first.price) + '</strong><span data-lg-city>' + esc(first.city) + ', Texas</span></div></div>' +
        '<ol class="lg-list">' + rows + '<li class="lg-more"><a href="' + D.idx.search + '" target="_blank" rel="noopener">Search every home for sale <span aria-hidden="true">↗</span></a></li></ol></div>';
      var media = el.querySelector('.lg-media'), price = el.querySelector('[data-lg-price]'), city = el.querySelector('[data-lg-city]'), tag = el.querySelector('.lg-tag');
      el.querySelectorAll('.lg-row').forEach(function (r) {
        function on() {
          var i = +r.dataset.i, l = L[i];
          el.querySelectorAll('.lg-row').forEach(function (o) { o.classList.toggle('is-on', o === r); });
          media.querySelectorAll('.lg-img').forEach(function (m, j) { m.classList.toggle('is-on', j === i); });
          price.textContent = F.price(l.price); city.textContent = l.city + ', Texas';
          tag.textContent = l.tag || (set === 'ours' ? (i === 0 ? 'Featured' : 'Our listing') : '');
        }
        r.addEventListener('mouseenter', on); r.addEventListener('focus', on); r.addEventListener('click', function (e) { if (!e.target.closest('button')) on(); });
      });
    });

    var team = document.querySelector('[data-render="team"]');
    if (team) team.innerHTML = D.team.map(function (a, i) {
      return '<article class="agent"><div class="agent-img"><img src="../images/' + a.img + '" alt="' + esc(a.name) + '" loading="lazy"></div>' +
        '<div class="agent-body"><span class="agent-n">' + roman[i] + '</span><h3>' + esc(a.name) + '</h3><p>' + esc(a.role) + '</p><p class="agent-lic">TX Lic. #' + a.lic + ' · Speaks English</p>' +
        '<div class="agent-act"><a href="tel:+1' + a.cell.replace(/\D/g, '') + '" class="lnk">Call ' + a.cell + '</a>' +
        '<button type="button" class="lnk" data-open="ask" data-message="Hi ' + esc(a.name.split(' ')[0]) + ', ">Email me</button></div></div></article>';
    }).join('');

    var hoods = document.querySelector('[data-render="hoods"]');
    if (hoods) hoods.innerHTML = D.hoods.map(function (h, i) {
      return '<article class="hood hood-' + (i + 1) + '"><div class="hood-img"><img src="' + h.img + '" alt="' + esc(h.name) + ' neighborhood" loading="lazy"></div>' +
        '<div class="hood-in"><span class="hood-n">' + roman[i] + '</span><span class="hood-tag">' + esc(h.tag) + '</span><h3>' + esc(h.name) + '</h3><p>' + esc(h.text) + '</p>' +
        '<button type="button" class="lnk lnk-light" data-open="ask" data-topic="Buying a home" data-message="I\'d like to learn more about homes in ' + esc(h.name) + '.">Explore ' + esc(h.name) + '</button></div></article>';
    }).join('');

    var areas = document.querySelector('[data-render="areas"]');
    if (areas) areas.innerHTML = D.areas.map(function (a) { return '<li><a href="' + D.idx.search + '" target="_blank" rel="noopener">' + esc(a) + '</a></li>'; }).join('');

    var feat = document.querySelector('[data-render="reviews-feature"]');
    if (feat) feat.innerHTML = D.reviews.slice(0, 5).map(function (r) {
      return '<figure class="rf js-slide"><blockquote>' + esc(r.text) + '</blockquote><figcaption><strong>' + esc(r.name) + '</strong><span>' + esc(r.role) + '</span></figcaption></figure>';
    }).join('');
    var grid = document.querySelector('[data-render="reviews-grid"]');
    if (grid) grid.innerHTML = D.reviews.slice(5).map(function (r) {
      return '<div class="rc"><span class="stars">★★★★★</span><p>“' + esc(r.text) + '”</p><strong>' + esc(r.name) + '</strong><span>' + esc(r.role) + '</span></div>';
    }).join('');

    document.querySelectorAll('.dd-menu a[href="#top"]').forEach(function (a) {
      a.addEventListener('click', function () { var m = /AI/.test(a.textContent) ? 'ai' : 'classic'; var t = document.querySelector('[data-search-tab="buy"]'), b = document.querySelector('[data-search-mode="' + m + '"]'); if (t) t.click(); if (b) b.click(); });
    });

    /* sell steps swap the framed image (also works without GSAP via IntersectionObserver) */
    var steps = document.querySelectorAll('.step-i'), smImgs = document.querySelectorAll('.sm-img'), smNum = document.querySelector('[data-sm-num]');
    if ('IntersectionObserver' in window && steps.length) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (x) {
          if (!x.isIntersecting) return;
          var i = Array.prototype.indexOf.call(steps, x.target);
          steps.forEach(function (s, j) { s.classList.toggle('is-on', j <= i); s.classList.toggle('is-cur', j === i); });
          smImgs.forEach(function (m, j) { m.classList.toggle('is-on', j === i); });
          if (smNum) smNum.textContent = roman[i];
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      steps.forEach(function (s) { io.observe(s); });
    }
  };

  window.SH_FX = function (k) {
    var gsap = k.gsap, $$ = k.$$, $ = k.$;
    var heroWords = $$('.hero-h .wi');
    gsap.set(heroWords, { yPercent: 110 });
    gsap.set(['.hero .kick', '.hero-lede', '.hero-proof'], { y: 30, opacity: 0 });
    gsap.set('.hero-gal', { clipPath: 'inset(0 0 0 100%)' });
    gsap.set('.hg.is-active img', { scale: 1.3 });
    gsap.set('.search', { y: 50, opacity: 0 });
    gsap.set(['.hg-ui', '.hg-badge'], { opacity: 0, y: 20 });

    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    if (!k.store.get('preB')) {
      k.store.set('preB', '1');
      tl.from('.pre-logo', { opacity: 0, scale: 0.85, duration: 1, ease: 'power3.out' })
        .to('.pre-line i', { scaleX: 1, duration: 1, ease: 'power2.inOut' }, '-=0.5')
        .from('.pre-tag', { opacity: 0, y: 14, duration: 0.7 }, '-=0.6')
        .to('.pre-in', { opacity: 0, duration: 0.4 }, '+=0.15')
        .to('.pre-l', { xPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '<0.1')
        .to('.pre-r', { xPercent: 100, duration: 1.1, ease: 'expo.inOut' }, '<');
    } else tl.to('.pre', { opacity: 0, duration: 0.3 });
    tl.add(k.done)
      .to('.hero-gal', { clipPath: 'inset(0 0 0 0%)', duration: 1.6, ease: 'expo.inOut' }, '-=0.7')
      .to('.hg.is-active img', { scale: 1.06, duration: 2.4, ease: 'expo.out' }, '<0.3')
      .to(heroWords, { yPercent: 0, duration: 1.2, stagger: 0.07 }, '<0.1')
      .to('.hero .kick', { y: 0, opacity: 1, duration: 0.9 }, '<')
      .to('.hero-lede', { y: 0, opacity: 1, duration: 1 }, '<0.4')
      .to('.hero-proof', { y: 0, opacity: 1, duration: 1 }, '<0.15')
      .to('.search', { y: 0, opacity: 1, duration: 1.1 }, '<0.1')
      .to(['.hg-ui', '.hg-badge'], { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, '<0.2');

    gsap.to('.hero-gal', { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    $$('[data-split]').forEach(function (h) {
      if (h.classList.contains('hero-h')) return;
      gsap.from($$('.wi', h), { yPercent: 110, duration: 1.2, stagger: 0.05, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 86%', once: true } });
    });
    $$('.kick').forEach(function (e) {
      if (e.closest('.hero')) return;
      gsap.from(e, { opacity: 0, y: 14, letterSpacing: '0.5em', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: e, start: 'top 92%', once: true } });
    });
    function rise(sel, trig, extra) {
      if (!$$(sel).length) return;
      gsap.from(sel, Object.assign({ opacity: 0, y: 50, duration: 1.1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: trig || sel, start: 'top 86%', once: true } }, extra || {}));
    }
    rise('.path', '.paths-row');
    rise('.stat', '.stats');
    rise('.agent', '.agents', { y: 70 });
    rise('.res-col', '.res-row');
    rise('.tile', '.mosaic', { scale: 0.94, y: 30 });
    rise('.acc details', '.acc', { y: 24 });
    rise('.rc', '.rev-grid', { y: 40, stagger: 0.06 });
    rise('.areas li', '.areas', { y: 16, stagger: 0.05 });
    $$('.lede, .team-copy > p, .ticks li, .row-btns, .ct-list li, .faq-aside, .vband-note, .remax-join, .guide-copy > *, .l-foot, .quote').forEach(function (el) {
      gsap.from(el, { opacity: 0, y: 26, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });

    /* listings gallery */
    function galIn(p) { gsap.fromTo($$('.lg-row, .lg-more', p), { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: 'power3.out' }); gsap.fromTo($('.lg-media', p), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'expo.inOut' }); }
    gsap.set('.l-panel.is-active .lg-row, .l-panel.is-active .lg-more', { opacity: 0 });
    k.ST.create({ trigger: '.listings .lg', start: 'top 80%', once: true, onEnter: function () { galIn($('.l-panel.is-active')); } });
    $('.listings').addEventListener('sh:tab', function () { galIn($('.l-panel.is-active')); });

    /* sell framed image */
    gsap.fromTo('.sm-frame', { clipPath: 'inset(12% 12% 12% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '.sell-in', start: 'top 85%', end: 'top 30%', scrub: true } });
    $$('.step-i').forEach(function (s) { gsap.from(s.children, { opacity: 0, y: 40, stagger: 0.08, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 90%', once: true } }); });

    gsap.fromTo('.vband-img img', { yPercent: -10, scale: 1.15 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.vband', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.vband-card', { y: 80, opacity: 0, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: '.vband', start: 'top 75%', once: true } });

    gsap.fromTo('.th-frame', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.team-hero', start: 'top 80%', once: true } });
    gsap.fromTo('.th-frame img', { scale: 1.35 }, { scale: 1, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: '.team-hero', start: 'top 80%', once: true } });
    gsap.fromTo('.sig', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: '.sig', start: 'top 92%', once: true } });

    $$('.hood').forEach(function (h, i) {
      gsap.from(h, { opacity: 0, y: 60, duration: 1.1, delay: (i % 3) * 0.1, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 90%', once: true } });
      gsap.fromTo($('img', h), { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: h, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.from('.guide-book .book', { rotateY: -70, opacity: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '.guide', start: 'top 80%', once: true } });

    gsap.from('.rev-mark', { scale: 0.4, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.rev-slider', start: 'top 85%', once: true } });
    gsap.fromTo('.remax-img img', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.remax', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.to('.remax-balloon', { y: -14, rotation: 2, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.from('.ftr-brand > *', { opacity: 0, y: 30, duration: 1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.ftr', start: 'top 85%', once: true } });
  };
})();
