/* Version B extras: cursor-following preview on the equipment index, horizontal "how it works" */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (min-width: 1061px)');

  /* Cursor-following preview image */
  var box = document.getElementById('hoverImg');
  if (box && fine.matches && !reduce) {
    var img = box.querySelector('img'), use = box.querySelector('use');
    var x = 0, y = 0, cx = 0, cy = 0, raf = null;
    var loop = function () { cx += (x - cx) * 0.16; cy += (y - cy) * 0.16; box.style.left = cx + 'px'; box.style.top = cy + 'px'; raf = requestAnimationFrame(loop); };
    document.querySelectorAll('.cat-row').forEach(function (row) {
      row.addEventListener('mouseenter', function (e) {
        if (row.dataset.img) { img.src = row.dataset.img; box.classList.add('has-img'); }
        else { use.setAttribute('href', '#' + row.dataset.icon); box.classList.remove('has-img'); }
        if (!raf) { cx = x = e.clientX + 170; cy = y = e.clientY; loop(); }
        box.classList.add('is-on');
      });
      row.addEventListener('mousemove', function (e) { x = e.clientX + 190; y = e.clientY; });
      row.addEventListener('mouseleave', function () { box.classList.remove('is-on'); });
    });
    window.addEventListener('scroll', function () { box.classList.remove('is-on'); }, { passive: true });
  }

  /* Size the sentence dropdowns to the chosen word */
  var meas = document.createElement('span');
  meas.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;top:0';
  document.body.appendChild(meas);
  function sizeSel(sel) {
    var cs = getComputedStyle(sel);
    meas.style.font = cs.font; meas.style.letterSpacing = cs.letterSpacing;
    meas.textContent = sel.options[sel.selectedIndex].text;
    sel.style.setProperty('--w', (meas.offsetWidth + parseFloat(cs.paddingRight) + 4) + 'px');
    sel.classList.add('is-sized');
  }
  document.querySelectorAll('.sel select').forEach(function (sel) {
    sel.addEventListener('change', function () { sizeSel(sel); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { sizeSel(sel); });
    sizeSel(sel);
  });
  window.addEventListener('resize', function () { document.querySelectorAll('.sel select').forEach(sizeSel); });

  /* Horizontal pinned steps (desktop only) */
  document.addEventListener('sms:gsap', function () {
    if (!window.ScrollTrigger || reduce) return;
    var track = document.getElementById('howTrack'), bar = document.getElementById('howBar');
    ScrollTrigger.matchMedia({
      '(min-width: 1061px)': function () {
        var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
        gsap.to(track, {
          x: function () { return -dist(); }, ease: 'none',
          scrollTrigger: { trigger: '.how', start: 'top top', end: function () { return '+=' + dist(); }, pin: '.how__pin', scrub: 0.6, invalidateOnRefresh: true,
            onUpdate: function (s) { if (bar) bar.style.width = (s.progress * 100) + '%'; } }
        });
      }
    });
    gsap.to('.arch img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.from('.cat-row', { y: 30, opacity: 0, duration: .8, stagger: .06, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.index', start: 'top 85%', once: true } });
    gsap.from('.float', { scale: .7, opacity: 0, duration: .9, stagger: .15, delay: .8, ease: 'back.out(1.6)' });
  });
})();
