/* ============================================================
   PARALLAX — پارالاکس چندلایه با شکل‌های هندسی
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;

  function init() {
    if (window.matchMedia('(max-width: 768px), (hover: none)').matches) return;

    const layer = document.createElement('div');
    layer.className = 'parallax-layer';
    layer.setAttribute('aria-hidden', 'true');

    const shapes = [
      { type: 'circle', size: 180, top: '15%', left: '8%',   speed: 0.08, color: 'rgba(255,77,77,0.08)' },
      { type: 'hex',    size: 220, top: '55%', right: '5%',  speed: 0.14, color: 'rgba(34,211,238,0.08)' },
      { type: 'circle', size: 120, top: '75%', left: '15%',  speed: 0.18, color: 'rgba(255,201,60,0.08)' },
      { type: 'tri',    size: 160, top: '30%', right: '20%', speed: 0.06, color: 'rgba(176,38,255,0.08)' },
      { type: 'circle', size: 90,  top: '85%', right: '35%', speed: 0.22, color: 'rgba(74,222,128,0.08)' },
      { type: 'hex',    size: 100, top: '10%', left: '45%',  speed: 0.10, color: 'rgba(59,130,246,0.08)' }
    ];

    shapes.forEach((s, i) => {
      const el = document.createElement('div');
      el.className = 'p-shape p-shape-' + s.type;
      el.dataset.speed = s.speed;
      el.style.width = s.size + 'px';
      el.style.height = s.size + 'px';
      el.style.top = s.top;
      if (s.left)  el.style.left  = s.left;
      if (s.right) el.style.right = s.right;
      el.style.background = s.color;
      el.style.animationDelay = (i * 0.7) + 's';
      layer.appendChild(el);
    });

    document.body.appendChild(layer);

    // Scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        layer.querySelectorAll('.p-shape').forEach(el => {
          const speed = parseFloat(el.dataset.speed);
          el.style.transform = `translate3d(0, ${-y * speed}px, 0) rotate(${y * speed * 0.3}deg)`;
        });
        ticking = false;
      });
    }, { passive: true });

    // Mouse parallax (subtle)
    window.addEventListener('mousemove', e => {
      const mx = (e.clientX / innerWidth  - 0.5) * 20;
      const my = (e.clientY / innerHeight - 0.5) * 20;
      layer.style.setProperty('--mx', mx + 'px');
      layer.style.setProperty('--my', my + 'px');
    }, { passive: true });
  }

  D.parallax = { init };
})();