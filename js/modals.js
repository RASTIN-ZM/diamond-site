/* ============================================================
   MODALS — باز/بسته کردن مودال‌ها
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const { $, $$ } = D.utils;

  function open(sel) {
    const m = $(sel);
    if (!m) return;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close(sel) {
    const m = $(sel);
    if (!m) return;
    m.classList.remove('open');
    if (!$('.modal.open')) document.body.style.overflow = '';
  }

  function init() {
    $$('.modal').forEach(m => {
      $$('[data-close]', m).forEach(el => {
        el.addEventListener('click', () => close('#' + m.id));
      });
    });
    addEventListener('keydown', e => {
      if (e.key === 'Escape') $$('.modal.open').forEach(m => close('#' + m.id));
    });
  }

  D.modals = { init, open, close };
})();