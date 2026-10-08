/* ============================================================
   UTILS — ابزارهای پایه
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;

  const $  = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  // ===== هش رمز (با fallback برای file://) =====
  async function sha256(text) {
    try {
      if (window.crypto && window.crypto.subtle && window.crypto.subtle.digest) {
        const buf = new TextEncoder().encode(text);
        const hash = await crypto.subtle.digest('SHA-256', buf);
        return [...new Uint8Array(hash)]
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      }
    } catch (err) {
      console.warn('[DIAMOND] crypto.subtle در دسترس نیست، fallback فعال شد');
    }

    // FNV-1a fallback (برای file:// یا محیط‌های ناامن)
    let h = 0x811c9dc5;
    const s = 'DIAMOND_SALT::' + text;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return 'fb_' + (h >>> 0).toString(16);
  }

  // ===== UUID =====
  function uuid() {
    if (window.crypto && window.crypto.randomUUID) {
      try { return crypto.randomUUID(); } catch (_) {}
    }
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  // ===== Escape HTML =====
  function escapeHTML(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));
  }

  function escapeAttr(s) {
    return escapeHTML(s).replace(/"/g, '&quot;');
  }

  // ===== اجرای ایمن (نمی‌ذاره یه خطا کل اسکریپت رو بترکونه) =====
  function safe(fn, label) {
    try { return fn(); }
    catch (err) { console.error(`[DIAMOND] error in ${label}:`, err); }
  }

  // ===== Toast =====
  function toast(msg, type = '') {
    const t = document.getElementById('toast') || $('.toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast show ' + type;
    clearTimeout(t._tid);
    t._tid = setTimeout(() => { t.className = 'toast ' + type; }, 2600);
  }

  // ===== جرقه‌های کلیکی =====
  function sparkleBurst(event) {
    try {
      const x = (event && event.clientX) || innerWidth / 2;
      const y = (event && event.clientY) || innerHeight / 2;
      for (let i = 0; i < 12; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
        const dist  = 40 + Math.random() * 60;
        const hue   = 20 + Math.random() * 60;
        s.style.background  = `hsl(${hue}, 90%, 65%)`;
        s.style.boxShadow   = `0 0 10px hsl(${hue}, 90%, 65%)`;
        s.style.left = x + 'px';
        s.style.top  = y + 'px';
        document.body.appendChild(s);
        requestAnimationFrame(() => {
          s.style.transition = 'transform .7s cubic-bezier(.2,.7,.2,1), opacity .7s';
          s.style.transform  = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`;
          s.style.opacity = '0';
        });
        setTimeout(() => s.remove(), 800);
      }
    } catch (_) {}
  }

  D.utils = { $, $$, sha256, uuid, escapeHTML, escapeAttr, safe, toast, sparkleBurst };
})();