/* beds.net.au concept prototype — shared data, header/footer, side cart, page logic */
(function(){
'use strict';

/* ---------- helpers ---------- */
const R=(document.body&&document.body.dataset.base)||'./';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const money=n=>'$'+(Math.round(n*100)/100).toLocaleString('en-AU',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2});
const money2=n=>'$'+n.toLocaleString('en-AU',{minimumFractionDigits:2,maximumFractionDigits:2});
const U=(id,w)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w||900}&q=72`;
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const ic={
  search:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  user:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  bag:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  menu:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  x:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  chev:'<svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
  arrow:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  truck:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  pin:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  card:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></svg>',
  shield:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  check:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  clock:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  layers:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/></svg>',
  bed:'<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18V6M21 18v-5a3 3 0 0 0-3-3H9v8M3 14h18"/><circle cx="6.5" cy="10.5" r="1.8"/></svg>'
};

/* ---------- data ---------- */
// Warehouses: in Shopify these are Locations. New ones are added in Settings → Locations.
const WH={
  syd:{name:'Sydney NSW warehouse',short:'Sydney',sup:'Supplier A',color:'#3f6b57',pc:'2170',pickup:true},
  mel:{name:'Melbourne VIC warehouse',short:'Melbourne',sup:'Supplier B',color:'#c9874f',pc:'3175',pickup:true},
  bne:{name:'Brisbane QLD warehouse',short:'Brisbane',sup:'Supplier C',color:'#5a6fa8',pc:'4110',pickup:false}
};
// Offer discount (admin-set in the app / Shopify discount, global + exclusions)
const ADMIN=store.get('bna_admin',{});
const OFFER=Object.assign({pct:15,types:['mattress','accessory'],exclude:['m-euro-s']},ADMIN.offer||{});
// pre-order on the Harbour Charcoal variant (admin can switch it off or change the ETA)
const PRE=Object.assign({on:true,eta:'15 Jan'},ADMIN.pre||{});
const FREE_METRO=1500;

const P={
  // bunks
  'bk-harbour':{type:'bunk',name:'Harbour Single-over-Double Bunk',cat:'Bunks',price:1299,was:1549,wh:'syd',svg:{color:'oak'},rating:4.8,reviews:126,badge:['sale','Save $250'],url:R+'product/'},
  'bk-coast':{type:'bunk',name:'Coast Single Bunk with Trundle',cat:'Bunks',price:1049,wh:'mel',svg:{color:'white',trundle:true,single:true},rating:4.7,reviews:88,badge:['new','New']},
  'bk-ridge':{type:'bunk',name:'Ridge Triple Sleeper Bunk',cat:'Bunks',price:1399,wh:'bne',svg:{color:'charcoal',trundle:true},rating:4.6,reviews:41,pre:'15 Jan',badge:['pre','Pre-order']},
  // beds
  'b-aria':{type:'bed',name:'Aria Upholstered Bed — Queen',cat:'Queen Beds',price:1199,was:1499,wh:'syd',img:'photo-1505693416388-ac5ce068fe85',rating:4.9,reviews:212,badge:['sale','-20%']},
  'b-oslo':{type:'bed',name:'Oslo Timber Platform Bed — King',cat:'King Beds',price:1449,wh:'mel',img:'photo-1617325247661-675ab4b64ae2',rating:4.8,reviews:97},
  'b-luna':{type:'bed',name:'Luna Channel-Tufted Bed — Queen',cat:'Queen Beds',price:1690,wh:'bne',img:'photo-1616594039964-ae9021a400a0',rating:4.7,reviews:58,pre:'15 Jan',badge:['pre','Pre-order']},
  'b-noah':{type:'bed',name:'Noah Kids Bed — Single',cat:'Single Beds',price:549,wh:'syd',img:'photo-1522771739844-6a9f6d5f14af',rating:4.8,reviews:143},
  'b-harper':{type:'bed',name:'Harper Bed Frame — King Single',cat:'King Single Beds',price:749,wh:'mel',img:'photo-1586105251261-72a756497a11',rating:4.6,reviews:64},
  'b-ellis':{type:'bed',name:'Ellis Bed Frame — Double',cat:'Double Beds',price:899,wh:'bne',img:'photo-1631049307264-da0ec9d70304',rating:4.5,reviews:37,oos:true,badge:['oos','Out of stock']},
  // mattresses (size + thickness are metafields)
  'm-cloud-s':{type:'mattress',name:'Cloud Junior Foam Mattress',size:'Single',thk:14,price:299,wh:'syd',feel:'Medium'},
  'm-bunk-s':{type:'mattress',name:'Bunk Comfort Mattress',size:'Single',thk:16,price:349,wh:'syd',feel:'Medium-firm'},
  'm-latex-s':{type:'mattress',name:'Natural Latex Kids Mattress',size:'Single',thk:18,price:529,wh:'mel',feel:'Medium'},
  'm-pocket-s':{type:'mattress',name:'Pocket Spring Mattress',size:'Single',thk:20,price:449,wh:'mel',feel:'Firm'},
  'm-euro-s':{type:'mattress',name:'Euro Top Plush Mattress',size:'Single',thk:26,price:599,wh:'bne',feel:'Plush'},
  'm-slim-s':{type:'mattress',name:'Slimline Trundle Mattress',size:'Single',thk:10,price:219,wh:'syd',feel:'Medium'},
  'm-roll-s':{type:'mattress',name:'Roll-Up Foam Trundle Mattress',size:'Single',thk:12,price:249,wh:'mel',feel:'Medium-firm'},
  'm-cloud-d':{type:'mattress',name:'Cloud Foam Mattress',size:'Double',thk:15,price:399,wh:'syd',feel:'Medium'},
  'm-bunk-d':{type:'mattress',name:'Bunk Comfort Mattress',size:'Double',thk:18,price:479,wh:'syd',feel:'Medium-firm'},
  'm-pocket-d':{type:'mattress',name:'Pocket Spring Mattress',size:'Double',thk:22,price:599,wh:'mel',feel:'Firm'},
  'm-hybrid-d':{type:'mattress',name:'Hybrid Plush Mattress',size:'Double',thk:28,price:849,wh:'bne',feel:'Plush'},
  'm-hybrid-q':{type:'mattress',name:'Hybrid Luxe Mattress — Queen',size:'Queen',thk:30,price:1149,was:1399,wh:'mel',feel:'Medium',rating:4.9,reviews:301,badge:['sale','Save $250'],cat:'Mattresses'},
  'm-pocket-k':{type:'mattress',name:'Pocket Spring Mattress — King',size:'King',thk:24,price:1049,wh:'syd',feel:'Firm',rating:4.7,reviews:120,cat:'Mattresses'},
  // accessories
  'a-prot-s':{type:'accessory',name:'Waterproof Mattress Protector — Single',price:59,wh:'syd',img:'photo-1631049552057-403cdb8f0658'},
  'a-prot-d':{type:'accessory',name:'Waterproof Mattress Protector — Double',price:79,wh:'syd',img:'photo-1631049552057-403cdb8f0658'},
  'a-pillow':{type:'accessory',name:'Kids Cloud Pillow (2-pack)',price:49,wh:'syd',img:'photo-1584100936595-c0654b55a2e2'},
  'a-sheets':{type:'accessory',name:'Cotton Sheet Set — Single',price:89,wh:'mel',img:'photo-1522771739844-6a9f6d5f14af'},
  'a-pillow-q':{type:'accessory',name:'Hotel Pillow (2-pack)',price:89,wh:'syd',img:'photo-1584100936595-c0654b55a2e2'},
  'a-prot-q':{type:'accessory',name:'Waterproof Mattress Protector — Queen',price:99,wh:'syd',img:'photo-1631049552057-403cdb8f0658'}
};
Object.keys(P).forEach(k=>P[k].id=k);
window.BEDS={P,WH,OFFER,PRE,store,money,money2,mediaFor:(p,w)=>mediaFor(p,w),R};

/* ---------- SVG renders ---------- */
const FR={
  oak:{f:'#c99a66',s:'#9c7044',p:'#dcb88d'},
  white:{f:'#f3efe7',s:'#c9c0b0',p:'#faf8f3'},
  charcoal:{f:'#3d424c',s:'#262a31',p:'#5a606c'}
};
function bunkSVG(o){
  o=o||{};const c=FR[o.color||'oak'];const id=o.id||'';const tr=!!o.trundle;const single=!!o.single;
  const lbl=(x,y,t,cls)=>`<g class="poslbl ${cls||''}" ${o.labels?'':''}><rect x="${x}" y="${y}" rx="14" width="${t.length*7.6+28}" height="28" fill="#16213a"/><text x="${x+14}" y="${y+19}" font-family="Manrope,sans-serif" font-size="13" font-weight="700" fill="#fff">${t}</text></g>`;
  const bx=single?150:74, bw=single?320:472;
  return `<svg class="bunk" ${id?`id="${id}"`:''} viewBox="0 0 640 580" role="img" aria-label="Bunk bed illustration">
  <ellipse cx="320" cy="552" rx="290" ry="14" fill="#16213a" opacity=".08"/>
  <!-- end panels -->
  <rect class="frame" x="166" y="60" width="288" height="150" rx="6" fill="${c.p}" opacity=".55"/>
  <rect class="frame" x="${bx}" y="292" width="${bw}" height="88" rx="6" fill="${c.p}" opacity=".5"/>
  <!-- top unit -->
  <rect class="frame" x="146" y="40" width="20" height="230" rx="4" fill="${c.f}" stroke="${c.s}" stroke-width="2"/>
  <rect class="frame" x="454" y="40" width="20" height="230" rx="4" fill="${c.f}" stroke="${c.s}" stroke-width="2"/>
  <rect class="frame" x="146" y="98" width="328" height="12" rx="4" fill="${c.f}" stroke="${c.s}" stroke-width="2"/>
  <rect class="frame" x="146" y="134" width="328" height="12" rx="4" fill="${c.f}" stroke="${c.s}" stroke-width="2"/>
  <rect class="mpos" id="${id}-top" x="166" y="204" width="288" height="36" rx="10" fill="#fff" stroke="#d6cebf" stroke-width="2"/>
  <path d="M190 222h240" stroke="#ece6db" stroke-width="2" stroke-dasharray="6 8"/>
  <rect x="184" y="186" width="74" height="22" rx="10" fill="#fff" stroke="#d6cebf" stroke-width="2"/>
  <rect class="frame" x="146" y="240" width="328" height="20" rx="4" fill="${c.f}" stroke="${c.s}" stroke-width="2"/>
  <!-- outer frame -->
  <rect class="frame" x="${single?130:50}" y="250" width="${single?360:520}" height="18" rx="4" fill="${c.f}" stroke="${c.s}" stroke-width="2"/>
  <rect class="frame" x="${single?130:50}" y="168" width="24" height="378" rx="4" fill="${c.f}" stroke="${c.s}" stroke-width="2"/>
  <rect class="frame" x="${single?466:546}" y="168" width="24" height="378" rx="4" fill="${c.f}" stroke="${c.s}" stroke-width="2"/>
  <!-- bottom -->
  <rect class="mpos" id="${id}-bottom" x="${bx}" y="374" width="${bw}" height="42" rx="11" fill="#fff" stroke="#d6cebf" stroke-width="2"/>
  <path d="M${bx+24} 395h${bw-48}" stroke="#ece6db" stroke-width="2" stroke-dasharray="6 8"/>
  <rect x="${bx+18}" y="354" width="78" height="24" rx="11" fill="#fff" stroke="#d6cebf" stroke-width="2"/>
  ${single?'':`<rect x="${bx+104}" y="354" width="78" height="24" rx="11" fill="#fff" stroke="#d6cebf" stroke-width="2"/>`}
  <rect class="frame" x="${single?130:50}" y="416" width="${single?360:520}" height="26" rx="4" fill="${c.f}" stroke="${c.s}" stroke-width="2"/>
  <!-- trundle -->
  ${tr?`<g class="trundle"><rect class="mpos" id="${id}-trundle" x="${bx+28}" y="452" width="${bw-56}" height="22" rx="8" fill="#fff" stroke="#d6cebf" stroke-width="2"/>
  <rect class="frame" x="${bx+16}" y="472" width="${bw-32}" height="50" rx="6" fill="${c.f}" stroke="${c.s}" stroke-width="2"/>
  <rect x="${bx+bw/2-30}" y="490" width="60" height="8" rx="4" fill="${c.s}" opacity=".6"/>
  <circle cx="${bx+40}" cy="532" r="9" fill="#16213a" opacity=".7"/><circle cx="${bx+bw-40}" cy="532" r="9" fill="#16213a" opacity=".7"/></g>`:''}
  <!-- ladder -->
  <g class="frame-l"><rect x="${single?498:578}" y="150" width="9" height="396" rx="3" fill="${c.f}" stroke="${c.s}" stroke-width="2"/><rect x="${single?534:612}" y="150" width="9" height="396" rx="3" fill="${c.f}" stroke="${c.s}" stroke-width="2"/>
  ${[200,265,330,395,460].map(y=>`<rect x="${single?498:578}" y="${y}" width="${single?45:43}" height="8" rx="3" fill="${c.f}" stroke="${c.s}" stroke-width="2"/>`).join('')}</g>
  ${o.labels?lbl(186,158,'Top bunk · Single','lbl-top')+lbl(bx+16,318,single?'Bottom bunk · Single':'Bottom bunk · Double','lbl-bottom')+(tr?lbl(bx+40,486,'Trundle · Single','lbl-trundle'):''):''}
  </svg>`;
}
function mattressSVG(thk,max,opts){
  opts=opts||{};const k=1.5,base=54,h=thk*k;const over=max&&thk>max;
  const top=base-h;const ml=max?base-max*k:null;
  return `<svg viewBox="0 0 120 62" aria-hidden="true">
   <rect x="6" y="${top}" width="108" height="${h}" rx="6" fill="${over?'#f8e4de':'#fff'}" stroke="${over?'#b5452f':'#cdc4b4'}" stroke-width="1.6"/>
   ${h>16?`<path d="M14 ${top+h/2}h92" stroke="${over?'#e8b9ac':'#ebe5da'}" stroke-width="1.4" stroke-dasharray="4 5"/>`:''}
   <rect x="2" y="${base}" width="116" height="5" rx="2" fill="#c99a66"/>
   ${max?`<path d="M0 ${ml}h120" stroke="${over?'#b5452f':'#3f6b57'}" stroke-width="1.4" stroke-dasharray="3 3"/><text x="118" y="${ml-3}" text-anchor="end" font-family="Manrope,sans-serif" font-size="8.5" font-weight="800" fill="${over?'#b5452f':'#3f6b57'}">max ${max}cm</text>`:''}
  </svg>`;
}
function mattressCardSVG(p){
  return `<svg viewBox="0 0 300 220" aria-hidden="true"><ellipse cx="150" cy="182" rx="128" ry="10" fill="#16213a" opacity=".07"/>
  <path d="M40 120 150 86l110 34-110 40z" fill="#fff" stroke="#cdc4b4" stroke-width="2"/>
  <path d="M40 120v${p.thk*1.6}l110 40v-${p.thk*1.6}z" fill="#f4f0e8" stroke="#cdc4b4" stroke-width="2"/>
  <path d="M150 160v${p.thk*1.6}l110-40v-${p.thk*1.6}z" fill="#ebe5da" stroke="#cdc4b4" stroke-width="2"/>
  <path d="M70 116 150 92l80 26" fill="none" stroke="#ece6db" stroke-width="2" stroke-dasharray="5 7"/>
  <text x="150" y="40" text-anchor="middle" font-family="Manrope,sans-serif" font-size="15" font-weight="800" fill="#16213a">${p.size} · ${p.thk}cm</text></svg>`;
}
function mediaFor(p,w){
  if(p.img) return `<img src="${U(p.img,w||600)}" alt="${p.name}" loading="lazy">`;
  if(p.type==='bunk') return bunkSVG(p.svg);
  if(p.type==='mattress') return mattressCardSVG(p);
  return '';
}
window.BEDS.bunkSVG=bunkSVG;window.BEDS.mattressSVG=mattressSVG;

/* ---------- toast ---------- */
let tt;function toast(msg){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.innerHTML=msg;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2800)}
window.BEDS.toast=toast;

/* ---------- header / footer ---------- */
const NAV=[
  ['Single Beds'],['King Single Beds'],['Double Beds'],['Queen Beds'],['King Beds'],
  ['Bunks','bunks'],['Mattresses','mattresses'],['Furniture'],['Sale','sale']
];
const MEGA={
  bunks:`<div class="mega"><div class="wrap mega__in">
    <div><h4>By type</h4><ul><li><a href="${R}product/">Single-over-Double <span class="tag">Popular</span></a></li><li><a href="${R}#shop">Single Bunks</a></li><li><a href="${R}#shop">Bunks with Trundle</a></li><li><a href="${R}#shop">Triple Sleepers</a></li><li><a href="${R}#shop">Loft Beds</a></li></ul></div>
    <div><h4>By finish</h4><ul><li><a href="${R}#shop">Natural Oak</a></li><li><a href="${R}#shop">White</a></li><li><a href="${R}#shop">Charcoal</a></li><li><a href="${R}#shop">Metal</a></li></ul></div>
    <div><h4>Helpful</h4><ul><li><a href="${R}product/#sleepset">Mattress fit guide</a></li><li><a href="${R}#delivery">Delivery &amp; pickup</a></li><li><a href="${R}#faq">Bunk safety FAQ</a></li></ul></div>
    <a class="mega__card" href="${R}product/"><img src="${U('photo-1522771739844-6a9f6d5f14af',600)}" alt=""><span>Bunks that come with the right mattresses<small>Matched per sleeping position · 15% off →</small></span></a>
  </div></div>`,
  mattresses:`<div class="mega"><div class="wrap mega__in">
    <div><h4>By size</h4><ul><li><a href="${R}#shop">Single</a></li><li><a href="${R}#shop">King Single</a></li><li><a href="${R}#shop">Double</a></li><li><a href="${R}#shop">Queen</a></li><li><a href="${R}#shop">King</a></li></ul></div>
    <div><h4>By type</h4><ul><li><a href="${R}#shop">Pocket Spring</a></li><li><a href="${R}#shop">Hybrid</a></li><li><a href="${R}#shop">Foam &amp; Latex</a></li><li><a href="${R}#shop">Bunk &amp; Trundle <span class="tag">Low profile</span></a></li></ul></div>
    <div><h4>Accessories</h4><ul><li><a href="${R}#shop">Protectors</a></li><li><a href="${R}#shop">Pillows</a></li><li><a href="${R}#shop">Sheet sets</a></li></ul></div>
    <a class="mega__card" href="${R}#shop"><img src="${U('photo-1588046130717-0eb0c9a3ba15',600)}" alt=""><span>Hybrid Luxe Queen<small>Now $1,149 · was $1,399 →</small></span></a>
  </div></div>`
};
function header(){
  const h=$('#site-header');if(!h) return;
  h.innerHTML=`
  <div class="demo-ribbon"><b>Concept prototype</b> for beds.net.au · design &amp; UX preview, not the live store · <a href="${R}admin/" style="color:#9fd1b7;font-weight:700;text-decoration:underline">See the admin view →</a></div>
  <div class="announce"><div class="announce__track">
    <span>${ic.truck.replace('22','16').replace('22','16')} Free metro delivery over ${money(FREE_METRO)}</span>
    <span>Afterpay &amp; Zip available</span>
    <span>Click &amp; collect from our Sydney and Melbourne warehouses</span>
  </div></div>
  <header class="hdr">
    <div class="wrap hdr__bar">
      <button class="icon-btn menu-toggle" aria-label="Open menu">${ic.menu}</button>
      <a class="logo" href="${R}" aria-label="beds.net.au home"><span class="logo__mark"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18V7M21 18v-4a3 3 0 0 0-3-3h-8v5M3 15h18"/></svg></span>beds<small>.net.au</small></a>
      <label class="hdr__search">${ic.search}<span class="sr">Search</span><input type="search" placeholder="Search beds, bunks, mattresses…"></label>
      <div class="hdr__icons">
        <a class="icon-btn" href="#" aria-label="Account" data-demo>${ic.user}</a>
        <button class="icon-btn cart-btn" aria-label="Open cart">${ic.bag}<span class="cart-count">0</span></button>
      </div>
    </div>
    <nav class="nav" aria-label="Main"><ul class="wrap nav__list">
      ${NAV.map(([t,k])=>k&&MEGA[k]?`<li class="nav__item"><a class="nav__link" href="${k==='bunks'?R+'product/':R+'#shop'}" aria-haspopup="true">${t}${ic.chev}</a>${MEGA[k]}</li>`:`<li class="nav__item"><a class="nav__link ${k==='sale'?'nav__link--sale':''}" href="${R}#shop">${t}</a></li>`).join('')}
    </ul></nav>
  </header>
  <div class="mnav" aria-hidden="true"><div class="mnav__scrim"></div><div class="mnav__panel">
    <div class="mnav__head"><span class="logo"><span class="logo__mark"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M3 18V7M21 18v-4a3 3 0 0 0-3-3h-8v5M3 15h18"/></svg></span>beds<small>.net.au</small></span><button class="cart__close mnav-close" aria-label="Close menu">${ic.x}</button></div>
    ${NAV.map(([t,k])=>`<a href="${k==='bunks'?R+'product/':R+'#shop'}" ${k==='sale'?'style="color:var(--sale)"':''}>${t}<span>›</span></a>`).join('')}
  </div></div>`;
  // mega hover/click
  $$('.nav__item',h).forEach(li=>{
    if(!$('.mega',li)) return;let tm;
    li.addEventListener('mouseenter',()=>{clearTimeout(tm);$$('.nav__item.open').forEach(o=>o!==li&&o.classList.remove('open'));li.classList.add('open')});
    li.addEventListener('mouseleave',()=>{tm=setTimeout(()=>li.classList.remove('open'),140)});
    li.addEventListener('focusin',()=>li.classList.add('open'));
    li.addEventListener('focusout',e=>{if(!li.contains(e.relatedTarget)) li.classList.remove('open')});
  });
  const mn=$('.mnav');
  $('.menu-toggle',h).onclick=()=>{mn.classList.add('open');mn.setAttribute('aria-hidden','false')};
  const closeM=()=>{mn.classList.remove('open');mn.setAttribute('aria-hidden','true')};
  $('.mnav__scrim',h).onclick=closeM;$('.mnav-close',h).onclick=closeM;
  $$('.mnav a',h).forEach(a=>a.addEventListener('click',closeM));
  $('.cart-btn',h).onclick=()=>openCart();
  $$('[data-demo]',h).forEach(a=>a.addEventListener('click',e=>{e.preventDefault();toast('Customer accounts are part of the live Shopify build')}));
}
function footer(){
  const f=$('#site-footer');if(!f) return;
  f.innerHTML=`<footer class="ftr"><div class="wrap">
    <div class="ftr__grid">
      <div><a class="logo" href="${R}"><span class="logo__mark"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M3 18V7M21 18v-4a3 3 0 0 0-3-3h-8v5M3 15h18"/></svg></span>beds<small style="color:#8f98ab">.net.au</small></a>
        <p style="margin:16px 0 20px;max-width:320px">Beds, bunks and mattresses delivered Australia-wide from our Sydney, Melbourne and Brisbane warehouses.</p>
        <div class="pay-icons"><span class="pay">VISA</span><span class="pay">Mastercard</span><span class="pay">AMEX</span><span class="pay">Apple Pay</span><span class="pay">G Pay</span><span class="pay pay--pp">PayPal</span><span class="pay pay--ap">afterpay</span><span class="pay pay--zip">zip</span></div></div>
      <div><h4>Shop</h4><ul><li><a href="${R}#shop">Beds by size</a></li><li><a href="${R}product/">Bunks</a></li><li><a href="${R}#shop">Mattresses</a></li><li><a href="${R}#shop">Furniture</a></li><li><a href="${R}#shop">Sale</a></li></ul></div>
      <div><h4>Help</h4><ul><li><a href="#" data-pol>Shipping &amp; delivery</a></li><li><a href="#" data-pol>Returns &amp; exchanges</a></li><li><a href="#" data-pol>Warranty</a></li><li><a href="${R}#faq">FAQ</a></li><li><a href="#" data-pol>Contact us</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="#" data-pol>About</a></li><li><a href="#" data-pol>Privacy policy</a></li><li><a href="#" data-pol>Terms of service</a></li><li><a href="#" data-pol>Refund policy</a></li></ul></div>
    </div>
    <div class="ftr__bottom"><span>© 2026 beds.net.au · Concept prototype</span><span>Prices in AUD incl. GST</span></div>
  </div></footer>`;
  $$('[data-pol]',f).forEach(a=>a.addEventListener('click',()=>toast('Store &amp; policy pages are published from your supplied wording in the live build')));
}

/* ---------- cart ---------- */
let cart=store.get('bna_cart',[]);
const save=()=>store.set('bna_cart',cart);
const hasBed=()=>cart.some(l=>P[l.id]&&(P[l.id].type==='bed'||P[l.id].type==='bunk'));
function unitPrice(l){
  const p=P[l.id];let base=p.price+(l.add||0);
  const offer=hasBed()&&OFFER.types.includes(p.type)&&!OFFER.exclude.includes(p.id);
  return {base,now:offer?Math.round(base*(1-OFFER.pct/100)*100)/100:base,offer};
}
function addToCart(id,opts){
  opts=opts||{};const key=id+'|'+(opts.variant||'')+'|'+(opts.pos||'');
  const ex=cart.find(l=>l.key===key);
  if(ex) ex.qty+=opts.qty||1; else cart.push({key,id,qty:opts.qty||1,variant:opts.variant||'',pos:opts.pos||'',add:opts.add||0});
  save();renderCart();bump();
}
window.BEDS.addToCart=addToCart;window.BEDS.openCart=()=>openCart();
function bump(){const c=$('.cart-count');if(c){c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump')}}
function cartEls(){
  if($('.cart')) return;
  const d=document.createElement('div');d.className='cart';d.setAttribute('aria-hidden','true');
  d.innerHTML=`<div class="cart__scrim"></div><aside class="cart__panel" role="dialog" aria-label="Your cart">
   <div class="cart__head"><h3>Your cart<sup class="cart-n"></sup></h3><button class="cart__close" aria-label="Close cart">${ic.x}</button></div>
   <div class="cart__progress"></div>
   <div class="cart__body"></div>
   <div class="cart__foot"></div></aside>`;
  document.body.appendChild(d);
  $('.cart__scrim',d).onclick=closeCart;$('.cart__close',d).onclick=closeCart;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();closeNotes()}});
}
function openCart(){cartEls();renderCart();const c=$('.cart');c.classList.add('open');c.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>$('.cart__close').focus(),50)}
function closeCart(){const c=$('.cart');if(!c) return;c.classList.remove('open');c.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function upsellsFor(){
  const ids=cart.map(l=>l.id);const s=new Set();
  const types=cart.map(l=>P[l.id].type);
  if(cart.some(l=>P[l.id].type==='bunk')){['a-prot-s','a-prot-d','a-pillow','a-sheets'].forEach(x=>s.add(x))}
  if(cart.some(l=>P[l.id].type==='bed')){['a-prot-q','a-pillow-q','m-hybrid-q'].forEach(x=>s.add(x))}
  if(!s.size){['a-pillow','a-prot-s','a-sheets','a-pillow-q'].forEach(x=>s.add(x))}
  return [...s].filter(x=>!ids.includes(x)).slice(0,5);
}
function renderCart(){
  const n=cart.reduce((a,l)=>a+l.qty,0);
  $$('.cart-count').forEach(c=>{c.textContent=n;c.classList.toggle('on',n>0)});
  const panel=$('.cart');if(!panel) return;
  $('.cart-n').textContent=n?`(${n})`:'';
  let sub=0,was=0;cart.forEach(l=>{const u=unitPrice(l);sub+=u.now*l.qty;was+=(u.base+(P[l.id].was?P[l.id].was-P[l.id].price:0))*l.qty});
  const prog=Math.min(100,sub/FREE_METRO*100);
  $('.cart__progress').innerHTML=sub>=FREE_METRO?`🎉 You've unlocked <b>free metro delivery</b><div class="bar"><i style="width:100%"></i></div>`:`You're <b>${money(FREE_METRO-sub)}</b> away from free metro delivery<div class="bar"><i style="width:${prog}%"></i></div>`;
  const body=$('.cart__body');
  if(!cart.length){
    body.innerHTML=`<div class="cart__empty">${ic.bed}<p><b style="color:var(--ink)">Your cart is empty</b><br>Start with a bed, and we'll match the mattresses.</p><a class="btn btn--dark btn--sm" style="margin-top:16px" href="${R}product/">Shop bunks</a></div>`+upsellHTML();
  } else {
    const groups={};cart.forEach(l=>{(groups[P[l.id].wh]=groups[P[l.id].wh]||[]).push(l)});
    const gk=Object.keys(groups);
    body.innerHTML=(gk.length>1?`<p style="font-size:13px;color:var(--muted);margin-top:6px">Your order ships from <b style="color:var(--ink)">${gk.length} warehouses</b>. Freight is quoted live per warehouse at checkout.</p>`:'')+
    gk.map(w=>`<div class="wh-group"><div class="wh-group__h"><i style="background:${WH[w].color}"></i>Ships from ${WH[w].name}</div>${groups[w].map(lineHTML).join('')}</div>`).join('')+upsellHTML();
  }
  const saving=Math.max(0,was-sub);
  const multiWh=new Set(cart.map(l=>P[l.id].wh)).size;
  $('.cart__foot').innerHTML=cart.length?`<div class="cart__rows">
     <div><span class="muted">Subtotal</span><span>${money2(sub)}</span></div>
     ${saving>0?`<div><span class="save">You're saving</span><span class="save">−${money2(saving)}</span></div>`:''}
     <div><span class="muted">Freight${multiWh>1?` (${multiWh} warehouses)`:''}</span><span class="muted">Live quote at checkout</span></div>
     <div class="tot"><span>Total</span><span>${money2(sub)}</span></div></div>
     <button class="btn btn--dark btn--block checkout-btn">Checkout securely ${ic.arrow}</button>
     <div class="cart__bnpl">or 4 interest-free payments of <b style="color:var(--ink)">${money2(sub/4)}</b> with <span class="pay pay--ap">afterpay</span><span class="pay pay--zip">zip</span></div>
     <div class="cart__note">GST included · PayPal, Apple Pay &amp; Google Pay at checkout</div>`:'';
  const cb=$('.checkout-btn');if(cb) cb.onclick=()=>{location.href=R+'checkout/'};
  $$('[data-q]',body).forEach(b=>b.onclick=()=>{const l=cart.find(x=>x.key===b.dataset.k);if(!l) return;l.qty+=+b.dataset.q;if(l.qty<1) cart=cart.filter(x=>x!==l);save();renderCart()});
  $$('[data-rm]',body).forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.key!==b.dataset.rm);save();renderCart()});
  $$('[data-up]',body).forEach(b=>b.onclick=()=>{addToCart(b.dataset.up);toast(`${ic.check} Added ${P[b.dataset.up].name}`)});
}
function preOf(l){const p=P[l.id];if(p.pre) return p.pre;if(p.id==='bk-harbour'&&/Charcoal/.test(l.variant||'')&&PRE.on&&!((ADMIN.inv||{}).charcoal>0)) return PRE.eta;return null}
window.BEDS.preOf=preOf;window.BEDS.unitPrice=l=>unitPrice(l);window.BEDS.getCart=()=>cart;window.BEDS.setCart=c=>{cart=c;save();renderCart()};window.BEDS.ic=ic;
function lineHTML(l){
  const p=P[l.id],u=unitPrice(l);
  return `<div class="line"><div class="line__img">${mediaFor(p,200)}</div>
   <div><div class="line__name">${p.name}</div>
    ${l.variant||l.pos?`<div class="line__var">${[l.pos,l.variant].filter(Boolean).join(' · ')}</div>`:''}
    ${u.offer?`<span class="line__flag line__flag--offer">${ic.check} Bed offer −${OFFER.pct}%</span>`:''}
    ${preOf(l)?`<span class="line__flag line__flag--pre">${ic.clock.replace(/22/g,'12')} Pre-order · ETA ${preOf(l)}</span>`:''}
    <div class="line__ctrl"><div class="mini-qty"><button data-q="-1" data-k="${l.key}" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="1" data-k="${l.key}" aria-label="Increase">+</button></div><button class="line__rm" data-rm="${l.key}">Remove</button></div></div>
   <div class="line__price">${money2(u.now*l.qty)}${u.offer?`<s>${money2(u.base*l.qty)}</s>`:p.was?`<s>${money2((p.was+(l.add||0))*l.qty)}</s>`:''}</div></div>`;
}
function upsellHTML(){
  const ups=upsellsFor();if(!ups.length) return '';
  const on=hasBed();
  return `<div class="upsell"><div class="upsell__h"><b>Complete the room</b>${on?`<span>−${OFFER.pct}% with your bed</span>`:''}</div><div class="upsell__rail">
   ${ups.map(id=>{const p=P[id];const off=on&&OFFER.types.includes(p.type)&&!OFFER.exclude.includes(id);const pr=off?p.price*(1-OFFER.pct/100):p.price;
    return `<div class="ucard"><div class="ucard__img">${mediaFor(p,300)}</div><b>${p.name}</b><span class="pr">${money2(pr)}${off?`<s>${money(p.price)}</s>`:''}</span><button data-up="${id}">+ Add</button></div>`}).join('')}
  </div></div>`;
}

/* ---------- "how it's built" notes ---------- */
function notes(html){
  if(!html) return;
  const fab=document.createElement('button');fab.className='build-fab';fab.innerHTML='<i></i>How this works<span> in Shopify</span>';document.body.appendChild(fab);
  const d=document.createElement('div');d.className='notes';d.setAttribute('aria-hidden','true');
  d.innerHTML=`<div class="notes__scrim"></div><div class="notes__panel" role="dialog" aria-label="How this is built"><div style="display:flex;justify-content:space-between;align-items:center"><span class="eyebrow">Build notes</span><button class="cart__close notes-x" aria-label="Close">${ic.x}</button></div>${html}</div>`;
  document.body.appendChild(d);
  fab.onclick=()=>{d.classList.add('open');d.setAttribute('aria-hidden','false')};
  $('.notes__scrim',d).onclick=closeNotes;$('.notes-x',d).onclick=closeNotes;
}
function closeNotes(){const d=$('.notes');if(d){d.classList.remove('open');d.setAttribute('aria-hidden','true')}}
window.BEDS.notes=notes;

/* ---------- product card ---------- */
function cardHTML(p){
  const b=p.badge?`<span class="badge badge--${p.badge[0]}">${p.badge[1]}</span>`:'';
  const stock=p.oos?`<span class="pcard__stock" style="color:var(--muted)"><i class="dot dot--off"></i>Out of stock</span>`:p.pre?`<span class="pcard__stock" style="color:#9a5c26"><i class="dot dot--warm"></i>Pre-order · ETA ${p.pre}</span>`:`<span class="pcard__stock"><i class="dot"></i>In stock · ${WH[p.wh].short}</span>`;
  const href=p.url||'#';
  return `<article class="pcard"><div class="pcard__top"><a class="pcard__media" href="${href}" ${p.url?'':'data-nolink'}>${mediaFor(p,600)}<div class="badges">${b}</div></a>
   <div class="pcard__quick">${p.oos?`<button class="btn btn--light btn--block btn--sm" data-notify>Notify me</button>`:`<button class="btn btn--dark btn--block btn--sm" data-add="${p.id}">${p.pre?'Pre-order':p.type==='bunk'&&p.url?'Choose options':'Quick add'}</button>`}</div></div>
   <div class="pcard__body"><span class="pcard__cat">${p.cat||p.size||''}</span><a class="pcard__name" href="${href}" ${p.url?'':'data-nolink'}>${p.name}</a>
    ${p.rating?`<span class="stars">★★★★★<small>${p.rating} (${p.reviews})</small></span>`:''}
    <div class="pcard__price"><b>${money(p.price)}</b>${p.was?`<s>${money(p.was)}</s>`:''}</div>
    <span class="pcard__bnpl">or 4 × ${money2(p.price/4)} with Afterpay</span>${stock}</div></article>`;
}
window.BEDS.cardHTML=cardHTML;

/* ---------- reveal ---------- */
function reveal(){
  const els=$$('.rv');if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
  els.forEach(e=>io.observe(e));
}

/* ---------- postcode logic (demo) ---------- */
function pcInfo(pc){
  pc=String(pc||'').trim();if(!/^\d{4}$/.test(pc)) return null;
  const n=+pc;let st='NSW',near='syd',metro=false,days='3–6';
  if(n>=2000&&n<=2999){st=n>=2600&&n<=2620?'ACT':'NSW';near='syd';metro=n<=2234||(n>=2555&&n<=2574)||(n>=2745&&n<=2786)}
  else if(n>=3000&&n<=3999){st='VIC';near='mel';metro=n<=3207||(n>=3335&&n<=3341)||(n>=3427&&n<=3442)||(n>=3750&&n<=3810)}
  else if(n>=4000&&n<=4999){st='QLD';near='bne';metro=n<=4207||(n>=4300&&n<=4305)||(n>=4500&&n<=4519)}
  else if(n>=5000&&n<=5999){st='SA';near='mel';days='5–8'}
  else if(n>=6000&&n<=6999){st='WA';near='mel';days='7–12'}
  else if(n>=7000&&n<=7999){st='TAS';near='mel';days='6–9'}
  else if(n>=800&&n<=999){st='NT';near='bne';days='8–14'}
  else return null;
  if(metro) days='2–4';
  const pickup=metro&&WH[near].pickup;
  return {pc,st,near,metro,days,pickup};
}
window.BEDS.pcInfo=pcInfo;

/* ---------- HOME ---------- */
function home(){
  const grid=$('#pgrid');if(!grid) return;
  const sets={
    best:['bk-harbour','b-aria','m-hybrid-q','b-oslo','bk-coast','b-luna','b-noah','b-ellis'],
    beds:['b-aria','b-oslo','b-luna','b-harper','b-noah','b-ellis'],
    bunks:['bk-harbour','bk-coast','bk-ridge'],
    mattresses:['m-hybrid-q','m-pocket-k','m-bunk-s','m-pocket-d']
  };
  P['m-bunk-s'].cat='Mattresses';P['m-pocket-d'].cat='Mattresses';
  const draw=k=>{grid.innerHTML=sets[k].map(id=>cardHTML(P[id])).join('');bindCards(grid)};
  $$('#ptabs .tab').forEach(t=>t.onclick=()=>{$$('#ptabs .tab').forEach(x=>{x.classList.toggle('on',x===t);x.setAttribute('aria-selected',x===t)});draw(t.dataset.k)});
  draw('best');
  // bunk feature visual
  const fv=$('#feat-bunk');if(fv){fv.innerHTML=bunkSVG({color:'oak',trundle:true,labels:true,id:'fb'});$$('.poslbl',fv).forEach(g=>g.classList.add('show'))}
  // postcode
  const f=$('#pc-form');if(f) f.onsubmit=e=>{e.preventDefault();const r=pcInfo($('#pc-in').value);const o=$('#pc-out');
    if(!r){o.innerHTML=`<div class="pc-out">Please enter a valid 4-digit Australian postcode.</div>`;return}
    $$('.wh-dot').forEach(d=>d.style.opacity=d.dataset.wh===r.near?1:.35);
    o.innerHTML=`<div class="pc-out"><div><span>Delivering to <b>${r.pc} ${r.st}</b></span><span class="ok">${r.metro?'Metro area':'Regional'}</span></div>
     <div><span>Nearest warehouse</span><b>${WH[r.near].short}</b></div>
     <div><span>Estimated delivery</span><b>${r.days} business days</b></div>
     <div><span>Click &amp; collect</span><b class="${r.pickup?'ok':''}">${r.pickup?'Available, free':'Not available for this postcode'}</b></div></div>`};
}
function bindCards(root){
  $$('[data-add]',root).forEach(b=>b.onclick=e=>{e.preventDefault();const p=P[b.dataset.add];
    if(p.type==='bunk'&&p.url){location.href=p.url;return}
    addToCart(p.id,p.type==='bunk'?{variant:'Natural Oak'}:{});openCart()});
  $$('[data-nolink]',root).forEach(a=>a.addEventListener('click',e=>{e.preventDefault();toast('Only the Harbour bunk has a full product page in this demo')}));
  $$('[data-notify]',root).forEach(b=>b.onclick=()=>toast('Back-in-stock alert set (shown when stock hits 0)'));
}

/* ---------- PDP ---------- */
function pdp(){
  const root=$('#pdp');if(!root) return;
  const bed=P['bk-harbour'];
  const COLORS=[{k:'oak',n:'Natural Oak',hex:'#c99a66'},{k:'white',n:'White',hex:'#f3efe7'},{k:'charcoal',n:'Charcoal',hex:'#3d424c',pre:PRE.on?PRE.eta:null}];
  // positions are metafields on the bed: size + max thickness for each sleeping position
  const POS={
    top:{label:'Top bunk',size:'Single',max:16,note:'Guard rail height needs a low-profile mattress'},
    bottom:{label:'Bottom bunk',size:'Double',max:22,note:'Standard double, up to 22cm'},
    trundle:{label:'Trundle',size:'Single',max:12,note:'Must slide under the bottom bunk'}
  };
  const INV=Object.assign({oak:4,white:7,charcoal:0},ADMIN.inv||{});
  if(ADMIN.pos) Object.keys(ADMIN.pos).forEach(k=>{if(POS[k]) Object.assign(POS[k],ADMIN.pos[k])});
  const st={color:'oak',trundle:false,qty:1,tab:'top',sel:{top:'m-bunk-s',bottom:'m-bunk-d',trundle:'m-slim-s'},showHidden:{}};
  const mats=Object.values(P).filter(p=>p.type==='mattress'&&!p.cat);

  const gal=$('#gal-main');const thumbsEl=$('#thumbs');
  const views=[{k:'render'},{k:'trundle'},{k:'photo',img:'photo-1522771739844-6a9f6d5f14af'},{k:'photo',img:'photo-1631049552057-403cdb8f0658'}];
  let view=0;
  function drawGallery(){
    const v=views[view];
    if(v.k==='photo'){gal.innerHTML=`<img src="${U(v.img,1100)}" alt="Harbour bunk lifestyle">`;}
    else{gal.innerHTML=bunkSVG({color:st.color,trundle:v.k==='trundle'||st.trundle,labels:true,id:'gb'})+`<div class="gallery__hint"><span>${COLORS.find(c=>c.k===st.color).n}${(v.k==='trundle'||st.trundle)?' · with trundle':''}</span><span>Tap a mattress below to see where it goes</span></div>`;syncSVG()}
    thumbsEl.innerHTML=views.map((t,i)=>`<button class="thumb ${i===view?'on':''}" data-v="${i}" aria-label="View ${i+1}">${t.k==='photo'?`<img src="${U(t.img,300)}" alt="">`:bunkSVG({color:st.color,trundle:t.k==='trundle'})}</button>`).join('');
    $$('.thumb',thumbsEl).forEach(b=>b.onclick=()=>{view=+b.dataset.v;drawGallery()});
  }
  function syncSVG(){
    const s=$('#gb');if(!s) return;
    ['top','bottom','trundle'].forEach(k=>{const r=$('#gb-'+k);if(!r) return;r.classList.toggle('hl',k===st.tab);r.classList.toggle('filled',!!st.sel[k]&&k!==st.tab)});
    $$('.poslbl',s).forEach(g=>g.classList.toggle('show',g.classList.contains('lbl-'+st.tab)));
  }
  function positions(){return st.trundle?['top','bottom','trundle']:['top','bottom']}
  function offerPrice(p){return OFFER.exclude.includes(p.id)?p.price:Math.round(p.price*(1-OFFER.pct/100)*100)/100}
  function bedPrice(){return bed.price+(st.trundle?349:0)}
  function bedWas(){return bed.was+(st.trundle?349:0)}
  function drawBuy(){
    $('#price').innerHTML=`<b>${money(bedPrice())}</b><s>${money(bedWas())}</s><span class="save-pill">Save ${money(bedWas()-bedPrice())}</span>`;
    $('#bnpl').innerHTML=`or 4 interest-free payments of <b>${money2(bedPrice()/4)}</b> with <span class="pay pay--ap">afterpay</span> or <span class="pay pay--zip">zip</span>`;
    $('#swatches').innerHTML=COLORS.map(c=>`<button class="swatch ${st.color===c.k?'on':''}" data-c="${c.k}" aria-pressed="${st.color===c.k}"><i style="background:${c.hex}"></i>${c.n}${INV[c.k]<=0?(c.pre?'<small>PRE-ORDER</small>':'<small style="color:#9aa1ad">SOLD OUT</small>'):''}</button>`).join('');
    $('#color-name').textContent=COLORS.find(c=>c.k===st.color).n;
    $$('#swatches .swatch').forEach(b=>b.onclick=()=>{st.color=b.dataset.c;drawBuy();drawGallery()});
    $$('.config').forEach(b=>{b.classList.toggle('on',(b.dataset.t==='1')===st.trundle);b.setAttribute('aria-pressed',(b.dataset.t==='1')===st.trundle)});
    const col=COLORS.find(c=>c.k===st.color);
    const qty=INV[col.k];const pre=qty<=0&&col.pre;const oos=qty<=0&&!col.pre;
    $('#stock').className='stock'+(pre?' stock--pre':'');
    $('#stock').innerHTML=pre?`<i class="dot dot--warm"></i><div><b>Pre-order · ETA ${col.pre}</b><span>${col.n} is on its way from ${WH.syd.sup}. Order now to lock in this price. We'll email you if the date changes.</span></div>`
      :oos?`<i class="dot dot--off"></i><div><b>Out of stock</b><span>${col.n} is sold out at ${WH.syd.name}. Choose another finish, or we'll let you know when it's back.</span></div>`
      :`<i class="dot"></i><div><b>In stock · ships from ${WH.syd.name}</b><span>${qty<=(ADMIN.threshold==null?2:ADMIN.threshold)?`Only ${qty} left`:`${qty} available`} in ${col.n}. Dispatches in 1–2 business days.</span></div>`;
    $('#atc').innerHTML=pre?`Pre-order now ${ic.arrow}`:oos?'Out of stock':`Add to cart ${ic.arrow}`;
    $('#atc').disabled=oos;$('#sticky-atc-btn').disabled=oos;$('#atc').style.opacity=oos?.45:'';
    drawSet();
    $('#sticky-name').textContent=`Harbour Bunk · ${col.n}`;
  }
  function drawSet(){
    if(!st.trundle&&st.tab==='trundle') st.tab='top';
    const pos=positions();
    $('#postabs').innerHTML=pos.map(k=>{const s=st.sel[k]?P[st.sel[k]]:null;return `<button class="postab ${st.tab===k?'on':''}" data-p="${k}" role="tab" aria-selected="${st.tab===k}"><b>${POS[k].label}</b><span>${POS[k].size} · max ${POS[k].max}cm</span><span class="chosen ${s?'':'none'}">${s?ic.check+' '+s.name.replace(' Mattress',''):'No mattress'}</span></button>`}).join('');
    $$('.postab').forEach(b=>b.onclick=()=>{st.tab=b.dataset.p;drawSet();syncSVG();if(view>1){view=0;drawGallery()}});
    const k=st.tab,ps=POS[k];
    const sized=mats.filter(m=>m.size===ps.size);
    const fit=sized.filter(m=>m.thk<=ps.max),nofit=sized.filter(m=>m.thk>ps.max);
    const opt=m=>{const ex=OFFER.exclude.includes(m.id);const pr=offerPrice(m);return `<button class="mopt ${st.sel[k]===m.id?'on':''}" data-m="${m.id}" aria-pressed="${st.sel[k]===m.id}"><span class="radio"></span><span class="mopt__vis">${mattressSVG(m.thk,ps.max)}</span><span><span class="mopt__name">${m.name}</span><span class="mopt__meta"><span class="fitok">${ic.check} Fits</span> · ${m.size} · ${m.thk}cm · ${m.feel}</span></span><span class="mopt__price"><b>${money2(pr)}</b>${ex?'<small style="color:var(--muted)">No offer</small>':`<s>${money(m.price)}</s><small>−${OFFER.pct}% with bed</small>`}</span></button>`};
    const bad=m=>`<div class="mopt disabled" aria-disabled="true"><span class="radio"></span><span class="mopt__vis">${mattressSVG(m.thk,ps.max)}</span><span><span class="mopt__name">${m.name}</span><span class="mopt__meta">Too thick: ${m.thk}cm is over the ${ps.max}cm limit</span></span><span class="mopt__price"><b>${money(m.price)}</b></span></div>`;
    $('#pospanel').innerHTML=`<div class="pos-spec"><span>${ps.label}</span><span>Size: ${ps.size}</span><span>Max thickness: ${ps.max}cm</span><span class="fit">${fit.length} mattresses fit</span></div>
      <div class="mlist">${fit.map(opt).join('')}<button class="mopt mopt--none ${!st.sel[k]?'on':''}" data-m=""><span class="radio"></span><span class="mopt__name">No mattress for the ${ps.label.toLowerCase()}, thanks</span></button></div>
      ${nofit.length?`<button class="hidden-toggle" id="ht" aria-expanded="${!!st.showHidden[k]}">${st.showHidden[k]?'Hide':'Show'} ${nofit.length} ${ps.size.toLowerCase()} mattress${nofit.length>1?'es':''} that won't fit ${ic.chev}</button>${st.showHidden[k]?`<div class="hidden-wrap">${nofit.map(bad).join('')}</div>`:''}`:''}`;
    $$('#pospanel .mopt[data-m]').forEach(b=>b.onclick=()=>{st.sel[k]=b.dataset.m||null;
      // auto-advance to next position that has no choice yet
      drawSet();syncSVG();
    });
    const ht=$('#ht');if(ht) ht.onclick=()=>{st.showHidden[k]=!st.showHidden[k];drawSet()};
    // summary
    const chosen=pos.filter(p=>st.sel[p]).map(p=>({pos:p,m:P[st.sel[p]]}));
    const mNow=chosen.reduce((a,c)=>a+offerPrice(c.m),0),mWas=chosen.reduce((a,c)=>a+c.m.price,0);
    const total=bedPrice()+mNow;const saving=(bedWas()-bedPrice())+(mWas-mNow);
    $('#setsum').innerHTML=`<div><span class="muted">Harbour bunk${st.trundle?' + trundle':''}</span><span>${money2(bedPrice())}</span></div>
      ${chosen.map(c=>`<div><span class="muted">${POS[c.pos].label}: ${c.m.name.replace(' Mattress','')}</span><span>${money2(offerPrice(c.m))}</span></div>`).join('')}
      <div><span class="save">Total savings</span><span class="save">−${money2(saving)}</span></div>
      <div class="tot"><span>Sleep set total</span><span>${money2(total)}</span></div>`;
    $('#sticky-price').textContent=`${money2(total)} · ${chosen.length} mattress${chosen.length===1?'':'es'}`;
    $('#atc-sub').textContent=chosen.length?`Adds the bed + ${chosen.length} mattress${chosen.length>1?'es':''} to your cart`:'Adds the bed to your cart';
  }
  $$('.config').forEach(b=>b.onclick=()=>{st.trundle=b.dataset.t==='1';if(st.trundle){st.tab='trundle'}drawBuy();view=0;drawGallery()});
  $('#qminus').onclick=()=>{st.qty=Math.max(1,st.qty-1);$('#qn').textContent=st.qty};
  $('#qplus').onclick=()=>{st.qty=Math.min(9,st.qty+1);$('#qn').textContent=st.qty};
  const doAdd=()=>{
    const col=COLORS.find(c=>c.k===st.color);
    addToCart('bk-harbour',{qty:st.qty,variant:col.n+(st.trundle?' · with trundle':''),add:st.trundle?349:0});
    positions().forEach(p=>{if(st.sel[p]) addToCart(st.sel[p],{qty:st.qty,pos:POS[p].label+' mattress'})});
    openCart();
  };
  $('#atc').onclick=doAdd;$('#sticky-atc-btn').onclick=doAdd;
  // details tabs
  $$('.dtab').forEach(t=>t.onclick=()=>{$$('.dtab').forEach(x=>{x.classList.toggle('on',x===t);x.setAttribute('aria-selected',x===t)});$$('.dpanel').forEach(p=>p.classList.toggle('on',p.id===t.dataset.d))});
  // delivery mini
  const df=$('#dm-form');df.onsubmit=e=>{e.preventDefault();const r=pcInfo($('#dm-in').value);const o=$('#dm-out');
    if(!r){o.innerHTML=`<div class="pc-out">Enter a valid 4-digit postcode.</div>`;return}
    o.innerHTML=`<div class="pc-out"><div><span>To <b>${r.pc} ${r.st}</b> from ${WH.syd.short}</span><b>${r.days} business days</b></div><div><span>Click &amp; collect (${WH.syd.short})</span><b class="${r.pickup&&r.near==='syd'?'ok':''}">${r.pickup&&r.near==='syd'?'Available, free':'Not for this postcode'}</b></div><div><span style="color:var(--muted);font-size:12.5px">Exact freight is quoted live by the carrier at checkout.</span></div></div>`};
  // sticky atc
  const ob=$('#atc');if('IntersectionObserver' in window){new IntersectionObserver(([e])=>$('.sticky-atc').classList.toggle('show',!e.isIntersecting&&e.boundingClientRect.top<0)).observe(ob)}
  drawBuy();drawGallery();
  if(location.hash==='#sleepset') setTimeout(()=>$('#sleepset').scrollIntoView({behavior:'smooth',block:'start'}),300);
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  header();footer();cartEls();renderCart();home();pdp();reveal();
  $$('[data-pct]').forEach(e=>e.textContent=OFFER.pct);
  const n=document.body.dataset.notes;if(n&&window.BEDS_NOTES&&window.BEDS_NOTES[n]) notes(window.BEDS_NOTES[n]);
  document.addEventListener('click',e=>{const a=e.target.closest('a[href="#"]');if(!a) return;e.preventDefault();if(a.closest('#site-footer')||a.closest('#site-header')) return;if(a.hasAttribute('data-pol')) toast('Store &amp; policy pages are published from your supplied wording in the live build')});
});
})();
