/* ============================================================
   SCIENCE — کوییز، منابع، PDF، ویدیو + پیش‌نمایش + امتیاز
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const { $, $$, escapeHTML, escapeAttr, toast } = D.utils;

  const STORAGE_KEY = 'diamond_science_v1';
  let data = { subjects: [] };
  let resources = {};
  let currentQuiz = null;
  let currentQuizSubject = null;
  let currentQuizLesson = null;
  let currentAnswers = [];

  function load() {
    data.subjects = (D.scienceData && D.scienceData.subjects) || [];
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      resources = saved.resources || {};
    } catch (_) { resources = {}; }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ resources }));
    } catch (_) {}
  }

  // ============================================================
  // 1. استخراج ID یوتیوب
  // ============================================================
  function getYouTubeId(url) {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return null;
  }

  function getVideoThumbnail(url) {
    const id = getYouTubeId(url);
    if (!id) return null;
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }

  // ============================================================
  // 2. رندر کارت‌های درس
  // ============================================================
  async function renderSubjects() {
    const grid = $('#scienceGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const user = D.scienceAuth ? D.scienceAuth.getCurrentUser() : null;
    let userProgress = {};
    if (user) {
      const all = await D.scienceDB.getAllProgress(user.username);
      all.forEach(p => { userProgress[p.id] = p; });
    }

    data.subjects.forEach(sub => {
      const card = document.createElement('div');
      card.className = 'card glass holo-card scroll-reveal subject-card';
      card.style.setProperty('--subject-color', sub.color);

      const totalLessons = sub.lessons.length;
      let completed = 0;
      sub.lessons.forEach(l => {
        const p = userProgress[`${user ? user.username : ''}::${sub.id}::${l.id}`];
        if (p && p.done) completed++;
      });

      const percent = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;
      const totalQ = sub.lessons.reduce((s, l) => s + l.questions.length, 0);

      card.innerHTML = `
        <div class="subject-icon">${sub.icon}</div>
        <h3>${escapeHTML(sub.name)}</h3>
        <div class="subject-meta">
          <span>${totalLessons} فصل</span>
          <span>${totalQ} سوال</span>
        </div>
        <div class="subject-progress">
          <div class="subject-progress-bar"><span style="width:${percent}%"></span></div>
          <small>${percent}% تکمیل</small>
        </div>
      `;

      card.addEventListener('click', () => openSubject(sub.id));
      grid.appendChild(card);
    });

    if (D.effects && D.effects.bindTilt) D.effects.bindTilt(grid);

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    $$('.subject-card', grid).forEach(el => io.observe(el));
  }

  // ============================================================
  // 3. نمایش فصل‌ها
  // ============================================================
  async function openSubject(subjectId) {
    const sub = data.subjects.find(s => s.id === subjectId);
    if (!sub) return;

    const grid = $('#scienceGrid');
    const backWrap = $('#scienceBackWrap');
    if (!grid) return;

    grid.innerHTML = '';

    if (backWrap) {
      backWrap.innerHTML = `<button class="btn btn-ghost science-back" id="scienceBackBtn">← بازگشت به درس‌ها</button>`;
      $('#scienceBackBtn').onclick = () => {
        backWrap.innerHTML = '';
        renderSubjects();
        renderResourcesSection();
      };
    }

    const user = D.scienceAuth ? D.scienceAuth.getCurrentUser() : null;

    for (const lesson of sub.lessons) {
      const card = document.createElement('div');
      card.className = 'card glass lesson-card';
      card.style.setProperty('--subject-color', sub.color);

      let status = 'شروع کنید';
      if (user) {
        const p = await D.scienceDB.getProgress(user.username, sub.id, lesson.id);
        if (p && p.done) status = `✅ ${p.score}/${p.total}`;
      }

      card.innerHTML = `
        <div class="lesson-icon">${sub.icon}</div>
        <h3>${escapeHTML(lesson.title)}</h3>
        <p class="lesson-meta">${lesson.questions.length} سوال چهارگزینه‌ای</p>
        <div class="lesson-status">${status}</div>
      `;

      card.addEventListener('click', () => startQuiz(sub, lesson));
      grid.appendChild(card);
    }

    if (D.effects && D.effects.bindTilt) D.effects.bindTilt(grid);
  }

  // ============================================================
  // 4. شروع کوییز
  // ============================================================
  function startQuiz(sub, lesson) {
    currentQuizSubject = sub;
    currentQuizLesson = lesson;
    currentQuiz = lesson.questions;
    currentAnswers = [];
    let currentIndex = 0;

    const modal = $('#quizModal');
    const body = $('#quizBody');
    const title = $('#quizTitle');
    const progressBar = $('#quizProgressBar');
    const progressText = $('#quizProgressText');

    if (!modal || !body) return;

    title.textContent = lesson.title;

    function renderQuestion() {
      if (currentIndex >= currentQuiz.length) return showResult();
      const q = currentQuiz[currentIndex];
      progressBar.style.width = ((currentIndex / currentQuiz.length) * 100) + '%';
      progressText.textContent = `${currentIndex + 1} / ${currentQuiz.length}`;

      body.innerHTML = `
        <div class="quiz-question">
          <h3 class="quiz-q-text">${escapeHTML(q.q)}</h3>
          <div class="quiz-options">
            ${q.options.map((opt, i) => `
              <button class="quiz-option" data-index="${i}">
                <span class="quiz-opt-letter">${['الف','ب','ج','د'][i]}</span>
                <span class="quiz-opt-text">${escapeHTML(opt)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      $$('.quiz-option', body).forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index, 10);
          currentAnswers[currentIndex] = idx;

          $$('.quiz-option', body).forEach((b, i) => {
            b.classList.remove('correct', 'wrong');
            if (i === q.answer) b.classList.add('correct');
            else if (i === idx && idx !== q.answer) b.classList.add('wrong');
            b.disabled = true;
          });

          if (D.sounds) {
            if (idx === q.answer) D.sounds.success(); else D.sounds.error();
          }

          const nextBtn = document.createElement('button');
          nextBtn.className = 'btn btn-primary quiz-next';
          nextBtn.textContent = currentIndex === currentQuiz.length - 1 ? 'دیدن نتیجه' : 'سوال بعدی →';
          nextBtn.onclick = () => { currentIndex++; renderQuestion(); };
          body.appendChild(nextBtn);
        });
      });
    }

    async function showResult() {
      const correct = currentAnswers.filter((a, i) => a === currentQuiz[i].answer).length;
      const total = currentQuiz.length;
      const percent = Math.round((correct / total) * 100);

      // ذخیره امتیاز
      const user = D.scienceAuth ? D.scienceAuth.getCurrentUser() : null;
      if (user) {
        await D.scienceDB.saveProgress(user.username, sub.id, lesson.id, {
          score: correct, total, done: true
        });
        await D.scienceDB.updateUser(user.username, {
          totalScore: (user.totalScore || 0) + correct,
          quizzesTaken: (user.quizzesTaken || 0) + 1,
          correctAnswers: (user.correctAnswers || 0) + correct
        });
        await D.scienceAuth.refreshUser();
        document.dispatchEvent(new CustomEvent('diamond:scorechange'));
      }

      progressBar.style.width = '100%';
      progressText.textContent = 'پایان';

      let emoji = '😐', msg = 'باز هم تلاش کن!';
      if (percent >= 90) { emoji = '🏆'; msg = 'فوق‌العاده!'; }
      else if (percent >= 70) { emoji = '🎉'; msg = 'عالی بود!'; }
      else if (percent >= 50) { emoji = '👍'; msg = 'خوب بود، می‌تونی بهتر بشی!'; }

      body.innerHTML = `
        <div class="quiz-result">
          <div class="quiz-result-emoji">${emoji}</div>
          <h3>${msg}</h3>
          <div class="quiz-result-score">
            <span class="score-num">${correct}</span>
            <span class="score-sep">/</span>
            <span class="score-total">${total}</span>
          </div>
          <div class="quiz-result-percent">${percent}%</div>
          <div class="quiz-result-actions">
            <button class="btn btn-primary" id="quizRetry">🔄 دوباره</button>
            <button class="btn btn-ghost" id="quizClose">بستن</button>
          </div>
        </div>
      `;

      $('#quizRetry').onclick = () => startQuiz(sub, lesson);
      $('#quizClose').onclick = () => {
        D.modals.close('#quizModal');
        renderSubjects();
      };

      if (D.sounds && percent >= 70) D.sounds.achievement();
      if (D.achievements) D.achievements.unlock('scientist');
    }

    renderQuestion();
    D.modals.open('#quizModal');
  }

  // ============================================================
  // 5. رندر منابع با پیش‌نمایش ویدیو
  // ============================================================
  async function renderResourcesSection() {
    const wrap = $('#scienceResources');
    if (!wrap) return;

    let html = '<h3 class="resources-title">📚 منابع آموزشی</h3><div class="resources-list">';
    let hasAny = false;

    data.subjects.forEach(sub => {
      const list = resources[sub.id] || [];
      if (!list.length) return;
      hasAny = true;
      html += `<div class="resource-group"><h4 style="color:${sub.color}">${sub.icon} ${escapeHTML(sub.name)}</h4><ul>`;

      list.forEach((r, idx) => {
        if (r.type === 'video') {
          const thumb = getVideoThumbnail(r.url);
          html += `
            <li class="resource-video">
              <a href="${escapeAttr(r.url)}" target="_blank" rel="noopener" class="video-card"
                 data-subject="${sub.id}" data-index="${idx}">
                <div class="video-thumb" style="background-image:url('${thumb || ''}')">
                  <span class="video-play">▶</span>
                </div>
                <span class="video-title">${escapeHTML(r.title)}</span>
              </a>
            </li>
          `;
        } else {
          const icon = r.type === 'pdf' ? '📄' : '🔗';
          html += `
            <li>
              <span class="res-icon">${icon}</span>
              <a href="${escapeAttr(r.url)}" target="_blank" rel="noopener"
                 class="res-link" data-subject="${sub.id}" data-index="${idx}" data-type="${r.type}">
                ${escapeHTML(r.title)}
              </a>
            </li>
          `;
        }
      });

      html += `</ul></div>`;
    });

    if (!hasAny) {
      html += '<p class="resources-empty">هنوز منبعی اضافه نشده. ادمین می‌تواند از پنل اضافه کند.</p>';
    }

    html += '</div>';
    wrap.innerHTML = html;

    // ثبت بازدید ویدیو و PDF
    wrap.querySelectorAll('.video-card').forEach(el => {
      el.addEventListener('click', () => logResourceView(el.dataset.subject, el.dataset.index, 'video'));
    });
    wrap.querySelectorAll('.res-link').forEach(el => {
      el.addEventListener('click', () => logResourceView(el.dataset.subject, el.dataset.index, el.dataset.type));
    });
  }

  async function logResourceView(subjectId, index, type) {
    const user = D.scienceAuth ? D.scienceAuth.getCurrentUser() : null;
    if (!user) return;

    if (type === 'video') {
      await D.scienceDB.updateUser(user.username, {
        videosWatched: (user.videosWatched || 0) + 1,
        totalScore: (user.totalScore || 0) + 1
      });
    } else if (type === 'pdf') {
      await D.scienceDB.updateUser(user.username, {
        pdfsViewed: (user.pdfsViewed || 0) + 1,
        totalScore: (user.totalScore || 0) + 1
      });
    }
    await D.scienceAuth.refreshUser();
    document.dispatchEvent(new CustomEvent('diamond:scorechange'));
  }

  // ============================================================
  // 6. پنل ادمین
  // ============================================================
  function initAdminResources() {
    const form = $('#resourceForm');
    if (!form) return;

    const select = $('#resourceSubject');
    if (select) {
      select.innerHTML = data.subjects.map(s =>
        `<option value="${s.id}">${s.icon} ${escapeHTML(s.name)}</option>`
      ).join('');
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!D.auth || !D.auth.isAdmin()) { toast('اول لاگین کن', 'error'); return; }

      const subjectId = $('#resourceSubject').value;
      const type = $('#resourceType').value;
      const title = $('#resourceTitle').value.trim();
      const url = $('#resourceUrl').value.trim();

      if (!subjectId || !title || !url) { toast('همه فیلدها الزامی‌ست', 'error'); return; }

      if (!resources[subjectId]) resources[subjectId] = [];
      resources[subjectId].push({ type, title, url, date: Date.now() });
      save();

      form.reset();
      renderAdminResourceList();
      renderResourcesSection();
      toast('منبع اضافه شد ✓', 'success');
    });
  }

  function renderAdminResourceList() {
    const list = $('#adminResourceList');
    if (!list) return;
    list.innerHTML = '';
    let hasAny = false;

    Object.entries(resources).forEach(([subjectId, items]) => {
      const sub = data.subjects.find(s => s.id === subjectId);
      if (!sub) return;
      items.forEach((r, idx) => {
        hasAny = true;
        const item = document.createElement('div');
        item.className = 'admin-post-item';
        const icon = r.type === 'pdf' ? '📄' : r.type === 'video' ? '🎬' : '🔗';
        item.innerHTML = `
          <div style="flex:1;min-width:0;">
            <strong>${icon} ${escapeHTML(r.title)}</strong>
            <br><small>${escapeHTML(sub.name)}</small>
          </div>
          <div class="ap-actions">
            <button class="del" title="Delete">🗑</button>
          </div>
        `;
        item.querySelector('.del').onclick = () => {
          if (!confirm(`حذف "${r.title}"؟`)) return;
          resources[subjectId].splice(idx, 1);
          if (!resources[subjectId].length) delete resources[subjectId];
          save();
          renderAdminResourceList();
          renderResourcesSection();
          toast('منبع حذف شد', '');
        };
        list.appendChild(item);
      });
    });

    if (!hasAny) list.innerHTML = '<p style="color:var(--dim);font-size:13px;">هنوز منبعی اضافه نشده.</p>';
  }

  // ============================================================
  // INIT
  // ============================================================
  async function init() {
    load();
    await D.scienceDB.open();
    await renderSubjects();
    await renderResourcesSection();
    initAdminResources();
    renderAdminResourceList();

    document.addEventListener('diamond:langchange', () => {
      renderSubjects();
      renderResourcesSection();
    });
    document.addEventListener('diamond:userchange', () => {
      renderSubjects();
    });

    console.log('%c🧪 Science system ready', 'color:#00d4ff;font-weight:bold;');
  }

  D.science = { init, renderSubjects, renderResourcesSection, openSubject, startQuiz };
})();