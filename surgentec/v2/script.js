/* =========================================================
   SurGenTec® homepage prototype: VERSION 2 interactions
   Product / evidence wording is verbatim from SurGenTec's published
   website (shared with Version 1). Do not edit copy without written
   approval from SurGenTec.
   ========================================================= */
(() => {
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
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
const pad = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ico = id => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
const img = (p, alt = '') => `<img src="${p.img}" alt="${esc(alt)}" loading="lazy"${p.cover ? ' class="cover"' : ''}>`;
const ALL = SOLUTIONS.flatMap(s => s.products);

/* ---------------- Smooth scroll (Lenis) ---------------- */
let lenis = null;
if (motion && fine && typeof window.Lenis !== 'undefined') {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const scrollToEl = (el, offset = -90) => {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
};
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.hasAttribute('data-proto') || a.hasAttribute('data-go')) return;
  const id = a.getAttribute('href');
  if (id.length < 2) { e.preventDefault(); lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  const t = document.querySelector(id); if (!t) return;
  e.preventDefault(); closeSheet(); setMega(false); scrollToEl(t);
});

/* ---------------- RENDER ---------------- */
$('#megaGrid').innerHTML = SOLUTIONS.map((s, i) => `
  <div class="mcol"><div class="mcol__h"><strong>${esc(s.name)}</strong><span class="mono">${pad(i + 1)}</span></div>
  ${s.products.map(id => `<button type="button" data-open-product="${id}">${img(PRODUCTS[id])}<span>${esc(PRODUCTS[id].name)}</span></button>`).join('')}</div>`).join('');
$('#sheetSol').innerHTML = SOLUTIONS.map((s, i) => `<button type="button" data-go="${i}"><small>${pad(i + 1)}</small><span>${esc(s.name)}</span><small>${s.products.length} products</small></button>`).join('');
$('#footSol').innerHTML = SOLUTIONS.map((s, i) => `<li><a href="#solutions" data-go="${i}">${esc(s.name)}</a></li>`).join('');

// Marquee of product names (+ duplicate for loop)
const mq = ALL.map(id => `<li>${img(PRODUCTS[id])}<span>${esc(PRODUCTS[id].name)}</span></li>`).join('');
$('#marqueeList').innerHTML = mq;
const mq2 = $('#marqueeList').cloneNode(true); mq2.removeAttribute('id'); mq2.setAttribute('aria-hidden', 'true');
$('#marquee').appendChild(mq2);

// Solutions stack
$('#stack').innerHTML = SOLUTIONS.map((s, i) => {
  const ev = s.products.flatMap(p => PRODUCTS[p].ev).length;
  return `<article class="sc" id="sol-${s.id}" aria-labelledby="sch-${s.id}">
    <div class="sc__body">
      <div class="sc__top"><span class="sc__n" aria-hidden="true">${pad(i + 1)}</span><span class="sc__wt">Working title</span></div>
      <h3 id="sch-${s.id}">${esc(s.name)}</h3>
      <p class="sc__desc"><span class="ph">[CLIENT-APPROVED CONTENT REQUIRED] Solution overview for ${esc(s.name)}.</span></p>
      <ul class="sc__prods">${s.products.map(id => `<li><button type="button" data-open-product="${id}">${img(PRODUCTS[id])}<span>${esc(PRODUCTS[id].name)}</span></button></li>`).join('')}</ul>
      <div class="sc__links">
        <a class="ulink" href="#solutions" data-proto="Opens the ${esc(s.name)} solution landing page (reusable template).">Solution page ${ico('i-arrow')}</a>
        ${ev ? `<a class="ulink" href="#library" data-lib-sol="${s.id}">${ev} evidence document${ev > 1 ? 's' : ''} ${ico('i-arrow')}</a>` : ''}
      </div>
    </div>
    <div class="sc__media"><img src="${s.img.replace('/b-', '/s-')}" alt="" loading="lazy"><span class="sc__url mono">/solutions/${s.id}/</span><span class="sc__count">${s.products.length} products</span></div>
  </article>`; }).join('');

// Catalog
let catF = 'all';
$('#catSeg').insertAdjacentHTML('beforeend', [`<button type="button" aria-pressed="true" data-f="all">All <small>19</small></button>`]
  .concat(SOLUTIONS.map(s => `<button type="button" aria-pressed="false" data-f="${s.id}">${esc(s.name)} <small>${s.products.length}</small></button>`)).join(''));
$('#catGrid').innerHTML = ALL.map(id => {
  const p = PRODUCTS[id], s = solOf[id];
  return `<li class="pc" data-sol="${s.id}" data-q="${esc((p.name + ' ' + p.tag + ' ' + s.name).toLowerCase())}"><button type="button" data-open-product="${id}">
    <span class="pc__img">${img(p, '')}${p.launch ? '<span class="pc__new">New</span>' : ''}</span>
    <span class="pc__body"><span class="mono">${esc(s.name)}</span><strong>${esc(p.name)}</strong><small>${esc(p.tag)}</small>
    <span class="pc__go"><span>${ico('i-arrow')}</span></span></span></button></li>`; }).join('');

// Evidence journal index
$('#jxRows').innerHTML = EVIDENCE.map((e, i) => {
  const p = PRODUCTS[e.product];
  return `<a class="jr" role="row" href="${PDF + e.file}" target="_blank" rel="noopener" data-track="download" data-title="${esc(e.title)}" data-peek="${p.img}" data-cap="${esc(e.type)} · PDF"${p.cover ? ' data-cover' : ''}>
    <span class="jr__n" role="cell">${pad(i + 1)}</span>
    <span class="jr__t" role="cell">${e.type}</span>
    <span class="jr__title" role="cell">${esc(e.title)}${e.quote ? `<small>${esc(e.quote)}</small>` : ''}</span>
    <span class="jr__p" role="cell">${esc(p.name)}<small>${esc(solOf[e.product].name)}</small></span>
    <span class="jr__go" role="cell">${ico('i-ext')}<span class="sr-only">Open PDF in new tab</span></span></a>`; }).join('');

// Library
const RES = EVIDENCE.map(e => ({ ...e, sol: solOf[e.product].id, url: PDF + e.file })).concat(EXTRA_RESOURCES.map(r => ({ ...r, sol: 'all' })));
const TYPES = ['All', 'White paper', 'Clinical study', 'Case report', 'Brochure', 'Video', 'IFU'];
let libT = 'All', libS = 'all';
$('#libTypes').innerHTML = TYPES.map((t, i) => `<button type="button" aria-pressed="${i === 0}" data-t="${t}">${t}<small>${t === 'All' ? RES.length : RES.filter(r => r.cat === t).length}</small></button>`).join('');
$('#libSol').insertAdjacentHTML('beforeend', SOLUTIONS.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join(''));
$('#libGrid').innerHTML = RES.map(r => {
  const p = r.product ? PRODUCTS[r.product] : null;
  const cover = `<span class="lr__cover">${p ? img(p) : `<span class="lr__ic">${ico(r.cat === 'Video' ? 'i-play' : 'i-doc')}</span>`}<span class="lr__fmt">${r.cat === 'Video' ? 'VIDEO' : 'PDF'}</span></span>`;
  const meta = `<p class="lr__meta">${r.type || r.cat} <span>· ${p ? esc(p.name) : 'All products'}</span></p>`;
  const q = esc(((r.title || '') + ' ' + (p ? p.name : '') + ' ' + (r.type || r.cat)).toLowerCase());
  if (r.ph) return `<li class="lr lr--ph" data-cat="${r.cat}" data-sol="all" data-q="${q}"><div class="lr__in">${cover}<div class="lr__body">${meta}<h3>${esc(r.title)}</h3><span class="ph">[CLIENT TO SUPPLY FILES]</span></div></div></li>`;
  return `<li class="lr" data-cat="${r.cat}" data-sol="${r.sol}" data-q="${q}"><a href="${r.url}" target="_blank" rel="noopener" ${r.cat === 'Video' ? '' : 'data-track="download"'} data-title="${esc(r.title)}">${cover}<div class="lr__body">${meta}<h3>${esc(r.title)}</h3><span class="lr__cta">${r.cat === 'Video' ? 'Watch on surgentec.com' : 'Download'} ${ico(r.cat === 'Video' ? 'i-ext' : 'i-down')}</span></div><span class="sr-only">(opens in new tab)</span></a></li>`;
}).join('');

/* ---------------- HEADER ---------------- */
const hdr = $('.hdr'), megaBtn = $('.hdr__mega-btn'), mega = $('#mega');
let megaT;
function setMega(open) { mega.hidden = !open; megaBtn.setAttribute('aria-expanded', open); }
megaBtn.addEventListener('click', () => setMega(mega.hidden));
if (fine) {
  [megaBtn, mega].forEach(el => {
    el.addEventListener('mouseenter', () => { clearTimeout(megaT); setMega(true); });
    el.addEventListener('mouseleave', () => { megaT = setTimeout(() => setMega(false), 240); });
  });
}
document.addEventListener('click', e => { if (!mega.hidden && !mega.contains(e.target) && e.target !== megaBtn && !megaBtn.contains(e.target)) setMega(false); });
mega.addEventListener('focusout', e => { if (!mega.contains(e.relatedTarget) && e.relatedTarget !== megaBtn) setMega(false); });
$$('[data-close-mega]').forEach(a => a.addEventListener('click', () => setMega(false)));

// Sliding hover pill in nav
const nav = $('.hdr__nav'), pill = $('.hdr__pill');
$$('.hdr__link', nav).forEach(l => {
  l.addEventListener('mouseenter', () => { pill.style.left = l.offsetLeft + 'px'; pill.style.width = l.offsetWidth + 'px'; pill.style.opacity = 1; });
  l.addEventListener('focus', () => { pill.style.left = l.offsetLeft + 'px'; pill.style.width = l.offsetWidth + 'px'; pill.style.opacity = 1; });
});
nav.addEventListener('mouseleave', () => { pill.style.opacity = 0; });

// Hide on scroll down, show on scroll up
let lastY = 0;
const onScroll = y => {
  if (mega.hidden) hdr.classList.toggle('is-up', y > 300 && y > lastY);
  lastY = y;
};
if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });

