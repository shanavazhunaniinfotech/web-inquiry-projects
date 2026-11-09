/* =========================================================
   Watch Guy CLE · interactions (prototype)
   Forms do not send in this mock-up; in Wix they use Wix Forms → Jon's email.
   ========================================================= */
(function () {
  "use strict";
  const WA_NUMBER = "12165550123";               // placeholder: Jon's WhatsApp
  const TZ = "America/New_York";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const money = (n) => "$" + Number(n).toLocaleString("en-US");
  const waURL = (m) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(m)}`;
  const INV = window.INVENTORY || [];
  const byId = (id) => INV.find((w) => w.id === id);
  const nameOf = (w) => `${w.brand} ${w.model.replace(/[“”]/g, '"')}`;
  const img = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STATUS = { available: "Available", hold: "On hold", sold: "Sold" };
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };

  /* ---------- WhatsApp links ---------- */
  function wireWA(root) {
    $$(".wa[data-wa]", root || document).forEach((a) => { a.href = waURL(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });
  }
  wireWA();

  /* ---------- Image fallbacks (placeholder photos never look broken) ---------- */
  const art = (w) => (window.watchArt ? watchArt(w.art) : "");
  function fallback(el) {
    const key = el.dataset.fb;
    if (el.hasAttribute("data-hero-img")) { $(".hero").classList.add("no-photo"); return; }
    if (key === "bg") { el.remove(); return; }
    if (key === "portrait") {
      const d = document.createElement("div"); d.className = "ph"; d.setAttribute("role", "img"); d.setAttribute("aria-label", el.alt);
      d.innerHTML = "<span>Photo of Jon<small>to be supplied</small></span>"; el.replaceWith(d); return;
    }
    const w = byId(key) || INV[Math.floor(Math.random() * INV.length)];
    if (!w) return;
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:absolute;inset:0;display:grid;place-items:center;background:radial-gradient(90% 70% at 50% 35%,#2a261f,#0d0d0e 80%)";
    wrap.innerHTML = art(w);
    const s = wrap.firstElementChild; if (s) s.style.cssText = "width:70%;height:84%";
    el.parentNode.style.position = el.parentNode.style.position || "relative";
    el.replaceWith(wrap);
  }
  function guard(root) {
    $$("img[data-fb], img[data-hero-img]", root || document).forEach((im) => {
      if (im.dataset.g) return; im.dataset.g = 1;
      if (im.complete && im.naturalWidth === 0 && im.currentSrc) fallback(im);
      else im.addEventListener("error", () => fallback(im), { once: true });
    });
  }
  guard();

  /* ---------- Cleveland clock + fallback hero watch ---------- */
  function now() {
    const p = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit", second: "2-digit", hour12: false }).formatToParts(new Date());
    const g = (t) => +p.find((x) => x.type === t).value;
    return { h: g("hour") % 24, m: g("minute"), s: g("second") };
  }
  const heroSvg = $("#heroSvg");
  if (heroSvg && window.watchArt) heroSvg.innerHTML = watchArt({ shape: "round", metal: "gold", dial: "#1f4a37", bezel: "fluted", index: "gilt", strap: "jubilee" }, { time: now() });
  function tick() {
    const t = now();
    const set = (c, d) => { const e = heroSvg && heroSvg.querySelector(c); if (e) e.setAttribute("transform", `rotate(${d.toFixed(2)} 200 240)`); };
    set(".wa-h", ((t.h % 12) + t.m / 60) * 30); set(".wa-m", (t.m + t.s / 60) * 6); set(".wa-s", t.s * 6);
    const c = $("#cleClock"); if (c) c.textContent = "Cleveland " + new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(new Date());
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Saved (wishlist) ---------- */
  let saved = new Set((store.get("wgc-saved") || []).filter(byId));
  const toastEl = $("#toast"); let tt;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("on"), 2200); }
  function syncSaved() {
    store.set("wgc-saved", [...saved]);
    const n = saved.size, c = $("#savedCount");
    c.textContent = n; c.hidden = n === 0;
    $$(".heart").forEach((h) => h.setAttribute("aria-pressed", saved.has(h.dataset.id)));
    const list = $("#savedList"), items = [...saved].map(byId).filter(Boolean);
    list.innerHTML = items.length ? items.map((w) => `<div class="sv"><div class="sv__img" data-qv="${w.id}"><img src="${img(w.img, 200)}" alt="" data-fb="${w.id}"></div><div><b>${nameOf(w)}</b><small>${w.year} · ${w.status === "sold" ? "Sold" : money(w.price)}</small></div><button class="sv__x" data-unsave="${w.id}" aria-label="Remove ${nameOf(w)}">×</button></div>`).join("")
      : `<div class="drawer__empty"><svg><use href="#i-heart"/></svg>Tap the ♥ on any watch to save it here, then ask Jon about all of them in one message.</div>`;
    guard(list);
    $("#savedFoot").hidden = !items.length;
    const msg = "Hi Jon, I'm interested in these watches from your site:\n" + items.map((w) => `• ${nameOf(w)} (${w.ref}), ${money(w.price)}`).join("\n") + "\nAre they available?";
    const a = $("#savedWa"); a.href = waURL(msg); a.target = "_blank"; a.rel = "noopener";
    const qs = $("#qvSave"); if (qs && qs.dataset.id) { const on = saved.has(qs.dataset.id); qs.setAttribute("aria-pressed", on); qs.querySelector("span").textContent = on ? "Saved" : "Save"; }
  }
  function toggleSave(id) {
    if (saved.has(id)) { saved.delete(id); toast("Removed from saved"); }
    else { saved.add(id); toast("♥ Saved. Ask Jon about all saved watches anytime"); const b = $("#savedBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
    syncSaved();
  }

  /* ---------- Collection ---------- */
  const grid = $("#grid");
  const st = { brand: "All", price: "all", sort: "new" };
  let firstRender = true;
  function card(w) {
    const sold = w.status === "sold";
    const badge = w.tag ? `<span class="badge ${w.tag === "Rare" || w.tag === "New arrival" ? "badge--gold" : w.tag === "Price drop" ? "badge--red" : ""}">${w.tag}</span>` : "";
    const acts = sold
      ? `<button class="btn btn--line" data-goto="finder">Find me one</button>`
      : `<a class="wamini wa" href="#" data-wa="Hi Jon, is the ${nameOf(w)} (${w.ref}) at ${money(w.price)} still available?" aria-label="WhatsApp about ${nameOf(w)}"><svg><use href="#i-wa"/></svg></a><button class="btn btn--gold" data-qv="${w.id}" data-focus>${w.status === "hold" ? "Join waitlist" : "Inquire"}</button>`;
    return `<article class="card${sold ? " is-sold" : ""}">
      <div class="card__media" data-qv="${w.id}">
        <img src="${img(w.img, 700)}" alt="${nameOf(w)}" loading="lazy" data-fb="${w.id}">
        ${badge}
        <span class="status status--${w.status}"><i></i>${STATUS[w.status]}</span>
        <button class="qvbtn" data-qv="${w.id}"><svg class="i"><use href="#i-eye"/></svg> Quick view</button>
      </div>
      <button class="heart" data-id="${w.id}" aria-pressed="${saved.has(w.id)}" aria-label="Save ${nameOf(w)}"><svg><use href="#i-heart"/></svg></button>
      <div class="card__body">
        <p class="card__brand">${w.brand}</p>
        <h3 class="card__name"><button data-qv="${w.id}">${w.model}</button></h3>
        <p class="card__meta">${w.year} · <b>✓ ${w.set}</b> · ${w.condition} · ${w.size}</p>
        <div class="card__foot">
          <p class="card__price">${sold ? "Sold" : money(w.price)}<small>${sold ? "Ask about similar" : "Trade-ins welcome"}</small></p>
          <div class="card__acts">${acts}</div>
        </div>
      </div>
    </article>`;
  }
  function render() {
    let l = INV.slice();
    if (st.brand !== "All") l = l.filter((w) => w.brand === st.brand);
    if (st.price !== "all") { const [a, b] = st.price.split("-").map(Number); l = l.filter((w) => w.price >= a && w.price < b); }
    const rank = { available: 0, hold: 1, sold: 2 };
    l.sort((a, b) => rank[a.status] - rank[b.status] || (st.sort === "low" ? a.price - b.price : st.sort === "high" ? b.price - a.price : b.added - a.added));
    grid.innerHTML = l.map(card).join("");
    $("#empty").hidden = l.length > 0;
    wireWA(grid); guard(grid);
    if (window.gsap && !reduce) {
      const cards = $$(".card", grid);
      if (firstRender && window.ScrollTrigger) {
        gsap.set(cards, { opacity: 0, y: 50 });
        ScrollTrigger.batch(cards, { start: "top 92%", once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: .08 }) });
      } else gsap.fromTo(cards, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, ease: "expo.out", stagger: .05 });
    }
    firstRender = false;
  }
  if (grid) {
    const brands = ["All", ...new Set(INV.map((w) => w.brand))];
    const chips = $("#chips");
    chips.innerHTML = brands.map((b) => `<button class="chip" aria-pressed="${b === "All"}" data-b="${b}">${b}<sup>${b === "All" ? INV.length : INV.filter((w) => w.brand === b).length}</sup></button>`).join("");
    chips.addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (!c) return; st.brand = c.dataset.b; $$(".chip", chips).forEach((x) => x.setAttribute("aria-pressed", x === c)); render(); });
    $("#fPrice").addEventListener("change", (e) => { st.price = e.target.value; render(); });
    $("#fSort").addEventListener("change", (e) => { st.sort = e.target.value; render(); });
    $("#availN").textContent = INV.filter((w) => w.status === "available").length;
  }

  /* contact dropdown */
  const cw = $("#cWatch");
  if (cw) INV.filter((w) => w.status !== "sold").forEach((w) => { const o = document.createElement("option"); o.value = `${nameOf(w)} (${w.ref})`; o.textContent = `${nameOf(w)} · ${money(w.price)}`; cw.appendChild(o); });

  /* ---------- Quick view ---------- */
  const qv = $("#qv"); let lastFocus = null;
  function openQV(id, focusForm) {
    const w = byId(id); if (!w) return;
    lastFocus = document.activeElement;
    const sold = w.status === "sold";
    $("#qvMedia").innerHTML = `<img src="${img(w.img, 1100)}" alt="${nameOf(w)}" data-fb="${w.id}">${w.tag ? `<span class="badge badge--gold">${w.tag}</span>` : ""}<span class="note">Placeholder photo · real photos &amp; live video on request</span>`;
    guard($("#qvMedia"));
    $("#qvBrand").textContent = w.brand;
    $("#qvT").textContent = w.model;
    $("#qvPrice").innerHTML = sold ? "Sold" : `${money(w.price)}<small>${STATUS[w.status]} · Trade-ins welcome</small>`;
    $("#qvBlurb").textContent = w.blurb;
    $("#qvSpecs").innerHTML = [["Reference", w.ref], ["Year", w.year], ["Box & papers", w.set], ["Condition", w.condition], ["Case", `${w.size} · ${w.material}`], ["Movement", w.movement], ["Dial", w.dial], ["Authenticity", "Verified · guaranteed"]].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    const f = $("#qvForm"); f.reset(); resetForm(f);
    f.elements.watch.value = `${nameOf(w)} (${w.ref}) · ${money(w.price)}`;
    const wa = $("#qvWa"); wa.href = waURL(`Hi Jon, I'm interested in the ${nameOf(w)} (${w.ref}) listed at ${money(w.price)}. Is it still available?`); wa.target = "_blank"; wa.rel = "noopener";
    const sv = $("#qvSave"); sv.dataset.id = w.id; syncSaved();
    qv.hidden = false; lock(true);
    $(".qv__panel", qv).scrollTop = 0;
    if (window.gsap && !reduce) gsap.from("#qvMedia img, #qvMedia svg", { scale: 1.12, duration: 1.4, ease: "expo.out" });
    setTimeout(() => (focusForm ? f.elements.name : $(".qv__x")).focus({ preventScroll: !focusForm }), 80);
  }
  function closeQV() { qv.hidden = true; lock(false); if (lastFocus) lastFocus.focus({ preventScroll: true }); }
  $("#qvForm").addEventListener("change", (e) => { if (e.target.name === "intent") $(".offer", e.currentTarget).hidden = e.target.value !== "Make an offer"; });
  $("#qvSave").addEventListener("click", (e) => toggleSave(e.currentTarget.dataset.id));

  /* ---------- Drawer ---------- */
  const drawer = $("#saved");
  const openDrawer = () => { drawer.hidden = false; lock(true); };
  const closeDrawer = () => { drawer.hidden = true; lock(false); };
  $("#savedBtn").addEventListener("click", openDrawer);

  let lenis = null;
  function lock(on) {
    const any = on || !qv.hidden || !drawer.hidden;
    document.body.classList.toggle("lock", any);
    if (lenis) any ? lenis.stop() : lenis.start();
  }

  /* ---------- Global clicks ---------- */
  function goTo(target, focusSel) {
    const el = typeof target === "string" ? document.getElementById(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 }); else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    if (focusSel) setTimeout(() => { const f = $(focusSel); if (f) f.focus({ preventScroll: true }); }, 1200);
  }
  document.addEventListener("click", (e) => {
    const t = e.target;
    const h = t.closest(".heart"); if (h) { e.preventDefault(); toggleSave(h.dataset.id); return; }
    const un = t.closest("[data-unsave]"); if (un) { toggleSave(un.dataset.unsave); return; }
    const q = t.closest("[data-qv]"); if (q) { e.preventDefault(); if (!drawer.hidden) closeDrawer(); openQV(q.dataset.qv, q.hasAttribute("data-focus")); return; }
    if (t.closest("[data-close-qv]")) { closeQV(); return; }
    if (t.closest("[data-close-saved]")) { closeDrawer(); return; }
    const g = t.closest("[data-goto]"); if (g) { e.preventDefault(); goTo(g.dataset.goto); return; }
    if (t.closest("[data-inquire]")) { e.preventDefault(); goTo("contact", "#cform [name=name]"); return; }
    const a = t.closest('a[href^="#"]');
    if (a && a.getAttribute("href").length > 1) { const el = $(a.getAttribute("href")); if (el) { e.preventDefault(); goTo(el); closeMenu(); } }
    else if (a && a.getAttribute("href") === "#" && !a.classList.contains("wa")) e.preventDefault();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!qv.hidden) closeQV(); else if (!drawer.hidden) closeDrawer();
  });

  /* ---------- Watch Finder ---------- */
  const quiz = $("#quiz");
  if (quiz) {
    const steps = ["style", "budget", "for"]; const ans = {}; let i = 0;
    const show = (k) => {
      $$(".qs", quiz).forEach((s) => s.classList.toggle("is-on", s.dataset.q === k));
      $("#qStep").textContent = k === "result" ? "Your matches" : `Step ${i + 1} of 3`;
      $("#qBar").style.width = k === "result" ? "100%" : `${((i + 1) / 3) * 100}%`;
      $("#qBack").hidden = i === 0 || k === "result";
    };
    quiz.addEventListener("click", (e) => {
      const o = e.target.closest(".opt"); if (!o) return;
      ans[steps[i]] = o.dataset.v; i++;
      if (i < 3) show(steps[i]); else results();
    });
    $("#qBack").addEventListener("click", () => { i = Math.max(0, i - 1); show(steps[i]); });
    $("#qRestart").addEventListener("click", () => { i = 0; show("style"); const f = $(".qform", quiz); f.reset(); resetForm(f); });
    function results() {
      const [lo, hi] = ans.budget.split("-").map(Number);
      const scored = INV.filter((w) => w.status !== "sold").map((w) => ({ w, s: (w.style === ans.style ? 2 : 0) + (w.price >= lo && w.price < hi ? 1.5 : 0) - Math.abs(w.price - (lo + Math.min(hi, lo * 2.5 + 10000)) / 2) / 1e6 })).sort((a, b) => b.s - a.s);
      const perfect = scored.filter((x) => x.s >= 3.4);
      const picks = perfect.concat(scored.filter((x) => x.s < 3.4 && x.s >= 1.4)).slice(0, 3);
      $("#qResT").textContent = perfect.length ? "Jon's picks for you" : "Closest matches right now";
      $("#qRes").innerHTML = (perfect.length ? "" : `<p class="qnone">Nothing in stock is a perfect match yet. Here's what's closest. Leave your number and Jon will <b>source the exact watch</b> for you.</p>`) +
        picks.map(({ w }) => `<button class="qpick" data-qv="${w.id}"><span class="qpick__img"><img src="${img(w.img, 200)}" alt="" data-fb="${w.id}"></span><span><b>${nameOf(w)}</b><small>${w.year} · ${w.set} · ${w.condition}</small></span><span class="qpick__p">${money(w.price)}</span></button>`).join("");
      guard($("#qRes"));
      $("#qFormT").textContent = perfect.length ? "Want these, plus first look at new matches?" : "Want Jon to find your exact watch?";
      $(".qform [name=answers]", quiz).value = `${ans.style} · ${ans.budget} · ${ans.for}`;
      show("result");
      if (window.gsap && !reduce) gsap.from(".qpick", { opacity: 0, y: 20, stagger: .08, duration: .6, ease: "expo.out" });
    }
  }

  /* ---------- Forms ---------- */
  function resetForm(f) {
    $$(".ok", f).forEach((p) => (p.hidden = true));
    $$("[type=submit]", f).forEach((b) => (b.hidden = false));
    $$(".bad", f).forEach((x) => x.classList.remove("bad"));
    const o = $(".offer", f); if (o) o.hidden = true;
  }
  $$(".jform").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      let bad = null;
      $$("[required]", f).forEach((x) => {
        const v = x.value.trim(); const ok = v && (x.type !== "email" || /.+@.+\..+/.test(v));
        x.classList.toggle("bad", !ok); if (!ok && !bad) bad = x;
      });
      if (bad) { bad.focus(); return; }
      console.info("[prototype] would email Jon:", f.dataset.type, Object.fromEntries(new FormData(f)));
      $$("[type=submit]", f).forEach((b) => (b.hidden = true));
      const ok = $(".ok", f); if (ok) { ok.hidden = false; ok.setAttribute("role", "status"); }
    });
    f.addEventListener("input", (e) => e.target.classList.remove("bad"));
  });

  /* ---------- Header, menu, mobile bar, active nav ---------- */
  const hdr = $(".hdr"), mbar = $("#mbar"), hero = $(".hero");
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    hdr.classList.toggle("is-solid", y > 40);
    hdr.classList.toggle("is-hidden", y > 700 && y > lastY + 4 && !$("#mnav").classList.contains("open"));
    if (y < lastY - 4) hdr.classList.remove("is-hidden");
    lastY = y;
    if (mbar && hero) mbar.classList.toggle("on", y > hero.offsetHeight * .7);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const burger = $(".burger"), mnav = $("#mnav");
  function closeMenu() { burger.setAttribute("aria-expanded", "false"); mnav.classList.remove("open"); }
  burger.addEventListener("click", () => { const o = burger.getAttribute("aria-expanded") !== "true"; burger.setAttribute("aria-expanded", o); mnav.classList.toggle("open", o); });
  if ("IntersectionObserver" in window) {
    const links = $$(".nav a");
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + x.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => io.observe(s));
  }

  /* ---------- Motion: Lenis smooth scroll + GSAP ---------- */
  const hasG = window.gsap && window.ScrollTrigger && !reduce;
  if (hasG) {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("anim");
    if (window.Lenis && !("ontouchstart" in window)) {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    // hero intro
    const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: .15 });
    tl.from(".hero__img, .hero__svg", { scale: 1.25, duration: 2.6, ease: "power3.out" }, 0)
      .to(".hero .kicker", { opacity: 1, y: 0, duration: 1.2 }, .2)
      .to(".hero__h .ln > span", { y: 0, duration: 1.4, stagger: .12 }, .3)
      .to(".hero__lead, .hero__ctas, .hero__proof", { opacity: 1, y: 0, duration: 1.2, stagger: .1 }, .8)
      .to(".justin", { opacity: 1, y: 0, duration: 1.2 }, 1.1);
    // hero parallax
    gsap.to(".hero__media", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__in", { yPercent: -12, opacity: .2, ease: "none", scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true } });
    // counter
    $$("[data-count]").forEach((el) => { const o = { v: 0 }; gsap.to(o, { v: +el.dataset.count, duration: 2.4, delay: 1, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v)) }); });
    // generic reveals
    const rv = $$(".shead, .spot__copy > *, .finder__copy > *, .quiz, .about__copy > *, .steps li, .sell__in > *, .q, .ig, .faq__l, .acc details, .contact__in > div > *, .cform, .ftr__top > *");
    rv.forEach((el) => el.classList.add("rv"));
    ScrollTrigger.batch(rv, { start: "top 90%", once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: .08, overwrite: true }) });
    // spotlight
    gsap.fromTo(".spot__img", { scale: .82, rotate: -8 }, { scale: 1, rotate: 0, ease: "none", scrollTrigger: { trigger: ".spot", start: "top bottom", end: "center center", scrub: 1 } });
    gsap.fromTo(".spot__ring", { rotate: -40, opacity: 0 }, { rotate: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".spot", start: "top bottom", end: "center center", scrub: 1 } });
    // parallax images
    gsap.fromTo(".about__img img", { yPercent: -10 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(".sell__bg img", { yPercent: -12 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".sell", start: "top bottom", end: "bottom top", scrub: true } });
    // process line
    gsap.fromTo(".steps__line i", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".steps", start: "top 80%", end: "bottom 55%", scrub: 1 } });
    // footer word
    gsap.fromTo(".ftr__word", { xPercent: 8, opacity: .3 }, { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".ftr", start: "top bottom", end: "bottom bottom", scrub: 1 } });
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  if (grid) render();
  syncSaved();

  /* ---------- Design notes (pitch layer) ---------- */
  const nb = $("#notesBtn"); let built = false;
  function setNotes(on) {
    if (on && !built) {
      $$("[data-note]").forEach((el, k) => {
        const n = document.createElement("aside"); n.className = "dnote";
        n.innerHTML = `<i>${k + 1}</i><b>${el.dataset.noteT || "Why this is here"}</b>${el.dataset.note}`;
        el.prepend(n);
      });
      built = true;
    }
    document.body.classList.toggle("show-notes", on);
    nb.setAttribute("aria-pressed", on);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  nb.addEventListener("click", () => setNotes(!document.body.classList.contains("show-notes")));
  if (/[?&]notes=1/.test(location.search)) setNotes(true);

  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();
})();
