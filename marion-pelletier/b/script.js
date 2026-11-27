/* Maison Pelletier — Design B "Clean Modern" */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const img = (id, w = 700, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=74`;
  const eur = n => { const r = Math.round(n * 100) / 100; return '€' + (r % 1 ? r.toFixed(2).replace('.', ',') : r); };
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } }
  };
  const sget = k => { try { return sessionStorage.getItem(k); } catch { return null; } };
  const sset = (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* ignore */ } };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduced;
  const mobile = () => innerWidth <= 700;

  /* ---------- Catalogue (placeholder data) ---------- */
  const P = {
    p1: { name: 'Grès Stoneware Cups', meta: 'Set of 4 · Limoges', price: 48, rating: 4.9, reviews: 412, img: '1610701596007-11502861dcfa', alt: '1610701596061-2ecf227e85b2', badge: 'Bestseller', swatches: [['Sand', '#D9C6A8'], ['Chalk', '#F1ECE3'], ['Charcoal', '#4A4642']], desc: 'Wheel-thrown stoneware with a raw clay foot and a soft satin glaze. Each cup holds 220 ml.' },
    p2: { name: 'Ambre & Figue Candle', meta: '220 g · 50 h burn', price: 36, rating: 4.8, reviews: 639, img: '1572726729207-a78d6feb18d7', alt: '1603006905003-be475563bc59', badge: 'Bestseller', desc: 'Hand-poured in Provence from rapeseed and soy wax — amber, fig leaf and cedar. Reusable amber glass.' },
    p3: { name: 'Washed Linen Bedding', meta: 'Duvet + 2 pillowcases', price: 189, was: 219, rating: 4.9, reviews: 287, img: '1595526114035-0d45ed16cfbf', alt: '1505693416388-ac5ce068fe85', swatches: [['Flax', '#CDBFA8'], ['White', '#F4F1EA'], ['Sage', '#A3AE93']], desc: 'European flax woven in the Vosges and stone-washed for lived-in softness from the first night.' },
    p4: { name: 'Céleste Vase', meta: 'H 28 cm · Matte glaze', price: 64, rating: 4.7, reviews: 198, img: '1612196808214-b8e1d6145a8c', alt: '1565193566173-7a0ee3dbe261', badge: 'New', desc: 'A generous, rounded vase thrown by hand in Limoges. Watertight inside, chalky matte outside.' },
    p5: { name: 'Bleu Atlantique Plates', meta: 'Set of 4 · Ø 26 cm', price: 72, rating: 4.8, reviews: 156, img: '1578749556568-bc2c40e68b61', alt: '1610701596061-2ecf227e85b2', desc: 'Reactive-glaze dinner plates inspired by the Breton coast. Dishwasher and microwave safe.' },
    p6: { name: 'Ocre Lounge Chair', meta: 'Oak frame · Bouclé', price: 690, rating: 4.9, reviews: 74, img: '1616627547584-bf28cee262db', alt: '1586023492125-27b2c045efd7', stock: 3, desc: 'A deep, tufted lounge chair in ochre bouclé on a solid French oak frame. Made to order in Burgundy.' },
    p7: { name: 'Matin Porcelain Mug', meta: '330 ml · Limoges', price: 22, rating: 4.8, reviews: 521, img: '1514228742587-6b1558fcca3d', alt: '1610701596007-11502861dcfa', desc: 'A thin-walled porcelain mug with a generous handle. Dishwasher safe.' },
    p8: { name: 'Duo Bud Vases', meta: 'Set of 2 · Oak tray', price: 39, rating: 4.7, reviews: 142, img: '1490312278390-ab64016e0aa9', alt: '1612196808214-b8e1d6145a8c', badge: 'New', desc: 'Two slender porcelain bud vases on a hand-turned oak tray.' },
    p9: { name: 'Trio Pillar Candles', meta: 'Set of 3 · Unscented', price: 29, rating: 4.8, reviews: 233, img: '1602523961358-f9f03dd557db', alt: '1602874801007-bd458bb1b8b6', desc: 'Dripless pillar candles in natural ivory wax. 40 hours each.' },
    p10: { name: 'Bois Room Oil', meta: '50 ml · Cedar & smoke', price: 26, rating: 4.7, reviews: 118, img: '1608571423902-eed4a5ad8108', alt: '1612817288484-6f916006741a', badge: 'New', desc: 'A few drops on a ceramic diffuser or linen. Cedar, birch smoke and vetiver.' },
    p11: { name: 'Petit Planter', meta: 'Ø 18 cm · Glazed', price: 34, rating: 4.6, reviews: 87, img: '1603204077779-bed963ea7d0e', alt: '1530018607912-eff2daa1bac4', badge: 'New', desc: 'A shallow glazed planter with drainage hole and saucer.' },
    p12: { name: 'Feather Cushion Insert', meta: '50 × 50 cm', price: 45, rating: 4.8, reviews: 301, img: '1584100936595-c0654b55a2e2', alt: '1595526114035-0d45ed16cfbf', desc: 'Responsibly sourced duck-feather insert with a cotton cover.' },
    p13: { name: 'Lune Wool Rug', meta: '170 × 240 cm', price: 249, rating: 4.8, reviews: 64, img: '1600166898405-da9535204843', alt: '1618220179428-22790b461013', desc: 'Hand-loomed wool and jute rug with a subtle border.' },
    p14: { name: 'Oak Serving Board', meta: '45 × 20 cm', price: 42, rating: 4.9, reviews: 176, img: '1610701596061-2ecf227e85b2', alt: '1610701596007-11502861dcfa', desc: 'Solid French oak, oiled by hand. For bread, cheese and long lunches.' },
    g1: { name: 'The Slow Morning Set', meta: '4 cups · 2 mugs · wrapped', price: 79, was: 92, rating: 4.9, reviews: 96, img: '1610701596007-11502861dcfa', alt: '1514228742587-6b1558fcca3d', desc: 'Grès cups and two Matin mugs, wrapped in recycled paper with a handwritten card.' },
    g2: { name: 'The Candlelit Evening', meta: 'Candle · pillars · room oil', price: 78, was: 91, rating: 4.9, reviews: 132, img: '1603006905003-be475563bc59', alt: '1602523961358-f9f03dd557db', desc: 'Ambre & Figue candle, trio of pillar candles and Bois room oil.' },
    g3: { name: 'The Bloom Duo', meta: 'Céleste vase · bud vases', price: 89, was: 103, rating: 4.8, reviews: 58, img: '1565193566173-7a0ee3dbe261', alt: '1612196808214-b8e1d6145a8c', desc: 'The Céleste vase and Duo bud vases — for big branches and single stems.' },
    gift: { name: 'Mini Ambre Candle', meta: 'Reward · 80 g', price: 0, img: '1603006905003-be475563bc59' }
  };
  const TABS = { best: ['p1', 'p2', 'p3', 'p6', 'p5', 'p7', 'p4', 'p8', 'p14'], new: ['p4', 'p8', 'p10', 'p11', 'p13', 'p1', 'p3', 'p2'], gifts: ['p2', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p14'] };
  const PAIRS = { p1: ['p14', 'p7', 'p5'], p2: ['p9', 'p10', 'p8'], p3: ['p12', 'p2', 'p13'], p4: ['p8', 'p2', 'p11'], p5: ['p1', 'p14', 'p7'], p6: ['p13', 'p12', 'p4'], p7: ['p1', 'p14', 'p2'], p8: ['p4', 'p11', 'p2'], p9: ['p2', 'p10'], p10: ['p2', 'p9'], p11: ['p8', 'p4'], p12: ['p3', 'p2'], p13: ['p6', 'p12'], p14: ['p1', 'p5'], g1: ['p14', 'p2'], g2: ['p8', 'p7'], g3: ['p11', 'p2'] };
  const CATS = [['Ceramics', 48, '1610701596007-11502861dcfa', 'best'], ['Candles', 21, '1572726729207-a78d6feb18d7', 'gifts'], ['Linen', 34, '1595526114035-0d45ed16cfbf', 'best'], ['Vases & décor', 39, '1612196808214-b8e1d6145a8c', 'new'], ['Furniture', 16, '1616627547584-bf28cee262db', 'best'], ['Bath & body', 27, '1612817288484-6f916006741a', 'new']];
  const TIERS = [80, 120, 150];
  const stars = n => `<span class="stars" aria-label="${n} out of 5 stars">${'<svg><use href="#i-star"/></svg>'.repeat(5)}</span>`;

  /* ---------- Lenis + anchors ---------- */
  let lenis = null;
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ duration: 1.1, easing: t => 1 - Math.pow(1 - t, 4) });
    if (hasGsap) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  let locks = 0;
  const lock = on => { locks = Math.max(0, locks + (on ? 1 : -1)); if (lenis) locks ? lenis.stop() : lenis.start(); document.documentElement.style.overflow = locks ? 'hidden' : ''; };
  const goTo = el => { if (!el) return; if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.3 }); else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const href = a.getAttribute('href'); if (href.length < 2) return; const t = $(href); if (!t) return;
    e.preventDefault(); if (a.dataset.tab) setTab(a.dataset.tab);
    if (a.closest('#menu')) { setMenu(false); setTimeout(() => goTo(t), 350); } else goTo(t);
    setDrop(false);
  });

  /* ---------- Toast ---------- */
  const toastEl = $('#toast'); let toastT;
  const toast = msg => { toastEl.innerHTML = `<svg><use href="#i-check"/></svg>${msg}`; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2600); };

  /* ---------- Topbar rotator ---------- */
  const rot = $$('#rot p'); let ri = 0;
  setInterval(() => { const c = rot[ri]; c.classList.remove('is-on'); c.classList.add('is-out'); setTimeout(() => c.classList.remove('is-out'), 650); ri = (ri + 1) % rot.length; rot[ri].classList.add('is-on'); }, 4200);

  /* ---------- Header / dock ---------- */
  const header = $('#header'); let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 30);
    if (y > 500 && y > lastY + 2 && !$('.has-drop').classList.contains('is-open')) header.classList.add('is-hidden');
    if (y < lastY - 2) header.classList.remove('is-hidden');
    lastY = y;
    const on = y > innerHeight * .85; $('#dock').classList.toggle('is-on', on); document.body.classList.toggle('dock-on', on);
  }, { passive: true });

  /* ---------- Dropdown + sheet ---------- */
  const catLinks = c => `<a href="#shop" data-tab="${c[3]}"><img src="${img(c[2], 120, 120)}" alt="" loading="lazy"><span><b>${c[0]}</b><small>${c[1]} pieces</small></span></a>`;
  $('#dropCats').innerHTML = CATS.map(catLinks).join('');
  $('#sheetCats').innerHTML = CATS.map(c => `<a href="#shop" data-tab="${c[3]}" data-close-menu><img src="${img(c[2], 200, 200)}" alt="" loading="lazy">${c[0]}</a>`).join('');
  const drop = $('.has-drop'), dropBtn = $('.has-drop > button'); let dT;
  function setDrop(on) { drop.classList.toggle('is-open', on); dropBtn.setAttribute('aria-expanded', on); }
  drop.addEventListener('mouseenter', () => { clearTimeout(dT); setDrop(true); });
  drop.addEventListener('mouseleave', () => { dT = setTimeout(() => setDrop(false), 160); });
  dropBtn.addEventListener('click', () => setDrop(!drop.classList.contains('is-open')));
  const menu = $('#menu');
  function setMenu(on) { if (menu.classList.contains('is-open') === on) return; menu.classList.toggle('is-open', on); menu.setAttribute('aria-hidden', !on); $('#menuBtn').setAttribute('aria-expanded', on); lock(on); }
  $('#menuBtn').addEventListener('click', () => setMenu(true));
  menu.addEventListener('click', e => { if (e.target === menu || (e.target.closest('[data-close-menu]') && !e.target.closest('a'))) setMenu(false); });

  /* ---------- Hero slideshow ---------- */
  const SLIDES = [
    { img: '1583847268964-b28dc8f51f92', label: 'New season', kicker: 'Collection Hiver 2026', title: 'Live slowly.<br>Live <i>beautifully.</i>', sub: 'Handmade ceramics, linen and candles from 32 French ateliers — delivered in 2–4 days.', cta: ['Shop bestsellers', '#shop'], pid: 'p3' },
    { img: '1610701596061-2ecf227e85b2', label: 'Ceramics', kicker: 'Thrown by hand in Limoges', title: 'Made by hand.<br>Made to <i>last.</i>', sub: 'Stoneware and porcelain for slow breakfasts and long lunches. Every piece one of a kind.', cta: ['Shop ceramics', '#shop'], pid: 'p1' },
    { img: '1602874801007-bd458bb1b8b6', label: 'Gift Edit', kicker: 'Order by 18 Dec for Christmas', title: 'Gifts they\'ll<br><i>keep</i> for years.', sub: 'Ready-made sets, wrapped by hand with a handwritten card — free this season.', cta: ['Shop the Gift Edit', '#gifts'], pid: 'g2' }
  ];
  const DUR = 6500; let si = -1, sT;
  $('#heroSlides').innerHTML = SLIDES.map((s, i) => `<div class="slide" data-i="${i}"><img src="${img(s.img, 2000)}" alt="" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></div>`).join('');
  $('#heroNav').innerHTML = SLIDES.map((s, i) => `<button data-s="${i}" style="--dur:${DUR}ms"><b>0${i + 1}</b>${s.label}<i class="bar"></i></button>`).join('');
  const splitWords = html => html.split(/(<br>)/).map(part => part === '<br>' ? part : part.replace(/(<i>.*?<\/i>|[^\s<]+)/g, '<span class="w">$1</span>')).join('');
  function buyCard(id) {
    const p = P[id];
    return `<div class="buycard__top"><img src="${img(p.img, 200, 200)}" alt=""><div><small>${p.badge || (id[0] === 'g' ? 'Gift set' : p.was ? 'Winter price' : 'Featured')} · ★ ${p.rating} (${p.reviews})</small><b>${p.name}</b><span>${eur(p.price)}${p.was ? `<s>${eur(p.was)}</s>` : ''}</span></div></div>
      <button class="btn btn--dark btn--block" data-add="${id}"><span>Add to bag</span><svg><use href="#i-plus"/></svg></button>
      <div class="buycard__meta"><span><svg><use href="#i-truck"/></svg>Ships in 24 h</span><span><svg><use href="#i-return"/></svg>Free returns</span></div>`;
  }
  function showSlide(i, first) {
    i = (i + SLIDES.length) % SLIDES.length; if (i === si) return;
    const prev = si; si = i; const s = SLIDES[i];
    $$('.slide').forEach((el, j) => { el.classList.toggle('is-on', j === i); el.classList.toggle('is-prev', j === prev); });
    $$('#heroNav button').forEach((b, j) => { b.classList.toggle('is-on', j === i); b.classList.toggle('is-done', j < i); const bar = $('i.bar', b); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; });
    $('#heroKicker').textContent = s.kicker;
    $('#heroTitle').innerHTML = splitWords(s.title);
    $('#heroSub').textContent = s.sub;
    const cta = $('#heroCta'); cta.setAttribute('href', s.cta[1]); $('span', cta).textContent = s.cta[0];
    $('#buyCard').innerHTML = buyCard(s.pid);
    if (hasGsap) {
      gsap.fromTo('#heroTitle .w', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .9, stagger: .05, ease: 'power3.out', delay: first ? .2 : .35 });
      gsap.fromTo('#heroSub, .chip-label', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'power3.out', delay: first ? .45 : .5 });
      gsap.fromTo('#buyCard', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'power3.out', delay: first ? .7 : .45 });
    }
    clearTimeout(sT); if (!reduced) sT = setTimeout(() => showSlide(si + 1), DUR);
  }
  $('#heroNav').addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (b) showSlide(+b.dataset.s); });
  // swipe on touch
  let tx = 0; const hf = $('#hero');
  hf.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  hf.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50 && !e.target.closest('.buycard')) showSlide(si + (dx < 0 ? 1 : -1)); });
  showSlide(0, true);

  /* ---------- Bento ---------- */
  $('#bento').innerHTML = CATS.map((c, i) => `<a class="tile" href="#shop" data-tab="${c[3]}"><img src="${img(c[2], i ? 800 : 1200, i ? 600 : 1000)}" alt="" loading="lazy">${i === 0 ? '<span class="tile__big">Thrown, glazed<br>&amp; fired <i>by hand.</i></span>' : ''}<span class="tile__label"><b>${c[0]}</b><small>${c[1]}</small><span class="round"><svg><use href="#i-arrow"/></svg></span></span></a>`).join('');

  /* ---------- Rail ---------- */
  const wish = new Set(store.get('mp_wish', []));
  function cardHTML(id) {
    const p = P[id]; const b = [];
    if (p.was) b.push(`<span class="pbadge pbadge--sale">−${Math.round((1 - p.price / p.was) * 100)}%</span>`);
    if (p.badge) b.push(`<span class="pbadge ${p.badge === 'New' ? 'pbadge--new' : ''}">${p.badge}</span>`);
    const sw = p.swatches ? `<div class="psw">${p.swatches.map((s, i) => `<button class="${i ? '' : 'is-on'}" style="background:${s[1]}" aria-label="${s[0]}" data-sw></button>`).join('')}</div>` : '';
    return `<article class="pcard">
      <div class="pcard__media"><div class="pbadges">${b.join('')}</div>
        <button class="pwish ${wish.has(id) ? 'is-on' : ''}" data-wish="${id}" aria-label="Save ${p.name}" aria-pressed="${wish.has(id)}"><svg><use href="#i-heart"/></svg></button>
        <img src="${img(p.img, 620, 775)}" alt="${p.name}" loading="lazy" draggable="false"><img class="alt" src="${img(p.alt, 620, 775)}" alt="" loading="lazy" aria-hidden="true" draggable="false">
        <button class="pqv" data-qv="${id}">Quick view</button>
        <button class="padd" data-add="${id}" aria-label="Add ${p.name} to bag"><svg><use href="#i-plus"/></svg><span>Add · ${eur(p.price)}</span></button>
      </div>
      <div class="pcard__body"><div class="pcard__top"><h3 class="pcard__name"><button data-qv="${id}">${p.name}</button></h3><span class="pcard__price">${p.was ? `<s>${eur(p.was)}</s>` : ''}${eur(p.price)}</span></div>
        <div class="pcard__meta"><span class="r"><svg><use href="#i-star"/></svg>${p.rating} · ${p.reviews} reviews</span>${p.stock ? `<span class="plow">Only ${p.stock} left</span>` : sw}</div></div>
    </article>`;
  }
  const rail = $('#rail');
  function setTab(tab) {
    if (!TABS[tab]) return;
    $$('.filters [role="tab"]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === tab));
    rail.innerHTML = TABS[tab].map(cardHTML).join(''); rail.scrollLeft = 0; railBar();
    if (hasGsap && rail._seen) gsap.from(rail.children, { x: 40, opacity: 0, duration: .7, stagger: .05, ease: 'power3.out', clearProps: 'transform,opacity' });
  }
  $$('.filters [role="tab"]').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));
  function railBar() { const max = rail.scrollWidth - rail.clientWidth, bar = $('#railBar'), w = rail.clientWidth / rail.scrollWidth; bar.style.width = (w * 100) + '%'; bar.style.transform = `translateX(${max > 0 ? (rail.scrollLeft / max) * ((1 / w) - 1) * 100 : 0}%)`; }
  rail.addEventListener('scroll', railBar, { passive: true }); addEventListener('resize', railBar);
  const step = () => (rail.firstElementChild?.offsetWidth || 300) + 16;
  $('#cNext').addEventListener('click', () => rail.scrollBy({ left: step() * 2, behavior: 'smooth' }));
  $('#cPrev').addEventListener('click', () => rail.scrollBy({ left: -step() * 2, behavior: 'smooth' }));
  // drag to scroll (mouse)
  let dragging = false, sx = 0, sl = 0, moved = 0;
  rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.target.closest('button')) return; dragging = true; sx = e.clientX; sl = rail.scrollLeft; moved = 0; });
  addEventListener('pointermove', e => { if (!dragging) return; const dx = e.clientX - sx; moved = Math.abs(dx); if (moved > 5) rail.classList.add('is-drag'); rail.scrollLeft = sl - dx; });
  addEventListener('pointerup', () => { if (!dragging) return; dragging = false; setTimeout(() => rail.classList.remove('is-drag'), 0); });

  /* ---------- Wishlist + swatches ---------- */
  const renderWish = () => { const c = $('#wishCount'); c.textContent = wish.size; c.hidden = !wish.size; };
  document.addEventListener('click', e => {
    const w = e.target.closest('[data-wish]');
    if (w) { const id = w.dataset.wish; wish.has(id) ? wish.delete(id) : wish.add(id); $$(`[data-wish="${id}"]`).forEach(b => { b.classList.toggle('is-on', wish.has(id)); b.setAttribute('aria-pressed', wish.has(id)); }); store.set('mp_wish', [...wish]); renderWish(); toast(wish.has(id) ? `${P[id].name} saved` : 'Removed from wishlist'); return; }
    const s = e.target.closest('[data-sw]');
    if (s) { $$('[data-sw]', s.parentElement).forEach(b => b.classList.toggle('is-on', b === s)); const l = $('#qvColor'); if (l && s.closest('#qv')) l.textContent = s.getAttribute('aria-label'); }
  });

  /* ---------- Spotlight ---------- */
  const SPOT = ['1595526114035-0d45ed16cfbf', '1505693416388-ac5ce068fe85', '1631049307264-da0ec9d70304', '1522771739844-6a9f6d5f14af'];
  $('#spotThumbs').innerHTML = SPOT.map((s, i) => `<button class="${i ? '' : 'is-on'}" data-sp="${s}" aria-label="Image ${i + 1}"><img src="${img(s, 220, 220)}" alt="" loading="lazy"></button>`).join('');
  $('#spotThumbs').addEventListener('click', e => { const b = e.target.closest('[data-sp]'); if (!b) return; const im = $('#spotImg'); im.style.opacity = 0; setTimeout(() => { im.src = img(b.dataset.sp, 1200, 1200); im.onload = () => im.style.opacity = 1; }, 200); $$('#spotThumbs button').forEach(x => x.classList.toggle('is-on', x === b)); });
  $('#spotSw').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('#spotSw button').forEach(x => x.classList.toggle('is-on', x === b)); $('#spotColor').textContent = b.getAttribute('aria-label'); });
  $('#spotSize').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('#spotSize button').forEach(x => x.classList.toggle('is-on', x === b)); });
  $$('[data-sq]').forEach(b => b.addEventListener('click', () => { const q = $('#spotQty'); q.textContent = Math.max(1, +q.textContent + +b.dataset.sq); $('#spotAdd span').textContent = `Add to bag — ${eur(189 * +q.textContent)}`; }));
  $('#spotAdd').addEventListener('click', () => { add('p3', +$('#spotQty').textContent, { variant: `${$('#spotColor').textContent} · ${$('#spotSize .is-on').textContent}` }); openCart(); });

  /* ---------- Cart ---------- */
  let cart = store.get('mp_cartB', []);
  const opts = store.get('mp_optsB', { wrap: false, note: '' });
  const cartEl = $('#cart'), overlay = $('#overlay'); let lastFocus;
  const save = () => { store.set('mp_cartB', cart); store.set('mp_optsB', opts); };
  const subtotal = () => cart.reduce((s, l) => s + l.price * l.qty, 0);
  const savings = () => cart.reduce((s, l) => s + (l.was ? (l.was - l.price) * l.qty : 0), 0);
  const count = () => cart.reduce((s, l) => s + l.qty, 0);
  function add(id, qty = 1, x = {}) {
    const p = P[id]; const variant = x.variant || (p.swatches ? p.swatches[0][0] : ''); const key = [id, variant, x.tag || ''].join('|');
    const ex = cart.find(l => l.key === key);
    if (ex) ex.qty += qty; else cart.push({ key, id, qty, variant, price: x.price ?? p.price, was: x.was ?? p.was, tag: x.tag || '' });
    save(); counts(true);
  }
  function counts(bump) {
    const n = count(); $('#cartCount').textContent = n;
    if (bump) { const b = $('#cartBtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    $('#dockTotal').textContent = n ? `${eur(subtotal())} · ${n}` : 'Bag';
  }
  function openCart() { if (cartEl.classList.contains('is-open')) { renderCart(); return; } lastFocus = document.activeElement; renderCart(); cartEl.classList.add('is-open'); cartEl.setAttribute('aria-hidden', 'false'); overlay.classList.add('is-on'); lock(true); setTimeout(() => $('[data-close-cart]').focus({ preventScroll: true }), 80); }
  function closeCart() { if (!cartEl.classList.contains('is-open')) return; cartEl.classList.remove('is-open'); cartEl.setAttribute('aria-hidden', 'true'); overlay.classList.remove('is-on'); lock(false); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); }
  function eta() {
    const now = new Date(), cut = new Date(now); cut.setHours(14, 0, 0, 0); const wk = d => d.getDay() === 0 || d.getDay() === 6;
    const ship = new Date(now); if (now > cut || wk(now)) { do { ship.setDate(ship.getDate() + 1); } while (wk(ship)); }
    const arr = new Date(ship); let n = 0; while (n < 2) { arr.setDate(arr.getDate() + 1); if (!wk(arr)) n++; }
    const f = d => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    if (now < cut && !wk(now)) { const ms = cut - now; return `Order within <b>${Math.floor(ms / 36e5)}h ${Math.floor(ms % 36e5 / 6e4)}m</b> — arrives <b>${f(arr)}</b>`; }
    return `Order now — arrives by <b>${f(arr)}</b>`;
  }
  $('#spotEta').textContent = (() => { const t = eta().match(/arrives(?: by)? <b>(.*?)<\/b>/); return t ? t[1] : 'in 2–4 days'; })();
  function renderTiers(sub) {
    $('#ladderFill').style.width = Math.min(sub / TIERS[2] * 100, 100) + '%';
    $$('.tier').forEach(t => t.classList.toggle('is-done', sub >= +t.dataset.step));
    const next = TIERS.find(t => sub < t), names = { 80: 'free shipping', 120: 'a free linen tote', 150: 'a free mini candle' };
    $('#ladderMsg').innerHTML = next ? `Add <b>${eur(next - sub)}</b> to unlock <b>${names[next]}</b>` : '<b>All rewards unlocked</b> — enjoy!';
  }
  function upsells() { const inC = new Set(cart.map(l => l.id)), pool = []; cart.forEach(l => (PAIRS[l.id] || []).forEach(x => { if (!inC.has(x) && !pool.includes(x)) pool.push(x); })); ['p9', 'p10', 'p7', 'p2', 'p12', 'p14'].forEach(x => { if (!inC.has(x) && !pool.includes(x)) pool.push(x); }); return pool.slice(0, 3); }
  const upHTML = id => `<div class="up"><img src="${img(P[id].img, 120, 120)}" alt=""><div><b>${P[id].name}</b><small>${eur(P[id].price)} · ★ ${P[id].rating}</small></div><button data-up="${id}" aria-label="Add ${P[id].name}">+ Add</button></div>`;
  function renderCart() {
    const sub = subtotal(), n = count(), body = $('#cartBody'), foot = $('#cartFoot');
    $('#cartHeadCount').textContent = n; renderTiers(sub); $('#ladder').hidden = !n;
    if (!n) {
      body.innerHTML = `<div class="empty"><div class="empty__icon"><svg><use href="#i-bag"/></svg></div><h3>Your bag is empty</h3><p>Start with a bestseller — loved in 40,000+ homes.</p><div class="empty__chips"><a href="#shop" data-close-cart>Bestsellers</a><a href="#gifts" data-close-cart>Gift Edit</a><a href="#bundle" data-close-cart>Build a box</a></div></div><div class="ups"><div class="ups__head"><p>Most loved right now</p></div><div class="ups__list">${['p2', 'p1', 'p7'].map(upHTML).join('')}</div></div>`;
      foot.innerHTML = `<div class="cart__trust"><span><svg><use href="#i-truck"/></svg>Free shipping €80+</span><span><svg><use href="#i-return"/></svg>30-day returns</span></div>`; return;
    }
    const lines = cart.map(l => { const p = P[l.id]; return `<div class="line" data-key="${l.key}"><img src="${img(p.img, 200, 240)}" alt="${p.name}"><div><p class="line__name">${p.name}</p><p class="line__var">${l.variant ? l.variant + ' · ' : ''}${p.meta}${l.tag ? ` · <b>${l.tag}</b>` : ''}</p><div class="qty"><button data-q="-1" aria-label="Decrease"><svg><use href="#i-minus"/></svg></button><span>${l.qty}</span><button data-q="1" aria-label="Increase"><svg><use href="#i-plus"/></svg></button></div></div><div class="line__right"><button class="line__rm" data-rm aria-label="Remove ${p.name}"><svg><use href="#i-close"/></svg></button><div class="line__price">${eur(l.price * l.qty)}${l.was ? `<s>${eur(l.was * l.qty)}</s>` : ''}</div></div></div>`; }).join('');
    const rewards = (sub >= 120 ? `<div class="line line--free"><img src="${img('1584100936595-c0654b55a2e2', 200, 240)}" alt=""><div><p class="line__name">Linen tote</p><p class="line__var">Reward</p></div><div class="line__right"><span></span><div class="line__price">Free</div></div></div>` : '') + (sub >= 150 ? `<div class="line line--free"><img src="${img(P.gift.img, 200, 240)}" alt=""><div><p class="line__name">${P.gift.name}</p><p class="line__var">Reward</p></div><div class="line__right"><span></span><div class="line__price">Free</div></div></div>` : '');
    const ups = upsells();
    body.innerHTML = lines + rewards + (ups.length ? `<div class="ups"><div class="ups__head"><p>Pairs well with</p><span>Picked for your bag</span></div><div class="ups__list">${ups.map(upHTML).join('')}</div></div>` : '') +
      `<label class="toggle"><input type="checkbox" id="wrapT" ${opts.wrap ? 'checked' : ''}><span><b>Gift wrap + handwritten card</b><small>Recycled paper · no prices on the slip</small></span><em>FREE</em></label>${opts.wrap ? `<textarea class="gift-note" id="giftNote" placeholder="Your message — we'll write it by hand" maxlength="200">${opts.note.replace(/</g, '&lt;')}</textarea>` : ''}<div class="eta"><svg><use href="#i-truck"/></svg><span>${eta()}</span></div>`;
    const sv = savings(), ship = sub >= 80 ? 0 : 5.9, tot = sub + ship;
    foot.innerHTML = `<div class="sum__row"><span>Subtotal ${eur(sub + sv)} · Shipping ${ship ? eur(ship) : '<b style="color:var(--moss-2)">Free</b>'}</span>${sv ? `<span class="save">−${eur(sv)}</span>` : ''}</div><div class="sum__tot"><span>Total</span><span>${eur(tot)}</span></div><p class="kl sum__kl">or 3 × ${eur(tot / 3)} with <b>Klarna</b></p>
      <button class="btn btn--dark btn--block" id="checkout"><svg><use href="#i-lock"/></svg><span>Checkout securely</span></button>
      <div class="express"><button class="ap" data-express>Apple Pay</button><button class="pp" data-express>PayPal</button><button data-express>G Pay</button></div>
      <div class="cart__trust"><span><svg><use href="#i-lock"/></svg>Encrypted checkout</span><span><svg><use href="#i-return"/></svg>30-day free returns</span></div>`;
  }
  cartEl.addEventListener('click', e => {
    const line = e.target.closest('.line[data-key]'), q = e.target.closest('[data-q]');
    if (q && line) { const l = cart.find(x => x.key === line.dataset.key); l.qty += +q.dataset.q; if (l.qty < 1) cart = cart.filter(x => x !== l); save(); counts(); renderCart(); return; }
    if (e.target.closest('[data-rm]') && line) { cart = cart.filter(x => x.key !== line.dataset.key); save(); counts(); renderCart(); return; }
    const up = e.target.closest('[data-up]'); if (up) { add(up.dataset.up); renderCart(); toast(`${P[up.dataset.up].name} added`); return; }
    if (e.target.closest('#checkout, [data-express]')) { toast('Demo — checkout connects to Shopify / Stripe in the build'); return; }
    if (e.target.closest('[data-close-cart]')) closeCart();
  });
  cartEl.addEventListener('change', e => { if (e.target.id === 'wrapT') { opts.wrap = e.target.checked; save(); renderCart(); } });
  cartEl.addEventListener('input', e => { if (e.target.id === 'giftNote') { opts.note = e.target.value; save(); } });
  overlay.addEventListener('click', closeCart);
  $('#cartBtn').addEventListener('click', openCart);
  $$('[data-open-cart]').forEach(b => b.addEventListener('click', openCart));
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]'); if (!a || a.closest('#qv')) return;
    const card = a.closest('.pcard'); const on = card && $('[data-sw].is-on', card);
    add(a.dataset.add, 1, { variant: on ? on.getAttribute('aria-label') : undefined }); openCart();
  });

  /* ---------- Quick view ---------- */
  const qv = $('#qv');
  function openQV(id) {
    const p = P[id]; if (!p) return; lastFocus = document.activeElement;
    const sw = p.swatches ? `<div><p class="opt__label">Colour: <b id="qvColor">${p.swatches[0][0]}</b></p><div class="opt__sw">${p.swatches.map((s, i) => `<button class="${i ? '' : 'is-on'}" style="--c:${s[1]}" aria-label="${s[0]}" data-sw></button>`).join('')}</div></div>` : '';
    $('#qvBody').innerHTML = `<div class="qv__media"><div class="qv__main"><img id="qvMain" src="${img(p.img, 900, 1125)}" alt="${p.name}"></div><div class="qv__thumbs"><button class="is-on" data-th="${p.img}" aria-label="Image 1"><img src="${img(p.img, 140, 140)}" alt=""></button><button data-th="${p.alt}" aria-label="Image 2"><img src="${img(p.alt, 140, 140)}" alt=""></button></div></div>
      <div class="qv__info"><div class="qv__rating">${stars(p.rating)} ${p.rating} · ${p.reviews} reviews</div><h3 id="qvTitle">${p.name}</h3><div class="qv__price">${eur(p.price)}${p.was ? `<s>${eur(p.was)}</s>` : ''}</div>${p.price >= 30 ? `<p class="kl">or 3 × ${eur(p.price / 3)} with <b>Klarna</b></p>` : ''}<p>${p.desc}</p>${sw}${p.stock ? `<p class="stockline"><span class="pulse pulse--warm"></span>Only ${p.stock} left</p>` : ''}
      <div class="qv__buy"><div class="qty"><button data-qq="-1" aria-label="Decrease"><svg><use href="#i-minus"/></svg></button><span id="qvQty">1</span><button data-qq="1" aria-label="Increase"><svg><use href="#i-plus"/></svg></button></div><button class="btn btn--dark" id="qvAdd" data-id="${id}"><span>Add to bag</span></button></div>
      <ul class="perks"><li><svg><use href="#i-truck"/></svg><span><b>Free shipping</b> over €80 · ships in 24 h</span></li><li><svg><use href="#i-return"/></svg><span><b>30-day</b> free returns</span></li><li><svg><use href="#i-hand"/></svg><span><b>Handmade</b> in France</span></li></ul></div>`;
    qv.classList.add('is-open'); qv.setAttribute('aria-hidden', 'false'); lock(true); setTimeout(() => $('[data-close-qv]').focus({ preventScroll: true }), 80);
  }
  function closeQV() { if (!qv.classList.contains('is-open')) return; qv.classList.remove('is-open'); qv.setAttribute('aria-hidden', 'true'); lock(false); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); }
  document.addEventListener('click', e => { const b = e.target.closest('[data-qv]'); if (b && !rail.classList.contains('is-drag')) openQV(b.dataset.qv); });
  qv.addEventListener('click', e => {
    if (e.target === qv || e.target.closest('[data-close-qv]')) return closeQV();
    const th = e.target.closest('[data-th]'); if (th) { $('#qvMain').src = img(th.dataset.th, 900, 1125); $$('[data-th]', qv).forEach(b => b.classList.toggle('is-on', b === th)); }
    const qq = e.target.closest('[data-qq]'); if (qq) { const s = $('#qvQty'); s.textContent = Math.max(1, +s.textContent + +qq.dataset.qq); }
    const ab = e.target.closest('#qvAdd'); if (ab) { const on = $('[data-sw].is-on', qv); add(ab.dataset.id, +$('#qvQty').textContent, { variant: on ? on.getAttribute('aria-label') : undefined }); closeQV(); openCart(); }
  });

  /* ---------- Search palette ---------- */
  const search = $('#search'), sIn = $('#searchInput');
  function renderSearch(q) {
    q = q.trim().toLowerCase();
    const ids = Object.keys(P).filter(k => k !== 'gift' && (!q || (P[k].name + ' ' + P[k].meta + ' ' + P[k].desc).toLowerCase().includes(q)));
    $('#searchResults').innerHTML = ids.length ? ids.slice(0, 7).map(id => `<button class="sres" data-qv="${id}"><img src="${img(P[id].img, 100, 100)}" alt=""><span><b>${P[id].name}</b><small>${P[id].meta}</small></span><span>${eur(P[id].price)}</span></button>`).join('') : `<p class="search__empty">No results for “${q.replace(/</g, '&lt;')}”. Try “candle” or “linen”.</p>`;
  }
  const openSearch = () => { if (search.classList.contains('is-open')) return; search.classList.add('is-open'); search.setAttribute('aria-hidden', 'false'); renderSearch(''); lock(true); setTimeout(() => sIn.focus(), 60); };
  const closeSearch = () => { if (!search.classList.contains('is-open')) return; search.classList.remove('is-open'); search.setAttribute('aria-hidden', 'true'); lock(false); };
  $('#searchBtn').addEventListener('click', openSearch);
  sIn.addEventListener('input', () => renderSearch(sIn.value));
  search.addEventListener('click', e => { if (e.target === search || e.target.closest('[data-qv]')) closeSearch(); const c = e.target.closest('.palette__chips button'); if (c) { sIn.value = c.textContent; renderSearch(c.textContent); } });

  /* ---------- Shop the room ---------- */
  const ROOMS = [
    { name: 'Living room', img: '1618220179428-22790b461013', items: [['p6', 72, 72], ['p4', 33, 58, 1], ['p13', 56, 88], ['p11', 9, 42, 1]] },
    { name: 'Bedroom', img: '1505693416388-ac5ce068fe85', items: [['p3', 48, 66], ['p12', 36, 48, 1], ['p9', 86, 40, 1]] },
    { name: 'Dining', img: '1617806118233-18e1de247200', items: [['p5', 50, 66], ['p4', 76, 42, 1], ['p8', 26, 55, 1]] }
  ];
  let room = 0;
  $('#roomTabs').innerHTML = ROOMS.map((r, i) => `<button role="tab" aria-selected="${!i}" data-room="${i}">${r.name}</button>`).join('');
  $('#lookStage').innerHTML = ROOMS.map((r, i) => `<div class="look__img" data-r="${i}"><img src="${img(r.img, 1500, 1030)}" alt="${r.name} styled with Maison Pelletier pieces" loading="lazy">${r.items.map((it, j) => `<div class="hot${it[3] ? ' hot--down' : ''}" style="left:${it[1]}%;top:${it[2]}%" data-j="${j}"><button class="hot__dot" aria-label="${P[it[0]].name}"></button><div class="hot__card"><img src="${img(P[it[0]].img, 100, 100)}" alt=""><div><b>${P[it[0]].name}</b><span>${eur(P[it[0]].price)}</span></div><button class="round" data-add="${it[0]}" aria-label="Add ${P[it[0]].name}"><svg><use href="#i-plus"/></svg></button></div></div>`).join('')}</div>`).join('');
  function setRoom(i) {
    room = i; const r = ROOMS[i];
    $$('#roomTabs button').forEach((b, j) => b.setAttribute('aria-selected', j === i));
    $$('.look__img').forEach((el, j) => el.classList.toggle('is-on', j === i));
    $('#lookTitle').textContent = `${r.items.length} pieces in the ${r.name.toLowerCase()}`;
    $('#lookList').innerHTML = r.items.map((it, j) => `<li data-j="${j}"><img src="${img(P[it[0]].img, 120, 120)}" alt=""><div><b>${P[it[0]].name}</b><span>${eur(P[it[0]].price)}</span></div><button class="round" data-add="${it[0]}" aria-label="Add ${P[it[0]].name}"><svg><use href="#i-plus"/></svg></button></li>`).join('');
    const t = r.items.reduce((s, it) => s + P[it[0]].price, 0);
    $('#lookTotal').innerHTML = `<s>${eur(t)}</s><b>${eur(Math.round(t * .9))}</b>`;
    setHot(0);
    $$('#lookList li').forEach(li => li.addEventListener('mouseenter', () => setHot(+li.dataset.j)));
  }
  function setHot(j) { $$(`.look__img[data-r="${room}"] .hot`).forEach(h => h.classList.toggle('is-open', +h.dataset.j === j)); $$('#lookList li').forEach(li => li.classList.toggle('is-hl', +li.dataset.j === j)); }
  $('#roomTabs').addEventListener('click', e => { const b = e.target.closest('[data-room]'); if (b) setRoom(+b.dataset.room); });
  $('#lookStage').addEventListener('click', e => { const d = e.target.closest('.hot__dot'); if (d) { const h = d.parentElement; setHot(h.classList.contains('is-open') ? -1 : +h.dataset.j); } });
  $('#addLook').addEventListener('click', () => { ROOMS[room].items.forEach(it => add(it[0], 1, { price: Math.round(P[it[0]].price * 90) / 100, was: P[it[0]].price, tag: 'Room −10%' })); openCart(); toast(`Whole ${ROOMS[room].name.toLowerCase()} added — 10% off`); });
  setRoom(0);

  /* ---------- Gifts + countdown ---------- */
  $('#giftGrid').innerHTML = ['g1', 'g2', 'g3'].map(id => { const p = P[id]; return `<article class="gset"><div class="gset__img"><img src="${img(p.img, 600, 600)}" alt="${p.name}" loading="lazy" data-qv="${id}"><span class="pbadge pbadge--sale">Save ${eur(p.was - p.price)}</span></div><div class="gset__body"><h3>${p.name}</h3><p>${p.meta}</p><div class="gset__buy"><span><b>${eur(p.price)}</b><s>${eur(p.was)}</s></span><button class="btn btn--dark" data-add="${id}"><span>Add</span></button></div></div></article>`; }).join('');
  const deadline = new Date('2026-12-18T23:59:59+01:00').getTime();
  (function tick() {
    const ms = deadline - Date.now();
    if (ms <= 0) { $('.gcount__row').outerHTML = '<p class="gcount__note">Gift-ready all year — free wrapping and a handwritten card on every order.</p>'; return; }
    const v = { d: Math.floor(ms / 864e5), h: Math.floor(ms % 864e5 / 36e5), m: Math.floor(ms % 36e5 / 6e4), s: Math.floor(ms % 6e4 / 1e3) };
    $$('[data-cd]').forEach(el => { const t = String(v[el.dataset.cd]).padStart(2, '0'); if (el.textContent !== t) el.textContent = t; });
    setTimeout(tick, 1000);
  })();

  /* ---------- Story ---------- */
  const man = $('#manifesto');
  man.innerHTML = man.textContent.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');
  const MAKERS = [['Élise', 'Ceramicist', 'Limoges', '1493106641515-6b5631de4bb9'], ['Atelier Roux', 'Chandlers', 'Provence', '1602523961358-f9f03dd557db'], ['Tissage Vosgien', 'Linen weavers', 'Vosges', '1505693416388-ac5ce068fe85']];
  $('#makers').innerHTML = MAKERS.map(m => `<figure class="maker" style="margin:0"><img src="${img(m[3], 800, 1000)}" alt="${m[1]} — ${m[2]}" loading="lazy"><figcaption class="maker__tag"><span><b>${m[0]}</b><span>${m[1]}</span></span><small>${m[2]}</small></figcaption></figure>`).join('');

  /* ---------- Reviews wall ---------- */
  const REV = [
    ['Camille R.', 'Lyon', 'p1', 'Even more beautiful in person', 'The glaze is stunning and they arrived packed so carefully — not a single chip after the trip from Limoges.', '1610701596061-2ecf227e85b2'],
    ['Thomas B.', 'Bordeaux', 'p3', 'Softest linen I\'ve owned', 'Two washes in and it only gets better. Already ordered a second set for the guest room.'],
    ['Sophie L.', 'Brussels', 'p2', 'My third one', 'Ambre & Figue makes the whole flat smell like a boutique hotel. Clean burn, no soot.'],
    ['Hannah K.', 'Berlin', 'p6', 'Worth every euro', 'Delivered to Berlin in four days. The bouclé is gorgeous and the oak frame is solid.', '1586023492125-27b2c045efd7'],
    ['Lucía M.', 'Madrid', 'g3', 'The perfect gift', 'The wrapping and handwritten card made it feel so personal. My sister was in tears.'],
    ['Julien P.', 'Paris', 'p7', 'Our everyday mug now', 'Thin porcelain, perfect handle. These are the only mugs anyone in our house reaches for.'],
    ['Anna V.', 'Amsterdam', 'p4', 'A real statement piece', 'Looks incredible with a single branch. You can feel it was made by hand.', '1612196808214-b8e1d6145a8c'],
    ['Marco T.', 'Milan', 'p5', 'Better than the photos', 'The blue glaze changes with the light. Packaging was plastic-free, which I loved.']
  ];
  $('#wall').innerHTML = REV.map(r => `<article class="rev">${r[5] ? `<div class="rev__photo"><img src="${img(r[5], 600, 450)}" alt="Customer photo of ${P[r[2]].name}" loading="lazy"></div>` : ''}${stars(5)}<p class="rev__text"><b>${r[3]}</b>${r[4]}</p><button class="rev__prod" data-qv="${r[2]}"><img src="${img(P[r[2]].img, 80, 80)}" alt="">${P[r[2]].name} · ${eur(P[r[2]].price)}</button><div class="rev__foot"><span class="rev__av">${r[0][0]}</span><div><b>${r[0]}</b><span>${r[1]}</span></div><span class="vbadge"><svg><use href="#i-check"/></svg>Verified</span></div></article>`).join('');

  /* ---------- Builder ---------- */
  const B = ['p2', 'p7', 'p8', 'p9', 'p10', 'p14']; let picked = [];
  $('#bundleOptions').innerHTML = B.map(id => `<button class="bopt" data-b="${id}" aria-pressed="false"><img src="${img(P[id].img, 420, 315)}" alt="" loading="lazy"><b>${P[id].name}</b><span>${eur(P[id].price)}</span><i class="ck"><svg><use href="#i-plus"/></svg></i></button>`).join('');
  function renderB() {
    $$('.bopt').forEach(b => { const on = picked.includes(b.dataset.b); b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); $('use', b).setAttribute('href', on ? '#i-check' : '#i-plus'); });
    $('#bundleSlots').innerHTML = [0, 1, 2].map(i => picked[i] ? `<div class="tslot"><img src="${img(P[picked[i]].img, 160, 160)}" alt="${P[picked[i]].name}"><button data-unpick="${picked[i]}" aria-label="Remove ${P[picked[i]].name}"><svg><use href="#i-close"/></svg></button></div>` : `<div class="tslot">${i + 1}</div>`).join('');
    const sub = picked.reduce((s, id) => s + P[id].price, 0), full = picked.length === 3, tot = full ? sub * .85 : sub;
    $('#bLabel').textContent = full ? 'Box complete — 15% off' : `${picked.length} of 3 chosen`;
    $('#bSub').textContent = full ? eur(sub) : ''; $('#bTotal').textContent = eur(tot);
    $('#bMeter').style.width = (picked.length / 3 * 100) + '%';
    const btn = $('#bundleAdd'); btn.disabled = !full; $('span', btn).textContent = full ? 'Add box to bag' : `Choose ${3 - picked.length} more`;
    $$('#steps li').forEach((li, i) => li.classList.toggle('is-on', i === 0 || (full && i === 1)));
  }
  $('#bundleOptions').addEventListener('click', e => { const b = e.target.closest('[data-b]'); if (!b) return; const id = b.dataset.b; if (picked.includes(id)) picked = picked.filter(x => x !== id); else { if (picked.length === 3) picked.shift(); picked.push(id); } renderB(); });
  $('#bundleSlots').addEventListener('click', e => { const u = e.target.closest('[data-unpick]'); if (u) { picked = picked.filter(x => x !== u.dataset.unpick); renderB(); } });
  $('#bundleAdd').addEventListener('click', () => { picked.forEach(id => add(id, 1, { price: Math.round(P[id].price * 85) / 100, was: P[id].price, tag: 'Box −15%' })); opts.wrap = true; save(); picked = []; renderB(); openCart(); toast('Gift box added — 15% off & free wrapping'); });
  renderB();

  /* ---------- Instagram ---------- */
  const UGC = [['1493663284031-b7e3aefcae8e', '@chez.camille', 'p12'], ['1616486338812-3dadae4b4ace', '@lea.interieur', 'p13'], ['1618221195710-dd6b41faaea6', '@atelier.nord', 'p1'], ['1615529182904-14819c35db37', '@maison.solene', 'p8'], ['1519710164239-da123dc03ef4', '@hugo.home', 'p11'], ['1600210492486-724fe5c67fb0', '@claire.chez.soi', 'p2']];
  $('#ugc').innerHTML = UGC.map(u => `<figure class="ig"><img src="${img(u[0], 500, 500)}" alt="Customer home styled with Maison Pelletier" loading="lazy"><figcaption><span>${u[1]}</span><button data-qv="${u[2]}">Shop this</button></figcaption></figure>`).join('');

  /* ---------- Signup / offer ---------- */
  const offer = $('#offer');
  const openOffer = () => { if (sget('mp_offerB') || $('.cart.is-open, .modal.is-open, .sheet.is-open, .palette.is-open') || document.body.classList.contains('show-notes')) return; sset('mp_offerB', '1'); offer.classList.add('is-open'); offer.setAttribute('aria-hidden', 'false'); lock(true); };
  const closeOffer = () => { if (!offer.classList.contains('is-open')) return; offer.classList.remove('is-open'); offer.setAttribute('aria-hidden', 'true'); lock(false); };
  offer.addEventListener('click', e => { if (e.target === offer || e.target.closest('[data-close-offer]')) closeOffer(); });
  setTimeout(openOffer, 35000);
  document.addEventListener('mouseout', e => { if (!e.relatedTarget && e.clientY < 8 && scrollY > 900) openOffer(); });
  $$('[data-signup]').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); sset('mp_offerB', '1'); f.outerHTML = `<div class="done"><p>Welcome — your code:</p><strong>BIENVENUE10</strong><p style="font-size:13px;opacity:.7">Applied automatically at checkout.</p></div>`; }));

  /* ---------- Notes ---------- */
  const NOTES = [
    ['Announcement bar', 'A slim moss bar rotates the three things shoppers worry about most — shipping cost, Christmas delivery and returns — before they even look.', [], 'Lower abandonment'],
    ['Floating header', 'A clean white “capsule” keeps navigation compact and centred. The Shop dropdown shows categories with photos, so people pick visually. Search works like an app (press “/”). The black bag button is always the strongest action.', [], 'Faster discovery'],
    ['Hero slideshow + buy card', 'Three stories in one hero (new season, ceramics, Gift Edit) with progress bars. Each slide comes with a live product card — so the first screen is already shoppable, without leaving the hero.', ['Text and CTA change per slide (e.g. Gift Edit goes straight to gifts)', 'Trust row right under the hero: rating, shipping, returns, handmade, secure payment', 'Swipe on phones'], 'Click-through + first add-to-bag'],
    ['Bento categories', 'A magazine-style grid gives the biggest tile to the hero category and keeps all six one tap away. Modern, calm, and quick for shoppers who know what they want.', [], 'Lower bounce'],
    ['Bestseller rail', 'A swipeable product rail (drag on desktop) with filters. Cards are minimal; the “+” button expands to “Add · €48” on hover so buying is always one click.', ['Ratings, savings, swatches and low stock on every card', 'Quick view without leaving the page'], 'Main revenue driver'],
    ['Product of the month', 'A full product-page buy box right on the homepage for the hero product: gallery, colour, size, quantity, price anchor (€219 → €189), Klarna, honest stock message and delivery date.', ['Lets high-intent visitors buy without any extra page load'], 'Direct conversions'],
    ['Shop the room (tabs)', 'Three rooms in one compact section: living, bedroom, dining. Tap the dots or the list, then add the whole room with 10% off.', [], 'Bigger baskets'],
    ['Gift Edit bento', 'Real Christmas cut-off countdown in a moss card, next to three ready-made gift sets showing the saving. Switches to “gift-ready all year” after 18 Dec.', [], 'Seasonal urgency, honestly'],
    ['Our ateliers', 'A dark, quiet moment. The manifesto lights up word by word as you scroll, then you meet the makers and the numbers. Placed after products so the story justifies the price.', [], 'Trust + premium pricing'],
    ['Review wall', 'A masonry wall of verified reviews (some with customer photos), each linked to the product. A big 4.9 score and “98% would buy again” at the top.', ['Ready for Judge.me / Trustpilot / Yotpo'], 'Converts hesitant visitors'],
    ['Gift box builder', 'Three steps make it feel easy. Pick three, watch the tray fill, see the 15% saving appear, add to bag.', [], 'More items per order'],
    ['Instagram', 'Real homes, offset grid, “Shop this” on every photo.', [], 'Social proof'],
    ['FAQ + help', 'Objection handling in clean cards, with a live helper (Claire) and the newsletter beside it — help and capture in one view.', [], 'Removes last doubts'],
    ['Newsletter 10%', 'Captures visitors who aren\'t ready yet. A matching pop-up appears once per visit (after 35 s or on exit intent) with an easy “No thanks”.', [], 'Owned audience'],
    ['Footer', 'Clean links and payment logos, closed with a large brand signature.', [], 'Trust + recall'],
    ['Side cart (open it)', 'A floating, app-like cart.', ['3 reward tiers: free shipping €80 → free linen tote €120 → free candle €150', '“Pairs well with” upsells chosen from what\'s in the bag', 'Free gift wrap + note, live delivery estimate', 'Klarna, Apple Pay, PayPal, Google Pay'], 'Higher AOV · fewer drop-offs']
  ];
  const notes = $('#notes');
  $$('[data-note]').forEach(el => { const p = document.createElement('span'); p.className = 'pin'; p.textContent = el.dataset.note; p.setAttribute('aria-hidden', 'true'); el.appendChild(p); });
  $('#notesBody').innerHTML = `<p class="notes__intro">Design B is the <b>clean, modern</b> direction: light, rounded, app-like. Every section still has one job in turning a visitor into a customer. Numbers match the blue pins.</p>` + NOTES.map((n, i) => `<div class="note"><div class="note__head"><span class="note__num">${i < 15 ? i + 1 : '+'}</span><button data-jump="${i < 15 ? i + 1 : 0}">${n[0]}</button></div><p>${n[1]}</p>${n[2].length ? `<ul>${n[2].map(x => `<li>${x}</li>`).join('')}</ul>` : ''}<span class="note__kpi">${n[3]}</span></div>`).join('');
  const openNotes = () => { notes.classList.add('is-open'); notes.setAttribute('aria-hidden', 'false'); document.body.classList.add('show-notes'); $('#notesBtn').setAttribute('aria-expanded', 'true'); };
  const closeNotes = () => { notes.classList.remove('is-open'); notes.setAttribute('aria-hidden', 'true'); document.body.classList.remove('show-notes'); $('#notesBtn').setAttribute('aria-expanded', 'false'); };
  $('#notesBtn').addEventListener('click', () => notes.classList.contains('is-open') ? closeNotes() : openNotes());
  notes.addEventListener('click', e => { if (e.target.closest('[data-close-notes]')) return closeNotes(); const j = e.target.closest('[data-jump]'); if (!j) return; const n = +j.dataset.jump; if (!n) return openCart(); goTo($(`[data-note="${n}"]`)); if (n === 2) setDrop(true); });
  if (/[?&]notes\b/.test(location.search)) openNotes();

  /* ---------- Keyboard ---------- */
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); return; }
    if (e.key !== 'Escape') return;
    if (qv.classList.contains('is-open')) return closeQV();
    closeCart(); closeSearch(); closeOffer(); setMenu(false); setDrop(false); closeNotes();
  });

  /* ---------- Init + motion ---------- */
  setTab('best'); renderWish(); counts();
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero__frame', { clipPath: 'inset(6% 4% 6% 4% round 48px)', duration: 1.4, ease: 'power4.out' });
    gsap.from('.slide.is-on img', { scale: 1.3, duration: 2, ease: 'power3.out' });
    gsap.from('.header__inner > *', { y: -16, opacity: 0, duration: .9, stagger: .08, ease: 'power3.out', delay: .2 });
    gsap.from('.proof__item', { y: 16, opacity: 0, duration: .8, stagger: .06, ease: 'power3.out', delay: .6 });
    $$('.head, .rhead, .builder__intro, .qa > div:first-child > .tag, .qa .h2').forEach(el => gsap.from(el.children.length ? el.children : el, { y: 40, opacity: 0, duration: 1, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
    gsap.from('.tile', { y: 50, opacity: 0, scale: .96, duration: 1, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: '#bento', start: 'top 85%', once: true } });
    ScrollTrigger.create({ trigger: rail, start: 'top 88%', once: true, onEnter: () => { rail._seen = true; gsap.from(rail.children, { x: 80, opacity: 0, duration: 1, stagger: .06, ease: 'power3.out', clearProps: 'transform,opacity' }); } });
    gsap.from('.spot__gallery, .spot__buy > *', { y: 40, opacity: 0, duration: 1, stagger: .05, ease: 'power3.out', scrollTrigger: { trigger: '.spot', start: 'top 80%', once: true } });
    gsap.from('.look__stage, .look__list', { y: 50, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.look', start: 'top 85%', once: true } });
    gsap.from('.gcount, .gset', { y: 50, opacity: 0, duration: 1, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.gbento', start: 'top 85%', once: true } });
    const words = $$('#manifesto .w');
    ScrollTrigger.create({ trigger: '#manifesto', start: 'top 80%', end: 'bottom 45%', scrub: true, onUpdate: s => { const n = Math.round(s.progress * words.length); words.forEach((w, i) => w.classList.toggle('is-lit', i < n)); } });
    gsap.from('.maker', { y: 60, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '#makers', start: 'top 85%', once: true } });
    ScrollTrigger.create({ trigger: '.numbers', start: 'top 88%', once: true, onEnter: countUp });
    gsap.from('.rev', { y: 40, opacity: 0, duration: .9, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: '#wall', start: 'top 85%', once: true } });
    gsap.from('.bopt, .tray', { y: 30, opacity: 0, duration: .8, stagger: .05, ease: 'power3.out', scrollTrigger: { trigger: '.builder__main', start: 'top 85%', once: true } });
    gsap.from('.ig', { y: 40, opacity: 0, duration: .9, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: '#ugc', start: 'top 90%', once: true } });
    gsap.fromTo('.footer__mega', { yPercent: 30, opacity: .3 }, { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    addEventListener('load', () => ScrollTrigger.refresh());
  } else { rail._seen = true; $$('#manifesto .w').forEach(w => w.classList.add('is-lit')); countUp(); }
  function countUp() {
    $$('[data-count]').forEach(el => {
      const to = +el.dataset.count, suf = el.dataset.suffix || '';
      if (!hasGsap) { el.textContent = to + suf; return; }
      const o = { v: 0 }; gsap.to(o, { v: to, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v) + suf; } });
    });
  }
})();
