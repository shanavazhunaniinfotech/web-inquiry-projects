/* Pure Nur — home page concept interactions */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  var gbp = function (n) { return '£' + n.toFixed(2); };

  /* ---------- Catalogue ---------- */
  var PRODUCTS = {
    collagen: { name: 'Pure Nur Collagen', price: 29, img: 'images/collagen.webp' },
    glow: { name: 'Pure Nur Glow', price: 39, img: 'images/glow.webp' },
    duo: { name: 'The Pure Nur Duo', price: 57.8, was: 68, img: 'images/duo.webp', noSub: true }
  };
  var FREE_SHIP = 40;
  var priceFor = function (id, plan) {
    var p = PRODUCTS[id];
    return plan === 'sub' && !p.noSub ? Math.round(p.price * 80) / 100 : p.price;
  };

  /* ---------- Toast ---------- */
  var toastEl = $('[data-toast]'), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  }

  /* ---------- Announcement rotation ---------- */
  (function () {
    var items = $$('.announce__track p');
    if (items.length < 2 || reduce) return;
    var i = 0;
    setInterval(function () {
      var cur = items[i];
      cur.classList.remove('is-active'); cur.classList.add('is-out');
      i = (i + 1) % items.length;
      var nxt = items[i];
      nxt.classList.remove('is-out');
      void nxt.offsetWidth;
      nxt.classList.add('is-active');
      setTimeout(function () { cur.classList.remove('is-out'); }, 650);
    }, 4200);
  })();

  /* ---------- Header ---------- */
  var header = $('#header');
  var onScrollHeader = function () { header.classList.toggle('is-solid', window.scrollY > 10); };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  var burger = $('.burger'), mnav = $('#mnav');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    burger.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    mnav.classList.toggle('is-open', !open);
  });
  $$('#mnav a').forEach(function (a) {
    a.addEventListener('click', function () {
      burger.setAttribute('aria-expanded', 'false');
      mnav.classList.remove('is-open');
    });
  });

  /* Links that point at one product: scroll + highlight its card */
  $$('[data-product]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var card = $('[data-pcard][data-id="' + a.getAttribute('data-product') + '"]');
      if (!card) return;
      e.preventDefault();
      var y = card.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      card.classList.remove('is-focus'); void card.offsetWidth; card.classList.add('is-focus');
    });
  });

  /* ---------- Product cards: plan toggle ---------- */
  $$('[data-pcard]').forEach(function (card) {
    var id = card.getAttribute('data-id');
    var btnPrice = $('[data-btn-price]', card);
    var addBtn = $('[data-add]', card);
    var plan = function () { var r = $('input[type=radio]:checked', card); return r ? r.value : 'sub'; };
    $$('input[type=radio]', card).forEach(function (r) {
      r.addEventListener('change', function () { btnPrice.textContent = gbp(priceFor(id, plan())); });
    });
    addBtn.addEventListener('click', function () {
      addToCart(id, plan());
      addBtn.classList.add('is-added');
      var original = addBtn.innerHTML;
      addBtn.textContent = 'Added to bag ✓';
      setTimeout(function () { addBtn.innerHTML = original; addBtn.classList.remove('is-added'); }, 1600);
    });
  });
  $$('[data-quick-add]').forEach(function (b) {
    b.addEventListener('click', function () {
      var id = b.getAttribute('data-quick-add');
      addToCart(id, PRODUCTS[id].noSub ? 'once' : 'sub');
    });
  });

  /* ---------- Cart ---------- */
  var cart = store.get('pn-cart', []);
  var drawer = $('[data-drawer]'), scrim = $('[data-scrim]');
  var itemsEl = $('[data-items]'), emptyEl = $('[data-empty]');
  var lastFocus = null;

  function key(id, plan) { return id + ':' + plan; }
  function addToCart(id, plan) {
    var k = key(id, plan);
    var line = cart.filter(function (l) { return l.k === k; })[0];
    if (line) line.q += 1; else cart.push({ k: k, id: id, plan: plan, q: 1 });
    save(); render(true); openCart();
  }
  function save() { store.set('pn-cart', cart); }
  function subtotal() { return cart.reduce(function (s, l) { return s + priceFor(l.id, l.plan) * l.q; }, 0); }
  function count() { return cart.reduce(function (s, l) { return s + l.q; }, 0); }

  function render(bump) {
    $$('.line', itemsEl).forEach(function (n) { n.remove(); });
    emptyEl.hidden = cart.length > 0;
    cart.forEach(function (l) {
      var p = PRODUCTS[l.id];
      var el = document.createElement('div');
      el.className = 'line';
      var meta = l.plan === 'sub' ? 'Monthly subscription · save 20%' : (l.id === 'duo' ? 'Collagen + Glow · save 15%' : 'One-time purchase');
      el.innerHTML =
        '<div class="line__img"><img src="' + p.img + '" alt=""></div>' +
        '<div><strong>' + p.name + '</strong><small>' + meta + '</small>' +
        '<div class="qty"><button aria-label="Decrease quantity" data-dec>−</button><span>' + l.q + '</span><button aria-label="Increase quantity" data-inc>+</button></div></div>' +
        '<div class="line__price">' + gbp(priceFor(l.id, l.plan) * l.q) + '<button class="line__rm" data-rm>Remove</button></div>';
      $('[data-inc]', el).onclick = function () { l.q++; save(); render(); };
      $('[data-dec]', el).onclick = function () { l.q--; if (l.q < 1) cart.splice(cart.indexOf(l), 1); save(); render(); };
      $('[data-rm]', el).onclick = function () { cart.splice(cart.indexOf(l), 1); save(); render(); };
      itemsEl.appendChild(el);
    });

    var n = count(), st = subtotal();
    $$('[data-cart-count]').forEach(function (c) {
      c.textContent = n;
      c.classList.toggle('has', n > 0);
      if (bump) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
    });
    $('[data-cart-count-text]').textContent = n ? '(' + n + ')' : '';
    $('[data-subtotal]').textContent = gbp(st);

    // Free delivery progress: subscriptions and the Duo always ship free
    var freeByRule = cart.some(function (l) { return l.plan === 'sub' || l.id === 'duo'; });
    var left = Math.max(0, FREE_SHIP - st);
    var msg = $('[data-ship-msg]'), bar = $('[data-ship-bar]');
    if (!cart.length) { msg.innerHTML = 'Free UK delivery on orders over <strong>£40</strong> and on every subscription'; bar.style.width = '0%'; }
    else if (freeByRule || left === 0) { msg.innerHTML = '<strong>You’ve unlocked free UK delivery.</strong>'; bar.style.width = '100%'; }
    else { msg.innerHTML = 'You’re <strong>' + gbp(left) + '</strong> away from free UK delivery'; bar.style.width = Math.min(100, st / FREE_SHIP * 100) + '%'; }

    // Upsell: offer the formula that isn't in the bag yet
    var has = function (id) { return cart.some(function (l) { return l.id === id || l.id === 'duo'; }); };
    var up = null;
    if (cart.length && !has('glow')) up = 'glow';
    else if (cart.length && !has('collagen')) up = 'collagen';
    var upEl = $('[data-upsell]');
    upEl.hidden = !up;
    if (up) {
      $('[data-up-img]').src = PRODUCTS[up].img;
      $('[data-up-name]').textContent = PRODUCTS[up].name;
      $('[data-up-price]').textContent = gbp(priceFor(up, 'sub')) + ' · subscribe & save 20%';
      $('[data-up-add]').onclick = function () { addToCart(up, 'sub'); };
    }
  }

  function openCart() {
    lastFocus = document.activeElement;
    drawer.classList.add('is-on'); scrim.classList.add('is-on');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { var c = $('[data-close-cart]', drawer); if (c) c.focus({ preventScroll: true }); }, 300);
  }
  function closeCart() {
    drawer.classList.remove('is-on'); scrim.classList.remove('is-on');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $$('[data-open-cart]').forEach(function (b) { b.addEventListener('click', openCart); });
  $$('[data-close-cart]').forEach(function (b) { b.addEventListener('click', closeCart); });
  scrim.addEventListener('click', closeCart);
  $('[data-checkout]').addEventListener('click', function () {
    if (!cart.length) { toast('Your bag is empty, add a formula first.'); return; }
    toast('Design preview: this button opens Shopify checkout.');
  });
  render(false);

  /* ---------- Help me choose ---------- */
  $$('[data-goal]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-goal]').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
      var g = b.getAttribute('data-goal');
      $$('[data-answer]').forEach(function (p) { p.hidden = p.getAttribute('data-answer') !== g; });
    });
  });

  /* ---------- Formula tabs ---------- */
  var stage = $('.formula__stage');
  function showTab(t) {
    $$('[data-tab]').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-tab') === t)); });
    $('#tab-collagen').hidden = t !== 'collagen';
    $('#tab-glow').hidden = t !== 'glow';
    stage.setAttribute('data-stage', t);
  }
  $$('[data-tab]').forEach(function (b) {
    b.addEventListener('click', function () { showTab(b.getAttribute('data-tab')); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var next = b.getAttribute('data-tab') === 'collagen' ? 'glow' : 'collagen';
        showTab(next); $('[data-tab="' + next + '"]').focus();
      }
    });
  });
  $$('[data-tab-link]').forEach(function (a) {
    a.addEventListener('click', function () { showTab(a.getAttribute('data-tab-link')); });
  });

  /* ---------- Reviews slider ---------- */
  var track = $('[data-slider]');
  var step = function () { var r = $('.review', track); return r ? r.getBoundingClientRect().width + 24 : 300; };
  $('[data-next]').addEventListener('click', function () {
    var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step(), behavior: 'smooth' });
  });
  $('[data-prev]').addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });

  /* ---------- Email forms ---------- */
  $$('[data-join]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('input', f), msg = $('.join__msg', f);
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
      msg.className = 'join__msg ' + (ok ? 'ok' : 'err');
      msg.textContent = ok ? 'Welcome to the Founders’ List. Your code NUR15 is on its way.' : 'Please enter a valid email address.';
      if (ok) {
        input.value = '';
        store.sset('pn-joined', '1');
        if (f.closest('[data-modal]')) setTimeout(closeModal, 1800);
      } else input.focus();
    });
  });

  /* ---------- Exit-intent offer (once per session) ---------- */
  var modal = $('[data-modal]');
  var canShowModal = function () {
    return !store.sget('pn-modal') && !store.sget('pn-joined') && !document.body.classList.contains('notes-on') && !drawer.classList.contains('is-on');
  };
  function openModal() {
    if (!canShowModal()) return;
    store.sset('pn-modal', '1');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(function () { $('input', modal).focus({ preventScroll: true }); }, 200);
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ''; }
  $$('[data-close-modal]').forEach(function (b) { b.addEventListener('click', closeModal); });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  var armed = false;
  setTimeout(function () { armed = true; }, 8000);
  document.addEventListener('mouseout', function (e) {
    if (armed && !e.relatedTarget && e.clientY <= 0) openModal();
  });
  // Touch devices have no exit intent: offer after a long, engaged visit instead
  if (window.matchMedia('(hover: none)').matches) {
    setTimeout(function () {
      var depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (depth > .45) openModal();
    }, 40000);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) closeModal();
    else if (drawer.classList.contains('is-on')) closeCart();
  });

  /* ---------- Sticky mobile buy bar ---------- */
  var buybar = $('[data-buybar]');
  var hero = $('.hero'), shop = $('#shop'), footer = $('.footer');
  function updateBuybar() {
    var y = window.scrollY, vh = window.innerHeight;
    var pastHero = hero.getBoundingClientRect().bottom < 0;
    var sr = shop.getBoundingClientRect();
    var inShop = sr.top < vh * .6 && sr.bottom > vh * .3;
    var nearFooter = footer.getBoundingClientRect().top < vh;
    var on = pastHero && !inShop && !nearFooter && y > 0;
    buybar.classList.toggle('is-on', on);
    buybar.setAttribute('aria-hidden', String(!on));
    document.body.classList.toggle('has-buybar', on);
  }
  window.addEventListener('scroll', updateBuybar, { passive: true });
  updateBuybar();

  /* ---------- Design notes ---------- */
  var notesBtn = $('[data-notes-toggle]'), notesLabel = $('[data-notes-label]');
  $$('[data-note]').forEach(function (sec, i) {
    var n = document.createElement('aside');
    n.className = 'note';
    n.setAttribute('aria-label', 'Design note ' + (i + 1));
    n.innerHTML = '<span class="note__n">' + (i + 1) + '</span><p class="note__t"></p>' +
      '<button class="note__min" aria-label="Minimise note">–</button><p class="note__b"></p>';
    $('.note__t', n).textContent = sec.getAttribute('data-note-title');
    $('.note__b', n).textContent = sec.getAttribute('data-note');
    $('.note__min', n).addEventListener('click', function (e) { e.stopPropagation(); n.classList.add('is-min'); });
    n.addEventListener('click', function () { if (n.classList.contains('is-min')) n.classList.remove('is-min'); });
    sec.insertBefore(n, sec.firstChild);
  });
  function setNotes(on) {
    document.body.classList.toggle('notes-on', on);
    notesBtn.setAttribute('aria-pressed', String(on));
    notesLabel.textContent = on ? 'Hide design notes' : 'Show design notes';
  }
  notesBtn.addEventListener('click', function () {
    var on = !document.body.classList.contains('notes-on');
    setNotes(on);
    if (on) toast('Design notes on: each numbered card explains why that section is there.');
  });
  if (/[?&]notes=1/.test(location.search)) setNotes(true);

  /* ---------- Motion (GSAP) ---------- */
  function motion() {
    if (reduce || !window.gsap) return;
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    // Hero entrance
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero .eyebrow', { y: 16, opacity: 0, duration: .7 })
      .from('.hero h1', { y: 34, opacity: 0, duration: 1 }, '-=.45')
      .from('.hero .lead, .hero__ctas, .hero__proof', { y: 20, opacity: 0, duration: .8, stagger: .1 }, '-=.6')
      .from('.arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 6px 6px)', duration: 1.3, ease: 'power4.inOut' }, 0.1)
      .from('.arch__duo', { y: 80, opacity: 0, duration: 1.2 }, .7)
      .from('.arch__star', { rotate: -40, opacity: 0, duration: 1.6 }, .5)
      .from('.chip', { y: 20, opacity: 0, duration: .7, stagger: .15 }, 1.2);

    gsap.to('.chip--a', { y: -8, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 });
    gsap.to('.chip--b', { y: 8, duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 });

    if (!window.ScrollTrigger) return;
    gsap.to('.arch__duo', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.arch__star', { rotate: 30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.story__star', { rotate: 60, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });

    var groups = [
      '.section__head', '.pcard', '.chooser', '.halal__copy > *', '.cert__card', '.rstep',
      '.formula__media', '.formula__copy > *', '.glow__head > *', '.gtile', '.glow__cta',
      '.vrow', '.duo__card', '.subs', '.reviews__summary', '.review', '.story__copy > *:not(.story__star)',
      '.faq__side', '.faq details', '.join__in > *', '.footer__grid > *'
    ];
    groups.forEach(function (sel) {
      var els = $$(sel);
      if (!els.length) return;
      var below = els.filter(function (el) { return el.getBoundingClientRect().top > window.innerHeight * .88; });
      if (below.length) gsap.set(below, { opacity: 0, y: 28 });
      window.ScrollTrigger.batch(els, {
        start: 'top 88%',
        once: true,
        onEnter: function (batch) {
          gsap.fromTo(batch, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .09, overwrite: true });
        }
      });
    });
    gsap.from('.story__img img', { scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });
  }
  if (document.readyState === 'complete') motion();
  else window.addEventListener('load', motion);
})();
