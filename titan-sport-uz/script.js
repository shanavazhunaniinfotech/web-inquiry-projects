/* TITAN SPORT — homepage prototype. Product data copied from the client's current site. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  /* ---------------- DATA (from titansportuz.netlify.app/products-data.js) ---------------- */
  var CATS = [
    { id: "gantel", name: "Gantellar", c: "var(--p25)", kg: "25" },
    { id: "shtanga", name: "Shtangalar va griflar", short: "Shtangalar", c: "var(--p20)", kg: "20" },
    { id: "blin", name: "Disklar (blinlar)", short: "Disklar", c: "var(--p15)", kg: "15", light: true },
    { id: "girya", name: "Giryalar", c: "var(--p10)", kg: "10" },
    { id: "trenajyor", name: "Skameyka va tokchalar", short: "Trenajyorlar", c: "var(--p5)", kg: "5", light: true },
    { id: "aksessuar", name: "Aksessuarlar", c: "var(--pk)", kg: "2.5" }
  ];
  var P = [
    { id: 1, art: "hex", cat: "gantel", name: "Geksagonal rezinali gantellar (juft)", price: 450000, old: 520000, w: "2 × 10 kg", kg: 20, mat: "Vulkanizatsiyalangan kauchuk va quyma po'lat", dim: "Geksagonal (dumalamaydigan)", badge: "Xit savdo", feat: true,
      d: "Eng ommabop va qulay geksagonal gantellar. Shovqinsiz, polni chizmaydi va yerga qo'yganda dumalab ketmaydi. Xromlangan sirpanmaydigan qulay tutqichga ega.",
      s: { "Tutqich diametri": "28 mm ergonomik xrom", "Qoplama": "Zarba o'tkazmaydigan kauchuk", "Kafolat": "2 yil rasmiy kafolat", "Ishlab chiqarilgan": "Rossiya / Titan Pro" } },
    { id: 2, art: "smart", cat: "gantel", name: "Regulyatorli smart gantel (2.5 – 24 kg)", price: 1850000, old: 2200000, w: "2.5 – 24 kg", kg: 24, mat: "Yuqori mustahkam po'lat va polimer mexanizm", dim: "15 xil vazn bitta gantelda", badge: "Top tanlov", feat: true,
      d: "15 juft gantel o'rnini bosadigan smart gantel. Bitta burash orqali 2.5 kg dan 24 kg gacha kerakli vaznni 2 soniyada tanlang. Uy sharoiti uchun joy tejovchi yechim.",
      s: { "Vazn bosqichlari": "2.5, 3.5, 4.5, 5.5, 6.5, 8, 9, 10, 11.5, 13.5, 16, 18, 20.5, 22.5, 24 kg", "Mexanizm": "Tezkor aylanuvchi disk bloki", "O'lchami": "42 × 21 × 21 sm", "Podstavka": "Maxsus taglik komplektda" } },
    { id: 3, art: "chrome", cat: "gantel", name: "Yig'iladigan xromli gantellar to'plami (chamadonda)", price: 680000, old: 790000, w: "2 × 15 kg (30 kg jami)", kg: 30, mat: "To'liq xromlangan po'lat", dim: "Qulay saqlash qutisi bilan", badge: "Klassika",
      d: "Klassik xromli disklar va tishli xavfsiz gaykali griflar. Disklar sonini o'zgartirib xohlagan og'irlikni yig'ish mumkin. Chamadonga solib olib yurish oson.",
      s: { "Komplekt tarkibi": "8×2.5 kg, 4×1.25 kg, 4×0.5 kg disklar + 2 ta grif + 4 ta gayka", "Tutqich": "Sirpanishga qarshi relyefli", "Gayka turi": "Vintli Spinlock fiksator", "Chamadoni": "Zarbaga chidamli plastik" } },
    { id: 4, art: "oly", cat: "shtanga", name: "Olimpiya standart shtanga grifi 220 sm (20 kg)", price: 1650000, old: 1950000, w: "20 kg", kg: 20, mat: "Prujinasimon qotishma po'lat (alloy steel)", dim: "Uzunligi 220 sm, vtulka 50 mm", badge: "Professional", feat: true,
      d: "Xalqaro IWF/IPF standartlariga mos professional Olimpiya grifi. 4 ta podshipnik silliq aylanishni ta'minlaydi, 450 kg gacha og'irlikni egilmasdan ko'taradi.",
      s: { "Maksimal yuklama": "450 kg (1000 lbs)", "Vtulka diametri": "50 mm (Olimpiya disklar uchun)", "Tutqich diametri": "28 mm o'rtacha nasechka bilan", "Podshipniklar": "4 ta ignasimon rulmanli podshipnik" } },
    { id: 5, art: "ez", cat: "shtanga", name: "EZ-biceps qiyshiq grif (120 sm, 50 mm)", price: 590000, old: 690000, w: "8.5 kg", kg: 8.5, mat: "Zanglamas xrom po'lat", dim: "120 sm uzunlik, W-simon burchak", badge: "Ergonomik",
      d: "Biceps va triceps mashqlarida bilak bo'g'imlarini ortiqcha zo'riqishdan asraydigan anatomik qiyshiq grif.",
      s: { "Maksimal yuk": "180 kg", "Vtulka diametri": "50 mm (28 mm varianti ham mavjud)", "Afzalligi": "Bilak og'rig'ini kamaytiradi, to'liq izolyatsiya", "Tutqich": "Relyefli olmos nasechka" } },
    { id: 6, art: "trap", cat: "shtanga", name: "Trap bar / Hex bar (stanovaya tyaga uchun)", price: 1350000, old: 1550000, w: "22 kg", kg: 22, mat: "Qalin devorli mustahkamlangan po'lat", dim: "Geksagonal ramka, 50 mm vtulka", badge: "Xavfsiz stanovaya",
      d: "Olmos shaklidagi trap bar. Stanovaya tyaga, shrug va fermer yurishini xavfsizroq bajarish uchun — og'irlik markazi tananing o'rtasida.",
      s: { "Maksimal yuklama": "350 kg", "Ikki tomonlama tutqich": "Baland va pastki tutqich darajalari", "Moslik": "Olimpiya 50 mm disklar uchun" } },
    { id: 7, art: "bumper", cat: "blin", name: "Hi-Temp bumper rezina disklar to'plami (100 kg)", price: 3600000, old: 4100000, w: "100 kg (2×20, 2×15, 2×10, 2×5 kg)", kg: 100, mat: "Qayta ishlangan zich kauchuk va po'lat vtulka", dim: "Diametri 450 mm (xalqaro standart)", badge: "Bestseller", feat: true,
      d: "CrossFit va og'ir atletika uchun: balanddan tashlanganda ham sakramaydigan va shovqin chiqarmaydigan amortizatsiyali bumper disklar to'plami.",
      s: { "Markaziy teshik": "50.4 mm po'lat halqa", "Zarba yutish": "Amortizatsiyali", "Standart": "IWF o'lchov standarti, 45 sm", "Hid": "Noxush rezina hidi yo'q" } },
    { id: 8, art: "trigrip", cat: "blin", name: "Qora pauerlifting po'lat disk, 3 tutqichli — 20 kg", price: 580000, old: 650000, w: "20 kg (dona)", kg: 20, mat: "Yuqori zichlikdagi cho'yan", dim: "3 ta qo'l tutqichi bilan", badge: "Mustahkam",
      d: "Ushlash va shtangaga taqish oson bo'lgan 3 tutqichli (Tri-Grip) qora po'lat disk. Alohida press va yelka mashqlari uchun ham ishlatiladi.",
      s: { "Ichki diametr": "51 mm", "Bo'yoq": "Kukunli qora emal", "Tutqichlar": "Sirpanmaydigan 3 zonali", "Vazn aniqligi": "± 1.5%" } },
    { id: 9, art: "kettle", cat: "girya", name: "Klassik cho'yan girya 16 kg (pud)", price: 490000, old: 560000, w: "16 kg", kg: 16, mat: "Monolit quyma cho'yan", dim: "Klassik qora mat", badge: "Klassika",
      d: "Kuch, chidamlilik va portlovchi tezlik uchun yaxlit monolit 16 kg girya. Silliq dasta qo'lni qadoq qilmaydi.",
      s: { "Tutqich": "35 mm keng dasta (ikki qo'llab ushlash mumkin)", "Tubi": "Tekis yotadigan keng asos", "Turi": "Monolit quyma (choksiz)", "Qo'llanishi": "Mah, silkitib ko'tarish, snach" } },
    { id: 10, art: "bench", cat: "trenajyor", name: "Sozlanuvchi universal skameyka (incline / flat)", price: 1450000, old: 1750000, w: "18 kg", kg: 18, mat: "Qalin profilli po'lat karkas va eko-charm", dim: "7 xil suyanchiq burchagi", badge: "Top trenajyor", feat: true,
      d: "Gantel va shtanga bilan mashq qilish uchun professional skameyka. 90° dan 0° va −20° gacha oson sozlanadi. Qalin anatomik qoplama.",
      s: { "Maksimal og'irlik": "300 kg (sportchi + yuk)", "Burchaklar": "7 ta suyanchiq, 3 ta o'rindiq burchagi", "Oyoq fiksatori": "Yumshoq valiklar", "Harakatlanish": "G'ildiraklar bilan" } },
    { id: 11, art: "rack", cat: "trenajyor", name: "Ko'p funksiyali squat rack (prisid va jim tokchasi)", price: 1980000, old: 2300000, w: "28 kg", kg: 28, mat: "50×50 mm qalin devorli profil po'lat", dim: "Balandligi 105 – 170 sm", badge: "Xavfsizlik",
      d: "Uy va zalda prisid hamda skameykada jim mashqlarini sug'urtachisiz bajarish uchun xavfsizlik tutqichli tokcha.",
      s: { "Balandlik bosqichlari": "14 ta", "Kengligi": "Grif uzunligiga moslab kengaytiriladi", "Maksimal yuklama": "260 kg", "Sug'urta barlari": "Tushib ketgan shtangani ushlab qoladi" } },
    { id: 12, art: "belt", cat: "aksessuar", name: "Pauerlifting charm kamari (10 mm, lever)", price: 480000, old: 580000, w: "1.2 kg", kg: 1.2, mat: "Tabiiy buqa terisi va po'lat richag", dim: "Qalinligi 10 mm, kengligi 10 sm", badge: "Himoya", sizes: ["S", "M", "L", "XL", "XXL"],
      d: "Og'ir vaznlarda qorin ichki bosimini ushlab, umurtqani himoya qiluvchi richagli (lever) mustahkam kamar.",
      s: { "Qulf turi": "Tezkor po'lat richag (quick lever)", "Qalinlik": "10 mm ko'p qatlamli tabiiy charm", "Standart": "IPF musobaqa mezonlariga mos", "O'lchamlar": "S, M, L, XL, XXL" } },
    { id: 13, art: "collar", cat: "aksessuar", name: "Tezkor Olimpiya shtanga qisqichlari (juft)", price: 120000, old: 150000, w: "350 g (juft)", kg: 0.35, mat: "Mustahkam neylon va silikon qistirma", dim: "50 mm Olimpiya griflar uchun", badge: "Qisqich",
      d: "Disklarni 1 soniyada qulflaydigan qisqichlar. Qattiq silkinganda ham disklar joyidan qimirlamaydi.",
      s: { "Fiksatsiya": "Bir barmoq bilan ochiladigan richag", "Ichki qoplama": "Grifni chizmaydigan silikon", "Moslik": "Barcha 50 mm griflarga" } },
    { id: 14, art: "chalk", cat: "aksessuar", name: "Sport magneziyasi (presslangan blok, 56 g)", price: 45000, old: 60000, w: "56 g", kg: 0.056, mat: "Toza magniy karbonat (MgCO₃)", dim: "Kompakt briket", badge: "Grip",
      d: "Qo'l terlashini bir zumda yo'qotadi va gantel, shtanga yoki turnikni mukammal ushlashni ta'minlaydi.",
      s: { "Tarkibi": "Toza farmatsevtik magniy karbonat", "Xususiyati": "Quruq tutqich, qadoq kamroq" } }
  ];
  var GUIDES = [
    { id: "g1", badge: "Gantellar", time: "4 daqiqa", rel: [1, 2, 3], title: "Qanday gantel tanlash kerak?", sum: "Geksagonal, yig'iladigan yoki smart regulyatorli — farqi va qaysi biri sizga mos.",
      html: "<h4>1. Geksagonal rezinali gantellar</h4><p>Zamonaviy zallar va uy mashg'ulotlarining eng mashhur turi.</p><ul><li><strong>Dumalamaydi:</strong> 6 qirrali shakli tufayli polda tinch turadi.</li><li><strong>Polni asraydi:</strong> qalin rezina laminat va kafelni himoya qiladi, shovqin chiqarmaydi.</li><li><strong>Kimga mos:</strong> doimiy shug'ullanuvchilar uchun.</li></ul><h4>2. Yig'iladigan vintli gantellar</h4><p>Disklar sonini o'zgartirib vaznni sozlash mumkin.</p><ul><li><strong>Joy tejaydi:</strong> bitta chamadon xonaning burchagida.</li><li><strong>Byudjetbop:</strong> har bir vazn uchun alohida gantel shart emas.</li><li><strong>Kamchiligi:</strong> disklarni almashtirishga 1–2 daqiqa ketadi.</li></ul><h4>3. Smart regulyatorli gantellar</h4><p>Taglikka qo'yib tutqichni burasangiz — 2 soniyada 2.5 kg dan 24 kg gacha.</p><ul><li><strong>Tezlik:</strong> dropset va supersetlarda vaznni bir zumda almashtirish.</li><li><strong>15 xil gantel bittada.</strong></li></ul>" },
    { id: "g2", badge: "Shtangalar", time: "5 daqiqa", rel: [4, 5, 6], title: "Shtanga va grif turlari: qaysi mashqqa qaysi biri?", sum: "Olimpiya grifi, EZ-grif va trap bar — farqlari va mashqlardagi o'rni.",
      html: "<h4>1. Olimpiya grifi (220 sm, 20 kg)</h4><p>Dunyo standarti: uzunligi 220 sm, og'irligi 20 kg, vtulkalari 50 mm. Podshipniklar disklarni erkin aylantiradi va bilakni asraydi.</p><h4>2. EZ qiyshiq grif</h4><p>To'g'ri shtanga bilan bicepsga ishlaganda bilakka noqulay buralish tushadi. EZ-grif qo'llarni tabiiy burchakda ushlash imkonini beradi.</p><h4>3. Trap bar (hex bar)</h4><p>Stanovaya tyagada og'irlik markazini tananing o'rtasiga joylashtiradi:</p><ul><li>belga tushadigan yuk kamayadi;</li><li>oyoq va son mushaklari ko'proq ishlaydi;</li><li>katta vaznlarni xavfsizroq ko'tarish mumkin.</li></ul>" },
    { id: "g3", badge: "Vazn tanlash", time: "3 daqiqa", rel: [2, 1, 9], title: "Qaysi vazndan boshlash kerak?", sum: "Erkaklar va ayollar uchun maqsadga qarab boshlang'ich og'irlik jadvali.",
      html: "<h4>Yangi boshlovchilar uchun tavsiyalar</h4><table><thead><tr><th>Yo'nalish</th><th>Gantel (har biri)</th><th>Shtanga (grif + disk)</th></tr></thead><tbody><tr><td>Erkaklar (boshlovchi)</td><td>6 – 10 kg</td><td>30 – 45 kg</td></tr><tr><td>Erkaklar (o'rta)</td><td>12 – 22 kg</td><td>50 – 90 kg</td></tr><tr><td>Ayollar (fitnes / tonus)</td><td>2 – 5 kg</td><td>15 – 25 kg</td></tr><tr><td>Ayollar (oyoq / dumba)</td><td>6 – 10 kg</td><td>25 – 40 kg</td></tr></tbody></table><p><strong>Oltin qoida:</strong> tanlangan vazn bilan mashqni 10–12 marta to'g'ri texnikada bajara olmasangiz — vazn ortiqcha. 15 martadan keyin ham charchamasangiz — og'irlikni 5–10% ga oshiring.</p>" }
  ];
  var FREE = 1000000;
  var byId = function (id) { return P.filter(function (p) { return p.id === +id; })[0]; };
  var catOf = function (id) { return CATS.filter(function (c) { return c.id === id; })[0]; };

  /* ---------------- HELPERS ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var num = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); };
  var fmt = function (n) { return num(n) + " so'm"; };
  var off = function (p) { return Math.round((1 - p.price / p.old) * 100); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var G = window.gsap && !RM ? window.gsap : null;
  if (G && window.ScrollTrigger) G.registerPlugin(window.ScrollTrigger);
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  function priceHTML(p) {
    return '<div class="price"><b>' + fmt(p.price) + "</b>" + (p.old > p.price ? "<s>" + num(p.old) + "</s><span class=\"off\">−" + off(p) + "%</span>" : "") + "</div>";
  }

  /* ---------------- PRODUCT DRAWINGS (placeholders for real photos) ---------------- */
  function sv(inner, label) {
    return '<svg class="art" viewBox="0 0 400 260" role="img" aria-label="' + esc(label || "Mahsulot chizmasi") + '">' + inner + "</svg>";
  }
  var shadow = function (rx) { return '<ellipse class="shd" cx="200" cy="238" rx="' + (rx || 150) + '" ry="7"/>'; };
  var ART = {
    hex: function () {
      var head = function (x) {
        return '<rect class="k" x="' + x + '" y="62" width="64" height="140" rx="5"/><rect class="hi" x="' + x + '" y="62" width="64" height="30" rx="5"/><rect class="k2" x="' + x + '" y="172" width="64" height="30" rx="5"/><text class="tx" font-size="15" text-anchor="middle" transform="translate(' + (x + 37) + ' 132) rotate(-90)">10 KG</text>';
      };
      return shadow(160) + '<rect class="st" x="112" y="122" width="176" height="18" rx="3"/><rect x="150" y="122" width="100" height="18" fill="url(#knurl)"/>' +
        '<rect class="ch" x="112" y="104" width="10" height="54" rx="2"/><rect class="ch" x="278" y="104" width="10" height="54" rx="2"/>' + head(48) + head(288);
    },
    smart: function () {
      var o = shadow(170) + '<rect class="k2" x="36" y="186" width="328" height="34" rx="8"/><rect class="hi" x="36" y="186" width="328" height="6" rx="3"/>';
      for (var i = 0; i < 8; i++) {
        var h = 64 + i * 9, cls = i % 2 ? "hi" : "k";
        o += '<rect class="' + cls + '" x="' + (52 + i * 12) + '" y="' + (130 - h / 2) + '" width="10" height="' + h + '" rx="2"/>';
        o += '<rect class="' + cls + '" x="' + (338 - i * 12) + '" y="' + (130 - h / 2) + '" width="10" height="' + h + '" rx="2"/>';
      }
      o += '<rect class="st" x="148" y="121" width="104" height="18" rx="4"/><rect class="ac" x="146" y="88" width="6" height="84" rx="2"/><rect class="ac" x="248" y="88" width="6" height="84" rx="2"/>';
      o += '<text class="tx" x="200" y="210" font-size="11" text-anchor="middle">2.5 — 24 KG</text>';
      return o;
    },
    chrome: function () {
      var o = shadow(170) + '<rect class="st" x="30" y="124" width="340" height="12" rx="3"/><rect x="150" y="124" width="100" height="12" fill="url(#knurl)"/>';
      var discs = [[118, 14], [118, 14], [100, 12], [100, 12], [84, 10]], xl = 134, xr = 266;
      discs.forEach(function (d) {
        xl -= d[1] + 2; o += '<rect class="ch" x="' + xl + '" y="' + (130 - d[0] / 2) + '" width="' + d[1] + '" height="' + d[0] + '" rx="2"/><rect class="ln" x="' + xl + '" y="' + (130 - d[0] / 2) + '" width="' + d[1] + '" height="' + d[0] + '" rx="2"/>';
        o += '<rect class="ch" x="' + xr + '" y="' + (130 - d[0] / 2) + '" width="' + d[1] + '" height="' + d[0] + '" rx="2"/><rect class="ln" x="' + xr + '" y="' + (130 - d[0] / 2) + '" width="' + d[1] + '" height="' + d[0] + '" rx="2"/>';
        xr += d[1] + 2;
      });
      o += '<rect class="hi" x="' + (xl - 16) + '" y="116" width="14" height="28" rx="3"/><rect class="hi" x="' + (xr + 2) + '" y="116" width="14" height="28" rx="3"/>';
      o += '<rect class="hi" x="134" y="112" width="8" height="36" rx="2"/><rect class="hi" x="258" y="112" width="8" height="36" rx="2"/>';
      return o;
    },
    oly: function () {
      return shadow(185) + '<rect class="st" x="12" y="125" width="376" height="10" rx="2"/><rect x="140" y="125" width="120" height="10" fill="url(#knurl)"/>' +
        '<rect class="st" x="12" y="118" width="82" height="24" rx="3"/><rect class="st" x="306" y="118" width="82" height="24" rx="3"/>' +
        '<rect class="ch" x="92" y="110" width="9" height="40" rx="2"/><rect class="ch" x="299" y="110" width="9" height="40" rx="2"/>' +
        '<rect class="ac" x="190" y="125" width="20" height="10"/><text class="tx" x="200" y="178" font-size="12" text-anchor="middle" style="fill:#8b8f95">220 SM · 20 KG · 50 MM</text>';
    },
    ez: function () {
      return shadow(170) + '<rect class="st" x="30" y="118" width="70" height="24" rx="3"/><rect class="st" x="300" y="118" width="70" height="24" rx="3"/>' +
        '<rect class="ch" x="98" y="110" width="9" height="40" rx="2"/><rect class="ch" x="293" y="110" width="9" height="40" rx="2"/>' +
        '<path d="M105 130 H140 L162 112 L184 148 L200 130 L216 112 L238 148 L260 130 H295" fill="none" stroke="#9a9da2" stroke-width="11" stroke-linejoin="round"/>' +
        '<text class="tx" x="200" y="186" font-size="12" text-anchor="middle" style="fill:#8b8f95">120 SM · W</text>';
    },
    trap: function () {
      return shadow(175) + '<rect class="st" x="8" y="122" width="72" height="16" rx="3"/><rect class="st" x="320" y="122" width="72" height="16" rx="3"/>' +
        '<polygon points="125,62 275,62 325,130 275,198 125,198 75,130" fill="none" stroke="#2a2c2f" stroke-width="16" stroke-linejoin="round"/>' +
        '<polygon points="125,62 275,62 325,130 275,198 125,198 75,130" fill="none" stroke="#4a4d52" stroke-width="2" stroke-linejoin="round"/>' +
        '<rect class="st" x="132" y="100" width="12" height="60" rx="3"/><rect class="st" x="256" y="100" width="12" height="60" rx="3"/>' +
        '<rect class="ac" x="132" y="122" width="12" height="16"/><rect class="ac" x="256" y="122" width="12" height="16"/>';
    },
    bumper: function () {
      var o = shadow(170), cols = ["var(--p5)", "var(--p10)", "var(--p15)", "var(--p20)"], lab = ["5", "10", "15", "20"];
      for (var i = 0; i < 4; i++) {
        var cx = 270 - i * 40;
        o += '<circle class="k" cx="' + cx + '" cy="130" r="98"/><circle cx="' + cx + '" cy="130" r="98" fill="none" stroke="#3c3f43" stroke-width="2"/>';
        o += '<circle cx="' + cx + '" cy="130" r="84" fill="none" stroke="' + cols[i] + '" stroke-width="3" opacity=".9"/>';
      }
      o += '<circle class="ch" cx="150" cy="130" r="24"/><circle class="k2" cx="150" cy="130" r="13"/>';
      o += '<text x="150" y="80" font-size="26" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" fill="var(--p20)">20</text><text class="tx" x="150" y="198" font-size="11" text-anchor="middle">KG · HI-TEMP</text>';
      return o;
    },
    trigrip: function () {
      var o = shadow(120) + '<circle class="k" cx="200" cy="128" r="106"/><circle cx="200" cy="128" r="92" fill="none" stroke="#3c3f43" stroke-width="2"/>';
      [0, 120, 240].forEach(function (a) {
        o += '<rect class="hi" x="-30" y="-12" width="60" height="24" rx="12" transform="translate(200 128) rotate(' + a + ') translate(0 -64)"/>';
      });
      o += '<circle class="ch" cx="200" cy="128" r="26"/><circle class="k2" cx="200" cy="128" r="14"/><text class="tx" x="200" y="214" font-size="12" text-anchor="middle">20 KG</text>';
      return o;
    },
    kettle: function () {
      return shadow(90) + '<path d="M142 132 C138 46 262 46 258 132" fill="none" stroke="#1c1d1f" stroke-width="24" stroke-linecap="round"/>' +
        '<path d="M142 132 C138 46 262 46 258 132" fill="none" stroke="#3c3f43" stroke-width="3" stroke-linecap="round" transform="translate(0 -9)"/>' +
        '<circle class="k" cx="200" cy="164" r="70"/><rect class="k" x="150" y="214" width="100" height="16" rx="4"/><ellipse class="hi" cx="176" cy="140" rx="18" ry="28" opacity=".5"/>' +
        '<text class="tx" x="200" y="176" font-size="28" text-anchor="middle">16</text><text class="tx" x="200" y="196" font-size="10" text-anchor="middle" style="fill:#8b8f95">KG</text>';
    },
    bench: function () {
      return shadow(170) + '<rect class="hi" x="70" y="170" width="250" height="10" rx="2"/>' +
        '<path d="M86 178 L64 226 M300 178 L330 226" stroke="#3c3f43" stroke-width="10" stroke-linecap="round"/><rect class="k2" x="40" y="222" width="60" height="8" rx="3"/><rect class="k2" x="300" y="222" width="56" height="8" rx="3"/><circle class="ch" cx="350" cy="226" r="8"/>' +
        '<rect class="k" x="56" y="146" width="132" height="24" rx="9"/><g transform="rotate(-30 192 158)"><rect class="k" x="192" y="146" width="168" height="24" rx="9"/></g>' +
        '<path d="M214 178 L240 140" stroke="#8c9096" stroke-width="7"/><rect class="ac" x="96" y="184" width="40" height="8" rx="2"/>';
    },
    rack: function () {
      var o = shadow(160) + '<rect class="k2" x="78" y="216" width="84" height="12" rx="3"/><rect class="k2" x="238" y="216" width="84" height="12" rx="3"/><rect class="hi" x="112" y="208" width="176" height="8"/>';
      o += '<rect class="hi" x="110" y="26" width="18" height="194"/><rect class="hi" x="272" y="26" width="18" height="194"/>';
      for (var y = 40; y < 200; y += 14) o += '<circle cx="119" cy="' + y + '" r="2.4" fill="#16181a"/><circle cx="281" cy="' + y + '" r="2.4" fill="#16181a"/>';
      o += '<path d="M106 92 h26 v-12" fill="none" stroke="var(--c)" stroke-width="6"/><path d="M294 92 h-26 v-12" fill="none" stroke="var(--c)" stroke-width="6"/>';
      o += '<rect class="st" x="30" y="78" width="340" height="9" rx="2"/><rect class="st" x="88" y="150" width="224" height="8" rx="2"/>';
      return o;
    },
    belt: function () {
      return shadow(150) + '<ellipse cx="200" cy="130" rx="150" ry="74" fill="none" stroke="#1c1d1f" stroke-width="38"/>' +
        '<ellipse cx="200" cy="130" rx="150" ry="74" fill="none" stroke="#3c3f43" stroke-width="1.5" stroke-dasharray="5 5" transform="translate(0 0) scale(1)" opacity=".9"/>' +
        '<ellipse cx="200" cy="130" rx="164" ry="88" fill="none" stroke="#3c3f43" stroke-width="1.5" stroke-dasharray="5 5"/>' +
        '<rect class="ch" x="172" y="182" width="56" height="44" rx="5"/><rect class="k2" x="180" y="192" width="40" height="12" rx="2"/><rect class="ac" x="180" y="208" width="40" height="6" rx="2"/>' +
        '<text class="tx" x="200" y="70" font-size="12" text-anchor="middle">10 MM</text>';
    },
    collar: function () {
      var c = function (x) {
        return '<circle cx="' + x + '" cy="122" r="44" fill="none" stroke="#1c1d1f" stroke-width="22"/><circle cx="' + x + '" cy="122" r="33" fill="none" stroke="#9a9da2" stroke-width="3"/>' +
          '<rect class="k" x="' + (x - 9) + '" y="160" width="18" height="58" rx="6"/><rect class="ac" x="' + (x - 9) + '" y="200" width="18" height="12" rx="3"/>';
      };
      return shadow(140) + c(132) + c(268);
    },
    chalk: function () {
      var o = shadow(110) + '<polygon points="112,82 150,52 324,52 288,82" fill="#ffffff" stroke="#cfcdc6"/><polygon points="288,82 324,52 324,170 288,200" fill="#dcdad3" stroke="#cfcdc6"/>' +
        '<rect x="112" y="82" width="176" height="118" fill="#f3f2ee" stroke="#cfcdc6"/>';
      for (var i = 0; i < 26; i++) o += '<circle cx="' + (120 + (i * 37) % 160) + '" cy="' + (90 + (i * 53) % 100) + '" r="1.4" fill="#d6d4cd"/>';
      o += '<text class="tl" x="200" y="140" font-size="18" text-anchor="middle">MgCO₃</text><text class="tl" x="200" y="162" font-size="11" text-anchor="middle" style="fill:#6b6d70">56 G</text>';
      return o;
    }
  };
  function art(p) { var c = catOf(p.cat); return sv(ART[p.art](), p.name).replace('class="art"', 'class="art" style="--c:' + c.c + '"'); }

  /* ---------------- CART ---------------- */
  var cart = store.get("ts_cart") || [];
  function cartKey(id, size) { return id + (size ? ":" + size : ""); }
  function cartTotal() { return cart.reduce(function (t, l) { return t + byId(l.id).price * l.q; }, 0); }
  function cartQty() { return cart.reduce(function (t, l) { return t + l.q; }, 0); }
  function add(id, q, size, fromEl, silent) {
    var p = byId(id); if (!p) return;
    if (p.sizes && !size) size = "M";
    var k = cartKey(id, size), line = cart.filter(function (l) { return l.k === k; })[0];
    if (line) line.q += q || 1; else cart.push({ k: k, id: p.id, q: q || 1, size: size || null });
    saveCart();
    if (fromEl) fly(fromEl);
    var cb = $("#cartBtn"); cb.classList.remove("bump"); void cb.offsetWidth; cb.classList.add("bump");
    if (!silent) toast(p.name.split(" (")[0] + " savatda", true);
  }
  function saveCart() { store.set("ts_cart", cart); renderCart(); }
  function fly(el) {
    if (RM || !el.getBoundingClientRect) return;
    var a = el.getBoundingClientRect(), target = window.innerWidth <= 960 ? $("#mbarCart") : $("#cartBtn"), b = target.getBoundingClientRect();
    var d = document.createElement("i"); d.className = "fly"; document.body.appendChild(d);
    var x0 = a.left + a.width / 2 - 9, y0 = a.top + a.height / 2 - 9, x1 = b.left + b.width / 2 - 9, y1 = b.top + b.height / 2 - 9;
    var an = d.animate([
      { transform: "translate(" + x0 + "px," + y0 + "px) scale(1)" },
      { transform: "translate(" + (x0 + (x1 - x0) * .5) + "px," + (Math.min(y0, y1) - 80) + "px) scale(1.2)", offset: .5 },
      { transform: "translate(" + x1 + "px," + y1 + "px) scale(.4)", opacity: .6 }
    ], { duration: 700, easing: "cubic-bezier(.5,0,.3,1)" });
    an.onfinish = function () { d.remove(); };
  }
  function renderCart() {
    var n = cartQty(), t = cartTotal();
    $("#cartCount").textContent = n; $("#cartN").textContent = n ? "(" + n + ")" : "";
    $("#mbarSum").textContent = n ? num(t) : "0";
    $("#cartTotal").textContent = fmt(t);
    var left = FREE - t, ship = $("#ship");
    ship.classList.toggle("done", left <= 0);
    $("#shipTxt").innerHTML = left > 0 ? "Bepul yetkazishgacha yana <b>" + fmt(left) + "</b>" : "<b>Yetkazish bepul.</b> Toshkent bo'ylab — 3 soatda.";
    $("#shipBar").style.width = Math.min(100, t / FREE * 100) + "%";
    var cl = $("#clist");
    if (!cart.length) {
      cl.innerHTML = '<li class="cempty"><p>Savat hozircha bo\'sh.</p><p style="margin-top:8px"><a href="#catalog" data-close>Katalogga o\'tish →</a></p></li>';
      $("#toCheckout").hidden = true; $("#checkout").hidden = true;
    } else {
      cl.innerHTML = cart.map(function (l) {
        var p = byId(l.id);
        return '<li class="ci" data-k="' + l.k + '"><div class="th">' + art(p) + '</div><div><b>' + esc(p.name) + '</b><span class="v">' + esc(p.w) + (l.size ? " · o'lcham " + l.size : "") + '</span><div class="qty"><button data-dq="-1" aria-label="Kamaytirish">−</button><span>' + l.q + '</span><button data-dq="1" aria-label="Ko\'paytirish">+</button></div></div><div class="r"><b>' + fmt(p.price * l.q) + '</b><button class="rm" data-rm>O\'chirish</button></div></li>';
      }).join("");
      if ($("#checkout").hidden) $("#toCheckout").hidden = false;
    }
    // upsell: accessories that complete a barbell setup
    var ids = cart.map(function (l) { return l.id; }), ups = [];
    var hasBar = ids.some(function (i) { return [4, 5, 6, 7, 8].indexOf(i) > -1; });
    if (cart.length) {
      (hasBar ? [13, 12, 14] : [14, 13]).forEach(function (i) { if (ids.indexOf(i) < 0 && ups.length < 2) ups.push(i); });
    }
    $("#upsell").innerHTML = ups.length ? '<p class="mono">Ko\'pincha birga olinadi</p>' + ups.map(function (i) {
      var p = byId(i); return '<div class="up"><div class="th">' + art(p) + '</div><div><b>' + esc(p.name) + '</b><span>' + fmt(p.price) + '</span></div><button data-add="' + i + '">+ Qo\'shish</button></div>';
    }).join("") : "";
  }
  $("#clist").addEventListener("click", function (e) {
    var li = e.target.closest(".ci"); if (!li) return;
    var line = cart.filter(function (l) { return l.k === li.dataset.k; })[0]; if (!line) return;
    if (e.target.closest("[data-dq]")) { line.q += +e.target.closest("[data-dq]").dataset.dq; if (line.q < 1) cart.splice(cart.indexOf(line), 1); saveCart(); }
    if (e.target.closest("[data-rm]")) { cart.splice(cart.indexOf(line), 1); saveCart(); }
  });
  var drawer = $("#cart"), scrim = $("#scrim"), lastFocus;
  function openCart() {
    lastFocus = document.activeElement; scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.add("on"); drawer.classList.add("open"); });
    drawer.setAttribute("aria-hidden", "false"); drawer.focus(); document.body.style.overflow = "hidden";
  }
  function closeCart() {
    scrim.classList.remove("on"); drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
    setTimeout(function () { scrim.hidden = true; }, 350); if (lastFocus) lastFocus.focus();
  }
  $("#cartBtn").addEventListener("click", openCart);
  $("#mbarCart").addEventListener("click", openCart);
  scrim.addEventListener("click", closeCart);
  drawer.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeCart(); });
  $("#toCheckout").addEventListener("click", function () { this.hidden = true; $("#checkout").hidden = false; $("#checkout input").focus(); });
  $("#checkout").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, ok = true;
    ["name", "phone", "addr"].forEach(function (n) { if (!f[n].value.trim()) { ok = false; f[n].style.borderColor = "var(--red)"; } else f[n].style.borderColor = ""; });
    if (!ok) return;
    $("#clist").innerHTML = '<li class="cempty"><p style="font-weight:800;color:var(--ink);font-size:1.1rem">Rahmat, ' + esc(f.name.value.trim()) + '!</p><p style="margin-top:8px">Bu prototip: buyurtma hech qayerga yuborilmadi. Tayyor saytda u shu zahoti do\'kon Telegram chatiga va admin panelga tushadi, menejer ' + esc(f.phone.value.trim()) + ' raqamiga qo\'ng\'iroq qiladi.</p><p style="margin-top:12px"><a href="https://t.me/titansport_admin" target="_blank" rel="noopener">Hozir Telegram\'da yozish →</a></p></li>';
    f.hidden = true; $("#upsell").innerHTML = "";
  });

  /* ---------------- TOAST ---------------- */
  var tt;
  function toast(msg, withCart) {
    var t = $("#toast");
    t.innerHTML = "<span>" + esc(msg) + "</span>" + (withCart ? '<button type="button">Savatni ochish</button>' : "");
    t.classList.add("on"); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove("on"); }, 2600);
    var b = t.querySelector("button"); if (b) b.onclick = function () { t.classList.remove("on"); openCart(); };
  }

  /* ---------------- GLOBAL CLICK DELEGATION ---------------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-add]");
    if (a) {
      e.preventDefault(); add(+a.dataset.add, 1, null, a);
      if (a.classList.contains("addb")) { a.classList.add("ok"); a.textContent = "✓"; setTimeout(function () { a.classList.remove("ok"); a.textContent = "+"; }, 1400); }
      return;
    }
    var q = e.target.closest("[data-qv]");
    if (q) { e.preventDefault(); openQV(+q.dataset.qv); return; }
    var c = e.target.closest("[data-cat]");
    if (c) { e.preventDefault(); setCat(c.dataset.cat); closeMenus(); $("#catalog").scrollIntoView({ behavior: RM ? "auto" : "smooth" }); return; }
    var dc = e.target.closest("[data-dclose]");
    if (dc) { dc.closest("dialog").close(); }
  });

  /* ---------------- NAV / MEGA / MOBILE ---------------- */
  var counts = {}, minP = {};
  P.forEach(function (p) { counts[p.cat] = (counts[p.cat] || 0) + 1; minP[p.cat] = Math.min(minP[p.cat] || 1e12, p.price); });
  $("#megaGrid").innerHTML = CATS.map(function (c) {
    return '<a class="mega__c" href="#catalog" data-cat="' + c.id + '"><i class="disc" style="--c:' + c.c + '"></i><div><b>' + c.name + '</b><span>' + counts[c.id] + ' ta · ' + num(minP[c.id]) + " so'mdan</span></div></a>";
  }).join("");
  $("#mnavCats").innerHTML = CATS.map(function (c) { return '<a href="#catalog" data-cat="' + c.id + '"><i class="disc" style="--c:' + c.c + '"></i>' + (c.short || c.name) + "</a>"; }).join("");
  $("#ftrCats").innerHTML = CATS.map(function (c) { return '<li><a href="#catalog" data-cat="' + c.id + '">' + c.name + "</a></li>"; }).join("");
  var megaBtn = $("#megaBtn"), mega = $("#mega"), megaT;
  function setMega(o) { mega.classList.toggle("open", o); megaBtn.setAttribute("aria-expanded", o); }
  megaBtn.addEventListener("click", function () { setMega(!mega.classList.contains("open")); });
  var mItem = $(".nav__item--mega");
  if (window.matchMedia("(hover:hover)").matches) {
    mItem.addEventListener("mouseenter", function () { clearTimeout(megaT); setMega(true); });
    mItem.addEventListener("mouseleave", function () { megaT = setTimeout(function () { setMega(false); }, 180); });
  }
  var burger = $("#burger"), mnav = $("#mnav");
  burger.addEventListener("click", function () {
    var o = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", o); mnav.hidden = !o; document.body.style.overflow = o ? "hidden" : "";
  });
  mnav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenus(); });
  function closeMenus() { setMega(false); if (burger.getAttribute("aria-expanded") === "true") { burger.setAttribute("aria-expanded", "false"); mnav.hidden = true; document.body.style.overflow = ""; } }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeMenus(); if (drawer.classList.contains("open")) closeCart(); }
    if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".nav__item--mega")) setMega(false); });

  // header hide on scroll; mobile bar show
  var hdr = $("#hdr"), mbar = $("#mbar"), lastY = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    hdr.classList.toggle("is-scrolled", y > 10);
    hdr.classList.toggle("is-hidden", y > 600 && y > lastY && !mega.classList.contains("open"));
    mbar.classList.toggle("show", y > window.innerHeight * .6);
    lastY = y;
  }, { passive: true });

  /* ---------------- HERO BARBELL ---------------- */
  var PC = { 20: "var(--p20)", 15: "var(--p15)", 10: "var(--p10)", 5: "var(--p5)" };
  var heroLoad = [], heroKgShown = 20;
  function heroDraw(animIdx) {
    var H = { 20: 300, 15: 250, 10: 210, 5: 160 }, W = { 20: 34, 15: 28, 10: 22, 5: 16 };
    var xl = 206, xr = 694, L = "", R = "";
    heroLoad.forEach(function (w, i) {
      var h = H[w], wd = W[w], y = 180 - h / 2, light = w === 15 || w === 5;
      xl -= wd + 2;
      var plate = function (x, side) {
        return '<g class="hp" data-i="' + i + '" data-side="' + side + '"><rect x="' + x + '" y="' + y + '" width="' + wd + '" height="' + h + '" rx="5" fill="' + PC[w] + '"/><rect x="' + x + '" y="' + y + '" width="' + wd + '" height="' + h + '" rx="5" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="2"/><rect x="' + (x + 3) + '" y="' + (y + 8) + '" width="' + (wd - 6) + '" height="' + (h - 16) + '" rx="3" fill="rgba(255,255,255,.07)"/><text x="' + (x + wd / 2) + '" y="180" transform="rotate(-90 ' + (x + wd / 2) + ' 180)" text-anchor="middle" dominant-baseline="middle" font-family="JetBrains Mono" font-weight="700" font-size="' + (wd > 20 ? 13 : 10) + '" fill="' + (light ? "#111" : "#fff") + '">' + w + "</text></g>";
      };
      L += plate(xl, "l"); R += plate(xr, "r"); xr += wd + 2;
    });
    $("#heroPlatesL").innerHTML = L; $("#heroPlatesR").innerHTML = R;
    if (animIdx != null && G) {
      G.from('#heroPlatesL .hp[data-i="' + animIdx + '"]', { x: -140, opacity: 0, duration: .6, ease: "power3.out" });
      G.from('#heroPlatesR .hp[data-i="' + animIdx + '"]', { x: 140, opacity: 0, duration: .6, ease: "power3.out" });
    }
    var sum = heroLoad.reduce(function (a, b) { return a + b; }, 0), total = 20 + sum * 2;
    $("#heroFormula").textContent = "20 kg grif + " + sum * 2 + " kg disk" + (heroLoad.length ? " (" + heroLoad.join("+") + " ×2)" : "");
    countTo($("#heroKg"), heroKgShown, total, .6); heroKgShown = total;
  }
  function countTo(el, from, to, dur) {
    if (!G) { el.textContent = num(to); return; }
    var o = { v: from }; G.to(o, { v: to, duration: dur, ease: "power2.out", onUpdate: function () { el.textContent = (Math.round(o.v * 10) / 10).toString(); } });
  }
  $$(".hero__plates button").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.dataset.hp;
      if (v === "reset") { heroLoad = []; heroDraw(); return; }
      var used = heroLoad.reduce(function (a, w) { return a + ({ 20: 36, 15: 30, 10: 24, 5: 18 })[w]; }, 0);
      if (used + ({ 20: 36, 15: 30, 10: 24, 5: 18 })[v] > 150) { toast("Vtulkada joy qolmadi — avval tozalang"); return; }
      heroLoad.push(+v); heroDraw(heroLoad.length - 1);
    });
  });
  // hero "where do you train" → advisor with answer preset
  $$(".hero__place button").forEach(function (b) {
    b.addEventListener("click", function () { adv.a.loc = b.dataset.place; adv.step = 1; renderAdv(); $("#advisor").scrollIntoView({ behavior: RM ? "auto" : "smooth" }); });
  });
  // subtle tilt following the pointer
  if (G && window.matchMedia("(pointer:fine)").matches) {
    var stage = $("#heroStage");
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      G.to("#heroBar", { rotation: x * 4, y: y * 10, duration: .8, ease: "power3.out" });
    });
    stage.addEventListener("pointerleave", function () { G.to("#heroBar", { rotation: 0, y: 0, duration: 1, ease: "elastic.out(1,.5)" }); });
    $$(".magnet").forEach(function (m) {
      m.addEventListener("pointermove", function (e) { var r = m.getBoundingClientRect(); G.to(m, { x: (e.clientX - r.left - r.width / 2) * .2, y: (e.clientY - r.top - r.height / 2) * .3, duration: .4 }); });
      m.addEventListener("pointerleave", function () { G.to(m, { x: 0, y: 0, duration: .6, ease: "elastic.out(1,.4)" }); });
    });
  }

  /* ---------------- INTRO ---------------- */
  var seen = false; try { seen = sessionStorage.getItem("ts_intro") === "1"; } catch (e) {}
  function heroIn() {
    heroLoad = [20, 15, 10];
    if (G) {
      G.from(".hero__h .ln>span", { yPercent: 110, duration: 1, ease: "power4.out", stagger: .09 });
      G.from(".eyebrow,.hero__sub,.hero__cta,.hero__place", { y: 24, opacity: 0, duration: .9, ease: "power3.out", stagger: .08, delay: .25 });
      G.from("#heroBar", { scale: .92, opacity: 0, duration: 1, ease: "power3.out" });
      heroLoad = []; heroDraw(); var seq = [20, 15, 10];
      seq.forEach(function (w, i) { setTimeout(function () { heroLoad.push(w); heroDraw(heroLoad.length - 1); }, 450 + i * 200); });
    } else heroDraw();
  }
  if (!G || seen) {
    document.body.classList.add("no-intro"); document.body.classList.remove("is-loading"); heroIn();
  } else {
    try { sessionStorage.setItem("ts_intro", "1"); } catch (e) {}
    var o = { v: 0 }, tl = G.timeline({ onComplete: function () { $("#intro").remove(); document.body.classList.remove("is-loading"); } });
    tl.from(".intro .ip1", { x: function (i) { return i ? 160 : -160; }, opacity: 0, duration: .45, ease: "power3.out", stagger: 0 }, .1)
      .from(".intro .ip2", { x: function (i) { return i ? 160 : -160; }, opacity: 0, duration: .45, ease: "power3.out" }, .3)
      .from(".intro .ip3", { x: function (i) { return i ? 160 : -160; }, opacity: 0, duration: .45, ease: "power3.out" }, .5)
      .to(o, { v: 140, duration: .95, ease: "power2.out", onUpdate: function () { $("#introKg").textContent = Math.round(o.v); } }, .1)
      .to(".intro__bar", { y: -10, duration: .3, ease: "power2.out" }, 1.15)
      .to("#intro", { yPercent: -100, duration: .8, ease: "power4.inOut" }, 1.4)
      .add(heroIn, 1.65);
    $("#intro").addEventListener("click", function () { tl.progress(1); });
  }

  /* ---------------- CATEGORY RACK ---------------- */
  $("#rack").innerHTML = CATS.map(function (c) {
    return '<a href="#catalog" class="rk" data-cat="' + c.id + '"' + (c.light ? " data-light" : "") + ' style="--c:' + c.c + '"><div class="rk__plate"><span class="kg">' + c.kg + ' KG</span><span class="nm">' + (c.short || c.name).split(" ")[0] + '</span></div><div class="rk__t"><b>' + c.name + '</b><span>' + counts[c.id] + " ta · " + num(minP[c.id]) + " so'mdan</span></div></a>";
  }).join("");

  /* ---------------- SPOTLIGHT ---------------- */
  var SPOT = [2, 7, 4, 10, 1], spotI = 0, spotT;
  $("#spotList").innerHTML = SPOT.map(function (id, i) {
    var p = byId(id); return '<li class="sl" data-i="' + i + '"><button type="button" aria-label="' + esc(p.name) + '"><span class="n">0' + (i + 1) + '</span><span class="t">' + esc(p.name) + '</span><span class="p">' + num(p.price) + '</span></button><span class="bar"></span></li>';
  }).join("");
  function spot(i, user) {
    spotI = i; var p = byId(SPOT[i]), c = catOf(p.cat), st = $("#spotStage");
    $$(".sl").forEach(function (li, j) { li.classList.toggle("on", j === i); var b = li.querySelector(".bar"); b.style.animation = "none"; void b.offsetWidth; b.style.animation = ""; });
    var html = '<div class="ss" style="--c:' + c.c + '"><div class="ss__top"><span class="mono ss__tag"><i></i>' + c.name + '</span><span class="mono" style="color:var(--mute)">' + esc(p.badge) + '</span></div><div class="ss__art">' + art(p) + '</div><div class="ss__bot"><div><p class="ss__name">' + esc(p.name) + '</p><p class="mono ss__spec">' + esc(p.w) + " · " + esc(p.dim) + "</p>" + priceHTML(p) + '</div><div class="ss__act"><button class="btn btn--ghost" data-qv="' + p.id + '"><span>Batafsil</span></button><button class="btn btn--red" data-add="' + p.id + '"><span>Savatga</span><i>+</i></button></div></div></div>';
    var old = st.querySelector(".ss");
    st.insertAdjacentHTML("beforeend", html);
    var nw = st.lastElementChild;
    if (G) {
      if (old) G.to(old, { opacity: 0, x: -40, duration: .4, ease: "power2.in", onComplete: function () { old.remove(); } });
      G.from(nw.querySelector(".ss__art svg"), { x: 120, rotation: 6, opacity: 0, duration: .8, ease: "power3.out", delay: .1 });
      G.from(nw.querySelectorAll(".ss__top,.ss__bot"), { y: 16, opacity: 0, duration: .5, stagger: .06, delay: .15 });
    } else if (old) old.remove();
    clearTimeout(spotT);
    if (!RM) spotT = setTimeout(function () { if (!spotHover) spot((spotI + 1) % SPOT.length); else spot(spotI); }, 5000);
  }
  var spotHover = false;
  $$(".sl").forEach(function (li) {
    var i = +li.dataset.i, b = li.querySelector("button");
    b.addEventListener("click", function () { spot(i, true); });
    if (window.matchMedia("(hover:hover)").matches) b.addEventListener("mouseenter", function () { if (spotI !== i) spot(i, true); });
  });
  $(".spot__grid").addEventListener("mouseenter", function () { spotHover = true; });
  $(".spot__grid").addEventListener("mouseleave", function () { spotHover = false; });
  spot(0);

  /* ---------------- ANATOMY ---------------- */
  $("#anatPrice").textContent = fmt(byId(4).price);
  var callouts = $$(".callout"), anat = $("#anat");
  function anatStep(s) { anat.dataset.s = s; callouts.forEach(function (c) { c.classList.toggle("on", +c.dataset.step <= s); }); }
  if (G && window.ScrollTrigger) {
    var mm = G.matchMedia();
    mm.add("(min-width: 761px)", function () {
      anatStep(-1);
      window.ScrollTrigger.create({
        trigger: ".anat__pin", start: "top top", end: "+=1800", pin: true, scrub: true,
        onUpdate: function (self) { var p = self.progress; $("#anatProg").style.transform = "scaleX(" + p + ")"; anatStep(Math.min(3, Math.floor(p * 4.6) - 0)); }
      });
      G.fromTo(".anat__svg", { scale: .86 }, { scale: 1.04, ease: "none", scrollTrigger: { trigger: ".anat__pin", start: "top top", end: "+=1800", scrub: true } });
      return function () { anatStep(3); };
    });
    mm.add("(max-width: 760px)", function () { anatStep(3); });
    // hero bar drifts as you scroll away
    G.to(".hero__stage", { yPercent: 12, opacity: .35, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  } else anatStep(3);

  /* ---------------- BUILDER ---------------- */
  var BARS = [{ id: 4, label: "Olimpiya grifi", kg: 20, max: 450 }, { id: 5, label: "EZ-grif", kg: 8.5, max: 180 }, { id: 6, label: "Trap bar", kg: 22, max: 350 }];
  var bState = { bar: 0, plates: [] };
  $("#barSeg").insertAdjacentHTML("beforeend", BARS.map(function (b, i) {
    return '<label class="barop"><input type="radio" name="bar" value="' + i + '"' + (i ? "" : " checked") + '><b>' + b.label + '</b><span>' + b.kg + " kg · maks " + b.max + "</span></label>";
  }).join(""));
  $("#pbtns").innerHTML = [20, 15, 10, 5].map(function (w) { return '<button data-p="' + w + '" style="--c:' + PC[w] + '" aria-label="' + w + ' kg disk qo\'shish">' + w + "</button>"; }).join("");
  $$('input[name="bar"]').forEach(function (r) { r.addEventListener("change", function () { bState.bar = +r.value; bRender(); }); });
  var WD = { 20: 22, 15: 18, 10: 14, 5: 10 }, HT = { 20: 176, 15: 148, 10: 124, 5: 96 };
  $("#pbtns").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return; var w = +b.dataset.p;
    var used = bState.plates.reduce(function (a, p) { return a + WD[p] + 2; }, 0);
    if (used + WD[w] > 140) { $("#bWarn").textContent = "Vtulkada joy qolmadi."; return; }
    var bar = BARS[bState.bar], tot = bar.kg + 2 * (bState.plates.reduce(function (a, b) { return a + b; }, 0) + w);
    if (tot > bar.max) { $("#bWarn").textContent = bar.label + " uchun maksimal yuklama — " + bar.max + " kg."; return; }
    bState.plates.push(w); bRender(true);
  });
  $("#bUndo").addEventListener("click", function () { bState.plates.pop(); bRender(); });
  $("#bClear").addEventListener("click", function () { bState.plates = []; bRender(); });
  var bShown = 20;
  function bRender(anim) {
    var bar = BARS[bState.bar], s = bState.plates.reduce(function (a, b) { return a + b; }, 0), total = bar.kg + 2 * s;
    $("#bWarn").textContent = "";
    $("#bEq").textContent = bar.kg + " kg grif" + (s ? " + 2 × (" + bState.plates.join(" + ") + ") kg" : "");
    countTo($("#bTotal"), bShown, total, .5); bShown = total;
    // svg
    var cy = 110, o = "";
    if (bar.id === 5) o += '<rect x="170" y="104" width="360" height="12" fill="none"/><path d="M170 110 H260 L285 94 L310 126 L350 94 L375 126 L400 110 H530" stroke="#9a9da2" stroke-width="10" fill="none" stroke-linejoin="round"/>';
    else if (bar.id === 6) o += '<polygon points="250,40 450,40 510,110 450,180 250,180 190,110" fill="none" stroke="#3c3f43" stroke-width="12" stroke-linejoin="round"/><rect x="268" y="80" width="10" height="60" rx="3" fill="url(#steel)"/><rect x="422" y="80" width="10" height="60" rx="3" fill="url(#steel)"/>';
    else o += '<rect x="170" y="104" width="360" height="12" fill="url(#steel)"/><rect x="290" y="104" width="120" height="12" fill="url(#knurl)"/>';
    o += '<rect x="20" y="101" width="152" height="18" rx="3" fill="url(#steel)"/><rect x="528" y="101" width="152" height="18" rx="3" fill="url(#steel)"/><rect x="168" y="90" width="9" height="40" rx="2" fill="#a9abaf"/><rect x="523" y="90" width="9" height="40" rx="2" fill="#a9abaf"/>';
    var xl = 168, xr = 532;
    bState.plates.forEach(function (w, i) {
      var h = HT[w], wd = WD[w]; xl -= wd + 2;
      var last = anim && i === bState.plates.length - 1;
      o += '<rect class="bp' + (last ? " nl" : "") + '" x="' + xl + '" y="' + (cy - h / 2) + '" width="' + wd + '" height="' + h + '" rx="4" fill="' + PC[w] + '" stroke="rgba(0,0,0,.3)"/>';
      o += '<rect class="bp' + (last ? " nr" : "") + '" x="' + xr + '" y="' + (cy - h / 2) + '" width="' + wd + '" height="' + h + '" rx="4" fill="' + PC[w] + '" stroke="rgba(0,0,0,.3)"/>';
      xr += wd + 2;
    });
    $("#bSvg").innerHTML = o;
    if (anim && G) { G.from("#bSvg .nl", { x: -120, opacity: 0, duration: .45, ease: "power3.out" }); G.from("#bSvg .nr", { x: 120, opacity: 0, duration: .45, ease: "power3.out" }); }
    // kit from real catalogue
    var kit = [{ id: bar.id, q: 1 }], note = "", c = { 20: 0, 15: 0, 10: 0, 5: 0 };
    bState.plates.forEach(function (w) { c[w]++; });
    if (bState.plates.length) {
      if (!c[15] && !c[10] && !c[5]) kit.push({ id: 8, q: 2 * c[20] });
      else {
        kit.push({ id: 7, q: 1 });
        if (c[20] > 1) kit.push({ id: 8, q: 2 * (c[20] - 1) });
        if (c[15] > 1 || c[10] > 1 || c[5] > 1) note = "15, 10 va 5 kg disklar faqat 100 kg to'plam ichida sotiladi — qo'shimchasini menejerdan so'rang.";
        else note = "To'plamda 2×20, 2×15, 2×10, 2×5 kg — jami 100 kg.";
      }
      kit.push({ id: 13, q: 1 });
    }
    bState.kit = kit;
    $("#bKit").innerHTML = kit.map(function (k) { var p = byId(k.id); return '<li><span class="q">' + k.q + '×</span><span>' + esc(p.name) + '</span><span class="pr">' + num(p.price * k.q) + "</span></li>"; }).join("") + (bState.plates.length ? "" : '<li class="empty">Disk qo\'shing — mos disklar va qisqichlar shu yerda paydo bo\'ladi.</li>');
    $("#bSum").textContent = fmt(kit.reduce(function (t, k) { return t + byId(k.id).price * k.q; }, 0));
    $("#bNote").textContent = note;
  }
  $("#bAdd").addEventListener("click", function () {
    bState.kit.forEach(function (k) { add(k.id, k.q, null, null, true); });
    fly(this); toast("To'plam savatga qo'shildi", true);
  });
  bRender();

  /* ---------------- CATALOG ---------------- */
  var fState = { cat: "all", q: "", sort: "pop" };
  $("#chips").innerHTML = '<button class="chip" data-f="all" aria-pressed="true">Hammasi <small>' + P.length + "</small></button>" + CATS.map(function (c) {
    return '<button class="chip" data-f="' + c.id + '" aria-pressed="false" style="--c:' + c.c + '"><i></i>' + (c.short || c.name) + " <small>" + counts[c.id] + "</small></button>";
  }).join("");
  $("#chips").addEventListener("click", function (e) { var b = e.target.closest(".chip"); if (b) setCat(b.dataset.f); });
  function setCat(id) { fState.cat = id; $$(".chip").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.f === id); }); renderGrid(); }
  $("#q").addEventListener("input", function () { fState.q = this.value.trim().toLowerCase(); renderGrid(); });
  $("#sort").addEventListener("change", function () { fState.sort = this.value; renderGrid(); });
  function match(p, q) { return !q || (p.name + " " + p.w + " " + catOf(p.cat).name + " " + p.mat).toLowerCase().indexOf(q) > -1; }
  function card(p) {
    var c = catOf(p.cat);
    return '<article class="pc" style="--c:' + c.c + '"><div class="pc__art" data-qv="' + p.id + '">' + art(p) + '<span class="pc__badge">' + esc(p.badge) + '</span><button class="pc__qv" data-qv="' + p.id + '">Tez ko\'rish</button></div><div class="pc__b"><span class="mono pc__cat"><i></i>' + (c.short || c.name) + '</span><h3 class="pc__n" data-qv="' + p.id + '">' + esc(p.name) + '</h3><span class="pc__s">' + esc(p.w) + " · " + esc(p.mat) + '</span><div class="pc__f"><div>' + priceHTML(p) + '<span class="stock">Omborda bor</span></div><button class="addb" data-add="' + p.id + '" aria-label="' + esc(p.name) + ' — savatga">+</button></div></div></article>';
  }
  function renderGrid() {
    var list = P.filter(function (p) { return (fState.cat === "all" || p.cat === fState.cat) && match(p, fState.q); });
    if (fState.sort === "asc") list.sort(function (a, b) { return a.price - b.price; });
    if (fState.sort === "desc") list.sort(function (a, b) { return b.price - a.price; });
    if (fState.sort === "kg") list.sort(function (a, b) { return b.kg - a.kg; });
    if (fState.sort === "pop") list.sort(function (a, b) { return (b.feat ? 1 : 0) - (a.feat ? 1 : 0); });
    $("#grid").innerHTML = list.length ? list.map(card).join("") : '<div class="empty-s"><p>Hech narsa topilmadi.</p><p class="mini">Boshqa so\'z bilan qidiring yoki <a href="tel:+998907775544">qo\'ng\'iroq qiling</a> — kerakli anjomni topib beramiz.</p></div>';
    $("#catCount").textContent = list.length + " ta mahsulot" + (fState.cat !== "all" ? " · " + catOf(fState.cat).name : "");
    if (G) G.from("#grid .pc", { y: 30, opacity: 0, duration: .6, ease: "power3.out", stagger: .04, clearProps: "all" });
  }
  renderGrid();

  /* ---------------- QUICK VIEW ---------------- */
  var REL = { 1: [3, 10], 2: [10, 14], 3: [1, 10], 4: [7, 13], 5: [8, 13], 6: [8, 13], 7: [4, 13], 8: [4, 13], 9: [14, 12], 10: [2, 1], 11: [4, 7], 12: [14, 4], 13: [4, 7], 14: [12, 9] };
  var qv = $("#qv");
  function openQV(id) {
    var p = byId(id), c = catOf(p.cat), qty = 1, size = p.sizes ? null : null;
    var specs = Object.assign({ "Vazn": p.w, "Material": p.mat, "O'lcham / shakl": p.dim }, p.s);
    $("#qvIn").innerHTML = '<button class="ibtn qv__x" data-dclose aria-label="Yopish">✕</button><div class="qv__art" style="--c:' + c.c + '">' + art(p) + '<p class="hero__note mono">Chizma — haqiqiy foto bilan almashtiriladi</p></div><div class="qv__b"><span class="mono pc__cat" style="--c:' + c.c + '"><i></i>' + c.name + '</span><h2 id="qvTitle">' + esc(p.name) + "</h2>" + priceHTML(p) + '<span class="stock">Omborda bor · Toshkent bo\'ylab 3 soatda</span><p>' + esc(p.d) + "</p>" +
      (p.sizes ? '<div><p class="mono" style="color:#6b6d70;margin-bottom:8px">O\'lcham</p><div class="sizes" role="group" aria-label="O\'lcham">' + p.sizes.map(function (s) { return '<button type="button" aria-pressed="false" data-size="' + s + '">' + s + "</button>"; }).join("") + "</div></div>" : "") +
      '<div class="qv__buy"><div class="qty--lg"><button type="button" data-q="-1" aria-label="Kamaytirish">−</button><span id="qvQ">1</span><button type="button" data-q="1" aria-label="Ko\'paytirish">+</button></div><button class="btn btn--red" id="qvAdd"><span>Savatga qo\'shish</span><i>+</i></button></div>' +
      '<div class="qv__trust"><span>To\'lov qabul qilganda: naqd, Click, Payme</span><span>1 000 000 so\'mdan yetkazish bepul</span></div>' +
      '<dl class="specs">' + Object.keys(specs).map(function (k) { return "<div><dt>" + esc(k) + "</dt><dd>" + esc(specs[k]) + "</dd></div>"; }).join("") + "</dl>" +
      '<div><p class="mono" style="color:#6b6d70;margin-bottom:6px">Birga oling</p>' + REL[p.id].map(function (r) { var rp = byId(r); return '<div class="up"><div class="th">' + art(rp) + '</div><div><b>' + esc(rp.name) + '</b><span>' + fmt(rp.price) + '</span></div><button data-add="' + r + '">+ Qo\'shish</button></div>'; }).join("") + "</div></div>";
    var inn = $("#qvIn");
    inn.querySelectorAll("[data-q]").forEach(function (b) { b.onclick = function () { qty = Math.max(1, qty + +b.dataset.q); $("#qvQ").textContent = qty; }; });
    inn.querySelectorAll("[data-size]").forEach(function (b) {
      b.onclick = function () { size = b.dataset.size; inn.querySelectorAll("[data-size]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); };
    });
    $("#qvAdd").onclick = function () {
      if (p.sizes && !size) { toast("Avval o'lchamni tanlang"); inn.querySelector(".sizes").animate([{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "none" }], 300); return; }
      add(p.id, qty, size, this); qv.close();
    };
    if (sd.open) sd.close();
    if (!qv.open) qv.showModal();
    inn.scrollTop = 0;
  }
  [qv, $("#gd"), $("#notes"), $("#sd")].forEach(function (d) { d.addEventListener("click", function (e) { if (e.target === d) d.close(); }); });

  /* ---------------- SEARCH ---------------- */
  var sd = $("#sd");
  function openSearch() { sd.showModal(); $("#sdq").value = ""; renderSD(""); $("#sdq").focus(); }
  $("#searchBtn").addEventListener("click", openSearch);
  $("#sdq").addEventListener("input", function () { renderSD(this.value.trim().toLowerCase()); });
  function renderSD(q) {
    var list = P.filter(function (p) { return match(p, q); }).slice(0, 8);
    $("#sdr").innerHTML = list.length ? list.map(function (p) { return '<li><button data-qv="' + p.id + '"><span class="th">' + art(p) + "</span><b>" + esc(p.name) + "</b><span>" + num(p.price) + "</span></button></li>"; }).join("") : '<li class="mini" style="padding:12px">Topilmadi. <a href="https://t.me/titansport_admin" target="_blank" rel="noopener">Telegram\'da so\'rang →</a></li>';
  }

  /* ---------------- ADVISOR ---------------- */
  var QS = [
    { k: "loc", q: "Qayerda mashq qilasiz?", o: [["home", "Uyda", "Kvartira yoki kichik xona"], ["garage", "Garaj yoki hovlida", "Kengroq shaxsiy burchak"], ["gym", "Sport zalda", "Klub yoki tijorat zali"]] },
    { k: "goal", q: "Asosiy maqsadingiz?", o: [["mass", "Muskul massasi", "Yelka, qo'l, ko'krak"], ["fat", "Yog' eritish va tonus", "Chidamlilik va relyef"], ["power", "Maksimal kuch", "Prisid, jim, stanovaya"]] },
    { k: "lvl", q: "Tajribangiz qanday?", o: [["beg", "Yangi boshlovchi", "6 oygacha"], ["mid", "O'rta daraja", "1–3 yil muntazam"], ["pro", "Tajribali", "Katta vaznlar"]] }
  ];
  var adv = { step: 0, a: {} };
  function recommend(a) {
    var base = { home: [2, 10], garage: [11, 4, 7], gym: [4, 7, 6] }[a.loc] || [2, 10];
    var extra = { mass: [5, 1], fat: [9, 1], power: [12, 6] }[a.goal] || [];
    if (a.lvl === "beg" && a.loc === "home") base = [1, 10];
    if (a.lvl === "pro") extra = extra.concat([8]);
    var out = [];
    base.concat(extra).forEach(function (i) { if (out.indexOf(i) < 0) out.push(i); });
    if (out.some(function (i) { return [4, 6].indexOf(i) > -1; })) out.push(13);
    return out.slice(0, 4);
  }
  function renderAdv() {
    var card = $("#advCard"), html;
    $$(".adv__steps i").forEach(function (d, i) { d.classList.toggle("on", i <= adv.step); });
    if (adv.step < 3) {
      var Q = QS[adv.step];
      html = '<div class="aq"><p class="mono">Savol ' + (adv.step + 1) + " / 3</p><h3>" + Q.q + '</h3><div class="aopts">' + Q.o.map(function (o, i) {
        return '<button class="aopt" data-v="' + o[0] + '"><span class="k">' + String.fromCharCode(65 + i) + "</span><span><b>" + o[1] + "</b><span>" + o[2] + '</span></span><span class="ar">→</span></button>';
      }).join("") + "</div></div>" + (adv.step ? '<button class="back" data-back>← Orqaga</button>' : "");
    } else {
      var rec = recommend(adv.a), tot = rec.reduce(function (t, i) { return t + byId(i).price; }, 0);
      html = '<div class="ares"><p class="mono" style="color:var(--mute)">Sizga mos to\'plam</p><h3 style="font-weight:800;font-size:1.6rem;line-height:1.1">' + QS[0].o.filter(function (o) { return o[0] === adv.a.loc; })[0][1] + " · " + QS[1].o.filter(function (o) { return o[0] === adv.a.goal; })[0][1].toLowerCase() + "</h3><ul>" + rec.map(function (i) {
        var p = byId(i); return '<li><span class="th">' + art(p) + '</span><b>' + esc(p.name) + '</b><span class="pr">' + num(p.price) + "</span></li>";
      }).join("") + '</ul><div class="ares__sum"><span>Jami</span><strong>' + fmt(tot) + '</strong></div><div class="ares__act"><button class="btn btn--red" id="advAll"><span>Hammasini savatga</span><i>+</i></button><a class="btn btn--ghost" href="https://t.me/titansport_admin" target="_blank" rel="noopener"><span>Mutaxassisdan so\'rash</span></a></div></div><button class="back" data-restart>↺ Qaytadan</button>';
    }
    card.innerHTML = html;
    if (G) G.from(card.children, { y: 18, opacity: 0, duration: .5, stagger: .06, ease: "power3.out" });
    var all = $("#advAll"); if (all) all.onclick = function () { recommend(adv.a).forEach(function (i) { add(i, 1, null, null, true); }); fly(all); toast("To'plam savatga qo'shildi", true); };
  }
  $("#advCard").addEventListener("click", function (e) {
    var o = e.target.closest(".aopt");
    if (o) { adv.a[QS[adv.step].k] = o.dataset.v; adv.step++; renderAdv(); return; }
    if (e.target.closest("[data-back]")) { adv.step--; renderAdv(); }
    if (e.target.closest("[data-restart]")) { adv = { step: 0, a: {} }; renderAdv(); }
  });
  renderAdv();

  /* ---------------- GUIDES ---------------- */
  $("#glist").innerHTML = GUIDES.map(function (g, i) {
    return '<button class="gi" data-g="' + i + '"><span class="n">0' + (i + 1) + " · " + g.badge + "</span><h3>" + g.title + "</h3><p>" + g.sum + '</p><span class="t">' + g.time + " →</span></button>";
  }).join("");
  $("#glist").addEventListener("click", function (e) {
    var b = e.target.closest(".gi"); if (!b) return; var g = GUIDES[+b.dataset.g];
    $("#gdIn").innerHTML = '<button class="ibtn gd__x" data-dclose aria-label="Yopish">✕</button><p class="mono sh__k">' + g.badge + " · " + g.time + "</p><h2>" + g.title + "</h2>" + g.html + '<div class="gd__rel"><p class="mono sh__k">Qo\'llanmadagi mahsulotlar</p><div class="grid">' + g.rel.map(function (i) { return card(byId(i)); }).join("") + "</div></div>";
    $("#gd").showModal(); $("#gdIn").scrollTop = 0;
  });
  $("#notesBtn").addEventListener("click", function () { $("#notes").showModal(); });

  /* ---------------- CONTACT ---------------- */
  $("#cform").addEventListener("submit", function (e) {
    e.preventDefault(); var f = e.target, ok = true;
    ["name", "phone"].forEach(function (n) { f[n].classList.toggle("bad", !f[n].value.trim()); if (!f[n].value.trim()) ok = false; });
    $("#cformMsg").textContent = ok ? "Rahmat! Prototip: xabar yuborilmadi. Tayyor saytda u Telegram'ga tushadi va mutaxassis qo'ng'iroq qiladi." : "Ism va telefonni kiriting.";
    if (ok) f.reset();
  });

  /* ---------------- REVEALS ---------------- */
  $$(".sh, .rack, .spot__grid, .build__ui, .glist, .terms, .reviews, .cinfo, .cform, .adv__card, .ftr__cols").forEach(function (el) { el.classList.add("rv"); });
  var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -10% 0px" });
  $$(".rv, .flow").forEach(function (el) { io.observe(el); });
  if (G) {
    $$(".rk").forEach(function (r, i) {
      G.from(r.querySelector(".rk__plate"), { x: -200, rotation: -200, opacity: 0, duration: 1.1, ease: "power3.out", delay: i * .08, scrollTrigger: { trigger: "#rack", start: "top 85%" } });
    });
  }

  var trk = $(".util__track"); if (window.matchMedia("(max-width:900px)").matches) trk.insertAdjacentHTML("beforeend", trk.innerHTML.replace(/<span>/g, '<span aria-hidden="true">'));
  renderCart();
})();
