document.addEventListener("click", (e) => {
    if (e.target.matches("[data-action='select-type']")) {

        const selectedType = e.target.getAttribute("data-type");
        const output = document.getElementById("output");

        output.textContent = "TYPE SET " + selectedType + " selected. Initializing protocol...";

        initializeTypeProtocol(selectedType);
    }
});

function analyzeSVGShapes(shapeList) {
    // shapeList = array of shape objects sent from Firefox backend
    // Example: [{type: "square"}, {type: "circle"}, ...]

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

function initializeTypeProtocol(typeNumber) {
    console.log("Protocol initialized for TYPE SET:", typeNumber);

    // Placeholder: Firefox will send shape data here
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
document.addEventListener("click", (e) => {
    // Redirect JR.CLOUD button
    if (e.target.matches("[data-action='go-search']")) {

        // Redirect to your Firefox search engine page
        window.location.href = "firefox-search.html"; 
    }
});

