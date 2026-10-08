/* ============================================================
   SCIENCE AUTH — لاگین کاربر (ساده، بدون رمز)
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const KEY = 'diamond_science_user';

  let currentUser = null;

  function getCurrentUser() { return currentUser; }

  function load() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) currentUser = JSON.parse(saved);
    } catch (_) {}
  }

  function save() {
    try {
      if (currentUser) localStorage.setItem(KEY, JSON.stringify(currentUser));
      else localStorage.removeItem(KEY);
    } catch (_) {}
  }

  async function login(username) {
    if (!username || username.length < 3) return false;
    const user = await D.scienceDB.createUser(username);
    currentUser = user;
    save();
    updateUI();
    return true;
  }

  function logout() {
    currentUser = null;
    save();
    updateUI();
  }

  async function refreshUser() {
    if (!currentUser) return;
    const u = await D.scienceDB.getUser(currentUser.username);
    if (u) { currentUser = u; save(); }
  }

  function updateUI() {
    const btn = document.getElementById('scienceUserBtn');
    const nameEl = document.getElementById('scienceUserName');
    const avatarEl = document.getElementById('scienceUserAvatar');

    if (btn) {
      btn.classList.toggle('logged-in', !!currentUser);
    }
    if (nameEl) nameEl.textContent = currentUser ? currentUser.username : '';
    if (avatarEl) {
      avatarEl.textContent = currentUser ? currentUser.username.charAt(0).toUpperCase() : '👤';
    }

    document.dispatchEvent(new CustomEvent('diamond:userchange', {
      detail: { user: currentUser }
    }));
  }

  function init() {
    load();
    updateUI();

    const btn = document.getElementById('scienceUserBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        if (currentUser) {
          // نمایش پروفایل
          showProfile();
        } else {
          D.modals.open('#scienceLoginModal');
        }
      });
    }

    const form = document.getElementById('scienceLoginForm');
    if (form) {
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const input = document.getElementById('scienceUsername');
        const username = input.value.trim();
        if (!username) return;
        const ok = await login(username);
        if (ok) {
          form.reset();
          D.modals.close('#scienceLoginModal');
          D.utils.toast(`خوش آمدی ${username}! 👋`, 'success');
          if (D.sounds) D.sounds.success();
        }
      });
    }

    const logoutBtn = document.getElementById('scienceLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        logout();
        D.modals.close('#scienceProfileModal');
        D.utils.toast('از حساب خارج شدی', '');
      });
    }
  }

  function showProfile() {
    if (!currentUser) return;
    const body = document.getElementById('scienceProfileBody');
    if (!body) return;

    const u = currentUser;
    body.innerHTML = `
      <div class="profile-header">
        <div class="profile-avatar">${u.username.charAt(0).toUpperCase()}</div>
        <h3>${D.utils.escapeHTML(u.username)}</h3>
        <p class="profile-since">عضو از ${new Date(u.createdAt).toLocaleDateString('fa-IR')}</p>
      </div>
      <div class="profile-stats">
        <div class="pstat">
          <span class="pstat-num">${u.totalScore || 0}</span>
          <span class="pstat-label">امتیاز کل</span>
        </div>
        <div class="pstat">
          <span class="pstat-num">${u.quizzesTaken || 0}</span>
          <span class="pstat-label">آزمون</span>
        </div>
        <div class="pstat">
          <span class="pstat-num">${u.correctAnswers || 0}</span>
          <span class="pstat-label">پاسخ درست</span>
        </div>
        <div class="pstat">
          <span class="pstat-num">${u.videosWatched || 0}</span>
          <span class="pstat-label">ویدیو</span>
        </div>
      </div>
      <div class="modal-actions" style="justify-content:center;margin-top:20px;">
        <button class="btn btn-ghost" id="scienceLogoutBtn">خروج از حساب</button>
      </div>
    `;

    // دکمه خروج داخل پروفایل
    document.getElementById('scienceLogoutBtn').addEventListener('click', () => {
      logout();
      D.modals.close('#scienceProfileModal');
      D.utils.toast('از حساب خارج شدی', '');
    });

    D.modals.open('#scienceProfileModal');
  }

  D.scienceAuth = {
    init, login, logout, refreshUser,
    getCurrentUser, showProfile
  };
})();