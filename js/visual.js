/* ============================================================
   VISUAL — Holographic, Ripple, Menu (all devices), Aurora
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const { $, $$ } = D.utils;

  const isMobile = () => window.matchMedia('(max-width: 768px), (hover: none)').matches;
  const isIndexPage = () => {
    const p = location.pathname.split('/').pop();
    return p === '' || p === 'index.html';
  };

  // ============================================================
  // 1. BACKGROUNDS
  // ============================================================
  function initBackgrounds() {
    if (!document.querySelector('.aurora-bg')) {
      const aurora = document.createElement('div');
      aurora.className = 'aurora-bg';
      aurora.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(aurora, document.body.firstChild);
    }
    if (!document.querySelector('.mesh-bg')) {
      const mesh = document.createElement('div');
      mesh.className = 'mesh-bg';
      mesh.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(mesh, document.body.firstChild);
    }
  }

  // ============================================================
  // 2. HOLOGRAPHIC CARDS
  // ============================================================
  function initHolo() {
    const cards = $$('.holo-card');
    if (!cards.length) return;

    cards.forEach(card => {
      let raf = null;
      function update(x, y) {
        const r = card.getBoundingClientRect();
        const px = ((x - r.left) / r.width)  * 100;
        const py = ((y - r.top)  / r.height) * 100;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          card.style.setProperty('--holo-x', px + '%');
          card.style.setProperty('--holo-y', py + '%');
          card.style.setProperty('--holo-angle', (px * 3.6) + 'deg');
          raf = null;
        });
      }
      card.addEventListener('mousemove', e => update(e.clientX, e.clientY), { passive: true });
      card.addEventListener('touchmove', e => {
        const t = e.touches[0];
        if (t) update(t.clientX, t.clientY);
      }, { passive: true });
      card.addEventListener('touchstart', () => card.classList.add('holo-active'), { passive: true });
      card.addEventListener('touchend', () => setTimeout(() => card.classList.remove('holo-active'), 400));
    });
  }

  // ============================================================
  // 3. RIPPLE
  // ============================================================
  function initRipple() {
    document.addEventListener('pointerdown', e => {
      const host = e.target.closest('.btn, .magnetic, .card, .mobile-menu a, .neu-btn, .ach-btn, .sound-toggle, .theme-toggle, .admin-toggle, .lang-switch button, .science-user-btn');
      if (!host) return;
      if (!host.classList.contains('ripple-host')) host.classList.add('ripple-host');
      const rect = host.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top  - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      host.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  }

  // ============================================================
  // 4. MENU (همه‌ی دستگاه‌ها)
  // ============================================================
  function initMobileMenu() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const onIndex = isIndexPage();
    const prefix = onIndex ? '' : 'index.html';

    const links = [
      [onIndex ? '#home'     : prefix + '#home',     'nav_home'],
      [onIndex ? '#about'    : prefix + '#about',    'nav_about'],
      [onIndex ? '#projects' : prefix + '#projects', 'nav_projects'],
      ['games.html',   'nav_games',   'games'],
      ['science.html', 'nav_science', 'science'],
      [onIndex ? '#tools'    : prefix + '#tools',    'nav_tools'],
      [onIndex ? '#blog'     : prefix + '#blog',     'nav_blog'],
      [onIndex ? '#contact'  : prefix + '#contact',  'nav_contact']
    ];

    // ===== Burger =====
    let burger = $('#mobileBurger');
    if (!burger) {
      burger = document.createElement('button');
      burger.className = 'mobile-burger magnetic';
      burger.id = 'mobileBurger';
      burger.setAttribute('aria-label', 'Menu');
      burger.setAttribute('aria-expanded', 'false');
      burger.innerHTML = '<span></span><span></span><span></span>';
      const navRight = nav.querySelector('.nav-right');
      if (navRight) navRight.appendChild(burger);
    }

    // ===== Menu Overlay =====
    let menu = $('#mobileMenu');
    if (!menu) {
      menu = document.createElement('div');
      menu.className = 'mobile-menu';
      menu.id = 'mobileMenu';

      let html = '';
      links.forEach(([href, key, trans]) => {
        const transAttr = trans ? ` data-transition="${trans}"` : '';
        html += `<a href="${href}"${transAttr} data-i18n="${key}">${key}</a>`;
      });

      html += `<div class="mobile-lang">
        <button data-lang="en">EN</button>
        <button data-lang="fa">FA</button>
        <button data-lang="ar">AR</button>
        <button data-lang="de">DE</button>
      </div>`;

      menu.innerHTML = html;
      document.body.appendChild(menu);

      menu.querySelectorAll('.mobile-lang button').forEach(btn => {
        btn.addEventListener('click', () => {
          D.i18n.setLang(btn.dataset.lang);
          updateActiveLang();
        });
      });

      // اعمال ترجمه
      if (D.i18n && D.i18n.setLang) D.i18n.setLang(D.i18n.getLang());
    }

    function toggleMenu(force) {
      const open = force !== undefined ? force : !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';

      if (D.sounds && open) D.sounds.click();
    }

    burger.addEventListener('click', () => toggleMenu());

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => toggleMenu(false));
    });

    // کلیک بیرون
    menu.addEventListener('click', e => {
      if (e.target === menu) toggleMenu(false);
    });

    // ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) toggleMenu(false);
    });

    function updateActiveLang() {
      const cur = D.i18n.getLang();
      menu.querySelectorAll('.mobile-lang button').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === cur);
      });
    }
    updateActiveLang();

    document.addEventListener('diamond:langchange', updateActiveLang);
  }

  // ============================================================
  // 5. SCROLL REVEAL
  // ============================================================
  function initScrollReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    ['.scroll-reveal', '.scroll-scale', '.scroll-slide-left', '.scroll-slide-right']
      .forEach(cls => $$(cls).forEach(el => io.observe(el)));
  }

  // ============================================================
  // 6. PROGRESSIVE SCROLL
  // ============================================================
  function initProgressiveScroll() {
    if (isMobile()) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.style.setProperty('--scroll-progress', '1');
      });
    }, { threshold: 0.5 });
    $$('.card, .blog-card, .game-card').forEach(el => io.observe(el));
  }

  function init() {
    initBackgrounds();
    initHolo();
    initRipple();
    initMobileMenu();
    initScrollReveal();
    initProgressiveScroll();
    console.log('%c✨ Visual upgrades ready', 'color:#b026ff;font-weight:bold;');
  }

  D.visual = { init };
})();