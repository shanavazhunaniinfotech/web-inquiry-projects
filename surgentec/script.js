/* =========================================================
   SurGenTec® homepage prototype: interactions
   All product / evidence wording below is copied verbatim from
   SurGenTec's currently published website. Do not edit copy here
   without written approval from SurGenTec.
   ========================================================= */
(() => {
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const motion = hasGsap && !reduce;
if (motion) { document.documentElement.classList.add('motion'); gsap.registerPlugin(ScrollTrigger); }

window.dataLayer = window.dataLayer || [];
const track = (event, params) => window.dataLayer.push(Object.assign({ event }, params));

const LIVE = 'https://www.surgentec.com';
const PDF = LIVE + '/wp-content/uploads/';

/* ---------------- DATA ---------------- */
// Working solution titles (taken from existing product names). Replace with the names in the client sitemap.
const SOLUTIONS = [
  { id: 'si-joint', name: 'SI Joint Fusion', img: 'images/b-tilink.jpg', products: ['tilink-p', 'tilink-l', 'tilink-insite'] },
  { id: 'facet-fixation', name: 'Facet Fixation', img: 'images/b-ion-c.jpg', products: ['ion-c', 'ion-l', 'ion-3d', 'facetcore'] },
  { id: 'biologics', name: 'Biologics', img: 'images/b-vimax-fm.jpg', products: ['nanoputty', 'hydroputty', 'hydrofiber', 'vimax', 'vimax-fm', 'ossify'] },
  { id: 'graft-delivery', name: 'Graft Delivery', img: 'images/b-graftgun.jpg', products: ['graftgun', 'graftrasp'] },
  { id: 'access-aspiration', name: 'Access, Aspiration & Decompression', img: 'images/b-alara.jpg', products: ['alara', 'b-man', 'bcor', 'vantage'] },
];

const PRODUCTS = {
  'tilink-p': { name: 'TiLink-P®', tag: 'SI Joint Fusion System', img: 'images/p-tilink-p.png', url: '/tilink-p/',
    desc: 'TiLink-P® is a minimally invasive solution designed to provide superior stability, precision, and long-term fixation for patients suffering from sacroiliac joint dysfunction.',
    points: ['True Posterior Approach', 'Novel Transfixing Compression Anchor', 'Maximize Biologic Post-Packing', 'No Other Fixation Necessary'], ev: ['tilink-comp', 'tilink-series'] },
  'tilink-l': { name: 'TiLink-L®', tag: 'SI Fusion Implant', img: 'images/p-tilink-l.png', url: '/tilink/',
    desc: 'TiLink-L sacroiliac joint fusion system receives FDA 510K clearance',
    points: ['Intuitively Engineered', 'Nanotex® Surface Technology', 'Bone Ingrowth Windows', 'Harvesting Channel To Help Facilitate Fusion'], ev: [] },
  'tilink-insite': { name: 'TiLink® | INSITE™', tag: 'Sterile, Surgery-Ready SI Joint Fusion System', img: 'images/p-tilink-insite.png', url: '/tilink-insite/',
    desc: 'The INSITE™ kit includes a complete set of single-use, sterile instruments paired with an advanced 3D-printed titanium implant. This all-in-one sterile solution streamlines surgical preparation, enhances efficiency, and reduces procedural complexity.',
    points: ['Minimally Invasive In-Office Procedure', 'Single Small Incision', 'Patients Go Home the Same Day'], ev: [] },
  'ion-c': { name: 'ION-C™', tag: 'Cervical Implant System', img: 'images/p-ion-c.png', url: '/ion-c/',
    desc: 'ION-C™ is an advanced, minimally invasive solution engineered to provide supplemental posterior stabilization in cervical fusion with precision and efficiency.',
    points: ['Zero-profile implant design', 'In-situ implant depth adjustment', 'No percussion on insertion', 'Maintains neutral position', 'Minimizes risk of joint expansion'], ev: ['ionc-wp'] },
  'ion-l': { name: 'ION-L™', tag: 'Bilateral posterior placement (L3–S1)', img: 'images/p-ion-l.png', url: '/ion-l/',
    desc: 'Designed to sit within the facet region to minimize implant prominence while providing stabilization across the treated segment.',
    points: ['Bilateral posterior placement (L3–S1)', 'Zero-profile implant design', 'Controlled, non-impact insertion', 'Nanotex® surface technology'], ev: [] },
  'ion-3d': { name: 'ION-3D™', tag: 'Micro implants', img: 'images/p-ion-3d.png', url: '/ion/',
    desc: 'ION minimally invasive facet screw receives FDA 510K clearance',
    points: ['Micro Implants', 'Minimally Invasive', 'Nanotex® Surface Technology'], ev: [] },
  'facetcore': { name: 'FacetCore™', tag: '100% Cortical Bone', img: 'images/p-facetcore.png', url: '/facetcore/',
    desc: 'Cortical bone facet implant is meant to stabilize the spine by providing bilateral fixation.',
    points: ['Anti-Migration', 'Minimally Disruptive', 'Provides Stabilization To Spinal Column', '100% Cortical Bone'], ev: [] },
  'nanoputty': { name: 'OsteoFlo® NanoPutty®', tag: 'Synthetic Bone Graft Putty', img: 'images/p-nanoputty.png', url: '/graft-delivery-device/biologics/osteoflo-nanoputty/',
    desc: 'First quadphasic synthetic bone graft gets FDA clearance',
    points: ['Nano-Surface Technology', 'Quadphasic Particle Resorption Profile', 'Highly Formable and Moldable'], ev: ['nanoputty-study'] },
  'hydroputty': { name: 'OsteoFlo® HydroPutty®', tag: 'Hydrophilic synthetic bone graft', img: 'images/p-hydroputty.png', url: '/osteoflo-hydroputty/',
    desc: 'OsteoFlo® HydroPutty® is a proprietary hydrophilic synthetic bone graft utilizing a unique blend of biomaterials to optimize bone growth and provides structure closest to bone.',
    points: ['Resorbable Scaffolds', 'Composition', 'Flowability'], ev: [] },
  'hydrofiber': { name: 'OsteoFlo® HydroFiber™', tag: 'FDA cleared equivalent to autograft for spine and extremities', img: 'images/p-hydrofiber.png', url: '/osteoflo-hydrofiber/',
    desc: 'FDA cleared as equivalent to autograft across all levels of the spine, and intended for tumor removal, cysts, osteomyelitis, fractures, and trauma.',
    points: ['Stand-alone Spine Indications', 'Web Interlace Technology'], ev: ['hydrofiber-gsj', 'hydrofiber-case'] },
  'vimax': { name: 'ViMax®', tag: 'Fiber Allograft', img: 'images/p-vimax.png', url: '/vimax/',
    desc: 'Partnership with Aziyo Biologics leads to the development of a flowable, viable fiber allograft',
    points: ['Osteogenic, Osteoinductive, Osteoconductive'], ev: [] },
  'vimax-fm': { name: 'ViMax® Fiber Matrix', tag: 'Next generation of frozen fiber allograft', img: 'images/p-vimax-fm.jpg', cover: true, url: '/vimax-fiber-matrix/',
    desc: 'Next generation of frozen fiber allograft preserves the native bone matrix and maximizes its regenerative potential',
    points: ['Demineralized cortical fibers rich in growth factors', 'Superior handling and packing capabilities', 'Terminally sterilized using e-beam'], ev: [] },
  'ossify': { name: 'Ossify®', tag: 'Cortical Fibers', img: 'images/p-ossify.png', url: '/ossify/',
    desc: 'Maintains cohesive handling and flowability characteristics to provide precise graft placement without the use of a synthetic carrier.',
    points: ['100% Cortical, No Carrier', 'Flowable And Malleable When Hydrated', 'Wicks Blood, BMA, PRP'], ev: [] },
  'graftgun': { name: 'GraftGun®', tag: 'Universal Graft Delivery System (GDS®)', img: 'images/p-graftgun.png', url: '/graftgun/',
    desc: 'The GraftGun® Universal Graft Delivery System (GDS®) is intended to be used for the delivery of hydrated allograft, autograft, or synthetic bone graft material to an orthopedic surgical site, via direct visualization or minimally invasive.',
    points: ['Intuitive', 'Universal', 'Ergonomic'], ev: [] },
  'graftrasp': { name: '3D GraftRasp®', tag: 'Cannulated rasp', img: 'images/p-graftrasp.png', url: '/graft-delivery-device/3d-graftrasp/',
    desc: 'Cannulated rasp allows for bony decortication and simultaneous bone graft delivery to a desired location.',
    points: ['Ergonomic Handle', 'Cannulated Rasp', 'Disposable Rasp Teeth'], ev: ['graftrasp-wp'] },
  'alara': { name: 'ALARA® Needle', tag: 'Neuro Access Needle Kit', img: 'images/p-alara.png', url: '/alara-needle/',
    desc: 'The ALARA® Neuro Access Needle Kit is used for targeting and assisting in cannulating a pedicle.',
    points: ['Neuromonitoring', 'Accurate', 'Rigid'], ev: ['alara-wp'] },
  'b-man': { name: 'B-MAN®', tag: 'Bone Marrow Aspirate Kit', img: 'images/p-bman.jpg', cover: true, url: '/b-man/',
    desc: 'B-MAN offers single-step access while using CELLect filtration to minimize bone contaminants.',
    points: ['CELLect Filtration', 'Optimal Cell Viability', 'No Centrifuge', 'Single Step'], ev: ['bman-wp'] },
  'bcor': { name: 'BCOR™', tag: 'Bone Marrow Aspirate Kit', img: 'images/p-bcor.png', url: '/bcor/', launch: true,
    desc: 'One entry. Two samples. After aspiration, use the included drill and plunger to collect a cancellous bone core biopsy from the same access site.¹',
    points: ['CELLect High Filtration', 'Optimal Cell Viability', 'No Centrifugation', 'Single Step'], ev: [] },
  'vantage': { name: 'Vantage™', tag: 'Spinal Decompression', img: 'images/p-vantage.jpg', cover: true, url: '/vantage/',
    desc: 'The Vantage™ system is a minimally invasive spinal decompression device designed to relieve pain caused by compression of the spinal cord and surrounding neural structures- a common source of pressure that leads to discomfort and reduced mobility.',
    points: ['Procedural Safety & Control', 'Direct Visualization', 'Zero Reprocessing Costs'], ev: [] },
};

// Published PDFs on surgentec.com: titles are the site's own link text.
const EVIDENCE = [
  { id: 'tilink-series', type: 'Case series', cat: 'Clinical study', product: 'tilink-p', file: '2025/10/A-Multicenter-Retrospective-Evaluation-of-the-Efficacy-of-a-Novel-Posterior-Sacroiliac-Joint-Fusion-System-Initial-Case-Series.pdf',
    title: 'A Multicenter, Retrospective Evaluation of the Efficacy of a Novel Posterior Sacroiliac Joint Fusion System: Case Series' },
  { id: 'hydrofiber-gsj', type: 'Journal study', cat: 'Clinical study', product: 'hydrofiber', file: '2026/06/HydroFiber-Global-Spine-Journal-Study-2026.pdf',
    title: 'OsteoFlo® HydroFiber™ Global Spine Journal Study', quote: 'Performs comparably to ICBG as a standalone graft and as a 1:1 autograft extender — reducing reliance on donor site harvest.' },
  { id: 'ionc-wp', type: 'White paper', cat: 'White paper', product: 'ion-c', file: '2026/08/hybrid-posterior-fixation-incorporating-cervical-facet-fixation-for-the-treatment-of-proximal-junctional-failure.pdf',
    title: 'ION-C™ White Paper: Hybrid Posterior Fixation Incorporating Cervical Facet Fixation for the Treatment of Proximal Junctional Failure' },
  { id: 'tilink-comp', type: 'White paper', cat: 'White paper', product: 'tilink-p', file: '2024/11/Surgentec_TLinkP_Compression_Study.whtv3-5.pdf',
    title: 'TiLink-P® Compression White Paper Study' },
  { id: 'hydrofiber-case', type: 'Case report', cat: 'Case report', product: 'hydrofiber', file: '2026/09/503791-posterior-lumbar-arthrodesis-using-a-stand-alone-hydrophilic-synthetic-bone-graft-in-the-setting-of-postoperative-osteomyelitisdiscitis-a-case-report.pdf',
    title: 'Case report on posterior lumbar fusion using a stand-alone hydrophilic synthetic bone graft in the setting of postoperative infection.' },
  { id: 'bman-wp', type: 'White paper', cat: 'White paper', product: 'b-man', file: '2026/07/cureus-0018-00000110747.pdf',
    title: 'B-MAN® White Paper Study: Benchmark Comparison of Bone Marrow Aspiration Systems' },
  { id: 'nanoputty-study', type: 'Comparative study', cat: 'Clinical study', product: 'nanoputty', file: '2023/12/OsteoFlo-Comparative-Study.pdf',
    title: 'OsteoFlo® NanoPutty® Comparative Study' },
  { id: 'alara-wp', type: 'White paper', cat: 'White paper', product: 'alara', file: '2026/06/ALARA-White-Paper-2026.pdf',
    title: 'Alara White Paper Study' },
  { id: 'graftrasp-wp', type: 'White paper', cat: 'White paper', product: 'graftrasp', file: '2023/02/Surgentec-White-Paper-3D-System.pdf',
    title: 'Surgentec White Paper 3D System' },
];
const EXTRA_RESOURCES = [
  { cat: 'Brochure', title: 'Product brochures', ph: true },
  { cat: 'IFU', title: 'Instructions for Use (IFU)', ph: true },
  { cat: 'Video', title: 'Product & technique videos', url: LIVE + '/videos/' },
];

const solOf = {};
SOLUTIONS.forEach((s, i) => s.products.forEach(p => { solOf[p] = { ...s, idx: i }; }));
const pad = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const arrow = '<svg aria-hidden="true"><use href="#i-arrow"/></svg>';
const imgTag = (p, alt = '') => `<img src="${p.img}" alt="${esc(alt)}" loading="lazy"${p.cover ? ' class="cover"' : ''}>`;

/* ---------------- RENDER ---------------- */
// Mega menu, mobile drawer, footer, hero strip
$('#megaCols').innerHTML = SOLUTIONS.map((s, i) => `
  <div class="mega__col">
    <h3><span class="mono">${pad(i + 1)}</span>${esc(s.name)}</h3>
    <ul>${s.products.map(id => `<li><button type="button" data-open-product="${id}">${esc(PRODUCTS[id].name)}</button></li>`).join('')}</ul>
  </div>`).join('');
$('#dnSolutions').innerHTML = SOLUTIONS.map((s, i) => `
  <div class="dn-sol"><p>${pad(i + 1)} · ${esc(s.name)}</p>
  ${s.products.map(id => `<button type="button" data-open-product="${id}">${esc(PRODUCTS[id].name)}</button>`).join('')}</div>`).join('');
$('#footSol').innerHTML = SOLUTIONS.map((s, i) => `<li><a href="#solutions" data-go-solution="${i}">${esc(s.name)}</a></li>`).join('');
$('#heroSolList').innerHTML = SOLUTIONS.map((s, i) => `
  <li><a href="#solutions" data-go-solution="${i}"><span class="mono">${pad(i + 1)}</span><strong>${esc(s.name)}</strong><small>${s.products.length} products</small></a></li>`).join('');

// Solutions explorer
$('#solTabs').innerHTML = SOLUTIONS.map((s, i) => `
  <button class="sol-tab" role="tab" id="tab-${s.id}" aria-controls="panel-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
    <span class="sol-tab__bar"><i></i></span>
    <span class="mono">${pad(i + 1)}</span><strong>${esc(s.name)}</strong><small>${s.products.length} products</small>
  </button>`).join('');
$('#solPanels').innerHTML = SOLUTIONS.map((s, i) => {
  const ev = s.products.flatMap(p => PRODUCTS[p].ev).length;
  return `
  <div class="sol-panel" role="tabpanel" id="panel-${s.id}" aria-labelledby="tab-${s.id}" ${i ? 'hidden' : ''}>
    <div class="sol-media">
      <picture><source media="(min-width: 1024px)" srcset="${s.img.replace('/b-', '/s-')}"><img src="${s.img}" alt="" loading="lazy"></picture>
      <span class="sol-media__url mono">/solutions/${s.id}/</span>
      <div class="sol-media__cap">
        <p class="mono">Solution ${pad(i + 1)} · ${s.products.length} products</p>
        <h3>${esc(s.name)}<em class="wt">Working title</em></h3>
      </div>
    </div>
    <div class="sol-content">
      <p class="sol-content__desc"><span class="ph">[CLIENT-APPROVED CONTENT REQUIRED] Solution overview for ${esc(s.name)}.</span></p>
      <ul class="sol-products">
        ${s.products.map(id => { const p = PRODUCTS[id]; return `<li><button class="sp" type="button" data-open-product="${id}">
          <span class="sp__img">${imgTag(p)}</span><span><strong>${esc(p.name)}</strong><small>${esc(p.tag)}</small></span>${arrow}</button></li>`; }).join('')}
      </ul>
      <div class="sol-links">
        <a class="link-arrow" href="#solutions" data-proto="Opens the ${esc(s.name)} solution landing page (reusable template).">Solution page ${arrow}</a>
        ${ev ? `<a class="link-arrow" href="#resources" data-res-solution="${s.id}">${ev} evidence document${ev > 1 ? 's' : ''} ${arrow}</a>` : ''}
      </div>
    </div>
  </div>`; }).join('');

// Product index
let piFilter = 'all';
$('#piChips').innerHTML = [`<button class="chip" type="button" aria-pressed="true" data-f="all">All <span class="n">19</span></button>`]
  .concat(SOLUTIONS.map(s => `<button class="chip" type="button" aria-pressed="false" data-f="${s.id}">${esc(s.name)} <span class="n">${s.products.length}</span></button>`)).join('');
let n = 0;
$('#piList').innerHTML = SOLUTIONS.map(s => s.products.map(id => {
  const p = PRODUCTS[id]; n++;
  return `<li class="pi-row" data-sol="${s.id}" data-q="${esc((p.name + ' ' + p.tag + ' ' + s.name).toLowerCase())}">
    <button class="pi-btn" type="button" data-open-product="${id}" data-preview="${p.img}" data-cap="${esc(s.name)}"${p.cover ? ' data-cover' : ''}>
      <span class="pi-n mono">${pad(n)}</span>
      <span class="pi-thumb" aria-hidden="true">${imgTag(p)}</span>
      <span class="pi-txt"><span class="pi-name">${esc(p.name)}</span><span class="pi-tag">${esc(p.tag)}</span></span>
      <span class="pi-sol mono">${esc(s.name)}</span>
      ${arrow}
    </button></li>`; }).join('')).join('');

// Evidence track
$('#evTrack').innerHTML = EVIDENCE.map(e => {
  const p = PRODUCTS[e.product];
  return `<li class="ev-card"><a href="${PDF + e.file}" target="_blank" rel="noopener" data-track="download" data-title="${esc(e.title)}">
    <div class="doc">${imgTag(p)}<span class="doc__type mono">${e.type}</span></div>
    <div class="ev-body"><p class="mono">${esc(p.name)} · ${esc(solOf[e.product].name)}</p><h3>${esc(e.title)}</h3>
    ${e.quote ? `<blockquote>${esc(e.quote)}</blockquote>` : ''}
    <span class="ev-foot"><span>Open PDF</span><svg aria-hidden="true"><use href="#i-ext"/></svg></span></div>
    <span class="sr-only">(PDF, opens in new tab)</span></a></li>`; }).join('');

// Resources
const RES = EVIDENCE.map(e => ({ ...e, sol: solOf[e.product].id, url: PDF + e.file })).concat(EXTRA_RESOURCES.map(r => ({ ...r, sol: 'all' })));
const RES_TYPES = ['All', 'White paper', 'Clinical study', 'Case report', 'Brochure', 'Video', 'IFU'];
let resType = 'All', resSol = 'all';
$('#resChips').innerHTML = RES_TYPES.map((t, i) => `<button class="chip" type="button" aria-pressed="${i === 0}" data-t="${t}">${t}${t === 'All' ? '' : `<span class="n">${RES.filter(r => r.cat === t).length}</span>`}</button>`).join('');
$('#resSol').insertAdjacentHTML('beforeend', SOLUTIONS.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join(''));
$('#resGrid').innerHTML = RES.map(r => {
  const p = r.product ? PRODUCTS[r.product] : null;
  const icon = `<span class="res__icon" aria-hidden="true">${p ? imgTag(p) : '<svg style="width:28px;height:28px;color:#61d6ff"><use href="#i-doc"/></svg>'}<i>${r.cat === 'Video' ? 'VID' : 'PDF'}</i></span>`;
  const meta = `<p class="res__meta"><span>${r.type || r.cat}</span><span>${p ? esc(p.name) : 'All products'}</span></p>`;
  const q = esc(((r.title || '') + ' ' + (p ? p.name : '') + ' ' + (r.type || r.cat)).toLowerCase());
  if (r.ph) return `<li class="res res--ph" data-cat="${r.cat}" data-sol="all" data-q="${q}"><div class="res__in">${icon}<div>${meta}<h3>${esc(r.title)}</h3><span class="ph">[CLIENT TO SUPPLY FILES]</span></div></div></li>`;
  return `<li class="res" data-cat="${r.cat}" data-sol="${r.sol}" data-q="${q}"><a href="${r.url}" target="_blank" rel="noopener" ${r.cat === 'Video' ? '' : 'data-track="download"'} data-title="${esc(r.title)}">${icon}<div>${meta}<h3>${esc(r.title)}</h3><span class="res__cta">${r.cat === 'Video' ? 'Watch on surgentec.com' : 'Download PDF'}<svg aria-hidden="true"><use href="#${r.cat === 'Video' ? 'i-ext' : 'i-down'}"/></svg></span></div><span class="sr-only">(opens in new tab)</span></a></li>`;
}).join('');

/* ---------------- HEADER ---------------- */
const header = $('.site-header');
const megaBtn = $('.mainnav__btn'), mega = $('#mega-solutions'), megaLi = $('.has-mega');
let megaTimer;
const setMega = open => { megaBtn.setAttribute('aria-expanded', open); mega.hidden = !open; };
megaBtn.addEventListener('click', () => setMega(mega.hidden));
if (finePointer) {
  megaLi.addEventListener('mouseenter', () => { clearTimeout(megaTimer); setMega(true); });
  megaLi.addEventListener('mouseleave', () => { megaTimer = setTimeout(() => setMega(false), 220); });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!mega.hidden) { setMega(false); megaBtn.focus(); }
    if (!$('#drawerNav').hidden) toggleDrawer(false);
    if (!$('#protoPanel').hidden) toggleProto(false);
  }
});
document.addEventListener('click', e => { if (!mega.hidden && !megaLi.contains(e.target)) setMega(false); });
megaLi.addEventListener('focusout', e => { if (!megaLi.contains(e.relatedTarget)) setMega(false); });
$$('[data-close-mega]').forEach(a => a.addEventListener('click', () => setMega(false)));

