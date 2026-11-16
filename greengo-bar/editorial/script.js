/* GreenGo – Concept 2: Editorial. GSAP + ScrollTrigger + SplitText + Three.js */
(function () {
  'use strict';
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var touch = matchMedia('(hover: none), (pointer: coarse)').matches;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = function () { return innerWidth <= 760; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var euro = function (n) { return '€' + n.toFixed(2); };
  var EXPO = 'expo.out', INOUT = 'power4.inOut';

  /* ---------- store data: names and bar prices from greengo.bar; retail pack prices are proposed ---------- */
  var PIMG = '../assets/img/products/', GIMG = '../assets/img/partner/', ECS = 'https://www.espressocoffeeshop.com/en/';
  var MATCHA = [
    { id: 'm1', name: 'Ceremonial Matcha', tag: 'Gold award', d: 'Single origin. 40 g pouch.', price: 24, img: 'p-matcha' },
    { id: 'm2', name: 'Hojicha', d: 'Roasted green tea. 50 g pouch.', price: 14, img: 'p-hojicha' },
    { id: 'm3', name: 'Golden Milk Mix', d: 'For your milk of choice. 150 g jar.', price: 12, img: 'p-golden' },
    { id: 'm4', name: 'Chai Latte Mix', d: 'Black tea with spices. 200 g tub.', price: 13, img: 'p-chai' }
  ];
  var BEANS = [
    { id: 'b1', tab: 'Espresso', name: 'Specialty Coffee Beans', lab: 'SPECIALTY COFFEE', meta: 'N°1 — Whole beans, 250 g', notes: 'Antioxidant-rich, to uplift your mood and sharpen your focus', rows: [['Double Espresso', '€3.50', 0.5], ['Flat White', '€5.00', 0.72], ['Cappuccino', '€5.00', 0.72]], price: 12.5, c: '#f95844', img: 'p-beans' },
    { id: 'b2', tab: 'Decaf', name: 'Decaf Coffee Beans', lab: 'DECAF', meta: 'N°2 — Whole beans, 250 g', notes: 'Every coffee on our menu, without the caffeine', rows: [['Decaf, any coffee', '+ €0.50', 0.08], ['Latte', '€5.00', 0.72], ['Americano', '€3.50', 0.5]], price: 13, c: '#c0679c', img: 'p-decaf' },
    { id: 'b3', tab: 'Cold brew', name: 'Cold Brew Coffee', lab: 'COLD BREW', meta: 'N°3 — For slow steeping, 250 g', notes: 'Chilled cold brew, vibrant and refreshing', rows: [['Cold Brew', '€6.00', 0.86], ['Ocean Latte', '€6.50', 0.93], ['Freddo Espresso', '€4.50', 0.64]], price: 12.5, c: '#33def8', img: 'p-coldbrew' },
    { id: 'b4', tab: 'Caffeine-free', name: 'Barley Chicory', lab: 'CAFFEINE-FREE', meta: 'N°4 — Our caffeine-free option, 250 g', notes: 'Roasted barley and chicory, zero caffeine', rows: [['Caffeine', 'None', 0.02], ['Milk of choice', 'Same price', 1], ['Flavoured', '+ €1.00', 0.15]], price: 9, c: '#e5c70c', img: 'p-barley' }
  ];
  var OBJECTS = [
    { id: 'x3', name: 'GreenGo To-Go Cup', meta: '350 ml, with lid', price: 16, c: '#60cda2', img: 'p-cup', alt: 'To-go cup with the GreenGo logo' },
    { id: 'x1', name: 'GreenGo Tote Bag', meta: 'Cotton canvas', price: 18, c: '#f6f0e4', img: 'p-tote', alt: 'Canvas tote bag with the GreenGo logo' },
    { id: 'x2', name: 'GreenGo T-Shirt', meta: 'Unisex, S to XXL', price: 28, c: '#b6f25f', img: 'p-tee', alt: 'White t-shirt with the GreenGo logo' },
    { id: 'x4', name: 'GreenGo Cap', meta: 'One size, adjustable', price: 22, c: '#f95844', img: 'p-cap', alt: 'White cap with the GreenGo logo' },
    { id: 'x5', name: 'GreenGo Enamel Mug', meta: '350 ml', price: 14, c: '#c0679c', img: 'p-mug', alt: 'Enamel mug with the GreenGo logo' }
  ];
  var MACHINES = [
    { name: 'Rocket Appartamento TCA', kind: 'Espresso machine', price: '€1,237.71', img: 'rocket-appartamento', url: 'espresso-machines/941-1233-rocket-appartamento-tca-espresso-machine.html' },
    { name: 'Rancilio Silvia V6', kind: 'Espresso machine', price: '€516.39', img: 'rancilio-silvia', url: 'espresso-machines/68-696-0-rancilio-silvia-coffee-machine.html' },
    { name: 'Eureka Mignon Specialità', kind: 'Coffee grinder', price: '€336.07', img: 'eureka-mignon', url: 'coffee-grinders/55-658-0-eureka-mignon-specialita--coffee-grinder.html' },
    { name: 'Fellow Stagg EKG Pro', kind: 'Electric kettle', price: '€163.93', img: 'fellow-stagg', url: 'accessories/1018-1245-fellow-stagg-ekg-pro-electric-kettle.html' },
    { name: 'Acaia Pearl 2021', kind: 'Coffee scale', price: '€158.20', img: 'acaia-pearl', url: 'accessories/456-1013-0-acaia-pearl-2021-scale.html' },
    { name: 'Rancilio Bottomless Portafilter', kind: 'Accessory', price: '€35.25', img: 'rancilio-portafilter', url: 'accessories/298-0-rancilio-bottomless-portafilter.html' }
  ];
  var INDEX = {};
  MATCHA.concat(BEANS, OBJECTS).forEach(function (p) { INDEX[p.id] = p; });

  function render() {
    $('[data-list="matcha"]').innerHTML = MATCHA.map(function (p, i) {
      return '<article class="prow"><figure class="prow__n"><img src="' + PIMG + p.img + '.webp" alt="GreenGo ' + p.name + '" loading="lazy" width="1100" height="1100"><figcaption>1.' + (i + 1) + '</figcaption></figure><h3 class="prow__t">' + p.name + (p.tag ? '<small>' + p.tag + '</small>' : '') + '</h3><p class="prow__d">' + p.d + '</p><span class="prow__p">' + euro(p.price) + '</span><button class="prow__add" type="button" data-add="' + p.id + '" data-cur="Add">Add to bag</button></article>';
    }).join('');
    $('.tabs').innerHTML = BEANS.map(function (b, i) { return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-bean="' + i + '">' + b.tab + '</button>'; }).join('');
    $('[data-list="objects"]').innerHTML = OBJECTS.map(function (o, i) {
      return '<article class="obj" style="--c:' + o.c + '"><div class="obj__plate"><img src="' + PIMG + o.img + '.webp" alt="' + o.alt + '" loading="lazy" width="1100" height="1100"><span class="obj__no">' + (i + 1) + '</span><span class="obj__tag">GreenGo object 3.' + (i + 1) + '</span></div><div class="obj__row"><div><h3>' + o.name + '</h3><p class="obj__meta">' + o.meta + '</p></div><span class="obj__p">' + euro(o.price) + '</span></div><button class="obj__add" type="button" data-add="' + o.id + '" data-cur="Add">Add to bag</button></article>';
    }).join('');
    $('[data-list="machines"]').innerHTML = MACHINES.map(function (m, i) {
      return '<a class="sheet" href="' + ECS + m.url + '" target="_blank" rel="noopener" data-cur="Open ↗" aria-label="' + m.name + ' at Espresso Coffee Shop, opens the partner website"><div class="sheet__top"><span>Fig. 4.' + (i + 1) + '</span><span>Partner</span></div><figure class="sheet__ph"><img src="' + GIMG + m.img + '.webp" alt="' + m.name + '" loading="lazy" width="900" height="900"></figure><h3>' + m.name + '</h3><p>' + m.kind + ' · ' + m.price + ' + VAT</p><div class="sheet__go"><span>View at Espresso Coffee Shop</span><i>↗</i></div></a>';
    }).join('');
  }

  /* ---------- bag ---------- */
  var bag = {}, bagEl = $('.bag'), sayT, beanIdx = 0;
  function say(m) { var s = $('.say'); s.textContent = m; s.classList.add('is-on'); clearTimeout(sayT); sayT = setTimeout(function () { s.classList.remove('is-on'); }, 2600); }
  function drawBag() {
    var ids = Object.keys(bag), total = 0, n = 0;
    $('.bag__list').innerHTML = ids.map(function (id) {
      var p = INDEX[id], q = bag[id]; total += p.price * q; n += q;
      return '<li><h3>' + p.name + '</h3><b>' + euro(p.price * q) + '</b><small>' + (p.d || p.meta || '') + '</small><span class="bag__q"><button type="button" data-q="-1" data-id="' + id + '" aria-label="Remove one">−</button>' + q + '<button type="button" data-q="1" data-id="' + id + '" aria-label="Add one">+</button></span></li>';
    }).join('');
    $('.bag__empty').style.display = ids.length ? 'none' : 'block';
    $('[data-bag-total]').textContent = euro(total);
    $$('[data-bag-count]').forEach(function (e) { e.textContent = n; });
  }
  function openBag(o) { bagEl.classList.toggle('is-open', o); bagEl.setAttribute('aria-hidden', o ? 'false' : 'true'); }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-add],[data-bag-open],[data-bag-close],[data-q],[data-checkout],[data-bean]');
    if (!t) return;
    if (t.hasAttribute('data-add')) {
      var id = t.getAttribute('data-add') || BEANS[beanIdx].id;
      bag[id] = (bag[id] || 0) + 1; drawBag();
      say(INDEX[id].name + ' added to your bag');
      gsap.fromTo('.top__bag', { yPercent: -60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: EXPO });
    } else if (t.hasAttribute('data-bag-open')) openBag(true);
    else if (t.hasAttribute('data-bag-close')) openBag(false);
    else if (t.hasAttribute('data-q')) { var k = t.getAttribute('data-id'); bag[k] += +t.getAttribute('data-q'); if (bag[k] <= 0) delete bag[k]; drawBag(); }
    else if (t.hasAttribute('data-checkout')) say(Object.keys(bag).length ? 'Demo: WooCommerce checkout opens here' : 'Your bag is still empty');
    else if (t.hasAttribute('data-bean')) setBean(+t.getAttribute('data-bean'));
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') openBag(false); });
  $('.letter').addEventListener('submit', function (e) { e.preventDefault(); say(/^\S+@\S+\.\S+$/.test($('#mail').value.trim()) ? 'Thank you. The letter is on its way (demo)' : 'Please enter a valid email'); });

  var gl = { setBean: function () {} };
  function setBean(i, quiet) {
    beanIdx = i; var b = BEANS[i], card = $('.roastcard');
    $$('.tabs button').forEach(function (bt, k) { bt.setAttribute('aria-selected', k === i); });
    var fill = function () {
      $('.roastcard__meta').textContent = b.meta; $('.roastcard__name').textContent = b.name; $('.roastcard__notes').textContent = b.notes; $('.roastcard .pill__p').textContent = euro(b.price);
      var ph = $('.roastcard__img img'); ph.src = PIMG + b.img + '.webp'; ph.alt = 'GreenGo ' + b.name;
      $$('.bars div').forEach(function (row, k) {
        $('dt', row).textContent = b.rows[k][0]; $('span', row).textContent = b.rows[k][1];
        gsap.to($('i', row), { scaleX: b.rows[k][2], duration: 1.2, ease: EXPO, delay: 0.08 * k });
      });
    };
    if (quiet) { fill(); return; }
    gsap.timeline().to(card.children, { y: -14, opacity: 0, duration: 0.25, stagger: 0.03, ease: 'power2.in' }).add(fill).fromTo(card.children, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: EXPO });
    gl.setBean(b);
  }

  /* ---------- 3D still life ---------- */
  var plume = 0, pointer = { x: 0, y: 0 }, intro = { v: 0 }, tops = [], dragV = 0, dragging = false;
  var ALL = { tin: 1, bag: 1, cup: 1 };
  var SCENES = {
    cover: { pos: [1.2, 2.3, 12.6], look: [-2.0, 2.6, 0], fov: 30, a: 1, show: ALL, m: { pos: [9.4, 3.9, 15.2], look: [0, 1.95, 0], fov: 36 } },
    mani: { pos: [0, 7, 12], look: [0, 2.4, 0], fov: 30, a: 0, show: ALL },
    index: { pos: [0, 7, 12], look: [0, 2.4, 0], fov: 30, a: 0, show: ALL },
    matcha: { pos: [-2.2, 2.5, 8.4], look: [-3.1, 1.95, 0], fov: 30, a: 1, show: { tin: 1, bag: 0, cup: 0 }, m: { pos: [-1.75, 3.1, 9.6], look: [-1.75, 0.35, 0], fov: 34 } },
    'matcha-list': { pos: [-2.6, 3.6, 8], look: [-2.95, 1.6, 0], fov: 30, a: 0, show: { tin: 1, bag: 0, cup: 0 } },
    beans: { pos: [1.0, 2.25, 6.2], look: [1.35, 1.95, -0.9], fov: 28, a: 1, show: { tin: 0, bag: 1, cup: 0 }, m: { pos: [0, 3.0, 9], look: [0, 0.75, -0.9], fov: 34 } },
    objects: { pos: [2.9, 1.9, 7.6], look: [3.4, 1.45, 0.2], fov: 28, a: 1, show: { tin: 0, bag: 0, cup: 1 }, m: { pos: [1.75, 2.3, 7.6], look: [1.75, 0.1, 0.2], fov: 34 } },
    gallery: { pos: [3.2, 3.2, 9], look: [3.4, 1.45, 0.2], fov: 28, a: 0, show: { tin: 0, bag: 0, cup: 1 } },
    machines: { pos: [0, 6, 12], look: [0, 1, 0], fov: 30, a: 0, show: ALL },
    notes: { pos: [0, 6, 12], look: [0, 1, 0], fov: 30, a: 0, show: ALL },
    place: { pos: [0, 4, 12], look: [0, 1, 0], fov: 30, a: 0, show: ALL },
    fin: { pos: [-0.4, 1.35, 10.2], look: [0, 0.55, 0], fov: 30, a: 1, show: ALL, m: { pos: [8.6, 1.7, 14], look: [0, -1.5, 0], fov: 36 } }
  };
  function measure() {
    tops = $$('[data-scene]').map(function (el) {
      var n = el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el;
      return { name: el.getAttribute('data-scene'), top: n.getBoundingClientRect().top + scrollY };
    });
  }
  function sceneAt(i) { var s = SCENES[tops[i].name]; return small() && s.m ? Object.assign({}, s, s.m) : s; }

  function init3D() {
    var T = window.THREE, canvas = $('#gl'), renderer;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
    catch (e) { canvas.style.display = 'none'; return; }
    var lite = small() || touch;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, lite ? 1.5 : 2));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    var scene = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, 0.1, 80);
    scene.environment = GG3D.makeEnv(renderer, { top: '#3b352c', bottom: '#0b0a09', panels: [{ w: 10, h: 6, pos: [-7, 9, 6], color: '#fff1da', i: 7 }, { w: 4, h: 9, pos: [11, 3, -3], color: '#bfe3ff', i: 3 }, { w: 9, h: 3, pos: [0, 1.5, 13], color: '#ffffff', i: 0.8 }] });
    var key = new T.SpotLight(0xfff0dc, 0.95, 40, 0.52, 0.75, 1);
    key.position.set(-5.5, 9.5, 6.5); key.target.position.set(0, 0.8, 0);
    key.castShadow = true; key.shadow.mapSize.set(lite ? 1024 : 2048, lite ? 1024 : 2048); key.shadow.bias = -0.0004; key.shadow.radius = 5; key.shadow.camera.near = 3; key.shadow.camera.far = 26;
    scene.add(key, key.target, new T.HemisphereLight(0xffffff, 0x1a1410, 0.12));
    var rim = new T.DirectionalLight(0x9fd0ff, 0.3); rim.position.set(6, 4, -7); scene.add(rim);
    var floor = new T.Mesh(new T.PlaneGeometry(70, 70), new T.ShadowMaterial({ opacity: 0.4 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    var std = function (o) { return new T.MeshStandardMaterial(Object.assign({ roughness: 0.5, metalness: 0, envMapIntensity: 0.55 }, o)); };
    var shadows = function (o) { o.traverse(function (m) { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };

    /* textures */
    var img = { white: null, black: null, color: null }, bean = BEANS[0];
    var tinTex = GG3D.canvasTex(1608, 480, function (x, w, h) {
      x.fillStyle = '#1b2d13'; x.fillRect(0, 0, w, h);
      x.fillStyle = '#b6f25f'; x.fillRect(0, 26, w, 3); x.fillRect(0, h - 29, w, 3);
      if (img.white) x.drawImage(img.white, w / 2 - 150, 74, 300, 126);
      x.textAlign = 'center'; x.fillStyle = '#b6f25f'; x.font = 'italic 300 84px Fraunces, serif'; x.fillText('Ceremonial Matcha', w / 2, 300);
      x.fillStyle = '#efe6d6'; x.font = '500 26px Oswald, sans-serif';
      x.fillText('S I N G L E   O R I G I N   ·   G O L D   A W A R D', w / 2, 372);
      x.font = 'italic 300 70px Fraunces, serif'; x.fillStyle = 'rgba(182,242,95,.5)';
      x.fillText('slowly.', w * 0.08, 270); x.fillText('slowly.', w * 0.92, 270);
    });
    var bagTex = GG3D.canvasTex(768, 1178, function (x, w, h) {
      x.fillStyle = '#171513'; x.fillRect(0, 0, w, h);
      x.fillStyle = bean.c; x.fillRect(0, 0, w, 150); x.fillRect(70, h * 0.56, w - 140, 4);
      if (img.color) x.drawImage(img.color, w / 2 - 230, h * 0.26, 460, 194);
      x.textAlign = 'center'; x.fillStyle = '#efe6d6';
      var words = bean.name.split(' '), l1 = words.slice(0, Math.ceil(words.length / 2)).join(' '), l2 = words.slice(Math.ceil(words.length / 2)).join(' ');
      x.font = 'italic 300 92px Fraunces, serif'; x.fillText(l1, w / 2, h * 0.66); x.fillText(l2, w / 2, h * 0.745);
      x.font = '500 30px Oswald, sans-serif'; x.fillStyle = bean.c;
      x.fillText(bean.lab.split('').join(' '), w / 2, h * 0.83);
      x.fillStyle = '#efe6d6'; x.fillText('2 5 0  G   ·   W H O L E   B E A N', w / 2, h * 0.9);
    });
    var cupTex = GG3D.canvasTex(1536, 640, function (x, w, h) {
      x.fillStyle = '#6fd6c8'; x.fillRect(0, 0, w, h);
      if (img.black) { x.drawImage(img.black, w / 2 - 280, h * 0.42 - 118, 560, 236); x.drawImage(img.black, -220, h * 0.5 - 93, 440, 186); x.drawImage(img.black, w - 220, h * 0.5 - 93, 440, 186); }
      x.fillStyle = '#101010'; x.font = '600 30px Poppins, sans-serif'; x.textAlign = 'center'; x.fillText('@greengodubrovnik', w / 2, h * 0.84);
    });
    var redraw = function () { tinTex.redraw(); bagTex.redraw(); cupTex.redraw(); };
    Promise.all([GG3D.loadImg('../assets/logo-white.svg'), GG3D.loadImg('../assets/logo-black.svg'), GG3D.loadImg('../assets/logo.svg')]).then(function (r) { img.white = r[0]; img.black = r[1]; img.color = r[2]; redraw(); });
    if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('italic 300 80px Fraunces'), document.fonts.load('500 26px Oswald'), document.fonts.load('600 30px Poppins')]).then(redraw);

    /* stations */
    function station(name, x, z, ph, colour, obj, oy) {
      var g = new T.Group(); g.position.set(x, 0, z);
      var pl = new T.Mesh(new T.CylinderGeometry(0.92, 0.92, ph, 72), std({ color: colour, roughness: 0.9, envMapIntensity: 0.18 }));
      pl.position.y = ph / 2; obj.position.y = ph + oy; g.add(pl, obj); shadows(g); scene.add(g);
      return { g: g, obj: obj, p: 1, baseY: ph + oy };
    }
    var tin = GG3D.tin({ label: std({ map: tinTex, roughness: 0.42, metalness: 0.25 }), metal: std({ color: 0xd8c7a0, roughness: 0.26, metalness: 1, envMapIntensity: 1.3 }), powder: std({ color: 0x7fb62c, roughness: 1 }) });
    tin.scale.setScalar(1.12);
    var bagM = GG3D.bag({ front: std({ map: bagTex, roughness: 0.62 }), side: std({ color: 0x171513, roughness: 0.62 }) });
    var cup = GG3D.paperCup({ body: std({ map: cupTex, roughness: 0.55 }), rim: std({ color: 0xffffff, roughness: 0.4 }), inside: std({ color: 0xf2ede4, side: T.DoubleSide }), coffee: std({ map: GG3D.latteTexture(), roughness: 0.2, envMapIntensity: 1.2 }) });
    cup.scale.setScalar(0.92);
    var st = {
      tin: station('tin', -1.75, 0, 0.36, 0x8fd62e, tin, 0.75 * 1.12),
      bag: station('bag', 0, -0.9, 0.82, 0xe8442e, bagM, 1.15),
      cup: station('cup', 1.75, 0.2, 0.18, 0xd9b400, cup, 1.175 * 0.92)
    };
    var lidY = tin.userData.lid.position.y;

    /* beans on the floor */
    var NB = lite ? 22 : 44, beans = new T.InstancedMesh(GG3D.beanGeometry(), std({ color: 0x3a1a0b, roughness: 0.36, envMapIntensity: 0.6 }), NB), bd = [], dummy = new T.Object3D();
    beans.castShadow = true; beans.receiveShadow = true;
    for (var i = 0; i < NB; i++) {
      var a = Math.random() * Math.PI * 1.25 - Math.PI * 0.12, r = 1.15 + Math.random() * 1.5;
      var bx = Math.cos(a) * r * 1.15; if (bx > 0.75) bx = -bx * 0.9; /* keep floating beans off the text column */
      bd.push({ x: bx, z: -0.9 + Math.sin(a) * r, ry: Math.random() * 6.3, s: 0.15 + Math.random() * 0.09, up: 0.4 + Math.random() * 2.3, ph: Math.random() * 6.3, sp: Math.random() - 0.5 });
    }
    scene.add(beans);
    var lev = 0;

    /* matcha powder plume */
    var NP = lite ? 260 : 620, pg = new T.BufferGeometry(), pp = new Float32Array(NP * 3), seeds = [];
    for (i = 0; i < NP; i++) seeds.push({ a: Math.random() * 6.3, r: Math.pow(Math.random(), 0.7), h: Math.random(), sp: 0.5 + Math.random(), ph: Math.random() * 6.3 });
    pg.setAttribute('position', new T.BufferAttribute(pp, 3));
    var dot = GG3D.canvasTex(64, 64, function (x) { var g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); });
    var pm = new T.PointsMaterial({ color: 0xb6f25f, size: 0.075, map: dot, transparent: true, opacity: 0, depthWrite: false, sizeAttenuation: true, toneMapped: false });
    var points = new T.Points(pg, pm); points.frustumCulled = false; scene.add(points);

    gl.setBean = function (b) {
      bean = b;
      gsap.to(spin, { v: spin.v + Math.PI * 2, duration: 1.4, ease: INOUT });
      gsap.delayedCall(0.55, function () { bagTex.redraw(); });
    };
    var spin = { v: 0 };

    function resize() { renderer.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); }
    resize(); addEventListener('resize', resize);

    var cur = { pos: new T.Vector3(0, 3, 16), look: new T.Vector3(0, 1.5, 0), fov: 30, a: 0 }, vA = new T.Vector3(), vB = new T.Vector3();
    var last = performance.now(), t = 0, bagRot = 0.35, cupRot = 0, alphaShown = -1, plumeS = 0;
    function frame() {
      if (document.hidden || !tops.length) return;
      var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      var H = innerHeight, p = scrollY + H * 0.5, idx = 0;
      for (var i = 0; i < tops.length; i++) if (tops[i].top - H * 0.45 <= p) idx = i;
      var k = clamp((p - (tops[idx].top - H * 0.45)) / (H * 0.7), 0, 1); k = k * k * k * (k * (k * 6 - 15) + 10);
      var A = sceneAt(Math.max(0, idx - 1)), B = sceneAt(idx), d = 1 - Math.pow(0.004, dt);
      vA.fromArray(A.pos).lerp(vB.fromArray(B.pos), k); cur.pos.lerp(vA, d);
      vA.fromArray(A.look).lerp(vB.fromArray(B.look), k); cur.look.lerp(vA, d);
      cur.fov += (A.fov + (B.fov - A.fov) * k - cur.fov) * d;
      var ka = B.a > A.a ? clamp((k - 0.5) / 0.5, 0, 1) : clamp(k / 0.45, 0, 1);
      cur.a += (A.a + (B.a - A.a) * ka - cur.a) * Math.min(1, d * 2);
      var al = Math.round(cur.a * intro.v * 100) / 100;
      if (al !== alphaShown) { canvas.style.opacity = al; alphaShown = al; }
      if (al < 0.01) return;
      ['tin', 'bag', 'cup'].forEach(function (n) {
        var s = st[n], want = A.show[n] + (B.show[n] - A.show[n]) * k;
        s.p += (want - s.p) * d; var e = clamp(s.p, 0.0001, 1);
        s.g.scale.setScalar(e); s.g.visible = s.p > 0.01; s.g.position.y = (e - 1) * 1.2;
      });
      cam.fov = cur.fov; cam.updateProjectionMatrix();
      var sway = reduce ? 0 : 1;
      cam.position.set(cur.pos.x + pointer.x * 0.35 + Math.sin(t * 0.22) * 0.18 * sway, cur.pos.y + pointer.y * 0.2 + Math.cos(t * 0.17) * 0.08 * sway, cur.pos.z + (1 - intro.v) * 7);
      cam.lookAt(cur.look);
      /* tin: lid lifts, powder rises */
      var inMatcha = tops[idx].name === 'matcha' || tops[idx].name === 'matcha-list';
      plumeS += ((inMatcha ? plume : 0) - plumeS) * Math.min(1, d * 2.5);
      var u = plumeS, e2 = u * u * (3 - 2 * u), lid = tin.userData.lid;
      tin.rotation.y = -0.3 + e2 * 0.55 + Math.sin(t * 0.4) * 0.05;
      lid.position.set(-0.55 * e2, lidY + e2 * 1.15, 0.25 * e2); lid.rotation.set(0.25 * e2, 0, 0.55 * e2);
      var topY = st.tin.g.position.y + st.tin.baseY + 0.75 * 1.12;
      for (i = 0; i < NP; i++) {
        var q = seeds[i], ang = q.a + u * q.sp * 5 + t * 0.15 * q.sp, rr = q.r * (0.12 + u * 1.25) * (0.5 + q.h), hh = q.h * u * 2.3 + Math.sin(t * 1.3 + q.ph) * 0.04;
        pp[i * 3] = -1.75 + Math.cos(ang) * rr; pp[i * 3 + 1] = topY - 0.05 + hh; pp[i * 3 + 2] = Math.sin(ang) * rr;
      }
      pg.attributes.position.needsUpdate = true;
      pm.opacity = clamp(u * 3.2, 0, 1) * 0.95 * st.tin.p;
      /* bag: drag or drift */
      if (!dragging) { dragV *= 0.94; bagRot += dragV + dt * 0.12 * sway; }
      bagM.rotation.y = bagRot + spin.v;
      /* beans */
      var wantLev = tops[idx].name === 'beans' ? 1 : 0; lev += (wantLev - lev) * 0.03;
      for (i = 0; i < NB; i++) {
        var b = bd[i], ly = lev * b.up, show = Math.max(st.bag.p, 0.0001);
        dummy.position.set(b.x, 0.07 + ly + Math.sin(t * 1.1 + b.ph) * 0.06 * lev, b.z);
        dummy.rotation.set(lev * (t * b.sp + b.ph), b.ry + lev * t * 0.3 * b.sp, lev * b.ph);
        dummy.scale.setScalar(b.s * show); dummy.updateMatrix(); beans.setMatrixAt(i, dummy.matrix);
      }
      beans.instanceMatrix.needsUpdate = true;
      /* cup */
      cupRot += dt * 0.25 * sway; cup.rotation.y = -0.5 + Math.sin(cupRot) * 0.5 + scrollY * 0.0006;
      renderer.render(scene, cam);
    }
    gsap.ticker.add(frame);

    /* drag the bag */
    var dz = $('.dragzone'), lx = 0;
    dz.addEventListener('pointerdown', function (e) { dragging = true; lx = e.clientX; });
    addEventListener('pointermove', function (e) { if (!dragging) return; var dx = e.clientX - lx; lx = e.clientX; dragV = dx * 0.012; bagRot += dragV; });
    addEventListener('pointerup', function () { dragging = false; });
    addEventListener('pointercancel', function () { dragging = false; });
  }

  /* ---------- page animation ---------- */
  function lines(el, opts) {
    if (!window.SplitText) return [el];
    try { return SplitText.create(el, Object.assign({ type: 'lines', mask: 'lines' }, opts || {})).lines; } catch (e) { return [el]; }
  }
  function animate() {
    var lenis = null;
    if (!touch && !reduce && window.Lenis) {
      lenis = new Lenis({ lerp: 0.085 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]'); if (!a) return;
      var el = $(a.getAttribute('href')); if (!el) return;
      e.preventDefault(); openBag(false);
      var y = el.getBoundingClientRect().top + scrollY + (el.id === 'top' ? -200 : 40);
      if (lenis) lenis.scrollTo(y, { duration: 1.8 }); else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });

    /* cover */
    gsap.to('.cover__title .ln:first-child', { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '.cover', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.cover__title .ln--b', { xPercent: 10, ease: 'none', scrollTrigger: { trigger: '.cover', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.cover__foot, .cover__meta', { opacity: 0, y: -30, ease: 'none', scrollTrigger: { trigger: '.cover', start: '25% top', end: '70% top', scrub: true } });

    /* manifesto: words light up as you read */
    var mt = $('.mani__text');
    (function wrap(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var f = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) { if (!w.trim()) { f.appendChild(document.createTextNode(w)); return; } var s = document.createElement('span'); s.className = 'w'; s.textContent = w; f.appendChild(s); });
          node.replaceChild(f, n);
        } else if (n.nodeType === 1) wrap(n);
      });
    })(mt);
    gsap.to($$('.w', mt), { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: mt, start: 'top 82%', end: 'bottom 48%', scrub: 0.4 } });
    $$('.fig').forEach(function (f) {
      gsap.to($('.fig__clip', f), { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: INOUT, scrollTrigger: { trigger: f, start: 'top 82%' } });
      gsap.fromTo($('img', f), { yPercent: 0, scale: 1.25 }, { yPercent: +f.getAttribute('data-par'), scale: 1, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.to(f, { y: +f.getAttribute('data-par') * 4, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.from(lines('.mani__sub'), { yPercent: 110, duration: 1.3, ease: EXPO, stagger: 0.1, scrollTrigger: { trigger: '.mani__sub', start: 'top 85%' } });

    /* index */
    $$('.row__t').forEach(function (el) { el.innerHTML = '<span>' + el.textContent + '</span>'; });
    gsap.from('.row__t > span', { yPercent: 105, duration: 1.4, ease: EXPO, stagger: 0.09, scrollTrigger: { trigger: '.index__list', start: 'top 80%' } });
    gsap.from('.row__n, .row__d, .row__a', { opacity: 0, y: 14, duration: 0.9, ease: 'power3.out', stagger: 0.03, delay: 0.3, scrollTrigger: { trigger: '.index__list', start: 'top 80%' } });
    if (!touch) {
      var peek = $('.peek'), pimg = $('img', peek), px = gsap.quickTo(peek, 'x', { duration: 0.6, ease: 'power3' }), py = gsap.quickTo(peek, 'y', { duration: 0.6, ease: 'power3' });
      $$('.row').forEach(function (r) {
        r.addEventListener('mouseenter', function () { pimg.src = r.getAttribute('data-img'); peek.style.background = getComputedStyle(r).getPropertyValue('--c'); gsap.to(peek, { scale: 1, rotation: gsap.utils.random(-6, 6), duration: 0.7, ease: EXPO }); });
        r.addEventListener('mouseleave', function () { gsap.to(peek, { scale: 0, duration: 0.4, ease: 'power3.in' }); });
        r.addEventListener('mousemove', function (e) { px(e.clientX); py(e.clientY); });
      });
    }

    /* chapter titles */
    $$('.ch__title').forEach(function (h) { gsap.from(lines(h), { yPercent: 112, duration: 1.5, ease: EXPO, stagger: 0.12, scrollTrigger: { trigger: h, start: 'top 86%' } }); });
    $$('.ch .lab, .notes > .lab, .index__head .lab').forEach(function (l) { gsap.from(l, { opacity: 0, x: -20, duration: 1, ease: EXPO, scrollTrigger: { trigger: l, start: 'top 92%' } }); });

    /* 01 matcha: pinned, the lid lifts as you scroll */
    var frames = $$('.frame'), sc = $$('.scale li');
    ScrollTrigger.create({
      trigger: '.ch--matcha .ch__pin', start: 'top top', end: '+=220%', pin: true, scrub: true,
      onUpdate: function (s) {
        plume = clamp((s.progress - 0.06) / 0.86, 0, 1);
        var n = Math.min(2, Math.floor(s.progress * 3));
        frames.forEach(function (f, i) { f.classList.toggle('is-on', i === n); });
        sc.forEach(function (f, i) { f.classList.toggle('is-on', i === n); });
      }
    });
    gsap.fromTo('.arch img', { yPercent: 12, rotation: -6 }, { yPercent: -8, rotation: 5, ease: 'none', scrollTrigger: { trigger: '.arch', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 4px 4px)', duration: 1.6, ease: INOUT, scrollTrigger: { trigger: '.arch', start: 'top 85%' } });
    $$('.prow').forEach(function (r, i) { gsap.from(r, { opacity: 0, y: 40, duration: 1.1, ease: EXPO, delay: i * 0.06, scrollTrigger: { trigger: r, start: 'top 94%' } }); });

    /* 02 beans */
    setBean(0, true);
    gsap.from('.tabs button', { opacity: 0, y: 20, duration: 0.9, ease: EXPO, stagger: 0.06, scrollTrigger: { trigger: '.tabs', start: 'top 90%' } });
    gsap.from('.roastcard > *', { opacity: 0, y: 26, duration: 1, ease: EXPO, stagger: 0.07, scrollTrigger: { trigger: '.roastcard', start: 'top 88%' } });
    var tape = $('.tape__in');
    gsap.fromTo(tape, { xPercent: -4 }, { xPercent: -46, ease: 'none', scrollTrigger: { trigger: '.tape', start: 'top bottom', end: 'bottom top', scrub: 0.6, onUpdate: function (s) { gsap.to(tape, { skewX: clamp(s.getVelocity() / -160, -14, 14), duration: 0.4, overwrite: 'auto', ease: 'power3.out', onComplete: function () { gsap.to(tape, { skewX: 0, duration: 1, ease: EXPO }); } }); } } });

    /* 03 objects: horizontal gallery */
    gsap.from(lines('.ch__p'), { yPercent: 110, duration: 1.2, ease: EXPO, stagger: 0.08, scrollTrigger: { trigger: '.ch__p', start: 'top 90%' } });
    var mm = gsap.matchMedia();
    mm.add('(min-width: 761px)', function () {
      var track = $('.gallery__track'), dist = function () { return Math.max(0, track.scrollWidth - innerWidth); };
      var tw = gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'top 6%', end: function () { return '+=' + dist() * 1.15; }, pin: true, scrub: 0.8, invalidateOnRefresh: true,
        onUpdate: function (s) { $('.gallery__bar i').style.transform = 'scaleX(' + s.progress + ')'; gsap.to('.obj__plate', { skewX: clamp(s.getVelocity() / -400, -7, 7), duration: 0.4, overwrite: true, ease: 'power3.out', onComplete: function () { gsap.to('.obj__plate', { skewX: 0, duration: 1.1, ease: EXPO }); } }); } } });
      $$('.obj__plate').forEach(function (pl) { gsap.fromTo($('img', pl), { xPercent: 7 }, { xPercent: -7, ease: 'none', scrollTrigger: { trigger: pl, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } }); });
    });
    gsap.from('.obj', { opacity: 0, y: 80, duration: 1.2, ease: EXPO, stagger: 0.08, scrollTrigger: { trigger: '.gallery', start: 'top 88%' } });

    /* 04 machines: line drawings draw themselves */
    gsap.from('.notice', { opacity: 0, y: 30, duration: 1.1, ease: EXPO, scrollTrigger: { trigger: '.notice', start: 'top 90%' } });
    $$('.sheet').forEach(function (s, i) {
      var d = (i % 3) * 0.12;
      gsap.from(s, { opacity: 0, duration: 1, delay: d, scrollTrigger: { trigger: s, start: 'top 90%' } });
      gsap.fromTo($('.sheet__ph', s), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: INOUT, delay: d, scrollTrigger: { trigger: s, start: 'top 88%' } });
      gsap.from($('.sheet__ph img', s), { scale: 1.35, duration: 1.9, ease: EXPO, delay: d, scrollTrigger: { trigger: s, start: 'top 88%' } });
    });

    /* footnotes */
    $$('[data-count]').forEach(function (el) {
      var end = +el.getAttribute('data-count'), pre = el.getAttribute('data-pre') || '', suf = el.getAttribute('data-suf') || '', o = { v: end ? 0 : 9 };
      gsap.to(o, { v: end, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' }, onUpdate: function () { el.textContent = pre + Math.round(o.v) + suf; } });
    });
    gsap.from('.notes__grid li', { opacity: 0, y: 60, duration: 1.2, ease: EXPO, stagger: 0.1, scrollTrigger: { trigger: '.notes__grid', start: 'top 85%' } });

    /* place: the frame opens to full bleed */
    gsap.timeline({ scrollTrigger: { trigger: '.place__pin', start: 'top top', end: '+=120%', pin: true, scrub: 0.5 } })
      .to('.place__frame', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 1 }, 0)
      .to('.place__frame img', { scale: 1, ease: 'none', duration: 1 }, 0)
      .from('.place__txt > *', { opacity: 0, y: 50, stagger: 0.12, duration: 0.5, ease: 'power2.out' }, 0.3);

    /* closing */
    gsap.from('.fin__title .ln > span', { yPercent: 112, duration: 1.6, ease: EXPO, stagger: 0.14, scrollTrigger: { trigger: '.fin', start: 'top 60%' } });
    gsap.from('.fin__row .pill', { opacity: 0, y: 30, duration: 1, ease: EXPO, stagger: 0.07, scrollTrigger: { trigger: '.fin__row', start: 'top 96%' } });

    /* footer */
    gsap.from(lines('.end__say'), { yPercent: 110, duration: 1.4, ease: EXPO, stagger: 0.1, scrollTrigger: { trigger: '.end', start: 'top 85%' } });
    gsap.from('.end__grid > *', { opacity: 0, y: 40, duration: 1.1, ease: EXPO, stagger: 0.08, scrollTrigger: { trigger: '.end__grid', start: 'top 92%' } });
    gsap.fromTo('.end__mark img', { yPercent: 60 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.end__mark', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } });

    /* cursor + magnetic */
    if (!touch) {
      var cur = $('.cur'), lab = $('span', cur), cx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
      addEventListener('mousemove', function (e) {
        cx(e.clientX); cy(e.clientY);
        pointer.x = (e.clientX / innerWidth - 0.5) * 2; pointer.y = (e.clientY / innerHeight - 0.5) * -2;
        var t = e.target.closest('[data-cur]');
        if (t) { lab.textContent = t.getAttribute('data-cur'); cur.classList.add('is-on'); } else cur.classList.remove('is-on');
      });
      $$('.orb, .pill, .top__bag').forEach(function (el) {
        el.addEventListener('mousemove', function (e) { var r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.36, duration: 0.5, ease: 'power3.out' }); });
        el.addEventListener('mouseleave', function () { gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1,0.4)' }); });
      });
    }

    /* header hides while reading, returns on the way up */
    var topEl = $('.top'), hidden = false;
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (s) { var hide = s.direction > 0 && s.scroll() > innerHeight * 0.6; if (hide !== hidden) { hidden = hide; gsap.to(topEl, { yPercent: hide ? -130 : 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' }); } } });

    ScrollTrigger.addEventListener('refresh', measure);
    ScrollTrigger.sort(); ScrollTrigger.refresh();
    addEventListener('load', function () { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
    measure();
  }

  /* ---------- boot ---------- */
  render(); drawBag();
  if (window.THREE && window.GG3D) init3D();

  var num = $$('.pre__num span'), o = { v: 0 };
  var show = function () { var n = Math.min(99, Math.round(o.v)); num[0].textContent = Math.floor(n / 10); num[1].textContent = n % 10; $('.pre__line i').style.transform = 'scaleX(' + o.v / 100 + ')'; };
  var creep = gsap.to(o, { v: 86, duration: 2.4, ease: 'power2.out', onUpdate: show });
  var words = gsap.to('.pre__words', { yPercent: -75, duration: 2.4, ease: 'steps(3)' });
  gsap.set('.cover__title .ln > span', { yPercent: 112 });
  gsap.set('.cover__meta, .cover__foot, .top', { opacity: 0 });
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  var loaded = new Promise(function (r) { if (document.readyState === 'complete') r(); else addEventListener('load', r); });
  Promise.race([Promise.all([fonts, loaded, wait(1100)]), wait(6000)]).then(function () {
    animate();
    creep.kill(); words.kill();
    gsap.to(o, { v: 100, duration: 0.6, ease: 'power2.inOut', onUpdate: show, onComplete: function () {
      gsap.timeline()
        .to('.pre__num span', { yPercent: -110, duration: 0.8, ease: 'power4.in', stagger: 0.06 })
        .to('.pre__meta, .pre__words, .pre__line', { opacity: 0, duration: 0.4 }, '<')
        .to('.pre__half--a', { yPercent: -101, duration: 1.3, ease: INOUT }, '-=0.15')
        .to('.pre__half--b', { yPercent: 101, duration: 1.3, ease: INOUT }, '<')
        .set('.pre', { display: 'none' })
        .to(intro, { v: 1, duration: 2.6, ease: 'expo.out' }, '-=1.2')
        .to('.cover__title .ln > span', { yPercent: 0, duration: 1.7, ease: EXPO, stagger: 0.16 }, '-=2.4')
        .to('.top, .cover__meta, .cover__foot', { opacity: 1, duration: 1.2, stagger: 0.12, ease: 'power2.out' }, '-=1.4');
    } });
  });
})();