// Mobile sheet
const burger = $('.hdr__burger'), sheet = $('#sheet');
function closeSheet() { if (sheet.hidden) return; sheet.hidden = true; burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); burger.querySelector('use').setAttribute('href', '#i-menu'); document.body.style.overflow = ''; lenis && lenis.start(); }
burger.addEventListener('click', () => {
  if (!sheet.hidden) return closeSheet();
  sheet.hidden = false; burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Close menu');
  burger.querySelector('use').setAttribute('href', '#i-close'); document.body.style.overflow = 'hidden'; lenis && lenis.stop();
  if (motion) gsap.from($$('.sheet nav > *'), { opacity: 0, y: 16, stagger: .03, duration: .6, ease: 'power3.out' });
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!mega.hidden) { setMega(false); megaBtn.focus(); }
  closeSheet();
  if (!$('#notes').hidden) toggleNotes(false);
});

// Current-section link
const links = $$('.hdr__link[href^="#"]');
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) links.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
['catalog', 'evidence', 'reimbursement', 'library', 'about'].forEach(id => io.observe(document.getElementById(id)));

// Jump to a solution card
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (!g) return;
  e.preventDefault(); closeSheet(); setMega(false);
  scrollToEl($$('.sc')[+g.dataset.go], -96);
});

