/* Missive & Co. — greeting card homepage concept (V2) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const money = v => '$' + v.toFixed(2);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = () => matchMedia('(min-width: 961px)').matches;
  const hasG = !!(window.gsap && window.ScrollTrigger);
  if (!hasG) document.documentElement.classList.add('no-gsap');

  /* ---------------- DATA ---------------- */
  const P = [
    { id: 'clover', n: 'Wild Clover', a: 'Watercolour by Ana Ruiz', p: 5.5, cat: 'thanks', img: 'p-clover', badge: 'Bestseller', r: 4.9, c: 612, msg: 'Thank you for simply being you.', env: ['#C9B48F', '#F4EEE6', '#8E9A84'] },
    { id: 'jfy', n: 'Just for You Bouquet', a: 'Illustrated by Mira Okafor', p: 5.95, cat: 'birthday', img: 'p-just-for-you', r: 4.9, c: 438, msg: 'Happy birthday, lovely. Today is all yours.', env: ['#E9B8B0', '#F4EEE6'] },
    { id: 'bauble', n: 'Gilded Bauble', a: 'Gold foil · Studio', p: 6.5, cat: 'holiday', img: 'p-gilded-bauble', badge: 'Gold foil', ox: true, r: 5.0, c: 301, msg: 'Wishing you a sparkling season.', env: ['#6A1C2A', '#F4EEE6', '#2F4A3A'] },
    { id: 'joy', n: 'Joy Botanica', a: 'Letterpress · Studio', p: 6.95, cat: 'holiday', img: 'p-joy-botanica', badge: 'Letterpress', r: 4.9, c: 214, msg: 'Joy to you and yours, always.', env: ['#6A1C2A', '#F4EEE6'] },
    { id: 'carmella', n: 'Wildflower Wedding', a: 'Suite by Elodie Kim', p: 7.5, cat: 'wedding', img: 'p-wildflower-wedding', badge: 'New', r: 5.0, c: 96, msg: 'To a lifetime of wildflowers and long dinners.', env: ['#F1DCD5', '#F4EEE6', '#C6A36A'] },
    { id: 'berry', n: 'Berry Much Love', a: 'Illustrated by Theo Marsh', p: 5.5, cat: 'love', img: 'p-berry-much', r: 4.8, c: 189, msg: 'I love you berry, berry much.', env: ['#3B2A55', '#E25A5A'] },
    { id: 'mother', n: 'Mother Like No Other', a: 'Riso print by Jun Park', p: 5.95, cat: 'love', img: 'p-mother-like-no-other', badge: 'Bestseller', r: 4.9, c: 377, msg: 'There is no one like you, Mum.', env: ['#F2E14C', '#E25A5A'] },
    { id: 'listen', n: 'Always Listening', a: 'Illustrated by Ana Ruiz', p: 5.5, cat: 'love', img: 'p-always-listening', r: 4.8, c: 152, msg: 'Thank you for every phone call, Mum.', env: ['#F4EEE6', '#C9B0D8'] },
    { id: 'bigthanks', n: 'The Big Thank You', a: 'Hand-lettered by Theo Marsh', p: 5.5, cat: 'thanks', img: 'p-big-thank-you', badge: 'Fan favourite', r: 4.9, c: 509, msg: 'You are a total legend. THANK YOU!', env: ['#3FB5D6', '#F4EEE6'] }
  ];
  const OCC = [
    ['Birthday', 320, 'o-birthday'], ['Thank You', 140, 'o-thanks'], ['Love & Anniversary', 96, 'o-love'], ['Wedding', 64, 'o-wedding'],
    ['Christmas', 180, 'o-holiday'], ['For Mum', 72, 'o-mum'], ['Thinking of You', 58, 'o-thinking'], ['Just Because', 110, 'o-just-because']
  ];
  const REC = [['Mum', 'r-mum', 140], ['Partner', 'r-partner', 96], ['Dad', 'r-dad', 88], ['Best Friend', 'r-friend', 120], ['Grandparents', 'r-grand', 64], ['Teacher', 'r-teacher', 42], ['Colleague', 'r-colleague', 58]];
  const REV = [
    ['The paper is unreal. My sister framed her birthday card. Actually framed it.', 'Hannah L.', 'Golden Hour Birthday', ['rev-1']],
    ['Sent a sympathy card direct when I couldn’t be there. It arrived the next morning with a wax seal. She called me in tears.', 'David R.', 'Send direct'],
    ['The reminder emails have saved me four times this year. I look so organised now.', 'Priya S.', 'Reminders'],
    ['Ordered 80 holiday cards with our logo in gold foil. Gorgeous, and early.', 'Studio Nine', 'Corporate', ['rev-2']],
    ['The handwriting style genuinely looks handwritten. Grandma had no idea!', 'Marcus T.', 'Personalised'],
    ['Built a box of 8 for the drawer and saved 25%. Best card decision I’ve made.', 'Jess W.', 'Card Wardrobe']
  ];

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' }) : null;
  function observe(els) { els.forEach(el => io ? io.observe(el) : el.classList.add('in')); }

  /* ---------------- RENDER ---------------- */
  $('#occTrack').innerHTML = OCC.map(([n, c, img], i) => `
    <a class="oc" href="#shop" data-cursor="Shop">
      <img src="images/${img}.jpg" alt="${n} greeting cards" loading="lazy">
      <span class="oc__n">0${i + 1} / 0${OCC.length}</span>
      <span class="oc__b"><span><strong>${n}</strong><small>${c} designs</small></span><span class="oc__go">→</span></span>
    </a>`).join('');

  const promo = `<div class="promo rv">
      <span class="ring"></span>
      <div><p class="kicker kicker--gold">Card Wardrobe</p><h3>Buy 5, <em>save 20%.</em></h3><p>Mix any designs. Your box ships free, with a wax seal on every envelope.</p></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-top:24px"><span class="promo__big">20%</span><a class="btn btn--gold" href="#bundle">Build your box <i>→</i></a></div>
    </div>`;
  const card = (p, i) => `
    <article class="pc rv" style="transition-delay:${(i % 4) * 70}ms">
      <div class="pc__media" data-cursor="Peek">
        <img src="images/${p.img}.jpg" alt="${p.n} greeting card" loading="lazy">
        <div class="pc__inside"><small>Inside reads</small><p>${p.msg}</p></div>
        ${p.badge ? `<span class="pc__badge ${p.ox ? 'pc__badge--ox' : ''}">${p.badge}</span>` : ''}
        <button class="pc__wish" aria-label="Save ${p.n}" aria-pressed="false">♡</button>
        <div class="pc__acts">
          <button class="btn btn--dark btn--sm" data-add="${p.id}" data-name="${p.n}" data-price="${p.p}" data-img="images/${p.img}.jpg">Quick add</button>
          <a class="btn btn--line btn--sm" href="#studio" data-pers="${p.id}">Personalise</a>
        </div>
      </div>
      <div class="pc__info">
        <h3>${p.n}</h3><span class="pc__price">${money(p.p)}</span>
        <p>${p.a}</p><span class="pc__rate"><span class="stars">★</span> ${p.r.toFixed(1)} (${p.c})</span>
        <div class="pc__sw">${p.env.map(c => `<i style="--c:${c}"></i>`).join('')}<span>${p.env.length} envelope colours</span></div>
      </div>
    </article>`;
  function renderGrid(f = 'all') {
    const list = P.filter(p => f === 'all' || p.cat === f || (f === 'birthday' && p.id === 'jfy'));
    let html = list.map(card);
    if (f === 'all') { html.splice(5, 0, promo); html[html.length - 1] = html[html.length - 1].replace('class="pc rv"', 'class="pc rv m-hide"'); }
    $('#grid').innerHTML = html.join('');
    observe($$('#grid .rv'));
    bindCursor($$('#grid [data-cursor]'));
  }
  renderGrid();
  $('#tabs').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#tabs button').forEach(x => x.classList.toggle('on', x === b));
    renderGrid(b.dataset.f);
  });

  $('#bundlePick').innerHTML = P.map(p => `
    <button class="bp" type="button" data-id="${p.id}" aria-pressed="false"><img src="images/${p.img}.jpg" alt="" loading="lazy"><span class="bp__chk">+</span><span>${p.n}<small>${money(p.p)}</small></span></button>`).join('');

  $('#recList').innerHTML = REC.map(([n, img, c], i) => `
    <li><a href="#shop" data-img="images/${img}.jpg" class="${i ? '' : 'on'}"><span>0${i + 1}</span><strong>${n}</strong><em>${c} cards <i>→</i></em></a></li>`).join('');

  $('#revRail').innerHTML = REV.map(([q, n, prod, imgs]) => `
    <figure class="rv-card">
      <span class="stars">★★★★★</span>
      <blockquote>“${q}”</blockquote>
      ${imgs ? `<div class="rv-card__ph">${imgs.map(s => `<img src="images/${s}.jpg" alt="Customer photo" loading="lazy">`).join('')}</div>` : ''}
      <footer><div><b>${n}</b><span>${prod}</span></div><em>✓ Verified</em></footer>
    </figure>`).join('');

  /* ---------------- REVEALS (IO) ---------------- */
  $$('.head, .bundle__copy, .holiday__copy, .rec__intro, .quality__copy, .set, .club, .rev__top, .remind__copy, .biz__b, .ugc__i, .final__in, .studio__stage, .studio__form, .quality__img').forEach(el => el.classList.add('rv'));
  observe($$('.rv'));

  /* ---------------- LOADER + HERO INTRO ---------------- */
  const loader = $('#loader');
  let introDone = false;
  function intro() {
    if (introDone) return; introDone = true;
    loader.classList.add('out');
    document.body.classList.remove('is-loading');
    setTimeout(() => loader.remove(), 1200);
    if (hasG && !reduce) {
      gsap.from('.hero__h1 .ln>span', { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: .12, delay: .25 });
      gsap.from('.hero__eyebrow, .hero__sub, .hero__ctas, .proof', { y: 30, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .08, delay: .5 });
      gsap.from('.hero__arch', { clipPath: 'inset(100% 0 0 0 round 400px 400px 6px 6px)', duration: 1.6, ease: 'expo.inOut', delay: .1 });
      gsap.from('.hero__arch img', { scale: 1.3, duration: 2.2, ease: 'expo.out', delay: .1 });
      gsap.from('.chip, .hero__ring, .hero__caption', { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .12, delay: 1 });
    }
  }
  const minShow = reduce ? 0 : 1300;
  const t0 = performance.now();
  const go = () => setTimeout(intro, Math.max(0, minShow - (performance.now() - t0)));
  document.readyState === 'complete' ? go() : addEventListener('load', go);
  setTimeout(intro, 3500); // never block

  /* ---------------- SMOOTH SCROLL + SCROLL SCENES ---------------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: .1, smoothWheel: true });
    if (hasG) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  // anchor links
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const t = $(id); if (!t) return;
    e.preventDefault();
    document.body.classList.remove('menu-open');
    lenis ? lenis.scrollTo(t, { offset: -70, duration: 1.4 }) : t.scrollIntoView({ behavior: 'smooth' });
  });

  if (hasG) {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 961px)', () => {
      // horizontal occasions
      const track = $('#occTrack');
      const dist = () => track.scrollWidth - (innerWidth - track.getBoundingClientRect().left) + 40;
      gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '#occasions', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .8, invalidateOnRefresh: true,
          onUpdate: s => { $('#occBar').style.width = (s.progress * 100) + '%'; } }
      });
      // story pin
      const steps = $$('.step'), imgs = $$('#storyMedia img');
      let cur = 0;
      const setStep = i => {
        if (i === cur) return;
        imgs.forEach((im, k) => { im.classList.toggle('was', k === cur); im.classList.toggle('on', k === i); });
        steps.forEach((s, k) => s.classList.toggle('on', k === i));
        $('#storyNum').textContent = '0' + (i + 1); cur = i;
      };
      ScrollTrigger.create({ trigger: '.story__pin', start: 'top top', end: '+=240%', pin: true, scrub: true,
        onUpdate: s => setStep(Math.min(3, Math.floor(s.progress * 4))) });
      // parallax
      gsap.to('.holiday__bg img', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '.holiday', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.to('.final>img', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.to('.hero__arch img', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.from('.hcard--1', { rotate: -18, y: 120, scrollTrigger: { trigger: '.holiday', start: 'top 80%', end: 'center center', scrub: 1 } });
      gsap.from('.hcard--2', { rotate: 18, y: 200, scrollTrigger: { trigger: '.holiday', start: 'top 80%', end: 'center center', scrub: 1 } });
      gsap.from('.ftr__word', { yPercent: 40, opacity: 0, scrollTrigger: { trigger: '.ftr', start: 'top 80%', end: 'bottom bottom', scrub: 1 } });
    });
    addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ---------------- HEADER / BAR ---------------- */
  const hdr = $('#hdr'), mbar = $('#mbar');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    hdr.classList.toggle('scrolled', y > 20);
    hdr.classList.toggle('hide', y > 600 && y > lastY && !document.body.classList.contains('menu-open') && $('#search').hidden);
    mbar.classList.toggle('on', y > 500);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const rotate = (els, ms) => { let i = 0; setInterval(() => { els[i].classList.remove('on'); els[i].classList.add('off'); const prev = els[i]; setTimeout(() => prev.classList.remove('off'), 800); i = (i + 1) % els.length; els[i].classList.add('on'); }, ms); };
  rotate($$('#barRot p'), 3600);
  rotate($$('#rot span'), 2400);

  $('#burger').addEventListener('click', () => { const o = document.body.classList.toggle('menu-open'); $('#burger').setAttribute('aria-expanded', o); o ? lenis?.stop() : lenis?.start(); });
  $$('#mnav a').forEach(a => a.addEventListener('click', () => { document.body.classList.remove('menu-open'); lenis?.start(); }));

  /* search */
  const search = $('#search'), sIn = $('#searchInput'), sRes = $('#searchRes');
  $('#searchBtn').addEventListener('click', () => { search.hidden = !search.hidden; if (!search.hidden) sIn.focus(); });
  const doSearch = q => {
    q = q.trim().toLowerCase(); if (!q) { sRes.innerHTML = ''; return; }
    const key = q.replace('thank you', 'thank').replace('christmas', 'holiday').replace('mum', 'love');
    const hits = P.filter(p => (p.n + ' ' + p.cat + ' ' + p.a + ' ' + (p.badge || '') + ' ' + p.msg).toLowerCase().includes(key.split(' ')[0]));
    sRes.innerHTML = hits.length ? hits.map(p => `<a class="sr" href="#shop"><img src="images/${p.img}.jpg" alt=""><span><strong>${p.n}</strong><small>${money(p.p)} · ★ ${p.r}</small></span></a>`).join('') : `<p style="color:var(--ink2)">No cards match “${q}”. Try “birthday” or “gold”.</p>`;
  };
  sIn.addEventListener('input', e => doSearch(e.target.value));
  $$('.search__chips button').forEach(b => b.addEventListener('click', () => { sIn.value = b.textContent; doSearch(b.textContent); }));
  sRes.addEventListener('click', e => { if (e.target.closest('a')) search.hidden = true; });

  /* ---------------- CURSOR + MAGNET + HERO DEPTH ---------------- */
  const cur = $('#cursor'), curT = $('#cursorTxt');
  if (matchMedia('(hover:hover)').matches) {
    let cx = 0, cy = 0, x = 0, y = 0;
    addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });
    (function loop() { x += (cx - x) * .18; y += (cy - y) * .18; cur.style.translate = `${x}px ${y}px`; requestAnimationFrame(loop); })();
    $$('[data-magnet]').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
    const art = $('#heroArt');
    art.addEventListener('mousemove', e => {
      const r = art.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
      $$('[data-depth]', art).forEach(el => { const d = +el.dataset.depth * 18; el.style.translate = `${dx * d}px ${dy * d}px`; });
    });
    art.addEventListener('mouseleave', () => $$('[data-depth]', art).forEach(el => (el.style.translate = '0 0')));
  }
  function bindCursor(els) {
    els.forEach(el => {
      el.addEventListener('mouseenter', () => { curT.textContent = el.dataset.cursor; cur.classList.add('on'); });
      el.addEventListener('mouseleave', () => cur.classList.remove('on'));
    });
  }
  bindCursor($$('[data-cursor]'));
  const rail = $('#revRail');
  rail.dataset.cursor = 'Drag'; bindCursor([rail]);
  let down = false, sx = 0, sl = 0;
  rail.addEventListener('mousedown', e => { down = true; sx = e.pageX; sl = rail.scrollLeft; rail.style.scrollSnapType = 'none'; });
  addEventListener('mouseup', () => { down = false; rail.style.scrollSnapType = ''; });
  rail.addEventListener('mousemove', e => { if (down) { e.preventDefault(); rail.scrollLeft = sl - (e.pageX - sx) * 1.4; } });

  /* recipients preview */
  const recImg = $('#recImg');
  $$('#recList a').forEach(a => a.addEventListener('mouseenter', () => {
    $$('#recList a').forEach(x => x.classList.toggle('on', x === a));
    if (recImg.getAttribute('src') === a.dataset.img) return;
    recImg.classList.add('swap');
    setTimeout(() => { recImg.src = a.dataset.img; recImg.onload = () => recImg.classList.remove('swap'); }, 250);
  }));

  /* counters */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, pre = el.dataset.pre || '', suf = el.dataset.suf || '', t1 = performance.now();
    const step = t => { const k = Math.min(1, (t - t1) / 1600), v = Math.round(to * (1 - Math.pow(1 - k, 4))); el.textContent = pre + v + suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------------- COUNTDOWN ---------------- */
  const cutoff = new Date(2026, 11, 15, 23, 59, 59);
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    let s = Math.max(0, (cutoff - new Date()) / 1000);
    const d = Math.floor(s / 86400); s -= d * 86400; const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s = Math.floor(s - m * 60);
    const cd = $('#cd');
    $('[data-d]', cd).textContent = pad(d); $('[data-h]', cd).textContent = pad(h); $('[data-m]', cd).textContent = pad(m); $('[data-s]', cd).textContent = pad(s);
    $('#barCd').textContent = `${d}d ${pad(h)}h ${pad(m)}m`;
  };
  tick(); setInterval(tick, 1000);

  /* ---------------- STUDIO ---------------- */
  const msg = $('#msg'), ink = $('#inkMsg'), cc = $('#cc');
  let send = 'direct';
  const upd = () => { ink.textContent = msg.value || 'Your words appear here…'; cc.textContent = `${msg.value.length}/220`; $('.mini-steps li').classList.add('on'); };
  msg.addEventListener('input', upd);
  ink.className = 'ink ink--script'; upd();
  $$('.prompts button').forEach(b => b.addEventListener('click', () => { msg.value = b.dataset.p; upd(); }));
  $('#inkSeg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#inkSeg button').forEach(x => x.classList.toggle('on', x === b));
    ink.className = 'ink ink--' + b.dataset.ink; $$('.mini-steps li')[1].classList.add('on');
  });
  $('#sendSeg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#sendSeg button').forEach(x => x.classList.toggle('on', x === b)); send = b.dataset.send;
    $('#studioPrice').textContent = send === 'direct' ? '$9.95' : '$6.45'; $$('.mini-steps li')[2].classList.add('on');
  });
  $('#studioAdd').addEventListener('click', () => addToCart('pers-' + Date.now(), 'Personalised card' + (send === 'direct' ? ' · sent direct' : ''), send === 'direct' ? 9.95 : 6.45, 'images/studio-blank.jpg'));
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-pers]'); if (!a) return;
    const p = P.find(x => x.id === a.dataset.pers); if (p) { msg.value = p.msg; upd(); toast(`Personalising “${p.n}”`); }
  });

  /* ---------------- BUNDLE ---------------- */
  const sel = [];
  const tiers = [[8, .25], [5, .2], [3, .1]];
  const slots = $('#traySlots');
  function renderTray() {
    const n = sel.length, base = sel.reduce((s, id) => s + P.find(p => p.id === id).p, 0);
    const t = tiers.find(([k]) => n >= k), off = t ? t[1] : 0;
    slots.innerHTML = Array.from({ length: 8 }, (_, i) => `<div class="slot">${sel[i] ? `<img src="images/${P.find(p => p.id === sel[i]).img}.jpg" alt="">` : ''}</div>`).join('');
    $('#trayBar').style.width = Math.min(100, n / 8 * 100) + '%';
    $$('.tier').forEach(el => el.classList.toggle('hit', n >= +el.dataset.t));
    const next = [3, 5, 8].find(k => n < k);
    $('#trayMsg').textContent = n === 0 ? 'Choose 3 cards to unlock 10% off' : next ? `Add ${next - n} more to save ${({ 3: '10%', 5: '20%', 8: '25% + a gift box' })[next]}` : 'Maximum savings unlocked ✦';
    $('#trayWas').textContent = off ? money(base) : '';
    $('#trayNow').textContent = money(base * (1 - off));
    $('#trayAdd').disabled = n < 3;
    $('#trayAdd').textContent = n < 3 ? 'Add bundle to bag' : `Add ${n} cards, save ${Math.round(off * 100)}%`;
  }
  $('#bundlePick').addEventListener('click', e => {
    const b = e.target.closest('.bp'); if (!b) return;
    const id = b.dataset.id, i = sel.indexOf(id);
    if (i > -1) sel.splice(i, 1); else if (sel.length < 8) sel.push(id); else return toast('Your box is full (8 cards)');
    b.classList.toggle('sel', sel.includes(id)); b.setAttribute('aria-pressed', sel.includes(id));
    $('.bp__chk', b).textContent = sel.includes(id) ? '✓' : '+';
    renderTray();
  });
  $('#trayAdd').addEventListener('click', () => {
    const n = sel.length, base = sel.reduce((s, id) => s + P.find(p => p.id === id).p, 0), off = (tiers.find(([k]) => n >= k) || [0, 0])[1];
    addToCart('bundle-' + Date.now(), `Card Wardrobe · ${n} cards (−${Math.round(off * 100)}%)`, +(base * (1 - off)).toFixed(2), `images/${P.find(p => p.id === sel[0]).img}.jpg`, n);
    sel.length = 0; $$('.bp').forEach(b => { b.classList.remove('sel'); $('.bp__chk', b).textContent = '+'; }); renderTray();
  });
  renderTray();

  /* ---------------- REMINDERS / FORMS ---------------- */
  $('#remForm').addEventListener('submit', e => {
    e.preventDefault();
    const n = $('#remName').value.trim(), v = $('#remDate').value; if (!n || !v) return;
    const d = new Date(v + 'T12:00:00'), r = new Date(d - 10 * 864e5);
    const li = document.createElement('li'); li.className = 'new';
    li.innerHTML = `<b>${pad(d.getDate())} <small>${d.toLocaleDateString('en-US', { month: 'short' })}</small></b><span><strong></strong> · we’ll remind you ${r.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>`;
    $('strong', li).textContent = n;
    $('#remList').prepend(li); e.target.reset(); toast(`Saved. We’ll remind you before ${n}’s day.`);
  });
  $('#newsForm').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('Welcome! Your code WELCOME15 is on its way.'); });

  /* wishlist */
  document.addEventListener('click', e => {
    const w = e.target.closest('.pc__wish'); if (!w) return;
    const on = w.getAttribute('aria-pressed') !== 'true'; w.setAttribute('aria-pressed', on); w.textContent = on ? '♥' : '♡';
    toast(on ? 'Saved to your wishlist' : 'Removed from wishlist');
  });

  /* ---------------- CART ---------------- */
  const cart = [];
  const open = () => { document.body.classList.add('cart-open'); $('#cart').setAttribute('aria-hidden', 'false'); lenis?.stop(); };
  const close = () => { document.body.classList.remove('cart-open'); $('#cart').setAttribute('aria-hidden', 'true'); lenis?.start(); };
  $('#cartBtn').addEventListener('click', open); $('#cartClose').addEventListener('click', close); $('#scrim').addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape') { close(); search.hidden = true; closePop(); } });
  function addToCart(id, name, price, img, cards = 1) {
    const ex = cart.find(i => i.id === id);
    ex ? ex.q++ : cart.push({ id, name, price: +price, img, q: 1, cards: id === 'seals' ? 0 : id.startsWith('set') ? 10 : cards });
    renderCart(); open();
    const c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  }
  function renderCart() {
    const cards = cart.reduce((s, i) => s + i.q * i.cards, 0), tot = cart.reduce((s, i) => s + i.q * i.price, 0), items = cart.reduce((s, i) => s + i.q, 0);
    $('#cartCount').textContent = items; $('#cartN').textContent = `(${items})`; $('#cartTot').textContent = money(tot);
    const left = Math.max(0, 3 - cards);
    $('#shipMsg').innerHTML = left ? `You’re <b>${left} card${left > 1 ? 's' : ''}</b> away from free shipping` : '✦ You’ve unlocked <b>free shipping</b>';
    $('#shipBar').style.width = Math.min(100, cards / 3 * 100) + '%';
    $('#cartItems').innerHTML = cart.length ? cart.map(i => `
      <li><img src="${i.img}" alt=""><div><strong>${i.name}</strong><small>${money(i.price)}</small><div class="qty"><button data-q="-1" data-id="${i.id}" aria-label="Fewer">−</button><span>${i.q}</span><button data-q="1" data-id="${i.id}" aria-label="More">+</button></div></div><b>${money(i.price * i.q)}</b></li>`).join('')
      : '<li class="empty">Your bag is empty.<br><a href="#shop">Find the perfect card →</a></li>';
  }
  $('#cartItems').addEventListener('click', e => {
    const b = e.target.closest('[data-q]'); if (!b) return;
    const it = cart.find(i => i.id === b.dataset.id); it.q += +b.dataset.q; if (it.q <= 0) cart.splice(cart.indexOf(it), 1); renderCart();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    addToCart(b.dataset.add, b.dataset.name, b.dataset.price, b.dataset.img);
  }, true);
  renderCart();

  /* ---------------- EXIT INTENT ---------------- */
  const pop = $('#pop');
  let seen = false; try { seen = sessionStorage.getItem('mc_pop') === '1'; } catch (_) {}
  const closePop = () => { pop.hidden = true; lenis?.start(); };
  const showPop = () => { if (seen || !introDone) return; seen = true; try { sessionStorage.setItem('mc_pop', '1'); } catch (_) {} pop.hidden = false; lenis?.stop(); };
  setTimeout(() => document.addEventListener('mouseout', e => { if (!e.relatedTarget && e.clientY < 8) showPop(); }), 8000);
  $('#popX').addEventListener('click', closePop); $('#popNo').addEventListener('click', closePop);
  pop.addEventListener('click', e => { if (e.target === pop) closePop(); });
  $('#popForm').addEventListener('submit', e => { e.preventDefault(); closePop(); toast('Your 15% code: WELCOME15'); });

  /* ---------------- CRO NOTES ---------------- */
  const nb = $('#notesBtn');
  const setNotes = on => {
    nb.setAttribute('aria-pressed', on); nb.textContent = on ? 'Hide notes' : 'Why this layout?';
    $$('.cro-note').forEach(n => n.remove());
    if (on) $$('[data-note]').forEach(s => { const d = document.createElement('div'); d.className = 'cro-note'; d.innerHTML = `<div><b>CRO note</b>${s.dataset.note}</div>`; s.before(d); });
    if (hasG) ScrollTrigger.refresh();
  };
  nb.addEventListener('click', () => setNotes(nb.getAttribute('aria-pressed') !== 'true'));
  if (/notes=1/.test(location.search)) setNotes(true);

  /* toast */
  let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2800); }
})();
