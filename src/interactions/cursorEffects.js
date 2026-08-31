/**
 * ASYS Technology - Custom Cursor Effects
 * Interactive cursor with trail, magnetic elements, and particle effects
 */

export class CursorEffects {
  constructor() {
    this.cursor = null;
    this.cursorDot = null;
    this.trail = [];
    this.trailLength = 8;
    this.mouseX = 0;
    this.mouseY = 0;
    this.posX = 0;
    this.posY = 0;
    this.isVisible = false;
    this.isActive = true;

    this.init();
  }

  init() {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.isActive = false;
      return;
    }

    // Only activate on non-touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      this.isActive = false;
      return;
    }

    this.createCursor();
    this.createTrail();
    this.bindEvents();
    this.animate();
  }

  createCursor() {
    // Main cursor ring
    this.cursor = document.createElement('div');
    this.cursor.className = 'asys-cursor';
    this.cursor.innerHTML = `
      <div class="cursor-ring"></div>
      <div class="cursor-dot"></div>
    `;
    document.body.appendChild(this.cursor);

    // Cursor dot
    this.cursorDot = document.createElement('div');
    this.cursorDot.className = 'asys-cursor-dot';
    document.body.appendChild(this.cursorDot);
  }

  createTrail() {
    for (let i = 0; i < this.trailLength; i++) {
      const particle = document.createElement('div');
      particle.className = 'cursor-trail-particle';
      particle.style.setProperty('--index', i);
      document.body.appendChild(particle);
      this.trail.push({
        element: particle,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0
      });
    }
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (!this.isVisible) {
        this.isVisible = true;
        this.cursor?.classList.add('is-visible');
        this.cursorDot?.classList.add('is-visible');
      }
    });

    document.addEventListener('mouseleave', () => {
      this.isVisible = false;
      this.cursor?.classList.remove('is-visible');
      this.cursorDot?.classList.remove('is-visible');
    });

    document.addEventListener('mouseenter', () => {
      this.isVisible = true;
      this.cursor?.classList.add('is-visible');
      this.cursorDot?.classList.add('is-visible');
    });

    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, .system-node, .automation-card, .service-teaser, .problem-item, .workflow-step, .tech-node, .project-card, .choice-chip, input, select, textarea'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor?.classList.add('is-hovering');
        this.cursorDot?.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', () => {
        this.cursor?.classList.remove('is-hovering');
        this.cursorDot?.classList.remove('is-hovering');
      });
    });

    // Click effect
    document.addEventListener('mousedown', () => {
      this.cursor?.classList.add('is-clicking');
      this.createClickBurst();
    });

    document.addEventListener('mouseup', () => {
      this.cursor?.classList.remove('is-clicking');
    });
  }

  createClickBurst() {
    const burst = document.createElement('div');
    burst.className = 'cursor-burst';
    burst.style.left = `${this.mouseX}px`;
    burst.style.top = `${this.mouseY}px`;
    document.body.appendChild(burst);

    setTimeout(() => burst.remove(), 600);
  }

  animate() {
    if (!this.isActive) return;

    // Smooth cursor following
    this.posX += (this.mouseX - this.posX) * 0.15;
    this.posY += (this.mouseY - this.posY) * 0.15;

    if (this.cursor) {
      this.cursor.style.transform = `translate(${this.posX}px, ${this.posY}px)`;
    }

    if (this.cursorDot) {
      this.cursorDot.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
    }

    // Trail animation
    this.trail.forEach((particle, index) => {
      const targetX = index === 0 ? this.mouseX : this.trail[index - 1].x;
      const targetY = index === 0 ? this.mouseY : this.trail[index - 1].y;

      particle.x += (targetX - particle.x) * 0.3;
      particle.y += (targetY - particle.y) * 0.3;

      particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) scale(${1 - index * 0.1})`;
      particle.element.style.opacity = 1 - (index / this.trailLength) * 0.8;
    });

    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.cursor?.remove();
    this.cursorDot?.remove();
    this.trail.forEach(p => p.element.remove());
  }
}

/**
 * Magnetic Elements - Elements that attract towards cursor
 */
export class MagneticElements {
  constructor() {
    this.elements = [];
    this.isActive = true;
    this.init();
  }

  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.isActive = false;
      return;
    }

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      this.isActive = false;
      return;
    }

    this.setupMagneticElements();
  }

  setupMagneticElements() {
    const magneticSelectors = [
      '.nav-cta',
      '.btn-primary',
      '.intelligence-submit',
      '.system-node-icon',
      '.teaser-icon',
      '.problem-icon'
    ];

    magneticSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('magnetic-element');
        this.elements.push(el);
        this.bindMagneticEvent(el);
      });
    });
  }

  bindMagneticEvent(element) {
    const strength = 0.3;

    element.addEventListener('mousemove', (e) => {
      if (!this.isActive) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      element.style.transform = `translate(${deltaX * strength}px, ${deltaY * strength}px)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
    });
  }
}

