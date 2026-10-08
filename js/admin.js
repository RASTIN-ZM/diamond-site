/* ============================================================
   ADMIN — پنل مدیریت (پست‌ها، بازی‌ها، امنیت)
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const { $, $$, uuid, escapeHTML, escapeAttr, toast } = D.utils;
  const { open: openModal, close: closeModal } = D.modals;

  // ===== Tabs =====
  function initTabs() {
    $$('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        $$('.admin-tab').forEach(t => t.classList.toggle('active', t === tab));
        $$('.admin-tab-panel').forEach(p =>
          p.classList.toggle('active', p.dataset.panel === target));
      });
    });
  }

  // ===== Posts =====
  function initPostForm() {
    const form = $('#postForm');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!D.auth.isAdmin()) { toast('اول لاگین کن', 'error'); return; }

      const id      = $('#postId').value;
      const title   = $('#postTitle').value.trim();
      const cover   = $('#postCover').value.trim();
      const tagsRaw = $('#postTags').value.trim();
      const content = $('#postContent').value.trim();
      const tags    = tagsRaw ? tagsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

      if (!title || !content) { toast('عنوان و متن الزامی‌ست', 'error'); return; }

      if (id) {
        D.blog.updatePost(id, { title, cover, tags, content });
        toast('پست ویرایش شد ✓', 'success');
      } else {
        D.blog.addPost({ id: uuid(), title, cover, tags, content, date: Date.now() });
        toast('پست منتشر شد ✓', 'success');
      }
      resetPostForm();
      renderAdminPosts();
      document.dispatchEvent(new CustomEvent('diamond:posts-updated'));
    });
  }

  function resetPostForm() {
    const f = $('#postForm'); if (f) f.reset();
    const i = $('#postId'); if (i) i.value = '';
    const c = $('#cancelEdit'); if (c) c.style.display = 'none';
  }

  function renderAdminPosts() {
    const list = $('#adminPostsList');
    if (!list) return;
    const posts = [...D.blog.getPosts()].sort((a,b) => b.date - a.date);
    list.innerHTML = '';
    if (!posts.length) {
      list.innerHTML = `<p style="color:var(--dim);font-size:13px;">هنوز پستی نداری.</p>`;
      return;
    }
    posts.forEach(p => {
      const item = document.createElement('div');
      item.className = 'admin-post-item';
      item.innerHTML = `
        <div style="flex:1;min-width:0;">
          <strong>${escapeHTML(p.title)}</strong>
          <br><small>${new Date(p.date).toLocaleDateString()}</small>
        </div>
        <div class="ap-actions">
          <button class="edit" title="Edit">✎</button>
          <button class="del"  title="Delete">🗑</button>
        </div>
      `;
      item.querySelector('.edit').onclick = () => {
        $('#postId').value = p.id;
        $('#postTitle').value = p.title;
        $('#postCover').value = p.cover || '';
        $('#postTags').value = (p.tags || []).join(', ');
        $('#postContent').value = p.content;
        $('#cancelEdit').style.display = 'inline-flex';
        const box = $('#adminModal') && $('#adminModal').querySelector('.modal-box');
        if (box) box.scrollTo({ top: 0, behavior: 'smooth' });
      };
      item.querySelector('.del').onclick = () => {
        if (!confirm(`حذف "${p.title}"؟`)) return;
        D.blog.deletePost(p.id);
        renderAdminPosts();
        document.dispatchEvent(new CustomEvent('diamond:posts-updated'));
        toast('پست حذف شد', '');
      };
      list.appendChild(item);
    });
  }

  // ===== Games =====
  function initGameForm() {
    const form = $('#gameForm');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!D.auth.isAdmin()) { toast('اول لاگین کن', 'error'); return; }

      const id       = $('#gameId').value;
      const name     = $('#gameName').value.trim();
      const cover    = $('#gameCover').value.trim();
      const download = $('#gameDownload').value.trim();
      const free     = $('#gameFree').checked;
      const price    = $('#gamePrice').value.trim();
      const tagsRaw  = $('#gameTags').value.trim();
      const desc     = $('#gameDesc').value.trim();
      const tags     = tagsRaw ? tagsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

      if (!name || !cover || !download) { toast('اسم، عکس و لینک الزامی‌ست', 'error'); return; }
      if (!free && !price) { toast('قیمت بزن یا رایگان رو تیک بزن', 'error'); return; }

      if (id) {
        D.games.updateGame(id, { name, cover, download, free, price, tags, desc });
        toast('بازی ویرایش شد ✓', 'success');
      } else {
        D.games.addGame({ id: uuid(), name, cover, download, free, price, tags, desc, date: Date.now() });
        toast('بازی اضافه شد ✓', 'success');
      }
      resetGameForm();
      renderAdminGames();
      document.dispatchEvent(new CustomEvent('diamond:games-updated'));
    });
  }

  function resetGameForm() {
    const f = $('#gameForm'); if (f) f.reset();
    const i = $('#gameId'); if (i) i.value = '';
    const c = $('#cancelGameEdit'); if (c) c.style.display = 'none';
  }

  function renderAdminGames() {
    const list = $('#adminGamesList');
    if (!list) return;
    const games = [...D.games.getGames()].sort((a,b) => b.date - a.date);
    list.innerHTML = '';
    if (!games.length) {
      list.innerHTML = `<p style="color:var(--dim);font-size:13px;">هنوز بازی‌ای نداری.</p>`;
      return;
    }
    games.forEach(g => {
      const item = document.createElement('div');
      item.className = 'admin-post-item';
      const priceLabel = g.free ? D.i18n.t('free') : (g.price || '—');
      item.innerHTML = `
        <div style="flex:1;min-width:0;display:flex;align-items:center;gap:10px;">
          <div style="width:40px;height:40px;border-radius:10px;background:${g.cover ? `url('${escapeAttr(g.cover)}') center/cover` : '#222'};flex-shrink:0;border:1px solid var(--glass-bd);"></div>
          <div style="min-width:0;">
            <strong>${escapeHTML(g.name)}</strong>
            <br><small>${escapeHTML(priceLabel)}</small>
          </div>
        </div>
        <div class="ap-actions">
          <button class="edit" title="Edit">✎</button>
          <button class="del"  title="Delete">🗑</button>
        </div>
      `;
      item.querySelector('.edit').onclick = () => {
        $('#gameId').value = g.id;
        $('#gameName').value = g.name;
        $('#gameCover').value = g.cover || '';
        $('#gameDownload').value = g.download || '';
        $('#gameFree').checked = !!g.free;
        $('#gamePrice').value = g.price || '';
        $('#gameTags').value = (g.tags || []).join(', ');
        $('#gameDesc').value = g.desc || '';
        $('#cancelGameEdit').style.display = 'inline-flex';
        const box = $('#adminModal') && $('#adminModal').querySelector('.modal-box');
        if (box) box.scrollTo({ top: 0, behavior: 'smooth' });
      };
      item.querySelector('.del').onclick = () => {
        if (!confirm(`حذف "${g.name}"؟`)) return;
        D.games.deleteGame(g.id);
        renderAdminGames();
        document.dispatchEvent(new CustomEvent('diamond:games-updated'));
        toast('بازی حذف شد', '');
      };
      list.appendChild(item);
    });
  }

  // ===== Open panel =====
  function openPanel() {
    renderAdminPosts();
    renderAdminGames();
    openModal('#adminModal');
  }

  // ===== Logout =====
  function initLogout() {
    const btn = $('#logoutBtn');
    if (btn) btn.addEventListener('click', () => {
      D.auth.logout();
      closeModal('#adminModal');
      toast('خارج شدی', '');
    });
  }

  // ===== Password form =====
  function initPasswordForm() {
    const form = $('#passwordForm');
    if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!D.auth.isAdmin()) { toast('اول لاگین کن', 'error'); return; }
      const cur  = $('#currentPassword').value;
      const newU = $('#newUsername').value.trim();
      const newP = $('#newPassword').value;
      const conf = $('#confirmPassword').value;
      const ok = await D.auth.changeCredentials(cur, newU, newP, conf);
      if (ok) form.reset();
    });
  }

  // ===== Reset all =====
  function initReset() {
    const btn = $('#resetAllBtn');
    if (btn) btn.addEventListener('click', () => {
      if (!confirm('همه پست‌ها، بازی‌ها و اطلاعات ورود پاک می‌شن. مطمئنی؟')) return;
      D.storage.resetAll();
      toast('همه اطلاعات پاک شد', '');
      setTimeout(() => location.reload(), 1200);
    });
  }

  function init() {
    initTabs();
    initPostForm();
    initGameForm();
    initLogout();
    initPasswordForm();
    initReset();

    const cancelP = $('#cancelEdit');
    if (cancelP) cancelP.addEventListener('click', resetPostForm);
    const cancelG = $('#cancelGameEdit');
    if (cancelG) cancelG.addEventListener('click', resetGameForm);
  }

  D.admin = { init, openPanel, renderAdminPosts, renderAdminGames };
})();