const menuBtn = $('.menu-btn'), drawer = $('#drawerNav');
function toggleDrawer(open) {
  drawer.hidden = !open; menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuBtn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  document.body.style.overflow = open ? 'hidden' : '';
}
menuBtn.addEventListener('click', () => toggleDrawer(drawer.hidden));
drawer.addEventListener('click', e => { if (e.target.closest('a,button[data-open-product]')) toggleDrawer(false); });

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('is-hidden', y > 80);
}, { passive: true });

// Current section highlight
const navLinks = $$('.mainnav a[href^="#"]');
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['products', 'evidence', 'reimbursement', 'resources', 'about'].forEach(id => io.observe(document.getElementById(id)));

/* ---------------- HERO ---------------- */
const HERO = ['tilink-p', 'ion-c', 'hydroputty', 'ion-3d', 'tilink-insite'];
let heroI = 0, heroElapsed = 0, heroLast = 0, heroRaf = 0, heroHover = false;
const HERO_MS = 25000, CIRC = 1144;
const heroVisual = $('#heroVisual'), specimen = $('#specimen'), specImg = $('#specimenImg'), ring = $('#heroProgress');
HERO.forEach(id => { const im = new Image(); im.src = PRODUCTS[id].img; });

function showHero(i) {
  heroI = (i + HERO.length) % HERO.length;
  const p = PRODUCTS[HERO[heroI]];
  const apply = () => {
    specImg.src = p.img; specImg.alt = `${p.name} ${p.tag}`;
    $('#specIndex').textContent = `${pad(heroI + 1)} / ${pad(HERO.length)}`;
    $('#specName').textContent = p.name; $('#specTag').textContent = p.tag;
  };
  if (motion) {
    gsap.timeline()
      .to(specimen, { opacity: 0, scale: .86, rotate: -8, filter: 'blur(6px)', duration: .45, ease: 'power2.in' })
      .add(apply)
      .fromTo(specimen, { opacity: 0, scale: 1.12, rotate: 8, filter: 'blur(8px)' }, { opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)', duration: .9, ease: 'expo.out' });
    gsap.fromTo('.spec-label > *', { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: .05, duration: .6, delay: .45, ease: 'power3.out' });
  } else apply();
  heroElapsed = 0; ring.style.strokeDashoffset = CIRC;
}
function heroTick(t) {
  if (!heroHover) return;
  heroElapsed += t - heroLast; heroLast = t;
  ring.style.strokeDashoffset = CIRC * (1 - Math.min(heroElapsed / HERO_MS, 1));
  if (heroElapsed >= HERO_MS) showHero(heroI + 1);
  heroRaf = requestAnimationFrame(heroTick);
}
heroVisual.addEventListener('mouseenter', () => {
  heroHover = true; heroVisual.classList.add('is-hover');
  heroLast = performance.now(); cancelAnimationFrame(heroRaf); heroRaf = requestAnimationFrame(heroTick);
});
heroVisual.addEventListener('mouseleave', () => { heroHover = false; heroVisual.classList.remove('is-hover'); cancelAnimationFrame(heroRaf); });
$('#specNext').addEventListener('click', () => showHero(heroI + 1));
$('#specPrev').addEventListener('click', () => showHero(heroI - 1));
$('#specOpen').addEventListener('click', () => openProduct(HERO[heroI]));

// Trust marquee: duplicate list for seamless loop (hidden from AT)
const tl1 = $('.trustbar__list');
const tl2 = tl1.cloneNode(true); tl2.setAttribute('aria-hidden', 'true');
$('#trustTrack').appendChild(tl2);

/* ---------------- SOLUTIONS ---------------- */
const tabs = $$('.sol-tab'), panels = $$('.sol-panel');
const desktopSol = window.matchMedia('(min-width: 1024px)');
let solActive = 0, solST = null, goSolutionPinned = null;
function setSol(i, opts = {}) {
  if (i === solActive && !opts.force) return;
  solActive = i;
  tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
  if (!desktopSol.matches) return;
  panels.forEach((p, k) => { p.hidden = k !== i; });
  if (motion) {
    const p = panels[i];
    gsap.fromTo($('.sol-media', p), { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: .9, ease: 'expo.out' });
    gsap.fromTo($('.sol-media img', p), { scale: 1.18 }, { scale: 1.04, duration: 1.4, ease: 'expo.out' });
    gsap.fromTo($$('.sol-media__cap > *, .sol-content__desc, .sol-products li, .sol-links', p), { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: .05, duration: .7, ease: 'power3.out', delay: .1 });
  }
}
function syncSolLayout() {
  if (desktopSol.matches) panels.forEach((p, k) => { p.hidden = k !== solActive; });
  else panels.forEach(p => { p.hidden = false; });
}
syncSolLayout();
desktopSol.addEventListener('change', syncSolLayout);
function goSolution(i) {
  if (goSolutionPinned && desktopSol.matches) {
    goSolutionPinned(i);
  } else {
    setSol(i, { force: true });
    const target = desktopSol.matches ? $('#solutions') : panels[i];
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => (solST ? goSolution(i) : setSol(i)));
  t.addEventListener('keydown', e => {
    let k = null;
    if (e.key === 'ArrowRight') k = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') k = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') k = 0; if (e.key === 'End') k = tabs.length - 1;
    if (k !== null) { e.preventDefault(); setSol(k); tabs[k].focus(); }
  });
});
document.addEventListener('click', e => {
  const a = e.target.closest('[data-go-solution]');
  if (!a) return;
  e.preventDefault(); toggleDrawer(false);
  goSolution(+a.dataset.goSolution);
});