/* ---------------- HERO STAGE ---------------- */
const FEAT = ['tilink-p', 'ion-c', 'hydroputty', 'ion-3d', 'tilink-insite'];
const stage = $('#stage');
$('#stageItems').innerHTML = FEAT.map((id, i) => `<li class="si" data-i="${i}"><button type="button" tabindex="-1" aria-label="Show ${esc(PRODUCTS[id].name)}">${img(PRODUCTS[id], PRODUCTS[id].name + ' ' + PRODUCTS[id].tag)}</button></li>`).join('');
const sis = $$('.si');
let cur = 0, elapsed = 0, last = 0, raf = 0, hovering = false;
const DUR = 25000;
function layout() {
  const n = FEAT.length, mob = window.innerWidth < 761;
  sis.forEach((el, i) => {
    let d = i - cur; if (d > n / 2) d -= n; if (d < -n / 2) d += n;
    const ad = Math.abs(d);
    const x = d * (mob ? 62 : 108), s = ad === 0 ? 1 : ad === 1 ? .5 : .32, o = ad === 0 ? 1 : ad === 1 ? .55 : (mob ? 0 : .22);
    el.style.transform = `translate(calc(-50% + ${x}%), -50%) scale(${s}) rotate(${d * -6}deg)`;
    el.style.opacity = o; el.style.zIndex = 10 - ad;
    el.style.filter = ad ? `blur(${ad * 1.5}px) saturate(.8)` : 'none';
    el.classList.toggle('is-side', ad > 0);
    el.querySelector('button').tabIndex = ad === 1 ? 0 : -1;
  });
  const id = FEAT[cur], p = PRODUCTS[id], s = solOf[id];
  $('#stSol').textContent = `Solution ${pad(s.idx + 1)} · ${s.name}`;
  $('#stName').textContent = p.name; $('#stTag').textContent = p.tag;
  $('#stCount').textContent = `${pad(cur + 1)} / ${pad(n)}`;
  if (motion) gsap.fromTo('.stage__info > *', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: .05, duration: .7, ease: 'power3.out' });
}
function go(i) { cur = (i + FEAT.length) % FEAT.length; elapsed = 0; $('#stBar').style.transform = 'scaleX(0)'; layout(); }
function tick(t) {
  if (!hovering) return;
  elapsed += t - last; last = t;
  $('#stBar').style.transform = `scaleX(${Math.min(elapsed / DUR, 1)})`;
  if (elapsed >= DUR) go(cur + 1);
  raf = requestAnimationFrame(tick);
}
stage.addEventListener('mouseenter', () => { hovering = true; last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); });
stage.addEventListener('mouseleave', () => { hovering = false; cancelAnimationFrame(raf); });
$('#stNext').addEventListener('click', () => go(cur + 1));
$('#stPrev').addEventListener('click', () => go(cur - 1));
$('#stOpen').addEventListener('click', () => openProduct(FEAT[cur]));
sis.forEach((el, i) => el.querySelector('button').addEventListener('click', () => (i === cur ? openProduct(FEAT[cur]) : go(i))));
// Touch swipe
let sx = null;
stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
stage.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); sx = null; });
window.addEventListener('resize', layout);
layout();
if (fine && motion) {
  stage.addEventListener('mousemove', e => {
    const r = stage.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
    gsap.to('.si:not(.is-side) img', { x: dx * 26, y: dy * 18, rotate: dx * 4, duration: 1, ease: 'power3.out' });
    gsap.to('.stage__rings', { x: dx * -14, y: dy * -10, duration: 1.4, ease: 'power3.out' });
  });
}

