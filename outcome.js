console.log("OUTCOME.JS LOADED");

// TYPE INDEX UP — SELECT TYPE SET
document.addEventListener("click", (e) => {
    if (e.target.matches("[data-action='select-type']")) {

        const selectedType = e.target.getAttribute("data-type");
        const output = document.getElementById("output");

        output.textContent = "TYPE SET " + selectedType + " selected. Initializing protocol...";

        initializeTypeProtocol(selectedType);
    }
});

// SVG SHAPE ANALYZER
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

// TYPE INDEX UP — PROTOCOL INITIALIZER
function initializeTypeProtocol(typeNumber) {
    console.log("Protocol initialized for TYPE SET:", typeNumber);

    const exampleShapeData = [
        {type: "square"},
        {type: "square"},
        {type: "circle"},
        {type: "square"},
        {type: "square"},
        {type: "square"},
        {type: "square"}
    ];

    const result = analyzeSVGShapes(exampleShapeData);
    const output = document.getElementById("output");

    if (result.avoid) {
        output.textContent = "AVOID PAGE: " + result.reason;
    } else {
        output.textContent = "PAGE OK: " + result.reason;
    }
}

// JR.CLOUD BUTTON → REDIRECT TO FIREFOX SEARCH ENGINE WITH QUERY
document.addEventListener("click", (e) => {
    if (e.target.matches("[data-action='go-search']")) {

        // This opens Firefox's search engine with the query already filled in
        window.location.href = "https://www.mozilla.org/en-US/search/?q=avoid+squares";
    }
});
