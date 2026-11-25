/* Lilaé · Complete Renewal System · interactions */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) document.documentElement.classList.add('reduced');
  var money = function (n) { return '$' + (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0); };
  var store = {
    get: function (k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- toast ---------- */
  var toastEl = $('.js-toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2800);
  }
  $$('[data-toast]').forEach(function (b) { b.addEventListener('click', function () { toast(b.getAttribute('data-toast')); }); });

  /* ---------- announcement rotator ---------- */
  var msgs = $$('.announce__msg'), mi = 0;
  setInterval(function () {
    var cur = msgs[mi]; cur.classList.remove('is-active'); cur.classList.add('is-out');
    setTimeout(function () { cur.classList.remove('is-out'); }, 650);
    mi = (mi + 1) % msgs.length; msgs[mi].classList.add('is-active');
  }, 4500);

  /* ---------- countdown to local midnight ---------- */
  function tick() {
    var now = new Date(), end = new Date(now); end.setHours(24, 0, 0, 0);
    var d = Math.max(0, end - now), h = Math.floor(d / 36e5), m = Math.floor(d % 36e5 / 6e4), s = Math.floor(d % 6e4 / 1e3);
    var t = [h, m, s].map(function (x) { return String(x).padStart(2, '0'); }).join(':');
    $$('.js-countdown').forEach(function (el) { el.textContent = t; });
  }
  tick(); setInterval(tick, 1000);

  /* ---------- delivery estimate ---------- */
  (function () {
    var now = new Date(), cutoff = new Date(now); cutoff.setHours(14, 0, 0, 0);
    if (now > cutoff) cutoff.setDate(cutoff.getDate() + 1);
    var left = cutoff - now, h = Math.floor(left / 36e5), m = Math.floor(left % 36e5 / 6e4);
    var ship = new Date(cutoff), added = 0;
    while (added < 4) { ship.setDate(ship.getDate() + 1); var day = ship.getDay(); if (day !== 0 && day !== 6) added++; }
    $('.js-cutoff').textContent = h + 'h ' + m + 'm';
    $('.js-arrive').textContent = ship.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  })();

  /* ---------- header shadow ---------- */
  var header = $('.header');
  window.addEventListener('scroll', function () { header.classList.toggle('is-scrolled', window.scrollY > 10); }, { passive: true });

  /* ---------- gallery ---------- */
  var track = $('.js-gallery-track'), slides = $$('.gallery__slide', track), thumbs = $('.js-gallery-thumbs'), dots = $('.js-gallery-dots');
  slides.forEach(function (sl, i) {
    var img = $('img', sl), t = document.createElement('button');
    t.type = 'button'; t.setAttribute('role', 'tab'); t.setAttribute('aria-label', 'Show image ' + (i + 1));
    if (img) { var ti = document.createElement('img'); ti.src = img.src.replace(/w=1100&h=1100/, 'w=160&h=160'); ti.alt = ''; ti.loading = 'lazy'; t.appendChild(ti); }
    else { t.innerHTML = '<span style="display:grid;place-items:center;height:100%;font:400 20px Fraunces,serif;color:#5d4594;background:#efe7fb">91%</span>'; }
    t.addEventListener('click', function () { go(i); }); thumbs.appendChild(t);
    var d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', 'Image ' + (i + 1));
    d.addEventListener('click', function () { go(i); }); dots.appendChild(d);
  });
  var gi = 0;
  function go(i) { gi = (i + slides.length) % slides.length; track.scrollTo({ left: track.clientWidth * gi, behavior: reduced ? 'auto' : 'smooth' }); mark(); }
  function mark() {
    $$('button', thumbs).forEach(function (b, k) { b.classList.toggle('is-active', k === gi); b.setAttribute('aria-selected', k === gi); });
    $$('button', dots).forEach(function (b, k) { b.classList.toggle('is-active', k === gi); });
  }
  var st; track.addEventListener('scroll', function () { clearTimeout(st); st = setTimeout(function () { gi = Math.round(track.scrollLeft / track.clientWidth); mark(); }, 60); }, { passive: true });
  $('.gallery__arrow--prev').addEventListener('click', function () { go(gi - 1); });
  $('.gallery__arrow--next').addEventListener('click', function () { go(gi + 1); });
  mark();

  /* ---------- offers ---------- */
  var PLANS = {
    sub120: { price: 279, compare: 534, gifts: 3, label: '120-Day · Subscribe & save 48%', name: '120-Day Supply · Subscription' },
    sub40: { price: 109, compare: 178, gifts: 2, label: '40-Day · Subscribe & save 39%', name: '40-Day Supply · Subscription' },
    once: { price: 139, compare: 178, gifts: 0, label: 'One-time purchase · save 22%', name: '40-Day Supply · One-time' }
  };
  var plan = 'sub40', perks = $('.js-perks');
  function qty() { return Math.max(1, Math.min(9, parseInt($('.js-qty').value, 10) || 1)); }
  function renderPlan() {
    var p = PLANS[plan], q = qty();
    $$('.offer').forEach(function (o) {
      var on = o.getAttribute('data-plan') === plan; o.classList.toggle('is-selected', on); $('input', o).checked = on;
    });
    var sel = $('.offer[data-plan="' + plan + '"]');
    if (p.gifts) { sel.after(perks); perks.classList.add('is-open'); } else perks.classList.remove('is-open');
    $$('.gift').forEach(function (g) { g.classList.toggle('is-locked', +g.getAttribute('data-gift') > p.gifts); });
    $$('.js-atc-price').forEach(function (el) { el.textContent = money(p.price * q); });
    $('.js-atc-label').textContent = plan === 'once' ? 'Add to cart' : 'Subscribe & save';
    $('.js-offer-save').textContent = 'You save ' + money((p.compare - p.price) * q);
    $('.js-installment').textContent = money(p.price * q / 4);
    $('.js-sticky-plan').textContent = p.label;
  }
  $$('.offer input').forEach(function (inp) { inp.addEventListener('change', function () { plan = inp.value; renderPlan(); }); });
  $('.js-qty-minus').addEventListener('click', function () { $('.js-qty').value = Math.max(1, qty() - 1); renderPlan(); });
  $('.js-qty-plus').addEventListener('click', function () { $('.js-qty').value = Math.min(9, qty() + 1); renderPlan(); });
  $('.js-qty').addEventListener('change', function () { this.value = qty(); renderPlan(); });
  renderPlan();

  /* ---------- drawers ---------- */
  var lastFocus;
  function openDrawer(id) {
    var d = document.getElementById(id); lastFocus = document.activeElement;
    d.classList.add('is-open'); d.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    var f = $('[data-close]', d); if (f) setTimeout(function () { f.focus(); }, 50);
  }
  function closeAll() {
    $$('.drawer.is-open, .modal.is-open').forEach(function (d) { d.classList.remove('is-open'); d.setAttribute('aria-hidden', 'true'); });
    document.body.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { openDrawer(b.getAttribute('data-open')); }); });
  $$('[data-close]').forEach(function (b) { b.addEventListener('click', closeAll); });
  $$('.drawer, .modal').forEach(function (d) { d.addEventListener('click', function (e) { if (e.target === d) closeAll(); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  /* ---------- cart ---------- */
  var cart = [];
  var GIFTS = [
    { id: 'g1', name: 'Velvet Hand Balm', price: 0, compare: 39, img: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=160&h=160&fit=crop&q=60' },
    { id: 'g2', name: 'Lip & Neck Serum', price: 0, compare: 29, img: 'images/serum.svg' },
    { id: 'g3', name: 'Rose Quartz Roller', price: 0, compare: 29, img: 'https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=160&h=160&fit=crop&q=60' }
  ];
  function addSystem() {
    var p = PLANS[plan], q = qty();
    cart = cart.filter(function (i) { return i.kind !== 'system' && i.kind !== 'gift'; });
    cart.unshift({ id: 'sys', kind: 'system', name: 'The Complete Renewal System', variant: p.name, price: p.price, compare: p.compare, qty: q, img: 'images/system.svg' });
    GIFTS.slice(0, p.gifts).forEach(function (g) { cart.push({ id: g.id, kind: 'gift', name: g.name, variant: 'Free welcome gift', price: 0, compare: g.compare, qty: 1, img: g.img }); });
    renderCart(); openDrawer('cart');
    var c = $('.js-cart-count'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  }
  $$('.js-atc').forEach(function (b) {
    b.addEventListener('click', function () {
      addSystem();
      if (b.hasAttribute('data-express')) toast('Prototype: Shop Pay express checkout opens here.');
    });
  });
  $('.js-add-upsell').addEventListener('click', function () {
    if (!cart.some(function (i) { return i.id === 'up'; })) cart.push({ id: 'up', kind: 'upsell', name: 'Mineral SPF 30 Veil', variant: 'Routine add-on', price: 22, compare: 32, qty: 1, img: 'images/spf.svg' });
    renderCart(); toast('Added Mineral SPF 30 Veil');
  });
  function renderCart() {
    var box = $('.js-cart-items'), total = 0, compare = 0, count = 0;
    if (!cart.length) box.innerHTML = '<p class="cart-empty">Your cart is empty.<br>Your skin deserves better.</p>';
    else box.innerHTML = cart.map(function (i) {
      total += i.price * i.qty; compare += i.compare * i.qty; count += i.kind === 'gift' ? 0 : i.qty;
      return '<div class="cart-item' + (i.kind === 'gift' ? ' cart-item--gift' : '') + '"><img src="' + i.img + '" alt=""><div><b>' + i.name + '</b><small>' + i.variant + (i.qty > 1 ? ' × ' + i.qty : '') + '</small>' +
        (i.kind !== 'gift' ? '<button class="cart-item__rm" data-rm="' + i.id + '">Remove</button>' : '') + '</div><div class="cart-item__price">' +
        (i.price ? money(i.price * i.qty) : 'FREE') + '<s>' + money(i.compare * i.qty) + '</s></div></div>';
    }).join('');
    $$('[data-rm]', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-rm');
        cart = cart.filter(function (i) { return id === 'sys' ? (i.kind !== 'system' && i.kind !== 'gift') : i.id !== id; });
        renderCart();
      });
    });
    $('.js-cart-total').textContent = money(total);
    $('.js-cart-saving').textContent = compare > total ? 'You\'re saving ' + money(compare - total) + ' today' : '';
    $('.js-cart-count').textContent = count;
    $('.js-cart-count-text').textContent = '(' + count + ')';
    $('.js-upsell').style.display = cart.some(function (i) { return i.kind === 'system'; }) && !cart.some(function (i) { return i.id === 'up'; }) ? '' : 'none';
    var pct = Math.min(100, total / 250 * 100), msg;
    if (total === 0) msg = 'Add the system to unlock <b>free shipping</b>';
    else if (total < 150) msg = 'Free shipping unlocked. Add <b>' + money(150 - total) + '</b> for a free Silk Scrunchie';
    else if (total < 250) msg = 'Silk Scrunchie unlocked! <b>' + money(250 - total) + '</b> away from a free Mini Serum';
    else msg = 'You\'ve unlocked <b>every free gift</b> 🎉';
    $('.js-ship-msg').innerHTML = msg;
    $('.js-ship-fill').style.width = (total ? Math.max(pct, 22) : 0) + '%';
  }
  renderCart();

  /* ---------- sticky ATC ---------- */
  var sticky = $('.sticky-atc'), mainAtc = $('#atc'), footer = $('.footer');
  if ('IntersectionObserver' in window) {
    var atcVisible = true, footVisible = false;
    var upd = function () {
      var show = !atcVisible && !footVisible && mainAtc.getBoundingClientRect().top < 0;
      sticky.classList.toggle('is-visible', show); sticky.setAttribute('aria-hidden', !show); document.body.classList.toggle('has-sticky', show);
    };
    new IntersectionObserver(function (e) { atcVisible = e[0].isIntersecting; upd(); }).observe(mainAtc);
    new IntersectionObserver(function (e) { footVisible = e[0].isIntersecting; upd(); }).observe(footer);
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = $$('.reveal');
  if (!reduced && 'IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, sibs = $$('.reveal', el.parentNode).filter(function (x) { return !x.dataset.done; });
        var delay = Math.max(0, sibs.indexOf(el)) * 80;
        el.dataset.done = 1;
        el.style.transition = 'opacity .9s cubic-bezier(.22,.8,.24,1) ' + delay + 'ms, transform .9s cubic-bezier(.22,.8,.24,1) ' + delay + 'ms';
        el.style.opacity = 1; el.style.transform = 'none';
        rio.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { rio.observe(el); });
  } else revealEls.forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });

  /* ---------- stats count-up ---------- */
  var statIO = 'IntersectionObserver' in window && new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var st = en.target, b = $('.js-count', st), to = +b.getAttribute('data-to'), t0 = performance.now(), dur = reduced ? 1 : 1600;
      st.classList.add('is-in');
      (function step(t) { var k = Math.min(1, (t - t0) / dur); b.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0);
      statIO.unobserve(st);
    });
  }, { threshold: .4 });
  $$('.stat').forEach(function (s) { statIO ? statIO.observe(s) : ($('.js-count', s).textContent = $('.js-count', s).dataset.to); });

  /* ---------- before / after ---------- */
  var BA = [
    { img: 'photo-1508214751196-bcfd4ca60f91', q: '“The lines around my eyes softened so much my daughter noticed before I did.”' },
    { img: 'photo-1592621385612-4d7129426394', q: '“My skin had gone grey and tired. Now people tell me I look rested, even on 5 hours of sleep.”' },
    { img: 'photo-1594744803329-e58b31de8bf5', q: '“My jawline looks firmer than it has in ten years. I\'ve stopped hiding from the camera.”' }
  ];
  var baView = $('.js-ba'), baRange = $('.js-ba-range');
  baRange.addEventListener('input', function () { baView.style.setProperty('--pos', baRange.value + '%'); });
  $$('.ba__picker button').forEach(function (b) {
    b.addEventListener('click', function () {
      var d = BA[+b.getAttribute('data-ba')], url = 'https://images.unsplash.com/' + d.img + '?w=1000&h=1000&fit=crop&q=75';
      $$('.ba__picker button').forEach(function (x) { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b); });
      $('.js-ba-after').src = url; $('.js-ba-before').src = url;
      var q = $('.js-ba-quote'); q.style.opacity = 0; setTimeout(function () { q.textContent = d.q; q.style.opacity = 1; }, 250);
      animateBA();
    });
  });
  function animateBA() {
    if (reduced) return; var t0 = performance.now();
    (function step(t) { var k = Math.min(1, (t - t0) / 1400), v = 50 + Math.sin(k * Math.PI * 2) * 30 * (1 - k); baRange.value = v; baView.style.setProperty('--pos', v + '%'); if (k < 1) requestAnimationFrame(step); })(t0);
  }
  if ('IntersectionObserver' in window) { var baIO = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { animateBA(); baIO.disconnect(); } }, { threshold: .6 }); baIO.observe(baView); }

  /* ---------- ingredients ---------- */
  var ING = [
    { t: 'Matrixyl® 3000', f: 'Found in: Day Cream, Night Balm', d: 'Signal peptides that tell skin to make more collagen. In clinical tests they reduced the look of wrinkle depth by up to 45% in 2 months.', img: 'photo-1617897903246-719242758050' },
    { t: 'Bakuchiol', f: 'Found in: Night Renewal Balm', d: 'A plant-based alternative to retinol from the babchi seed. It smooths lines and evens tone with no redness, peeling or sun sensitivity.', img: 'photo-1573461160327-b450ce3d8e7f' },
    { t: 'Squalane', f: 'Found in: all four steps', d: 'A copy of the oil skin makes less of after 40. It rebuilds the moisture barrier for supple, cushioned skin that stays hydrated for 72 hours.', img: 'photo-1515377905703-c4788e51af15' },
    { t: 'Vitamin C (THD)', f: 'Found in: Bright Eye Balm, Day Cream', d: 'A stable, oil-soluble vitamin C that reaches deeper layers to fade dark spots and brighten the look of dark circles, without stinging.', img: 'photo-1576426863848-c21f53c60b19' }
  ];
  var ingImg = $('.js-ing-img');
  $$('.ing__tab').forEach(function (b) {
    b.addEventListener('click', function () {
      var d = ING[+b.getAttribute('data-ing')];
      $$('.ing__tab').forEach(function (x) { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b); });
      [ingImg, $('.ing__info')].forEach(function (el) { el.classList.add('is-swapping'); el.style.transition = 'opacity .3s'; });
      setTimeout(function () {
        ingImg.src = 'https://images.unsplash.com/' + d.img + '?w=900&h=900&fit=crop&q=75';
        $('.js-ing-title').textContent = d.t; $('.js-ing-found').textContent = d.f; $('.js-ing-desc').textContent = d.d;
        ingImg.classList.remove('is-swapping'); $('.ing__info').classList.remove('is-swapping');
      }, 300);
    });
  });

  /* ---------- AM / PM routine ---------- */
  $$('.toggle button').forEach(function (b) {
    b.addEventListener('click', function () {
      var time = b.getAttribute('data-time');
      $$('.toggle button').forEach(function (x) { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b); });
      $('.toggle').classList.toggle('is-pm', time === 'pm');
      $$('.rstep').forEach(function (r) { r.classList.toggle('is-hidden', r.getAttribute('data-show').split(' ').indexOf(time) < 0); });
      $('.js-eye-n').textContent = time === 'pm' ? '1' : '3';
    });
  });
  $$('.rstep').forEach(function (r) { r.classList.toggle('is-hidden', r.getAttribute('data-show').split(' ').indexOf('am') < 0); });

  /* ---------- reviews ---------- */
  var U = function (id) { return 'https://images.unsplash.com/' + id + '?w=600&h=450&fit=crop&q=70'; };
  var REVIEWS = [
    { n: 'Carol M.', a: 61, d: '2 days ago', r: 5, t: 'My daughter asked if I had Botox', b: 'Eight weeks in and the lines around my eyes have softened so much. The night balm is heaven, and I wake up looking like I slept 10 hours.', tags: ['lines'], img: U('photo-1566616213894-2d4e1baee5d8'), h: 48 },
    { n: 'Patricia L.', a: 54, d: '5 days ago', r: 5, t: 'Finally, no redness', b: 'Every retinol I tried left me red and flaky. This gives me the results without the irritation. My rosacea-prone skin is calm and glowing.', tags: ['sensitive', 'lines'], h: 31 },
    { n: 'Denise R.', a: 66, d: '1 week ago', r: 5, t: 'Jawline is back', b: 'I was skeptical, but the firmness around my cheeks and jaw is noticeable. My husband commented without me saying anything!', tags: ['firm'], img: U('photo-1508214751196-bcfd4ca60f91'), h: 62 },
    { n: 'Susan B.', a: 49, d: '1 week ago', r: 4, t: 'Dark circles visibly lighter', b: 'The eye balm is the star for me. Concealer goes on so much smoother. Took off one star only because I wish the eye jar was bigger.', tags: ['dark'], h: 19 },
    { n: 'Margaret T.', a: 72, d: '2 weeks ago', r: 5, t: 'At 72 I didn\'t expect this', b: 'My skin feels plump and soft again. The routine is so simple, and I love that it\'s only 2 minutes. Already on my second 120-day plan.', tags: ['firm', 'lines'], img: U('photo-1599305090598-fe179d501227'), h: 77 },
    { n: 'Jennifer K.', a: 52, d: '2 weeks ago', r: 5, t: 'Replaced 7 products with 4', b: 'My bathroom shelf thanks me. I spend less than I did on my old "luxury" cream and my skin looks better. The texture is gorgeous.', tags: ['lines'], h: 24 },
    { n: 'Angela D.', a: 58, d: '3 weeks ago', r: 5, t: 'Sensitive skin approved', b: 'No stinging, no breakouts, no fragrance headache. Just softer, brighter skin. Customer service was lovely when I changed my delivery date.', tags: ['sensitive'], img: U('photo-1601049541289-9b1b7bbbfe19'), h: 15 },
    { n: 'Linda K.', a: 58, d: '3 weeks ago', r: 5, t: 'People keep asking what I\'ve done', b: 'Nothing! Just this routine morning and night. The glow showed up by week two and the fine lines softened by week five.', tags: ['lines', 'dark'], h: 53 },
    { n: 'Barbara W.', a: 64, d: '1 month ago', r: 4, t: 'Lovely, results take patience', b: 'Didn\'t see much the first two weeks, but stuck with it and by week six my skin looked noticeably firmer. Worth the wait.', tags: ['firm'], h: 22 },
    { n: 'Teresa G.', a: 47, d: '1 month ago', r: 5, t: 'Puffiness gone in the morning', b: 'The eye balm depuffs within minutes. I keep it in the fridge for extra cooling. Love the subscription because I never run out.', tags: ['dark'], img: U('photo-1573461160327-b450ce3d8e7f'), h: 18 },
    { n: 'Helen F.', a: 69, d: '1 month ago', r: 5, t: 'Better than my $300 cream', b: 'I was loyal to a department store brand for 15 years. Switched, and my skin is more hydrated and even. Wish I\'d found this sooner.', tags: ['lines', 'firm'], h: 41 },
    { n: 'Rosa P.', a: 55, d: '2 months ago', r: 5, t: 'Dryness fixed', b: 'Winter used to destroy my skin. Now it stays soft all day. The polish is gentle enough for my sensitive cheeks.', tags: ['sensitive'], h: 12 }
  ];
  var filter = 'all', sort = 'recent', shown = 6, grid = $('.js-reviews');
  function visibleReviews() {
    var list = REVIEWS.filter(function (r) { return filter === 'all' ? true : filter === 'photo' ? !!r.img : r.tags.indexOf(filter) > -1; });
    if (sort === 'helpful') list = list.slice().sort(function (a, b) { return b.h - a.h; });
    if (sort === 'age') list = list.filter(function (r) { return r.a >= 60; });
    return list;
  }
  var TAGN = { lines: 'Fine lines', firm: 'Firmness', dark: 'Dark circles', sensitive: 'Sensitive skin' };
  function renderReviews() {
    var list = visibleReviews();
    grid.innerHTML = list.length ? list.slice(0, shown).map(function (r) {
      return '<article class="rcard">' + (r.img ? '<div class="rcard__photo"><img src="' + r.img + '" alt="Customer photo" loading="lazy"></div>' : '') +
        '<div class="rcard__top"><span class="stars stars--sm" style="--r:' + r.r + '"></span><span class="rcard__date">' + r.d + '</span></div>' +
        '<h3>' + r.t + '</h3><p>' + r.b + '</p><div class="rcard__tags">' + r.tags.map(function (t) { return '<span>' + TAGN[t] + '</span>'; }).join('') + '</div>' +
        '<div class="rcard__by"><span class="rcard__av">' + r.n[0] + '</span><div><b>' + r.n + ', ' + r.a + '</b><i class="verified">Verified buyer</i></div><button class="rcard__help" type="button">Helpful (' + r.h + ')</button></div></article>';
    }).join('') : '<p class="empty">No reviews match this filter yet.</p>';
    $('.js-more').style.display = list.length > shown ? '' : 'none';
    $$('.rcard__help', grid).forEach(function (b) {
      b.addEventListener('click', function () { if (b.classList.contains('is-on')) return; b.classList.add('is-on'); b.textContent = b.textContent.replace(/\((\d+)\)/, function (_, n) { return '(' + (+n + 1) + ')'; }); });
    });
  }
  $$('.chip-btn').forEach(function (b) {
    b.addEventListener('click', function () { filter = b.getAttribute('data-filter'); shown = 6; $$('.chip-btn').forEach(function (x) { x.classList.toggle('is-active', x === b); }); renderReviews(); });
  });
  $('.js-sort').addEventListener('change', function () { sort = this.value; shown = 6; renderReviews(); });
  $('.js-more').addEventListener('click', function () { shown += 6; renderReviews(); });
  renderReviews();

  /* ---------- exit intent ---------- */
  var exitModal = $('#exit'), started = Date.now();
  function showExit() { if (store.get('lilae-exit')) return; store.set('lilae-exit', 1); lastFocus = document.activeElement; exitModal.classList.add('is-open'); exitModal.setAttribute('aria-hidden', 'false'); }
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget && e.clientY <= 0 && Date.now() - started > 8000 && !$('.drawer.is-open') && !document.body.classList.contains('cro-on')) showExit();
  });
  $('.js-exit-form').addEventListener('submit', function (e) { e.preventDefault(); closeAll(); toast('Code WELCOME10 applied: 10% off your first system'); });
  $('.js-news').addEventListener('submit', function (e) { e.preventDefault(); this.reset(); toast('Welcome! Check your inbox for 10% off.'); });

  /* ---------- CRO notes (presentation mode) ---------- */
  var croBtn = $('.js-cro-toggle'), croBuilt = false;
  function buildNotes() {
    $$('[data-cro]').forEach(function (el, i) {
      var n = document.createElement('aside'); n.className = 'cro-note';
      n.innerHTML = '<button type="button" aria-label="Minimise note">–</button><b><i>' + (i + 1) + '</i>' + el.getAttribute('data-cro-title') + '</b><p>' + el.getAttribute('data-cro') + '</p>';
      $('button', n).addEventListener('click', function (e) { e.stopPropagation(); n.classList.toggle('is-min'); this.textContent = n.classList.contains('is-min') ? '+' : '–'; });
      if (el.classList.contains('announce') || el.classList.contains('header')) {
        var top = $('.cro-top') || (function () { var t = document.createElement('div'); t.className = 'cro-top wrap'; $('main').insertBefore(t, $('main').firstChild); return t; })();
        top.appendChild(n);
      } else if (el.classList.contains('pdp')) el.appendChild(n); else el.insertBefore(n, el.firstChild);
    });
    var prev = document.createElement('button'); prev.type = 'button'; prev.className = 'btn btn--ghost btn--sm cro-preview';
    prev.textContent = 'Preview exit popup'; prev.addEventListener('click', function () { lastFocus = prev; exitModal.classList.add('is-open'); exitModal.setAttribute('aria-hidden', 'false'); });
    document.body.appendChild(prev);
    croBuilt = true;
  }
  croBtn.addEventListener('click', function () {
    if (!croBuilt) buildNotes();
    var on = !document.body.classList.contains('cro-on');
    document.body.classList.toggle('cro-on', on); croBtn.setAttribute('aria-pressed', on);
    if (on) { sticky.classList.add('is-visible'); toast('Layout notes on: each section explains its CRO purpose'); }
    else sticky.classList.toggle('is-visible', document.body.classList.contains('has-sticky'));
  });
  if (/[?&]notes=1/.test(location.search)) croBtn.click();

  /* ---------- GSAP flourishes ---------- */
  window.addEventListener('load', function () {
    if (!window.gsap || reduced) { $$('.tl__step').forEach(function (st) { st.classList.add('is-lit'); }); return; }
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    gsap.from('.buybox > *', { y: 18, opacity: 0, duration: .8, stagger: .05, ease: 'power3.out', clearProps: 'all' });
    gsap.from('.gallery__main', { scale: .97, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'all' });
    if (!window.ScrollTrigger) return;
    gsap.to('.problem__media img', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.problem', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.float-card', { y: 40, opacity: 0, duration: 1, stagger: .2, ease: 'power3.out', scrollTrigger: { trigger: '.problem__media', start: 'top 70%' } });
    var steps = $$('.tl__step');
    if (window.innerWidth > 1100) {
      gsap.to('.js-tl-progress', {
        width: '100%', ease: 'none',
        scrollTrigger: {
          trigger: '.tl', start: 'top 75%', end: 'bottom 45%', scrub: .6,
          onUpdate: function (s) { steps.forEach(function (st, i) { st.classList.toggle('is-lit', s.progress >= i / (steps.length - 1) - .02); }); }
        }
      });
    } else steps.forEach(function (st) { st.classList.add('is-lit'); });
    gsap.from('.seal', { rotate: -90, scale: .6, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.guarantee', start: 'top 70%' } });
  });
  if (!window.gsap) $$('.tl__step').forEach(function (st) { st.classList.add('is-lit'); });
})();
