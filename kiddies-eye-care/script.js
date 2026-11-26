/* Kiddies Eye Care – Children's Eye Care illustration concepts (round 2)
   Original hand-built crayon artwork: rough crayon outline + soft crayon shading. */

const PALETTES = {
  blue:    { name: "Soft blue",      line: "#6D9AD6", shade: "#8DB3E6" },
  purple:  { name: "Purple",         line: "#7B22A8", shade: "#9C4FC6" },
  mustard: { name: "Blue + mustard", line: "#4A6FAE", shade: "#E1A92C" }
};

/* ---------- drawing helpers ---------- */
const E = (cx, cy, rx, ry) =>
  `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`;
const C = (cx, cy, r) => E(cx, cy, r, r);
const pops = (cx, cy, r, deg, spread = 30) =>
  [deg - spread, deg, deg + spread].map((d, i) => {
    const a = (d * Math.PI) / 180, r0 = r + (i === 1 ? 4 : 0), len = i === 1 ? 34 : 26;
    const f = (n) => n.toFixed(1);
    return [`M${f(cx + Math.cos(a) * r0)} ${f(cy + Math.sin(a) * r0)} L${f(cx + Math.cos(a) * (r0 + len))} ${f(cy + Math.sin(a) * (r0 + len))}`, 9];
  });

const sparkle = (x, y, s) =>
  `M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z`;

const heart = (x, y, s) =>
  `M${x} ${y + s * 0.9} C${x - s * 1.4} ${y}, ${x - s} ${y - s}, ${x - s * 0.45} ${y - s} C${x - s * 0.15} ${y - s}, ${x} ${y - s * 0.75}, ${x} ${y - s * 0.55} C${x} ${y - s * 0.75}, ${x + s * 0.15} ${y - s}, ${x + s * 0.45} ${y - s} C${x + s} ${y - s}, ${x + s * 1.4} ${y}, ${x} ${y + s * 0.9} Z`;

/* A layer = { base: white "paper" fills that hide what is behind,
               shade: soft crayon shading, dense: heavier shading,
               solid: solid crayon fills, line: [ [path, width], ... ], white: highlights } */

