/* =========================================================
   ErgoGraphene — homepage concept v2 interactions
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
  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }

  /* ---------- Locale: language + currency ---------- */
  var RATES = { EUR: 1, GBP: 0.86, CHF: 0.94, SEK: 11.4, DKK: 7.46, PLN: 4.3, USD: 1.08, CAD: 1.5 };
  var LOCALES = { en: 'en-IE', de: 'de-DE', fr: 'fr-FR', it: 'it-IT', es: 'es-ES' };
  var CUR_LOC = { GBP: 'en-GB', USD: 'en-US', CAD: 'en-CA', CHF: 'de-CH', SEK: 'sv-SE', DKK: 'da-DK', PLN: 'pl-PL' };
  var FLAGS = { EUR: '🇪🇺', GBP: '🇬🇧', CHF: '🇨🇭', SEK: '🇸🇪', DKK: '🇩🇰', PLN: '🇵🇱', USD: '🇺🇸', CAD: '🇨🇦' };
  var I18N = {
    en: {},
    de: {
      ann1: 'Kostenloser weltweiter Versand — ohne Mindestbestellwert, jedes Paket versichert', ann2: '30 Tage Komfort-Garantie · kostenlose Rücksendung', ann3: 'Bezahlen mit PayPal, Apple Pay, Google Pay, Shop Pay oder MB WAY',
      nav_shop: 'Jetzt kaufen', nav_science: 'Die Wissenschaft', nav_reviews: 'Bewertungen', nav_about: 'Über uns', nav_faq: 'FAQ',
      hero_k: 'Ergonomischer Halt mit Graphen', hero_t1: 'Klüger sitzen,', hero_t2: 'besser fühlen',
      hero_p: 'Graphen-verstärkter Halt, der die Haltung verbessert, Zusammensacken reduziert und den Rücken bei langem Sitzen entlastet.',
      cta_shop: 'Rückenschmerzen jetzt lindern', cta_science: 'So unterstützt es', add: 'In den Warenkorb',
      s_scan: '4-Zonen-ergonomische', s_warm: 'Graphen-Wissenschaft,', s_seal: 'Wir stehen hinter', s_faq: 'Häufig gestellte'
    },
    fr: {
      ann1: 'Livraison gratuite dans le monde — sans minimum, chaque colis assuré', ann2: 'Garantie confort 30 jours · retours gratuits', ann3: 'Payez avec PayPal, Apple Pay, Google Pay, Shop Pay ou MB WAY',
      nav_shop: 'Acheter', nav_science: 'La science', nav_reviews: 'Avis', nav_about: 'À propos', nav_faq: 'FAQ',
      hero_k: 'Soutien ergonomique au graphène', hero_t1: 'Asseyez-vous mieux,', hero_t2: 'sentez-vous mieux',
      hero_p: 'Un soutien enrichi au graphène pour améliorer la posture, réduire l’affaissement et soulager le dos pendant les longues heures assises.',
      cta_shop: 'Soulager mon dos maintenant', cta_science: 'Comment ça soutient', add: 'Ajouter au panier',
      s_scan: 'Alignement ergonomique', s_warm: 'La science du graphène,', s_seal: 'Nous garantissons', s_faq: 'Questions'
    },
    it: {
      ann1: 'Spedizione gratuita in tutto il mondo — senza minimo, ogni pacco assicurato', ann2: 'Garanzia comfort 30 giorni · resi gratuiti', ann3: 'Paga con PayPal, Apple Pay, Google Pay, Shop Pay o MB WAY',
      nav_shop: 'Acquista', nav_science: 'La scienza', nav_reviews: 'Recensioni', nav_about: 'Chi siamo', nav_faq: 'FAQ',
      hero_k: 'Supporto ergonomico al grafene', hero_t1: 'Siediti meglio,', hero_t2: 'stai meglio',
      hero_p: 'Supporto potenziato al grafene per migliorare la postura, ridurre l’ingobbimento e alleviare la pressione sulla schiena.',
      cta_shop: 'Allevia il mal di schiena ora', cta_science: 'Come ti sostiene', add: 'Aggiungi al carrello',
      s_scan: 'Allineamento ergonomico', s_warm: 'La scienza del grafene,', s_seal: 'Garantiamo', s_faq: 'Domande'
    },
    es: {
      ann1: 'Envío gratis a todo el mundo — sin mínimo, cada paquete asegurado', ann2: 'Garantía de confort de 30 días · devoluciones gratis', ann3: 'Paga con PayPal, Apple Pay, Google Pay, Shop Pay o MB WAY',
      nav_shop: 'Comprar', nav_science: 'La ciencia', nav_reviews: 'Opiniones', nav_about: 'Nosotros', nav_faq: 'FAQ',
      hero_k: 'Soporte ergonómico con grafeno', hero_t1: 'Siéntate mejor,', hero_t2: 'siéntete mejor',
      hero_p: 'Soporte con grafeno diseñado para mejorar la postura, reducir el encorvamiento y aliviar la presión en la espalda.',
      cta_shop: 'Alivia mi dolor de espalda', cta_science: 'Cómo te sostiene', add: 'Añadir al carrito',
      s_scan: 'Alineación ergonómica', s_warm: 'La ciencia del grafeno,', s_seal: 'Respaldamos', s_faq: 'Preguntas'
    }
  };
  var state = { lang: 'en', cur: 'EUR' };
  try { var saved = JSON.parse(localStorage.getItem('eg-locale') || 'null'); if (saved && RATES[saved.cur] && I18N[saved.lang]) state = saved; } catch (e) {}
  $$('[data-i18n]').forEach(function (el) { var k = el.dataset.i18n; if (!I18N.en[k]) I18N.en[k] = el.textContent; });

  function money(eur) {
    var v = eur * RATES[state.cur], whole = ['SEK', 'DKK', 'PLN'].indexOf(state.cur) > -1;
    if (whole) v = Math.round(v / 5) * 5; else if (state.cur !== 'EUR') v = Math.ceil(v) - 0.05;
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
    applyLang(); applyPrices(); renderCart(); updateBundle(); updateEta();
    var sym = { EUR: '€', GBP: '£', CHF: 'CHF', SEK: 'kr', DKK: 'kr', PLN: 'zł', USD: '$', CAD: '$' }[state.cur];
    $$('.loc-txt').forEach(function (el) { el.textContent = state.lang.toUpperCase() + ' · ' + state.cur + ' ' + sym; });
    $$('.loc-flag').forEach(function (el) { el.textContent = FLAGS[state.cur]; });
    $$('.locale__opts').forEach(function (g) { $$('button', g).forEach(function (b) { b.classList.toggle('is-on', b.dataset.v === state[g.dataset.k]); }); });
    try { localStorage.setItem('eg-locale', JSON.stringify(state)); } catch (e) {}
  }
  $$('.locale__opts').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      state[g.dataset.k] = b.dataset.v; applyLocale();
      if (hasGsap) ScrollTrigger.refresh();
    });
  });

  /* ---------- Split helpers ---------- */
  function splitChars(el) {
    var t = el.textContent; el.setAttribute('aria-label', t); el.textContent = '';
    t.split(' ').forEach(function (word, wi, arr) {
      var wsp = d.createElement('span'); wsp.style.whiteSpace = 'nowrap'; wsp.style.display = 'inline-block'; wsp.setAttribute('aria-hidden', 'true');
      word.split('').forEach(function (c) { var s = d.createElement('span'); s.className = 'ch'; s.textContent = c; wsp.appendChild(s); });
      el.appendChild(wsp);
      if (wi < arr.length - 1) el.appendChild(d.createTextNode(' '));
    });
  }
  function splitHero(animate) {
    splitChars($('.hero__l1')); splitChars($('.hero__l2 em'));
    if (animate && hasGsap && !reduce) gsap.from($$('.hero__t .ch'), { yPercent: 110, rotate: 8, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.025 });
  }

  /* ---------- Cart ---------- */
  var PRODUCTS = { seat: { title: 'Lumbar Support Seat Cushion', sub: 'ErgoGraphene · Black tech-mesh', img: 'images/cushion-sm.webp' } };
  var cart = {};
  function seatTotal(q) { if (q <= 0) return 0; if (q === 1) return 92.95; if (q === 2) return 167.31; if (q === 3) return 237.02; return +(q * 92.95 * 0.85).toFixed(2); }
  function renderCart() {
    var box = $('.cart__items'), q = cart.seat || 0, t = seatTotal(q), p = PRODUCTS.seat;
    box.innerHTML = q ? '<div class="ci"><img src="' + p.img + '" alt=""><div><b>' + p.title + '</b><small>' + p.sub + (q > 1 ? ' · bundle saving applied' : '') + '</small><div class="ci__q"><button type="button" data-q="-1" aria-label="Decrease">−</button><span>' + q + '</span><button type="button" data-q="1" aria-label="Increase">+</button></div></div><div class="ci__p">' + money(t) + '</div></div>' : '<p class="cart__empty">Your cart is empty — your back is waiting.</p>';
    $('.cart__sum').textContent = money(t);
    $('.cart-count').textContent = q;
    var msg = $('.cart__msg'), prog = $('.cart__prog i');
    if (q >= 3) { msg.innerHTML = 'Free shipping ✓ · <b>Best value unlocked</b> — you save 15%'; prog.style.width = '100%'; }
    else if (q === 2) { msg.innerHTML = 'Free shipping ✓ · You save 10%. <b>Add 1 more to save 15%</b>'; prog.style.width = '66%'; }
    else { msg.innerHTML = 'Your shipping is <b>free</b>. Add a 2nd cushion to save 10%.'; prog.style.width = q ? '33%' : '0'; }
  }
  function addToCart(n) {
    cart.seat = (cart.seat || 0) + n; renderCart();
    var cc = $('.cart-count'); cc.classList.remove('bump'); void cc.offsetWidth; cc.classList.add('bump');
    openDrawer('cart');
  }
  $('.cart__items').addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (!b) return; cart.seat = Math.max(0, (cart.seat || 0) + (+b.dataset.q)); renderCart(); });
  $$('.up__add').forEach(function (b) { b.addEventListener('click', function () { addToCart(1); }); });

  /* ---------- Drawers & menu ---------- */
  var scrim = $('.scrim'), menuBtn = $('.hdr__menu'), mnav = $('.mnav');
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
  function closeMenu() { mnav.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); mnav.setAttribute('aria-hidden', 'true'); }
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { openDrawer(b.dataset.open); }); });
  $$('[data-close]').forEach(function (b) { b.addEventListener('click', closeDrawers); });
  scrim.addEventListener('click', closeDrawers);
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDrawers(); closeMenu(); } });
  menuBtn.addEventListener('click', function () {
    var open = !mnav.classList.contains('is-open');
    mnav.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', open); mnav.setAttribute('aria-hidden', !open);
  });
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var t = $(id); if (!t) return;
      e.preventDefault(); closeMenu(); closeDrawers();
      if (lenis) lenis.scrollTo(t, { offset: -40, duration: 1.4 }); else t.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- Announcement ---------- */
  (function () {
    var ps = $$('.ann__rot p'), i = 0;
    setInterval(function () {
      var cur = ps[i]; cur.classList.remove('is-on'); cur.classList.add('is-out');
      setTimeout(function () { cur.classList.remove('is-out'); }, 700);
      i = (i + 1) % ps.length; ps[i].classList.add('is-on');
    }, 3800);
  })();

  /* ---------- Shop ---------- */
  var thumbs = $$('.shop__thumbs button'), mains = $$('.shop__main img');
  thumbs.forEach(function (b, i) { b.addEventListener('click', function () { thumbs.forEach(function (t) { t.classList.remove('is-on'); }); b.classList.add('is-on'); mains.forEach(function (m, j) { m.classList.toggle('is-on', i === j); }); }); });
  var bundleQty = 1;
  function updateBundle() {
    var tot = seatTotal(bundleQty), full = bundleQty * 92.95, tb = $('.js-total'), cmp = $('.js-compare'), save = $('.js-save'), bp = $('.js-btnprice');
    tb.dataset.price = tot; tb.textContent = money(tot); bp.dataset.price = tot; bp.textContent = money(tot);
    if (bundleQty > 1) { cmp.hidden = false; cmp.dataset.price = full; cmp.textContent = money(full); save.hidden = false; save.textContent = 'Save ' + money(full - tot); }
    else { cmp.hidden = true; save.hidden = true; }
  }
  $$('.bundle input').forEach(function (inp) {
    inp.addEventListener('change', function () {
      $$('.bundle').forEach(function (l) { l.classList.toggle('is-on', l.contains(inp) && inp.checked); });
      bundleQty = +inp.value; updateBundle();
      if (hasGsap && !reduce) gsap.fromTo('.js-total', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'expo.out' });
    });
  });
  $('.js-add').addEventListener('click', function () { addToCart(bundleQty); });
  $('.js-add-sticky').addEventListener('click', function () { addToCart(1); });
  var ETA = { eu: [5, 12], uk: [5, 12], us: [4, 10], au: [5, 12], as: [3, 7], row: [7, 14] };
  function addBiz(date, n) { var x = new Date(date); while (n > 0) { x.setDate(x.getDate() + 1); var dd = x.getDay(); if (dd && dd !== 6) n--; } return x; }
  function updateEta() {
    var r = ETA[$('.eta__sel').value], disp = addBiz(new Date(), 1), f = new Intl.DateTimeFormat(LOCALES[state.lang], { day: 'numeric', month: 'short' });
    $('.eta__d').textContent = f.format(addBiz(disp, r[0])) + ' – ' + f.format(addBiz(disp, r[1]));
  }
  $('.eta__sel').addEventListener('change', updateEta);

  /* ---------- FAQ tabs ---------- */
  $$('.faq__tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.faq__tabs button').forEach(function (x) { x.classList.toggle('is-on', x === b); });
      var f = b.dataset.f;
      $$('.faq__list details').forEach(function (dt) { dt.classList.toggle('hide', f !== 'all' && dt.dataset.c !== f); });
      if (hasGsap && !reduce) gsap.fromTo('.faq__list details:not(.hide)', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .05, ease: 'expo.out' });
      if (hasGsap) ScrollTrigger.refresh();
    });
  });

  /* ---------- Seats dial ---------- */
  (function () {
    var tabs = $$('.seats__tabs button'), imgs = $$('.seats__win img'), ps = $$('.seats__desc p'), ring = $('.seats__ring'), bar = $('.seats__bar i'), cur = 0, timer, barTw;
    function go(i) {
      imgs.forEach(function (im) { im.classList.remove('was'); }); imgs[cur].classList.add('was'); cur = i;
      tabs.forEach(function (t, j) { t.classList.toggle('is-on', j === i); t.setAttribute('aria-selected', j === i); });
      imgs.forEach(function (im, j) { im.classList.toggle('is-on', j === i); });
      ps.forEach(function (p, j) { p.classList.toggle('is-on', j === i); });
      ring.style.transform = 'rotate(' + (-i * 90) + 'deg)'; restart();
    }
    function restart() {
      clearTimeout(timer);
      if (hasGsap) { if (barTw) barTw.kill(); barTw = gsap.fromTo(bar, { width: '0%' }, { width: '100%', duration: 5, ease: 'none' }); }
      timer = setTimeout(function () { go((cur + 1) % tabs.length); }, 5000);
    }
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { go(i); }); });
    var started = false;
    new IntersectionObserver(function (es) { if (es[0].isIntersecting && !started) { started = true; restart(); } }).observe($('.seats'));
  })();

  /* ---------- Why panels ---------- */
  (function () {
    var ps = $$('.wp'), cur = 0, timer, hover = false, vis = false;
    function set(i) { cur = i; ps.forEach(function (p, j) { p.classList.toggle('is-on', j === i); }); }
    ps.forEach(function (p, i) {
      p.addEventListener('click', function () { set(i); });
      p.addEventListener('mouseenter', function () { if (fine) set(i); hover = true; });
      p.addEventListener('mouseleave', function () { hover = false; });
    });
    function tick() { if (vis && !hover) set((cur + 1) % ps.length); timer = setTimeout(tick, 4200); }
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }, { threshold: .4 }).observe($('.why__panels'));
    timer = setTimeout(tick, 4200);
  })();

  /* ---------- Before / after ---------- */
  (function () {
    var cmp = $('.ba__cmp'), deg = $('.ba__deg'), drag = false;
    function setX(p) {
      p = Math.max(3, Math.min(97, p)); cmp.style.setProperty('--x', p + '%'); cmp.setAttribute('aria-valuenow', Math.round(p));
      deg.textContent = p > 50 ? 'Slouched' : 'Aligned'; deg.style.color = p > 50 ? '#c8402f' : '';
    }
    function fromEvt(e) { var r = cmp.getBoundingClientRect(); setX((e.clientX - r.left) / r.width * 100); }
    cmp.addEventListener('pointerdown', function (e) { drag = true; fromEvt(e); });
    w.addEventListener('pointermove', function (e) { if (drag) fromEvt(e); });
    w.addEventListener('pointerup', function () { drag = false; });
    cmp.addEventListener('keydown', function (e) {
      var v = parseFloat(cmp.style.getPropertyValue('--x')) || 50;
      if (e.key === 'ArrowLeft') v -= 5; else if (e.key === 'ArrowRight') v += 5; else return;
      e.preventDefault(); setX(v);
    });
    setX(88);
    cmp._intro = function () {
      if (!hasGsap || reduce) { setX(50); return; }
      var o = { v: 88 };
      gsap.timeline().to(o, { v: 14, duration: 1.6, ease: 'expo.inOut', onUpdate: function () { setX(o.v); } }).to(o, { v: 50, duration: 1.2, ease: 'expo.inOut', onUpdate: function () { setX(o.v); } });
    };
  })();

  /* ---------- Hero lattice (graphene) ---------- */
  function lattice() {
    var cv = $('.hero__lattice'), ctx = cv.getContext('2d'), dpr = Math.min(2, w.devicePixelRatio || 1);
    var W, H, pts = [], mx = -999, my = -999, tx = -999, ty = -999, run = true;
    function resize() {
      W = cv.offsetWidth; H = cv.offsetHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = []; var s = isMobile() ? 30 : 40, h = s * Math.sqrt(3) / 2;
      for (var row = 0, y = 0; y < H + s; y += h, row++) for (var x = (row % 2) * s / 2; x < W + s; x += s) pts.push([x, y]);
    }
    resize(); w.addEventListener('resize', debounce(resize, 200));
    cv.parentElement.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; });
    cv.parentElement.addEventListener('pointerleave', function () { tx = -999; });
    function frame(t) {
      if (!run) return;
      var s = t / 1000, ax = tx < -900 ? W / 2 + Math.cos(s * .45) * W * .3 : tx, ay = tx < -900 ? H * .6 + Math.sin(s * .6) * H * .22 : ty;
      mx += (ax - mx) * .08; my += (ay - my) * .08;
      ctx.clearRect(0, 0, W, H);
      var R = Math.max(W, H) * .2;
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i], dx = p[0] - mx, dy = p[1] - my, k = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / R);
        ctx.fillStyle = k > .02 ? 'rgba(' + Math.round(108 + k * 120) + ',' + Math.round(194 + k * 50) + ',255,' + (.08 + k * .8) + ')' : 'rgba(220,236,255,.07)';
        ctx.beginPath(); ctx.arc(p[0], p[1], 1 + k * 2.4, 0, 6.283); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !run) { run = true; requestAnimationFrame(frame); } run = v; }).observe(cv);
    requestAnimationFrame(frame);
  }

  /* ---------- Far-infrared thermal field ---------- */
  function thermal() {
    var sec = $('.warm'), cv = $('.warm__cv'), ctx = cv.getContext('2d'), W = 120, H = 80, img, run = false, mx = .5, my = .55, heat = 0, over = false;
    function resize() { var r = sec.getBoundingClientRect(); H = Math.max(40, Math.round(W * r.height / r.width)); cv.width = W; cv.height = H; img = ctx.createImageData(W, H); }
    resize(); w.addEventListener('resize', debounce(resize, 200));
    sec.addEventListener('pointermove', function (e) { var r = sec.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; over = true; });
    sec.addEventListener('pointerleave', function () { over = false; });
    var stops = [[0, [5, 8, 15]], [.32, [14, 26, 54]], [.5, [60, 30, 80]], [.66, [170, 40, 60]], [.8, [240, 95, 55]], [.92, [255, 160, 110]], [1, [255, 226, 200]]], pal = [];
    for (var i = 0; i < 256; i++) {
      var v = i / 255;
      for (var j = 1; j < stops.length; j++) if (v <= stops[j][0]) { var a = stops[j - 1], b = stops[j], t = (v - a[0]) / (b[0] - a[0]); pal.push([a[1][0] + (b[1][0] - a[1][0]) * t, a[1][1] + (b[1][1] - a[1][1]) * t, a[1][2] + (b[1][2] - a[1][2]) * t]); break; }
    }
    function frame(t) {
      if (!run) return;
      var s = t / 1000, dt = img.data, asp = H / W;
      heat += ((over ? 1 : 0) - heat) * .04;
      var src = [[.5 + Math.sin(s * .3) * .22, .5 + Math.cos(s * .4) * .18, .2, .55], [.22 + Math.cos(s * .23) * .12, .72 + Math.sin(s * .31) * .12, .16, .45], [.8 + Math.sin(s * .27) * .1, .3 + Math.cos(s * .21) * .14, .16, .45], [mx, my, .13 + heat * .08, .35 + heat * .75]];
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
        var nx = x / W, ny = y / H, v = 0;
        for (var k = 0; k < 4; k++) { var dx = nx - src[k][0], dy = (ny - src[k][1]) * asp, r = src[k][2]; v += Math.exp(-(dx * dx + dy * dy) / (r * r * .35)) * src[k][3]; }
        v += Math.sin(nx * 18 + s) * Math.cos(ny * 14 - s * .8) * .03;
        var c = pal[Math.max(0, Math.min(255, (v * 300) | 0))], i2 = (y * W + x) * 4;
        dt[i2] = c[0]; dt[i2 + 1] = c[1]; dt[i2 + 2] = c[2]; dt[i2 + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      requestAnimationFrame(frame);
    }
    new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !run) { run = true; requestAnimationFrame(frame); } else run = v; }).observe(sec);
  }

  /* ---------- Voices (testimonial theatre) — real customer reviews ---------- */
  var VOICES = [
    { q: 'I sit at my desk for hours every day, and this has made my lower back feel *much more supported.*', n: 'Daniel R.', c: 'Desk work · May 2026', img: 'images/use-desk.webp' },
    { q: 'It feels supportive *without being bulky.* I use it on my office chair and it helps me sit more comfortably.', n: 'Emily T.', c: 'Office chair', img: 'images/banner.webp' },
    { q: 'Great for long drives. My back feels *less tired after commuting,* and the cushion stays comfortable.', n: 'Marcus L.', c: 'Daily commute', img: 'images/use-drive.webp' },
    { q: 'I love how breathable it feels. It gives me the support I need *without making the chair feel hot.*', n: 'Sarah M.', c: 'Work from home', img: 'images/about-hero.webp' },
    { q: 'I spend close to 9 hours at my desk every day. Since using ErgoGraphene, I feel much more supported — *my posture has noticeably improved.*', n: 'Cecilia W.', c: '9 hours at the desk', img: 'images/lifestyle.jpg' },
    { q: 'Long commutes were making my back uncomfortable. The support feels completely different — *it supports my back, lumbar, and seat all at once.*', n: 'Melinda R.', c: 'Long commutes', img: 'images/use-home.webp' },
    { q: 'What impressed me most is how comfortable it stays even after hours of sitting. The design *naturally encourages better posture.*', n: 'Johnson K.', c: 'Long sitting hours', img: 'images/after.webp' }
  ];
  var voices = (function () {
    var N = VOICES.length, step = 360 / N, nodesEl = $('.voices__nodes'), orbit = $('.voices__orbit'), qEl = $('.voices__q'), segs = $('.voices__segs');
    var nameEl = $('.voices__name'), ctxEl = $('.voices__ctx'), photo = $('.voices__photo'), curEl = $('.voices__cur'), aur = $('.voices__aurora');
    var nodes = [], cur = -1, rot = { r: 0 };
    VOICES.forEach(function (v, i) {
      var n = d.createElement('div'); n.className = 'vnode';
      n.innerHTML = '<span>' + v.n.split(' ').map(function (s) { return s[0]; }).join('') + '</span>';
      nodesEl.appendChild(n); nodes.push(n);
      var b = d.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Review ' + (i + 1)); b.innerHTML = '<i></i>'; segs.appendChild(b);
    });
    var segBtns = $$('button', segs);
    function place() {
      var R = orbit.offsetWidth / 2;
      nodes.forEach(function (n, i) {
        var a = (i * step + rot.r) * Math.PI / 180;
        n.style.transform = 'translate(' + (Math.sin(a) * R).toFixed(1) + 'px,' + (-Math.cos(a) * R).toFixed(1) + 'px)';
      });
    }
    place(); w.addEventListener('resize', debounce(place, 150));
    function quoteHTML(q) {
      var out = [], hl = false;
      q.split(/(\*)/).forEach(function (part) {
        if (part === '*') { hl = !hl; return; }
        part.split(/\s+/).filter(Boolean).forEach(function (wd) { out.push('<span class="w' + (hl ? ' hl' : '') + '">' + wd + '</span>'); });
      });
      return '<span>' + out.join(' ') + '</span>';
    }
    function show(i, instant) {
      if (i === cur) return;
      var dir = i > cur ? 1 : -1, v = VOICES[i]; cur = i;
      nodes.forEach(function (n, j) { n.classList.toggle('is-on', j === i); });
      segBtns.forEach(function (b, j) { b.classList.toggle('done', j <= i); });
      var target = -i * step;
      if (!hasGsap || instant || reduce) {
        rot.r = target; place();
        qEl.innerHTML = quoteHTML(v.q); nameEl.textContent = v.n; ctxEl.textContent = v.c; $('img', photo).src = v.img; curEl.textContent = String(i + 1).padStart(2, '0');
        return;
      }
      gsap.to(rot, { r: target, duration: 1.2, ease: 'expo.out', onUpdate: place, overwrite: true });
      gsap.to(aur, { '--ax': (20 + (i * 37) % 60) + '%', '--ay': (25 + (i * 23) % 50) + '%', duration: 1.6, ease: 'sine.inOut', overwrite: true });
      var old = $$('.w', qEl);
      gsap.killTweensOf(old);
      gsap.to(old, { y: -30 * dir, opacity: 0, filter: 'blur(8px)', duration: .35, stagger: .006, ease: 'power2.in', onComplete: function () {
        if (cur !== i) return;
        qEl.innerHTML = quoteHTML(v.q);
        gsap.fromTo($$('.w', qEl), { y: 40 * dir, opacity: 0, filter: 'blur(12px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: .9, stagger: .025, ease: 'expo.out' });
      } });
      gsap.to([nameEl, ctxEl], { opacity: 0, y: -10, duration: .25, onComplete: function () { nameEl.textContent = v.n; ctxEl.textContent = v.c; gsap.to([nameEl, ctxEl], { opacity: 1, y: 0, duration: .6, stagger: .06, ease: 'expo.out' }); } });
      var im = $('img', photo), ni = d.createElement('img'); ni.src = v.img; ni.alt = '';
      ni.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
      photo.appendChild(ni);
      gsap.fromTo(ni, { clipPath: 'inset(100% 0 0 0)', scale: 1.3 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: .9, ease: 'expo.out', onComplete: function () { if (im && im.parentNode) im.remove(); } });
      gsap.fromTo('.voices__stars i', { scale: 0, rotate: -60 }, { scale: 1, rotate: 0, duration: .6, stagger: .07, ease: 'back.out(3)' });
      gsap.fromTo(curEl, { yPercent: 60 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'expo.out', onStart: function () { curEl.textContent = String(i + 1).padStart(2, '0'); } });
    }
    show(0, true);
    return { show: show, n: N, segBtns: segBtns };
  })();

  /* ---------- Story statement split ---------- */
  (function () {
    var t = $('.story__t');
    Array.prototype.slice.call(t.childNodes).forEach(function (node) {
      if (node.nodeType === 3) { var sp = d.createElement('span'); sp.textContent = node.textContent; t.replaceChild(sp, node); splitChars(sp); sp.removeAttribute('aria-label'); }
      else if (node.nodeType === 1) { splitChars(node); node.removeAttribute('aria-label'); }
    });
    t.setAttribute('aria-label', "We exist because sitting shouldn't hurt.");
  })();
  (function () { var el = $('.ftr__word'), t = el.textContent; el.innerHTML = t.split('').map(function (c) { return '<span class="ch">' + c + '</span>'; }).join(''); })();

  /* ---------- Design notes (?notes=1) ---------- */
  var NOTES = {
    1: ['Announcement bar + region switcher', 'European shoppers first ask <b>"do you ship to me, in my currency, can I return it?"</b>. The bar rotates the store\'s real promises (free worldwide shipping, 30-day guarantee, MB WAY/Shop Pay). The region switcher (5 languages, 8 currencies) maps to <b>Shopify Markets + Translate &amp; Adapt</b> — the localisation part of the brief.'],
    2: ['Hero — the product is the hero', 'The store\'s own headline <b>"Sit Smarter, Feel Better"</b> set in Bodoni Moda (the typeface family of luxury fashion houses) gives the brand an instant high-end feel. The real product floats centre stage with three callouts. The honeycomb is graphene\'s atomic structure and <b>glows in the logo\'s azure</b> wherever the cursor goes. Price, CTA ("Relieve My Back Pain Now"), the 3 guarantees and the 96% satisfaction stat are all above the fold.'],
    3: ['As seen on', 'The current store already shows these health-media logos. Trust before interest: for a new brand selling to Western shoppers, recognisable names in the first scroll lift credibility. <b>Please confirm the client is entitled to use these logos.</b>'],
    4: ['Modern sitting problems — stacking cards', 'Problem → solution storytelling. The client\'s three real problem photos (desk, car, posture) <b>stack on top of each other as you scroll</b>, with the giant counter and question list tracking along — the visitor recognises themselves before we show the product.'],
    5: ['Meet ErgoGraphene — 4-zone scan', 'The 4-zone infographic is the strongest argument in the store, but as a static image it\'s scrolled past. Here a <b>scan beam sweeps the real product</b> and each zone lights up in sequence with its explanation.'],
    6: ['Graphene science — far-infrared field', 'Far-infrared warmth is the <b>unique selling point</b> no foam cushion has. A live thermal field shifts from the brand navy into infrared as you move — the only place we use warm colour, so warmth = graphene in the shopper\'s mind. Four cards hold the store\'s real tech points.'],
    7: ['Before / after slider', 'Uses the client\'s own before/after illustration, split into a <b>draggable comparison</b>. It auto-plays once on arrival to teach the interaction. Interactive comparisons hold attention far longer than static images.'],
    8: ['Your first month', 'Turns the store\'s "first use / week 1 / week 2 / week 4" claims into a <b>scroll-driven figure that physically straightens</b> while the spine angle counts down — sets expectations and reduces returns.'],
    9: ['Why people choose — expanding panels', 'The store\'s 5 benefits become <b>expanding glass panels</b> over a macro of the real tech-mesh. One idea at a time, auto-cycling, hover to explore — premium and scannable.'],
    10: ['Customer feedback numbers', 'The store\'s real 96 / 94 / 91 / 97% figures given <b>weight and hierarchy</b> in a bento grid with animated gauges, leading with the strongest number.'],
    11: ['Every chair — rotating dial', 'Answers "will it fit my chair?" visually, using the client\'s own lifestyle photography and their science page wording (Desk focus, Drive home, Evening reset). It also plants the idea of a second cushion for the car → bundles.'],
    12: ['Buy box on the homepage', 'With one hero product, an extra click to a product page loses buyers. This is a <b>full product page inside the homepage</b>: real copy and price, gallery, bundle tiers to raise order value (<b>our suggestion — discounts to be confirmed</b>), live delivery estimate from the real shipping times, and local payment badges.'],
    13: ['Voices — testimonial theatre', 'The client\'s <b>7 real verified reviews</b> told one at a time like a film: the reviewer orbit rotates the speaker into place, the quote resolves word by word from blur, the key phrase is highlighted in azure, a matching real-life photo wipes in and the stars pop. Scroll drives it; the segments jump to any review.'],
    14: ['Us vs regular cushions', 'The store\'s real comparison table, rebuilt so the ErgoGraphene column reads as the winner (navy + glowing ticks) while "Limited / Sometimes" keeps it credible.'],
    15: ['Our story + research', '"We exist because sitting shouldn\'t hurt" lights up letter by letter as you scroll. Mission values and the <b>3 research references</b> from the science page give the brand substance — with the honest "not a medical device" line Western consumers expect.'],
    16: ['Guarantee seal', 'Risk reversal right before the FAQ removes the last hesitation. The rotating seal reads like a stamp of commitment; 3 steps show how easy a return is.'],
    17: ['FAQ with categories', 'All 10 questions from the store, filterable by Product / Shipping / Returns / Care / Warranty — so the answer is two clicks away instead of a long scroll.'],
    18: ['Final call to action', 'The store\'s own closing line, <b>"Give Your Back The Support It Deserves"</b>, over the dark product photography — one last confident, single-focus moment before the footer.']
  };
  if (/[?&]notes=1/.test(location.search)) {
    var panel = $('.notes'), keys = Object.keys(NOTES).map(Number), ncur = 0;
    d.body.classList.add('notes-on');
    var showNote = function (i) {
      ncur = (i + keys.length) % keys.length; var k = keys[ncur], n = NOTES[k];
      $('.notes__k', panel).textContent = 'Why this layout · ' + k + ' / ' + keys.length;
      $('.notes__t', panel).textContent = n[0]; $('.notes__b', panel).innerHTML = n[1]; panel.hidden = false;
      $$('.is-noted').forEach(function (e) { e.classList.remove('is-noted'); });
      var el = $('[data-note="' + k + '"]'); if (el) el.classList.add('is-noted');
    };
    var jump = function (i) { showNote(i); var el = $('[data-note="' + keys[ncur] + '"]'); if (el) { if (lenis) lenis.scrollTo(el, { offset: -40 }); else el.scrollIntoView({ behavior: 'smooth' }); } };
    $$('[data-note]').forEach(function (el) {
      var pin = d.createElement('button'); pin.type = 'button'; pin.className = 'note-pin'; pin.textContent = el.dataset.note; pin.setAttribute('aria-label', 'Design note ' + el.dataset.note);
      pin.addEventListener('click', function (e) { e.stopPropagation(); showNote(keys.indexOf(+el.dataset.note)); });
      el.appendChild(pin);
    });
    $('.notes__next', panel).addEventListener('click', function () { jump(ncur + 1); });
    $('.notes__prev', panel).addEventListener('click', function () { jump(ncur - 1); });
    $('.notes__x', panel).addEventListener('click', function () { panel.hidden = true; });
    showNote(0);
  }

  applyLocale();
  lattice(); thermal();

  /* =========================================================
     Motion (GSAP)
     ========================================================= */
  if (!hasGsap) { $('.loader').classList.add('done'); return; }
  gsap.registerPlugin(ScrollTrigger);
  if (!reduce && typeof w.Lenis !== 'undefined') {
    lenis = new w.Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Loader → hero intro
  var lnum = $('.loader__num'), lo = { v: 0 };
  if (lenis) lenis.stop();
  gsap.timeline()
    .to(lo, { v: 100, duration: reduce ? .1 : 1.5, ease: 'power2.inOut', onUpdate: function () { lnum.textContent = Math.round(lo.v); } })
    .to('.loader__arc', { strokeDashoffset: 0, duration: reduce ? .1 : 1.5, ease: 'power2.inOut' }, 0)
    .to('.loader', { clipPath: 'circle(0% at 50% 50%)', duration: reduce ? .1 : 1.1, ease: 'expo.inOut', onComplete: function () { $('.loader').classList.add('done'); if (lenis) lenis.start(); } }, '+=.1')
    .add(function () { splitHero(true); }, '-=.6')
    .from('.hero__img', { y: 120, scale: .8, opacity: 0, duration: 1.6, ease: 'expo.out' }, '-=.5')
    .from('.hero__ring', { scale: .6, opacity: 0, duration: 1.6, ease: 'expo.out' }, '<')
    .from('.callout', { opacity: 0, x: function (i) { return i === 0 ? -30 : 30; }, duration: 1, stagger: .12, ease: 'expo.out' }, '-=1')
    .from(['.hero__k', '.hero__left', '.hero__buy', '.hero__proof'], { y: 30, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out' }, '-=1.1');

  if (fine && !reduce) {
    var himg = $('.hero__img'), xTo = gsap.quickTo(himg, 'rotationY', { duration: .8, ease: 'power3' }), yTo = gsap.quickTo(himg, 'rotationX', { duration: .8, ease: 'power3' });
    $('.hero').addEventListener('pointermove', function (e) { var r = this.getBoundingClientRect(); xTo(((e.clientX - r.left) / r.width - .5) * 16); yTo(-((e.clientY - r.top) / r.height - .5) * 10); });
    $$('.magnetic').forEach(function (b) {
      var bx = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' }), by = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
      b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); bx((e.clientX - r.left - r.width / 2) * .25); by((e.clientY - r.top - r.height / 2) * .35); });
      b.addEventListener('pointerleave', function () { bx(0); by(0); });
    });
  }
  gsap.to('.hero__stage', { yPercent: 16, scale: .92, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__t', { yPercent: -40, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // header colour state
  var hdr = $('.hdr'), darks = $$('.hero, .seen, .warm, .why, .proof, .voices, .story, .final, .ftr');
  ScrollTrigger.create({ start: 80, end: 'max', onToggle: function (s) { hdr.classList.toggle('is-solid', s.isActive); } });
  function hdrCheck() { var y = 40; hdr.classList.toggle('on-dark', darks.some(function (x) { var r = x.getBoundingClientRect(); return r.top <= y && r.bottom >= y; })); }
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: hdrCheck }); hdrCheck();

  // sticky buy bar
  var sticky = $('.sticky');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function () {
    var heroB = $('.hero').getBoundingClientRect().bottom, shop = $('.shop').getBoundingClientRect(), fin = $('.final').getBoundingClientRect().top;
    var on = heroB < 0 && !(shop.top < innerHeight * .8 && shop.bottom > 0) && fin > innerHeight * .9;
    sticky.classList.toggle('is-on', on); sticky.setAttribute('aria-hidden', !on);
  } });

  // generic reveals
  $$('.h2, .seal__t, .final__t, .voices__t').forEach(function (h) { gsap.from(h, { y: 60, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } }); });
  $$('.kicker').filter(function (k) { return !k.closest('.shop__info'); }).forEach(function (k) { gsap.from(k, { x: -20, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: k, start: 'top 90%' } }); });

  // PROBLEMS — stacking cards
  (function () {
    var cards = $$('.pcard'), qs = $$('.prob__qs li'), n = $('.prob__n'), last = 0;
    gsap.set(cards.slice(1), { yPercent: 115, rotate: 4 });
    var tl = gsap.timeline({ scrollTrigger: { trigger: '.prob', start: 'top top', end: '+=220%', pin: '.prob__pin', scrub: .6,
      onUpdate: function (s) {
        var i = Math.min(2, Math.floor(s.progress * 2.999 + .25));
        if (i !== last) { last = i; qs.forEach(function (q, j) { q.classList.toggle('is-on', j === i); }); gsap.fromTo(n, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5, ease: 'expo.out', onStart: function () { n.textContent = '0' + (i + 1); } }); }
      } } });
    tl.to({}, { duration: .2 })
      .to(cards[1], { yPercent: 0, rotate: 0, duration: 1, ease: 'none' })
      .to(cards[0], { scale: .9, yPercent: -4, filter: 'brightness(.45)', duration: 1, ease: 'none' }, '<')
      .to({}, { duration: .2 })
      .to(cards[2], { yPercent: 0, rotate: 0, duration: 1, ease: 'none' })
      .to(cards[1], { scale: .92, yPercent: -2, filter: 'brightness(.45)', duration: 1, ease: 'none' }, '<')
      .to(cards[0], { scale: .84, yPercent: -8, duration: 1, ease: 'none' }, '<')
      .to({}, { duration: .2 });
  })();

  // SCAN
  (function () {
    var lis = $$('.scan__list li'), zones = $$('.zone'), zl = $('.scan__zl'), pct = $('.scan__pct'), last = -1;
    function setZone(i) { if (i === last) return; last = i; lis.forEach(function (l, j) { l.classList.toggle('is-on', j === i); }); zones.forEach(function (z, j) { z.classList.toggle('is-on', j <= i); }); zl.textContent = 'ABCD'[i]; }
    setZone(0);
    gsap.timeline({ scrollTrigger: { trigger: '.scan', start: 'top top', end: '+=220%', pin: '.scan__pin', scrub: .5, onUpdate: function (s) { setZone(Math.min(3, Math.floor(s.progress * 4))); pct.textContent = Math.round(s.progress * 100) + '%'; } } })
      .fromTo('.scan__beam', { top: '0%' }, { top: '100%', ease: 'none' })
      .fromTo('.scan__stage img', { scale: .94 }, { scale: 1.04, ease: 'none' }, 0);
  })();

  // WARM
  gsap.from('.warm__t', { scale: .85, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.warm', start: 'top 60%' } });
  gsap.from('.wcard', { y: 80, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.warm__cards', start: 'top 92%' } });

  // BEFORE / AFTER
  ScrollTrigger.create({ trigger: '.ba__cmp', start: 'top 65%', once: true, onEnter: function () { $('.ba__cmp')._intro(); } });
  gsap.from('.ba__cmp', { y: 80, rotateY: -12, opacity: 0, transformPerspective: 1400, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.ba__cmp', start: 'top 92%' } });

  // JOURNEY
  (function () {
    var spine = $('.j-spine'), body = $('.j-body'), head = $('.j-head'), leg = $('.j-leg'), arm = $('.j-arm'), seat = $('.j-seat path');
    var num = $('.j-num'), st = $('.j-state'), weeks = $$('.week'), bar = $('.journey__bar i'), wi = -1;
    var A = { hip: [222, 296], c1: [292, 250], c2: [252, 150], sh: [200, 138], hd: [176, 100], deg: 24 }, B = { hip: [262, 292], c1: [282, 236], c2: [264, 168], sh: [258, 118], hd: [254, 72], deg: 4 };
    function L(a, b, t) { return a + (b - a) * t; }
    function P(k, t) { return [L(A[k][0], B[k][0], t), L(A[k][1], B[k][1], t)]; }
    function render(t) {
      var hip = P('hip', t), c1 = P('c1', t), c2 = P('c2', t), sh = P('sh', t), hd = P('hd', t), dp = 'M' + hip + ' C' + c1 + ' ' + c2 + ' ' + sh;
      spine.setAttribute('d', dp); body.setAttribute('d', dp); head.setAttribute('cx', hd[0]); head.setAttribute('cy', hd[1]);
      leg.setAttribute('d', 'M' + hip + ' L 104 300 L 104 400');
      arm.setAttribute('d', 'M' + sh + ' L ' + (sh[0] - 26) + ' 222 L ' + (sh[0] - 96) + ' 226');
      num.textContent = Math.round(L(A.deg, B.deg, t)) + '°';
      st.textContent = t < .35 ? 'slouched' : t < .75 ? 'improving' : 'aligned';
    }
    render(0); weeks[0].classList.add('is-on');
    var o = { t: 0 };
    gsap.timeline({ scrollTrigger: { trigger: '.journey', start: 'top top', end: '+=200%', pin: '.journey__pin', scrub: .6,
      onUpdate: function (s) { var i = Math.min(3, Math.floor(s.progress * 4)); if (i !== wi) { wi = i; weeks.forEach(function (wk, j) { wk.classList.toggle('is-on', j === i); }); } } } })
      .to(seat, { opacity: 1, duration: .15 }, 0)
      .to(o, { t: 1, duration: 1, ease: 'none', onUpdate: function () { render(o.t); } }, 0)
      .to(bar, { scaleX: 1, duration: 1, ease: 'none' }, 0);
  })();

  // WHY panels entrance
  gsap.from('.wp', { y: 80, opacity: 0, duration: 1.2, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.why__panels', start: 'top 85%' } });

  // PROOF
  $$('.gauge').forEach(function (g, i) {
    var v = +g.dataset.v, odo = $('.odo', g), o = { n: 0 };
    ScrollTrigger.create({ trigger: g, start: 'top 88%', once: true, onEnter: function () {
      gsap.to($('.gv', g), { strokeDashoffset: 326.7 * (1 - v / 100), duration: 2, delay: i * .12, ease: 'expo.out' });
      gsap.to(o, { n: v, duration: 2, delay: i * .12, ease: 'expo.out', onUpdate: function () { odo.textContent = Math.round(o.n); } });
    } });
  });
  gsap.from('.gauge', { y: 60, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.proof__grid', start: 'top 88%' } });

  gsap.from('.seats__dial', { rotate: -40, scale: .8, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.seats', start: 'top 75%' } });
  gsap.from('.shop__info > *', { y: 40, opacity: 0, duration: 1, stagger: .05, ease: 'expo.out', scrollTrigger: { trigger: '.shop', start: 'top 70%' } });
  gsap.from('.shop__main', { clipPath: 'inset(18% 18% 18% 18% round 28px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.shop', start: 'top 75%' } });

  // VOICES — pinned theatre
  (function () {
    var N = voices.n;
    var st = ScrollTrigger.create({ trigger: '.voices', start: 'top top', end: '+=' + (N * 60) + '%', pin: '.voices__pin',
      onUpdate: function (s) { voices.show(Math.min(N - 1, Math.floor(s.progress * N))); } });
    voices.segBtns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        var y = st.start + (st.end - st.start) * ((i + .5) / N);
        if (lenis) lenis.scrollTo(y, { duration: 1 }); else w.scrollTo(0, y);
      });
    });
    gsap.from('.voices__orbit', { scale: .6, rotate: -90, opacity: 0, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: '.voices', start: 'top 70%' } });
    if (fine && !reduce) {
      var qx = gsap.quickTo('.voices__stage', 'x', { duration: 1, ease: 'power3' }), qy = gsap.quickTo('.voices__stage', 'y', { duration: 1, ease: 'power3' });
      $('.voices').addEventListener('pointermove', function (e) { qx((e.clientX / innerWidth - .5) * 24); qy((e.clientY / innerHeight - .5) * 16); });
    }
  })();

  // VS
  gsap.from('.vs__row', { opacity: 0, y: 24, duration: .9, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: '.vs__table', start: 'top 82%' } });
  gsap.from('.vs .y', { '--s': 0, duration: .8, stagger: .07, ease: 'back.out(3)', scrollTrigger: { trigger: '.vs__table', start: 'top 72%' } });

  // STORY
  (function () {
    var chs = $$('.story__t .ch');
    ScrollTrigger.create({ trigger: '.story__t', start: 'top 80%', end: 'bottom 35%', scrub: true, onUpdate: function (s) { var n = Math.round(s.progress * chs.length); chs.forEach(function (c, i) { c.classList.toggle('lit', i < n); }); } });
    gsap.fromTo('.story__img img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.story__img', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.story__img', { clipPath: 'inset(0 0 100% 0 round 28px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.story__img', start: 'top 85%' } });
    gsap.from('.story__vals li', { x: 40, opacity: 0, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.story__vals', start: 'top 88%' } });
    gsap.from('.rs', { y: 60, opacity: 0, rotateX: -20, transformPerspective: 900, duration: 1.2, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.research__list', start: 'top 88%' } });
  })();

  gsap.from('.seal__badge', { scale: .4, rotate: -120, opacity: 0, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.seal', start: 'top 75%' } });
  gsap.from('.seal__steps li', { y: 30, opacity: 0, duration: 1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.seal__steps', start: 'top 92%' } });
  gsap.from('.faq details', { y: 30, opacity: 0, duration: 1, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: '.faq__list', start: 'top 88%' } });
  gsap.fromTo('.final__bg img', { yPercent: -15 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.ftr__word .ch', { yPercent: 100, opacity: 0, duration: 1.2, stagger: .04, ease: 'expo.out', scrollTrigger: { trigger: '.ftr__word', start: 'top 98%' } });

  w.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
