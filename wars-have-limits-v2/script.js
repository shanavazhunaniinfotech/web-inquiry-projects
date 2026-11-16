/* Wars Have Limits — Homepage V2 interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IMG = (id, w, h) => `https://picsum.photos/id/${id}/${w}/${h}?grayscale`;
  const money = n => '$' + n.toLocaleString('en-US');

  /* ---------- intro ---------- */
  const start = () => {
    document.body.classList.remove('is-loading');
    setTimeout(() => document.body.classList.add('is-ready'), reduce ? 0 : 450);
  };
  if (document.readyState === 'complete') setTimeout(start, 700);
  else window.addEventListener('load', () => setTimeout(start, 500));
  setTimeout(start, 2500); // safety

  /* ---------- toast ---------- */
  const toastEl = $('#toast'); let tt;
  const toast = m => { toastEl.textContent = m; toastEl.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('is-on'), 3400); };

  /* ---------- scroll: header, progress, parallax ---------- */
  const hdr = $('.hdr'), prog = $('.progress span'), band = $('[data-parallax]');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    hdr.classList.toggle('is-solid', y > 60);
    hdr.classList.toggle('is-hidden', y > 600 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
    prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    if (band && !reduce && y < innerHeight * 1.5) band.style.transform = `translate3d(0,${y * 0.15}px,0)`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- language ---------- */
  const lang = $('.lang');
  $('.lang__btn').addEventListener('click', e => { e.stopPropagation(); $('.lang__btn').setAttribute('aria-expanded', lang.classList.toggle('is-open')); });
  document.addEventListener('click', () => lang.classList.remove('is-open'));
  $$('.lang__menu button').forEach(b => b.addEventListener('click', () => {
    $$('.lang__menu button').forEach(x => x.classList.toggle('is-on', x === b));
    $('.lang__btn span').textContent = b.dataset.l;
    if (b.dataset.l !== 'EN') toast(`${b.textContent}: full translation is part of the multi-language build.`);
  }));

  /* ---------- mega menu image swap ---------- */
  $$('.mega').forEach(m => {
    const img = $('.mega__img img', m);
    $$('.mega__links a', m).forEach(a => a.addEventListener('mouseenter', () => { img.src = IMG(a.dataset.img, 600, 700); }));
  });

  /* ---------- mobile menu ---------- */
  const burger = $('.burger'), mnav = $('.mnav');
  const menu = open => {
    burger.classList.toggle('is-open', open); mnav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open); mnav.setAttribute('aria-hidden', !open);
    document.body.classList.toggle('menu-open', open); document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => menu(!mnav.classList.contains('is-open')));
  $$('.mnav nav a').forEach(a => a.addEventListener('click', () => menu(false)));
  $('.mnav__s').addEventListener('submit', e => { e.preventDefault(); const q = $('input', e.target).value; menu(false); openSearch(q); });

  /* ---------- Stories data (placeholders) ---------- */
  const stories = [
    { id: 1, name: 'Amira, 34', place: 'Syria', loc: 'Aleppo, Syria', x: 53.5, y: 33.9, type: 'video', title: 'The night our street disappeared', theme: 'displacement home family', text: 'Amira lost her home and her husband in a single night of shelling. Today she raises three children in a camp and asks only for recognition and the chance to rebuild.', raised: 3420, goal: 5000, sup: 86, img: 1027 },
    { id: 2, name: 'Oleksandr, 61', place: 'Ukraine', loc: 'Kharkiv, Ukraine', x: 51.9, y: 24.3, type: 'photo', title: 'A teacher without a school', theme: 'education infrastructure', text: 'For 30 years Oleksandr taught in the same classroom. When it was destroyed, he began teaching children in a basement.', raised: 1980, goal: 4000, sup: 41, img: 883 },
    { id: 3, name: 'Fatima, 19', place: 'Sudan', loc: 'El Fasher, Sudan', x: 50.0, y: 45.9, type: 'video', title: 'I want the world to remember us', theme: 'displacement women youth', text: 'Fatima walked for nine days to reach safety. She records video diaries so that what happened to her village is never forgotten.', raised: 4650, goal: 5000, sup: 132, img: 832 },
    { id: 4, name: 'Joseph, 45', place: 'DR Congo', loc: 'North Kivu, DR Congo', x: 51.7, y: 54.1, type: 'written', title: 'Twenty years of running', theme: 'displacement livelihood farming', text: 'Joseph has been displaced six times in two decades. A farmer by trade, he writes about what it would take for families like his to finally stay.', raised: 860, goal: 3000, sup: 22, img: 1005 },
    { id: 5, name: 'Layla, 27', place: 'Gaza', loc: 'Gaza', x: 52.4, y: 36.8, type: 'video', title: 'A nurse counting what was lost', theme: 'health women hospital', text: 'Layla kept working as her hospital was damaged around her. Her testimony speaks for medical workers who carried on.', raised: 2710, goal: 5000, sup: 74, img: 65 },
    { id: 6, name: 'Hamid, 52', place: 'Afghanistan', loc: 'Kandahar, Afghanistan', x: 62.5, y: 34.4, type: 'photo', title: 'The shop my father built', theme: 'livelihood property business', text: 'Hamid’s family business survived three generations — until an airstrike. He documents what reparations would mean for small traders.', raised: 1240, goal: 3500, sup: 30, img: 669 },
    { id: 7, name: 'Thida, 38', place: 'Myanmar', loc: 'Shan State, Myanmar', x: 71.4, y: 41.1, type: 'written', title: 'Letters to my missing brother', theme: 'missing family', text: 'Thida writes letters to a brother who disappeared during the conflict — a record for families of the missing everywhere.', raised: 540, goal: 2500, sup: 15, img: 375 },
    { id: 8, name: 'Yusuf, 12', place: 'Yemen', loc: 'Taiz, Yemen', x: 56.7, y: 46.2, type: 'video', title: 'I still want to be an engineer', theme: 'youth education disability landmine', text: 'Yusuf was injured by a landmine on the way to school. With his mother, he shares his hopes and the support he needs.', raised: 3980, goal: 6000, sup: 101, img: 786 }
  ];
  const tLabel = { video: 'Video', photo: 'Photo story', written: 'Written' };
  const tIcon = { video: '#i-play', photo: '#i-people', written: '#i-book' };
  const pct = s => Math.round(s.raised / s.goal * 100);

  /* featured */
  const f = stories[0];
  $('#feature').innerHTML = `
    <div class="feature__media"><img src="${IMG(f.img, 1200, 900)}" alt="Placeholder video still for ${f.name}" loading="lazy">
      <span class="feature__badge">Featured testimony</span><span class="feature__play"><svg><use href="#i-play"/></svg></span></div>
    <div class="feature__body">
      <p class="feature__loc"><svg><use href="#i-pin"/></svg>${f.loc}</p>
      <h3>“${f.title}”</h3><p class="who">${f.name}</p>
      <p class="t">${f.text}</p>
      <div class="fund"><div class="fund__nums"><span><b>${money(f.raised)}</b> raised</span><span>${pct(f)}% of ${money(f.goal)}</span></div><div class="fund__bar"><span data-w="${pct(f)}"></span></div></div>
      <span class="btn btn--coral" style="margin-top:28px;align-self:flex-start"><span>Watch &amp; support</span><svg><use href="#i-arrow"/></svg></span>
    </div>`;
  $('#feature').addEventListener('click', () => openStory(f.id));

  /* rail */
  const rail = $('#rail');
  rail.innerHTML = stories.map(s => `
    <article class="scard hover-view" data-id="${s.id}" tabindex="0" role="button" aria-label="Open story: ${s.title}">
      <div class="scard__img"><img src="${IMG(s.img, 620, 780)}" alt="Placeholder portrait for ${s.name}" loading="lazy" draggable="false">
        <span class="scard__type"><svg><use href="${tIcon[s.type]}"/></svg>${tLabel[s.type]}</span>
        <div class="scard__cap"><p class="scard__loc"><svg><use href="#i-pin"/></svg>${s.loc}</p><h3>${s.title}</h3></div></div>
      <div class="scard__body">
        <div class="fund__nums"><span><b>${money(s.raised)}</b> raised</span><span>${pct(s)}%</span></div>
        <div class="fund__bar"><span data-w="${pct(s)}"></span></div>
        <div class="scard__go">${s.name} <svg><use href="#i-arrow"/></svg></div>
      </div>
    </article>`).join('');

  /* map pins + place list */
  const places = [...new Set(stories.map(s => s.place))];
  $('#pins').innerHTML = stories.map(s => `<button class="pin" style="left:${s.x}%;top:${s.y}%" data-place="${s.place}" aria-label="Stories from ${s.place}"><span class="pin__tip">${s.place}</span></button>`).join('');
  $('#placeList').innerHTML = places.map(p => `<li><button data-place="${p}">${p}<span>${stories.filter(s => s.place === p).length} story</span></button></li>`).join('');

  let fType = 'all', fPlace = null;
  const storyQ = $('#storyQ');
  function filter() {
    const q = storyQ.value.trim().toLowerCase(); let n = 0;
    $$('.scard', rail).forEach(c => {
      const s = stories.find(x => x.id == c.dataset.id);
      const hay = `${s.name} ${s.loc} ${s.title} ${s.theme} ${s.text} ${tLabel[s.type]}`.toLowerCase();
      const ok = (fType === 'all' || s.type === fType) && (!fPlace || s.place === fPlace) && (!q || hay.includes(q));
      c.hidden = !ok; if (ok) n++;
    });
    $('#storyCount').textContent = `${n} ${n === 1 ? 'story' : 'stories'}`;
    $('#railEmpty').hidden = n > 0;
    $$('.pin').forEach(p => { p.classList.toggle('is-on', p.dataset.place === fPlace); p.classList.toggle('is-dim', !!fPlace && p.dataset.place !== fPlace); });
    $$('#placeList button').forEach(b => b.classList.toggle('is-on', b.dataset.place === fPlace));
    $('#placeReset').hidden = !fPlace;
    rail.scrollTo({ left: 0, behavior: 'smooth' });
    railProg();
  }
  storyQ.addEventListener('input', filter);
  $$('#storyType .pill').forEach(b => b.addEventListener('click', () => { $$('#storyType .pill').forEach(x => x.classList.toggle('is-on', x === b)); fType = b.dataset.t; filter(); }));
  const setPlace = p => { fPlace = fPlace === p ? null : p; filter(); };
  $$('.pin, #placeList button').forEach(b => b.addEventListener('click', () => setPlace(b.dataset.place)));
  $('#placeReset').addEventListener('click', () => setPlace(null));

  /* rail controls + drag */
  const railBar = $('#railBar');
  function railProg() {
    const max = rail.scrollWidth - rail.clientWidth;
    const w = Math.min(100, rail.clientWidth / rail.scrollWidth * 100);
    railBar.style.width = w + '%';
    railBar.style.transform = `translateX(${max > 0 ? rail.scrollLeft / max * (100 / w * 100 - 100) : 0}%)`;
  }
  rail.addEventListener('scroll', railProg, { passive: true }); addEventListener('resize', railProg); railProg();
  $$('.rbtn').forEach(b => b.addEventListener('click', () => rail.scrollBy({ left: +b.dataset.dir * rail.clientWidth * 0.8, behavior: 'smooth' })));
  let dragX = null, dragL = 0, moved = false;
  rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; dragX = e.clientX; dragL = rail.scrollLeft; moved = false; });
  addEventListener('pointermove', e => { if (dragX === null) return; const d = e.clientX - dragX; if (Math.abs(d) > 5) { moved = true; rail.classList.add('is-drag'); } rail.scrollLeft = dragL - d; });
  addEventListener('pointerup', () => { dragX = null; setTimeout(() => rail.classList.remove('is-drag'), 0); });
  rail.addEventListener('click', e => { const c = e.target.closest('.scard'); if (c && !moved) openStory(c.dataset.id); });
  rail.addEventListener('keydown', e => { const c = e.target.closest('.scard'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openStory(c.dataset.id); } });

  /* ---------- story modal ---------- */
  const sm = $('#sm'); let lastF, smAmt = 50;
  function openStory(id) {
    const s = stories.find(x => x.id == id), p = pct(s);
    $('#smImg').src = IMG(s.img, 900, 1100); $('#smImg').alt = `Placeholder for ${s.name}`;
    $('#smPlay').style.display = s.type === 'video' ? '' : 'none';
    $('#smBadge').textContent = `${tLabel[s.type]} · placeholder`;
    $('#smLoc').textContent = s.loc; $('#smT').textContent = `“${s.title}”`; $('#smWho').textContent = s.name;
    $('#smTxt').textContent = s.text + ' (Placeholder — real testimonials will be added by WHL.)';
    $('#smR').textContent = money(s.raised) + ' raised'; $('#smG').textContent = 'of ' + money(s.goal);
    $('#smS').textContent = `${s.sup} supporters · ${p}% funded`;
    $('#smBar').style.width = '0';
    lastF = document.activeElement;
    sm.classList.add('is-open'); sm.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    setTimeout(() => ($('#smBar').style.width = p + '%'), 60);
    setTimeout(() => $('.sm__x').focus(), 100);
  }
  function closeStory() {
    if (!sm.classList.contains('is-open')) return;
    sm.classList.remove('is-open'); sm.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
    lastF && lastF.focus && lastF.focus();
  }
  $$('[data-x]', sm).forEach(el => el.addEventListener('click', closeStory));
  $$('.sm__amts .amt').forEach(b => b.addEventListener('click', () => {
    $$('.sm__amts .amt').forEach(x => x.classList.toggle('is-on', x === b)); smAmt = b.dataset.m;
    $('#smGo span').textContent = `Support this story · $${smAmt}`;
  }));
  $('#smGo').addEventListener('click', () => toast(`Demo: $${smAmt} to this story — secure checkout connects in the full build.`));
  $('.sm__share').addEventListener('click', () => toast('Share options (copy link, WhatsApp, X, Facebook) will appear here.'));

  /* ---------- What we do panels ---------- */
  const panels = $$('.panel');
  const openPanel = p => panels.forEach(x => x.classList.toggle('is-open', x === p));
  panels.forEach(p => {
    p.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover) and (min-width:1081px)').matches) openPanel(p); });
    p.addEventListener('click', e => { if (!p.classList.contains('is-open')) { e.preventDefault(); openPanel(p); } });
  });

  /* ---------- Journal filter + floating image ---------- */
  $$('#jType .pill').forEach(b => b.addEventListener('click', () => {
    $$('#jType .pill').forEach(x => x.classList.toggle('is-on', x === b));
    $$('#jlist li').forEach(li => li.hidden = b.dataset.j !== 'all' && li.dataset.j !== b.dataset.j);
  }));
  const jf = $('.jfloat'), jfi = $('img', jf);
  if (matchMedia('(hover:hover)').matches) {
    $$('#jlist li').forEach(li => {
      li.addEventListener('mouseenter', () => { jfi.src = IMG(li.dataset.img, 520, 380); jf.classList.add('is-on'); });
      li.addEventListener('mouseleave', () => jf.classList.remove('is-on'));
    });
    addEventListener('mousemove', e => { jf.style.transform = ''; jf.style.left = e.clientX + 24 + 'px'; jf.style.top = e.clientY - 95 + 'px'; });
  }

  /* ---------- custom "View" cursor ---------- */
  const cur = $('.cursor');
  if (matchMedia('(hover:hover)').matches) {
    addEventListener('mousemove', e => { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; });
    document.addEventListener('mouseover', e => cur.classList.toggle('is-on', !!e.target.closest('.hover-view, .feature, .panel:not(.is-open)')));
  }

  /* ---------- magnetic buttons ---------- */
  if (!reduce && matchMedia('(hover:hover)').matches) {
    $$('.magnetic').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
      b.addEventListener('mouseleave', () => (b.style.transform = ''));
    });
  }

  /* ---------- Book formats ---------- */
  $$('.fmt').forEach(b => b.addEventListener('click', () => {
    $$('.fmt').forEach(x => x.classList.toggle('is-on', x === b));
    $('#bookPrice').textContent = `${b.textContent} · ${b.dataset.p}`;
  }));

  /* ---------- Tell your story form ---------- */
  const drop = $('.drop'), dropIn = $('input', drop);
  dropIn.addEventListener('change', () => { if (dropIn.files[0]) $('span', drop).innerHTML = `<b>${dropIn.files[0].name}</b> attached`; });
  $('#storyForm').addEventListener('submit', e => { e.preventDefault(); toast('Thank you for sharing. (Demo — submissions will go to the WHL team.)'); e.target.reset(); $('span', drop).innerHTML = '<b>Add a photo or video</b> — optional'; });
  $('#signupF').addEventListener('submit', e => { e.preventDefault(); toast('Welcome to the movement! (Demo — connects to your mailing list.)'); e.target.reset(); });

  /* ---------- Donate ---------- */
  const impact = {
    20: '$20 could translate one civilian testimony into another language.',
    40: '$40 could help record and share one civilian’s testimony.',
    60: '$60 could put humanitarian-law education materials in a local group’s hands.',
    100: '$100 could fund a community listening session in a conflict-affected area.',
    250: '$250 could help bring civilian voices before law-makers.'
  };
  let freq = 'once', amt = 40;
  const oth = $('#oth');
  const upd = () => {
    $('#dgo span').textContent = `Donate ${money(amt || 0)}${freq === 'monthly' ? ' monthly' : ''}`;
    const base = impact[amt];
    $('#impact').textContent = base ? (freq === 'monthly' ? base.replace(' could', ' a month could') : base) : 'Every gift amplifies civilian voices and moves us closer to a global treaty.';
  };
  $$('.seg__b').forEach(b => b.addEventListener('click', () => {
    freq = b.dataset.f; $$('.seg__b').forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-checked', x === b); });
    $('.seg').classList.toggle('is-m', freq === 'monthly'); upd();
  }));
  $$('.amts .amt[data-a]').forEach(b => b.addEventListener('click', () => {
    $$('.amts .amt').forEach(x => x.classList.toggle('is-on', x === b)); oth.value = ''; amt = +b.dataset.a; upd();
  }));
  oth.addEventListener('focus', () => { $$('.amts .amt').forEach(x => x.classList.remove('is-on')); oth.parentElement.classList.add('is-on'); });
  oth.addEventListener('input', () => { amt = Math.max(0, Math.round(+oth.value || 0)); upd(); });
  $('#dbox').addEventListener('submit', e => { e.preventDefault(); toast(`Demo: ${money(amt)} ${freq === 'monthly' ? 'monthly' : 'one-off'} gift — secure checkout connects in the full build.`); });

  /* ---------- Site search ---------- */
  const idx = [
    ['Pages', 'Home', 'Wars Have Limits — The Campaign for Reparations', '#top'],
    ['About Us', 'Our Mission', 'A global convention and treaty on civilian reparations', '#ch-mission'],
    ['About Us', 'Our Goals', 'IHL awareness, political will, reparations as a norm', '#ch-goals'],
    ['About Us', 'Our People', 'Founder Steve Hollingworth; funded by Re:Imagine', '#ch-people'],
    ['About Us', 'Our Motivation', 'Why this campaign exists', '#ch-motivation'],
    ['About Us', 'The Book', 'Read and purchase the book by Steve Hollingworth', '#book'],
    ['Pages', 'Civilian Speak', 'Search civilian stories, photos and video testimonials', '#civilian-speak'],
    ['What We Do', 'Our Strategy', 'Awareness, political will and partnerships', '#what-we-do'],
    ['What We Do', 'Our Work on Reparations', 'From principle to practice', '#what-we-do'],
    ['What We Do', 'Our Partners', 'Civil society, NGOs and field practitioners', '#what-we-do'],
    ['What We Do', 'Reports / Articles', 'Research and policy briefs', '#journal'],
    ['What We Do', 'News / Resources', 'Updates and toolkits', '#journal'],
    ['Get Involved', 'Join The Movement', 'Sign up for campaigns and events', '#signup'],
    ['Get Involved', 'Take Action Today', 'Write to officials, advocate, post on social media', '#involved'],
    ['Get Involved', 'Tell Your Story', 'Submit your testimony', '#tell'],
    ['Get Involved', 'Follow Us on Social Media', 'TikTok, Substack and more', '#involved'],
    ['Donate', 'Donate', 'One-off or monthly — $20, $40, $60, $100, $250', '#donate'],
    ['Donate', 'Monthly giving', 'Become a monthly supporter', '#donate'],
    ['Donate', 'Where your money goes', 'How donations are distributed', '#donate'],
    ['Pages', 'Contact', '(678) 974-7753 · 100 Flat Shoals Ave. SE, Atlanta GA', '#contact']
  ].map(([g, t, d, h]) => ({ g, t, d, h })).concat(stories.map(s => ({ g: 'Civilian stories', t: s.title, d: `${s.name} · ${s.loc}`, h: '#civilian-speak', story: s.id, k: s.theme })));
  const srch = $('.srch'), qi = $('#q'), qres = $('#qres');
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const hl = (s, q) => { const i = s.toLowerCase().indexOf(q); return i < 0 ? esc(s) : esc(s.slice(0, i)) + '<mark>' + esc(s.slice(i, i + q.length)) + '</mark>' + esc(s.slice(i + q.length)); };
  function results(raw) {
    const q = raw.trim().toLowerCase();
    if (!q) { qres.innerHTML = ''; return; }
    const hits = idx.filter(i => `${i.t} ${i.d} ${i.g} ${i.k || ''}`.toLowerCase().includes(q)).slice(0, 10);
    if (!hits.length) { qres.innerHTML = `<p class="srch__none">No results for “${esc(raw)}”. Try “reparations” or “donate”.</p>`; return; }
    const groups = {}; hits.forEach(h => (groups[h.g] = groups[h.g] || []).push(h));
    qres.innerHTML = Object.entries(groups).map(([g, list]) => `<p class="srch__grp">${g}</p>` + list.map(h => `<a href="${h.h}" data-i="${idx.indexOf(h)}"><span><b>${hl(h.t, q)}</b><small>${hl(h.d, q)}</small></span><svg><use href="#i-arrow-ur"/></svg></a>`).join('')).join('');
  }
  function openSearch(v = '') { srch.classList.add('is-open'); srch.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; qi.value = v; results(v); setTimeout(() => qi.focus(), 80); }
  function closeSearch() { srch.classList.remove('is-open'); srch.setAttribute('aria-hidden', 'true'); if (!sm.classList.contains('is-open')) document.body.style.overflow = ''; }
  $('.nav__search').addEventListener('click', () => openSearch());
  $('.srch__x').addEventListener('click', closeSearch);
  qi.addEventListener('input', () => results(qi.value));
  $$('.srch__sugg button').forEach(b => b.addEventListener('click', () => { qi.value = b.textContent; results(qi.value); qi.focus(); }));
  qres.addEventListener('click', e => { const a = e.target.closest('a'); if (!a) return; const it = idx[a.dataset.i]; closeSearch(); if (it.story) setTimeout(() => openStory(it.story), 700); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeSearch(); closeStory(); menu(false); }
    if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  });

  /* ---------- About chapters active state ---------- */
  const chLinks = $$('.chapters a');
  const chObs = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) chLinks.forEach(a => a.classList.toggle('is-on', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('.chap').forEach(c => chObs.observe(c));

  /* nav active */
  const navMap = [['top', '#top'], ['about', '#about'], ['civilian-speak', '#civilian-speak'], ['what-we-do', '#what-we-do'], ['involved', '#involved'], ['donate', '#donate']];
  const navLinks = $$('.nav > .nav__a, .nav__dd > .nav__a');
  const navObs = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const id = en.target.id === 'main' ? '#top' : '#' + en.target.id;
    navLinks.forEach(a => a.classList.toggle('is-on', a.getAttribute('href') === id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  navMap.forEach(([id]) => { const el = document.getElementById(id === 'top' ? 'main' : id); el && navObs.observe(el); });

  /* ---------- reveal + counters + bars ---------- */
  const count = el => {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suf || '', t0 = performance.now(), dur = 1800;
    if (reduce) { el.textContent = end.toFixed(dec) + suf; return; }
    (function step(t) { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = (end * e).toFixed(dec) + suf; if (p < 1) requestAnimationFrame(step); })(t0);
  };
  $$('.cost__intro, .cost__viz, .cstat, .chap > *:not(.reveal-img), .goal, .founder__txt, .team figure, .speak__head, .atlas, .work__head, .path, .journal__head, .jvideo, .jlist li, .book__txt, .act__head, .acard, .story-form, .follow, .give__story, .dbox, .alloc, .signup__in, .foot__top').forEach(el => el.classList.add('rv'));

  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.classList.add('is-in');
    $$('[data-count]', el).forEach(count);
    if (el.matches('[data-count]')) count(el);
    $$('.fund__bar span[data-w]', el).forEach(s => (s.style.width = s.dataset.w + '%'));
    $$('.donut circle[data-d]', el).forEach(c => c.setAttribute('stroke-dasharray', `${c.dataset.d - 0.6} ${100 - c.dataset.d + 0.6}`));
    io.unobserve(el);
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.rv, .reveal-img, [data-viz], .feature, .scard, .hero__facts, .mission').forEach(el => io.observe(el));

  /* stagger siblings */
  $$('.goals, .team, .cost__stats, .acts, #jlist').forEach(g => [...g.children].forEach((c, i) => (c.style.transitionDelay = i * 90 + 'ms')));
})();
