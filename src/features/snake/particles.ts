/**
 * Particle Physics & Post-Processing Engine for Level 100 Snake Engine
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

export interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  life: number;
}

export class ParticleSystem {
  public particles: Particle[] = [];
  public shockwaves: Shockwave[] = [];
  public floatingTexts: FloatingText[] = [];

  // Spawn food explosion sparks
  emitFoodExplosion(x: number, y: number, color: string, count = 25) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 3 + Math.random() * 3,
        alpha: 1,
        life: 0,
        maxLife: 20 + Math.random() * 20,
      });
    }

    // Add shockwave
    this.shockwaves.push({
      x, y,
      radius: 4,
      maxRadius: 36,
      color,
      alpha: 0.9,
    });
  }

  // Emit tail plasma particle
  emitTailPlasma(x: number, y: number, color: string) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      color,
      size: 2 + Math.random() * 2,
      alpha: 0.7,
      life: 0,
      maxLife: 15,
    });
  }

  // Add floating text tag (+10, +50 GOLDEN!)
  addFloatingText(text: string, x: number, y: number, color = "#f59e0b") {
    this.floatingTexts.push({
      id: Math.random().toString(36).slice(2),
      text, x, y, color,
      alpha: 1,
      life: 0,
    });
  }

  // Update physics frame
  update() {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha = 1 - p.life / p.maxLife;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    // Update shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += 2.2;
      sw.alpha = 1 - sw.radius / sw.maxRadius;
      if (sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
      }
    }

    // Update floating text
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 1.2;
      ft.life++;
      ft.alpha = Math.max(0, 1 - ft.life / 40);
      if (ft.life >= 40) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  // Render on canvas context
  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    // Render shockwaves
    for (const sw of this.shockwaves) {
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = sw.alpha;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Render particles
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render floating text
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    for (const ft of this.floatingTexts) {
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = ft.alpha;
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();
  }

  clear() {
    this.particles = [];
    this.shockwaves = [];
    this.floatingTexts = [];
  }
}
