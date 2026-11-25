/* Home District — Version B product page layer: single-image viewer with thumbnails. Commerce logic: ../../product/product.js */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  window.HD_NOTES = {
    1: ['Buy box: a calm card', `<p>One large image at a time, with thumbnails, keeps the focus on the piece. Everything needed to decide sits in a soft, rounded card that stays in view: price and showroom anchor, tabby/tamara, fabric, size and legs (with live price), a delivery date for your Emirate, Add to cart and Buy now, guarantees and a stylist on WhatsApp.</p><span class="tag">Clarity</span><span class="tag">Trust</span>`],
    2: ['Highlights: bento cards', `<p>Three key benefits as big-number cards; the first is black so the eye lands on it first.</p>`],
    3: ['Will it fit?', `<p>A to-scale drawing that changes with the chosen size, and a doorway checker that gives an instant answer. This removes the number-one reason people don't buy a sofa online.</p><span class="tag">Objection handling</span>`],
    4: ['Details as cards', `<p>Overview, materials, dimensions, care, delivery and guarantee, in calm, easy-to-tap cards.</p>`],
    5: ['Complete the look: an equation', `<p>Items are joined with "+" signs and lead to a black total card, so the bundle reads at a glance. Two or more pieces save 5%, with the 4-payment total shown.</p><span class="tag">AOV</span>`],
    6: ['Reviews', `<p>A wide summary card (score, star breakdown, "would recommend", firmness and colour accuracy) followed by review cards with photos and filters.</p>`],
    7: ['Questions', `<p>The questions that stop a purchase, answered on the page, with WhatsApp right beside them.</p>`],
    8: ['Related + sticky bar', `<p>Related pieces to keep browsing, and a floating add-to-cart bar once the buy card scrolls away. One template powers every product page.</p>`]
  };

  let thumbsBuilt = false;
  function buildThumbs() {
    const track = $('[data-gallery-track]'), box = $('[data-bthumbs]');
    if (!track || !box) return;
    const imgs = $$('.gallery__item img', track);
    box.innerHTML = imgs.map((im, i) => `<button type="button" aria-label="Show image ${i + 1}" data-th="${i}" class="${i ? '' : 'is-on'}"><img src="${im.getAttribute('src')}" alt=""></button>`).join('');
    if (!thumbsBuilt) {
      thumbsBuilt = true;
      box.addEventListener('click', e => { const b = e.target.closest('[data-th]'); if (b) goTo(+b.dataset.th); });
      track.addEventListener('scroll', () => { const i = Math.round(track.scrollLeft / track.clientWidth); $$('[data-th]').forEach((b, k) => b.classList.toggle('is-on', k === i)); }, { passive: true });
      $$('[data-bgal]').forEach(b => b.addEventListener('click', () => { const n = $$('.gallery__item', track).length; const i = Math.round(track.scrollLeft / track.clientWidth); goTo((i + +b.dataset.bgal + n) % n); }));
    }
  }
  function goTo(i) { const track = $('[data-gallery-track]'); track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' }); }
  document.addEventListener('hd:gallery', buildThumbs);
})();
