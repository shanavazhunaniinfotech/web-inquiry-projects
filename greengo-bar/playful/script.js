/* GreenGo – Concept 1: Playful. GSAP + ScrollTrigger + Three.js */
(function () {
  'use strict';
  gsap.registerPlugin(ScrollTrigger);

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var touch = matchMedia('(hover: none), (pointer: coarse)').matches;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = function () { return innerWidth <= 760; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var PAL = ['#60cda2', '#f95844', '#c0679c', '#e5c70c', '#33def8', '#76a630'];
  var INK = '#101010', CREAM = '#fff7e6', LOGO = '../assets/logo-black.svg';
  var euro = function (n) { return '€' + n.toFixed(2); };

  /* ---------- store data (placeholder products for the concept) ---------- */
  var S = 'stroke="' + INK + '" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
  var logoImg = function (x, y, w) { return '<image href="' + LOGO + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + (w * 0.4213).toFixed(1) + '"/>'; };
  var txt = function (y, t, size) { return '<text x="100" y="' + y + '" text-anchor="middle" font-family="GG Display, sans-serif" font-size="' + (size || 16) + '" fill="' + INK + '">' + t + '</text>'; };
  var ART = {
    tin: function (c, label) {
      return '<svg viewBox="0 0 200 220"><g ' + S + '><rect x="44" y="62" width="112" height="146" rx="12" fill="' + CREAM + '"/><rect x="38" y="34" width="124" height="38" rx="10" fill="' + INK + '"/><circle cx="100" cy="128" r="36" fill="' + c + '"/></g>' + logoImg(72, 116, 56) + txt(192, label) + '</svg>';
    },
    pouch: function (c, label) {
      return '<svg viewBox="0 0 200 220"><g ' + S + '><path d="M52 44h96l12 150a12 12 0 0 1-12 14H52a12 12 0 0 1-12-14z" fill="' + CREAM + '"/><path d="M50 30h100v22H50z" fill="' + INK + '"/><rect x="62" y="92" width="76" height="60" rx="12" fill="' + c + '"/></g>' + logoImg(72, 110, 56) + txt(188, label) + '</svg>';
    },
    kit: function (c) {
      return '<svg viewBox="0 0 200 220"><g ' + S + '><path d="M22 122h126a63 62 0 0 1-126 0z" fill="' + CREAM + '"/><ellipse cx="85" cy="122" rx="63" ry="13" fill="#89b647"/><path d="M150 26l16 8-34 66-16-8z" fill="#e5b96a"/><path d="M116 92l-22 30M124 96l-14 34M132 100l-6 36" fill="none"/><rect x="134" y="140" width="52" height="68" rx="8" fill="' + c + '"/><rect x="130" y="126" width="60" height="20" rx="6" fill="' + INK + '"/></g>' + logoImg(141, 166, 38) + '</svg>';
    },
    bag: function (c, label) {
      return '<svg viewBox="0 0 200 240"><g ' + S + '><path d="M48 50h104l12 164a10 10 0 0 1-10 12H46a10 10 0 0 1-10-12z" fill="' + CREAM + '"/><path d="M44 26h112v28H44z" fill="' + INK + '"/><rect x="58" y="96" width="84" height="76" rx="12" fill="' + c + '"/><circle cx="100" cy="76" r="6" fill="' + INK + '"/></g>' + logoImg(68, 108, 64) + '<text x="100" y="158" text-anchor="middle" font-family="GG Display, sans-serif" font-size="13" fill="' + INK + '">' + label + '</text>' + txt(204, '250 G', 15) + '</svg>';
    },
    tote: function (c) {
      return '<svg viewBox="0 0 200 220"><g ' + S + '><path d="M66 82V44a34 34 0 0 1 68 0v38" fill="none"/><path data-tint d="M34 78h132l-8 128H42z" fill="' + c + '"/></g>' + logoImg(58, 118, 84) + '</svg>';
    },
    tee: function (c) {
      return '<svg viewBox="0 0 200 220"><g ' + S + '><path data-tint d="M70 30c8 12 52 12 60 0l48 22-16 40-22-10v116H60V82l-22 10-16-40z" fill="' + c + '"/></g>' + logoImg(66, 96, 68) + '</svg>';
    },
    cap: function (c) {
      return '<svg viewBox="0 0 200 220"><g ' + S + '><path data-tint d="M34 140a66 70 0 0 1 132 0z" fill="' + c + '"/><path d="M100 140h84c8 0 10 18-6 20l-78-2z" fill="' + INK + '"/><circle cx="100" cy="72" r="6" fill="' + INK + '"/></g>' + logoImg(66, 96, 60) + '</svg>';
    },
    cup: function (c) {
      return '<svg viewBox="0 0 200 220"><g ' + S + '><path data-tint d="M52 56h96l-12 148a8 8 0 0 1-8 8H72a8 8 0 0 1-8-8z" fill="' + c + '"/><rect x="42" y="34" width="116" height="24" rx="10" fill="' + INK + '"/><path d="M60 108h80l-3 44H63z" fill="' + CREAM + '"/><rect x="84" y="20" width="32" height="14" rx="5" fill="' + INK + '"/></g>' + logoImg(72, 118, 56) + '</svg>';
    },
    stickers: function (c) {
      return '<svg viewBox="0 0 200 220"><g ' + S + '><circle data-tint cx="78" cy="84" r="52" fill="' + c + '" transform="rotate(-12 78 84)"/><rect x="92" y="112" width="92" height="56" rx="14" fill="#fff" transform="rotate(8 138 140)"/><path d="M52 150l10 22 24 2-18 16 6 24-22-12-20 14 4-24-18-16 24-4z" fill="#ffd800"/></g>' + logoImg(48, 72, 60) + '<g transform="rotate(8 138 140)">' + logoImg(108, 126, 60) + '</g></svg>';
    }
  };
  var DATA = {
    matcha: [
      { id: 'm1', name: 'Ceremonial Matcha', meta: '30 g tin · first harvest, stone-milled', price: 24, c: '#89b647', badge: 'Bestseller', art: 'tin', label: 'CEREMONIAL' },
      { id: 'm2', name: 'Everyday Latte Matcha', meta: '100 g pouch · made for milk', price: 19, c: '#60cda2', art: 'pouch', label: 'LATTE GRADE' },
      { id: 'm3', name: 'Hojicha Powder', meta: '50 g tin · roasted green tea', price: 14, c: '#e5c70c', art: 'tin', label: 'HOJICHA' },
      { id: 'm4', name: 'Matcha Starter Kit', meta: 'Tin + bamboo whisk + bowl', price: 49, was: 57, c: '#c0679c', badge: 'Save €8', art: 'kit' }
    ],
    beans: [
      { id: 'b1', name: 'Old Town Espresso', meta: '250 g · our house espresso', notes: ['Dark chocolate', 'Hazelnut', 'Caramel'], roast: 4, price: 12.5, c: '#f95844', label: 'ESPRESSO' },
      { id: 'b2', name: 'Ocean Blend', meta: '250 g · bright filter roast', notes: ['Stone fruit', 'Honey', 'Citrus'], roast: 2, price: 13.5, c: '#33def8', label: 'OCEAN' },
      { id: 'b3', name: 'Cold Brew Crew', meta: '250 g · built for slow steeping', notes: ['Cocoa', 'Brown sugar', 'Silky'], roast: 3, price: 12.5, c: '#60cda2', label: 'COLD BREW' },
      { id: 'b4', name: 'Decaf, Not Sorry', meta: '250 g · all taste, no buzz', notes: ['Milk chocolate', 'Almond', 'Sweet'], roast: 3, price: 13, c: '#c0679c', label: 'DECAF' },
      { id: 'b5', name: 'Barley & Chicory', meta: '250 g · our caffeine-free option', notes: ['Toasty', 'Malty', 'Zero caffeine'], roast: 5, price: 9, c: '#ffd800', label: 'CAFFEINE-FREE' }
    ],
    merch: [
      { id: 'x1', name: 'Oasis Tote', meta: 'Heavy organic cotton', price: 18, art: 'tote', colors: ['#60cda2', '#fff7e6', '#f95844', '#101010'] },
      { id: 'x2', name: 'Green Mood Tee', meta: 'Unisex · S–XXL', price: 28, art: 'tee', colors: ['#fff7e6', '#b6f25f', '#c0679c', '#33def8'] },
      { id: 'x3', name: 'To-Go Cup', meta: 'Reusable · 350 ml', price: 16, art: 'cup', colors: ['#60cda2', '#c0679c', '#ffd800', '#f95844'], cup: true },
      { id: 'x4', name: 'Old Town Cap', meta: 'One size, adjustable', price: 22, art: 'cap', colors: ['#f95844', '#60cda2', '#ffd800', '#fff7e6'] },
      { id: 'x5', name: 'Sticker Pack', meta: '6 vinyl stickers', price: 6, art: 'stickers', colors: ['#c0679c', '#33def8', '#b6f25f', '#f95844'] }
    ],
    gear: [
      { name: 'Espresso machines', desc: 'Home and prosumer machines, from single boiler to dual boiler.', d: 'M10 10h44v16H10zM14 26v30M50 26v30M8 56h48M24 26v6h16v-6M26 56V46h12v10' },
      { name: 'Coffee grinders', desc: 'Single-dose and on-demand grinders for espresso and filter.', d: 'M18 8h28l-6 18H24zM24 26h16v10H24zM20 36h24v20H20zM44 44h8M32 8V4' },
      { name: 'Tampers & tools', desc: 'Tampers, distributors, knock boxes and barista essentials.', d: 'M26 6h12v22H26zM16 28h32v8H16zM12 44h40v10H12zM22 36v8M42 36v8' },
      { name: 'Kettles & drippers', desc: 'Gooseneck kettles, drippers, servers and paper filters.', d: 'M14 28h28v24a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4zM42 34h6c6 0 6 12 0 12h-6M14 34C4 30 6 14 16 12M18 28v-6h20v6' },
      { name: 'Milk jugs', desc: 'Pitchers for silky microfoam and cleaner latte art.', d: 'M16 14h26l6 8v30a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4zM16 14l-6-4M48 28h4c6 0 6 14 0 14h-4' },
      { name: 'Cleaning & care', desc: 'Descalers, brushes and tablets to keep every shot tasting right.', d: 'M24 6h16v10H24zM20 16h24v16H20zM26 32v24M32 32v24M38 32v24M20 56h24' }
    ],
    kit: { id: 'kit', name: '1-Day Reset Kit', meta: 'Six 330 ml cold-pressed juices', price: 35, c: '#b6f25f' },
    juices: [['Zingy lime-green', '#b6f25f'], ['Sunny yellow', '#ffd800'], ['Deep green', '#89b647'], ['Bright orange', '#ff9d2e'], ['Ruby red', '#f95844'], ['Minty aqua', '#60cda2']]
  };
  var INDEX = {};
  ['matcha', 'beans', 'merch'].forEach(function (k) { DATA[k].forEach(function (p) { INDEX[p.id] = p; }); });
  INDEX.kit = DATA.kit;

  /* ---------- render products ---------- */
  function render() {
    $('[data-products="matcha"]').innerHTML = DATA.matcha.map(function (p) {
      return '<article class="card" style="--c:' + p.c + '">' + (p.badge ? '<span class="card__badge">' + p.badge + '</span>' : '') +
        '<div class="card__art">' + ART[p.art](p.c, p.label) + '</div><div class="card__body"><h4>' + p.name + '</h4><p class="card__meta">' + p.meta + '</p>' +
        '<div class="card__row"><span class="price">' + euro(p.price) + (p.was ? '<s>' + euro(p.was) + '</s>' : '') + '</span><button class="add" type="button" data-add="' + p.id + '">Add <span>+</span></button></div></div></article>';
    }).join('');
    $('[data-products="beans"]').innerHTML = DATA.beans.map(function (p, i) {
      var dots = ''; for (var k = 1; k <= 5; k++) dots += '<i class="' + (k <= p.roast ? 'on' : '') + '"></i>';
      return '<article class="bcard" style="--c:' + p.c + '"><div class="bcard__art"><span class="bcard__no">0' + (i + 1) + '</span>' + ART.bag(p.c, p.label) + '</div>' +
        '<h4>' + p.name + '</h4><p class="bcard__meta">' + p.meta + '</p><ul class="notes">' + p.notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>' +
        '<div class="roast">Roast ' + dots + '</div><div class="grind" role="group" aria-label="Grind"><button type="button" class="on">Whole bean</button><button type="button">Espresso</button><button type="button">Filter</button></div>' +
        '<div class="card__row"><span class="price">' + euro(p.price) + '</span><button class="add" type="button" data-add="' + p.id + '">Add to cart <span>+</span></button></div></article>';
    }).join('');
    var rots = [-4, 3, -2, 5, -3];
    $('[data-products="merch"]').innerHTML = DATA.merch.map(function (p, i) {
      return '<article class="pola" style="--rot:' + rots[i] + 'deg" data-id="' + p.id + '"><div class="pola__art">' + ART[p.art](p.colors[0]) + '</div><h4>' + p.name + '</h4><p class="pola__meta">' + p.meta + '</p>' +
        '<div class="sw" role="group" aria-label="Colour">' + p.colors.map(function (c, k) { return '<button type="button" class="' + (k ? '' : 'on') + '" style="--s:' + c + '" data-sw="' + c + '" aria-label="Colour ' + (k + 1) + '"></button>'; }).join('') + '</div>' +
        '<div class="pola__row"><span class="price">' + euro(p.price) + '</span><button class="add" type="button" data-add="' + p.id + '">Add <span>+</span></button></div></article>';
    }).join('');
    $('[data-gear]').innerHTML = DATA.gear.map(function (g) {
      return '<a class="ticket" href="https://www.espressocoffeeshop.com/" target="_blank" rel="noopener" aria-label="' + g.name + ' at Espresso Coffee Shop (opens partner website)"><span class="ticket__ico"><svg viewBox="0 0 64 64"><path d="' + g.d + '"/></svg></span>' +
        '<span><h4>' + g.name + '</h4><p>' + g.desc + '</p><span class="ticket__ext">Opens espressocoffeeshop.com</span></span><span class="ticket__arrow">↗</span></a>';
    }).join('');
    var seg = '<span>MATCHA <b>✦</b> COFFEE BEANS <b>✦</b> MERCH <b>✦</b> BREW GEAR <b>✦</b> JUICE KITS <b>✦</b></span>';
    $$('.ribbon__track').forEach(function (t) { t.innerHTML = seg + seg + seg + seg; });
  }

  /* ---------- text splitting ---------- */
  function splitChars(el, colour) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
        if (ch.nodeType === 3) {
          var frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            var wd = document.createElement('span'); wd.className = 'wd';
            w.split('').forEach(function (c) {
              var s = document.createElement('span'); s.className = 'ch'; s.textContent = c;
              if (colour) s.style.color = PAL[n % PAL.length];
              n++; wd.appendChild(s);
            });
            frag.appendChild(wd);
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1 && ch.tagName !== 'BR') walk(ch);
      });
    })(el);
    return $$('.ch', el);
  }

  /* ---------- cart ---------- */
  var cart = {}, FREE = 50;
  var cartEl = $('.cart'), toastT;
  function toast(msg) {
    var t = $('.toast'); t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('is-on'); }, 2400);
  }
  function drawCart() {
    var ids = Object.keys(cart), total = 0, count = 0;
    $('.cart__list').innerHTML = ids.map(function (id) {
      var p = INDEX[id], q = cart[id]; total += p.price * q; count += q;
      return '<li><span class="dot" style="--c:' + (p.c || p.colors[0]) + '">' + q + '</span><div><h4>' + p.name + '</h4><small>' + p.meta + '</small><br><span class="qty"><button type="button" data-q="-1" data-id="' + id + '" aria-label="Remove one">−</button>' + q + '<button type="button" data-q="1" data-id="' + id + '" aria-label="Add one">+</button></span></div><b>' + euro(p.price * q) + '</b></li>';
    }).join('');
    $('.cart__empty').style.display = ids.length ? 'none' : 'block';
    $('[data-cart-total]').textContent = euro(total);
    $$('[data-cart-count]').forEach(function (e) { e.textContent = count; });
    var left = FREE - total;
    $('.ship__txt').textContent = total === 0 ? 'Free shipping in Croatia from ' + euro(FREE) + '.' : left > 0 ? 'You are ' + euro(left) + ' away from free shipping.' : 'Free shipping unlocked. Nice.';
    $('.ship__bar i').style.width = clamp(total / FREE * 100, 0, 100) + '%';
  }
  function openCart(o) { cartEl.classList.toggle('is-open', o); cartEl.setAttribute('aria-hidden', o ? 'false' : 'true'); }
  function addToCart(id, btn) {
    cart[id] = (cart[id] || 0) + 1; drawCart();
    var p = INDEX[id], target = $('.nav__cart').getBoundingClientRect(), from = btn.getBoundingClientRect();
    var dot = document.createElement('i'); dot.className = 'fly'; dot.style.background = p.c || p.colors[0];
    document.body.appendChild(dot);
    gsap.set(dot, { x: from.left + from.width / 2 - 23, y: from.top - 10 });
    gsap.to(dot, { x: target.left + target.width / 2 - 23, duration: 0.75, ease: 'power1.in' });
    gsap.to(dot, { y: target.top, duration: 0.75, ease: 'back.in(2.2)', scale: 0.3, onComplete: function () {
      dot.remove();
      gsap.fromTo('.nav__cart', { scale: 1.25, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' });
    } });
    btn.classList.add('is-done'); var old = btn.innerHTML; btn.innerHTML = 'Added ✓';
    setTimeout(function () { btn.classList.remove('is-done'); btn.innerHTML = old; }, 1300);
    toast(p.name + ' is in your cart');
    if (window.gg3dBurst) window.gg3dBurst();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-add],[data-cart-open],[data-cart-close],[data-q],[data-checkout],[data-sw],.grind button');
    if (!t) return;
    if (t.hasAttribute('data-add')) addToCart(t.getAttribute('data-add'), t);
    else if (t.hasAttribute('data-cart-open')) openCart(true);
    else if (t.hasAttribute('data-cart-close')) openCart(false);
    else if (t.hasAttribute('data-q')) { var id = t.getAttribute('data-id'); cart[id] += +t.getAttribute('data-q'); if (cart[id] <= 0) delete cart[id]; drawCart(); }
    else if (t.hasAttribute('data-checkout')) toast(Object.keys(cart).length ? 'Demo only: this is where WooCommerce checkout opens.' : 'Add something tasty first.');
    else if (t.hasAttribute('data-sw')) {
      var card = t.closest('.pola'), c = t.getAttribute('data-sw');
      $$('.sw button', card).forEach(function (b) { b.classList.toggle('on', b === t); });
      $$('[data-tint]', card).forEach(function (n) { n.setAttribute('fill', c); });
      gsap.fromTo($('.pola__art svg', card), { scale: 0.8, rotation: -14 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1,0.45)' });
      if (window.gg3dTint) window.gg3dTint(c);
    } else { $$('button', t.parentNode).forEach(function (b) { b.classList.toggle('on', b === t); }); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') openCart(false); });
  $('.news').addEventListener('submit', function (e) { e.preventDefault(); var v = $('#em').value.trim(); toast(/^\S+@\S+\.\S+$/.test(v) ? 'You are in. 10% code is on its way (demo).' : 'Pop in a valid email first.'); });

  /* ---------- 3D stage ---------- */
  var whiskP = 0, pointer = { x: 0, y: 0 }, intro = { v: 0 }, stageTops = [];
  var OFF = { cup: { x: 1.7, y: 0.3, s: 0.6, rx: 0.3, ry: 2.4, rz: 0.5 }, bowl: { x: 1.8, y: -0.5, s: 0.7, rx: 0.5, ry: 1, rz: 0 }, bag: { x: -1.9, y: 0.2, s: 0.7, rx: 0, ry: -1.4, rz: -0.4 }, tumbler: { x: 1.8, y: 0.4, s: 0.7, rx: 0, ry: 1.5, rz: 0.5 } };
  var STAGES = {
    hero: { cup: { x: 0.44, y: -0.04, s: 1.18, rx: 0.3, ry: -0.35, rz: -0.12, m: { x: 0.3, y: -0.2, s: 0.86 } } },
    matcha: { bowl: { x: 0.5, y: -0.1, s: 1.15, rx: 0.5, ry: 0, rz: 0, m: { x: 0, y: 0.5, s: 0.72 } } },
    'matcha-shelf': { bowl: { x: 1.9, y: 0.9, s: 0.8, rx: 0.5, ry: 2, rz: 0.4 } },
    beans: { bag: { x: -0.5, y: -0.03, s: 1.12, rx: 0.05, ry: 0.45, rz: 0.08, m: { x: 0, y: 0.45, s: 0.74 } } },
    merch: { tumbler: { x: 0.62, y: 0.42, s: 0.78, rx: 0.15, ry: -0.4, rz: -0.18, m: { x: 0.56, y: 0.62, s: 0.5 } } },
    gear: { tumbler: { x: 1.8, y: 1.2, s: 0.6, rx: 0, ry: 3, rz: 0.6 } },
    outro: { cup: { x: 0.58, y: -0.08, s: 1.0, rx: 0.3, ry: Math.PI * 2 - 0.5, rz: -0.14, m: { x: 0.5, y: 0.42, s: 0.55 } } }
  };
  function measureStages() {
    stageTops = $$('[data-stage]').map(function (el) {
      var n = el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el;
      return { name: el.getAttribute('data-stage'), top: n.getBoundingClientRect().top + scrollY };
    });
  }
  function stateOf(i, a) {
    var st = (STAGES[stageTops[i].name] || {})[a] || OFF[a];
    if (small() && st.m) return Object.assign({}, st, st.m);
    return st;
  }

  function init3D() {
    var T = window.THREE, canvas = $('#stage'), renderer;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
    catch (e) { canvas.style.display = 'none'; return; }
    var lite = small() || touch;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, lite ? 1.5 : 2));
    renderer.outputEncoding = T.sRGBEncoding;
    var scene = new T.Scene(), cam = new T.PerspectiveCamera(32, 1, 0.1, 100);
    cam.position.z = 12;
    scene.environment = GG3D.makeEnv(renderer, { top: '#ffffff', bottom: '#ffd9a8', panels: [{ w: 14, h: 8, pos: [6, 9, 8], color: '#ffffff', i: 2.2 }, { w: 6, h: 10, pos: [-12, 2, 2], color: '#ffb3de', i: 1.2 }] });
    scene.add(new T.HemisphereLight(0xffffff, 0xffe2b8, 0.42));
    var sun = new T.DirectionalLight(0xffffff, 0.5); sun.position.set(4, 7, 9); scene.add(sun);
    var std = function (o) { return new T.MeshStandardMaterial(Object.assign({ roughness: 0.42, metalness: 0, envMapIntensity: 0.4 }, o)); };

    /* textures */
    var logo = null;
    var cupTex = GG3D.canvasTex(1536, 640, function (x, w, h) {
      x.fillStyle = '#6fd6c8'; x.fillRect(0, 0, w, h);
      x.strokeStyle = 'rgba(16,16,16,.55)'; x.lineWidth = 5;
      [[0.2, 0.3, 46], [0.27, 0.68, 30], [0.76, 0.34, 34], [0.82, 0.7, 48]].forEach(function (d) {
        x.beginPath(); x.arc(d[0] * w, d[1] * h, d[2], 0, 7); x.stroke();
        for (var k = 0; k < 6; k++) { x.beginPath(); x.moveTo(d[0] * w, d[1] * h); x.lineTo(d[0] * w + Math.cos(k * 1.047) * d[2] * 0.8, d[1] * h + Math.sin(k * 1.047) * d[2] * 0.8); x.stroke(); }
      });
      if (logo) {
        var lw = 560, lh = lw * 0.4213;
        x.drawImage(logo, w / 2 - lw / 2, h * 0.42 - lh / 2, lw, lh);
        x.drawImage(logo, -lw * 0.4, h * 0.5 - lh * 0.4, lw * 0.8, lh * 0.8); x.drawImage(logo, w - lw * 0.4, h * 0.5 - lh * 0.4, lw * 0.8, lh * 0.8);
      }
      x.fillStyle = INK; x.font = '600 30px Poppins, sans-serif'; x.textAlign = 'center';
      x.fillText('@greengodubrovnik', w / 2, h * 0.84);
    });
    var bagTex = GG3D.canvasTex(768, 1178, function (x, w, h) {
      x.fillStyle = CREAM; x.fillRect(0, 0, w, h);
      x.fillStyle = INK; x.fillRect(0, 0, w, 150);
      x.fillStyle = '#f95844'; x.beginPath(); x.arc(w / 2, h * 0.5, 250, 0, 7); x.fill();
      x.lineWidth = 10; x.strokeStyle = INK; x.stroke();
      if (logo) x.drawImage(logo, w / 2 - 200, h * 0.5 - 150, 400, 168);
      x.fillStyle = INK; x.textAlign = 'center';
      x.font = '70px "GG Display", sans-serif'; x.fillText('OLD TOWN', w / 2, h * 0.5 + 90); x.fillText('ESPRESSO', w / 2, h * 0.5 + 160);
      x.font = '600 34px Poppins, sans-serif'; x.fillText('SPECIALTY COFFEE · 250 G', w / 2, h * 0.86);
      x.font = '54px "GG Display", sans-serif'; x.fillText('BEANS WITH BENEFITS', w / 2, h * 0.93);
    });
    var labelTex = GG3D.canvasTex(1536, 640, function (x, w, h) { if (logo) x.drawImage(logo, w / 2 - 250, h * 0.46 - 105, 500, 210); });
    var swirlTex = GG3D.canvasTex(512, 512, function (x, w, h) {
      x.fillStyle = '#86bd35'; x.fillRect(0, 0, w, h);
      x.strokeStyle = 'rgba(214,245,150,.9)'; x.lineCap = 'round';
      for (var k = 0; k < 3; k++) {
        x.lineWidth = 26 - k * 7; x.beginPath();
        for (var a = 0; a < 10; a += 0.1) { var r = 16 + a * 21, px = w / 2 + Math.cos(a + k * 2.1) * r, py = h / 2 + Math.sin(a + k * 2.1) * r; a ? x.lineTo(px, py) : x.moveTo(px, py); }
        x.stroke();
      }
    });
    GG3D.loadImg(LOGO).then(function (img) { logo = img; cupTex.redraw(); bagTex.redraw(); labelTex.redraw(); });
    if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('60px "GG Display"'), document.fonts.load('600 30px Poppins')]).then(function () { cupTex.redraw(); bagTex.redraw(); });

    /* actors */
    var actors = {};
    function actor(name, obj) { var g = new T.Group(); g.add(obj); scene.add(g); actors[name] = { g: g, cur: Object.assign({}, OFF[name]) }; return g; }

    var cup = GG3D.paperCup({ body: std({ map: cupTex, roughness: 0.6 }), rim: std({ color: 0xffffff }), inside: std({ color: 0xf4efe6, side: T.DoubleSide }), coffee: std({ map: GG3D.latteTexture(), roughness: 0.25 }) });
    actor('cup', cup);

    var bowlG = new T.Group();
    var bowl = GG3D.bowl({ clay: std({ color: 0xc0679c, roughness: 0.35, side: T.DoubleSide }), liquid: std({ map: swirlTex, roughness: 0.2 }) });
    bowl.scale.setScalar(1.25); bowl.position.y = -0.75;
    var whisk = GG3D.whisk(std({ color: 0xe9bd74, roughness: 0.7 }));
    whisk.scale.setScalar(1.25); whisk.position.y = 0.1;
    var blob = GG3D.blob(std({ color: 0x7fb62c, roughness: 0.3, envMapIntensity: 0.3 }), lite ? 28 : 40);
    blob.position.set(-1.25, 1.35, 0.2); blob.scale.setScalar(0.34);
    var blob2 = GG3D.blob(std({ color: 0x5f9a1e, roughness: 0.3, envMapIntensity: 0.3 }), 22);
    blob2.position.set(1.35, 0.95, -0.3); blob2.scale.setScalar(0.2);
    bowlG.add(bowl, whisk, blob, blob2);
    actor('bowl', bowlG);

    var bag = GG3D.bag({ front: std({ map: bagTex, roughness: 0.7 }), side: std({ color: 0xfff7e6, roughness: 0.7 }), back: std({ color: 0xf95844, roughness: 0.7 }) });
    actor('bag', bag);

    var liquidMat = std({ color: 0x60cda2, roughness: 0.3 }), strawMat = std({ color: 0xffd800 });
    var tumbler = GG3D.domeCup({ plastic: std({ color: 0xffffff, transparent: true, opacity: 0.26, roughness: 0.08, depthWrite: false, envMapIntensity: 1.2 }), liquid: liquidMat, straw: strawMat, label: new T.MeshBasicMaterial({ map: labelTex, transparent: true, depthWrite: false }) });
    actor('tumbler', tumbler);
    window.gg3dTint = function (c) {
      var col = new T.Color(c);
      gsap.to(liquidMat.color, { r: col.r, g: col.g, b: col.b, duration: 0.5 });
      gsap.fromTo(actors.tumbler.g.rotation, { z: -0.6 }, { z: 0, duration: 1, ease: 'elastic.out(1,0.35)' });
    };

    /* floating beans + confetti drops */
    var NB = lite ? 26 : 50, ND = lite ? 12 : 24, dummy = new T.Object3D();
    var beans = new T.InstancedMesh(GG3D.beanGeometry(), std({ color: 0x4d2713, roughness: 0.36, envMapIntensity: 0.55 }), NB);
    var drops = new T.InstancedMesh(new T.SphereGeometry(1, 18, 14), std({ roughness: 0.2, envMapIntensity: 1 }), ND);
    var bd = [], dd = [], rnd = function (a, b) { return a + Math.random() * (b - a); };
    for (var i = 0; i < NB; i++) bd.push({ x: rnd(-1, 1), y: rnd(-1, 1), z: rnd(-10, 2), s: rnd(0.13, 0.3), r: [rnd(0, 6), rnd(0, 6), rnd(0, 6)], v: [rnd(-0.6, 0.6), rnd(-0.6, 0.6), rnd(-0.6, 0.6)], d: rnd(0.3, 1), kick: 0 });
    for (i = 0; i < ND; i++) { dd.push({ x: rnd(-1, 1), y: rnd(-1, 1), z: rnd(-8, 2), s: rnd(0.07, 0.2), d: rnd(0.4, 1.1), ph: rnd(0, 6) }); drops.setColorAt(i, new T.Color(PAL[i % PAL.length])); }
    drops.instanceColor.needsUpdate = true;
    scene.add(beans, drops);
    var burst = 0; window.gg3dBurst = function () { burst = 1; };

    var vw = 1, vh = 1, unit = 1;
    function resize() {
      var w = innerWidth, h = innerHeight;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      vh = 2 * cam.position.z * Math.tan(cam.fov * Math.PI / 360); vw = vh * cam.aspect;
      unit = Math.min(vh, vw * 1.25) * 0.19;
    }
    resize(); addEventListener('resize', resize);

    var names = Object.keys(actors), keys = ['x', 'y', 's', 'rx', 'ry', 'rz'], last = performance.now(), lastY = scrollY, rain = 0, t = 0;
    function frame() {
      if (document.hidden) return;
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      var H = innerHeight, p = scrollY + H * 0.5, idx = 0, k = 1, vel = scrollY - lastY; lastY = scrollY;
      for (var i = 0; i < stageTops.length; i++) if (stageTops[i].top - H * 0.42 <= p) idx = i;
      if (stageTops.length) {
        k = clamp((p - (stageTops[idx].top - H * 0.42)) / (H * 0.6), 0, 1); k = k * k * (3 - 2 * k);
        var prev = Math.max(0, idx - 1), damp = 1 - Math.pow(0.0018, dt);
        names.forEach(function (n) {
          var a = actors[n], A = stateOf(prev, n), B = stateOf(idx, n), c = a.cur;
          keys.forEach(function (q) { c[q] += ((A[q] + (B[q] - A[q]) * k) - c[q]) * damp; });
          var fl = Math.sin(t * 1.4 + n.length) * 0.07;
          a.g.position.set(c.x * vw / 2, c.y * vh / 2 + fl * unit, 0);
          a.g.scale.setScalar(c.s * unit * intro.v);
          a.g.rotation.set(c.rx + pointer.y * 0.22 + Math.sin(t * 0.9) * 0.04, c.ry + pointer.x * 0.5 + Math.sin(t * 0.6) * 0.12, c.rz + pointer.x * -0.06);
          a.g.visible = Math.abs(c.x) < 1.6;
        });
        var nm = stageTops[idx].name, wantRain = (nm === 'beans' || nm === 'beans-rail') ? 1 : 0;
        rain += (wantRain - rain) * 0.04;
      }
      /* whisking */
      var sp = 2 + whiskP * 15;
      whisk.position.x = Math.sin(t * sp) * 0.42; whisk.position.z = Math.cos(t * sp * 0.7) * 0.2 + 0.1;
      whisk.rotation.z = Math.sin(t * sp) * -0.22; whisk.rotation.x = 0.12;
      bowl.userData.liquid.rotation.z -= dt * (0.4 + whiskP * 5);
      if (actors.bowl.g.visible) { blob.userData.update(t * (1 + whiskP), 0.28 + whiskP * 0.5); blob2.userData.update(t * 1.3 + 4, 0.3 + whiskP * 0.4); blob.position.y = 1.35 + Math.sin(t * 2) * 0.12 + whiskP * 0.5; blob2.position.y = 0.95 + Math.cos(t * 1.7) * 0.15 + whiskP * 0.7; }
      cup.userData.coffee.rotation.z = Math.sin(t * 0.7) * 0.15;
      /* beans */
      burst *= 0.93;
      var R = vh * 0.75, sy = scrollY * 0.0032;
      for (i = 0; i < NB; i++) {
        var b = bd[i], f = (b.z + 10) / 13;
        var yy = b.y * R + sy * f * 3 - t * b.d * (0.12 + rain * 2.6);
        yy = ((yy + R) % (2 * R) + 2 * R) % (2 * R) - R;
        dummy.position.set(b.x * vw * 0.72 + Math.sin(t * 0.4 + i) * 0.15 + pointer.x * f * 0.5, yy + pointer.y * f * 0.3, b.z);
        dummy.rotation.set(b.r[0] + t * b.v[0] * (1 + rain * 2), b.r[1] + t * b.v[1], b.r[2] + t * b.v[2] + vel * 0.004);
        dummy.scale.setScalar(b.s * (1 + rain * 0.5 + burst * 0.6) * intro.v);
        dummy.updateMatrix(); beans.setMatrixAt(i, dummy.matrix);
      }
      beans.instanceMatrix.needsUpdate = true;
      for (i = 0; i < ND; i++) {
        var d = dd[i], g = (d.z + 10) / 13, y2 = d.y * R + sy * g * 4 + t * d.d * 0.18;
        y2 = ((y2 + R) % (2 * R) + 2 * R) % (2 * R) - R;
        dummy.position.set(d.x * vw * 0.7 + Math.sin(t * 0.7 + d.ph) * 0.3, y2, d.z);
        dummy.rotation.set(0, 0, 0);
        var st = 1 + Math.min(0.5, Math.abs(vel) * 0.02);
        dummy.scale.set(d.s * intro.v, d.s * st * intro.v * (1 + burst), d.s * intro.v);
        dummy.updateMatrix(); drops.setMatrixAt(i, dummy.matrix);
      }
      drops.instanceMatrix.needsUpdate = true;
      cam.position.x += (pointer.x * 0.35 - cam.position.x) * 0.05; cam.position.y += (pointer.y * 0.25 - cam.position.y) * 0.05; cam.lookAt(0, 0, 0);
      renderer.render(scene, cam);
    }
    gsap.ticker.add(frame);
  }

  /* ---------- page animation ---------- */
  function animate() {
    var lenis = null;
    if (!touch && !reduce && window.Lenis) {
      lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]'); if (!a) return;
      var el = $(a.getAttribute('href')); if (!el) return;
      e.preventDefault(); openCart(false);
      var y = el.getBoundingClientRect().top + scrollY - (el.id === 'top' ? 200 : 60);
      if (lenis) lenis.scrollTo(y, { duration: 1.3 }); else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });

    /* background colour per section */
    $$('[data-bg]').forEach(function (sec) {
      ScrollTrigger.create({ trigger: sec, start: 'top 55%', end: 'bottom 55%', refreshPriority: -1, onToggle: function (s) { if (s.isActive) gsap.to(document.body, { backgroundColor: sec.getAttribute('data-bg'), duration: 0.7, overwrite: 'auto' }); } });
    });

    /* hero */
    var heroChars = [];
    $$('.hero__line').forEach(function (l) { heroChars = heroChars.concat(splitChars(l, true)); });
    $$('.hero__line').forEach(function (l) {
      gsap.to(l, { x: function () { return +l.getAttribute('data-speed') * innerWidth / 100; }, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true } });
    });
    gsap.to('.hero__spin', { rotation: 360, svgOrigin: '100 100', duration: 16, ease: 'none', repeat: -1 });
    gsap.to('.hero__sticker', { y: -120, rotation: 40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    /* ribbons follow scroll speed */
    var tracks = $$('.ribbon__track').map(function (el) { return { el: el, x: 0, dir: +el.getAttribute('data-dir') }; }), ly = scrollY;
    gsap.ticker.add(function () {
      var v = scrollY - ly; ly = scrollY;
      tracks.forEach(function (tr) {
        var w = tr.el.scrollWidth / 4; if (!w) return;
        tr.x -= tr.dir * (1.1 + Math.abs(v) * 0.35) * (v < 0 ? -1 : 1);
        tr.x = ((tr.x % w) - w) % w;
        tr.el.style.transform = 'translate3d(' + tr.x + 'px,0,0)';
      });
    });

    /* headings */
    $$('.split').forEach(function (h) {
      var ch = splitChars(h);
      gsap.from(ch, { yPercent: 110, rotation: function () { return gsap.utils.random(-18, 18); }, opacity: 0, duration: 0.7, ease: 'back.out(2.4)', stagger: 0.022, scrollTrigger: { trigger: h, start: 'top 88%' } });
    });
    $$('.eyebrow').forEach(function (e) { gsap.from(e, { scale: 0, rotation: -14, duration: 0.6, ease: 'back.out(3)', scrollTrigger: { trigger: e, start: 'top 92%' } }); });

    /* bento */
    gsap.from('.tile', { rotationX: -75, y: 90, opacity: 0, transformOrigin: '50% 100%', duration: 0.9, ease: 'back.out(1.5)', stagger: 0.11, scrollTrigger: { trigger: '.bento', start: 'top 82%' } });
    if (!touch) $$('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) { var r = el.getBoundingClientRect(); gsap.to(el, { rotationY: ((e.clientX - r.left) / r.width - 0.5) * 16, rotationX: ((e.clientY - r.top) / r.height - 0.5) * -14, duration: 0.4, ease: 'power2.out' }); });
      el.addEventListener('mouseleave', function () { gsap.to(el, { rotationY: 0, rotationX: 0, duration: 0.9, ease: 'elastic.out(1,0.5)' }); });
    });

    /* matcha: pinned whisking */
    var steps = $$('.step'), bar = $('.whiskbar i'), mt = $$('.matcha__title span');
    gsap.from(mt, { xPercent: function (i) { return i % 2 ? 40 : -40; }, opacity: 0, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.1, scrollTrigger: { trigger: '.matcha__pin', start: 'top 70%' } });
    ScrollTrigger.create({
      trigger: '.matcha__pin', start: 'top top', end: '+=170%', pin: true, scrub: true,
      onUpdate: function (s) {
        whiskP = s.progress;
        var n = Math.min(2, Math.floor(s.progress * 3));
        steps.forEach(function (el, i) { el.classList.toggle('is-on', i === n); });
        bar.style.transform = 'scaleX(' + s.progress + ')';
        gsap.set(mt[1], { x: Math.sin(s.progress * 40) * 8 * s.progress });
      },
      onLeave: function () { whiskP = 0.15; }, onLeaveBack: function () { whiskP = 0; }
    });
    ScrollTrigger.batch('.card', { start: 'top 90%', once: true, onEnter: function (els) { gsap.from(els, { y: 110, rotation: function () { return gsap.utils.random(-14, 14); }, scale: 0.7, opacity: 0, duration: 0.8, ease: 'back.out(1.8)', stagger: 0.09, clearProps: 'transform' }); } });

    /* beans: horizontal rail */
    gsap.from('.ticks li', { scale: 0, duration: 0.5, ease: 'back.out(3)', stagger: 0.08, scrollTrigger: { trigger: '.ticks', start: 'top 90%' } });
    var mm = gsap.matchMedia();
    mm.add('(min-width: 761px)', function () {
      var track = $('.rail__track'), cards = $$('.bcard');
      var dist = function () { return Math.max(0, track.scrollWidth - innerWidth); };
      gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: '.rail', start: 'top 8%', end: function () { return '+=' + dist(); }, pin: true, scrub: 0.7, invalidateOnRefresh: true, onUpdate: function (s) { gsap.to(cards, { rotation: clamp(s.getVelocity() / -260, -9, 9), duration: 0.35, overwrite: true, ease: 'power2.out', onComplete: function () { gsap.to(cards, { rotation: 0, duration: 0.9, ease: 'elastic.out(1,0.45)' }); } }); } } });
    });
    gsap.from('.bcard', { y: 140, opacity: 0, duration: 0.9, ease: 'back.out(1.5)', stagger: 0.1, scrollTrigger: { trigger: '.rail', start: 'top 85%' } });

    /* merch wall */
    gsap.from('.pola', { y: 160, x: function (i) { return (i - 2) * -90; }, rotation: function () { return gsap.utils.random(-40, 40); }, scale: 0.5, opacity: 0, duration: 1, ease: 'back.out(1.6)', stagger: 0.09, clearProps: 'transform', scrollTrigger: { trigger: '.wall', start: 'top 84%' } });

    /* partner tickets */
    gsap.from('.partnerbar', { y: 40, opacity: 0, duration: 0.7, ease: 'back.out(2)', scrollTrigger: { trigger: '.partnerbar', start: 'top 90%' } });
    $$('.ticket').forEach(function (tk, i) { gsap.from(tk, { x: i % 2 ? 120 : -120, rotation: i % 2 ? 5 : -5, opacity: 0, duration: 0.8, ease: 'back.out(1.5)', clearProps: 'transform', scrollTrigger: { trigger: tk, start: 'top 92%' } }); });

    /* why: bouncing balls */
    gsap.from('.balls li', { y: -420, scale: 0.4, opacity: 0, rotation: function () { return gsap.utils.random(-60, 60); }, duration: 1.3, ease: 'bounce.out', stagger: 0.13, scrollTrigger: { trigger: '.balls', start: 'top 80%' } });
    if (!touch) $$('.balls li').forEach(function (b) { b.addEventListener('mouseenter', function () { gsap.fromTo(b, { scale: 0.9 }, { scale: 1, duration: 0.9, ease: 'elastic.out(1.2,0.3)' }); }); });

    /* kit coverflow */
    var ring = $('.flow__ring'), rot = { v: 40 }, cur = 0, items;
    ring.innerHTML = DATA.juices.map(function (j, i) { return '<figure class="flow__item" style="--c:' + j[1] + '"><img src="../assets/img/juice' + (i + 1) + '.webp" alt="Cold-pressed juice ' + (i + 1) + ' of 6" loading="lazy"><b>N°' + (i + 1) + '</b></figure>'; }).join('');
    items = $$('.flow__item');
    function layFlow() {
      var rad = small() ? 175 : clamp(innerWidth * 0.2, 230, 320);
      items.forEach(function (it, i) {
        var a = i * 60 + rot.v, n = ((a % 360) + 540) % 360 - 180;
        it.style.transform = 'rotateY(' + n + 'deg) translateZ(' + rad + 'px) rotateY(' + (-n * 0.35) + 'deg)';
        it.style.filter = 'brightness(' + (1 - Math.min(0.6, Math.abs(n) / 200)) + ')';
        it.style.zIndex = Math.round(100 - Math.abs(n));
      });
    }
    function goFlow(d) {
      cur += d; var j = DATA.juices[((cur % 6) + 6) % 6];
      gsap.to(rot, { v: -cur * 60, duration: 0.9, ease: 'back.out(1.5)', onUpdate: layFlow });
      $('.flow__label').textContent = 'N°' + (((cur % 6) + 6) % 6 + 1) + ' · ' + j[0];
    }
    layFlow(); $('.flow__label').textContent = 'N°1 · ' + DATA.juices[0][0];
    $$('[data-flow]').forEach(function (b) { b.addEventListener('click', function () { goFlow(+b.getAttribute('data-flow')); clearInterval(auto); }); });
    var auto = null;
    ScrollTrigger.create({ trigger: '.flow', start: 'top 80%', end: 'bottom 10%', onToggle: function (s) { clearInterval(auto); if (s.isActive) { if (rot.v === 40) goFlow(0); auto = setInterval(function () { goFlow(1); }, 2600); } } });
    var dragX = null; var flow = $('.flow');
    flow.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; dragX = e.clientX; clearInterval(auto); });
    addEventListener('pointerup', function (e) { if (dragX === null) return; var dx = e.clientX - dragX; dragX = null; if (Math.abs(dx) > 30) goFlow(dx < 0 ? 1 : -1); });
    addEventListener('resize', layFlow);

    /* visit */
    gsap.fromTo('.visit__photo', { rotation: -12, scale: 0.72 }, { rotation: -2, scale: 1, ease: 'none', scrollTrigger: { trigger: '.visit', start: 'top 90%', end: 'top 25%', scrub: 0.6 } });
    gsap.fromTo('.visit__photo img', { yPercent: -14 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.visit', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.visit__links .chip', { y: 30, opacity: 0, rotation: -8, duration: 0.5, ease: 'back.out(2.5)', stagger: 0.07, scrollTrigger: { trigger: '.visit__links', start: 'top 94%' } });

    /* outro */
    var oc = [];
    $$('.outro__title span').forEach(function (s) { oc = oc.concat(splitChars(s, true)); });
    gsap.from(oc, { yPercent: 120, rotation: function () { return gsap.utils.random(-25, 25); }, duration: 0.9, ease: 'back.out(2)', stagger: 0.05, scrollTrigger: { trigger: '.outro', start: 'top 70%' } });
    if (!reduce) gsap.to(oc, { y: -14, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.09, repeat: -1, yoyo: true } });
    gsap.from('.outro__box', { y: 120, rotation: 6, opacity: 0, duration: 0.9, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.outro__box', start: 'top 96%' } });

    /* mobile bar */
    ScrollTrigger.create({ trigger: '.shop', start: 'top 60%', endTrigger: '.outro', end: 'top 60%', refreshPriority: -1, onToggle: function (s) { $('.mbar').classList.toggle('is-on', s.isActive); } });

    /* magnetic buttons + cursor */
    if (!touch) {
      $$('.magnetic').forEach(function (el) {
        el.addEventListener('mousemove', function (e) { var r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.45, duration: 0.3, ease: 'power2.out' }); });
        el.addEventListener('mouseleave', function () { gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,0.35)' }); });
      });
      var cx = gsap.quickTo('.cursor', 'x', { duration: 0.25, ease: 'power3' }), cy = gsap.quickTo('.cursor', 'y', { duration: 0.25, ease: 'power3' });
      addEventListener('mousemove', function (e) {
        cx(e.clientX); cy(e.clientY);
        pointer.x = (e.clientX / innerWidth - 0.5) * 2; pointer.y = (e.clientY / innerHeight - 0.5) * -2;
        $('.cursor').classList.toggle('is-big', !!e.target.closest('a,button,.flow'));
      });
    } else if (window.DeviceOrientationEvent) {
      addEventListener('deviceorientation', function (e) { if (e.gamma == null) return; pointer.x = clamp(e.gamma / 35, -1, 1); pointer.y = clamp((e.beta - 45) / 45, -1, 1) * -0.6; });
    }

    ScrollTrigger.addEventListener('refresh', measureStages);
    ScrollTrigger.sort(); ScrollTrigger.refresh();
    addEventListener('load', function () { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
    measureStages();
    return heroChars;
  }

  /* ---------- boot ---------- */
  render(); drawCart();
  if (window.THREE && window.GG3D) init3D();
  var heroChars = animate();

  var prog = { v: 0 }, fill = $('.loader__fill'), wave = $('.loader__wave'), num = $('.loader__num');
  var ready = Promise.all([
    new Promise(function (r) { if (document.readyState === 'complete') r(); else addEventListener('load', r); }),
    document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve(),
    new Promise(function (r) { setTimeout(r, 900); })
  ]);
  var setP = function () { num.textContent = Math.round(prog.v); var y = 150 - prog.v * 1.3; fill.setAttribute('y', y); wave.setAttribute('transform', 'translate(0 ' + (y - 150) + ')'); };
  var creep = gsap.to(prog, { v: 82, duration: 2.2, ease: 'power1.out', onUpdate: setP });
  var failSafe = new Promise(function (r) { setTimeout(r, 6000); });
  Promise.race([ready, failSafe]).then(function () {
    creep.kill();
    gsap.to(prog, { v: 100, duration: 0.5, ease: 'power2.in', onUpdate: setP, onComplete: function () {
      ScrollTrigger.sort(); ScrollTrigger.refresh();
      var tl = gsap.timeline();
      tl.to('.loader__cup', { scale: 1.6, rotation: 20, duration: 0.35, ease: 'back.in(2)' })
        .to('.loader', { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '-=0.05')
        .set('.loader', { display: 'none' })
        .from('.nav', { y: -90, duration: 0.7, ease: 'back.out(1.6)' }, '-=0.45')
        .from(heroChars, { yPercent: 130, rotation: function () { return gsap.utils.random(-30, 30); }, duration: 0.8, ease: 'back.out(2.2)', stagger: 0.028 }, '-=0.6')
        .to(intro, { v: 1, duration: 1.4, ease: 'elastic.out(1,0.55)' }, '-=0.9')
        .from('.hero__kicker', { scale: 0, rotation: 20, duration: 0.6, ease: 'back.out(3)' }, '-=1.1')
        .from('.hero__sticker', { scale: 0, duration: 0.7, ease: 'back.out(2.4)' }, '-=0.9')
        .from('.hero__foot > *', { y: 40, opacity: 0, duration: 0.6, ease: 'back.out(1.8)', stagger: 0.08 }, '-=0.8');
    } });
  });
})();
