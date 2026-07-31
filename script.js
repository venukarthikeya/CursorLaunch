const canvas = document.getElementById("canvas") || document.createElement("canvas");
if (!document.body.contains(canvas)) {
    document.body.appendChild(canvas);
}
const ctx = canvas.getContext("2d", { alpha: false }); // Optimization for background

let width = window.innerWidth || 800;
let height = window.innerHeight || 600;

function initCanvas() {
    width = window.innerWidth || document.documentElement.clientWidth || 800;
    height = window.innerHeight || document.documentElement.clientHeight || 600;
    canvas.width = width;
    canvas.height = height;
}
initCanvas();

const mouse = {
    x: width / 2,
    y: height / 2
};

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener("touchmove", (event) => {
    if (event.touches.length > 0) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
    }
}, { passive: true });

// Click effect: Circular energy pulse
let clickPulses = [];
window.addEventListener("mousedown", (event) => {
    clickPulses.push({ x: event.clientX, y: event.clientY, radius: 0, alpha: 1.0 });
});
window.addEventListener("touchstart", (event) => {
    if (event.touches.length > 0) {
        clickPulses.push({ x: event.touches[0].clientX, y: event.touches[0].clientY, radius: 0, alpha: 1.0 });
    }
}, { passive: true });

function dist(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

function angleBetween(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

// Background space and stars system
let stars = [];
function initStars() {
    stars = [];
    const numStars = (width * height) / 4000;
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.5,
            twinkleSpeed: Math.random() * 0.05 + 0.01,
            phase: Math.random() * Math.PI * 2
        });
    }
}
initStars();

window.addEventListener("resize", () => {
    initCanvas();
    initStars();
});

