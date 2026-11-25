(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var dotsNav = document.querySelector('.dots');
  var cur = document.getElementById('cur');
  document.getElementById('tot').textContent = slides.length;
  var index = 0;

  slides.forEach(function (s, i) {
    var b = document.createElement('button');
    b.setAttribute('aria-label', s.getAttribute('data-title'));
    b.title = s.getAttribute('data-title');
    b.addEventListener('click', function () { go(i); });
    dotsNav.appendChild(b);
  });
  var dots = dotsNav.querySelectorAll('button');

  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function setActive(i) {
    index = i;
    cur.textContent = i + 1;
    dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
    document.body.classList.toggle('on-dark', slides[i].classList.contains('slide--dark'));
    document.getElementById('prev').disabled = i === 0;
    document.getElementById('next').disabled = i === slides.length - 1;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        setActive(slides.indexOf(e.target));
      }
    });
  }, { threshold: 0.45 });
  slides.forEach(function (s) { io.observe(s); });
  setActive(0);

  document.getElementById('prev').addEventListener('click', function () { go(index - 1); });
  document.getElementById('next').addEventListener('click', function () { go(index + 1); });
  document.querySelectorAll('[data-next]').forEach(function (b) {
    b.addEventListener('click', function () { go(index + 1); });
  });
  document.addEventListener('keydown', function (e) {
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(index + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(index - 1); }
  });

  /* ---------- Client Journey road ---------- */
  var stages = [
    { n: 'Lead Generation', s: 'g', note: 'Enough well-matched people are entering the journey.', win: 'Ideal-client brief + 12-month marketing calendar in place.' },
    { n: 'Lead Follow-up', s: 'g', note: 'Every inquiry gets a fast, personal response.', win: 'Follow-up sequence running for every new lead.' },
    { n: 'Discovery & Booking', s: 'y', note: 'Discovery calls turn inquiries into booked consultations.', win: 'Booking rate tracked weekly in My Numbers.', now: true },
    { n: 'Planning Consultation', s: 'y', note: 'Clients arrive at the session knowing what they want on their walls.', win: 'Consultation script and room set-up ready.' },
    { n: 'Portrait Session', s: 'r', note: 'The session creates the images clients have already planned for.', win: 'Session plan tied to the consultation notes.' },
    { n: 'Pre-Sale Momentum', s: 'r', note: 'Clients leave the session ready and eager for the reveal.', win: 'Pre-sale conversation held after every session.' },
    { n: 'Ordering Appointment', s: '', note: 'The reveal turns excitement into a confident order.', win: 'Average sale improves month over month.' },
    { n: 'Production & Quality', s: '', note: 'Every order is on time and at the quality promised.', win: 'Order tracker with no overdue items.' },
    { n: 'Delivery & Installation', s: '', note: 'Delivery feels like an event, not a pick-up.', win: 'Installation checklist and satisfaction check.' },
    { n: 'Relationship Growth', s: '', note: 'Happy clients come back and send their friends.', win: 'Referral and repeat-client conversion tracked.' }
  ];
  var label = { g: 'Green · working well', y: 'Yellow · improving', r: 'Red · needs a system', '': 'Coming up' };
  var road = document.getElementById('road');
  var detail = document.getElementById('roadDetail');

  stages.forEach(function (st, i) {
    var li = document.createElement('li');
    li.className = (st.s || 'future') + (st.now ? ' now' : '');
    li.innerHTML = '<button type="button"><span class="dot">' + (st.s === 'g' ? '✓' : i + 1) + '</span><span class="lbl"></span></button>';
    li.querySelector('.lbl').textContent = st.n;
    li.querySelector('button').addEventListener('click', function () { showStage(i); });
    road.appendChild(li);
  });

  function showStage(i) {
    var st = stages[i];
    road.querySelectorAll('li').forEach(function (li, j) { li.classList.toggle('sel', j === i); });
    detail.innerHTML =
      '<span class="big">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<div><h3></h3><p class="note"></p><p class="muted small win"></p></div>' +
      '<div class="legend"><span><i style="background:var(--green)"></i>Green</span><span><i style="background:var(--amber)"></i>Yellow</span><span><i style="background:var(--red)"></i>Red</span></div>';
    detail.querySelector('h3').textContent = st.n + (st.now ? ' · you are here' : '');
    detail.querySelector('.note').textContent = st.note + ' (' + label[st.s] + ')';
    detail.querySelector('.win').textContent = 'Milestone: ' + st.win;
  }
  showStage(2);

  /* ---------- Evaluation demo ---------- */
  var qs = [
    { q: 'In the last 90 days, how many new leads matched your ideal client?', why: 'Quality matters more than quantity.', a: [['Fewer than 10', 0], ['10 – 30', 1], ['More than 30', 2]] },
    { q: 'Do you know which source sent you the most leads?', why: 'You can only grow what you measure.', a: [['Not really', 0], ['Roughly', 1], ['Yes, it is tracked', 2]] },
    { q: 'Do you have a 12-month marketing calendar?', why: 'Consistent marketing beats occasional bursts.', a: [['No', 0], ['In my head', 1], ['Yes, written down', 2]] },
    { q: 'How many active referral or display partners do you have?', why: 'Partners bring warm, pre-trusted clients.', a: [['None yet', 0], ['1 – 2', 1], ['3 or more', 2]] }
  ];
  var step = 0, score = 0;
  var body = document.getElementById('qBody');
  var bar = document.getElementById('qBar');
  var num = document.getElementById('qNum');

  function render() {
    body.style.animation = 'none'; void body.offsetWidth; body.style.animation = '';
    if (step < qs.length) {
      var q = qs[step];
      num.textContent = (step + 1) + '/' + qs.length;
      bar.style.width = (step / qs.length * 100) + '%';
      body.innerHTML = '<p class="q-text"></p><p class="q-why"></p>';
      body.querySelector('.q-text').textContent = q.q;
      body.querySelector('.q-why').textContent = 'Why it matters: ' + q.why;
      q.a.forEach(function (opt) {
        var b = document.createElement('button');
        b.className = 'opt'; b.type = 'button'; b.textContent = opt[0];
        b.addEventListener('click', function () { score += opt[1]; step++; render(); });
        body.appendChild(b);
      });
    } else {
      bar.style.width = '100%';
      num.textContent = 'Done';
      var r = score >= 6 ? 'g' : score >= 3 ? 'y' : 'r';
      var txt = {
        g: ['Green', 'Strong lead generation', 'Great work. Your next focus moves to Lead Follow-up.', 'Set up a 5-minute response rule for every new inquiry.'],
        y: ['Yellow', 'A good start', 'Leads are coming in. Tracking the source will show where to invest.', 'Add a “How did you hear about us?” field to every inquiry.'],
        r: ['Red', 'Let’s build your system', 'Nothing to worry about. This is the most common starting point.', 'Watch the 12-minute lesson “Your Ideal Client”, then write your brief.']
      }[r];
      body.innerHTML =
        '<div class="result"><div class="ring ' + r + '">' + txt[0] + '</div><h3></h3><p class="msg"></p>' +
        '<div class="next-step"><small>Your one next step</small><span class="ns"></span></div>' +
        '<span class="badge-pop">★ Badge earned: Stage 1 evaluated</span>' +
        '<button class="restart" type="button">Try again</button></div>';
      body.querySelector('h3').textContent = txt[1];
      body.querySelector('.msg').textContent = txt[2];
      body.querySelector('.ns').textContent = txt[3];
      body.querySelector('.restart').addEventListener('click', function () { step = 0; score = 0; render(); });
    }
  }
  render();
})();
