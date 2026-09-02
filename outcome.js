console.log("OUTCOME.JS LOADED");

/* ============================================================
   CARTESIAN FIELD — LIMIT LINE + DYNAMIC CURVE g(y)
   SVG y grows downward. Math y grows upward.
   Limit line is y = s. Squares / triangles / hexagons stay above it.
   ============================================================ */
const FIELD = {
    width: 400,
    height: 320,
    limitY: 230,
    curveTop: 50,
    padX: 36
};

const curveSquareState = { t: 0.42, raf: null };

function gSvgX(svgY) {
    const t = (FIELD.limitY - svgY) / (FIELD.limitY - FIELD.curveTop);
    const clamped = Math.max(0, Math.min(1, t));
    const bend = clamped * clamped * (3 - 2 * clamped);
    return FIELD.padX + 40 + bend * 250 + Math.sin(clamped * Math.PI) * 18;
}

function curvePathD() {
    const steps = 24;
    let d = "";
    for (let i = 0; i <= steps; i++) {
        const svgY = FIELD.limitY - (i / steps) * (FIELD.limitY - FIELD.curveTop);
        const x = gSvgX(svgY);
        d += (i === 0 ? `M ${x} ${svgY}` : ` L ${x} ${svgY}`);
    }
    return d;
}

function drawField(svg, svgNS) {
    const axis = document.createElementNS(svgNS, "g");

    const xAxis = document.createElementNS(svgNS, "line");
    xAxis.setAttribute("x1", "24");
    xAxis.setAttribute("y1", String(FIELD.limitY + 36));
    xAxis.setAttribute("x2", "380");
    xAxis.setAttribute("y2", String(FIELD.limitY + 36));
    xAxis.setAttribute("stroke", "#8b98a8");
    xAxis.setAttribute("stroke-width", "1.2");

    const yAxis = document.createElementNS(svgNS, "line");
    yAxis.setAttribute("x1", "24");
    yAxis.setAttribute("y1", "18");
    yAxis.setAttribute("x2", "24");
    yAxis.setAttribute("y2", String(FIELD.limitY + 36));
    yAxis.setAttribute("stroke", "#8b98a8");
    yAxis.setAttribute("stroke-width", "1.2");

    const limit = document.createElementNS(svgNS, "line");
    limit.setAttribute("x1", "24");
    limit.setAttribute("y1", String(FIELD.limitY));
    limit.setAttribute("x2", "380");
    limit.setAttribute("y2", String(FIELD.limitY));
    limit.setAttribute("stroke", "#f0c14b");
    limit.setAttribute("stroke-width", "1.6");
    limit.setAttribute("stroke-dasharray", "6 4");

    const limitLabel = document.createElementNS(svgNS, "text");
    limitLabel.setAttribute("x", "318");
    limitLabel.setAttribute("y", String(FIELD.limitY - 8));
    limitLabel.setAttribute("fill", "#f0c14b");
    limitLabel.setAttribute("font-size", "11");
    limitLabel.textContent = "limit line  y = s";

    const curve = document.createElementNS(svgNS, "path");
    curve.setAttribute("d", curvePathD());
    curve.setAttribute("fill", "none");
    curve.setAttribute("stroke", "#4da3ff");
    curve.setAttribute("stroke-width", "2.4");
    curve.setAttribute("stroke-linecap", "round");

    const curveLabel = document.createElementNS(svgNS, "text");
    curveLabel.setAttribute("x", String(gSvgX(FIELD.curveTop) + 8));
    curveLabel.setAttribute("y", String(FIELD.curveTop + 4));
    curveLabel.setAttribute("fill", "#7ec0ff");
    curveLabel.setAttribute("font-size", "12");
    curveLabel.textContent = "g(y)";

    const sLabel = document.createElementNS(svgNS, "text");
    sLabel.setAttribute("x", "8");
    sLabel.setAttribute("y", String(FIELD.limitY + 4));
    sLabel.setAttribute("fill", "#c9d4e2");
    sLabel.setAttribute("font-size", "11");
    sLabel.textContent = "s";

    const dLabel = document.createElementNS(svgNS, "text");
    dLabel.setAttribute("x", "8");
    dLabel.setAttribute("y", String(FIELD.curveTop + 4));
    dLabel.setAttribute("fill", "#c9d4e2");
    dLabel.setAttribute("font-size", "11");
    dLabel.textContent = "d";

    axis.appendChild(xAxis);
    axis.appendChild(yAxis);
    axis.appendChild(limit);
    axis.appendChild(limitLabel);
    axis.appendChild(curve);
    axis.appendChild(curveLabel);
    axis.appendChild(sLabel);
    axis.appendChild(dLabel);
    svg.appendChild(axis);
}

function constrainedY(type, size) {
    const ceiling = 16;
    if (type === "circle") {
        return 16 + Math.random() * 250;
    }
    const maxTop = FIELD.limitY - size - 2;
    return ceiling + Math.random() * Math.max(8, maxTop - ceiling);
}

