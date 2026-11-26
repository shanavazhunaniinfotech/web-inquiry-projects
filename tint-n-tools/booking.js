/* Shared demo booking calendar + quote form (used by design A and B).
   Demo only: nothing is sent or saved. */
window.TintBooking = function (opts) {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var WEEK = ["8:00 AM","9:30 AM","11:00 AM","12:30 PM","2:00 PM","3:30 PM","5:00 PM"];
  var SAT = ["9:00 AM","10:30 AM","12:00 PM","1:30 PM"];

  var today = new Date(); today.setHours(0, 0, 0, 0);
  var first = new Date(today.getFullYear(), today.getMonth(), 1);
  var last = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  var view = new Date(first);
  var state = { date: null, time: null, service: "" };

  function rand(n) { var x = Math.sin(n) * 10000; return x - Math.floor(x); }
  function slots(d) {
    if (d.getDay() === 0) return [];
    var base = d.getDay() === 6 ? SAT : WEEK;
    var seed = d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate();
    var nowH = new Date().getHours();
    return base.map(function (t, i) {
      var booked = rand(seed + i * 7.3) < 0.4;
      if (d.getTime() === today.getTime()) {
        var m = t.match(/(\d+):\d+ (AM|PM)/);
        var h = (+m[1] % 12) + (m[2] === "PM" ? 12 : 0);
        if (h <= nowH + 1) booked = true;
      }
      return { t: t, booked: booked };
    });
  }
  function fmt(d, o) { return d.toLocaleDateString("en-US", o); }

  function renderCal() {
    $(opts.title).textContent = MONTHS[view.getMonth()] + " " + view.getFullYear();
    $(opts.prev).disabled = view <= first;
    $(opts.next).disabled = view >= last;
    var box = $(opts.days); box.innerHTML = "";
    for (var b = 0; b < view.getDay(); b++) box.appendChild(document.createElement("span"));
    var n = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (var i = 1; i <= n; i++) {
      var d = new Date(view.getFullYear(), view.getMonth(), i);
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "day"; btn.textContent = i;
      var open = slots(d).filter(function (s) { return !s.booked; }).length;
      if (d < today || !open) { btn.disabled = true; btn.setAttribute("aria-label", fmt(d, { dateStyle: "full" }) + ", unavailable"); }
      else { if (open <= 2) btn.classList.add("few"); btn.setAttribute("aria-label", fmt(d, { dateStyle: "full" }) + ", " + open + " times open"); }
      if (state.date && d.getTime() === state.date.getTime()) btn.classList.add("sel");
      btn.addEventListener("click", (function (dd) { return function () { state.date = dd; state.time = null; renderCal(); renderSlots(); picked(); }; })(d));
      box.appendChild(btn);
    }
  }
  function renderSlots() {
    var box = $(opts.slots); box.innerHTML = "";
    if (!state.date) { $(opts.slotTitle).textContent = "Pick a date to see times"; return; }
    $(opts.slotTitle).textContent = "Open times · " + fmt(state.date, { weekday: "long", month: "long", day: "numeric" });
    slots(state.date).forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "slot"; b.textContent = s.t;
      if (s.booked) b.disabled = true;
      if (state.time === s.t) b.classList.add("sel");
      b.addEventListener("click", function () {
        state.time = s.t; renderSlots(); picked();
        if (opts.onTime) opts.onTime();
      });
      box.appendChild(b);
    });
  }
  function picked() {
    var p = $(opts.picked);
    if (state.date && state.time) { p.textContent = "📅 " + fmt(state.date, { weekday: "short", month: "short", day: "numeric" }) + " · " + state.time; p.classList.add("set"); }
    else { p.textContent = state.date ? "Now pick a time for " + fmt(state.date, { month: "short", day: "numeric" }) : "No time picked yet"; p.classList.remove("set"); }
  }

  $(opts.prev).addEventListener("click", function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderCal(); });
  $(opts.next).addEventListener("click", function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderCal(); });

  // Service chips
  var chips = Array.prototype.slice.call(document.querySelectorAll(opts.chips + " button"));
  function setService(s) {
    state.service = s; $(opts.service).value = s;
    chips.forEach(function (c) { c.classList.toggle("on", c.dataset.s === s); });
    $(opts.chips).classList.remove("bad");
  }
  chips.forEach(function (c) { c.addEventListener("click", function () { setService(c.dataset.s); }); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-service]"), function (a) {
    a.addEventListener("click", function () { setService(a.dataset.service); });
  });

  // Form
  var form = $(opts.form);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    if (!state.service) { $(opts.chips).classList.add("bad"); ok = false; }
    var name = form.elements.name, phone = form.elements.phone;
    [name, phone].forEach(function (el) {
      var bad = !el.value.trim() || (el === phone && el.value.replace(/\D/g, "").length < 7);
      el.classList.toggle("bad", bad); if (bad) ok = false;
    });
    if (!ok) { opts.toast("Please choose a service and add your name and phone."); return; }
    var when = state.date && state.time ? " We've held " + fmt(state.date, { weekday: "long", month: "long", day: "numeric" }) + " at " + state.time + " for you." : "";
    $(opts.doneText).textContent = "Thanks " + name.value.trim().split(" ")[0] + "!" + when + " We'll call shortly to confirm your price.";
    $(opts.done).hidden = false;
  });
  Array.prototype.forEach.call(form.querySelectorAll("input"), function (el) {
    el.addEventListener("input", function () { el.classList.remove("bad"); });
  });
  $(opts.again).addEventListener("click", function () {
    form.reset(); state.date = state.time = null; setService("");
    renderCal(); renderSlots(); picked(); $(opts.done).hidden = true;
  });

  renderCal(); renderSlots(); picked();
};
