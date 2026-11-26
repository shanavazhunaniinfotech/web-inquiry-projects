(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  $("#yr").textContent = new Date().getFullYear();

  // Loader
  window.addEventListener("load", function () { setTimeout(function () { document.body.classList.add("ready"); }, reduce ? 0 : 700); });
  setTimeout(function () { document.body.classList.add("ready"); }, 2500);

  // Toast
  var tt;
  function toast(m) { var t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove("show"); }, 3200); }
  $$(".js-wholesale").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); toast("Demo: this opens your wholesale store login."); }); });

  // Nav
  var nav = $("#nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var burger = $("#burger"), links = $("#links");
  burger.addEventListener("click", function () { var o = links.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
  $$("#links a").forEach(function (a) { a.addEventListener("click", function () { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }); });

  // Reveal on scroll
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }

  // Count up
  function countUp(el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || "", t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / 1600), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString() + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    if (reduce) { el.textContent = end.toLocaleString() + suf; return; }
    requestAnimationFrame(step);
  }
  setTimeout(function () { $$("[data-count]").forEach(countUp); }, reduce ? 0 : 1100);

  // Parallax hero
  var px = $("[data-parallax]");
  if (px && !reduce) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) px.style.transform = "translateY(" + y * 0.25 + "px)";
    }, { passive: true });
  }

  // Before / after
  var range = $("#baRange"), after = $("#baAfter"), handle = $("#baHandle");
  function ba() { var v = range.value; after.style.clipPath = "inset(0 0 0 " + v + "%)"; handle.style.left = v + "%"; }
  range.addEventListener("input", ba); ba();

  // Shade preview
  var notes = {
    70: "Barely there. Max heat rejection, factory look.",
    50: "Subtle and classy. Crystal-clear visibility.",
    35: "The sweet spot. Sleek look, clear night vision.",
    20: "Dark and private. Our most-requested rear shade.",
    5: "Limo black. Maximum privacy (check local laws)."
  };
  $$("#shadeBtns button").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = +b.dataset.v;
      $$("#shadeBtns button").forEach(function (x) { x.classList.toggle("on", x === b); });
      $("#shadeFilm").style.opacity = (1 - v / 100) * 0.92;
      $("#shadeBig").textContent = v + "%";
      $("#shadeTxt").textContent = notes[v];
    });
  });
  $("#shadeFilm").style.opacity = (1 - 0.35) * 0.92;

  // Work rail
  var rail = $("#workRail");
  function railBy(dir) { rail.scrollBy({ left: dir * rail.clientWidth * 0.6, behavior: "smooth" }); }
  $("#railPrev").addEventListener("click", function () { railBy(-1); });
  $("#railNext").addEventListener("click", function () { railBy(1); });
  var down = false, sx = 0, sl = 0;
  rail.addEventListener("mousedown", function (e) { down = true; sx = e.pageX; sl = rail.scrollLeft; rail.style.scrollSnapType = "none"; });
  window.addEventListener("mouseup", function () { if (down) { down = false; rail.style.scrollSnapType = ""; } });
  rail.addEventListener("mousemove", function (e) { if (down) { e.preventDefault(); rail.scrollLeft = sl - (e.pageX - sx); } });

  // Booking
  window.TintBooking({
    title: "#calTitle", prev: "#prevM", next: "#nextM", days: "#days", slots: "#slots", slotTitle: "#slotTitle",
    picked: "#picked", chips: "#chips", service: "#service", form: "#form", done: "#done", doneText: "#doneTxt", again: "#again",
    toast: toast,
    onTime: function () { if (window.innerWidth < 1080) $("#form").scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
})();
