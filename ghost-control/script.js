/* ==========================================================
   Ghost Control Barbers · interactions, booking & motion
   ========================================================== */
(function () {
  "use strict";

  var WA_NUMBER = "258840000000";
  var TZ = "Africa/Maputo";
  var DISCOUNT_CODE = "GHOST15";
  var DISCOUNT = 0.15;
  var IMG = function (id, w, h) {
    return "https://images.unsplash.com/photo-" + id + "?w=" + w + (h ? "&h=" + h : "") + "&q=70&auto=format&fit=crop&crop=faces";
  };

  var SERVICES = [
    { id: "skin-fade", name: "Skin Fade", price: 800, dur: 45, desc: "Zero-to-blend fade + line-up", tag: "Most booked" },
    { id: "classic-cut", name: "Classic Cut", price: 600, dur: 40, desc: "Scissor or clipper cut" },
    { id: "cut-beard", name: "Cut + Beard Combo", price: 1100, dur: 70, desc: "Any cut + full beard sculpt", tag: "Save 100 MT" },
    { id: "beard", name: "Beard Sculpt", price: 400, dur: 25, desc: "Shape, trim & razor line-up" },
    { id: "shave", name: "Hot-Towel Shave", price: 500, dur: 30, desc: "Straight razor + hot towels" },
    { id: "ritual", name: "The Ghost Ritual", price: 1800, dur: 90, desc: "Cut, beard, shave, mask & drink", tag: "Signature" },
    { id: "kids", name: "Kids Cut (under 12)", price: 450, dur: 30, desc: "Patient, fun and fast" }
  ];
  var BARBERS = [
    { id: "any", name: "Any barber", role: "Fastest option · matched to the right specialist", tag: "Recommended" },
    { id: "tiago", name: "Tiago M.", role: "Head Barber · Fades & designs · ★ 5.0", img: IMG("1567894340315-735d7c361db0", 96, 96) },
    { id: "nelson", name: "Nelson C.", role: "Senior · Beards & shaves · ★ 4.9", img: IMG("1593702288056-7927b442d0fa", 96, 96) },
    { id: "amina", name: "Amina J.", role: "Stylist · Curls & textured hair · ★ 4.9", img: IMG("1595476108010-b4d1f102b1b1", 96, 96) },
    { id: "rui", name: "Rui P.", role: "Barber · Classic & scissor cuts · ★ 4.8", img: IMG("1622287162716-f311baa1a2b8", 96, 96) }
  ];
  var HOURS = { 0: [540, 840], 1: [480, 1200], 2: [480, 1200], 3: [480, 1200], 4: [480, 1200], 5: [480, 1200], 6: [480, 1140] };
  var DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (n) { return n.toLocaleString("en-US"); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var hm = function (m) { return pad(Math.floor(m / 60)) + ":" + pad(m % 60); };
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var lenis = null;

  /* ---------- Analytics stub (GA4 / Meta Pixel ready) ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(event, data) { window.dataLayer.push(Object.assign({ event: event }, data || {})); }

  function ssGet(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }

  /* ---------- Maputo time & availability ---------- */
  function mzNow() {
    var d = new Date();
    try {
      var parts = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(d);
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      var y = +o.year, mo = +o.month - 1, da = +o.day;
      return { y: y, m: mo, d: da, wd: new Date(Date.UTC(y, mo, da)).getUTCDay(), min: (+o.hour % 24) * 60 + (+o.minute) };
    } catch (e) {
      return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate(), wd: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var NOW = mzNow();
  var DAYS = (function () {
    var out = [];
    for (var i = 0; i < 7; i++) {
      var dt = new Date(Date.UTC(NOW.y, NOW.m, NOW.d + i));
      out.push({ i: i, y: dt.getUTCFullYear(), m: dt.getUTCMonth(), d: dt.getUTCDate(), wd: dt.getUTCDay(), key: dt.toISOString().slice(0, 10) });
    }
    return out;
  })();
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) / 4294967295;
  }
  function slotsFor(day, barber) {
    var hrs = HOURS[day.wd], list = [];
    for (var t = hrs[0]; t <= hrs[1] - 30; t += 30) {
      var past = day.i === 0 && t < NOW.min + 30;
      var busy = (barber === "any" ? 0.35 : 0.5) + (t >= 1020 || day.wd === 6 ? 0.15 : 0);
      var taken = hash(day.key + "|" + t + "|" + barber) < busy;
      list.push({ t: t, label: hm(t), ok: !past && !taken, past: past });
    }
    return list;
  }
  function freeCount(day, barber) { return slotsFor(day, barber).filter(function (s) { return s.ok; }).length; }
  function nextFree(count, barber) {
    barber = barber || "any";
    for (var i = 0; i < DAYS.length; i++) {
      var free = slotsFor(DAYS[i], barber).filter(function (s) { return s.ok; });
      if (free.length) return { day: DAYS[i], slots: free.slice(0, count), total: free.length };
    }
    return null;
  }
  function dayLabel(day) { return day.i === 0 ? "Today" : day.i === 1 ? "Tomorrow" : DAY_LONG[day.wd]; }

  /* ---------- Status & hours ---------- */
  function initStatus() {
    var hrs = HOURS[NOW.wd];
    var open = NOW.min >= hrs[0] && NOW.min < hrs[1];
    var text = open ? "Open now · until " + hm(hrs[1])
      : NOW.min < hrs[0] ? "Closed · opens today " + hm(hrs[0])
      : "Closed · opens " + DAY_LONG[(NOW.wd + 1) % 7] + " " + hm(HOURS[(NOW.wd + 1) % 7][0]);
    $$("[data-status]").forEach(function (el) {
      el.classList.toggle("is-closed", !open);
      var t = $("[data-status-text]", el); if (t) t.textContent = text;
    });
    var row = $('[data-hours] tr[data-day="' + NOW.wd + '"]'); if (row) row.classList.add("is-today");
    var y = $("[data-year]"); if (y) y.textContent = NOW.y;
  }

  /* ---------- Hero booking bar ---------- */
  function initBookingBar() {
    var bar = $("[data-bbar]");
    if (!bar) return;
    var daySel = $("[data-bbar-day]");
    daySel.innerHTML = DAYS.map(function (d) {
      var free = freeCount(d, "any");
      return '<option value="' + d.i + '"' + (free ? "" : " disabled") + ">" + dayLabel(d) + " · " + DAY_SHORT[d.wd] + " " + d.d + " " + MONTHS[d.m] + (free ? "" : " (full)") + "</option>";
    }).join("");
    var nf = nextFree(4);
    if (nf) {
      daySel.value = String(nf.day.i);
      $("[data-next-label]").textContent = "Next free " + dayLabel(nf.day).toLowerCase();
      $("[data-hero-slots]").innerHTML = nf.slots.map(function (s) {
        return '<button type="button" class="slot" data-hero-slot="' + s.t + '" data-day-i="' + nf.day.i + '">' + s.label + "</button>";
      }).join("");
      var left = Math.min(nf.total, 12);
      var fs = $("[data-final-slots]");
      if (fs) fs.textContent = "Only " + left + " chairs left " + dayLabel(nf.day).toLowerCase();
      var mn = $("[data-mbar-next]");
      if (mn) mn.textContent = "Next free " + (nf.day.i === 0 ? "" : dayLabel(nf.day).toLowerCase() + " ") + nf.slots[0].label;
    }
    $("[data-hero-slots]").addEventListener("click", function (e) {
      var b = e.target.closest("[data-hero-slot]");
      if (!b) return;
      openBooking({ service: $("[data-bbar-service]").value, dayI: +b.getAttribute("data-day-i"), time: +b.getAttribute("data-hero-slot"), barber: "any", barberSet: true, src: "hero-slot" });
    });
    bar.addEventListener("submit", function (e) {
      e.preventDefault();
      openBooking({ service: $("[data-bbar-service]").value, barber: $("[data-bbar-barber]").value, barberSet: true, dayI: +daySel.value, time: null, resetTime: true, src: "booking-bar" });
    });
  }

  /* ==========================================================
     BOOKING MODAL
     ========================================================== */
  var modal = $("[data-modal]");
  var form = $("[data-bk-form]");
  var state = { step: 1, service: null, barber: "any", barberSet: false, dayI: 0, time: null, code: "" };
  var lastFocus = null;
  var TITLES = { 1: "Choose your service", 2: "Choose your barber", 3: "Pick a day & time", 4: "Confirm your booking", 5: "All set" };
  function svcById(id) { return SERVICES.filter(function (s) { return s.id === id; })[0]; }
  function barberById(id) { return BARBERS.filter(function (b) { return b.id === id; })[0]; }

  function renderServices() {
    $("[data-opts-service]").innerHTML = SERVICES.map(function (s) {
      return '<label class="opt"><input type="radio" name="service" value="' + s.id + '"><span class="opt__radio"></span>' +
        '<span class="opt__main"><b>' + s.name + (s.tag ? '<span class="opt__tag">' + s.tag + "</span>" : "") + "</b><small>" + s.desc + " · " + s.dur + " min</small></span>" +
        '<span class="opt__price">' + fmt(s.price) + " MT</span></label>";
    }).join("");
  }
  function renderBarbers() {
    $("[data-opts-barber]").innerHTML = BARBERS.map(function (b) {
      var pic = b.img ? '<img src="' + b.img + '" alt="" width="46" height="46" loading="lazy">' : '<span class="opt__any" aria-hidden="true">G</span>';
      return '<label class="opt"><input type="radio" name="barber" value="' + b.id + '">' + pic +
        '<span class="opt__main"><b>' + b.name + (b.tag ? '<span class="opt__tag">' + b.tag + "</span>" : "") + "</b><small>" + b.role + "</small></span>" +
        '<span class="opt__radio"></span></label>';
    }).join("");
  }
  function renderDays() {
    $("[data-days]").innerHTML = DAYS.map(function (d) {
      var free = freeCount(d, state.barber);
      return '<button type="button" class="day' + (d.i === state.dayI ? " is-active" : "") + '" data-day="' + d.i + '"' + (free ? "" : " disabled") + ">" +
        "<small>" + (d.i === 0 ? "Today" : DAY_SHORT[d.wd]) + "</small><b>" + d.d + "</b><em>" + (free ? free + " free" : "Full") + "</em></button>";
    }).join("");
  }
  function renderTimes() {
    var day = DAYS[state.dayI];
    var list = slotsFor(day, state.barber);
    var free = list.filter(function (s) { return s.ok; });
    if (state.time !== null && !list.some(function (s) { return s.t === state.time && s.ok; })) state.time = null;
    $("[data-times]").innerHTML = list.filter(function (s) { return !s.past; }).map(function (s) {
      return '<button type="button" class="time' + (s.t === state.time ? " is-active" : "") + '" data-time="' + s.t + '"' + (s.ok ? "" : ' disabled aria-label="' + s.label + ' booked"') + ">" + s.label + "</button>";
    }).join("") || '<p class="bk__hint">No more times today. Pick another day.</p>';
    var label = dayLabel(day);
    $("[data-times-hint]").innerHTML = free.length && free.length <= 6
      ? "<b>Only " + free.length + " slots left</b> " + (day.i < 2 ? label.toLowerCase() : "on " + label) + ". Crossed-out times are already booked."
      : "Crossed-out times are already booked.";
  }
  function renderSummary() {
    var s = svcById(state.service), b = barberById(state.barber), d = DAYS[state.dayI];
    if (!s || state.time === null) return;
    $("[data-summary]").innerHTML =
      "<div><span>Service</span><b>" + s.name + "</b></div>" +
      "<div><span>Barber</span><b>" + b.name + "</b></div>" +
      "<div><span>When</span><b>" + dayLabel(d) + ", " + d.d + " " + MONTHS[d.m] + " · " + hm(state.time) + "–" + hm(state.time + s.dur) + "</b></div>";
  }
  function totals() {
    var s = svcById(state.service);
    if (!s) return null;
    var disc = (state.code || "").trim().toUpperCase() === DISCOUNT_CODE;
    return { base: s.price, total: disc ? Math.round(s.price * (1 - DISCOUNT) / 10) * 10 : s.price, disc: disc };
  }
  function renderTotal() {
    var t = totals(), el = $("[data-bk-total]");
    if (!t) { el.textContent = "—"; return; }
    el.innerHTML = t.disc ? "<s>" + fmt(t.base) + "</s>" + fmt(t.total) + " MT" : fmt(t.total) + " MT";
  }
  function canContinue() {
    return state.step === 1 ? !!state.service : state.step === 2 ? !!state.barber : state.step === 3 ? state.time !== null : state.step === 4;
  }
  function goTo(step) {
    state.step = step;
    $$(".bk__pane", modal).forEach(function (p) { p.classList.toggle("is-active", +p.getAttribute("data-pane") === step); });
    $("[data-bk-title]").textContent = TITLES[step];
    $("[data-bk-steplabel]").textContent = step <= 4 ? "Step " + step + " of 4" : "Booking request sent";
    $("[data-bk-bar]").style.width = Math.min(step, 4) * 25 + "%";
    $("[data-bk-back]").hidden = step === 1 || step === 5;
    $("[data-bk-foot]").hidden = step === 5;
    var next = $("[data-bk-next]");
    $("span", next).textContent = step === 4 ? "Confirm booking" : "Continue";
    if (step === 3) { renderDays(); renderTimes(); }
    if (step === 4) renderSummary();
    $$('input[name="service"]', form).forEach(function (i) { i.checked = i.value === state.service; });
    $$('input[name="barber"]', form).forEach(function (i) { i.checked = i.value === state.barber; });
    if (form.elements.code && state.code && !form.elements.code.value) form.elements.code.value = state.code;
    next.disabled = !canContinue();
    renderTotal();
    $(".bk__body", modal).scrollTop = 0;
    track("booking_step", { step: step });
  }
  function openBooking(opts) {
    opts = opts || {};
    if (opts.service) state.service = opts.service;
    if (opts.barber) { state.barber = opts.barber; state.barberSet = !!opts.barberSet || opts.barber !== "any"; }
    if (typeof opts.dayI === "number") state.dayI = opts.dayI;
    if (opts.resetTime) state.time = null;
    if (typeof opts.time === "number") state.time = opts.time;
    if (opts.code) state.code = opts.code;
    if (state.time === null && typeof opts.dayI !== "number") { var nf = nextFree(1, state.barber); if (nf) state.dayI = nf.day.i; }
    var start = !state.service ? 1 : !state.barberSet && state.time === null ? 2 : state.time === null ? 3 : 4;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.documentElement.style.overflow = "hidden";
    if (lenis) lenis.stop();
    goTo(start);
    setTimeout(function () { var f = $(".bk__pane.is-active input, .bk__pane.is-active button", modal) || $(".bk__close", modal); if (f) f.focus({ preventScroll: true }); }, 80);
    track("booking_open", { source: opts.src || "unknown", service: state.service || "" });
  }
  function closeBooking() {
    modal.hidden = true;
    document.documentElement.style.overflow = "";
    if (lenis) lenis.start();
    if (state.step === 5) { state = { step: 1, service: null, barber: "any", barberSet: false, dayI: 0, time: null, code: state.code }; form.reset(); }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function validPhone(v) { return /^8[2-7]\d{7}$/.test(v.replace(/\D/g, "")); }
  function submitBooking() {
    var nameF = form.elements.name, phoneF = form.elements.phone;
    var nw = nameF.closest(".field"), pw = phoneF.closest(".field");
    nw.classList.toggle("is-invalid", nameF.value.trim().length < 2);
    pw.classList.toggle("is-invalid", !validPhone(phoneF.value));
    if (nw.classList.contains("is-invalid")) { nameF.focus(); return; }
    if (pw.classList.contains("is-invalid")) { phoneF.focus(); return; }
    state.code = form.elements.code.value;
    var s = svcById(state.service), b = barberById(state.barber), d = DAYS[state.dayI], t = totals();
    var msg = "Hi Ghost Control! I'd like to book:\n• Service: " + s.name + "\n• Barber: " + b.name +
      "\n• When: " + DAY_LONG[d.wd] + " " + d.d + " " + MONTHS[d.m] + " at " + hm(state.time) +
      "\n• Price: " + fmt(t.total) + " MT" + (t.disc ? " (code " + DISCOUNT_CODE + " applied)" : "") +
      "\n• Name: " + nameF.value.trim() + "\n• Phone: +258 " + phoneF.value.trim();
    var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
    $("[data-done-wa]").href = url;
    $("[data-done-text]").innerHTML = "<b>" + s.name + "</b> with <b>" + b.name + "</b><br>" + dayLabel(d) + ", " + d.d + " " + MONTHS[d.m] + " at " + hm(state.time) + "<br><br>We’ve opened WhatsApp with your booking details. Hit send and we’ll confirm within minutes.";
    window.open(url, "_blank", "noopener");
    track("booking_submit", { service: s.id, barber: b.id, value: t.total, currency: "MZN" });
    ssSet("gc_booked", "1");
    goTo(5);
  }
  function downloadICS() {
    var s = svcById(state.service), d = DAYS[state.dayI];
    if (!s || state.time === null) return;
    var start = new Date(Date.UTC(d.y, d.m, d.d, 0, state.time - 120)); // Maputo = UTC+2, no DST
    var end = new Date(start.getTime() + s.dur * 60000);
    var f = function (dt) { return dt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); };
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ghost Control Barbers//Booking//EN", "BEGIN:VEVENT", "UID:" + Date.now() + "@ghostcontrol",
      "DTSTAMP:" + f(new Date()), "DTSTART:" + f(start), "DTEND:" + f(end), "SUMMARY:" + s.name + " at Ghost Control Barbers",
      "LOCATION:Av. Julius Nyerere 1250\\, Polana\\, Maputo", "DESCRIPTION:Need to reschedule? WhatsApp +258 84 000 0000", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "ghost-control-booking.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function initBooking() {
    if (!modal) return;
    renderServices(); renderBarbers();
    $(".bk__body", modal).setAttribute("data-lenis-prevent", "");
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-book]");
      if (!btn) return;
      e.preventDefault();
      var o = { src: btn.getAttribute("data-src") };
      if (btn.hasAttribute("data-service")) o.service = btn.getAttribute("data-service");
      if (btn.hasAttribute("data-barber")) { o.barber = btn.getAttribute("data-barber"); o.barberSet = true; }
      if (btn.hasAttribute("data-code")) o.code = btn.getAttribute("data-code");
      closeExit(); closeMenu();
      openBooking(o);
    });
    $$("[data-close]", modal).forEach(function (el) { el.addEventListener("click", closeBooking); });
    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") closeBooking();
      if (e.key === "Tab") {
        var f = $$('button:not([disabled]), input:not([type="radio"]), input[type="radio"]:checked, a[href]', $(".modal__panel", modal)).filter(function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "service") { state.service = t.value; renderTotal(); $("[data-bk-next]").disabled = false; setTimeout(function () { if (state.step === 1) goTo(2); }, 280); }
      if (t.name === "barber") { state.barber = t.value; state.barberSet = true; setTimeout(function () { if (state.step === 2) goTo(3); }, 280); }
    });
    form.addEventListener("input", function (e) {
      if (e.target.name === "code") { state.code = e.target.value; renderTotal(); }
      if (e.target.name === "name" || e.target.name === "phone") e.target.closest(".field").classList.remove("is-invalid");
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); if (state.step === 4) submitBooking(); });
    $("[data-days]").addEventListener("click", function (e) {
      var b = e.target.closest("[data-day]");
      if (!b || b.disabled) return;
      state.dayI = +b.getAttribute("data-day");
      renderDays(); renderTimes();
      $("[data-bk-next]").disabled = !canContinue();
    });
    $("[data-times]").addEventListener("click", function (e) {
      var b = e.target.closest("[data-time]");
      if (!b || b.disabled) return;
      state.time = +b.getAttribute("data-time");
      $$(".time", modal).forEach(function (x) { x.classList.toggle("is-active", x === b); });
      $("[data-bk-next]").disabled = false;
    });
    $("[data-bk-next]").addEventListener("click", function () { if (!canContinue()) return; if (state.step < 4) goTo(state.step + 1); else submitBooking(); });
    $("[data-bk-back]").addEventListener("click", function () { if (state.step > 1) goTo(state.step - 1); });
    $("[data-ics]").addEventListener("click", downloadICS);
  }

  /* ---------- Header, menu, sticky bar ---------- */
  var burger = $("[data-burger]"), mnav = $("[data-mnav]");
  function closeMenu() {
    if (!mnav || !mnav.classList.contains("is-open")) return;
    mnav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu");
    document.documentElement.style.overflow = "";
    if (lenis) lenis.start();
  }
  function initHeader() {
    var header = $("[data-header]"), mbar = $("[data-mbar]"), heroCtas = $(".hero__ctas"), lastY = 0;
    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 20);
      header.classList.toggle("is-hidden", y > 600 && y > lastY + 4 && !mnav.classList.contains("is-open"));
      if (y < lastY - 4 || y < 600) header.classList.remove("is-hidden");
      lastY = y;
      if (mbar && heroCtas) mbar.classList.toggle("is-visible", heroCtas.getBoundingClientRect().bottom < 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    mnav.setAttribute("data-lenis-prevent", "");
    burger.addEventListener("click", function () {
      var open = !mnav.classList.contains("is-open");
      if (!open) { closeMenu(); return; }
      mnav.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", "Close menu");
      document.documentElement.style.overflow = "hidden";
      if (lenis) lenis.stop();
    });
    // Smooth anchor navigation
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      var el = id.length > 1 ? $(id) : null;
      if (!el && id !== "#top") return;
      e.preventDefault();
      closeMenu();
      var target = id === "#top" ? 0 : el;
      if (lenis) lenis.scrollTo(target, { offset: id === "#top" ? 0 : -70, duration: 1.4 });
      else window.scrollTo({ top: id === "#top" ? 0 : el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
    });
    var links = $$(".nav a");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id); });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      ["services", "work", "barbers", "reviews", "visit", "why", "intro", "how", "offer", "faq"].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    }
    var fab = $(".fab-wa");
    if (fab) setTimeout(function () { fab.classList.add("show-tip"); setTimeout(function () { fab.classList.remove("show-tip"); }, 4500); }, 14000);
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      if (a.hasAttribute("data-wa")) track("whatsapp_click", { location: (a.closest("section, header, footer, .mbar") || { className: "fab" }).className });
      if ((a.getAttribute("href") || "").indexOf("tel:") === 0) track("call_click", {});
    });
  }

  /* ---------- Services filter + hover image ---------- */
  function initMenu() {
    var tabs = $$("[data-filter]");
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        var f = t.getAttribute("data-filter");
        tabs.forEach(function (x) { var on = x === t; x.classList.toggle("is-active", on); x.setAttribute("aria-selected", String(on)); });
        $$("[data-menu] .menu__row").forEach(function (r) { r.classList.toggle("is-hidden", !(f === "all" || r.getAttribute("data-cat") === f)); });
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    });
    if (!FINE) return;
    var fl = $(".menu-float"), img = $("[data-menu-float]"), menu = $("[data-menu]");
    if (!fl || !menu) return;
    var x = 0, y = 0, cx = 0, cy = 0, raf = null;
    var loop = function () { cx += (x - cx) * .14; cy += (y - cy) * .14; fl.style.transform = "translate(" + (cx + 30) + "px," + (cy - 160) + "px) " + (fl.classList.contains("is-on") ? "scale(1)" : "scale(.8)"); raf = requestAnimationFrame(loop); };
    menu.addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; });
    $$(".menu__row", menu).forEach(function (r) {
      r.addEventListener("mouseenter", function () { img.src = r.getAttribute("data-img"); fl.classList.add("is-on"); if (!raf) { cx = x; cy = y; loop(); } });
    });
    menu.addEventListener("mouseleave", function () { fl.classList.remove("is-on"); setTimeout(function () { if (!fl.classList.contains("is-on") && raf) { cancelAnimationFrame(raf); raf = null; } }, 400); });
  }

  /* ---------- Before / after ---------- */
  function initBA() {
    $$("[data-ba]").forEach(function (ba) {
      var r = $("[data-ba-range]", ba);
      var set = function () { ba.style.setProperty("--pos", r.value + "%"); };
      r.addEventListener("input", set); set();
    });
  }

  /* ---------- Quotes slider ---------- */
  function initQuotes() {
    var root = $("[data-quotes]");
    if (!root) return;
    var qs = $$(".q", root), dots = $("[data-q-dots]"), i = 0, timer;
    dots.innerHTML = qs.map(function (_, n) { return '<button aria-label="Review ' + (n + 1) + '"></button>'; }).join("");
    var ds = $$("button", dots);
    var show = function (n) {
      i = (n + qs.length) % qs.length;
      qs.forEach(function (q, k) { q.classList.toggle("is-active", k === i); });
      ds.forEach(function (d, k) { d.classList.remove("is-active"); d.classList.toggle("is-done", k < i); });
      void ds[i].offsetWidth; ds[i].classList.add("is-active");
      clearTimeout(timer);
      timer = setTimeout(function () { if (!root.classList.contains("is-paused")) show(i + 1); else waitResume(); }, 7000);
    };
    var waitResume = function () { timer = setTimeout(function () { if (root.classList.contains("is-paused")) waitResume(); else show(i + 1); }, 1000); };
    ds.forEach(function (d, k) { d.addEventListener("click", function () { show(k); }); });
    $("[data-q-prev]").addEventListener("click", function () { show(i - 1); });
    $("[data-q-next]").addEventListener("click", function () { show(i + 1); });
    root.addEventListener("mouseenter", function () { root.classList.add("is-paused"); });
    root.addEventListener("mouseleave", function () { root.classList.remove("is-paused"); });
    var sx = 0;
    root.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1)); });
    show(0);
  }

  /* ---------- Copy code, toast ---------- */
  var toastEl = $("[data-toast]"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 3000);
  }
  function initCopy() {
    $$("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var code = b.getAttribute("data-copy");
        var done = function () { var l = $("[data-copy-label]", b); if (l) l.textContent = "Copied ✓"; toast("Code " + code + " copied. It’s applied automatically when you book."); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, done); else done();
        state.code = code;
        track("promo_copy", { code: code });
      });
    });
  }

  /* ---------- Exit intent ---------- */
  var exitEl = $("[data-exit]");
  function closeExit() { if (exitEl && !exitEl.hidden) { exitEl.hidden = true; document.documentElement.style.overflow = ""; if (lenis) lenis.start(); } }
  function initExit() {
    if (!exitEl) return;
    var armed = false;
    setTimeout(function () { armed = true; }, 10000);
    document.addEventListener("mouseout", function (e) {
      if (!armed || e.relatedTarget || e.clientY > 0) return;
      if (window.innerWidth < 900 || !modal.hidden || ssGet("gc_exit") || ssGet("gc_booked") || document.body.classList.contains("notes-on")) return;
      ssSet("gc_exit", "1");
      exitEl.hidden = false;
      document.documentElement.style.overflow = "hidden";
      if (lenis) lenis.stop();
      track("exit_intent_shown", {});
    });
    $$("[data-exit-close]", exitEl).forEach(function (b) { b.addEventListener("click", closeExit); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeExit(); });
  }

  /* ---------- Cursor, magnetic, tilt ---------- */
  function initCursor() {
    if (!FINE || REDUCED) return;
    document.documentElement.classList.add("has-cursor");
    var c = $(".cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring"), label = $("[data-cursor-label]");
    var x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    window.addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; dot.style.transform = "translate(" + x + "px," + y + "px)"; }, { passive: true });
    (function loop() { rx += (x - rx) * .18; ry += (y - ry) * .18; ring.style.transform = "translate(" + rx + "px," + ry + "px)"; requestAnimationFrame(loop); })();
    document.addEventListener("mouseover", function (e) {
      var l = e.target.closest("[data-cursor]");
      var h = e.target.closest("a, button, select, input, label, summary");
      c.classList.toggle("is-label", !!l);
      if (l) label.textContent = l.getAttribute("data-cursor");
      c.classList.toggle("is-hover", !l && !!h);
    });
    document.addEventListener("mouseleave", function () { c.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { c.style.opacity = "1"; });

    $$(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = (e.clientX - r.left - r.width / 2) * .22, my = (e.clientY - r.top - r.height / 2) * .3;
        el.style.transform = "translate(" + mx + "px," + my + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
    var card = $("[data-tilt]");
    if (card) {
      var host = card.parentElement;
      host.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        card.style.transform = "perspective(900px) rotateY(" + px * 14 + "deg) rotateX(" + -py * 14 + "deg)";
      });
      host.addEventListener("mouseleave", function () { card.style.transform = ""; });
    }
  }

  /* ==========================================================
     DESIGN NOTES · "Why this layout?"
     ========================================================== */
  var NOTES = [
    { target: ".hero__copy", title: "Above the fold: premium first impression and a clear next step",
      points: [
        "<b>Cinematic full-screen photo and an editorial serif headline</b> set a luxury tone in under a second, so the visitor expects a higher price and a higher standard.",
        "The headline sells the two things people care most about: <b>quality</b> (finest cuts) and <b>convenience</b> (booked in 30 seconds).",
        "<b>One gold primary button</b> plus <b>WhatsApp</b>, the channel Mozambicans already use daily.",
        "<b>Rating and the rotating “4.9” seal</b> sit next to the buttons, so trust is visible right where people decide.",
        "<b>Booking bar like a hotel site</b> (service, day, barber) lets visitors start booking straight from the hero. The <b>next free times</b> are one tap from a finished booking, with honest urgency.",
        "Under the bar: <b>no prepayment, free cancellation</b>, which removes the risk of trying.",
        "Top bar shows <b>live open/closed status</b> (Maputo time) and the first-visit offer. The header tucks away when you scroll down and comes back when you scroll up."
      ], kpi: "Goal: booking-start rate" },
    { target: "#intro", title: "Brand promise and proof, straight after the hero",
      points: [
        "The manifesto <b>lights up word by word as you scroll</b>. It states the brand position (precision, punctuality, comfort) and keeps people reading.",
        "<b>Big numbers</b> (4.9★, 15,000+ cuts, 97% rebook) are scanned in two seconds and build credibility.",
        "<b>M-Pesa / e-Mola / card / cash</b> removes a common local doubt: “can I pay with my phone?”"
      ], kpi: "Goal: lower bounce, more scroll depth" },
    { target: "#services", title: "Services as a luxury menu: transparent and quick to scan",
      points: [
        "Clear prices remove one of the top reasons people leave without booking.",
        "<b>Every row is a booking button</b> with that service already chosen. On desktop, a <b>photo of the service follows the cursor</b> as you hover, which feels premium and helps people choose.",
        "The <b>Signature Ritual</b> is shown large and stays on screen as you scroll. As the most expensive option it makes the other prices feel reasonable and raises the average spend.",
        "<b>“Most booked”</b> and <b>“Save 100 MT”</b> labels steer undecided visitors. The <b>“Send a photo”</b> link catches people who aren’t sure what to book."
      ], kpi: "Goal: higher average order value" },
    { target: "#why", title: "Four promises: answer objections, in a section that scrolls sideways",
      points: [
        "As you scroll down, these cards move sideways (swipe on mobile). It’s memorable and keeps attention on each promise one at a time.",
        "<b>On-time guarantee</b>, <b>hygiene</b> and <b>master barbers</b> answer the most common worries.",
        "It ends on a gold <b>“Love it or we fix it free”</b> card with a booking button, so the risk-free offer comes right when motivation peaks."
      ], kpi: "Goal: convert first-time visitors" },
    { target: "#work", title: "Our work: show, don’t tell",
      points: [
        "A <b>before/after slider</b> you can drag gets people playing with the page and builds desire. The gallery columns move at different speeds as you scroll, which adds depth.",
        "<b>“I want this look”</b> CTA sits at the emotional peak. The Instagram link adds social proof.",
        "Placeholder photos for now; we’ll swap in your real cuts and transformations."
      ], kpi: "Goal: engagement → bookings" },
    { target: "#barbers", title: "Barbers: people book people",
      points: [
        "Portraits are black and white and turn to colour on hover, an editorial look that feels high-end.",
        "Each barber has their <b>rating, speciality and a “Book with” button</b> that pre-selects them. That suits loyal clients and helps newcomers pick the right specialist."
      ], kpi: "Goal: repeat bookings" },
    { target: "#how", title: "How it works: remove uncertainty about the process",
      points: ["Three steps show booking is effortless. <b>WhatsApp confirmation and reminders</b> (no app, no account) also reduce no-shows."], kpi: "Goal: booking completion" },
    { target: "#reviews", title: "Reviews: one big quote at a time, easy to read",
      points: [
        "Large serif quotes rotate automatically (pause on hover, swipe on mobile). They’re easier to read and feel more premium than a grid.",
        "The <b>Google score badge</b> is third-party trust. Each review answers a specific doubt: punctuality, value, curly hair, kids, hygiene, easy booking."
      ], kpi: "Goal: trust → action" },
    { target: "#offer", title: "Offer and membership: a reason to act today, and to come back",
      points: [
        "A <b>coupon-style card</b> with a tap-to-copy code makes the 15% offer feel real. It is <b>applied automatically</b> in the booking flow.",
        "The <b>Ghost Club black card</b> tilts as you move the mouse and sells a monthly membership: recurring revenue and loyalty.",
        "On desktop, an <b>exit-intent popup</b> (once per visit) offers the same discount to people about to leave."
      ], kpi: "Goal: new clients + retention" },
    { target: "#faq", title: "FAQ: clear the last doubts",
      points: ["Answers what stops people booking: walk-ins, payment, cancelling, the guarantee, kids, parking. Anything else goes straight to WhatsApp."], kpi: "Goal: fewer drop-offs" },
    { target: "#visit", title: "Visit: built for “barber near me” searches",
      points: ["Today’s hours are highlighted automatically, with one-tap directions and calling. The page already includes <b>LocalBusiness schema</b> (rating, hours, address) to help with Google Maps and local search."], kpi: "Goal: walk-ins + calls" },
    { target: ".final", title: "Final CTA: catch visitors who scrolled to the end",
      points: ["Visitors who reached the bottom are ready to book. A huge, confident headline with <b>live availability</b> (“Only X chairs left today”) and both booking options."], kpi: "Goal: last-chance conversion" },
    { target: ".footer", title: "Site-wide conversion tools (try them!)",
      points: [
        "<b>4-step booking pop-up</b>: progress bar, moves on automatically, skips steps already chosen, crosses out booked times, sends to WhatsApp, and offers add-to-calendar. It can later connect to Fresha, Booksy, Square, etc.",
        "<b>Mobile sticky bar</b>: Call, WhatsApp and Book (with the next free time) stay within thumb reach. <b>Floating WhatsApp</b> button on desktop.",
        "Smooth scrolling and a custom cursor make it feel like a luxury brand, while still loading fast.",
        "<b>Tracking events are ready</b> (booking open/step/submit, WhatsApp and call clicks) for GA4 / Meta Pixel."
      ], kpi: "Goal: measurable growth" }
  ];
  function initNotes() {
    var toggle = $("[data-notes-toggle]");
    NOTES.forEach(function (n, i) {
      var host = $(n.target);
      if (!host) return;
      var el = document.createElement("aside");
      el.className = "cro-note";
      el.setAttribute("aria-label", "Design note " + (i + 1));
      el.innerHTML = '<div class="cro-note__in"><span class="cro-note__n">' + (i + 1) + "</span><div><h4>" + n.title + "</h4><ul>" +
        n.points.map(function (p) { return "<li>" + p + "</li>"; }).join("") + '</ul><span class="cro-note__kpi">' + n.kpi + "</span></div></div>";
      if (n.target === "#why") $(".standards__pin", host).insertBefore(el, $(".standards__pin", host).firstChild);
      else host.insertBefore(el, host.firstChild);
    });
    var set = function (on, announce) {
      document.body.classList.toggle("notes-on", on);
      toggle.setAttribute("aria-pressed", String(on));
      $("[data-notes-label]").textContent = on ? "Hide design notes" : "Why this layout?";
      if (announce && on) toast("Design notes on: each section now explains its conversion purpose.");
      if (window.ScrollTrigger) setTimeout(function () { window.ScrollTrigger.refresh(); }, 50);
    };
    toggle.addEventListener("click", function () { set(!document.body.classList.contains("notes-on"), true); });
    if (/[?&]notes=1/.test(location.search)) set(true, false);
  }

  /* ---------- Text splitting helpers ---------- */
  function splitWords(el, wrapFn) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
        if (ch.nodeType === 3) {
          var parts = ch.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(" "));
            else frag.appendChild(wrapFn(p));
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1 && ch.tagName !== "BR") walk(ch);
      });
    };
    walk(el);
  }

  /* ---------- Motion (GSAP + Lenis) ---------- */
  function initMotion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    var standards = $(".standards");
    if (!gsap || !ST || REDUCED) {
      document.documentElement.classList.add("no-motion");
      if (standards) standards.classList.add("no-hscroll");
      return;
    }
    gsap.registerPlugin(ST);

    if (window.Lenis) {
      lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
      lenis.on("scroll", ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // Hero intro
    var tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: .1 });
    tl.from(".hero__img", { scale: 1.25, duration: 2.4, ease: "power3.out" }, 0)
      .from(".hero__title .split-line > span", { yPercent: 110, duration: 1.4, stagger: .12 }, .2)
      .from(".hero .reveal-up", { y: 30, autoAlpha: 0, duration: 1.1, stagger: .1 }, .55)
      .from(".seal", { scale: .6, autoAlpha: 0, rotate: -60, duration: 1.4 }, .8)
      .from(".header__in > *", { y: -20, autoAlpha: 0, duration: 1, stagger: .08 }, .3);

    gsap.to(".hero__media", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__in", { yPercent: -12, autoAlpha: .2, ease: "none", scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true } });

    // Manifesto word reveal
    var man = $("[data-words]");
    if (man) {
      splitWords(man, function (w) { var s = document.createElement("span"); s.className = "w"; s.textContent = w; return s; });
      gsap.to($$(".w", man), { opacity: 1, stagger: .08, ease: "none", scrollTrigger: { trigger: man, start: "top 82%", end: "bottom 45%", scrub: .6 } });
    }

    // Heading line reveals
    $$(".split-reveal").forEach(function (h) {
      splitWords(h, function (w) { var o = document.createElement("span"); o.className = "sl-wrap"; var i = document.createElement("span"); i.className = "sl-inner"; i.textContent = w; o.appendChild(i); return o; });
      gsap.from($$(".sl-inner", h), { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: .05, scrollTrigger: { trigger: h, start: "top 88%", once: true } });
    });

    // Generic reveals
    var rv = ".sec-head__p, .kicker:not(.hero .kicker), .stat, .pay, .feature, .tabs, .menu__row, .menu__help, .ba, .masonry figure, .work__foot, .barber, .step, .process__head .btn, .gscore, .reviews__side .link-u, .quotes, .ticket, .club, .acc details, .faq__side > p, .faq__side .btn, .visit address, .hours, .visit__btns, .visit__map, .final .hero__ctas, .footer__in > *";
    gsap.set(rv, { autoAlpha: 0, y: 40 });
    ST.batch(rv, { start: "top 92%", once: true, onEnter: function (els) { gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: .07, overwrite: true, clearProps: "transform" }); } });

    // Image curtain reveals
    $$(".intro__img, .feature__img").forEach(function (f) {
      gsap.fromTo(f, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: f, start: "top 85%", once: true } });
    });

    // Parallax
    $$("[data-parallax]").forEach(function (el) {
      var amt = parseFloat(el.getAttribute("data-parallax"));
      gsap.fromTo(el, { yPercent: -amt / 2 }, { yPercent: amt, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
    $$("[data-parallax-bg]").forEach(function (el) {
      gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });

    // Counters
    $$("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count")), dec = +(el.getAttribute("data-decimals") || 0), o = { v: 0 };
      ST.create({ trigger: el, start: "top 90%", once: true, onEnter: function () {
        gsap.to(o, { v: target, duration: 2, ease: "power3.out", onUpdate: function () { el.textContent = dec ? o.v.toFixed(dec) : fmt(Math.round(o.v)); } });
      } });
    });

    // Horizontal pinned promises (desktop) / swipe (mobile)
    var mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", function () {
      standards.classList.remove("no-hscroll");
      var track = $("[data-htrack]");
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var tw = gsap.to(track, { x: function () { return -dist(); }, ease: "none",
        scrollTrigger: { trigger: ".standards__pin", start: "top top", end: function () { return "+=" + dist(); }, pin: true, scrub: .8, invalidateOnRefresh: true, anticipatePin: 1 } });
      return function () { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); gsap.set(track, { clearProps: "transform" }); };
    });
    mm.add("(max-width: 900px)", function () { standards.classList.add("no-hscroll"); });

    // Big footer wordmark
    gsap.from(".footer__mark", { yPercent: 40, autoAlpha: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".footer__mark", start: "top 98%", once: true } });

    window.addEventListener("load", function () { ST.refresh(); });
  }

  /* ---------- Boot ---------- */
  function boot() {
    initStatus();
    initBookingBar();
    initBooking();
    initMotion();
    initHeader();
    initMenu();
    initBA();
    initQuotes();
    initCopy();
    initExit();
    initCursor();
    initNotes();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
