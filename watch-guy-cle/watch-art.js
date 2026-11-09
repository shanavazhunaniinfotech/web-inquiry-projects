/* Watch Guy CLE: vector watch "studio renders" used as placeholders
   until Jon supplies his own photos. Pure SVG, no image requests,
   so the mock-up never shows a broken image. */
(function () {
  let n = 0;
  const C = 200, CY = 240;

  const METALS = {
    steel: ["#f6f7f8", "#a7acb1", "#e6e8ea", "#80858b", "#d3d6d9"],
    gold:  ["#fbe9b0", "#b88a35", "#f2d488", "#8f6623", "#e7c573"],
    white: ["#ffffff", "#c3c7cc", "#eef0f2", "#9aa0a6", "#e1e4e7"]
  };
  const INDEX = { steel: "#eef0f2", white: "#f4f3ef", gilt: "#d9b766", green: "#cfd6cf", roman: "#1d1f23" };

  function shade(hex, amt) {
    const v = parseInt(hex.slice(1), 16);
    let r = v >> 16, g = (v >> 8) & 255, b = v & 255;
    const f = (c) => Math.max(0, Math.min(255, Math.round(amt > 0 ? c + (255 - c) * amt : c * (1 + amt))));
    return "#" + [f(r), f(g), f(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
  const pol = (r, deg) => {
    const a = (deg - 90) * Math.PI / 180;
    return [C + r * Math.cos(a), CY + r * Math.sin(a)];
  };
  const f1 = (x) => x.toFixed(1);

  function metalGrad(id, metal, vertical) {
    const s = METALS[metal] || METALS.steel;
    const xy = vertical ? 'x1="0" y1="0" x2="0" y2="1"' : 'x1="0" y1="0" x2="1" y2="1"';
    return `<linearGradient id="${id}" ${xy}>${s.map((c, i) => `<stop offset="${i * 25}%" stop-color="${c}"/>`).join("")}</linearGradient>`;
  }

  function strapSVG(a, u) {
    const kind = a.strap || "oyster";
    const top = "M128 150 L136 -10 L264 -10 L272 150 Z";
    const bot = "M128 330 L136 490 L264 490 L272 330 Z";
    let fill = `url(#${u}m2)`, inner = "";
    const soft = kind === "rubber" || kind === "leather";
    if (soft) {
      fill = a.strapColor || "#222";
      if (kind === "leather") {
        inner = `<path d="M142 -10 L138 150 M258 -10 L262 150 M142 490 L138 330 M258 490 L262 330" stroke="${shade(fill, .35)}" stroke-width="1.4" stroke-dasharray="5 4" fill="none"/>`;
      } else {
        for (let y = 0; y < 150; y += 18) inner += `<rect x="150" y="${y}" width="100" height="9" rx="4.5" fill="${shade(fill, .07)}"/><rect x="150" y="${480 - y - 9}" width="100" height="9" rx="4.5" fill="${shade(fill, .07)}"/>`;
      }
    } else {
      const cols = { oyster: [0, .3, .7, 1], rivet: [0, .3, .7, 1], jubilee: [0, .22, .4, .6, .78, 1], integrated: [0, .33, .67, 1], santos: [0, 1] }[kind] || [0, .3, .7, 1];
      const step = kind === "jubilee" ? 16 : kind === "santos" ? 30 : 28;
      for (let y = -10; y < 500; y += step) {
        if (y > 140 && y < 330) continue;
        inner += `<line x1="120" x2="280" y1="${y}" y2="${y}" stroke="#5d6267" stroke-opacity=".55" stroke-width="1.2"/>`;
      }
      cols.slice(1, -1).forEach((c) => {
        const x = 132 + c * 136;
        inner += `<line x1="${f1(x)}" x2="${f1(x)}" y1="-10" y2="490" stroke="#4f5459" stroke-opacity=".6" stroke-width="1.4"/>`;
      });
      if (kind === "oyster" || kind === "rivet" || kind === "integrated") {
        inner += `<rect x="173" y="-10" width="54" height="500" fill="#ffffff" fill-opacity=".14"/>`;
      }
      if (kind === "rivet") {
        for (let y = 4; y < 490; y += 28) { if (y > 140 && y < 330) continue; inner += `<circle cx="146" cy="${y}" r="2.2" fill="#6b7075"/><circle cx="254" cy="${y}" r="2.2" fill="#6b7075"/>`; }
      }
    }
    return `<g><clipPath id="${u}sc"><path d="${top} ${bot}"/></clipPath>
      <path d="${top} ${bot}" fill="${fill}"/>
      <g clip-path="url(#${u}sc)">${inner}
        <rect x="120" y="120" width="160" height="40" fill="#000" opacity=".25"/>
        <rect x="120" y="320" width="160" height="40" fill="#000" opacity=".25"/>
      </g></g>`;
  }

  function ticks(r1, r2, count, color, w, every, r3) {
    let s = "";
    for (let i = 0; i < count; i++) {
      const deg = (360 / count) * i;
      const major = every && i % every === 0;
      const [x1, y1] = pol(major && r3 ? r3 : r1, deg), [x2, y2] = pol(r2, deg);
      s += `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${color}" stroke-width="${major ? w * 1.8 : w}"/>`;
    }
    return s;
  }

  function bezelSVG(a, u) {
    const t = a.bezel || "none";
    const ring = (fill) => `<circle cx="${C}" cy="${CY}" r="111" fill="none" stroke="${fill}" stroke-width="22"/>`;
    if (t === "dive" || t === "pepsi") {
      let base = "";
      if (t === "pepsi") {
        base = `<path d="M${C - 111} ${CY} A111 111 0 0 1 ${C + 111} ${CY}" fill="none" stroke="#9e1c25" stroke-width="22"/>
                <path d="M${C + 111} ${CY} A111 111 0 0 1 ${C - 111} ${CY}" fill="none" stroke="#1d2f6b" stroke-width="22"/>`;
      } else base = ring(a.bezelColor || "#0c0d0f");
      let nums = "";
      if (t === "dive") {
        [10, 20, 30, 40, 50].forEach((v) => {
          const [x, y] = pol(110, v * 6);
          nums += `<text x="${f1(x)}" y="${f1(y + 4)}" font-size="12" font-family="Arial" font-weight="700" fill="#d9dcdf" text-anchor="middle" transform="rotate(${v * 6} ${f1(x)} ${f1(y)})">${v}</text>`;
        });
      }
      const tri = `<path d="M${C - 8} ${CY - 120} L${C + 8} ${CY - 120} L${C} ${CY - 106} Z" fill="#e9ecee"/>`;
      return `<g>${base}${ticks(104, 120, 60, "#d9dcdf", .9, 5, 100).replace(/stroke-width="1.62"/g, 'stroke-width="0"')}${t === "dive" ? nums : ""}${tri}
        <circle cx="${C}" cy="${CY}" r="122" fill="none" stroke="url(#${u}m)" stroke-width="2"/></g>`;
    }
    if (t === "fluted") {
      let f = "";
      for (let i = 0; i < 72; i++) {
        const [x1, y1] = pol(100, i * 5), [x2, y2] = pol(122, i * 5);
        f += `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${i % 2 ? "#ffffff" : "#6f757b"}" stroke-width="3" stroke-opacity=".75"/>`;
      }
      return `<g>${ring(`url(#${u}m)`)}${f}</g>`;
    }
    if (t === "tachy") {
      let nums = "";
      [500, 300, 200, 150, 120, 100, 90, 80, 70].forEach((v) => {
        const deg = (3600 / v) * 6 * (60 / 60) % 360;
        const [x, y] = pol(110, deg);
        nums += `<text x="${f1(x)}" y="${f1(y + 3)}" font-size="9" font-family="Arial" fill="#e2e4e6" text-anchor="middle" transform="rotate(${f1(deg)} ${f1(x)} ${f1(y)})">${v}</text>`;
      });
      return `<g>${ring(a.bezelColor || "#0e0f11")}${nums}${ticks(118, 121, 60, "#e2e4e6", .7)}</g>`;
    }
    if (t === "slide") {
      let beads = "";
      for (let i = 0; i < 40; i++) { const [x, y] = pol(118, i * 9); beads += `<circle cx="${f1(x)}" cy="${f1(y)}" r="5.2" fill="url(#${u}m)" stroke="#7a7f84" stroke-width=".6"/>`; }
      return `<g><circle cx="${C}" cy="${CY}" r="106" fill="none" stroke="#141517" stroke-width="12"/>${ticks(101, 111, 100, "#cfd2d6", .5, 10)}${beads}</g>`;
    }
    return `<circle cx="${C}" cy="${CY}" r="111" fill="none" stroke="url(#${u}m)" stroke-width="22"/>`;
  }

  function indicesRound(a, r) {
    const col = INDEX[a.index] || INDEX.steel;
    let s = "";
    for (let i = 0; i < 12; i++) {
      const deg = i * 30;
      if (a.chrono && (i === 3 || i === 6 || i === 9)) continue;
      if (i === 0) {
        s += `<g transform="rotate(0 ${C} ${CY})"><rect x="${C - 7}" y="${CY - r + 6}" width="5" height="20" fill="${col}"/><rect x="${C + 2}" y="${CY - r + 6}" width="5" height="20" fill="${col}"/></g>`;
      } else {
        const len = i % 3 === 0 ? 22 : 15;
        s += `<rect x="${C - 3}" y="${CY - r + 7}" width="6" height="${len}" rx="1" fill="${col}" ${a.index === "green" ? 'stroke="#2f6b3d" stroke-width="1.4"' : 'stroke="#000" stroke-opacity=".25" stroke-width=".6"'} transform="rotate(${deg} ${C} ${CY})"/>`;
      }
    }
    s += ticks(r - 4, r - 1, 60, col, .6);
    return s;
  }

  function subdials(a) {
    let s = "";
    [[C + 44, CY], [C, CY + 44], [C - 44, CY]].forEach(([x, y]) => {
      s += `<circle cx="${x}" cy="${y}" r="21" fill="${shade(a.dial, a.bezel === "slide" ? .78 : .08)}" stroke="${shade(a.dial, .35)}" stroke-width="1"/>`;
      for (let i = 0; i < 12; i++) {
        const ang = (i * 30 - 90) * Math.PI / 180;
        s += `<line x1="${f1(x + 17 * Math.cos(ang))}" y1="${f1(y + 17 * Math.sin(ang))}" x2="${f1(x + 20 * Math.cos(ang))}" y2="${f1(y + 20 * Math.sin(ang))}" stroke="${a.bezel === "slide" ? "#222" : "#cfd2d6"}" stroke-width=".8"/>`;
      }
      s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 15}" stroke="${a.bezel === "slide" ? "#222" : "#eef0f2"}" stroke-width="1.6"/>`;
    });
    return s;
  }

  function hands(a, r, opts) {
    const col = a.index === "roman" ? "#1f3a8a" : a.index === "gilt" ? "#d9b766" : "#eef0f2";
    const sec = a.bezel === "slide" || a.chrono ? "#c9cdd1" : "#c6a15b";
    const t = opts.time || { h: 10, m: 9, s: 36 };
    const hr = ((t.h % 12) + t.m / 60) * 30, mn = (t.m + t.s / 60) * 6, sc = t.s * 6;
    return `<g class="wa-h" transform="rotate(${f1(hr)} ${C} ${CY})"><path d="M${C - 4.5} ${CY + 10} L${C - 5} ${CY - r * .52} L${C} ${CY - r * .6} L${C + 5} ${CY - r * .52} L${C + 4.5} ${CY + 10} Z" fill="${col}" stroke="#000" stroke-opacity=".35" stroke-width=".6"/></g>
      <g class="wa-m" transform="rotate(${f1(mn)} ${C} ${CY})"><path d="M${C - 3.5} ${CY + 14} L${C - 3.5} ${CY - r * .84} L${C} ${CY - r * .9} L${C + 3.5} ${CY - r * .84} L${C + 3.5} ${CY + 14} Z" fill="${col}" stroke="#000" stroke-opacity=".35" stroke-width=".6"/></g>
      <g class="wa-s" transform="rotate(${f1(sc)} ${C} ${CY})"><line x1="${C}" y1="${CY + 22}" x2="${C}" y2="${CY - r * .92}" stroke="${sec}" stroke-width="1.6"/><circle cx="${C}" cy="${CY - r * .62}" r="3.4" fill="none" stroke="${sec}" stroke-width="1.4"/></g>
      <circle cx="${C}" cy="${CY}" r="5" fill="${col}" stroke="#000" stroke-opacity=".3"/>`;
  }

  function tapisserie(u, color, size, rot) {
    return `<pattern id="${u}tp" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(${rot || 0})">
      <rect width="${size}" height="${size}" fill="${color}"/>
      <rect x="1.2" y="1.2" width="${size - 2.4}" height="${size - 2.4}" fill="${shade(color, .12)}"/>
      <rect x="1.2" y="1.2" width="${size - 2.4}" height="${(size - 2.4) / 2}" fill="${shade(color, .22)}" opacity=".5"/></pattern>`;
  }

  window.watchArt = function (a, opts) {
    opts = opts || {};
    const u = "wa" + (++n);
    const metal = a.metal || "steel";
    const dialC = a.dial || "#111";
    let defs = metalGrad(u + "m", metal) + metalGrad(u + "m2", metal, false) +
      `<radialGradient id="${u}d" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="${shade(dialC, .18)}"/><stop offset="1" stop-color="${shade(dialC, -.35)}"/></radialGradient>
       <radialGradient id="${u}sh" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
       <linearGradient id="${u}gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
    let body = `<ellipse cx="${C}" cy="${CY + 18}" rx="170" ry="170" fill="url(#${u}sh)"/>` + strapSVG(a, u);
    const shape = a.shape || "round";

    if (shape === "round") {
      body += `<path d="M138 132 L150 104 L178 112 L170 140 Z M262 132 L250 104 L222 112 L230 140 Z M138 348 L150 376 L178 368 L170 340 Z M262 348 L250 376 L222 368 L230 340 Z" fill="url(#${u}m)" stroke="#6d7277" stroke-width=".8"/>
        <rect x="324" y="${CY - 13}" width="20" height="26" rx="4" fill="url(#${u}m2)" stroke="#6d7277" stroke-width=".8"/>
        <circle cx="${C}" cy="${CY}" r="128" fill="url(#${u}m)" stroke="#5f6469" stroke-width="1"/>
        <circle cx="${C}" cy="${CY}" r="124" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>`;
      if (a.chrono) body += `<rect x="318" y="${CY - 62}" width="16" height="16" rx="3" fill="url(#${u}m2)" transform="rotate(30 326 ${CY - 54})"/><rect x="318" y="${CY + 46}" width="16" height="16" rx="3" fill="url(#${u}m2)" transform="rotate(-30 326 ${CY + 54})"/>`;
      body += bezelSVG(a, u);
      const dr = a.bezel === "none" || !a.bezel ? 104 : 99;
      body += `<circle cx="${C}" cy="${CY}" r="${dr}" fill="url(#${u}d)"/>`;
      if (a.chrono) body += subdials(a);
      body += indicesRound(a, dr);
      body += `<text x="${C}" y="${CY - 38}" font-size="7.5" letter-spacing="2" font-family="Arial" fill="${INDEX[a.index] || "#eee"}" fill-opacity=".8" text-anchor="middle">AUTOMATIC</text>`;
      body += hands(a, dr, opts);
      body += `<circle cx="${C}" cy="${CY}" r="${dr}" fill="url(#${u}gl)"/>`;
    }

    if (shape === "octagon") {
      defs += tapisserie(u, dialC, 9);
      const oct = (r) => Array.from({ length: 8 }, (_, i) => pol(r, 22.5 + i * 45).map(f1).join(",")).join(" ");
      body += `<path d="M118 150 Q200 98 282 150 L304 240 L282 330 Q200 382 118 330 L96 240 Z" fill="url(#${u}m)" stroke="#5f6469"/>
        <rect x="300" y="${CY - 12}" width="18" height="24" rx="4" fill="url(#${u}m2)"/>
        <polygon points="${oct(122)}" fill="url(#${u}m2)" stroke="#5f6469" stroke-width="1.2" stroke-linejoin="round"/>
        <polygon points="${oct(114)}" fill="none" stroke="#fff" stroke-opacity=".55"/>`;
      for (let i = 0; i < 8; i++) {
        const [x, y] = pol(108, 22.5 + i * 45);
        body += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${i * 45})"><polygon points="-4.6,-2.7 0,-5.3 4.6,-2.7 4.6,2.7 0,5.3 -4.6,2.7" fill="#c9ccd0" stroke="#6d7277" stroke-width=".7"/><line x1="-3" y1="0" x2="3" y2="0" stroke="#6d7277"/></g>`;
      }
      body += `<circle cx="${C}" cy="${CY}" r="92" fill="url(#${u}tp)"/><circle cx="${C}" cy="${CY}" r="92" fill="url(#${u}d)" opacity=".35"/>`;
      body += indicesRound(a, 92);
      body += hands(a, 92, opts) + `<circle cx="${C}" cy="${CY}" r="92" fill="url(#${u}gl)"/>`;
    }

    if (shape === "cushion") {
      defs += tapisserie(u, dialC, 10, 45);
      body += `<rect x="78" y="118" width="244" height="244" rx="92" fill="url(#${u}m)" stroke="#5f6469"/>
        <rect x="320" y="${CY - 12}" width="16" height="24" rx="4" fill="url(#${u}m2)"/>
        <rect x="90" y="130" width="220" height="220" rx="84" fill="none" stroke="#fff" stroke-opacity=".6"/>
        <rect x="104" y="144" width="192" height="192" rx="72" fill="url(#${u}tp)"/>
        <rect x="104" y="144" width="192" height="192" rx="72" fill="url(#${u}d)" opacity=".35"/>`;
      let s = "";
      for (let i = 0; i < 12; i++) {
        if (i === 0) { s += `<text x="${C}" y="${CY - 66}" font-size="22" font-family="Arial" font-weight="700" fill="#f2f2ee" text-anchor="middle">12</text>`; continue; }
        s += `<rect x="${C - 3}" y="${CY - 90}" width="6" height="18" rx="3" fill="#f2f2ee" transform="rotate(${i * 30} ${C} ${CY})"/>`;
      }
      body += s + hands(a, 92, opts) + `<rect x="104" y="144" width="192" height="192" rx="72" fill="url(#${u}gl)"/>`;
    }

    if (shape === "square") {
      body += `<rect x="92" y="132" width="216" height="216" rx="30" fill="url(#${u}m)" stroke="#5f6469"/>
        <path d="M300 ${CY - 14} l22 6 l0 16 l-22 6 Z" fill="url(#${u}m2)"/><circle cx="324" cy="${CY}" r="7" fill="#1f3a8a"/>
        <rect x="106" y="146" width="188" height="188" rx="22" fill="none" stroke="#fff" stroke-opacity=".6"/>`;
      [[120, 160], [200, 152], [280, 160], [288, 240], [280, 320], [200, 328], [120, 320], [112, 240]].forEach(([x, y]) => {
        body += `<circle cx="${x}" cy="${y}" r="5" fill="#d6d8db" stroke="#6d7277" stroke-width=".8"/><line x1="${x - 3}" y1="${y}" x2="${x + 3}" y2="${y}" stroke="#6d7277"/>`;
      });
      body += `<rect x="128" y="168" width="144" height="144" rx="8" fill="url(#${u}d)"/>
        <rect x="140" y="180" width="120" height="120" fill="none" stroke="#2a2c30" stroke-opacity=".35"/>`;
      const R = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
      R.forEach((t, i) => {
        const ang = (i * 30 - 90) * Math.PI / 180;
        const k = 54 / Math.max(Math.abs(Math.cos(ang)), Math.abs(Math.sin(ang)));
        const x = C + Math.min(k, 62) * Math.cos(ang), y = CY + Math.min(k, 62) * Math.sin(ang);
        body += `<text x="${f1(x)}" y="${f1(y + 4)}" font-size="${i % 3 === 0 ? 12 : 9}" font-family="Georgia,serif" fill="#1d1f23" text-anchor="middle" transform="rotate(${i * 30} ${f1(x)} ${f1(y)})">${t}</text>`;
      });
      body += hands(a, 70, opts) + `<rect x="128" y="168" width="144" height="144" rx="8" fill="url(#${u}gl)"/>`;
    }

    const label = opts.label ? ` role="img" aria-label="${opts.label}"` : ' aria-hidden="true"';
    return `<svg class="watch-art" viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg"${label}><defs>${defs}</defs>${body}</svg>`;
  };
})();
