<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>θ vector + four-sector figure-eight</title>
  <style>
    :root {
      --bg: #0e1116;
      --panel: #171c24;
      --ink: #e8edf4;
      --muted: #9aa6b5;
      --line: #f0c14b;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, Segoe UI, sans-serif;
      background: var(--bg);
      color: var(--ink);
    }
    header { padding: 16px 20px 8px; }
    h1 { font-size: 18px; margin: 0 0 6px; }
    p.note { margin: 0; color: var(--muted); font-size: 13px; }
    .row { display: flex; gap: 8px; flex-wrap: wrap; padding: 8px 20px 12px; }
    button {
      background: #243044;
      color: var(--ink);
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
    }
    button:hover { background: #2d3b52; }
    #radian-circle {
      margin: 0 20px 12px;
      display: inline-block;
      padding: 8px 14px;
      border: 1px solid #3b82f6;
      border-radius: 999px;
      transition: transform 150ms ease;
      font-variant-numeric: tabular-nums;
    }
    #radian-circle .vec { color: #93c5fd; margin-left: 8px; }
    .wrap { margin: 0 20px 16px; }
    .panel {
      background: var(--panel);
      border: 1px solid #2a3342;
      border-radius: 12px;
      padding: 10px;
      margin-bottom: 12px;
    }
    .label {
      font-size: 11px;
      color: var(--muted);
      letter-spacing: .04em;
      text-transform: uppercase;
      margin: 0 0 8px;
    }
    #svg-area, #eight-area, #sector-chart {
      display: block;
      width: 100%;
      background: #0b0f14;
      border-radius: 8px;
    }
    #svg-area { height: 220px; }
    #eight-area { height: 340px; }
    #sector-chart { height: 160px; }
    #output, #code-out {
      margin: 0 20px 16px;
      white-space: pre-wrap;
      background: #10151c;
      border: 1px solid #2a3342;
      border-radius: 8px;
      padding: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12.5px;
      line-height: 1.45;
    }
    #code-out { color: #bbf7d0; }
    .sectors-dom { display: none; }
    .sector-path { cursor: pointer; transition: fill 160ms ease; }
    .sector-path:hover { filter: brightness(1.15); }
    .sector-path.active { stroke: #fff; stroke-width: 2; }
  </style>
</head>
<body>
  <header>
    <h1>Type set square + θ vector + four-sector curve</h1>
    <p class="note">Figure-eight y² = x² − x⁴ sits under the θ vector. Click a sector to bind its div / script hook and emit copyable markup.</p>
  </header>

  <div class="row">
    <button data-action="select-type" data-type="1">TYPE SET 1</button>
    <button data-action="select-type" data-type="2">TYPE SET 2</button>
    <button data-action="select-type" data-type="3">TYPE SET 3</button>
    <button data-action="go-search">JR.CLOUD</button>
  </div>

  <div id="radian-circle">θ = — <span class="vec">vector ▸</span></div>

  <div class="wrap">
    <div class="panel">
      <p class="label">Cartesian field under θ — four interactive sectors</p>
      <svg id="eight-area" viewBox="0 0 440 340" xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
  </div>

  <div class="wrap">
    <div class="panel">
      <p class="label">Type set square</p>
      <svg id="svg-area" viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
    <div class="panel">
      <p class="label">Sector chart (area of each enclosed lobe = 1/3)</p>
      <svg id="sector-chart" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
  </div>

  <div class="sectors-dom">
    <div id="sector-q1" data-sector="Q1" data-sign-x="1" data-sign-y="1">
      <script type="application/json" id="script-q1">{"id":"sector-q1","loop":"right","sign":"+ +","area":"1/3"}</script>
    </div>
    <div id="sector-q2" data-sector="Q2" data-sign-x="-1" data-sign-y="1">
      <script type="application/json" id="script-q2">{"id":"sector-q2","loop":"left","sign":"− +","area":"1/3"}</script>
    </div>
    <div id="sector-q3" data-sector="Q3" data-sign-x="-1" data-sign-y="-1">
      <script type="application/json" id="script-q3">{"id":"sector-q3","loop":"left","sign":"− −","area":"1/3"}</script>
    </div>
    <div id="sector-q4" data-sector="Q4" data-sign-x="1" data-sign-y="-1">
      <script type="application/json" id="script-q4">{"id":"sector-q4","loop":"right","sign":"+ −","area":"1/3"}</script>
    </div>
  </div>

  <pre id="output">Select a TYPE SET, then click a sector on the figure-eight.</pre>
  <pre id="code-out">/* sector markup appears here */</pre>

<script>
console.log("OUTCOME.JS LOADED");

const FIELD = { width: 400, height: 220, limitY: 170, curveTop: 28, padX: 28 };
const curveSquareState = { t: 0.42, raf: null };

const SECTORS = {
  Q1: { fill: "#60a5fa88", solid: "#60a5fa", name: "Q1 right-upper", div: "sector-q1", script: "script-q1", x: 1, y: 1 },
  Q2: { fill: "#34d39988", solid: "#34d399", name: "Q2 left-upper",  div: "sector-q2", script: "script-q2", x: -1, y: 1 },
  Q3: { fill: "#f472b688", solid: "#f472b6", name: "Q3 left-lower",  div: "sector-q3", script: "script-q3", x: -1, y: -1 },
  Q4: { fill: "#fbbf2488", solid: "#fbbf24", name: "Q4 right-lower", div: "sector-q4", script: "script-q4", x: 1, y: -1 }
};

const sectorState = { active: null, counts: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 } };

