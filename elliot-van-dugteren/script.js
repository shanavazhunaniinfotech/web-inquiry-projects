(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var W = 1183, H = 883;

  /* Scale the 1183px stages to fit their containers */
  function fit(viewer, stage) {
    var pad = parseFloat(getComputedStyle(viewer).paddingLeft) * 2;
    var s = Math.min(1, (viewer.clientWidth - pad) / W);
    stage.style.transform = 'scale(' + s + ')';
    stage.style.marginBottom = (H * s - H) + 'px';
    stage.style.marginRight = (W * s - W) + 'px';
  }
  var pairs = [[$('#viewer'), $('#stage')], [$('#live'), $('#liveStage')]];
  function fitAll() { pairs.forEach(function (p) { fit(p[0], p[1]); }); }
  window.addEventListener('resize', fitAll); fitAll();

  /* Overlay modes */
  var mode = 'swipe', mix = $('#mix'), code = $('#code'), stage = $('#stage'), handle = $('#handle');
  function paint() {
    var v = +mix.value;
    code.style.clipPath = ''; code.style.opacity = ''; stage.classList.toggle('is-diff', mode === 'diff');
    handle.hidden = mode !== 'swipe'; mix.parentNode.hidden = mode === 'diff';
    if (mode === 'swipe') { code.style.clipPath = 'inset(0 0 0 ' + v + '%)'; handle.style.left = v + '%'; }
    if (mode === 'fade') code.style.opacity = v / 100;
  }
  [].forEach.call(document.querySelectorAll('.mode'), function (b) {
    b.addEventListener('click', function () {
      mode = b.dataset.mode;
      [].forEach.call(document.querySelectorAll('.mode'), function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      paint();
    });
  });
  mix.addEventListener('input', paint); paint();

  /* Drag directly on the image in swipe mode */
  var dragging = false;
  function fromPointer(e) { var r = stage.getBoundingClientRect(); mix.value = Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)); paint(); }
  stage.addEventListener('pointerdown', function (e) { if (mode === 'diff') return; dragging = true; stage.setPointerCapture(e.pointerId); fromPointer(e); });
  stage.addEventListener('pointermove', function (e) { if (dragging) fromPointer(e); });
  stage.addEventListener('pointerup', function () { dragging = false; });
  stage.style.touchAction = 'pan-y';

  /* Measured check (pixels, x,y = top-left of element inside the 1183px frame) */
  var A = [
    ['Announcement bar height', '48', '48', 0],
    ['Heading, first line (left, top · width)', '34, 122 · 743', '35, 120 · 744', 2],
    ['"(Level 1 & 2)" colour', '<i class="sw" style="background:#1d9bc1"></i>#1D9BC1', '<i class="sw" style="background:#1d9bc1"></i>#1D9BC1', 0],
    ['Paragraph, 4 lines (line top rows)', '327 · 357 · 387 · 417', '327 · 357 · 387 · 417', 0],
    ['"Get started" button (x, y · w × h)', '32, 471 · 272 × 63', '32, 471 · 272 × 63', 0],
    ['"Book now" button (x, y · w × h)', '32, 546 · 260 × 51', '32, 546 · 260 × 51', 0],
    ['Button text "BOOK NOW FOR $199"', '76, 566 → 248', '76, 565 → 248', 1],
    ['Pill "Hospitality" text', '638, 229 → 746', '638, 229 → 746', 0],
    ['Pill "Corporate" text', '1024, 213 → 1128', '1023, 213 → 1128', 1],
    ['Two-line pill "Child Care" text', '638, 296', '638, 295', 1],
    ['Background shape, left edge at its widest', 'x 813', 'x 813', 0],
    ['Feature card 1 (x, y · w × h)', '32, 677 · 163 × 180', '32, 677 · 163 × 180', 0],
    ['Card 1 icon top', '703', '703', 0],
    ['Card 1 text top', '763', '763', 0],
    ['Hovered card 2 (x, y · width)', '217, 669 · 175', '217, 670 · 175', 1],
    ['Colours: blue, purple, text, page, circle', '<i class="sw" style="background:#1d9bc1"></i><i class="sw" style="background:#775172"></i><i class="sw" style="background:#3f4142"></i><i class="sw" style="background:#fafcfc"></i><i class="sw" style="background:#e9f5fa"></i>', 'Same 5 hex values', 0],
    ['Typeface', 'Rounded geometric sans', 'Outfit (closest free match)', -1]
  ];
  $('#auditBody').innerHTML = A.map(function (r, i) {
    var res = r[3] < 0 ? '<span class="res check">Confirm in Figma</span>' : '<span class="res pass">Pass · ' + (r[3] === 0 ? 'exact' : r[3] + 'px') + '</span>';
    return '<tr><td>' + String(i + 1).padStart(2, '0') + '</td><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + res + '</td></tr>';
  }).join('');
})();
