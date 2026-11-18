(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var money = function (n) { return '$' + n.toFixed(2); };

  /* Example products (not the client's catalog) */
  var P = [
    { name: 'Washable Mat · Small', retail: 79, ws: 39.5, c: '#c9b79c' },
    { name: 'Washable Mat · Medium', retail: 119, ws: 59.5, c: '#9fb3a5' },
    { name: 'Washable Mat · Large', retail: 169, ws: 84.5, c: '#c79c86' },
    { name: 'Wholesale display pack', retail: null, ws: 210, c: '#8e9aa6', wsOnly: true }
  ];
  var MIN = 5, SHIP = 'Wholesale shipping rule applied';
  var cart = {};

  var V = {
    guest: { acct: 'Log in', nav: false,
      why: '<b>Logged out:</b> only retail prices and retail products are shown. Wholesale prices and wholesale-only products are not in the page at all, because Shopify only loads the wholesale catalog for an approved company contact. It is not hidden with CSS, so it can\'t be found in the page source.' },
    retail: { acct: 'Hi, Jamie', nav: false,
      why: '<b>Retail customer:</b> logged in, but not part of a company, so Shopify still shows the retail catalog. Being logged in alone never unlocks wholesale.' },
    pending: { acct: 'Hi, Sam · Bloom Store', nav: true, pending: true,
      why: '<b>Request pending:</b> the company exists in your admin, but ordering is off until you approve it. They still see retail prices and a "request under review" message.' },
    approved: { acct: 'Hi, Sam · Bloom Store', nav: true, ok: true,
      why: '<b>Approved buyer:</b> Shopify applies the wholesale catalog: wholesale prices, the wholesale-only product, a minimum of 5 per SKU enforced in the cart and at checkout, and your wholesale shipping rule. Try adding fewer than 5.' }
  };

  function render(v) {
    var s = V[v]; cart = {};
    $('#acct').textContent = s.acct;
    $('#storeNav').innerHTML = 'Shop · Uses · Our story · Contact · ' + (s.ok ? '<span class="ws">Wholesale catalog</span>' : 'Wholesale');
    var list = P.filter(function (p) { return s.ok || !p.wsOnly; });
    $('#grid').innerHTML = list.map(function (p, i) {
      var price = s.ok
        ? '<div class="price">' + money(p.ws) + (p.retail ? '<s>' + money(p.retail) + '</s>' : '') + '<small>Wholesale price · min ' + MIN + ' per SKU</small></div>'
        : '<div class="price">' + money(p.retail) + '</div>';
      var q = s.ok ? '<div class="qty"><button type="button" data-d="-1" data-i="' + i + '" aria-label="Fewer">−</button><input value="' + MIN + '" inputmode="numeric" data-i="' + i + '" aria-label="Quantity"><button type="button" data-d="1" data-i="' + i + '" aria-label="More">+</button><button type="button" class="add" data-add="' + i + '">Add</button></div><p class="msg" id="m' + i + '"></p>'
        : '<div class="qty"><button type="button" class="add">Add to cart</button></div>';
      return '<article class="prod"><div class="img" style="--c:' + p.c + '">' + (p.wsOnly ? '<i>Wholesale only</i>' : '<i>Example</i>') + '</div><div class="pi"><b>' + p.name + '</b>' + price + q + '</div></article>';
    }).join('');
    if (s.ok) {
      $('#side').innerHTML = '<h3>Wholesale cart</h3><div class="cart" id="cart"><p>Add items to see the rules applied.</p></div><div class="box ok">✓ Approved company account</div>';
      wire(list);
    } else if (s.pending) {
      $('#side').innerHTML = '<h3>Wholesale</h3><div class="box lock">⏳ <b>Your request is under review.</b><br>We\'ll email you as soon as your account is approved.</div><p>Wholesale prices stay hidden until approval.</p>';
    } else {
      $('#side').innerHTML = '<h3>Wholesale</h3><p>Are you a retailer? Apply for a wholesale account.</p><div class="fakeform"><span>Business name</span><span>Email</span><span>Website or resale ID</span><em>Request access</em></div><div class="box lock">🔒 Wholesale prices and catalog are only visible to approved accounts.</div>';
    }
    $('#why').innerHTML = s.why;
    [].forEach.call(document.querySelectorAll('.who button'), function (b) { b.setAttribute('aria-selected', String(b.dataset.v === v)); });
  }

  function wire(list) {
    var g = $('#grid');
    g.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.d) { var inp = g.querySelector('input[data-i="' + b.dataset.i + '"]'); inp.value = Math.max(1, (parseInt(inp.value, 10) || 0) + +b.dataset.d); check(b.dataset.i); }
      if (b.dataset.add) {
        var i = b.dataset.add, n = parseInt(g.querySelector('input[data-i="' + i + '"]').value, 10) || 0;
        if (n < MIN) { $('#m' + i).textContent = 'Minimum order is ' + MIN + ' units for this item.'; return; }
        cart[i] = n; $('#m' + i).textContent = ''; drawCart(list);
      }
    };
    g.oninput = function (e) { if (e.target.dataset.i) check(e.target.dataset.i); };
    function check(i) { var n = parseInt(g.querySelector('input[data-i="' + i + '"]').value, 10) || 0; $('#m' + i).textContent = n < MIN ? 'Minimum order is ' + MIN + ' units for this item.' : ''; }
  }
  function drawCart(list) {
    var rows = '', sub = 0;
    Object.keys(cart).forEach(function (i) { var p = list[i], t = p.ws * cart[i]; sub += t; rows += '<div><span>' + p.name + ' × ' + cart[i] + '</span><span>' + money(t) + '</span></div>'; });
    $('#cart').innerHTML = rows + '<div><span>Shipping</span><span>' + SHIP.replace('Wholesale shipping rule applied', 'Wholesale rule') + '</span></div><div class="tot"><span>Subtotal</span><span>' + money(sub) + '</span></div>';
  }

  [].forEach.call(document.querySelectorAll('.who button'), function (b) { b.addEventListener('click', function () { render(b.dataset.v); }); });
  render('guest');

  /* Setup map */
  var M = [
    ['Company accounts', 'Shopify B2B Companies: each business gets a company with its location and buyer contacts.', '<span class="pn all">All plans</span>'],
    ['Wholesale prices only for approved accounts', 'A wholesale catalog with its own prices, assigned to your B2B market. It only applies to logged-in contacts of approved companies.', '<span class="pn all">All plans</span> new Markets needed; per-company prices on Plus only'],
    ['Hide catalog from logged-out and unapproved visitors', 'Wholesale-only products are left out of the retail Online Store publication. The theme checks whether the visitor is a B2B buyer, so wholesale links and content only show to them.', '<span class="pn all">All plans</span>'],
    ['Minimum 5 units per SKU', 'Quantity rules on the wholesale catalog (minimum 5 per variant), enforced in the cart and at checkout. The product page quantity selector starts at 5.', '<span class="pn all">All plans</span>'],
    ['Wholesale shipping rule', 'Shipping rates set for the B2B market. If the rule needs logic (for example free above an order value), a delivery customization app handles it.', '<span class="pn q">Confirm the rule</span>'],
    ['Account request form', 'Shopify Forms wholesale request form, styled to your Figma. It creates the company with ordering switched off.', '<span class="pn all">All plans</span>'],
    ['Manual approval + approval email', 'You approve in Shopify admin. The buyer gets Shopify\'s B2B access email, rewritten and branded in your voice.', '<span class="pn all">All plans</span>'],
    ['Figma to Shopify, not a template look', 'Online Store 2.0 theme with custom Liquid sections built from your Figma, all editable in the theme editor.', '<span class="pn all">All plans</span>'],
    ['SEO, redirects, analytics, speed', 'Meta titles and descriptions, 301 redirects from old URLs, GA4 and Shopify analytics, image and script optimisation, checked on mobile.', '<span class="pn all">All plans</span>']
  ];
  $('#mapBody').innerHTML = M.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('');

  /* Milestones */
  var MS = [
    ['Week 1', 'Theme and homepage', ['Theme set up, fonts, colours and global sections from your Figma', 'Header, footer, navigation', 'Homepage, desktop and mobile'], 'You review the homepage on a preview link'],
    ['Week 2', 'All other pages', ['3 use pages', 'Our Story and Contact', 'Wholesale page with the request form'], 'You review every page side by side with Figma'],
    ['Week 3', 'B2B wholesale', ['Companies, wholesale catalog and prices', 'Min 5 per SKU, shipping rule', 'Approval flow and branded email'], 'You test as a buyer with a demo company'],
    ['Week 4', 'Launch', ['SEO, redirects, analytics, speed', 'Full test on desktop and mobile', 'Go live, then training video'], '30 days of support starts']
  ];
  $('#ms').innerHTML = MS.map(function (m) { return '<article><span class="wk">' + m[0] + '</span><h3>' + m[1] + '</h3><ul>' + m[2].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><p class="rev">' + m[3] + '</p></article>'; }).join('');
})();
