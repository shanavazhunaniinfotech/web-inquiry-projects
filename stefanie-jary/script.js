(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (min-width: 901px)').matches;

  /* Volunteer dashboard demo */
  var forms = {
    event: '<label>Event name<input id="d-name" value="Community Lunch"></label><div class="dash__row"><label>Day<select><option>Wednesday</option><option>Thursday</option><option>Friday</option></select></label><label>Time<input value="12:00 pm"></label></div>',
    news: '<label>Headline<input value="Makers Market is back this Saturday!"></label><label>Short text<input value="40 local stalls, food and music from 9 am."></label>',
    photo: '<label>Choose photos<input value="garden-working-bee.jpg, art-club.jpg"></label><label>Where<select><option>Homepage gallery</option><option>Programs page</option></select></label>'
  };
  var labels = { event: 'Publish event', news: 'Publish news', photo: 'Update photos' };
  var oks = { event: '✓ Published. It\'s live in "What\'s On".', news: '✓ Posted to the News section.', photo: '✓ Photos updated on the homepage.' };
  var act = 'event';
  function setAct(a) {
    act = a;
    $$('.dash__btn').forEach(function (b) { b.classList.toggle('on', b.dataset.act === a); });
    $('#dashform').innerHTML = forms[a] + '<button type="button" class="btn btn--ink btn--full" id="d-pub">' + labels[a] + '</button><p class="dash__ok" id="d-ok" hidden></p>';
    if (window.gsap && !reduce) gsap.from('#dashform > *', { y: 12, opacity: 0, duration: .4, stagger: .05 });
  }
  $$('.dash__btn').forEach(function (b) { b.addEventListener('click', function () { setAct(b.dataset.act); }); });
  document.addEventListener('click', function (e) { if (e.target.id === 'd-pub') { var ok = $('#d-ok'); ok.textContent = oks[act]; ok.hidden = false; } });
  setAct('event');

  /* URL request */
  $('#u-go').addEventListener('click', function () {
    var v = $('#u').value.trim().replace(/^https?:\/\//, '');
    var ok = $('#u-ok');
    ok.hidden = false;
    ok.textContent = v ? 'Thanks! Please send "' + v + '" in our chat and we\'ll start the homepage redesign right away.' : 'Type the current website address above, or simply send it to us in our chat.';
    if (!v) $('#u').focus();
  });

  /* Active nav */
  var links = $$('.topnav__links a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) io.observe(s); });
  }

  if (!window.gsap || reduce) return;
  gsap.registerPlugin(ScrollTrigger);

  var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('.topnav__in', { y: -30, opacity: 0, duration: .8 })
    .from('.chip', { y: 16, opacity: 0, duration: .6 }, '-=.5')
    .from('.hero h1 > span', { yPercent: 110, duration: 1.1, stagger: .1 }, '-=.3')
    .from('.lede, .cta', { y: 24, opacity: 0, duration: .8, stagger: .1 }, '-=.7')
    .from('.device', { y: 80, opacity: 0, rotateY: -25, duration: 1.3 }, '-=1.1')
    .from('.verdict li', { y: 30, opacity: 0, duration: .7, stagger: .08 }, '-=.8');

  $$('.title').forEach(function (t) { gsap.from(t, { y: 60, opacity: 0, duration: 1, scrollTrigger: { trigger: t, start: 'top 85%' } }); });
  gsap.from('.reason', { y: 50, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.reasons', start: 'top 80%' } });
  gsap.from('.cmp tbody tr', { x: -30, opacity: 0, duration: .6, stagger: .05, scrollTrigger: { trigger: '.cmp', start: 'top 80%' } });
  gsap.from('.dash', { y: 80, rotate: 3, opacity: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.vols', start: 'top 75%' } });
  gsap.from('.ticks li', { x: -20, opacity: 0, duration: .6, stagger: .08, scrollTrigger: { trigger: '.ticks', start: 'top 85%' } });
  gsap.fromTo('.frame', { scale: .9, y: 60 }, { scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.concept', start: 'top bottom', end: 'center center', scrub: true } });
  gsap.from('.url__box', { y: 60, opacity: 0, duration: 1, scrollTrigger: { trigger: '.url', start: 'top 80%' } });
  gsap.from('.steps li', { y: 30, opacity: 0, duration: .6, stagger: .08, scrollTrigger: { trigger: '.steps', start: 'top 88%' } });

  if (fine) {
    $$('.magnet').forEach(function (b) {
      var xTo = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' }), yTo = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
      b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .25); yTo((e.clientY - r.top - r.height / 2) * .35); });
      b.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
  }
})();
