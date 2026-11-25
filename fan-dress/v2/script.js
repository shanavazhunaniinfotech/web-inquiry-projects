(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const STORE = 'https://fandress.com', IMG = '../images/';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  document.documentElement.classList.add('js');

  /* countdown */
  const end = new Date('2026-11-28T23:59:00-06:00').getTime();
  const tick = () => {
    const s = Math.max(0, (end - Date.now()) / 1000);
    const v = { d: Math.floor(s / 86400), h: String(Math.floor(s % 86400 / 3600)).padStart(2, '0'), m: String(Math.floor(s % 3600 / 60)).padStart(2, '0') };
    ['d', 'h', 'm'].forEach(k => $$('.cd-' + k).forEach(el => el.textContent = v[k]));
  };
  tick(); setInterval(tick, 30000);

  /* header */
  const mcta = $('#mcta');
  const onScroll = () => mcta.classList.toggle('show', scrollY > 700 && innerHeight + scrollY < document.body.scrollHeight - 600);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('#burger'), mnav = $('#mnav');
  burger.onclick = () => { const o = burger.getAttribute('aria-expanded') !== 'true'; burger.setAttribute('aria-expanded', o); mnav.classList.toggle('open', o); };
  $$('a', mnav).forEach(a => a.addEventListener('click', () => { burger.setAttribute('aria-expanded', false); mnav.classList.remove('open'); }));
  const dd = $('.dd');
  $('.dd__btn').onclick = () => { const o = dd.classList.toggle('open'); $('.dd__btn').setAttribute('aria-expanded', o); };
  document.addEventListener('click', e => { if (!dd.contains(e.target)) dd.classList.remove('open'); });

  /* hero slider · 6s wipe */
  const slides = $$('#heroStage .hs'), thumbs = $('#heroThumbs'), look = $('#heroLook'), lab = $('#heroLabel'), hnum = $('#heroNum');
  thumbs.innerHTML = slides.map((f, k) => `<button role="tab" aria-label="Look ${k + 1}" class="${k ? '' : 'on'}"><img src="${f.dataset.thumb}" alt=""></button>`).join('');
  const tb = $$('button', thumbs);
  let hI = 0, hT;
  const restart = () => { clearTimeout(hT); if (!reduce) hT = setTimeout(() => heroGo((hI + 1) % slides.length), 6000); };
  const heroGo = n => {
    if (n === hI) return;
    slides.forEach(f => f.classList.remove('prev'));
    slides[hI].classList.remove('on'); slides[hI].classList.add('prev');
    hI = n; slides[hI].classList.add('on');
    tb.forEach(b => b.classList.remove('on')); void tb[hI].offsetWidth; tb[hI].classList.add('on');
    lab.innerHTML = slides[hI].dataset.label; look.href = slides[hI].dataset.href;
    hnum.textContent = `0${hI + 1} / 0${slides.length}`;
    restart();
  };
  tb.forEach((b, k) => b.onclick = () => heroGo(k));
  restart();


  /* what · enlarge thumbnail on hover / tap */
  const zp = document.createElement('div'); zp.className = 'zprev'; zp.innerHTML = '<img alt="">'; document.body.appendChild(zp);
  const zImg = zp.querySelector('img');
  let zOn = null;
  const zShow = el => {
    zOn = el; zImg.src = el.querySelector('img').src;
    const place = () => {
      const r = el.getBoundingClientRect(), w = zp.offsetWidth, h = zp.offsetHeight || w * 1.3;
      let x = r.left + r.width / 2 - w / 2, y = r.top + r.height / 2 - h / 2;
      x = Math.max(12, Math.min(innerWidth - w - 12, x)); y = Math.max(12, Math.min(innerHeight - h - 12, y));
      zp.style.left = x + 'px'; zp.style.top = y + 'px';
      zp.style.transformOrigin = `${r.left + r.width / 2 - x}px ${r.top + r.height / 2 - y}px`;
    };
    zImg.complete ? place() : (zImg.onload = place); place();
    requestAnimationFrame(() => zp.classList.add('on'));
  };
  const zHide = () => { zOn = null; zp.classList.remove('on'); };
  document.querySelectorAll('.pillimg').forEach(el => {
    el.addEventListener('mouseenter', () => fine && zShow(el));
    el.addEventListener('mouseleave', () => fine && zHide());
    el.addEventListener('click', e => { if (fine) return; e.stopPropagation(); zOn === el ? zHide() : zShow(el); });
  });
  document.addEventListener('click', () => !fine && zOn && zHide());
  addEventListener('scroll', () => zOn && zHide(), { passive: true });

  /* products */
  const W = ['XS', 'S', 'M', 'L', 'XL', '2XL'], GS = ['2T', '3T', '4T', '5T', '6/7', '8/9', '10/11'], B = ['0-3m', '6-9m', '12-18m'];
  const TEAM = { lsu: { n: 'LSU Tigers', c: '#461D7C' }, am: { n: 'Texas A&M', c: '#500000' } };
  const KIND = { W: ['Women', 'XS–2XL', 'Drawstring waist'], G: ['Girls', '2T–10/11', 'Twirl skirt'], B: ['Baby', '0–18 mo', 'Snap closure'] };
  const P = {
    lsuW: { n: "LSU Women's Baseball Jersey Dress", p: 148, z: W, i: ['lsu-women.jpg', 'lsu-women-2.jpg'], u: '/products/lsu_jeresy_dress', b: 'Best seller', team: 'lsu', kind: 'W' },
    amW: { n: "Texas A&M Women's Baseball Jersey Dress", p: 148, z: W, i: ['aggie-women.jpg', 'aggie-women-drawstring.jpg'], u: '/products/texas-am-jersey-dress', b: 'Best seller', team: 'am', kind: 'W' },
    lsuG: { n: 'LSU Tigers Jersey Dress · Girls', p: 88, z: GS, i: ['lsu-girls.jpg', 'lsu-girl-twirl.jpg'], u: '/products/louisiana-state-university%C2%AE-fan-dress-girls', b: 'Twirl-ready', team: 'lsu', kind: 'G' },
    amG: { n: 'Texas A&M Aggies Jersey Dress · Girls', p: 88, z: GS, i: ['aggie-girl-twirl.jpg', 'aggie-girls.jpg'], u: '/products/texas-am-jersey-dress-girls', b: 'Twirl-ready', team: 'am', kind: 'G' },
    lsuB: { n: 'LSU Tigers Jersey Dress · Baby', p: 78, z: B, i: ['lsu-baby.jpg', 'lsu-baby-2.jpg'], u: '/products/lsu_baby_jersey_dress', b: 'Little fan', team: 'lsu', kind: 'B' },
    amB: { n: 'Texas A&M Aggies Jersey Dress · Baby', p: 78, z: B, i: ['aggie-baby.jpg', 'aggie-baby-2.jpg'], u: '/products/texas-am-jersey-dress-baby', b: 'Little fan', team: 'am', kind: 'B' },
  };
  const promo = (img, small, title, cta, url, color, span = 2) => ({ img, small, title, cta, url, color, span });
  const PLANS = [
    { k: 'Mommy & me', w: 'matching with my mini', l: '/collections/all', items: ['lsuW', 'lsuG', 'amW', 'amG'] },
    { k: 'For me', w: 'dressing up for me', l: '/collections/womens-gameday-dresses', items: ['lsuW', 'amW', promo('aggie-women-drawstring.jpg', 'Women · XS–2XL', 'The drawstring that <em>changed</em> the jersey.', 'Shop Women →', '/collections/womens-gameday-dresses', '#1E3A5F')] },
    { k: 'Girls', w: 'dressing my little cheerleader', l: '/collections/girls-gameday-dresses', items: ['lsuG', 'amG', promo('aggie-girl-pompom.jpg', 'Girls · 2T–10/11', 'Built to <em>twirl</em> in the stands.', 'Shop Girls →', '/collections/girls-gameday-dresses', '#500000')] },
    { k: 'Baby', w: 'dressing my littlest fan', l: '/collections/infant-dresses', items: ['lsuB', 'amB', promo('lsu-baby-3.jpg', 'Baby · 0–18 months', 'Their <em>first</em> game day.', 'Shop Baby →', '/collections/infant-dresses', '#461D7C')] },
    { k: 'LSU', w: 'cheering for the Tigers', l: '/collections/lsu-jersey-dress', items: ['lsuW', 'lsuG', 'lsuB', promo('lsu-girl-pompom.jpg', 'LSU Tigers', 'Purple, gold <em>&amp; ready.</em>', 'Shop LSU →', '/collections/lsu-jersey-dress', '#461D7C', 1)] },
    { k: 'Texas A&M', w: 'cheering for the Aggies', l: '/collections/texas-am-jersey-dress', items: ['amW', 'amG', 'amB', promo('aggie-girl-pompom-2.jpg', 'Texas A&M', 'Maroon <em>&amp; white.</em>', 'Shop A&M →', '/collections/texas-am-jersey-dress', '#500000', 1)] },
  ];
  const sizes = (key, z) => `<div class="sz">${z.map(s => `<button data-add="${key}" data-size="${s}" aria-label="Add size ${s}">${s}</button>`).join('')}</div>`;
  const card = it => {
    if (typeof it === 'object') return `<a class="promo${it.span === 1 ? ' promo--1' : ''}" href="${STORE}${it.url}" style="--pc:${it.color}"><img src="${IMG}${it.img}" alt="" loading="lazy"><div><small>${it.small}</small><h3>${it.title}</h3><span>${it.cta}</span></div></a>`;
    const p = P[it], t = TEAM[p.team], k = KIND[p.kind];
    return `<article class="pc">
      <div class="pc__media">
        <a href="${STORE}${p.u}" aria-label="${p.n}"><img class="pi" src="${IMG}${p.i[0]}" alt="${p.n}" loading="lazy"><img class="pi" src="${IMG}${p.i[1]}" alt="" loading="lazy"></a>
        <span class="pc__badge${p.b === 'Best seller' ? ' pc__badge--hot' : ''}">${p.b}</span>
        <div class="pc__sizes"><p>Select size</p>${sizes(it, p.z)}</div>
        <button class="pc__add" data-pick aria-label="Quick add ${p.n}">+</button>
      </div>
      <div class="pc__info"><div><p class="pc__team" style="--tc:${t.c}"><i></i>${t.n} · ${k[0]}</p><a class="pc__name" href="${STORE}${p.u}">${p.n}</a></div><span class="pc__price">$${p.p}</span></div>
      <div class="pc__meta"><span>★ 5.0</span><span>${k[1]}</span><span>${k[2]}</span></div>
    </article>`;
  };
  let plan = 0;
  const seg = $('#planChips'), ind = $('#segInd'), word = $('#planWord'), grid = $('#planGrid'), more = $('#planMore');
  seg.insertAdjacentHTML('beforeend', PLANS.map((p, i) => `<button role="tab" data-plan="${i}" aria-selected="${i === 0}">${p.k}</button>`).join(''));
  const moveInd = () => { const b = $(`[data-plan="${plan}"]`, seg); ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translate(${b.offsetLeft - 5}px,${b.offsetTop - 5}px)`; };
  const setPlan = (i, animate = true) => {
    plan = (i + PLANS.length) % PLANS.length;
    const p = PLANS[plan];
    $$('[data-plan]', seg).forEach((b, k) => b.setAttribute('aria-selected', k === plan));
    moveInd(); more.href = STORE + p.l;
    const swap = () => { word.textContent = p.w; word.classList.remove('out'); grid.innerHTML = p.items.map(card).join(''); };
    if (animate && !reduce) { word.classList.add('out'); setTimeout(swap, 220); } else swap();
  };
  setPlan(0, false);
  addEventListener('resize', moveInd); document.fonts && document.fonts.ready.then(moveInd);
  seg.onclick = e => { const b = e.target.closest('[data-plan]'); b && setPlan(+b.dataset.plan); };
  word.onclick = $('#planNext').onclick = () => setPlan(plan + 1);
  $('#planPrev').onclick = () => setPlan(plan - 1);

  /* bag drawer */
  const FREE = 100, cart = [];
  const drawer = $('#drawer'), scrim = $('#scrim'), bagN = $('#bagCount');
  const openBag = () => { drawer.classList.add('on'); scrim.classList.add('on'); drawer.setAttribute('aria-hidden', 'false'); };
  const closeBag = () => { drawer.classList.remove('on'); scrim.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); };
  $('#bagBtn').onclick = openBag; $('#dClose').onclick = closeBag; scrim.onclick = closeBag; $('#dShop').onclick = closeBag;
  addEventListener('keydown', e => e.key === 'Escape' && closeBag());
  const render = () => {
    const count = cart.reduce((a, c) => a + c.q, 0), sub = cart.reduce((a, c) => a + c.q * P[c.k].p, 0);
    bagN.textContent = count; bagN.classList.add('bump'); setTimeout(() => bagN.classList.remove('bump'), 300);
    $('#dCount').textContent = `(${count})`; $('#dSub').textContent = '$' + sub;
    drawer.classList.toggle('empty', !count);
    $('#shipBar').style.width = Math.min(100, sub / FREE * 100) + '%';
    $('#shipTxt').innerHTML = sub >= FREE ? 'You\'ve unlocked <b>free shipping</b> 🎉' : `Add <b>$${FREE - sub}</b> more for <b>free shipping</b>`;
    $('#dItems').innerHTML = cart.map((c, i) => { const p = P[c.k]; return `<li class="ditem"><img src="${IMG}${p.i[0]}" alt=""><div><b>${p.n}</b><small>Size ${c.s}</small><div class="qty"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button>${c.q}<button data-q="${i}" data-d="1" aria-label="Increase">+</button></div></div><span class="p">$${p.p * c.q}</span></li>`; }).join('');
    let up = null;
    for (const c of cart) { const p = P[c.k], mate = p.kind === 'W' ? p.team + 'G' : p.team + 'W'; if (P[mate] && !cart.some(x => x.k === mate)) { up = mate; break; } }
    $('#upsell').innerHTML = up ? `<p>Complete the match ♥</p><div class="up"><img src="${IMG}${P[up].i[0]}" alt=""><div><b>${P[up].n}</b>$${P[up].p}</div><button data-upsell="${up}">+ Add</button></div>` : '';
  };
  const addToCart = (k, s, open = true) => { const ex = cart.find(c => c.k === k && c.s === s); ex ? ex.q++ : cart.push({ k, s, q: 1 }); render(); if (open) openBag(); };
  render();
  document.addEventListener('click', e => {
    const pk = e.target.closest('[data-pick]');
    if (pk) { const c = pk.closest('.pc'); $$('.pc.pick').forEach(x => x !== c && x.classList.remove('pick')); c.classList.toggle('pick'); return; }
    const a = e.target.closest('[data-add]');
    if (a) { e.preventDefault(); a.closest('.pc')?.classList.remove('pick'); addToCart(a.dataset.add, a.dataset.size); return; }
    const d = e.target.closest('[data-q]');
    if (d) { const c = cart[+d.dataset.q]; c.q += +d.dataset.d; if (c.q <= 0) cart.splice(+d.dataset.q, 1); render(); return; }
    const u = e.target.closest('[data-upsell]');
    if (u) addToCart(u.dataset.upsell, P[u.dataset.upsell].z[2], false);
  });

  /* match your mini */
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
      $$('.tteams button').forEach(x => { x.classList.toggle('on', x === t); x.setAttribute('aria-checked', x === t); });
      const a = $('#mImgA'), g = $('#mImgB');
      [a, g].forEach(x => x.classList.add('swap'));
      setTimeout(() => { a.src = IMG + P[team + 'W'].i[0]; g.src = IMG + P[team + 'G'].i[0]; [a, g].forEach(x => x.classList.remove('swap')); }, 300);
    }
  });
  $('#matchAdd').onclick = () => {
    if (!sW || !sG) { [!sW && mW, !sG && mG].filter(Boolean).forEach(el => { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }); return; }
    addToCart(team + 'W', sW, false); addToCart(team + 'G', sG);
  };

  /* why: features <-> hotspots, comparison toggle */
  const feats = $$('.feat'), dots = $$('.wb--img .dot');
  const setWhy = i => { feats.forEach(f => f.classList.toggle('on', +f.dataset.i === i)); dots.forEach(d => d.classList.toggle('on', +d.dataset.i === i)); };
  [...feats, ...dots].forEach(el => { el.addEventListener('mouseenter', () => setWhy(+el.dataset.i)); el.addEventListener('click', () => setWhy(+el.dataset.i)); });
  setWhy(0);
  const cmp = $('#cmpList');
  $$('[data-cmp]').forEach(b => b.onclick = () => { $$('[data-cmp]').forEach(x => x.classList.toggle('on', x === b)); cmp.dataset.mode = b.dataset.cmp; });

  /* counters */
  const nums = $$('[data-count]');
  if (!reduce) nums.forEach(n => n.textContent = n.dataset.dec ? '0.0' : '0');
  new IntersectionObserver((es, o) => es.forEach(en => {
    if (!en.isIntersecting || reduce) return; o.disconnect();
    nums.forEach(n => {
      const to = +n.dataset.count, dec = n.dataset.dec, dur = 1200, t0 = performance.now();
      const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3), v = to * e; n.textContent = dec ? v.toFixed(1) : Math.round(v); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }), { threshold: .4 }).observe($('.cert'));

  /* reviews (real, verified Judge.me reviews) */
  const R = [
    ['Lauren', 'Sep 2, 2026', "Texas A&M Girls' Jersey Dress", 'The cutest dresses for girlies!', 'The cutest dresses for girlies! So well made and high quality.'],
    ['Connie P.', 'May 5, 2026', "Texas A&M Women's Jersey Dress", 'Perfect baseball outfit', 'Love, love, love my new baseball Fan Dress! It is sooooo cute, comfortable, and LOTS of compliments. ⚾️🥰'],
    ['Chad Y.', 'Jun 29, 2026', "LSU Women's Jersey Dress", 'Five star!', 'Gorgeous dress! Love the details!'],
    ['Dorothy', 'Jul 7, 2023', 'Phillies Fan Dress · Girls (past collection)', 'Just what every little fan is missing', 'Watch your little one twirl with every home run! They are very well made and easy to wash. So glad we found this dress.'],
    ['Hayley M.', 'Apr 8, 2023', 'Astros Fan Dress · Girls (past collection)', 'So cute!', 'Have gotten so many compliments on it and my daughter loves twirling in it :)'],
    ['AmySue', 'Oct 18, 2023', "Astros Fan Dress · Women's (past collection)", 'Worth it!', "I love it!!! My splurge purchase of the year! Worth it! Let's go Astros!"],
    ['Kris', 'Apr 19, 2024', 'Yankees Fan Dress · Girls (past collection)', 'Great craftsmanship', 'Beautiful dress, great craftsmanship, and super fast delivery.'],
    ['Debra K.M.', 'Aug 28, 2023', 'Astros Fan Dress · Girls (past collection)', 'So precious!', 'So precious! Fit perfect and she got so many compliments!'],
    ['Lea', 'Apr 4, 2024', "Astros Fan Dress · Women's (past collection)", 'Great fit', 'Great fit, very comfortable, made well.'],
    ['Amber', 'Jul 4, 2024', 'Astros Fan Dress · Girls (past collection)', 'Worth the price', "Love the quality, it's honestly worth the price."],
    ['leslie p.', 'Jul 26, 2023', 'Rangers Fan Dress · Girls (past collection)', 'Granddaughter approved', 'The dress was adorable and our granddaughter loved it for the Rangers game!'],
    ['Melissa', 'Oct 20, 2023', 'Astros Fan Dress · Girls (past collection)', 'Most adorable dress', 'Great quality work and fits perfect! Most adorable dress!'],
  ];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const rail = $('#revRail');
  rail.innerHTML = R.map(([n, d, p, t, b]) => `<article class="rv-card"><p class="stars">★★★★★</p><h3>“${esc(t)}”</h3><p>${esc(b)}</p><footer><span class="av">${n[0].toUpperCase()}</span><div><b>${esc(n)}<em>Verified</em></b><span>${esc(p)} · ${d}</span></div></footer></article>`).join('');
  const stepW = () => ($('.rv-card', rail)?.offsetWidth || 320) + 14;
  $('#revNext').onclick = () => rail.scrollBy({ left: stepW(), behavior: 'smooth' });
  $('#revPrev').onclick = () => rail.scrollBy({ left: -stepW(), behavior: 'smooth' });
  let down = false, sx = 0, sl = 0;
  rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('drag'); });
  addEventListener('pointermove', e => { if (down) rail.scrollLeft = sl - (e.clientX - sx); });
  addEventListener('pointerup', () => { if (down) { down = false; rail.classList.remove('drag'); } });

  /* video */
  const modal = $('#vidModal'), vid = $('#vid');
  $('#vidOpen').onclick = () => { modal.hidden = false; vid.play().catch(() => {}); };
  const closeV = () => { modal.hidden = true; vid.pause(); };
  $('#vidClose').onclick = closeV;
  modal.addEventListener('click', e => e.target === modal && closeV());
  addEventListener('keydown', e => e.key === 'Escape' && !modal.hidden && closeV());

  /* fan club */
  $('#joinForm').addEventListener('submit', e => {
    e.preventDefault();
    const em = $('#joinEmail');
    if (!/^\S+@\S+\.\S+$/.test(em.value)) { em.classList.add('err'); em.focus(); return; }
    $('.join__f').style.display = 'none'; $('#joinOk').hidden = false;
  });

  /* reveals */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .1, rootMargin: '0px 0px -30px 0px' });
  $$('.head, .bento, .what, .mcard, .wbento, .tgrid, .lic, .nana, .cert, .story, .ugc, .club, .faq, .mag, .stands').forEach(el => { el.classList.add('rv'); io.observe(el); });
})();
