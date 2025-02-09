document.addEventListener("DOMContentLoaded", function() {
    function applyRippleEffect() {
        const boxes = document.querySelectorAll('.box');
        boxes.forEach((box, index) => {
            const canvas = document.createElement('canvas');
            canvas.width = 25;
            canvas.height = 25;
            box.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            const amplitude = 5;
            const frequency = 2;
            const xScale = canvas.width / 1.2;
            const yScale = canvas.height / 1.2;

            function drawWave() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                for (let y = 0; y < canvas.height; y++) {
                    for (let x = 0; x < canvas.width; x++) {
                        const waveValue = amplitude * Math.sin(frequency * (x / xScale + y / yScale));
                        const adjustedValue = Math.abs(Math.sin(waveValue)); // Adjusting wave value to create lines

                        ctx.fillStyle = `rgba(255, 255, 255, ${adjustedValue})`;
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
                ctx.stroke();
            }

            setInterval(drawWave, 100); // Apply the ripple effect continuously
            drawWave(); // Draw the initial ripple wave
        });
    }

    applyRippleEffect();
});
