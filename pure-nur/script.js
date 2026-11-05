/* Pure Nur — cinematic home page concept: interactions */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  var gbp = function (n) { return '£' + n.toFixed(2); };
  var pence = function (n) { return n < 1 ? Math.round(n * 100) + 'p' : gbp(n); };

  /* ---------- Catalogue ---------- */
  var P = {
    collagen: {
      name: 'Pure Nur Collagen', price: 29, img: 'images/collagen.webp', theme: 'collagen',
      rating: '4.9 · 128 reviews', caption: '300 g · 30 servings · Unflavoured', servings: 30,
      desc: 'One clean ingredient: hydrolysed bovine collagen peptides, Type I & III. For your daily wellness, nothing more, nothing less.',
      chips: ['10,000 mg collagen', 'Certified halal', 'Zero additives'],
      inside: 'Hydrolysed bovine collagen peptides (Type I & III), 10,000 mg per 10 g serving. That’s the whole list.'
    },
    glow: {
      name: 'Pure Nur Glow', price: 39, img: 'images/glow.webp', theme: 'glow',
      rating: '4.9 · 94 reviews', caption: '300 g · 30 servings · Hair · Skin · Nails', servings: 30,
      desc: 'Beauty collagen: 10,000 mg halal collagen with vitamin C, zinc, biotin and a hyaluronic acid matrix complex.',
      chips: ['Vitamin C, zinc & biotin', 'Hyaluronic acid', 'Certified halal'],
      inside: 'Hydrolysed bovine collagen peptides 10,000 mg, vitamin C, zinc, biotin and hyaluronic acid matrix complex, per 10 g serving.'
    },
    duo: {
      name: 'The Pure Nur Duo', price: 68, once: 57.8, img: 'images/duo.webp', theme: 'duo',
      rating: '4.9 · 222 reviews', caption: 'Collagen + Glow · 60 servings', servings: 60,
      desc: 'One Collagen and one Glow. For you and your sister, your mum, your partner, or simply for morning and evening.',
      chips: ['Save 15% today', 'Both formulas', 'Free delivery'],
      inside: 'One pouch of Pure Nur Collagen and one pouch of Pure Nur Glow, 300 g each.'
    }
  };
  var FREE_SHIP = 40;
  function priceFor(id, plan) {
    var p = P[id];
    if (plan === 'sub') return Math.round(p.price * 80) / 100;
    return p.once || p.price;
  }

  /* ---------- Toast ---------- */
  var toastEl = $('[data-toast]'), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2800);
  }

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  function initLenis() {
    if (reduce || !window.Lenis) return;
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1 });
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  function scrollToEl(el) {
    if (!el) return;
    var off = -(document.getElementById('header').offsetHeight + 10);
    if (lenis) lenis.scrollTo(el, { offset: off, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + off, behavior: reduce ? 'auto' : 'smooth' });
  }
  function lockScroll(on) {
    if (lenis) { on ? lenis.stop() : lenis.start(); }
    document.documentElement.style.overflow = on ? 'hidden' : '';
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-pick')) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    scrollToEl(t);
  });

  /* ---------- Announcement ---------- */
  (function () {
    var items = $$('.announce__track p'); if (items.length < 2 || reduce) return;
    var i = 0;
    setInterval(function () {
      var cur = items[i]; cur.classList.remove('is-active'); cur.classList.add('is-out');
      i = (i + 1) % items.length;
      var nx = items[i]; nx.classList.remove('is-out'); void nx.offsetWidth; nx.classList.add('is-active');
      setTimeout(function () { cur.classList.remove('is-out'); }, 650);
    }, 4200);
  })();

  /* ---------- Header ---------- */
  var header = $('#header');
  function onScroll() {
    header.classList.toggle('is-solid', window.scrollY > 20);
    updateBuybar();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  var burger = $('.burger'), mnav = $('#mnav');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    burger.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    mnav.classList.toggle('is-open', !open);
    header.classList.add('is-solid');
  });
  function closeMenu() { burger.setAttribute('aria-expanded', 'false'); mnav.classList.remove('is-open'); }
  $$('#mnav a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* ---------- Hero: spotlight, parallax, video ---------- */
  var hero = $('.hero'), heroGlow = $('.hero__glow'), heroProduct = $('.hero__product');
  if (finePointer && !reduce) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      heroGlow.style.setProperty('--mx', (x * 100) + '%');
      heroGlow.style.setProperty('--my', (y * 100) + '%');
      if (window.gsap) window.gsap.to(heroProduct, { x: (x - .5) * 26, y: (y - .5) * 18, rotate: (x - .5) * 2, duration: 1.2, ease: 'power3.out', overwrite: 'auto' });
    });
  }
  var vid = $('.hero__video'), vbtn = $('[data-vid-toggle]');
  if (reduce && vid) { vid.removeAttribute('autoplay'); vid.pause(); vbtn.classList.add('is-paused'); vbtn.setAttribute('aria-label', 'Play background video'); }
  vbtn.addEventListener('click', function () {
    if (vid.paused) { vid.play(); vbtn.classList.remove('is-paused'); vbtn.setAttribute('aria-label', 'Pause background video'); }
    else { vid.pause(); vbtn.classList.add('is-paused'); vbtn.setAttribute('aria-label', 'Play background video'); }
  });

  /* ---------- Shop configurator ---------- */
  var shop = $('#shop');
  var S = { id: 'collagen', plan: 'sub', qty: 1 };
  var el = {
    name: $('[data-p-name]'), rating: $('[data-p-rating]'), desc: $('[data-p-desc]'), chips: $('[data-p-chips]'),
    was: $('[data-p-was]'), sub: $('[data-p-sub]'), save: $('[data-p-save]'), pps: $('[data-p-pps]'),
    once: $('[data-p-once]'), onceMeta: $('[data-p-once-meta]'), btnPrice: $('[data-btn-price]'),
    inside: $('[data-p-inside]'), caption: $('[data-caption]'), qty: $('[data-qty]'), sw: $('.switch')
  };
  function renderShop(animate) {
    var p = P[S.id];
    var sub = priceFor(S.id, 'sub'), once = priceFor(S.id, 'once');
    shop.setAttribute('data-theme', p.theme);
    $$('[data-pick-tab]').forEach(function (b, i) {
      var on = b.getAttribute('data-pick-tab') === S.id;
      b.setAttribute('aria-selected', String(on));
      if (on) el.sw.setAttribute('data-i', i);
    });
    $$('[data-stage-img]').forEach(function (img) { img.classList.toggle('is-on', img.getAttribute('data-stage-img') === S.id); });
    var swap = function () {
      el.name.textContent = p.name; el.rating.textContent = p.rating; el.desc.textContent = p.desc;
      el.chips.innerHTML = p.chips.map(function (c) { return '<li>' + c + '</li>'; }).join('');
      el.inside.textContent = p.inside; el.caption.textContent = p.caption;
    };
    if (animate && window.gsap && !reduce) {
      window.gsap.to([el.name, el.desc, el.chips], { opacity: 0, y: 8, duration: .2, onComplete: function () {
        swap(); window.gsap.to([el.name, el.desc, el.chips], { opacity: 1, y: 0, duration: .45, stagger: .05, ease: 'power3.out' });
      } });
    } else swap();
    el.was.textContent = gbp(p.price);
    el.sub.textContent = gbp(sub);
    el.save.textContent = 'You save ' + gbp(p.price - sub);
    el.pps.textContent = pence(sub / p.servings) + ' per serving';
    el.once.textContent = gbp(once);
    el.onceMeta.textContent = (p.once ? 'Save ' + gbp(p.price - once) + ' · ' : '') + pence(once / p.servings) + ' per serving';
    el.qty.textContent = S.qty;
    el.btnPrice.textContent = gbp(priceFor(S.id, S.plan) * S.qty);
    updateBuybarContent();
  }
  function pick(id, scroll) {
    if (!P[id]) return;
    var changed = S.id !== id; S.id = id; renderShop(changed);
    if (scroll) scrollToEl(shop);
  }
  $$('[data-pick-tab]').forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-pick-tab')); }); });
  $$('[data-pick]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); closeMenu(); pick(a.getAttribute('data-pick'), true); });
  });
  $$('input[name="plan"]').forEach(function (r) { r.addEventListener('change', function () { S.plan = r.value; renderShop(false); }); });
  $$('[data-q]').forEach(function (b) {
    b.addEventListener('click', function () { S.qty = Math.max(1, Math.min(9, S.qty + parseInt(b.getAttribute('data-q'), 10))); renderShop(false); });
  });
  var addMain = $('[data-add-main]');
  addMain.addEventListener('click', function () {
    addToCart(S.id, S.plan, S.qty);
    var html = addMain.innerHTML; addMain.classList.add('is-added'); addMain.textContent = 'Added to bag ✓';
    setTimeout(function () { addMain.innerHTML = html; addMain.classList.remove('is-added'); el.btnPrice = $('[data-btn-price]'); renderShop(false); }, 1500);
  });
  $$('[data-quick-add]').forEach(function (b) { b.addEventListener('click', function () { addToCart(b.getAttribute('data-quick-add'), 'sub', 1); }); });

  /* Dispatch countdown to the next 1pm (UK time) */
  var cd = $('[data-countdown]'), dispatchP = cd && cd.parentNode;
  function tick() {
    if (!cd) return;
    var uk = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
    var cut = new Date(uk); cut.setHours(13, 0, 0, 0);
    var same = uk < cut;
    if (!same) cut.setDate(cut.getDate() + 1);
    var mins = Math.max(1, Math.round((cut - uk) / 60000));
    cd.textContent = Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm';
    dispatchP.lastChild.textContent = same ? ' for same-day dispatch' : ' for dispatch first thing tomorrow';
  }
  tick(); setInterval(tick, 30000);

  /* ---------- Cart ---------- */
  var cart = store.get('pn2-cart', []);
  var drawer = $('[data-drawer]'), scrim = $('[data-scrim]'), itemsEl = $('[data-items]'), emptyEl = $('[data-empty]');
  var lastFocus = null;
  function save() { store.set('pn2-cart', cart); }
  function addToCart(id, plan, q) {
    var k = id + ':' + plan;
    var line = cart.filter(function (l) { return l.k === k; })[0];
    if (line) line.q += q; else cart.push({ k: k, id: id, plan: plan, q: q });
    save(); renderCart(true); openCart();
  }
  function subtotal() { return cart.reduce(function (s, l) { return s + priceFor(l.id, l.plan) * l.q; }, 0); }
  function count() { return cart.reduce(function (s, l) { return s + l.q; }, 0); }
  function renderCart(bump) {
    $$('.cline', itemsEl).forEach(function (n) { n.remove(); });
    emptyEl.hidden = cart.length > 0;
    cart.forEach(function (l) {
      var p = P[l.id], d = document.createElement('div');
      d.className = 'cline';
      var meta = l.plan === 'sub' ? 'Subscription · save 20% · free delivery' : (l.id === 'duo' ? 'One-time · save 15%' : 'One-time purchase');
      d.innerHTML = '<div class="cline__img"><img src="' + p.img + '" alt=""></div>' +
        '<div><b>' + p.name + '</b><small>' + meta + '</small><div class="qty"><button aria-label="Decrease quantity" data-dec>−</button><span>' + l.q + '</span><button aria-label="Increase quantity" data-inc>+</button></div></div>' +
        '<div class="cline__price">' + gbp(priceFor(l.id, l.plan) * l.q) + '<button class="cline__rm" data-rm>Remove</button></div>';
      $('[data-inc]', d).onclick = function () { l.q++; save(); renderCart(); };
      $('[data-dec]', d).onclick = function () { l.q--; if (l.q < 1) cart.splice(cart.indexOf(l), 1); save(); renderCart(); };
      $('[data-rm]', d).onclick = function () { cart.splice(cart.indexOf(l), 1); save(); renderCart(); };
      itemsEl.appendChild(d);
    });
    var n = count(), st = subtotal();
    $$('[data-cart-count]').forEach(function (c) {
      c.textContent = n; c.classList.toggle('has', n > 0);
      if (bump) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
    });
    $('[data-cart-count-text]').textContent = n ? '(' + n + ')' : '';
    $('[data-subtotal]').textContent = gbp(st);
    var free = cart.some(function (l) { return l.plan === 'sub' || l.id === 'duo'; }) || st >= FREE_SHIP;
    var msg = $('[data-ship-msg]'), bar = $('[data-ship-bar]');
    if (!cart.length) { msg.innerHTML = 'Free UK delivery over <b>£40</b> and on every subscription'; bar.style.width = '0%'; }
    else if (free) { msg.innerHTML = '<b>You’ve unlocked free UK delivery ✦</b>'; bar.style.width = '100%'; }
    else { msg.innerHTML = 'You’re <b>' + gbp(FREE_SHIP - st) + '</b> away from free UK delivery'; bar.style.width = Math.min(100, st / FREE_SHIP * 100) + '%'; }
    var has = function (id) { return cart.some(function (l) { return l.id === id || l.id === 'duo'; }); };
    var up = !cart.length ? null : (!has('glow') ? 'glow' : (!has('collagen') ? 'collagen' : null));
    var upEl = $('[data-upsell]'); upEl.hidden = !up;
    if (up) {
      $('[data-up-img]').src = P[up].img; $('[data-up-name]').textContent = P[up].name;
      $('[data-up-price]').textContent = gbp(priceFor(up, 'sub')) + ' · subscribe & save 20%';
      $('[data-up-add]').onclick = function () { addToCart(up, 'sub', 1); };
    }
  }
  function openCart() {
    lastFocus = document.activeElement;
    drawer.classList.add('is-on'); scrim.classList.add('is-on'); drawer.setAttribute('aria-hidden', 'false');
    lockScroll(true);
    setTimeout(function () { var c = $('[data-close-cart]', drawer); if (c) c.focus({ preventScroll: true }); }, 350);
  }
  function closeCart() {
    drawer.classList.remove('is-on'); scrim.classList.remove('is-on'); drawer.setAttribute('aria-hidden', 'true');
    lockScroll(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $$('[data-open-cart]').forEach(function (b) { b.addEventListener('click', openCart); });
  $$('[data-close-cart]').forEach(function (b) { b.addEventListener('click', closeCart); });
  scrim.addEventListener('click', closeCart);
  $('[data-checkout]').addEventListener('click', function () {
    toast(cart.length ? 'Design preview: this opens Shopify checkout.' : 'Your bag is empty. Add a formula first.');
  });

  /* ---------- Sticky buy bar ---------- */
  var buybar = $('[data-buybar]'), finale = $('.finale');
  function updateBuybarContent() {
    var p = P[S.id];
    $('[data-bb-img]').src = p.img;
    $('[data-bb-name]').textContent = p.name;
    $('[data-bb-price]').textContent = gbp(priceFor(S.id, S.plan)) + (S.plan === 'sub' ? ' · subscribe & save 20%' : ' · one-time');
  }
  $('[data-bb-add]').addEventListener('click', function () { addToCart(S.id, S.plan, 1); });
  function updateBuybar() {
    if (!buybar) return;
    var vh = window.innerHeight;
    var past = shop.getBoundingClientRect().bottom < vh * .35;
    var nearEnd = finale.getBoundingClientRect().top < vh * .8;
    var on = past && !nearEnd;
    buybar.classList.toggle('is-on', on);
    buybar.setAttribute('aria-hidden', String(!on));
    document.body.classList.toggle('has-buybar', on);
  }

  /* ---------- Formula tabs ---------- */
  var orbit = $('.orbit');
  function showTab(t) {
    $$('[data-tab]').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-tab') === t)); });
    $('#tab-collagen').hidden = t !== 'collagen'; $('#tab-glow').hidden = t !== 'glow';
    orbit.setAttribute('data-orbit', t);
  }
  $$('[data-tab]').forEach(function (b) {
    b.addEventListener('click', function () { showTab(b.getAttribute('data-tab')); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = b.getAttribute('data-tab') === 'collagen' ? 'glow' : 'collagen'; showTab(n); $('[data-tab="' + n + '"]').focus(); }
    });
  });

  /* ---------- Marquees: duplicate rows for a seamless loop ---------- */
  $$('[data-marquee] .marquee__row').forEach(function (row) {
    var kids = Array.prototype.slice.call(row.children);
    for (var r = 0; r < 2; r++) kids.forEach(function (k) { var c = k.cloneNode(true); c.setAttribute('aria-hidden', 'true'); row.appendChild(c); });
  });

  /* ---------- Story: split words ---------- */
  var rt = $('[data-reveal-text]'), words = [];
  if (rt) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); words.push(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(rt);
    if (reduce) words.forEach(function (w) { w.classList.add('on'); });
  }

  /* ---------- Lazy videos ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; if (!reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
        else v.pause();
      });
    }, { threshold: .25 });
    $$('[data-lazy-video]').forEach(function (v) { io.observe(v); });
  }

  /* ---------- Email forms ---------- */
  $$('[data-join]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('input', f), msg = $('.join__msg', f);
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
      msg.className = 'join__msg ' + (ok ? 'ok' : 'err');
      msg.textContent = ok ? 'Welcome to the Founders’ List. Your code NUR15 is on its way.' : 'Please enter a valid email address.';
      if (ok) { input.value = ''; store.sset('pn-joined', '1'); if (f.closest('[data-modal]')) setTimeout(closeModal, 1800); }
      else input.focus();
    });
  });

  /* ---------- Exit-intent offer ---------- */
  var modal = $('[data-modal]');
  function canModal() { return !store.sget('pn-modal') && !store.sget('pn-joined') && !document.body.classList.contains('notes-on') && !drawer.classList.contains('is-on'); }
  function openModal() {
    if (!canModal()) return;
    store.sset('pn-modal', '1'); modal.hidden = false; lockScroll(true);
    setTimeout(function () { $('input', modal).focus({ preventScroll: true }); }, 250);
  }
  function closeModal() { modal.hidden = true; lockScroll(false); }
  $$('[data-close-modal]').forEach(function (b) { b.addEventListener('click', closeModal); });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  var armed = false; setTimeout(function () { armed = true; }, 9000);
  document.addEventListener('mouseout', function (e) { if (armed && !e.relatedTarget && e.clientY <= 0) openModal(); });
  if (!finePointer) setTimeout(function () { if ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight > .45) openModal(); }, 45000);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) closeModal(); else if (drawer.classList.contains('is-on')) closeCart(); else closeMenu();
  });

  /* ---------- Design notes ---------- */
  var notesBtn = $('[data-notes-toggle]'), notesLabel = $('[data-notes-label]');
  $$('[data-note]').forEach(function (sec, i) {
    var n = document.createElement('aside');
    n.className = 'note'; n.setAttribute('aria-label', 'Design note ' + (i + 1));
    n.innerHTML = '<span class="note__n">' + (i + 1) + '</span><p class="note__t"></p><button class="note__min" aria-label="Minimise note">–</button><p class="note__b"></p>';
    $('.note__t', n).textContent = sec.getAttribute('data-note-title');
    $('.note__b', n).textContent = sec.getAttribute('data-note');
    $('.note__min', n).addEventListener('click', function (e) { e.stopPropagation(); n.classList.add('is-min'); });
    n.addEventListener('click', function () { n.classList.remove('is-min'); });
    sec.insertBefore(n, sec.firstChild);
  });
  function setNotes(on) {
    document.body.classList.toggle('notes-on', on);
    notesBtn.setAttribute('aria-pressed', String(on));
    notesLabel.textContent = on ? 'Hide design notes' : 'Show design notes';
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  notesBtn.addEventListener('click', function () {
    var on = !document.body.classList.contains('notes-on'); setNotes(on);
    if (on) toast('Design notes on: each numbered card explains why that section is there.');
  });

  /* ---------- Motion ---------- */
  function counters() {
    $$('[data-count]').forEach(function (c) {
      var end = parseInt(c.getAttribute('data-count'), 10), sep = c.hasAttribute('data-sep');
      var fmt = function (v) { v = Math.round(v); return sep ? v.toLocaleString('en-GB') : String(v); };
      if (reduce || !window.gsap || !window.ScrollTrigger) { c.textContent = fmt(end); return; }
      var o = { v: 0 };
      window.ScrollTrigger.create({ trigger: c, start: 'top 90%', once: true, onEnter: function () {
        window.gsap.to(o, { v: end, duration: 2, ease: 'power2.out', onUpdate: function () { c.textContent = fmt(o.v); } });
      } });
    });
  }

  function motion(delay) {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (reduce || !gsap) $('.hero__title').classList.remove('is-intro');
    if (!gsap || !ST) {
      counters();
      if (rt) words.forEach(function (w) { w.classList.add('on'); });
      return;
    }
    gsap.registerPlugin(ST);

    if (!reduce) {
      // Hero intro
      var tl = gsap.timeline({ delay: delay || 0, defaults: { ease: 'expo.out' } });
      tl.eventCallback('onComplete', function () { $('.hero__title').classList.remove('is-intro'); });
      tl.from('.hero__media', { clipPath: 'inset(0 0 0 100% round 28px)', duration: 1.6, ease: 'expo.inOut' }, 0)
        .from('.hero__title .line > span', { yPercent: 115, duration: 1.3, stagger: .1 }, .35)
        .from('.pill', { y: 14, opacity: 0, duration: .9 }, .3)
        .from('.hero__lead, .hero__ctas, .hero__proof', { y: 24, opacity: 0, duration: 1, stagger: .1 }, .75)
        .from('.hero__product img', { y: 90, scale: .9, opacity: 0, duration: 1.6 }, .55)
        .from('.halo, .rays', { opacity: 0, duration: 2 }, .8)
        .from('.badge-ring', { scale: 0, rotate: -120, opacity: 0, duration: 1.2, ease: 'back.out(1.6)' }, 1.3)
        .from('.glass-card', { y: 20, opacity: 0, duration: .9 }, 1.2);
      gsap.to('.hero__product img', { y: -12, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.2 });
      gsap.to('.hero__video', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__copy', { yPercent: -10, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center center', end: 'bottom top', scrub: true } });

      // Generic reveals
      var groups = ['.buy > *', '.stage', '.stat', '.halal__sticky > *', '.hstep', '.formula__copy > *', '.orbit', '.glow__head > *', '.glow__cta', '.head-c > *', '.vtable', '.reviews__head > *', '.story__copy > *', '.faq__side > *', '.faq details', '.finale__in > *', '.footer__grid > *'];
      groups.forEach(function (sel) {
        var els = $$(sel); if (!els.length) return;
        var below = els.filter(function (e) { return e.getBoundingClientRect().top > window.innerHeight * .9; });
        if (below.length) gsap.set(below, { opacity: 0, y: 34 });
        ST.batch(below, { start: 'top 90%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .08, overwrite: true }); } });
      });

      // Shop stage parallax
      gsap.fromTo('.stage', { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.shop', start: 'top bottom', end: 'bottom top', scrub: true } });

      // Glow arches open like windows
      $$('.gtile__img').forEach(function (g, i) {
        gsap.fromTo(g, { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 24px 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 24px 24px)', duration: 1.6, ease: 'expo.out', delay: i * .12,
          scrollTrigger: { trigger: '.glow__grid', start: 'top 80%', once: true } });
        gsap.fromTo($('img', g), { scale: 1.3 }, { scale: 1, duration: 2, ease: 'expo.out', delay: i * .12, scrollTrigger: { trigger: '.glow__grid', start: 'top 80%', once: true } });
      });

      // Finale product rise
      gsap.fromTo('.finale__img', { y: 80, scale: .92 }, { y: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.finale', start: 'top bottom', end: 'center center', scrub: true } });
      gsap.fromTo('.footer__mega', { yPercent: 40 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    }

    // Halal seal fills with light as the steps scroll by
    var seal = $('.seal'), steps = $$('.hstep');
    ST.create({ trigger: '.halal__steps', start: 'top 75%', end: 'bottom 55%', onUpdate: function (s) {
      seal.style.setProperty('--p', (1 - s.progress).toFixed(3));
      seal.style.setProperty('--p2', s.progress.toFixed(3));
    } });
    steps.forEach(function (st) {
      ST.create({ trigger: st, start: 'top 60%', end: 'bottom 40%', toggleClass: { targets: st, className: 'is-active' } });
    });

    // Ritual: horizontal film strip on desktop
    var mm = gsap.matchMedia();
    mm.add('(min-width: 981px) and (prefers-reduced-motion: no-preference)', function () {
      var track = $('.ritual__track');
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      gsap.to(track, { x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: '.ritual', start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
    });

    // Story: words light up
    if (rt && words.length && !reduce) {
      ST.create({ trigger: rt, start: 'top 80%', end: 'bottom 45%', scrub: true, onUpdate: function (s) {
        var n = Math.round(s.progress * words.length);
        words.forEach(function (w, i) { w.classList.toggle('on', i < n); });
      } });
    }

    counters();
    window.addEventListener('load', function () { ST.refresh(); });
  }

  /* ---------- Boot ---------- */
  var loader = $('[data-loader]');
  var booted = false;
  function boot() {
    if (booted) return; booted = true;
    initLenis();
    renderShop(false); renderCart(false); onScroll();
    if (/[?&]notes=1/.test(location.search)) setNotes(true);
    var first = !store.sget('pn-seen') && !reduce;
    store.sset('pn-seen', '1');
    motion(first ? 1.15 : .15);
    setTimeout(function () { loader.classList.add('is-done'); }, first ? 1300 : 150);
  }
  if (window.gsap) boot();
  else window.addEventListener('load', boot);
  setTimeout(boot, 3500);
  setTimeout(function () { loader.classList.add('is-done'); }, 4500);
})();
