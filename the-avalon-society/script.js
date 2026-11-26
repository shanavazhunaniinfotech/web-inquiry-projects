(function () {
  // mobile menu
  var burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.querySelectorAll('.mnav a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
    });
  }

  // reveal on scroll
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el, i) { el.style.transitionDelay = (i % 5) * 70 + 'ms'; io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  // design filters
  document.querySelectorAll('.filters').forEach(function (g) {
    var tiles = g.parentElement.querySelectorAll('.sw');
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      g.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      var f = b.dataset.f;
      tiles.forEach(function (t) { t.classList.toggle('hide', f !== 'all' && t.dataset.cat !== f); });
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq li > button').forEach(function (b) {
    b.addEventListener('click', function () {
      var li = b.parentElement, open = !li.classList.contains('open');
      li.parentElement.querySelectorAll('li.open').forEach(function (o) { o.classList.remove('open'); o.firstElementChild.setAttribute('aria-expanded', 'false'); });
      li.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
    });
  });

  // locked downloads (wholesale)
  document.querySelectorAll('[data-locked]').forEach(function (a) {
    var s = a.querySelector('span');
    s.insertAdjacentHTML('beforeend', '<em class="lock">· after approval</em>');
    a.addEventListener('click', function () {
      setTimeout(function () { var f = document.getElementById('w-name'); f && f.focus({ preventScroll: true }); }, 500);
    });
  });

  // contact routing
  var role = document.getElementById('c-role');
  document.querySelectorAll('[data-role]').forEach(function (a) {
    a.addEventListener('click', function () { if (role) { role.value = a.dataset.role; role.dispatchEvent(new Event('change')); } });
  });
  if (role) {
    var orderFld = document.getElementById('orderFld');
    role.addEventListener('change', function () { orderFld.style.display = role.value === 'customer' ? '' : 'none'; });
  }

  // forms (prototype: validate + confirmation)
  ['wsForm', 'contactForm'].forEach(function (id) {
    var f = document.getElementById(id); if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      f.querySelectorAll('[required]').forEach(function (i) {
        var ok = i.value.trim() && (i.type !== 'email' || /.+@.+\..+/.test(i.value));
        i.style.borderColor = ok ? '' : '#b3412e';
        if (!ok && !bad) bad = i;
      });
      if (bad) { bad.focus(); return; }
      f.querySelector('.ok').classList.add('show');
      f.querySelector('button[type=submit]').disabled = true;
      f.querySelector('button[type=submit]').textContent = 'Sent';
    });
  });
})();
