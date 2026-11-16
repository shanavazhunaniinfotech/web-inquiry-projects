/* Certified Circuits — Store V2 interactions */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var gbp = function (n) { return '£' + n.toFixed(2); };
  var I = function (n) { return 'images/' + n + '.webp'; };
  var STORE = 'https://www.certifiedcircuits.co.uk/products/';

  /* ---------- Product catalogue (from the live store) ---------- */
  var SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
  var P = {
    'box-tee': { name: 'Oversized Box T-Shirt', cat: 'apparel', price: 44, sizes: SIZES, badge: 'Bestseller',
      variants: { black: [I('tee-box-front'), I('tee-box-back')], white: [I('tee-white'), I('tee-white-back')] }, url: STORE + 'certified-circuits-oversized-box-t-shirt' },
    'classic-tee': { name: 'Classic Training Tee', cat: 'apparel', price: 25, sizes: SIZES,
      variants: { black: [I('tee-classic'), I('tee-classic-back')] }, url: STORE + 'certified-circuits-training-t-shirt' },
    'vest': { name: 'Training Vest', cat: 'apparel', price: 25, sizes: SIZES,
      variants: { black: [I('vest-black'), I('vest-black-back')], white: [I('vest-white'), I('vest-white-back')] }, url: STORE + 'certified-circuits-training-vests' },
    'shorts': { name: 'Training Shorts', cat: 'apparel', price: 30, sizes: SIZES,
      variants: { black: [I('shorts')] }, url: STORE + 'certified-circuits-training-shorts' },
    'beanie': { name: 'Cuffed Beanie', cat: 'apparel', price: 15, badge: 'New',
      variants: { black: [I('beanie-product'), I('beanie-studio')] }, url: STORE + 'certified-circuits-cuffed-beanie-black' },
    'cap': { name: 'Certified Cap', cat: 'apparel', price: 30,
      variants: { black: [I('cap-alt'), I('cap')] }, url: STORE + 'certified-circuits-cap' },
    'bands': { name: 'Resistance Bands Set', cat: 'equipment', price: 30, badge: 'Bestseller',
      variants: { set: [I('bands-alt'), I('bands-bag')] }, url: STORE + 'resistance-bands-set-light-medium-heavy' },
    'chalk-250': { name: 'Liquid Chalk 250ml', cat: 'equipment', price: 13.99, contain: true,
      variants: { std: [I('chalk'), I('chalk-bundle')] }, url: STORE + 'certified-circuits-liquid-chalk-250ml' },
    'chalk-50': { name: 'Liquid Chalk 50ml', cat: 'equipment', price: 7.69, contain: true,
      variants: { std: [I('chalk-50')] }, url: STORE + 'certified-circuits-liquid-chalk-50ml' },
    'holdall': { name: 'Hardbase Holdall', cat: 'equipment', price: 35, contain: true,
      variants: { std: [I('holdall')] }, url: STORE + 'certified-circuits-hardbase-holdall' },
    'duffle': { name: 'Duffle Bag', cat: 'equipment', price: 44,
      variants: { std: [I('duffle-product'), I('duffle')] }, url: STORE + 'certified-circuits-duffle-bag' },
    'c005': { name: 'Circuit #005 — Pull, Pump & Pause', short: 'Circuit #005', cat: 'circuits', price: 3.99, was: 5.99, badge: 'New drop', poster: true,
      variants: { pdf: [I('circuit-005')] }, url: STORE + 'circuit-005-pull-pump-pause' },
    'bundle': { name: '4-Week Engine Bundle (#001–#004)', short: '4-Week Bundle', cat: 'circuits', price: 11.99, was: 17.96, badge: 'Save £5.97', poster: true,
      variants: { pdf: [I('circuit-001'), I('circuit-002')] }, url: STORE + 'the-4-week-engine-bundle-circuits-001-to-004' },
    'c004': { name: 'Circuit #004 — Beat The Clock', short: 'Circuit #004', cat: 'circuits', price: 3.99, poster: true,
      variants: { pdf: [I('circuit-004')] }, url: STORE + 'beat-the-clock-0004' },
    'c003': { name: 'Circuit #003 — Earn the Descent', short: 'Circuit #003', cat: 'circuits', price: 3.99, poster: true,
      variants: { pdf: [I('circuit-003')] }, url: STORE + 'circuit-0003-earn-the-descent' },
    'c002': { name: 'Circuit #002 — Pull, Push and Pursue', short: 'Circuit #002', cat: 'circuits', price: 0, badge: 'Free', poster: true,
      variants: { pdf: [I('circuit-002')] }, url: STORE + 'circuit-0002-pull-push-and-pursue' },
    'c001': { name: 'Circuit #001 — Pull, Press and Endure (Gym)', short: 'Circuit #001', cat: 'circuits', price: 5.99, poster: true,
      variants: { pdf: [I('circuit-001')] }, url: STORE + 'circuit-001-gym-pull-press-and-endure-26-september-2026' }
  };
  var SW = { black: '#111', white: '#f4f4f4' };
  Object.keys(P).forEach(function (k) { P[k].id = k; });
  var first = function (p) { return Object.keys(p.variants)[0]; };

  /* ---------- Loader ---------- */
  var loader = $('.loader');
  $$('.loader__word span').forEach(function (s, i) { s.style.setProperty('--i', i); });
  function ready() {
    document.documentElement.classList.add('ready');
    if (loader) { loader.classList.add('done'); setTimeout(function () { loader.remove(); }, 1300); }
  }
  var seen = false;
  try { seen = sessionStorage.getItem('cc2-intro') === '1'; sessionStorage.setItem('cc2-intro', '1'); } catch (e) {}
  if (reduce || seen) { if (loader) loader.style.transition = 'none'; ready(); } else setTimeout(ready, 950);

  /* ---------- Split text ---------- */
  $$('.split').forEach(function (el) {
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var f = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { f.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var s = document.createElement('span'); s.textContent = part; w.appendChild(s); f.appendChild(w);
          });
          node.replaceChild(f, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
    $$('.w > span', el).forEach(function (s, i) { s.style.transitionDelay = (i * 0.045) + 's'; });
  });
  var big = $('.footer__big');
  if (big) big.innerHTML = big.textContent.split('').map(function (c, i) { return '<span class="ch" style="--i:' + i + '">' + c + '</span>'; }).join('');

  /* ---------- Reveal ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      if (e.target.classList.contains('stats')) counters(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });
  $$('.reveal, .split, .stats, .footer__big').forEach(function (el) { io.observe(el); });
  // clip-path hides an element from IntersectionObserver, so watch the parent
  var mio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      $$(':scope > .mask-reveal', e.target).forEach(function (m, i) { setTimeout(function () { m.classList.add('in'); }, i * 160); });
      mio.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  var seenParents = [];
  $$('.mask-reveal').forEach(function (m) {
    if (m.classList.contains('tile--main')) return;
    if (seenParents.indexOf(m.parentElement) < 0) { seenParents.push(m.parentElement); mio.observe(m.parentElement); }
  });

  function counters(wrap) {
    $$('[data-count]', wrap).forEach(function (el, k) {
      var to = +el.dataset.count, suf = el.dataset.suffix || '', t0;
      if (reduce) { el.textContent = to + suf; return; }
      setTimeout(function () {
        requestAnimationFrame(function st(ts) {
          t0 = t0 || ts; var p = Math.min((ts - t0) / 1500, 1);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))) + suf;
          if (p < 1) requestAnimationFrame(st);
        });
      }, k * 120);
    });
  }

  /* ---------- Announcement rotation ---------- */
  var slides = $$('.announce p'), si = 0;
  if (!reduce) setInterval(function () {
    var cur = slides[si]; cur.classList.remove('is-active'); cur.classList.add('is-out');
    setTimeout(function () { cur.classList.remove('is-out'); }, 700);
    si = (si + 1) % slides.length; slides[si].classList.add('is-active');
  }, 4800);

  /* ---------- Countdown (drop-day price ends at the next Wed/Sat midnight) ---------- */
  function nextDrop(now) {
    for (var i = 1; i <= 7; i++) {
      var d = new Date(now); d.setDate(d.getDate() + i); d.setHours(0, 0, 0, 0);
      if (d.getDay() === 3 || d.getDay() === 6) return d;
    }
  }
  var tEls = ['.js-t-d', '.js-t-h', '.js-t-m', '.js-t-s'].map(function (s) { return $(s); });
  function tick() {
    var now = new Date(), diff = Math.max(0, nextDrop(now) - now);
    var v = [Math.floor(diff / 864e5), Math.floor(diff / 36e5) % 24, Math.floor(diff / 6e4) % 60, Math.floor(diff / 1e3) % 60].map(pad);
    tEls.forEach(function (el, i) {
      if (el.textContent !== v[i]) { el.textContent = v[i]; el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
    });
    var hrs = Math.floor(diff / 36e5);
    $$('.js-countdown').forEach(function (el) { el.textContent = pad(hrs) + ':' + v[2] + ':' + v[3]; });
  }
  tick(); setInterval(tick, 1000);

  (function () {
    var now = new Date(), d = new Date(now), add = (6 - now.getDay() + 7) % 7;
    if (add === 0 && now.getHours() >= 10) add = 7;
    d.setDate(now.getDate() + add);
    var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $$('.js-next-sat').forEach(function (el) { el.textContent = 'Sat ' + d.getDate() + ' ' + m[d.getMonth()] + ', 10:00'; });
  })();

  /* ---------- Overlays ---------- */
  var scrim = $('.js-scrim'), cartEl = $('.cart'), qv = $('.qv'), search = $('.search'), exitEl = $('.exit'), mnav = $('.mnav'), burger = $('.header__burger');
  var openEl = null;
  function open(el) {
    close(); openEl = el; el.classList.add('open'); el.setAttribute('aria-hidden', 'false');
    scrim.classList.add('on'); document.body.classList.add('lock');
    var f = $('input, button', el); if (f && el !== cartEl) setTimeout(function () { f.focus(); }, 300);
  }
  function close() {
    [cartEl, qv, search, exitEl].forEach(function (el) { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); });
    scrim.classList.remove('on'); document.body.classList.remove('lock'); openEl = null;
  }
  scrim.addEventListener('click', close);
  $$('.js-close').forEach(function (b) { b.addEventListener('click', close); });
  $$('.js-close-link').forEach(function (b) { b.addEventListener('click', close); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); toggleMenu(false); } });
  $$('.js-open-cart').forEach(function (b) { b.addEventListener('click', function () { hideToast(); open(cartEl); }); });
  $$('.js-open-search').forEach(function (b) { b.addEventListener('click', function () { open(search); renderSearch(''); }); });

  function toggleMenu(on) {
    burger.setAttribute('aria-expanded', on); mnav.classList.toggle('open', on); mnav.setAttribute('aria-hidden', !on);
    document.body.classList.toggle('lock', on);
  }
  burger.addEventListener('click', function () { toggleMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('.mnav a').forEach(function (a) { a.addEventListener('click', function () { toggleMenu(false); }); });

  /* ---------- Cart ---------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem('cc2-cart') || '[]').filter(function (l) { return P[l.id]; }); } catch (e) { cart = []; }
  function save() { try { localStorage.setItem('cc2-cart', JSON.stringify(cart)); } catch (e) {} }
  function addToCart(id, opts, silent) {
    var p = P[id]; opts = opts || {};
    var variant = opts.variant || first(p), size = opts.size || (p.sizes ? 'M' : '');
    var key = id + '|' + variant + '|' + size;
    var line = cart.filter(function (l) { return l.key === key; })[0];
    if (line) line.qty++; else cart.push({ key: key, id: id, variant: variant, size: size, qty: 1 });
    save(); renderCart();
    $$('.js-cart-count').forEach(function (c) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); });
    if (!silent) toast(p, variant);
  }
  function renderCart() {
    var list = $('.js-cart-items'), n = 0, sub = 0;
    list.innerHTML = cart.map(function (l, i) {
      var p = P[l.id]; n += l.qty; sub += p.price * l.qty;
      var vlab = [l.variant !== 'std' && l.variant !== 'pdf' && l.variant !== 'set' ? cap(l.variant) : '', l.size ? 'Size ' + l.size : ''].filter(Boolean).join(' · ') || (p.cat === 'circuits' ? 'Instant PDF · 3 editions' : 'One size');
      return '<li><img src="' + p.variants[l.variant][0] + '" alt=""><div><h4>' + p.name + '</h4><span class="v">' + vlab + '</span><div class="qty"><button data-q="-1" data-i="' + i + '" aria-label="Decrease">−</button><span>' + l.qty + '</span><button data-q="1" data-i="' + i + '" aria-label="Increase">+</button></div></div><div class="r"><strong>' + gbp(p.price * l.qty) + '</strong><button class="rm" data-rm="' + i + '">Remove</button></div></li>';
    }).join('');
    $$('.js-cart-count').forEach(function (c) { c.textContent = n; });
    $('.js-cart-count-2').textContent = '(' + n + ')';
    $('.js-cart-sub').textContent = gbp(sub);
    $('.js-club-save').textContent = gbp(sub * 0.1);
    cartEl.classList.toggle('is-empty', n === 0);
    // upsells: items not in cart
    var inCart = cart.map(function (l) { return l.id; });
    var ups = ['bands', 'chalk-250', 'shorts', 'beanie', 'bundle', 'c005'].filter(function (k) { return inCart.indexOf(k) < 0; }).slice(0, 3);
    $('.js-cart-up-list').innerHTML = ups.map(function (k) { var p = P[k]; return '<button class="up" data-up="' + k + '"><img src="' + p.variants[first(p)][0] + '" alt="">' + (p.short || p.name) + ' · ' + gbp(p.price) + ' <i>+</i></button>'; }).join('');
    $('.js-cart-up').style.display = ups.length ? '' : 'none';
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  $('.js-cart-items').addEventListener('click', function (e) {
    var q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    if (q) { var l = cart[+q.dataset.i]; l.qty += +q.dataset.q; if (l.qty < 1) cart.splice(+q.dataset.i, 1); }
    if (rm) cart.splice(+rm.dataset.rm, 1);
    if (q || rm) { save(); renderCart(); }
  });
  $('.js-cart-up-list').addEventListener('click', function (e) { var b = e.target.closest('[data-up]'); if (b) addToCart(b.dataset.up, null, true); });
  renderCart();

  var toastEl = $('.toast'), toastT;
  function toast(p, v) {
    $('.js-toast-img').src = p.variants[v][0];
    $('.js-toast-name').textContent = p.short || p.name;
    toastEl.classList.add('show'); clearTimeout(toastT);
    toastT = setTimeout(hideToast, 3200);
  }
  function hideToast() { toastEl.classList.remove('show'); }

  /* generic add buttons */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.js-add');
    if (!b) return;
    e.preventDefault();
    var opts = {};
    if (b.dataset.product === 'c005') opts.variant = 'pdf';
    addToCart(b.dataset.product, opts);
    flyFrom(b);
  });
  function flyFrom(el) {
    if (reduce) return;
    var target = $('.cart-btn').getBoundingClientRect(), r = el.getBoundingClientRect();
    var dot = document.createElement('span');
    dot.style.cssText = 'position:fixed;z-index:400;width:16px;height:16px;border-radius:50%;background:#58d3ff;pointer-events:none;left:' + (r.left + r.width / 2 - 8) + 'px;top:' + (r.top + r.height / 2 - 8) + 'px';
    document.body.appendChild(dot);
    dot.animate([{ transform: 'translate(0,0) scale(1)' }, { transform: 'translate(' + (target.left + 14 - r.left - r.width / 2) + 'px,' + (target.top + 14 - r.top - r.height / 2) + 'px) scale(.4)', opacity: .6 }], { duration: 700, easing: 'cubic-bezier(.6,0,.2,1)' }).onfinish = function () { dot.remove(); };
  }

  /* ---------- Product cards / rail ---------- */
  var rail = $('.js-rail'), curTab = 'apparel';
  function cardHTML(p, i) {
    var v = first(p), imgs = p.variants[v];
    var cls = 'card' + (p.contain ? ' card--contain' : '') + (p.poster ? ' card--poster' : '');
    var sw = Object.keys(p.variants).length > 1 ? '<div class="swatches">' + Object.keys(p.variants).map(function (k, j) { return '<button class="' + (j === 0 ? 'on' : '') + '" data-sw="' + k + '" style="background:' + (SW[k] || '#ccc') + '" aria-label="' + cap(k) + '"></button>'; }).join('') + '</div>' : '';
    var quick = p.sizes
      ? '<span class="mono">Quick add · pick a size</span><div class="sizes">' + p.sizes.map(function (s) { return '<button data-size="' + s + '">' + s + '</button>'; }).join('') + '</div>'
      : '<button class="btn btn--ink" data-quick-add><span>' + (p.price === 0 ? 'Get it free' : 'Quick add — ' + gbp(p.price)) + '</span></button>';
    return '<article class="' + cls + '" data-id="' + p.id + '" data-v="' + v + '" style="--i:' + i + '">' +
      '<div class="card__media" data-cursor="View">' +
        '<img src="' + imgs[0] + '" alt="' + p.name + '" loading="lazy">' + (imgs[1] ? '<img class="alt" src="' + imgs[1] + '" alt="" loading="lazy">' : '') +
        '<div class="card__badges">' + (p.badge ? '<span class="badge ' + (p.cat === 'circuits' ? 'badge--cyan' : 'badge--ink') + '">' + p.badge + '</span>' : '') + '</div>' +
        '<button class="card__wish" aria-label="Save to wishlist"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg></button>' +
        '<div class="card__quick">' + quick + '</div>' +
      '</div>' +
      '<div class="card__info"><h3>' + p.name + '</h3><span class="card__price">' + (p.was ? '<s>' + gbp(p.was) + '</s>' : '') + gbp(p.price) + '</span>' +
        '<div class="card__meta">' + sw + (p.cat === 'circuits' ? 'Instant PDF · 3 editions' : (Object.keys(p.variants).length > 1 ? Object.keys(p.variants).length + ' colours' : '')) + '</div>' +
        (p.price > 0 ? '<span class="card__member">Members ' + gbp(p.price * 0.9) + '</span>' : '') +
      '</div></article>';
  }
  function renderRail(tab) {
    curTab = tab;
    var list = Object.keys(P).map(function (k) { return P[k]; }).filter(function (p) { return p.cat === tab; });
    rail.innerHTML = list.map(cardHTML).join('');
    rail.scrollLeft = 0; railBar();
  }
  rail.addEventListener('click', function (e) {
    var card = e.target.closest('.card'); if (!card || rail.dataset.dragged === '1') return;
    var p = P[card.dataset.id];
    var sw = e.target.closest('[data-sw]'), sz = e.target.closest('[data-size]'), qa = e.target.closest('[data-quick-add]'), wish = e.target.closest('.card__wish');
    if (sw) {
      card.dataset.v = sw.dataset.sw;
      $$('[data-sw]', card).forEach(function (b) { b.classList.toggle('on', b === sw); });
      var imgs = p.variants[sw.dataset.sw], im = $$('.card__media img', card);
      im[0].src = imgs[0]; if (im[1] && imgs[1]) im[1].src = imgs[1];
      return;
    }
    if (sz) { sz.classList.add('on'); addToCart(p.id, { variant: card.dataset.v, size: sz.dataset.size }); flyFrom(sz); setTimeout(function () { sz.classList.remove('on'); }, 600); return; }
    if (qa) { if (p.price === 0) { location.hash = 'free'; return; } addToCart(p.id, { variant: card.dataset.v }); flyFrom(qa); return; }
    if (wish) { wish.classList.toggle('on'); return; }
    if (e.target.closest('.card__media')) openQV(p.id, card.dataset.v);
  });

  /* tabs */
  var tabs = $$('.seg button'), seg = $('.seg');
  function setTab(t) {
    tabs.forEach(function (b, i) { var on = b.dataset.tab === t; b.setAttribute('aria-selected', on); if (on) seg.style.setProperty('--i', i); });
    renderRail(t);
  }
  tabs.forEach(function (b) { b.addEventListener('click', function () { setTab(b.dataset.tab); }); });
  $$('[data-tab-link]').forEach(function (a) { a.addEventListener('click', function () { setTab(a.dataset.tabLink); }); });
  setTab('apparel');

  /* rail arrows, progress, drag */
  function railBar() {
    var max = rail.scrollWidth - rail.clientWidth, bar = $('.js-rail-bar');
    var w = Math.max(12, rail.clientWidth / rail.scrollWidth * 100);
    bar.style.width = w + '%';
    var track = bar.parentElement.clientWidth;
    bar.style.setProperty('--x', (max > 0 ? rail.scrollLeft / max : 0) * (track - track * w / 100) + 'px');
  }
  rail.addEventListener('scroll', railBar, { passive: true });
  window.addEventListener('resize', railBar);
  $('.js-next').addEventListener('click', function () { rail.scrollBy({ left: 340, behavior: 'smooth' }); });
  $('.js-prev').addEventListener('click', function () { rail.scrollBy({ left: -340, behavior: 'smooth' }); });
  if (fine) {
    var dragging = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('mousedown', function (e) { dragging = true; sx = e.pageX; sl = rail.scrollLeft; moved = 0; rail.dataset.dragged = '0'; });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return; var dx = e.pageX - sx; moved = Math.abs(dx);
      if (moved > 6) { rail.classList.add('drag'); rail.dataset.dragged = '1'; }
      rail.scrollLeft = sl - dx;
    });
    window.addEventListener('mouseup', function () { if (!dragging) return; dragging = false; rail.classList.remove('drag'); setTimeout(function () { rail.dataset.dragged = '0'; }, 50); });
  }

  /* ---------- Quick view ---------- */
  var qvState = {};
  function openQV(id, v) {
    var p = P[id]; v = v || first(p);
    qvState = { id: id, v: v, size: p.sizes ? 'M' : '' };
    $('.js-qv-img').src = p.variants[v][0]; $('.js-qv-img').alt = p.name;
    $('.js-qv-cat').textContent = p.cat;
    $('.js-qv-name').textContent = p.name;
    $('.js-qv-price').innerHTML = (p.was ? '<s style="color:#6b6f75;font-weight:400;margin-right:6px">' + gbp(p.was) + '</s>' : '') + gbp(p.price);
    $('.js-qv-member').textContent = gbp(p.price * 0.9);
    var keys = Object.keys(p.variants);
    $('.js-qv-sw').innerHTML = keys.length > 1 ? keys.map(function (k) { return '<button data-v="' + k + '" class="' + (k === v ? 'on' : '') + '">' + cap(k) + '</button>'; }).join('') : '';
    $('.js-qv-sizes').innerHTML = p.sizes ? p.sizes.map(function (s) { return '<button data-s="' + s + '" class="' + (s === 'M' ? 'on' : '') + '">' + s + '</button>'; }).join('') : '';
    $('.js-qv-add span').textContent = 'Add to cart — ' + gbp(p.price);
    open(qv);
  }
  $('.js-qv-sw').addEventListener('click', function (e) {
    var b = e.target.closest('[data-v]'); if (!b) return; qvState.v = b.dataset.v;
    $$('[data-v]', this).forEach(function (x) { x.classList.toggle('on', x === b); });
    $('.js-qv-img').src = P[qvState.id].variants[qvState.v][0];
  });
  $('.js-qv-sizes').addEventListener('click', function (e) {
    var b = e.target.closest('[data-s]'); if (!b) return; qvState.size = b.dataset.s;
    $$('[data-s]', this).forEach(function (x) { x.classList.toggle('on', x === b); });
  });
  $('.js-qv-add').addEventListener('click', function () { addToCart(qvState.id, { variant: qvState.v, size: qvState.size }, true); open(cartEl); });

  /* hotspots open quick view */
  $$('.hotspot').forEach(function (h) {
    h.addEventListener('click', function (e) { e.stopPropagation(); openQV(h.dataset.product, h.dataset.variant); });
    h.addEventListener('mouseenter', function () {
      $$('.js-look-list li').forEach(function (li) { li.classList.toggle('hl-on', li.dataset.product === h.dataset.product); });
    });
    h.addEventListener('mouseleave', function () { $$('.js-look-list li').forEach(function (li) { li.classList.remove('hl-on'); }); });
  });
  $('.js-add-look').addEventListener('click', function (e) {
    ['vest', 'shorts', 'beanie'].forEach(function (k) { addToCart(k, null, true); });
    flyFrom(e.currentTarget); open(cartEl);
  });

  /* ---------- Search ---------- */
  var sIn = $('.js-search-input'), sRes = $('.js-search-results');
  function renderSearch(q) {
    q = q.trim().toLowerCase();
    var res = Object.keys(P).map(function (k) { return P[k]; }).filter(function (p) { return !q || (p.name + ' ' + p.cat).toLowerCase().indexOf(q) > -1; });
    sRes.innerHTML = res.length ? res.map(function (p, i) { return '<button class="sr" data-id="' + p.id + '" style="animation-delay:' + i * 30 + 'ms"><img src="' + p.variants[first(p)][0] + '" alt=""><span>' + p.name + '<small>' + gbp(p.price) + ' · ' + p.cat + '</small></span></button>'; }).join('')
      : '<p style="color:#6b6f75">No matches. Try “vest”, “circuit” or “chalk”.</p>';
  }
  sIn.addEventListener('input', function () { renderSearch(sIn.value); });
  $$('.search__chips button').forEach(function (b) { b.addEventListener('click', function () { sIn.value = b.textContent; renderSearch(b.textContent); }); });
  sRes.addEventListener('click', function (e) { var b = e.target.closest('[data-id]'); if (b) openQV(b.dataset.id); });

  /* ---------- Drop spotlight ---------- */
  var mainImg = $('.js-drop-main');
  $$('.drop__thumbs button').forEach(function (b, _, all) {
    b.addEventListener('click', function () {
      all.forEach(function (x) { x.classList.toggle('is-active', x === b); });
      mainImg.style.opacity = 0;
      setTimeout(function () { mainImg.src = b.dataset.src; mainImg.style.opacity = 1; }, 220);
    });
  });
  $$('.editions input').forEach(function (r) { r.addEventListener('change', function () { $('.js-ed-name').textContent = r.value; }); });

  /* ---------- Kit builder ---------- */
  var groups = $$('.kit__opts');
  groups.forEach(function (g) {
    g.addEventListener('click', function (e) {
      var o = e.target.closest('.opt'); if (!o) return;
      if (g.hasAttribute('data-single')) {
        var was = o.classList.contains('is-on');
        $$('.opt', g).forEach(function (x) { x.classList.remove('is-on'); });
        if (!(was && g.hasAttribute('data-optional'))) o.classList.add('is-on');
      } else o.classList.toggle('is-on');
      renderKit();
    });
  });
  function kitItems() { return $$('.kit .opt.is-on').map(function (o) { return o.dataset.product; }); }
  function renderKit() {
    var items = kitItems(), total = 0;
    $('.js-kit-lines').innerHTML = items.map(function (k) { total += P[k].price; return '<li><span>' + (P[k].short || P[k].name) + '</span><span>' + gbp(P[k].price) + '</span></li>'; }).join('') || '<li><span>Pick something to start</span></li>';
    $('.js-kit-stack').innerHTML = items.map(function (k, i) { return '<img src="' + P[k].variants[first(P[k])][0] + '" alt="" style="animation-delay:' + i * 60 + 'ms;z-index:' + (10 - i) + '">'; }).join('');
    animNum($('.js-kit-total'), total);
    $('.js-kit-member').textContent = gbp(total * 0.9);
    $('.js-kit-save').textContent = gbp(total * 0.1);
  }
  function animNum(el, to) {
    var from = parseFloat(el.textContent.replace('£', '')) || 0, t0;
    if (reduce) { el.textContent = gbp(to); return; }
    requestAnimationFrame(function st(ts) {
      t0 = t0 || ts; var p = Math.min((ts - t0) / 500, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = gbp(from + (to - from) * e); if (p < 1) requestAnimationFrame(st);
    });
  }
  $('.js-add-kit').addEventListener('click', function (e) {
    var items = kitItems(); if (!items.length) return;
    items.forEach(function (k) { addToCart(k, null, true); });
    flyFrom(e.currentTarget); setTimeout(function () { open(cartEl); }, 300);
  });
  renderKit();

  /* ---------- Email forms (prototype) ---------- */
  $$('.js-signup').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = $('input', f);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) { f.classList.remove('error'); void f.offsetWidth; f.classList.add('error'); inp.focus(); return; }
      f.classList.remove('error'); f.classList.add('done');
      try { sessionStorage.setItem('cc2-signed', '1'); } catch (er) {}
    });
  });

  /* ---------- Exit intent (desktop, once per session) ---------- */
  var exitShown = false;
  try { exitShown = sessionStorage.getItem('cc2-exit') === '1' || sessionStorage.getItem('cc2-signed') === '1'; } catch (e) {}
  var armed = false; setTimeout(function () { armed = true; }, 8000);
  document.addEventListener('mouseout', function (e) {
    if (!fine || exitShown || !armed || openEl || e.relatedTarget || e.clientY > 10) return;
    exitShown = true; try { sessionStorage.setItem('cc2-exit', '1'); } catch (er) {}
    open(exitEl);
  });

  /* ---------- Scroll loop ---------- */
  var header = $('.header'), prog = $('.progress span'), mbar = $('.mbar'), lastY = window.scrollY;
  var ticker = $('.js-ticker'), tx = 0, vel = 0;
  var par = $$('[data-speed]');
  var hero = $('.hero'), freeSec = $('.free');
  function onScroll() {
    var y = window.scrollY, vh = window.innerHeight, h = document.documentElement.scrollHeight - vh;
    prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    header.classList.toggle('scrolled', y > 20);
    if (y > 500 && y > lastY + 4 && !document.body.classList.contains('lock')) header.classList.add('hide');
    else if (y < lastY - 4 || y < 500) header.classList.remove('hide');
    vel += (y - lastY) * 0.04;
    lastY = y;
    mbar.classList.toggle('show', hero.getBoundingClientRect().bottom < 0 && freeSec.getBoundingClientRect().top > vh);
    if (reduce) return;
    par.forEach(function (el) {
      var r = el.getBoundingClientRect(), c = r.top + r.height / 2 - vh / 2;
      el.style.translate = '0 ' + (c * +el.dataset.speed) + 'px';
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); } }, { passive: true });
  onScroll();

  // ticker: constant drift + scroll velocity boost
  if (!reduce && ticker) {
    (function loop() {
      vel *= 0.92;
      tx -= 0.6 + Math.min(Math.abs(vel), 14);
      var half = ticker.scrollWidth / 2;
      if (-tx >= half) tx += half;
      ticker.style.transform = 'translate3d(' + tx + 'px,0,0)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Pointer effects ---------- */
  if (!fine || reduce) return;
  var cur = $('.cursor'), cl = $('.cursor span'), cx = 0, cy = 0, mx = 0, my = 0;
  window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; cur.classList.add('on'); }, { passive: true });
  document.addEventListener('mouseleave', function () { cur.classList.remove('on'); });
  (function loop() { cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2; cur.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)'; requestAnimationFrame(loop); })();
  document.addEventListener('mouseover', function (e) {
    var lab = e.target.closest('[data-cursor]'), hov = e.target.closest('a, button, summary, input, label');
    if (lab && !e.target.closest('.card__quick, .card__wish, .hotspot')) { cl.textContent = lab.dataset.cursor; cur.classList.add('label'); cur.classList.remove('hover'); }
    else { cur.classList.remove('label'); cur.classList.toggle('hover', !!hov); }
  });

  $$('.magnetic').forEach(function (b) {
    b.addEventListener('mousemove', function (e) {
      var r = b.getBoundingClientRect();
      b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.2) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.28) + 'px)';
    });
    b.addEventListener('mouseleave', function () { b.style.transform = ''; });
  });

  // 3D tilt on bento + plan cards
  $$('.tile--drop, .tile--stat, .cat').forEach(function (c) {
    c.addEventListener('mousemove', function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = 'perspective(900px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 5) + 'deg)';
    });
    c.addEventListener('mouseleave', function () { c.style.transform = ''; });
  });
})();
