document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("generate-outcome-btn");

    if (btn) {
        btn.addEventListener("click", () => {
            window.location.href = "outcome.html";
        });
    }
});