/* ---------------- PRODUCT INDEX ---------------- */
function filterProducts() {
  const q = $('#piSearch').value.trim().toLowerCase();
  let shown = 0;
  $$('.pi-row').forEach(r => {
    const ok = (piFilter === 'all' || r.dataset.sol === piFilter) && (!q || r.dataset.q.includes(q));
    r.hidden = !ok; if (ok) shown++;
  });
  $('#piCount').textContent = shown ? `Showing ${shown} of 19 products` : 'No products match your search';
}
$('#piChips').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  piFilter = c.dataset.f;
  $$('#piChips .chip').forEach(x => x.setAttribute('aria-pressed', x === c));
  filterProducts();
  if (motion) gsap.fromTo('.pi-row:not([hidden])', { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: .03, duration: .5, ease: 'power3.out' });
});
$('#piSearch').addEventListener('input', filterProducts);
filterProducts();

/* ---------------- HOVER PREVIEW ---------------- */
if (finePointer) {
  const hp = $('#hoverPreview'), hImg = $('#hoverImg'), hCap = $('#hoverCap');
  let tx = 0, ty = 0, x = 0, y = 0, on = false, raf = 0;
  const loop = () => {
    x += (tx - x) * .18; y += (ty - y) * .18;
    hp.style.transform = `translate3d(${x}px,${y}px,0)`;
    if (on || Math.abs(tx - x) > .5) raf = requestAnimationFrame(loop); else raf = 0;
  };
  document.addEventListener('mousemove', e => {
    tx = e.clientX + 28; ty = e.clientY - 120;
    if (tx + 280 > window.innerWidth) tx = e.clientX - 290;
    if (ty < 10) ty = 10;
  }, { passive: true });
  document.addEventListener('mouseover', e => {
    const el = e.target.closest('[data-preview]');
    if (!el) return;
    hImg.src = el.dataset.preview; hImg.className = el.hasAttribute('data-cover') ? 'cover' : '';
    hCap.textContent = el.dataset.cap || '';
    if (!on) { x = tx; y = ty; }
    on = true; hp.classList.add('is-on');
    if (!raf) raf = requestAnimationFrame(loop);
  });
  document.addEventListener('mouseout', e => {
    const el = e.target.closest('[data-preview]');
    if (el && !el.contains(e.relatedTarget)) { on = false; hp.classList.remove('is-on'); }
  });
  window.addEventListener('scroll', () => { if (on) { on = false; hp.classList.remove('is-on'); } }, { passive: true });
}

