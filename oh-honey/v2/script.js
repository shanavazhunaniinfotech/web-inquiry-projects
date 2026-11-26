(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Reading progress, nav shadow, timeline fill
  var bar = document.getElementById('progress');
  var nav = document.getElementById('nav');
  var track = document.getElementById('track');
  var fill = document.getElementById('trackFill');
  var mobile = window.matchMedia('(max-width: 640px)');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    nav.classList.toggle('is-scrolled', h.scrollTop > 20);

    var r = track.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.3)));
    if (mobile.matches) { fill.style.height = p * 100 + '%'; fill.style.width = ''; }
    else { fill.style.width = p * 100 + '%'; fill.style.height = ''; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Reviews arrows
  var rail = document.getElementById('reviewsTrack');
  document.querySelectorAll('.arrow').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = rail.querySelector('.review');
      var step = card ? card.getBoundingClientRect().width + 18 : 300;
      rail.scrollBy({ left: step * Number(b.dataset.dir), behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  // Pack selector
  var options = document.querySelectorAll('.option');
  var btn = document.getElementById('checkoutBtn');
  var dockLabel = document.getElementById('dockLabel');
  var stack = document.querySelectorAll('#stack span');
  // positions for up to 6 bottles: [x offset %, y offset px, scale, z]
  var layouts = {
    1: [[0, 0, 1.15, 3]],
    3: [[-62, -6, .95, 1], [62, -6, .95, 1], [0, 0, 1.12, 3]],
    6: [[-95, -40, .8, 0], [0, -48, .8, 0], [95, -40, .8, 0], [-58, 0, .95, 2], [58, 0, .95, 2], [0, 10, 1.08, 4]]
  };
  function drawStack(n) {
    var l = layouts[n] || layouts[1];
    stack.forEach(function (s, i) {
      var pos = l[i];
      if (pos) {
        s.classList.add('on');
        s.style.transform = 'translate(calc(-50% + ' + pos[0] + '%), ' + pos[1] + 'px) scale(' + pos[2] + ')';
        s.style.zIndex = pos[3];
        s.style.transitionDelay = i * 50 + 'ms';
      } else {
        s.classList.remove('on');
        s.style.transform = 'translate(-50%, 30px) scale(.9)';
      }
    });
  }
  function select(o) {
    options.forEach(function (x) {
      var on = x === o;
      x.classList.toggle('is-active', on);
      x.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    var n = o.dataset.count, total = o.dataset.total, label = o.dataset.label;
    btn.textContent = 'Clear my chin · ' + (n === '1' ? '1 bottle · $' + total : label + ' for $' + total);
    dockLabel.textContent = label + ' · $' + total;
    drawStack(Number(n));
  }
  options.forEach(function (o) { o.addEventListener('click', function () { select(o); }); });
  select(document.querySelector('.option.is-active'));

  // Placeholder checkout: Funnelish checkout link goes here later
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    btn.textContent = 'Checkout connects to Funnelish next ✓';
    setTimeout(function () { select(document.querySelector('.option.is-active')); }, 1800);
  });

  // Mobile dock: show after hero, hide over the offer
  var dock = document.getElementById('dock');
  if (!('IntersectionObserver' in window)) return;
  var heroIn = true, offerIn = false;
  function upd() {
    var show = !heroIn && !offerIn;
    dock.classList.toggle('is-visible', show);
    dock.setAttribute('aria-hidden', show ? 'false' : 'true');
    dock.querySelector('a').tabIndex = show ? 0 : -1;
  }
  new IntersectionObserver(function (e) { heroIn = e[0].isIntersecting; upd(); }).observe(document.querySelector('.hero'));
  new IntersectionObserver(function (e) { offerIn = e[0].isIntersecting; upd(); }, { threshold: 0.15 }).observe(document.getElementById('offer'));
})();
