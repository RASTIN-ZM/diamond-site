/* ============================================================
   TRANSITION — ترنزیشن سینمایی بین صفحات (چند تمی)
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const KEY = 'diamond-enter-transition';

  function createOverlay(type) {
    let overlay = document.querySelector('.pt-overlay');
    if (overlay) {
      // اگه وجود داره، کلاس‌های تم قبلی رو پاک کن
      overlay.classList.remove('pt-games', 'pt-science', 'pt-home');
      if (type) overlay.classList.add('pt-' + type);
      return overlay;
    }

    overlay = document.createElement('div');
    overlay.className = 'pt-overlay';
    if (type) overlay.classList.add('pt-' + type);
    overlay.innerHTML = `
      <div class="pt-bg"></div>
      <div class="pt-grid"></div>
      <div class="pt-ring pt-ring-1"></div>
      <div class="pt-ring pt-ring-2"></div>
      <div class="pt-ring pt-ring-3"></div>
      <div class="pt-scanline"></div>
      <div class="pt-flash"></div>
      <div class="pt-logo">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ptg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ff2d95"/>
              <stop offset="50%" stop-color="#b026ff"/>
              <stop offset="100%" stop-color="#00f0ff"/>
            </linearGradient>
          </defs>
          <path d="M50 5 L92 38 L76 92 L24 92 L8 38 Z" fill="url(#ptg)"/>
        </svg>
      </div>
      <div class="pt-text">DIAMOND</div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  // ===== خروج =====
  function exitPage(url, type) {
    if (!url) return;
    const overlay = createOverlay(type);
    overlay.offsetHeight;
    overlay.classList.add('active', 'leaving');
    document.documentElement.classList.add('is-leaving');

    try { sessionStorage.setItem(KEY, type || 'default'); } catch(_) {}

    setTimeout(() => {
      window.location.href = url;
    }, 1100);
  }

  // ===== ورود =====
  function enterPage() {
    let stored = null;
    try { stored = sessionStorage.getItem(KEY); } catch(_) {}
    if (!stored) return;
    try { sessionStorage.removeItem(KEY); } catch(_) {}

    const type = stored === 'default' ? null : stored;
    const overlay = createOverlay(type);
    overlay.classList.add('active', 'entering');
    overlay.offsetHeight;

    requestAnimationFrame(() => {
      overlay.classList.remove('active');
      overlay.classList.add('entering-out');
      setTimeout(() => {
        overlay.classList.remove('active', 'entering', 'entering-out', 'leaving');
      }, 1200);
    });
  }

  // ===== Bind =====
  function bindLinks() {
    document.querySelectorAll('[data-transition]').forEach(el => {
      el.addEventListener('click', e => {
        const href = el.getAttribute('href');
        if (!href) return;
        e.preventDefault();
        exitPage(href, el.dataset.transition);
      });
    });
  }

  function init() {
    bindLinks();
    enterPage();
  }

  D.transition = { init, exitPage, enterPage };
})();