"""One-off: Theme Store review fixes for v1/script.js (run once, from any directory)."""
import os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
s = open('script.js').read()


def between(start, end, new):
    global s
    a = s.index(start); b = s.index(end, a)
    s = s[:a] + new + s[b:]


def rep(a, b):
    global s
    assert a in s, a[:90]
    s = s.replace(a, b, 1)


# ---------------------------------------------------------------- media + card
between('  /* ---------- Product card (shared by home, collection, search, cart upsells) ---------- */',
        '  /* ---------- Delegated actions ---------- */', r'''  /* ---------- Rich media (image, video, 3D model) shared by product page, quick view, featured product ---------- */
  var PLACEHOLDER = '<svg class="placeholder-svg" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="64" r="26" fill="none" stroke="currentColor" stroke-width="3"/><path d="M48 38l12-14 12 14" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>';
  var ICON_PLAY = '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
  var ICON_3D = '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 12l8-4.5 M12 12v9 M12 12L4 7.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  function primaryImg(p, w, h) { return D.img(p.photo, w, h, p.fp); }
  /* Media order mirrors a merchant's media list: main image, then video / 3D, then detail shots of mixed aspect ratios */
  function mediaList(p) {
    var list = [];
    if (p.photo) list.push({ type: 'image', ratio: 0.8, src: function (w) { return D.img(p.photo, w, Math.round(w * 1.25), p.fp); }, alt: p.title });
    (p.media || []).forEach(function (m) { list.push(m); });
    if (p.photo) {
      if (p.detail[0]) list.push({ type: 'image', ratio: 1.333, src: function (w) { return D.img(p.photo, w, Math.round(w * 0.75), p.detail[0]); }, alt: p.title + ', close-up' });
      if (p.detail[1]) list.push({ type: 'image', ratio: 1, src: function (w) { return D.img(p.photo, w, w, p.detail[1]); }, alt: p.title + ', detail' });
    }
    return list;
  }
  function mediaThumb(p, m, w) {
    if (m.type === 'video') return R + m.poster;
    return p.photo ? D.img(p.photo, w, w, p.fp) : '';
  }
  function mediaHTML(p, m, i, opts) {
    opts = opts || {};
    var w = opts.w || 1200;
    if (m.type === 'image') return '<img src="' + m.src(w) + '" alt="' + esc(m.alt) + '" width="' + w + '" height="' + Math.round(w / m.ratio) + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + '>';
    if (m.type === 'video') return '<button type="button" class="media-poster" data-play="' + R + m.src + '" data-alt="' + esc(m.alt) + '" aria-label="Play video: ' + esc(m.alt) + '"><img src="' + R + m.poster + '" alt="" width="720" height="900" loading="lazy"><span class="media-badge media-badge--play">' + ICON_PLAY + '</span><span class="media-tag">Video · 0:06</span></button>';
    if (m.type === 'model') return '<button type="button" class="media-poster" data-model="' + R + m.src + '" data-alt="' + esc(m.alt) + '" aria-label="Open 3D view: ' + esc(m.alt) + '">' + (p.photo ? '<img src="' + D.img(p.photo, 900, 900, p.fp) + '" alt="" width="900" height="900" loading="lazy">' : '') + '<span class="media-badge">' + ICON_3D + '</span><span class="media-tag">3D · View in your space</span></button>';
    return '';
  }
  var mvLoading = null;
  function loadModelViewer() {
    if (window.customElements && customElements.get('model-viewer')) return Promise.resolve();
    if (mvLoading) return mvLoading;
    mvLoading = new Promise(function (res) {
      var sc = document.createElement('script'); sc.type = 'module';
      sc.src = 'https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
      sc.onload = res; sc.onerror = res; document.head.appendChild(sc);
    });
    return mvLoading;
  }
  function playVideo(btn) {
    var v = document.createElement('video');
    v.src = btn.dataset.play; v.controls = true; v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('playsinline', ''); v.setAttribute('aria-label', btn.dataset.alt); v.className = 'media-video';
    btn.replaceWith(v); v.focus();
  }
  function openModel(btn) {
    var box = document.createElement('div'); box.className = 'media-3d';
    box.innerHTML = '<model-viewer src="' + btn.dataset.model + '" alt="' + esc(btn.dataset.alt) + '" ar ar-modes="webxr scene-viewer quick-look" camera-controls touch-action="pan-y" camera-orbit="0deg 75deg 0.045m" min-camera-orbit="auto auto 0.02m" max-camera-orbit="auto auto 0.08m" shadow-intensity="1" exposure="1.1" environment-image="neutral" interaction-prompt="none">' +
        '<button slot="ar-button" class="media-3d__ar">View in your space</button></model-viewer>' +
      '<div class="media-3d__controls" role="group" aria-label="3D view controls">' +
        '<button type="button" data-mv="left" aria-label="Rotate left">↺</button><button type="button" data-mv="right" aria-label="Rotate right">↻</button>' +
        '<button type="button" data-mv="in" aria-label="Zoom in">+</button><button type="button" data-mv="out" aria-label="Zoom out">−</button>' +
        '<button type="button" data-mv="reset" class="media-3d__reset">Reset view</button></div>' +
      '<p class="media-3d__hint">Drag to rotate, or use the buttons. On a phone, “View in your space” places it in your room.</p>';
    btn.replaceWith(box);
    loadModelViewer().then(function () { var b = $('[data-mv]', box); if (b) b.focus(); });
  }
  function mvControl(btn) {
    var mv = $('model-viewer', btn.closest('.media-3d')); if (!mv || !mv.getCameraOrbit) return;
    var o = mv.getCameraOrbit(), act = btn.dataset.mv;
    if (act === 'reset') { mv.cameraOrbit = '0deg 75deg 0.045m'; return; }
    var th = o.theta, ph = o.phi, r = o.radius;
    if (act === 'left') th -= Math.PI / 8; if (act === 'right') th += Math.PI / 8;
    if (act === 'in') r = Math.max(0.02, r * 0.85); if (act === 'out') r = Math.min(0.08, r / 0.85);
    mv.cameraOrbit = th + 'rad ' + ph + 'rad ' + r + 'm';
  }
  document.addEventListener('click', function (e) {
    var pl = e.target.closest('[data-play]'); if (pl) { e.preventDefault(); playVideo(pl); return; }
    var md = e.target.closest('[data-model]'); if (md) { e.preventDefault(); openModel(md); return; }
    var mc = e.target.closest('[data-mv]'); if (mc) { mvControl(mc); }
  });

  /* ---------- Product card (shared by home, collection, search, cart upsells) ---------- */
  function ratingHTML(p, cls) {
    if (!p.rating || !p.reviews) return '';
    return '<span class="' + (cls || 'card__rating') + '"><span class="stars" aria-hidden="true">★</span> ' + p.rating.toFixed(1) + '<span class="visually-hidden"> out of 5 stars,</span> <span class="rc">(' + p.reviews + '<span class="visually-hidden"> ratings</span>)</span></span>';
  }
  function swatches(p) {
    if (p.metals.length < 2) return '<span class="card__metal">' + D.METALS[p.metals[0]].label.replace('14k ', '') + '</span>';
    return '<span class="card__swatches" aria-label="' + p.metals.length + ' metals">' + p.metals.map(function (m) { return '<i style="--sw:' + D.METALS[m].hex + '" title="' + D.METALS[m].label + '"></i>'; }).join('') + '</span>';
  }
  function badgeHTML(p) {
    if (isSoldOut(p)) return '<span class="badge badge--sold">Sold out</span>';
    if (p.compare) return '<span class="badge badge--sale">Sale</span>';
    if (p.badge === 'New') return '<span class="badge badge--new">New</span>';
    return '';
  }
  function unitPrice(p) { if (!p.unitPer) return ''; var len = parseInt(p.sizes[0], 10); return money(p.price / len) + ' / ' + p.unitPer; }
  function priceHTML(p) {
    return p.compare
      ? '<span class="visually-hidden">Sale price</span><strong class="is-sale" data-money="' + p.price + '">' + money(p.price) + '</strong><span class="visually-hidden">Regular price</span><s data-money="' + p.compare + '">' + money(p.compare) + '</s>'
      : '<strong data-money="' + p.price + '">' + money(p.price) + '</strong>';
  }
  /* Card idea: a jeweller's loupe. Hovering the image with a mouse shows a 2.5x round magnifier of the piece. */
  function cardHTML(p, i) {
    var url = R + 'product/?id=' + p.id;
    var media = p.photo
      ? '<img src="' + primaryImg(p, 700, 875) + '" srcset="' + primaryImg(p, 420, 525) + ' 420w, ' + primaryImg(p, 700, 875) + ' 700w" sizes="(min-width: 1200px) 25vw, (min-width: 750px) 33vw, 50vw" alt="' + esc(p.title) + '" width="700" height="875" loading="lazy">'
      : '<div class="card__placeholder">' + PLACEHOLDER + '<span>Image coming soon</span></div>';
    var soldOut = isSoldOut(p), multi = p.sizes.length > 1 || p.metals.length > 1;
    var hasRich = (p.media || []).map(function (m) { return m.type; });
    return '<li class="card' + (soldOut ? ' is-sold-out' : '') + '" style="animation-delay:' + ((i || 0) % 8 * 60) + 'ms">' +
      '<div class="card__media"' + (p.photo ? ' data-loupe="' + primaryImg(p, 1400, 1750) + '"' : '') + '>' +
        '<div class="card__badges">' + badgeHTML(p) + (hasRich.indexOf('model') > -1 ? '<span class="badge badge--media">3D</span>' : hasRich.indexOf('video') > -1 ? '<span class="badge badge--media">Video</span>' : '') + '</div>' + media +
        '<button class="card__quick" aria-label="Quick view: ' + esc(p.title) + '" data-quick="' + p.id + '"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></button>' +
        '<button class="card__add" ' + (soldOut ? 'disabled aria-label="' + esc(p.title) + ' is sold out"' : (multi ? 'data-quick="' + p.id + '" aria-label="Choose options for ' + esc(p.title) + '"' : 'data-add="' + p.id + '" aria-label="Add ' + esc(p.title) + ' to bag"')) + '>' +
          '<span class="plus" aria-hidden="true">' + (soldOut ? '–' : '+') + '</span><span class="lbl" aria-hidden="true">' + (soldOut ? 'Sold out' : (multi ? 'Choose options' : 'Add to bag')) + '</span></button>' +
      '</div>' +
      '<div class="card__body">' +
        '<div class="card__top"><span class="card__type">' + p.type + '</span>' + ratingHTML(p) + '</div>' +
        '<h3 class="card__title"><a href="' + url + '">' + esc(p.title) + '</a></h3>' +
        '<div class="card__price">' + priceHTML(p) + (p.unitPer ? '<span class="card__unit">' + unitPrice(p) + '</span>' : '') + '</div>' +
        swatches(p) +
      '</div></li>';
  }
  function skeletonCards(n) { var s = ''; for (var i = 0; i < n; i++) s += '<li class="card card--skeleton" aria-hidden="true"><div class="card__media sk"></div><div class="card__body"><span class="sk sk--line" style="width:40%"></span><span class="sk sk--line" style="width:85%"></span><span class="sk sk--line" style="width:30%"></span></div></li>'; return s; }
  /* loupe: mouse only, progressive enhancement */
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse' || reduceMotion) return;
    var m = e.target.closest && e.target.closest('.card__media[data-loupe]');
    $$('.loupe.is-on').forEach(function (l) { if (!m || l.parentNode !== m) l.classList.remove('is-on'); });
    if (!m || e.target.closest('button')) return;
    var lens = $('.loupe', m);
    if (!lens) { lens = document.createElement('span'); lens.className = 'loupe'; lens.setAttribute('aria-hidden', 'true'); lens.style.backgroundImage = 'url("' + m.dataset.loupe + '")'; m.appendChild(lens); }
    var r = m.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, Z = 2.5;
    lens.style.left = x + 'px'; lens.style.top = y + 'px';
    lens.style.backgroundSize = (r.width * Z) + 'px ' + (r.height * Z) + 'px';
    lens.style.backgroundPosition = (-(x * Z - 70)) + 'px ' + (-(y * Z - 70)) + 'px';
    lens.classList.add('is-on');
  }, { passive: true });

''')
rep("var src = btn.closest('.card, .hero__chip, .up, .look__row, .qv');", "var src = btn.closest('.card, .hero__chip, .up, .look__row, .qv, .fp');")