function gSvgX(svgY) {
  const t = (FIELD.limitY - svgY) / (FIELD.limitY - FIELD.curveTop);
  const clamped = Math.max(0, Math.min(1, t));
  const bend = clamped * clamped * (3 - 2 * clamped);
  return FIELD.padX + 30 + bend * 240 + Math.sin(clamped * Math.PI) * 16;
}
function curvePathD() {
  let d = "";
  for (let i = 0; i <= 20; i++) {
    const svgY = FIELD.limitY - (i / 20) * (FIELD.limitY - FIELD.curveTop);
    d += (i === 0 ? `M ${gSvgX(svgY)} ${svgY}` : ` L ${gSvgX(svgY)} ${svgY}`);
  }
  return d;
}
function constrainedY(type, size) {
  if (type === "circle") return 12 + Math.random() * 160;
  return 12 + Math.random() * Math.max(8, FIELD.limitY - size - 16);
}
function curvePointAtT(t) {
  const clamped = Math.max(0.06, Math.min(0.94, t));
  const svgY = FIELD.limitY - clamped * (FIELD.limitY - FIELD.curveTop);
  return { x: gSvgX(svgY) - 16, y: svgY - 16, t: clamped };
}
function targetTFromPlacements(placements) {
  if (!placements.length) return 0.42;
  const span = FIELD.limitY - FIELD.curveTop;
  let heightBias = 0, crowdBias = 0;
  for (const p of placements) {
    const midY = p.y + 16;
    heightBias += Math.max(0, Math.min(1, (FIELD.limitY - midY) / span));
    const gx = gSvgX(Math.max(FIELD.curveTop, Math.min(FIELD.limitY, midY)));
    const dx = (p.x + 16) - gx;
    if (Math.abs(dx) < 70) crowdBias += (dx >= 0 ? -0.04 : 0.04);
  }
  return Math.max(0.08, Math.min(0.92, heightBias / placements.length * 0.75 + 0.12 + crowdBias));
}
function slideSquareAlongCurve(el, fromT, toT) {
  if (curveSquareState.raf) cancelAnimationFrame(curveSquareState.raf);
  const start = performance.now(), dur = 520;
  function frame(now) {
    const u = Math.min(1, (now - start) / dur);
    const ease = u * u * (3 - 2 * u);
    const t = fromT + (toT - fromT) * ease;
    const p = curvePointAtT(t);
    el.setAttribute("transform", `translate(${p.x},${p.y})`);
    curveSquareState.t = t;
    if (u < 1) curveSquareState.raf = requestAnimationFrame(frame);
  }
  curveSquareState.raf = requestAnimationFrame(frame);
}

document.addEventListener("click", (e) => {
  if (e.target.matches("[data-action='select-type']")) {
    const selectedType = e.target.getAttribute("data-type");
    document.getElementById("output").textContent =
      "TYPE SET " + selectedType + " selected. Initializing protocol...";
    initializeTypeProtocol(selectedType);
  }
  if (e.target.matches("[data-action='go-search']")) {
    window.location.href = "https://www.mozilla.org/en-US/firefox/new/";
  }
});

