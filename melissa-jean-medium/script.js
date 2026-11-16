/* Melissa Jean Medium — premium home page concept (v2) */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var U = function (id, w, h) { return 'https://images.unsplash.com/' + id + '?w=' + w + (h ? '&h=' + h : '') + '&fit=crop&q=72&auto=format'; };

  /* ================================================================== */
  /* Data                                                                */
  /* ================================================================== */
  var SERVICES = {
    medium:  { name: 'Mediumship Reading', desc: 'Connect with loved ones in spirit', img: 'photo-1490730141103-6cac27aaab94', lens: [{ l: 30, p: 95, t: '30 minutes' }, { l: 60, p: 175, t: '60 minutes', pop: true }] },
    tarot:   { name: 'Psychic & Tarot Reading', desc: 'Guidance on love, work, purpose & timing', img: 'photo-1474418397713-7ede21d49118', lens: [{ l: 30, p: 85, t: '30 minutes' }, { l: 60, p: 150, t: '60 minutes' }] },
    healing: { name: 'Intuitive Energy Healing', desc: 'Release what feels heavy, return grounded', img: 'photo-1544367567-0f2fcb009e0b', lens: [{ l: 30, p: 80, t: '30 minutes' }, { l: 60, p: 140, t: '60 minutes' }] },
    mentor:  { name: 'Mentorship', desc: 'Develop your gift with structure & ethics', img: 'photo-1455390582262-044cdead277a', lens: [{ l: 180, p: 420, t: '3-hour package', sub: 'Your first 60-minute session is booked now' }, { l: 360, p: 795, t: '6-hour package', sub: 'Your first 60-minute session is booked now' }] }
  };

  var NEEDS = {
    grief:    { s: 'medium',  img: 'photo-1470116945706-e6bf5d5a53ca', light: 'The comfort of knowing the connection never ended, and the peace of hearing from them.', desc: 'Evidential messages from loved ones in spirit: names, memories and details that help you recognise who is coming through.' },
    decision: { s: 'tarot',   img: 'photo-1495954484750-af469f2f9be5', light: 'Clarity on your options, and the confidence to choose without second-guessing.', desc: 'Intuitive insight with tarot as a mirror, so you can see the path in front of you and trust your next step.' },
    unknown:  { s: 'tarot',   img: 'photo-1474418397713-7ede21d49118', light: 'A calmer view of what is unfolding, and what is truly yours to focus on now.', desc: 'A grounded look at love, work, purpose and timing, with practical guidance rather than fear or fixed predictions.' },
    drained:  { s: 'healing', img: 'photo-1544367567-0f2fcb009e0b', light: 'A quieter mind, a softer body, and energy that feels like your own again.', desc: 'A calm, guided session to release what is weighing on you and return to a steadier, more grounded you.' },
    gift:     { s: 'mentor',  img: 'photo-1455390582262-044cdead277a', light: 'Confidence in your intuition, with the structure and ethics to use it well.', desc: 'One-on-one mentorship to develop your abilities at your own pace. Prepaid packages start at three hours.' },
    other:    { s: 'gift',    img: 'photo-1465146344425-f00d5f5c8f07', light: 'A meaningful way to show you care, when words don\'t feel like enough.', desc: 'Gift any session or amount, sent by email instantly or on a date you choose, so they can book when they are ready.' }
  };

  var STORIES = [
    { f: 'medium',  n: 'Sarah R.', w: 'Ohio', q: 'I almost cancelled because I was so nervous. Within ten minutes Melissa described my dad\'s workshop, down to the radio he never turned off. I cried, then I laughed, and I left feeling like he\'d been in the room.', s: 'She described my dad\'s workshop, down to the radio he never turned off.' },
    { f: 'tarot',   n: 'Kara M.', w: 'California', q: 'I came in stuck between two job offers and spinning. She didn\'t tell me what to do. She helped me hear what I already knew. I accepted the next morning and haven\'t looked back.', s: 'She helped me hear what I already knew.' },
    { f: 'healing', n: 'Jenna P.', w: 'Ontario, Canada', q: 'I didn\'t realise how much I was holding in my body until it started to let go. I slept better that night than I had in months. It felt like putting down a bag I\'d carried for years.', s: 'Like putting down a bag I\'d carried for years.' },
    { f: 'medium',  n: 'Marcus T.', w: 'Georgia', q: 'Booking from my phone took two minutes and the Zoom link was in my inbox straight away. My brother came through with a joke only he would make. I laughed for the first time since he passed.', s: 'I laughed for the first time since he passed.' },
    { f: 'mentor',  n: 'Alicia W.', w: 'Arizona', q: 'Melissa\'s mentorship gave me the structure and boundaries I was missing. She is generous, grounded and deeply ethical. For the first time, I trust my own readings.', s: 'For the first time, I trust my own readings.' },
    { f: 'tarot',   n: 'Priya S.', w: 'London, UK', q: 'Warm, direct and kind. The times were already shown in UK time, which made it easy. I left with a clear plan instead of a head full of worry.', s: 'I left with a clear plan instead of a head full of worry.' },
    { f: 'medium',  n: 'Ellen B.', w: 'Michigan', q: 'We gave a reading to my mother-in-law after Dad passed. She called us crying happy tears. It\'s the most meaningful gift we\'ve ever given.', s: 'The most meaningful gift we\'ve ever given.' },
    { f: 'healing', n: 'Rachel D.', w: 'Florida', q: 'Calm, gentle and nothing "woo" about the way she explains things. I felt safe the whole time, and lighter for days afterwards.', s: 'Nothing "woo" about it. I felt safe the whole time.' },
    { f: 'mentor',  n: 'Hannah K.', w: 'Oregon', q: 'Every session left me with practical tools and so much more confidence. Melissa teaches with integrity and real warmth.', s: 'Practical tools and so much more confidence.' },
    { f: 'medium',  n: 'Danielle L.', w: 'Texas', q: 'I was sceptical going in. She gave me my grandmother\'s nickname for me, one nobody outside our family knew. The comfort that gave me is hard to put into words.', s: 'She gave me my grandmother\'s nickname for me.' }
  ];

  var NOTES = {
    1: ['Header', 'Book Now is always one tap away', '<ul><li>Exactly the structure Melissa asked for: <b>Sessions · About · Explore</b>, plus a gold <b>Book Now</b> button that never scrolls away.</li><li>Fewer menu choices means faster decisions.</li><li>A live <b>"Next opening"</b> line in the header shows she is active and has availability, without fake countdowns.</li><li>The header switches automatically between light and dark so it stays readable over every section.</li><li>On phones, a <b>sticky Book bar</b> appears after the hero, because most of her clients will book from a phone.</li></ul>'],
    2: ['Hero', 'Emotion first, then a clear next step', '<ul><li>Full-screen, warm, cinematic photography: calm and elegant, with no crystal balls or neon.</li><li>The tagline is the headline. <b>"heavy"</b> is set in a heavy weight, and <b>"light"</b> visibly loses weight as it appears. The brand promise is told through type.</li><li>The real H1 contains the search phrase <b>"online mediumship, psychic and tarot readings"</b> for Google and AI search.</li><li>One primary CTA, plus a softer <b>"Help me choose"</b> for undecided visitors.</li><li>A <b>portrait card</b> puts Melissa\'s face above the fold. People book a person they trust.</li><li>The glass proof bar shows <b>rating · next opening in the visitor\'s own time zone · private 1:1 Zoom</b>: the three facts that move people to click.</li><li>A short branded intro plays once per visit only, so it never slows down returning visitors.</li></ul>'],
    3: ['"You can arrive with…" scene', 'The tagline, experienced as you scroll', 'As visitors scroll, heavy words (<b>grief, doubt, exhaustion, what-ifs</b>) turn into light ones (<b>connection, clarity, ease, peace</b>), while the photo brightens from dusk to light. It is the signature moment of the site, and it is memorable and shareable. It also tells sceptical visitors, gently, what she offers and what she <i>doesn\'t</i>: no fear, no crystal balls.'],
    4: ['Session finder', 'Removes the biggest reason people leave: "Which one do I need?"', 'Visitors choose what they are carrying. The card instantly shows the outcome they may leave with, the right session, the starting price and a <b>Book button with that session already selected</b>, which removes a step from booking. "Someone I love is carrying it" routes gift buyers to gift cards. On the live site we can track which needs are chosen most, which is valuable content insight.'],
    5: ['Sessions & pricing', 'Transparent, editorial, and one click from booking', '<ul><li>Elegant rows read like a premium menu and stay easy to compare on phones.</li><li>The <b>length toggle</b> updates the price instantly. Clear pricing builds trust and reduces "contact me" friction.</li><li>The <b>"Most booked"</b> badge guides undecided visitors.</li><li>Each Book button opens the booking flow with that service and length already chosen.</li><li>The <b>connection promise</b> (risk reversal) answers the #1 mediumship fear: "what if no one comes through?". The wording is a suggestion for Melissa to approve.</li></ul>'],
    6: ['Client stories', 'Social proof exactly where doubt peaks', 'Right after pricing, visitors ask "is it worth it?". A large auto-playing story slider answers emotionally, the filter lets a grieving visitor read only mediumship stories, and two slow-moving rows of short quotes show volume (built for her ~20 testimonials). The 5.0 rating summary and a Book button follow immediately.'],
    7: ['How it works', 'Show the booking experience, so first-timers feel safe', 'An animated phone walks through the real client journey: <b>pick a time in your own time zone → pay & agree to terms → instant email with Zoom link and 24h/1h reminders → the private session</b>. This lowers first-timer anxiety, and it also shows Melissa we understood her scheduling, payment and Zoom requirements.'],
    8: ['About Melissa', 'People book a person, not a service', 'A large, warm portrait, a short story in her grounded voice, her signature, quick facts and space for her training and credentials. Her pull-quote, "My job isn\'t to impress you…", positions her against flashy psychic brands. A Book button follows straight away. Copy and facts are placeholders for her real story.'],
    9: ['Gift cards & mentorship', 'Two extra revenue streams, each with a spotlight', 'The gift card tilts in 3D as you move over it and updates live as the amount changes. It targets people buying <i>for</i> someone who is grieving, a large and underserved audience. Mentorship gets a dark, image-led card so it reads as the premium path.'],
    10: ['FAQ', 'Objection handling, plus content Google and AI can quote', 'Each answer removes a reason not to book: guarantees, time zones, cancellations, privacy, payment. The side card with Melissa\'s photo makes it personal ("I reply personally"). On the live site this block gets <b>FAQ schema</b> for Google and AI assistants.'],
    11: ['Free guide (lead magnet)', 'Capture the visitors who aren\'t ready yet', 'Most first-time visitors won\'t book on their first visit. A 3D mock-up of her free PDF guide makes the offer feel tangible, and the form adds them to her email list (with the automated welcome email) and, optionally, the <b>course & circles waitlist</b>, with clear consent and unsubscribe wording.'],
    12: ['Explore', 'SEO and AI-search content hub', 'Articles answer what people actually search ("what is a mediumship reading?"), bring in new visitors, and link to the matching session. A "coming soon" bar prepares the ground for courses without paying to build them now.'],
    13: ['Final CTA', 'One last, calm invitation', 'For visitors who scrolled all the way down but haven\'t acted. The tagline returns at full scale, and "light" lightens as you arrive. It shows the next opening in their time zone, the Book button, and a gift-card option for people buying for someone else.'],
    14: ['Footer', 'Everything secondary, kept tidy', 'Contact details, Instagram, TikTok and Facebook, Terms, Privacy and Cancellation Policy live here, as Melissa suggested, under a large signature wordmark. It includes a <b>responsible-use disclaimer</b> (not medical, legal or financial advice; 18+). This is good practice, and card processors look for it when approving spiritual-services businesses.']
  };

  /* ================================================================== */
  /* Time zones & availability                                           */
  /* ================================================================== */
  var HOME_TZ = 'America/Los_Angeles';
  var userTz = 'America/New_York';
  try { userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || userTz; } catch (e) {}
  var viewTz = userTz;

  function wallParts(date, tz) {
    var p = {};
    new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      .formatToParts(date).forEach(function (x) { p[x.type] = +x.value; });
    return p;
  }
  function zonedToDate(y, m, d, h, min, tz) {
    var target = Date.UTC(y, m, d, h, min), guess = target;
    for (var i = 0; i < 2; i++) {
      var w = wallParts(new Date(guess), tz);
      guess += target - Date.UTC(w.year, w.month - 1, w.day, w.hour % 24, w.minute);
    }
    return new Date(guess);
  }
  function tzShort(tz) {
    try { var s = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' }).formatToParts(new Date()).filter(function (x) { return x.type === 'timeZoneName'; })[0]; return s ? s.value : tz; } catch (e) { return tz; }
  }
  function tzCity(tz) { return tz.split('/').pop().replace(/_/g, ' '); }
  function fmtTime(d, tz) { return new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' }).format(d); }
  function fmtDay(d, tz) { return new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' }).format(d); }
  function fmtWd(d, tz) { return new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' }).format(d); }

  var HOURS = { 1: [10, 11.5, 13, 15, 17.5], 2: [10, 11.5, 13, 15, 17.5, 19], 3: [11.5, 13, 15, 17.5, 19], 4: [10, 11.5, 13, 15, 17.5], 5: [10, 11.5, 13, 15], 6: [9, 10.5, 12] };
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; } return Math.abs(h); }
  var DAYS = (function () {
    var t = wallParts(new Date(), HOME_TZ), out = [];
    for (var i = 1; out.length < 12 && i < 20; i++) {
      var b = new Date(Date.UTC(t.year, t.month - 1, t.day + i));
      var y = b.getUTCFullYear(), m = b.getUTCMonth(), d = b.getUTCDate();
      var slots = [];
      (HOURS[b.getUTCDay()] || []).forEach(function (h) {
        if (hash(y + '-' + m + '-' + d + '-' + h) % 3 === 0 && i < 7) return;
        slots.push(zonedToDate(y, m, d, Math.floor(h), (h % 1) * 60, HOME_TZ));
      });
      out.push({ anchor: zonedToDate(y, m, d, 12, 0, HOME_TZ), slots: slots });
    }
    return out;
  })();
  var ALL = DAYS.reduce(function (a, d) { return a.concat(d.slots); }, []);

  function renderTz() {
    var city = tzCity(viewTz), abbr = tzShort(viewTz);
    $$('.js-tz-city').forEach(function (el) { el.textContent = city; });
    $$('.js-tz-long').forEach(function (el) { el.textContent = city === abbr ? city : city + ' (' + abbr + ')'; });
    var f = ALL[0]; if (!f) return;
    $$('.js-next-slot').forEach(function (el) { el.textContent = fmtDay(f, viewTz) + ', ' + fmtTime(f, viewTz); });
    $$('.js-next-short').forEach(function (el) { el.textContent = fmtWd(f, viewTz) + ' ' + fmtTime(f, viewTz); });
    $$('.js-mail-time').forEach(function (el) { el.textContent = fmtDay(f, viewTz) + ' · ' + fmtTime(f, viewTz); });
  }
  renderTz();

  /* ================================================================== */
  /* Helpers                                                             */
  /* ================================================================== */
  var toastEl = $('.toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3000);
  }
  function radio(group, btn) { $$('[role=radio]', group).forEach(function (b) { var on = b === btn; b.setAttribute('aria-checked', on); b.classList.toggle('is-on', on); }); }
  $$('[data-soon]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); toast('This page is part of the full website build.'); }); });
  var yr = $('.js-year'); if (yr) yr.textContent = new Date().getFullYear();
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ================================================================== */
  /* Smooth scroll (Lenis, desktop only)                                 */
  /* ================================================================== */
  var lenis = null;
  if (window.Lenis && finePointer && !reduce) {
    lenis = new Lenis({ lerp: 0.095, wheelMultiplier: 1 });
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }
  function scrollToEl(el) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  $$('a[href^="#"]').forEach(function (a) {
    var h = a.getAttribute('href');
    if (h === '#' || h === '#book' || a.classList.contains('js-book') || a.hasAttribute('data-soon')) return;
    a.addEventListener('click', function (e) {
      var t = document.getElementById(h.slice(1)); if (!t) return;
      e.preventDefault(); closeMenu(); scrollToEl(t);
    });
  });

  /* ================================================================== */
  /* Header                                                              */
  /* ================================================================== */
  var header = $('#header');
  var darkSecs = $$('.hero, .marquee, .finder, .stories, .guide, .final, .footer');
  var navLinks = $$('.nav a');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-solid', y > 40);
    var probe = header.offsetHeight - 6, dark = false;
    for (var i = 0; i < darkSecs.length; i++) { var r = darkSecs[i].getBoundingClientRect(); if (r.top <= probe && r.bottom >= probe) { dark = true; break; } }
    header.classList.toggle('on-dark', dark);
    var cur = null;
    ['sessions', 'about', 'explore'].forEach(function (id) { var s = document.getElementById(id); var r = s.getBoundingClientRect(); if (r.top < window.innerHeight * 0.45 && r.bottom > window.innerHeight * 0.45) cur = id; });
    navLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + cur); });
    stickyCheck();
  }

  /* mobile menu */
  var burger = $('.burger'), menu = $('#menu');
  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu');
    root.classList.remove('menu-open'); if (lenis) lenis.start();
  }
  burger.addEventListener('click', function () {
    if (!menu.hidden) { closeMenu(); return; }
    menu.hidden = false; burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Close menu');
    root.classList.add('menu-open'); if (lenis) lenis.stop();
  });

  /* sticky mobile CTA */
  var sticky = $('.sticky'), hero = $('.hero'), finalSec = $('.final');
  function stickyCheck() {
    var show = hero.getBoundingClientRect().bottom < 0 && finalSec.getBoundingClientRect().top > window.innerHeight * 0.5 && menu.hidden;
    sticky.classList.toggle('is-on', show);
    sticky.setAttribute('aria-hidden', String(!show));
    $('.btn', sticky).tabIndex = show ? 0 : -1;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ================================================================== */
  /* Finder                                                              */
  /* ================================================================== */
  var rec = $('.rec'), rImg = $('.js-r-img'), rBook = $('.js-r-book');
  $$('.need').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.need').forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-checked', on); });
      var n = NEEDS[b.dataset.need];
      rImg.classList.add('is-out');
      setTimeout(function () { rImg.src = U(n.img, 900, 640); rImg.onload = function () { rImg.classList.remove('is-out'); }; }, 250);
      $('.js-r-light').textContent = n.light;
      $('.js-r-desc').textContent = n.desc;
      if (n.s === 'gift') {
        $('.js-r-name').textContent = 'A Gift Card';
        $('.js-r-price').textContent = 'from $50';
        $('span', rBook).textContent = 'Send a gift card';
        rBook.dataset.service = '';
      } else {
        var s = SERVICES[n.s];
        $('.js-r-name').textContent = s.name;
        $('.js-r-price').textContent = 'from $' + s.lens[0].p;
        $('span', rBook).textContent = 'Book this session';
        rBook.dataset.service = n.s;
      }
      var body = $('.rec__body');
      body.classList.remove('is-swap'); void body.offsetWidth; body.classList.add('is-swap');
      if (window.innerWidth < 960) { var r = rec.getBoundingClientRect(); if (r.top > window.innerHeight * 0.7) scrollToEl(rec); }
    });
  });
  rBook.addEventListener('click', function (e) {
    e.preventDefault();
    if (rBook.dataset.service) openBook(rBook.dataset.service);
    else scrollToEl(document.getElementById('gifts'));
  });

  /* ================================================================== */
  /* Session rows                                                        */
  /* ================================================================== */
  $$('.srow').forEach(function (row) {
    var seg = $('.seg', row);
    $$('button', seg).forEach(function (b) {
      b.addEventListener('click', function () {
        radio(seg, b);
        var pr = $('.js-price', row);
        pr.textContent = '$' + b.dataset.price;
        if (!reduce && pr.animate) pr.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: 'cubic-bezier(.2,.8,.2,1)' });
      });
    });
  });

  /* ================================================================== */
  /* Stories                                                             */
  /* ================================================================== */
  var LABEL = { medium: 'Mediumship Reading', tarot: 'Psychic & Tarot', healing: 'Energy Healing', mentor: 'Mentorship' };
  var COLORS = ['#A35F44', '#7C8B6F', '#B98545', '#5E5248'];
  function ini(n) { return n.replace(/[^A-Z]/g, '').slice(0, 2); }
  var list = STORIES.slice(), cur = 0, DUR = 7000, t0 = 0, paused = false, inView = false, raf;
  var barsEl = $('.js-bars'), slideEl = $('.slide');
  function buildBars() {
    barsEl.innerHTML = list.map(function (s, i) { return '<button type="button" aria-label="Story ' + (i + 1) + '"><span></span></button>'; }).join('');
    $$('button', barsEl).forEach(function (b, i) { b.addEventListener('click', function () { show(i); }); });
  }
  function show(i) {
    cur = (i + list.length) % list.length; t0 = performance.now();
    var s = list[cur];
    $('.js-s-quote').textContent = '“' + s.q + '”';
    $('.js-s-name').textContent = s.n;
    $('.js-s-meta').textContent = LABEL[s.f] + ' · ' + s.w;
    var ic = $('.js-s-ini'); ic.textContent = ini(s.n); ic.style.background = COLORS[STORIES.indexOf(s) % 4];
    slideEl.classList.remove('is-swap'); void slideEl.offsetWidth; slideEl.classList.add('is-swap');
    $$('button', barsEl).forEach(function (b, j) { b.classList.toggle('done', j < cur); $('span', b).style.transform = j < cur ? 'scaleX(1)' : 'scaleX(0)'; });
  }
  var pausedAt = 0;
  function pause() { if (!paused) { paused = true; pausedAt = performance.now(); } }
  function resume() { if (paused) { paused = false; t0 += performance.now() - pausedAt; } }
  function tick(now) {
    if (!paused && inView && list.length > 1) {
      var p = Math.min((now - t0) / DUR, 1);
      var bar = $$('span', barsEl)[cur]; if (bar) bar.style.transform = 'scaleX(' + p + ')';
      if (p >= 1) show(cur + 1);
    }
    raf = requestAnimationFrame(tick);
  }
  $('.slider').addEventListener('mouseenter', pause);
  $('.slider').addEventListener('mouseleave', resume);
  $('.js-prev').addEventListener('click', function () { show(cur - 1); });
  $('.js-next-s').addEventListener('click', function () { show(cur + 1); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      var was = inView; inView = en[0].isIntersecting;
      if (inView && !was) show(cur); // restart the current story's timer when it comes into view
    }, { threshold: 0.3 }).observe($('.slider'));
  } else inView = true;
  $$('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.filters button').forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', on); });
      list = b.dataset.f === 'all' ? STORIES.slice() : STORIES.filter(function (s) { return s.f === b.dataset.f; });
      buildBars(); show(0);
    });
  });
  buildBars(); show(0); if (!reduce) requestAnimationFrame(tick);

  // wall of short quotes
  function wallHtml(arr) {
    var html = arr.map(function (s) {
      return '<figure class="wcard"><span class="stars" aria-hidden="true">★★★★★</span><p>“' + s.s + '”</p><small><b>' + s.n + '</b> · ' + LABEL[s.f] + '</small></figure>';
    }).join('');
    return html + html;
  }
  $('.js-wall-a').innerHTML = wallHtml(STORIES.slice(0, 5));
  $('.js-wall-b').innerHTML = wallHtml(STORIES.slice(5));
  $$('.js-wall-a figure, .js-wall-b figure').forEach(function (f, i) { if (i % 10 >= 5) f.setAttribute('aria-hidden', 'true'); });

  /* ================================================================== */
  /* How it works: phone demo                                            */
  /* ================================================================== */
  var hsteps = $$('.hstep'), scrs = $$('.scr'), hIdx = 0, hTimer = null, hStarted = false;
  function setStep(i, timed) {
    hIdx = i;
    hsteps.forEach(function (b, j) { var on = j === i; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); b.classList.remove('is-timed'); });
    scrs.forEach(function (s, j) { s.classList.toggle('is-on', j === i); });
    clearTimeout(hTimer);
    if (timed && !reduce) {
      void hsteps[i].offsetWidth; hsteps[i].classList.add('is-timed');
      hTimer = setTimeout(function () { setStep((hIdx + 1) % 3, true); }, 5500);
    }
  }
  hsteps.forEach(function (b, i) { b.addEventListener('click', function () { setStep(i, true); }); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      if (en[0].isIntersecting && !hStarted) { hStarted = true; setStep(0, true); }
      else if (!en[0].isIntersecting && hStarted) { hStarted = false; clearTimeout(hTimer); }
    }, { threshold: 0.35 }).observe($('.how'));
  }

  /* ================================================================== */
  /* Gift cards & tilt                                                   */
  /* ================================================================== */
  var amts = $('.amounts');
  $$('button', amts).forEach(function (b) {
    b.addEventListener('click', function () {
      radio(amts, b);
      var el = $('.js-gift-amt'); el.textContent = '$' + b.dataset.amt;
      if (!reduce && el.animate) el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: 'ease-out' });
    });
  });
  $('.js-gift-buy').addEventListener('click', function () {
    toast('Prototype: a $' + $('[aria-checked=true]', amts).dataset.amt + ' gift card checkout opens here.');
  });
  if (finePointer && !reduce) {
    $$('.js-tilt').forEach(function (el) {
      var host = el.parentElement, isBook = el.classList.contains('book3d__obj');
      host.addEventListener('pointermove', function (e) {
        var r = host.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = isBook ? 'rotateY(' + (-24 + x * 22) + 'deg) rotateX(' + (6 - y * 14) + 'deg)' : 'rotateY(' + x * 18 + 'deg) rotateX(' + (-y * 14) + 'deg)';
        el.style.setProperty('--mx', (x + 0.5) * 100 + '%'); el.style.setProperty('--my', (y + 0.5) * 100 + '%');
      });
      host.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
    $$('.btn--mag').forEach(function (b) {
      b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * 0.18 + 'px,' + (e.clientY - r.top - r.height / 2) * 0.28 + 'px)'; });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* counters */
  if ('IntersectionObserver' in window && !reduce) {
    var cio = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, to = +el.dataset.to, st = performance.now();
        (function step(now) { var p = Math.min((now - st) / 1400, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(st);
      });
    }, { threshold: 0.6 });
    $$('.js-count').forEach(function (el) { el.textContent = '0'; cio.observe(el); });
  }

  /* FAQ: one open at a time, smooth */
  $$('.acc details').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) $$('.acc details').forEach(function (o) { if (o !== d) o.open = false; });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  /* ================================================================== */
  /* Guide form                                                          */
  /* ================================================================== */
  var gForm = $('.js-guide');
  gForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var em = gForm.email, msg = $('.gform__msg', gForm);
    if (!emailRe.test(em.value.trim())) {
      em.classList.add('is-invalid'); em.setAttribute('aria-invalid', 'true'); em.focus();
      msg.className = 'gform__msg err'; msg.textContent = 'Please enter a valid email so I can send your guide.';
      return;
    }
    em.classList.remove('is-invalid'); em.removeAttribute('aria-invalid');
    var nm = gForm.name.value.trim();
    msg.className = 'gform__msg ok';
    msg.textContent = 'Thank you' + (nm ? ', ' + nm : '') + '! Your guide is on its way.' + (gForm.waitlist.checked ? ' You\'re on the waitlist too.' : '');
    gForm.reset();
  });
  gForm.email.addEventListener('input', function () { this.classList.remove('is-invalid'); this.removeAttribute('aria-invalid'); });

  /* ================================================================== */
  /* Booking dialog                                                      */
  /* ================================================================== */
  var dlg = $('#book');
  var st = { step: 1, service: null, len: null, day: 0, slot: null };
  var NAMES = { 1: 'Choose a session', 2: 'Choose a length', 3: 'Pick a time', 4: 'Your details & payment', 5: 'Confirmed' };
  var bNext = $('.js-next'), bBack = $('.js-back'), bImg = $('.js-bk-img');
  var tzSel = $('.js-tzsel');
  var TZS = [userTz, 'America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York', 'America/Toronto', 'Europe/London', 'Europe/Paris', 'Australia/Sydney', 'Asia/Kolkata'].filter(function (v, i, a) { return a.indexOf(v) === i; });
  tzSel.innerHTML = TZS.map(function (z) { return '<option value="' + z + '">' + tzCity(z) + (z === userTz ? ' (detected)' : '') + '</option>'; }).join('');
  tzSel.addEventListener('change', function () { viewTz = tzSel.value; renderTz(); renderDays(); renderTimes(); update(); });

  function renderServices() {
    $('.js-opt-service').innerHTML = Object.keys(SERVICES).map(function (k) {
      var s = SERVICES[k];
      return '<button type="button" class="opt" role="radio" aria-checked="' + (st.service === k) + '" data-k="' + k + '"><span><strong>' + s.name + '</strong><small>' + s.desc + '</small></span><b>from $' + s.lens[0].p + '</b></button>';
    }).join('');
    $$('.js-opt-service .opt').forEach(function (b) { b.addEventListener('click', function () { st.service = b.dataset.k; st.len = null; go(2); }); });
  }
  function renderLens() {
    var s = SERVICES[st.service]; if (!s) return;
    $('.js-opt-len').innerHTML = s.lens.map(function (L) {
      return '<button type="button" class="opt" role="radio" aria-checked="' + (st.len === L.l) + '" data-l="' + L.l + '"><span><strong>' + L.t + (L.pop ? '<span class="tagpill">Most booked</span>' : '') + '</strong><small>' + (L.sub || 'Private one-on-one Zoom session') + '</small></span><b>$' + L.p + '</b></button>';
    }).join('');
    $$('.js-opt-len .opt').forEach(function (b) { b.addEventListener('click', function () { st.len = +b.dataset.l; go(3); }); });
  }
  function renderDays() {
    var wrap = $('.js-days');
    wrap.innerHTML = DAYS.map(function (d, i) {
      var g = {}; new Intl.DateTimeFormat('en-US', { timeZone: viewTz, weekday: 'short', day: 'numeric', month: 'short' }).formatToParts(d.anchor).forEach(function (p) { g[p.type] = p.value; });
      return '<button type="button" class="day" role="tab" aria-selected="' + (i === st.day) + '" data-i="' + i + '"' + (d.slots.length ? '' : ' disabled') + '>' + g.weekday + '<b>' + g.day + '</b>' + g.month + '</button>';
    }).join('');
    $$('.day', wrap).forEach(function (b) { b.addEventListener('click', function () { st.day = +b.dataset.i; st.slot = null; renderDays(); renderTimes(); update(); }); });
  }
  function renderTimes() {
    var d = DAYS[st.day], wrap = $('.js-times');
    if (!d.slots.length) { wrap.innerHTML = '<p>No openings this day.</p>'; return; }
    wrap.innerHTML = d.slots.map(function (s) {
      return '<button type="button" class="time" role="radio" aria-checked="' + (!!st.slot && st.slot.getTime() === s.getTime()) + '" data-t="' + s.getTime() + '">' + fmtTime(s, viewTz) + '</button>';
    }).join('');
    $$('.time', wrap).forEach(function (b) { b.addEventListener('click', function () { st.slot = new Date(+b.dataset.t); renderTimes(); update(); }); });
  }
  function price() { var s = SERVICES[st.service]; return s && st.len ? s.lens.filter(function (L) { return L.l === st.len; })[0] : null; }
  function renderSummary() {
    var s = SERVICES[st.service], L = price(), big = $('.js-summary'), mini = $('.js-summary-mini');
    if (!s) { big.innerHTML = '<span class="muted-l">Choose a session to begin</span>'; mini.innerHTML = ''; return; }
    var when = st.slot ? fmtDay(st.slot, viewTz) + ' at ' + fmtTime(st.slot, viewTz) + ' (' + tzShort(viewTz) + ')' : '';
    big.innerHTML = '<strong>' + s.name + '</strong>' + (L ? L.t : 'Choose a length') + (when ? '<br>' + when : '') + (L ? '<span class="price">$' + L.p + '</span>' : '');
    mini.innerHTML = '<strong>' + s.name + '</strong>' + (L ? ' · ' + L.t + ' · $' + L.p : '') + (when ? '<br>' + when : '');
  }
  function canNext() { return st.step === 1 ? !!st.service : st.step === 2 ? !!st.len : st.step === 3 ? !!st.slot : true; }
  function update() {
    $('.js-step-n').textContent = Math.min(st.step, 4);
    $('.js-step-name').textContent = NAMES[st.step];
    $('.js-bar').style.width = (Math.min(st.step, 4) / 4 * 100) + '%';
    bBack.hidden = st.step === 1 || st.step === 5;
    bNext.disabled = !canNext();
    var L = price();
    $('span', bNext).textContent = st.step === 4 ? 'Pay $' + (L ? L.p : '') + ' & confirm' : st.step === 5 ? 'Done' : 'Continue';
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
    if (n === 5) $('.js-done-text').textContent = 'Your ' + SERVICES[st.service].name + ' is booked for ' + fmtDay(st.slot, viewTz) + ' at ' + fmtTime(st.slot, viewTz) + '. Your confirmation and private Zoom link are on their way.';
    if (st.service) { var want = U(SERVICES[st.service].img, 700, 1000); if (bImg.src !== want) bImg.src = want; }
    $('.bk__body').scrollTop = 0;
    update();
  }
  var bForm = $('.js-bookform');
  bForm.addEventListener('input', function (e) { e.target.classList.remove('is-invalid'); e.target.removeAttribute('aria-invalid'); });
  bForm.terms.addEventListener('change', function () { this.closest('label').classList.remove('is-err'); });
  bBack.addEventListener('click', function () { if (st.step > 1) go(st.step - 1); });
  bNext.addEventListener('click', function () {
    if (st.step === 5) { dlg.close(); return; }
    if (st.step === 4) {
      var ok = true;
      ['first', 'email'].forEach(function (n) {
        var el = bForm[n], bad = n === 'email' ? !emailRe.test(el.value.trim()) : !el.value.trim();
        el.classList.toggle('is-invalid', bad); el.setAttribute('aria-invalid', String(bad)); if (bad) ok = false;
      });
      if (!bForm.terms.checked) { bForm.terms.closest('label').classList.add('is-err'); ok = false; }
      if (!ok) { toast('Please complete the highlighted fields and agree to the terms.'); return; }
      bNext.disabled = true; $('span', bNext).textContent = 'Processing…';
      setTimeout(function () { go(5); }, 900);
      return;
    }
    if (canNext()) go(st.step + 1);
  });
  function openBook(service, len) {
    st = { step: 1, service: service && SERVICES[service] ? service : null, len: len || null, day: 0, slot: null };
    bForm.reset(); $$('.is-invalid', bForm).forEach(function (x) { x.classList.remove('is-invalid'); }); bForm.terms.closest('label').classList.remove('is-err');
    renderServices();
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
    root.style.overflow = 'hidden'; if (lenis) lenis.stop();
    go(st.service ? (st.len ? 3 : 2) : 1);
  }
  dlg.addEventListener('close', function () { root.style.overflow = ''; if (lenis) lenis.start(); });
  $('.bk__x').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  $$('.js-book').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); closeMenu();
      var len = null, row = a.closest('.srow');
      if (row) { var on = $('.seg [aria-checked=true]', row); if (on) len = +on.dataset.len; }
      openBook(a.dataset.service || null, len);
    });
  });
  if (location.hash === '#book') openBook();

  /* ================================================================== */
  /* Design notes                                                        */
  /* ================================================================== */
  var nToggle = $('.notes-toggle'), nPanel = $('.notes-panel'), notesOn = false, nCur = 2, NMAX = 14;
  function showNote(n, jump) {
    var d = NOTES[n]; if (!d) return; nCur = +n;
    $('.notes-panel__k', nPanel).textContent = n + ' / ' + NMAX + ' · ' + d[0];
    $('.notes-panel__t', nPanel).textContent = d[1];
    $('.notes-panel__b', nPanel).innerHTML = d[2];
    nPanel.hidden = false; nPanel.scrollTop = 0;
    if (jump) { var el = $('[data-note="' + n + '"]'); if (el && n > 1) scrollToEl(el); }
  }
  function setNotes(on) {
    notesOn = on; nToggle.setAttribute('aria-pressed', on);
    $('.js-notes-label').textContent = on ? 'Hide notes' : 'Design notes';
    $$('.pin').forEach(function (p) { p.remove(); });
    nPanel.hidden = true;
    if (!on) return;
    $$('[data-note]').forEach(function (el) {
      var n = el.dataset.note, pin = document.createElement('button');
      pin.type = 'button'; pin.className = 'pin';
      pin.innerHTML = '<i>' + n + '</i>Why this?';
      pin.setAttribute('aria-label', 'Design note ' + n + ': ' + NOTES[n][0]);
      pin.addEventListener('click', function (e) { e.stopPropagation(); showNote(n); });
      var host = el.classList.contains('weight') ? $('.weight__pin') : el;
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      host.appendChild(pin);
    });
    showNote(2);
  }
  nToggle.addEventListener('click', function () { setNotes(!notesOn); });
  $('.notes-panel__x').addEventListener('click', function () { nPanel.hidden = true; });
  $('.js-n-prev').addEventListener('click', function () { showNote(nCur <= 1 ? NMAX : nCur - 1, true); });
  $('.js-n-next').addEventListener('click', function () { showNote(nCur >= NMAX ? 1 : nCur + 1, true); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (!nPanel.hidden) nPanel.hidden = true; closeMenu(); } });
  if (/[?&]notes=1/.test(location.search)) setNotes(true);

  /* ================================================================== */
  /* Motion                                                              */
  /* ================================================================== */
  function splitWords(el) {
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            var o = document.createElement('span'); o.className = 'wl';
            var i = document.createElement('span'); i.className = 'wi'; i.textContent = w;
            o.appendChild(i); frag.appendChild(o);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
    })(el);
  }

  function finishIntro() {
    try { sessionStorage.setItem('mjm_intro', '1'); } catch (e) {}
    root.classList.remove('intro-on');
  }

  function initMotion() {
    var hasGsap = window.gsap && window.ScrollTrigger && !reduce;
    var introOn = root.classList.contains('intro-on');
    if (!hasGsap) { if (introOn) setTimeout(finishIntro, 2300); return; }

    gsap.registerPlugin(ScrollTrigger);
    root.classList.add('motion');

    /* hero entrance */
    var heroTl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
    heroTl
      .from('.hero__bg', { scale: 1.12, duration: 2.4, ease: 'power3.out' }, 0)
      .from('.hero__eyebrow', { y: 20, opacity: 0, duration: 1 }, 0.15)
      .from('.ht--heavy > span', { yPercent: 60, opacity: 0, duration: 1.3, stagger: 0.08 }, 0.25)
      .fromTo('.ht--light > span', { yPercent: 60, opacity: 0, fontVariationSettings: '"opsz" 144, "wght" 800, "SOFT" 0' }, { yPercent: 0, opacity: 1, fontVariationSettings: '"opsz" 144, "wght" 180, "SOFT" 100', duration: 2.2, stagger: 0.1, ease: 'power3.out' }, 0.55)
      .from('.hero__lead, .hero__ctas, .hero__assure', { y: 24, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.8)
      .from('.hero__portrait', { clipPath: 'inset(100% 0% 0% 0% round 200px 200px 24px 24px)', duration: 1.6, ease: 'expo.inOut' }, 0.3)
      .from('.hero__portrait img', { scale: 1.3, duration: 2, ease: 'power3.out' }, 0.3)
      .from('.hero__hello', { x: -20, opacity: 0, duration: 1 }, 1.2)
      .from('.seal', { scale: 0.5, opacity: 0, duration: 1.1, ease: 'back.out(1.7)' }, 1.3)
      .from('.hero__bar', { yPercent: 100, opacity: 0, duration: 1.2 }, 1.0);

    if (introOn) {
      gsap.timeline({ delay: 1.9 })
        .to('.intro__in', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' })
        .to('.intro', { clipPath: 'inset(0 0 100% 0)', duration: 1.0, ease: 'expo.inOut', onStart: function () { heroTl.play(0); } }, '-=0.1')
        .add(finishIntro);
    } else heroTl.play(0);

    gsap.to('.hero__bg', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__copy', { yPercent: -10, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '40% top', end: 'bottom top', scrub: true } });

    /* split headings */
    $$('[data-split]').forEach(function (h) {
      splitWords(h);
      gsap.from($$('.wi', h), { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: h, start: 'top 86%', once: true } });
    });

    /* reveals */
    ['.head__sub', '.need', '.rec', '.srow', '.promise', '.rating', '.filters', '.slider', '.hstep', '.how__stage', '.about__lead', '.about__copy > p:not(.kicker):not(.about__lead)', '.facts', '.creds', '.about__ctas', '.gift', '.mentor', '.ask', '.acc details', '.book3d', '.guide__copy > p', '.gform', '.post', '.soon', '.footer__top > *', '.final__p', '.final__ctas']
      .forEach(function (sel) { $$(sel).forEach(function (el) { el.setAttribute('data-reveal', ''); }); });
    $$('.about__frame').forEach(function (el) { el.setAttribute('data-reveal', 'img'); });
    ScrollTrigger.batch('[data-reveal=""]', {
      start: 'top 90%', once: true,
      onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, overwrite: true }); }
    });
    $$('[data-reveal="img"]').forEach(function (el) {
      gsap.to(el, { clipPath: 'inset(0% 0% 0% 0% round 30px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true }, onComplete: function () { el.style.clipPath = ''; } });
    });

    /* weight scene */
    var pairs = $$('.pair');
    var wTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.weight', start: 'top top', end: function () { return '+=' + window.innerHeight * 1.8; },
        pin: '.weight__pin', scrub: 0.8, anticipatePin: 1,
        onUpdate: function (self) { var p = self.progress; $('.js-meter-label').textContent = p < 0.3 ? 'Heavy' : p < 0.8 ? 'Lighter' : 'Light'; }
      }
    });
    pairs.forEach(function (p, i) {
      var at = i * 1;
      wTl.to($('.pair__heavy', p), { opacity: 0, yPercent: -35, filter: 'blur(8px)', fontVariationSettings: '"opsz" 144, "wght" 200, "SOFT" 0', duration: 1, ease: 'power2.in' }, at)
         .fromTo($('.pair__light', p), { opacity: 0, yPercent: 35, filter: 'blur(8px)' }, { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' }, at + 0.45);
    });
    wTl.to('.weight__media img', { filter: 'brightness(1.05) saturate(1.05) contrast(1)', ease: 'none', duration: pairs.length + 0.5 }, 0)
       .fromTo('.weight__media img', { scale: 1.15 }, { scale: 1, ease: 'none', duration: pairs.length + 0.5 }, 0)
       .to('.js-meter', { scaleX: 1, ease: 'none', duration: pairs.length + 0.5 }, 0);

    /* parallax */
    gsap.fromTo('.about__frame img', { yPercent: -14 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.final__bg', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.js-final-light', { '--fw': 800 }, { '--fw': 200, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top 75%', end: 'center 55%', scrub: 0.6 } });
    gsap.from('.footer__word', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.footer__word', start: 'top 95%', once: true } });
    gsap.to('.gcard', { y: -10, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  if (window.gsap || document.readyState === 'complete') initMotion();
  else window.addEventListener('load', initMotion);
})();
