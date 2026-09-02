console.log("OUTCOME.JS LOADED");

const FIELD = { width: 400, height: 300, limitY: 250, curveTop: 28, padX: 28 };
const curveSquareState = { t: 0.42, raf: null };

const SECTORS = {
  Q1: {
    fill: "#60a5fa88", solid: "#60a5fa", div: "sector-q1", x: 1, y: 1,
    word: "amplitude",
    prompt: "Would you like to replace one line of code with \"amplitude\"?"
  },
  Q2: {
    fill: "#34d39988", solid: "#34d399", div: "sector-q2", x: -1, y: 1,
    word: "angular momentum",
    prompt: "Would you like to replace one line of code with \"angular momentum\"?"
  },
  Q3: {
    fill: "#f472b688", solid: "#f472b6", div: "sector-q3", x: -1, y: -1,
    word: "atom",
    prompt: "Would you like to replace one line of code with \"atom\"?"
  },
  Q4: {
    fill: "#fbbf2488", solid: "#fbbf24", div: "sector-q4", x: 1, y: -1,
    word: "acceleration",
    prompt: "Would you like to replace one line of code with \"acceleration\"?"
  }
};
const sectorState = { active: null, counts: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 } };

function ensureHostNodes() {
  const svgArea = document.getElementById("svg-area");
  const theta = document.getElementById("radian-circle");

  if (!document.getElementById("eight-area")) {
    const wrap = document.createElement("div");
    wrap.style.margin = "16px 0";
    const label = document.createElement("p");
    label.textContent = "Cartesian field under θ — four interactive sectors  y² = x² − x⁴";
    const eight = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    eight.setAttribute("id", "eight-area");
    eight.setAttribute("viewBox", "0 0 440 340");
    eight.setAttribute("width", "440");
    eight.setAttribute("height", "340");
    eight.style.border = "1px solid black";
    eight.style.display = "block";
    wrap.appendChild(label);
    wrap.appendChild(eight);
    if (theta && theta.parentNode) theta.parentNode.insertBefore(wrap, theta.nextSibling);
    else if (svgArea && svgArea.parentNode) svgArea.parentNode.insertBefore(wrap, svgArea);
    else document.body.appendChild(wrap);
  }

  if (!document.getElementById("sector-chart")) {
    const wrap = document.createElement("div");
    wrap.style.margin = "16px 0";
    const label = document.createElement("p");
    label.textContent = "Sector chart under type-set square (each lobe = 1/3)";
    const chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chart.setAttribute("id", "sector-chart");
    chart.setAttribute("viewBox", "0 0 400 160");
    chart.setAttribute("width", "400");
    chart.setAttribute("height", "160");
    chart.style.border = "1px solid black";
    chart.style.display = "block";
    wrap.appendChild(label);
    wrap.appendChild(chart);
    const svg = document.getElementById("svg-area");
    if (svg && svg.parentNode) svg.parentNode.insertBefore(wrap, svg.nextSibling);
    else document.body.appendChild(wrap);
  }

  if (!document.getElementById("code-out")) {
    const pre = document.createElement("pre");
    pre.id = "code-out";
    pre.textContent = "Click Q1–Q4 on the figure-eight for a copyable <div> + <script> block.";
    document.body.appendChild(pre);
  }
}

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
    d += (i === 0 ? "M " + gSvgX(svgY) + " " + svgY : " L " + gSvgX(svgY) + " " + svgY);
  }
  return d;
}

function constrainedY(type, size) {
  if (type === "circle") return 12 + Math.random() * 220;
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
  let heightBias = 0;
  let crowdBias = 0;
  for (let i = 0; i < placements.length; i++) {
    const p = placements[i];
    const midY = p.y + 16;
    heightBias += Math.max(0, Math.min(1, (FIELD.limitY - midY) / span));
    const gx = gSvgX(Math.max(FIELD.curveTop, Math.min(FIELD.limitY, midY)));
    const dx = (p.x + 16) - gx;
    if (Math.abs(dx) < 70) crowdBias += dx >= 0 ? -0.04 : 0.04;
  }
  return Math.max(0.08, Math.min(0.92, heightBias / placements.length * 0.75 + 0.12 + crowdBias));
}

function slideSquareAlongCurve(el, fromT, toT) {
  if (curveSquareState.raf) cancelAnimationFrame(curveSquareState.raf);
  const start = performance.now();
  const dur = 520;
  function frame(now) {
    const u = Math.min(1, (now - start) / dur);
    const ease = u * u * (3 - 2 * u);
    const t = fromT + (toT - fromT) * ease;
    const p = curvePointAtT(t);
    el.setAttribute("transform", "translate(" + p.x + "," + p.y + ")");
    curveSquareState.t = t;
    if (u < 1) curveSquareState.raf = requestAnimationFrame(frame);
  }
  curveSquareState.raf = requestAnimationFrame(frame);
}

