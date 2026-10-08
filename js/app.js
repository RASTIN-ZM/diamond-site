/* ============================================================
   APP — نقطه‌ی شروع (همه‌ی ماژول‌های index.html)
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;

  function init() {
    const order = [
      ['logo',        'logo'],
      ['theme',       'theme'],
      ['i18n',        'i18n'],
      ['modals',      'modals'],
      ['cursor',      'cursor'],
      ['particles',   'particles'],
      ['effects',     'effects'],
      ['nav',         'nav'],
      ['blog',        'blog'],
      ['auth',        'auth'],
      ['admin',       'admin'],
      ['transition',  'transition'],
      ['sounds',      'sounds'],
      ['clock',       'clock'],
      ['achievements','achievements'],
      ['easterEggs',  'easter-eggs'],
      ['tools',       'tools'],
      ['parallax',    'parallax'],
      ['visual',      'visual']
    ];

    order.forEach(([key, name]) => {
      if (D[key] && typeof D[key].init === 'function') {
        D.utils.safe(() => D[key].init(), name);
      } else {
        console.warn(`[DIAMOND] ماژول ${name} پیدا نشد یا init نداره`);
      }
    });

    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    console.log('%c✅ DIAMOND ready', 'color:#4ade80;font-weight:bold;font-size:14px');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();