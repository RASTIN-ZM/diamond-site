/* ============================================================
   SOUNDS — صداهای UI با Web Audio API (بدون فایل صوتی)
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const KEY = 'diamond_sound_enabled';

  let enabled = false;
  let audioCtx = null;

  function getCtx() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (_) { return null; }
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function tone(freq, duration = 0.08, volume = 0.06, type = 'sine') {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  function hover()    { tone(880, 0.04, 0.025, 'sine'); }
  function click()    { tone(1320, 0.06, 0.05, 'triangle'); setTimeout(() => tone(1760, 0.05, 0.03), 40); }
  function success()  { tone(660, 0.08, 0.05); setTimeout(() => tone(880, 0.08, 0.05), 80); setTimeout(() => tone(1320, 0.12, 0.05), 160); }
  function error()    { tone(220, 0.15, 0.06, 'sawtooth'); }
  function transition() { tone(440, 0.15, 0.04); setTimeout(() => tone(880, 0.15, 0.04), 80); setTimeout(() => tone(1320, 0.2, 0.05), 160); }
  function achievement() {
    [523, 659, 784, 1046].forEach((f, i) => {
      setTimeout(() => tone(f, 0.15, 0.06, 'triangle'), i * 100);
    });
  }

  function bind() {
    // Hover on buttons and links
    document.addEventListener('mouseover', e => {
      if (e.target.closest('.btn, .magnetic, .nav-links a, .theme-toggle, .admin-toggle, .lang-switch button'))
        hover();
    });

    // Click on buttons
    document.addEventListener('click', e => {
      if (e.target.closest('button, .btn, .magnetic, .nav-links a'))
        click();
    });
  }

  function updateButton() {
    const btn = document.getElementById('soundToggle');
    if (!btn) return;
    btn.classList.toggle('active', enabled);
    btn.textContent = enabled ? '🔊' : '🔇';
    btn.title = enabled ? 'Sound: ON' : 'Sound: OFF';
  }

  function toggle() {
    enabled = !enabled;
    try { localStorage.setItem(KEY, enabled ? '1' : '0'); } catch(_) {}
    updateButton();
    if (enabled) success();
  }

  function init() {
    try { enabled = localStorage.getItem(KEY) === '1'; } catch(_) { enabled = false; }
    updateButton();

    const btn = document.getElementById('soundToggle');
    if (btn) btn.addEventListener('click', toggle);

    bind();
  }

  D.sounds = { init, hover, click, success, error, transition, achievement, isEnabled: () => enabled };
})();