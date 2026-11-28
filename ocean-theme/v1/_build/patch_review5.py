"""One-off: fixes from the 28 Nov blocker check.
1 rename the theme and demo brand to Lagoon, 2 remove back-in-stock forms, 3 named automatic discount
state (line + order), 4 no-reviews state, 5 Shop Pay line keeps the logo with its text, 6 visible
pause/play glyph on the current hero slide, 7 no 1x1 placeholder in the lightbox."""
import os
import re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')


def edit(path, pairs):
    path = os.path.join(ROOT, path)
    s = open(path).read()
    for a, b in pairs:
        assert s.count(a) == 1, (path, s.count(a), a[:90])
        s = s.replace(a, b)
    open(path, 'w').write(s)


# ---- 2. remove "Email me when it's available" and the notify modal
edit('pages.js', [
    ("""'</strong> ' + (U.isSoldOut(p) ? 'We’re making more.' : 'Choose another option above, or') + '</p><button type="button" class="link-btn" data-notify>Email me when it’s available</button></div>';""",
     """'</strong> ' + (U.isSoldOut(p) ? 'We’re making more.' : 'Choose another option above.') + '</p></div>';"""),
    ("""      if (e.target.closest('[data-notify]')) U.openLayer($('#notify'), 'input');\n""", ''),
    ("""    on($('[data-notify-form]'), 'submit', function (e) {
      e.preventDefault(); var f = e.target, inp = $('input', f), msg = $('[data-form-msg]', f);
      var ok = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(inp.value.trim()); inp.setAttribute('aria-invalid', String(!ok));
      msg.className = 'form-msg ' + (ok ? 'is-success' : 'is-error'); msg.textContent = ok ? 'Thanks, we’ll email you when it’s back in stock.' : 'Enter a valid email address.';
    });
""", ''),
    ("""'</strong> Choose another option above, or</p><button type="button" class="link-btn" data-st-notify>Email me when it’s available</button><form class="st-notify" data-st-notify-form novalidate hidden><label class="visually-hidden" for="st-notify-email">Email address</label><input id="st-notify-email" type="email" placeholder="Email address" autocomplete="email"><button class="btn btn--primary" type="submit">Notify me</button><p class="form-msg" role="status" aria-live="polite" data-form-msg></p></form></div>'""",
     """'</strong> Choose another option above.</p></div>'"""),
    ("""      var nb = $('[data-st-notify]'), nf = $('[data-st-notify-form]');
      on(nb, 'click', function () { nf.hidden = false; nb.hidden = true; $('input', nf).focus(); });
      on(nf, 'submit', function (e) { e.preventDefault(); var i = $('input', nf), m = $('[data-form-msg]', nf), ok = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(i.value.trim()); i.setAttribute('aria-invalid', String(!ok)); m.className = 'form-msg ' + (ok ? 'is-success' : 'is-error'); m.textContent = ok ? 'Thanks, we’ll email you when it’s back.' : 'Enter a valid email address.'; });
""", ''),
    # 5. Shop Pay line: keep "with shop Pay" together so the logo never wraps alone
    ("""'</strong> with <span class="shop-pay-mark">shop<b>Pay</b></span></p>'""",
     """'</strong> <span class="nowrap">with <span class="shop-pay-mark">shop<b>Pay</b></span></span></p>'"""),
])
t = open(os.path.join(HERE, 'templates.py')).read()
i = t.index('<div class="modal" id="notify"')
j = t.index('</div>', t.index('data-form-msg></p></form></div>', i) + 30) + len('</div>')
t = t[:i].rstrip('\n') + t[j:]
t = t.replace("Crossed-out options, a notice and an “Email me when it’s available” link. Try the options below.",
              "Crossed-out options and a notice that points to the options still available. Try the options below.")
