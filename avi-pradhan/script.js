(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header shadow + mobile menu ---------- */
  const header = $('.site-header');
  const burger = $('#burger');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const closeMenu = () => {
    document.body.classList.remove('nav-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  };
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('#mainNav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Active nav link on scroll ---------- */
  const links = $$('.main-nav a:not(.btn)');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => navIO.observe(s));
  }

  /* ---------- Count-up numbers ---------- */
  const countUp = el => {
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || '0', 10);
    if (reduce) { el.textContent = to.toFixed(dec); return; }
    const dur = 1300, t0 = performance.now();
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ---------- Scroll reveal (staggered per section) ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    // stagger siblings that sit in the same grid
    reveals.forEach(el => {
      const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
      const i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty('--d', Math.min(i * 0.08, 0.5) + 's');
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        $$('.count', en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ---------- Profit calculator ---------- */
  const cClients = $('#cClients');
  const cRevenue = $('#cRevenue');
  let clients = 10, price = 35;
  const fmt = n => '$' + n.toLocaleString('en-US') + '+';
  const update = () => {
    cClients.textContent = clients;
    cRevenue.textContent = fmt(clients * price * 4);
    cRevenue.classList.remove('bump'); void cRevenue.offsetWidth; cRevenue.classList.add('bump');
  };
  $$('.step-btn').forEach(b => b.addEventListener('click', () => {
    clients = Math.min(65, Math.max(1, clients + parseInt(b.dataset.step, 10)));
    update();
  }));
  $$('.price-chip').forEach(b => b.addEventListener('click', () => {
    price = parseInt(b.dataset.price, 10);
    $$('.price-chip').forEach(x => x.classList.toggle('is-on', x === b));
    update();
  }));

  /* ---------- Mobile sticky buy bar ---------- */
  const sticky = $('#stickyBuy');
  const hero = $('.hero');
  const offer = $('#offer');
  const final = $('.final');
  if ('IntersectionObserver' in window && sticky) {
    const seen = new Map();
    const stickyIO = new IntersectionObserver(entries => {
      entries.forEach(en => seen.set(en.target, en.isIntersecting));
      const hide = [...seen.values()].some(Boolean);
      sticky.classList.toggle('show', !hide);
      sticky.setAttribute('aria-hidden', String(hide));
    }, { threshold: 0.05 });
    [hero, offer, final].forEach(el => el && stickyIO.observe(el));
  }

  /* ---------- Buy buttons (checkout is connected on Shopify) ---------- */
  const toast = $('#toast');
  let tId;
  $$('.js-buy').forEach(b => b.addEventListener('click', () => {
    toast.textContent = 'Great choice! At launch this button adds the Pro Kit to the cart and opens Shopify checkout.';
    toast.classList.add('show');
    clearTimeout(tId);
    tId = setTimeout(() => toast.classList.remove('show'), 3600);
  }));

  const yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
