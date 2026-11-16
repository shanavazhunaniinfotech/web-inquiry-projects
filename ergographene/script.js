/* =========================================================
   ErgoGraphene — homepage concept interactions
   GSAP 3 + ScrollTrigger + Lenis
   ========================================================= */
(function () {
  'use strict';
  var d = document, w = window;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var hasGsap = typeof w.gsap !== 'undefined' && typeof w.ScrollTrigger !== 'undefined';
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = w.matchMedia('(pointer: fine)').matches;
  var isMobile = function () { return w.innerWidth <= 760; };
  var lenis = null;

  /* ---------- Locale: language + currency ---------- */
  var RATES = { EUR: 1, GBP: 0.86, CHF: 0.94, SEK: 11.4, DKK: 7.46, PLN: 4.3, USD: 1.08, CAD: 1.5 };
  var LOCALES = { en: 'en-IE', de: 'de-DE', fr: 'fr-FR', it: 'it-IT', es: 'es-ES' };
  var FLAGS = { EUR: '🇪🇺', GBP: '🇬🇧', CHF: '🇨🇭', SEK: '🇸🇪', DKK: '🇩🇰', PLN: '🇵🇱', USD: '🇺🇸', CAD: '🇨🇦' };
  var I18N = {
    en: {},
    de: {
      ann1: 'Kostenloser weltweiter Versand — versichert & verfolgbar', ann2: '30 Tage Komfort-Garantie, kostenlose Rücksendung', ann3: 'Bezahlen mit PayPal, Apple Pay, Klarna oder MB WAY',
      nav_shop: 'Shop', nav_science: 'Die Technologie', nav_reviews: 'Bewertungen', nav_faq: 'FAQ',
      hero_k: 'Ergonomischer Halt mit Graphen', hero_t1: 'Klüger sitzen.', hero_t2: 'Besser fühlen.',
      hero_p: 'Ein Haltungssitz mit wärmendem Graphen-Kern, sechs verstärkten Rippen und atmungsaktivem Tech-Mesh — für die Stühle, die Sie schon besitzen.',
      cta_shop: 'Jetzt kaufen', cta_science: 'So funktioniert es', add: 'In den Warenkorb',
      s_scan: 'Vier Zonen.', s_warm: 'Wärme,', s_reviews: 'Geliebt in ganz', s_seal: 'Testen Sie ihn', s_faq: 'Fragen,'
    },
    fr: {
      ann1: 'Livraison gratuite dans le monde — assurée et suivie', ann2: 'Garantie confort 30 jours, retours gratuits', ann3: 'Payez avec PayPal, Apple Pay, Klarna ou MB WAY',
      nav_shop: 'Boutique', nav_science: 'La science', nav_reviews: 'Avis', nav_faq: 'FAQ',
      hero_k: 'Soutien ergonomique au graphène', hero_t1: 'Asseyez-vous mieux.', hero_t2: 'Sentez la différence.',
      hero_p: 'Un siège de posture avec un cœur chauffant au graphène, six nervures renforcées et un tech-mesh respirant — conçu pour les chaises que vous avez déjà.',
      cta_shop: 'Acheter', cta_science: 'Comment ça marche', add: 'Ajouter au panier',
      s_scan: 'Quatre zones.', s_warm: 'La chaleur,', s_reviews: 'Adoré dans toute l’', s_seal: 'Essayez-le', s_faq: 'Vos questions,'
    },
    it: {
      ann1: 'Spedizione gratuita in tutto il mondo — assicurata e tracciata', ann2: 'Garanzia comfort 30 giorni, resi gratuiti', ann3: 'Paga con PayPal, Apple Pay, Klarna o MB WAY',
      nav_shop: 'Shop', nav_science: 'La scienza', nav_reviews: 'Recensioni', nav_faq: 'FAQ',
      hero_k: 'Supporto ergonomico al grafene', hero_t1: 'Siediti meglio.', hero_t2: 'Stai meglio.',
      hero_p: 'Una seduta posturale con cuore riscaldante al grafene, sei costole rinforzate e tech-mesh traspirante — per le sedie che hai già.',
      cta_shop: 'Acquista', cta_science: 'Come funziona', add: 'Aggiungi al carrello',
      s_scan: 'Quattro zone.', s_warm: 'Calore,', s_reviews: 'Amato in tutta', s_seal: 'Provalo per', s_faq: 'Domande,'
    },
    es: {
      ann1: 'Envío gratis a todo el mundo — asegurado y con seguimiento', ann2: 'Garantía de confort de 30 días, devoluciones gratis', ann3: 'Paga con PayPal, Apple Pay, Klarna o MB WAY',
      nav_shop: 'Tienda', nav_science: 'La ciencia', nav_reviews: 'Opiniones', nav_faq: 'FAQ',
      hero_k: 'Soporte ergonómico con grafeno', hero_t1: 'Siéntate mejor.', hero_t2: 'Siéntete mejor.',
      hero_p: 'Un asiento postural con núcleo térmico de grafeno, seis costillas reforzadas y tech-mesh transpirable — para las sillas que ya tienes.',
      cta_shop: 'Comprar', cta_science: 'Cómo funciona', add: 'Añadir al carrito',
      s_scan: 'Cuatro zonas.', s_warm: 'Calor,', s_reviews: 'Querido en toda', s_seal: 'Pruébalo', s_faq: 'Preguntas,'
    }
  };
  var state = { lang: 'en', cur: 'EUR' };
  try { var saved = JSON.parse(localStorage.getItem('eg-locale') || 'null'); if (saved && RATES[saved.cur] && I18N[saved.lang]) state = saved; } catch (e) {}

  // capture English defaults
  $$('[data-i18n]').forEach(function (el) { var k = el.dataset.i18n; if (!I18N.en[k]) I18N.en[k] = el.textContent; });

  function money(eur) {
    var r = RATES[state.cur], v = eur * r;
    if (['SEK', 'DKK', 'PLN'].indexOf(state.cur) > -1) v = Math.round(v / 5) * 5;
    else if (state.cur !== 'EUR') v = Math.ceil(v) - 0.05;
    var whole = ['SEK', 'DKK', 'PLN'].indexOf(state.cur) > -1;
    var CUR_LOC = { GBP: 'en-GB', USD: 'en-US', CAD: 'en-CA', CHF: 'de-CH', SEK: 'sv-SE', DKK: 'da-DK', PLN: 'pl-PL' };
    return new Intl.NumberFormat(CUR_LOC[state.cur] || LOCALES[state.lang], { style: 'currency', currency: state.cur, minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 }).format(v);
  }
  function applyPrices() { $$('[data-price]').forEach(function (el) { el.textContent = money(parseFloat(el.dataset.price)); }); }
  function applyLang() {
    var dict = I18N[state.lang];
    $$('[data-i18n]').forEach(function (el) { var k = el.dataset.i18n; el.textContent = dict[k] || I18N.en[k]; });
    d.documentElement.lang = state.lang;
    splitHero(false);
  }
  function applyLocale() {
    applyLang(); applyPrices(); renderCart(); updateBundle();
    var sym = { EUR: '€', GBP: '£', CHF: 'CHF', SEK: 'kr', DKK: 'kr', PLN: 'zł', USD: '$', CAD: '$' }[state.cur];
    $$('.loc-txt').forEach(function (el) { el.textContent = state.lang.toUpperCase() + ' · ' + state.cur + ' ' + sym; });
    $$('.loc-flag').forEach(function (el) { el.textContent = FLAGS[state.cur]; });
    $$('.locale__opts').forEach(function (g) {
      $$('button', g).forEach(function (b) { b.classList.toggle('is-on', b.dataset.v === state[g.dataset.k]); });
    });
    try { localStorage.setItem('eg-locale', JSON.stringify(state)); } catch (e) {}
  }
  $$('.locale__opts').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      state[g.dataset.k] = b.dataset.v; applyLocale();
      if (hasGsap) w.ScrollTrigger.refresh();
    });
  });

  /* ---------- Hero title split ---------- */
  function splitEl(el) {
    var t = el.textContent; el.setAttribute('aria-label', t); el.textContent = '';
    t.split(' ').forEach(function (word, wi, arr) {
      var wsp = d.createElement('span'); wsp.style.whiteSpace = 'nowrap'; wsp.style.display = 'inline-block'; wsp.setAttribute('aria-hidden', 'true');
      word.split('').forEach(function (c) { var s = d.createElement('span'); s.className = 'ch'; s.textContent = c; wsp.appendChild(s); });
      el.appendChild(wsp);
      if (wi < arr.length - 1) el.appendChild(d.createTextNode(' '));
    });
  }
  function splitHero(animate) {
    var l1 = $('.hero__l1'), l2 = $('.hero__l2 em');
    splitEl(l1); splitEl(l2);
    if (animate && hasGsap && !reduce) {
      gsap.from($$('.hero__t .ch'), { yPercent: 110, rotate: 8, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.025 });
    }
  }

  /* ---------- Cart ---------- */
  var PRODUCTS = {
    seat: { title: 'ErgoGraphene Seat Cushion', sub: 'Graphite Black', price: 92.95, img: 'images/cushion-sm.webp' },
    cover: { title: 'Spare tech-mesh cover', sub: 'Graphite Black', price: 19, img: '' }
  };
  var cart = {};
  function seatTotal(q) { if (q <= 0) return 0; if (q === 1) return 92.95; if (q === 2) return 167.31; if (q === 3) return 237.02; return +(q * 92.95 * 0.85).toFixed(2); }
  function lineTotal(id, q) { return id === 'seat' ? seatTotal(q) : PRODUCTS[id].price * q; }
  function renderCart() {
    var box = $('.cart__items'); if (!box) return;
    var ids = Object.keys(cart).filter(function (k) { return cart[k] > 0; });
    var count = 0, sum = 0, html = '';
    ids.forEach(function (id) {
      var p = PRODUCTS[id], q = cart[id], t = lineTotal(id, q);
      count += q; sum += t;
      html += '<div class="ci"><' + (p.img ? 'img src="' + p.img + '" alt=""' : 'div class="up__ph"') + '>' + (p.img ? '' : 'MESH</div>') +
        '<div><b>' + p.title + '</b><small>' + p.sub + (id === 'seat' && q > 1 ? ' · bundle saving applied' : '') + '</small>' +
        '<div class="ci__q"><button type="button" data-q="-1" data-id="' + id + '" aria-label="Decrease">−</button><span>' + q + '</span><button type="button" data-q="1" data-id="' + id + '" aria-label="Increase">+</button></div></div>' +
        '<div class="ci__p">' + money(t) + '</div></div>';
    });
    box.innerHTML = html || '<p class="cart__empty">Your cart is empty — your back is waiting.</p>';
    $('.cart__sum').textContent = money(sum);
    var cc = $('.cart-count'); cc.textContent = count;
    var seats = cart.seat || 0, msg = $('.cart__msg'), prog = $('.cart__prog i');
    if (seats >= 3) { msg.innerHTML = 'Free shipping ✓ · <b>Best value unlocked</b> — you save 15%'; prog.style.width = '100%'; }
    else if (seats === 2) { msg.innerHTML = 'Free shipping ✓ · You save 10%. <b>Add 1 more to save 15%</b>'; prog.style.width = '66%'; }
    else { msg.innerHTML = 'Your shipping is <b>free</b>. Add a 2nd seat to save 10%.'; prog.style.width = seats ? '33%' : '0'; }
  }
  function addToCart(id, q) {
    cart[id] = (cart[id] || 0) + q; renderCart();
    var cc = $('.cart-count'); cc.classList.remove('bump'); void cc.offsetWidth; cc.classList.add('bump');
    openDrawer('cart');
  }
  $('.cart__items').addEventListener('click', function (e) {
    var b = e.target.closest('[data-q]'); if (!b) return;
    cart[b.dataset.id] = Math.max(0, (cart[b.dataset.id] || 0) + (+b.dataset.q)); renderCart();
  });
  $$('.up__add').forEach(function (b) { b.addEventListener('click', function () { addToCart(b.dataset.up, 1); }); });

  /* ---------- Drawers ---------- */
  var scrim = $('.scrim');
  function openDrawer(name) {
    closeMenu();
    $$('.drawer').forEach(function (dr) { dr.classList.remove('is-open'); dr.setAttribute('aria-hidden', 'true'); });
    var dr = $('.drawer.' + name); if (!dr) return;
    scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.add('is-on'); });
    dr.classList.add('is-open'); dr.setAttribute('aria-hidden', 'false');
    d.body.classList.add('locked'); if (lenis) lenis.stop();
    var x = $('.x', dr); if (x) setTimeout(function () { x.focus({ preventScroll: true }); }, 50);
  }
  function closeDrawers() {
    $$('.drawer').forEach(function (dr) { dr.classList.remove('is-open'); dr.setAttribute('aria-hidden', 'true'); });
    scrim.classList.remove('is-on'); setTimeout(function () { if (!scrim.classList.contains('is-on')) scrim.hidden = true; }, 400);
    d.body.classList.remove('locked'); if (lenis) lenis.start();
  }
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { openDrawer(b.dataset.open); }); });
  $$('[data-close]').forEach(function (b) { b.addEventListener('click', closeDrawers); });
  scrim.addEventListener('click', closeDrawers);
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDrawers(); closeMenu(); } });

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('.hdr__menu'), mnav = $('.mnav');
  function closeMenu() { mnav.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); mnav.setAttribute('aria-hidden', 'true'); }
  menuBtn.addEventListener('click', function () {
    var open = !mnav.classList.contains('is-open');
    mnav.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', open); mnav.setAttribute('aria-hidden', !open);
    $('.hdr').classList.toggle('menu-open', open);
  });

  /* ---------- Anchor scrolling ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var t = $(id); if (!t) return;
      e.preventDefault(); closeMenu(); closeDrawers();
      if (lenis) lenis.scrollTo(t, { offset: -50, duration: 1.4 }); else t.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- Announcement rotation ---------- */
  (function () {
    var ps = $$('.ann__rot p'), i = 0;
    setInterval(function () {
      var cur = ps[i]; cur.classList.remove('is-on'); cur.classList.add('is-out');
      setTimeout(function () { cur.classList.remove('is-out'); }, 700);
      i = (i + 1) % ps.length; ps[i].classList.add('is-on');
    }, 3800);
  })();

  /* ---------- Shop module ---------- */
  var thumbs = $$('.shop__thumbs button'), mains = $$('.shop__main img');
  thumbs.forEach(function (b, i) {
    b.addEventListener('click', function () {
      thumbs.forEach(function (t) { t.classList.remove('is-on'); }); b.classList.add('is-on');
      mains.forEach(function (m, j) { m.classList.toggle('is-on', i === j); });
    });
  });
  var bundleQty = 1;
  function updateBundle() {
    var tot = seatTotal(bundleQty), full = bundleQty * 92.95;
    var tb = $('.js-total'), cmp = $('.js-compare'), save = $('.js-save'), bp = $('.js-btnprice');
    tb.dataset.price = tot; tb.textContent = money(tot);
    bp.dataset.price = tot; bp.textContent = money(tot);
    if (bundleQty > 1) {
      cmp.hidden = false; cmp.dataset.price = full; cmp.textContent = money(full);
      save.hidden = false; save.textContent = 'Save ' + money(full - tot);
    } else { cmp.hidden = true; save.hidden = true; }
  }
  $$('.bundle input').forEach(function (inp) {
    inp.addEventListener('change', function () {
      $$('.bundle').forEach(function (l) { l.classList.toggle('is-on', l.contains(inp) && inp.checked); });
      bundleQty = +inp.value; updateBundle();
      if (hasGsap && !reduce) gsap.fromTo('.js-total', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'expo.out' });
    });
  });
  $('.js-add').addEventListener('click', function () { addToCart('seat', bundleQty); });
  $('.js-add-sticky').addEventListener('click', function () { addToCart('seat', 1); });

  // delivery estimate (business days from dispatch, dispatch next business day)
  var ETA = { eu: [5, 12], uk: [5, 12], us: [4, 10], au: [5, 12], row: [7, 14] };
  function addBiz(date, n) { var x = new Date(date); while (n > 0) { x.setDate(x.getDate() + 1); var dd = x.getDay(); if (dd && dd !== 6) n--; } return x; }
  function updateEta() {
    var r = ETA[$('.eta__sel').value], now = new Date(), disp = addBiz(now, 1);
    var f = new Intl.DateTimeFormat(LOCALES[state.lang], { day: 'numeric', month: 'short' });
    $('.eta__d').textContent = f.format(addBiz(disp, r[0])) + ' – ' + f.format(addBiz(disp, r[1]));
  }
  $('.eta__sel').addEventListener('change', updateEta);

  /* ---------- Reviews (placeholder content until the review app import) ---------- */
  var REVIEWS = [
    ['Finally, my back stops aching by 3pm', 'I work 9 hours at a cheap desk chair. Within a week the afternoon ache was gone. The warmth is gentle and surprisingly nice.', 'Lena K.', 'Munich, DE', '🇩🇪'],
    ['Lives in my car now', 'Two hours of motorway each day. I no longer slide forward and my lower back thanks me on Friday.', 'Thomas V.', 'Antwerp, BE', '🇧🇪', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=60&auto=format&fit=crop'],
    ['Better than my €600 chair', 'Honestly made my old chair better than the ergonomic one I nearly bought. Mesh stays cool.', 'Sofia R.', 'Milan, IT', '🇮🇹'],
    ['My physio asked where I got it', 'Posture is visibly better on video calls. Strap keeps it in place on my dining chair.', 'Claire D.', 'Lyon, FR', '🇫🇷'],
    ['Gaming marathons, no hunch', 'Long sessions used to wreck my back. The wings hug you without feeling tight.', 'Mateo G.', 'Madrid, ES', '🇪🇸', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=60&auto=format&fit=crop'],
    ['Arrived quicker than promised', 'Shipped to Dublin in 7 days, nicely packed. Worth every euro.', 'Aoife M.', 'Dublin, IE', '🇮🇪'],
    ['Bought a second one for home', 'After a month at the office I ordered the two-pack. The bundle price made it easy.', 'Jonas P.', 'Stockholm, SE', '🇸🇪'],
    ['Light enough to carry everywhere', 'Office, train, sofa. It weighs almost nothing and looks smart, not medical.', 'Emma W.', 'London, UK', '🇬🇧', 'images/lifestyle.jpg'],
    ['The warmth is the secret', 'Did not expect to love the heat so much. Tight muscles just let go.', 'Pieter J.', 'Utrecht, NL', '🇳🇱']
  ];
  function rvHTML(r) {
    var ini = r[2].split(' ').map(function (s) { return s[0]; }).join('');
    return '<article class="rv">' + (r[5] ? '<img src="' + r[5] + '" alt="" loading="lazy">' : '') +
      '<div class="rv__top"><span class="stars">★★★★★</span><span>' + r[4] + '</span></div><h4>' + r[0] + '</h4><p>' + r[1] + '</p>' +
      '<div class="rv__who"><span class="rv__av">' + ini + '</span><span>' + r[2] + '<small>' + r[3] + '</small></span><span class="rv__v">✓ Verified</span></div></article>';
  }
  $$('.revs__run').forEach(function (run, c) {
    var items = REVIEWS.filter(function (_, i) { return i % 3 === c; }), h = items.map(rvHTML).join('');
    run.innerHTML = h + h;
  });

  /* ---------- Seats dial ---------- */
  (function () {
    var tabs = $$('.seats__tabs button'), imgs = $$('.seats__win img'), ps = $$('.seats__desc p'), ring = $('.seats__ring'), bar = $('.seats__bar i');
    var cur = 0, timer, barTw;
    function go(i, user) {
      if (i === cur && !user) return;
      imgs.forEach(function (im) { im.classList.remove('was'); });
      imgs[cur].classList.add('was');
      cur = i;
      tabs.forEach(function (t, j) { t.classList.toggle('is-on', j === i); t.setAttribute('aria-selected', j === i); });
      imgs.forEach(function (im, j) { im.classList.toggle('is-on', j === i); });
      ps.forEach(function (p, j) { p.classList.toggle('is-on', j === i); });
      ring.style.transform = 'rotate(' + (-i * 90) + 'deg)';
      restart();
    }
    function restart() {
      clearTimeout(timer);
      if (hasGsap) { if (barTw) barTw.kill(); barTw = gsap.fromTo(bar, { width: '0%' }, { width: '100%', duration: 5, ease: 'none' }); }
      timer = setTimeout(function () { go((cur + 1) % tabs.length); }, 5000);
    }
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { go(i, true); }); });
    var started = false;
    if ('IntersectionObserver' in w) {
      new IntersectionObserver(function (es) { if (es[0].isIntersecting && !started) { started = true; restart(); } }).observe($('.seats'));
    } else restart();
  })();

  /* ---------- Newsletter ---------- */
  $('.join__f').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.currentTarget, inp = $('input', f);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value)) { f.classList.remove('err'); void f.offsetWidth; f.classList.add('err'); inp.focus(); return; }
    f.hidden = true; $('.join__ok').hidden = false;
  });

  /* ---------- Social proof toast ---------- */
  (function () {
    var t = $('.toast'), who = $('.toast__who'), when = $('.toast__when');
    var P = [['Lena in Munich', 4], ['Thomas in Antwerp', 9], ['Claire in Lyon', 12], ['Jonas in Stockholm', 18], ['Sofia in Milan', 23], ['Aoife in Dublin', 31]], i = 0;
    function show() {
      if (d.body.classList.contains('locked') || d.body.classList.contains('notes-on')) return;
      who.textContent = P[i][0]; when.textContent = P[i][1] + ' minutes ago'; i = (i + 1) % P.length;
      t.classList.add('is-on'); setTimeout(function () { t.classList.remove('is-on'); }, 5000);
    }
    setTimeout(function () { show(); setInterval(show, 22000); }, 14000);
  })();

  /* ---------- Pressure map canvases ---------- */
  function heatColor(v) {
    var stops = [[0, [20, 22, 40]], [.15, [27, 42, 107]], [.35, [46, 139, 208]], [.55, [62, 213, 154]], [.72, [242, 224, 74]], [.86, [240, 138, 44]], [1, [226, 64, 43]]];
    v = Math.max(0, Math.min(1, v));
    for (var i = 1; i < stops.length; i++) {
      if (v <= stops[i][0]) {
        var a = stops[i - 1], b = stops[i], t = (v - a[0]) / (b[0] - a[0]);
        return [a[1][0] + (b[1][0] - a[1][0]) * t, a[1][1] + (b[1][1] - a[1][1]) * t, a[1][2] + (b[1][2] - a[1][2]) * t];
      }
    }
    return stops[stops.length - 1][1];
  }
  function drawPressure(cv, good) {
    var r = cv.getBoundingClientRect(), W = 160, H = Math.round(160 * r.height / r.width);
    cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d'), img = ctx.createImageData(W, H), dt = img.data;
    var cx = W / 2, cy = H * 0.52, sw = W * 0.34, sh = Math.min(H * 0.42, W * 0.4);
    var blobs = good
      ? [[-.42, .05, .5, .55], [.42, .05, .5, .55], [-.5, -.4, .45, .45], [.5, -.4, .45, .45], [0, .45, .55, .35], [-.2, .55, .5, .3], [.2, .55, .5, .3], [0, -.1, .3, .7]]
      : [[-.35, .1, 1, .22], [.35, .1, 1, .22], [0, .55, .8, .18], [-.35, -.35, .35, .3], [.35, -.35, .35, .3]];
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var nx = (x - cx) / sw, ny = (y - cy) / sh, i = (y * W + x) * 4;
      var shape = Math.pow(Math.abs(nx), 2.4) + Math.pow(Math.abs(ny) * (ny > 0 ? 1.05 : 0.95), 2.4);
      if (shape > 1) { dt[i] = 11; dt[i + 1] = 11; dt[i + 2] = 13; dt[i + 3] = 255; continue; }
      var v = 0;
      blobs.forEach(function (b) { var dx = nx - b[0], dy = ny - b[1]; v += b[2] * Math.exp(-(dx * dx + dy * dy) / (2 * b[3] * b[3])); });
      v = good ? v * 0.62 : v;
      v += (Math.sin(x * 1.3 + y * .7) * .5 + .5) * .03;
      var edge = Math.min(1, (1 - shape) * 6);
      var c = heatColor(v * edge);
      dt[i] = c[0]; dt[i + 1] = c[1]; dt[i + 2] = c[2]; dt[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }
  (function () {
    var cmp = $('.press__cmp'), a = $('.press__a'), b = $('.press__b');
    function draw() { drawPressure(a, false); drawPressure(b, true); }
    draw(); w.addEventListener('resize', debounce(draw, 200));
    var drag = false;
    function set(clientX) {
      var r = cmp.getBoundingClientRect(), p = Math.max(4, Math.min(96, (clientX - r.left) / r.width * 100));
      cmp.style.setProperty('--x', p + '%'); cmp.setAttribute('aria-valuenow', Math.round(p));
    }
    cmp.addEventListener('pointerdown', function (e) { drag = true; set(e.clientX); });
    w.addEventListener('pointermove', function (e) { if (drag) set(e.clientX); });
    w.addEventListener('pointerup', function () { drag = false; });
    cmp.addEventListener('keydown', function (e) {
      var v = parseFloat(cmp.style.getPropertyValue('--x')) || 50;
      if (e.key === 'ArrowLeft') v -= 5; else if (e.key === 'ArrowRight') v += 5; else return;
      e.preventDefault(); v = Math.max(4, Math.min(96, v)); cmp.style.setProperty('--x', v + '%'); cmp.setAttribute('aria-valuenow', v);
    });
    cmp._intro = function () {
      if (!hasGsap || reduce) return;
      var o = { v: 85 };
      gsap.to(o, { v: 50, duration: 1.6, ease: 'expo.inOut', onUpdate: function () { cmp.style.setProperty('--x', o.v + '%'); } });
    };
    cmp.style.setProperty('--x', '85%');
  })();

  /* ---------- Hero lattice canvas (warmth follows the cursor) ---------- */
  function lattice() {
    var cv = $('.hero__lattice'), ctx = cv.getContext('2d'), dpr = Math.min(2, w.devicePixelRatio || 1);
    var W, H, pts = [], mx = -999, my = -999, tx = -999, ty = -999, run = true, t0 = 0;
    function resize() {
      W = cv.offsetWidth; H = cv.offsetHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = []; var s = isMobile() ? 34 : 44, h = s * Math.sqrt(3) / 2;
      for (var row = 0, y = 0; y < H + s; y += h, row++) for (var x = (row % 2) * s / 2; x < W + s; x += s) pts.push([x, y]);
    }
    resize(); w.addEventListener('resize', debounce(resize, 200));
    cv.parentElement.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; });
    cv.parentElement.addEventListener('pointerleave', function () { tx = -999; });
    function frame(t) {
      if (!run) return;
      t0 = t / 1000;
      var ax = tx < -900 ? W / 2 + Math.cos(t0 * .5) * W * .28 : tx, ay = tx < -900 ? H * .58 + Math.sin(t0 * .7) * H * .2 : ty;
      mx += (ax - mx) * .08; my += (ay - my) * .08;
      ctx.clearRect(0, 0, W, H);
      var R = Math.max(W, H) * .22;
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i], dx = p[0] - mx, dy = p[1] - my, dist = Math.sqrt(dx * dx + dy * dy), k = Math.max(0, 1 - dist / R);
        var a = .06 + k * .75, rad = 1 + k * 2.6;
        ctx.fillStyle = k > .02 ? 'rgba(255,' + Math.round(122 + (1 - k) * 80) + ',' + Math.round(69 + (1 - k) * 90) + ',' + a + ')' : 'rgba(244,239,232,.07)';
        ctx.beginPath(); ctx.arc(p[0], p[1], rad, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    if ('IntersectionObserver' in w) new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !run) { run = true; requestAnimationFrame(frame); } run = v; }).observe(cv);
    requestAnimationFrame(frame);
  }

  /* ---------- Warm thermal field canvas ---------- */
  function thermal() {
    var sec = $('.warm'), cv = $('.warm__cv'), ctx = cv.getContext('2d');
    var W = 120, H = 80, img, run = false, mx = .5, my = .5, heat = 0;
    function resize() { var r = sec.getBoundingClientRect(); H = Math.round(W * r.height / r.width); cv.width = W; cv.height = H; img = ctx.createImageData(W, H); }
    resize(); w.addEventListener('resize', debounce(resize, 200));
    sec.addEventListener('pointermove', function (e) { var r = sec.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; heat = 1; });
    var pal = [];
    for (var i = 0; i < 256; i++) {
      var v = i / 255, c;
      if (v < .35) c = [18 + v * 60, 8 + v * 20, 6 + v * 14];
      else if (v < .6) { var t = (v - .35) / .25; c = [39 + t * 150, 15 + t * 30, 11 + t * 15]; }
      else if (v < .82) { var t2 = (v - .6) / .22; c = [189 + t2 * 37, 45 + t2 * 40, 26 + t2 * 18]; }
      else { var t3 = (v - .82) / .18; c = [226 + t3 * 29, 85 + t3 * 95, 44 + t3 * 93]; }
      pal.push(c);
    }
    function frame(t) {
      if (!run) return;
      var s = t / 1000, dt = img.data;
      heat += ((sec.matches(':hover') ? 1 : 0) - heat) * .03;
      var src = [
        [.5 + Math.sin(s * .3) * .25, .45 + Math.cos(s * .4) * .2, .22],
        [.25 + Math.cos(s * .23) * .15, .7 + Math.sin(s * .31) * .15, .17],
        [.78 + Math.sin(s * .27) * .12, .3 + Math.cos(s * .21) * .15, .17],
        [mx, my, .14 + heat * .1]
      ];
      var asp = H / W;
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
        var nx = x / W, ny = y / H, v = 0;
        for (var k = 0; k < 4; k++) { var dx = nx - src[k][0], dy = (ny - src[k][1]) * asp, r = src[k][2]; v += Math.exp(-(dx * dx + dy * dy) / (r * r * .35)) * (k === 3 ? .5 + heat * .7 : .6); }
        v += Math.sin(nx * 18 + s) * Math.cos(ny * 14 - s * .8) * .04;
        var c = pal[Math.max(0, Math.min(255, (v * 210) | 0))], i = (y * W + x) * 4;
        dt[i] = c[0]; dt[i + 1] = c[1]; dt[i + 2] = c[2]; dt[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      requestAnimationFrame(frame);
    }
    if ('IntersectionObserver' in w) new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !run) { run = true; requestAnimationFrame(frame); } else run = v; }).observe(sec);
    else { run = true; requestAnimationFrame(frame); }
  }

  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }

  /* ---------- Sit text word split ---------- */
  (function () {
    var p = $('.sit__txt');
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (/^\s+$/.test(part) || !part) frag.appendChild(d.createTextNode(part));
            else { var s = d.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); }
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(p);
  })();

  /* ---------- Footer wordmark split ---------- */
  (function () { var el = $('.ftr__word'), t = el.textContent; el.innerHTML = t.split('').map(function (c) { return '<span class="ch">' + c + '</span>'; }).join(''); })();

  /* ---------- Design notes (?notes=1) ---------- */
  var NOTES = {
    1: ['Announcement bar + region switcher', 'The first thing a European shopper checks is <b>"do you ship to me, in my currency, and can I return it?"</b>. The bar answers all three in rotation, and the region switcher (language + 8 currencies incl. GBP, CHF, SEK, DKK, PLN) maps directly to <b>Shopify Markets</b> + Translate & Adapt — the localisation requirement from the brief.'],
    2: ['Hero — product as the hero', 'DTC brands that convert (Ember, Therabody, Oura) put the <b>product itself centre stage</b>, not a stock photo. The cut-out seat floats in front of an oversized headline, with three callouts naming the only three things that matter. The honeycomb field is graphene\'s real atomic structure — it <b>glows wherever the cursor goes</b>, a quiet metaphor for warmth. Price, rating and CTA are all above the fold.'],
    3: ['Trust ribbon', 'Western shoppers buying from a new brand need <b>reassurance before interest</b>. Free insured shipping, 30-day guarantee, local payment methods (MB WAY for Portugal, Klarna for DE/NL/Nordics) — all real policies from the current store, surfaced instead of buried in the footer.'],
    4: ['The problem — pinned clock', 'Before we sell the solution we make the visitor <b>feel the problem</b>. The ring fills like a working day as you scroll and the sentence lights up word by word, so it\'s read, not skimmed. Classic problem → solution storytelling used by premium DTC landing pages.'],
    5: ['Anatomy scan', 'The client\'s 4-zone infographic is the product\'s strongest argument, but as a static image it\'s easy to scroll past. Here a <b>scan beam sweeps the seat</b> and each zone lights up in sequence with its explanation — turning a spec sheet into a reveal.'],
    6: ['Graphene warmth — interactive thermal field', 'Warmth is the <b>unique selling point</b> no foam cushion has, so it gets its own full-bleed, cinematic moment. The live thermal field reacts to the cursor, which makes an invisible benefit visible. Three glass cards cover the remaining features (mesh, dynamic base).'],
    7: ['Pressure map compare', 'Interactive before/after sliders hold attention ~3× longer than static images. Dragging from "flat chair" to "ErgoGraphene" shows hot-spots spreading out — a <b>visual proof</b> the shopper produces themselves. Marked as illustrative to stay honest.'],
    8: ['Posture journey', 'Turns the store\'s "Week 1 / Week 2 / Week 4" claims into a <b>scroll-driven figure that physically straightens</b> while the spine angle counts down. It sets expectations (reducing returns) and makes the outcome tangible.'],
    9: ['Proof numbers', 'The store already has 96 / 94 / 91 / 97% customer-feedback stats. We give them <b>weight and hierarchy</b> in a bento grid with animated gauges, leading with the strongest number.'],
    10: ['Every seat — rotating dial', 'Answers "will it fit my chair?" — the #1 pre-purchase objection — <b>visually</b>. The dial rotates through office, car, gaming and home; it also expands the buyer\'s mental use-cases, which feeds the 2- and 3-pack bundles.'],
    11: ['Buy box on the homepage', 'With a single hero product, sending people to another page costs conversions. This is a <b>full product page inside the homepage</b>: gallery, bundle tiers (AOV upsell), live delivery-date estimate, local payment badges, and accordions for shipping / returns. Every CTA on the page lands here.'],
    12: ['Reviews wall', 'An endless, moving wall of reviews from across Europe <b>feels like a crowd</b>, not a quote. Country flags signal "people like me in my country bought this". Built to be fed by Judge.me / Loox / Okendo. <b>Review text, rating and count here are placeholders</b> until the real reviews are imported.'],
    13: ['Honest comparison', 'Shoppers are comparing tabs anyway — we <b>frame the comparison for them</b>. Our column is highlighted in ember so the eye reads it as the winner; partial ticks (~) keep it credible rather than salesy.'],
    14: ['30-day guarantee seal', 'Risk reversal right before the FAQ removes the final hesitation. The rotating seal reads like a <b>stamp of commitment</b>, and the 3 steps show how simple a return is.'],
    15: ['FAQ', 'Every answer comes from the real store policies. A sticky heading with a <b>human support email</b> beside the questions builds trust for a new brand.'],
    16: ['Email capture + footer', '10% off for an email recovers visitors who are not ready to buy today (Klaviyo flow). The giant wordmark ends the page on <b>brand</b>, and payment badges repeat once more at the point of decision.']
  };
  if (/[?&]notes=1/.test(location.search)) {
    var panel = $('.notes'), keys = Object.keys(NOTES).map(Number), cur = 0;
    d.body.classList.add('notes-on');
    function show(i) {
      cur = (i + keys.length) % keys.length; var k = keys[cur], n = NOTES[k];
      $('.notes__k', panel).textContent = 'Why this layout · ' + k + ' / ' + keys.length;
      $('.notes__t', panel).textContent = n[0]; $('.notes__b', panel).innerHTML = n[1];
      panel.hidden = false;
      $$('.is-noted').forEach(function (e) { e.classList.remove('is-noted'); });
      var el = $('[data-note="' + k + '"]'); if (el) el.classList.add('is-noted');
    }
    function jump(i) { show(i); var el = $('[data-note="' + keys[cur] + '"]'); if (el) { if (lenis) lenis.scrollTo(el, { offset: -40 }); else el.scrollIntoView({ behavior: 'smooth' }); } }
    $$('[data-note]').forEach(function (el) {
      var pin = d.createElement('button'); pin.type = 'button'; pin.className = 'note-pin'; pin.textContent = el.dataset.note; pin.setAttribute('aria-label', 'Design note ' + el.dataset.note);
      pin.addEventListener('click', function (e) { e.stopPropagation(); show(keys.indexOf(+el.dataset.note)); });
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.appendChild(pin);
    });
    $('.notes__next', panel).addEventListener('click', function () { jump(cur + 1); });
    $('.notes__prev', panel).addEventListener('click', function () { jump(cur - 1); });
    $('.notes__x', panel).addEventListener('click', function () { panel.hidden = true; });
    show(0);
  }

  /* ---------- Init locale ---------- */
  applyLocale(); updateEta();

  /* =========================================================
     Motion (GSAP)
     ========================================================= */
  lattice(); thermal();

  if (!hasGsap) { $('.loader').classList.add('done'); $('.sit__txt').style.opacity = 1; return; }
  gsap.registerPlugin(ScrollTrigger);

  if (!reduce && typeof w.Lenis !== 'undefined') {
    lenis = new w.Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Loader → hero intro
  var loaderNum = $('.loader__num'), tmp = { v: 21 };
  if (lenis) lenis.stop();
  var intro = gsap.timeline({ paused: false });
  intro.to(tmp, { v: 38.5, duration: reduce ? .1 : 1.5, ease: 'power2.inOut', onUpdate: function () { loaderNum.textContent = tmp.v.toFixed(1); } })
    .to('.loader', { yPercent: -100, duration: reduce ? .1 : 1, ease: 'expo.inOut', onComplete: function () { $('.loader').classList.add('done'); if (lenis) lenis.start(); } }, '+=.15')
    .add(function () { splitHero(true); }, '-=.55')
    .from('.hero__img', { y: 120, scale: .8, opacity: 0, duration: 1.6, ease: 'expo.out' }, '-=.5')
    .from('.hero__ring', { scale: .6, opacity: 0, duration: 1.6, ease: 'expo.out' }, '<')
    .from('.callout', { opacity: 0, x: function (i) { return i === 0 ? -30 : 30; }, duration: 1, stagger: .12, ease: 'expo.out' }, '-=1')
    .from(['.hero__k', '.hero__p', '.hero__buy', '.hero__proof'], { y: 30, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out' }, '-=1.1');

  // Hero mouse tilt
  if (fine && !reduce) {
    var img = $('.hero__img'), xTo = gsap.quickTo(img, 'rotationY', { duration: .8, ease: 'power3' }), yTo = gsap.quickTo(img, 'rotationX', { duration: .8, ease: 'power3' });
    $('.hero').addEventListener('pointermove', function (e) { var r = this.getBoundingClientRect(); xTo(((e.clientX - r.left) / r.width - .5) * 16); yTo(-((e.clientY - r.top) / r.height - .5) * 10); });
    // magnetic buttons
    $$('.magnetic').forEach(function (b) {
      var bx = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' }), by = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
      b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); bx((e.clientX - r.left - r.width / 2) * .25); by((e.clientY - r.top - r.height / 2) * .35); });
      b.addEventListener('pointerleave', function () { bx(0); by(0); });
    });
  }
  // hero scroll-out
  gsap.to('.hero__stage', { yPercent: 18, scale: .92, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__t', { yPercent: -40, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // header state
  var hdr = $('.hdr');
  ScrollTrigger.create({ start: 80, end: 'max', onToggle: function (s) { hdr.classList.toggle('is-solid', s.isActive); } });
  $$('.hero, .sit, .warm, .proof, .vs, .join, .ftr').forEach(function (sec) {
    ScrollTrigger.create({ trigger: sec, start: 'top 40px', end: 'bottom 40px', onToggle: function (s) { if (s.isActive) hdr.classList.add('on-dark'); else if (!$$('.hero, .sit, .warm, .proof, .vs, .join, .ftr').some(function (x) { var r = x.getBoundingClientRect(); return r.top <= 40 && r.bottom >= 40; })) hdr.classList.remove('on-dark'); } });
  });

  // sticky buy bar
  var sticky = $('.sticky');
  function stickyCheck() {
    var heroB = $('.hero').getBoundingClientRect().bottom, shop = $('.shop').getBoundingClientRect(), foot = $('.join').getBoundingClientRect().top;
    var on = heroB < 0 && !(shop.top < w.innerHeight * .8 && shop.bottom > 0) && foot > w.innerHeight * .9;
    sticky.classList.toggle('is-on', on); sticky.setAttribute('aria-hidden', !on);
  }
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: stickyCheck });

  // generic reveals
  $$('.h2, .seal__t, .join__t').forEach(function (h) {
    gsap.from(h, { y: 60, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
  });
  $$('.kicker').filter(function (k) { return !k.closest('.shop__info'); }).forEach(function (k) { gsap.from(k, { x: -20, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: k, start: 'top 90%' } }); });

  var mm = gsap.matchMedia();

  // SIT — pinned clock
  (function () {
    var num = $('.sit__num'), words = $$('.sit__txt .w'), o = { h: 0 };
    var tl = gsap.timeline({ scrollTrigger: { trigger: '.sit', start: 'top top', end: '+=180%', pin: '.sit__pin', scrub: .6 } });
    tl.to('.sit__bg img', { scale: 1, opacity: .45, ease: 'none', duration: 1 }, 0)
      .to('.sit__clock .arc', { strokeDashoffset: 565.5 * (1 - 9 / 12), ease: 'none', duration: .45 }, 0)
      .to(o, { h: 9, ease: 'none', duration: .45, onUpdate: function () { num.textContent = Math.round(o.h); } }, 0)
      .to('.sit__clock', { scale: 2.2, opacity: 0, ease: 'power2.in', duration: .25 }, .5)
      .to('.sit__txt', { opacity: 1, duration: .05 }, .6)
      .to({}, { duration: .4, onUpdate: function () { var p = this.progress(), n = Math.round(p * words.length); words.forEach(function (wd, i) { wd.classList.toggle('lit', i < n); }); } }, .6);
  })();

  // SCAN — pinned beam + zones
  (function () {
    var lis = $$('.scan__list li'), zones = $$('.zone'), zl = $('.scan__zl'), pct = $('.scan__pct'), last = -1;
    function setZone(i) {
      if (i === last) return; last = i;
      lis.forEach(function (l, j) { l.classList.toggle('is-on', j === i); });
      zones.forEach(function (z, j) { z.classList.toggle('is-on', j <= i); });
      zl.textContent = 'ABCD'[i];
    }
    setZone(0);
    gsap.timeline({
      scrollTrigger: {
        trigger: '.scan', start: 'top top', end: '+=220%', pin: '.scan__pin', scrub: .5,
        onUpdate: function (s) { var i = Math.min(3, Math.floor(s.progress * 4)); setZone(i); pct.textContent = Math.round(s.progress * 100) + '%'; }
      }
    }).fromTo('.scan__beam', { top: '0%' }, { top: '100%', ease: 'none' })
      .fromTo('.scan__stage img', { scale: .94 }, { scale: 1.04, ease: 'none' }, 0);
  })();

  // WARM — title + cards
  gsap.from('.warm__t', { scale: .85, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.warm', start: 'top 60%' } });
  gsap.from('.wcard', { y: 80, opacity: 0, duration: 1.2, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.warm__cards', start: 'top 90%' } });

  // PRESS — slider intro
  ScrollTrigger.create({ trigger: '.press__cmp', start: 'top 70%', once: true, onEnter: function () { $('.press__cmp')._intro(); } });
  gsap.from('.press__cmp', { y: 80, rotateX: 12, opacity: 0, transformPerspective: 1200, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.press__cmp', start: 'top 90%' } });

  // JOURNEY — posture morph
  (function () {
    var spine = $('.j-spine'), body = $('.j-body'), head = $('.j-head'), leg = $('.j-leg'), arm = $('.j-arm'), seat = $('.j-seat path');
    var num = $('.j-num'), st = $('.j-state'), weeks = $$('.week'), bar = $('.journey__bar i');
    var A = { hip: [222, 296], c1: [292, 250], c2: [252, 150], sh: [200, 138], hd: [176, 100], deg: 24 };
    var B = { hip: [262, 292], c1: [282, 236], c2: [264, 168], sh: [258, 118], hd: [254, 72], deg: 4 };
    function L(a, b, t) { return a + (b - a) * t; }
    function P(k, t) { return [L(A[k][0], B[k][0], t), L(A[k][1], B[k][1], t)]; }
    function render(t) {
      var hip = P('hip', t), c1 = P('c1', t), c2 = P('c2', t), sh = P('sh', t), hd = P('hd', t);
      var dpath = 'M' + hip + ' C' + c1 + ' ' + c2 + ' ' + sh;
      spine.setAttribute('d', dpath); body.setAttribute('d', dpath);
      head.setAttribute('cx', hd[0]); head.setAttribute('cy', hd[1]);
      leg.setAttribute('d', 'M' + hip + ' L 104 300 L 104 400');
      arm.setAttribute('d', 'M' + sh + ' L ' + (sh[0] - 26) + ' 222 L ' + (sh[0] - 96) + ' 226');
      var deg = Math.round(L(A.deg, B.deg, t));
      num.textContent = deg + '°';
      st.textContent = t < .35 ? 'slouched' : t < .75 ? 'improving' : 'aligned';
    }
    render(0);
    var o = { t: 0 };
    var weekIdx = -1;
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.journey', start: 'top top', end: '+=200%', pin: '.journey__pin', scrub: .6,
        onUpdate: function (s) {
          var i = Math.min(3, Math.floor(s.progress * 4));
          if (i !== weekIdx) { weekIdx = i; weeks.forEach(function (wk, j) { wk.classList.toggle('is-on', j === i); }); }
        }
      }
    });
    tl.to(seat, { opacity: 1, duration: .15 }, 0)
      .to(o, { t: 1, duration: 1, ease: 'none', onUpdate: function () { render(o.t); } }, 0)
      .to(bar, { scaleX: 1, duration: 1, ease: 'none' }, 0);
    weeks[0].classList.add('is-on');
  })();

  // PROOF gauges
  $$('.gauge').forEach(function (g, i) {
    var v = +g.dataset.v, odo = $('.odo', g), o = { n: 0 };
    ScrollTrigger.create({
      trigger: g, start: 'top 85%', once: true, onEnter: function () {
        gsap.to($('.gv', g), { strokeDashoffset: 326.7 * (1 - v / 100), duration: 2, delay: i * .12, ease: 'expo.out' });
        gsap.to(o, { n: v, duration: 2, delay: i * .12, ease: 'expo.out', onUpdate: function () { odo.textContent = Math.round(o.n); } });
      }
    });
  });
  gsap.from('.gauge', { y: 60, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.proof__grid', start: 'top 85%' } });

  // SEATS dial entrance
  gsap.from('.seats__dial', { rotate: -40, scale: .8, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.seats', start: 'top 75%' } });

  // SHOP entrance
  gsap.from('.shop__info > *', { y: 40, opacity: 0, duration: 1, stagger: .05, ease: 'expo.out', scrollTrigger: { trigger: '.shop', start: 'top 70%' } });
  gsap.from('.shop__main', { clipPath: 'inset(20% 20% 20% 20% round 28px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.shop', start: 'top 75%' } });

  // REVIEWS bars
  ScrollTrigger.create({ trigger: '.revs', start: 'top 70%', once: true, onEnter: function () { $('.revs').classList.add('in'); } });

  // VS rows + ticks
  gsap.from('.vs__row', { opacity: 0, y: 24, duration: .9, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: '.vs__table', start: 'top 80%' } });
  gsap.from('.vs .y', { '--s': 0, duration: .8, stagger: .06, ease: 'back.out(3)', scrollTrigger: { trigger: '.vs__table', start: 'top 70%' } });

  // SEAL
  gsap.from('.seal__badge', { scale: .4, rotate: -120, opacity: 0, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.seal', start: 'top 75%' } });
  gsap.from('.seal__steps li', { y: 30, opacity: 0, duration: 1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.seal__steps', start: 'top 90%' } });

  // FAQ
  gsap.from('.faq details', { y: 30, opacity: 0, duration: 1, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: '.faq__list', start: 'top 85%' } });

  // FOOTER wordmark wave
  gsap.from('.ftr__word .ch', { yPercent: 100, opacity: 0, duration: 1.2, stagger: .04, ease: 'expo.out', scrollTrigger: { trigger: '.ftr__word', start: 'top 95%' } });

  mm.add('(max-width: 760px)', function () { /* reserved for mobile-specific tweaks */ });

  w.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
