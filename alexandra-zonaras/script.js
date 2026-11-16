(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Settings (typical industry can sizes, illustrative prices) ---------- */
  var SIZES = [
    { id: '250', name: '250 ml', kind: 'Slim', d: 53, h: 134, f: .95 },
    { id: '330', name: '330 ml', kind: 'Sleek', d: 58, h: 146, f: 1 },
    { id: '355', name: '355 ml', kind: 'Standard', d: 66, h: 122, f: 1 },
    { id: '375', name: '375 ml', kind: 'Standard', d: 66, h: 128, f: 1.03 },
    { id: '440', name: '440 ml', kind: 'Tall', d: 66, h: 157, f: 1.06 },
    { id: '500', name: '500 ml', kind: 'King', d: 66, h: 168, f: 1.1 }
  ];
  var COLOURS = ['#121212', '#EFE8DC', '#E8562A', '#1F3B2D', '#1E3A5F', '#F2B8C6', '#FFFFFF', '#B8925A', '#7A1F2B', '#9CC7C2'];
  var QTY = [[200, 1.85], [500, 1.40], [1000, 1.10], [2500, .92], [5000, .81], [10000, .72]];
  var BLEED = 3, SAFE = 5, SEAM = 6, DPI = 300;

  var st = { size: '355', colour: '#1F3B2D', finish: 'matte', mode: 'logo', qty: 1000, brand: 'Tidal Brewing', sub: 'Pacific Pale Ale · 4.5%', lsize: 58 };
  var img = null, imgMeta = null, view = '3d', spin = !reduce;

  /* Restore from share link */
  try { if (location.hash.length > 3) { var hs = JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(1))))); Object.keys(st).forEach(function (k) { if (hs[k] !== undefined) st[k] = hs[k]; }); } } catch (e) { /* ignore bad hash */ }
  $('#brand').value = st.brand; $('#sub').value = st.sub; $('#lsize').value = st.lsize;

  function size() { return SIZES.filter(function (s) { return s.id === st.size; })[0]; }
  function labelH(s) { return s.h - 26; }
  function circ(s) { return Math.PI * s.d; }
  function lum(hex) { var n = parseInt(hex.slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255; return (0.299 * r + 0.587 * g + 0.114 * b) / 255; }

  /* ---------- Label artwork (canvas) ---------- */
  var art = document.createElement('canvas');
  function drawArt() {
    var s = size(), W = 2048, H = Math.round(W * labelH(s) / circ(s));
    art.width = W; art.height = H;
    var g = art.getContext('2d');
    g.fillStyle = st.colour; g.fillRect(0, 0, W, H);
    var ink = lum(st.colour) > .6 ? '#121212' : '#F7F3EC';
    if (st.mode === 'wrap' && img) {
      var r = Math.max(W / img.width, H / img.height), w = img.width * r, h = img.height * r;
      g.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    } else {
      // back panel details (away from the front)
      g.fillStyle = ink; g.globalAlpha = .75;
      g.font = '600 ' + Math.round(H * .045) + 'px "Inter Tight", sans-serif'; g.textAlign = 'center';
      g.fillText(s.name.toUpperCase() + ' · ALUMINIUM CAN', W * .16, H * .2);
      g.font = '400 ' + Math.round(H * .036) + 'px "Inter Tight", sans-serif';
      ['Ingredients: water, malted barley,', 'hops, yeast. Keep cold.', 'Infinitely recyclable.'].forEach(function (t, i) { g.fillText(t, W * .16, H * (.3 + i * .06)); });
      for (var k = 0; k < 34; k++) { var bw = (k * 7 % 5) + 3; g.fillRect(W * .1 + k * 9, H * .62, bw, H * .14); }
      g.fillText('9 300000 012345', W * .16, H * .82);
      g.font = 'italic 400 ' + Math.round(H * .06) + 'px "Instrument Serif", serif';
      g.fillText('Drink local.', W * .84, H * .5);
      g.globalAlpha = 1;
      // front: logo or brand
      var cx = W / 2, maxW = W * .3 * (st.lsize / 60);
      if (img) {
        var rr = Math.min(maxW / img.width, (H * .62 * st.lsize / 60) / img.height), lw = img.width * rr, lh = img.height * rr;
        g.drawImage(img, cx - lw / 2, H * .44 - lh / 2, lw, lh);
        imgMeta && (imgMeta.printedMm = lw / W * circ(s));
      } else {
        g.fillStyle = ink; g.textAlign = 'center';
        var fs = Math.round(H * .16 * st.lsize / 58);
        g.font = '400 ' + fs + 'px "Instrument Serif", serif';
        while (g.measureText(st.brand).width > maxW * 1.15 && fs > 20) { fs -= 4; g.font = '400 ' + fs + 'px "Instrument Serif", serif'; }
        g.fillText(st.brand, cx, H * .46);
        g.fillStyle = st.colour === '#E8562A' ? ink : '#E8562A'; g.fillRect(cx - W * .02, H * .53, W * .04, H * .008);
        g.fillStyle = ink; g.font = '500 ' + Math.round(H * .05) + 'px "Inter Tight", sans-serif';
        g.fillText(st.sub, cx, H * .62);
      }
    }
    return art;
  }

  /* ---------- Three.js scene ---------- */
  var three = null;
  function initThree() {
    var T = window.THREE, cv = $('#gl');
    if (!T) return null;
    var renderer;
    try { renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, preserveDrawingBuffer: true }); } catch (e) { return null; }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(28, 1, .1, 200);
    // studio environment for reflections
    var ec = document.createElement('canvas'); ec.width = 1024; ec.height = 512;
    var eg = ec.getContext('2d'), gr = eg.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, '#fffaf2'); gr.addColorStop(.5, '#d9d2c6'); gr.addColorStop(1, '#6d6760');
    eg.fillStyle = gr; eg.fillRect(0, 0, 1024, 512);
    eg.fillStyle = '#ffffff'; eg.fillRect(120, 120, 150, 260); eg.fillRect(700, 90, 110, 300); eg.fillStyle = '#fff6e6'; eg.fillRect(420, 30, 200, 60);
    var et = new T.CanvasTexture(ec); et.mapping = T.EquirectangularReflectionMapping; et.encoding = T.sRGBEncoding;
    var pm = new T.PMREMGenerator(renderer); scene.environment = pm.fromEquirectangular(et).texture;
    var key = new T.DirectionalLight(0xffffff, .7); key.position.set(3, 6, 5); scene.add(key);
    scene.add(new T.AmbientLight(0xffffff, .15));
    // contact shadow
    var sc = document.createElement('canvas'); sc.width = sc.height = 256;
    var sg = sc.getContext('2d'), rg = sg.createRadialGradient(128, 128, 10, 128, 128, 128);
    rg.addColorStop(0, 'rgba(40,30,20,.42)'); rg.addColorStop(1, 'rgba(40,30,20,0)'); sg.fillStyle = rg; sg.fillRect(0, 0, 256, 256);
    var shadow = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: new T.CanvasTexture(sc), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; scene.add(shadow);
    var group = new T.Group(); scene.add(group);
    var labelTex = new T.CanvasTexture(art); labelTex.encoding = T.sRGBEncoding; labelTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    var metalMat = new T.MeshStandardMaterial({ color: 0xdcdce0, metalness: 1, roughness: .26 });
    var labelMat = new T.MeshPhysicalMaterial({ map: labelTex });
    return { T: T, renderer: renderer, scene: scene, camera: camera, group: group, shadow: shadow, labelTex: labelTex, metalMat: metalMat, labelMat: labelMat, rotY: -0.5, rotX: .08, dist: 1, vy: 0 };
  }

  function buildCan() {
    if (!three) return;
    var T = three.T, s = size(), g = three.group, u = .1, r = s.d / 2, h = s.h;
    while (g.children.length) { var c = g.children.pop(); c.geometry.dispose(); }
    var P = [[0, 3], [r * .70, .5], [r * .80, 0], [r * .86, .6], [r * .97, 4], [r, 8], [r, h - 16], [r * .94, h - 10], [r * .84, h - 4.5], [r * .87, h - 3], [r * .87, h - 1], [r * .84, 0 + h], [r * .80, h - .6], [r * .78, h - 2.6], [0, h - 2.6]];
    var pts = P.map(function (p) { return new T.Vector2(p[0] * u, p[1] * u); });
    var body = new T.Mesh(new T.LatheGeometry(pts, 128), three.metalMat); g.add(body);
    var lh = labelH(s);
    var label = new T.Mesh(new T.CylinderGeometry(r * u + .004, r * u + .004, lh * u, 160, 1, true, Math.PI, Math.PI * 2), three.labelMat);
    label.position.y = (9 + lh / 2) * u; g.add(label);
    var tab = new T.Mesh(new T.BoxGeometry(r * .5 * u, .08 * u * 10, r * .32 * u), three.metalMat);
    tab.position.set(0, (h - 2.2) * u, r * .22 * u); g.add(tab);
    g.position.y = 0;
    three.shadow.scale.set(r * u * 3.4, r * u * 3.4, 1);
    three.target = h * u / 2;
    three.baseDist = h * u * 2.75 + r * u;
    resize();
  }

  function applyFinish() {
    if (!three) return;
    var m = three.labelMat;
    if (st.finish === 'matte') { m.metalness = .05; m.roughness = .72; m.clearcoat = 0; }
    else if (st.finish === 'gloss') { m.metalness = .08; m.roughness = .22; m.clearcoat = 1; m.clearcoatRoughness = .06; }
    else { m.metalness = .72; m.roughness = .28; m.clearcoat = .4; m.clearcoatRoughness = .2; }
    m.needsUpdate = true;
  }

  function resize() {
    var v = $('#view'), w = v.clientWidth, h = v.clientHeight;
    if (three) {
      three.renderer.setSize(w, h, false);
      three.camera.aspect = w / h;
      three.camera.updateProjectionMatrix();
    }
    if (view === 'flat') drawFlat();
  }

  function frame() {
    if (three) {
      if (spin && !dragging) three.rotY += .006;
      three.rotY += three.vy; three.vy *= .92;
      three.group.rotation.y = three.rotY; three.group.rotation.x = three.rotX;
      var aspectFix = Math.max(1, 1 / three.camera.aspect * .9);
      var d = three.baseDist * three.dist * aspectFix;
      three.camera.position.set(0, three.target + d * .12, d);
      three.camera.lookAt(0, three.target, 0);
      three.renderer.render(three.scene, three.camera);
    }
    requestAnimationFrame(frame);
  }

  /* Drag / zoom */
  var dragging = false, lx = 0, ly = 0;
  var gl = $('#gl');
  gl.addEventListener('pointerdown', function (e) { dragging = true; lx = e.clientX; ly = e.clientY; gl.setPointerCapture(e.pointerId); $('#hint').style.opacity = 0; });
  gl.addEventListener('pointermove', function (e) {
    if (!dragging || !three) return;
    var dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
    three.rotY += dx * .01; three.vy = dx * .002; three.rotX = Math.max(-.35, Math.min(.5, three.rotX + dy * .004));
  });
  ['pointerup', 'pointercancel'].forEach(function (ev) { gl.addEventListener(ev, function () { dragging = false; }); });
  gl.addEventListener('wheel', function (e) { if (!three) return; e.preventDefault(); three.dist = Math.max(.6, Math.min(1.6, three.dist + e.deltaY * .001)); }, { passive: false });

  /* ---------- Flat print template ---------- */
  function drawFlat() {
    var cv = $('#flat'), v = $('#view'), dpr = Math.min(2, window.devicePixelRatio || 1);
    var W = v.clientWidth, H = v.clientHeight; cv.width = W * dpr; cv.height = H * dpr;
    var g = cv.getContext('2d'); g.scale(dpr, dpr); g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
    var s = size(), cw = circ(s), lh = labelH(s);
    var pad = 46, sc = Math.min((W - pad * 2) / cw, (H - pad * 2 - 40) / (lh + BLEED * 2));
    var bw = cw * sc, bh = (lh + BLEED * 2) * sc, x0 = (W - bw) / 2, y0 = (H - bh) / 2 + 10;
    g.drawImage(drawArt(), x0, y0 + BLEED * sc, bw, lh * sc);
    // bleed area
    g.fillStyle = 'rgba(232,86,42,.12)'; g.fillRect(x0, y0, bw, BLEED * sc); g.fillRect(x0, y0 + bh - BLEED * sc, bw, BLEED * sc);
    g.setLineDash([6, 4]); g.lineWidth = 1.5;
    g.strokeStyle = '#E8562A'; g.strokeRect(x0, y0, bw, bh);
    g.strokeStyle = '#121212'; g.setLineDash([]); g.strokeRect(x0, y0 + BLEED * sc, bw, lh * sc);
    g.setLineDash([4, 4]); g.strokeStyle = '#1f7a4a'; g.strokeRect(x0 + SEAM * sc, y0 + (BLEED + SAFE) * sc, bw - SEAM * 2 * sc, (lh - SAFE * 2) * sc);
    g.setLineDash([]);
    // seam zones
    g.save(); g.beginPath(); g.rect(x0, y0, SEAM * sc, bh); g.rect(x0 + bw - SEAM * sc, y0, SEAM * sc, bh); g.clip();
    g.strokeStyle = 'rgba(180,35,24,.55)'; g.lineWidth = 1;
    for (var i = -bh; i < bw + bh; i += 6) { g.beginPath(); g.moveTo(x0 + i, y0); g.lineTo(x0 + i + bh, y0 + bh); g.stroke(); }
    g.restore();
    // labels
    g.fillStyle = '#121212'; g.font = '600 12px "JetBrains Mono", monospace'; g.textAlign = 'center';
    g.fillText(cw.toFixed(1) + ' mm  ·  ' + Math.round(cw / 25.4 * DPI) + ' px @ ' + DPI + ' dpi', W / 2, y0 - 14);
    g.fillText('FRONT', x0 + bw / 2, y0 + bh + 18);
    g.fillStyle = '#b42318'; g.fillText('SEAM', x0 + SEAM * sc / 2, y0 + bh + 18); g.fillText('SEAM', x0 + bw - SEAM * sc / 2, y0 + bh + 18);
    g.save(); g.translate(x0 - 16, y0 + bh / 2); g.rotate(-Math.PI / 2); g.fillStyle = '#121212';
    g.fillText((lh + BLEED * 2) + ' mm incl. bleed', 0, 0); g.restore();
    g.font = '500 11px "Inter Tight", sans-serif'; g.textAlign = 'left';
    var ly2 = H - 16, lx2 = 16;
    [['#E8562A', 'Bleed (3 mm, trimmed off)'], ['#1f7a4a', 'Safe zone (keep text inside)'], ['#b42318', 'Seam (no text or logos)']].forEach(function (k) { g.fillStyle = k[0]; g.fillRect(lx2, ly2 - 9, 10, 10); g.fillStyle = '#121212'; g.fillText(k[1], lx2 + 14, ly2); lx2 += g.measureText(k[1]).width + 34; });
  }

  /* ---------- Print-ready checks ---------- */
  function checks() {
    var s = size(), cw = circ(s), lh = labelH(s), needW = Math.round(cw / 25.4 * DPI), needH = Math.round((lh + BLEED * 2) / 25.4 * DPI);
    $('#areaSpec').textContent = s.name + ' · printable ' + cw.toFixed(1) + ' × ' + lh + ' mm (+' + BLEED + ' mm bleed) · full wrap needs ' + needW + ' × ' + needH + ' px';
    var L = [];
    if (!imgMeta) {
      L.push(['info', 'No artwork uploaded yet', 'Showing your brand name. Upload a logo or full-wrap artwork to check it.']);
    } else if (imgMeta.error) {
      L.push(['bad', 'We couldn\'t read this file', 'Export it as an RGB PNG or JPG (CMYK JPGs often fail in browsers).']);
    } else {
      L.push(['ok', 'File read: ' + imgMeta.name, imgMeta.vector ? 'Vector SVG' : imgMeta.w + ' × ' + imgMeta.h + ' px · ' + (imgMeta.bytes / 1048576).toFixed(1) + ' MB']);
      if (st.mode === 'wrap') {
        var dpi = imgMeta.vector ? 999 : Math.min(imgMeta.w / (cw / 25.4), imgMeta.h / ((lh + BLEED * 2) / 25.4));
        L.push(imgMeta.vector ? ['ok', 'Vector artwork', 'Prints sharp at any size.'] : dpi >= 280 ? ['ok', 'Resolution: ' + Math.round(dpi) + ' dpi', 'Sharp at print size.'] : dpi >= 150 ? ['warn', 'Resolution: ' + Math.round(dpi) + ' dpi', 'May look soft. Best is ' + needW + ' × ' + needH + ' px.'] : ['bad', 'Resolution: ' + Math.round(dpi) + ' dpi', 'Too low for print. Needs ' + needW + ' × ' + needH + ' px.']);
        var want = cw / (lh + BLEED * 2), have = imgMeta.w / imgMeta.h, diff = Math.abs(have / want - 1) * 100;
        L.push(diff <= 6 ? ['ok', 'Proportions match the can', 'Artwork fits the ' + s.name + ' wrap.'] : ['warn', 'Proportions are ' + Math.round(diff) + '% off', 'About ' + Math.round(Math.min(60, diff)) + '% will be cropped. Use the template size above.']);
        L.push(imgMeta.seamBusy ? ['warn', 'Detail near the seam', 'Text or logos at the left or right edge will be split by the seam.'] : ['ok', 'Seam area is clear', 'Nothing important at the edges.']);
      } else {
        var mm = imgMeta.printedMm || 40, ldpi = imgMeta.vector ? 999 : imgMeta.w / (mm / 25.4);
        L.push(imgMeta.vector ? ['ok', 'Vector logo', 'Prints sharp at any size.'] : ldpi >= 280 ? ['ok', 'Logo resolution: ' + Math.round(ldpi) + ' dpi', 'Sharp at ' + Math.round(mm) + ' mm wide.'] : ldpi >= 150 ? ['warn', 'Logo resolution: ' + Math.round(ldpi) + ' dpi', 'Fine on screen, may look soft at ' + Math.round(mm) + ' mm. Upload a larger PNG or an SVG.'] : ['bad', 'Logo resolution: ' + Math.round(ldpi) + ' dpi', 'Too small for ' + Math.round(mm) + ' mm wide. Upload an SVG or a larger PNG.']);
        L.push(imgMeta.vector || imgMeta.alpha ? ['ok', 'Transparent background', 'The logo sits cleanly on the can colour.'] : ['warn', 'Solid background box', 'Your logo has a background that will print as a box. Use a transparent PNG or SVG.']);
      }
      if (imgMeta.bytes > 25 * 1048576) L.push(['warn', 'Large file', 'Over 25 MB. Fine for print, slower to upload.']);
    }
    var ink = lum(st.colour);
    if (st.finish === 'metal' && ink > .8) L.push(['info', 'Metallic + light colour', 'Light colours on metallic look silvery. Expect a softer tone than on screen.']);
    $('#checks').innerHTML = L.map(function (c) { return '<li class="' + c[0] + '"><b>' + c[1] + '</b><span>' + c[2] + '</span></li>'; }).join('');
  }

  function analyse(file, image) {
    var meta = { name: file.name.length > 26 ? file.name.slice(0, 23) + '…' : file.name, bytes: file.size, vector: /svg/.test(file.type), w: image.naturalWidth || image.width, h: image.naturalHeight || image.height };
    if (!meta.vector) {
      try {
        var c = document.createElement('canvas'), n = 200; c.width = n; c.height = Math.max(1, Math.round(n * meta.h / meta.w));
        var g = c.getContext('2d'); g.drawImage(image, 0, 0, c.width, c.height);
        var d = g.getImageData(0, 0, c.width, c.height).data, alpha = false;
        for (var i = 3; i < d.length; i += 16) { if (d[i] < 245) { alpha = true; break; } }
        meta.alpha = alpha;
        var edge = Math.max(2, Math.round(c.width * .03)), vals = [];
        for (var y = 0; y < c.height; y += 2) for (var x = 0; x < c.width; x++) { if (x < edge || x >= c.width - edge) { var k = (y * c.width + x) * 4; vals.push(.3 * d[k] + .59 * d[k + 1] + .11 * d[k + 2]); } }
        var m = vals.reduce(function (a, b) { return a + b; }, 0) / vals.length, sd = Math.sqrt(vals.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0) / vals.length);
        meta.seamBusy = sd > 38;
      } catch (e) { meta.alpha = false; }
    }
    return meta;
  }

  $('#file').addEventListener('change', function () {
    var f = this.files && this.files[0]; if (!f) return;
    var url = URL.createObjectURL(f), im = new Image();
    im.onload = function () {
      img = im; imgMeta = analyse(f, im);
      if (!imgMeta.vector && !imgMeta.alpha && imgMeta.w >= 900 && Math.abs((imgMeta.w / imgMeta.h) / (circ(size()) / labelH(size())) - 1) < .25 && st.mode !== 'wrap') setMode('wrap'); else update();
      $('.upload').classList.add('has'); $('.upload b').textContent = 'Replace file'; $('.upload small').textContent = f.name;
      toast('Artwork added and checked');
    };
    im.onerror = function () { img = null; imgMeta = { error: true }; update(); };
    im.src = url;
  });

  /* ---------- Controls ---------- */
  $('#sizes').innerHTML = SIZES.map(function (s) {
    var hh = 38, ww = Math.round(hh * s.d / s.h * 1.25);
    return '<button type="button" class="size" role="radio" data-s="' + s.id + '" aria-checked="' + (s.id === st.size) + '"><svg viewBox="0 0 ' + ww + ' ' + hh + '" aria-hidden="true"><rect x="1" y="3" width="' + (ww - 2) + '" height="' + (hh - 5) + '" rx="3" fill="#121212"/><rect x="' + (ww * .15) + '" y="0" width="' + (ww * .7) + '" height="4" rx="1.5" fill="#121212"/></svg>' + s.name + '<small>' + s.kind + '</small></button>';
  }).join('');
  $('#colours').innerHTML = COLOURS.map(function (c) { return '<button type="button" role="radio" aria-label="Colour ' + c + '" data-c="' + c + '" aria-checked="' + (c === st.colour) + '" style="background:' + c + '"></button>'; }).join('') + '<label title="Custom colour"><input type="color" id="custom" value="' + st.colour + '" aria-label="Custom colour"></label>';
  $('#qty').innerHTML = QTY.map(function (q) { return '<button type="button" role="radio" data-q="' + q[0] + '" aria-checked="' + (q[0] === st.qty) + '">' + q[0].toLocaleString('en-AU') + '<small>cans</small></button>'; }).join('');

  function press(sel, attr, val) { $$(sel).forEach(function (b) { b.setAttribute(b.getAttribute('role') === 'radio' ? 'aria-checked' : 'aria-pressed', String(b.dataset[attr] === String(val))); }); }
  function setMode(m) { st.mode = m; press('[data-m]', 'm', m); update(); }
  $('#sizes').addEventListener('click', function (e) { var b = e.target.closest('[data-s]'); if (!b) return; st.size = b.dataset.s; press('[data-s]', 's', st.size); buildCan(); update(); });
  $('#colours').addEventListener('click', function (e) { var b = e.target.closest('[data-c]'); if (!b) return; st.colour = b.dataset.c; press('[data-c]', 'c', st.colour); update(); });
  $('#custom').addEventListener('input', function () { st.colour = this.value.toUpperCase(); press('[data-c]', 'c', st.colour); update(); });
  $$('[data-f]').forEach(function (b) { b.addEventListener('click', function () { st.finish = b.dataset.f; press('[data-f]', 'f', st.finish); applyFinish(); update(); }); });
  $$('[data-m]').forEach(function (b) { b.addEventListener('click', function () { setMode(b.dataset.m); }); });
  $('#qty').addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (!b) return; st.qty = +b.dataset.q; press('[data-q]', 'q', st.qty); price(); });
  $('#brand').addEventListener('input', function () { st.brand = this.value || ' '; update(); });
  $('#sub').addEventListener('input', function () { st.sub = this.value; update(); });
  $('#lsize').addEventListener('input', function () { st.lsize = +this.value; update(); });
  $$('[data-v]').forEach(function (b) { b.addEventListener('click', function () { view = b.dataset.v; press('[data-v]', 'v', view); $('#flat').hidden = view !== 'flat'; $('#gl').style.visibility = view === 'flat' ? 'hidden' : 'visible'; $('#hint').hidden = view === 'flat'; if (view === 'flat') drawFlat(); }); });
  $('#spin').setAttribute('aria-pressed', String(spin));
  $('#spin').addEventListener('click', function () { spin = !spin; this.setAttribute('aria-pressed', String(spin)); });

  function price() {
    var s = size(), q = QTY.filter(function (x) { return x[0] === st.qty; })[0], per = q[1] * s.f + (st.finish === 'metal' ? .08 : 0);
    $('#per').textContent = '$' + per.toFixed(2);
    $('#tot').textContent = '$' + Math.round(per * st.qty).toLocaleString('en-AU');
    $('#ordQty').textContent = '· ' + st.qty.toLocaleString('en-AU') + ' cans';
  }
  function update() {
    drawArt();
    if (three) three.labelTex.needsUpdate = true;
    if (view === 'flat') drawFlat();
    var s = size();
    $('#spec').innerHTML = s.name + ' ' + s.kind.toLowerCase() + ' · Ø' + s.d + ' × ' + s.h + ' mm<br>' + { matte: 'Matte', gloss: 'Gloss', metal: 'Metallic' }[st.finish] + ' · ' + st.colour;
    checks(); price();
  }

  /* ---------- Share + proof + order ---------- */
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('on'); }, 2600); }
  $('#share').addEventListener('click', function () {
    var link = location.href.split('#')[0] + '#' + btoa(unescape(encodeURIComponent(JSON.stringify(st))));
    history.replaceState(null, '', link);
    var done = function () { toast(img ? 'Link copied. It shares your settings; uploaded artwork stays on this device.' : 'Link copied. Send it to your team.'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, function () { prompt('Copy this link:', link); });
    else { prompt('Copy this link:', link); }
  });
  $('#proof').addEventListener('click', function () {
    var c = document.createElement('canvas'); c.width = 1600; c.height = 1000;
    var g = c.getContext('2d'); g.fillStyle = '#F7F3EC'; g.fillRect(0, 0, 1600, 1000);
    if (three) { three.renderer.render(three.scene, three.camera); var src = three.renderer.domElement, r = Math.min(900 / src.width, 900 / src.height); g.drawImage(src, 40 + (900 - src.width * r) / 2, 50 + (900 - src.height * r) / 2, src.width * r, src.height * r); }
    var s = size(), q = QTY.filter(function (x) { return x[0] === st.qty; })[0], per = q[1] * s.f + (st.finish === 'metal' ? .08 : 0);
    g.fillStyle = '#121212'; g.font = '400 64px "Instrument Serif", serif'; g.fillText('CAND. Design proof', 980, 140);
    g.font = '500 26px "Inter Tight", sans-serif';
    [['Brand', st.brand], ['Can', s.name + ' ' + s.kind + ' · Ø' + s.d + ' × ' + s.h + ' mm'], ['Finish', { matte: 'Matte', gloss: 'Gloss', metal: 'Metallic' }[st.finish]], ['Colour', st.colour], ['Quantity', st.qty.toLocaleString('en-AU') + ' cans'], ['Price', '$' + per.toFixed(2) + ' / can · $' + Math.round(per * st.qty).toLocaleString('en-AU') + ' ex GST']].forEach(function (row, i) {
      g.fillStyle = '#6b655c'; g.fillText(row[0], 980, 230 + i * 62); g.fillStyle = '#121212'; g.fillText(row[1], 1140, 230 + i * 62);
    });
    var a = art, aw = 560, ah = aw * a.height / a.width; g.drawImage(a, 980, 640, aw, ah); g.strokeStyle = '#121212'; g.strokeRect(980, 640, aw, ah);
    g.fillStyle = '#6b655c'; g.font = '400 20px "Inter Tight", sans-serif'; g.fillText('Flat print template · prototype proof · ' + new Date().toLocaleDateString('en-AU'), 980, 640 + ah + 34);
    var link = document.createElement('a'); link.download = 'CAND-proof-' + st.brand.replace(/\W+/g, '-') + '.png'; link.href = c.toDataURL('image/png'); document.body.appendChild(link); link.click(); link.remove();
    toast('Proof downloaded');
  });
  $('#order').addEventListener('click', function () { toast('Prototype: this continues to checkout with your proof attached.'); });

  /* ---------- Boot ---------- */
  press('[data-s]', 's', st.size); press('[data-c]', 'c', st.colour); press('[data-f]', 'f', st.finish); press('[data-m]', 'm', st.mode); press('[data-q]', 'q', st.qty);
  drawArt();
  three = initThree();
  if (!three) { $('#nogl').hidden = false; $('#hint').hidden = true; }
  buildCan(); applyFinish(); update();
  window.addEventListener('resize', resize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
  setTimeout(function () { $('#hint').style.opacity = 0; }, 5000);
  resize(); requestAnimationFrame(frame);
})();
