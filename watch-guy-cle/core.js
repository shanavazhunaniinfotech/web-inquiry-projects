/* =========================================================
   Watch Guy CLE · shared behaviour for both design versions
   (wishlist, quick view, collection, Watch Finder, forms, WhatsApp,
   photo fallbacks, header, Lenis + GSAP bootstrap, design notes).
   Each version provides window.WGC = { card(w,h), pick(w,h), motion(ctx) }.
   Forms don't send in the mock-up; in Wix they use Wix Forms → Jon's email.
   ========================================================= */
(function () {
  "use strict";
  const CFG = window.WGC || {};
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
  const H = { $, $$, money, waURL, nameOf, img, byId, STATUS, INV };

  /* ---------- WhatsApp ---------- */
  function wireWA(root) { $$(".wa[data-wa]", root || document).forEach((a) => { a.href = waURL(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; }); }
  wireWA();

  /* ---------- Photo fallbacks: placeholder photos never look broken ---------- */
  function fallback(el) {
    const key = el.dataset.fb;
    if (el.hasAttribute("data-hero-img")) { document.documentElement.classList.add("no-hero-photo"); el.remove(); return; }
    if (key === "bg") { el.remove(); return; }
    if (key === "portrait") {
      const d = document.createElement("div"); d.className = "ph"; d.setAttribute("role", "img"); d.setAttribute("aria-label", el.alt);
      d.innerHTML = "<span>Photo of Jon<small>to be supplied</small></span>"; el.replaceWith(d); return;
    }
    const w = byId(key) || INV[(el.src.length * 7) % INV.length];
    if (!w || !window.watchArt) return;
    const wrap = document.createElement("div"); wrap.className = "fb-art";
    wrap.innerHTML = watchArt(w.art);
    el.replaceWith(wrap);
  }
  function guard(root) {
    $$("img[data-fb], img[data-hero-img]", root || document).forEach((im) => {
      if (im.dataset.g) return; im.dataset.g = 1;
      if (im.complete && im.naturalWidth === 0 && im.currentSrc) fallback(im);
      else im.addEventListener("error", () => fallback(im), { once: true });
    });
  }
  guard(); H.guard = guard;

  /* ---------- Cleveland clock (+ optional live SVG watch) ---------- */
  function now() {
    const p = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit", second: "2-digit", hour12: false }).formatToParts(new Date());
    const g = (t) => +p.find((x) => x.type === t).value;
    return { h: g("hour") % 24, m: g("minute"), s: g("second") };
  }
  const liveSvg = $("[data-live-watch]");
  if (liveSvg && window.watchArt) liveSvg.innerHTML = watchArt(JSON.parse(liveSvg.dataset.liveWatch), { time: now() });
  function tick() {
    const t = now();
    const set = (c, d) => { const e = liveSvg && liveSvg.querySelector(c); if (e) e.setAttribute("transform", `rotate(${d.toFixed(2)} 200 240)`); };
    set(".wa-h", ((t.h % 12) + t.m / 60) * 30); set(".wa-m", (t.m + t.s / 60) * 6); set(".wa-s", t.s * 6);
    const label = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(new Date());
    $$("[data-clock]").forEach((c) => (c.textContent = label));
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Saved (wishlist) ---------- */
  let saved = new Set((store.get("wgc-saved") || []).filter(byId));
  const toastEl = $("#toast"); let tt;
  function toast(msg) { if (!toastEl) return; toastEl.textContent = msg; toastEl.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("on"), 2400); }
  function syncSaved() {
    store.set("wgc-saved", [...saved]);
    const n = saved.size;
    $$("[data-saved-count]").forEach((c) => { c.textContent = n; c.hidden = n === 0; });
    $$(".heart").forEach((h) => h.setAttribute("aria-pressed", saved.has(h.dataset.id)));
    const list = $("#savedList"), items = [...saved].map(byId).filter(Boolean);
    if (list) {
      list.innerHTML = items.length ? items.map((w) => `<div class="sv"><button class="sv__img" data-qv="${w.id}" aria-label="View ${nameOf(w)}"><img src="${img(w.img, 200)}" alt="" data-fb="${w.id}"></button><div class="sv__t"><b>${nameOf(w)}</b><small>${w.year} · ${w.status === "sold" ? "Sold" : money(w.price)}</small></div><button class="sv__x" data-unsave="${w.id}" aria-label="Remove ${nameOf(w)}">×</button></div>`).join("")
        : `<div class="drawer__empty"><svg><use href="#i-heart"/></svg><p>Tap the heart on any watch to save it here, then ask Jon about all of them in one message.</p></div>`;
      guard(list);
    }
    const foot = $("#savedFoot"); if (foot) foot.hidden = !items.length;
    const msg = "Hi Jon, I'm interested in these watches from your site:\n" + items.map((w) => `• ${nameOf(w)} (${w.ref}), ${money(w.price)}`).join("\n") + "\nAre they available?";
    const a = $("#savedWa"); if (a) { a.href = waURL(msg); a.target = "_blank"; a.rel = "noopener"; }
    const qs = $("#qvSave"); if (qs && qs.dataset.id) { const on = saved.has(qs.dataset.id); qs.setAttribute("aria-pressed", on); const s = qs.querySelector("span"); if (s) s.textContent = on ? "Saved" : "Save"; }
  }
  function toggleSave(id) {
    if (saved.has(id)) { saved.delete(id); toast("Removed from your saved watches"); }
    else { saved.add(id); toast("Saved. Ask Jon about all your saved watches in one message"); $$("[data-saved-btn]").forEach((b) => { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }); }
    syncSaved();
  }

  /* ---------- Collection ---------- */
  const grid = $("#grid");
  const st = { brand: "All", price: "all", sort: "new" };
  let firstRender = true;
  function render() {
    let l = INV.slice();
    if (st.brand !== "All") l = l.filter((w) => w.brand === st.brand);
    if (st.price !== "all") { const [a, b] = st.price.split("-").map(Number); l = l.filter((w) => w.price >= a && w.price < b); }
    const rank = { available: 0, hold: 1, sold: 2 };
    l.sort((a, b) => rank[a.status] - rank[b.status] || (st.sort === "low" ? a.price - b.price : st.sort === "high" ? b.price - a.price : b.added - a.added));
    grid.innerHTML = l.map((w, i) => CFG.card(w, H, i, saved.has(w.id))).join("");
    $("#empty").hidden = l.length > 0;
    wireWA(grid); guard(grid);
    if (window.gsap && !reduce) {
      const cards = $$(".card", grid);
      if (firstRender && window.ScrollTrigger) {
        gsap.set(cards, { opacity: 0, y: 60 });
        ScrollTrigger.batch(cards, { start: "top 94%", once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: .09 }) });
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
    $$("[data-avail]").forEach((x) => (x.textContent = INV.filter((w) => w.status === "available").length));
  }
  const cw = $("#cWatch");
  if (cw) INV.filter((w) => w.status !== "sold").forEach((w) => { const o = document.createElement("option"); o.value = `${nameOf(w)} (${w.ref})`; o.textContent = `${nameOf(w)} · ${money(w.price)}`; cw.appendChild(o); });

  /* ---------- Quick view ---------- */
  const qv = $("#qv"); let lastFocus = null;
  function openQV(id, focusForm) {
    const w = byId(id); if (!w || !qv) return;
    lastFocus = document.activeElement;
    const sold = w.status === "sold";
    $("#qvMedia").innerHTML = `<img src="${img(w.img, 1200)}" alt="${nameOf(w)}" data-fb="${w.id}">${w.tag ? `<span class="qv__tag">${w.tag}</span>` : ""}<span class="qv__note">Placeholder photo · real photos &amp; live video on request</span>`;
    guard($("#qvMedia"));
    $("#qvBrand").textContent = w.brand;
    $("#qvT").textContent = w.model;
    $("#qvPrice").innerHTML = sold ? "Sold" : `${money(w.price)}<small>${STATUS[w.status]} · Trade-ins welcome</small>`;
    $("#qvBlurb").textContent = w.blurb;
    $("#qvSpecs").innerHTML = [["Reference", w.ref], ["Year", w.year], ["Box & papers", w.set], ["Condition", w.condition], ["Case", `${w.size} · ${w.material}`], ["Movement", w.movement], ["Dial", w.dial], ["Authenticity", "Verified · guaranteed"]].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    const f = $("#qvForm"); f.reset(); resetForm(f);
    f.elements.watch.value = `${nameOf(w)} (${w.ref}) · ${money(w.price)}`;
    const wa = $("#qvWa"); wa.href = waURL(`Hi Jon, I'm interested in the ${nameOf(w)} (${w.ref}) listed at ${money(w.price)}. Is it still available?`); wa.target = "_blank"; wa.rel = "noopener";
    $("#qvSave").dataset.id = w.id; syncSaved();
    qv.hidden = false; lock();
    $(".qv__panel", qv).scrollTop = 0;
    if (window.gsap && !reduce) {
      gsap.fromTo(".qv__panel", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: "expo.out" });
      gsap.from("#qvMedia img, #qvMedia svg", { scale: 1.15, duration: 1.6, ease: "expo.out" });
    }
    setTimeout(() => (focusForm ? f.elements.name : $(".qv__x")).focus({ preventScroll: !focusForm }), 80);
  }
  function closeQV() { qv.hidden = true; lock(); if (lastFocus) lastFocus.focus({ preventScroll: true }); }
  if (qv) {
    $("#qvForm").addEventListener("change", (e) => { if (e.target.name === "intent") $(".offer", e.currentTarget).hidden = e.target.value !== "Make an offer"; });
    $("#qvSave").addEventListener("click", (e) => toggleSave(e.currentTarget.dataset.id));
  }

  /* ---------- Drawer ---------- */
  const drawer = $("#saved");
  const openDrawer = () => { drawer.hidden = false; lock(); };
  const closeDrawer = () => { drawer.hidden = true; lock(); };
  $$("[data-saved-btn]").forEach((b) => b.addEventListener("click", openDrawer));

  let lenis = null;
  function lock() {
    const any = (qv && !qv.hidden) || (drawer && !drawer.hidden);
    document.body.classList.toggle("lock", any);
    if (lenis) any ? lenis.stop() : lenis.start();
  }

  /* ---------- Navigation & clicks ---------- */
  function goTo(target, focusSel) {
    const el = typeof target === "string" ? document.getElementById(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.5 }); else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    if (focusSel) setTimeout(() => { const f = $(focusSel); if (f) f.focus({ preventScroll: true }); }, 1300);
  }
  H.goTo = goTo;
  document.addEventListener("click", (e) => {
    const t = e.target;
    const h = t.closest(".heart"); if (h) { e.preventDefault(); toggleSave(h.dataset.id); return; }
    const un = t.closest("[data-unsave]"); if (un) { toggleSave(un.dataset.unsave); return; }
    const q = t.closest("[data-qv]"); if (q) { e.preventDefault(); if (drawer && !drawer.hidden) closeDrawer(); openQV(q.dataset.qv, q.hasAttribute("data-focus")); return; }
    if (t.closest("[data-close-qv]")) { closeQV(); return; }
    if (t.closest("[data-close-saved]")) { closeDrawer(); return; }
    const g = t.closest("[data-goto]"); if (g) { e.preventDefault(); goTo(g.dataset.goto); return; }
    if (t.closest("[data-inquire]")) { e.preventDefault(); closeMenu(); goTo("contact", "#cform [name=name]"); return; }
    const a = t.closest('a[href^="#"]');
    if (a && a.getAttribute("href").length > 1) { const el = $(a.getAttribute("href")); if (el) { e.preventDefault(); closeMenu(); goTo(el); } }
    else if (a && a.getAttribute("href") === "#" && !a.classList.contains("wa")) e.preventDefault();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { if (qv && !qv.hidden) closeQV(); else if (drawer && !drawer.hidden) closeDrawer(); else closeMenu(); }
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-qv]:not(button):not(a)")) { e.preventDefault(); openQV(e.target.dataset.qv); }
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
      const mid = Math.min(hi, lo * 2.5 + 10000);
      const scored = INV.filter((w) => w.status !== "sold").map((w) => ({ w, s: (w.style === ans.style ? 2 : 0) + (w.price >= lo && w.price < hi ? 1.5 : 0) - Math.abs(w.price - (lo + mid) / 2) / 1e6 })).sort((a, b) => b.s - a.s);
      const perfect = scored.filter((x) => x.s >= 3.4);
      const picks = perfect.concat(scored.filter((x) => x.s < 3.4 && x.s >= 1.4)).slice(0, 3);
      $("#qResT").textContent = perfect.length ? "Jon's picks for you" : "Closest matches right now";
      $("#qRes").innerHTML = (perfect.length ? "" : `<p class="qnone">Nothing in stock is a perfect match yet, so here's what's closest. Leave your number and Jon will <b>source the exact watch</b> for you.</p>`) + picks.map(({ w }) => CFG.pick(w, H)).join("");
      guard($("#qRes"));
      $("#qFormT").textContent = perfect.length ? "Want these, plus first look at new matches?" : "Want Jon to find your exact watch?";
      $(".qform [name=answers]", quiz).value = `${ans.style} · ${ans.budget} · ${ans.for}`;
      show("result");
      if (window.gsap && !reduce) gsap.from(".qpick", { opacity: 0, y: 20, stagger: .08, duration: .7, ease: "expo.out" });
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
  const hdr = $(".hdr"), mbar = $("#mbar"), hero = $("[data-hero]"), burger = $(".burger"), mnav = $("#mnav");
  function closeMenu() { if (!burger) return; burger.setAttribute("aria-expanded", "false"); mnav.classList.remove("open"); document.documentElement.classList.remove("menu-open"); }
  if (burger) burger.addEventListener("click", () => { const o = burger.getAttribute("aria-expanded") !== "true"; burger.setAttribute("aria-expanded", o); mnav.classList.toggle("open", o); document.documentElement.classList.toggle("menu-open", o); });
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    if (hdr) {
      hdr.classList.toggle("is-solid", y > 30);
      const menuOpen = mnav && mnav.classList.contains("open");
      if (y > 600 && y > lastY + 6 && !menuOpen) hdr.classList.add("is-hidden");
      else if (y < lastY - 6 || y < 600) hdr.classList.remove("is-hidden");
    }
    lastY = y;
    if (mbar && hero) mbar.classList.toggle("on", y > hero.offsetHeight * .6);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if ("IntersectionObserver" in window) {
    const links = $$(".nav a");
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + x.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => io.observe(s));
  }

  /* ---------- Motion ---------- */
  const hasG = window.gsap && window.ScrollTrigger && !reduce;
  if (hasG) {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("anim");
    if (window.Lenis && !window.matchMedia("(pointer: coarse)").matches) {
      lenis = new Lenis({ lerp: 0.085 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    const rv = $$(".rv");
    ScrollTrigger.batch(rv, { start: "top 90%", once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: .08, overwrite: true }) });
    $$("[data-count]").forEach((el) => {
      const o = { v: 0 }, end = +el.dataset.count;
      ScrollTrigger.create({ trigger: el, start: "top 95%", once: true, onEnter: () => gsap.to(o, { v: end, duration: 2.2, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v)) }) });
    });
  }
  H.lenis = () => lenis;
  if (grid) render();
  syncSaved();
  if (typeof CFG.motion === "function") CFG.motion({ H, hasG, reduce, lenis });
  if (hasG) window.addEventListener("load", () => ScrollTrigger.refresh());

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
    if (nb) nb.setAttribute("aria-pressed", on);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  if (nb) nb.addEventListener("click", () => setNotes(!document.body.classList.contains("show-notes")));
  if (/[?&]notes=1/.test(location.search)) setNotes(true);
  $$("[data-year]").forEach((y) => (y.textContent = new Date().getFullYear()));
})();