function analyzeSVGShapes(shapeList) {
  const squareCount = shapeList.filter(s => s.type === "square").length;
  if (squareCount > 5) return { avoid: true, reason: "Page contains more than 5 squares." };
  return { avoid: false, reason: "Page is safe." };
}
function generateRandomShapes(count = 5) {
  const types = ["square", "circle", "triangle", "hexagon"];
  return Array.from({ length: count }, () => ({ type: types[Math.floor(Math.random() * types.length)] }));
}
function generateTypeShapes(typeNumber) {
  const radianMap = { "1": Math.PI / 6, "2": Math.PI, "3": 3 * Math.PI / 2 };
  const theta = radianMap[typeNumber] || Math.PI / 6;
  const cosTheta = Math.cos(theta);
  let shapes = [];
  if (cosTheta > 0.5) shapes = [{ type: "circle" }, { type: "circle" }, { type: "square" }];
  else if (cosTheta < -0.5) shapes = [{ type: "square" }, { type: "square" }, { type: "triangle" }];
  else shapes = [{ type: "triangle" }, { type: "triangle" }, { type: "circle" }];
  return shapes.map(s => ({ ...s, theta, cosTheta }));
}
function generateTriangleDifferentialShapes() {
  const regions = ["square", "circle", "triangle"];
  return Array.from({ length: 8 }, () => ({ type: regions[Math.floor(Math.random() * regions.length)] }));
}

function drawSVGShapes(shapeList) {
  const svg = document.getElementById("svg-area");
  svg.innerHTML = "";
  const svgNS = "http://www.w3.org/2000/svg";

  const limit = document.createElementNS(svgNS, "line");
  limit.setAttribute("x1", "16"); limit.setAttribute("x2", "384");
  limit.setAttribute("y1", String(FIELD.limitY)); limit.setAttribute("y2", String(FIELD.limitY));
  limit.setAttribute("stroke", "#f0c14b"); limit.setAttribute("stroke-dasharray", "6 4");
  svg.appendChild(limit);

  const curve = document.createElementNS(svgNS, "path");
  curve.setAttribute("d", curvePathD());
  curve.setAttribute("fill", "none");
  curve.setAttribute("stroke", "#4da3ff");
  curve.setAttribute("stroke-width", "2");
  svg.appendChild(curve);

  const placements = [];
  let firstSquareEl = null, firstSquareSeen = false;

  for (const shape of shapeList) {
    let el;
    const isLead = shape.type === "square" && !firstSquareSeen;
    if (shape.type === "square") {
      el = document.createElementNS(svgNS, "rect");
      el.setAttribute("width", "32"); el.setAttribute("height", "32");
      el.setAttribute("fill", isLead ? "#fb7185" : "red");
      if (isLead) { el.setAttribute("stroke", "#fff1f2"); el.setAttribute("stroke-width", "2"); }
    } else if (shape.type === "circle") {
      el = document.createElementNS(svgNS, "circle");
      el.setAttribute("r", "16"); el.setAttribute("fill", "blue");
    } else if (shape.type === "triangle") {
      el = document.createElementNS(svgNS, "polygon");
      el.setAttribute("points", "0,32 16,0 32,32"); el.setAttribute("fill", "green");
    } else if (shape.type === "hexagon") {
      el = document.createElementNS(svgNS, "polygon");
      el.setAttribute("points", "16,0 32,8 32,24 16,32 0,24 0,8"); el.setAttribute("fill", "purple");
    }
    if (!el) continue;
    if (isLead) {
      firstSquareSeen = true;
      firstSquareEl = el;
      const s = curvePointAtT(curveSquareState.t);
      el.setAttribute("transform", `translate(${s.x},${s.y})`);
    } else {
      const x = 20 + Math.random() * 340;
      const y = constrainedY(shape.type, 32);
      el.setAttribute("transform", `translate(${x},${y})`);
      placements.push({ x, y });
    }
    svg.appendChild(el);
  }
  if (firstSquareEl) slideSquareAlongCurve(firstSquareEl, curveSquareState.t, targetTFromPlacements(placements));
}

