/* GreenGo 3D kit: procedural product models shared by both concepts.
   Needs global THREE (r149). Every model is built in code, so there are no model files to download. */
(function () {
  'use strict';
  var T = window.THREE, GG = {};

  GG.loadImg = function (src) {
    return new Promise(function (res) {
      var i = new Image();
      i.onload = function () { res(i); };
      i.onerror = function () { res(null); };
      i.src = src;
    });
  };

  /* Canvas texture that can be redrawn later (e.g. once fonts or the logo have loaded). */
  GG.canvasTex = function (w, h, draw) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var x = c.getContext('2d');
    var t = new T.CanvasTexture(c);
    t.encoding = T.sRGBEncoding;
    t.anisotropy = 8;
    t.redraw = function (extra) { x.clearRect(0, 0, w, h); draw(x, w, h, extra); t.needsUpdate = true; };
    t.redraw();
    return t;
  };

  /* Soft studio environment for reflections, generated on the fly. */
  GG.makeEnv = function (renderer, opt) {
    var s = new T.Scene();
    var geo = new T.SphereGeometry(20, 32, 16);
    var top = new T.Color(opt.top), bot = new T.Color(opt.bottom), col = [], pos = geo.attributes.position;
    for (var i = 0; i < pos.count; i++) {
      var k = (pos.getY(i) / 20 + 1) / 2, c = bot.clone().lerp(top, k);
      col.push(c.r, c.g, c.b);
    }
    geo.setAttribute('color', new T.Float32BufferAttribute(col, 3));
    s.add(new T.Mesh(geo, new T.MeshBasicMaterial({ vertexColors: true, side: T.BackSide })));
    (opt.panels || []).forEach(function (p) {
      var m = new T.Mesh(new T.PlaneGeometry(p.w, p.h),
        new T.MeshBasicMaterial({ color: new T.Color(p.color).multiplyScalar(p.i || 1), side: T.DoubleSide }));
      m.position.set(p.pos[0], p.pos[1], p.pos[2]);
      m.lookAt(0, 0, 0);
      s.add(m);
    });
    var pm = new T.PMREMGenerator(renderer);
    var tex = pm.fromScene(s, 0.035).texture;
    pm.dispose();
    return tex;
  };

  /* Coffee bean: squashed sphere with an S-shaped crease. */
  GG.beanGeometry = function () {
    var g = new T.SphereGeometry(1, 26, 16), p = g.attributes.position;
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      var X = x * 0.62, Y = y * 0.46, Z = z;
      if (y > 0) {
        var c = 0.1 * Math.sin(z * 2.6), d = (x - c) / 0.17;
        Y -= 0.3 * Math.exp(-d * d) * Math.sqrt(Math.max(0, 1 - z * z * 0.9));
        Y *= 0.78;
      }
      p.setXYZ(i, X, Y, Z);
    }
    g.computeVertexNormals();
    return g;
  };

  /* Latte art for the top of the cup. */
  GG.latteTexture = function (base, foam) {
    return GG.canvasTex(512, 512, function (x, w, h) {
      var g = x.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 2);
      g.addColorStop(0, base || '#c98f5a'); g.addColorStop(1, '#8a5630');
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      x.fillStyle = foam || '#fff6e6';
      x.save(); x.translate(w / 2, h / 2 + 30);
      for (var i = 0; i < 5; i++) {
        var s = 1 - i * 0.16;
        x.beginPath();
        x.moveTo(0, 90 * s - i * 44);
        x.bezierCurveTo(-150 * s, 10 * s - i * 44, -110 * s, -110 * s - i * 44, 0, -40 * s - i * 44);
        x.bezierCurveTo(110 * s, -110 * s - i * 44, 150 * s, 10 * s - i * 44, 0, 90 * s - i * 44);
        x.globalAlpha = 0.92; x.fill();
        if (i < 4) {
          x.globalCompositeOperation = 'destination-out';
          x.beginPath(); x.ellipse(0, -8 * s - i * 44, 70 * s, 34 * s, 0, 0, Math.PI * 2); x.globalAlpha = 0.55; x.fill();
          x.globalCompositeOperation = 'source-over';
        }
      }
      x.restore();
      x.globalCompositeOperation = 'destination-over';
      x.fillStyle = base || '#c98f5a'; x.fillRect(0, 0, w, h);
      x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    });
  };

  /* Paper cup. mats: { body, rim, inside, coffee } */
  GG.paperCup = function (mats) {
    var g = new T.Group(), rT = 0.95, rB = 0.68, H = 2.35;
    var body = new T.Mesh(new T.CylinderGeometry(rT, rB, H, 72, 1, true, Math.PI), mats.body);
    var inner = new T.Mesh(new T.CylinderGeometry(rT - 0.02, rB - 0.02, H, 48, 1, true), mats.inside);
    var bottom = new T.Mesh(new T.CircleGeometry(rB, 48), mats.inside);
    bottom.rotation.x = Math.PI / 2; bottom.position.y = -H / 2 + 0.01;
    var rim = new T.Mesh(new T.TorusGeometry(rT, 0.055, 14, 72), mats.rim);
    rim.rotation.x = Math.PI / 2; rim.position.y = H / 2;
    var coffee = new T.Mesh(new T.CircleGeometry(rT - 0.05, 56), mats.coffee);
    coffee.rotation.x = -Math.PI / 2; coffee.position.y = H / 2 - 0.14;
    g.add(body, inner, bottom, rim, coffee);
    g.userData = { body: body, coffee: coffee, rim: rim };
    return g;
  };

  /* Clear to-go cup with dome lid and straw. mats: { plastic, liquid, straw, label } */
  GG.domeCup = function (mats) {
    var g = new T.Group(), rT = 0.92, rB = 0.66, H = 2.3;
    var liquid = new T.Mesh(new T.CylinderGeometry(rT - 0.07, rB - 0.05, H - 0.3, 48), mats.liquid);
    liquid.position.y = -0.12;
    var shell = new T.Mesh(new T.CylinderGeometry(rT, rB, H, 56, 1, true), mats.plastic);
    var dome = new T.Mesh(new T.SphereGeometry(rT + 0.02, 40, 18, 0, Math.PI * 2, 0, Math.PI / 2), mats.plastic);
    dome.position.y = H / 2; dome.scale.y = 0.62;
    var ring = new T.Mesh(new T.TorusGeometry(rT + 0.02, 0.035, 10, 56), mats.plastic);
    ring.rotation.x = Math.PI / 2; ring.position.y = H / 2;
    var straw = new T.Mesh(new T.CylinderGeometry(0.065, 0.065, 3.5, 16), mats.straw);
    straw.position.set(0.12, 0.75, 0); straw.rotation.z = -0.13;
    g.add(liquid, straw, shell, dome, ring);
    if (mats.label) {
      var label = new T.Mesh(new T.CylinderGeometry(rT + 0.012, rB + 0.012, H, 56, 1, true, Math.PI), mats.label);
      g.add(label);
    }
    g.userData = { liquid: liquid, straw: straw };
    return g;
  };

  /* Matcha tin. mats: { label, metal, powder } */
  GG.tin = function (mats) {
    var g = new T.Group(), R = 0.8, H = 1.5;
    var body = new T.Mesh(new T.CylinderGeometry(R, R, H, 72, 1, true, Math.PI), mats.label);
    var base = new T.Mesh(new T.CylinderGeometry(R, R, 0.04, 56), mats.metal); base.position.y = -H / 2;
    var powder = new T.Mesh(new T.CircleGeometry(R - 0.03, 56), mats.powder);
    powder.rotation.x = -Math.PI / 2; powder.position.y = H / 2 - 0.1;
    var lip = new T.Mesh(new T.TorusGeometry(R, 0.02, 8, 64), mats.metal);
    lip.rotation.x = Math.PI / 2; lip.position.y = H / 2;
    var lid = new T.Group();
    var lidSide = new T.Mesh(new T.CylinderGeometry(R + 0.035, R + 0.035, 0.34, 72), mats.metal);
    lid.add(lidSide); lid.position.y = H / 2 + 0.06;
    g.add(body, base, powder, lip, lid);
    g.userData = { lid: lid, body: body };
    return g;
  };

  /* Coffee bag with a pinched, crimped top. mats: { front, side } */
  GG.bag = function (mats) {
    var W = 1.5, H = 2.3, Dp = 0.62;
    var geo = new T.BoxGeometry(W, H, Dp, 12, 18, 6), p = geo.attributes.position;
    function ss(a, b, v) { var t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); }
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), y = p.getY(i), z = p.getZ(i), t = (y + H / 2) / H;
      var pinch = ss(0.74, 0.93, t);
      var belly = Math.sin(Math.PI * Math.min(1, t / 0.86)) * (1 - Math.pow(x / (W / 2), 2) * 0.55);
      z *= (1 + 0.32 * belly) * (1 - pinch * 0.95);
      x *= 1 + 0.05 * pinch - 0.03 * (1 - ss(0, 0.12, t));
      if (t > 0.93) z += Math.sin(x * 26) * 0.006;
      p.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    var m = [mats.side, mats.side, mats.side, mats.side, mats.front, mats.back || mats.side];
    return new T.Mesh(geo, m);
  };

  /* Matcha bowl (chawan) + liquid. mats: { clay, liquid } */
  GG.bowl = function (mats) {
    var g = new T.Group();
    var pts = [[0, 0], [0.48, 0], [0.56, 0.05], [0.6, 0.16], [0.9, 0.42], [1.04, 0.74], [1.07, 0.98], [1.03, 1.0],
      [0.99, 0.97], [0.96, 0.74], [0.82, 0.46], [0.5, 0.2], [0, 0.17]].map(function (a) { return new T.Vector2(a[0], a[1]); });
    var bowl = new T.Mesh(new T.LatheGeometry(pts, 72), mats.clay);
    var liquid = new T.Mesh(new T.CircleGeometry(0.975, 64), mats.liquid);
    liquid.rotation.x = -Math.PI / 2; liquid.position.y = 0.78;
    g.add(bowl, liquid);
    g.userData = { liquid: liquid };
    return g;
  };

  /* Bamboo whisk (chasen). */
  GG.whisk = function (mat) {
    var g = new T.Group();
    var handle = new T.Mesh(new T.CylinderGeometry(0.12, 0.13, 0.95, 20), mat); handle.position.y = 0.95;
    var band = new T.Mesh(new T.TorusGeometry(0.135, 0.022, 8, 24), mat); band.rotation.x = Math.PI / 2; band.position.y = 0.52;
    g.add(handle, band);
    var tine = new T.CylinderGeometry(0.012, 0.02, 0.62, 5);
    tine.translate(0, -0.31, 0);
    for (var ring = 0; ring < 2; ring++) {
      var n = ring ? 16 : 30;
      for (var i = 0; i < n; i++) {
        var a = i / n * Math.PI * 2, m = new T.Mesh(tine, mat);
        m.position.set(Math.cos(a) * (ring ? 0.05 : 0.11), 0.5, Math.sin(a) * (ring ? 0.05 : 0.11));
        m.rotation.order = 'YXZ'; m.rotation.y = -a; m.rotation.z = (ring ? 0.1 : 0.42);
        g.add(m);
      }
    }
    return g;
  };

  /* Wobbly liquid blob. Call mesh.userData.update(time, amplitude) every frame. */
  GG.blob = function (mat, seg) {
    var geo = new T.SphereGeometry(1, seg || 44, (seg || 44) * 0.66 | 0);
    var base = geo.attributes.position.array.slice(), p = geo.attributes.position;
    var m = new T.Mesh(geo, mat);
    m.userData.update = function (t, amp) {
      for (var i = 0; i < p.count; i++) {
        var x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2];
        var n = Math.sin(x * 2.3 + t * 1.3) * Math.sin(y * 2.1 + t * 1.7) + Math.sin(z * 2.7 - t * 1.1) * Math.sin(x * 1.3 + y * 1.9 + t * 0.6);
        var s = 1 + n * amp * 0.5;
        p.setXYZ(i, x * s, y * s, z * s);
      }
      p.needsUpdate = true;
      geo.computeVertexNormals();
    };
    return m;
  };

  window.GG3D = GG;
})();
