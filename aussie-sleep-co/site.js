/* beds.net.au — "Dusk" concept v2 */
(function(){
'use strict';
document.documentElement.classList.remove('no-js');
const R=(document.body&&document.body.dataset.base)||'./';
const H=(document.body&&document.body.dataset.home)||R;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const fm=n=>'$'+Number(n).toLocaleString('en-AU',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2});
const fm2=n=>'$'+Number(n).toLocaleString('en-AU',{minimumFractionDigits:2,maximumFractionDigits:2});
const U=(id,w)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w||900}&q=75`;
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const I={
 arr:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
 x:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
 chk:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
 chev:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
 bag:'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
 user:'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
 search:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
 menu:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 8h16M4 16h10"/></svg>',
 heart:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
 truck:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
 pin:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
 card:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 10h18M7 15h4"/></svg>',
 shield:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
 clock:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
 lock:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
 moon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
 home:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7v9H3z"/></svg>',
 spark:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg>'
};

/* ================= data (same ids + cart format as the checkout/admin) ================= */
const ADMIN=store.get('bna_admin',{});
const OFFER=Object.assign({pct:15,types:['mattress','accessory'],exclude:['m-euro-s']},ADMIN.offer||{});
const PRE=Object.assign({on:true,eta:'15 Jan'},ADMIN.pre||{});
const INV=Object.assign({oak:4,white:7,charcoal:0},ADMIN.inv||{});
const THR=ADMIN.threshold==null?2:ADMIN.threshold;
const FREE=1500;
const WH={
 syd:{name:'Sydney NSW warehouse',short:'Sydney',sup:'Supplier A',color:'#3F735A',pickup:true},
 mel:{name:'Melbourne VIC warehouse',short:'Melbourne',sup:'Supplier B',color:'#E0A93E',pickup:true},
 bne:{name:'Brisbane QLD warehouse',short:'Brisbane',sup:'Supplier C',color:'#8C83D9',pickup:false}
};
const P={
 'bk-harbour':{type:'bunk',name:'Harbour Single-over-Double Bunk',short:'Harbour Bunk',cat:'Bunks',price:1299,was:1549,wh:'syd',svg:{color:'oak'},rating:4.8,reviews:126,badge:['sale','Save $250'],url:'product/',sw:['#d3a46f','#f3efe7','#3d424c']},
 'bk-coast':{type:'bunk',name:'Coast Single Bunk + Trundle',short:'Coast Bunk',cat:'Bunks',price:1049,wh:'mel',svg:{color:'white',trundle:true,single:true},rating:4.7,reviews:88,badge:['new','New'],sw:['#f3efe7','#d3a46f']},
 'bk-ridge':{type:'bunk',name:'Ridge Triple Sleeper',short:'Ridge Triple',cat:'Bunks',price:1399,wh:'bne',svg:{color:'charcoal',trundle:true},rating:4.6,reviews:41,pre:'15 Jan',badge:['pre','Pre-order'],sw:['#3d424c']},
 'b-aria':{type:'bed',name:'Aria Upholstered Bed',size:'Queen',cat:'Queen Beds',price:1199,was:1499,wh:'syd',img:'photo-1505693416388-ac5ce068fe85',alt:'photo-1588046130717-0eb0c9a3ba15',rating:4.9,reviews:212,badge:['sale','−20%'],sw:['#cfc6b8','#6d6a66']},
 'b-oslo':{type:'bed',name:'Oslo Timber Platform Bed',size:'King',cat:'King Beds',price:1449,wh:'mel',img:'photo-1617325247661-675ab4b64ae2',alt:'photo-1617098900591-3f90928e8c54',rating:4.8,reviews:97,badge:['hot','Bestseller'],sw:['#c49a6c','#5b4636']},
 'b-luna':{type:'bed',name:'Luna Channel-Tufted Bed',size:'Queen',cat:'Queen Beds',price:1690,wh:'bne',img:'photo-1616594039964-ae9021a400a0',alt:'photo-1617104678098-de229db51175',rating:4.7,reviews:58,pre:'15 Jan',badge:['pre','Pre-order'],sw:['#e9e4dc','#8a8f99']},
 'b-noah':{type:'bed',name:'Noah Kids Bed',size:'Single',cat:'Single Beds',price:549,wh:'syd',img:'photo-1522771739844-6a9f6d5f14af',alt:'photo-1609766857041-ed402ea8069a',rating:4.8,reviews:143,sw:['#f3efe7','#9fb3c8']},
 'b-harper':{type:'bed',name:'Harper Bed Frame',size:'King Single',cat:'King Single Beds',price:749,wh:'mel',img:'photo-1586105251261-72a756497a11',alt:'photo-1615874959474-d609969a20ed',rating:4.6,reviews:64,sw:['#2b2b2b','#cfc6b8']},
 'b-ellis':{type:'bed',name:'Ellis Bed Frame',size:'Double',cat:'Double Beds',price:899,wh:'bne',img:'photo-1631049307264-da0ec9d70304',alt:'photo-1631049035182-249067d7618e',rating:4.5,reviews:37,oos:true,badge:['oos','Sold out'],sw:['#6d6a66']},
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
 'm-hybrid-q':{type:'mattress',name:'Hybrid Luxe Mattress — Queen',short:'Hybrid Luxe Mattress',size:'Queen',thk:30,price:1149,was:1399,wh:'mel',feel:'Medium',rating:4.9,reviews:301,badge:['sale','Save $250'],cat:'Mattresses',retail:true},
 'm-pocket-k':{type:'mattress',name:'Pocket Spring Mattress — King',short:'Pocket Spring Mattress',size:'King',thk:24,price:1049,wh:'syd',feel:'Firm',rating:4.7,reviews:120,cat:'Mattresses',retail:true},
 'a-prot-s':{type:'accessory',name:'Waterproof Protector — Single',price:59,wh:'syd',img:'photo-1631049552057-403cdb8f0658'},
 'a-prot-d':{type:'accessory',name:'Waterproof Protector — Double',price:79,wh:'syd',img:'photo-1631049552057-403cdb8f0658'},
 'a-pillow':{type:'accessory',name:'Kids Cloud Pillow (2-pack)',price:49,wh:'syd',img:'photo-1584100936595-c0654b55a2e2'},
 'a-sheets':{type:'accessory',name:'Cotton Sheet Set — Single',price:89,wh:'mel',img:'photo-1522771739844-6a9f6d5f14af'},
 'a-pillow-q':{type:'accessory',name:'Hotel Pillow (2-pack)',price:89,wh:'syd',img:'photo-1584100936595-c0654b55a2e2'},
 'a-prot-q':{type:'accessory',name:'Waterproof Protector — Queen',price:99,wh:'syd',img:'photo-1631049552057-403cdb8f0658'}
};
Object.keys(P).forEach(k=>{P[k].id=k;if(P[k].url) P[k].url=H+P[k].url});
const offerOn=p=>OFFER.types.includes(p.type)&&!OFFER.exclude.includes(p.id);
const offerPrice=p=>offerOn(p)?Math.round(p.price*(1-OFFER.pct/100)*100)/100:p.price;

/* ================= illustrations ================= */
const WOOD={oak:['#e2b885','#c48d55','#a8733f','#eed2ab'],white:['#fffdf8','#ece5d8','#cfc5b3','#ffffff'],charcoal:['#5a606c','#3c414b','#262a31','#737a87']};
let svgN=0;
function bunkSVG(o){
 o=o||{};const w=WOOD[o.color||'oak'];const n='b'+(++svgN);const id=o.id||n;const tr=!!o.trundle;const sg=!!o.single;
 const bx=sg?150:72,bw=sg?340:496,ox1=sg?128:48,ox2=sg?490:570,lx=sg?512:592;
 const post=(x,y,h,wd)=>`<rect class="wood" x="${x}" y="${y}" width="${wd||24}" height="${h}" rx="7" fill="url(#${n}p)"/><rect x="${x+4}" y="${y+6}" width="4" height="${h-12}" rx="2" fill="#fff" opacity=".22"/>`;
 const rail=(x,y,wd,h)=>`<rect class="wood" x="${x}" y="${y}" width="${wd}" height="${h||13}" rx="5" fill="url(#${n}r)"/>`;
 const slats=(x0,x1,y,h)=>{let s='';for(let x=x0;x<x1-6;x+=26) s+=`<rect x="${x}" y="${y}" width="13" height="${h}" rx="4" fill="url(#${n}r)" opacity=".55"/>`;return s};
 const matt=(cls,x,y,wd,h)=>`<g><rect class="mp" id="${id}-${cls}" x="${x}" y="${y}" width="${wd}" height="${h}" rx="${h/3}" fill="url(#${n}m)" stroke="#d8cfbf" stroke-width="1.6"/><path d="M${x+14} ${y+h*.55}h${wd-28}" stroke="#e6dfd2" stroke-width="2" stroke-dasharray="2 9" stroke-linecap="round"/></g>`;
 const duvet=(x,y,wd,c)=>`<path d="M${x} ${y} C ${x+wd*.3} ${y-8}, ${x+wd*.6} ${y+6}, ${x+wd} ${y-4} L ${x+wd} ${y+30} C ${x+wd*.7} ${y+40}, ${x+wd*.35} ${y+30}, ${x} ${y+38} Z" fill="${c}" opacity=".95"/><path d="M${x} ${y} C ${x+wd*.3} ${y-8}, ${x+wd*.6} ${y+6}, ${x+wd} ${y-4}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>`;
 const pillow=(x,y,wd)=>`<path d="M${x+6} ${y+4} Q ${x+wd/2} ${y-6} ${x+wd-6} ${y+4} Q ${x+wd+4} ${y+14} ${x+wd-6} ${y+24} Q ${x+wd/2} ${y+30} ${x+6} ${y+24} Q ${x-4} ${y+14} ${x+6} ${y+4}Z" fill="url(#${n}w)" stroke="#ddd5c7" stroke-width="1.4"/>`;
 const lbl=(x,y,t,k)=>`<g class="lbl lbl-${k}"><rect x="${x}" y="${y}" rx="15" width="${t.length*7.3+30}" height="30" fill="#0E1322"/><circle cx="${x+15}" cy="${y+15}" r="4" fill="#F1A679"/><text x="${x+25}" y="${y+20}" font-family="Instrument Sans,sans-serif" font-size="13" font-weight="600" fill="#fff">${t}</text></g>`;
 return `<svg class="bk" ${o.id?`id="${o.id}"`:''} viewBox="0 0 660 600" role="img" aria-label="${sg?'Single bunk':'Single-over-double bunk'} illustration">
 <defs>
  <linearGradient id="${n}p" x1="0" x2="1"><stop offset="0" stop-color="${w[0]}"/><stop offset=".55" stop-color="${w[1]}"/><stop offset="1" stop-color="${w[2]}"/></linearGradient>
  <linearGradient id="${n}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${w[3]}"/><stop offset=".5" stop-color="${w[1]}"/><stop offset="1" stop-color="${w[2]}"/></linearGradient>
  <linearGradient id="${n}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ebe4d7"/></linearGradient>
  <linearGradient id="${n}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#efe9de"/></linearGradient>
  <radialGradient id="${n}f" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#0E1322" stop-opacity="${o.dark?.55:.22}"/><stop offset="1" stop-color="#0E1322" stop-opacity="0"/></radialGradient>
 </defs>
 <ellipse cx="330" cy="556" rx="320" ry="26" fill="url(#${n}f)"/>
 ${slats(176,466,64,140)}
 ${slats(bx+26,bx+bw-26,288,90)}
 ${post(ox1,150,400,26)}${post(ox2,150,400,26)}
 ${post(150,36,232)}${post(466,36,232)}
 ${rail(150,94,340)}${rail(150,128,340)}
 <g class="drop" id="${id}-gt">${matt('top',174,198,292,38)}${duvet(236,200,230,o.dark?'#9db3d3':'#c4d3e6')}${pillow(184,176,72)}</g>
 ${rail(150,236,340,22)}
 ${rail(ox1,258,ox2-ox1+26,18)}
 <g class="drop" id="${id}-gb">${matt('bottom',bx+18,370,bw-36,44)}${duvet(bx+(sg?110:200),372,bw-36-(sg?110:200)+18,o.dark?'#e3a98a':'#e9c3a6')}${pillow(bx+30,346,78)}${sg?'':pillow(bx+118,346,78)}</g>
 ${rail(ox1,414,ox2-ox1+26,28)}
 ${tr?`<g class="trundle-g" id="${id}-tg"><g class="drop" id="${id}-gtr">${matt('trundle',bx+40,452,bw-80,22)}<path d="M${bx+bw*.55} 452 h${bw*.45-48} v18 h-${bw*.45-48}z" fill="${o.dark?'#a7c4b2':'#cfe0d4'}"/></g>
  <rect class="wood" x="${bx+24}" y="472" width="${bw-48}" height="54" rx="9" fill="url(#${n}r)"/><rect x="${bx+bw/2-34}" y="492" width="68" height="9" rx="4.5" fill="${w[2]}" opacity=".7"/>
  <circle cx="${bx+48}" cy="534" r="9" fill="#2a2f3e"/><circle cx="${bx+bw-48}" cy="534" r="9" fill="#2a2f3e"/></g>`:''}
 <g>${post(lx,140,412,10)}${post(lx+34,140,412,10)}${[196,262,328,394,460].map(y=>`<rect class="wood" x="${lx}" y="${y}" width="44" height="10" rx="4" fill="url(#${n}r)"/>`).join('')}</g>
 ${o.labels?lbl(196,150,'Top bunk · Single','top')+lbl(bx+20,302,sg?'Bottom · Single':'Bottom bunk · Double','bottom')+(tr?lbl(bx+60,482,'Trundle · Single','trundle'):''):''}
 </svg>`;
}
function mattSVG(thk,max){
 const k=1.5,b=54,h=thk*k,over=max&&thk>max,top=b-h,ml=max?b-max*k:0;
 return `<svg viewBox="0 0 120 62" aria-hidden="true"><rect x="6" y="${top}" width="108" height="${h}" rx="7" fill="${over?'#F9E1DA':'#fff'}" stroke="${over?'#C2432B':'#d4cab8'}" stroke-width="1.6"/>${h>16?`<path d="M14 ${top+h/2}h92" stroke="${over?'#ebb7a9':'#ece6da'}" stroke-width="1.4" stroke-dasharray="2 6" stroke-linecap="round"/>`:''}<rect x="2" y="${b}" width="116" height="5" rx="2.5" fill="#c48d55"/>${max?`<path d="M0 ${ml}h120" stroke="${over?'#C2432B':'#3F735A'}" stroke-width="1.4" stroke-dasharray="3 3"/><text x="118" y="${ml-3}" text-anchor="end" font-family="Instrument Sans,sans-serif" font-size="8.5" font-weight="700" fill="${over?'#C2432B':'#3F735A'}">max ${max}cm</text>`:''}</svg>`;
}
function mattCard(p){
 const t=p.thk*1.7;
 return `<svg viewBox="0 0 300 230" aria-hidden="true"><defs><linearGradient id="mc${p.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ece5d9"/></linearGradient></defs><ellipse cx="150" cy="${176+t/2}" rx="135" ry="12" fill="#0E1322" opacity=".08"/>
 <path d="M34 128 150 92l116 36-116 42z" fill="url(#mc${p.id})" stroke="#d4cab8" stroke-width="1.6"/>
 <path d="M34 128v${t}l116 42v-${t}z" fill="#f2ede4" stroke="#d4cab8" stroke-width="1.6"/><path d="M150 170v${t}l116-42v-${t}z" fill="#e7e0d3" stroke="#d4cab8" stroke-width="1.6"/>
 <path d="M60 124 150 97l90 28" fill="none" stroke="#e8e1d5" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round"/>
 <path d="M34 ${128+t*.5}l116 42 116-42" fill="none" stroke="#F1A679" stroke-width="2"/>
 <text x="150" y="46" text-anchor="middle" font-family="Instrument Serif,serif" font-size="24" fill="#0E1322">${p.size} · ${p.thk}cm</text></svg>`;
}
function media(p,w,cls){
 if(p.img) return `<img src="${U(p.img,w||700)}" alt="${p.name}" loading="lazy" ${cls?`class="${cls}"`:''}>`;
 if(p.type==='bunk') return bunkSVG(p.svg);
 if(p.type==='mattress') return mattCard(p);
 return '';
}

