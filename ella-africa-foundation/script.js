/* Ella Africa Foundation — homepage interactions */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (reduce || !hasGsap) root.classList.add('reduced');
  var motion = hasGsap && !reduce;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------------- smooth scroll ---------------- */
  var lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function scrollToY(y) {
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }
  function scrollToEl(el) {
    if (!el) return;
    var st = el._pinST;
    var y = st ? st.start : el.getBoundingClientRect().top + window.pageYOffset;
    scrollToY(y);
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2 || a.hasAttribute('data-add')) return;
      var t = $(id);
      if (!t) return;
      e.preventDefault();
      closeMenu();
      if (a.hasAttribute('data-book')) { bookGoToPage(+a.getAttribute('data-book')); }
      scrollToEl(t);
    });
  });

  /* ---------------- nav ---------------- */
  var nav = $('#nav');
  function onScrollNav() { nav.classList.toggle('is-solid', window.pageYOffset > 40); }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();
  var burger = $('#burger'), mmenu = $('#mmenu');
  function closeMenu() {
    mmenu.classList.remove('open'); mmenu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
  burger.addEventListener('click', function () {
    var open = !mmenu.classList.contains('open');
    if (!open) return closeMenu();
    mmenu.classList.add('open'); mmenu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    if (lenis) lenis.stop();
  });

  /* ---------------- intro curtain + hero reveal ---------------- */
  function heroIntro() {
    if (!motion) { var c = $('#curtain'); if (c) c.remove(); return; }
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.curtain__inner img', { opacity: 1, duration: .8 })
      .to('.curtain__line span, .curtain__line em', { opacity: 1, y: 0, stagger: .12, duration: .8 }, '-=.4')
      .to('.curtain', { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'expo.inOut' }, '+=.35')
      .from('.her__arch', { scale: 1.25, opacity: 0, duration: 1.6, clearProps: 'opacity' }, '-=.8')
      .from('.her__title .line > span', { yPercent: 110, stagger: .1, duration: 1.2 }, '-=1.4')
      .from('.her .eyebrow, .her__lede, .her__cta, .her__caption, .her__ring, .her__dots', { opacity: 0, y: 24, stagger: .08, duration: 1 }, '-=1')
      .from('.nav', { y: -30, opacity: 0, duration: .8 }, '-=1')
      .add(function () { var c = $('#curtain'); if (c) c.remove(); });
    gsap.set('.curtain__line span, .curtain__line em', { y: 20 });
  }

  /* ---------------- 1. HER WORLD ---------------- */
  function herWorld() {
    var scenes = $$('.scene'), dots = $$('.her__dots li'), word = $('#herWord');
    var cur = 0;
    function setScene(i) {
      if (i === cur) return; cur = i;
      dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
      var txt = scenes[i].getAttribute('data-word');
      if (motion) {
        gsap.to(word, { yPercent: -60, opacity: 0, duration: .25, onComplete: function () {
          word.textContent = txt; gsap.fromTo(word, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .45, ease: 'expo.out' });
        } });
      } else word.textContent = txt;
    }
    if (!motion) {
      // gentle auto-cycle without scroll pinning
      var i = 0;
      setInterval(function () {
        scenes[i].classList.remove('is-on'); i = (i + 1) % scenes.length; scenes[i].classList.add('is-on');
        if (!reduce) setScene(i); else { cur = i; word.textContent = scenes[i].getAttribute('data-word'); dots.forEach(function (d, k) { d.classList.toggle('on', k === i); }); }
      }, 3200);
      return;
    }
    scenes.forEach(function (s, k) { s.classList.remove('is-on'); gsap.set(s, { clipPath: k === 0 ? 'circle(150% at 50% 60%)' : 'circle(0% at 50% 60%)' }); });
    gsap.set(scenes.map(function (s) { return s.querySelector('img'); }), { scale: 1.12 });

    var arch = $('.her__arch');
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.her', start: 'top top', end: '+=330%', scrub: 1, pin: '.her__stage', anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (self) {
          var t = self.progress * self.animation.duration();
          setScene(Math.max(0, Math.min(scenes.length - 1, Math.floor(t))));
        }
      }
    });
    $('.her')._pinST = tl.scrollTrigger;
    for (var k = 1; k < scenes.length; k++) {
      tl.to(scenes[k], { clipPath: 'circle(150% at 50% 60%)', duration: 1, ease: 'power2.inOut' }, k - .5)
        .to(scenes[k].querySelector('img'), { scale: 1, duration: 1.4, ease: 'none' }, k - .5)
        .to(scenes[k - 1].querySelector('img'), { scale: 1.06, duration: 1, ease: 'none' }, k - .5);
    }
    var endAt = scenes.length - .3;
    // the portrait grows beyond itself: her world becomes the whole screen
    tl.to('.her__copy', { opacity: 0, x: -60, duration: .8, ease: 'power2.in' }, endAt)
      .to('.her__ring, .her__dots, .her__scroll', { opacity: 0, duration: .4 }, endAt)
      .to(arch, {
        x: function () { var r = arch.getBoundingClientRect(); return window.innerWidth / 2 - (r.left + r.width / 2); },
        y: function () { var r = arch.getBoundingClientRect(); return window.innerHeight / 2 - (r.top + r.height / 2); },
        scale: function () { var r = arch.getBoundingClientRect(); return Math.max(window.innerWidth / r.width, window.innerHeight / r.height) * 1.02; },
        borderRadius: 0, duration: 1.6, ease: 'power2.inOut'
      }, endAt + .1)
      .to('.her__caption', { opacity: 0, duration: .4 }, endAt + .1)
      .to('.her__blob', { opacity: 0, duration: .8 }, endAt + .1)
      .to('.her__veil', { opacity: .55, duration: .8 }, endAt + .9)
      .fromTo('.her__final', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .8, ease: 'power2.out' }, endAt + 1.1)
      .to({}, { duration: .4 });
  }

  /* ---------------- manifesto word lighting ---------------- */
  function manifesto() {
    var el = $('#manifesto');
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    var spans = $$('.w', el);
    if (!motion) { spans.forEach(function (s) { s.classList.add('on'); }); return; }
    ScrollTrigger.create({
      trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: function (self) {
        var n = Math.round(self.progress * spans.length);
        spans.forEach(function (s, i) { s.classList.toggle('on', i < n); });
      }
    });
  }

  /* ---------------- counters ---------------- */
  function counters() {
    $$('[data-count]').forEach(function (el) {
      var end = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '';
      var fmt = function (v) { return Math.round(v).toLocaleString('en-GB') + suf; };
      if (!hasGsap) { el.textContent = fmt(end); return; }
      el.textContent = fmt(0);
      var o = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: function () { gsap.to(o, { v: end, duration: reduce ? 0 : 2.2, ease: 'expo.out', onUpdate: function () { el.textContent = fmt(o.v); } }); }
      });
    });
  }

  /* ---------------- 2. FROM A WORD TO A WORLD ---------------- */
  function words() {
    var arts = $$('.word');
    var lens = { LEARN: 990, EARN: 815, LIVE: 665 };
    var NS = 'http://www.w3.org/2000/svg';
    arts.forEach(function (art, i) {
      var label = art.querySelector('.word__fill').textContent.trim();
      var imgs = art.getAttribute('data-imgs').split(',');
      var id = 'wclip' + i;
      var images = imgs.map(function (src, k) {
        return '<image href="' + src + '" x="0" y="0" width="1000" height="236" preserveAspectRatio="xMidYMid slice" opacity="' + (k === 0 ? 1 : 0) + '"/>';
      }).join('');
      var t = '<text x="4" y="208" font-size="282" textLength="' + lens[label] + '" lengthAdjust="spacingAndGlyphs">' + label + '</text>';
      var svg = '<svg class="word__svg" viewBox="0 0 1000 236" role="img" aria-label="' + label + '" xmlns="' + NS + '">' +
        '<defs><clipPath id="' + id + '">' + t + '</clipPath></defs>' +
        '<g clip-path="url(#' + id + ')"><rect width="1000" height="236" fill="#681269" class="media"/><g class="media">' + images + '</g></g>' +
        t.replace('<text', '<text class="stroke"') + '</svg>';
      art.querySelector('.word__type').insertAdjacentHTML('beforeend', svg);
      art.querySelector('.word__type').classList.add('has-svg');
      art._imgs = $$('image', art);
      art._k = 0;
    });
    $('.words').classList.add('has-svg');

    // cinematic slideshow inside the active word's letters (Ken Burns crossfade)
    function cycle(art) {
      var imgs = art._imgs; if (!imgs || imgs.length < 2) return;
      var prev = imgs[art._k]; art._k = (art._k + 1) % imgs.length; var next = imgs[art._k];
      if (hasGsap && !reduce) {
        gsap.to(prev, { attr: { opacity: 0 }, duration: 1.1, ease: 'power1.inOut' });
        gsap.fromTo(next, { attr: { opacity: 0 }, scale: 1.18 }, { attr: { opacity: 1 }, scale: 1, duration: 3.6, ease: 'power1.out' });
      } else { prev.setAttribute('opacity', 0); next.setAttribute('opacity', 1); }
    }
    var active = -1, timer = null;
    function setActive(i) {
      if (i === active) return; active = i;
      arts.forEach(function (a, k) { a.classList.toggle('is-active', k === i); });
      clearInterval(timer);
      if (!reduce) timer = setInterval(function () { cycle(arts[active]); }, 2200);
    }

    if (!motion) { arts.forEach(function (a) { a.classList.add('is-active'); }); return; }

    var stage = $('#wordsStage');
    var st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: '+=210%', pin: true, anticipatePin: 1,
      onUpdate: function (self) { setActive(Math.min(2, Math.floor(self.progress * 3 * .999))); },
      onLeave: function () { clearInterval(timer); },
      onEnterBack: function () { var a = active; active = -1; setActive(a < 0 ? 2 : a); }
    });
    setActive(0);
    // each word breathes as you pass through it
    arts.forEach(function (a, i) {
      var drift = window.innerWidth < 700 ? 10 : 40;
      gsap.fromTo(a.querySelector('.word__type'), { x: i % 2 ? drift : -drift }, {
        x: i % 2 ? -drift : drift, ease: 'none',
        scrollTrigger: { trigger: stage, start: 'top top', end: '+=210%', scrub: true }
      });
      a.querySelector('.word__type').addEventListener('click', function () {
        scrollToY(st.start + (st.end - st.start) * ((i + .5) / 3));
      });
    });
    gsap.from('.words__head > *', { y: 40, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.words__head', start: 'top 80%' } });
  }

  /* ---------------- 3. THE BOOK OF POSSIBILITIES ---------------- */
  var bookGoToPage = function () {};
  function book() {
    var P = function (cls, inner) { return '<div class="pg ' + (cls || '') + '">' + inner + '</div>'; };
    var pages = [
      P('pg--cover', '<img src="img/logo_branco.png" alt=""><div><small>Ella Africa Foundation</small><div class="gold-rule"></div><h3>The Book of <em>Possibilities</em></h3></div><small>Learn · Earn · Live — Angola</small>'),
      P('pg--photo', '<img src="img/escola.webp" alt="A woman writing at a school desk" loading="lazy"><div class="cap"><small>Chapter I · Learn</small>It begins with a pencil, and the courage to hold it.</div>'),
      P('', '<span class="chap">Spelling with Ella</span><h4>Starting from <em>zero</em> — and that is enough.</h4><p>Free, locally delivered literacy classes. Reading, writing, signing her own name, supporting her children’s homework and accessing the services that are hers by right.</p><div class="mini"><div><b>82%</b><span>no formal education at entry</span></div><div><b>47</b><span>average age of learners</span></div></div><p class="q" style="margin-top:16px">“Learning has no age limit.” — Isabel</p>'),
      P('pg--photo', '<img src="img/tailoring1.webp" alt="A trainee at a sewing machine" loading="lazy"><div class="cap"><small>Chapter II · Earn</small>Her hands already knew how to create. Now they earn.</div>'),
      P('', '<span class="chap">Project Mwana</span><h4>A skill becomes <em>an income.</em></h4><p>Hands-on vocational training — tailoring, culinary arts, hairdressing and more — designed with the local market in mind, so a certificate turns into customers.</p><div class="mini"><div><b>16,300+</b><span>training hours delivered</span></div><div><b>86%</b><span>completion rate, 2025</span></div></div>'),
      P('pg--photo', '<img src="img/galeria24.webp" alt="Graduates modelling garments they made" loading="lazy"><div class="cap"><small>Graduation showcase · Luanda</small>Wearing what she made. Walking where she chose.</div>'),
      P('', '<span class="chap">Six pathways</span><h4>Choose <em>your craft.</em></h4><div class="paths">' +
        [['tailoring1', 'Tailoring'], ['hair1', 'Hairdressing'], ['culinaria1', 'Culinary arts'], ['maquiagem1', 'Makeup & beauty'], ['horta1', 'Horticulture'], ['decoracao', 'Event decoration']]
          .map(function (p) { return '<figure><img src="img/' + p[0] + '.webp" alt="" loading="lazy"><figcaption>' + p[1] + '</figcaption></figure>'; }).join('') + '</div>'),
      P('pg--photo', '<img src="img/saude.webp" alt="Women at a community health session" loading="lazy"><div class="cap"><small>Chapter III · Live</small>A woman cannot thrive without the care she deserves.</div>'),
      P('', '<span class="chap">Ella Health</span><h4>Health, <em>spoken aloud.</em></h4><p>Community-based health education delivered by local educators — including breast-cancer awareness inside a women’s prison and with a women’s shelter.</p><ul class="focus"><li>Women’s health &amp; wellbeing</li><li>Menstrual health education</li><li>Maternal care</li><li>Preventative health &amp; screenings</li><li>Community outreach &amp; access</li></ul>'),
      P('pg--photo', '<img src="img/galeria13.webp" alt="A graduating class celebrating with certificates" loading="lazy"><div class="cap"><small>Chapter IV · Rise</small>She learns. She earns. Her household — and her community — stabilise.</div>'),
      P('pg--end', '<span class="chap">Your chapter</span><h4>The next page is <em>yours to write.</em></h4><p>£100 funds one woman’s complete journey — from her first class to her graduation day.</p><div class="mini"><div><b>£0</b><span>cost to every participant</span></div><div><b>91p</b><span>of every £1 reaches Angola</span></div></div><button class="btn btn--glow" data-add="100" style="margin-top:22px">Fund a complete journey · £100</button>'),
      P('pg--cover', '<img src="img/logo_branco.png" alt=""><div><h3>Start with <em>her.</em></h3><div class="gold-rule"></div><small>Change everything.</small></div><small>Charity No. 1207725</small>')
    ];
    var chapters = [['Cover', 0], ['Learn', 1], ['Earn', 3], ['Pathways', 5], ['Live', 7], ['Your chapter', 9]];
    var bookEl = $('#book3d'), leavesEl = $('#leaves'), chapEl = $('#bookChapters');
    var single = false, leaves = [], state = 0, max = 0;

    function stateOf(p) { return single ? p : Math.ceil(p / 2); }
    function build() {
      single = window.innerWidth < 760;
      bookEl.classList.toggle('single', single);
      var html = '', n = single ? pages.length : pages.length / 2;
      for (var i = 0; i < n; i++) {
        var front = single ? pages[i] : pages[i * 2];
        var back = single ? '<div class="pg pg--blank"></div>' : pages[i * 2 + 1];
        var fn = single ? i + 1 : i * 2 + 1;
        html += '<div class="leaf" data-i="' + i + '"><div class="page page--front">' + front.replace(/<\/div>$/, '<span class="pnum">' + (fn > 1 && fn < pages.length ? fn - 1 : '') + '</span></div>') + '</div>' +
          '<div class="page page--back">' + back.replace(/<\/div>$/, single ? '</div>' : '<span class="pnum">' + (fn < pages.length - 1 ? fn : '') + '</span></div>') + '</div></div>';
      }
      leavesEl.innerHTML = html;
      leaves = $$('.leaf', leavesEl);
      max = single ? leaves.length - 1 : leaves.length;
      size();
      render(true);
      $$('[data-add]', leavesEl).forEach(bindAdd);
    }
    function size() {
      var vw = window.innerWidth, vh = window.innerHeight, pw, ph;
      if (single) { pw = Math.min(400, vw - 32); ph = Math.min(pw * 1.38, vh - 170); pw = Math.min(pw, ph / 1.2); }
      else { pw = Math.min(450, (Math.min(vw, 1320) - 120) / 2); ph = pw * 1.3; if (ph > vh - 200) { ph = Math.max(480, vh - 200); pw = ph / 1.3; } }
      bookEl.style.setProperty('--pw', Math.round(pw) + 'px');
      bookEl.style.setProperty('--ph', Math.round(ph) + 'px');
    }
    function render(instant) {
      state = Math.max(0, Math.min(max, state));
      leaves.forEach(function (lf, i) {
        var flipped = i < state;
        if (instant) lf.style.transition = 'none';
        lf.classList.toggle('flipped', flipped);
        lf.style.zIndex = flipped ? i + 1 : leaves.length - i + 10;
        if (instant) { void lf.offsetWidth; lf.style.transition = ''; }
      });
      if (!single) leavesEl.style.transform = state === 0 ? 'translateX(-25%)' : state === max ? 'translateX(25%)' : 'none';
      else leavesEl.style.transform = 'none';
      var activeIdx = 0;
      chapters.forEach(function (c, k) { if (stateOf(c[1]) <= state) activeIdx = k; });
      $$('button', chapEl).forEach(function (b, k) { b.setAttribute('aria-selected', k === activeIdx ? 'true' : 'false'); });
      $('#bookPrev').disabled = state === 0; $('#bookNext').disabled = state === max;
      $('#bookPrev').style.opacity = state === 0 ? .35 : 1; $('#bookNext').style.opacity = state === max ? .35 : 1;
    }
    function go(n) {
      var prev = state; state = Math.max(0, Math.min(max, n));
      if (state === prev) return;
      // the leaf in motion rides on top
      var moving = state > prev ? leaves[prev] : leaves[state];
      render(false);
      if (moving) { moving.style.zIndex = 200; setTimeout(function () { render(false); }, 650); }
    }
    bookGoToPage = function (p) { go(stateOf(p)); };
    chapEl.innerHTML = chapters.map(function (c) { return '<button role="tab" data-p="' + c[1] + '">' + c[0] + '</button>'; }).join('');
    $$('button', chapEl).forEach(function (b) { b.addEventListener('click', function () { bookGoToPage(+b.getAttribute('data-p')); }); });
    $('#bookPrev').addEventListener('click', function () { go(state - 1); });
    $('#bookNext').addEventListener('click', function () { go(state + 1); });
    leavesEl.addEventListener('click', function (e) {
      if (e.target.closest('button,a')) return;
      var lf = e.target.closest('.leaf'); if (!lf) return;
      var i = +lf.getAttribute('data-i');
      go(i < state ? state - 1 : state + 1);
    });
    var sx = null;
    bookEl.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    bookEl.addEventListener('pointerup', function (e) {
      if (sx === null) return; var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) go(state + (dx < 0 ? 1 : -1));
    });
    var inView = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { inView = en[0].isIntersecting; }, { threshold: .4 }).observe(bookEl);
    }
    document.addEventListener('keydown', function (e) {
      if (!inView || $('#basket').classList.contains('open')) return;
      if (e.key === 'ArrowRight') go(state + 1);
      if (e.key === 'ArrowLeft') go(state - 1);
    });
    var lastW = window.innerWidth;
    window.addEventListener('resize', function () {
      var nowSingle = window.innerWidth < 760;
      if (nowSingle !== single) { var p = single ? state : state * 2 - 1; state = 0; build(); state = Math.max(0, nowSingle ? p : Math.ceil(p / 2)); render(true); }
      else if (window.innerWidth !== lastW) size();
      lastW = window.innerWidth;
    });
    build();

    if (motion) {
      gsap.fromTo(bookEl, { rotateX: 32, y: 80, transformPerspective: 1800, transformOrigin: '50% 100%' },
        { rotateX: 0, y: 0, ease: 'none', scrollTrigger: { trigger: '.bookx', start: 'top 85%', end: 'top 15%', scrub: true } });
      gsap.from('.bookx__head > *', { y: 40, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.bookx__head', start: 'top 80%' } });
      ScrollTrigger.create({ trigger: bookEl, start: 'top 55%', once: true, onEnter: function () { setTimeout(function () { if (state === 0) go(1); }, 500); } });
    }
  }

  /* ---------------- 4. BREAKING THE FRAME ---------------- */
  function frames() {
    if (!motion) return;
    gsap.from('.frames__intro > *', { y: 50, opacity: 0, stagger: .12, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.frames__intro', start: 'top 80%' } });
    $$('[data-story]').forEach(function (s) {
      var tl = gsap.timeline({ scrollTrigger: { trigger: s, start: 'top 75%', end: 'center 45%', scrub: 1 } });
      tl.fromTo(s.querySelector('.story__img'), { clipPath: 'inset(10.94% 14.29% round 6px)' }, { clipPath: 'inset(0% 0% round 28px)', ease: 'power2.inOut' }, 0)
        .fromTo(s.querySelector('.story__img img'), { scale: 1.15 }, { scale: 1, ease: 'none' }, 0)
        .fromTo(s.querySelector('.story__border'), { scale: 1, opacity: 1 }, { scale: .9, opacity: .25, ease: 'none' }, 0)
        .from(s.querySelector('.story__before'), { opacity: 0, y: 30 }, 0)
        .from(s.querySelector('blockquote'), { opacity: 0, y: 50, ease: 'power2.out' }, .3)
        .from(s.querySelector('cite'), { opacity: 0 }, .6);
      gsap.to(s.querySelector('.story__frame'), { yPercent: -8, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.from('.ring', {
      scale: 0, opacity: 0, stagger: { each: .15, from: 'end' }, ease: 'power2.out',
      scrollTrigger: { trigger: '.ripple__rings', start: 'top 80%', end: 'center 50%', scrub: 1 }
    });
  }

  /* ---------------- 5. PORTRAITS WITHIN PORTRAITS ---------------- */
  var MOSAIC = {"thumbs":["t/galeria1.webp","t/galeria10.webp","t/galeria11.webp","t/galeria12.webp","t/galeria13.webp","t/galeria14.webp","t/galeria15.webp","t/galeria16.webp","t/galeria17.webp","t/galeria18.webp","t/galeria19.webp","t/galeria2.webp","t/galeria20.webp","t/galeria21.webp","t/galeria22.webp","t/galeria23.webp","t/galeria24.webp","t/galeria25.webp","t/galeria26.webp","t/galeria27.webp","t/galeria28.webp","t/galeria3.webp","t/galeria4.webp","t/galeria5.webp","t/galeria6.webp","t/galeria7.webp","t/galeria8.webp","t/galeria9.webp","t/escola.webp","t/make.webp","t/saude.webp","t/culinaria.webp","t/culinaria1.webp","t/decoracao.webp","t/hair1.webp","t/horta1.webp","t/maquiagem1.webp","t/tailoring1.webp","t/catarina1.webp","t/linda.webp","t/womanblur.webp"],"colors":["070012","070012","070012","070012","070012","070012","070012","070012","070012","070012","070012","150611","270e10","270e10","170711","070012","070012","070012","070012","070012","070012","070012","070012","070012","070012","070012","070012","070012","070012","070012","070012","070012","070012","35160e","823b09","be5905","eb6f01","ff7a00","ff7a00","ff7a00","ff7a00","f27301","c55d04","893f08","3b180e","070012","070012","070012","070012","070012","070012","070012","070012","070012","070012","070012","080012","59270c","ce6103","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","d16203","58270c","080012","070012","070012","070012","070012","070012","070012","070012","28100f","c05a04","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","be5905","240e10","070012","070012","070012","070012","070012","5b280c","f27301","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","f46f03","f4821c","f89534","fd8514","fe7d04","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ef7201","53240c","070012","3e2d47","070012","70330a","fe7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ef6a04","b24b18","a1593a","885940","e2d3b8","e5cbb3","efddcd","f4b775","ff891a","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","fd7900","773e1f","806586","5e290b","fe7900","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","e66705","af5531","8a371e","91634a","b78f6e","c8916d","cc8a65","bd653f","c68e6f","d59675","ee7f1c","ff7a00","ff7a00","ff7a00","ff7d03","ff7a00","ff7a00","fdae40","a8837b","f77501","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","d36d2c","9f5839","c2986e","cb9366","ae613e","b17856","c39779","c7a590","c18561","db9f74","d18858","ff7b02","ff7a00","ff7a00","ffba4b","ffa634","ff8c12","ffc55b","f9c05f","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ae5324","b3835f","cca276","cfad80","723d29","78331d","9a5134","d0ae9b","d4beb5","c49570","e0b48b","db914d","f09b48","ff7e03","ffc55b","ffc359","ffa631","ffc55b","ffc55c","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","93492e","b5825e","9a623b","63200a","611500","7a2805","b76c40","b07e62","c2ab9d","caa894","dca87c","d1a37f","dc9b57","ffb445","ffa32d","ffa02a","ffb647","ffc55c","ffc55c","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","fb7600","85422d","6e361e","702806","691f00","732402","7e2f0b","bb7249","dea581","c09474","aa927c","e0a57f","e0b595","f2c77c","ffc55c","ffc55c","ffb94b","ffa02a","ffc358","ffc55c","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","fa7400","54140b","6a2910","591d03","591901","752402","782d0b","a46440","b78464","f3d3b6","977154","9c5c40","dd8e49","fdc35b","ffc55c","ffc55c","ffc55c","ffc055","ffa634","ffc55c","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","80320e","521d0b","401100","3f0e00","6c1a00","4e1502","421301","824829","f2ddc2","e3ccae","955734","f1b558","ffc55c","ffc55c","ffc55c","ffc55c","ffc55c","ffa733","ffc359","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","b5500c","430f02","340c02","370a02","6f1d03","6e270e","2e0701","57220d","9c5936","f4d9b9","b46733","ffc258","ffc55c","ffc55c","ffc55c","ffc55c","ffc55c","ffbc4f","ffad3d","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","b34d06","611301","6b1602","530d00","721a05","af5e37","691d05","832805","cf8359","f0be94","e6964b","ffa02a","ffc45a","ffc55c","ffc55c","ffc55c","ffc55c","ffab39","ff8208","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","bc5309","782205","641402","4c0901","7b2209","964727","5d1a0b","781f06","c26033","d2804c","fabc5e","ffbd51","ffa02b","ffc054","ffc55c","ffc55c","ffc054","ff7c02","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","c35705","5f0b01","420400","6a1b01","661901","943d1a","ab582e","3a0600","802406","bb5c2a","fec35d","ffc55c","ffc358","ffa733","ffa631","ffb849","ffc45a","ff941d","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ec6d00","4c0500","330500","632512","985533","b06d44","8e522e","4f1a0c","641401","be6526","ffc55c","ffc55c","ffc55c","ffc55c","ffc358","ffb343","ff9821","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","a33a00","420700","691e05","8d351e","9d4629","c2673c","944823","691903","da9758","fdc25e","ffc65d","ffc55c","ffb342","ffa431","ffa531","ff9c25","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","ff7a00","f17000","af4500","631b00","450b00","611e03","722307","883111","ba6036","b05f33","9c4a22","dba279","8e3812","c67739","ecb05e","f7ad4d","ffc55d","ffc55c","ffad3b","ff7900","ff7a00","ff7a00","ff7a00","fc7200","b53f00","9d2602","9a6536","5f2a17","4b0500","470600","460b00","510f01","651903","741c04","762509","702306","a95830","eaaa7c","b55927","994921","c4a883","ab461d","ab4e24","e38a44","f79a38","ff7a00","ff7a00","ff7a00","f36400","8c1901","921907","800c01","704029","8b613e","4c0900","601300","470900","4f0d00","4d0900","590f00","691600","7e2702","a9552a","c97140","b24f1a","9a6546","a27c5a","bc3511","8f270d","94371a","e0874d","f5a256","ff8008","f17c1e","9e3925","9f3d2a","bb3e28","953c2a","9a4733","ab8c68","85523b","78341e","752f1b","702d19","833718","954219","964017","994319","ab5327","9f4213","a95220","c0a583","a27153","b84419","a2250a","8b2c13","a74d29","e4a36b","e9b285","613158","66335b","79496c","e3d5d2","ece4dc","f3efe6","f4f0e8","f3efe9","f4eee8","f4efe9","f5f2eb","f6f3ee","f6f3f0","f7f3f2","f7f4f2","f7f3f1","f6f2f0","f5f1ee","f7f5ef","c98a69","903011","a32a0b","b25223","863219","b9603e","f7e0cf","491240","5d2a54","d6c3c4","f2e9e1","fffcf1","fffef3","fffef6","fffff8","fffffa","fffffc","fffffd","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","f5f3f2","d99471","882910","9c260d","cd6e38","ad3214","936850","ddccb4","55214c","d2bec0","f2e7de","fff9ed","e2dad2","d8d0c8","cfc9c0","dedad0","cec8c2","d4d0ca","edebe8","d4d0cc","dddad6","e5e4e1","ffffff","ffffff","ffffff","ffffff","f5f3f1","e5d9c0","c67b58","dbad85","e2caa8","d2aa7f","a74825","d37d4f","d0bcc0","f1e7df","fff9ec","fff9ec","f1ebdf","ede7dc","ded8cf","e5e1d7","dedad2","e3dfd8","dfdcd6","e4e0db","efeeeb","efeeec","ffffff","ffffff","ffffff","ffffff","f4f1ef","ca9f87","c4a784","a67d5f","cb9976","a45334","791f0c","9a3d22","ebe1db","fff9ed","fff9ec","fff9ec","fff9ec","fffaee","f6f1e5","f8f6ea","f6f5ea","f5f4ec","f7f6ef","f6f4f0","fefefd","ffffff","ffffff","ffffff","ffffff","ffffff","f5f2f0","bd7a5b","b7572f","9c4122","a05b38","7e2b18","961803","ae451d","f1e7de","fff7eb","fff6ea","fff8eb","fff9ec","fffaed","fffaed","f4eee3","f1ede2","efede4","f3f2ea","fffffc","fffffe","ffffff","ffffff","ffffff","ffffff","ffffff","f5f2f0","cc825b","c56532","983c19","ad4f29","3e1a0f","731307","c34819","f0e4dc","fff5ea","fff5ea","fff5ea","fff6ea","fdf6ea","fff9ec","fffcf0","fffcf0","fffef2","fffff4","fffff7","fffffb","fffffe","fffffc","fffffe","fffffe","fffffc","f4f1ef","cb865f","bd6434","bb5225","c65a27","3c0200","701509","963619","ebded6","fcf1e5","fef3e7","fef3e7","f6ebe0","efe5d9","e9e1d4","f8f4e7","f8f5e9","f8f5e9","f8f7eb","f9f8ec","f8f7ef","f8f7f0","fdfdf7","fffffc","fcf3ed","fef8f1","f4f1ef","dec5a8","d29a6b","b76236","b04b21","460a03","881d08","b14b1f","e2d2cd","f2e5dd","f6eadf","ede1d6","e0d5c9","ded3c7","e0d6ca","e2d9cd","e1d9cc","e2d9cd","e5ddd2","eae5d8","eae6da","ede9de","f3efe6","fbf5eb","b56c61","903019","cb9e84","cea688","eadcc4","d6a479","bd5929","531b0e","b0815a","d1b38c"]};
  var CAPTIONS = {
    linda: ['Spelling with Ella · Luanda 2025', 'Linda ran a pharmacy, served in the armed forces and raised ten children. Now she can write her name: “Today I can read. I can speak up.”', 'img/linda.webp'],
    catarina1: ['Project Mwana · Tailoring 2025', 'Catarina graduated wearing the dress she made herself.', 'img/catarina1.webp'],
    womanblur: ['Spelling with Ella · Luanda 2025', 'Isabel V. Romeu graduated three months after her first class. “Learning has no age limit.”', 'img/womanblur.webp'],
    escola: ['Spelling with Ella', 'A first sentence, written slowly and proudly.'],
    galeria7: ['Spelling with Ella', 'Classmates side by side — learning at every age.'],
    galeria14: ['Spelling with Ella', 'Concentration in the literacy classroom.'],
    galeria17: ['Spelling with Ella', 'Practising letters, one line at a time.'],
    galeria18: ['Spelling with Ella', 'Trainers support every learner personally.'],
    galeria20: ['Spelling with Ella', 'Learning together in Luanda.'],
    galeria4: ['Spelling with Ella', 'A full classroom of women, starting from zero.'],
    tailoring1: ['Project Mwana · Tailoring', 'Cutting, pinning, stitching — a craft that becomes income.'],
    galeria3: ['Project Mwana · Tailoring', 'At the sewing machine.'],
    galeria10: ['Project Mwana · Tailoring', 'Pattern work in the workshop.'],
    galeria5: ['Project Mwana · Tailoring', 'Hand-finishing fabric together.'],
    galeria24: ['Project Mwana · Showcase', 'Graduates wearing garments they made.'],
    hair1: ['Project Mwana · Hairdressing', 'Learning a trade customers come back for.'],
    galeria16: ['Project Mwana · Hairdressing', 'Braiding practice in class.'],
    culinaria: ['Project Mwana · Culinary arts', 'Fresh ingredients, new skills.'],
    culinaria1: ['Project Mwana · Culinary arts', 'Ready for the kitchen.'],
    galeria1: ['Project Mwana · Culinary arts', 'The culinary class, all smiles.'],
    maquiagem1: ['Project Mwana · Makeup & beauty', 'Precision and artistry.'],
    make: ['Project Mwana · Makeup & beauty', 'Building a beauty business, one client at a time.'],
    galeria2: ['Project Mwana · Makeup & beauty', 'Practice session.'],
    galeria27: ['Project Mwana · Makeup & beauty', 'Learning from a professional.'],
    horta1: ['Project Mwana · Horticulture', 'Growing food — and a livelihood.'],
    galeria11: ['Project Mwana · Horticulture', 'Hands in the soil.'],
    galeria15: ['Project Mwana · Horticulture', 'In the community garden.'],
    decoracao: ['Project Mwana · Event decoration', 'Designing celebrations.'],
    saude: ['Ella Health', 'Community health education, led locally.'],
    galeria8: ['Ella Health', 'Listening, asking, learning.'],
    galeria19: ['Graduation day', 'Joy, shared.'],
    galeria9: ['Our community', 'Participants, trainers and team together.']
  };
  function caption(name) { return CAPTIONS[name] || ['Graduation day · Luanda 2025', 'Certificates in hand — a whole class rising together.']; }
  function mosaic() {
    var art = $('#mosaicArt');
    var thumbs = MOSAIC.thumbs;
    var featNames = ['t/linda.webp', 't/catarina1.webp', 't/womanblur.webp'];
    var common = thumbs.filter(function (t) { return featNames.indexOf(t) < 0; });
    var featSpots = { 30: 0, 140: 1, 262: 2, 395: 0, 470: 1, 601: 2, 699: 0, 788: 1, 545: 2 };
    var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var html = '';
    MOSAIC.colors.forEach(function (c, i) {
      var feat = featSpots[i] !== undefined;
      var t = feat ? featNames[featSpots[i]] : common[Math.floor(rnd() * common.length)];
      var name = t.replace('t/', '').replace('.webp', '');
      html += '<div class="tile' + (feat ? ' feat' : '') + '" data-n="' + name + '" style="background-image:url(img/' + t + ');--c:#' + c + ';--d:' + (rnd() * .9).toFixed(2) + 's"' +
        (feat ? ' role="button" tabindex="0" aria-label="Meet ' + (name === 'linda' ? 'Linda' : name === 'catarina1' ? 'Catarina' : 'Isabel') + '"' : '') + '></div>';
    });
    art.innerHTML = html;
    var card = $('#mosaicCard');
    function show(name) {
      var c = caption(name);
      $('#mcImg').src = c[2] || ('img/' + name + '.webp');
      $('#mcTag').textContent = c[0]; $('#mcText').textContent = c[1];
      card.classList.remove('pulse'); void card.offsetWidth; card.classList.add('pulse');
    }
    art.addEventListener('click', function (e) { var t = e.target.closest('.tile'); if (t) show(t.getAttribute('data-n')); });
    art.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('tile')) { e.preventDefault(); show(e.target.getAttribute('data-n')); } });
    var btns = $$('.toggle button');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.toggle('is-on', x === b); });
        art.style.setProperty('--mix', b.getAttribute('data-mix'));
      });
    });
    if (motion) {
      art.classList.add('anim');
      gsap.from($$('.tile', art), { opacity: 0, scale: .2, duration: .9, ease: 'back.out(2)', stagger: { amount: 1.6, from: 'random' }, clearProps: 'opacity,transform',
        scrollTrigger: { trigger: art, start: 'top 75%' }, onComplete: function () { art.classList.toggle('anim', false); } });
      gsap.from('.mosaic__copy > *', { y: 40, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.mosaic', start: 'top 70%' } });
    }
  }

  /* ---------------- impact + general reveals ---------------- */
  function reveals() {
    if (!motion) return;
    gsap.from('.stat', { y: 60, opacity: 0, stagger: .08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.stats', start: 'top 80%' } });
    gsap.from('.who__list li, .timeline li', { y: 30, opacity: 0, stagger: .06, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: '.who', start: 'top 80%' } });
    gsap.from('.impact__head > *', { y: 40, opacity: 0, stagger: .1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.impact__head', start: 'top 85%' } });
    gsap.from('.give, .way', { y: 50, opacity: 0, stagger: .1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.involve', start: 'top 75%' } });
    gsap.fromTo('.closing__img img', { scale: 1.2, yPercent: -6 }, { scale: 1, yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.closing__big', { y: 60, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.closing', start: 'top 70%' } });
  }

  /* ---------------- donate widget ---------------- */
  var GIFTS = {
    once: [[15, 'Materials for one woman'], [30, 'Two weeks of training'], [50, 'One month of support'], [100, 'One complete journey']],
    monthly: [[15, 'Weekly materials'], [25, 'Trains one woman'], [30, 'A session a month'], [50, 'Funds two women']]
  };
  var IMPACT = {
    'once15': '£15 provides learning materials for one woman.',
    'once30': '£30 funds two weeks of training.',
    'once50': '£50 funds one full month of a woman’s training.',
    'once100': '£100 funds one complete journey — first class to graduation.',
    'monthly15': '£15 a month provides her weekly materials.',
    'monthly25': '£25 a month trains one woman.',
    'monthly30': '£30 a month funds a session every month.',
    'monthly50': '£50 a month funds two women.'
  };
  var IMGS = { 15: 'img/t/escola.webp', 25: 'img/t/galeria17.webp', 30: 'img/t/tailoring1.webp', 50: 'img/t/galeria14.webp', 100: 'img/t/galeria28.webp' };
  var freq = 'once', amount = 50;
  function giveUI() {
    var wrap = $('#amounts');
    wrap.innerHTML = GIFTS[freq].map(function (g) {
      return '<button class="amt" role="radio" aria-checked="' + (g[0] === amount ? 'true' : 'false') + '" data-v="' + g[0] + '"><b>£' + g[0] + (freq === 'monthly' ? '<small style="font-size:.5em">/mo</small>' : '') + '</b><span>' + g[1] + '</span></button>';
    }).join('');
    $$('.amt', wrap).forEach(function (b) {
      b.addEventListener('click', function () { amount = +b.getAttribute('data-v'); $('#otherAmt').value = ''; giveUI(); });
    });
    var txt = IMPACT[freq + amount] || ('£' + amount + (freq === 'monthly' ? ' a month' : '') + ' keeps every programme free for the women who need it.');
    $('#giveImpact').textContent = txt;
    $('#addGift').textContent = 'Add £' + amount + (freq === 'monthly' ? '/month' : '') + ' to my impact basket';
  }
  $$('.freq button').forEach(function (b) {
    b.addEventListener('click', function () {
      freq = b.getAttribute('data-freq');
      $$('.freq button').forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      $('.freq').classList.toggle('monthly', freq === 'monthly');
      var vals = GIFTS[freq].map(function (g) { return g[0]; });
      if (vals.indexOf(amount) < 0 && !$('#otherAmt').value) amount = freq === 'monthly' ? 25 : 50;
      giveUI();
    });
  });
  $('#otherAmt').addEventListener('input', function (e) {
    var v = Math.floor(+e.target.value);
    if (v > 0) { amount = v; $$('.amt').forEach(function (b) { b.setAttribute('aria-checked', 'false'); });
      $('#giveImpact').textContent = IMPACT[freq + v] || ('£' + v + (freq === 'monthly' ? ' a month' : '') + ' keeps every programme free for the women who need it.');
      $('#addGift').textContent = 'Add £' + v + (freq === 'monthly' ? '/month' : '') + ' to my impact basket'; }
  });
  $('#addGift').addEventListener('click', function () { addItem(freq, amount); openBasket(); });

  /* ---------------- impact basket (side cart) ---------------- */
  var items = store.get('ella-basket') || [];
  var UPSELLS = [
    { f: 'once', a: 15, t: 'Learning kit', s: 'Materials for one woman', img: 'img/t/escola.webp' },
    { f: 'monthly', a: 25, t: 'Monthly', s: 'Trains one woman, every month', img: 'img/t/galeria17.webp', badge: 'Popular' },
    { f: 'once', a: 30, t: 'Workshop', s: 'Two weeks of vocational training', img: 'img/t/tailoring1.webp' },
    { f: 'once', a: 100, t: 'Full journey', s: 'First class to graduation', img: 'img/t/galeria28.webp', badge: 'Best value' },
    { f: 'once', a: 50, t: 'One month', s: 'A month of her training', img: 'img/t/galeria14.webp' }
  ];
  function label(f, a) {
    var g = GIFTS[f].filter(function (x) { return x[0] === a; })[0];
    return g ? g[1] : (f === 'monthly' ? 'Monthly gift' : 'A gift for her future');
  }
  function addItem(f, a, silent) {
    var id = f + a, ex = items.filter(function (i) { return i.id === id; })[0];
    if (ex) ex.q += 1; else items.push({ id: id, f: f, a: a, q: 1 });
    save(); renderBasket();
    var b = $('#basketOpen'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
    if (!silent) toast('£' + a + (f === 'monthly' ? '/month' : '') + ' added — ' + label(f, a).toLowerCase() + ' ✦');
  }
  function save() { store.set('ella-basket', items); }
  function totals() {
    var once = 0, monthly = 0;
    items.forEach(function (i) { if (i.f === 'once') once += i.a * i.q; else monthly += i.a * i.q; });
    return { once: once, monthly: monthly };
  }
  function renderBasket() {
    var basket = $('#basket');
    var T = totals(), count = items.reduce(function (s, i) { return s + i.q; }, 0);
    basket.classList.toggle('is-empty', !items.length);
    var cnt = $('#basketCount'); cnt.textContent = count; cnt.classList.toggle('has', count > 0);
    $('#basketItems').innerHTML = items.map(function (i) {
      return '<li class="bi" data-id="' + i.id + '"><img src="' + (IMGS[i.a] || 'img/t/galeria22.webp') + '" alt="">' +
        '<div><h5>' + label(i.f, i.a) + '</h5><small>' + (i.f === 'monthly' ? 'Monthly gift' : 'One-off gift') + '</small><br>' +
        '<span class="bi__qty"><button data-d="-1" aria-label="Decrease">−</button><span>' + i.q + '</span><button data-d="1" aria-label="Increase">+</button></span></div>' +
        '<div class="bi__right"><b>£' + (i.a * i.q) + (i.f === 'monthly' ? '<small>/mo</small>' : '') + '</b><button class="bi__rm">Remove</button></div></li>';
    }).join('');
    var parts = [];
    if (T.once) parts.push('£' + T.once.toLocaleString('en-GB'));
    if (T.monthly) parts.push('£' + T.monthly + '/mo');
    $('#basketTotal').textContent = parts.length ? parts.join(' + ') : '£0';
    var ga = $('#giftAid').checked;
    $('#basketGA').textContent = ga && (T.once || T.monthly) ? 'With Gift Aid, worth ' + [T.once ? '£' + (T.once * 1.25).toFixed(2).replace('.00', '') : '', T.monthly ? '£' + (T.monthly * 1.25).toFixed(2).replace('.00', '') + '/mo' : ''].filter(Boolean).join(' + ') + ' to Ella Africa' : '';
    // progress toward one complete journey (£100)
    var goal = 100, have = T.once + T.monthly * 4;
    var pct = Math.min(100, Math.round(have / goal * 100));
    $('#bpBar').style.width = pct + '%'; $('#bpPct').textContent = pct + '%';
    $('#bpText').textContent = pct >= 100 ? 'You’ve funded a complete journey — first class to graduation ✦' : 'Add £' + Math.max(0, goal - have) + ' to fund one complete journey';
    // smart upsells: suggest what isn't in the basket yet
    var ids = items.map(function (i) { return i.id; });
    var ups = UPSELLS.filter(function (u) { return ids.indexOf(u.f + u.a) < 0; });
    if (!T.monthly) ups.sort(function (a) { return a.f === 'monthly' ? -1 : 0; });
    ups = ups.slice(0, 3);
    $('#upsells').innerHTML = ups.map(function (u) {
      return '<button class="up" data-f="' + u.f + '" data-a="' + u.a + '" aria-label="Add £' + u.a + ' ' + u.s + '"><img src="' + u.img + '" alt="">' + (u.badge ? '<em class="badge">' + u.badge + '</em>' : '') + '<i>+</i><div><b>£' + u.a + (u.f === 'monthly' ? '/mo' : '') + '</b><span>' + u.s + '</span></div></button>';
    }).join('');
    $('.basket__upsell').style.display = ups.length ? '' : 'none';
    var url = 'https://ellaafrica.org/donate/index.php?lang=en';
    $('#checkout').href = url;
    $('#checkout').textContent = (T.once || T.monthly) ? 'Complete donation · ' + $('#basketTotal').textContent : 'Go to secure donation page';
  }
  $('#basketItems').addEventListener('click', function (e) {
    var li = e.target.closest('.bi'); if (!li) return;
    var it = items.filter(function (i) { return i.id === li.getAttribute('data-id'); })[0];
    if (e.target.matches('[data-d]')) { it.q += +e.target.getAttribute('data-d'); if (it.q < 1) items.splice(items.indexOf(it), 1); }
    else if (e.target.matches('.bi__rm')) items.splice(items.indexOf(it), 1);
    else return;
    save(); renderBasket();
  });
  $('#upsells').addEventListener('click', function (e) {
    var b = e.target.closest('.up'); if (!b) return;
    addItem(b.getAttribute('data-f'), +b.getAttribute('data-a'));
  });
  $('#giftAid').addEventListener('change', renderBasket);
  var lastFocus = null;
  function openBasket() {
    lastFocus = document.activeElement;
    $('#basket').classList.add('open'); $('#basket').setAttribute('aria-hidden', 'false');
    $('#scrim').classList.add('on');
    if (lenis) lenis.stop();
    setTimeout(function () { $('#basketClose').focus(); }, 300);
  }
  function closeBasket() {
    $('#basket').classList.remove('open'); $('#basket').setAttribute('aria-hidden', 'true');
    $('#scrim').classList.remove('on');
    if (lenis) lenis.start();
    if (lastFocus) lastFocus.focus();
  }
  $('#basketOpen').addEventListener('click', openBasket);
  $('#basketClose').addEventListener('click', closeBasket);
  $('#scrim').addEventListener('click', closeBasket);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if ($('#basket').classList.contains('open')) closeBasket(); if (mmenu.classList.contains('open')) closeMenu(); }
  });
  function bindAdd(el) {
    el.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); addItem('once', +el.getAttribute('data-add')); openBasket(); });
  }
  var tt;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 2600);
  }

  /* ---------------- boot ---------------- */
  manifesto();
  herWorld();
  words();
  book();
  frames();
  mosaic();
  counters();
  reveals();
  giveUI();
  renderBasket();
  $$('[data-add]').forEach(function (el) { if (!el.closest('#leaves')) bindAdd(el); });
  heroIntro();
  if (hasGsap) {
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
})();
