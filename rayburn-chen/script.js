/* Lilaé · Complete Renewal System · V2 interactions */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) document.documentElement.classList.add('reduced');
  var money = function (n) { return '$' + (n % 1 ? n.toFixed(2) : n); };
  var ic = function (id) { return '<svg><use href="#i-' + id + '"/></svg>'; };
  var U = function (id, w, h) { return 'https://images.unsplash.com/' + id + '?w=' + w + '&h=' + h + '&fit=crop&q=70'; };

  /* toast */
  var toastEl = $('.js-toast'), toastT;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2800); }
  document.addEventListener('click', function (e) { var t = e.target.closest('[data-toast]'); if (t) toast(t.getAttribute('data-toast')); });

  /* ---------- gallery ---------- */
  var track = $('.js-gallery-track'), slides = $$('.gallery__slide', track), thumbs = $('.js-thumbs'), gi = 0;
  slides.forEach(function (sl, i) {
    var img = $('img', sl), b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', 'Image ' + (i + 1));
    b.innerHTML = img ? '<img src="' + img.src.replace('w=1100&h=1100', 'w=140&h=140') + '" alt="" loading="lazy">' : '<span style="display:grid;place-items:center;height:100%;font:400 18px Fraunces,serif;color:#5d4594;background:#efe7fb">91%</span>';
    b.addEventListener('click', function () { go(i); });
    thumbs.appendChild(b);
  });
  function go(i) { gi = (i + slides.length) % slides.length; track.scrollTo({ left: track.clientWidth * gi, behavior: reduced ? 'auto' : 'smooth' }); mark(); }
  function mark() { $$('button', thumbs).forEach(function (b, k) { b.classList.toggle('is-active', k === gi); b.setAttribute('aria-selected', k === gi); }); }
  var gst; track.addEventListener('scroll', function () { clearTimeout(gst); gst = setTimeout(function () { gi = Math.round(track.scrollLeft / track.clientWidth); mark(); var a = $('button.is-active', thumbs); if (a) thumbs.scrollTo({ left: a.offsetLeft - 40, behavior: 'smooth' }); }, 80); }, { passive: true });
  $('.gallery__arrow--prev').addEventListener('click', function () { go(gi - 1); });
  $('.gallery__arrow--next').addEventListener('click', function () { go(gi + 1); });
  mark();

  /* ---------- subscription toggle & pricing ---------- */
  var PRICE = { sub: 100, once: 159, compare: 200 }, subOn = true;
  function renderPrice() {
    var p = subOn ? PRICE.sub : PRICE.once, save = PRICE.compare - p;
    $$('.js-price').forEach(function (el) { el.textContent = money(p); });
    $$('.js-atc-price').forEach(function (el) { el.textContent = money(p); });
    $('.js-saving').textContent = money(save);
    $('.js-inst').textContent = money(p / 4);
    $('.js-save-badge').textContent = 'Save ' + Math.round(save / PRICE.compare * 100) + '%';
    $('.js-sub-box').classList.toggle('is-on', subOn);
  }
  $('.js-sub').addEventListener('change', function () { subOn = this.checked; renderPrice(); });
  renderPrice();

  /* ---------- drawers & modals ---------- */
  var lastFocus;
  function openEl(el) { lastFocus = document.activeElement; el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; var c = $('[data-close]', el); if (c) setTimeout(function () { c.focus(); }, 60); }
  function closeAll() {
    $$('.drawer.is-open,.modal.is-open').forEach(function (d) { d.classList.remove('is-open'); d.setAttribute('aria-hidden', 'true'); });
    document.body.style.overflow = ''; var v = $('.js-video-frame video'); if (v) v.pause();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { openEl(document.getElementById(b.getAttribute('data-open'))); }); });
  $$('[data-open-modal]').forEach(function (b) { b.addEventListener('click', function () { openEl(document.getElementById(b.getAttribute('data-open-modal'))); }); });
  $$('[data-close]').forEach(function (b) { b.addEventListener('click', closeAll); });
  $$('.drawer,.modal').forEach(function (d) { d.addEventListener('click', function (e) { if (e.target === d) closeAll(); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  /* ---------- ingredients popup ---------- */
  var JARS = [
    { n: 'Cleansing Polish', s: 'Step 1 · Exfoliate · 100 ml', img: 'images/cleanser.svg', list: [['Oryza Sativa (Rice) Powder', 'o'], ['Simmondsia Chinensis (Jojoba) Esters', 'n'], ['Glycerin', 'n'], ['Papain (Papaya Enzyme)', 'c'], ['Avena Sativa (Oat) Kernel Flour', 'o'], ['Coco-Glucoside', 'n'], ['Aloe Barbadensis Leaf Juice', 'o'], ['Panthenol (Pro-Vitamin B5)', 'c']] },
    { n: 'Peptide Day Cream', s: 'Step 2 · Firm · 50 ml', img: 'images/day.svg', list: [['Palmitoyl Tripeptide-1 & Tetrapeptide-7 (Matrixyl® 3000)', 'c'], ['Niacinamide', 'c'], ['Squalane (Olive-derived)', 'n'], ['Sodium Hyaluronate', 'c'], ['Butyrospermum Parkii (Shea) Butter', 'o'], ['Hippophae Rhamnoides (Sea Buckthorn) Oil', 'o'], ['Tocopherol (Vitamin E)', 'n'], ['Ceramide NP', 'c']] },
    { n: 'Bright Eye Balm', s: 'Step 3 · Brighten · 15 ml', img: 'images/eye.svg', list: [['Tetrahexyldecyl Ascorbate (Vitamin C)', 'c'], ['Caffeine', 'c'], ['Arnica Montana Flower Extract', 'n'], ['Squalane', 'n'], ['Centella Asiatica Extract', 'o'], ['Cucumis Sativus (Cucumber) Extract', 'o'], ['Beeswax (Cera Alba)', 'n'], ['Tocopherol (Vitamin E)', 'n']] },
    { n: 'Night Renewal Balm', s: 'Step 4 · Repair · 50 ml', img: 'images/night.svg', list: [['Bakuchiol (Plant Retinol Alternative)', 'c'], ['Squalane', 'n'], ['Rosa Canina (Rosehip) Seed Oil', 'o'], ['Calendula Officinalis Flower Extract', 'o'], ['Ceramide NP', 'c'], ['Punica Granatum (Pomegranate) Seed Oil', 'o'], ['Bisabolol (Chamomile)', 'n'], ['Peptide Complex', 'c']] }
  ];
  var tabs = $('.js-ing-tabs'), panel = $('.js-ing-panel');
  JARS.forEach(function (j, i) {
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab');
    b.innerHTML = '<img src="' + j.img + '" alt="">' + j.n; b.addEventListener('click', function () { showJar(i); }); tabs.appendChild(b);
  });
  function showJar(i) {
    var j = JARS[i];
    $$('button', tabs).forEach(function (b, k) { b.classList.toggle('is-active', k === i); b.setAttribute('aria-selected', k === i); });
    panel.innerHTML = '<div class="ing-panel__head"><img src="' + j.img + '" alt=""><div><h3>' + j.n + '</h3><p>' + j.s + '</p></div></div><ul class="ing-table">' +
      j.list.map(function (x) { return '<li><i class="lv lv--' + x[1] + '"></i>' + x[0] + '</li>'; }).join('') + '</ul>';
  }
  showJar(0);

  /* ---------- video showcase (lazy) ---------- */
  var VIDEOS = { 1: U('photo-1508214751196-bcfd4ca60f91', 720, 1280), 2: U('photo-1592621385612-4d7129426394', 720, 1280), 3: U('photo-1619451334792-150fd785ee74', 720, 1280) };
  $$('.vcard').forEach(function (v) {
    v.addEventListener('click', function () {
      var frame = $('.js-video-frame'), src = v.getAttribute('data-src');
      /* In the live store each card gets data-src="(mp4 URL)"; the file only downloads when tapped. */
      frame.innerHTML = src ? '<video src="' + src + '" autoplay playsinline controls></video>' :
        '<img src="' + VIDEOS[v.getAttribute('data-video')] + '" alt=""><div class="video-frame__msg"><b>Customer UGC video plays here</b>Videos are lazy loaded: nothing downloads until a shopper taps play, so the page stays fast.</div>';
      openEl($('#video-modal'));
    });
  });

  /* ---------- carousels ---------- */
  function initCarousel(root) {
    var tr = $('.carousel__track', root), dots = $('.js-dots', root), items = function () { return $$('.carousel__track > *', root); };
    function pages() { return Math.max(1, Math.round(tr.scrollWidth / tr.clientWidth)); }
    function build() {
      dots.innerHTML = ''; var n = Math.min(items().length, Math.max(pages(), items().length - Math.round(tr.clientWidth / (items()[0].offsetWidth || 1)) + 1));
      for (var i = 0; i < n; i++) { (function (k) { var d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', 'Go to slide ' + (k + 1)); d.addEventListener('click', function () { tr.scrollTo({ left: items()[k].offsetLeft - tr.offsetLeft, behavior: 'smooth' }); }); dots.appendChild(d); })(i); }
      sync();
    }
    function sync() {
      var w = items()[0].offsetWidth + 14, idx = Math.round(tr.scrollLeft / w);
      $$('button', dots).forEach(function (d, k) { d.classList.toggle('is-active', k === Math.min(idx, dots.children.length - 1)); });
    }
    tr.addEventListener('scroll', function () { requestAnimationFrame(sync); }, { passive: true });
    var p = $('.js-prev', root), n = $('.js-next', root), step = function (dir) { tr.scrollBy({ left: dir * (items()[0].offsetWidth + 14), behavior: 'smooth' }); };
    if (p) p.addEventListener('click', function () { step(-1); });
    if (n) n.addEventListener('click', function () { step(1); });
    build(); window.addEventListener('resize', build);
  }

  /* before / after cards */
  var BA = [
    { n: 'Joan, 64', img: 'photo-1508214751196-bcfd4ca60f91', tags: [['lines', 'Reduce lines & wrinkles'], ['tone', 'Even skintone']], q: '“The picture is proof this works on my 64 year old face after 2 months!”', b: 'I have tried everything. Within weeks my lines softened and my skin looks brighter than it has in years.' },
    { n: 'Karen, 57', img: 'photo-1592621385612-4d7129426394', tags: [['tone', 'Even skintone'], ['glow', 'Natural glow']], q: '“I have fewer dark spots and my skin has a glow again.”', b: 'I noticed a difference in the first two weeks. Now friends ask what I have been doing differently.' },
    { n: 'Linda, 61', img: 'photo-1566616213894-2d4e1baee5d8', tags: [['lift', 'Firmer-looking skin'], ['drop', 'Moisturise skin']], q: '“My skin feels plump and firm, not tight and dry.”', b: 'At 61 I didn’t expect much. The night balm is now my favourite part of the day.' },
    { n: 'Julie, 48', img: 'photo-1594744803329-e58b31de8bf5', tags: [['eye', 'Reduce dark circles'], ['glow', 'Natural glow']], q: '“My dark circles are so much lighter. I wear less concealer.”', b: 'The eye balm depuffs in minutes. My whole face looks rested, even after a short night.' }
  ];
  $('.js-ba-track').innerHTML = BA.map(function (r) {
    var src = U(r.img, 400, 460);
    return '<article class="bacard"><div class="bacard__imgs"><figure><img src="' + src + '" alt="' + r.n + ' before" loading="lazy"><figcaption>Before</figcaption></figure><figure><img src="' + src + '" alt="' + r.n + ' after 8 weeks" loading="lazy"><figcaption>After</figcaption></figure></div>' +
      '<div class="bacard__body"><div class="bacard__top"><span>' + r.n + ' <i class="verified">✓ Verified</i></span><span class="stars stars--sm"></span></div><div class="bacard__tags">' +
      r.tags.map(function (t) { return '<span>' + ic(t[0]) + t[1] + '</span>'; }).join('') + '</div><blockquote>' + r.q + '</blockquote><p>' + r.b + '</p></div></article>';
  }).join('');
  $$('.js-carousel').forEach(function (c) { if (c.getAttribute('data-carousel') !== 'xsell') initCarousel(c); });

  /* ---------- timeline ---------- */
  var TL = [
    { w: '24 Hours', box: ['Deep Hydration', 'Squalane, Hyaluronic Acid, Oat Extract'], sub: 'Skin Is Calm and Comfortable', li: [['drop', 'Skin feels instantly softer and plumper'], ['calm', 'Tightness and dryness ease'], ['heart', 'Skin feels less sensitive']] },
    { w: '3 Days', box: ['Skin Barrier Repair Begins', 'Ceramides + Squalane'], sub: '1st Signs of Healthy Skin', li: [['drop', 'Skin feels more hydrated and less tight'], ['glow', 'A natural glow starts to return'], ['heart', 'Skin starts feeling soft']] },
    { w: 'Week 1', box: ['Skin Cell Activation', 'Bakuchiol + Niacinamide, Vitamin C, Antioxidants'], sub: 'Skin Renewal Begins', li: [['lines', 'Fine lines start softening → skin feels smoother'], ['drop', 'Hydration locks in → rough patches fade'], ['tone', 'Complexion looks more even']] },
    { w: 'Month 1', box: ['Collagen Support', 'Matrixyl® 3000 Peptides, Vitamin C, Ceramides'], sub: 'Real Changes Start Showing', li: [['lines', 'Fewer fine lines and less dryness'], ['tone', 'Dark spots begin fading, tone looks more even'], ['glow', 'Skin is visibly glowing']] },
    { w: 'Month 3', box: ['Your Skin Is Looking Its Best', 'Supported by Peptides + Bakuchiol, Squalane, Niacinamide, Vitamin C'], sub: 'Visibly Healthy Skin', li: [['spark', 'More supple, glossy skin'], ['heart', 'Skin is even and healthy'], ['lift', 'Confidence soars as skin looks and feels firmer']] },
    { w: 'Month 6-12+', box: ['Systemic Skin Renewal', 'Sustained nourishment from the full 4-step system'], sub: 'A New You', li: [['star', 'Radiant skin that gets compliments'], ['glow', 'Skin looks rested and healthy'], ['shield', 'A strong skin barrier supports skin through the seasons']] }
  ];
  $('.js-tl').innerHTML = TL.map(function (t) {
    return '<li class="tl__item reveal"><span class="tl__dot">' + ic('check') + '</span><p class="tl__when">' + ic('cal') + t.w + '</p><div class="tl__box"><b>' + t.box[0] + '</b>' + t.box[1] + '</div><p class="tl__sub">' + t.sub + '</p><ul class="tl__list">' +
      t.li.map(function (l) { return '<li>' + ic(l[0]) + l[1] + '</li>'; }).join('') + '</ul></li>';
  }).join('');

  /* ---------- ingredients (botanical icons) ---------- */
  var BOT = {
    peptide: '<svg viewBox="0 0 64 64"><g fill="#cdb9ef"><circle cx="16" cy="20" r="9"/><circle cx="40" cy="14" r="7"/><circle cx="48" cy="38" r="9"/><circle cx="22" cy="46" r="8"/></g><g stroke="#5d4594" stroke-width="2.5" fill="none"><path d="M16 20L40 14M40 14L48 38M48 38L22 46M22 46L16 20"/></g><g fill="#5d4594"><circle cx="16" cy="20" r="3"/><circle cx="40" cy="14" r="3"/><circle cx="48" cy="38" r="3"/><circle cx="22" cy="46" r="3"/></g></svg>',
    flower: '<svg viewBox="0 0 64 64"><g fill="#b39be3">' + [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { return '<ellipse cx="32" cy="14" rx="6" ry="12" transform="rotate(' + a + ' 32 32)"/>'; }).join('') + '</g><circle cx="32" cy="32" r="8" fill="#5d4594"/></svg>',
    honey: '<svg viewBox="0 0 64 64"><g fill="#e4d8f8" stroke="#9579d0" stroke-width="2"><path d="M20 8l10 6v12l-10 6-10-6V14z"/><path d="M42 8l10 6v12l-10 6-10-6V14z"/><path d="M31 28l10 6v12l-10 6-10-6V34z"/></g></svg>',
    daisy: '<svg viewBox="0 0 64 64"><g fill="#cdb9ef">' + [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(function (a) { return '<rect x="30" y="6" width="4" height="22" rx="2" transform="rotate(' + a + ' 32 32)"/>'; }).join('') + '</g><circle cx="32" cy="32" r="9" fill="#9579d0"/></svg>',
    drop: '<svg viewBox="0 0 64 64"><path d="M32 6s16 18 16 30a16 16 0 0 1-32 0C16 24 32 6 32 6z" fill="#e4d8f8" stroke="#9579d0" stroke-width="2"/><path d="M24 38a8 8 0 0 0 8 8" stroke="#5d4594" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
    berry: '<svg viewBox="0 0 64 64"><path d="M32 4v56" stroke="#5d4594" stroke-width="2.5"/><g fill="#b39be3"><circle cx="24" cy="14" r="5"/><circle cx="40" cy="20" r="5"/><circle cx="24" cy="28" r="5"/><circle cx="40" cy="34" r="5"/><circle cx="24" cy="42" r="5"/><circle cx="40" cy="48" r="5"/></g><g fill="#7a5fb5"><path d="M32 18c-6-6-14-4-16-2 4 2 10 4 16 2z"/><path d="M32 40c6-6 14-4 16-2-4 2-10 4-16 2z"/></g></svg>'
  };
  var ING = [
    ['peptide', 'Firmer skin', 'Matrixyl® 3000 Peptides', 'Signal peptides that encourage skin to make more collagen, so skin looks firmer and lines look softer.'],
    ['berry', 'Softer, smoother skin', 'Bakuchiol & Rosehip', 'A gentle plant alternative to retinol that smooths texture and softens fine lines, with no redness or peeling.'],
    ['honey', 'Supports the skin barrier', 'Squalane & Ceramides', 'Replace the lipids mature skin loses, locking in moisture and protecting the skin barrier.'],
    ['daisy', 'Calms and soothes', 'Calendula & Chamomile', 'Powerful, fast-working soothers that calm sensitive skin and reduce the look of redness.'],
    ['flower', 'Brightens the look of dark circles', 'Vitamin C & Caffeine', 'Depuff and brighten the delicate under-eye area for a more rested look.'],
    ['drop', 'Natural glow', 'Niacinamide & Sea Buckthorn', 'Evens skin tone and restores radiance. Sea buckthorn is one of nature’s richest sources of vitamin C.']
  ];
  $('.js-ing-list').innerHTML = ING.map(function (x) {
    return '<div class="ing-row reveal"><div class="ing-row__top"><span class="ing-row__ic">' + BOT[x[0]] + '</span><div><p class="ing-row__label">' + x[1] + '</p><p class="ing-row__name">' + x[2] + '</p></div></div><p>' + x[3] + '</p></div>';
  }).join('');

  /* ---------- routine ---------- */
  $$('.toggle button').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-time');
      $$('.toggle button').forEach(function (x) { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b); });
      $('.toggle').classList.toggle('is-pm', t === 'pm');
      $$('.rstep').forEach(function (r) { r.classList.toggle('is-hidden', r.getAttribute('data-show').split(' ').indexOf(t) < 0); });
      $('.js-eye-n').textContent = t === 'pm' ? '1' : '3';
    });
  });

  /* ---------- reviews (Loox-style) ---------- */
  var RV = [
    { n: 'Carol M.', a: 61, r: 5, d: '2 days ago', img: 'photo-1566616213894-2d4e1baee5d8', video: true, t: 'Eight weeks in and the lines around my eyes have softened so much. The night balm is heaven.', tags: ['lines'] },
    { n: 'Maria S.', a: 52, r: 5, d: '4 days ago', img: 'photo-1592621385612-4d7129426394', lbl: 'Before', t: 'My skin had gone grey and tired. Now people tell me I look rested, even on 5 hours of sleep.', tags: ['firm'] },
    { n: 'Patricia L.', a: 54, r: 5, d: '5 days ago', t: 'Every retinol I tried left me red and flaky. This gives me results without the irritation.', tags: ['sensitive', 'lines'] },
    { n: 'Denise R.', a: 66, r: 5, d: '1 week ago', img: 'photo-1508214751196-bcfd4ca60f91', t: 'The firmness around my cheeks and jaw is noticeable. My husband commented without me saying anything!', tags: ['firm'] },
    { n: 'Susan B.', a: 49, r: 4, d: '1 week ago', t: 'The eye balm is the star for me. Concealer goes on so much smoother. Wish the jar was bigger.', tags: ['dark'] },
    { n: 'Teresa G.', a: 47, r: 5, d: '2 weeks ago', img: 'photo-1594744803329-e58b31de8bf5', video: true, t: 'Puffiness is gone in the morning. I keep the eye balm in the fridge for extra cooling.', tags: ['dark'] },
    { n: 'Margaret T.', a: 72, r: 5, d: '2 weeks ago', img: 'photo-1599305090598-fe179d501227', t: 'At 72 I didn’t expect this. My skin feels plump and soft again. Already on my second order.', tags: ['firm', 'lines'] },
    { n: 'Angela D.', a: 58, r: 5, d: '3 weeks ago', t: 'No stinging, no breakouts, no fragrance headache. Just softer, brighter skin.', tags: ['sensitive'] },
    { n: 'Jennifer K.', a: 52, r: 5, d: '3 weeks ago', img: 'photo-1601049541289-9b1b7bbbfe19', t: 'Replaced 7 products with 4. I spend less than on my old luxury cream and my skin looks better.', tags: ['lines'] },
    { n: 'Barbara W.', a: 64, r: 4, d: '1 month ago', t: 'Didn’t see much the first two weeks, but by week six my skin looked noticeably firmer.', tags: ['firm'] },
    { n: 'Helen F.', a: 69, r: 5, d: '1 month ago', img: 'photo-1573461160327-b450ce3d8e7f', t: 'Better than my $300 cream. More hydrated and even. Wish I’d found this sooner.', tags: ['lines', 'firm'] },
    { n: 'Rosa P.', a: 55, r: 5, d: '2 months ago', t: 'Winter used to destroy my skin. Now it stays soft all day. The polish is gentle on my cheeks.', tags: ['sensitive'] }
  ];
  var rf = 'all', shown = 8, grid = $('.js-reviews');
  function renderRV() {
    var list = RV.filter(function (r) { return rf === 'all' || (rf === 'photo' ? !!r.img : r.tags.indexOf(rf) > -1); });
    grid.innerHTML = list.slice(0, shown).map(function (r) {
      return '<article class="rcard">' + (r.img ? '<div class="rcard__media"><img src="' + U(r.img, 400, 530) + '" alt="Photo from ' + r.n + '" loading="lazy">' + (r.video ? '<span class="vcard__play">' + ic('play') + '</span>' : '') + (r.lbl ? '<span class="rcard__lbl">' + r.lbl + '</span>' : '') + '</div>' : '') +
        '<div class="rcard__body"><p class="rcard__name">' + r.n + '<small>' + r.d + '</small></p><span class="stars stars--sm" style="--r:' + r.r + '"></span><i class="verified">✓ Verified buyer</i><p>' + r.t + '</p></div></article>';
    }).join('') || '<p class="center" style="column-span:all;color:#6a6472">No reviews match this filter yet.</p>';
    $('.js-more').style.display = list.length > shown ? '' : 'none';
  }
  $$('.chip').forEach(function (c) { c.addEventListener('click', function () { rf = c.getAttribute('data-filter'); shown = 8; $$('.chip').forEach(function (x) { x.classList.toggle('is-active', x === c); }); renderRV(); }); });
  $('.js-more').addEventListener('click', function () { shown += 8; renderRV(); });
  function toggler(btn, el) { btn.addEventListener('click', function () { var open = el.hidden; el.hidden = !open; btn.setAttribute('aria-expanded', open); }); }
  toggler($('.js-rv-sum'), $('.js-rv-dist')); toggler($('.js-rv-filter-btn'), $('.js-rv-filters'));
  renderRV();

  /* ---------- cart ---------- */
  var cart = [];
  function addSystem() {
    var p = subOn ? PRICE.sub : PRICE.once;
    cart = cart.filter(function (i) { return i.id !== 'sys'; });
    cart.unshift({ id: 'sys', name: 'The Complete Renewal System', v: subOn ? '40-day supply · Subscribe & save 50%' : '40-day supply · One-time', price: p, compare: PRICE.compare, img: 'images/system.svg' });
    renderCart(); openEl($('#cart'));
    var c = $('.js-cart-count'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  }
  $$('.js-atc').forEach(function (b) { b.addEventListener('click', addSystem); });
  $('.js-add-upsell').addEventListener('click', function () { if (!cart.some(function (i) { return i.id === 'up'; })) cart.push({ id: 'up', name: 'Mineral SPF 30 Veil', v: 'Routine add-on', price: 22, compare: 32, img: 'images/spf.svg' }); renderCart(); toast('Added Mineral SPF 30 Veil'); });
  function renderCart() {
    var box = $('.js-cart-items'), total = 0, compare = 0;
    box.innerHTML = cart.length ? cart.map(function (i) {
      total += i.price; compare += i.compare;
      return '<div class="cart-item"><img src="' + i.img + '" alt=""><div><b>' + i.name + '</b><small>' + i.v + '</small><button class="cart-item__rm" data-rm="' + i.id + '">Remove</button></div><div class="cart-item__price">' + money(i.price) + '<s>' + money(i.compare) + '</s></div></div>';
    }).join('') : '<p class="cart-empty">Your cart is empty.</p>';
    $$('[data-rm]', box).forEach(function (b) { b.addEventListener('click', function () { var id = b.getAttribute('data-rm'); cart = cart.filter(function (i) { return i.id !== id; }); renderCart(); }); });
    var count = cart.length;
    $('.js-cart-count').textContent = count; $('.js-cart-count-text').textContent = '(' + count + ')';
    $('.js-cart-total').textContent = money(total);
    $('.js-cart-saving').textContent = compare > total ? 'You’re saving ' + money(compare - total) : '';
    $('.js-upsell').style.display = cart.some(function (i) { return i.id === 'sys'; }) && !cart.some(function (i) { return i.id === 'up'; }) ? '' : 'none';
    var msg = !total ? 'Add the system to unlock <b>free shipping</b>' : total < 125 ? '✓ Free shipping unlocked. Add <b>' + money(125 - total) + '</b> for a free face cloth' : total < 150 ? 'Face cloth unlocked! <b>' + money(150 - total) + '</b> away from a free hand balm' : 'You’ve unlocked <b>every free gift</b> 🎉';
    $('.js-ship-msg').innerHTML = msg;
    $('.js-ship-fill').style.width = (total ? Math.min(100, Math.max(25, total / 150 * 100)) : 0) + '%';
  }
  renderCart();

  /* cross-sell */
  var XS = [
    { id: 'x1', n: 'Peptide Day Cream', t: 'Firm · 50 ml', p: 52, c: 65, r: 4.8, cnt: 1204, img: 'images/day.svg', badge: 'Bestseller' },
    { id: 'x2', n: 'Night Renewal Balm', t: 'Repair · 50 ml', p: 52, c: 65, r: 4.9, cnt: 986, img: 'images/night.svg' },
    { id: 'x3', n: 'Bright Eye Balm', t: 'Brighten · 15 ml', p: 36, c: 45, r: 4.7, cnt: 742, img: 'images/eye.svg' },
    { id: 'x4', n: 'Cleansing Polish', t: 'Exfoliate · 100 ml', p: 38, c: 48, r: 4.8, cnt: 611, img: 'images/cleanser.svg' },
    { id: 'x5', n: 'Mineral SPF 30 Veil', t: 'Protect · 30 ml', p: 32, c: 40, r: 4.7, cnt: 389, img: 'images/spf.svg', badge: 'New' },
    { id: 'x6', n: 'Lip & Neck Serum', t: 'Smooth · 30 ml', p: 29, c: 36, r: 4.8, cnt: 455, img: 'images/serum.svg' }
  ];
  $('.js-xsell-track').innerHTML = XS.map(function (x) {
    return '<article class="xcard"><div class="xcard__img"><img src="' + x.img + '" alt="' + x.n + '" loading="lazy" width="400" height="400">' + (x.badge ? '<span class="xcard__badge">' + x.badge + '</span>' : '') + '</div><div class="xcard__body"><span class="xcard__rv"><span class="stars stars--sm" style="--r:' + x.r + '"></span>(' + x.cnt.toLocaleString('en-US') + ')</span><h3>' + x.n.replace('&', '&amp;') + '</h3><span class="xcard__tag">' + x.t + '</span><p class="xcard__price">$' + x.p + '<s>$' + x.c + '</s></p><button class="xcard__add" type="button" data-x="' + x.id + '">Add to cart</button></div></article>';
  }).join('');
  $$('.xcard__add').forEach(function (b) {
    b.addEventListener('click', function () {
      var x = XS.filter(function (i) { return i.id === b.getAttribute('data-x'); })[0];
      if (!cart.some(function (i) { return i.id === x.id; })) cart.push({ id: x.id, name: x.n, v: x.t, price: x.p, compare: x.c, img: x.img });
      renderCart(); b.textContent = 'Added ✓'; b.classList.add('is-added');
      setTimeout(function () { b.textContent = 'Add to cart'; b.classList.remove('is-added'); }, 1800);
      toast('Added ' + x.n + ' to your cart');
      var c = $('.js-cart-count'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    });
  });
  initCarousel($('[data-carousel="xsell"]'));
  $('.js-news').addEventListener('submit', function (e) { e.preventDefault(); this.reset(); toast('Welcome! Check your inbox for 10% off.'); });

  /* ---------- sticky ATC (mobile) ---------- */
  var sticky = $('.sticky-atc'), mainAtc = $('#atc');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      var show = !e[0].isIntersecting && mainAtc.getBoundingClientRect().top < 0;
      sticky.classList.toggle('is-visible', show); sticky.setAttribute('aria-hidden', !show);
      $('.btn-atc', sticky).tabIndex = show ? 0 : -1;
    }).observe(mainAtc);
  }

  /* ---------- reveal + count-up ---------- */
  if (!reduced && 'IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; el.style.transition = 'opacity .8s cubic-bezier(.22,.8,.24,1), transform .8s cubic-bezier(.22,.8,.24,1)'; el.style.opacity = 1; el.style.transform = 'none';
        var c = el.querySelector('.js-count');
        if (c) { var to = +c.getAttribute('data-to'), t0 = performance.now(); (function s(t) { var k = Math.min(1, (t - t0) / 1300); c.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(s); })(t0); }
        rio.unobserve(el);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach(function (el) { rio.observe(el); });
  } else $$('.reveal').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });

  window.addEventListener('load', function () {
    if (!window.gsap || reduced) return;
    window.gsap.from('.buybox > *', { y: 14, opacity: 0, duration: .7, stagger: .035, ease: 'power3.out', clearProps: 'all' });
  });
})();
