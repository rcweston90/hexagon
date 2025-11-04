const canvas = document.getElementById('hexCanvas');
const ctx = canvas.getContext('2d');

// Mouse tracking
let mouse = { x: -9999, y: -9999 };
let lastMousePos = { x: -9999, y: -9999 };
let mouseStationaryStart = null;
let mouseMoveThreshold = 5; // pixels to consider mouse "moving"

// Hexagon settings
let hexRadius = 50;
const hexHeight = Math.sqrt(3) * hexRadius;

// Dynamic radius settings
const baseMaxDist = 150;
const maxMaxDist = 400;
const radiusGrowthRate = 0.5; // pixels per second
let currentMaxDist = baseMaxDist;
let targetMaxDist = baseMaxDist;

// Animation state
let needsRedraw = true;
let animationFrameId = null;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  needsRedraw = true;
}

function draw() {
  const now = performance.now();
  
  // Update dynamic radius based on mouse stationary time
  updateDynamicRadius(now);
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw hexagon grid
  const cols = Math.ceil(canvas.width / (hexRadius * 1.5)) + 1;
  const rows = Math.ceil(canvas.height / hexHeight) + 1;
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const cx = col * hexRadius * 1.5;
      const cy = row * hexHeight + (col % 2) * (hexHeight / 2);
      drawHex(cx, cy);
    }
  }
  
  needsRedraw = false;
}

function updateDynamicRadius(now) {
  // Check if mouse has moved significantly
  const distanceMoved = Math.hypot(mouse.x - lastMousePos.x, mouse.y - lastMousePos.y);
  
  if (distanceMoved > mouseMoveThreshold) {
    // Mouse moved, reset stationary tracking
    mouseStationaryStart = null;
    targetMaxDist = baseMaxDist;
    lastMousePos = { x: mouse.x, y: mouse.y };
  } else {
    // Mouse is stationary
    if (mouseStationaryStart === null) {
      mouseStationaryStart = now;
    }
    
    // Calculate how long mouse has been stationary (in seconds)
    const stationaryDuration = (now - mouseStationaryStart) / 1000;
    
    // Calculate target radius based on stationary time
    const additionalRadius = Math.min(
      stationaryDuration * radiusGrowthRate,
      maxMaxDist - baseMaxDist
    );
    targetMaxDist = baseMaxDist + additionalRadius;
  }
  
  // Smoothly interpolate current radius towards target
  const radiusChangeSpeed = 0.1;
  currentMaxDist += (targetMaxDist - currentMaxDist) * radiusChangeSpeed;
}

function drawHex(cx, cy) {
  const distance = Math.hypot(mouse.x - cx, mouse.y - cy);
  const factor = Math.max(0, 1 - distance / currentMaxDist);
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
  
  // Fill hexagon
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fill();
  
  // Draw border with defined lines
  const borderColor = `rgb(${Math.max(0, Math.round(r * 0.6))}, ${Math.max(0, Math.round(g * 0.6))}, ${Math.max(0, Math.round(b * 0.6))})`;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function animate() {
  if (needsRedraw) {
    draw();
  }
  animationFrameId = requestAnimationFrame(animate);
}

// Mouse move handler
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  needsRedraw = true;
});

window.addEventListener('resize', resize);

// Initialize
resize();
animate();
