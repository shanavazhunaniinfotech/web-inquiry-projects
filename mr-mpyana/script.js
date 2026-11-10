/* =========================================================================
   MR MPYANA — interactions
   Plain JS, no dependencies. Content comes from data.js.
   ========================================================================= */
(function () {
  "use strict";

  var D = window.MPYANA || { contact: {}, categories: [], projects: [] };
  var C = D.contact || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var catLabel = function (id) {
    var c = (D.categories || []).filter(function (x) { return x.id === id; })[0];
    return c ? c.label : id;
  };

  /* ---------- Contact links (single source of truth) ---------- */
  var waBase = "https://wa.me/" + (C.whatsapp || "");
  var links = {
    whatsapp: waBase + "?text=" + encodeURIComponent("Hi Mr Mpyana, I'd like to discuss a logo project."),
    email: "mailto:" + (C.email || "") + "?subject=" + encodeURIComponent("Logo project enquiry"),
    fiverr: C.fiverr || "#"
  };
  $$("[data-contact]").forEach(function (a) {
    var k = a.getAttribute("data-contact");
    if (links[k]) a.href = links[k];
    if (k !== "email") { a.target = "_blank"; a.rel = "noopener"; }
  });
  $$("[data-contact-text]").forEach(function (el) {
    var k = el.getAttribute("data-contact-text");
    if (k === "whatsapp" && C.whatsapp) el.textContent = "+" + C.whatsapp.replace(/^(\d{2})(\d{2})(\d{3})(\d+)/, "$1 $2 $3 $4");
    else if (C[k]) el.textContent = C[k];
  });
  $$("[data-socials]").forEach(function (box) {
    (C.socials || []).forEach(function (s) {
      var a = document.createElement("a");
      a.href = s.url; a.target = "_blank"; a.rel = "noopener"; a.textContent = s.name;
      box.appendChild(a);
    });
  });
  if (!C.placeholder) $$(".pending-note").forEach(function (n) { n.remove(); });

  /* ---------- Load state ---------- */
  function setLengths() {
    $$(".construct .draw").forEach(function (p) {
      if (p.getTotalLength) {
        try { var l = Math.ceil(p.getTotalLength()) + 2; p.style.setProperty("--len", l); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; } catch (e) {}
      }
    });
  }
  setLengths();
  // Clear inline dashoffset so the CSS animation/transition can drive it
  requestAnimationFrame(function () {
    $$(".construct .draw").forEach(function (p) { p.style.strokeDashoffset = ""; });
  });
  window.addEventListener("load", function () { document.documentElement.classList.add("is-loaded"); });
  setTimeout(function () { document.documentElement.classList.add("is-loaded"); }, 1200);

  /* ---------- Header + mobile menu + action bar ---------- */
  var head = $(".site-head");
  var bar = $(".action-bar");
  function onScroll() {
    var y = window.scrollY;
    if (head) head.classList.toggle("scrolled", y > 30);
    if (bar) bar.classList.toggle("show", y > window.innerHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var menuBtn = $(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = document.documentElement.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", open);
      $(".mobile-menu").setAttribute("aria-hidden", !open);
    });
    $$(".mobile-menu a").forEach(function (a) {
      a.addEventListener("click", function () { document.documentElement.classList.remove("menu-open"); });
    });
  }

  /* ---------- Rotating word ---------- */
  $$(".rotator").forEach(function (r) {
    var items = $$("span", r), i = 0;
    if (items.length < 2 || reduce) return;
    setInterval(function () {
      var cur = items[i];
      cur.classList.remove("on"); cur.classList.add("out");
      setTimeout(function () { cur.classList.remove("out"); }, 800);
      i = (i + 1) % items.length;
      items[i].classList.add("on");
    }, 2600);
  });

  /* ---------- Split text for word reveals ---------- */
  $$('[data-reveal="split"]').forEach(function (el) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement("span"); w.className = "w";
            var s = document.createElement("span"); s.textContent = part; s.style.setProperty("--i", n++);
            w.appendChild(s); frag.appendChild(w);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== "BR") walk(c);
      });
    })(el);
  });

  /* ---------- Statement: words light up as you read ---------- */
  $$(".statement").forEach(function (st) {
    var accents = (st.getAttribute("data-accent") || "").toLowerCase().split(",");
    var words = st.textContent.trim().split(/\s+/);
    st.innerHTML = words.map(function (w) {
      var clean = w.toLowerCase().replace(/[^a-z]/g, "");
      return '<span class="sw' + (accents.indexOf(clean) > -1 ? " r" : "") + '">' + w + "</span>";
    }).join(" ");
  });
  var statements = $$(".statement");

  /* ---------- Reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    window.__observeReveal = function (el) { io.observe(el); };
    $$('[data-reveal]:not([data-reveal="mask"]), .svc-card, .tile.slot').forEach(function (el) { io.observe(el); });
    // Fully clipped elements never "intersect", so watch their parent instead
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$(':scope > [data-reveal="mask"]', e.target).forEach(function (m) { m.classList.add("in"); });
        mio.unobserve(e.target);
      });
    }, { threshold: 0.1 });
    $$('[data-reveal="mask"]').forEach(function (el) { mio.observe(el.parentElement); });
  } else {
    $$("[data-reveal]").forEach(function (el) { el.classList.add("in"); });
    window.__observeReveal = function (el) { el.classList.add("in"); };
  }

  /* ---------- Scroll-linked: process bar + statement ---------- */
  var proc = $(".process");
  var steps = $$(".process .step");
  function scrollLinked() {
    var vh = window.innerHeight;
    if (proc) {
      var r = proc.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.2)));
      proc.style.setProperty("--p", p.toFixed(3));
      steps.forEach(function (s, i) { s.classList.toggle("lit", p >= (i / steps.length) + 0.02); });
    }
    statements.forEach(function (st) {
      var r2 = st.getBoundingClientRect();
      var prog = Math.min(1, Math.max(0, (vh * 0.85 - r2.top) / (r2.height + vh * 0.3)));
      var ws = st.children, lim = Math.round(prog * ws.length);
      for (var k = 0; k < ws.length; k++) ws[k].classList.toggle("on", k < lim);
    });
  }
  if (proc || statements.length) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(function () { scrollLinked(); ticking = false; }); ticking = true; }
    }, { passive: true });
    scrollLinked();
  }

  /* ---------- Hero stage tilt ---------- */
  var stage = $(".stage");
  if (stage && finePointer && !reduce) {
    var inner = $(".stage-inner", stage);
    document.addEventListener("pointermove", function (e) {
      var x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      inner.style.transform = "rotateY(" + (x * 10).toFixed(2) + "deg) rotateX(" + (-y * 10).toFixed(2) + "deg)";
    });
  }

  /* ---------- Services accordion (home) ---------- */
  var rail = $(".svc-rail");
  if (rail) {
    var svcs = $$(".svc", rail);
    var activate = function (el) { svcs.forEach(function (s) { s.classList.toggle("active", s === el); }); };
    svcs.forEach(function (s) {
      s.addEventListener("mouseenter", function () { if (finePointer) activate(s); });
      s.addEventListener("focusin", function () { activate(s); });
      s.addEventListener("click", function () { activate(s); });
    });
    var dots = $(".rail-dots");
    if (dots) {
      svcs.forEach(function (s, i) {
        var b = document.createElement("i");
        b.style.cssText = "width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.25;transition:all .4s";
        dots.appendChild(b);
      });
      rail.addEventListener("scroll", function () {
        var idx = Math.round(rail.scrollLeft / (svcs[0].offsetWidth + 14));
        $$("i", dots).forEach(function (d, i) { d.style.opacity = i === idx ? 1 : .25; d.style.width = i === idx ? "22px" : "7px"; d.style.borderRadius = "9px"; });
      }, { passive: true });
      rail.dispatchEvent(new Event("scroll"));
    }
  }

  /* ---------- Lightbox ---------- */
  var lb = null, lbImgs = [], lbIdx = 0, lastFocus = null;
  function buildLightbox() {
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Logo preview");
    lb.innerHTML =
      '<div class="lb-top"><span class="mono lb-title"></span><button class="lb-close" aria-label="Close preview"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>' +
      '<div class="lb-stage"><img alt=""></div>' +
      '<div class="lb-foot"><span class="mono muted lb-count"></span><div class="lb-thumbs"></div><a class="btn" href="contact.html">Start a similar project <span class="arr">→</span></a></div>';
    document.body.appendChild(lb);
    $(".lb-close", lb).addEventListener("click", closeLB);
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-stage")) closeLB(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowRight") showLB(lbIdx + 1);
      if (e.key === "ArrowLeft") showLB(lbIdx - 1);
    });
  }
  function showLB(i) {
    lbIdx = (i + lbImgs.length) % lbImgs.length;
    var img = $(".lb-stage img", lb);
    img.classList.remove("shown");
    var it = lbImgs[lbIdx];
    setTimeout(function () {
      img.src = it.src; img.alt = it.alt || "";
      var go = function () { requestAnimationFrame(function () { img.classList.add("shown"); }); };
      if (img.complete) go(); else img.onload = go;
    }, img.src ? 260 : 0);
    $(".lb-count", lb).textContent = String(lbIdx + 1).padStart(2, "0") + " / " + String(lbImgs.length).padStart(2, "0");
    $$(".lb-thumbs button", lb).forEach(function (b, k) { b.setAttribute("aria-current", k === lbIdx); });
  }
  function openLB(images, title, start) {
    if (!lb) buildLightbox();
    lastFocus = document.activeElement;
    lbImgs = images;
    $(".lb-title", lb).textContent = title || "";
    var th = $(".lb-thumbs", lb); th.innerHTML = "";
    if (images.length > 1) images.forEach(function (im, k) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", "View image " + (k + 1));
      b.innerHTML = '<img src="' + im.src + '" alt="">';
      b.addEventListener("click", function () { showLB(k); });
      th.appendChild(b);
    });
    $(".lb-stage img", lb).removeAttribute("src");
    lb.classList.add("open");
    document.documentElement.style.overflow = "hidden";
    showLB(start || 0);
    $(".lb-close", lb).focus();
  }
  function closeLB() {
    lb.classList.remove("open");
    document.documentElement.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  function projectImages(p) {
    return [{ src: p.image, alt: p.title }].concat((p.details || []).map(function (d, i) { return { src: d, alt: p.title + " detail " + (i + 1) }; }));
  }
  function projectById(id) { return (D.projects || []).filter(function (p) { return p.id === id; })[0]; }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-lightbox]");
    if (!t) return;
    var p = projectById(t.getAttribute("data-lightbox"));
    if (!p) return;
    e.preventDefault();
    openLB(projectImages(p), p.title + " · " + p.category.map(catLabel).join(" / "), parseInt(t.getAttribute("data-start") || "0", 10));
  });
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("[data-lightbox]:not(a):not(button)")) { e.preventDefault(); e.target.click(); }
  });

  /* ---------- Portfolio (data-driven) ---------- */
  var glyphs = {
    circle: '<circle class="g" cx="50" cy="50" r="46"/><circle class="g" cx="50" cy="50" r="30"/><path class="g" d="M0 50h100M50 0v100"/><circle class="m" cx="50" cy="50" r="30"/><path class="m acc" d="M30 66V34l20 22 20-22v32"/>',
    shield: '<path class="g" d="M0 50h100M50 0v100M10 10l80 80M90 10L10 90"/><path class="m" d="M50 6l38 14v30c0 22-16 38-38 46C28 88 12 72 12 50V20z"/><path class="m acc" d="M32 64V36l18 18 18-18v28"/>',
    word: '<path class="g" d="M0 30h100M0 70h100M0 50h100"/><path class="m" d="M6 70V30l12 22 12-22v40"/><path class="m acc" d="M40 70V30h14a10 10 0 010 20H40"/><path class="m" d="M66 30l12 20 12-20M78 50v20"/>',
    square: '<rect class="g" x="4" y="4" width="92" height="92"/><path class="g" d="M4 50h92M50 4v92"/><rect class="m" x="18" y="18" width="64" height="64" rx="4"/><path class="m acc" d="M34 66V34h16a10 10 0 010 20H34"/>'
  };
  window.__glyph = glyphs;

  var grid = $(".pf-grid");
  var list = $(".pf-list");
  if (grid && list) {
    var projects = D.projects || [];
    var real = projects.filter(function (p) { return !p.slot; });
    var n = 0;
    projects.forEach(function (p) {
      var cats = p.category.join(" ");
      var tile = document.createElement("article");
      tile.className = "tile " + (p.size || "sq") + (p.slot ? " slot" : " bracket");
      tile.setAttribute("data-cats", cats);
      if (p.slot) {
        tile.innerHTML =
          '<span class="slot-badge">Open slot</span>' +
          '<div class="slot-art"><svg viewBox="0 0 100 100" aria-hidden="true">' + (glyphs[p.glyph] || glyphs.circle) + "</svg></div>" +
          '<div class="t-info"><div><span>' + catLabel(p.category[0]) + '</span><h3>Your project could be next</h3></div></div>';
      } else {
        tile.setAttribute("data-lightbox", p.id);
        tile.setAttribute("tabindex", "0");
        tile.setAttribute("role", "button");
        tile.setAttribute("aria-label", "Preview " + p.title);
        tile.innerHTML =
          '<img src="' + (p.size === "xl" ? p.image : (p.thumb || p.image)) + '" alt="' + p.title + '" loading="lazy" decoding="async">' +
          '<span class="zoom-hint" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></span>' +
          '<div class="t-info"><div><span>' + p.category.map(catLabel).join(" · ") + "</span><h3>" + p.title + '</h3></div><span class="t-yr">' + (p.year || "") + "</span></div>";
      }
      grid.appendChild(tile);
      if (window.__observeReveal && p.slot) window.__observeReveal(tile);

      var row = document.createElement(p.slot ? "div" : "button");
      row.className = "row" + (p.slot ? " slot" : "");
      row.setAttribute("data-cats", cats);
      if (!p.slot) { row.setAttribute("data-lightbox", p.id); row.setAttribute("data-preview", p.thumb || p.image); row.style.width = "100%"; row.style.textAlign = "left"; }
      n++;
      row.innerHTML =
        '<span class="r-n">' + String(n).padStart(2, "0") + "</span>" +
        '<span class="r-t">' + (p.slot ? "Open slot: " + p.title : p.title) + "</span>" +
        '<span class="r-c">' + p.category.map(catLabel).join(" · ") + "</span>" +
        '<span class="r-y">' + (p.slot ? "—" : (p.year || "")) + "</span>" +
        '<span class="r-a" aria-hidden="true">' + (p.slot ? "" : "→") + "</span>";
      list.appendChild(row);
    });
    setLengths();

    // Filters with live counts
    var fb = $(".filters");
    var all = [{ id: "all", label: "All work" }].concat(D.categories || []);
    all.forEach(function (c) {
      var count = c.id === "all" ? real.length : real.filter(function (p) { return p.category.indexOf(c.id) > -1; }).length;
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-pressed", c.id === "all");
      b.setAttribute("data-f", c.id);
      b.innerHTML = c.label + " <sup>" + String(count).padStart(2, "0") + "</sup>";
      fb.appendChild(b);
    });
    var applyFilter = function (f) {
      $$("button", fb).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-f") === f); });
      var match = function (el) { return f === "all" || el.getAttribute("data-cats").split(" ").indexOf(f) > -1; };
      var tiles = $$(".tile", grid);
      tiles.forEach(function (t) { if (!t.classList.contains("hide")) t.classList.add("leaving"); });
      setTimeout(function () {
        tiles.forEach(function (t) {
          var m = match(t);
          t.classList.toggle("hide", !m);
          if (m) { t.classList.add("leaving"); requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.remove("leaving"); }); }); }
          else t.classList.remove("leaving");
        });
        $$(".row", list).forEach(function (r) { r.classList.toggle("hide", !match(r)); });
      }, reduce ? 0 : 320);
      try { history.replaceState(null, "", f === "all" ? location.pathname : "#" + f); } catch (e) {}
    };
    fb.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (b) applyFilter(b.getAttribute("data-f"));
    });
    var h = location.hash.replace("#", "");
    if (h && all.some(function (c) { return c.id === h; })) applyFilter(h);

    // Grid / Index toggle
    $$(".view-toggle button").forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".view-toggle button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        $(".pf").classList.toggle("list-mode", b.getAttribute("data-v") === "list");
      });
    });

    // Cursor-following preview on index rows
    var cp = $(".cursor-preview");
    if (cp && finePointer) {
      var cpImg = $("img", cp), tx = 0, ty = 0, cx = 0, cy = 0, rot = 0, raf = null;
      var loop = function () {
        cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16;
        rot += (((tx - cx) * 0.05) - rot) * 0.2;
        cp.style.transform = "translate3d(" + cx + "px," + cy + "px,0) translate(-50%,-50%) scale(" + (cp.classList.contains("on") ? 1 : .6) + ") rotate(" + rot.toFixed(2) + "deg)";
        raf = requestAnimationFrame(loop);
      };
      list.addEventListener("pointermove", function (e) { tx = e.clientX + 170; ty = e.clientY; if (!raf) { cx = tx; cy = ty; loop(); } });
      list.addEventListener("pointerover", function (e) {
        var r = e.target.closest(".row[data-preview]");
        if (r) { if (cpImg.getAttribute("src") !== r.getAttribute("data-preview")) cpImg.src = r.getAttribute("data-preview"); cp.classList.add("on"); }
        else cp.classList.remove("on");
      });
      list.addEventListener("pointerleave", function () { cp.classList.remove("on"); });
    }
  }

  /* ---------- Services page: draw empty-state glyphs ---------- */
  $$("[data-glyph]").forEach(function (el) {
    el.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true">' + (glyphs[el.getAttribute("data-glyph")] || "") + "</svg>" + el.innerHTML;
  });

  /* ---------- Contact form → WhatsApp or email ---------- */
  var form = $("#enquiry");
  if (form) {
    var pre = new URLSearchParams(location.search).get("service");
    if (pre) $$('input[name="service"]', form).forEach(function (r) { if (r.value === pre) r.checked = true; });
    var compose = function () {
      var f = new FormData(form);
      var name = (f.get("name") || "").trim();
      var idea = (f.get("idea") || "").trim();
      var err = $(".err", form);
      if (!name || !idea) { err.textContent = "Please add your name and a few words about your logo idea."; (name ? form.idea : form.name).focus(); return null; }
      err.textContent = "";
      var lines = [
        "Hi Mr Mpyana, I'd like to start a logo project.",
        "",
        "Name: " + name,
        f.get("brand") ? "Brand / business: " + f.get("brand") : "",
        f.get("service") ? "Service: " + f.get("service") : "",
        f.get("reply") ? "Best way to reach me: " + f.get("reply") : "",
        "",
        "Idea: " + idea
      ].filter(function (l, i, a) { return l !== "" || (a[i - 1] !== ""); });
      return lines.join("\n");
    };
    $$("[data-send]", form).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var msg = compose(); if (!msg) return;
        if (btn.getAttribute("data-send") === "whatsapp") window.open(waBase + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
        else location.href = "mailto:" + (C.email || "") + "?subject=" + encodeURIComponent("Logo project enquiry") + "&body=" + encodeURIComponent(msg);
      });
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); $('[data-send="whatsapp"]', form).click(); });
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