# 7. lightbox: no placeholder image; the src is set when it opens
assert t.count('<img data-lb-img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="">') == 1
t = t.replace('<img data-lb-img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="">', '<img data-lb-img alt="">')
open(os.path.join(HERE, 'templates.py'), 'w').write(t)
edit('ready.css', [
    (""".st-notify { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
.st-notify input { flex: 1 1 180px; min-height: 46px; padding: 0 14px; border: 1px solid #8B9493; border-radius: var(--r-sm); background: #fff; }
.st-notify .form-msg { flex-basis: 100%; }
""", ''),
])

# ---- 3. named automatic discounts: line level (Necklace Week, 10% off necklaces) and order level
# (Spend $300, save $25). Preview only, from the Theme settings switch or ?discount=sample.
edit('script.js', [
    ("""  function totals() {
    var sub = 0, disc = 0, on = stackDiscountOn();
    cart.forEach(function (l) { var lp = unitOf(l) * l.qty; sub += lp; if (l.bundle && on) disc += lp * 0.15; });
    return { sub: sub, disc: disc, total: sub - disc, count: cart.reduce(function (a, l) { return a + l.qty; }, 0), wrap: 0 };
  }""",
     """  /* Sample automatic discounts (preview only). In Liquid: line rows come from line_item.line_level_discount_allocations,
     order rows from cart.cart_level_discount_applications; names are the merchant's discount titles. */
  var SAMPLE_LINE = { name: 'Necklace Week', off: 0.10, type: 'Necklaces' }, SAMPLE_ORDER = { name: 'Spend $300, save $25', min: 300, amount: 25 };
  function sampleDiscountOn() { return document.documentElement.classList.contains('has-sample-discount'); }
  function lineDiscounts(l) {
    var p = byId(l.id), lp = unitOf(l) * l.qty, out = [];
    if (l.bundle && stackDiscountOn()) out.push({ name: 'Stack discount', amount: lp * 0.15 });
    else if (sampleDiscountOn() && p.type === SAMPLE_LINE.type) out.push({ name: SAMPLE_LINE.name, amount: lp * SAMPLE_LINE.off });
    return out;
  }
  function totals() {
    var sub = 0, disc = 0, named = {}, list = [];
    var add = function (name, amt, level) { if (!named[name]) { named[name] = { name: name, amount: 0, level: level }; list.push(named[name]); } named[name].amount += amt; disc += amt; };
    cart.forEach(function (l) { sub += unitOf(l) * l.qty; lineDiscounts(l).forEach(function (d) { add(d.name, d.amount, 'line'); }); });
    if (sampleDiscountOn() && sub - disc >= SAMPLE_ORDER.min) add(SAMPLE_ORDER.name, SAMPLE_ORDER.amount, 'order');
    return { sub: sub, disc: disc, discounts: list, total: sub - disc, count: cart.reduce(function (a, l) { return a + l.qty; }, 0), wrap: 0 };
  }
  function discountRowsHTML(t, rowCls) {
    return t.discounts.filter(function (d) { return d.amount >= 0.005; }).map(function (d) {
      return '<div class="' + rowCls + '"><' + (rowCls.indexOf('cp-') === 0 ? 'dt' : 'span') + '>' + esc(d.name) + ' <small>(automatic' + (d.level === 'order' ? ', order' : '') + ')</small></' + (rowCls.indexOf('cp-') === 0 ? 'dt' : 'span') + '><' + (rowCls.indexOf('cp-') === 0 ? 'dd' : 'strong') + '>−' + money(d.amount) + '</' + (rowCls.indexOf('cp-') === 0 ? 'dd' : 'strong') + '></div>';
    }).join('');
  }"""),
    ("""    var p = byId(l.id), unit = unitOf(l), pl = planOf(p, l), on = stackDiscountOn();""",
     """    var p = byId(l.id), unit = unitOf(l), pl = planOf(p, l), ld = lineDiscounts(l), lineOff = ld.reduce(function (a, d) { return a + d.amount; }, 0);"""),
    ("""        (l.bundle && on ? '<span class="line__tag">Stack discount (−' + money(unit * l.qty * 0.15) + ')</span>' : '') +""",
     """        ld.map(function (d) { return '<span class="line__tag"><svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12V4a1 1 0 011-1h8l9 9-9 9z M8 8h.01" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>' + esc(d.name) + ' (−' + money(d.amount) + ')</span>'; }).join('') +"""),
    ("""'<div class="line__right"><span class="line__price">' + money(unit * l.qty * (l.bundle && on ? 0.85 : 1)) + '</span>""",
     """'<div class="line__right"><span class="line__price">' + (lineOff >= 0.005 ? '<s><span class="visually-hidden">Was </span>' + money(unit * l.qty) + '</s> <span class="visually-hidden">Now </span>' : '') + money(unit * l.qty - lineOff) + '</span>"""),
    ("""      var hasDisc = t.disc >= 0.005;
      $('[data-bundle-row]', drawer).hidden = !hasDisc;
      $('[data-cart-discount]', drawer).textContent = hasDisc ? '−' + money(t.disc) : '';""",
     """      $('[data-disc-rows]', drawer).innerHTML = discountRowsHTML(t, 'cart-drawer__row cart-drawer__row--discount');"""),
    ("""stackDiscount: false, stickyAtc: true, upsell: true });""",
     """stackDiscount: false, sampleDiscount: false, stickyAtc: true, upsell: true });
  if (/[?&]discount=sample/.test(location.search)) { prefs.sampleDiscount = true; store.set(PREF_KEY, prefs); }"""),
    ("""    de.classList.toggle('has-stack-discount', !!prefs.stackDiscount);""",
     """    de.classList.toggle('has-stack-discount', !!prefs.stackDiscount);
    de.classList.toggle('has-sample-discount', !!prefs.sampleDiscount);"""),
    ("ratingHTML: ratingHTML,", "ratingHTML: ratingHTML, discountRowsHTML: discountRowsHTML,"),
])
edit('_build/partials.py', [
    ("""    <div class="cart-drawer__row cart-drawer__row--discount" data-bundle-row hidden><span>Stack discount</span><strong data-cart-discount></strong></div>""",
     """    <div class="cart-drawer__discounts" data-disc-rows></div>"""),
    ("""Turn on only after creating the matching automatic discount in Shopify.</small></span></label>""",
     """Turn on only after creating the matching automatic discount in Shopify.</small></span></label>
      <label class="switch"><input type="checkbox" data-setting="sampleDiscount"><span class="switch__ui" aria-hidden="true"></span><span>Preview automatic discounts<small>Demo only: shows how Shopify discounts appear by name on cart lines and in the total.</small></span></label>"""),
])
edit('_build/templates.py', [
    ("""        <div class="cp-totals__disc" data-cp-disc-row hidden><dt>Stack discount (automatic)</dt><dd data-cp-disc></dd></div>\n""", ''),
])
edit('pages.js', [
    ("""      $('[data-cp-disc-row]').hidden = !t.disc; $('[data-cp-disc]').textContent = '−' + money(t.disc);""",
     """      $$('.cp-totals__disc').forEach(function (r) { r.remove(); });
      $('.cp-totals__total').insertAdjacentHTML('beforebegin', U.discountRowsHTML(t, 'cp-totals__disc'));"""),
    # cart page: ?discount=sample fills an empty bag with a necklace and earrings so both discounts show
    ("""    function renderCartPage() {""",
     """    if (/[?&]discount=sample/.test(location.search) && !U.getCart().length) { U.addToCart(5, 1, { silent: true }); U.addToCart(4, 1, { silent: true }); }
    function renderCartPage() {"""),
])