let frame = 0;
function drawSpaceBackground() {
    // Dark space gradient
    let spaceGradient = ctx.createLinearGradient(0, 0, 0, height);
    spaceGradient.addColorStop(0, "#01010a");
    spaceGradient.addColorStop(0.5, "#0b041c");
    spaceGradient.addColorStop(1, "#180636");
    ctx.fillStyle = spaceGradient;
    ctx.fillRect(0, 0, width, height);

    // Stars twinkling
    ctx.fillStyle = "#ffffff";
    stars.forEach(star => {
        let opacity = 0.3 + Math.sin(frame * star.twinkleSpeed + star.phase) * 0.7;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1.0;
}

// Particle arrays
let particles = [];
let trail = [];

class Rocket {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.speed = 0;
        this.maxSpeed = 12.0;

        // Proportions 
        this.length = 65;
        this.width = 24;
    }

    update(targetX, targetY) {
        let distanceToTarget = dist(this.x, this.y, targetX, targetY);
        let targetAngle = angleBetween(this.x, this.y, targetX, targetY);

        if (distanceToTarget > 5) {
            // Smooth rotation calculation
            let angleDifference = targetAngle - this.angle;
            angleDifference = Math.atan2(Math.sin(angleDifference), Math.cos(angleDifference));
            this.angle += angleDifference * 0.15;

            // Speed easing towards max based on distance
            this.speed = Math.min(this.maxSpeed, distanceToTarget * 0.1);
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
        } else {
            this.speed *= 0.8;
        }

        let isMoving = this.speed > 0.5;

        // Rocket trail emitting
        if (isMoving && frame % 2 === 0) {
            let emitX = this.x - Math.cos(this.angle) * (this.length * 0.4);
            let emitY = this.y - Math.sin(this.angle) * (this.length * 0.4);
            trail.push({ x: emitX, y: emitY, alpha: 1.0 });
        }

        // Engine smoke particles emitting
        if (isMoving) {
            let nozzleX = this.x - Math.cos(this.angle) * (this.length * 0.5);
            let nozzleY = this.y - Math.sin(this.angle) * (this.length * 0.5);
            
            let spread = (Math.random() - 0.5) * 6;
            particles.push({
                x: nozzleX + Math.cos(this.angle + Math.PI/2) * spread,
                y: nozzleY + Math.sin(this.angle + Math.PI/2) * spread,
                vx: -Math.cos(this.angle) * (Math.random() * 1.5 + 0.5) + (Math.random() - 0.5) * 0.5,
                vy: -Math.sin(this.angle) * (Math.random() * 1.5 + 0.5) + (Math.random() - 0.5) * 0.5,
                size: Math.random() * 4 + 3,
                life: 1.0,
                decay: Math.random() * 0.015 + 0.015
            });
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0,0,0,0.5)";

        // Engine Flames (length depends on speed)
        if (this.speed > 0.5) {
            let flameLength = 15 + this.speed * 2.5 + Math.random() * 8;
            ctx.beginPath();
            ctx.moveTo(-this.length / 2 + 2, -5);
            ctx.lineTo(-this.length / 2 - flameLength, 0);
            ctx.lineTo(-this.length / 2 + 2, 5);
            
            let flameGradient = ctx.createLinearGradient(-this.length / 2, 0, -this.length / 2 - flameLength, 0);
            flameGradient.addColorStop(0, "#ffffff");
            flameGradient.addColorStop(0.2, "#ffff00");
            flameGradient.addColorStop(0.6, "#ff6600");
            flameGradient.addColorStop(1, "rgba(255, 0, 0, 0)");
            
            ctx.fillStyle = flameGradient;
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#ff6600";
            ctx.fill();
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(0,0,0,0.5)";
        }

        // Left Fin
        ctx.fillStyle = "#e53935"; // Red
        ctx.beginPath();
        ctx.moveTo(-this.length / 2 + 18, -this.width / 2 + 4);
        ctx.lineTo(-this.length / 2 - 4, -this.width / 2 - 12);
        ctx.lineTo(-this.length / 2, -this.width / 2 + 4);
        ctx.fill();

        // Right Fin
        ctx.beginPath();
        ctx.moveTo(-this.length / 2 + 18, this.width / 2 - 4);
        ctx.lineTo(-this.length / 2 - 4, this.width / 2 + 12);
        ctx.lineTo(-this.length / 2, this.width / 2 - 4);
        ctx.fill();
        
        // Engine Nozzle
        ctx.fillStyle = "#333333";
        ctx.beginPath();
        ctx.rect(-this.length / 2 - 4, -7, 8, 14);
        ctx.fill();

        // Main Body (gradient shading)
        let bodyGradient = ctx.createLinearGradient(0, -this.width / 2, 0, this.width / 2);
        bodyGradient.addColorStop(0, "#ffffff");
        bodyGradient.addColorStop(1, "#b0bec5");
        
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.moveTo(this.length / 2, 0); // Nose cone tip
        ctx.quadraticCurveTo(this.length / 4, -this.width / 2, -this.length / 2, -this.width / 2);
        ctx.lineTo(-this.length / 2, this.width / 2);
        ctx.quadraticCurveTo(this.length / 4, this.width / 2, this.length / 2, 0);
        ctx.fill();
        
        // Nose Cone detail (Red)
        ctx.fillStyle = "#e53935";
        ctx.beginPath();
        ctx.moveTo(this.length / 2, 0);
        ctx.quadraticCurveTo(this.length * 0.35, -this.width / 2 * 0.7, this.length * 0.25, -this.width / 2 * 0.85);
        ctx.lineTo(this.length * 0.25, this.width / 2 * 0.85);
        ctx.quadraticCurveTo(this.length * 0.35, this.width / 2 * 0.7, this.length / 2, 0);
        ctx.fill();

        // Circular Window
        ctx.fillStyle = "#81d4fa";
        ctx.strokeStyle = "#546e7a";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(this.length * 0.15, 0, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}

const rocket = new Rocket(width / 2, height / 2);

function updateAndDrawParticles() {
    // 1. Rocket Glowing Trail
    if (trail.length > 1) {
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#00e5ff";
        
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
            let controlPointX = (trail[i].x + trail[i - 1].x) / 2;
            let controlPointY = (trail[i].y + trail[i - 1].y) / 2;
            ctx.quadraticCurveTo(trail[i - 1].x, trail[i - 1].y, controlPointX, controlPointY);
        }
        ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
        
        // Fade line transparency
        let trailGradient = ctx.createLinearGradient(trail[0].x, trail[0].y, trail[trail.length-1].x, trail[trail.length-1].y);
        trailGradient.addColorStop(0, `rgba(0, 229, 255, 0)`);
        trailGradient.addColorStop(1, `rgba(0, 229, 255, 0.8)`);
        
        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
    }

    // Process fading of trail
    for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].alpha -= 0.015;
        if (trail[i].alpha <= 0) {
            trail.splice(i, 1);
        }
    }

    // 2. Smoke Particles
    ctx.globalCompositeOperation = "lighter";
    for (let i = particles.length - 1; i >= 0; i--) {
        let particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.size += 0.15; // Expansion
        particle.life -= particle.decay; // Fading
        
        if (particle.life <= 0) {
            particles.splice(i, 1);
        } else {
            ctx.fillStyle = `rgba(100, 100, 120, ${particle.life * 0.4})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.globalCompositeOperation = "source-over"; // Reset blend mode

    // 3. Click Energy Pulses
    for (let i = clickPulses.length - 1; i >= 0; i--) {
        let clickPulse = clickPulses[i];
        clickPulse.radius += 3;
        clickPulse.alpha -= 0.04;
        
        if (clickPulse.alpha <= 0) {
            clickPulses.splice(i, 1);
        } else {
            ctx.save();
            ctx.strokeStyle = `rgba(0, 229, 255, ${clickPulse.alpha})`; // Cyan ring
            ctx.lineWidth = 2 + (clickPulse.alpha * 3);
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#00e5ff";
            ctx.beginPath();
            ctx.arc(clickPulse.x, clickPulse.y, clickPulse.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }
}

function loop() {
    frame++;
    
    drawSpaceBackground();
    
    updateAndDrawParticles();
    
    rocket.update(mouse.x, mouse.y);
    rocket.draw();

    requestAnimationFrame(loop);
}

// Initial positioning
mouse.x = width / 2;
mouse.y = height / 2;
loop();
