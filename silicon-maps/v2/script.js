/* Silicon Maps: Version B "Daylight Atlas" */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var G = window.gsap, ST = window.ScrollTrigger, hasG = !!(G && ST);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var money = function (n) { return "$" + Math.round(n).toLocaleString("en-US"); };
  var money2 = function (n) { return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); };
  var IMG = "../images/";
  var ss = { get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
  root.classList.add("js");
  if (hasG) G.registerPlugin(ST);

  /* ============ DATA (from siliconmaps.com) ============ */
  var REGIONS = [
    { id: "silicon-valley", name: "Silicon Valley", cat: "tech", place: "Northern California", img: "p-silicon-valley.jpg", desc: "The flagship map since 1989, with 200+ innovators from first-product startups to Fortune 100s. Also shown on backlit displays at SFO and SJC airports." },
    { id: "silicon-hills", name: "Silicon Hills", cat: "tech", place: "Austin, Texas", img: "p-silicon-hills.jpg", desc: "Austin's fast-growing corridor of chipmakers, software companies and startups.", kw: "austin" },
    { id: "silicon-forest", name: "Silicon Forest", cat: "tech", place: "Portland, Oregon", img: "p-silicon-forest.jpg", desc: "Oregon's high-tech hub, on display at Portland International Airport.", kw: "portland" },
    { id: "silicon-desert", name: "Silicon Desert", cat: "tech", place: "Phoenix, Arizona", img: "p-silicon-desert.jpg", desc: "Arizona's semiconductor and advanced-manufacturing powerhouse.", kw: "phoenix" },
    { id: "dfw", name: "DFW Technoplex", cat: "tech", place: "Dallas–Fort Worth, Texas", img: "p-dfw.jpg", desc: "North Texas's cluster of tech, telecom and corporate headquarters.", kw: "dallas fort worth" },
    { id: "lone-star", name: "Lone Star Tech", cat: "tech", place: "Texas", img: "poster-soon.svg", desc: "Texas technology innovators on one statewide map.", noProduct: true, kw: "houston" },
    { id: "east-coast-tech", name: "East Coast Tech", cat: "tech", place: "Boston & the Northeast", img: "p-east-coast-tech.jpg", desc: "Technology leaders along the Eastern Seaboard.", kw: "boston new york" },
    { id: "tech-coast", name: "Tech Coast", cat: "tech", place: "Southern California", img: "p-tech-coast.jpg", desc: "Southern California's aerospace, med-tech and software economy.", kw: "los angeles irvine" },
    { id: "ny-photonics", name: "New York Photonics", cat: "tech", place: "Rochester, NY", img: "poster-soon.svg", desc: "Upstate New York's optics, photonics and imaging cluster.", noProduct: true, kw: "rochester" },
    { id: "tech-triangle", name: "Tech Triangle", cat: "tech", place: "Raleigh–Durham, NC", img: "p-tech-triangle.jpg", desc: "Research Triangle Park and North Carolina's tech ecosystem.", kw: "raleigh durham" },
    { id: "south-florida", name: "South Florida Tech Gateway", cat: "tech", place: "Miami, Florida", img: "poster-soon.svg", desc: "South Florida's growing tech scene and gateway to Latin America.", noProduct: true, kw: "miami" },
    { id: "silicon-europe", name: "Silicon Europe", cat: "tech", place: "Europe", img: "p-silicon-europe.jpg", desc: "Europe's leading technology regions on one map." },
    { id: "malaga", name: "Málaga", cat: "tech", place: "Málaga, Spain", img: "poster-soon.svg", desc: "Southern Europe's emerging tech hub on the Costa del Sol.", noProduct: true, kw: "malaga spain" },
    { id: "techno-tokyo", name: "Techno Tokyo", cat: "tech", place: "Tokyo, Japan", img: "p-techno-tokyo.jpg", desc: "Japan's technology capital and its global brands.", kw: "japan" },
    { id: "silicon-world", name: "Silicon World", cat: "tech", place: "Global", img: "p-silicon-world.jpg", desc: "The world's technology hubs on one global map." },
    { id: "bioscience-west", name: "Bioscience West", cat: "bio", place: "California", img: "p-bioscience-west.jpg", desc: "Biotech, pharma and med-device leaders of the West Coast.", kw: "san diego biotech" },
    { id: "bioscience-east", name: "Bioscience East", cat: "bio", place: "New Jersey & the Northeast", img: "p-bioscience-east.jpg", desc: "The life-science corridor of the East Coast.", kw: "new jersey pharma" },
    { id: "bio-midwest", name: "Bioscience Midwest", cat: "bio", place: "Chicago & the Midwest", img: "p-bio-midwest.jpg", desc: "Bioscience, ag-bio and medical innovators of the Midwest.", kw: "chicago" },
    { id: "bio-triangle", name: "BIO Triangle", cat: "bio", place: "Research Triangle, NC", img: "p-bio-triangle.jpg", desc: "North Carolina's world-class life-science cluster.", kw: "raleigh durham" },
    { id: "bio-europe", name: "BIO Europe", cat: "bio", place: "Europe", img: "p-bio-europe.jpg", desc: "Europe's biotech and pharma leaders." },
    { id: "global-bio", name: "Global BIO", cat: "bio", place: "Global", img: "p-global-bio.jpg", desc: "The world's life-science hubs on one map." }
  ];
  var byId = {}; REGIONS.forEach(function (r) { byId[r.id] = r; });
  var PRODUCTS = REGIONS.filter(function (r) { return !r.noProduct; }).map(function (r) { return { sku: r.id, name: r.name + " 2026", cat: r.cat, price: 25, img: r.img, label: r.cat === "bio" ? "Life Science" : "High Tech" }; });
  PRODUCTS.push({ sku: "sv-puzzle", name: "Silicon Valley 150-piece Puzzle", cat: "gift", price: 29, img: "p-puzzle.jpg", label: "Gift · 11 × 17 in" });
  PRODUCTS.push({ sku: "sv-mousepad", name: "Silicon Valley Mouse Pad", cat: "gift", price: 16, img: "p-silicon-valley.jpg", label: "Gift" });
  var prodBySku = {}; PRODUCTS.forEach(function (p) { prodBySku[p.sku] = p; });
  var ORDER = ["silicon-valley", "sv-puzzle", "bioscience-west", "silicon-hills", "techno-tokyo", "silicon-forest", "bio-triangle", "tech-coast", "sv-mousepad", "east-coast-tech", "silicon-europe", "bioscience-east", "silicon-desert", "dfw", "tech-triangle", "bio-midwest", "bio-europe", "silicon-world", "global-bio"];

  /* ============ helpers ============ */
  var toastT;
  function toast(m) { var t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("show"); }, 2400); }

  /* ============ Lenis ============ */
  var lenis = null;
  if (!reduce && window.Lenis && hasG) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ST.update);
    G.ticker.add(function (t) { lenis.raf(t * 1000); });
    G.ticker.lagSmoothing(0);
  }
  ["#cartItems", ".modal__box", ".qv__box", ".sheet", ".finder__list", ".matrix-wrap", ".drawer__panel"].forEach(function (s) { $$(s).forEach(function (e) { e.setAttribute("data-lenis-prevent", ""); }); });
  var locks = 0;
  function lock() { locks++; if (lenis) lenis.stop(); document.body.style.overflow = "hidden"; }
  function unlock() { locks = Math.max(0, locks - 1); if (!locks) { if (lenis) lenis.start(); document.body.style.overflow = ""; } }
  function goTo(el, off) { if (!el) return; if (lenis) lenis.scrollTo(el, { offset: off || -90, duration: 1.3 }); else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute("href"); if (id.length < 2) return;
    var el = $(id); if (!el) return;
    e.preventDefault(); closeSheet(); closeAll();
    if (a.dataset.interest) setInterest(a.dataset.interest);
    goTo(el, id === "#top" ? -200 : -90);
  });

  /* ============ Nav ============ */
  var nav = $("#nav"), lastY = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (y > 500 && y > lastY + 4 && !sheetOpen) nav.classList.add("is-hidden");
    else if (y < lastY - 4 || y < 300) nav.classList.remove("is-hidden");
    lastY = y; stickyCheck();
  }, { passive: true });
  var burger = $("#burger"), sheet = $("#sheet"), sheetOpen = false;
  function openSheet() { var nb = $(".nav__pill").getBoundingClientRect().bottom; sheet.style.top = (nb + 10) + "px"; sheet.style.maxHeight = (window.innerHeight - nb - 22) + "px"; sheetOpen = true; sheet.classList.add("open"); sheet.setAttribute("aria-hidden", "false"); burger.setAttribute("aria-expanded", "true"); }
  function closeSheet() { if (!sheetOpen) return; sheetOpen = false; sheet.classList.remove("open"); sheet.setAttribute("aria-hidden", "true"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", function () { sheetOpen ? closeSheet() : openSheet(); });

  /* ============ Hero ============ */
  if (hasG && !reduce) {
    var tl = G.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".hl > span", { yPercent: 110, duration: 1.3, stagger: .1 })
      .from(".inline-pill", { scale: 0, rotate: -40, duration: 1, ease: "back.out(2)" }, .5)
      .from(".hero .rv", { opacity: 0, y: 24, duration: 1, stagger: .08 }, .35)
      .from(".window", { y: 80, opacity: 0, duration: 1.4 }, .5)
      .from(".hot", { scale: 0, duration: .6, stagger: .08, ease: "back.out(2.5)" }, 1.2)
      .from(".wstat", { y: 30, opacity: 0, duration: .8, stagger: .1 }, 1.3);
    $$(".hero .rv").forEach(function (e) { e.classList.remove("rv"); });
  } else $$(".hero .rv").forEach(function (e) { e.classList.remove("rv"); });
  // poster pill cycles
  (function () {
    var pill = $("#pillImg"), list = ["p-silicon-valley.jpg", "p-bioscience-west.jpg", "p-silicon-hills.jpg", "p-techno-tokyo.jpg", "p-tech-coast.jpg", "p-bio-triangle.jpg"], i = 0;
    if (reduce) return;
    setInterval(function () {
      i = (i + 1) % list.length;
      if (hasG) G.to(pill, { yPercent: -100, opacity: 0, duration: .35, ease: "power2.in", onComplete: function () { pill.src = IMG + list[i]; G.fromTo(pill, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5, ease: "expo.out" }); } });
      else pill.src = IMG + list[i];
    }, 2400);
  })();
  // window expand on scroll
  if (hasG && !reduce) {
    var mm = G.matchMedia();
    mm.add({ desk: "(min-width: 861px)", tab: "(max-width: 860px) and (min-width: 601px)", mob: "(max-width: 600px)" }, function (c) {
      var start = c.conditions.desk ? "inset(0% 6% 0% 6% round 36px)" : c.conditions.tab ? "inset(0% 3% 0% 3% round 26px)" : "inset(0px 16px 0px 16px round 24px)";
      var endC = c.conditions.mob ? "inset(0px 0px 0px 0px round 0px)" : "inset(0% 0% 0% 0% round 0px)";
      G.fromTo(".window", { clipPath: start }, { clipPath: endC, ease: "none", scrollTrigger: { trigger: ".window", start: "top 85%", end: "top 10%", scrub: true } });
      G.fromTo("#windowMap", { scale: 1.14 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".window", start: "top bottom", end: "bottom top", scrub: true } });
    });
  }

  /* ============ Reveal + counters ============ */
  if (hasG && !reduce) {
    ST.batch(".rv", { start: "top 90%", onEnter: function (els) { G.to(els, { opacity: 1, y: 0, duration: 1, stagger: .08, ease: "expo.out", overwrite: true }); } });
    $$(".h2").forEach(function (h) { G.from(h, { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 88%" } }); });
  } else $$(".rv").forEach(function (e) { e.style.opacity = 1; e.style.transform = "none"; });
  $$("[data-count]").forEach(function (el) {
    var end = +el.dataset.count, plain = el.dataset.plain, o = { v: plain ? end - 37 : 0 };
    if (!hasG || reduce) return;
    el.textContent = plain ? o.v : "0";
    ST.create({ trigger: el, start: "top 92%", once: true, onEnter: function () { G.to(o, { v: end, duration: 2, ease: "power3.out", onUpdate: function () { el.textContent = plain ? Math.round(o.v) : Math.round(o.v).toLocaleString("en-US"); } }); } });
  });

  /* ============ Stack cards ============ */
  if (hasG && !reduce) {
    var cards = $$(".scard");
    cards.forEach(function (card, i) {
      if (i === cards.length - 1) return;
      G.to(card, { scale: .93, filter: "brightness(.94)", ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top 70%", end: "top 20%", scrub: true } });
    });
    $$(".scard__img img").forEach(function (im) { G.from(im, { y: 60, rotate: 4, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: im, start: "top 85%" } }); });
  }

  /* ============ Region state ============ */
  var selected = "silicon-valley";
  function setRegion(id) {
    var r = byId[id]; if (!r) return; selected = id;
    $("#pkRegion").value = id; $("#leadRegion").value = id;
    $("#pkRegionName").textContent = r.name;
    $("#stickyRegion").textContent = r.name + " 2027";
    $("#stickyImg").src = IMG + r.img;
    updateBuilder();
  }

  /* ============ Finder (combobox) ============ */
  var fin = $("#finderInput"), flist = $("#finderList"), fIdx = -1, fRes = [];
  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function search(q) { q = norm(q.trim()); if (!q) return REGIONS.slice(0, 6); return REGIONS.filter(function (r) { return norm(r.name + " " + r.place + " " + (r.kw || "")).indexOf(q) > -1; }); }
  function renderFinder() {
    fRes = search(fin.value); fIdx = fRes.length ? 0 : -1;
    flist.innerHTML = fRes.length ? fRes.map(function (r, i) {
      return '<li role="option" id="fo-' + i + '" data-id="' + r.id + '" aria-selected="' + (i === fIdx) + '"><img src="' + IMG + r.img + '" alt=""><span><b>' + r.name + "</b><small>" + r.place + '</small></span><span class="tag ' + r.cat + '">' + (r.cat === "bio" ? "Life Science" : "High Tech") + "</span></li>";
    }).join("") : '<li aria-disabled="true"><span><b>No exact match</b><small>Ask us about new regions: sales@siliconmaps.com</small></span></li>';
    flist.classList.add("open"); fin.setAttribute("aria-expanded", "true");
  }
  function closeFinder() { flist.classList.remove("open"); fin.setAttribute("aria-expanded", "false"); }
  function pick(id) {
    var r = byId[id]; if (!r) return;
    fin.value = r.name; closeFinder(); setRegion(id);
    goTo($("#build"));
    toast(r.name + ": 2027 spaces available, build your placement below");
    if (hasG && !reduce) setTimeout(function () { G.fromTo(".bmap select", { boxShadow: "0 0 0 0 rgba(244,117,36,.6)" }, { boxShadow: "0 0 0 10px rgba(244,117,36,0)", duration: 1.2, repeat: 1 }); }, 1200);
  }
  fin.addEventListener("focus", renderFinder);
  fin.addEventListener("input", renderFinder);
  fin.addEventListener("keydown", function (e) {
    if (!flist.classList.contains("open")) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); if (!fRes.length) return;
      fIdx = (fIdx + (e.key === "ArrowDown" ? 1 : -1) + fRes.length) % fRes.length;
      $$("li", flist).forEach(function (li, i) { li.setAttribute("aria-selected", i === fIdx); });
      fin.setAttribute("aria-activedescendant", "fo-" + fIdx);
    } else if (e.key === "Escape") closeFinder();
  });
  flist.addEventListener("mousedown", function (e) { var li = e.target.closest("li[data-id]"); if (li) { e.preventDefault(); pick(li.dataset.id); } });
  document.addEventListener("click", function (e) { if (!e.target.closest(".finder")) closeFinder(); });
  $("#finder").addEventListener("submit", function (e) { e.preventDefault(); var r = fRes[fIdx] || search(fin.value)[0] || byId["silicon-valley"]; pick(r.id); });
  $$("[data-pick]").forEach(function (b) { b.addEventListener("click", function () { pick(b.dataset.pick); }); });

  /* ============ Regions index ============ */
  var rindex = $("#rindex"), rfloat = $("#rfloat"), rfImg = $("#rfloatImg");
  REGIONS.forEach(function (r, i) {
    var li = document.createElement("li"); li.dataset.cat = r.cat;
    li.innerHTML = '<button class="rrow" type="button" data-id="' + r.id + '"><span class="rrow__n">' + String(i + 1).padStart(2, "0") + '</span><img class="rrow__thumb" src="' + IMG + r.img + '" alt="" loading="lazy"><span class="rrow__name">' + r.name + '</span><span class="rrow__place">' + r.place + '</span><span class="rrow__tag ' + r.cat + '">' + (r.cat === "bio" ? "Life Science" : "High Tech") + '</span><span class="rrow__go" aria-hidden="true">→</span></button>';
    rindex.appendChild(li);
  });
  $$(".regions .seg button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".regions .seg button").forEach(function (x) { x.setAttribute("aria-selected", x === b); });
      var c = b.dataset.cat;
      $$("li", rindex).forEach(function (li) { li.classList.toggle("hide", c !== "all" && li.dataset.cat !== c); });
      if (hasG && !reduce) G.from($$("li:not(.hide)", rindex), { opacity: 0, y: 14, duration: .5, stagger: .025 });
      if (ST) ST.refresh();
    });
  });
  if (fine && hasG) {
    var fx = G.quickTo(rfloat, "x", { duration: .5, ease: "power3" }), fy = G.quickTo(rfloat, "y", { duration: .5, ease: "power3" });
    rindex.addEventListener("mousemove", function (e) { fx(e.clientX + 30); fy(e.clientY - 130); });
    rindex.addEventListener("mouseover", function (e) { var b = e.target.closest(".rrow"); if (!b) return; rfImg.src = IMG + byId[b.dataset.id].img; rfloat.classList.add("on"); });
    rindex.addEventListener("mouseleave", function () { rfloat.classList.remove("on"); });
  }
  if (hasG && !reduce) G.from(".rrow", { opacity: 0, y: 20, duration: .8, stagger: .03, ease: "expo.out", scrollTrigger: { trigger: rindex, start: "top 85%" } });
  rindex.addEventListener("click", function (e) { var b = e.target.closest(".rrow"); if (b) openQV(b.dataset.id); });

  /* ============ Quick view ============ */
  var qv = $("#qv"), lastFocus;
  function openQV(id) {
    var r = byId[id]; lastFocus = document.activeElement; rfloat.classList.remove("on");
    $("#qvImg").src = IMG + r.img; $("#qvImg").alt = r.name + " poster";
    $("#qvCat").textContent = (r.cat === "bio" ? "Life Science" : "High Tech") + " · " + r.place;
    $("#qvName").textContent = r.name; $("#qvDesc").textContent = r.desc;
    var b = $("#qvBuy"); b.hidden = !!r.noProduct; b.dataset.sku = r.id;
    $("#qvAdvertise").dataset.region = r.id;
    qv.classList.add("open"); qv.setAttribute("aria-hidden", "false"); lock();
    setTimeout(function () { $(".x", qv).focus(); }, 80);
  }
  function closeQV() { if (!qv.classList.contains("open")) return; qv.classList.remove("open"); qv.setAttribute("aria-hidden", "true"); unlock(); if (lastFocus) lastFocus.focus(); }
  $$("[data-qclose]").forEach(function (b) { b.addEventListener("click", closeQV); });
  $("#qvAdvertise").addEventListener("click", function () { setRegion(this.dataset.region); });
  $("#qvBuy").addEventListener("click", function () { closeQV(); addToCart(this.dataset.sku); });

  /* ============ Builder ============ */
  var pkRegion = $("#pkRegion"), leadRegion = $("#leadRegion");
  function fill(sel) {
    [["High Tech", "tech"], ["Life Science", "bio"]].forEach(function (g) {
      var og = document.createElement("optgroup"); og.label = g[0];
      REGIONS.filter(function (r) { return r.cat === g[1]; }).forEach(function (r) { var o = document.createElement("option"); o.value = r.id; o.textContent = r.name; og.appendChild(o); });
      sel.appendChild(og);
    });
    sel.value = "silicon-valley";
  }
  fill(pkRegion); fill(leadRegion);
  var cols = ["basic", "silver", "gold", "platinum"];
  $$(".matrix tbody td").forEach(function (td) { if (td.textContent.indexOf("●") > -1) td.classList.add("yes"); });
  function state() {
    var t = $("input[name=tier]:checked"), total = +t.dataset.price, adds = [];
    $$(".addons input").forEach(function (c) { if (c.checked && !c.disabled) { total += +c.dataset.price; adds.push([c.closest(".addon").querySelector("b").textContent, +c.dataset.price]); } });
    return { region: byId[pkRegion.value] || byId["silicon-valley"], tier: t.dataset.name, tierVal: t.value, price: +t.dataset.price, adds: adds, total: total };
  }
  var adMaps = $("#adMaps");
  function updateBuilder() {
    var t = $("input[name=tier]:checked"); if (!t) return;
    var basic = t.value === "basic"; adMaps.disabled = basic; if (basic) adMaps.checked = false;
    adMaps.closest(".addon").classList.toggle("disabled", basic);
    var ci = cols.indexOf(t.value) + 2;
    $$(".matrix .sel").forEach(function (c) { c.classList.remove("sel"); });
    $$(".matrix tbody tr").forEach(function (tr) { var c = tr.children[ci - 1]; if (c) c.classList.add("sel"); });
    var s = state();
    var lines = '<div><dt>Map</dt><dd>' + s.region.name + " 2027</dd></div><div><dt>" + s.tier + "</dt><dd>" + money(s.price) + "</dd></div>";
    s.adds.forEach(function (a) { lines += "<div><dt>" + a[0] + "</dt><dd>+" + money(a[1]) + "</dd></div>"; });
    $("#rLines").innerHTML = lines;
    var el = $("#sumTotal"), from = +(el.dataset.v || s.total); el.dataset.v = s.total;
    if (hasG && !reduce && from !== s.total) { var o = { v: from }; G.to(o, { v: s.total, duration: .6, ease: "power3.out", onUpdate: function () { el.textContent = money(o.v); } }); }
    else el.textContent = money(s.total);
    $("#sumDay").textContent = money2(s.total / 365);
  }
  $$("input[name=tier], .addons input").forEach(function (i) { i.addEventListener("change", updateBuilder); });
  pkRegion.addEventListener("change", function () { setRegion(pkRegion.value); });
  leadRegion.addEventListener("change", function () { setRegion(leadRegion.value); });
  setRegion("silicon-valley");
  if (hasG && !reduce) G.from(".bstep, .receipt__card", { y: 50, opacity: 0, duration: 1.1, stagger: .1, ease: "expo.out", scrollTrigger: { trigger: ".build__grid", start: "top 85%" } });

  /* ============ Store bento ============ */
  var bento = $("#bento"), expanded = false, filter = "all";
  ORDER.forEach(function (sku, i) {
    var p = prodBySku[sku]; if (!p) return;
    var el = document.createElement("article");
    el.className = "bcard" + (i === 0 ? " bcard--feat" : sku === "sv-puzzle" ? " bcard--wide" : "");
    el.dataset.cat = p.cat; el.dataset.i = i;
    el.innerHTML = (i === 0 ? '<span class="bcard__ribbon">Bestseller</span>' : "") + '<div class="bcard__img"><img src="' + IMG + p.img + '" alt="' + p.name + '" loading="lazy"></div><div class="bcard__info"><div><small>' + p.label + "</small><b>" + p.name + '</b></div><span class="bcard__price">$' + p.price + '</span><button class="bcard__add" data-add="' + p.sku + '" aria-label="Add ' + p.name + ' to cart">+</button></div>';
    bento.appendChild(el);
  });
  function renderStore() {
    var n = 0;
    $$(".bcard", bento).forEach(function (el) {
      var m = filter === "all" || el.dataset.cat === filter, v = m && (expanded || filter !== "all" || n < 10);
      el.classList.toggle("hide", !v); if (v) n++;
      el.classList.toggle("bcard--feat", filter === "all" && el.dataset.i === "0");
      el.classList.toggle("bcard--wide", filter === "all" && el.dataset.i === "1");
    });
    $(".store__more").hidden = expanded || filter !== "all";
    if (ST) ST.refresh();
  }
  renderStore();
  $("#showAll").addEventListener("click", function () { expanded = true; renderStore(); });
  $$("[data-f]").forEach(function (b) { b.addEventListener("click", function () { filter = b.dataset.f; $$("[data-f]").forEach(function (x) { x.setAttribute("aria-selected", x === b); }); renderStore(); if (hasG && !reduce) G.from($$(".bcard:not(.hide)", bento), { opacity: 0, y: 20, duration: .5, stagger: .03 }); }); });
  if (hasG && !reduce) G.from(".bcard", { y: 60, opacity: 0, duration: 1, stagger: .05, ease: "expo.out", scrollTrigger: { trigger: bento, start: "top 85%" } });

  /* ============ Timeline ============ */
  if (hasG && !reduce) G.to("#tlFill", { width: "100%", ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 75%", end: "bottom 55%", scrub: true } });
  else $("#tlFill").style.width = "100%";

  /* ============ FAQ ============ */
  $$(".acc details").forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      $$(".acc details").forEach(function (o) { if (o !== d) o.open = false; });
      if (hasG && !reduce) G.from($("p", d), { opacity: 0, y: -8, duration: .45 });
      if (ST) setTimeout(function () { ST.refresh(); }, 400);
    });
  });

  /* ============ Cart ============ */
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem("smB-cart") || "{}") || {}; } catch (e) { cart = {}; }
  function save() { try { localStorage.setItem("smB-cart", JSON.stringify(cart)); } catch (e) {} }
  function renderCart() {
    var box = $("#cartItems"), n = 0, sub = 0; box.innerHTML = "";
    Object.keys(cart).forEach(function (sku) {
      var p = prodBySku[sku]; if (!p || cart[sku] < 1) { delete cart[sku]; return; }
      n += cart[sku]; sub += cart[sku] * p.price;
      var row = document.createElement("div"); row.className = "citem";
      row.innerHTML = '<img src="' + IMG + p.img + '" alt=""><div><b>' + p.name + "</b><small>" + money(p.price) + ' each</small><br><span class="qty"><button data-q="-1" aria-label="Decrease quantity">−</button><span>' + cart[sku] + '</span><button data-q="1" aria-label="Increase quantity">+</button></span></div><b>' + money(cart[sku] * p.price) + "</b>";
      $$("[data-q]", row).forEach(function (b) { b.addEventListener("click", function () { cart[sku] += +b.dataset.q; save(); renderCart(); }); });
      box.appendChild(row);
    });
    if (!n) box.innerHTML = '<p class="drawer__empty">Your cart is empty.<br>Every 2026 map is $25.</p>';
    $("#cartCount").textContent = n; $("#cartBtn").setAttribute("aria-label", "Open cart, " + n + " items");
    $("#cartSub").textContent = money2(sub);
    $("#cartUpsell").hidden = !n || !!cart["sv-puzzle"];
    $("#checkoutBtn").disabled = !n;
  }
  var drawer = $("#drawer");
  function addToCart(sku) {
    if (!prodBySku[sku]) return;
    cart[sku] = (cart[sku] || 0) + 1; save(); renderCart();
    var b = $("#cartBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
    nav.classList.remove("is-hidden");
    if (!drawer.classList.contains("open")) openDrawer(); else toast(prodBySku[sku].name + " added");
  }
  document.addEventListener("click", function (e) { var a = e.target.closest("[data-add]"); if (a) { e.preventDefault(); addToCart(a.dataset.add); } });
  function openDrawer() { lastFocus = document.activeElement; drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); lock(); setTimeout(function () { $(".x", drawer).focus(); }, 60); }
  function closeDrawer() { if (!drawer.classList.contains("open")) return; drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); unlock(); }
  $("#cartBtn").addEventListener("click", openDrawer);
  $$("[data-close]", drawer).forEach(function (b) { b.addEventListener("click", closeDrawer); });
  $("#checkoutBtn").addEventListener("click", function () { toast("Prototype: this opens the store's secure checkout"); });
  renderCart();

  /* ============ Reserve modal ============ */
  var modal = $("#modal");
  function openModal() {
    var s = state(); lastFocus = document.activeElement;
    $("#mRegion").textContent = s.region.name;
    $("#mSum").textContent = s.tier + " · " + money(s.total) + " first year" + (s.adds.length ? " · incl. " + s.adds.map(function (a) { return a[0]; }).join(", ") : "");
    $(".modal__form", modal).hidden = false; $(".modal__ok", modal).hidden = true;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); lock();
    setTimeout(function () { $("#reserveForm input").focus(); }, 100);
  }
  function closeModal() { if (!modal.classList.contains("open")) return; modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); unlock(); if (lastFocus) lastFocus.focus(); }
  $("#reserveBtn").addEventListener("click", openModal);
  $$("[data-mclose]").forEach(function (b) { b.addEventListener("click", closeModal); });
  function validate(form) {
    var ok = true;
    $$("input[required]", form).forEach(function (i) { var bad = !i.value.trim() || (i.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value)); i.classList.toggle("invalid", bad); if (bad && ok) { i.focus(); ok = false; } });
    return ok;
  }
  var converted = false;
  $("#reserveForm").addEventListener("submit", function (e) { e.preventDefault(); if (!validate(this)) return; converted = true; $(".modal__form", modal).hidden = true; $(".modal__ok", modal).hidden = false; if (hasG) G.from(".modal__ok .okc", { scale: 0, duration: .6, ease: "back.out(2)" }); });

  /* ============ Lead form ============ */
  function setInterest(v) { var s = $("#leadInterest"); $$("option", s).forEach(function (o) { if (o.textContent === v) s.value = o.value; }); }
  $("#leadForm").addEventListener("submit", function (e) {
    e.preventDefault(); if (!validate(this)) return; converted = true;
    $("#okRegion").textContent = byId[leadRegion.value].name;
    var ok = $(".form__ok"); ok.hidden = false; if (hasG) G.from(ok, { opacity: 0, scale: .97, duration: .5 });
  });

  /* ============ Exit intent ============ */
  var exitEl = $("#exit"), armed = false;
  setTimeout(function () { armed = true; }, 15000);
  function openExit() { exitEl.classList.add("open"); exitEl.setAttribute("aria-hidden", "false"); lock(); ss.set("smB-exit", "1"); }
  function closeExit() { if (!exitEl.classList.contains("open")) return; exitEl.classList.remove("open"); exitEl.setAttribute("aria-hidden", "true"); unlock(); }
  if (fine) document.addEventListener("mouseout", function (e) { if (!armed || converted || e.relatedTarget || e.clientY > 8 || ss.get("smB-exit") || locks) return; openExit(); });
  $$("[data-xclose]").forEach(function (b) { b.addEventListener("click", closeExit); });

  function closeAll() { closeDrawer(); closeModal(); closeExit(); closeQV(); }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeAll(); closeSheet(); closeFinder(); } });

  /* ============ Sticky ============ */
  var sticky = $("#sticky");
  function stickyCheck() {
    var vh = window.innerHeight, w = $(".window").getBoundingClientRect(), b = $("#build").getBoundingClientRect(), c = $("#contact").getBoundingClientRect();
    var show = w.bottom < vh * .3 && !(b.top < vh * .85 && b.bottom > vh * .15) && c.top > vh * .95 && !sheetOpen;
    sticky.classList.toggle("show", show);
  }

  /* ============ Footer links ============ */
  REGIONS.forEach(function (r) {
    var a = document.createElement("a"); a.href = "#regions"; a.textContent = r.name;
    a.addEventListener("click", function () { setTimeout(function () { openQV(r.id); }, 900); });
    (r.cat === "bio" ? $("#footBio") : $("#footTech")).appendChild(a);
  });

  window.addEventListener("load", function () { if (ST) ST.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (ST) ST.refresh(); });
})();
