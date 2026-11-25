/* Home District — Version B "Showroom" layer. Shared commerce logic lives in ../script.js */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const aed = n => 'AED ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

  /* ---------- Design notes for Version B (read by ../script.js) ---------- */
  window.HD_NOTES = {
    1: ['Hero: a living showroom', `<p>Instead of one image, the hero is a slow, cinematic <b>showroom of real rooms</b> that changes every 7 seconds, like walking through a gallery. Progress bars show where you are; you can tap to jump.</p><ul><li>The headline uses the logo's own two-tone idea: a grey phrase leading into a black one ("home" grey, "district" black).</li><li>A floating product card always shows the piece in the current room with its price and the 4-payment price. One tap opens it.</li><li>Shop + Book a free home visit, rating and tabby/tamara are all visible immediately.</li></ul><span class="tag">Immersion</span><span class="tag">Shoppable</span>`],
    2: ['Promise cards: remove risk', `<p>Four calm cards answer the biggest fears of buying furniture online, right under the hero: delivery and assembly, paying in 4, a 30-day home trial and a 5-year guarantee.</p>`],
    3: ['Rooms: a bento grid', `<p>A magazine-style bento grid gives Living the biggest tile (the most-shopped room), with the other rooms around it. On mobile it becomes a swipe row. Every tile goes straight to the right products.</p>`],
    4: ['Bestsellers: a swipeable rail', `<p>A horizontal, swipe-and-drag rail feels like browsing a showroom floor. The featured sofa is twice as wide, and every card shows the price and the 4-payment price, colour swatches, rating, a one-tap add and quick view.</p><span class="tag">Social proof</span><span class="tag">BNPL framing</span>`],
    5: ['Why it costs less: one big number', `<p>One huge number (<b>56% less</b>) does the talking, then two side-by-side cards show the maths: a typical showroom against Home District. Same materials cost in both, with no middlemen and free delivery.</p><p><b>Client to confirm:</b> benchmark prices and cost split.</p>`],
    6: ['Shop the room', `<p>A large room photo with tap-to-shop dots and a clean side panel listing every piece, with the whole-room total, a 5% bundle saving and the 4-payment price.</p><span class="tag">AOV</span>`],
    7: ['Considered details: split scroll', `<p>The sofa stays on screen while you scroll through four close-up cards: covers, velvet, frame and foam. The matching dot on the sofa lights up for each one. Then a fabric rail leads to <b>free swatches</b>.</p>`],
    8: ['Tailor-made: a light design studio', `<p>The same live configurator, presented as a bright studio. The drawing changes with shape, width, fabric and legs, with an instant price. You can add it to cart, or talk to a stylist with the design attached.</p>`],
    9: ['Reviews: a living wall', `<p>Two slowly moving rows of real reviews, with photos from customers' homes, show volume and variety at a glance. It pauses when you hover. The summary score sits right next to the title.</p><p><b>Note:</b> sample reviews; connects to Judge.me or Okendo at launch.</p>`],
    10: ['Free home visit: concierge card', `<p>One calm card: a real room with your stylist's face on it, three promises (45 min, 48 hrs, AED 0) and a 3-step booking form (Rooms → Date → Details). WhatsApp is always the alternative.</p><span class="tag">Lead capture</span>`],
    11: ['Story: words and faces', `<p>The founder story is one big, honest sentence, with the studio and the founders' faces placed inside the text. It makes a new brand feel personal and accountable.</p>`],
    12: ['Community', `<p>A gallery grid of customer homes, each linking to shop. Real rooms build trust that studio photos can't.</p>`],
    13: ['FAQ: stop exits', `<p>The six questions that stop a furniture purchase, in easy cards, with a direct WhatsApp button for anything else.</p>`],
    14: ['Launch list', `<p>An early-access list with AED 250 off builds a launch-day audience before January 2027.</p>`]
  };

  /* ---------- Hero slider ---------- */
  const hero = $('[data-bhero]');
  const slides = $$('.bhero__slide', hero), bars = $$('[data-go]', hero);
  const DUR = 7000; let cur = 0, timer;
  hero.style.setProperty('--dur', DUR / 1000 + 's');
  function go(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-on', k === cur));
    bars.forEach((b, k) => { b.setAttribute('aria-selected', k === cur); b.classList.toggle('is-done', k < cur); const i2 = b.querySelector('i'); i2.style.animation = 'none'; void i2.offsetWidth; i2.style.animation = ''; });
    const s = slides[cur].dataset, price = +s.pprice;
    const card = $('[data-hero-card]');
    const set = () => { $('[data-hc-img]').src = s.pimg; $('[data-hc-name]').textContent = s.pname; $('[data-hc-price]').textContent = `${aed(price)} · or 4 × ${aed(Math.round(price / 4 * 100) / 100)}`; card.dataset.pid = s.pid; };
    if (window.gsap && !reduce) gsap.to(card, { opacity: 0, y: 8, duration: .25, onComplete: () => { set(); gsap.to(card, { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }); } }); else set();
    clearTimeout(timer); if (!reduce) timer = setTimeout(() => go(cur + 1), DUR);
  }
  bars.forEach(b => b.addEventListener('click', () => go(+b.dataset.go)));
  $('[data-hero-card]').addEventListener('click', e => { const id = e.currentTarget.dataset.pid || 'mara-sofa'; window.HD_quickView && window.HD_quickView(id); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else go(cur); });

  /* ---------- Bestseller rail ---------- */
  function railInit() {
    const rail = $('[data-products]'), bar = $('[data-rail-progress]');
    const upd = () => { const max = rail.scrollWidth - rail.clientWidth; const w = rail.clientWidth / rail.scrollWidth; bar.style.width = (w * 100) + '%'; bar.style.transform = `translateX(${max > 0 ? (rail.scrollLeft / max) * (1 / w - 1) * 100 : 0}%)`; };
    rail.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
    new MutationObserver(() => { rail.scrollLeft = 0; upd(); }).observe(rail, { childList: true });
    $$('[data-rail-go]').forEach(b => b.addEventListener('click', () => rail.scrollBy({ left: +b.dataset.railGo * rail.clientWidth * .7, behavior: 'smooth' })));
    // drag to scroll (desktop)
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; rail.style.scrollSnapType = 'none'; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; rail.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { if (!down) return; down = false; rail.style.scrollSnapType = ''; });
    rail.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  }

  /* ---------- Details split ---------- */
  function detailsInit() {
    const feats = $$('[data-feat]'), pins = $$('[data-pin]');
    const set = i => { feats.forEach((f, k) => f.classList.toggle('is-on', k === i)); pins.forEach((p, k) => p.classList.toggle('is-on', k === i)); };
    feats.forEach((f, i) => { f.addEventListener('mouseenter', () => set(i)); f.addEventListener('click', () => set(i)); });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) set(+en.target.dataset.feat); }), { rootMargin: '-45% 0px -45% 0px' });
      feats.forEach(f => io.observe(f));
    }
    set(0);
  }

  /* ---------- Reviews wall ---------- */
  function wallInit() {
    const R = (window.HD_REVIEWS || []).map(r => ({ q: r.q, n: r.n, m: r.m, img: r.img, face: r.face }));
    const base = document.documentElement.dataset.base || '';
    const extra = [
      { q: 'Made it up 14 floors without a scratch. The team took the legs off and had it in place in minutes.', n: 'Ahmed S.', m: 'Dubai Marina · Coast sofa', face: base + 'images/face-4.jpg' },
      { q: 'Beautiful, and a little firm at first. Two weeks later it is the perfect seat. Colour exactly as photographed.', n: 'Priya M.', m: 'JLT · Coast sofa', face: base + 'images/face-1.jpg' },
      { q: 'Compared it with a sofa three times the price. Same oak frame, nicer fabric. Easy decision.', n: 'Karim H.', m: 'Arabian Ranches · Coast sofa', img: base + 'images/pd-tan.jpg', face: base + 'images/face-2.jpg' },
      { q: 'The swatches arrived in two days and helped us pick the right colour for our light. Lovely service.', n: 'Noura A.', m: 'Abu Dhabi · Nook chair', face: base + 'images/face-3.jpg' }
    ];
    const all = [...R, ...extra];
    const card = (r, withImg) => `<article class="brev${withImg && r.img ? ' brev--img' : ''}">${withImg && r.img ? `<img src="${r.img}" alt="" loading="lazy">` : ''}<span class="stars">${'<svg><use href="#i-star"/></svg>'.repeat(5)}</span><q>${r.q}</q><footer><img src="${r.face}" alt="" loading="lazy"><span><b>${r.n}</b> · ${r.m}</span></footer></article>`;
    const row1 = all.filter((_, i) => i % 2 === 0), row2 = all.filter((_, i) => i % 2 === 1);
    $('[data-bwall]').innerHTML = `<div class="bwall__row">${(row1.map(r => card(r, true)).join('')).repeat(2)}</div><div class="bwall__row bwall__row--rev">${(row2.map(r => card(r, true)).join('')).repeat(2)}</div>`;
  }

  /* ---------- Motion (called by ../script.js once GSAP is ready) ---------- */
  window.HD_onMotion = (mm) => {
    if (!mm || !window.gsap) return;
    const title = $('.bhero__title');
    gsap.from([title, '.bhero__kicker', '.bhero__row', '.bhero__foot'], { opacity: 0, y: 40, duration: 1.4, ease: 'expo.out', stagger: .12, delay: .15 });
    gsap.from('[data-hero-card]', { opacity: 0, x: 30, duration: 1.2, ease: 'expo.out', delay: .7 });
    gsap.to('.bhero__slides', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.bhero', start: 'top top', end: 'bottom top', scrub: true } });
    const up = (sel, opt = {}) => $$(sel).forEach(el => gsap.from(el, { opacity: 0, y: 36, duration: 1.1, ease: 'expo.out', ...opt, scrollTrigger: { trigger: el, start: 'top 90%' } }));
    up('.bhead'); up('.bstory__text'); up('.bvisit__card'); up('.blaunch__card'); up('.btailor__card'); up('.bfabrics'); up('.bstory__row'); up('.blook__grid');
    gsap.from('.bpromise__grid li', { opacity: 0, y: 24, duration: 1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.bpromise', start: 'top 92%' } });
    gsap.from('.bento__tile', { opacity: 0, y: 40, scale: .98, duration: 1.2, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.bento', start: 'top 85%' } });
    gsap.from('.pcmp', { opacity: 0, y: 60, duration: 1.3, stagger: .15, ease: 'expo.out', scrollTrigger: { trigger: '.bvalue__cards', start: 'top 85%' } });
    gsap.from('.bugc__i', { opacity: 0, y: 30, duration: 1, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: '.bugc__grid', start: 'top 88%' } });
    gsap.from('.bfaq__grid details', { opacity: 0, y: 20, duration: .9, stagger: .05, ease: 'expo.out', scrollTrigger: { trigger: '.bfaq__grid', start: 'top 88%' } });
    $$('.pcmp__bar i').forEach(i => gsap.from(i, { scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: i, start: 'top 90%' } }));
    gsap.fromTo('.bsplit__frame img', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.bsplit', start: 'top bottom', end: 'bottom top', scrub: true } });
  };

  document.addEventListener('DOMContentLoaded', () => { go(0); railInit(); detailsInit(); wallInit(); });
})();
