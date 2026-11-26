/* Home District — Version C "Quiet luxury" layer. Shared commerce logic lives in ../script.js */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.HD_NOTES = {
    1: ['Hero: one message, one action', `<p>After our call: a calmer opening. A slow slideshow of real rooms, the promise in one line ("The designer look, at a fair price") and <b>one button</b>, Shop the collection, placed low so the room photograph leads.</p><p>The home-visit button has moved further down the page, where it fits the story better.</p>`],
    2: ['Start with the room', `<p>The story begins where customers begin: the room they're furnishing. Large photographs with just the room name, no extra labels.</p>`],
    3: ['Most loved', `<p>Quiet product cards: photo, name, colour and price. Tapping a colour dot changes the photo instantly, and the product page opens in that same colour.</p>`],
    4: ['Our promise, after the products', `<p>As discussed, the four promises (delivery, pay in 4, home trial, guarantee) now come <b>after</b> the products, as part of the story rather than competing with the hero.</p>`],
    5: ['Why it costs less', `<p>One image, one sentence and one simple comparison: AED 9,800 against AED 4,290. The full breakdown is one tap away in "See how we price".</p>`],
    6: ['Shop the room', `<p>Tap a dot to see each piece, or add the whole room with a small saving.</p>`],
    7: ['Considered details', `<p>The sofa stays in view while four short lines explain what's inside. The matching dot lights up for each one.</p>`],
    8: ['Tailor-made', `<p>Pick a design, width and fabric. The sofa drawing changes colour and size live, and the price updates instantly.</p>`],
    9: ['Reviews', `<p>One review at a time, with a photo from the customer's home. Calm and personal, not a wall of text.</p>`],
    10: ['Our story', `<p>One honest sentence with the founders' faces inside it, showing the real people behind the brand.</p>`],
    11: ['Free home visit', `<p>A calm invitation with one button. The booking form opens in a side panel only when someone wants it, so the page stays clean.</p>`],
    12: ['FAQ', `<p>Four key questions, answered simply.</p>`],
    13: ['Launch list', `<p>One field, one button: early access for January 2027.</p>`]
  };

  /* Hero slider */
  const hero = $('[data-bhero]');
  const slides = $$('.bhero__slide', hero), bars = $$('[data-go]', hero);
  const DUR = 7000; let cur = 0, timer;
  hero.style.setProperty('--dur', DUR / 1000 + 's');
  function go(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-on', k === cur));
    bars.forEach((b, k) => { b.setAttribute('aria-selected', k === cur); b.classList.toggle('is-done', k < cur); const i2 = b.querySelector('i'); i2.style.animation = 'none'; void i2.offsetWidth; i2.style.animation = ''; });
    clearTimeout(timer); if (!reduce) timer = setTimeout(() => go(cur + 1), DUR);
  }
  bars.forEach(b => b.addEventListener('click', () => go(+b.dataset.go)));
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else go(cur); });

  /* Details */
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

  /* Motion */
  window.HD_onMotion = (mm) => {
    if (!mm || !window.gsap) return;
    gsap.from(['.chero__title', '.chero__bottom', '.chero__bars'], { opacity: 0, y: 40, duration: 1.5, ease: 'expo.out', stagger: .12, delay: .15 });
    gsap.to('.bhero__slides', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.bhero', start: 'top top', end: 'bottom top', scrub: true } });
    const up = (sel) => $$(sel).forEach(el => gsap.from(el, { opacity: 0, y: 36, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));
    up('.chead'); up('.bento'); up('.cpromise__list'); up('.cvalue__body'); up('.cvalue__img'); up('.blook__grid'); up('.btailor__card'); up('.cquote'); up('.bstory__text'); up('.cvisit__card'); up('.cfaq__grid'); up('.claunch__inner');
    gsap.fromTo('.bsplit__frame img', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.bsplit', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.cvalue__img img', { scale: 1.1 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.cvalue', start: 'top bottom', end: 'bottom top', scrub: true } });
  };

  document.addEventListener('DOMContentLoaded', () => { go(0); detailsInit(); });
})();
