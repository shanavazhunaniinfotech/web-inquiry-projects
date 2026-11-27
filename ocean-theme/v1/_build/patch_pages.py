"""One-off: Theme Store review fixes for v1/pages.js (run once)."""
import os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
s = open('pages.js').read()


def between(start, end, new):
    global s
    a = s.index(start); b = s.index(end, a)
    s = s[:a] + new + s[b:]


def rep(a, b):
    global s
    assert a in s, a[:90]
    s = s.replace(a, b, 1)


# ---- validation: password confirmation
rep("    min8: function (v) { return v.length >= 8 ? '' : 'Use at least 8 characters.'; }",
    "    min8: function (v) { return v.length >= 8 ? '' : 'Use at least 8 characters.'; },\n    match: function (v, el) { var o = document.getElementById(el.dataset.match); return o && o.value === v ? '' : 'Passwords don’t match.'; }")

# ---- facets: drawer at every width + editorial story tile on page 1
rep("  function Facets(root, baseList) {", "  function Facets(root, baseList, opts) {\n    opts = opts || {};")
rep("        grid.innerHTML = slice.map(U.cardHTML).join('');",
    "        var cards = slice.map(U.cardHTML);\n        var filtered = state.avail.length || state.type.length || state.metal.length || state.stone.length || state.min > 0 || state.max < priceMax;\n        if (opts.story && state.page === 1 && !filtered && cards.length > 5) cards.splice(3, 0, opts.story);\n        grid.innerHTML = cards.join('');")
rep("        if (window.innerWidth < 990) { openMobile(tg.dataset.focusGroup); return; }\n        var open = !root.classList.contains('is-filters-closed');\n        root.classList.toggle('is-filters-closed', open);\n        $$('[data-filter-toggle]', root).forEach(function (b) { b.setAttribute('aria-expanded', String(!open)); });\n        var lbl = $('[data-filter-label]', root); if (lbl) lbl.textContent = open ? 'Show filters' : 'Hide filters';\n        return;",
    "        openMobile(tg.dataset.focusGroup); return;")
rep("      side.classList.add('is-open'); body.classList.add('lock'); side.setAttribute('aria-modal', 'true'); side.setAttribute('role', 'dialog');",
    "      side.classList.add('is-open'); body.classList.add('lock'); side.setAttribute('aria-modal', 'true'); side.setAttribute('role', 'dialog'); $$('[data-filter-toggle]', root).forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });")
rep("function closeMobile() { if (!side.classList.contains('is-open')) return; side.classList.remove('is-open');",
    "function closeMobile() { if (!side.classList.contains('is-open')) return; $$('[data-filter-toggle]', root).forEach(function (b) { b.setAttribute('aria-expanded', 'false'); }); side.classList.remove('is-open');")
rep("    update(false);\n    return { state: state, update: update };",
    "    update(false);\n    if (U.qs('filters') === 'open') setTimeout(function () { openMobile(); }, 200);\n    return { state: state, update: update };")
rep("    } else Facets($('[data-facets]'), base);",
    "    } else Facets($('[data-facets]'), base, { story: imgId ? '<li class=\"story-tile\"><a href=\"' + R + 'page/\"><span class=\"story-tile__img\"><img src=\"' + D.img(col.image || imgId, 900, 700) + '\" alt=\"\" width=\"450\" height=\"350\" loading=\"lazy\"></span><span class=\"story-tile__body\"><span class=\"story-tile__eyebrow\">From the workshop</span><span class=\"story-tile__title\">Cast, set and hallmarked by hand</span><span class=\"story-tile__text\">Every piece in ' + esc(col.title.toLowerCase()) + ' is solid recycled 14k gold, stamped 585.</span><span class=\"story-tile__link\">Read our story →</span></span></a></li>' : '' });")

# ---- collection list: no debug label
rep("      var fallback = !c.image && imgId ? '<span class=\"ccard__note\">Using first product image</span>' : '';\n", "")
rep("+ fallback + '</div>'", "+ '</div>'")

