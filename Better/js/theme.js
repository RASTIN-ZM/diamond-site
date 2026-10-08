/* ============================================================
   THEME — تم روشن/تاریک
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const { $ } = D.utils;

  function init() {
    const saved = D.storage.getTheme();
    if (saved === 'light') document.documentElement.classList.add('light');

    const btn = $('#themeToggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
      document.documentElement.classList.toggle('light');
      const isLight = document.documentElement.classList.contains('light');
      D.storage.setTheme(isLight ? 'light' : 'dark');
    });
  }

  D.theme = { init };
})();