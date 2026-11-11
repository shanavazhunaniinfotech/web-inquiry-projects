(function () {
  'use strict';
  var el = document.getElementById('qr');
  if (!el) return;
  var url = new URL('site/', location.href).href;
  if (window.QRCode) {
    try { new QRCode(el, { text: url, width: 256, height: 256, colorDark: '#1f2a17', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M }); return; } catch (e) {}
  }
  el.innerHTML = '<a href="site/" style="font-weight:700">Open on your phone</a>';
})();
