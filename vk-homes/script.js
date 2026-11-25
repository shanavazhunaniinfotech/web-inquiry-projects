/* VK Homes — single-page site */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Home: a new photo every 4 seconds
  var slides = $$(".slide");
  if (slides.length > 1) {
    var cur = 0, timer = null;
    // Photos load one step ahead, so the page opens fast even with many images
    var load = function (i) { var img = slides[i % slides.length].querySelector("img"); if (img && img.dataset.src) { img.src = img.dataset.src; img.removeAttribute("data-src"); } };
    var waiting = false;
    var next = function () {
      if (waiting) return;
      var to = (cur + 1) % slides.length, img = slides[to].querySelector("img");
      load(to);
      if (!img.complete) { // wait until the photo is ready, then show it
        waiting = true;
        var go = function () { waiting = false; next(); };
        img.addEventListener("load", go, { once: true }); img.addEventListener("error", go, { once: true });
        return;
      }
      slides[cur].classList.remove("is-active"); cur = to; slides[cur].classList.add("is-active");
      load(cur + 1);
    };
    if (document.readyState === "complete") load(1); else window.addEventListener("load", function () { load(1); });
    var start = function () { stop(); timer = setInterval(next, 4000); };
    var stop = function () { if (timer) clearInterval(timer); timer = null; };
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
    start();
  }

  // Mobile menu
  var burger = document.querySelector(".burger"), menu = document.getElementById("mmenu");
  var closeMenu = function () {
    burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu");
    menu.hidden = true; document.body.classList.remove("menu-open");
  };
  burger.addEventListener("click", function () {
    if (burger.getAttribute("aria-expanded") === "true") { closeMenu(); return; }
    burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", "Close menu");
    menu.hidden = false; document.body.classList.add("menu-open");
  });
  $$("#mmenu a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) closeMenu(); });

  // Header turns solid after the photos; menu highlights the section you're on
  var header = document.querySelector(".header"), hero = document.getElementById("top");
  var ids = ["top", "completed", "available", "lots", "work", "contact"];
  var secs = ids.map(function (id) { return document.getElementById(id); });
  var links = $$(".nav a, .mmenu a");
  function onScroll() {
    header.classList.toggle("is-solid", window.scrollY > hero.offsetHeight - 120);
    var line = window.innerHeight * 0.35, active = "top";
    secs.forEach(function (s, i) { if (s.getBoundingClientRect().top <= line) active = ids[i]; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = "contact";
    links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("data-sec") === active); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  // Photos fade in as they come into view
  var photos = $$(".photo");
  if (reduce || !("IntersectionObserver" in window)) photos.forEach(function (p) { p.classList.add("is-in"); });
  else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -40px 0px" });
    photos.forEach(function (p, i) { p.style.transitionDelay = (i % 3) * 80 + "ms"; io.observe(p); });
  }
})();
