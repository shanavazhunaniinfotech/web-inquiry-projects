/* =========================================================
   OCEAN — theme home page prototype (vanilla JS, no build)
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var U = function (id, w, h) {
    return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + w + (h ? '&h=' + h : '') + '&q=75';
  };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Demo catalogue ---------- */
  var PRODUCTS = [
    { id: 1, title: 'Tide Gel Cleanser', type: 'Face wash', benefit: 'pH 5.5 gel · sea minerals + 2% panthenol', price: 24, compare: 0, rating: 4.8, reviews: 1284, tags: ['face'], badge: 'Bestseller', sizes: ['100 ml', '200 ml'], unit: '$12.00 / 100 ml', img: '1540555700478-4be289fbecef', img2: '1590439471364-192aa70c0b53', step: 'cleanse' },
    { id: 2, title: 'Niacinamide 10% + Sea Zinc Serum', type: 'Serum', benefit: 'Refines pores and balances shine', price: 32, compare: 0, rating: 4.9, reviews: 912, tags: ['face', 'new'], badge: 'New', sizes: ['30 ml'], img: '1576426863848-c21f53c60b19', img2: '1573461160327-b450ce3d8e7f', step: 'treat' },
    { id: 3, title: 'Marine Repair Face Oil', type: 'Face oil', benefit: '5% squalane · overnight barrier repair', price: 38, compare: 46, rating: 4.7, reviews: 488, tags: ['face'], badge: 'Sale', sizes: ['30 ml'], img: '1608571423902-eed4a5ad8108', img2: '1617897903246-719242758050', step: 'treat' },
    { id: 4, title: 'Barrier Balm', type: 'Moisturiser', benefit: 'Rich, fragrance-free comfort for dry patches', price: 29, compare: 0, rating: 4.8, reviews: 655, tags: ['face'], badge: '', sizes: ['50 ml'], img: '1599305090598-fe179d501227', img2: '1609097164673-7cfafb51b926', step: 'seal' },
    { id: 5, title: 'Sea Salt Body Bar', type: 'Body', benefit: 'Plastic-free mineral bar for body and hands', price: 14, compare: 0, rating: 4.7, reviews: 1023, tags: ['body'], badge: '', sizes: ['120 g', '3 × 120 g'], unit: '$11.67 / 100 g', img: '1607006344380-b6775a0824a7', img2: '1590439471364-192aa70c0b53' },
    { id: 6, title: 'Aqua Gel Moisturiser', type: 'Moisturiser', benefit: 'Weightless 72-hour hydration', price: 34, compare: 0, rating: 4.8, reviews: 760, tags: ['face', 'new'], badge: 'New', sizes: ['50 ml'], img: '1619451334792-150fd785ee74', img2: '1609097164673-7cfafb51b926', step: 'seal' },
    { id: 7, title: 'Calm Lip Mask', type: 'Lip care', benefit: 'Overnight lip treatment with sea fennel', price: 16, compare: 0, rating: 4.6, reviews: 341, tags: ['face'], badge: 'Sold out', soldOut: true, sizes: ['15 g'], img: '1611080541599-8c6dbde6ed28', img2: '1498843053639-170ff2122f35' },
    { id: 8, title: 'Body Ritual Oil', type: 'Body', benefit: 'Dry-touch oil with squalane and kelp', price: 36, compare: 0, rating: 4.6, reviews: 274, tags: ['body'], badge: '', sizes: ['100 ml'], img: '1617897903246-719242758050', img2: '1600334129128-685c5582fd35' },
    { id: 9, title: 'Gentle Exfoliating Cleanser', type: 'Face wash', benefit: 'PHA + sea salt for smoother skin', price: 26, compare: 0, rating: 4.7, reviews: 402, tags: ['face'], badge: '', sizes: ['150 ml'], img: '1512290923902-8a9f81dc236c', img2: '1590439471364-192aa70c0b53', step: 'cleanse', hidden: true },
    { id: 10, title: 'Rose Quartz Roller', type: 'Tools', benefit: 'Cooling facial roller for serums and oils', price: 28, compare: 0, rating: 4.7, reviews: 198, tags: ['face'], badge: '', sizes: ['One size'], img: '1600428877878-1a0fd85beda8', img2: '1617897903246-719242758050', hidden: true },
    { id: 11, title: 'Gua Sha Stone', type: 'Tools', benefit: 'Rose quartz sculpting stone', price: 24, compare: 0, rating: 4.6, reviews: 143, tags: ['face'], badge: '', sizes: ['One size'], img: '1600428877878-1a0fd85beda8', img2: '1609097164673-7cfafb51b926', hidden: true }
  ];
  var byId = function (id) { return PRODUCTS.filter(function (p) { return p.id === +id; })[0]; };

  /* ---------- Money / currency (country selector) ---------- */
  var currency = { rate: 1, symbol: '$', code: 'USD' };
  function money(usd) {
    var v = usd * currency.rate;
    var s = v % 1 === 0 && usd >= 5 ? v.toFixed(0) : v.toFixed(2);
    if (usd >= 1000) s = v.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return currency.symbol + s;
  }
  function money2(usd) { return currency.symbol + (usd * currency.rate).toFixed(2); }
  function refreshMoney() {
    $$('[data-money]').forEach(function (el) { el.textContent = money(+el.getAttribute('data-money')); });
  }

  /* ---------- Storage (safe) ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- Toast ---------- */
  var toastT;
  function toast(msg) {
    var t = $('[data-toast]'); t.textContent = msg; t.classList.add('is-visible');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('is-visible'); }, 2600);
  }

  /* ---------- Overlay / drawers / modals ---------- */
  var overlay = $('[data-overlay]');
  var lastFocus = null;
  var openLayer = null;
  function openLayerEl(el, focusSel) {
    closeAll(true);
    lastFocus = document.activeElement;
    openLayer = el;
    el.hidden = false;
    if (el.classList.contains('drawer')) { overlay.hidden = false; requestAnimationFrame(function () { overlay.classList.add('is-visible'); el.classList.add('is-open'); }); }
    document.body.classList.add('lock');
    setTimeout(function () { var f = focusSel ? $(focusSel, el) : $('button, a, input', el); if (f) f.focus(); }, 60);
  }
  function closeAll(silent) {
    if (!openLayer) return;
    var el = openLayer; openLayer = null;
    if (el.classList.contains('drawer')) {
      el.classList.remove('is-open'); overlay.classList.remove('is-visible');
      setTimeout(function () { el.hidden = true; overlay.hidden = true; }, 450);
    } else { el.hidden = true; }
    document.body.classList.remove('lock');
    $$('[aria-expanded="true"][data-open-menu]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (!silent && lastFocus) lastFocus.focus();
  }
  overlay.addEventListener('click', function () { closeAll(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAll(); closeMega(); closeDropdowns(); }
    if (e.key === 'Tab' && openLayer) { // focus trap
      var f = $$('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])', openLayer).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  $$('[data-close-drawer]').forEach(function (b) { b.addEventListener('click', function () { closeAll(); }); });
  $$('[data-close-modal]').forEach(function (b) { b.addEventListener('click', function () { closeAll(); }); });
  $('#quick-view').addEventListener('click', function (e) { if (e.target.id === 'quick-view') closeAll(); });
  $('#search').addEventListener('click', function (e) { if (e.target.id === 'search') closeAll(); });

  $('[data-open-menu]').addEventListener('click', function () { this.setAttribute('aria-expanded', 'true'); openLayerEl($('#mobile-menu')); });
  $$('#mobile-menu a').forEach(function (a) { a.addEventListener('click', function () { closeAll(true); }); });

  /* ---------- Dropdowns (country / language) ---------- */
  function closeDropdowns(except) {
    $$('[data-dropdown].is-open').forEach(function (d) { if (d !== except) { d.classList.remove('is-open'); $('.dropdown__toggle', d).setAttribute('aria-expanded', 'false'); } });
  }
  $$('[data-dropdown]').forEach(function (d) {
    var t = $('.dropdown__toggle', d);
    t.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !d.classList.contains('is-open');
      closeDropdowns(d);
      d.classList.toggle('is-open', open); t.setAttribute('aria-expanded', String(open));
    });
    $$('[role="option"]', d).forEach(function (o) {
      o.addEventListener('click', function () {
        if (o.dataset.country) {
          currency = { rate: +o.dataset.rate, symbol: o.dataset.symbol, code: o.dataset.code };
          $$('[data-current-country]').forEach(function (s) { s.textContent = o.textContent; });
          $$('[data-country]').forEach(function (x) { x.setAttribute('aria-selected', String(x.dataset.country === o.dataset.country)); });
          refreshMoney(); renderGrid(); renderCart(); renderBuilder(); renderSearch($('#search-input').value);
          toast('Prices now shown in ' + currency.code);
        } else if (o.dataset.lang) {
          $$('[data-current-lang]').forEach(function (s) { s.textContent = o.dataset.lang; });
          toast('Language: ' + o.dataset.lang + ' (demo)');
        }
        closeDropdowns(); t.focus();
      });
    });
  });
  document.addEventListener('click', function () { closeDropdowns(); });

  /* ---------- Mega menu ---------- */
  var mega = $('.has-mega');
  var megaBtn = $('.nav__link', mega);
  var megaT;
  function openMega() { clearTimeout(megaT); mega.classList.add('is-open'); megaBtn.setAttribute('aria-expanded', 'true'); }
  function closeMega() { mega.classList.remove('is-open'); megaBtn.setAttribute('aria-expanded', 'false'); }
  mega.addEventListener('mouseenter', openMega);
  mega.addEventListener('mouseleave', function () { megaT = setTimeout(closeMega, 120); });
  megaBtn.addEventListener('click', function () { mega.classList.contains('is-open') ? closeMega() : openMega(); });
  mega.addEventListener('focusout', function (e) { if (!mega.contains(e.relatedTarget)) closeMega(); });
  $$('.mega a').forEach(function (a) { a.addEventListener('click', closeMega); });

  /* ---------- Header scroll state + back to top ---------- */
  var header = $('#header'), toTop = $('[data-to-top]');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    toTop.classList.toggle('is-visible', y > 900);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  /* ---------- Announcement rotation ---------- */
  var msgs = $$('.announcement__msg'), mi = 0;
  setInterval(function () {
    if (document.hidden) return;
    msgs[mi].classList.remove('is-active'); mi = (mi + 1) % msgs.length; msgs[mi].classList.add('is-active');
  }, 4500);

  /* ---------- Hero slideshow ---------- */
  var hero = $('.hero');
  var slideImgs = $$('.hero__img'), slideTexts = $$('.hero__text'), dots = $$('.hero__dot');
  var slideChip = [
    { id: 1, cta: 'Shop face wash' },
    { id: 2, cta: 'Shop the serum' },
    { id: 8, cta: 'Shop body care' }
  ];
  var si = 0, SLIDE_MS = 6500, slideTimer = null, paused = reduceMotion;
  hero.style.setProperty('--slide-ms', SLIDE_MS + 'ms');
  function goSlide(n) {
    si = (n + slideImgs.length) % slideImgs.length;
    slideImgs.forEach(function (im, i) { im.classList.toggle('is-active', i === si); });
    slideTexts.forEach(function (t, i) { t.classList.toggle('is-active', i === si); t.setAttribute('aria-hidden', String(i !== si)); });
    dots.forEach(function (d, i) {
      d.classList.remove('is-active'); void d.offsetWidth; // restart progress animation
      d.classList.toggle('is-active', i === si); d.setAttribute('aria-selected', String(i === si));
    });
    var p = byId(slideChip[si].id);
    $('[data-chip-img]').src = U(p.img, 160, 160);
    $('[data-chip-name]').textContent = p.title.replace(' + Sea Zinc', '');
    var cp = $('[data-chip-price]'); cp.setAttribute('data-money', p.price); cp.textContent = money(p.price);
    var ca = $('[data-chip-add]'); ca.dataset.add = p.id; ca.setAttribute('aria-label', 'Add ' + p.title + ' to cart');
    $('[data-hero-cta]').textContent = slideChip[si].cta;
    schedule();
  }
  function schedule() { clearTimeout(slideTimer); if (!paused) slideTimer = setTimeout(function () { goSlide(si + 1); }, SLIDE_MS); }
  dots.forEach(function (d, i) { d.addEventListener('click', function () { goSlide(i); }); });
  var pauseBtn = $('[data-hero-pause]');
  function setPaused(v) {
    paused = v; hero.classList.toggle('is-paused', v);
    pauseBtn.setAttribute('aria-label', v ? 'Play slideshow' : 'Pause slideshow');
    schedule();
  }
  pauseBtn.addEventListener('click', function () { setPaused(!paused); });
  setPaused(paused);
  // swipe on mobile
  (function () {
    var x0 = null, media = $('.hero__media');
    media.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    media.addEventListener('touchend', function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) goSlide(si + (dx < 0 ? 1 : -1)); x0 = null;
    });
  })();

  /* ---------- Product cards / grid ---------- */
  var activeTab = 'all';
  var cardSize = {};
  function stars(r) { var f = Math.round(r); return '★★★★★'.slice(0, f) + '☆☆☆☆☆'.slice(0, 5 - f); }
  function badgeHTML(p) {
    if (p.soldOut) return '<span class="badge badge--sold">Sold out</span>';
    if (p.compare) return '<span class="badge badge--sale">Save ' + money(p.compare - p.price) + '</span>';
    if (p.badge === 'New') return '<span class="badge badge--new">New</span>';
    if (p.badge) return '<span class="badge">' + p.badge + '</span>';
    return '';
  }
  function cardHTML(p, i) {
    var sizes = p.sizes.length > 1 ? '<div class="card__sizes" role="group" aria-label="Size">' + p.sizes.map(function (s, k) {
      return '<button class="size' + ((cardSize[p.id] || 0) === k ? ' is-active' : '') + '" data-size="' + p.id + ':' + k + '" aria-pressed="' + ((cardSize[p.id] || 0) === k) + '">' + s + '</button>';
    }).join('') + '</div>' : '';
    return '<li class="card" style="animation-delay:' + (i * 70) + 'ms">' +
      '<div class="card__media">' +
        '<div class="card__badges">' + badgeHTML(p) + '</div>' +
        '<img src="' + U(p.img, 700, 770) + '" srcset="' + U(p.img, 400, 440) + ' 400w, ' + U(p.img, 700, 770) + ' 700w" sizes="(min-width: 1200px) 25vw, (min-width: 750px) 33vw, 50vw" alt="' + p.title + ', ' + p.type.toLowerCase() + '" width="700" height="770" loading="lazy">' +
        '<img class="card__img2" src="' + U(p.img2, 700, 770) + '" alt="" width="700" height="770" loading="lazy">' +
        '<button class="card__quick" aria-label="Quick view ' + p.title + '" data-quick="' + p.id + '"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></button>' +
        '<button class="card__add" data-add="' + p.id + '"' + (p.soldOut ? ' disabled' : '') + '>' + (p.soldOut ? 'Sold out' : 'Quick add · ' + money(p.price)) + '</button>' +
      '</div>' +
      '<div class="card__body">' +
        '<div class="card__top"><span class="card__type">' + p.type + '</span><span><span class="stars" aria-hidden="true">★</span> ' + p.rating + ' <span class="visually-hidden">out of 5,</span><span class="rc">(' + p.reviews.toLocaleString() + ')</span></span></div>' +
        '<h3 class="card__title"><a href="#featured" data-quick="' + p.id + '">' + p.title + '</a></h3>' +
        '<p class="card__benefit">' + p.benefit + '</p>' +
        '<div class="card__price">' + (p.compare ? '<strong class="is-sale">' + money(p.price) + '</strong><s>' + money(p.compare) + '</s>' : '<strong>' + money(p.price) + '</strong>') +
          (p.unit ? '<span class="card__unit">' + p.unit.replace('$', currency.symbol) + '</span>' : '') + '</div>' +
        sizes +
      '</div></li>';
  }
  function renderGrid() {
    var list = PRODUCTS.filter(function (p) { return !p.hidden && (activeTab === 'all' || p.tags.indexOf(activeTab) > -1); });
    if (activeTab === 'all') list = list.slice(0, 8);
    $('#product-grid').innerHTML = list.map(cardHTML).join('');
  }
  function setTab(name) {
    activeTab = name;
    $$('.tab').forEach(function (t) { var on = t.dataset.tab === name; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', String(on)); });
    renderGrid();
  }
  $$('.tab').forEach(function (t) { t.addEventListener('click', function () { setTab(t.dataset.tab); }); });
  $$('[data-tab-jump]').forEach(function (a) { a.addEventListener('click', function () { setTab(a.dataset.tabJump); }); });
  $$('[data-filter-link]').forEach(function (a) { a.addEventListener('click', function () { setTab(a.dataset.filterLink); }); });

  /* ---------- Global click delegation ---------- */
  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add && !add.disabled) { e.preventDefault(); addToCart(+add.dataset.add, 1, add.dataset.sizeIndex); flyFrom(add); return; }
    var q = e.target.closest('[data-quick]');
    if (q) { e.preventDefault(); openQuick(+q.dataset.quick); return; }
    var sz = e.target.closest('[data-size]');
    if (sz) { var parts = sz.dataset.size.split(':'); cardSize[+parts[0]] = +parts[1]; renderGrid(); return; }
    var sc = e.target.closest('[data-scroll]');
    if (sc) { var tr = $(sc.dataset.scroll); tr.scrollBy({ left: +sc.dataset.dir * tr.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' }); }
  });

  function flyFrom(btn) {
    if (reduceMotion) return;
    var src = btn.closest('.card, .hero__chip, .up, .hotspot-card, .qv');
    var img = src ? $('img', src) : null; var cart = $('.cart-btn');
    if (!img || !cart) return;
    var a = img.getBoundingClientRect(), b = cart.getBoundingClientRect();
    var g = img.cloneNode(); g.removeAttribute('srcset');
    g.style.cssText = 'position:fixed;z-index:200;left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px;object-fit:cover;border-radius:16px;pointer-events:none;transition:transform .8s cubic-bezier(.5,-.1,.2,1),opacity .8s;';
    document.body.appendChild(g);
    requestAnimationFrame(function () {
      var s = 24 / a.width;
      g.style.transform = 'translate(' + (b.left + b.width / 2 - a.left - a.width / 2) + 'px,' + (b.top + b.height / 2 - a.top - a.height / 2) + 'px) scale(' + s + ')';
      g.style.opacity = '.3';
    });
    setTimeout(function () { g.remove(); }, 820);
  }

  /* ---------- Quick view ---------- */
  function openQuick(id) {
    var p = byId(id); if (!p) return;
    var sel = cardSize[p.id] || 0;
    $('[data-qv]').innerHTML =
      '<div class="qv__media"><img src="' + U(p.img, 900, 900) + '" alt="' + p.title + '" width="900" height="900"></div>' +
      '<div class="qv__body">' +
        '<p class="eyebrow" style="margin:0">' + p.type + '</p>' +
        '<h2 class="qv__title" id="qv-title">' + p.title + '</h2>' +
        '<p><span class="stars">' + stars(p.rating) + '</span> <span class="muted">' + p.rating + ' · ' + p.reviews.toLocaleString() + ' reviews</span></p>' +
        '<p class="qv__price">' + money(p.price) + (p.compare ? ' <s>' + money(p.compare) + '</s>' : '') + '</p>' +
        '<p class="qv__installments">Pay in 4 interest-free instalments of ' + money2(p.price / 4) + ' with <b>Shop Pay</b></p>' +
        '<p class="muted">' + p.benefit + '. Dermatologist tested, fragrance-free and suitable for sensitive skin.</p>' +
        '<p class="qv__label">Size</p><div class="qv__row" role="group" aria-label="Size">' + p.sizes.map(function (s, k) { return '<button class="size' + (k === sel ? ' is-active' : '') + '" aria-pressed="' + (k === sel) + '" data-qv-size="' + k + '">' + s + '</button>'; }).join('') + '</div>' +
        '<div class="qv__actions">' + (p.soldOut ? '<button class="btn btn--primary" disabled>Sold out</button>' : '<button class="btn btn--primary" data-add="' + p.id + '" data-size-index="' + sel + '">Add to cart · ' + money(p.price) + '</button>') + '</div>' +
        '<ul class="ticks ticks--small"><li>Free shipping over ' + money(60) + '</li><li>60-day returns</li></ul>' +
      '</div>';
    $$('[data-qv-size]').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-qv-size]').forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-pressed', 'false'); });
        b.classList.add('is-active'); b.setAttribute('aria-pressed', 'true');
        var a = $('.qv [data-add]'); if (a) a.dataset.sizeIndex = b.dataset.qvSize;
      });
    });
    openLayerEl($('#quick-view'), '.modal__close');
  }

  /* ---------- Cart ---------- */
  var cart = store.get('ocean-cart', []);
  var FREE_SHIP = 60;
  var UPSELL_ORDER = [2, 4, 6, 5, 3, 8, 1];
  function lineKey(id, sizeIdx) { return id + ':' + (sizeIdx || 0); }
  function addToCart(id, qty, sizeIdx, opts) {
    var p = byId(id); if (!p || p.soldOut) return;
    sizeIdx = +(sizeIdx !== undefined ? sizeIdx : (cardSize[id] || 0));
    var key = lineKey(id, sizeIdx) + (opts && opts.bundle ? ':b' : '');
    var line = cart.filter(function (l) { return l.key === key; })[0];
    if (line) line.qty += qty; else cart.push({ key: key, id: id, size: sizeIdx, qty: qty, bundle: !!(opts && opts.bundle) });
    save(); renderCart();
    var c = $('[data-cart-count]'); c.classList.add('bump'); setTimeout(function () { c.classList.remove('bump'); }, 300);
    if (!(opts && opts.silent)) { closeAll(true); setTimeout(function () { openLayerEl($('#cart-drawer'), '[data-close-drawer]'); }, 120); }
  }
  function save() { store.set('ocean-cart', cart); }
  function linePrice(l) { var p = byId(l.id); var mult = p.sizes.length > 1 && l.size === 1 ? (p.id === 5 ? 2.6 : 1.7) : 1; return p.price * mult; }
  function totals() {
    var sub = 0, bundle = 0;
    cart.forEach(function (l) { var lp = linePrice(l) * l.qty; sub += lp; if (l.bundle) bundle += lp * 0.15; });
    if ($('[data-gift]').checked) sub += 5;
    return { sub: sub, bundle: bundle, total: sub - bundle, count: cart.reduce(function (a, l) { return a + l.qty; }, 0) };
  }
  function renderCart() {
    var t = totals();
    $('[data-cart-count]').textContent = t.count;
    $('[data-cart-count-label]').textContent = '(' + t.count + ')';
    $('[data-cart-empty]').hidden = cart.length > 0;
    $('[data-cart-lines]').innerHTML = cart.map(function (l) {
      var p = byId(l.id);
      return '<li class="line">' +
        '<img src="' + U(p.img, 200, 230) + '" alt="' + p.title + '" width="88" height="100" loading="lazy">' +
        '<div><p class="line__title">' + p.title + '</p><p class="line__meta">Size: ' + p.sizes[l.size] + '</p>' +
        (l.bundle ? '<span class="line__tag">Routine bundle −15%</span>' : '') +
        '<div class="qty" role="group" aria-label="Quantity for ' + p.title + '"><button aria-label="Decrease quantity" data-qty="' + l.key + ':-1">−</button><span>' + l.qty + '</span><button aria-label="Increase quantity" data-qty="' + l.key + ':1">+</button></div></div>' +
        '<div class="line__right"><span class="line__price">' + money2(linePrice(l) * l.qty) + '</span><button class="line__remove" data-remove="' + l.key + '">Remove</button></div>' +
      '</li>';
    }).join('');

    // Shipping meter + perks
    var left = Math.max(0, FREE_SHIP - t.total);
    $('[data-ship-text]').innerHTML = left > 0
      ? 'You\'re <strong>' + money2(left) + '</strong> away from free shipping'
      : '<strong>You\'ve unlocked free shipping</strong> 🌊';
    $('[data-ship-bar]').style.width = Math.min(100, t.total / 90 * 100) + '%';
    $$('[data-perk]').forEach(function (li) { li.classList.toggle('is-on', t.total >= +li.dataset.perk); });

    // Totals
    $('[data-cart-subtotal]').textContent = money2(t.sub);
    $('[data-bundle-row]').hidden = t.bundle <= 0;
    $('[data-cart-discount]').textContent = '−' + money2(t.bundle);
    $('[data-cart-total]').textContent = money2(t.total);
    $('[data-checkout]').disabled = cart.length === 0;

    // Upsells: products not in cart, in a sensible "complete the routine" order
    var inCart = cart.map(function (l) { return l.id; });
    var ups = UPSELL_ORDER.map(byId).filter(function (p) { return inCart.indexOf(p.id) === -1 && !p.soldOut; }).slice(0, 4);
    $('[data-upsell]').hidden = ups.length === 0;
    var why = { 1: 'Step 1 · start every routine', 2: 'Pairs with any cleanser', 3: 'Night-time repair', 4: 'Seals in your serum', 5: 'Customers also add', 6: 'Lightweight daily hydration', 8: 'For body after the shower' };
    $('[data-upsell-track]').innerHTML = ups.map(function (p) {
      return '<li class="up"><img src="' + U(p.img, 160, 160) + '" alt="' + p.title + '" width="64" height="64" loading="lazy">' +
        '<div><p class="up__name">' + p.title + '</p><p class="up__why">' + (why[p.id] || '') + '</p><p class="up__price">' + money(p.price) + '</p></div>' +
        '<button class="up__add" data-add="' + p.id + '" aria-label="Add ' + p.title + ' to cart">Add</button></li>';
    }).join('');
  }
  $('#cart-drawer').addEventListener('click', function (e) {
    var q = e.target.closest('[data-qty]');
    if (q) {
      var parts = q.dataset.qty.split(':'), d = +parts.pop(), key = parts.join(':');
      cart.forEach(function (l) { if (l.key === key) l.qty += d; });
      cart = cart.filter(function (l) { return l.qty > 0; }); save(); renderCart(); return;
    }
    var r = e.target.closest('[data-remove]');
    if (r) { cart = cart.filter(function (l) { return l.key !== r.dataset.remove; }); save(); renderCart(); toast('Removed from your bag'); }
  });
  $('[data-gift]').addEventListener('change', renderCart);
  $$('[data-open-cart]').forEach(function (b) { b.addEventListener('click', function () { openLayerEl($('#cart-drawer'), '[data-close-drawer]'); }); });
  $('[data-checkout]').addEventListener('click', function () { toast('Checkout is handled by Shopify in the live theme'); });
  $$('.accel__btn').forEach(function (b) { b.addEventListener('click', function () { toast('Accelerated checkout runs on Shopify'); }); });

  /* ---------- Routine builder ---------- */
  var STEPS = [
    { key: 'cleanse', title: 'Cleanse', ids: [1, 9] },
    { key: 'treat', title: 'Treat', ids: [2, 3] },
    { key: 'seal', title: 'Moisturise', ids: [6, 4] }
  ];
  var picked = { cleanse: 1, treat: null, seal: null };
  function renderBuilder() {
    $('#builder-steps').innerHTML = STEPS.map(function (s, i) {
      return '<div class="bstep' + (picked[s.key] ? ' is-done' : '') + '">' +
        '<div class="bstep__head"><span class="bstep__num">' + (picked[s.key] ? '✓' : i + 1) + '</span><p class="bstep__title">Step ' + (i + 1) + ' · ' + s.title + '</p></div>' +
        '<div class="bstep__opts">' + s.ids.map(function (id) {
          var p = byId(id);
          return '<button class="bopt" aria-pressed="' + (picked[s.key] === id) + '" data-pick="' + s.key + ':' + id + '">' +
            '<img src="' + U(p.img, 160, 160) + '" alt="" width="64" height="64" loading="lazy">' +
            '<span><strong>' + p.title + '</strong><span>' + money(p.price) + ' · ' + p.type + '</span></span><span class="bopt__check" aria-hidden="true"></span></button>';
        }).join('') + '</div></div>';
    }).join('');
    var full = 0, n = 0;
    $('#builder-picked').innerHTML = STEPS.map(function (s) {
      var p = picked[s.key] ? byId(picked[s.key]) : null;
      if (!p) return '<li class="is-empty">Choose a product to ' + s.title.toLowerCase() + '</li>';
      full += p.price; n++;
      return '<li><img src="' + U(p.img, 100, 100) + '" alt="" width="40" height="40"><span>' + p.title + '</span><span>' + money(p.price) + '</span></li>';
    }).join('');
    var done = n === STEPS.length;
    $('#builder-compare').textContent = money2(full);
    $('#builder-compare').style.visibility = done ? 'visible' : 'hidden';
    $('#builder-total').textContent = money2(done ? full * 0.85 : full);
    $('#builder-save').textContent = done ? 'You save ' + money2(full * 0.15) + ' with the bundle' : 'Choose ' + (STEPS.length - n) + ' more step' + (STEPS.length - n > 1 ? 's' : '') + ' to unlock 15% off';
    $('#builder-add').disabled = !done;
  }
  $('#builder-steps').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pick]'); if (!b) return;
    var parts = b.dataset.pick.split(':'); picked[parts[0]] = +parts[1]; renderBuilder();
    var again = $('[data-pick="' + b.dataset.pick + '"]'); if (again) again.focus();
  });
  $('#builder-add').addEventListener('click', function () {
    STEPS.forEach(function (s) { addToCart(picked[s.key], 1, 0, { bundle: true, silent: true }); });
    toast('Routine added, 15% bundle discount applied');
    openLayerEl($('#cart-drawer'), '[data-close-drawer]');
  });

  /* ---------- Hotspots (shop the look) ---------- */
  var hsCard = $('[data-hotspot-card]');
  $$('[data-hotspot]').forEach(function (h) {
    h.addEventListener('click', function (e) {
      e.stopPropagation();
      var p = byId(h.dataset.hotspot), was = h.classList.contains('is-active');
      $$('[data-hotspot]').forEach(function (x) { x.classList.remove('is-active'); });
      if (was) { hsCard.hidden = true; return; }
      h.classList.add('is-active');
      hsCard.innerHTML = '<img src="' + U(p.img, 160, 160) + '" alt="" width="72" height="72"><div><strong>' + p.title + '</strong><p>' + money(p.price) + ' · ' + p.type + '</p>' +
        '<p><a href="#featured" data-quick="' + p.id + '" style="text-decoration:underline">Quick view</a></p></div>' +
        (p.soldOut ? '<span class="badge badge--sold">Sold out</span>' : '<button class="hotspot-card__add" data-add="' + p.id + '" aria-label="Add ' + p.title + ' to cart">+</button>');
      var m = h.parentElement.getBoundingClientRect(), r = h.getBoundingClientRect();
      var x = r.left - m.left + 30, y = r.top - m.top - 20;
      if (x + 290 > m.width) x = r.left - m.left - 290;
      hsCard.style.left = Math.max(8, x) + 'px'; hsCard.style.top = Math.max(8, y) + 'px';
      hsCard.hidden = false;
    });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('[data-hotspot-card]') && !e.target.closest('[data-hotspot]')) { hsCard.hidden = true; $$('[data-hotspot]').forEach(function (x) { x.classList.remove('is-active'); }); } });

  /* ---------- Predictive search ---------- */
  var sInput = $('#search-input');
  function hl(text, q) { if (!q) return text; var i = text.toLowerCase().indexOf(q.toLowerCase()); return i < 0 ? text : text.slice(0, i) + '<mark>' + text.slice(i, i + q.length) + '</mark>' + text.slice(i + q.length); }
  function renderSearch(q) {
    q = (q || '').trim();
    var res = PRODUCTS.filter(function (p) { return !q || (p.title + ' ' + p.type + ' ' + p.benefit + ' ' + p.tags.join(' ')).toLowerCase().indexOf(q.toLowerCase()) > -1; });
    if (!q) res = res.filter(function (p) { return !p.hidden; }).slice(0, 4);
    $('[data-search-title]').textContent = q ? res.length + ' product' + (res.length === 1 ? '' : 's') + ' for "' + q + '"' : 'Trending products';
    $('[data-search-products]').innerHTML = res.length ? res.slice(0, 8).map(function (p) {
      return '<li><button class="sp" data-quick="' + p.id + '"><img src="' + U(p.img, 400, 400) + '" alt="" width="200" height="200" loading="lazy"><strong>' + hl(p.title, q) + '</strong><span>' + money(p.price) + ' · ' + p.type + '</span></button></li>';
    }).join('') : '<li class="search-empty">No results for "' + q.replace(/</g, '&lt;') + '". Try "cleanser" or "body".</li>';
  }
  sInput.addEventListener('input', function () { renderSearch(sInput.value); });
  $$('[data-open-search]').forEach(function (b) { b.addEventListener('click', function () { renderSearch(sInput.value); openLayerEl($('#search'), '#search-input'); }); });
  $('[data-close-search]').addEventListener('click', function () { closeAll(); });
  $$('[data-suggest]').forEach(function (b) { b.addEventListener('click', function () { sInput.value = b.dataset.suggest; renderSearch(sInput.value); sInput.focus(); }); });

  /* ---------- Newsletter ---------- */
  $('[data-newsletter]').addEventListener('submit', function (e) {
    e.preventDefault();
    var inp = $('#nl-email'), msg = $('.newsletter__msg');
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim());
    msg.classList.toggle('is-error', !ok);
    inp.setAttribute('aria-invalid', String(!ok));
    msg.textContent = ok ? 'You\'re on the Tide List. Check your inbox for your 10% code.' : 'Please enter a valid email address.';
    if (ok) inp.value = '';
  });

  /* ---------- Statement: words light up on scroll ---------- */
  (function () {
    var el = $('[data-words]'); if (!el) return;
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType !== 3 || !n.textContent.trim()) return;
      var frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(function (w) {
        if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
        var s = document.createElement('span'); s.className = 'w'; s.textContent = w; frag.appendChild(s);
      });
      el.replaceChild(frag, n);
    });
    var words = $$('.w', el);
    if (reduceMotion) { words.forEach(function (w) { w.classList.add('is-lit'); }); return; }
    function lit() {
      var r = el.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      var n = Math.round(p * words.length);
      words.forEach(function (w, i) { w.classList.toggle('is-lit', i < n); });
    }
    window.addEventListener('scroll', lit, { passive: true }); lit();
  })();

  /* ---------- Count-up numbers ---------- */
  function countUp(el) {
    var to = +el.dataset.count, t0 = null, dur = 1200;
    if (reduceMotion) { el.textContent = to; return; }
    function step(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  /* ---------- Reveal on scroll ---------- */
  var revealSel = '.section-head, .concern-track > li, .statement .center, .shoppable__media, .shoppable__copy, .ingredient, .bstep, .builder__summary, .body-feature__media, .body-feature__copy, .review, .post, .faq > div, .faq__list details, .newsletter__card, .footer__top > *';
  var targets = $$(revealSel);
  if ('IntersectionObserver' in window && !reduceMotion) {
    targets.forEach(function (el, i) { el.classList.add('reveal'); el.style.transitionDelay = ((i % 4) * 70) + 'ms'; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); io2.unobserve(en.target); } });
    }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { io2.observe(el); });
  } else { $$('[data-count]').forEach(function (el) { el.textContent = el.dataset.count; }); }

  /* ---------- Light parallax ---------- */
  var para = $$('.parallax');
  if (para.length && !reduceMotion) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        para.forEach(function (im) { var r = im.parentElement.getBoundingClientRect(); var off = Math.max(-30, Math.min(30, (r.top + r.height / 2 - innerHeight / 2) * -0.05)); im.style.transform = 'translateY(' + off.toFixed(1) + 'px) scale(1.08)'; });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Theme settings demo panel ---------- */
  var sToggle = $('[data-settings-toggle]'), sPanel = $('#settings-panel');
  sToggle.addEventListener('click', function (e) { e.stopPropagation(); var open = sPanel.hidden; sPanel.hidden = !open; sToggle.setAttribute('aria-expanded', String(open)); });
  sPanel.addEventListener('click', function (e) { e.stopPropagation(); });
  document.addEventListener('click', function () { if (!sPanel.hidden) { sPanel.hidden = true; sToggle.setAttribute('aria-expanded', 'false'); } });
  var prefs = store.get('ocean-prefs', { scheme: 'ocean', corners: 'rounded', sections: false });
  function applyPrefs() {
    document.documentElement.setAttribute('data-scheme', prefs.scheme);
    document.documentElement.setAttribute('data-corners', prefs.corners);
    document.body.classList.toggle('show-sections', !!prefs.sections);
    $$('input[name="scheme"]').forEach(function (i) { i.checked = i.value === prefs.scheme; });
    $$('input[name="corners"]').forEach(function (i) { i.checked = i.value === prefs.corners; });
    $('[data-show-sections]').checked = !!prefs.sections;
  }
  $$('input[name="scheme"], input[name="corners"]').forEach(function (i) { i.addEventListener('change', function () { prefs[i.name] = i.value; store.set('ocean-prefs', prefs); applyPrefs(); }); });
  $('[data-show-sections]').addEventListener('change', function () { prefs.sections = this.checked; store.set('ocean-prefs', prefs); applyPrefs(); });
  applyPrefs();

  /* ---------- Init ---------- */
  refreshMoney();
  renderGrid();
  renderCart();
  renderBuilder();
})();
