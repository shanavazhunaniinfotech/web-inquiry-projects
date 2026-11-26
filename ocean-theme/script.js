/* =========================================================
   OCEAN — shared theme script (vanilla JS, no build step)
   Runs on every template; each feature checks its own markup.
   ========================================================= */
(function () {
  'use strict';

  var D = window.OCEAN;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var on = function (el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- Storage ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- Money (Shopify-style: always two decimals, grouped) ---------- */
  var currency = store.get('ocean-currency', { rate: 1, code: 'USD', country: 'US' });
  function money(usd) {
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.code, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(usd * currency.rate); }
    catch (e) { return '$' + (usd * currency.rate).toFixed(2); }
  }
  function refreshMoney() { $$('[data-money]').forEach(function (el) { el.textContent = money(+el.getAttribute('data-money')); }); }

  var byId = function (id) { return D.PRODUCTS.filter(function (p) { return p.id === +id; })[0]; };
  var isSoldOut = function (p) { return p.stock === 0; };
  var qs = function (k) { return new URLSearchParams(location.search).get(k); };

  /* ---------- Toast ---------- */
  var toastT;
  function toast(msg) {
    var t = $('[data-toast]'); if (!t) return;
    t.textContent = msg; t.classList.add('is-visible');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('is-visible'); }, 2800);
  }

  /* ---------- Layers: drawers & modals ---------- */
  var overlay = $('[data-overlay]'), lastFocus = null, openLayer = null;
  function openLayerEl(el, focusSel) {
    if (!el) return;
    closeAll(true);
    lastFocus = document.activeElement; openLayer = el; el.hidden = false;
    if (el.classList.contains('drawer') && overlay) { overlay.hidden = false; requestAnimationFrame(function () { overlay.classList.add('is-visible'); el.classList.add('is-open'); }); }
    document.body.classList.add('lock');
    setTimeout(function () { var f = focusSel ? $(focusSel, el) : $('button, a, input', el); if (f) f.focus(); }, 60);
  }
  function closeAll(silent) {
    if (!openLayer) return;
    var el = openLayer; openLayer = null;
    if (el.classList.contains('drawer')) {
      el.classList.remove('is-open'); if (overlay) overlay.classList.remove('is-visible');
      setTimeout(function () { el.hidden = true; if (overlay) overlay.hidden = true; }, 450);
    } else el.hidden = true;
    document.body.classList.remove('lock');
    $$('[data-open-menu]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (!silent && lastFocus) lastFocus.focus();
  }
  on(overlay, 'click', function () { closeAll(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAll(); closeMega(); closeDropdowns(); }
    if (e.key === 'Tab' && openLayer) {
      var f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', openLayer).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
    var t = e.target.tagName;
    if (e.key === '/' && !openLayer && t !== 'INPUT' && t !== 'TEXTAREA' && t !== 'SELECT' && $('#search')) { e.preventDefault(); openSearch(); }
  });
  $$('[data-close-drawer], [data-close-modal]').forEach(function (b) { on(b, 'click', function () { closeAll(); }); });
  $$('.modal, .search-modal').forEach(function (m) { on(m, 'click', function (e) { if (e.target === m) closeAll(); }); });
  $$('[data-open-menu]').forEach(function (b) { on(b, 'click', function () { b.setAttribute('aria-expanded', 'true'); openLayerEl($('#mobile-menu')); }); });

  /* ---------- Localization dropdowns ---------- */
  function closeDropdowns(except) {
    $$('[data-dropdown].is-open').forEach(function (d) { if (d !== except) { d.classList.remove('is-open'); $('.dropdown__toggle', d).setAttribute('aria-expanded', 'false'); } });
  }
  function applyCountry(btn) {
    $$('[data-current-country]').forEach(function (s) { s.innerHTML = btn.innerHTML; });
    $$('[data-country]').forEach(function (x) { x.setAttribute('aria-selected', String(x.dataset.country === currency.country)); });
  }
  $$('[data-dropdown]').forEach(function (d) {
    var t = $('.dropdown__toggle', d);
    on(t, 'click', function (e) {
      e.stopPropagation();
      var open = !d.classList.contains('is-open'); closeDropdowns(d);
      d.classList.toggle('is-open', open); t.setAttribute('aria-expanded', String(open));
    });
    $$('[role="option"]', d).forEach(function (o) {
      on(o, 'click', function () {
        if (o.dataset.country) {
          currency = { rate: +o.dataset.rate, code: o.dataset.code, country: o.dataset.country };
          store.set('ocean-currency', currency); applyCountry(o); refreshAll();
          toast('Prices now shown in ' + currency.code);
        } else if (o.dataset.lang) {
          $$('[data-current-lang]').forEach(function (s) { s.textContent = o.dataset.lang; });
          toast('Language: ' + o.dataset.lang + ' (demo)');
        }
        closeDropdowns(); t.focus();
      });
    });
  });
  var savedCountry = $('[data-country="' + currency.country + '"]'); if (savedCountry) applyCountry(savedCountry);
  document.addEventListener('click', function () { closeDropdowns(); });

  /* ---------- Mega menu ---------- */
  var mega = $('.has-mega'), megaBtn = mega ? $('.nav__link', mega) : null, megaT;
  function openMega() { if (!mega) return; clearTimeout(megaT); mega.classList.add('is-open'); megaBtn.setAttribute('aria-expanded', 'true'); }
  function closeMega() { if (!mega) return; mega.classList.remove('is-open'); megaBtn.setAttribute('aria-expanded', 'false'); }
  on(mega, 'mouseenter', openMega);
  on(mega, 'mouseleave', function () { megaT = setTimeout(closeMega, 140); });
  on(megaBtn, 'click', function () { mega.classList.contains('is-open') ? closeMega() : openMega(); });
  on(mega, 'focusout', function (e) { if (!mega.contains(e.relatedTarget)) closeMega(); });

  /* ---------- Header state + back to top ---------- */
  var header = $('#header'), toTop = $('[data-to-top]');
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 10);
    if (toTop) toTop.classList.toggle('is-visible', y > 900);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  on(toTop, 'click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  /* ---------- Announcement ---------- */
  var msgs = $$('.announcement__msg'), mi = 0, annT;
  function annGo(n) {
    if (!msgs.length) return;
    msgs[mi].classList.remove('is-active'); mi = (n + msgs.length) % msgs.length; msgs[mi].classList.add('is-active');
    clearInterval(annT); annT = setInterval(function () { if (!document.hidden) annGo(mi + 1); }, 5000);
  }
  $$('[data-ann]').forEach(function (b) { on(b, 'click', function () { annGo(mi + +b.dataset.ann); }); });
  annGo(0);

  /* ---------- Product card (shared by home, collection, search, cart upsells) ---------- */
  var PLACEHOLDER = '<svg class="placeholder-svg" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="64" r="26" fill="none" stroke="currentColor" stroke-width="3"/><path d="M48 38l12-14 12 14" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>';
  function primaryImg(p, w, h) { return D.img(p.photo, w, h, p.fp); }
  function swatches(p) {
    if (p.metals.length < 2) return '<span class="card__metal">' + D.METALS[p.metals[0]].label.replace('14k ', '') + '</span>';
    return '<span class="card__swatches" aria-label="' + p.metals.length + ' metals">' + p.metals.map(function (m) { return '<i style="--sw:' + D.METALS[m].hex + '" title="' + D.METALS[m].label + '"></i>'; }).join('') + '</span>';
  }
  function badgeHTML(p) {
    if (isSoldOut(p)) return '<span class="badge badge--sold">Sold out</span>';
    if (p.compare) return '<span class="badge badge--sale">Sale</span>';
    if (p.badge === 'New') return '<span class="badge badge--new">New</span>';
    if (p.badge) return '<span class="badge">' + p.badge + '</span>';
    return '';
  }
  function unitPrice(p) { if (!p.unitPer) return ''; var len = parseInt(p.sizes[0], 10); return money(p.price / len) + ' / ' + p.unitPer; }
  function priceHTML(p) {
    return p.compare
      ? '<span class="visually-hidden">Sale price</span><strong class="is-sale" data-money="' + p.price + '">' + money(p.price) + '</strong><span class="visually-hidden">Regular price</span><s data-money="' + p.compare + '">' + money(p.compare) + '</s>'
      : '<strong data-money="' + p.price + '">' + money(p.price) + '</strong>';
  }
  function cardHTML(p, i) {
    var url = 'product.html?id=' + p.id;
    var media = p.photo
      ? '<img src="' + primaryImg(p, 700, 875) + '" srcset="' + primaryImg(p, 420, 525) + ' 420w, ' + primaryImg(p, 700, 875) + ' 700w" sizes="(min-width: 1200px) 25vw, (min-width: 750px) 33vw, 50vw" alt="' + esc(p.title) + '" width="700" height="875" loading="lazy">' +
        '<img class="card__img2" src="' + D.img(p.photo, 700, 875, p.detail[0]) + '" alt="" width="700" height="875" loading="lazy">'
      : '<div class="card__placeholder">' + PLACEHOLDER + '<span>Image coming soon</span></div>';
    var soldOut = isSoldOut(p), multi = p.sizes.length > 1 || p.metals.length > 1;
    return '<li class="card' + (soldOut ? ' is-sold-out' : '') + '" style="animation-delay:' + ((i || 0) % 8 * 60) + 'ms">' +
      '<div class="card__media">' +
        '<div class="card__badges">' + badgeHTML(p) + '</div>' + media +
        '<button class="card__quick" aria-label="Quick view: ' + esc(p.title) + '" data-quick="' + p.id + '"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></button>' +
        '<button class="card__add" ' + (soldOut ? 'disabled aria-label="' + esc(p.title) + ' is sold out"' : (multi ? 'data-quick="' + p.id + '" aria-label="Choose options for ' + esc(p.title) + '"' : 'data-add="' + p.id + '" aria-label="Add ' + esc(p.title) + ' to bag"')) + '>' +
          '<span class="plus" aria-hidden="true">' + (soldOut ? '–' : '+') + '</span><span class="lbl" aria-hidden="true">' + (soldOut ? 'Sold out' : (multi ? 'Choose options' : 'Add to bag')) + '</span></button>' +
      '</div>' +
      '<div class="card__body">' +
        '<div class="card__top"><span class="card__type">' + p.type + '</span><span class="card__rating"><span class="stars" aria-hidden="true">★</span> ' + p.rating.toFixed(1) + '<span class="visually-hidden"> out of 5</span> <span class="rc">(' + p.reviews + ')</span></span></div>' +
        '<h3 class="card__title"><a href="' + url + '">' + esc(p.title) + '</a></h3>' +
        '<div class="card__price">' + priceHTML(p) + (p.unitPer ? '<span class="card__unit">' + unitPrice(p) + '</span>' : '') + '</div>' +
        swatches(p) +
      '</div></li>';
  }
  function skeletonCards(n) { var s = ''; for (var i = 0; i < n; i++) s += '<li class="card card--skeleton" aria-hidden="true"><div class="card__media sk"></div><div class="card__body"><span class="sk sk--line" style="width:40%"></span><span class="sk sk--line" style="width:85%"></span><span class="sk sk--line" style="width:30%"></span></div></li>'; return s; }

  /* ---------- Delegated actions ---------- */
  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add && !add.disabled) { e.preventDefault(); addToCart(+add.dataset.add, 1, {}); flyFrom(add); return; }
    var q = e.target.closest('[data-quick]');
    if (q) { e.preventDefault(); openQuick(+q.dataset.quick); return; }
    var sc = e.target.closest('[data-scroll]');
    if (sc) { var tr = $(sc.dataset.scroll); if (tr) tr.scrollBy({ left: +sc.dataset.dir * tr.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' }); }
  });
  function flyFrom(btn) {
    if (reduceMotion) return;
    var src = btn.closest('.card, .hero__chip, .up, .look__row, .qv'); var im = src ? $('img', src) : null; var cart = $('.cart-btn');
    if (!im || !cart) return;
    var a = im.getBoundingClientRect(), b = cart.getBoundingClientRect();
    var g = im.cloneNode(); g.removeAttribute('srcset');
    g.style.cssText = 'position:fixed;z-index:200;left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px;object-fit:cover;border-radius:16px;pointer-events:none;transition:transform .8s cubic-bezier(.5,-.1,.2,1),opacity .8s;';
    document.body.appendChild(g);
    requestAnimationFrame(function () { g.style.transform = 'translate(' + (b.left + b.width / 2 - a.left - a.width / 2) + 'px,' + (b.top + b.height / 2 - a.top - a.height / 2) + 'px) scale(' + (24 / a.width) + ')'; g.style.opacity = '.3'; });
    setTimeout(function () { g.remove(); }, 820);
  }

  /* ---------- Variant helpers (shared with product page) ---------- */
  function variantState(p, metal, size) {
    if (isSoldOut(p)) return 'soldout';
    if (p.unavailable && p.unavailable.indexOf(metal + '|' + size) > -1) return 'unavailable';
    if (p.soldOutSizes && p.soldOutSizes.indexOf(size) > -1) return 'soldout';
    return 'available';
  }

  /* ---------- Quick view ---------- */
  function openQuick(id) {
    var p = byId(id), box = $('[data-qv]'); if (!p || !box) return;
    var sel = { metal: p.metals[0], size: p.sizes.filter(function (s) { return variantState(p, p.metals[0], s) === 'available'; })[0] || p.sizes[0] };
    function render() {
      var st = variantState(p, sel.metal, sel.size);
      box.innerHTML =
        '<div class="qv__media">' + (p.photo ? '<img src="' + primaryImg(p, 900, 1000) + '" alt="' + esc(p.title) + '" width="900" height="1000">' : '<div class="card__placeholder">' + PLACEHOLDER + '<span>Image coming soon</span></div>') + '</div>' +
        '<div class="qv__body">' +
          '<p class="eyebrow" style="margin:0">' + p.type + '</p>' +
          '<h2 class="qv__title" id="qv-title">' + esc(p.title) + '</h2>' +
          '<p class="qv__rating"><span class="stars" aria-hidden="true">★★★★★</span> ' + p.rating.toFixed(1) + ' · ' + p.reviews + ' reviews</p>' +
          '<p class="qv__price">' + priceHTML(p) + '</p>' +
          '<p class="qv__tax">Tax included. Shipping calculated at checkout.</p>' +
          optionHTML(p, sel, 'qv') +
          '<div class="qv__actions">' + atcButton(st, p) + '</div>' +
          '<a class="link-arrow" href="product.html?id=' + p.id + '">View full details <span aria-hidden="true">→</span></a>' +
        '</div>';
      bindOptions(box, p, sel, render);
      var b = $('[data-qv-add]', box);
      on(b, 'click', function () { addToCart(p.id, 1, { metal: sel.metal, size: sel.size }); });
    }
    render();
    openLayerEl($('#quick-view'), '.modal__close');
  }
  function atcButton(st, p, extra) {
    if (st === 'soldout') return '<button class="btn btn--primary btn--block btn--lg" disabled>Sold out</button>';
    if (st === 'unavailable') return '<button class="btn btn--primary btn--block btn--lg" disabled>Unavailable</button>';
    return '<button class="btn btn--primary btn--block btn--lg" data-qv-add' + (extra || '') + '>Add to bag · <span data-money="' + p.price + '">' + money(p.price) + '</span></button>';
  }
  function optionHTML(p, sel, ns) {
    var metalRow = '<fieldset class="opt"><legend class="opt__label">Metal: <strong>' + D.METALS[sel.metal].label + '</strong></legend><div class="opt__row">' +
      p.metals.map(function (m) { return '<label class="swatch"><input type="radio" name="' + ns + '-metal" value="' + m + '"' + (m === sel.metal ? ' checked' : '') + '><span style="--sw:' + D.METALS[m].hex + '"></span><span class="visually-hidden">' + D.METALS[m].label + '</span></label>'; }).join('') + '</div></fieldset>';
    var sizeLabel = p.type === 'Rings' ? 'Ring size' : (p.type === 'Necklaces' ? 'Length' : 'Size');
    var sizeRow = '<fieldset class="opt"><legend class="opt__label">' + sizeLabel + ': <strong>' + sel.size + '</strong>' + (p.type === 'Rings' ? ' <a class="opt__guide" href="page.html#size-guide">Size guide</a>' : '') + '</legend><div class="opt__row">' +
      p.sizes.map(function (s) {
        var st = variantState(p, sel.metal, s);
        return '<label class="pill' + (st !== 'available' ? ' is-out' : '') + '"><input type="radio" name="' + ns + '-size" value="' + s + '"' + (s === sel.size ? ' checked' : '') + '><span>' + s + (st === 'soldout' ? '<span class="visually-hidden"> (sold out)</span>' : st === 'unavailable' ? '<span class="visually-hidden"> (unavailable)</span>' : '') + '</span></label>';
      }).join('') + '</div></fieldset>';
    return metalRow + sizeRow;
  }
  function bindOptions(root, p, sel, render) {
    $$('input[type="radio"]', root).forEach(function (r) {
      on(r, 'change', function () {
        if (/-metal$/.test(r.name)) sel.metal = r.value; else sel.size = r.value;
        var name = r.name, val = r.value; render();
        var again = $('input[name="' + name + '"][value="' + val + '"]', root); if (again) again.focus();
      });
    });
  }

  /* ---------- Cart (drawer + page share one store) ---------- */
  var CART_KEY = 'ocean-jewel-cart';
  var cart = store.get(CART_KEY, []).filter(function (l) { return byId(l.id); });
  var FREE_SHIP = 100, giftWrap = store.get('ocean-gift', false);
  function saveCart() { store.set(CART_KEY, cart); }
  function lineKey(id, o) { return [id, o.metal, o.size, o.bundle ? 'b' : ''].join('|'); }
  function maxQty(p) { return p.stock; }
  function addToCart(id, qty, o) {
    var p = byId(id); if (!p || isSoldOut(p)) return false;
    o = o || {};
    o.metal = o.metal || p.metals[0];
    o.size = o.size || p.sizes.filter(function (s) { return variantState(p, o.metal, s) === 'available'; })[0];
    var key = lineKey(id, o), line = cart.filter(function (l) { return l.key === key; })[0];
    var inCart = cart.filter(function (l) { return l.id === id; }).reduce(function (a, l) { return a + l.qty; }, 0);
    if (inCart + qty > maxQty(p)) {
      var msg = 'You can only add ' + maxQty(p) + ' of ' + p.title + ' to your bag.';
      toast(msg); document.dispatchEvent(new CustomEvent('ocean:cart-error', { detail: { id: id, message: msg } }));
      return false;
    }
    if (line) line.qty += qty; else cart.push({ key: key, id: id, metal: o.metal, size: o.size, qty: qty, bundle: !!o.bundle, engraving: o.engraving || '' });
    saveCart(); renderCart();
    var c = $('[data-cart-count]'); if (c) { c.classList.add('bump'); setTimeout(function () { c.classList.remove('bump'); }, 300); }
    if (!o.silent) { if ($('#cart-drawer') && !document.body.classList.contains('template-cart')) { closeAll(true); setTimeout(function () { openCart(); }, 120); } else toast('Added to your bag'); }
    return true;
  }
  function setQty(key, qty) {
    var l = cart.filter(function (x) { return x.key === key; })[0]; if (!l) return;
    var p = byId(l.id), others = cart.filter(function (x) { return x.id === l.id && x.key !== key; }).reduce(function (a, x) { return a + x.qty; }, 0);
    if (qty + others > maxQty(p)) { var m = 'You can only add ' + maxQty(p) + ' of this item to your bag.'; document.dispatchEvent(new CustomEvent('ocean:line-error', { detail: { key: key, message: m } })); return false; }
    l.qty = qty; cart = cart.filter(function (x) { return x.qty > 0; }); saveCart(); renderCart(); return true;
  }
  function removeLine(key) { cart = cart.filter(function (x) { return x.key !== key; }); saveCart(); renderCart(); }
  function totals() {
    var sub = 0, disc = 0;
    cart.forEach(function (l) { var p = byId(l.id), lp = p.price * l.qty; sub += lp; if (l.bundle) disc += lp * 0.15; });
    var wrap = giftWrap && cart.length ? 8 : 0;
    return { sub: sub + wrap, disc: disc, total: sub + wrap - disc, count: cart.reduce(function (a, l) { return a + l.qty; }, 0), wrap: wrap };
  }
  function lineHTML(l) {
    var p = byId(l.id), opts = D.METALS[l.metal].label + ' · ' + l.size;
    var imgH = p.photo ? '<img src="' + primaryImg(p, 220, 260) + '" alt="' + esc(p.title) + '" width="88" height="104" loading="lazy">' : '<div class="line__ph">' + PLACEHOLDER + '</div>';
    return '<li class="line" data-line="' + esc(l.key) + '">' +
      '<a class="line__img" href="product.html?id=' + p.id + '" tabindex="-1">' + imgH + '</a>' +
      '<div class="line__info"><a class="line__title" href="product.html?id=' + p.id + '">' + esc(p.title) + '</a>' +
        '<p class="line__meta">' + opts + (l.engraving ? ' · Engraving: “' + esc(l.engraving) + '”' : '') + '</p>' +
        '<p class="line__unit">' + money(p.price) + (p.compare ? ' <s>' + money(p.compare) + '</s>' : '') + '</p>' +
        (l.bundle ? '<span class="line__tag">Stack discount −15% (−' + money(p.price * l.qty * 0.15) + ')</span>' : '') +
        '<div class="qty" role="group" aria-label="Quantity for ' + esc(p.title) + '"><button type="button" aria-label="Decrease quantity" data-qty="-1">−</button><input type="number" min="0" value="' + l.qty + '" aria-label="Quantity" data-qty-input><button type="button" aria-label="Increase quantity" data-qty="1">+</button></div>' +
        '<p class="line__error" role="alert" hidden></p>' +
      '</div>' +
      '<div class="line__right"><span class="line__price">' + money(p.price * l.qty * (l.bundle ? 0.85 : 1)) + '</span><button type="button" class="line__remove" data-remove aria-label="Remove ' + esc(p.title) + '">Remove</button></div>' +
    '</li>';
  }
  function upsellList(n) {
    var inCart = cart.map(function (l) { return l.id; });
    return [4, 1, 7, 13, 15, 5, 10].map(byId).filter(function (p) { return inCart.indexOf(p.id) === -1 && !isSoldOut(p); }).slice(0, n);
  }
  function renderCart() {
    var t = totals();
    $$('[data-cart-count]').forEach(function (c) { c.textContent = t.count; });
    $$('[data-cart-count-label]').forEach(function (c) { c.textContent = '(' + t.count + ')'; });
    var drawer = $('#cart-drawer');
    if (drawer) {
      $('[data-cart-empty]', drawer).hidden = cart.length > 0;
      $('[data-cart-lines]', drawer).innerHTML = cart.map(lineHTML).join('');
      $('[data-cart-foot]', drawer).hidden = cart.length === 0;
      var left = Math.max(0, FREE_SHIP - t.total);
      $('[data-ship-text]', drawer).innerHTML = left > 0 ? 'Spend <strong>' + money(left) + '</strong> more for free express shipping' : '<strong>Free express shipping unlocked</strong>';
      $('[data-ship-bar]', drawer).style.width = Math.min(100, t.total / 250 * 100) + '%';
      $$('[data-perk]', drawer).forEach(function (li) { li.classList.toggle('is-on', t.total >= +li.dataset.perk); });
      $('[data-cart-subtotal]', drawer).textContent = money(t.sub);
      $('[data-bundle-row]', drawer).hidden = t.disc <= 0;
      $('[data-cart-discount]', drawer).textContent = '−' + money(t.disc);
      $('[data-cart-total]', drawer).textContent = money(t.total);
      var gw = $('[data-gift]', drawer); if (gw) gw.checked = giftWrap;
      var ups = upsellList(4); $('[data-upsell]', drawer).hidden = !ups.length;
      $('[data-upsell-track]', drawer).innerHTML = ups.map(function (p) {
        return '<li class="up"><a href="product.html?id=' + p.id + '" tabindex="-1"><img src="' + primaryImg(p, 160, 160) + '" alt="' + esc(p.title) + '" width="64" height="64" loading="lazy"></a>' +
          '<div><a class="up__name" href="product.html?id=' + p.id + '">' + esc(p.title) + '</a><p class="up__why">' + p.type + '</p><p class="up__price">' + money(p.price) + '</p></div>' +
          '<button class="up__add" ' + (p.sizes.length > 1 || p.metals.length > 1 ? 'data-quick="' + p.id + '"' : 'data-add="' + p.id + '"') + ' aria-label="Add ' + esc(p.title) + '">Add</button></li>';
      }).join('');
    }
    document.dispatchEvent(new CustomEvent('ocean:cart-updated', { detail: totals() }));
  }
  function bindLineControls(root) {
    on(root, 'click', function (e) {
      var li = e.target.closest('[data-line]'); if (!li) return;
      var key = li.dataset.line, l = cart.filter(function (x) { return x.key === key; })[0]; if (!l) return;
      var q = e.target.closest('[data-qty]');
      if (q) { lineBusy(li); setTimeout(function () { setQty(key, l.qty + +q.dataset.qty); }, 260); }
      if (e.target.closest('[data-remove]')) { lineBusy(li); setTimeout(function () { removeLine(key); toast('Removed from your bag'); }, 260); }
    });
    on(root, 'change', function (e) {
      if (!e.target.matches('[data-qty-input]')) return;
      var li = e.target.closest('[data-line]'), v = Math.max(0, parseInt(e.target.value, 10) || 0);
      lineBusy(li); setTimeout(function () { setQty(li.dataset.line, v); }, 260);
    });
  }
  function lineBusy(li) { li.classList.add('is-loading'); li.setAttribute('aria-busy', 'true'); }
  document.addEventListener('ocean:line-error', function (e) {
    renderCart();
    $$('[data-line="' + CSS.escape(e.detail.key) + '"] .line__error').forEach(function (er) { er.hidden = false; er.textContent = e.detail.message; });
  });
  function openCart() { openLayerEl($('#cart-drawer'), '[data-close-drawer]'); }
  var drawerEl = $('#cart-drawer');
  if (drawerEl) {
    bindLineControls(drawerEl);
    on($('[data-gift]', drawerEl), 'change', function (e) { giftWrap = e.target.checked; store.set('ocean-gift', giftWrap); renderCart(); });
    on($('[data-checkout]', drawerEl), 'click', function () { toast('Checkout is handled by Shopify'); });
  }
  $$('[data-open-cart]').forEach(function (b) {
    on(b, 'click', function (e) { if (document.body.classList.contains('template-cart')) return; e.preventDefault(); openCart(); });
  });
  $$('.accel__btn').forEach(function (b) { on(b, 'click', function () { toast('Accelerated checkout runs on Shopify'); }); });

  /* ---------- Predictive search ---------- */
  var sInput = $('#search-input');
  function hl(text, q) { if (!q) return esc(text); var i = text.toLowerCase().indexOf(q.toLowerCase()); return i < 0 ? esc(text) : esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length)); }
  function searchProducts(q) {
    q = (q || '').trim().toLowerCase();
    return D.PRODUCTS.filter(function (p) { return !p.hidden && (!q || (p.title + ' ' + p.type + ' ' + p.stone + ' ' + p.metals.map(function (m) { return D.METALS[m].label; }).join(' ')).toLowerCase().indexOf(q) > -1); });
  }
  function renderPredictive(q) {
    var box = $('[data-search-products]'); if (!box) return;
    q = (q || '').trim();
    var res = searchProducts(q), arts = q ? D.ARTICLES.filter(function (a) { return a.title.toLowerCase().indexOf(q.toLowerCase()) > -1; }) : [];
    if (!q) res = res.slice(0, 4);
    $('[data-search-title]').textContent = q ? res.length + ' product' + (res.length === 1 ? '' : 's') : 'Trending now';
    box.innerHTML = res.length ? res.slice(0, 4).map(function (p) {
      return '<li><a class="sp" href="product.html?id=' + p.id + '">' + (p.photo ? '<img src="' + primaryImg(p, 400, 400) + '" alt="" width="200" height="200" loading="lazy">' : '<span class="sp__ph">' + PLACEHOLDER + '</span>') + '<strong>' + hl(p.title, q) + '</strong><span>' + money(p.price) + '</span></a></li>';
    }).join('') : '<li class="search-empty"><strong>No results for “' + esc(q) + '”.</strong> Check the spelling or try “ring”, “pearl” or “gold”.</li>';
    var artBox = $('[data-search-articles]');
    if (artBox) artBox.innerHTML = arts.slice(0, 3).map(function (a) { return '<li><a href="article.html?id=' + a.id + '">' + hl(a.title, q) + '</a></li>'; }).join('');
    var all = $('[data-search-all]'); if (all) { all.href = 'search.html?q=' + encodeURIComponent(q); all.hidden = !q; all.querySelector('span').textContent = q; }
  }
  function openSearch() { renderPredictive(sInput ? sInput.value : ''); openLayerEl($('#search'), '#search-input'); }
  on(sInput, 'input', function () { renderPredictive(sInput.value); });
  $$('[data-open-search]').forEach(function (b) { on(b, 'click', openSearch); });
  $$('[data-close-search]').forEach(function (b) { on(b, 'click', function () { closeAll(); }); });
  $$('[data-suggest]').forEach(function (b) { on(b, 'click', function () { sInput.value = b.dataset.suggest; renderPredictive(sInput.value); sInput.focus(); }); });
  on($('[data-search-form]'), 'submit', function (e) { e.preventDefault(); location.href = 'search.html?q=' + encodeURIComponent(sInput.value.trim()); });

  /* ---------- Newsletter forms (success + error states) ---------- */
  $$('[data-newsletter]').forEach(function (f) {
    on(f, 'submit', function (e) {
      e.preventDefault();
      var inp = $('input[type="email"]', f), msg = $('[data-form-msg]', f), btn = $('button[type="submit"]', f);
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim());
      inp.setAttribute('aria-invalid', String(!ok));
      if (!ok) { msg.className = 'form-msg is-error'; msg.textContent = 'Enter a valid email address, like name@example.com.'; inp.focus(); return; }
      btn.classList.add('is-loading'); btn.disabled = true;
      setTimeout(function () { btn.classList.remove('is-loading'); btn.disabled = false; msg.className = 'form-msg is-success'; msg.textContent = 'You’re subscribed. Your welcome code is on its way.'; inp.value = ''; }, 700);
    });
  });

  /* ---------- Theme settings panel ---------- */
  var sToggle = $('[data-settings-toggle]'), sPanel = $('#settings-panel');
  on(sToggle, 'click', function (e) { e.stopPropagation(); var open = sPanel.hidden; sPanel.hidden = !open; sToggle.setAttribute('aria-expanded', String(open)); });
  on(sPanel, 'click', function (e) { e.stopPropagation(); });
  document.addEventListener('click', function () { if (sPanel && !sPanel.hidden) { sPanel.hidden = true; sToggle.setAttribute('aria-expanded', 'false'); } });
  var prefs = store.get('ocean-prefs', { scheme: 'ocean', corners: 'rounded', sections: false });
  function applyPrefs() {
    document.documentElement.setAttribute('data-scheme', prefs.scheme);
    document.documentElement.setAttribute('data-corners', prefs.corners);
    document.body.classList.toggle('show-sections', !!prefs.sections);
    $$('input[name="scheme"]').forEach(function (i) { i.checked = i.value === prefs.scheme; });
    $$('input[name="corners"]').forEach(function (i) { i.checked = i.value === prefs.corners; });
    var ss = $('[data-show-sections]'); if (ss) ss.checked = !!prefs.sections;
  }
  $$('input[name="scheme"], input[name="corners"]').forEach(function (i) { on(i, 'change', function () { prefs[i.name] = i.value; store.set('ocean-prefs', prefs); applyPrefs(); }); });
  on($('[data-show-sections]'), 'change', function () { prefs.sections = this.checked; store.set('ocean-prefs', prefs); applyPrefs(); });
  applyPrefs();

  /* ---------- Reveal + count-up ---------- */
  function initReveal(root) {
    var targets = $$('.section-head, .reveal-me, .concern-track > li, .story__copy, .story__media, .look__media, .look__panel, .tile, .bstep, .body-feature__media, .body-feature__copy, .reviews__head, .review, .jfeat, .jside, .faq__aside, .newsletter__card, .footer__hero, .footer__top > *', root);
    if (!('IntersectionObserver' in window) || reduceMotion) return;
    targets.forEach(function (el, i) { if (el.classList.contains('reveal')) return; el.classList.add('reveal'); el.style.transitionDelay = ((i % 4) * 70) + 'ms'; });
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }
  function countUp(el) {
    var to = +el.dataset.count, t0 = null; if (reduceMotion) { el.textContent = to; return; }
    function step(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { countUp(x.target); io2.unobserve(x.target); } }); }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { io2.observe(el); });
  } else $$('[data-count]').forEach(function (el) { el.textContent = el.dataset.count; });

  /* ---------- Scroll-track progress bars ---------- */
  $$('[data-track-bar]').forEach(function (bar) {
    var tr = $(bar.dataset.trackBar); if (!tr) return;
    function upd() { var w = tr.clientWidth / tr.scrollWidth, max = tr.scrollWidth - tr.clientWidth; bar.style.width = (w * 100) + '%'; bar.style.left = (max > 0 ? (tr.scrollLeft / max) * (1 - w) * 100 : 0) + '%'; }
    on(tr, 'scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
  });

  /* =========================================================
     HOME-ONLY SECTIONS (each guarded)
     ========================================================= */

  /* Hero slideshow */
  var hero = $('.hero');
  if (hero && $$('.hero__img', hero).length > 1) {
    var slideImgs = $$('.hero__img', hero), slideTexts = $$('.hero__text', hero), dots = $$('.hero__dot', hero);
    var slideMeta = JSON.parse(hero.dataset.slides || '[]');
    var si = 0, SLIDE_MS = 6500, slideTimer = null, paused = reduceMotion;
    hero.style.setProperty('--slide-ms', SLIDE_MS + 'ms');
    var schedule = function () { clearTimeout(slideTimer); if (!paused) slideTimer = setTimeout(function () { goSlide(si + 1); }, SLIDE_MS); };
    var goSlide = function (n) {
      si = (n + slideImgs.length) % slideImgs.length;
      hero.setAttribute('data-slide', si);
      var num = $('[data-hero-num]', hero); if (num) num.textContent = '0' + (si + 1);
      slideImgs.forEach(function (im, i) { im.classList.toggle('is-active', i === si); });
      slideTexts.forEach(function (t, i) { t.classList.toggle('is-active', i === si); t.setAttribute('aria-hidden', String(i !== si)); });
      dots.forEach(function (d, i) { d.classList.remove('is-active'); void d.offsetWidth; d.classList.toggle('is-active', i === si); d.setAttribute('aria-selected', String(i === si)); });
      var m = slideMeta[si];
      if (m) {
        var p = byId(m.id);
        $('[data-hero-eyebrow]', hero).textContent = m.eyebrow;
        var cta = $('[data-hero-cta]', hero); cta.textContent = m.cta; cta.href = m.href;
        $('[data-chip-img]', hero).src = primaryImg(p, 160, 160);
        $('[data-chip-name]', hero).textContent = p.title;
        var cp = $('[data-chip-price]', hero); cp.setAttribute('data-money', p.price); cp.textContent = money(p.price);
        var ca = $('[data-chip-add]', hero); ca.setAttribute('data-quick', p.id); ca.setAttribute('aria-label', 'Choose options for ' + p.title);
      }
      schedule();
    };
    dots.forEach(function (d, i) { on(d, 'click', function () { goSlide(i); }); });
    on($('[data-hero-prev]', hero), 'click', function () { goSlide(si - 1); });
    on($('[data-hero-next]', hero), 'click', function () { goSlide(si + 1); });
    var pauseBtn = $('[data-hero-pause]', hero);
    var setPaused = function (v) { paused = v; hero.classList.toggle('is-paused', v); if (pauseBtn) pauseBtn.setAttribute('aria-label', v ? 'Play slideshow' : 'Pause slideshow'); schedule(); };
    on(pauseBtn, 'click', function () { setPaused(!paused); });
    setPaused(paused);
    var x0 = null;
    on(hero, 'touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    on(hero, 'touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) goSlide(si + (dx < 0 ? 1 : -1)); x0 = null; });
  }

  /* Featured collection tabs */
  var grid = $('#product-grid');
  if (grid) {
    var activeTab = 'all';
    var renderGrid = function () {
      var list = D.PRODUCTS.filter(function (p) {
        if (p.hidden) return false;
        if (activeTab === 'all') return true;
        if (activeTab === 'new') return p.tags.indexOf('new') > -1;
        return p.type.toLowerCase() === activeTab;
      }).slice(0, 8);
      grid.innerHTML = list.map(cardHTML).join('');
    };
    $$('[data-tab]').forEach(function (t) {
      on(t, 'click', function () {
        activeTab = t.dataset.tab;
        $$('[data-tab]').forEach(function (x) { var o = x === t; x.classList.toggle('is-active', o); x.setAttribute('aria-selected', String(o)); });
        grid.innerHTML = skeletonCards(4); grid.setAttribute('aria-busy', 'true');
        setTimeout(function () { renderGrid(); grid.removeAttribute('aria-busy'); }, 320);
      });
    });
    renderGrid();
    document.addEventListener('ocean:refresh', renderGrid);
  }

  /* Bundle (stack) builder */
  var bSteps = $('#builder-steps');
  if (bSteps) {
    var STEPS = [
      { key: 'chain', title: 'Chain', hint: 'The base layer', ids: [5, 10] },
      { key: 'pendant', title: 'Pendant', hint: 'Add a focal point', ids: [1, 7] },
      { key: 'ear', title: 'Earrings', hint: 'Finish the set', ids: [4, 13] }
    ];
    var picked = { chain: 5, pendant: null, ear: null };
    var renderBuilder = function () {
      bSteps.innerHTML = STEPS.map(function (s, i) {
        return '<div class="bstep' + (picked[s.key] ? ' is-done' : '') + '">' +
          '<div class="bstep__head"><span class="bstep__num">' + (picked[s.key] ? '✓' : '0' + (i + 1)) + '</span><p class="bstep__title">' + s.title + '<span class="bstep__hint">Step ' + (i + 1) + ' · ' + s.hint + '</span></p></div>' +
          '<div class="bstep__opts">' + s.ids.map(function (id) {
            var p = byId(id);
            return '<button class="bopt" aria-pressed="' + (picked[s.key] === id) + '" data-pick="' + s.key + ':' + id + '">' +
              '<img src="' + primaryImg(p, 200, 200) + '" alt="" width="84" height="84" loading="lazy">' +
              '<span><strong>' + esc(p.title) + '</strong><span class="bopt__type">' + D.METALS[p.metals[0]].label + '</span><span class="bopt__price">' + money(p.price) + '</span></span><span class="bopt__check" aria-hidden="true"></span></button>';
          }).join('') + '</div></div>';
      }).join('');
      var full = 0, n = 0;
      $('#builder-picked').innerHTML = STEPS.map(function (s, i) {
        var p = picked[s.key] ? byId(picked[s.key]) : null;
        if (!p) return '<li aria-label="Step ' + (i + 1) + ' empty">' + (i + 1) + '</li>';
        full += p.price; n++;
        return '<li class="is-filled"><img src="' + primaryImg(p, 120, 120) + '" alt="' + esc(p.title) + '" width="56" height="56"></li>';
      }).join('');
      var done = n === STEPS.length, left = STEPS.length - n;
      $$('[data-mini]').forEach(function (li, i) { li.classList.toggle('is-on', !!picked[STEPS[i].key]); });
      $('#builder-count').textContent = n + '/' + STEPS.length;
      $('#builder-meter').style.width = (n / STEPS.length * 100) + '%';
      $('#builder-compare').textContent = money(full);
      $('#builder-compare').style.visibility = done ? 'visible' : 'hidden';
      $('#builder-total').textContent = money(done ? full * 0.85 : full);
      $('#builder-save').textContent = done ? 'Stack unlocked: you save ' + money(full * 0.15) : 'Choose ' + left + ' more to unlock 15% off';
      $('#builder-add').disabled = !done;
    };
    on(bSteps, 'click', function (e) {
      var b = e.target.closest('[data-pick]'); if (!b) return;
      var parts = b.dataset.pick.split(':'); picked[parts[0]] = +parts[1]; renderBuilder();
      var again = $('[data-pick="' + b.dataset.pick + '"]'); if (again) again.focus();
    });
    on($('#builder-add'), 'click', function () {
      STEPS.forEach(function (s) { addToCart(picked[s.key], 1, { bundle: true, silent: true }); });
      toast('Stack added, 15% discount applied'); openCart();
    });
    renderBuilder();
    document.addEventListener('ocean:refresh', renderBuilder);
  }

  /* Shop the look */
  function lookActive(n) {
    $$('[data-pin]').forEach(function (p) { p.classList.toggle('is-active', p.dataset.pin === String(n)); });
    $$('[data-look]').forEach(function (r) { r.classList.toggle('is-active', r.dataset.look === String(n)); });
  }
  $$('[data-pin]').forEach(function (p) {
    on(p, 'mouseenter', function () { lookActive(p.dataset.pin); });
    on(p, 'click', function () { lookActive(p.dataset.pin); var row = $('[data-look="' + p.dataset.pin + '"]'); if (row) { var b = $('button', row); if (b) b.focus({ preventScroll: window.innerWidth >= 990 }); } });
  });
  $$('[data-look]').forEach(function (r) { on(r, 'mouseenter', function () { lookActive(r.dataset.look); }); });
  on($('.look'), 'mouseleave', function () { lookActive(0); });
  $$('[data-add-look]').forEach(function (b) {
    on(b, 'click', function () { b.dataset.addLook.split(',').forEach(function (id) { addToCart(+id, 1, { silent: true }); }); toast('The complete look is in your bag'); openCart(); });
  });

  /* FAQ category tabs */
  $$('[data-faq]').forEach(function (t) {
    on(t, 'click', function () {
      var cat = t.dataset.faq;
      $$('[data-faq]').forEach(function (x) { var o = x === t; x.classList.toggle('is-active', o); x.setAttribute('aria-selected', String(o)); });
      $$('.faq__list details').forEach(function (d) { d.hidden = !(cat === 'all' || d.dataset.cat === cat); });
    });
  });

  /* Light parallax */
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

  /* ---------- Refresh everything that shows prices ---------- */
  function refreshAll() { refreshMoney(); renderCart(); document.dispatchEvent(new CustomEvent('ocean:refresh')); }

  /* ---------- Public API for template scripts ---------- */
  window.OceanUI = {
    $: $, $$: $$, on: on, esc: esc, qs: qs, store: store, money: money, toast: toast, byId: byId, isSoldOut: isSoldOut,
    cardHTML: cardHTML, skeletonCards: skeletonCards, primaryImg: primaryImg, PLACEHOLDER: PLACEHOLDER, priceHTML: priceHTML, unitPrice: unitPrice,
    variantState: variantState, optionHTML: optionHTML, bindOptions: bindOptions,
    addToCart: addToCart, setQty: setQty, removeLine: removeLine, getCart: function () { return cart; }, totals: totals, lineHTML: lineHTML,
    bindLineControls: bindLineControls, upsellList: upsellList, renderCart: renderCart, openCart: openCart, openLayer: openLayerEl, closeAll: closeAll,
    searchProducts: searchProducts, initReveal: initReveal, reduceMotion: reduceMotion,
    setGiftWrap: function (v) { giftWrap = v; store.set('ocean-gift', v); renderCart(); }, getGiftWrap: function () { return giftWrap; }
  };

  refreshMoney();
  renderCart();
  initReveal();
})();
