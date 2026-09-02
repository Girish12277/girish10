/**
 * Particle Physics Engine for Level 100 Tic-Tac-Toe
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export class TTTParticleSystem {
  public particles: Particle[] = [];

  // Emit cell placement spark explosion
  emitSparks(x: number, y: number, color: string, count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3.5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2.5 + Math.random() * 2.5,
        alpha: 1,
        life: 0,
        maxLife: 15 + Math.random() * 15,
      });
    }
  }

  // Emit victory confetti fireworks
  emitConfetti(w: number, h: number) {
    const colors = ["#06b6d4", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"];
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * (h / 2),
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 4,
        alpha: 1,
        life: 0,
        maxLife: 40 + Math.random() * 30,
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  clear() {
    this.particles = [];
  }
}
