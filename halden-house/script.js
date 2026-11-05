/* Halden House — home page concept. Vanilla JS, no dependencies. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Toast ---------- */
  var toastEl = $('#toast'), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 4200);
  }

  /* ---------- Header: solid after the hero ---------- */
  var header = $('#header'), hero = $('.hero');
  function onScrollHeader() {
    var limit = hero ? hero.offsetHeight - header.offsetHeight - 40 : 40;
    header.classList.toggle('is-solid', window.scrollY > limit);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  window.addEventListener('resize', onScrollHeader);
  onScrollHeader();

  /* Active nav link */
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['stay', 'eat', 'gather', 'place'].forEach(function (id) { var el = document.getElementById(id); if (el) navIO.observe(el); });
  }

  /* ---------- Mobile drawer ---------- */
  var menuBtn = $('.menu-btn'), drawer = $('#drawer');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  }
  menuBtn.addEventListener('click', function () { setMenu(drawer.hidden); });
  $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!drawer.hidden) setMenu(false); if (notesOn) setNotes(false); }
  });

  /* ---------- Booking bar ---------- */
  var arrive = $('#arrive'), nights = $('#nights'), guests = $('#guests');
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  var today = new Date();
  var suggested = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
  // Suggest the next Friday two weeks out: a natural short-break start.
  while (suggested.getDay() !== 5) suggested.setDate(suggested.getDate() + 1);
  arrive.min = iso(today);
  arrive.value = iso(suggested);

  // Make the whole field clickable on browsers that support showPicker
  $$('.field').forEach(function (f) {
    f.addEventListener('click', function (e) {
      var input = $('input, select', f);
      if (e.target === input) return;
      input.focus();
      if (input.showPicker) { try { input.showPicker(); } catch (err) { /* not allowed */ } }
    });
  });

  $('#checkBtn').addEventListener('click', function () {
    if (!arrive.value) { arrive.focus(); toast('Choose an arrival date first.'); return; }
    var d = new Date(arrive.value + 'T12:00:00');
    var label = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
    var n = nights.value, g = guests.value;
    // In the live site this opens the hotel's booking engine with the dates prefilled, e.g.
    // window.location.href = 'https://book.haldenhouse.com/?arrive=' + arrive.value + '&nights=' + n + '&guests=' + g;
    toast('Concept: this opens your booking engine for ' + n + ' night' + (n > 1 ? 's' : '') + ' from ' + label + ', ' + g + ' guest' + (g > 1 ? 's' : '') + '.');
  });

  // Any "Check availability" link: scroll to the bar and focus the date
  $$('[data-book]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var bar = $('#book');
      var top = bar.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 24;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(function () { arrive.focus({ preventScroll: true }); }, reduceMotion ? 0 : 650);
    });
  });

  // Table booking
  $$('[data-table]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var eat = $('#eat').getBoundingClientRect();
      var inView = eat.top < window.innerHeight * .6 && eat.bottom > window.innerHeight * .4;
      if (!inView) return; // let the link scroll to the restaurant section first
      e.preventDefault();
      toast('Concept: this opens your table booking tool (OpenTable, SevenRooms or similar).');
    });
  });

  /* ---------- Rooms rail arrows ---------- */
  var rail = $('.rooms');
  var arrows = $$('.rooms__nav .arrow');
  function updateArrows() {
    var max = rail.scrollWidth - rail.clientWidth - 4;
    arrows[0].disabled = rail.scrollLeft <= 4;
    arrows[1].disabled = rail.scrollLeft >= max;
  }
  arrows.forEach(function (b) {
    b.addEventListener('click', function () {
      var card = $('.room', rail);
      var step = card ? card.getBoundingClientRect().width + 24 : 320;
      rail.scrollBy({ left: step * Number(b.dataset.dir), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
  rail.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  updateArrows();

  /* ---------- FAQ: one open at a time ---------- */
  var faqs = $$('.faq__list details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el, i) {
      // light stagger for siblings
      var sibs = $$('.reveal', el.parentElement);
      var idx = sibs.indexOf(el);
      if (idx > 0) el.style.transitionDelay = Math.min(idx, 4) * 90 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Mobile sticky bar ---------- */
  var mbar = $('#mbar'), booking = $('#book'), finalSec = $('.final'), footer = $('.footer');
  function onScrollBar() {
    var pastBooking = booking.getBoundingClientRect().bottom < 0;
    var fr = finalSec.getBoundingClientRect();
    var nearEnd = fr.top < window.innerHeight * .75;
    var show = (pastBooking && !nearEnd) || notesOn;
    mbar.classList.toggle('is-visible', show);
    doc.classList.toggle('mbar-on', show && window.innerWidth <= 800);
  }
  window.addEventListener('scroll', onScrollBar, { passive: true });

  /* =========================================================
     Design notes mode — explains why each section is placed where it is.
     Presentation only; removed for the live build.
     ========================================================= */
  var notesOn = false;
  var toggle = $('#notesToggle'), panel = $('#notesPanel'), body = $('#notesBody');
  var noted = $$('[data-note]');

  var intro = document.createElement('div');
  intro.innerHTML =
    '<p class="notes-intro">Every section has one job: move a visitor one step closer to booking, without ever feeling sold to.</p>' +
    '<p class="notes-flow"><strong>The order:</strong> feel it (hero) &rarr; act early (dates) &rarr; trust it (proof) &rarr; ' +
    'believe in it (philosophy) &rarr; choose (rooms, dinner) &rarr; picture it (a day here) &rarr; go bigger (whole house) &rarr; ' +
    'remove doubts (guests, book direct, travel, questions) &rarr; act (final call).<br><br>' +
    '<strong>Fixed points kept:</strong> no portfolio grid, no founder portrait, no contact forms, no prices. ' +
    'Built from standard Squarespace 7.1 sections plus custom CSS, and light enough to load fast on a phone.</p>';
  body.appendChild(intro);

  var items = [];
  noted.forEach(function (el, i) {
    var n = i + 1, title = el.getAttribute('data-note-title'), text = el.getAttribute('data-note');

    var item = document.createElement('button');
    item.type = 'button';
    item.className = 'note-item';
    item.innerHTML = '<span class="note-item__num">' + n + '</span><h4></h4><p></p>';
    $('h4', item).textContent = title;
    $('p', item).textContent = text;
    item.addEventListener('click', function () { goTo(el); });
    body.appendChild(item);
    items.push(item);

    var pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'note-pin';
    pin.innerHTML = '<b>' + n + '</b><span></span>';
    $('span', pin).textContent = title;
    pin.setAttribute('aria-label', 'Design note ' + n + ': ' + title);
    pin.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); if (!notesOn) setNotes(true); focusItem(i); });
    if (getComputedStyle(el).position === 'static') el.classList.add('has-pin');
    el.appendChild(pin);
  });

  function goTo(el) {
    if (el.id === 'header' || el.id === 'mbar') { focusItemByEl(el); return; }
    var top = el.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  function focusItemByEl(el) { focusItem(noted.indexOf(el)); }
  function focusItem(i) {
    items.forEach(function (it, j) { it.classList.toggle('is-current', j === i); });
    noted.forEach(function (el, j) { el.classList.toggle('is-noted', j === i); });
    var it = items[i];
    if (it) body.scrollTo({ top: it.offsetTop - body.offsetTop - 8, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  // Track which section is on screen while notes are open
  var sectionNotes = noted.filter(function (el) { return el.tagName === 'SECTION' || el.tagName === 'FOOTER'; });
  if ('IntersectionObserver' in window) {
    var noteIO = new IntersectionObserver(function (entries) {
      if (!notesOn) return;
      entries.forEach(function (e) { if (e.isIntersecting) focusItemByEl(e.target); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sectionNotes.forEach(function (el) { noteIO.observe(el); });
  }

  function setNotes(on) {
    notesOn = on;
    doc.classList.toggle('notes-on', on);
    panel.hidden = false;
    toggle.setAttribute('aria-pressed', String(on));
    $('.notes-toggle__label', toggle).textContent = on ? 'Hide design notes' : 'Show design notes';
    toggle.setAttribute('aria-label', on ? 'Hide design notes' : 'Show design notes');
    try { localStorage.setItem('halden-notes', on ? '1' : '0'); } catch (e) { /* storage unavailable */ }
    onScrollBar();
    if (on) {
      // pick the section currently in view
      var mid = window.innerHeight * .45, current = 0;
      sectionNotes.forEach(function (el) { if (el.getBoundingClientRect().top < mid) current = noted.indexOf(el); });
      focusItem(current);
    }
  }
  toggle.addEventListener('click', function () { setNotes(!notesOn); });
  $('#notesClose').addEventListener('click', function () { setNotes(false); });

  var params = new URLSearchParams(location.search);
  var saved = null;
  try { saved = localStorage.getItem('halden-notes'); } catch (e) { /* ignore */ }
  if (params.has('notes') || saved === '1') setNotes(true);
  onScrollBar();
})();
