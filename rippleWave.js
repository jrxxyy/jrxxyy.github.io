document.addEventListener("DOMContentLoaded", function() {
    function applyRippleEffect() {
        const boxes = document.querySelectorAll('.box');
        boxes.forEach((box) => {
            const invisibleContainer = document.createElement('div');
            invisibleContainer.style.position = 'absolute';
            invisibleContainer.style.top = '0';
            invisibleContainer.style.left = '0';
            invisibleContainer.style.width = '100%';
            invisibleContainer.style.height = '100%';
            invisibleContainer.style.pointerEvents = 'none'; // Makes it invisible to interactions
            invisibleContainer.style.overflow = 'hidden';

            const canvas = document.createElement('canvas');
            canvas.width = 100; // Adjust for better visibility
            canvas.height = 100; // Adjust for better visibility
            invisibleContainer.appendChild(canvas);
            box.appendChild(invisibleContainer);

            const ctx = canvas.getContext('2d');
            const amplitude = 10;
            const frequency = 0.5;
            const xScale = canvas.width / 1.2;
            const yScale = canvas.height / 1.2;

            function drawWave() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                for (let y = 0; y < canvas.height; y++) {
                    const waveValue = amplitude * Math.sin(frequency * (y / yScale));
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y + waveValue);
                }
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.stroke();
            }

            setInterval(drawWave, 100); // Apply the ripple effect continuously
            drawWave(); // Draw the initial ripple wave
        });
    }

    applyRippleEffect();
});