/* ================= toast ================= */
let tt;function toast(m){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.innerHTML=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2800)}

/* ================= header / footer / chrome ================= */
const NAV=[['Beds','beds'],['Bunks','bunks'],['Mattresses','mats'],['Furniture'],['Sale','sale']];
const MEGA={
 beds:`<div class="mega"><div class="mega__in"><div><h5>By size</h5><ul><li><a href="${H}#shop">Single Beds</a></li><li><a href="${H}#shop">King Single Beds</a></li><li><a href="${H}#shop">Double Beds</a></li><li><a href="${H}#shop">Queen Beds <span class="pill">Most popular</span></a></li><li><a href="${H}#shop">King Beds</a></li></ul></div>
  <div><h5>By style</h5><ul><li><a href="${H}#shop">Upholstered</a></li><li><a href="${H}#shop">Timber</a></li><li><a href="${H}#shop">Storage beds</a></li><li><a href="${H}#shop">Kids beds</a></li></ul></div>
  <div><h5>Help me choose</h5><ul><li><a href="${H}#finder">30-second bed finder</a></li><li><a href="${H}#delivery">Delivery to my postcode</a></li><li><a href="${H}#faq">Size guide</a></li></ul></div>
  <a class="mega__feat" href="${H}#shop"><img src="${U('photo-1617325247661-675ab4b64ae2',700)}" alt=""><div><b>The Oslo King</b><span>Solid timber platform · from $1,449 →</span></div></a></div></div>`,
 bunks:`<div class="mega"><div class="mega__in"><div><h5>By type</h5><ul><li><a href="${H}product/">Single-over-Double <span class="pill">Bestseller</span></a></li><li><a href="${H}#shop">Single Bunks</a></li><li><a href="${H}#shop">Bunks with Trundle</a></li><li><a href="${H}#shop">Triple Sleepers</a></li></ul></div>
  <div><h5>By finish</h5><ul><li><a href="${H}#shop">Natural Oak</a></li><li><a href="${H}#shop">White</a></li><li><a href="${H}#shop">Charcoal</a></li></ul></div>
  <div><h5>Good to know</h5><ul><li><a href="${H}#story">How mattress matching works</a></li><li><a href="${H}#faq">Bunk safety FAQ</a></li></ul></div>
  <a class="mega__feat" href="${H}product/"><img src="${U('photo-1522771739844-6a9f6d5f14af',700)}" alt=""><div><b>Bunks that come with the right mattresses</b><span>Matched to every position · ${OFFER.pct}% off →</span></div></a></div></div>`,
 mats:`<div class="mega"><div class="mega__in"><div><h5>By size</h5><ul><li><a href="${H}#shop">Single</a></li><li><a href="${H}#shop">King Single</a></li><li><a href="${H}#shop">Double</a></li><li><a href="${H}#shop">Queen</a></li><li><a href="${H}#shop">King</a></li></ul></div>
  <div><h5>By type</h5><ul><li><a href="${H}#shop">Hybrid</a></li><li><a href="${H}#shop">Pocket spring</a></li><li><a href="${H}#shop">Latex &amp; foam</a></li><li><a href="${H}#shop">Bunk &amp; trundle <span class="pill">Low profile</span></a></li></ul></div>
  <div><h5>Accessories</h5><ul><li><a href="${H}#shop">Protectors</a></li><li><a href="${H}#shop">Pillows</a></li><li><a href="${H}#shop">Sheet sets</a></li></ul></div>
  <a class="mega__feat" href="${H}#shop"><img src="${U('photo-1588046130717-0eb0c9a3ba15',700)}" alt=""><div><b>Hybrid Luxe Queen</b><span>Now $1,149 · was $1,399 →</span></div></a></div></div>`
};
const logo=`<span class="logo__m"></span>beds<small>.net.au</small>`;
function chrome(){
 const h=$('#hdr');if(h){
  const over=h.dataset.over==='1';
  h.innerHTML=`<div class="ann__demo">Concept prototype for beds.net.au · <a href="${R}">Design A</a> · <a href="${R}b/">Design B</a> · <a href="${R}admin/">Admin view</a></div>
  <div class="ann"><div class="ann__track">${Array(2).fill(`<span><b>Free metro delivery</b> over ${fm(FREE)}</span><i></i><span>Bed offer: <b>${OFFER.pct}% off</b> mattresses &amp; add-ons with any bed</span><i></i><span>Click &amp; collect from Sydney &amp; Melbourne</span><i></i><span><b>Afterpay</b> &amp; <b>Zip</b> · pay in 4</span><i></i><span>Rated <b>4.8★</b> by 2,400+ Aussie families</span><i></i>`).join('')}</div></div>
  <header class="hdr ${over?'hdr--over':''}" id="hdrbar"><div class="wrap hdr__bar">
   <nav aria-label="Main"><ul class="hdr__nav">${NAV.map(([t,k])=>`<li class="nav-item"><a class="nl ${k==='sale'?'nl--sale':''}" href="${k==='bunks'?H+'product/':H+'#shop'}">${t}${MEGA[k]?I.chev:''}</a>${MEGA[k]||''}</li>`).join('')}</ul>
   <button class="ib burger" aria-label="Open menu">${I.menu}</button></nav>
   <a class="logo" href="${H}" aria-label="beds.net.au home">${logo}</a>
   <div class="hdr__right"><a class="finder-btn" href="${H}#finder">${I.spark}<span>Find my bed</span></a><button class="ib" aria-label="Search" data-demo="Search is part of the live Shopify build">${I.search}</button><button class="ib" aria-label="Account" data-demo="Customer accounts are part of the live Shopify build">${I.user}</button><button class="ib cart-open" aria-label="Open cart">${I.bag}<span class="cnt">0</span></button></div>
  </div></header>
  <div class="mdrawer" aria-hidden="true"><div class="mdrawer__scrim"></div><div class="mdrawer__p"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"><span class="logo" style="color:#fff">${logo}</span><button class="xbtn md-x" aria-label="Close menu" style="background:rgba(255,255,255,.1);color:#fff">${I.x}</button></div>
   <div class="mdrawer__links">${[['Single Beds','92 × 188'],['King Single','107 × 203'],['Double Beds','137 × 188'],['Queen Beds','153 × 203'],['King Beds','183 × 203'],['Bunks','Matched mattresses'],['Mattresses','All sizes'],['Furniture',''],['Sale','Up to 20% off']].map(([t,s])=>`<a href="${t==='Bunks'?H+'product/':H+'#shop'}">${t}<small>${s}</small></a>`).join('')}</div>
   <a class="btn btn--glow" style="margin-top:28px" href="${H}#finder">Take the bed finder <span class="arr">${I.arr}</span></a></div></div>`;
  $$('.nav-item',h).forEach(li=>{if(!$('.mega',li)) return;let tm;
   li.addEventListener('mouseenter',()=>{clearTimeout(tm);$$('.nav-item.open').forEach(o=>o!==li&&o.classList.remove('open'));li.classList.add('open')});
   li.addEventListener('mouseleave',()=>{tm=setTimeout(()=>li.classList.remove('open'),160)});
   li.addEventListener('focusin',()=>li.classList.add('open'));
   li.addEventListener('focusout',e=>{if(!li.contains(e.relatedTarget)) li.classList.remove('open')})});
  const md=$('.mdrawer',h);const cl=()=>{md.classList.remove('open');md.setAttribute('aria-hidden','true')};
  $('.burger',h).onclick=()=>{md.classList.add('open');md.setAttribute('aria-hidden','false')};
  $('.md-x',h).onclick=cl;$('.mdrawer__scrim',h).onclick=cl;$$('.mdrawer a',h).forEach(a=>a.addEventListener('click',cl));
  const bar=$('#hdrbar');const onS=()=>bar.classList.toggle('solid',!over||window.scrollY>40);onS();window.addEventListener('scroll',onS,{passive:true});
 }
 const f=$('#ftr');if(f){
  f.innerHTML=`<footer class="ftr"><div class="wrap"><div class="ftr__top">
   <div><span class="logo" style="color:#fff">${logo}</span><p style="margin-top:18px;max-width:360px">Beds, bunks and mattresses delivered Australia-wide from our Sydney, Melbourne and Brisbane warehouses.</p>
    <form class="ftr__news" onsubmit="event.preventDefault();BEDS.toast('Thanks! Your $50 welcome code is on its way')"><label class="sr" for="fnl">Email</label><input id="fnl" type="email" required placeholder="Email for $50 off your first bed"><button class="btn btn--glow btn--sm">Join</button></form></div>
   <div><h4>Shop</h4><ul><li><a href="${H}#shop">Beds</a></li><li><a href="${H}product/">Bunks</a></li><li><a href="${H}#shop">Mattresses</a></li><li><a href="${H}#shop">Furniture</a></li><li><a href="${H}#shop">Sale</a></li></ul></div>
   <div><h4>Help</h4><ul><li><a href="#" data-pol>Shipping &amp; delivery</a></li><li><a href="#" data-pol>Returns &amp; exchanges</a></li><li><a href="#" data-pol>Warranty</a></li><li><a href="${H}#faq">FAQ</a></li><li><a href="#" data-pol>Contact us</a></li></ul></div>
   <div><h4>Company</h4><ul><li><a href="#" data-pol>About</a></li><li><a href="#" data-pol>Privacy policy</a></li><li><a href="#" data-pol>Terms of service</a></li><li><a href="#" data-pol>Refund policy</a></li></ul></div>
  </div><div class="ftr__word" aria-hidden="true">sleep well.</div>
  <div class="ftr__bot"><span>© 2026 beds.net.au · Concept prototype · Prices in AUD incl. GST</span><div class="pays"><span class="pay">VISA</span><span class="pay">Mastercard</span><span class="pay">AMEX</span><span class="pay">Apple Pay</span><span class="pay">G Pay</span><span class="pay pay--pp">PayPal</span><span class="pay pay--ap">afterpay</span><span class="pay pay--zip">zip</span></div></div></div></footer>`;
 }
 // dock
 if(!$('.dock')){const d=document.createElement('nav');d.className='dock';d.setAttribute('aria-label','Quick links');
  d.innerHTML=`<a href="${H}">${I.home}Home</a><a href="${H}#shop">${I.search}Shop</a><a class="main" href="${H}#finder">${I.spark}Find my bed</a><button class="cart-open" aria-label="Open cart">${I.bag}Cart<span class="cnt">0</span></button>`;document.body.appendChild(d);
  let ly=0;window.addEventListener('scroll',()=>{const y=window.scrollY;d.classList.toggle('show',y>500&&(y<ly||y<900));ly=y},{passive:true});}
 document.addEventListener('click',e=>{
  const c=e.target.closest('.cart-open');if(c){openCart();return}
  const dm=e.target.closest('[data-demo]');if(dm){e.preventDefault();toast(dm.dataset.demo);return}
  const a=e.target.closest('a[href="#"]');if(a){e.preventDefault();if(a.hasAttribute('data-pol')) toast('Store &amp; policy pages are published from your wording in the live build')}
 });
}

