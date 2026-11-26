/* Casa Adorah — homepage concept interactions · SRH Web Agency */
(() => {
  'use strict';
  const STORE = 'https://casaadorah.com';
  const WA = '254181631799';
  const FREE_AT = 10000;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const kes = n => 'KSh ' + Math.round(n).toLocaleString('en-KE');
  const img = (u, w) => u + (u.includes('?') ? '&' : '?') + 'width=' + w;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const desktop = () => matchMedia('(min-width: 901px)').matches;

  /* ---------------- data ---------------- */
  const ALL = (window.CA_PRODUCTS || []).filter(p => p.s.some(v => v[2]));
  const byH = Object.fromEntries(ALL.map(p => [p.h, p]));
  const REAL = ALL.filter(p => !p.ai); // prefer real product photography for editorial spots
  const pick = (hs, fallback) => {
    const out = hs.map(h => byH[h]).filter(p => p && !p.ai);
    return out.length ? out : fallback;
  };

  const CATS = {
    w: [
      ['dresses', 'Dresses', '/collections/dress'],
      ['trouser-suits', 'Trouser Suits', '/collections/ladies-trouser-suits'],
      ['skirt-suits', 'Skirt Suits', '/collections/skirt-suits'],
      ['palazzo', 'Palazzo Sets', '/collections/palazzo-set-women'],
      ['blouses', 'Blouses & Shirts', '/collections/blousers-and-shirts'],
      ['trousers', 'Trousers & Jeans', '/collections/ladies-trousers'],
      ['outerwear', 'Blazers & Ponchos', '/collections/blazers-ladies'],
      ['bags', 'Handbags & Sling Bags', '/collections/ladies-handbags'],
      ['belts', 'Belts', '/collections/belts-essentials'],
      ['lingerie', 'Panties', '/collections/panties-ladies'],
      ['skirts', 'Skirts', '/collections/skirts'],
    ],
    m: [
      ['suits', 'Suits', '/collections/suits-men'],
      ['jackets', 'Jackets & Vests', '/collections/jackets-men'],
      ['shirts', 'Shirts', '/collections/shirts-men'],
      ['trousers', 'Trousers', '/collections/trousers-men'],
      ['jeans', 'Jeans', '/collections/jeans-men'],
      ['knitwear', 'Knitwear & Sweaters', '/collections/men-sweaters'],
      ['shoes', 'Shoes', '/collections/shoes-men'],
      ['hats', 'Hats, Caps & Scarves', '/collections/hat-cap-scarf-men'],
      ['belts', 'Belts', '/collections/men-belts'],
      ['essentials', 'Boxers & Socks', '/collections/men-boxers'],
    ],
  };
  const catLabel = (g, c) => ((CATS[g] || CATS.w).find(x => x[0] === c) || CATS.w.find(x => x[0] === c) || [c, c])[1];
  const roomData = g => CATS[g].map(([key, label, url]) => {
    const items = ALL.filter(p => p.g === g && p.c === key);
    if (!items.length) return null;
    const cover = items.find(p => !p.ai) || items[0];
    const cover2 = items.filter(p => !p.ai)[1] || cover;
    return { key, label, url: STORE + url, count: items.length, from: Math.min(...items.map(p => p.p)), cover, cover2 };
  }).filter(Boolean);
  const ROOMS = { w: roomData('w'), m: roomData('m') };

  /* Some newer studio shots show the same outfit front and back side by side;
     in portrait crops we frame the front view. */
  const TWO = new Set(ALL.filter(p => /^dress-1(4\d|5\d|6\d)$/.test(p.h) || /^palazzo-set-[3-6]$/.test(p.h)).map(p => p.i.split('?')[0]));
  const frameImg = im => { if (im.tagName === 'IMG' && TWO.has((im.getAttribute('src') || '').split('?')[0])) im.style.objectPosition = '26% 50%'; else if (im.tagName === 'IMG') im.style.objectPosition = ''; };
  new MutationObserver(ms => ms.forEach(m => {
    if (m.type === 'attributes') frameImg(m.target);
    else m.addedNodes.forEach(n => { if (n.nodeType !== 1) return; if (n.tagName === 'IMG') frameImg(n); n.querySelectorAll && n.querySelectorAll('img').forEach(frameImg); });
  })).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] });

  /* ---------------- Nairobi clock ---------------- */
  function nairobi() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(new Date());
    const o = Object.fromEntries(parts.map(x => [x.type, x.value]));
    return { day: o.weekday, h: +o.hour % 24, m: +o.minute, s: +o.second };
  }
  function cutoff() {
    const n = nairobi();
    const working = n.day !== 'Sun';
    const nowS = n.h * 3600 + n.m * 60 + n.s, cut = 13 * 3600;
    if (working && nowS < cut) return { same: true, left: cut - nowS };
    return { same: false, day: n.day };
  }
  const hm = s => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`; };
  function etaText() {
    const c = cutoff();
    if (c.same) return `Order in ${hm(c.left)} for same-day Nairobi delivery`;
    return c.day === 'Sat' || c.day === 'Sun' ? 'Order now for delivery on the next working day' : 'Order now for next working-day Nairobi delivery';
  }

  /* ---------------- toast ---------------- */
  let tt;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('is-on');
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove('is-on'), 2600);
  }

  /* ---------------- bag ---------------- */
  let bag = [];
  try { bag = JSON.parse(localStorage.getItem('ca-bag') || '[]').filter(i => byH[i.h]); } catch (e) { bag = []; }
  const saveBag = () => { try { localStorage.setItem('ca-bag', JSON.stringify(bag)); } catch (e) {} };
  const bagEl = $('#bag'), scrim = $('#scrim');
  let lastFocus = null;
  function openLayer(el) { lastFocus = document.activeElement; el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false'); scrim.classList.add('is-on'); document.body.style.overflow = 'hidden'; }
  function closeLayers() {
    $$('.bag.is-open,.qv.is-open').forEach(el => { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); });
    scrim.classList.remove('is-on'); document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  const openBag = () => { closeLayers(); openLayer(bagEl); setTimeout(() => $('#bagClose').focus(), 50); };
  $('#bagBtn').addEventListener('click', openBag);
  $('#dockBag').addEventListener('click', openBag);
  $('#bagClose').addEventListener('click', closeLayers);
  scrim.addEventListener('click', closeLayers);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLayers(); closeSearch(); closeMega(); } });

  function addToBag(h, vid, size, silent) {
    const ex = bag.find(i => i.vid === vid);
    if (ex) ex.qty++; else bag.push({ h, vid, size, qty: 1 });
    saveBag(); renderBag();
    const c = $('#bagCount'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
    if (!silent) toast(`Added · ${byH[h].t}${size && !/one size|free size/i.test(size) ? ' · ' + size : ''}`);
  }
  function waBagText(intro) {
    const lines = bag.map(i => `• ${byH[i.h].t} (${i.size}) x${i.qty} – ${kes(byH[i.h].p)}\n  ${STORE}/products/${i.h}`);
    return `${intro}\n\n${lines.join('\n')}`;
  }
  function renderBag() {
    const n = bag.reduce((a, i) => a + i.qty, 0);
    const total = bag.reduce((a, i) => a + byH[i.h].p * i.qty, 0);
    const c = $('#bagCount'); c.textContent = n; c.classList.toggle('has', n > 0);
    $('#dockCount').textContent = n;
    $('#bagN').textContent = n ? `(${n})` : '';
    const box = $('#bagItems');
    if (!bag.length) {
      box.innerHTML = `<div class="bag-empty"><svg viewBox="0 0 80 100"><path d="M4 98V40C4 20 20 4 40 4s36 16 36 36v58" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><p>Your bag is waiting<br>for something beautiful.</p><a class="link-arrow" href="#new" data-closebag>Shop new arrivals</a></div>`;
    } else {
      box.innerHTML = bag.map((i, idx) => {
        const p = byH[i.h];
        return `<div class="bitem"><img src="${img(p.i, 200)}" alt="${p.t}" loading="lazy">
          <div><h4>${p.t}</h4><p>${catLabel(p.g, p.c)} · Size ${i.size}</p>
          <div class="qty"><button data-q="-1" data-i="${idx}" aria-label="Decrease"><svg class="ic"><use href="#i-minus"/></svg></button><span>${i.qty}</span><button data-q="1" data-i="${idx}" aria-label="Increase"><svg class="ic"><use href="#i-plus"/></svg></button></div></div>
          <div class="bitem__p">${kes(p.p * i.qty)}<button class="bitem__x" data-rm="${idx}">Remove</button></div></div>`;
      }).join('');
    }
    $('#bagTotal').textContent = kes(total);
    const left = FREE_AT - total;
    $('#bagFreeTxt').innerHTML = !total ? `Free Nairobi delivery (Zones 1 &amp; 2) on orders of <b>${kes(FREE_AT)}</b>+`
      : left > 0 ? `You're <b>${kes(left)}</b> away from free Nairobi delivery` : `<b>You've unlocked free Nairobi delivery</b> (Zones 1 &amp; 2)`;
    $('#bagFreeBar').style.width = Math.min(100, total / FREE_AT * 100) + '%';
    $('#bagEta').textContent = etaText();
    const co = $('#checkout');
    co.href = bag.length ? `${STORE}/cart/${bag.map(i => `${i.vid}:${i.qty}`).join(',')}` : `${STORE}/cart`;
    co.toggleAttribute('aria-disabled', !bag.length);
    const waHouse = bag.length ? waBagText("Hello Casa Adorah, I'd like to see these pieces at Casa Adorah House before buying:") : "Hello Casa Adorah, I'd like help choosing something.";
    $('#bagHouse').href = `https://wa.me/${WA}?text=${encodeURIComponent(waHouse)}`;
    $('#houseBagLine').textContent = bag.length ? `${n} piece${n > 1 ? 's' : ''} in your bag · ${kes(total)}` : 'Your bag is empty. Add a few pieces first.';
    $('#houseBagBtn').href = `https://wa.me/${WA}?text=${encodeURIComponent(bag.length ? waBagText("Hello Casa Adorah, could I see these at Casa Adorah House, or have similar options brought with my delivery?") : "Hello Casa Adorah, I'd like to visit Casa Adorah House.")}`;
    $$('.js-visit').forEach(a => {
      const t = `Hello Casa Adorah, I'd like to visit ${a.dataset.store}. Could you confirm what's available?`;
      a.href = `https://wa.me/${WA}?text=${encodeURIComponent(bag.length ? waBagText(t + ' I am interested in:') : t)}`;
    });
  }
  $('#bagItems').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]'), cl = e.target.closest('[data-closebag]');
    if (q) { const i = bag[+q.dataset.i]; i.qty += +q.dataset.q; if (i.qty < 1) bag.splice(+q.dataset.i, 1); saveBag(); renderBag(); }
    if (rm) { bag.splice(+rm.dataset.rm, 1); saveBag(); renderBag(); }
    if (cl) closeLayers();
  });
  $('#checkout').addEventListener('click', e => { if (!bag.length) { e.preventDefault(); toast('Add a piece to your bag first'); } });

  /* ---------------- product card ---------------- */
  const avail = p => p.s.filter(v => v[2]);
  function card(p, o = {}) {
    const av = avail(p);
    const one = av.length === 1 && p.s.length > 1;
    const sizes = p.s.map(v => `<button class="sz${o.size && v[0] === o.size ? ' is-on' : ''}" data-add="${p.h}" data-vid="${v[1]}" data-size="${v[0]}" ${v[2] ? '' : 'disabled aria-disabled="true"'}>${v[0]}</button>`).join('');
    const date = o.date ? `<span class="card__date">Added ${new Date(p.d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>` : '';
    const badge = one ? `<span class="card__badge card__badge--low">1 size left</span>` : '';
    return `<article class="card" data-h="${p.h}">
      <div class="card__frame">
        <a class="card__media" href="${STORE}/products/${p.h}" aria-label="${p.t}, ${kes(p.p)}">
          <img src="${img(p.i, 640)}" alt="${p.t} — ${catLabel(p.g, p.c)}" loading="lazy" width="640" height="853">
        </a>${date}${badge}
        <button class="card__add" data-qv="${p.h}" data-size="${o.size || ''}" aria-label="Quick view ${p.t}"><svg class="ic"><use href="#i-plus"/></svg></button>
        <div class="card__quick"><p>Quick add · size</p><div class="sizes">${sizes}</div></div>
      </div>
      <div class="card__body"><div><h3 class="card__t">${p.t}</h3><p class="card__m">${catLabel(p.g, p.c)} · ${av.length === 1 ? (/size/i.test(av[0][0]) ? av[0][0] : 'Size ' + av[0][0]) : av.length + ' sizes'}</p></div><span class="card__p">${kes(p.p)}</span></div>
    </article>`;
  }
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add && !add.disabled) { e.preventDefault(); addToBag(add.dataset.add, +add.dataset.vid, add.dataset.size); return; }
    const qv = e.target.closest('[data-qv]');
    if (qv) { e.preventDefault(); openQV(qv.dataset.qv, qv.dataset.size); }
  });

  /* ---------------- quick view ---------------- */
  const qvEl = $('#qv');
  let qvP = null, qvSel = null;
  function openQV(h, size) {
    const p = byH[h]; if (!p) return;
    qvP = p; qvSel = null;
    $('#qvImg').src = img(p.i, 900); $('#qvImg').alt = p.t;
    $('#qvCat').textContent = (p.g === 'm' ? 'Men · ' : 'Women · ') + catLabel(p.g, p.c);
    $('#qvTitle').textContent = p.t;
    $('#qvPrice').textContent = kes(p.p);
    const av = avail(p);
    $('#qvSizes').innerHTML = p.s.map(v => `<button class="sz" data-qvs="${v[1]}" data-size="${v[0]}" ${v[2] ? '' : 'disabled'}>${v[0]}</button>`).join('');
    $('#qvSizeNote').textContent = av.length < p.s.length ? `· ${p.s.length - av.length} sold out` : '';
    const pre = (size && av.find(v => v[0] === size)) || (av.length === 1 ? av[0] : null);
    if (pre) selQV(pre[1]); else updQV();
    $('#qvEta').textContent = etaText();
    $('#qvLink').href = `${STORE}/products/${p.h}`;
    $('#qvWa').href = `https://wa.me/${WA}?text=${encodeURIComponent(`Hello Casa Adorah, can I see this at Casa Adorah House?\n${p.t} – ${kes(p.p)}\n${STORE}/products/${p.h}`)}`;
    closeLayers(); openLayer(qvEl); setTimeout(() => $('#qvClose').focus(), 60);
  }
  function selQV(vid) { qvSel = qvP.s.find(v => v[1] === +vid); $$('#qvSizes .sz').forEach(b => b.classList.toggle('is-on', +b.dataset.qvs === +vid)); updQV(); }
  function updQV() { const b = $('#qvAdd'); b.textContent = qvSel ? `Add to bag · ${kes(qvP.p)}` : 'Select a size'; b.classList.toggle('is-wait', !qvSel); }
  $('#qvSizes').addEventListener('click', e => { const b = e.target.closest('[data-qvs]'); if (b && !b.disabled) selQV(b.dataset.qvs); });
  $('#qvAdd').addEventListener('click', () => {
    if (!qvSel) { gsapShake($('#qvSizes')); return; }
    addToBag(qvP.h, qvSel[1], qvSel[0], true); closeLayers(); toast(`Added · ${qvP.t} · ${qvSel[0]}`);
  });
  $('#qvClose').addEventListener('click', closeLayers);
  qvEl.addEventListener('click', e => { if (e.target === qvEl) closeLayers(); });
  function gsapShake(el) { if (hasGsap && !reduce) gsap.fromTo(el, { x: -6 }, { x: 0, duration: .5, ease: 'elastic.out(1,.3)' }); }

  /* ---------------- header: mega, search, drawer ---------------- */
  const hdr = $('#hdr'), mega = $('#mega');
  let megaT;
  function openMega(g) {
    clearTimeout(megaT);
    const rooms = ROOMS[g];
    $('#megaCols').innerHTML = `<h5>${g === 'w' ? 'Women' : 'Men'}</h5>` + rooms.map(r => `<a href="${r.url}" data-img="${r.cover.i}" data-cap="${r.label} · from ${kes(r.from)}">${r.label}<small>${r.count}</small></a>`).join('') +
      `<a class="mega__all" href="${STORE}/collections/${g === 'w' ? 'women' : 'men-jackets-shirts'}">Shop all ${g === 'w' ? "women's" : "men's"} →</a>`;
    setMegaFeature(rooms[0].cover.i, `${rooms[0].label} · from ${kes(rooms[0].from)}`, rooms[0].url);
    mega.classList.add('is-open'); mega.setAttribute('aria-hidden', 'false');
    $$('.hdr__link[data-mega]').forEach(a => a.classList.toggle('is-on', a.dataset.mega === g));
  }
  function setMegaFeature(src, cap, url) { $('#megaImg').src = img(src, 600); $('#megaCap').textContent = cap; $('#megaFeature').href = url; }
  function closeMega() { mega.classList.remove('is-open'); mega.setAttribute('aria-hidden', 'true'); $$('.hdr__link[data-mega]').forEach(a => a.classList.remove('is-on')); }
  $$('.hdr__link[data-mega]').forEach(a => {
    a.addEventListener('mouseenter', () => openMega(a.dataset.mega));
    a.addEventListener('focus', () => openMega(a.dataset.mega));
    a.addEventListener('click', () => { closeMega(); setWing(a.dataset.mega); });
  });
  $$('.hdr__link:not([data-mega]), .logo, .hdr__tools').forEach(el => el.addEventListener('mouseenter', closeMega));
  hdr.addEventListener('mouseleave', () => { megaT = setTimeout(closeMega, 200); });
  mega.addEventListener('mouseenter', () => clearTimeout(megaT));
  $('#megaCols').addEventListener('mouseover', e => { const a = e.target.closest('[data-img]'); if (a) setMegaFeature(a.dataset.img, a.dataset.cap, a.href); });

  const search = $('#search');
  function openSearch() { search.classList.add('is-open'); search.setAttribute('aria-hidden', 'false'); setTimeout(() => $('#searchInput').focus(), 60); }
  function closeSearch() { search.classList.remove('is-open'); search.setAttribute('aria-hidden', 'true'); }
  $('#searchBtn').addEventListener('click', openSearch);
  $('#searchClose').addEventListener('click', closeSearch);
  $$('.search__chips button').forEach(b => b.addEventListener('click', () => { $('#searchInput').value = b.dataset.q; search.submit(); }));

  const drawer = $('#drawer'), burger = $('#burger');
  function renderDrawer(g) {
    $('#drawerList').innerHTML = ROOMS[g].map(r => `<a href="${r.url}"><img src="${img(r.cover.i, 120)}" alt="" loading="lazy"><span>${r.label}</span><small>${r.count}</small></a>`).join('');
    $$('[data-dtab]').forEach(b => b.classList.toggle('is-on', b.dataset.dtab === g));
  }
  $$('[data-dtab]').forEach(b => b.addEventListener('click', () => renderDrawer(b.dataset.dtab)));
  function toggleDrawer(force) {
    const open = force ?? !drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', open); drawer.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', () => toggleDrawer());
  $$('[data-close]', drawer).forEach(a => a.addEventListener('click', () => toggleDrawer(false)));
  renderDrawer('w');

  /* announcement */
  const msgs = $$('.announce__msg');
  let mi = 0;
  const liveAnn = () => { msgs[0].textContent = etaText(); };
  liveAnn();
  setInterval(() => { msgs[mi].classList.remove('is-on'); mi = (mi + 1) % msgs.length; if (mi === 0) liveAnn(); msgs[mi].classList.add('is-on'); }, 4800);

  addEventListener('scroll', () => { hdr.classList.toggle('is-scrolled', scrollY > 10); }, { passive: true });

  /* ---------------- hero ---------------- */
  const heroPicks = pick(['dress-153', 'trouser-suit-7', 'suits-men-1', 'dress-151', 'palazzo-set-6', 'men-jackets-10'], REAL.slice(0, 5));
  const slides = $('#heroSlides'), dots = $('#heroDots');
  slides.innerHTML = heroPicks.map((p, i) => `<img src="${img(p.i, i ? 1100 : 1100)}" alt="${p.t}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} class="${i ? '' : 'is-on'}">`).join('');
  dots.innerHTML = heroPicks.map((p, i) => `<button role="tab" aria-label="Show ${p.t}" data-hi="${i}"><i></i></button>`).join('');
  const minis = pick(['sling-bag', 'men-shoes-17', 'ponchos-4'], REAL.slice(5, 8));
  $('#heroMiniA').src = img((minis[0] || REAL[0]).i, 400);
  $('#heroMiniB').src = img((minis[1] || REAL[1]).i, 400);
  $('#statCount').textContent = ALL.length;
  let hi = 0, heroTimer, dotTween;
  function showHero(i) {
    const ims = $$('img', slides);
    const prev = ims[hi]; hi = (i + ims.length) % ims.length; const next = ims[hi];
    const p = heroPicks[hi];
    $('#heroTagK').textContent = `${p.t} · ${catLabel(p.g, p.c)}`;
    $('#heroTagP').textContent = kes(p.p);
    $('#heroTag').dataset.qv = p.h;
    $$('button', dots).forEach((b, j) => b.classList.toggle('is-done', j < hi));
    if (hasGsap && !reduce) {
      if (prev !== next) { gsap.to(prev, { opacity: 0, duration: 1.1, ease: 'power2.inOut', onComplete: () => prev.classList.remove('is-on') }); }
      next.classList.add('is-on');
      gsap.fromTo(next, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' });
      gsap.to(next, { scale: 1.06, duration: 6, ease: 'none', delay: 1.4 });
      if (dotTween) dotTween.kill();
      const bar = $$('button i', dots)[hi];
      $$('button i', dots).forEach((x, j) => { if (j !== hi) gsap.set(x, { scaleX: j < hi ? 1 : 0 }); });
      dotTween = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 5, ease: 'none' });
    } else { ims.forEach(x => x.classList.toggle('is-on', x === next)); ims.forEach(x => { x.style.opacity = x === next ? 1 : 0; x.style.transform = 'none'; }); }
    clearTimeout(heroTimer); heroTimer = setTimeout(() => showHero(hi + 1), 5000);
  }
  dots.addEventListener('click', e => { const b = e.target.closest('[data-hi]'); if (b) showHero(+b.dataset.hi); });

  /* hero CTAs set wing */
  $$('[data-wing]').forEach(a => a.addEventListener('click', () => setWing(a.dataset.wing)));

  /* ---------------- wings / rooms ---------------- */
  let wing = 'w';
  const roomsEl = $('#rooms');
  function setWing(g) {
    wing = g;
    $$('[data-wing-tab]').forEach(b => { const on = b.dataset.wingTab === g; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
    movePill();
    const rooms = ROOMS[g];
    roomsEl.innerHTML = rooms.map((r, i) => `<li><a class="room${i === 0 ? ' is-on' : ''}" href="${r.url}" data-room="${i}">
        <span class="room__thumb"><img src="${img(r.cover.i, 160)}" alt="" loading="lazy"></span>
        <span class="room__n">${String(i + 1).padStart(2, '0')}</span>
        <span class="room__t">${r.label}</span>
        <span class="room__c">${r.count} in stock</span>
        <span class="room__p">from ${kes(r.from)}</span></a></li>`).join('');
    $('#wingAll').href = `${STORE}/collections/${g === 'w' ? 'women' : 'men-jackets-shirts'}`;
    $('#wingAll').firstChild.textContent = `Shop all ${g === 'w' ? "women's" : "men's"} `;
    showRoom(0, true);
    if (hasGsap && !reduce) gsap.from($$('.room', roomsEl), { yPercent: 60, opacity: 0, duration: .8, stagger: .045, ease: 'power3.out' });
  }
  let curRoom = -1, viewFlip = false;
  function showRoom(i, force) {
    if (i === curRoom && !force) return; curRoom = i;
    const r = ROOMS[wing][i];
    $$('.room', roomsEl).forEach((a, j) => a.classList.toggle('is-on', j === i));
    const [a, b] = [$('#roomImg'), $('#roomImg2')];
    const front = viewFlip ? a : b, back = viewFlip ? b : a; viewFlip = !viewFlip;
    front.src = img(r.cover2.i, 900); front.alt = r.label;
    front.style.opacity = 1; back.style.opacity = 0;
    front.style.transform = 'scale(1.06)'; requestAnimationFrame(() => { front.style.transform = 'scale(1)'; });
    $('#roomName').textContent = r.label;
    $('#roomCount').textContent = `${r.count} in stock · from ${kes(r.from)}`;
  }
  roomsEl.addEventListener('mouseover', e => { const a = e.target.closest('[data-room]'); if (a) showRoom(+a.dataset.room); });
  roomsEl.addEventListener('focusin', e => { const a = e.target.closest('[data-room]'); if (a) showRoom(+a.dataset.room); });
  $$('[data-wing-tab]').forEach(b => b.addEventListener('click', () => setWing(b.dataset.wingTab)));
  function movePill() {
    const on = $(`[data-wing-tab="${wing}"]`), pill = $('#wingPill');
    pill.style.width = on.offsetWidth + 'px'; pill.style.transform = `translateX(${on.offsetLeft - 5}px)`;
  }
  addEventListener('resize', movePill);
  setWing('w');

  /* ---------------- new in rail ---------------- */
  const rail = $('#newRail');
  const newest = g => REAL.filter(p => g === 'all' || p.g === g).slice(0, 14);
  function renderNew(g) {
    rail.innerHTML = newest(g).map(p => card(p, { date: true })).join('');
    rail.scrollLeft = 0; railProg();
    if (hasGsap && !reduce) gsap.from($$('.card', rail), { y: 40, opacity: 0, duration: .8, stagger: .06, ease: 'power3.out' });
  }
  $$('[data-new]').forEach(b => b.addEventListener('click', () => { $$('[data-new]').forEach(x => x.classList.toggle('is-on', x === b)); renderNew(b.dataset.new); }));
  $$('[data-rail]').forEach(b => b.addEventListener('click', () => rail.scrollBy({ left: (b.dataset.rail === 'next' ? 1 : -1) * rail.clientWidth * .8, behavior: 'smooth' })));
  function railProg() {
    const max = rail.scrollWidth - rail.clientWidth, bar = $('#railBar');
    const vis = rail.clientWidth / rail.scrollWidth;
    bar.style.width = (vis * 100) + '%';
    bar.style.transform = `translateX(${max > 0 ? (rail.scrollLeft / max) * (1 / vis - 1) * 100 : 0}%)`;
  }
  rail.addEventListener('scroll', railProg, { passive: true });
  addEventListener('resize', railProg);
  (() => { // drag to scroll (mouse)
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.target.closest('button')) return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; rail.classList.add('is-drag'); } rail.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { if (!down) return; down = false; setTimeout(() => rail.classList.remove('is-drag'), 0); });
    rail.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  })();
  renderNew('all');

  /* ---------------- complete the look ---------------- */
  const LOOKS = [
    { name: 'The Boardroom', note: 'Suit, shirt, shoes and belt', items: [['suits-men-1', 'The suit'], ['men-shirts-2', 'The shirt'], ['men-shoes-17', 'The shoes'], ['men-belts', 'The belt']] },
    { name: 'The Power Suit', note: 'Tailored suit, sling bag and belt', items: [['trouser-suit-7', 'The suit'], ['sling-bag', 'The bag'], ['belts', 'The belt']] },
    { name: 'The Occasion', note: 'Statement dress, bag and an evening wrap', items: [['dress-153', 'The dress'], ['sling-bag-1', 'The bag'], ['ponchos-4', 'The wrap']] },
  ];
  LOOKS.forEach(l => { l.items = l.items.filter(([h]) => byH[h]); });
  let lookI = 0;
  function renderLook(i) {
    lookI = i; const L = LOOKS[i];
    $$('[data-look]').forEach(b => b.classList.toggle('is-on', +b.dataset.look === i));
    const lead = byH[L.items[0][0]];
    $('#lookBody').innerHTML = `
      <div class="look__hero arch"><img src="${img(lead.i, 1000)}" alt="${L.name}"><span class="look__label">${L.name}</span></div>
      <div>
        <div class="look__items">${L.items.map(([h, k], j) => {
          const p = byH[h], av = avail(p);
          const sel = av.length > 1 ? `<select class="select" data-li="${j}" aria-label="Size for ${p.t}"><option value="">Size</option>${av.map(v => `<option value="${v[1]}">${v[0]}</option>`).join('')}</select>` : `<span class="litem__in">${av[0][0]}</span>`;
          return `<div class="litem" data-li-row="${j}">
            <button class="litem__img" data-qv="${h}" aria-label="Quick view ${p.t}"><img src="${img(p.i, 240)}" alt="" loading="lazy"></button>
            <div><p class="litem__k">${k}</p><p class="litem__t">${p.t}</p>
              <div class="litem__row">${sel}<label class="litem__in"><input type="checkbox" checked data-inc="${j}"> Include</label></div></div>
            <div class="litem__p">${kes(p.p)}</div></div>`;
        }).join('')}</div>
        <div class="look__sum"><div class="look__total" id="lookTotal"></div><button class="btn btn--dark magnetic" id="lookAdd">Add the look <svg class="ic"><use href="#i-bag"/></svg></button></div>
      </div>`;
    updLook();
    if (hasGsap && !reduce) {
      gsap.from('#lookBody .look__hero', { clipPath: 'inset(100% 0 0 0)', duration: 1.1, ease: 'power4.out' });
      gsap.from('#lookBody .litem', { x: 30, opacity: 0, duration: .7, stagger: .08, ease: 'power3.out' });
    }
  }
  function lookState() {
    const L = LOOKS[lookI];
    return L.items.map(([h], j) => {
      const p = byH[h], av = avail(p), inc = $(`[data-inc="${j}"]`).checked;
      const s = $(`[data-li="${j}"]`); const vid = s ? +s.value : av[0][1];
      return { p, inc, vid, size: vid ? (p.s.find(v => v[1] === vid) || [])[0] : null };
    });
  }
  function updLook() {
    const st = lookState(), on = st.filter(x => x.inc);
    $$('[data-li-row]').forEach((r, j) => r.classList.toggle('is-off', !st[j].inc));
    $('#lookTotal').innerHTML = `${kes(on.reduce((a, x) => a + x.p.p, 0))}<small>${on.length} piece${on.length !== 1 ? 's' : ''} · ${LOOKS[lookI].note}</small>`;
  }
  $('#lookBody').addEventListener('change', updLook);
  $('#lookBody').addEventListener('click', e => {
    if (!e.target.closest('#lookAdd')) return;
    const on = lookState().filter(x => x.inc);
    if (!on.length) { toast('Include at least one piece'); return; }
    const miss = on.find(x => !x.vid);
    if (miss) { toast(`Choose a size for the ${miss.p.t.toLowerCase()}`); const s = $$('[data-li]').find(s => !s.value); if (s) { s.focus(); gsapShake(s); } return; }
    on.forEach(x => addToBag(x.p.h, x.vid, x.size, true));
    toast(`${LOOKS[lookI].name} added · ${on.length} pieces`); openBag();
  });
  $$('[data-look]').forEach(b => b.addEventListener('click', () => renderLook(+b.dataset.look)));
  renderLook(0);

  /* ---------------- top picks ---------------- */
  const picks = ALL.filter(p => p.tp && !p.ai);
  const extra = REAL.filter(p => !p.tp && ['dresses', 'trouser-suits', 'suits', 'palazzo'].includes(p.c));
  const leadCats = ['dresses', 'trouser-suits', 'skirt-suits', 'palazzo', 'suits'];
  const pickList = [...picks, ...extra].filter((p, i, a) => a.indexOf(p) === i).sort((a, b) => leadCats.includes(b.c) - leadCats.includes(a.c)).slice(0, 9);
  $('#picksGrid').innerHTML = pickList.map(p => card(p)).join('');

  /* ---------------- fitting room ---------------- */
  const LET = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
  const norm = s => { s = String(s).trim().toUpperCase(); if (s === 'XXL') return '2XL'; if (s === 'XXXL') return '3XL'; if (/^(ONE SIZE|FREE SIZE)$/.test(s)) return 'ONE'; return s; };
  const sizeOk = s => /^\d{2}$/.test(s) || LET.includes(s) || s === 'ONE';
  let fitG = 'w', fitS = null, fitC = 'all', fitN = 9;
  function fitPool(g) { return ALL.filter(p => p.g === g); }
  function sizesFor(g) {
    const m = new Map();
    fitPool(g).forEach(p => avail(p).forEach(v => { const n = norm(v[0]); if (sizeOk(n)) m.set(n, (m.get(n) || new Set()).add(p.h)); }));
    return [...m.entries()].map(([s, set]) => [s, set.size]).sort((a, b) => {
      const ra = a[0] === 'ONE' ? 999 : /^\d/.test(a[0]) ? +a[0] : 100 + LET.indexOf(a[0]);
      const rb = b[0] === 'ONE' ? 999 : /^\d/.test(b[0]) ? +b[0] : 100 + LET.indexOf(b[0]);
      return ra - rb;
    });
  }
  function renderFitSizes() {
    const ss = sizesFor(fitG);
    if (!fitS || !ss.find(x => x[0] === fitS)) fitS = (ss.find(x => x[0] === (fitG === 'w' ? '44' : 'L')) || ss[0])[0];
    $('#fitSizes').innerHTML = ss.map(([s, n]) => `<button class="sz${s === fitS ? ' is-on' : ''}" data-fs="${s}" aria-pressed="${s === fitS}">${s === 'ONE' ? 'One size' : s}<small>${n}</small></button>`).join('');
    renderFit();
  }
  function fitMatches() {
    return fitPool(fitG).filter(p => avail(p).some(v => norm(v[0]) === fitS)).sort((a, b) => (a.ai - b.ai) || b.d.localeCompare(a.d));
  }
  function renderFit(keepN) {
    if (!keepN) fitN = 9;
    const all = fitMatches();
    const cats = [...new Set(all.map(p => p.c))];
    if (fitC !== 'all' && !cats.includes(fitC)) fitC = 'all';
    $('#fitCats').innerHTML = `<button class="chip${fitC === 'all' ? ' is-on' : ''}" data-fc="all">All (${all.length})</button>` + cats.map(c => `<button class="chip${fitC === c ? ' is-on' : ''}" data-fc="${c}">${catLabel(fitG, c)} (${all.filter(p => p.c === c).length})</button>`).join('');
    const list = all.filter(p => fitC === 'all' || p.c === fitC);
    const label = fitS === 'ONE' ? 'one size' : 'size ' + fitS;
    $('#fitCount').innerHTML = list.length ? `<b>${list.length}</b> piece${list.length > 1 ? 's' : ''} in stock in ${label}` : `Nothing in ${label} right now`;
    $('#fitGrid').innerHTML = list.length ? list.slice(0, fitN).map(p => { const v = avail(p).find(v => norm(v[0]) === fitS); return card(p, { size: v[0] }); }).join('')
      : `<div class="fit-empty">Message us and we'll tell you when your size lands.</div>`;
    $('#fitMore').hidden = list.length <= fitN;
    $('#fitWa').href = `https://wa.me/${WA}?text=${encodeURIComponent(`Hello Casa Adorah, I usually wear ${label} (${fitG === 'w' ? 'women' : 'men'}). Could you help me with fit?`)}`;
    if (hasGsap && !reduce) gsap.from($$('#fitGrid .card').slice(-9), { y: 26, opacity: 0, duration: .6, stagger: .04, ease: 'power3.out' });
  }
  $('#fitSizes').addEventListener('click', e => { const b = e.target.closest('[data-fs]'); if (!b) return; fitS = b.dataset.fs; $$('#fitSizes .sz').forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); }); renderFit(); });
  $('#fitCats').addEventListener('click', e => { const b = e.target.closest('[data-fc]'); if (!b) return; fitC = b.dataset.fc; renderFit(); });
  $$('[data-fit-g]').forEach(b => b.addEventListener('click', () => { fitG = b.dataset.fitG; fitS = null; fitC = 'all'; $$('[data-fit-g]').forEach(x => x.classList.toggle('is-on', x === b)); renderFitSizes(); }));
  $('#fitMore').addEventListener('click', () => { fitN += 9; renderFit(true); });
  renderFitSizes();

  /* ---------------- house ---------------- */
  const houseImgs = pick(['dress-151', 'sling-bag-2', 'suits-men', 'palazzo-set-6'], REAL.slice(10, 14));
  $$('[data-house-img]').forEach((im, i) => { const p = houseImgs[i % houseImgs.length]; im.src = img(p.i, 800); im.alt = p.t; });
  function storeStatus() {
    const n = nairobi(), el = $('#thomeStatus');
    const mins = n.h * 60 + n.m, open = n.day !== 'Sun' && mins >= 8 * 60 + 45 && mins < 18 * 60 + 30;
    el.dataset.status = open ? 'open' : 'closed';
    el.textContent = open ? `Open now · until 6:30 pm` : (n.day === 'Sat' && mins >= 18 * 60 + 30) || n.day === 'Sun' ? 'Closed · opens Mon 8:45 am' : mins < 8 * 60 + 45 ? 'Closed · opens 8:45 am' : 'Closed · opens 8:45 am';
  }
  storeStatus();

  /* ---------------- delivery clock ---------------- */
  function clockTick() {
    const c = cutoff();
    const arc = $('#clockArc'), C = 326.7;
    if (c.same) {
      $('#clockK').textContent = 'Order within';
      $('#clockV').textContent = hm(c.left);
      $('#clockS').textContent = 'for same-day delivery in Nairobi';
      arc.style.strokeDashoffset = C * (1 - Math.min(1, c.left / (13 * 3600 - 8 * 3600)));
    } else {
      $('#clockK').textContent = "Today's same-day window has closed";
      $('#clockV').textContent = c.day === 'Sat' ? 'Monday' : c.day === 'Sun' ? 'Monday' : 'Tomorrow';
      $('#clockS').textContent = 'is your next delivery day · order before 1:00 pm';
      arc.style.strokeDashoffset = 0;
    }
  }
  clockTick();
  setInterval(() => { clockTick(); storeStatus(); }, 30000);

  /* ---------------- join columns ---------------- */
  const joinPool = REAL.filter((p, i) => i % 3 === 0).slice(0, 18);
  $$('.join__col').forEach((col, ci) => { col.innerHTML = joinPool.slice(ci * 6, ci * 6 + 6).map(p => `<img src="${img(p.i, 420)}" alt="" loading="lazy">`).join(''); });

  renderBag();

  /* ---------------- headings: split words ---------------- */
  $$('.split').forEach(h => {
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w'; const i = document.createElement('span'); i.textContent = t; w.appendChild(i); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName === 'EM') walk(n);
    });
    walk(h);
  });
  // manifesto words
  const man = $('#manifesto');
  man.innerHTML = man.textContent.trim().split(/\s+/).map((w, i) => `<span class="mw${i >= 5 && i <= 7 ? ' em' : ''}">${w}</span>`).join(' ');

  /* ---------------- motion ---------------- */
  const intro = $('#intro');
  let seen = false;
  try { seen = sessionStorage.getItem('ca-intro') === '1'; } catch (e) {}
  function endIntro() { intro.style.display = 'none'; document.body.classList.remove('is-loading'); }

  if (!hasGsap || reduce) {
    endIntro(); showHero(0);
    // reduced motion: light up manifesto fully
    $$('.mw').forEach(w => w.classList.add('is-lit'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function heroIn() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero__title .w > span', { yPercent: 115, duration: 1.2, stagger: .08 })
      .from('.hero__kicker', { opacity: 0, y: 14, duration: .8 }, 0.1)
      .from('#heroArch', { clipPath: 'inset(100% 0% 0% 0% round 1000px 1000px 14px 14px)', duration: 1.4, ease: 'expo.out' }, 0)
      .from(['.hero__sub', '.hero__ctas', '.hero__proof'], { opacity: 0, y: 24, duration: 1, stagger: .1 }, .45)
      .from('.arch--mini', { opacity: 0, scale: .7, y: 40, duration: 1.1, stagger: .12, ease: 'back.out(1.4)' }, .6)
      .from('.hero__ring', { opacity: 0, scale: .6, duration: 1.2 }, .7)
      .from('.hero__tag', { opacity: 0, y: 20, duration: .8 }, 1);
    showHero(0);
  }

  if (seen) { endIntro(); heroIn(); }
  else {
    try { sessionStorage.setItem('ca-intro', '1'); } catch (e) {}
    const tl = gsap.timeline({ onComplete: () => { endIntro(); } });
    tl.to('.intro__arch path', { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' })
      .to('.intro__word span', { y: 0, duration: .8, stagger: .04, ease: 'power4.out' }, .2)
      .to('.intro__tag', { opacity: 1, duration: .5 }, .7)
      .to('.intro__core', { opacity: 0, y: -20, duration: .5, ease: 'power2.in' }, 1.45)
      .to('.intro__door--l', { xPercent: -100, duration: 1, ease: 'expo.inOut' }, 1.6)
      .to('.intro__door--r', { xPercent: 100, duration: 1, ease: 'expo.inOut' }, 1.6)
      .add(heroIn, 1.95);
    intro.addEventListener('click', () => tl.progress(1));
  }

  // hero parallax + tilt
  gsap.to('.arch--a', { yPercent: -40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.arch--b', { yPercent: 50, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('#heroArch', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  if (matchMedia('(hover:hover)').matches) {
    const st = $('#heroStage');
    st.addEventListener('mousemove', e => {
      const r = st.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      gsap.to('.arch--a', { x: x * -22, y: y * -14, duration: 1, ease: 'power3.out' });
      gsap.to('.arch--b', { x: x * 26, y: y * 18, duration: 1, ease: 'power3.out' });
      gsap.to('.hero__tag', { x: x * 14, y: y * 10, duration: 1, ease: 'power3.out' });
    });
    // magnetic buttons
    $$('.magnetic').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .3, duration: .5, ease: 'power3.out' }); });
      b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' }));
    });
  }

  // ticker: constant drift, scroll velocity adds speed
  const track = $('.ticker__track');
  let tx = 0, boost = 0;
  gsap.ticker.add(() => {
    const half = track.scrollWidth / 2;
    tx -= .6 + boost; boost *= .92;
    if (tx <= -half) tx += half;
    track.style.transform = `translate3d(${tx}px,0,0)`;
  });
  ScrollTrigger.create({ onUpdate: s => { boost = Math.min(14, Math.abs(s.getVelocity()) / 260); } });

  // headings rise from mask
  $$('.split').forEach(h => {
    gsap.from($$('.w > span', h), { yPercent: 110, duration: 1.1, stagger: .06, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 86%' } });
  });
  $$('.sec__lede, .kicker:not(.hero__kicker)').forEach(el => gsap.from(el, { opacity: 0, y: 18, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));

  // wings view
  gsap.from('#roomView', { clipPath: 'inset(100% 0% 0% 0% round 1000px 1000px 14px 14px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '#wings', start: 'top 60%' } });
  gsap.from('.switch', { opacity: 0, y: 20, duration: .8, scrollTrigger: { trigger: '.switch', start: 'top 90%' } });

  // product media reveal (batched)
  ScrollTrigger.batch('#picksGrid .card', {
    start: 'top 88%', once: true,
    onEnter: els => {
      gsap.from(els.map(e => $('.card__frame', e)), { clipPath: 'inset(100% 0% 0% 0% round 220px 220px 14px 14px)', duration: 1.2, stagger: .1, ease: 'expo.out' });
      gsap.from(els.map(e => $('.card__media img', e)), { scale: 1.3, duration: 1.6, stagger: .1, ease: 'expo.out' });
      gsap.from(els.map(e => $('.card__body', e)), { opacity: 0, y: 16, duration: .8, stagger: .1, delay: .3 });
    },
  });
  gsap.from('#newRail', { x: 80, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '#newRail', start: 'top 85%' } });

  // manifesto: words light up as you read
  const mws = $$('.mw');
  ScrollTrigger.create({
    trigger: '#manifesto', start: 'top 78%', end: 'bottom 45%', scrub: true,
    onUpdate: s => { const n = Math.round(s.progress * mws.length); mws.forEach((w, i) => w.classList.toggle('is-lit', i < n)); },
  });
  gsap.from('.pillar', { y: 50, opacity: 0, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.pillars', start: 'top 82%' } });

  // fitting form
  gsap.from('.fit-form', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.fit-form', start: 'top 88%' } });

  // house: pinned horizontal story on desktop
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const trackH = $('#houseTrack'), right = $('.house__right');
    const dist = () => Math.max(0, trackH.scrollWidth - right.clientWidth);
    const steps = $$('#houseSteps li');
    const tw = gsap.to(trackH, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '#housePin', start: 'top top', end: () => '+=' + (dist() + innerHeight * .4), pin: true, scrub: .8, invalidateOnRefresh: true,
        onUpdate: s => {
          const i = Math.min(steps.length - 1, Math.floor(s.progress * steps.length * .999));
          steps.forEach((li, j) => li.classList.toggle('is-on', j === i));
          gsap.set('#houseBar', { scaleX: .25 + s.progress * .75 });
        },
      },
    });
    $$('.hcard__img img').forEach(im => gsap.fromTo(im, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: im, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } }));
    return () => {};
  });
  gsap.from('.store', { y: 50, opacity: 0, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.visit__cards', start: 'top 85%' } });

  // delivery
  gsap.from('.way', { y: 60, opacity: 0, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.ways', start: 'top 85%' } });
  gsap.from('.clock', { scale: .85, opacity: 0, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.clock', start: 'top 88%' } });

  // next rooms
  gsap.from('.next', { y: 40, opacity: 0, rotate: (i) => (i % 2 ? 1.5 : -1.5), duration: 1, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.next-grid', start: 'top 85%' } });

  // join: columns slide at different speeds
  $$('.join__col').forEach(col => gsap.fromTo(col, { yPercent: -12 * +col.dataset.speed }, { yPercent: 12 * +col.dataset.speed, ease: 'none', scrollTrigger: { trigger: '.join', start: 'top bottom', end: 'bottom top', scrub: true } }));
  gsap.from('.join__card', { y: 80, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.join', start: 'top 60%' } });

  // footer wordmark: letters settle into place
  gsap.from('#footMark span', { yPercent: 90, rotate: i => (i % 2 ? 8 : -8), opacity: 0, stagger: .04, ease: 'power3.out', scrollTrigger: { trigger: '#footMark', start: 'top 98%', end: 'bottom 92%', scrub: 1 } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
