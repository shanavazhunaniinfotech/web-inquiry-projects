/* Watch Guy CLE · Version A "Maison" · templates, sliders and motion */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const pol = (cx, cy, r, deg) => { const a = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };

  window.WGC = {
    card(w, H, i, isSaved) {
      const sold = w.status === "sold";
      const tag = w.tag ? `<span class="tag${w.tag === "Price drop" ? " tag--drop" : ""}">${w.tag}</span>` : "";
      const acts = sold
        ? `<button class="btn btn--line" data-goto="finder">Find me one like it</button>`
        : `<a class="wamini wa" href="#" data-wa="Hi Jon, is the ${H.nameOf(w)} (${w.ref}) at ${H.money(w.price)} still available?" aria-label="WhatsApp about ${H.nameOf(w)}"><svg><use href="#i-wa"/></svg></a><button class="btn btn--emerald" data-qv="${w.id}" data-focus>${w.status === "hold" ? "Join the waitlist" : "Inquire"}</button>`;
      return `<article class="card${sold ? " is-sold" : ""}">
        <div class="card__media" data-qv="${w.id}" role="button" tabindex="0" aria-label="Quick view: ${H.nameOf(w)}">
          <img src="${H.img(w.img, 700)}" alt="${H.nameOf(w)}" loading="lazy" data-fb="${w.id}">
          ${tag}<span class="status status--${w.status}"><i></i>${H.STATUS[w.status]}</span>
          <span class="qvbtn"><svg class="i"><use href="#i-eye"/></svg> Quick view</span>
        </div>
        <button class="heart" data-id="${w.id}" aria-pressed="${isSaved}" aria-label="Save ${H.nameOf(w)}"><svg><use href="#i-heart"/></svg></button>
        <div class="card__body">
          <p class="card__brand">${w.brand}</p>
          <h3 class="card__name"><button data-qv="${w.id}">${w.model}</button></h3>
          <p class="card__meta">${w.year} · <b>✓ ${w.set}</b> · ${w.condition} · ${w.size}</p>
          <p class="card__price">${sold ? "Sold" : H.money(w.price)}</p>
          <div class="card__acts">${acts}</div>
        </div>
      </article>`;
    },
    pick(w, H) {
      return `<button class="qpick" data-qv="${w.id}"><span class="qpick__img"><img src="${H.img(w.img, 200)}" alt="" data-fb="${w.id}"></span><span><b>${H.nameOf(w)}</b><small>${w.year} · ${w.set} · ${w.condition}</small></span><span class="qpick__p">${H.money(w.price)}</span></button>`;
    },
    motion({ H, hasG }) {
      if (!hasG) return;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: .1 });
      tl.from(".arch__img img", { scale: 1.3, duration: 2.6, ease: "power3.out" }, 0)
        .to(".hero .kick", { opacity: 1, y: 0, duration: 1.2 }, .15)
        .to(".hero__h .ln > span", { y: 0, duration: 1.5, stagger: .12 }, .25)
        .to(".hero__lead, .hero__ctas, .proof", { opacity: 1, y: 0, duration: 1.2, stagger: .1 }, .75)
        .to(".hero__art", { opacity: 1, y: 0, duration: 1.6 }, .3)
        .from(".arch__frame", { scale: .92, opacity: 0, duration: 1.8 }, .5)
        .from(".justin", { x: 40, opacity: 0, duration: 1.2 }, 1.1);
      gsap.to(".arch__img img", { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero__copy", { yPercent: -10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.fromTo("#bezel", { rotate: -60 }, { rotate: 30, ease: "none", scrollTrigger: { trigger: ".spot", start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.fromTo(".spot__img", { scale: .86 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".spot", start: "top bottom", end: "center center", scrub: 1 } });
      gsap.fromTo(".about__img img", { yPercent: -10 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".sell__img img", { yPercent: -12 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".sell", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".ftr__word", { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".ftr", start: "top bottom", end: "center bottom", scrub: 1 } });
      // dial: the hand sweeps XII → III → VI → IX as you scroll
      const steps = H.$$(".step");
      const hand = document.getElementById("dialHand");
      steps[0].classList.add("is-on");
      gsap.to(hand, {
        rotate: 270, ease: "none",
        scrollTrigger: {
          trigger: ".dialwrap", start: "top 65%", end: "bottom 55%", scrub: .8,
          onUpdate: (st) => { const k = Math.min(3, Math.floor(st.progress * 3.999)); steps.forEach((s, j) => s.classList.toggle("is-on", j <= k)); }
        }
      });
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    /* spotlight bezel */
    const bz = document.getElementById("bezel");
    if (bz) {
      let s = `<circle cx="200" cy="200" r="197" fill="none" stroke="#b48d55" stroke-width=".8"/><circle cx="200" cy="200" r="158" fill="none" stroke="#b48d55" stroke-opacity=".45" stroke-width=".8"/>`;
      for (let i = 0; i < 60; i++) {
        const major = i % 5 === 0;
        const [x1, y1] = pol(200, 200, major ? 176 : 184, i * 6), [x2, y2] = pol(200, 200, 192, i * 6);
        s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#8a6a37" stroke-width="${major ? 1.4 : .7}"/>`;
        if (major && i) { const [tx, ty] = pol(200, 200, 166, i * 6); s += `<text x="${tx.toFixed(1)}" y="${(ty + 3.5).toFixed(1)}" font-size="10" font-family="Geist, sans-serif" fill="#8a6a37" text-anchor="middle">${i}</text>`; }
      }
      s += `<path d="M193 10 L207 10 L200 22 Z" fill="#b48d55"/>`;
      bz.innerHTML = s;
    }
    /* process dial */
    const dl = document.getElementById("dialSvg");
    if (dl) {
      let s = `<defs><radialGradient id="dg" cx="50%" cy="42%" r="60%"><stop offset="0" stop-color="#1b5242"/><stop offset="1" stop-color="#0a2219"/></radialGradient></defs>
        <circle cx="200" cy="200" r="198" fill="none" stroke="#d6b980" stroke-opacity=".35"/>
        <circle cx="200" cy="200" r="188" fill="url(#dg)" stroke="#d6b980" stroke-opacity=".6"/>
        <circle cx="200" cy="200" r="118" fill="none" stroke="#d6b980" stroke-opacity=".18" stroke-dasharray="2 5"/>`;
      for (let i = 0; i < 60; i++) {
        const [x1, y1] = pol(200, 200, i % 5 ? 172 : 166, i * 6), [x2, y2] = pol(200, 200, 180, i * 6);
        s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#d6b980" stroke-opacity="${i % 5 ? .35 : .8}" stroke-width="${i % 5 ? .8 : 1.6}"/>`;
      }
      [["XII", 0], ["III", 90], ["VI", 180], ["IX", 270]].forEach(([t, d]) => { const [x, y] = pol(200, 200, 140, d); s += `<text x="${x.toFixed(1)}" y="${(y + 11).toFixed(1)}" font-size="32" font-family="Instrument Serif, serif" font-style="italic" fill="#d6b980" text-anchor="middle">${t}</text>`; });
      [30, 60, 120, 150, 210, 240, 300, 330].forEach((d) => { const [x, y] = pol(200, 200, 145, d); s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#d6b980" fill-opacity=".6"/>`; });
      s += `<text x="200" y="250" font-size="9" letter-spacing="4" font-family="Geist, sans-serif" fill="#d6b980" fill-opacity=".7" text-anchor="middle">WATCH GUY · CLE</text>`;
      dl.innerHTML = s;
    }
    /* testimonials slider */
    const slides = Array.from(document.querySelectorAll(".slide"));
    if (slides.length) {
      const bar = document.getElementById("revBar"), num = document.getElementById("revN");
      const DUR = 7000; let idx = 0, t0 = performance.now(), paused = false, visible = false;
      const go = (n) => { idx = (n + slides.length) % slides.length; slides.forEach((s, j) => s.classList.toggle("is-on", j === idx)); num.textContent = String(idx + 1).padStart(2, "0"); t0 = performance.now(); };
      document.getElementById("revPrev").addEventListener("click", () => go(idx - 1));
      document.getElementById("revNext").addEventListener("click", () => go(idx + 1));
      const box = document.getElementById("slides");
      box.addEventListener("mouseenter", () => (paused = true)); box.addEventListener("mouseleave", () => { paused = false; t0 = performance.now() - parseFloat(bar.style.width || 0) / 100 * DUR; });
      if ("IntersectionObserver" in window) new IntersectionObserver((e) => (visible = e[0].isIntersecting)).observe(box);
      const loop = (t) => {
        if (visible && !paused) { const p = (t - t0) / DUR; bar.style.width = Math.min(100, p * 100) + "%"; if (p >= 1) go(idx + 1); }
        else if (!visible) t0 = t - parseFloat(bar.style.width || 0) / 100 * DUR;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
    /* FAQ accordion */
    document.querySelectorAll(".acc__q").forEach((q) => q.addEventListener("click", () => {
      const item = q.parentElement, open = !item.classList.contains("is-open");
      document.querySelectorAll(".acc__i").forEach((x) => { x.classList.remove("is-open"); x.querySelector(".acc__q").setAttribute("aria-expanded", "false"); });
      if (open) { item.classList.add("is-open"); q.setAttribute("aria-expanded", "true"); }
      setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 650);
    }));
  });
})();
