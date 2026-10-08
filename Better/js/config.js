/* ============================================================
   CONFIG — تنظیمات کلی پروژه
   ============================================================ */

window.Diamond = window.Diamond || {};

window.Diamond.config = {
  // کلیدهای ذخیره‌سازی تو مرورگر
  KEYS: {
    POSTS:     'diamond_posts_v1',
    GAMES:     'diamond_games_v1',
    USER:      'diamond_user_v1',
    PASS_HASH: 'diamond_passhash_v1',
    AUTH:      'diamond_auth_v1',
    LANG:      'diamond_lang',
    THEME:     'diamond_theme'
  },

  // اطلاعات پیش‌فرض ادمین
  DEFAULT_USER: 'admin',
  DEFAULT_PASS: 'diamond2024',

  // زبان‌های راست‌به‌چپ
  RTL_LANGS: ['fa', 'ar'],

  // مسیرهای جایگزین برای لوگوی اصلی
  LOGO_FALLBACKS: [
    'assets/logo.png',
    'assets/logo.jpg',
    'assets/logo.jpeg',
    'assets/logo.webp',
    'assets/logo.svg',
    'logo.png',
    'logo.jpg',
    'logo.svg',
    'images/logo.png',
    'img/logo.png'
  ],

  // مسیرهای جایگزین برای لوگوی گیمینگ
  GAMING_LOGO_FALLBACKS: [
    'assets/logo-gaming.png',
    'assets/logo-gaming.jpg',
    'assets/logo-gaming.webp',
    'assets/logo-gaming.svg',
    'logo-gaming.png',
    'logo-gaming.jpg',
    'images/logo-gaming.png'
  ],

  // مسیرهای جایگزین برای لوگوی علم
  SCIENCE_LOGO_FALLBACKS: [
    'assets/logo-science.png',
    'assets/logo-science.jpg',
    'assets/logo-science.jpeg',
    'assets/logo-science.webp',
    'assets/logo-science.svg',
    'logo-science.png',
    'logo-science.jpg',
    'logo-science.svg',
    'images/logo-science.png',
    'img/logo-science.png'
  ]
};

console.log('%c💎 DIAMOND config loaded', 'color:#ff8c42;font-weight:bold;');