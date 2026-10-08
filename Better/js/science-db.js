/* ============================================================
   SCIENCE DB — دیتابیس IndexedDB برای کاربران، پیشرفت و لیدربورد
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const DB_NAME = 'diamond_science_db';
  const DB_VERSION = 1;
  let db = null;

  // ===== باز کردن دیتابیس =====
  function open() {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);

      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const database = e.target.result;

        // Store کاربران
        if (!database.objectStoreNames.contains('users')) {
          const users = database.createObjectStore('users', { keyPath: 'username' });
          users.createIndex('totalScore', 'totalScore', { unique: false });
          users.createIndex('lastActive', 'lastActive', { unique: false });
        }

        // Store پیشرفت
        if (!database.objectStoreNames.contains('progress')) {
          const progress = database.createObjectStore('progress', { keyPath: 'id' });
          progress.createIndex('username', 'username', { unique: false });
          progress.createIndex('subjectId', 'subjectId', { unique: false });
        }

        // Store فعالیت‌ها (برای لیدربورد)
        if (!database.objectStoreNames.contains('activity')) {
          const activity = database.createObjectStore('activity', { keyPath: 'id', autoIncrement: true });
          activity.createIndex('username', 'username', { unique: false });
          activity.createIndex('type', 'type', { unique: false });
          activity.createIndex('date', 'date', { unique: false });
        }
      };

      req.onsuccess = (e) => {
        db = e.target.result;
        resolve(db);
      };

      req.onerror = (e) => reject(e.target.error);
    });
  }

  // ===== Promise wrapper =====
  function tx(storeName, mode, action) {
    return open().then(database => {
      return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const req = action(store);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    });
  }

  // ===== API کاربران =====
  async function getUser(username) {
    return tx('users', 'readonly', store => store.get(username));
  }

  async function createUser(username) {
    const existing = await getUser(username);
    if (existing) return existing;
    const user = {
      username,
      createdAt: Date.now(),
      lastActive: Date.now(),
      totalScore: 0,
      quizzesTaken: 0,
      correctAnswers: 0,
      videosWatched: 0,
      pdfsViewed: 0,
      badges: []
    };
    await tx('users', 'readwrite', store => store.add(user));
    return user;
  }

  async function updateUser(username, updates) {
    const user = await getUser(username);
    if (!user) return null;
    Object.assign(user, updates, { lastActive: Date.now() });
    await tx('users', 'readwrite', store => store.put(user));
    return user;
  }

  // ===== API پیشرفت =====
  function progressId(username, subjectId, lessonId) {
    return `${username}::${subjectId}::${lessonId}`;
  }

  async function getProgress(username, subjectId, lessonId) {
    return tx('progress', 'readonly', store => store.get(progressId(username, subjectId, lessonId)));
  }

  async function saveProgress(username, subjectId, lessonId, data) {
    const record = {
      id: progressId(username, subjectId, lessonId),
      username, subjectId, lessonId,
      ...data,
      updatedAt: Date.now()
    };
    await tx('progress', 'readwrite', store => store.put(record));
    return record;
  }

  async function getAllProgress(username) {
    return new Promise((resolve, reject) => {
      open().then(database => {
        const t = database.transaction('progress', 'readonly');
        const store = t.objectStore('progress');
        const index = store.index('username');
        const req = index.getAll(username);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    });
  }

  // ===== API فعالیت =====
  async function logActivity(username, type, details = {}) {
    return tx('activity', 'readwrite', store => store.add({
      username, type, details, date: Date.now()
    }));
  }

  // ===== لیدربورد =====
  async function getLeaderboard() {
    return new Promise((resolve, reject) => {
      open().then(database => {
        const t = database.transaction('users', 'readonly');
        const store = t.objectStore('users');
        const req = store.getAll();
        req.onsuccess = () => {
          const users = req.result || [];
          users.sort((a, b) => {
            // اولویت: امتیاز کل، بعد ویدیو، بعد PDF
            if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
            if (b.videosWatched !== a.videosWatched) return b.videosWatched - a.videosWatched;
            return b.pdfsViewed - a.pdfsViewed;
          });
          resolve(users);
        };
        req.onerror = () => reject(req.error);
      });
    });
  }

  // ===== ریست =====
  async function resetAll() {
    if (db) { db.close(); db = null; }
    return new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  D.scienceDB = {
    open, getUser, createUser, updateUser,
    getProgress, saveProgress, getAllProgress,
    logActivity, getLeaderboard, resetAll
  };
})();