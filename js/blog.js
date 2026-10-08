/* ============================================================
   BLOG — سیستم بلاگ کامل
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const { $, escapeHTML } = D.utils;

  let posts = [];
  let activeTag = null;

  function load() { posts = D.storage.getPosts(); }
  function save() { D.storage.savePosts(posts); }

  function readingTime(text) {
    const words = String(text || '').trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  }

  function formatDate(ts) {
    try {
      const d = new Date(ts);
      const lang = D.i18n.getLang() === 'fa' ? 'fa-IR' : 'en-US';
      return d.toLocaleDateString(lang, { year:'numeric', month:'short', day:'numeric' });
    } catch (_) {
      return new Date(ts).toDateString();
    }
  }

  function renderTags() {
    const wrap = $('#blogTags');
    if (!wrap) return;
    const tags = new Set();
    posts.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
    wrap.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.textContent = 'All';
    allBtn.className = activeTag === null ? 'active' : '';
    allBtn.onclick = () => { activeTag = null; render(); renderTags(); };
    wrap.appendChild(allBtn);

    tags.forEach(tag => {
      const b = document.createElement('button');
      b.textContent = tag;
      b.className = activeTag === tag ? 'active' : '';
      b.onclick = () => { activeTag = tag; render(); renderTags(); };
      wrap.appendChild(b);
    });
  }

  function render() {
    const grid  = $('#blogGrid');
    const empty = $('#blogEmpty');
    if (!grid) return;
    const q = (($('#blogSearch') && $('#blogSearch').value) || '').toLowerCase().trim();

    let list = [...posts].sort((a,b) => b.date - a.date);
    if (activeTag) list = list.filter(p => (p.tags || []).includes(activeTag));
    if (q) list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );

    grid.innerHTML = '';
    if (!list.length) {
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';

    const minRead = D.i18n.t('min_read');

    list.forEach(p => {
      const card = document.createElement('a');
      card.className = 'card glass blog-card tilt in-view';
      card.href = '#';
      card.innerHTML = `
        <div class="blog-cover ${p.cover ? '' : 'no-img'}"
             style="${p.cover ? `background-image:url('${escapeHTML(p.cover)}')` : ''}"></div>
        <h3>${escapeHTML(p.title)}</h3>
        <div class="blog-meta">${formatDate(p.date)} · ${readingTime(p.content)} ${minRead}</div>
        <p class="blog-excerpt">${escapeHTML(p.content.slice(0, 110))}${p.content.length > 110 ? '…' : ''}</p>
      `;
      card.addEventListener('click', e => {
        e.preventDefault();
        openPost(p.id);
        D.utils.sparkleBurst(e);
      });
      grid.appendChild(card);
    });
    D.effects.bindTilt(grid);
  }

  function openPost(id) {
    const p = posts.find(x => x.id === id);
    if (!p) return;

    const cover = $('#pvCover');
    if (p.cover) {
      if (cover) { cover.src = p.cover; cover.classList.add('show'); }
    } else if (cover) {
      cover.classList.remove('show');
    }

    const title   = $('#pvTitle');
    const meta    = $('#pvMeta');
    const content = $('#pvContent');
    const minRead = D.i18n.t('min_read');

    if (title) title.textContent = p.title;
    if (meta) {
      const tags = p.tags && p.tags.length ? ` · ${p.tags.join(', ')}` : '';
      meta.textContent = `${formatDate(p.date)} · ${readingTime(p.content)} ${minRead}${tags}`;
    }
    if (content) content.textContent = p.content;

    D.modals.open('#postModal');
  }

  function init() {
    load();

    const s = $('#blogSearch');
    if (s) s.addEventListener('input', render);

    render();
    renderTags();

    document.addEventListener('diamond:langchange', () => { render(); renderTags(); });
    document.addEventListener('diamond:posts-updated', () => { load(); render(); renderTags(); });
  }

  D.blog = {
    init, render, renderTags, openPost,
    getPosts: () => posts,
    addPost: (post) => { posts.push(post); save(); render(); renderTags(); },
    updatePost: (id, data) => {
      const p = posts.find(x => x.id === id);
      if (p) { Object.assign(p, data, { updated: Date.now() }); save(); render(); renderTags(); }
    },
    deletePost: (id) => {
      posts = posts.filter(x => x.id !== id);
      save(); render(); renderTags();
    }
  };
})();