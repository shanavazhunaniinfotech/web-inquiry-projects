/* VK Homes — Version 2 "Quiet Luxury" (single page) */
(function () {
  "use strict";
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var root = document.documentElement;
  var motion = root.classList.contains("motion");

  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* Smooth scrolling */
  var lenis = null;
  if (motion && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
  }
  var header = document.querySelector(".header");
  function goTo(hash) {
    var el = hash === "#top" ? 0 : document.querySelector(hash);
    if (el === null) return;
    var off = -(header.offsetHeight - 18);
    if (lenis) lenis.scrollTo(el, { offset: el === 0 ? 0 : off, duration: 1.5 });
    else if (el === 0) window.scrollTo({ top: 0, behavior: motion ? "smooth" : "auto" });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + off, behavior: motion ? "smooth" : "auto" });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var h = a.getAttribute("href"); if (h.length < 2) return;
      e.preventDefault(); if (!menu.hidden) closeMenu(); goTo(h);
    });
  });

  /* Home: a new photo every 5 seconds, with a hairline timer */
  var slides = $$(".slide"), bar = document.querySelector(".hero__bar i"), cur = 0, timer = null;
  function runBar() { if (!bar) return; bar.classList.remove("run"); void bar.offsetWidth; bar.classList.add("run"); }
  function next() {
    slides[cur].classList.remove("is-active");
    cur = (cur + 1) % slides.length;
    var img = slides[cur].querySelector("img"); img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    slides[cur].classList.add("is-active");
    runBar();
  }
  function start() { stop(); runBar(); timer = setInterval(next, 5000); }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
  if (slides.length > 1) setTimeout(start, motion ? 1500 : 0); // begin once the intro has lifted

  /* Mobile menu */
  var burger = document.querySelector(".burger"), menu = document.getElementById("mmenu");
  function closeMenu() {
    burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu");
    menu.hidden = true; document.body.classList.remove("menu-open"); if (lenis) lenis.start();
  }
  burger.addEventListener("click", function () {
    if (burger.getAttribute("aria-expanded") === "true") { closeMenu(); return; }
    burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", "Close menu");
    menu.hidden = false; document.body.classList.add("menu-open"); if (lenis) lenis.stop();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) closeMenu(); });

  /* Header state + active menu item */
  var hero = document.getElementById("top");
  var ids = ["top", "completed", "available", "lots", "work", "contact"];
  var secs = ids.map(function (id) { return document.getElementById(id); });
  var links = $$(".nav a, .mmenu a");
  function onScroll() {
    header.classList.toggle("is-solid", window.scrollY > hero.offsetHeight - 140);
    var line = window.innerHeight * .38, active = "top";
    secs.forEach(function (s, i) { if (s.getBoundingClientRect().top <= line) active = ids[i]; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = "contact";
    links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("data-sec") === active); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* Reveal titles, photos and contact lines as they enter */
  var items = $$(".title, .tile, .contact__line");
  if (!motion || !("IntersectionObserver" in window)) { items.forEach(function (el) { el.classList.add("is-in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  $$(".grid").forEach(function (g) {
    var cols = getComputedStyle(g).gridTemplateColumns.split(" ").length;
    Array.prototype.slice.call(g.children).forEach(function (t, i) { t.style.transitionDelay = (i % cols) * 110 + "ms"; });
  });
  $$(".contact__line").forEach(function (l, i) { l.style.transitionDelay = (i * 140) + "ms"; });
  items.forEach(function (el) { io.observe(el); });
})();