document.addEventListener("click", function (e) {
  const typeBtn = e.target.closest("[data-action='select-type']");
  if (typeBtn) {
    const selectedType = typeBtn.getAttribute("data-type");
    const output = document.getElementById("output");
    if (output) output.textContent = "TYPE SET " + selectedType + " selected. Initializing protocol...";
    initializeTypeProtocol(selectedType);
    return;
  }
  const cloudBtn = e.target.closest("[data-action='go-search']");
  if (cloudBtn) {
    window.open("https://www.mozilla.org/en-US/firefox/new/", "_blank", "noopener");
  }
});

function analyzeSVGShapes(shapeList) {
  var squareCount = 0;
  for (var i = 0; i < shapeList.length; i++) if (shapeList[i].type === "square") squareCount++;
  if (squareCount > 5) return { avoid: true, reason: "Page contains more than 5 squares." };
  return { avoid: false, reason: "Page is safe." };
}

function generateRandomShapes(count) {
  if (count == null) count = 5;
  const types = ["square", "circle", "triangle", "hexagon"];
  const shapes = [];
  for (var i = 0; i < count; i++) shapes.push({ type: types[Math.floor(Math.random() * types.length)] });
  return shapes;
}

function generateTypeShapes(typeNumber) {
  const radianMap = { "1": Math.PI / 6, "2": Math.PI, "3": 3 * Math.PI / 2 };
  const theta = radianMap[String(typeNumber)] || Math.PI / 6;
  const cosTheta = Math.cos(theta);
  var shapes;
  if (cosTheta > 0.5) shapes = [{ type: "circle" }, { type: "circle" }, { type: "square" }];
  else if (cosTheta < -0.5) shapes = [{ type: "square" }, { type: "square" }, { type: "triangle" }];
  else shapes = [{ type: "triangle" }, { type: "triangle" }, { type: "circle" }];
  return shapes.map(function (s) {
    return { type: s.type, theta: theta, cosTheta: cosTheta };
  });
}

function generateTriangleDifferentialShapes() {
  const regions = ["square", "circle", "triangle"];
  const shapes = [];
  for (var i = 0; i < 8; i++) shapes.push({ type: regions[Math.floor(Math.random() * regions.length)] });
  return shapes;
}

function drawSVGShapes(shapeList) {
  const svg = document.getElementById("svg-area");
  if (!svg) return;
  svg.innerHTML = "";
  const svgNS = "http://www.w3.org/2000/svg";

  const limit = document.createElementNS(svgNS, "line");
  limit.setAttribute("x1", "16");
  limit.setAttribute("x2", "384");
  limit.setAttribute("y1", String(FIELD.limitY));
  limit.setAttribute("y2", String(FIELD.limitY));
  limit.setAttribute("stroke", "#c9a227");
  limit.setAttribute("stroke-dasharray", "6 4");
  svg.appendChild(limit);

  const curve = document.createElementNS(svgNS, "path");
  curve.setAttribute("d", curvePathD());
  curve.setAttribute("fill", "none");
  curve.setAttribute("stroke", "#2563eb");
  curve.setAttribute("stroke-width", "2");
  svg.appendChild(curve);

  const placements = [];
  var firstSquareEl = null;
  var firstSquareSeen = false;

  for (var i = 0; i < shapeList.length; i++) {
    const shape = shapeList[i];
    var el = null;
    const isLead = shape.type === "square" && !firstSquareSeen;
    if (shape.type === "square") {
      el = document.createElementNS(svgNS, "rect");
      el.setAttribute("width", "32");
      el.setAttribute("height", "32");
      el.setAttribute("fill", isLead ? "#fb7185" : "red");
      if (isLead) {
        el.setAttribute("stroke", "#111");
        el.setAttribute("stroke-width", "2");
      }
    } else if (shape.type === "circle") {
      el = document.createElementNS(svgNS, "circle");
      el.setAttribute("r", "16");
      el.setAttribute("fill", "blue");
    } else if (shape.type === "triangle") {
      el = document.createElementNS(svgNS, "polygon");
      el.setAttribute("points", "0,32 16,0 32,32");
      el.setAttribute("fill", "green");
    } else if (shape.type === "hexagon") {
      el = document.createElementNS(svgNS, "polygon");
      el.setAttribute("points", "16,0 32,8 32,24 16,32 0,24 0,8");
      el.setAttribute("fill", "purple");
    }
    if (!el) continue;
    if (isLead) {
      firstSquareSeen = true;
      firstSquareEl = el;
      const s = curvePointAtT(curveSquareState.t);
      el.setAttribute("transform", "translate(" + s.x + "," + s.y + ")");
    } else {
      const x = 20 + Math.random() * 340;
      const y = constrainedY(shape.type, 32);
      el.setAttribute("transform", "translate(" + x + "," + y + ")");
      placements.push({ x: x, y: y });
    }
    svg.appendChild(el);
  }
  if (firstSquareEl) slideSquareAlongCurve(firstSquareEl, curveSquareState.t, targetTFromPlacements(placements));
}

