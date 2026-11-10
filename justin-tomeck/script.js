/* =========================================================
   Willowmere Bed & Breakfast — homepage interactions
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const U = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------------------------------------------------
     Crest logo (wreath + roofline monogram), injected everywhere
     --------------------------------------------------------- */
  function crestSVG() {
    let leaves = '';
    const leaf = (a, r, side) => {
      const rad = (a * Math.PI) / 180;
      const x = 50 + r * Math.cos(rad);
      const y = 50 + r * Math.sin(rad);
      const rot = a + (side < 0 ? 90 + 28 : 90 - 28);
      return `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="1.9" ry="4.6" transform="rotate(${rot.toFixed(1)} ${x.toFixed(2)} ${y.toFixed(2)})"/>`;
    };
    for (let a = 102; a <= 226; a += 13) leaves += leaf(a, 37, -1);
    for (let a = 78; a >= -46; a -= 13) leaves += leaf(a, 37, 1);
    return `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
      <circle cx="50" cy="50" r="47" stroke-width="1.3"/>
      <circle cx="50" cy="50" r="43.5" stroke-width=".6" stroke-dasharray="1.5 2.2"/>
      <path d="M50 87 C34 86 20 74 15 60 M50 87 C66 86 80 74 85 60" stroke-width=".9" opacity=".7"/>
      <g fill="currentColor" stroke="none" opacity=".85">${leaves}</g>
      <path d="M35 41 L50 29 L65 41" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M58 34.5 V30 h3.5 v7.3" stroke-width="1.3"/>
      <text x="50" y="66" text-anchor="middle" fill="currentColor" stroke="none" font-family="Cormorant Garamond, serif" font-size="27" font-style="italic" font-weight="500">W</text>
      <text x="50" y="78" text-anchor="middle" fill="currentColor" stroke="none" font-family="Jost, sans-serif" font-size="5.2" letter-spacing="1.6">EST·1898</text>
    </svg>`;
  }
  const crest = crestSVG();
  $$('[data-crest]').forEach((el) => (el.innerHTML = crest));

  /* ---------------------------------------------------------
     Header: hide on scroll down, active section, mobile menu
     --------------------------------------------------------- */
  const nav = $('#nav');
  const burger = $('#burger');
  const mnav = $('#mnav');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (!mnav.hidden) return;
    nav.classList.toggle('hide', y > lastY && y > 500);
    lastY = y;
  }, { passive: true });

  const toggleMenu = (open) => {
    mnav.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleMenu(mnav.hidden));
  $$('a', mnav).forEach((a) => a.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mnav.hidden) toggleMenu(false); });

  const navLinks = $$('.nav-links a');
  const secIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['about', 'rooms', 'experiences', 'gallery', 'offers', 'faq'].forEach((id) => { const s = document.getElementById(id); if (s) secIO.observe(s); });

  /* ---------------------------------------------------------
     Reveal on view
     --------------------------------------------------------- */
  const revIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); revIO.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach((el) => revIO.observe(el));

  /* ---------------------------------------------------------
     HERO: auto gallery (10s) + circular hover thumbnails
     --------------------------------------------------------- */
  const heroImgs = [
    ['1464146072230-91cabc968266', 'The Manor House'],
    ['1570129477492-45c003edd2be', 'The Front Porch'],
    ['1505693416388-ac5ce068fe85', 'The Rosewood Room'],
    ['1504754524776-8f4f37790ca0', 'Farmhouse Breakfast'],
    ['1585320806297-9794b3e4eeae', 'The Rose Walk'],
    ['1620626011761-996317b8d101', 'Garden Suite Bath'],
    ['1505916349660-8d91a99c3e23', 'The Lakeview Cottage'],
    ['1500382017468-9049fed747ef', 'Golden Hour Fields'],
  ];
  const hgStack = $('#hgStack');
  const hgThumbs = $('#hgThumbs');
  const hgCap = $('#hgCap');
  const hgNum = $('#hgNum');
  const hgBar = $('#hgBar');
  const HERO_MS = 10000;
  heroImgs.forEach(([id, cap], i) => {
    const img = new Image();
    img.src = U(id, 1400);
    img.alt = cap;
    if (i > 1) img.loading = 'lazy';
    hgStack.appendChild(img);
    const b = document.createElement('button');
    b.className = 'hg-thumb';
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', cap);
    b.innerHTML = `<img src="${U(id, 140)}" alt="" loading="lazy">`;
    const pick = () => heroGo(i, b);
    b.addEventListener('mouseenter', pick);
    b.addEventListener('focus', pick);
    b.addEventListener('click', pick);
    hgThumbs.appendChild(b);
  });
  const hgImgEls = $$('img', hgStack);
  const hgThumbEls = $$('.hg-thumb', hgThumbs);
  let heroIdx = -1;
  let heroTimer = null;
  let heroStart = 0;
  function heroGo(i, fromEl) {
    if (i === heroIdx) { heroStart = performance.now(); return; }
    const frame = $('#hgFrame').getBoundingClientRect();
    let cx = '50%', cy = '100%';
    if (fromEl) {
      const r = fromEl.getBoundingClientRect();
      cx = ((r.left + r.width / 2 - frame.left) / frame.width * 100).toFixed(1) + '%';
      cy = '100%';
    } else {
      cx = (20 + Math.random() * 60).toFixed(0) + '%';
      cy = (Math.random() > 0.5 ? 0 : 100) + '%';
    }
    hgImgEls.forEach((im) => im.classList.remove('prev'));
    if (heroIdx >= 0) { hgImgEls[heroIdx].classList.remove('on'); hgImgEls[heroIdx].classList.add('prev'); }
    const el = hgImgEls[i];
    el.style.setProperty('--cx', cx);
    el.style.setProperty('--cy', cy);
    el.classList.remove('on');
    void el.offsetWidth;
    el.classList.add('on');
    hgThumbEls.forEach((t, k) => { t.classList.toggle('on', k === i); t.setAttribute('aria-selected', String(k === i)); });
    hgCap.textContent = heroImgs[i][1];
    hgNum.textContent = String(i + 1).padStart(2, '0');
    heroIdx = i;
    heroStart = performance.now();
  }
  function heroLoop(now) {
    const p = clamp((now - heroStart) / HERO_MS, 0, 1);
    hgBar.style.transform = `scaleX(${p})`;
    if (p >= 1) heroGo((heroIdx + 1) % heroImgs.length);
    heroTimer = requestAnimationFrame(heroLoop);
  }
  heroGo(0);
  heroTimer = requestAnimationFrame(heroLoop);

  /* ---------------------------------------------------------
     TRUST: two crossing ribbons, scroll-velocity driven
     --------------------------------------------------------- */
  const ribbons = $$('.ribbon').map((el) => {
    const track = $('.ribbon-track', el);
    track.innerHTML += track.innerHTML + track.innerHTML; // triple for seamless loop
    return { el, track, dir: Number(el.dataset.dir), x: 0, w: 0, slow: false };
  });
  const measureRibbons = () => ribbons.forEach((r) => { r.w = r.track.scrollWidth / 3; });
  measureRibbons();
  window.addEventListener('resize', measureRibbons);
  ribbons.forEach((r) => {
    r.el.addEventListener('mouseenter', () => (r.slow = true));
    r.el.addEventListener('mouseleave', () => (r.slow = false));
  });
  let scrollVel = 0;
  let prevScroll = window.scrollY;
  let lastT = performance.now();
  const trustSec = $('.trust');
  function ribbonLoop(t) {
    const dt = Math.min(0.05, (t - lastT) / 1000);
    lastT = t;
    const sy = window.scrollY;
    const dv = sy - prevScroll;
    prevScroll = sy;
    scrollVel += (dv * 18 - scrollVel) * 0.12;
    const tr = trustSec.getBoundingClientRect();
    const p = clamp((window.innerHeight - tr.top) / (window.innerHeight + tr.height), 0, 1);
    ribbons.forEach((r, i) => {
      const base = r.slow ? 18 : 60;
      const boost = Math.min(900, Math.abs(scrollVel)) * Math.sign(scrollVel || 1);
      r.x += (base + boost * 0.9) * dt * r.dir * (i === 0 ? 1 : 1);
      if (r.w) { r.x = ((r.x % r.w) + r.w) % r.w; }
      r.track.style.transform = `translate3d(${-r.x}px,0,0)`;
      const rot = i === 0 ? -4 + (p - 0.5) * 4 : 3.5 - (p - 0.5) * 4;
      r.el.style.transform = `rotate(${rot.toFixed(2)}deg)`;
    });
    requestAnimationFrame(ribbonLoop);
  }
  if (!reduce) requestAnimationFrame(ribbonLoop);

  /* ---------------------------------------------------------
     ABOUT: hanging cards with own slide + swing interaction
     --------------------------------------------------------- */
  const hang = $('#hang');
  const hangTrack = $('#hangTrack');
  const hangVp = $('.hang-viewport', hang);
  const hcards = $$('.hcard', hangTrack);
  const hangDots = $('#hangDots');
  const HANG_MS = 6500;
  const hangLabels = ['Our story', 'The house', 'The gardens', 'The kitchen', 'Neighbourhood'];
  hcards.forEach((c, i) => {
    const d = document.createElement('button');
    d.className = 'hang-dot';
    d.type = 'button';
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', hangLabels[i]);
    d.style.setProperty('--dur', HANG_MS + 'ms');
    d.innerHTML = '<i></i>';
    d.addEventListener('click', () => hangGo(i));
    hangDots.appendChild(d);
  });
  const hDots = $$('.hang-dot', hangDots);
  let hIdx = 0;
  let hTimer = null;
  let hOffset = 0;
  function hangOffset(i) {
    const vw = hangVp.clientWidth;
    const cw = hcards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(hangTrack).columnGap) || 0;
    return (vw - cw) / 2 - i * (cw + gap);
  }
  function hangGo(i, opts = {}) {
    const n = hcards.length;
    i = (i + n) % n;
    const dir = i > hIdx ? 'swing-l' : 'swing-r';
    hIdx = i;
    hOffset = hangOffset(i);
    hangTrack.style.transform = `translate3d(${hOffset}px,0,0)`;
    hcards.forEach((c, k) => {
      c.classList.toggle('on', k === i);
      c.setAttribute('aria-hidden', String(k !== i));
      if (!opts.silent && !reduce) {
        c.classList.remove('swing-l', 'swing-r');
        void c.offsetWidth;
        c.classList.add(dir);
      }
    });
    hDots.forEach((d, k) => {
      d.classList.remove('on');
      d.classList.toggle('done', k < i);
      d.setAttribute('aria-selected', String(k === i));
    });
    void hDots[i].offsetWidth;
    hDots[i].classList.add('on');
    clearTimeout(hTimer);
    if (!hang.classList.contains('paused')) hTimer = setTimeout(() => hangGo(hIdx + 1), HANG_MS);
  }
  $('#hangPrev').addEventListener('click', () => hangGo(hIdx - 1));
  $('#hangNext').addEventListener('click', () => hangGo(hIdx + 1));
  hang.addEventListener('mouseenter', () => { hang.classList.add('paused'); clearTimeout(hTimer); });
  hang.addEventListener('mouseleave', () => { hang.classList.remove('paused'); hangGo(hIdx, { silent: true }); });
  hcards.forEach((c, k) => c.addEventListener('click', () => { if (k !== hIdx) hangGo(k); }));
  // drag / swipe
  let dragX = null;
  let dragDx = 0;
  hangVp.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragX = e.clientX; dragDx = 0;
    hangTrack.style.transition = 'none';
  });
  window.addEventListener('pointermove', (e) => {
    if (dragX === null) return;
    dragDx = e.clientX - dragX;
    hangTrack.style.transform = `translate3d(${hOffset + dragDx * 0.7}px,0,0)`;
  });
  window.addEventListener('pointerup', () => {
    if (dragX === null) return;
    hangTrack.style.transition = '';
    const dx = dragDx;
    dragX = null;
    if (Math.abs(dx) > 60) hangGo(hIdx + (dx < 0 ? 1 : -1));
    else hangTrack.style.transform = `translate3d(${hOffset}px,0,0)`;
  });
  window.addEventListener('resize', () => hangGo(hIdx, { silent: true }));
  hangGo(0, { silent: true });

  /* ---------------------------------------------------------
     ROOMS: middle list drives both side cards
     --------------------------------------------------------- */
  const rooms = [
    { name: 'The Meadow Room', meta: 'Queen · Sleeps 2 · 24 m²', price: 179, sleeps: 2,
      text: 'Light and airy with a window seat over the wildflower meadow. Our guests’ favourite for a first visit and a quiet reading weekend.',
      l: ['1522771739844-6a9f6d5f14af', '1615874959474-d609969a20ed', '1552321554-5fefe8c9ef14', '1495474472287-4d71bcdd2085'],
      r: ['1595526114035-0d45ed16cfbf', '1519710164239-da123dc03ef4', '1502672260266-1c1ef2d93688', '1616594039964-ae9021a400a0'],
      ll: 'Queen bed · Meadow view', rl: 'Window seat · Rain shower' },
    { name: 'The Garden Suite', meta: 'King · Sleeps 2 · 36 m² · Terrace', price: 249, sleeps: 2,
      text: 'A private terrace opening onto the rose walk, a freestanding soaking tub and a pet-friendly garden gate. Perfect for anniversaries.',
      l: ['1596394516093-501ba68a0ba6', '1600210492486-724fe5c67fb0', '1585320806297-9794b3e4eeae', '1620626011761-996317b8d101'],
      r: ['1578683010236-d716f9a3f461', '1586023492125-27b2c045efd7', '1507089947368-19c1da9775ae', '1490750967868-88aa4486c946'],
      ll: 'King bed · Private terrace', rl: 'Soaking tub · Pet friendly' },
    { name: 'The Maple Loft', meta: 'King + daybed · Sleeps 3 · 40 m²', price: 229, sleeps: 3,
      text: 'Under the old oak beams of the hayloft: warm wood, a cosy daybed and a clawfoot tub. Ideal for small families and long stays.',
      l: ['1611892440504-42a792e24d32', '1590381105924-c72589b9ef3f', '1507652313519-d4e9174996dd', '1470337458703-46ad1756a187'],
      r: ['1582719478250-c89cae4dc85b', '1598928506311-c55ded91a20c', '1617104678098-de229db51175', '1449844908441-8829872d2607'],
      ll: 'King + daybed · Oak beams', rl: 'Clawfoot tub · Sleeps 3' },
    { name: 'The Rosewood Room', meta: 'Four-poster King · Sleeps 2 · 30 m²', price: 209, sleeps: 2,
      text: 'Our most romantic room: a carved four-poster, a working fireplace and a bottle of local wine waiting on arrival.',
      l: ['1505693416388-ac5ce068fe85', '1560185893-a55cbc8c57e8', '1584132967334-10e028bd69f7', '1510812431401-41d2bd2722f3'],
      r: ['1590490360182-c33d57733427', '1618773928121-c32242e63f39', '1513694203232-719a280e022f', '1591088398332-8a7791972843'],
      ll: 'Four-poster · Fireplace', rl: 'Welcome wine · Garden view' },
    { name: 'The Lakeview Cottage', meta: 'King + twin · Sleeps 4 · 55 m²', price: 329, sleeps: 4,
      text: 'A stone cottage of its own by the pond, with a kitchenette, a porch swing and breakfast delivered in a basket if you’d rather stay in.',
      l: ['1501117716987-c8c394bb29df', '1560067174-c5a3a8f37060', '1600585154526-990dced4db0d', '1473448912268-2022ce9509d8'],
      r: ['1505916349660-8d91a99c3e23', '1631049307264-da0ec9d70304', '1540518614846-7eded433c457', '1464146072230-91cabc968266'],
      ll: 'Private cottage · Porch swing', rl: 'Kitchenette · Sleeps 4' },
  ];
  const rList = $('#rList');
  const rDetailText = $('.rdetail-text');
  const rPrice = $('.rprice');
  const rSides = [$('#rcardL'), $('#rcardR')].map((card, side) => ({
    card, side,
    stack: $('.rmain-stack', card),
    label: $('.rlabel', card),
    thumbs: $('.rthumbs', card),
  }));
  let roomIdx = -1;
  function setMain(s, id) {
    const img = new Image();
    img.src = U(id, 900);
    img.alt = '';
    img.className = 'enter';
    s.stack.appendChild(img);
    const go = () => requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add('go')));
    if (img.complete) go(); else { img.onload = go; setTimeout(go, 400); }
    const olds = $$('img', s.stack).slice(0, -1);
    setTimeout(() => olds.forEach((o) => o.remove()), 1200);
  }
  function setRoom(i) {
    if (i === roomIdx) return;
    roomIdx = i;
    const room = rooms[i];
    $$('.ritem', rList).forEach((li, k) => li.classList.toggle('on', k === i));
    rSides.forEach((s, side) => {
      const imgs = side === 0 ? room.l : room.r;
      setTimeout(() => setMain(s, imgs[0]), side * 140);
      s.label.textContent = side === 0 ? room.ll : room.rl;
      s.thumbs.innerHTML = imgs.slice(1).map((id, k) => `<button type="button" class="rthumb" data-id="${id}" aria-label="${room.name} photo ${k + 2}"><img src="${U(id, 360)}" alt="" loading="lazy"></button>`).join('');
      s.thumbs.classList.remove('swap'); void s.thumbs.offsetWidth; s.thumbs.classList.add('swap');
      $$('.rthumb', s.thumbs).forEach((t) => {
        const fn = () => {
          if (t.classList.contains('on')) return;
          $$('.rthumb', s.thumbs).forEach((x) => x.classList.toggle('on', x === t));
          setMain(s, t.dataset.id);
        };
        t.addEventListener('mouseenter', fn);
        t.addEventListener('click', fn);
      });
    });
    rDetailText.textContent = room.text;
    rDetailText.classList.remove('swap'); void rDetailText.offsetWidth; rDetailText.classList.add('swap');
    rPrice.innerHTML = `$${room.price}<small> / night</small>`;
  }
  rooms.forEach((r, i) => {
    const li = document.createElement('li');
    li.className = 'ritem';
    li.innerHTML = `<button type="button"><svg class="rleaf" viewBox="0 0 12 12" aria-hidden="true"><path fill="currentColor" d="M1 11C1 5 5 1 11 1 11 7 7 11 1 11Z"/></svg><span class="rname">${r.name}</span><span class="rmeta">${r.meta} · from $${r.price}</span></button>`;
    const b = $('button', li);
    b.addEventListener('mouseenter', () => setRoom(i));
    b.addEventListener('focus', () => setRoom(i));
    b.addEventListener('click', () => setRoom(i));
    rList.appendChild(li);
  });
  setRoom(0);
  $('#rBook').addEventListener('click', () => bookingPickRoom(roomIdx));
  $$('[data-room]').forEach((a) => a.addEventListener('click', () => setRoom(Number(a.dataset.room))));

  /* ---------------------------------------------------------
     WHY STAY: flip cards, spotlight, leaves, counters
     --------------------------------------------------------- */
  const whyData = [
    { t: 'Breakfast worth waking for', p: 'Three homemade courses, eggs from our own hens, served until 10:30.', icon: '<path d="M4 13h13a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M17 14h1.5a2.5 2.5 0 0 0 0-5H17v5"/><path d="M8 4c-1 1.5 1 2.5 0 4M12 4c-1 1.5 1 2.5 0 4"/><path d="M3 20h17"/>',
      q: '“The lemon ricotta pancakes alone are worth the drive. We still talk about them.”', who: 'Emily & Rob, Boston' },
    { t: 'Hosts who remember you', p: 'Justin and family greet every guest by name and know the best table in town.', icon: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2 .8 3 2.8 3 6"/>',
      q: '“They remembered my husband’s birthday from a booking two years ago. Who does that?!”', who: 'Priya S., New Jersey' },
    { t: 'Sleep like you mean it', p: 'Hand-tied mattresses, organic 400-thread linens and real blackout curtains.', icon: '<path d="M3 18V8M3 14h18v4M21 18v-4a3 3 0 0 0-3-3h-8v3"/><circle cx="6.5" cy="11.5" r="1.8"/><path d="M15 3.5a3 3 0 0 0 4 4 3.5 3.5 0 1 1-4-4z"/>',
      q: '“Best night’s sleep I’ve had in years. I asked where the mattress was from before we left.”', who: 'Marcus T., Brooklyn' },
    { t: 'Three acres to breathe', p: 'Rose walk, orchard, pond and hammocks. No traffic, just birdsong.', icon: '<path d="M12 21v-8"/><path d="M12 13c-4 0-7-3-7-7 4 0 7 3 7 7z"/><path d="M12 11c0-4 3-7 7-7 0 4-3 7-7 7z"/><path d="M5 21h14"/>',
      q: '“We spent a whole afternoon in the hammocks by the willow and didn’t look at our phones once.”', who: 'The Nguyen family' },
    { t: 'Book direct, pay less', p: 'Our best rate, free date changes and a welcome gift, only on this website.', icon: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/><path d="M15 3l2 3M9 3 7 6"/>',
      q: '“Booked and paid in two minutes on my phone, and the price was lower than every travel site.”', who: 'Hannah L., Albany' },
    { t: 'The little things, done', p: 'Evening cookies, turndown chocolates, EV charging and a pantry that’s always open.', icon: '<path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.4 7.2 17.9l.9-5.4L4.2 8.7l5.4-.8z"/>',
      q: '“Warm cookies at 9 pm, a hot water bottle in the bed… it’s the details that got us.”', who: 'Daniel & Jo, Philadelphia' },
  ];
  const whyStats = ['3 courses', '15 yrs hosting', '400 thread', '3 acres', '10% saved', '24/7 pantry'];
  const mkFlip = (d, i) => `
    <div class="flip" tabindex="0">
      <div class="flip-in">
        <div class="flip-face flip-front">
          <span class="flip-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${d.icon}</svg></span>
          <span class="flip-num">0${i + 1} · ${whyStats[i]}</span>
          <h3>${d.t}</h3>
          <p>${d.p}</p>
        </div>
        <div class="flip-face flip-back">
          <span class="stars">★★★★★</span>
          <blockquote>${d.q}</blockquote>
          <cite>${d.who}</cite>
        </div>
      </div>
    </div>`;
  $('#whyL').innerHTML = whyData.slice(0, 3).map((d, i) => mkFlip(d, i)).join('');
  $('#whyR').innerHTML = whyData.slice(3).map((d, i) => mkFlip(d, i + 3)).join('');
  const flips = $$('.flip');
  const flipIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        const k = flips.indexOf(en.target);
        setTimeout(() => en.target.classList.add('in'), (k % 3) * 140);
        flipIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.2 });
  flips.forEach((f) => {
    flipIO.observe(f);
    f.addEventListener('mousemove', (e) => {
      const r = f.getBoundingClientRect();
      f.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      f.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    if (!finePointer) f.addEventListener('click', () => f.classList.toggle('tap'));
  });
  const why = $('#why');
  const whyGlow = $('#whyGlow');
  why.addEventListener('mousemove', (e) => {
    const r = why.getBoundingClientRect();
    whyGlow.style.left = (e.clientX - r.left) + 'px';
    whyGlow.style.top = (e.clientY - r.top) + 'px';
  });
  if (!reduce) {
    const leavesEl = $('#whyLeaves');
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('span');
      s.style.left = (Math.random() * 100) + '%';
      s.style.animationDuration = (14 + Math.random() * 14) + 's';
      s.style.animationDelay = (-Math.random() * 24) + 's';
      s.style.setProperty('--dx', ((Math.random() - 0.5) * 300) + 'px');
      s.style.setProperty('--rot', ((Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360)) + 'deg');
      s.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
      s.innerHTML = '<svg viewBox="0 0 14 22"><path d="M7 0C12 6 12 15 7 22 2 15 2 6 7 0Z"/></svg>';
      leavesEl.appendChild(s);
    }
  }
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const to = parseFloat(el.dataset.count);
      const dec = Number(el.dataset.dec || 0);
      const t0 = performance.now();
      const step = (t) => {
        const p = clamp((t - t0) / 1800, 0, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = (to * e).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach((el) => countIO.observe(el));

  /* ---------------------------------------------------------
     EXPERIENCES: 3 scroll-driven circles × 4 hover quarters
     --------------------------------------------------------- */
  const circles = [
    { name: 'Mornings', sub: 'First light', main: '#56725a', soft: '#e3eedd',
      intro: 'Slow, sun-lit mornings that start with the smell of fresh bread and end whenever you like.',
      items: [
        { k: 'Included', t: 'Farmhouse Breakfast', img: '1504754524776-8f4f37790ca0', d: 'Three homemade courses in the sunroom or on the terrace, with eggs from our hens and fruit from the orchard.', f: [['8–10:30', 'Served'], ['Daily', 'New hot dish'], ['All', 'Diets welcome'], ['Free', 'For every guest']] },
        { k: 'Included', t: 'Coffee in the Garden', img: '1495474472287-4d71bcdd2085', d: 'A coffee and tea station opens at 6:30. Take a pot down to the willow bench and watch the mist lift off the pond.', f: [['6:30', 'Opens'], ['Local', 'Roaster'], ['8', 'Loose teas'], ['∞', 'Refills']] },
        { k: 'Saturdays', t: 'Sunrise Yoga', img: '1500382017468-9049fed747ef', d: 'A gentle 45-minute flow on the meadow lawn with a local instructor. Mats, blankets and fresh mint water provided.', f: [['7:15', 'Start'], ['45 min', 'Session'], ['All', 'Levels'], ['$15', 'Per guest']] },
        { k: 'Daily', t: 'The Bakery Basket', img: '1525351484163-7529414344d8', d: 'Prefer to stay in? We’ll leave a basket of warm pastries, jam and juice at your door at the time you choose.', f: [['7–10', 'Delivered'], ['3', 'Pastries'], ['House', 'Jam'], ['Free', 'On request']] },
      ] },
    { name: 'Afternoons', sub: 'Out & about', main: '#6f9cb3', soft: '#e3eff5',
      intro: 'Long, golden afternoons: trails from our gate, bikes on loan and picnics packed in our kitchen.',
      items: [
        { k: 'Complimentary', t: 'E-Bikes & Trails', img: '1474552226712-ac0f0961a954', d: 'Borrow one of our e-bikes and follow the river trail to the village, the farm stand and three family wineries.', f: [['6', 'E-bikes'], ['12 mi', 'Trail'], ['Free', 'Helmets & maps'], ['9–5', 'Pick-up']] },
        { k: 'On the doorstep', t: 'Forest Walks', img: '1441974231531-c6227db76b6e', d: 'Two marked loops through our neighbours’ woodland, with a hand-drawn map and a flask of cocoa in colder months.', f: [['2', 'Loops'], ['45 min', 'Short loop'], ['Dogs', 'Welcome'], ['Free', 'Maps']] },
        { k: 'Summer', t: 'Lake & Kayaks', img: '1473448912268-2022ce9509d8', d: 'Paddle the quiet lake five minutes down the lane. We’ll book the kayaks and lend you towels and a dry bag.', f: [['5 min', 'Drive'], ['2', 'Seat kayaks'], ['May–Sep', 'Season'], ['$30', 'Half day']] },
        { k: 'Add-on', t: 'Garden Picnics', img: '1490750967868-88aa4486c946', d: 'A wicker hamper of local cheese, charcuterie, bread and lemonade, set up under the orchard trees just for you.', f: [['2 ppl', 'Serves'], ['Local', 'Produce'], ['Veg', 'Option'], ['$65', 'Per hamper']] },
      ] },
    { name: 'Evenings', sub: 'Firelight', main: '#7b2d3b', soft: '#f6e6e2',
      intro: 'Unhurried evenings by the fire pit, a glass of local wine and a soak before the softest bed in the county.',
      items: [
        { k: 'Fridays', t: 'Wine on the Porch', img: '1510812431401-41d2bd2722f3', d: 'A guided tasting of three Hudson Valley wines on the wraparound porch, with cheese from the farm down the road.', f: [['5:30', 'Pour'], ['3', 'Local wines'], ['Pairing', 'Cheese'], ['$25', 'Per guest']] },
        { k: 'Every night', t: 'Fire Pit & S’mores', img: '1478131143081-80f7f84ca84d', d: 'The fire pit is lit at dusk, blankets are in the basket and the s’mores kit never runs out. Stargazing guaranteed.', f: [['Dusk', 'Lit'], ['Free', 'S’mores'], ['Wool', 'Blankets'], ['∞', 'Stars']] },
        { k: 'In-room', t: 'Spa & Massage', img: '1544161515-4ab6ce6db874', d: 'Book a massage in your room from our visiting therapist, or a bath ritual with salts and candles we set up for you.', f: [['60 min', 'Massage'], ['In', 'Your room'], ['Organic', 'Oils'], ['$120', 'From']] },
        { k: 'Saturdays', t: 'Chef’s Supper', img: '1414235077428-338989a2e8c0', d: 'A seasonal four-course supper at one long candlelit table, cooked by our chef with produce from the kitchen garden.', f: [['7 pm', 'Seated'], ['4', 'Courses'], ['12', 'Seats only'], ['$75', 'Per guest']] },
      ] },
  ];
  const exp = $('#experiences');
  const expStage = $('#expStage');
  const expCircles = $('#expCircles');
  const expSteps = $('#expSteps');
  const expInfo = $('#expInfo');
  const expInfoIn = $('#expInfoIn');
  const expRing = $('#expRing');
  circles.forEach((c, ci) => {
    const el = document.createElement('div');
    el.className = 'circle';
    el.innerHTML = c.items.map((it, qi) => `
      <div class="q" tabindex="0" role="button" aria-label="${it.t}" data-q="${qi}">
        <img src="${U(it.img, 700)}" alt="" loading="lazy">
        <span class="q-label"><small>${it.k}</small>${it.t}</span>
      </div>`).join('') +
      `<div class="hub"><div class="hub-in"><small>0${ci + 1} · ${c.sub}</small><b>${c.name}</b><i>4 experiences</i></div></div>`;
    expCircles.appendChild(el);
    const li = document.createElement('li');
    li.innerHTML = `<span class="n">0${ci + 1}</span><span class="t">${c.name}<small>${c.sub}</small></span><span class="bar"><i></i></span>`;
    li.addEventListener('click', () => {
      const top = exp.getBoundingClientRect().top + window.scrollY;
      const span = exp.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + span * ((ci + 0.45) / 3), behavior: 'smooth' });
    });
    expSteps.appendChild(li);
  });
  const circleEls = $$('.circle', expCircles);
  const stepEls = $$('li', expSteps);
  let curCircle = -1;

  const splitChars = (txt) => {
    let k = 0;
    return txt.split(' ').map((w) => `<span style="display:inline-block;white-space:nowrap">${[...w].map((ch) => `<span class="ch" style="animation-delay:${(k++ * 0.028).toFixed(3)}s">${ch}</span>`).join('')}</span>`).join('<span class="sp"> </span>');
  };
  function renderInfo(kicker, title, text, facts, cta) {
    expInfoIn.innerHTML = `
      <p class="ei-kicker">${kicker}</p>
      <h3 class="ei-title">${splitChars(title)}</h3>
      <p class="ei-text">${text}</p>
      ${facts ? `<ul class="ei-list">${facts.map(([b, s]) => `<li><b>${b}</b><span>${s}</span></li>`).join('')}</ul>` : ''}
      ${cta ? `<a href="#book" class="btn btn-maroon btn-sm ei-cta">Add to my stay</a>` : ''}`;
    expInfo.classList.remove('draw'); void expInfo.offsetWidth; expInfo.classList.add('draw');
  }
  function circleIntro(ci) {
    const c = circles[ci];
    renderInfo(`0${ci + 1} / 03 · ${c.sub}`, c.name + ' at Willowmere', c.intro,
      c.items.map((it) => [it.t.split(' ')[0] === 'The' ? it.t.split(' ')[1] : it.t.split(' ')[0], it.k]), false);
  }
  function setCircle(ci) {
    if (ci === curCircle) return;
    curCircle = ci;
    circleEls.forEach((el, k) => {
      el.classList.toggle('on', k === ci);
      el.classList.toggle('past', k < ci);
      el.classList.remove('focus');
      $$('.q', el).forEach((q) => q.classList.remove('on'));
    });
    stepEls.forEach((li, k) => li.classList.toggle('on', k === ci));
    exp.style.setProperty('--c-main', circles[ci].main);
    exp.style.setProperty('--c-soft', circles[ci].soft);
    expStage.classList.remove('focus');
    circleIntro(ci);
  }
  circleEls.forEach((el, ci) => {
    const qs = $$('.q', el);
    qs.forEach((q, qi) => {
      const on = () => {
        if (ci !== curCircle) return;
        if (q.classList.contains('on') && el.classList.contains('focus')) return;
        el.classList.add('focus');
        expStage.classList.add('focus');
        qs.forEach((x) => x.classList.toggle('on', x === q));
        const it = circles[ci].items[qi];
        renderInfo(`${circles[ci].name} · ${it.k}`, it.t, it.d, it.f, true);
      };
      q.addEventListener('mouseenter', on);
      q.addEventListener('focus', on);
      q.addEventListener('click', on);
    });
    el.addEventListener('mouseleave', () => {
      if (ci !== curCircle) return;
      el.classList.remove('focus');
      expStage.classList.remove('focus');
      qs.forEach((x) => x.classList.remove('on'));
      circleIntro(ci);
    });
  });
  function expScroll() {
    const r = exp.getBoundingClientRect();
    const span = exp.offsetHeight - window.innerHeight;
    const p = clamp(-r.top / span, 0, 1);
    const ci = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2;
    setCircle(ci);
    stepEls.forEach((li, k) => $('.bar i', li).style.setProperty('--p', clamp(p * 3 - k, 0, 1)));
    expRing.style.transform = `rotate(${(p * 240).toFixed(1)}deg)`;
  }
  window.addEventListener('scroll', expScroll, { passive: true });
  window.addEventListener('resize', expScroll);
  expScroll();

  /* ---------------------------------------------------------
     GALLERY: 8 category cards → hover opens mosaic, 5s rotation
     --------------------------------------------------------- */
  const gal = [
    { n: 'Rooms', ic: '<path d="M3 18V8M3 14h18v4M21 18v-4a3 3 0 0 0-3-3h-8v3"/><circle cx="6.5" cy="11.5" r="1.8"/>', imgs: ['1522771739844-6a9f6d5f14af', '1505693416388-ac5ce068fe85', '1595526114035-0d45ed16cfbf', '1578683010236-d716f9a3f461', '1596394516093-501ba68a0ba6', '1611892440504-42a792e24d32'] },
    { n: 'Breakfast', ic: '<path d="M4 13h13a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M17 14h1.5a2.5 2.5 0 0 0 0-5H17v5"/><path d="M8 4c-1 1.5 1 2.5 0 4M12 4c-1 1.5 1 2.5 0 4"/>', imgs: ['1504754524776-8f4f37790ca0', '1525351484163-7529414344d8', '1495474472287-4d71bcdd2085', '1533777857889-4be7c70b33f7', '1505576399279-565b52d4ac71', '1543353071-873f17a7a088'] },
    { n: 'Gardens', ic: '<path d="M12 21v-8"/><path d="M12 13c-4 0-7-3-7-7 4 0 7 3 7 7z"/><path d="M12 11c0-4 3-7 7-7 0 4-3 7-7 7z"/>', imgs: ['1585320806297-9794b3e4eeae', '1490750967868-88aa4486c946', '1416879595882-3373a0480b5b', '1441974231531-c6227db76b6e', '1472214103451-9374bd1c798e', '1500382017468-9049fed747ef'] },
    { n: 'Lounge & Library', ic: '<path d="M4 19V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"/><path d="M2 13h4v4h12v-4h4M4 19v2M20 19v2"/>', imgs: ['1502672260266-1c1ef2d93688', '1586023492125-27b2c045efd7', '1513694203232-719a280e022f', '1600210492486-724fe5c67fb0', '1493809842364-78817add7ffb', '1560448204-e02f11c3d0e2'] },
    { n: 'Spa Baths', ic: '<path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/><path d="M6 12V5a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2"/>', imgs: ['1620626011761-996317b8d101', '1507652313519-d4e9174996dd', '1584132967334-10e028bd69f7', '1552321554-5fefe8c9ef14', '1600585154526-990dced4db0d', '1540555700478-4be289fbecef'] },
    { n: 'The Grounds', ic: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>', imgs: ['1464146072230-91cabc968266', '1570129477492-45c003edd2be', '1505916349660-8d91a99c3e23', '1449844908441-8829872d2607', '1576941089067-2de3c901e126', '1568605114967-8130f3a36994'] },
    { n: 'Surroundings', ic: '<path d="M2 20l7-11 4 6 3-4 6 9z"/><circle cx="17" cy="6" r="2"/>', imgs: ['1501854140801-50d01698950b', '1473448912268-2022ce9509d8', '1469474968028-56623f02e42e', '1474552226712-ac0f0961a954', '1506905925346-21bda4d32df4', '1500382017468-9049fed747ef'] },
    { n: 'Dining & Wine', ic: '<path d="M8 3h8l-1 7a3 3 0 0 1-6 0z"/><path d="M12 13v7M8 21h8"/>', imgs: ['1414235077428-338989a2e8c0', '1510812431401-41d2bd2722f3', '1424847651672-bf20a4b0982b', '1551218808-94e220e084d2', '1504674900247-0877df9cc836', '1478131143081-80f7f84ca84d'] },
  ];
  const galStage = $('#galStage');
  const galCats = $('#galCats');
  const galView = $('#galView');
  const galMosaic = $('#galMosaic');
  const galTitle = $('#galTitle');
  const galTimer = $('#galTimer');
  galCats.innerHTML = gal.map((g, i) => `
    <button type="button" class="gcat" data-i="${i}">
      <img src="${U(g.imgs[0], 600)}" alt="" loading="lazy">
      <span class="gc-n">0${i + 1}</span>
      <span>
        <span class="gc-ic"><svg viewBox="0 0 24 24" aria-hidden="true">${g.ic}</svg></span>
        <h3>${g.n}</h3>
        <span class="gc-meta"><span>${g.imgs.length} photographs</span><span class="gc-arrow"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span>
      </span>
    </button>`).join('');
  galMosaic.innerHTML = Array.from({ length: 5 }, () => '<figure class="gtile"><figcaption></figcaption></figure>').join('');
  const gTiles = $$('.gtile', galMosaic);
  const gCatEls = $$('.gcat', galCats);
  let galOpen = -1;
  let galTick = 0;
  let galInterval = null;
  let galHoverT = null;
  function galPaint(first) {
    const g = gal[galOpen];
    gTiles.forEach((tile, k) => {
      const id = g.imgs[(k + galTick) % g.imgs.length];
      const put = () => {
        const img = new Image();
        img.src = U(id, k === 0 ? 1000 : 700);
        img.alt = `${g.n}, photo ${((k + galTick) % g.imgs.length) + 1}`;
        if (!first) img.className = 'in';
        tile.insertBefore(img, tile.querySelector('figcaption'));
        $('figcaption', tile).textContent = `${g.n} · ${String(((k + galTick) % g.imgs.length) + 1).padStart(2, '0')}`;
        const olds = $$('img', tile).slice(0, -1);
        setTimeout(() => olds.forEach((o) => o.remove()), first ? 0 : 1400);
      };
      if (first) put(); else setTimeout(put, k * 160);
    });
    galTimer.classList.remove('run'); void galTimer.getBoundingClientRect(); galTimer.classList.add('run');
  }
  function galOpenCat(i) {
    if (galOpen === i) return;
    galOpen = i;
    galTick = 0;
    gTiles.forEach((t) => $$('img', t).forEach((im) => im.remove()));
    gCatEls.forEach((c, k) => c.classList.toggle('sel', k === i));
    galTitle.textContent = gal[i].n;
    galStage.classList.add('open');
    galView.setAttribute('aria-hidden', 'false');
    galPaint(true);
    clearInterval(galInterval);
    galInterval = setInterval(() => { galTick++; galPaint(false); }, 5000);
  }
  function galClose() {
    if (galOpen < 0) return;
    galOpen = -1;
    clearInterval(galInterval);
    galStage.classList.remove('open');
    galView.setAttribute('aria-hidden', 'true');
  }
  gCatEls.forEach((c, i) => {
    c.addEventListener('mouseenter', () => { if (!finePointer) return; clearTimeout(galHoverT); galHoverT = setTimeout(() => galOpenCat(i), 140); });
    c.addEventListener('mouseleave', () => clearTimeout(galHoverT));
    c.addEventListener('click', () => galOpenCat(i));
  });
  galStage.addEventListener('mouseleave', () => { if (finePointer) galClose(); });
  $('#galBack').addEventListener('click', galClose);

  /* ---------------------------------------------------------
     OFFERS: floating clouds raining discounts
     --------------------------------------------------------- */
  const offers = [
    { tag: 'Sun – Thu', title: 'Midweek Escape', off: 20, sub: 'Two nights or more, any room', code: 'MIDWEEK20' },
    { tag: 'Long stay', title: 'Stay 3, Pay 2', off: 33, sub: 'Third night on the house', code: 'STAY3PAY2' },
    { tag: '60 days ahead', title: 'Early Bird', off: 15, sub: 'Plan ahead and save', code: 'EARLY15' },
    { tag: 'Package', title: 'Romance at the Inn', off: 10, sub: 'Champagne, roses & late checkout', code: 'ROMANCE10' },
    { tag: 'Subscribers', title: 'Letters Club', off: 10, sub: 'Join our newsletter below', code: 'LETTERS10' },
  ];
  const cloudPath = 'M70 196 C28 196 6 168 12 140 C18 112 44 98 68 104 C64 62 100 34 140 44 C158 12 212 4 240 36 C268 24 306 46 304 84 C330 92 340 126 324 150 C330 182 302 200 270 196 Z';
  const field = $('#cloudField');
  const rain = $('#rain');
  const cloudObjs = offers.map((o, i) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'cloud';
    el.setAttribute('aria-label', `${o.title}: ${o.off}% off. Claim offer`);
    el.innerHTML = `
      <svg class="cloud-shape" viewBox="0 0 330 210" aria-hidden="true"><path d="${cloudPath}"/></svg>
      <span class="cloud-in">
        <span class="c-tag">${o.tag}</span>
        <span class="c-title">${o.title}</span>
        <span class="c-off">${o.off}%<small> off</small></span>
        <span class="c-sub">${o.sub}</span>
      </span>
      <span class="c-cta">Claim · ${o.code}</span>`;
    field.appendChild(el);
    const ang = Math.random() * Math.PI * 2;
    const sp = 38 + Math.random() * 22;
    const c = { el, o, x: 0, y: 0, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp * 0.45, w: 0, h: 0, hover: false, bob: Math.random() * 6, nextDrop: 0 };
    el.addEventListener('mouseenter', () => (c.hover = true));
    el.addEventListener('mouseleave', () => (c.hover = false));
    el.addEventListener('focus', () => (c.hover = true));
    el.addEventListener('blur', () => (c.hover = false));
    el.addEventListener('click', () => {
      bookingApplyPromo(o.code, true);
      document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
    });
    return c;
  });
  let FW = 0, FH = 0;
  function layoutClouds(init) {
    FW = field.clientWidth;
    FH = field.clientHeight;
    const cols = FW < 720 ? 2 : 3;
    cloudObjs.forEach((c, i) => {
      c.w = c.el.offsetWidth; c.h = c.el.offsetHeight;
      if (init) {
        const col = i % cols, row = Math.floor(i / cols);
        const rows = Math.ceil(cloudObjs.length / cols);
        c.x = (FW - c.w) * (row % 2 ? (col + 0.5) / cols : col / (cols - 1)) * 0.94 + (FW - c.w) * 0.03;
        c.y = ((FH * (FW < 720 ? 0.78 : 0.68)) - c.h) * (rows === 1 ? 0.5 : row / (rows - 1));
      }
      c.x = clamp(c.x, 0, FW - c.w);
      c.y = clamp(c.y, 0, FH * (FW < 720 ? 0.78 : 0.68) - c.h);
    });
  }
  layoutClouds(true);
  window.addEventListener('resize', () => layoutClouds(false));
  let offersVisible = false;
  new IntersectionObserver((en) => { offersVisible = en[0].isIntersecting; }, { rootMargin: '100px' }).observe($('#offers'));
  let cloudLast = performance.now();
  let dropCount = 0;
  function spawnDrop(c, now) {
    if (dropCount > 70) return;
    const isPct = Math.random() < 0.42;
    const d = document.createElement('span');
    d.className = 'drop ' + (isPct ? 'p' : 'w');
    const x = c.x + c.w * (0.22 + Math.random() * 0.56);
    const y = c.y + c.h * 0.86;
    const dist = FH - y - 20;
    const t = (dist / (isPct ? 210 : 330)) + Math.random() * 0.3;
    d.style.setProperty('--x', x.toFixed(0) + 'px');
    d.style.setProperty('--y', y.toFixed(0) + 'px');
    d.style.setProperty('--d', dist.toFixed(0) + 'px');
    d.style.setProperty('--t', t.toFixed(2) + 's');
    d.style.setProperty('--dx', ((Math.random() - 0.5) * 30).toFixed(0) + 'px');
    if (isPct) {
      d.textContent = `-${c.o.off}%`;
      d.style.setProperty('--fs', (0.95 + Math.random() * 0.7).toFixed(2) + 'rem');
      d.style.setProperty('--r', ((Math.random() - 0.5) * 24).toFixed(0) + 'deg');
    }
    rain.appendChild(d);
    dropCount++;
    d.addEventListener('animationend', () => {
      d.remove();
      dropCount--;
      if (!isPct && Math.random() < 0.5) {
        const s = document.createElement('span');
        s.className = 'splash';
        s.style.setProperty('--x', (x - 13).toFixed(0) + 'px');
        s.style.setProperty('--y', (FH - 24).toFixed(0) + 'px');
        rain.appendChild(s);
        s.addEventListener('animationend', () => s.remove());
      }
    });
    c.nextDrop = now + 180 + Math.random() * 320;
  }
  function cloudLoop(now) {
    const dt = Math.min(0.05, (now - cloudLast) / 1000);
    cloudLast = now;
    if (offersVisible) {
      const maxY = FH * (FW < 720 ? 0.78 : 0.68);
      cloudObjs.forEach((c) => {
        if (!c.hover) {
          c.x += c.vx * dt;
          c.y += c.vy * dt;
          if (c.x < 0) { c.x = 0; c.vx = Math.abs(c.vx); }
          if (c.x > FW - c.w) { c.x = FW - c.w; c.vx = -Math.abs(c.vx); }
          if (c.y < 0) { c.y = 0; c.vy = Math.abs(c.vy); }
          if (c.y > maxY - c.h) { c.y = maxY - c.h; c.vy = -Math.abs(c.vy); }
        }
      });
      // soft collisions: clouds nudge each other apart and drift off in new directions
      for (let a = 0; a < cloudObjs.length; a++) {
        for (let b = a + 1; b < cloudObjs.length; b++) {
          const A = cloudObjs[a], B = cloudObjs[b];
          const dx = (B.x + B.w / 2) - (A.x + A.w / 2);
          const dy = (B.y + B.h / 2) - (A.y + A.h / 2);
          const ox = (A.w + B.w) / 2 * 0.86 - Math.abs(dx);
          const oy = (A.h + B.h) / 2 * 0.8 - Math.abs(dy);
          if (ox > 0 && oy > 0) {
            const sx = Math.sign(dx) || 1, sy = Math.sign(dy) || 1;
            const wa = A.hover ? 0 : B.hover ? 1 : 0.5, wb = 1 - wa;
            if (ox < oy * 1.6) {
              const k = Math.min(ox, 120 * dt);
              A.x -= sx * k * wa; B.x += sx * k * wb;
              if (!A.hover) A.vx = -sx * Math.abs(A.vx);
              if (!B.hover) B.vx = sx * Math.abs(B.vx);
            } else {
              const k = Math.min(oy, 120 * dt);
              A.y -= sy * k * wa; B.y += sy * k * wb;
              if (!A.hover) A.vy = -sy * Math.abs(A.vy);
              if (!B.hover) B.vy = sy * Math.abs(B.vy);
            }
          }
        }
      }
      cloudObjs.forEach((c) => {
        const sp = Math.hypot(c.vx, c.vy);
        const target = 46;
        if (sp > 0) { const k = 1 + (target / sp - 1) * 0.02; c.vx *= k; c.vy *= k; }
        if (Math.abs(c.vy) > 26) c.vy *= 0.98;
        const bob = Math.sin(now / 900 + c.bob) * 5;
        c.el.style.transform = `translate3d(${c.x.toFixed(1)}px,${(c.y + bob).toFixed(1)}px,0)`;
        if (!reduce && now > c.nextDrop) spawnDrop(c, now);
      });
    }
    requestAnimationFrame(cloudLoop);
  }
  requestAnimationFrame(cloudLoop);

  /* ---------------------------------------------------------
     BOOKING & PAYMENT widget
     --------------------------------------------------------- */
  const promos = { MIDWEEK20: 0.2, STAY3PAY2: 0.3333, EARLY15: 0.15, ROMANCE10: 0.1, LETTERS10: 0.1 };
  const bk = { step: 1, adults: 2, kids: 0, room: -1, promo: null };
  const bIn = $('#bIn'), bOut = $('#bOut');
  const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fmtD = (iso) => new Date(iso + 'T12:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const today = new Date();
  const d1 = new Date(today); d1.setDate(d1.getDate() + 14);
  const d2 = new Date(d1); d2.setDate(d2.getDate() + 2);
  bIn.min = toISO(today); bIn.value = toISO(d1); bOut.value = toISO(d2); bOut.min = toISO(new Date(d1.getTime() + 864e5));
  const nights = () => Math.max(0, Math.round((new Date(bOut.value) - new Date(bIn.value)) / 864e5));

  function updateNights() {
    const n = nights();
    $('#bNights').textContent = n > 0 ? `${n} night${n > 1 ? 's' : ''} · ${fmtD(bIn.value)} → ${fmtD(bOut.value)} · ${bk.adults + bk.kids} guest${bk.adults + bk.kids > 1 ? 's' : ''}` : 'Check-out must be after check-in';
    updateSummary();
  }
  bIn.addEventListener('change', () => {
    const next = new Date(bIn.value); next.setDate(next.getDate() + 1);
    bOut.min = toISO(next);
    if (nights() <= 0) { const o = new Date(bIn.value); o.setDate(o.getDate() + 2); bOut.value = toISO(o); }
    updateNights();
  });
  bOut.addEventListener('change', updateNights);
  $$('.stepper button').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.g, d = Number(b.dataset.d);
    bk[k] = clamp(bk[k] + d, k === 'adults' ? 1 : 0, k === 'adults' ? 4 : 3);
    $('#gAdults').textContent = bk.adults; $('#gKids').textContent = bk.kids;
    updateNights();
  }));

  function totals() {
    const n = nights();
    if (bk.room < 0 || n <= 0) return null;
    const sub = rooms[bk.room].price * n;
    let rate = bk.promo ? promos[bk.promo] : 0;
    if (bk.promo === 'STAY3PAY2' && n < 3) rate = 0;
    const disc = Math.round(sub * rate);
    const tax = Math.round((sub - disc) * 0.12);
    return { n, sub, disc, tax, total: sub - disc + tax };
  }
  function updateSummary() {
    const n = nights();
    $('#sNightsLbl').textContent = `${n} night${n === 1 ? '' : 's'}`;
    $('#sRoom').textContent = bk.room >= 0 ? rooms[bk.room].name : 'Choose a room';
    const t = totals();
    $('#sSub').textContent = t ? money(t.sub) : '—';
    $('#sDiscRow').hidden = !(t && t.disc > 0);
    if (t && t.disc > 0) { $('#sDiscLbl').textContent = `Offer ${bk.promo}`; $('#sDisc').textContent = '−' + money(t.disc); }
    const tot = $('#sTotal');
    const val = t ? money(t.total) : '—';
    if (tot.textContent !== val) { tot.textContent = val; tot.classList.remove('bump'); void tot.offsetWidth; tot.classList.add('bump'); }
  }
  function goStep(s) {
    bk.step = s;
    $$('.bpanel').forEach((p) => p.classList.toggle('on', Number(p.dataset.step) === s));
    $$('#bSteps li').forEach((li, k) => { li.classList.toggle('on', k + 1 === s); li.classList.toggle('done', k + 1 < s); });
    $('#bSummary').style.display = s === 4 ? 'none' : '';
    if (s === 2) renderRoomChoices();
  }
  $$('[data-goto]').forEach((b) => b.addEventListener('click', () => goStep(Number(b.dataset.goto))));
  function renderRoomChoices() {
    const n = nights();
    const guests = bk.adults + bk.kids;
    $('#bRooms').innerHTML = rooms.map((r, i) => {
      const fits = r.sleeps >= guests;
      return `<button type="button" class="broom${bk.room === i ? ' on' : ''}" data-i="${i}" ${fits ? '' : 'disabled'} style="animation-delay:${i * 0.07}s${fits ? '' : ';opacity:.45'}">
        <img src="${U(r.l[0], 200)}" alt="" loading="lazy">
        <span><b>${r.name}${i === 3 ? '<span class="left">1 left</span>' : ''}</b><small>${fits ? r.meta : `Sleeps ${r.sleeps}, not enough for ${guests}`}</small></span>
        <span class="bp">${money(r.price * n)}<small>${n} night${n === 1 ? '' : 's'}</small></span>
      </button>`;
    }).join('');
    $$('.broom', $('#bRooms')).forEach((b) => b.addEventListener('click', () => {
      bk.room = Number(b.dataset.i);
      $$('.broom').forEach((x) => x.classList.toggle('on', x === b));
      $('#bToPay').disabled = false;
      updateSummary();
    }));
    $('#bToPay').disabled = bk.room < 0 || (bk.room >= 0 && rooms[bk.room].sleeps < guests);
  }
  const loadBtn = (btn, ms, fn) => { btn.classList.add('loading'); btn.disabled = true; setTimeout(() => { btn.classList.remove('loading'); btn.disabled = false; fn(); }, ms); };
  $('#bCheck').addEventListener('click', (e) => { if (nights() <= 0) return; loadBtn(e.currentTarget, 900, () => goStep(2)); });
  $('#bToPay').addEventListener('click', () => goStep(3));
  function bookingApplyPromo(code, silent) {
    code = (code || '').trim().toUpperCase();
    const box = $('.bpromo');
    $('#bPromo').value = code;
    if (promos[code]) { bk.promo = code; box.classList.add('ok'); }
    else { bk.promo = null; box.classList.remove('ok'); if (!silent && code) { $('#bPromo').value = ''; $('#bPromo').placeholder = 'Code not recognised'; } }
    updateSummary();
  }
  $('#bPromoApply').addEventListener('click', () => bookingApplyPromo($('#bPromo').value));
  function bookingPickRoom(i) {
    bk.room = i;
    updateSummary();
    if (nights() > 0) goStep(2);
  }
  // card preview
  const ccard = $('#ccard');
  const pNum = $('#pNum'), pExp = $('#pExp'), pCvv = $('#pCvv'), pName = $('#pName'), pEmail = $('#pEmail');
  pNum.addEventListener('input', () => {
    const v = pNum.value.replace(/\D/g, '').slice(0, 16);
    pNum.value = v.replace(/(.{4})/g, '$1 ').trim();
    $('#ccNum').textContent = (v + '•'.repeat(16 - v.length)).replace(/(.{4})/g, '$1 ').trim();
  });
  pExp.addEventListener('input', () => {
    let v = pExp.value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
    pExp.value = v;
    $('#ccExp').textContent = v || 'MM/YY';
  });
  pName.addEventListener('input', () => { $('#ccName').textContent = pName.value.toUpperCase() || 'YOUR NAME'; });
  pCvv.addEventListener('input', () => { pCvv.value = pCvv.value.replace(/\D/g, ''); $('#ccCvv').textContent = pCvv.value || '•••'; });
  pCvv.addEventListener('focus', () => ccard.classList.add('flip'));
  pCvv.addEventListener('blur', () => ccard.classList.remove('flip'));
  $('#bPay').addEventListener('click', (e) => {
    const bad = [];
    if (!pName.value.trim()) bad.push(pName);
    if (!/^\S+@\S+\.\S+$/.test(pEmail.value)) bad.push(pEmail);
    if (pNum.value.replace(/\D/g, '').length < 12) bad.push(pNum);
    if (!/^\d\d\/\d\d$/.test(pExp.value)) bad.push(pExp);
    if (pCvv.value.length < 3) bad.push(pCvv);
    $$('.bfields--pay .bfield').forEach((f) => (f.style.borderColor = ''));
    if (bad.length) {
      bad.forEach((i) => (i.closest('.bfield').style.borderColor = '#c0485a'));
      bad[0].focus();
      return;
    }
    loadBtn(e.currentTarget, 1400, () => {
      const t = totals();
      $('#bRef').textContent = 'WM-' + Math.floor(10000 + Math.random() * 89999);
      $('#bDoneText').textContent = `${rooms[bk.room].name}, ${fmtD(bIn.value)} → ${fmtD(bOut.value)}. ${t ? money(t.total) + ' paid. ' : ''}Confirmation sent to ${pEmail.value}.`;
      goStep(4);
    });
  });
  updateNights();

  /* ---------------------------------------------------------
     FAQ: scroll-opened book, hover question → answer
     --------------------------------------------------------- */
  const faqs = [
    ['What time is check-in and check-out?', 'Check-in is between 3 and 8 pm, and check-out is by 11 am. Arriving later? Just let us know and we’ll leave a key and a little supper for you. Early bag drop and late checkout are free whenever the room allows.'],
    ['Is breakfast included in every stay?', 'Always. A three-course farmhouse breakfast is served from 8 to 10:30 am for every guest. Vegetarian, vegan, gluten-free and allergy needs are gladly met; just tell us when you book.'],
    ['What is your cancellation policy?', 'Cancel free of charge up to 7 days before arrival for a full refund. Within 7 days we can move your dates once at no cost. Holiday weekends may have a 14-day window, shown before you pay.'],
    ['How do I book and pay online?', 'Choose your dates, pick a room and pay securely right here on our website with card, Apple Pay or Google Pay. You’ll get an instant confirmation email and receipt. Booking direct is always our best rate.'],
    ['Are pets and children welcome?', 'Well-behaved dogs are welcome in the Garden Suite and the Lakeview Cottage for $25 a night. Children of all ages are welcome; the Maple Loft and the Cottage are best for families.'],
    ['Is there parking and EV charging?', 'Yes. Free private parking for every room, plus two Level-2 EV chargers by the barn, free for guests. Arriving by train? We offer pick-ups from Rhinecliff station.'],
    ['Can I use a discount or gift card?', 'Enter your offer code at checkout and it’s applied instantly. Gift cards can be bought by email and used on any room or experience, and they never expire.'],
    ['Do you host small events or buyouts?', 'We host elopements, anniversaries and family reunions of up to 14 guests with a full-house buyout. Write to us and we’ll put together a proposal within a day.'],
  ];
  const qList = $('#qList');
  const qaMobile = $('#qaMobile');
  qList.innerHTML = faqs.map(([q], i) => `<li${i === 0 ? ' class="on"' : ''}><button type="button" data-i="${i}">${q}</button></li>`).join('');
  qaMobile.innerHTML = faqs.map(([q, a], i) => `<li${i === 0 ? ' class="on"' : ''}><button type="button" aria-expanded="${i === 0}">${q}</button><div class="a"><p>${a}</p></div></li>`).join('');
  const ansView = $('#answerView');
  let curQ = -1;
  function showAnswer(i) {
    if (i === curQ) return;
    curQ = i;
    $$('li', qList).forEach((li, k) => li.classList.toggle('on', k === i));
    $('#ansKicker').textContent = `Question ${String(i + 1).padStart(2, '0')}`;
    $('#ansQ').textContent = faqs[i][0];
    $('#ansA').innerHTML = faqs[i][1].split(' ').map((w, k) => `<span class="w" style="animation-delay:${(k * 0.022).toFixed(3)}s">${w}</span>`).join(' ');
    ansView.classList.remove('swap'); void ansView.offsetWidth; ansView.classList.add('swap');
  }
  $$('button', qList).forEach((b) => {
    const i = Number(b.dataset.i);
    b.addEventListener('mouseenter', () => showAnswer(i));
    b.addEventListener('focus', () => showAnswer(i));
    b.addEventListener('click', () => showAnswer(i));
  });
  $$('li', qaMobile).forEach((li) => $('button', li).addEventListener('click', () => {
    const open = !li.classList.contains('on');
    $$('li', qaMobile).forEach((x) => { x.classList.remove('on'); $('button', x).setAttribute('aria-expanded', 'false'); });
    if (open) { li.classList.add('on'); $('button', li).setAttribute('aria-expanded', 'true'); }
  }));
  showAnswer(0);
  const faq = $('#faq');
  const book3d = $('#book3d');
  const faqHint = $('#faqHint');
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function faqScroll() {
    const r = faq.getBoundingClientRect();
    const span = faq.offsetHeight - window.innerHeight;
    const p = clamp(-r.top / span, 0, 1);
    const open = easeIO(clamp((p - 0.06) / 0.44, 0, 1));
    book3d.style.setProperty('--open', open.toFixed(4));
    book3d.classList.toggle('is-open', open > 0.82);
    faqHint.textContent = open > 0.95 ? (finePointer ? 'Hover a question to read its answer' : 'Tap a question to read its answer') : 'Keep scrolling to open the book';
  }
  window.addEventListener('scroll', faqScroll, { passive: true });
  window.addEventListener('resize', faqScroll);
  faqScroll();

  /* ---------------------------------------------------------
     NEWSLETTER: postcard posts itself away
     --------------------------------------------------------- */
  const lForm = $('#lettersForm');
  const lMsg = $('#lettersMsg');
  const postcard = $('#postcard');
  lForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = $('#nlEmail').value.trim();
    if (!/^\S+@\S+\.\S+$/.test(v)) { lMsg.style.color = '#c0485a'; lMsg.textContent = 'Please enter a valid email address.'; return; }
    lMsg.style.color = '';
    lMsg.textContent = 'Posted! Your first letter (and code LETTERS10) is on its way.';
    postcard.classList.remove('sent'); void postcard.offsetWidth; postcard.classList.add('sent');
    lForm.reset();
    setTimeout(() => { postcard.classList.remove('sent'); postcard.style.animation = 'upIn .9s var(--ease)'; setTimeout(() => (postcard.style.animation = ''), 900); }, 1800);
  });

  /* ---------------------------------------------------------
     FOOTER: giant bouncing brand name
     --------------------------------------------------------- */
  $('#giant').innerHTML = [...'Willowmere'].map((ch, i) => `<span style="--i:${i}"${i === 0 ? ' class="it"' : ''}>${ch}</span>`).join('');
})();
