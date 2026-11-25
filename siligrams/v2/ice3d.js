/* Siligrams — real-time 3D ice cube (three.js r149)
   Glass-like transmission, rounded edges, frosted etched logo, tiny air bubbles. */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;

  function roundedBox(size, r, seg) {
    var g = new THREE.BoxGeometry(size, size, size, seg, seg, seg);
    var p = g.attributes.position, v = new THREE.Vector3(), inner = new THREE.Vector3(), h = size / 2 - r;
    for (var i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      inner.set(Math.max(-h, Math.min(h, v.x)), Math.max(-h, Math.min(h, v.y)), Math.max(-h, Math.min(h, v.z)));
      v.sub(inner).normalize().multiplyScalar(r).add(inner);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }

  function canvasTex(w, h, draw) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c); t.userData = { canvas: c };
    return t;
  }

  window.Ice3D = function (canvas, opts) {
    opts = opts || {};
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch (e) { return null; }
    var small = window.innerWidth < 760;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0, 5.2);

    /* studio environment from a painted equirect canvas */
    var envTex = canvasTex(1024, 512, function (x, w, h) {
      var g = x.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#1a1622"); g.addColorStop(0.5, "#0c0a10"); g.addColorStop(1, "#050407");
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      function box(cx, cy, bw, bh, col, blur) { x.save(); x.filter = "blur(" + blur + "px)"; x.fillStyle = col; x.fillRect(cx - bw / 2, cy - bh / 2, bw, bh); x.restore(); }
      box(260, 150, 220, 120, "#ffffff", 14);
      box(760, 170, 160, 220, "#dbe9ff", 18);
      box(520, 60, 520, 40, "#ffffff", 10);
      box(900, 330, 140, 90, "#ffb35c", 30);
      box(120, 330, 120, 140, "#9fc3ff", 30);
    });
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.encoding = THREE.sRGBEncoding;
    var pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromEquirectangular(envTex).texture;

    /* backdrop the ice refracts */
    var back = new THREE.Mesh(new THREE.PlaneGeometry(14, 9), new THREE.MeshBasicMaterial({
      map: canvasTex(1024, 640, function (x, w, h) {
        x.fillStyle = opts.bg || "#0d0a12"; x.fillRect(0, 0, w, h);
        function glow(cx, cy, r, col) { var g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, w, h); }
        var cx = w * (0.5 + (opts.offsetX || 0) * 0.13), cy = h * (0.5 - (opts.offsetY || 0) * 0.16);
        glow(cx + 120, cy + 120, 280, "rgba(232,150,60,.6)");
        glow(cx - 110, cy - 90, 260, "rgba(140,190,255,.4)");
        glow(cx, cy, 230, "rgba(170,205,245,.5)");
        glow(cx - 20, cy - 30, 110, "rgba(255,255,255,.45)");
        x.globalAlpha = 0.06; x.strokeStyle = "#fff"; x.lineWidth = 1;
        for (var i = 0; i < 40; i++) { x.beginPath(); x.moveTo(0, i * 18); x.lineTo(w, i * 18 + 120); x.stroke(); }
      }),
      transparent: false
    }));
    back.material.map.encoding = THREE.sRGBEncoding;
    back.position.z = -3;
    scene.add(back);

    /* logo texture (white on black) */
    var logoTex = canvasTex(1024, 1024, function () {});
    var logoCanvas = logoTex.userData.canvas, lc = logoCanvas.getContext("2d");
    function paint(text, img) {
      lc.fillStyle = "#000"; lc.fillRect(0, 0, 1024, 1024);
      lc.fillStyle = "#fff";
      if (img) {
        var s = Math.min(640 / img.width, 520 / img.height);
        var w = img.width * s, h = img.height * s;
        lc.drawImage(img, 512 - w / 2, 512 - h / 2, w, h);
      } else {
        var t = (text || "YOUR LOGO").toUpperCase();
        var words = t.split(/\s+/), lines = words.length > 1 && t.length > 8 ? [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")] : [t];
        var fs = 320;
        lc.font = "900 " + fs + "px Roboto, Arial, sans-serif";
        var maxW = Math.max.apply(null, lines.map(function (l) { return lc.measureText(l).width; }));
        fs = Math.min(fs, fs * 860 / maxW);
        lc.font = "900 " + fs + "px Roboto, Arial, sans-serif";
        lc.textAlign = "center"; lc.textBaseline = "middle";
        var lh = fs * 1.02, y0 = 512 - (lines.length - 1) * lh / 2;
        lines.forEach(function (l, i) { lc.fillText(l, 512, y0 + i * lh); });
      }
      logoTex.needsUpdate = true;
    }
    paint(opts.text || "SILIGRAMS");

    /* the cube */
    var size = 1.25, rad = 0.13;
    var geo = roundedBox(size, rad, small ? 10 : 18);
    var ice = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: 0.06, transmission: 1, thickness: 0.7, ior: 1.31,
      attenuationColor: new THREE.Color("#eef6ff"), attenuationDistance: 6,
      clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 2.4, specularIntensity: 1,
      emissive: new THREE.Color("#1c2c40"), emissiveIntensity: 0.3
    });
    var cube = new THREE.Mesh(geo, ice);
    var core = new THREE.Mesh(roundedBox(size * 0.62, 0.2, small ? 6 : 10), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.16, depthWrite: false }));

    // etched / frosted logo on the top and front faces
    var frost = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, roughness: 0.4, metalness: 0, transparent: true, opacity: 1, emissive: new THREE.Color("#ffffff"), emissiveIntensity: 0.25, alphaMap: logoTex,
      depthWrite: false, envMapIntensity: 1.6, clearcoat: 0.4
    });
    var face = new THREE.PlaneGeometry(size * 0.8, size * 0.8);
    var front = new THREE.Mesh(face, frost); front.position.z = size / 2 + 0.002;
    var top = new THREE.Mesh(face, frost); top.rotation.x = -Math.PI / 2; top.position.y = size / 2 + 0.002;
    var group = new THREE.Group();
    group.add(core, cube, front, top);

    // tiny air bubbles inside
    var bp = [], n = small ? 26 : 48;
    for (var i = 0; i < n; i++) {
      var r = Math.pow(Math.random(), 0.6) * 0.28;
      var a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1);
      bp.push(r * Math.sin(b) * Math.cos(a), r * Math.sin(b) * Math.sin(a) - 0.05, r * Math.cos(b));
    }
    var bg = new THREE.BufferGeometry(); bg.setAttribute("position", new THREE.Float32BufferAttribute(bp, 3));
    var dot = canvasTex(64, 64, function (x) { var g = x.createRadialGradient(32, 32, 0, 32, 32, 30); g.addColorStop(0, "rgba(255,255,255,.95)"); g.addColorStop(0.4, "rgba(255,255,255,.35)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 64, 64); });
    var bubbles = new THREE.Points(bg, new THREE.PointsMaterial({ size: 0.035, map: dot, transparent: true, depthWrite: false, opacity: 0.7 }));
    group.add(bubbles);
    scene.add(group);

    // contact shadow
    var sh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), new THREE.MeshBasicMaterial({
      map: canvasTex(256, 256, function (x) { var g = x.createRadialGradient(128, 128, 0, 128, 128, 120); g.addColorStop(0, "rgba(0,0,0,.55)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, 256, 256); }),
      transparent: true, depthWrite: false
    }));
    sh.rotation.x = -Math.PI / 2; sh.position.y = -1.15;
    scene.add(sh);

    var key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(2, 3, 4); scene.add(key);
    var rim = new THREE.DirectionalLight(0xffc48a, 0.8); rim.position.set(-3, -1, -2); scene.add(rim);

    /* sizing */
    var offsetX = opts.offsetX || 0, offsetY = opts.offsetY || 0, baseY = 0;
    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      var mobile = w < 760;
      group.scale.setScalar(mobile ? 0.82 : (opts.scale || 1));
      group.position.x = mobile ? 0 : offsetX; baseY = mobile ? 0 : offsetY; sh.position.y = baseY - 1.15;
      sh.position.x = group.position.x;
    }
    window.addEventListener("resize", resize);
    resize();

    /* interaction */
    var mouse = { x: 0, y: 0 }, tm = { x: 0, y: 0 }, scrollP = 0, visible = true, t0 = performance.now(), spin = 0;
    window.addEventListener("pointermove", function (e) { mouse.x = e.clientX / window.innerWidth - 0.5; mouse.y = e.clientY / window.innerHeight - 0.5; }, { passive: true });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(canvas);
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible) return;
      var t = (now - t0) / 1000;
      tm.x += (mouse.x - tm.x) * 0.05; tm.y += (mouse.y - tm.y) * 0.05;
      if (!reduce) spin += 0.0025;
      group.rotation.y = -0.55 + Math.sin(t * 0.35) * 0.35 + tm.x * 0.9 + scrollP * 2.4 + spin * 0.15;
      group.rotation.x = 0.32 + tm.y * 0.5 + scrollP * 0.9;
      group.rotation.z = Math.sin(t * 0.5) * 0.04;
      group.position.y = baseY + (reduce ? 0 : Math.sin(t * 1.1) * 0.07) + scrollP * 0.6;
      sh.material.opacity = 1 - Math.min(1, Math.abs(group.position.y - baseY) * 1.2);
      back.position.x = -tm.x * 0.4; back.position.y = tm.y * 0.3;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);

    var api = {
      setText: function (t) { paint(t); },
      setLogo: function (src) { var im = new Image(); im.onload = function () { paint("", im); }; im.src = src; },
      setScroll: function (p) { scrollP = p; },
      ok: true
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!api._logo) paint(api._text || opts.text || "SILIGRAMS"); });
    var st = api.setText; api.setText = function (t) { api._text = t; api._logo = false; st(t); };
    var sl = api.setLogo; api.setLogo = function (s) { api._logo = true; sl(s); };
    return api;
  };
})();
