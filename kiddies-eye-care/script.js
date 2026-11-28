/* Kiddies Eye Care – Children's Eye Care illustration concepts (round 3)
   Clean hand-drawn brush-pen line art: one flat colour, no shading, no texture.
   Signature touches from the client's examples: double-line outlines,
   little leaf-shaped tick marks and curly flourishes. */

const COLOURS = {
  rose:  { name: "Rose",     hex: "#DE7480" },
  sun:   { name: "Sunshine", hex: "#EFC23F" },
  sky:   { name: "Sky",      hex: "#7EA8DE" },
  sage:  { name: "Sage",     hex: "#72B39A" },
  lilac: { name: "Lilac",    hex: "#A68BD3" }
};
// "Mixed" gives every option its own colour, like the client's examples
const MIXED = ["rose", "sky", "sun", "sage"];

/* ---------- drawing helpers ---------- */
const f = (n) => Number(n.toFixed(1));
const E = (cx, cy, rx, ry) =>
  `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`;
const C = (cx, cy, r) => E(cx, cy, r, r);

// filled lens-shaped tick mark, like the fold marks on the brain example
function leaf(x, y, len, deg, w = 8) {
  const a = (deg * Math.PI) / 180, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
  const sx = x - dx * len / 2, sy = y - dy * len / 2, ex = x + dx * len / 2, ey = y + dy * len / 2;
  w *= 1.7;
  return `M${f(sx)} ${f(sy)} Q${f(x + nx * w)} ${f(y + ny * w)} ${f(ex)} ${f(ey)} Q${f(x - nx * w)} ${f(y - ny * w)} ${f(sx)} ${f(sy)} Z`;
}
const heart = (x, y, s) =>
  `M${x} ${y + s * 0.9} C${x - s * 1.4} ${y}, ${x - s} ${y - s}, ${x - s * 0.45} ${y - s} C${x - s * 0.15} ${y - s}, ${x} ${y - s * 0.75}, ${x} ${y - s * 0.55} C${x} ${y - s * 0.75}, ${x + s * 0.15} ${y - s}, ${x + s * 0.45} ${y - s} C${x + s} ${y - s}, ${x + s * 1.4} ${y}, ${x} ${y + s * 0.9} Z`;
// open arrow head (like the curly arrows on the brain example)
function arrow(x, y, deg, s = 16) {
  const a = (deg * Math.PI) / 180, b1 = a + 2.5, b2 = a - 2.5;
  return `M${f(x + Math.cos(b1) * s)} ${f(y + Math.sin(b1) * s)} L${x} ${y} L${f(x + Math.cos(b2) * s)} ${f(y + Math.sin(b2) * s)}`;
}

/* Each concept lists:
   line:  [path, width]   single brush line
   tube:  [path, width]   double-line outline (drawn as colour + white core)
   solid: path            solid colour fill (pupils, nose, ticks)
   white: path            white highlight on top
   cover: path            white "paper" that hides lines behind (drawn first) */
