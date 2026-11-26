/* CAND homepage concept: canvas can renderer, UV print reveal, logo visualiser, planner, enquiry flow. No libraries. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };

  /* ---------------- Intro ---------------- */
  var intro = $('#intro');
  var seen = false;
  try { seen = sessionStorage.getItem('candIntro') === '1'; } catch (e) {}
  function endIntro() {
    if (!intro || intro.classList.contains('is-gone')) return;
    intro.classList.add('is-out');
    setTimeout(function () { intro.classList.add('is-gone'); }, 750);
    try { sessionStorage.setItem('candIntro', '1'); } catch (e) {}
  }
  if (RM || seen) { intro.classList.add('is-gone'); }
  else { setTimeout(endIntro, 1050); intro.addEventListener('click', endIntro); }

  /* ---------------- Can geometry (330ml sleek: ~57.5 mm Ø × 146 mm) ---------------- */
  var CAN_D = 57.5, CAN_H = 146, PRINT_MM = 50;
  var R_MM = CAN_D / 2;
  var brushed = (function () {
    var c = document.createElement('canvas'); c.width = 4; c.height = 512;
    var x = c.getContext('2d');
    for (var y = 0; y < 512; y++) { var v = Math.floor(120 + Math.random() * 120); x.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; x.fillRect(0, y, 4, 1); }
    return c;
  })();

  function metal(ctx, x0, x1, dark) {
    var g = ctx.createLinearGradient(x0, 0, x1, 0);
    var s = dark ? [[0, '#3d4044'], [.1, '#7d8186'], [.24, '#c9ccd0'], [.3, '#e4e6e8'], [.4, '#a5a9ad'], [.62, '#8a8e93'], [.76, '#b9bcc0'], [.9, '#6b6f74'], [1, '#34373a']]
                  : [[0, '#70747a'], [.08, '#a8acb1'], [.2, '#e6e8ea'], [.28, '#fbfbfc'], [.37, '#d3d6d9'], [.56, '#b1b5b9'], [.7, '#dadde0'], [.8, '#c0c3c7'], [.93, '#8c9095'], [1, '#62666b']];
    s.forEach(function (st) { g.addColorStop(st[0], st[1]); });
    return g;
  }

  /**
   * Draw a can. o: {x,y,w (diameter px), angle (rad), art (canvas|null), artScale (0..1 of 50mm), print (0..1 reveal), uv (bool), lamp (0..1|null)}
   */
  function drawCan(ctx, o) {
    var w = o.w, h = w * CAN_H / CAN_D, x = o.x, y = o.y, cx = x + w / 2;
    var ry = w * .085;               // ellipse depth (slight top-down view)
    var neckH = h * .055, topY = y + ry, bodyTop = y + ry + neckH, bodyBot = y + h - ry * .6;
    var rimW = w * .86;
    ctx.save();
    // shadow
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,.18)';
    ctx.beginPath(); ctx.ellipse(cx, bodyBot + ry * .55, w * .52, ry * .7, 0, 0, Math.PI * 2); ctx.filter = 'blur(' + Math.max(2, w * .04) + 'px)'; ctx.fill();
    ctx.restore();

    // silhouette path (body + neck)
    var path = new Path2D();
    path.moveTo(cx - rimW / 2, topY);
    path.bezierCurveTo(cx - rimW / 2, topY + neckH * .5, cx - w / 2, bodyTop - neckH * .35, cx - w / 2, bodyTop);
    path.lineTo(cx - w / 2, bodyBot - ry * .4);
    path.quadraticCurveTo(cx - w / 2, bodyBot + ry * .1, cx - w * .45, bodyBot + ry * .25);
    path.ellipse(cx, bodyBot + ry * .25, w * .45, ry * .55, 0, Math.PI, 0, true);
    path.quadraticCurveTo(cx + w / 2, bodyBot + ry * .1, cx + w / 2, bodyBot - ry * .4);
    path.lineTo(cx + w / 2, bodyTop);
    path.bezierCurveTo(cx + w / 2, bodyTop - neckH * .35, cx + rimW / 2, topY + neckH * .5, cx + rimW / 2, topY);
    path.closePath();

    ctx.fillStyle = metal(ctx, x, x + w);
    ctx.fill(path);
    ctx.save();
    ctx.clip(path);
    // brushed texture
    ctx.globalAlpha = .07; ctx.globalCompositeOperation = 'overlay';
    ctx.drawImage(brushed, x, y, w, h);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    // neck shading band
    var ng = ctx.createLinearGradient(0, topY, 0, bodyTop + 2);
    ng.addColorStop(0, 'rgba(0,0,0,.18)'); ng.addColorStop(.6, 'rgba(255,255,255,.15)'); ng.addColorStop(1, 'rgba(0,0,0,.12)');
    ctx.fillStyle = ng; ctx.fillRect(x, topY, w, bodyTop - topY + 2);
    // bottom shade
    var bg = ctx.createLinearGradient(0, bodyBot - ry * 1.4, 0, bodyBot + ry);
    bg.addColorStop(0, 'rgba(0,0,0,0)'); bg.addColorStop(1, 'rgba(0,0,0,.28)');
    ctx.fillStyle = bg; ctx.fillRect(x, bodyBot - ry * 1.4, w, ry * 2.6);

    // printed artwork wrapped around the cylinder
    if (o.art && (o.print == null || o.print > 0)) {
      var art = o.art, scale = o.artScale || 1;
      var A = (PRINT_MM * scale / 2) / R_MM;                     // half angle of the 50mm print area
      var bodyH = bodyBot - bodyTop;
      var artH = (PRINT_MM * scale / CAN_H) * h;                  // print height in px
      var artCY = bodyTop + bodyH * (o.artY || .48);
      var ay = artCY - artH / 2;
      var revealH = o.print == null ? artH : artH * o.print;
      var half = w / 2, aw = art.width, ah = art.height;
      for (var i = 0; i < w; i++) {
        var nx = (i + .5 - half) / half;
        if (nx <= -1 || nx >= 1) continue;
        var th = Math.asin(nx) - (o.angle || 0);
        th = Math.atan2(Math.sin(th), Math.cos(th));
        if (th < -A || th > A) continue;
        var tx = Math.floor((th + A) / (2 * A) * aw);
        var lit = Math.sqrt(1 - nx * nx);
        ctx.globalAlpha = .35 + .65 * lit;
        if (revealH > 0) ctx.drawImage(art, tx, 0, 1, ah * (revealH / artH), x + i, ay, 1.4, revealH);
      }
      ctx.globalAlpha = 1;
      // UV lamp glow
      if (o.lamp != null && o.lamp > 0 && o.lamp < 1) {
        var ly = ay + artH * o.lamp;
        var lg = ctx.createLinearGradient(0, ly - 26, 0, ly + 26);
        lg.addColorStop(0, 'rgba(124,92,255,0)'); lg.addColorStop(.5, 'rgba(124,92,255,.55)'); lg.addColorStop(1, 'rgba(124,92,255,0)');
        ctx.fillStyle = lg; ctx.fillRect(x, ly - 26, w, 52);
        ctx.fillStyle = 'rgba(200,190,255,.95)'; ctx.fillRect(x, ly - 1, w, 2);
      }
    }
    // specular highlights over the print
    var hg = ctx.createLinearGradient(x, 0, x + w, 0);
    hg.addColorStop(0, 'rgba(0,0,0,.25)'); hg.addColorStop(.14, 'rgba(0,0,0,0)');
    var hl = clamp(o.hl == null ? .29 : o.hl, .2, .62);
    hg.addColorStop(hl - .05, 'rgba(255,255,255,0)'); hg.addColorStop(hl, 'rgba(255,255,255,.42)'); hg.addColorStop(hl + .05, 'rgba(255,255,255,0)');
    hg.addColorStop(.72, 'rgba(255,255,255,0)'); hg.addColorStop(.76, 'rgba(255,255,255,.18)'); hg.addColorStop(.8, 'rgba(255,255,255,0)');
    hg.addColorStop(.88, 'rgba(0,0,0,0)'); hg.addColorStop(1, 'rgba(0,0,0,.3)');
    ctx.fillStyle = hg; ctx.fillRect(x, y, w, h);
    ctx.restore();

    // lid
    ctx.beginPath(); ctx.ellipse(cx, topY, rimW / 2, ry * .92, 0, 0, Math.PI * 2);
    var lid = ctx.createLinearGradient(cx - rimW / 2, topY - ry, cx + rimW / 2, topY + ry);
    lid.addColorStop(0, '#f4f5f6'); lid.addColorStop(.5, '#b9bdc1'); lid.addColorStop(1, '#e8eaec');
    ctx.fillStyle = lid; ctx.fill();
    ctx.lineWidth = Math.max(1, w * .012); ctx.strokeStyle = 'rgba(80,84,90,.55)'; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, topY + ry * .08, rimW * .41, ry * .7, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(90,94,100,.35)'; ctx.lineWidth = Math.max(1, w * .008); ctx.stroke();
    // tab
    ctx.beginPath(); ctx.ellipse(cx, topY + ry * .05, rimW * .12, ry * .3, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(150,154,160,.5)'; ctx.fill();
    ctx.restore();
    return { h: h };
  }

  /* ---------------- Artwork textures ---------------- */
  function artCanvas(size) { var c = document.createElement('canvas'); c.width = c.height = size || 512; return c; }
  function fitImage(img, padFrac) {
    var c = artCanvas(600), x = c.getContext('2d'), p = (padFrac || 0) * 600;
    var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    var s = Math.min((600 - p * 2) / iw, (600 - p * 2) / ih);
    x.drawImage(img, (600 - iw * s) / 2, (600 - ih * s) / 2, iw * s, ih * s);
    return c;
  }
  function textArt(l1, l2, style) {
    var c = artCanvas(600), x = c.getContext('2d');
    x.fillStyle = '#111'; x.textAlign = 'center'; x.textBaseline = 'middle';
    var fam = style === 'bold' ? '"Anton", Impact, sans-serif' : style === 'clean' ? '600 1px "Inter Tight", sans-serif' : 'italic 1px "Instrument Serif", Georgia, serif';
    var t1 = style === 'bold' ? (l1 || '').toUpperCase() : (l1 || '');
    function font(sz) { return style === 'bold' ? sz + 'px "Anton", Impact, sans-serif' : style === 'clean' ? '600 ' + sz + 'px "Inter Tight", sans-serif' : 'italic ' + sz + 'px "Instrument Serif", Georgia, serif'; }
    var sz = 240; x.font = font(sz);
    while (x.measureText(t1).width > 560 && sz > 30) { sz -= 6; x.font = font(sz); }
    var hasSub = !!(l2 && l2.trim());
    x.fillText(t1, 300, hasSub ? 300 - sz * .18 : 300);
    if (hasSub) {
      var s2 = Math.min(64, sz * .38);
      x.font = '500 ' + s2 + 'px "JetBrains Mono", monospace';
      if ('letterSpacing' in x) x.letterSpacing = (s2 * .18) + 'px';
      var t2 = l2.toUpperCase();
      while (x.measureText(t2).width > 540 && s2 > 14) { s2 -= 2; x.font = '500 ' + s2 + 'px "JetBrains Mono", monospace'; }
      x.fillText(t2, 300, 300 + sz * .42 + 10);
    }
    void fam;
    return c;
  }
  function boxArt(label) {
    var c = artCanvas(600), x = c.getContext('2d');
    x.strokeStyle = '#111'; x.lineWidth = 10; x.setLineDash([26, 18]);
    x.strokeRect(40, 150, 520, 300);
    x.setLineDash([]); x.fillStyle = '#111'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = '84px "Anton", Impact, sans-serif'; x.fillText(label, 300, 300);
    return c;
  }

  var logoImg = new Image(); logoImg.src = 'img/cand-logo.png';
  var ARTS = { cand: null, mono: null, launch: null, yours: null };
  function buildArts() {
    if (logoImg.complete && logoImg.naturalWidth) ARTS.cand = fitImage(logoImg, .02);
    ARTS.mono = textArt('Mia & Leo', '14 · 02 · 27', 'serif');
    ARTS.launch = textArt('Launch night', 'Sydney · 7pm', 'bold');
    ARTS.yours = boxArt('YOUR LOGO');
  }

  /* ---------------- Canvas helpers ---------------- */
  function onScreen(el, cb) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (es) { es.forEach(function (e) { cb(e.isIntersecting); }); }, { rootMargin: '100px' }).observe(el);
  }

  /* ---------------- Hero v3: one can on a display stage ---------------- */
  var hx = $('#top'), hero = $('#heroCan'), hctx = hero.getContext('2d'), panel = $('#hzPanel');
  var heroWords = $$('.hz__w'), hudNum = $('#hudNum'), hudBar = $('#hudBar');
  var sampleBtns = $$('[data-hs]');
  var CYCLE = 5200, SPIN = 900;
  var HERO_ORDER = ['cand', 'mono', 'launch'];
  var heroState = { cur: 0, prev: 0, tSwitch: -1e9, tEnter: Infinity, angle: 0, vel: 0, drag: false, visible: true, mx: 0, my: 0, tmx: 0, tmy: 0, dpr: 1, hover: false };
  var hOff = document.createElement('canvas'), hRefl = document.createElement('canvas');

  function heroResize() {
    var r = hero.getBoundingClientRect();
    heroState.dpr = Math.min(2, window.devicePixelRatio || 1);
    hero.width = Math.max(1, Math.round(r.width * heroState.dpr));
    hero.height = Math.max(1, Math.round(r.height * heroState.dpr));
  }
  function heroSet(i, manual) {
    if (i === heroState.cur && !manual) return;
    heroState.prev = heroState.cur; heroState.cur = i; heroState.tSwitch = performance.now();
    heroWords.forEach(function (w, k) { w.classList.toggle('is-on', k === i); });
    sampleBtns.forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === i)); b.style.setProperty('--p', '0%'); });
    hudNum.textContent = '0' + (i + 1) + ' / 03';
  }
  sampleBtns.forEach(function (b) { b.addEventListener('click', function () { if (+b.dataset.hs !== heroState.cur) heroSet(+b.dataset.hs, true); }); });

  function heroDraw(now) {
    var W = hero.width, H = hero.height, dpr = heroState.dpr;
    if (!W || !H) return;
    hctx.clearRect(0, 0, W, H);
    heroState.mx += (heroState.tmx - heroState.mx) * .07;
    heroState.my += (heroState.tmy - heroState.my) * .07;
    hx.style.setProperty('--mx', heroState.mx.toFixed(3));
    hx.style.setProperty('--my', heroState.my.toFixed(3));
    if (!RM) { panel.style.setProperty('--ry', (heroState.mx * 4).toFixed(2) + 'deg'); panel.style.setProperty('--rx', (heroState.my * -3).toFixed(2) + 'deg'); }

    var enterT = RM ? 1 : clamp((now - heroState.tEnter) / 1300, 0, 1);
    var since = now - heroState.tSwitch;
    if (!RM && enterT >= 1 && heroState.visible && !heroState.drag && !heroState.hover && since > CYCLE) heroSet((heroState.cur + 1) % 3);
    var cyc = clamp(since / CYCLE, 0, 1);
    hudBar.style.width = (cyc * 100) + '%';
    if (sampleBtns[heroState.cur]) sampleBtns[heroState.cur].style.setProperty('--p', (cyc * 100) + '%');

    // spin away the old print, then UV print the new one
    var sp = RM ? 1 : clamp(since / SPIN, 0, 1);
    var spin = heroState.prev === heroState.cur ? 0 : ease(sp) * Math.PI * 2;
    var art, pr;
    if (sp < .5 && heroState.prev !== heroState.cur) { art = ARTS[HERO_ORDER[heroState.prev]]; pr = 1; }
    else { art = ARTS[HERO_ORDER[heroState.cur]]; pr = RM ? 1 : clamp((since - SPIN * (heroState.prev === heroState.cur ? 0 : 1) - 150) / 1200, 0, 1); }
    if (sp >= .5 && sp < 1) pr = 0;

    if (!heroState.drag) {
      heroState.angle += heroState.vel; heroState.vel *= .94;
      if (Math.abs(heroState.vel) < .002) heroState.angle += ((RM ? 0 : Math.sin(now / 1900) * .3) - heroState.angle) * .03;
    }

    var ch = H * .54, cw = Math.min(W * .3, ch * CAN_D / CAN_H); ch = cw * CAN_H / CAN_D;
    var floor = H * .74;
    var pad = Math.ceil(cw * .14), ow = Math.ceil(cw + pad * 2), oh = Math.ceil(ch + pad * 2);
    if (hOff.width !== ow || hOff.height !== oh) { hOff.width = ow; hOff.height = oh; hRefl.width = ow; hRefl.height = oh; }
    var o = hOff.getContext('2d');
    o.clearRect(0, 0, ow, oh);
    drawCan(o, { x: pad, y: pad, w: cw, angle: heroState.angle + spin + heroState.mx * .35, art: art, artScale: HERO_ORDER[sp < .5 && heroState.prev !== heroState.cur ? heroState.prev : heroState.cur] === 'cand' ? .9 : 1, print: ease(pr), lamp: pr > 0 && pr < 1 ? pr : null, hl: .29 + heroState.mx * .1 });

    var e = ease(enterT);
    var canBottom = pad + ch;
    var x = W / 2 - ow / 2 + heroState.mx * 12 * dpr;
    var y = floor - canBottom + (1 - e) * H * .22 + Math.sin(now / 1400) * (RM ? 0 : 3 * dpr);

    // floor line
    var fg = hctx.createRadialGradient(W / 2, floor, 0, W / 2, floor, W * .42);
    fg.addColorStop(0, 'rgba(255,255,255,1)'); fg.addColorStop(1, 'rgba(255,255,255,0)');
    hctx.globalAlpha = e;
    hctx.fillStyle = fg; hctx.fillRect(0, floor - 1.5 * dpr, W, 3 * dpr);
    hctx.drawImage(hOff, x, y);
    // reflection
    var r = hRefl.getContext('2d');
    r.globalCompositeOperation = 'source-over'; r.clearRect(0, 0, ow, oh);
    r.save(); r.translate(0, oh); r.scale(1, -1); r.drawImage(hOff, 0, 0); r.restore();
    r.globalCompositeOperation = 'destination-in';
    var top = oh - canBottom;
    var rg = r.createLinearGradient(0, top, 0, top + ch * .4);
    rg.addColorStop(0, 'rgba(0,0,0,.3)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    r.fillStyle = rg; r.fillRect(0, 0, ow, oh);
    hctx.globalAlpha = e * e;
    hctx.drawImage(hRefl, x, floor - top + (floor - (y + canBottom)) * -1 + 2 * dpr);
    hctx.globalAlpha = 1;
  }
  // drag to spin; the pointer tilts the stage and moves the light
  (function () {
    var lx = 0;
    hero.addEventListener('pointerdown', function (e) { heroState.drag = true; lx = e.clientX; hero.setPointerCapture(e.pointerId); });
    hero.addEventListener('pointermove', function (e) { if (!heroState.drag) return; var dx = (e.clientX - lx) / 140; heroState.angle += dx; heroState.vel = dx; lx = e.clientX; });
    ['pointerup', 'pointercancel'].forEach(function (ev) { hero.addEventListener(ev, function () { heroState.drag = false; }); });
    var stage = $('.hz__stage');
    if (!RM) stage.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var rr = stage.getBoundingClientRect();
      heroState.tmx = clamp((e.clientX - rr.left) / rr.width * 2 - 1, -1, 1);
      heroState.tmy = clamp((e.clientY - rr.top) / rr.height * 2 - 1, -1, 1);
    });
    stage.addEventListener('pointerleave', function () { heroState.tmx = 0; heroState.tmy = 0; });
    $('.hz__tabs').addEventListener('pointerenter', function () { heroState.hover = true; });
    $('.hz__tabs').addEventListener('pointerleave', function () { heroState.hover = false; });
  })();
  onScreen(hero, function (v) { heroState.visible = v; });
  window.addEventListener('resize', heroResize);
  heroResize();
  function countUp() {
    $$('[data-count]', hx).forEach(function (b) {
      var to = +b.dataset.count, t0 = performance.now();
      if (RM) return;
      (function tick(n) { var p = clamp((n - t0) / 1200, 0, 1); b.textContent = Math.round(to * ease(p)); if (p < 1) requestAnimationFrame(tick); })(t0);
    });
  }
  function heroEnter() {
    if (hx.classList.contains('is-ready')) return;
    hx.classList.add('is-ready');
    heroState.tEnter = performance.now() + 350;
    heroState.tSwitch = heroState.tEnter + 500;
    heroState.prev = heroState.cur;
    setTimeout(countUp, 600);
  }
  if (RM || seen) heroEnter(); else setTimeout(heroEnter, 1000);

  /* ---------------- Magnetic buttons ---------------- */
  if (!RM && window.matchMedia('(hover: hover)').matches) {
    $$('.magnet').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        var k = el.classList.contains('badge') ? .3 : .2;
        el.style.transform = 'translate(' + dx * k + 'px,' + dy * k + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------------- Story (pinned scroll) ---------------- */
  var story = $('#story'), sc = $('#storyCan'), sctx = sc.getContext('2d');
  var steps = $$('#storySteps li'), sNum = $('#storyNum'), sUnit = $('#storyUnit');
  var sprite = null;
  function makeSprite() {
    var c = document.createElement('canvas'); c.width = 160; c.height = 440;
    drawCan(c.getContext('2d'), { x: 10, y: 6, w: 140, angle: .25, art: ARTS.yours });
    sprite = c;
  }
  var storyP = RM ? .6 : 0, storyVisible = false;
  function storyProgress() {
    var r = story.getBoundingClientRect(), total = r.height - window.innerHeight;
    return total > 0 ? clamp(-r.top / total, 0, 1) : 0;
  }
  function fmt(n) { return n >= 100000 ? '100k+' : Math.round(n).toLocaleString('en-AU'); }
  function storyDraw(now) {
    var p = RM ? .6 : storyP;
    var W = sc.width, H = sc.height;
    sctx.clearRect(0, 0, W, H);
    var st = p < .22 ? 0 : p < .45 ? 1 : p < .72 ? 2 : 3;
    steps.forEach(function (li, i) { li.classList.toggle('is-on', i === st); });
    var bigW = 250, bigH = bigW * CAN_H / CAN_D;
    var spin = (now / 2600) % (Math.PI * 2);
    if (p < .45) {
      var pr = seg(p, .25, .42);
      drawCan(sctx, { x: (W - bigW) / 2, y: (H - bigH) / 2 - 10, w: bigW, angle: st === 0 ? Math.sin(now / 1200) * .6 : .25 * (1 - pr) + .25 * pr, art: ARTS.yours, print: pr, lamp: pr > 0 && pr < 1 ? pr : null });
      sNum.textContent = '1'; sUnit.textContent = st === 0 ? 'blank can' : 'printed can';
      return;
    }
    if (!sprite) makeSprite();
    var asp = sprite.height / sprite.width;
    if (p < .72) {
      var t = ease(seg(p, .45, .64));
      var cols = 6, rows = 4, cw = 66, gap = 12, rowH = cw * asp * .97;
      var gw = cols * cw + (cols - 1) * gap, gh = rows * rowH;
      var ox = (W - gw) / 2, oy = (H - gh) / 2;
      // carton tray
      sctx.globalAlpha = t;
      sctx.fillStyle = 'rgba(17,17,18,.06)';
      roundRect(sctx, ox - 24, oy - 18, gw + 48, gh + 30, 18); sctx.fill();
      sctx.globalAlpha = 1;
      var shown = 0;
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        var k = r * cols + c, d = clamp(t * 1.6 - k / 40, 0, 1);
        if (d <= 0 && k > 0) continue;
        shown++;
        var tx = ox + c * (cw + gap), ty = oy + r * rowH;
        var fx = (W - bigW) / 2, fy = (H - bigH) / 2 - 10;
        var e2 = ease(k === 0 ? t : d);
        var wv = lerp(bigW, cw, e2), x = lerp(fx, tx, e2), y = lerp(fy, ty, e2);
        sctx.globalAlpha = k === 0 ? 1 : d;
        sctx.drawImage(sprite, x, y, wv, wv * asp);
      }
      sctx.globalAlpha = 1;
      sNum.textContent = String(Math.max(1, Math.round(lerp(1, 24, t)))); sUnit.textContent = t > .98 ? 'cans · 1 carton' : 'cans';
      return;
    }
    // zoom out to thousands
    var z = ease(seg(p, .72, .97));
    var cols2 = Math.round(lerp(6, 30, z)), rows2 = Math.round(lerp(4, 9, z));
    var cw2 = (W - 80) / (cols2 * 1.16), gap2 = cw2 * .16;
    var cw2b = Math.min(cw2, (H - 60) / (rows2 * asp * .97)); cw2 = cw2b; gap2 = cw2 * .16;
    var gw2 = cols2 * cw2 + (cols2 - 1) * gap2, rowH = cw2 * asp * .97;
    var gh2 = rows2 * rowH;
    var ox2 = (W - gw2) / 2, oy2 = (H - gh2) / 2;
    for (var r2 = 0; r2 < rows2; r2++) for (var c2 = 0; c2 < cols2; c2++) {
      sctx.drawImage(sprite, ox2 + c2 * (cw2 + gap2), oy2 + r2 * rowH, cw2, cw2 * asp);
    }
    var n = 24 * Math.pow(100000 / 24, z);
    sNum.textContent = fmt(n); sUnit.textContent = z > .98 ? 'cans · capacity' : 'cans';
  }
  function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  onScreen(sc, function (v) { storyVisible = v; });

  /* ---------------- Visualiser ---------------- */
  var tc = $('#tryCan'), tctx = tc.getContext('2d'), stage = $('#tryStage');
  var tryS = { angle: 0, vel: 0, drag: false, art: null, mode: 'upload', font: 'serif', visible: false, upload: null, aspect: 1, dirty: true };
  var sizeIn = $('#size'), sizeOut = $('#sizeOut');
  function tryArt() {
    if (tryS.mode === 'type') return textArt($('#typeText').value || 'Your name', $('#typeSub').value, tryS.font);
    return tryS.upload || ARTS.yours;
  }
  function refreshTry() { tryS.art = tryArt(); updateSize(); tryS.dirty = true; }
  function updateSize() {
    var s = sizeIn.value / 100, mm = PRINT_MM * s, a = tryS.mode === 'upload' && tryS.upload ? tryS.aspect : 1.6;
    var wmm = a >= 1 ? mm : mm * a, hmm = a >= 1 ? mm / a : mm;
    sizeOut.textContent = '≈ ' + Math.round(wmm) + ' × ' + Math.round(hmm) + ' mm';
    tryS.dirty = true;
    return { w: wmm, h: hmm };
  }
  function tryDraw() {
    if (!tryS.dirty && !tryS.drag && Math.abs(tryS.vel) < .0005) return;
    tryS.dirty = false;
    if (!tryS.drag) { tryS.angle += tryS.vel; tryS.vel *= .93; }
    var W = tc.width, H = tc.height, cw = W * .56;
    tctx.clearRect(0, 0, W, H);
    drawCan(tctx, { x: (W - cw) / 2, y: 24, w: cw, angle: tryS.angle, art: tryS.art, artScale: sizeIn.value / 100 });
  }
  (function () {
    var lx = 0, moved = false;
    tc.addEventListener('pointerdown', function (e) { tryS.drag = true; moved = false; lx = e.clientX; tc.setPointerCapture(e.pointerId); });
    tc.addEventListener('pointermove', function (e) { if (!tryS.drag) return; var dx = (e.clientX - lx) / 160; if (Math.abs(dx) > .01) moved = true; tryS.angle += dx; tryS.vel = dx; lx = e.clientX; tryS.dirty = true; });
    ['pointerup', 'pointercancel'].forEach(function (ev) { tc.addEventListener(ev, function () { tryS.drag = false; if (moved) $('#tryHint').style.opacity = 0; }); });
    tc.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); tryS.vel = (e.key === 'ArrowLeft' ? -1 : 1) * .09; tryS.dirty = true; }
    });
  })();
  onScreen(tc, function (v) { tryS.visible = v; tryS.dirty = true; });

  $$('.try__panel .seg:first-child button').forEach(function (b) {
    b.addEventListener('click', function () {
      tryS.mode = b.dataset.mode;
      $$('.try__panel .seg:first-child button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('.try__mode').forEach(function (m) { m.hidden = m.dataset.panel !== tryS.mode; });
      refreshTry();
    });
  });
  $$('[data-font]').forEach(function (b) {
    b.addEventListener('click', function () {
      tryS.font = b.dataset.font;
      $$('[data-font]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      refreshTry();
    });
  });
  ['#typeText', '#typeSub'].forEach(function (s) { $(s).addEventListener('input', refreshTry); });
  sizeIn.addEventListener('input', function () { updateSize(); });
  $$('.try__scenes button').forEach(function (b) {
    b.addEventListener('click', function () {
      stage.dataset.scene = b.dataset.scene;
      $$('.try__scenes button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });

  // upload + honest artwork checks against CAND's published guide
  var drop = $('#drop'), file = $('#file'), checks = $('#checks');
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-over'); }); });
  drop.addEventListener('drop', function (e) { var f = e.dataTransfer && e.dataTransfer.files[0]; if (f) load(f); });
  file.addEventListener('change', function () { if (file.files[0]) load(file.files[0]); });
  function li(state, b, s) { return '<li class="is-' + state + '"><b>' + b + '</b><span>' + s + '</span></li>'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function load(f) {
    if (!/^image\//.test(f.type)) { checks.innerHTML = li('warn', 'That file isn\'t an image', 'Try a PNG, JPG or SVG of your logo.'); return; }
    var url = URL.createObjectURL(f), img = new Image();
    img.onload = function () {
      var isSvg = /svg/.test(f.type);
      var iw = img.naturalWidth || 600, ih = img.naturalHeight || 600;
      // sample alpha + trim transparent padding
      var cv = document.createElement('canvas'), m = Math.min(1, 1400 / Math.max(iw, ih));
      cv.width = Math.max(1, Math.round(iw * m)); cv.height = Math.max(1, Math.round(ih * m));
      var cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, cv.width, cv.height);
      var transparent = false, bb = null;
      try {
        var d = cx.getImageData(0, 0, cv.width, cv.height).data, minX = cv.width, minY = cv.height, maxX = 0, maxY = 0;
        for (var y = 0; y < cv.height; y += 2) for (var x = 0; x < cv.width; x += 2) {
          var a = d[(y * cv.width + x) * 4 + 3];
          if (a < 250) transparent = true;
          if (a > 12) { if (x < minX) minX = x; if (y < minY) minY = y; if (x > maxX) maxX = x; if (y > maxY) maxY = y; }
        }
        if (maxX > minX && maxY > minY) bb = [minX, minY, maxX - minX + 2, maxY - minY + 2];
      } catch (e) {}
      var src = cv;
      if (bb && transparent) { var t = document.createElement('canvas'); t.width = bb[2]; t.height = bb[3]; t.getContext('2d').drawImage(cv, -bb[0], -bb[1]); src = t; }
      tryS.aspect = src.width / src.height;
      tryS.upload = fitImage(src, 0);
      var dims = updateSize();
      var out = '';
      out += transparent ? li('ok', 'Transparent background', 'No white box. Nice.') : li('warn', 'Background isn\'t transparent', 'This would print as a box. Export a PNG with a transparent background.');
      out += isSvg ? li('ok', 'Vector file', 'Scales cleanly. CAND may still ask for a PNG.') : (iw >= 2000 ? li('ok', iw + ' px wide', 'Meets the 2000 px guide.') : li('warn', 'Only ' + iw + ' px wide', 'Aim for at least 2000 px wide, or 300 dpi.'));
      out += Math.min(dims.w, dims.h) < 12 ? li('warn', 'Prints about ' + Math.round(dims.w) + ' × ' + Math.round(dims.h) + ' mm', 'Very wide or tall logos print small in the 50 × 50 mm area. A stacked version may read better.')
                                            : li('ok', 'Prints about ' + Math.round(dims.w) + ' × ' + Math.round(dims.h) + ' mm', 'Within the 50 × 50 mm front print area.');
      checks.innerHTML = out;
      $('#fMsg').value = $('#fMsg').value || ('I previewed my logo (' + esc(f.name) + ') on the CAND website. ');
      refreshTry();
      tryS.vel = .12;
      URL.revokeObjectURL(url);
    };
    img.onerror = function () { checks.innerHTML = li('warn', 'We couldn\'t read that file', 'Try exporting it again as a PNG.'); };
    img.src = url;
  }
  $('#tryEnquire').addEventListener('click', function () {
    if (tryS.mode === 'type') { var v = $('#typeText').value; if (v && !$('#fBiz').value) $('#fBiz').value = v; }
  });

  /* ---------------- Mini cans for pathways + success ---------------- */
  function drawMini(c) {
    var x = c.getContext('2d'), W = c.width, H = c.height;
    x.clearRect(0, 0, W, H);
    var art = c.dataset.art === 'agency' ? boxArt('CLIENT LOGO') : textArt('Your company', 'Annual summit', 'clean');
    var n = 5, cw = 92, gap = 20, total = n * cw + (n - 1) * gap, ox = (W - total) / 2;
    for (var i = 0; i < n; i++) {
      var off = Math.abs(i - 2);
      drawCan(x, { x: ox + i * (cw + gap), y: 40 + off * 26, w: cw, angle: (i - 2) * .18, art: art });
    }
  }

  /* ---------------- Pathway tabs ---------------- */
  var tabs = $$('.paths__tabs [role="tab"]');
  function selectTab(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      var p = document.getElementById(x.getAttribute('aria-controls')); p.hidden = !on;
      if (on) { var m = $('canvas.mini', p); if (m) drawMini(m); }
    });
    if (focus) t.focus();
    t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: RM ? 'auto' : 'smooth' });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); selectTab(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });
  $$('[data-type]').forEach(function (b) {
    b.addEventListener('click', function () {
      var r = $('input[name="type"][value="' + b.dataset.type + '"]'); if (r) { r.checked = true; summary(); }
    });
  });

  /* ---------------- Events rail ---------------- */
  var rail = $('#rail'), railBar = $('#railBar');
  function railUpd() {
    var max = rail.scrollWidth - rail.clientWidth, f = max > 0 ? rail.scrollLeft / max : 0;
    var vis = rail.clientWidth / rail.scrollWidth;
    railBar.style.width = (vis * 100) + '%';
    railBar.style.transform = 'translateX(' + (f * (1 / vis - 1) * 100) + '%)';
  }
  rail.addEventListener('scroll', railUpd, { passive: true }); window.addEventListener('resize', railUpd); railUpd();
  function railGo(d) { var s = $('.shot', rail); rail.scrollBy({ left: d * (s ? s.offsetWidth + 16 : 400), behavior: RM ? 'auto' : 'smooth' }); }
  $('#evPrev').addEventListener('click', function () { railGo(-1); });
  $('#evNext').addEventListener('click', function () { railGo(1); });
  rail.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); railGo(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); railGo(-1); } });
  (function () { // mouse drag
    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    window.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) { moved = true; rail.classList.add('is-drag'); } rail.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', function () { if (!down) return; down = false; rail.classList.remove('is-drag'); });
    rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
  })();

  /* ---------------- How it works progress ---------------- */
  var howList = $('.how__list'), howSteps = $$('.how__step');
  function howUpd() {
    var r = howList.getBoundingClientRect(), vh = window.innerHeight;
    var p = clamp((vh * .8 - r.top) / (vh * .55), 0, 1);
    howList.style.setProperty('--how', (p * 100) + '%');
    howSteps.forEach(function (s, i) { s.classList.toggle('is-on', p >= i / howSteps.length + .02 || RM); });
  }

  /* ---------------- Planner ---------------- */
  var cartons = 1, qOut = $('#qOut'), qRange = $('#qRange'), cartonsEl = $('#cartons'), priceEl = $('#price');
  var pDate = $('#pDate'), timing = $('#timing');
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var iso = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  pDate.min = iso(today); $('#fDate').min = iso(today);
  var nice = function (d) { return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' }); };
  var money = function (n) { return '$' + n.toLocaleString('en-AU', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); };
  function setCartons(c) {
    cartons = clamp(c, 1, 42);
    var n = cartons * 24;
    qOut.textContent = n.toLocaleString('en-AU');
    qRange.value = cartons;
    $$('.chips button').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.c === cartons)); });
    var html = '';
    var showN = Math.min(cartons, 30);
    for (var i = 0; i < showN; i++) html += '<i></i>';
    if (cartons > showN) html += '<em>+' + (cartons - showN) + ' more</em>';
    cartonsEl.innerHTML = html;
    if (cartons === 1) priceEl.innerHTML = '<b>' + money(156) + '</b>24 cans at $6.50 per can.';
    else priceEl.innerHTML = '<b>Bulk quote</b>' + cartons + ' cartons get a better price per can than $6.50 (so under ' + money(n * 6.5) + '). CAND confirms your price in a personalised quote.';
    syncQtySelect(); summary();
  }
  $('#qMinus').addEventListener('click', function () { setCartons(cartons - 1); });
  $('#qPlus').addEventListener('click', function () { setCartons(cartons + 1); });
  qRange.addEventListener('input', function () { setCartons(+qRange.value); });
  $$('.chips button').forEach(function (b) { b.addEventListener('click', function () { setCartons(+b.dataset.c); }); });

  function timingText(v) {
    if (!v) return null;
    var d = new Date(v + 'T00:00:00'), days = Math.round((d - today) / 864e5);
    if (isNaN(days)) return null;
    if (days < 0) return 'That date has passed. Pick an upcoming date.';
    var by = new Date(d); by.setDate(by.getDate() - 21);
    if (days < 14) return 'For <b>' + nice(d) + '</b> that\'s ' + days + ' day' + (days === 1 ? '' : 's') + ' away. <span class="warn">Turnaround is usually 2–3 weeks, so this is tight. Enquire today and CAND will tell you what\'s possible.</span>';
    if (by < today) return 'For <b>' + nice(d) + '</b>, get your enquiry and artwork in <b>today</b>. Turnaround is 2–3 weeks depending on volume, and CAND confirms timing in your quote.';
    return 'For <b>' + nice(d) + '</b>, aim to approve your mockup by <b>' + nice(by) + '</b>. Turnaround is 2–3 weeks depending on volume, and CAND confirms timing in your quote.';
  }
  pDate.addEventListener('input', function () { timing.innerHTML = timingText(pDate.value) || 'Pick a date and we\'ll show you when to get your artwork in.'; });
  $('#planGo').addEventListener('click', function () {
    if (pDate.value) $('#fDate').value = pDate.value;
    syncQtySelect(); summary(); fTimingUpd();
  });

  /* ---------------- Enquiry form ---------------- */
  var fQty = $('#fQty');
  (function () {
    var h = '';
    for (var c = 1; c <= 42; c++) h += '<option value="' + c * 24 + '">' + (c * 24).toLocaleString('en-AU') + ' cans (' + c + ' carton' + (c > 1 ? 's' : '') + ')</option>';
    h += '<option value="1000+">1,000+ cans (tell us more below)</option>';
    fQty.innerHTML = h;
  })();
  function syncQtySelect() { fQty.value = String(cartons * 24); }
  fQty.addEventListener('change', function () { if (fQty.value !== '1000+') { cartons = +fQty.value / 24; setCartons(cartons); } summary(); });
  var form = $('#form'), stepN = 1, stepsEl = $$('.step', form);
  function summary() {
    var t = $('input[name="type"]:checked', form);
    $('#sumType').textContent = t ? t.value : '–';
    $('#sumQty').textContent = fQty.value === '1000+' ? '1,000+' : (+fQty.value || cartons * 24).toLocaleString('en-AU');
    var dv = $('#fDate').value; $('#sumDate').textContent = dv ? nice(new Date(dv + 'T00:00:00')) : '–';
    $('#sumPc').textContent = $('#fPc').value || '–';
  }
  function fTimingUpd() { var t = timingText($('#fDate').value), el = $('#fTiming'); el.hidden = !t; if (t) el.innerHTML = t; }
  form.addEventListener('change', summary);
  $('#fPc').addEventListener('input', function () { this.value = this.value.replace(/\D/g, '').slice(0, 4); summary(); });
  $('#fDate').addEventListener('input', function () { fTimingUpd(); summary(); });
  function showStep(n) {
    stepN = n;
    stepsEl.forEach(function (s) { s.hidden = +s.dataset.step !== n; });
    $('#prog').style.width = (n / 3 * 100) + '%';
    $('#stepLab').textContent = 'Step ' + n + ' of 3';
    $('#back').hidden = n === 1; $('#next').hidden = n === 3; $('#send').hidden = n !== 3;
    var first = $('.step[data-step="' + n + '"] input, .step[data-step="' + n + '"] select', form);
    if (first && n > 1) first.focus({ preventScroll: true });
  }
  function valid(n) {
    if (n === 1) { var ok = !!$('input[name="type"]:checked', form); $('#err1').hidden = ok; return ok; }
    if (n === 2) { var pc = $('#fPc').value, ok2 = pc === '' || /^\d{4}$/.test(pc); $('#err2').hidden = ok2; return ok2; }
    var ok3 = $('#fName').value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#fEmail').value.trim());
    $('#err3').hidden = !!ok3; return !!ok3;
  }
  $('#next').addEventListener('click', function () { if (valid(stepN)) showStep(stepN + 1); });
  $('#back').addEventListener('click', function () { showStep(stepN - 1); });
  $$('input[name="type"]').forEach(function (r) { r.addEventListener('change', function () { $('#err1').hidden = true; }); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!valid(3)) return;
    var name = $('#fName').value.trim().split(' ')[0];
    $('#doneName').textContent = name || 'you';
    var done = $('#done'); done.hidden = false; done.focus();
    var dc = $('#doneCan'), dx = dc.getContext('2d');
    var label = ($('#fBiz').value.trim() || name || 'Cheers').slice(0, 18);
    var art = textArt(label, 'Your moment', 'bold');
    var t0 = performance.now();
    (function anim(now) {
      var p = RM ? 1 : clamp((now - t0) / 1200, 0, 1);
      dx.clearRect(0, 0, dc.width, dc.height);
      drawCan(dx, { x: 60, y: 10, w: 140, angle: .2 - p * .2, art: art, print: ease(p), lamp: p < 1 ? p : null });
      if (p < 1) requestAnimationFrame(anim);
    })(t0);
  });

  /* ---------------- Nav, menu, dock ---------------- */
  var nav = $('#nav'), burger = $('#burger'), menu = $('#menu'), dock = $('#dock'), enq = $('#enquire');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open)); menu.hidden = !open;
  });
  $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { burger.setAttribute('aria-expanded', 'false'); menu.hidden = true; }); });
  var lastY = window.scrollY, enqVisible = false;
  onScreen(enq, function (v) { enqVisible = v; });
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-hidden', y > lastY && y > 500 && menu.hidden);
    lastY = y;
    dock.classList.toggle('is-on', y > window.innerHeight * .8 && !enqVisible);
    storyP = storyProgress();
    if (!RM) hx.style.setProperty('--sp', clamp(y / (hx.offsetHeight || 1), 0, 1).toFixed(3));
    howUpd();
    var simg = $('.statement__img img'); if (simg && !RM) { var r = simg.parentNode.getBoundingClientRect(); var f = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight; simg.style.transform = 'translateY(' + (-7 - f * 7) + '%)'; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- Reveal ---------------- */
  if (!RM && 'IntersectionObserver' in window) {
    var targets = $$('.statement__copy, .try__head, .paths__head, .events__head, .how__head, .art, .plan__copy, .planner, .faq .h2, .faq details, .enq__side, .form, .fx__main');
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (t) { t.classList.add('rv'); io.observe(t); });
  }


  /* ---------------- Footer v2: kinetic rows, can shelf, wordmark ---------------- */
  var fxRows = $$('.fx__row').map(function (r) { return { el: r, track: $('.fx__track', r), dir: +r.dataset.dir, x: 0 }; });
  var fxVisible = false, lastSY = window.scrollY, scrollVel = 0;
  onScreen($('.fx__cta'), function (v) { fxVisible = v; });
  function fxRowsTick() {
    var sy = window.scrollY; scrollVel = scrollVel * .9 + (sy - lastSY) * .1; lastSY = sy;
    if (!fxVisible || RM) return;
    fxRows.forEach(function (r) {
      var half = r.track.scrollWidth / 2;
      if (!half) return;
      r.x += r.dir * (.6 + Math.min(12, Math.abs(scrollVel)) * .45);
      if (r.x <= -half) r.x += half; if (r.x > 0) r.x -= half;
      r.track.style.transform = 'translate3d(' + r.x + 'px,0,0)';
    });
  }
  fxRows.forEach(function (r) { if (r.dir > 0) r.x = -200; });

  var shelf = $('#shelf'), sh = shelf.getContext('2d'), shelfLayer = document.createElement('canvas');
  var SH = { visible: false, t0: Infinity, mx: -1, dpr: 1, cans: [] };
  function shelfResize() {
    var r = shelf.getBoundingClientRect();
    SH.dpr = Math.min(2, window.devicePixelRatio || 1);
    shelf.width = Math.max(1, Math.round(r.width * SH.dpr)); shelf.height = Math.max(1, Math.round(r.height * SH.dpr));
    shelfLayer.width = shelf.width; shelfLayer.height = shelf.height;
    var n = clamp(Math.round(r.width / 105), 5, 15);
    SH.cans = [];
    for (var i = 0; i < n; i++) SH.cans.push({ i: i, ang: 0, lift: 0, va: 0 });
  }
  onScreen(shelf, function (v) { SH.visible = v; if (v && SH.t0 === Infinity) SH.t0 = performance.now(); });
  shelf.parentNode.addEventListener('pointermove', function (e) { var r = shelf.getBoundingClientRect(); SH.mx = (e.clientX - r.left) * SH.dpr; });
  shelf.parentNode.addEventListener('pointerleave', function () { SH.mx = -1; });
  function shelfDraw(now) {
    if (!SH.visible) return;
    var W = shelf.width, H = shelf.height, n = SH.cans.length;
    if (!W || !n) return;
    var g = shelfLayer.getContext('2d');
    g.clearRect(0, 0, W, H);
    var floor = H * .72;
    var cw = Math.min(W / n * .56, H * .62 * CAN_D / CAN_H);
    var ch = cw * CAN_H / CAN_D;
    var gap = W / n;
    SH.cans.forEach(function (c, k) {
      var cx = gap * (k + .5);
      var target = 0, lift = 0;
      if (SH.mx >= 0) {
        var dx = SH.mx - cx;
        target = clamp(-dx / (W * .35), -1.1, 1.1);
        lift = Math.max(0, 1 - Math.abs(dx) / (gap * .9));
      } else target = RM ? 0 : Math.sin(now / 1600 + k * .6) * .35;
      c.va += (target - c.ang) * .06; c.va *= .78; c.ang += c.va;
      c.lift += (lift - c.lift) * .14;
      var e = RM ? 1 : ease(clamp((now - SH.t0 - k * 70) / 700, 0, 1));
      var y = floor - ch - c.lift * ch * .12 + (1 - e) * ch * .9;
      g.globalAlpha = e;
      drawCan(g, { x: cx - cw / 2, y: y, w: cw, angle: c.ang, art: ARTS.cand, artScale: .85, hl: .29 + (SH.mx >= 0 ? clamp((SH.mx - cx) / W, -.5, .5) * .4 : 0) });
    });
    g.globalAlpha = 1;
    sh.clearRect(0, 0, W, H);
    sh.drawImage(shelfLayer, 0, 0);
    // reflection
    sh.save();
    sh.globalAlpha = .2;
    sh.translate(0, floor * 2); sh.scale(1, -1);
    sh.drawImage(shelfLayer, 0, 0);
    sh.restore();
    var fade = sh.createLinearGradient(0, floor, 0, H);
    fade.addColorStop(0, 'rgba(17,17,18,0)'); fade.addColorStop(.6, 'rgba(17,17,18,1)');
    sh.fillStyle = fade; sh.fillRect(0, floor, W, H - floor);
    var line = sh.createLinearGradient(0, 0, W, 0);
    line.addColorStop(0, 'rgba(255,255,255,0)'); line.addColorStop(.5, 'rgba(255,255,255,.35)'); line.addColorStop(1, 'rgba(255,255,255,0)');
    sh.fillStyle = line; sh.fillRect(0, floor, W, 1 * SH.dpr);
  }
  window.addEventListener('resize', shelfResize);
  shelfResize();

  var fxMark = $('.fx__mark');
  if ('IntersectionObserver' in window && !RM) {
    var mio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fxMark.classList.add('is-in'); mio.disconnect(); } }); }, { threshold: .35 });
    mio.observe(fxMark);
  } else fxMark.classList.add('is-in');

  /* ---------------- Loop ---------------- */
  function frame(now) {
    if (heroState.visible) heroDraw(now);
    fxRowsTick(); shelfDraw(now);
    if (storyVisible || RM) storyDraw(now);
    if (tryS.visible) tryDraw();
    requestAnimationFrame(frame);
  }
  var started = false;
  function start() {
    buildArts(); sprite = null; refreshTry(); heroResize(); if (!started) { heroSet(0, true); started = true; } setCartons(1); summary(); onScroll(); railUpd();
    if (RM) storyDraw(0);
  }
  var fontsReady = document.fonts && document.fonts.load ? Promise.all([
    document.fonts.load('64px "Anton"'), document.fonts.load('italic 64px "Instrument Serif"'),
    document.fonts.load('600 64px "Inter Tight"'), document.fonts.load('500 32px "JetBrains Mono"')
  ]).catch(function () {}) : Promise.resolve();
  var logoReady = new Promise(function (res) { if (logoImg.complete) res(); else { logoImg.onload = res; logoImg.onerror = res; } });
  start();
  Promise.all([fontsReady, logoReady]).then(start);
  requestAnimationFrame(frame);
})();
