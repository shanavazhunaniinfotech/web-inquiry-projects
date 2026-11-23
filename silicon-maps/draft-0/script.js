/* Silicon Maps: home page concept interactions */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var hasGsap = typeof window.gsap !== "undefined";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var money = function (n) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); };
  var money2 = function (n) { return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); };

  /* ---------------- Data (from siliconmaps.com) ---------------- */
  var REGIONS = [
    { id: "silicon-valley", name: "Silicon Valley", cat: "tech", place: "Northern California", lat: 37.37, lon: -121.95, img: "p-silicon-valley.jpg", desc: "The flagship map since 1989. 200+ innovators, from first-product startups to Fortune 100 multinationals. Also shown on backlit displays at SFO and SJC airports.", flagship: true },
    { id: "silicon-hills", name: "Silicon Hills", cat: "tech", place: "Austin, Texas", lat: 30.27, lon: -97.74, img: "p-silicon-hills.jpg", desc: "Austin's fast-growing tech corridor of chipmakers, software companies and startups." },
    { id: "silicon-forest", name: "Silicon Forest", cat: "tech", place: "Portland, Oregon", lat: 45.52, lon: -122.68, img: "p-silicon-forest.jpg", desc: "Oregon's high-tech hub, with a map on display at Portland International Airport." },
    { id: "silicon-desert", name: "Silicon Desert", cat: "tech", place: "Phoenix, Arizona", lat: 33.45, lon: -112.07, img: "p-silicon-desert.jpg", desc: "Arizona's semiconductor and advanced-manufacturing powerhouse." },
    { id: "dfw", name: "DFW Technoplex", cat: "tech", place: "Dallas–Fort Worth, Texas", lat: 32.82, lon: -96.95, img: "p-dfw.jpg", desc: "The tech, telecom and corporate HQ cluster of North Texas." },
    { id: "lone-star", name: "Lone Star Tech", cat: "tech", place: "Texas", lat: 29.76, lon: -95.37, img: "poster-soon.svg", desc: "Texas technology innovators on one statewide map.", noProduct: true },
    { id: "east-coast-tech", name: "East Coast Tech", cat: "tech", place: "Boston & the Northeast", lat: 42.36, lon: -71.06, img: "p-east-coast-tech.jpg", desc: "Technology leaders along the Eastern Seaboard." },
    { id: "tech-coast", name: "Tech Coast", cat: "tech", place: "Southern California", lat: 33.9, lon: -118.2, img: "p-tech-coast.jpg", desc: "Southern California's aerospace, defense, med-tech and software economy." },
    { id: "ny-photonics", name: "New York Photonics", cat: "tech", place: "Rochester, New York", lat: 43.16, lon: -77.61, img: "poster-soon.svg", desc: "The optics, photonics and imaging cluster of upstate New York.", noProduct: true },
    { id: "tech-triangle", name: "Tech Triangle", cat: "tech", place: "Raleigh–Durham, NC", lat: 35.78, lon: -78.64, img: "p-tech-triangle.jpg", desc: "Research Triangle Park and North Carolina's tech ecosystem." },
    { id: "south-florida", name: "South Florida Tech Gateway", cat: "tech", place: "Miami, Florida", lat: 25.76, lon: -80.19, img: "poster-soon.svg", desc: "South Florida's growing tech and Latin America gateway.", noProduct: true },
    { id: "bioscience-west", name: "Bioscience West", cat: "bio", place: "California", lat: 32.88, lon: -117.22, img: "p-bioscience-west.jpg", desc: "Biotech, pharma and med-device leaders of the West Coast." },
    { id: "bioscience-east", name: "Bioscience East", cat: "bio", place: "New Jersey & the Northeast", lat: 40.35, lon: -74.66, img: "p-bioscience-east.jpg", desc: "The East Coast's life-science corridor." },
    { id: "bio-midwest", name: "Bioscience Midwest", cat: "bio", place: "Chicago & the Midwest", lat: 41.88, lon: -87.63, img: "p-bio-midwest.jpg", desc: "The Midwest's bioscience, ag-bio and medical innovators." },
    { id: "bio-triangle", name: "BIO Triangle", cat: "bio", place: "Research Triangle, NC", lat: 35.99, lon: -78.9, img: "p-bio-triangle.jpg", desc: "North Carolina's world-class life-science cluster." },
    { id: "silicon-europe", name: "Silicon Europe", cat: "tech", place: "Europe", lat: 50.85, lon: 4.35, img: "p-silicon-europe.jpg", desc: "Europe's leading technology regions on one map.", intl: true },
    { id: "malaga", name: "Málaga", cat: "tech", place: "Málaga, Spain", lat: 36.72, lon: -4.42, img: "poster-soon.svg", desc: "Southern Europe's emerging tech hub on the Costa del Sol.", intl: true, noProduct: true },
    { id: "bio-europe", name: "BIO Europe", cat: "bio", place: "Europe", lat: 47.5, lon: 8.5, img: "p-bio-europe.jpg", desc: "Europe's biotech and pharma leaders.", intl: true },
    { id: "techno-tokyo", name: "Techno Tokyo", cat: "tech", place: "Tokyo, Japan", lat: 35.68, lon: 139.69, img: "p-techno-tokyo.jpg", desc: "Japan's technology capital and its global brands.", intl: true },
    { id: "silicon-world", name: "Silicon World", cat: "tech", place: "Global", img: "p-silicon-world.jpg", desc: "The world's technology hubs on one global map.", intl: true, global: true },
    { id: "global-bio", name: "Global BIO", cat: "bio", place: "Global", img: "p-global-bio.jpg", desc: "Global life-science hubs on one world map.", intl: true, global: true }
  ];
  var byId = {}; REGIONS.forEach(function (r) { byId[r.id] = r; });

  var PRODUCTS = REGIONS.filter(function (r) { return !r.noProduct; }).map(function (r) {
    return { sku: r.id, name: r.name + " 2026", cat: r.cat, label: (r.cat === "bio" ? "Life Science" : "High Tech") + " poster", price: 25, img: r.img };
  });
  PRODUCTS.splice(1, 0, { sku: "sv-puzzle", name: "Silicon Valley 150-piece Puzzle", cat: "gift", label: "Gift · 11\" × 17\"", price: 29, img: "p-puzzle.jpg" });
  PRODUCTS.splice(2, 0, { sku: "sv-mousepad", name: "Silicon Valley Mouse Pad", cat: "gift", label: "Gift", price: 16, img: "p-silicon-valley.jpg" });
  var prodBySku = {}; PRODUCTS.forEach(function (p) { prodBySku[p.sku] = p; });

  /* ---------------- Toast ---------------- */
  var toastT;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* ---------------- Nav ---------------- */
  var nav = $("#nav");
  window.addEventListener("scroll", function () { nav.classList.toggle("is-scrolled", window.scrollY > 10); }, { passive: true });
  var megaBtn = $(".mega__btn"), megaPanel = $("#mega-panel");
  function setMega(open) { megaBtn.setAttribute("aria-expanded", open); megaPanel.classList.toggle("open", open); }
  megaBtn.addEventListener("click", function (e) { e.stopPropagation(); setMega(megaBtn.getAttribute("aria-expanded") !== "true"); });
  document.addEventListener("click", function (e) { if (!e.target.closest(".mega")) setMega(false); });
  megaPanel.addEventListener("click", function (e) { if (e.target.closest("a")) setMega(false); });
  var burger = $("#burger"), mmenu = $("#mmenu");
  function setMenu(open) { burger.setAttribute("aria-expanded", open); mmenu.hidden = !open; document.body.style.overflow = open ? "hidden" : ""; }
  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  mmenu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setMega(false); setMenu(false); closeDrawer(); closeModal(); } });

  /* ---------------- Hero lens (magnifier) ---------------- */
  var poster = $("#heroPoster"), lens = $("#lens"), pImg = poster.querySelector("img");
  var fullLoaded = false, ZOOM = 3.2;
  function loadFull() {
    if (fullLoaded) return; fullLoaded = true;
    lens.style.backgroundImage = "url('" + pImg.getAttribute("src") + "')";
    var hi = new Image(); hi.onload = function () { lens.style.backgroundImage = "url('" + hi.src + "')"; }; hi.src = pImg.dataset.full;
  }
  if (window.matchMedia("(hover: hover)").matches) {
    poster.addEventListener("mouseenter", function () { loadFull(); poster.classList.add("zooming"); });
    poster.addEventListener("mouseleave", function () {
      poster.classList.remove("zooming");
      if (hasGsap) gsap.to(poster, { rotateY: 0, rotateX: 0, duration: .6, ease: "power3.out" });
    });
    poster.addEventListener("mousemove", function (e) {
      var r = pImg.getBoundingClientRect(), pr = poster.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      var lw = lens.offsetWidth / 2;
      lens.style.left = (e.clientX - pr.left - lw) + "px";
      lens.style.top = (e.clientY - pr.top - lw) + "px";
      lens.style.backgroundSize = (r.width * ZOOM) + "px " + (r.height * ZOOM) + "px";
      lens.style.backgroundPosition = (-x * ZOOM + lw) + "px " + (-y * ZOOM + lw) + "px";
      if (hasGsap && !reduce) gsap.to(poster, { rotateY: (x / r.width - .5) * 8, rotateX: -(y / r.height - .5) * 6, duration: .6, ease: "power2.out" });
    });
  }

  /* ---------------- GSAP: intro, reveals, counters ---------------- */
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (hasGsap && !reduce) {
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero__title .line > span", { yPercent: 110, duration: 1.1, stagger: .12 })
      .from(".hero .eyebrow, .hero__sub, .hero__ctas, .hero__trust", { y: 24, opacity: 0, duration: .9, stagger: .08 }, "-=.8")
      .from(".poster", { rotateY: -28, rotateX: 8, y: 60, opacity: 0, duration: 1.4 }, "-=1.2")
      .from(".poster__tag", { scale: 0, rotate: -20, duration: .6, ease: "back.out(2)" }, "-=.6")
      .from(".hero__chip", { y: 20, opacity: 0, scale: .9, duration: .7, stagger: .15, ease: "back.out(1.6)" }, "-=.5");
    gsap.to(".hero__chip--a", { y: -10, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
    gsap.to(".hero__chip--b", { y: 10, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
    gsap.to(".hero__contours", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    ScrollTrigger.batch(".reveal", {
      start: "top 88%",
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: .9, stagger: .1, ease: "power3.out", overwrite: true }); }
    });

    $$("[data-count]").forEach(function (el) {
      var end = +el.dataset.count, plain = el.dataset.plain, obj = { v: plain ? end - 40 : 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: function () {
          gsap.to(obj, { v: end, duration: 1.8, ease: "power2.out", onUpdate: function () { el.textContent = plain ? Math.round(obj.v) : Math.round(obj.v).toLocaleString("en-US"); } });
        }
      });
    });

    gsap.from(".step__n", { scale: 0, duration: .6, stagger: .15, ease: "back.out(2)", scrollTrigger: { trigger: ".steps", start: "top 80%" } });
    var route = $("#routePath");
    if (route) gsap.fromTo(route, { strokeDashoffset: 400 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".steps", start: "top 85%", end: "bottom 40%", scrub: true } });

    // Magnetic primary CTA
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("mousemove", function (e) { var r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .2, y: (e.clientY - r.top - r.height / 2) * .3, duration: .4 }); });
      b.addEventListener("mouseleave", function () { gsap.to(b, { x: 0, y: 0, duration: .6, ease: "elastic.out(1,.4)" }); });
    });
  } else {
    $$(".reveal").forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
  }

  /* ---------------- Anatomy (scroll-driven zoom) ---------------- */
  var aFrame = $("#anatomyFrame"), aImg = $("#anatomyImg"), aLabel = $("#anatomyLabel"), aSteps = $$(".astep");
  var LABELS = ["Map overview", "Your logo among the leaders", "Custom imprint, 3\" × 12\"", "Year-at-a-glance calendar", "Linked online & QR to interactive map"];
  var current = -1;
  function zoomTo(i, instant) {
    if (i === current && !instant) return; current = i;
    aSteps.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
    var s = aSteps[i], sc = +s.dataset.zoom, ox = +s.dataset.ox / 100, oy = +s.dataset.oy / 100;
    var fw = aFrame.clientWidth, fh = aFrame.clientHeight, iw = aImg.offsetWidth, ih = aImg.offsetHeight || iw * 1.45;
    var x = fw / 2 - sc * ox * iw, y = fh / 2 - sc * oy * ih;
    x = Math.min(0, Math.max(fw - sc * iw, x)); y = Math.min(0, Math.max(fh - sc * ih, y));
    aLabel.innerHTML = '<span class="mono">0' + (i + 1) + "</span> " + LABELS[i];
    if (hasGsap && !instant && !reduce) gsap.to(aImg, { x: x, y: y, scale: sc, transformOrigin: "0 0", duration: 1.1, ease: "power3.inOut", overwrite: true });
    else { aImg.style.transformOrigin = "0 0"; aImg.style.transform = "translate(" + x + "px," + y + "px) scale(" + sc + ")"; }
  }
  aSteps.forEach(function (s, i) {
    s.addEventListener("click", function () { zoomTo(i); });
    if (hasGsap && window.ScrollTrigger) ScrollTrigger.create({ trigger: s, start: "top 60%", end: "bottom 60%", onToggle: function (st) { if (st.isActive) zoomTo(i); } });
  });
  function initZoom() { var c = current < 0 ? 0 : current; current = -1; zoomTo(c, true); }
  if (aImg.complete) initZoom(); else aImg.addEventListener("load", initZoom);
  window.addEventListener("resize", debounce(initZoom, 200));

  /* ---------------- Explorer ---------------- */
  var view = "us", cat = "all", selected = "silicon-valley";
  var svg = $("#geo"), chipsEl = $("#regionChips");
  REGIONS.forEach(function (r) {
    var b = document.createElement("button");
    b.className = "chip " + r.cat; b.type = "button"; b.textContent = r.name; b.dataset.id = r.id;
    b.addEventListener("click", function () { selectRegion(r.id, true); });
    chipsEl.appendChild(b);
  });
  var geoCache = {};
  function drawMap() {
    if (typeof d3 === "undefined" || typeof topojson === "undefined") { $("#mapLoading").textContent = "Pick a region below."; return; }
    var url = view === "us" ? "https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-albers-10m.json" : "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";
    $("#mapLoading").style.display = "grid";
    var p = geoCache[url] ? Promise.resolve(geoCache[url]) : d3.json(url).then(function (j) { geoCache[url] = j; return j; });
    p.then(function (topo) {
      $("#mapLoading").style.display = "none";
      var s = d3.select(svg); s.selectAll("*").remove();
      var proj, path;
      if (view === "us") {
        proj = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);
        path = d3.geoPath();
        var states = topojson.feature(topo, topo.objects.states).features;
        var hi = ["California", "Texas", "Oregon", "Arizona", "Massachusetts", "New York", "North Carolina", "New Jersey", "Illinois", "Florida"];
        s.append("g").selectAll("path").data(states).join("path").attr("class", function (d) { return "land" + (hi.indexOf(d.properties.name) > -1 ? " land--hi" : ""); }).attr("d", path);
      } else {
        var land = topojson.feature(topo, topo.objects.countries);
        proj = d3.geoNaturalEarth1().fitExtent([[10, 10], [965, 600]], { type: "Sphere" });
        path = d3.geoPath(proj);
        s.append("path").attr("class", "graticule").attr("d", path(d3.geoGraticule10()));
        s.append("g").selectAll("path").data(land.features).join("path").attr("class", "land").attr("d", path);
      }
      var pins = s.append("g");
      REGIONS.forEach(function (r) {
        if (r.global || r.lat == null) return;
        if (view === "us" && r.intl) return;
        var xy = proj([r.lon, r.lat]); if (!xy) return;
        var g = pins.append("g").attr("class", "rpin " + r.cat).attr("data-id", r.id).attr("tabindex", 0).attr("role", "button").attr("aria-label", r.name).attr("transform", "translate(" + xy[0] + "," + xy[1] + ")");
        g.append("circle").attr("class", "rpin__halo").attr("r", 9);
        g.append("circle").attr("class", "rpin__dot").attr("r", view === "us" ? 8 : 6);
        var right = xy[0] > 760;
        g.append("text").attr("x", right ? -14 : 14).attr("y", 4).attr("text-anchor", right ? "end" : "start").text(r.name);
        g.on("click", function () { selectRegion(r.id); });
        g.on("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectRegion(r.id); } });
      });
      applyFilter(); markActive();
      if (hasGsap && !reduce) gsap.from(svg.querySelectorAll(".rpin"), { scale: 0, transformOrigin: "center", opacity: 0, duration: .5, stagger: .03, ease: "back.out(2)" });
    }).catch(function () { $("#mapLoading").textContent = "Map couldn't load. Pick a region below."; });
  }
  function applyFilter() {
    $$(".rpin", svg).forEach(function (g) { var r = byId[g.getAttribute("data-id")]; g.classList.toggle("dim", cat !== "all" && r.cat !== cat); });
    $$(".chip", chipsEl).forEach(function (c) { var r = byId[c.dataset.id]; c.classList.toggle("dim", cat !== "all" && r.cat !== cat); });
  }
  function markActive() {
    $$(".rpin", svg).forEach(function (g) { g.classList.toggle("active", g.getAttribute("data-id") === selected); });
    $$(".chip", chipsEl).forEach(function (c) { c.classList.toggle("active", c.dataset.id === selected); });
  }
  function selectRegion(id, fromChip) {
    var r = byId[id]; if (!r) return; selected = id;
    if (r.intl && view === "us" && fromChip !== "nomap") { setView("world"); }
    var panel = $("#rpanel");
    var update = function () {
      $("#rpImg").src = "../images/" + r.img; $("#rpImg").alt = r.name + " map poster";
      $("#rpCat").textContent = (r.cat === "bio" ? "LIFE SCIENCE" : "HIGH TECH") + " · " + r.place.toUpperCase();
      $("#rpName").textContent = r.name; $("#rpDesc").textContent = r.desc;
      $("#rpFacts").innerHTML = "<li><b>2027</b> booking now</li>" + (r.noProduct ? "<li><b>Ask</b> for print availability</li>" : "<li><b>$25</b> 2026 poster</li>");
      var buy = $("#rpBuy"); buy.dataset.sku = r.id; buy.hidden = !!r.noProduct;
    };
    if (hasGsap && !reduce) gsap.timeline().to(panel, { opacity: 0, y: 8, duration: .18, onComplete: update }).to(panel, { opacity: 1, y: 0, duration: .35, ease: "power2.out" });
    else update();
    var sel = $("#pkRegion"); if (sel) sel.value = id;
    var lr = $("#leadRegion"); if (lr) lr.value = id;
    updateBuilder(); markActive();
  }
  function setView(v) {
    if (v === view) return; view = v;
    $$("[data-view]").forEach(function (b) { b.setAttribute("aria-selected", b.dataset.view === v); });
    drawMap();
  }
  $$("[data-view]").forEach(function (b) { b.addEventListener("click", function () { setView(b.dataset.view); }); });
  $$("[data-cat]").forEach(function (b) {
    b.addEventListener("click", function () {
      cat = b.dataset.cat; $$("[data-cat]").forEach(function (x) { x.setAttribute("aria-selected", x === b); }); applyFilter();
    });
  });
  $("#rpBuy").addEventListener("click", function () { addToCart(this.dataset.sku); });
  $("#rpAdvertise").addEventListener("click", function () { var s = $("#pkRegion"); if (s) s.value = selected; updateBuilder(); });
  // Lazy-draw the map when near viewport
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { drawMap(); io.disconnect(); } }, { rootMargin: "400px" });
    io.observe($("#explore"));
  } else drawMap();
  $$("[data-region]").forEach(function (a) { a.addEventListener("click", function () { selectRegion(a.dataset.region, true); }); });

  /* ---------------- Package builder ---------------- */
  var pkRegion = $("#pkRegion"), leadRegion = $("#leadRegion");
  function fillSelect(sel) {
    [["High Tech", "tech", false], ["Life Science", "bio", false], ["International", null, true]].forEach(function (grp) {
      var og = document.createElement("optgroup"); og.label = grp[0];
      REGIONS.filter(function (r) { return grp[2] ? r.intl : (!r.intl && r.cat === grp[1]); }).forEach(function (r) {
        var o = document.createElement("option"); o.value = r.id; o.textContent = r.name; og.appendChild(o);
      });
      sel.appendChild(og);
    });
    sel.value = "silicon-valley";
  }
  fillSelect(pkRegion); fillSelect(leadRegion);
  var addMaps = $("#adMaps");
  function state() {
    var t = $("input[name=tier]:checked");
    var total = +t.dataset.price;
    $$(".builder__addons input[type=checkbox]").forEach(function (c) { if (c.checked && !c.disabled) total += +c.dataset.price; });
    return { region: byId[pkRegion.value], tier: t.dataset.name, tierVal: t.value, total: total };
  }
  function updateBuilder() {
    var t = $("input[name=tier]:checked"); if (!t) return;
    var isBasic = t.value === "basic";
    addMaps.disabled = isBasic; if (isBasic) addMaps.checked = false;
    addMaps.closest(".addon").classList.toggle("disabled", isBasic);
    $$(".tier").forEach(function (l) { var i = l.querySelector("input"); l.querySelector(".tier__pick").textContent = i.checked ? "Selected" : "Select"; });
    var s = state();
    $("#sumRegion").textContent = s.region.name; $("#sumTier").textContent = s.tier;
    var totEl = $("#sumTotal"), prev = +(totEl.dataset.v || s.total);
    totEl.dataset.v = s.total;
    if (hasGsap && !reduce && prev !== s.total) {
      var o = { v: prev }; gsap.to(o, { v: s.total, duration: .5, ease: "power2.out", onUpdate: function () { totEl.textContent = money(Math.round(o.v)); } });
    } else totEl.textContent = money(s.total);
    $("#sumDay").textContent = money2(s.total / 365);
  }
  $$("input[name=tier], .builder__addons input").forEach(function (i) { i.addEventListener("change", updateBuilder); });
  pkRegion.addEventListener("change", function () { selected = pkRegion.value; updateBuilder(); });
  updateBuilder();

  /* ---------------- Modal ---------------- */
  var modal = $("#modal"), lastFocus;
  function openModal() {
    var s = state(); lastFocus = document.activeElement;
    $("#mRegion").textContent = s.region.name; $("#mTier").textContent = s.tier;
    var adds = $$(".builder__addons input:checked").map(function (c) { return c.closest(".addon").querySelector("b").textContent; });
    $("#mSum").textContent = money(s.total) + " first year" + (adds.length ? " · incl. " + adds.join(", ") : "");
    $(".modal__form").hidden = false; $(".modal__ok").hidden = true;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
    setTimeout(function () { $("#reserveForm input").focus(); }, 100);
  }
  function closeModal() {
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  $("#reserveBtn").addEventListener("click", openModal);
  $$("[data-mclose]").forEach(function (b) { b.addEventListener("click", closeModal); });
  function validate(form) {
    var ok = true;
    $$("input[required]", form).forEach(function (i) {
      var bad = !i.value.trim() || (i.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value));
      i.classList.toggle("invalid", bad); if (bad && ok) { i.focus(); ok = false; }
    });
    return ok;
  }
  $("#reserveForm").addEventListener("submit", function (e) {
    e.preventDefault(); if (!validate(this)) return;
    $(".modal__form").hidden = true; $(".modal__ok").hidden = false;
    if (hasGsap) gsap.from(".modal__check", { scale: 0, rotate: -90, duration: .6, ease: "back.out(2)" });
  });

  /* ---------------- Lead form ---------------- */
  $$("[data-interest]").forEach(function (a) {
    a.addEventListener("click", function () { var s = $("#leadInterest"); $$("option", s).forEach(function (o) { if (o.textContent === a.dataset.interest) s.value = o.value; }); });
  });
  $("#leadForm").addEventListener("submit", function (e) {
    e.preventDefault(); if (!validate(this)) return;
    $("#okRegion").textContent = byId[leadRegion.value].name;
    var ok = $(".lead-form__ok"); ok.hidden = false;
    if (hasGsap) gsap.from(ok, { opacity: 0, duration: .4 });
  });

  /* ---------------- Store + cart ---------------- */
  var prodWrap = $("#products"), SHOW = 10, expanded = false, filter = "all";
  PRODUCTS.forEach(function (p, i) {
    var el = document.createElement("article");
    el.className = "product"; el.dataset.cat = p.cat; el.dataset.i = i;
    el.innerHTML = '<div class="product__img"><img src="../images/' + p.img + '" alt="' + p.name + '" loading="lazy"></div>' +
      '<span class="product__cat">' + p.label + "</span><h3>" + p.name + "</h3>" +
      '<div class="product__row"><span class="product__price">' + money(p.price) + '</span><button class="product__add" aria-label="Add ' + p.name + ' to cart" data-add="' + p.sku + '">+</button></div>';
    prodWrap.appendChild(el);
  });
  var more = document.createElement("div"); more.className = "shop__more";
  more.innerHTML = '<button class="btn btn--dark" id="showAll">Show all ' + PRODUCTS.length + " products</button>";
  prodWrap.after(more);
  function renderFilter() {
    var shown = 0;
    $$(".product", prodWrap).forEach(function (el) {
      var match = filter === "all" || el.dataset.cat === filter;
      var vis = match && (expanded || filter !== "all" || shown < SHOW);
      el.classList.toggle("hide", !vis); if (vis) shown++;
    });
    more.hidden = expanded || filter !== "all";
  }
  renderFilter();
  $("#showAll").addEventListener("click", function () { expanded = true; renderFilter(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });
  $$("[data-f]").forEach(function (b) { b.addEventListener("click", function () { filter = b.dataset.f; $$("[data-f]").forEach(function (x) { x.setAttribute("aria-selected", x === b); }); renderFilter(); if (window.ScrollTrigger) ScrollTrigger.refresh(); }); });

  var cart = {};
  try { cart = JSON.parse(localStorage.getItem("sm-cart") || "{}") || {}; } catch (e) { cart = {}; }
  function saveCart() { try { localStorage.setItem("sm-cart", JSON.stringify(cart)); } catch (e) {} }
  function renderCart() {
    var items = $("#cartItems"), n = 0, sub = 0; items.innerHTML = "";
    Object.keys(cart).forEach(function (sku) {
      var p = prodBySku[sku]; if (!p || cart[sku] < 1) { delete cart[sku]; return; }
      n += cart[sku]; sub += cart[sku] * p.price;
      var row = document.createElement("div"); row.className = "citem";
      row.innerHTML = '<img src="../images/' + p.img + '" alt=""><div><b>' + p.name + "</b><small>" + money(p.price) + '</small><br><span class="qty"><button data-q="-1" aria-label="Decrease">−</button><span>' + cart[sku] + '</span><button data-q="1" aria-label="Increase">+</button></span></div><b>' + money(cart[sku] * p.price) + "</b>";
      $$("[data-q]", row).forEach(function (b) { b.addEventListener("click", function () { cart[sku] += +b.dataset.q; saveCart(); renderCart(); }); });
      items.appendChild(row);
    });
    if (!n) items.innerHTML = '<p class="drawer__empty">Your cart is empty.<br>Every 2026 map is $25.</p>';
    $("#cartCount").textContent = n; $("#cartBtn").setAttribute("aria-label", "Open cart, " + n + " items");
    $("#cartSub").textContent = money2(sub);
    $("#cartUpsell").hidden = !!cart["sv-puzzle"] || !n;
    $("#checkoutBtn").disabled = !n;
  }
  function addToCart(sku) {
    if (!prodBySku[sku]) return;
    cart[sku] = (cart[sku] || 0) + 1; saveCart(); renderCart();
    var b = $("#cartBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
    toast(prodBySku[sku].name + " added to cart");
  }
  document.addEventListener("click", function (e) { var a = e.target.closest("[data-add]"); if (a) addToCart(a.dataset.add); });
  var drawer = $("#drawer");
  function openDrawer() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; setTimeout(function () { $(".x", drawer).focus(); }, 50); }
  function closeDrawer() { if (!drawer.classList.contains("open")) return; drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  $("#cartBtn").addEventListener("click", openDrawer);
  $$("[data-close]", drawer).forEach(function (b) { b.addEventListener("click", closeDrawer); });
  $("#checkoutBtn").addEventListener("click", function () { toast("Prototype: this goes to the store's secure checkout"); });
  renderCart();

  /* ---------------- Seen rail drag ---------------- */
  var rail = $("#seenRail"), down = false, sx = 0, sl = 0;
  rail.addEventListener("mousedown", function (e) { down = true; sx = e.pageX; sl = rail.scrollLeft; rail.classList.add("dragging"); });
  window.addEventListener("mouseup", function () { down = false; rail.classList.remove("dragging"); });
  rail.addEventListener("mousemove", function (e) { if (!down) return; e.preventDefault(); rail.scrollLeft = sl - (e.pageX - sx); });

  /* ---------------- Sticky mobile CTA ---------------- */
  var sticky = $("#stickyCta"), hero = $(".hero"), pk = $("#packages"), fin = $("#contact");
  function stickyCheck() {
    var y = window.scrollY, vh = window.innerHeight;
    var past = y > hero.offsetTop + hero.offsetHeight - 80;
    var inPk = (y + vh > pk.offsetTop && y < pk.offsetTop + pk.offsetHeight) || (y + vh > fin.offsetTop + 200);
    sticky.classList.toggle("show", past && !inPk);
  }
  window.addEventListener("scroll", stickyCheck, { passive: true }); stickyCheck();

  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }
  window.addEventListener("load", function () { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
})();