# ---- product page
between("  /* =========================================================\n     PRODUCT", "  /* =========================================================\n     CART PAGE", r'''  /* =========================================================
     PRODUCT
     ========================================================= */
  /* True-size view: the piece drawn at 1:1 against a millimetre ruler (96 CSS px per inch). */
  function trueSize(p) {
    if (!p.size) return '';
    var PX = 3.7795, mm = p.size.mm, W = 64, H = 34, cx = 32, cy = 18, sh = '';
    var f = 'var(--ts-metal)';
    if (p.size.shape === 'circle') sh = '<circle cx="' + cx + '" cy="' + cy + '" r="' + mm / 2 + '" fill="' + f + '"/>';
    if (p.size.shape === 'ring') sh = '<rect x="' + (cx - 15) + '" y="' + (cy - 1) + '" width="30" height="2" rx="1" fill="' + f + '"/><circle cx="' + cx + '" cy="' + cy + '" r="' + mm / 2 + '" fill="#F4F7FA" stroke="' + f + '" stroke-width="0.8"/>';
    if (p.size.shape === 'hoop') sh = '<circle cx="' + cx + '" cy="' + cy + '" r="' + (mm / 2 - 1.2) + '" fill="none" stroke="' + f + '" stroke-width="2.4"/>';
    if (p.size.shape === 'bar') sh = '<rect x="' + (cx - mm / 2) + '" y="2" width="' + mm + '" height="' + (H - 6) + '" rx="' + Math.min(1.5, mm / 3) + '" fill="' + f + '"/>';
    if (p.size.shape === 'band') sh = '<rect x="' + (cx - 10) + '" y="' + (cy - mm / 2) + '" width="20" height="' + mm + '" rx="' + mm / 2 + '" fill="' + f + '"/>';
    var ticks = '';
    for (var t = 0; t <= W; t++) ticks += '<line x1="' + t + '" y1="' + H + '" x2="' + t + '" y2="' + (H - (t % 10 === 0 ? 3 : t % 5 === 0 ? 2 : 1)) + '" stroke="#5B6463" stroke-width="0.15"/>' + (t % 10 === 0 ? '<text x="' + t + '" y="' + (H - 3.6) + '" font-size="2" text-anchor="middle" fill="#3E4645">' + t + '</text>' : '');
    return '<figure class="tsize"><svg class="tsize__svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + Math.round(W * PX) + '" height="' + Math.round(H * PX) + '" role="img" aria-label="' + esc(p.title) + ' drawn at actual size: ' + esc(p.size.label) + '">' + sh + ticks + '<line x1="0" y1="' + H + '" x2="' + W + '" y2="' + H + '" stroke="#5B6463" stroke-width="0.25"/></svg>' +
      '<figcaption><strong>' + esc(p.size.label) + '</strong><span>Shown at actual size on most screens. Ruler in millimetres.</span></figcaption></figure>';
  }
  function wornWith(p) {
    var comp = D.PRODUCTS.filter(function (x) { return x.id !== p.id && !x.hidden && x.photo && x.type !== p.type && !U.isSoldOut(x); }).slice(0, 3);
    if (!comp.length) return '';
    return '<div class="worn"><p class="worn__title">Worn with</p><ul class="worn__list">' + comp.map(function (x) {
      return '<li class="worn__item"><a class="worn__img" href="' + R + 'product/?id=' + x.id + '" tabindex="-1"><img src="' + D.img(x.photo, 300, 300, x.detail[0] || x.fp) + '" alt="" width="150" height="150" loading="lazy"></a>' +
        '<a class="worn__name" href="' + R + 'product/?id=' + x.id + '">' + esc(x.title) + '</a><p class="worn__price">' + U.priceHTML(x) + '</p>' +
        '<button class="worn__add" ' + (x.sizes.length > 1 || x.metals.length > 1 ? 'data-quick' : 'data-add') + '="' + x.id + '">' + (x.sizes.length > 1 || x.metals.length > 1 ? 'Choose' : 'Add') + '<span class="visually-hidden"> ' + esc(x.title) + '</span></button></li>';
    }).join('') + '</ul></div>';
  }
  function planPicker(p, sel) {
    if (!p.sellingPlans) return '';
    var opts = [{ id: '', name: 'One-time purchase', note: 'Ready to ship in 2 working days.', off: 0 }].concat(p.sellingPlans);
    return '<fieldset class="plans"><legend class="opt__label">Purchase options</legend>' + opts.map(function (o) {
      return '<label class="plan' + ((sel.plan || '') === o.id ? ' is-on' : '') + '"><input type="radio" name="p-plan" value="' + o.id + '"' + ((sel.plan || '') === o.id ? ' checked' : '') + '><span class="plan__dot" aria-hidden="true"></span><span class="plan__body"><strong>' + esc(o.name) + '</strong><span>' + esc(o.note) + '</span></span><span class="plan__price" data-money="' + p.price * (1 - o.off) + '">' + money(p.price * (1 - o.off)) + '</span>' + (o.off ? '<span class="plan__save">Save ' + Math.round(o.off * 100) + '%</span>' : '') + '</label>';
    }).join('') + '<p class="plans__note">Selling plans are created by the merchant in Shopify and shown here automatically.</p></fieldset>';
  }
  function planOff(p, sel) { var pl = sel.plan && p.sellingPlans ? p.sellingPlans.filter(function (x) { return x.id === sel.plan; })[0] : null; return pl ? pl.off : 0; }

  if (is('product')) {
    var p = U.byId(U.qs('id')) || U.byId(2);
    var firstAvail = p.sizes.filter(function (s) { return U.variantState(p, p.metals[0], s) === 'available'; })[0] || p.sizes[0];
    var sel = { metal: p.metals[0], size: firstAvail, qty: 1, plan: '' };
    document.title = p.title + ' | Ocean Fine Jewellery';
    $('[data-p-crumb-type]').textContent = p.giftCard ? 'Gift cards' : p.type; $('[data-p-crumb-type]').href = p.giftCard ? R + 'collections/' : R + 'collection/?c=' + p.type.toLowerCase();
    $('[data-p-crumb]').textContent = p.title;

    /* media column: gallery (images, video, 3D in mixed aspect ratios) | true size, then "worn with" */
    var gal = $('[data-gallery]'), list = U.mediaList(p);
    var images = list.filter(function (m) { return m.type === 'image'; });
    var galHTML;
    if (p.giftCard) galHTML = '<div class="pg__giftcard"><div class="gc__card gc__card--lg" role="img" aria-label="Ocean gift card"><div class="gc__card-top"><span>OCEAN</span></div><p class="gc__card-amount">Gift card</p><p class="gc__card-foot">Never expires · Delivered by email</p></div></div>';
    else if (!list.length) galHTML = '<div class="pg__placeholder">' + U.PLACEHOLDER + '<p>Image coming soon</p></div>';
    else galHTML = '<ul class="pg__track" data-track>' + list.map(function (m, i) {
      var cls = 'pg__item pg__item--' + i + ' pg__item--' + m.type + (m.ratio > 1.1 ? ' is-wide' : m.ratio === 1 ? ' is-square' : '');
      var inner = m.type === 'image' ? '<button class="pg__zoom" data-zoom="' + images.indexOf(m) + '" aria-label="Open image ' + (images.indexOf(m) + 1) + ' of ' + images.length + ' in full screen">' + U.mediaHTML(p, m, i) + '</button>' : U.mediaHTML(p, m, i);
      return '<li class="' + cls + '">' + inner + '</li>';
    }).join('') + '</ul><p class="pg__counter" aria-hidden="true"><span data-pg-n>1</span> / ' + list.length + '</p>';
    var ts = trueSize(p);
    gal.innerHTML = (ts ? '<div class="pg__tabs" role="tablist" aria-label="Media view"><button type="button" role="tab" class="pg__tab is-active" aria-selected="true" aria-controls="pg-media" id="pg-tab-media">Photos &amp; video</button><button type="button" role="tab" class="pg__tab" aria-selected="false" aria-controls="pg-size" id="pg-tab-size" tabindex="-1">True size</button></div>' : '') +
      '<div class="pg__panel" id="pg-media" role="tabpanel" aria-labelledby="pg-tab-media">' + galHTML + '</div>' +
      (ts ? '<div class="pg__panel" id="pg-size" role="tabpanel" aria-labelledby="pg-tab-size" hidden>' + ts + '</div>' : '') +
      (p.giftCard ? '' : wornWith(p));
    $$('.pg__tab', gal).forEach(function (t, i, all) {
      on(t, 'click', function () { all.forEach(function (x) { var o = x === t; x.classList.toggle('is-active', o); x.setAttribute('aria-selected', String(o)); x.tabIndex = o ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !o; }); });
      on(t, 'keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = all[(i + (e.key === 'ArrowRight' ? 1 : all.length - 1)) % all.length]; n.focus(); n.click(); } });
    });
    var track = $('[data-track]', gal);
    on(track, 'scroll', function () { var n = Math.round(track.scrollLeft / track.clientWidth) + 1; $('[data-pg-n]', gal).textContent = n; }, { passive: true });
    var lb = $('#lightbox'), li = 0;
    var showLb = function (i) { li = (i + images.length) % images.length; $('[data-lb-img]').src = images[li].src(2000); $('[data-lb-img]').alt = images[li].alt; $('[data-lb-n]').textContent = (li + 1) + ' / ' + images.length; };
    on(gal, 'click', function (e) { var z = e.target.closest('[data-zoom]'); if (z) { showLb(+z.dataset.zoom); U.openLayer(lb, '[data-close-modal]'); } });
    on($('[data-lb-prev]'), 'click', function () { showLb(li - 1); });
    on($('[data-lb-next]'), 'click', function () { showLb(li + 1); });

    /* info column */
    var info = $('[data-pinfo]');
    function giftAmount() { return +String(sel.size).replace('$', ''); }
    function unitNow() { return p.giftCard ? giftAmount() : p.price * (1 - planOff(p, sel)); }
    function priceBlock() {
      if (p.giftCard) return '<strong data-money="' + giftAmount() + '">' + money(giftAmount()) + '</strong>';
      var off = planOff(p, sel);
      if (off) return '<strong data-money="' + unitNow() + '">' + money(unitNow()) + '</strong><s data-money="' + p.price + '">' + money(p.price) + '</s>';
      return U.priceHTML(p) + (p.compare ? '<span class="badge badge--sale">Save ' + Math.round((1 - p.price / p.compare) * 100) + '%</span>' : '');
    }
    function notice(st) {
      if (st === 'available') return '<p class="stock"><span></span>In stock, ready to ship</p>';
      var what = (p.type === 'Rings' ? 'Size ' + sel.size : sel.size) + ' in ' + D.METALS[sel.metal].label;
      var msg = U.isSoldOut(p) ? 'This piece is sold out in every size.' : (st === 'soldout' ? what + ' is sold out.' : what + ' isn’t made.');
      return '<div class="pnotice" role="status"><p><strong>' + msg + '</strong> ' + (U.isSoldOut(p) ? 'We’re making more.' : 'Choose another option above, or') + '</p><button type="button" class="link-btn" data-notify>Email me when it’s available</button></div>';
    }
    function renderInfo() {
      var st = U.variantState(p, sel.metal, sel.size), unit = unitNow();
      var gift = p.giftCard ? '<div class="giftto"><label class="fcheck" for="gift-send"><input type="checkbox" id="gift-send"' + (sel.gift ? ' checked' : '') + '><span class="fcheck__box" aria-hidden="true">' + CHECK + '</span><span class="fcheck__label">Send it to someone as a gift</span></label>' +
        '<div class="giftto__fields form-grid" data-gift-fields' + (sel.gift ? '' : ' hidden') + '>' +
          '<div class="field"><label for="g-email">Recipient email</label><input id="g-email" type="email" autocomplete="off" value="' + esc(sel.gEmail || '') + '"><p class="field__error" id="g-email-error" hidden></p></div>' +
          '<div class="field"><label for="g-name">Recipient name <span class="muted">(optional)</span></label><input id="g-name" autocomplete="off" value="' + esc(sel.gName || '') + '"></div>' +
          '<div class="field field--full"><label for="g-msg">Message <span class="muted">(optional)</span></label><textarea id="g-msg" rows="3" maxlength="200">' + esc(sel.gMsg || '') + '</textarea><span class="field__count"><span data-gmsg-n>' + (sel.gMsg || '').length + '</span>/200</span></div>' +
          '<div class="field"><label for="g-date">Send on <span class="muted">(optional)</span></label><input id="g-date" type="date" value="' + esc(sel.gDate || '') + '"></div>' +
        '</div></div>' : '';
      info.innerHTML =
        '<p class="eyebrow">' + (p.giftCard ? 'Gift card' : p.type + (p.stone !== 'None' ? ' · ' + p.stone : '')) + '</p>' +
        '<h1 class="pinfo__title">' + esc(p.title) + '</h1>' +
        (p.rating && p.reviews ? '<p class="pinfo__rating"><span class="stars" aria-hidden="true">★★★★★</span> ' + p.rating.toFixed(1) + ' out of 5 <span>(' + p.reviews + ' ratings)</span></p>' : '') +
        '<div class="pinfo__price" aria-live="polite" aria-atomic="true">' + priceBlock() + '</div>' +
        (p.unitPer ? '<p class="pinfo__unit">Unit price ' + U.unitPrice(p) + '</p>' : '') +
        '<p class="pinfo__tax">Tax included. <a href="' + R + 'page/#shipping">Shipping</a> calculated at checkout.</p>' +
        (p.giftCard ? '' : '<p class="pinfo__instal">Pay in 4 interest-free instalments of <strong>' + money(unit / 4) + '</strong> with <span class="shop-pay-mark">shop<b>Pay</b></span></p>') +
        '<form class="pinfo__form" data-pform novalidate>' +
          U.optionHTML(p, sel, 'p') + planPicker(p, sel) + gift +
          (p.giftCard || U.isSoldOut(p) ? '' : '<div class="field field--engrave"><label for="engrave">Free engraving <span class="muted">(optional)</span></label><input id="engrave" name="properties[Engraving]" maxlength="12" placeholder="Up to 12 characters" autocomplete="off" value="' + esc(sel.engraving || '') + '"><span class="field__count" data-eng-count>' + (sel.engraving || '').length + '/12</span></div>') +
          notice(st) +
          '<div class="pinfo__buy">' +
            '<div class="qty qty--lg" role="group" aria-label="Quantity"><button type="button" aria-label="Decrease quantity" data-pq="-1"' + (st !== 'available' ? ' disabled' : '') + '>−</button><input type="number" min="1" value="' + sel.qty + '" aria-label="Quantity" data-pq-input' + (st !== 'available' ? ' disabled' : '') + '><button type="button" aria-label="Increase quantity" data-pq="1"' + (st !== 'available' ? ' disabled' : '') + '>+</button></div>' +
            (st === 'available' ? '<button type="submit" class="btn btn--primary btn--lg pinfo__atc" data-atc>Add to bag · <span data-money="' + unit * sel.qty + '">' + money(unit * sel.qty) + '</span></button>' : '<button type="button" class="btn btn--primary btn--lg pinfo__atc" disabled data-atc>' + (st === 'soldout' ? 'Sold out' : 'Unavailable') + '</button>') +
          '</div>' +
          '<p class="form-msg is-error" role="alert" data-p-error hidden></p>' +
          (st === 'available' ? '<button type="button" class="accel__btn accel__btn--shop accel__btn--wide" aria-label="Buy with Shop Pay">Buy with <strong>shop</strong><em>Pay</em></button><button type="button" class="pinfo__more-pay" data-more-pay>More payment options</button>' : '') +
        '</form>' +
        (p.giftCard ? '' : '<div class="pickup"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10l8-6 8 6v10H4z M9 20v-6h6v6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg><div><p><strong>Pickup available at Ocean Studio</strong></p><p class="muted">Usually ready in 24 hours</p><button type="button" class="link-btn" data-store-info>View store information</button></div></div>') +
        '<ul class="usps">' + (p.giftCard ? '<li><span class="usps__i">' + CHECK + '</span>Delivered by email on your date</li><li><span class="usps__i">' + CHECK + '</span>Never expires</li>' :
          '<li><span class="usps__i">' + CHECK + '</span>Free shipping over ' + money(100) + '</li><li><span class="usps__i">' + CHECK + '</span>60-day returns and free resizing</li><li><span class="usps__i">' + CHECK + '</span>Solid recycled 14k gold, stamped 585</li><li><span class="usps__i">' + CHECK + '</span>Lifetime polishing</li>') + '</ul>' +
        '<div class="paccs">' +
          '<details open><summary>Description</summary><div><p>' + esc(p.desc) + '</p></div></details>' +
          (p.giftCard ? '' : '<details><summary>Materials &amp; care</summary><div><ul class="bullets"><li>' + D.METALS[sel.metal].label + ', recycled, stamped 585</li><li>' + (p.stone === 'None' ? 'No stones' : p.stone + (p.stone === 'Diamond' ? ', lab-grown, IGI graded' : ', traced to source')) + '</li><li>Take off before swimming or the gym</li><li>Polish with the cloth in every box</li></ul></div></details>') +
          '<details><summary>Shipping &amp; returns</summary><div><p>Free shipping over ' + money(100) + '. Orders ship within 2 working days. Returns are free for 60 days and resizing is free, including engraved rings.</p></div></details>' +
          (p.type === 'Rings' ? '<details><summary>Size guide</summary><div><table class="size-table"><caption class="visually-hidden">Ring sizes</caption><thead><tr><th scope="col">US</th><th scope="col">UK</th><th scope="col">Inside diameter</th></tr></thead><tbody><tr><td>5</td><td>J½</td><td>15.7 mm</td></tr><tr><td>6</td><td>L½</td><td>16.5 mm</td></tr><tr><td>7</td><td>N½</td><td>17.3 mm</td></tr><tr><td>8</td><td>P½</td><td>18.2 mm</td></tr><tr><td>9</td><td>R½</td><td>19.0 mm</td></tr></tbody></table></div></details>' : '') +
        '</div>' +
        '<div class="share"><span>Share</span><button type="button" class="share__btn" data-copy-link aria-label="Copy link"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> Copy link</button></div>';
      U.bindOptions(info, p, sel, function () { var e = $('#engrave'); if (e) sel.engraving = e.value; saveGift(); renderInfo(); });
      renderSticky(st);
    }
    function saveGift() { if (!p.giftCard) return; var g = function (id) { var el = $('#' + id); return el ? el.value : ''; }; sel.gEmail = g('g-email'); sel.gName = g('g-name'); sel.gMsg = g('g-msg'); sel.gDate = g('g-date'); }
    on(info, 'input', function (e) {
      if (e.target.id === 'engrave') { sel.engraving = e.target.value; $('[data-eng-count]').textContent = e.target.value.length + '/12'; }
      if (e.target.id === 'g-msg') $('[data-gmsg-n]').textContent = e.target.value.length;
    });
    on(info, 'click', function (e) {
      var q = e.target.closest('[data-pq]');
      if (q) { sel.qty = Math.max(1, sel.qty + +q.dataset.pq); $('[data-pq-input]').value = sel.qty; var a = $('[data-atc] [data-money]'); if (a) { a.setAttribute('data-money', unitNow() * sel.qty); a.textContent = money(unitNow() * sel.qty); } $('[data-p-error]').hidden = true; }
      if (e.target.closest('[data-copy-link]')) { try { navigator.clipboard.writeText(location.href); } catch (er) {} U.toast('Link copied'); }
      if (e.target.closest('[data-store-info]')) U.openLayer($('#store-info'), '[data-close-modal]');
      if (e.target.closest('[data-notify]')) U.openLayer($('#notify'), 'input');
      if (e.target.closest('[data-more-pay]')) { e.preventDefault(); U.toast('Shopify shows more payment options here'); }
      if (e.target.closest('.accel__btn')) U.toast('Accelerated checkout runs on Shopify');
    });
    on(info, 'change', function (e) {
      if (e.target.matches('[data-pq-input]')) sel.qty = Math.max(1, parseInt(e.target.value, 10) || 1);
      if (e.target.id === 'gift-send') { sel.gift = e.target.checked; $('[data-gift-fields]').hidden = !sel.gift; if (sel.gift) $('#g-email').focus(); }
    });
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
        var ok = U.addToCart(p.id, sel.qty, { metal: sel.metal, size: sel.size, engraving: sel.engraving, plan: sel.plan, price: p.giftCard ? giftAmount() : 0, recipient: p.giftCard && sel.gift ? (sel.gName || sel.gEmail) : '' });
        if (!ok && err) { err.hidden = false; err.textContent = 'You can only add ' + p.stock + ' of this item to your bag. Lower the quantity and try again.'; }
      }, 500);
    }
    on(info, 'submit', function (e) { e.preventDefault(); var b = $('[data-atc]', info); if (!b.disabled) doAdd(b); });

    /* sticky add to cart (theme setting) */
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

    var recs = D.PRODUCTS.filter(function (x) { return x.id !== p.id && !x.hidden && x.type === p.type; }).concat(D.PRODUCTS.filter(function (x) { return x.id !== p.id && !x.hidden && x.type !== p.type; })).slice(0, 4);
    $('[data-recs]').innerHTML = recs.map(U.cardHTML).join('');
    var rv = U.store.get('ocean-recent', []).filter(function (id) { return id !== p.id && U.byId(id) && !U.byId(id).hidden; });
    var rvEl = $('[data-recent]');
    if (rv.length) { rvEl.innerHTML = rv.slice(0, 4).map(function (id) { var x = U.byId(id); return x ? U.cardHTML(x) : ''; }).join(''); } else $('[data-recent-wrap]').hidden = true;
    if (!p.hidden) U.store.set('ocean-recent', [p.id].concat(rv).slice(0, 8));
    document.addEventListener('ocean:refresh', function () { renderInfo(); $('[data-recs]').innerHTML = recs.map(U.cardHTML).join(''); });

    on($('[data-notify-form]'), 'submit', function (e) {
      e.preventDefault(); var f = e.target, inp = $('input', f), msg = $('[data-form-msg]', f);
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim()); inp.setAttribute('aria-invalid', String(!ok));
      msg.className = 'form-msg ' + (ok ? 'is-success' : 'is-error'); msg.textContent = ok ? 'Thanks, we’ll email you when it’s back in stock.' : 'Enter a valid email address.';
    });
  }

  /* ---------- Featured product section (home) ---------- */
  var fpEl = $('[data-featured-product]');
  if (fpEl) {
    var fp = U.byId(fpEl.dataset.id), fsel = { metal: fp.metals[0], size: fp.sizes[0] };
    var fpRender = function () {
      var st = U.variantState(fp, fsel.metal, fsel.size);
      $('[data-fp-media]', fpEl).innerHTML = U.galleryHTML(fp, 'fp');
      U.bindGallery($('[data-fp-media]', fpEl), fp);
      $('[data-fp-info]', fpEl).innerHTML =
        '<p class="eyebrow">Featured piece</p><h2 class="h2 fp__title">' + esc(fp.title) + '</h2>' +
        (fp.rating && fp.reviews ? '<p class="fp__rating"><span class="stars" aria-hidden="true">★</span> ' + fp.rating.toFixed(1) + ' out of 5 (' + fp.reviews + ' ratings)</p>' : '') +
        '<p class="fp__price" aria-live="polite">' + U.priceHTML(fp) + '</p><p class="fp__desc">' + esc(fp.desc) + '</p>' +
        U.optionHTML(fp, fsel, 'fp') +
        (st === 'available' ? '<button class="btn btn--primary btn--lg btn--block" data-fp-add>Add to bag · <span data-money="' + fp.price + '">' + money(fp.price) + '</span></button>' : '<button class="btn btn--primary btn--lg btn--block" disabled>Sold out</button>') +
        '<a class="link-arrow" href="' + R + 'product/?id=' + fp.id + '">View full details <span aria-hidden="true">→</span></a>';
      U.bindOptions($('[data-fp-info]', fpEl), fp, fsel, fpRender);
      on($('[data-fp-add]', fpEl), 'click', function () { U.addToCart(fp.id, 1, { metal: fsel.metal, size: fsel.size }); });
    };
    fpRender();
    document.addEventListener('ocean:refresh', fpRender);
  }

''')

