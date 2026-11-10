/* =========================================================
   SurGenTec® homepage prototype: VERSION 3 "Cinematic Precision"
   Product / evidence wording is verbatim from SurGenTec's published
   website (shared with Versions 1 and 2). Do not edit copy without
   written approval from SurGenTec.
   ========================================================= */
(() => {
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const html = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const motion = hasGsap && !reduce;
if (motion) { html.classList.add('motion'); gsap.registerPlugin(ScrollTrigger); }

window.dataLayer = window.dataLayer || [];
const track = (event, params) => window.dataLayer.push(Object.assign({ event }, params));

const LIVE = 'https://www.surgentec.com';
const PDF = LIVE + '/wp-content/uploads/';

/* ---------------- DATA ---------------- */
// Working solution titles (taken from existing product names). Replace with the names in the client sitemap.
const SOLUTIONS = [
  { id: 'si-joint', name: 'SI Joint Fusion', img: '../images/b-tilink.jpg', products: ['tilink-p', 'tilink-l', 'tilink-insite'] },
  { id: 'facet-fixation', name: 'Facet Fixation', img: '../images/b-ion-c.jpg', products: ['ion-c', 'ion-l', 'ion-3d', 'facetcore'] },
  { id: 'biologics', name: 'Biologics', img: '../images/b-vimax-fm.jpg', products: ['nanoputty', 'hydroputty', 'hydrofiber', 'vimax', 'vimax-fm', 'ossify'] },
  { id: 'graft-delivery', name: 'Graft Delivery', img: '../images/b-graftgun.jpg', products: ['graftgun', 'graftrasp'] },
  { id: 'access-aspiration', name: 'Access, Aspiration & Decompression', img: '../images/b-alara.jpg', products: ['alara', 'b-man', 'bcor', 'vantage'] },
];

const PRODUCTS = {
  'tilink-p': { name: 'TiLink-P®', tag: 'SI Joint Fusion System', img: '../images/p-tilink-p.png', url: '/tilink-p/',
    desc: 'TiLink-P® is a minimally invasive solution designed to provide superior stability, precision, and long-term fixation for patients suffering from sacroiliac joint dysfunction.',
    points: ['True Posterior Approach', 'Novel Transfixing Compression Anchor', 'Maximize Biologic Post-Packing', 'No Other Fixation Necessary'], ev: ['tilink-comp', 'tilink-series'] },
  'tilink-l': { name: 'TiLink-L®', tag: 'SI Fusion Implant', img: '../images/p-tilink-l.png', url: '/tilink/',
    desc: 'TiLink-L sacroiliac joint fusion system receives FDA 510K clearance',
    points: ['Intuitively Engineered', 'Nanotex® Surface Technology', 'Bone Ingrowth Windows', 'Harvesting Channel To Help Facilitate Fusion'], ev: [] },
  'tilink-insite': { name: 'TiLink® | INSITE™', tag: 'Sterile, Surgery-Ready SI Joint Fusion System', img: '../images/p-tilink-insite.png', url: '/tilink-insite/',
    desc: 'The INSITE™ kit includes a complete set of single-use, sterile instruments paired with an advanced 3D-printed titanium implant. This all-in-one sterile solution streamlines surgical preparation, enhances efficiency, and reduces procedural complexity.',
    points: ['Minimally Invasive In-Office Procedure', 'Single Small Incision', 'Patients Go Home the Same Day'], ev: [] },
  'ion-c': { name: 'ION-C™', tag: 'Cervical Implant System', img: '../images/p-ion-c.png', url: '/ion-c/',
    desc: 'ION-C™ is an advanced, minimally invasive solution engineered to provide supplemental posterior stabilization in cervical fusion with precision and efficiency.',
    points: ['Zero-profile implant design', 'In-situ implant depth adjustment', 'No percussion on insertion', 'Maintains neutral position', 'Minimizes risk of joint expansion'], ev: ['ionc-wp'] },
  'ion-l': { name: 'ION-L™', tag: 'Bilateral posterior placement (L3–S1)', img: '../images/p-ion-l.png', url: '/ion-l/',
    desc: 'Designed to sit within the facet region to minimize implant prominence while providing stabilization across the treated segment.',
    points: ['Bilateral posterior placement (L3–S1)', 'Zero-profile implant design', 'Controlled, non-impact insertion', 'Nanotex® surface technology'], ev: [] },
  'ion-3d': { name: 'ION-3D™', tag: 'Micro implants', img: '../images/p-ion-3d.png', url: '/ion/',
    desc: 'ION minimally invasive facet screw receives FDA 510K clearance',
    points: ['Micro Implants', 'Minimally Invasive', 'Nanotex® Surface Technology'], ev: [] },
  'facetcore': { name: 'FacetCore™', tag: '100% Cortical Bone', img: '../images/p-facetcore.png', url: '/facetcore/',
    desc: 'Cortical bone facet implant is meant to stabilize the spine by providing bilateral fixation.',
    points: ['Anti-Migration', 'Minimally Disruptive', 'Provides Stabilization To Spinal Column', '100% Cortical Bone'], ev: [] },
  'nanoputty': { name: 'OsteoFlo® NanoPutty®', tag: 'Synthetic Bone Graft Putty', img: '../images/p-nanoputty.png', url: '/graft-delivery-device/biologics/osteoflo-nanoputty/',
    desc: 'First quadphasic synthetic bone graft gets FDA clearance',
    points: ['Nano-Surface Technology', 'Quadphasic Particle Resorption Profile', 'Highly Formable and Moldable'], ev: ['nanoputty-study'] },
  'hydroputty': { name: 'OsteoFlo® HydroPutty®', tag: 'Hydrophilic synthetic bone graft', img: '../images/p-hydroputty.png', url: '/osteoflo-hydroputty/',
    desc: 'OsteoFlo® HydroPutty® is a proprietary hydrophilic synthetic bone graft utilizing a unique blend of biomaterials to optimize bone growth and provides structure closest to bone.',
    points: ['Resorbable Scaffolds', 'Composition', 'Flowability'], ev: [] },
  'hydrofiber': { name: 'OsteoFlo® HydroFiber™', tag: 'FDA cleared equivalent to autograft for spine and extremities', img: '../images/p-hydrofiber.png', url: '/osteoflo-hydrofiber/',
    desc: 'FDA cleared as equivalent to autograft across all levels of the spine, and intended for tumor removal, cysts, osteomyelitis, fractures, and trauma.',
    points: ['Stand-alone Spine Indications', 'Web Interlace Technology'], ev: ['hydrofiber-gsj', 'hydrofiber-case'] },
  'vimax': { name: 'ViMax®', tag: 'Fiber Allograft', img: '../images/p-vimax.png', url: '/vimax/',
    desc: 'Partnership with Aziyo Biologics leads to the development of a flowable, viable fiber allograft',
    points: ['Osteogenic, Osteoinductive, Osteoconductive'], ev: [] },
  'vimax-fm': { name: 'ViMax® Fiber Matrix', tag: 'Next generation of frozen fiber allograft', img: '../images/p-vimax-fm.jpg', cover: true, url: '/vimax-fiber-matrix/',
    desc: 'Next generation of frozen fiber allograft preserves the native bone matrix and maximizes its regenerative potential',
    points: ['Demineralized cortical fibers rich in growth factors', 'Superior handling and packing capabilities', 'Terminally sterilized using e-beam'], ev: [] },
  'ossify': { name: 'Ossify®', tag: 'Cortical Fibers', img: '../images/p-ossify.png', url: '/ossify/',
    desc: 'Maintains cohesive handling and flowability characteristics to provide precise graft placement without the use of a synthetic carrier.',
    points: ['100% Cortical, No Carrier', 'Flowable And Malleable When Hydrated', 'Wicks Blood, BMA, PRP'], ev: [] },
  'graftgun': { name: 'GraftGun®', tag: 'Universal Graft Delivery System (GDS®)', img: '../images/p-graftgun.png', url: '/graftgun/',
    desc: 'The GraftGun® Universal Graft Delivery System (GDS®) is intended to be used for the delivery of hydrated allograft, autograft, or synthetic bone graft material to an orthopedic surgical site, via direct visualization or minimally invasive.',
    points: ['Intuitive', 'Universal', 'Ergonomic'], ev: [] },
  'graftrasp': { name: '3D GraftRasp®', tag: 'Cannulated rasp', img: '../images/p-graftrasp.png', url: '/graft-delivery-device/3d-graftrasp/',
    desc: 'Cannulated rasp allows for bony decortication and simultaneous bone graft delivery to a desired location.',
    points: ['Ergonomic Handle', 'Cannulated Rasp', 'Disposable Rasp Teeth'], ev: ['graftrasp-wp'] },
  'alara': { name: 'ALARA® Needle', tag: 'Neuro Access Needle Kit', img: '../images/p-alara.png', url: '/alara-needle/',
    desc: 'The ALARA® Neuro Access Needle Kit is used for targeting and assisting in cannulating a pedicle.',
    points: ['Neuromonitoring', 'Accurate', 'Rigid'], ev: ['alara-wp'] },
  'b-man': { name: 'B-MAN®', tag: 'Bone Marrow Aspirate Kit', img: '../images/p-bman.jpg', cover: true, url: '/b-man/',
    desc: 'B-MAN offers single-step access while using CELLect filtration to minimize bone contaminants.',
    points: ['CELLect Filtration', 'Optimal Cell Viability', 'No Centrifuge', 'Single Step'], ev: ['bman-wp'] },
  'bcor': { name: 'BCOR™', tag: 'Bone Marrow Aspirate Kit', img: '../images/p-bcor.png', url: '/bcor/', launch: true,
    desc: 'One entry. Two samples. After aspiration, use the included drill and plunger to collect a cancellous bone core biopsy from the same access site.¹',
    points: ['CELLect High Filtration', 'Optimal Cell Viability', 'No Centrifugation', 'Single Step'], ev: [] },
  'vantage': { name: 'Vantage™', tag: 'Spinal Decompression', img: '../images/p-vantage.jpg', cover: true, url: '/vantage/',
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
const ALL = SOLUTIONS.flatMap(s => s.products);
const pad = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ico = id => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
const img = (p, alt = '', cls = '') => `<img src="${p.img}" alt="${esc(alt)}" loading="lazy" class="${cls}${p.cover ? ' cover' : ''}">`;
const TINTS = ['rgba(59,109,255,.22)', 'rgba(95,214,255,.18)', 'rgba(230,190,120,.16)', 'rgba(120,140,255,.2)', 'rgba(255,93,93,.14)'];

/* ---------------- Text splitting ---------------- */
function splitChars(el) {
  const text = el.textContent.trim().replace(/\s+/g, ' ');
  el.setAttribute('aria-label', text);
  el.innerHTML = text.split(' ').map(w => `<span class="w" aria-hidden="true">${[...w].map(c => `<span class="c">${c}</span>`).join('')}</span>`).join(' ');
  return $$('.c', el);
}
function splitLines(el) {
  const text = el.textContent.trim().replace(/\s+/g, ' ');
  el.setAttribute('aria-label', text);
  el.innerHTML = text.split(' ').map(w => `<span class="wd">${w}</span>`).join(' ');
  const lines = []; let top = null;
  $$('.wd', el).forEach(w => { if (w.offsetTop !== top) { lines.push([]); top = w.offsetTop; } lines[lines.length - 1].push(w.textContent); });
  el.innerHTML = lines.map(l => `<span class="ln" aria-hidden="true"><span>${l.join(' ')}</span></span>`).join('');
  return $$('.ln > span', el);
}

/* ---------------- Smooth scroll ---------------- */
let lenis = null;
if (motion && fine && typeof window.Lenis !== 'undefined') {
  lenis = new Lenis({ duration: 1.2, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis; // QA hook
}
const scrollToY = y => { lenis ? lenis.scrollTo(y, { duration: 1.4 }) : window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }); };
const scrollToEl = (el, off = -80) => { if (!el) return; lenis ? lenis.scrollTo(el, { offset: off, duration: 1.5 }) : el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.hasAttribute('data-proto') || a.hasAttribute('data-sol')) return;
  const id = a.getAttribute('href'); const t = id.length > 1 ? document.querySelector(id) : null;
  if (id === '#top') { e.preventDefault(); closeMenu(); scrollToY(0); return; }
  if (!t) return;
  e.preventDefault(); closeMenu(); scrollToEl(t, id === '#solutions' ? 0 : -40);
});

/* ---------------- RENDER ---------------- */
$('#menuSol').innerHTML = SOLUTIONS.map((s, i) => `<li><a href="#solutions" data-sol="${i}">${esc(s.name)}<small>${pad(s.products.length)}</small></a></li>`).join('');
$('#ftSol').innerHTML = SOLUTIONS.map((s, i) => `<li><a href="#solutions" data-sol="${i}">${esc(s.name)}</a></li>`).join('');

// Theatre
$('#solRail').innerHTML = SOLUTIONS.map((s, i) => `<li${i ? '' : ' class="is-on"'}><button type="button" data-sol="${i}" aria-label="${esc(s.name)}"><i></i><span>${pad(i + 1)} ${esc(s.name)}</span></button></li>`).join('');
$('#solScenes').innerHTML = SOLUTIONS.map((s, i) => {
  const ev = s.products.flatMap(p => PRODUCTS[p].ev).length;
  return `<article class="scene${i ? '' : ' is-on'}" id="scene-${s.id}" aria-labelledby="sn-${s.id}">
    <div class="scene__glow" aria-hidden="true" style="background:radial-gradient(45% 55% at 72% 50%,${TINTS[i]},transparent 70%)"></div>
    <div class="scene__txt">
      <p class="scene__num">Solution ${pad(i + 1)} / ${pad(SOLUTIONS.length)} · ${s.products.length} products</p>
      <h3 class="scene__name" id="sn-${s.id}">${esc(s.name)}</h3>
      <span class="scene__wt">Working title</span>
      <p class="scene__desc"><span class="ph">[CLIENT-APPROVED CONTENT REQUIRED] Solution overview for ${esc(s.name)}.</span></p>
      <ul class="scene__list">${s.products.map((id, k) => `<li><button type="button" data-open-product="${id}" data-cursor="View"><span class="mono">${pad(k + 1)}</span><span>${esc(PRODUCTS[id].name)}</span><small>${esc(PRODUCTS[id].tag)}</small></button></li>`).join('')}</ul>
      <div class="scene__links">
        <a class="ulink" href="#solutions" data-proto="Opens the ${esc(s.name)} solution landing page (reusable template).">Solution page ${ico('i-arrow')}</a>
        ${ev ? `<a class="ulink" href="#library" data-lib-sol="${s.id}">${ev} evidence document${ev > 1 ? 's' : ''} ${ico('i-arrow')}</a>` : ''}
      </div>
    </div>
    <div class="scene__stage">
      <div class="scene__frame"><img src="${s.img.replace('/b-', '/s-')}" alt="" loading="lazy"><span class="scene__url mono">/solutions/${s.id}/</span></div>
      <div class="scene__prods" aria-hidden="true">${s.products.map(id => `<span>${img(PRODUCTS[id])}</span>`).join('')}</div>
    </div>
  </article>`; }).join('');

// Specimen wall
let n = 0;
$('#wallTrack').innerHTML = SOLUTIONS.map((s, i) => `<li class="plate plate--div" id="wall-${s.id}" data-solidx="${i}"><div class="divc"><span class="mono">Solution ${pad(i + 1)}</span><strong>${esc(s.name)}</strong><span class="mono">${pad(s.products.length)} products</span></div></li>` +
  s.products.map(id => { n++; const p = PRODUCTS[id]; return `<li class="plate" data-solidx="${i}" data-n="${n}"><button type="button" data-open-product="${id}" data-cursor="Open">
    <span class="plate__top mono"><span>${pad(n)}</span><span>${p.launch ? 'New' : esc(s.name)}</span></span>
    <span class="plate__img">${img(p, '', 'pimg')}</span>
    <span class="plate__name">${esc(p.name)}</span><span class="plate__tag">${esc(p.tag)}</span>
    <span class="plate__go">${ico('i-arrow')}</span></button></li>`; }).join('')).join('');
$('#wallJump').innerHTML = SOLUTIONS.map((s, i) => `<button type="button" aria-pressed="${i === 0}" data-jump="${i}">${esc(s.name)}</button>`).join('');

// Evidence
$('#evIndex').innerHTML = EVIDENCE.map((e, i) => `<li${i ? '' : ' class="is-on"'}><a href="${PDF + e.file}" target="_blank" rel="noopener" data-ev="${i}" data-track="download" data-title="${esc(e.title)}"><span class="mono">${pad(i + 1)}</span><span>${esc(PRODUCTS[e.product].name)}</span><small>${e.type}</small></a></li>`).join('');
$('#evDeck').innerHTML = EVIDENCE.map((e, i) => { const p = PRODUCTS[e.product]; return `<a class="doc" href="${PDF + e.file}" target="_blank" rel="noopener" data-track="download" data-title="${esc(e.title)}" data-cursor="Open PDF" style="z-index:${EVIDENCE.length - i}">
  <div class="doc__in"><p class="doc__type"><span>${e.type} · ${esc(p.name)}</span><span>${pad(i + 1)} / ${pad(EVIDENCE.length)}</span></p>
  <div><h3>${esc(e.title)}</h3>${e.quote ? `<blockquote>${esc(e.quote)}</blockquote>` : ''}</div>${img(p, '', 'doc__img')}
  <div class="doc__lines" aria-hidden="true"></div>
  <p class="doc__foot"><span>Open PDF · ${esc(solOf[e.product].name)}</span><span>${ico('i-ext')}</span></p></div>
  <span class="sr-only">(opens in new tab)</span></a>`; }).join('');

// Library
const RES = EVIDENCE.map(e => ({ ...e, sol: solOf[e.product].id, url: PDF + e.file })).concat(EXTRA_RESOURCES.map(r => ({ ...r, sol: 'all' })));
const TYPES = ['All', 'White paper', 'Clinical study', 'Case report', 'Brochure', 'Video', 'IFU'];
let libT = 'All', libS = 'all';
$('#libTabs').innerHTML = TYPES.map((t, i) => `<button type="button" aria-pressed="${i === 0}" data-t="${t}">${t}<small>${t === 'All' ? RES.length : RES.filter(r => r.cat === t).length}</small></button>`).join('');
$('#libSol').insertAdjacentHTML('beforeend', SOLUTIONS.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join(''));
$('#libList').innerHTML = RES.map(r => {
  const p = r.product ? PRODUCTS[r.product] : null;
  const thumb = `<span class="row__thumb">${p ? img(p) : ico(r.cat === 'Video' ? 'i-play' : 'i-doc')}</span>`;
  const q = esc(((r.title || '') + ' ' + (p ? p.name : '') + ' ' + (r.type || r.cat)).toLowerCase());
  const cols = `${thumb}<span class="row__type">${r.type || r.cat}</span><span class="row__title">${esc(r.title)}${r.ph ? ' <span class="ph">[CLIENT TO SUPPLY FILES]</span>' : ''}</span><span class="row__prod">${p ? esc(p.name) + ' · ' + esc(solOf[r.product].name) : 'All products'}</span>`;
  if (r.ph) return `<li class="row row--ph" data-cat="${r.cat}" data-sol="all" data-q="${q}"><div class="row__in">${cols}<span></span></div></li>`;
  return `<li class="row" data-cat="${r.cat}" data-sol="${r.sol}" data-q="${q}"><a href="${r.url}" target="_blank" rel="noopener" ${r.cat === 'Video' ? '' : 'data-track="download"'} data-title="${esc(r.title)}">${cols}<span class="row__go">${ico(r.cat === 'Video' ? 'i-ext' : 'i-down')}</span><span class="sr-only">(opens in new tab)</span></a></li>`;
}).join('');

/* ---------------- HEADER, THEME, MENU ---------------- */
const hd = $('.hd');
const themed = $$('[data-theme]');
let curTheme = 'dark';
const whereN = $('#whereN'), whereL = $('#whereL');
function setSection(el) {
  const t = el.dataset.theme;
  if (t !== curTheme) { document.body.classList.remove('t-' + curTheme); document.body.classList.add('t-' + t); curTheme = t; }
  if (whereL.textContent !== el.dataset.label) {
    if (motion) gsap.to(whereL, { yPercent: -100, duration: .25, ease: 'power2.in', onComplete: () => { whereL.textContent = el.dataset.label; whereN.textContent = el.dataset.n; gsap.fromTo(whereL, { yPercent: 100 }, { yPercent: 0, duration: .45, ease: 'expo.out' }); } });
    else { whereL.textContent = el.dataset.label; whereN.textContent = el.dataset.n; }
  }
  $$('.hd__quick a').forEach(a => a.classList.toggle('is-on', el.id && a.getAttribute('href') === '#' + el.id));
}
const tio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) setSection(en.target); }), { rootMargin: '-50% 0px -50% 0px' });
themed.forEach(s => tio.observe(s));