/* ================= cart ================= */
let cart=store.get('bna_cart',[]);
const save=()=>store.set('bna_cart',cart);
const hasBed=()=>cart.some(l=>P[l.id]&&(P[l.id].type==='bed'||P[l.id].type==='bunk'));
function unit(l){const p=P[l.id];const base=p.price+(l.add||0);const off=hasBed()&&offerOn(p);return {base,now:off?Math.round(base*(1-OFFER.pct/100)*100)/100:base,off}}
function preOf(l){const p=P[l.id];if(p.pre) return p.pre;if(p.id==='bk-harbour'&&/Charcoal/.test(l.variant||'')&&PRE.on&&!(INV.charcoal>0)) return PRE.eta;return null}
function add(id,o){o=o||{};const key=id+'|'+(o.variant||'')+'|'+(o.pos||'');const ex=cart.find(l=>l.key===key);
 if(ex) ex.qty+=o.qty||1; else cart.push({key,id,qty:o.qty||1,variant:o.variant||'',pos:o.pos||'',add:o.add||0});
 save();renderCart();$$('.cnt').forEach(c=>{c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump')})}
function cartEl(){
 if($('.cart')) return;
 const d=document.createElement('div');d.className='cart';d.setAttribute('aria-hidden','true');
 d.innerHTML=`<div class="cart__scrim"></div><aside class="cart__p" role="dialog" aria-label="Your cart"><div class="cart__h"><h3>Your cart<sup class="cart-n"></sup></h3><button class="xbtn cart-x" aria-label="Close cart">${I.x}</button></div><div class="tiers"></div><div class="cart__b"></div><div class="cart__f"></div></aside>`;
 document.body.appendChild(d);$('.cart__scrim',d).onclick=closeCart;$('.cart-x',d).onclick=closeCart;
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();closeNotes()}});
}
function openCart(){cartEl();renderCart();const c=$('.cart');c.classList.add('open');c.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden';if(window.__lenis) window.__lenis.stop();setTimeout(()=>$('.cart-x').focus(),80)}
function closeCart(){const c=$('.cart');if(!c||!c.classList.contains('open')) return;c.classList.remove('open');c.setAttribute('aria-hidden','true');document.documentElement.style.overflow='';if(window.__lenis) window.__lenis.start()}
function upsells(){
 const ids=cart.map(l=>l.id);const s=new Set();
 if(cart.some(l=>P[l.id].type==='bunk')) ['a-prot-s','a-prot-d','a-pillow','a-sheets'].forEach(x=>s.add(x));
 if(cart.some(l=>P[l.id].type==='bed')) ['m-hybrid-q','a-prot-q','a-pillow-q'].forEach(x=>s.add(x));
 if(!s.size) ['a-pillow-q','a-prot-q','a-pillow','a-sheets'].forEach(x=>s.add(x));
 return [...s].filter(x=>!ids.includes(x)).slice(0,5);
}
function renderCart(){
 const n=cart.reduce((a,l)=>a+l.qty,0);
 $$('.cnt').forEach(c=>{c.textContent=n;c.classList.toggle('on',n>0)});
 const el=$('.cart');if(!el) return;
 $('.cart-n').textContent=n?`(${n})`:'';
 let sub=0,was=0;cart.forEach(l=>{const u=unit(l);sub+=u.now*l.qty;was+=(u.base+(P[l.id].was?P[l.id].was-P[l.id].price:0))*l.qty});
 const bed=hasBed();const pct=Math.min(100,sub/FREE*100);
 $('.tiers').innerHTML=`<div class="tiers__msg">${sub>=FREE?`You've unlocked <b>free metro delivery</b> 🎉`:`<b>${fm2(FREE-sub)}</b> away from free metro delivery`}${bed?'':` · add a bed to unlock <b>${OFFER.pct}% off</b> add-ons`}</div><div class="tiers__bar"><i style="width:${pct}%"></i></div><div class="tiers__pts"><span class="${bed?'got':''}">${bed?I.chk:'○'} Bed offer −${OFFER.pct}%</span><span class="${sub>=FREE?'got':''}">${sub>=FREE?I.chk:'○'} Free metro delivery · ${fm(FREE)}</span></div>`;
 const b=$('.cart__b');
 if(!cart.length){b.innerHTML=`<div class="cart__empty"><div class="moonx"></div><p class="serif" style="font-size:30px;line-height:1">Your cart is resting</p><p style="color:var(--muted);margin:8px 0 18px">Start with a bed and we'll match the mattresses.</p><a class="btn btn--sm" href="${H}product/">Shop the Harbour bunk <span class="arr">${I.arr}</span></a></div>`+upsHTML()}
 else{
  const g={};cart.forEach(l=>{(g[P[l.id].wh]=g[P[l.id].wh]||[]).push(l)});const gk=Object.keys(g);
  const offSave=cart.reduce((a,l)=>{const u=unit(l);return a+(u.base-u.now)*l.qty},0);
  b.innerHTML=(offSave>0?`<div class="offerbar">${I.chk}<span><b>Bed offer applied:</b> you're saving ${fm2(offSave)} on add-ons</span></div>`:'')+
  gk.map(w=>`<div class="whg"><div class="whg__h"><i style="background:${WH[w].color}"></i>${WH[w].name}<span>${gk.length>1?'Freight quoted separately':''}</span></div>${g[w].map(lnHTML).join('')}</div>`).join('')+upsHTML();
 }
 const sav=Math.max(0,was-sub);
 $('.cart__f').innerHTML=cart.length?`<div class="cart__rows"><div><span class="m">Subtotal</span><span>${fm2(sub)}</span></div>${sav>0?`<div><span class="s">Total savings</span><span class="s">−${fm2(sav)}</span></div>`:''}<div><span class="m">Freight</span><span class="m">${sub>=FREE?'Free metro · ':''}live quote at checkout</span></div><div class="t"><span>Total</span><span>${fm2(sub)}</span></div></div>
  <a class="btn btn--block" href="${R}checkout/">${I.lock} Checkout securely <span class="arr">${I.arr}</span></a>
  <div class="cart__xp"><button class="xp-shop" data-demo="Express checkout runs in Shopify checkout">shop Pay</button><button class="xp-apple" data-demo="Express checkout runs in Shopify checkout">Apple Pay</button><button class="xp-pp" data-demo="Express checkout runs in Shopify checkout">PayPal</button></div>
  <div class="cart__trust"><span>or 4 × <b style="color:var(--ink)">${fm2(sub/4)}</b> <span class="pay pay--ap">afterpay</span> <span class="pay pay--zip">zip</span></span></div>
  <div class="cart__trust"><span>${I.shield.replace(/22/g,'14')} Warranty backed</span><span>${I.lock} Secure checkout</span><span>${I.truck.replace(/22/g,'14')} Australia-wide</span></div>`:'';
 $$('[data-q]',b).forEach(x=>x.onclick=()=>{const l=cart.find(y=>y.key===x.dataset.k);if(!l) return;l.qty+=+x.dataset.q;if(l.qty<1) cart=cart.filter(y=>y!==l);save();renderCart()});
 $$('[data-rm]',b).forEach(x=>x.onclick=()=>{cart=cart.filter(y=>y.key!==x.dataset.rm);save();renderCart()});
 $$('[data-up]',b).forEach(x=>x.onclick=()=>{add(x.dataset.up);toast(`${I.chk} Added ${P[x.dataset.up].name}`)});
}
function lnHTML(l){const p=P[l.id],u=unit(l),pre=preOf(l);
 return `<div class="ln"><div class="ln__img">${media(p,220)}</div><div><div class="ln__n">${p.name}</div>${l.variant||l.pos?`<div class="ln__v">${[l.pos,l.variant].filter(Boolean).join(' · ')}</div>`:''}
 <div class="ln__tags">${u.off?`<span class="ln__tag ln__tag--o">Bed offer −${OFFER.pct}%</span>`:''}${pre?`<span class="ln__tag ln__tag--p">Pre-order · ETA ${pre}</span>`:''}</div>
 <div class="ln__c"><div class="qt"><button data-q="-1" data-k="${l.key}" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="1" data-k="${l.key}" aria-label="Increase">+</button></div><button class="ln__rm" data-rm="${l.key}">Remove</button></div></div>
 <div class="ln__p">${fm2(u.now*l.qty)}${u.off?`<s>${fm2(u.base*l.qty)}</s>`:p.was?`<s>${fm2((p.was+(l.add||0))*l.qty)}</s>`:''}</div></div>`}
function upsHTML(){const u=upsells();if(!u.length) return '';const bed=hasBed();
 return `<div class="ups"><div class="ups__h"><b>Complete the room</b>${bed?`<span>−${OFFER.pct}% with your bed</span>`:''}</div><div class="ups__rail">${u.map(id=>{const p=P[id];const off=bed&&offerOn(p);return `<div class="uc"><div class="uc__img">${media(p,300)}</div><b>${p.short||p.name}</b><span class="pr">${fm2(off?offerPrice(p):p.price)}${off?`<s>${fm(p.price)}</s>`:''}</span><button data-up="${id}">+ Add</button></div>`}).join('')}</div></div>`}

/* ================= notes ================= */
function notes(html){if(!html) return;
 const b=document.createElement('button');b.className='fab';b.innerHTML='<i>i</i><span>How this works in Shopify</span>';document.body.appendChild(b);
 const d=document.createElement('div');d.className='notes';d.setAttribute('aria-hidden','true');
 d.innerHTML=`<div class="notes__s"></div><div class="notes__p" role="dialog" aria-label="Build notes"><div style="display:flex;justify-content:space-between;align-items:center"><span class="kicker"><i></i>Build notes</span><button class="xbtn notes-x" aria-label="Close">${I.x}</button></div>${html}</div>`;
 document.body.appendChild(d);b.onclick=()=>{d.classList.add('open');d.setAttribute('aria-hidden','false')};$('.notes__s',d).onclick=closeNotes;$('.notes-x',d).onclick=closeNotes}
function closeNotes(){const d=$('.notes');if(d){d.classList.remove('open');d.setAttribute('aria-hidden','true')}}

/* ================= product card ================= */
function pcHTML(p){
 const b=p.badge?`<span class="bdg bdg--${p.badge[0]}">${p.badge[1]}</span>`:'';
 const st=p.oos?`<span class="pc__stock" style="color:var(--muted)"><i class="dot dot--off"></i>Sold out · back soon</span>`:p.pre?`<span class="pc__stock" style="color:#9b5427"><i class="dot dot--w"></i>Pre-order · ETA ${p.pre}</span>`:`<span class="pc__stock"><i class="dot"></i>In stock · ships from ${WH[p.wh].short}</span>`;
 const href=p.url||'#';const nolink=p.url?'':'data-nolink';
 return `<article class="pc"><div class="pc__top2"><a class="pc__media" href="${href}" ${nolink} data-cur="View">${media(p,700)}${p.alt?`<img class="alt" src="${U(p.alt,700)}" alt="" loading="lazy">`:''}<span class="pc__badges">${b}</span></a>
 <button class="pc__wish" aria-label="Save to wishlist" data-wish>${I.heart}</button>
 <div class="pc__qa">${p.oos?`<button class="btn btn--light btn--block btn--sm" data-notify>Notify me when back</button>`:`<button class="btn btn--block btn--sm" data-add="${p.id}">${p.pre?'Pre-order now':p.url?'Choose options':'Quick add'} <span class="arr">${I.arr}</span></button>`}</div></div>
 <div class="pc__body"><div class="pc__top"><span>${p.cat}${p.size&&p.type==='bed'?' · '+p.size:''}</span>${p.rating?`<span class="stars">★ <small>${p.rating} (${p.reviews})</small></span>`:''}</div>
 <a class="pc__name" href="${href}" ${nolink}>${p.short||p.name}</a>${p.sw?`<div class="pc__sw">${p.sw.map(c=>`<i style="background:${c}"></i>`).join('')}</div>`:''}
 <div class="pc__price"><b>${fm(p.price)}</b>${p.was?`<s>${fm(p.was)}</s><em>Save ${fm(p.was-p.price)}</em>`:''}</div><span class="pc__bnpl">or 4 × ${fm2(p.price/4)} with Afterpay</span>${st}</div></article>`;
}
function bindCards(root){
 $$('[data-add]',root).forEach(b=>b.onclick=e=>{e.preventDefault();const p=P[b.dataset.add];if(p.url){location.href=p.url;return}
  add(p.id,p.type==='bunk'?{variant:'Standard'}:{});openCart()});
 $$('[data-nolink]',root).forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const id=a.closest('.pc').querySelector('[data-add]');toast('Only the Harbour bunk has a full product page in this demo. Use Quick add to try the cart.')}));
 $$('[data-notify]',root).forEach(b=>b.onclick=()=>toast('We\'ll email you when it\'s back in stock'));
 $$('[data-wish]',root).forEach(b=>b.onclick=()=>{b.classList.toggle('on');toast(b.classList.contains('on')?'Saved to your wishlist':'Removed from wishlist')});
}