/* ---------------- CATALOG ---------------- */
const seg = $('#catSeg'), ind = $('.seg__ind', seg);
function moveInd() {
  const b = $('button[aria-pressed="true"]', seg); if (!b) return;
  ind.style.left = b.offsetLeft + 'px'; ind.style.width = b.offsetWidth + 'px'; ind.style.top = b.offsetTop + 'px'; ind.style.height = b.offsetHeight + 'px';
}
function filterCat() {
  const q = $('#catSearch').value.trim().toLowerCase(); let n = 0;
  $$('.pc').forEach(c => { const ok = (catF === 'all' || c.dataset.sol === catF) && (!q || c.dataset.q.includes(q)); c.hidden = !ok; if (ok) n++; });
  $('#catCount').textContent = n ? `${n} of 19 products` : 'No products match your search';
}
seg.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  catF = b.dataset.f; $$('button', seg).forEach(x => x.setAttribute('aria-pressed', x === b)); moveInd(); filterCat();
  if (motion) gsap.fromTo('.pc:not([hidden])', { opacity: 0, y: 24, scale: .97 }, { opacity: 1, y: 0, scale: 1, stagger: .035, duration: .7, ease: 'expo.out' });
});
$('#catSearch').addEventListener('input', filterCat);
window.addEventListener('resize', moveInd);
document.fonts && document.fonts.ready.then(moveInd);
moveInd(); filterCat();

