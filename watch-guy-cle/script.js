/* Watch Guy CLE: prototype interactions */
(function () {
  "use strict";
  const WA_NUMBER = "12165550123";            // placeholder: Jon's WhatsApp number
  const TZ = "America/New_York";              // Cleveland
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fmt = (n) => "$" + n.toLocaleString("en-US");
  const waURL = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  const INV = window.INVENTORY || [];
  const byId = (id) => INV.find((w) => w.id === id);
  const fullName = (w) => `${w.brand} ${w.model.replace(/[“”]/g, '"')}`;

  /* ---------- WhatsApp links ---------- */
  function wireWA(root) {
    $$(".wa-link[data-wa]", root || document).forEach((a) => {
      a.href = waURL(a.dataset.wa);
      a.target = "_blank";
      a.rel = "noopener";
    });
  }
  wireWA();

  /* ---------- Cleveland time + live hero watch ---------- */
  function cleNow() {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit", second: "2-digit", hour12: false }).formatToParts(new Date());
    const g = (t) => +parts.find((p) => p.type === t).value;
    return { h: g("hour") % 24, m: g("minute"), s: g("second") };
  }
  const label = () => new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(new Date());
  const heroArt = { shape: "round", metal: "gold", dial: "#1f4a37", bezel: "fluted", index: "gilt", strap: "jubilee" };
  const hw = $("#heroWatch");
  if (hw && window.watchArt) hw.innerHTML = watchArt(heroArt, { time: cleNow() });
  function tick() {
    const t = cleNow();
    const set = (cls, deg) => { const el = hw && hw.querySelector(cls); if (el) el.setAttribute("transform", `rotate(${deg.toFixed(2)} 200 240)`); };
    set(".wa-h", ((t.h % 12) + t.m / 60) * 30);
    set(".wa-m", (t.m + t.s / 60) * 6);
    set(".wa-s", t.s * 6);
    const l = label();
    const ht = $("#heroTime"); if (ht) ht.textContent = l;
    const ct = $("#cleTime"); if (ct) ct.textContent = `Cleveland ${l}`;
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Inventory ---------- */
  const grid = $("#invGrid");
  const state = { brand: "All", price: "all", sort: "new" };
  const statusLabel = { available: "Available", hold: "On hold", sold: "Sold" };

  function cardHTML(w) {
    const sold = w.status === "sold";
    const badge = w.tag ? `<span class="badge badge--${w.tag.split(" ")[0]}">${w.tag}</span>` : "";
    const actions = sold
      ? `<button class="btn btn--line" data-source="${w.id}">Find me one like this</button>`
      : `<a class="wa-mini wa-link" data-wa="Hi Jon, is the ${fullName(w)} (${w.ref}) for ${fmt(w.price)} still available?" href="#" aria-label="Ask about the ${fullName(w)} on WhatsApp"><svg><use href="#ic-wa"/></svg></a>
         <button class="btn btn--dark" data-detail="${w.id}" data-focus-form>${w.status === "hold" ? "Join waitlist" : "Inquire"}</button>`;
    return `<article class="card ${sold ? "is-sold" : ""}" data-id="${w.id}">
      <div class="card__media" data-detail="${w.id}" role="button" tabindex="0" aria-label="View details: ${fullName(w)}">
        ${badge}<span class="status status--${w.status}">${statusLabel[w.status]}</span>
        ${watchArt(w.art)}
      </div>
      <div class="card__body">
        <p class="card__brand">${w.brand}</p>
        <h3 class="card__name"><button data-detail="${w.id}">${w.model}</button></h3>
        <p class="card__ref">Ref. ${w.ref} · ${w.year}</p>
        <ul class="facts"><li class="ok">✓ ${w.set}</li><li>${w.condition}</li><li>${w.size}</li></ul>
        <div class="card__foot">
          <p class="price">${sold ? "Sold" : fmt(w.price)}<small>${sold ? "Ask about similar" : "Trade-ins welcome"}</small></p>
          <div class="card__acts">${actions}</div>
        </div>
      </div>
    </article>`;
  }

  function render() {
    let list = INV.slice();
    if (state.brand !== "All") list = list.filter((w) => w.brand === state.brand);
    if (state.price !== "all") {
      const [lo, hi] = state.price.split("-").map(Number);
      list = list.filter((w) => w.price >= lo && w.price < hi);
    }
    const rank = { available: 0, hold: 1, sold: 2 };
    list.sort((a, b) => {
      if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
      if (state.sort === "low") return a.price - b.price;
      if (state.sort === "high") return b.price - a.price;
      return b.added - a.added;
    });
    grid.innerHTML = list.map(cardHTML).join("");
    $("#invEmpty").hidden = list.length > 0;
    wireWA(grid);
  }

  if (grid) {
    const brands = ["All", ...new Set(INV.map((w) => w.brand))];
    const chips = $("#brandChips");
    chips.innerHTML = brands.map((b) => {
      const c = b === "All" ? INV.length : INV.filter((w) => w.brand === b).length;
      return `<button class="chip" aria-pressed="${b === "All"}" data-brand="${b}">${b}<small>${c}</small></button>`;
    }).join("");
    chips.addEventListener("click", (e) => {
      const b = e.target.closest(".chip"); if (!b) return;
      state.brand = b.dataset.brand;
      $$(".chip", chips).forEach((c) => c.setAttribute("aria-pressed", c === b));
      render();
    });
    $("#priceFilter").addEventListener("change", (e) => { state.price = e.target.value; render(); });
    $("#sortBy").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
    $("#invAvail").textContent = INV.filter((w) => w.status === "available").length;
    render();
  }

  /* contact dropdown */
  const cw = $("#contactWatch");
  if (cw) INV.filter((w) => w.status !== "sold").forEach((w) => {
    const o = document.createElement("option"); o.value = `${fullName(w)} (${w.ref})`; o.textContent = `${fullName(w)} · ${fmt(w.price)}`; cw.appendChild(o);
  });

  /* Instagram grid (placeholder tiles) */
  const ig = $("#igGrid");
  if (ig) {
    const pick = [0, 3, 4, 2, 5, 9].map((i) => INV[i]).filter(Boolean);
    ig.innerHTML = pick.map((w) => `<a class="ig__tile" href="https://www.instagram.com/watchguycle" target="_blank" rel="noopener" aria-label="Instagram post: ${fullName(w)}">${watchArt(w.art)}</a>`).join("");
  }

  /* ---------- Modal ---------- */
  const modal = $("#modal");
  let lastFocus = null;
  function openModal(id, focusForm) {
    const w = byId(id); if (!w) return;
    lastFocus = document.activeElement;
    $("#mMedia").innerHTML = watchArt(w.art, { label: fullName(w) }) + `<p class="note-ph">Illustration · real photos &amp; video on request</p>`;
    $("#mBrand").textContent = w.brand;
    $("#mTitle").textContent = w.model;
    $("#mPrice").innerHTML = w.status === "sold" ? "Sold" : `${fmt(w.price)}<small>${statusLabel[w.status]}</small>`;
    $("#mBlurb").textContent = w.blurb;
    const specs = [["Reference", w.ref], ["Year", w.year], ["Box & papers", w.set], ["Condition", w.condition], ["Case size", w.size], ["Movement", w.movement], ["Material", w.material], ["Dial", w.dial]];
    $("#mSpecs").innerHTML = specs.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
    const f = $("#mForm");
    f.reset(); resetForm(f);
    f.elements.watch.value = `${fullName(w)} (${w.ref}) · ${fmt(w.price)}`;
    const wa = $("#mWa");
    wa.href = waURL(`Hi Jon, I'm interested in the ${fullName(w)} (${w.ref}) listed at ${fmt(w.price)}. Is it still available?`);
    wa.target = "_blank"; wa.rel = "noopener";
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    $(".modal__panel", modal).scrollTop = 0;
    setTimeout(() => (focusForm ? f.elements.name : $(".modal__x", modal)).focus({ preventScroll: !focusForm }), 50);
  }
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  $$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".card__media")) { e.preventDefault(); openModal(e.target.dataset.detail); }
  });
  $("#mForm").addEventListener("change", (e) => {
    if (e.target.name === "intent") $(".offer", e.currentTarget).hidden = e.target.value !== "Make an offer";
  });

  /* ---------- Global clicks ---------- */
  document.addEventListener("click", (e) => {
    const d = e.target.closest("[data-detail]");
    if (d) { e.preventDefault(); openModal(d.dataset.detail, d.hasAttribute("data-focus-form")); return; }
    const s = e.target.closest("[data-source]");
    if (s) {
      e.preventDefault();
      const form = $(".source__form");
      const w = byId(s.dataset.source);
      if (w) form.elements.want.value = `${fullName(w)} (${w.ref})`;
      $(".source").scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => form.elements[w ? "contact" : "want"].focus({ preventScroll: true }), 500);
      return;
    }
    if (e.target.closest("[data-inquire]")) {
      e.preventDefault();
      $("#contact").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => $("#contactForm").elements.name.focus({ preventScroll: true }), 600);
    }
  });

  /* ---------- Forms (prototype: no network; Wix Forms emails Jon in the build) ---------- */
  function resetForm(f) {
    $$(".form__ok", f).forEach((p) => (p.hidden = true));
    $$("[type=submit]", f).forEach((b) => (b.hidden = false));
    $$(".is-invalid", f).forEach((i) => i.classList.remove("is-invalid"));
    const off = $(".offer", f); if (off) off.hidden = true;
  }
  $$(".js-form").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      let bad = null;
      $$("[required]", f).forEach((i) => {
        const v = i.value.trim();
        const ok = v && (i.type !== "email" || /.+@.+\..+/.test(v));
        i.classList.toggle("is-invalid", !ok);
        if (!ok && !bad) bad = i;
      });
      if (bad) { bad.focus(); return; }
      const data = Object.fromEntries(new FormData(f).entries());
      console.info("[prototype] would email Jon:", f.dataset.type, data);
      $$("[type=submit]", f).forEach((b) => (b.hidden = true));
      const ok = $(".form__ok", f); if (ok) { ok.hidden = false; ok.setAttribute("role", "status"); }
    });
    f.addEventListener("input", (e) => e.target.classList.remove("is-invalid"));
  });

  /* ---------- Header, nav, mobile bar ---------- */
  const header = $(".header");
  const mbar = $(".mbar");
  const hero = $(".hero");
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-stuck", y > 40);
    if (mbar && hero) mbar.classList.toggle("is-on", y > hero.offsetTop + hero.offsetHeight * .6);
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const burger = $(".burger"), mnav = $("#mnav");
  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", open); mnav.classList.toggle("is-open", open);
  });
  $$("a", mnav).forEach((a) => a.addEventListener("click", () => { burger.setAttribute("aria-expanded", "false"); mnav.classList.remove("is-open"); }));

  const navLinks = $$(".nav a");
  if ("IntersectionObserver" in window) {
    const so = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((s) => so.observe(s));

    const ro = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } }), { threshold: .12 });
    $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 6) * 70 + "ms"; ro.observe(el); });
  } else $$(".reveal").forEach((el) => el.classList.add("in"));

  /* ---------- Image fallback (placeholder photos) ---------- */
  $$("img[data-fallback]").forEach((img) => {
    const swap = () => {
      const ph = document.createElement("div");
      ph.className = "ph";
      ph.setAttribute("role", "img"); ph.setAttribute("aria-label", img.alt);
      ph.style.cssText = "display:grid;place-items:center;background:radial-gradient(circle at 50% 35%,#3a332a,#0e0e10 70%);color:#c8a96a;font-family:var(--serif);font-size:1.4rem;text-align:center;padding:20px";
      ph.innerHTML = '<span>Photo of Jon<br><small style="font-family:var(--sans);font-size:.75rem;color:#a39d93">to be supplied</small></span>';
      img.replaceWith(ph);
    };
    if (img.complete && img.naturalWidth === 0) swap(); else img.addEventListener("error", swap);
  });

  /* ---------- Design notes (pitch layer) ---------- */
  const notesBtn = $("#notesToggle");
  let built = false;
  function buildNotes() {
    $$("[data-note]").forEach((el, i) => {
      const n = document.createElement("aside");
      n.className = "dnote";
      n.innerHTML = `<i>${i + 1}</i><b>${el.dataset.noteTitle || "Why this is here"}</b>${el.dataset.note}`;
      if (el.matches("section, form")) el.prepend(n);
      else el.parentNode.insertBefore(n, el);
    });
    built = true;
  }
  function setNotes(on) {
    if (on && !built) buildNotes();
    document.body.classList.toggle("show-notes", on);
    notesBtn.setAttribute("aria-pressed", on);
  }
  notesBtn.addEventListener("click", () => setNotes(!document.body.classList.contains("show-notes")));
  if (/[?&]notes=1/.test(location.search)) setNotes(true);

  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();
})();