let lastY = 0;
const onScroll = y => { hd.classList.toggle('is-up', y > 400 && y > lastY + 2 && $('#menu').hidden); if (y < lastY - 2 || y < 400) hd.classList.remove('is-up'); lastY = y; };
if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll)); else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });

const menu = $('#menu'), menuBtn = $('.hd__menu');
function openMenu() {
  menu.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); $('.hd__menu-t').textContent = 'Close';
  lenis && lenis.stop(); document.body.style.overflow = 'hidden';
  if (motion) {
    gsap.fromTo('.menu__bg', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .8, ease: 'expo.inOut' });
    gsap.fromTo('.menu__main a', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .045, duration: .9, ease: 'expo.out', delay: .35 });
    gsap.fromTo('.menu__side > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: .03, duration: .7, ease: 'power3.out', delay: .5 });
  }
  $('.menu__main a').focus({ preventScroll: true });
}
function closeMenu() {
  if (menu.hidden) return;
  menuBtn.setAttribute('aria-expanded', 'false'); $('.hd__menu-t').textContent = 'Menu';
  lenis && lenis.start(); document.body.style.overflow = '';
  if (motion) gsap.to('.menu__bg', { clipPath: 'inset(100% 0 0 0)', duration: .6, ease: 'expo.inOut', onComplete: () => { menu.hidden = true; } });
  else menu.hidden = true;
}
menuBtn.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (!menu.hidden) { closeMenu(); menuBtn.focus(); } if (!$('#notes').hidden) toggleNotes(false); }
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !$('#spec').open) { e.preventDefault(); scrollToEl($('#library')); setTimeout(() => $('#libQ').focus({ preventScroll: true }), 700); }
});

