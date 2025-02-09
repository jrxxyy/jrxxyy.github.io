document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('waveCanvas');
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const amplitude = 10;
        const frequency = 0.5;
        const width = canvas.width;
        const height = canvas.height;

        function drawWave() {
            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();
            for (let y = 0; y < height; y++) {
                const waveValue = amplitude * Math.sin(frequency * y);
                ctx.moveTo(0, y);
                ctx.lineTo(width, y + waveValue);
            }
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.stroke();
        }

        setInterval(drawWave, 100); // Apply the ripple effect continuously
        drawWave(); // Draw the initial ripple wave
    } else {
        console.error("Canvas is not supported in your browser.");
    }
});
