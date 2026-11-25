(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const STORE = 'https://fandress.com';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const G = window.gsap;
  if (G && window.ScrollTrigger) G.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('js');

  /* ---------------- countdown (HOLIDAY26 ends Nov 28, 2026) ---------------- */
  const end = new Date('2026-11-28T23:59:00-06:00').getTime();
  const cd = $('#countdown');
  const tick = () => {
    let s = Math.max(0, (end - Date.now()) / 1000);
    if (!s) { cd.textContent = 'Final hours'; return; }
    $('[data-d]', cd).textContent = Math.floor(s / 86400);
    $('[data-h]', cd).textContent = String(Math.floor(s % 86400 / 3600)).padStart(2, '0');
    $('[data-m]', cd).textContent = String(Math.floor(s % 3600 / 60)).padStart(2, '0');
  };
  tick(); setInterval(tick, 30000);

  /* ---------------- header / nav ---------------- */
  const hdr = $('#hdr'), mcta = $('#mcta');
  const onScroll = () => {
    hdr.classList.toggle('scrolled', scrollY > 30);
    mcta.classList.toggle('show', scrollY > 800 && innerHeight + scrollY < document.body.scrollHeight - 700);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('#burger'), mnav = $('#mnav');
  burger.onclick = () => {
    const o = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', o); mnav.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  };
  $$('a', mnav).forEach(a => a.addEventListener('click', () => { burger.setAttribute('aria-expanded', false); mnav.classList.remove('open'); document.body.style.overflow = ''; }));
  const mw = $('.mega-wrap');
  $('.mega-btn').onclick = () => { const o = mw.classList.toggle('open'); $('.mega-btn').setAttribute('aria-expanded', o); };
  document.addEventListener('click', e => { if (!mw.contains(e.target)) mw.classList.remove('open'); });

  /* ---------------- custom cursor ---------------- */
  const cur = $('#cursor'), curT = $('#cursorTxt');
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  if (fine && !reduce) {
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; cur.classList.add('on'); }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.remove('on'));
    const loop = () => { cx += (mx - cx) * .2; cy += (my - cy) * .2; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); };
    loop();
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor]');
      if (t) { curT.textContent = t.dataset.cursor; cur.classList.add('big'); } else cur.classList.remove('big');
    });
  }

  /* ---------------- hero ---------------- */
  const stage = $('.hero__stage'), arch = $('.hero__arch'), line = $('.hero__word--line');
  const clipLine = () => {
    const L = line.getBoundingClientRect(), A = arch.getBoundingClientRect();
    const t = A.top - L.top, r = L.right - A.right, b = Math.max(0, L.bottom - A.bottom), l = A.left - L.left;
    line.style.clipPath = `inset(${t}px ${r}px ${b}px ${l}px round ${A.width / 2}px ${A.width / 2}px 0 0)`;
  };
  addEventListener('resize', clipLine); clipLine();
  const heroReady = () => { clipLine(); line.classList.add('ready'); };
  if (G && !reduce) {
    const letters = $$('.hero__word .hw > span:not(.sp)');
    const n = letters.length / 2;
    const tl = G.timeline({ defaults: { ease: 'expo.out' }, onComplete: heroReady });
    tl.from(arch, { clipPath: 'inset(100% 0 0 0 round 999px 999px 0 0)', duration: 1.5 }, 0)
      .from($('.hero__arch img'), { scale: 1.4, duration: 2 }, 0)
      .from(letters, { yPercent: 110, opacity: 0, duration: 1.2, stagger: i => (i % n) * .06 }, .15)
      .from('.hero__script', { opacity: 0, y: 40, rotate: -10, duration: 1.2 }, .7)
      .from('.hero__pol, .hero__stamp', { opacity: 0, scale: .6, y: 40, duration: 1.1, stagger: .12, ease: 'back.out(1.6)' }, .8)
      .from('.hero__foot > *', { opacity: 0, y: 30, duration: 1, stagger: .1 }, .9)
      .from('.hero__meta', { opacity: 0, duration: 1 }, .9);
    // mouse parallax
    if (fine) stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      $$('[data-depth]', stage).forEach(el => G.to(el, { x: x * el.dataset.depth * 2, y: y * el.dataset.depth * 2, duration: 1, ease: 'power3.out' }));
    });
    // scroll parallax of hero bits
    if (window.ScrollTrigger) {
      G.to('.hero__script', { yPercent: -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      G.to('.hero__pol--a', { yPercent: -50, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      G.to('.hero__pol--b', { yPercent: -90, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
  } else heroReady();
  document.fonts && document.fonts.ready.then(clipLine);

  /* ---------------- shop-by-who panels ---------------- */
  const panels = $$('.panel');
  const openPanel = p => panels.forEach(x => x.classList.toggle('is-open', x === p));
  panels.forEach(p => {
    if (fine) p.addEventListener('mouseenter', () => openPanel(p));
    p.addEventListener('click', e => { if (!p.classList.contains('is-open')) { e.preventDefault(); openPanel(p); } });
  });

  /* ---------------- what-is sticky story ---------------- */
  const what = $('#what'), steps = $$('#whatSteps li'), frames = $$('.wf'), eqs = $$('.what__eq span'), bar = $('#whatBar');
  let wStep = -1;
  const whatScroll = () => {
    const r = what.getBoundingClientRect(), span = Math.max(1, r.height - innerHeight);
    const p = Math.min(1, Math.max(0, -r.top / span));
    const s = p < .34 ? 0 : p < .67 ? 1 : 2;
    bar.style.width = (p * 100) + '%';
    if (s === wStep) return; wStep = s;
    steps.forEach((x, i) => x.classList.toggle('on', i <= s && i === s || innerWidth <= 960));
    frames.forEach((x, i) => x.classList.toggle('on', i <= s));
    eqs.forEach((x, i) => x.classList.toggle('on', i <= s));
  };
  addEventListener('scroll', whatScroll, { passive: true }); whatScroll();

  /* ---------------- products ---------------- */
  const W = ['XS', 'S', 'M', 'L', 'XL', '2XL'], GS = ['2T', '3T', '4T', '5T', '6/7', '8/9', '10/11'], B = ['0-3m', '6-9m', '12-18m'];
  const P = {
    lsuW: { n: "LSU Women's Baseball Jersey Dress", s: 'LSU Tigers · Women', p: 148, z: W, i: ['lsu-women.jpg', 'lsu-women-2.jpg'], u: '/products/lsu_jeresy_dress', b: 'Best seller', t: 'logo-lsu.png', team: 'lsu', kind: 'W' },
    amW: { n: "Texas A&M Women's Baseball Jersey Dress", s: 'Texas A&M · Women', p: 148, z: W, i: ['aggie-women.jpg', 'aggie-women-drawstring.jpg'], u: '/products/texas-am-jersey-dress', b: 'Best seller', t: 'logo-tamu.jpg', team: 'am', kind: 'W' },
    lsuG: { n: 'LSU Tigers Baseball Jersey Dress - Girls', s: 'LSU Tigers · Girls', p: 88, z: GS, i: ['lsu-girls.jpg', 'lsu-girl-twirl.jpg'], u: '/products/louisiana-state-university%C2%AE-fan-dress-girls', b: 'Twirl-ready', t: 'logo-lsu.png', team: 'lsu', kind: 'G' },
    amG: { n: 'Texas A&M Aggies Baseball Jersey Dress - Girls', s: 'Texas A&M · Girls', p: 88, z: GS, i: ['aggie-girl-twirl.jpg', 'aggie-girls.jpg'], u: '/products/texas-am-jersey-dress-girls', b: 'Twirl-ready', t: 'logo-tamu.jpg', team: 'am', kind: 'G' },
    lsuB: { n: 'LSU Tigers Baseball Jersey Dress - Baby', s: 'LSU Tigers · Baby', p: 78, z: B, i: ['lsu-baby.jpg', 'lsu-baby-2.jpg'], u: '/products/lsu_baby_jersey_dress', b: 'Snap closure', t: 'logo-lsu.png', team: 'lsu', kind: 'B' },
    amB: { n: 'Texas A&M Aggies Baseball Jersey Dress - Baby', s: 'Texas A&M · Baby', p: 78, z: B, i: ['aggie-baby.jpg', 'aggie-baby-2.jpg'], u: '/products/texas-am-jersey-dress-baby', b: 'Snap closure', t: 'logo-tamu.jpg', team: 'am', kind: 'B' },
  };
  const promo = (img, small, title, cta, url, color, span = 2) => ({ img, small, title, cta, url, color, span });

  /* ---------------- best sellers: shop-by-plan ---------------- */
  const PLANS = [
    { k: 'Mommy & me', w: 'matching with my mini', c: '#D2466B', l: '/collections/all', items: ['lsuW', 'lsuG', 'amW', 'amG'] },
    { k: 'For me', w: 'dressing up for me', c: '#25527C', l: '/collections/womens-gameday-dresses', items: ['lsuW', 'amW', promo('aggie-women-drawstring.jpg', 'Women · XS–2XL', 'The drawstring that <em>changed</em> the jersey.', 'Shop Women →', '/collections/womens-gameday-dresses', '#0F1E33')] },
    { k: 'Girls', w: 'dressing my little cheerleader', c: '#E8B547', l: '/collections/girls-gameday-dresses', items: ['lsuG', 'amG', promo('aggie-girl-pompom.jpg', 'Girls · 2T–10/11', 'Built to <em>twirl</em> in the stands.', 'Shop Girls →', '/collections/girls-gameday-dresses', '#500000')] },
    { k: 'Baby', w: 'dressing my littlest fan', c: '#F0A3B5', l: '/collections/infant-dresses', items: ['lsuB', 'amB', promo('lsu-baby-3.jpg', 'Baby · 0–18 months', 'Their <em>first</em> game day, covered.', 'Shop Baby →', '/collections/infant-dresses', '#461D7C')] },
    { k: 'LSU', w: 'yelling “Geaux Tigers!”', c: '#461D7C', l: '/collections/lsu-jersey-dress', items: ['lsuW', 'lsuG', 'lsuB', promo('lsu-girl-pompom.jpg', 'LSU Tigers', 'Purple, gold <em>&amp; ready.</em>', 'Shop LSU →', '/collections/lsu-jersey-dress', '#461D7C', 1)] },
    { k: 'Texas A&M', w: 'shouting “Gig ’em!”', c: '#500000', l: '/collections/texas-am-jersey-dress', items: ['amW', 'amG', 'amB', promo('aggie-girl-pompom-2.jpg', 'Texas A&M', 'Maroon <em>&amp; white.</em>', 'Shop A&M →', '/collections/texas-am-jersey-dress', '#500000', 1)] },
  ];
  const sizes = (key, z) => `<div class="sz">${z.map(s => `<button data-add="${key}" data-size="${s}" aria-label="Add size ${s}">${s}</button>`).join('')}</div>`;
  const card = it => {
    if (typeof it === 'object') return `<a class="promo${it.span === 1 ? ' promo--1' : ''}" href="${STORE}${it.url}" style="--pc:${it.color}" data-cursor="Shop"><img src="images/${it.img}" alt="" loading="lazy"><div><small>${it.small}</small><h3>${it.title}</h3><span>${it.cta}</span></div></a>`;
    const p = P[it];
    return `<article class="card">
      <div class="card__media">
        <a href="${STORE}${p.u}" aria-label="${p.n}" data-cursor="View"><img class="pi" src="images/${p.i[0]}" alt="${p.n}" loading="lazy"><img class="pi" src="images/${p.i[1]}" alt="" loading="lazy"></a>
        <span class="badge${p.b === 'Best seller' ? ' badge--hot' : ''}">${p.b}</span>
        <img class="card__team" src="images/${p.t}" alt="">
        <div class="quick"><p>Quick add · tap a size</p>${sizes(it, p.z)}</div>
      </div>
      <div class="card__info">
        <div><a href="${STORE}${p.u}" class="card__name">${p.n}</a><p class="card__sub">${p.s}</p><p class="card__stars">★★★★★<small>Verified</small></p></div>
        <span class="card__price">$${p.p}</span>
      </div>
      <div class="card__mob">${sizes(it, p.z)}</div>
    </article>`;
  };
  let plan = 0;
  const chips = $('#planChips'), word = $('#planWord'), grid = $('#planGrid'), more = $('#planMore');
  chips.innerHTML = PLANS.map((p, i) => `<button role="tab" data-plan="${i}" aria-selected="${i === 0}" style="--c:${p.c}"><i></i>${p.k}</button>`).join('');
  const setPlan = (i, animate = true) => {
    plan = (i + PLANS.length) % PLANS.length;
    const p = PLANS[plan];
    $$('button', chips).forEach((b, k) => b.setAttribute('aria-selected', k === plan));
    more.href = STORE + p.l;
    const swap = () => { word.textContent = p.w; word.classList.remove('out'); grid.innerHTML = p.items.map(card).join(''); };
    if (animate && !reduce) { word.classList.add('out'); setTimeout(swap, 230); } else swap();
  };
  setPlan(0, false);
  chips.onclick = e => { const b = e.target.closest('[data-plan]'); b && setPlan(+b.dataset.plan); };
  word.onclick = $('#planNext').onclick = () => setPlan(plan + 1);
  $('#planPrev').onclick = () => setPlan(plan - 1);

  /* ---------------- cart drawer ---------------- */
  const FREE = 100;
  let cart = [];
  const drawer = $('#drawer'), scrim = $('#scrim'), bagN = $('#bagCount');
  const openBag = () => { drawer.classList.add('on'); scrim.classList.add('on'); drawer.setAttribute('aria-hidden', 'false'); };
  const closeBag = () => { drawer.classList.remove('on'); scrim.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); };
  $('#bagBtn').onclick = openBag; $('#dClose').onclick = closeBag; scrim.onclick = closeBag; $('#dShop').onclick = closeBag;
  addEventListener('keydown', e => e.key === 'Escape' && closeBag());
  const render = () => {
    const count = cart.reduce((a, c) => a + c.q, 0), sub = cart.reduce((a, c) => a + c.q * P[c.k].p, 0);
    bagN.textContent = count; bagN.classList.add('bump'); setTimeout(() => bagN.classList.remove('bump'), 300);
    $('#dCount').textContent = `(${count})`;
    $('#dSub').textContent = '$' + sub;
    drawer.classList.toggle('empty', !count);
    $('#shipBar').style.width = Math.min(100, sub / FREE * 100) + '%';
    $('#shipTxt').innerHTML = sub >= FREE ? '🎉 You\'ve unlocked <b>free shipping!</b>' : `Add <b>$${FREE - sub}</b> more for <b>free shipping</b>`;
    $('#dItems').innerHTML = cart.map((c, i) => { const p = P[c.k]; return `<li class="ditem"><img src="images/${p.i[0]}" alt=""><div><b>${p.n}</b><small>Size ${c.s}</small><div class="qty"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button>${c.q}<button data-q="${i}" data-d="1" aria-label="Increase">+</button></div></div><span class="p">$${p.p * c.q}</span></li>`; }).join('');
    // upsell: complete the match
    const has = k => cart.some(c => c.k === k);
    let up = null;
    for (const c of cart) {
      const p = P[c.k], mate = p.kind === 'W' ? p.team + 'G' : p.team + 'W';
      if (P[mate] && !has(mate)) { up = mate; break; }
    }
    $('#upsell').innerHTML = up ? `<p>Complete the match ♥</p><div class="up"><img src="images/${P[up].i[0]}" alt=""><div><b>${P[up].n}</b>$${P[up].p}</div><button data-upsell="${up}">+ Add</button></div>` : '';
  };
  const addToCart = (k, s, open = true) => {
    const ex = cart.find(c => c.k === k && c.s === s);
    ex ? ex.q++ : cart.push({ k, s, q: 1 });
    render(); if (open) openBag();
  };
  render();
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]');
    if (a) { e.preventDefault(); addToCart(a.dataset.add, a.dataset.size); return; }
    const q = e.target.closest('[data-quick]');
    if (q) { addToCart(q.dataset.quick, 'M'); return; }
    const d = e.target.closest('[data-q]');
    if (d) { const c = cart[+d.dataset.q]; c.q += +d.dataset.d; if (c.q <= 0) cart.splice(+d.dataset.q, 1); render(); return; }
    const u = e.target.closest('[data-upsell]');
    if (u) { const k = u.dataset.upsell; addToCart(k, P[k].z[2], false); }
  });

  /* ---------------- match your mini bundle ---------------- */
  let team = 'lsu', sW = null, sG = null;
  const mW = $('#mSzW'), mG = $('#mSzG');
  mW.innerHTML = W.map(s => `<button data-ms="W" data-v="${s}">${s}</button>`).join('');
  mG.innerHTML = GS.map(s => `<button data-ms="G" data-v="${s}">${s}</button>`).join('');
  $('#match').addEventListener('click', e => {
    const b = e.target.closest('[data-ms]');
    if (b) { $$('button', b.parentElement).forEach(x => x.classList.toggle('sel', x === b)); b.dataset.ms === 'W' ? sW = b.dataset.v : sG = b.dataset.v; }
    const t = e.target.closest('[data-team]');
    if (t && t.dataset.team !== team) {
      team = t.dataset.team;
      $$('.match__teams button').forEach(x => { x.classList.toggle('on', x === t); x.setAttribute('aria-checked', x === t); });
      const a = $('#mImgA'), g = $('#mImgB');
      [a, g].forEach(x => x.classList.add('swap'));
      setTimeout(() => { a.src = 'images/' + P[team + 'W'].i[0]; g.src = 'images/' + P[team + 'G'].i[0]; [a, g].forEach(x => x.classList.remove('swap')); }, 300);
    }
  });
  $('#matchAdd').onclick = () => {
    if (!sW || !sG) {
      [!sW && mW, !sG && mG].filter(Boolean).forEach(el => { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); });
      return;
    }
    addToCart(team + 'W', sW, false); addToCart(team + 'G', sG);
  };

  /* ---------------- detail zoom ---------------- */
  const zArt = $('#zoomArt'), zImg = $('#zoomImg'), dots = $$('.dot'), feats = $$('#feats li');
  let fI = 0, fT, fIn = false, fUser = false;
  const setFeat = (i, zoom = true) => {
    fI = i;
    dots.forEach(d => d.classList.toggle('on', +d.dataset.i === i));
    feats.forEach(f => { f.classList.remove('on'); void f.offsetWidth; f.classList.toggle('on', +f.dataset.i === i); });
    zImg.style.transformOrigin = feats[i].dataset.o;
    zImg.style.transform = zoom ? 'scale(1.65)' : 'scale(1)';
    zArt.classList.toggle('zoomed', zoom);
    $('#zoomN').textContent = '0' + (i + 1);
  };
  const auto = () => { clearTimeout(fT); if (!fUser && fIn && !reduce) fT = setTimeout(() => { setFeat((fI + 1) % 4); auto(); }, 4500); };
  [...dots, ...feats].forEach(el => el.addEventListener('click', () => {
    fUser = true; clearTimeout(fT);
    const i = +el.dataset.i;
    i === fI && zArt.classList.contains('zoomed') ? setFeat(i, false) : setFeat(i);
  }));
  zImg.addEventListener('click', () => { fUser = true; setFeat(fI, false); });
  new IntersectionObserver(([en]) => { fIn = en.isIntersecting; if (fIn) { setFeat(fI); auto(); } else clearTimeout(fT); }, { threshold: .4 }).observe(zArt);
  setFeat(0, false);

  /* ---------------- scoreboard counters ---------------- */
  const nums = $$('[data-count]');
  if (!reduce) nums.forEach(n => n.textContent = n.dataset.dec ? '0.0' : '0');
  new IntersectionObserver((es, o) => es.forEach(en => {
    if (!en.isIntersecting) return; o.disconnect();
    nums.forEach((n, k) => {
      const to = +n.dataset.count, dec = n.dataset.dec; let v = 0;
      if (reduce) return;
      const step = () => { v++; n.textContent = dec ? (v === to ? to.toFixed(1) : (v + Math.random()).toFixed(1)) : v; v < to && setTimeout(step, 160 + k * 30); };
      setTimeout(step, k * 150);
    });
  }), { threshold: .4 }).observe($('.board'));

  /* ---------------- founder quote: word reveal ---------------- */
  const q = $('#storyQ');
  const hl = ['designed', 'it,', 'patented', 'it,'];
  let hi = 0;
  q.innerHTML = q.textContent.trim().split(/\s+/).map(w => {
    const isHl = hi < hl.length && w === hl[hi] && (hi > 0 || w === 'designed') ? (hi++, true) : false;
    return `<span class="w${isHl ? ' hl' : ''}">${w}</span>`;
  }).join(' ');
  const qw = $$('.w', q);
  const qScroll = () => {
    const r = q.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (innerHeight * .55)));
    const lit = Math.round(p * qw.length);
    qw.forEach((w, i) => w.classList.toggle('lit', i < lit || reduce));
  };
  addEventListener('scroll', qScroll, { passive: true }); qScroll();

  /* ---------------- video modal ---------------- */
  const modal = $('#vidModal'), vid = $('#vid');
  $('#vidOpen').onclick = () => { modal.hidden = false; vid.play().catch(() => {}); };
  const closeV = () => { modal.hidden = true; vid.pause(); };
  $('#vidClose').onclick = closeV;
  modal.addEventListener('click', e => e.target === modal && closeV());
  addEventListener('keydown', e => e.key === 'Escape' && !modal.hidden && closeV());

  /* ---------------- fan club form ---------------- */
  $('#joinForm').addEventListener('submit', e => {
    e.preventDefault();
    const em = $('#joinEmail');
    if (!/^\S+@\S+\.\S+$/.test(em.value)) { em.classList.add('err'); em.focus(); return; }
    em.classList.remove('err');
    $('.join__fields').style.display = 'none';
    $('#joinOk').hidden = false;
  });

  /* ---------------- journal hover image ---------------- */
  const jf = $('#jfloat'), jImg = $('img', jf);
  if (fine) {
    let jx = 0, jy = 0, tx = 0, ty = 0, run = false;
    const jl = () => { jx += (tx - jx) * .14; jy += (ty - jy) * .14; jf.style.transform = `translate(${jx - 130}px,${jy - 170}px)`; if (run) requestAnimationFrame(jl); };
    $$('#jlist a').forEach(a => {
      a.addEventListener('mouseenter', () => { jImg.src = a.dataset.img; jf.classList.add('on'); if (!run) { run = true; jl(); } });
      a.addEventListener('mouseleave', () => { jf.classList.remove('on'); run = false; });
      a.addEventListener('mousemove', e => { tx = e.clientX + 140; ty = e.clientY; });
    });
  }

  /* ---------------- reveals + parallax ---------------- */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.who__head, .best__top, .plan__q, .match__panel, .detail__copy, .teams__head, .lic, .nana__copy, .score__copy, .story__copy, .revs__top, .rev, .ticket, .faq__side, .qa, .journal__head, .jlist li, .final__in, .ftr__top').forEach(el => { el.classList.add('rv'); io.observe(el); });
  if (G && window.ScrollTrigger && !reduce) {
    G.fromTo('.final__img', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom top', scrub: true } });
    G.fromTo('.match__b', { y: 80 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.match', start: 'top bottom', end: 'bottom top', scrub: true } });
    G.fromTo('.nana__sub', { y: 90 }, { y: -30, ease: 'none', scrollTrigger: { trigger: '.nana', start: 'top bottom', end: 'bottom top', scrub: true } });
    G.fromTo('.story__pol', { y: 80 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });
    G.fromTo('.score__img', { y: 60, rotate: 6 }, { y: -40, rotate: 0, ease: 'none', scrollTrigger: { trigger: '.score', start: 'top bottom', end: 'bottom top', scrub: true } });
    G.from('.ftr__word', { yPercent: 40, opacity: 0, ease: 'expo.out', duration: 1.6, scrollTrigger: { trigger: '.ftr__word', start: 'top 95%' } });
  }
})();
