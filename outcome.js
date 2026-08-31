document.addEventListener("click", (e) => {
    if (e.target.matches("[data-action='select-type']")) {

        const selectedType = e.target.getAttribute("data-type");
        const output = document.getElementById("output");

        output.textContent = "TYPE SET " + selectedType + " selected. Initializing protocol...";
        
        initializeTypeProtocol(selectedType);
    }
});

function initializeTypeProtocol(typeNumber) {
    console.log("Protocol initialized for TYPE SET:", typeNumber);

    // Future expansion:
    // - Query Firefox SVG database
    // - Match shape signatures
    // - Return actionable results
}