/* ---------- the four concepts ---------- */
const CONCEPTS = [
  {
    key: "little-specs",
    title: "Little Specs",
    idea: "A happy child in round glasses – instantly says “eye care for kids”.",
    layers: [{
      shade: [E(226, 288, 17, 9), E(374, 288, 17, 9), C(254, 232, 40), C(346, 232, 40), sparkle(138, 112, 18), sparkle(474, 306, 11)],
      dense: ["M190 214 C 176 130, 240 92, 300 94 C 362 92, 426 130, 410 214 C 395 196, 380 180, 372 160 C 358 184, 330 186, 318 166 C 300 188, 268 188, 258 160 C 246 182, 222 196, 190 214 Z"],
      solid: [C(256, 238, 13), C(344, 238, 13)],
      white: [C(261, 232, 4.5), C(349, 232, 4.5)],
      line: [
        ["M190 214 C 176 130, 240 92, 300 94 C 362 92, 426 130, 410 214 C 395 196, 380 180, 372 160 C 358 184, 330 186, 318 166 C 300 188, 268 188, 258 160 C 246 182, 222 196, 190 214 Z", 8],
        ["M296 96 C 286 70, 318 60, 324 84", 7],
        ["M190 214 C 190 290, 240 328, 300 328 C 360 328, 410 290, 410 214", 8],
        ["M192 214 C 166 206, 164 246, 194 250", 7], ["M408 214 C 434 206, 436 246, 406 250", 7],
        [C(254, 232, 40), 8], [C(346, 232, 40), 8],
        ["M292 228 Q300 216 308 228", 7], ["M214 226 L193 220", 7], ["M386 226 L407 220", 7],
        ["M230 214 Q238 202 250 200", 4], ["M322 214 Q330 202 342 200", 4],
        ["M272 290 Q300 316 328 290", 8],
        [sparkle(138, 112, 18), 4], [sparkle(474, 306, 11), 4],
        ...pops(300, 222, 146, -40)
      ]
    }]
  },
  {
    key: "patch-pal",
    title: "Patch Pal",
    idea: "A teddy wearing an eye patch – a gentle, comforting nod to lazy-eye (amblyopia) care.",
    layers: [{
      shade: [E(196, 142, 17, 20), E(404, 142, 17, 20), E(300, 272, 52, 36), E(228, 260, 16, 9), heart(486, 118, 16)],
      dense: [E(350, 206, 36, 31)],
      solid: [
        "M286 250 Q300 238 314 250 Q312 264 300 266 Q288 264 286 250 Z",
        C(254, 210, 12)
      ],
      white: [C(258, 205, 4.2), C(296, 249, 3)],
      line: [
        ["M234 138 C 222 92, 160 90, 160 140 C 160 165, 172 182, 188 188", 8],
        ["M366 138 C 378 92, 440 90, 440 140 C 440 165, 428 182, 412 188", 8],
        ["M184 156 C 178 132, 196 118, 212 128", 5], ["M416 156 C 422 132, 404 118, 388 128", 5],
        [E(300, 228, 122, 108), 8],
        [E(300, 272, 52, 36), 7],
        ["M300 266 L300 280 M280 284 Q290 294 300 282 Q310 294 320 284", 6],
        [E(350, 206, 36, 31), 7],
        ["M322 186 C 300 150, 270 136, 240 135", 6], ["M385 200 L419 204", 6],
        [heart(350, 208, 12), 4],
        [heart(486, 118, 16), 5],
        ...pops(300, 228, 150, -150)
      ]
    }]
  },
  {
    key: "peek-a-boo",
    title: "Peek-a-boo",
    idea: "A child covering one eye – the playful side of the cover test every child does.",
    layers: [
      {
        shade: [E(226, 272, 16, 9), "M260 280 Q282 306 306 282 Q284 290 260 280 Z", sparkle(512, 92, 13)],
        dense: [
          "M194 210 C 182 132, 244 100, 300 100 C 356 100, 418 132, 406 210 C 392 176, 360 150, 300 156 C 262 150, 220 168, 194 210 Z",
          "M196 156 C 156 140, 126 178, 138 222 C 148 208, 158 204, 170 208 C 168 192, 176 178, 192 170 Z",
          "M404 156 C 444 140, 474 178, 462 222 C 452 208, 442 204, 430 208 C 432 192, 424 178, 408 170 Z"
        ],
        solid: [C(254, 228, 15), E(200, 160, 9, 11), E(400, 160, 9, 11)],
        white: [C(259, 222, 5)],
        line: [
          ["M194 210 C 182 132, 244 100, 300 100 C 356 100, 418 132, 406 210 C 392 176, 360 150, 300 156 C 262 150, 220 168, 194 210 Z", 8],
          ["M300 102 L292 152", 5],
          ["M196 156 C 156 140, 126 178, 138 222 C 148 208, 158 204, 170 208 C 168 192, 176 178, 192 170", 8],
          ["M404 156 C 444 140, 474 178, 462 222 C 452 208, 442 204, 430 208 C 432 192, 424 178, 408 170", 8],
          ["M160 168 C 150 182, 148 196, 152 206 M440 168 C 450 182, 452 196, 448 206", 4],
          ["M194 210 C 194 290, 244 326, 300 326 C 356 326, 406 290, 406 210", 8],
          ["M236 212 L228 203", 5], ["M250 207 L248 196", 5], ["M265 209 L270 199", 5],
          ["M260 280 Q282 306 306 282 Q284 290 260 280 Z", 7],
          ["M474 252 L474 296 M474 252 L502 252 M474 274 L496 274 M474 296 L502 296", 9],
          [sparkle(512, 92, 13), 4],
          ...pops(300, 224, 150, -95, 28)
        ]
      },
      {
        // the hand + sleeve sit in front of the face
        base: [
          "M326 290 L374 288 L398 370 L340 372 Z",
          "M312 264 L312 204 Q312 190 321 190 Q330 190 330 204 L330 196 Q330 182 339 182 Q348 182 348 196 L348 198 Q348 184 357 184 Q366 184 366 198 L366 208 Q366 196 375 196 Q384 196 384 210 L384 259 Q384 276 368 282 L330 282 Q312 280 312 264 Z M312 244 Q296 236 292 250 Q292 264 312 270 Z"
        ],
        shade: ["M326 290 L374 288 L398 370 L340 372 Z"],
        line: [
          ["M312 264 L312 204 Q312 190 321 190 Q330 190 330 204 L330 196 Q330 182 339 182 Q348 182 348 196 L348 198 Q348 184 357 184 Q366 184 366 198 L366 208 Q366 196 375 196 Q384 196 384 210 L384 259 Q384 276 368 282 L330 282 Q312 280 312 264 Z", 8],
          ["M312 244 Q296 236 292 250 Q292 264 312 270", 7],
          ["M330 204 L330 226 M348 198 L348 222 M366 208 L366 228", 4],
          ["M330 284 C 334 312, 338 340, 340 372", 8], ["M372 282 C 380 310, 390 340, 398 370", 8],
          ["M334 318 Q358 310 386 318", 6]
        ],
        transform: "rotate(-12 348 236)"
      }
    ]
  },
  {
    key: "heart-eye",
    title: "Heart Eye",
    idea: "A bright, friendly eye with a heart for a pupil – caring for little eyes.",
    layers: [{
      shade: [C(300, 218, 62), sparkle(122, 286, 14), heart(492, 104, 15)],
      solid: [heart(300, 226, 26)],
      white: [C(328, 196, 8)],
      line: [
        ["M150 220 C 210 130, 390 130, 450 220", 9],
        ["M150 220 C 210 304, 390 304, 450 220", 9],
        [C(300, 218, 62), 8],
        ["M212 168 L198 146", 7], ["M256 154 L249 129", 7], ["M300 150 L300 124", 7], ["M344 154 L351 129", 7], ["M388 168 L402 146", 7],
        [sparkle(122, 286, 14), 4], [heart(492, 104, 15), 5],
        ...pops(300, 218, 170, -152)
      ]
    }]
  }
];