# ---- cart page: gift wrap is a product line; no separate wrap row
rep("      $('[data-cp-wrap-row]').hidden = !t.wrap; $('[data-cp-wrap]').textContent = money(t.wrap);", "      $('[data-cp-wrap-row]').hidden = true;")
s = s.replace("      $('[data-cp-sub]').textContent = money(t.sub - t.wrap);", "      $('[data-cp-sub]').textContent = money(t.sub);")
import re
s = re.sub(r"\n    \$\('\[data-cp-pop\]'\)\.innerHTML = [^\n]*", "", s)

# ---- care article body (solid gold, not vermeil)
s = s.replace("3: ['Gold vermeil is a thick layer of gold over sterling silver. It wears beautifully for years if you keep it away from water, perfume and lotion.',",
              "3: ['Solid 14k gold doesn’t flake or wear through, but it does pick up oils and fine scratches. Keeping it away from chlorine, perfume and lotion keeps it bright.',")

# ---- standalone states: password error, expired gift card, addresses
rep("  if (is('gift-card')) {", """  if (is('password') && U.qs('state') === 'error') {
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
    }""")

# ---- states: notify link on the variant demo + rich media demo
rep("      $('[data-st-variant]').innerHTML = U.optionHTML(sp, ssel, 'st') + (st === 'available' ? '<button class=\"btn btn--primary btn--block\">Add to bag</button>' : '<button class=\"btn btn--primary btn--block\" disabled>' + (st === 'soldout' ? 'Sold out' : 'Unavailable') + '</button>') + '<p class=\"st-note\">Rose gold in size 5 isn’t made (Unavailable). Size 9 is sold out in every metal.</p>';",
    "      $('[data-st-variant]').innerHTML = U.optionHTML(sp, ssel, 'st') + (st !== 'available' ? '<div class=\"pnotice\" role=\"status\"><p><strong>' + (st === 'soldout' ? 'Size ' + ssel.size + ' is sold out.' : 'Size ' + ssel.size + ' in ' + D.METALS[ssel.metal].label + ' isn’t made.') + '</strong> Choose another option above, or</p><button type=\"button\" class=\"link-btn\" data-st-notify>Email me when it’s available</button><form class=\"st-notify\" data-st-notify-form novalidate hidden><label class=\"visually-hidden\" for=\"st-notify-email\">Email address</label><input id=\"st-notify-email\" type=\"email\" placeholder=\"Email address\" autocomplete=\"email\"><button class=\"btn btn--primary\" type=\"submit\">Notify me</button><p class=\"form-msg\" role=\"status\" aria-live=\"polite\" data-form-msg></p></form></div>' : '') + (st === 'available' ? '<button class=\"btn btn--primary btn--block\">Add to bag</button>' : '<button class=\"btn btn--primary btn--block\" disabled>' + (st === 'soldout' ? 'Sold out' : 'Unavailable') + '</button>') + '<p class=\"st-note\">Rose gold in size 5 isn’t made (Unavailable). Size 9 is sold out in every metal.</p>';")
