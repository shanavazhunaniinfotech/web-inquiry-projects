/* GreenGo – Concept 3: Clean, minimal & premium. GSAP + ScrollTrigger + SplitText */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = matchMedia('(hover: none), (pointer: coarse)').matches;
  var euro = function (n) { return '€' + n.toFixed(2); };
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) { gsap.registerPlugin(ScrollTrigger); if (window.SplitText) gsap.registerPlugin(SplitText); document.documentElement.classList.add('js'); }

  /* ---------- store data: names, descriptions and bar prices from greengo.bar; retail pack prices are proposed ---------- */
  var P = '../assets/img/products/', G = '../assets/img/partner/', ECS = 'https://www.espressocoffeeshop.com/en/';
  var TEAS = [
    { id: 'm2', name: 'Hojicha', meta: 'Roasted green tea · 50 g', price: 14, img: 'p-hojicha' },
    { id: 'm3', name: 'Golden Milk Mix', meta: 'For your milk of choice · 150 g', price: 12, img: 'p-golden' },
    { id: 'm4', name: 'Chai Latte Mix', meta: 'Black tea with spices · 200 g', price: 13, img: 'p-chai' }
  ];
  var COFFEE = [
    { id: 'b1', name: 'Specialty Coffee Beans', meta: 'Whole beans · 250 g', bar: 'At the bar: Flat White €5.00', price: 12.5, img: 'p-beans', tag: 'House coffee', type: 'caf' },
    { id: 'b3', name: 'Cold Brew Coffee', meta: 'For slow steeping · 250 g', bar: 'At the bar: Cold Brew €6.00', price: 12.5, img: 'p-coldbrew', type: 'caf' },
    { id: 'b2', name: 'Decaf Coffee Beans', meta: 'Whole beans · 250 g', bar: 'At the bar: decaf on any coffee +€0.50', price: 13, img: 'p-decaf', type: 'free' },
    { id: 'b4', name: 'Barley Chicory', meta: 'Caffeine-free option · 250 g', bar: 'Caffeine-free, milk of choice same price', price: 9, img: 'p-barley', tag: 'Caffeine-free', type: 'free' }
  ];
  var MERCH = [
    { id: 'x1', name: 'GreenGo Tote Bag', meta: 'Cotton canvas', price: 18, img: 'p-tote' },
    { id: 'x3', name: 'GreenGo To-Go Cup', meta: '350 ml, with lid', price: 16, img: 'p-cup' },
    { id: 'x2', name: 'GreenGo T-Shirt', meta: 'Unisex, S to XXL', price: 28, img: 'p-tee' },
    { id: 'x4', name: 'GreenGo Cap', meta: 'One size, adjustable', price: 22, img: 'p-cap' },
    { id: 'x5', name: 'GreenGo Enamel Mug', meta: '350 ml', price: 14, img: 'p-mug' }
  ];
  var JUICES = [
    ['Clean Hydrator', 'Light green and fresh. Start the day with hydration.'],
    ['Digestive Booster', 'Bright yellow citrus. Gently stimulates digestion.'],
    ['Vitality Oxygenator', 'Deep green and herbal. Clean, plant-based energy.'],
    ['Anti-Inflammatory Energy', 'Warm orange. Digestive warmth and comfort.'],
    ['Circulation Flow', 'Ruby red. Promotes flow and gentle vitality.'],
    ['Closing Ritual', 'Aqua green. Accompanies the end of the day.']
  ];
  var GEAR = [
    { name: 'Rocket Appartamento TCA', kind: 'Espresso machine', price: '€1,237.71', img: 'rocket-appartamento', url: 'espresso-machines/941-1233-rocket-appartamento-tca-espresso-machine.html' },
    { name: 'Rancilio Silvia V6', kind: 'Espresso machine', price: '€516.39', img: 'rancilio-silvia', url: 'espresso-machines/68-696-0-rancilio-silvia-coffee-machine.html' },
    { name: 'Eureka Mignon Specialità', kind: 'Coffee grinder', price: '€336.07', img: 'eureka-mignon', url: 'coffee-grinders/55-658-0-eureka-mignon-specialita--coffee-grinder.html' },
    { name: 'Fellow Stagg EKG Pro', kind: 'Electric kettle', price: '€163.93', img: 'fellow-stagg', url: 'accessories/1018-1245-fellow-stagg-ekg-pro-electric-kettle.html' },
    { name: 'Acaia Pearl 2021', kind: 'Coffee scale', price: '€158.20', img: 'acaia-pearl', url: 'accessories/456-1013-0-acaia-pearl-2021-scale.html' },
    { name: 'Rancilio Bottomless Portafilter', kind: 'Accessory', price: '€35.25', img: 'rancilio-portafilter', url: 'accessories/298-0-rancilio-bottomless-portafilter.html' }
  ];
  var INDEX = { m1: { name: 'Ceremonial Matcha', meta: 'Single origin · 40 g', price: 24, img: 'p-matcha' }, kit: { name: '1-Day Reset Kit', meta: 'Six 330 ml cold-pressed juices', price: 35, src: '../assets/img/juice1.webp' } };
  TEAS.concat(COFFEE, MERCH).forEach(function (p) { INDEX[p.id] = p; });
  var imgOf = function (p) { return p.src || P + p.img + '.webp'; };

  /* ---------- render ---------- */
  var prod = function (p) {
    return '<article class="prod" data-type="' + (p.type || '') + '"><div class="prod__img"><img src="' + P + p.img + '.webp" alt="GreenGo ' + p.name + '" loading="lazy" width="1100" height="1100">' +
      (p.tag ? '<span class="prod__tag">' + p.tag + '</span>' : '') + '<button class="prod__add" type="button" data-add="' + p.id + '">Add to cart</button></div>' +
      '<div class="prod__body"><div class="prod__row"><h3>' + p.name + '</h3><span class="prod__price">' + euro(p.price) + '</span></div><p class="prod__meta">' + p.meta + '</p>' + (p.bar ? '<p class="prod__bar">' + p.bar + '</p>' : '') + '</div></article>';
  };
  $('[data-list="teas"]').innerHTML = TEAS.map(function (p) {
    return '<div class="mini"><img src="' + P + p.img + '.webp" alt="GreenGo ' + p.name + '" loading="lazy" width="1100" height="1100"><div><b>' + p.name + '</b><small>' + p.meta + '</small></div><div class="mini__r"><span>' + euro(p.price) + '</span><button class="plus" type="button" data-add="' + p.id + '" aria-label="Add ' + p.name + ' to cart">+</button></div></div>';
  }).join('');
  $('[data-list="coffee"]').innerHTML = COFFEE.map(prod).join('');
  $('[data-list="merch"]').innerHTML = MERCH.map(prod).join('');
  $('[data-list="juices"]').innerHTML = JUICES.map(function (j, i) {
    return '<li class="step"><div class="step__img"><img src="../assets/img/juice' + (i + 1) + '.webp" alt="' + j[0] + ' cold-pressed juice" loading="lazy" width="512" height="512"></div><span class="step__n">0' + (i + 1) + '</span><h3>' + j[0] + '</h3><p>' + j[1] + '</p></li>';
  }).join('');
  $('[data-list="gear"]').innerHTML = GEAR.map(function (g) {
    return '<a class="gitem" href="' + ECS + g.url + '" target="_blank" rel="noopener" aria-label="' + g.name + ', opens on Espresso Coffee Shop"><div class="gitem__img"><img src="' + G + g.img + '.webp" alt="' + g.name + '" loading="lazy" width="900" height="900"></div>' +
      '<div><small>' + g.kind + '</small><h3>' + g.name + '</h3><p class="gitem__p">' + g.price + ' <span>+ VAT</span></p><span class="gitem__go">View at Espresso Coffee Shop <i>↗</i></span></div></a>';
  }).join('');

  /* ---------- cart ---------- */
  var cart = {}, cartEl = $('.cart'), toastT, spotQty = 1;
  function toast(m) { var t = $('.toast'); t.textContent = m; t.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('is-on'); }, 2600); }
  function drawCart() {
    var ids = Object.keys(cart), total = 0, n = 0;
    $('.cart__list').innerHTML = ids.map(function (id) {
      var p = INDEX[id], q = cart[id]; total += p.price * q; n += q;
      return '<li><img src="' + imgOf(p) + '" alt=""><div><h3>' + p.name + '</h3><small>' + p.meta + '</small><br><span class="cart__q"><button type="button" data-q="-1" data-id="' + id + '" aria-label="Remove one">−</button>' + q + '<button type="button" data-q="1" data-id="' + id + '" aria-label="Add one">+</button></span></div><b>' + euro(p.price * q) + '</b></li>';
    }).join('');
    $('.cart__empty').style.display = ids.length ? 'none' : 'grid';
    $('.cart__list').style.display = ids.length ? 'block' : 'none';
    $('.cart__panel footer').style.display = ids.length ? 'grid' : 'none';
    $('[data-cart-total]').textContent = euro(total);
    $$('[data-cart-count]').forEach(function (e) { e.textContent = n; });
  }
  function openCart(o) { cartEl.classList.toggle('is-open', o); cartEl.setAttribute('aria-hidden', o ? 'false' : 'true'); document.documentElement.style.overflow = o ? 'hidden' : ''; if (lenis) o ? lenis.stop() : lenis.start(); }
  function add(id, q) {
    cart[id] = (cart[id] || 0) + q; drawCart();
    toast(INDEX[id].name + ' added to your cart');
    if (hasGsap) gsap.fromTo('.nav__cart b', { scale: 1.6 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-add],[data-cart-open],[data-cart-close],[data-q],[data-checkout],[data-spot-q],[data-filter],[data-rail]');
    if (!t) return;
    if (t.hasAttribute('data-add')) { var sp = t.hasAttribute('data-spot-add'); add(t.getAttribute('data-add'), sp ? spotQty : 1); }
    else if (t.hasAttribute('data-cart-open')) openCart(true);
    else if (t.hasAttribute('data-cart-close')) openCart(false);
    else if (t.hasAttribute('data-q')) { var id = t.getAttribute('data-id'); cart[id] += +t.getAttribute('data-q'); if (cart[id] <= 0) delete cart[id]; drawCart(); }
    else if (t.hasAttribute('data-checkout')) toast('Demo: the WooCommerce checkout opens here');
    else if (t.hasAttribute('data-spot-q')) { spotQty = Math.max(1, Math.min(9, spotQty + +t.getAttribute('data-spot-q'))); $('[data-spot-qty]').textContent = spotQty; $('[data-spot-price]').textContent = euro(24 * spotQty); }
    else if (t.hasAttribute('data-filter')) filter(t);
    else if (t.hasAttribute('data-rail')) { var r = $('.rail'), card = $('.prod', r); r.scrollBy({ left: +t.getAttribute('data-rail') * (card.offsetWidth + 20), behavior: 'smooth' }); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') openCart(false); });
  $('.letter__form').addEventListener('submit', function (e) { e.preventDefault(); toast(/^\S+@\S+\.\S+$/.test($('#em').value.trim()) ? 'Thank you, you are on the list' : 'Please enter a valid email address'); });

  function filter(btn) {
    $$('.filters button').forEach(function (b) { b.classList.toggle('is-on', b === btn); });
    var f = btn.getAttribute('data-filter'), items = $$('.coffee .prod');
    var show = function () { items.forEach(function (it) { it.classList.toggle('is-out', f !== 'all' && it.getAttribute('data-type') !== f); }); if (hasGsap) { gsap.fromTo(items.filter(function (i) { return !i.classList.contains('is-out'); }), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' }); ScrollTrigger.refresh(); } };
    if (hasGsap) gsap.to(items, { opacity: 0, y: -10, duration: 0.2, onComplete: show }); else show();
  }

  /* ---------- header + mobile menu ---------- */
  var nav = $('.nav'), lastY = 0;
  addEventListener('scroll', function () {
    var y = scrollY;
    nav.classList.toggle('is-scrolled', y > 10);
    if (!nav.classList.contains('is-open')) nav.classList.toggle('is-hidden', y > lastY && y > 400);
    lastY = y;
  }, { passive: true });
  $('.nav__menu').addEventListener('click', function () { var o = nav.classList.toggle('is-open'); this.setAttribute('aria-expanded', o); });

  /* ---------- merch rail: drag + progress ---------- */
  var rail = $('.rail'), bar = $('.rail__bar i');
  var railBar = function () { var max = rail.scrollWidth - rail.clientWidth; var w = rail.clientWidth / rail.scrollWidth; bar.style.width = (w * 100) + '%'; bar.style.transform = 'translateX(' + (max > 0 ? rail.scrollLeft / max * (1 / w - 1) * 100 : 0) + '%)'; };
  rail.addEventListener('scroll', railBar, { passive: true }); addEventListener('resize', railBar); railBar();
  if (!touch) {
    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('is-drag'); });
    addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; rail.scrollLeft = sl - dx; });
    addEventListener('pointerup', function () { if (!down) return; down = false; rail.classList.remove('is-drag'); });
    rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  /* ---------- motion ---------- */
  var lenis = null;
  if (hasGsap && !reduce && !touch && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var el = $(a.getAttribute('href')); if (!el) return;
    e.preventDefault(); openCart(false); nav.classList.remove('is-open');
    var y = a.getAttribute('href') === '#top' ? 0 : el.getBoundingClientRect().top + scrollY - 90;
    if (lenis) lenis.scrollTo(y, { duration: 1.4 }); else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  });

  drawCart();
  if (!hasGsap) return;
  if (reduce) { gsap.set('.r-fade', { opacity: 1, y: 0 }); return; }

  var E = 'power3.out';
  /* hero intro */
  var heroLines = $$('.hero__title .ln');
  heroLines.forEach(function (l) { l.innerHTML = '<span>' + l.innerHTML + '</span>'; });
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.nav__in > *', { y: -16, opacity: 0, duration: 1, stagger: 0.08 })
    .from('.hero__img', { clipPath: 'inset(100% 0% 0% 0% round 260px 260px 18px 18px)', duration: 1.6, ease: 'expo.inOut' }, 0)
    .from('.hero__img img', { scale: 1.25, duration: 2.2 }, 0.1)
    .from('.hero__title .ln > span', { yPercent: 110, duration: 1.4, stagger: 0.12 }, 0.35)
    .to('.hero .r-fade', { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.7)
    .from('.hero__card', { y: 30, opacity: 0, duration: 1.2 }, 1.1);
  gsap.to('.hero__img img', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__card', { y: -50, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* generic reveals (outside the hero) */
  $$('.r-fade').filter(function (el) { return !el.closest('.hero'); }).forEach(function (el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: E, scrollTrigger: { trigger: el, start: 'top 90%' } });
  });
  $$('.split').forEach(function (h) {
    if (!window.SplitText) return;
    var s = SplitText.create(h, { type: 'lines', mask: 'lines' });
    gsap.from(s.lines, { yPercent: 105, duration: 1.2, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: h, start: 'top 88%' } });
  });
  $$('main section:not(.hero) .eyebrow').forEach(function (el) { gsap.from(el, { opacity: 0, x: -12, duration: 0.9, ease: E, scrollTrigger: { trigger: el, start: 'top 92%' } }); });

  /* values: hairline draws, items rise */
  gsap.from('.values li', { opacity: 0, y: 20, duration: 0.9, stagger: 0.08, ease: E, scrollTrigger: { trigger: '.values', start: 'top 90%' } });

  /* categories: masked image reveal */
  gsap.from('.cat figure', { clipPath: 'inset(0% 0% 100% 0% round 18px)', duration: 1.4, ease: 'expo.inOut', stagger: 0.1, scrollTrigger: { trigger: '.cats__grid', start: 'top 85%' } });
  gsap.from('.cat div', { opacity: 0, y: 12, duration: 0.9, stagger: 0.1, delay: 0.5, ease: E, scrollTrigger: { trigger: '.cats__grid', start: 'top 85%' } });

  /* spotlight: image eases in, then a slow scale while you read */
  gsap.from('.spot__img', { clipPath: 'inset(8% 8% 8% 8% round 18px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.spot', start: 'top 75%' } });
  gsap.fromTo('.spot__img img', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.spot', start: 'top bottom', end: 'bottom 60%', scrub: true } });
  gsap.from('.mini', { opacity: 0, x: 24, duration: 0.9, stagger: 0.08, ease: E, scrollTrigger: { trigger: '.ritual', start: 'top 90%' } });

  /* coffee grid */
  ScrollTrigger.batch('.coffee .prod', { start: 'top 90%', once: true, onEnter: function (els) { gsap.from(els, { opacity: 0, y: 40, duration: 1, stagger: 0.09, ease: E }); } });

  /* kit: banner parallax + line drawing through the six juices */
  gsap.fromTo('.kit__bg img', { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.kit__banner', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.kit__card', { opacity: 0, x: -40, duration: 1.2, ease: E, scrollTrigger: { trigger: '.kit__banner', start: 'top 75%' } });
  gsap.to('.kit__line i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.kit__steps', start: 'top 80%', end: 'bottom 55%', scrub: 0.5 } });
  gsap.from('.step', { opacity: 0, y: 26, duration: 0.9, stagger: 0.1, ease: E, scrollTrigger: { trigger: '.kit__steps', start: 'top 82%' } });
  gsap.from('.kit__notes li', { opacity: 0, y: 12, duration: 0.8, stagger: 0.08, ease: E, scrollTrigger: { trigger: '.kit__notes', start: 'top 94%' } });

  /* merch rail */
  gsap.from('.rail .prod', { opacity: 0, x: 60, duration: 1.1, stagger: 0.08, ease: E, scrollTrigger: { trigger: '.rail', start: 'top 85%' } });

  /* partner */
  gsap.from('.gear', { clipPath: 'inset(6% 3% 6% 3% round 28px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.gear', start: 'top 85%' } });
  gsap.from('.gitem', { opacity: 0, y: 24, duration: 0.9, stagger: 0.06, ease: E, scrollTrigger: { trigger: '.gear__grid', start: 'top 88%' } });

  /* story: words light up, photos drift */
  var q = $('.story__q');
  q.innerHTML = q.textContent.split(' ').map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
  gsap.to('.story__q .w', { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: q, start: 'top 82%', end: 'bottom 52%', scrub: 0.4 } });
  gsap.fromTo('.story__img--a img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.story__img--b img', { yPercent: 0 }, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* visit */
  gsap.fromTo('.visit__img img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.visit__img', start: 'top bottom', end: 'bottom center', scrub: true } });
  gsap.from('.visit__card', { y: 60, opacity: 0, duration: 1.2, ease: E, scrollTrigger: { trigger: '.visit__card', start: 'top 92%' } });

  /* footer */
  gsap.from('.foot__top > *', { opacity: 0, y: 24, duration: 1, stagger: 0.08, ease: E, scrollTrigger: { trigger: '.foot', start: 'top 92%' } });

  addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
