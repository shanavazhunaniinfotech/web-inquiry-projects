/* =========================================================
   OCEAN — template scripts (collection, product, cart, search,
   blog, article, contact, account, password, gift card, states)
   ========================================================= */
(function () {
  'use strict';
  var D = window.OCEAN, U = window.OceanUI;
  if (!U) return;
  var R = U.R || '';
  var $ = U.$, $$ = U.$$, on = U.on, esc = U.esc, money = U.money;
  var body = document.body;
  var is = function (t) { return body.classList.contains('template-' + t); };
  var CHECK = '<svg width="12" height="12" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------- Generic form validation (contact, account, comments, password) ---------- */
  var RULES = {
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address, like name@example.com.'; },
    required: function (v, el) { return v ? '' : (el.dataset.label || 'This field') + ' is required.'; },
    min8: function (v) { return v.length >= 8 ? '' : 'Use at least 8 characters.'; },
    match: function (v, el) { var o = document.getElementById(el.dataset.match); return o && o.value === v ? '' : 'Passwords don’t match.'; }
  };
  function validate(form) {
    var errors = [];
    $$('[data-rules]', form).forEach(function (el) {
      var v = el.type === 'checkbox' ? (el.checked ? 'on' : '') : el.value.trim(), msg = '';
      el.dataset.rules.split(' ').some(function (r) { msg = RULES[r](v, el); return !!msg; });
      var err = $('#' + el.id + '-error');
      el.setAttribute('aria-invalid', String(!!msg));
      if (err) { err.textContent = msg; err.hidden = !msg; }
      el.closest('.field') && el.closest('.field').classList.toggle('has-error', !!msg);
      if (msg) errors.push({ el: el, msg: msg });
    });
    var sum = $('[data-error-summary]', form);
    if (sum) {
      sum.hidden = !errors.length;
      if (errors.length) {
        sum.innerHTML = '<p><strong>Please fix ' + errors.length + ' error' + (errors.length > 1 ? 's' : '') + ':</strong></p><ul>' + errors.map(function (e) { return '<li><a href="#' + e.el.id + '">' + esc(e.msg) + '</a></li>'; }).join('') + '</ul>';
        sum.focus();
      }
    } else if (errors.length) errors[0].el.focus();
    return !errors.length;
  }
  function submitting(btn, fn) { btn.classList.add('is-loading'); btn.disabled = true; btn.setAttribute('aria-busy', 'true'); setTimeout(function () { btn.classList.remove('is-loading'); btn.disabled = false; btn.removeAttribute('aria-busy'); fn(); }, 900); }
  $$('form[data-validate]').forEach(function (f) {
    on(f, 'submit', function (e) {
      e.preventDefault();
      if (!validate(f)) return;
      var btn = $('button[type="submit"]', f);
      submitting(btn, function () {
        var custom = f.dataset.validate;
        if (custom === 'login' && $('#login-password', f).value !== 'ocean2026') {
          var s = $('[data-error-summary]', f); s.hidden = false; s.innerHTML = '<p><strong>Incorrect email or password.</strong> Check your details or reset your password. (Demo password: ocean2026)</p>'; s.focus(); return;
        }
        if (custom === 'password' && $('#store-password', f).value !== 'ocean') {
          var s2 = $('[data-error-summary]', f); s2.hidden = false; s2.innerHTML = '<p><strong>Wrong password.</strong> Try again. (Demo password: ocean)</p>'; s2.focus(); return;
        }
        var ok = $(f.dataset.success || '[data-form-success]', f.parentNode) || $('[data-form-success]', f);
        if (ok) { f.hidden = true; ok.hidden = false; ok.focus(); }
        else U.toast('Done');
      });
    });
  });

  /* =========================================================
     FACETED FILTERING (collection + search)
     ========================================================= */
  function Facets(root, baseList) {
    var state = { avail: [], type: [], metal: [], stone: [], min: 0, max: 0, sort: root.dataset.defaultSort || 'featured', page: 1 };
    var PER = 9;
    var all = baseList.filter(function (p) { return !p.hidden; });
    var priceMax = Math.ceil(Math.max.apply(null, all.map(function (p) { return p.price; }).concat([100])) / 50) * 50;
    state.max = priceMax;
    var GROUPS = [
      { key: 'avail', label: 'Availability', values: function () { return [['in', 'In stock'], ['out', 'Out of stock']]; }, test: function (p, v) { return v === 'in' ? !U.isSoldOut(p) : U.isSoldOut(p); } },
      { key: 'price', label: 'Price' },
      { key: 'type', label: 'Product type', values: function () { return ['Rings', 'Necklaces', 'Earrings', 'Bracelets'].map(function (t) { return [t, t]; }); }, test: function (p, v) { return p.type === v; } },
      { key: 'metal', label: 'Metal', swatch: true, values: function () { return Object.keys(D.METALS).map(function (k) { return [k, D.METALS[k].label]; }); }, test: function (p, v) { return p.metals.indexOf(v) > -1; } },
      { key: 'stone', label: 'Stone', values: function () { return ['Diamond', 'Pearl', 'Sapphire', 'Amethyst', 'Morganite', 'Topaz', 'Crystal', 'None'].map(function (s) { return [s, s === 'None' ? 'No stone' : s]; }); }, test: function (p, v) { return p.stone === v; } }
    ];
    var grid = $('[data-results]', root), countEl = $$('[data-count-results]', root), chips = $('[data-active]', root);
    var side = $('[data-filters]', root), empty = $('[data-empty]', root), pager = $('[data-pager]', root);

    function passes(p, skip) {
      for (var i = 0; i < GROUPS.length; i++) {
        var g = GROUPS[i]; if (g.key === skip) continue;
        if (g.key === 'price') { if (p.price < state.min || p.price > state.max) return false; continue; }
        var sel = state[g.key]; if (sel.length && !sel.some(function (v) { return g.test(p, v); })) return false;
      }
      return true;
    }
    function sorted(list) {
      var l = list.slice();
      var s = state.sort;
      if (s === 'price-asc') l.sort(function (a, b) { return a.price - b.price; });
      else if (s === 'price-desc') l.sort(function (a, b) { return b.price - a.price; });
      else if (s === 'best') l.sort(function (a, b) { return b.reviews - a.reviews; });
      else if (s === 'az') l.sort(function (a, b) { return a.title.localeCompare(b.title); });
      else if (s === 'new') l.sort(function (a, b) { return (b.tags.indexOf('new') > -1) - (a.tags.indexOf('new') > -1) || b.id - a.id; });
      return l;
    }
    function renderFilters() {
      side.querySelector('[data-groups]').innerHTML = GROUPS.map(function (g, gi) {
        if (g.key === 'price') {
          return '<details class="fgroup" open><summary>Price</summary><div class="fgroup__body">' +
            '<div class="range" style="--a:' + (state.min / priceMax * 100) + '%;--b:' + (state.max / priceMax * 100) + '%"><input type="range" min="0" max="' + priceMax + '" step="10" value="' + state.min + '" aria-label="Minimum price" data-range="min"><input type="range" min="0" max="' + priceMax + '" step="10" value="' + state.max + '" aria-label="Maximum price" data-range="max"></div>' +
            '<div class="range__inputs"><label class="field field--sm"><span>From</span><input type="number" inputmode="numeric" min="0" max="' + priceMax + '" value="' + state.min + '" data-price="min"></label><span aria-hidden="true">–</span><label class="field field--sm"><span>To</span><input type="number" inputmode="numeric" min="0" max="' + priceMax + '" value="' + state.max + '" data-price="max"></label></div>' +
            '<p class="fgroup__note">The highest price is ' + money(priceMax) + '</p></div></details>';
        }
        var vals = g.values(), sel = state[g.key];
        var items = vals.map(function (v) {
          var n = all.filter(function (p) { return passes(p, g.key) && g.test(p, v[0]); }).length;
          var checked = sel.indexOf(v[0]) > -1, dis = !n && !checked;
          var id = 'f-' + g.key + '-' + String(v[0]).replace(/\W/g, '');
          return '<li><label class="fcheck' + (dis ? ' is-disabled' : '') + '" for="' + id + '"><input type="checkbox" id="' + id + '" value="' + esc(v[0]) + '" data-group="' + g.key + '"' + (checked ? ' checked' : '') + (dis ? ' disabled' : '') + '>' +
            (g.swatch ? '<span class="fcheck__sw" style="--sw:' + D.METALS[v[0]].hex + '"></span>' : '<span class="fcheck__box" aria-hidden="true">' + CHECK + '</span>') +
            '<span class="fcheck__label">' + esc(v[1]) + '</span><span class="fcheck__count">(' + n + ')<span class="visually-hidden"> products</span></span></label></li>';
        }).join('');
        return '<details class="fgroup"' + (gi < 5 ? ' open' : '') + '><summary>' + g.label + (sel.length ? ' <span class="fgroup__n">' + sel.length + '</span>' : '') + '</summary><div class="fgroup__body"><ul class="fgroup__list">' + items + '</ul></div></details>';
      }).join('');
    }
    function renderChips() {
      var list = [];
      GROUPS.forEach(function (g) {
        if (g.key === 'price') { if (state.min > 0 || state.max < priceMax) list.push({ g: 'price', label: 'Price: ' + money(state.min) + '–' + money(state.max) }); return; }
        state[g.key].forEach(function (v) { var lab = g.values().filter(function (x) { return x[0] === v; })[0][1]; list.push({ g: g.key, v: v, label: g.label + ': ' + lab }); });
      });
      chips.innerHTML = list.map(function (c) { return '<li><button class="chip" data-remove-filter="' + c.g + '"' + (c.v ? ' data-value="' + esc(c.v) + '"' : '') + ' aria-label="Remove filter ' + esc(c.label) + '">' + esc(c.label) + ' <span aria-hidden="true">×</span></button></li>'; }).join('') +
        (list.length ? '<li><button class="chip chip--clear" data-clear-all>Clear all</button></li>' : '');
      chips.hidden = !list.length;
      $$('[data-filter-count]', root).forEach(function (b) { b.textContent = list.length ? '(' + list.length + ')' : ''; });
    }
    function renderGrid(withLoad) {
      var list = sorted(all.filter(function (p) { return passes(p); }));
      countEl.forEach(function (c) { c.textContent = list.length + ' product' + (list.length === 1 ? '' : 's'); });
      var pages = Math.max(1, Math.ceil(list.length / PER)); if (state.page > pages) state.page = pages;
      var slice = list.slice((state.page - 1) * PER, state.page * PER);
      function paint() {
        grid.removeAttribute('aria-busy');
        grid.innerHTML = slice.map(U.cardHTML).join('');
        empty.hidden = list.length > 0; grid.hidden = !list.length;
        pager.innerHTML = pages > 1 ? '<button class="pager__btn" data-page="' + (state.page - 1) + '"' + (state.page === 1 ? ' disabled' : '') + ' aria-label="Previous page">‹</button>' +
          Array.apply(null, Array(pages)).map(function (_, i) { var n = i + 1; return '<button class="pager__btn' + (n === state.page ? ' is-current' : '') + '" data-page="' + n + '"' + (n === state.page ? ' aria-current="page"' : '') + ' aria-label="Page ' + n + '">' + n + '</button>'; }).join('') +
          '<button class="pager__btn" data-page="' + (state.page + 1) + '"' + (state.page === pages ? ' disabled' : '') + ' aria-label="Next page">›</button>' : '';
        var showBtn = $('[data-show-results]', root); if (showBtn) showBtn.textContent = 'Show ' + list.length + ' result' + (list.length === 1 ? '' : 's');
      }
      if (withLoad) { grid.hidden = false; empty.hidden = true; grid.setAttribute('aria-busy', 'true'); grid.innerHTML = U.skeletonCards(Math.min(6, Math.max(3, slice.length))); setTimeout(paint, 380); }
      else paint();
    }
    function update(load) { renderFilters(); renderChips(); renderGrid(load !== false); }

    on(side, 'change', function (e) {
      var t = e.target;
      if (t.dataset.group) { var arr = state[t.dataset.group]; var i = arr.indexOf(t.value); if (t.checked && i < 0) arr.push(t.value); if (!t.checked && i > -1) arr.splice(i, 1); state.page = 1; var id = t.id; update(); var again = $('#' + id); if (again) again.focus(); }
      if (t.dataset.price) { var v = Math.max(0, Math.min(priceMax, +t.value || 0)); state[t.dataset.price] = v; if (state.min > state.max) { var x = state.min; state.min = state.max; state.max = x; } state.page = 1; update(); }
    });
    on(side, 'input', function (e) {
      var t = e.target; if (!t.dataset.range) return;
      state[t.dataset.range] = +t.value; if (state.min > state.max - 10) { if (t.dataset.range === 'min') state.min = state.max - 10; else state.max = state.min + 10; t.value = state[t.dataset.range]; }
      var r = t.parentNode; r.style.setProperty('--a', state.min / priceMax * 100 + '%'); r.style.setProperty('--b', state.max / priceMax * 100 + '%');
      $('[data-price="min"]', side).value = state.min; $('[data-price="max"]', side).value = state.max;
      clearTimeout(t._d); t._d = setTimeout(function () { state.page = 1; renderChips(); renderGrid(true); }, 250);
    });
    on(root, 'click', function (e) {
      var rm = e.target.closest('[data-remove-filter]');
      if (rm) { var g = rm.dataset.removeFilter; if (g === 'price') { state.min = 0; state.max = priceMax; } else state[g].splice(state[g].indexOf(rm.dataset.value), 1); update(); return; }
      if (e.target.closest('[data-clear-all]')) { state.avail = []; state.type = []; state.metal = []; state.stone = []; state.min = 0; state.max = priceMax; state.page = 1; update(); return; }
      var pg = e.target.closest('[data-page]'); if (pg && !pg.disabled) { state.page = +pg.dataset.page; renderGrid(true); root.scrollIntoView({ behavior: U.reduceMotion ? 'auto' : 'smooth' }); return; }
      var tg = e.target.closest('[data-filter-toggle]');
      if (tg) {
        if (window.innerWidth < 990) { openMobile(tg.dataset.focusGroup); return; }
        var open = !root.classList.contains('is-filters-closed');
        root.classList.toggle('is-filters-closed', open);
        $$('[data-filter-toggle]', root).forEach(function (b) { b.setAttribute('aria-expanded', String(!open)); });
        var lbl = $('[data-filter-label]', root); if (lbl) lbl.textContent = open ? 'Show filters' : 'Hide filters';
        return;
      }
      if (e.target.closest('[data-close-filters]') || e.target.closest('[data-show-results]')) closeMobile();
    });
    on($('[data-sort]', root), 'change', function (e) { state.sort = e.target.value; state.page = 1; renderGrid(true); });
    function openMobile(group) {
      side.classList.add('is-open'); body.classList.add('lock'); side.setAttribute('aria-modal', 'true'); side.setAttribute('role', 'dialog');
      setTimeout(function () { var tgt = group ? $$('.fgroup summary', side).filter(function (s) { return s.textContent.indexOf(group) === 0; })[0] : $('[data-close-filters]', side); if (tgt) { if (tgt.parentNode.tagName === 'DETAILS') tgt.parentNode.open = true; tgt.focus(); } }, 60);
    }
    function closeMobile() { if (!side.classList.contains('is-open')) return; side.classList.remove('is-open'); body.classList.remove('lock'); side.removeAttribute('aria-modal'); side.removeAttribute('role'); var b = $('[data-filter-toggle]', root); if (b) b.focus(); }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMobile(); });
    document.addEventListener('ocean:refresh', function () { update(false); });
    update(false);
    if (U.qs('filters') === 'open') { if (window.innerWidth < 990) setTimeout(function () { openMobile(); }, 200); else { root.classList.remove('is-filters-closed'); } }
    return { state: state, update: update };
  }

  /* ---------- Collection ---------- */
  if (is('collection')) {
    var handle = U.qs('c') || 'all';
    var col = D.COLLECTIONS.filter(function (c) { return c.handle === handle; })[0] || D.COLLECTIONS[0];
    var base = col.match ? D.PRODUCTS.filter(col.match) : D.PRODUCTS.slice();
    $('[data-col-title]').textContent = col.title;
    $('[data-col-crumb]').textContent = col.title;
    $('[data-col-desc]').textContent = col.desc;
    document.title = col.title + ' | Ocean Fine Jewellery';
    var hero = $('[data-col-image]');
    var imgId = col.image || (base.filter(function (p) { return p.photo; })[0] || {}).photo;
    if (imgId) hero.innerHTML = '<img src="' + D.img(imgId, 1200, 700) + '" alt="" width="1200" height="700">'; else hero.hidden = true;
    $$('[data-col-nav] a').forEach(function (a) { if (a.dataset.handle === handle) a.setAttribute('aria-current', 'page'); });
    if (!base.length) {
      $('[data-facets]').hidden = true; $('[data-col-empty]').hidden = false;
    } else Facets($('[data-facets]'), base);
  }

  /* ---------- Collection list ---------- */
  if (is('list-collections')) {
    var listEl = $('[data-collection-list]');
    listEl.innerHTML = D.COLLECTIONS.map(function (c, i) {
      var prods = c.match ? D.PRODUCTS.filter(function (p) { return !p.hidden && c.match(p); }) : D.PRODUCTS.filter(function (p) { return !p.hidden; });
      var imgId = c.image || (prods.filter(function (p) { return p.photo; })[0] || {}).photo;
      return '<li class="ccard' + (i === 0 ? ' ccard--wide' : '') + (imgId ? '' : ' ccard--noimg') + '"><a href="' + R + 'collection/?c=' + c.handle + '">' +
        '<div class="ccard__media">' + (imgId ? '<img src="' + D.img(imgId, 900, 1000) + '" alt="" width="450" height="500" loading="lazy">' : '<span class="ccard__mono" aria-hidden="true">' + c.title.charAt(0) + '</span>') + '</div>' +
        '<div class="ccard__body"><h2>' + esc(c.title) + '</h2><p>' + prods.length + ' product' + (prods.length === 1 ? '' : 's') + '</p><span class="ccard__arrow" aria-hidden="true">→</span></div></a></li>';
    }).join('');
  }

  /* =========================================================
     PRODUCT
     ========================================================= */
  if (is('product')) {
    var p = U.byId(U.qs('id')) || U.byId(2);
    var firstAvail = p.sizes.filter(function (s) { return U.variantState(p, p.metals[0], s) === 'available'; })[0] || p.sizes[0];
    var sel = { metal: p.metals[0], size: firstAvail, qty: 1 };
    document.title = p.title + ' | Ocean Fine Jewellery';
    $('[data-p-crumb-type]').textContent = p.type; $('[data-p-crumb-type]').href = R + 'collection/?c=' + p.type.toLowerCase();
    $('[data-p-crumb]').textContent = p.title;

    /* gallery */
    var media = p.photo ? [p.fp].concat(p.detail).map(function (fp, i) { return { src: D.img(p.photo, 1200, 1500, fp), thumb: D.img(p.photo, 200, 250, fp), alt: i ? p.title + ', detail ' + i : p.title }; }) : [];
    var gal = $('[data-gallery]');
    if (p.giftCard) gal.innerHTML = '<div class="pg__giftcard"><div class="gc__card gc__card--lg" role="img" aria-label="Ocean gift card"><div class="gc__card-top"><span>Ocean</span></div><p class="gc__card-amount">Gift card</p><p class="gc__card-foot">Never expires · Delivered by email</p></div></div>';
    else if (!media.length) gal.innerHTML = '<div class="pg__placeholder">' + U.PLACEHOLDER + '<p>Image coming soon</p></div>';
    else {
      gal.innerHTML = '<ul class="pg__track" data-track>' + media.map(function (m, i) {
        return '<li class="pg__item pg__item--' + i + '"><button class="pg__zoom" data-zoom="' + i + '" aria-label="Open image ' + (i + 1) + ' of ' + media.length + ' in full screen"><img src="' + m.src + '" alt="' + esc(m.alt) + '" width="1200" height="1500"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + '></button></li>';
      }).join('') + '</ul><p class="pg__counter" aria-hidden="true"><span data-pg-n>1</span> / ' + media.length + '</p>';
      var track = $('[data-track]', gal);
      on(track, 'scroll', function () { var n = Math.round(track.scrollLeft / track.clientWidth) + 1; $('[data-pg-n]', gal).textContent = n; }, { passive: true });
      var lb = $('#lightbox'), li = 0;
      var showLb = function (i) { li = (i + media.length) % media.length; $('[data-lb-img]').src = media[li].src.replace('w=1200', 'w=2000').replace('h=1500', 'h=2500'); $('[data-lb-img]').alt = media[li].alt; $('[data-lb-n]').textContent = (li + 1) + ' / ' + media.length; };
      on(gal, 'click', function (e) { var z = e.target.closest('[data-zoom]'); if (z) { showLb(+z.dataset.zoom); U.openLayer(lb, '[data-close-modal]'); } });
      on($('[data-lb-prev]'), 'click', function () { showLb(li - 1); });
      on($('[data-lb-next]'), 'click', function () { showLb(li + 1); });
    }

    /* info */
    var info = $('[data-pinfo]');
    function variantNotice(st) {
      if (st === 'available') return '';
      var what = (p.type === 'Rings' ? 'Size ' + sel.size : sel.size) + ' in ' + D.METALS[sel.metal].label;
      var msg = U.isSoldOut(p) ? 'This piece is sold out in every size.' : (st === 'soldout' ? what + ' is sold out.' : what + ' isn’t made.');
      return '<div class="pnotice" role="status"><p><strong>' + msg + '</strong> ' + (U.isSoldOut(p) ? 'We’re making more.' : 'Choose another option above, or') + '</p><button type="button" class="link-u" data-notify>Email me when it’s available</button></div>';
    }
    function giftAmount() { return +String(sel.size).replace('$', ''); }
    function priceBlock() {
      if (p.giftCard) return '<strong data-money="' + giftAmount() + '">' + money(giftAmount()) + '</strong>';
      return U.priceHTML(p) + (p.compare ? '<span class="pinfo__sale">Sale · save ' + money(p.compare - p.price) + '</span>' : '');
    }
    function renderInfo() {
      var st = U.variantState(p, sel.metal, sel.size);
      var unit = p.giftCard ? giftAmount() : p.price;
      var buyLabel = st === 'available' ? 'Add to bag · <span data-money="' + unit * sel.qty + '">' + money(unit * sel.qty) + '</span>' : (st === 'soldout' ? 'Sold out' : 'Unavailable');
      var giftFields = p.giftCard ?
        '<div class="giftto"><label class="fcheck" for="gift-send"><input type="checkbox" id="gift-send"' + (sel.gift ? ' checked' : '') + '><span class="fcheck__box" aria-hidden="true">' + CHECK + '</span><span class="fcheck__label">Send it to someone as a gift</span></label>' +
        '<div class="giftto__fields form-grid" data-gift-fields' + (sel.gift ? '' : ' hidden') + '>' +
          '<div class="field"><label for="g-email">Recipient email</label><input id="g-email" type="email" autocomplete="off" value="' + esc(sel.gEmail || '') + '"><p class="field__error" id="g-email-error" hidden></p></div>' +
          '<div class="field"><label for="g-name">Recipient name <span class="muted">(optional)</span></label><input id="g-name" autocomplete="off" value="' + esc(sel.gName || '') + '"></div>' +
          '<div class="field field--full"><label for="g-msg">Message <span class="muted">(optional)</span></label><textarea id="g-msg" rows="3" maxlength="200">' + esc(sel.gMsg || '') + '</textarea><span class="field__count"><span data-gmsg-n>' + (sel.gMsg || '').length + '</span>/200</span></div>' +
          '<div class="field"><label for="g-date">Send on <span class="muted">(optional)</span></label><input id="g-date" type="date" value="' + esc(sel.gDate || '') + '"></div>' +
        '</div></div>' : '';
      info.innerHTML =
        '<p class="eyebrow">' + (p.giftCard ? 'Gift card' : p.type) + '</p>' +
        '<h1 class="pinfo__title">' + esc(p.title) + '</h1>' +
        '<div class="pinfo__row"><div class="pinfo__price">' + priceBlock() + '</div>' + (p.giftCard ? '' : '<a class="pinfo__rating" href="#reviews"><span class="stars" aria-hidden="true">★★★★★</span> ' + p.rating.toFixed(1) + ' · ' + p.reviews + ' reviews</a>') + '</div>' +
        (p.unitPer ? '<p class="pinfo__unit">Unit price ' + U.unitPrice(p) + '</p>' : '') +
        '<p class="pinfo__tax">Tax included. <a href="' + R + 'page/#shipping">Shipping</a> calculated at checkout.' + (p.giftCard ? '' : ' Or 4 interest-free payments of ' + money(p.price / 4) + ' with <span class="shop-pay-mark">shop<b>Pay</b></span>') + '</p>' +
        '<form class="pinfo__form" data-pform novalidate>' +
          U.optionHTML(p, sel, 'p') + giftFields +
          (p.giftCard ? '' : '<div class="field field--engrave"><label for="engrave">Free engraving <span class="muted">(optional)</span></label><input id="engrave" name="properties[Engraving]" maxlength="12" placeholder="Up to 12 characters" autocomplete="off" value="' + esc(sel.engraving || '') + '"><span class="field__count" data-eng-count>' + (sel.engraving || '').length + '/12</span></div>') +
          variantNotice(st) +
          '<div class="pinfo__buy">' +
            '<div class="qty qty--lg" role="group" aria-label="Quantity"><button type="button" aria-label="Decrease quantity" data-pq="-1"' + (st !== 'available' ? ' disabled' : '') + '>−</button><input type="number" min="1" value="' + sel.qty + '" aria-label="Quantity" data-pq-input' + (st !== 'available' ? ' disabled' : '') + '><button type="button" aria-label="Increase quantity" data-pq="1"' + (st !== 'available' ? ' disabled' : '') + '>+</button></div>' +
            '<button type="' + (st === 'available' ? 'submit' : 'button') + '" class="btn btn--primary btn--lg pinfo__atc' + (st !== 'available' ? ' is-unavailable' : '') + '" data-atc' + (st !== 'available' ? ' disabled' : '') + '>' + buyLabel + '</button>' +
          '</div>' +
          '<p class="form-msg is-error" role="alert" data-p-error hidden></p>' +
          (st === 'available' ? '<button type="button" class="accel__btn accel__btn--shop accel__btn--wide" aria-label="Buy with Shop Pay">Buy with <strong>shop</strong><em>Pay</em></button><button type="button" class="pinfo__more-pay" data-more-pay>More payment options</button>' : '') +
        '</form>' +
        (p.giftCard ? '' : '<p class="pinfo__pickup"><strong>Pickup available at Ocean Studio.</strong> Usually ready in 24 hours. <button type="button" class="link-u" data-store-info>View store information</button></p>') +
        '<dl class="pfacts" data-feature="hallmarks">' +
          (p.giftCard ? '<div><dt>Delivery</dt><dd>By email, on the date you choose</dd></div><div><dt>Validity</dt><dd>Never expires</dd></div>' :
          '<div><dt>Gold</dt><dd>Solid recycled 14k, stamped 585</dd></div><div><dt>Delivery</dt><dd>Free and insured over ' + money(100) + '</dd></div><div><dt>Fit</dt><dd>Free resizing for 60 days</dd></div><div><dt>Care</dt><dd>Lifetime polishing</dd></div>') +
        '</dl>' +
        '<div class="paccs">' +
          '<details open><summary>Description</summary><div><p>' + esc(p.desc) + '</p></div></details>' +
          (p.giftCard ? '' : '<details><summary>Materials &amp; care</summary><div><ul class="bullets"><li>' + D.METALS[sel.metal].label + ', recycled, stamped 585</li><li>' + (p.stone === 'None' ? 'No stones' : p.stone + (p.stone === 'Diamond' ? ', lab-grown, IGI graded' : ', traced to source')) + '</li><li>Take off before swimming or the gym</li><li>Polish with the cloth in every box</li></ul></div></details>') +
          '<details><summary>Shipping &amp; returns</summary><div><p>Free insured shipping over ' + money(100) + '. Orders ship within 2 working days. Returns are free for 60 days and resizing is free, including engraved rings.</p></div></details>' +
          (p.type === 'Rings' ? '<details><summary>Size guide</summary><div><table class="size-table"><caption class="visually-hidden">Ring sizes</caption><thead><tr><th scope="col">US</th><th scope="col">UK</th><th scope="col">Inside diameter</th></tr></thead><tbody><tr><td>5</td><td>J½</td><td>15.7 mm</td></tr><tr><td>6</td><td>L½</td><td>16.5 mm</td></tr><tr><td>7</td><td>N½</td><td>17.3 mm</td></tr><tr><td>8</td><td>P½</td><td>18.2 mm</td></tr><tr><td>9</td><td>R½</td><td>19.0 mm</td></tr></tbody></table></div></details>' : '') +
        '</div>' +
        '<div class="share"><button type="button" class="link-u" data-copy-link>Copy link to share</button></div>';
      U.bindOptions(info, p, sel, function () { var e = $('#engrave'); if (e) sel.engraving = e.value; saveGift(); renderInfo(); });
      renderSticky(st);
    }
    function saveGift() {
      if (!p.giftCard) return;
      var g = function (id) { var el = $('#' + id); return el ? el.value : ''; };
      sel.gEmail = g('g-email'); sel.gName = g('g-name'); sel.gMsg = g('g-msg'); sel.gDate = g('g-date');
    }
    on(info, 'change', function (e) {
      if (e.target.id === 'gift-send') { sel.gift = e.target.checked; $('[data-gift-fields]').hidden = !sel.gift; if (sel.gift) $('#g-email').focus(); }
    });
    on(info, 'input', function (e) { if (e.target.id === 'g-msg') $('[data-gmsg-n]').textContent = e.target.value.length; });
    on(info, 'input', function (e) { if (e.target.id === 'engrave') { sel.engraving = e.target.value; $('[data-eng-count]').textContent = e.target.value.length + '/12'; } });
    on(info, 'click', function (e) {
      var q = e.target.closest('[data-pq]');
      if (q) { sel.qty = Math.max(1, sel.qty + +q.dataset.pq); $('[data-pq-input]').value = sel.qty; var unitP = p.giftCard ? giftAmount() : p.price; var a = $('[data-atc] [data-money]'); if (a) { a.setAttribute('data-money', unitP * sel.qty); a.textContent = money(unitP * sel.qty); } $('[data-p-error]').hidden = true; }
      if (e.target.closest('[data-copy-link]')) { try { navigator.clipboard.writeText(location.href); } catch (er) {} U.toast('Link copied'); }
      if (e.target.closest('[data-store-info]')) U.openLayer($('#store-info'), '[data-close-modal]');
      if (e.target.closest('[data-notify]')) U.openLayer($('#notify'), 'input');
      if (e.target.closest('[data-more-pay]')) { e.preventDefault(); U.toast('Shopify shows more payment options here'); }
      if (e.target.closest('.accel__btn')) U.toast('Accelerated checkout runs on Shopify');
    });
    on(info, 'change', function (e) { if (e.target.matches('[data-pq-input]')) sel.qty = Math.max(1, parseInt(e.target.value, 10) || 1); });
    function doAdd(btn) {
      var err = $('[data-p-error]');
      if (p.giftCard) {
        saveGift();
        var ge = $('#g-email'), gerr = $('#g-email-error');
        if (sel.gift && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sel.gEmail || '')) { ge.setAttribute('aria-invalid', 'true'); gerr.hidden = false; gerr.textContent = 'Enter the recipient’s email address.'; ge.focus(); return; }
        if (gerr) gerr.hidden = true;
      }
      btn.classList.add('is-loading'); btn.disabled = true;
      setTimeout(function () {
        btn.classList.remove('is-loading'); btn.disabled = false;
        var ok = U.addToCart(p.id, sel.qty, { metal: sel.metal, size: sel.size, engraving: sel.engraving, price: p.giftCard ? giftAmount() : 0, recipient: p.giftCard && sel.gift ? (sel.gName || sel.gEmail) : '' });
        if (!ok && err) { err.hidden = false; err.textContent = 'You can only add ' + p.stock + ' of this item to your bag. Lower the quantity and try again.'; }
      }, 500);
    }
    on(info, 'submit', function (e) { e.preventDefault(); var b = $('[data-atc]', info); if (!b.disabled) doAdd(b); });

    /* sticky add to cart */
    var sticky = $('[data-sticky-atc]');
    function renderSticky(st) {
      sticky.innerHTML = '<div class="container sticky-atc__inner">' +
        (p.photo ? '<img src="' + U.primaryImg(p, 120, 120) + '" alt="" width="52" height="52">' : '<span class="sticky-atc__ph">' + (p.giftCard ? 'Ocean' : U.PLACEHOLDER) + '</span>') +
        '<div class="sticky-atc__info"><p class="sticky-atc__title">' + esc(p.title) + '</p><p class="sticky-atc__opts">' + (p.giftCard ? 'Gift card' : D.METALS[sel.metal].label + ' · ' + sel.size) + '</p></div>' +
        '<p class="sticky-atc__price">' + priceBlock() + '</p>' +
        (st === 'available' ? '<button class="btn btn--primary" data-sticky-add>Add to bag</button>' : '<button class="btn btn--primary" disabled>' + (st === 'soldout' ? 'Sold out' : 'Unavailable') + '</button>') + '</div>';
      on($('[data-sticky-add]', sticky), 'click', function () { doAdd(this); });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        var e = en[0]; var show = !e.isIntersecting && e.boundingClientRect.top < 0;
        sticky.classList.toggle('is-visible', show); sticky.setAttribute('aria-hidden', String(!show));
        $$('button', sticky).forEach(function (b) { b.tabIndex = show ? 0 : -1; });
      }, { threshold: 0 }).observe($('[data-atc-anchor]'));
    }
    renderInfo();

    if (p.giftCard) { var pc = $('.pcomp'); if (pc) pc.hidden = true; var rv0 = $('#reviews'); if (rv0) rv0.hidden = true; $('[data-p-crumb-type]').href = R + 'collections/'; }
    if (U.isSoldOut(p)) { var eg = $('.field--engrave'); if (eg) eg.hidden = true; }
    /* complementary + recommendations + recently viewed */
    var comp = D.PRODUCTS.filter(function (x) { return x.id !== p.id && !x.hidden && x.type !== p.type && !U.isSoldOut(x); }).slice(0, 3);
    $('[data-complementary]').innerHTML = comp.map(function (x) {
      return '<li class="comp"><a href="' + R + 'product/?id=' + x.id + '" tabindex="-1"><img src="' + U.primaryImg(x, 160, 160) + '" alt="" width="64" height="64" loading="lazy"></a><div><a class="comp__t" href="' + R + 'product/?id=' + x.id + '">' + esc(x.title) + '</a><p>' + U.priceHTML(x) + '</p></div><button class="comp__add" ' + (x.sizes.length > 1 || x.metals.length > 1 ? 'data-quick' : 'data-add') + '="' + x.id + '" aria-label="Add ' + esc(x.title) + '">+</button></li>';
    }).join('');
    var recs = D.PRODUCTS.filter(function (x) { return x.id !== p.id && !x.hidden && x.type === p.type; }).concat(D.PRODUCTS.filter(function (x) { return x.id !== p.id && !x.hidden && x.type !== p.type; })).slice(0, 4);
    $('[data-recs]').innerHTML = recs.map(U.cardHTML).join('');
    var rv = U.store.get('ocean-recent', []).filter(function (id) { return id !== p.id; });
    var rvEl = $('[data-recent]');
    if (rv.length) { rvEl.innerHTML = rv.slice(0, 4).map(function (id) { var x = U.byId(id); return x ? U.cardHTML(x) : ''; }).join(''); } else $('[data-recent-wrap]').hidden = true;
    U.store.set('ocean-recent', [p.id].concat(rv).slice(0, 8));
    $('[data-rev-title]').textContent = p.rating.toFixed(1);
    $('[data-rev-count]').textContent = p.reviews + ' reviews';
    document.addEventListener('ocean:refresh', function () { renderInfo(); $('[data-recs]').innerHTML = recs.map(U.cardHTML).join(''); });

    on($('[data-notify-form]'), 'submit', function (e) {
      e.preventDefault(); var f = e.target, inp = $('input', f), msg = $('[data-form-msg]', f);
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim()); inp.setAttribute('aria-invalid', String(!ok));
      msg.className = 'form-msg ' + (ok ? 'is-success' : 'is-error'); msg.textContent = ok ? 'Thanks, we’ll email you when it’s back in stock.' : 'Enter a valid email address.';
    });
  }

  /* =========================================================
     CART PAGE
     ========================================================= */
  if (is('cart')) {
    var linesEl = $('[data-cartpage-lines]');
    U.bindLineControls(linesEl);
    var gift = $('[data-cp-gift]');
    on(gift, 'change', function () { U.setGiftWrap(gift.checked); });
    function renderCartPage() {
      var cart = U.getCart(), t = U.totals();
      $('[data-cp-empty]').hidden = cart.length > 0;
      $('[data-cp-full]').hidden = cart.length === 0;
      $('[data-cp-count]').textContent = t.count + ' item' + (t.count === 1 ? '' : 's');
      linesEl.innerHTML = cart.map(U.lineHTML).join('');
      $('[data-cp-sub]').textContent = money(t.sub - t.wrap);
      $('[data-cp-wrap-row]').hidden = !t.wrap; $('[data-cp-wrap]').textContent = money(t.wrap);
      $('[data-cp-disc-row]').hidden = !t.disc; $('[data-cp-disc]').textContent = '−' + money(t.disc);
      $('[data-cp-total]').textContent = money(t.total);
      gift.checked = U.getGiftWrap();
      var left = Math.max(0, 100 - t.total);
      $('[data-cp-ship]').innerHTML = left > 0 ? 'Spend <strong>' + money(left) + '</strong> more for free express shipping' : '<strong>Free express shipping unlocked</strong>';
      $('[data-cp-bar]').style.width = Math.min(100, t.total) + '%';
      $('[data-cp-ups]').innerHTML = U.upsellList(4).map(U.cardHTML).join('');
    }
    document.addEventListener('ocean:cart-updated', renderCartPage);
    on($('[data-cp-checkout]'), 'click', function () { U.toast('Checkout is handled by Shopify'); });
    renderCartPage();
  }

  /* =========================================================
     SEARCH
     ========================================================= */
  if (is('search')) {
    var q = (U.qs('q') || '').trim();
    $('#search-page-input').value = q;
    var res = q ? U.searchProducts(q) : [];
    var arts = q ? D.ARTICLES.filter(function (a) { return (a.title + ' ' + a.tag + ' ' + a.excerpt).toLowerCase().indexOf(q.toLowerCase()) > -1; }) : [];
    var pages = q ? [{ t: 'Size guide', u: R + 'page/#size-guide', k: 'size ring guide measure' }, { t: 'Shipping & returns', u: R + 'page/#shipping', k: 'shipping returns delivery' }, { t: 'Contact us', u: R + 'contact/', k: 'contact help email' }].filter(function (x) { return (x.t + ' ' + x.k).toLowerCase().indexOf(q.toLowerCase()) > -1; }) : [];
    $('[data-sq]').textContent = q ? '“' + q + '”' : 'Search our store';
    $('[data-s-summary]').textContent = q ? (res.length + arts.length + pages.length) + ' results' : 'Start typing to find rings, necklaces, earrings and more.';
    $$('[data-stab-count]').forEach(function (el) { el.textContent = { products: res.length, articles: arts.length, pages: pages.length }[el.dataset.stabCount]; });
    $('[data-s-articles]').innerHTML = arts.map(function (a) { return '<li><a class="srow" href="' + R + 'article/?id=' + a.id + '"><img src="' + D.img(a.image, 200, 150) + '" alt="" width="100" height="75" loading="lazy"><div><p class="post__meta">' + a.tag + '</p><p class="srow__t">' + esc(a.title) + '</p></div></a></li>'; }).join('') || '<li class="muted">No articles match.</li>';
    $('[data-s-pages]').innerHTML = pages.map(function (x) { return '<li><a class="srow srow--page" href="' + x.u + '"><span class="srow__ic" aria-hidden="true">¶</span><p class="srow__t">' + x.t + '</p></a></li>'; }).join('') || '<li class="muted">No pages match.</li>';
    var hasAny = res.length || arts.length || pages.length;
    if (!q) { $('[data-s-results]').hidden = true; $('[data-s-start]').hidden = false; }
    else if (!hasAny) { $('[data-s-results]').hidden = true; $('[data-s-none]').hidden = false; $('[data-s-none-q]').textContent = q; }
    else if (res.length) Facets($('[data-facets]'), res);
    else $('[data-facets]').hidden = true;
    $$('[data-stab]').forEach(function (t) {
      on(t, 'click', function () {
        $$('[data-stab]').forEach(function (x) { var o = x === t; x.classList.toggle('is-active', o); x.setAttribute('aria-selected', String(o)); });
        $$('[data-spanel]').forEach(function (pn) { pn.hidden = pn.dataset.spanel !== t.dataset.stab; });
      });
    });
    var pop = D.PRODUCTS.filter(function (x) { return !x.hidden && !U.isSoldOut(x); }).sort(function (a, b) { return b.reviews - a.reviews; }).slice(0, 4).map(U.cardHTML).join('');
    $$('[data-s-popular]').forEach(function (el) { el.innerHTML = pop; });
  }

  /* =========================================================
     BLOG + ARTICLE
     ========================================================= */
  function postCard(a, big) {
    return '<li class="bpost' + (big ? ' bpost--feat' : '') + '"><a href="' + R + 'article/?id=' + a.id + '"><div class="bpost__img"><img src="' + D.img(a.image, big ? 1400 : 800, big ? 900 : 600) + '" alt="" width="' + (big ? 700 : 400) + '" height="' + (big ? 450 : 300) + '" loading="lazy"><span class="bpost__tag">' + a.tag + '</span></div>' +
      '<div class="bpost__body"><p class="bpost__meta">' + a.date + ' · ' + a.read + ' min read</p><h2>' + esc(a.title) + '</h2><p class="muted">' + esc(a.excerpt) + '</p><span class="bpost__more">Read article <span aria-hidden="true">→</span></span></div></a></li>';
  }
  if (is('blog')) {
    var tag = 'All';
    var renderBlog = function () {
      var list = D.ARTICLES.filter(function (a) { return tag === 'All' || a.tag === tag; });
      $('[data-blog-grid]').innerHTML = list.map(function (a, i) { return postCard(a, i === 0 && tag === 'All'); }).join('');
      $('[data-blog-empty]').hidden = list.length > 0;
    };
    $$('[data-btag]').forEach(function (b) {
      on(b, 'click', function () { tag = b.dataset.btag; $$('[data-btag]').forEach(function (x) { var o = x === b; x.classList.toggle('is-active', o); x.setAttribute('aria-pressed', String(o)); }); renderBlog(); });
    });
    renderBlog();
  }
  var BODIES = {
    2: ['Layering works best when each chain sits at a different length. Start with a short chain at 40 cm, add a pendant at 45 cm, and finish with a longer chain at 50 cm.', 'Mix textures rather than colours: a flat herringbone, a beaded chain and a fine trace chain look intentional together, even in the same gold.', 'If chains tangle, add a pendant to the longest one. The extra weight keeps it hanging straight.'],
    3: ['Solid 14k gold doesn’t flake or wear through, but it does pick up oils and fine scratches. Keeping it away from chlorine, perfume and lotion keeps it bright.', 'Put your jewellery on last and take it off first. Store each piece separately in the pouch it came in.', 'Every Ocean piece comes with free lifetime polishing. Send it back to us and we will clean and re-polish it at no cost.'],
    4: ['Freshwater pearls are grown in mussels and come in many shapes. Baroque pearls are irregular, and every one is unique. Keshi pearls form without a nucleus and have a bright lustre.', 'Look for lustre first: a good pearl reflects light sharply, almost like a mirror.', 'Pearls are soft, so wipe them with a damp cloth after wearing and never store them in a sealed plastic bag.'],
    5: ['Lab-grown diamonds are real diamonds, with the same chemical structure, hardness and sparkle as mined stones.', 'They are graded with the same four Cs: cut, colour, clarity and carat. Every Ocean diamond over 0.3 ct comes with an independent report.', 'Because they are grown above ground, they avoid the environmental impact of mining and cost noticeably less.'],
    6: ['The best gifts are the pieces people wear every day: a fine chain, small hoops or a pendant with meaning.', 'Every order arrives gift-boxed with a handwritten card. Add free engraving for a personal touch.', 'Not sure about size? Choose a necklace or earrings, or include a gift card so they can pick their own.']
  };
  if (is('article')) {
    var a = D.ARTICLES.filter(function (x) { return x.id === +U.qs('id'); })[0] || D.ARTICLES[0];
    document.title = a.title + ' | The Ocean Journal';
    $('[data-a-title]').textContent = a.title;
    $('[data-a-crumb]').textContent = a.title;
    $('[data-a-meta]').innerHTML = '<span class="bpost__tag bpost__tag--inline">' + a.tag + '</span> ' + a.date + ' · ' + a.read + ' min read · By ' + a.author;
    $('[data-a-hero]').innerHTML = '<img src="' + D.img(a.image, 1800, 900) + '" alt="" width="1800" height="900" fetchpriority="high">';
    $('[data-a-lead]').textContent = a.excerpt;
    if (BODIES[a.id]) $('[data-a-body]').innerHTML = BODIES[a.id].map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    $('[data-a-related]').innerHTML = D.ARTICLES.filter(function (x) { return x.id !== a.id; }).slice(0, 3).map(function (x) { return postCard(x); }).join('');
    $('[data-a-products]').innerHTML = [1, 5, 14].map(U.byId).map(U.cardHTML).join('');
    var bar = $('[data-read-progress]');
    if (bar) window.addEventListener('scroll', function () { var art = $('[data-a-body]').parentNode, r = art.getBoundingClientRect(); var pr = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))); bar.style.transform = 'scaleX(' + pr + ')'; }, { passive: true });
    on($('[data-copy-link]'), 'click', function () { try { navigator.clipboard.writeText(location.href); } catch (e) {} U.toast('Link copied'); });
  }

  /* =========================================================
     ACCOUNT, PASSWORD, GIFT CARD, 404
     ========================================================= */
  $$('[data-switch]').forEach(function (b) {
    on(b, 'click', function (e) {
      e.preventDefault();
      var target = b.dataset.switch;
      $$('[data-pane]').forEach(function (p) { p.hidden = p.dataset.pane !== target; });
      $$('[data-atab]').forEach(function (t) { var o = t.dataset.switch === target; t.classList.toggle('is-active', o); t.setAttribute('aria-selected', String(o)); });
      var pane = $('[data-pane="' + target + '"]'); var f = pane && $('input', pane); if (f) f.focus();
    });
  });
  $$('[data-toggle-pass]').forEach(function (b) {
    on(b, 'click', function () { var i = $('#' + b.getAttribute('aria-controls')); var show = i.type === 'password'; i.type = show ? 'text' : 'password'; b.setAttribute('aria-pressed', String(show)); b.textContent = show ? 'Hide' : 'Show'; });
  });
  on($('[data-reveal-password]'), 'click', function () { var f = $('[data-password-form]'); f.hidden = !f.hidden; this.setAttribute('aria-expanded', String(!f.hidden)); if (!f.hidden) $('input', f).focus(); });

  if (is('password') && U.qs('state') === 'error') {
    var pf = $('[data-password-form]'); pf.hidden = false; $('[data-reveal-password]').setAttribute('aria-expanded', 'true');
    var pin = $('#store-password'); pin.value = 'wrongpass'; pin.setAttribute('aria-invalid', 'true');
    var psum = $('[data-error-summary]', pf); psum.hidden = false; psum.innerHTML = '<p><strong>Wrong password.</strong> Check the password you were given and try again.</p>';
  }
  if (is('customers-addresses')) {
    var wrap = $('[data-addr-form-wrap]');
    var openForm = function (title) { $('[data-addr-form-title]').textContent = title; wrap.hidden = false; var f = $('form', wrap); f.hidden = false; $('[data-form-success]', wrap).hidden = true; $('#ad-first').focus(); };
    on($('[data-addr-new]'), 'click', function () { $('form', wrap).reset(); openForm('Add a new address'); });
    $$('[data-addr-edit]').forEach(function (b) { on(b, 'click', function () { var f = $('form', wrap); f.reset(); $('#ad-first').value = 'Maya'; $('#ad-last').value = 'Lund'; $('#ad-1').value = b.closest('.addr').querySelector('address').innerHTML.split('<br>')[1]; $('#ad-city').value = 'Bristol'; $('#ad-zip').value = 'BS1 4RD'; openForm('Edit address'); }); });
    $$('[data-addr-del]').forEach(function (b) { on(b, 'click', function () { if (window.confirm('Delete this address?')) { b.closest('.addr').remove(); U.toast('Address deleted'); } }); });
    $$('[data-addr-default]').forEach(function (b) { on(b, 'click', function () { U.toast('Default address updated'); }); });
    on($('[data-addr-cancel]'), 'click', function () { wrap.hidden = true; $('[data-addr-new]').focus(); });
  }
  if (is('gift-card')) {
    if (U.qs('state') === 'expired') {
      $('.gc').classList.add('is-expired'); $('[data-gc-expired]').hidden = false;
      $('.gc__title').textContent = 'This gift card has expired';
      var bal = $('.gc__balance'); if (bal) bal.innerHTML = '<div><dt>Balance</dt><dd>' + money(0) + '</dd></div><div><dt>Expired</dt><dd>1 Jan 2026</dd></div>';
      var cc = $('[data-copy-code]'); if (cc) { cc.disabled = true; cc.textContent = 'Code no longer valid'; }
      var ft = $('[data-gc-foot]'); if (ft) ft.textContent = 'Gift card · Expired 1 January 2026';
      var ins = $('[data-gc-instruction]'); if (ins) ins.textContent = 'Gift card code (expired)';
      var wb = $('[data-wallet]'); if (wb) wb.hidden = true;
      var amt = $('.gc__card-amount'); if (amt) { amt.setAttribute('data-money', '0'); amt.textContent = money(0); }
    }
    var code = 'OCEN 7H2K 9QWX 4F3M';
    on($('[data-copy-code]'), 'click', function () { try { navigator.clipboard.writeText(code.replace(/\s/g, '')); } catch (e) {} var b = this; b.textContent = 'Copied'; b.classList.add('is-done'); setTimeout(function () { b.textContent = 'Copy code'; b.classList.remove('is-done'); }, 2000); });
    on($('[data-print]'), 'click', function () { window.print(); });
    on($('[data-wallet]'), 'click', function () { U.toast('Adds the card to Apple Wallet on iOS'); });
    var qr = $('[data-qr]');
    document.addEventListener('DOMContentLoaded', function () { if (qr && window.QRCode) { qr.innerHTML = ''; new window.QRCode(qr, { text: code.replace(/\s/g, ''), width: 140, height: 140, colorDark: '#0D1422', colorLight: '#ffffff', correctLevel: window.QRCode.CorrectLevel.M }); var im = $('img', qr); if (im) im.alt = 'QR code for gift card ' + code; } });
  }

  if (is('404')) {
    $('[data-404-products]').innerHTML = D.PRODUCTS.filter(function (x) { return !x.hidden && !U.isSoldOut(x); }).sort(function (a, b) { return b.rating - a.rating; }).slice(0, 4).map(U.cardHTML).join('');
  }

  /* =========================================================
     STATES GALLERY
     ========================================================= */
  if (is('states')) {
    var put = function (sel, html) { var el = $(sel); if (el) el.innerHTML = html; };
    put('[data-st-hover]', U.cardHTML(U.byId(1)));
    put('[data-st-long]', U.cardHTML(U.byId(9)));
    put('[data-st-noimg]', U.cardHTML(U.byId(16)));
    put('[data-st-sold]', U.cardHTML(U.byId(8)));
    put('[data-st-loading]', U.skeletonCards(2));
    var sp = U.byId(2), ssel = { metal: 'rose', size: '5' };
    var renderVar = function () {
      var st = U.variantState(sp, ssel.metal, ssel.size);
      $('[data-st-variant]').innerHTML = U.optionHTML(sp, ssel, 'st') + (st === 'available' ? '<button class="btn btn--primary btn--block">Add to bag</button>' : '<button class="btn btn--primary btn--block" disabled>' + (st === 'soldout' ? 'Sold out' : 'Unavailable') + '</button>') + (st !== 'available' ? '<div class="pnotice" role="status"><p><strong>' + (st === 'soldout' ? 'Size ' + ssel.size + ' is sold out.' : 'Size ' + ssel.size + ' in ' + D.METALS[ssel.metal].label + ' isn’t made.') + '</strong> Choose another option above, or</p><button type="button" class="link-u" data-st-notify>Email me when it’s available</button><form class="st-notify" data-st-notify-form novalidate hidden><label class="visually-hidden" for="st-notify-email">Email address</label><input id="st-notify-email" type="email" placeholder="Email address" autocomplete="email"><button class="btn btn--primary" type="submit">Notify me</button><p class="form-msg" role="status" aria-live="polite" data-form-msg></p></form></div>' : '') + '<p class="st-note">Rose gold in size 5 isn’t made (Unavailable). Size 9 is sold out in every metal.</p>';
      U.bindOptions($('[data-st-variant]'), sp, ssel, renderVar);
      var nb = $('[data-st-notify]'), nf = $('[data-st-notify-form]');
      on(nb, 'click', function () { nf.hidden = false; nb.hidden = true; $('input', nf).focus(); });
      on(nf, 'submit', function (e) { e.preventDefault(); var i = $('input', nf), m = $('[data-form-msg]', nf), ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value.trim()); i.setAttribute('aria-invalid', String(!ok)); m.className = 'form-msg ' + (ok ? 'is-success' : 'is-error'); m.textContent = ok ? 'Thanks, we’ll email you when it’s back.' : 'Enter a valid email address.'; });
    };
    renderVar();
    var hc = $('[data-st-hover] .card'); if (hc) hc.classList.add('is-hover');
  }
})();
