/* ============================================================
   AUTH — احراز هویت ادمین
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const { $, sha256, toast } = D.utils;

  let isAdmin = false;

  async function getCredentials() {
    let user = D.storage.getUser();
    let hash = D.storage.getPassHash();
    if (!user || !hash) {
      user = D.config.DEFAULT_USER;
      hash = await sha256(D.config.DEFAULT_PASS);
      D.storage.setUser(user);
      D.storage.setPassHash(hash);
    }
    return { user, hash };
  }

  function updateUI() {
    const btn = $('#adminToggle');
    const footerBtn = $('#footerAdmin');
    if (btn) {
      btn.classList.toggle('logged-in', isAdmin);
      btn.title = isAdmin ? 'Admin panel' : 'Admin login';
    }
    if (footerBtn) {
      footerBtn.textContent = isAdmin
        ? D.i18n.t('admin_panel')
        : D.i18n.t('admin_login');
    }
  }

  async function login(user, pass) {
    const creds = await getCredentials();
    const hash = await sha256(pass);
    if (user === creds.user && hash === creds.hash) {
      isAdmin = true;
      D.storage.setAuthed(true);
      updateUI();
      return true;
    }
    return false;
  }

  function logout() {
    isAdmin = false;
    D.storage.setAuthed(false);
    updateUI();
  }

  async function changeCredentials(curPass, newUser, newPass, confirmPass) {
    const err = $('#passError');
    const setErr = (msg) => { if (err) { err.style.color = 'var(--c1)'; err.textContent = msg; } };

    const creds = await getCredentials();
    const curHash = await sha256(curPass);
    if (curHash !== creds.hash)   { setErr('رمز فعلی اشتباهه'); return false; }
    if (newPass && newPass !== confirmPass) { setErr('رمز جدید و تأییدش یکی نیستن'); return false; }
    if (newPass && newPass.length < 6)      { setErr('رمز جدید حداقل ۶ کاراکتر'); return false; }

    if (newUser) D.storage.setUser(newUser);
    if (newPass) D.storage.setPassHash(await sha256(newPass));

    if (err) { err.style.color = 'var(--c4)'; err.textContent = '✓ ذخیره شد. لطفاً دوباره لاگین کن.'; }
    setTimeout(() => {
      logout();
      D.modals.close('#adminModal');
    }, 1500);
    return true;
  }

  function init() {
    isAdmin = D.storage.isAuthed();
    updateUI();

    const a = $('#adminToggle');
    if (a) a.addEventListener('click', () => {
      if (isAdmin) D.admin.openPanel();
      else D.modals.open('#loginModal');
    });

    const f = $('#footerAdmin');
    if (f) f.addEventListener('click', () => {
      if (isAdmin) D.admin.openPanel();
      else D.modals.open('#loginModal');
    });

    const form = $('#loginForm');
    if (form) form.addEventListener('submit', async e => {
      e.preventDefault();
      const u = $('#loginUser').value.trim();
      const p = $('#loginPass').value;
      const ok = await login(u, p);
      const err = $('#loginError');
      if (ok) {
        if (err) err.textContent = '';
        form.reset();
        D.modals.close('#loginModal');
        toast('Welcome, admin ✨', 'success');
        D.admin.openPanel();
      } else {
        if (err) err.textContent = 'Invalid username or password';
        D.utils.sparkleBurst(e);
      }
    });

    document.addEventListener('diamond:langchange', updateUI);
  }

  D.auth = {
    init, login, logout, changeCredentials,
    isAdmin: () => isAdmin,
    getCredentials
  };
})();