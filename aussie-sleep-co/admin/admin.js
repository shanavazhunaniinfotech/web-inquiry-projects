/* beds.net.au concept — mock admin */
document.addEventListener('DOMContentLoaded',function(){
'use strict';
const B=window.BEDS,P=B.P,WH=B.WH,money2=B.money2,store=B.store;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const DEF={
  offer:{pct:15,types:['mattress','accessory'],exclude:['m-euro-s']},
  pre:{on:true,eta:'15 Jan'},
  pos:{top:{size:'Single',max:16},bottom:{size:'Double',max:22},trundle:{size:'Single',max:12}},
  inv:{oak:4,white:7,charcoal:0},
  threshold:2,alertEmail:'orders@beds.net.au',
  locations:[]
};
let A=Object.assign({},JSON.parse(JSON.stringify(DEF)),store.get('bna_admin',{}));
const save=(msg)=>{store.set('bna_admin',A);B.toast('✓ '+(msg||'Saved'))};
const main=$('#adm-main');
const sw=(on,attr)=>`<button type="button" class="sw ${on?'on':''}" ${attr} role="switch" aria-checked="${on}"></button>`;
const mats=Object.values(P).filter(p=>p.type==='mattress');
const allLoc=()=>Object.keys(WH).map(k=>Object.assign({k},WH[k],{addr:{syd:'Wetherill Park NSW 2164',mel:'Dandenong South VIC 3175',bne:'Rocklea QLD 4106'}[k],carrier:'Allied Express'})).concat(A.locations);

/* ---------------- sections ---------------- */
const S={};
S.home=()=>{
  const low=Object.entries(A.inv).filter(([k,v])=>v<=A.threshold);
  return `<div class="adm-h"><div><h1>Good morning 👋</h1><p>Here's what needs your attention today.</p></div></div>
  <div class="kpis"><div class="kpi"><small>Sales today</small><b>$8,412</b></div><div class="kpi"><small>Orders</small><b>14</b></div><div class="kpi"><small>Products</small><b>~100</b></div><div class="kpi"><small>Locations</small><b>${allLoc().length}</b></div></div>
  <div class="acard todo"><h3>To do</h3>
    <a href="#orders">📦 1 order ready to fulfil: create consignment notes<span>›</span></a>
    <a href="#alerts">🔔 ${low.length} variant${low.length===1?'':'s'} at or below the low-stock threshold (${A.threshold})<span>›</span></a>
    <a href="#product">🕒 Harbour Charcoal is ${A.pre.on?'on pre-order · ETA '+A.pre.eta:'not on pre-order'}<span>›</span></a>
    <a href="#locations">📍 Add a new supplier warehouse<span>›</span></a>
    <a href="#discounts">🏷️ Bed offer: ${A.offer.pct}% off mattresses &amp; accessories<span>›</span></a>
  </div>
  <div class="acard"><h3>Try it</h3><p class="sub" style="margin:0">Change the offer to 20% or a mattress position's max thickness, then open the <a href="../product/" style="color:var(--accent);font-weight:700">Harbour bunk page</a>. The store updates straight away.</p></div>`;
};
S.product=()=>{
  const POS_L={top:'Top bunk',bottom:'Bottom bunk',trundle:'Trundle'};
  const V=[['oak','Natural Oak'],['white','White'],['charcoal','Charcoal']];
  return `<div class="adm-h"><div><h1>Harbour Single-over-Double Bunk</h1><p>Products › Bunks · Vendor: ${WH.syd.sup} · Location: ${WH.syd.name}</p></div><a class="abtn abtn--2" href="../product/">View on store ↗</a></div>
  <div class="agrid"><div>
   <div class="acard"><h3>🛏️ Mattress positions <span class="st st--info">metafield</span></h3><p class="sub">Each sleeping position's mattress size and maximum thickness. The product page only offers mattresses that match.</p>
    <table class="atable atable--wide"><thead><tr><th>Position</th><th>Mattress size</th><th>Max thickness</th><th>Fits now</th></tr></thead><tbody>
    ${Object.keys(POS_L).map(k=>{const p=A.pos[k];const n=mats.filter(m=>m.size===p.size&&m.thk<=p.max&&!m.cat).length;return `<tr><td><b>${POS_L[k]}</b></td><td><select class="ain" data-pos="${k}" data-f="size">${['Single','King Single','Double','Queen'].map(s=>`<option ${s===p.size?'selected':''}>${s}</option>`).join('')}</select></td><td><div style="display:flex;gap:6px;align-items:center"><input class="ain ain--sm" type="number" min="5" max="40" value="${p.max}" data-pos="${k}" data-f="max"> cm</div></td><td><span class="st ${n?'st--ok':'st--bad'}" data-fit="${k}">${n} mattress${n===1?'':'es'}</span></td></tr>`}).join('')}
    </tbody></table>
    <button class="abtn abtn--2" style="margin-top:12px" type="button" onclick="BEDS.toast('New positions (e.g. a 2nd trundle) are added as another row')">+ Add position</button></div>
   <div class="acard"><h3>📦 Inventory · ${WH.syd.name}</h3><p class="sub">Stock is updated by your team. At 0, a variant shows "Out of stock" unless pre-order is on.</p>
    <table class="atable atable--wide"><thead><tr><th>Variant</th><th>Available</th><th>Status on store</th><th>Pre-order</th></tr></thead><tbody>
    ${V.map(([k,n])=>{const q=A.inv[k];const pre=k==='charcoal'&&A.pre.on;const s=q>0?(q<=A.threshold?'<span class="st st--warn">Low stock</span>':'<span class="st st--ok">In stock</span>'):pre?'<span class="st st--pre">Pre-order</span>':'<span class="st st--bad">Out of stock</span>';
      return `<tr><td><b>${n}</b></td><td><input class="ain ain--sm" type="number" min="0" value="${q}" data-inv="${k}"></td><td>${s}</td><td>${k==='charcoal'?sw(A.pre.on,'data-pre'):'<span style="color:#8a8a8a">Off</span>'}</td></tr>`}).join('')}
    </tbody></table>
    <div class="afield" style="margin-top:14px;max-width:260px"><label class="albl" for="eta">Charcoal estimated arrival (ETA)</label><input class="ain" id="eta" value="${A.pre.eta}" ${A.pre.on?'':'disabled'}><div class="ahelp">Shown on the product page, cart, checkout and confirmation email.</div></div></div>
  </div><div>
   <div class="acard"><h3>Status</h3><p class="sub" style="margin-bottom:8px"><span class="st st--ok">Active</span></p><p class="sub" style="margin:0">Sales channels: Online Store, Google &amp; YouTube, Facebook &amp; Instagram</p></div>
   <div class="acard"><h3>Shipping</h3><table class="atable"><tbody><tr><td>Weight</td><td>78 kg</td></tr><tr><td>Cubic</td><td>0.42 m³</td></tr><tr><td>Boxes</td><td>3</td></tr></tbody></table><p class="ahelp">Used by the carrier API for live freight quotes.</p></div>
   <div class="acard"><h3>Organisation</h3><table class="atable"><tbody><tr><td>Type</td><td>Bunk</td></tr><tr><td>Vendor</td><td>${WH.syd.sup}</td></tr><tr><td>Collections</td><td>Bunks, Sale</td></tr></tbody></table></div>
  </div></div>
  <div class="savebar" id="savebar"><span>Unsaved changes</span><div style="display:flex;gap:8px"><button class="abtn abtn--2" id="discard" type="button">Discard</button><button class="abtn abtn--g" id="dosave" type="button">Save</button></div></div>`;
};
S.locations=()=>`<div class="adm-h"><div><h1>Locations</h1><p>Settings › Locations · each supplier warehouse is a Location with its own stock, pickup and freight origin.</p></div><button class="abtn" id="addloc-btn" type="button">+ Add location</button></div>
  <div class="acard" id="addloc" style="display:none"><h3>Add a new supplier warehouse</h3><p class="sub">That's all your team fills in. Inventory, click &amp; collect and freight quoting pick it up automatically.</p>
   <div class="agrid" style="grid-template-columns:1fr 1fr;gap:0 14px">
    <div class="afield"><label class="albl" for="ln">Location name</label><input class="ain" id="ln" value="Perth WA warehouse"></div>
    <div class="afield"><label class="albl" for="lsup">Supplier (vendor)</label><input class="ain" id="lsup" value="Supplier D"></div>
    <div class="afield"><label class="albl" for="laddr">Address</label><input class="ain" id="laddr" value="Welshpool WA 6106"></div>
    <div class="afield"><label class="albl" for="lcar">Carrier account</label><select class="ain" id="lcar"><option>Allied Express</option><option>Hunter Express</option><option>Global Express</option><option>Starshipit (multi-carrier)</option></select></div>
   </div>
   <div style="display:flex;gap:10px;align-items:center;margin-bottom:14px">${sw(true,'id="lpk"')}<span>Offer click &amp; collect from this location (metro postcodes)</span></div>
   <button class="abtn abtn--g" id="saveloc" type="button">Save location</button> <button class="abtn abtn--2" type="button" id="cancelloc">Cancel</button></div>
  <div class="acard"><table class="atable atable--wide"><thead><tr><th>Location</th><th>Supplier</th><th>Address</th><th>Carrier</th><th>Click &amp; collect</th><th>Freight</th></tr></thead><tbody>
   ${allLoc().map(l=>`<tr><td><b>${l.name}</b>${l.isNew?' <span class="st st--info">New</span>':''}</td><td>${l.sup}</td><td>${l.addr}</td><td>${l.carrier}</td><td>${l.pickup?'<span class="st st--ok">On</span>':'<span class="st">Off</span>'}</td><td><span class="st st--ok">Live quotes</span></td></tr>`).join('')}
  </tbody></table></div>`;
S.discounts=()=>{
  const o=A.offer;const ex=o.exclude;
  const sample=P['m-bunk-s'];const off=sample.price*(1-o.pct/100);
  return `<div class="adm-h"><div><h1>Bed offer</h1><p>Discounts › Automatic discount · applies when a bed or bunk is in the cart</p></div><span class="st st--ok">Active</span></div>
  <div class="agrid"><div>
   <div class="acard"><h3>Value</h3><div style="display:flex;gap:10px;align-items:center"><input class="ain ain--sm" type="number" min="0" max="60" id="pct" value="${o.pct}"> <b>% off</b></div><div class="ahelp">Change it any time. The product page, cart and checkout update straight away.</div></div>
   <div class="acard"><h3>Applies to items added with a bed</h3>
    ${[['mattress','Mattresses (incl. each bunk position)'],['accessory','Accessories: protectors, pillows, sheets']].map(([k,n])=>`<label style="display:flex;gap:10px;align-items:center;padding:6px 0"><input type="checkbox" data-type="${k}" ${o.types.includes(k)?'checked':''}> ${n}</label>`).join('')}
   </div>
   <div class="acard"><h3>Excluded products</h3><p class="sub">These keep their normal price, even with a bed.</p>
    <div class="chips" id="chips">${ex.map(id=>`<span class="chip">${P[id].name} · ${P[id].size}<button type="button" data-unex="${id}" aria-label="Remove">✕</button></span>`).join('')||'<span style="color:#8a8a8a">No exclusions</span>'}</div>
    <div style="display:flex;gap:8px;margin-top:12px"><select class="ain" id="exsel">${mats.filter(m=>!ex.includes(m.id)).map(m=>`<option value="${m.id}">${m.name} · ${m.size} ${m.thk}cm</option>`).join('')}</select><button class="abtn abtn--2" id="exadd" type="button">Exclude</button></div></div>
  </div><div>
   <div class="acard"><h3>Preview on the bunk page</h3><div class="preview-card"><div class="pv-img">${B.mattressSVG(16,A.pos.top.max)}</div><div><b>${sample.name}</b><div style="font-size:13px;color:#616161">Top bunk · Single 16cm</div><div style="margin-top:4px"><b>${money2(o.types.includes('mattress')?off:sample.price)}</b> <s style="color:#8a8a8a">${o.types.includes('mattress')?money2(sample.price):''}</s></div></div></div>
   <a class="abtn abtn--2" style="margin-top:12px" href="../product/#sleepset">Open bunk page ↗</a></div>
  </div></div>`;
};
S.alerts=()=>{
  const V={oak:'Natural Oak',white:'White',charcoal:'Charcoal'};
  const low=Object.entries(A.inv).filter(([k,v])=>v<=A.threshold);
  return `<div class="adm-h"><div><h1>Low-stock alerts</h1><p>Shopify Flow workflow · emails you so you can check stock with the supplier</p></div><span class="st st--ok">Workflow on</span></div>
  <div class="acard"><div class="flow">
   <div class="flow__n"><small>Trigger</small><b>Inventory quantity changed</b><span style="color:#616161;font-size:13px">Any product, any location</span></div><div class="flow__a">→</div>
   <div class="flow__n"><small>Condition</small><b>Available ≤ <input class="ain ain--sm" style="height:30px;width:60px;display:inline-block" type="number" min="0" id="thr" value="${A.threshold}"> units</b><span style="color:#616161;font-size:13px">and not on pre-order</span></div><div class="flow__a">→</div>
   <div class="flow__n"><small>Action</small><b>Send internal email</b><input class="ain" style="height:30px;margin-top:4px" id="aem" value="${A.alertEmail}"></div>
  </div><div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button class="abtn abtn--g" id="savethr" type="button">Save</button><button class="abtn abtn--2" id="testmail" type="button">Send test email</button></div><div id="mailbox"></div></div>
  <div class="acard"><h3>Currently at or below threshold</h3><table class="atable"><tbody>${low.length?low.map(([k,v])=>`<tr><td>Harbour Bunk · ${V[k]}</td><td>${WH.syd.short}</td><td><span class="st ${v===0?'st--bad':'st--warn'}">${v} left</span></td></tr>`).join(''):'<tr><td style="color:#8a8a8a">Nothing low right now</td></tr>'}</tbody></table></div>`;
};
function lastOrder(){
  return store.get('bna_last_order',null)||{no:'BN1041',pc:'2153',total:2181.65,demo:true,legs:[
    {w:'syd',kg:112,m3:.96,carrier:'Allied Express',items:[{id:'bk-harbour',qty:1},{id:'m-bunk-s',qty:1},{id:'m-bunk-d',qty:1}]},
    {w:'mel',kg:2,m3:.01,carrier:'Allied Express',items:[{id:'a-sheets',qty:1}]}]};
}
S.orders=()=>{
  const o=lastOrder();const done=store.get('bna_connotes',{});
  return `<div class="adm-h"><div><h1>Order #${o.no}</h1><p>Paid · ${money2(o.total)} · deliver to ${o.pc}${o.demo?' · sample order (place one in the demo checkout to see yours here)':''}</p></div><span class="st st--warn">Unfulfilled</span></div>
  <div class="acard"><h3>Fulfil by warehouse</h3><p class="sub">Each warehouse leg gets its own consignment note, made manually with one click as the SOW asks.</p>
  ${o.legs.map((L,i)=>{const c=done[o.no+'-'+i];return `<div class="leg-ful"><div class="leg-ful__h"><b><i style="background:${WH[L.w].color}"></i>${L.pickup?'Click & collect':'Ship'} from ${WH[L.w].name}</b>${c?'<span class="st st--ok">Connote created</span>':'<span class="st st--warn">Unfulfilled</span>'}</div>
    <p style="color:#616161;margin:6px 0 10px">${L.items.map(x=>`${x.qty}× ${P[x.id].name}`).join(' · ')} · ${Math.round(L.kg)} kg · ${(+L.m3).toFixed(2)} m³</p>
    ${L.pickup?`<button class="abtn abtn--2" type="button" onclick="BEDS.toast('Customer emailed: ready for collection')">Mark ready for pickup</button>`:c?labelHTML(c,L,o):`<button class="abtn" type="button" data-con="${i}">Create consignment note · ${L.carrier}</button>`}
  </div>`}).join('')}</div>`;
};
function barcode(seed){let x=0,out='';for(let i=0;i<46;i++){const w=1+((seed.charCodeAt(i%seed.length)+i*7)%3);if(i%2===0) out+=`<rect x="${x}" y="0" width="${w}" height="56" fill="#111"/>`;x+=w+1}return `<svg viewBox="0 0 ${x} 56" preserveAspectRatio="none">${out}</svg>`}
function labelHTML(c,L,o){
  return `<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start"><div class="label"><div class="label__top"><span>${L.carrier.toUpperCase()}</span><span>ROAD</span></div>
   <div>FROM: ${WH[L.w].name}</div><div>TO: S. Mitchell, ${o.pc}</div><div>${Math.round(L.kg)} KG · ${(+L.m3).toFixed(2)} M³ · ${L.items.reduce((a,x)=>a+x.qty,0)} ITEMS</div>
   <div class="big">${c.no}</div>${barcode(c.no)}</div>
   <div style="display:grid;gap:8px;min-width:200px"><button class="abtn abtn--2" type="button" onclick="BEDS.toast('Label sent to printer (PDF)')">🖨 Print label</button>
   ${c.pickup?`<span class="st st--ok">Pickup booked: ${c.pickup}</span>`:`<button class="abtn" type="button" data-book="${c.key}">Book carrier pickup</button>`}
   <span class="ahelp">Tracking number added to the order and emailed to the customer.</span></div></div>`;
}

/* ---------------- render + events ---------------- */
let dirty=false;
function render(){
  let s=(location.hash||'#home').slice(1);
  if(s==='reset'){store.set('bna_admin',{});store.set('bna_connotes',{});store.set('bna_last_order',null);A=JSON.parse(JSON.stringify(DEF));B.toast('Demo reset to defaults');location.hash='#home';return}
  if(!S[s]) s='home';
  $$('#adm-nav a').forEach(a=>a.classList.toggle('on',a.dataset.s===s));
  main.innerHTML=S[s]();dirty=false;
  bind(s);window.scrollTo(0,0);
  const o=lastOrder();const done=store.get('bna_connotes',{});const open=o.legs.some((L,i)=>!L.pickup&&!done[o.no+'-'+i]);
  $('#ord-pill').style.display=open?'':'none';
}
function markDirty(){dirty=true;const b=$('#savebar');if(b) b.classList.add('show')}
function bind(s){
  if(s==='product'){
    $$('[data-pos]').forEach(el=>el.addEventListener('input',()=>{const k=el.dataset.pos;A.pos[k][el.dataset.f]=el.dataset.f==='max'?+el.value:el.value;const p=A.pos[k];const n=mats.filter(m=>m.size===p.size&&m.thk<=p.max&&!m.cat).length;const f=$(`[data-fit="${k}"]`);f.textContent=`${n} mattress${n===1?'':'es'}`;f.className='st '+(n?'st--ok':'st--bad');markDirty()}));
    $$('[data-inv]').forEach(el=>el.addEventListener('input',()=>{A.inv[el.dataset.inv]=Math.max(0,+el.value||0);markDirty()}));
    const pre=$('[data-pre]');if(pre) pre.onclick=()=>{A.pre.on=!A.pre.on;pre.classList.toggle('on',A.pre.on);pre.setAttribute('aria-checked',A.pre.on);$('#eta').disabled=!A.pre.on;markDirty()};
    $('#eta').addEventListener('input',e=>{A.pre.eta=e.target.value;markDirty()});
    $('#dosave').onclick=()=>{save('Product saved, the bunk page is updated');render()};
    $('#discard').onclick=()=>{A=Object.assign({},JSON.parse(JSON.stringify(DEF)),store.get('bna_admin',{}));render()};
  }
  if(s==='locations'){
    $('#addloc-btn').onclick=()=>{$('#addloc').style.display='block';$('#ln').focus()};
    $('#cancelloc').onclick=()=>{$('#addloc').style.display='none'};
    const lpk=$('#lpk');lpk.onclick=()=>{lpk.classList.toggle('on');lpk.setAttribute('aria-checked',lpk.classList.contains('on'))};
    $('#saveloc').onclick=()=>{A.locations.push({k:'loc'+Date.now(),name:$('#ln').value||'New warehouse',sup:$('#lsup').value||'New supplier',addr:$('#laddr').value,carrier:$('#lcar').value,pickup:lpk.classList.contains('on'),isNew:true});save('Location added: stock, pickup &amp; freight rules apply automatically');render()};
  }
  if(s==='discounts'){
    $('#pct').addEventListener('change',e=>{A.offer.pct=Math.min(60,Math.max(0,+e.target.value||0));save(`Bed offer is now ${A.offer.pct}% off`);render()});
    $$('[data-type]').forEach(c=>c.onchange=()=>{const t=c.dataset.type;A.offer.types=c.checked?[...new Set(A.offer.types.concat(t))]:A.offer.types.filter(x=>x!==t);save();render()});
    $$('[data-unex]').forEach(b=>b.onclick=()=>{A.offer.exclude=A.offer.exclude.filter(x=>x!==b.dataset.unex);save('Exclusion removed');render()});
    $('#exadd').onclick=()=>{const v=$('#exsel').value;if(v){A.offer.exclude.push(v);save('Product excluded from the offer');render()}};
  }
  if(s==='alerts'){
    $('#savethr').onclick=()=>{A.threshold=Math.max(0,+$('#thr').value||0);A.alertEmail=$('#aem').value;save('Workflow saved');render()};
    $('#testmail').onclick=()=>{$('#mailbox').innerHTML=`<div class="email"><div class="email__h"><b>To:</b> ${$('#aem').value} · <b>Subject:</b> Low stock: Harbour Bunk · Natural Oak (${A.inv.oak} left)</div><div class="email__b">Hi team,<br><br><b>Harbour Single-over-Double Bunk · Natural Oak</b> is down to <b>${A.inv.oak}</b> at <b>${WH.syd.name}</b> (threshold ${$('#thr').value}).<br>Supplier: ${WH.syd.sup}. Please check stock and update inventory in Shopify.<br><br><span style="color:#8a8a8a">Sent by Shopify Flow</span></div></div>`};
  }
  if(s==='orders'){
    const o=lastOrder();
    $$('[data-con]').forEach(b=>b.onclick=()=>{const i=+b.dataset.con;const L=o.legs[i];const pre={'Allied Express':'AE','Hunter Express':'HX'}[L.carrier]||'CN';const done=store.get('bna_connotes',{});
      b.disabled=true;b.innerHTML='<span class="spin" style="width:14px;height:14px;border-width:2px"></span> Creating…';
      setTimeout(()=>{done[o.no+'-'+i]={key:o.no+'-'+i,no:pre+'-'+(Math.floor(Math.random()*9000)+1000)+'-'+(Math.floor(Math.random()*9000)+1000)};store.set('bna_connotes',done);render();B.toast('Consignment note created')},800)});
    $$('[data-book]').forEach(b=>b.onclick=()=>{const done=store.get('bna_connotes',{});done[b.dataset.book].pickup='tomorrow, 10am–2pm';store.set('bna_connotes',done);render();B.toast('Carrier pickup booked')});
  }
}
window.addEventListener('hashchange',()=>{if(dirty&&!confirm('Discard unsaved changes?')) return;render()});
render();
});