const AIState = { mode: "PRIMI", energy: 1.0, tension: 0.0, lastTypeSet: null };

function countType(shapeList, type) {
  var n = 0;
  for (var i = 0; i < shapeList.length; i++) if (shapeList[i].type === type) n++;
  return n;
}

function computeDifferential(shapeList) {
  return countType(shapeList, "square") * 0.4 + countType(shapeList, "triangle") * 0.2 - countType(shapeList, "circle") * 0.3;
}

function updateAIMode(tension, typeNumber) {
  AIState.lastTypeSet = typeNumber;
  AIState.tension = tension;
  if (tension > 1.5) AIState.mode = "ANTI";
  else if (tension < -0.5) AIState.mode = "ANTI-ANTI";
  else AIState.mode = "PRIMI";
  return AIState.mode;
}

function generateAIResponse() {
  if (AIState.mode === "ANTI") return "AI MODE: ANTI — High tension detected. Defensive pattern activated.";
  if (AIState.mode === "ANTI-ANTI") return "AI MODE: ANTI-ANTI — Inversion mode. Reversal logic engaged.";
  return "AI MODE: PRIMI — Stable, constructive, low-tension processing.";
}

function updateRadianCircle(theta) {
  const rc = document.getElementById("radian-circle");
  if (!rc) return;
  rc.textContent = "θ = " + theta.toFixed(2) + "  (" + Math.cos(theta).toFixed(2) + ", " + Math.sin(theta).toFixed(2) + ")";
}

function initializeTypeProtocol(typeNumber) {
  console.log("Protocol initialized for TYPE SET:", typeNumber);
  const randomShapes = generateRandomShapes(5);
  const typeShapes = generateTypeShapes(typeNumber);
  const triangleShapes = generateTriangleDifferentialShapes();
  const allShapes = randomShapes.concat(typeShapes, triangleShapes);
  const result = analyzeSVGShapes(allShapes);
  drawSVGShapes(allShapes);
  const tension = computeDifferential(allShapes);
  updateAIMode(tension, typeNumber);
  updateRadianCircle(typeShapes[0].theta);
  const output = document.getElementById("output");
  if (output) {
    output.textContent =
      (result.avoid ? "AVOID PAGE: " : "PAGE OK: ") + result.reason +
      "\n\nTENSION: " + tension.toFixed(2) + "\n" + generateAIResponse() +
      (sectorState.active ? "\nACTIVE SECTOR: " + sectorState.active : "");
  }
}

function eightY(x) {
  const v = x * x * (1 - x * x);
  return v > 0 ? Math.sqrt(v) : 0;
}

function sectorPath(sx, sy, ox, oy, scale) {
  const n = 40;
  var d = "M " + ox + " " + oy;
  var i, x, y;
  if (sy > 0) {
    for (i = 0; i <= n; i++) {
      x = sx * (i / n);
      y = sy * eightY(x);
      d += " L " + (ox + x * scale) + " " + (oy - y * scale);
    }
    d += " L " + (ox + sx * scale) + " " + oy + " Z";
  } else {
    d += " L " + (ox + sx * scale) + " " + oy;
    for (i = n; i >= 0; i--) {
      x = sx * (i / n);
      y = sy * eightY(x);
      d += " L " + (ox + x * scale) + " " + (oy - y * scale);
    }
    d += " Z";
  }
  return d;
}

