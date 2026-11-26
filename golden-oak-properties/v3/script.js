/* Golden Oak Properties — Version 3 "Rooted" */
(function () {
  'use strict';
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var root = document.documentElement;
  if (hasGsap && !reduce) root.classList.add('js');
  if (reduce) root.classList.add('reduce');
  if (!hasGsap) root.classList.add('no-js');

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var isDesk = function () { return window.matchMedia('(min-width: 901px)').matches; };
  var lenis = null;

  /* ============ DATA (listings as published on goldenoakproperties.com) ============ */
  var LIST = [
    { name: 'Six Senses Residences', area: 'Palm Jumeirah', price: 9400000, type: 'villa', status: 'offplan', dev: 'Select Group', img: '../img/palm.webp' },
    { name: 'Dubai Hills Vista', area: 'Dubai Hills', price: 27600000, type: 'villa', status: 'offplan', dev: '', img: '../img/hills-vista.webp' },
    { name: 'Davinci Tower', area: 'Dubai Water Canal', price: 5450000, type: 'apartment', status: 'offplan', dev: '', img: '../img/davinci.webp' },
    { name: 'Elie Saab at Arabian Ranches III', area: 'Arabian Ranches', price: 4650000, type: 'villa', status: 'offplan', dev: 'Emaar', img: '../img/elie-saab.webp' },
    { name: 'Cavalli Tower', area: 'Dubai Marina', price: 2939000, type: 'apartment', status: 'offplan', dev: 'DAMAC', img: '../img/marina-night.webp' },
    { name: 'Tilal Al Furjan', area: 'Al Furjan', price: 3500000, type: 'villa', status: 'offplan', dev: 'Nakheel', img: '../img/furjan.webp' },
    { name: 'Beach Mansion', area: 'Emaar Beachfront', price: 1922888, type: 'apartment', status: 'offplan', dev: 'Emaar', img: '../img/beachfront.webp' },
    { name: 'DAMAC Lagoons', area: 'DAMAC Lagoons', price: 1530000, type: 'villa', status: 'offplan', dev: 'DAMAC', img: '../img/lagoons.webp' },
    { name: 'W Residences', area: 'Downtown', price: 1666777, type: 'apartment', status: 'ready', dev: 'Dar Al Arkan', img: '../img/downtown.webp' },
    { name: 'Rosewater', area: 'Creek Beach', price: 1450000, type: 'apartment', status: 'offplan', dev: 'Emaar', img: '../img/creek.webp' },
    { name: 'Le Ciel, Port de La Mer', area: 'Jumeirah 1', price: 1700000, type: 'apartment', status: 'ready', dev: '', img: '../img/port-de-la-mer.webp' }
  ];
  var DISTRICTS = [
    { area: 'Palm Jumeirah', pick: 'Six Senses Residences' },
    { area: 'Downtown', pick: 'W Residences by Dar Al Arkan' },
    { area: 'Dubai Marina', pick: 'Cavalli Tower' },
    { area: 'Dubai Hills', pick: 'Dubai Hills Vista' },
    { area: 'Arabian Ranches', pick: 'Elie Saab at Arabian Ranches III' },
    { area: 'Creek Beach', pick: 'Rosewater, Creek Beach' }
  ];
  var aed = function (n) { return 'AED ' + n.toLocaleString('en-US'); };
  var filt = { type: '', status: '', budget: '', area: '' };

  /* ============ INTRO ============ */
  function runIntro(done) {
    var intro = $('#intro');
    var seen = false;
    try { seen = sessionStorage.getItem('go-intro') === '1'; sessionStorage.setItem('go-intro', '1'); } catch (e) {}
    if (!hasGsap || reduce) { root.classList.add('no-intro'); document.body.classList.remove('is-loading'); done(); return; }
    var tl = gsap.timeline({ onComplete: function () { intro.remove(); } });
    var speed = seen ? 2.2 : 1;
    tl.timeScale(speed);
    tl.to('.intro__mark .d1', { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
      .to('.intro__mark .d2', { strokeDashoffset: 0, duration: .5, ease: 'power2.out' }, '-=.25')
      .to('.intro__mark .d3', { strokeDashoffset: 0, duration: .6, ease: 'power2.out' }, '-=.1')
      .to('.intro__mark .crown circle', { scale: 1, duration: .7, stagger: { each: .05, from: 'center' }, ease: 'back.out(2)' }, '-=.6')
      .to('.intro__word span', { y: 0, duration: .9, ease: 'expo.out' }, '-=.3')
      .to('.intro__sub span', { y: 0, duration: .8, ease: 'expo.out' }, '-=.65')
      .to('.intro__in', { opacity: 0, y: -20, duration: .5, ease: 'power2.in' }, '+=.35')
      .add(function () { document.body.classList.remove('is-loading'); done(); })
      .to('.intro__panel--a', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=.05')
      .to('.intro__panel--b', { yPercent: 100, duration: 1.1, ease: 'expo.inOut' }, '<');
    intro.style.pointerEvents = 'auto';
    intro.addEventListener('click', function () { tl.timeScale(6); });
  }

  function heroIn() {
    if (!hasGsap || reduce) return;
    gsap.to('.hero__h .ln > span', { y: 0, duration: 1.3, stagger: .1, ease: 'expo.out', delay: .25 });
    gsap.from('.kicker, .hero__lead, .paths-pick, .hero__scroll', { opacity: 0, y: 24, duration: 1.1, stagger: .1, ease: 'expo.out', delay: .55 });
    if (isDesk()) gsap.from('#heroMedia', { '--t': '100vh', duration: 1.6, ease: 'expo.out', delay: .1 });
  }

  /* ============ HERO ============ */
  function initHero() {
    var slides = $$('.hero__slide'), cap = $('#heroCap span'), i = 0;
    var caps = ['Palm Jumeirah', 'Dubai Hills Estate', 'Downtown Dubai'];
    if (!reduce) setInterval(function () {
      slides[i].classList.remove('is-on');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-on');
      cap.textContent = caps[i];
    }, 6000);

    // path picker
    var MAP = {
      buy: ['Explore villas and apartments', '#collection', { type: '' }],
      invest: ['See how we advise investors', '#advisory'],
      offplan: ['View off-plan projects', '#collection', { status: 'offplan' }],
      sell: ['Request a free valuation', '#owners'],
      abroad: ['How buying from abroad works', '#abroad']
    };
    var go = $('#pickGo'), txt = $('#pickTxt');
    $$('#pick button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('#pick button').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        var m = MAP[b.dataset.p];
        go.setAttribute('href', m[1]);
        go.removeAttribute('data-status');
        if (m[2] && m[2].status) go.dataset.status = m[2].status;
        openPanel(b.dataset.p);
        if (hasGsap && !reduce) {
          gsap.to(txt, { y: -14, opacity: 0, duration: .25, ease: 'power2.in', onComplete: function () { txt.textContent = m[0]; gsap.fromTo(txt, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'expo.out' }); } });
        } else txt.textContent = m[0];
      });
    });

    if (!hasGsap || reduce) return;
    ScrollTrigger.matchMedia({
      '(min-width: 901px)': function () {
        var tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#hero', start: 'top top', end: '+=110%', pin: true, scrub: .8, refreshPriority: 2,
            onUpdate: function (s) { $('#hdr').classList.toggle('is-dark', s.progress > .55); }
          }
        });
        tl.to('#heroMedia', { '--t': '0vh', '--r': '0vw', '--b': '0vh', '--l': '0vw', '--rad': '0vw', '--shade': 1, ease: 'power2.inOut' }, 0)
          .to('.hero__copy', { opacity: 0, y: -60, ease: 'power2.out', duration: .22 }, 0)
          .to('.hero__scroll', { opacity: 0, duration: .2 }, 0)
          .fromTo('.hero__slide.is-on img, .hero__slide img', { scale: 1.02 }, { scale: 1.12, ease: 'none' }, 0);
        return function () { $('#hdr').classList.remove('is-dark'); };
      }
    });
  }

  /* ============ STATEMENT (word-by-word ink) ============ */
  function initStatement() {
    var el = $('#statement');
    function wrapWords(node) {
      $$(':scope > *', node).forEach(function (c) { wrapWords(c); });
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3 && n.textContent.trim()) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) frag.appendChild(document.createTextNode(w));
            else { var s = document.createElement('span'); s.className = 'w'; s.textContent = w; frag.appendChild(s); }
          });
          n.parentNode.replaceChild(frag, n);
        }
      });
    }
    wrapWords(el);
    var words = $$('.w', el);
    if (!hasGsap || reduce) { words.forEach(function (w) { w.classList.add('on'); }); return; }
    ScrollTrigger.create({
      trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: function (s) { var n = Math.round(s.progress * words.length); words.forEach(function (w, i) { w.classList.toggle('on', i < n); }); }
    });
  }

  /* ============ ACCORDION ============ */
  var panels;
  function openPanel(key) {
    panels.forEach(function (p) { p.classList.toggle('is-open', p.dataset.p === key); });
  }
  function initAcc() {
    panels = $$('.acc__p');
    var t;
    panels.forEach(function (p) {
      p.addEventListener('click', function (e) { if (!e.target.closest('a')) openPanel(p.dataset.p); });
      p.addEventListener('focus', function () { openPanel(p.dataset.p); });
      p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { if (!e.target.closest('a')) { e.preventDefault(); openPanel(p.dataset.p); } } });
      if (fine) {
        p.addEventListener('mouseenter', function () { clearTimeout(t); t = setTimeout(function () { openPanel(p.dataset.p); }, 140); });
        p.addEventListener('mouseleave', function () { clearTimeout(t); });
      }
    });
  }

  /* ============ COLLECTION ============ */
  var track = $('#track'), trackWrap = $('#trackWrap'), hTween = null, hST = null, slideSTs = [];
  function match(p) {
    if (filt.type && p.type !== filt.type) return false;
    if (filt.status && p.status !== filt.status) return false;
    if (filt.area && p.area !== filt.area) return false;
    if (filt.budget) { var r = filt.budget.split('-'); if (p.price < +r[0] || p.price > +r[1]) return false; }
    return true;
  }
  function renderSlides() {
    var items = LIST.map(function (p, i) { return { p: p, i: i }; }).filter(function (x) { return match(x.p); });
    var html = items.map(function (x, k) {
      var p = x.p, cls = k % 3 === 1 ? ' is-tall' : (k % 3 === 2 ? ' is-off' : '');
      return '<article class="slide' + cls + '" data-i="' + x.i + '" tabindex="0" aria-label="' + p.name + ', ' + p.area + '">' +
        '<div class="slide__img"><img src="' + p.img + '" alt="' + p.name + ', ' + p.area + '" loading="lazy">' +
        '<div class="slide__tags"><span class="tag ' + (p.status === 'offplan' ? 'tag--gold' : '') + '">' + (p.status === 'offplan' ? 'Off-plan' : 'Ready') + '</span><span class="tag">' + (p.type === 'villa' ? 'Villa' : 'Apartment') + '</span></div></div>' +
        '<div class="slide__info"><span class="slide__n">' + String(k + 1).padStart(2, '0') + '</span><h3>' + p.name + '</h3>' +
        '<p class="slide__loc">' + p.area + (p.dev ? ' · ' + p.dev : '') + '</p>' +
        '<p class="slide__price"><small>Listed from</small><b>' + aed(p.price) + '</b></p>' +
        '<button class="slide__cta" type="button">Request availability <svg><use href="#i-arrow"/></svg></button></div></article>';
    }).join('');
    html += '<article class="slide slide--end"><h3>Not seeing the right fit?</h3><p>Much of what we place is never advertised. Tell us your brief and we will shortlist current options.</p><a class="btn btn--gold" href="#consult">Share my brief <svg><use href="#i-arrow"/></svg></a></article>';
    if (!items.length) html = '<p class="empty-msg">No residences match this filter yet. <a href="#consult">Share your brief</a> and we will shortlist current options.</p>' + html;
    track.innerHTML = html;
    $('#colCount').textContent = '01 / ' + String(items.length).padStart(2, '0');
    $('#colCount').dataset.n = items.length;
    setupTrack();
  }
  function setProg(p) {
    var n = +$('#colCount').dataset.n || 1;
    var cur = Math.min(n, Math.max(1, Math.round(p * (n - 1)) + 1));
    $('#colCount').textContent = String(cur).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
    $('#colBar').style.transform = 'scaleX(' + p + ')';
  }
  function setupTrack() {
    if (hST) { hST.kill(); hST = null; }
    if (hTween) { hTween.kill(); hTween = null; }
    slideSTs.forEach(function (s) { s.kill(); }); slideSTs = [];
    gsap && hasGsap && gsap.set(track, { x: 0 });
    if (!hasGsap || reduce || !isDesk()) { setProg(0); return; }
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    hTween = gsap.to(track, { x: function () { return -dist(); }, ease: 'none' });
    hST = ScrollTrigger.create({
      animation: hTween, trigger: '#colPin', start: 'top top', end: function () { return '+=' + dist(); },
      pin: true, scrub: 1, refreshPriority: 1, invalidateOnRefresh: true, onUpdate: function (s) { setProg(s.progress); }
    });
    $$('.slide:not(.slide--end)', track).forEach(function (s) {
      var img = $('.slide__img img', s), box = $('.slide__img', s);
      var a = gsap.fromTo(img, { xPercent: -5 }, { xPercent: 5, ease: 'none', scrollTrigger: { containerAnimation: hTween, trigger: s, start: 'left right', end: 'right left', scrub: true } });
      var b = gsap.fromTo(box, { clipPath: 'inset(0% 0% 0% 22% round 18px)' }, { clipPath: 'inset(0% 0% 0% 0% round 18px)', ease: 'power2.out', scrollTrigger: { containerAnimation: hTween, trigger: s, start: 'left 100%', end: 'left 60%', scrub: true } });
      slideSTs.push(a.scrollTrigger, b.scrollTrigger, a, b);
    });
  }
  function initCollection() {
    renderSlides();
    $$('.finder .seg button').forEach(function (b) {
      b.addEventListener('click', function () { filt.type = b.dataset.type; syncFinder(); refilter(); });
    });
    $('#fStatus').addEventListener('change', function () { filt.status = this.value; refilter(); });
    $('#fBudget').addEventListener('change', function () { filt.budget = this.value; refilter(); });
    track.addEventListener('click', function (e) {
      var s = e.target.closest('.slide'); if (!s || s.classList.contains('slide--end') || e.target.closest('a')) return;
      openDrawer(+s.dataset.i);
    });
    track.addEventListener('keydown', function (e) { var s = e.target.closest('.slide'); if (s && e.key === 'Enter' && !s.classList.contains('slide--end')) openDrawer(+s.dataset.i); });
    trackWrap.addEventListener('scroll', function () {
      if (isDesk()) return;
      var max = trackWrap.scrollWidth - trackWrap.clientWidth; setProg(max > 0 ? trackWrap.scrollLeft / max : 0);
    }, { passive: true });
  }
  function syncFinder() {
    $$('.finder .seg button').forEach(function (x) { x.classList.toggle('is-on', x.dataset.type === filt.type); });
    $('#fStatus').value = filt.status; $('#fBudget').value = filt.budget;
    var chip = $('.area-chip');
    if (filt.area) {
      if (!chip) { chip = document.createElement('button'); chip.type = 'button'; chip.className = 'area-chip'; $('#finder').appendChild(chip); chip.addEventListener('click', function () { filt.area = ''; syncFinder(); refilter(); }); }
      chip.innerHTML = filt.area + ' <svg><use href="#i-close"/></svg>';
      chip.setAttribute('aria-label', 'Remove area filter ' + filt.area);
    } else if (chip) chip.remove();
  }
  function refilter() {
    renderSlides();
    if (hasGsap) {
      ScrollTrigger.refresh();
      if (!reduce) gsap.from($$('.slide', track), { opacity: 0, y: 30, duration: .8, stagger: .05, ease: 'expo.out' });
    }
  }

  /* ============ DRAWER ============ */
  var drawer = $('#drawer'), lastFocus;
  function openDrawer(i) {
    var p = LIST[i];
    $('#dImg').src = p.img; $('#dImg').alt = p.name;
    $('#dArea').textContent = p.area + ' · ' + (p.status === 'offplan' ? 'Off-plan' : 'Ready') + (p.dev ? ' · ' + p.dev : '');
    $('#dTitle').textContent = p.name;
    $('#dPrice').textContent = 'Listed from ' + aed(p.price) + '. We will confirm current availability and pricing.';
    $('#dForm').hidden = false; $('#dOk').hidden = true; $('#dForm').reset();
    lastFocus = document.activeElement;
    drawer.hidden = false; document.body.style.overflow = 'hidden'; if (lenis) lenis.stop();
    setTimeout(function () { $('#dForm input').focus(); }, 60);
  }
  function closeDrawer() {
    drawer.hidden = true; document.body.style.overflow = ''; if (lenis) lenis.start();
    if (lastFocus) lastFocus.focus();
  }
  function initDrawer() {
    $$('[data-close]', drawer).forEach(function (x) { x.addEventListener('click', closeDrawer); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (!drawer.hidden) closeDrawer(); else if (!$('#menu').hidden) toggleMenu(false); } });
    $('#dForm').addEventListener('submit', function (e) { e.preventDefault(); this.hidden = true; $('#dOk').hidden = false; });
  }

  /* ============ DISTRICTS ============ */
  function initDistricts() {
    var items = $$('#dlist li'), imgs = $$('.dstage__img'), cur = 0, timer, touched = false;
    function show(i) {
      if (i === cur) return;
      var prev = imgs[cur], next = imgs[i];
      items.forEach(function (li, j) { li.classList.toggle('is-on', j === i); });
      $('#dcardName').textContent = DISTRICTS[i].pick;
      $('#dcardLink').dataset.area = DISTRICTS[i].area;
      if (hasGsap && !reduce) {
        imgs.forEach(function (im) { if (im !== prev && im !== next) { im.classList.remove('is-on'); gsap.set(im, { zIndex: 1, clipPath: 'inset(100% 0% 0% 0%)' }); } });
        gsap.set(prev, { zIndex: 2 });
        gsap.fromTo(next, { zIndex: 3, clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut', onComplete: function () { prev.classList.remove('is-on'); gsap.set(prev, { clipPath: 'inset(100% 0% 0% 0%)', zIndex: 1 }); } });
        gsap.fromTo($('img', next), { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'expo.out' });
        gsap.fromTo('#dcard', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .7, delay: .35, ease: 'expo.out' });
        next.classList.add('is-on');
      } else { prev.classList.remove('is-on'); next.classList.add('is-on'); }
      cur = i;
    }
    $('#dcardLink').dataset.area = DISTRICTS[0].area;
    items.forEach(function (li, i) {
      var b = $('button', li);
      b.addEventListener('click', function () { touched = true; show(i); });
      if (fine) b.addEventListener('mouseenter', function () { touched = true; show(i); });
    });
    if (hasGsap && !reduce) {
      ScrollTrigger.create({
        trigger: '#districts', start: 'top 60%', end: 'bottom 30%',
        onToggle: function (s) { clearInterval(timer); if (s.isActive) timer = setInterval(function () { if (!touched) show((cur + 1) % items.length); }, 4200); }
      });
    }
  }

  /* ============ ADVISORY ============ */
  function initAdvisory() {
    var steps = $$('.step'), rings = $$('#rings circle'), lbl = $('#ringsLbl');
    function act(i) {
      steps.forEach(function (s, j) { s.classList.toggle('on', j === i); });
      rings.forEach(function (r, j) { r.classList.toggle('on', j <= i); });
      lbl.textContent = steps[i].dataset.l;
    }
    act(0);
    if (!hasGsap || reduce) { steps.forEach(function (s) { s.classList.add('on'); }); return; }
    steps.forEach(function (s, i) {
      ScrollTrigger.create({ trigger: s, start: 'top 60%', end: 'bottom 60%', onToggle: function (st) { if (st.isActive) act(i); } });
    });
    rings.forEach(function (r) { var len = 2 * Math.PI * +r.getAttribute('r'); r.style.strokeDasharray = len; r.style.strokeDashoffset = len; });
    gsap.to(rings, { strokeDashoffset: 0, duration: 1.6, stagger: .12, ease: 'power2.out', scrollTrigger: { trigger: '.rings', start: 'top 85%' } });
  }

  /* ============ FORMS ============ */
  function initForms() {
    $$('.vform .seg button').forEach(function (b) { b.addEventListener('click', function () { $$('.vform .seg button').forEach(function (x) { x.classList.toggle('is-on', x === b); }); }); });
    $('#vform').addEventListener('submit', function (e) { e.preventDefault(); $$('.fld, button[type=submit], .seg', this).forEach(function (x) { x.hidden = true; }); $('.ok', this).hidden = false; });

    var steps = $$('.cform__step'), i = 0;
    function show(n) {
      i = n; steps.forEach(function (s, j) { s.classList.toggle('is-on', j === i); });
      $('#cBack').hidden = i === 0; $('#cStep').textContent = '0' + (i + 1) + ' / 03';
    }
    $$('.opts').forEach(function (o) {
      o.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        $$('button', o).forEach(function (x) { x.classList.toggle('is-on', x === b); });
        setTimeout(function () { show(Math.min(i + 1, 2)); }, 280);
      });
    });
    $('#cBack').addEventListener('click', function () { show(Math.max(0, i - 1)); });
    $('#cform').addEventListener('submit', function (e) {
      e.preventDefault();
      var n = $('#cName').value.trim(), ph = $('#cPhone').value.replace(/\D/g, '');
      if (!n || ph.length < 7) { $('#cErr').hidden = false; return; }
      $('#cErr').hidden = true; steps.forEach(function (s) { s.classList.remove('is-on'); });
      $('#cNav').hidden = true; $('#cDoneName').textContent = n.split(' ')[0]; $('#cDone').hidden = false;
    });
    // preset goal from CTAs
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-goal]'); if (!a) return;
      var b = $('.opts[data-name="goal"] button[data-v="' + a.dataset.goal + '"]');
      if (b) { $$('.opts[data-name="goal"] button').forEach(function (x) { x.classList.toggle('is-on', x === b); }); show(1); }
    });
  }

  /* ============ MENU + NAV ============ */
  var menu = $('#menu'), menuBtn = $('#menuBtn');
  function toggleMenu(open) {
    menuBtn.setAttribute('aria-expanded', open); $('#menuLbl').textContent = open ? 'Close' : 'Menu';
    root.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false; if (lenis) lenis.stop(); document.body.style.overflow = 'hidden';
      if (hasGsap && !reduce) {
        gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .8, ease: 'expo.inOut' });
        gsap.fromTo('.menu__nav a', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .06, delay: .3, ease: 'expo.out' });
      }
      setMenuImg('collection');
    } else {
      document.body.style.overflow = ''; if (lenis) lenis.start();
      if (hasGsap && !reduce) gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: .6, ease: 'expo.inOut', onComplete: function () { menu.hidden = true; } });
      else menu.hidden = true;
    }
  }
  function setMenuImg(k) { $$('.menu__media img').forEach(function (im) { im.classList.toggle('is-on', im.dataset.k === k); }); }
  function scrollToEl(t) {
    if (!t) return;
    var y = t.getBoundingClientRect().top + window.pageYOffset - (t.id === 'collection' ? 0 : 70);
    if (t.id === 'top') y = 0;
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }
  function initNav() {
    menuBtn.addEventListener('click', function () { toggleMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    $$('.menu__nav a').forEach(function (a) { a.addEventListener('mouseenter', function () { setMenuImg(a.dataset.k); }); a.addEventListener('focus', function () { setMenuImg(a.dataset.k); }); });
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]'); if (!a) return;
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var t = document.getElementById(id.slice(1)); if (!t) return;
      e.preventDefault();
      var wasOpen = !menu.hidden;
      if (a.dataset.status !== undefined || a.dataset.type !== undefined || a.dataset.area !== undefined) {
        filt = { type: a.dataset.type || '', status: a.dataset.status || '', budget: '', area: a.dataset.area || '' };
        syncFinder(); refilter();
      }
      if (a.dataset.path) openPanel(a.dataset.path);
      if (wasOpen) toggleMenu(false);
      setTimeout(function () { scrollToEl(t); }, wasOpen ? 450 : 30);
    });
  }

  /* ============ MOTION ============ */
  function initMotion() {
    var hdr = $('#hdr'), abar = $('#abar');
    if (!hasGsap) { hdr.classList.add('is-solid'); abar.classList.add('is-on'); return; }
    ScrollTrigger.create({
      trigger: '.statement', start: 'top 70px',
      onEnter: function () { hdr.classList.add('is-solid'); abar.classList.add('is-on'); },
      onLeaveBack: function () { hdr.classList.remove('is-solid'); abar.classList.remove('is-on'); }
    });
    if (reduce) return;
    // headline line reveals
    $$('.h2').forEach(function (h) {
      var spans = $$('.ln > span', h);
      if (!spans.length) { gsap.from(h, { opacity: 0, y: 30, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 90%' } }); return; }
      gsap.to(spans, { y: 0, duration: 1.3, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
    });
    // generic reveals
    var groups = ['.statement__meta > div', '.fact', '.abroad__steps li', '.timeline li', '.dlist li', '.step', '.leader', '.devs__list li', '.ftr__grid > div', '.vform', '.cform'];
    groups.forEach(function (sel) {
      $$(sel).forEach(function (el) { el.classList.add('rv'); });
      ScrollTrigger.batch(sel, { start: 'top 90%', once: true, onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: .08, ease: 'expo.out' }); } });
    });
    $$('.lead:not(.hero__lead), .eyebrow, .disclaimer, .advisory__cta, .press, .head--center .lead').forEach(function (el) {
      if (el.closest('.hero') || el.closest('.acc')) return;
      gsap.from(el, { opacity: 0, y: 20, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
    });
    // accordion entrance
    gsap.from('.acc__p', { y: 80, opacity: 0, duration: 1.3, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.acc', start: 'top 85%' } });
    // leader portrait curtains
    $$('.curtain').forEach(function (c) {
      gsap.to(c, { scaleY: 0, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: c.parentNode, start: 'top 80%' } });
      var im = $('img', c.parentNode); if (im) gsap.from(im, { scale: 1.25, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: c.parentNode, start: 'top 80%' } });
    });
    // timeline line
    gsap.to('#timeline', { '--p': 1, ease: 'none', scrollTrigger: { trigger: '#timeline', start: 'top 85%', end: 'bottom 60%', scrub: true } });
    // parallax
    gsap.fromTo('.abroad__bg', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.abroad', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.owners__img img', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.owners__img', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.owners__img', { clipPath: 'inset(18% 18% 18% 18% round 24px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.owners__img', start: 'top 80%' } });
    gsap.from('.dstage', { clipPath: 'inset(30% 10% 0% 10% round 400px 400px 24px 24px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.dstage', start: 'top 85%' } });
    gsap.fromTo('.ftr__big', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.ftr', start: 'top 90%' } });

    // magnetic buttons + cursor (desktop)
    if (fine) {
      $$('.mag').forEach(function (b) {
        var qx = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' }), qy = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
        b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .25); qy((e.clientY - r.top - r.height / 2) * .35); });
        b.addEventListener('mouseleave', function () { qx(0); qy(0); });
      });
      var cur = $('#cursor'), cx = gsap.quickTo(cur, 'left', { duration: .35, ease: 'power3' }), cy = gsap.quickTo(cur, 'top', { duration: .35, ease: 'power3' });
      window.addEventListener('mousemove', function (e) { cx(e.clientX); cy(e.clientY); }, { passive: true });
      document.addEventListener('mouseover', function (e) {
        var s = e.target.closest('.slide:not(.slide--end)');
        var on = s && !e.target.closest('.slide__cta');
        cur.classList.toggle('is-on', !!on);
      });
    }
  }

  /* ============ BOOT ============ */
  function boot() {
    if (hasGsap) {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      if (window.Lenis && !reduce && fine) {
        lenis = new window.Lenis({ duration: 1.2, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
        gsap.ticker.lagSmoothing(0);
        lenis.stop();
      }
    }
    initAcc();
    initHero();
    initStatement();
    initCollection();
    initDrawer();
    initDistricts();
    initAdvisory();
    initForms();
    initNav();
    initMotion();
    runIntro(function () { if (lenis) lenis.start(); heroIn(); });
    if (hasGsap) {
      var deskNow = isDesk();
      window.addEventListener('resize', function () { if (isDesk() !== deskNow) { deskNow = isDesk(); setupTrack(); ScrollTrigger.refresh(); } });
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
