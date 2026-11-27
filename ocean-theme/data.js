/* =========================================================
   OCEAN — demo catalogue (fine jewellery preset)
   Every product image is a photo of that product type; hover and
   gallery images are detail crops of the same photo, so titles,
   images and copy always match.
   ========================================================= */
window.OCEAN = (function () {
  'use strict';

  function img(id, w, h, fp) {
    if (!id) return null;
    var u = 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + w + (h ? '&h=' + h : '') + '&q=78';
    if (fp) u += '&crop=focalpoint&fp-x=' + fp[0] + '&fp-y=' + fp[1] + '&fp-z=' + fp[2];
    return u;
  }

  var METALS = {
    yellow: { label: '14k yellow gold', hex: '#D9B26F' },
    white: { label: '14k white gold', hex: '#D9DADC' },
    rose: { label: '14k rose gold', hex: '#E2A98E' }
  };

  /* inventory: per-variant stock. 0 = sold out. Missing combination = unavailable. */
  var PRODUCTS = [
    { id: 1, handle: 'tide-pearl-pendant', title: 'Tide Pearl Pendant', type: 'Necklaces', stone: 'Pearl', price: 185, compare: 0, rating: 4.9, reviews: 64, badge: 'Best seller', tags: ['new'],
      photo: '1611085583191-a3b181a88401', fp: [0.6, 0.55, 1.3], detail: [[0.62, 0.62, 2.4], [0.55, 0.4, 1.8]],
      metals: ['yellow', 'white'], sizes: ['40 cm', '45 cm'], stock: 24,
      desc: 'A single freshwater baroque pearl on a fine curb chain. Every pearl is slightly different, so yours will be one of a kind.' },
    { id: 2, handle: 'halo-solitaire-ring', title: 'Halo Solitaire Ring', type: 'Rings', stone: 'Diamond', price: 1250, compare: 0, rating: 4.9, reviews: 41, badge: '', tags: ['bridal'],
      photo: '1591209627710-d2427565a41f', fp: [0.52, 0.5, 1.15], detail: [[0.52, 0.42, 2.4], [0.35, 0.6, 2.2]],
      metals: ['white', 'yellow', 'rose'], sizes: ['5', '6', '7', '8', '9'], soldOutSizes: ['9'], unavailable: ['rose|5'], stock: 3,
      desc: 'A 0.5 ct lab-grown round brilliant framed by a halo of pavé diamonds. Set in recycled 14k gold with a slim, comfortable band.' },
    { id: 3, handle: 'rosa-sapphire-ring', title: 'Rosa Sapphire Ring', type: 'Rings', stone: 'Sapphire', price: 890, compare: 0, rating: 4.8, reviews: 18, badge: '', tags: [],
      photo: '1603561591411-07134e71a2a9', fp: [0.5, 0.45, 1.2], detail: [[0.5, 0.36, 2.4], [0.4, 0.62, 2]],
      metals: ['rose', 'yellow'], sizes: ['5', '6', '7', '8'], stock: 6,
      desc: 'An emerald-cut pink sapphire with a pavé halo and diamond-set shoulders. A colourful alternative to a classic solitaire.' },
    { id: 4, handle: 'twist-hoop-earrings', title: 'Twist Hoop Earrings', type: 'Earrings', stone: 'None', price: 145, compare: 180, rating: 4.7, reviews: 72, badge: '', tags: ['gifts'],
      photo: '1617038220319-276d3cfab638', fp: [0.5, 0.64, 1.7], detail: [[0.46, 0.58, 2.4], [0.54, 0.75, 2.4]],
      metals: ['yellow'], sizes: ['Small', 'Medium'], stock: 40,
      desc: 'Rope-twist hoops in solid 14k recycled gold. Hollow-formed, so they are light enough to wear every day, bold enough to wear alone.' },
    { id: 5, handle: 'herringbone-chain', title: 'Herringbone Chain', type: 'Necklaces', stone: 'None', price: 220, compare: 0, rating: 4.8, reviews: 38, badge: '', tags: [],
      photo: '1616837874254-8d5aaa63e273', fp: [0.5, 0.45, 1.2], detail: [[0.5, 0.42, 2.4], [0.5, 0.6, 1.6]],
      metals: ['yellow', 'white'], sizes: ['40 cm', '45 cm', '50 cm'], unitPer: 'cm', stock: 18,
      desc: 'A flat, liquid-smooth herringbone chain that sits close to the collarbone. Sold by length, priced per centimetre.' },
    { id: 6, handle: 'halo-diamond-studs', title: 'Halo Diamond Studs', type: 'Earrings', stone: 'Diamond', price: 1480, compare: 0, rating: 5, reviews: 22, badge: '', tags: ['bridal'],
      photo: '1588444650733-d0767b753fc8', fp: [0.5, 0.5, 1.2], detail: [[0.32, 0.5, 2.4], [0.68, 0.5, 2.4]],
      metals: ['white', 'yellow'], sizes: ['0.5 ct', '1 ct'], stock: 5,
      desc: 'Round lab-grown diamonds in a double halo, on secure screw backs. The stud you will reach for every single day.' },
    { id: 7, handle: 'ginkgo-leaf-pendant', title: 'Ginkgo Leaf Pendant', type: 'Necklaces', stone: 'None', price: 165, compare: 0, rating: 4.8, reviews: 29, badge: 'New', tags: ['new', 'gifts'],
      photo: '1620656798579-1984d9e87df7', fp: [0.62, 0.55, 1.4], detail: [[0.65, 0.62, 2.4], [0.45, 0.4, 1.8]],
      metals: ['yellow'], sizes: ['45 cm'], stock: 15,
      desc: 'A hand-carved ginkgo leaf cast in recycled gold. A small symbol of resilience, made to be worn for years.' },
    { id: 8, handle: 'infinity-rose-bracelet', title: 'Infinity Rose Bracelet', type: 'Bracelets', stone: 'Topaz', price: 240, compare: 0, rating: 4.6, reviews: 11, badge: '', tags: ['gifts'],
      photo: '1611591437281-460bfbe1220a', fp: [0.5, 0.5, 1.2], detail: [[0.3, 0.5, 2.4], [0.7, 0.5, 2.4]],
      metals: ['rose'], sizes: ['16 cm', '18 cm'], soldOutSizes: ['16 cm', '18 cm'], stock: 0,
      desc: 'Interlocking infinity links pavé-set with white topaz, in 14k rose gold. Restocking soon.' },
    { id: 9, handle: 'diamond-pave-stacking-band-set', title: 'Stacking Band Set of Three, Diamond Pavé in 14k Yellow Gold with Matching Gift Box', type: 'Rings', stone: 'Diamond', price: 640, compare: 0, rating: 4.9, reviews: 9, badge: '', tags: ['gifts'],
      photo: '1543294001-f7cd5d7fb516', fp: [0.5, 0.46, 1.2], detail: [[0.5, 0.35, 2.4], [0.5, 0.62, 2.4]],
      metals: ['yellow'], sizes: ['5', '6', '7', '8'], stock: 9,
      desc: 'Three slim bands designed to be stacked: one pavé, one textured and one high-polish. Wear them together or apart.' },
    { id: 10, handle: 'bold-link-chain', title: 'Bold Link Chain', type: 'Necklaces', stone: 'None', price: 310, compare: 0, rating: 4.8, reviews: 24, badge: '', tags: ['new'],
      photo: '1633810542706-90e5ff7557be', fp: [0.5, 0.32, 1.3], detail: [[0.48, 0.28, 2.4], [0.55, 0.7, 2]],
      metals: ['yellow'], sizes: ['42 cm', '46 cm'], stock: 12,
      desc: 'A chunky paperclip-and-curb chain with a hidden lobster clasp. Statement weight, everyday comfort.' },
    { id: 11, handle: 'bangle-stack', title: 'Textured Bangle Stack', type: 'Bracelets', stone: 'None', price: 380, compare: 450, rating: 4.7, reviews: 13, badge: '', tags: [],
      photo: '1611107683227-e9060eccd846', fp: [0.5, 0.5, 1.1], detail: [[0.4, 0.4, 2.4], [0.65, 0.6, 2.4]],
      metals: ['yellow'], sizes: ['S/M', 'M/L'], stock: 7,
      desc: 'Five hammered bangles with a soft, candle-lit shine. Sold as a stack, designed to be split and shared.' },
    { id: 12, handle: 'petal-gemstone-ring', title: 'Petal Gemstone Ring', type: 'Rings', stone: 'Amethyst', price: 760, compare: 0, rating: 4.8, reviews: 7, badge: '', tags: [],
      photo: '1602751584552-8ba73aad10e1', fp: [0.5, 0.5, 1.1], detail: [[0.5, 0.3, 2.4], [0.3, 0.6, 2.4]],
      metals: ['white'], sizes: ['6', '7', '8'], stock: 4,
      desc: 'Amethyst and citrine petals around a diamond-set centre. A cocktail ring that still feels light on the hand.' },
    { id: 13, handle: 'rose-drop-earrings', title: 'Rose Drop Earrings', type: 'Earrings', stone: 'Morganite', price: 210, compare: 0, rating: 4.7, reviews: 19, badge: '', tags: ['gifts'],
      photo: '1629224316810-9d8805b95e76', fp: [0.5, 0.55, 1.2], detail: [[0.38, 0.6, 2.4], [0.62, 0.5, 2.4]],
      metals: ['rose'], sizes: ['One size'], stock: 21,
      desc: 'Pear-cut morganite drops with a white topaz halo, on 14k rose gold hooks.' },
    { id: 14, handle: 'classic-wedding-band', title: 'Classic Wedding Band', type: 'Rings', stone: 'None', price: 540, compare: 0, rating: 4.9, reviews: 33, badge: '', tags: ['bridal'],
      photo: '1622398925373-3f91b1e275f5', fp: [0.45, 0.55, 1.1], detail: [[0.3, 0.6, 2.4], [0.65, 0.35, 2.4]],
      metals: ['yellow', 'white', 'rose'], sizes: ['5', '6', '7', '8', '9', '10'], stock: 30,
      desc: 'A 4 mm comfort-fit band in solid 14k recycled gold, with free engraving inside.' },
    { id: 15, handle: 'crescent-charm-necklace', title: 'Crescent Charm Necklace', type: 'Necklaces', stone: 'Topaz', price: 195, compare: 0, rating: 4.6, reviews: 8, badge: '', tags: [],
      photo: '1599643478518-a784e5dc4c8f', fp: [0.47, 0.55, 1.2], detail: [[0.47, 0.8, 2.4], [0.47, 0.25, 2.4]],
      metals: ['yellow'], sizes: ['45 cm'], stock: 11,
      desc: 'A London blue topaz drop above a pavé crescent, on a fine trace chain.' },
    { id: 16, handle: 'engraved-signet-ring', title: 'Engraved Signet Ring', type: 'Rings', stone: 'None', price: 280, compare: 0, rating: 4.8, reviews: 6, badge: '', tags: [],
      photo: null, metals: ['yellow'], sizes: ['5', '6', '7', '8'], stock: 10,
      desc: 'An oval signet in recycled gold, engraved with up to three initials. (Demo product without an image.)' },
    { id: 17, handle: 'pebble-coin-necklace', title: 'Pebble Coin Necklace', type: 'Necklaces', stone: 'None', price: 175, compare: 0, rating: 4.8, reviews: 21, badge: '', tags: ['look'],
      photo: '1599459183200-59c7687a0275', fp: [0.5, 0.56, 2.2], detail: [[0.5, 0.56, 2.4], [0.55, 0.4, 1.6]],
      metals: ['yellow'], sizes: ['50 cm'], stock: 14, hidden: true,
      desc: 'A hammered gold coin pendant on a long trace chain, made for layering.' },
    { id: 18, handle: 'satin-ball-chain', title: 'Satin Ball Chain', type: 'Necklaces', stone: 'None', price: 120, compare: 0, rating: 4.7, reviews: 14, badge: '', tags: ['look'],
      photo: '1599459183200-59c7687a0275', fp: [0.57, 0.43, 2.4], detail: [[0.57, 0.43, 2.4], [0.55, 0.3, 1.6]],
      metals: ['yellow'], sizes: ['42 cm'], stock: 20, hidden: true,
      desc: 'A fine satin-finish bead chain that sits at the collarbone.' },
    { id: 19, handle: 'paperclip-chain', title: 'Paperclip Chain', type: 'Necklaces', stone: 'None', price: 150, compare: 0, rating: 4.8, reviews: 27, badge: '', tags: ['look'],
      photo: '1599459183200-59c7687a0275', fp: [0.6, 0.27, 2.4], detail: [[0.6, 0.25, 2.4], [0.55, 0.35, 1.6]],
      metals: ['yellow'], sizes: ['40 cm'], stock: 25, hidden: true,
      desc: 'Elongated paperclip links in solid 14k recycled gold, worn high and short.' }
    ,{ id: 20, handle: 'gift-card', title: 'Ocean Gift Card', type: 'Gift card', stone: 'None', price: 50, compare: 0, rating: 5, reviews: 12, badge: '', tags: ['gifts'],
      photo: null, giftCard: true, metals: ['yellow'], sizes: ['$50', '$100', '$250', '$500'], amounts: [50, 100, 250, 500], stock: 999, hidden: true,
      desc: 'Delivered by email on the date you choose, with your message. Never expires and can be used on anything in the store.' }
  ];

  var COLLECTIONS = [
    { handle: 'all', title: 'All jewellery', desc: 'Every piece we make, in solid recycled 14k gold.', image: '1631982690223-8aa4be0a2497' },
    { handle: 'rings', title: 'Rings', desc: 'Solitaires, stacking bands and everyday rings, with free resizing within 60 days.', image: '1543294001-f7cd5d7fb516', match: function (p) { return p.type === 'Rings'; } },
    { handle: 'necklaces', title: 'Necklaces', desc: 'Pendants and chains made for layering, from 40 to 50 cm.', image: '1599459183200-59c7687a0275', match: function (p) { return p.type === 'Necklaces'; } },
    { handle: 'earrings', title: 'Earrings', desc: 'Hoops, studs and drops in solid 14k gold, nickel-free.', image: '1617038260897-41a1f14a8ca0', match: function (p) { return p.type === 'Earrings'; } },
    { handle: 'bracelets', title: 'Bracelets', desc: 'Bangles and chain bracelets in two sizes.', image: '1596944924616-7b38e7cfac36', match: function (p) { return p.type === 'Bracelets'; } },
    { handle: 'bridal', title: 'Bridal', desc: 'Engagement rings, wedding bands and diamond studs.', image: '1622398925373-3f91b1e275f5', match: function (p) { return p.tags.indexOf('bridal') > -1; } },
    { handle: 'gifts-under-250', title: 'Gifts under $250', desc: 'Gift-boxed and ready to give.', image: null, match: function (p) { return p.price <= 250; } },
    { handle: 'archive', title: 'The Archive', desc: 'Retired designs. Nothing here right now.', image: null, match: function () { return false; } }
  ];

  var ARTICLES = [
    { id: 1, handle: 'find-your-ring-size', title: 'How to find your ring size at home', tag: 'Guides', read: 5, date: '18 Nov 2026', author: 'Maya Lund', image: '1631982690223-8aa4be0a2497', excerpt: 'Three easy ways to measure, and what to do if you are between sizes.' },
    { id: 2, handle: 'layering-necklaces', title: 'Layering necklaces: the three-length rule', tag: 'Styling', read: 4, date: '11 Nov 2026', author: 'Maya Lund', image: '1590548784585-643d2b9f2925', excerpt: 'Pick a short, a middle and a long chain, then vary the texture.' },
    { id: 3, handle: 'caring-for-solid-gold', title: 'Caring for solid gold so it lasts', tag: 'Care', read: 3, date: '4 Nov 2026', author: 'Theo Ward', image: '1561828995-aa79a2db86dd', excerpt: 'Simple habits that keep 14k gold bright for decades, plus our free polishing service.' },
    { id: 4, handle: 'pearls-101', title: 'Pearls 101: freshwater, baroque and keshi', tag: 'Materials', read: 6, date: '28 Oct 2026', author: 'Theo Ward', image: '1515562141207-7a88fb7ce338', excerpt: 'What makes each type different, and how to tell quality at a glance.' },
    { id: 5, handle: 'lab-grown-diamonds', title: 'Lab-grown diamonds, explained simply', tag: 'Materials', read: 7, date: '19 Oct 2026', author: 'Maya Lund', image: '1605100804763-247f67b3557e', excerpt: 'Same sparkle, same hardness, a fraction of the footprint.' },
    { id: 6, handle: 'gift-guide', title: 'The gift guide: pieces they will wear daily', tag: 'Gifts', read: 4, date: '12 Oct 2026', author: 'Theo Ward', image: '1569397288884-4d43d6738fbd', excerpt: 'Twelve ideas under $250, all gift-boxed with a handwritten card.' }
  ];

  return { img: img, METALS: METALS, PRODUCTS: PRODUCTS, COLLECTIONS: COLLECTIONS, ARTICLES: ARTICLES };
})();
