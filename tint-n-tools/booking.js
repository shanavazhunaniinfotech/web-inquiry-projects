/* Shared demo booking calendar + quote form (design A and B).
   Demo only: nothing is sent or saved. Returns a small API. */
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
      var booked = rand(seed + i * 7.3) < 0.45;
      if (d.getTime() === today.getTime()) {
        var m = t.match(/(\d+):\d+ (AM|PM)/);
        var h = (+m[1] % 12) + (m[2] === "PM" ? 12 : 0);
        if (h <= nowH + 1) booked = true;
      }
      return { t: t, booked: booked };
    });
  }
  function fmt(d, o) { return d.toLocaleDateString("en-US", o); }
  function emit() { if (opts.onChange) opts.onChange(state); }

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
      if (d.getTime() === today.getTime()) btn.classList.add("today");
      if (state.date && d.getTime() === state.date.getTime()) btn.classList.add("sel");
      btn.addEventListener("click", (function (dd) { return function () { state.date = dd; state.time = null; renderCal(); renderSlots(); picked(); emit(); }; })(d));
      box.appendChild(btn);
    }
  }
  function renderSlots() {
    var box = $(opts.slots); box.innerHTML = "";
    if (!state.date) { $(opts.slotTitle).textContent = "Pick a date to see open times"; return; }
    $(opts.slotTitle).textContent = "Open times · " + fmt(state.date, { weekday: "long", month: "long", day: "numeric" });
    slots(state.date).forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "slot"; b.textContent = s.t;
      if (s.booked) { b.disabled = true; b.title = "Booked"; }
      if (state.time === s.t) b.classList.add("sel");
      b.addEventListener("click", function () { state.time = s.t; renderSlots(); picked(); emit(); if (opts.onTime) opts.onTime(); });
      box.appendChild(b);
    });
  }
  function picked() {
    var p = $(opts.picked); if (!p) return;
    if (state.date && state.time) { p.textContent = fmt(state.date, { weekday: "short", month: "short", day: "numeric" }) + " · " + state.time; p.classList.add("set"); }
    else { p.textContent = state.date ? "Now pick a time" : "No time picked yet"; p.classList.remove("set"); }
  }

  $(opts.prev).addEventListener("click", function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderCal(); });
  $(opts.next).addEventListener("click", function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderCal(); });

  var chips = Array.prototype.slice.call(document.querySelectorAll(opts.chips + " [data-s]"));
  function setService(s) {
    state.service = s; $(opts.service).value = s;
    chips.forEach(function (c) { var on = c.dataset.s === s; c.classList.toggle("on", on); c.setAttribute("aria-pressed", on); });
    $(opts.chips).classList.remove("bad"); emit();
  }
  chips.forEach(function (c) { c.addEventListener("click", function () { setService(c.dataset.s); }); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-service]"), function (a) {
    a.addEventListener("click", function () { setService(a.dataset.service); });
  });

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
    renderCal(); renderSlots(); picked(); $(opts.done).hidden = true; emit();
  });

  renderCal(); renderSlots(); picked();

  // open slots in the next 7 days (for urgency bar)
  var week = 0;
  for (var k = 0; k < 7; k++) { var dk = new Date(today); dk.setDate(today.getDate() + k); week += slots(dk).filter(function (s) { return !s.booked; }).length; }

  return { setService: setService, state: state, openThisWeek: week };
};

/* Instant price estimator (placeholder prices, owner to confirm). */
window.TintPrice = {
  base: { coupe: 179, sedan: 199, suv: 239, truck: 219 },
  film: { carbon: 0, ceramic: 120, ir: 230 },
  cover: { std: 0, full: 140 },
  names: { coupe: "Coupe", sedan: "Sedan", suv: "SUV", truck: "Truck", carbon: "Carbon", ceramic: "Ceramic", ir: "Ceramic IR", std: "Sides + rear", full: "Full + windshield" },
  calc: function (v, f, c) { var p = this.base[v] + this.film[f] + this.cover[c]; return [p, p + 70]; }
};