/* ---------------- PRODUCT DIALOG ---------------- */
const dlg = $('#pDialog');
let currentProduct = null;
function openProduct(id) {
  const p = PRODUCTS[id], s = solOf[id]; if (!p) return;
  currentProduct = id;
  setMega(false);
  $('#pdImg').src = p.img; $('#pdImg').alt = p.name; $('#pdImg').className = p.cover ? 'cover' : '';
  $('#pdSol').textContent = `Solution ${pad(s.idx + 1)} · ${s.name}${p.launch ? ' · New' : ''}`;
  $('#pdName').textContent = p.name; $('#pdTag').textContent = p.tag; $('#pdDesc').textContent = p.desc;
  $('#pdPoints').innerHTML = p.points.map(x => `<li>${esc(x)}</li>`).join('');
  const ev = EVIDENCE.filter(e => p.ev.includes(e.id));
  $('#pdEvWrap').hidden = !ev.length;
  $('#pdEv').innerHTML = ev.map(e => `<li><a href="${PDF + e.file}" target="_blank" rel="noopener" data-track="download" data-title="${esc(e.title)}"><svg aria-hidden="true"><use href="#i-doc"/></svg><span>${esc(e.title)}</span></a></li>`).join('');
  $('#pdLink').href = LIVE + p.url;
  if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  track('view_item', { item_name: p.name, item_category: s.name });
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-open-product]');
  if (b) { e.preventDefault(); openProduct(b.dataset.openProduct); }
});
$$('dialog').forEach(d => {
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
});
$('#pdInquire').addEventListener('click', () => {
  dlg.close();
  const p = PRODUCTS[currentProduct];
  $('#fType').value = 'Product information';
  const m = $('#fMsg'); if (!m.value) m.value = `Product of interest: ${p.name}\n`;
});