const CONCEPTS = [
  {
    key: "patch-pal",
    title: "Patch Pal",
    idea: "A teddy with an eye patch. Gentle and comforting, and a nod to lazy-eye care.",
    line: [
      ["M238 143 C 228 100, 168 98, 168 146 C 168 166, 180 180, 200 186", 7],
      ["M362 143 C 372 100, 432 98, 432 146 C 432 166, 420 180, 400 186", 7],
      ["M300 126 C 362 126, 408 166, 408 222 C 408 280, 360 318, 300 318 C 240 318, 192 280, 192 222 C 192 168, 234 128, 288 126", 7],
      ["M300 232 C 330 232, 346 248, 346 264 C 346 282, 326 296, 300 296 C 274 296, 254 282, 254 264 C 254 250, 266 236, 290 233", 6],
      ["M300 262 L300 274 M284 278 Q292 287 300 276 Q308 287 316 278", 5],
      [E(346, 206, 32, 28), 7],
      ["M318 192 C 300 164, 272 148, 244 143", 5], ["M378 200 L407 205", 5],
      [heart(346, 208, 11), 5],
      ["M452 166 C 472 158, 466 128, 478 118", 5],
      [heart(488, 102, 13), 5]
    ],
    solid: [
      "M286 246 Q300 236 314 246 Q312 260 300 262 Q288 260 286 246 Z",
      C(256, 208, 9),
      leaf(196, 150, 26, -70, 5), leaf(404, 150, 26, -110, 5),
      leaf(222, 248, 18, -15, 4), leaf(236, 256, 14, -15, 3.5)
    ],
    white: [C(259, 205, 3)]
  },
  {
    key: "little-specs",
    title: "Little Specs",
    idea: "A happy child in round glasses. It says “eye care for kids” at a glance.",
    line: [
      ["M190 214 C 176 130, 240 92, 300 94 C 362 92, 426 130, 410 214", 7],
      ["M196 196 C 226 190, 246 172, 256 152 C 270 176, 296 180, 314 160 C 330 182, 360 184, 376 160 C 384 180, 396 192, 406 196", 6],
      ["M298 96 C 290 72, 318 64, 322 84", 6],
      ["M190 214 C 190 290, 240 328, 300 328 C 360 328, 410 290, 410 214", 7],
      ["M192 216 C 168 208, 166 246, 194 250", 6], ["M408 216 C 432 208, 434 246, 406 250", 6],
      ["M274 290 Q300 314 326 290", 7]
    ],
    tube: [
      [C(254, 234, 38), 16], [C(346, 234, 38), 16],
      ["M290 228 Q300 216 310 228", 14], ["M216 228 L196 222", 14], ["M384 228 L404 222", 14]
    ],
    solid: [
      C(256, 238, 9), C(344, 238, 9),
      leaf(222, 284, 18, -10, 4), leaf(378, 284, 18, 10, 4),
      leaf(450, 120, 26, -45, 5), leaf(468, 150, 22, -15, 4.5), leaf(436, 94, 20, -70, 4.5)
    ],
    white: [C(259, 235, 3), C(347, 235, 3)]
  },
  {
    key: "bear-specs",
    title: "Bear Specs",
    idea: "Kids’ glasses with little bear ears and a smile. Playful, simple and very Kiddies.",
    line: [
      ["M158 207 C 112 190, 150 120, 204 164", 7],
      ["M442 207 C 488 190, 450 120, 396 164", 7],
      ["M192 206 Q200 194 214 192", 5], ["M348 206 Q356 194 370 192", 5],
      ["M274 304 Q300 324 326 304", 7],
      [heart(300, 168, 13), 6]
    ],
    tube: [
      [C(222, 230, 60), 17], [C(378, 230, 60), 17],
      ["M282 222 Q300 206 318 222", 15],
      ["M162 220 L136 212", 15], ["M438 220 L464 212", 15]
    ],
    solid: [
      leaf(166, 176, 22, -50, 4), leaf(434, 176, 22, -130, 4),
      leaf(196, 214, 10, -40, 3), leaf(352, 214, 10, -40, 3),
      leaf(150, 120, 22, -60, 4.5), leaf(132, 150, 20, -25, 4.5),
      leaf(450, 120, 22, -120, 4.5), leaf(468, 150, 20, -155, 4.5)
    ],
    white: []
  },
  {
    key: "eye-balloon",
    title: "Eye Balloon",
    idea: "A balloon with a bright, happy eye. Fun, childlike and easy to read at a small size.",
    line: [
      ["M300 300 C 240 290, 210 232, 212 180 C 214 124, 254 88, 300 88 C 346 88, 386 124, 388 180 C 390 232, 360 290, 304 300", 7],
      ["M292 312 L300 300 L308 312 Z", 6],
      ["M300 314 C 286 330, 318 340, 302 356 C 290 368, 314 374, 304 390", 5],
      ["M244 186 C 266 154, 334 154, 356 186 C 334 218, 266 218, 244 186 Z", 6],
      [C(300, 186, 21), 6],
      ["M262 160 L254 148", 5], ["M300 150 L300 136", 5], ["M338 160 L346 148", 5]
    ],
    solid: [
      C(300, 186, 9),
      leaf(246, 128, 30, -55, 5), leaf(236, 154, 12, -75, 3.5),
      leaf(420, 110, 24, -40, 4.5), leaf(436, 140, 20, -10, 4.5), leaf(404, 86, 18, -70, 4)
    ],
    white: [C(305, 181, 3.5)]
  }
];

