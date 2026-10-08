/* ============================================================
   STORAGE — ذخیره‌سازی امن (localStorage + sessionStorage)
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const K = D.config.KEYS;

  function lsGet(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : v;
    } catch (_) { return fallback; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, val); } catch (_) {}
  }
  function lsDel(key) {
    try { localStorage.removeItem(key); } catch (_) {}
  }

  function getJSON(key, fallback) {
    const v = lsGet(key);
    if (v === null) return fallback;
    try { return JSON.parse(v); }
    catch (_) { return fallback; }
  }
  function setJSON(key, obj) {
    lsSet(key, JSON.stringify(obj));
  }

  function ssGet(key) {
    try { return sessionStorage.getItem(key); } catch (_) { return null; }
  }
  function ssSet(key, val) {
    try { sessionStorage.setItem(key, val); } catch (_) {}
  }
  function ssDel(key) {
    try { sessionStorage.removeItem(key); } catch (_) {}
  }

  D.storage = {
    // ===== Posts =====
    getPosts:  () => getJSON(K.POSTS, []),
    savePosts: (p) => setJSON(K.POSTS, p),

    // ===== Games =====
    getGames:  () => getJSON(K.GAMES, []),
    saveGames: (g) => setJSON(K.GAMES, g),

    // ===== Auth =====
    getUser:      () => lsGet(K.USER),
    setUser:      (u) => lsSet(K.USER, u),
    getPassHash:  () => lsGet(K.PASS_HASH),
    setPassHash:  (h) => lsSet(K.PASS_HASH, h),
    isAuthed:     () => ssGet(K.AUTH) === '1',
    setAuthed:    (v) => v ? ssSet(K.AUTH, '1') : ssDel(K.AUTH),

    // ===== Prefs =====
    getLang:  () => lsGet(K.LANG),
    setLang:  (l) => lsSet(K.LANG, l),
    getTheme: () => lsGet(K.THEME),
    setTheme: (t) => lsSet(K.THEME, t),

    // ===== Reset =====
    resetAll: () => {
      [K.POSTS, K.GAMES, K.USER, K.PASS_HASH, K.LANG, K.THEME].forEach(lsDel);
      ssDel(K.AUTH);
    }
  };
})();