function curvePointAtT(t) {
    const clamped = Math.max(0.06, Math.min(0.94, t));
    const svgY = FIELD.limitY - clamped * (FIELD.limitY - FIELD.curveTop);
    return { x: gSvgX(svgY) - 20, y: svgY - 20, t: clamped };
}

function targetTFromPlacements(placements) {
    if (!placements.length) return 0.42;
    const span = FIELD.limitY - FIELD.curveTop;
    let heightBias = 0;
    let crowdBias = 0;
    for (const p of placements) {
        const midY = p.y + 20;
        const mathT = (FIELD.limitY - midY) / span;
        heightBias += Math.max(0, Math.min(1, mathT));
        const gx = gSvgX(Math.max(FIELD.curveTop, Math.min(FIELD.limitY, midY)));
        const dx = (p.x + 20) - gx;
        if (Math.abs(dx) < 70) crowdBias += (dx >= 0 ? -0.04 : 0.04);
    }
    const avg = heightBias / placements.length;
    return Math.max(0.08, Math.min(0.92, avg * 0.75 + 0.12 + crowdBias));
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
        el.setAttribute("transform", `translate(${p.x}, ${p.y})`);
        curveSquareState.t = t;
        if (u < 1) curveSquareState.raf = requestAnimationFrame(frame);
    }
    curveSquareState.raf = requestAnimationFrame(frame);
}

/* ============================================================
   TYPE INDEX UP — SELECT TYPE SET
   ============================================================ */
document.addEventListener("click", (e) => {
    if (e.target.matches("[data-action='select-type']")) {
        const selectedType = e.target.getAttribute("data-type");
        const output = document.getElementById("output");
        output.textContent = "TYPE SET " + selectedType + " selected. Initializing protocol...";
        initializeTypeProtocol(selectedType);
    }
});

/* ============================================================
   SHAPE ANALYZER
   ============================================================ */
function analyzeSVGShapes(shapeList) {
    let squareCount = shapeList.filter(s => s.type === "square").length;
    if (squareCount > 5) {
        return {
            avoid: true,
            reason: "Page contains more than 5 squares."
        };
    }
    return {
        avoid: false,
        reason: "Page is safe."
    };
}

/* ============================================================
   SHAPE GENERATOR — RANDOM
   ============================================================ */
function generateRandomShapes(count = 10) {
    const shapes = [];
    const types = ["square", "circle", "triangle", "hexagon"];
    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        shapes.push({ type });
    }
    return shapes;
}

/* ============================================================
   SHAPE GENERATOR — TYPE SET BASED (RADIAN ENGINE)
   ============================================================ */
function generateTypeShapes(typeNumber) {
    const radianMap = {
        "1": Math.PI / 6,
        "2": Math.PI,
        "3": 3 * Math.PI / 2
    };
    const theta = radianMap[typeNumber] || Math.PI / 6;
    const cosTheta = Math.cos(theta);
    let shapes = [];
    if (cosTheta > 0.5) {
        shapes.push({ type: "circle" });
        shapes.push({ type: "circle" });
        shapes.push({ type: "square" });
    } else if (cosTheta < -0.5) {
        shapes.push({ type: "square" });
        shapes.push({ type: "square" });
        shapes.push({ type: "triangle" });
    } else {
        shapes.push({ type: "triangle" });
        shapes.push({ type: "triangle" });
        shapes.push({ type: "circle" });
    }
    return shapes.map(s => ({
        ...s,
        theta,
        cosTheta
    }));
}

/* ============================================================
   SHAPE GENERATOR — AI TRIANGLE DIFFERENTIAL
   ============================================================ */
function generateTriangleDifferentialShapes() {
    const shapes = [];
    const regions = [
        { type: "square", region: "PRIMI" },
        { type: "circle", region: "ANTI" },
        { type: "triangle", region: "ANTI-ANTI" }
    ];
    for (let i = 0; i < 12; i++) {
        const r = regions[Math.floor(Math.random() * regions.length)];
        shapes.push({ type: r.type });
    }
    return shapes;
}

/* ============================================================
   SVG SHAPE DRAWING
   ============================================================ */
