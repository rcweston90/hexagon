const canvas = document.getElementById('hexCanvas');
const ctx = canvas.getContext('2d');
let mouse = { x: -9999, y: -9999 };

let hexRadius = 50;
const hexHeight = Math.sqrt(3) * hexRadius;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cols = Math.ceil(canvas.width / (hexRadius * 1.5)) + 1;
  const rows = Math.ceil(canvas.height / hexHeight) + 1;
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const cx = col * hexRadius * 1.5;
      const cy = row * hexHeight + (col % 2) * (hexHeight / 2);
      drawHex(cx, cy);
    }
  }
}

function drawHex(cx, cy) {
  const distance = Math.hypot(mouse.x - cx, mouse.y - cy);
  const maxDist = 150;
  const factor = Math.max(0, 1 - distance / maxDist);
  const baseColor = { r: 40, g: 120, b: 200 };
  const r = Math.min(255, Math.round(baseColor.r + factor * (255 - baseColor.r)));
  const g = Math.min(255, Math.round(baseColor.g + factor * (255 - baseColor.g)));
  const b = Math.min(255, Math.round(baseColor.b + factor * (255 - baseColor.b)));

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i;
    const x = cx + hexRadius * Math.cos(angle);
    const y = cy + hexRadius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fill();
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  draw();
});
window.addEventListener('resize', resize);
resize();
