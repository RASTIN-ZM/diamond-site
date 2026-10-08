/* ============================================================
   TOOLS — ماشین‌حساب، تولید رمز، QR Code، رنگ
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;

  // ===== Calculator =====
  function initCalculator() {
    const grid = document.getElementById('calcGrid');
    const display = document.getElementById('calcDisplay');
    if (!grid || !display) return;

    let current = '0';
    let prev = null;
    let op = null;
    let reset = false;

    const buttons = [
      'C', '±', '%', '÷',
      '7', '8', '9', '×',
      '4', '5', '6', '−',
      '1', '2', '3', '+',
      '0', '.', '='
    ];

    buttons.forEach(label => {
      const b = document.createElement('button');
      b.className = 'calc-btn';
      if (['÷','×','−','+','='].includes(label)) b.classList.add('op');
      if (['C','±','%'].includes(label)) b.classList.add('fn');
      if (label === '=') b.classList.add('eq');
      if (label === '0') b.classList.add('zero');
      b.textContent = label;
      b.addEventListener('click', () => handle(label));
      grid.appendChild(b);
    });

    function updateDisplay() {
      display.textContent = current;
    }

    function handle(label) {
      D.sounds && D.sounds.click && D.sounds.click();

      if (label === 'C') {
        current = '0'; prev = null; op = null; reset = false;
      } else if (label === '±') {
        current = current.startsWith('-') ? current.slice(1) : '-' + current;
      } else if (label === '%') {
        current = (parseFloat(current) / 100).toString();
      } else if (['÷','×','−','+'].includes(label)) {
        if (op && !reset) calculate();
        prev = parseFloat(current);
        op = label;
        reset = true;
      } else if (label === '=') {
        calculate();
        op = null; prev = null;
      } else if (label === '.') {
        if (reset) { current = '0'; reset = false; }
        if (!current.includes('.')) current += '.';
      } else {
        if (reset) { current = label; reset = false; }
        else current = current === '0' ? label : current + label;
      }
      updateDisplay();
    }

    function calculate() {
      if (op === null || prev === null) return;
      const cur = parseFloat(current);
      let result = 0;
      switch (op) {
        case '+': result = prev + cur; break;
        case '−': result = prev - cur; break;
        case '×': result = prev * cur; break;
        case '÷': result = cur === 0 ? 0 : prev / cur; break;
      }
      current = parseFloat(result.toFixed(10)).toString();
      reset = true;
    }

    updateDisplay();
  }

  // ===== Password Generator =====
  function initPasswordGen() {
    const btn = document.getElementById('pwGenBtn');
    const out = document.getElementById('pwOutput');
    const len = document.getElementById('pwLength');
    const lenVal = document.getElementById('pwLengthVal');
    const copy = document.getElementById('pwCopy');
    if (!btn || !out) return;

    if (len && lenVal) {
      len.addEventListener('input', () => { lenVal.textContent = len.value; });
    }

    btn.addEventListener('click', () => {
      const length = parseInt(len.value) || 16;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
      let pw = '';
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      for (let i = 0; i < length; i++) {
        pw += chars[arr[i] % chars.length];
      }
      out.value = pw;
      D.sounds && D.sounds.success && D.sounds.success();
    });

    if (copy) {
      copy.addEventListener('click', () => {
        out.select();
        document.execCommand('copy');
        D.utils.toast('✓ Copied!', 'success');
      });
    }
  }

  // ===== QR Code =====
  function initQR() {
    const input = document.getElementById('qrInput');
    const btn = document.getElementById('qrBtn');
    const img = document.getElementById('qrImage');
    const wrap = document.getElementById('qrResult');
    if (!input || !btn || !img) return;

    btn.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) { D.utils.toast('متن رو وارد کن', 'error'); return; }
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
      img.src = url;
      if (wrap) wrap.style.display = 'block';
      D.sounds && D.sounds.success && D.sounds.success();
    });
  }

  // ===== Color Picker =====
  function initColorPicker() {
    const input = document.getElementById('colorInput');
    const preview = document.getElementById('colorPreview');
    const hexOut = document.getElementById('colorHex');
    const rgbOut = document.getElementById('colorRgb');
    const hslOut = document.getElementById('colorHsl');
    if (!input || !preview) return;

    function update() {
      const hex = input.value;
      preview.style.background = hex;
      const r = parseInt(hex.slice(1,3), 16);
      const g = parseInt(hex.slice(3,5), 16);
      const b = parseInt(hex.slice(5,7), 16);
      const max = Math.max(r,g,b), min = Math.min(r,g,b);
      let h = 0, s = 0, l = (max + min) / 2 / 255;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
      }
      if (hexOut) hexOut.value = hex.toUpperCase();
      if (rgbOut) rgbOut.value = `rgb(${r}, ${g}, ${b})`;
      if (hslOut) hslOut.value = `hsl(${Math.round(h)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
    }

    input.addEventListener('input', update);
    update();
  }

  function init() {
    initCalculator();
    initPasswordGen();
    initQR();
    initColorPicker();
    console.log('%c🛠️ Tools ready', 'color:#4ade80;');
  }

  D.tools = { init };
})();