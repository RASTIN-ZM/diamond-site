/* ============================================================
   ACHIEVEMENTS — سیستم دستاوردها
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const KEY = 'diamond_achievements';

  const LIST = {
    firstVisit:   { icon: '👋', title: 'Welcome',         desc: 'اولین بازدید از سایت' },
    explorer:     { icon: '🧭', title: 'Explorer',         desc: 'بازدید از ۳ بخش مختلف' },
    reader:       { icon: '📖', title: 'Reader',           desc: 'خوندن ۵ پست' },
    gamer:        { icon: '🎮', title: 'Gamer',            desc: 'دیدن ۱۰ بازی' },
    scientist:    { icon: '🧪', title: 'Scientist',        desc: 'ورود به بخش علم' },
    konami:       { icon: '🎯', title: 'Konami Master',    desc: 'زدن کد Konami' },
    secret:       { icon: '🔮', title: 'Secret Finder',    desc: 'کلیک ۵ بار روی لوگو' },
    confetti:     { icon: '🎉', title: 'Party Time',       desc: 'گفتن کلمه‌ی diamond' },
    party:        { icon: '🥳', title: 'Super Party',      desc: 'گفتن کلمه‌ی party' },
    matrix:       { icon: '🟢', title: 'The One',          desc: 'گفتن کلمه‌ی matrix' },
    polyglot:     { icon: '🌍', title: 'Polyglot',         desc: 'تغییر زبان ۳ بار' },
    nightOwl:     { icon: '🦉', title: 'Night Owl',        desc: 'بازدید بعد از نیمه‌شب' },
    clicker:      { icon: '👆', title: 'Clicker',          desc: '۱۰۰ کلیک' },
    speedrun:     { icon: '⚡', title: 'Speedrunner',      desc: 'بازدید از ۵ بخش در ۳۰ ثانیه' },
    hunter:       { icon: '🏆', title: 'Achievement Hunter', desc: 'بدست آوردن ۷ دستاورد' }
  };

  let unlocked = {};
  let sectionsVisited = new Set();
  let postsRead = new Set();
  let gamesViewed = new Set();
  let langChanges = 0;
  let clickCount = 0;
  let sessionStart = Date.now();
  let recentSections = [];

  function load() {
    try { unlocked = JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch (_) { unlocked = {}; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(unlocked)); } catch(_) {}
  }

  function unlock(id) {
    if (unlocked[id]) return;
    if (!LIST[id]) return;
    unlocked[id] = Date.now();
    save();
    showToast(id);
    D.sounds && D.sounds.achievement && D.sounds.achievement();

    // بررسی hunter
    if (!unlocked.hunter && Object.keys(unlocked).length >= 7) {
      setTimeout(() => unlock('hunter'), 500);
    }
  }

  function showToast(id) {
    const a = LIST[id];
    if (!a) return;

    const el = document.createElement('div');
    el.className = 'achievement-toast';
    el.innerHTML = `
      <div class="ach-icon">${a.icon}</div>
      <div class="ach-text">
        <div class="ach-label">Achievement Unlocked!</div>
        <div class="ach-title">${a.title}</div>
        <div class="ach-desc">${a.desc}</div>
      </div>
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 500);
    }, 4000);
  }

  function check() {
    // First visit
    unlock('firstVisit');

    // Night owl
    const h = new Date().getHours();
    if (h >= 0 && h < 5) unlock('nightOwl');

    // Explorer (3 sections)
    if (sectionsVisited.size >= 3) unlock('explorer');

    // Reader (5 posts)
    if (postsRead.size >= 5) unlock('reader');

    // Gamer (10 games)
    if (gamesViewed.size >= 10) unlock('gamer');

    // Speedrun (5 sections in 30s)
    const recent = recentSections.filter(t => Date.now() - t < 30000);
    recentSections = recent;
    if (recent.length >= 5) unlock('speedrun');

    // Polyglot
    if (langChanges >= 3) unlock('polyglot');

    // Clicker
    if (clickCount >= 100) unlock('clicker');
  }

  function init() {
    load();
    check();

    // رصد بخش‌ها
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          if (id && !sectionsVisited.has(id)) {
            sectionsVisited.add(id);
            recentSections.push(Date.now());
            if (id === 'science-cta') unlock('scientist');
            check();
          }
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('section[id]').forEach(s => io.observe(s));

    // تغییر زبان
    document.addEventListener('diamond:langchange', () => {
      langChanges++;
      check();
    });

    // کلیک
    document.addEventListener('click', () => {
      clickCount++;
      if (clickCount % 10 === 0) check();
    });

    // خوندن پست
    document.addEventListener('diamond:post-read', e => {
      if (e.detail && e.detail.id) {
        postsRead.add(e.detail.id);
        check();
      }
    });

    // دیدن بازی
    document.addEventListener('diamond:game-viewed', e => {
      if (e.detail && e.detail.id) {
        gamesViewed.add(e.detail.id);
        check();
      }
    });

    // دکمه‌ی مشاهده
    const btn = document.getElementById('achievementsBtn');
    if (btn) btn.addEventListener('click', showPanel);

    console.log('%c🏆 Achievements system ready', 'color:#ffc93c;');
  }

  function showPanel() {
    const overlay = document.createElement('div');
    overlay.className = 'ach-panel-overlay';
    const total = Object.keys(LIST).length;
    const got = Object.keys(unlocked).length;

    let html = `
      <div class="ach-panel">
        <button class="ach-close">×</button>
        <h2>🏆 Achievements</h2>
        <div class="ach-progress">
          <div class="ach-progress-bar">
            <span style="width: ${(got / total * 100)}%"></span>
          </div>
          <p>${got} / ${total} unlocked</p>
        </div>
        <div class="ach-list">
    `;

    Object.entries(LIST).forEach(([id, a]) => {
      const isUnlocked = !!unlocked[id];
      html += `
        <div class="ach-item ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="ach-item-icon">${isUnlocked ? a.icon : '🔒'}</div>
          <div class="ach-item-text">
            <strong>${a.title}</strong>
            <small>${a.desc}</small>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));

    overlay.querySelector('.ach-close').addEventListener('click', () => {
      overlay.classList.remove('show');
      setTimeout(() => overlay.remove(), 400);
    });
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 400);
      }
    });
  }

  D.achievements = { init, unlock, showPanel };
})();