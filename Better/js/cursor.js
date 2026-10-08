/* ============================================================
   CURSOR — بهینه‌شده با محدودیت FPS
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const { $, sparkleBurst } = D.utils;

  let trailRafId = null;
  let trailRunning = false;
  let lastTrailFrame = 0;

  function init() {
    // روی موبایل / تاچ اصلاً اجرا نکن
    if (window.matchMedia('(max-width: 768px), (hover: none)').matches) {
      return;
    }

    const dot  = $('.cursor-dot');
    const ring = $('.cursor-ring');
    const tc   = $('#cursorTrail');
    if (!dot || !ring) return;

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;

    // ===== Trail canvas =====
    let ctx = null;
    const trail = [];
    const MAX = 10;  // قبلاً 18 بود

    if (tc) {
      ctx = tc.getContext('2d', { alpha: true });
      const resize = () => { tc.width = innerWidth; tc.height = innerHeight; };
      resize();
      window.addEventListener('resize', debounce(resize, 200), { passive: true });
    }

    // ===== Mousemove =====
    window.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      if (ctx) {
        trail.push({ x: mx, y: my });
        if (trail.length > MAX) trail.shift();
      }
    }, { passive: true });

    // ===== حلقه‌ی حرکت نرم ring =====
    (function ringLoop() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(ringLoop);
    })();

    // ===== حلقه‌ی trail — فقط وقتی موس حرکت می‌کنه =====
    if (ctx) {
      function trailLoop(now) {
        trailRafId = requestAnimationFrame(trailLoop);
        // محدودیت ۳۰ فریم
        if (now - lastTrailFrame < 1000 / 30) return;
        lastTrailFrame = now;

        ctx.clearRect(0, 0, tc.width, tc.height);
        if (!trail.length) return;

        for (let i = 0; i < trail.length; i++) {
          const p = trail[i];
          const size = (i / trail.length) * 4 + 1;
          const hue  = 20 + (i / trail.length) * 60;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 90%, 65%, ${i / trail.length * 0.25})`;
          ctx.fill();
        }
      }
      trailRafId = requestAnimationFrame(trailLoop);

      // وقتی tab مخفی شد، متوقف کن
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (trailRafId) cancelAnimationFrame(trailRafId);
        } else {
          trailRafId = requestAnimationFrame(trailLoop);
        }
      });
    }

    // ===== حالت‌های کلیک =====
    window.addEventListener('mousedown', () => ring.classList.add('click'));
    window.addEventListener('mouseup',   () => ring.classList.remove('click'));

    // ===== حالت hover =====
    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button, input, textarea, .card, .blog-card, .game-card, .modal-box'))
        ring.classList.add('hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest('a, button, input, textarea, .card, .blog-card, .game-card, .modal-box'))
        ring.classList.remove('hover');
    });

    // ===== جرقه روی کلیک — فقط دسکتاپ =====
    document.addEventListener('click', e => {
      if (e.target.closest('button, .btn, a, .card, .blog-card, .game-card'))
        sparkleBurst(e);
    });
  }

  function debounce(fn, ms) {
    let t;
    return function() {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, arguments), ms);
    };
  }

  D.cursor = { init };
})();