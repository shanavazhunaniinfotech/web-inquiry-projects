(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var OPEN = { 1: 1, 4: 1, 5: 1 }, START = 660, END = 1110; // Mon, Thu, Fri 11:00 to 18:30
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  var tSel = $('#time');
  for (var m = 0; m < 1440; m += 60) {
    var h = m / 60, lbl = (h % 12 || 12) + ':00 ' + (h < 12 ? 'am' : 'pm');
    tSel.insertAdjacentHTML('beforeend', '<option value="' + m + '"' + (m === 1140 ? ' selected' : '') + '>' + lbl + '</option>');
  }
  function firstCall(d, min) {
    for (var k = 0; k < 7 * 1440; k += 30) {
      var t = d * 1440 + min + k, dd = Math.floor(t / 1440) % 7, mm = t % 1440;
      if (OPEN[dd] && mm >= START && mm < END) return { hours: k / 60, day: dd, min: mm };
    }
  }
  function fmt(min) { var h = Math.floor(min / 60), mm = min % 60; return (h % 12 || 12) + (mm ? ':' + String(mm).padStart(2, '0') : '') + ' ' + (h < 12 ? 'am' : 'pm'); }
  function run() {
    var d = +$('#day').value, min = +tSel.value, r = firstCall(d, min);
    $('#waitNow').textContent = r.hours === 0 ? 'Same hour' : Math.round(r.hours) + ' h';
    $('#waitNowTxt').textContent = r.hours === 0
      ? 'You are open, so a call could happen soon, if someone is free between sessions.'
      : 'Sent on ' + LONG[d] + ' at ' + fmt(min) + '. The earliest possible callback is ' + LONG[r.day] + ' at ' + fmt(r.min) + ', and only then can an appointment be booked.';
    $('#weekNow').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(function (x) {
      var cls = (OPEN[x] ? 'open' : '') + (x === d ? ' sent' : '') + (x === r.day && r.hours > 0 ? ' call' : '');
      return '<div>' + DAYS[x] + '<i class="' + cls + '"></i></div>';
    }).join('');
  }
  $('#day').addEventListener('change', run); tSel.addEventListener('change', run); run();

  var C = [
    ['ok', 'No testimonials or reviews', 'None found on any of the 46 pages, as AHPRA requires.'],
    ['ok', 'No superlatives or outcome promises', 'No "best", "leading", "guaranteed", "cure" or "proven results" claims about your services.'],
    ['ok', '"Dr" is paired with the profession', 'Profiles say "Dr Heather Gan, Clinical Psychologist", which makes clear the title is not a medical one.'],
    ['ok', 'The free offer has clear terms', '"Free 15 minute phone consultation (enquire with form for availability)" states what is free and how to get it.'],
    ['rev', '"Specialising" and "specialised" wording on 7 pages', 'For example "a psychologist specialising in BPD" and "specialised support". AHPRA\'s guidelines caution that this can suggest specialist registration, which psychology doesn\'t have. Wording like "a special interest in" avoids it. Most are suburb pages, so any change goes through your SEO specialist first.'],
    ['rev', 'Booking form shows "Dr." alone', 'The form lists "Dr. Heather Gan (Mon, Thu, & Fri)". Adding "Clinical Psychologist" keeps it consistent with the rest of the site.']
  ];
  $('#checks').innerHTML = C.map(function (c) { return '<div class="chk"><span class="st ' + c[0] + '">' + (c[0] === 'ok' ? 'Clear' : 'Review') + '</span><div><b>' + c[1] + '</b><span class="d">' + c[2] + '</span></div></div>'; }).join('');

  var NOW = ['First name', 'Last name', 'Phone', 'Email', 'Choose a psychologist', 'Message', 'How did you hear about us?'];
  $('#fNow').innerHTML = NOW.map(function (f) { return '<li>' + f + '<em>required</em></li>'; }).join('');
  var NEXT = [['Name', 'required'], ['Phone or email', 'required'], ['Who you\'d like to see (no preference is fine)', 'optional'], ['What you\'d like help with (tick boxes)', 'optional'], ['Message', 'optional'], ['How did you hear about us?', 'auto-recorded']];
  $('#fNext').innerHTML = NEXT.map(function (f) { return '<li>' + f[0] + '<em class="' + (f[1] === 'required' ? '' : 'opt') + '">' + f[1] + '</em></li>'; }).join('');
})();