/* ---------------- SOLUTIONS (shared nav) ---------------- */
let solST = null;
function goSolution(i) {
  closeMenu();
  if (solST) scrollToY(solST.start + (solST.end - solST.start) * (i / (SOLUTIONS.length - 1)) + 1);
  else scrollToEl($$('.scene')[i], -90);
}
document.addEventListener('click', e => { const b = e.target.closest('[data-sol]'); if (!b) return; e.preventDefault(); goSolution(+b.dataset.sol); });

/* ---------------- WALL jump (shared) ---------------- */
let wallST = null, wallTween = null;
const jumpBtns = $$('#wallJump button');
const setJump = i => jumpBtns.forEach((b, k) => b.setAttribute('aria-pressed', k === i));
$('#wallJump').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const i = +b.dataset.jump, target = $(`#wall-${SOLUTIONS[i].id}`);
  setJump(i);
  if (wallST) {
    const max = $('#wallTrack').scrollWidth - window.innerWidth;
    const p = Math.min(1, Math.max(0, (target.offsetLeft - parseFloat(getComputedStyle($('#wallTrack')).paddingLeft)) / max));
    scrollToY(wallST.start + (wallST.end - wallST.start) * p + 1);
  } else {
    $('#wallViewport').scrollTo({ left: target.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
  }
});
const plates = $$('.plate');
function wallProgress(px) {
  // which plate is at the left edge
  let idx = 0; plates.forEach((p, k) => { if (p.offsetLeft - 60 <= px) idx = k; });
  const pl = plates[idx]; setJump(+pl.dataset.solidx);
  const realN = plates.slice(0, idx + 1).filter(p => p.dataset.n).length || 1;
  $('#wallCount').textContent = `${pad(realN)} / 19`;
}
$('#wallViewport').addEventListener('scroll', () => {
  if (wallST) return;
  const v = $('#wallViewport'); wallProgress(v.scrollLeft);
  $('#wallBar').style.transform = `scaleX(${Math.max(.05, v.scrollLeft / (v.scrollWidth - v.clientWidth))})`;
}, { passive: true });

