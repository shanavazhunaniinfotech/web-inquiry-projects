/* Petal & Post — homepage concept. Card art is generated as SVG placeholders. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- CARD ART LIBRARY (placeholder artwork) ---------- */
  const petals = (cx, cy, r, n, fill, rot = 0) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i + rot;
      s += `<ellipse cx="${cx}" cy="${cy - r}" rx="${r * 0.55}" ry="${r}" fill="${fill}" transform="rotate(${a} ${cx} ${cy})"/>`;
    }
    return s;
  };
  const rnd = (seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280)(7);

  const ART = {
    bloom: { bg: '#F3D7CB', ink: '#3A2626', pos: 'bottom',
      svg: () => `<g transform="translate(4 -14) scale(.92)">${petals(30, 40, 13, 6, '#C9604A')}<circle cx="30" cy="40" r="6" fill="#E8B04B"/>
        ${petals(72, 28, 9, 5, '#2F4A3A', 20)}<circle cx="72" cy="28" r="4" fill="#F3EBDD"/>
        ${petals(64, 70, 15, 8, '#E9927A', 10)}<circle cx="64" cy="70" r="7" fill="#5B2E48"/>
        <path d="M30 53 C28 80 40 90 36 110M64 85 C66 100 60 108 62 120" stroke="#2F4A3A" stroke-width="1.6" fill="none"/>
        <ellipse cx="25" cy="88" rx="8" ry="3.5" fill="#2F4A3A" transform="rotate(-30 25 88)"/></g>` },
    confetti: { bg: '#FFF4D6', ink: '#1E2430', pos: 'center',
      svg: () => { let s = ''; const c = ['#E9927A', '#2F4A3A', '#5B2E48', '#D79B3C', '#7FA7C9'];
        for (let i = 0; i < 42; i++) { const x = rnd() * 100, y = rnd() * 140, col = c[i % 5];
          s += i % 3 ? `<rect x="${x}" y="${y}" width="5" height="2.4" rx="1" fill="${col}" transform="rotate(${rnd() * 180} ${x} ${y})"/>` : `<circle cx="${x}" cy="${y}" r="1.8" fill="${col}"/>`; }
        return s; } },
    sun: { bg: '#E9B44C', ink: '#FFF4E6', pos: 'bottom',
      svg: () => `<circle cx="50" cy="56" r="24" fill="#F7E3B5"/>${[...Array(16)].map((_, i) => `<rect x="49" y="18" width="2" height="10" rx="1" fill="#F7E3B5" transform="rotate(${i * 22.5} 50 56)"/>`).join('')}
        <path d="M0 100 Q25 88 50 100 T100 100 V140 H0Z" fill="#C9604A"/><path d="M0 112 Q25 102 50 112 T100 112 V140 H0Z" fill="#3A2626" opacity=".85"/>` },
    pine: { bg: '#1F3A2E', ink: '#E9CF8E', pos: 'top',
      svg: () => `${[[30, 60, 1], [55, 50, 1.3], [78, 66, .9]].map(([x, y, k]) => `<path d="M${x} ${y} l${-12 * k} ${22 * k} h${7 * k} l${-9 * k} ${16 * k} h${8 * k} l${-10 * k} ${18 * k} h${32 * k} l${-10 * k} ${-18 * k} h${8 * k} l${-9 * k} ${-16 * k} h${7 * k}z" fill="#3E6B52"/>`).join('')}
        ${[...Array(26)].map(() => `<circle cx="${rnd() * 100}" cy="${rnd() * 140}" r="${.5 + rnd()}" fill="#F3EBDD" opacity=".8"/>`).join('')}
        <path d="M55 42 l2 4 4 .5 -3 3 1 4 -4-2 -4 2 1-4 -3-3 4-.5z" fill="#E9CF8E"/>` },
    star: { bg: '#5B2E48', ink: '#F3D9A0', pos: 'bottom',
      svg: () => `<path d="M50 22 L58 50 L86 52 L63 68 L72 96 L50 79 L28 96 L37 68 L14 52 L42 50Z" fill="none" stroke="#E9CF8E" stroke-width="1.4"/>
        <path d="M50 34 L55 52 L73 53 L58 63 L64 82 L50 71 L36 82 L42 63 L27 53 L45 52Z" fill="#E9CF8E"/>
        ${[...Array(20)].map(() => `<circle cx="${rnd() * 100}" cy="${rnd() * 140}" r=".7" fill="#F3EBDD"/>`).join('')}` },
    wreath: { bg: '#F3EBDD', ink: '#2F4A3A', pos: 'center',
      svg: () => `${[...Array(28)].map((_, i) => { const a = i / 28 * Math.PI * 2, x = 50 + Math.cos(a) * 32, y = 66 + Math.sin(a) * 32;
          return `<ellipse cx="${x}" cy="${y}" rx="7" ry="3" fill="${i % 2 ? '#2F4A3A' : '#5E8A6B'}" transform="rotate(${a * 57.3 + 60} ${x} ${y})"/>`; }).join('')}
        ${[0, 1.1, 2.3, 3.6, 4.8].map(a => `<circle cx="${50 + Math.cos(a) * 33}" cy="${66 + Math.sin(a) * 33}" r="2.6" fill="#C9604A"/>`).join('')}
        <path d="M44 100 q6 -6 12 0 q-6 4 -6 12 q0 -8 -6 -12z" fill="#C9604A"/>` },
    leaf: { bg: '#DCE4D3', ink: '#1F3A2E', pos: 'bottom',
      svg: () => `<path d="M50 125 C50 90 48 60 52 18" stroke="#1F3A2E" stroke-width="1.4" fill="none"/>
        ${[...Array(9)].map((_, i) => { const y = 30 + i * 10, s = i % 2 ? 1 : -1; return `<path d="M51 ${y} q${18 * s} -4 ${26 * s} ${-14 + i}  q${-14 * s} ${2} ${-26 * s} ${14 - i}z" fill="${i % 3 ? '#3E6B52' : '#7A9C6E'}"/>`; }).join('')}` },
    cake: { bg: '#CFE0EC', ink: '#1E2430', pos: 'top',
      svg: () => `<rect x="24" y="74" width="52" height="34" rx="4" fill="#F3EBDD"/><path d="M24 82 q6.5 8 13 0 q6.5 8 13 0 q6.5 8 13 0 q6.5 8 13 0" fill="#E9927A"/>
        <rect x="18" y="106" width="64" height="5" rx="2.5" fill="#1E2430"/>
        ${[36, 50, 64].map(x => `<rect x="${x - 1.5}" y="58" width="3" height="16" fill="#5B2E48"/><path d="M${x} 50 q4 5 0 8 q-4 -3 0 -8z" fill="#E9B44C"/>`).join('')}
        ${[...Array(14)].map(() => `<circle cx="${rnd() * 100}" cy="${rnd() * 50 + 10}" r="1" fill="#fff"/>`).join('')}` },
    balloon: { bg: '#F6E6E1', ink: '#3A2626', pos: 'bottom',
      svg: () => `${[[34, 44, '#C9604A'], [62, 36, '#2F4A3A'], [52, 62, '#E9B44C'], [76, 60, '#5B2E48']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="14" fill="${c}"/><path d="M${x} ${y + 14} q-4 20 6 40" stroke="#3A2626" stroke-width=".6" fill="none"/><ellipse cx="${x - 4}" cy="${y - 5}" rx="2.5" ry="4" fill="#fff" opacity=".35"/>`).join('')}` },
    arch: { bg: '#EFE3D0', ink: '#3A2626', pos: 'bottom',
      svg: () => `<path d="M20 120 V60 a30 30 0 0 1 60 0 V120Z" fill="#C9604A"/><path d="M30 120 V64 a20 20 0 0 1 40 0 V120Z" fill="#E9927A"/><path d="M40 120 V68 a10 10 0 0 1 20 0 V120Z" fill="#F3D7CB"/><circle cx="78" cy="30" r="8" fill="#E9B44C"/>` },
    heart: { bg: '#C9604A', ink: '#FFF4E6', pos: 'bottom',
      svg: () => `<path d="M50 96 C20 74 18 50 34 42 C43 38 49 44 50 50 C51 44 57 38 66 42 C82 50 80 74 50 96Z" fill="#F3D7CB"/>
        <path d="M50 82 C34 70 33 58 41 54 C46 52 49 55 50 58 C51 55 54 52 59 54 C67 58 66 70 50 82Z" fill="#5B2E48"/>` },
    dove: { bg: '#E4E7EC', ink: '#2B3440', pos: 'bottom',
      svg: () => `<path d="M30 70 C40 50 60 48 70 56 C78 50 86 52 88 56 C80 58 76 64 72 70 C64 86 44 88 30 70Z" fill="#fff"/>
        <path d="M46 62 C40 40 52 30 62 34 C58 44 56 54 56 64Z" fill="#fff" opacity=".9"/><circle cx="78" cy="57" r="1" fill="#2B3440"/>
        <path d="M28 72 q-10 2 -14 10 q8 -2 16 -6" fill="#fff"/><path d="M60 82 q4 10 14 12" stroke="#7A9C6E" stroke-width="1.2" fill="none"/>
        <ellipse cx="70" cy="92" rx="4" ry="2" fill="#7A9C6E"/><ellipse cx="64" cy="88" rx="4" ry="2" fill="#7A9C6E" transform="rotate(30 64 88)"/>` },
    moon: { bg: '#DCE6EE', ink: '#2B3440', pos: 'bottom',
      svg: () => `<circle cx="56" cy="54" r="24" fill="#F7E3B5"/><circle cx="66" cy="48" r="22" fill="#DCE6EE"/>
        ${[[24, 30], [80, 80], [30, 90], [78, 26], [44, 22]].map(([x, y]) => `<path d="M${x} ${y - 4} l1 3 3 1 -3 1 -1 3 -1 -3 -3 -1 3 -1z" fill="#E9B44C"/>`).join('')}
        <path d="M14 116 q36 -20 72 0" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/>` },
    rings: { bg: '#F3EBDD', ink: '#3A2626', pos: 'bottom',
      svg: () => `<circle cx="42" cy="62" r="18" fill="none" stroke="#D79B3C" stroke-width="4"/><circle cx="60" cy="62" r="18" fill="none" stroke="#B8862F" stroke-width="4"/>
        <path d="M56 40 l4 -6 4 6 -4 4z" fill="#CFE0EC" stroke="#B8862F" stroke-width=".8"/>
        ${petals(20, 104, 6, 5, '#E9927A')}${petals(82, 26, 5, 5, '#E9927A', 30)}` },
    citrus: { bg: '#2F4A3A', ink: '#F7E3B5', pos: 'bottom',
      svg: () => `${[[34, 44], [68, 60], [40, 82]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="15" fill="${i === 1 ? '#E9B44C' : '#E9927A'}"/><circle cx="${x}" cy="${y}" r="12" fill="#FFF4D6"/>${[...Array(8)].map((_, k) => `<path d="M${x} ${y} L${x + Math.cos(k * .785) * 11} ${y + Math.sin(k * .785) * 11} L${x + Math.cos(k * .785 + .6) * 11} ${y + Math.sin(k * .785 + .6) * 11}Z" fill="${i === 1 ? '#F2C766' : '#F1A68E'}"/>`).join('')}`).join('')}` }
  };

  function paint(el) {
    const a = ART[el.dataset.art] || ART.bloom;
    const t = el.dataset.text ?? '';
    el.style.setProperty('--bg', a.bg);
    el.style.setProperty('--ink', a.ink);
    el.innerHTML = `<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${a.svg()}</svg>${t ? `<span class="card-art__t card-art__t--${a.pos}">${t}</span>` : ''}`;
  }

  /* ---------- DATA ---------- */
  const OCC = [
    { n: 'Birthday', c: '320 designs', art: 'balloon', t: 'Happy Birthday', big: true },
    { n: 'Thank You', c: '140 designs', art: 'sun', t: 'Thank you' },
    { n: 'Love & Anniversary', c: '96 designs', art: 'heart', t: 'Love you' },
    { n: 'Wedding', c: '64 designs', art: 'rings', t: 'Mr & Mrs' },
    { n: 'New Baby', c: '58 designs', art: 'moon', t: 'Hello little one' },
    { n: 'Sympathy', c: '42 designs', art: 'dove', t: 'With love' },
    { n: 'Congratulations', c: '80 designs', art: 'confetti', t: 'Congrats!' },
    { n: 'Just Because', c: '110 designs', art: 'citrus', t: 'Hi you', wide: true }
  ];
  const PRODUCTS = [
    { id: 'p1', n: 'Wildflower Birthday', a: 'Ana Ruiz', p: 4.95, cat: 'birthday', art: 'bloom', t: 'Happy Birthday', badge: 'Bestseller', r: 412, inside: 'Wishing you a year as bright as this bunch.' },
    { id: 'p2', n: 'Little Sunshine Thanks', a: 'Theo Marsh', p: 4.5, cat: 'thanks', art: 'sun', t: 'Thank you', inside: 'You made my whole week.', r: 236 },
    { id: 'p3', n: 'Hearts Entwined', a: 'Mira Okafor', p: 5.5, cat: 'love', art: 'heart', t: 'Love you', badge: 'Letterpress', r: 198, inside: 'Still my favourite person.' },
    { id: 'p4', n: 'Cake O’Clock', a: 'Ana Ruiz', p: 4.95, cat: 'birthday', art: 'cake', t: 'Make a wish', r: 301, inside: 'Blank inside for your own words.' },
    { id: 'p5', n: 'Gold Rings', a: 'Elodie Kim', p: 6.5, cat: 'baby', art: 'rings', t: 'Mr & Mrs', badge: 'Gold foil', r: 144, inside: 'Here’s to forever, and the party.' },
    { id: 'p6', n: 'Hello Little Moon', a: 'Theo Marsh', p: 4.95, cat: 'baby', art: 'moon', t: 'Welcome baby', r: 167, inside: 'Welcome to the world, little one.' },
    { id: 'p7', n: 'Peace Dove', a: 'Mira Okafor', p: 4.95, cat: 'sympathy', art: 'dove', t: 'Thinking of you', r: 89, inside: 'Holding you close in our thoughts.' },
    { id: 'p8', n: 'Confetti Pop', a: 'Elodie Kim', p: 4.5, cat: 'birthday', art: 'confetti', t: 'Hooray!', badge: 'New', r: 58, inside: 'Let’s celebrate YOU.' },
    { id: 'p9', n: 'Pressed Fern', a: 'Ana Ruiz', p: 4.95, cat: 'thanks', art: 'leaf', t: 'With thanks', r: 120, inside: 'Grateful for you, always.' },
    { id: 'p10', n: 'Sunset Arch', a: 'Theo Marsh', p: 4.95, cat: 'love', art: 'arch', t: 'Us', r: 77, inside: 'Every sunset is better with you.' }
  ];
  const RECIP = [['Mum', 'bloom'], ['Dad', 'citrus'], ['Partner', 'heart'], ['Best Friend', 'confetti'], ['Kids', 'balloon'], ['Grandparents', 'leaf'], ['Teacher', 'sun'], ['Colleague', 'arch']];
  const ARTISTS = [
    { n: 'Ana Ruiz', l: 'Lisbon, Portugal', s: 'Gouache florals & loose botanicals', art: ['bloom', 'leaf', 'cake'] },
    { n: 'Theo Marsh', l: 'Bristol, UK', s: 'Warm, sunny shapes and quiet humour', art: ['sun', 'moon', 'arch'] },
    { n: 'Mira Okafor', l: 'Lagos, Nigeria', s: 'Bold colour and gentle symbolism', art: ['heart', 'dove', 'citrus'] },
    { n: 'Elodie Kim', l: 'Montréal, Canada', s: 'Gold foil, confetti and celebration', art: ['rings', 'confetti', 'star'] }
  ];
  const REVIEWS = [
    ['The paper quality is unreal. My sister framed her birthday card. Actually framed it.', 'Hannah L.', 'Wildflower Birthday'],
    ['Sent a sympathy card direct when I couldn’t be there. It arrived the next day and meant so much.', 'David R.', 'Peace Dove'],
    ['The reminder emails have saved me at least four times this year. Never going back.', 'Priya S.', 'Reminders'],
    ['Ordered 60 holiday cards with our logo for clients. Gorgeous, and on time.', 'Studio Nine', 'Corporate'],
    ['I love that the handwriting font actually looks handwritten. Grandma had no idea!', 'Marcus T.', 'Personalised'],
    ['Card Club is my favourite little monthly treat. I always have the right card in the drawer now.', 'Jess W.', 'Card Club']
  ];

  /* ---------- RENDER ---------- */
  const occGrid = $('#occGrid');
  occGrid.innerHTML = OCC.map((o, i) => `
    <a class="occ ${o.big ? 'occ--big' : ''} ${o.wide ? 'occ--wide' : ''} reveal" style="--d:${i * 60}ms" href="#shop">
      <div class="occ__cards"><div class="card-art" data-art="${o.art}" data-text="${o.t}"></div></div>
      <div class="occ__txt"><strong>${o.n}</strong><span>${o.c}</span></div><span class="occ__go">→</span>
    </a>`).join('') + `<a class="occ occ--cta reveal" href="#shop"><p class="kicker kicker--light">Can’t decide?</p><strong>Browse all 900+ cards, or take our 30-second card finder.</strong><span class="btn btn--gold btn--sm">Find my card →</span></a>`;

  const prodGrid = $('#prodGrid');
  const money = v => '$' + v.toFixed(2);
  function renderProducts(f = 'all') {
    const list = PRODUCTS.filter(p => f === 'all' || p.cat === f).slice(0, 8);
    prodGrid.innerHTML = list.map((p, i) => `
      <article class="prod reveal" style="--d:${i * 50}ms">
        <div class="prod__media">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
          <button class="wish" aria-label="Save ${p.n}" aria-pressed="false">♡</button>
          <div class="flip">
            <div class="flip__front card-art" data-art="${p.art}" data-text="${p.t}"></div>
            <div class="flip__inside"><p class="hand">${p.inside}</p></div>
          </div>
          <div class="prod__actions">
            <button class="btn btn--sm btn--ink" data-add="${p.id}" data-name="${p.n}" data-price="${p.p}">Quick add</button>
            <a class="btn btn--sm btn--paper" href="#studio" data-personalise="${p.art}|${p.t}">Personalise</a>
          </div>
        </div>
        <div class="prod__info">
          <div><h3>${p.n}</h3><p>by ${p.a}</p></div>
          <div class="prod__price"><b>${money(p.p)}</b><small><span class="stars">★★★★★</span> ${p.r}</small></div>
        </div>
      </article>`).join('');
    $$('.card-art', prodGrid).forEach(paint);
    observe($$('.reveal', prodGrid));
  }

  $('#recRow').innerHTML = RECIP.map(([n, a], i) => `
    <a class="rec reveal" style="--d:${i * 50}ms" href="#shop"><span class="rec__ring"><span class="card-art" data-art="${a}" data-text=""></span></span><strong>${n}</strong></a>`).join('');

  $('#artGrid').innerHTML = ARTISTS.map((a, i) => `
    <article class="artist reveal" style="--d:${i * 70}ms">
      <div class="artist__ph ph ph--art" style="--tint:${['#F3D7CB', '#EFE3D3', '#E2E8DE', '#E6E1EE'][i]}"><span class="ph__lbl">Placeholder · artist portrait</span><span class="artist__mono">${a.n.split(' ').map(w => w[0]).join('')}</span>
        <div class="artist__fan">${a.art.map(x => `<div class="card-art" data-art="${x}" data-text=""></div>`).join('')}</div>
      </div>
      <h3>${a.n}</h3><p class="muted">${a.l}</p><p>${a.s}</p><a class="link" href="#">Shop ${a.n.split(' ')[0]}’s cards →</a>
    </article>`).join('');

  $('#revWall').innerHTML = REVIEWS.map((r, i) => `
    <figure class="rev reveal ${i % 3 === 1 ? 'rev--tint' : ''}" style="--d:${i * 60}ms">
      <span class="stars">★★★★★</span><blockquote>“${r[0]}”</blockquote>
      <figcaption><b>${r[1]}</b><span>Verified · ${r[2]}</span></figcaption>
    </figure>`).join('');

  const UGC = [['bloom', '#C9B8A4', '#2F4A3A'], ['heart', '#2F4A3A', '#F3D7CB'], ['sun', '#E2E8DE', '#5B2E48'], ['pine', '#B9785F', '#F3EBDD'], ['moon', '#F3D7CB', '#D79B3C'], ['confetti', '#3B3F4A', '#E9B8A8']];
  $('#ugcGrid').innerHTML = UGC.map(([a, bg, env], i) => `
    <a class="ugc__item ph ph--scene" href="#" style="--tint:${bg};--env:${env};--rot:${[-8, 6, -4, 9, -10, 5][i]}deg"><span class="ph__lbl">Placeholder · customer photo</span><span class="scene__env"></span><span class="card-art" data-art="${a}" data-text=""></span><span class="ugc__hover">♡ Shop this card</span></a>`).join('');

  /* Upcoming dates */
  const now = new Date();
  const upcoming = [
    ['Thanksgiving', new Date(2026, 10, 26), 'leaf'], ['Hanukkah', new Date(2026, 11, 4), 'star'],
    ['Christmas', new Date(2026, 11, 25), 'pine'], ['New Year', new Date(2027, 0, 1), 'confetti'],
    ['Valentine’s Day', new Date(2027, 1, 14), 'heart'], ['Mother’s Day', new Date(2027, 4, 9), 'bloom'],
    ['Father’s Day', new Date(2027, 5, 20), 'citrus']
  ].filter(d => d[1] >= new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  $('#datesRow').innerHTML = upcoming.map(([n, d, a]) => {
    const days = Math.ceil((d - now) / 864e5);
    return `<a class="date" href="#shop"><span class="date__art card-art" data-art="${a}" data-text=""></span>
      <span class="date__txt"><small>${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small><strong>${n}</strong><em>${days <= 0 ? 'Today' : days === 1 ? 'Tomorrow' : 'in ' + days + ' days'}</em></span></a>`;
  }).join('');

  /* Studio swatches */
  const SW = [['bloom', 'Happy Birthday'], ['heart', 'Love you'], ['sun', 'Thank you'], ['pine', 'Merry & Bright'], ['dove', 'Thinking of you']];
  $('#swatches').innerHTML = SW.map(([a, t], i) => `<button type="button" class="sw ${i ? '' : 'is-on'}" data-art="${a}" data-t="${t}" aria-label="${t} design"><span class="card-art" data-art="${a}" data-text=""></span></button>`).join('');

  $$('.card-art').forEach(paint);

  /* ---------- INTERACTIONS ---------- */
  // reveal
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' }) : null;
  function observe(els) { els.forEach(el => io ? io.observe(el) : el.classList.add('in')); }
  observe($$('.reveal'));
  $$('.sec__head, .holiday__copy, .craft__copy, .reminders__copy, .biz__card, .set, .club').forEach(el => { el.classList.add('reveal'); observe([el]); });

  renderProducts();
  $('#tabs').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#tabs button').forEach(x => x.classList.toggle('is-on', x === b));
    renderProducts(b.dataset.f);
  });

  // announcement rotate
  const ann = $$('#announce p'); let ai = 0;
  setInterval(() => { ann[ai].classList.remove('is-on'); ai = (ai + 1) % ann.length; ann[ai].classList.add('is-on'); }, 3800);

  // header scroll state
  const hdr = $('#hdr');
  const onScroll = () => hdr.classList.toggle('is-scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // mobile nav
  const burger = $('#burger'), mnav = $('#mnav');
  burger.addEventListener('click', () => { const o = document.body.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', o); });
  $$('a', mnav).forEach(a => a.addEventListener('click', () => { document.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', false); }));

  // search
  const search = $('#search'), sInput = $('#searchInput'), sRes = $('#searchResults');
  $('#searchBtn').addEventListener('click', () => { search.hidden = !search.hidden; if (!search.hidden) sInput.focus(); });
  const doSearch = q => {
    q = q.trim().toLowerCase();
    if (!q) { sRes.innerHTML = ''; return; }
    const hits = PRODUCTS.filter(p => (p.n + ' ' + p.cat + ' ' + p.t + ' ' + p.a + ' ' + (p.badge || '')).toLowerCase().includes(q.replace('thank you', 'thank')));
    sRes.innerHTML = hits.length ? hits.slice(0, 5).map(p => `<a href="#shop" class="sr"><span class="card-art" data-art="${p.art}" data-text=""></span><span><strong>${p.n}</strong><small>${money(p.p)} · ${p.a}</small></span></a>`).join('') : `<p class="muted">No cards match “${q}”. Try “birthday”.</p>`;
    $$('.card-art', sRes).forEach(paint);
    $$('a', sRes).forEach(a => a.addEventListener('click', () => (search.hidden = true)));
  };
  sInput.addEventListener('input', e => doSearch(e.target.value));
  $$('.search__chips button').forEach(b => b.addEventListener('click', () => { sInput.value = b.textContent; doSearch(b.textContent); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { search.hidden = true; closeCart(); } });

  // hero 3D card open + tilt
  const stage = $('#stage'), book = $('#book');
  stage.addEventListener('click', () => book.classList.toggle('is-open'));
  setTimeout(() => book.classList.add('is-open'), 1400);
  setTimeout(() => book.classList.remove('is-open'), 4200);
  if (matchMedia('(hover:hover)').matches) {
    stage.addEventListener('mousemove', e => {
      const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      stage.style.setProperty('--rx', (-y * 10) + 'deg'); stage.style.setProperty('--ry', (x * 14) + 'deg');
    });
    stage.addEventListener('mouseleave', () => { stage.style.setProperty('--rx', '0deg'); stage.style.setProperty('--ry', '0deg'); });
  }

  // wishlist
  document.addEventListener('click', e => {
    const w = e.target.closest('.wish'); if (!w) return;
    const on = w.getAttribute('aria-pressed') !== 'true';
    w.setAttribute('aria-pressed', on); w.textContent = on ? '♥' : '♡';
    toast(on ? 'Saved to your wishlist' : 'Removed from wishlist');
  });

  // countdown to ship-by date
  const cd = $('#countdown'), target = new Date(2026, 11, 15, 23, 59, 59);
  const tick = () => {
    let s = Math.max(0, (target - new Date()) / 1000);
    const d = Math.floor(s / 86400); s -= d * 86400; const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s = Math.floor(s - m * 60);
    const p = n => String(n).padStart(2, '0');
    $('[data-d]', cd).textContent = p(d); $('[data-h]', cd).textContent = p(h); $('[data-m]', cd).textContent = p(m); $('[data-s]', cd).textContent = p(s);
  };
  tick(); setInterval(tick, 1000);

  // studio
  const stFront = $('#stFront'), stMsg = $('#stMsg'), stInput = $('#stInput'), charCount = $('#charCount');
  const setDesign = (art, t) => { stFront.dataset.art = art; stFront.dataset.text = t; paint(stFront); stFront.parentElement.classList.remove('pop'); void stFront.offsetWidth; stFront.parentElement.classList.add('pop'); };
  $('#swatches').addEventListener('click', e => {
    const b = e.target.closest('.sw'); if (!b) return;
    $$('.sw').forEach(x => x.classList.toggle('is-on', x === b)); setDesign(b.dataset.art, b.dataset.t);
  });
  const upd = () => { stMsg.textContent = stInput.value || 'Your message will appear here…'; charCount.textContent = `${stInput.value.length} / 240`; };
  stInput.addEventListener('input', upd); upd();
  $('#fontSeg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#fontSeg button').forEach(x => x.classList.toggle('is-on', x === b));
    stMsg.className = 'hand hand--' + b.dataset.font;
  });
  let sendMode = 'direct';
  $('#sendSeg').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#sendSeg button').forEach(x => x.classList.toggle('is-on', x === b)); sendMode = b.dataset.send;
  });
  $('#stAdd').addEventListener('click', () => {
    const name = ($('.sw.is-on').dataset.t) + ' · personalised' + (sendMode === 'direct' ? ', sent direct' : '');
    addToCart('pers-' + Date.now(), name, 6.95, stFront.dataset.art);
  });
  // "Personalise" from product cards preloads the studio
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-personalise]'); if (!a) return;
    const [art, t] = a.dataset.personalise.split('|');
    setDesign(art, t); $$('.sw').forEach(x => x.classList.toggle('is-on', x.dataset.art === art));
  });

  // reminders
  const remList = $('#remList');
  $('#remForm').addEventListener('submit', e => {
    e.preventDefault();
    const n = $('#remName').value.trim(), dv = $('#remDate').value, t = $('#remType').value;
    if (!n || !dv) return;
    const d = new Date(dv + 'T12:00:00'), r = new Date(d - 10 * 864e5);
    const li = document.createElement('li'); li.className = 'is-new';
    li.innerHTML = `<b>${String(d.getDate()).padStart(2, '0')}<small>${d.toLocaleDateString('en-US', { month: 'short' })}</small></b><div><strong></strong><span>${t} · reminder ${r.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>`;
    $('strong', li).textContent = n;
    remList.prepend(li);
    $('#remCount').textContent = remList.children.length + ' saved';
    e.target.reset(); toast(`We’ll remind you before ${n}’s ${t.toLowerCase()}`);
  });
  $('#newsForm').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('Welcome! Your 15% code is on its way: HELLO15'); });

  /* ---------- CART ---------- */
  const cart = [];
  const cartEl = $('#cart'), scrim = $('#scrim');
  const openCart = () => { document.body.classList.add('cart-open'); cartEl.setAttribute('aria-hidden', 'false'); };
  function closeCart() { document.body.classList.remove('cart-open'); cartEl.setAttribute('aria-hidden', 'true'); }
  $('#cartBtn').addEventListener('click', openCart); $('#cartClose').addEventListener('click', closeCart); scrim.addEventListener('click', closeCart);

  function addToCart(id, name, price, art) {
    const ex = cart.find(i => i.id === id);
    ex ? ex.q++ : cart.push({ id, name, price: +price, q: 1, art: art || (PRODUCTS.find(p => p.id === id) || {}).art || 'leaf' });
    renderCart(); openCart();
    const c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  }
  function renderCart() {
    const cards = cart.filter(i => i.id !== 'seals').reduce((s, i) => s + i.q * (i.id.startsWith('set') ? 10 : 1), 0);
    const total = cart.reduce((s, i) => s + i.q * i.price, 0);
    $('#cartCount').textContent = cart.reduce((s, i) => s + i.q, 0);
    $('#cartTotal').textContent = money(total);
    const left = Math.max(0, 3 - cards);
    $('#shipMsg').innerHTML = left ? `Add <b>${left} more card${left > 1 ? 's' : ''}</b> for free shipping` : '✿ You’ve unlocked <b>free shipping</b>';
    $('#shipBar').style.width = Math.min(100, cards / 3 * 100) + '%';
    $('#cartItems').innerHTML = cart.length ? cart.map(i => `
      <li><span class="card-art" data-art="${i.art}" data-text=""></span>
        <div><strong>${i.name}</strong><small>${money(i.price)}</small>
          <div class="qty"><button data-q="-1" data-id="${i.id}" aria-label="Less">−</button><span>${i.q}</span><button data-q="1" data-id="${i.id}" aria-label="More">+</button></div></div>
        <b>${money(i.price * i.q)}</b></li>`).join('') : '<li class="empty">Your bag is empty. <a href="#shop">Find a card →</a></li>';
    $$('#cartItems .card-art').forEach(paint);
  }
  $('#cartItems').addEventListener('click', e => {
    const b = e.target.closest('[data-q]'); if (!b) return;
    const it = cart.find(i => i.id === b.dataset.id); it.q += +b.dataset.q;
    if (it.q <= 0) cart.splice(cart.indexOf(it), 1);
    renderCart();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    const art = b.closest('.set') ? 'leaf' : b.dataset.add === 'seals' ? 'star' : undefined;
    addToCart(b.dataset.add, b.dataset.name, b.dataset.price, art);
  });
  renderCart();

  // toast
  let tt; const tEl = $('#toast');
  function toast(m) { tEl.textContent = m; tEl.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => tEl.classList.remove('on'), 2600); }
})();
