/* =========================================================
   ÉLARA — Homepage concept interactions
   ========================================================= */
(function () {
  'use strict';

  var U = function (id, w, h) {
    return 'https://images.unsplash.com/' + id + '?w=' + (w || 700) + (h ? '&h=' + h : '') + '&q=70&auto=format&fit=crop';
  };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + n.toFixed(2); };
  var money0 = function (n) { return '$' + Math.round(n); };
  var store = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------------- Product data (placeholder) ---------------- */
  var SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  var PRODUCTS = [
    { id: 'p1', name: 'Oversized Wool-Blend Coat', cat: 'Outerwear', price: 189, rating: 4.9, reviews: 312, img: 'photo-1539109136881-3be0616acf4b', img2: 'photo-1544022613-e87ca75a784a', colors: [['Sky', '#A9C1D9'], ['Camel', '#C19A6B'], ['Black', '#1C1A17']], badge: 'Bestseller', sold: ['XS'], tags: ['best'] },
    { id: 'p2', name: 'Tailored Check Coat', cat: 'Outerwear', price: 159, compare: 219, rating: 4.8, reviews: 184, img: 'photo-1485968579580-b6d095142e6e', img2: 'photo-1483985988355-763728e1935b', colors: [['Navy Check', '#2B3A4F'], ['Burgundy', '#6B2232']], badge: 'sale', stock: 4, tags: ['best'] },
    { id: 'p3', name: 'Fine Rib Turtleneck', cat: 'Knitwear', price: 68, rating: 4.9, reviews: 527, img: 'photo-1550639525-c97d455acf70', img2: 'photo-1558769132-cb1aea458c5e', colors: [['Black', '#1C1A17'], ['Oat', '#DCCFBC'], ['Cocoa', '#6A4B3A']], badge: 'Bestseller', tags: ['best', 'under'] },
    { id: 'p4', name: 'Corduroy Shirt Dress', cat: 'Dresses', price: 128, rating: 4.7, reviews: 96, img: 'photo-1585487000160-6ebcfceb0d03', img2: 'photo-1595777457583-95e059d581b8', colors: [['Plum', '#6B2232'], ['Olive', '#5E6146']], badge: 'New', tags: ['new'] },
    { id: 'p5', name: 'Utility Field Jacket', cat: 'Outerwear', price: 145, rating: 4.8, reviews: 143, img: 'photo-1544022613-e87ca75a784a', img2: 'photo-1539109136881-3be0616acf4b', colors: [['Khaki', '#6B6447'], ['Stone', '#BDB3A2']], badge: 'New', sold: ['XL'], tags: ['new', 'best'] },
    { id: 'p6', name: 'Floral Wrap Midi Dress', cat: 'Dresses', price: 98, rating: 4.8, reviews: 268, img: 'photo-1572804013309-59a88b7e92f1', img2: 'photo-1595777457583-95e059d581b8', colors: [['Poppy', '#B4322A'], ['Ivory', '#EFE7DC']], badge: 'Bestseller', stock: 3, tags: ['best', 'under'] },
    { id: 'p7', name: 'Satin Bomber Jacket', cat: 'Outerwear', price: 118, rating: 4.6, reviews: 74, img: 'photo-1591047139829-d91aecb6caea', img2: 'photo-1544022613-e87ca75a784a', colors: [['Rust', '#B86B4B'], ['Black', '#1C1A17']], badge: 'New', tags: ['new'] },
    { id: 'p8', name: 'High-Rise Wide-Leg Trousers', cat: 'Trousers', price: 88, rating: 4.7, reviews: 201, img: 'photo-1594633312681-425c7b97ccd1', img2: 'photo-1485968579580-b6d095142e6e', colors: [['Blush', '#D9B8A6'], ['Charcoal', '#3A3A3A'], ['Cream', '#EDE5D8']], tags: ['under', 'new'] },
    { id: 'p9', name: 'Relaxed Organic Cotton Tee', cat: 'Tops & Tees', price: 38, rating: 4.9, reviews: 812, img: 'photo-1583744946564-b52ac1c389c8', img2: 'photo-1618354691373-d851c5c3a990', colors: [['Black', '#1C1A17'], ['White', '#F4F1EC'], ['Sage', '#9BA88E']], badge: 'Bestseller', tags: ['best', 'under'] },
    { id: 'p10', name: 'Off-Shoulder Velvet Gown', cat: 'Dresses', price: 165, compare: 210, rating: 4.8, reviews: 58, img: 'photo-1566174053879-31528523f8ae', img2: 'photo-1612336307429-8a898d10e223', colors: [['Plum', '#5B1F3A'], ['Emerald', '#1F4D3E']], badge: 'sale', stock: 2, tags: ['new'] },
    { id: 'p11', name: 'Everyday Leather Tote', cat: 'Accessories', price: 76, rating: 4.7, reviews: 133, img: 'photo-1492707892479-7bc8d5a4ee93', img2: 'photo-1479064555552-3ef4979f8908', colors: [['Black', '#1C1A17'], ['Tan', '#A0703E']], tags: ['under'], oneSize: true },
    { id: 'p12', name: 'Chunky Colour-Block Knit', cat: 'Knitwear', price: 92, rating: 4.8, reviews: 119, img: 'photo-1475180098004-ca77a66827be', img2: 'photo-1558769132-cb1aea458c5e', colors: [['Rust/Ivory', '#B86B4B'], ['Grey/Ivory', '#9C9A96']], badge: 'New', tags: ['new', 'under'] }
  ];
  var byId = function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; };

  var REVIEWS = [
    { t: 'The coat of my dreams', b: 'I get stopped every time I wear it. The fabric is heavy and luxurious, and it fits exactly like the size guide said.', n: 'Priya S.', loc: 'New York, NY', p: 'p1', size: 'M', fit: 'True to size' },
    { t: 'Finally, a tee that lasts', b: 'Washed it 20+ times and it still looks brand new. I have it in every colour now — that says it all.', n: 'Jordan M.', loc: 'Austin, TX', p: 'p9', size: 'S', fit: 'True to size' },
    { t: 'Obsessed with the quality', b: 'Soft, warm and not itchy at all. Shipping was super quick and the packaging felt really premium.', n: 'Emily R.', loc: 'Seattle, WA', p: 'p3', size: 'S', fit: 'True to size' },
    { t: 'Perfect for every occasion', b: 'Wore it to a wedding and to brunch the next day. The wrap is flattering and the print is even prettier in person.', n: 'Aisha K.', loc: 'Chicago, IL', p: 'p6', size: 'M', fit: 'Slightly relaxed' },
    { t: 'Exchange was effortless', b: 'Needed a size down and the exchange took two minutes online. New one arrived in three days. Customer for life!', n: 'Natalie D.', loc: 'Miami, FL', p: 'p8', size: 'XS', fit: 'Runs slightly large' },
    { t: 'Elevated basics done right', b: 'The tailoring is beautiful and it feels so much more expensive than it is. Already planning my next order.', n: 'Sofia L.', loc: 'Los Angeles, CA', p: 'p2', size: 'M', fit: 'True to size' }
  ];

  var UGC = [
    ['photo-1469334031218-e382a71b716b', 'p3'], ['photo-1529139574466-a303027c1d8b', 'p5'], ['photo-1509631179647-0177331693ae', 'p8'],
    ['photo-1548624313-0396c75e4b1a', 'p7'], ['photo-1503342217505-b0a15ec3261c', 'p9'], ['photo-1581044777550-4cfa60707c03', 'p6']
  ];

  /* ---------------- CRO notes content ---------------- */
  var CRO = {
    announce: { t: 'Announcement bar', s: 'Removes the #1 and #2 reasons people abandon carts — shipping cost and return risk — before they even scroll.', pts: ['Free-shipping threshold ($100) nudges a higher average order value.', 'Rotating messages keep it to one line on mobile.', 'First-order offer starts email capture from the very first second.'], tag: 'Higher AOV · lower abandonment' },
    header: { t: 'Sticky header & mega menu', s: 'Navigation is always one tap away, so shoppers never have to scroll back up to keep shopping.', pts: ['Centered logo = premium fashion convention customers trust.', 'Mega menu shows categories + a visual promo, cutting clicks to product.', 'Search, wishlist and bag with live counters keep intent visible.', '"Sale" in red — the most-clicked menu item on most fashion stores.'], tag: 'Faster product discovery' },
    hero: { t: 'Hero — value + action above the fold', s: 'In under 3 seconds a visitor knows what we sell, why it is different, and where to click.', pts: ['Split layout keeps headline readable on every device (no text over busy photos).', 'Two CTAs: new visitors → New Arrivals, deal-seekers → Bestsellers.', 'Star rating + customer count next to the buttons builds instant trust.', 'Shoppable product tag on the image turns inspiration into a click.', 'Rotating "30-day free returns" seal reduces purchase anxiety.'], tag: 'Lower bounce rate' },
    usp: { t: 'Trust strip', s: 'The four promises that matter most to online clothing shoppers, placed right after the hero.', pts: ['Answers "what if it doesn\'t fit?" before it becomes an objection.', 'Payment logos/wording reassure first-time buyers.', 'Icons are scannable in under a second.'], tag: 'Builds trust early' },
    categories: { t: 'Shop by category', s: 'Visitors who already know what they want get a one-tap shortcut to it.', pts: ['Large image tiles outperform text links for fashion.', 'Style counts ("48 styles") signal a rich range worth exploring.', 'Biggest tile for the highest-margin / most-searched category.'], tag: 'More product page views' },
    products: { t: 'Customer favourites (product slider)', s: 'Products appear early because product views are the strongest predictor of a sale.', pts: ['Tabs (Bestsellers / New / Under $100) serve three buying mindsets in one block.', 'Hover shows a second image + one-click size Quick Add — no page reload.', 'Ratings, colour swatches and "Only 3 left" stock labels add social proof & urgency.', 'Quick View lets shoppers check details without leaving the homepage.', 'Wishlist heart captures intent from shoppers not ready to buy yet.'], tag: 'Higher add-to-cart rate' },
    look: { t: 'Shop the look', s: 'Sells complete outfits instead of single items — the easiest way to grow order value in fashion.', pts: ['Hotspots on the photo link straight to each product.', 'One-click "Add Full Look" with a bundle saving.', 'Editorial storytelling builds desire and brand feel.'], tag: '+ Items per order' },
    reviews: { t: 'Reviews & fit data', s: 'Social proof placed mid-page, exactly where shoppers start asking "is it worth it?".', pts: ['Overall score + rating breakdown feels honest and credible.', '"How it fits" bar tackles the biggest fashion objection: sizing.', 'Verified badges, location and size purchased make reviews believable.', 'Connects to Shopify review apps (Judge.me, Okendo, Yotpo).'], tag: 'Trust → conversion' },
    fit: { t: 'Size finder & guarantees', s: 'Sizing doubt is the #1 reason clothing shoppers hesitate. We solve it on the homepage.', pts: ['2-question size finder gives an instant recommendation.', 'Full size guide one click away (and on every product page).', 'Free exchanges, fast dispatch, instalments and gift-ready packaging remove the last objections.'], tag: 'Fewer returns, more orders' },
    story: { t: 'Brand story', s: 'Placed after products and proof — people who are still scrolling want to know who they are buying from.', pts: ['Short, values-led story builds emotional connection.', 'Animated numbers add credibility.', 'Will be written with your real story and photos.'], tag: 'Brand loyalty' },
    ugc: { t: 'Styled by you (UGC)', s: 'Real customers wearing the product are more persuasive than any studio photo.', pts: ['Every photo is shoppable.', 'Encourages customers to tag the brand = free marketing.', 'Can connect to Instagram/TikTok feed apps on Shopify.'], tag: 'Social proof' },
    faq: { t: 'FAQ', s: 'Answers last-minute questions on the spot, so nobody leaves to "check later".', pts: ['Shipping, returns, sizing, international and instalments covered.', 'Live chat link for anything else.', 'Also helps SEO with FAQ rich results.'], tag: 'Removes final objections' },
    newsletter: { t: 'Email capture', s: 'Most visitors do not buy on the first visit — this is how we bring them back.', pts: ['Clear incentive: 10% off the first order.', 'Pairs with a welcome popup (after 30s or exit intent, shown once per session).', 'Feeds Shopify Email / Klaviyo flows: welcome, abandoned cart, back-in-stock.'], tag: 'Recovers lost visitors' },
    footer: { t: 'Footer', s: 'A safety net for visitors who scroll all the way down looking for something specific.', pts: ['All key help & policy pages (shipping, returns, tracking, size guide).', 'Payment badges reinforce secure checkout.', 'Social links grow the community.'], tag: 'Navigation safety net' }
  };
  var CRO_EXTRA = [
    { t: 'Slide-out cart with free-shipping bar', s: 'Add to bag opens a drawer instead of a new page. A progress bar shows how close the shopper is to free shipping, plus "complete your look" suggestions and Shop Pay instalments.', target: '#cartOpen' },
    { t: 'Mobile sticky CTA', s: 'On phones (70%+ of fashion traffic) a slim "Shop Bestsellers" bar appears after the hero so a buying action is always within thumb reach.', target: null },
    { t: 'Smart search', s: 'Trending searches and live product results as you type — shoppers who search convert 2–3× more than those who don\'t.', target: '#searchOpen' },
    { t: 'Recent purchase notifications', s: 'Subtle, occasional "someone just bought…" popups add live social proof. Optional — can be turned off if you prefer a calmer feel.', target: null }
  ];

  /* ---------------- State ---------------- */
  var cart = [];
  var wish = {};
  var FREE_SHIP = 100;

  /* ---------------- Announcement rotation ---------------- */
  (function () {
    var msgs = $$('.announce__msg'); var i = 0;
    if (msgs.length < 2) return;
    setInterval(function () {
      var cur = msgs[i]; i = (i + 1) % msgs.length; var nxt = msgs[i];
      cur.classList.remove('is-active'); cur.classList.add('is-out');
      nxt.classList.remove('is-out'); nxt.classList.add('is-active');
      setTimeout(function () { cur.classList.remove('is-out'); }, 600);
    }, 4200);
  })();

  /* ---------------- Header scroll state + sticky CTA ---------------- */
  var header = $('#header');
  var sticky = $('#stickyCta');
  var hero = $('.hero');
  var onScroll = function () {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    var past = hero ? hero.getBoundingClientRect().bottom < 0 : y > 600;
    var nearEnd = (window.innerHeight + y) > (document.body.scrollHeight - 500);
    sticky.classList.toggle('is-show', past && !nearEnd);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Overlays (drawers / modals) ---------------- */
  var openLayer = null;
  var lastFocus = null;
  function open(el) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;
    if (openLayer && openLayer !== el) close(openLayer, true);
    lastFocus = document.activeElement;
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    openLayer = el;
    var f = el.querySelector('input:not([type=hidden]), button, a');
    if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 60);
  }
  function close(el, keepScroll) {
    el = el || openLayer; if (!el) return;
    el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true');
    if (!keepScroll) document.body.classList.remove('no-scroll');
    if (openLayer === el) openLayer = null;
    if (lastFocus && !keepScroll) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
  }
  $$('.drawer, .modal, .search').forEach(function (layer) {
    layer.addEventListener('click', function (e) {
      if (e.target === layer || e.target.closest('[data-close]')) close(layer);
    });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (openLayer) close(); else if (croOn) setCro(false); } });
  $('#menuOpen').addEventListener('click', function () { open('menu'); });
  $('#searchOpen').addEventListener('click', function () { open('search'); renderSearch(''); });
  $('#cartOpen').addEventListener('click', function () { open('cart'); });
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { open(b.getAttribute('data-open')); }); });
  // close mobile menu / search on in-page link click
  $$('#menu a, #search a').forEach(function (a) { a.addEventListener('click', function () { close(); }); });

  /* ---------------- Toast ---------------- */
  var toastEl = $('#toast'); var toastT;
  function toast(msg) {
    toastEl.innerHTML = '<svg><use href="#i-check"/></svg>' + msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-show'); }, 2600);
  }

  /* ---------------- Product cards ---------------- */
  function stars() { return '<span class="stars">' + new Array(6).join('<svg><use href="#i-star"/></svg>') + '</span>'; }
  function priceHTML(p) {
    return p.compare
      ? '<div class="price"><span class="is-sale">' + money0(p.price) + '</span><s>' + money0(p.compare) + '</s></div>'
      : '<div class="price"><span>' + money0(p.price) + '</span></div>';
  }
  function cardHTML(p) {
    var badges = '';
    if (p.badge === 'sale') badges += '<span class="badge badge--sale">-' + Math.round((1 - p.price / p.compare) * 100) + '%</span>';
    else if (p.badge === 'New') badges += '<span class="badge badge--new">New</span>';
    else if (p.badge) badges += '<span class="badge">' + p.badge + '</span>';
    var sizes = p.oneSize ? '<button data-add="' + p.id + '" data-size="One Size">Add — One Size</button>' :
      SIZES.map(function (s) { var so = p.sold && p.sold.indexOf(s) > -1; return '<button data-add="' + p.id + '" data-size="' + s + '"' + (so ? ' disabled aria-label="' + s + ' sold out"' : '') + '>' + s + '</button>'; }).join('');
    var sw = p.colors.map(function (c, i) { return '<button class="swatch' + (i === 0 ? ' is-active' : '') + '" style="background:' + c[1] + '" aria-label="' + c[0] + '" data-swatch="' + i + '"></button>'; }).join('');
    return '<article class="card" data-id="' + p.id + '">' +
      '<div class="card__media">' +
        '<div class="badges">' + badges + '</div>' +
        '<button class="wish' + (wish[p.id] ? ' is-on' : '') + '" data-wish="' + p.id + '" aria-label="Add ' + p.name + ' to wishlist" aria-pressed="' + (!!wish[p.id]) + '"><svg><use href="#i-heart"/></svg></button>' +
        '<button class="card__qv" data-qv="' + p.id + '" aria-label="Quick view ' + p.name + '"><svg><use href="#i-eye"/></svg></button>' +
        '<img src="' + U(p.img, 600, 800) + '" alt="' + p.name + '" loading="lazy">' +
        '<img class="card__img2" src="' + U(p.img2, 600, 800) + '" alt="" loading="lazy">' +
        '<div class="quick"><p>Quick add · select size</p><div class="quick__sizes">' + sizes + '</div></div>' +
      '</div>' +
      '<div class="card__body">' +
        '<div class="card__rating">' + stars() + '<span>' + p.rating + ' (' + p.reviews + ')</span></div>' +
        '<h3 class="card__title"><button data-qv="' + p.id + '">' + p.name + '</button></h3>' +
        priceHTML(p) +
        '<div class="swatches">' + sw + '<small data-colorname>' + p.colors[0][0] + '</small></div>' +
        (p.stock ? '<p class="stock">Only ' + p.stock + ' left — selling fast</p>' : '') +
        '<button class="btn btn--outline btn--sm card__add-m" data-qv="' + p.id + '">Choose size</button>' +
      '</div></article>';
  }

  var row = $('#productRow');
  function renderProducts(tab) {
    var list = PRODUCTS.filter(function (p) { return p.tags.indexOf(tab) > -1; });
    if (tab === 'under') list = PRODUCTS.filter(function (p) { return p.price < 100; });
    row.innerHTML = list.map(cardHTML).join('');
    row.scrollLeft = 0;
    updateSliderBtns();
    if (window.gsap) gsap.from(row.children, { opacity: 0, y: 24, duration: .6, stagger: .06, ease: 'power2.out', clearProps: 'all' });
  }
  $$('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      $$('.tab').forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
      t.classList.add('is-active'); t.setAttribute('aria-selected', 'true');
      renderProducts(t.getAttribute('data-tab'));
    });
  });
  var prevB = $('.slider__btn--prev'), nextB = $('.slider__btn--next');
  function updateSliderBtns() {
    prevB.disabled = row.scrollLeft < 8;
    nextB.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 8;
  }
  row.addEventListener('scroll', updateSliderBtns, { passive: true });
  window.addEventListener('resize', updateSliderBtns);
  prevB.addEventListener('click', function () { row.scrollBy({ left: -row.clientWidth * .9, behavior: 'smooth' }); });
  nextB.addEventListener('click', function () { row.scrollBy({ left: row.clientWidth * .9, behavior: 'smooth' }); });

  // Delegated product interactions (cards, quick view, look, upsell, search, ugc)
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-add]'))) { addToCart(t.getAttribute('data-add'), t.getAttribute('data-size'), null, true); return; }
    if ((t = e.target.closest('[data-wish]'))) { toggleWish(t.getAttribute('data-wish')); return; }
    if ((t = e.target.closest('[data-qv]'))) { e.preventDefault(); quickView(t.getAttribute('data-qv')); return; }
    if ((t = e.target.closest('[data-swatch]')) && t.closest('.card')) {
      var card = t.closest('.card');
      $$('.swatch', card).forEach(function (s) { s.classList.remove('is-active'); });
      t.classList.add('is-active');
      $('[data-colorname]', card).textContent = t.getAttribute('aria-label');
    }
  });

  /* ---------------- Wishlist ---------------- */
  function toggleWish(id) {
    wish[id] = !wish[id];
    $$('[data-wish="' + id + '"]').forEach(function (b) { b.classList.toggle('is-on', wish[id]); b.setAttribute('aria-pressed', wish[id]); });
    var n = Object.keys(wish).filter(function (k) { return wish[k]; }).length;
    var c = $('#wishCount'); c.hidden = !n; c.textContent = n; bump(c);
    toast(wish[id] ? 'Saved to your wishlist' : 'Removed from wishlist');
  }
  $('#wishBtn').addEventListener('click', function () {
    var n = Object.keys(wish).filter(function (k) { return wish[k]; }).length;
    toast(n ? n + ' item' + (n > 1 ? 's' : '') + ' saved — sign in to keep them' : 'Tap ♡ on any product to save it');
  });
  function bump(el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }

  /* ---------------- Cart ---------------- */
  function addToCart(id, size, color, openDrawer) {
    var p = byId(id); if (!p) return;
    color = color || p.colors[0][0];
    var key = id + '|' + size + '|' + color;
    var line = cart.filter(function (l) { return l.key === key; })[0];
    if (line) line.qty++; else cart.push({ key: key, id: id, size: size, color: color, qty: 1 });
    renderCart();
    bump($('#cartCount'));
    if (openDrawer) open('cart');
  }
  function renderCart() {
    var count = cart.reduce(function (a, l) { return a + l.qty; }, 0);
    var sub = cart.reduce(function (a, l) { return a + byId(l.id).price * l.qty; }, 0);
    var c = $('#cartCount'); c.hidden = !count; c.textContent = count;
    $('#cartHeadCount').textContent = '(' + count + ')';
    $('#cartSubtotal').textContent = money(sub);
    $('#cartInstal').textContent = money(sub / 4);
    var left = Math.max(0, FREE_SHIP - sub);
    var ship = $('.ship');
    ship.classList.toggle('is-free', left === 0 && sub > 0);
    $('#shipMsg').innerHTML = sub === 0 ? 'Free shipping on orders over <strong>$100</strong>' :
      left === 0 ? '🎉 You\'ve unlocked <strong>free shipping!</strong>' : 'You\'re <strong>' + money(left) + '</strong> away from free shipping';
    $('#shipBar').style.width = Math.min(100, sub / FREE_SHIP * 100) + '%';
    var items = $('#cartItems');
    if (!cart.length) {
      items.innerHTML = '<div class="cart__empty"><p>Your bag is empty.</p><a href="#bestsellers" class="btn btn--primary" data-close>Shop Bestsellers</a></div>';
    } else {
      items.innerHTML = cart.map(function (l, i) {
        var p = byId(l.id);
        return '<div class="line"><img src="' + U(p.img, 160, 200) + '" alt="">' +
          '<div><h4>' + p.name + '</h4><p>' + l.color + ' · ' + l.size + '</p>' +
          '<div class="qty"><button data-q="' + i + '" data-d="-1" aria-label="Decrease quantity"><svg><use href="#i-minus"/></svg></button><span>' + l.qty + '</span><button data-q="' + i + '" data-d="1" aria-label="Increase quantity"><svg><use href="#i-plus"/></svg></button></div></div>' +
          '<div class="line__right"><span>' + money(p.price * l.qty) + '</span><button class="line__remove" data-rm="' + i + '">Remove</button></div></div>';
      }).join('');
    }
    // upsell: two items not in cart, prefer low price
    var inCart = cart.map(function (l) { return l.id; });
    var ups = PRODUCTS.filter(function (p) { return inCart.indexOf(p.id) < 0 && p.price < 100; }).slice(0, 2);
    $('#cartUpsell').innerHTML = cart.length && ups.length ? '<h5>Complete your look</h5>' + ups.map(function (p) {
      return '<div class="upsell"><img src="' + U(p.img, 120, 150) + '" alt=""><div><h6>' + p.name + '</h6><p>' + money0(p.price) + '</p></div><button class="btn btn--outline" data-add="' + p.id + '" data-size="' + (p.oneSize ? 'One Size' : 'M') + '">+ Add</button></div>';
    }).join('') : '';
  }
  $('#cartItems').addEventListener('click', function (e) {
    var q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    if (q) { var l = cart[+q.getAttribute('data-q')]; l.qty += +q.getAttribute('data-d'); if (l.qty < 1) cart.splice(cart.indexOf(l), 1); renderCart(); }
    if (rm) { cart.splice(+rm.getAttribute('data-rm'), 1); renderCart(); }
  });
  $('#checkoutBtn').addEventListener('click', function () {
    toast(cart.length ? 'Concept preview — this goes to Shopify checkout' : 'Add something to your bag first');
  });

  /* ---------------- Quick view ---------------- */
  function quickView(id) {
    var p = byId(id); if (!p) return;
    var sizes = p.oneSize ? '<button class="is-active" data-s="One Size">One Size</button>' :
      SIZES.map(function (s) { var so = p.sold && p.sold.indexOf(s) > -1; return '<button data-s="' + s + '"' + (so ? ' disabled' : '') + '>' + s + '</button>'; }).join('');
    $('#qvBody').innerHTML =
      '<div class="qv__media"><img id="qvImg" src="' + U(p.img, 900, 1125) + '" alt="' + p.name + '">' +
        '<div class="qv__thumbs"><button class="is-active" data-img="' + p.img + '"><img src="' + U(p.img, 120, 150) + '" alt="View 1"></button><button data-img="' + p.img2 + '"><img src="' + U(p.img2, 120, 150) + '" alt="View 2"></button></div></div>' +
      '<div class="qv__info">' +
        '<div class="card__rating">' + stars() + '<span>' + p.rating + ' · ' + p.reviews + ' reviews</span></div>' +
        '<h3>' + p.name + '</h3>' + priceHTML(p) +
        '<p class="qv__instal">or 4 interest-free payments of ' + money(p.price / 4) + ' with Shop Pay</p>' +
        '<div class="qv__label"><span>Colour: <b id="qvColor">' + p.colors[0][0] + '</b></span></div>' +
        '<div class="qv__swatches">' + p.colors.map(function (c, i) { return '<button class="swatch' + (i === 0 ? ' is-active' : '') + '" style="background:' + c[1] + '" aria-label="' + c[0] + '" data-c="' + c[0] + '"></button>'; }).join('') + '</div>' +
        '<div class="qv__label"><span>Size</span>' + (p.oneSize ? '' : '<button data-open-size>Size guide</button>') + '</div>' +
        '<div class="qv__sizes">' + sizes + '</div>' +
        '<p class="qv__err" id="qvErr" aria-live="polite"></p>' +
        (p.stock ? '<p class="stock">Only ' + p.stock + ' left in stock</p>' : '') +
        '<button class="btn btn--primary btn--block" id="qvAdd">Add to Bag — ' + money0(p.price) + '</button>' +
        '<ul class="qv__perks"><li><svg><use href="#i-check"/></svg>Free shipping over $100</li><li><svg><use href="#i-check"/></svg>Free 30-day returns &amp; exchanges</li><li><svg><use href="#i-check"/></svg>Ships within 24 hours</li></ul>' +
      '</div>';
    var body = $('#qvBody'); var size = p.oneSize ? 'One Size' : null; var color = p.colors[0][0];
    body.onclick = function (e) {
      var b;
      if ((b = e.target.closest('[data-s]')) && !b.disabled) { $$('[data-s]', body).forEach(function (x) { x.classList.remove('is-active'); }); b.classList.add('is-active'); size = b.getAttribute('data-s'); $('#qvErr').textContent = ''; }
      if ((b = e.target.closest('[data-c]'))) { $$('[data-c]', body).forEach(function (x) { x.classList.remove('is-active'); }); b.classList.add('is-active'); color = b.getAttribute('data-c'); $('#qvColor').textContent = color; }
      if ((b = e.target.closest('[data-img]'))) { $$('[data-img]', body).forEach(function (x) { x.classList.remove('is-active'); }); b.classList.add('is-active'); $('#qvImg').src = U(b.getAttribute('data-img'), 900, 1125); }
      if (e.target.closest('[data-open-size]')) open('sizeModal');
      if (e.target.closest('#qvAdd')) {
        if (!size) { $('#qvErr').textContent = 'Please select a size'; return; }
        addToCart(p.id, size, color, true);
      }
    };
    open('qv');
  }

  /* ---------------- Shop the look ---------------- */
  var LOOK = ['p2', 'p8', 'p11'];
  var lookList = $('#lookList');
  lookList.innerHTML = LOOK.map(function (id) {
    var p = byId(id);
    return '<li class="look__item" data-look="' + id + '"><img src="' + U(p.img, 130, 160) + '" alt="' + p.name + '" loading="lazy"><div><h4>' + p.name + '</h4><p>' + money0(p.price) + '</p></div><button class="icon-btn" data-qv="' + id + '" aria-label="Quick view ' + p.name + '"><svg><use href="#i-plus"/></svg></button></li>';
  }).join('');
  var lookSum = LOOK.reduce(function (a, id) { return a + byId(id).price; }, 0);
  $('#lookTotal').textContent = money0(lookSum * .9);
  $('#lookWas').textContent = money0(lookSum);
  $$('.hotspot').forEach(function (h) {
    var id = h.getAttribute('data-product');
    var act = function () {
      $$('.hotspot').forEach(function (x) { x.classList.toggle('is-active', x === h); });
      $$('.look__item').forEach(function (li) { li.classList.toggle('is-active', li.getAttribute('data-look') === id); });
    };
    h.addEventListener('mouseenter', act);
    h.addEventListener('focus', act);
    h.addEventListener('click', function () { act(); quickView(id); });
  });
  $('#addLook').addEventListener('click', function () {
    LOOK.forEach(function (id) { addToCart(id, byId(id).oneSize ? 'One Size' : 'M', null, false); });
    open('cart');
    toast('Full look added — 10% bundle saving applied at checkout');
  });

  /* ---------------- Reviews ---------------- */
  $('#reviewRow').innerHTML = REVIEWS.map(function (r) {
    var p = byId(r.p);
    return '<article class="review reveal"><div class="review__top">' + stars() + '<span class="review__verified"><svg><use href="#i-check"/></svg>Verified buyer</span></div>' +
      '<h3>“' + r.t + '”</h3><p>' + r.b + '</p>' +
      '<div class="review__meta"><img src="' + U(p.img, 100, 125) + '" alt="" loading="lazy"><div><strong>' + r.n + '</strong> · ' + r.loc + '<span>Bought: ' + p.name + ' · Size ' + r.size + ' · ' + r.fit + '</span></div></div></article>';
  }).join('');

  /* ---------------- UGC ---------------- */
  $('#ugcGrid').innerHTML = UGC.map(function (u) {
    var p = byId(u[1]);
    return '<a class="ugc__item" href="#" data-qv="' + u[1] + '" aria-label="Shop this look: ' + p.name + '"><img src="' + U(u[0], 500, 500) + '" alt="Customer styling ' + p.name + '" loading="lazy"><span><em><svg><use href="#i-bag"/></svg>Shop the look</em></span></a>';
  }).join('');

  /* ---------------- Size finder ---------------- */
  $('#finder').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target; var ui = f.usual.selectedIndex - 1; var pref = +f.pref.value;
    if (ui < 0 || f.pref.value === '') return;
    var idx = Math.min(SIZES.length - 1, ui + (pref === 2 ? 1 : 0));
    var note = pref === 0 ? 'Our cuts are true to size — stick with your usual for a fitted look.' :
      pref === 1 ? 'Our pieces have a naturally relaxed cut, so your usual size is perfect.' :
      'Size up one for that effortless oversized silhouette.';
    $('#finderResult').innerHTML = 'We recommend <strong>size ' + SIZES[idx] + '</strong>. ' + note;
    $$('.size-table tbody tr').forEach(function (tr, i) { tr.classList.toggle('is-hl', i === idx); });
  });

  /* ---------------- Search ---------------- */
  var sInput = $('#searchInput');
  function renderSearch(q) {
    q = (q || '').trim().toLowerCase();
    var list = q ? PRODUCTS.filter(function (p) {
      if (q.indexOf('under') > -1) return p.price < 100;
      return (p.name + ' ' + p.cat).toLowerCase().indexOf(q) > -1 || q.split(' ').some(function (w) { return w.length > 2 && (p.name + ' ' + p.cat).toLowerCase().indexOf(w) > -1; });
    }) : PRODUCTS.filter(function (p) { return p.tags.indexOf('best') > -1; });
    $('#searchLabel').textContent = q ? list.length + ' result' + (list.length === 1 ? '' : 's') + ' for “' + q + '”' : 'Popular right now';
    $('#searchResults').innerHTML = list.length ? list.slice(0, 8).map(function (p) {
      return '<button class="sres" data-qv="' + p.id + '"><img src="' + U(p.img, 300, 400) + '" alt="" loading="lazy"><h5>' + p.name + '</h5><p>' + money0(p.price) + '</p></button>';
    }).join('') : '<p class="search__empty">No matches — try “coat”, “dress” or “knit”.</p>';
  }
  sInput.addEventListener('input', function () { renderSearch(sInput.value); });
  $('#searchForm').addEventListener('submit', function (e) { e.preventDefault(); });
  $('#chips').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { sInput.value = b.textContent; renderSearch(b.textContent); } });

  /* ---------------- Subscribe forms ---------------- */
  $$('[data-subscribe]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = f.querySelector('.subscribe__msg');
      msg.innerHTML = 'Welcome to ÉLARA! Your code <strong>WELCOME10</strong> is on its way.';
      f.querySelector('button').classList.add('is-done');
      f.querySelector('button').textContent = 'You\'re in ✓';
      store.set('elara_sub', '1');
      if (f.closest('#offer')) setTimeout(function () { close(); }, 1800);
    });
  });

  /* ---------------- Welcome popup (timed or exit intent, once per session) ---------------- */
  var offerShown = store.get('elara_offer') === '1';
  function showOffer() {
    if (offerShown || openLayer || croOn || store.get('elara_sub') === '1') return;
    offerShown = true; store.set('elara_offer', '1');
    open('offer');
  }
  setTimeout(showOffer, 30000);
  document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY < 8) showOffer(); });

  /* ---------------- Recent purchase social proof ---------------- */
  (function () {
    var el = $('#proof'); var n = 0;
    var data = [['Priya', 'New York', 'p1', '4 minutes'], ['Jordan', 'Austin', 'p9', '9 minutes'], ['Emily', 'Seattle', 'p3', '12 minutes']];
    function show() {
      if (n >= data.length) return;
      if (openLayer || croOn) { setTimeout(show, 15000); return; }
      var d = data[n++]; var p = byId(d[2]);
      el.innerHTML = '<img src="' + U(p.img, 100, 120) + '" alt=""><div><strong>' + d[0] + ' in ' + d[1] + '</strong> purchased<br>' + p.name + '<small>' + d[3] + ' ago · Verified</small></div>';
      el.classList.add('is-show');
      setTimeout(function () { el.classList.remove('is-show'); }, 5500);
      setTimeout(show, 40000);
    }
    setTimeout(show, 15000);
  })();

  /* ---------------- CRO notes layer ---------------- */
  var croOn = false;
  var keys = Object.keys(CRO);
  var croToggle = $('#croToggle'), croPanel = $('#croPanel');
  keys.forEach(function (k, i) {
    var sec = document.querySelector('[data-cro="' + k + '"]'); if (!sec) return;
    if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
    var pin = document.createElement('button');
    pin.className = 'cro-pin'; pin.type = 'button';
    pin.innerHTML = '<b>' + (i + 1) + '</b><span>' + CRO[k].t + '</span>';
    var pop = document.createElement('div');
    pop.className = 'cro-pop';
    pop.innerHTML = '<h5>' + (i + 1) + '. ' + CRO[k].t + '</h5><p>' + CRO[k].s + '</p><ul>' + CRO[k].pts.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><span class="tag">Goal: ' + CRO[k].tag + '</span>';
    pin.addEventListener('click', function (e) {
      e.stopPropagation();
      var was = pop.classList.contains('is-open');
      $$('.cro-pop').forEach(function (x) { x.classList.remove('is-open'); });
      if (!was) pop.classList.add('is-open');
    });
    if (k === 'announce') { pin.style.top = '4px'; }
    if (k === 'header') { pin.style.top = 'auto'; pin.style.bottom = '-16px'; pin.style.right = 'auto'; pin.style.left = '16px'; pop.style.top = 'calc(100% + 24px)'; pop.style.right = 'auto'; pop.style.left = '16px'; }
    sec.appendChild(pin); sec.appendChild(pop);
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.cro-pop')) $$('.cro-pop').forEach(function (x) { x.classList.remove('is-open'); }); });

  $('#croList').innerHTML = keys.map(function (k, i) {
    return '<li><button data-goto="' + k + '"><b>' + (i + 1) + '</b><div><strong>' + CRO[k].t + '</strong><span>' + CRO[k].s + '</span></div></button></li>';
  }).join('') + CRO_EXTRA.map(function (x) {
    return '<li><button data-extra="' + (x.target || '') + '"><b>★</b><div><strong>' + x.t + '</strong><span>' + x.s + '</span></div></button></li>';
  }).join('');
  $('#croList').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var k = b.getAttribute('data-goto');
    if (k) {
      var sec = document.querySelector('[data-cro="' + k + '"]');
      var y = sec.getBoundingClientRect().top + window.scrollY - (k === 'announce' ? 0 : 80);
      window.scrollTo({ top: y, behavior: 'smooth' });
      $$('.cro-pop').forEach(function (x) { x.classList.remove('is-open'); });
      setTimeout(function () { var pop = sec.querySelector(':scope > .cro-pop'); if (pop) pop.classList.add('is-open'); }, 500);
      if (window.innerWidth < 1280) setPanel(false);
    } else if (b.getAttribute('data-extra') === '#cartOpen') {
      if (!cart.length) { addToCart('p3', 'S', null, false); addToCart('p9', 'M', null, false); }
      if (window.innerWidth < 1280) setPanel(false);
      open('cart');
    } else if (b.getAttribute('data-extra') === '#searchOpen') {
      if (window.innerWidth < 1280) setPanel(false);
      open('search'); renderSearch('');
    }
  });
  function setPanel(on) {
    croPanel.classList.toggle('is-open', on);
    croPanel.setAttribute('aria-hidden', String(!on));
    document.body.classList.toggle('cro-panel-open', on);
  }
  function setCro(on) {
    croOn = on;
    document.body.classList.toggle('cro-on', on);
    croToggle.setAttribute('aria-pressed', String(on));
    croToggle.querySelector('span').textContent = on ? 'Hide design notes' : 'Show design notes';
    setPanel(on);
    if (!on) $$('.cro-pop').forEach(function (x) { x.classList.remove('is-open'); });
    if (window.ScrollTrigger) setTimeout(function () { ScrollTrigger.refresh(); }, 500);
  }
  croToggle.addEventListener('click', function () { setCro(!croOn); });
  $('#croClose').addEventListener('click', function () { setPanel(false); });
  if (/[?&]notes=1/.test(location.search)) setCro(true);

  /* ---------------- Init render ---------------- */
  renderProducts('best');
  renderCart();

  /* ---------------- Motion (GSAP) ---------------- */
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function counters() {
    $$('[data-count]').forEach(function (el) {
      var end = +el.getAttribute('data-count');
      var fmt = function (v) { return end >= 1000 ? Math.round(v / 1000) + 'K+' : Math.round(v) + (end === 100 ? '%' : ''); };
      if (!window.gsap || reduce) { el.textContent = fmt(end); return; }
      var o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: function () { el.textContent = fmt(o.v); } });
    });
  }
  if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero__reveal', { opacity: 1, y: 0, duration: .9, stagger: .1, ease: 'power3.out', startAt: { y: 28 } });
    gsap.from('.hero__img--main', { clipPath: 'inset(12% 8% 12% 8% round 14px)', scale: 1.04, duration: 1.4, ease: 'power3.out' });
    gsap.from('.hero__img--sub, .hero__badge', { opacity: 0, y: 40, duration: 1, delay: .4, stagger: .15, ease: 'power3.out' });
    gsap.to('.hero__img--main img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.story__media img', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%', once: true,
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, startAt: { y: 36 }, duration: .9, stagger: .08, ease: 'power3.out' }); }
    });
    $$('.section__title').forEach(function (t) {
      gsap.from(t, { opacity: 0, y: 24, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: t, start: 'top 90%', once: true } });
    });
    counters();
  } else {
    root.classList.remove('js-anim');
    counters();
  }
})();