/* ---------------- VIDEO / PROTO / PLACEHOLDER LINKS ---------------- */
const vd = $('#vDialog');
$$('[data-video]').forEach(b => b.addEventListener('click', () => { $('#vdTitle').textContent = b.dataset.video; vd.showModal(); }));

const protoBtn = $('#protoBtn'), protoPanel = $('#protoPanel');
function toggleProto(open) { protoPanel.hidden = !open; protoBtn.setAttribute('aria-expanded', open); }
protoBtn.addEventListener('click', () => toggleProto(protoPanel.hidden));
$('#protoClose').addEventListener('click', () => { toggleProto(false); protoBtn.focus(); });
$('#phToggle').addEventListener('change', e => document.body.classList.toggle('show-ph', e.target.checked));

// Links to pages that don't exist yet in the prototype: explain instead of jumping.
const toast = document.createElement('div');
toast.className = 'proto-toast'; toast.setAttribute('role', 'status');
Object.assign(toast.style, { position: 'fixed', left: '50%', bottom: '24px', transform: 'translate(-50%,20px)', zIndex: 120, background: 'rgba(8,12,18,.96)', border: '1px solid rgba(245,197,107,.5)', color: '#e9eef5', padding: '12px 18px', borderRadius: '12px', font: '14px Inter,sans-serif', opacity: 0, transition: 'all .4s cubic-bezier(.16,1,.3,1)', maxWidth: 'calc(100% - 32px)', pointerEvents: 'none' });
document.body.appendChild(toast);
let toastT;
document.addEventListener('click', e => {
  const a = e.target.closest('[data-proto]');
  if (!a) return;
  e.preventDefault();
  toast.textContent = 'Prototype: ' + a.dataset.proto;
  toast.style.opacity = 1; toast.style.transform = 'translate(-50%,0)';
  clearTimeout(toastT); toastT = setTimeout(() => { toast.style.opacity = 0; toast.style.transform = 'translate(-50%,20px)'; }, 3200);
});

