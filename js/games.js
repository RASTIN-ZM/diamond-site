/* ============================================================
   GAMES — نمایش بازی‌ها از لیست دستی (با فیلتر و صفحه‌بندی)
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const { $, escapeHTML, escapeAttr, toast } = D.utils;

  let allGames = [];        // همه بازی‌ها
  let filteredGames = [];   // بازی‌های فیلترشده
  let currentPage = 1;
  const ITEMS_PER_PAGE = 12; // تعداد بازی در هر صفحه

  let activeFilter = null;

  // ===== بارگذاری داده‌ها از لیست دستی =====
  function load() {
    try {
      allGames = D.gamesData || [];
      console.log(`[DIAMOND] ${allGames.length} بازی از لیست دستی بارگذاری شد.`);
      
      applyFilters(); // اولین رندر
      renderFilters();
    } catch (err) {
      console.error('[DIAMOND] خطا در بارگذاری لیست بازی‌ها:', err);
      toast('خطا در بارگذاری لیست بازی‌ها', 'error');
    }
  }

  // ===== اعمال فیلترها و جستجو =====
  function applyFilters() {
    const q = ($('#gameSearch')?.value || '').toLowerCase().trim();
    let list = [...allGames];

    // فیلتر بر اساس ژانر یا رایگان بودن
    if (activeFilter === '__free') {
      list = list.filter(g => g.free);
    } else if (activeFilter) {
      list = list.filter(g => (g.tags || []).includes(activeFilter));
    }

    // فیلتر بر اساس جستجو
    if (q) {
      list = list.filter(g =>
        g.name.toLowerCase().includes(q) ||
        (g.desc || '').toLowerCase().includes(q) ||
        (g.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    // مرتب‌سازی بر اساس تاریخ (جدیدترین)
    list.sort((a, b) => b.date - a.date);

    filteredGames = list;
    currentPage = 1; // با هر فیلتر جدید، به صفحه اول برگرد
    renderGames();
  }

  // ===== رندر کردن بازی‌های صفحه فعلی =====
  function renderGames() {
    const grid = $('#gamesGrid');
    const empty = $('#gamesEmpty');
    const pagination = $('#gamesPagination');

    if (!grid) return;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageGames = filteredGames.slice(start, end);

    grid.innerHTML = '';

    if (!pageGames.length) {
      if (empty) empty.style.display = 'block';
      if (pagination) pagination.innerHTML = '';
      return;
    }
    if (empty) empty.style.display = 'none';

    const freeTxt = D.i18n.t('free');

    pageGames.forEach(g => {
      const card = document.createElement('a');
      card.className = 'card glass game-card tilt';
      card.href = '#';
      const badge = g.free
        ? `<span class="game-badge free">${escapeHTML(freeTxt)}</span>`
        : `<span class="game-badge paid">${escapeHTML(g.price || '—')}</span>`;
      
      const tagsHTML = (g.tags || []).slice(0, 3)
        .map(tag => `<span>${escapeHTML(tag)}</span>`).join('');

      card.innerHTML = `
        <div class="game-cover ${g.cover ? '' : 'no-img'}"
             style="${g.cover ? `background-image:url('${escapeAttr(g.cover)}')` : ''}">
          ${badge}
          <div class="game-info">
            <h3>${escapeHTML(g.name)}</h3>
            ${tagsHTML ? `<div class="game-tags-mini">${tagsHTML}</div>` : ''}
          </div>
        </div>
        <div class="game-body">
          <p class="game-desc-mini">${escapeHTML(g.desc || '—')}</p>
          <span class="game-price-tag ${g.free ? 'free-text' : ''}">
            ${g.free ? escapeHTML(freeTxt) : escapeHTML(g.price || '—')}
          </span>
        </div>
      `;
      
      card.addEventListener('click', e => {
        e.preventDefault();
        openGame(g.id);
        D.utils.sparkleBurst(e);
      });
      grid.appendChild(card);
    });

    D.effects.bindTilt(grid);
    renderPagination();
  }

  // ===== رندر دکمه‌های صفحه‌بندی =====
  function renderPagination() {
    const pagination = $('#gamesPagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }

    let html = '';
    // دکمه قبلی
    if (currentPage > 1) {
      html += `<button class="btn btn-ghost magnetic" data-page="${currentPage - 1}">‹</button>`;
    }
    // شماره صفحه‌ها
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="btn magnetic ${i === currentPage ? 'btn-primary' : 'btn-ghost'}" data-page="${i}">${i}</button>`;
    }
    // دکمه بعدی
    if (currentPage < totalPages) {
      html += `<button class="btn btn-ghost magnetic" data-page="${currentPage + 1}">›</button>`;
    }
    
    pagination.innerHTML = html;

    // اتصال رویداد کلیک
    pagination.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.dataset.page, 10);
        renderGames();
        window.scrollTo({ top: 0, behavior: 'smooth' }); // اسکرول به بالا
      });
    });
  }

  // ===== توابع فیلتر =====
  function renderFilters() {
    const wrap = $('#gameFilters');
    if (!wrap) return;
    const tags = new Set();
    allGames.forEach(g => (g.tags || []).forEach(t => tags.add(t)));
    wrap.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.textContent = 'All';
    allBtn.className = activeFilter === null ? 'active' : '';
    allBtn.onclick = () => { activeFilter = null; applyFilters(); renderFilters(); };
    wrap.appendChild(allBtn);

    const freeBtn = document.createElement('button');
    freeBtn.textContent = '🆓 ' + D.i18n.t('free');
    freeBtn.className = activeFilter === '__free' ? 'active' : '';
    freeBtn.onclick = () => { activeFilter = '__free'; applyFilters(); renderFilters(); };
    wrap.appendChild(freeBtn);

    // فقط ۱۲ ژانر محبوب نمایش داده شود
    const popularTags = [...tags].slice(0, 12);
    popularTags.forEach(tag => {
      const b = document.createElement('button');
      b.textContent = tag;
      b.className = activeFilter === tag ? 'active' : '';
      b.onclick = () => { activeFilter = tag; applyFilters(); renderFilters(); };
      wrap.appendChild(b);
    });
  }

  // ===== نمایش مودال بازی =====
  function openGame(id) {
    const g = allGames.find(x => x.id === id);
    if (!g) return;

    const cover = $('#gvCover');
    if (cover) cover.src = g.cover || '';

    const title = $('#gvTitle');
    const meta = $('#gvMeta');
    const desc = $('#gvDesc');
    const dl = $('#gvDownload');

    if (title) title.textContent = g.name;
    if (meta) {
      const tagsTxt = (g.tags || []).join(', ');
      const priceTxt = g.free ? D.i18n.t('free') : (g.price || '—');
      meta.textContent = priceTxt + (tagsTxt ? ' · ' + tagsTxt : '');
    }
    if (desc) desc.textContent = g.desc || '';
    if (dl) {
      dl.href = g.download || '#';
      dl.innerHTML = `⬇ ${escapeHTML(D.i18n.t('download_now'))}`;
    }
    D.modals.open('#gameModal');
  }

  // ===== مقداردهی اولیه =====
  function init() {
    load(); 

    const s = $('#gameSearch');
    if (s) s.addEventListener('input', () => D.utils.safe(applyFilters, 'game search'));

    document.addEventListener('diamond:langchange', () => { 
      renderFilters(); 
      renderGames(); 
    });
  }

  D.games = {
    init, renderGames, renderFilters, openGame,
    getGames: () => allGames,
  };
})();