# ---- 4. no-reviews state + 3. discount state on the Design states page
edit('_build/templates.py', [
    ("""'<div class="st-media" data-st-media3d></div>'),""",
     """'<div class="st-media" data-st-media3d></div>'),
        block(15, 'No reviews yet', 'Ratings come from the reviews.rating and reviews.rating_count metafields. With no reviews the stars are hidden and nothing else moves, on the card and the product page.', '<ul class="product-grid st-grid" data-st-noreviews></ul><div class="st-row st-mt"><a class="btn btn--outline" href="product.html?id=12">Product page with no reviews</a></div>'),
        block(16, 'Automatic discount', 'Shopify automatic discounts shown by name: “Necklace Week” on the necklace line, and “Spend $300, save $25” on the order total. Preview only. Turn it off in Theme settings.', '<div class="st-row"><a class="btn btn--outline" href="cart.html?discount=sample">Cart page with discounts</a><a class="btn btn--outline" href="index.html?cart=open&amp;discount=sample">Cart drawer with discounts</a></div>'),"""),
    ("""    ('Theme settings', 'Logo',""",
     """    ('Cart', 'Discounts', 'No setting. Shopify automatic discounts show by name on cart lines and in the total, from discount allocations.'),
    ('Theme settings', 'Logo',"""),
])
edit('pages.js', [
    ("""    put('[data-st-sold]', U.cardHTML(U.byId(8)));""",
     """    put('[data-st-sold]', U.cardHTML(U.byId(8)));
    put('[data-st-noreviews]', U.cardHTML(U.byId(12)));"""),
])