# ---------------------------------------------------------------- quick view with media
between('  /* ---------- Quick view ---------- */', '  function atcButton(st, p, extra) {', r'''  /* ---------- Quick view (with rich media) ---------- */
  function galleryHTML(p, ns) {
    var list = mediaList(p);
    if (!list.length) return '<div class="card__placeholder">' + PLACEHOLDER + '<span>Image coming soon</span></div>';
    return '<div class="mgal" data-mgal>' +
      '<div class="mgal__stage" data-mgal-stage>' + mediaHTML(p, list[0], 0, { w: 1000 }) + '</div>' +
      (list.length > 1 ? '<ul class="mgal__thumbs" role="list" aria-label="Product media">' + list.map(function (m, i) {
        var th = m.type === 'image' ? m.src(160) : mediaThumb(p, m, 160);
        return '<li><button type="button" class="mgal__thumb' + (i ? '' : ' is-active') + '" data-mgal-i="' + i + '" aria-label="Show ' + (m.type === 'image' ? 'image ' + (i + 1) : m.type === 'video' ? 'video' : '3D model') + '"' + (i ? '' : ' aria-current="true"') + '>' + (th ? '<img src="' + th + '" alt="" width="64" height="64" loading="lazy">' : '') + (m.type === 'video' ? '<span class="mgal__ic">' + ICON_PLAY + '</span>' : m.type === 'model' ? '<span class="mgal__ic">' + ICON_3D + '</span>' : '') + '</button></li>';
      }).join('') + '</ul>' : '') +
    '</div>';
  }
  function bindGallery(root, p) {
    var list = mediaList(p);
    $$('[data-mgal-i]', root).forEach(function (b) {
      on(b, 'click', function () {
        var i = +b.dataset.mgalI, stage = $('[data-mgal-stage]', root);
        stage.innerHTML = mediaHTML(p, list[i], 1, { w: 1000 });
        $$('[data-mgal-i]', root).forEach(function (x) { x.classList.toggle('is-active', x === b); if (x === b) x.setAttribute('aria-current', 'true'); else x.removeAttribute('aria-current'); });
      });
    });
  }
  function openQuick(id) {
    var p = byId(id), box = $('[data-qv]'); if (!p || !box) return;
    var sel = { metal: p.metals[0], size: p.sizes.filter(function (s) { return variantState(p, p.metals[0], s) === 'available'; })[0] || p.sizes[0] };
    function render() {
      var st = variantState(p, sel.metal, sel.size);
      box.innerHTML =
        '<div class="qv__media">' + galleryHTML(p, 'qv') + '</div>' +
        '<div class="qv__body">' +
          '<p class="eyebrow" style="margin:0">' + p.type + '</p>' +
          '<h2 class="qv__title" id="qv-title">' + esc(p.title) + '</h2>' +
          (p.rating && p.reviews ? '<p class="qv__rating"><span class="stars" aria-hidden="true">★</span> ' + p.rating.toFixed(1) + ' out of 5 · ' + p.reviews + ' ratings</p>' : '') +
          '<p class="qv__price" aria-live="polite">' + priceHTML(p) + '</p>' +
          '<p class="qv__tax">Tax included. Shipping calculated at checkout.</p>' +
          optionHTML(p, sel, 'qv') +
          '<div class="qv__actions">' + atcButton(st, p) + '</div>' +
          '<a class="link-arrow" href="' + R + 'product/?id=' + p.id + '">View full details <span aria-hidden="true">→</span></a>' +
        '</div>';
      bindGallery(box, p);
      bindOptions(box, p, sel, render);
      var b = $('[data-qv-add]', box);
      on(b, 'click', function () { addToCart(p.id, 1, { metal: sel.metal, size: sel.size }); });
    }
    render();
    openLayerEl($('#quick-view'), '.modal__close');
  }
''')

