const canvas = document.getElementById('sakura-canvas');
const ctx = canvas.getContext('2d');

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;
let time = 0;

const wind = {
  strength: 0,
  target: 0.35,
  timer: 0,
};

function tickWind() {
  wind.timer -= 0.008;
  if (wind.timer <= 0) {
    wind.target = Math.random() * 0.5 + 0.15;
    wind.timer = Math.random() * 8 + 6;
  }
  wind.strength += (wind.target - wind.strength) * 0.003;
  return wind.strength + Math.sin(time * 0.0003) * 0.04;
}


/* --- stars ------------------------------------------------------------- */

const starData = Array.from({ length: 90 }, (_, i) => ({
  x:     Math.sin(i * 127.1 + 3) * 0.5 + 0.5,
  y:     (Math.sin(i * 311.7 + 1) * 0.5 + 0.5) * 0.52,
  r:     i % 7 === 0 ? 1.1 : 0.45,
  phase: Math.random() * Math.PI * 2,
  speed: 0.0004 + Math.random() * 0.0003,
  base:  0.30 + Math.random() * 0.25,
  amp:   0.06 + Math.random() * 0.06,
}));

function drawStars(t) {
  for (const s of starData) {
    const opacity = s.base + Math.sin(t * s.speed * 1000 + s.phase) * s.amp;
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 215, 235, ${opacity})`;
    ctx.fill();
  }
}


/* --- sky --------------------------------------------------------------- */

function drawSky() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0,    '#060210');
  g.addColorStop(0.15, '#100428');
  g.addColorStop(0.32, '#280838');
  g.addColorStop(0.48, '#7a1245');
  g.addColorStop(0.58, '#c2185b');
  g.addColorStop(0.68, '#7a1245');
  g.addColorStop(0.80, '#1e0520');
  g.addColorStop(0.92, '#080110');
  g.addColorStop(1,    '#020008');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const hg = ctx.createRadialGradient(W*0.50, H*0.58, 0, W*0.50, H*0.58, W*0.65);
  hg.addColorStop(0,   'rgba(194, 24, 91, 0.18)');
  hg.addColorStop(0.5, 'rgba(140, 10, 60, 0.07)');
  hg.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = hg;
  ctx.fillRect(0, 0, W, H);
}


/* --- moon -------------------------------------------------------------- */

let moonCanvas = null;
let moonReflectionC = null;
const moonImg = new Image();

function buildMoon() {
  if (!moonImg.complete || !moonImg.naturalWidth) return;
  const mr = Math.min(W, H) * 0.058;
  const size = Math.round(mr * 3.2);
  const cx = size / 2;
  moonCanvas = document.createElement('canvas');
  moonCanvas.width = size;
  moonCanvas.height = size;
  const mc = moonCanvas.getContext('2d');
  const iw = moonImg.naturalWidth;
  const ih = moonImg.naturalHeight;
  const scale = (mr * 2) / Math.min(iw, ih);
  const dw = iw * scale;
  const dh = ih * scale;
  mc.globalAlpha = 0.90;
  mc.drawImage(moonImg, cx - dw/2, cx - dh/2, dw, dh);
  mc.globalCompositeOperation = 'destination-in';
  const mask = mc.createRadialGradient(cx, cx, mr * 0.55, cx, cx, mr * 1.30);
  mask.addColorStop(0,    'rgba(0,0,0,1)');
  mask.addColorStop(0.45, 'rgba(0,0,0,1)');
  mask.addColorStop(0.72, 'rgba(0,0,0,0.6)');
  mask.addColorStop(0.88, 'rgba(0,0,0,0.15)');
  mask.addColorStop(1,    'rgba(0,0,0,0)');
  mc.fillStyle = mask;
  mc.fillRect(0, 0, size, size);

  buildMoonReflection();
}

// Pre-render the squashed, faded reflection — used unchanged every frame.
function buildMoonReflection() {
  if (!moonCanvas) return;
  const ms = moonCanvas.width;
  const rs = ms * 0.42;
  moonReflectionC = document.createElement('canvas');
  moonReflectionC.width  = rs * 2;
  moonReflectionC.height = rs;
  const oc = moonReflectionC.getContext('2d');
  oc.save();
  oc.translate(rs, rs * 0.5);
  oc.scale(1, 0.45);
  oc.drawImage(moonCanvas, -rs, -rs, rs * 2, rs * 2);
  oc.restore();
  oc.globalCompositeOperation = 'destination-in';
  const fade = oc.createRadialGradient(rs, rs*0.5, 0, rs, rs*0.5, rs*0.88);
  fade.addColorStop(0,   'rgba(0,0,0,1)');
  fade.addColorStop(0.6, 'rgba(0,0,0,0.85)');
  fade.addColorStop(1,   'rgba(0,0,0,0)');
  oc.fillStyle = fade;
  oc.fillRect(0, 0, rs * 2, rs);
}

moonImg.onload = buildMoon;
moonImg.src = '../assets/moon.png';

function drawMoon() {
  const mx = W * 0.76, my = H * 0.16, mr = Math.min(W, H) * 0.058;
  const og = ctx.createRadialGradient(mx, my, mr * 0.4, mx, my, mr * 4);
  og.addColorStop(0,   'rgba(220, 160, 180, 0.18)');
  og.addColorStop(0.5, 'rgba(150, 50, 100, 0.07)');
  og.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = og;
  ctx.fillRect(0, 0, W, H);
  if (moonCanvas) {
    const size = moonCanvas.width;
    ctx.save();
    ctx.globalAlpha = 0.88;
    ctx.drawImage(moonCanvas, mx - size/2, my - size/2);
    ctx.globalAlpha = 1;
    const tint = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 1.1);
    tint.addColorStop(0,   'rgba(100, 15, 50, 0.18)');
    tint.addColorStop(0.6, 'rgba(60, 8, 30, 0.10)');
    tint.addColorStop(1,   'rgba(0, 0, 0, 0)');
    ctx.fillStyle = tint;
    ctx.fillRect(mx - size/2, my - size/2, size, size);
    ctx.restore();
  }
}


/* --- fuji + pagoda ----------------------------------------------------- */

function drawFuji() {
  const cx = W * 0.20;
  const top = H * 0.12;
  const base = H * 0.80;
  const hw = W * 0.22;

  const fg = ctx.createRadialGradient(cx, top + (base-top)*0.4, 0, cx, top + (base-top)*0.4, hw * 1.2);
  fg.addColorStop(0,   'rgba(100, 30, 70, 0.20)');
  fg.addColorStop(0.7, 'rgba(60, 10, 45, 0.06)');
  fg.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = fg;
  ctx.fillRect(0, 0, W * 0.50, H);

  ctx.beginPath();
  ctx.moveTo(cx, top);
  ctx.bezierCurveTo(cx - hw*0.18, top + (base-top)*0.35, cx - hw*0.72, base - H*0.04, cx - hw, base);
  ctx.lineTo(cx + hw, base);
  ctx.bezierCurveTo(cx + hw*0.72, base - H*0.04, cx + hw*0.18, top + (base-top)*0.35, cx, top);
  ctx.closePath();
  const bg = ctx.createLinearGradient(cx - hw*0.5, top, cx + hw*0.3, base);
  bg.addColorStop(0,   'rgba(55, 18, 60, 0.82)');
  bg.addColorStop(0.4, 'rgba(40, 12, 52, 0.86)');
  bg.addColorStop(0.8, 'rgba(25, 8, 38, 0.90)');
  bg.addColorStop(1,   'rgba(15, 5, 25, 0.94)');
  ctx.fillStyle = bg;
  ctx.fill();

  // snowcap
  ctx.beginPath();
  ctx.moveTo(cx, top);
  ctx.bezierCurveTo(cx - hw*0.04, top + (base-top)*0.10, cx - hw*0.16, top + (base-top)*0.22, cx - hw*0.22, top + (base-top)*0.28);
  ctx.bezierCurveTo(cx - hw*0.10, top + (base-top)*0.30, cx + hw*0.10, top + (base-top)*0.30, cx + hw*0.22, top + (base-top)*0.28);
  ctx.bezierCurveTo(cx + hw*0.16, top + (base-top)*0.22, cx + hw*0.04, top + (base-top)*0.10, cx, top);
  ctx.closePath();
  const sg = ctx.createLinearGradient(cx, top, cx, top + (base-top)*0.30);
  sg.addColorStop(0,   'rgba(255, 240, 245, 0.92)');
  sg.addColorStop(0.6, 'rgba(210, 170, 190, 0.60)');
  sg.addColorStop(1,   'rgba(160, 100, 140, 0.15)');
  ctx.fillStyle = sg;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx, top);
  ctx.bezierCurveTo(cx - hw*0.18, top + (base-top)*0.35, cx - hw*0.72, base - H*0.04, cx - hw, base);
  ctx.strokeStyle = 'rgba(194, 24, 91, 0.08)';
  ctx.lineWidth = 1;
  ctx.stroke();

  const bm = ctx.createLinearGradient(0, H*0.52, 0, H*0.65);
  bm.addColorStop(0,   'rgba(30, 8, 40, 0)');
  bm.addColorStop(0.5, 'rgba(20, 5, 30, 0.55)');
  bm.addColorStop(1,   'rgba(10, 2, 18, 0.85)');
  ctx.fillStyle = bm;
  ctx.fillRect(0, H*0.52, W*0.45, H*0.13);
}

function drawPagoda() {
  const px = W * 0.82;
  const py = H * 0.72;

  const col  = 'rgba(12, 4, 24, 0.90)';
  const roof = 'rgba(18, 6, 30, 0.88)';
  const rim  = 'rgba(194, 24, 91, 0.12)';

  function tier(x, y, w, h, rh) {
    ctx.fillStyle = col;
    ctx.fillRect(x - w/2, y - h, w, h);

    ctx.beginPath();
    ctx.moveTo(x, y - h - rh);
    ctx.bezierCurveTo(x - w*0.2, y - h - rh*0.3, x - w*0.7, y - h, x - w*0.9, y - h);
    ctx.lineTo(x + w*0.9, y - h);
    ctx.bezierCurveTo(x + w*0.7, y - h, x + w*0.2, y - h - rh*0.3, x, y - h - rh);
    ctx.fillStyle = roof;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x - w*0.9, y - h);
    ctx.lineTo(x + w*0.9, y - h);
    ctx.strokeStyle = rim;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  ctx.fillStyle = col;
  ctx.fillRect(px - 38, py, 76, 10);

  tier(px, py,      64, 28, 12);
  tier(px, py - 28, 50, 24, 10);
  tier(px, py - 52, 38, 20, 9);

  ctx.beginPath();
  ctx.moveTo(px, py - 80);
  ctx.lineTo(px - 3, py - 72);
  ctx.lineTo(px + 3, py - 72);
  ctx.closePath();
  ctx.fillStyle = col;
  ctx.fill();

  const pm = ctx.createLinearGradient(0, H*0.56, 0, H*0.66);
  pm.addColorStop(0,   'rgba(20, 5, 30, 0)');
  pm.addColorStop(0.6, 'rgba(12, 3, 20, 0.65)');
  pm.addColorStop(1,   'rgba(6, 1, 12, 0.90)');
  ctx.fillStyle = pm;
  ctx.fillRect(px - 130, H*0.56, 260, H*0.10);
}


/* --- landscape --------------------------------------------------------- */

function softHill(pts, fillStyle) {
  ctx.beginPath();
  ctx.moveTo(-10, H + 10);
  ctx.lineTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i+1][0]) / 2;
    const my = (pts[i][1] + pts[i+1][1]) / 2;
    ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
  }
  const lp = pts[pts.length - 1];
  ctx.lineTo(lp[0], lp[1]);
  ctx.lineTo(W + 10, H + 10);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function drawLandscape() {
  softHill([
    [0,H*0.54],[W*0.12,H*0.44],[W*0.25,H*0.48],[W*0.38,H*0.40],
    [W*0.50,H*0.46],[W*0.62,H*0.40],[W*0.75,H*0.46],[W*0.88,H*0.42],[W,H*0.50]
  ], 'rgba(35, 10, 48, 0.55)');

  softHill([
    [0,H*0.63],[W*0.08,H*0.56],[W*0.18,H*0.60],[W*0.30,H*0.52],
    [W*0.42,H*0.58],[W*0.54,H*0.50],[W*0.66,H*0.57],[W*0.78,H*0.52],
    [W*0.90,H*0.59],[W,H*0.55]
  ], 'rgba(22, 6, 34, 0.72)');

  const mist = ctx.createLinearGradient(0, H*0.54, 0, H*0.70);
  mist.addColorStop(0,   'rgba(80, 20, 55, 0)');
  mist.addColorStop(0.35,'rgba(55, 12, 42, 0.28)');
  mist.addColorStop(0.65,'rgba(40, 8, 32, 0.18)');
  mist.addColorStop(1,   'rgba(20, 4, 20, 0)');
  ctx.fillStyle = mist;
  ctx.fillRect(0, H*0.54, W, H*0.16);

  softHill([
    [0,H*0.68],[W*0.06,H*0.60],[W*0.14,H*0.65],[W*0.22,H*0.58],
    [W*0.32,H*0.63],[W*0.42,H*0.57],[W*0.50,H*0.62],[W*0.58,H*0.56],
    [W*0.68,H*0.62],[W*0.78,H*0.58],[W*0.88,H*0.64],[W*0.95,H*0.60],[W,H*0.65]
  ], 'rgba(12, 4, 20, 0.92)');

  softHill([
    [0,H*0.76],[W*0.10,H*0.70],[W*0.20,H*0.74],[W*0.30,H*0.68],
    [W*0.40,H*0.73],[W*0.50,H*0.67],[W*0.60,H*0.72],[W*0.70,H*0.68],
    [W*0.80,H*0.74],[W*0.90,H*0.70],[W,H*0.75]
  ], 'rgba(6, 2, 12, 0.97)');

  const bottomFade = ctx.createLinearGradient(0, H*0.72, 0, H);
  bottomFade.addColorStop(0,   'rgba(4, 1, 10, 0)');
  bottomFade.addColorStop(0.25,'rgba(4, 1, 10, 0.90)');
  bottomFade.addColorStop(1,   'rgba(2, 0, 6, 1)');
  ctx.fillStyle = bottomFade;
  ctx.fillRect(0, H*0.72, W, H*0.28);
}


/* --- tree mirror ------------------------------------------------------- */

const treeImg = new Image();
let mirrorC = null;

function buildTrees() {
  if (!treeImg.complete || !treeImg.naturalWidth) return;
  const size = Math.round(Math.min(W, H) * 0.665);

  mirrorC = document.createElement('canvas');
  mirrorC.width = size;
  mirrorC.height = size;
  const mc = mirrorC.getContext('2d');
  mc.translate(size, size);
  mc.scale(-1, -1);
  mc.drawImage(treeImg, 0, 0, size, size);
  mc.setTransform(1,0,0,1,0,0);
  mc.globalCompositeOperation = 'source-atop';
  mc.fillStyle = 'rgba(210, 80, 130, 0.22)';
  mc.fillRect(0, 0, size, size);
}

treeImg.onload = buildTrees;
treeImg.src = '../assets/tree.png';

function drawTree(sway) {
  if (!mirrorC) return;
  const size = mirrorC.width;
  const ang = sway * 0.031;
  // -0.05 felt right, -0.08 showed too much trunk
  const pivotY = H * -0.05;

  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.translate(W * -0.10, pivotY);
  ctx.rotate(-ang);
  ctx.drawImage(mirrorC, -size * 0.04, 0);
  ctx.restore();
}


/* --- petals ------------------------------------------------------------ */

const PETAL_COUNT = 18;
const PETAL_BURST_COUNT = 80;
const PETAL_BURST_CAP = 55;

let spawns = [];

function initSpawns() {
  spawns = [];
  // Match the canopy's actual shape so petals fall from the tree, not from
  // empty sky. A few seed off-canvas to hint at branches beyond the frame.
  const treeSize = Math.min(W, H) * 0.665;
  const centerX = treeSize * 0.30;
  const centerY = treeSize * 0.32;
  const radiusX = treeSize * 0.42;
  const radiusY = treeSize * 0.32;

  for (let i = 0; i < 50; i++) {
    let x, y;
    if (Math.random() < 0.90) {
      do {
        x = centerX + (Math.random() - 0.5) * 2 * radiusX;
        y = centerY + (Math.random() - 0.5) * 2 * radiusY;
        const nx = (x - centerX) / radiusX;
        const ny = (y - centerY) / radiusY;
        if (nx * nx + ny * ny <= 1) break;
      } while (true);
    } else if (Math.random() < 0.5) {
      x = -40 + Math.random() * (centerX + radiusX * 0.4);
      y = -30 + Math.random() * 40;
    } else {
      x = -40 + Math.random() * 30;
      y = Math.random() * (centerY + radiusY);
    }
    spawns.push({ x, y });
  }
}

const petalImg = new Image();
petalImg.src = '../assets/petal.png';

class Petal {
  constructor() { this.reset(true); }

  spawnPoint() {
    if (spawns.length > 0) {
      return spawns[Math.floor(Math.random() * spawns.length)];
    }
    return { x: Math.random() * W * 0.3, y: H * 0.3 };
  }

  reset(initial) {
    const sp = this.spawnPoint();
    this.x = sp.x + (Math.random() - 0.5) * 12;
    // Scatter initial petals down the fall path so we don't start with
    // everything bunched at the top.
    this.y = initial
      ? sp.y + Math.random() * (H - sp.y)
      : sp.y + (Math.random() - 0.5) * 8;
    this.size = Math.random() * 1.2 + 0.6;
    this.speedY = Math.random() * 0.55 + 0.20;
    this.speedX = Math.random() * 0.48 + 0.52;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.018;
    this.ang = Math.random() * Math.PI * 2;
    this.swaySpeed = Math.random() * 0.010 + 0.004;
    this.swayAmp   = Math.random() * 1.2 + 0.4;
    this.opacity = 0.35 + Math.random() * 0.55;
  }

  update(w) {
    this.ang += this.swaySpeed;
    this.x += this.speedX + w * 0.6 + Math.sin(this.ang) * this.swayAmp;
    this.y += this.speedY + Math.abs(w) * 0.15;
    this.rotation += this.rotSpeed;
    if (this.y > H + 20 || this.x > W + 60 || this.x < -60) this.reset(false);
  }

  draw() {
    if (!petalImg.complete || !petalImg.naturalWidth) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    const s = this.size * 12;
    const ratio = petalImg.naturalHeight / petalImg.naturalWidth;
    ctx.drawImage(petalImg, -s * 0.5, -s * ratio * 0.5, s, s * ratio);
    ctx.restore();
  }
}

const petals = [];
for (let i = 0; i < PETAL_COUNT; i++) petals.push(new Petal());

let burstActive = false;
function burstPetals() {
  if (burstActive) return;
  burstActive = true;
  for (let i = 0; i < PETAL_BURST_COUNT; i++) {
    setTimeout(() => {
      const p = new Petal();
      p.reset(false);
      petals.push(p);
    }, i * 40);
  }
  setTimeout(() => {
    if (petals.length > PETAL_BURST_CAP) petals.length = PETAL_BURST_CAP;
    burstActive = false;
  }, 7000);
}


/* --- boat -------------------------------------------------------------- */

const boatImg = new Image();
boatImg.src = '../assets/boat.png';

function drawBoat(t) {
  if (!boatImg.complete || !boatImg.naturalWidth) return;
  const sc = Math.min(W, H) * 0.00028;
  const dw = boatImg.naturalWidth  * sc;
  const dh = boatImg.naturalHeight * sc;
  const bx = W * 0.78 - dw * 0.5;
  const bob  = Math.sin(t * 0.013) * 3.5;
  const tilt = Math.sin(t * 0.013) * 0.009;
  const by = H * 0.60 - dh * 0.72 + bob;
  ctx.save();
  ctx.globalAlpha = 0.88;
  ctx.translate(bx + dw * 0.5, by + dh * 0.5);
  ctx.rotate(tilt);
  ctx.drawImage(boatImg, -dw * 0.5, -dh * 0.5, dw, dh);
  ctx.restore();
}


/* --- reflections ------------------------------------------------------- */

function drawReflections(t) {
  const hy = H * 0.60;
  if (boatImg.complete && boatImg.naturalWidth) {
    const sc   = Math.min(W, H) * 0.00028;
    const dw   = boatImg.naturalWidth  * sc;
    const dh   = boatImg.naturalHeight * sc;
    const bob  = Math.sin(t * 0.013) * 3.5;
    const tilt = Math.sin(t * 0.013) * 0.009;
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.translate(W * 0.78, hy + dh * 0.94 + bob);
    ctx.rotate(-tilt);
    ctx.scale(1, -1);
    ctx.drawImage(boatImg, -dw * 0.5, -dh * 0.28, dw, dh);
    ctx.restore();
  }

  if (moonReflectionC) {
    const ms = moonCanvas.width;
    const mx = W * 0.76;
    const ry = H * 0.75;
    const rs = ms * 0.42;
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.drawImage(moonReflectionC, mx - rs, ry - rs * 0.5);
    ctx.restore();
  }
}


/* --- water life: ripples + fish --------------------------------------- */

const WATER_TOP = 0.62;
const WATER_BOT = 0.86;
const WATER_PERSPECTIVE = 0.45;
const RIPPLE_COLOR = 'rgba(220, 180, 200,';
const RIPPLE_AMBIENT_MAX = 5;

const ripples = [];

function spawnRipple(nx, ny, strength = 1) {
  ripples.push({
    nx, ny,
    age: 0,
    life: 140 + Math.random() * 80,
    maxR: (14 + Math.random() * 18) * strength,
    alpha0: (0.18 + Math.random() * 0.10) * strength,
  });
}

function updateRipples() {
  if (ripples.length < RIPPLE_AMBIENT_MAX && Math.random() < 0.04) {
    const nx = Math.random();
    const ny = WATER_TOP + Math.random() * (WATER_BOT - WATER_TOP);
    spawnRipple(nx, ny, 0.7 + Math.random() * 0.5);
  }
  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].age++;
    if (ripples[i].age >= ripples[i].life) ripples.splice(i, 1);
  }
}

function drawRipples() {
  ctx.save();
  ctx.lineWidth = 1;
  for (const r of ripples) {
    const p = r.age / r.life;
    const radius = r.maxR * p;
    const alpha = r.alpha0 * (1 - p);
    const cx = r.nx * W;
    const cy = r.ny * H;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius, radius * WATER_PERSPECTIVE, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `${RIPPLE_COLOR} ${alpha})`;
    ctx.stroke();
    if (p > 0.3) {
      const innerR = radius * 0.55;
      ctx.beginPath();
      ctx.ellipse(cx, cy, innerR, innerR * WATER_PERSPECTIVE, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `${RIPPLE_COLOR} ${alpha * 0.5})`;
      ctx.stroke();
    }
  }
  ctx.restore();
}


// Fish: surfaces somewhere outside the terminal, jumps in an arc that
// starts and ends below the water line so it emerges and re-enters
// naturally rather than popping in and out.

const FISH_SUBMERGE_RATIO = 0.55;
const FISH_WIDTH = 32;
const FISH_FIRST_JUMP_DELAY_S = 4;
const FISH_NEXT_MIN_S = 25;
const FISH_NEXT_MAX_S = 50;
const FISH_LANE_SAFE_PX = 130;
const FISH_LANE_MARGIN_PX = 60;

// Surface-break thresholds: solve sin(p·π)·(1+k) - k = 0 for k = FISH_SUBMERGE_RATIO.
const FISH_BREAK_UP   = Math.asin(FISH_SUBMERGE_RATIO / (1 + FISH_SUBMERGE_RATIO)) / Math.PI;
const FISH_BREAK_DOWN = 1 - FISH_BREAK_UP;

const fishImg = new Image();
fishImg.src = '../assets/fish.png';

class Fish {
  constructor() {
    this.state = 'idle';
    this.cooldown = 60 * FISH_FIRST_JUMP_DELAY_S;
    this.t = 0;
    this.dur = 0;
    this.startX = 0;
    this.endX = 0;
    this.baseY = 0;
    this.peakH = 0;
    this.dir = 1;
    this.splashedUp = false;
    this.splashedDown = false;
  }

  // Find a horizontal strip not covered by the terminal.
  pickLane() {
    const term = document.querySelector('.terminal');
    if (term) {
      const r = term.getBoundingClientRect();
      const left  = { x0: FISH_LANE_MARGIN_PX,        x1: r.left - FISH_LANE_MARGIN_PX };
      const right = { x0: r.right + FISH_LANE_MARGIN_PX, x1: W - FISH_LANE_MARGIN_PX };
      const leftOk  = left.x1  - left.x0  > FISH_LANE_SAFE_PX;
      const rightOk = right.x1 - right.x0 > FISH_LANE_SAFE_PX;

      if (leftOk || rightOk) {
        const chosen = (leftOk && rightOk)
          ? (Math.random() < 0.5 ? left : right)
          : (leftOk ? left : right);
        return {
          x0: chosen.x0,
          x1: chosen.x1,
          ny: WATER_TOP + 0.04 + Math.random() * 0.10,
        };
      }

      // Narrow viewport: try below the terminal.
      const belowY = (r.bottom + FISH_LANE_MARGIN_PX) / H;
      if (belowY < WATER_BOT - 0.04) {
        return {
          x0: FISH_LANE_MARGIN_PX,
          x1: W - FISH_LANE_MARGIN_PX,
          ny: Math.min(belowY + Math.random() * 0.04, WATER_BOT - 0.02),
        };
      }
    }
    return {
      x0: FISH_LANE_MARGIN_PX,
      x1: W * 0.45,
      ny: WATER_TOP + 0.04 + Math.random() * 0.10,
    };
  }

  start() {
    const lane = this.pickLane();
    const laneW = lane.x1 - lane.x0;
    this.dir = Math.random() < 0.5 ? 1 : -1;
    const travel = (40 + Math.random() * Math.min(60, laneW * 0.4)) * this.dir;
    const minStart = lane.x0 + Math.max(0, -travel);
    const maxStart = lane.x1 - Math.max(0, travel);
    this.startX = minStart + Math.random() * Math.max(1, maxStart - minStart);
    this.endX = this.startX + travel;
    this.baseY = lane.ny;
    this.peakH = 22 + Math.random() * 28;
    this.dur = 55 + Math.random() * 25;
    this.t = 0;
    this.state = 'jumping';
    this.splashedUp = false;
    this.splashedDown = false;
  }

  currentX() {
    return this.startX + (this.endX - this.startX) * (this.t / this.dur);
  }

  splash(strengths) {
    const nx = this.currentX() / W;
    for (const s of strengths) spawnRipple(nx, this.baseY, s);
  }

  update() {
    if (this.state === 'idle') {
      this.cooldown--;
      if (this.cooldown <= 0 && fishImg.complete && fishImg.naturalWidth) {
        this.start();
      }
      return;
    }

    this.t++;
    const p = this.t / this.dur;

    if (!this.splashedUp && p >= FISH_BREAK_UP) {
      this.splash([1.4, 1.0]);
      this.splashedUp = true;
    }
    if (!this.splashedDown && p >= FISH_BREAK_DOWN) {
      this.splash([1.6, 1.1, 0.8]);
      this.splashedDown = true;
    }

    if (this.t >= this.dur) {
      this.state = 'idle';
      this.cooldown = 60 * (FISH_NEXT_MIN_S + Math.random() * (FISH_NEXT_MAX_S - FISH_NEXT_MIN_S));
    }
  }

  draw() {
    if (this.state !== 'jumping') return;
    if (!fishImg.complete || !fishImg.naturalWidth) return;

    const p = this.t / this.dur;
    const x = this.currentX();
    // Sine arc shifted below the surface on both ends.
    const submerge = this.peakH * FISH_SUBMERGE_RATIO;
    const arc = Math.sin(p * Math.PI) * (this.peakH + submerge) - submerge;
    const y = this.baseY * H - arc;
    const rot = Math.cos(p * Math.PI) * 0.9 * this.dir;

    const fw = FISH_WIDTH;
    const fh = fw * (fishImg.naturalHeight / fishImg.naturalWidth);
    const waterY = this.baseY * H;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, waterY);
    ctx.clip();
    ctx.globalAlpha = 0.88;
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(this.dir, 1);
    ctx.drawImage(fishImg, -fw / 2, -fh / 2, fw, fh);
    ctx.restore();
  }
}

const fish = new Fish();


/* --- lifecycle --------------------------------------------------------- */

function rebuild() {
  initSpawns();
  buildTrees();
  buildMoon();
}

let resizeTimer;
window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(rebuild, 120);
});

rebuild();


/* --- frame loop -------------------------------------------------------- */

let rafId = null;

function animate() {
  time += 0.5;
  ctx.clearRect(0, 0, W, H);

  const w = tickWind();
  const sway = Math.sin(time * 0.00025) * 0.82 + w * 0.38;

  drawSky();
  drawStars(time);
  drawMoon();
  drawTree(sway);
  drawBoat(time);
  drawReflections(time);
  updateRipples();
  drawRipples();
  fish.update();
  fish.draw();
  for (const p of petals) { p.update(w * 0.3); p.draw(); }

  rafId = requestAnimationFrame(animate);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  } else if (rafId === null) {
    animate();
  }
});

animate();


/* --- public hooks ------------------------------------------------------ */

window.burstPetals = burstPetals;
window.jumpFish = () => {
  if (fish.state === 'idle') { fish.start(); return true; }
  return false;
};
