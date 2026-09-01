console.log("OUTCOME.JS LOADED");

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

    // Radian assignments
    const radianMap = {
        "1": Math.PI / 6,     // 30 degrees
        "2": Math.PI,         // 180 degrees
        "3": 3 * Math.PI / 2  // 270 degrees
    };

    const theta = radianMap[typeNumber] || Math.PI / 6;
    const cosTheta = Math.cos(theta);

    let shapes = [];

    if (cosTheta > 0.5) {
        shapes.push({ type: "circle" });
        shapes.push({ type: "circle" });
        shapes.push({ type: "square" });
    }
    else if (cosTheta < -0.5) {
        shapes.push({ type: "square" });
        shapes.push({ type: "square" });
        shapes.push({ type: "triangle" });
    }
    else {
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

    for (const shape of shapeList) {
        let el;

        if (shape.type === "square") {
            el = document.createElementNS(svgNS, "rect");
            el.setAttribute("width", 40);
            el.setAttribute("height", 40);
            el.setAttribute("fill", "red");
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
            el.setAttribute("points","20,0 40,10 40,30 20,40 0,30 0,10");
            el.setAttribute("fill", "purple");
        }

        el.setAttribute("transform", `translate(${Math.random() * 350}, ${Math.random() * 250})`);
        svg.appendChild(el);
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

    // Update radian circle
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