# gift card amounts in the option picker
rep("""  function optionHTML(p, sel, ns) {
    var metalRow""", """  function optionHTML(p, sel, ns) {
    if (p.giftCard) {
      return '<fieldset class="opt"><legend class="opt__label">Amount: <strong>' + money(+sel.size.replace('$', '')) + '</strong></legend><div class="opt__row">' + p.sizes.map(function (s) { return '<label class="pill"><input type="radio" name="' + ns + '-size" value="' + s + '"' + (s === sel.size ? ' checked' : '') + '><span>' + money(+s.replace('$', '')) + '</span></label>'; }).join('') + '</div></fieldset>';
    }
    var metalRow""")
rep("""        if (/-metal$/.test(r.name)) sel.metal = r.value; else sel.size = r.value;""",
    """        if (/-metal$/.test(r.name)) sel.metal = r.value; else if (/-plan$/.test(r.name)) sel.plan = r.value; else sel.size = r.value;""")

# ---------------------------------------------------------------- cart
between('  /* ---------- Cart (drawer + page share one store) ---------- */', '  /* ---------- Predictive search ---------- */', r'''  /* ---------- Cart (drawer + page share one store) ---------- */
  var CART_KEY = 'ocean-jewel-cart';
  var cart = store.get(CART_KEY, []).filter(function (l) { return byId(l.id); });
  /* free-shipping threshold is a theme setting in the shop currency; money() converts it per market */
  var FREE_SHIP = 100, GIFT_WRAP_ID = 21;
  function saveCart() { store.set(CART_KEY, cart); }
  function lineKey(id, o) { return [id, o.metal, o.size, o.plan || '', o.bundle ? 'b' : '', o.price || ''].join('|'); }
  function maxQty(p) { return p.stock; }
  function planOf(p, l) { return l.plan && p.sellingPlans ? p.sellingPlans.filter(function (x) { return x.id === l.plan; })[0] : null; }
  function unitOf(l) { var p = byId(l.id), pl = planOf(p, l); return l.price || (pl ? p.price * (1 - (pl.off || 0)) : p.price); }
  function stackDiscountOn() { return document.documentElement.classList.contains('has-stack-discount'); }
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
    if (line) line.qty += qty; else cart.push({ key: key, id: id, metal: o.metal, size: o.size, qty: qty, bundle: !!o.bundle, engraving: o.engraving || '', plan: o.plan || '', price: o.price || 0, recipient: o.recipient || '' });
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
  function hasGiftWrap() { return cart.some(function (l) { return l.id === GIFT_WRAP_ID; }); }
  /* gift wrap is a real product the merchant picks in theme settings, added as a cart line */
  function setGiftWrap(v) {
    if (v && !hasGiftWrap() && cart.length) cart.push({ key: GIFT_WRAP_ID + '|wrap', id: GIFT_WRAP_ID, metal: 'yellow', size: 'Ribbon and card', qty: 1, plan: '', price: 0 });
    if (!v) cart = cart.filter(function (l) { return l.id !== GIFT_WRAP_ID; });
    if (!cart.some(function (l) { return l.id !== GIFT_WRAP_ID; })) cart = [];
    saveCart(); renderCart();
  }
  function totals() {
    var sub = 0, disc = 0, on = stackDiscountOn();
    cart.forEach(function (l) { var lp = unitOf(l) * l.qty; sub += lp; if (l.bundle && on) disc += lp * 0.15; });
    return { sub: sub, disc: disc, total: sub - disc, count: cart.reduce(function (a, l) { return a + l.qty; }, 0), wrap: 0 };
  }
  function lineHTML(l) {
    var p = byId(l.id), unit = unitOf(l), pl = planOf(p, l), on = stackDiscountOn();
    var opts = p.giftCard ? 'Gift card · ' + money(unit) + (l.recipient ? ' · To: ' + esc(l.recipient) : '') : (p.giftWrap ? 'Ribbon and a handwritten card' : D.METALS[l.metal].label + ' · ' + l.size);
    var imgH = p.photo ? '<img src="' + primaryImg(p, 220, 260) + '" alt="' + esc(p.title) + '" width="88" height="104" loading="lazy">' : (p.giftCard || p.giftWrap ? '<div class="line__ph line__ph--brand"><span>Ocean</span></div>' : '<div class="line__ph">' + PLACEHOLDER + '</div>');
    var link = p.giftWrap ? '<span class="line__title">' + esc(p.title) + '</span>' : '<a class="line__title" href="' + R + 'product/?id=' + p.id + '">' + esc(p.title) + '</a>';
    return '<li class="line" data-line="' + esc(l.key) + '">' +
      (p.giftWrap ? '<span class="line__img">' + imgH + '</span>' : '<a class="line__img" href="' + R + 'product/?id=' + p.id + '" tabindex="-1">' + imgH + '</a>') +
      '<div class="line__info">' + link +
        '<p class="line__meta">' + opts + (l.engraving ? ' · Engraving: “' + esc(l.engraving) + '”' : '') + '</p>' +
        (pl ? '<p class="line__plan">' + esc(pl.name) + '</p>' : '') +
        '<p class="line__unit">' + money(unit) + (p.compare ? ' <s>' + money(p.compare) + '</s>' : '') + (p.unitPer ? ' · ' + unitPrice(p) : '') + '</p>' +
        (l.bundle && on ? '<span class="line__tag">Stack discount (−' + money(unit * l.qty * 0.15) + ')</span>' : '') +
        (p.giftWrap ? '' : '<div class="qty" role="group" aria-label="Quantity for ' + esc(p.title) + '"><button type="button" aria-label="Decrease quantity" data-qty="-1">−</button><input type="number" min="0" value="' + l.qty + '" aria-label="Quantity" data-qty-input><button type="button" aria-label="Increase quantity" data-qty="1">+</button></div>') +
        '<p class="line__error" role="alert" hidden></p>' +
      '</div>' +
      '<div class="line__right"><span class="line__price">' + money(unit * l.qty * (l.bundle && on ? 0.85 : 1)) + '</span><button type="button" class="line__remove" data-remove aria-label="Remove ' + esc(p.title) + '">Remove</button></div>' +
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
      $('[data-ship-text]', drawer).innerHTML = !cart.length ? 'Free shipping on orders over ' + money(FREE_SHIP) : (left > 0 ? 'Spend <strong>' + money(left) + '</strong> more for free shipping' : '<strong>Your order ships free</strong>');
      var bar = $('[data-ship-bar]', drawer); if (bar) bar.style.width = Math.min(100, t.total / FREE_SHIP * 100) + '%';
      $('[data-cart-subtotal]', drawer).textContent = money(t.sub);
      $('[data-bundle-row]', drawer).hidden = t.disc <= 0;
      $('[data-cart-discount]', drawer).textContent = '−' + money(t.disc);
      $('[data-cart-total]', drawer).textContent = money(t.total);
      var gw = $('[data-gift]', drawer); if (gw) gw.checked = hasGiftWrap();
      var ups = upsellList(4); $('[data-upsell]', drawer).hidden = !ups.length || document.documentElement.classList.contains('no-upsell');
      $('[data-upsell-track]', drawer).innerHTML = ups.map(function (p) {
        return '<li class="up"><a href="' + R + 'product/?id=' + p.id + '" tabindex="-1"><img src="' + primaryImg(p, 160, 160) + '" alt="' + esc(p.title) + '" width="64" height="64" loading="lazy"></a>' +
          '<div><a class="up__name" href="' + R + 'product/?id=' + p.id + '">' + esc(p.title) + '</a><p class="up__why">' + p.type + '</p><p class="up__price">' + money(p.price) + '</p></div>' +
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
      if (e.target.closest('[data-remove]')) { lineBusy(li); setTimeout(function () { removeLine(key); if (!cart.some(function (x) { return x.id !== GIFT_WRAP_ID; })) setGiftWrap(false); toast('Removed from your bag'); }, 260); }
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
    on($('[data-gift]', drawerEl), 'change', function (e) { setGiftWrap(e.target.checked); });
    on($('[data-checkout]', drawerEl), 'click', function () { toast('Checkout is handled by Shopify'); });
  }
  $$('[data-open-cart]').forEach(function (b) {
    on(b, 'click', function (e) { if (document.body.classList.contains('template-cart')) return; e.preventDefault(); openCart(); });
  });
  $$('.accel__btn').forEach(function (b) { on(b, 'click', function () { toast('Accelerated checkout runs on Shopify'); }); });

''')

