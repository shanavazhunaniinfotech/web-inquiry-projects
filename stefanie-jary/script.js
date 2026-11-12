(function () {
  'use strict';
  // score: negative = WordPress, positive = Squarespace
  var Q = [
    ['Who will update the website?', [['Volunteers who change often', 2], ['One regular staff member', 0], ['A web developer or agency', -2]]],
    ['How complex is your events calendar?', [['A few events each month', 2], ['Weekly classes, simple list', 1], ['Lots of recurring classes with filters and RSVPs', -2]]],
    ['How do people book rooms?', [['Enquiry form or phone is fine', 2], ['Online booking with a calendar', 0], ['Approvals, deposits and invoices', -2]]],
    ['Who looks after updates and security?', [['Nobody, we want it handled for us', 2], ['We could do it occasionally', 0], ['We have tech support', -1]]],
    ['How do you feel about moving content?', [['Happy to move for an easier site', 1], ['Either is fine', 0], ['We would rather not move', -2]]]
  ];
  var ans = Q.map(function () { return null; });
  var box = document.getElementById('quizbox');
  box.innerHTML = Q.map(function (q, i) {
    return '<div class="q"><b><small>Question ' + (i + 1) + '</small>' + q[0] + '</b><div class="opts" role="group" aria-label="' + q[0] + '">' +
      q[1].map(function (o, j) { return '<button type="button" aria-pressed="false" data-q="' + i + '" data-a="' + j + '">' + o[0] + '</button>'; }).join('') + '</div></div>';
  }).join('');
  box.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var qi = +b.dataset.q; ans[qi] = +b.dataset.a;
    [].forEach.call(b.parentNode.children, function (x) { x.setAttribute('aria-pressed', x === b); });
    render();
  });
  function render() {
    var done = ans.filter(function (a) { return a !== null; }).length;
    var score = ans.reduce(function (s, a, i) { return s + (a === null ? 0 : Q[i][1][a][1]); }, 0);
    var pos = Math.max(4, Math.min(96, 50 + score * 5));
    document.getElementById('needle').style.left = pos + '%';
    var t, p;
    if (!done) { t = 'Answer the questions to see your fit'; p = ''; }
    else if (score >= 3) { t = 'Squarespace looks like the better fit'; p = 'Your answers point to a site that volunteers can update without training or maintenance worries. Squarespace keeps it simple, secure and on one monthly bill.'; }
    else if (score <= -3) { t = 'Staying on WordPress looks like the better fit'; p = 'Your answers point to more advanced events and bookings. WordPress handles these best. We would refresh the design, simplify editing for volunteers and set up automatic updates and backups.'; }
    else { t = 'Either platform would work well'; p = 'Your needs sit in the middle. If ease for volunteers matters most, lean Squarespace. If you would rather not move content, refresh the current WordPress site.'; }
    if (done && done < Q.length) t += ' (so far)';
    document.getElementById('r-title').textContent = t;
    document.getElementById('r-text').textContent = p + (done && done < Q.length ? ' Answer ' + (Q.length - done) + ' more to confirm.' : '');
  }
  render();
})();
