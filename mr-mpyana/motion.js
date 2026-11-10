/* =========================================================================
   MR MPYANA — motion engine (v2)
   Smooth scroll, scroll-scrubbed hero assembly, hanging gallery, services
   dial, artboard process, red-flood CTA, footer brand effects.
   ========================================================================= */
(function () {
  "use strict";
  var D = window.MPYANA || {};
  var C = D.contact || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var clamp = function (v, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var easeInOut = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var vh = window.innerHeight;
  window.addEventListener("resize", function () { vh = window.innerHeight; });

  /* progress (0..1) of a tall "pin" section while its sticky child is pinned */
  function pinProgress(el) {
    var r = el.getBoundingClientRect();
    var dist = el.offsetHeight - vh;
    return dist > 0 ? clamp(-r.top / dist) : 0;
  }
  function inView(el, margin) {
    var r = el.getBoundingClientRect();
    return r.bottom > -(margin || 0) && r.top < vh + (margin || 0);
  }

  /* ---------- Smooth scrolling (desktop only) ---------- */
  var lenis = null;
  if (window.Lenis && fine && !reduce) {
    try { lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true }); } catch (e) { lenis = null; }
  }

  /* ---------- Social links in footer ---------- */
  $$("[data-social-list]").forEach(function (li) {
    (C.socials || []).forEach(function (s) {
      var n = document.createElement("li");
      n.innerHTML = '<a href="' + s.url + '" target="_blank" rel="noopener">' + s.name + "</a>";
      li.parentNode.insertBefore(n, li);
    });
    li.remove();
  });

  /* ======================================================================
     1. HERO — scroll-assembled emblem
     ====================================================================== */
  var hero = $(".hero-pin");
  var heroUpdate = function () {};
  if (hero) {
    var sticky = $(".hero-sticky", hero);
    var asm = $(".assembly", hero);
    var emb = $("#emb", hero);
    var pct = $("[data-pct]", hero);
    var steps = $$(".build-steps li", hero);
    var pieces = $$(".pc", hero).map(function (el) {
      var r = (el.getAttribute("data-r") || "0,1").split(",").map(parseFloat);
      var o = el.getAttribute("data-out"); o = o ? o.split(",").map(parseFloat) : null;
      var f = (el.getAttribute("data-from") || "0,0,0,1").split(",").map(parseFloat);
      var len = 0;
      if (el.classList.contains("dr")) {
        try { len = Math.ceil(el.getTotalLength()) + 4; } catch (e) { len = 2000; }
        el.style.strokeDasharray = len;
      }
      return { el: el, s: r[0], e: r[1], o: o, f: f, len: len, fi: el.classList.contains("fi"), last: -1 };
    });
    var lastGlow = -1;
    heroUpdate = function () {
      var p = reduce ? 1 : pinProgress(hero);
      sticky.style.setProperty("--p", p.toFixed(4));
      pieces.forEach(function (pc) {
        var t = clamp((p - pc.s) / (pc.e - pc.s));
        var out = pc.o ? clamp((p - pc.o[0]) / (pc.o[1] - pc.o[0])) : 0;
        var key = Math.round(t * 1000) + Math.round(out * 1000) * 1001;
        if (key === pc.last) return;
        pc.last = key;
        var e = easeInOut(t), k = 1 - e, f = pc.f;
        pc.el.style.transform = "translate(" + (f[0] * k).toFixed(1) + "px," + (f[1] * k).toFixed(1) + "px) rotate(" + (f[2] * k).toFixed(1) + "deg) scale(" + lerp(f[3], 1, e).toFixed(3) + ")";
        pc.el.style.opacity = (clamp(t * 2.2) * (1 - out)).toFixed(3);
        if (pc.len) pc.el.style.strokeDashoffset = (pc.len * (1 - easeOut(t))).toFixed(1);
        if (pc.fi) pc.el.style.fillOpacity = clamp((t - .55) / .45).toFixed(3);
      });
      var g = clamp((p - .76) / .12);
      if (Math.abs(g - lastGlow) > .01) {
        lastGlow = g;
        emb.style.filter = g > 0 ? "drop-shadow(0 0 " + (g * 12).toFixed(1) + "px rgba(255,52,66," + (g * .65).toFixed(2) + "))" : "";
      }
      asm.style.setProperty("--f", easeInOut(clamp((p - .86) / .12)).toFixed(3));
      steps.forEach(function (li) { li.classList.toggle("done", p >= parseFloat(li.getAttribute("data-at"))); });
      if (pct) pct.textContent = Math.round(clamp(p / .98) * 100) + "%";
    };
  }

  /* ======================================================================
     2. FEATURED WORK — infinite hanging gallery
     ====================================================================== */
  var hangerTick = function () {};
  var hangerScroll = function () {};
  var hanger = $(".hanger");
  if (hanger) {
    var track = $(".h-track", hanger);
    var glyph = window.__glyph || {};
    var cats = {};
    (D.categories || []).forEach(function (c) { cats[c.id] = c.label; });
    var items = [];
    (D.projects || []).forEach(function (p) {
      if (p.slot) return;
      var cl = p.category.map(function (c) { return cats[c]; }).join(" · ");
      items.push({ kind: "img", src: p.image, title: p.title, info: p.card || p.summary, cat: cl, year: p.year, id: p.id, start: 0 });
      (p.details || []).forEach(function (d, i) {
        var dc = (p.detailCards || [])[i] || {};
        items.push({ kind: "img", src: d, contain: /wordmark/.test(d), title: dc.title || p.title + " detail", info: dc.info || "", cat: "Detail · " + p.title.replace(/^Mr Mpyana /, ""), year: p.year, id: p.id, start: i + 1 });
      });
    });
    var seen = {};
    (D.projects || []).forEach(function (p) {
      if (!p.slot || seen[p.category[0]]) return;
      seen[p.category[0]] = 1;
      items.push({ kind: "slot", title: "Your " + p.title, info: "Open slot. This space is saved for the next " + p.title.toLowerCase() + " project.", cat: cats[p.category[0]], glyph: p.glyph, service: p.title });
    });
    items.push({ kind: "cta", title: "Your logo, next", info: "Tell Mr Mpyana your idea and get started.", cat: "Start a project" });
    var N = items.length;
    $("[data-ht]") && ($("[data-ht]").textContent = String(N).padStart(2, "0"));

    function cardHTML(it, i) {
      var art, tagged = "";
      if (it.kind === "img") {
        art = '<div class="h-art"><img src="' + it.src + '" alt="' + it.title + '" loading="lazy" decoding="async" draggable="false"' + (it.contain ? ' class="contain"' : "") + '><span class="sheen"></span></div>';
      } else if (it.kind === "slot") {
        art = '<div class="h-art slot"><span class="h-tag">Open slot</span><svg viewBox="0 0 100 100" aria-hidden="true">' + (glyph[it.glyph] || "") + "</svg></div>";
      } else {
        art = '<div class="h-art cta"><div><strong>Your logo<br>could hang<br>here.</strong><div class="mono" style="margin-top:16px;opacity:.85">Start a project →</div></div></div>';
      }
      var attrs = it.kind === "img"
        ? ' data-lightbox="' + it.id + '" data-start="' + it.start + '" role="button" tabindex="-1" aria-label="View ' + it.title + '"'
        : "";
      var inner =
        '<div class="h-drop"><div class="h-swing"><span class="h-peg"></span><span class="h-string"></span>' +
        '<div class="h-body">' + art +
        '<div class="h-meta"><div class="top"><span>' + it.cat + "</span><b>" + String(i + 1).padStart(2, "0") + "</b></div>" +
        "<h3>" + it.title + "</h3><p>" + it.info + "</p></div></div></div></div>";
      if (it.kind === "img") return '<article class="h-card"' + attrs + ">" + inner + "</article>";
      var href = it.kind === "slot" ? "contact.html?service=" + encodeURIComponent(it.service) + "#enquiry" : "contact.html#enquiry";
      return '<a class="h-card" href="' + href + '" tabindex="-1" draggable="false">' + inner + "</a>";
    }
    var html = "";
    for (var copy = 0; copy < 3; copy++) items.forEach(function (it, i) { html += cardHTML(it, i); });
    track.innerHTML = html;
    var cards = $$(".h-card", track).map(function (el, i) {
      el.querySelector(".h-drop").style.setProperty("--k", i % N);
      return { swing: el.querySelector(".h-swing"), a: 0, v: 0, k: .55 + ((i * 37) % 10) / 22 };
    });
    var setW = 1, step = 1, x = 0, target = 0, prevX = 0, vel = 0;
    function measure() {
      var gap = parseFloat(getComputedStyle(track).columnGap) || 30;
      var first = track.children[0];
      step = first.offsetWidth + gap;
      setW = step * N;
      x = target = -setW;
    }
    measure();
    window.addEventListener("resize", function () { var off = (x % setW); measure(); x = target = -setW + off; });

    var dragging = false, moved = 0, lastPX = 0, lastT = 0, relV = 0, hovering = false, visible = false;
    var dc = $(".drag-cursor");
    hanger.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      dragging = true; moved = 0; lastPX = e.clientX; lastT = performance.now(); relV = 0;
      hanger.classList.add("dragging");
      if (dc) dc.classList.add("down");
    });
    window.addEventListener("pointermove", function (e) {
      if (dc && hovering) { dc.style.left = e.clientX + "px"; dc.style.top = e.clientY + "px"; }
      if (!dragging) return;
      var dx = e.clientX - lastPX, now = performance.now();
      if (e.pointerType !== "mouse" && Math.abs(dx) < 1) return;
      moved += Math.abs(dx);
      target += dx * 1.15;
      relV = dx / Math.max(1, now - lastT) * 16;
      lastPX = e.clientX; lastT = now;
    }, { passive: true });
    var endDrag = function () {
      if (!dragging) return;
      dragging = false; hanger.classList.remove("dragging");
      if (dc) dc.classList.remove("down");
      target += relV * 14;
    };
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    hanger.addEventListener("click", function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    hanger.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { hovering = true; if (dc) { dc.style.left = e.clientX + "px"; dc.style.top = e.clientY + "px"; dc.classList.add("on"); } } });
    hanger.addEventListener("pointerleave", function () { hovering = false; if (dc) dc.classList.remove("on"); });
    hanger.addEventListener("pointerover", function (e) { if (dc) dc.textContent = e.target.closest("[data-lightbox]") ? "View" : e.target.closest("a.h-card") ? "Open" : "Drag"; });
    hanger.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); target -= e.deltaX; }
    }, { passive: false });
    hanger.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { target -= step; e.preventDefault(); }
      if (e.key === "ArrowLeft") { target += step; e.preventDefault(); }
    });
    $$("[data-hn]").forEach(function (b) { b.addEventListener("click", function () { target -= step * parseFloat(b.getAttribute("data-hn")); }); });

    // Vertical page scroll nudges the line: down → left, up → right
    var lastY = window.scrollY;
    hangerScroll = function (y) {
      var dy = y - lastY; lastY = y;
      if (visible && !dragging && Math.abs(dy) < 300) target -= dy * .55;
    };

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        en.forEach(function (e) { visible = e.isIntersecting; if (visible) hanger.classList.add("in"); });
      }, { threshold: 0.12 }).observe(hanger);
    } else { visible = true; hanger.classList.add("in"); }

    var count = $("[data-hc]"), bar = $(".hanger-progress i"), lastIdx = -1;
    hangerTick = function () {
      if (!visible && !dragging) return;
      if (!dragging && !hovering && !reduce) target -= .45;
      x += (target - x) * (dragging ? .3 : .075);
      if (x > -setW * .5) { x -= setW; target -= setW; }
      if (x < -setW * 1.5) { x += setW; target += setW; }
      vel = x - prevX; prevX = x;
      track.style.transform = "translate3d(" + x.toFixed(2) + "px,0,0)";
      var force = clamp(vel * .9, -18, 18);
      for (var i = 0; i < cards.length; i++) {
        var c = cards[i];
        c.v += (force * c.k - c.a) * .07;
        c.v *= .88;
        c.a += c.v;
        if (Math.abs(c.a) < .01 && Math.abs(c.v) < .01) { if (c.z) continue; c.z = 1; } else c.z = 0;
        c.swing.style.transform = "rotate(" + c.a.toFixed(2) + "deg)";
      }
      var pos = ((-x - setW) % setW + setW) % setW;
      var idx = Math.round(pos / step) % N;
      if (idx !== lastIdx) {
        lastIdx = idx;
        if (count) count.textContent = String(idx + 1).padStart(2, "0");
      }
      if (bar) bar.style.transform = "translateX(" + (pos / setW * 455).toFixed(1) + "%)";
    };
  }

  /* ======================================================================
     3. SERVICES DIAL
     ====================================================================== */
  var dial = $(".dial");
  if (dial) {
    var segWrap = $("[data-segs]", dial);
    var core = $("[data-core]", dial);
    var timer = $(".timer", dial);
    var TC = 2 * Math.PI * 160;
    timer.style.strokeDasharray = TC;
    timer.style.strokeDashoffset = TC;
    var cx = 250, cy = 250, R = 246, r0 = 172, gap = 2.2;
    var NS = "http://www.w3.org/2000/svg";
    var catsD = D.categories || [];
    var pt = function (a, rad) { var t = a * Math.PI / 180; return [cx + rad * Math.cos(t), cy + rad * Math.sin(t)]; };
    var segs = catsD.map(function (c, i) {
      var a0 = -90 + i * 90 + gap, a1 = -90 + (i + 1) * 90 - gap, mid = (a0 + a1) / 2;
      var p1 = pt(a0, R), p2 = pt(a1, R), p3 = pt(a1, r0), p4 = pt(a0, r0);
      var d = "M" + p1 + "A" + R + " " + R + " 0 0 1 " + p2 + "L" + p3 + "A" + r0 + " " + r0 + " 0 0 0 " + p4 + "Z";
      var bottom = mid > 0 && mid < 180;
      var rm = bottom ? 214 : 202;
      var s1 = pt(a0 + 4, rm), s2 = pt(a1 - 4, rm);
      var tp = bottom ? "M" + s2 + "A" + rm + " " + rm + " 0 0 0 " + s1 : "M" + s1 + "A" + rm + " " + rm + " 0 0 1 " + s2;
      var np = pt(mid, bottom ? 186 : 229);
      var g = document.createElementNS(NS, "g");
      g.setAttribute("class", "seg"); g.setAttribute("tabindex", "0"); g.setAttribute("role", "button");
      g.setAttribute("aria-label", c.label);
      g.innerHTML = '<g class="mv"><path class="shape" d="' + d + '"/><path id="sp' + i + '" d="' + tp + '" fill="none"/>' +
        '<text class="lbl"><textPath href="#sp' + i + '" startOffset="50%" text-anchor="middle">' + c.label + "</textPath></text>" +
        '<text class="no" x="' + np[0].toFixed(1) + '" y="' + (np[1] + 3).toFixed(1) + '" text-anchor="middle">0' + (i + 1) + "</text></g>";
      segWrap.appendChild(g);
      return { g: g, mv: g.querySelector(".mv"), mid: mid, id: c.id };
    });
    var active = -1, slideT = null, slideI = 0, timerAnim = null;
    function sketchSVG(k) { return '<svg viewBox="0 0 100 100" aria-hidden="true">' + ((window.__glyph || {})[k] || "") + "</svg>"; }
    function runTimer() {
      if (timerAnim) timerAnim.cancel();
      if (timer.animate && !reduce) timerAnim = timer.animate([{ strokeDashoffset: TC }, { strokeDashoffset: 0 }], { duration: 7500, easing: "linear", fill: "forwards" });
    }
    function showSlide(n) {
      var slides = $$(".core-slide", core);
      if (!slides.length) return;
      slideI = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("on", k === slideI); });
      var cap = $(".core-cap", core); if (cap) cap.textContent = slides[slideI].getAttribute("data-cap");
      runTimer();
      clearTimeout(slideT);
      slideT = setTimeout(function () { showSlide(slideI + 1); }, 7500);
    }
    function activate(i) {
      if (i === active) return;
      active = i;
      segs.forEach(function (s, k) {
        s.g.classList.toggle("active", k === i);
        var t = s.mid * Math.PI / 180, o = k === i ? 10 : 0;
        s.mv.style.transform = "translate(" + (Math.cos(t) * o).toFixed(1) + "px," + (Math.sin(t) * o).toFixed(1) + "px)";
      });
      var id = segs[i].id;
      $$("[data-panel]").forEach(function (p) { p.classList.toggle("on", p.getAttribute("data-panel") === id); });
      $$("[data-tab]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-tab") === id); });
      var list = (D.showcase || {})[id] || [];
      core.innerHTML = list.map(function (s) {
        if (s.img) return '<div class="core-slide" data-cap="' + s.cap + '"><img src="' + s.img + '" alt=""' + (s.contain ? ' class="contain"' : "") + "></div>";
        return '<div class="core-slide sk" data-cap="' + s.cap + '">' + sketchSVG(s.sketch).replace(/class="m/g, 'class="m') + "</div>";
      }).join("") + '<span class="core-cap"></span>';
      requestAnimationFrame(function () { showSlide(0); });
    }
    segs.forEach(function (s, i) {
      s.g.addEventListener("mouseenter", function () { if (fine) activate(i); });
      s.g.addEventListener("click", function () { activate(i); });
      s.g.addEventListener("focus", function () { activate(i); });
      s.g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(i); } });
    });
    $$("[data-tab]").forEach(function (b) {
      b.addEventListener("click", function () { activate(segs.map(function (s) { return s.id; }).indexOf(b.getAttribute("data-tab"))); });
    });
    activate(0);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en, o) { en.forEach(function (e) { if (e.isIntersecting) { dial.classList.add("in"); o.disconnect(); } }); }, { threshold: .25 }).observe(dial);
    } else dial.classList.add("in");
  }

  /* ======================================================================
     4. PROCESS — artboard scrubbed by scroll
     ====================================================================== */
  var proc = $(".proc-pin");
  var procUpdate = function () {};
  if (proc) {
    var odo = $(".odo-inner", proc), copies = $$(".proc-copy > div", proc), rails = $$(".proc-rail i", proc);
    var scenes = $$(".scene", proc), abStep = $("[data-ab-step]", proc);
    var names = ["01 Brief", "02 Concept", "03 Refine", "04 Deliver"];
    var bubs = $$("[data-b]", scenes[0]);
    var sketch = $$(".sd", scenes[1]).map(function (p) { var l = 600; try { l = Math.ceil(p.getTotalLength()) + 2; } catch (e) {} p.style.strokeDasharray = l; p.style.strokeDashoffset = l; return { p: p, l: l }; });
    var anchors = $(".anchors", scenes[2]), bbox = $(".bbox", scenes[2]), sw = $$(".swatch", scenes[2]), arrow = $(".cursor-arrow", scenes[2]);
    var vecs = $$(".vec-fill, .vec-red", scenes[2]);
    var path = [[150, 330], [156, 160], [226, 232], [296, 160], [226, 102], [400, 130], [330, 360]];
    var dvs = $$("[data-d]", scenes[3]);
    var curStep = -1;
    procUpdate = function () {
      var p = reduce ? .999 : pinProgress(proc);
      var st = Math.min(3, Math.floor(p * 4)), lp = clamp(p * 4 - st);
      if (st !== curStep) {
        curStep = st;
        odo.style.transform = "translateY(" + (-st) + "em)";
        copies.forEach(function (c, i) { c.classList.toggle("on", i === st); });
        scenes.forEach(function (s, i) { s.classList.toggle("on", i === st); });
        if (abStep) abStep.textContent = names[st];
      }
      rails.forEach(function (r, i) { r.style.setProperty("--s", i < st ? 1 : i === st ? lp.toFixed(3) : 0); });
      if (st === 0) bubs.forEach(function (b) {
        var at = parseFloat(b.getAttribute("data-b"));
        if (b.classList.contains("typing")) b.classList.toggle("show", lp >= at && lp < .72);
        else b.classList.toggle("show", lp >= at);
      });
      if (st === 1) sketch.forEach(function (s, i) { s.p.style.strokeDashoffset = (s.l * (1 - clamp(lp * 1.5 - i * .09))).toFixed(1); });
      if (st === 2) {
        vecs.forEach(function (v) { v.style.opacity = clamp(lp * 4); });
        anchors.style.opacity = clamp((lp - .1) * 4);
        bbox.style.opacity = clamp((lp - .05) * 4);
        sw.forEach(function (s, i) { var t = easeOut(clamp((lp - .3 - i * .1) * 3)); s.style.transform = "translateX(" + ((1 - t) * 90).toFixed(1) + "px)"; s.style.opacity = t; });
        var seg = lp * (path.length - 1), k = Math.min(path.length - 2, Math.floor(seg)), f = easeInOut(seg - k);
        var ax = lerp(path[k][0], path[k + 1][0], f), ay = lerp(path[k][1], path[k + 1][1], f);
        arrow.setAttribute("transform", "translate(" + ax.toFixed(1) + " " + ay.toFixed(1) + ")");
      }
      if (st === 3) dvs.forEach(function (d) { d.classList.toggle("show", lp >= parseFloat(d.getAttribute("data-d"))); });
    };
  }

  /* ======================================================================
     5. ABOUT — reading reveal + drifting ghost type
     ====================================================================== */
  var statements = $$(".statement");
  var ghost = $(".about-ghost");
  var aboutUpdate = function () {
    statements.forEach(function (st) {
      var r = st.getBoundingClientRect();
      var prog = clamp((vh * .85 - r.top) / (r.height + vh * .35));
      var ws = st.children, lim = Math.round(prog * ws.length);
      for (var k = 0; k < ws.length; k++) ws[k].classList.toggle("on", k < lim);
    });
    if (ghost && inView(ghost.parentNode)) {
      var r2 = ghost.parentNode.getBoundingClientRect();
      ghost.style.setProperty("--sx", ((vh - r2.top) * .35).toFixed(1));
    }
  };

  /* ======================================================================
     6. LET'S TALK — red flood, quick-pick, magnetic buttons
     ====================================================================== */
  var talk = $(".talk-pin");
  var talkUpdate = function () {};
  if (talk) {
    var tSticky = $(".talk-sticky", talk);
    // Two layers: the real section underneath, a red copy revealed by a growing circle.
    // The copy ignores the pointer; clicks fall through to identical positions below.
    var base = document.createElement("div");
    base.className = "talk-layer talk-base";
    while (tSticky.firstChild) base.appendChild(tSticky.firstChild);
    tSticky.appendChild(base);
    var floodL = base.cloneNode(true);
    floodL.className = "talk-layer talk-flood";
    floodL.setAttribute("aria-hidden", "true");
    floodL.setAttribute("inert", "");
    $$("[id]", floodL).forEach(function (el) { el.id += "-f"; });
    $$("textPath", floodL).forEach(function (tp) { tp.setAttribute("href", tp.getAttribute("href") + "-f"); });
    tSticky.appendChild(floodL);
    // mirror hover + transforms from the real layer onto the copy
    var srcEls = $$("a, button, .magnet", base), dstEls = $$("a, button, .magnet", floodL);
    srcEls.forEach(function (el, i) {
      var twin = dstEls[i];
      el.addEventListener("pointerenter", function () { twin.classList.add("is-hover"); });
      el.addEventListener("pointerleave", function () { twin.classList.remove("is-hover"); twin.style.transform = ""; });
      el.__twin = twin;
    });
    talkUpdate = function () {
      if (!inView(talk, 200)) return;
      var p = reduce ? 1 : pinProgress(talk);
      var fl = easeInOut(clamp(p * 1.7));
      tSticky.style.setProperty("--fl", fl.toFixed(4));
      tSticky.style.setProperty("--tx", (p * 30).toFixed(2));
    };
    var waBtn = $("[data-talk-wa]", base), choice = "";
    var setWA = function () {
      var msg = "Hi Mr Mpyana, I'd like to start a logo project." + (choice ? " I'm interested in a " + choice + "." : "");
      if (waBtn) { waBtn.href = "https://wa.me/" + (C.whatsapp || "") + "?text=" + encodeURIComponent(msg); waBtn.target = "_blank"; waBtn.rel = "noopener"; }
    };
    setWA();
    $$("[data-q]", base).forEach(function (b) {
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-pressed") !== "true";
        $$("[data-q]", talk).forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", on);
        b.__twin.setAttribute("aria-pressed", on);
        choice = on ? b.getAttribute("data-q") : "";
        setWA();
      });
    });
  }
  if (fine && !reduce) {
    $$(".magnet").forEach(function (m) {
      m.addEventListener("pointermove", function (e) {
        var r = m.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        m.style.transform = "translate(" + (dx * .25).toFixed(1) + "px," + (dy * .35).toFixed(1) + "px)";
        if (m.__twin) m.__twin.style.transform = m.style.transform;
      });
      m.addEventListener("pointerleave", function () { m.style.transform = ""; if (m.__twin) m.__twin.style.transform = ""; });
    });
  }

  /* ======================================================================
     7. FOOTER — spotlight that follows the cursor over the brand name
     ====================================================================== */
  $$(".foot-brand").forEach(function (fb) {
    fb.addEventListener("pointermove", function (e) {
      var r = fb.getBoundingClientRect();
      fb.style.setProperty("--mx", (e.clientX - r.left) + "px");
      fb.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
  $$('a[href="#main"]').forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); if (lenis) lenis.scrollTo(0, { duration: 1.6 }); else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
  });

  /* ======================================================================
     Main loop
     ====================================================================== */
  var lastScroll = -1;
  function frame(t) {
    if (lenis) lenis.raf(t);
    var y = window.scrollY;
    if (y !== lastScroll) {
      lastScroll = y;
      heroUpdate(); procUpdate(); aboutUpdate(); talkUpdate(); hangerScroll(y);
    }
    hangerTick();
    requestAnimationFrame(frame);
  }
  heroUpdate(); procUpdate(); aboutUpdate(); talkUpdate();
  window.addEventListener("resize", function () { lastScroll = -1; });
  requestAnimationFrame(frame);
})();
