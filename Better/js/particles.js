/* ============================================================
   PARTICLES — ذرات هوشمند واکنش‌دهنده به موس
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const { $ } = D.utils;

  let rafId = null;
  let running = false;
  let particles = [];
  let ctx, pc, lastFrame = 0;
  const FPS_CAP = 30;
  let mouseX = -9999, mouseY = -9999;
  let mouseActive = false;

  function init() {
    pc = $('#particles');
    if (!pc) return;

    if (window.matchMedia('(max-width: 768px), (hover: none)').matches) {
      pc.style.display = 'none';
      return;
    }

    ctx = pc.getContext('2d', { alpha: true });
    resize();
    spawn();

    // موس
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouseActive = false;
      mouseX = -9999;
      mouseY = -9999;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) start();
        else stop();
      });
    });
    io.observe(pc);

    window.addEventListener('resize', debounce(() => {
      resize(); spawn();
    }, 200), { passive: true });

    start();
  }

  function resize() {
    if (!pc) return;
    pc.width  = innerWidth;
    pc.height = innerHeight;
  }

  function spawn() {
    const count = Math.min(35, Math.floor(innerWidth * innerHeight / 40000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * pc.width,
      y: Math.random() * pc.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.6,
      a: Math.random() * 0.35 + 0.15,
      hue: 20 + Math.random() * 60
    }));
  }

  function start() {
    if (running) return;
    running = true;
    lastFrame = performance.now();
    loop(lastFrame);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    if (ctx && pc) ctx.clearRect(0, 0, pc.width, pc.height);
  }

  function loop(now) {
    if (!running) return;
    rafId = requestAnimationFrame(loop);
    const delta = now - lastFrame;
    if (delta < 1000 / FPS_CAP) return;
    lastFrame = now;

    ctx.clearRect(0, 0, pc.width, pc.height);
    const isLight = document.documentElement.classList.contains('light');
    const REPEL_RADIUS = 150;

    for (const p of particles) {
      // واکنش به موس
      if (mouseActive) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distSq = dx * dx + dy * dy;
        if (distSq < REPEL_RADIUS * REPEL_RADIUS && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 0.4;
          p.vy += Math.sin(angle) * force * 0.4;
        }
      }

      // اصطکاک
      p.vx *= 0.98;
      p.vy *= 0.98;

      // سرعت پایه
      if (Math.abs(p.vx) < 0.05) p.vx += (Math.random() - 0.5) * 0.05;
      if (Math.abs(p.vy) < 0.05) p.vy += (Math.random() - 0.5) * 0.05;

      // محدودیت سرعت
      const maxSpeed = 2;
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = pc.width;
      if (p.x > pc.width) p.x = 0;
      if (p.y < 0) p.y = pc.height;
      if (p.y > pc.height) p.y = 0;

      // اندازه و درخشش
      const nearMouse = mouseActive && Math.hypot(p.x - mouseX, p.y - mouseY) < REPEL_RADIUS;
      const baseR = p.r;
      const drawR = nearMouse ? baseR * 1.6 : baseR;
      const drawA = nearMouse ? Math.min(1, p.a * 2) : p.a;

      // خط اتصال بین ذرات نزدیک به هم
      ctx.beginPath();
      ctx.arc(p.x, p.y, drawR, 0, Math.PI * 2);
      ctx.fillStyle = isLight
        ? `hsla(${p.hue}, 80%, 45%, ${drawA})`
        : `hsla(${p.hue}, 90%, 65%, ${drawA})`;
      ctx.fill();
    }

    // خطوط بین ذرات نزدیک
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = isLight
            ? `hsla(30, 80%, 45%, ${0.08 * (1 - d / 100)})`
            : `hsla(30, 90%, 65%, ${0.12 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function debounce(fn, ms) {
    let t;
    return function() {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, arguments), ms);
    };
  }

  D.particles = { init };
})();