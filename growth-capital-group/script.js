/* =========================================================
   Growth Capital Group — homepage interactions
   GSAP + ScrollTrigger · Lenis smooth scroll · Three.js 360° model
   ========================================================= */
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const U = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;
  const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US');

  /* ---------------- Data ---------------- */
  const PROPERTIES = [
    { id: 'knightsgate', name: 'Knightsgate Apartments', city: 'College Station', state: 'TX', units: 60, img: 'assets/knightsgate.jpg' },
    { id: 'centre', name: 'The Centre Apartments', city: 'Waco', state: 'TX', units: 96, img: U('1527030280862-64139fba04ca', 900) },
    { id: 'ashwood', name: 'Ashwood Apartments', city: 'Pasadena', state: 'TX', units: 144, img: U('1545324418-cc1a3fa10c00', 900) },
    { id: 'independence', name: 'Independence Portfolio', city: 'Kansas City', state: 'MO', units: 426, img: U('1574362848149-11496d93a7c7', 900) },
    { id: 'palmshore', name: 'Palm Shore Apartments', city: 'Galveston', state: 'TX', units: 88, img: U('1580041065738-e72023775cdc', 900) },
    { id: 'ridgmar', name: 'Ridgmar Townhomes', city: 'Fort Worth', state: 'TX', units: 60, img: U('1567496898669-ee935f5f647a', 900) },
    { id: 'nineteen', name: '19 Eleven Apartments', city: 'Waco', state: 'TX', units: 56, img: U('1515263487990-61b07816b324', 900) },
    { id: 'smokeranch', name: 'Smoke Ranch Apartments', city: 'Las Vegas', state: 'NV', units: null, img: U('1460317442991-0ec209397118', 900) }
  ];

  const EXTRAS = [
    { id: 'call', name: '1:1 Strategy Call', desc: '30 minutes with Mike Desrosiers', price: 'Complimentary', tag: 'Most booked', img: U('1551836022-d5d88e9218df', 700) },
    { id: 'priority', name: 'Priority Deal Access', desc: 'First look at new offerings', price: 'Club members', tag: 'Exclusive', img: U('1594484208280-efa00f96fc21', 700) },
    { id: 'guide', name: 'Free Multifamily Guide', desc: 'How syndications build passive wealth', price: 'Free eBook', tag: 'Popular', img: U('1484154218962-a197022b5858', 700), resource: true, long: 'Our step-by-step guide to how multifamily syndications work, from deal sourcing to distributions.' },
    { id: 'checklist', name: "Passive Investor's Checklist", desc: 'Questions to ask any sponsor', price: 'Free PDF', tag: 'New', img: U('1600607687939-ce8a6c25118c', 700), resource: true, long: 'The due-diligence checklist we would want every passive investor to use, including on us.' },
    { id: 'financing', name: 'Financing Strategies', desc: 'Investing in uncertain markets', price: 'Free report', tag: 'Insight', img: U('1477959858617-67f85cf4f1df', 700), resource: true, long: 'How multifamily investors use strategic financing to protect capital when markets get choppy.' },
    { id: 'newsletter', name: 'Weekly Market Update', desc: 'Real estate insights every week', price: 'Free', tag: 'Weekly', img: U('1486406146926-c627a92ad1ab', 700) }
  ];

  /* ---------------- Storage (safe) ---------------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  /* ---------------- Render portfolio + resources ---------------- */
  const track = $('#portfolioTrack');
  track.innerHTML = PROPERTIES.map((p) => `
    <article class="pcard" data-state="${p.state}" data-id="${p.id}" data-cursor="View">
      <div class="pcard__media"><img src="${p.img}" alt="${p.name}, ${p.city}, ${p.state}" loading="lazy"></div>
      <span class="pcard__state mono">${p.city}, ${p.state}</span>
      <button class="pcard__save" type="button" data-save="${p.id}" aria-label="Save ${p.name} to shortlist" aria-pressed="false">
        <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
      </button>
      <div class="pcard__body">
        <div class="pcard__units">${p.units ? `<b>${p.units}</b><span class="mono">units</span>` : `<b>MF</b><span class="mono">multifamily</span>`}</div>
        <h3 class="pcard__name">${p.name}</h3>
        <div class="pcard__loc"><span>${p.city}, ${p.state === 'TX' ? 'Texas' : p.state === 'MO' ? 'Missouri' : 'Nevada'}</span><i>Save to shortlist →</i></div>
      </div>
    </article>`).join('');

  $('#resGrid').innerHTML = EXTRAS.filter((e) => e.resource).map((e) => `
    <article class="rcard">
      <div class="rcard__book">${e.name}<i></i></div>
      <h3>${e.name}</h3>
      <p>${e.long}</p>
      <div class="rcard__row"><span class="rcard__free">${e.price}</span><button class="add" type="button" data-save="${e.id}" aria-pressed="false">Add to shortlist</button></div>
    </article>`).join('');

  $('#upsellTrack').innerHTML = EXTRAS.map((e) => `
    <div class="ucard" style="--img:url('${e.img}')">
      <span class="ucard__tag">${e.tag}</span>
      <h5>${e.name}</h5>
      <p>${e.desc}</p>
      <div class="ucard__row"><span class="ucard__price">${e.price}</span><button type="button" data-save="${e.id}" aria-pressed="false">Add</button></div>
    </div>`).join('');

  /* ---------------- Shortlist (side cart) ---------------- */
  let cart = store.get('gcg-shortlist', []);
  if (!Array.isArray(cart)) cart = [];
  const findItem = (id) => PROPERTIES.find((p) => p.id === id) || EXTRAS.find((e) => e.id === id);
  cart = cart.filter(findItem);

  const toastEl = $('.toast');
  let toastTimer;
  function toast(msg, action) {
    toastEl.innerHTML = `<i>✓</i><span>${msg}</span>${action ? '<button type="button" data-open-cart>View</button>' : ''}`;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 3200);
  }

  function renderCart() {
    const props = cart.filter((id) => PROPERTIES.some((p) => p.id === id));
    const extras = cart.filter((id) => EXTRAS.some((e) => e.id === id));
    const list = $('#cartItems');
    list.innerHTML = cart.map((id) => {
      const it = findItem(id);
      const isProp = PROPERTIES.includes(it);
      return `<li class="citem" data-id="${id}">
        ${isProp ? `<img src="${it.img}" alt="">` : `<span class="citem__ico">${it.name.charAt(0)}</span>`}
        <div><span class="mono">${isProp ? `${it.city}, ${it.state}` : it.price}</span><h4>${it.name}</h4><small>${isProp ? (it.units ? it.units + ' units · multifamily' : 'Multifamily') : it.desc}</small></div>
        <button class="citem__rm" type="button" data-remove="${id}" aria-label="Remove ${it.name}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      </li>`;
    }).join('');
    $('#cartEmpty').hidden = cart.length > 0;
    $$('[data-cart-count]').forEach((el) => { el.textContent = cart.length; });
    $('#sumProps').textContent = props.length;
    $('#sumUnits').textContent = props.reduce((a, id) => a + (findItem(id).units || 0), 0).toLocaleString('en-US');
    $('#sumExtras').textContent = extras.length;
    const goal = 2;
    const pct = Math.min(props.length / goal, 1) * 100;
    $('#unlockBar').style.width = pct + '%';
    $('#unlockText').innerHTML = props.length >= goal
      ? 'Unlocked: a <b>private deal briefing</b> is included with your request ✦'
      : `Save ${goal - props.length} more ${goal - props.length === 1 ? 'community' : 'communities'} to unlock a <b>private deal briefing</b>`;
    $$('[data-save]').forEach((b) => {
      const on = cart.includes(b.dataset.save);
      b.classList.toggle('is-saved', on);
      b.setAttribute('aria-pressed', on);
      if (b.classList.contains('add')) b.textContent = on ? 'Added ✓' : 'Add to shortlist';
      if (b.closest('.ucard')) b.textContent = on ? 'Added ✓' : 'Add';
    });
    store.set('gcg-shortlist', cart);
  }

  function toggleSave(id, btn) {
    const it = findItem(id);
    if (!it) return;
    if (cart.includes(id)) {
      cart = cart.filter((x) => x !== id);
      renderCart();
      toast(`Removed ${it.name}`);
    } else {
      cart.push(id);
      renderCart();
      const c = $('.nav__cart-count');
      c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
      if (btn && hasGSAP && !reduced && btn.closest('.pcard')) flyToCart(btn);
      toast(`${it.name} saved to your shortlist`, true);
    }
  }

  function flyToCart(btn) {
    const from = btn.getBoundingClientRect();
    const to = $('.nav__cart').getBoundingClientRect();
    const dot = document.createElement('span');
    dot.style.cssText = `position:fixed;z-index:999;left:${from.left + from.width / 2 - 8}px;top:${from.top + from.height / 2 - 8}px;width:16px;height:16px;border-radius:50%;background:#c8743a;pointer-events:none;box-shadow:0 0 0 6px rgba(200,116,58,.25)`;
    document.body.appendChild(dot);
    gsap.to(dot, { x: to.left + to.width / 2 - (from.left + from.width / 2), duration: .8, ease: 'power2.inOut' });
    gsap.to(dot, { y: to.top + to.height / 2 - (from.top + from.height / 2), duration: .8, ease: 'back.in(1.6)', onComplete: () => dot.remove() });
    gsap.to(dot, { scale: .4, duration: .8 });
  }

  document.addEventListener('click', (e) => {
    const save = e.target.closest('[data-save]');
    if (save) { e.preventDefault(); toggleSave(save.dataset.save, save); return; }
    const rm = e.target.closest('[data-remove]');
    if (rm) {
      const li = rm.closest('.citem');
      li.classList.add('is-out');
      setTimeout(() => { cart = cart.filter((x) => x !== rm.dataset.remove); renderCart(); }, 380);
      return;
    }
    if (e.target.closest('[data-open-cart]')) { openCart(); return; }
    if (e.target.closest('[data-close-cart]') && !e.target.closest('a[href^="#"]')) closeCart();
  });

  const cartEl = $('.cart');
  function openCart() {
    document.body.classList.add('cart-open');
    cartEl.setAttribute('aria-hidden', 'false');
    toastEl.classList.remove('is-show');
    lenis && lenis.stop();
    setTimeout(() => $('.cart__close').focus({ preventScroll: true }), 300);
  }
  function closeCart() {
    if (!document.body.classList.contains('cart-open')) return;
    document.body.classList.remove('cart-open');
    cartEl.setAttribute('aria-hidden', 'true');
    lenis && lenis.start();
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeCart(); closeMenu(); } });

  $$('.cart__upsell-nav button').forEach((b) => b.addEventListener('click', () => {
    const t = $('#upsellTrack');
    t.scrollBy({ left: (t.clientWidth * .8) * Number(b.dataset.up), behavior: 'smooth' });
  }));

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis = null;
  if (!reduced && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.stop();
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  renderCart();

  /* ---------------- No GSAP fallback ---------------- */
  if (!hasGSAP) {
    $('.loader').remove();
    document.body.classList.remove('is-loading');
    $$('.reveal-mask').forEach((m) => m.classList.add('is-in'));
    $$('[data-counter]').forEach((c) => { c.textContent = Number(c.dataset.counter).toLocaleString('en-US'); });
    initForms(); initTabs(); initCalc(); initTour(); initVoices();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------------- Text splitting ---------------- */
  function splitChars(el) {
    const text = el.textContent;
    el.textContent = '';
    for (const ch of text) {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch;
      el.appendChild(s);
    }
    return $$('.char', el);
  }

  // Wrap every word (keeping <em>/<br>) in a mask for kinetic line reveals.
  function splitWords(el) {
    const walk = (node, into) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { into.appendChild(document.createTextNode(' ')); return; }
            const mask = document.createElement('span');
            mask.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em';
            const w = document.createElement('span');
            w.className = 'kw';
            w.style.display = 'inline-block';
            w.textContent = part;
            mask.appendChild(w);
            into.appendChild(mask);
          });
        } else if (n.nodeName === 'BR') {
          into.appendChild(document.createElement('br'));
        } else {
          const clone = n.cloneNode(false);
          walk(n, clone);
          into.appendChild(clone);
        }
      });
    };
    const frag = document.createElement('div');
    walk(el, frag);
    el.innerHTML = frag.innerHTML;
    return $$('.kw', el);
  }

  const heroChars = $$('[data-split]').map(splitChars);

  /* ---------------- Preloader -> hero intro ---------------- */
  const loaderNum = $('.loader__num');
  const loadState = { v: 0 };
  let pageLoaded = document.readyState === 'complete';
  window.addEventListener('load', () => { pageLoaded = true; });

  const loaderTl = gsap.timeline({ paused: false });
  loaderTl.to(loadState, {
    v: 86, duration: reduced ? .1 : 1.6, ease: 'power2.inOut',
    onUpdate: () => { loaderNum.textContent = Math.round(loadState.v); $('.loader__line i').style.width = loadState.v + '%'; }
  });

  function finishLoader() {
    gsap.to(loadState, {
      v: 100, duration: .45, ease: 'power1.out',
      onUpdate: () => { loaderNum.textContent = Math.round(loadState.v); $('.loader__line i').style.width = loadState.v + '%'; },
      onComplete: revealSite
    });
  }
  loaderTl.eventCallback('onComplete', () => {
    if (pageLoaded) finishLoader();
    else {
      const t = setTimeout(finishLoader, 2200); // never block more than ~2s on slow images
      window.addEventListener('load', () => { clearTimeout(t); finishLoader(); }, { once: true });
    }
  });

  function revealSite() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });
    tl.to('.loader__mark, .loader__count, .loader__tag, .loader__line', { y: -40, opacity: 0, duration: .6, stagger: .05, ease: 'power3.in' })
      .to('.loader__grid i', { scaleY: 0, duration: .8, stagger: .06 }, '-=.2')
      .to('.loader', { yPercent: -100, duration: 1.1 }, '-=.7')
      .add(() => { $('.loader').remove(); document.body.classList.remove('is-loading'); lenis && lenis.start(); ScrollTrigger.refresh(); }, '-=.1')
      .add(heroIntro(), '-=1.0');
  }

  function heroIntro() {
    const tl = gsap.timeline();
    tl.fromTo('.hero__img', { scale: 1.35 }, { scale: 1.12, duration: 2.6, ease: 'expo.out' }, 0)
      .to('.hero__lines line', { strokeDashoffset: 0, duration: 2.2, stagger: .12, ease: 'expo.inOut' }, 0.1)
      .from('.hero__eyebrow', { y: 20, opacity: 0, duration: .9, ease: 'power3.out' }, .3)
      .from(heroChars.flat(), { yPercent: 115, rotate: 8, duration: 1.2, stagger: .018, ease: 'expo.out' }, .35)
      .from('.hero__rotator', { yPercent: 115, opacity: 0, duration: 1.1, ease: 'expo.out' }, .9)
      .from('.hero__copy > *', { y: 30, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out' }, 1)
      .from('.hero__card', { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out' }, 1.1)
      .to('.spark-line', { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, 1.3)
      .from('.spark-area', { opacity: 0, duration: 1.4 }, 1.8)
      .from('.nav__inner > *', { y: -30, opacity: 0, duration: 1, stagger: .08, ease: 'power3.out' }, .6)
      .from('.hero__scroll', { opacity: 0, duration: 1 }, 1.6)
      .add(startRotator, 1.8);
    return tl;
  }

  /* ---------------- Hero word rotator ---------------- */
  function startRotator() {
    const rot = $('.hero__rotator');
    const items = $$('span', rot);
    const inner = document.createElement('span');
    inner.className = 'hero__rotator-track';
    items.forEach((i) => inner.appendChild(i));
    rot.appendChild(inner);
    const widths = items.map((i) => i.getBoundingClientRect().width);
    let idx = 0;
    gsap.set(rot, { width: widths[0] });
    if (reduced) return;
    setInterval(() => {
      idx++;
      gsap.to(inner, {
        yPercent: -(100 / items.length) * idx, duration: 1, ease: 'expo.inOut',
        onComplete: () => { if (idx === items.length - 1) { idx = 0; gsap.set(inner, { yPercent: 0 }); } }
      });
      gsap.to(rot, { width: widths[idx], duration: 1, ease: 'expo.inOut' });
    }, 2600);
  }

  /* ---------------- Hero parallax ---------------- */
  if (!reduced) {
    gsap.to('.hero__img', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__title', { yPercent: -18, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });
  }

  /* ---------------- Nav behaviour ---------------- */
  const nav = $('.nav');
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle('is-scrolled', y > 40);
      const goingDown = y > lastY && y > 400;
      if (!document.body.classList.contains('menu-open')) nav.classList.toggle('is-hidden', goingDown);
      lastY = y;
      $('.mbar').classList.toggle('is-show', y > window.innerHeight * .8);
    }
  });
  ['portfolio', 'story', 'tour', 'returns', 'team'].forEach((id) => {
    const link = $(`.nav__links a[href="#${id}"]`);
    ScrollTrigger.create({ trigger: '#' + id, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => link && link.classList.toggle('is-active', s.isActive) });
  });

  /* ---------------- Menu ---------------- */
  const burger = $('.burger');
  function closeMenu() {
    if (!document.body.classList.contains('menu-open')) return;
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    $('.menu').setAttribute('aria-hidden', 'true');
    lenis && lenis.start();
  }
  burger.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    if (!open) return closeMenu();
    document.body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    $('.menu').setAttribute('aria-hidden', 'false');
    lenis && lenis.stop();
  });

  /* ---------------- Cinematic section transitions ---------------- */
  const curtainBars = $$('.curtain i');
  const curtainLabel = $('.curtain__label');
  let transitioning = false;
  function goTo(target, label) {
    if (transitioning) return;
    const el = document.querySelector(target);
    if (!el) return;
    const jump = () => {
      if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
      else el.scrollIntoView();
      ScrollTrigger.update();
    };
    if (reduced) { jump(); return; }
    transitioning = true;
    curtainLabel.textContent = label || '';
    const tl = gsap.timeline({ onComplete: () => { transitioning = false; } });
    tl.set(curtainBars, { transformOrigin: 'bottom' })
      .to(curtainBars, { scaleY: 1, duration: .6, stagger: .05, ease: 'expo.inOut' })
      .fromTo(curtainLabel, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .5, ease: 'expo.out' }, '-=.25')
      .add(jump)
      .to(curtainLabel, { opacity: 0, y: -30, duration: .4, ease: 'power2.in' }, '+=.15')
      .set(curtainBars, { transformOrigin: 'top' })
      .to(curtainBars, { scaleY: 0, duration: .7, stagger: .05, ease: 'expo.inOut' }, '-=.15');
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href.length < 2) return;
    e.preventDefault();
    closeMenu();
    if (a.hasAttribute('data-close-cart')) closeCart();
    if (a.dataset.tab) switchTab(a.dataset.tab);
    else if (href === '#club' && a.dataset.transition === 'Investor Club') switchTab('join');
    if (a.hasAttribute('data-request')) prefillRequest();
    goTo(href, a.dataset.transition);
  });

  function prefillRequest() {
    const names = cart.map((id) => findItem(id).name);
    if (names.length) $('#clubNote').value = 'Please send details on: ' + names.join(', ') + '.';
  }

  /* ---------------- Statement word reveal ---------------- */
  const statement = $('[data-words]');
  statement.innerHTML = statement.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
  gsap.to($$('.w', statement), {
    opacity: 1, stagger: .05, ease: 'none',
    scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: true }
  });

  /* ---------------- Kinetic headings ---------------- */
  $$('.display').forEach((h) => {
    const words = splitWords(h);
    gsap.from(words, {
      yPercent: 110, rotate: 4, duration: 1.2, stagger: .045, ease: 'expo.out',
      scrollTrigger: { trigger: h, start: 'top 85%' }
    });
  });

  /* ---------------- Counters ---------------- */
  $$('[data-counter]').forEach((el) => {
    const end = Number(el.dataset.counter);
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        gsap.to(o, { v: end, duration: 2.2, ease: 'expo.out', onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-US'); } });
        const stat = el.closest('.stat');
        if (stat) stat.classList.add('is-in');
      }
    });
  });
  gsap.from('.stat', { y: 50, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.stats', start: 'top 85%' } });

  /* ---------------- Scroll story (pinned, cinematic) ---------------- */
  (function story() {
    const frames = $$('.frame');
    const scenes = $$('.scene');
    const cur = $('.story__current');
    const gridPaths = $$('.story__grid .g');
    gridPaths.forEach((p) => {
      const len = p.getTotalLength ? p.getTotalLength() : 200;
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    const n = frames.length;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.story__pin', start: 'top top', end: () => '+=' + window.innerHeight * (n - .3),
        pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(n - 1, Math.floor(self.progress * n * .999 + .15));
          cur.textContent = String(i + 1).padStart(2, '0');
        }
      }
    });
    tl.to('.story__progress i', { scaleX: 1, duration: n }, 0)
      .to(gridPaths, { strokeDashoffset: 0, duration: 1.2, stagger: .15 }, 0)
      .to($('img', frames[0]), { scale: 1.05, duration: 1 }, 0);
    for (let i = 1; i < n; i++) {
      const at = i - .6;
      tl.fromTo(frames[i], { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .8, ease: 'power2.inOut' }, at)
        .fromTo($('img', frames[i]), { scale: 1.45, yPercent: 8 }, { scale: 1.05, yPercent: 0, duration: 1.4 }, at)
        .to($('img', frames[i - 1]), { scale: 1.2, yPercent: -6, duration: .8 }, at)
        .to(scenes[i - 1], { autoAlpha: 0, y: -60, duration: .35 }, at)
        .fromTo(scenes[i], { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0, duration: .45 }, at + .3)
        .to('.story__grid svg', { rotate: i * 0, scale: 1 + i * .04, duration: .8, transformOrigin: '75% 25%' }, at);
    }
    tl.to({}, { duration: .3 });
  })();

  /* ---------------- Portfolio: horizontal scroll ---------------- */
  const mm = gsap.matchMedia();
  const pdragBar = $('.pdrag i');
  mm.add('(min-width: 721px)', () => {
    const viewport = $('.portfolio__viewport');
    const dist = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.portfolio', start: () => ($('.portfolio').offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'), end: () => '+=' + Math.max(dist(), 1),
        pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (s) => gsap.set(pdragBar, { scaleX: s.progress })
      }
    });
    // Subtle skew on velocity for a kinetic feel
    let skewSetter = gsap.quickTo('.pcard', 'skewX', { duration: .5, ease: 'power3' });
    const st = tween.scrollTrigger;
    const onTick = () => { if (!reduced) skewSetter(gsap.utils.clamp(-6, 6, st.getVelocity() / -400)); };
    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  });
  mm.add('(max-width: 720px)', () => {
    const vp = $('.portfolio__viewport');
    const onScroll = () => { const m = vp.scrollWidth - vp.clientWidth; gsap.set(pdragBar, { scaleX: m > 0 ? vp.scrollLeft / m : 0 }); };
    vp.addEventListener('scroll', onScroll, { passive: true });
    return () => vp.removeEventListener('scroll', onScroll);
  });
  // Entrance via IntersectionObserver: reliable inside the pinned horizontal section
  gsap.set('.pcard', { y: 80, opacity: 0 });
  const cardIO = new IntersectionObserver((ents) => {
    if (!ents.some((e) => e.isIntersecting)) return;
    cardIO.disconnect();
    gsap.to('.pcard', { y: 0, opacity: 1, duration: 1.2, stagger: .08, ease: 'expo.out' });
  }, { threshold: .15 });
  cardIO.observe($('.portfolio__viewport'));

  // Filter chips
  $$('.chip').forEach((chip) => chip.addEventListener('click', () => {
    $$('.chip').forEach((c) => { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-selected', c === chip); });
    const f = chip.dataset.filter;
    const cards = $$('.pcard');
    gsap.to(cards, {
      opacity: 0, y: 30, duration: .3, stagger: .02, ease: 'power2.in',
      onComplete: () => {
        cards.forEach((c) => c.classList.toggle('is-hidden', f !== 'all' && c.dataset.state !== f));
        gsap.set(track, { x: 0 });
        ScrollTrigger.refresh();
        gsap.fromTo(cards.filter((c) => !c.classList.contains('is-hidden')), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .8, stagger: .06, ease: 'expo.out' });
      }
    });
  }));

  // Card tilt
  if (finePointer && !reduced) {
    $$('.pcard').forEach((card) => {
      const rx = gsap.quickTo(card, 'rotateX', { duration: .6, ease: 'power3' });
      const ry = gsap.quickTo(card, 'rotateY', { duration: .6, ease: 'power3' });
      gsap.set(card, { transformPerspective: 900 });
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        rx(((e.clientY - r.top) / r.height - .5) * -8);
        ry(((e.clientX - r.left) / r.width - .5) * 8);
      });
      card.addEventListener('mouseleave', () => { rx(0); ry(0); });
    });
  }

  /* ---------------- Gauges ---------------- */
  $$('.gauge').forEach((g, i) => {
    const fg = $('.gauge__fg', g);
    const C = 2 * Math.PI * 52;
    gsap.set(fg, { strokeDasharray: C, strokeDashoffset: C });
    gsap.to(fg, { strokeDashoffset: C * (1 - Number(g.dataset.gauge)), duration: 2, delay: i * .15, ease: 'expo.out', scrollTrigger: { trigger: '.gauges', start: 'top 80%' } });
  });
  gsap.from('.calc', { y: 80, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.calc', start: 'top 85%' } });

  /* ---------------- Bento ---------------- */
  $$('.tile__meter i').forEach((i, k) => i.style.setProperty('--h', (35 + k * 6.5) + '%'));
  $$('.tile').forEach((t) => {
    ScrollTrigger.create({ trigger: t, start: 'top 80%', once: true, onEnter: () => t.classList.add('is-in') });
    if (finePointer) t.addEventListener('mousemove', (e) => {
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
  gsap.from('.tile', { y: 70, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.bento', start: 'top 85%' } });

  /* ---------------- Process ---------------- */
  gsap.to('.steps__line i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 55%', scrub: true } });
  $$('.step').forEach((s, i) => {
    ScrollTrigger.create({ trigger: '.steps', start: () => `top+=${i * 20} 70%`, onEnter: () => s.classList.add('is-in'), onLeaveBack: () => s.classList.remove('is-in') });
  });
  gsap.from('.step', { y: 60, opacity: 0, duration: 1.1, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.steps', start: 'top 85%' } });

  /* ---------------- Team reveal ---------------- */
  $$('.reveal-mask').forEach((m) => ScrollTrigger.create({ trigger: m, start: 'top 85%', once: true, onEnter: () => m.classList.add('is-in') }));
  gsap.from('.person__body', { y: 40, opacity: 0, duration: 1, stagger: .15, ease: 'expo.out', scrollTrigger: { trigger: '.team__grid', start: 'top 70%' } });

  /* ---------------- Misc reveals ---------------- */
  gsap.from('.rcard', { y: 60, opacity: 0, duration: 1.1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.res__grid', start: 'top 85%' } });
  gsap.from('.club__card', { y: 80, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.club__card', start: 'top 85%' } });
  gsap.from('.perks li', { y: 30, opacity: 0, duration: .9, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.perks', start: 'top 85%' } });
  gsap.from('.footer__word span', { yPercent: 60, opacity: 0, duration: 1.6, stagger: .15, ease: 'expo.out', scrollTrigger: { trigger: '.footer__word', start: 'top 95%' } });
  gsap.from('.tour__wrap', { y: 80, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.tour__wrap', start: 'top 85%' } });

  /* ---------------- Cursor + magnetic ---------------- */
  if (finePointer && !reduced) {
    const cursor = $('.cursor');
    const dot = $('.cursor__dot');
    const ring = $('.cursor__ring');
    const text = $('.cursor__text');
    const dx = gsap.quickTo(dot, 'x', { duration: .1 }), dy = gsap.quickTo(dot, 'y', { duration: .1 });
    const rx = gsap.quickTo(ring, 'x', { duration: .45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: .45, ease: 'power3' });
    window.addEventListener('mousemove', (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
    document.addEventListener('mouseover', (e) => {
      const lab = e.target.closest('[data-cursor]');
      const btn = e.target.closest('a, button, input, select, textarea, label');
      if (btn && lab && !btn.closest('.tour__stage')) { cursor.classList.remove('is-label'); cursor.classList.add('is-hover'); return; }
      if (lab) { text.textContent = lab.dataset.cursor; cursor.classList.add('is-label'); cursor.classList.remove('is-hover'); return; }
      cursor.classList.remove('is-label');
      cursor.classList.toggle('is-hover', !!btn);
    });
    document.addEventListener('mouseleave', () => gsap.to(cursor, { opacity: 0 }));
    document.addEventListener('mouseenter', () => gsap.to(cursor, { opacity: 1 }));

    $$('.magnetic').forEach((m) => {
      const mx = gsap.quickTo(m, 'x', { duration: .6, ease: 'elastic.out(1, .4)' });
      const my = gsap.quickTo(m, 'y', { duration: .6, ease: 'elastic.out(1, .4)' });
      m.addEventListener('mousemove', (e) => {
        const r = m.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * .25);
        my((e.clientY - r.top - r.height / 2) * .35);
      });
      m.addEventListener('mouseleave', () => { mx(0); my(0); });
    });
  }

  initForms(); initTabs(); initCalc(); initTour(); initVoices();

  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* =========================================================
     Testimonials
     ========================================================= */
  function initVoices() {
    const slides = $$('.voice');
    const idxEl = $('.voices__idx b');
    let i = 0, timer;
    slides.forEach((s) => {
      const p = $('p', s);
      p.innerHTML = p.textContent.split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
    });
    function show(n) {
      const prev = slides[i];
      i = (n + slides.length) % slides.length;
      const next = slides[i];
      if (prev === next) return;
      idxEl.textContent = String(i + 1).padStart(2, '0');
      if (!hasGSAP || reduced) { prev.classList.remove('is-active'); next.classList.add('is-active'); return; }
      gsap.to($$('.w', prev), { y: -20, opacity: 0, duration: .4, stagger: .01, ease: 'power2.in', onComplete: () => {
        prev.classList.remove('is-active');
        next.classList.add('is-active');
        gsap.fromTo($$('.w', next), { y: 30, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: .8, stagger: .025, ease: 'expo.out' });
        gsap.fromTo($('footer', next), { opacity: 0 }, { opacity: 1, duration: .6, delay: .3 });
      } });
    }
    const auto = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 7000); };
    $$('.vbtn').forEach((b) => b.addEventListener('click', () => { show(i + Number(b.dataset.dir)); auto(); }));
    auto();
  }

  /* =========================================================
     Tabs + forms
     ========================================================= */
  function switchTab(name) {
    const tabs = $('.tabs');
    tabs.classList.toggle('is-call', name === 'call');
    $$('[data-tab-btn]').forEach((b) => { const on = b.dataset.tabBtn === name; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
    $('.form__success').hidden = true;
    $$('[data-pane]').forEach((p) => { p.hidden = p.dataset.pane !== name; });
  }
  function initTabs() {
    $$('[data-tab-btn]').forEach((b) => b.addEventListener('click', () => switchTab(b.dataset.tabBtn)));
  }

  function initForms() {
    // Booking days & slots
    const days = $('#days');
    const slots = $('#slots');
    const d = new Date();
    const list = [];
    while (list.length < 5) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) list.push(new Date(d));
    }
    days.innerHTML = list.map((x, i) => `<button type="button" class="day${i === 0 ? ' is-active' : ''}" data-day="${x.toDateString()}"><small>${x.toLocaleDateString('en-US', { weekday: 'short' })}</small><b>${x.getDate()}</b><small>${x.toLocaleDateString('en-US', { month: 'short' })}</small></button>`).join('');
    const times = ['9:00 am', '10:00 am', '11:00 am', '12:30 pm', '1:30 pm', '2:30 pm', '3:30 pm', '4:30 pm'];
    let selDay = list[0].toDateString(), selTime = null;
    function renderSlots(seed) {
      selTime = null;
      slots.innerHTML = times.map((t, i) => {
        const busy = ((i + 1) * (seed + 3)) % 5 === 0;
        return `<button type="button" class="slot" data-time="${t}" ${busy ? 'disabled aria-label="' + t + ' unavailable"' : ''}>${t}</button>`;
      }).join('');
    }
    renderSlots(list[0].getDate());
    days.addEventListener('click', (e) => {
      const b = e.target.closest('.day'); if (!b) return;
      $$('.day', days).forEach((x) => x.classList.toggle('is-active', x === b));
      selDay = b.dataset.day;
      renderSlots(new Date(selDay).getDate());
    });
    slots.addEventListener('click', (e) => {
      const b = e.target.closest('.slot'); if (!b || b.disabled) return;
      $$('.slot', slots).forEach((x) => x.classList.toggle('is-active', x === b));
      selTime = b.dataset.time;
    });

    $$('select').forEach((s) => s.addEventListener('change', () => s.classList.toggle('has-value', !!s.value)));

    $$('.form').forEach((form) => form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      $$('[required]', form).forEach((f) => {
        const valid = f.type === 'email' ? /^\S+@\S+\.\S+$/.test(f.value) : !!f.value.trim();
        f.closest('.field').classList.toggle('is-error', !valid);
        if (!valid) ok = false;
      });
      if (form.dataset.pane === 'call' && !selTime) { ok = false; toast('Please choose a time slot'); }
      if (!ok) { if (hasGSAP) gsap.fromTo(form, { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(1, .3)' }); return; }
      const name = (form.elements.name.value.split(' ')[0] || '').trim();
      const msg = form.dataset.pane === 'call'
        ? `Your discovery call is requested for ${new Date(selDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${selTime} PT. A confirmation will follow by email.`
        : `Welcome to the Investor Club${name ? ', ' + name : ''}. We'll be in touch within one business day${cart.length ? ' with details on your shortlist' : ''}.`;
      $('.form__success h3').textContent = form.dataset.pane === 'call' ? 'Call requested.' : "You're in.";
      $('.form__success-msg').textContent = msg;
      form.hidden = true;
      $('.form__success').hidden = false;
      form.reset();
      $$('select', form).forEach((s) => s.classList.remove('has-value'));
    }));
    $('[data-reset-form]').addEventListener('click', () => switchTab($('.tabs').classList.contains('is-call') ? 'call' : 'join'));
  }

  /* =========================================================
     Return calculator + chart
     ========================================================= */
  function initCalc() {
    const amt = $('#calcAmt'), yrs = $('#calcYrs');
    const W = 520, H = 220, PAD = 10;
    let scn = 'low';
    const state = { cf: 0, eq: 0, n: 6 };
    const shown = { cf: 0, eq: 0 };
    const gl = $('.calc__gridlines');

    function paint(amount, years) {
      const n = years;
      const max = amount * 3.9;
      const x = (i) => PAD + (i / n) * (W - PAD * 2);
      const y = (v) => H - 24 - (v / max) * (H - 40);
      // cumulative cash flow and equity (linear-ish value growth to exit multiple)
      const cfPts = [], eqPts = [];
      for (let i = 0; i <= n; i++) {
        const cum = shown.cf * i;
        const eqVal = amount + (shown.eq - amount) * Math.pow(i / n, 1.6);
        cfPts.push([x(i), y(cum)]);
        eqPts.push([x(i), y(eqVal + cum * .0)]);
      }
      const line = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
      const area = (pts) => line(pts) + ` L${pts[pts.length - 1][0]} ${H - 24} L${pts[0][0]} ${H - 24} Z`;
      $('#eqLine').setAttribute('d', line(eqPts));
      $('#eqArea').setAttribute('d', area(eqPts));
      $('#cfArea').setAttribute('d', area(cfPts));
      $('#calcDots').innerHTML = eqPts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5"/>`).join('');
      let g = '';
      for (let i = 0; i <= n; i++) g += `<text x="${x(i)}" y="${H - 6}" text-anchor="middle">Y${i}</text>`;
      [0.25, 0.5, 0.75].forEach((f) => { g += `<line x1="0" x2="${W}" y1="${(H - 24) - f * (H - 40)}" y2="${(H - 24) - f * (H - 40)}"/>`; });
      gl.innerHTML = g;
    }

    function update(animate) {
      const amount = Number(amt.value), years = Number(yrs.value);
      const cocRate = scn === 'low' ? .07 : .12;
      const mult = scn === 'low' ? 2 : 3;
      state.cf = amount * cocRate;
      state.eq = amount * mult;
      $('#calcAmtOut').textContent = fmt(amount);
      $('#calcYrsOut').textContent = years + ' years';
      amt.style.setProperty('--p', ((amount - 25000) / (1000000 - 25000)) * 100 + '%');
      yrs.style.setProperty('--p', ((years - 5) / 2) * 100 + '%');
      const total = state.eq + state.cf * years;
      const setOut = () => {
        $('#calcCf').textContent = fmt(shown.cf);
        $('#calcExit').textContent = fmt(shown.eq);
        $('#calcProfit').textContent = fmt(shown.eq + shown.cf * years - amount);
        paint(amount, years);
      };
      if (animate && hasGSAP && !reduced) gsap.to(shown, { cf: state.cf, eq: state.eq, duration: .9, ease: 'expo.out', onUpdate: setOut });
      else { shown.cf = state.cf; shown.eq = state.eq; setOut(); }
      return total;
    }
    amt.addEventListener('input', () => update(false));
    yrs.addEventListener('input', () => update(true));
    $$('.calc__toggle button').forEach((b) => b.addEventListener('click', () => {
      scn = b.dataset.scn;
      $$('.calc__toggle button').forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-checked', x === b); });
      update(true);
    }));
    shown.cf = 0; shown.eq = Number(amt.value);
    update(false);
    if (hasGSAP) ScrollTrigger.create({ trigger: '.calc', start: 'top 75%', once: true, onEnter: () => { shown.cf = 0; shown.eq = Number(amt.value); update(true); } });
  }

  /* =========================================================
     360° property explorer (Three.js)
     ========================================================= */
  function initTour() {
    const stage = $('.tour__stage');
    const canvas = $('#tourCanvas');
    if (typeof window.THREE === 'undefined') { $('.tour__fallback').textContent = '3D view unavailable on this device.'; return; }
    const T = window.THREE;
    let renderer;
    try {
      renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    } catch (e) { $('.tour__fallback').textContent = '3D view unavailable on this device.'; return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.outputEncoding = T.sRGBEncoding;

    const scene = new T.Scene();
    const DAY_BG = new T.Color('#e8e1d4'), NIGHT_BG = new T.Color('#0f1622');
    scene.background = DAY_BG.clone();
    scene.fog = new T.Fog(scene.background, 150, 300);
    const camera = new T.PerspectiveCamera(36, 1, .5, 800);

    const hemi = new T.HemisphereLight('#fff8ee', '#b9ad98', .85);
    scene.add(hemi);
    const sun = new T.DirectionalLight('#fff2df', 1.05);
    sun.position.set(60, 90, 40);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 70, bottom: -70, near: 10, far: 260 });
    sun.shadow.bias = -0.0006;
    scene.add(sun);
    const moon = new T.PointLight('#ffb36b', 0, 90, 2);
    moon.position.set(0, 14, 0);
    scene.add(moon);

    // Ground
    const groundMat = new T.MeshStandardMaterial({ color: '#ddd5c6', roughness: 1 });
    const ground = new T.Mesh(new T.CircleGeometry(160, 64), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const padMat = new T.MeshStandardMaterial({ color: '#efe9de', roughness: 1 });
    const roadMat = new T.MeshStandardMaterial({ color: '#c9bfae', roughness: 1 });
    const grassMat = new T.MeshStandardMaterial({ color: '#b7bf9f', roughness: 1 });

    const textureCache = {};
    function facade(cols, floors, kind) {
      const key = cols + 'x' + floors + kind;
      if (textureCache[key]) return textureCache[key];
      const cw = 64, fh = 72;
      const mk = (night) => {
        const c = document.createElement('canvas');
        c.width = Math.max(64, cols * cw); c.height = floors * fh;
        const x = c.getContext('2d');
        x.fillStyle = night ? '#000' : (kind === 'brick' ? '#efe2d2' : '#f6f2ea');
        x.fillRect(0, 0, c.width, c.height);
        for (let f = 0; f < floors; f++) {
          for (let k = 0; k < cols; k++) {
            const wx = k * cw + 14, wy = f * fh + 16;
            if (night) {
              const lit = Math.random() > .38;
              x.fillStyle = lit ? (Math.random() > .5 ? '#ffcf8a' : '#ffb76a') : '#0a0d12';
              x.fillRect(wx, wy, cw - 28, fh - 30);
            } else {
              x.fillStyle = '#8f9c9b';
              x.fillRect(wx, wy, cw - 28, fh - 30);
              x.fillStyle = 'rgba(255,255,255,.35)';
              x.fillRect(wx, wy, (cw - 28) / 2.2, fh - 30);
              x.fillStyle = '#c8743a';
              if (kind !== 'town' && f > 0 && k % 2 === 0) x.fillRect(wx - 6, wy + fh - 30, cw - 16, 4); // balcony rails
            }
          }
          if (!night) { x.fillStyle = 'rgba(0,0,0,.06)'; x.fillRect(0, f * fh, c.width, 3); }
        }
        const t = new T.CanvasTexture(c);
        t.encoding = T.sRGBEncoding;
        t.anisotropy = 4;
        return t;
      };
      textureCache[key] = { map: mk(false), emissive: mk(true) };
      return textureCache[key];
    }

    const allFacadeMats = [];
    function block(w, d, floors, kind) {
      const h = floors * 3.2;
      const fw = facade(Math.max(1, Math.round(w / 3.4)), floors, kind);
      const fd = facade(Math.max(1, Math.round(d / 3.4)), floors, kind);
      const mat = (f) => {
        const m = new T.MeshStandardMaterial({ map: f.map, emissiveMap: f.emissive, emissive: new T.Color('#ffffff'), emissiveIntensity: 0, roughness: .85 });
        allFacadeMats.push(m);
        return m;
      };
      const roof = new T.MeshStandardMaterial({ color: kind === 'brick' ? '#d9cbb9' : '#e9e3d8', roughness: .9 });
      const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), [mat(fd), mat(fd), roof, roof, mat(fw), mat(fw)]);
      mesh.position.y = h / 2;
      mesh.castShadow = true; mesh.receiveShadow = true;
      return mesh;
    }
    function pitched(w, d, rise, color) {
      const s = new T.Shape();
      s.moveTo(-d / 2 - .4, 0); s.lineTo(0, rise); s.lineTo(d / 2 + .4, 0); s.lineTo(-d / 2 - .4, 0);
      const g = new T.ExtrudeGeometry(s, { depth: w + .8, bevelEnabled: false });
      g.translate(0, 0, -(w + .8) / 2);
      g.rotateY(Math.PI / 2);
      const m = new T.Mesh(g, new T.MeshStandardMaterial({ color, roughness: .8 }));
      m.castShadow = true;
      return m;
    }
    function tree(x, z, s = 1) {
      const g = new T.Group();
      const trunk = new T.Mesh(new T.CylinderGeometry(.18 * s, .25 * s, 2 * s, 6), new T.MeshStandardMaterial({ color: '#8a7560' }));
      trunk.position.y = s;
      const top = new T.Mesh(new T.IcosahedronGeometry(1.6 * s, 0), new T.MeshStandardMaterial({ color: '#8fa27f', flatShading: true, roughness: 1 }));
      top.position.y = 2.6 * s;
      trunk.castShadow = top.castShadow = true;
      g.add(trunk, top);
      g.position.set(x, 0, z);
      return g;
    }
    function flat(w, d, mat, x, z, y = .02) {
      const m = new T.Mesh(new T.PlaneGeometry(w, d), mat);
      m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true;
      return m;
    }
    function pool(x, z, w, d) {
      const g = new T.Group();
      g.add(flat(w + 4, d + 4, new T.MeshStandardMaterial({ color: '#f4efe6' }), 0, 0, .04));
      const water = new T.Mesh(new T.BoxGeometry(w, .2, d), new T.MeshStandardMaterial({ color: '#6fb7c4', emissive: '#2d8fa3', emissiveIntensity: .25, roughness: .15, metalness: .1 }));
      water.position.y = .08;
      g.add(water);
      g.position.set(x, 0, z);
      g.userData.water = water;
      return g;
    }
    function cars(x0, z0, count, dir) {
      const g = new T.Group();
      const colors = ['#2b2f33', '#c8743a', '#8f9c9b', '#f4efe6', '#3e4a5a', '#7f8f7a'];
      for (let i = 0; i < count; i++) {
        if (Math.random() < .3) continue;
        const car = new T.Mesh(new T.BoxGeometry(1.8, 1.1, 4), new T.MeshStandardMaterial({ color: colors[i % colors.length], roughness: .5 }));
        car.position.set(dir === 'x' ? x0 + i * 2.8 : x0, .55, dir === 'x' ? z0 : z0 + i * 2.8);
        if (dir !== 'x') car.rotation.y = Math.PI / 2;
        car.castShadow = true;
        g.add(car);
      }
      return g;
    }

    const MODELS = {
      garden: {
        meta: { units: 60, floors: 3, bldg: 4 },
        build(g) {
          g.add(flat(76, 66, padMat, 0, 0));
          g.add(flat(30, 24, grassMat, 0, 0, .03));
          const spots = [[-22, -18, 0], [22, -18, 0], [-22, 18, 0], [22, 18, 0]];
          spots.forEach(([x, z]) => {
            const b = block(22, 11, 3, 'brick'); b.position.x = x; b.position.z = z; g.add(b);
            const r = pitched(22, 11, 3.2, '#5d6461'); r.position.set(x, 9.6, z); g.add(r);
          });
          const club = block(9, 7, 1, 'plain'); club.position.set(0, 1.6, -27); club.position.y = 1.6; g.add(club);
          const cr = pitched(9, 7, 2.2, '#c8743a'); cr.position.set(0, 3.2, -27); g.add(cr);
          g.add(pool(0, 2, 12, 6));
          g.add(flat(84, 6, roadMat, 0, 36)); g.add(flat(6, 76, roadMat, 41, 0));
          g.add(cars(-30, 36, 22, 'x'));
          [[-36, -4], [-36, 6], [36, -6], [36, 8], [-8, -9], [10, 10], [-12, 9], [12, -8], [0, 30], [-40, -30], [40, 28]].forEach(([x, z], i) => g.add(tree(x, z, .9 + (i % 3) * .15)));
        },
        hotspots: [
          { p: [-22, 10.5, -12.4], t: 'Renovated units', d: 'Interior upgrades such as flooring, fixtures and appliances support higher rents and lower turnover.' },
          { p: [0, 1.2, 2], t: 'Resort-style pool', d: 'Amenity upgrades lift resident satisfaction and retention, protecting occupancy.' },
          { p: [0, 5.5, -27], t: 'Clubhouse & leasing', d: 'Professional, on-site management is where our operating background pays off.' },
          { p: [8, 1.2, 36], t: 'Parking & curb appeal', d: 'Exterior paint, signage and landscaping form the first impression for every prospect.' }
        ]
      },
      midrise: {
        meta: { units: 96, floors: 4, bldg: 1 },
        build(g) {
          g.add(flat(72, 64, padMat, 0, 0));
          const a = block(46, 12, 4, 'plain'); a.position.set(0, 0, -20); a.position.y = 6.4; g.add(a);
          const b = block(12, 30, 4, 'plain'); b.position.set(-17, 6.4, 1); g.add(b);
          const c = block(12, 30, 4, 'plain'); c.position.set(17, 6.4, 1); g.add(c);
          [[0, 12.9, -20, 46.6, 12.6], [-17, 12.9, 1, 12.6, 30.6], [17, 12.9, 1, 12.6, 30.6]].forEach(([x, y, z, w, d]) => {
            const par = new T.Mesh(new T.BoxGeometry(w, .6, d), new T.MeshStandardMaterial({ color: '#c8743a', roughness: .7 }));
            par.position.set(x, y, z); par.castShadow = true; g.add(par);
          });
          g.add(flat(22, 26, grassMat, 0, 2, .03));
          g.add(pool(0, 0, 10, 5));
          g.add(flat(80, 6, roadMat, 0, 26)); g.add(cars(-34, 26, 26, 'x'));
          g.add(flat(6, 64, roadMat, -34, 0));
          [[-6, 10], [6, 10], [-6, -8], [6, -8], [30, 20], [-30, -26], [30, -26], [0, 14]].forEach(([x, z], i) => g.add(tree(x, z, .8 + (i % 2) * .2)));
        },
        hotspots: [
          { p: [0, 13.6, -20], t: 'Roof & systems', d: 'Capital improvements to roofs, HVAC and plumbing reduce long-term operating risk.' },
          { p: [0, 1.2, 0], t: 'Courtyard amenities', d: 'A private courtyard with a pool and outdoor lounge commands premium rents.' },
          { p: [17, 7, 16.2], t: 'Upgraded interiors', d: 'Unit-by-unit renovations as leases turn over keep income flowing during the upgrade.' },
          { p: [-20, 1.2, 26], t: 'Resident parking', d: 'Ample parking is a must-have in our Texas markets and supports occupancy.' }
        ]
      },
      townhome: {
        meta: { units: 60, floors: 2, bldg: 10 },
        build(g) {
          g.add(flat(78, 70, padMat, 0, 0));
          const roofCols = ['#5d6461', '#7f8f7a', '#5d6461', '#8f9c9b', '#5d6461'];
          for (let col = 0; col < 2; col++) {
            for (let row = 0; row < 5; row++) {
              const x = col ? 16 : -16, z = -26 + row * 13;
              for (let u = 0; u < 6; u++) {
                const ux = x - 12.5 + u * 5;
                const b = block(5, 8, 2, 'town'); b.position.set(ux, 3.2, z); g.add(b);
                const r = pitched(5, 8, 2.4, roofCols[(u + row) % roofCols.length]); r.position.set(ux, 6.4, z); g.add(r);
              }
            }
          }
          g.add(flat(4, 70, roadMat, 0, 0));
          g.add(cars(0, -30, 22, 'z'));
          [[-34, -20], [-34, 0], [-34, 20], [34, -20], [34, 0], [34, 20], [-6, 34], [6, -34]].forEach(([x, z]) => g.add(tree(x, z, .9)));
        },
        hotspots: [
          { p: [-16, 9, -26], t: 'New roofs & exteriors', d: 'Fresh roofs, paint and siding transform curb appeal and reduce maintenance.' },
          { p: [0, 1.2, 4], t: 'Private drive', d: 'Townhome living with a driveway feel attracts longer-staying families.' },
          { p: [16, 4, 13.4], t: 'Two-story floor plans', d: 'Larger layouts with private entries lease at a premium in Fort Worth.' },
          { p: [-34, 3, 0], t: 'Landscaping', d: 'Mature trees and green space make the community feel established.' }
        ]
      }
    };

    let modelGroup = null, currentKey = 'garden', currentHotspots = [];
    const hotWrap = $('#tourHotspots');
    function loadModel(key) {
      if (modelGroup) {
        scene.remove(modelGroup);
        modelGroup.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
      }
      allFacadeMats.length = 0;
      modelGroup = new T.Group();
      MODELS[key].build(modelGroup);
      scene.add(modelGroup);
      applyNight(night.v);
      currentKey = key;
      currentHotspots = MODELS[key].hotspots;
      hotWrap.innerHTML = currentHotspots.map((h, i) => `<button class="hotspot" type="button" data-hot="${i}" aria-label="${h.t}"><span>${h.t}</span></button>`).join('');
      const m = MODELS[key].meta;
      $('#tmUnits').textContent = m.units; $('#tmFloors').textContent = m.floors; $('#tmBldg').textContent = m.bldg;
      showInfo(0);
      if (hasGSAP && !reduced) {
        modelGroup.scale.set(1, .001, 1);
        gsap.to(modelGroup.scale, { y: 1, duration: 1.4, ease: 'expo.out' });
        cam.radius += 30;
      }
    }
    function showInfo(i) {
      const h = currentHotspots[i];
      $$('.hotspot', hotWrap).forEach((b, k) => b.classList.toggle('is-active', k === i));
      const info = $('#tourInfo');
      const set = () => { $('h3', info).textContent = h.t; $('p', info).textContent = h.d; };
      if (hasGSAP && !reduced) gsap.fromTo(info, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out', onStart: set });
      else set();
    }
    hotWrap.addEventListener('click', (e) => {
      const b = e.target.closest('.hotspot'); if (!b) return;
      const i = Number(b.dataset.hot);
      showInfo(i);
      const p = currentHotspots[i].p;
      tgt.theta = Math.atan2(p[0], p[2] || .001);
      autoRotate = false;
    });

    // Night mode
    const night = { v: 0 };
    const cDay = { ground: new T.Color('#ddd5c6'), pad: new T.Color('#efe9de'), road: new T.Color('#c9bfae'), grass: new T.Color('#b7bf9f') };
    const cNight = { ground: new T.Color('#141b24'), pad: new T.Color('#1d2530'), road: new T.Color('#10151c'), grass: new T.Color('#1e2a24') };
    function applyNight(v) {
      scene.background.copy(DAY_BG).lerp(NIGHT_BG, v);
      scene.fog.color.copy(scene.background);
      groundMat.color.copy(cDay.ground).lerp(cNight.ground, v);
      padMat.color.copy(cDay.pad).lerp(cNight.pad, v);
      roadMat.color.copy(cDay.road).lerp(cNight.road, v);
      grassMat.color.copy(cDay.grass).lerp(cNight.grass, v);
      hemi.intensity = .85 - v * .62;
      hemi.color.set(v > .5 ? '#9fb4d6' : '#fff8ee');
      sun.intensity = 1.05 - v * .9;
      sun.color.set(v > .5 ? '#9db2ff' : '#fff2df');
      moon.intensity = v * 1.6;
      allFacadeMats.forEach((m) => { m.emissiveIntensity = v * 1.15; m.color.setScalar(1 - v * .72); });
      if (modelGroup) modelGroup.traverse((o) => { if (o.userData.water) o.userData.water.material.emissiveIntensity = .25 + v * 1.2; });
    }

    // Camera orbit
    const VIEWS = {
      aerial: { radius: 120, phi: .92, ty: 2 },
      street: { radius: 82, phi: 1.42, ty: 6 },
      courtyard: { radius: 44, phi: 1.12, ty: 2 },
      twilight: { radius: 110, phi: 1.05, ty: 2 }
    };
    const cam = { theta: .7, phi: .92, radius: 150, ty: 2 };
    const tgt = { theta: .7, phi: .92, radius: 120, ty: 2 };
    let autoRotate = true, dragging = false, lastX = 0, lastY = 0, idleTimer;

    function setView(v) {
      const V = VIEWS[v];
      tgt.radius = V.radius; tgt.phi = V.phi; tgt.ty = V.ty;
      const toNight = v === 'twilight' ? 1 : 0;
      if (hasGSAP) gsap.to(night, { v: toNight, duration: 1.6, ease: 'power2.inOut', onUpdate: () => applyNight(night.v) });
      else { night.v = toNight; applyNight(toNight); }
    }

    stage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.hotspot')) return;
      dragging = true; autoRotate = false; lastX = e.clientX; lastY = e.clientY;
      $('#tourHint').classList.add('is-hidden');
      stage.setPointerCapture && stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      tgt.theta -= dx * .008;
      if (e.pointerType === 'mouse') tgt.phi = Math.min(1.45, Math.max(.45, tgt.phi - dy * .004));
    });
    const endDrag = () => {
      dragging = false;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { autoRotate = true; }, 4000);
    };
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('wheel', (e) => {
      if (!e.ctrlKey && !e.metaKey) return; // keep page scroll natural; pinch/ctrl+wheel zooms
      e.preventDefault();
      tgt.radius = Math.min(170, Math.max(36, tgt.radius + e.deltaY * .1));
    }, { passive: false });

    $$('.tprop').forEach((b) => b.addEventListener('click', () => {
      $$('.tprop').forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-checked', x === b); });
      loadModel(b.dataset.model);
    }));
    $$('.tview').forEach((b) => b.addEventListener('click', () => {
      $$('.tview').forEach((x) => x.classList.toggle('is-active', x === b));
      setView(b.dataset.view);
    }));

    function resize() {
      const r = stage.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.fov = r.width < 600 ? 48 : 36;
      camera.updateProjectionMatrix();
    }
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resize).observe(stage);
    else window.addEventListener('resize', resize);
    resize();

    const v3 = new T.Vector3(), camDir = new T.Vector3();
    const degEl = $('#tourDeg'), needle = $('.compass .needle');
    let visible = false;
    function frame() {
      if (!visible) return;
      requestAnimationFrame(frame);
      if (autoRotate && !reduced) tgt.theta += .0018;
      const k = .07;
      cam.theta += (tgt.theta - cam.theta) * k;
      cam.phi += (tgt.phi - cam.phi) * k;
      cam.radius += (tgt.radius - cam.radius) * .05;
      cam.ty += (tgt.ty - cam.ty) * k;
      camera.position.set(
        cam.radius * Math.sin(cam.phi) * Math.sin(cam.theta),
        cam.radius * Math.cos(cam.phi) + cam.ty,
        cam.radius * Math.sin(cam.phi) * Math.cos(cam.theta)
      );
      camera.lookAt(0, cam.ty, 0);
      renderer.render(scene, camera);

      const deg = ((cam.theta * 180 / Math.PI) % 360 + 360) % 360;
      degEl.textContent = Math.round(deg);
      needle.style.transform = `rotate(${-deg}deg)`;

      // project hotspots
      const w = canvas.clientWidth, h = canvas.clientHeight;
      camDir.set(camera.position.x, 0, camera.position.z).normalize();
      $$('.hotspot', hotWrap).forEach((el, i) => {
        const p = currentHotspots[i].p;
        v3.set(p[0], p[1], p[2]);
        const facing = new T.Vector3(p[0], 0, p[2]).normalize().dot(camDir);
        v3.project(camera);
        el.style.transform = `translate(${(v3.x * .5 + .5) * w}px, ${(-v3.y * .5 + .5) * h}px)`;
        el.classList.toggle('is-behind', facing < -.35 && Math.hypot(p[0], p[2]) > 8);
      });
    }

    loadModel('garden');
    stage.classList.add('is-ready');
    const io = new IntersectionObserver((ents) => {
      const was = visible;
      visible = ents[0].isIntersecting && !document.hidden;
      if (visible && !was) frame();
    }, { rootMargin: '100px' });
    io.observe(stage);
    document.addEventListener('visibilitychange', () => {
      const was = visible;
      visible = !document.hidden && stage.getBoundingClientRect().top < window.innerHeight && stage.getBoundingClientRect().bottom > 0;
      if (visible && !was) frame();
    });
  }
})();
