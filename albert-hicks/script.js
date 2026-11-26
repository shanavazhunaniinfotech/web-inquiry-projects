(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  var hasST = hasGsap && typeof window.ScrollTrigger !== "undefined";
  var store = {
    get: function (k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  var fmt = function (n) { return Math.round(n).toLocaleString("en-US"); };
  var money = function (n) {
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
    if (n >= 1e4) return "$" + (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return "$" + fmt(n);
  };

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (!reduced && typeof window.Lenis !== "undefined") {
    try {
      lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
      if (hasST) {
        lenis.on("scroll", window.ScrollTrigger.update);
        window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
        window.gsap.ticker.lagSmoothing(0);
      } else {
        var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    } catch (e) { lenis = null; }
  }
  if (hasST) window.gsap.registerPlugin(window.ScrollTrigger);

  function scrollToEl(el) {
    var off = -((($("#header") || {}).offsetHeight || 70) + 12);
    if (lenis) lenis.scrollTo(el, { offset: off, duration: 1.2 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset + off, behavior: reduced ? "auto" : "smooth" });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href");
    if (id.length < 2) return;
    var el = document.getElementById(id.slice(1));
    if (!el) return;
    e.preventDefault();
    closeMenu();
    if (a.hasAttribute("data-close")) closeModals();
    scrollToEl(el);
    if (history.replaceState) history.replaceState(null, "", id);
  });

  /* ---------- Header ---------- */
  var header = $("#header");
  var onScroll = function () {
    var y = window.pageYOffset;
    header.classList.toggle("is-scrolled", y > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var burger = $(".burger"), mnav = $("#mnav");
  function closeMenu() {
    if (!mnav || mnav.hidden) return;
    mnav.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
  }
  burger.addEventListener("click", function () {
    var open = mnav.hidden;
    mnav.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // active nav link
  var navLinks = $$(".nav a");
  if ("IntersectionObserver" in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (l) { var s = document.getElementById(l.getAttribute("href").slice(1)); if (s) navIO.observe(s); });
  }

  /* ---------- Reveal + counters ---------- */
  function countUp(el) {
    var end = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    if (reduced) { el.textContent = end.toFixed(dec); return; }
    var start = null, dur = 1600;
    var step = function (t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = dec ? (end * e).toFixed(dec) : fmt(end * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && !reduced) {
    document.documentElement.classList.add("anim");
    var revIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var sibs = $$("[data-reveal]", el.parentElement).filter(function (s) { return s.parentElement === el.parentElement; });
        var i = Math.max(0, sibs.indexOf(el));
        el.style.transitionDelay = Math.min(i * 0.08, 0.4) + "s";
        el.classList.add("is-in");
        $$("[data-count]", el).forEach(countUp);
        revIO.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$("[data-reveal]").forEach(function (el) { revIO.observe(el); });
  } else {
    $$("[data-reveal]").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Hero intro ---------- */
  if (hasGsap && !reduced) {
    var g = window.gsap;
    var tl = g.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero__title .line > span", { yPercent: 110, duration: 1.1, stagger: 0.1 })
      .from(".hero .pill, .hero__sub, .hero__ctas, .ticks, .proof", { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.8")
      .from(".phone", { y: 80, rotate: 12, opacity: 0, duration: 1.2 }, "-=1.1")
      .from(".chip", { scale: 0.6, opacity: 0, duration: 0.7, stagger: 0.12, ease: "back.out(1.8)" }, "-=0.7")
      .add(function () {
        $$(".chip").forEach(function (c, i) { c.classList.add("float"); c.style.animationDelay = (i * 0.9) + "s"; });
      });

    // subtle parallax on phone + chips
    var vis = $(".hero__visual");
    if (vis && window.matchMedia("(pointer: fine)").matches) {
      vis.closest(".hero").addEventListener("mousemove", function (e) {
        var x = (e.clientX / window.innerWidth - 0.5), y = (e.clientY / window.innerHeight - 0.5);
        g.to(".phone", { x: x * 18, y: y * 14, duration: 0.8, ease: "power2.out" });
        $$(".chip").forEach(function (c, i) { g.to(c, { x: x * (30 + i * 12), y: y * (20 + i * 8), duration: 1, ease: "power2.out" }); });
      });
    }
  } else {
    $$(".chip").forEach(function (c, i) { c.classList.add("float"); c.style.animationDelay = (i * 0.9) + "s"; });
  }

  // magnetic primary CTA
  if (!reduced && window.matchMedia("(pointer: fine)").matches) {
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.2 + "px," + (e.clientY - r.top - r.height / 2) * 0.3 + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }

  /* ---------- Case studies: horizontal scroll on desktop ---------- */
  if (hasST && !reduced) {
    var mm = window.gsap.matchMedia();
    mm.add("(min-width: 861px)", function () {
      var track = $(".cases__track");
      $(".cases").classList.add("is-pinned");
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      var tween = window.gsap.to(track, {
        x: function () { return -dist(); },
        ease: "none",
        scrollTrigger: {
          trigger: ".cases",
          start: "top top",
          end: function () { return "+=" + dist(); },
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });
      return function () { tween.kill(); $(".cases").classList.remove("is-pinned"); };
    });

    // process line progress
    window.ScrollTrigger.create({
      trigger: ".steps",
      start: "top 80%",
      end: "bottom 45%",
      scrub: true,
      onUpdate: function (s) { $(".process__line").style.setProperty("--p", s.progress.toFixed(3)); }
    });
    window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
  } else {
    var pl = $(".process__line"); if (pl) pl.style.setProperty("--p", 1);
  }

  /* ---------- Free audit form ---------- */
  var audit = $("#auditForm");
  audit.addEventListener("submit", function (e) {
    e.preventDefault();
    var h = audit.handle, em = audit.email, err = $(".err", audit);
    var handle = h.value.trim().replace(/^@/, "");
    h.parentElement.classList.toggle("bad", !handle);
    var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim());
    em.classList.toggle("bad", !okEmail);
    if (!handle) { err.textContent = "Please add your social handle."; h.focus(); return; }
    if (!okEmail) { err.textContent = "Please enter a valid email so we can send your audit."; em.focus(); return; }
    err.textContent = "";
    $(".done__h", audit).textContent = "@" + handle + " (" + audit.plat.value + ")";
    $(".done", audit).hidden = false;
    store.set("hs_audit", "1");
  });

  /* ---------- ROI calculator ---------- */
  var rB = $("#rBudget"), rV = $("#rValue");
  var rates = { ecom: { cpl: 12, close: 0.18 }, local: { cpl: 16, close: 0.25 }, b2b: { cpl: 55, close: 0.12 } };
  function fill(r) { r.style.setProperty("--fill", ((r.value - r.min) / (r.max - r.min) * 100) + "%"); }
  function calc() {
    var b = +rB.value, v = +rV.value, biz = ($('input[name="biz"]:checked') || {}).value || "ecom";
    var rt = rates[biz];
    var leads = b / rt.cpl, cust = leads * rt.close, rev = cust * v;
    $("#oBudget").textContent = "$" + fmt(b);
    $("#oValue").textContent = "$" + fmt(v);
    $("#cLeads").textContent = fmt(leads);
    $("#cCust").textContent = fmt(cust);
    $("#cRev").textContent = money(rev);
    fill(rB); fill(rV);
  }
  [rB, rV].forEach(function (r) { r.addEventListener("input", calc); });
  $$('input[name="biz"]').forEach(function (r) { r.addEventListener("change", calc); });
  calc();

  /* ---------- Pricing toggle ---------- */
  $$(".billing button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var mode = btn.getAttribute("data-bill");
      $$(".billing button").forEach(function (b) { var on = b === btn; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", String(on)); });
      $$(".price b[data-m]").forEach(function (b) { b.textContent = fmt(+b.getAttribute("data-" + mode)); });
    });
  });

  /* ---------- Booking wizard ---------- */
  var wiz = $("#wizard");
  var step = 1, total = 4;
  var steps = $$(".wstep", wiz);
  var bNext = $("#wNext"), bBack = $("#wBack"), wErr = $("#wErr");
  var picked = { day: null, time: null };

  function showStep(n) {
    step = n;
    steps.forEach(function (s) { s.classList.toggle("is-on", +s.getAttribute("data-step") === n); });
    $("#wStep").textContent = Math.min(n, total);
    $("#wBar").style.width = (Math.min(n, total) / total * 100) + "%";
    bBack.hidden = n === 1 || n > total;
    bNext.hidden = n > total;
    $(".wizard__nav", wiz).hidden = n > total;
    bNext.innerHTML = n === total ? 'Confirm my call <span class="arr" aria-hidden="true">→</span>' : 'Continue <span class="arr" aria-hidden="true">→</span>';
    wErr.textContent = "";
    if (n > 1 && n <= total) {
      var first = $('.wstep[data-step="' + n + '"] input, .wstep[data-step="' + n + '"] button', wiz);
      if (first && n === 3) setTimeout(function () { first.focus({ preventScroll: true }); }, 50);
    }
  }

  function valid(n) {
    if (n === 1 && !$('input[name="goal"]:checked', wiz)) return "Pick the goal that fits best.";
    if (n === 2 && !$('input[name="budget"]:checked', wiz)) return "Choose a budget range (a ballpark is fine).";
    if (n === 3) {
      var bad = null;
      ["name", "email", "site"].forEach(function (k) {
        var i = wiz[k], v = i.value.trim();
        var ok = k === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) : v.length > 1;
        i.classList.toggle("bad", !ok);
        if (!ok && !bad) bad = i;
      });
      if (bad) { bad.focus(); return bad.name === "email" ? "Please enter a valid email." : "Please fill in the highlighted fields."; }
    }
    if (n === 4 && (!picked.day || !picked.time)) return "Pick a day and a time.";
    return "";
  }

  bNext.addEventListener("click", function () {
    var msg = valid(step);
    if (msg) { wErr.textContent = msg; return; }
    if (step === total) {
      $("#dName").textContent = wiz.name.value.trim().split(" ")[0] || "friend";
      $("#dWhen").textContent = picked.day + " at " + picked.time;
      $("#dEmail").textContent = wiz.email.value.trim();
      store.set("hs_booked", "1");
    }
    showStep(step + 1);
  });
  bBack.addEventListener("click", function () { showStep(Math.max(1, step - 1)); });

  // auto-advance on single-choice steps
  $$('input[name="goal"], input[name="budget"]', wiz).forEach(function (r) {
    r.addEventListener("change", function () {
      wErr.textContent = "";
      var s = r.name === "goal" ? 1 : 2;
      setTimeout(function () { if (step === s) showStep(s + 1); }, 320);
    });
  });
  // Enter key on fields
  wiz.addEventListener("submit", function (e) { e.preventDefault(); bNext.click(); });
  $$(".fields input", wiz).forEach(function (i) {
    i.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); bNext.click(); } });
    i.addEventListener("input", function () { i.classList.remove("bad"); });
  });

  // calendar: next 5 weekdays
  (function buildSlots() {
    var days = $("#days"), times = $("#times");
    var d = new Date(); d.setDate(d.getDate() + 1);
    var names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var list = [];
    while (list.length < 5) {
      var mo = d.getMonth(), da = d.getDate(), wd = d.getDay();
      var holiday = (mo === 10 && wd === 4 && da >= 22 && da <= 28) || (mo === 11 && (da === 24 || da === 25 || da === 31)) || (mo === 0 && da === 1) || (mo === 6 && da === 4);
      if (wd !== 0 && wd !== 6 && !holiday) list.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    var slots = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM"];
    function renderTimes(idx) {
      times.innerHTML = "";
      slots.forEach(function (s, j) {
        var b = document.createElement("button");
        b.type = "button"; b.textContent = s;
        b.setAttribute("role", "radio"); b.setAttribute("aria-checked", "false");
        if ((idx * 7 + j * 3) % 5 === 0) { b.disabled = true; b.setAttribute("aria-label", s + " (booked)"); }
        b.addEventListener("click", function () {
          $$("button", times).forEach(function (x) { x.setAttribute("aria-checked", "false"); });
          b.setAttribute("aria-checked", "true");
          picked.time = s + " ET"; wErr.textContent = "";
        });
        times.appendChild(b);
      });
    }
    list.forEach(function (dt, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "radio"); b.setAttribute("aria-checked", "false");
      b.innerHTML = "<small>" + names[dt.getDay()] + "</small><b>" + dt.getDate() + "</b>";
      b.setAttribute("aria-label", names[dt.getDay()] + " " + months[dt.getMonth()] + " " + dt.getDate());
      b.addEventListener("click", function () {
        $$("button", days).forEach(function (x) { x.setAttribute("aria-checked", "false"); });
        b.setAttribute("aria-checked", "true");
        picked.day = names[dt.getDay()] + ", " + months[dt.getMonth()] + " " + dt.getDate();
        picked.time = null;
        renderTimes(i);
      });
      days.appendChild(b);
    });
    days.firstChild.click();
    $("#tz").textContent = "All times Eastern (ET) · 30 minutes · Zoom or phone";
  })();

  // plan buttons pre-fill budget in the wizard
  var planBudget = { Grow: "$1,500 – $3,000", Scale: "$3,000 – $6,000", Dominate: "$6,000+" };
  $$("[data-plan]").forEach(function (a) {
    a.addEventListener("click", function () {
      var v = planBudget[a.getAttribute("data-plan")];
      $$('input[name="budget"]', wiz).forEach(function (r) { r.checked = r.value === v; });
    });
  });

  /* ---------- Sticky mobile bar ---------- */
  var mbar = $("#mbar"), hero = $(".hero"), book = $("#book");
  if ("IntersectionObserver" in window && mbar) {
    var heroOut = false, bookIn = false;
    var upd = function () { mbar.classList.toggle("is-on", heroOut && !bookIn); };
    new IntersectionObserver(function (en) { heroOut = !en[0].isIntersecting; upd(); }, { rootMargin: "-200px 0px 0px 0px" }).observe($(".hero__ctas"));
    new IntersectionObserver(function (en) { bookIn = en[0].isIntersecting; upd(); }, { threshold: 0.15 }).observe(book);
  }

  /* ---------- Modals ---------- */
  var lastFocus = null;
  function openModal(m) {
    lastFocus = document.activeElement;
    m.hidden = false;
    if (lenis) lenis.stop();
    var f = $("a, button", m); if (f) f.focus();
  }
  function closeModals() {
    $$(".modal").forEach(function (m) { m.hidden = true; });
    if (lenis) lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $$(".modal [data-close]").forEach(function (b) {
    if (b.tagName !== "A") b.addEventListener("click", closeModals);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeModals(); closeMenu(); } });
  $$('[data-modal="video"]').forEach(function (b) { b.addEventListener("click", function () { openModal($("#videoModal")); }); });

  // exit intent (desktop only, once per session, not for people already converting)
  var t0 = Date.now();
  document.addEventListener("mouseout", function (e) {
    if (e.relatedTarget || e.clientY > 0) return;
    if (Date.now() - t0 < 8000) return;
    if (store.get("hs_exit") || store.get("hs_audit") || store.get("hs_booked")) return;
    if (step > 1) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    store.set("hs_exit", "1");
    openModal($("#exitModal"));
  });

  /* ---------- "Why this layout?" notes ---------- */
  var notes = {
    topbar: ["Announcement bar", "The first line anyone reads. Limited onboarding spots create honest urgency (agencies really do have capacity limits) and give a one-click path to booking from second zero."],
    hero: ["Hero: the 5-second test", "In 5 seconds a visitor must know: who this is for, what they get, and what to do next. The headline sells the outcome (customers), not the task (posting). One high-contrast primary CTA plus a low-commitment option for people not ready to talk. The ticks under the buttons answer the top 3 objections, and the star rating with faces puts social proof right at the moment of decision. The phone mock-up shows the work and the results at the same time."],
    logos: ["Client logo strip", "Borrowed trust: the fastest way to say \"brands like yours already trust us\" is logos right under the hero. These are placeholders; we'll use Albert's real clients."],
    stats: ["Proof in numbers", "Marketing buyers think in numbers. Four big, bold results before any sales pitch build credibility instantly. The lime band also breaks up the page and pulls the eye down. Placeholder figures, to be replaced with real ones."],
    problem: ["Problem → solution (PAS)", "People buy when they feel understood. We name the 3 frustrations every business owner has with social media in their own words, then the dark bar pivots to our answer: a system, not more posts."],
    services: ["Services bento", "A bento grid lets visitors scan 6 services in seconds. The biggest tile goes to the core offer (strategy). Every card talks about outcomes, not features. The CTA after the grid catches visitors who are already convinced."],
    cases: ["Case studies", "Proof right after the pitch. Each card has an industry tag (so visitors find \"someone like me\"), the problem, and 3 hard numbers. On desktop it scrolls sideways like a reel, which keeps people engaged, and it ends on a CTA card at the moment they're most impressed."],
    audit: ["Free audit (lead magnet)", "Most visitors aren't ready for a sales call. A free profile audit is an easy \"yes\" (just 2 fields), captures the lead and gives Albert a reason to follow up with value. Typically converts far more cold traffic than \"Book a call\" alone."],
    process: ["How it works", "Removes the fear of \"what happens after I click?\". A concrete timeline (first content in 14 days) sets expectations and makes starting feel easy and low-risk."],
    calc: ["Growth estimator", "Interactive tools keep people on the page and make them picture their own return. The CTA then offers to turn their estimate into a real forecast, a natural reason to book."],
    compare: ["Comparison table", "Visitors are already comparing us with other agencies or doing it themselves. We frame that comparison on our terms and highlight the differentiators: reporting on sales, no long contracts, 14 days to launch."],
    reviews: ["Testimonials", "Strongest social proof placed right before pricing, so trust is at its highest when the money question comes up. Video testimonials are the most persuasive format; Google/Clutch ratings add third-party credibility."],
    pricing: ["Pricing", "\"From\" prices pre-qualify leads (fewer calls with people who can't afford it) and build trust through transparency. Three tiers with the middle one highlighted is classic price anchoring. The 30-day promise removes risk exactly where hesitation peaks. Prices are placeholders."],
    founder: ["Founder note", "People buy from people. A face, a personal note and a signature make a boutique agency feel accountable and premium. It's the main advantage over big, faceless agencies."],
    faq: ["FAQ", "Handles the last objections (contracts, ad spend, time, ownership) right before the final ask, with a CTA that stays visible next to the questions."],
    book: ["Booking: the main conversion", "A multi-step form converts better than one long form. An easy first question (goal) gets a small yes, the budget step qualifies the lead, then contact details, then a time slot. Albert's face and limited spots add trust and urgency. At build stage this connects to Calendly/HubSpot and his CRM."]
  };
  var body = document.body, wt = $("#whyToggle"), wp = $("#whyPanel"), wl = $("#whyList");
  $$("[data-why]").forEach(function (sec, i) {
    var key = sec.getAttribute("data-why"), n = notes[key];
    if (!n) return;
    if (!sec.id) sec.id = "why-" + key;
    var box = document.createElement("div");
    box.className = "why-badge";
    var nid = "whyn-" + key;
    box.innerHTML = '<button type="button" aria-expanded="false" aria-controls="' + nid + '">💡 ' + (i + 1) + '. Why here?</button><div id="' + nid + '" hidden><b>' + n[0] + "</b>" + n[1] + "</div>";
    var btn = box.firstChild, txt = box.lastChild;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      txt.hidden = !txt.hidden;
      btn.setAttribute("aria-expanded", String(!txt.hidden));
      if (!txt.hidden) wp.hidden = true;
    });
    sec.appendChild(box);
    var li = document.createElement("li");
    li.innerHTML = '<a href="#' + sec.id + '">' + n[0] + "</a>";
    wl.appendChild(li);
  });
  wl.insertAdjacentHTML("beforeend", "<li><b>Always-visible CTAs</b>: sticky header button, and a sticky bottom bar on mobile, so the next step is never more than a tap away.</li><li><b>Exit-intent offer</b>: on desktop, when someone moves to leave, we offer the free audit once instead of losing them.</li>");
  function setWhy(on) {
    body.classList.toggle("show-why", on);
    wp.hidden = !on;
    wt.setAttribute("aria-pressed", String(on));
  }
  wt.addEventListener("click", function () { setWhy(!body.classList.contains("show-why")); });
  $("#whyClose").addEventListener("click", function () { wp.hidden = true; });
  if (/[?&]notes=1/.test(location.search)) setWhy(true);
})();