// GA4-ready download tracking
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-track="download"]');
  if (a) track('file_download', { file_name: a.dataset.title, link_url: a.href });
});

/* ---------------- RESOURCES ---------------- */
function filterRes() {
  const q = $('#resSearch').value.trim().toLowerCase();
  let shown = 0;
  $$('.res').forEach(r => {
    const ok = (resType === 'All' || r.dataset.cat === resType) && (resSol === 'all' || r.dataset.sol === resSol) && (!q || r.dataset.q.includes(q));
    r.hidden = !ok; if (ok) shown++;
  });
  $('#resCount').textContent = `${shown} resource${shown === 1 ? '' : 's'}`;
  $('#resEmpty').hidden = shown > 0;
}
$('#resChips').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  resType = c.dataset.t; $$('#resChips .chip').forEach(x => x.setAttribute('aria-pressed', x === c)); filterRes();
});
$('#resSol').addEventListener('change', e => { resSol = e.target.value; filterRes(); });
$('#resSearch').addEventListener('input', filterRes);
$('#resReset').addEventListener('click', () => {
  resType = 'All'; resSol = 'all'; $('#resSearch').value = ''; $('#resSol').value = 'all';
  $$('#resChips .chip').forEach((x, i) => x.setAttribute('aria-pressed', i === 0)); filterRes();
});
document.addEventListener('click', e => {
  const a = e.target.closest('[data-res-solution]'); if (!a) return;
  resSol = a.dataset.resSolution; $('#resSol').value = resSol; resType = 'All';
  $$('#resChips .chip').forEach((x, i) => x.setAttribute('aria-pressed', i === 0)); filterRes();
});
filterRes();