/* ================= motion: reveal, cursor, magnetic, lenis, parallax ================= */
function motion(){
 const els=$$('.rv,.rv-img');
 if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});els.forEach(e=>io.observe(e))}else els.forEach(e=>e.classList.add('in'));
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduce&&window.Lenis&&matchMedia('(hover:hover)').matches){try{const l=new Lenis({duration:1.15,smoothWheel:true});window.__lenis=l;const raf=t=>{l.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf);
  document.addEventListener('click',e=>{const a=e.target.closest('a[href*="#"]');if(!a) return;const u=new URL(a.href,location.href);if(u.pathname===location.pathname&&u.hash&&u.hash.length>1){const t=document.querySelector(u.hash);if(t){e.preventDefault();l.scrollTo(t,{offset:-80})}}})}catch(e){}}
 // parallax
 const par=$$('[data-par]');if(par.length&&!reduce){const tick=()=>{const vh=innerHeight;par.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<0||r.top>vh) return;const k=+el.dataset.par;el.style.transform=`translate3d(0,${((r.top+r.height/2)-vh/2)*k}px,0)`});requestAnimationFrame(tick)};requestAnimationFrame(tick)}
 // cursor
 if(matchMedia('(hover:hover) and (min-width:1001px)').matches&&!reduce){const c=document.createElement('div');c.className='cursor';document.body.appendChild(c);let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;
  addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY},{passive:true});
  const loop=()=>{cx+=(x-cx)*.2;cy+=(y-cy)*.2;c.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(loop)};loop();
  document.addEventListener('mouseover',e=>{const t=e.target.closest('[data-cur]');if(t){c.classList.add('big');c.textContent=t.dataset.cur}else{c.classList.remove('big');c.textContent=''}});
  // magnetic
  $$('.btn,.finder-btn,.ib').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.25}px)`});b.addEventListener('mouseleave',()=>b.style.transform='')})}
}
function loader(){const l=$('.loader');if(!l) return;const done=()=>{l.classList.add('done');document.body.classList.add('loaded');setTimeout(()=>l.remove(),1300)};
 let seen=false;try{seen=sessionStorage.getItem('bna_seen')}catch(e){}
 if(seen){l.remove();document.body.classList.add('loaded');return}
 try{sessionStorage.setItem('bna_seen','1')}catch(e){}
 setTimeout(done,1100)}

/* ================= postcode ================= */
function pcInfo(pc){pc=String(pc||'').trim();if(!/^\d{4}$/.test(pc)) return null;const n=+pc;let st='NSW',near='syd',metro=false,days='3–6';
 if(n>=2000&&n<=2999){st=n>=2600&&n<=2620?'ACT':'NSW';near='syd';metro=n<=2234||(n>=2555&&n<=2574)||(n>=2745&&n<=2786)}
 else if(n>=3000&&n<=3999){st='VIC';near='mel';metro=n<=3207||(n>=3335&&n<=3341)||(n>=3427&&n<=3442)||(n>=3750&&n<=3810)}
 else if(n>=4000&&n<=4999){st='QLD';near='bne';metro=n<=4207||(n>=4300&&n<=4305)||(n>=4500&&n<=4519)}
 else if(n>=5000&&n<=5999){st='SA';near='mel';days='5–8'}else if(n>=6000&&n<=6999){st='WA';near='mel';days='7–12'}
 else if(n>=7000&&n<=7999){st='TAS';near='mel';days='6–9'}else if(n>=800&&n<=999){st='NT';near='bne';days='8–14'}else return null;
 if(metro) days='2–4';return {pc,st,near,metro,days,pickup:metro&&WH[near].pickup}}
function etaRange(days){const [a,b]=days.split('–').map(Number);const d=new Date();const addB=(dt,k)=>{const x=new Date(dt);let c=0;while(c<k){x.setDate(x.getDate()+1);if(x.getDay()%6) c++}return x};
 const o={weekday:'short',day:'numeric',month:'short'};return addB(d,a).toLocaleDateString('en-AU',o)+' – '+addB(d,b).toLocaleDateString('en-AU',o)}
function cutoff(){const now=new Date();const c=new Date(now);c.setHours(14,0,0,0);if(now>c) c.setDate(c.getDate()+1);while(c.getDay()%6===0) c.setDate(c.getDate()+1);const ms=c-now;const h=Math.floor(ms/36e5),m=Math.floor(ms%36e5/6e4);return {txt:(h>23?Math.floor(h/24)+'d ':'')+(h%24)+'h '+m+'m',day:c.toLocaleDateString('en-AU',{weekday:'long'})}}

/* ================= HOME ================= */
function home(){
 if(document.body.dataset.page!=='home') return;
 // stars
 const s=$('.hero__stars');if(s){let h='';for(let i=0;i<70;i++) h+=`<i style="left:${Math.random()*100}%;top:${Math.random()*70}%;animation-delay:${(Math.random()*4).toFixed(2)}s;opacity:${(.2+Math.random()*.6).toFixed(2)};transform:scale(${(.5+Math.random()).toFixed(2)})"></i>`;s.innerHTML=h}
 // hero headline intro
 $$('.hero h1 .hl>span').forEach((e,i)=>{e.style.transform='translateY(110%)';e.style.transition=`transform 1.3s cubic-bezier(.16,1,.3,1) ${.15+i*.12}s`;requestAnimationFrame(()=>requestAnimationFrame(()=>{const go=()=>e.style.transform='none';document.body.classList.contains('loaded')?go():setTimeout(go,1100)}))});
 // rail
 const sets={best:['bk-harbour','b-aria','m-hybrid-q','b-oslo','bk-coast','b-luna','b-noah','b-ellis'],beds:['b-aria','b-oslo','b-luna','b-harper','b-noah','b-ellis'],bunks:['bk-harbour','bk-coast','bk-ridge'],mats:['m-hybrid-q','m-pocket-k']};
 const rail=$('#rail');const draw=k=>{rail.innerHTML=sets[k].map(id=>pcHTML(P[id])).join('');bindCards(rail);rail.scrollTo({left:0})};
 $$('#chips .chip').forEach(c=>c.onclick=()=>{$$('#chips .chip').forEach(x=>{x.classList.toggle('on',x===c);x.setAttribute('aria-selected',x===c)});draw(c.dataset.k)});draw('best');
 $('#rprev').onclick=()=>rail.scrollBy({left:-rail.clientWidth*.8,behavior:'smooth'});$('#rnext').onclick=()=>rail.scrollBy({left:rail.clientWidth*.8,behavior:'smooth'});
 let down=false,sx=0,sl=0,moved=false;rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse') return;down=true;moved=false;sx=e.clientX;sl=rail.scrollLeft});
 addEventListener('pointermove',e=>{if(!down) return;const dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;rail.classList.add('drag')}rail.scrollLeft=sl-dx});
 addEventListener('pointerup',()=>{down=false;rail.classList.remove('drag')});rail.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
 // story
 const stg=$('#story-stage');if(stg){stg.insertAdjacentHTML('beforeend',bunkSVG({color:'oak',trundle:true,labels:true,id:'sb',dark:true}));
  const sec=$('#story');const steps=$$('.story__step');const dots=$$('.story__dots i');let cur=-1;
  const set=i=>{if(i===cur) return;cur=i;steps.forEach((s,k)=>s.classList.toggle('on',k===i));dots.forEach((d,k)=>d.classList.toggle('on',k===i));
   const keys=['top','bottom','trundle'];
   keys.forEach((k,j)=>{const g=$('#sb-g'+(k==='trundle'?'tr':k[0]));const m=$('#sb-'+k);const l=$('#sb .lbl-'+k);
    if(g){g.style.transform=j<=i?'none':'translateY(-70px)';g.style.opacity=j<=i?1:0}
    if(m) m.classList.toggle('hl',j===i);if(l) l.classList.toggle('on',j===i)});
   const tg=$('#sb-tg');if(tg) tg.style.transform=i>=2?'translateX(0)':'translateX(0)';};
  set(0);
  const onS=()=>{const r=sec.getBoundingClientRect();const tot=sec.offsetHeight-innerHeight;const p=Math.min(.999,Math.max(0,-r.top/Math.max(1,tot)));set(Math.floor(p*3))};
  addEventListener('scroll',onS,{passive:true});onS();
  dots.forEach((d,k)=>d.onclick=()=>{const tot=sec.offsetHeight-innerHeight;const y=sec.getBoundingClientRect().top+scrollY+tot*(k/3+.05);window.__lenis?window.__lenis.scrollTo(y):scrollTo({top:y,behavior:'smooth'})});
 }
 finder();deliver();builder();
 const fv=$('#feat-bunk');if(fv) fv.innerHTML=bunkSVG({color:'white',trundle:true});
}
function finder(){
 const box=$('#fq');if(!box) return;
 const Q=[
  {q:'Who is it for?',k:'who',o:[['kids','👧👦','Siblings sharing','2–3 kids, one room'],['child','🧒','One child','Growing-up bed'],['couple','💑','A couple','Room to spread out'],['me','🙋','Just me','Solo sleeper']]},
  {q:'How big is the room?',k:'room',o:[['s','📐','Compact','Under 3 × 3 m'],['m','🛋️','Average','About 3.5 × 3.5 m'],['l','🏡','Spacious','4 × 4 m or more'],['any','🤷','Not sure','Show me options']]},
  {q:'What\'s your budget?',k:'bud',o:[['lo','💰','Under $800',''],['mid','💰💰','$800 – $1,500',''],['hi','💰💰💰','$1,500+',''],['any','✨','Show the best','']]}
 ];
 const st={i:0,a:{}};
 const pick=()=>{const a=st.a;
  if(a.who==='kids') return {id:'bk-harbour',why:['Sleeps 3 (4 with trundle) in one footprint','Mattresses matched to each bunk position',`${OFFER.pct}% off mattresses with the bunk`],m:98};
  if(a.who==='child') return a.room==='s'||a.bud==='lo'?{id:'b-noah',why:['Fits compact rooms','Under $600','Pairs with a low-profile single'],m:94}:{id:'b-harper',why:['King single grows with them','Extra length to 203 cm','Ships from Melbourne'],m:93};
  if(a.who==='couple') return a.room==='l'||a.bud==='hi'?{id:'b-oslo',why:['Generous king size','Solid timber, low platform','Free click & collect in Melbourne'],m:96}:{id:'b-aria',why:['Queen: the most popular size','Save $300 right now','Plush upholstered headboard'],m:95};
  return a.bud==='lo'?{id:'b-noah',why:['Great value single','In stock in Sydney','Ready in 2–4 days to metro'],m:90}:{id:'b-aria',why:['Queen room to stretch','Save $300 right now','Most-loved bed: 4.9★'],m:92};
 };
 const prog=$$('.finder__prog i');
 const draw=()=>{prog.forEach((p,k)=>p.classList.toggle('on',k<=Math.min(st.i,2)||st.i>2));
  if(st.i>2){const r=pick();const p=P[r.id];
   box.innerHTML=`<div class="finder__res"><div class="img">${media(p,500)}</div><div><span class="match">${I.chk} ${r.m}% match</span><h3 style="margin:12px 0 10px">${p.short||p.name}</h3><ul style="margin:0 0 16px;padding-left:18px;color:var(--muted);display:grid;gap:4px">${r.why.map(w=>`<li>${w}</li>`).join('')}</ul>
    <div class="pc__price" style="padding:0 0 14px"><b>${fm(p.price)}</b>${p.was?`<s>${fm(p.was)}</s>`:''}<span class="pc__bnpl" style="margin-left:6px">or 4 × ${fm2(p.price/4)}</span></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">${p.url?`<a class="btn" href="${p.url}">Build my bunk set <span class="arr">${I.arr}</span></a>`:`<button class="btn" id="fr-add">Add to cart <span class="arr">${I.arr}</span></button>`}<button class="btn btn--line btn--sm" style="height:58px" id="fr-re">Start again</button></div></div></div>`;
   const fa=$('#fr-add');if(fa) fa.onclick=()=>{add(p.id);openCart()};$('#fr-re').onclick=()=>{st.i=0;st.a={};draw()};return}
  const q=Q[st.i];
  box.innerHTML=`<span class="kicker" style="margin-bottom:10px">Question ${st.i+1} of 3</span><h3>${q.q}</h3><div class="opts">${q.o.map(([v,e,t,s])=>`<button class="opt ${st.a[q.k]===v?'on':''}" data-v="${v}"><span class="em">${e}</span><b>${t}</b>${s?`<span>${s}</span>`:''}</button>`).join('')}</div>
   <div class="finder__nav"><button class="ulink" id="fq-back" ${st.i?'':'style="visibility:hidden"'}>← Back</button><span style="font-size:13px;color:var(--muted)">Takes about 30 seconds</span></div>`;
  $$('.opt',box).forEach(b=>b.onclick=()=>{st.a[q.k]=b.dataset.v;$$('.opt',box).forEach(x=>x.classList.toggle('on',x===b));setTimeout(()=>{st.i++;draw()},260)});
  const bk=$('#fq-back');if(bk) bk.onclick=()=>{st.i--;draw()};
 };draw();
}
function deliver(){
 const f=$('#pcf');if(!f) return;
 const PT={NSW:[364,224],VIC:[310,260],QLD:[380,166],ACT:[353,240],SA:[253,237],WA:[40,208],TAS:[335,312],NT:[182,28]};
 const WP={syd:[364,224],mel:[310,260],bne:[380,166]};
 const co=$('#cutoff');const upd=()=>{const c=cutoff();co.innerHTML=`${I.clock} Order in <b>${c.txt}</b> for dispatch ${c.day==new Date().toLocaleDateString('en-AU',{weekday:'long'})?'today':c.day}`};upd();setInterval(upd,30000);
 f.onsubmit=e=>{e.preventDefault();const r=pcInfo($('#pcin').value);const o=$('#pcres');
  if(!r){o.innerHTML=`<div class="pccard">Please enter a valid 4-digit Australian postcode.</div>`;return}
  let [dx,dy]=PT[r.st];if(!r.metro&&['NSW','VIC','QLD'].includes(r.st)){dx-=28;dy+=6}
  const [wx,wy]=WP[r.near];const mx=(dx+wx)/2,my=Math.min(dy,wy)-40;
  $('#route').innerHTML=`<path class="route" d="M${wx} ${wy} Q ${mx} ${my} ${dx} ${dy}" fill="none" stroke="#F1A679" stroke-width="2.5"/><circle cx="${dx}" cy="${dy}" r="7" fill="#fff"/><circle cx="${dx}" cy="${dy}" r="14" fill="none" stroke="#fff" stroke-opacity=".4"><animate attributeName="r" from="7" to="22" dur="1.6s" repeatCount="indefinite"/><animate attributeName="stroke-opacity" from=".6" to="0" dur="1.6s" repeatCount="indefinite"/></circle>`;
  o.innerHTML=`<div class="pccard"><div class="pccard__row"><span>Delivering to</span><b>${r.pc} ${r.st} · ${r.metro?'Metro':'Regional'}</b></div><div class="pccard__row"><span>Ships from</span><b>${WH[r.near].name}</b></div><div class="pccard__row"><span>Estimated arrival</span><b>${etaRange(r.days)}</b></div><div class="pccard__row"><span>Click &amp; collect</span><b class="${r.pickup?'good':''}">${r.pickup?'Free from '+WH[r.near].short:'Not available here'}</b></div><div class="pccard__row"><span>Freight</span><b>${r.metro?'Free over '+fm(FREE)+' · ':''}live quote at checkout</b></div></div>`};
}
function builder(){
 const l=$('#blist');if(!l) return;
 const items=[{id:'b-aria',lock:1},{id:'m-hybrid-q',on:1},{id:'a-prot-q',on:1},{id:'a-pillow-q',on:1}];
 const draw=()=>{let tot=0,was=0;
  l.innerHTML=items.map((it,i)=>{const p=P[it.id];const pr=it.lock?p.price:offerPrice(p);const base=it.lock?(p.was||p.price):(p.was||p.price);if(it.on||it.lock){tot+=pr;was+=base}
   return `<div class="bitem"><div class="bitem__img">${media(p,200)}</div><div><b>${p.short||p.name}</b><span>${it.lock?'Your bed':`<s style="color:var(--muted-2)">${fm(p.price)}</s> ${fm2(pr)} · −${OFFER.pct}%`}</span></div><button class="tog ${it.on||it.lock?'on':''}" ${it.lock?'disabled aria-label="Bed included"':`data-i="${i}" aria-label="Include ${p.name}"`} role="switch" aria-checked="${!!(it.on||it.lock)}"></button></div>`}).join('');
  $('#btot').innerHTML=`<div class="btotal__row"><span style="color:var(--muted)">Set total</span><span class="sv">You save ${fm2(was-tot)}</span></div><div class="btotal__big">${fm2(tot)}</div><p style="color:var(--muted);font-size:13.5px;margin:6px 0 18px">or 4 × ${fm2(tot/4)} with Afterpay or Zip</p>`;
  $$('.tog[data-i]',l).forEach(t=>t.onclick=()=>{const it=items[+t.dataset.i];it.on=!it.on;draw()});
 };draw();
 $('#badd').onclick=()=>{items.forEach(it=>{if(it.on||it.lock) add(it.id)});openCart()};
}

