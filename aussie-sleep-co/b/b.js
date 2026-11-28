/* Design B extras: hero intro, size explorer, bunk stepper, featured illustration */
document.addEventListener('DOMContentLoaded',function(){
'use strict';
const B=window.BEDS;if(!B) return;
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
setTimeout(()=>document.body.classList.add('bh-in'),document.querySelector('.loader')?1150:80);

// floating hero card + featured card illustrations
const fl=$('#bh-ill');if(fl) fl.innerHTML=B.bunkSVG({color:'oak'});
const fb=$('#bb-ill');if(fb) fb.innerHTML=B.bunkSVG({color:'white',trundle:true});
$$('.bfx-ill').forEach((el,i)=>el.innerHTML=B.bunkSVG({color:i?'oak':'white',trundle:!i}));

/* ---------- size explorer ---------- */
const SZ=[
 {k:'Single',w:92,l:188,from:549,n:42,t:'Kids & teens',d:'The classic kids bed. Leaves the most floor space for play.'},
 {k:'King Single',w:107,l:203,from:749,n:28,t:'Tall teens',d:'15 cm wider and 15 cm longer than a single. Room to grow.'},
 {k:'Double',w:137,l:188,from:899,n:31,t:'Guest rooms',d:'Great for guest rooms, or a single sleeper who likes to sprawl.'},
 {k:'Queen',w:153,l:203,from:1199,n:56,t:'Most popular',d:'The go-to for couples. Fits most Australian main bedrooms.'},
 {k:'King',w:183,l:203,from:1449,n:33,t:'Maximum space',d:'For couples who want room to move, and the occasional visiting kid.'}
];
const tabs=$('#sz-tabs'),svg=$('#sz-svg'),info=$('#sz-info');
if(tabs){
 let cur=3;
 tabs.innerHTML=SZ.map((s,i)=>`<button class="sztab" data-i="${i}" role="tab"><span><b>${s.k}</b><span>${s.w} × ${s.l} cm · ${s.t}</span></span><em>${s.n} beds →</em></button>`).join('');
 const draw=()=>{const s=SZ[cur];
  $$('.sztab').forEach((t,i)=>{t.classList.toggle('on',i===cur);t.setAttribute('aria-selected',i===cur)});
  const K=1.05,room=360*K,ox=20,oy=20,bw=s.w*K,bl=s.l*K,bx=ox+(room-bw)/2,by=oy+18;
  const ns=s.w>=137;
  svg.innerHTML=`<svg viewBox="0 0 420 420" role="img" aria-label="${s.k} bed in a 3.6 metre room, top-down view">
   <rect x="${ox}" y="${oy}" width="${room}" height="${room}" rx="18" fill="#fff" stroke="rgba(17,18,20,.12)" stroke-width="2"/>
   <path d="M${ox} ${oy+room-70} a70 70 0 0 1 70 70" fill="none" stroke="rgba(17,18,20,.18)" stroke-width="1.5" stroke-dasharray="4 5"/>
   <rect x="${ox+room-14}" y="${oy+90}" width="6" height="110" rx="3" fill="#cfe1f5"/>
   ${ns?`<rect class="bedrect" x="${bx-46}" y="${by+4}" width="36" height="36" rx="8" fill="#ECEAE4"/><rect class="bedrect" x="${bx+bw+10}" y="${by+4}" width="36" height="36" rx="8" fill="#ECEAE4"/>`:''}
   <rect class="bedrect" x="${bx}" y="${by}" width="${bw}" height="${bl}" rx="12" fill="#111214"/>
   <rect class="bedrect" x="${bx+8}" y="${by+8}" width="${bw-16}" height="${bl-16}" rx="9" fill="#fff"/>
   <rect class="bedrect" x="${bx+8}" y="${by+bl*.42}" width="${bw-16}" height="${bl*.58-8}" rx="9" fill="#D6F25E"/>
   ${s.w>=137?`<rect x="${bx+16}" y="${by+16}" width="${bw/2-24}" height="30" rx="10" fill="#F5F4F0"/><rect x="${bx+bw/2+8}" y="${by+16}" width="${bw/2-24}" height="30" rx="10" fill="#F5F4F0"/>`:`<rect x="${bx+16}" y="${by+16}" width="${bw-32}" height="30" rx="10" fill="#F5F4F0"/>`}
   <path d="M${bx} ${by+bl+22}h${bw}" stroke="#111214" stroke-width="1.5"/><path d="M${bx} ${by+bl+16}v12M${bx+bw} ${by+bl+16}v12" stroke="#111214" stroke-width="1.5"/>
   <text x="${bx+bw/2}" y="${by+bl+42}" text-anchor="middle" font-family="Geist,sans-serif" font-size="14" font-weight="600" fill="#111214">${s.w} cm</text>
   <path d="M${bx+bw+(ns?58:22)} ${by}v${bl}" stroke="#111214" stroke-width="1.5"/><text x="${bx+bw+(ns?66:30)}" y="${by+bl/2}" font-family="Geist,sans-serif" font-size="14" font-weight="600" fill="#111214">${s.l}</text>
   <text x="${ox+16}" y="${oy+room-14}" font-family="Geist,sans-serif" font-size="12" fill="#6C6D73">Room 3.6 × 3.6 m</text>
   <text x="${ox+room-16}" y="${oy+room-14}" text-anchor="end" font-family="Geist,sans-serif" font-size="12" fill="#6C6D73">${Math.round((360-s.w)/2)} cm each side</text>
  </svg>`;
  info.innerHTML=`<div><span class="kicker"><i></i>${s.t}</span><h3 style="margin-top:12px">${s.k} · ${s.w} × ${s.l}</h3><p>${s.d}</p></div><a class="btn" href="#shop">Shop ${s.n} ${s.k.toLowerCase()} beds from $${s.from.toLocaleString()} <span class="arr">→</span></a>`;
 };
 tabs.addEventListener('click',e=>{const t=e.target.closest('.sztab');if(!t) return;cur=+t.dataset.i;draw()});draw();
}

/* ---------- bunk stepper ---------- */
const wrap=$('#bsteps');
if(wrap){
 const stage=$('#bs-stage');stage.insertAdjacentHTML('afterbegin',B.bunkSVG({color:'oak',trundle:true,labels:true,id:'bs'}));
 const steps=$$('.bstep');const chips=$('#bs-chips');
 const D=[['Single · 92 × 188','Max 16 cm','4 mattresses fit'],['Double · 137 × 188','Max 22 cm','3 mattresses fit'],['Single · 92 × 188','Max 12 cm','2 mattresses fit']];
 const K=['top','bottom','trundle'];let cur=0;
 const set=i=>{cur=i;steps.forEach((s,k)=>{s.classList.toggle('on',k===i);s.setAttribute('aria-expanded',k===i);const bar=s.querySelector('.bstep__bar i');bar.style.animation='none';void bar.offsetWidth;bar.style.animation=''});
  K.forEach((k,j)=>{const m=document.getElementById('bs-'+k);if(m) m.classList.toggle('hl',j===i);const l=stage.querySelector('.lbl-'+k);if(l) l.classList.toggle('on',j===i)});
  chips.innerHTML=D[i].map((t,j)=>`<span class="${j===1?'ok':''}">${j===1?'✓ ':''}${t}</span>`).join('')};
 steps.forEach((s,k)=>{s.addEventListener('click',()=>set(k));s.querySelector('.bstep__bar i').addEventListener('animationend',()=>{if(k===cur) set((cur+1)%3)})});
 wrap.addEventListener('mouseenter',()=>wrap.classList.add('paused'));wrap.addEventListener('mouseleave',()=>wrap.classList.remove('paused'));
 // only start auto-advance when visible
 if('IntersectionObserver' in window){wrap.classList.add('paused');new IntersectionObserver(([e])=>wrap.classList.toggle('paused',!e.isIntersecting)).observe(wrap)}
 set(0);
}
});