/* ---------------- EVIDENCE PEEK ---------------- */
if (fine) {
  const pk = $('#peek'), pImg = $('#peekImg'), pCap = $('#peekCap');
  let tx = 0, ty = 0, x = 0, y = 0, on = false, r = 0;
  const loop = () => { x += (tx - x) * .16; y += (ty - y) * .16; pk.style.transform = `translate3d(${x}px,${y}px,0) rotate(${(tx - x) * .04}deg)`; r = (on || Math.abs(tx - x) > .5) ? requestAnimationFrame(loop) : 0; };
  document.addEventListener('mousemove', e => { tx = e.clientX + 30; ty = e.clientY - 150; if (tx + 240 > innerWidth) tx = e.clientX - 250; if (ty < 80) ty = 80; }, { passive: true });
  $('#jxRows').addEventListener('mouseover', e => {
    const a = e.target.closest('[data-peek]'); if (!a) return;
    pImg.src = a.dataset.peek; pImg.className = a.hasAttribute('data-cover') ? 'cover' : ''; pCap.textContent = a.dataset.cap;
    if (!on) { x = tx; y = ty; } on = true; pk.classList.add('on'); if (!r) r = requestAnimationFrame(loop);
  });
  $('#jxRows').addEventListener('mouseleave', () => { on = false; pk.classList.remove('on'); });
}

/* ---------------- DRAWER ---------------- */
const dw = $('#drawer');
let curP = null;
function openProduct(id) {
  const p = PRODUCTS[id], s = solOf[id]; if (!p) return;
  curP = id; setMega(false); closeSheet();
  $('#dwImg').src = p.img; $('#dwImg').alt = p.name; $('#dwImg').className = p.cover ? 'cover' : '';
  $('#dwSol').textContent = `Solution ${pad(s.idx + 1)} · ${s.name}${p.launch ? ' · New' : ''}`;
  $('#dwName').textContent = p.name; $('#dwTag').textContent = p.tag; $('#dwDesc').textContent = p.desc;
  $('#dwPts').innerHTML = p.points.map(x => `<li>${esc(x)}</li>`).join('');
  const ev = EVIDENCE.filter(e => p.ev.includes(e.id));
  $('#dwEvWrap').hidden = !ev.length;
  $('#dwEv').innerHTML = ev.map(e => `<li><a href="${PDF + e.file}" target="_blank" rel="noopener" data-track="download" data-title="${esc(e.title)}">${ico('i-doc')}<span>${esc(e.title)}</span></a></li>`).join('');
  $('#dwLink').href = LIVE + p.url;
  dw.showModal(); lenis && lenis.stop();
  $('.drawer__in', dw).scrollTop = 0;
  track('view_item', { item_name: p.name, item_category: s.name });
}
document.addEventListener('click', e => { const b = e.target.closest('[data-open-product]'); if (b) { e.preventDefault(); openProduct(b.dataset.openProduct); } });
$$('dialog').forEach(d => {
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  d.addEventListener('close', () => { lenis && lenis.start(); });
});
$('#dwInq').addEventListener('click', e => {
  e.preventDefault(); dw.close();
  const r = $(`input[name="inquiry"][value="Product information"]`); r.checked = true;
  const m = $('#fMsg'); if (!m.value) m.value = `Product of interest: ${PRODUCTS[curP].name}\n`;
  scrollToEl($('#partner'));
});

