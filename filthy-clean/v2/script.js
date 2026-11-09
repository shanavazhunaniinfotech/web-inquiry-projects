/* filthy clean · V2 "The Filthy Files" */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var DESK = function () { return window.innerWidth > 960; };
  var store = {
    get: function (k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} }
  };
  var money = function (n) { return '$' + n.toFixed(2); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------- products ---------- */
  var P = {
    linen: { no: 'Nº 01', name: 'Lethal Linen', price: 9.99, cut: 'img/pen-linen.webp', tag: 'Fresh & airy', meta: 'Fresh & airy · 4 mL',
      alias: 'Fresh sheets. Clean air. A little trouble.', known: 'Bright, airy, clean-sheets scent', seen: 'In your tote, before brunch', stamp: 'Armed & airy',
      desc: 'Clean sheets with a bite. A pocket-sized instant stain remover pen with a bright, airy scent that smells like you got away with it.',
      list: ['Scent: fresh, airy, clean sheets', 'Size: 4 mL / 0.14 fl oz', 'Twist, dab and let dry', 'No bleach, parabens, sulfates or optical brighteners'],
      gallery: ['../images/linen.webp', '../images/linen-2.webp', '../images/hero-denim.webp', '../images/meet-nostab.webp'] },
    santal: { no: 'Nº 03', name: 'Sultry Santal', price: 9.99, cut: 'img/pen-santal.webp', tag: 'Warm & woody', meta: 'Warm & woody · 4 mL',
      alias: 'Warm woods. Creamy sandalwood. Anything but innocent.', known: 'Creamy sandalwood with a moody edge', seen: 'Leaving the bar at 1am', stamp: 'Dangerously smooth',
      desc: 'Creamy sandalwood with a moody edge. A pocket-sized instant stain remover pen that fixes the damage and leaves you smelling expensive.',
      list: ['Scent: warm, woody, sandalwood', 'Size: 4 mL / 0.14 fl oz', 'Twist, dab and let dry', 'No bleach, parabens, sulfates or optical brighteners'],
      gallery: ['../images/santal.webp', '../images/meet-scent.webp', '../images/meet-looks.webp', '../images/santal-2.webp'] },
    duo: { no: 'Nº 02', name: 'Dangerous Duo', price: 17.98, was: 19.98, cut: 'img/pens-duo.webp', tag: 'Best value · both scents', meta: 'Linen + Santal · 2 × 4 mL',
      alias: 'Fresh and airy meets warm and woody.', known: 'Lethal Linen + Sultry Santal, 2 × 4 mL', seen: 'One in your bag, one by the door', stamp: 'Most wanted',
      desc: 'Fresh and airy meets warm and woody. Both filthy clean pens in one set: keep one in your bag and one by the door.',
      list: ['Includes 1 Lethal Linen + 1 Sultry Santal', 'Size: 2 × 4 mL / 0.14 fl oz', 'Costs less than buying both separately'],
      gallery: ['../images/duo.webp', '../images/duo-2.webp'] }
  };

  var toastT;
  function toast(m) { var t = $('[data-toast]'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2800); }
  var lenis = null, locks = 0;
  function lock(on) { locks = Math.max(0, locks + (on ? 1 : -1)); document.documentElement.style.overflow = locks ? 'hidden' : ''; if (lenis) locks ? lenis.stop() : lenis.start(); }

  /* ---------- text splitting ---------- */
  function splitInto(el, chars) {
    var out = [];
    function words(text, wrapTag) {
      text.split(/\s+/).filter(Boolean).forEach(function (w) {
        var inner = chars ? w.split('').map(function (c) { return '<span class="ch">' + esc(c) + '</span>'; }).join('') : '<span class="wi">' + esc(w) + '</span>';
        if (wrapTag) inner = '<' + wrapTag + '>' + inner + '</' + wrapTag + '>';
        out.push('<span class="ln" aria-hidden="true">' + inner + '</span>');
      });
    }
    Array.prototype.forEach.call(el.childNodes, function (n) {
      if (n.nodeType === 3) words(n.textContent);
      else if (n.nodeType === 1) { if (n.tagName === 'BR') out.push('<br>'); else words(n.textContent, n.tagName.toLowerCase()); }
    });
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    el.innerHTML = out.join(' ').replace(/ <br> /g, '<br>');
  }
  $$('[data-split]').forEach(function (h) { splitInto(h, false); });
  $$('[data-chars]').forEach(function (h) { splitInto(h, true); });

  /* ---------- cursor ---------- */
  var cur = $('[data-cur]');
  if (FINE && cur) {
    document.documentElement.classList.add('has-cur');
    var dot = $('.cur-dot', cur), ring = $('.cur-ring', cur), lab = $('[data-cur-label]'), mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() {
      rx += (mx - rx) * .2; ry += (my - ry) * .2;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      var l = e.target.closest('[data-cursor]'), h = e.target.closest('a, button, summary, input, label');
      cur.classList.toggle('is-label', !!l); cur.classList.toggle('is-hover', !l && !!h);
      if (l) lab.textContent = l.dataset.cursor;
    });
    document.addEventListener('mousedown', function () { cur.classList.add('is-down'); });
    document.addEventListener('mouseup', function () { cur.classList.remove('is-down'); });
    document.addEventListener('mouseleave', function () { mx = my = -100; });
  }

  /* ---------- nav ---------- */
  var nav = $('[data-nav]'), lastY = 0, menuBtn = $('[data-menu]'), menuP = $('[data-menu-panel]');
  window.addEventListener('scroll', function () {
    var y = window.scrollY, open = menuBtn.getAttribute('aria-expanded') === 'true';
    if (!open) nav.classList.toggle('is-hidden', y > 500 && y > lastY + 3);
    if (y < lastY - 3) nav.classList.remove('is-hidden');
    lastY = y;
  }, { passive: true });
  function menu(open) {
    if ((menuBtn.getAttribute('aria-expanded') === 'true') === open) return;
    menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuP.classList.toggle('on', open); menuP.setAttribute('aria-hidden', String(!open)); lock(open);
  }
  menuBtn.addEventListener('click', function () { menu(menuBtn.getAttribute('aria-expanded') !== 'true'); });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var t = $(id); if (!t) return;
    e.preventDefault(); menu(false);
    setTimeout(function () {
      if (id === '#top') { lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); return; }
      var top = t.getBoundingClientRect().top + window.scrollY;
      // pinned sections: their pin-spacer parent holds the real offset
      if (t.parentNode && t.parentNode.classList && t.parentNode.classList.contains('pin-spacer')) top = t.parentNode.getBoundingClientRect().top + window.scrollY;
      if (id === '#duo' && window.ScrollTrigger && DESK()) { var st = window.ScrollTrigger.getById('duo'); if (st) top = st.end - 2; }
      lenis ? lenis.scrollTo(top, { duration: 1.6 }) : window.scrollTo({ top: top, behavior: RM ? 'auto' : 'smooth' });
    }, locks ? 80 : 0);
  });

  /* ---------- hero: spotlight, pen parallax, picker ---------- */
  (function () {
    var hero = $('[data-hero]'), pens = $('[data-pens]'); if (!hero) return;
    var tx = 0, ty = 0, x = 0, y = 0, inView = true;
    if (FINE && !RM) {
      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', (e.clientX - r.left) + 'px'); hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
        tx = (e.clientX / r.width - .5); ty = (e.clientY / r.height - .5);
      });
      if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { inView = en[0].isIntersecting; }).observe(hero);
      (function loop() {
        if (inView) { x += (tx - x) * .06; y += (ty - y) * .06; pens.style.transform = 'rotateY(' + (x * 16) + 'deg) rotateX(' + (-y * 12) + 'deg) translate(' + (x * 20) + 'px,' + (y * 14) + 'px)'; }
        requestAnimationFrame(loop);
      })();
    }
    var tabs = $$('[data-hp]'), desc = $('[data-hp-desc]'), add = $('[data-hp-add]');
    pens.dataset.front = 'linen';
    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.hp;
        tabs.forEach(function (o) { o.setAttribute('aria-selected', String(o === b)); });
        pens.dataset.front = k; desc.textContent = P[k].alias; add.dataset.add = k; add.setAttribute('aria-label', 'Add ' + P[k].name + ' to cart');
        if (window.gsap && !RM) gsap.fromTo(desc, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out' });
      });
    });
  })();

  /* ---------- tapes with scroll velocity ---------- */
  (function () {
    var tr = $$('[data-tape]'); if (!tr.length) return;
    tr.forEach(function (t) { var s = t.firstElementChild; for (var i = 0; i < 5; i++) t.appendChild(s.cloneNode(true)); });
    var pos = [0, 0], lastS = window.scrollY, vel = 0, seen = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { seen = en[0].isIntersecting; }).observe($('.tapes'));
    (function loop() {
      var sY = window.scrollY, d = sY - lastS; lastS = sY;
      vel += (d - vel) * .1;
      if (seen && !RM) tr.forEach(function (t, i) {
        var dir = +t.dataset.tape, w = t.firstElementChild.offsetWidth || 1;
        pos[i] -= dir * (0.6 + Math.min(12, Math.abs(vel) * .25));
        if (pos[i] <= -w) pos[i] += w; if (pos[i] > 0) pos[i] -= w;
        t.style.transform = 'translateX(' + pos[i] + 'px)';
      });
      requestAnimationFrame(loop);
    })();
  })();

  /* ---------- before / after ---------- */
  (function () {
    var ba = $('[data-ba]'); if (!ba) return;
    var range = $('[data-ba-range]'), down = false;
    function set(p) { p = clamp(p, 0, 100); ba.style.setProperty('--x', p + '%'); range.value = Math.round(p); }
    ba._set = set;
    function at(e) { var r = ba.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; }
    ba.addEventListener('pointerdown', function (e) { down = true; ba.dataset.touched = '1'; set(at(e)); if (e.pointerType === 'mouse') ba.setPointerCapture(e.pointerId); });
    ba.addEventListener('pointermove', function (e) { if (down) set(at(e)); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { ba.addEventListener(ev, function () { down = false; }); });
    range.addEventListener('input', function () { ba.dataset.touched = '1'; set(+range.value); });
    var times = { wine: '· Friday 9:47pm', coffee: '· Monday 8:12am', sauce: '· Lunch at your desk', berry: '· Saturday brunch', makeup: '· Running late' };
    $$('[data-st]').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-st]').forEach(function (o) { o.setAttribute('aria-checked', String(o === b)); });
        ba.dataset.stain = b.dataset.st; $('[data-ba-time]').textContent = times[b.dataset.st];
        if (window.gsap && !RM) { var o = { v: 92 }; gsap.to(o, { v: 46, duration: 1.2, ease: 'power3.inOut', onUpdate: function () { set(o.v); } }); } else set(50);
      });
    });
  })();

  /* ---------- lineup ---------- */
  var rapKey = 'duo';
  (function () {
    var sus = $$('[data-sus]'), beam = $('[data-beam]'), wall = $('[data-wall]'), rap = $('[data-rap]'); if (!sus.length) return;
    function place() {
      var s = $('[data-sus][aria-selected="true"]'), wr = wall.getBoundingClientRect(), r = $('.sus-fig', s).getBoundingClientRect();
      beam.style.left = (r.left - wr.left + r.width / 2) + 'px';
    }
    function select(k, anim) {
      rapKey = k; var p = P[k];
      sus.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.sus === k)); });
      $('[data-rap-no]').textContent = p.no; $('[data-rap-tag]').textContent = p.tag; $('[data-rap-name]').textContent = p.name;
      $('[data-rap-alias]').textContent = p.alias; $('[data-rap-known]').textContent = p.known; $('[data-rap-seen]').textContent = p.seen;
      $('[data-rap-price]').textContent = money(p.price);
      $('[data-rap-was]').textContent = p.was ? money(p.was) : ''; $('[data-rap-was]').hidden = !p.was; $('[data-rap-save]').hidden = !p.was;
      $('[data-rap-stamp]').textContent = p.stamp;
      $('output', rap).textContent = 1;
      if (anim) { rap.classList.remove('swap'); void rap.offsetWidth; rap.classList.add('swap'); }
      place();
    }
    sus.forEach(function (b) {
      b.addEventListener('click', function () { select(b.dataset.sus, true); });
      if (FINE) b.addEventListener('mouseenter', function () { if (b.getAttribute('aria-selected') !== 'true') select(b.dataset.sus, true); });
    });
    window.addEventListener('resize', place); window.addEventListener('load', place);
    select('duo', false);
    $('[data-rap-add]').addEventListener('click', function (e) { add(rapKey, parseInt($('output', rap).textContent, 10) || 1, e.currentTarget); });
    $('[data-rap-qv]').addEventListener('click', function () { openQV(rapKey); });
  })();

  /* ---------- scent split ---------- */
  (function () {
    var st = $('[data-sp]'); if (!st) return;
    var tl = $('.sp-txt-l'), tr = $('.sp-txt-r'), target = 50, s = 50, run = false, down = false;
    var mob = function () { return window.innerWidth <= 960; };
    function apply() {
      st.style.setProperty('--s', s + '%');
      var a, b;
      if (mob()) { a = s > 50 ? 1 : 0; b = s > 50 ? 0 : 1; }
      else { a = clamp((s - 20) / 30, 0, 1); b = clamp((80 - s) / 30, 0, 1); }
      tl.style.opacity = a; tr.style.opacity = b;
      tl.style.pointerEvents = a > .5 ? '' : 'none'; tr.style.pointerEvents = b > .5 ? '' : 'none';
      $$('[data-sp-go]').forEach(function (x) { x.classList.toggle('on', (+x.dataset.spGo > 50) === (s > 50)); });
    }
    function tick() { s += (target - s) * .09; apply(); if (Math.abs(target - s) > .1) requestAnimationFrame(tick); else { s = target; apply(); run = false; } }
    function go(v) { target = clamp(v, 0, 100); if (!run) { run = true; requestAnimationFrame(tick); } }
    st.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'mouse' || down) { var r = st.getBoundingClientRect(); go((e.clientX - r.left) / r.width * 100); }
    });
    st.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' && !e.target.closest('button')) down = true; });
    ['pointerup', 'pointercancel'].forEach(function (ev) { st.addEventListener(ev, function () { down = false; }); });
    st.addEventListener('mouseleave', function () { go(50); });
    $$('[data-sp-go]').forEach(function (b) { b.addEventListener('click', function () { go(+b.dataset.spGo > 50 ? 86 : 14); }); });
    if (mob()) { s = target = 86; }
    apply();
  })();

  /* ---------- qty ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-qty] button'); if (!b || b.closest('.cart-items')) return;
    var o = $('output', b.parentNode), v = parseInt(o.textContent, 10) || 1;
    o.textContent = b === b.parentNode.firstElementChild ? Math.max(1, v - 1) : Math.min(20, v + 1);
  });

  /* ---------- cart ---------- */
  var cart = { linen: 0, santal: 0, duo: 0 };
  try { var sv = JSON.parse(store.get('fc2-cart') || 'null'); if (sv) Object.keys(cart).forEach(function (k) { cart[k] = Math.max(0, parseInt(sv[k], 10) || 0); }); } catch (e) {}
  var drawer = $('[data-cart]'), scrim = $('[data-scrim]'), sticky = $('[data-sticky]');
  function count() { return cart.linen + cart.santal + cart.duo; }
  function render() {
    var n = count(), c = $('[data-cart-count]');
    c.textContent = n; c.classList.toggle('has', n > 0);
    $('[data-cart-open]').setAttribute('aria-label', 'Open cart, ' + n + ' item' + (n === 1 ? '' : 's'));
    $('[data-cart-n]').textContent = n ? '(' + n + ')' : '';
    var h = '', sub = 0;
    ['duo', 'linen', 'santal'].forEach(function (k) {
      if (!cart[k]) return; var p = P[k]; sub += p.price * cart[k];
      h += '<li><div class="ci-img"><img src="' + p.cut + '" alt=""></div><div><h3>' + p.name + '</h3><p class="mono">' + esc(p.meta) + '</p>' +
        '<div class="qty" data-qty><button type="button" data-dq="-1" data-k="' + k + '" aria-label="Decrease ' + p.name + '">−</button><output>' + cart[k] + '</output><button type="button" data-dq="1" data-k="' + k + '" aria-label="Increase ' + p.name + '">+</button></div></div>' +
        '<div class="ci-p">' + money(p.price * cart[k]) + (p.was ? '<s>' + money(p.was * cart[k]) + '</s>' : '') + '<button type="button" class="ci-rm" data-rm="' + k + '">Remove</button></div></li>';
    });
    if (!n) h = '<li class="cart-empty"><strong>Nothing to hide… yet.</strong><span>Your stash is empty.</span><a class="btn btn-gold btn-sm" href="#duo" data-close-go><span class="btn-t" data-text="Meet the Dangerous Duo">Meet the Dangerous Duo</span></a></li>';
    $('[data-items]').innerHTML = h; $('[data-subtotal]').textContent = money(sub);
    var g = $('[data-goal]');
    if (cart.duo) g.textContent = '✦ Nice. You\'re saving ' + money(2 * cart.duo) + ' with the Dangerous Duo.';
    else if (cart.linen && cart.santal) g.textContent = '✦ You have both scents. Swap to the Duo and save $2.';
    else if (n) g.textContent = '✦ Get the other scent as the Duo and save $2.';
    else g.textContent = '✦ Both scents together in the Duo save you $2.';
    var up = $('[data-up]'), u = '';
    if (cart.linen && cart.santal) u = '<img src="img/pens-duo.webp" alt=""><div><strong>Swap to the Dangerous Duo</strong>Same two pens, $2 less.</div><button type="button" class="btn btn-gold" data-swap><span class="btn-t" data-text="Swap">Swap</span></button>';
    else if ((cart.linen || cart.santal) && !cart.duo) { var have = cart.linen ? 'linen' : 'santal', other = have === 'linen' ? 'santal' : 'linen'; u = '<img src="' + P[other].cut + '" alt=""><div><strong>Bring an accomplice</strong>Add ' + P[other].name + ', pay $17.98 for both.</div><button type="button" class="btn btn-gold" data-upgrade="' + have + '"><span class="btn-t" data-text="+ $7.99">+ $7.99</span></button>'; }
    up.innerHTML = u; up.hidden = !u;
    var ck = $('[data-checkout]'); ck.disabled = !n; ck.style.opacity = n ? '' : '.4';
    store.set('fc2-cart', JSON.stringify(cart));
    updSticky();
  }
  function openCart() { if (drawer.classList.contains('on')) return; drawer.classList.add('on'); scrim.classList.add('on'); drawer.setAttribute('aria-hidden', 'false'); lock(true); updSticky(); setTimeout(function () { $('[data-cart-close]').focus({ preventScroll: true }); }, 120); }
  function closeCart() { if (!drawer.classList.contains('on')) return; drawer.classList.remove('on'); scrim.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); lock(false); updSticky(); }
  function fly(from, k) {
    var btn = $('[data-cart-open]'); if (!from || RM || !btn.animate) return;
    var a = from.getBoundingClientRect(), b = btn.getBoundingClientRect();
    if (nav.classList.contains('is-hidden')) nav.classList.remove('is-hidden');
    var im = document.createElement('img'); im.src = P[k].cut; im.alt = '';
    im.style.cssText = 'position:fixed;z-index:450;height:90px;width:auto;pointer-events:none;left:' + (a.left + a.width / 2) + 'px;top:' + (a.top + a.height / 2 - 45) + 'px;filter:drop-shadow(0 10px 14px rgba(0,0,0,.5))';
    document.body.appendChild(im);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    im.animate([{ transform: 'translate(-50%,0) rotate(0) scale(1)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + dx * .45 + 'px),' + (dy * .45 - 140) + 'px) rotate(200deg) scale(.8)', opacity: 1, offset: .55 }, { transform: 'translate(calc(-50% + ' + dx + 'px),' + dy + 'px) rotate(360deg) scale(.15)', opacity: .3 }], { duration: 850, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = function () { im.remove(); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump'); };
  }
  function add(k, q, from) {
    cart[k] = Math.min(99, cart[k] + q); render(); fly(from, k);
    if (from && from.classList.contains('btn')) {
      var t = $('.btn-t', from), old = t.innerHTML, od = t.dataset.text; from.classList.add('is-added'); t.textContent = 'Added ✓'; t.dataset.text = 'Added ✓';
      setTimeout(function () { from.classList.remove('is-added'); t.innerHTML = old; t.dataset.text = od; }, 1600);
    }
    setTimeout(openCart, RM ? 0 : 750);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-add]');
    if (a) { var box = a.closest('.do-buy, .rap-buy'), o = box && $('[data-qty] output', box); add(a.dataset.add, o ? parseInt(o.textContent, 10) || 1 : 1, a); return; }
    var dq = e.target.closest('[data-dq]'); if (dq) { cart[dq.dataset.k] = Math.max(0, cart[dq.dataset.k] + +dq.dataset.dq); render(); return; }
    var rm = e.target.closest('[data-rm]'); if (rm) { cart[rm.dataset.rm] = 0; render(); return; }
    if (e.target.closest('[data-swap]')) { var m = Math.min(cart.linen, cart.santal); cart.linen -= m; cart.santal -= m; cart.duo += m; render(); toast('Swapped to the Dangerous Duo. You saved ' + money(2 * m) + '.'); return; }
    var ug = e.target.closest('[data-upgrade]'); if (ug) { cart[ug.dataset.upgrade] -= 1; cart.duo += 1; render(); toast('Upgraded to the Dangerous Duo.'); return; }
    if (e.target.closest('[data-close-go]')) { closeCart(); return; }
    if (e.target.closest('[data-cart-open]')) { openCart(); return; }
    if (e.target.closest('[data-cart-close]') || e.target === scrim) { closeCart(); return; }
    if (e.target.closest('[data-checkout]')) toast('Prototype: this hands off to Shopify secure checkout.');
  });

  /* ---------- quick view ---------- */
  var qv = $('[data-qv]'), qvK = 'duo', qvLast;
  function openQV(k) {
    var p = P[k]; qvK = k; qvLast = document.activeElement;
    $('[data-qv-tag]').textContent = p.tag; $('[data-qv-name]').textContent = p.name;
    $('[data-qv-price]').innerHTML = money(p.price) + (p.was ? '<s>' + money(p.was) + '</s>' : '');
    $('[data-qv-desc]').textContent = p.desc;
    $('[data-qv-list]').innerHTML = p.list.map(function (l) { return '<li><svg><use href="#i-check"/></svg>' + esc(l) + '</li>'; }).join('');
    var img = $('[data-qv-img]'); img.src = p.gallery[0]; img.alt = p.name;
    $('[data-qv-th]').innerHTML = p.gallery.map(function (g, i) { return '<button type="button" aria-label="Photo ' + (i + 1) + '" aria-current="' + (i === 0) + '" data-g="' + g + '"><img src="' + g + '" alt=""></button>'; }).join('');
    $('output', $('[data-qv-qty]')).textContent = 1;
    qv.classList.add('on'); qv.setAttribute('aria-hidden', 'false'); lock(true);
    setTimeout(function () { $('[data-qv-close]').focus({ preventScroll: true }); }, 100);
  }
  function closeQV() { if (!qv.classList.contains('on')) return; qv.classList.remove('on'); qv.setAttribute('aria-hidden', 'true'); lock(false); if (qvLast) qvLast.focus({ preventScroll: true }); }
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-g]'); if (g) { $('[data-qv-img]').src = g.dataset.g; $$('[data-g]').forEach(function (o) { o.setAttribute('aria-current', String(o === g)); }); return; }
    if (e.target.closest('[data-qv-close]') || e.target === qv) { closeQV(); return; }
    if (e.target.closest('[data-qv-add]')) { var q = parseInt($('output', $('[data-qv-qty]')).textContent, 10) || 1; closeQV(); add(qvK, q, null); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeQV(); closeCart(); menu(false); } });

  /* ---------- sticky ---------- */
  var heroGone = false, blockers = new Set();
  function updSticky() {
    var on = heroGone && !blockers.size && !drawer.classList.contains('on') && !cart.duo;
    sticky.classList.toggle('on', on); sticky.setAttribute('aria-hidden', String(!on)); $('button', sticky).tabIndex = on ? 0 : -1;
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { heroGone = !en[0].isIntersecting && en[0].boundingClientRect.top < 0; updSticky(); }).observe($('.hero'));
    var bo = new IntersectionObserver(function (en) { en.forEach(function (x) { x.isIntersecting ? blockers.add(x.target) : blockers.delete(x.target); }); updSticky(); }, { rootMargin: '-10% 0px' });
    ['.duo-offer', '.rap', '.join', '.ftr', '.hero-pick'].forEach(function (s) { var el = $(s); if (el) bo.observe(el); });
  }
  render();

  /* ---------- compare toggle ---------- */
  (function () {
    var v = $('[data-vs]'), t = $('[data-vs-tgl]'); if (!v) return;
    t.addEventListener('click', function () {
      var us = t.getAttribute('aria-checked') !== 'true'; t.setAttribute('aria-checked', String(us));
      v.classList.toggle('is-b', !us);
      $$('dd', v).forEach(function (d, i) {
        setTimeout(function () { d.classList.add('out'); setTimeout(function () { d.textContent = us ? d.dataset.a : d.dataset.b; d.classList.remove('out'); }, 220); }, i * 70);
      });
    });
  })();

  /* ---------- FAQ accordion ---------- */
  $$('[data-acc] details').forEach(function (d) {
    var s = $('summary', d), b = $('.ans', d);
    s.addEventListener('click', function (e) {
      if (RM || !b.animate) return; e.preventDefault();
      if (d.open) { var h = b.offsetHeight; b.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = function () { d.open = false; }; }
      else {
        $$('[data-acc] details[open]').forEach(function (o) { if (o !== d) $('summary', o).click(); });
        d.open = true; var h2 = b.offsetHeight;
        b.animate([{ height: '0px', opacity: 0 }, { height: h2 + 'px', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' });
        var p = $('p', b); p.animate([{ transform: 'translateY(14px)', filter: 'blur(4px)' }, { transform: 'none', filter: 'blur(0)' }], { duration: 600, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
    });
  });

  /* ---------- subscribe ---------- */
  (function () {
    var f = $('[data-sub]'); if (!f) return; var msg = $('[data-sub-msg]');
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var v = $('input', f).value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { f.classList.add('err'); msg.textContent = 'That email looks a little messy. Try again?'; $('input', f).focus(); return; }
      var ok = document.createElement('p'); ok.className = 'sub-ok'; ok.innerHTML = 'You\'re in, Filthy Animal. <em style="color:var(--gold)">Check your inbox for 20% off.</em>';
      f.replaceWith(ok); msg.textContent = '';
    });
  })();

  /* ---------- magnetic ---------- */
  if (FINE && !RM) $$('[data-magnetic]').forEach(function (b) {
    b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .2 + 'px,' + (e.clientY - r.top - r.height / 2) * .3 + 'px)'; });
    b.addEventListener('mouseleave', function () { b.style.transform = ''; });
  });

  /* =========================================================
     GSAP choreography
     ========================================================= */
  function done() { var l = $('[data-ld]'); if (l) l.remove(); }
  (function fx() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST || RM) { done(); document.documentElement.classList.add('no-fx'); return; }
    gsap.registerPlugin(ST);
    if (window.Lenis) {
      lenis = new Lenis({ lerp: .09, smoothWheel: true, prevent: function (n) { return !!(n.closest && n.closest('.cart, .qv, .menu')); } });
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0);
      if (locks) lenis.stop();
    }

    /* base pen transforms (GSAP owns them) */
    gsap.set('.pen-l', { xPercent: -75, yPercent: -52, rotation: -16 });
    gsap.set('.pen-s', { xPercent: -25, yPercent: -48, rotation: 14 });

    /* --- loader + intro --- */
    var first = !store.get('fc2-ld', true); store.set('fc2-ld', '1', true);
    gsap.set('.hh-in', { yPercent: 110 });
    gsap.set('.pen-l', { y: '110vh', rotation: -60 }); gsap.set('.pen-s', { y: '120vh', rotation: 60 });
    gsap.set(['.hero-file', '.hero-copy > *', '.hero-pick', '.hero-scroll'], { opacity: 0, y: 30 });
    gsap.set('.nav', { yPercent: -160 });
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    if (first) {
      var n = { v: 0 }, nEl = $('[data-ld-n]');
      tl.from('.ld-word span', { yPercent: 110, duration: 1, stagger: .06 })
        .from('.ld-k, .ld-n', { opacity: 0, duration: .6 }, '<')
        .to(n, { v: 100, duration: 1.2, ease: 'power2.inOut', onUpdate: function () { nEl.textContent = String(Math.round(n.v)).padStart(2, '0'); } }, '<')
        .to('.ld-word span', { yPercent: -110, duration: .7, stagger: .04, ease: 'power3.in' }, '+=.05')
        .to('.ld-k, .ld-n', { opacity: 0, duration: .3 }, '<')
        .to('.ld-top', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=.15')
        .to('.ld-bot', { yPercent: 100, duration: 1.1, ease: 'expo.inOut' }, '<');
    } else tl.to('.ld', { opacity: 0, duration: .3 });
    tl.add(done, '-=.3')
      .to('.pen-l', { y: 0, rotation: -16, duration: 1.8 }, '-=.75')
      .to('.pen-s', { y: 0, rotation: 14, duration: 1.8 }, '<.08')
      .to('.hh-in', { yPercent: 0, duration: 1.4, stagger: .12 }, '<.15')
      .from('.splash', { scale: 0, opacity: 0, duration: 2 }, '<')
      .to('.nav', { yPercent: 0, duration: 1.2 }, '<.3')
      .to(['.hero-file', '.hero-copy > *', '.hero-pick', '.hero-scroll'], { opacity: 1, y: 0, duration: 1.1, stagger: .08 }, '<.1')
      .add(function () { gsap.set(['.hero-copy > *', '.hero-pick', '.nav'], { clearProps: 'transform' }); });
    setTimeout(function () { if ($('[data-ld]')) { tl.progress(1); done(); } }, 7000);
    tl.add(function () { gsap.to('.pen', { y: -14, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: .6 }); });

    var mm = gsap.matchMedia();

    /* --- hero scroll-out (desktop pin) --- */
    mm.add('(min-width: 961px)', function () {
      var h = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=70%', pin: true, scrub: .8 } });
      h.to('.hh-1', { xPercent: -40, opacity: 0, ease: 'none' }, 0)
        .to('.hh-2', { xPercent: 40, opacity: 0, ease: 'none' }, 0)
        .to('.pen-l', { rotation: -2, xPercent: -110, scale: 1.12, ease: 'none' }, 0)
        .to('.pen-s', { rotation: 2, xPercent: 10, scale: 1.12, ease: 'none' }, 0)
        .to(['.hero-foot', '.hero-file', '.hero-scroll'], { opacity: 0, y: 40, ease: 'none' }, 0)
        .to('.pen', { opacity: 0, ease: 'power1.in', duration: .5 }, .5);
    });

    /* --- incident: pinned cinematic sequence --- */
    var progLis = $$('.inc-prog li');
    gsap.set('.inc-1', { clipPath: 'circle(0% at 50% 55%)' });
    gsap.set('.inc-2', { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set('.inc-3', { clipPath: 'circle(0% at 62% 60%)' });
    gsap.set('.inc-img img', { scale: 1.3 });
    gsap.set('.inc-cap', { opacity: 0, y: 60 });
    gsap.set('.inc-prog', { opacity: 0 });
    var it = gsap.timeline({ scrollTrigger: { trigger: '.inc', start: 'top top', end: '+=330%', pin: true, scrub: .8, anticipatePin: 1,
      onUpdate: function (s) {
        var p = s.progress, seg = [[.18, .42], [.42, .7], [.7, .94]];
        progLis.forEach(function (li, i) { var v = clamp((p - seg[i][0]) / (seg[i][1] - seg[i][0]), 0, 1); li.querySelector('i').style.setProperty('--p', v); li.classList.toggle('on', p >= seg[i][0]); });
      } } });
    it.fromTo('.inc-0 .ch', { yPercent: 0, opacity: 1 }, { yPercent: -110, opacity: 0, stagger: { each: .006, from: 'random' }, duration: .5, ease: 'power2.in', immediateRender: false }, .3)
      .to('.inc-time, .inc-sub', { opacity: 0, duration: .3 }, .3)
      .to('.inc-1', { clipPath: 'circle(150% at 50% 55%)', duration: 1.2, ease: 'power2.inOut' }, .6)
      .to('.inc-1 img', { scale: 1, duration: 1.6, ease: 'power2.out' }, .6)
      .to('.inc-prog', { opacity: 1, duration: .3 }, 1.2)
      .to('[data-cap="1"]', { opacity: 1, y: 0, duration: .5 }, 1.3)
      .to('[data-cap="1"]', { opacity: 0, y: -60, duration: .4 }, 2.4)
      .to('.inc-2', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut' }, 2.5)
      .to('.inc-2 img', { scale: 1, duration: 1.4, ease: 'power2.out' }, 2.5)
      .to('[data-cap="2"]', { opacity: 1, y: 0, duration: .5 }, 3.2)
      .to('[data-cap="2"]', { opacity: 0, y: -60, duration: .4 }, 4.3)
      .to('.inc-3', { clipPath: 'circle(150% at 62% 60%)', duration: 1.2, ease: 'power2.inOut' }, 4.4)
      .to('.inc-3 img', { scale: 1, duration: 1.5, ease: 'power2.out' }, 4.4)
      .to('[data-cap="3"]', { opacity: 1, y: 0, duration: .5 }, 5.1)
      .to({}, { duration: .8 }, 5.6);
    // intro chars of incident title rise in before pin
    gsap.from('.inc-0 .ch', { yPercent: 110, duration: 1, stagger: .015, ease: 'expo.out', scrollTrigger: { trigger: '.inc', start: 'top 70%', once: true } });

    /* --- generic split reveals --- */
    $$('[data-split]').forEach(function (h) {
      gsap.from($$('.wi', h), { yPercent: 115, rotate: 4, duration: 1.2, stagger: .05, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
    });
    $$('.kick, .lede, .ex-chips, .ex-copy .fine, .vs, .faq-l .btn-txt, .join-perks, .sub').forEach(function (el) {
      if (el.closest('.inc, .duo-intro')) return;
      gsap.from(el, { opacity: 0, y: 26, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });

    /* --- exhibit: frame + handle invites interaction --- */
    gsap.fromTo('.ba', { clipPath: 'inset(15% 10% 15% 10% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.ba', start: 'top 85%', once: true } });
    var ba = $('[data-ba]');
    ST.create({ trigger: '.ba', start: 'top 60%', once: true, onEnter: function () {
      if (ba.dataset.touched) return; var o = { v: 92 };
      gsap.to(o, { v: 30, duration: 1.4, ease: 'power3.inOut', delay: .4, onUpdate: function () { if (!ba.dataset.touched) ba._set(o.v); } });
      gsap.to(o, { v: 52, duration: 1.1, ease: 'power3.inOut', delay: 1.9, onUpdate: function () { if (!ba.dataset.touched) ba._set(o.v); } });
    } });

    /* --- lineup --- */
    gsap.from('.lu-wall', { clipPath: 'inset(0 0 100% 0 round 28px)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.lu-wall', start: 'top 80%', once: true } });
    gsap.from('.sus', { y: 120, opacity: 0, duration: 1.2, stagger: .14, ease: 'expo.out', delay: .5, scrollTrigger: { trigger: '.lu-wall', start: 'top 80%', once: true } });
    gsap.from('.lu-beam', { opacity: 0, duration: .6, delay: 1.3, scrollTrigger: { trigger: '.lu-wall', start: 'top 80%', once: true } });
    gsap.from('.rap', { x: 60, rotate: 3, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.rap', start: 'top 85%', once: true } });
    gsap.from('.rap-stamp', { scale: 2.6, opacity: 0, duration: .5, ease: 'back.out(2)', delay: .8, scrollTrigger: { trigger: '.rap', start: 'top 80%', once: true } });

    /* --- split: entrance --- */
    gsap.fromTo('.sp-stage', { clipPath: 'inset(8% 6% 8% 6% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: '.split', start: 'top bottom', end: 'top top', scrub: true } });
    gsap.fromTo('.sp-side img', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.split', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.sp-title', { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.split', start: 'top 40%', once: true } });

    /* --- duo: partners in crime --- */
    mm.add('(min-width: 961px)', function () {
      gsap.set('.dp-l', { xPercent: -104, yPercent: -50, x: '-55vw', rotation: -70 });
      gsap.set('.dp-s', { xPercent: 4, yPercent: -50, x: '55vw', rotation: 70 });
      gsap.set('.duo-offer', { x: 80, opacity: 0 });
      gsap.set('.duo-glow', { scale: 0 });
      gsap.set('.do-was s', { '--strike': 0 });
      gsap.from('.duo-h .ch', { yPercent: 110, stagger: .012, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.duo', start: 'top 65%', once: true } });
      var inT = gsap.timeline({ scrollTrigger: { trigger: '.duo', start: 'top bottom', end: 'top top', scrub: .8 } });
      inT.to('.dp-l', { x: 0, rotation: -3, ease: 'power2.out' }, 0).to('.dp-s', { x: 0, rotation: 3, ease: 'power2.out' }, 0);
      var d = gsap.timeline({ scrollTrigger: { id: 'duo', trigger: '.duo', start: 'top top', end: '+=110%', pin: true, scrub: .8 } });
      d.to('.duo-glow', { scale: 1.4, duration: .5 }, 0)
        .to('.duo-bg', { xPercent: -30, duration: 2, ease: 'none' }, 0)
        .to('.dp-l', { rotation: -8, xPercent: -96, duration: .5 }, 0)
        .to('.dp-s', { rotation: 8, xPercent: -4, duration: .5 }, 0)
        .to('.duo-offer', { x: 0, opacity: 1, duration: .6, ease: 'power3.out' }, .2)
        .to('.do-was s', { '--strike': 1, duration: .4 }, .6)
        .from('.do-list li, .do-buy, .do-assure', { y: 20, opacity: 0, stagger: .08, duration: .4 }, .6)
        .to({}, { duration: .5 });
      return function () { gsap.set(['.dp-l', '.dp-s', '.duo-offer', '.duo-glow', '.do-list li', '.do-buy', '.do-assure'], { clearProps: 'all' }); };
    });
    mm.add('(max-width: 960px)', function () {
      gsap.set('.dp-l', { xPercent: -104, yPercent: -50, rotation: -3 });
      gsap.set('.dp-s', { xPercent: 4, yPercent: -50, rotation: 3 });
      gsap.from('.dp-l', { x: '-80vw', rotation: -60, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.duo-stage', start: 'top 80%', once: true } });
      gsap.from('.dp-s', { x: '80vw', rotation: 60, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.duo-stage', start: 'top 80%', once: true } });
      gsap.from('.duo-h .ch', { yPercent: 110, stagger: .015, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.duo-h', start: 'top 85%', once: true } });
      gsap.fromTo('.do-was s', { '--strike': 0 }, { '--strike': 1, duration: .6, delay: .4, scrollTrigger: { trigger: '.duo-offer', start: 'top 80%', once: true } });
      gsap.from('.duo-offer', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.duo-offer', start: 'top 88%', once: true } });
      gsap.to('.duo-bg', { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.duo', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.to('.duo-stage', { y: -12, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    /* --- record: redactions lift, stamp slams --- */
    gsap.from('.doc-paper', { y: 120, rotate: 10, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.doc', start: 'top 85%', once: true } });
    var rt = gsap.timeline({ scrollTrigger: { trigger: '.doc', start: 'top 55%', once: true } });
    rt.to('.red i', { scaleX: 0, duration: .5, stagger: .22, ease: 'power3.inOut', delay: .3 })
      .from('.doc-stamp', { scale: 3.2, opacity: 0, rotate: -40, duration: .45, ease: 'power4.in' })
      .to('.doc-paper', { x: 4, duration: .06, yoyo: true, repeat: 3, ease: 'none' });

    /* --- wild gallery parallax --- */
    $$('.wc').forEach(function (c) {
      gsap.fromTo(c, { yPercent: 0 }, { yPercent: +c.dataset.speed, ease: 'none', scrollTrigger: { trigger: '.wild', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.from('.wc figure', { clipPath: 'inset(100% 0 0 0 round 18px)', duration: 1.4, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.wild', start: 'top 75%', once: true } });

    /* --- faq list --- */
    gsap.from('.faq-list details', { y: 40, opacity: 0, stagger: .07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.faq-list', start: 'top 85%', once: true } });

    /* --- join --- */
    gsap.from('.join-h .ch', { yPercent: 110, rotate: 8, stagger: .02, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.join-h', start: 'top 85%', once: true } });

    /* --- footer --- */
    gsap.from('.ftr-big', { yPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.ftr', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
    window.addEventListener('load', function () { ST.refresh(); });
  })();
  setTimeout(function () { if (!window.gsap) done(); }, 3000);
})();
