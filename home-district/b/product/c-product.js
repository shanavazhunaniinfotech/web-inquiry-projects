/* Home District — Version C product page layer: calm notes, colour preview on hover, smooth colour change. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  window.HD_NOTES = {
    1: ['A quieter buy box', `<p>After our call, the buy box keeps only what helps people decide: name, price (with the 4-payment option as one quiet line), colour, size and <b>one Add to cart button</b>.</p><ul><li><b>Colour:</b> hover a swatch to preview it on the sofa; click it and every photo changes to that colour.</li><li>Delivery date, three guarantees and a stylist link sit quietly underneath.</li><li>No sticky bar at the bottom of the screen.</li></ul>`],
    2: ['Highlights', `<p>Three short benefits in calm cards.</p>`],
    3: ['Will it fit?', `<p>A to-scale drawing for the chosen size and a doorway checker. It answers the main worry people have when buying a sofa online.</p>`],
    4: ['The details', `<p>Materials, dimensions, care, delivery and guarantee, folded away until needed.</p>`],
    5: ['Complete the look', `<p>Matching pieces, with a small saving for two or more.</p>`],
    6: ['Reviews', `<p>A simple score summary and real reviews with photos.</p>`],
    7: ['Fewer sections', `<p>The separate questions section was removed; the details above already answer them, and WhatsApp is always one tap away.</p>`],
    8: ['You may also like', `<p>A simple row of related pieces to keep browsing.</p>`]
  };

  /* Smooth colour change: fade the gallery out, let ../../product/product.js re-render it, fade back in */
  document.addEventListener('click', e => {
    const v = e.target.closest('[data-pv]');
    if (!v || v.getAttribute('aria-pressed') === 'true') return;
    const track = $('[data-gallery-track]');
    track && track.classList.add('is-swapping');
  }, true);
  document.addEventListener('hd:gallery', () => {
    const track = $('[data-gallery-track]');
    if (!track) return;
    requestAnimationFrame(() => setTimeout(() => track.classList.remove('is-swapping'), 60));
  });

  /* Hover a swatch to preview that colour on the main photo (desktop) */
  document.addEventListener('DOMContentLoaded', () => {
    const api = window.HD_PDP; if (!api) return;
    let saved = null;
    $$('[data-pv]').forEach(b => {
      b.addEventListener('mouseenter', () => {
        const first = $('[data-gallery-track] .gallery__item img'); if (!first) return;
        const v = api.p.variants[+b.dataset.pv]; const src = api.I((v.gallery && v.gallery[0]) || v.img);
        saved = saved || first.getAttribute('src');
        first.src = src;
        $('[data-gallery-track]').scrollTo({ left: 0 });
      });
      b.addEventListener('mouseleave', () => {
        const first = $('[data-gallery-track] .gallery__item img');
        if (first && saved && b.getAttribute('aria-pressed') !== 'true') first.src = saved;
        saved = null;
      });
      b.addEventListener('click', () => { saved = null; });
    });
  });
})();