/* ---------- SVG builder ---------- */
let uid = 0;
function buildSVG(concept, palKey, { width, height } = {}) {
  const P = PALETTES[palKey];
  const id = "k" + (++uid);
  const size = width ? ` width="${width}" height="${height}"` : "";
  const defs = `
  <defs>
    <filter id="${id}-cr" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="w"/>
      <feDisplacementMap in="SourceGraphic" in2="w" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="1" seed="9" result="g"/>
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 2.45" result="ga"/>
      <feComposite in="d" in2="ga" operator="in"/>
    </filter>
    <filter id="${id}-sh" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="11" result="w"/>
      <feDisplacementMap in="SourceGraphic" in2="w" scale="6" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2" result="g"/>
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.6 0 0 0 2.35" result="ga"/>
      <feComposite in="d" in2="ga" operator="in"/>
    </filter>
    <pattern id="${id}-h1" patternUnits="userSpaceOnUse" width="11" height="11" patternTransform="rotate(-38)">
      <path d="M0 2.5 H11 M0 8 H11" stroke="${P.shade}" stroke-width="2.4" stroke-linecap="round"/>
    </pattern>
    <pattern id="${id}-h2" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(-38)">
      <path d="M0 2 H7 M0 5.5 H7" stroke="${P.shade}" stroke-width="2.4" stroke-linecap="round"/>
    </pattern>
  </defs>`;

  const g = (paths, fn) => (paths || []).map(fn).join("");
  const body = concept.layers.map((L) => {
    const lines = g(L.line, ([d, w]) =>
      `<path d="${d}" fill="none" stroke="${P.line}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`);
    const inner = `
      ${g(L.base, (d) => `<path d="${d}" fill="#fff"/>`)}
      <g filter="url(#${id}-sh)">
        ${g(L.shade, (d) => `<path d="${d}" fill="url(#${id}-h1)" opacity=".75"/><path d="${d}" fill="${P.shade}" opacity=".16"/>`)}
        ${g(L.dense, (d) => `<path d="${d}" fill="url(#${id}-h2)" opacity=".85"/><path d="${d}" fill="${P.shade}" opacity=".22"/>`)}
      </g>
      <g filter="url(#${id}-cr)">
        ${g(L.solid, (d) => `<path d="${d}" fill="${P.line}"/>`)}
        ${lines}
        <g transform="translate(1.8 1.2)" opacity=".35">${lines}</g>
        ${g(L.white, (d) => `<path d="${d}" fill="#fff"/>`)}
      </g>`;
    return L.transform ? `<g transform="${L.transform}">${inner}</g>` : inner;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="45 35 510 340"${size} role="img" aria-label="${concept.title} – Children's Eye Care illustration">${defs}${body}</svg>`;
}

/* ---------- page ---------- */
let palette = "blue";
try { palette = localStorage.getItem("kec-palette") || "blue"; } catch (e) {}
if (!PALETTES[palette]) palette = "blue";

const grid = document.getElementById("concepts");
const strip = document.getElementById("strip");

function render() {
  grid.innerHTML = CONCEPTS.map((c, i) => `
    <article class="concept">
      <div class="art">${buildSVG(c, palette)}</div>
      <div class="meta">
        <h3><span class="opt">Option ${String.fromCharCode(65 + i)}</span> ${c.title}</h3>
        <p>${c.idea}</p>
        <div class="dl">
          <button type="button" data-dl="svg" data-i="${i}">Download SVG</button>
          <button type="button" data-dl="png" data-i="${i}">Download PNG</button>
        </div>
      </div>
    </article>`).join("");

  strip.innerHTML = CONCEPTS.map((c, i) => `
    <figure class="tab-card">
      <div class="tab-art">${buildSVG(c, palette)}</div>
      <figcaption><strong>Children's Eye Care</strong><span>Option ${String.fromCharCode(65 + i)} · ${c.title}</span></figcaption>
    </figure>`).join("");

  document.querySelectorAll("[data-pal]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.pal === palette)));
}

document.getElementById("palettes").addEventListener("click", (e) => {
  const b = e.target.closest("[data-pal]");
  if (!b) return;
  palette = b.dataset.pal;
  try { localStorage.setItem("kec-palette", palette); } catch (err) {}
  render();
});

function save(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

grid.addEventListener("click", (e) => {
  const b = e.target.closest("[data-dl]");
  if (!b) return;
  const c = CONCEPTS[+b.dataset.i];
  const name = `kiddies-childrens-eye-care-${c.key}-${palette}`;
  const svg = buildSVG(c, palette, { width: 1800, height: 1200 });
  if (b.dataset.dl === "svg") return save(new Blob([svg], { type: "image/svg+xml" }), name + ".svg");
  const img = new Image();
  img.onload = () => {
    const cv = document.createElement("canvas");
    cv.width = 1800; cv.height = 1200;
    cv.getContext("2d").drawImage(img, 0, 0, 1800, 1200);
    cv.toBlob((blob) => save(blob, name + ".png"), "image/png");
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
});

render();
