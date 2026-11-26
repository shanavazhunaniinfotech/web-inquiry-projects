/* Shared product data (from the live WooCommerce store) — used by /v2/ */
window.TWB = (function () {
  var DRAIN = '5 meter (Ø110 mm), septictank bij te leveren';
  var P = [
    { id: 'mini-grijs', name: 'Mini Grijs', short: 'Grijs', img: ['mini-grijs.jpg'], day: 225, wk: 270, lay: { f: 1, m: 1 }, pos: 2, dims: '2,4 × 1,65 × 2,9 m', drain: DRAIN, guests: 'tot ca. 80 gasten' },
    { id: 'mini-hout', name: 'Mini Hout', short: 'Hout', img: ['mini-hout.jpg'], day: 250, wk: 290, lay: { f: 1, m: 1 }, pos: 2, dims: '2,4 × 1,65 × 2,9 m', drain: DRAIN, guests: 'tot ca. 80 gasten' },
    { id: 'mini-wit', name: 'Mini Wit met vermalers', short: 'Wit', img: ['mini-wit.jpg', 'interieur-wasbak.jpg'], day: 260, wk: 295, lay: { f: 1, m: 1 }, pos: 2, dims: '2,4 × 1,65 × 2,9 m', drain: DRAIN, guests: 'tot ca. 80 gasten' },
    { id: 'mini-vacuum', name: 'Mini Vacuümtoilet', short: 'Vacuüm', img: ['mini-vacuum.jpg'], day: null, wk: null, lay: { f: 1, m: 1 }, pos: 2, dims: '2,4 × 1,65 × 2,9 m', drain: 'Geen afvoer nodig, alles compleet', guests: 'tot ca. 80 gasten' },
    { id: 'type-a', name: 'Type A', short: 'Type A', img: ['type-a.jpg'], day: 275, wk: 305, lay: { f: 2, m: 1, u: 2 }, pos: 5, dims: '3,6 × 2,2 × 2,9 m', drain: DRAIN, guests: 'tot ca. 200 gasten', km: '€0,90' },
    { id: 'wit-type-a', name: 'Wit Type A', short: 'Wit', img: ['wit-type-a.jpg'], day: 300, wk: 325, lay: { f: 2, m: 1, u: 2 }, pos: 5, dims: '3,6 × 2,2 × 2,9 m', drain: DRAIN, guests: 'tot ca. 200 gasten', tag: 'Nieuw' },
    { id: 'type-a-grey', name: 'Type A Grey Edition', short: 'Grey Edition', img: ['type-a-grey.jpg'], day: 325, wk: 375, lay: { f: 2, m: 1, u: 2 }, pos: 5, dims: '3,6 × 2,5 × 2,9 m', drain: DRAIN, guests: 'tot ca. 200 gasten' },
    { id: 'type-b', name: 'Type B Deluxe', short: 'Deluxe', img: ['type-b-deluxe.jpg'], day: 350, wk: 385, lay: { f: 3, m: 1, u: 3 }, pos: 7, dims: '5 × 2,2 × 2,9 m', drain: DRAIN, guests: 'tot ca. 300 gasten' },
    { id: 'vip-hout', name: 'VIP Hout', short: 'Hout', img: ['vip-hout.jpg', 'vip-hout-2.jpg', 'vip-hout-3.jpg'], day: 395, wk: 445, lay: { f: 3, m: 1, u: 3 }, pos: 7, dims: '5 × 2,2 × 2,9 m', drain: DRAIN, guests: 'tot ca. 300 gasten', tag: 'Meest gekozen', extra: { 'Beschikbaar': '6 identieke wagens, voor een uniforme uitstraling' } },
    { id: 'vip-grijs', name: 'VIP Grijs', short: 'Grijs', img: ['vip-grijs.jpg'], day: 375, wk: 425, lay: { f: 3, m: 1, u: 3 }, pos: 7, dims: '5 × 2,2 × 2,9 m', drain: DRAIN, guests: 'tot ca. 300 gasten' },
    { id: 'event', name: 'Event', short: 'Event', img: ['event.jpg', 'event-2.jpg'], day: 450, wk: 495, lay: { f: 6, m: 3, u: 4 }, pos: 13, dims: '3,6 × 2,5 × 2,9 m', drain: DRAIN, guests: 'tot ca. 600 gasten per wagen', extra: { 'Voorzien van': '4 fonteintjes met spiegel, 2 elektrische handdrogers en zeepautomaat' } },
    { id: 'miva', name: 'MIVA Toilet', short: 'MIVA', img: ['miva.jpg', 'miva-binnen.jpg'], day: null, wk: null, lay: { a: 1 }, pos: 1, dims: '2,4 × 1,65 × 2,9 m', drain: 'Geen afvoer nodig', guests: 'rolstoeltoegankelijk', extra: { 'Toegang': 'Antislip oprijplaat voor rolstoelen', 'Veiligheid': 'Voldoet aan alle eisen anno 2025' } },
    { id: 'plaszuil', name: 'Plaszuil', short: 'Plaszuil', img: ['plaszuil.png'], contain: true, day: 60, wk: null, lay: { u: 4 }, pos: 4, dims: 'Mobiel urinoir', drain: 'Geen aansluiting nodig', guests: 'voorkomt wildplassen', noBase: true, extra: { 'Privacy': 'Hoge scheidingswanden' } }
  ];
  var SERIES = [
    { id: 'mini', name: 'Mini serie', tagline: 'Compact en luxe. Perfect voor tuinfeesten en verjaardagen.', vars: ['mini-grijs', 'mini-hout', 'mini-wit', 'mini-vacuum'] },
    { id: 'typea', name: 'Type A serie', tagline: 'De allrounder: twee damestoiletten, een herentoilet en twee urinoirs.', vars: ['type-a-grey', 'wit-type-a', 'type-a'] },
    { id: 'typeb', name: 'Type B Deluxe', tagline: 'Ruim en strak, met zeven toiletplaatsen voor grotere feesten.', vars: ['type-b'] },
    { id: 'vip', name: 'VIP serie', tagline: 'Antraciet afgewerkt, ledverlichting, design meubels en waterloze urinoirs.', vars: ['vip-hout', 'vip-grijs'], badge: 'Meest gekozen' },
    { id: 'event', name: 'Event', tagline: 'Dertien toiletplaatsen in één wagen. Gebouwd voor festivals en grote events.', vars: ['event'], badge: 'Tot 1000 gasten' },
    { id: 'miva', name: 'MIVA Toilet', tagline: 'Rolstoeltoegankelijk via een antislip oprijplaat. Geen afvoer nodig.', vars: ['miva'], badge: 'Nieuw 2025' },
    { id: 'plaszuil', name: 'Plaszuil', tagline: 'Vier mannen tegelijk. Kortere rijen en geen wildplassen.', vars: ['plaszuil'] }
  ];
  var BASE = { 'Stroom': '220V', 'Voorzien van': '2 fonteintjes met spiegel, 2 elektrische handdrogers en zeepautomaat', 'Geleverd met': 'Wc-papier, zonder meerprijs' };
  var CITIES = { 'Boxtel': 0, 'Den Bosch': 12, "'s-Hertogenbosch": 12, 'Vught': 9, 'Oisterwijk': 10, 'Sint-Michielsgestel': 8, 'Schijndel': 9, 'Best': 14, 'Eindhoven': 25, 'Tilburg': 22, 'Waalwijk': 25, 'Veghel': 18, 'Uden': 25, 'Oss': 28, 'Helmond': 35, 'Breda': 50, 'Nijmegen': 50, 'Venlo': 70, 'Arnhem': 70, 'Utrecht': 60, 'Roosendaal': 70, 'Bergen op Zoom': 80, 'Dordrecht': 65, 'Rotterdam': 85, 'Den Haag': 105, 'Amsterdam': 100, 'Maastricht': 105, 'Zwolle': 140, 'Groningen': 230, 'Antwerpen': 85, 'Turnhout': 50, 'Hasselt': 85, 'Brussel': 125, 'Gent': 140, 'Leuven': 115, 'Düsseldorf': 110, 'Keulen': 140, 'Aken': 125 };
  return { P: P, SERIES: SERIES, BASE: BASE, CITIES: CITIES };
})();