# ---------------------------------------------------------------- settings
between("  var prefs = store.get('ocean-prefs'", "  /* ---------- Reveal + count-up ---------- */", r'''  var PREF_KEY = 'ocean-v1-prefs';
  var prefs = store.get(PREF_KEY, { scheme: 'ocean', corners: 'rounded', sections: false, stackDiscount: false, stickyAtc: true, upsell: true });
  function applyPrefs() {
    var de = document.documentElement;
    de.setAttribute('data-scheme', prefs.scheme);
    de.setAttribute('data-corners', prefs.corners);
    de.classList.toggle('has-stack-discount', !!prefs.stackDiscount);
    de.classList.toggle('no-sticky-atc', !prefs.stickyAtc);
    de.classList.toggle('no-upsell', !prefs.upsell);
    document.body.classList.toggle('show-sections', !!prefs.sections);
    $$('input[name="scheme"]').forEach(function (i) { i.checked = i.value === prefs.scheme; });
    $$('input[name="corners"]').forEach(function (i) { i.checked = i.value === prefs.corners; });
    $$('[data-setting]').forEach(function (i) { i.checked = !!prefs[i.dataset.setting]; });
    var ss = $('[data-show-sections]'); if (ss) ss.checked = !!prefs.sections;
  }
  $$('input[name="scheme"], input[name="corners"]').forEach(function (i) { on(i, 'change', function () { prefs[i.name] = i.value; store.set(PREF_KEY, prefs); applyPrefs(); }); });
  $$('[data-setting]').forEach(function (i) { on(i, 'change', function () { prefs[i.dataset.setting] = i.checked; store.set(PREF_KEY, prefs); applyPrefs(); renderCart(); document.dispatchEvent(new CustomEvent('ocean:refresh')); }); });
  on($('[data-show-sections]'), 'change', function () { prefs.sections = this.checked; store.set(PREF_KEY, prefs); applyPrefs(); });
  applyPrefs();

''')
# static numbers: no count-up (real value is already in the HTML)
between("  function countUp(el) {", "  /* ---------- Scroll-track progress bars ---------- */", "\n")

