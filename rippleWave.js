<!DOCTYPE html>
<html>
<head>
    <title>Ripple Effect with Image</title>
</head>
<body>
    <canvas id="waveCanvas" width="500" height="500"></canvas>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const canvas = document.getElementById('waveCanvas');
            if (canvas.getContext) {
                const ctx = canvas.getContext('2d');
                const amplitude = 10;
                const frequency = 0.5;
                const width = canvas.width;
                const height = canvas.height;
                const img = new Image();
                img.src = 'https://www.bing.com/th/id/OGC.4774f0c6383d71b780d8cf736606b3d7?pid=1.7&rurl=https%3a%2f%2fi.stack.imgur.com%2fn7Lqs.gif&ehk=IjygwGpdrHZS0I04evJyPKib7opz%2be3%2bhU9KJIIUvWw%3d'; // Direct URL to your image

                img.onload = function() {
                    function drawWave() {
                        ctx.clearRect(0, 0, width, height);
                        ctx.drawImage(img, 0, 0, width, height); // Draw the image first
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
                };
            } else {
                console.error("Canvas is not supported in your browser.");
            }
        });
    </script>
</body>
</html>