/**
 * Parallax Effects - Elements that move with cursor
 */
export class ParallaxEffects {
  constructor() {
    this.layers = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.isActive = true;

    this.init();
  }

  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.isActive = false;
      return;
    }

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      this.isActive = false;
      return;
    }

    this.setupParallaxLayers();
    this.bindEvents();
    this.animate();
  }

  setupParallaxLayers() {
    // Hero visual parallax
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      this.layers.push({
        element: heroVisual,
        depth: 0.02
      });
    }

    // System nodes parallax
    document.querySelectorAll('.system-node').forEach((node, index) => {
      this.layers.push({
        element: node,
        depth: 0.03 + index * 0.01
      });
    });

    // Tech cloud nodes
    document.querySelectorAll('.tech-node').forEach((node, index) => {
      this.layers.push({
        element: node,
        depth: 0.02 + index * 0.005
      });
    });

    // Particles
    document.querySelectorAll('.system-particles span').forEach((particle, index) => {
      this.layers.push({
        element: particle,
        depth: 0.05 + index * 0.01
      });
    });
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  animate() {
    if (!this.isActive) return;

    this.layers.forEach(layer => {
      const x = this.mouseX * layer.depth * 50;
      const y = this.mouseY * layer.depth * 50;

      layer.element.style.transform = layer.element.style.transform
        .replace(/translate\([^)]+\)/, '')
        .trim() + ` translate(${x}px, ${y}px)`;
    });

    requestAnimationFrame(() => this.animate());
  }
}

/**
 * Particle System - Floating particles that interact with cursor
 */
export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.container = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isActive = true;
    this.maxParticles = 30;

    this.init();
  }

  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.isActive = false;
      return;
    }

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      this.isActive = false;
      return;
    }

    this.createContainer();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'particle-system';
    document.body.appendChild(this.container);
  }

  createParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.setProperty('--delay', `${Math.random() * 5}s`);
      particle.style.setProperty('--duration', `${15 + Math.random() * 20}s`);
      this.container.appendChild(particle);

      this.particles.push({
        element: particle,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 2 + Math.random() * 4,
        baseX: Math.random() * window.innerWidth,
        baseY: Math.random() * window.innerHeight
      });
    }
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    window.addEventListener('resize', () => {
      this.particles.forEach(p => {
        p.baseX = Math.random() * window.innerWidth;
        p.baseY = Math.random() * window.innerHeight;
      });
    });
  }

  animate() {
    if (!this.isActive) return;

    this.particles.forEach(particle => {
      // Cursor repulsion
      const dx = particle.x - this.mouseX;
      const dy = particle.y - this.mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const force = (150 - distance) / 150;
        particle.vx += (dx / distance) * force * 0.5;
        particle.vy += (dy / distance) * force * 0.5;
      }

      // Return to base position
      particle.vx += (particle.baseX - particle.x) * 0.001;
      particle.vy += (particle.baseY - particle.y) * 0.001;

      // Apply velocity with damping
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Update element
      particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
      particle.element.style.width = `${particle.size}px`;
      particle.element.style.height = `${particle.size}px`;
    });

    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.container?.remove();
  }
}

/**
 * Text Scramble Effect - For headings
 */
export class TextScramble {
  constructor(element) {
    this.element = element;
    this.originalText = element.textContent;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.frame = 0;
    this.frameRate = 3;
    this.queue = [];
    this.resolve = null;
  }

  setText(newText) {
    const oldText = this.element.textContent;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);

    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();

    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.element.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }
}

/**
 * Initialize all cursor effects
 */
export function initCursorEffects() {
  const cursor = new CursorEffects();
  const magnetic = new MagneticElements();
  const parallax = new ParallaxEffects();
  const particles = new ParticleSystem();

  return { cursor, magnetic, parallax, particles };
}