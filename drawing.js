// JavaScript code for drawing on the canvas
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// Resize the canvas
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.75;
    canvas.height = window.innerHeight * 0.75;
    positionVectorPoints();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Start drawing
canvas.addEventListener('mousedown', function(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
});

// Drawing
canvas.addEventListener('mousemove', function(e) {
    if (drawing) {
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
    }
});

// Stop drawing
canvas.addEventListener('mouseup', function() {
    drawing = false;
});

// Function to position the vector points
function positionVectorPoints() {
    const vectorLeft = document.getElementById('vectorLeft');
    const vectorRight = document.getElementById('vectorRight');
    const vectorAboveCenter = document.getElementById('vectorAboveCenter');

    // Position for the left corner
    vectorLeft.style.left = canvas.offsetLeft + 'px';
    vectorLeft.style.top = canvas.offsetTop + 'px';

    // Position for the right corner
    vectorRight.style.left = (canvas.offsetLeft + canvas.width - 10) + 'px';
    vectorRight.style.top = canvas.offsetTop + 'px';

    // Position slightly above the center
    vectorAboveCenter.style.left = (canvas.offsetLeft + canvas.width / 2 - 5) + 'px';
    vectorAboveCenter.style.top = (canvas.offsetTop + canvas.height / 2 - 50) + 'px';
}