# ---- 6. hero: the current slide button shows a pause glyph on hover/focus and a play glyph while paused
h = open(os.path.join(HERE, 'home.py')).read()
n = h.count('</svg><span>')
h = h.replace('<circle class="ring-fill" cx="24" cy="24" r="22"/></svg><span>', '<circle class="ring-fill" cx="24" cy="24" r="22"/></svg><i class="hero__pp" aria-hidden="true"></i><span>')
assert h.count('hero__pp') == 3, h.count('hero__pp')
open(os.path.join(HERE, 'home.py'), 'w').write(h)

css = """
/* ---- review 5 (28 Nov) ---- */
.nowrap { white-space: nowrap; }
.cart-drawer__discounts:empty { display: none; }
.cart-drawer__row--discount small, .cp-totals__disc small { font-weight: 400; font-size: 12px; color: var(--c-muted); }
.line__tag { display: inline-flex; align-items: center; gap: 5px; }
.line__price s { font-weight: 400; color: var(--c-muted); margin-right: 4px; font-size: .9em; }
.hero__pp { position: relative; display: none; width: 12px; height: 14px; }
.hero__pp::before, .hero__pp::after { content: ""; position: absolute; top: 0; width: 4px; height: 14px; border-radius: 1px; background: currentColor; }
.hero__pp::before { left: 1px; } .hero__pp::after { right: 1px; }
.hero__dot.is-active:hover .hero__pp, .hero__dot.is-active:focus-visible .hero__pp, .hero.is-paused .hero__dot.is-active .hero__pp { display: block; }
.hero .hero__rail .hero__dot.is-active:hover span, .hero .hero__rail .hero__dot.is-active:focus-visible span, .hero.is-paused .hero__rail .hero__dot.is-active span { display: none; }
.hero.is-paused .hero__dot.is-active .hero__pp { width: 0; height: 0; margin-left: 3px; border-style: solid; border-width: 7px 0 7px 12px; border-color: transparent transparent transparent currentColor; }
.hero.is-paused .hero__dot.is-active .hero__pp::before, .hero.is-paused .hero__dot.is-active .hero__pp::after { content: none; }
"""
open(os.path.join(ROOT, 'ready.css'), 'a').write(css)

# ---- 1. rename: theme + demo brand Ocean -> Lagoon (visible text only; code names and the folder URL stay)
for f in ['_build/home.py', '_build/partials.py', '_build/templates.py', '_build/build.py', 'data.js', 'script.js', 'pages.js']:
    p = os.path.join(ROOT, f)
    s = open(p).read()
    s = re.sub(r'\bOcean\b', 'Lagoon', s)
    s = s.replace('>OCEAN<', '>LAGOON<')
    open(p, 'w').write(s)
print('review-5 patch applied')
