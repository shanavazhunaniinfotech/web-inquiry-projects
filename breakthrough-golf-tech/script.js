(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;

  // Duplicate review cards for a seamless loop
  const rvt = $('.rv-track'); if (rvt) rvt.innerHTML += rvt.innerHTML.replace(/<blockquote/g, '<blockquote aria-hidden="true"');

  // Intro
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add('is-loaded'), 80));

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  // Counters
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count;
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; o.disconnect();
      const t0 = performance.now();
      const tick = (t) => { const p = Math.min((t - t0) / 1200, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    o.observe(el);
  });

  // Header, progress, parallax, tech scroll
  const header = $('.header');
  const bar = $('.progress span');
  const parallax = $$('[data-speed]');
  const storyImg = $('.parallax-img');
  const tech = $('.tech');
  const steps = $$('.step');
  const steelHead = $('.face--steel .face__head'), steelLine = $('.face--steel .startline');
  const bgtHead = $('.face--bgt .face__head'), bgtLine = $('.face--bgt .startline');
  const degs = $$('.deg');
  const meter = $('.tech__meter span');

  const onScroll = () => {
    const y = scrollY, vh = innerHeight;
    header.classList.toggle('is-scrolled', y > 20);
    const max = document.documentElement.scrollHeight - vh;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    if (!reduce) {
      parallax.forEach((el) => { el.style.transform = `translate3d(0, ${y * parseFloat(el.dataset.speed)}px, 0)`; });
      if (storyImg) {
        const r = storyImg.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh) storyImg.style.transform = `translateY(${((r.top + r.height / 2 - vh / 2) / vh) * -60 - 30}px)`;
      }
    }

    // Tech: progress 0..1 through the section
    const r = tech.getBoundingClientRect();
    const p = Math.min(Math.max((vh * 0.6 - r.top) / (r.height - vh * 0.6), 0), 1);
    const wobble = Math.sin(p * Math.PI); // stroke in then back toward impact
    const s = 4.2 * Math.min(p * 1.6, 1) * (0.55 + 0.45 * wobble);
    const b = 0.9 * Math.min(p * 1.6, 1) * (0.55 + 0.45 * wobble);
    steelHead.style.transform = `rotate(${s * 2.2}deg)`; steelLine.style.transform = `rotate(${s * 2.2}deg)`;
    bgtHead.style.transform = `rotate(${b * 2.2}deg)`; bgtLine.style.transform = `rotate(${b * 2.2}deg)`;
    degs[0].textContent = s.toFixed(1) + '°'; degs[1].textContent = b.toFixed(1) + '°';
    meter.style.setProperty('--p', p.toFixed(3));
    steps.forEach((st) => { const sr = st.getBoundingClientRect(); st.classList.toggle('is-active', sr.top < vh * 0.65 && sr.bottom > vh * 0.3); });
  };
  let ticking = false;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // Menu
  const burger = $('.burger'), drawer = $('.drawer');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); drawer.classList.toggle('open', open); drawer.setAttribute('aria-hidden', !open);
  });
  $$('.drawer a').forEach((a) => a.addEventListener('click', () => burger.click()));
  const mega = $('.has-mega'), megaBtn = $('.has-mega > button');
  megaBtn.addEventListener('click', () => { const o = mega.classList.toggle('open'); megaBtn.setAttribute('aria-expanded', o); });
  document.addEventListener('click', (e) => { if (!mega.contains(e.target)) { mega.classList.remove('open'); megaBtn.setAttribute('aria-expanded', false); } });

  // Hover interactions (desktop only)
  if (fine && !reduce) {
    $$('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => { const r = btn.getBoundingClientRect(); btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`; });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
    $$('.tilt').forEach((card) => {
      card.addEventListener('mousemove', (e) => { const r = card.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`; });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
    $$('.pcard__media').forEach((m) => m.addEventListener('mousemove', (e) => { const r = m.getBoundingClientRect(); m.style.setProperty('--mx', `${e.clientX - r.left}px`); m.style.setProperty('--my', `${e.clientY - r.top}px`); }));
  }

  // Cart + toast
  const countEl = $('.cart-count'), toast = $('.toast');
  let count = 0, tt;
  const addToCart = (name, price) => {
    count++; countEl.textContent = count; countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump');
    toast.innerHTML = `<b>✓</b> ${name}${price ? ' · ' + price : ''} added to cart`;
    toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2600);
  };
  $$('[data-add]').forEach((b) => b.addEventListener('click', () => addToCart(b.dataset.add)));

  // Product tabs
  $$('.tab').forEach((t) => t.addEventListener('click', () => {
    $$('.tab').forEach((x) => x.classList.toggle('is-active', x === t));
    const f = t.dataset.filter;
    $$('.pcard').forEach((c) => {
      const show = f === 'all' || c.dataset.cat === f;
      c.classList.toggle('is-hidden', !show);
      if (show) { c.classList.remove('in'); void c.offsetWidth; c.classList.add('in'); }
    });
  }));

  // Configurator
  const form = $('.config__form'), cshaft = $('.cshaft');
  const names = { black: 'Stealth Black', white: 'Polar White', blue: 'Tour Blue', green: 'Fairway Green' };
  const bands = { 'Stability Tour 2': '#1E7A4C', 'Stability Tour 2 Polar': '#7fb6dd', 'Stability Carbon Pro': '#c9a24a' };
  const len = $('#len');
  const fmt = (n) => '$' + n.toFixed(2);
  const update = () => {
    const model = $('input[name=model]:checked', form), finish = $('input[name=finish]:checked', form);
    const tip = $('input[name=tip]:checked', form), svc = $('input[name=svc]:checked', form);
    cshaft.style.setProperty('--c1', finish.dataset.c1); cshaft.style.setProperty('--c2', finish.dataset.c2);
    cshaft.classList.toggle('is-light', finish.value === 'white');
    $('.band', cshaft).style.fill = bands[model.value];
    $('.cshaft__name').textContent = model.value.replace('Stability ', 'STABILITY ').toUpperCase();
    $('#finishName').textContent = names[finish.value];
    const L = parseFloat(len.value);
    $('#lenOut').textContent = L + '"'; $('.cshaft__len').textContent = L + '"';
    len.style.setProperty('--fill', ((L - 32) / 4) * 100 + '%');
    $('.cshaft__body').style.transform = `scaleX(${0.9 + (L - 32) * 0.03})`;
    const chipT = $('#chipTip'), chipS = $('#chipSvc');
    if (chipT.textContent !== tip.value) { chipT.textContent = tip.value; chipT.style.animation = 'none'; void chipT.offsetWidth; chipT.style.animation = ''; }
    const svcTxt = svc.value === 'Shaft only' ? 'Shaft only' : 'Pro install';
    if (chipS.textContent !== svcTxt) { chipS.textContent = svcTxt; chipS.style.animation = 'none'; void chipS.offsetWidth; chipS.style.animation = ''; }
    $('#shipTxt').textContent = svc.value === 'Shaft only' ? 'in 1–2 days' : 'in 3–5 days';
    const total = parseFloat(model.dataset.price) + parseFloat(svc.dataset.price);
    $('#total').textContent = fmt(total); $('#quarter').textContent = fmt(total / 4);
  };
  form.addEventListener('input', update); update();
  $('#addBuild').addEventListener('click', () => addToCart($('input[name=model]:checked', form).value, $('#total').textContent));

  // Shaft finder quiz
  const quiz = $('.quiz'), qbar = $('.quiz__bar span');
  const answers = [];
  const show = (key) => {
    $$('.quiz__step, .quiz__result', quiz).forEach((s) => s.classList.toggle('is-active', s.dataset.q === key));
    qbar.style.setProperty('--p', key === 'r' ? '100%' : (key * 33.3) + '%');
  };
  const recs = {
    perf: { name: 'Stability Carbon Pro', why: 'Our most advanced putter shaft — premium carbon layup for players who want every edge on the green.', style: '--c1:#2b2e2d;--c2:#6b706d;--band:#c9a24a', model: 'Stability Carbon Pro' },
    look: { name: 'Stability Tour 2 Polar', why: 'The same low-torque Tour 2 performance in a clean Polar White finish that frames the ball at address.', style: '--c1:#f7f8f6;--c2:#d4dad6;--band:#7fb6dd', model: 'Stability Tour 2 Polar' },
    value: { name: 'Stability Tour 2', why: 'Lower torque keeps your face square on short putts — the fastest way to save strokes per dollar spent.', style: '--c1:#1b1f1d;--c2:#4a5550;--band:#1E7A4C', model: 'Stability Tour 2' },
    tee: { name: 'FORTA', why: 'Lightweight speed with a stable tip section — built to tighten dispersion without giving up carry.', style: '--c1:#e9ece8;--c2:#b8c2bc;--band:#1E7A4C' },
    teeAgg: { name: 'FORTA TOUR', why: 'A firmer, reinforced profile for high swing speeds that need control at the top end.', style: '--c1:#26302c;--c2:#5d6a63;--band:#c6e04a' }
  };
  $$('.quiz__opts button', quiz).forEach((btn) => btn.addEventListener('click', () => {
    const step = +btn.closest('.quiz__step').dataset.q;
    answers[step - 1] = btn.dataset.v;
    if (step < 3) return show(String(step + 1));
    let r;
    if (answers[0] === 'tee') r = answers[1] === 'aggressive' ? recs.teeAgg : recs.tee;
    else r = recs[answers[2]] || recs.value;
    $('#resName').textContent = answers[0] === 'both' ? r.name + ' + FORTA' : r.name;
    $('#resWhy').textContent = answers[0] === 'both' ? r.why + ' Pair it with FORTA in your driver for stability tee to green.' : r.why;
    $('#resultUse').setAttribute('style', r.style);
    const link = $('#resBuild');
    if (r.model) { link.textContent = 'Build it →'; link.href = '#configurator'; link.onclick = () => { const i = $(`input[name=model][value="${r.model}"]`); if (i) { i.checked = true; update(); } }; }
    else { link.textContent = 'Shop wood shafts →'; link.href = '#products'; link.onclick = () => $('.tab[data-filter="wood"]').click(); }
    show('r');
  }));
  $('#quizRestart').addEventListener('click', () => { answers.length = 0; show('1'); });
})();
