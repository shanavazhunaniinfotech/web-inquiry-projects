/* Concept B — 2-Hat Stack bundle builder + motion */
(function () {
  var FM = window.FM; if (!FM) return;
  var pick = document.getElementById('stack-pick');
  if (pick) {
    var list = ['teal-szn', 'the-benavides-bobcat', 'duckin-raw', 'untitled-sep1_16-51-40', 'flyrack', 'gsp-hunter', 'the-good-boy', 'texas-redfish', 'fowlest-behavior', 'sandhill-crane', 'thermal-yote', 'crawfish-szn']
      .map(function (h) { return FM.MAP[h]; }).filter(function (p) { return p && p.av; });
    var chosen = [];
    pick.innerHTML = list.map(function (p) {
      return '<button type="button" class="sp" role="listitem" data-h="' + p.h + '" aria-pressed="false"><img src="' + FM.img(p, 0, 300) + '" alt="" width="150" height="150" loading="lazy"><span>' + p.t + '</span><b>' + FM.money(p.p) + '</b></button>';
    }).join('');
    function paint() {
      [0, 1].forEach(function (i) {
        var s = document.getElementById('slot-' + i), p = FM.MAP[chosen[i]];
        s.classList.toggle('full', !!p);
        s.innerHTML = p ? '<img src="' + FM.img(p, 0, 300) + '" alt="' + p.t + '" width="120" height="120"><button type="button" class="slot-x" data-i="' + i + '" aria-label="Remove ' + p.t + '">✕</button>' : '<span>Hat ' + (i + 1) + '</span>';
      });
      [].forEach.call(pick.children, function (b) { var on = chosen.indexOf(b.getAttribute('data-h')) > -1; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      var n = chosen.length;
      document.getElementById('stack-bar').style.width = (n * 50) + '%';
      document.getElementById('stack-msg').innerHTML = n === 2 ? '<b>Free shipping unlocked</b> — $68 total' : n === 1 ? 'One more hat → <b>free shipping</b>' : 'Pick 2 hats to unlock free shipping';
      var add = document.getElementById('stack-add'); add.disabled = n < 2;
      add.textContent = n === 2 ? 'Add stack to cart — $68' : 'Add stack to cart';
    }
    pick.addEventListener('click', function (e) {
      var b = e.target.closest('.sp'); if (!b) return;
      var h = b.getAttribute('data-h'), i = chosen.indexOf(h);
      if (i > -1) chosen.splice(i, 1); else { if (chosen.length === 2) chosen.shift(); chosen.push(h); }
      paint();
    });
    document.querySelector('.slots').addEventListener('click', function (e) { var x = e.target.closest('.slot-x'); if (x) { chosen.splice(+x.getAttribute('data-i'), 1); paint(); } });
    document.getElementById('stack-add').addEventListener('click', function () {
      chosen.forEach(function (h) { FM.add(h, null, 1, true); }); chosen = []; paint(); FM.openCart();
    });
    paint();
  }
  // mobile bottom bar shows after hero
  var mbar = document.querySelector('[data-mbar]');
  if (mbar) window.addEventListener('scroll', function () { mbar.classList.toggle('on', scrollY > 500); }, { passive: true });

  if (!window.gsap || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var g = window.gsap;
  g.from('.mega span', { yPercent: 110, opacity: 0, duration: 1, stagger: .12, ease: 'power4.out' });
  g.from('.hero .tag, .hero .lede, .hero-cta', { y: 20, opacity: 0, duration: .8, stagger: .08, delay: .35, ease: 'power3.out' });
  g.fromTo('.hero-bg', { scale: 1.15 }, { scale: 1, duration: 2.2, ease: 'power2.out' });
})();
