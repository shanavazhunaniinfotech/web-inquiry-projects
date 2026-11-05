/* =========================================================
   ÉLARA — Luxury homepage concept · interactions & motion
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- Helpers ---------------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var U = function (id, w, h) { return 'https://images.unsplash.com/photo-' + id + '?w=' + w + (h ? '&h=' + h : '') + '&q=72&auto=format&fit=crop'; };
  var money = function (n) { return '$' + n.toFixed(2); };
  var money0 = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var store = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduce;
  var isDesktop = function () { return window.innerWidth >= 900; };

  /* ---------------- Data (placeholder) ---------------- */
  var SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  var PRODUCTS = [
    { id: 'p1', name: 'Ruffle Poplin Blouse', cat: 'Tops & Blouses', price: 128, rating: 4.9, reviews: 342, img: '1609505848912-b7c3b8b4beda', img2: '1611042553484-d61f84d22784', colors: [['Ivory', '#F1ECE2'], ['Noir', '#141210']], badge: 'Bestseller', tags: ['best', 'under'] },
    { id: 'p2', name: 'Sculpted Double-Breasted Blazer', cat: 'Tailoring', price: 245, rating: 4.9, reviews: 218, img: '1584273143981-41c073dfe8f8', img2: '1597586124394-fbd6ef244026', colors: [['Midnight', '#1C1F2A'], ['Camel', '#B88E5E']], badge: 'Bestseller', sold: ['XS'], tags: ['best'] },
    { id: 'p3', name: 'Ivory Blazer Dress', cat: 'Tailoring', price: 265, rating: 4.8, reviews: 96, img: '1632149877166-f75d49000351', img2: '1571513722275-4b41940f54b8', colors: [['Ivory', '#F1ECE2'], ['Noir', '#141210']], badge: 'New', tags: ['new'] },
    { id: 'p4', name: 'Camel Wool Wrap Coat', cat: 'Outerwear', price: 320, compare: 395, rating: 4.9, reviews: 187, img: '1619086303291-0ef7699e4b31', img2: '1485462537746-965f33f7f6a7', colors: [['Camel', '#B88E5E'], ['Blush', '#D8B4A6']], badge: 'sale', stock: 3, tags: ['best'] },
    { id: 'p5', name: 'Satin Bishop-Sleeve Blouse', cat: 'Tops & Blouses', price: 145, rating: 4.8, reviews: 154, img: '1611042553484-d61f84d22784', img2: '1609505848912-b7c3b8b4beda', colors: [['Champagne', '#E7D9C1'], ['Noir', '#141210'], ['Bordeaux', '#5B1F2A']], badge: 'New', tags: ['new', 'under'] },
    { id: 'p6', name: 'Lace Cut-Out Maxi Dress', cat: 'Dresses', price: 295, rating: 4.8, reviews: 73, img: '1551803091-e20673f15770', img2: '1550614000-4895a10e1bfd', colors: [['Navy', '#22264A'], ['Noir', '#141210']], badge: 'New', stock: 4, tags: ['new', 'best'] },
    { id: 'p7', name: 'Velvet Off-Shoulder Gown', cat: 'Evening', price: 345, rating: 4.9, reviews: 61, img: '1566174053879-31528523f8ae', img2: '1612336307429-8a898d10e223', colors: [['Plum', '#4E1A35'], ['Emerald', '#1D4436']], badge: 'Limited', tags: ['new'] },
    { id: 'p8', name: 'Draped Jersey Mini Dress', cat: 'Evening', price: 210, compare: 260, rating: 4.7, reviews: 88, img: '1612336307429-8a898d10e223', img2: '1566174053879-31528523f8ae', colors: [['Scarlet', '#A3202A'], ['Noir', '#141210']], badge: 'sale', stock: 2, tags: ['best'] },
    { id: 'p9', name: 'Fine Rib Merino Turtleneck', cat: 'Knitwear', price: 98, rating: 4.9, reviews: 521, img: '1550639525-c97d455acf70', img2: '1558769132-cb1aea458c5e', colors: [['Noir', '#141210'], ['Oat', '#D9CDB9'], ['Cocoa', '#5E4336']], badge: 'Bestseller', tags: ['best', 'under'] },
    { id: 'p10', name: 'Oversized Wool-Blend Coat', cat: 'Outerwear', price: 289, rating: 4.8, reviews: 233, img: '1539109136881-3be0616acf4b', img2: '1485968579580-b6d095142e6e', colors: [['Sky', '#A9BFD4'], ['Camel', '#B88E5E']], tags: ['new'] },
    { id: 'p11', name: 'Prince of Wales Check Blazer', cat: 'Tailoring', price: 225, rating: 4.8, reviews: 112, img: '1597586124394-fbd6ef244026', img2: '1584273143981-41c073dfe8f8', colors: [['Grey Check', '#8A8580']], badge: 'New', tags: ['new'] },
    { id: 'p12', name: 'Pleated Satin Midi Skirt', cat: 'Skirts', price: 138, rating: 4.7, reviews: 97, img: '1577900232427-18219b9166a0', img2: '1550639525-c97d455acf70', colors: [['Lilac', '#C9BCD3'], ['Champagne', '#E7D9C1']], tags: ['under'] },
    { id: 'p13', name: 'Silk-Touch Wide-Leg Trouser', cat: 'Trousers', price: 148, rating: 4.8, reviews: 140, img: '1594633312681-425c7b97ccd1', img2: '1584273143981-41c073dfe8f8', colors: [['Blush', '#D8B4A6'], ['Noir', '#141210']], tags: ['under'] },
    // look-only items (detail crops of the campaign shot)
    { id: 'p14', name: 'Ribbed Bandeau Top', cat: 'Tops', price: 78, rating: 4.7, reviews: 64, img: '1619086303291-0ef7699e4b31', pos: '55% 20%', img2: '1619086303291-0ef7699e4b31', colors: [['Ecru', '#EDE4D3']], tags: [] },
    { id: 'p15', name: 'High-Rise Sculpt Jean', cat: 'Denim', price: 135, rating: 4.8, reviews: 203, img: '1619086303291-0ef7699e4b31', pos: '55% 85%', img2: '1619086303291-0ef7699e4b31', colors: [['White', '#F4F2EE']], tags: [] },
    { id: 'p16', name: 'Mini Leather Shoulder Bag', cat: 'Accessories', price: 165, rating: 4.9, reviews: 77, img: '1619086303291-0ef7699e4b31', pos: '60% 45%', img2: '1619086303291-0ef7699e4b31', colors: [['Bone', '#EAE3D6']], tags: [], oneSize: true }
  ];
  var byId = function (id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; };

  var REVIEWS = [
    { q: 'The quality is extraordinary — it feels like a piece I\'ll keep forever. I\'ve been stopped three times this week to be asked where my blazer is from.', n: 'Priya S.', loc: 'New York, NY', p: 'p2', meta: 'Size S · True to size' },
    { q: 'Finally a brand that understands tailoring for women. The fit was perfect straight out of the box, and the packaging felt like opening a gift.', n: 'Amelia R.', loc: 'Chicago, IL', p: 'p3', meta: 'Size M · True to size' },
    { q: 'I wore the velvet gown to a gala and felt like the most elegant woman in the room. Worth every single cent.', n: 'Sofia L.', loc: 'Los Angeles, CA', p: 'p7', meta: 'Size XS · True to size' },
    { q: 'The exchange process was effortless — new size arrived in two days. Exceptional client care, exceptional clothes.', n: 'Natalie D.', loc: 'Miami, FL', p: 'p4', meta: 'Size M · Slightly relaxed' }
  ];

  var UGC = [
    ['1469334031218-e382a71b716b', 'p9', '@claudia.m'], ['1529139574466-a303027c1d8b', 'p10', '@thestylenote'], ['1611042553484-d61f84d22784', 'p5', '@ava.wears'],
    ['1571513722275-4b41940f54b8', 'p3', '@nina.styles'], ['1597586124394-fbd6ef244026', 'p11', '@julesinthecity'], ['1551803091-e20673f15770', 'p6', '@mariaelena'],
    ['1485462537746-965f33f7f6a7', 'p4', '@soph.daily'], ['1566174053879-31528523f8ae', 'p7', '@leila.k']
  ];

  /* ---------------- CRO notes ---------------- */
  var CRO = {
    announce: { t: 'Announcement bar', s: 'Answers the two biggest reasons people abandon a cart (shipping cost and return risk) before they even start browsing.', pts: ['A $150 free-shipping threshold encourages bigger baskets (higher average order value).', 'The first-order offer starts building the email list from the very first second.', 'Gift wrapping and the currency shown up top signal a premium, trusted store.'], tag: 'Higher AOV · lower abandonment' },
    header: { t: 'Transparent → solid sticky header', s: 'Lets the hero photography take the whole screen, then turns into a solid bar so navigation is always one tap away.', pts: ['It hides while you scroll down and comes back the moment you scroll up, so shoppers get more screen without losing the menu.', 'The large dropdown menu shows campaign images, so shoppers reach products in fewer clicks.', 'Search, wishlist and bag show live counters. Sale is highlighted, since it is the most-clicked link on fashion stores.'], tag: 'Faster discovery' },
    hero: { t: 'Cinematic hero slideshow', s: 'Creates instant desire, then gives a clear action. Each slide is a different reason to shop.', pts: ['Three stories in one space (New Season, Silks, Tailoring), each with its own buttons.', 'A gold primary button stands out strongly against the dark photography.', 'A "Shop this look" product card turns inspiration into a quick add.', 'The 4.9★ rating sits in the bottom bar for instant trust.', 'A pause button and slide progress lines give shoppers control, which is better for accessibility and avoids frustration.'], tag: 'Lower bounce · more clicks' },
    marquee: { t: 'Scrolling promise banner', s: 'A moving line naturally draws the eye, so every key promise gets seen without taking up layout space.', pts: ['Shipping, returns, rating, payment options and craftsmanship in one strip.', 'Gold band separates the hero from the shopping sections.'], tag: 'Builds trust early' },
    categories: { t: 'Expanding category panels', s: 'A premium, interactive way to show the full range, so shoppers who know what they want get there in one tap.', pts: ['Panels expand on hover, giving each category its moment.', 'Style counts and starting prices set expectations and make the range feel full.', 'On mobile they become a swipeable card row.'], tag: 'More product views' },
    products: { t: 'Bestseller slider with quick add', s: 'Products appear in the first few scrolls, because product views are the strongest predictor of a sale.', pts: ['Tabs (Bestsellers / New / Under $150) suit three buying mindsets.', 'Hovering shows a second image and one-click size buttons, so shoppers can add to bag without leaving the homepage.', 'Ratings, colour swatches, sale prices and "Only 3 left" labels add proof and urgency.', 'Quick View and wishlist capture shoppers at every level of intent.'], tag: 'Higher add-to-cart rate' },
    manifesto: { t: 'Brand philosophy', s: 'Luxury customers buy into a point of view. The words light up as you scroll, so people actually read the brand promise.', pts: ['Small image capsules inside the text keep it visual.', 'Count-up numbers (25K customers, 98% recommend) back up the claims.'], tag: 'Brand value → price acceptance' },
    campaign: { t: 'Campaign reveal: The Evening Edit', s: 'An editorial moment that grows to fill the screen as you scroll, the way high-end fashion houses present collections.', pts: ['Gives a single focused offer with one clear button.', 'Honest limited-release messaging (pieces remaining) creates real urgency.'], tag: 'Desire + urgency' },
    lookbook: { t: 'Pinned sideways-scrolling lookbook', s: 'A signature "wow" interaction: scrolling down moves the looks sideways, like flipping through a magazine.', pts: ['Each look shows product names and prices, and tapping opens quick view.', 'Keeps shoppers engaged longer (more time on site = higher conversion).', 'On mobile it becomes a native swipe gallery.'], tag: 'Engagement' },
    look: { t: 'Shop the complete look', s: 'Sells outfits rather than single items, the most effective way to raise order value in fashion.', pts: ['Hotspots on the image preview each product.', 'Tick or untick pieces and pick sizes right in the list.', 'An automatic 15% bundle saving shows the price drop clearly.'], tag: '+ Items per order' },
    reviews: { t: 'Client reviews & fit data', s: 'Social proof placed where shoppers start asking "is it worth the price?".', pts: ['Rating breakdown and a "how it fits" bar tackle the #1 fashion objection: sizing.', 'Large editorial quotes with the purchased product and size feel authentic.', 'Proof numbers (92% true to size, 98% recommend, 24h dispatch).', 'Connects to Shopify review apps (Judge.me, Okendo, Yotpo).'], tag: 'Trust → conversion' },
    promise: { t: 'The ÉLARA Promise', s: 'Removes the final hesitations before purchase: shipping, returns, fit and payment security.', pts: ['The Fit Guarantee is highlighted with a 10-second Fit Finder.', 'Shop Pay instalments reduce price resistance on higher-ticket items.'], tag: 'Removes objections' },
    story: { t: 'Our story', s: 'Placed after products and proof, for the visitors who want to know who they are buying from before they commit.', pts: ['A founder quote adds a human, trustworthy voice.', 'Layered images with a rotating seal feel crafted and premium.', 'Will be written with the real brand story.'], tag: 'Brand loyalty' },
    ugc: { t: 'As worn by you', s: 'Real customers styling the pieces is more persuasive than any studio shot.', pts: ['A gently scrolling gallery where every photo is shoppable.', 'Encourages tagging, which works as free marketing. Can sync with Instagram/TikTok apps.'], tag: 'Social proof' },
    faq: { t: 'Client care FAQ', s: 'Answers last-minute questions on the spot, so nobody leaves to "check later".', pts: ['Shipping, returns, sizing, international and instalments.', 'A "Chat with a stylist" link for anything else. Also helps SEO.'], tag: 'Removes final doubts' },
    newsletter: { t: 'Inner Circle email capture', s: 'Most visitors do not buy on their first visit. This is how we bring them back.', pts: ['Clear incentive: 10% off the first order.', 'Paired with a welcome popup that appears once per visit (after 35s, or when someone moves to leave the page).', 'Feeds Klaviyo / Shopify Email flows: welcome, abandoned cart, back-in-stock.'], tag: 'Recovers lost visitors' },
    footer: { t: 'Footer', s: 'A safety net for shoppers scrolling to find something specific, finished with a bold brand wordmark.', pts: ['All help and policy pages are easy to find.', 'Payment badges reinforce secure checkout.'], tag: 'Navigation safety net' }
  };
  var CRO_EXTRA = [
    { t: 'Slide-out bag with free-shipping bar', s: 'Adding to bag opens a drawer instead of a new page. A progress bar shows how close the shopper is to free shipping, alongside "complete the look" suggestions and Shop Pay instalments.', act: 'cart' },
    { t: 'Smart search', s: 'Trending searches and live product results as you type. Shoppers who search convert 2–3× more than those who don\'t.', act: 'search' },
    { t: 'Mobile sticky CTA', s: 'On phones (70%+ of fashion traffic) a slim "Shop Bestsellers" bar appears after the hero, so there is always a buy button within thumb reach.', act: null },
    { t: 'Recent purchase notifications', s: 'Occasional "someone just bought…" popups add live social proof. Optional, and can be switched off for a calmer feel.', act: null }
  ];

  /* ---------------- State ---------------- */
  var cart = [];
  var wish = {};
  var FREE_SHIP = 150;
  var lenis = null;
  var croOn = false;

  /* ---------------- Smooth scroll (Lenis) ---------------- */
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var rafLoop = function (t) { lenis.raf(t); requestAnimationFrame(rafLoop); };
      requestAnimationFrame(rafLoop);
    }
  }
  function scrollToEl(target) {
    var offset = target.id === 'main' ? 0 : -70;
    if (lenis) lenis.scrollTo(target.id === 'main' ? 0 : target, { offset: offset, duration: 1.4 });
    else window.scrollTo({ top: target.id === 'main' ? 0 : target.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-qv')) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    if (openLayer) close();
    if (a.hasAttribute('data-tab-link')) setTab(a.getAttribute('data-tab-link'));
    setTimeout(function () { scrollToEl(t); }, openLayer ? 0 : 10);
  });

  /* ---------------- Announcement ---------------- */
  (function () {
    var msgs = $$('.announce__msg'); var i = 0;
    setInterval(function () {
      var cur = msgs[i]; i = (i + 1) % msgs.length; var nxt = msgs[i];
      cur.classList.remove('is-active'); cur.classList.add('is-out');
      nxt.classList.remove('is-out'); nxt.classList.add('is-active');
      setTimeout(function () { cur.classList.remove('is-out'); }, 800);
    }, 4500);
  })();

  /* ---------------- Header / sticky CTA ---------------- */
  var header = $('#header'), sticky = $('#stickyCta'), heroEl = $('#hero');
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    var heroH = heroEl.offsetHeight;
    var hide = y > heroH && y > lastY + 4 && !openLayer && !croOn;
    if (y < lastY - 4 || y < heroH) header.classList.remove('is-hidden');
    else if (hide) header.classList.add('is-hidden');
    lastY = y;
    var nearEnd = window.innerHeight + y > document.documentElement.scrollHeight - 700;
    sticky.classList.toggle('is-show', y > heroH * .8 && !nearEnd);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Overlays ---------------- */
  var openLayer = null, lastFocus = null;
  function open(el) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;
    if (openLayer && openLayer !== el) close(openLayer, true);
    lastFocus = document.activeElement;
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    if (lenis) lenis.stop();
    openLayer = el;
    var f = el.querySelector('input[type=search], input[type=email], [data-close], button');
    if (f) setTimeout(function () { try { f.focus({ preventScroll: true }); } catch (e) { /* noop */ } }, 80);
  }
  function close(el, swapping) {
    el = el || openLayer; if (!el) return;
    el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true');
    if (openLayer === el) openLayer = null;
    if (!swapping) {
      document.body.classList.remove('no-scroll');
      if (lenis) lenis.start();
      if (lastFocus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
    }
  }
  $$('.drawer, .modal, .search').forEach(function (layer) {
    layer.addEventListener('click', function (e) {
      if (e.target === layer || e.target.closest('[data-close]')) close(layer);
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (openLayer) close(); else if (croOn) setCro(false);
  });
  $('#menuOpen').addEventListener('click', function () { open('menu'); });
  $('#searchOpen').addEventListener('click', function () { renderSearch(''); open('search'); });
  $('#cartOpen').addEventListener('click', function () { open('cart'); });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-open]');
    if (b) { e.preventDefault(); open(b.getAttribute('data-open')); }
  });

  /* ---------------- Toast ---------------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    toastEl.innerHTML = '<svg><use href="#i-check"/></svg><span>' + msg + '</span>';
    toastEl.classList.add('is-show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-show'); }, 2800);
  }
  function bump(el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }

  /* ---------------- Hero slideshow ---------------- */
  var slides = $$('.slide'), dots = $$('.hero__dot');
  var cur = 0, timer = null, paused = false, DUR = 7;
  var splits = [];
  function splitSlide(i) {
    if (splits[i] || !hasGsap || !window.SplitText) return splits[i];
    splits[i] = new SplitText($('.slide__title', slides[i]), { type: 'lines', linesClass: 'sline' });
    splits[i].lines.forEach(function (l) { var inner = document.createElement('span'); inner.style.display = 'block'; while (l.firstChild) inner.appendChild(l.firstChild); l.appendChild(inner); });
    return splits[i];
  }
  function animateIn(i, delay) {
    var s = slides[i];
    if (!hasGsap) return;
    splitSlide(i);
    var tl = gsap.timeline({ delay: delay || 0 });
    tl.fromTo($$('.slide__title .sline > span', s), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: .12, ease: 'power4.out' })
      .fromTo([$('.slide__eyebrow', s), $('.slide__sub', s), $('.slide__ctas', s)], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: .1, ease: 'power3.out' }, '-=.9')
      .fromTo($('.slide__product', s), { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, '-=.8');
  }
  function runProgress() {
    dots.forEach(function (d, k) {
      var b = $('b', d);
      if (hasGsap) { gsap.killTweensOf(b); gsap.set(b, { scaleX: k < cur ? 1 : 0 }); }
      else b.style.transform = 'scaleX(' + (k === cur ? 1 : 0) + ')';
    });
    clearTimeout(timer);
    if (paused) return;
    var bar = $('b', dots[cur]);
    if (hasGsap) gsap.to(bar, { scaleX: 1, duration: DUR, ease: 'none', onComplete: function () { goTo((cur + 1) % slides.length); } });
    else timer = setTimeout(function () { goTo((cur + 1) % slides.length); }, DUR * 1000);
  }
  function goTo(n) {
    if (n === cur) return;
    var prev = slides[cur], next = slides[n];
    var lazy = $('img', next); if (lazy.loading === 'lazy') lazy.loading = 'eager';
    prev.classList.remove('is-active'); prev.classList.add('is-leaving');
    next.classList.add('is-active');
    dots[cur].classList.remove('is-active'); dots[cur].setAttribute('aria-selected', 'false');
    dots[n].classList.add('is-active'); dots[n].setAttribute('aria-selected', 'true');
    cur = n;
    if (hasGsap) {
      gsap.fromTo(next, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.4, ease: 'expo.inOut', onComplete: function () { prev.classList.remove('is-leaving'); gsap.set(next, { clearProps: 'clipPath' }); } });
      gsap.fromTo($('.slide__media img', prev), { xPercent: 0 }, { xPercent: -12, duration: 1.4, ease: 'expo.inOut', clearProps: 'transform' });
      animateIn(n, .55);
    } else {
      prev.classList.remove('is-leaving');
    }
    runProgress();
  }
  dots.forEach(function (d) { d.addEventListener('click', function () { goTo(+d.getAttribute('data-go')); }); });
  $('#heroPause').addEventListener('click', function () {
    paused = !paused;
    this.innerHTML = '<svg><use href="#i-' + (paused ? 'play' : 'pause') + '"/></svg>';
    this.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
    if (paused && hasGsap) gsap.killTweensOf($('b', dots[cur]));
    runProgress();
  });
  // swipe on touch
  (function () {
    var x0 = null;
    heroEl.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    heroEl.addEventListener('touchend', function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) goTo((cur + (dx < 0 ? 1 : -1) + slides.length) % slides.length);
    });
  })();
  document.addEventListener('visibilitychange', function () {
    if (!hasGsap) return;
    var b = $('b', dots[cur]);
    if (document.hidden) gsap.getTweensOf(b).forEach(function (t) { t.pause(); });
    else if (!paused) gsap.getTweensOf(b).forEach(function (t) { t.resume(); });
  });

  /* ---------------- Category panels ---------------- */
  var panels = $$('.panel');
  panels.forEach(function (p) {
    var act = function () { if (!isDesktop()) return; panels.forEach(function (x) { x.classList.toggle('is-open', x === p); }); };
    p.addEventListener('mouseenter', act);
    p.addEventListener('focus', act);
  });

  /* ---------------- Products ---------------- */
  function starsHTML() { return '<span class="stars">' + new Array(6).join('<svg><use href="#i-star"/></svg>') + '</span>'; }
  function priceHTML(p) {
    return p.compare ? '<span class="price"><span class="is-sale">' + money0(p.price) + '</span><s>' + money0(p.compare) + '</s></span>' : '<span class="price">' + money0(p.price) + '</span>';
  }
  function imgTag(id, w, h, cls, alt, pos) {
    return '<img class="' + (cls || '') + '" src="' + U(id, w, h) + '" alt="' + (alt || '') + '" loading="lazy"' + (pos ? ' style="object-position:' + pos + '"' : '') + '>';
  }
  function cardHTML(p) {
    var b = '';
    if (p.badge === 'sale') b = '<span class="badge badge--sale">−' + Math.round((1 - p.price / p.compare) * 100) + '%</span>';
    else if (p.badge === 'New') b = '<span class="badge badge--dark">New</span>';
    else if (p.badge) b = '<span class="badge">' + p.badge + '</span>';
    var sizes = p.oneSize ? '<div class="quick__sizes quick__sizes--one"><button data-add="' + p.id + '" data-size="One Size">Add to Bag</button></div>' :
      '<div class="quick__sizes">' + SIZES.map(function (s) { var so = p.sold && p.sold.indexOf(s) > -1; return '<button data-add="' + p.id + '" data-size="' + s + '"' + (so ? ' disabled aria-label="' + s + ' sold out"' : ' aria-label="Add size ' + s + '"') + '>' + s + '</button>'; }).join('') + '</div>';
    return '<article class="card reveal" data-id="' + p.id + '">' +
      '<div class="card__media" data-cursor="View">' +
        '<div class="card__badges">' + b + '</div>' +
        '<button class="wish' + (wish[p.id] ? ' is-on' : '') + '" data-wish="' + p.id + '" aria-label="Save ' + p.name + ' to wishlist" aria-pressed="' + !!wish[p.id] + '"><svg><use href="#i-heart"/></svg></button>' +
        '<a href="#" data-qv="' + p.id + '" aria-label="Quick view ' + p.name + '">' + imgTag(p.img, 700, 933, 'card__img1', p.name) + imgTag(p.img2, 700, 933, 'card__img2', '') + '</a>' +
        '<div class="quick"><p><span>Quick add</span><button data-open="sizeModal">Size guide</button></p>' + sizes + '</div>' +
      '</div>' +
      '<div class="card__body">' +
        '<div class="card__top"><h3 class="card__title"><button data-qv="' + p.id + '">' + p.name + '</button></h3>' + priceHTML(p) + '</div>' +
        '<div class="card__meta"><div class="swatches">' + p.colors.map(function (c, i) { return '<button class="swatch' + (i ? '' : ' is-active') + '" style="background:' + c[1] + '" aria-label="' + c[0] + '" data-swatch></button>'; }).join('') + '</div>' +
        '<span class="card__rating">' + starsHTML() + p.rating + '</span></div>' +
        (p.stock ? '<p class="stock">Only ' + p.stock + ' left in your size range</p>' : '') +
        '<button class="card__add-m" data-qv="' + p.id + '">Choose Size</button>' +
      '</div></article>';
  }
  var row = $('#productRow'), ink = $('.tabs__ink');
  function moveInk() { var a = $('.tab.is-active'); if (!a) return; ink.style.width = a.offsetWidth + 'px'; ink.style.transform = 'translateX(' + a.offsetLeft + 'px)'; }
  function renderProducts(tab) {
    var list = PRODUCTS.filter(function (p) { return tab === 'under' ? p.price < 150 && p.tags.length : p.tags.indexOf(tab) > -1; });
    row.innerHTML = list.map(cardHTML).join('');
    row.scrollLeft = 0; updateSlider();
    if (hasGsap) gsap.fromTo(row.children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .9, stagger: .07, ease: 'power3.out' });
    else $$('.reveal', row).forEach(function (el) { el.style.opacity = 1; });
    bindCursorTargets(row);
  }
  function setTab(t) {
    $$('.tab').forEach(function (x) { var on = x.getAttribute('data-tab') === t; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', on); });
    moveInk(); renderProducts(t);
  }
  $$('.tab').forEach(function (t) { t.addEventListener('click', function () { setTab(t.getAttribute('data-tab')); }); });
  window.addEventListener('resize', moveInk);
  var bar = $('#sliderBar'), prevBtn = $('#prevBtn'), nextBtn = $('#nextBtn');
  function updateSlider() {
    var max = row.scrollWidth - row.clientWidth;
    var vis = row.clientWidth / row.scrollWidth;
    bar.style.width = Math.max(10, vis * 100) + '%';
    bar.style.transform = 'translateX(' + (max > 0 ? (row.scrollLeft / max) * ((1 / Math.max(vis, .1)) - 1) * 100 : 0) + '%)';
    prevBtn.disabled = row.scrollLeft < 8;
    nextBtn.disabled = row.scrollLeft >= max - 8;
  }
  row.addEventListener('scroll', updateSlider, { passive: true });
  window.addEventListener('resize', updateSlider);
  prevBtn.addEventListener('click', function () { row.scrollBy({ left: -row.clientWidth * .8, behavior: 'smooth' }); });
  nextBtn.addEventListener('click', function () { row.scrollBy({ left: row.clientWidth * .8, behavior: 'smooth' }); });
  // drag to scroll (desktop)
  (function () {
    var down = false, sx = 0, sl = 0, moved = false;
    row.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.target.closest('button')) return; down = true; moved = false; sx = e.clientX; sl = row.scrollLeft; });
    window.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 6) { moved = true; row.classList.add('is-drag'); } row.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', function () { if (!down) return; down = false; setTimeout(function () { row.classList.remove('is-drag'); }, 0); });
    row.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  })();

  // Delegated interactions
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-add]'))) { e.preventDefault(); addToCart(t.getAttribute('data-add'), t.getAttribute('data-size'), null, true); return; }
    if ((t = e.target.closest('[data-wish]'))) { e.preventDefault(); toggleWish(t.getAttribute('data-wish')); return; }
    if ((t = e.target.closest('[data-qv]'))) { e.preventDefault(); quickView(t.getAttribute('data-qv')); return; }
    if ((t = e.target.closest('.card [data-swatch]'))) {
      $$('[data-swatch]', t.parentNode).forEach(function (s) { s.classList.remove('is-active'); });
      t.classList.add('is-active');
    }
  });

  /* ---------------- Wishlist ---------------- */
  function wishCount() { return Object.keys(wish).filter(function (k) { return wish[k]; }).length; }
  function toggleWish(id) {
    wish[id] = !wish[id];
    $$('[data-wish="' + id + '"]').forEach(function (b) { b.classList.toggle('is-on', wish[id]); b.setAttribute('aria-pressed', wish[id]); });
    var c = $('#wishCount'), n = wishCount(); c.hidden = !n; c.textContent = n; bump(c);
    toast(wish[id] ? 'Saved to your wishlist' : 'Removed from your wishlist');
  }
  $('#wishBtn').addEventListener('click', function () {
    var n = wishCount();
    toast(n ? n + ' piece' + (n > 1 ? 's' : '') + ' saved — sign in to keep them forever' : 'Tap ♡ on any piece to save it');
  });

  /* ---------------- Cart ---------------- */
  function addToCart(id, size, color, openDrawer, silent) {
    var p = byId(id); if (!p) return;
    color = color || p.colors[0][0];
    var key = id + '|' + size + '|' + color;
    var line = cart.filter(function (l) { return l.key === key; })[0];
    if (line) line.qty++; else cart.push({ key: key, id: id, size: size, color: color, qty: 1 });
    renderCart(); bump($('#cartCount'));
    if (openDrawer) open('cart'); else if (!silent) toast(p.name + ' added to your bag');
  }
  function renderCart() {
    var count = cart.reduce(function (a, l) { return a + l.qty; }, 0);
    var sub = cart.reduce(function (a, l) { return a + byId(l.id).price * l.qty; }, 0);
    var c = $('#cartCount'); c.hidden = !count; c.textContent = count;
    $('#cartHeadCount').textContent = '(' + count + ')';
    $('#cartSubtotal').textContent = money(sub);
    $('#cartInstal').textContent = money(sub / 4);
    var left = Math.max(0, FREE_SHIP - sub), ship = $('.ship');
    ship.classList.toggle('is-free', sub > 0 && left === 0);
    $('#shipMsg').innerHTML = sub === 0 ? 'Complimentary shipping on orders over <b>$150</b>' : left === 0 ? '✓ You\'ve unlocked <b>complimentary express shipping</b>' : 'You\'re <b>' + money(left) + '</b> away from complimentary shipping';
    $('#shipBar').style.width = Math.min(100, sub / FREE_SHIP * 100) + '%';
    $('#cartItems').innerHTML = !cart.length ?
      '<div class="cart__empty"><h4>Your bag is empty</h4><p>Discover pieces made to be treasured.</p><a href="#bestsellers" class="btn btn--dark">Shop Bestsellers</a></div>' :
      cart.map(function (l, i) {
        var p = byId(l.id);
        return '<div class="line">' + imgTag(p.img, 170, 212, '', p.name, p.pos) +
          '<div><h4>' + p.name + '</h4><p>' + l.color + ' · ' + l.size + '</p>' +
          '<div class="qty"><button data-q="' + i + '" data-d="-1" aria-label="Decrease quantity"><svg><use href="#i-minus"/></svg></button><span>' + l.qty + '</span><button data-q="' + i + '" data-d="1" aria-label="Increase quantity"><svg><use href="#i-plus"/></svg></button></div></div>' +
          '<div class="line__right"><span>' + money(p.price * l.qty) + '</span><button class="line__remove" data-rm="' + i + '">Remove</button></div></div>';
      }).join('');
    var inCart = cart.map(function (l) { return l.id; });
    var ups = PRODUCTS.filter(function (p) { return inCart.indexOf(p.id) < 0 && p.price < 150 && p.tags.length; }).slice(0, 2);
    $('#cartUpsell').innerHTML = cart.length && ups.length ? '<h5>Complete the look</h5>' + ups.map(function (p) {
      return '<div class="upsell">' + imgTag(p.img, 120, 150, '', '') + '<div><h6>' + p.name + '</h6><p>' + money0(p.price) + '</p></div><button class="btn" data-add="' + p.id + '" data-size="S">+ Add</button></div>';
    }).join('') : '';
  }
  $('#cartItems').addEventListener('click', function (e) {
    var q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    if (q) { var l = cart[+q.getAttribute('data-q')]; l.qty += +q.getAttribute('data-d'); if (l.qty < 1) cart.splice(cart.indexOf(l), 1); renderCart(); }
    if (rm) { cart.splice(+rm.getAttribute('data-rm'), 1); renderCart(); }
  });
  $('#checkoutBtn').addEventListener('click', function () { toast(cart.length ? 'Concept preview — this continues to Shopify checkout' : 'Your bag is empty'); });

  /* ---------------- Quick view ---------------- */
  function quickView(id) {
    var p = byId(id); if (!p) return;
    var size = p.oneSize ? 'One Size' : null, color = p.colors[0][0];
    var sizes = p.oneSize ? '<div class="qv__sizes qv__sizes--one"><button class="is-active" data-s="One Size">One Size</button></div>' :
      '<div class="qv__sizes">' + SIZES.map(function (s) { var so = p.sold && p.sold.indexOf(s) > -1; return '<button data-s="' + s + '"' + (so ? ' disabled' : '') + '>' + s + '</button>'; }).join('') + '</div>';
    var thumbs = p.img2 !== p.img ? '<div class="qv__thumbs"><button class="is-active" data-img="' + p.img + '">' + imgTag(p.img, 120, 150, '', 'View 1') + '</button><button data-img="' + p.img2 + '">' + imgTag(p.img2, 120, 150, '', 'View 2') + '</button></div>' : '';
    $('#qvBody').innerHTML =
      '<div class="qv__media"><img id="qvImg" src="' + U(p.img, 1000, 1250) + '" alt="' + p.name + '"' + (p.pos ? ' style="object-position:' + p.pos + '"' : '') + '>' + thumbs + '</div>' +
      '<div class="qv__info">' +
        '<span class="card__rating">' + starsHTML() + p.rating + ' · ' + p.reviews + ' reviews</span>' +
        '<h3>' + p.name + '</h3>' +
        '<div class="qv__price">' + (p.compare ? '<span class="is-sale">' + money0(p.price) + '</span><s>' + money0(p.compare) + '</s>' : '<span>' + money0(p.price) + '</span>') + '</div>' +
        '<p class="qv__instal">or 4 interest-free payments of ' + money(p.price / 4) + ' with Shop Pay</p>' +
        '<div class="qv__label"><span>Colour <b id="qvColor">' + color + '</b></span></div>' +
        '<div class="qv__swatches">' + p.colors.map(function (c, i) { return '<button class="swatch' + (i ? '' : ' is-active') + '" style="background:' + c[1] + '" aria-label="' + c[0] + '" data-c="' + c[0] + '"></button>'; }).join('') + '</div>' +
        '<div class="qv__label"><span>Size</span>' + (p.oneSize ? '' : '<button data-open="sizeModal">Fit Finder &amp; size guide</button>') + '</div>' +
        sizes + '<p class="qv__err" id="qvErr" aria-live="polite"></p>' +
        (p.stock ? '<p class="stock">Only ' + p.stock + ' left — order soon</p>' : '') +
        '<button class="btn btn--dark btn--block" id="qvAdd">Add to Bag — ' + money0(p.price) + '</button>' +
        '<ul class="qv__perks"><li><svg><use href="#i-check"/></svg>Complimentary shipping over $150</li><li><svg><use href="#i-check"/></svg>Free 30-day returns &amp; exchanges</li><li><svg><use href="#i-check"/></svg>Dispatched within 24 hours, gift-wrapped</li></ul>' +
      '</div>';
    var body = $('#qvBody');
    body.onclick = function (e) {
      var b;
      if ((b = e.target.closest('[data-s]')) && !b.disabled) { $$('[data-s]', body).forEach(function (x) { x.classList.remove('is-active'); }); b.classList.add('is-active'); size = b.getAttribute('data-s'); $('#qvErr').textContent = ''; }
      if ((b = e.target.closest('[data-c]'))) { $$('[data-c]', body).forEach(function (x) { x.classList.remove('is-active'); }); b.classList.add('is-active'); color = b.getAttribute('data-c'); $('#qvColor').textContent = color; }
      if ((b = e.target.closest('[data-img]'))) { $$('[data-img]', body).forEach(function (x) { x.classList.remove('is-active'); }); b.classList.add('is-active'); $('#qvImg').src = U(b.getAttribute('data-img'), 1000, 1250); }
      if (e.target.closest('#qvAdd')) { if (!size) { $('#qvErr').textContent = 'Please select your size'; return; } addToCart(p.id, size, color, true); }
    };
    open('qv');
  }

  /* ---------------- Shop the look ---------------- */
  var LOOK = ['p4', 'p14', 'p15', 'p16'];
  var lookSel = { p4: true, p14: true, p15: true, p16: true };
  var lookSize = {};
  var lookList = $('#lookList');
  lookList.innerHTML = LOOK.map(function (id) {
    var p = byId(id);
    var sel = p.oneSize ? '<select disabled aria-label="Size"><option>One Size</option></select>' : '<select data-lsize="' + id + '" aria-label="Size for ' + p.name + '">' + SIZES.map(function (s) { return '<option' + (s === 'S' ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select>';
    return '<li class="look__item" data-look="' + id + '"><button class="look__check is-on" data-lcheck="' + id + '" aria-label="Include ' + p.name + '" aria-pressed="true"><svg><use href="#i-check"/></svg></button>' + imgTag(p.img, 130, 160, '', p.name, p.pos) + '<div><h4>' + p.name + '</h4><p>' + money0(p.price) + '</p></div>' + sel + '</li>';
  }).join('');
  function updateLook() {
    var ids = LOOK.filter(function (id) { return lookSel[id]; });
    var sum = ids.reduce(function (a, id) { return a + byId(id).price; }, 0);
    var disc = ids.length >= 3 ? .15 : 0;
    $('#lookTotal').textContent = money0(sum * (1 - disc));
    $('#lookWas').textContent = disc ? money0(sum) : '';
    $('#lookSave').textContent = disc ? 'Save ' + money0(sum * disc) : 'Select 3+ to save 15%';
    $('#addLook').textContent = ids.length ? 'Add ' + ids.length + ' Piece' + (ids.length > 1 ? 's' : '') + ' to Bag' : 'Select pieces';
    $('#addLook').disabled = !ids.length;
  }
  lookList.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lcheck]'); if (!b) return;
    var id = b.getAttribute('data-lcheck'); lookSel[id] = !lookSel[id];
    b.classList.toggle('is-on', lookSel[id]); b.setAttribute('aria-pressed', lookSel[id]); updateLook();
  });
  lookList.addEventListener('change', function (e) { var s = e.target.closest('[data-lsize]'); if (s) lookSize[s.getAttribute('data-lsize')] = s.value; });
  updateLook();
  var tip = $('#lookTip');
  $$('.hotspot').forEach(function (h) {
    var id = h.getAttribute('data-spot'), p = byId(id);
    var act = function () {
      $$('.hotspot').forEach(function (x) { x.classList.toggle('is-active', x === h); });
      $$('.look__item').forEach(function (li) { li.classList.toggle('is-active', li.getAttribute('data-look') === id); });
      tip.innerHTML = '<b>' + p.name + '</b>' + money0(p.price) + ' · Tap to view';
      tip.style.left = h.style.left; tip.style.top = h.style.top; tip.classList.add('is-show');
    };
    h.addEventListener('mouseenter', act); h.addEventListener('focus', act);
    h.addEventListener('mouseleave', function () { tip.classList.remove('is-show'); });
    h.addEventListener('click', function () { act(); quickView(id); });
  });
  $('#addLook').addEventListener('click', function () {
    var ids = LOOK.filter(function (id) { return lookSel[id]; });
    ids.forEach(function (id) { addToCart(id, byId(id).oneSize ? 'One Size' : (lookSize[id] || 'S'), null, false, true); });
    open('cart');
    if (ids.length >= 3) toast('Complete look added — 15% saving applied at checkout');
  });

  /* ---------------- Reviews ---------------- */
  var qStage = $('#quoteStage'), qDots = $('#quoteDots'), qi = 0, qTimer;
  qStage.innerHTML = REVIEWS.map(function (r, i) {
    var p = byId(r.p);
    return '<div class="quote' + (i ? '' : ' is-active') + '">' + starsHTML().replace('stars', 'stars stars--lg') + '<blockquote>' + r.q + '</blockquote>' +
      '<div class="quote__who">' + imgTag(p.img, 130, 160, '', p.name) + '<div><b>' + r.n + '</b><span>' + r.loc + ' · Purchased ' + p.name + '</span><span>' + r.meta + '</span><em><svg><use href="#i-check"/></svg>Verified buyer</em></div></div></div>';
  }).join('');
  qDots.innerHTML = REVIEWS.map(function (r, i) { return '<button' + (i ? '' : ' class="is-active"') + ' aria-label="Review ' + (i + 1) + '"></button>'; }).join('');
  function showQuote(n) {
    var qs = $$('.quote', qStage), ds = $$('button', qDots);
    qs[qi].classList.remove('is-active'); ds[qi].classList.remove('is-active');
    qi = (n + qs.length) % qs.length;
    qs[qi].classList.add('is-active'); ds[qi].classList.add('is-active');
    clearInterval(qTimer); qTimer = setInterval(function () { showQuote(qi + 1); }, 8000);
  }
  $$('button', qDots).forEach(function (d, i) { d.addEventListener('click', function () { showQuote(i); }); });
  $('#qPrev').addEventListener('click', function () { showQuote(qi - 1); });
  $('#qNext').addEventListener('click', function () { showQuote(qi + 1); });
  qTimer = setInterval(function () { showQuote(qi + 1); }, 8000);

  /* ---------------- UGC ---------------- */
  var ugcHTML = UGC.map(function (u) {
    var p = byId(u[1]);
    return '<a class="ugc__item" href="#" data-qv="' + u[1] + '" data-cursor="Shop" aria-label="Shop ' + p.name + ' as worn by ' + u[2] + '">' + imgTag(u[0], 600, 750, '', 'Customer wearing ' + p.name) + '<span>Shop the look</span><i>' + u[2] + '</i></a>';
  }).join('');
  $('#ugcTrack').innerHTML = ugcHTML + ugcHTML.replace(/<a class="ugc__item"/g, '<a class="ugc__item" aria-hidden="true" tabindex="-1"');

  /* ---------------- Size finder ---------------- */
  $('#finder').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, ui = f.usual.selectedIndex - 1, pref = f.pref.value;
    if (ui < 0 || pref === '') return;
    var idx = Math.min(SIZES.length - 1, ui + (pref === '2' ? 1 : 0));
    var note = pref === '0' ? 'Our cuts are true to size — your usual size gives a beautifully fitted silhouette.' : pref === '1' ? 'Our pieces are designed with natural ease — your usual size is perfect.' : 'Size up for that effortless oversized drape.';
    $('#finderResult').innerHTML = 'Your ÉLARA size: <b>' + SIZES[idx] + '</b><br>' + note;
    $$('.size-table tbody tr').forEach(function (tr, i) { tr.classList.toggle('is-hl', i === idx); });
  });

  /* ---------------- Search ---------------- */
  var sInput = $('#searchInput');
  function renderSearch(q) {
    q = (q || '').trim().toLowerCase();
    var pool = PRODUCTS.filter(function (p) { return p.tags.length; });
    var list = !q ? pool.filter(function (p) { return p.tags.indexOf('best') > -1; }) :
      q.indexOf('under') > -1 ? pool.filter(function (p) { return p.price < 150; }) :
      pool.filter(function (p) { var hay = (p.name + ' ' + p.cat).toLowerCase(); return hay.indexOf(q) > -1 || q.split(/\s+/).some(function (w) { return w.length > 2 && hay.indexOf(w.replace(/s$/, '')) > -1; }); });
    $('#searchLabel').textContent = q ? list.length + ' result' + (list.length === 1 ? '' : 's') + ' for “' + q + '”' : 'Most wanted right now';
    $('#searchResults').innerHTML = list.length ? list.slice(0, 8).map(function (p) {
      return '<button class="sres" data-qv="' + p.id + '">' + imgTag(p.img, 360, 480, '', '') + '<h5>' + p.name + '</h5><p>' + money0(p.price) + '</p></button>';
    }).join('') : '<p class="search__empty">No pieces found — try “blazer”, “dress” or “coat”.</p>';
  }
  sInput.addEventListener('input', function () { renderSearch(sInput.value); });
  $('#searchForm').addEventListener('submit', function (e) { e.preventDefault(); });
  $('#chips').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { sInput.value = b.textContent; renderSearch(b.textContent); } });

  /* ---------------- Subscribe ---------------- */
  $$('[data-subscribe]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = f.querySelector('button');
      f.querySelector('.subscribe__msg').innerHTML = 'Welcome to the Inner Circle. Your code <b>WELCOME10</b> is on its way.';
      btn.classList.add('is-done'); btn.textContent = 'You\'re in ✓';
      store.set('elara_sub', '1');
      if (f.closest('#offer')) setTimeout(function () { close(); }, 2000);
    });
  });

  /* ---------------- Welcome popup ---------------- */
  var offerShown = store.get('elara_offer') === '1';
  function showOffer() {
    if (offerShown || openLayer || croOn || store.get('elara_sub') === '1') return;
    offerShown = true; store.set('elara_offer', '1'); open('offer');
  }
  setTimeout(showOffer, 35000);
  document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY < 6 && window.scrollY > 600) showOffer(); });

  /* ---------------- Recent purchase ---------------- */
  (function () {
    var el = $('#proof'), n = 0;
    var data = [['Priya', 'New York', 'p2', '3 minutes'], ['Amelia', 'Chicago', 'p9', '8 minutes'], ['Sofia', 'Los Angeles', 'p7', '14 minutes']];
    function show() {
      if (n >= data.length) return;
      if (!isDesktop()) return;
      if (openLayer || croOn || window.scrollY < 400) { setTimeout(show, 12000); return; }
      var d = data[n++], p = byId(d[2]);
      el.innerHTML = imgTag(p.img, 100, 125, '', '') + '<div><b>' + d[0] + ' in ' + d[1] + '</b> purchased<br>' + p.name + '<small>' + d[3] + ' ago · Verified</small></div>';
      el.classList.add('is-show');
      setTimeout(function () { el.classList.remove('is-show'); }, 5500);
      setTimeout(show, 45000);
    }
    setTimeout(show, 20000);
  })();

  /* ---------------- Sticky CTA hide when overlays ---------------- */

  /* ---------------- Custom cursor ---------------- */
  var cursor = $('#cursor'), dot = $('#cursorDot'), label = $('.cursor__label', cursor);
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function bindCursorTargets(scope) {
    if (!fine) return;
    $$('[data-cursor]', scope || document).forEach(function (el) {
      if (el._cur) return; el._cur = true;
      el.addEventListener('mouseenter', function () { label.textContent = el.getAttribute('data-cursor'); cursor.classList.add('is-view'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-view'); });
    });
  }
  if (fine && !reduce) {
    document.body.classList.add('has-cursor');
    var mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)'; }, { passive: true });
    (function loop() { cx += (mx - cx) * .18; cy += (my - cy) * .18; cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', function (e) {
      var l = e.target.closest('a, button, select, input, summary');
      cursor.classList.toggle('is-link', !!l && !e.target.closest('[data-cursor]'));
    });
    document.addEventListener('mouseleave', function () { cursor.classList.add('is-hidden'); dot.classList.add('is-hidden'); });
    document.addEventListener('mouseenter', function () { cursor.classList.remove('is-hidden'); dot.classList.remove('is-hidden'); });
    bindCursorTargets();
  }

  /* ---------------- CRO notes ---------------- */
  var keys = Object.keys(CRO), croToggle = $('#croToggle'), croPanel = $('#croPanel');
  keys.forEach(function (k, i) {
    var sec = document.querySelector('[data-cro="' + k + '"]'); if (!sec) return;
    var host = k === 'lookbook' ? $('.lookbook__pin') : k === 'campaign' ? $('.campaign__frame') : sec;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    var pin = document.createElement('button');
    pin.type = 'button'; pin.className = 'cro-pin';
    pin.innerHTML = '<b>' + (i + 1) + '</b><span>' + CRO[k].t + '</span>';
    var pop = document.createElement('div'); pop.className = 'cro-pop';
    pop.innerHTML = '<h5>' + (i + 1) + '. ' + CRO[k].t + '</h5><p>' + CRO[k].s + '</p><ul>' + CRO[k].pts.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><span class="tag">Goal · ' + CRO[k].tag + '</span>';
    if (k === 'announce') { pin.style.top = '6px'; pin.style.right = 'auto'; pin.style.left = '16px'; pin.style.padding = '2px 12px 2px 2px'; pop.style.left = '16px'; pop.style.right = 'auto'; pop.style.top = '44px'; }
    if (k === 'header') { pin.style.top = 'calc(100% + 8px)'; pin.style.right = 'auto'; pin.style.left = '16px'; pop.style.top = 'calc(100% + 52px)'; pop.style.right = 'auto'; pop.style.left = '16px'; }
    if (k === 'hero') { pin.style.top = '150px'; pop.style.top = '192px'; }
    pin.addEventListener('click', function (e) {
      e.stopPropagation();
      var was = pop.classList.contains('is-open');
      $$('.cro-pop').forEach(function (x) { x.classList.remove('is-open'); });
      if (!was) pop.classList.add('is-open');
    });
    pop.addEventListener('click', function (e) { e.stopPropagation(); });
    host.appendChild(pin); host.appendChild(pop);
    sec._pop = pop;
  });
  document.addEventListener('click', function () { $$('.cro-pop').forEach(function (x) { x.classList.remove('is-open'); }); });
  $('#croList').innerHTML = keys.map(function (k, i) {
    return '<li><button data-goto="' + k + '"><b>' + (i + 1) + '</b><div><strong>' + CRO[k].t + '</strong><span>' + CRO[k].s + '</span></div></button></li>';
  }).join('') + CRO_EXTRA.map(function (x) {
    return '<li><button data-act="' + (x.act || '') + '"><b>✦</b><div><strong>' + x.t + '</strong><span>' + x.s + '</span></div></button></li>';
  }).join('');
  $('#croList').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    e.stopPropagation();
    var k = b.getAttribute('data-goto'), act = b.getAttribute('data-act');
    if (window.innerWidth < 1360) setPanel(false);
    if (k) {
      var sec = document.querySelector('[data-cro="' + k + '"]');
      $$('.cro-pop').forEach(function (x) { x.classList.remove('is-open'); });
      if (k === 'announce' || k === 'header') { if (lenis) lenis.scrollTo(0); else window.scrollTo(0, 0); }
      else scrollToEl(sec);
      setTimeout(function () { if (sec._pop) sec._pop.classList.add('is-open'); }, 1300);
    } else if (act === 'cart') {
      if (!cart.length) { addToCart('p1', 'S', null, false, true); addToCart('p9', 'M', null, false, true); }
      open('cart');
    } else if (act === 'search') { renderSearch(''); open('search'); }
  });
  function setPanel(on) {
    croPanel.classList.toggle('is-open', on); croPanel.setAttribute('aria-hidden', String(!on));
    document.body.classList.toggle('cro-panel-open', on);
    if (hasGsap) setTimeout(function () { ScrollTrigger.refresh(); }, 750);
  }
  function setCro(on) {
    croOn = on;
    document.body.classList.toggle('cro-on', on);
    croToggle.setAttribute('aria-pressed', String(on));
    $('span', croToggle).textContent = on ? 'Hide design notes' : 'Show design notes';
    setPanel(on);
    if (!on) $$('.cro-pop').forEach(function (x) { x.classList.remove('is-open'); });
  }
  croToggle.addEventListener('click', function (e) { e.stopPropagation(); setCro(!croOn); });
  $('#croClose').addEventListener('click', function () { setPanel(false); });

  /* ---------------- Initial render ---------------- */
  renderProducts('best');
  renderCart();
  requestAnimationFrame(moveInk);
  if (/[?&]notes=1/.test(location.search)) setCro(true);

  /* ---------------- Motion ---------------- */
  function counters() {
    $$('[data-count]').forEach(function (el) {
      var end = +el.getAttribute('data-count');
      var fmt = function (v) { return end === 25 ? Math.round(v) + 'K+' : Math.round(v) + '%'; };
      if (!hasGsap) { el.textContent = fmt(end); return; }
      var o = { v: 0 };
      gsap.to(o, { v: end, duration: 2.2, ease: 'power3.out', onUpdate: function () { el.textContent = fmt(o.v); }, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
  }

  function intro() {
    var loading = root.classList.contains('is-loading');
    var heroIn = function () { animateIn(0, 0); gsap.fromTo('.hero__bar', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: .5, ease: 'power3.out' }); runProgress(); };
    if (!loading) { heroIn(); return; }
    store.set('elara_intro', '1');
    var tl = gsap.timeline({ onComplete: function () { root.classList.remove('is-loading'); } });
    tl.fromTo('.loader__word span', { yPercent: 110 }, { yPercent: 0, duration: .8, stagger: .06, ease: 'power4.out' })
      .to('.loader__line i', { scaleX: 1, duration: .7, ease: 'power3.inOut' }, '-=.5')
      .to('.loader__tag', { opacity: 1, duration: .4 }, '-=.4')
      .to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '+=.15')
      .add(heroIn, '-=.55');
  }

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);
    intro();

    // section titles: line reveal
    $$('.title.split').forEach(function (t) {
      if (window.SplitText) {
        var s = new SplitText(t, { type: 'lines', linesClass: 'sline' });
        s.lines.forEach(function (l) { var inner = document.createElement('span'); inner.style.display = 'block'; while (l.firstChild) inner.appendChild(l.firstChild); l.appendChild(inner); });
        gsap.from($$('.sline > span', t), { yPercent: 110, duration: 1.2, stagger: .1, ease: 'power4.out', scrollTrigger: { trigger: t, start: 'top 88%', once: true } });
      } else {
        gsap.from(t, { opacity: 0, y: 40, duration: 1, scrollTrigger: { trigger: t, start: 'top 88%', once: true } });
      }
    });
    // eyebrows + generic reveals
    $$('.eyebrow, .head__sub, .look__lead, .story__copy > p:not(.eyebrow), .story__copy blockquote, .faq__help, .newsletter__sub, .subscribe, .newsletter__fine').forEach(function (el) {
      if (el.closest('.slide') || el.closest('.modal') || el.closest('.cro-panel') || el.closest('.drawer')) return;
      gsap.from(el, { opacity: 0, y: 24, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    $$('.promise__item, .badges-row > div, .accordion details, .look__item, .footer__col').forEach(function (el) { el.classList.add('reveal'); });
    ScrollTrigger.batch('.reveal:not(.card)', {
      start: 'top 90%', once: true,
      onEnter: function (els) { gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, stagger: .08, ease: 'power3.out' }); }
    });
    // panels entrance
    gsap.from('.panel', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.panels', start: 'top 85%', once: true } });

    // manifesto word-by-word
    (function () {
      var el = $('#manifesto');
      var nodes = Array.prototype.slice.call(el.childNodes);
      nodes.forEach(function (n) {
        if (n.nodeType !== 3) return;
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
          var s = document.createElement('span'); s.className = 'word'; s.textContent = w; frag.appendChild(s);
        });
        el.replaceChild(frag, n);
      });
      gsap.to($$('.word', el), { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
      gsap.from($$('.pill', el), { width: 0, duration: 1.2, ease: 'power3.out', stagger: .2, scrollTrigger: { trigger: el, start: 'top 75%', once: true } });
    })();
    counters();
    // rating bars
    $$('.bars i').forEach(function (b) { b.style.setProperty('--s', 0); });
    ScrollTrigger.create({ trigger: '.bars', start: 'top 85%', once: true, onEnter: function () { $$('.bars i').forEach(function (b) { b.style.setProperty('--s', 1); }); } });

    var mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', function () {
      // campaign scale reveal
      gsap.timeline({ scrollTrigger: { trigger: '.campaign', start: 'top bottom', end: 'center center', scrub: true } })
        .fromTo('.campaign__frame', { clipPath: 'inset(14% 18% round 0px)' }, { clipPath: 'inset(0% 0% round 0px)', ease: 'none' }, 0)
        .fromTo('.campaign__frame img', { scale: 1.3 }, { scale: 1, ease: 'none' }, 0);
      gsap.from('.campaign__content > *', { opacity: 0, y: 50, stagger: .1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.campaign', start: 'top 20%', once: true } });

      // lookbook horizontal pin
      var track = $('#lbTrack');
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: '.lookbook', pin: true, start: 'top top', end: function () { return '+=' + dist(); }, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: function (self) { gsap.set('#lbBar', { scaleX: self.progress }); } }
      });
      // parallax
      gsap.to('.story__img--a img', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('.story__img--b', { y: 80 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('.newsletter__bg', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.newsletter', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from('.footer__word', { yPercent: 40, opacity: 0, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: '.footer__word', start: 'top 95%', once: true } });
      // hero parallax on scroll
      gsap.to('.hero__slides', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  } else {
    root.classList.remove('js-anim', 'is-loading');
    counters();
    runProgress();
  }
})();
