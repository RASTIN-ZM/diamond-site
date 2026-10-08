/* ============================================================
   EASTER EGGS — کد Konami، کلیک لوگو، کلمه‌ی جادویی
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;

  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIdx = 0;
  let logoClicks = 0;
  let logoClickTimer = null;
  let secretBuffer = '';

  // ===== Rainbow Mode =====
  function activateRainbow() {
    document.documentElement.classList.add('rainbow-mode');
    D.utils.toast('🌈 Rainbow Mode Activated!', 'success');
    D.sounds && D.sounds.achievement && D.sounds.achievement();

    setTimeout(() => {
      document.documentElement.classList.remove('rainbow-mode');
      D.utils.toast('Rainbow Mode Ended', '');
    }, 10000);
  }

  // ===== Secret Message =====
  function showSecretMessage() {
    const overlay = document.createElement('div');
    overlay.className = 'ee-overlay';
    overlay.innerHTML = `
      <div class="ee-content">
        <div class="ee-gem">💎</div>
        <h2>You Found the Secret!</h2>
        <p>Welcome to the inner circle of DIAMOND. ✨</p>
        <button class="btn btn-primary" onclick="this.closest('.ee-overlay').remove()">Close</button>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));
    D.sounds && D.sounds.achievement && D.sounds.achievement();
  }

  // ===== Confetti =====
  function confetti() {
    const colors = ['#ff4d4d', '#ff8c42', '#ffc93c', '#4ade80', '#22d3ee', '#3b82f6', '#b026ff'];
    for (let i = 0; i < 60; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDelay = Math.random() * 0.3 + 's';
      el.style.animationDuration = (2 + Math.random() * 2) + 's';
      const size = 6 + Math.random() * 8;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }
  }

  // ===== Konami code =====
  function handleKonami(key) {
    const expected = KONAMI[konamiIdx];
    if (key === expected || key.toLowerCase() === expected) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0;
        activateRainbow();
        D.achievements && D.achievements.unlock('konami');
      }
    } else {
      konamiIdx = 0;
    }
  }

  // ===== Logo click =====
  function handleLogoClick() {
    logoClicks++;
    clearTimeout(logoClickTimer);
    logoClickTimer = setTimeout(() => { logoClicks = 0; }, 1500);

    if (logoClicks >= 5) {
      logoClicks = 0;
      showSecretMessage();
      D.achievements && D.achievements.unlock('secret');
    }
  }

  // ===== Secret word typing =====
  function handleTyping(key) {
    if (key.length !== 1) return;
    secretBuffer = (secretBuffer + key.toLowerCase()).slice(-10);

    if (secretBuffer.includes('diamond')) {
      secretBuffer = '';
      confetti();
      D.utils.toast('💎 Confetti!', 'success');
      D.achievements && D.achievements.unlock('confetti');
    } else if (secretBuffer.includes('party')) {
      secretBuffer = '';
      confetti();
      setTimeout(confetti, 400);
      setTimeout(confetti, 800);
      D.achievements && D.achievements.unlock('party');
    } else if (secretBuffer.includes('matrix')) {
      secretBuffer = '';
      activateMatrixRain();
      D.achievements && D.achievements.unlock('matrix');
    }
  }

  // ===== Matrix rain (فقط ۳ ثانیه) =====
  function activateMatrixRain() {
    D.utils.toast('🟢 Matrix Mode!', 'success');
    const canvas = document.createElement('canvas');
    canvas.className = 'matrix-canvas';
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    document.body.appendChild(canvas);

    const c = canvas.getContext('2d');
    const cols = Math.floor(canvas.width / 16);
    const drops = new Array(cols).fill(1);
    const chars = 'アカサタナハマヤラワ0123456789';
    let frames = 0;

    (function draw() {
      frames++;
      c.fillStyle = 'rgba(0, 0, 0, 0.08)';
      c.fillRect(0, 0, canvas.width, canvas.height);
      c.fillStyle = '#39ff14';
      c.font = '14px monospace';
      for (let i = 0; i < drops.length; i++) {
        const txt = chars[Math.floor(Math.random() * chars.length)];
        c.fillText(txt, i * 16, drops[i] * 16);
        if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      if (frames < 180) requestAnimationFrame(draw);
      else canvas.remove();
    })();
  }

  function init() {
    // کلیدها
    document.addEventListener('keydown', e => {
      handleKonami(e.key);
      handleTyping(e.key);
    });

    // کلیک روی لوگو
    document.querySelectorAll('.brand-logo, .hero-logo').forEach(el => {
      el.addEventListener('click', handleLogoClick);
    });

    console.log('%c🥚 Easter eggs ready — try Konami code!', 'color:#ffc93c;');
  }

  D.easterEggs = { init, activateRainbow, confetti };
})();