/* ---------------- LIBRARY ---------------- */
function filterLib() {
  const q = $('#libSearch').value.trim().toLowerCase(); let n = 0;
  $$('.lr').forEach(r => { const ok = (libT === 'All' || r.dataset.cat === libT) && (libS === 'all' || r.dataset.sol === libS) && (!q || r.dataset.q.includes(q)); r.hidden = !ok; if (ok) n++; });
  $('#libCount').textContent = `${n} resource${n === 1 ? '' : 's'}`;
  $('#libEmpty').hidden = n > 0;
}
const setLibType = t => { libT = t; $$('#libTypes button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === t)); };
$('#libTypes').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; setLibType(b.dataset.t); filterLib(); });
$('#libSol').addEventListener('change', e => { libS = e.target.value; filterLib(); });
$('#libSearch').addEventListener('input', filterLib);
$('#libReset').addEventListener('click', () => { setLibType('All'); libS = 'all'; $('#libSol').value = 'all'; $('#libSearch').value = ''; filterLib(); });
document.addEventListener('click', e => { const a = e.target.closest('[data-lib-sol]'); if (!a) return; setLibType('All'); libS = a.dataset.libSol; $('#libSol').value = libS; $('#libSearch').value = ''; filterLib(); });
filterLib();

/* ---------------- TIMELINE DRAG ---------------- */
const row = $('#tlRow');
let down = false, startX = 0, startL = 0, moved = false;
row.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; startX = e.clientX; startL = row.scrollLeft; });
window.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - startX; if (Math.abs(dx) > 4) { moved = true; row.classList.add('dragging'); } row.scrollLeft = startL - dx; });
window.addEventListener('pointerup', () => { down = false; row.classList.remove('dragging'); });
row.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.stopPropagation(); }, { passive: true });

/* ---------------- MISC: video, notes, proto toast, GA4 ---------------- */
$$('[data-video]').forEach(b => b.addEventListener('click', () => { $('#vidTitle').textContent = b.dataset.video; $('#vid').showModal(); lenis && lenis.stop(); }));
const notesBtn = $('#notesBtn'), notes = $('#notes');
function toggleNotes(o) { notes.hidden = !o; notesBtn.setAttribute('aria-expanded', o); }
notesBtn.addEventListener('click', () => toggleNotes(notes.hidden));
$('#notesX').addEventListener('click', () => { toggleNotes(false); notesBtn.focus(); });
$('#phTog').addEventListener('change', e => document.body.classList.toggle('show-ph', e.target.checked));
const toast = document.createElement('div'); toast.setAttribute('role', 'status');
Object.assign(toast.style, { position: 'fixed', left: '50%', bottom: '24px', transform: 'translate(-50%,20px)', zIndex: 200, background: '#0b1324', color: '#fff', padding: '12px 18px', borderRadius: '14px', font: '14px Geist,sans-serif', opacity: 0, transition: 'all .45s cubic-bezier(.16,1,.3,1)', maxWidth: 'calc(100% - 32px)', pointerEvents: 'none', boxShadow: '0 20px 40px -20px rgba(0,0,0,.5)' });
document.body.appendChild(toast);
let tt;
document.addEventListener('click', e => {
  const a = e.target.closest('[data-proto]'); if (!a) return; e.preventDefault();
  toast.textContent = 'Prototype: ' + a.dataset.proto; toast.style.opacity = 1; toast.style.transform = 'translate(-50%,0)';
  clearTimeout(tt); tt = setTimeout(() => { toast.style.opacity = 0; toast.style.transform = 'translate(-50%,20px)'; }, 3200);
});
document.addEventListener('click', e => { const a = e.target.closest('a[data-track="download"]'); if (a) track('file_download', { file_name: a.dataset.title, link_url: a.href }); });

