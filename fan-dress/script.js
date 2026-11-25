(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const STORE = 'https://fandress.com';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header ---------- */
  const hdr = $('#hdr'), mcta = $('#mcta');
  const onScroll = () => {
    hdr.classList.toggle('scrolled', scrollY > 20);
    mcta.classList.toggle('show', scrollY > 700 && innerHeight + scrollY < document.body.scrollHeight - 500);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('#burger'), mnav = $('#mnav');
  burger.onclick = () => {
    const o = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', o); mnav.classList.toggle('open', o);
  };
  $$('#mnav a').forEach(a => a.addEventListener('click', () => { burger.setAttribute('aria-expanded', false); mnav.classList.remove('open'); }));
  const dd = $('.dd');
  $('.dd__btn').onclick = () => { const o = dd.classList.toggle('open'); $('.dd__btn').setAttribute('aria-expanded', o); };
  document.addEventListener('click', e => { if (!dd.contains(e.target)) dd.classList.remove('open'); });

  /* ---------- products (real catalog from fandress.com) ---------- */
  const W = ['XS', 'S', 'M', 'L', 'XL', '2XL'], G = ['2T', '3T', '4T', '5T', '6/7', '8/9', '10/11'], B = ['0-3m', '6-9m', '12-18m'];
  const P = {
    lsuW: { n: "LSU Women's Baseball Jersey Dress", s: 'LSU Tigers · Women', p: 148, z: W, i: ['lsu-women.jpg', 'lsu-women-2.jpg'], u: '/products/lsu_jeresy_dress', b: 'Best seller', t: 'logo-lsu.png' },
    amW: { n: "Texas A&M Women's Baseball Jersey Dress", s: 'Texas A&M · Women', p: 148, z: W, i: ['aggie-women.jpg', 'aggie-women-drawstring.jpg'], u: '/products/texas-am-jersey-dress', b: 'Best seller', t: 'logo-tamu.jpg' },
    lsuG: { n: 'LSU Tigers Baseball Jersey Dress - Girls', s: 'LSU Tigers · Girls', p: 88, z: G, i: ['lsu-girls.jpg', 'lsu-girl-twirl.jpg'], u: '/products/louisiana-state-university%C2%AE-fan-dress-girls', b: 'Twirl-ready', t: 'logo-lsu.png' },
    amG: { n: 'Texas A&M Aggies Baseball Jersey Dress - Girls', s: 'Texas A&M · Girls', p: 88, z: G, i: ['aggie-girl-twirl.jpg', 'aggie-girls.jpg'], u: '/products/texas-am-jersey-dress-girls', b: 'Twirl-ready', t: 'logo-tamu.jpg' },
    lsuB: { n: 'LSU Tigers Baseball Jersey Dress - Baby', s: 'LSU Tigers · Baby', p: 78, z: B, i: ['lsu-baby.jpg', 'lsu-baby-2.jpg'], u: '/products/lsu_baby_jersey_dress', b: 'Snap closure', t: 'logo-lsu.png' },
    amB: { n: 'Texas A&M Aggies Baseball Jersey Dress - Baby', s: 'Texas A&M · Baby', p: 78, z: B, i: ['aggie-baby.jpg', 'aggie-baby-2.jpg'], u: '/products/texas-am-jersey-dress-baby', b: 'Snap closure', t: 'logo-tamu.jpg' },
  };
  const promo = (img, small, title, cta, url, color, span = 2) => ({ promo: true, img, small, title, cta, url, color, span });

  /* ---------- best sellers: shop-by-plan picker ---------- */
  const PLANS = [
    { k: 'Mommy & me', w: 'matching with my mini', c: '#C2496A', l: '/collections/all', items: ['lsuW', 'lsuG', 'amW', 'amG'] },
    { k: 'For me', w: 'dressing up for me', c: '#25527C', l: '/collections/womens-gameday-dresses', items: ['lsuW', 'amW', promo('aggie-women-drawstring.jpg', 'Women · XS–2XL', 'The patented drawstring that changes the jersey.', 'Shop Women →', '/collections/womens-gameday-dresses', '#14263D')] },
    { k: 'Girls', w: 'dressing my little cheerleader', c: '#D9B45A', l: '/collections/girls-gameday-dresses', items: ['lsuG', 'amG', promo('aggie-girl-pompom.jpg', 'Girls · 2T–10/11', 'A built-in skirt made for twirling in the stands.', 'Shop Girls →', '/collections/girls-gameday-dresses', '#500000')] },
    { k: 'Baby', w: 'dressing my littlest fan', c: '#E7A3B3', l: '/collections/infant-dresses', items: ['lsuB', 'amB', promo('lsu-baby-3.jpg', 'Baby · 0–18 months', 'Their very first game day, covered.', 'Shop Baby →', '/collections/infant-dresses', '#461D7C')] },
    { k: 'LSU', w: 'yelling “Geaux Tigers!”', c: '#461D7C', l: '/collections/lsu-jersey-dress', items: ['lsuW', 'lsuG', 'lsuB', promo('lsu-girl-pompom.jpg', 'LSU Tigers', 'Purple, gold & ready.', 'Shop LSU →', '/collections/lsu-jersey-dress', '#461D7C', 1)] },
    { k: 'Texas A&M', w: 'shouting “Gig ’em!”', c: '#500000', l: '/collections/texas-am-jersey-dress', items: ['amW', 'amG', 'amB', promo('aggie-girl-pompom-2.jpg', 'Texas A&M Aggies', 'Maroon & white, all day.', 'Shop A&M →', '/collections/texas-am-jersey-dress', '#500000', 1)] },
  ];
  const sizes = (key, z) => `<div class="sz">${z.map(s => `<button data-add="${key}" data-size="${s}" aria-label="Add size ${s}">${s}</button>`).join('')}</div>`;
  const card = it => {
    if (typeof it === 'object') return `<a class="promo${it.span === 1 ? ' promo--1' : ''}" href="${STORE}${it.url}" style="--pc:${it.color}"><img src="images/${it.img}" alt="" loading="lazy"><div><small>${it.small}</small><h3>${it.title}</h3><span>${it.cta}</span></div></a>`;
    const p = P[it];
    return `<article class="card">
      <div class="card__media">
        <a class="card__img" href="${STORE}${p.u}" aria-label="${p.n}">
          <img src="images/${p.i[0]}" alt="${p.n}" loading="lazy"><img src="images/${p.i[1]}" alt="" loading="lazy">
        </a>
        <span class="card__badge${p.b === 'Best seller' ? ' card__badge--hot' : ''}">${p.b}</span>
        <img class="card__team" src="images/${p.t}" alt="">
        <div class="card__quick"><p>Quick add · pick a size</p>${sizes(it, p.z)}</div>
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
  function setPlan(i, animate = true) {
    plan = (i + PLANS.length) % PLANS.length;
    const p = PLANS[plan];
    $$('button', chips).forEach((b, k) => b.setAttribute('aria-selected', k === plan));
    more.href = STORE + p.l;
    const swap = () => { word.textContent = p.w; word.classList.remove('out'); grid.innerHTML = p.items.map(card).join(''); };
    if (animate && !reduce) { word.classList.add('out'); setTimeout(swap, 220); } else swap();
  }
  setPlan(0, false);
  chips.onclick = e => { const b = e.target.closest('[data-plan]'); b && setPlan(+b.dataset.plan); };
  word.onclick = $('#planNext').onclick = () => setPlan(plan + 1);
  $('#planPrev').onclick = () => setPlan(plan - 1);

  /* ---------- quick add (demo cart) ---------- */
  let count = 0, tt;
  const cc = $('#cartCount'), toast = $('#toast');
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    e.preventDefault();
    const p = P[b.dataset.add];
    count++; cc.textContent = count; cc.classList.add('bump'); setTimeout(() => cc.classList.remove('bump'), 300);
    toast.innerHTML = `<img src="images/${p.i[0]}" alt=""><span>Added <b>${p.s}</b> · size ${b.dataset.size}</span>`;
    toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2600);
  });

  /* ---------- feature hotspots ---------- */
  const hs = $$('.hs'), feats = $$('#feat li');
  const setFeat = i => { hs.forEach(h => h.classList.toggle('on', +h.dataset.i === i)); feats.forEach(f => f.classList.toggle('on', +f.dataset.i === i)); };
  [...hs, ...feats].forEach(el => { el.addEventListener('click', () => setFeat(+el.dataset.i)); el.addEventListener('mouseenter', () => matchMedia('(hover:hover)').matches && setFeat(+el.dataset.i)); });
  setFeat(0);

  /* ---------- video modal ---------- */
  const modal = $('#vidModal'), vid = $('#vid');
  $('#vidOpen').onclick = () => { modal.hidden = false; vid.play().catch(() => {}); };
  const close = () => { modal.hidden = true; vid.pause(); };
  $('#vidClose').onclick = close;
  modal.addEventListener('click', e => e.target === modal && close());
  addEventListener('keydown', e => e.key === 'Escape' && !modal.hidden && close());

  /* ---------- signup (Klaviyo placeholder) ---------- */
  $('#joinForm').addEventListener('submit', e => {
    e.preventDefault();
    const em = $('#joinEmail');
    if (!/^\S+@\S+\.\S+$/.test(em.value)) { em.classList.add('err'); em.focus(); return; }
    em.classList.remove('err');
    $('.join__fields').style.display = 'none';
    $('#joinOk').hidden = false;
  });

  /* ---------- counters + reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    $$('[data-count]', en.target).forEach(n => {
      const to = +n.dataset.count; let v = 0;
      const step = () => { n.textContent = ++v; v < to && setTimeout(step, 180); };
      reduce ? (n.textContent = to) : step();
    });
    io.unobserve(en.target);
  }), { threshold: .12 });
  $$('.head, .what__intro, .eq, .why__copy, .teams__grid, .lic, .nana__copy, .pat__copy, .story__copy, .revs__grid, .fit__in, .join__card, .faq__grid, .blog__grid, .final__in, .cats__grid').forEach(el => { el.classList.add('rv'); io.observe(el); });
})();
