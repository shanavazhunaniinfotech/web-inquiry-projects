/* beds.net.au concept — checkout with split freight per warehouse */
document.addEventListener('DOMContentLoaded',function(){
'use strict';
const B=window.BEDS,P=B.P,WH=B.WH,money2=B.money2,ic=B.ic;
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const ORIGIN={syd:'NSW',mel:'VIC',bne:'QLD'};
const STATE_OF=B.pcInfo;

// seed a demo cart (bunk set from Sydney + sheets from Melbourne) if empty
let cart=B.getCart();
if(!cart.length){
  B.setCart([
    {key:'bk-harbour|Natural Oak|',id:'bk-harbour',qty:1,variant:'Natural Oak',pos:'',add:0},
    {key:'m-bunk-s||Top bunk mattress',id:'m-bunk-s',qty:1,variant:'',pos:'Top bunk mattress',add:0},
    {key:'m-bunk-d||Bottom bunk mattress',id:'m-bunk-d',qty:1,variant:'',pos:'Bottom bunk mattress',add:0},
    {key:'a-sheets||',id:'a-sheets',qty:1,variant:'',pos:'',add:0}
  ]);
  cart=B.getCart();
  setTimeout(()=>B.toast('Demo cart loaded: bunk set from Sydney + sheets from Melbourne'),400);
}

// weight + cubic: product fields in Shopify
function spec(p){
  if(p.type==='bunk') return {kg:78,m3:.42};
  if(p.type==='bed'){const m={'Single Beds':[38,.35],'King Single Beds':[45,.42],'Double Beds':[52,.48],'Queen Beds':[62,.55],'King Beds':[70,.62]}[p.cat]||[55,.5];return {kg:m[0],m3:m[1]}}
  if(p.type==='mattress'){const m={Single:[14,.22],Double:[20,.32],Queen:[26,.40],King:[30,.46]}[p.size]||[18,.3];return {kg:m[0]+Math.round(p.thk/4),m3:m[1]}}
  return {kg:1.5,m3:.01};
}
function zoneFor(wh,d){
  const o=ORIGIN[wh];
  if(d.st===o&&d.metro) return {z:'Metro',base:39,days:[2,3]};
  if(d.st===o) return {z:'Regional',base:69,days:[3,5]};
  if(['WA','NT','TAS'].includes(d.st)) return {z:'Remote interstate',base:129,days:[7,12]};
  return {z:'Interstate',base:89,days:[4,7]};
}
const CARRIERS=[{n:'Allied Express',s:'Road freight',k:1,d:0},{n:'Hunter Express',s:'Priority road',k:1.14,d:-1}];

const st={mode:'ship',pc:'2153',sel:{},pay:'card',legs:[]};
let quoteTimer;

function subtotal(){return cart.reduce((a,l)=>a+B.unitPrice(l).now*l.qty,0)}
function savings(){return cart.reduce((a,l)=>{const u=B.unitPrice(l);const p=P[l.id];return a+((u.base-u.now)+(p.was?p.was-p.price:0))*l.qty},0)}

function buildLegs(){
  const d=STATE_OF(st.pc);if(!d) return null;
  const groups={};cart.forEach(l=>{(groups[P[l.id].wh]=groups[P[l.id].wh]||[]).push(l)});
  const sub=subtotal();
  const pickupWh=(st.mode==='pickup'&&d.pickup)?d.near:null;
  return Object.keys(groups).map(w=>{
    const items=groups[w];
    const kg=items.reduce((a,l)=>a+spec(P[l.id]).kg*l.qty,0);
    const m3=items.reduce((a,l)=>a+spec(P[l.id]).m3*l.qty,0);
    if(w===pickupWh) return {w,items,kg,m3,pickup:true,rates:[{n:'Click & collect',s:WH[w].name+' · ready in 1–2 business days',amt:0}]};
    const z=zoneFor(w,d);
    // small parcels (pillows, sheets) go on parcel rates, not bulky freight
    const parcel=kg<5&&m3<.05;
    if(parcel){z.base={Metro:12,Regional:16,Interstate:19,'Remote interstate':28}[z.z];z.z+=' parcel'}
    const raw=parcel?z.base+kg*1.2:z.base+kg*.48+m3*110;
    const rates=CARRIERS.map(c=>{let amt=Math.round(raw*c.k*100)/100;const d0=Math.max(1,z.days[0]+c.d),d1=Math.max(d0+1,z.days[1]+c.d);
      const free=c.k===1&&/^Metro/.test(z.z)&&sub>=1500;
      return {n:c.n,s:`${c.s} · ${d0}–${d1} business days`,amt:free?0:amt,was:free?amt:null,free}});
    return {w,items,kg,m3,z,raw,rates};
  });
}
function freightTotal(){return st.legs.reduce((a,L)=>a+(L.rates[st.sel[L.w]||0]||L.rates[0]).amt,0)}

function drawDelivery(){
  const d=STATE_OF(st.pc);
  const pk=$('[data-m="pickup"]');
  const ok=d&&d.pickup;
  pk.disabled=!ok;
  $('#pk-sub').textContent=ok?`${WH[d.near].short} warehouse, free`:'Metro Sydney & Melbourne only';
  if(!ok&&st.mode==='pickup') st.mode='ship';
  $$('#dm button').forEach(b=>b.classList.toggle('on',b.dataset.m===st.mode));
  if(d) $('#stt').value=d.st;
}
function quote(){
  const box=$('#freight');
  const d=STATE_OF(st.pc);
  if(!d){box.innerHTML='<div class="quote-load">Enter a valid 4-digit Australian postcode to get freight quotes.</div>';st.legs=[];drawSummary();return}
  box.innerHTML=`<div class="quote-load"><span class="spin"></span>Getting live quotes from the carrier for ${st.pc} ${d.st}…</div>`;
  st.legs=[];drawSummary(true);
  clearTimeout(quoteTimer);
  quoteTimer=setTimeout(()=>{st.legs=buildLegs()||[];st.sel={};drawFreight();drawSummary()},900);
}
function drawFreight(){
  const d=STATE_OF(st.pc);const box=$('#freight');
  const n=st.legs.length;
  box.innerHTML=(n>1?`<p style="font-size:14px;color:var(--muted);margin-bottom:12px">Your order ships from <b style="color:var(--ink)">${n} warehouses</b>. Each one is quoted separately and the freight is added together.</p>`:'')+
  st.legs.map(L=>{
    const sel=st.sel[L.w]||0;
    return `<div class="leg ${L.pickup?'leg--pickup':''}"><div class="leg__h"><b><i style="background:${WH[L.w].color}"></i>${L.pickup?'Collect from':'Ships from'} ${WH[L.w].name}</b><span>${L.kg.toFixed(0)} kg · ${L.m3.toFixed(2)} m³${L.z?` · ${L.z.z}`:''}</span></div>
     <div class="leg__items">${L.items.map(l=>`<span>${l.qty}× ${P[l.id].name.replace(' Mattress','')}</span>`).join('')}</div>
     ${L.rates.map((r,i)=>`<button type="button" class="rate ${i===sel?'on':''}" data-w="${L.w}" data-i="${i}"><span class="radio"></span><span><b>${r.n}</b><small>${r.s}</small></span><span class="amt ${r.amt===0?'free':''}">${r.amt===0?(r.free?'FREE':'Free'):money2(r.amt)}${r.was?`<small style="display:block;text-align:right;text-decoration:line-through">${money2(r.was)}</small>`:''}</span></button>`).join('')}
    </div>`}).join('')+
  `<details class="calc"><summary>How this quote was calculated</summary><table><thead><tr><th>Leg</th><th>Zone</th><th>Weight / cubic</th><th>Base rate</th></tr></thead><tbody>
    ${st.legs.map(L=>`<tr><td>${WH[L.w].short} → ${st.pc}</td><td>${L.pickup?'Pickup':L.z.z}</td><td>${L.kg.toFixed(0)} kg / ${L.m3.toFixed(2)} m³</td><td>${L.pickup?'$0':money2(L.raw)}</td></tr>`).join('')}
    <tr><td colspan="3"><b>Freight total</b></td><td><b>${money2(freightTotal())}</b></td></tr></tbody></table>
    <p style="color:var(--muted);margin-top:8px">Demo formula: zone base + $0.48/kg + $110/m³. In the live store these numbers come from the carrier API.</p></details>`;
  $$('.rate').forEach(b=>b.onclick=()=>{st.sel[b.dataset.w]=+b.dataset.i;drawFreight();drawSummary()});
}
function summaryHTML(loading){
  const sub=subtotal(),sav=savings();
  const fr=freightTotal();const total=sub+(st.legs.length?fr:0);
  return `${cart.map(l=>{const p=P[l.id],u=B.unitPrice(l);const pre=B.preOf(l);
    return `<div class="sum-line"><div class="sum-img">${B.mediaFor(p,160)}<em>${l.qty}</em></div><div><b>${p.name}</b><small>${[l.pos,l.variant].filter(Boolean).join(' · ')}</small>${u.offer?`<span class="tagx t-off">Bed offer −${B.OFFER.pct}%</span> `:''}${pre?`<span class="tagx t-pre">Pre-order · ETA ${pre}</span>`:''}</div><div class="pr">${money2(u.now*l.qty)}${u.offer?`<s>${money2(u.base*l.qty)}</s>`:''}</div></div>`}).join('')}
   <div class="code"><div class="in"><label>Discount code or gift card</label><input placeholder=" "></div><button class="btn btn--ghost btn--sm" type="button" style="min-height:52px" onclick="BEDS.toast('Discount codes are set up in Shopify Discounts')">Apply</button></div>
   <div class="sum-rows">
    <div><span class="muted">Subtotal · ${cart.reduce((a,l)=>a+l.qty,0)} items</span><span>${money2(sub)}</span></div>
    ${sav>0?`<div><span class="save">Bed offer &amp; sale savings</span><span class="save">−${money2(sav)}</span></div>`:''}
    <div><span class="muted">Freight</span><span>${loading?'<span class="muted">Calculating…</span>':st.legs.length?(fr===0?'FREE':money2(fr)):'<span class="muted">Enter postcode</span>'}</span></div>
    ${!loading&&st.legs.length>1?st.legs.map(L=>{const r=L.rates[st.sel[L.w]||0];return `<div class="sub"><span>${WH[L.w].short} leg · ${r.n}</span><span>${r.amt===0?'Free':money2(r.amt)}</span></div>`}).join(''):''}
    <div class="tot"><span>Total</span><span><small>AUD</small>${money2(total)}</span></div>
    <div class="muted" style="font-size:13px">Including ${money2(total/11)} in GST</div>
   </div>`;
}
function drawSummary(loading){
  const h=summaryHTML(loading);
  $('#summary').innerHTML=h;$('#mob-sum-body').innerHTML=h;
  const total=subtotal()+(st.legs.length?freightTotal():0);
  $('#mob-total').textContent=money2(total);
  $('#ap-body').innerHTML=`4 interest-free payments of <b style="color:var(--ink)">${money2(total/4)}</b>, every two weeks. You'll be redirected to Afterpay.`;
  $('#paynow').textContent=st.pay==='paypal'?'Continue to PayPal':st.pay==='afterpay'?'Continue to Afterpay':st.pay==='zip'?'Continue to Zip':`Pay now · ${money2(total)}`;
  const pres=cart.filter(l=>B.preOf(l));
  $('#pre-note').innerHTML=pres.length?`<div class="pre-note">${ic.clock.replace(/22/g,'18')}<div><b>Includes a pre-order item.</b> ${pres.map(l=>`${P[l.id].name}: ETA ${B.preOf(l)}`).join(', ')}. The other items ship as soon as they're ready, and the ETA is repeated in your confirmation email.</div></div>`:'';
}

// events
$('#pc').addEventListener('input',e=>{const v=e.target.value.replace(/\D/g,'').slice(0,4);e.target.value=v;st.pc=v;if(v.length===4){drawDelivery();quote()}});
$$('[data-pc]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();st.pc=a.dataset.pc;$('#pc').value=st.pc;const nm={3000:'Melbourne',4000:'Brisbane',2650:'Wagga Wagga',6000:'Perth'}[st.pc];$('#sb').value=nm;drawDelivery();quote()}));
$$('#dm button').forEach(b=>b.onclick=()=>{if(b.disabled) return;st.mode=b.dataset.m;drawDelivery();quote()});
$$('.pm-opt>button').forEach(b=>b.onclick=()=>{const o=b.parentElement;st.pay=o.dataset.p;$$('.pm-opt').forEach(x=>x.classList.toggle('on',x===o));drawSummary()});
$$('[data-ex]').forEach(b=>b.onclick=()=>B.toast('Express wallets are part of Shopify checkout'));
$('#mob-sum>button').onclick=function(){const m=$('#mob-sum');m.classList.toggle('open');this.setAttribute('aria-expanded',m.classList.contains('open'));this.firstElementChild.textContent=m.classList.contains('open')?'Hide order summary ⌃':'Show order summary ⌄'};
$('#paynow').onclick=()=>{
  if(!st.legs.length){B.toast('Enter a postcode to get freight first');return}
  const total=subtotal()+freightTotal();
  const no='BN'+(1040+Math.floor(Math.random()*50));
  B.store.set('bna_last_order',{no,pc:st.pc,legs:st.legs.map(L=>({w:L.w,pickup:!!L.pickup,kg:L.kg,m3:L.m3,carrier:L.rates[st.sel[L.w]||0].n,items:L.items.map(l=>({id:l.id,qty:l.qty}))})),total});
  $('#done-box').innerHTML=`<div class="ok-ic">${ic.check.replace(/14/g,'28')}</div><span class="eyebrow">Order ${no} confirmed</span><h2 style="font-size:32px;margin:10px 0 8px">Thanks, Sarah!</h2>
   <p style="color:var(--muted)">We've emailed your confirmation. Here's how your order will arrive:</p>
   ${st.legs.map(L=>{const r=L.rates[st.sel[L.w]||0];const pre=L.items.map(l=>B.preOf(l)).filter(Boolean)[0];return `<div class="ful"><b><i style="background:${WH[L.w].color}"></i>${L.pickup?'Collect from':'From'} ${WH[L.w].name}</b><p>${L.items.map(l=>`${l.qty}× ${P[l.id].name}`).join(', ')}</p><p><b style="display:inline;color:var(--ink)">${r.n}</b> · ${r.s}${pre?` · <span style="color:#9a5c26;font-weight:700">Pre-order ETA ${pre}</span>`:''}</p></div>`}).join('')}
   <div class="sum-rows" style="margin-top:16px"><div class="tot" style="font-size:19px"><span>Paid</span><span>${money2(total)}</span></div></div>
   <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap"><a class="btn btn--dark" href="../admin/#orders">See it in the admin (connote) →</a><a class="btn btn--ghost" href="../">Back to store</a></div>`;
  $('#done').classList.add('open');
};
$('#done').addEventListener('click',e=>{if(e.target.id==='done') $('#done').classList.remove('open')});

drawDelivery();quote();drawSummary(true);
});
