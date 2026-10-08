/* ============================================================
   SCIENCE LEADERBOARD — جدول رده‌بندی کاربران
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;

  async function render() {
    const wrap = document.getElementById('leaderboardBody');
    if (!wrap) return;

    const users = await D.scienceDB.getLeaderboard();
    const currentUser = D.scienceAuth ? D.scienceAuth.getCurrentUser() : null;

    if (!users.length) {
      wrap.innerHTML = '<p class="resources-empty">هنوز کسی امتیازی نگرفته. اولین نفر باش! 🏆</p>';
      return;
    }

    let html = '<div class="lb-header">' +
      '<span>#</span>' +
      '<span>کاربر</span>' +
      '<span>امتیاز</span>' +
      '<span>آزمون</span>' +
      '<span>ویدیو</span>' +
      '<span>PDF</span>' +
      '</div>';

    users.slice(0, 20).forEach((u, i) => {
      const rank = i + 1;
      const isMe = currentUser && currentUser.username === u.username;
      let medal = '';
      if (rank === 1) medal = '🥇';
      else if (rank === 2) medal = '🥈';
      else if (rank === 3) medal = '🥉';

      html += `
        <div class="lb-row ${isMe ? 'lb-me' : ''}">
          <span class="lb-rank">${medal || rank}</span>
          <span class="lb-user">
            <span class="lb-avatar">${u.username.charAt(0).toUpperCase()}</span>
            ${D.utils.escapeHTML(u.username)}
          </span>
          <span class="lb-score">${u.totalScore || 0}</span>
          <span class="lb-stat">${u.quizzesTaken || 0}</span>
          <span class="lb-stat">${u.videosWatched || 0}</span>
          <span class="lb-stat">${u.pdfsViewed || 0}</span>
        </div>
      `;
    });

    wrap.innerHTML = html;
  }

  function init() {
    render();
    document.addEventListener('diamond:userchange', render);
    document.addEventListener('diamond:scorechange', render);
    console.log('%c🏆 Leaderboard ready', 'color:#ffc93c;');
  }

  D.scienceLeaderboard = { init, render };
})();