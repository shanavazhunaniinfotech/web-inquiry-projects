/* Concept A — hero motion (GSAP, optional; page works without it) */
(function(){
  if(!window.gsap||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var g=window.gsap;
  g.from('.hero .eyebrow, .hero h1, .hero .lede, .hero-cta, .hero-trust',{y:30,opacity:0,duration:.9,stagger:.09,ease:'power3.out'});
  g.from('.hero-photo',{clipPath:'inset(100% 0 0 0)',duration:1.3,ease:'power4.inOut'});
  g.from('.float',{y:40,opacity:0,scale:.9,duration:.9,stagger:.15,delay:.6,ease:'back.out(1.6)'});
  g.to('.f1',{y:-12,duration:3,repeat:-1,yoyo:true,ease:'sine.inOut'});
  g.to('.f2',{y:14,duration:3.6,repeat:-1,yoyo:true,ease:'sine.inOut'});
  g.to('.f3',{y:-10,duration:3.2,repeat:-1,yoyo:true,ease:'sine.inOut',delay:.4});
  var art=document.querySelector('.hero-art');
  if(art&&matchMedia('(hover:hover)').matches){art.addEventListener('mousemove',function(e){var r=art.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;g.to('.hero-photo',{x:x*10,y:y*10,duration:.8});g.to('.float',{x:x*-22,duration:.8});});}
})();