/* ---------------- LAUNCH STEPS ---------------- */
const steps = $$('.lstep'), frames = $$('#launchFrame img'), lbar = $('#launchBar');
function setStep(i) {
  steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
  frames.forEach((f, k) => f.classList.toggle('is-active', k === i));
  lbar.style.transform = `scaleX(${(i + 1) / steps.length})`;
}
const wideLaunch = window.matchMedia('(min-width: 1101px)');
const stepIO = new IntersectionObserver(ents => {
  if (!wideLaunch.matches) return;
  ents.forEach(en => { if (en.isIntersecting) setStep(+en.target.dataset.step); });
}, { rootMargin: '-45% 0px -45% 0px' });
steps.forEach(s => stepIO.observe(s));
// Narrow screens: media sits above the steps, so cycle images while visible.
let cycleT = null, launchVisible = false;
new IntersectionObserver(([en]) => { launchVisible = en.isIntersecting; }, { threshold: .3 }).observe($('#launchFrame'));
if (!reduce) cycleT = setInterval(() => {
  if (wideLaunch.matches || !launchVisible) return;
  const cur = frames.findIndex(f => f.classList.contains('is-active'));
  setStep((cur + 1) % frames.length);
}, 3500);

/* ---------------- FORM ---------------- */
const form = $('#distForm');
const rules = {
  name: v => v.trim().length >= 2 || 'Please enter your full name.',
  organization: v => v.trim().length >= 2 || 'Please enter your organization.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || (v.trim() ? 'Please enter a valid email address, e.g. name@company.com.' : 'Please enter your email address.'),
  country: v => v.trim().length >= 2 || 'Please enter your country or region.',
  inquiry: v => !!v || 'Please select an inquiry type.',
  message: v => v.trim().length >= 10 || 'Please add a short message (at least 10 characters).',
};
function validateField(el) {
  const res = rules[el.name](el.value);
  const field = el.closest('.field'), err = field.querySelector('.err');
  const ok = res === true;
  field.classList.toggle('is-invalid', !ok); field.classList.toggle('is-valid', ok);
  el.setAttribute('aria-invalid', !ok);
  err.textContent = ok ? '' : res;
  return ok;
}
$$('input,select,textarea', form).forEach(el => {
  el.addEventListener('blur', () => { if (el.value || el.dataset.touched) { el.dataset.touched = 1; validateField(el); } });
  el.addEventListener('input', () => { if (el.dataset.touched) validateField(el); });
  el.addEventListener('change', () => { el.dataset.touched = 1; validateField(el); });
});
form.addEventListener('submit', e => {
  e.preventDefault();
  const els = $$('input,select,textarea', form).filter(el => rules[el.name]);
  els.forEach(el => { el.dataset.touched = 1; });
  const bad = els.filter(el => !validateField(el));
  if (bad.length) {
    $('#formStatus').textContent = `Please correct ${bad.length} field${bad.length > 1 ? 's' : ''}.`;
    bad[0].focus(); return;
  }
  const btn = $('button[type="submit"]', form);
  btn.classList.add('is-loading'); btn.querySelector('span').textContent = 'Sending…';
  setTimeout(() => {
    track('generate_lead', { form_name: 'distributor_inquiry', inquiry_type: form.inquiry.value, country: form.country.value });
    $('#refId').textContent = 'DI-' + Date.now().toString(36).toUpperCase().slice(-6);
    $('#sName').textContent = form.name.value.trim().split(' ')[0];
    form.hidden = true;
    const s = $('#formSuccess'); s.hidden = false; s.focus();
    if (motion) gsap.from(s.children, { opacity: 0, y: 14, stagger: .07, duration: .6, ease: 'power3.out' });
    btn.classList.remove('is-loading'); btn.querySelector('span').textContent = 'Submit inquiry';
  }, 900);
});
$('#formAgain').addEventListener('click', () => {
  form.reset(); $$('.field', form).forEach(f => f.classList.remove('is-valid', 'is-invalid'));
  $$('[data-touched]', form).forEach(el => { delete el.dataset.touched; el.removeAttribute('aria-invalid'); });
  $('#formSuccess').hidden = true; form.hidden = false; $('#fName').focus();
});

