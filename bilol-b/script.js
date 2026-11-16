(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* 01 · Replay the order test */
  var steps = $('#steps'), items = steps.querySelectorAll('li'), timer;
  $('#play').addEventListener('click', function () {
    clearTimeout(timer); $('#verdict').hidden = true;
    steps.classList.add('playing'); [].forEach.call(items, function (li) { li.classList.remove('on'); });
    var i = 0;
    (function next() {
      if (i < items.length) { items[i].classList.add('on'); i++; timer = setTimeout(next, i < 3 ? 650 : 900); }
      else { $('#verdict').hidden = false; timer = setTimeout(function () { steps.classList.remove('playing'); }, 1800); }
    })();
  });

  /* 02 · Findings */
  var F = [
    ['critical', 'Orders never reach you', 'Checkout saves the order only in the customer\'s browser and shows "our manager will call you". Nothing is sent to you.', 'Every customer who orders waits for a call that never comes. You lose the sale and their trust.', 'Send each order to your Telegram and save it in an online database the moment it is placed.'],
    ['critical', 'Admin password is shown on the login page', 'Anyone who opens /admin can read the password on the screen (I have not copied it here). The check also runs in the visitor\'s browser, so it can be skipped.', 'Your admin is open to anyone.', 'Remove the hint today and change the password. Then use a real login checked on a server.'],
    ['critical', 'Admin changes only appear on your own device', 'Products, prices and settings are stored in the browser you edit them in.', 'If you change a price in the admin, customers still see the old price. Your own phone and laptop will show different shops.', 'Store products online (option A or B below), so one change updates the shop for everyone.'],
    ['important', 'Contact form messages are lost', 'The "Aloqa" (contact) form also saves only in the visitor\'s browser.', 'Questions from customers never reach you.', 'Send form messages to Telegram and email.'],
    ['important', 'Click / Payme is a label, not a payment', 'Choosing "Click / Payme orqali onlayn" just adds the words to the order. No payment page opens.', 'Customers think they can pay online, but no money is taken.', 'Connect the official Payme and Click payment pages, or remove the option until it works.'],
    ['important', 'The Telegram button doesn\'t go to you', 'It opens Telegram\'s "share" screen, so the customer has to find and pick your chat themselves.', 'Most customers will close it. Orders that could reach you get lost.', 'A Telegram bot posts orders straight into your private chat, with no action needed from the customer.'],
    ['check', 'Photos and numbers made by AI', 'Product photos are stock images, and some figures look generated: "10,000+ satisfied athletes", "50+ tons in stock", ratings and review counts, and the phone number +998 (90) 777-55-44.', 'Customers notice stock photos. Numbers that aren\'t true can hurt trust once you have real buyers.', 'Use your own product photos, and keep only numbers you can stand behind.']
  ];
  var good = ['Uzbek language throughout', 'Barbell & dumbbell builder', '3-question equipment advisor', 'Buying guides', 'Free delivery over 1,000,000 so\'m', 'Cash on delivery option'];
  $('#finds').innerHTML = F.map(function (f, i) {
    return '<details class="find"' + (i === 0 ? ' open' : '') + '><summary><span class="sev ' + f[0] + '">' + f[0] + '</span><h3>' + f[1] + '</h3></summary><div class="body"><div><b>What I saw</b>' + f[2] + '</div><div><b>Why it matters</b>' + f[3] + '</div><div><b>Fix</b>' + f[4] + '</div></div></details>';
  }).join('') + '<details class="find find--good" open><summary><span class="sev good">keep</span><h3>Already good, and worth keeping</h3></summary><div class="body"><div class="chips">' + good.map(function (g) { return '<span>' + g + '</span>'; }).join('') + '</div></div></details>';

  /* 03 · Telegram order demo (nothing is sent) */
  var P = [
    ["Geksagonal Rezinali Gantellar (Juft)", 450000],
    ["Regulyatorli Tezkor Smart Gantel (2.5 - 24 kg)", 1850000],
    ["Olimpiya Standart Shtangasi Grifi 220 sm (20 kg)", 1650000],
    ["Hi-Temp Bumper Rezina Disklar To'plami (100 kg)", 3600000],
    ["Klassik Cho'yan Girya 16 kg (Pud)", 490000],
    ["Sozlanuvchi Universal Fitnes Skameykasi (Incline/Flat)", 1450000]
  ];
  $('#prod').innerHTML = P.map(function (p, i) { return '<option value="' + i + '">' + esc(p[0]) + ' · ' + p[1].toLocaleString('en-US') + " so'm</option>"; }).join('');
  var n = 1041;
  $('#order').addEventListener('submit', function (e) {
    e.preventDefault();
    var p = P[+$('#prod').value], q = Math.max(1, Math.min(20, parseInt($('#qty').value, 10) || 1)), total = p[1] * q;
    var free = total >= 1000000 ? 'Free delivery' : 'Delivery charged';
    var now = new Date(), t = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    var chat = $('#chat'), empty = chat.querySelector('.empty'); if (empty) empty.remove();
    var m = document.createElement('div'); m.className = 'msg';
    m.innerHTML = '🏋️ <b>New order #TS-' + (n++) + '</b>\n👤 ' + esc($('#nm').value || '—') + '\n📞 ' + esc($('#ph').value || '—') + '\n📦 ' + esc(p[0]) + ' × ' + q + '\n💰 ' + total.toLocaleString('en-US') + " so'm · " + free + '\n💳 ' + esc($('#pay').value) +
      '<div class="act"><span>✅ Confirm</span><span>📞 Call</span></div><span class="t">' + t + '</span>';
    chat.appendChild(m); chat.scrollTop = chat.scrollHeight;
  });
})();
