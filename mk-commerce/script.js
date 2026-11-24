/* MK Commerce — v2 interactions */
(function () {
  'use strict';

  var STORE = 'https://mkcommerceds.com/products/';
  var FREE_SHIP = 35;
  var KIT_OFF = { 2: 0.10, 3: 0.15 };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var P = {
    brush: {
      name: 'One-Click Self-Cleaning Brush', short: 'One-Click Brush', price: 16.39, badge: 'Best seller',
      imgs: ['images/brush-1.webp', 'images/brush-2.webp'], rating: 4.9, reviews: 312,
      benefit: 'Catches loose undercoat hair, then releases it in one click.',
      handle: 'pet-cat-comb',
      variants: [{ name: 'Blue', c: '#8fcbe8' }, { name: 'Grey', c: '#a7abb1' }, { name: 'Pink', c: '#f4b8c9' }]
    },
    glove: {
      name: '2-in-1 Deshedding Grooming Glove', short: 'Grooming Glove', price: 22.65, badge: 'Cats love it',
      imgs: ['images/glove-1.webp', 'images/glove-4.webp'], rating: 4.8, reviews: 187,
      benefit: 'Feels like petting, works like a deshedder. Lifts hair off sofas too.',
      handle: '2-in-1-pet-grooming-glove-double-sided-deshedding-massage-brush-for-cats-or-dogs-removes-loose-hair-from-fur-furniture-ultra-soft-easy-clean-mitt-single-glove-1',
      variants: [{ name: 'Blue', c: '#9fd0ea' }]
    },
    collar: {
      name: 'AirTag Reflective Safety Collar', short: 'AirTag Collar', price: 19.26, badge: 'Peace of mind',
      imgs: ['images/collar-1.webp', 'images/collar-2.webp'], rating: 4.8, reviews: 241,
      benefit: 'Waterproof AirTag slot, reflective stitching and a bonus bell.',
      handle: 'reflective-collar-waterproof-holder-case-for-airtag-air-tag-airtags-protective-cover-cat-dog-kitten-puppy-nylon-collar',
      variants: [
        { name: 'Purple', c: '#8c6ad8', price: 19.26, img: 'images/collar-1.webp' },
        { name: 'Black', c: '#222222', price: 19.04, img: 'images/collar-4.webp' },
        { name: 'Yellow', c: '#f2c31b', price: 24.34, img: 'images/collar-3.webp' },
        { name: 'Sky Blue', c: '#6fc3e6', price: 20.40, img: 'images/collar-2.webp' }
      ]
    }
  };
  var KEYS = ['brush', 'glove', 'collar'];
  var sel = { brush: 0, glove: 0, collar: 0 };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + n.toFixed(2); };
  var vPrice = function (k, i) { var v = P[k].variants[i == null ? sel[k] : i]; return (v && v.price) || P[k].price; };
  var ls = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* noop */ } }
  };
  var ss = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* noop */ } }
  };
  var stars = function (n) { var o = ''; for (var i = 1; i <= 5; i++) o += '<svg' + (i > Math.round(n) ? ' class="off"' : '') + '><use href="#i-star"/></svg>'; return o; };

  /* ---------- toast + copy ---------- */
  var toastEl = $('[data-toast]'), tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600); }
  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-copy]'); if (!c) return;
    var code = c.getAttribute('data-copy'), done = function () { toast('Code ' + code + ' copied. Paste it at checkout.'); };
    if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, done); else done();
  });

  /* ---------- marquees ---------- */
  var style = document.createElement('style');
  style.textContent = '@keyframes marq{to{transform:translateX(-50%)}}@keyframes marqr{from{transform:translateX(-50%)}to{transform:translateX(0)}}';
  document.head.appendChild(style);
  $$('[data-marquee]').forEach(function (t) {
    var original = t.innerHTML, vw = Math.max(window.innerWidth, 1200), guard = 0;
    while (t.scrollWidth < vw && guard++ < 8) t.innerHTML += original;
    t.innerHTML += t.innerHTML;
    $$('button', t).forEach(function (b, i) { if (i > 0) b.tabIndex = -1; });
    var speed = +t.getAttribute('data-speed') || 35;
    var dur = (t.scrollWidth / 2) / speed;
    if (!reduce) t.style.animation = (t.hasAttribute('data-reverse') ? 'marqr ' : 'marq ') + dur + 's linear infinite';
  });

  /* ---------- header ---------- */
  var header = $('[data-header]'), lastY = 0;
  function onScrollHeader() {
    var y = window.scrollY;
    header.classList.toggle('is-hidden', y > 300 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  var burger = $('[data-burger]'), menu = $('[data-menu]');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open); menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (window.__lenis) { open ? window.__lenis.stop() : window.__lenis.start(); }
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* ---------- search ---------- */
  var sp = $('[data-search-panel]'), si = $('[data-search-input]'), sr = $('[data-search-results]');
  function renderSearch(q) {
    q = q.trim().toLowerCase();
    var ks = KEYS.filter(function (k) { return !q || (P[k].name + ' ' + P[k].benefit + ' ' + k).toLowerCase().indexOf(q) > -1; });
    sr.innerHTML = ks.length ? ks.map(function (k) { return '<a href="#p-' + k + '"><img src="' + P[k].imgs[0] + '" alt=""><span><b>' + P[k].name + '</b><br><small>' + money(P[k].price) + '</small></span></a>'; }).join('')
      : '<p>Nothing for “' + q.replace(/</g, '&lt;') + '”. Try brush, glove or collar.</p>';
  }
  $('[data-search]').addEventListener('click', function () { sp.hidden = !sp.hidden; if (!sp.hidden) { renderSearch(''); si.focus(); } });
  si.addEventListener('input', function () { renderSearch(si.value); });
  sr.addEventListener('click', function (e) { if (e.target.closest('a')) sp.hidden = true; });

  /* ---------- problem picker ---------- */
  var PROBLEMS = [
    { k: 'brush', img: 'images/brush-1.webp', problem: '“There’s fur on the sofa, the bed, my clothes, the car…”', list: ['Catches loose undercoat hair before it sheds', 'One click releases the whole clump', 'Round-tipped pins massage, never scratch'] },
    { k: 'glove', img: 'images/glove-1.webp', problem: '“My pet runs the second I pick up a brush.”', list: ['Feels like petting, so they actually enjoy it', 'Five fingers reach face, paws and tail', 'Peel the hair off in one clean sheet'] },
    { k: 'collar', img: 'images/beagle-collar.webp', problem: '“Every time the door opens, my heart stops.”', list: ['Waterproof AirTag slot: find them from your phone', 'Reflective stitching for night walks', 'Breakaway buckle + bonus bell'] }
  ];
  var ppIdx = 0, ppImg = $('[data-pp-img]');
  function renderProblem(i, first) {
    ppIdx = i; var d = PROBLEMS[i], p = P[d.k];
    $$('[data-problem]').forEach(function (b) { b.setAttribute('aria-selected', +b.getAttribute('data-problem') === i); });
    var swap = function () {
      ppImg.src = d.img; ppImg.alt = p.name;
      $('[data-pp-problem]').textContent = d.problem;
      $('[data-pp-name]').textContent = p.name;
      $('[data-pp-list]').innerHTML = d.list.map(function (l) { return '<li><svg><use href="#i-check"/></svg>' + l + '</li>'; }).join('');
      $('[data-pp-price]').textContent = money(vPrice(d.k));
      ppImg.classList.remove('is-swap');
    };
    if (first) return swap();
    ppImg.classList.add('is-swap'); setTimeout(swap, 280);
  }
  $$('[data-problem]').forEach(function (b) { b.addEventListener('click', function () { renderProblem(+b.getAttribute('data-problem')); }); });
  $('[data-pp-add]').addEventListener('click', function (e) { addToCart(PROBLEMS[ppIdx].k, e.currentTarget); });
  renderProblem(0, true);

  /* ---------- product cards ---------- */
  var grid = $('[data-product-grid]');
  grid.innerHTML = KEYS.map(function (k, n) {
    var p = P[k];
    var sw = '<div class="sw" role="radiogroup" aria-label="Colour">' + (p.variants.length > 1 ? p.variants.map(function (v, i) {
      return '<button style="--c:' + v.c + '" class="' + (i ? '' : 'is-on') + '" role="radio" aria-checked="' + !i + '" aria-label="' + v.name + '" data-v="' + k + ':' + i + '"></button>';
    }).join('') : '') + '<span data-vname="' + k + '">' + (p.variants.length > 1 ? p.variants[0].name : 'Single glove · Blue') + '</span></div>';
    return '<article class="card" id="p-' + k + '" data-tilt>' +
      '<a class="card__media" href="' + STORE + p.handle + '" target="_blank" rel="noopener" aria-label="View ' + p.name + '" data-cursor="View">' +
        '<span class="card__badge">' + p.badge + '</span><span class="card__num">0' + (n + 1) + '</span>' +
        '<img src="' + p.imgs[0] + '" alt="' + p.name + '" width="800" height="800" loading="lazy" data-cimg="' + k + '">' +
        '<img src="' + p.imgs[1] + '" alt="" width="800" height="800" loading="lazy">' +
      '</a>' +
      '<div class="card__body">' +
        '<div class="card__rating"><span class="stars" aria-label="' + p.rating + ' out of 5">' + stars(p.rating) + '</span>' + p.rating + ' · ' + p.reviews + ' reviews</div>' +
        '<h3 class="card__title"><a href="' + STORE + p.handle + '" target="_blank" rel="noopener">' + p.name + '</a></h3>' +
        '<p class="card__benefit">' + p.benefit + '</p>' + sw +
        '<div class="card__foot"><span class="card__price" data-cprice="' + k + '">' + money(vPrice(k)) + '</span>' +
        '<button class="card__add" data-add="' + k + '" aria-label="Add ' + p.short + ' to cart" data-cursor="Add"><svg><use href="#i-plus"/></svg></button></div>' +
      '</div></article>';
  }).join('');

  function setVariant(k, i) {
    sel[k] = i; var v = P[k].variants[i];
    $$('[data-v^="' + k + ':"]').forEach(function (b) { var on = b.getAttribute('data-v') === k + ':' + i; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on); });
    var vn = $('[data-vname="' + k + '"]'); if (vn) vn.textContent = v.name;
    var cp = $('[data-cprice="' + k + '"]'); if (cp) cp.textContent = money(vPrice(k));
    if (v.img) { var ci = $('[data-cimg="' + k + '"]'); if (ci) ci.src = v.img; }
    if (k === 'collar') renderCollar();
    if (PROBLEMS[ppIdx].k === k) $('[data-pp-price]').textContent = money(vPrice(k));
    renderKit();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-v]'); if (!b) return;
    var a = b.getAttribute('data-v').split(':'); setVariant(a[0], +a[1]);
  });

  // 3D tilt
  if (finePointer && !reduce) $$('[data-tilt]').forEach(function (c) {
    c.addEventListener('mousemove', function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = 'rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-6px)';
    });
    c.addEventListener('mouseleave', function () { c.style.transform = ''; });
  });

  /* ---------- collar (day/night) ---------- */
  var safety = $('#safety'), csw = $('[data-collar-swatches]');
  csw.innerHTML = P.collar.variants.map(function (v, i) {
    return '<button style="--c:' + v.c + '" role="radio" aria-label="' + v.name + '" data-v="collar:' + i + '"></button>';
  }).join('') + '<span data-collar-name></span>';
  function renderCollar() {
    var v = P.collar.variants[sel.collar], img = $('[data-collar-img]');
    $$('button', csw).forEach(function (b, i) { b.classList.toggle('is-on', i === sel.collar); b.setAttribute('aria-checked', i === sel.collar); });
    $('[data-collar-name]').textContent = v.name;
    $('[data-collar-price]').textContent = money(v.price);
    if (img.getAttribute('src') !== v.img) { img.style.opacity = 0; setTimeout(function () { img.src = v.img; img.alt = v.name + ' AirTag reflective collar'; img.style.opacity = 1; }, 200); }
  }
  renderCollar();
  $$('[data-mode-btn]').forEach(function (b) {
    b.addEventListener('click', function () {
      var m = b.getAttribute('data-mode-btn'); safety.setAttribute('data-mode', m);
      $$('[data-mode-btn]').forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); });
    });
  });

  /* ---------- kit builder ---------- */
  var kit = { brush: true, glove: true, collar: false };
  var kitItems = $('[data-kit-items]');
  kitItems.innerHTML = KEYS.map(function (k) {
    var p = P[k];
    return '<button class="kit-item" aria-pressed="' + kit[k] + '" data-kit="' + k + '"><img src="' + (k === 'collar' ? 'images/collar-1.webp' : p.imgs[0]) + '" alt="" width="400" height="400" loading="lazy">' +
      '<div><b>' + p.short + '</b><span data-kit-price="' + k + '"></span></div><span class="tick"><svg><use href="#i-check"/></svg></span></button>';
  }).join('');
  function kitList() { return KEYS.filter(function (k) { return kit[k]; }); }
  function kitPrice(list) {
    var sum = list.reduce(function (a, k) { return a + vPrice(k); }, 0), off = KIT_OFF[list.length] || 0;
    return { was: sum, total: Math.round(sum * (1 - off) * 100) / 100, off: off };
  }
  function renderKit() {
    var list = kitList(), pr = kitPrice(list);
    KEYS.forEach(function (k) { $('[data-kit-price="' + k + '"]').textContent = money(vPrice(k)); });
    $('[data-kit-lines]').innerHTML = list.length ? list.map(function (k) { return '<li><span>' + P[k].short + (P[k].variants.length > 1 ? ' · ' + P[k].variants[sel[k]].name : '') + '</span><span>' + money(vPrice(k)) + '</span></li>'; }).join('') : '<li class="empty">Tap products to build your kit</li>';
    $('[data-kit-was]').textContent = pr.off ? money(pr.was) : '';
    $('[data-kit-total]').textContent = money(pr.total);
    $('[data-kit-save]').textContent = list.length === 3 ? 'Max savings unlocked: you save ' + money(pr.was - pr.total) + ' 🎉' : list.length === 2 ? 'You save ' + money(pr.was - pr.total) + '. Add 1 more for 15% off' : list.length === 1 ? 'Add one more item to save 10%' : '';
    $('[data-kit-ship]').textContent = pr.total >= FREE_SHIP ? 'Free shipping unlocked' : list.length ? money(FREE_SHIP - pr.total) + ' away from free shipping' : 'Free shipping over $35';
    $('[data-kit-fill]').style.width = (list.length / 3 * 100) + '%';
    $$('[data-tier]').forEach(function (t) { t.classList.toggle('is-on', +t.getAttribute('data-tier') <= list.length); });
    $('[data-kit-add]').disabled = !list.length;
  }
  kitItems.addEventListener('click', function (e) {
    var b = e.target.closest('[data-kit]'); if (!b) return;
    var k = b.getAttribute('data-kit'); kit[k] = !kit[k]; b.setAttribute('aria-pressed', kit[k]); renderKit();
  });
  $('[data-kit-add]').addEventListener('click', function (e) {
    var list = kitList(); if (!list.length) return;
    if (list.length === 1) return addToCart(list[0], e.currentTarget);
    cart.push({ kit: list.map(function (k) { return { k: k, v: sel[k] }; }), q: 1 });
    afterAdd(e.currentTarget);
  });
  renderKit();

  /* ---------- cart ---------- */
  var cart = ls.get('mk2-cart') || [];
  var drawer = $('[data-drawer]'), overlay = $('[data-overlay]'), lastFocus;
  function linePrice(it) {
    if (it.kit) { var sum = it.kit.reduce(function (a, x) { return a + vPrice(x.k, x.v); }, 0); return Math.round(sum * (1 - (KIT_OFF[it.kit.length] || 0)) * 100) / 100; }
    return vPrice(it.k, it.v);
  }
  function addToCart(k, btn) {
    var f = cart.find(function (i) { return i.k === k && i.v === sel[k]; });
    if (f) f.q++; else cart.push({ k: k, v: sel[k], q: 1 });
    afterAdd(btn);
  }
  function afterAdd(btn) {
    save();
    if (btn && btn.classList) {
      btn.classList.add('is-added');
      var lbl = btn.querySelector('span');
      var old = lbl ? lbl.textContent : null;
      if (lbl) lbl.textContent = 'Added ✓';
      setTimeout(function () { btn.classList.remove('is-added'); if (lbl) lbl.textContent = old; }, 1300);
    }
    var b = $('[data-cart-count]'); b.classList.add('bump'); setTimeout(function () { b.classList.remove('bump'); }, 300);
    setTimeout(openCart, 380);
  }
  function save() { ls.set('mk2-cart', cart); renderCart(); }
  function renderCart() {
    var count = cart.reduce(function (a, i) { return a + i.q; }, 0), total = cart.reduce(function (a, i) { return a + linePrice(i) * i.q; }, 0);
    $('[data-cart-count]').textContent = count;
    $('[data-cart-count-text]').textContent = count ? '(' + count + ')' : '';
    $('[data-cart-total]').textContent = money(total);
    var left = FREE_SHIP - total, ship = $('.ship');
    $('[data-ship-text]').innerHTML = !total ? 'Spend <b>' + money(FREE_SHIP) + '</b> and shipping is on us' : left > 0 ? 'You\'re <b>' + money(left) + '</b> away from <b>free shipping</b>' : '🎉 Your order ships <b>free</b>';
    ship.classList.toggle('is-free', total >= FREE_SHIP);
    $('[data-ship-bar]').style.width = Math.min(100, total / FREE_SHIP * 100) + '%';
    $('[data-cart-items]').innerHTML = cart.length ? cart.map(function (it, i) {
      var name, sub, img;
      if (it.kit) { name = 'Grooming Kit (' + Math.round(KIT_OFF[it.kit.length] * 100) + '% off)'; sub = it.kit.map(function (x) { return P[x.k].short; }).join(' + '); img = P[it.kit[0].k].imgs[0]; }
      else { var p = P[it.k], v = p.variants[it.v] || {}; name = p.name; sub = v.name || ''; img = v.img || p.imgs[0]; }
      return '<div class="ci"><img src="' + img + '" alt=""><div><h3>' + name + '</h3><small>' + sub + '</small><div class="qty"><button data-q="' + i + ':-1" aria-label="Decrease"><svg><use href="#i-minus"/></svg></button><span>' + it.q + '</span><button data-q="' + i + ':1" aria-label="Increase"><svg><use href="#i-plus"/></svg></button></div></div>' +
        '<div><div class="ci__price">' + money(linePrice(it) * it.q) + '</div><button class="ci__rm" data-rm="' + i + '">Remove</button></div></div>';
    }).join('') : '<div class="empty"><svg><use href="#i-paw"/></svg><p>Your cart is empty.<br>Your pet is waiting.</p><a class="btn btn--orange" href="#shop" data-close-cart><span>Shop best sellers</span></a></div>';
    var inCart = {}; cart.forEach(function (i) { if (i.kit) i.kit.forEach(function (x) { inCart[x.k] = 1; }); else inCart[i.k] = 1; });
    var opts = KEYS.filter(function (k) { return !inCart[k]; }).sort(function (a, b) { return P[a].price - P[b].price; });
    var up = $('[data-upsell]');
    if (cart.length && opts.length) {
      var k = opts.find(function (x) { return vPrice(x) >= left; }) || opts[0];
      up.innerHTML = '<div class="upsell"><img src="' + P[k].imgs[0] + '" alt=""><div><small>' + (left > 0 && vPrice(k) >= left ? 'Unlocks free shipping' : 'Pairs perfectly') + '</small><b>' + P[k].short + '</b> · ' + money(vPrice(k)) + '</div><button class="btn btn--orange btn--sm" data-add="' + k + '" data-upsell-add><span>Add</span></button></div>';
    } else up.innerHTML = '';
  }
  function openCart() {
    lastFocus = document.activeElement; overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add('is-on'); drawer.classList.add('is-on'); });
    drawer.setAttribute('aria-hidden', 'false');
    if (window.__lenis) window.__lenis.stop(); else document.body.style.overflow = 'hidden';
    setTimeout(function () { var c = $('[data-close-cart]', drawer); if (c) c.focus(); }, 60);
  }
  function closeCart() {
    if (!drawer.classList.contains('is-on')) return;
    overlay.classList.remove('is-on'); drawer.classList.remove('is-on'); drawer.setAttribute('aria-hidden', 'true');
    if (window.__lenis) window.__lenis.start(); document.body.style.overflow = '';
    setTimeout(function () { overlay.hidden = true; }, 400);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-add]');
    if (a) { e.preventDefault(); addToCart(a.getAttribute('data-add'), a.hasAttribute('data-upsell-add') ? null : a); return; }
    if (e.target.closest('[data-open-cart]')) return openCart();
    if (e.target.closest('[data-close-cart]') || e.target === overlay) return closeCart();
    var q = e.target.closest('[data-q]');
    if (q) { var s = q.getAttribute('data-q').split(':'), it = cart[+s[0]]; it.q += +s[1]; if (it.q < 1) cart.splice(+s[0], 1); return save(); }
    var r = e.target.closest('[data-rm]'); if (r) { cart.splice(+r.getAttribute('data-rm'), 1); return save(); }
    if (e.target.closest('[data-checkout]')) toast(cart.length ? 'Prototype: on the live store this opens Shopify\'s secure checkout.' : 'Your cart is empty. Add something first.');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeCart(); closeModal(); sp.hidden = true; setMenu(false); } });
  renderCart();

  /* ---------- reviews drag ---------- */
  var wall = $('[data-wall]');
  (function () {
    var down = false, sx = 0, sl = 0, moved = 0;
    wall.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = wall.scrollLeft; });
    window.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; moved = Math.abs(dx); if (moved > 4) wall.classList.add('is-dragging'); wall.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', function () { down = false; wall.classList.remove('is-dragging'); });
  })();

  /* ---------- counters ---------- */
  function runCount(el) {
    var to = +el.getAttribute('data-count'), dec = +el.getAttribute('data-decimals') || 0, suf = el.getAttribute('data-suffix') || '', t0 = null, dur = 1600;
    var fmt = function (n) { return (dec ? n.toFixed(dec) : Math.round(n).toLocaleString('en-US')) + suf; };
    if (reduce) { el.textContent = fmt(to); return; }
    (function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = fmt(to * e); if (p < 1) requestAnimationFrame(step); })(performance.now());
  }

  /* ---------- story steps ---------- */
  var steps = $$('.step'), storyImgs = $$('[data-story-img]');
  function setStep(i) {
    steps.forEach(function (s, j) { s.classList.toggle('is-on', j === i); });
    storyImgs.forEach(function (im, j) { im.classList.toggle('is-on', j === i); });
    $('[data-story-num]').textContent = '0' + (i + 1);
    $('[data-story-bar]').style.width = ((i + 1) / 3 * 100) + '%';
  }
  setStep(0);

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) setStep(+x.target.getAttribute('data-step')); }); }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { io.observe(s); });
    var cio = new IntersectionObserver(function (en, o) { en.forEach(function (x) { if (x.isIntersecting) { runCount(x.target); o.unobserve(x.target); } }); }, { threshold: .6 });
    $$('[data-count]').forEach(function (c) { cio.observe(c); });
    // sticky mobile CTA
    var sticky = $('[data-sticky]'), heroOut = false, endIn = false;
    var upd = function () { var on = heroOut && !endIn; sticky.classList.toggle('is-on', on); sticky.setAttribute('aria-hidden', !on); $('button', sticky).tabIndex = on ? 0 : -1; };
    new IntersectionObserver(function (en) { heroOut = !en[0].isIntersecting; upd(); }).observe($('.hero'));
    new IntersectionObserver(function (en) { endIn = en.some(function (x) { return x.isIntersecting; }); upd(); }).observe($('.final'));
  } else { $$('[data-count]').forEach(runCount); }

  /* ---------- newsletter + popup ---------- */
  $$('[data-nl-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var i = $('input', f), m = $('[data-nl-msg]', f);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value.trim())) { m.textContent = 'Please enter a valid email address.'; i.focus(); return; }
      m.innerHTML = '🎉 You\'re in! Your code: <button type="button" class="code" data-copy="WELCOME10">WELCOME10</button>';
      i.value = ''; ls.set('mk-sub', true);
      if (f.closest('[data-modal]')) setTimeout(closeModal, 2400);
    });
  });
  var modal = $('[data-modal]'), shown = ss.get('mk2-modal') || ls.get('mk-sub');
  function openModal() {
    if (shown || document.body.classList.contains('notes-on') || drawer.classList.contains('is-on')) return;
    shown = true; ss.set('mk2-modal', '1'); modal.hidden = false;
    if (window.__lenis) window.__lenis.stop();
  }
  function closeModal() { if (modal.hidden) return; modal.hidden = true; if (window.__lenis) window.__lenis.start(); }
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('[data-close-modal]')) closeModal(); });
  if (!shown && !/[?&](nopopup|notes)/.test(location.search)) {
    setTimeout(openModal, 40000);
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY < 8) openModal(); });
  }

  /* ---------- CRO notes ---------- */
  var nlist = $('[data-notes-list]'), npanel = $('[data-notes-panel]'), nbtn = $('[data-notes-toggle]');
  $$('[data-cro]').forEach(function (s, i) {
    var t = s.getAttribute('data-cro'), w = s.getAttribute('data-cro-why'); if (!s.id) s.id = 'cro-' + (i + 1);
    var pin = document.createElement('div'); pin.className = 'cro-pin';
    pin.innerHTML = '<b>' + (i + 1) + '</b><div><strong>' + t + '</strong><p>' + w + '</p></div><button type="button" aria-label="Minimise note">–</button>';
    $('button', pin).addEventListener('click', function () { var m = pin.classList.toggle('is-min'); this.textContent = m ? '+' : '–'; });
    s.insertBefore(pin, s.firstChild);
    var li = document.createElement('li'); li.innerHTML = '<a href="#' + s.id + '">' + t + '</a><p>' + w + '</p>'; nlist.appendChild(li);
  });
  function setNotes(on) { document.body.classList.toggle('notes-on', on); nbtn.setAttribute('aria-pressed', on); npanel.hidden = !on; if (on) closeModal(); if (window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 50); }
  nbtn.addEventListener('click', function () { setNotes(!document.body.classList.contains('notes-on')); });
  $('[data-notes-close]').addEventListener('click', function () { npanel.hidden = true; });
  nlist.addEventListener('click', function (e) {
    var a = e.target.closest('a'); if (!a) return;
    if (window.__lenis) { e.preventDefault(); window.__lenis.scrollTo(a.getAttribute('href'), { offset: -20 }); }
    if (window.innerWidth < 900) npanel.hidden = true;
  });
  if (/[?&]notes/.test(location.search)) setNotes(true);

  /* ---------- cursor + magnetic ---------- */
  if (finePointer && !reduce) {
    document.body.classList.add('has-cursor');
    var cur = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('[data-cursor-label]');
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)'; });
    (function loop() { rx += (mx - rx) * .18; ry += (my - ry) * .18; ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', function (e) {
      var l = e.target.closest('[data-cursor]'), a = e.target.closest('a,button,summary,input');
      cur.classList.toggle('is-label', !!l); label.textContent = l ? l.getAttribute('data-cursor') : '';
      cur.classList.toggle('is-link', !l && !!a);
    });
    $$('.magnetic').forEach(function (m) {
      m.addEventListener('mousemove', function (e) { var r = m.getBoundingClientRect(); m.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .22) + 'px,' + ((e.clientY - r.top - r.height / 2) * .3) + 'px)'; });
      m.addEventListener('mouseleave', function () { m.style.transform = ''; });
    });
  }

  /* ---------- fit footer wordmark ---------- */
  var wm = $('.wordmark');
  function fitWordmark() {
    if (!wm) return;
    wm.style.fontSize = '100px';
    var cs = getComputedStyle(wm), pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight), avail = wm.clientWidth - pad;
    var spans = $$('span', wm);
    var need = cs.flexDirection === 'column'
      ? Math.max.apply(null, spans.map(function (s) { return s.getBoundingClientRect().width; }))
      : spans.reduce(function (a, s) { return a + s.getBoundingClientRect().width; }, 0) + 25 * (spans.length - 1);
    wm.style.fontSize = Math.floor(100 * avail / need * .98) + 'px';
  }
  fitWordmark();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWordmark);
  window.addEventListener('resize', fitWordmark);

  /* ---------- scroll progress ---------- */
  var prog = $('[data-progress]');
  function onProg() { var h = document.documentElement.scrollHeight - innerHeight; prog.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')'; }
  window.addEventListener('scroll', onProg, { passive: true }); onProg();

  /* ---------- Lenis + GSAP ---------- */
  function initMotion() {
    if (reduce) return;
    if (window.Lenis) {
      var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
      window.__lenis = lenis;
      $$('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var h = a.getAttribute('href'); if (h.length < 2 || !$(h)) return;
          e.preventDefault(); lenis.scrollTo(h, { offset: h === '#top' ? -200 : -20 });
        });
      });
      if (window.gsap) { window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); window.gsap.ticker.lagSmoothing(0); }
      else (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
      if (window.ScrollTrigger) lenis.on('scroll', window.ScrollTrigger.update);
    }
    var gsap = window.gsap; if (!gsap) return;
    var ST = window.ScrollTrigger; if (ST) gsap.registerPlugin(ST);
    if (window.SplitText) gsap.registerPlugin(window.SplitText);

    // hero intro
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero__meta', { y: 20, opacity: 0, duration: .8 })
      .from('.hero__title .word, .hero__title .serif', { yPercent: 110, opacity: 0, rotate: 4, duration: 1.2, stagger: .08 }, '-=.6')
      .from('.pill-img', { scaleX: 0, duration: 1.1, stagger: .1, transformOrigin: 'left center' }, '-=1')
      .from('.hero__sub, .hero__cta > *', { y: 30, opacity: 0, duration: 1, stagger: .08 }, '-=.8')
      .from('.hero__media', { clipPath: 'inset(20% 10% 0 10% round 44px)', duration: 1.4 }, '-=1')
      .from('.badge-rotate', { scale: 0, rotate: -90, duration: 1, ease: 'back.out(1.7)' }, '-=.9')
      .from('.hotspot', { y: 30, opacity: 0, duration: .8 }, '-=.6');

    if (!ST) return;
    gsap.to('.hero__media > img', { yPercent: 10, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero__stage', start: 'top 70%', end: 'bottom top', scrub: true } });
    gsap.to('.pill-img img', { scale: 1.25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // headline reveals
    if (window.SplitText) $$('[data-reveal-text]').forEach(function (el) {
      var s = new window.SplitText(el, { type: 'lines', linesClass: 'split-line', mask: 'lines' });
      gsap.from(s.lines, { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });

    var batch = function (sel, vars) {
      var els = $$(sel); if (!els.length) return;
      gsap.set(els, Object.assign({ opacity: 0 }, vars));
      ST.batch(els, { start: 'top 90%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, x: 0, y: 0, scale: 1, duration: 1, ease: 'expo.out', stagger: .09, overwrite: true, clearProps: 'opacity,transform' }); } });
    };
    batch('.problems__tabs button', { y: 40 });
    batch('.problems__panel', { y: 60 });
    batch('.card', { y: 80 });
    batch('.stats__grid > div', { y: 40 });
    batch('.kit-item, .kit__summary', { y: 50 });
    batch('.safety__copy > *:not(.safety__title)', { y: 30 });
    batch('.rv', { x: 80 });
    batch('.promise__copy > *', { y: 30 });
    batch('.acc details', { y: 24 });
    batch('.footer__grid > div', { y: 30 });

    gsap.from('.band--orange', { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '.bands', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.band--ink', { xPercent: 8, ease: 'none', scrollTrigger: { trigger: '.bands', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.safety__img', { clipPath: 'inset(100% 0 0 0 round 400px 400px 28px 28px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.safety__visual', start: 'top 80%', once: true } });
    gsap.from('.phone', { y: 60, rotate: 8, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.safety__visual', start: 'top 70%', once: true } });
    gsap.to('.safety__pet', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.safety', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.promise__media > img', { clipPath: 'inset(0 0 100% 0 round 999px 999px 28px 28px)', duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: '.promise', start: 'top 75%', once: true } });
    gsap.from('.seal', { scale: 0, rotate: -120, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.promise', start: 'top 60%', once: true } });
    gsap.from('.final__pet', { yPercent: 30, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    gsap.from('.wordmark span', { yPercent: 100, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: '.wordmark', start: 'top 95%', once: true } });

    window.addEventListener('load', function () { ST.refresh(); });
  }
  if (document.readyState === 'complete') initMotion(); else window.addEventListener('load', initMotion);
})();
