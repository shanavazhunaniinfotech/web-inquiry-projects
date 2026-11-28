(function () {
  var PRICE = 65.99, SUB = 31.68, SHIP = 4.95, PROT = 2.95, GIFT = 24.99;
  var money = function (n) { return '$' + n.toFixed(2); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- Gallery ---------------- */
  var galMain = $('#galMain');
  $$('.gal-thumbs button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.gal-thumbs button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      galMain.style.opacity = 0;
      setTimeout(function () { galMain.src = b.dataset.src; galMain.style.opacity = 1; }, 160);
    });
  });

  /* ---------------- Offer widget ---------------- */
  var rf = $('#rf'), now = $('[data-now]'), supply = $('[data-supply]');
  var stickyPrice = $('[data-sticky-price]');
  function setPlan(plan) {
    if (rf.dataset.plan === plan) return;
    rf.dataset.plan = plan;
    var sub = plan === 'sub';
    now.textContent = money(sub ? SUB : PRICE);
    supply.textContent = sub ? 'Autoships Every Month' : '1-Month Supply';
    stickyPrice.textContent = money(sub ? SUB : PRICE);
    now.classList.remove('tick'); void now.offsetWidth; now.classList.add('tick');
    $$('.rf-tab').forEach(function (t) { t.setAttribute('aria-selected', t.dataset.goto === plan); });
  }
  $$('[data-goto]', rf).forEach(function (b) {
    b.addEventListener('click', function () { setPlan(b.dataset.goto); });
  });

  /* ---------------- Cart state ---------------- */
  var UPSELLS = [
    { id: 'spf', title: 'Rosy Mineral Defense SPF 50', desc: 'Daily mineral SPF. Azelaic acid makes skin sun-sensitive', price: 12.99, was: 25.99, img: 'img/cream_2.png' },
    { id: 'cleanser', title: 'Rosy Calming Gentle Cleanser', desc: 'Low-foam, fragrance-free wash for reactive skin', price: 9.99, was: 19.99, img: 'img/bay.png' },
    { id: 'barrier', title: 'Rosy Barrier Repair Moisturiser', desc: 'Ceramide cream that locks in your actives overnight', price: 14.99, was: 29.99, img: 'img/skin-care_1.png' }
  ];
  var cart = { main: null, ups: {}, prot: false };

  var cartEl = $('#cart'), lines = $('[data-lines]'), body = $('.cart-body');
  function count() {
    var n = cart.main ? cart.main.qty : 0;
    Object.keys(cart.ups).forEach(function (k) { n += cart.ups[k]; });
    return n;
  }
  function subtotal() {
    var s = cart.main ? cart.main.qty * (cart.main.plan === 'sub' ? SUB : PRICE) : 0;
    UPSELLS.forEach(function (u) { if (cart.ups[u.id]) s += cart.ups[u.id] * u.price; });
    return s;
  }
  function freeShip() { return !!(cart.main && cart.main.plan === 'sub'); }

  function render() {
    var n = count();
    var cc = $('[data-cart-count]');
    cc.hidden = n === 0;
    if (cc.textContent !== String(n)) { cc.textContent = n; cc.classList.remove('pop'); void cc.offsetWidth; cc.classList.add('pop'); }
    $('[data-cart-qty]').textContent = '(' + n + ')';
    cartEl.classList.toggle('empty', n === 0);
    body.classList.toggle('has-items', n > 0);

    var html = '';
    if (cart.main) {
      var m = cart.main, sub = m.plan === 'sub';
      html += '<div class="line">' +
        '<div class="line-img"><img src="img/rose1.jpg" alt=""></div>' +
        '<div><div class="line-t">Rosy™ Advanced Redness Relief Cream</div>' +
        '<div class="line-v">Single Tube' + (sub ? ' · Ships monthly' : '') + '</div>' +
        '<div class="line-p">' + money((sub ? SUB : PRICE) * m.qty) + (sub ? ' <s>' + money(PRICE * m.qty) + '</s> <em class="tag">SAVE 52%</em>' : '') + '</div>' +
        '<div class="qty"><button data-q="-1" aria-label="Decrease">−</button><span>' + m.qty + '</span><button data-q="1" aria-label="Increase">+</button></div></div>' +
        '<button class="line-del" data-del="main" aria-label="Remove"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg></button>' +
        (sub ? '' : '<label class="line-auto"><input type="checkbox" class="sw" data-auto> Autorefill &amp; save <em>52%</em></label>') +
        '</div>';
      if (sub) {
        html += '<div class="line gift">' +
          '<div class="line-img"><img src="img/gift.svg" alt=""></div>' +
          '<div><div class="line-t">FREE Rosy Soothing Ice Globes</div><div class="line-v">Cools &amp; calms flushed skin on contact</div>' +
          '<div class="line-p"><span class="free">FREE</span> <s>' + money(GIFT) + '</s> <em class="tag">GIFT</em></div></div><span></span></div>';
      }
    }
    UPSELLS.forEach(function (u) {
      var q = cart.ups[u.id];
      if (!q) return;
      html += '<div class="line">' +
        '<div class="line-img" style="display:grid;place-items:center"><img src="' + u.img + '" alt="" style="width:46px;height:46px"></div>' +
        '<div><div class="line-t">' + u.title + '</div><div class="line-v">Added at 50% off</div>' +
        '<div class="line-p">' + money(u.price * q) + ' <s>' + money(u.was * q) + '</s></div></div>' +
        '<button class="line-del" data-del="' + u.id + '" aria-label="Remove"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg></button></div>';
    });
    lines.innerHTML = html;

    // upsell cards (hide ones already in cart)
    var track = $('[data-ups-track]');
    var avail = UPSELLS.filter(function (u) { return !cart.ups[u.id]; });
    track.innerHTML = avail.map(function (u) {
      return '<div class="up"><div class="up-img"><img src="' + u.img + '" alt=""></div>' +
        '<div><div class="up-t">' + u.title + '</div><div class="up-d">' + u.desc + '</div>' +
        '<div class="up-p">' + money(u.price) + ' <s>' + money(u.was) + '</s> <em>50% OFF</em></div></div>' +
        '<button class="up-add" data-add="' + u.id + '">ADD</button></div>';
    }).join('');
    $('[data-ups]').style.display = avail.length && n ? '' : 'none';
    $('.ups-nav').style.visibility = avail.length > 1 ? 'visible' : 'hidden';

    // shipping bar
    var s = subtotal(), fs = freeShip(), bar = $('[data-ship-bar]');
    if (!n) bar.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" style="vertical-align:-2px"><path d="M1 4h14v12H1zM15 9h4l4 4v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg> Free shipping on every autorefill order';
    else if (fs) bar.innerHTML = '<span class="ok">✓ FREE shipping</span> with your order';
    else bar.innerHTML = 'Shipping <b>' + money(SHIP) + '</b> · free on every autorefill order';

    var ship = fs ? 0 : SHIP;
    $('[data-sub]').textContent = money(s);
    $('[data-shipcost]').innerHTML = fs ? '<span class="ok">FREE</span>' : money(SHIP);
    $('[data-total]').textContent = money(s + ship + (cart.prot ? PROT : 0));
    var saved = 0;
    if (cart.main && cart.main.plan === 'sub') saved += (PRICE - SUB) * cart.main.qty + GIFT;
    UPSELLS.forEach(function (u) { if (cart.ups[u.id]) saved += (u.was - u.price) * cart.ups[u.id]; });
    var sr = $('[data-saverow]');
    sr.hidden = saved <= 0;
    $('[data-saved]').textContent = '−' + money(saved);
  }

  lines.addEventListener('click', function (e) {
    var q = e.target.closest('[data-q]'), d = e.target.closest('[data-del]');
    if (q && cart.main) {
      cart.main.qty += +q.dataset.q;
      if (cart.main.qty < 1) cart.main = null;
      render();
    } else if (d) {
      if (d.dataset.del === 'main') cart.main = null; else delete cart.ups[d.dataset.del];
      render();
    }
  });
  lines.addEventListener('change', function (e) {
    if (e.target.matches('[data-auto]') && cart.main) {
      cart.main.plan = e.target.checked ? 'sub' : 'once';
      setPlan(cart.main.plan);
      setTimeout(render, 220);
    }
  });
  $('[data-ups-track]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b) return;
    b.classList.add('added'); b.textContent = '✓';
    setTimeout(function () { cart.ups[b.dataset.add] = 1; render(); }, 380);
  });
  $('[data-ups-prev]').addEventListener('click', function () { var t = $('[data-ups-track]'); t.scrollBy({ left: -t.clientWidth, behavior: 'smooth' }); });
  $('[data-ups-next]').addEventListener('click', function () { var t = $('[data-ups-track]'); t.scrollBy({ left: t.clientWidth, behavior: 'smooth' }); });
  $('[data-prot]').addEventListener('change', function (e) { cart.prot = e.target.checked; render(); });

  function openCart() { document.body.classList.add('cart-open'); cartEl.setAttribute('aria-hidden', 'false'); }
  function closeCart() { document.body.classList.remove('cart-open'); cartEl.setAttribute('aria-hidden', 'true'); }
  $$('[data-open-cart]').forEach(function (b) { b.addEventListener('click', openCart); });
  $$('[data-close-cart]').forEach(function (b) { b.addEventListener('click', closeCart); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeCart(); notes.classList.remove('show'); } });

  /* ---------------- Add to cart ---------------- */
  var atc = $('#rfAtc');
  function addToCart() {
    if (atc.classList.contains('loading')) return;
    atc.classList.add('loading');
    setTimeout(function () {
      var plan = rf.dataset.plan;
      if (cart.main) { cart.main.qty += 1; cart.main.plan = plan; }
      else cart.main = { qty: 1, plan: plan };
      atc.classList.remove('loading');
      render();
      openCart();
    }, 650);
  }
  atc.addEventListener('click', addToCart);
  $('[data-sticky-atc]').addEventListener('click', addToCart);

  /* ---------------- Sticky bar ---------------- */
  var sticky = $('#sticky');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (en) { sticky.classList.toggle('show', !en.isIntersecting && en.boundingClientRect.top < 0); });
    }).observe(atc);
  }

  /* ---------------- Notes ---------------- */
  var notes = $('#notes');
  $$('[data-notes]').forEach(function (b) { b.addEventListener('click', function () { notes.classList.toggle('show'); }); });
  notes.addEventListener('click', function (e) { if (e.target === notes) notes.classList.remove('show'); });

  render();
})();