/* ---------------- FORM WIZARD ---------------- */
const form = $('#ptForm'), steps = $$('.wz-step', form), dots = $$('.wizard__steps span');
const rules = {
  name: v => v.trim().length >= 2 || 'Please enter your full name.',
  organization: v => v.trim().length >= 2 || 'Please enter your organization.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || (v.trim() ? 'Please enter a valid email address, e.g. name@company.com.' : 'Please enter your email address.'),
  country: v => v.trim().length >= 2 || 'Please enter your country or region.',
  message: v => v.trim().length >= 10 || 'Please add a short message (at least 10 characters).',
};
function check(el) {
  const res = rules[el.name](el.value), ok = res === true, w = el.closest('.fl');
  w.classList.toggle('bad', !ok); w.classList.toggle('ok', ok); el.setAttribute('aria-invalid', !ok);
  w.querySelector('.err').textContent = ok ? '' : res; return ok;
}
function checkType() {
  const ok = !!form.querySelector('input[name="inquiry"]:checked');
  $('.radios', form).classList.toggle('bad', !ok); $('#eType').textContent = ok ? '' : 'Please select an inquiry type.'; return ok;
}
$$('.fl input, .fl textarea', form).forEach(el => {
  el.addEventListener('blur', () => { if (el.value) { el.dataset.t = 1; check(el); } });
  el.addEventListener('input', () => { if (el.dataset.t) check(el); });
});
$$('input[name="inquiry"]', form).forEach(r => r.addEventListener('change', checkType));
function showStep(n) {
  steps.forEach(s => { s.hidden = +s.dataset.step !== n; });
  dots.forEach((d, i) => d.classList.toggle('on', i < n));
  $('#wzLabel').textContent = n === 1 ? 'Step 1 of 2 · About you' : 'Step 2 of 2 · Your inquiry';
  const st = steps[n - 1];
  if (motion) gsap.from(st.children, { opacity: 0, x: n === 2 ? 24 : -24, stagger: .04, duration: .6, ease: 'power3.out' });
  const first = st.querySelector('input:not([type=radio]),textarea,input[type=radio]'); first && first.focus({ preventScroll: true });
}
$('#wzNext').addEventListener('click', () => {
  const els = $$('input', steps[0]).filter(el => rules[el.name]);
  const bad = els.filter(el => { el.dataset.t = 1; return !check(el); });
  if (bad.length) { $('#ptStatus').textContent = `Please correct ${bad.length} field${bad.length > 1 ? 's' : ''}.`; bad[0].focus(); return; }
  showStep(2);
});
$('#wzBack').addEventListener('click', () => showStep(1));
form.addEventListener('keydown', e => { if (e.key === 'Enter' && !steps[0].hidden && e.target.tagName === 'INPUT') { e.preventDefault(); $('#wzNext').click(); } });
form.addEventListener('submit', e => {
  e.preventDefault();
  const tOk = checkType(), m = $('#fMsg'); m.dataset.t = 1; const mOk = check(m);
  if (!tOk || !mOk) { $('#ptStatus').textContent = 'Please complete the highlighted fields.'; (tOk ? m : $('input[name="inquiry"]', form)).focus(); return; }
  const btn = $('button[type="submit"]', form); btn.classList.add('loading'); btn.querySelector('span').textContent = 'Sending…';
  setTimeout(() => {
    track('generate_lead', { form_name: 'distributor_inquiry', inquiry_type: form.querySelector('input[name="inquiry"]:checked').value, country: form.country.value });
    $('#ptRef').textContent = 'DI-' + Date.now().toString(36).toUpperCase().slice(-6);
    $('#ptName').textContent = form.name.value.trim().split(' ')[0];
    form.hidden = true; const d = $('#ptDone'); d.hidden = false; d.focus();
    if (motion) gsap.from(d.children, { opacity: 0, y: 16, stagger: .07, duration: .7, ease: 'power3.out' });
    btn.classList.remove('loading'); btn.querySelector('span').textContent = 'Submit inquiry';
  }, 900);
});
$('#ptAgain').addEventListener('click', () => {
  form.reset(); $$('.fl', form).forEach(f => f.classList.remove('ok', 'bad')); $('.radios', form).classList.remove('bad');
  $$('[data-t]', form).forEach(el => { delete el.dataset.t; el.removeAttribute('aria-invalid'); });
  $('#ptDone').hidden = true; form.hidden = false; showStep(1);
});

/* ---------------- MOTION ---------------- */
if (!motion) return;

