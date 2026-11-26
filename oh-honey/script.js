(function () {
  // Pack selector: update main CTA and sticky bar
  var packs = document.querySelectorAll('.pack');
  var checkoutBtn = document.getElementById('checkoutBtn');
  var stickyLabel = document.getElementById('stickyLabel');

  function select(pack) {
    packs.forEach(function (p) {
      var on = p === pack;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    var label = pack.dataset.label;
    var total = pack.dataset.total;
    var forWord = pack.dataset.pack === '1' ? '1 bottle · $' + total : label + ' for $' + total;
    checkoutBtn.textContent = 'Clear my chin · ' + forWord;
    stickyLabel.textContent = label + ' · $' + total;
  }

  packs.forEach(function (p) {
    p.addEventListener('click', function () { select(p); });
  });

  // Placeholder checkout: the real Funnelish checkout link goes here later
  checkoutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    checkoutBtn.textContent = 'Checkout connects to Funnelish next ✓';
    setTimeout(function () {
      var active = document.querySelector('.pack.is-active');
      if (active) select(active);
    }, 1800);
  });

  // Sticky mobile CTA: show after the hero, hide while the offer is on screen
  var sticky = document.getElementById('sticky');
  var hero = document.querySelector('.hero');
  var offer = document.getElementById('offer');
  if (!('IntersectionObserver' in window)) return;

  var heroVisible = true;
  var offerVisible = false;
  function update() {
    var show = !heroVisible && !offerVisible;
    sticky.classList.toggle('is-visible', show);
    sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
    sticky.querySelector('a').tabIndex = show ? 0 : -1;
  }
  new IntersectionObserver(function (entries) {
    heroVisible = entries[0].isIntersecting; update();
  }).observe(hero);
  new IntersectionObserver(function (entries) {
    offerVisible = entries[0].isIntersecting; update();
  }, { threshold: 0.2 }).observe(offer);
})();
