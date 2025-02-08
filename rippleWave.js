// Ripple Wave Function
const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');
const width = 1.2;
const height = 3.5;
const amplitude = 20;
const frequency = 5;
canvas.width = 400;
canvas.height = 400 * height / width;
const xScale = canvas.width / width;
const yScale = canvas.height / height;

function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const waveValue = amplitude * Math.sin(frequency * (x / xScale + y / yScale));
            ctx.fillStyle = `rgb(${waveValue + 128}, ${waveValue + 128}, 255)`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
    ctx.stroke();
}

drawWave();
