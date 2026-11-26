/* Chase Group Ltd. — home page concept interactions */
(() => {
  const d = document, root = d.documentElement, body = d.body;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (reduced || !hasGsap) root.classList.add('reduced');

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduced && hasGsap && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  const goTo = (target) => {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    const off = -(window.innerWidth < 900 ? 60 : 66);
    if (lenis) lenis.scrollTo(el, { offset: el.id === 'top' ? 0 : off, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + off, behavior: reduced ? 'auto' : 'smooth' });
  };
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = $(id); if (!el) return;
    e.preventDefault(); closeMenu(); goTo(el);
  }));

  /* ---------- menu ---------- */
  const burger = $('.burger'), menu = $('#menu');
  function closeMenu() { body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-hidden', 'true'); lenis && lenis.start(); }
  burger.addEventListener('click', () => {
    const open = !body.classList.contains('menu-open');
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    if (lenis) open ? lenis.stop() : lenis.start();
  });
  d.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- nav state ---------- */
  const nav = $('#nav'), mbar = $('.mbar');
  const darkEls = $$('.hero, .clients, .results, .contact, .foot');
  let lastY = 0;
  const navState = () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 30);
    const probe = 40;
    const onDark = darkEls.some(el => { const r = el.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
    nav.classList.toggle('is-light', y > 30 && !onDark);
    if (!body.classList.contains('menu-open')) nav.classList.toggle('is-hidden', y > lastY + 4 && y > innerHeight * 1.2);
    if (y < lastY - 4) nav.classList.remove('is-hidden');
    lastY = y;
    const contact = $('#contact').getBoundingClientRect();
    mbar.classList.toggle('is-on', y > innerHeight * .8 && contact.top > innerHeight * .6);
    // active link
    $$('.nav__links a').forEach(a => {
      const s = $(a.getAttribute('href')); if (!s) return;
      const r = s.getBoundingClientRect();
      a.classList.toggle('is-active', r.top < innerHeight * .4 && r.bottom > innerHeight * .4);
    });
  };
  addEventListener('scroll', navState, { passive: true }); navState();

  /* ---------- counters ---------- */
  const fmt = (v, dec) => dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
  const countUp = (el, dur = 1.8) => {
    if (el.dataset.done) return; el.dataset.done = 1;
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
    if (reduced || !hasGsap) { el.textContent = fmt(end, dec) + suf; return; }
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: dur, ease: 'power3.out', onUpdate: () => el.textContent = fmt(o.v, dec) + suf });
  };

  /* ---------- ECG canvas ---------- */
  const cv = $('#ecg');
  if (cv) {
    const ctx = cv.getContext('2d');
    let w, h, dpr, pts = [], head = 0;
    const beat = (t) => { // one heartbeat shape across t∈[0,1]
      if (t < .30) return 0;
      if (t < .34) return -.10 * Math.sin((t - .30) / .04 * Math.PI);
      if (t < .40) return 0;
      if (t < .42) return .18;
      if (t < .45) return -1;
      if (t < .48) return .55;
      if (t < .50) return 0;
      if (t < .62) return -.22 * Math.sin((t - .50) / .12 * Math.PI);
      return 0;
    };
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = new Array(Math.ceil(w)).fill(0);
    };
    resize(); addEventListener('resize', resize);
    const period = () => Math.max(260, w / 3.2);
    let phase = 0, visible = true;
    new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(cv);
    const draw = () => {
      if (visible) {
        const speed = reduced ? 0 : 3.2;
        for (let i = 0; i < speed; i++) {
          phase += 1;
          pts[head] = beat((phase % period()) / period());
          head = (head + 1) % pts.length;
        }
        ctx.clearRect(0, 0, w, h);
        const mid = h * .55, amp = h * .42;
        // trailing gradient line
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        ctx.lineWidth = 1.6; ctx.lineJoin = 'round';
        ctx.beginPath();
        for (let x = 0; x < pts.length; x++) {
          const idx = (head + x) % pts.length;
          const y = mid + pts[idx] * amp;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        grad.addColorStop(0, 'rgba(92,225,230,0)');
        grad.addColorStop(.6, 'rgba(92,225,230,.35)');
        grad.addColorStop(1, 'rgba(92,225,230,1)');
        ctx.strokeStyle = grad; ctx.shadowColor = 'rgba(92,225,230,.8)'; ctx.shadowBlur = 10;
        ctx.stroke(); ctx.shadowBlur = 0;
        // head dot
        const hy = mid + pts[(head - 1 + pts.length) % pts.length] * amp;
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(w - 2, hy, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(92,225,230,.25)'; ctx.beginPath(); ctx.arc(w - 2, hy, 9, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    // pre-fill so the line is visible immediately
    for (let i = 0; i < pts.length; i++) { phase++; pts[head] = beat((phase % period()) / period()); head = (head + 1) % pts.length; }
    draw();
  }

  /* ---------- statement word split ---------- */
  const st = $('[data-words]');
  if (st) {
    st.innerHTML = st.textContent.trim().split(/\s+/).map(t => `<span class="w">${t}</span>`).join(' ');
  }
  /* testimonial word split */
  $$('.voice blockquote').forEach(bq => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(p)); return; }
            const s = d.createElement('span'); s.className = 'vw'; s.textContent = p; s.style.transitionDelay = (i++ * 0.045) + 's'; frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else walk(n);
      });
    };
    walk(bq);
  });

  /* ---------- testimonials ---------- */
  const voices = $$('.voice'), dots = $$('.vdot');
  let vi = 0, vt;
  const showVoice = (n) => {
    vi = (n + voices.length) % voices.length;
    voices.forEach((v, i) => v.classList.toggle('is-active', i === vi));
    dots.forEach((b, i) => { b.classList.remove('is-active'); void b.offsetWidth; b.classList.toggle('is-active', i === vi); });
    clearTimeout(vt); vt = setTimeout(() => showVoice(vi + 1), 7000);
  };
  dots.forEach((b, i) => b.addEventListener('click', () => showVoice(i)));
  if (voices.length) showVoice(0);

  /* ---------- contact form (opens email to Chase Group) ---------- */
  const form = $('#contactForm'), fmsg = $('#formMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    ['fName', 'fEmail', 'fMsg'].forEach(id => {
      const el = $('#' + id); const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
      el.parentElement.classList.toggle('is-err', bad); if (bad) ok = false;
    });
    if (!ok) { fmsg.textContent = 'Please complete your name, a valid email and a message.'; return; }
    const sub = encodeURIComponent('Introduction request — ' + $('#fName').value.trim());
    const bodyTxt = encodeURIComponent(`${$('#fMsg').value.trim()}\n\n${$('#fName').value.trim()}\n${$('#fEmail').value.trim()}\n${$('#fPhone').value.trim()}`);
    location.href = `mailto:robert@ChaseGroupLtd.com?subject=${sub}&body=${bodyTxt}`;
    fmsg.textContent = 'Thank you — your email app is opening with your message ready to send.';
    form.reset();
  });

  /* ---------- custom cursor + magnetic ---------- */
  if (fine && !reduced) {
    const cur = $('.cursor');
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; cur.classList.add('is-on'); });
    d.addEventListener('mouseleave', () => cur.classList.remove('is-on'));
    (function loop() { cx += (tx - cx) * .2; cy += (ty - cy) * .2; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
    $$('a, button, .case, .tile').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('is-big'));
      el.addEventListener('mouseleave', () => cur.classList.remove('is-big'));
    });
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
    // monitor tilt
    const mon = $('.monitor');
    $('.hero').addEventListener('mousemove', e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      mon.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      const mk = $('.hero__mark'); mk.style.translate = `${x * -30}px ${y * -30}px`;
    });
  }

  /* ---------- no-animation fallback ---------- */
  const loader = $('.loader');
  const finishStatic = () => {
    loader && loader.remove(); body.classList.remove('is-loading');
    $$('[data-count]').forEach(el => countUp(el, 0));
    $$('.statement__text .w').forEach(w => w.classList.add('is-on'));
    $$('.cycle__fill--before').forEach(f => f.style.width = '100%');
    $$('.cycle__fill--after').forEach(f => f.style.width = '9%');
    $('.tile--roi')?.classList.add('is-in');
    approachObserve();
  };

  function approachObserve() {
    const aps = $$('.ap'), cls = $$('.cl'), lbls = $$('.cross__lbl'), num = $('#apNum');
    const set = (i) => {
      aps.forEach((a, k) => a.classList.toggle('is-on', k === i));
      cls.forEach(c => { const k = +c.dataset.i; c.classList.toggle('is-on', k === i); c.classList.toggle('is-done', k < i); if (k === i) c.parentNode.appendChild(c); });
      lbls.forEach(l => l.classList.toggle('is-on', +l.dataset.i === i));
      num.textContent = String(i + 1).padStart(2, '0');
    };
    set(0);
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) set(+e.target.dataset.i); }), { rootMargin: '-45% 0px -45% 0px' });
    aps.forEach(a => io.observe(a));
  }

  if (reduced || !hasGsap) { finishStatic(); return; }

  /* ================= GSAP ================= */
  // reveals
  const rvTargets = $$('.kicker, .h2, .muted, .results__head + .dash .tile, .counter, .post, .about__lede, .timeline li, .about__actions, .contact__title, .contact__copy > p, .contact__copy > .btn, .contact__list, .form, .insights__head .link, .clients__label');
  rvTargets.forEach(el => el.classList.add('rv'));

  ScrollTrigger.batch('.rv', {
    start: 'top 88%',
    onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .08, overwrite: true }),
  });

  // loader → hero intro
  const intro = gsap.timeline({ paused: true });
  intro
    .from('.hero__title .ln > span', { yPercent: 115, rotate: 4, duration: 1.3, ease: 'expo.out', stagger: .1 })
    .from('.hero .eyebrow', { y: 20, opacity: 0, duration: .9, ease: 'expo.out' }, '-=1.1')
    .from('.hero__lede, .hero__actions', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1 }, '-=.9')
    .from('.monitor', { y: 60, opacity: 0, rotateX: 14, duration: 1.4, ease: 'expo.out', onComplete: () => $$('.monitor [data-count]').forEach(el => countUp(el)) }, '-=1')
    .from('.monitor__row', { x: 20, opacity: 0, stagger: .1, duration: .8, ease: 'expo.out' }, '-=1')
    .fromTo('.spark-line', { strokeDasharray: 600, strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', clearProps: 'strokeDasharray,strokeDashoffset' }, '-=.9')
    .from('.spark-area', { opacity: 0, duration: 1 }, '-=1')
    .from('.hero__mark', { scale: .6, rotate: -90, opacity: 0, duration: 2, ease: 'expo.out' }, 0)
    .from('.hero__ecg', { opacity: 0, duration: 1.2 }, .3)
    .from('.hero__strip > *', { y: 14, opacity: 0, stagger: .05, duration: .8, ease: 'expo.out' }, '-=1.2')
    .from('.nav > *', { y: -20, opacity: 0, stagger: .08, duration: .9, ease: 'expo.out' }, 0);

  if (loader) {
    const c = { v: 0 }, cnt = $('.loader__count');
    const lt = gsap.timeline({ onComplete: () => { body.classList.remove('is-loading'); loader.remove(); } });
    lt.set('.loader__mark', { rotate: -45 })
      .from('.ld-t', { y: -70, opacity: 0, duration: .9, ease: 'expo.out' }, 0)
      .from('.ld-b', { y: 70, opacity: 0, duration: .9, ease: 'expo.out' }, .08)
      .from('.ld-l', { x: -70, opacity: 0, duration: .9, ease: 'expo.out' }, .16)
      .from('.ld-r', { x: 70, opacity: 0, duration: .9, ease: 'expo.out' }, .24)
      .to('.loader__mark', { rotate: 0, duration: 1.4, ease: 'expo.inOut' }, 0)
      .to('.loader__ecg path', { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, .1)
      .to(c, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => cnt.textContent = String(Math.round(c.v)).padStart(2, '0') }, 0)
      .to('.loader__mark', { scale: 14, opacity: 0, duration: 1, ease: 'expo.in' }, 1.6)
      .to('.loader__meta, .loader__ecg', { opacity: 0, duration: .4 }, 1.6)
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, 2.15)
      .add(() => intro.play(), 2.35);
  } else intro.play();

  // hero parallax out
  gsap.to('.hero__inner', { yPercent: 14, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__glow--a', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // statement scrub
  const words = $$('.statement__text .w');
  ScrollTrigger.create({
    trigger: '.statement__text', start: 'top 80%', end: 'bottom 45%', scrub: true,
    onUpdate: s => { const n = Math.round(s.progress * words.length); words.forEach((w, i) => w.classList.toggle('is-on', i < n)); }
  });

  // approach
  approachObserve();
  gsap.from('.cross svg', { rotate: -90, scale: .7, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.approach', start: 'top 75%' } });

  // results dashboard
  ScrollTrigger.create({
    trigger: '.dash', start: 'top 78%', once: true,
    onEnter: () => {
      gsap.fromTo('.cycle__fill--before', { width: 0 }, { width: '100%', duration: 1.6, ease: 'expo.out' });
      gsap.fromTo('.cycle__fill--after', { width: '100%' }, { width: '9%', duration: 2.2, delay: .6, ease: 'expo.inOut' });
      const p = $('.drop path'), len = p.getTotalLength();
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' });
      gsap.from('.drop circle', { scale: 0, transformOrigin: 'center', duration: .6, delay: 1.6, ease: 'back.out(3)' });
      gsap.from('.bars__col i', { scaleY: 0, duration: 1.4, ease: 'expo.out', stagger: .2, delay: .3 });
      $$('.dash [data-count]').forEach(el => countUp(el));
      $('.tile--roi').classList.add('is-in');
    }
  });
  ScrollTrigger.create({ trigger: '.counters', start: 'top 85%', once: true, onEnter: () => $$('.counters [data-count]').forEach(el => countUp(el, 2.2)) });

  // work horizontal
  const track = $('#workTrack'), bar = $('#workBar'), vp = $('.work__viewport');
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const dist = () => Math.max(0, track.scrollWidth - vp.clientWidth + parseFloat(getComputedStyle(vp).paddingLeft));
    const tw = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.work__pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .8, invalidateOnRefresh: true,
        onUpdate: s => bar.style.width = (s.progress * 100) + '%'
      }
    });
    return () => { gsap.set(track, { x: 0 }); };
  });
  mm.add('(max-width: 900px)', () => {
    const upd = () => { const m = vp.scrollWidth - vp.clientWidth; bar.style.width = (m ? vp.scrollLeft / m * 100 : 0) + '%'; };
    vp.addEventListener('scroll', upd, { passive: true }); upd();
    return () => vp.removeEventListener('scroll', upd);
  });

  gsap.from('.case', { y: 70, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .08, clearProps: 'transform,opacity', scrollTrigger: { trigger: '.work__track', start: 'top 85%' } });

  // about
  gsap.fromTo('.about__frame', { clipPath: 'inset(18% 12% 18% 12% round 30px)' }, { clipPath: 'inset(0% 0% 0% 0% round 30px)', ease: 'expo.out', duration: 1.6, scrollTrigger: { trigger: '.about__photo', start: 'top 80%' } });
  gsap.to('.about__frame img', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.chip', { scale: .6, opacity: 0, duration: 1, ease: 'back.out(2)', stagger: .15, scrollTrigger: { trigger: '.about__photo', start: 'top 65%' } });
  $$('.chip').forEach((c, i) => gsap.to(c, { y: i % 2 ? 10 : -10, duration: 2.6 + i * .4, yoyo: true, repeat: -1, ease: 'sine.inOut' }));

  // contact + footer
  gsap.from('.contact__mark', { rotate: -120, scale: .6, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.foot__word', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.foot', start: 'top 85%' } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