/* ---------------- SPECIMEN VIEWER ---------------- */
const spec = $('#spec');
let spI = 0;
function fillSpec(i, dir = 0) {
  spI = (i + ALL.length) % ALL.length;
  const id = ALL[spI], p = PRODUCTS[id], s = solOf[id];
  const apply = () => {
    $('#spImg').src = p.img; $('#spImg').alt = p.name; $('#spImg').className = p.cover ? 'cover' : '';
    $('#spIdx').textContent = `${pad(spI + 1)} / ${pad(ALL.length)}`;
    $('#spSol').textContent = `Solution ${pad(s.idx + 1)} · ${s.name}${p.launch ? ' · New' : ''}`;
    $('#spName').textContent = p.name; $('#spTag').textContent = p.tag; $('#spDesc').textContent = p.desc;
    $('#spPts').innerHTML = p.points.map(x => `<li>${esc(x)}</li>`).join('');
    const ev = EVIDENCE.filter(e => p.ev.includes(e.id));
    $('#spEvWrap').hidden = !ev.length;
    $('#spEv').innerHTML = ev.map(e => `<li><a href="${PDF + e.file}" target="_blank" rel="noopener" data-track="download" data-title="${esc(e.title)}">${ico('i-doc')}<span>${esc(e.title)}</span></a></li>`).join('');
    $('#spLink').href = LIVE + p.url;
  };
  if (motion && dir) {
    gsap.timeline()
      .to('#spImg', { xPercent: -40 * dir, opacity: 0, rotate: -10 * dir, duration: .35, ease: 'power2.in' })
      .to('.spec__body > *', { opacity: 0, y: -10, duration: .25, stagger: .02 }, 0)
      .add(apply)
      .fromTo('#spImg', { xPercent: 40 * dir, rotate: 10 * dir }, { xPercent: 0, opacity: 1, rotate: 0, duration: .9, ease: 'expo.out' })
      .fromTo('.spec__body > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, stagger: .04, ease: 'power3.out' }, '<');
  } else apply();
  track('view_item', { item_name: p.name, item_category: s.name });
}
function openProduct(id) {
  closeMenu(); fillSpec(ALL.indexOf(id));
  spec.showModal(); lenis && lenis.stop();
  $('.spec__body').scrollTop = 0;
  if (motion) {
    gsap.fromTo('#spImg', { scale: .7, rotate: -20, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: .2 });
    gsap.fromTo('.spec__body > *', { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: .05, duration: .8, ease: 'power3.out', delay: .3 });
  }
}
document.addEventListener('click', e => { const b = e.target.closest('[data-open-product]'); if (b) { e.preventDefault(); openProduct(b.dataset.openProduct); } });
$('#spNext').addEventListener('click', () => fillSpec(spI + 1, 1));
$('#spPrev').addEventListener('click', () => fillSpec(spI - 1, -1));
spec.addEventListener('keydown', e => { if (e.key === 'ArrowRight') fillSpec(spI + 1, 1); if (e.key === 'ArrowLeft') fillSpec(spI - 1, -1); });
$$('dialog').forEach(d => {
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  d.addEventListener('close', () => { lenis && lenis.start(); });
});
$('#spInq').addEventListener('click', e => {
  e.preventDefault(); spec.close();
  $('input[name="inquiry"][value="Product information"]').checked = true;
  const m = $('#fMsg'); if (!m.value) m.value = `Product of interest: ${PRODUCTS[ALL[spI]].name}\n`;
  scrollToEl($('#distributors'), -40);
});
$$('[data-video]').forEach(b => b.addEventListener('click', () => { $('#vidTitle').textContent = b.dataset.video; $('#vid').showModal(); lenis && lenis.stop(); }));

/* ---------------- PANELS ---------------- */
const pnls = $$('.pnl');
const openPnl = p => pnls.forEach(x => x.classList.toggle('is-open', x === p));
pnls.forEach(p => {
  p.addEventListener('click', () => openPnl(p));
  p.addEventListener('focus', () => openPnl(p));
  if (fine) p.addEventListener('mouseenter', () => openPnl(p));
  p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPnl(p); } });
});

