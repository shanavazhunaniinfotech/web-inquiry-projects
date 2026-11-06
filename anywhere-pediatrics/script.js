/* Anywhere Pediatrics: home page interactions */
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: scrolled state + mobile menu ---------- */
  var header = document.querySelector(".header");
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");
  var mbar = document.getElementById("mbar");
  var hero = document.querySelector(".hero");
  var finalSec = document.getElementById("contact");

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    if (mbar && hero) {
      var pastHero = y > hero.offsetTop + hero.offsetHeight - 120;
      var r = finalSec.getBoundingClientRect();
      var inFinal = r.top < window.innerHeight && r.bottom > 0;
      mbar.classList.toggle("is-visible", pastHero && !inFinal);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
  }
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  document.addEventListener("click", function (e) {
    if (nav.classList.contains("is-open") && !e.target.closest(".header")) closeMenu();
  });

  /* ---------- Active nav link while scrolling ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) {
      var s = document.querySelector(a.getAttribute("href"));
      if (s) spy.observe(s);
    });
  }

  /* ---------- Cost calculator ---------- */
  var KIT = 1188, VISIT = 99;
  var kids = document.getElementById("kids");
  var visits = document.getElementById("visits");
  var fmt = function (n) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: n < 100 ? 2 : 0, minimumFractionDigits: n < 100 && n % 1 ? 2 : 0 }); };
  function fill(el) { el.style.setProperty("--p", ((el.value - el.min) / (el.max - el.min)) * 100 + "%"); }
  function calc() {
    var k = +kids.value, v = +visits.value;
    var total = KIT + v * VISIT;
    document.getElementById("kidsOut").textContent = k;
    document.getElementById("visitsOut").textContent = v;
    document.getElementById("visitsCost").textContent = fmt(v * VISIT);
    document.getElementById("total").textContent = fmt(total);
    document.getElementById("perChild").textContent = fmt(Math.round((total / 12 / k) * 100) / 100);
    fill(kids); fill(visits);
  }
  if (kids && visits) { kids.addEventListener("input", calc); visits.addEventListener("input", calc); calc(); }

  /* ---------- Two-step lead form (front-end demo) ---------- */
  var form = document.getElementById("lead");
  if (form) {
    var panes = form.querySelectorAll(".lead__pane");
    var bar = document.getElementById("leadBar");
    var stepLabel = document.getElementById("leadStep");

    function setErr(input, msg) {
      var holder = input.parentNode;
      var e = holder.querySelector(".err");
      if (msg) {
        input.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true");
        if (!e) { e = document.createElement("span"); e.className = "err"; e.id = input.id + "-err"; holder.appendChild(e); }
        input.setAttribute("aria-describedby", e.id);
        e.textContent = msg;
      } else {
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-describedby");
        if (e) e.remove();
      }
    }
    function validate() {
      var ok = true, first = null;
      var f = form.fname, p = form.phone, m = form.email;
      var checks = [
        [f, f.value.trim().length > 0, "Please enter your first name."],
        [p, p.value.replace(/\D/g, "").length >= 10, "Please enter a 10-digit phone number."],
        [m, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim()), "Please enter a valid email."]
      ];
      checks.forEach(function (c) {
        setErr(c[0], c[1] ? "" : c[2]);
        if (!c[1]) { ok = false; first = first || c[0]; }
      });
      if (first) first.focus();
      return ok;
    }
    function go(n) {
      panes.forEach(function (p) {
        var on = +p.dataset.step === n;
        p.classList.toggle("is-active", on);
        p.disabled = !on;
      });
      bar.style.width = n === 1 ? "50%" : "100%";
      stepLabel.textContent = "Step " + n + " of 2";
      var target = form.querySelector('.lead__pane[data-step="' + n + '"] input, .lead__pane[data-step="' + n + '"] select');
      if (target) target.focus({ preventScroll: true });
    }
    ["fname", "phone", "email"].forEach(function (id) {
      form[id].addEventListener("input", function () { if (this.classList.contains("is-invalid")) setErr(this, ""); });
    });
    document.getElementById("leadNext").addEventListener("click", function () { if (validate()) go(2); });
    document.getElementById("leadBack").addEventListener("click", function () { go(1); });
    form.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.tagName === "INPUT" && form.querySelector('.lead__pane[data-step="1"]').classList.contains("is-active")) {
        e.preventDefault();
        if (validate()) go(2);
      }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Prototype only: connect to the client's CRM / Wix form / email service here.
      panes.forEach(function (p) { p.hidden = true; });
      form.querySelector(".lead__progress").hidden = true;
      stepLabel.hidden = true;
      form.querySelector(".lead__title").hidden = true;
      var done = document.getElementById("leadDone");
      done.hidden = false;
      done.focus();
    });
  }

  /* ---------- Scroll reveal (GSAP, with safe fallback) ---------- */
  var items = document.querySelectorAll(".reveal");
  function showAll() { items.forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; }); }

  if (reduce) return;
  doc.classList.add("js");

  function initGsap() {
    if (!window.gsap || !window.ScrollTrigger) return false;
    gsap.registerPlugin(ScrollTrigger);
    // Hero plays straight away
    var heroItems = document.querySelectorAll(".hero .reveal");
    gsap.to(heroItems, { opacity: 1, y: 0, duration: .8, ease: "power3.out", stagger: .08, delay: .05 });
    gsap.from(".chip", { scale: .85, opacity: 0, duration: .6, ease: "back.out(1.7)", stagger: .15, delay: .6 });
    // Everything else on scroll, batched for a nice stagger
    var rest = Array.prototype.filter.call(items, function (el) { return !el.closest(".hero"); });
    ScrollTrigger.batch(rest, {
      start: "top 88%",
      once: true,
      onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, duration: .7, ease: "power3.out", stagger: .08, overwrite: true }); }
    });
    // Price count-up for a bit of delight
    document.querySelectorAll(".plan__amt").forEach(function (el) {
      var end = parseInt(el.textContent.replace(/\D/g, ""), 10), o = { v: 0 };
      ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: function () {
        gsap.to(o, { v: end, duration: 1, ease: "power2.out", onUpdate: function () { el.textContent = "$" + Math.round(o.v); } });
      } });
    });
    return true;
  }

  function fallback() {
    if (!("IntersectionObserver" in window)) { showAll(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.style.transition = "opacity .7s ease, transform .7s ease";
        en.target.style.opacity = 1;
        en.target.style.transform = "none";
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  window.addEventListener("load", function () { if (!initGsap()) fallback(); });
  // Safety net: never leave content hidden
  setTimeout(function () {
    if (!window.gsap) { fallback(); }
  }, 2500);
})();