const AIState = { mode: "PRIMI", energy: 1.0, tension: 0.0, lastTypeSet: null };
function computeDifferential(shapeList) {
  const squares = shapeList.filter(s => s.type === "square").length;
  const circles = shapeList.filter(s => s.type === "circle").length;
  const triangles = shapeList.filter(s => s.type === "triangle").length;
  return squares * 0.4 + triangles * 0.2 - circles * 0.3;
}
function updateAIMode(tension, typeNumber) {
  AIState.lastTypeSet = typeNumber;
  AIState.tension = tension;
  if (tension > 1.5) AIState.mode = "ANTI";
  else if (tension < -0.5) AIState.mode = "ANTI‑ANTI";
  else AIState.mode = "PRIMI";
  return AIState.mode;
}
function generateAIResponse() {
  if (AIState.mode === "ANTI") return "AI MODE: ANTI — High tension detected. Defensive pattern activated.";
  if (AIState.mode === "ANTI‑ANTI") return "AI MODE: ANTI‑ANTI — Inversion mode. Reversal logic engaged.";
  return "AI MODE: PRIMI — Stable, constructive, low‑tension processing.";
}
function updateRadianCircle(theta) {
  const rc = document.getElementById("radian-circle");
  const deg = theta * 180 / Math.PI;
  rc.innerHTML = "θ = " + theta.toFixed(2) +
    " <span class='vec'>vector ▸  (" + Math.cos(theta).toFixed(2) + ", " + Math.sin(theta).toFixed(2) + ")   " + deg.toFixed(0) + "°</span>";
  rc.style.transform = "scale(1.12)";
  setTimeout(() => { rc.style.transform = "scale(1)"; }, 150);
}

function initializeTypeProtocol(typeNumber) {
  const randomShapes = generateRandomShapes(5);
  const typeShapes = generateTypeShapes(typeNumber);
  const triangleShapes = generateTriangleDifferentialShapes();
  const allShapes = [...randomShapes, ...typeShapes, ...triangleShapes];
  const result = analyzeSVGShapes(allShapes);
  drawSVGShapes(allShapes);
  const tension = computeDifferential(allShapes);
  updateAIMode(tension, typeNumber);
  updateRadianCircle(typeShapes[0].theta);
  document.getElementById("output").textContent =
    (result.avoid ? "AVOID PAGE: " : "PAGE OK: ") + result.reason +
    "\n\nTENSION: " + tension.toFixed(2) + "\n" + generateAIResponse() +
    (sectorState.active ? "\nACTIVE SECTOR: " + sectorState.active : "");
}

function eightY(x) {
  const v = x * x * (1 - x * x);
  return v > 0 ? Math.sqrt(v) : 0;
}

function sectorPath(sx, sy, ox, oy, scale) {
  const n = 40;
  let d = `M ${ox} ${oy}`;
  if (sy > 0) {
    for (let i = 0; i <= n; i++) {
      const x = sx * (i / n);
      const y = sy * eightY(x);
      d += ` L ${ox + x * scale} ${oy - y * scale}`;
    }
    d += ` L ${ox + sx * scale} ${oy} Z`;
  } else {
    d += ` L ${ox + sx * scale} ${oy}`;
    for (let i = n; i >= 0; i--) {
      const x = sx * (i / n);
      const y = sy * eightY(x);
      d += ` L ${ox + x * scale} ${oy - y * scale}`;
    }
    d += " Z";
  }
  return d;
}

function drawFigureEight() {
  const svg = document.getElementById("eight-area");
  svg.innerHTML = "";
  const NS = "http://www.w3.org/2000/svg";
  const ox = 220, oy = 170, scale = 140;

  const axes = document.createElementNS(NS, "g");
  const xA = document.createElementNS(NS, "line");
  xA.setAttribute("x1", "40"); xA.setAttribute("x2", "400");
  xA.setAttribute("y1", String(oy)); xA.setAttribute("y2", String(oy));
  xA.setAttribute("stroke", "#8b98a8");
  const yA = document.createElementNS(NS, "line");
  yA.setAttribute("x1", String(ox)); yA.setAttribute("x2", String(ox));
  yA.setAttribute("y1", "24"); yA.setAttribute("y2", "316");
  yA.setAttribute("stroke", "#8b98a8");
  axes.appendChild(xA); axes.appendChild(yA);
  svg.appendChild(axes);

  [["-1", ox - scale, oy + 16], ["1", ox + scale, oy + 16],
   ["O", ox + 6, oy + 16], ["y² = x² − x⁴", 300, 36]].forEach(([t, x, y]) => {
    const el = document.createElementNS(NS, "text");
    el.setAttribute("x", x); el.setAttribute("y", y);
    el.setAttribute("fill", "#c9d4e2"); el.setAttribute("font-size", "12");
    el.textContent = t;
    svg.appendChild(el);
  });

  const defs = [
    ["Q1", 1, 1],
    ["Q2", -1, 1],
    ["Q3", -1, -1],
    ["Q4", 1, -1]
  ];
  for (const [id, sx, sy] of defs) {
    const meta = SECTORS[id];
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", sectorPath(sx, sy, ox, oy, scale));
    p.setAttribute("fill", meta.fill);
    p.setAttribute("stroke", meta.solid);
    p.setAttribute("stroke-width", "1.6");
    p.setAttribute("class", "sector-path" + (sectorState.active === id ? " active" : ""));
    p.setAttribute("data-sector", id);
    p.setAttribute("id", "path-" + id);
    p.addEventListener("click", () => selectSector(id));
    svg.appendChild(p);

    const midX = ox + sx * scale * 0.55;
    const midY = oy - sy * scale * 0.28;
    const lab = document.createElementNS(NS, "text");
    lab.setAttribute("x", midX);
    lab.setAttribute("y", midY);
    lab.setAttribute("text-anchor", "middle");
    lab.setAttribute("fill", "#e8edf4");
    lab.setAttribute("font-size", "12");
    lab.setAttribute("pointer-events", "none");
    lab.textContent = id + "  #" + meta.div;
    svg.appendChild(lab);
  }
}

