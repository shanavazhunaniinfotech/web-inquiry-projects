/* Aus OG Peps: premium home page prototype */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var FREE = 150;
  /* Names, images and base prices from the client's current site.
     Larger-size prices are placeholders to confirm with the client. */
  var P = [
    { id: 'retatrutide', n: 'Retatrutide', img: 'retatrutide', best: 1, s: [['10mg', 90], ['20mg', 160], ['30mg', 220]], pur: 99.4, d: 'Triple GIP / GLP-1 / glucagon receptor agonist peptide.' },
    { id: 'ghk-cu', n: 'GHK-Cu', img: 'ghk-cu', best: 1, s: [['100mg', 70]], pur: 99.2, d: 'Copper-binding tripeptide complex.' },
    { id: 'tesamorelin', n: 'Tesamorelin', img: 'tesamorelin', best: 1, s: [['10mg', 105], ['20mg', 180]], pur: 99.1, d: 'Synthetic GHRH analogue peptide.' },
    { id: 'bpc-157', n: 'BPC-157', img: 'bpc-157', best: 1, s: [['10mg', 70]], pur: 99.5, d: 'Pentadecapeptide (15 amino acids).' },
    { id: 'ss-31', n: 'SS-31', img: 'ss-31', s: [['10mg', 100], ['50mg', 350]], pur: 99.0, d: 'Mitochondria-targeting tetrapeptide.' },
    { id: 'mots-c', n: 'MOTS-C', img: 'mots-c', s: [['10mg', 65], ['40mg', 180]], pur: 99.3, d: 'Mitochondrial-derived 16-amino-acid peptide.' },
    { id: 'tirz', n: 'Tirz', img: 'tirz', s: [['10mg', 60], ['30mg', 140]], pur: 99.4, d: 'Dual GIP / GLP-1 receptor agonist peptide.' },
    { id: 'klow', n: 'KLOW', img: 'klow', best: 1, blend: 1, s: [['80mg', 140]], pur: 99.0, d: 'Four-peptide research blend.' },
    { id: 'kpv', n: 'KPV', img: 'kpv', s: [['10mg', 60], ['30mg', 140]], pur: 0, d: 'α-MSH-derived tripeptide (Lys-Pro-Val).' },
    { id: 'cjc-ipa', n: 'CJC-1295 / IPA', img: 'cjc-1295-ipamorelin', blend: 1, s: [['10mg', 90]], pur: 99.2, d: 'CJC-1295 (no DAC) and Ipamorelin blend.' },
    { id: 'wolverine', n: 'Wolverine Stack', img: 'wolverine', blend: 1, s: [['20mg', 120]], pur: 99.1, d: 'BPC-157 and TB-500 research blend.' },
    { id: '5-amino-1mq', n: '5-Amino-1MQ', img: '5-amino-1mq', s: [['50mg', 80]], pur: 99.6, d: 'Small-molecule NNMT inhibitor.' },
    { id: 'nad', n: 'NAD+', img: 'nad', s: [['1000mg', 90]], pur: 99.3, d: 'Nicotinamide adenine dinucleotide coenzyme.' },
    { id: 'selank', n: 'Selank', img: 'selank', s: [['10mg', 60]], pur: 99.2, d: 'Synthetic heptapeptide (tuftsin analogue).' }
  ];
  var by = {}; P.forEach(function (p) { by[p.id] = p; });

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var m2 = function (n) { return '$' + n.toFixed(2); };
  var m0 = function (n) { return '$' + Math.round(n); };
  var src = function (p) { return 'images/' + p.img + '.webp'; };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var st = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    sg: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    ss: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Vial artwork ---------- */
  function vial(name, light) {
    var q = name === '?';
    var long = name.length > 9;
    var stroke = light ? 'rgba(6,20,15,.28)' : 'rgba(255,255,255,.5)';
    var glass = light ? 'rgba(6,20,15,.04)' : 'url(#gGlass)';
    return '<svg viewBox="0 0 120 280" aria-hidden="true">' +
      '<ellipse cx="60" cy="272" rx="48" ry="7" fill="url(#gShadow)"/>' +
      '<path d="M38 62h44v12c0 10 22 12 22 26v152q0 14-14 14H30q-14 0-14-14V100c0-14 22-16 22-26Z" fill="' + glass + '" stroke="' + stroke + '" stroke-width="1.2"/>' +
      '<path d="M18 224q42-9 84 0v28q0 12-12 12H30q-12 0-12-12Z" fill="url(#gPowder)"/>' +
      '<rect x="16" y="118" width="88" height="88" fill="url(#gGold)"/>' +
      '<rect x="16" y="118" width="88" height="88" fill="url(#gShade)"/>' +
      '<rect x="16" y="124" width="88" height=".8" fill="#5b4210" opacity=".5"/><rect x="16" y="199" width="88" height=".8" fill="#5b4210" opacity=".5"/>' +
      '<text x="60" y="140" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6.2" font-weight="600" letter-spacing="2" fill="#3b2a08">AUS OG PEPS</text>' +
      (q ? '<text x="60" y="180" text-anchor="middle" font-family="Instrument Serif, serif" font-style="italic" font-size="44" fill="#1d1405">?</text>'
         : '<text x="60" y="170" text-anchor="middle" font-family="Inter Tight, sans-serif" font-size="' + (long ? 13 : 16) + '" font-weight="800" fill="#1d1405"' + (long ? ' textLength="70" lengthAdjust="spacingAndGlyphs"' : '') + '>' + name.toUpperCase() + '</text>') +
      '<text x="60" y="191" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="4.6" letter-spacing="1.4" fill="#3b2a08">RESEARCH USE ONLY</text>' +
      '<rect x="23" y="98" width="6" height="150" rx="3" fill="#fff" opacity="' + (light ? '.6' : '.32') + '"/>' +
      '<rect x="93" y="104" width="3" height="136" rx="1.5" fill="#fff" opacity=".2"/>' +
      '<rect x="24" y="42" width="72" height="22" rx="4" fill="url(#gGoldH)"/>' +
      '<rect x="24" y="59" width="72" height="5" rx="2" fill="#6b4c16" opacity=".35"/>' +
      '<rect x="28" y="6" width="64" height="40" rx="8" fill="url(#gCap)"/>' +
      '<rect x="33" y="9" width="54" height="4" rx="2" fill="#fff" opacity=".14"/>' +
      '</svg>';
  }
  $$('[data-vial]').forEach(function (el) { el.innerHTML = vial(el.dataset.vial); });

  /* ---------- Announcement ---------- */
  (function () {
    var ms = $$('.announce__msg'), i = 0;
    setInterval(function () {
      var c = ms[i]; c.classList.remove('is-active'); c.classList.add('is-out');
      setTimeout(function () { c.classList.remove('is-out'); }, 600);
      i = (i + 1) % ms.length; ms[i].classList.add('is-active');
    }, 4200);
  })();

  /* ---------- Nav ---------- */
  var nav = $('.nav'), burger = $('.nav__burger'), mnav = $('#mnav');
  burger.addEventListener('click', function () { var o = mnav.classList.toggle('is-open'); burger.setAttribute('aria-expanded', o); });
  $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { mnav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }); });

  /* ---------- Marquee ---------- */
  var mq = $('[data-marquee]');
  var mqHTML = P.map(function (p) { return '<span class="marquee__item">' + p.n + ' <span class="mono">FROM ' + m0(p.s[0][1]) + '</span></span>'; }).join('');
  mq.innerHTML = mqHTML + mqHTML;

  /* ---------- Product grid ---------- */
  var grid = $('#pgrid');
  var eye = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
  function tagsOf(p) { var t = []; if (p.best) t.push('best'); if (p.blend) t.push('blend'); if (p.s[0][1] < 80) t.push('under80'); return t.join(' '); }
  function seg(p) {
    if (p.s.length === 1) return '<div class="seg"><span>' + p.s[0][0] + '</span></div>';
    return '<div class="seg" role="group" aria-label="Size">' + p.s.map(function (s, i) { return '<button type="button" class="' + (i ? '' : 'is-on') + '" data-sz="' + i + '" aria-pressed="' + !i + '">' + s[0] + '</button>'; }).join('') + '</div>';
  }
  function specs(p) {
    return '<dl class="pc__spec"><div><dt>Purity</dt><dd>' + (p.pur ? '≥' + p.pur + '%' : 'Testing') + '</dd></div><div><dt>Form</dt><dd>Lyophilised</dd></div><div><dt>Store</dt><dd>−20 °C</dd></div></dl>';
  }
  function card(p, feat) {
    var multi = p.s.length > 1;
    return '<article class="pc' + (feat ? ' pc--feature' : '') + '" data-id="' + p.id + '" data-tags="' + tagsOf(p) + '">' +
      '<div class="pc__media" data-open-qv>' +
        (feat ? '<span class="pc__feat-tag tag tag--gold">★ #1 most researched</span><div class="pc__art">' + vial(p.n) + '</div>' : '') +
        '<img src="' + src(p) + '" alt="' + p.n + ' research vial" loading="lazy" width="720" height="720">' +
        (feat ? '' : '<div class="pc__tags">' + (p.best ? '<span class="tag tag--gold">Best seller</span>' : '<span></span>') +
          (p.pur ? '<span class="tag tag--glass">✓ COA</span>' : '<span class="tag tag--soon">COA soon</span>') + '</div>' + specs(p)) +
      '</div>' +
      (feat ? '' : '<button type="button" class="pc__qv" data-open-qv aria-label="Quick view ' + p.n + '">' + eye + '</button>') +
      '<div class="pc__body">' +
        '<div class="pc__top"><div><h3 class="pc__name" data-open-qv>' + p.n + '</h3><span class="pc__meta">' + (feat ? p.d : (p.pur ? 'HPLC ≥' + p.pur + '%' : 'COA coming soon')) + '</span></div>' +
        '<span class="pc__price"><small>' + (multi ? 'from' : 'AUD') + '</small><span data-price>' + m0(p.s[0][1]) + '</span></span></div>' +
        (feat ? specs(p) : '') +
        seg(p) +
        '<button type="button" class="btn btn--' + (feat ? 'gold' : 'dark') + ' btn--block pc__add" data-add>Add to cart · <span data-add-sz>' + p.s[0][0] + '</span></button>' +
      '</div></article>';
  }
  var shipTile = '<div class="pinfo pinfo--ship" data-tile><p class="mono small">FREE EXPRESS POST</p><div><span class="big">$150</span><h3>and your order ships free, tracked.</h3></div></div>';
  var reqTile = '<div class="pinfo pinfo--req" data-tile><div class="pinfo__vial">' + vial('?', true) + '</div><div><h3>Can\'t find a compound?</h3><p>Tell us what you\'re researching and we\'ll let you know when it lands.</p><a href="#request" class="btn btn--line btn--sm">Request a peptide →</a></div></div>';
  var html = card(P[0], true);
  P.slice(1).forEach(function (p, i) { html += card(p); if (i === 7) html += shipTile; });
  grid.innerHTML = html + reqTile;

  grid.addEventListener('click', function (e) {
    var c = e.target.closest('.pc'); if (!c) return;
    var p = by[c.dataset.id];
    var sz = e.target.closest('[data-sz]');
    if (sz) {
      var i = +sz.dataset.sz;
      $$('[data-sz]', c).forEach(function (b) { b.classList.toggle('is-on', b === sz); b.setAttribute('aria-pressed', b === sz); });
      $('[data-price]', c).textContent = m0(p.s[i][1]);
      $('[data-add-sz]', c).textContent = p.s[i][0];
      c.dataset.sel = i; return;
    }
    var add = e.target.closest('[data-add]');
    if (add) {
      addCart(p.id, +(c.dataset.sel || 0), 1, $('img', c));
      var h = add.innerHTML; add.classList.add('is-added'); add.textContent = '✓ Added to cart';
      setTimeout(function () { add.classList.remove('is-added'); add.innerHTML = h; }, 1400);
      return;
    }
    if (e.target.closest('[data-open-qv]')) openQV(p.id, +(c.dataset.sel || 0));
  });

  function filter(f) {
    $$('.filter').forEach(function (b) { var on = b.dataset.filter === f; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
    $$('.pc', grid).forEach(function (c) { c.classList.toggle('is-hidden', !(f === 'all' || c.dataset.tags.split(' ').indexOf(f) > -1)); });
    var feat = $('.pc[data-id="retatrutide"]', grid); feat.classList.toggle('pc--feature', f === 'all');
    $$('[data-tile]', grid).forEach(function (t) { t.hidden = f !== 'all'; });
    if (window.gsap && !reduce) gsap.fromTo($$('.pc:not(.is-hidden), [data-tile]:not([hidden])', grid), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .5, stagger: .035, ease: 'power3.out' });
  }
  // the feature card needs its art only in "all" mode; keep markup, CSS handles it
  $$('.filter').forEach(function (b) { b.addEventListener('click', function () { filter(b.dataset.filter); }); });
  $$('[data-ff]').forEach(function (a) { a.addEventListener('click', function () { filter(a.dataset.ff); }); });

  /* ---------- Quick view ---------- */
  var qv = $('[data-qv]'), qvBody = $('[data-qv-body]'), qvImg = $('[data-qv-img]'), qvSel = { id: null, i: 0, q: 1 };
  function renderQV() {
    var p = by[qvSel.id], s = p.s[qvSel.i];
    qvImg.src = src(p); qvImg.alt = p.n;
    qvBody.innerHTML =
      '<span class="tag ' + (p.pur ? 'tag--gold' : 'tag--soon') + '" style="justify-self:start;width:max-content">' + (p.pur ? '✓ COA verified' : 'COA coming soon') + '</span>' +
      '<h3>' + p.n + '</h3><p class="qv__desc">' + p.d + ' Supplied as a lyophilised powder with a certificate of analysis for every batch.</p>' +
      '<div class="qv__price">' + m2(s[1] * qvSel.q) + '</div>' +
      '<div class="seg" role="group" aria-label="Size">' + p.s.map(function (z, i) { return '<button type="button" class="' + (i === qvSel.i ? 'is-on' : '') + '" data-qsz="' + i + '">' + z[0] + '</button>'; }).join('') + '</div>' +
      '<dl class="qv__specs"><div><dt>Purity (HPLC)</dt><dd>' + (p.pur ? '≥' + p.pur + '%' : 'Testing') + '</dd></div><div><dt>Form</dt><dd>Lyophilised powder</dd></div><div><dt>Storage</dt><dd>−20 °C, dark</dd></div><div><dt>Dispatch</dt><dd>1–2 business days</dd></div></dl>' +
      '<div class="qv__row"><div class="qty"><button type="button" data-qq="-1" aria-label="Decrease">−</button><span>' + qvSel.q + '</span><button type="button" data-qq="1" aria-label="Increase">+</button></div>' +
      '<button class="btn btn--gold btn--block" data-qadd>Add to cart · ' + m2(s[1] * qvSel.q) + '</button></div>' +
      '<p class="qv__ruo">For in vitro laboratory research only. Not for human or veterinary use.</p>';
  }
  function openQV(id, i) { qvSel = { id: id, i: i || 0, q: 1 }; renderQV(); qv.hidden = false; document.body.style.overflow = 'hidden'; setTimeout(function () { $('.qv__x').focus(); }, 30); }
  function closeQV() { qv.hidden = true; document.body.style.overflow = ''; }
  qv.addEventListener('click', function (e) {
    if (e.target === qv || e.target.closest('[data-qv-close]')) return closeQV();
    var z = e.target.closest('[data-qsz]'); if (z) { qvSel.i = +z.dataset.qsz; return renderQV(); }
    var q = e.target.closest('[data-qq]'); if (q) { qvSel.q = Math.max(1, qvSel.q + +q.dataset.qq); return renderQV(); }
    if (e.target.closest('[data-qadd]')) { addCart(qvSel.id, qvSel.i, qvSel.q); closeQV(); setTimeout(openCart, 250); }
  });

  /* ---------- Cart ---------- */
  var cart = st.get('aogp2_cart', []);
  var cartEl = $('[data-cart]'), scrim = $('[data-scrim]'), lastF = null;
  var count = function () { return cart.reduce(function (n, l) { return n + l.q; }, 0); };
  var total = function () { return cart.reduce(function (n, l) { return n + by[l.id].s[l.i][1] * l.q; }, 0); };
  function save() { st.set('aogp2_cart', cart); }

  function addCart(id, i, q, img) {
    var l = cart.filter(function (x) { return x.id === id && x.i === i; })[0];
    if (l) l.q += q; else cart.push({ id: id, i: i, q: q });
    save(); fly(img); render(true);
    var r = FREE - total(), p = by[id];
    toast('✓ ' + p.n + ' ' + p.s[i][0] + ' added' + (r > 0 ? ' · ' + m0(r) + ' to free shipping' : ' · Free shipping unlocked'));
  }

  function render(bump) {
    var c = count(), t = total(), r = Math.max(0, FREE - t), pct = Math.min(100, t / FREE * 100);
    $$('[data-cart-count]').forEach(function (el) { el.textContent = c; if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); } });
    $('[data-cart-n]').textContent = c ? '(' + c + ')' : '';
    $('[data-cart-total]').textContent = m2(t);
    $('[data-ship-bar]').style.setProperty('--w', pct + '%');
    $('[data-ship]').classList.toggle('is-free', t > 0 && !r);
    $('[data-ship-text]').innerHTML = !t ? 'Spend <b>$150</b> and Express Post is free.' : r ? 'You\'re <b>' + m2(r) + '</b> away from free Express Post' : '✦ You\'ve unlocked <b>free Express Post</b>';
    var fb = $('[data-free-bar]'); if (fb) fb.style.setProperty('--w', (t ? pct : 0) + '%');
    var ft = $('[data-free-text]'); if (ft) ft.textContent = !t ? 'Add items to see your progress.' : r ? m2(r) + ' to go on your current cart.' : 'Unlocked on your current cart ✓';

    var body = $('[data-cart-body]');
    body.innerHTML = !cart.length
      ? '<div class="cart__empty"><div class="ev">' + vial('?', true) + '</div><p>Your cart is empty.</p><a class="btn btn--dark" href="#shop" data-close>Shop best sellers</a></div>'
      : cart.map(function (l, k) {
          var p = by[l.id], s = p.s[l.i];
          return '<div class="li"><img src="' + src(p) + '" alt=""><div><div class="li__n">' + p.n + '</div><div class="li__s">' + s[0] + ' · COA included</div>' +
            '<div class="qty"><button type="button" data-q="-1" data-k="' + k + '" aria-label="Decrease">−</button><span>' + l.q + '</span><button type="button" data-q="1" data-k="' + k + '" aria-label="Increase">+</button></div></div>' +
            '<div class="li__r"><span class="li__p">' + m2(s[1] * l.q) + '</span><button type="button" class="li__x" data-rm="' + k + '">Remove</button></div></div>';
        }).join('');

    var up = $('[data-upsell]'); up.innerHTML = '';
    if (cart.length && r) {
      var ids = cart.map(function (l) { return l.id; });
      var pick = P.filter(function (p) { return ids.indexOf(p.id) < 0 && p.pur; })
        .sort(function (a, b) { return Math.abs(a.s[0][1] - r) - Math.abs(b.s[0][1] - r) || b.best - a.best; })[0];
      if (pick) up.innerHTML = '<div class="ups"><img src="' + src(pick) + '" alt=""><div class="ups__t"><b>' + pick.n + ' ' + pick.s[0][0] + ' · ' + m0(pick.s[0][1]) + '</b>' + (pick.s[0][1] >= r ? 'Add to unlock free shipping' : 'Researchers also add') + '</div><button class="btn btn--dark btn--sm" data-up="' + pick.id + '">Add</button></div>';
    }
    checkout();
    mbarUpdate();
  }
  function checkout() { $('[data-checkout]').disabled = !(cart.length && $('[data-ruo]').checked); }
  cartEl.addEventListener('click', function (e) {
    var q = e.target.closest('[data-q]');
    if (q) { var l = cart[+q.dataset.k]; l.q += +q.dataset.q; if (l.q < 1) cart.splice(+q.dataset.k, 1); save(); return render(); }
    var rm = e.target.closest('[data-rm]'); if (rm) { cart.splice(+rm.dataset.rm, 1); save(); return render(); }
    var u = e.target.closest('[data-up]'); if (u) return addCart(u.dataset.up, 0, 1);
    if (e.target.closest('[data-close]')) closeCart();
  });
  $('[data-ruo]').addEventListener('change', checkout);
  $('[data-checkout]').addEventListener('click', function () { toast('Prototype: this connects to WooCommerce checkout in the build'); });
  function openCart() {
    lastF = document.activeElement; tEl.classList.remove('is-on');
    scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.add('is-on'); cartEl.classList.add('is-on'); });
    cartEl.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    setTimeout(function () { cartEl.focus(); }, 60);
  }
  function closeCart() {
    scrim.classList.remove('is-on'); cartEl.classList.remove('is-on'); cartEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; setTimeout(function () { scrim.hidden = true; }, 400);
    if (lastF && lastF.focus) lastF.focus();
  }
  $$('[data-open-cart]').forEach(function (b) { b.addEventListener('click', openCart); });
  scrim.addEventListener('click', closeCart);
  $$('[data-quick-add]').forEach(function (b) { b.addEventListener('click', function () { addCart(b.dataset.quickAdd, 0, 1, $('.float--buy img')); }); });

  function fly(img) {
    if (!img || !window.gsap || reduce) return;
    var a = img.getBoundingClientRect(), b = $('.nav__cart').getBoundingClientRect(); if (!a.width) return;
    var c = img.cloneNode(); c.removeAttribute('class'); c.removeAttribute('loading');
    Object.assign(c.style, { position: 'fixed', left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px', objectFit: 'cover', borderRadius: '20px', zIndex: 140, pointerEvents: 'none' });
    document.body.appendChild(c);
    gsap.to(c, { left: b.left + b.width / 2 - 12, top: b.top + b.height / 2 - 12, width: 24, height: 24, borderRadius: '50%', opacity: .5, duration: .8, ease: 'power3.in', onComplete: function () { c.remove(); } });
  }

  /* ---------- Toast ---------- */
  var tEl = $('[data-toast]'), tT;
  function toast(m) {
    if (cartEl.classList.contains('is-on')) return;
    tEl.textContent = m; tEl.classList.add('is-on'); clearTimeout(tT);
    tT = setTimeout(function () { tEl.classList.remove('is-on'); }, 2800);
  }

  /* ---------- Mobile bar ---------- */
  var mbar = $('[data-mbar]'), mbT = $('[data-mbar-title]'), mbS = $('[data-mbar-sub]'), mbB = $('[data-mbar-btn]');
  function mbarUpdate() {
    var t = total(), r = FREE - t;
    if (t > 0) {
      mbT.textContent = r > 0 ? m0(r) + ' to free shipping' : 'Free shipping unlocked';
      mbS.textContent = count() + ' item' + (count() > 1 ? 's' : '') + ' · ' + m2(t);
      mbB.textContent = 'View cart'; mbB.setAttribute('href', '#');
    } else { mbT.textContent = 'Free Express Post'; mbS.textContent = 'on orders over $150'; mbB.textContent = 'Shop now'; mbB.setAttribute('href', '#shop'); }
  }
  mbB.addEventListener('click', function (e) { if (total() > 0) { e.preventDefault(); openCart(); } });

  /* ---------- COA tile ---------- */
  var coaIds = ['retatrutide', 'bpc-157', 'ghk-cu', 'tesamorelin', 'mots-c', 'nad'];
  var chips = $('[data-coa-chips]');
  chips.innerHTML = coaIds.map(function (id, i) { return '<button type="button" role="tab" class="' + (i ? '' : 'is-on') + '" data-coa-id="' + id + '" aria-selected="' + !i + '">' + by[id].n + '</button>'; }).join('');
  function seeded(seed) { return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; }
  function chrom(id) {
    var rnd = seeded(id.split('').reduce(function (a, c) { return a + c.charCodeAt(0) * 7; }, 11));
    var peak = 170 + rnd() * 90, pts = [], W = 400, H = 140, base = 128;
    var minors = [40 + rnd() * 60, 110 + rnd() * 40, peak + 50 + rnd() * 60, peak + 120 + rnd() * 40];
    for (var x = 0; x <= W; x += 2) {
      var y = base - Math.sin(x / 9) * .6;
      minors.forEach(function (mx, k) { y -= (6 + k * 2) * Math.exp(-Math.pow((x - mx) / 4, 2)); });
      y -= 112 * Math.exp(-Math.pow((x - peak) / 5.5, 2));
      pts.push([x, Math.max(6, y)]);
    }
    var d = 'M' + pts.map(function (p) { return p[0] + ' ' + p[1].toFixed(1); }).join(' L');
    var code = 'OG-' + Math.floor(rnd() * 900 + 100).toString(36).toUpperCase() + '-' + Math.floor(rnd() * 46656 + 1000).toString(36).toUpperCase();
    return { d: d, area: d + ' L' + W + ' ' + H + ' L0 ' + H + ' Z', code: code };
  }
  var coaLine = $('[data-coa-line]'), coaArea = $('[data-coa-area]');
  function showCoa(id) {
    var p = by[id], c = chrom(id);
    $$('[data-coa-id]').forEach(function (b) { var on = b.dataset.coaId === id; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
    coaLine.setAttribute('d', c.d); coaArea.setAttribute('d', c.area);
    $('[data-coa-name]').textContent = p.n + ' · ' + p.s[0][0];
    $('[data-coa-code]').textContent = c.code;
    var pe = $('[data-coa-purity]');
    if (window.gsap && !reduce) {
      var len = coaLine.getTotalLength();
      gsap.fromTo(coaLine, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' });
      gsap.fromTo(coaArea, { opacity: 0 }, { opacity: .12, duration: 1, delay: .6 });
      var o = { v: 95 }; gsap.to(o, { v: p.pur, duration: 1.4, ease: 'power3.out', onUpdate: function () { pe.textContent = o.v.toFixed(1) + '%'; } });
    } else pe.textContent = p.pur + '%';
    $('[data-coa]').dataset.cur = id;
  }
  chips.addEventListener('click', function (e) { var b = e.target.closest('[data-coa-id]'); if (b) showCoa(b.dataset.coaId); });
  $('[data-coa-view]').addEventListener('click', function () { toast('Prototype: opens the full PDF certificate in the live build'); });

  /* ---------- Stack builder ---------- */
  var stackIds = ['retatrutide', 'bpc-157', 'ghk-cu', 'tesamorelin', 'mots-c', 'nad'];
  var sl = $('[data-stack-list]');
  var tick = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" fill="none" stroke="#06140f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  sl.innerHTML = stackIds.map(function (id, k) {
    var p = by[id];
    return '<li class="sitem"><input type="checkbox" id="sk' + k + '" value="' + id + '"' + (k === 0 ? ' checked' : '') + '>' +
      '<label for="sk' + k + '"><img src="' + src(p) + '" alt="" loading="lazy"><span><b>' + p.n + ' ' + p.s[0][0] + '</b><small>HPLC ≥' + p.pur + '% · COA</small></span><span class="sprice">' + m0(p.s[0][1]) + '</span><span class="sbox">' + tick + '</span></label></li>';
  }).join('');
  var ring = $('[data-ring]'), ringFill = $('[data-ring-fill]');
  function stackUpdate() {
    var sel = $$('input:checked', sl).map(function (i) { return by[i.value]; });
    var t = sel.reduce(function (n, p) { return n + p.s[0][1]; }, 0), r = FREE - t;
    $('[data-stack-total]').textContent = m0(t);
    $('[data-stack-msg]').textContent = !t ? 'Select compounds to begin' : r > 0 ? m0(r) + ' to free shipping' : '✦ Free Express Post unlocked';
    $('[data-stack-count]').textContent = sel.length + ' compound' + (sel.length === 1 ? '' : 's') + ' · ' + m0(t);
    $('[data-stack-add]').disabled = !sel.length;
    ringFill.style.strokeDashoffset = 100 - Math.min(100, t / FREE * 100);
    ring.classList.toggle('is-free', r <= 0 && t > 0);
  }
  sl.addEventListener('change', stackUpdate);
  $('[data-stack-add]').addEventListener('click', function () {
    $$('input:checked', sl).forEach(function (i) { var p = by[i.value]; var l = cart.filter(function (x) { return x.id === p.id && x.i === 0; })[0]; if (l) l.q++; else cart.push({ id: p.id, i: 0, q: 1 }); });
    save(); render(true); openCart();
  });

  /* ---------- Search ---------- */
  var se = $('[data-search]'), si = $('[data-search-input]'), sList = $('[data-search-list]'), sLab = $('[data-search-label]');
  function sRender(q) {
    var k = q.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    var list = k ? P.filter(function (p) { return (p.n + p.d).toLowerCase().replace(/[^a-z0-9]/g, '').indexOf(k) > -1; }) : P.filter(function (p) { return p.best; });
    sLab.textContent = k ? list.length + ' result' + (list.length === 1 ? '' : 's') : 'Popular right now';
    sList.innerHTML = list.length ? list.map(function (p) {
      return '<li><button type="button" data-go="' + p.id + '"><img src="' + src(p) + '" alt=""><span class="sn">' + p.n + '<small>' + p.s.map(function (s) { return s[0]; }).join(' · ') + '</small></span><span class="sp">' + m0(p.s[0][1]) + '</span></button></li>';
    }).join('') : '<li class="search__empty">No match yet. <a href="#request" data-close-search>Request this compound →</a></li>';
  }
  function openSearch() { se.hidden = false; si.value = ''; sRender(''); setTimeout(function () { si.focus(); }, 30); }
  function closeSearch() { se.hidden = true; }
  $$('[data-open-search]').forEach(function (b) { b.addEventListener('click', openSearch); });
  si.addEventListener('input', function () { sRender(si.value); });
  si.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var f = $('[data-go]', sList); if (f) f.click(); } });
  se.addEventListener('click', function (e) {
    if (e.target === se || e.target.closest('[data-close-search]')) return closeSearch();
    var g = e.target.closest('[data-go]'); if (g) { closeSearch(); openQV(g.dataset.go, 0); }
  });

  /* ---------- Forms ---------- */
  var okEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
  $$('[data-email]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var i = $('input', f), m = $('.msg', f);
      if (!okEmail(i.value)) { i.classList.add('bad'); m.textContent = 'Please enter a valid email address.'; i.focus(); return; }
      i.classList.remove('bad'); i.value = ''; m.textContent = '✓ Check your inbox. Your 10% code is on its way.';
      st.set('aogp2_sub', true); if (f.closest('[data-pop]')) setTimeout(closePop, 1600);
    });
  });
  var rq = $('[data-req]');
  rq.addEventListener('submit', function (e) {
    e.preventDefault();
    var a = rq.peptide, b = rq.email, m = $('.msg', rq), ok = true;
    a.classList.toggle('bad', !a.value.trim()); b.classList.toggle('bad', !okEmail(b.value));
    if (!a.value.trim() || !okEmail(b.value)) ok = false;
    if (!ok) { m.textContent = 'Please add a compound name and a valid email.'; return; }
    m.textContent = '✓ Thanks! We\'ll email you when ' + a.value.trim() + ' lands.'; rq.reset();
  });

  /* ---------- Popup ---------- */
  var pop = $('[data-pop]'), popDone = st.sg('aogp2_pop') || st.get('aogp2_sub', false);
  function openPop() {
    if (popDone || cartEl.classList.contains('is-on') || !qv.hidden || !se.hidden || document.body.classList.contains('show-notes')) return;
    popDone = true; st.ss('aogp2_pop', '1'); pop.hidden = false;
  }
  function closePop() { pop.hidden = true; }
  $$('[data-pop-close]').forEach(function (b) { b.addEventListener('click', closePop); });
  pop.addEventListener('click', function (e) { if (e.target === pop) closePop(); });
  if (!popDone) {
    setTimeout(openPop, 28000);
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY < 6) openPop(); });
    window.addEventListener('scroll', function f() { if ((scrollY + innerHeight) / document.documentElement.scrollHeight > .7) { window.removeEventListener('scroll', f); openPop(); } }, { passive: true });
  }

  /* ---------- Cookie ---------- */
  var ck = $('[data-cookie]');
  if (!st.get('aogp2_ck', false)) setTimeout(function () { ck.hidden = false; document.body.classList.add('has-cookie'); }, 2500);
  $$('[data-cookie-btn]').forEach(function (b) { b.addEventListener('click', function () { st.set('aogp2_ck', true); ck.hidden = true; document.body.classList.remove('has-cookie'); }); });

  /* ---------- Keys ---------- */
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); se.hidden ? openSearch() : closeSearch(); return; }
    if (e.key !== 'Escape') return;
    if (!se.hidden) closeSearch(); else if (!qv.hidden) closeQV(); else if (!pop.hidden) closePop(); else if (cartEl.classList.contains('is-on')) closeCart();
  });

  /* ---------- Scroll state ---------- */
  var hero = $('.hero'), shop = $('#shop'), links = $$('.nav__links a');
  function onScroll() {
    var y = scrollY;
    nav.classList.toggle('is-solid', y > 40);
    var sr = shop.getBoundingClientRect();
    var show = y > hero.offsetHeight - 200 && !(sr.top < innerHeight * .4 && sr.bottom > innerHeight * .6 && total() === 0);
    mbar.classList.toggle('is-on', show);
    var cur = null;
    links.forEach(function (a) { var s = $(a.getAttribute('href')); if (s && s.getBoundingClientRect().top < innerHeight * .45) cur = a; });
    links.forEach(function (a) { a.classList.toggle('is-on', a === cur); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Spotlight cards ---------- */
  document.addEventListener('pointermove', function (e) {
    var t = e.target.closest && e.target.closest('.spot'); if (!t) return;
    var r = t.getBoundingClientRect(); t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---------- CRO notes ---------- */
  var nb = $('[data-notes]'), n = 0;
  $$('[data-note]').forEach(function (el) {
    var d = document.createElement('div'); d.className = 'cro-note';
    d.innerHTML = '<b><span>' + (++n) + '</span>' + el.dataset.noteTitle + '</b>' + el.dataset.note;
    el.appendChild(d);
  });
  function notes(on) {
    document.body.classList.toggle('show-notes', on); nb.setAttribute('aria-pressed', on);
    $('span', nb).textContent = on ? 'Hide CRO notes' : 'Show CRO notes';
    try { history.replaceState(null, '', on ? '#notes' : location.pathname); } catch (e) {}
  }
  nb.addEventListener('click', function () { notes(!document.body.classList.contains('show-notes')); });
  if (location.hash === '#notes') notes(true);

  render(false); stackUpdate(); onScroll();
  // first COA draw happens on scroll-in (below); set static content now
  (function () { var c = chrom('retatrutide'); coaLine.setAttribute('d', c.d); coaArea.setAttribute('d', c.area); $('[data-coa-code]').textContent = c.code; $('[data-coa-name]').textContent = 'Retatrutide · 10mg'; })();

  /* ---------- Motion ---------- */
  var rvSel = '.sec-head, .tile, .rcard, .ctable, .compare__copy, .stack__copy, .stack__panel, .tstep, .acc, .req, .final__inner > *, .stats .stat';
  $$(rvSel).forEach(function (el) { el.classList.add('rv'); });

  function countUp(el) {
    var to = +el.dataset.count, dec = +(el.dataset.decimals || 0);
    if (!window.gsap || reduce) { el.textContent = to.toFixed(dec); return; }
    var o = { v: 0 }; gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = o.v.toFixed(dec); } });
  }

  window.addEventListener('load', function () {
    if (!window.gsap || reduce) {
      $$('.rv').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
      $$('[data-count]').forEach(countUp); showCoa('retatrutide');
      return;
    }
    var hasST = !!window.ScrollTrigger; if (hasST) gsap.registerPlugin(ScrollTrigger);

    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero__title .ln > span', { yPercent: 115, duration: 1.4, stagger: .1 })
      .from('.kicker, .hero__lede, .hero__ctas, .hero__assure', { y: 24, opacity: 0, duration: 1, stagger: .08 }, '-=1.1')
      .from('.stage__vial--c', { y: 120, opacity: 0, rotate: -14, duration: 1.6 }, '-=1.2')
      .from('.stage__vial--l, .stage__vial--r', { y: 80, opacity: 0, duration: 1.4, stagger: .12 }, '-=1.3')
      .from('.stage__orbit, .seal', { scale: .6, opacity: 0, duration: 1.4, stagger: .1 }, '-=1.4')
      .from('.float', { y: 40, opacity: 0, duration: 1, stagger: .12 }, '-=1')
      .add(function () { $$('.hero [data-count]').forEach(countUp); }, '-=.9')
      .from('.stats .stat', { y: 20, opacity: 0, duration: .8, stagger: .08 }, '-=1');

    // idle float
    gsap.to('.stage__vial--c svg', { y: -14, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.stage__vial--l svg', { y: -10, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: .4 });
    gsap.to('.stage__vial--r svg', { y: -12, duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: .8 });

    // pointer parallax
    var stage = $('[data-stage]');
    if (matchMedia('(pointer:fine)').matches) {
      var layers = $$('[data-depth]', stage).map(function (el) {
        return { x: gsap.quickTo(el, 'x', { duration: .9, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: .9, ease: 'power3' }), d: +el.dataset.depth };
      });
      hero.addEventListener('pointermove', function (e) {
        var cx = e.clientX / innerWidth - .5, cy = e.clientY / innerHeight - .5;
        layers.forEach(function (l) { l.x(cx * 28 * l.d); l.y(cy * 22 * l.d); });
      });
      // magnetic
      $$('.magnetic').forEach(function (b) {
        var qx = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' }), qy = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
        b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .25); qy((e.clientY - r.top - r.height / 2) * .35); });
        b.addEventListener('pointerleave', function () { qx(0); qy(0); });
      });
    }

    if (!hasST) { $$('.rv').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; }); showCoa('retatrutide'); return; }

    gsap.to('.stage', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    ScrollTrigger.batch('.rv', { start: 'top 88%', once: true, onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: .08, ease: 'expo.out' }); } });

    var below = $$('#pgrid > *').filter(function (c) { return c.getBoundingClientRect().top > innerHeight; });
    gsap.set(below, { opacity: 0, y: 40 });
    ScrollTrigger.batch(below, { start: 'top 92%', once: true, onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: .9, stagger: .06, ease: 'expo.out', clearProps: 'transform,opacity' }); } });

    ScrollTrigger.create({ trigger: '.tile--coa', start: 'top 75%', once: true, onEnter: function () { showCoa('retatrutide'); } });

    var tlLine = $('[data-tl-line]');
    ScrollTrigger.create({ trigger: '.timeline', start: 'top 80%', end: 'bottom 55%', scrub: true, onUpdate: function (s) { tlLine.style.setProperty('--p', s.progress.toFixed(3)); } });

    gsap.from('.foot__big', { xPercent: -8, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.foot', start: 'top 85%' } });
  });
})();
