import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>(".canvas1")!;
const ctx = canvas.getContext("2d")!;

const particlesArray: Particle[] = [];
let hue = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = "white";
  ctx.fillRect(10, 10, 50, 50);
});

type Mouse = {
  x: number | undefined;
  y: number | undefined;
};

const mouse: Mouse = {
  x: undefined,
  y: undefined,
};

canvas.addEventListener("click", (event: MouseEvent) => {
  mouse.x = event.x;
  mouse.y = event.y;
  for (let i = 0; i < 10; i++) {
    particlesArray.push(new Particle());
  }
});

canvas.addEventListener("mousemove", (event: MouseEvent) => {
  mouse.x = event.x;
  mouse.y = event.y;
  for (let i = 0; i < 2; i++) {
    particlesArray.push(new Particle());
  }
});

class Particle {
  x: number | undefined;
  y: number | undefined;
  size: number;
  speedX: number;
  speedY: number;
  color: string;

  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 15 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = `hsl(${hue},100%,50%)`;
  }

  update() {
    if (!(this.x && this.y)) return;
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.1;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    if (this.x && this.y) {
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    }
    ctx.fill();
  }
}

function handleParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();

    for (let j = i; j < particlesArray.length; j++) {
      const dx = particlesArray[i].x! - particlesArray[j].x!;
      const dy = particlesArray[i].y! - particlesArray[j].y!;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);
      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = particlesArray[i].color;
        ctx.lineWidth = 0.2;
        ctx.moveTo(particlesArray[i].x!, particlesArray[i].y!);
        ctx.lineTo(particlesArray[j].x!, particlesArray[j].y!);
        ctx.stroke();
        ctx.closePath();
      }
    }
    if (particlesArray[i].size <= 0.3) {
      particlesArray.splice(i, 1);
      i--;
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = "rgba(0,0,0,0.1)";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  handleParticles();
  hue += 2;
  requestAnimationFrame(animate);
}

animate();