/* ---------------- LIBRARY ---------------- */
function filterLib() {
  const q = $('#libQ').value.trim().toLowerCase(); let k = 0;
  $$('.row').forEach(r => { const ok = (libT === 'All' || r.dataset.cat === libT) && (libS === 'all' || r.dataset.sol === libS) && (!q || r.dataset.q.includes(q)); r.hidden = !ok; if (ok) k++; });
  $('#libCount').textContent = `${k} result${k === 1 ? '' : 's'}${q ? ` for “${q}”` : ''}`;
  $('#libEmpty').hidden = k > 0;
}
const setLibT = t => { libT = t; $$('#libTabs button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === t)); };
$('#libTabs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; setLibT(b.dataset.t); filterLib(); });
$('#libSol').addEventListener('change', e => { libS = e.target.value; filterLib(); });
$('#libQ').addEventListener('input', filterLib);
$('#libReset').addEventListener('click', () => { setLibT('All'); libS = 'all'; $('#libSol').value = 'all'; $('#libQ').value = ''; filterLib(); });
document.addEventListener('click', e => { const a = e.target.closest('[data-lib-sol]'); if (!a) return; setLibT('All'); libS = a.dataset.libSol; $('#libSol').value = libS; $('#libQ').value = ''; filterLib(); });
filterLib();

/* ---------------- MISC ---------------- */
const notesBtn = $('#notesBtn'), notes = $('#notes');
function toggleNotes(o) { notes.hidden = !o; notesBtn.setAttribute('aria-expanded', o); }
notesBtn.addEventListener('click', () => toggleNotes(notes.hidden));
$('#notesX').addEventListener('click', () => { toggleNotes(false); notesBtn.focus(); });
$('#phTog').addEventListener('change', e => document.body.classList.toggle('show-ph', e.target.checked));
const toast = document.createElement('div'); toast.setAttribute('role', 'status');
Object.assign(toast.style, { position: 'fixed', left: '50%', bottom: '24px', transform: 'translate(-50%,20px)', zIndex: 320, background: '#edeae4', color: '#07090d', padding: '12px 18px', borderRadius: '12px', font: '14px Archivo,sans-serif', opacity: 0, transition: 'all .45s cubic-bezier(.16,1,.3,1)', maxWidth: 'calc(100% - 32px)', pointerEvents: 'none' });
document.body.appendChild(toast);
let tt;
document.addEventListener('click', e => {
  const a = e.target.closest('[data-proto]'); if (!a) return; e.preventDefault();
  toast.textContent = 'Prototype: ' + a.dataset.proto; toast.style.opacity = 1; toast.style.transform = 'translate(-50%,0)';
  clearTimeout(tt); tt = setTimeout(() => { toast.style.opacity = 0; toast.style.transform = 'translate(-50%,20px)'; }, 3200);
});
document.addEventListener('click', e => { if (e.defaultPrevented) return; const a = e.target.closest('a[data-track="download"]'); if (a) track('file_download', { file_name: a.dataset.title, link_url: a.href }); });

/* ---------------- SENTENCE FORM ---------------- */
const form = $('#sayForm');
const rules = {
  name: v => v.trim().length >= 2 || 'Please enter your full name.',
  organization: v => v.trim().length >= 2 || 'Please enter your organization.',
  country: v => v.trim().length >= 2 || 'Please enter your country or region.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || (v.trim() ? 'Please enter a valid email address, e.g. name@company.com.' : 'Please enter your email address.'),
  message: v => v.trim().length >= 10 || 'Please add a short message (at least 10 characters).',
};
const errId = { name: 'eName', organization: 'eOrg', country: 'eCountry', email: 'eEmail', message: 'eMsg' };
function check(el) { const r = rules[el.name](el.value), ok = r === true; el.setAttribute('aria-invalid', !ok); $('#' + errId[el.name]).textContent = ok ? '' : r; return ok; }
function checkType() { const ok = !!form.querySelector('input[name="inquiry"]:checked'); $('.say__chips').classList.toggle('bad', !ok); $('#eType').textContent = ok ? '' : 'Please select what you are getting in touch about.'; return ok; }
$$('input:not([type=radio]), textarea', form).forEach(el => {
  el.addEventListener('blur', () => { if (el.value) { el.dataset.t = 1; check(el); } });
  el.addEventListener('input', () => { if (el.dataset.t) check(el); });
});
$$('input[name="inquiry"]', form).forEach(r => r.addEventListener('change', checkType));
form.addEventListener('submit', e => {
  e.preventDefault();
  const els = $$('input:not([type=radio]), textarea', form);
  const bad = els.filter(el => { el.dataset.t = 1; return !check(el); });
  const tOk = checkType();
  if (bad.length || !tOk) {
    $('#sayStatus').textContent = `Please complete ${bad.length + (tOk ? 0 : 1)} highlighted field${bad.length + (tOk ? 0 : 1) > 1 ? 's' : ''}.`;
    (bad[0] || $('input[name="inquiry"]', form)).focus(); return;
  }
  const btn = $('button[type="submit"]', form); btn.disabled = true; $('.btn__t', btn).textContent = 'Sending…';
  setTimeout(() => {
    track('generate_lead', { form_name: 'distributor_inquiry', inquiry_type: form.querySelector('input[name="inquiry"]:checked').value, country: form.country.value });
    $('#sayRef').textContent = 'DI-' + Date.now().toString(36).toUpperCase().slice(-6);
    $('#sayName').textContent = form.name.value.trim().split(' ')[0];
    form.hidden = true; const d = $('#sayDone'); d.hidden = false; d.focus();
    if (motion) gsap.from(d.children, { opacity: 0, y: 24, stagger: .08, duration: .8, ease: 'expo.out' });
    btn.disabled = false; $('.btn__t', btn).textContent = 'Send inquiry';
  }, 900);
});
$('#sayAgain').addEventListener('click', () => {
  form.reset(); $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid')); $$('[data-t]', form).forEach(el => delete el.dataset.t);
  $('.say__chips').classList.remove('bad'); $$('.err', form).forEach(e => { e.textContent = ''; });
  $('#sayDone').hidden = true; form.hidden = false; $('#fName').focus();
});

/* ---------------- NETWORK CANVAS ---------------- */
(function net() {
  const c = $('#net'), ctx = c.getContext('2d'); let w, h, pts = [], on = false, raf;
  const size = () => { const r = c.getBoundingClientRect(); w = c.width = r.width * devicePixelRatio; h = c.height = r.height * devicePixelRatio; const N = Math.round(Math.min(90, r.width / 18)); pts = Array.from({ length: N }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25 * devicePixelRatio, vy: (Math.random() - .5) * .25 * devicePixelRatio })); };
  const draw = () => {
    ctx.clearRect(0, 0, w, h); const D = 150 * devicePixelRatio;
    for (const p of pts) { if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1; } ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.4 * devicePixelRatio, 0, 7); ctx.fill(); }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y); if (d < D) { ctx.strokeStyle = `rgba(255,255,255,${(1 - d / D) * .35})`; ctx.lineWidth = devicePixelRatio * .7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
    if (on && !reduce) raf = requestAnimationFrame(draw);
  };
  size(); draw(); window.addEventListener('resize', () => { size(); draw(); });
  new IntersectionObserver(([en]) => { on = en.isIntersecting; cancelAnimationFrame(raf); if (on) draw(); }).observe(c);
})();