function snippetFor(id) {
  const m = SECTORS[id];
  return [
    `<!-- bind this sector under the type-set square -->`,
    `<div id="${m.div}" data-sector="${id}" data-area="1/3">`,
    `  <script>`,
    `    window.SECTORS = window.SECTORS || {};`,
    `    window.SECTORS.${id} = {`,
    `      id: "${m.div}",`,
    `      script: "${m.script}",`,
    `      area: 1/3,`,
    `      loop: "${id === "Q1" || id === "Q4" ? "right" : "left"}",`,
    `      signs: { x: ${m.x}, y: ${m.y} },`,
    `      onSelect: function () {`,
    `        document.getElementById("${m.div}").dataset.active = "true";`,
    `      }`,
    `    };`,
    `  <\/script>`,
    `</div>`
  ].join("\n");
}

function drawSectorChart() {
  const svg = document.getElementById("sector-chart");
  svg.innerHTML = "";
  const NS = "http://www.w3.org/2000/svg";
  const keys = ["Q1", "Q2", "Q3", "Q4"];
  const max = Math.max(1, ...keys.map(k => sectorState.counts[k]));
  keys.forEach((k, i) => {
    const h = (sectorState.counts[k] / max) * 100;
    const x = 40 + i * 90;
    const meta = SECTORS[k];
    const bar = document.createElementNS(NS, "rect");
    bar.setAttribute("x", x);
    bar.setAttribute("y", 120 - h);
    bar.setAttribute("width", "48");
    bar.setAttribute("height", String(Math.max(h, 2)));
    bar.setAttribute("rx", "4");
    bar.setAttribute("fill", sectorState.active === k ? meta.solid : meta.fill);
    bar.setAttribute("stroke", meta.solid);
    svg.appendChild(bar);
    const lab = document.createElementNS(NS, "text");
    lab.setAttribute("x", x + 24);
    lab.setAttribute("y", 138);
    lab.setAttribute("text-anchor", "middle");
    lab.setAttribute("fill", "#c9d4e2");
    lab.setAttribute("font-size", "11");
    lab.textContent = k;
    svg.appendChild(lab);
    const val = document.createElementNS(NS, "text");
    val.setAttribute("x", x + 24);
    val.setAttribute("y", 114 - h);
    val.setAttribute("text-anchor", "middle");
    val.setAttribute("fill", "#e8edf4");
    val.setAttribute("font-size", "11");
    val.textContent = "1/3";
    svg.appendChild(val);
  });
}

function selectSector(id) {
  sectorState.active = id;
  sectorState.counts[id] += 1;
  document.querySelectorAll(".sectors-dom [data-sector]").forEach(el => {
    el.dataset.active = el.dataset.sector === id ? "true" : "false";
  });
  drawFigureEight();
  drawSectorChart();
  const m = SECTORS[id];
  const raw = document.getElementById(m.script).textContent;
  document.getElementById("output").textContent =
    "SECTOR " + id + " selected\n" +
    "host div: #" + m.div + "\n" +
    "script tag: #" + m.script + "\n" +
    "enclosed area: 1/3   (full figure-eight = 4/3)\n" +
    "payload: " + raw;
  document.getElementById("code-out").textContent = snippetFor(id);
}

drawFigureEight();
drawSectorChart();
initializeTypeProtocol("1");
document.getElementById("code-out").textContent =
  "Click Q1–Q4 on the figure-eight. A ready-to-paste <div id> + <script> block will appear here.";
</script>
</body>
</html>
