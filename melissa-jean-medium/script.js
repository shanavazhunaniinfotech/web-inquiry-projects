/* Melissa Jean Medium — home page concept interactions */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /* Data                                                                */
  /* ------------------------------------------------------------------ */
  var SERVICES = {
    medium:  { name: 'Mediumship Reading', desc: 'Connect with loved ones in spirit', unit: 'session', lens: [{ l: 30, p: 95, t: '30 minutes' }, { l: 60, p: 175, t: '60 minutes', pop: true }] },
    tarot:   { name: 'Psychic & Tarot Reading', desc: 'Guidance on love, work, purpose & timing', unit: 'session', lens: [{ l: 30, p: 85, t: '30 minutes' }, { l: 60, p: 150, t: '60 minutes' }] },
    healing: { name: 'Intuitive Energy Healing', desc: 'Release what feels heavy, return grounded', unit: 'session', lens: [{ l: 30, p: 80, t: '30 minutes' }, { l: 60, p: 140, t: '60 minutes' }] },
    mentor:  { name: 'Mentorship', desc: 'Develop your gift with structure & ethics', unit: 'package', lens: [{ l: 180, p: 420, t: '3-hour package', sub: 'First 60-min session booked now' }, { l: 360, p: 795, t: '6-hour package', sub: 'First 60-min session booked now' }] }
  };

  var NEEDS = {
    grief:    { s: 'medium',  light: 'A sense that the connection never ended, and the peace of hearing from them.', desc: 'Evidential messages from loved ones in spirit: names, memories and details that help you recognise who is coming through.' },
    decision: { s: 'tarot',   light: 'Clarity on your options, and the confidence to choose without second-guessing.', desc: 'Intuitive insight and tarot as a mirror, so you can see the path in front of you more clearly and trust your next step.' },
    unknown:  { s: 'tarot',   light: 'A calmer view of what is unfolding, and what is yours to focus on now.', desc: 'A grounded look at love, work, purpose and timing, with practical guidance rather than fear or fixed predictions.' },
    drained:  { s: 'healing', light: 'A quieter mind, a softer body, and energy that feels like your own again.', desc: 'A calm, guided session to release what is weighing on you and return to a steadier, more grounded version of yourself.' },
    gift:     { s: 'mentor',  light: 'Confidence in your intuition, with the structure and ethics to use it well.', desc: 'One-on-one mentorship to develop your abilities at your own pace. Prepaid packages start at three hours.' },
    other:    { s: 'gift',    light: 'A meaningful way to show you care, when words do not feel like enough.', desc: 'Gift any session or amount. Delivered by email instantly, or on the date you choose, so they can book whenever they are ready.' }
  };

  var STORIES = [
    { f: 'medium',  n: 'Danielle L.', w: 'Texas', q: 'I was sceptical going in. Melissa gave me my grandmother\'s nickname for me, one nobody outside our family knew. The comfort that gave me is hard to put into words.' },
    { f: 'tarot',   n: 'Kara M.', w: 'California', q: 'I came in stuck between two job offers and spinning. She didn\'t tell me what to do. She helped me hear what I already knew. I accepted the next morning and haven\'t looked back.' },
    { f: 'healing', n: 'Jenna P.', w: 'Ontario, Canada', q: 'I didn\'t realise how much I was holding in my body until it started to let go. I slept better that night than I had in months.' },
    { f: 'medium',  n: 'Marcus T.', w: 'Georgia', q: 'Booking from my phone took two minutes, and the Zoom link was in my inbox straight away. My brother came through with something only he would joke about. I laughed for the first time since he passed.' },
    { f: 'mentor',  n: 'Alicia W.', w: 'Arizona', q: 'Melissa\'s mentorship gave me structure and boundaries I was missing. She is generous, grounded and so ethical. I finally trust my own readings.' },
    { f: 'tarot',   n: 'Priya S.', w: 'London, UK', q: 'Warm, direct and kind. The times were already shown in UK time, which made it easy. I left with a clear plan instead of a head full of worry.' },
    { f: 'medium',  n: 'Tom & Ellen B.', w: 'Michigan', q: 'We gave this to my mother-in-law as a gift after Dad passed. She called us crying happy tears. Best gift we have ever given.' },
    { f: 'healing', n: 'Rachel D.', w: 'Florida', q: 'Calm, gentle and nothing "woo" about the way she explains things. I felt safe the whole time.' }
  ];

  var NOTES = {
    1: ['Announcement bar', 'Answers three questions before they are asked', 'It says right away that sessions are <b>online</b>, that times appear in <b>your own time zone</b> (detected live), and that gift cards exist. Those are the three things a first-time visitor needs to know to keep scrolling instead of bouncing. The green "live" dot quietly signals that the business is active and taking bookings.'],
    2: ['Header', 'Clean navigation, with booking always one tap away', 'Exactly the structure you asked for: <b>Sessions · About · Explore</b>, plus a <b>Book Now</b> button that stays visible while scrolling (sticky header). Fewer menu choices means faster decisions. On phones the menu collapses, but Book Now stays visible next to it.'],
    3: ['Hero', 'Your tagline does the emotional work; the CTA does the converting', '<ul><li><b>"Come heavy. Leave light."</b> is the hero. "heavy" is set in a heavy weight and "light" literally becomes light on load. It expresses the brand without any crystal balls.</li><li>The H1 also contains the search phrase <b>"online mediumship &amp; intuitive readings"</b> for Google and AI search.</li><li>One primary CTA (<b>Book your session</b>), plus a softer one (<b>Help me choose</b>) for visitors who aren\'t sure yet.</li><li>The reassurance line (secure payment · Zoom link sent instantly · easy rescheduling) removes the three biggest booking fears.</li><li>The <b>"Next openings"</b> card shows real-looking times converted to the visitor\'s time zone. It shows availability without fake scarcity.</li></ul>'],
    4: ['Trust strip', 'Safety and legitimacy, before the first scroll', 'Spiritual services face more scepticism than most. This strip handles the practical objections (online? time zone? payment safe? ethical?) in plain language, using the "grounded, not mystical" tone you asked for.'],
    5: ['"What are you carrying?"', 'A session finder that turns your tagline into a tool', 'The biggest drop-off on service sites is <b>choice paralysis</b>: "which one do I need?". Visitors pick what they are carrying (grief, a decision, feeling drained...). The panel shows what they could <i>leave with</i> and the right session, with a <b>pre-filled Book button</b>. That removes a step from booking. On the live site we can track which needs are clicked most, which is useful insight for your content.'],
    6: ['Approach statement', 'Positioning you against "typical psychic" sites', 'Scroll through this line and each word loses weight, moving from heavy to light. It is a quiet piece of motion that only your brand could own. The copy tells people what you are <i>not</i> (no fear, no crystal balls). That builds trust with the sceptical, high-value clients who avoid neon-purple psychic sites.'],
    7: ['Sessions & pricing', 'Transparent pricing converts better than "contact me"', '<ul><li>All four offers sit side by side, with a <b>length toggle</b> that updates the price. Visitors see the exact cost before booking, which builds trust.</li><li>A <b>"Most booked"</b> badge guides undecided visitors (anchoring).</li><li>Each card has its <b>own Book button</b> that opens the booking flow with that service and length already selected.</li><li>The cancellation policy link sits right under the prices, where hesitation happens.</li></ul>Prices shown are placeholders until we add yours.'],
    8: ['Testimonials', 'Social proof placed exactly where doubt peaks', 'Right after people see prices, they ask themselves "is it worth it?". Stories answer that. One large featured story leads, followed by a wall that can be <b>filtered by session type</b>, so a grieving visitor reads mediumship stories and a mentee reads mentorship ones. This is built for your ~20 testimonials. Another Book button follows straight away.'],
    9: ['How it works', 'Lower first-timer anxiety and show off the automation', 'Three steps make booking feel easy. The email mock-up shows exactly what clients receive (Zoom link, reminders, reschedule button). This is also how we will set up your scheduling: <b>time-zone conversion, full payment at booking, automatic Zoom links, 24h + 1h reminders, self-service rescheduling.</b>'],
    10: ['About teaser', 'People book a person, not a service', 'A short, human introduction that keeps your voice honest and grounded, with room for your training and credentials. It links to your full About page and is followed by another Book button. Facts and copy here are placeholders for your real story.'],
    11: ['Gift cards & mentorship', 'Two extra revenue streams, given their own spotlight', 'Gift cards reach people buying <i>for</i> someone grieving. That is a big, underserved audience, and the amount selector previews the card live. Mentorship is presented as a premium path on a dark card, so it reads as higher value. Both were in your requirements; here they work as conversion paths rather than footnotes.'],
    12: ['FAQ', 'Objection handling, and FAQ content for Google & AI', 'Each question removes a reason not to book: "what if no one comes through?", time zones, cancellation, privacy, payment. On the live site this block is marked up with <b>FAQ schema</b>, so Google and AI assistants can quote your answers directly.'],
    13: ['Free guide (lead magnet)', 'Capture the visitors who aren\'t ready yet', 'Most first-time visitors won\'t book on their first visit. Your free PDF guide turns them into email subscribers, so you can follow up with your welcome email and stay in touch. The same form adds them to the <b>course & events waitlist</b> with clear consent and unsubscribe wording, as you requested.'],
    14: ['Explore', 'Your SEO & AI-search engine', 'Educational articles answer the questions people type into Google and ChatGPT ("what is a mediumship reading?"). Each one brings in new visitors and links back to the matching session. A "coming soon" strip prepares the ground for courses without building them yet.'],
    15: ['Final CTA', 'One last, calm invitation', 'Visitors who scroll to the end are interested but haven\'t acted. The tagline returns as the close, with the next available time in their time zone and a gift-card option for people buying for someone else.'],
    16: ['Footer', 'Everything secondary, kept tidy', 'Contact, social links (Instagram, TikTok, Facebook), Terms, Privacy and Cancellation Policy live here, as you suggested. It includes a <b>responsible-use disclaimer</b> (not medical, legal or financial advice; 18+). This is good practice, and payment processors look for it when approving spiritual-services businesses.']
  };

  /* ------------------------------------------------------------------ */
  /* Time zones & availability                                           */
  /* ------------------------------------------------------------------ */
  var HOME_TZ = 'America/Los_Angeles';
  var userTz = 'America/New_York';
  try { userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || userTz; } catch (e) {}
  var viewTz = userTz;

  function wallParts(date, tz) {
    var p = {};
    new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
      .formatToParts(date).forEach(function (x) { p[x.type] = +x.value; });
    return p;
  }
  function zonedToDate(y, m, d, h, min, tz) {
    var guess = Date.UTC(y, m, d, h, min);
    for (var i = 0; i < 2; i++) {
      var w = wallParts(new Date(guess), tz);
      var asUtc = Date.UTC(w.year, w.month - 1, w.day, w.hour % 24, w.minute);
      guess += Date.UTC(y, m, d, h, min) - asUtc;
    }
    return new Date(guess);
  }
  function tzShort(tz) {
    try {
      var s = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' }).formatToParts(new Date()).filter(function (x) { return x.type === 'timeZoneName'; })[0];
      return s ? s.value : tz;
    } catch (e) { return tz; }
  }
  function tzCity(tz) { return tz.split('/').pop().replace(/_/g, ' '); }
  function fmtTime(d, tz) { return new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' }).format(d); }
  function fmtDay(d, tz) { return new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' }).format(d); }

  // Melissa's weekly hours (Pacific). Some slots marked as already booked for realism.
  var HOURS = { 1: [10, 11.5, 13, 15, 17.5], 2: [10, 11.5, 13, 15, 17.5, 19], 3: [11.5, 13, 15, 17.5, 19], 4: [10, 11.5, 13, 15, 17.5], 5: [10, 11.5, 13, 15], 6: [9, 10.5, 12] };
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; } return Math.abs(h); }

  var DAYS = (function build() {
    var now = new Date();
    var t = wallParts(now, HOME_TZ);
    var out = [];
    for (var i = 1; out.length < 12 && i < 20; i++) {
      var base = new Date(Date.UTC(t.year, t.month - 1, t.day + i));
      var y = base.getUTCFullYear(), m = base.getUTCMonth(), d = base.getUTCDate(), wd = base.getUTCDay();
      var hrs = HOURS[wd] || [];
      var slots = [];
      hrs.forEach(function (h) {
        var key = y + '-' + m + '-' + d + '-' + h;
        if (hash(key) % 3 === 0 && i < 7) return; // booked
        slots.push(zonedToDate(y, m, d, Math.floor(h), (h % 1) * 60, HOME_TZ));
      });
      out.push({ anchor: zonedToDate(y, m, d, 12, 0, HOME_TZ), slots: slots });
    }
    return out;
  })();
  var ALL_SLOTS = DAYS.reduce(function (a, d) { return a.concat(d.slots); }, []);

  function renderTz() {
    $$('.js-tz-short').forEach(function (el) { var c = tzCity(viewTz), a = tzShort(viewTz); el.textContent = c === a ? c + ' time' : c + ' time (' + a + ')'; });
    $$('.js-tz-long').forEach(function (el) { el.textContent = tzCity(viewTz) + ' (' + tzShort(viewTz) + ')'; });
    var first = ALL_SLOTS[0];
    if (first) {
      var label = fmtDay(first, viewTz) + ', ' + fmtTime(first, viewTz);
      $$('.js-next-slot').forEach(function (el) { el.textContent = label; });
      $$('.js-sticky-slot').forEach(function (el) { el.textContent = 'Next opening ' + label; });
      $$('.js-mail-time').forEach(function (el) { el.textContent = fmtDay(first, viewTz) + ' · ' + fmtTime(first, viewTz); });
    }
    var ul = $('.js-hero-slots');
    if (ul) {
      ul.innerHTML = ALL_SLOTS.slice(0, 3).map(function (s) {
        return '<li><span>' + fmtDay(s, viewTz) + '</span><b>' + fmtTime(s, viewTz) + '</b></li>';
      }).join('');
    }
  }
  renderTz();

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  var toastEl = $('.toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2800);
  }
  function radioGroup(group, btn) {
    $$('[role=radio]', group).forEach(function (b) { var on = b === btn; b.setAttribute('aria-checked', on); b.classList.toggle('is-on', on); });
  }
  $$('[data-soon]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); toast('This page is part of the full website build.'); });
  });
  var yr = $('.js-year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Header                                                              */
  /* ------------------------------------------------------------------ */
  var header = $('#header');
  var navLinks = $$('.nav a');
  var burger = $('.burger'), mnav = $('#mnav');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
    var first = document.getElementById('sessions');
    if (first && first.getBoundingClientRect().top > window.innerHeight * 0.5) navLinks.forEach(function (a) { a.classList.remove('is-current'); });
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  function closeMenu() { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); mnav.hidden = true; }
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mnav.hidden = !open;
  });
  $$('a', mnav).forEach(function (a) { a.addEventListener('click', closeMenu); });

  // current section highlight
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['sessions', 'about', 'explore'].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ------------------------------------------------------------------ */
  /* Session finder                                                      */
  /* ------------------------------------------------------------------ */
  var match = $('.match');
  $$('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      $$('.chip').forEach(function (c) { var on = c === chip; c.classList.toggle('is-active', on); c.setAttribute('aria-checked', on); });
      var n = NEEDS[chip.dataset.need];
      var bookBtn = $('.js-m-book');
      $('.js-m-light').textContent = n.light;
      $('.js-m-desc').textContent = n.desc;
      if (n.s === 'gift') {
        $('.js-m-name').textContent = 'A Gift Card';
        $('.js-m-price').textContent = 'from $50';
        bookBtn.textContent = 'Send a gift card';
        bookBtn.setAttribute('href', '#gifts');
        bookBtn.dataset.service = '';
      } else {
        var s = SERVICES[n.s];
        $('.js-m-name').textContent = s.name;
        $('.js-m-price').textContent = 'from $' + s.lens[0].p;
        bookBtn.textContent = 'Book this session';
        bookBtn.setAttribute('href', '#book');
        bookBtn.dataset.service = n.s;
      }
      match.classList.remove('is-swap'); void match.offsetWidth; match.classList.add('is-swap');
    });
  });
  $('.js-m-book').addEventListener('click', function (e) {
    if (this.dataset.service) { e.preventDefault(); openBook(this.dataset.service); }
  });

  /* ------------------------------------------------------------------ */
  /* Session cards: length toggle                                        */
  /* ------------------------------------------------------------------ */
  $$('.card').forEach(function (card) {
    var seg = $('.seg', card);
    $$('button', seg).forEach(function (b) {
      b.addEventListener('click', function () {
        radioGroup(seg, b);
        var pr = $('.js-price', card);
        pr.textContent = '$' + b.dataset.price;
        if (!reduce) pr.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'ease-out' });
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /* Testimonials                                                        */
  /* ------------------------------------------------------------------ */
  var LABEL = { medium: 'Mediumship Reading', tarot: 'Psychic & Tarot', healing: 'Energy Healing', mentor: 'Mentorship' };
  var COLORS = ['#96553E', '#6E7C67', '#B98545', '#2F3A31'];
  var qWrap = $('.js-quotes');
  qWrap.innerHTML = STORIES.map(function (s, i) {
    var ini = s.n.replace(/[^A-Z]/g, '').slice(0, 2);
    return '<figure class="q" data-f="' + s.f + '"><span class="stars" aria-label="5 out of 5 stars">★★★★★</span><blockquote>"' + s.q + '"</blockquote>' +
      '<figcaption><i style="background:' + COLORS[i % 4] + '" aria-hidden="true">' + ini + '</i><span><strong style="color:var(--ink)">' + s.n + '</strong><br>' + LABEL[s.f] + ' · ' + s.w + '</span></figcaption></figure>';
  }).join('');
  $$('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.filters button').forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', on); });
      $$('.q').forEach(function (q) { q.classList.toggle('is-hidden', b.dataset.f !== 'all' && q.dataset.f !== b.dataset.f); });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  /* ------------------------------------------------------------------ */
  /* Gift cards                                                          */
  /* ------------------------------------------------------------------ */
  var amtGroup = $('.amounts');
  $$('button', amtGroup).forEach(function (b) {
    b.addEventListener('click', function () { radioGroup(amtGroup, b); $('.js-gift-amt').textContent = '$' + b.dataset.amt; });
  });
  $('.js-gift-buy').addEventListener('click', function () {
    var on = $('[aria-checked=true]', amtGroup);
    toast('Prototype: a $' + on.dataset.amt + ' gift card checkout opens here.');
  });

  /* ------------------------------------------------------------------ */
  /* Lead magnet form                                                    */
  /* ------------------------------------------------------------------ */
  var gForm = $('.js-guide');
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  gForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var em = gForm.email, msg = $('.form__msg', gForm);
    if (!emailRe.test(em.value.trim())) {
      em.classList.add('is-invalid'); em.setAttribute('aria-invalid', 'true'); em.focus();
      msg.className = 'form__msg err'; msg.textContent = 'Please enter a valid email so I can send your guide.';
      return;
    }
    em.classList.remove('is-invalid'); em.removeAttribute('aria-invalid');
    var nm = gForm.name.value.trim();
    msg.className = 'form__msg ok';
    msg.textContent = 'Thank you' + (nm ? ', ' + nm : '') + '! Your guide is on its way. Check your inbox.' + (gForm.waitlist.checked ? ' You\'re on the waitlist too.' : '');
    gForm.reset();
  });
  gForm.email.addEventListener('input', function () { this.classList.remove('is-invalid'); });

  /* ------------------------------------------------------------------ */
  /* Booking flow (prototype of the scheduling integration)              */
  /* ------------------------------------------------------------------ */
  var dlg = $('#book');
  var st = { step: 1, service: null, len: null, day: 0, slot: null };
  var STEP_NAMES = { 1: 'Choose a session', 2: 'Choose a length', 3: 'Pick a time', 4: 'Your details & payment', 5: 'Confirmed' };
  var btnNext = $('.js-next'), btnBack = $('.js-back');

  var tzSel = $('.js-tzsel');
  var TZS = [userTz, 'America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York', 'America/Toronto', 'Europe/London', 'Europe/Paris', 'Australia/Sydney', 'Asia/Kolkata']
    .filter(function (v, i, a) { return a.indexOf(v) === i; });
  tzSel.innerHTML = TZS.map(function (z) { return '<option value="' + z + '">' + tzCity(z) + (z === userTz ? ' (detected)' : '') + '</option>'; }).join('');
  tzSel.addEventListener('change', function () { viewTz = tzSel.value; renderTz(); renderDays(); renderTimes(); renderSummary(); });

  function renderServices() {
    $('.js-opt-service').innerHTML = Object.keys(SERVICES).map(function (k) {
      var s = SERVICES[k];
      return '<button type="button" class="opt" role="radio" aria-checked="' + (st.service === k) + '" data-k="' + k + '"><span><strong>' + s.name + '</strong><span class="muted">' + s.desc + '</span></span><b>from $' + s.lens[0].p + '</b></button>';
    }).join('');
    $$('.js-opt-service .opt').forEach(function (b) {
      b.addEventListener('click', function () { st.service = b.dataset.k; st.len = null; renderServices(); update(); go(2); });
    });
  }
  function renderLens() {
    var s = SERVICES[st.service]; if (!s) return;
    $('.js-opt-len').innerHTML = s.lens.map(function (L) {
      return '<button type="button" class="opt" role="radio" aria-checked="' + (st.len === L.l) + '" data-l="' + L.l + '"><span><strong>' + L.t + (L.pop ? ' <span class="req">most booked</span>' : '') + '</strong><span class="muted">' + (L.sub || 'Private Zoom session') + '</span></span><b>$' + L.p + '</b></button>';
    }).join('');
    $$('.js-opt-len .opt').forEach(function (b) {
      b.addEventListener('click', function () { st.len = +b.dataset.l; renderLens(); update(); go(3); });
    });
  }
  function renderDays() {
    var wrap = $('.js-days');
    wrap.innerHTML = DAYS.map(function (d, i) {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: viewTz, weekday: 'short', day: 'numeric', month: 'short' }).formatToParts(d.anchor);
      var g = {}; parts.forEach(function (p) { g[p.type] = p.value; });
      return '<button type="button" class="day" role="tab" aria-selected="' + (i === st.day) + '" data-i="' + i + '"' + (d.slots.length ? '' : ' disabled') + '>' + g.weekday + '<b>' + g.day + '</b>' + g.month + '</button>';
    }).join('');
    $$('.day', wrap).forEach(function (b) {
      b.addEventListener('click', function () { st.day = +b.dataset.i; st.slot = null; renderDays(); renderTimes(); update(); });
    });
  }
  function renderTimes() {
    var d = DAYS[st.day];
    var wrap = $('.js-times');
    if (!d.slots.length) { wrap.innerHTML = '<p class="muted">No openings this day.</p>'; return; }
    wrap.innerHTML = d.slots.map(function (s) {
      return '<button type="button" class="time" role="radio" aria-checked="' + (st.slot && st.slot.getTime() === s.getTime()) + '" data-t="' + s.getTime() + '">' + fmtTime(s, viewTz) + '</button>';
    }).join('');
    $$('.time', wrap).forEach(function (b) {
      b.addEventListener('click', function () { st.slot = new Date(+b.dataset.t); renderTimes(); update(); });
    });
  }
  function price() { var s = SERVICES[st.service]; if (!s || !st.len) return null; return s.lens.filter(function (L) { return L.l === st.len; })[0]; }
  function renderSummary() {
    var s = SERVICES[st.service], L = price(), el = $('.js-summary');
    if (!s) { el.innerHTML = '<span class="muted">No session selected</span>'; return; }
    var line = L ? L.t + ' · $' + L.p : 'Choose a length';
    if (st.slot) line += '<br>' + fmtDay(st.slot, viewTz) + ' at ' + fmtTime(st.slot, viewTz) + ' (' + tzShort(viewTz) + ')';
    el.innerHTML = '<strong>' + s.name + '</strong><span class="muted">' + line + '</span>';
  }
  function canNext() {
    if (st.step === 1) return !!st.service;
    if (st.step === 2) return !!st.len;
    if (st.step === 3) return !!st.slot;
    if (st.step === 4) return true;
    return true;
  }
  function update() {
    $('.js-step-n').textContent = Math.min(st.step, 4);
    $('.js-step-name').textContent = STEP_NAMES[st.step];
    $('.js-bar').style.width = (Math.min(st.step, 4) / 4 * 100) + '%';
    btnBack.hidden = st.step === 1 || st.step === 5;
    btnNext.disabled = !canNext();
    var L = price();
    btnNext.textContent = st.step === 4 ? ('Pay $' + (L ? L.p : '') + ' & confirm') : st.step === 5 ? 'Done' : 'Continue';
    renderSummary();
  }
  function go(n) {
    st.step = n;
    $$('.bstep').forEach(function (s) { s.classList.toggle('is-on', +s.dataset.step === n); });
    if (n === 1) renderServices();
    if (n === 2) renderLens();
    if (n === 3) {
      if (!DAYS[st.day].slots.length) st.day = DAYS.findIndex(function (d) { return d.slots.length; });
      renderDays(); renderTimes();
    }
    if (n === 5) {
      $('.js-done-text').textContent = 'Your ' + SERVICES[st.service].name + ' is booked for ' + fmtDay(st.slot, viewTz) + ' at ' + fmtTime(st.slot, viewTz) + '. Your confirmation and private Zoom link are on their way.';
    }
    $('.book__body').scrollTop = 0;
    update();
  }
  var bForm = $('.js-bookform');
  bForm.addEventListener('input', function (e) { e.target.classList.remove('is-invalid'); e.target.removeAttribute('aria-invalid'); });
  bForm.terms.addEventListener('change', function () { this.closest('label').style.color = ''; });
  btnBack.addEventListener('click', function () { if (st.step > 1) go(st.step - 1); });
  btnNext.addEventListener('click', function () {
    if (st.step === 5) { dlg.close(); return; }
    if (st.step === 4) {
      var f = $('.js-bookform'), ok = true;
      ['first', 'email'].forEach(function (n) {
        var el = f[n], bad = n === 'email' ? !emailRe.test(el.value.trim()) : !el.value.trim();
        el.classList.toggle('is-invalid', bad); el.setAttribute('aria-invalid', bad); if (bad) ok = false;
      });
      var t = f.terms;
      t.closest('label').style.color = t.checked ? '' : '#A33A2A';
      if (!t.checked) ok = false;
      if (!ok) { toast('Please complete the highlighted fields and agree to the terms.'); return; }
      btnNext.disabled = true; btnNext.textContent = 'Processing…';
      setTimeout(function () { go(5); }, 900);
      return;
    }
    if (canNext()) go(st.step + 1);
  });

  function openBook(service, len) {
    st = { step: 1, service: service && SERVICES[service] ? service : null, len: len || null, day: 0, slot: null };
    var f = $('.js-bookform'); f.reset(); $$('.is-invalid', f).forEach(function (x) { x.classList.remove('is-invalid'); }); f.terms.closest('label').style.color = '';
    renderServices();
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else { dlg.setAttribute('open', ''); }
    document.documentElement.style.overflow = 'hidden';
    go(st.service ? (st.len ? 3 : 2) : 1);
  }
  dlg.addEventListener('close', function () { document.documentElement.style.overflow = ''; });
  $('.book__x').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  $$('.js-book').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      closeMenu();
      var svc = a.dataset.service || null, len = null;
      var card = a.closest('.card');
      if (card) { var on = $('.seg [aria-checked=true]', card); if (on) len = +on.dataset.len; }
      openBook(svc, len);
    });
  });
  if (location.hash === '#book') openBook();

  /* ------------------------------------------------------------------ */
  /* Sticky mobile CTA                                                   */
  /* ------------------------------------------------------------------ */
  var sticky = $('.sticky'), hero = $('.hero'), finalSec = $('.final'), footer = $('.footer');
  function stickyCheck() {
    var heroBottom = hero.getBoundingClientRect().bottom;
    var finalTop = finalSec.getBoundingClientRect().top;
    var show = heroBottom < 0 && finalTop > window.innerHeight * 0.6;
    sticky.classList.toggle('is-on', show);
    sticky.setAttribute('aria-hidden', !show);
    $('.btn', sticky).tabIndex = show ? 0 : -1;
  }
  window.addEventListener('scroll', stickyCheck, { passive: true }); window.addEventListener('resize', stickyCheck); stickyCheck();

  /* ------------------------------------------------------------------ */
  /* Design notes                                                        */
  /* ------------------------------------------------------------------ */
  var nToggle = $('.notes-toggle'), nPanel = $('.notes-panel'), notesOn = false;
  function showNote(n) {
    var d = NOTES[n]; if (!d) return;
    $('.notes-panel__k', nPanel).textContent = n + ' / 16 · ' + d[0];
    $('.notes-panel__t', nPanel).textContent = d[1];
    $('.notes-panel__b', nPanel).innerHTML = d[2];
    nPanel.hidden = false;
  }
  function setNotes(on) {
    notesOn = on;
    nToggle.setAttribute('aria-pressed', on);
    $('.js-notes-label').textContent = on ? 'Hide design notes' : 'Show design notes';
    $$('.pin').forEach(function (p) { p.remove(); });
    nPanel.hidden = true;
    if (!on) return;
    $$('[data-note]').forEach(function (el) {
      var n = el.dataset.note;
      var pin = document.createElement('button');
      pin.type = 'button'; pin.className = 'pin';
      pin.innerHTML = '<i>' + n + '</i>Why this?';
      pin.setAttribute('aria-label', 'Design note ' + n + ': ' + NOTES[n][0]);
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      if (el.classList.contains('topbar')) { pin.style.top = '50%'; pin.style.marginTop = '-16px'; pin.style.height = '28px'; }
      if (el.classList.contains('header')) { pin.style.top = 'auto'; pin.style.bottom = '-16px'; pin.style.right = '50%'; }
      pin.addEventListener('click', function (e) { e.stopPropagation(); showNote(n); });
      el.appendChild(pin);
    });
    showNote(3);
  }
  nToggle.addEventListener('click', function () { setNotes(!notesOn); });
  $('.notes-panel__x').addEventListener('click', function () { nPanel.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !nPanel.hidden) nPanel.hidden = true; });
  if (/[?&]notes=1/.test(location.search)) setNotes(true);

  /* ------------------------------------------------------------------ */
  /* Motion (GSAP)                                                       */
  /* ------------------------------------------------------------------ */
  function initMotion() {
    var words = $$('.js-weight span');
    if (!window.gsap || !window.ScrollTrigger || reduce) {
      words.forEach(function (w) { w.style.setProperty('--w', 400); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('js');

    // Hero intro: "Leave light." lightens and lifts
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero .eyebrow', { y: 14, opacity: 0, duration: .7 })
      .from('.hero .tag--heavy', { y: 40, opacity: 0, duration: .9 }, '-=.4')
      .fromTo('.hero .tag--light', { y: 40, opacity: 0, fontVariationSettings: '"opsz" 144, "wght" 800' }, { y: 0, opacity: 1, fontVariationSettings: '"opsz" 144, "wght" 200', duration: 1.8, ease: 'power2.out' }, '-=.5')
      .from('.hero__lead, .hero__ctas, .assure, .proof', { y: 18, opacity: 0, duration: .7, stagger: .08 }, '-=1.3')
      .from('.arch', { clipPath: 'inset(100% 0 0 0 round 240px 240px 22px 22px)', duration: 1.3, ease: 'power3.inOut' }, 0.2)
      .from('.arch img', { scale: 1.15, duration: 1.8 }, 0.2)
      .from('.float--slots', { x: -24, opacity: 0, duration: .8 }, 1.1)
      .from('.float--private', { x: 24, opacity: 0, duration: .8 }, 1.25)
      .from('.seal', { scale: .6, opacity: 0, duration: .8, ease: 'back.out(1.6)' }, 1.4);

    // Hero image parallax
    gsap.to('.arch img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Reveal blocks
    var revealSel = ['.trust__in > div', '.sec-head', '.chip', '.match', '.card', '.quote-hero', '.step', '.how__demo', '.about__media', '.about__copy', '.gift', '.mentor', '.faq__list details', '.guide__in', '.post', '.soon', '.final__in > *', '.footer__in > div'];
    revealSel.forEach(function (sel) {
      $$(sel).forEach(function (el) { el.setAttribute('data-reveal', ''); });
    });
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%',
      once: true,
      onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .08, overwrite: true }); }
    });
    // Fallback: anything already above the fold or skipped by fast jump
    ScrollTrigger.addEventListener('refresh', function () {
      $$('[data-reveal]').forEach(function (el) { if (el.getBoundingClientRect().bottom < 0) gsap.set(el, { opacity: 1, y: 0 }); });
    });

    // Manifesto: words go from heavy to light as you scroll
    words.forEach(function (w) { w.style.setProperty('--w', 800); });
    gsap.to(words, {
      '--w': 260,
      ease: 'none',
      stagger: { each: 0.06 },
      scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'bottom 45%', scrub: 0.6 }
    });

    // Gift card gentle float
    gsap.to('.gift__card', { y: -10, rotate: -2, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    // Final background drift
    gsap.fromTo('.final__bg', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom top', scrub: true } });

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
  if (document.readyState === 'complete' || window.gsap) initMotion();
  else window.addEventListener('load', initMotion);
})();
