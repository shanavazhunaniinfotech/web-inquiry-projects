/* MK Commerce home page prototype — interactions */
(function () {
  'use strict';

  var STORE = 'https://mkcommerceds.com/products/';
  var FREE_SHIP = 35;

  var PRODUCTS = {
    brush: {
      name: 'One-Click Self-Cleaning Brush', short: 'One-Click Brush', price: 16.39,
      imgs: ['images/brush-1.webp', 'images/brush-2.webp'], badge: 'Best seller',
      rating: 4.9, reviews: 312, benefit: 'Catches loose undercoat hair, then releases it in one click. No more picking fur out by hand.',
      handle: 'pet-cat-comb',
      variants: [{ name: 'Blue', c: '#8fcbe8' }, { name: 'Grey', c: '#a7abb1' }, { name: 'Pink', c: '#f4b8c9' }]
    },
    glove: {
      name: '2-in-1 Deshedding Grooming Glove', short: 'Grooming Glove', price: 22.65,
      imgs: ['images/glove-1.webp', 'images/glove-4.webp'], badge: 'Cats love it', badgeBlue: true,
      rating: 4.8, reviews: 187, benefit: 'Feels like petting, works like a deshedder. Also lifts hair off sofas and car seats.',
      handle: '2-in-1-pet-grooming-glove-double-sided-deshedding-massage-brush-for-cats-or-dogs-removes-loose-hair-from-fur-furniture-ultra-soft-easy-clean-mitt-single-glove-1',
      variants: [{ name: 'Blue', c: '#9fd0ea' }]
    },
    collar: {
      name: 'AirTag Reflective Safety Collar', short: 'AirTag Collar', price: 19.26,
      imgs: ['images/collar-1.webp', 'images/collar-4.webp'], badge: 'Peace of mind',
      rating: 4.8, reviews: 241, benefit: 'Waterproof AirTag holder, reflective stitching for night walks and a bonus bell.',
      handle: 'reflective-collar-waterproof-holder-case-for-airtag-air-tag-airtags-protective-cover-cat-dog-kitten-puppy-nylon-collar',
      variants: [
        { name: 'Purple', c: '#8c6ad8', price: 19.26, img: 'images/collar-1.webp' },
        { name: 'Black', c: '#222222', price: 19.04, img: 'images/collar-4.webp' },
        { name: 'Yellow', c: '#f2c31b', price: 24.34, img: 'images/collar-3.webp' },
        { name: 'Sky Blue', c: '#6fc3e6', price: 20.40, img: 'images/collar-2.webp' }
      ]
    },
    bundle: {
      name: 'Shed-Free Grooming Duo', short: 'Grooming Duo', price: 33.18,
      imgs: ['images/glove-1.webp'], variants: [{ name: 'Brush + Glove' }]
    }
  };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + n.toFixed(2); };
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };
  var session = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  var starsSvg = function (n) {
    var out = '';
    for (var i = 1; i <= 5; i++) out += '<svg' + (i > Math.round(n) ? ' class="off"' : '') + '><use href="#i-star"/></svg>';
    return out;
  };

  /* ---------- Toast ---------- */
  var toastEl = $('[data-toast]'), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2600);
  }

  /* ---------- Announcement rotator ---------- */
  var msgs = $$('.announce__msg'), mi = 0;
  if (msgs.length > 1) setInterval(function () {
    msgs[mi].classList.remove('is-active');
    mi = (mi + 1) % msgs.length;
    msgs[mi].classList.add('is-active');
  }, 4500);

  /* ---------- Copy code chips ---------- */
  document.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-copy]');
    if (!chip) return;
    var code = chip.getAttribute('data-copy');
    var done = function () { toast('Code ' + code + ' copied. Paste it at checkout.'); };
    if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, done); else done();
  });

  /* ---------- Header ---------- */
  var header = $('#header');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var menuBtn = $('.header__menu'), mobileNav = $('#mobileNav');
  menuBtn.addEventListener('click', function () {
    var open = menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', open);
    mobileNav.classList.toggle('is-open', open);
  });
  $$('a', mobileNav).forEach(function (a) { a.addEventListener('click', function () { menuBtn.setAttribute('aria-expanded', 'false'); mobileNav.classList.remove('is-open'); }); });

  /* ---------- Search ---------- */
  var searchBar = $('.search-bar'), searchInput = $('[data-search-input]'), searchRes = $('[data-search-results]');
  $('[data-search]').addEventListener('click', function () {
    searchBar.hidden = !searchBar.hidden;
    if (!searchBar.hidden) { searchInput.focus(); renderSearch(''); }
  });
  function renderSearch(q) {
    q = q.trim().toLowerCase();
    var keys = ['brush', 'glove', 'collar'].filter(function (k) {
      var p = PRODUCTS[k];
      return !q || (p.name + ' ' + p.benefit + ' ' + k).toLowerCase().indexOf(q) > -1;
    });
    searchRes.innerHTML = keys.length ? keys.map(function (k) {
      var p = PRODUCTS[k];
      return '<a href="#p-' + k + '"><img src="' + p.imgs[0] + '" alt=""><span><strong>' + p.name + '</strong><br><small>' + money(p.price) + '</small></span></a>';
    }).join('') : '<p>No products match "' + q.replace(/</g, '&lt;') + '". Try "brush", "glove" or "collar".</p>';
  }
  searchInput.addEventListener('input', function () { renderSearch(searchInput.value); });
  searchRes.addEventListener('click', function (e) { if (e.target.closest('a')) searchBar.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { searchBar.hidden = true; closeCart(); closeModal(); } });

  /* ---------- Product grid ---------- */
  var grid = $('[data-product-grid]');
  var selected = { brush: 0, glove: 0, collar: 0, bundle: 0 };
  grid.innerHTML = ['brush', 'glove', 'collar'].map(function (k) {
    var p = PRODUCTS[k];
    var sw = p.variants.length > 1 ? '<div class="product__swatches" role="radiogroup" aria-label="Colour">' + p.variants.map(function (v, i) {
      return '<button style="--c:' + v.c + '" class="' + (i === 0 ? 'is-active' : '') + '" role="radio" aria-checked="' + (i === 0) + '" aria-label="' + v.name + '" data-variant="' + k + ':' + i + '"></button>';
    }).join('') + '<span data-variant-name="' + k + '">' + p.variants[0].name + '</span></div>' : '<div class="product__swatches"><span style="margin:0">Single glove · ' + p.variants[0].name + '</span></div>';
    return '<article class="product" id="p-' + k + '" data-reveal>' +
      '<a class="product__media" href="' + STORE + p.handle + '" target="_blank" rel="noopener" aria-label="View ' + p.name + '">' +
        '<span class="product__badge' + (p.badgeBlue ? ' product__badge--blue' : '') + '">' + p.badge + '</span>' +
        '<img src="' + p.imgs[0] + '" alt="' + p.name + '" loading="lazy" width="800" height="800" data-card-img="' + k + '">' +
        '<img src="' + p.imgs[1] + '" alt="" loading="lazy" width="800" height="800">' +
      '</a>' +
      '<div class="product__body">' +
        '<div class="product__rating"><span class="stars" aria-label="' + p.rating + ' out of 5 stars">' + starsSvg(p.rating) + '</span>' + p.rating + ' (' + p.reviews + ' reviews)</div>' +
        '<h3 class="product__title"><a href="' + STORE + p.handle + '" target="_blank" rel="noopener">' + p.name + '</a></h3>' +
        '<p class="product__benefit">' + p.benefit + '</p>' + sw +
        '<div class="product__foot"><div class="product__price" data-card-price="' + k + '">' + money(p.price) + '<small>Ships free over $35</small></div>' +
        '<button class="btn btn--primary" data-add="' + k + '">Add to cart</button></div>' +
      '</div></article>';
  }).join('');

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-variant]');
    if (!b) return;
    var parts = b.getAttribute('data-variant').split(':'), k = parts[0], i = +parts[1], p = PRODUCTS[k], v = p.variants[i];
    selected[k] = i;
    $$('[data-variant^="' + k + ':"]', grid).forEach(function (x) { x.classList.toggle('is-active', x === b); x.setAttribute('aria-checked', x === b); });
    $('[data-variant-name="' + k + '"]', grid).textContent = v.name;
    if (v.img) $('[data-card-img="' + k + '"]', grid).src = v.img;
    if (v.price) $('[data-card-price="' + k + '"]', grid).firstChild.nodeValue = money(v.price);
    if (k === 'collar') syncCollarSpotlight(i);
  });

  /* ---------- Collar spotlight swatches ---------- */
  var spotSwatches = $$('.safety .swatch');
  function syncCollarSpotlight(i) {
    var v = PRODUCTS.collar.variants[i];
    spotSwatches.forEach(function (s) {
      var on = s.getAttribute('data-name') === v.name;
      s.classList.toggle('is-active', on); s.setAttribute('aria-checked', on);
    });
    var img = $('[data-swatch-img]');
    img.style.opacity = 0;
    setTimeout(function () { img.src = v.img; img.alt = v.name + ' AirTag reflective collar'; img.style.opacity = 1; }, 180);
    $('[data-swatch-name]').textContent = v.name;
    $('.safety .price-lg').textContent = money(v.price);
  }
  spotSwatches.forEach(function (s) {
    s.addEventListener('click', function () {
      var name = s.getAttribute('data-name');
      var i = PRODUCTS.collar.variants.findIndex(function (v) { return v.name === name; });
      selected.collar = i;
      syncCollarSpotlight(i);
      var gridBtn = $('[data-variant="collar:' + i + '"]', grid);
      if (gridBtn) {
        $$('[data-variant^="collar:"]', grid).forEach(function (x) { x.classList.toggle('is-active', x === gridBtn); x.setAttribute('aria-checked', x === gridBtn); });
        $('[data-variant-name="collar"]', grid).textContent = name;
        $('[data-card-img="collar"]', grid).src = PRODUCTS.collar.variants[i].img;
        $('[data-card-price="collar"]', grid).firstChild.nodeValue = money(PRODUCTS.collar.variants[i].price);
      }
    });
  });
  // keep spotlight in sync with initial selection order (Purple first)
  $('.safety .price-lg').textContent = 'From ' + money(19.04);

  /* ---------- Cart ---------- */
  var cart = store.get('mk-cart') || [];
  var drawer = $('[data-drawer]'), overlay = $('[data-overlay]');
  var lastFocus = null;

  function priceOf(item) {
    var p = PRODUCTS[item.k], v = p.variants[item.v] || {};
    return v.price || p.price;
  }
  function addToCart(k, btn) {
    var v = selected[k] || 0;
    var found = cart.find(function (i) { return i.k === k && i.v === v; });
    if (found) found.q++; else cart.push({ k: k, v: v, q: 1 });
    save();
    if (btn) {
      var html = btn.innerHTML;
      btn.classList.add('is-added'); btn.innerHTML = '<svg><use href="#i-check"/></svg> Added';
      setTimeout(function () { btn.classList.remove('is-added'); btn.innerHTML = html; }, 1400);
    }
    var badge = $('[data-cart-count]');
    badge.classList.add('bump'); setTimeout(function () { badge.classList.remove('bump'); }, 250);
    setTimeout(openCart, 350);
  }
  function save() { store.set('mk-cart', cart); render(); }
  function render() {
    var count = cart.reduce(function (a, i) { return a + i.q; }, 0);
    var total = cart.reduce(function (a, i) { return a + priceOf(i) * i.q; }, 0);
    $('[data-cart-count]').textContent = count;
    $('[data-cart-count-text]').textContent = count ? '(' + count + ')' : '';
    $('[data-cart-total]').textContent = money(total);

    var left = FREE_SHIP - total;
    $('[data-ship-text]').innerHTML = total === 0 ? 'Spend <strong>' + money(FREE_SHIP) + '</strong> and shipping is on us 🚚'
      : left > 0 ? 'You\'re <strong>' + money(left) + '</strong> away from <strong>free shipping</strong>'
      : '🎉 Nice! Your order ships <strong>free</strong>';
    $('[data-ship-bar]').style.width = Math.min(100, total / FREE_SHIP * 100) + '%';

    var items = $('[data-cart-items]');
    items.innerHTML = cart.length ? cart.map(function (it, idx) {
      var p = PRODUCTS[it.k], v = p.variants[it.v] || {};
      var img = v.img || p.imgs[0];
      return '<div class="cart-item"><img src="' + img + '" alt=""><div><h3>' + p.name + '</h3><small>' + (v.name || '') + '</small>' +
        '<div class="qty"><button data-qty="' + idx + ':-1" aria-label="Decrease quantity"><svg><use href="#i-minus"/></svg></button><span>' + it.q + '</span><button data-qty="' + idx + ':1" aria-label="Increase quantity"><svg><use href="#i-plus"/></svg></button></div></div>' +
        '<div><div class="cart-item__price">' + money(priceOf(it) * it.q) + '</div><button class="cart-item__remove" data-remove="' + idx + '">Remove</button></div></div>';
    }).join('') : '<div class="cart-empty"><svg><use href="#i-paw"/></svg><p><strong>Your cart is empty</strong><br>Your pet is waiting for something nice.</p><a class="btn btn--primary" href="#shop" data-close-cart>Shop best sellers</a></div>';

    // Upsell: suggest a product not yet in cart (prefers the cheapest one that crosses free shipping)
    var inCart = cart.map(function (i) { return i.k; });
    var hasDuo = inCart.indexOf('bundle') > -1;
    var options = ['brush', 'glove', 'collar'].filter(function (k) { return inCart.indexOf(k) < 0 && !(hasDuo && k !== 'collar'); });
    var up = $('[data-upsell]');
    if (cart.length && options.length) {
      var k = options.sort(function (a, b) { return PRODUCTS[a].price - PRODUCTS[b].price; }).find(function (x) { return PRODUCTS[x].price >= left; }) || options[0];
      var p = PRODUCTS[k];
      up.innerHTML = '<div class="upsell"><img src="' + p.imgs[0] + '" alt=""><div><small>' + (left > 0 && p.price >= left ? 'Unlocks free shipping' : 'Pairs perfectly') + '</small><strong>' + p.short + '</strong> · ' + money(p.price) + '</div><button class="btn btn--primary btn--sm" data-add="' + k + '">Add</button></div>';
    } else up.innerHTML = '';
  }
  function openCart() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add('is-open'); drawer.classList.add('is-open'); });
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { var c = $('[data-close-cart]', drawer); if (c) c.focus(); }, 50);
  }
  function closeCart() {
    if (!drawer.classList.contains('is-open')) return;
    overlay.classList.remove('is-open'); drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () { overlay.hidden = true; }, 300);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add) { e.preventDefault(); addToCart(add.getAttribute('data-add'), add.classList.contains('btn--sm') && add.closest('.upsell') ? null : add); return; }
    if (e.target.closest('[data-open-cart]')) { openCart(); return; }
    if (e.target.closest('[data-close-cart]') || e.target === overlay) { closeCart(); return; }
    var q = e.target.closest('[data-qty]');
    if (q) { var a = q.getAttribute('data-qty').split(':'); var it = cart[+a[0]]; it.q += +a[1]; if (it.q < 1) cart.splice(+a[0], 1); save(); return; }
    var r = e.target.closest('[data-remove]');
    if (r) { cart.splice(+r.getAttribute('data-remove'), 1); save(); return; }
    if (e.target.closest('[data-checkout]')) {
      if (!cart.length) { toast('Your cart is empty. Add a product first.'); return; }
      toast('Prototype: on the live store this opens Shopify\'s secure checkout.');
    }
  });
  render();

  /* ---------- Reviews slider ---------- */
  var track = $('[data-review-track]');
  var step = function () { var c = track.firstElementChild; return c ? c.getBoundingClientRect().width + 24 : 300; };
  $('[data-review-next]').addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  $('[data-review-prev]').addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });

  /* ---------- Newsletter ---------- */
  $$('[data-nl-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('input', f), msg = $('[data-nl-msg]', f);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim())) { msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
      msg.innerHTML = '🎉 You\'re in! Your code: <button type="button" class="code-chip" data-copy="WELCOME10">WELCOME10</button>';
      input.value = '';
      store.set('mk-subscribed', true);
      if (f.closest('[data-modal]')) setTimeout(closeModal, 2200);
    });
  });

  /* ---------- Welcome popup (once per session, after 25s or exit intent) ---------- */
  var modal = $('[data-modal]'), modalShown = session.get('mk-modal') || store.get('mk-subscribed');
  function openModal() {
    if (modalShown || document.body.classList.contains('notes-on')) return;
    modalShown = true; session.set('mk-modal', '1');
    modal.hidden = false;
    setTimeout(function () { var i = $('input', modal); if (i) i.focus(); }, 60);
  }
  function closeModal() { if (!modal.hidden) modal.hidden = true; }
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('[data-close-modal]')) closeModal(); });
  if (!modalShown && !/[?&]nopopup/.test(location.search)) {
    setTimeout(openModal, 25000);
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY < 10) openModal(); });
  }

  /* ---------- Sticky mobile CTA ---------- */
  var sticky = $('[data-sticky-cta]'), hero = $('.hero'), footer = $('.footer');
  if ('IntersectionObserver' in window) {
    var heroOut = false, footIn = false;
    var upd = function () {
      var vis = heroOut && !footIn;
      sticky.classList.toggle('is-visible', vis);
      sticky.setAttribute('aria-hidden', !vis);
      $('button', sticky).tabIndex = vis ? 0 : -1;
    };
    new IntersectionObserver(function (en) { heroOut = !en[0].isIntersecting; upd(); }).observe(hero);
    new IntersectionObserver(function (en) { footIn = en[0].isIntersecting; upd(); }).observe(footer);
  }

  /* ---------- CRO notes layer ---------- */
  var croSections = $$('[data-cro]');
  var list = $('[data-notes-list]'), panel = $('[data-notes-panel]'), toggle = $('[data-notes-toggle]');
  croSections.forEach(function (sec, i) {
    var n = i + 1, title = sec.getAttribute('data-cro'), why = sec.getAttribute('data-cro-why');
    if (!sec.id) sec.id = 'cro-' + n;
    var pin = document.createElement('div');
    pin.className = 'cro-pin has-toggle';
    pin.innerHTML = '<b>' + n + '</b><div><strong>' + title + '</strong><p>' + why + '</p></div><button type="button" aria-label="Collapse note">–</button>';
    $('button', pin).addEventListener('click', function () {
      var c = pin.classList.toggle('is-collapsed'); this.textContent = c ? '+' : '–';
    });
    sec.insertBefore(pin, sec.firstChild);
    var li = document.createElement('li');
    li.innerHTML = '<a href="#' + sec.id + '">' + title + '</a><p>' + why + '</p>';
    list.appendChild(li);
  });
  function setNotes(on) {
    document.body.classList.toggle('notes-on', on);
    toggle.setAttribute('aria-pressed', on);
    panel.hidden = !on;
    if (on) closeModal();
  }
  toggle.addEventListener('click', function () { setNotes(!document.body.classList.contains('notes-on')); });
  $('[data-notes-close]').addEventListener('click', function () { panel.hidden = true; });
  list.addEventListener('click', function (e) { if (e.target.closest('a') && window.innerWidth < 900) panel.hidden = true; });
  if (/[?&]notes/.test(location.search)) setNotes(true);

  /* ---------- GSAP motion ---------- */
  function initMotion() {
    if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    gsap.from('.hero__copy > *', { y: 28, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out' });
    gsap.from('.hero__img', { scale: .94, opacity: 0, duration: 1, ease: 'power3.out' });
    gsap.from('.float-card--product', { y: 30, opacity: 0, duration: .7, delay: .6, ease: 'back.out(1.6)' });
    gsap.from('.float-card--stat', { y: -20, rotate: -6, opacity: 0, duration: .7, delay: .8, ease: 'back.out(1.6)' });
    gsap.to('.float-card--stat', { y: -8, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.6 });

    if (!window.ScrollTrigger) return;
    var groups = [
      ['.trust__item', { y: 16 }], ['.cat-card', { y: 40 }], ['.product', { y: 40 }],
      ['.how__media, .how__copy', { y: 40 }], ['.compare-table tbody tr', { x: -20 }],
      ['.bundle__card', { y: 40 }], ['.safety__copy > *', { y: 24 }], ['.safety__media', { x: 40 }],
      ['.reviews__summary, .ugc img', { y: 30 }], ['.review', { y: 30 }], ['.story__media, .story__copy', { y: 40 }],
      ['.accordion details', { y: 18 }], ['.newsletter__card', { y: 30 }]
    ];
    groups.forEach(function (g) {
      var els = $$(g[0]);
      if (!els.length) return;
      gsap.set(els, Object.assign({ opacity: 0 }, g[1]));
      window.ScrollTrigger.batch(els, {
        start: 'top 92%', once: true,
        onEnter: function (batch) { gsap.to(batch, { opacity: 1, x: 0, y: 0, duration: .7, stagger: .08, ease: 'power3.out', clearProps: 'transform,opacity' }); }
      });
    });
    gsap.from('.bundle__plus', { rotate: -180, scale: 0, duration: .8, ease: 'back.out(2)', scrollTrigger: { trigger: '.bundle__card', start: 'top 75%' } });
    gsap.from('.sticker', { scale: 0, rotate: -40, duration: .8, ease: 'back.out(2)', scrollTrigger: { trigger: '.how', start: 'top 70%' } });
  }
  if (document.readyState === 'complete') initMotion(); else window.addEventListener('load', initMotion);
})();
