/* Wars Have Limits — homepage concept interactions */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- toast ---------- */
  const toastEl = $('#toast');
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-show'), 3200);
  }

  /* ---------- header on scroll ---------- */
  const header = $('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const burger = $('.burger');
  const mnav = $('.mnav');
  function setMenu(open) {
    burger.classList.toggle('is-open', open);
    mnav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    mnav.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', () => setMenu(!mnav.classList.contains('is-open')));
  $$('.mnav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  $('.mnav__search').addEventListener('submit', e => {
    e.preventDefault();
    const q = $('input', e.target).value;
    setMenu(false);
    openSearch(q);
  });

  /* ---------- language ---------- */
  const lang = $('.lang');
  $('.lang__btn').addEventListener('click', e => {
    e.stopPropagation();
    const open = lang.classList.toggle('is-open');
    $('.lang__btn').setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', () => lang.classList.remove('is-open'));
  $$('.lang__menu button').forEach(b => b.addEventListener('click', () => {
    $$('.lang__menu button').forEach(x => x.classList.remove('is-active'));
    b.classList.add('is-active');
    $('.lang__btn span').textContent = b.dataset.lang;
    if (b.dataset.lang !== 'EN') toast(`${b.textContent} — translation will be enabled in the full build.`);
  }));

  /* ---------- About tabs ---------- */
  function showTab(name) {
    $$('.tab').forEach(t => {
      const on = t.dataset.tab === name;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on);
    });
    $$('.panel').forEach(p => p.classList.toggle('is-active', p.dataset.panel === name));
  }
  $$('.tab').forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));
  $$('[data-tab]').forEach(a => {
    if (a.classList.contains('tab')) return;
    a.addEventListener('click', () => showTab(a.dataset.tab));
  });

  /* ---------- Civilian Speak stories (placeholders) ---------- */
  const stories = [
    { id: 1, name: 'Amira, 34', loc: 'Aleppo, Syria', type: 'video', title: 'The night our street disappeared', theme: 'displacement home', text: 'Amira lost her home and her husband in a single night of shelling. Today she raises three children in a camp and asks only for recognition and the chance to rebuild.', raised: 3420, goal: 5000, sup: 86, seed: 1027 },
    { id: 2, name: 'Oleksandr, 61', loc: 'Kharkiv, Ukraine', type: 'photo', title: 'A teacher without a school', theme: 'education infrastructure', text: 'For 30 years Oleksandr taught in the same classroom. When it was destroyed, he started teaching children in a basement. His story is told in photographs.', raised: 1980, goal: 4000, sup: 41, seed: 883 },
    { id: 3, name: 'Fatima, 19', loc: 'El Fasher, Sudan', type: 'video', title: 'I want the world to remember us', theme: 'displacement women youth', text: 'Fatima walked for nine days to reach safety. She records video diaries so that what happened to her village is never forgotten.', raised: 4650, goal: 5000, sup: 132, seed: 832 },
    { id: 4, name: 'Joseph, 45', loc: 'North Kivu, DR Congo', type: 'written', title: 'Twenty years of running', theme: 'displacement livelihood', text: 'Joseph has been displaced six times in two decades. A farmer by trade, he writes about what it would take for families like his to finally stay.', raised: 860, goal: 3000, sup: 22, seed: 1005 },
    { id: 5, name: 'Layla, 27', loc: 'Gaza', type: 'video', title: 'A nurse counting what was lost', theme: 'health women', text: 'Layla kept working as her hospital was damaged around her. Her testimony speaks for the medical workers who carried on.', raised: 2710, goal: 5000, sup: 74, seed: 65 },
    { id: 6, name: 'Hamid, 52', loc: 'Kandahar, Afghanistan', type: 'photo', title: 'The shop my father built', theme: 'livelihood property', text: 'Hamid’s family business survived three generations — until an airstrike. He is documenting what reparations would mean for small traders.', raised: 1240, goal: 3500, sup: 30, seed: 669 },
    { id: 7, name: 'Thida, 38', loc: 'Shan State, Myanmar', type: 'written', title: 'Letters to my missing brother', theme: 'missing family', text: 'Thida writes letters to a brother who disappeared during the conflict, as a record for families of the missing everywhere.', raised: 540, goal: 2500, sup: 15, seed: 375 },
    { id: 8, name: 'Yusuf, 12', loc: 'Taiz, Yemen', type: 'video', title: 'I still want to be an engineer', theme: 'youth education disability', text: 'Yusuf was injured by a landmine on the way to school. With his mother, he shares his hopes for the future and what support he needs.', raised: 3980, goal: 6000, sup: 101, seed: 786 }
  ];
  const typeLabel = { video: 'Video', photo: 'Photo story', written: 'Written' };
  const typeIcon = { video: '#i-play', photo: '#i-people', written: '#i-doc' };
  const fmt = n => '$' + n.toLocaleString('en-US');

  const grid = $('#stories');
  grid.innerHTML = stories.map(s => `
    <article class="scard reveal" data-id="${s.id}" data-type="${s.type}" tabindex="0" role="button" aria-label="Open story: ${s.title}">
      <div class="scard__img">
        <img src="https://picsum.photos/id/${s.seed}/600/750?grayscale" alt="Placeholder portrait for ${s.name}" loading="lazy">
        <span class="scard__type"><svg><use href="${typeIcon[s.type]}"/></svg>${typeLabel[s.type]}</span>
        <div class="scard__over">
          <p class="scard__loc"><svg><use href="#i-pin"/></svg>${s.loc}</p>
          <h3>${s.title}</h3>
        </div>
      </div>
      <div class="scard__body">
        <p>${s.name} — ${s.text}</p>
        <div class="prog"><span data-w="${Math.round(s.raised / s.goal * 100)}"></span></div>
        <div class="scard__fund"><span><b>${fmt(s.raised)}</b> raised</span><span>${Math.round(s.raised / s.goal * 100)}%</span></div>
        <div class="scard__cta">See story &amp; support <svg><use href="#i-arrow"/></svg></div>
      </div>
    </article>`).join('');

  let activeFilter = 'all';
  const storySearch = $('#storySearch');
  function filterStories() {
    const q = storySearch.value.trim().toLowerCase();
    let shown = 0;
    $$('.scard').forEach(card => {
      const s = stories.find(x => x.id == card.dataset.id);
      const hay = `${s.name} ${s.loc} ${s.title} ${s.theme} ${s.text} ${typeLabel[s.type]}`.toLowerCase();
      const ok = (activeFilter === 'all' || s.type === activeFilter) && (!q || hay.includes(q));
      card.hidden = !ok;
      if (ok) shown++;
    });
    $('#storiesEmpty').hidden = shown > 0;
  }
  storySearch.addEventListener('input', filterStories);
  $$('#storyFilters .chip').forEach(c => c.addEventListener('click', () => {
    $$('#storyFilters .chip').forEach(x => x.classList.remove('is-active'));
    c.classList.add('is-active');
    activeFilter = c.dataset.filter;
    filterStories();
  }));

  /* ---------- Story modal ---------- */
  const modal = $('#storyModal');
  let lastFocus;
  function openStory(id) {
    const s = stories.find(x => x.id == id);
    const pct = Math.round(s.raised / s.goal * 100);
    $('#mImg').src = `https://picsum.photos/id/${s.seed}/900/1000?grayscale`;
    $('#mImg').alt = `Placeholder video still for ${s.name}`;
    $('#mLoc').textContent = s.loc;
    $('#mTitle').textContent = s.title;
    $('#mName').textContent = s.name;
    $('#mText').textContent = s.text + ' (Placeholder story — real testimonials will be added by WHL.)';
    $('#mRaised').textContent = fmt(s.raised) + ' raised';
    $('#mGoal').textContent = 'of ' + fmt(s.goal);
    $('#mSup').textContent = `${s.sup} supporters · ${pct}% funded`;
    $('#mBar').style.width = '0';
    $('.modal__media .play').style.display = s.type === 'video' ? '' : 'none';
    $('.modal__vlabel').textContent = s.type === 'video' ? 'Video testimonial · placeholder' : typeLabel[s.type] + ' · placeholder';
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => setTimeout(() => ($('#mBar').style.width = pct + '%'), 120));
    $('.modal__close').focus();
  }
  function closeStory() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  grid.addEventListener('click', e => {
    const card = e.target.closest('.scard');
    if (card) openStory(card.dataset.id);
  });
  grid.addEventListener('keydown', e => {
    const card = e.target.closest('.scard');
    if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openStory(card.dataset.id); }
  });
  $$('[data-close]', modal).forEach(el => el.addEventListener('click', closeStory));
  $$('.modal__amts .amt').forEach(b => b.addEventListener('click', () => {
    $$('.modal__amts .amt').forEach(x => x.classList.remove('is-active'));
    b.classList.add('is-active');
    $('#mFund').firstChild.textContent = `Give $${b.dataset.m} to this story `;
  }));
  $('#mFund').addEventListener('click', () => toast('Demo only — secure checkout will be connected in the full build.'));
  $('.modal__share').addEventListener('click', () => toast('Share links will appear here (copy link, WhatsApp, X, Facebook).'));

  /* ---------- Site search overlay ---------- */
  const index = [
    { t: 'Home', d: 'Wars Have Limits — The Campaign for Reparations', h: '#top', k: 'Page' },
    { t: 'Our Mission', d: 'A global convention and treaty on civilian reparations', h: '#about', tab: 'mission', k: 'About Us' },
    { t: 'Our Goals', d: 'IHL awareness, political will, reparations as a norm, connecting people', h: '#about', tab: 'goals', k: 'About Us' },
    { t: 'Our People', d: 'Founder Steve Hollingworth and the team; funded by Re:Imagine', h: '#about', tab: 'people', k: 'About Us' },
    { t: 'Our Motivation', d: 'Why the campaign started', h: '#about', tab: 'motivation', k: 'About Us' },
    { t: 'The Book', d: 'Read and purchase the book by Steve Hollingworth', h: '#book', k: 'About Us' },
    { t: 'Civilian Speak', d: 'Search civilian stories, photos and video testimonials', h: '#civilian-speak', k: 'Page' },
    { t: 'Our Strategy', d: 'Awareness, political will and partnerships', h: '#what-we-do', k: 'What We Do' },
    { t: 'Our Work on Reparations', d: 'Toward a global convention and treaty', h: '#what-we-do', k: 'What We Do' },
    { t: 'Our Partners', d: 'NGOs, field practitioners and civil society', h: '#what-we-do', k: 'What We Do' },
    { t: 'Reports & Articles', d: 'Research and policy briefs', h: '#news', k: 'What We Do' },
    { t: 'News & Resources', d: 'Updates, explainers and tools', h: '#news', k: 'What We Do' },
    { t: 'Join the Movement', d: 'Sign up for updates and campaigns', h: '#signup', k: 'Get Involved' },
    { t: 'Take Action Today', d: 'Write to officials, advocate, share on social media', h: '#involved', k: 'Get Involved' },
    { t: 'Tell Your Story', d: 'Submit your testimony of armed conflict', h: '#involved', k: 'Get Involved' },
    { t: 'Follow Us on Social Media', d: 'TikTok, Substack and more', h: '#involved', k: 'Get Involved' },
    { t: 'Donate', d: 'One-off or monthly donation — $20, $40, $60, $100, $250', h: '#donate', k: 'Donate' },
    { t: 'Monthly giving', d: 'Become a monthly supporter', h: '#donate', k: 'Donate' },
    { t: 'Where your money goes', d: 'How donations are distributed', h: '#donate', k: 'Donate' },
    { t: 'Contact', d: '(678) 974-7753 · 100 Flat Shoals Ave. SE, Atlanta GA', h: '#contact', k: 'Contact' }
  ].concat(stories.map(s => ({ t: s.title, d: `${s.name} · ${s.loc}`, h: '#civilian-speak', k: 'Story', story: s.id, extra: s.theme })));

  const search = $('.search');
  const sInput = $('#siteSearch');
  const sResults = $('#searchResults');
  function renderResults(q) {
    q = q.trim().toLowerCase();
    if (!q) { sResults.innerHTML = ''; return; }
    const hits = index.filter(i => `${i.t} ${i.d} ${i.k} ${i.extra || ''}`.toLowerCase().includes(q)).slice(0, 8);
    sResults.innerHTML = hits.length
      ? hits.map((i, n) => `<li><a href="${i.h}" data-n="${index.indexOf(i)}"><span><b>${i.t}</b><small>${i.d}</small></span><span class="rtype">${i.k}</span></a></li>`).join('')
      : `<li class="none">No results for “${q.replace(/</g, '&lt;')}”. Try “reparations” or “donate”.</li>`;
  }
  function openSearch(q = '') {
    search.classList.add('is-open');
    search.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    sInput.value = q;
    renderResults(q);
    setTimeout(() => sInput.focus(), 50);
  }
  function closeSearch() {
    search.classList.remove('is-open');
    search.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  $('.search-open').addEventListener('click', () => openSearch());
  $('.search-close').addEventListener('click', closeSearch);
  sInput.addEventListener('input', () => renderResults(sInput.value));
  $$('.search__suggest button').forEach(b => b.addEventListener('click', () => { sInput.value = b.textContent; renderResults(b.textContent); sInput.focus(); }));
  sResults.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    const item = index[a.dataset.n];
    closeSearch();
    if (item.tab) showTab(item.tab);
    if (item.story) setTimeout(() => openStory(item.story), 600);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeSearch(); closeStory(); setMenu(false); }
    if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  });

  /* ---------- Donate ---------- */
  const impacts = {
    20: '$20 could help translate one civilian testimony into another language.',
    40: '$40 could help record and share one civilian’s testimony.',
    60: '$60 could put IHL education materials in the hands of a local group.',
    100: '$100 could fund a community listening session in a conflict-affected area.',
    250: '$250 could help bring civilian voices before law-makers.'
  };
  let freq = 'once', amount = 40;
  const donateBtn = $('#donateBtn');
  const otherAmt = $('#otherAmt');
  function updateDonate() {
    const label = `Donate $${amount || 0}${freq === 'monthly' ? ' monthly' : ' now'} `;
    donateBtn.firstChild.textContent = label;
    $('#impact').textContent = impacts[amount]
      ? (freq === 'monthly' ? impacts[amount].replace(/^\$(\d+) could/, '$$$1 a month could') : impacts[amount])
      : 'Every amount helps amplify civilian voices and push for a global treaty.';
  }
  $$('.freq__btn').forEach(b => b.addEventListener('click', () => {
    freq = b.dataset.freq;
    $$('.freq__btn').forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-checked', x === b); });
    $('.freq').classList.toggle('is-monthly', freq === 'monthly');
    updateDonate();
  }));
  $$('.amounts .amt[data-amt]').forEach(b => b.addEventListener('click', () => {
    $$('.amounts .amt').forEach(x => x.classList.remove('is-active'));
    b.classList.add('is-active');
    otherAmt.value = '';
    amount = +b.dataset.amt;
    updateDonate();
  }));
  otherAmt.addEventListener('focus', () => {
    $$('.amounts .amt').forEach(x => x.classList.remove('is-active'));
    otherAmt.parentElement.classList.add('is-active');
  });
  otherAmt.addEventListener('input', () => { amount = Math.max(0, Math.round(+otherAmt.value || 0)); updateDonate(); });
  $('#donateForm').addEventListener('submit', e => {
    e.preventDefault();
    toast(`Demo: $${amount} ${freq === 'monthly' ? 'monthly' : 'one-off'} gift — secure checkout connects in the full build.`);
  });

  /* ---------- Sign up ---------- */
  $('#signupForm').addEventListener('submit', e => {
    e.preventDefault();
    toast('Thank you for joining the movement! (Demo — will connect to your mailing list.)');
    e.target.reset();
  });

  /* ---------- Counters, progress, reveal ---------- */
  function countUp(el) {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), dur = 1600, t0 = performance.now();
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  $$('.sec-head, .goal, .wtile, .ncard, .act, .steps li, .stat, .mission, .book__in, .person').forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.classList.add('is-in');
        $$('[data-count]', el).forEach(countUp);
        $$('.prog span', el).forEach(s => (s.style.width = s.dataset.w + '%'));
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal, .where').forEach(el => io.observe(el));
  } else {
    $$('.reveal, .where').forEach(el => el.classList.add('is-in'));
    $$('[data-count]').forEach(el => (el.textContent = el.dataset.count));
    $$('.prog span').forEach(s => (s.style.width = s.dataset.w + '%'));
  }

  /* nav active state */
  const sections = ['top', 'about', 'civilian-speak', 'what-we-do', 'involved'].map(id => document.getElementById(id === 'top' ? 'main' : id));
  const links = $$('.nav__list > .nav__item > .nav__link');
  window.addEventListener('scroll', () => {
    const y = window.scrollY + 160;
    let idx = 0;
    sections.forEach((s, i) => { if (s && s.offsetTop <= y) idx = i; });
    links.forEach((l, i) => l.classList.toggle('is-active', i === idx));
  }, { passive: true });
})();
