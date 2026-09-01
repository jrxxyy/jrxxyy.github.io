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
   SHAPE ANALYZER (Your original logic)
   ============================================================ */
function analyzeSVGShapes(shapeList) {
    let squareCount = 0;

    for (const shape of shapeList) {
        if (shape.type === "square") {
            squareCount++;
        }
    }

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
   SHAPE GENERATOR — TYPE SET BASED
   ============================================================ */
function generateTypeShapes(typeNumber) {
    switch (typeNumber) {
        case "1":
            return [
                { type: "square" },
                { type: "square" },
                { type: "circle" }
            ];

        case "2":
            return [
                { type: "triangle" },
                { type: "triangle" },
                { type: "square" }
            ];

        case "3":
            return [
                { type: "hexagon" },
                { type: "circle" },
                { type: "square" }
            ];

        default:
            return generateRandomShapes(5);
    }
}

/* ============================================================
   SHAPE GENERATOR — AI TRIANGLE DIFFERENTIAL
   ============================================================ */
function generateTriangleDifferentialShapes() {
    const shapes = [];

    // AI triangle regions
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
    svg.innerHTML = ""; // Clear previous shapes

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
            el.setAttribute(
                "points",
                "20,0 40,10 40,30 20,40 0,30 0,10"
            );
            el.setAttribute("fill", "purple");
        }

        // Random placement
        el.setAttribute("transform", `translate(${Math.random() * 350}, ${Math.random() * 250})`);

        svg.appendChild(el);
    }
}

/* ============================================================
   TYPE INDEX UP — PROTOCOL INITIALIZER
   ============================================================ */
function initializeTypeProtocol(typeNumber) {
    console.log("Protocol initialized for TYPE SET:", typeNumber);

    // Generate ALL shape sets
    const randomShapes = generateRandomShapes(5);
    const typeShapes = generateTypeShapes(typeNumber);
    const triangleShapes = generateTriangleDifferentialShapes();

    // Merge them
    const allShapes = [...randomShapes, ...typeShapes, ...triangleShapes];

    // Analyze
    const result = analyzeSVGShapes(allShapes);
    const output = document.getElementById("output");

    if (result.avoid) {
        output.textContent = "AVOID PAGE: " + result.reason;
    } else {
        output.textContent = "PAGE OK: " + result.reason;
    }

    // Draw SVG
    drawSVGShapes(allShapes);
}

/* ============================================================
   JR.CLOUD BUTTON → FIREFOX HOMEPAGE
   ============================================================ */
document.addEventListener("click", (e) => {
    if (e.target.matches("[data-action='go-search']")) {
        window.location.href = "https://www.mozilla.org/en-US/firefox/new/";
    }
});
