/* =========================================================
   ErgoGraphene — homepage V2 interactions (calm, subtle)
   ========================================================= */
(function () {
  'use strict';
  var d = document, w = window;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof w.gsap !== 'undefined' && typeof w.ScrollTrigger !== 'undefined';

  /* ---------- Locale ---------- */
  var RATES = { EUR: 1, GBP: 0.86, CHF: 0.94, SEK: 11.4, DKK: 7.46, PLN: 4.3, USD: 1.08, CAD: 1.5 };
  var LOC = { en: 'en-IE', de: 'de-DE', fr: 'fr-FR', it: 'it-IT', es: 'es-ES' };
  var CUR_LOC = { GBP: 'en-GB', USD: 'en-US', CAD: 'en-CA', CHF: 'de-CH', SEK: 'sv-SE', DKK: 'da-DK', PLN: 'pl-PL' };
  var SYM = { EUR: '€', GBP: '£', CHF: 'CHF', SEK: 'kr', DKK: 'kr', PLN: 'zł', USD: '$', CAD: '$' };
  var I18N = {
    en: {},
    de: { ann: 'Kostenloser weltweiter Versand · 30 Tage Komfort-Garantie · Jedes Paket versichert', nav_shop: 'Shop', nav_how: 'So funktioniert es', nav_research: 'Forschung', nav_reviews: 'Bewertungen', nav_faq: 'FAQ', cart: 'Warenkorb', hero_k: 'Ergonomischer Halt mit Graphen', hero_t1: 'Klüger sitzen.', hero_t2: 'Besser fühlen.', hero_p: 'Normale Kissen polstern nur. ErgoGraphene stützt die natürliche Kurve Ihres unteren Rückens — mit sanfter Graphen-Wärme und atmungsaktivem Tech-Mesh.', cta_shop: 'Kissen kaufen', cta_how: 'So funktioniert es', add: 'In den Warenkorb' },
    fr: { ann: 'Livraison gratuite dans le monde · Garantie confort 30 jours · Colis assurés', nav_shop: 'Boutique', nav_how: 'Comment ça marche', nav_research: 'Recherche', nav_reviews: 'Avis', nav_faq: 'FAQ', cart: 'Panier', hero_k: 'Soutien ergonomique au graphène', hero_t1: 'Asseyez-vous mieux.', hero_t2: 'Sentez la différence.', hero_p: 'Les coussins ordinaires ne font qu’ajouter du rembourrage. ErgoGraphene soutient la courbe naturelle du bas du dos — avec une douce chaleur au graphène et un tech-mesh respirant.', cta_shop: 'Acheter le coussin', cta_how: 'Comment ça marche', add: 'Ajouter au panier' },
    it: { ann: 'Spedizione gratuita in tutto il mondo · Garanzia comfort 30 giorni · Pacchi assicurati', nav_shop: 'Shop', nav_how: 'Come funziona', nav_research: 'Ricerca', nav_reviews: 'Recensioni', nav_faq: 'FAQ', cart: 'Carrello', hero_k: 'Supporto ergonomico al grafene', hero_t1: 'Siediti meglio.', hero_t2: 'Stai meglio.', hero_p: 'I cuscini normali aggiungono solo imbottitura. ErgoGraphene sostiene la curva naturale della zona lombare — con un delicato calore al grafene e tech-mesh traspirante.', cta_shop: 'Acquista il cuscino', cta_how: 'Come funziona', add: 'Aggiungi al carrello' },
    es: { ann: 'Envío gratis a todo el mundo · Garantía de confort de 30 días · Paquetes asegurados', nav_shop: 'Tienda', nav_how: 'Cómo funciona', nav_research: 'Investigación', nav_reviews: 'Opiniones', nav_faq: 'FAQ', cart: 'Carrito', hero_k: 'Soporte ergonómico con grafeno', hero_t1: 'Siéntate mejor.', hero_t2: 'Siéntete mejor.', hero_p: 'Los cojines normales solo añaden relleno. ErgoGraphene sostiene la curva natural de tu zona lumbar — con un suave calor de grafeno y tech-mesh transpirable.', cta_shop: 'Comprar el cojín', cta_how: 'Cómo funciona', add: 'Añadir al carrito' }
  };
  var state = { lang: 'en', cur: 'EUR' };
  try { var sv = JSON.parse(localStorage.getItem('eg2-locale') || 'null'); if (sv && RATES[sv.cur] && I18N[sv.lang]) state = sv; } catch (e) {}
  $$('[data-i18n]').forEach(function (el) { var k = el.dataset.i18n; if (!I18N.en[k]) I18N.en[k] = el.textContent; });
  function money(eur) {
    var v = eur * RATES[state.cur], whole = ['SEK', 'DKK', 'PLN'].indexOf(state.cur) > -1;
    if (whole) v = Math.round(v / 5) * 5; else if (state.cur !== 'EUR') v = Math.ceil(v) - 0.05;
    return new Intl.NumberFormat(CUR_LOC[state.cur] || LOC[state.lang], { style: 'currency', currency: state.cur, minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 }).format(v);
  }
  function applyLocale() {
    var dict = I18N[state.lang];
    $$('[data-i18n]').forEach(function (el) { var k = el.dataset.i18n; el.textContent = dict[k] || I18N.en[k]; });
    d.documentElement.lang = state.lang;
    $$('[data-price]').forEach(function (el) { el.textContent = money(parseFloat(el.dataset.price)); });
    $$('.loc-txt').forEach(function (el) { el.textContent = state.lang.toUpperCase() + ' · ' + state.cur + ' ' + SYM[state.cur]; });
    $$('.locale__opts').forEach(function (g) { $$('button', g).forEach(function (b) { b.classList.toggle('is-on', b.dataset.v === state[g.dataset.k]); }); });
    renderCart();
    try { localStorage.setItem('eg2-locale', JSON.stringify(state)); } catch (e) {}
  }
  $$('.locale__opts').forEach(function (g) {
    g.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; state[g.dataset.k] = b.dataset.v; applyLocale(); });
  });

  /* ---------- Cart ---------- */
  var qty = 0;
  function total(q) { if (q <= 0) return 0; if (q === 1) return 92.95; if (q === 2) return 167.31; if (q === 3) return 237.02; return +(q * 92.95 * 0.85).toFixed(2); }
  function renderCart() {
    var box = $('.cart__items');
    box.innerHTML = qty ? '<div class="ci"><img src="../images/cushion-sm.webp" alt=""><div><b>Lumbar Support Seat Cushion</b><small>' + (qty > 1 ? 'Bundle saving applied' : 'Black tech-mesh') + '</small><div class="ci__q"><button type="button" data-q="-1" aria-label="Decrease">−</button><span>' + qty + '</span><button type="button" data-q="1" aria-label="Increase">+</button></div></div><b>' + money(total(qty)) + '</b></div>' : '<p class="cart__empty">Your cart is empty.</p>';
    $('.cart__sum').textContent = money(total(qty));
    $('.cart-count').textContent = qty;
    var msg = $('.cart__msg'), bar = $('.cart__prog i');
    if (qty >= 3) { msg.innerHTML = 'Free shipping ✓ · <b>You save 15%</b>'; bar.style.width = '100%'; }
    else if (qty === 2) { msg.innerHTML = 'Free shipping ✓ · You save 10%. <b>Add 1 more to save 15%</b>'; bar.style.width = '66%'; }
    else { msg.innerHTML = 'Free shipping ✓ · <b>Add a 2nd cushion to save 10%</b>'; bar.style.width = qty ? '33%' : '0'; }
  }
  $('.cart__items').addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (!b) return; qty = Math.max(0, qty + (+b.dataset.q)); renderCart(); });
  $$('[data-add]').forEach(function (b) {
    b.addEventListener('click', function () {
      qty += +b.dataset.add; renderCart();
      var c = $('.cart-count'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
      openDrawer('cart');
    });
  });

  /* ---------- Drawers & menu ---------- */
  var scrim = $('.scrim'), menu = $('.menu'), mnav = $('.mnav');
  function closeMenu() { mnav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); mnav.setAttribute('aria-hidden', 'true'); }
  function openDrawer(name) {
    closeMenu();
    $$('.drawer').forEach(function (x) { x.classList.remove('is-open'); x.setAttribute('aria-hidden', 'true'); });
    var dr = $('.drawer.' + name); scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.add('is-on'); });
    dr.classList.add('is-open'); dr.setAttribute('aria-hidden', 'false'); d.body.classList.add('locked');
    setTimeout(function () { var x = $('.x', dr); if (x) x.focus({ preventScroll: true }); }, 60);
  }
  function closeDrawers() {
    $$('.drawer').forEach(function (x) { x.classList.remove('is-open'); x.setAttribute('aria-hidden', 'true'); });
    scrim.classList.remove('is-on'); setTimeout(function () { if (!scrim.classList.contains('is-on')) scrim.hidden = true; }, 350);
    d.body.classList.remove('locked');
  }
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { openDrawer(b.dataset.open); }); });
  $$('[data-close]').forEach(function (b) { b.addEventListener('click', closeDrawers); });
  scrim.addEventListener('click', closeDrawers);
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDrawers(); closeMenu(); } });
  menu.addEventListener('click', function () {
    var open = !mnav.classList.contains('is-open');
    mnav.classList.toggle('is-open', open); menu.setAttribute('aria-expanded', open); mnav.setAttribute('aria-hidden', !open);
  });
  $$('.mnav a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* ---------- Header + mobile bar ---------- */
  var hdr = $('.hdr'), mbar = $('.mbar'), hero = $('.hero'), shop = $('.shop'), ftr = $('.ftr');
  function onScroll() {
    hdr.classList.toggle('is-scrolled', w.scrollY > 10);
    var hb = hero.getBoundingClientRect().bottom, s = shop.getBoundingClientRect(), f = ftr.getBoundingClientRect().top;
    var on = hb < 0 && !(s.top < innerHeight && s.bottom > 0) && f > innerHeight;
    mbar.classList.toggle('is-on', on); mbar.setAttribute('aria-hidden', !on);
  }
  w.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealSel = '.hero__copy > *, .trust li, .ben__head > *, .ben__tabs, .shift__in > *, .meet__copy > *, .meet__fig, .how__head, .shop__head > *, .card, .principle > *, .proof__head, .prow, .research__head > *, .rrow, .seen, .revs__side > *, .vids__head > *, .try__in > *, .faq__head > *, .faq details, .ftr__top > *';
  var io = 'IntersectionObserver' in w ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  $$(revealSel).forEach(function (el) {
    if (!io || reduce) return;
    var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.classList.add('rv'); el.style.transitionDelay = Math.min(sib, 6) * 70 + 'ms';
    io.observe(el);
  });

  /* ---------- Benefits tabs ---------- */
  (function () {
    var sec = $('.ben'), tabs = $$('.ben__tabs button'), panes = $$('.pane'), cur = 0, timer, visible = false;
    function go(i, user) {
      cur = i;
      tabs.forEach(function (t, j) { t.classList.toggle('is-on', j === i); t.setAttribute('aria-selected', j === i); var bar = $('i', t); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; });
      panes.forEach(function (p, j) { p.classList.toggle('is-on', j === i); });
      if (user) { sec.classList.add('paused'); clearTimeout(timer); } else schedule();
    }
    function schedule() { clearTimeout(timer); timer = setTimeout(function () { if (visible && !sec.classList.contains('paused')) go((cur + 1) % tabs.length); else schedule(); }, 6000); }
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { go(i, true); }); });
    if (io) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: .3 }).observe(sec);
    schedule();
  })();

  /* ---------- Meet: show all hotspot labels once ---------- */
  (function () {
    var fig = $('.meet__fig'); if (!io) return;
    new IntersectionObserver(function (es, o) {
      if (es[0].isIntersecting) { fig.classList.add('show-all'); setTimeout(function () { fig.classList.remove('show-all'); }, 3600); o.disconnect(); }
    }, { threshold: .5 }).observe(fig);
  })();

  /* ---------- How it works: active step follows scroll ---------- */
  (function () {
    var steps = $$('.how__steps li'), imgs = $$('.how__img'), count = $('.how__count b');
    function set(i) {
      steps.forEach(function (s, j) { s.classList.toggle('is-on', j === i); });
      imgs.forEach(function (m, j) { m.classList.toggle('is-on', j === i); });
      count.textContent = '0' + (i + 1);
    }
    if (!io) return;
    var stepIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) set(steps.indexOf(e.target)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { stepIO.observe(s); });
  })();

  /* ---------- Reviews carousel ---------- */
  (function () {
    var revs = $$('.rev'), dotsBox = $('.revs__dots'), cur = 0, timer;
    revs.forEach(function (_, i) { var b = d.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Review ' + (i + 1)); b.addEventListener('click', function () { go(i); }); dotsBox.appendChild(b); });
    var dots = $$('button', dotsBox);
    function go(i) {
      i = (i + revs.length) % revs.length;
      revs[cur].classList.remove('is-on'); revs[cur].classList.add('out');
      var old = revs[cur]; setTimeout(function () { old.classList.remove('out'); }, 900);
      cur = i; revs[cur].classList.add('is-on');
      dots.forEach(function (b, j) { b.classList.toggle('is-on', j === cur); });
      clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, 7000);
    }
    $$('.arrow').forEach(function (a) { a.addEventListener('click', function () { go(cur + (+a.dataset.dir)); }); });
    var sx = null, stage = $('.revs__stage');
    stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); sx = null; });
    dots[0].classList.add('is-on');
    timer = setInterval(function () { go(cur + 1); }, 7000);
  })();

  /* ---------- Video testimonials ---------- */
  (function () {
    var track = $('.vids__track'), cards = $$('.vcard'), modal = $('.vmodal'), mv = $('video', modal);
    var hoverable = w.matchMedia('(hover: hover)').matches;
    cards.forEach(function (c) {
      var v = $('video', c);
      if (hoverable) {
        c.addEventListener('mouseenter', function () { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); });
        c.addEventListener('mouseleave', function () { v.pause(); });
      }
      c.addEventListener('click', function () {
        mv.src = c.dataset.src; mv.poster = v.poster; modal.hidden = false;
        requestAnimationFrame(function () { modal.classList.add('is-on'); });
        d.body.classList.add('locked');
        var p = mv.play(); if (p && p.catch) p.catch(function () {});
      });
    });
    if (!hoverable && io) {
      var vio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { var v = $('video', e.target); if (e.isIntersecting) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); });
      }, { threshold: .7 });
      cards.forEach(function (c) { vio.observe(c); });
    }
    function closeV() { modal.classList.remove('is-on'); mv.pause(); setTimeout(function () { modal.hidden = true; mv.removeAttribute('src'); mv.load(); }, 300); d.body.classList.remove('locked'); }
    $('.vmodal__x').addEventListener('click', closeV);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeV(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeV(); });
    $$('[data-vdir]').forEach(function (b) { b.addEventListener('click', function () { track.scrollBy({ left: +b.dataset.vdir * track.clientWidth * .6, behavior: 'smooth' }); }); });
  })();

  /* ---------- Proof counters ---------- */
  (function () {
    var nums = $$('.count'); if (!io) { nums.forEach(function (n) { n.textContent = n.dataset.to; }); return; }
    var o = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; o.unobserve(e.target);
        var el = e.target, to = +el.dataset.to, t0 = performance.now(), dur = reduce ? 1 : 1600;
        (function tick(t) { var p = Math.min(1, (t - t0) / dur), k = 1 - Math.pow(1 - p, 4); el.textContent = Math.round(to * k); if (p < 1) requestAnimationFrame(tick); })(t0);
      });
    }, { threshold: .6 });
    nums.forEach(function (n) { o.observe(n); });
  })();

  /* ---------- Subtle parallax (GSAP) ---------- */
  if (hasGsap && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero__media img', { y: 40, opacity: 0, scale: .94, duration: 1.4, ease: 'expo.out', delay: .1 });
    gsap.to('.hero__media img', { y: -30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    [['.shift__bg img', '.shift'], ['.try__bg img', '.try']].forEach(function (p) {
      gsap.fromTo(p[0], { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: p[1], start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------- Design notes (?notes=1) ---------- */
  var NOTES = {
    1: ['Announcement bar', 'One calm line with the three promises Western shoppers check first: <b>free worldwide shipping, the 30-day guarantee and insured delivery</b>.'],
    2: ['Hero + trust row', 'Like CoreChair: one strong headline, the <b>real product on a dark panel</b>, a single clear "Shop" button with the price, and a trust row underneath (reviews, 96% satisfaction, guarantee, free shipping). Everything a visitor needs to decide is above the fold.'],
    3: ['"A better way to feel while you sit"', 'CoreChair\'s strongest section, adapted: five benefit tabs that cycle automatically, each with <b>real lifestyle photography</b> and one customer-feedback number. All photos are real stock photography (no AI) and will be swapped for ErgoGraphene\'s own photos.'],
    4: ['Statement', 'A single big line over a real office photo, used as a pause between sections — "Designed for posture. Built for every seat." It answers "will it work on my chair?" in one sentence.'],
    5: ['Meet ErgoGraphene', 'The product explained in plain language, with <b>four hotspots</b> on the real product photo. The labels appear once on arrival, then on hover — clean but informative.'],
    6: ['How it works — 3 steps', 'CoreChair\'s timeline layout: the image stays in place while the three steps scroll by (shape → graphene → everyday). Short, scannable, no long animations.'],
    7: ['Choose your set', 'Product cards like CoreChair\'s model range, but as <b>1 / 2 / 3 cushion bundles</b> to raise order value (desk + car is the natural upsell). Discounts are a suggestion to confirm with you.'],
    8: ['Principle quote', 'The brand\'s own belief — "Sitting shouldn\'t hurt" — as a short, memorable statement. It gives the brand a voice, like CoreChair\'s quote section.'],
    9: ['Proof numbers', 'Your real customer-feedback numbers in a calm, CoreChair-style list: big number, short explanation. Counting animation only.'],
    10: ['Research + as seen on', 'The three studies from your science page as a clean table, plus the media logos from your current site. <b>Please confirm you can use these logos.</b>'],
    11: ['Reviews', 'Your 7 real reviews, one at a time, large and readable — auto-rotating with arrows and swipe on mobile.'],
    12: ['Try it banner', 'Risk-reversal right before the FAQ: free shipping + 30-day guarantee + one button.'],
    13: ['FAQ', 'The six questions that stop people buying, answered from your store policies.'],
    14: ['Video testimonials', 'Short vertical, phone-style customer videos — the format shoppers trust most on TikTok and Instagram. They preview silently on hover (or as you scroll on mobile) and open full-screen with sound on click. <b>The clips shown are free stock samples</b>; they will be replaced with your customers\' own videos (ask buyers for a 10-second clip, or use a UGC service). Built to connect to review apps like Judge.me, Loox or Okendo, which collect photo and video reviews automatically.']
  };
  if (/[?&]notes=1/.test(location.search)) {
    var panel = $('.notes'), keys = Object.keys(NOTES).map(Number), nc = 0;
    var show = function (i) {
      nc = (i + keys.length) % keys.length; var k = keys[nc];
      $('.notes__k', panel).textContent = 'Why this layout · ' + k + ' / ' + keys.length;
      $('.notes__t', panel).textContent = NOTES[k][0]; $('.notes__b', panel).innerHTML = NOTES[k][1]; panel.hidden = false;
      $$('.is-noted').forEach(function (e) { e.classList.remove('is-noted'); });
      var el = $('[data-note="' + k + '"]'); if (el) { el.classList.add('is-noted'); }
    };
    var jump = function (i) { show(i); var el = $('[data-note="' + keys[nc] + '"]'); if (el) el.scrollIntoView({ behavior: 'smooth' }); };
    $$('[data-note]').forEach(function (el) {
      var pin = d.createElement('button'); pin.type = 'button'; pin.className = 'note-pin'; pin.textContent = el.dataset.note;
      pin.addEventListener('click', function (e) { e.stopPropagation(); show(keys.indexOf(+el.dataset.note)); });
      el.appendChild(pin);
    });
    $('.notes__next', panel).addEventListener('click', function () { jump(nc + 1); });
    $('.notes__prev', panel).addEventListener('click', function () { jump(nc - 1); });
    $('.notes__x', panel).addEventListener('click', function () { panel.hidden = true; });
    show(0);
  }

  applyLocale();
})();
