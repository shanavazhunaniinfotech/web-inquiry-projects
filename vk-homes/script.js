/* VK Homes — shared script for all pages */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) document.documentElement.classList.add("reduced");

  // Year in footer
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Home: a new photo every 5 seconds
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  if (slides.length > 1) {
    var cur = 0, timer = null;
    var next = function () {
      slides[cur].classList.remove("is-active");
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add("is-active");
    };
    var start = function () { stop(); timer = setInterval(next, 5000); };
    var stop = function () { if (timer) clearInterval(timer); timer = null; };
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
    start();
  }

  // Mobile menu
  var burger = document.querySelector(".burger"), menu = document.getElementById("mmenu");
  if (burger && menu) {
    var close = function () {
      burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu");
      menu.hidden = true; document.body.classList.remove("menu-open");
    };
    burger.addEventListener("click", function () {
      if (burger.getAttribute("aria-expanded") === "true") { close(); return; }
      burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", "Close menu");
      menu.hidden = false; document.body.classList.add("menu-open");
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) close(); });
  }

  // Gallery photos fade in as they come into view
  var photos = document.querySelectorAll(".photo");
  if (photos.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      photos.forEach(function (p) { p.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -40px 0px" });
      photos.forEach(function (p, i) { p.style.transitionDelay = (i % 3) * 80 + "ms"; io.observe(p); });
    }
  }
})();