/* ---------------- CURSOR + MAGNETIC ---------------- */
if (fine && motion) {
  html.classList.add('has-cursor');
  const cur = $('#cursor'), lab = $('#cursorL');
  const xTo = gsap.quickTo(cur, 'x', { duration: .45, ease: 'power3' }), yTo = gsap.quickTo(cur, 'y', { duration: .45, ease: 'power3' });
  window.addEventListener('mousemove', e => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
  document.addEventListener('mouseover', e => { const t = e.target.closest('[data-cursor]'); cur.classList.toggle('is-big', !!t); lab.textContent = t ? t.dataset.cursor : ''; });
  $$('.mag').forEach(m => {
    const mx = gsap.quickTo(m, 'x', { duration: .6, ease: 'elastic.out(1,.4)' }), my = gsap.quickTo(m, 'y', { duration: .6, ease: 'elastic.out(1,.4)' });
    m.addEventListener('mousemove', e => { const r = m.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * .25); my((e.clientY - r.top - r.height / 2) * .3); });
    m.addEventListener('mouseleave', () => { mx(0); my(0); });
  });
}

/* =========================================================
   MOTION
   ========================================================= */
// Heading splits (also give clean aria-labels)
const splitHeads = motion ? $$('[data-split]').map(h => ({ h, chars: splitChars(h) })) : [];
const sceneChars = motion ? $$('.scene__name').map(splitChars) : [];
const heroLines = motion ? $$('.hl').map(splitChars) : [];
if (motion) $('#heroTitle').setAttribute('aria-label', 'Revolutionizing spine and orthopedic surgeries with cutting-edge technology');

if (!motion) {
  // Static launch: cycle core images while visible
  const imgs = $$('.core__img img'); let k = 0;
  $$('.call').forEach(c => c.classList.add('is-on'));
  if (!reduce) setInterval(() => { imgs[k].classList.remove('is-on'); k = (k + 1) % imgs.length; imgs[k].classList.add('is-on'); }, 3500);
  return;
}

/* ---- Loader → hero intro ---- */
const loaderN = $('#loaderN'), loaderBar = $('#loaderBar');
const ld = { v: 0 };
const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
const cinemaMQ = '(min-width: 1024px) and (min-height: 700px)';
const isCinema = () => window.matchMedia(cinemaMQ).matches;
intro.fromTo('#heroMedia', { clipPath: 'inset(50% 50% 50% 50% round 220px)' }, { clipPath: isCinema() ? 'inset(20% 7% 20% 60% round 240px)' : 'inset(0% 0% 0% 0% round 0px)', duration: 1.8, ease: 'expo.inOut' })
  .from(heroLines.flat(), { yPercent: 120, rotate: 6, opacity: 0, stagger: .018, duration: 1.3 }, .6)
  .from('#heroMedia img', { scale: 1.4, duration: 2.2 }, 0)
  .from('.hero__meta span, .hero__scroll', { opacity: 0, y: 12, stagger: .08, duration: 1 }, 1.1)
  .fromTo('.hd', { yPercent: -100, opacity: 0 }, { yPercent: 0, y: 0, opacity: 1, duration: 1.1, clearProps: 'transform,opacity' }, 1)
  ;