function drawSVGShapes(shapeList) {
    const svg = document.getElementById("svg-area");
    svg.innerHTML = "";
    const svgNS = "http://www.w3.org/2000/svg";

    drawField(svg, svgNS);

    const placements = [];
    let firstSquareEl = null;
    let firstSquareSeen = false;

    for (const shape of shapeList) {
        let el;
        const size = 40;
        const isLeadSquare = shape.type === "square" && !firstSquareSeen;

        if (shape.type === "square") {
            el = document.createElementNS(svgNS, "rect");
            el.setAttribute("width", 40);
            el.setAttribute("height", 40);
            el.setAttribute("fill", isLeadSquare ? "#fb7185" : "red");
            if (isLeadSquare) {
                el.setAttribute("stroke", "#fff1f2");
                el.setAttribute("stroke-width", "2");
                el.setAttribute("data-role", "curve-square");
            }
        }
        if (shape.type === "circle") {
            el = document.createElementNS(svgNS, "circle");
            el.setAttribute("r", 20);
            el.setAttribute("fill", "blue");
        }
        if (shape.type === "triangle") {
            el = document.createElementNS(svgNS, "polygon");
            el.setAttribute("points", "0,40 20,0 40,40");
            el.setAttribute("fill", "green");
        }
        if (shape.type === "hexagon") {
            el = document.createElementNS(svgNS, "polygon");
            el.setAttribute("points", "20,0 40,10 40,30 20,40 0,30 0,10");
            el.setAttribute("fill", "purple");
        }

        if (!el) continue;

        if (isLeadSquare) {
            firstSquareSeen = true;
            firstSquareEl = el;
            const start = curvePointAtT(curveSquareState.t);
            el.setAttribute("transform", `translate(${start.x}, ${start.y})`);
        } else {
            const x = Math.random() * 350;
            const y = constrainedY(shape.type, size);
            el.setAttribute("transform", `translate(${x}, ${y})`);
            placements.push({ type: shape.type, x, y });
        }

        svg.appendChild(el);
    }

    if (firstSquareEl) {
        const toT = targetTFromPlacements(placements);
        slideSquareAlongCurve(firstSquareEl, curveSquareState.t, toT);
    }
}

/* ============================================================
   RADIAN CIRCLE PULSE DISPLAY
   ============================================================ */
function updateRadianCircle(theta) {
    const rc = document.getElementById("radian-circle");
    rc.textContent = "θ = " + theta.toFixed(2);
    rc.style.transform = "scale(1.15)";
    setTimeout(() => {
        rc.style.transform = "scale(1)";
    }, 150);
}

/* ============================================================
   PRIME‑AI CORE — STATE ENGINE
   ============================================================ */
const AIState = {
    mode: "PRIMI",
    energy: 1.0,
    tension: 0.0,
    lastTypeSet: null
};

/* ============================================================
   PRIME‑AI CORE — DIFFERENTIAL ENGINE
   ============================================================ */
function computeDifferential(shapeList) {
    let squares = shapeList.filter(s => s.type === "square").length;
    let circles = shapeList.filter(s => s.type === "circle").length;
    let triangles = shapeList.filter(s => s.type === "triangle").length;
    return (squares * 0.4) + (triangles * 0.2) - (circles * 0.3);
}

/* ============================================================
   PRIME‑AI CORE — MODE SELECTOR
   ============================================================ */
function updateAIMode(tension, typeNumber) {
    AIState.lastTypeSet = typeNumber;
    AIState.tension = tension;
    if (tension > 1.5) {
        AIState.mode = "ANTI";
    } else if (tension < -0.5) {
        AIState.mode = "ANTI‑ANTI";
    } else {
        AIState.mode = "PRIMI";
    }
    return AIState.mode;
}

/* ============================================================
   PRIME‑AI CORE — RESPONSE GENERATOR
   ============================================================ */
function generateAIResponse() {
    const mode = AIState.mode;
    if (mode === "PRIMI") {
        return "AI MODE: PRIMI — Stable, constructive, low‑tension processing.";
    }
    if (mode === "ANTI") {
        return "AI MODE: ANTI — High tension detected. Defensive pattern activated.";
    }
    if (mode === "ANTI‑ANTI") {
        return "AI MODE: ANTI‑ANTI — Inversion mode. Reversal logic engaged.";
    }
}

/* ============================================================
   TYPE INDEX UP — PROTOCOL INITIALIZER
   ============================================================ */
function initializeTypeProtocol(typeNumber) {
    console.log("Protocol initialized for TYPE SET:", typeNumber);
    const randomShapes = generateRandomShapes(5);
    const typeShapes = generateTypeShapes(typeNumber);
    const triangleShapes = generateTriangleDifferentialShapes();
    const allShapes = [...randomShapes, ...typeShapes, ...triangleShapes];
    const result = analyzeSVGShapes(allShapes);
    const output = document.getElementById("output");
    drawSVGShapes(allShapes);
    const tension = computeDifferential(allShapes);
    const mode = updateAIMode(tension, typeNumber);
    const aiResponse = generateAIResponse();
    const theta = typeShapes[0].theta;
    updateRadianCircle(theta);
    output.textContent =
        (result.avoid ? "AVOID PAGE: " + result.reason : "PAGE OK: " + result.reason)
        + "\n\n" +
        "TENSION: " + tension.toFixed(2) + "\n" +
        aiResponse;
}

/* ============================================================
   JR.CLOUD BUTTON → FIREFOX HOMEPAGE
   ============================================================ */
document.addEventListener("click", (e) => {
    if (e.target.matches("[data-action='go-search']")) {
        window.location.href = "https://www.mozilla.org/en-US/firefox/new/";
    }
});
