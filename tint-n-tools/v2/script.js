(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  $("#yr").textContent = new Date().getFullYear();

  var tt;
  function toast(m) { var t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove("show"); }, 3200); }
  $$(".js-wholesale").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); toast("Demo: this opens your wholesale store login."); }); });

  // Nav
  var nav = $("#nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 20); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var burger = $("#burger"), links = $("#links");
  burger.addEventListener("click", function () { var o = links.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
  $$("#links a").forEach(function (a) { a.addEventListener("click", function () { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }); });

  // Count up
  function countUp(el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || "", t0 = null;
    if (reduce) { el.textContent = end.toLocaleString() + suf; return; }
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / 1600);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Reveal
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        Array.prototype.forEach.call(e.target.querySelectorAll("[data-count]"), countUp);
        if (e.target.dataset.count) countUp(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
    $$("[data-count]").forEach(countUp);
  }

  // Before / after
  var range = $("#baRange");
  function ba() { var v = range.value; $("#baAfter").style.clipPath = "inset(0 0 0 " + v + "%)"; $("#baLine").style.left = v + "%"; }
  range.addEventListener("input", ba); ba();

  // Shade
  var notes = {
    70: "Barely there. Max heat rejection, factory look.",
    50: "Subtle and classy, with crystal-clear visibility.",
    35: "The sweet spot. Sleek look, clear night vision.",
    20: "Dark and private. Our most-requested rear shade.",
    5: "Limo black. Maximum privacy (check local laws)."
  };
  function shade(v) {
    $("#film").style.opacity = (1 - v / 100) * 0.92;
    $("#vlt").textContent = v + "%"; $("#vltTxt").textContent = notes[v];
    $$("#seg button").forEach(function (b) { b.classList.toggle("on", +b.dataset.v === v); });
  }
  $$("#seg button").forEach(function (b) { b.addEventListener("click", function () { shade(+b.dataset.v); }); });
  shade(35);

  // Gallery filter
  $$("#filters button").forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.dataset.f;
      $$("#filters button").forEach(function (x) { x.classList.toggle("on", x === b); });
      $$("#masonry figure").forEach(function (fig) { fig.classList.toggle("hide", f !== "all" && fig.dataset.c !== f); });
    });
  });

  // Reviews carousel
  var qs = $$(".quote"), qi = 0, timer;
  function showQ(i) { qi = (i + qs.length) % qs.length; qs.forEach(function (q, n) { q.classList.toggle("on", n === qi); }); }
  function auto() { clearInterval(timer); if (!reduce) timer = setInterval(function () { showQ(qi + 1); }, 6000); }
  $("#rPrev").addEventListener("click", function () { showQ(qi - 1); auto(); });
  $("#rNext").addEventListener("click", function () { showQ(qi + 1); auto(); });
  auto();

  // Booking
  window.TintBooking({
    title: "#calTitle", prev: "#prevM", next: "#nextM", days: "#days", slots: "#slots", slotTitle: "#slotTitle",
    picked: "#picked", chips: "#chips", service: "#service", form: "#form", done: "#done", doneText: "#doneTxt", again: "#again",
    toast: toast,
    onTime: function () { if (window.innerWidth < 900) $("#form").scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
})();