/* ---------------- MOTION (GSAP + ScrollTrigger) ---------------- */
if (!motion) return;

// Hero entrance
const title = $('[data-split]');
title.innerHTML = title.textContent.trim().split(/\s+/).map(w => `<span class="w"><span>${w}</span></span>`).join(' ');
title.setAttribute('aria-label', title.textContent);
$$('.w', title).forEach(w => w.setAttribute('aria-hidden', 'true'));
const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
intro.from('.hero-card', { opacity: 0, y: 30, duration: 1.2 })
  .from('.tick', { scale: 0, opacity: 0, duration: .8, stagger: .06 }, '<.2')
  .to('.hero__title .w > span', { y: 0, duration: 1.2, stagger: .05 }, '<.1')
  .to('[data-hero-fade]', { opacity: 1, y: 0, duration: 1, stagger: .12 }, '<.4')
  .from('.hero__xray img', { scale: 1.25, opacity: 0, duration: 2 }, 0.2)
  .from('.reticle .r1', { strokeDasharray: '0 1200', duration: 1.8, stagger: .1, ease: 'power2.out' }, .5)
  .from(specimen, { opacity: 0, scale: .7, rotate: -15, duration: 1.6 }, .7)
  .from('.spec-label, .spec-ctrl', { opacity: 0, y: 16, duration: .9, stagger: .1 }, 1)
  .from('.trustbar', { opacity: 0, duration: 1 }, 1.1);
gsap.to('.specimen img', { y: -12, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
gsap.to('.reticle', { rotate: 360, duration: 120, ease: 'none', repeat: -1 });

if (finePointer) {
  heroVisual.addEventListener('mousemove', e => {
    const r = heroVisual.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
    gsap.to(specimen, { x: dx * 22, y: dy * 16, rotateY: dx * 10, duration: 1, ease: 'power3.out' });
    gsap.to('.hero__xray img', { x: dx * -14, y: dy * -10, duration: 1.4, ease: 'power3.out' });
  });
}
gsap.to('.hero__xray', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

// Generic reveals
ScrollTrigger.batch('[data-reveal]', {
  start: 'top 88%', once: true,
  onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: .08, ease: 'expo.out', overwrite: true }),
});

const mm = gsap.matchMedia();

// Solutions: pinned scroll-driven storytelling on desktop
mm.add('(min-width: 1024px) and (min-height: 760px)', () => {
  const sec = $('#sol');
  sec.classList.add('is-pinned');
  solST = ScrollTrigger.create({
    trigger: sec, start: 'top top+=96', end: () => '+=' + window.innerHeight * 0.75 * (SOLUTIONS.length - 1),
    pin: true, pinSpacing: true, anticipatePin: 1,
    snap: { snapTo: 1 / (SOLUTIONS.length - 1), duration: { min: .2, max: .6 }, ease: 'power2.inOut', delay: .05 },
    onUpdate: self => {
      const pr = self.progress * (SOLUTIONS.length - 1);
      const i = Math.min(SOLUTIONS.length - 1, Math.round(pr));
      setSol(i);
      tabs.forEach((t, k) => {
        const local = Math.max(0, Math.min(1, pr - k + .5));
        $('.sol-tab__bar i', t).style.transform = `scaleX(${k < i ? 1 : k === i ? Math.max(local, .15) : 0})`;
      });
    },
  });
  // Map solution index to scroll positions that match snap points
  goSolutionPinned = i => window.scrollTo({ top: solST.start + (solST.end - solST.start) * (i / (SOLUTIONS.length - 1)), behavior: 'smooth' });
  return () => { sec.classList.remove('is-pinned'); solST = null; goSolutionPinned = null; tabs.forEach(t => { $('.sol-tab__bar i', t).style.transform = ''; }); };
});

// Evidence: horizontal scroll on desktop
mm.add('(min-width: 1024px) and (min-height: 760px)', () => {
  const wrap = $('.ev-track-wrap'), trackEl = $('#evTrack');
  wrap.style.overflow = 'visible';
  const dist = () => Math.max(0, trackEl.scrollWidth - window.innerWidth + 32);
  const tw = gsap.to(trackEl, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      trigger: '.evidence__pin', start: 'center center', end: () => '+=' + dist(), pin: true, scrub: .6, invalidateOnRefresh: true,
      onUpdate: self => {
        $('#evBar').style.transform = `scaleX(${.11 + self.progress * .89})`;
        const idx = Math.min(EVIDENCE.length, Math.max(1, Math.round(1 + self.progress * (EVIDENCE.length - 1))));
        $('#evCount').textContent = `${pad(idx)} — ${pad(EVIDENCE.length)}`;
      },
    },
  });
  return () => { wrap.style.overflow = ''; tw.kill(); };
});
gsap.from('.ev-card', { opacity: 0, y: 40, stagger: .06, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.evidence', start: 'top 70%', once: true } });

// Timeline rail draws with scroll
gsap.fromTo('#tlFill', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '#timeline', start: 'top 85%', end: 'bottom 60%', scrub: true } });
gsap.from('.timeline__list li', { opacity: 0, y: 24, stagger: .05, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: '#timeline', start: 'top 80%', once: true } });

// Reimbursement cards + launch title
gsap.from('.launch__title', { yPercent: 30, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.launch', start: 'top 75%', once: true } });
gsap.fromTo('.launch__frame', { clipPath: 'inset(12% 12% 12% 12% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', ease: 'none', scrollTrigger: { trigger: '.launch__body', start: 'top 90%', end: 'top 35%', scrub: true } });

window.addEventListener('load', () => ScrollTrigger.refresh());
})();

