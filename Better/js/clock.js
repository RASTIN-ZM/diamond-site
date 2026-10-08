/* ============================================================
   CLOCK — ساعت و تاریخ زنده در نویگیشن
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;

  let el = null;
  let interval = null;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function format() {
    const now = new Date();
    const lang = D.i18n.getLang();
    let dateStr = '', timeStr = '';

    try {
      if (lang === 'fa') {
        dateStr = now.toLocaleDateString('fa-IR', {
          weekday: 'short', day: 'numeric', month: 'short'
        });
        timeStr = now.toLocaleTimeString('fa-IR', {
          hour: '2-digit', minute: '2-digit', hour12: false
        });
      } else if (lang === 'ar') {
        dateStr = now.toLocaleDateString('ar-EG', {
          weekday: 'short', day: 'numeric', month: 'short'
        });
        timeStr = now.toLocaleTimeString('ar-EG', {
          hour: '2-digit', minute: '2-digit', hour12: false
        });
      } else if (lang === 'de') {
        dateStr = now.toLocaleDateString('de-DE', {
          weekday: 'short', day: 'numeric', month: 'short'
        });
        timeStr = now.toLocaleTimeString('de-DE', {
          hour: '2-digit', minute: '2-digit', hour12: false
        });
      } else {
        dateStr = now.toLocaleDateString('en-US', {
          weekday: 'short', day: 'numeric', month: 'short'
        });
        timeStr = now.toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit', hour12: false
        });
      }
    } catch (_) {
      dateStr = now.toDateString();
      timeStr = pad(now.getHours()) + ':' + pad(now.getMinutes());
    }

    return { dateStr, timeStr };
  }

  function tick() {
    if (!el) return;
    const { dateStr, timeStr } = format();
    el.innerHTML = `
      <span class="clock-date">${dateStr}</span>
      <span class="clock-time">${timeStr}</span>
    `;
  }

  function init() {
    el = document.getElementById('liveClock');
    if (!el) return;
    tick();
    interval = setInterval(tick, 1000);

    document.addEventListener('diamond:langchange', tick);
  }

  D.clock = { init };
})();