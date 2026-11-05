/* ==========================================================
   Ghost Control Barbers · v3 interactions & booking
   ========================================================== */
(function () {
  "use strict";

  var WA_NUMBER = "258840000000";
  var TZ = "Africa/Maputo";
  var DISCOUNT_CODE = "GHOST15";
  var DISCOUNT = 0.15;
  var IMG = function (id) { return "https://images.unsplash.com/photo-" + id + "?w=96&h=96&q=70&auto=format&fit=crop&crop=faces"; };

  var SERVICES = [
    { id: "skin-fade", name: "Skin Fade", price: 800, dur: 45, desc: "Zero-to-blend fade + line-up", tag: "Most booked" },
    { id: "classic-cut", name: "Classic Cut", price: 600, dur: 40, desc: "Scissor or clipper cut" },
    { id: "cut-beard", name: "Cut + Beard", price: 1100, dur: 70, desc: "Any cut + full beard sculpt", tag: "Save 100 MT" },
    { id: "beard", name: "Beard Sculpt", price: 400, dur: 25, desc: "Shape, trim & razor line-up" },
    { id: "shave", name: "Hot-Towel Shave", price: 500, dur: 30, desc: "Straight razor + hot towels" },
    { id: "ritual", name: "The Ghost Ritual", price: 1800, dur: 90, desc: "Cut, beard, shave & face mask", tag: "Signature" },
    { id: "kids", name: "Kids Cut (under 12)", price: 450, dur: 30, desc: "Patient, fun and fast" }
  ];
  var BARBERS = [
    { id: "any", name: "Any barber", role: "Fastest option, matched to the right specialist", tag: "Recommended" },
    { id: "tiago", name: "Tiago M.", role: "Head barber · Fades & designs · ★ 5.0", img: IMG("1522529599102-193c0d76b5b6") },
    { id: "nelson", name: "Nelson C.", role: "Senior barber · Beards & shaves · ★ 4.9", img: IMG("1562004760-aceed7bb0fe3") },
    { id: "dario", name: "Dário J.", role: "Barber · Curls & textured hair · ★ 4.9", img: IMG("1595152452543-e5fc28ebc2b8") },
    { id: "rui", name: "Rui P.", role: "Barber · Classic & scissor cuts · ★ 4.8", img: IMG("1599566150163-29194dcaad36") }
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
  var lenis = null;

  /* Analytics stub (GA4 / Meta Pixel ready) */
  window.dataLayer = window.dataLayer || [];
  function track(event, data) { window.dataLayer.push(Object.assign({ event: event }, data || {})); }
  function ssGet(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  function lockScroll(on) {
    document.documentElement.style.overflow = on ? "hidden" : "";
    if (lenis) { if (on) lenis.stop(); else lenis.start(); }
  }

  /* ---------- Maputo time & availability ---------- */
  function mzNow() {
    var d = new Date();
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false })
        .formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
      var y = +o.year, mo = +o.month - 1, da = +o.day;
      return { y: y, m: mo, d: da, wd: new Date(Date.UTC(y, mo, da)).getUTCDay(), min: (+o.hour % 24) * 60 + (+o.minute) };
    } catch (e) {
      return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate(), wd: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var NOW = mzNow();
  var DAYS = [];
  for (var di = 0; di < 7; di++) {
    var dt = new Date(Date.UTC(NOW.y, NOW.m, NOW.d + di));
    DAYS.push({ i: di, y: dt.getUTCFullYear(), m: dt.getUTCMonth(), d: dt.getUTCDate(), wd: dt.getUTCDay(), key: dt.toISOString().slice(0, 10) });
  }
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
      list.push({ t: t, label: hm(t), ok: !past && hash(day.key + "|" + t + "|" + barber) >= busy, past: past });
    }
    return list;
  }
  function freeCount(day, barber) { return slotsFor(day, barber).filter(function (s) { return s.ok; }).length; }
  function nextFree(count, barber) {
    for (var i = 0; i < DAYS.length; i++) {
      var free = slotsFor(DAYS[i], barber || "any").filter(function (s) { return s.ok; });
      if (free.length) return { day: DAYS[i], slots: free.slice(0, count), total: free.length };
    }
    return null;
  }
  function dayLabel(day) { return day.i === 0 ? "Today" : day.i === 1 ? "Tomorrow" : DAY_LONG[day.wd]; }

  /* ---------- Status, hours, live slots ---------- */
  function initLive() {
    var hrs = HOURS[NOW.wd];
    var open = NOW.min >= hrs[0] && NOW.min < hrs[1];
    var text = open ? "Open now · until " + hm(hrs[1])
      : NOW.min < hrs[0] ? "Opens today " + hm(hrs[0])
      : "Closed · opens " + DAY_SHORT[(NOW.wd + 1) % 7] + " " + hm(HOURS[(NOW.wd + 1) % 7][0]);
    $$("[data-status]").forEach(function (el) { el.classList.toggle("is-closed", !open); $("[data-status-text]", el).textContent = text; });
    var ht = $("[data-hours-today]");
    if (ht) ht.textContent = (open ? "Open · " : "") + hm(hrs[0]) + " – " + hm(hrs[1]);
    var row = $('[data-hours] tr[data-day="' + NOW.wd + '"]'); if (row) row.classList.add("is-today");
    var y = $("[data-year]"); if (y) y.textContent = NOW.y;

    var nf = nextFree(4);
    if (!nf) return;
    var lbl = $("[data-next-label]");
    if (lbl) lbl.textContent = "Next free " + dayLabel(nf.day).toLowerCase();
    var box = $("[data-hero-slots]");
    box.innerHTML = nf.slots.map(function (s) { return '<button type="button" class="slot" data-slot="' + s.t + '" data-day-i="' + nf.day.i + '">' + s.label + "</button>"; }).join("");
    box.addEventListener("click", function (e) {
      var b = e.target.closest("[data-slot]");
      if (b) openBooking({ dayI: +b.getAttribute("data-day-i"), time: +b.getAttribute("data-slot"), barber: "any", barberSet: true, src: "hero-slot" });
    });
    var left = Math.min(nf.total, 12);
    var fn = $("[data-final-slots]");
    if (fn) fn.textContent = "Only " + left + " chairs left " + dayLabel(nf.day).toLowerCase() + " · No prepayment · Free cancellation";
    var mn = $("[data-mbar-next]");
    if (mn) mn.textContent = "Next free " + (nf.day.i === 0 ? "today " : dayLabel(nf.day).toLowerCase() + " ") + nf.slots[0].label;
  }

  /* ==========================================================
     BOOKING MODAL
     ========================================================== */
  var modal = $("[data-modal]");
  var form = $("[data-bk-form]");
  var state = { step: 1, service: null, barber: "any", barberSet: false, dayI: 0, time: null, code: "" };
  var lastFocus = null;
  var TITLES = { 1: "Choose a service", 2: "Choose a barber", 3: "Pick a day & time", 4: "Confirm your booking", 5: "Request sent" };
  function svcById(id) { return SERVICES.filter(function (s) { return s.id === id; })[0]; }
  function barberById(id) { return BARBERS.filter(function (b) { return b.id === id; })[0]; }

  function renderOptions() {
    $("[data-opts-service]").innerHTML = SERVICES.map(function (s) {
      return '<label class="opt"><input type="radio" name="service" value="' + s.id + '"><span class="opt__radio"></span>' +
        '<span class="opt__main"><b>' + s.name + (s.tag ? '<span class="opt__tag">' + s.tag + "</span>" : "") + "</b><small>" + s.desc + " · " + s.dur + " min</small></span>" +
        '<span class="opt__price">' + fmt(s.price) + " MT</span></label>";
    }).join("");
    $("[data-opts-barber]").innerHTML = BARBERS.map(function (b) {
      var pic = b.img ? '<img src="' + b.img + '" alt="" width="44" height="44" loading="lazy">' : '<span class="opt__any" aria-hidden="true">ANY</span>';
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
    var day = DAYS[state.dayI], list = slotsFor(day, state.barber);
    var free = list.filter(function (s) { return s.ok; });
    if (state.time !== null && !list.some(function (s) { return s.t === state.time && s.ok; })) state.time = null;
    $("[data-times]").innerHTML = list.filter(function (s) { return !s.past; }).map(function (s) {
      return '<button type="button" class="time' + (s.t === state.time ? " is-active" : "") + '" data-time="' + s.t + '"' + (s.ok ? "" : ' disabled aria-label="' + s.label + ' booked"') + ">" + s.label + "</button>";
    }).join("") || '<p class="bk__hint">No more times today. Pick another day.</p>';
    var when = day.i < 2 ? dayLabel(day).toLowerCase() : "on " + dayLabel(day);
    $("[data-times-hint]").innerHTML = free.length && free.length <= 6 ? "<b>Only " + free.length + " slots left " + when + ".</b> Crossed-out times are booked." : "Crossed-out times are already booked.";
  }
  function renderSummary() {
    var s = svcById(state.service), b = barberById(state.barber), d = DAYS[state.dayI];
    $("[data-summary]").innerHTML =
      "<div><span>Service</span><b>" + s.name + "</b></div><div><span>Barber</span><b>" + b.name + "</b></div>" +
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
    el.innerHTML = !t ? "—" : t.disc ? "<s>" + fmt(t.base) + "</s>" + fmt(t.total) + " MT" : fmt(t.total) + " MT";
  }
  function canContinue() { return state.step === 1 ? !!state.service : state.step === 2 ? !!state.barber : state.step === 3 ? state.time !== null : state.step === 4; }
  function goTo(step) {
    state.step = step;
    $$(".bk__pane", modal).forEach(function (p) { p.classList.toggle("is-active", +p.getAttribute("data-pane") === step); });
    $("[data-bk-title]").textContent = TITLES[step];
    $("[data-bk-steplabel]").textContent = step <= 4 ? "Step " + step + " of 4" : "Almost done";
    $("[data-bk-bar]").style.width = (step >= 5 ? 100 : step * 25) + "%";
    $("[data-bk-back]").hidden = step === 1 || step === 5;
    $("[data-bk-foot]").hidden = step === 5;
    var next = $("[data-bk-next]");
    next.textContent = step === 4 ? "Confirm booking" : "Continue";
    if (step === 3) { renderDays(); renderTimes(); }
    if (step === 4) renderSummary();
    $$('input[name="service"]', form).forEach(function (i) { i.checked = i.value === state.service; });
    $$('input[name="barber"]', form).forEach(function (i) { i.checked = i.value === state.barber; });
    if (state.code && !form.elements.code.value) form.elements.code.value = state.code;
    next.disabled = !canContinue();
    renderTotal();
    $(".bk__body", modal).scrollTop = 0;
    track("booking_step", { step: step });
  }
  function openBooking(o) {
    o = o || {};
    if (o.service) state.service = o.service;
    if (o.barber) { state.barber = o.barber; state.barberSet = !!o.barberSet || o.barber !== "any"; }
    if (typeof o.dayI === "number") state.dayI = o.dayI;
    if (typeof o.time === "number") state.time = o.time;
    if (o.code) state.code = o.code;
    if (state.time === null && typeof o.dayI !== "number") { var nf = nextFree(1, state.barber); if (nf) state.dayI = nf.day.i; }
    var start = !state.service ? 1 : !state.barberSet && state.time === null ? 2 : state.time === null ? 3 : 4;
    lastFocus = document.activeElement;
    modal.hidden = false;
    lockScroll(true);
    goTo(start);
    setTimeout(function () { var f = $(".bk__pane.is-active input, .bk__pane.is-active button", modal) || $("[data-close].bk__icon", modal); if (f) f.focus({ preventScroll: true }); }, 60);
    track("booking_open", { source: o.src || "unknown", service: state.service || "" });
  }
  function closeBooking() {
    modal.hidden = true;
    lockScroll(false);
    if (state.step === 5) { state = { step: 1, service: null, barber: "any", barberSet: false, dayI: 0, time: null, code: state.code }; form.reset(); }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function submitBooking() {
    var nameF = form.elements.name, phoneF = form.elements.phone;
    var nw = nameF.closest(".field"), pw = phoneF.closest(".field");
    nw.classList.toggle("is-invalid", nameF.value.trim().length < 2);
    pw.classList.toggle("is-invalid", !/^8[2-7]\d{7}$/.test(phoneF.value.replace(/\D/g, "")));
    if (nw.classList.contains("is-invalid")) { nameF.focus(); return; }
    if (pw.classList.contains("is-invalid")) { phoneF.focus(); return; }
    state.code = form.elements.code.value;
    var s = svcById(state.service), b = barberById(state.barber), d = DAYS[state.dayI], t = totals();
    var msg = "Hi Ghost Control! I'd like to book:\n• Service: " + s.name + "\n• Barber: " + b.name +
      "\n• When: " + DAY_LONG[d.wd] + " " + d.d + " " + MONTHS[d.m] + " at " + hm(state.time) +
      "\n• Price: " + fmt(t.total) + " MT" + (t.disc ? " (code " + DISCOUNT_CODE + ")" : "") +
      "\n• Name: " + nameF.value.trim() + "\n• Phone: +258 " + phoneF.value.trim();
    var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
    $("[data-done-wa]").href = url;
    $("[data-done-text]").innerHTML = "<b>" + s.name + "</b> with " + b.name + ", " + dayLabel(d).toLowerCase() + " " + d.d + " " + MONTHS[d.m] + " at " + hm(state.time) + ".<br>WhatsApp has opened with your details. Hit send and we’ll confirm within minutes.";
    window.open(url, "_blank", "noopener");
    track("booking_submit", { service: s.id, barber: b.id, value: t.total, currency: "MZN" });
    ssSet("gc_booked", "1");
    goTo(5);
  }
  function downloadICS() {
    var s = svcById(state.service), d = DAYS[state.dayI];
    if (!s || state.time === null) return;
    var start = new Date(Date.UTC(d.y, d.m, d.d, 0, state.time - 120)); // Maputo is UTC+2, no DST
    var end = new Date(start.getTime() + s.dur * 60000);
    var f = function (x) { return x.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); };
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ghost Control Barbers//EN", "BEGIN:VEVENT", "UID:" + Date.now() + "@ghostcontrol",
      "DTSTAMP:" + f(new Date()), "DTSTART:" + f(start), "DTEND:" + f(end), "SUMMARY:" + s.name + " at Ghost Control Barbers",
      "LOCATION:Av. Julius Nyerere 1250\\, Polana\\, Maputo", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "ghost-control-booking.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function initBooking() {
    renderOptions();
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
      if (t.name === "service") { state.service = t.value; renderTotal(); $("[data-bk-next]").disabled = false; setTimeout(function () { if (state.step === 1) goTo(state.barberSet && state.time !== null ? 4 : state.barberSet ? 3 : 2); }, 260); }
      if (t.name === "barber") { state.barber = t.value; state.barberSet = true; setTimeout(function () { if (state.step === 2) goTo(3); }, 260); }
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

  /* ---------- Header & navigation ---------- */
  var burger = $("[data-burger]"), mnav = $("[data-mnav]");
  function closeMenu() {
    if (!mnav.classList.contains("is-open")) return;
    mnav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu");
    lockScroll(false);
  }
  function initHeader() {
    var header = $("[data-header]"), mbar = $("[data-mbar]"), ctas = $(".hero__ctas"), lastY = 0;
    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 20);
      if (y > 700 && y > lastY + 6 && !mnav.classList.contains("is-open")) header.classList.add("is-hidden");
      else if (y < lastY - 6 || y < 700) header.classList.remove("is-hidden");
      lastY = y;
      if (mbar) mbar.classList.toggle("is-visible", ctas.getBoundingClientRect().bottom < 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    mnav.setAttribute("data-lenis-prevent", "");
    burger.addEventListener("click", function () {
      if (mnav.classList.contains("is-open")) { closeMenu(); return; }
      mnav.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", "Close menu");
      lockScroll(true);
    });
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href"), el = id === "#top" ? document.body : $(id);
      if (!el) return;
      e.preventDefault();
      closeMenu();
      if (lenis) lenis.scrollTo(id === "#top" ? 0 : el, { offset: id === "#top" ? 0 : -60, duration: 1.2 });
      else window.scrollTo({ top: id === "#top" ? 0 : el.getBoundingClientRect().top + window.scrollY - 60, behavior: "smooth" });
    });
    var links = $$(".nav a");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id); }); });
      }, { rootMargin: "-45% 0px -50% 0px" });
      $$("main section[id]").forEach(function (s) { io.observe(s); });
    }
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      if (a.hasAttribute("data-wa")) track("whatsapp_click", { location: (a.closest("section, header, footer, .mbar") || { className: "" }).className });
      if ((a.getAttribute("href") || "").indexOf("tel:") === 0) track("call_click", {});
    });
  }

  /* ---------- Copy code / toast ---------- */
  var toastEl = $("[data-toast]"), toastTimer;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("is-on"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2800); }
  function initCopy() {
    $$("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var code = b.getAttribute("data-copy");
        var done = function () { $("[data-copy-label]", b).textContent = "Copied"; toast("Code " + code + " copied. It’s applied automatically when you book online."); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, done); else done();
        state.code = code;
        track("promo_copy", { code: code });
      });
    });
  }

  /* ---------- Exit intent (desktop, once per session) ---------- */
  var exitEl = $("[data-exit]");
  function closeExit() { if (!exitEl.hidden) { exitEl.hidden = true; lockScroll(false); } }
  function initExit() {
    var armed = false;
    setTimeout(function () { armed = true; }, 12000);
    document.addEventListener("mouseout", function (e) {
      if (!armed || e.relatedTarget || e.clientY > 0 || window.innerWidth < 900 || !modal.hidden || ssGet("gc_exit") || ssGet("gc_booked")) return;
      ssSet("gc_exit", "1");
      exitEl.hidden = false; lockScroll(true);
      track("exit_intent_shown", {});
    });
    $$("[data-exit-close]", exitEl).forEach(function (b) { b.addEventListener("click", closeExit); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeExit(); });
  }

  /* ---------- Motion: smooth scroll + restrained reveals ---------- */
  function initMotion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST || REDUCED) return;
    gsap.registerPlugin(ST);
    if (window.Lenis) {
      lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on("scroll", ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero__media img", { scale: 1.12, duration: 2.2, ease: "power2.out" }, 0)
      .from("[data-hero-line]", { yPercent: 40, autoAlpha: 0, duration: 1, stagger: .12 }, .15)
      .from("[data-hero]", { y: 24, autoAlpha: 0, duration: .9, stagger: .08 }, .35);
    gsap.to(".hero__media img", { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    gsap.set(".reveal", { autoAlpha: 0, y: 32 });
    ST.batch(".reveal", { start: "top 90%", once: true, onEnter: function (els) { gsap.to(els, { autoAlpha: 1, y: 0, duration: .9, ease: "power3.out", stagger: .08, overwrite: true, clearProps: "transform" }); } });

    $$("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count")), dec = +(el.getAttribute("data-decimals") || 0), o = { v: 0 };
      ST.create({ trigger: el, start: "top 92%", once: true, onEnter: function () {
        gsap.to(o, { v: target, duration: 1.6, ease: "power2.out", onUpdate: function () { el.textContent = dec ? o.v.toFixed(dec) : fmt(Math.round(o.v)); } });
      } });
    });
    window.addEventListener("load", function () { ST.refresh(); });
  }

  function boot() {
    initLive();
    initBooking();
    initMotion();
    initHeader();
    initCopy();
    initExit();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