// Hero entrance
gsap.timeline({ defaults: { ease: 'expo.out' } })
  .from('.hdr__bar', { y: -90, opacity: 0, duration: 1.2 })
  .to('[data-hero]', { opacity: 1, y: 0, duration: 1, stagger: .15 }, .15)
  .to('.hero__title .ln > span', { y: 0, duration: 1.4, stagger: .1 }, .2)
  .to('[data-hero-stage]', { opacity: 1, y: 0, scale: 1, duration: 1.6 }, .55)
  .from('.si', { opacity: 0, duration: 1.2, stagger: .08 }, .9)
  .from('.stage__rings span', { scale: .6, opacity: 0, duration: 1.6, stagger: .1 }, .8);
$('.hero__title').setAttribute('aria-label', 'Revolutionizing spine and orthopedic surgeries with cutting-edge technology');
$$('.hero__title .ln').forEach(l => l.setAttribute('aria-hidden', 'true'));
gsap.to('.stage__rings', { rotate: 30, ease: 'none', scrollTrigger: { trigger: '.stage', start: 'top bottom', end: 'bottom top', scrub: true } });
gsap.to('.stage', { scale: .96, borderRadius: 56, ease: 'none', scrollTrigger: { trigger: '.stage', start: 'center 40%', end: 'bottom top', scrub: true } });

// Generic reveals
ScrollTrigger.batch('[data-rv]', { start: 'top 88%', once: true, onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: .08, ease: 'expo.out', overwrite: true }) });

// Bento counters
$$('[data-count]').forEach(el => {
  const to = +el.dataset.count, from = to > 1000 ? to - 40 : 0, o = { v: from };
  ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 1.8, ease: 'expo.out', onUpdate: () => { el.textContent = Math.round(o.v); } }) });
});

const mm = gsap.matchMedia();
mm.add('(min-width: 1101px)', () => {
  // Stacking solution cards: earlier cards recede as the next slides over
  const cards = $$('.sc');
  cards.forEach((c, i) => {
    c.style.top = (96 + i * 14) + 'px';
    gsap.fromTo($('.sc__media img', c), { scale: 1.25 }, { scale: 1.05, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'top 100px', scrub: true } });
    if (i < cards.length - 1) {
      gsap.fromTo(c, { scale: 1, filter: 'brightness(1)' }, { scale: .94 - (cards.length - i) * .006, filter: 'brightness(.94)', ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 120px', scrub: true } });
    }
  });
  return () => cards.forEach(c => { c.style.top = ''; });
});

mm.add('(min-width: 1024px)', () => {
  // Launch: horizontal pinned story
  const tr = $('#launchTrack');
  const dist = () => Math.max(0, tr.scrollWidth - window.innerWidth);
  const tw = gsap.to(tr, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.launch__pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .8, invalidateOnRefresh: true, onUpdate: s => { $('#launchProg').style.transform = `scaleX(${s.progress})`; } } });
  gsap.fromTo('.launch__needle', { rotate: -20, x: 60 }, { rotate: 10, x: -40, ease: 'none', scrollTrigger: { trigger: '.launch__pin', start: 'top top', end: () => '+=' + dist(), scrub: true } });
  return () => tw.kill();
});

// About: word-by-word scrub
const st = $('[data-scrub]');
const label = st.textContent.trim();
st.innerHTML = label.split(/\s+/).map(w => `<span class="wd">${w}</span>`).join(' ');
st.setAttribute('aria-label', label);
$$('.wd', st).forEach(w => w.setAttribute('aria-hidden', 'true'));
gsap.fromTo($$('.wd', st), { color: '#c9d1dd' }, { color: '#0b1324', stagger: .1, ease: 'none', scrollTrigger: { trigger: st, start: 'top 80%', end: 'bottom 45%', scrub: true } });

gsap.from('.tl__row li', { opacity: 0, x: 60, stagger: .05, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.tl', start: 'top 85%', once: true } });
gsap.from('.partner__card', { scale: .94, borderRadius: 80, ease: 'none', scrollTrigger: { trigger: '.partner', start: 'top bottom', end: 'top 40%', scrub: true } });
gsap.from('.foot__logo', { yPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.foot__logo', start: 'top bottom', end: 'bottom 85%', scrub: true } });

window.addEventListener('load', () => ScrollTrigger.refresh());
})();