function drawFigureEight() {
  const svg = document.getElementById("eight-area");
  if (!svg) return;
  svg.innerHTML = "";
  const NS = "http://www.w3.org/2000/svg";
  const ox = 220;
  const oy = 170;
  const scale = 140;

  const xA = document.createElementNS(NS, "line");
  xA.setAttribute("x1", "40");
  xA.setAttribute("x2", "400");
  xA.setAttribute("y1", String(oy));
  xA.setAttribute("y2", String(oy));
  xA.setAttribute("stroke", "#444");
  svg.appendChild(xA);

  const yA = document.createElementNS(NS, "line");
  yA.setAttribute("x1", String(ox));
  yA.setAttribute("x2", String(ox));
  yA.setAttribute("y1", "24");
  yA.setAttribute("y2", "316");
  yA.setAttribute("stroke", "#444");
  svg.appendChild(yA);

  const defs = [["Q1", 1, 1], ["Q2", -1, 1], ["Q3", -1, -1], ["Q4", 1, -1]];
  for (var i = 0; i < defs.length; i++) {
    const id = defs[i][0];
    const sx = defs[i][1];
    const sy = defs[i][2];
    const meta = SECTORS[id];
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", sectorPath(sx, sy, ox, oy, scale));
    p.setAttribute("fill", meta.fill);
    p.setAttribute("stroke", meta.solid);
    p.setAttribute("stroke-width", "1.6");
    p.style.cursor = "pointer";
    p.addEventListener("click", (function (sectorId) {
      return function () { selectSector(sectorId); };
    })(id));
    svg.appendChild(p);

    const lab = document.createElementNS(NS, "text");
    lab.setAttribute("x", String(ox + sx * scale * 0.55));
    lab.setAttribute("y", String(oy - sy * scale * 0.28));
    lab.setAttribute("text-anchor", "middle");
    lab.setAttribute("font-size", "12");
    lab.setAttribute("pointer-events", "none");
    lab.textContent = id;
    svg.appendChild(lab);
  }
}

function snippetFor(id) {
  const m = SECTORS[id];
  return [
    "<div id=\"" + m.div + "\" data-sector=\"" + id + "\" data-area=\"1/3\">",
    "  <script>",
    "    window.SECTORS = window.SECTORS || {};",
    "    window.SECTORS." + id + " = { id: \"" + m.div + "\", area: 1/3, signs: { x: " + m.x + ", y: " + m.y + " } };",
    "  </script>",
    "</div>"
  ].join("\n");
}

function drawSectorChart() {
  const svg = document.getElementById("sector-chart");
  if (!svg) return;
  svg.innerHTML = "";
  const NS = "http://www.w3.org/2000/svg";
  const keys = ["Q1", "Q2", "Q3", "Q4"];
  const max = Math.max(1, sectorState.counts.Q1, sectorState.counts.Q2, sectorState.counts.Q3, sectorState.counts.Q4);
  for (var i = 0; i < keys.length; i++) {
    const k = keys[i];
    const h = (sectorState.counts[k] / max) * 100;
    const x = 40 + i * 90;
    const meta = SECTORS[k];
    const bar = document.createElementNS(NS, "rect");
    bar.setAttribute("x", String(x));
    bar.setAttribute("y", String(120 - h));
    bar.setAttribute("width", "48");
    bar.setAttribute("height", String(Math.max(h, 2)));
    bar.setAttribute("fill", sectorState.active === k ? meta.solid : meta.fill);
    bar.setAttribute("stroke", meta.solid);
    svg.appendChild(bar);
    const lab = document.createElementNS(NS, "text");
    lab.setAttribute("x", String(x + 24));
    lab.setAttribute("y", "138");
    lab.setAttribute("text-anchor", "middle");
    lab.setAttribute("font-size", "11");
    lab.textContent = k;
    svg.appendChild(lab);
  }
}

function applyWordToRandomLine(source, word) {
  const lines = source.split("\n");
  const idxs = [];
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].trim()) idxs.push(i);
  }
  if (!idxs.length) return source;
  const pick = idxs[Math.floor(Math.random() * idxs.length)];
  lines[pick] = word;
  return lines.join("\n");
}

function selectSector(id) {
  const m = SECTORS[id];
  const accepted = window.confirm(m.prompt);
  sectorState.active = id;
  sectorState.counts[id] += 1;
  drawFigureEight();
  drawSectorChart();

  let snippet = snippetFor(id);
  if (accepted) snippet = applyWordToRandomLine(snippet, m.word);

  const output = document.getElementById("output");
  if (output) {
    output.textContent =
      "SECTOR " + id + " selected\n" +
      "host div: #" + m.div + "\n" +
      "enclosed area: 1/3   (full figure-eight = 4/3)\n" +
      "prompt word: " + m.word + "\n" +
      "replace line: " + (accepted ? "YES — one random line swapped for \"" + m.word + "\"" : "NO — snippet unchanged");
  }
  const codeOut = document.getElementById("code-out");
  if (codeOut) codeOut.textContent = snippet;
}

function boot() {
  ensureHostNodes();
  drawFigureEight();
  drawSectorChart();
  initializeTypeProtocol("1");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
