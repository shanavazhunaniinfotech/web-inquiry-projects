/* Watch Guy CLE · Version B "Atelier" · templates, marquee, reels, motion */
(function () {
  "use strict";
  const img = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;

  window.WGC = {
    card(w, H, i, isSaved) {
      const sold = w.status === "sold";
      const tag = w.tag ? `<span class="tag${w.tag === "Price drop" ? " tag--drop" : ""}">${w.tag}</span>` : "";
      const acts = sold
        ? `<button class="btn btn--line" data-goto="finder">Find me one like it</button>`
        : `<button class="btn btn--ink" data-qv="${w.id}" data-focus>${w.status === "hold" ? "Join waitlist" : "Inquire"} <svg class="i"><use href="#i-arrow"/></svg></button><a class="wamini wa" href="#" data-wa="Hi Jon, is the ${H.nameOf(w)} (${w.ref}) at ${H.money(w.price)} still available?" aria-label="WhatsApp about ${H.nameOf(w)}"><svg><use href="#i-wa"/></svg></a>`;
      return `<article class="card${sold ? " is-sold" : ""}">
        <div class="card__media" data-qv="${w.id}" role="button" tabindex="0" aria-label="Quick view: ${H.nameOf(w)}">
          <img src="${H.img(w.img, 800)}" alt="${H.nameOf(w)}" loading="lazy" data-fb="${w.id}">
          <span class="card__n">${String(i + 1).padStart(2, "0")}</span>${tag}
          <span class="status status--${w.status}"><i></i>${H.STATUS[w.status]}</span>
          <span class="qvbtn">Quick view <span>+</span></span>
        </div>
        <button class="heart" data-id="${w.id}" aria-pressed="${isSaved}" aria-label="Save ${H.nameOf(w)}"><svg><use href="#i-heart"/></svg></button>
        <div class="card__body">
          <div class="card__row"><div><p class="card__brand">${w.brand}</p><h3 class="card__name"><button data-qv="${w.id}">${w.model}</button></h3></div><p class="card__price">${sold ? "Sold" : H.money(w.price)}</p></div>
          <p class="card__meta">Ref. ${w.ref} · ${w.year} · <b>✓ ${w.set}</b> · ${w.condition}</p>
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
      tl.to(".hero .lbl", { opacity: 1, y: 0, duration: 1, stagger: .1 }, .1)
        .to(".hero__h .ln > span", { y: 0, duration: 1.5, stagger: .1 }, .2)
        .to(".hero__img", { opacity: 1, y: 0, duration: 1.6 }, .55)
        .from(".hero__media img", { scale: 1.3, duration: 2.6, ease: "power3.out" }, .55)
        .to(".hero__lead, .hero__ctas, .proof", { opacity: 1, y: 0, duration: 1.2, stagger: .1 }, .8);
      gsap.to(".hero__media img", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero__img", start: "top 60%", end: "bottom top", scrub: true } });
      gsap.fromTo(".spot__img img", { yPercent: -10 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".spot", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".spot__num", { yPercent: 30 }, { yPercent: -10, ease: "none", scrollTrigger: { trigger: ".spot", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".about__img img", { yPercent: -10 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".about__in", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".sell__img img", { yPercent: -12 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".sell", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".contact__big", { xPercent: 6 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "center center", scrub: 1 } });
      gsap.fromTo(".ftr__word", { xPercent: -6 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".ftr", start: "top bottom", end: "bottom bottom", scrub: 1 } });
      // pinned horizontal "Simple & safe"
      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px)", () => {
        const sec = document.querySelector(".proc"), track = document.getElementById("procTrack");
        sec.classList.add("is-h");
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const n = document.getElementById("procN"), bar = document.getElementById("procBar");
        const tw = gsap.to(track, {
          x: () => -dist(), ease: "none",
          scrollTrigger: {
            trigger: sec, start: "top top", end: () => "+=" + dist(), pin: true, scrub: .8, invalidateOnRefresh: true,
            onUpdate: (st) => { const k = Math.min(3, Math.floor(st.progress * 3.999)); n.textContent = "0" + (k + 1); bar.style.width = (25 + st.progress * 75) + "%"; }
          }
        });
        return () => { sec.classList.remove("is-h"); tw.kill(); gsap.set(track, { x: 0 }); };
      });
    }
  };

  /* ----- testimonials marquee (two rows, opposite directions) ----- */
  const REVIEWS = [
    ["Bought my first Rolex from Jon. He sent a video of the serial and movement before we even met. Zero pressure, completely honest. I won't buy anywhere else.", "Marcus T.", "Westlake, OH", "sub-126610ln", "Submariner", "1587836374828-4dbafa94cf0e"],
    ["Traded my Tudor toward a Speedmaster. Fair number, done in one afternoon. Jon knows watches inside out, and it shows.", "Danielle R.", "Cleveland, OH", "speedy-310", "Speedmaster", "1547996160-81dfa63595aa"],
    ["Shipped to Columbus fully insured, arrived next day with signature. Exactly as described. Honestly, better.", "Kevin P.", "Columbus, OH", "ro-15500st", "Royal Oak", "1612817159949-195b6eb9e31a"],
    ["Found me a Patek I'd been chasing for two years. He kept me updated every week until it landed.", "Arjun S.", "Solon, OH", "aquanaut-5167a", "Aquanaut", "1620625515032-6ed0c1790c75"],
    ["First luxury watch, total beginner. Jon walked me through everything and never once pushed.", "Lauren M.", "Lakewood, OH", "santos-wssa0029", "Santos", "1619134778706-7015533a6150"],
    ["Met at my bank, checked the serial together, done in twenty minutes. Professional from start to finish.", "Chris W.", "Akron, OH", "gmt-126710blro", "GMT-Master II", "1611591437281-460bfbe1220a"]
  ];
  const rc = (r, hidden) => `<figure class="rcard"${hidden ? ' aria-hidden="true"' : ""}><i class="stars">★★★★★</i><blockquote>“${r[0]}”</blockquote><footer><span class="av">${r[1][0]}</span><span><b>${r[1]}</b><small>${r[2]}</small></span><button class="bought" data-qv="${r[3]}"${hidden ? ' tabindex="-1"' : ""}><span class="bought__img"><img src="${img(r[5], 120)}" alt="" loading="lazy" data-fb="${r[3]}"></span><span>${r[4]}</span></button></footer></figure>`;
  const m1 = document.getElementById("marq1"), m2 = document.getElementById("marq2");
  if (m1 && m2) {
    const a = REVIEWS.slice(0, 3).concat(REVIEWS.slice(3)), b = REVIEWS.slice(3).concat(REVIEWS.slice(0, 3));
    m1.innerHTML = a.map((r) => rc(r)).join("") + a.map((r) => rc(r, true)).join("");
    m2.innerHTML = b.map((r) => rc(r, true)).join("") + b.map((r) => rc(r, true)).join("");
  }

  /* ----- reels: drag to scroll on desktop ----- */
  const reels = document.getElementById("reels");
  if (reels) {
    let down = false, sx = 0, sl = 0, moved = false;
    reels.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = reels.scrollLeft; reels.classList.add("drag"); });
    window.addEventListener("pointermove", (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; reels.scrollLeft = sl - dx; });
    window.addEventListener("pointerup", () => { down = false; reels.classList.remove("drag"); });
    reels.addEventListener("click", (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
  }

  /* ----- FAQ accordion ----- */
  document.querySelectorAll(".acc__q").forEach((q) => q.addEventListener("click", () => {
    const item = q.parentElement, open = !item.classList.contains("is-open");
    document.querySelectorAll(".acc__i").forEach((x) => { x.classList.remove("is-open"); x.querySelector(".acc__q").setAttribute("aria-expanded", "false"); });
    if (open) { item.classList.add("is-open"); q.setAttribute("aria-expanded", "true"); }
    setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 650);
  }));
})();
