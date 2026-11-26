/* TITAN SPORT — "Forged Iron" redesign concept
   Three.js (r128) + GSAP ScrollTrigger + Lenis. All product models are built in code. */
(() => {
  'use strict';

  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const fmtKg = n => String(Math.round(n * 100) / 100).replace('.', ',');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  gsap.registerPlugin(ScrollTrigger, Flip);

  /* =========================================================
     DATA
     ========================================================= */
  const VIEW = {
    dumbbell: {
      cat: 'Gantellar', name: 'Olti qirrali gantel', price: 1450000, cartId: 'db20',
      desc: "Rezina bilan qoplangan cho'yan kallaklar va nakatkali xrom dasta. Uy va zal uchun eng ko'p sotiladigan model.",
      specs: [["Og'irlik", '2 × 20 kg'], ['Kallak', "Cho'yan + rezina"], ['Dasta', 'Xrom, Ø 32 mm'], ['Kafolat', '2 yil']],
      hot: [
        { p: [0.13, 0.078, 0.0], t: 'Rezina qoplama', d: 'Polni himoya qiladi, shovqinsiz tushadi.' },
        { p: [0.0, 0.02, 0.0], t: 'Nakatkali dasta', d: "Ho'l qo'lda ham sirpanmaydi." },
        { p: [-0.13, -0.02, 0.07], t: 'Olti qirra', d: 'Polda dumalamaydi — xavfsiz saqlash.' }
      ]
    },
    kettlebell: {
      cat: 'Giryalar', name: 'Klassik girya', price: 420000, cartId: 'kb16',
      desc: "Bir butun cho'yandan quyilgan klassik girya. Payvand chokisiz, keng dastali va tekis taglikli.",
      specs: [["Og'irlik", '16 kg'], ['Material', "Monolit cho'yan"], ['Dasta', 'Keng, silliq'], ['Kafolat', '2 yil']],
      hot: [
        { p: [0, 0.39, 0], t: 'Keng dasta', d: "Ikki qo'l bilan swing va goblet uchun." },
        { p: [0, 0.14, 0.12], t: 'Monolit quyma', d: "Payvand chokisiz — bo'linmaydi." },
        { p: [0.09, 0.02, 0.04], t: 'Tekis taglik', d: 'Barqaror turadi, ag\'darilmaydi.' }
      ]
    },
    plate: {
      cat: 'Blinlar', name: 'Bumper rezina blin', price: 890000, cartId: 'bp20',
      desc: "Zich rezinali bumper blin — tashlanganda pol va grifni asraydi. Po'lat vtulka 50 mm olimpiya griflariga mos.",
      specs: [["Og'irlik", '20 kg'], ['Diametr', '450 mm'], ['Vtulka', "Po'lat, 50 mm"], ['Kafolat', '2 yil']],
      hot: [
        { p: [0, 0, 0.03], t: "Po'lat vtulka", d: '50 mm olimpiya grifiga zich kiradi.' },
        { p: [0.06, 0.205, 0.03], t: 'Rang kodi', d: "IWF standarti: 20 kg — ko'k." },
        { p: [0.0, -0.225, 0], t: 'Zich rezina', d: 'Deadlift va crossfit uchun tashlashga chidamli.' }
      ]
    },
    bar: {
      cat: 'Shtangalar', name: 'Olimpiya grifi', price: 2300000, cartId: 'bar20',
      desc: "220 sm standart olimpiya grifi. Xromlangan vtulkalar podshipnikda aylanadi, o'rta nakatka powerlifting uchun.",
      specs: [["Og'irlik", '20 kg'], ['Uzunlik', '220 sm'], ['Dasta', 'Ø 28 mm, nakatka'], ['Vtulka', 'Ø 50 mm, xrom']],
      hot: [
        { p: [0.9, 0.03, 0], t: 'Xrom vtulka', d: 'Podshipnikda aylanadi — tirsakni asraydi.' },
        { p: [0.3, 0.016, 0], t: 'Nakatka', d: 'Mustahkam ushlash, qo\'lni tirnamaydi.' },
        { p: [-0.67, 0.045, 0], t: 'Stopor halqa', d: 'Blinlar ichkariga siljimaydi.' }
      ]
    }
  };

  const CATALOG = [
    { id: 'db20', type: 'dumbbell', model: 'dumbbellPair', cat: 'Gantellar', name: "Olti qirrali gantel to'plami 2 × 20 kg", price: 1450000, rating: 4.9, pop: 1, badge: 'Xit' },
    { id: 'bar20', type: 'bar', model: 'bar', cat: 'Shtangalar', name: 'Olimpiya standart grifi 20 kg (220 sm)', price: 2300000, rating: 4.9, pop: 2 },
    { id: 'bp20', type: 'plate', model: 'plate', cat: 'Blinlar', name: 'Bumper rezina blin 20 kg', price: 890000, rating: 4.8, pop: 3 },
    { id: 'kb16', type: 'kettlebell', model: 'kettlebell', cat: 'Giryalar', name: "Klassik cho'yan girya 16 kg", price: 420000, rating: 4.8, pop: 4 },
    { id: 'bench', type: 'bench', model: 'bench', cat: 'Skameykalar', name: 'Trenajyor skameyka (sozlanadigan)', price: 2650000, rating: 4.7, pop: 5, badge: 'Yangi' },
    { id: 'bpset', type: 'plate', model: 'plateSet', cat: 'Blinlar', name: "Bumper blinlar to'plami 100 kg", price: 4200000, rating: 5.0, pop: 6 }
  ];
  const CAT_BY_ID = Object.fromEntries(CATALOG.map(p => [p.id, p]));
  const THUMBS = {};

  const BARS = {
    olympic: { kg: 20, shaftR: 0.014, sleeveR: 0.025, sleeveIn: 0.685, sleeveOut: 1.1, collarR: 0.04, name: 'Olimpiya grifi', price: 2300000 },
    women: { kg: 15, shaftR: 0.0125, sleeveR: 0.025, sleeveIn: 0.685, sleeveOut: 1.005, collarR: 0.038, name: 'Ayollar grifi', price: 1950000 }
  };
  const PLATES = {
    25: { r: 0.225, t: 0.062, c: '#d9342b' },
    20: { r: 0.225, t: 0.052, c: '#2f6fd6' },
    15: { r: 0.225, t: 0.042, c: '#e7b416' },
    10: { r: 0.225, t: 0.034, c: '#2fa25a' },
    5: { r: 0.118, t: 0.03, iron: true },
    2.5: { r: 0.098, t: 0.022, iron: true },
    1.25: { r: 0.082, t: 0.018, iron: true }
  };
  const PRICE_PER_KG = 18000;

  /* =========================================================
     3D KIT
     ========================================================= */
  const HAS_GL = (() => {
    try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); }
    catch (e) { return false; }
  })();
  if (!HAS_GL) document.documentElement.classList.add('no-webgl');

  const isSmall = () => window.innerWidth < 760;
  const DPR = () => Math.min(window.devicePixelRatio || 1, isSmall() ? 1.5 : 1.75);

  function makeRenderer(canvas, alpha = true) {
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha, powerPreference: 'high-performance', preserveDrawingBuffer: false });
    r.setPixelRatio(DPR());
    r.outputEncoding = THREE.sRGBEncoding;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    r.setClearColor(0x000000, 0);
    return r;
  }

  // Studio environment rendered into a PMREM so metals get real reflections.
  function makeEnv(renderer, warm = 1) {
    const s = new THREE.Scene();
    const room = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x08080a, side: THREE.BackSide }));
    s.add(room);
    const panel = (w, h, col, pos, rot) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }));
      m.position.set(...pos); if (rot) m.rotation.set(...rot); m.lookAt(0, 0, 0); s.add(m);
    };
    panel(10, 4, new THREE.Color(2.4, 2.4, 2.5), [0, 9, 2]);           // softbox top
    panel(1.2, 12, new THREE.Color(1.6, 1.6, 1.7), [-9, 1, 3]);         // strip left
    panel(1.2, 12, new THREE.Color(1.2, 1.25, 1.35), [9, 1, 4]);        // strip right
    panel(5, 5, new THREE.Color(1.1 * warm, 0.38 * warm, 0.12 * warm), [6, 2, -8]); // molten orange back
    panel(8, 2, new THREE.Color(0.5, 0.5, 0.55), [0, -6, 6]);           // floor bounce
    const pm = new THREE.PMREMGenerator(renderer);
    const tex = pm.fromScene(s, 0.04).texture;
    pm.dispose();
    return tex;
  }

  // --- Canvas textures ---
  function knurlCanvas() {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = '#9a9a9a'; g.fillRect(0, 0, 64, 64);
    g.strokeStyle = '#2a2a2a'; g.lineWidth = 2.5;
    for (let i = -64; i < 128; i += 8) {
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 64, 64); g.stroke();
      g.beginPath(); g.moveTo(i + 64, 0); g.lineTo(i, 64); g.stroke();
    }
    return c;
  }
  const KNURL_CANVAS = knurlCanvas();
  function knurlTex(rx, ry) {
    const t = new THREE.CanvasTexture(KNURL_CANVAS);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry);
    return t;
  }

  function arcText(g, text, cx, cy, r, center, bottom, size, color, spacing = 1.08) {
    g.save(); g.font = `${size}px Anton, Impact, sans-serif`; g.fillStyle = color;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const ws = [...text].map(ch => g.measureText(ch).width * spacing);
    const total = ws.reduce((a, b) => a + b, 0) / r;
    let a = bottom ? center + total / 2 : center - total / 2;
    [...text].forEach((ch, i) => {
      const da = ws[i] / r;
      const mid = bottom ? a - da / 2 : a + da / 2;
      g.save();
      g.translate(cx + Math.cos(mid) * r, cy + Math.sin(mid) * r);
      g.rotate(bottom ? mid - Math.PI / 2 : mid + Math.PI / 2);
      g.fillText(ch, 0, 0);
      g.restore();
      a = bottom ? a - da : a + da;
    });
    g.restore();
  }

  const faceCanvasCache = {};
  function plateFaceCanvas(kg) {
    if (faceCanvasCache[kg]) return faceCanvasCache[kg];
    const p = PLATES[kg];
    const s = 512, c = document.createElement('canvas'); c.width = c.height = s;
    const g = c.getContext('2d');
    g.fillStyle = p.iron ? '#26272a' : '#0d0d0e'; g.fillRect(0, 0, s, s);
    for (let r = 70; r < 256; r += 5) {
      g.strokeStyle = `rgba(255,255,255,${0.012 + ((r * 7) % 11) / 400})`; g.lineWidth = 1.2;
      g.beginPath(); g.arc(256, 256, r, 0, Math.PI * 2); g.stroke();
    }
    if (p.c) { g.strokeStyle = p.c; g.lineWidth = 16; g.beginPath(); g.arc(256, 256, 236, 0, Math.PI * 2); g.stroke(); }
    g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 4; g.beginPath(); g.arc(256, 256, p.iron ? 150 : 132, 0, Math.PI * 2); g.stroke();
    const label = `${fmtKg(kg)} KG`;
    if (p.iron) {
      arcText(g, label, 256, 256, 200, Math.PI / 2, true, 62, '#e6e2da');
      arcText(g, 'TITAN', 256, 256, 200, -Math.PI / 2, false, 54, '#ff5a1f');
    } else {
      arcText(g, 'TITAN SPORT', 256, 256, 186, -Math.PI / 2, false, 50, '#ece8e0');
      arcText(g, label, 256, 256, 186, Math.PI / 2, true, 58, p.c);
    }
    faceCanvasCache[kg] = c;
    return c;
  }

  function kbDecalCanvas() {
    const c = document.createElement('canvas'); c.width = 256; c.height = 192;
    const g = c.getContext('2d');
    g.clearRect(0, 0, 256, 192);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '96px Anton, Impact, sans-serif'; g.fillStyle = '#ff5a1f'; g.fillText('16', 128, 88);
    g.font = '28px Anton, Impact, sans-serif'; g.fillStyle = '#e8e4dc'; g.fillText('KG · TITAN', 128, 158);
    return c;
  }

  function shadowCanvas() {
    const c = document.createElement('canvas'); c.width = 256; c.height = 64;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(128, 32, 4, 128, 32, 128);
    gr.addColorStop(0, 'rgba(0,0,0,.75)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.setTransform(1, 0, 0, 0.25, 0, 24); g.fillStyle = gr; g.fillRect(0, -100, 256, 300);
    return c;
  }

  function emberCanvas() {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,220,180,1)'); gr.addColorStop(.25, 'rgba(255,120,40,.8)'); gr.addColorStop(1, 'rgba(255,80,20,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return c;
  }

  function canvasTex(c) {
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
    return t;
  }

  // --- Material set (one per renderer) ---
  function makeMats() {
    const M = {
      chrome: new THREE.MeshStandardMaterial({ color: 0xeceef2, metalness: 1, roughness: 0.16 }),
      chromeDark: new THREE.MeshStandardMaterial({ color: 0x9fa3aa, metalness: 1, roughness: 0.3 }),
      knurl: new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 1, roughness: 0.38, bumpMap: knurlTex(10, 160), bumpScale: 0.6, roughnessMap: knurlTex(10, 160) }),
      knurlShort: new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 1, roughness: 0.38, bumpMap: knurlTex(10, 18), bumpScale: 0.6, roughnessMap: knurlTex(10, 18) }),
      rubber: new THREE.MeshStandardMaterial({ color: 0x0b0b0c, metalness: 0, roughness: 0.62, envMapIntensity: 0.45 }),
      iron: new THREE.MeshStandardMaterial({ color: 0x2b2c30, metalness: 0.6, roughness: 0.42 }),
      castIron: new THREE.MeshStandardMaterial({ color: 0x151618, metalness: 0.6, roughness: 0.42, envMapIntensity: 0.8 }),
      powder: new THREE.MeshStandardMaterial({ color: 0x1d1e22, metalness: 0.45, roughness: 0.42 }),
      leather: new THREE.MeshStandardMaterial({ color: 0x121213, metalness: 0.05, roughness: 0.55 }),
      accent: new THREE.MeshStandardMaterial({ color: 0xff5a1f, metalness: 0.2, roughness: 0.4, emissive: 0x3a0e00 }),
      faces: {}
    };
    M.face = kg => {
      if (!M.faces[kg]) {
        const iron = PLATES[kg].iron;
        M.faces[kg] = new THREE.MeshStandardMaterial({ map: canvasTex(plateFaceCanvas(kg)), metalness: iron ? 0.55 : 0.05, roughness: iron ? 0.45 : 0.6, envMapIntensity: iron ? 0.9 : 0.5 });
      }
      return M.faces[kg];
    };
    return M;
  }

  // --- Geometry builders (long axis along X) ---
  function cylX(r, len, mat, seg = 32) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg, 1), mat);
    m.rotation.z = Math.PI / 2;
    return m;
  }

  function makeBar(M, spec = BARS.olympic) {
    const g = new THREE.Group();
    const shaftLen = (spec.sleeveIn - 0.03) * 2;
    g.add(cylX(spec.shaftR, shaftLen, M.knurl, 28));
    const band = cylX(spec.shaftR + 0.0006, 0.16, M.chrome, 28); g.add(band); // smooth centre
    [-1, 1].forEach(s => {
      const col = cylX(spec.collarR, 0.03, M.chrome, 40); col.position.x = s * (spec.sleeveIn - 0.015); g.add(col);
      const len = spec.sleeveOut - spec.sleeveIn;
      const sl = cylX(spec.sleeveR, len, M.chrome, 40); sl.position.x = s * (spec.sleeveIn + len / 2); g.add(sl);
      const cap = cylX(spec.sleeveR * 1.08, 0.01, M.chromeDark, 40); cap.position.x = s * (spec.sleeveOut + 0.005); g.add(cap);
      [0.12, 0.2].forEach(o => { const ring = cylX(spec.shaftR + 0.0012, 0.004, M.chromeDark, 24); ring.position.x = s * o; g.add(ring); });
    });
    return g;
  }

  function makePlate(M, kg) {
    const p = PLATES[kg];
    const g = new THREE.Group();
    const side = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r, p.t, 72, 1, true), p.iron ? M.iron : M.rubber);
    side.rotation.z = Math.PI / 2; g.add(side);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(p.r - 0.004, 0.004, 8, 72), p.iron ? M.iron : M.rubber);
    [-1, 1].forEach(s => {
      const f = new THREE.Mesh(new THREE.CircleGeometry(p.r, 72), M.face(kg));
      f.rotation.y = s * Math.PI / 2; f.position.x = s * p.t / 2; g.add(f);
      const l = lip.clone(); l.rotation.y = Math.PI / 2; l.position.x = s * (p.t / 2 - 0.002); g.add(l);
    });
    const hub = cylX(p.iron ? 0.045 : 0.07, p.t + 0.006, M.chrome, 40); g.add(hub);
    const hole = cylX(0.0255, p.t + 0.008, M.chromeDark, 24); g.add(hole);
    g.userData.t = p.t; g.userData.kg = kg;
    return g;
  }

  function makeDumbbell(M) {
    const g = new THREE.Group();
    g.add(cylX(0.017, 0.15, M.knurlShort, 28));
    [-1, 1].forEach(s => {
      const geo = new THREE.CylinderGeometry(0.08, 0.08, 0.115, 6, 1); geo.rotateY(Math.PI / 6);
      const head = new THREE.Mesh(geo, M.rubber); head.rotation.z = Math.PI / 2; head.position.x = s * 0.1325; g.add(head);
      const cap = cylX(0.052, 0.006, M.chrome, 40); cap.position.x = s * 0.193; g.add(cap);
      const logo = cylX(0.028, 0.008, M.accent, 32); logo.position.x = s * 0.196; g.add(logo);
      const col = cylX(0.03, 0.012, M.chrome, 32); col.position.x = s * 0.069; g.add(col);
    });
    return g;
  }

  function makeKettlebell(M) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.125, 56, 40), M.castIron);
    body.scale.set(1, 0.94, 1); body.position.y = 0.122; g.add(body);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.01, 48), M.castIron); base.position.y = 0.006; g.add(base);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.017, 20, 64, Math.PI), M.castIron);
    handle.position.y = 0.3; g.add(handle);
    [-1, 1].forEach(s => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.022, 0.09, 20), M.castIron);
      leg.position.set(s * 0.085, 0.255, 0); g.add(leg);
    });
    const dmat = new THREE.MeshStandardMaterial({ map: canvasTex(kbDecalCanvas()), transparent: true, metalness: 0.2, roughness: 0.5, depthWrite: false });
    const decal = new THREE.Mesh(new THREE.SphereGeometry(0.1262, 32, 16, Math.PI / 2 - 0.5, 1.0, Math.PI / 2 - 0.32, 0.64), dmat);
    decal.scale.copy(body.scale); decal.position.copy(body.position); g.add(decal);
    return g;
  }

  function makeBench(M) {
    const g = new THREE.Group();
    const box = (w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); g.add(m); return m; };
    box(0.72, 0.075, 0.29, M.leather, 0.22, 0.45, 0);
    const back = box(0.5, 0.075, 0.29, M.leather, -0.33, 0.47, 0); back.rotation.z = -0.12;
    box(0.722, 0.012, 0.292, M.accent, 0.22, 0.408, 0);
    box(1.05, 0.05, 0.08, M.powder, 0, 0.375, 0);
    [-0.45, 0.48].forEach(x => {
      box(0.06, 0.34, 0.06, M.powder, x, 0.2, 0);
      box(0.08, 0.04, 0.48, M.powder, x, 0.02, 0);
      [-1, 1].forEach(s => box(0.085, 0.03, 0.04, M.rubber, x, 0.01, s * 0.23));
    });
    const brace = box(0.06, 0.32, 0.05, M.powder, -0.2, 0.24, 0); brace.rotation.z = 0.6;
    [-1, 1].forEach(s => { const pin = cylX(0.012, 0.06, M.chrome, 16); pin.rotation.set(Math.PI / 2, 0, 0); pin.position.set(-0.2, 0.25, s * 0.04); g.add(pin); });
    return g;
  }

  function makeModel(M, key) {
    switch (key) {
      case 'dumbbell': return makeDumbbell(M);
      case 'dumbbellPair': {
        const g = new THREE.Group();
        const a = makeDumbbell(M); a.position.set(0, 0.08, -0.1); g.add(a);
        const b = makeDumbbell(M); b.position.set(0.04, 0.08, 0.12); b.rotation.y = -0.25; g.add(b);
        return g;
      }
      case 'kettlebell': return makeKettlebell(M);
      case 'plate': { const p = makePlate(M, 20); p.rotation.y = Math.PI / 2; const g = new THREE.Group(); g.add(p); return g; }
      case 'plateSet': {
        const g = new THREE.Group(); let y = 0;
        [25, 20, 15, 10].forEach((kg, i) => {
          const p = makePlate(M, kg); const t = PLATES[kg].t;
          p.rotation.z = Math.PI / 2; p.rotation.x = i * 0.35; p.position.y = y + t / 2; y += t + 0.002; g.add(p);
        });
        return g;
      }
      case 'bar': return makeBar(M, BARS.olympic);
      case 'bench': return makeBench(M);
      default: return new THREE.Group();
    }
  }

  // Normalise a model into a container of bounding radius `target`, centred at origin.
  function fitModel(model, target = 1) {
    const box = new THREE.Box3().setFromObject(model);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const holder = new THREE.Group();
    model.position.sub(sphere.center);
    holder.add(model);
    holder.scale.setScalar(target / sphere.radius);
    return holder;
  }

  function addLights(scene, rim = 1) {
    scene.add(new THREE.HemisphereLight(0xbfc4cc, 0x0a0806, 0.18));
    const key = new THREE.DirectionalLight(0xffffff, 0.9); key.position.set(-3, 4, 4); scene.add(key);
    const warm = new THREE.DirectionalLight(0xff6a2a, 1.3 * rim); warm.position.set(3, 2, -6); scene.add(warm);
    const cool = new THREE.DirectionalLight(0x7f9cff, 0.5); cool.position.set(-4, -1, -3); scene.add(cool);
    return { key, warm, cool };
  }

  const renderers = []; // {active, render()}
  if (!RM) gsap.ticker.add((time, dt) => renderers.forEach(r => r.active && r.render(time, dt)));
  else gsap.ticker.add((time, dt) => renderers.forEach(r => r.active && r.render(time, dt)));

  /* =========================================================
     HERO + STORY STAGE
     ========================================================= */
  const S = { a: 0.6, R: 3.9, y: 0.7, lx: 0, sx: 0.36, explode: 0, spin: 0, roll: 0, rim: 1, intro: 1 };
  let stage = null;

  function initStage() {
    const canvas = $('#stage');
    const renderer = makeRenderer(canvas, true);
    const scene = new THREE.Scene();
    scene.environment = makeEnv(renderer);
    const M = makeMats();
    const lights = addLights(scene, 1);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 100);

    const rig = new THREE.Group(); scene.add(rig);
    const barbell = new THREE.Group(); rig.add(barbell);
    barbell.add(makeBar(M, BARS.olympic));
    const plates = [];
    [-1, 1].forEach(s => {
      let x = BARS.olympic.sleeveIn + 0.004;
      [25, 20, 10].forEach((kg, i) => {
        const p = makePlate(M, kg); const t = PLATES[kg].t;
        const bx = s * (x + t / 2); x += t + 0.003;
        p.position.x = bx; barbell.add(p);
        plates.push({ mesh: p, s, i, bx });
      });
    });

    // Embers
    const N = isSmall() ? 140 : 280;
    const pos = new Float32Array(N * 3), spd = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8; pos[i * 3 + 1] = (Math.random() - 0.5) * 5; pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 0.5;
      spd[i] = 0.08 + Math.random() * 0.25;
    }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const embers = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.035, map: new THREE.CanvasTexture(emberCanvas()), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.85 }));
    scene.add(embers);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    if (FINE) window.addEventListener('pointermove', e => { mouse.tx = e.clientX / innerWidth - 0.5; mouse.ty = e.clientY / innerHeight - 0.5; }, { passive: true });

    function resize() {
      const w = innerWidth, h = innerHeight;
      renderer.setPixelRatio(DPR());
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    let axial = 0;
    const r = {
      active: true,
      render(time, dt) {
        const d = Math.min(dt, 50) / 1000;
        mouse.x = lerp(mouse.x, mouse.tx, 0.05); mouse.y = lerp(mouse.y, mouse.ty, 0.05);
        const small = isSmall();
        const aspect = camera.aspect;
        const fit = aspect < 1.25 ? clamp(1.3 / aspect, 1, 2.6) : 1;

        axial += d * (0.35 + S.spin * 5.5) * (RM ? 0 : 1);
        barbell.rotation.x = axial;
        rig.rotation.z = S.roll + (small ? 0.42 * (1 - S.spin) : 0);

        const ex = S.explode + S.intro * 2.2;
        plates.forEach(p => {
          p.mesh.position.x = p.bx + p.s * (p.i + 1) * 0.2 * ex;
          p.mesh.rotation.y = p.s * ex * 0.25 * (p.i + 1);
          p.mesh.scale.setScalar(1 - S.intro * 0.4);
        });
        rig.scale.setScalar(1 - S.intro * 0.35);
        rig.rotation.y = S.intro * -1.2;

        const R = S.R * fit;
        const a = S.a + mouse.x * 0.16;
        camera.position.set(S.lx + Math.sin(a) * R, S.y + mouse.y * -0.25 + (small ? 0.15 : 0), Math.cos(a) * R);
        camera.lookAt(S.lx, 0, 0);
        camera.translateX(small ? 0 : -S.sx * R * 0.32);
        if (small) camera.translateY(-R * 0.1);

        lights.warm.intensity = 1.3 * S.rim;
        const arr = pg.attributes.position.array;
        for (let i = 0; i < N; i++) {
          arr[i * 3 + 1] += spd[i] * d * (1 + S.spin * 3);
          arr[i * 3] += Math.sin(time * 0.6 + i) * 0.0015;
          if (arr[i * 3 + 1] > 2.6) arr[i * 3 + 1] = -2.6;
        }
        pg.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
      }
    };
    renderers.push(r);
    return { r, canvas };
  }

  /* =========================================================
     360 VIEWER
     ========================================================= */
  function initViewer() {
    const wrap = $('#viewerStage'), canvas = $('#viewerCanvas'), hotLayer = $('#hotspots');
    const renderer = makeRenderer(canvas, true);
    const scene = new THREE.Scene();
    scene.environment = makeEnv(renderer);
    const M = makeMats();
    addLights(scene, 0.8);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 50);
    camera.position.set(0, 0.6, 4.5); camera.lookAt(0, 0, 0);

    const pivot = new THREE.Group(); scene.add(pivot);
    const tilt = new THREE.Group(); pivot.add(tilt);
    const models = {};
    let current = null, key = 'dumbbell';
    let rotY = -0.6, rotX = 0.15, vel = 0, dragging = false, lastX = 0, lastY = 0, idle = 0, interacted = false;

    const VIEW_POSE = { dumbbell: [0, 0, 0], kettlebell: [0, 0, 0], plate: [0, 0, 0], bar: [0, 0, 0.32] };

    function build(k) {
      if (models[k]) return models[k];
      const inner = makeModel(M, k);
      // hotspot anchors in model space
      inner.userData.anchors = VIEW[k].hot.map(h => { const o = new THREE.Object3D(); o.position.set(...h.p); inner.add(o); return o; });
      const holder = fitModel(inner, 1.05);
      holder.rotation.set(...VIEW_POSE[k]);
      models[k] = holder;
      return holder;
    }

    function hotspotsFor(k) {
      hotLayer.innerHTML = '';
      VIEW[k].hot.forEach((h, i) => {
        const b = document.createElement('button');
        b.className = 'hotspot'; b.type = 'button';
        b.setAttribute('aria-label', h.t);
        b.innerHTML = `<span class="hotspot__tip"><b>${h.t}</b>${h.d}</span>`;
        b.addEventListener('click', e => { e.stopPropagation(); const open = b.classList.contains('is-open'); $$('.hotspot', hotLayer).forEach(x => x.classList.remove('is-open')); if (!open) b.classList.add('is-open'); });
        hotLayer.appendChild(b);
      });
      gsap.fromTo($$('.hotspot', hotLayer), { scale: 0 }, { scale: 1, duration: 0.6, stagger: 0.08, delay: 0.4, ease: 'back.out(2)' });
    }

    function info(k) {
      const v = VIEW[k];
      $('#viewerCat').textContent = v.cat;
      $('#viewerName').textContent = v.name;
      $('#viewerDesc').textContent = v.desc;
      $('#viewerSpecs').innerHTML = v.specs.map(([a, b]) => `<li><span>${a}</span><b>${b}</b></li>`).join('');
      $('#viewerPrice').textContent = fmt(v.price);
      gsap.fromTo($$('#viewerInfo > *'), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
    }

    function show(k, first) {
      key = k;
      const next = build(k);
      const swap = () => {
        if (current) tilt.remove(current);
        current = next; tilt.add(current);
        hotspotsFor(k);
        gsap.fromTo(current.scale, { x: 0.001, y: 0.001, z: 0.001 }, { x: current.scale.x || 1, y: current.scale.y, z: current.scale.z, duration: 0.9, ease: 'expo.out', overwrite: true });
        vel += 0.25;
      };
      if (!current || first) {
        current = next; tilt.add(current); hotspotsFor(k);
      } else {
        const sc = current.scale.x;
        gsap.to(current.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.35, ease: 'power3.in', onComplete: () => { current.scale.setScalar(sc); const target = next.scale.x; next.scale.setScalar(0.001); if (current) tilt.remove(current); current = next; tilt.add(current); hotspotsFor(k); gsap.to(current.scale, { x: target, y: target, z: target, duration: 0.9, ease: 'expo.out' }); vel += 0.2; } });
      }
      info(k);
    }

    $$('.viewer__tabs button').forEach(b => b.addEventListener('click', () => {
      if (b.classList.contains('is-active')) return;
      $$('.viewer__tabs button').forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b); });
      show(b.dataset.product);
    }));
    $('#viewerAdd').addEventListener('click', e => { const c = CAT_BY_ID[VIEW[key].cartId]; Cart.add(c.id, e.currentTarget); });

    canvas.addEventListener('pointerdown', e => {
      dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId);
      if (!interacted) { interacted = true; gsap.to('#viewerHint', { autoAlpha: 0, duration: 0.4 }); }
    });
    canvas.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      vel = dx * 0.008; rotY += vel;
      rotX = clamp(rotX + dy * 0.004, -0.5, 0.7);
      idle = 0;
    });
    const end = () => { dragging = false; };
    canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
    wrap.addEventListener('click', () => $$('.hotspot', hotLayer).forEach(x => x.classList.remove('is-open')));

    function resize() {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setPixelRatio(DPR());
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(wrap); resize();

    const v3 = new THREE.Vector3();
    const degEl = $('#viewerDeg');
    const r = {
      active: false,
      render(time, dt) {
        const d = Math.min(dt, 50) / 1000;
        if (!dragging) {
          vel *= 0.94;
          idle += d;
          rotY += vel + (idle > 1.5 && !RM ? d * 0.35 : 0);
          rotX = lerp(rotX, 0.15, 0.02);
        }
        pivot.rotation.y = rotY;
        tilt.rotation.x = rotX;
        if (current) current.position.y = Math.sin(time * 1.4) * 0.02;
        renderer.render(scene, camera);
        // hotspots
        if (current) {
          const anchors = current.children[0].userData.anchors || [];
          const spots = hotLayer.children;
          const w = wrap.clientWidth, h = wrap.clientHeight;
          anchors.forEach((a, i) => {
            const el = spots[i]; if (!el) return;
            a.getWorldPosition(v3);
            const behind = v3.z < -0.05;
            v3.project(camera);
            const x = (v3.x * 0.5 + 0.5) * w, y = (-v3.y * 0.5 + 0.5) * h;
            el.style.transform = `translate(${x}px, ${y}px)`;
            el.classList.toggle('is-back', behind);
            el.classList.toggle('flip', x > w * 0.6);
          });
        }
        let deg = Math.round(((rotY * 180 / Math.PI) % 360 + 360) % 360);
        degEl.textContent = deg;
      }
    };
    renderers.push(r);
    new IntersectionObserver(([e]) => { r.active = e.isIntersecting; }, { rootMargin: '100px' }).observe(wrap);
    show('dumbbell', true);
    return { M };
  }

  /* =========================================================
     BARBELL BUILDER
     ========================================================= */
  const Builder = { kg: 20 };
  function initBuilder() {
    const wrap = $('.builder__stage'), canvas = $('#builderCanvas');
    let barType = 'olympic';
    const sides = []; // kg list inner→outer (mirrored on both sides)
    const meshes = []; // [{L, R, kg}]
    let scene, camera, renderer, M, holder, barHolder;

    if (HAS_GL) {
      renderer = makeRenderer(canvas, true);
      scene = new THREE.Scene();
      scene.environment = makeEnv(renderer);
      M = makeMats();
      addLights(scene, 0.9);
      camera = new THREE.PerspectiveCamera(30, 1, 0.05, 50);
      holder = new THREE.Group(); scene.add(holder);
      holder.position.y = 0.225;
      barHolder = new THREE.Group(); holder.add(barHolder);
      barHolder.add(makeBar(M, BARS[barType]));
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.7), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas()), transparent: true, depthWrite: false }));
      sh.rotation.x = -Math.PI / 2; sh.position.y = 0.001; scene.add(sh);
      const floor = new THREE.GridHelper(8, 32, 0x3a2a20, 0x1c1c1f); floor.material.transparent = true; floor.material.opacity = 0.35; scene.add(floor);
    }

    let orbit = 0, ox = 0;
    function resize() {
      if (!renderer) return;
      const w = wrap.clientWidth, h = wrap.clientHeight; if (!w || !h) return;
      renderer.setPixelRatio(DPR()); renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    if (renderer) { new ResizeObserver(resize).observe(wrap); resize(); }
    if (FINE) wrap.addEventListener('pointermove', e => { const b = wrap.getBoundingClientRect(); ox = (e.clientX - b.left) / b.width - 0.5; });
    wrap.addEventListener('pointerleave', () => { ox = 0; });

    const r = {
      active: false,
      render(time) {
        const halfW = 1.3;
        const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const dist = Math.max(halfW / (t * camera.aspect), 0.5 / t) * 1.12;
        orbit = lerp(orbit, ox * 0.5, 0.05);
        const a = 0.18 + orbit + (RM ? 0 : Math.sin(time * 0.3) * 0.05);
        camera.position.set(Math.sin(a) * dist, dist * 0.3 + 0.25, Math.cos(a) * dist);
        camera.lookAt(0, 0.12, 0);
        renderer.render(scene, camera);
      }
    };
    if (renderer) {
      renderers.push(r);
      new IntersectionObserver(([e]) => { r.active = e.isIntersecting; }, { rootMargin: '100px' }).observe(wrap);
    }

    const spec = () => BARS[barType];
    const capacity = () => spec().sleeveOut - spec().sleeveIn - 0.01;
    const used = () => sides.reduce((a, kg) => a + PLATES[kg].t + 0.003, 0);
    const xFor = idx => { let x = spec().sleeveIn + 0.004; for (let i = 0; i < idx; i++) x += PLATES[sides[i]].t + 0.003; return x + PLATES[sides[idx]].t / 2; };

    const kgEl = $('#builderKg'), priceEl = $('#builderPrice'), listEl = $('#builderList'), warnEl = $('#builderWarn');
    const shown = { kg: 20, price: 0 };
    function total() { return spec().kg + sides.reduce((a, k) => a + k * 2, 0); }
    function price() { return spec().price + sides.reduce((a, k) => a + k * 2 * PRICE_PER_KG, 0); }
    function update() {
      const kg = total(), p = price();
      Builder.kg = kg; Builder.price = p;
      gsap.to(shown, { kg, price: p, duration: 0.7, ease: 'power3.out', onUpdate: () => { kgEl.textContent = fmtKg(Math.round(shown.kg * 4) / 4); priceEl.textContent = fmt(shown.price); } });
      const counts = {}; sides.forEach(k => counts[k] = (counts[k] || 0) + 2);
      listEl.innerHTML = `<li>${spec().name} · ${spec().kg} kg</li>` + Object.keys(counts).sort((a, b) => b - a).map(k => `<li>${counts[k]} × ${fmtKg(+k)} kg</li>`).join('');
    }
    let warnT;
    function warn(msg) {
      warnEl.textContent = msg; warnEl.classList.add('is-on');
      clearTimeout(warnT); warnT = setTimeout(() => warnEl.classList.remove('is-on'), 2200);
      if (holder) gsap.fromTo(holder.position, { x: -0.02 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, .3)' });
    }

    function addPlate(kg) {
      if (used() + PLATES[kg].t + 0.003 > capacity()) { warn("Grif to'ldi — kichikroq blin tanlang"); return; }
      sides.push(kg);
      if (holder) {
        const idx = sides.length - 1, x = xFor(idx);
        const pair = { kg, L: makePlate(M, kg), R: makePlate(M, kg) };
        [[pair.L, -1], [pair.R, 1]].forEach(([m, s]) => {
          holder.add(m);
          m.position.set(s * (spec().sleeveOut + 0.6), 0.35, 0);
          m.rotation.set(s * -1.2, s * 0.6, 0);
          gsap.to(m.position, { x: s * x, y: 0, duration: RM ? 0 : 0.8, ease: 'expo.out' });
          gsap.to(m.rotation, { x: 0, y: 0, duration: RM ? 0 : 0.9, ease: 'expo.out' });
        });
        meshes.push(pair);
        gsap.fromTo(holder.position, { y: 0.215 }, { y: 0.225, duration: 0.6, ease: 'bounce.out', delay: 0.25 });
      }
      update();
    }
    function popPlate() {
      if (!sides.length) return;
      sides.pop();
      const pair = meshes.pop();
      if (pair) [[pair.L, -1], [pair.R, 1]].forEach(([m, s]) => {
        gsap.to(m.position, { x: s * (spec().sleeveOut + 0.7), y: 0.3, duration: 0.5, ease: 'power3.in', onComplete: () => holder.remove(m) });
      });
      update();
    }
    function relayout() {
      meshes.forEach((pair, i) => { const x = xFor(i); gsap.to(pair.L.position, { x: -x, duration: 0.5 }); gsap.to(pair.R.position, { x, duration: 0.5 }); });
    }
    function setBar(type) {
      barType = type;
      if (barHolder) { barHolder.clear(); barHolder.add(makeBar(M, spec())); }
      let trimmed = false;
      while (used() > capacity()) { popPlate(); trimmed = true; }
      if (trimmed) warn("Qisqa grif — ba'zi blinlar olib tashlandi");
      relayout(); update();
    }

    $$('#plateBtns button').forEach(b => b.addEventListener('click', () => addPlate(+b.dataset.kg)));
    $('#builderUndo').addEventListener('click', popPlate);
    $('#builderReset').addEventListener('click', () => { while (sides.length) popPlate(); });
    $$('input[name="bar"]').forEach(i => i.addEventListener('change', () => setBar(i.value)));
    $('#builderBuy').addEventListener('click', e => {
      if (!sides.length) { warn('Avval blin qo\'shing'); return; }
      Cart.addCustom({ id: 'set-' + barType + '-' + sides.join('_'), name: `Shtanga to'plami ${fmtKg(total())} kg (${spec().name.toLowerCase()})`, price: price(), img: THUMBS.bar || null }, e.currentTarget);
    });

    // Default starting load for a nicer first impression
    [20, 10].forEach(k => sides.push(k));
    if (holder) sides.forEach((kg, i) => {
      const pair = { kg, L: makePlate(M, kg), R: makePlate(M, kg) };
      pair.L.position.x = -xFor(i); pair.R.position.x = xFor(i);
      holder.add(pair.L, pair.R); meshes.push(pair);
    });
    update();
  }

  /* =========================================================
     CATALOG THUMBNAILS (rendered from the same 3D models)
     ========================================================= */
  function renderThumbs() {
    if (!HAS_GL) return;
    const c = document.createElement('canvas');
    const W = 720, H = 612;
    const renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false);
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene(); scene.environment = makeEnv(renderer);
    addLights(scene, 1);
    const M = makeMats();
    const camera = new THREE.PerspectiveCamera(30, W / H, 0.05, 50);
    const poses = {
      dumbbellPair: { az: 0.7, el: 0.5, rot: [0, 0, 0] },
      bar: { az: 0.35, el: 0.35, rot: [0, 0, 0.45] },
      plate: { az: -0.55, el: 0.15, rot: [0, 0, 0] },
      kettlebell: { az: 0.3, el: 0.25, rot: [0, 0, 0] },
      bench: { az: 0.75, el: 0.35, rot: [0, 0, 0] },
      plateSet: { az: 0.4, el: 0.7, rot: [0, 0, 0] }
    };
    CATALOG.forEach(p => {
      const pose = poses[p.model];
      const m = makeModel(M, p.model); m.rotation.set(...pose.rot);
      const holder = fitModel(m, 1);
      scene.add(holder);
      const d = 1 / Math.sin(THREE.MathUtils.degToRad(15)) * 0.92;
      camera.position.set(Math.sin(pose.az) * Math.cos(pose.el) * d, Math.sin(pose.el) * d, Math.cos(pose.az) * Math.cos(pose.el) * d);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      THUMBS[p.id] = c.toDataURL('image/webp', 0.86);
      scene.remove(holder);
      if (p.model === 'bar') THUMBS.bar = THUMBS[p.id];
    });
    renderer.dispose();
    try { renderer.forceContextLoss(); } catch (e) {}
  }

  /* =========================================================
     CART
     ========================================================= */
  const Cart = (() => {
    let items = [];
    try { items = JSON.parse(localStorage.getItem('titan-cart') || '[]'); } catch (e) { items = []; }
    const drawer = $('#drawer');
    const save = () => { try { localStorage.setItem('titan-cart', JSON.stringify(items)); } catch (e) {} };
    const count = () => items.reduce((a, i) => a + i.qty, 0);
    const sum = () => items.reduce((a, i) => a + i.qty * i.price, 0);

    function render() {
      const n = count();
      const cEl = $('#cartCount'); cEl.textContent = n; cEl.classList.toggle('is-on', n > 0);
      const ul = $('#cartItems');
      if (!items.length) {
        ul.innerHTML = '<li class="drawer__empty">Savatingiz hozircha bo\'sh.<br>Katalogdan inventar tanlang.</li>';
        drawer.classList.remove('is-checkout');
      } else {
        ul.innerHTML = items.map(i => {
          const img = i.img || THUMBS[i.id];
          return `<li data-id="${i.id}">${img ? `<img src="${img}" alt="">` : '<span class="ph">T</span>'}<div><h4>${i.name}</h4><span class="p">${fmt(i.price)} so'm</span></div><div class="qty"><button data-q="-1" aria-label="Kamaytirish">−</button><span>${i.qty}</span><button data-q="1" aria-label="Ko'paytirish">+</button></div></li>`;
        }).join('');
      }
      const total = sum();
      $('#cartTotal').textContent = fmt(total);
      const left = 1000000 - total;
      $('#shipText').innerHTML = total <= 0 ? '1 000 000 so\'mdan yuqori xaridlarda yetkazish <b>bepul</b>' : left > 0 ? `Bepul yetkazishgacha yana <b>${fmt(left)} so'm</b>` : '🎉 Sizga yetkazish <b>bepul!</b>';
      $('#shipBar').style.width = Math.min(100, total / 10000) + '%';
      $('#checkoutBtn span').textContent = drawer.classList.contains('is-checkout') ? 'Buyurtmani tasdiqlash' : 'Buyurtmani rasmiylashtirish';
      save();
    }
    function fly(fromEl) {
      const btn = $('#cartOpen');
      btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
      if (!fromEl || RM) return;
      const a = fromEl.getBoundingClientRect(), b = btn.getBoundingClientRect();
      const dot = document.createElement('span');
      dot.style.cssText = `position:fixed;z-index:130;left:${a.left + a.width / 2 - 8}px;top:${a.top + a.height / 2 - 8}px;width:16px;height:16px;border-radius:50%;background:#ff5a1f;box-shadow:0 0 20px #ff5a1f;pointer-events:none`;
      document.body.appendChild(dot);
      const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
      gsap.timeline({ onComplete: () => dot.remove() })
        .to(dot, { x: dx, duration: 0.75, ease: 'power2.in' }, 0)
        .to(dot, { y: dy, duration: 0.75, ease: 'back.in(1.6)' }, 0)
        .to(dot, { scale: 0.3, duration: 0.75 }, 0);
    }
    function add(id, fromEl) {
      const p = CAT_BY_ID[id]; if (!p) return;
      const ex = items.find(i => i.id === id);
      if (ex) ex.qty++; else items.push({ id, name: p.name, price: p.price, qty: 1 });
      fly(fromEl); render(); toast(`Savatga qo'shildi: ${p.name}`);
    }
    function addCustom(item, fromEl) {
      const ex = items.find(i => i.id === item.id);
      if (ex) ex.qty++; else items.push({ ...item, qty: 1 });
      fly(fromEl); render(); toast(`Savatga qo'shildi: ${item.name}`);
    }
    function open() { drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); lenis && lenis.stop(); setTimeout(() => $('.icon-btn', drawer).focus(), 50); }
    function close() { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); lenis && lenis.start(); $('#cartOpen').focus(); }

    $('#cartOpen').addEventListener('click', open);
    $$('[data-close]', drawer).forEach(b => b.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) close(); });
    $('#cartItems').addEventListener('click', e => {
      const b = e.target.closest('[data-q]'); if (!b) return;
      const id = b.closest('li').dataset.id; const it = items.find(i => i.id === id); if (!it) return;
      it.qty += +b.dataset.q; if (it.qty <= 0) items = items.filter(i => i !== it);
      render();
    });
    $('#checkoutBtn').addEventListener('click', () => {
      if (!items.length) { close(); document.querySelector('#catalog') && scrollToEl($('#catalog')); return; }
      if (!drawer.classList.contains('is-checkout')) { drawer.classList.add('is-checkout'); render(); $('#checkoutForm input').focus(); return; }
      const f = $('#checkoutForm');
      if (!validate(f)) return;
      items = []; drawer.classList.remove('is-checkout'); f.reset(); render(); close();
      toast("Rahmat! Buyurtmangiz qabul qilindi — tez orada bog'lanamiz.");
    });
    return { add, addCustom, render };
  })();

  function validate(form) {
    let ok = true;
    $$('[required]', form).forEach(inp => {
      const f = inp.closest('.field');
      const bad = !inp.value.trim() || (inp.type === 'tel' && inp.value.replace(/\D/g, '').length < 7);
      f.classList.toggle('is-error', bad);
      if (bad && ok) { inp.focus(); ok = false; }
    });
    return ok;
  }

  let toastT;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 2600);
  }

  /* =========================================================
     CATALOG
     ========================================================= */
  function initCatalog() {
    const grid = $('#products');
    const plusSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
    grid.innerHTML = CATALOG.map(p => `
      <article class="card" data-type="${p.type}" data-id="${p.id}" data-price="${p.price}" data-pop="${p.pop}" data-rating="${p.rating}">
        <div class="card__media" data-cursor="Ko'rish">
          ${THUMBS[p.id] ? `<img src="${THUMBS[p.id]}" alt="${p.name}" loading="lazy">` : `<svg viewBox="0 0 100 85" style="width:100%;height:100%"><text x="50" y="50" text-anchor="middle" fill="#ff5a1f" font-family="Anton" font-size="14">TITAN</text></svg>`}
          <span class="card__glare"></span>
          ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ''}
        </div>
        <div class="card__body">
          <span class="card__cat">${p.cat}</span>
          <h3 class="card__name">${p.name}</h3>
          <div class="card__meta"><span class="star">★ ${p.rating.toFixed(1)}</span><span>Omborda bor</span></div>
          <div class="card__foot">
            <span class="card__price">${fmt(p.price)} <small>so'm</small></span>
            <button class="add" data-add="${p.id}" aria-label="${p.name} — savatga qo'shish" data-magnetic>${plusSvg}</button>
          </div>
        </div>
      </article>`).join('');

    grid.addEventListener('click', e => {
      const b = e.target.closest('[data-add]');
      if (b) {
        Cart.add(b.dataset.add, b);
        b.classList.add('is-done'); b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
        setTimeout(() => { b.classList.remove('is-done'); b.innerHTML = plusSvg; }, 1400);
        return;
      }
      const card = e.target.closest('.card');
      if (card && e.target.closest('.card__media')) {
        const map = { dumbbell: 'dumbbell', bar: 'bar', plate: 'plate', kettlebell: 'kettlebell' };
        const k = map[card.dataset.type];
        if (k) { const tab = $(`.viewer__tabs [data-product="${k}"]`); scrollToEl($('#viewer')); setTimeout(() => tab.click(), 600); }
      }
    });

    let filter = 'all', sort = 'pop';
    function apply() {
      const cards = $$('.card', grid);
      const state = Flip.getState(cards);
      cards.forEach(c => c.classList.toggle('is-hidden', filter !== 'all' && c.dataset.type !== filter));
      const sorted = cards.slice().sort((a, b) => {
        if (sort === 'asc') return a.dataset.price - b.dataset.price;
        if (sort === 'desc') return b.dataset.price - a.dataset.price;
        if (sort === 'rating') return b.dataset.rating - a.dataset.rating;
        return a.dataset.pop - b.dataset.pop;
      });
      sorted.forEach(c => grid.appendChild(c));
      Flip.from(state, {
        duration: RM ? 0 : 0.7, ease: 'expo.inOut', absolute: true, scale: true,
        onEnter: els => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 }),
        onLeave: els => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.4 })
      });
      ScrollTrigger.refresh();
    }
    $$('#catFilters .chip').forEach(ch => ch.addEventListener('click', () => {
      $$('#catFilters .chip').forEach(x => x.classList.toggle('is-active', x === ch));
      filter = ch.dataset.filter; apply();
    }));
    $('#catSort').addEventListener('change', e => { sort = e.target.value; apply(); });
  }

  /* =========================================================
     QUIZ
     ========================================================= */
  function initQuiz() {
    const main = $('#quizMain');
    const qs = $$('.quiz__q', main), res = $('#quizResult'), dots = $$('.quiz__steps i');
    const ans = [];
    let step = 0;
    function go(n) {
      qs.forEach((q, i) => { q.classList.toggle('is-active', i === n); q.classList.toggle('is-past', i < n); });
      res.classList.toggle('is-active', n >= qs.length);
      dots.forEach((d, i) => d.classList.toggle('is-on', i <= Math.min(n, 2)));
      step = n;
    }
    function recommend() {
      const [place, goal, level] = ans;
      let ids;
      if (place === 'home') ids = goal === 'fit' ? ['db20', 'kb16'] : ['db20', 'bench'];
      else if (place === 'garage') ids = ['bar20', level === 'new' ? 'bp20' : 'bpset', 'bench'];
      else ids = ['bar20', 'bpset', 'db20', 'kb16'];
      if (goal === 'fit' && !ids.includes('kb16')) ids.push('kb16');
      const titles = { strength: "Kuch to'plami", mass: "Massa to'plami", fit: "Funksional to'plam" };
      const items = ids.map(id => CAT_BY_ID[id]);
      const total = items.reduce((a, p) => a + p.price, 0);
      res.innerHTML = `
        <p class="quiz__label">Sizga tavsiya</p>
        <h3>${titles[goal]}</h3>
        <p>Javoblaringiz asosida tanlangan inventar. Yetkazish ${total >= 1000000 ? 'bepul' : 'Toshkentda 3 soatda'}.</p>
        <ul>${items.map(p => `<li>${p.name}<span>${fmt(p.price)} so'm</span></li>`).join('')}</ul>
        <div class="quiz__actions">
          <button class="btn btn--primary" id="quizAdd" data-magnetic><span>Hammasini savatga · ${fmt(total)} so'm</span></button>
          <button class="link-btn" id="quizRestart">Qayta boshlash</button>
        </div>`;
      $('#quizAdd').addEventListener('click', e => ids.forEach(id => Cart.add(id, e.currentTarget)));
      $('#quizRestart').addEventListener('click', () => { ans.length = 0; go(0); });
      bindMagnetic($$('[data-magnetic]', res));
      gsap.fromTo($$('li, h3, .quiz__actions', res), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.6, delay: 0.2, ease: 'power3.out' });
    }
    qs.forEach((q, i) => $$('button', q).forEach(b => b.addEventListener('click', () => {
      ans[i] = b.dataset.val;
      if (i === qs.length - 1) { recommend(); go(qs.length); } else go(i + 1);
    })));
  }

  /* =========================================================
     MICRO-INTERACTIONS
     ========================================================= */
  function bindMagnetic(els) {
    if (!FINE || RM) return;
    els.forEach(el => {
      if (el._mag) return; el._mag = true;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, .4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, .4)' });
      el.addEventListener('pointermove', e => {
        const b = el.getBoundingClientRect();
        const mx = e.clientX - b.left, my = e.clientY - b.top;
        el.style.setProperty('--mx', mx + 'px'); el.style.setProperty('--my', my + 'px');
        xTo((mx - b.width / 2) * 0.28); yTo((my - b.height / 2) * 0.38);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  function bindTilt() {
    if (!FINE || RM) return;
    $$('.card, [data-tilt]').forEach(el => {
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener('pointermove', e => {
        const b = el.getBoundingClientRect();
        const px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height;
        rx((0.5 - py) * 8); ry((px - 0.5) * 10);
        el.style.setProperty('--gx', px * 100 + '%'); el.style.setProperty('--gy', py * 100 + '%');
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  function initCursor() {
    if (!FINE || RM) return;
    document.documentElement.classList.add('has-cursor');
    const cur = $('#cursor'), dot = $('.cursor__dot', cur), ring = $('.cursor__ring', cur), label = $('#cursorLabel');
    const dx = gsap.quickTo(dot, 'x', { duration: 0.1 }), dy = gsap.quickTo(dot, 'y', { duration: 0.1 });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
    window.addEventListener('pointermove', e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', e => {
      const t = e.target;
      const lab = t.closest('[data-cursor]');
      const drag = t.closest('#viewerCanvas');
      const hov = t.closest('a, button, select, label, input, textarea');
      cur.classList.toggle('is-label', !!lab || !!drag);
      cur.classList.toggle('is-drag', !!drag);
      cur.classList.toggle('is-hover', !!hov && !lab);
      label.textContent = drag ? 'Sudrang' : lab ? lab.dataset.cursor : '';
    });
    document.addEventListener('pointerleave', () => gsap.to(cur, { autoAlpha: 0 }));
    document.addEventListener('pointerenter', () => gsap.to(cur, { autoAlpha: 1 }));
  }

  function splitWords(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        const w = document.createElement('span'); w.className = 'w';
        const i = document.createElement('span'); i.textContent = part; w.appendChild(i);
        frag.appendChild(w);
      });
      n.parentNode.replaceChild(frag, n);
    });
  }

  /* =========================================================
     SMOOTH SCROLL + NAV
     ========================================================= */
  let lenis = null;
  if (!RM && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  function scrollToEl(el) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el.id === 'hero' ? 0 : el, { duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) });
    else el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
  }

  function initNav() {
    const nav = $('#nav'), dock = $('#dock');
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 30);
      nav.classList.toggle('is-hidden', y > 500 && y > lastY && !document.body.classList.contains('menu-open'));
      dock.classList.toggle('is-on', y > innerHeight * 0.8);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    const burger = $('#burger'), menu = $('#menu');
    const setMenu = open => {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open); menu.setAttribute('aria-hidden', !open);
      if (open) { lenis && lenis.stop(); gsap.fromTo($$('nav a', menu), { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.05, duration: 0.7, delay: 0.2, ease: 'expo.out' }); }
      else lenis && lenis.start();
    };
    burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));

    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      const id = a.getAttribute('href'); if (id.length < 2) return;
      const el = document.querySelector(id); if (!el) return;
      e.preventDefault();
      if (document.body.classList.contains('menu-open')) setMenu(false);
      scrollToEl(el);
    });

    $$('.nav__links a').forEach(a => {
      const sec = document.querySelector(a.getAttribute('href'));
      if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: s => a.classList.toggle('is-active', s.isActive) });
    });
  }

  /* =========================================================
     SCROLL CHOREOGRAPHY
     ========================================================= */
  function initStory() {
    const chapters = $$('.chapter');
    const bar = $('#storyBar'), idx = $('#storyIdx');
    const KF = [
      { a: 0.6, R: 3.9, y: 0.7, lx: 0, sx: 0.36, explode: 0, spin: 0, roll: 0, rim: 1 },     // hero
      { a: 1.0, R: 1.5, y: 0.15, lx: 0.82, sx: 0.55, explode: 0, spin: 0, roll: 0.05, rim: 1.4 }, // steel macro (text left)
      { a: -0.3, R: 4.6, y: 0.7, lx: 0, sx: -0.32, explode: 1, spin: 0, roll: -0.08, rim: 1 },     // precision explode (text right)
      { a: 1.45, R: 2.8, y: 0.25, lx: 0.3, sx: 0.5, explode: 0.12, spin: 1, roll: 0, rim: 2 }, // delivery end view (text left)
      { a: 0.08, R: 4.3, y: 1.9, lx: 0, sx: -0.3, explode: 0, spin: 0, roll: 0, rim: 1.1 }        // guarantee (text right)
    ];
    if (stage) {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: '#cine', start: 'top top', end: 'bottom bottom', scrub: RM ? true : 1.2,
          onUpdate: self => {
            const p = clamp((self.progress - 0.21) / 0.79, 0, 1);
            bar.style.transform = `scaleX(${p})`;
            idx.textContent = '0' + Math.min(4, Math.floor(p * 4) + 1);
          }
        }
      });
      tl.to(S, { ...KF[1], duration: 0.21 }, 0)
        .to(S, { ...KF[2], duration: 0.08 }, 0.38)
        .to(S, { ...KF[3], duration: 0.08 }, 0.58)
        .to(S, { ...KF[4], duration: 0.08 }, 0.78)
        .to({}, { duration: 0.06 }, 0.94);
      [[0.19, 0.38], [0.42, 0.58], [0.62, 0.78], [0.82, 2]].forEach(([inT, outT], i) => {
        const ch = chapters[i];
        tl.fromTo(ch, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.04, ease: 'power3.out', immediateRender: false }, inT);
        tl.fromTo($$('.chapter__title, .chapter__text, .chapter__big, .chapter__plates, .btn', ch), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.006, duration: 0.04, immediateRender: false }, inT + 0.005);
        if (outT < 1) tl.to(ch, { autoAlpha: 0, y: -60, duration: 0.035, ease: 'power3.in' }, outT - 0.035);
      });
      // Hero content parallax out
      gsap.to('.hero__content', { yPercent: -30, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 30%', scrub: true } });
      gsap.to('.hero__stats, .hero__tag', { y: -80, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '20% top', end: 'bottom 40%', scrub: true } });
      ScrollTrigger.create({
        trigger: '#cine', start: 'top top', end: 'bottom top',
        onLeave: () => { stage.r.active = false; stage.canvas.classList.add('is-off'); },
        onEnterBack: () => { stage.r.active = true; stage.canvas.classList.remove('is-off'); }
      });
    } else {
      // No WebGL: show chapters stacked via simple fades
      chapters.forEach((ch, i) => gsap.set(ch, { autoAlpha: i === 0 ? 1 : 0 }));
      ScrollTrigger.create({ trigger: '#story', start: 'top top', end: 'bottom bottom', onUpdate: s => { const k = Math.min(3, Math.floor(s.progress * 4)); chapters.forEach((ch, i) => gsap.to(ch, { autoAlpha: i === k ? 1 : 0, duration: 0.4, overwrite: true })); idx.textContent = '0' + (k + 1); bar.style.transform = `scaleX(${s.progress})`; } });
    }
  }

  function initReveals() {
    $$('.reveal-words').forEach(el => {
      splitWords(el);
      if (RM) return;
      gsap.from($$('.w > span', el), { yPercent: 110, rotate: 4, duration: 1.1, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
    if (RM) return;
    const fade = (sel, opts = {}) => ScrollTrigger.batch(sel, {
      start: 'top 88%', once: true,
      onEnter: els => gsap.fromTo(els, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.08, ...opts })
    });
    fade('.section__lead, .eyebrow:not(.hero__eyebrow)');
    fade('.card'); fade('.benefit'); fade('.guide'); fade('.viewer__tabs button');
    fade('.builder__panel > *'); fade('.contact__list li'); fade('.form');
    gsap.from('.quiz__card', { y: 80, autoAlpha: 0, scale: 0.97, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.quiz__card', start: 'top 85%' } });
    gsap.fromTo('.footer__big', { yPercent: 40 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    gsap.from('.viewer__stage', { scale: 0.85, autoAlpha: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.viewer__stage', start: 'top 80%' } });
    gsap.from('.builder__stage', { clipPath: 'inset(12% 12% 12% 12% round 18px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.builder__stage', start: 'top 85%' } });
  }

  function initKinetic() {
    const rows = $$('.kinetic__row');
    const xs = rows.map(() => 0);
    let vel = 0;
    if (lenis) lenis.on('scroll', e => { vel = e.velocity; });
    else { let ly = scrollY; window.addEventListener('scroll', () => { vel = scrollY - ly; ly = scrollY; }, { passive: true }); }
    const vis = { on: false };
    new IntersectionObserver(([e]) => { vis.on = e.isIntersecting; }).observe($('.kinetic'));
    gsap.ticker.add((t, dt) => {
      if (!vis.on || RM) return;
      vel *= 0.92;
      rows.forEach((row, i) => {
        const dir = +row.dataset.dir;
        const w = row.firstElementChild.offsetWidth;
        xs[i] -= dir * (0.06 * dt) * (1 + Math.min(Math.abs(vel), 60) * 0.12);
        if (xs[i] <= -w) xs[i] += w; if (xs[i] > 0) xs[i] -= w;
        gsap.set(row, { x: xs[i], skewX: clamp(-vel * 0.4, -12, 12) });
      });
    });
  }

  function initForms() {
    const f = $('#contactForm');
    f.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(f)) return;
      $('.form__ok', f).textContent = "Rahmat! Mutaxassisimiz tez orada qo'ng'iroq qiladi.";
      f.reset();
    });
    $$('.field input').forEach(i => i.addEventListener('input', () => i.closest('.field').classList.remove('is-error')));
  }

  function countUp() {
    $$('[data-count]').forEach(el => {
      const end = +el.dataset.count, o = { v: 0 };
      gsap.to(o, { v: end, duration: RM ? 0 : 2.2, ease: 'power3.out', onUpdate: () => { el.textContent = el.dataset.format === 'space' ? fmt(o.v) : Math.round(o.v); } });
    });
  }

  function splitHero() {
    $$('.hero__title .split').forEach(s => {
      s.innerHTML = [...s.textContent].map(ch => `<span class="ch">${ch}</span>`).join('');
    });
  }

  /* =========================================================
     BOOT
     ========================================================= */
  async function boot() {
    const loaderNum = $('#loaderNum'), loaderFill = $('#loaderFill');
    const prog = { v: 0 };
    const progTween = gsap.to(prog, { v: 80, duration: 1.2, ease: 'power2.out', onUpdate: () => { loaderNum.textContent = Math.round(prog.v); loaderFill.style.width = prog.v + '%'; } });

    try { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]); } catch (e) {}

    splitHero();
    if (HAS_GL) {
      try { stage = initStage(); } catch (e) { console.warn(e); document.documentElement.classList.add('no-webgl'); stage = null; }
      try { renderThumbs(); } catch (e) { console.warn(e); }
      try { initViewer(); } catch (e) { console.warn(e); }
    }
    initBuilder();
    initCatalog();
    Cart.render();
    initQuiz();
    initNav();
    initStory();
    initReveals();
    initKinetic();
    initForms();
    bindMagnetic($$('[data-magnetic]'));
    bindTilt();
    initCursor();

    await new Promise(r => { if (progTween.progress() >= 1) r(); else progTween.eventCallback('onComplete', r); });
    gsap.to(prog, { v: 100, duration: 0.4, onUpdate: () => { loaderNum.textContent = Math.round(prog.v); loaderFill.style.width = prog.v + '%'; } });

    const tl = gsap.timeline({ delay: 0.45, onComplete: () => { document.body.classList.remove('is-loading'); } });
    tl.to('#loader', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' })
      .add(() => { document.body.classList.remove('is-loading'); lenis && lenis.start(); ScrollTrigger.refresh(); countUp(); }, 0.5)
      .to(S, { intro: 0, duration: RM ? 0 : 2.6, ease: 'expo.out' }, 0.45)
      .from('.hero__title .ch', { yPercent: 120, rotate: 8, duration: 1.3, ease: 'expo.out', stagger: 0.035 }, 0.6)
      .from('.hero__eyebrow, .hero__lead, .hero__ctas > *, .hero__stats li, .hero__tag, .hero__scroll', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.07 }, 1)
      .from('.nav', { yPercent: -100, autoAlpha: 0, duration: 1, ease: 'expo.out' }, 0.9)
      .set('#loader', { display: 'none' });
    if (RM) tl.progress(1);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
