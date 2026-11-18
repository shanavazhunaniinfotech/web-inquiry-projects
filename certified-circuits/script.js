/* Certified Circuits — homepage interactions */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var pad = function (n) { return String(n).padStart(2, '0'); };

  /* ---------- Intro ---------- */
  var intro = $('.intro');
  document.body.classList.add('is-loading');
  function finishIntro() {
    if (!intro) return;
    intro.classList.add('done');
    document.body.classList.remove('is-loading');
    document.documentElement.classList.add('loaded');
    setTimeout(function () { intro.remove(); }, 1300);
  }
  var seen = false;
  try { seen = sessionStorage.getItem('cc-intro') === '1'; sessionStorage.setItem('cc-intro', '1'); } catch (e) {}
  if (reduce || seen || !intro) {
    if (intro) intro.style.transition = 'none';
    finishIntro();
  } else {
    var t0 = performance.now(), dur = 1100, cnt = $('.js-intro-count'), bar = $('.intro__bar span');
    (function tick(now) {
      var p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      cnt.textContent = String(Math.round(e * 100)).padStart(3, '0');
      bar.style.setProperty('--p', e);
      if (p < 1) requestAnimationFrame(tick); else setTimeout(finishIntro, 120);
    })(t0);
  }

  /* ---------- Split headings into words ---------- */
  $$('.split').forEach(function (el) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var i = document.createElement('span'); i.textContent = part;
            w.appendChild(i); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    $$('.w > span', el).forEach(function (s, i) { s.style.transitionDelay = (i * 0.05) + 's'; });
  });

  /* ---------- Manifesto words ---------- */
  var mtext = $('.js-words');
  if (mtext) {
    mtext.innerHTML = mtext.textContent.trim().split(/\s+/).map(function (w) { return '<span class="mw">' + w + '</span>'; }).join(' ');
  }

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        if (e.target.hasAttribute('data-count-wrap')) runCounters(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .split, .sessions__title, .js-compare, .next-session').forEach(function (el) { io.observe(el); });
  // clip-path hides the element itself from IntersectionObserver, so watch its parent instead
  var clipIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      $$(':scope > .clip-reveal', e.target).forEach(function (c, i) { setTimeout(function () { c.classList.add('in'); }, i * 140); });
      clipIO.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  $$('.clip-reveal').forEach(function (el) {
    if (el.classList.contains('hero__photo')) return; // revealed by intro
    clipIO.observe(el.parentElement);
  });

  /* ---------- Counters ---------- */
  var proof = $('.proof');
  if (proof) { proof.setAttribute('data-count-wrap', ''); io.observe(proof); }
  function runCounters(wrap) {
    $$('[data-count]', wrap).forEach(function (el, idx) {
      var to = +el.dataset.count, suf = el.dataset.suffix || '', t0 = null, d = 1600;
      if (reduce) { el.textContent = to + suf; return; }
      setTimeout(function () {
        requestAnimationFrame(function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / d, 1), e = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(to * e) + suf;
          if (p < 1) requestAnimationFrame(step);
        });
      }, idx * 120);
    });
  }

  /* ---------- Countdown to next drop (Wed & Sat) ---------- */
  function nextDrop(from) {
    for (var i = 1; i <= 7; i++) {
      var d = new Date(from); d.setDate(d.getDate() + i); d.setHours(0, 0, 0, 0);
      if (d.getDay() === 3 || d.getDay() === 6) return d;
    }
  }
  var cdEl = $('.js-countdown');
  function tickCountdown() {
    var now = new Date(), diff = Math.max(0, nextDrop(now) - now);
    var d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
    if (cdEl) cdEl.textContent = pad(d) + 'd ' + pad(h) + 'h ' + pad(m) + 'm ' + pad(s) + 's';
  }
  tickCountdown(); setInterval(tickCountdown, 1000);

  /* ---------- Next Saturday session ---------- */
  (function () {
    var now = new Date(), d = new Date(now);
    var add = (6 - now.getDay() + 7) % 7;
    if (add === 0 && now.getHours() >= 10) add = 7;
    d.setDate(now.getDate() + add);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var label = 'Sat ' + d.getDate() + ' ' + months[d.getMonth()];
    $$('.js-next-session').forEach(function (el) { el.textContent = label + ' · 10:00'; });
    $$('.js-next-date').forEach(function (el) { el.textContent = (add === 0 ? 'Today · ' : '') + label + ', 10:00am'; });
  })();

  /* ---------- Nav: hide on scroll, progress, active link ---------- */
  var nav = $('.nav'), prog = $('.progress span'), sticky = $('.sticky-cta'), lastY = 0;
  var navLinks = $$('.nav__links a');
  var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); });

  /* ---------- Mobile menu ---------- */
  var burger = $('.nav__burger'), menu = $('.menu');
  function toggleMenu(open) {
    burger.setAttribute('aria-expanded', open);
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { toggleMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });

  /* ---------- Path cards (expand) ---------- */
  var paths = $$('.path');
  paths.forEach(function (p) {
    var open = function () { paths.forEach(function (o) { o.classList.toggle('is-open', o === p); }); };
    p.addEventListener('mouseenter', function () { if (fine) open(); });
    p.addEventListener('click', function (e) { if (!p.classList.contains('is-open')) { e.preventDefault(); open(); } });
  });

  /* ---------- Editions tabs ---------- */
  var editions = [
    { t: 'Foundation', tag: 'Build control', d: 'Scaled movements and banded pull-ups. You learn the pacing and the standard without getting buried.', f: 'New to calisthenics or returning after time off.', m: [35, 15, 40] },
    { t: 'Standard', tag: 'Increase density', d: 'Strict reps and the full circuit as written. More volume, less rest, and a target time worth chasing.', f: 'You can do strict pull-ups and want a real test every week.', m: [68, 45, 70] },
    { t: 'Certified', tag: 'Own the full test', d: 'Full volume under load. Weighted vest or dip belt, against the clock, exactly how we run it live.', f: 'Advanced athletes chasing the top of the scoreboard.', m: [100, 92, 96] }
  ];
  var tabs = $$('.tabs button'), tabWrap = $('.tabs'), stack = $('.js-sheet-stack');
  function setEdition(i) {
    var e = editions[i];
    tabs.forEach(function (b, j) { b.setAttribute('aria-selected', j === i); });
    tabWrap.style.setProperty('--i', i);
    $('.js-ed-title').textContent = e.t;
    $('.js-ed-tag').textContent = e.tag;
    $('.js-ed-desc').textContent = e.d;
    $('.js-ed-for').textContent = e.f;
    $('.js-ed-label').textContent = 'EDITION: ' + e.t.toUpperCase();
    ['.js-m0', '.js-m1', '.js-m2'].forEach(function (s, k) { $(s).style.setProperty('--w', e.m[k] + '%'); });
    stack.classList.remove('pulse'); void stack.offsetWidth; stack.classList.add('pulse');
  }
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { setEdition(i); });
    b.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
        var n = (i + (ev.key === 'ArrowRight' ? 1 : 2)) % 3; tabs[n].focus(); setEdition(n);
      }
    });
  });
  setEdition(0);

  /* ---------- Club billing toggle ---------- */
  var bills = $$('.billing button');
  bills.forEach(function (b) {
    b.addEventListener('click', function () {
      var yearly = b.dataset.bill === 'y';
      bills.forEach(function (o) { o.classList.toggle('is-active', o === b); o.setAttribute('aria-checked', o === b); });
      animateNum($('.js-club-amt'), yearly ? 150 : 15);
      $('.js-club-per').innerHTML = yearly ? '/year<br><small>2 months free + welcome gift</small>' : '/month<br><small>cancel any time</small>';
      $('.js-cmp-a').textContent = yearly ? '£207.48/yr' : '£31.92/mo';
      $('.js-cmp-b').textContent = yearly ? '£150/yr' : '£15/mo';
      $('.js-cmp-bar').style.setProperty('--w', yearly ? '72%' : '47%');
    });
  });
  function animateNum(el, to) {
    var from = +el.textContent, t0 = null;
    if (reduce) { el.textContent = to; return; }
    requestAnimationFrame(function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 600, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    });
  }

  /* ---------- Scoreboard filters (visual) ---------- */
  $$('.board__filters button').forEach(function (b, _, all) {
    b.addEventListener('click', function () {
      all.forEach(function (o) { o.classList.toggle('is-active', o === b); });
      var rows = $$('.js-board tr');
      rows.forEach(function (r, i) { r.animate([{ opacity: 0, transform: 'translateX(-10px)' }, { opacity: 1, transform: 'none' }], { duration: 400, delay: i * 50, fill: 'backwards', easing: 'cubic-bezier(.2,.8,.2,1)' }); });
    });
  });

  /* ---------- Gear filter ---------- */
  $$('.gear__filters button').forEach(function (b, _, all) {
    b.addEventListener('click', function () {
      var f = b.dataset.filter;
      all.forEach(function (o) { o.classList.toggle('is-active', o === b); });
      $$('.product').forEach(function (p, i) {
        var show = f === 'all' || p.dataset.cat === f;
        p.classList.toggle('is-hidden', !show);
        if (show && !reduce) p.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: i * 40, fill: 'backwards', easing: 'cubic-bezier(.2,.8,.2,1)' });
      });
    });
  });

  /* ---------- Email capture (prototype) ---------- */
  $$('.js-capture').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('input', form);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        form.classList.remove('error'); void form.offsetWidth; form.classList.add('error'); input.focus(); return;
      }
      form.classList.remove('error'); form.classList.add('done');
    });
  });

  /* ---------- Horizontal drops (pinned on desktop) ---------- */
  var drops = $('.drops'), track = $('.js-drops-track'), dropBar = $('.js-drop-bar'), dropIdx = $('.js-drop-idx');
  var dropItems = $$('.drop', track).filter(function (d) { return !d.classList.contains('drop--all'); });
  var pinOn = false, maxX = 0;
  function setupPin() {
    var want = window.innerWidth > 900 && !reduce;
    track.style.transform = '';
    if (!want) { drops.classList.remove('is-pinned'); drops.style.removeProperty('--pin-h'); pinOn = false; return; }
    drops.classList.add('is-pinned');
    maxX = Math.max(0, track.scrollWidth - window.innerWidth);
    drops.style.setProperty('--pin-h', (window.innerHeight + maxX) + 'px');
    pinOn = true;
  }
  function updatePin() {
    var p;
    if (pinOn) {
      var r = drops.getBoundingClientRect();
      p = Math.min(Math.max(-r.top / (drops.offsetHeight - window.innerHeight || 1), 0), 1);
      track.style.transform = 'translate3d(' + (-p * maxX) + 'px,0,0)';
    } else {
      var vp = $('.drops__viewport');
      p = vp.scrollLeft / Math.max(1, vp.scrollWidth - vp.clientWidth);
    }
    dropBar.style.setProperty('--p', Math.max(p, 1 / dropItems.length));
    dropIdx.textContent = pad(Math.min(dropItems.length, Math.floor(p * (dropItems.length - 0.01)) + 1));
  }
  $('.drops__viewport').addEventListener('scroll', updatePin, { passive: true });

  /* ---------- Scroll loop ---------- */
  var ghost = $('.hero__ghost'), finalGhost = $('.final__ghost'), mbg = $('.manifesto__bg img');
  var howLine = $('.how__line'), howSteps = $$('.how__steps li'), howWrap = $('.js-how');
  var parallaxEls = $$('[data-speed]');
  var words = $$('.mw'), mWrap = $('.manifesto');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY, vh = window.innerHeight;
    // progress
    var h = document.documentElement.scrollHeight - vh;
    prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    // nav
    nav.classList.toggle('scrolled', y > 40);
    var menuOpen = menu.classList.contains('open');
    nav.classList.toggle('hide', !menuOpen && y > 400 && y > lastY + 4);
    if (y < lastY - 4) nav.classList.remove('hide');
    lastY = y;
    // sticky cta
    var heroB = $('.hero').getBoundingClientRect().bottom, finalT = $('.final').getBoundingClientRect().top;
    sticky.classList.toggle('show', heroB < 0 && finalT > vh);
    // active link
    var cur = -1;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < vh * 0.4) cur = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle('active', i === cur); });

    if (reduce) { updatePin(); return; }
    if (ghost) ghost.style.setProperty('--gx', (-y * 0.35) + 'px');
    if (finalGhost) { var fr = finalGhost.parentElement.getBoundingClientRect(); finalGhost.style.setProperty('--fx', (fr.top * 0.25) + 'px'); }
    if (mbg) { var mr = mWrap.getBoundingClientRect(); mbg.style.setProperty('--my', (mr.top * -0.12) + 'px'); }
    parallaxEls.forEach(function (el) {
      var r = el.getBoundingClientRect(), c = r.top + r.height / 2 - vh / 2;
      el.style.translate = '0 ' + (c * +el.dataset.speed) + 'px';
    });
    // how line
    if (howWrap) {
      var hr = howWrap.getBoundingClientRect();
      var hp = Math.min(Math.max((vh * 0.75 - hr.top) / (hr.height + vh * 0.2), 0), 1);
      howLine.style.setProperty('--s', hp);
      howSteps.forEach(function (li, i) { li.classList.toggle('lit', hp > i / howSteps.length + 0.05); });
    }
    // manifesto words
    if (words.length) {
      var tr = mtext.getBoundingClientRect();
      var wp = Math.min(Math.max((vh * 0.85 - tr.top) / (tr.height + vh * 0.35), 0), 1);
      var n = Math.round(wp * words.length);
      words.forEach(function (w, i) { w.classList.toggle('on', i < n); });
    }
    updatePin();
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); }
  }, { passive: true });
  window.addEventListener('resize', function () { setupPin(); onScroll(); });
  window.addEventListener('load', function () { setupPin(); onScroll(); });
  setupPin(); onScroll();
  if (reduce) words.forEach(function (w) { w.classList.add('on'); });

  /* ---------- Pointer effects (desktop only) ---------- */
  if (!fine || reduce) return;

  // Custom cursor
  var cursor = $('.cursor'), cLabel = $('.cursor__label'), cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; cursor.classList.add('on'); }, { passive: true });
  document.addEventListener('mouseleave', function () { cursor.classList.remove('on'); });
  (function loop() {
    cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
    cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', function (e) {
    var lab = e.target.closest('[data-cursor]');
    var hov = e.target.closest('a, button, summary, input');
    if (lab) { cLabel.textContent = lab.dataset.cursor; cursor.classList.add('label'); cursor.classList.remove('hover'); }
    else { cursor.classList.remove('label'); cursor.classList.toggle('hover', !!hov); }
  });

  // Magnetic buttons
  $$('.magnetic').forEach(function (b) {
    b.addEventListener('mousemove', function (e) {
      var r = b.getBoundingClientRect();
      b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.22) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.3) + 'px)';
    });
    b.addEventListener('mouseleave', function () { b.style.transform = ''; });
  });

  // Hero parallax
  var hv = $('[data-parallax-wrap]');
  var hero = $('.hero');
  hero.addEventListener('mousemove', function (e) {
    var r = hero.getBoundingClientRect();
    var nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
    $$('[data-depth]', hv).forEach(function (el) {
      var d = +el.dataset.depth;
      el.style.setProperty('--px', (nx * d) + 'px'); el.style.setProperty('--py', (ny * d) + 'px');
    });
  });

  // 3D tilt on drop cards
  $$('.drop:not(.drop--all)').forEach(function (c) {
    c.addEventListener('mousemove', function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-6px)';
    });
    c.addEventListener('mouseleave', function () { c.style.transform = ''; });
  });

  // Final sheet tilt
  var fs = $('.final__sheet img');
  if (fs) {
    $('.final').addEventListener('mousemove', function (e) {
      var nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
      fs.style.setProperty('--ry', (nx * 24 - 6) + 'deg'); fs.style.setProperty('--rx', (-ny * 16) + 'deg');
    });
  }
})();