/* ================= PRODUCT ================= */
function pdp(){
 if(document.body.dataset.page!=='pdp') return;
 const bed=P['bk-harbour'];
 const COL=[{k:'oak',n:'Natural Oak',hex:'#d3a46f'},{k:'white',n:'White',hex:'#f3efe7'},{k:'charcoal',n:'Charcoal',hex:'#3d424c',pre:PRE.on?PRE.eta:null}];
 const POS={top:{label:'Top bunk',size:'Single',max:16},bottom:{label:'Bottom bunk',size:'Double',max:22},trundle:{label:'Trundle',size:'Single',max:12}};
 if(ADMIN.pos) Object.keys(ADMIN.pos).forEach(k=>{if(POS[k]) Object.assign(POS[k],ADMIN.pos[k])});
 const ADD=['a-prot-s','a-prot-d','a-pillow','a-sheets'];
 const st={color:'oak',tr:false,qty:1,tab:'top',sel:{top:'m-bunk-s',bottom:'m-bunk-d',trundle:'m-slim-s'},bad:{},adds:{'a-prot-s':true},light:'day',view:0,pc:store.get('bna_pc','')};
 const mats=Object.values(P).filter(p=>p.type==='mattress'&&!p.retail);
 const views=[{k:'r'},{k:'t'},{k:'p',img:'photo-1522771739844-6a9f6d5f14af'},{k:'p',img:'photo-1631049552057-403cdb8f0658'},{k:'p',img:'photo-1609766857041-ed402ea8069a'}];
 const pos=()=>st.tr?['top','bottom','trundle']:['top','bottom'];
 const bp=()=>bed.price+(st.tr?349:0),bw=()=>bed.was+(st.tr?349:0);
 const col=()=>COL.find(c=>c.k===st.color);
 const qty=()=>INV[st.color];const isPre=()=>qty()<=0&&!!col().pre;const isOos=()=>qty()<=0&&!col().pre;

 function gallery(){
  const g=$('#gmain'),v=views[st.view];
  g.classList.toggle('dusk',st.light==='night'&&v.k!=='p');
  if(v.k==='p') g.innerHTML=`<img src="${U(v.img,1300)}" alt="Harbour bunk lifestyle photo">`;
  else{g.innerHTML=bunkSVG({color:st.color,trundle:v.k==='t'||st.tr,labels:true,id:'gb',dark:st.light==='night'})+`<div class="gal__ctl"><div class="seg" role="group" aria-label="Lighting"><button class="${st.light==='day'?'on':''}" data-l="day">Day</button><button class="${st.light==='night'?'on':''}" data-l="night">Night</button></div><span class="gal__hint" style="position:static"><span>${col().n}${v.k==='t'||st.tr?' · with trundle':''}</span></span></div><div class="gal__hint"><span class="live-v"><i class="live"></i>Live preview: updates as you choose</span><span>Tap a position below</span></div>`;
   $$('[data-l]',g).forEach(b=>b.onclick=()=>{st.light=b.dataset.l;gallery()});sync()}
  $('#gth').innerHTML=views.map((t,i)=>`<button class="gal__t ${i===st.view?'on':''}" data-v="${i}" aria-label="Image ${i+1}">${t.k==='p'?`<img src="${U(t.img,200)}" alt="">`:bunkSVG({color:st.color,trundle:t.k==='t'})}</button>`).join('');
  $$('#gth .gal__t').forEach(b=>b.onclick=()=>{st.view=+b.dataset.v;gallery()});
 }
 function sync(){const s=$('#gb');if(!s) return;['top','bottom','trundle'].forEach(k=>{const r=$('#gb-'+k);if(r) r.classList.toggle('hl',k===st.tab)});$$('.lbl',s).forEach(g=>g.classList.toggle('on',g.classList.contains('lbl-'+st.tab)))}
 function buy(){
  $('#price').innerHTML=`<b>${fm(bp())}</b><s>${fm(bw())}</s><span class="save">Save ${fm(bw()-bp())}</span>`;
  $('#bnpl').innerHTML=`or 4 interest-free payments of <b>${fm2(bp()/4)}</b> with <span class="pay pay--ap">afterpay</span> <span class="pay pay--zip">zip</span>`;
  $('#fins').innerHTML=COL.map(c=>`<button class="fin ${st.color===c.k?'on':''}" data-c="${c.k}" aria-pressed="${st.color===c.k}"><i style="background:${c.hex}"></i>${c.n}${INV[c.k]<=0?(c.pre?'<small>PRE-ORDER</small>':'<small style="color:var(--muted-2)">SOLD OUT</small>'):''}</button>`).join('');
  $('#fin-n').textContent=col().n;
  $$('#fins .fin').forEach(b=>b.onclick=()=>{st.color=b.dataset.c;buy();gallery()});
  $$('.cfg').forEach(b=>{const on=(b.dataset.t==='1')===st.tr;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
  const q=qty();
  $('#urg').innerHTML=isPre()?`<span class="eye">${I.clock}</span><span><b>Pre-order · arrives ${col().pre}.</b> Lock in today's price; we'll email if the date changes.</span>`:isOos()?`<span class="eye">!</span><span><b>${col().n} is sold out.</b> Pick another finish or get a back-in-stock alert.</span>`:`<span class="eye">${I.truck.replace(/22/g,'16')}</span><span>${q<=THR?`<b style="color:var(--sale)">Only ${q} left in ${col().n}.</b>`:`<b>In stock in ${col().n}.</b>`} Order in <b>${cutoff().txt}</b> for dispatch ${cutoff().day}.</span>`;
  set();eta();
 }
 function set(){
  if(!st.tr&&st.tab==='trundle') st.tab='top';
  const P2=pos();
  $('#ptabs').innerHTML=P2.map(k=>{const s=st.sel[k]?P[st.sel[k]]:null;return `<button class="ptab ${st.tab===k?'on':''}" data-p="${k}" role="tab" aria-selected="${st.tab===k}"><b>${POS[k].label}</b><span>${POS[k].size} · ≤${POS[k].max}cm</span><span class="ch ${s?'':'none'}">${s?I.chk+' '+s.name.replace(' Mattress',''):'No mattress'}</span></button>`}).join('');
  $$('.ptab').forEach(b=>b.onclick=()=>{st.tab=b.dataset.p;if(st.view>1) st.view=0;set();gallery()});
  const k=st.tab,ps=POS[k];const sz=mats.filter(m=>m.size===ps.size);const fit=sz.filter(m=>m.thk<=ps.max),no=sz.filter(m=>m.thk>ps.max);
  const opt=m=>{const off=offerOn(m);return `<button class="mo ${st.sel[k]===m.id?'on':''}" data-m="${m.id}" aria-pressed="${st.sel[k]===m.id}"><span class="rd"></span><span class="mo__vis">${mattSVG(m.thk,ps.max)}</span><span><span class="mo__n">${m.name}</span><span class="mo__m"><span class="ok">✓ Fits</span> · ${m.thk}cm · ${m.feel} · ${WH[m.wh].short}</span></span><span class="mo__p"><b>${fm2(offerPrice(m))}</b>${off?`<s>${fm(m.price)}</s><small>−${OFFER.pct}% with bed</small>`:'<small style="color:var(--muted)">No offer</small>'}</span></button>`};
  const bad=m=>`<div class="mo bad"><span class="rd"></span><span class="mo__vis">${mattSVG(m.thk,ps.max)}</span><span><span class="mo__n">${m.name}</span><span class="mo__m">Too thick: ${m.thk}cm is over ${ps.max}cm</span></span><span class="mo__p"><b>${fm(m.price)}</b></span></div>`;
  $('#ppanel').innerHTML=`<div class="fitbar"><span>${ps.label}</span><span>${ps.size}</span><span>Max ${ps.max}cm</span><span class="ok">${fit.length} fit</span></div>${fit.map(opt).join('')}<button class="mo mo--none ${!st.sel[k]?'on':''}" data-m=""><span class="rd"></span><span class="mo__n">No mattress for the ${ps.label.toLowerCase()}</span></button>
   ${no.length?`<button class="showbad" id="sbad">${st.bad[k]?'Hide':'Show'} ${no.length} that won't fit ${I.chev}</button>${st.bad[k]?`<div style="margin-top:8px">${no.map(bad).join('')}</div>`:''}`:''}`;
  $$('#ppanel .mo[data-m]').forEach(b=>b.onclick=()=>{st.sel[k]=b.dataset.m||null;const nx=P2.find(x=>x!==k&&st.sel[x]===undefined);set();sync()});
  const sb=$('#sbad');if(sb) sb.onclick=()=>{st.bad[k]=!st.bad[k];set()};
  // addons
  $('#addons').innerHTML=ADD.map(id=>{const p=P[id];const on=!!st.adds[id];return `<button class="addon ${on?'on':''}" data-a="${id}" aria-pressed="${on}"><span class="addon__img"><img src="${U(p.img,120)}" alt="" loading="lazy"></span><span><b>${p.name}</b><span>${fm2(offerPrice(p))} <s style="color:var(--muted-2)">${offerOn(p)?fm(p.price):''}</s></span></span><span class="cb">${on?I.chk:''}</span></button>`}).join('');
  $$('.addon').forEach(b=>b.onclick=()=>{st.adds[b.dataset.a]=!st.adds[b.dataset.a];set()});
  sum();
 }
 function sum(){
  const ch=pos().filter(p=>st.sel[p]).map(p=>({p,m:P[st.sel[p]]}));const ad=ADD.filter(a=>st.adds[a]).map(a=>P[a]);
  const mN=ch.reduce((a,c)=>a+offerPrice(c.m),0),mW=ch.reduce((a,c)=>a+c.m.price,0),aN=ad.reduce((a,p)=>a+offerPrice(p),0),aW=ad.reduce((a,p)=>a+p.price,0);
  const tot=(bp()+mN+aN)*st.qty,sv=((bw()-bp())+(mW-mN)+(aW-aN))*st.qty;
  $('#sumrows').innerHTML=`<div><span class="m">Harbour bunk${st.tr?' + trundle':''} · ${col().n}${st.qty>1?' × '+st.qty:''}</span><span>${fm2(bp()*st.qty)}</span></div>${ch.map(c=>`<div><span class="m">${POS[c.p].label}: ${c.m.name.replace(' Mattress','')}</span><span>${fm2(offerPrice(c.m)*st.qty)}</span></div>`).join('')}${ad.map(p=>`<div><span class="m">${p.name}</span><span>${fm2(offerPrice(p)*st.qty)}</span></div>`).join('')}<div><span class="s">You save</span><span class="s">−${fm2(sv)}</span></div>`;
  $('#sumtot').innerHTML=`<span>Sleep set total</span><b>${fm2(tot)}</b>`;
  $('#sumbnpl').innerHTML=`or 4 × <b style="color:#fff">${fm2(tot/4)}</b> <span class="pay pay--ap">afterpay</span> <span class="pay pay--zip">zip</span>`;
  const lbl=isOos()?'Sold out: choose another finish':isPre()?`Pre-order sleep set`:`Add sleep set to cart`;
  $('#atc').innerHTML=`${lbl} ${isOos()?'':`<span class="arr">${I.arr}</span>`}`;$('#atc').disabled=isOos();
  $('#stk-t').innerHTML=`<b>Harbour Bunk · ${col().n}</b><span>${fm2(tot)} · ${ch.length} mattress${ch.length===1?'':'es'}${ad.length?` + ${ad.length} add-on${ad.length>1?'s':''}`:''}</span>`;
  $('#stk-btn').disabled=isOos();
 }
 function eta(){
  const r=pcInfo(st.pc);const e=$('#eta');
  e.className='eta'+(isPre()?' eta--pre':'');
  e.innerHTML=`${I.truck}<div style="flex:1"><b>${isPre()?`Pre-order: ships when stock lands (${col().pre})`:r?`Arrives ${etaRange(r.days)} to ${r.pc}`:'Get your delivery date'}</b><span>${r?`${r.metro?'Metro':'Regional'} ${r.st} · ships from ${WH.syd.short}${r.pickup&&r.near==='syd'?' · free click & collect available':''}`:'Enter your postcode for an arrival estimate'}</span>
   <form id="etaf"><label class="sr" for="etain">Postcode</label><input id="etain" inputmode="numeric" maxlength="4" placeholder="Postcode" value="${st.pc}"><button>${r?'Update':'Check'}</button></form></div>`;
  $('#etaf').onsubmit=ev=>{ev.preventDefault();const v=$('#etain').value.trim();if(!pcInfo(v)){toast('Enter a valid 4-digit postcode');return}st.pc=v;store.set('bna_pc',v);eta()};
 }
 $$('.cfg').forEach(b=>b.onclick=()=>{st.tr=b.dataset.t==='1';if(st.tr) st.tab='trundle';st.view=0;buy();gallery()});
 $('#qm').onclick=()=>{st.qty=Math.max(1,st.qty-1);$('#qn').textContent=st.qty;sum()};$('#qp').onclick=()=>{st.qty=Math.min(9,st.qty+1);$('#qn').textContent=st.qty;sum()};
 const go=()=>{if(isOos()) return;add('bk-harbour',{qty:st.qty,variant:col().n+(st.tr?' · with trundle':''),add:st.tr?349:0});
  pos().forEach(p=>{if(st.sel[p]) add(st.sel[p],{qty:st.qty,pos:POS[p].label+' mattress'})});ADD.forEach(a=>{if(st.adds[a]) add(a,{qty:st.qty})});openCart()};
 $('#atc').onclick=go;$('#stk-btn').onclick=go;
 const sk=$('.stick');$('#stk-img').innerHTML=bunkSVG({color:'oak'});
 if('IntersectionObserver' in window) new IntersectionObserver(([e])=>sk.classList.toggle('show',!e.isIntersecting&&e.boundingClientRect.top<0)).observe($('#atc'));
 buy();gallery();
 const rel=$('#rel');if(rel){rel.innerHTML=['bk-coast','bk-ridge','b-noah','b-harper','m-hybrid-q'].map(id=>pcHTML(P[id])).join('');bindCards(rel)}
 $$('.fx-bunk').forEach((el,i)=>el.innerHTML=bunkSVG({color:i?'white':'charcoal',trundle:!!i,dark:true}));
 if(location.hash==='#sleepset') setTimeout(()=>$('#sleepset').scrollIntoView({behavior:'smooth',block:'center'}),400);
}

/* ================= public + init ================= */
window.BEDS={P,WH,OFFER,PRE,store,toast,add,openCart,pcInfo,bunkSVG,mattSVG,fm,fm2};
document.addEventListener('DOMContentLoaded',()=>{
 chrome();cartEl();renderCart();loader();home();pdp();motion();
 $$('[data-pct]').forEach(e=>e.textContent=OFFER.pct);
 const n=document.body.dataset.notes;if(n&&window.BEDS_NOTES&&window.BEDS_NOTES[n]) notes(window.BEDS_NOTES[n]);
});
})();