if (!isCinema()) intro.from('.hero__end > *, .fl', { opacity: 0, y: 30, stagger: .1, duration: 1 }, 1.2);
lenis && lenis.stop();
gsap.to(ld, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => { loaderN.textContent = String(Math.round(ld.v)).padStart(3, '0'); loaderBar.style.transform = `scaleX(${ld.v / 100})`; },
  onComplete: () => {
    gsap.timeline()
      .to('.loader__mark, .loader__n, .loader__line', { opacity: 0, y: -16, duration: .4, stagger: .05 })
      .to('#loader', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '-=.1')
      .add(() => { $('#loader').remove(); lenis && lenis.start(); }, '-=.2')
      .add(() => intro.play(), '-=.75');
  } });

/* ---- Cinema (desktop pinned storytelling) ---- */
const mm = gsap.matchMedia();
mm.add(cinemaMQ, () => {
  html.classList.add('cinema');
  const N = SOLUTIONS.length;

  // HERO: aperture opens, type parts, products fly
  const heroTl = gsap.timeline({ scrollTrigger: { trigger: '.hero__pin', start: 'top top', end: '+=160%', pin: true, scrub: 1 } });
  heroTl.to('#heroMedia', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 1 }, 0)
    .to('#heroMedia img', { scale: 1.08, duration: 1 }, 0)
    .to('.hl--1', { xPercent: -60, opacity: 0, duration: .8, ease: 'power2.in' }, .05)
    .to('.hl--2', { xPercent: 60, opacity: 0, duration: .8, ease: 'power2.in' }, .05)
    .to('.hl--3', { xPercent: -40, opacity: 0, duration: .8, ease: 'power2.in' }, .1)
    .to('.hl--4', { xPercent: 40, opacity: 0, duration: .8, ease: 'power2.in' }, .1)
    .to('.hero__meta, .hero__scroll', { opacity: 0, duration: .3 }, 0)
    .to('.hero__shade', { opacity: 1, duration: .5 }, .5)
    .fromTo('.fl--a', { opacity: 0, y: 300, scale: .6 }, { opacity: 1, y: -40, scale: 1, duration: 1 }, .3)
    .fromTo('.fl--b', { opacity: 0, y: 500 }, { opacity: .8, y: -120, duration: 1 }, .35)
    .fromTo('.fl--c', { opacity: 0, y: 400, rotate: -20 }, { opacity: .9, y: -60, rotate: 0, duration: 1 }, .4)
    .fromTo('.fl--d', { opacity: 0, y: 700 }, { opacity: .6, y: -200, duration: 1 }, .45)
    .to('.hero__end', { autoAlpha: 1, duration: .01 }, .8)
    .from('.hero__end > *', { y: 50, opacity: 0, stagger: .08, duration: .4 }, .8);

  // SOLUTIONS THEATRE
  const scenes = $$('.scene'), railLis = $$('#solRail li');
  const parts = scenes.map((sc, i) => ({ sc, chars: sceneChars[i], txt: $$('.scene__num, .scene__wt, .scene__desc, .scene__list li, .scene__links', sc), frame: $('.scene__frame', sc), fimg: $('.scene__frame img', sc), prods: $$('.scene__prods span', sc), glow: $('.scene__glow', sc) }));
  parts.slice(1).forEach(b => { gsap.set(b.chars, { yPercent: 115 }); gsap.set(b.txt, { opacity: 0 }); gsap.set(b.frame, { clipPath: 'inset(100% 0% 0% 0% round 28px)' }); gsap.set(b.prods, { opacity: 0 }); gsap.set(b.glow, { opacity: 0 }); });
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  for (let i = 0; i < N - 1; i++) {
    const a = parts[i], b = parts[i + 1], at = i;
    tl.to(a.chars, { yPercent: -115, stagger: .006, duration: .35 }, at)
      .to(a.txt, { opacity: 0, y: -24, stagger: .015, duration: .3 }, at)
      .to(a.frame, { clipPath: 'inset(0% 0% 100% 0% round 28px)', duration: .45 }, at)
      .to(a.prods, { y: -160, opacity: 0, stagger: .03, duration: .35 }, at)
      .to(a.glow, { opacity: 0, duration: .4 }, at)
      .set(b.sc, { visibility: 'visible' }, at + .3)
      .fromTo(b.chars, { yPercent: 115 }, { yPercent: 0, stagger: .006, duration: .4, immediateRender: false }, at + .4)
      .fromTo(b.txt, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: .015, duration: .35, immediateRender: false }, at + .45)
      .fromTo(b.frame, { clipPath: 'inset(100% 0% 0% 0% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: .5, immediateRender: false }, at + .35)
      .fromTo(b.fimg, { scale: 1.35 }, { scale: 1, duration: .6, immediateRender: false }, at + .35)
      .fromTo(b.prods, { y: 220, opacity: 0, scale: .7 }, { y: 0, opacity: 1, scale: 1, stagger: .04, duration: .45, immediateRender: false }, at + .45)
      .fromTo(b.glow, { opacity: 0 }, { opacity: 1, duration: .4, immediateRender: false }, at + .5)
      .set(a.sc, { visibility: 'hidden' }, at + .5)
      .to({}, { duration: .1 }, at + .9);
  }
  // Idle drift on the first scene so the pin never feels static
  gsap.fromTo(parts[0].fimg, { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.sol', start: 'top bottom', end: 'top top', scrub: true } });
  solST = ScrollTrigger.create({
    trigger: '#theatre', start: 'top top', end: () => '+=' + window.innerHeight * 1.1 * (N - 1), pin: true, scrub: 1, animation: tl,
    snap: { snapTo: 1 / (N - 1), duration: { min: .3, max: .9 }, delay: .08, ease: 'power2.inOut' },
    onUpdate: s => { const i = Math.round(s.progress * (N - 1)); railLis.forEach((l, k) => l.classList.toggle('is-on', k === i)); },
  });

  // WALL: horizontal specimen gallery
  const trackEl = $('#wallTrack');
  const dist = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);
  wallTween = gsap.to(trackEl, { x: () => -dist(), ease: 'none' });
  const skewTo = gsap.quickTo('.plate', 'skewX', { duration: .5, ease: 'power3' });
  wallST = ScrollTrigger.create({
    trigger: '.wall__pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .8, animation: wallTween, invalidateOnRefresh: true,
    onUpdate: s => {
      $('#wallBar').style.transform = `scaleX(${Math.max(.05, s.progress)})`;
      wallProgress(s.progress * dist());
      skewTo(gsap.utils.clamp(-6, 6, s.getVelocity() / -400));
    },
  });
  $$('.plate .pimg').forEach(im => gsap.fromTo(im, { rotate: -14, scale: .85 }, { rotate: 10, scale: 1, ease: 'none', scrollTrigger: { trigger: im.closest('.plate'), containerAnimation: wallTween, start: 'left right', end: 'right left', scrub: true } }));
  $$('.plate--div .divc').forEach(d => gsap.from(d, { clipPath: 'inset(0 0 0 100% round 28px)', ease: 'none', scrollTrigger: { trigger: d, containerAnimation: wallTween, start: 'left 95%', end: 'left 60%', scrub: true } }));

  // LAUNCH: exploded view
  const paths = $$('.explode__lines path'), calls = $$('.call'), cimgs = $$('.core__img img');
  paths.forEach(p => { p.setAttribute('pathLength', '1'); gsap.set(p, { strokeDasharray: 1, strokeDashoffset: 1 }); });
  let lastStep = -1;
  const ltl = gsap.timeline();
  ltl.fromTo('.core__img', { scale: .6, rotate: -30 }, { scale: 1, rotate: 0, duration: 1, ease: 'power2.out' }, 0)
    .fromTo('.core__ring', { rotate: 0, scale: .8, opacity: 0 }, { rotate: 180, scale: 1, opacity: 1, duration: 5, ease: 'none' }, 0)
    .from('.launch__title span', { yPercent: 40, opacity: 0, duration: .8 }, 0);
  paths.forEach((p, k) => ltl.to(p, { strokeDashoffset: 0, duration: .8, ease: 'power1.inOut' }, 1 + k));
  ScrollTrigger.create({
    trigger: '.launch__pin', start: 'top top', end: '+=320%', pin: true, scrub: 1, animation: ltl,
    onUpdate: s => {
      const step = Math.min(4, Math.floor(s.progress * 5.2));
      if (step === lastStep) return; lastStep = step;
      calls.forEach((c, k) => c.classList.toggle('is-on', k < step));
      cimgs.forEach((im, k) => im.classList.toggle('is-on', k === step));
    },
  });

  // EVIDENCE: peeling document deck
  const docs = $$('.doc'), idxLis = $$('#evIndex li'), E = docs.length;
  const layoutDeck = p => {
    docs.forEach((d, k) => {
      const dd = k - p;
      if (dd < 0) gsap.set(d, { yPercent: dd * 130, rotate: dd * 14, scale: 1, opacity: 1 + dd * .6 });
      else gsap.set(d, { yPercent: 0, y: Math.min(dd, 4) * 16, rotate: (k % 2 ? 1 : -1) * Math.min(dd, 3) * 1.6, scale: 1 - Math.min(dd, 4) * .045, opacity: dd > 3.5 ? 0 : 1 });
    });
    const a = Math.min(E - 1, Math.round(p)); idxLis.forEach((l, k) => l.classList.toggle('is-on', k === a));
  };
  layoutDeck(0);
  const evST = ScrollTrigger.create({ trigger: '.ev__pin', start: 'top top', end: () => '+=' + window.innerHeight * .55 * (E - 1), pin: true, scrub: true, onUpdate: s => layoutDeck(s.progress * (E - 1)) });
  $('#evIndex').addEventListener('click', e => {
    const a = e.target.closest('[data-ev]'); if (!a || !evST) return;
    const k = +a.dataset.ev; const cur = Math.round(evST.progress * (E - 1));
    if (k !== cur) { e.preventDefault(); scrollToY(evST.start + (evST.end - evST.start) * (k / (E - 1)) + 1); }
  });

  return () => { html.classList.remove('cinema'); solST = null; wallST = null; wallTween = null; $$('.scene').forEach(s => { s.style.visibility = ''; }); };
});

/* ---- Everywhere (after pins so positions are correct) ---- */
splitHeads.forEach(({ h, chars }) => gsap.from(chars, { yPercent: 120, rotate: 4, stagger: .012, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%', once: true } }));
const rv = $$('.sol__aside, .wall__tools, .ev__aside, .re__aside, .lib__aside, .cmd, .about__txt > *, .dist__lead, .say, .dist__contact, .ft__grid > *, .pnl');
gsap.set(rv, { opacity: 0, y: 40 });
ScrollTrigger.batch(rv, { start: 'top 90%', once: true, onEnter: els => gsap.to(els, { opacity: 1, y: 0, stagger: .08, duration: 1.1, ease: 'expo.out' }) });

// Non-cinema scenes reveal
if (!isCinema()) $$('.scene').forEach(sc => gsap.from($$('.scene__stage, .scene__txt > *', sc), { opacity: 0, y: 40, stagger: .06, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: sc, start: 'top 80%', once: true } }));

// About lead: line masks
document.fonts && document.fonts.ready.then(() => {
  const lines = splitLines($('[data-lines]'));
  gsap.from(lines, { yPercent: 110, stagger: .08, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '[data-lines]', start: 'top 80%', once: true } });
  ScrollTrigger.refresh();
});
gsap.fromTo('.about__fig img', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.about__fig', start: 'top bottom', end: 'bottom top', scrub: true } });
gsap.from('.about__fig', { clipPath: 'inset(20% 20% 20% 20% round 28px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.about__fig', start: 'top 80%', once: true } });

// Spine timeline
gsap.fromTo('#spineFill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.spine__list', start: 'top 70%', end: 'bottom 70%', scrub: true } });
ScrollTrigger.batch('.spine__list li', { start: 'top 85%', once: true, onEnter: els => gsap.from(els, { opacity: 0, x: -40, stagger: .08, duration: 1, ease: 'expo.out' }) });
$$('.spine__list img').forEach(im => gsap.from(im, { scale: 0, rotate: -40, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: im, start: 'top 85%', once: true } }));

// Launch (non-cinema): cycle core image while visible
if (!isCinema()) {
  const imgs = $$('.core__img img'); let k = 0, vis = false;
  $$('.call').forEach(c => c.classList.add('is-on'));
  new IntersectionObserver(([en]) => { vis = en.isIntersecting; }).observe($('.core__img'));
  setInterval(() => { if (!vis) return; imgs[k].classList.remove('is-on'); k = (k + 1) % imgs.length; imgs[k].classList.add('is-on'); }, 3200);
}

// Footer band velocity
gsap.from('.ft__band', { clipPath: 'inset(0 50% 0 50%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.ft__band', start: 'top 90%', once: true } });

window.addEventListener('load', () => ScrollTrigger.refresh());
})();
