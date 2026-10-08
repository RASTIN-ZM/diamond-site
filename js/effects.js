/* ============================================================
   EFFECTS — بهینه‌شده
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const { $$ } = D.utils;

  const isMobile = () => window.matchMedia('(max-width: 768px), (hover: none)').matches;

  // ===== Text Scramble =====
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const oldText = this.el.textContent || '';
      const length = Math.max(oldText.length, newText.length);
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to   = newText[i] || '';
        const start = Math.floor(Math.random() * 25);
        const end   = start + Math.floor(Math.random() * 25);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
    }
    update() {
      let output = '', complete = 0;
      for (let i = 0; i < this.queue.length; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) { complete++; output += to; }
        else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.queue[i].char = char;
          }
          output += `<span class="dud">${char}</span>`;
        } else output += from;
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) return;
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  function initScramble() {
    // روی موبایل همون متن رو نشون بده، بدون انیمیشن
    if (isMobile()) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const text = el.textContent;
          const fx = new TextScramble(el);
          fx.setText(text);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    $$('[data-scramble]').forEach(el => io.observe(el));
  }

  // ===== 3D Tilt — فقط دسکتاپ، فقط کارت‌های visible =====
  function bindTilt(scope = document) {
    if (isMobile()) return;  // موبایل: کلاً خاموش

    $$('.tilt', scope).forEach(card => {
      if (card._tiltBound) return;
      card._tiltBound = true;

      let raf = null;
      let isVisible = false;

      // فقط وقتی کارت تو viewport هست، event گوش بده
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { isVisible = e.isIntersecting; });
      }, { threshold: 0 });
      io.observe(card);

      card.addEventListener('mousemove', e => {
        if (!isVisible || raf) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        raf = requestAnimationFrame(() => {
          card.style.transform =
            `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
          raf = null;
        });
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        card.style.transform = '';
      });
    });
  }

  // ===== Magnetic =====
  function initMagnetic() {
    if (isMobile()) return;
    $$('.magnetic').forEach(el => {
      let raf = null;
      el.addEventListener('mousemove', e => {
        if (raf) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top  - r.height / 2;
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
          raf = null;
        });
      }, { passive: true });
      el.addEventListener('mouseleave', () => {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        el.style.transform = '';
      });
    });
  }

  // ===== Reveal on Scroll =====
  function initReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  }

  // ===== Parallax blobs — بهینه با throttle =====
  function initParallax() {
    // روی موبایل خاموش
    if (isMobile()) return;

    const els = $$('[data-speed]');
    if (!els.length) return;

    let ticking = false;
    let latestY = 0;

    window.addEventListener('scroll', () => {
      latestY = scrollY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          els.forEach(el => {
            el.style.transform = `translate3d(0, ${latestY * parseFloat(el.dataset.speed)}px, 0)`;
          });
          ticking = false;
        });
      }
    }, { passive: true });
  }

  function init() {
    initScramble();
    bindTilt();
    initMagnetic();
    initReveal();
    initParallax();
  }

  D.effects = { init, bindTilt, TextScramble };
})();