/* ============================================================
   NAV — Preloader, Progress, Page Transition, Active Link
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const { $, $$ } = D.utils;

  function init() {
    // ===== Preloader =====
    const hide = () => document.body.classList.add('loaded');
    if (document.readyState === 'complete') setTimeout(hide, 300);
    else addEventListener('load', () => setTimeout(hide, 300));
    setTimeout(hide, 2500); // fallback قطعی

    // ===== Scroll Progress =====
    const progress = $('#scrollProgress');
    if (progress) {
      addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - innerHeight;
        progress.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
      }, { passive: true });
    }

    // ===== Page Transition (بین بخش‌ها) =====
    const pt = $('#pageTransition');
    if (pt) {
      $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          const href = a.getAttribute('href');
          if (!href || href === '#' || href.length < 2) return;
          const target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          pt.classList.add('active');
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            pt.classList.remove('active');
          }, 320);
        });
      });
    }

    // ===== Active nav link on scroll =====
    const sections = $$('section[id]');
    const navLinks = $$('.nav-links a');
    if (sections.length && navLinks.length) {
      addEventListener('scroll', () => {
        let cur = '';
        sections.forEach(s => {
          if (scrollY >= s.offsetTop - 220) cur = s.id;
        });
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
        });
      }, { passive: true });
    }
  }

  D.nav = { init };
})();