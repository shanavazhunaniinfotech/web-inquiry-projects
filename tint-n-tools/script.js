(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  $("#year").textContent = new Date().getFullYear();

  /* Toast */
  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3200);
  }

  /* Wholesale login (demo) */
  $$("#wholesaleBtn, .wholesale-link").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      toast("Demo: this button will open your wholesale store login.");
    });
  });

  /* Mobile menu */
  var menuBtn = $("#menuBtn"), links = $(".nav-links");
  menuBtn.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  $$(".nav-links a").forEach(function (a) {
    a.addEventListener("click", function () { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); });
  });

  /* Tint shade preview */
  var notes = {
    "70": "70% · Light film, mostly for heat and UV protection",
    "50": "50% · Subtle tint with great visibility",
    "35": "35% · Popular balance of style and visibility",
    "20": "20% · Dark, private and sleek",
    "5": "5% · Limo tint, maximum privacy (check local laws)"
  };
  var shadeBtns = $$(".shades button");
  function setShade(vlt) {
    var opacity = Math.min(0.95, Math.max(0.12, 1 - vlt / 100));
    $$(".tint-layer path").forEach(function (p) { p.style.opacity = opacity; });
    shadeBtns.forEach(function (b) {
      var on = b.dataset.vlt === String(vlt);
      b.classList.toggle("active", on);
      b.setAttribute("aria-checked", on);
    });
    $("#shadeNote").textContent = notes[vlt];
  }
  shadeBtns.forEach(function (b) { b.addEventListener("click", function () { setShade(+b.dataset.vlt); }); });
  setShade(35);

  /* Service links prefill the form */
  var serviceSel = $("#service");
  $$("[data-service]").forEach(function (a) {
    a.addEventListener("click", function () { serviceSel.value = a.dataset.service; toggleVehicle(); });
  });
  function toggleVehicle() {
    var v = serviceSel.value;
    var isHome = v === "Residential Tint" || v === "Commercial Tint";
    $("#vehicle").placeholder = isHome ? "Not needed for homes / businesses" : "e.g. 2022 Toyota Camry";
  }
  serviceSel.addEventListener("change", toggleVehicle);

  /* Availability calendar (demo data) */
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var WEEKDAY_SLOTS = ["8:00 AM","9:30 AM","11:00 AM","12:30 PM","2:00 PM","3:30 PM","5:00 PM"];
  var SAT_SLOTS = ["9:00 AM","10:30 AM","12:00 PM","1:30 PM"];

  var today = new Date(); today.setHours(0, 0, 0, 0);
  var view = new Date(today.getFullYear(), today.getMonth(), 1);
  var maxView = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  var selectedDate = null, selectedSlot = null;

  // Simple seeded random so the same date always shows the same booked slots
  function rand(seed) { var x = Math.sin(seed) * 10000; return x - Math.floor(x); }
  function slotsFor(d) {
    var dow = d.getDay();
    if (dow === 0) return []; // closed Sunday
    var base = dow === 6 ? SAT_SLOTS : WEEKDAY_SLOTS;
    var seed = d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate();
    return base.map(function (time, i) {
      var booked = rand(seed + i * 7.3) < 0.42;
      if (d.getTime() === today.getTime()) {
        // past times today are not bookable
        var parts = time.match(/(\d+):(\d+) (AM|PM)/);
        var h = (+parts[1] % 12) + (parts[3] === "PM" ? 12 : 0);
        if (h <= new Date().getHours() + 1) booked = true;
      }
      return { time: time, booked: booked };
    });
  }

  function renderCalendar() {
    $("#calTitle").textContent = MONTHS[view.getMonth()] + " " + view.getFullYear();
    $("#prevMonth").disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
    $("#nextMonth").disabled = view >= maxView;

    var days = $("#calDays");
    days.innerHTML = "";
    var first = view.getDay();
    var count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();

    for (var b = 0; b < first; b++) {
      var blank = document.createElement("span"); blank.className = "blank"; days.appendChild(blank);
    }
    for (var n = 1; n <= count; n++) {
      var d = new Date(view.getFullYear(), view.getMonth(), n);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day";
      btn.textContent = n;
      var open = slotsFor(d).filter(function (s) { return !s.booked; }).length;
      if (d < today || open === 0) {
        btn.disabled = true;
        btn.setAttribute("aria-label", d.toDateString() + ", unavailable");
      } else {
        if (open <= 2) btn.classList.add("few");
        btn.setAttribute("aria-label", d.toDateString() + ", " + open + " times available");
      }
      if (d.getTime() === today.getTime()) btn.classList.add("today");
      if (selectedDate && d.getTime() === selectedDate.getTime()) btn.classList.add("selected");
      (function (date) {
        btn.addEventListener("click", function () {
          selectedDate = date; selectedSlot = null;
          renderCalendar(); renderSlots(); updatePicked();
        });
      })(d);
      days.appendChild(btn);
    }
  }

  function renderSlots() {
    var wrap = $("#slots");
    wrap.innerHTML = "";
    if (!selectedDate) { $("#slotsTitle").textContent = "Select a date to see open times"; return; }
    $("#slotsTitle").textContent = "Open times on " + selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    slotsFor(selectedDate).forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "slot";
      b.textContent = s.time;
      if (s.booked) { b.disabled = true; b.title = "Booked"; }
      if (selectedSlot === s.time) b.classList.add("selected");
      b.addEventListener("click", function () {
        selectedSlot = s.time; renderSlots(); updatePicked();
        if (window.innerWidth < 880) $("#quote").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      wrap.appendChild(b);
    });
  }

  function updatePicked() {
    var p = $("#picked");
    if (selectedDate && selectedSlot) {
      p.textContent = "Selected time: " + selectedDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) + " at " + selectedSlot;
      p.classList.add("set");
    } else if (selectedDate) {
      p.textContent = "Now choose a time for " + selectedDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + ".";
      p.classList.remove("set");
    } else {
      p.textContent = "No time selected yet. Pick one on the calendar.";
      p.classList.remove("set");
    }
  }

  $("#prevMonth").addEventListener("click", function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderCalendar(); });
  $("#nextMonth").addEventListener("click", function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderCalendar(); });
  renderCalendar();

  /* Quote form (demo, not sent anywhere) */
  var form = $("#quote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    ["service", "name", "phone"].forEach(function (n) {
      var el = form.elements[n];
      var bad = !el.value.trim() || (n === "phone" && el.value.replace(/\D/g, "").length < 7);
      el.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) { toast("Please fill in service, name and a valid phone number."); return; }
    var first = form.elements.name.value.trim().split(" ")[0];
    var when = selectedDate && selectedSlot
      ? " We've pencilled you in for " + selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) + " at " + selectedSlot + "."
      : "";
    $("#successText").textContent = "Thanks " + first + "!" + when + " We'll call you shortly to confirm your quote.";
    $("#success").hidden = false;
  });
  $$("input, select", form).forEach(function (el) {
    el.addEventListener("input", function () { el.classList.remove("invalid"); });
  });
  $("#again").addEventListener("click", function () {
    form.reset(); selectedDate = null; selectedSlot = null;
    renderCalendar(); renderSlots(); updatePicked();
    $("#success").hidden = true;
  });
})();