# ---------------------------------------------------------------- stack builder: discount only when the merchant turns it on
rep("""      var done = n === STEPS.length, left = STEPS.length - n;
      $$('[data-mini]').forEach(function (li, i) { li.classList.toggle('is-on', !!picked[STEPS[i].key]); });""", """      var done = n === STEPS.length, left = STEPS.length - n, disc = stackDiscountOn();
      $$('[data-mini]').forEach(function (li, i) { li.classList.toggle('is-on', !!picked[STEPS[i].key]); });""")
rep("""      $('#builder-compare').style.visibility = done ? 'visible' : 'hidden';
      $('#builder-total').textContent = money(done ? full * 0.85 : full);
      $('#builder-save').textContent = done ? 'Stack unlocked: you save ' + money(full * 0.15) : 'Choose ' + left + ' more to unlock 15% off';""",
    """      $('#builder-compare').style.visibility = done && disc ? 'visible' : 'hidden';
      $('#builder-total').textContent = money(done && disc ? full * 0.85 : full);
      $('#builder-save').textContent = done ? (disc ? 'Bundle discount applied at checkout: ' + money(full * 0.15) + ' off' : 'All three pieces chosen') : 'Choose ' + left + ' more piece' + (left > 1 ? 's' : '');""")
rep("toast('Stack added, 15% discount applied'); openCart();", "toast(stackDiscountOn() ? 'Stack added, bundle discount applied' : 'Stack added to your bag'); openCart();")

# ---------------------------------------------------------------- API
rep("    variantState: variantState, optionHTML: optionHTML, bindOptions: bindOptions,",
    "    variantState: variantState, optionHTML: optionHTML, bindOptions: bindOptions, mediaList: mediaList, mediaHTML: mediaHTML, galleryHTML: galleryHTML, bindGallery: bindGallery, ratingHTML: ratingHTML, ICON_PLAY: ICON_PLAY, ICON_3D: ICON_3D, unitOf: unitOf, stackDiscountOn: stackDiscountOn,")
rep("    setGiftWrap: function (v) { giftWrap = v; store.set('ocean-gift', v); renderCart(); }, getGiftWrap: function () { return giftWrap; }",
    "    setGiftWrap: setGiftWrap, getGiftWrap: hasGiftWrap")
open('script.js', 'w').write(s)
print('script.js patched')