rep("      U.bindOptions($('[data-st-variant]'), sp, ssel, renderVar);",
    "      U.bindOptions($('[data-st-variant]'), sp, ssel, renderVar);\n      var nb = $('[data-st-notify]'), nf = $('[data-st-notify-form]');\n      on(nb, 'click', function () { nf.hidden = false; nb.hidden = true; $('input', nf).focus(); });\n      on(nf, 'submit', function (e) { e.preventDefault(); var i = $('input', nf), m = $('[data-form-msg]', nf), ok = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(i.value.trim()); i.setAttribute('aria-invalid', String(!ok)); m.className = 'form-msg ' + (ok ? 'is-success' : 'is-error'); m.textContent = ok ? 'Thanks, we’ll email you when it’s back.' : 'Enter a valid email address.'; });")
rep("    var hc = $('[data-st-hover] .card'); if (hc) hc.classList.add('is-hover');",
    "    var hc = $('[data-st-hover] .card'); if (hc) hc.classList.add('is-hover');\n    var mg = $('[data-st-media]'); if (mg) { mg.innerHTML = U.galleryHTML(U.byId(1), 'st'); U.bindGallery(mg, U.byId(1)); }\n    var mg3 = $('[data-st-media3d]'); if (mg3) { mg3.innerHTML = U.galleryHTML(U.byId(2), 'st3'); U.bindGallery(mg3, U.byId(2)); }")
open('pages.js', 'w').write(s)
print('pages.js patched')
