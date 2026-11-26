/* Casa Adorah — homepage concept v2 "Maison" · SRH Web Agency */
(() => {
  'use strict';
  const STORE = 'https://casaadorah.com', WA = '254181631799', FREE_AT = 10000;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const kes = n => 'KSh ' + Math.round(n).toLocaleString('en-KE');
  const img = (u, w) => u + (u.includes('?') ? '&' : '?') + 'width=' + w;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined' && !reduce;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isDesk = () => matchMedia('(min-width: 901px)').matches;

  /* ================= data ================= */
  const ALL = (window.CA_PRODUCTS || []).filter(p => p.s.some(v => v[2]));
  const byH = Object.fromEntries(ALL.map(p => [p.h, p]));
  const REAL = ALL.filter(p => !p.ai);
  const pick = (hs, fb) => { const o = hs.map(h => byH[h]).filter(p => p && !p.ai); return o.length ? o : fb; };
  const avail = p => p.s.filter(v => v[2]);
  const CATS = {
    w: [['dresses', 'Dresses', '/collections/dress'], ['trouser-suits', 'Trouser Suits', '/collections/ladies-trouser-suits'], ['skirt-suits', 'Skirt Suits', '/collections/skirt-suits'], ['palazzo', 'Palazzo Sets', '/collections/palazzo-set-women'], ['blouses', 'Blouses & Shirts', '/collections/blousers-and-shirts'], ['trousers', 'Trousers & Jeans', '/collections/ladies-trousers'], ['outerwear', 'Blazers & Ponchos', '/collections/blazers-ladies'], ['bags', 'Handbags', '/collections/ladies-handbags'], ['belts', 'Belts', '/collections/belts-essentials'], ['lingerie', 'Panties', '/collections/panties-ladies'], ['skirts', 'Skirts', '/collections/skirts']],
    m: [['suits', 'Suits', '/collections/suits-men'], ['jackets', 'Jackets & Vests', '/collections/jackets-men'], ['shirts', 'Shirts', '/collections/shirts-men'], ['trousers', 'Trousers', '/collections/trousers-men'], ['jeans', 'Jeans', '/collections/jeans-men'], ['knitwear', 'Knitwear', '/collections/men-sweaters'], ['shoes', 'Shoes', '/collections/shoes-men'], ['hats', 'Hats, Caps & Scarves', '/collections/hat-cap-scarf-men'], ['belts', 'Belts', '/collections/men-belts'], ['essentials', 'Boxers & Socks', '/collections/men-boxers']],
  };
  const catLabel = (g, c) => ((CATS[g] || []).find(x => x[0] === c) || CATS.w.find(x => x[0] === c) || [c, c])[1];
  const ROOMS = {};
  ['w', 'm'].forEach(g => {
    ROOMS[g] = CATS[g].map(([key, label, url]) => {
      const items = ALL.filter(p => p.g === g && p.c === key);
      if (!items.length) return null;
      const reals = items.filter(p => !p.ai);
      return { key, label, url: STORE + url, count: items.length, from: Math.min(...items.map(p => p.p)), imgs: (reals.length ? reals : items).slice(0, 8).map(p => p.i) };
    }).filter(Boolean);
  });

  /* front-and-back studio shots: frame the front view in portrait crops */
  const TWO = new Set(ALL.filter(p => /^dress-1(4\d|5\d|6\d)$/.test(p.h) || /^palazzo-set-[3-6]$/.test(p.h)).map(p => p.i.split('?')[0]));
  const frameImg = im => { if (im.tagName !== 'IMG') return; const two = TWO.has((im.getAttribute('src') || '').split('?')[0]); if (two && !im.dataset.full) im.style.objectPosition = '26% 50%'; else if (!two) im.style.objectPosition = ''; };
  new MutationObserver(ms => ms.forEach(m => {
    if (m.type === 'attributes') frameImg(m.target);
    else m.addedNodes.forEach(n => { if (n.nodeType !== 1) return; frameImg(n); n.querySelectorAll && n.querySelectorAll('img').forEach(frameImg); });
  })).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] });

  /* ================= Nairobi time ================= */
  function nairobi() {
    const o = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(new Date()).map(x => [x.type, x.value]));
    return { day: o.weekday, h: +o.hour % 24, m: +o.minute, s: +o.second };
  }
  function cutoff() { const n = nairobi(), t = n.h * 3600 + n.m * 60 + n.s; return n.day !== 'Sun' && t < 13 * 3600 ? { same: true, left: 13 * 3600 - t } : { same: false, day: n.day }; }
  const hm = s => { const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`; };
  const eta = () => { const c = cutoff(); return c.same ? `Order in ${hm(c.left)} for same-day Nairobi delivery` : `Order now for ${c.day === 'Sat' || c.day === 'Sun' ? 'Monday' : 'next working-day'} Nairobi delivery`; };

  /* ================= toast ================= */
  let tt;
  const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('is-on'), 2600); };

  /* ================= smooth scroll ================= */
  let lenis = null;
  if (G && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const lock = on => { if (lenis) on ? lenis.stop() : lenis.start(); document.documentElement.style.overflow = on ? 'hidden' : ''; };
  function goTo(sel) {
    const el = typeof sel === 'string' ? $(sel) : sel; if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: el.id === 'rooms' || el.id === 'visit' ? -90 : 0, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const t = $(id); if (!t) return;
    e.preventDefault(); closeMenu(); goTo(t);
  });

  /* ================= bag ================= */
  let bag = [];
  try { bag = JSON.parse(localStorage.getItem('ca2-bag') || '[]').filter(i => byH[i.h]); } catch (e) { bag = []; }
  const save = () => { try { localStorage.setItem('ca2-bag', JSON.stringify(bag)); } catch (e) {} };
  const bagEl = $('#bag'), scrim = $('#scrim'), qvEl = $('#qv');
  let lastFocus = null;
  function openLayer(el) { lastFocus = document.activeElement; el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false'); scrim.classList.add('is-on'); lock(true); }
  function closeLayers() {
    $$('.bag.is-open,.qv.is-open').forEach(el => { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); });
    if (scrim.classList.contains('is-on')) { scrim.classList.remove('is-on'); lock(false); }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  const openBag = () => { closeLayers(); openLayer(bagEl); setTimeout(() => $('#bagX').focus(), 60); };
  $('#bagBtn').addEventListener('click', openBag);
  $('#dockBag').addEventListener('click', openBag);
  $('#bagX').addEventListener('click', closeLayers);
  scrim.addEventListener('click', closeLayers);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLayers(); closeSearch(); closeMenu(); } });

  function addToBag(h, vid, size, silent) {
    const ex = bag.find(i => i.vid === vid);
    if (ex) ex.qty++; else bag.push({ h, vid, size, qty: 1 });
    save(); renderBag();
    const c = $('#bagCount'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
    if (!silent) toast(`Added to bag · ${byH[h].t}${/size/i.test(size) ? '' : ' · ' + size}`);
  }
  const waList = intro => `${intro}\n\n${bag.map(i => `• ${byH[i.h].t} (${i.size}) x${i.qty} – ${kes(byH[i.h].p)}\n  ${STORE}/products/${i.h}`).join('\n')}`;
  const UPSELL = pick(['belts', 'sling-bag-1', 'men-belts', 'sling-bag-2', 'ponchos-4', 'belts-1'], []);
  function renderBag() {
    const n = bag.reduce((a, i) => a + i.qty, 0), total = bag.reduce((a, i) => a + byH[i.h].p * i.qty, 0);
    const c = $('#bagCount'); c.textContent = n; c.classList.toggle('has', n > 0);
    $('#dockCount').textContent = n; $('#bagN').textContent = n ? `(${n})` : '';
    $('#bagItems').innerHTML = !bag.length
      ? `<div class="bag-empty"><p>Your bag is waiting<br>for something beautiful.</p><a class="ulink" href="#new" data-closebag>Shop new arrivals</a></div>`
      : bag.map((i, k) => { const p = byH[i.h]; return `<div class="bi"><img src="${img(p.i, 200)}" alt="${p.t}"><div><h4>${p.t}</h4><p>${catLabel(p.g, p.c)} · ${/size/i.test(i.size) ? i.size : 'Size ' + i.size}</p><div class="qty"><button data-q="-1" data-k="${k}" aria-label="Decrease"><svg class="ic"><use href="#i-minus"/></svg></button><span>${i.qty}</span><button data-q="1" data-k="${k}" aria-label="Increase"><svg class="ic"><use href="#i-plus"/></svg></button></div></div><div class="bi__p">${kes(p.p * i.qty)}<button class="bi__x" data-rm="${k}">Remove</button></div></div>`; }).join('');
    $('#bagTotal').textContent = kes(total);
    const left = FREE_AT - total;
    $('#bagFreeT').innerHTML = !total ? `Free Nairobi delivery (Zones 1 &amp; 2) on orders of <b>${kes(FREE_AT)}</b>+` : left > 0 ? `Add <b>${kes(left)}</b> more for free Nairobi delivery` : `<b>Free Nairobi delivery unlocked</b> (Zones 1 &amp; 2)`;
    $('#bagFreeB').style.width = Math.min(100, total / FREE_AT * 100) + '%';
    $('#bagEta').textContent = eta();
    const ups = UPSELL.filter(p => !bag.some(i => i.h === p.h)).slice(0, 3);
    $('#bagUp').innerHTML = bag.length && ups.length ? `<h5>Finish the look</h5><div class="ups">${ups.map(p => `<button class="up" data-qv="${p.h}"><img src="${img(p.i, 240)}" alt=""><span>${p.t}</span><b>${kes(p.p)}</b></button>`).join('')}</div>` : '';
    const co = $('#checkout');
    co.href = bag.length ? `${STORE}/cart/${bag.map(i => `${i.vid}:${i.qty}`).join(',')}` : `${STORE}/cart`;
    $('#bagHouse').href = `https://wa.me/${WA}?text=${encodeURIComponent(bag.length ? waList("Hello Casa Adorah, I'd like to see these pieces at Casa Adorah House before buying:") : "Hello Casa Adorah, I'd like help choosing something.")}`;
    $('#houseLine').textContent = bag.length ? `${n} piece${n > 1 ? 's' : ''} in your bag · ${kes(total)}` : 'Your bag is empty. Add a few pieces first.';
    $('#houseThumbs').innerHTML = bag.slice(0, 5).map(i => `<img src="${img(byH[i.h].i, 120)}" alt="">`).join('');
    $('#houseBag').href = `https://wa.me/${WA}?text=${encodeURIComponent(bag.length ? waList('Hello Casa Adorah, could I see these at Casa Adorah House, or have similar options brought with my delivery?') : "Hello Casa Adorah, I'd like to visit Casa Adorah House.")}`;
    $$('.js-visit').forEach(a => { const t = `Hello Casa Adorah, I'd like to visit ${a.dataset.store}. Could you confirm what's available?`; a.href = `https://wa.me/${WA}?text=${encodeURIComponent(bag.length ? waList(t + ' I am interested in:') : t)}`; });
  }
  $('#bagItems').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    if (q) { const i = bag[+q.dataset.k]; i.qty += +q.dataset.q; if (i.qty < 1) bag.splice(+q.dataset.k, 1); save(); renderBag(); }
    if (rm) { bag.splice(+rm.dataset.rm, 1); save(); renderBag(); }
    if (e.target.closest('[data-closebag]')) closeLayers();
  });
  $('#checkout').addEventListener('click', e => { if (!bag.length) { e.preventDefault(); toast('Add a piece to your bag first'); } });

  /* ================= card ================= */
  function card(p, o = {}) {
    const av = avail(p), one = av.length === 1 && p.s.length > 1;
    const dateTag = o.date ? `<span class="card__tag">New · ${new Date(p.d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>` : '';
    const lowTag = one ? `<span class="card__tag card__tag--brass">Last size</span>` : '';
    const meta = av.length === 1 ? (/size/i.test(av[0][0]) ? av[0][0] : 'Size ' + av[0][0]) : `${av.length} sizes`;
    return `<article class="card">
      <div class="card__frame">
        <a class="card__media" href="${STORE}/products/${p.h}" data-cursor="View" aria-label="${p.t}, ${kes(p.p)}"><img src="${img(p.i, o.w || 640)}" alt="${p.t} — ${catLabel(p.g, p.c)}" loading="lazy" width="640" height="853"></a>
        ${dateTag}${lowTag}
        <button class="card__add" data-qv="${p.h}" data-size="${o.size || ''}" aria-label="Quick view ${p.t}"><svg class="ic"><use href="#i-plus"/></svg></button>
        <div class="card__quick"><p>Quick add · size</p><div class="sizes">${p.s.map(v => `<button class="sz${o.size === v[0] ? ' is-on' : ''}" data-add="${p.h}" data-vid="${v[1]}" data-size="${v[0]}" ${v[2] ? '' : 'disabled'}>${v[0]}</button>`).join('')}</div></div>
      </div>
      <div class="card__body"><div><h3 class="card__t">${p.t}</h3><p class="card__m">${catLabel(p.g, p.c)} · ${meta}</p></div><span class="card__p">${kes(p.p)}</span></div>
    </article>`;
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]');
    if (a && !a.disabled) { e.preventDefault(); addToBag(a.dataset.add, +a.dataset.vid, a.dataset.size); return; }
    const q = e.target.closest('[data-qv]');
    if (q) { e.preventDefault(); openQV(q.dataset.qv, q.dataset.size); }
  });

  /* ================= quick view ================= */
  let qP = null, qS = null;
  function openQV(h, size) {
    const p = byH[h]; if (!p) return; qP = p; qS = null;
    $('#qvImg').src = img(p.i, 1000); $('#qvImg').alt = p.t;
    $('#qvCat').textContent = `${p.g === 'm' ? 'Men' : 'Women'} · ${catLabel(p.g, p.c)}`;
    $('#qvT').textContent = p.t; $('#qvPrice').textContent = kes(p.p);
    const av = avail(p);
    $('#qvSizes').innerHTML = p.s.map(v => `<button class="sz" data-qs="${v[1]}" ${v[2] ? '' : 'disabled'}>${v[0]}</button>`).join('');
    $('#qvNote').textContent = av.length < p.s.length ? `· ${p.s.length - av.length} sold out` : (av.length === 1 ? '· last size' : '');
    const pre = (size && av.find(v => v[0] === size)) || (av.length === 1 ? av[0] : null);
    pre ? selQ(pre[1]) : updQ();
    $('#qvEta').textContent = eta();
    $('#qvLink').href = `${STORE}/products/${p.h}`;
    $('#qvWa').href = `https://wa.me/${WA}?text=${encodeURIComponent(`Hello Casa Adorah, can I see this at Casa Adorah House?\n${p.t} – ${kes(p.p)}\n${STORE}/products/${p.h}`)}`;
    closeLayers(); openLayer(qvEl); setTimeout(() => $('#qvX').focus(), 60);
  }
  function selQ(vid) { qS = qP.s.find(v => v[1] === +vid); $$('#qvSizes .sz').forEach(b => b.classList.toggle('is-on', +b.dataset.qs === +vid)); updQ(); }
  function updQ() { $('#qvAdd').innerHTML = qS ? `Add to bag · ${kes(qP.p)} <svg class="ic"><use href="#i-arrow"/></svg>` : 'Select a size'; }
  $('#qvSizes').addEventListener('click', e => { const b = e.target.closest('[data-qs]'); if (b && !b.disabled) selQ(b.dataset.qs); });
  $('#qvAdd').addEventListener('click', () => {
    if (!qS) { if (G) gsap.fromTo('#qvSizes', { x: -8 }, { x: 0, duration: .6, ease: 'elastic.out(1,.3)' }); return; }
    addToBag(qP.h, qS[1], qS[0], true); closeLayers(); toast(`Added to bag · ${qP.t} · ${qS[0]}`);
  });
  $('#qvX').addEventListener('click', closeLayers);
  qvEl.addEventListener('click', e => { if (e.target === qvEl) closeLayers(); });

  /* ================= header / menu / search ================= */
  const hdr = $('#hdr'), dock = $('#dock');
  let lastY = 0;
  function onScroll(y) {
    hdr.classList.toggle('is-stuck', y > 36);
    const menuOpen = $('#menu').classList.contains('is-open');
    hdr.classList.toggle('is-up', !menuOpen && y > innerHeight * 1.2 && y > lastY + 2);
    if (y < lastY - 2) hdr.classList.remove('is-up');
    dock.classList.toggle('is-on', y > innerHeight * .9);
    lastY = y;
  }
  if (lenis) lenis.on('scroll', e => onScroll(e.scroll)); else addEventListener('scroll', () => onScroll(scrollY), { passive: true });

  const menu = $('#menu'), menuBtn = $('#menuBtn');
  ['w', 'm'].forEach(g => {
    $(g === 'w' ? '#menuW' : '#menuM').innerHTML = ROOMS[g].map((r, i) => `<li style="--d:${i}"><a href="${r.url}" data-peek="${r.imgs[0]}">${r.label}<small>${r.count}</small></a></li>`).join('') +
      `<li style="--d:${ROOMS[g].length}"><a href="${STORE}/collections/${g === 'w' ? 'women' : 'men-jackets-shirts'}"><b>Shop all ${g === 'w' ? "women's" : "men's"}</b><small>→</small></a></li>`;
  });
  $('#menuPeek').src = img(ROOMS.w[0].imgs[0], 600);
  menu.addEventListener('mouseover', e => { const a = e.target.closest('[data-peek]'); if (a) $('#menuPeek').src = img(a.dataset.peek, 600); });
  function openMenu() { menu.classList.add('is-open'); menu.setAttribute('aria-hidden', 'false'); menuBtn.setAttribute('aria-expanded', 'true'); $('.menu-btn__t').textContent = 'Close'; lock(true); hdr.classList.remove('is-up'); }
  function closeMenu() { if (!menu.classList.contains('is-open')) return; menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); menuBtn.setAttribute('aria-expanded', 'false'); $('.menu-btn__t').textContent = 'Menu'; lock(false); }
  menuBtn.addEventListener('click', () => menu.classList.contains('is-open') ? closeMenu() : openMenu());

  const search = $('#search');
  $('#searchSug').innerHTML = ['Dresses', 'Trouser suit', 'Men shirts', 'Sling bag'].map(q => `<button type="button" data-sq="${q}">${q}</button>`).join('');
  function openSearch() { search.classList.add('is-open'); search.setAttribute('aria-hidden', 'false'); setTimeout(() => $('#searchInput').focus(), 80); }
  function closeSearch() { search.classList.remove('is-open'); search.setAttribute('aria-hidden', 'true'); }
  $('#searchBtn').addEventListener('click', openSearch);
  $('#searchClose').addEventListener('click', closeSearch);
  $('#searchSug').addEventListener('click', e => { const b = e.target.closest('[data-sq]'); if (b) { $('#searchInput').value = b.dataset.sq; search.submit(); } });

  /* announcement */
  function annTick() { const c = cutoff(); $('#annLive').textContent = eta(); $('.pulse').classList.toggle('is-off', !c.same); }
  annTick();

  /* ================= hero ================= */
  const heroP = pick(['dress-64', 'trouser-suit-7', 'suits-men-1', 'dress-153', 'palazzo-set-6'], REAL.slice(0, 5));
  $('#heroImgs').innerHTML = heroP.map((p, i) => `<img src="${img(p.i, 2000)}" alt="${p.t}" data-full="1" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} class="${i ? '' : 'is-on'}">`).join('');
  $('#heroTot').textContent = String(heroP.length).padStart(2, '0');
  let hi = 0, hTimer;
  function heroShow(i) {
    const ims = $$('#heroImgs img'), prev = ims[hi]; hi = (i + ims.length) % ims.length; const next = ims[hi], p = heroP[hi];
    $('#heroNowT').textContent = p.t; $('.hero__now-k').textContent = `Now showing · ${p.g === 'm' ? 'Men' : 'Women'}`; $('#heroNowP').textContent = kes(p.p);
    $('#heroNow').dataset.qv = p.h; $('#heroIdx').textContent = String(hi + 1).padStart(2, '0');
    if (G && prev !== next) {
      gsap.set(next, { zIndex: 2, opacity: 1, clipPath: 'inset(0% 0% 100% 0%)', scale: 1.15 }); gsap.set(prev, { zIndex: 1 });
      gsap.to(next, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.5, ease: 'expo.inOut', onComplete: () => { prev.classList.remove('is-on'); gsap.set(prev, { opacity: 0 }); next.classList.add('is-on'); } });
    } else { ims.forEach(x => { x.classList.toggle('is-on', x === next); x.style.opacity = x === next ? 1 : 0; }); }
    clearTimeout(hTimer); hTimer = setTimeout(() => heroShow(hi + 1), 5200);
  }
  heroShow(0);

  /* ================= trust ================= */
  $('#trustStock').textContent = ALL.length; $('#trustStock').dataset.count = ALL.length;

  /* ================= wings ================= */
  [['w', '#wingW'], ['m', '#wingM']].forEach(([g, sel]) => {
    const el = $(sel), pics = pick(g === 'w' ? ['dress-64', 'trouser-suit-7', 'palazzo-set-6', 'dress-151'] : ['suits-men-1', 'men-jackets-10', 'men-shirts-2', 'suits-men'], REAL.filter(p => p.g === g).slice(0, 4));
    $('.wing__imgs', el).innerHTML = pics.map((p, i) => `<img src="${img(p.i, 1400)}" alt="" loading="lazy" class="${i ? '' : 'is-on'}">`).join('');
    $(g === 'w' ? '#wingWN' : '#wingMN').textContent = `${ALL.filter(p => p.g === g).length} pieces`;
    $(g === 'w' ? '#wingWCats' : '#wingMCats').innerHTML = ROOMS[g].slice(0, 6).map(r => `<li>${r.label}</li>`).join('');
    let k = 0; setInterval(() => { const ims = $$('img', el); if (!ims.length) return; ims[k].classList.remove('is-on'); k = (k + 1) % ims.length; ims[k].classList.add('is-on'); }, g === 'w' ? 3600 : 4100);
    el.addEventListener('click', () => setRooms(g));
  });
  $$('[data-go-wing]').forEach(a => a.addEventListener('click', () => setRooms(a.dataset.goWing)));

  /* ================= rooms ================= */
  let roomsG = 'w';
  function pill(btn, pillEl) { pillEl.style.width = btn.offsetWidth + 'px'; pillEl.style.transform = `translateX(${btn.offsetLeft}px)`; }
  function setRooms(g) {
    roomsG = g;
    $$('[data-rooms]').forEach(b => { const on = b.dataset.rooms === g; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); if (on) pill(b, $('#roomsPill')); });
    $('#roomsList').innerHTML = ROOMS[g].map((r, i) => `<li><a class="room" href="${r.url}" data-room="${i}" data-cursor="Shop">
      <span class="room__thumb"><img src="${img(r.imgs[0], 160)}" alt="" loading="lazy"></span>
      <span class="room__i">${String(i + 1).padStart(2, '0')}</span><span class="room__t">${r.label}</span>
      <span class="room__c">${r.count} in stock</span><span class="room__p">from ${kes(r.from)}</span>
      <span class="room__go"><svg class="ic"><use href="#i-arrow"/></svg></span></a></li>`).join('');
    if (G) gsap.from('#roomsList .room', { yPercent: 70, opacity: 0, duration: .9, stagger: .04, ease: 'power4.out' });
  }
  $$('[data-rooms]').forEach(b => b.addEventListener('click', () => setRooms(b.dataset.rooms)));
  setRooms('w');
  addEventListener('resize', () => { const b = $(`[data-rooms="${roomsG}"]`); if (b) pill(b, $('#roomsPill')); });

  /* image trail over the rooms list */
  if (fine && G) {
    const trail = $('#trail'), list = $('#roomsList');
    let lx = 0, ly = 0, z = 1, ti = 0;
    list.addEventListener('mousemove', e => {
      const a = e.target.closest('[data-room]'); if (!a) return;
      if (Math.hypot(e.clientX - lx, e.clientY - ly) < 90) return;
      lx = e.clientX; ly = e.clientY;
      const r = ROOMS[roomsG][+a.dataset.room], src = r.imgs[ti++ % r.imgs.length];
      const im = document.createElement('img'); im.src = img(src, 400); im.alt = ''; trail.appendChild(im);
      gsap.set(im, { x: e.clientX - 95, y: e.clientY - 127, zIndex: z++, scale: .4, rotate: gsap.utils.random(-8, 8), opacity: 0 });
      gsap.timeline({ onComplete: () => im.remove() })
        .to(im, { scale: 1, opacity: 1, duration: .5, ease: 'expo.out' })
        .to(im, { y: '+=60', scale: .6, opacity: 0, duration: .7, ease: 'power3.in' }, .55);
    });
  }

  /* ================= new in ================= */
  const track = $('#newTrack');
  function renderNew(g) {
    const list = REAL.filter(p => g === 'all' || p.g === g).slice(0, 14);
    track.innerHTML = list.map(p => card(p, { date: true })).join('');
    $('#newTot').textContent = String(list.length).padStart(2, '0'); $('#newIdx').textContent = '01';
    if (G) { gsap.from('#newTrack .card', { x: 80, opacity: 0, duration: 1, stagger: .05, ease: 'power3.out' }); ScrollTrigger.refresh(); }
  }
  $$('[data-new]').forEach(b => b.addEventListener('click', () => { $$('[data-new]').forEach(x => x.classList.toggle('is-on', x === b)); renderNew(b.dataset.new); }));
  renderNew('all');

  /* ================= manifesto pills ================= */
  const pillP = pick(['dress-64', 'sling-bag', 'suits-men-1', 'trouser-suit-7'], REAL.slice(0, 4));
  $$('[data-pill]').forEach(s => { const p = pillP[+s.dataset.pill % pillP.length]; s.innerHTML = `<img src="${img(p.i, 300)}" alt="">`; });

  /* ================= look ================= */
  const LOOKS = [
    { name: 'The Boardroom', who: 'Men', note: 'Suit, shirt, shoes and belt', items: [['suits-men-1', 'The suit'], ['men-shirts-2', 'The shirt'], ['men-shoes-17', 'The shoes'], ['men-belts', 'The belt']] },
    { name: 'The Power Suit', who: 'Women', note: 'Tailored suit, sling bag and belt', items: [['trouser-suit-7', 'The suit'], ['sling-bag', 'The bag'], ['belts', 'The belt']] },
    { name: 'The Occasion', who: 'Women', note: 'Statement dress, bag and evening wrap', items: [['dress-64', 'The dress'], ['sling-bag-1', 'The bag'], ['ponchos-4', 'The wrap']] },
  ];
  LOOKS.forEach(L => { L.items = L.items.filter(([h]) => byH[h]); });
  $('#lookTabs').innerHTML = LOOKS.map((L, i) => `<button class="look__tab${i ? '' : ' is-on'}" role="tab" data-look="${i}"><b>0${i + 1}</b><span>${L.name}</span><small>${L.who}</small></button>`).join('');
  let lookI = 0;
  function renderLook(i) {
    lookI = i; const L = LOOKS[i], lead = byH[L.items[0][0]];
    $$('[data-look]').forEach(b => b.classList.toggle('is-on', +b.dataset.look === i));
    $('#lookStage').innerHTML = `
      <div class="look__lead"><div class="look__frame"><img src="${img(lead.i, 1200)}" alt="${L.name}"></div><p class="look__name">${L.name.replace('The ', 'The<br>')}</p></div>
      <div><div class="look__items">${L.items.map(([h, k], j) => {
        const p = byH[h], av = avail(p);
        const ctl = av.length > 1 ? `<select class="select" data-ls="${j}" aria-label="Size for ${p.t}"><option value="">Size</option>${av.map(v => `<option value="${v[1]}">${v[0]}</option>`).join('')}</select>` : `<span class="one">${/size/i.test(av[0][0]) ? av[0][0] : 'Size ' + av[0][0]}</span>`;
        return `<div class="litem" data-lr="${j}"><button class="litem__img" data-qv="${h}" aria-label="Quick view ${p.t}"><img src="${img(p.i, 260)}" alt="" loading="lazy"></button>
          <div><p class="litem__k">${k}</p><p class="litem__t">${p.t}</p><div class="litem__ctl">${ctl}<label class="sw"><input type="checkbox" checked data-li="${j}"><i></i>Include</label></div></div>
          <div class="litem__p">${kes(p.p)}</div></div>`;
      }).join('')}</div>
      <div class="look__sum"><div class="look__total" id="lookTotal"></div><button class="btn btn--ink" id="lookAdd" data-magnetic>Add the look <svg class="ic"><use href="#i-bag"/></svg></button></div></div>`;
    updLook();
    if (G) {
      gsap.from('.look__frame', { clipPath: 'inset(100% 0 0 0 round 999px 999px 16px 16px)', duration: 1.3, ease: 'expo.out' });
      gsap.from('.look__frame img', { scale: 1.3, duration: 1.6, ease: 'expo.out' });
      gsap.from('.look__name', { x: 60, opacity: 0, duration: 1.1, ease: 'power4.out', delay: .15 });
      gsap.from('.litem', { x: 50, opacity: 0, duration: .9, stagger: .08, ease: 'power4.out' });
    }
  }
  function lookState() {
    return LOOKS[lookI].items.map(([h], j) => {
      const p = byH[h], av = avail(p), inc = $(`[data-li="${j}"]`).checked, s = $(`[data-ls="${j}"]`), vid = s ? +s.value : av[0][1];
      return { p, inc, vid, size: vid ? (p.s.find(v => v[1] === vid) || [])[0] : null, sel: s };
    });
  }
  function updLook() {
    const st = lookState(), on = st.filter(x => x.inc);
    $$('[data-lr]').forEach((r, j) => r.classList.toggle('is-off', !st[j].inc));
    $('#lookTotal').innerHTML = `${kes(on.reduce((a, x) => a + x.p.p, 0))}<small>${on.length} piece${on.length !== 1 ? 's' : ''} · ${LOOKS[lookI].note}</small>`;
  }
  $('#lookStage').addEventListener('change', e => { if (e.target.matches('select')) e.target.classList.remove('is-err'); updLook(); });
  $('#lookStage').addEventListener('click', e => {
    if (!e.target.closest('#lookAdd')) return;
    const on = lookState().filter(x => x.inc);
    if (!on.length) return toast('Include at least one piece');
    const miss = on.filter(x => !x.vid);
    if (miss.length) { miss.forEach(x => x.sel && x.sel.classList.add('is-err')); miss[0].sel && miss[0].sel.focus(); return toast(`Choose a size for ${LOOKS[lookI].items[LOOKS[lookI].items.findIndex(([h]) => h === miss[0].p.h)][1].toLowerCase()}`); }
    on.forEach(x => addToBag(x.p.h, x.vid, x.size, true));
    toast(`${LOOKS[lookI].name} added · ${on.length} pieces`); openBag();
  });
  $('#lookTabs').addEventListener('click', e => { const b = e.target.closest('[data-look]'); if (b) renderLook(+b.dataset.look); });
  renderLook(0);

  /* ================= edit ================= */
  const lead = ['dresses', 'trouser-suits', 'skirt-suits', 'palazzo', 'suits'];
  const picks = [...ALL.filter(p => p.tp && !p.ai), ...REAL.filter(p => !p.tp && lead.includes(p.c))].filter((p, i, a) => a.indexOf(p) === i)
    .sort((a, b) => lead.includes(b.c) - lead.includes(a.c)).slice(0, 9);
  const cols = $$('.edit__col');
  picks.forEach((p, i) => cols[i % 3].insertAdjacentHTML('beforeend', card(p, { w: 720 })));

  /* ================= fitting room (tape) ================= */
  const LET = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
  const norm = s => { s = String(s).trim().toUpperCase(); if (s === 'XXL') return '2XL'; if (s === 'XXXL') return '3XL'; if (/^(ONE SIZE|FREE SIZE)$/.test(s)) return 'ONE'; return s; };
  const okSize = s => /^\d{2}$/.test(s) || LET.includes(s) || s === 'ONE';
  const rank = s => s === 'ONE' ? 999 : /^\d/.test(s) ? +s : 100 + LET.indexOf(s);
  let fG = 'w', fS = null, fC = 'all', fN = 8;
  const tapeT = $('#tapeTrack');
  function sizes(g) {
    const m = new Map();
    ALL.filter(p => p.g === g).forEach(p => avail(p).forEach(v => { const n = norm(v[0]); if (okSize(n)) (m.get(n) || m.set(n, new Set()).get(n)).add(p.h); }));
    return [...m].map(([s, set]) => [s, set.size]).sort((a, b) => rank(a[0]) - rank(b[0]));
  }
  function buildTape() {
    const ss = sizes(fG);
    if (!fS || !ss.find(x => x[0] === fS)) fS = (ss.find(x => x[0] === (fG === 'w' ? '44' : 'L')) || ss[0])[0];
    tapeT.innerHTML = ss.map(([s, n]) => `<button class="tick${s === fS ? ' is-on' : ''}" data-tk="${s}" aria-label="Size ${s === 'ONE' ? 'one size' : s}, ${n} pieces"><b>${s === 'ONE' ? '1' : s}</b><small>${s === 'ONE' ? 'one size' : n + ' pcs'}</small></button>`).join('');
    requestAnimationFrame(() => centerTick(fS, false));
    renderFit();
  }
  function centerTick(s, smooth) {
    const t = $(`[data-tk="${s}"]`, tapeT); if (!t) return;
    tapeT.scrollTo({ left: t.offsetLeft + t.offsetWidth / 2 - tapeT.clientWidth / 2, behavior: smooth ? 'smooth' : 'auto' });
  }
  let tapeTO;
  tapeT.addEventListener('scroll', () => {
    clearTimeout(tapeTO);
    tapeTO = setTimeout(() => {
      const mid = tapeT.scrollLeft + tapeT.clientWidth / 2;
      let best = null, d = 1e9;
      $$('.tick', tapeT).forEach(t => { const dd = Math.abs(t.offsetLeft + t.offsetWidth / 2 - mid); if (dd < d) { d = dd; best = t; } });
      if (best && best.dataset.tk !== fS) { fS = best.dataset.tk; $$('.tick', tapeT).forEach(t => t.classList.toggle('is-on', t === best)); fC = 'all'; renderFit(); }
    }, 110);
  }, { passive: true });
  tapeT.addEventListener('click', e => { const t = e.target.closest('[data-tk]'); if (t && !tapeT.dataset.moved) centerTick(t.dataset.tk, true); });
  (() => { // mouse drag on the tape
    let down = false, sx = 0, sl = 0;
    tapeT.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = tapeT.scrollLeft; delete tapeT.dataset.moved; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) { tapeT.dataset.moved = 1; tapeT.classList.add('is-drag'); } tapeT.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { if (!down) return; down = false; tapeT.classList.remove('is-drag'); setTimeout(() => delete tapeT.dataset.moved, 50); const t = $$('.tick', tapeT).reduce((b, t) => { const d = Math.abs(t.offsetLeft + t.offsetWidth / 2 - tapeT.scrollLeft - tapeT.clientWidth / 2); return d < b.d ? { t, d } : b; }, { d: 1e9 }).t; if (t) centerTick(t.dataset.tk, true); });
  })();
  function fitList() { const last = p => (p.c === 'essentials' || p.c === 'lingerie') ? 1 : 0; return ALL.filter(p => p.g === fG && avail(p).some(v => norm(v[0]) === fS)).sort((a, b) => (last(a) - last(b)) || (a.ai - b.ai) || b.d.localeCompare(a.d)); }
  function renderFit(more) {
    if (!more) fN = 8;
    const all = fitList(), cats = [...new Set(all.map(p => p.c))];
    if (fC !== 'all' && !cats.includes(fC)) fC = 'all';
    $('#fitCats').innerHTML = `<button class="chip${fC === 'all' ? ' is-on' : ''}" data-fc="all">All ${all.length}</button>` + cats.map(c => `<button class="chip${fC === c ? ' is-on' : ''}" data-fc="${c}">${catLabel(fG, c)} ${all.filter(p => p.c === c).length}</button>`).join('');
    const list = all.filter(p => fC === 'all' || p.c === fC), lab = fS === 'ONE' ? 'one size' : 'size ' + fS;
    $('#fitCount').innerHTML = list.length ? `<b>${list.length}</b> piece${list.length > 1 ? 's' : ''} in ${lab}, in stock now` : `Nothing in ${lab} right now`;
    $('#fitGrid').innerHTML = list.length ? list.slice(0, fN).map(p => card(p, { size: avail(p).find(v => norm(v[0]) === fS)[0] })).join('') : `<div class="fit__empty">Message us and we'll tell you when your size lands.</div>`;
    $('#fitMore').hidden = list.length <= fN;
    $('#fitWa').href = `https://wa.me/${WA}?text=${encodeURIComponent(`Hello Casa Adorah, I usually wear ${lab} (${fG === 'w' ? 'women' : 'men'}). Could you help me with fit?`)}`;
    if (G) gsap.from($$('#fitGrid .card').slice(more ? -8 : 0), { y: 40, opacity: 0, duration: .8, stagger: .05, ease: 'power3.out' });
  }
  $('#fitCats').addEventListener('click', e => { const b = e.target.closest('[data-fc]'); if (b) { fC = b.dataset.fc; renderFit(); } });
  $$('[data-fit]').forEach(b => b.addEventListener('click', () => { fG = b.dataset.fit; fS = null; fC = 'all'; $$('[data-fit]').forEach(x => x.classList.toggle('is-on', x === b)); pill(b, $('#fitPill')); buildTape(); }));
  $('#fitMore').addEventListener('click', () => { fN += 8; renderFit(true); });
  buildTape();
  requestAnimationFrame(() => pill($('[data-fit].is-on'), $('#fitPill')));
  addEventListener('resize', () => { pill($('[data-fit].is-on'), $('#fitPill')); centerTick(fS, false); });

  /* ================= house ================= */
  const mos = REAL.filter((p, i) => i % 4 === 1).slice(0, 16);
  $('#houseMosaic').innerHTML = mos.map(p => `<img src="${img(p.i, 500)}" alt="" loading="lazy">`).join('');
  const hImgs = pick(['dress-151', 'sling-bag-2', 'suits-men', 'palazzo-set-6'], REAL.slice(10, 14));
  $$('[data-house]').forEach((im, i) => { const p = hImgs[i % hImgs.length]; im.src = img(p.i, 1200); im.alt = p.t; });
  function storeStatus() {
    const n = nairobi(), m = n.h * 60 + n.m, open = n.day !== 'Sun' && m >= 525 && m < 1110, el = $('#thome');
    el.dataset.s = open ? 'open' : 'closed';
    el.textContent = open ? 'Open now · till 6:30 pm' : (n.day === 'Sun' || (n.day === 'Sat' && m >= 1110)) ? 'Closed · opens Mon 8:45' : 'Closed · opens 8:45 am';
  }
  storeStatus();

  /* ================= delivery timer ================= */
  $('#timerTicks').innerHTML = Array.from({ length: 60 }, (_, i) => { const a = i / 60 * Math.PI * 2, r1 = i % 5 ? 78 : 74; return `<line x1="${100 + Math.cos(a) * r1}" y1="${100 + Math.sin(a) * r1}" x2="${100 + Math.cos(a) * 82}" y2="${100 + Math.sin(a) * 82}"/>`; }).join('');
  function timerTick() {
    const c = cutoff(), C = 565.5, arc = $('#timerArc');
    if (c.same) { $('#timerK').textContent = 'Order within'; $('#timerV').textContent = hm(c.left); $('#timerV').classList.remove('is-word'); $('#timerS').textContent = 'for same-day delivery in Nairobi'; arc.style.strokeDashoffset = C * (1 - Math.min(1, c.left / (5 * 3600))); }
    else { $('#timerK').textContent = "Today's same-day window has closed"; $('#timerV').textContent = c.day === 'Sat' || c.day === 'Sun' ? 'Monday' : 'Tomorrow'; $('#timerV').classList.add('is-word'); $('#timerS').textContent = 'is your next delivery day · order before 1:00 pm'; arc.style.strokeDashoffset = C * .02; }
  }
  timerTick();
  setInterval(() => { timerTick(); storeStatus(); annTick(); }, 30000);

  /* ================= social fan ================= */
  const fanP = REAL.filter((p, i) => i % 7 === 3).slice(0, 5);
  $('#socialFan').innerHTML = fanP.map(p => `<a class="fan" href="https://www.instagram.com/casaadorah" target="_blank" rel="noopener" data-cursor="Follow" aria-label="Casa Adorah on Instagram"><img src="${img(p.i, 500)}" alt="" loading="lazy"></a>`).join('');

  /* ================= footer wordmark ================= */
  const fm = $('#footMark');
  fm.innerHTML = 'Casa Adorah'.split('').map((c, i) => `<span class="${i < 4 ? 'it' : ''}">${c === ' ' ? ' ' : c}</span>`).join('');
  if (fine) {
    const chars = $$('span', fm);
    addEventListener('mousemove', e => {
      const r = fm.getBoundingClientRect(); if (e.clientY < r.top - 200 || e.clientY > r.bottom + 200) return;
      chars.forEach(ch => { const b = ch.getBoundingClientRect(), d = Math.hypot(e.clientX - (b.left + b.width / 2), e.clientY - (b.top + b.height / 2)); const w = 400 + Math.max(0, 1 - d / 320) * 500; ch.style.fontVariationSettings = `"wght" ${w.toFixed(0)}`; });
    }, { passive: true });
  }

  renderBag();

  /* ================= split headings ================= */
  $$('.split').forEach(h => {
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) return f.appendChild(document.createTextNode(' ')); const w = document.createElement('span'); w.className = 'w'; const i = document.createElement('span'); i.textContent = t; w.appendChild(i); f.appendChild(w); });
        n.replaceWith(f);
      } else if (n.nodeType === 1 && n.tagName === 'EM') walk(n);
    });
    walk(h);
  });
  // manifesto words (keep pills as their own tokens)
  const mani = $('#mani');
  [...mani.childNodes].forEach(n => {
    if (n.nodeType === 3) { const f = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) return f.appendChild(document.createTextNode(' ')); const s = document.createElement('span'); s.className = 'mw'; s.textContent = t; f.appendChild(s); }); n.replaceWith(f); }
    else if (n.tagName === 'EM') n.classList.add('mw');
  });

  /* ================= cursor ================= */
  if (fine) {
    const cur = $('#cursor'), lab = $('#cursorLabel');
    cur.classList.add('is-hide'); addEventListener('mousemove', () => cur.classList.remove('is-hide'), { once: true });
    let cx = innerWidth / 2, cy = innerHeight / 2, x = cx, y = cy;
    addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; }, { passive: true });
    (function loop() { x += (cx - x) * .2; y += (cy - y) * .2; cur.style.transform = `translate3d(${x}px,${y}px,0)`; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-cursor]');
      cur.classList.toggle('is-big', !!t); lab.textContent = t ? t.dataset.cursor : '';
      cur.classList.toggle('is-hide', !t && !!e.target.closest('input,select,textarea'));
      cur.classList.toggle('is-light', !t && !!e.target.closest('.mani,.house,.foot,.menu,.wings,.fit__panel,.loader'));
    });
    document.addEventListener('mouseleave', () => cur.classList.add('is-hide'));
    document.addEventListener('mouseenter', () => cur.classList.remove('is-hide'));
  }

  /* ================= motion ================= */
  const loader = $('#loader');
  let seen = false;
  try { seen = sessionStorage.getItem('ca2-intro') === '1'; } catch (e) {}
  const endLoad = () => { loader.style.display = 'none'; document.body.classList.remove('is-loading'); if (lenis) lenis.start(); };

  if (!G) {
    endLoad();
    $$('.mw').forEach(w => w.classList.add('is-lit'));
    $('.house__lede').style.opacity = 1;
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('#heroFrame', { clipPath: isDesk() ? 'inset(50vh 50vw 50vh 50vw round 999px 999px 0px 0px)' : 'inset(50vh 50vw 50vh 50vw round 999px 999px 0px 0px)', duration: 1.6 }, 0)
      .from('#heroImgs', { scale: 1.3, duration: 2 }, 0)
      .from('.hero__w--1 .ch', { yPercent: 110, opacity: 0, duration: 1.3, stagger: .05 }, .15)
      .from('.hero__w--2 .ch', { yPercent: 110, opacity: 0, duration: 1.3, stagger: .05 }, .25)
      .from('.hero__side, .hero__ctas, .hero__scroll', { y: 30, opacity: 0, duration: 1.1, stagger: .08 }, .6)
      .from('.hdr__bar', { y: -30, opacity: 0, duration: 1 }, .4);
    return tl;
  }

  if (seen) { endLoad(); heroIntro(); }
  else {
    try { sessionStorage.setItem('ca2-intro', '1'); } catch (e) {}
    const stackP = REAL.filter((p, i) => i % 9 === 2).slice(0, 8);
    $('#loaderStack').innerHTML = stackP.map(p => `<img src="${img(p.i, 500)}" alt="">`).join('');
    const pct = { v: 0 };
    const tl = gsap.timeline({ onComplete: endLoad });
    tl.to('.loader__name span', { y: 0, duration: 1, stagger: .05, ease: 'expo.out' }, 0)
      .to(pct, { v: 100, duration: 2.1, ease: 'power2.inOut', onUpdate: () => { $('#loaderPct').textContent = Math.round(pct.v); } }, 0);
    $$('#loaderStack img').forEach((im, i) => tl.to(im, { opacity: 1, duration: .01 }, .25 + i * .22).to(im, { scale: 1 - i * .01, duration: .3 }, '<'));
    tl.to('.loader__brand, .loader__foot', { opacity: 0, y: -20, duration: .5, ease: 'power2.in' }, 2.2)
      .to('#loaderStack', { width: '100vw', height: '100vh', borderRadius: 0, duration: 1.1, ease: 'expo.inOut' }, 2.3)
      .to('#loaderStack img', { borderRadius: 0, duration: 1.1, ease: 'expo.inOut' }, 2.3)
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, 3.2)
      .add(heroIntro, 3.25);
    loader.addEventListener('click', () => tl.progress(1));
  }

  // hero scroll: arch window opens to full-bleed; wordmark parts
  const mm = gsap.matchMedia();
  mm.add({ d: '(min-width: 901px)', m: '(max-width: 900px)' }, ctx => {
    const { d } = ctx.conditions;
    const tl = gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: .6 } });
    tl.fromTo('#heroFrame', { clipPath: d ? 'inset(13vh 33vw 8vh 33vw round 999px 999px 0px 0px)' : 'inset(22vh 9vw 26vh 9vw round 999px 999px 0px 0px)' }, { clipPath: 'inset(0vh 0vw 0vh 0vw round 0px 0px 0px 0px)', ease: 'none', duration: 1 }, 0)
      .to('.hero__w--1', { xPercent: -60, opacity: 0, ease: 'none', duration: .7 }, 0)
      .to('.hero__w--2', { xPercent: 50, opacity: 0, ease: 'none', duration: .7 }, 0)
      .to('.hero__side', { opacity: 0, y: -40, ease: 'none', duration: .4 }, 0)
      .to('.hero__scroll', { opacity: 0, duration: .2 }, 0)
      .to('.hero__shade', { opacity: 1, ease: 'none', duration: .6 }, .35)
      .fromTo('#heroReveal', { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'none', duration: .35 }, .6);
  });

  // headings
  $$('.split').forEach(h => gsap.from($$('.w>span', h), { yPercent: 115, rotate: 4, duration: 1.3, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } }));
  $$('.eyebrow').forEach(el => { if (el.closest('.hero,.loader,.menu')) return; gsap.from(el, { opacity: 0, x: -20, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } }); });

  // trust counters
  gsap.from('.trust__item', { y: 40, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.trust', start: 'top 90%' } });
  const ts = $('#trustStock'), tv = { v: 0 };
  gsap.to(tv, { v: +ts.dataset.count, duration: 2, ease: 'power3.out', onUpdate: () => { ts.textContent = Math.round(tv.v); }, scrollTrigger: { trigger: '.trust', start: 'top 90%' } });

  // wings: titles drift
  $$('.wing').forEach(w => gsap.fromTo($('.wing__t', w), { yPercent: 30 }, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: w, start: 'top bottom', end: 'bottom top', scrub: true } }));
  gsap.from('.wing', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, stagger: .12, ease: 'expo.inOut', scrollTrigger: { trigger: '.wings', start: 'top 75%' } });

  // new in: horizontal pin on desktop
  mm.add('(min-width: 901px)', () => {
    const dist = () => Math.max(0, track.scrollWidth - (innerWidth - track.getBoundingClientRect().left) + 0);
    let skew = 0;
    const st = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '#newPin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .8, invalidateOnRefresh: true,
        onUpdate: s => {
          const n = $$('.card', track).length; $('#newIdx').textContent = String(Math.min(n, 1 + Math.round(s.progress * (n - 1)))).padStart(2, '0');
          const v = gsap.utils.clamp(-6, 6, s.getVelocity() / -300);
          if (Math.abs(v - skew) > .3) { skew = v; gsap.to('#newTrack .card__frame', { skewX: v, duration: .5, ease: 'power3.out', overwrite: true }); }
        },
        onScrubComplete: () => gsap.to('#newTrack .card__frame', { skewX: 0, duration: .6, ease: 'power3.out' }),
      },
    });
    return () => st.kill();
  });

  // manifesto: words light up, pills open
  const mws = $$('.mw');
  ScrollTrigger.create({ trigger: '#mani', start: 'top 75%', end: 'bottom 40%', scrub: true, onUpdate: s => { const n = Math.round(s.progress * mws.length); mws.forEach((w, i) => w.classList.toggle('is-lit', i < n)); } });
  gsap.from('.pill', { width: 0, duration: 1.2, stagger: .15, ease: 'expo.out', scrollTrigger: { trigger: '#mani', start: 'top 60%' } });
  gsap.from('.vow', { y: 50, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.vows', start: 'top 85%' } });

  // edit: card reveals + column parallax
  ScrollTrigger.batch('.edit .card, .fit__grid .card', { start: 'top 90%', once: true, onEnter: els => {
    gsap.from(els.map(e => $('.card__frame', e)), { clipPath: 'inset(100% 0 0 0 round 999px 999px 14px 14px)', duration: 1.3, stagger: .1, ease: 'expo.out' });
    gsap.from(els.map(e => $('.card__media img', e)), { scale: 1.35, duration: 1.7, stagger: .1, ease: 'expo.out' });
  } });
  mm.add('(min-width: 901px)', () => {
    $$('.edit__col').forEach(c => gsap.fromTo(c, { y: 0 }, { y: () => -innerHeight * .18 * +c.dataset.speed, ease: 'none', scrollTrigger: { trigger: '.edit__cols', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } }));
  });

  // fitting panel
  gsap.from('.fit__panel', { y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.fit__panel', start: 'top 90%' } });

  // house: the arch door opens to the whole House
  mm.add({ d: '(min-width: 901px)', m: '(max-width: 900px)' }, ctx => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: '#houseDoor', start: 'top top', end: 'bottom bottom', scrub: .6 } });
    tl.fromTo('#houseArch', { clipPath: ctx.conditions.d ? 'inset(16vh 36vw 10vh 36vw round 999px 999px 0px 0px)' : 'inset(20vh 14vw 16vh 14vw round 999px 999px 0px 0px)' }, { clipPath: 'inset(0vh 0vw 0vh 0vw round 0px 0px 0px 0px)', ease: 'none' }, 0)
      .fromTo('#houseMosaic', { scale: 1.25 }, { scale: 1, ease: 'none' }, 0)
      .fromTo('.house__arch', { '--o': 0 }, { '--o': 1 }, 0)
      .to('.house__lede', { opacity: 1, ease: 'none', duration: .3 }, .55);
  });
  gsap.from('.house__h', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '#houseDoor', start: 'top 60%' } });

  // stacking service cards: previous card recedes
  const scs = $$('.scard');
  scs.forEach((c, i) => {
    if (i === scs.length - 1) return;
    gsap.to(c, { scale: .92 + i * .01, filter: 'brightness(.6)', ease: 'none', scrollTrigger: { trigger: scs[i + 1], start: 'top bottom', end: 'top 20%', scrub: true } });
  });
  gsap.from('.store', { y: 60, opacity: 0, duration: 1.1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.stores__grid', start: 'top 88%' } });

  // delivery
  gsap.from('#timer', { rotate: -40, scale: .8, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '#timer', start: 'top 85%' } });
  gsap.from('.way', { y: 70, opacity: 0, duration: 1.1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.ways', start: 'top 88%' } });

  // marquee driven by scroll velocity
  const row = $('.next__row'); let mx = 0, boost = 0, dir = -1;
  gsap.ticker.add(() => { const half = row.scrollWidth / 2; mx += dir * (.7 + boost); boost *= .92; if (mx <= -half) mx += half; if (mx > 0) mx -= half; row.style.transform = `translate3d(${mx}px,0,0)`; });
  ScrollTrigger.create({ onUpdate: s => { boost = Math.min(18, Math.abs(s.getVelocity()) / 200); dir = s.direction === 1 ? -1 : 1; } });

  // social fan opens
  const fans = $$('.fan');
  gsap.fromTo(fans, { rotate: 0, x: 0 }, { rotate: i => (i - 2) * 11, x: i => (i - 2) * (isDesk() ? 70 : 46), y: i => Math.abs(i - 2) * 16, ease: 'power3.out', duration: 1.4, stagger: .04, scrollTrigger: { trigger: '.social__fan', start: 'top 75%' } });

  // footer letters
  gsap.from('#footMark span', { yPercent: 100, opacity: 0, rotate: i => (i % 2 ? 10 : -10), stagger: .04, ease: 'power3.out', scrollTrigger: { trigger: '#footMark', start: 'top 98%', end: 'bottom 90%', scrub: 1 } });

  // magnetic buttons
  if (fine) document.addEventListener('mousemove', e => {
    const b = e.target.closest('[data-magnetic]');
    $$('[data-magnetic].is-mag').forEach(x => { if (x !== b) { x.classList.remove('is-mag'); gsap.to(x, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.4)' }); } });
    if (!b) return; b.classList.add('is-mag');
    const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .5, ease: 'power3.out' });
  }, { passive: true });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
