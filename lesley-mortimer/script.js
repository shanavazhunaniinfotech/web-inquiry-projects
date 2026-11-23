(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var store = $('#store'), logoURL = '', radius = '999px', cart = {};
  var IDS = ['name', 'tagline', 'c1', 'c2', 'c3', 'c4', 'fh', 'fb', 'story', 'events', 'zips', 'buyN', 'off'];

  /* Example products (placeholders) */
  var P = [
    { n: 'Signature Product', p: 24, v: ['Small', 'Medium', 'Large'], c: '#c8793d' },
    { n: 'Market Favourite', p: 18, v: ['Classic', 'Seasonal'], c: '#7d9a86' },
    { n: 'Gift Set', p: 39, v: ['Natural', 'Charcoal', 'Sand'], c: '#b9a27f' }
  ];

  /* Load settings from a shared link */
  try {
    if (location.hash.length > 1) {
      var saved = JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(1)))));
      IDS.forEach(function (id) { if (saved[id] != null) $('#' + id).value = String(saved[id]).slice(0, 300); });
      if (saved.r) radius = saved.r;
    }
  } catch (e) { /* ignore a broken link */ }

  var fontTimer;
  function loadFonts(h, b) {
    clearTimeout(fontTimer);
    fontTimer = setTimeout(function () {
      var fams = [h, b].filter(Boolean).map(function (f) { return 'family=' + encodeURIComponent(f.trim()).replace(/%20/g, '+') + ':wght@400;600;700'; });
      $('#brandFonts').href = 'https://fonts.googleapis.com/css2?' + fams.join('&') + '&display=swap';
    }, 350);
  }
  function zipList() { return $('#zips').value.split(/[,\s]+/).map(function (z) { return z.trim().toUpperCase(); }).filter(Boolean); }

  function render() {
    var v = {}; IDS.forEach(function (id) { v[id] = $('#' + id).value; });
    store.style.setProperty('--b1', v.c1); store.style.setProperty('--b2', v.c2); store.style.setProperty('--b3', v.c3); store.style.setProperty('--b4', v.c4);
    store.style.setProperty('--r', radius);
    store.style.setProperty('--fh', '"' + v.fh.replace(/"/g, '') + '", Georgia, serif');
    store.style.setProperty('--fb', '"' + v.fb.replace(/"/g, '') + '", system-ui, sans-serif');
    loadFonts(v.fh, v.fb);
    var name = v.name || 'Your Brand';
    $('#sLogo').innerHTML = logoURL ? '<img src="' + logoURL + '" alt="' + esc(name) + '">' : esc(name);
    $('#sName').textContent = name; $('#sTag').textContent = v.tagline;
    $('#sStory').textContent = v.story;
    $('#sEvents').innerHTML = v.events.split('\n').filter(function (x) { return x.trim(); }).map(function (x) { return '<li>' + esc(x.trim()) + '</li>'; }).join('');
    var n = Math.max(2, +v.buyN || 2), off = Math.min(50, Math.max(1, +v.off || 10));
    $('#sAnn').textContent = 'Free local delivery in our area · Buy ' + n + ', save ' + off + '%';
    $('#sDeal').textContent = 'Buy any ' + n + ', save ' + off + '%, applied automatically in your cart';
    $('#sFoot').textContent = '© ' + name + ' · Meet us in person, or shop online any time';
    drawCart();
  }

  $('#sGrid').innerHTML = P.map(function (p, i) {
    return '<div class="s-card" style="--c:' + p.c + '"><div class="ph">your photo</div><div class="in"><b>' + p.n + '</b><span>$' + p.p.toFixed(2) + '</span><select aria-label="Variation" id="var' + i + '">' + p.v.map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select><button type="button" class="s-btn" data-add="' + i + '">Add to cart</button></div></div>';
  }).join('');

  $('#sGrid').addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]'); if (!b) return;
    var i = +b.dataset.add, key = i + '|' + $('#var' + i).value;
    cart[key] = (cart[key] || 0) + 1; drawCart(); $('#sCart').hidden = false;
  });
  function drawCart() {
    var n = Math.max(2, +$('#buyN').value || 2), off = Math.min(50, Math.max(1, +$('#off').value || 10));
    var keys = Object.keys(cart), qty = 0, sub = 0, rows = '';
    keys.forEach(function (k) { var p = P[+k.split('|')[0]], q = cart[k]; qty += q; sub += p.p * q; rows += '<div class="cr"><span>' + p.n + ' · ' + esc(k.split('|')[1]) + ' × ' + q + '</span><span>$' + (p.p * q).toFixed(2) + '</span></div>'; });
    var disc = qty >= n ? sub * off / 100 : 0;
    $('#sCartBtn').textContent = 'Cart (' + qty + ')';
    if (!keys.length) { $('#cartRows').innerHTML = '<p class="cr note">Add a product to try the multi-buy discount.</p>'; return; }
    rows += disc ? '<div class="cr disc"><span>Buy ' + n + ', save ' + off + '%</span><span>−$' + disc.toFixed(2) + '</span></div>' : '<div class="cr note"><span>Add ' + (n - qty) + ' more to save ' + off + '%</span></div>';
    rows += '<div class="cr tot"><span>Total</span><span>$' + (sub - disc).toFixed(2) + '</span></div>';
    $('#cartRows').innerHTML = rows;
  }
  $('#sCartBtn').addEventListener('click', function () { $('#sCart').hidden = !$('#sCart').hidden; drawCart(); });
  $('#closeCart').addEventListener('click', function () { $('#sCart').hidden = true; });
  $('#shopNow').addEventListener('click', function () { $('#shop').scrollIntoView({ behavior: 'smooth', block: 'start' }); });

  function checkZip() {
    var z = $('#zipTry').value.trim().toUpperCase(), res = $('#zipRes');
    if (!z) { res.textContent = ''; return; }
    res.textContent = zipList().indexOf(z) > -1 ? '✓ Good news: delivery to ' + z + ' is free.' : 'Delivery to ' + z + ' uses standard shipping rates.';
  }
  $('#zipBtn').addEventListener('click', checkZip);
  $('#zipTry').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); checkZip(); } });

  $('#panel').addEventListener('input', function (e) { if (e.target.id !== 'logo') render(); });
  $('#logo').addEventListener('change', function () {
    var f = this.files && this.files[0]; if (!f) return;
    if (logoURL) URL.revokeObjectURL(logoURL);
    logoURL = URL.createObjectURL(f); render();
  });
  document.querySelectorAll('[data-r]').forEach(function (b) {
    if (b.dataset.r === radius) { document.querySelectorAll('[data-r]').forEach(function (x) { x.classList.toggle('on', x === b); }); }
    b.addEventListener('click', function () { radius = b.dataset.r; document.querySelectorAll('[data-r]').forEach(function (x) { x.classList.toggle('on', x === b); }); render(); });
  });
  document.querySelectorAll('[data-w]').forEach(function (b) {
    b.addEventListener('click', function () { $('#frame').classList.toggle('phone', b.dataset.w === 'phone'); document.querySelectorAll('[data-w]').forEach(function (x) { x.classList.toggle('on', x === b); }); });
  });

  var tt;
  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 2400); }
  $('#share').addEventListener('click', function () {
    var v = { r: radius }; IDS.forEach(function (id) { v[id] = $('#' + id).value; });
    var url = location.href.split('#')[0] + '#' + btoa(unescape(encodeURIComponent(JSON.stringify(v))));
    history.replaceState(null, '', url);
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast('Link copied'); }, function () { toast('Copy the address bar link'); });
    else toast('Copy the address bar link');
  });

  render();
})();
