/* GreenGo – chooser page: remember which concept was opened last */
(function () {
  try {
    var last = localStorage.getItem('gg-last');
    document.querySelectorAll('.side').forEach(function (a) {
      if (last && a.getAttribute('href') === last) a.querySelector('.side__n').textContent += ' · last viewed';
      a.addEventListener('click', function () { localStorage.setItem('gg-last', a.getAttribute('href')); });
    });
  } catch (e) { /* storage unavailable: the links still work */ }
})();
