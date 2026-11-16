(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };

  /* ---------- Journey ---------- */
  var J = [
    ['🔍', 'Discover', 'Finds you on Instagram, Google or a podcast and lands on a homepage that speaks to their exact struggle.', ['WordPress site', 'Yoast SEO', 'Instagram link-in-bio page'], ['Page speed and SEO basics set up', 'Visitor tracking with Google Analytics'], 'Goal: 2–4% of visitors start the free assessment'],
    ['📝', 'Free assessment', 'Takes a 2-minute wellness check (sleep, stress, energy) and gets a personal result by email.', ['Fluent Forms quiz', 'FluentCRM', 'Email list'], ['Result email sent instantly', '3-email nurture sequence over 7 days', 'Contact tagged by their main goal'], 'Goal: 40% of quiz takers join your list'],
    ['📅', 'Discovery call', 'Books a free 20-minute call straight into your calendar, picking a time that suits them.', ['Amelia booking', 'Google Calendar sync', 'Zoom link'], ['Confirmation + calendar invite', 'Reminders 24 h and 1 h before', 'Intake form sent before the call'], 'Goal: fewer no-shows, every call prepared'],
    ['💳', 'Choose a program', 'Picks a membership, the signature course or 1:1 coaching, and pays securely in one step.', ['MemberPress', 'Stripe', 'Coupons'], ['Payment and receipt handled', 'Monthly billing for memberships', 'Payment-failed reminders'], 'Goal: clear options, no back-and-forth'],
    ['👋', 'Onboarding', 'Gets a warm welcome, logs in to the members area and books their first session.', ['Member account page', 'FluentCRM automations'], ['Welcome email + login details', 'Getting-started checklist', '1:1 clients prompted to book session 1'], 'Goal: first win in week one'],
    ['🌿', 'Members area', 'Follows the course step by step, joins monthly live calls and tracks progress.', ['LearnDash course', 'Members community', 'Video library'], ['Drip content released weekly', 'Progress reminders if they stall', 'Live call invites to members only'], 'Goal: members finish the course'],
    ['🔁', 'Renew & refer', 'Stays subscribed, upgrades to 1:1, or refers a friend.', ['MemberPress renewals', 'Coupons', 'Reviews'], ['Renewal reminder before billing', 'Upgrade offer at month 3', 'Review and referral request after results'], 'Goal: clients stay longer and bring friends']
  ];
  $('#path').innerHTML = J.map(function (s, i) { return '<li><button role="tab" type="button" aria-selected="' + (i === 0) + '" data-i="' + i + '"><span class="dot" aria-hidden="true">' + s[0] + '</span>' + s[1] + '</button></li>'; }).join('');
  function show(i) {
    var s = J[i], st = $('#stage');
    st.innerHTML = '<div><h3>' + (i + 1) + '. ' + s[1] + '</h3><p class="exp">' + s[2] + '</p><div class="tools">' + s[3].map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div><p class="kpi"><b>' + s[5] + '</b></p></div>' +
      '<div class="auto"><b>Runs automatically</b><ul>' + s[4].map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div>';
    st.style.animation = 'none'; void st.offsetWidth; st.style.animation = '';
    $$('#path button').forEach(function (b) { b.setAttribute('aria-selected', String(+b.dataset.i === i)); });
  }
  $('#path').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) show(+b.dataset.i); });
  $('#path').addEventListener('keydown', function (e) {
    var cur = $$('#path button').findIndex(function (b) { return b.getAttribute('aria-selected') === 'true'; });
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = (cur + (e.key === 'ArrowRight' ? 1 : J.length - 1)) % J.length; show(n); $$('#path button')[n].focus(); }
  });
  show(0);

  /* ---------- Fit table ---------- */
  var FIT = [
    ['You own it (no lock-in)', [5, 'Move host any time'], [1, 'Site stays on Wix'], [2, 'Content export only'], [2, 'Content export only']],
    ['Marketing website & SEO', [5, 'Unlimited, best SEO tools'], [4, 'Good design freedom'], [3, 'Template-led pages'], [2, 'Basic sales pages']],
    ['1:1 bookings & calendar', [5, 'Booking plugin, deposits, packages'], [5, 'Wix Bookings built in'], [2, 'Needs an extra booking tool'], [1, 'Needs an extra booking tool']],
    ['Membership billing', [5, 'No fees, no member limits'], [4, 'Pricing Plans'], [5, 'Strong, contact limits per plan'], [4, 'Good']],
    ['Online course', [4, 'LMS plugin'], [4, 'Online Programs'], [5, 'Best in class'], [5, 'Best in class']],
    ['Room to grow', [5, 'Add any feature later'], [3, 'Limited to Wix apps'], [3, 'Upgrade to higher plans'], [3, 'Upgrade to higher plans']],
    ['Easy for you to update', [3, 'Block editor + training video'], [5, 'Visual editor + app'], [4, 'Good'], [4, 'Good']],
    ['Upkeep', [3, 'Updates and backups (I can handle)'], [5, 'Handled by Wix'], [5, 'Handled by Kajabi'], [5, 'Handled by Teachable']]
  ];
  function dots(n) { var o = '<span class="dots" aria-label="' + n + ' out of 5">'; for (var i = 1; i <= 5; i++) o += '<i class="' + (i <= n ? 'on' : '') + '"></i>'; return o + '</span>'; }
  $('#fitBody').innerHTML = FIT.map(function (r) { return '<tr><th scope="row">' + r[0] + '</th>' + r.slice(1).map(function (c, i) { return '<td' + (i === 0 ? ' class="win"' : '') + '>' + dots(c[0]) + '<small>' + c[1] + '</small></td>'; }).join('') + '</tr>'; }).join('');

  /* ---------- Calculator ---------- */
  var P = [
    { name: 'WordPress', sub: 'Hosting + plugins', base: 55, extra: 0, rec: true },
    { name: 'Wix', sub: 'Business plan', base: 39, extra: 0 },
    { name: 'Teachable', sub: 'Builder + booking tool', base: 69, extra: 12 },
    { name: 'Kajabi', sub: 'Basic + booking tool', base: 143, extra: 12 }
  ];
  var ids = ['mem', 'mprice', 'course', 'cprice', 'sess', 'sprice'];
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function calc() {
    var v = {}; ids.forEach(function (id) { v[id] = +$('#' + id).value; });
    $('#o-mem').textContent = v.mem; $('#o-mprice').textContent = money(v.mprice); $('#o-course').textContent = v.course; $('#o-cprice').textContent = money(v.cprice); $('#o-sess').textContent = v.sess; $('#o-sprice').textContent = money(v.sprice);
    var rev = v.mem * v.mprice + v.course * v.cprice + v.sess * v.sprice, tx = v.mem + v.course + v.sess;
    var card = rev * .029 + tx * .3;
    $('#rev').textContent = money(rev) + ' /mo';
    var rows = P.map(function (p) { return { p: p, cost: p.base + p.extra + card }; });
    var max = Math.max.apply(null, rows.map(function (r) { return r.cost; }));
    $('#bars').innerHTML = rows.map(function (r) {
      return '<div class="barrow' + (r.p.rec ? ' best' : '') + '"><span>' + r.p.name + (r.p.rec ? ' ★' : '') + '<small>' + r.p.sub + '</small></span><div class="track"><div class="fill" style="width:' + (100 * r.cost / max) + '%"></div></div><span class="v">' + money(r.cost) + '<small>per month</small></span></div>';
    }).join('');
    var wp = rows[0].cost, wix = rows[1].cost, kaj = rows[3].cost;
    $('#save').innerHTML = 'At these numbers, WordPress costs <b>' + money((kaj - wp) * 12) + ' less per year</b> than Kajabi, and about ' + money(Math.abs(wp - wix)) + '/mo ' + (wp > wix ? 'more' : 'less') + ' than Wix. With WordPress you own the site and your client list, pay no platform fees on sales and have no member limits. Card fees (' + money(card) + '/mo) are the same everywhere.';
  }
  ids.forEach(function (id) { $('#' + id).addEventListener('input', calc); });
  calc();
})();
