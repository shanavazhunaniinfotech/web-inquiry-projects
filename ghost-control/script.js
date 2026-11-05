/* ==========================================================
   Ghost Control Barbers — home page interactions
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
    { id: "cut-beard", name: "Cut + Beard Combo", price: 1100, was: 1200, dur: 70, desc: "Any cut + full beard sculpt", tag: "Save 100 MT" },
    { id: "beard", name: "Beard Sculpt", price: 400, dur: 25, desc: "Shape, trim & razor line-up" },
    { id: "shave", name: "Hot-Towel Shave", price: 500, dur: 30, desc: "Straight razor + hot towels" },
    { id: "ritual", name: "The Ghost Ritual", price: 1800, dur: 90, desc: "Cut, beard, shave, mask & drink", tag: "Signature" },
    { id: "kids", name: "Kids Cut (under 12)", price: 450, dur: 30, desc: "Patient, fun and fast" }
  ];
  var BARBERS = [
    { id: "any", name: "Any barber", role: "Fastest option · we match you with the right specialist", tag: "Recommended" },
    { id: "tiago", name: "Tiago M.", role: "Head Barber · Fades & designs · ★ 5.0", img: IMG("1567894340315-735d7c361db0", 96, 96) },
    { id: "nelson", name: "Nelson C.", role: "Senior · Beards & shaves · ★ 4.9", img: IMG("1593702288056-7927b442d0fa", 96, 96) },
    { id: "amina", name: "Amina J.", role: "Stylist · Curls & textured hair · ★ 4.9", img: IMG("1595476108010-b4d1f102b1b1", 96, 96) },
    { id: "rui", name: "Rui P.", role: "Barber · Classic & scissor cuts · ★ 4.8", img: IMG("1622287162716-f311baa1a2b8", 96, 96) }
  ];
  // Opening hours in minutes from midnight, keyed by weekday (0 = Sunday)
  var HOURS = { 0: [540, 840], 1: [480, 1200], 2: [480, 1200], 3: [480, 1200], 4: [480, 1200], 5: [480, 1200], 6: [480, 1140] };
  var DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (n) { return n.toLocaleString("en-US"); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var hm = function (m) { return pad(Math.floor(m / 60)) + ":" + pad(m % 60); };

  /* ---------- Analytics stub (ready for GA4 / Meta Pixel) ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(event, data) {
    var payload = Object.assign({ event: event }, data || {});
    window.dataLayer.push(payload);
  }

  /* ---------- Safe storage ---------- */
  function ssGet(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }

  /* ---------- Maputo time ---------- */
  function mzNow() {
    var d = new Date();
    try {
      var parts = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(d);
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      var y = +o.year, mo = +o.month - 1, da = +o.day, h = +o.hour % 24, mi = +o.minute;
      var local = new Date(Date.UTC(y, mo, da));
      return { y: y, m: mo, d: da, wd: local.getUTCDay(), min: h * 60 + mi };
    } catch (e) {
      return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate(), wd: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var NOW = mzNow();

  // Build the next 7 days (in Maputo calendar)
  function buildDays() {
    var out = [];
    for (var i = 0; i < 7; i++) {
      var dt = new Date(Date.UTC(NOW.y, NOW.m, NOW.d + i));
      out.push({ i: i, y: dt.getUTCFullYear(), m: dt.getUTCMonth(), d: dt.getUTCDate(), wd: dt.getUTCDay(), key: dt.toISOString().slice(0, 10) });
    }
    return out;
  }
  var DAYS = buildDays();

  // Deterministic pseudo-random so availability looks real and stays stable on reload
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) / 4294967295;
  }

  function slotsFor(day, barber) {
    var hrs = HOURS[day.wd];
    var list = [];
    for (var t = hrs[0]; t <= hrs[1] - 30; t += 30) {
      var past = day.i === 0 && t < NOW.min + 30;
      var busyChance = barber === "any" ? 0.35 : 0.5;
      // Busier in evenings & Saturdays
      if (t >= 1020 || day.wd === 6) busyChance += 0.15;
      var taken = hash(day.key + "|" + t + "|" + barber) < busyChance;
      list.push({ t: t, label: hm(t), ok: !past && !taken, past: past });
    }
    return list;
  }

  function nextFree(count) {
    for (var i = 0; i < DAYS.length; i++) {
      var free = slotsFor(DAYS[i], "any").filter(function (s) { return s.ok; });
      if (free.length) return { day: DAYS[i], slots: free.slice(0, count), total: free.length };
    }
    return null;
  }

  function dayLabel(day) {
    if (day.i === 0) return "Today";
    if (day.i === 1) return "Tomorrow";
    return DAY_LONG[day.wd];
  }

  /* ---------- Open/closed status ---------- */
  function initStatus() {
    var hrs = HOURS[NOW.wd];
    var open = NOW.min >= hrs[0] && NOW.min < hrs[1];
    var text;
    if (open) {
      text = "Open now · until " + hm(hrs[1]);
    } else {
      var nd = NOW.min < hrs[0] ? { label: "today", h: hrs[0] } : { label: DAY_LONG[(NOW.wd + 1) % 7], h: HOURS[(NOW.wd + 1) % 7][0] };
      text = "Closed · opens " + nd.label + " " + hm(nd.h);
    }
    $$("[data-status]").forEach(function (el) {
      el.classList.toggle("is-closed", !open);
      var t = $("[data-status-text]", el);
      if (t) t.textContent = text;
    });
    var row = $('[data-hours] tr[data-day="' + NOW.wd + '"]');
    if (row) row.classList.add("is-today");
    var y = $("[data-year]");
    if (y) y.textContent = NOW.y;
  }

  /* ---------- Hero slots ---------- */
  function initHeroSlots() {
    var box = $("[data-hero-slots]");
    if (!box) return;
    var nf = nextFree(6);
    if (!nf) return;
    var dayEl = $("[data-slot-day]");
    if (dayEl) dayEl.textContent = dayLabel(nf.day) + " · " + DAY_SHORT[nf.day.wd] + " " + nf.day.d + " " + MONTHS[nf.day.m];
    var shown = nf.slots.length >= 3 ? nf.slots.slice(0, Math.floor(nf.slots.length / 3) * 3) : nf.slots;
    box.innerHTML = shown.map(function (s) {
      return '<button type="button" class="slot" data-hero-slot="' + s.t + '" data-day-i="' + nf.day.i + '">' + s.label + "<small>Any barber</small></button>";
    }).join("");
    var left = Math.min(nf.total, 12);
    $$("[data-slots-left]").forEach(function (el) { el.textContent = left; });
    var fs = $("[data-final-slots]");
    if (fs) fs.textContent = nf.day.i === 0 ? "Only " + left : "Only " + left + " " + dayLabel(nf.day).toLowerCase() + "’s";
    box.addEventListener("click", function (e) {
      var b = e.target.closest("[data-hero-slot]");
      if (!b) return;
      var svc = $("[data-hero-service]");
      openBooking({ service: svc ? svc.value : null, dayI: +b.getAttribute("data-day-i"), time: +b.getAttribute("data-hero-slot"), barber: "any", barberSet: true, src: "hero-slot" });
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
      var pic = b.img ? '<img src="' + b.img + '" alt="" width="48" height="48" loading="lazy">' : '<span class="opt__any" aria-hidden="true">⚡</span>';
      return '<label class="opt"><input type="radio" name="barber" value="' + b.id + '">' + pic +
        '<span class="opt__main"><b>' + b.name + (b.tag ? '<span class="opt__tag">' + b.tag + "</span>" : "") + "</b><small>" + b.role + "</small></span>" +
        '<span class="opt__radio"></span></label>';
    }).join("");
  }
  function renderDays() {
    $("[data-days]").innerHTML = DAYS.map(function (d) {
      var free = slotsFor(d, state.barber).filter(function (s) { return s.ok; }).length;
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
    var hint = $("[data-times-hint]");
    hint.innerHTML = free.length && free.length <= 6 ? "<b>Only " + free.length + " slots left</b> on " + dayLabel(day).toLowerCase().replace(/^\w/, function (c) { return c.toUpperCase(); }) + ". Crossed-out times are already booked." : "Crossed-out times are already booked.";
  }
  function renderSummary() {
    var s = svcById(state.service), b = barberById(state.barber), d = DAYS[state.dayI];
    if (!s || state.time === null) return;
    var end = state.time + s.dur;
    $("[data-summary]").innerHTML =
      "<div><span>Service</span><b>" + s.name + "</b></div>" +
      "<div><span>Barber</span><b>" + b.name + "</b></div>" +
      "<div><span>When</span><b>" + dayLabel(d) + ", " + d.d + " " + MONTHS[d.m] + " · " + hm(state.time) + "–" + hm(end) + "</b></div>";
  }
  function totals() {
    var s = svcById(state.service);
    if (!s) return null;
    var disc = (state.code || "").trim().toUpperCase() === DISCOUNT_CODE;
    var total = disc ? Math.round(s.price * (1 - DISCOUNT) / 10) * 10 : s.price;
    return { base: s.price, total: total, disc: disc };
  }
  function renderTotal() {
    var t = totals();
    var el = $("[data-bk-total]");
    if (!t) { el.textContent = "—"; return; }
    el.innerHTML = t.disc ? "<s>" + fmt(t.base) + "</s>" + fmt(t.total) + " MT" : fmt(t.total) + " MT";
  }

  function canContinue() {
    if (state.step === 1) return !!state.service;
    if (state.step === 2) return !!state.barber;
    if (state.step === 3) return state.time !== null;
    if (state.step === 4) return true;
    return false;
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
    next.textContent = step === 4 ? "Confirm booking" : "Continue";
    if (step === 3) { renderDays(); renderTimes(); }
    if (step === 4) renderSummary();
    syncInputs();
    next.disabled = !canContinue();
    renderTotal();
    $(".bk__body", modal).scrollTop = 0;
    track("booking_step", { step: step });
  }

  function syncInputs() {
    $$('input[name="service"]', form).forEach(function (i) { i.checked = i.value === state.service; });
    $$('input[name="barber"]', form).forEach(function (i) { i.checked = i.value === state.barber; });
    var c = form.elements.code;
    if (c && state.code && !c.value) c.value = state.code;
  }

  function openBooking(opts) {
    opts = opts || {};
    if (opts.service) state.service = opts.service;
    if (opts.barber) { state.barber = opts.barber; state.barberSet = !!opts.barberSet || opts.barber !== "any"; }
    if (typeof opts.dayI === "number") state.dayI = opts.dayI;
    if (typeof opts.time === "number") state.time = opts.time;
    if (opts.code) state.code = opts.code;
    if (state.time === null) {
      var nf = nextFree(1);
      if (nf) state.dayI = nf.day.i;
    }
    var start = !state.service ? 1 : !state.barberSet && state.time === null ? 2 : state.time === null ? 3 : 4;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.documentElement.style.overflow = "hidden";
    goTo(start);
    setTimeout(function () { var f = $(".bk__pane.is-active input, .bk__pane.is-active button", modal) || $("[data-close].bk__close", modal); if (f) f.focus({ preventScroll: true }); }, 60);
    track("booking_open", { source: opts.src || "unknown", service: state.service || "" });
  }

  function closeBooking() {
    modal.hidden = true;
    document.documentElement.style.overflow = "";
    if (state.step === 5) {
      // reset after a completed booking
      state = { step: 1, service: null, barber: "any", barberSet: false, dayI: 0, time: null, code: state.code };
      form.reset();
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function validPhone(v) { return /^8[2-7]\d{7}$/.test(v.replace(/\D/g, "")); }

  function submitBooking() {
    var nameField = form.elements.name, phoneField = form.elements.phone;
    var ok = true;
    var nameWrap = nameField.closest(".field"), phoneWrap = phoneField.closest(".field");
    nameWrap.classList.toggle("is-invalid", nameField.value.trim().length < 2);
    phoneWrap.classList.toggle("is-invalid", !validPhone(phoneField.value));
    if (nameWrap.classList.contains("is-invalid")) { ok = false; nameField.focus(); }
    else if (phoneWrap.classList.contains("is-invalid")) { ok = false; phoneField.focus(); }
    if (!ok) return;
    state.code = form.elements.code.value;
    var s = svcById(state.service), b = barberById(state.barber), d = DAYS[state.dayI], t = totals();
    var msg = "Hi Ghost Control! I'd like to book:\n" +
      "• Service: " + s.name + "\n" +
      "• Barber: " + b.name + "\n" +
      "• When: " + DAY_LONG[d.wd] + " " + d.d + " " + MONTHS[d.m] + " at " + hm(state.time) + "\n" +
      "• Price: " + fmt(t.total) + " MT" + (t.disc ? " (code " + DISCOUNT_CODE + " applied)" : "") + "\n" +
      "• Name: " + nameField.value.trim() + "\n" +
      "• Phone: +258 " + phoneField.value.trim();
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
    // Maputo is UTC+2 all year (no DST)
    var startUtc = new Date(Date.UTC(d.y, d.m, d.d, 0, state.time - 120));
    var endUtc = new Date(startUtc.getTime() + s.dur * 60000);
    var f = function (dt) { return dt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); };
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ghost Control Barbers//Booking//EN", "BEGIN:VEVENT",
      "UID:" + Date.now() + "@ghostcontrol", "DTSTAMP:" + f(new Date()), "DTSTART:" + f(startUtc), "DTEND:" + f(endUtc),
      "SUMMARY:" + s.name + " at Ghost Control Barbers", "LOCATION:Av. Julius Nyerere 1250\\, Polana\\, Maputo",
      "DESCRIPTION:See you soon! Need to reschedule? WhatsApp +258 84 000 0000", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var blob = new Blob([ics], { type: "text/calendar" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ghost-control-booking.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  function initBooking() {
    if (!modal) return;
    renderServices();
    renderBarbers();

    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-book]");
      if (!btn) return;
      e.preventDefault();
      var opts = { src: btn.getAttribute("data-src") };
      if (btn.hasAttribute("data-service")) opts.service = btn.getAttribute("data-service");
      if (btn.hasAttribute("data-barber")) { opts.barber = btn.getAttribute("data-barber"); opts.barberSet = true; }
      if (btn.hasAttribute("data-code")) opts.code = btn.getAttribute("data-code");
      if (btn.hasAttribute("data-from-hero")) { var sel = $("[data-hero-service]"); if (sel) opts.service = sel.value; }
      closeExit();
      closeMenu();
      openBooking(opts);
    });

    $$("[data-close]", modal).forEach(function (el) { el.addEventListener("click", closeBooking); });
    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") closeBooking();
      if (e.key === "Tab") {
        var f = $$('button:not([disabled]):not([hidden]), input:not([type="radio"]), input[type="radio"]:checked, a[href], [tabindex="0"]', $(".modal__panel", modal)).filter(function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "service") {
        state.service = t.value; renderTotal();
        $("[data-bk-next]").disabled = false;
        setTimeout(function () { if (state.step === 1) goTo(2); }, 260);
      }
      if (t.name === "barber") {
        state.barber = t.value; state.barberSet = true;
        setTimeout(function () { if (state.step === 2) goTo(3); }, 260);
      }
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

    $("[data-bk-next]").addEventListener("click", function () {
      if (!canContinue()) return;
      if (state.step < 4) goTo(state.step + 1);
      else submitBooking();
    });
    $("[data-bk-back]").addEventListener("click", function () { if (state.step > 1) goTo(state.step - 1); });
    $("[data-ics]").addEventListener("click", downloadICS);
  }

  /* ---------- Header, nav, menu ---------- */
  var burger = $("[data-burger]"), mnav = $("[data-mnav]");
  function closeMenu() {
    if (!mnav) return;
    mnav.classList.remove("is-open");
    if (burger) { burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu"); }
  }
  function initHeader() {
    var header = $("[data-header]"), mbar = $("[data-mbar]"), fab = $(".fab-wa");
    var hero = $(".hero__ctas");
    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 10);
      if (mbar) {
        var heroBottom = hero ? hero.getBoundingClientRect().bottom : 400;
        mbar.classList.toggle("is-visible", heroBottom < 0);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (burger) burger.addEventListener("click", function () {
      var open = !mnav.classList.contains("is-open");
      mnav.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    $$("a", mnav).forEach(function (a) { a.addEventListener("click", closeMenu); });

    // Active nav link
    var links = $$(".nav a");
    if ("IntersectionObserver" in window && links.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id); });
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      links.forEach(function (l) { var s = $(l.getAttribute("href")); if (s) io.observe(s); });
    }

    // Nudge the WhatsApp tooltip once after 12s
    if (fab) setTimeout(function () { fab.classList.add("show-tip"); setTimeout(function () { fab.classList.remove("show-tip"); }, 4500); }, 12000);

    // Track WhatsApp & call clicks
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      if (a.hasAttribute("data-wa")) track("whatsapp_click", { location: (a.closest("section, header, footer, .mbar") || {}).className || "fab" });
      if ((a.getAttribute("href") || "").indexOf("tel:") === 0) track("call_click", {});
    });
  }

  /* ---------- Services filter ---------- */
  function initTabs() {
    var tabs = $$("[data-filter]");
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        var f = t.getAttribute("data-filter");
        tabs.forEach(function (x) { var on = x === t; x.classList.toggle("is-active", on); x.setAttribute("aria-selected", String(on)); });
        $$("[data-svc-grid] .svc").forEach(function (card) {
          var c = card.getAttribute("data-cat");
          card.classList.toggle("is-hidden", !(f === "all" || c === f || c === "all"));
        });
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    });
  }

  /* ---------- Before / after ---------- */
  function initBA() {
    $$("[data-ba]").forEach(function (ba) {
      var r = $("[data-ba-range]", ba);
      var set = function () { ba.style.setProperty("--pos", r.value + "%"); };
      r.addEventListener("input", set);
      set();
    });
  }

  /* ---------- Reviews carousel ---------- */
  function initReviews() {
    var track_ = $("[data-rv-track]");
    if (!track_) return;
    var step = function (dir) {
      var card = $(".rv", track_);
      var w = card ? card.getBoundingClientRect().width + 24 : 300;
      track_.scrollBy({ left: dir * w, behavior: "smooth" });
    };
    $("[data-rv-prev]").addEventListener("click", function () { step(-1); });
    $("[data-rv-next]").addEventListener("click", function () { step(1); });
  }

  /* ---------- Copy code ---------- */
  var toastEl = $("[data-toast]"), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2800);
  }
  function initCopy() {
    $$("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var code = b.getAttribute("data-copy");
        var done = function () { var l = $("[data-copy-label]", b); if (l) l.textContent = "Copied ✓"; toast("Code " + code + " copied. It’s applied automatically when you book."); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, done);
        else done();
        state.code = code;
        track("promo_copy", { code: code });
      });
    });
  }

  /* ---------- Exit intent ---------- */
  var exitEl = $("[data-exit]");
  function closeExit() { if (exitEl && !exitEl.hidden) { exitEl.hidden = true; document.documentElement.style.overflow = ""; } }
  function initExit() {
    if (!exitEl) return;
    var armed = false;
    setTimeout(function () { armed = true; }, 8000);
    document.addEventListener("mouseout", function (e) {
      if (!armed || e.relatedTarget || e.clientY > 0) return;
      if (window.innerWidth < 900 || !modal.hidden || ssGet("gc_exit") || ssGet("gc_booked") || document.body.classList.contains("notes-on")) return;
      ssSet("gc_exit", "1");
      exitEl.hidden = false;
      document.documentElement.style.overflow = "hidden";
      track("exit_intent_shown", {});
    });
    $$("[data-exit-close]", exitEl).forEach(function (b) { b.addEventListener("click", closeExit); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeExit(); });
  }

  /* ==========================================================
     DESIGN NOTES — "Why this layout?" proposal mode
     ========================================================== */
  var NOTES = [
    { target: ".hero__copy", where: "prepend", title: "Above the fold: answer “what, where, why trust, what next” in 5 seconds",
      points: [
        "<b>Benefit headline</b> attacks the two biggest barbershop frustrations: waiting and bad cuts.",
        "<b>One primary CTA</b> (brass “Book your chair”) plus <b>WhatsApp</b> as secondary, the channel most people in Mozambique already use daily.",
        "<b>Social proof right under the buttons</b> (4.9★, 620+ reviews) reduces risk at the exact moment of decision.",
        "<b>“Next free chairs” card</b> shows real open times: one tap and the booking is 80% done. “Slots left” adds honest urgency.",
        "<b>Risk reversal</b> under the button: no prepayment, free cancellation.",
        "<b>Top bar</b> shows live open/closed status (Maputo time) and the first-visit offer. <b>Sticky header</b> keeps Call + Book reachable while scrolling."
      ], kpi: "Goal: booking-start rate" },
    { target: ".proof", where: "prepend", title: "Trust strip directly after the hero",
      points: [
        "Big numbers are scanned in under 2 seconds and build credibility before the visitor reads anything else.",
        "<b>M-Pesa / e-Mola / card / cash</b> removes a common local doubt: “can I pay with my phone?”"
      ], kpi: "Goal: lower bounce rate" },
    { target: "#services", where: "prepend", title: "Services with transparent prices, placed high on the page",
      points: [
        "Not knowing the price is one of the top reasons people leave without booking, so we show it clearly.",
        "Every card has its own <b>Book</b> button that pre-selects the service, skipping a step.",
        "<b>“Most booked”</b> badge guides undecided visitors. <b>Combo with strike-through price</b> shows value. <b>Premium “Ghost Ritual”</b> anchors the price so mid-tier services feel reasonable, raising the average ticket.",
        "<b>“Not sure?” card</b> captures undecided visitors on WhatsApp instead of losing them."
      ], kpi: "Goal: higher average order value" },
    { target: "#why", where: "prepend", title: "Why us: handle objections before they become reasons to leave",
      points: [
        "<b>On-time guarantee</b> targets the #1 complaint about barbershops (waiting).",
        "<b>Hygiene</b> and <b>master barbers</b> answer quality and safety doubts.",
        "<b>“Love it or we fix it free”</b> badge is a risk reversal that makes trying a new barber feel safe.",
        "The CTA comes right after the persuasion, when motivation is highest."
      ], kpi: "Goal: convert first-time visitors" },
    { target: "#work", where: "prepend", title: "Our work: show, don’t tell",
      points: [
        "An interactive <b>before/after slider</b> gets people playing with the page, which increases time on page and builds desire.",
        "Gallery proves skill across hair types. <b>“I want this look”</b> CTA sits at the emotional peak.",
        "Placeholder photos for now. We’ll swap in your real cuts and transformations."
      ], kpi: "Goal: engagement → bookings" },
    { target: "#barbers", where: "prepend", title: "Barbers: people book people",
      points: [
        "Faces build trust, and loyal clients want <b>their</b> barber. Each card books that barber directly (pre-selected).",
        "Individual ratings and specialities help new visitors pick the right person (e.g. curls → Amina).",
        "“First available” option in the booking flow stops choice from slowing anyone down."
      ], kpi: "Goal: repeat bookings" },
    { target: "#how", where: "prepend", title: "How it works: remove uncertainty about the process",
      points: [
        "Three simple steps show booking is quick and easy, with <b>WhatsApp confirmation</b> (no app, no account).",
        "Mentioning reminders sets the expectation that cuts <b>no-shows</b>."
      ], kpi: "Goal: booking completion rate" },
    { target: "#reviews", where: "prepend", title: "Reviews: third-party proof at the decision point",
      points: [
        "<b>Google badge</b> is trusted more than reviews the shop writes about itself.",
        "Each review is chosen to answer a specific doubt: punctuality, premium value, curly hair, kids, hygiene, easy booking.",
        "We can connect your real Google reviews live."
      ], kpi: "Goal: trust → action" },
    { target: "#offer", where: "prepend", title: "Offer: a reason to book today",
      points: [
        "<b>15% first-visit code</b> lowers the risk for new clients and is applied automatically in the booking flow.",
        "<b>Ghost Club membership</b> turns one-time clients into monthly recurring revenue.",
        "On desktop, an <b>exit-intent popup</b> (once per visit) offers the same discount to people about to leave."
      ], kpi: "Goal: new clients + retention" },
    { target: "#faq", where: "prepend", title: "FAQ: clear the last doubts",
      points: [
        "Answers the questions that stop people booking: walk-ins, payment, cancellation, guarantee, kids, parking.",
        "Anything else goes straight to WhatsApp, so no visitor is left with an unanswered question."
      ], kpi: "Goal: fewer drop-offs" },
    { target: "#visit", where: "prepend", title: "Visit: built for “barber near me” searches",
      points: [
        "Today’s opening hours are highlighted automatically. Directions and Call are one tap.",
        "The page already includes <b>LocalBusiness schema</b> (rating, hours, address) to help you show up in Google Maps and local search."
      ], kpi: "Goal: walk-ins + calls" },
    { target: ".final", where: "prepend", title: "Final CTA: catch visitors who scrolled to the end",
      points: ["Someone who scrolled this far is ready to book. Repeat the primary action with urgency (live slots left today)."], kpi: "Goal: last-chance conversion" },
    { target: ".footer", where: "prepend", title: "Site-wide conversion tools (try them!)",
      points: [
        "<b>4-step booking</b> in a pop-up with no page reload: progress bar, auto-advance, steps you’ve already chosen are skipped, booked times are crossed out, and the request is sent to WhatsApp with an add-to-calendar option. It can later connect to a booking system (Fresha, Booksy, Square, etc.).",
        "<b>Mobile sticky bar</b> (Call · WhatsApp · Book) stays within thumb reach. Most barbershop traffic is on mobile.",
        "<b>Floating WhatsApp</b> button on desktop.",
        "<b>Tracking events are ready</b> (booking open/step/submit, WhatsApp and call clicks) for GA4 / Meta Pixel, so we can measure and improve conversion."
      ], kpi: "Goal: measurable growth" }
  ];

  function initNotes() {
    var toggle = $("[data-notes-toggle]");
    if (!toggle) return;
    NOTES.forEach(function (n, i) {
      var host = $(n.target);
      if (!host) return;
      var el = document.createElement("aside");
      el.className = "cro-note";
      el.setAttribute("aria-label", "Design note " + (i + 1));
      el.innerHTML = '<div class="cro-note__in"><span class="cro-note__n">' + (i + 1) + "</span><div><h4>" + n.title + "</h4><ul>" +
        n.points.map(function (p) { return "<li>" + p + "</li>"; }).join("") + '</ul><span class="cro-note__kpi">' + n.kpi + "</span></div></div>";
      host.insertBefore(el, host.firstChild);
    });
    var set = function (on, announce) {
      document.body.classList.toggle("notes-on", on);
      toggle.setAttribute("aria-pressed", String(on));
      $("[data-notes-label]").textContent = on ? "Hide design notes" : "Why this layout?";
      if (announce && on) toast("Design notes on: each section now explains its conversion purpose.");
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    };
    toggle.addEventListener("click", function () { set(!document.body.classList.contains("notes-on"), true); });
    if (/[?&]notes=1/.test(location.search)) set(true, false);
  }

  /* ---------- GSAP animations ---------- */
  function initMotion() {
    if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero .eyebrow", { y: 20, autoAlpha: 0, duration: .6 })
      .from(".hero__title .line", { yPercent: 60, autoAlpha: 0, duration: .8, stagger: .12 }, "-=.3")
      .from(".hero__sub", { y: 20, autoAlpha: 0, duration: .6 }, "-=.45")
      .from(".hero__ctas .btn", { y: 20, autoAlpha: 0, duration: .5, stagger: .08 }, "-=.35")
      .from(".hero__trust", { y: 16, autoAlpha: 0, duration: .5 }, "-=.25")
      .from(".slotcard", { x: 40, autoAlpha: 0, duration: .8 }, "-=.9")
      .from(".slotcard .slot", { y: 12, autoAlpha: 0, duration: .4, stagger: .05 }, "-=.4");

    if (!window.ScrollTrigger) return;
    var ST = window.ScrollTrigger;

    gsap.to(".hero__bg", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    var revealSel = ".sec-head, .reviews__head, .svc, .barber, .step, .rv, .usp li, .gallery figure, .ba, .offer__card, .acc details, .faq__side, .visit__info, .visit__map, .final__in, .why__media, .tabs, .work__foot";
    gsap.set(revealSel, { autoAlpha: 0, y: 36 });
    ST.batch(revealSel, {
      start: "top 90%",
      once: true,
      onEnter: function (els) { gsap.to(els, { autoAlpha: 1, y: 0, duration: .8, ease: "power3.out", stagger: .08, overwrite: true, clearProps: "transform" }); }
    });

    $$("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var dec = +(el.getAttribute("data-decimals") || 0);
      var obj = { v: 0 };
      ST.create({
        trigger: el, start: "top 92%", once: true,
        onEnter: function () {
          gsap.to(obj, { v: target, duration: 1.6, ease: "power2.out", onUpdate: function () { el.textContent = dec ? obj.v.toFixed(dec) : fmt(Math.round(obj.v)); } });
        }
      });
    });

    gsap.from(".why__badge", { scale: .6, rotate: -15, autoAlpha: 0, duration: .8, ease: "back.out(1.8)", scrollTrigger: { trigger: ".why__media", start: "top 70%" } });
    window.addEventListener("load", function () { ST.refresh(); });
  }

  /* ---------- Boot ---------- */
  function boot() {
    initStatus();
    initHeroSlots();
    initBooking();
    initHeader();
    initTabs();
    initBA();
    initReviews();
    initCopy();
    initExit();
    initNotes();
    initMotion();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