/* ---------- SVG builder ---------- */
function buildSVG(concept, hex, { width, height } = {}) {
    const size = width ? ` width="${width}" height="${height}"` : "";
  const g = (list, fn) => (list || []).map(fn).join("");
  const stroke = (d, w, col) =>
    `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const body = `
    ${g(concept.cover, (d) => `<path d="${d}" fill="#fff"/>`)}
    <g>
      ${g(concept.tube, ([d, w]) => stroke(d, w, hex))}
      ${g(concept.tube, ([d, w]) => stroke(d, Math.max(w - 10, 4), "#fff"))}
      ${g(concept.line, ([d, w]) => stroke(d, w * 1.3, hex))}
      ${g(concept.solid, (d) => `<path d="${d}" fill="${hex}"/>`)}
      ${g(concept.white, (d) => `<path d="${d}" fill="#fff"/>`)}
    </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="40 30 520 380"${size} role="img" aria-label="${concept.title}: Children's Eye Care illustration">
${body}</svg>`;
}

/* ---------- page ---------- */
let mode = "mixed";
try { mode = localStorage.getItem("kec-colour-r3") || "mixed"; } catch (e) {}
if (mode !== "mixed" && !COLOURS[mode]) mode = "mixed";

const colourFor = (i) => COLOURS[mode === "mixed" ? MIXED[i % MIXED.length] : mode];
const grid = document.getElementById("concepts");
const strip = document.getElementById("strip");

function render() {
  grid.innerHTML = CONCEPTS.map((c, i) => {
    const col = colourFor(i);
    return `
    <article class="concept">
      <div class="art">${buildSVG(c, col.hex)}</div>
      <div class="meta">
        <h3><span class="opt">Option ${String.fromCharCode(65 + i)}</span> ${c.title}</h3>
        <p>${c.idea}</p>
        <div class="dl">
          <button type="button" data-dl="svg" data-i="${i}">Download SVG</button>
          <button type="button" data-dl="png" data-i="${i}">Download PNG</button>
        </div>
      </div>
    </article>`;
  }).join("");

  strip.innerHTML = CONCEPTS.map((c, i) => `
    <figure class="tab-card">
      <div class="tab-art">${buildSVG(c, colourFor(i).hex)}</div>
      <figcaption><strong>Children's Eye Care</strong><span>Option ${String.fromCharCode(65 + i)} · ${c.title}</span></figcaption>
    </figure>`).join("");

  document.querySelectorAll("[data-col]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.col === mode)));
}

document.getElementById("palettes").addEventListener("click", (e) => {
  const b = e.target.closest("[data-col]");
  if (!b) return;
  mode = b.dataset.col;
  try { localStorage.setItem("kec-colour-r3", mode); } catch (err) {}
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
  const i = +b.dataset.i, c = CONCEPTS[i], col = colourFor(i);
  const name = `kiddies-childrens-eye-care-${c.key}-${col.name.toLowerCase()}`;
  const svg = buildSVG(c, col.hex, { width: 1560, height: 1140 });
  if (b.dataset.dl === "svg") return save(new Blob([svg], { type: "image/svg+xml" }), name + ".svg");
  const img = new Image();
  img.onload = () => {
    const cv = document.createElement("canvas");
    cv.width = 1560; cv.height = 1140;
    const ctx = cv.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.drawImage(img, 0, 0, cv.width, cv.height);
    cv.toBlob((blob) => save(blob, name + ".png"), "image/png");
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
});

render();
