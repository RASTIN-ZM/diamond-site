/* ============================================================
   LOGO — لود لوگو با چند مسیر جایگزین + SVG fallback
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const { $$ } = D.utils;

  const DIAMOND_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="DIAMOND">
  <defs>
    <linearGradient id="dg1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff4d4d"/>
      <stop offset="45%" stop-color="#ff8c42"/>
      <stop offset="75%" stop-color="#ffc93c"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <path d="M50 5 L92 38 L76 92 L24 92 L8 38 Z" fill="url(#dg1)"/>
  <path d="M50 5 L92 38 L50 38 Z" fill="rgba(255,255,255,0.20)"/>
  <path d="M50 5 L8 38 L50 38 Z" fill="rgba(0,0,0,0.18)"/>
  <path d="M8 38 L50 92 L50 38 Z" fill="rgba(0,0,0,0.10)"/>
  <path d="M92 38 L50 92 L50 38 Z" fill="rgba(255,255,255,0.12)"/>
  <path d="M50 5 L92 38 M92 38 L76 92 M76 92 L24 92 M24 92 L8 38 M8 38 L50 5 M8 38 L92 38"
        stroke="rgba(255,255,255,0.25)" stroke-width="0.6" fill="none"/>
</svg>`;

  function attach(img, fallbacks) {
    if (!img || !fallbacks || !fallbacks.length) return;
    let i = 0;
    img.onerror = () => {
      i++;
      if (i < fallbacks.length) {
        img.src = fallbacks[i];
      } else {
        const p = img.parentElement;
        if (p) {
          p.innerHTML = DIAMOND_SVG;
          p.classList.add('logo-svg-fallback');
        }
        console.info('[DIAMOND] هیچ فایل لوگویی پیدا نشد، SVG جایگزین شد');
      }
    };
    img.src = fallbacks[0];
  }

  function init() {
    $$('img[data-logo]').forEach(img => attach(img, D.config.LOGO_FALLBACKS));
    $$('img[data-logo-gaming]').forEach(img => attach(img, D.config.GAMING_LOGO_FALLBACKS));
    $$('img[data-logo-science]').forEach(img => attach(img, D.config.SCIENCE_LOGO_FALLBACKS));
  }

  D.logo = { init };
})();