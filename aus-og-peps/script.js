/* Aus OG Peps — home page prototype */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var FREE_SHIP = 150;

  /* Catalogue: names, images and base prices come from the current site.
     Prices for the larger sizes are placeholders to confirm with the client. */
  var PRODUCTS = [
    { id: 'retatrutide', name: 'Retatrutide', img: 'retatrutide', best: true, sizes: [['10mg', 90], ['20mg', 160], ['30mg', 220]], purity: 99.4 },
    { id: 'ghk-cu', name: 'GHK-Cu', img: 'ghk-cu', best: true, sizes: [['100mg', 70]], purity: 99.2 },
    { id: 'tesamorelin', name: 'Tesamorelin', img: 'tesamorelin', best: true, sizes: [['10mg', 105], ['20mg', 180]], purity: 99.1 },
    { id: 'bpc-157', name: 'BPC-157', img: 'bpc-157', best: true, sizes: [['10mg', 70]], purity: 99.5 },
    { id: 'ss-31', name: 'SS-31', img: 'ss-31', sizes: [['10mg', 100], ['50mg', 350]], purity: 99.0 },
    { id: 'mots-c', name: 'MOTS-C', img: 'mots-c', sizes: [['10mg', 65], ['40mg', 180]], purity: 99.3 },
    { id: 'tirz', name: 'Tirz', img: 'tirz', sizes: [['10mg', 60], ['30mg', 140]], purity: 99.4 },
    { id: 'klow', name: 'KLOW', img: 'klow', best: true, blend: true, sizes: [['80mg', 140]], purity: 99.0 },
    { id: 'kpv', name: 'KPV', img: 'kpv', sizes: [['10mg', 60], ['30mg', 140]], purity: null },
    { id: 'cjc-ipa', name: 'CJC-1295 no DAC / IPA', img: 'cjc-1295-ipamorelin', blend: true, sizes: [['10mg', 90]], purity: 99.2 },
    { id: 'wolverine', name: 'Wolverine Stack', img: 'wolverine', blend: true, sizes: [['20mg', 120]], purity: 99.1 },
    { id: '5-amino-1mq', name: '5-Amino-1MQ', img: '5-amino-1mq', sizes: [['50mg', 80]], purity: 99.6 },
    { id: 'nad', name: 'NAD+', img: 'nad', sizes: [['1000mg', 90]], purity: 99.3 },
    { id: 'selank', name: 'Selank', img: 'selank', sizes: [['10mg', 60]], purity: 99.2 }
  ];
  var byId = {};
  PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + n.toFixed(2); };
  var moneyShort = function (n) { return '$' + (n % 1 ? n.toFixed(2) : n); };
  var imgSrc = function (p) { return 'images/' + p.img + '.webp'; };

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------------- Announcement rotator ---------------- */
  (function () {
    var msgs = $$('.announce__msg');
    if (msgs.length < 2) return;
    var i = 0;
    setInterval(function () {
      var cur = msgs[i];
      cur.classList.remove('is-active'); cur.classList.add('is-leaving');
      setTimeout(function () { cur.classList.remove('is-leaving'); }, 500);
      i = (i + 1) % msgs.length;
      msgs[i].classList.add('is-active');
    }, 4000);
  })();

  /* ---------------- Header ---------------- */
  var header = $('.header');
  var menuBtn = $('.header__menu');
  var mobileNav = $('#mobileNav');
  menuBtn.addEventListener('click', function () {
    var open = mobileNav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('a', mobileNav).forEach(function (a) {
    a.addEventListener('click', function () { mobileNav.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); });
  });

  /* ---------------- Product grid ---------------- */
  var grid = $('#productGrid');
  var checkSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#2c7a55"/><path d="m7.5 12 3 3 6-6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function cardHTML(p) {
    var multi = p.sizes.length > 1;
    var sizes = p.sizes.map(function (s, i) {
      return multi
        ? '<button type="button" class="size' + (i === 0 ? ' is-active' : '') + '" data-size="' + i + '" aria-pressed="' + (i === 0) + '">' + s[0] + '</button>'
        : '<span class="size size--single">' + s[0] + '</span>';
    }).join('');
    var tags = [];
    if (p.best) tags.push('best');
    if (p.blend) tags.push('blend');
    if (p.sizes[0][1] < 80) tags.push('under80');
    return '<article class="card" data-id="' + p.id + '" data-tags="' + tags.join(' ') + '">' +
      '<a class="card__media" href="#shop" aria-label="' + p.name + '">' +
        '<img src="' + imgSrc(p) + '" alt="' + p.name + ' research vial" loading="lazy" width="720" height="720">' +
        '<span class="card__badges">' + (p.best ? '<span class="badge badge--gold">Best seller</span>' : '<span></span>') +
        (multi ? '<span class="badge badge--green">' + p.sizes.length + ' sizes</span>' : '') + '</span>' +
      '</a>' +
      '<div class="card__body">' +
        '<a class="card__title" href="#shop">' + p.name + '</a>' +
        '<div class="card__meta"><span class="card__price" data-price>' + (multi ? 'From ' : '') + moneyShort(p.sizes[0][1]) + '</span>' +
        (p.purity ? '<span class="card__coa">' + checkSvg + '<span>COA verified</span></span>' : '<span class="card__coa" style="color:#8a6a12"><span>COA coming soon</span></span>') + '</div>' +
        '<div class="sizes" role="group" aria-label="Size">' + sizes + '</div>' +
        '<button type="button" class="btn btn--gold btn--block card__btn" data-add>Add to cart · ' + p.sizes[0][0] + '</button>' +
      '</div>' +
    '</article>';
  }

  grid.innerHTML = PRODUCTS.map(cardHTML).join('') +
    '<article class="card card--request" data-tags="">' +
      '<a class="card__media" href="#request" aria-label="Request a peptide"><img src="images/blank.webp" alt="" loading="lazy" width="720" height="720"></a>' +
      '<div class="card__body"><span class="card__title">What\'s next?</span><span class="muted small">Tell us what you want us to stock.</span>' +
      '<a class="btn btn--outline btn--block card__btn" href="#request">Make a request →</a></div>' +
    '</article>';

  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.card');
    if (!card || !card.dataset.id) return;
    var p = byId[card.dataset.id];
    var sizeBtn = e.target.closest('[data-size]');
    if (sizeBtn) {
      var idx = +sizeBtn.dataset.size;
      $$('[data-size]', card).forEach(function (b) { b.classList.toggle('is-active', b === sizeBtn); b.setAttribute('aria-pressed', b === sizeBtn); });
      $('[data-price]', card).textContent = moneyShort(p.sizes[idx][1]);
      $('[data-add]', card).textContent = 'Add to cart · ' + p.sizes[idx][0];
      card.dataset.sel = idx;
      return;
    }
    var addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      var sel = +(card.dataset.sel || 0);
      addToCart(p.id, sel, 1, $('img', card));
      var label = addBtn.textContent;
      addBtn.classList.add('is-added');
      addBtn.textContent = '✓ Added';
      setTimeout(function () { addBtn.classList.remove('is-added'); addBtn.textContent = label; }, 1400);
    }
  });

  /* Filters */
  function applyFilter(f) {
    $$('.chip').forEach(function (c) { var on = c.dataset.filter === f; c.classList.toggle('is-active', on); c.setAttribute('aria-selected', on); });
    $$('.card', grid).forEach(function (card) {
      var show = f === 'all' || (card.dataset.tags || '').split(' ').indexOf(f) > -1 || card.classList.contains('card--request');
      card.classList.toggle('is-hidden', !show);
    });
    if (window.gsap) gsap.fromTo($$('.card:not(.is-hidden)', grid), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .45, stagger: .04, ease: 'power2.out' });
  }
  $$('.chip').forEach(function (c) { c.addEventListener('click', function () { applyFilter(c.dataset.filter); }); });
  $$('[data-footer-filter]').forEach(function (a) { a.addEventListener('click', function () { applyFilter(a.dataset.footerFilter); }); });

  /* ---------------- Cart ---------------- */
  var cart = store.get('aogp_cart', []);
  var drawer = $('[data-cart]');
  var overlay = $('[data-overlay]');
  var lastFocus = null;

  function cartCount() { return cart.reduce(function (n, l) { return n + l.qty; }, 0); }
  function cartTotal() { return cart.reduce(function (n, l) { return n + byId[l.id].sizes[l.size][1] * l.qty; }, 0); }

  function addToCart(id, size, qty, fromImg) {
    var line = cart.filter(function (l) { return l.id === id && l.size === size; })[0];
    if (line) line.qty += qty; else cart.push({ id: id, size: size, qty: qty });
    store.set('aogp_cart', cart);
    flyToCart(fromImg);
    renderCart(true);
    var p = byId[id];
    var remaining = FREE_SHIP - cartTotal();
    toast('✓ ' + p.name + ' ' + p.sizes[size][0] + ' added' + (remaining > 0 ? ' · ' + moneyShort(remaining) + ' to free shipping' : ' · Free shipping unlocked!'));
  }

  function renderCart(bump) {
    var count = cartCount(), total = cartTotal();
    $$('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    });
    $('[data-cart-count-text]').textContent = count ? '(' + count + ')' : '';
    $('[data-cart-total]').textContent = money(total);

    var remaining = Math.max(0, FREE_SHIP - total);
    var pct = Math.min(100, (total / FREE_SHIP) * 100);
    $('[data-ship-bar]').style.setProperty('--w', pct + '%');
    $('[data-ship-progress]').classList.toggle('is-free', remaining === 0 && total > 0);
    $('[data-ship-text]').innerHTML = total === 0
      ? 'Spend <strong>$150</strong> for free Express Post'
      : remaining > 0 ? 'You\'re <strong>' + money(remaining) + '</strong> away from free Express Post' : '🎉 You\'ve unlocked <strong>free Express Post</strong>';

    var body = $('[data-cart-items]');
    if (!cart.length) {
      body.innerHTML = '<div class="drawer__empty"><span class="logo__mark">OG</span><p>Your cart is empty.</p><a href="#shop" class="btn btn--gold" data-close>Shop best sellers</a></div>';
    } else {
      body.innerHTML = cart.map(function (l, i) {
        var p = byId[l.id], s = p.sizes[l.size];
        return '<div class="line-item"><img src="' + imgSrc(p) + '" alt="">' +
          '<div><div class="line-item__name">' + p.name + '</div><div class="line-item__size">' + s[0] + ' · COA included</div>' +
          '<div class="qty"><button type="button" data-qty="-1" data-i="' + i + '" aria-label="Decrease quantity">−</button><span>' + l.qty + '</span><button type="button" data-qty="1" data-i="' + i + '" aria-label="Increase quantity">+</button></div></div>' +
          '<div class="line-item__right"><span class="line-item__price">' + money(s[1] * l.qty) + '</span><button type="button" class="line-item__remove" data-remove="' + i + '">Remove</button></div></div>';
      }).join('');
    }

    /* In-cart upsell: suggest the best-seller not in cart that gets closest to free shipping */
    var up = $('[data-upsell]');
    up.innerHTML = '';
    if (cart.length && remaining > 0) {
      var inCart = cart.map(function (l) { return l.id; });
      var pick = PRODUCTS.filter(function (p) { return inCart.indexOf(p.id) < 0 && p.purity; })
        .sort(function (a, b) { return Math.abs(a.sizes[0][1] - remaining) - Math.abs(b.sizes[0][1] - remaining) || (b.best ? 1 : 0) - (a.best ? 1 : 0); })[0];
      if (pick) {
        var unlocks = pick.sizes[0][1] >= remaining;
        up.innerHTML = '<div class="upsell"><img src="' + imgSrc(pick) + '" alt="">' +
          '<div class="upsell__txt"><strong>' + pick.name + ' ' + pick.sizes[0][0] + ' · ' + moneyShort(pick.sizes[0][1]) + '</strong>' +
          (unlocks ? 'Add this to unlock free shipping' : 'Popular add-on') + '</div>' +
          '<button type="button" class="btn btn--green btn--sm" data-upsell-add="' + pick.id + '">Add</button></div>';
      }
    }
    updateCheckout();
  }

  function updateCheckout() {
    $('[data-checkout]').disabled = !(cart.length && $('[data-ruo-check]').checked);
  }

  drawer.addEventListener('click', function (e) {
    var q = e.target.closest('[data-qty]');
    if (q) {
      var l = cart[+q.dataset.i];
      l.qty += +q.dataset.qty;
      if (l.qty < 1) cart.splice(+q.dataset.i, 1);
      store.set('aogp_cart', cart); renderCart(); return;
    }
    var r = e.target.closest('[data-remove]');
    if (r) { cart.splice(+r.dataset.remove, 1); store.set('aogp_cart', cart); renderCart(); return; }
    var u = e.target.closest('[data-upsell-add]');
    if (u) { addToCart(u.dataset.upsellAdd, 0, 1); return; }
    if (e.target.closest('[data-close]')) closeCart();
  });
  $('[data-ruo-check]').addEventListener('change', updateCheckout);
  $('[data-checkout]').addEventListener('click', function () {
    toast('Prototype: this button goes to WooCommerce checkout in the full build');
  });

  function openCart() {
    lastFocus = document.activeElement;
    toastEl.classList.remove('is-visible');
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add('is-open'); drawer.classList.add('is-open'); });
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { drawer.focus(); }, 50);
  }
  function closeCart() {
    overlay.classList.remove('is-open'); drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(function () { overlay.hidden = true; }, 300);
    if (lastFocus) lastFocus.focus();
  }
  $$('[data-open-cart]').forEach(function (b) { b.addEventListener('click', openCart); });
  overlay.addEventListener('click', closeCart);

  /* Quick add (hero) + bundle */
  $$('[data-quick-add]').forEach(function (b) {
    b.addEventListener('click', function () { addToCart(b.dataset.quickAdd, 0, 1, $('.hero__vial')); });
  });
  var bundleBtn = $('[data-add-bundle]');
  bundleBtn.addEventListener('click', function () {
    addToCart('retatrutide', 0, 1);
    addToCart('bpc-157', 0, 1, $('.bundle__items img'));
    setTimeout(openCart, 450);
  });

  /* Fly-to-cart micro-interaction */
  function flyToCart(img) {
    if (!img || !window.gsap) return;
    var target = $('.cart-btn');
    var a = img.getBoundingClientRect(), b = target.getBoundingClientRect();
    if (!a.width) return;
    var clone = img.cloneNode();
    clone.removeAttribute('class');
    Object.assign(clone.style, { position: 'fixed', left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px', borderRadius: '14px', zIndex: 140, pointerEvents: 'none', objectFit: 'cover' });
    document.body.appendChild(clone);
    gsap.to(clone, {
      left: b.left + b.width / 2 - 14, top: b.top + b.height / 2 - 14, width: 28, height: 28, borderRadius: '50%', opacity: .6,
      duration: .7, ease: 'power2.in', onComplete: function () { clone.remove(); }
    });
  }

  /* ---------------- Toast ---------------- */
  var toastEl = $('[data-toast]'), toastT;
  function toast(msg) {
    if (drawer.classList.contains('is-open')) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2800);
  }

  /* ---------------- Search ---------------- */
  var search = $('[data-search]'), sInput = $('[data-search-input]'), sResults = $('[data-search-results]'), sLabel = $('[data-search-label]');
  function renderSearch(q) {
    q = q.trim().toLowerCase();
    var list = q ? PRODUCTS.filter(function (p) { return p.name.toLowerCase().replace(/[^a-z0-9]/g, '').indexOf(q.replace(/[^a-z0-9]/g, '')) > -1; }) : PRODUCTS.filter(function (p) { return p.best; });
    sLabel.textContent = q ? list.length + ' result' + (list.length === 1 ? '' : 's') : 'Popular right now';
    sResults.innerHTML = list.length ? list.map(function (p) {
      return '<li><button type="button" data-search-go="' + p.id + '"><img src="' + imgSrc(p) + '" alt=""><span class="r-name">' + p.name + '<br><span class="small muted">' + p.sizes.map(function (s) { return s[0]; }).join(' · ') + '</span></span><span class="r-price">' + moneyShort(p.sizes[0][1]) + '</span></button></li>';
    }).join('') : '<li class="r-empty">No match. <a class="link" href="#request" data-close-search>Request this peptide →</a></li>';
  }
  function openSearch() { search.hidden = false; renderSearch(''); sInput.value = ''; setTimeout(function () { sInput.focus(); }, 30); }
  function closeSearch() { search.hidden = true; }
  $$('[data-open-search]').forEach(function (b) { b.addEventListener('click', openSearch); });
  sInput.addEventListener('input', function () { renderSearch(sInput.value); });
  search.addEventListener('click', function (e) {
    if (e.target === search || e.target.closest('[data-close-search]')) { closeSearch(); return; }
    var go = e.target.closest('[data-search-go]');
    if (go) {
      closeSearch();
      applyFilter('all');
      var card = $('.card[data-id="' + go.dataset.searchGo + '"]');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (window.gsap) gsap.fromTo(card, { boxShadow: '0 0 0 0 rgba(240,179,35,0)' }, { boxShadow: '0 0 0 6px rgba(240,179,35,.9)', duration: .4, yoyo: true, repeat: 3, delay: .5 });
    }
  });

  /* ---------------- COA lookup ---------------- */
  var coaSel = $('[data-coa-select]');
  coaSel.innerHTML = PRODUCTS.map(function (p) {
    return p.sizes.map(function (s, i) {
      return '<option value="' + p.id + '|' + i + '"' + (p.purity ? '' : ' disabled') + '>' + p.name + ' ' + s[0] + (p.purity ? '' : ' (coming soon)') + '</option>';
    }).join('');
  }).join('');
  function showCoa(val) {
    var parts = val.split('|'), p = byId[parts[0]], s = p.sizes[+parts[1]];
    $('[data-coa-name]').textContent = p.name;
    $('[data-coa-size]').textContent = s[0];
    var purity = (p.purity - (+parts[1]) * 0.1).toFixed(1);
    $('[data-coa-purity]').textContent = purity + '%';
    var bar = $('[data-coa-bar]');
    bar.style.setProperty('--w', '0%');
    requestAnimationFrame(function () { requestAnimationFrame(function () { bar.style.setProperty('--w', purity + '%'); }); });
  }
  coaSel.addEventListener('change', function () { showCoa(coaSel.value); });
  $('[data-coa-form]').addEventListener('submit', function (e) {
    e.preventDefault();
    showCoa(coaSel.value);
    if (window.gsap) gsap.fromTo('.coa-doc', { rotate: -1.5, scale: .98 }, { rotate: 0, scale: 1, duration: .6, ease: 'elastic.out(1, .5)' });
    toast('Prototype: opens the full PDF certificate in the live build');
  });

  /* ---------------- Forms ---------------- */
  var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
  $$('[data-email-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('input[type=email]', f), msg = $('.form__msg', f);
      if (!emailOk(input.value)) { input.classList.add('is-invalid'); msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
      input.classList.remove('is-invalid');
      msg.textContent = '✓ Check your inbox. Your 10% code is on its way.';
      input.value = '';
      store.set('aogp_sub', true);
      if (f.closest('[data-popup]')) setTimeout(closePopup, 1600);
    });
  });
  var req = $('[data-request-form]');
  req.addEventListener('submit', function (e) {
    e.preventDefault();
    var pep = req.peptide, em = req.email, msg = $('.form__msg', req), ok = true;
    [pep, em].forEach(function (i) { i.classList.remove('is-invalid'); });
    if (!pep.value.trim()) { pep.classList.add('is-invalid'); ok = false; }
    if (!emailOk(em.value)) { em.classList.add('is-invalid'); ok = false; }
    if (!ok) { msg.textContent = 'Please add a peptide name and a valid email.'; return; }
    msg.textContent = '✓ Thanks! We\'ll email you if ' + pep.value.trim() + ' lands.';
    req.reset();
  });

  /* ---------------- 10% popup: delayed, exit-intent, once per session ---------------- */
  var popup = $('[data-popup]');
  var popupShown = store.sget('aogp_pop') || store.get('aogp_sub', false);
  function openPopup() {
    if (popupShown || drawer.classList.contains('is-open') || !search.hidden || document.body.classList.contains('show-notes')) return;
    popupShown = true; store.sset('aogp_pop', '1');
    popup.hidden = false;
    setTimeout(function () { var i = $('input', popup); if (i) i.focus(); }, 60);
  }
  function closePopup() { popup.hidden = true; }
  $$('[data-close-popup]').forEach(function (b) { b.addEventListener('click', closePopup); });
  popup.addEventListener('click', function (e) { if (e.target === popup) closePopup(); });
  if (!popupShown) {
    setTimeout(openPopup, 25000);
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY < 8) openPopup(); });
    window.addEventListener('scroll', function onS() {
      var pct = (window.scrollY + innerHeight) / document.documentElement.scrollHeight;
      if (pct > .65) { window.removeEventListener('scroll', onS); openPopup(); }
    }, { passive: true });
  }

  /* ---------------- Cookie banner ---------------- */
  var cookie = $('[data-cookie]');
  if (!store.get('aogp_cookie', false)) {
    setTimeout(function () { cookie.hidden = false; document.body.classList.add('has-cookie'); }, 1500);
  }
  $$('[data-cookie-btn]').forEach(function (b) {
    b.addEventListener('click', function () { store.set('aogp_cookie', true); cookie.hidden = true; document.body.classList.remove('has-cookie'); });
  });

  /* ---------------- Escape key ---------------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!search.hidden) closeSearch();
    else if (!popup.hidden) closePopup();
    else if (drawer.classList.contains('is-open')) closeCart();
  });

  /* ---------------- Scroll: header shadow, sticky CTA, active nav ---------------- */
  var sticky = $('[data-sticky-cta]'), hero = $('.hero'), shop = $('#shop');
  var navLinks = $$('.nav a');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    var heroBottom = hero.offsetTop + hero.offsetHeight;
    var shopRect = shop.getBoundingClientRect();
    var inShop = shopRect.top < innerHeight * .5 && shopRect.bottom > innerHeight * .5;
    var show = y > heroBottom && !inShop;
    sticky.classList.toggle('is-visible', show);
    sticky.setAttribute('aria-hidden', !show);
    var current = null;
    navLinks.forEach(function (a) {
      var sec = $(a.getAttribute('href'));
      if (sec && sec.getBoundingClientRect().top < innerHeight * .4) current = a;
    });
    navLinks.forEach(function (a) { a.classList.toggle('is-active', a === current); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- CRO notes overlay ---------------- */
  var notesBtn = $('[data-notes-toggle]');
  var noteN = 0;
  $$('[data-note]').forEach(function (el) {
    noteN++;
    var n = document.createElement('div');
    n.className = 'cro-note';
    n.innerHTML = '<b><span>' + noteN + '</span>' + el.dataset.noteTitle + '</b>' + el.dataset.note;
    el.appendChild(n);
  });
  function setNotes(on) {
    document.body.classList.toggle('show-notes', on);
    notesBtn.setAttribute('aria-pressed', on);
    $('span', notesBtn).textContent = on ? 'Hide CRO notes' : 'Show CRO notes';
    try { history.replaceState(null, '', on ? '#notes' : location.pathname + location.search); } catch (e) { /* ignore */ }
  }
  notesBtn.addEventListener('click', function () { setNotes(!document.body.classList.contains('show-notes')); });
  if (location.hash === '#notes') setNotes(true);

  renderCart(false);
  showCoa(coaSel.value);

  /* ---------------- GSAP motion ---------------- */
  window.addEventListener('load', function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!window.gsap || reduce) { $$('.reveal').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; }); return; }
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero__title .line > span', { yPercent: 110, duration: .9, stagger: .1 })
      .from('.hero .eyebrow, .hero__sub, .hero__ctas, .hero__proof', { y: 20, opacity: 0, duration: .6, stagger: .08 }, '-=.5')
      .from('.stamp', { scale: .6, rotate: -40, opacity: 0, duration: 1.1, ease: 'back.out(1.4)' }, '-=1')
      .from('.hero__vial', { y: 60, rotate: -20, opacity: 0, duration: .9 }, '-=.7')
      .from('.hero-card', { y: 30, opacity: 0, duration: .6 }, '-=.4');

    gsap.to('.hero__vial', { y: -10, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 });

    if (window.ScrollTrigger) {
      gsap.to('.stamp', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      ScrollTrigger.batch('.reveal', {
        start: 'top 88%', once: true,
        onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: .7, stagger: .08, ease: 'power2.out' }); }
      });
      var below = $$('#productGrid .card').filter(function (c) { return c.getBoundingClientRect().top > innerHeight; });
      gsap.set(below, { opacity: 0, y: 30 });
      ScrollTrigger.batch(below, {
        start: 'top 92%', once: true,
        onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: .6, stagger: .06, ease: 'power2.out', clearProps: 'transform,opacity' }); }
      });
    } else {
      $$('.reveal').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
    }
  });
})();
