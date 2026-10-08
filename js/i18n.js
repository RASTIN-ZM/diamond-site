/* ============================================================
   I18N — چندزبانه (EN / FA / AR / DE)
   ============================================================ */

window.Diamond = window.Diamond || {};

(function() {
  const D = window.Diamond;
  const RTL = D.config.RTL_LANGS;

  const translations = {
    en: {
      nav_home:'Home', nav_about:'About', nav_projects:'Projects', nav_games:'Games',
      nav_science:'Science', nav_tools:'Tools', nav_blog:'Blog', nav_contact:'Contact',
      hero_sub:'A personal space, crafted with light.',
      cta_explore:'Explore', cta_contact:'Get in touch',
      about_title:'About',
      about_c1_t:'Design', about_c1_d:'Minimal, modern and crafted pixel by pixel.',
      about_c2_t:'Code',   about_c2_d:'Clean, fast and built with pure web tech.',
      about_c3_t:'Motion', about_c3_d:'Every interaction feels alive and smooth.',
      proj_title:'Projects',
      proj_1:'Project One',   proj_1_d:'Short description here.',
      proj_2:'Project Two',   proj_2_d:'Short description here.',
      proj_3:'Project Three', proj_3_d:'Short description here.',
      blog_title:'Blog', search_ph:'Search posts...', blog_empty:'No posts yet. Stay tuned!',
      games_title:'Games', games_hero_t:'Enter the Game World',
      games_hero_d:'Discover, download and play — free or premium.',
      search_game_ph:'Search games...', games_empty:'No games yet. Coming soon!',
      science_title:'Science',
      science_hero_t:'Enter the Science World',
      science_hero_d:'Learn, practice and explore — grade 8.',
      science_quiz_title:'Quizzes',
      coming_soon:'COMING SOON',
      coming_soon_d:"We're working on something amazing. Stay tuned!",
      back_home:'← Back to Home',
      tools_title:'Tools',
      contact_title:'Contact',
      name:'Your name', email:'Your email', message:'Your message',
      send:'Send', sent:'Message sent ✓',
      admin_login:'Admin Login', admin_panel:'Admin Panel',
      username:'Username', password:'Password', login_btn:'Login', logout:'Logout',
      post_title:'Post title', post_cover:'Cover image URL (optional)',
      post_tags:'Tags (comma separated)', post_content:'Write your post...',
      game_name:'Game name', game_cover:'Cover image URL',
      game_download:'Download page URL', game_free_label:'Free game',
      game_price:'Price (e.g. $9.99)', game_tags:'Tags (comma separated: Action, RPG...)',
      game_desc:'Short description...', your_games:'Your games',
      your_posts:'Your posts', download_now:'Download Now', free:'FREE',
      publish:'Publish', cancel:'Cancel',
      read_more:'Read more', min_read:'min read',
      tab_posts:'📝 Posts', tab_games:'🎮 Games', tab_security:'🔐 Security',
      tab_resources:'📚 Resources',
      change_creds:'Change credentials', new_username:'New username',
      current_password:'Current password', new_password:'New password (empty = keep)',
      confirm_password:'Confirm new password', save_changes:'Save changes',
      danger_zone:'⚠ Danger zone', reset_all:'Reset all data'
    },
    fa: {
      nav_home:'خانه', nav_about:'درباره', nav_projects:'پروژه‌ها', nav_games:'بازی‌ها',
      nav_science:'علم', nav_tools:'ابزارها', nav_blog:'بلاگ', nav_contact:'تماس',
      hero_sub:'یک فضای شخصی، ساخته‌شده با نور.',
      cta_explore:'کاوش کن', cta_contact:'تماس بگیر',
      about_title:'درباره',
      about_c1_t:'طراحی', about_c1_d:'مینیمال، مدرن و پیکسل به پیکسل.',
      about_c2_t:'کد',    about_c2_d:'تمیز، سریع و با وب خالص.',
      about_c3_t:'حرکت',  about_c3_d:'هر تعامل، زنده و روان.',
      proj_title:'پروژه‌ها',
      proj_1:'پروژه یک',   proj_1_d:'توضیح کوتاه اینجا.',
      proj_2:'پروژه دو',   proj_2_d:'توضیح کوتاه اینجا.',
      proj_3:'پروژه سه',   proj_3_d:'توضیح کوتاه اینجا.',
      blog_title:'بلاگ', search_ph:'جستجوی پست...', blog_empty:'هنوز پستی نیست.',
      games_title:'بازی‌ها', games_hero_t:'به دنیای بازی وارد شو',
      games_hero_d:'کشف کن، دانلود کن و بازی کن — رایگان یا ویژه.',
      search_game_ph:'جستجوی بازی...', games_empty:'هنوز بازی‌ای نیست.',
      science_title:'علم',
      science_hero_t:'به دنیای علم وارد شو',
      science_hero_d:'یاد بگیر، تمرین کن و کاوش کن — پایه هشتم.',
      science_quiz_title:'آزمون‌های تستی',
      coming_soon:'به‌زودی',
      coming_soon_d:'داریم روی یه چیز فوق‌العاده کار می‌کنیم. منتظر بمانید!',
      back_home:'← بازگشت به خانه',
      tools_title:'ابزارها',
      contact_title:'تماس',
      name:'نام شما', email:'ایمیل شما', message:'پیام شما',
      send:'ارسال', sent:'ارسال شد ✓',
      admin_login:'ورود ادمین', admin_panel:'پنل ادمین',
      username:'نام کاربری', password:'رمز عبور', login_btn:'ورود', logout:'خروج',
      post_title:'عنوان پست', post_cover:'آدرس تصویر کاور (اختیاری)',
      post_tags:'برچسب‌ها (با کاما)', post_content:'پستت رو بنویس...',
      game_name:'اسم بازی', game_cover:'آدرس عکس بازی',
      game_download:'لینک صفحه دانلود', game_free_label:'بازی رایگان',
      game_price:'قیمت (مثلاً ۴۹,۰۰۰ تومان)', game_tags:'ژانرها (اکشن، RPG...)',
      game_desc:'توضیح کوتاه...', your_games:'بازی‌های شما',
      your_posts:'پست‌های شما', download_now:'همین حالا دانلود کن', free:'رایگان',
      publish:'انتشار', cancel:'لغو',
      read_more:'ادامه', min_read:'دقیقه مطالعه',
      tab_posts:'📝 پست‌ها', tab_games:'🎮 بازی‌ها', tab_security:'🔐 امنیت',
      tab_resources:'📚 منابع',
      change_creds:'تغییر اطلاعات ورود', new_username:'نام کاربری جدید',
      current_password:'رمز فعلی', new_password:'رمز جدید (خالی = بدون تغییر)',
      confirm_password:'تأیید رمز جدید', save_changes:'ذخیره تغییرات',
      danger_zone:'⚠ منطقه خطر', reset_all:'پاک کردن همه اطلاعات'
    },
    ar: {
      nav_home:'الرئيسية', nav_about:'نبذة', nav_projects:'المشاريع', nav_games:'الألعاب',
      nav_science:'العلم', nav_tools:'الأدوات', nav_blog:'المدونة', nav_contact:'تواصل',
      hero_sub:'مساحة شخصية، مصنوعة من الضوء.',
      cta_explore:'استكشف', cta_contact:'تواصل معي',
      about_title:'نبذة',
      about_c1_t:'التصميم', about_c1_d:'بسيط وحديث بكسل بكسل.',
      about_c2_t:'الكود',   about_c2_d:'نظيف وسريع بتقنيات الويب.',
      about_c3_t:'الحركة',  about_c3_d:'كل تفاعل يبدو حياً.',
      proj_title:'المشاريع',
      proj_1:'المشروع الأول',  proj_1_d:'وصف قصير.',
      proj_2:'المشروع الثاني', proj_2_d:'وصف قصير.',
      proj_3:'المشروع الثالث', proj_3_d:'وصف قصير.',
      blog_title:'المدونة', search_ph:'ابحث...', blog_empty:'لا توجد مقالات.',
      games_title:'الألعاب', games_hero_t:'ادخل عالم الألعاب',
      games_hero_d:'اكتشف، حمّل والعب — مجاناً أو مميز.',
      search_game_ph:'ابحث عن لعبة...', games_empty:'لا توجد ألعاب.',
      science_title:'العلم',
      science_hero_t:'ادخل عالم العلم',
      science_hero_d:'تعلّم، تدرّب واستكشف — الصف الثامن.',
      science_quiz_title:'الاختبارات',
      coming_soon:'قريباً',
      coming_soon_d:'نعمل على شيء مذهل. ابقَ متابعاً!',
      back_home:'← العودة للرئيسية',
      tools_title:'الأدوات',
      contact_title:'تواصل',
      name:'اسمك', email:'بريدك', message:'رسالتك',
      send:'إرسال', sent:'تم الإرسال ✓',
      admin_login:'دخول المشرف', admin_panel:'لوحة الإدارة',
      username:'المستخدم', password:'كلمة المرور', login_btn:'دخول', logout:'خروج',
      post_title:'عنوان المقال', post_cover:'رابط صورة الغلاف',
      post_tags:'الوسوم', post_content:'اكتب مقالك...',
      game_name:'اسم اللعبة', game_cover:'رابط صورة اللعبة',
      game_download:'رابط التحميل', game_free_label:'لعبة مجانية',
      game_price:'السعر', game_tags:'الأنواع',
      game_desc:'وصف قصير...', your_games:'ألعابك',
      your_posts:'مقالاتك', download_now:'حمّل الآن', free:'مجاناً',
      publish:'نشر', cancel:'إلغاء',
      read_more:'اقرأ المزيد', min_read:'دقيقة قراءة',
      tab_posts:'📝 المقالات', tab_games:'🎮 الألعاب', tab_security:'🔐 الأمان',
      tab_resources:'📚 المصادر',
      change_creds:'تغيير بيانات الدخول', new_username:'اسم مستخدم جديد',
      current_password:'كلمة المرور الحالية', new_password:'جديدة (اتركها فارغة)',
      confirm_password:'تأكيد', save_changes:'حفظ',
      danger_zone:'⚠ منطقة الخطر', reset_all:'حذف كل البيانات'
    },
    de: {
      nav_home:'Start', nav_about:'Über', nav_projects:'Projekte', nav_games:'Spiele',
      nav_science:'Wissenschaft', nav_tools:'Werkzeuge', nav_blog:'Blog', nav_contact:'Kontakt',
      hero_sub:'Ein persönlicher Raum, aus Licht gemacht.',
      cta_explore:'Entdecken', cta_contact:'Kontakt',
      about_title:'Über',
      about_c1_t:'Design', about_c1_d:'Minimal, modern, Pixel für Pixel.',
      about_c2_t:'Code',   about_c2_d:'Sauber und schnell.',
      about_c3_t:'Motion', about_c3_d:'Jede Interaktion lebendig.',
      proj_title:'Projekte',
      proj_1:'Projekt Eins',  proj_1_d:'Kurze Beschreibung.',
      proj_2:'Projekt Zwei',  proj_2_d:'Kurze Beschreibung.',
      proj_3:'Projekt Drei',  proj_3_d:'Kurze Beschreibung.',
      blog_title:'Blog', search_ph:'Suchen...', blog_empty:'Noch keine Beiträge.',
      games_title:'Spiele', games_hero_t:'Betritt die Spielwelt',
      games_hero_d:'Entdecken, herunterladen und spielen.',
      search_game_ph:'Spiele suchen...', games_empty:'Noch keine Spiele.',
      science_title:'Wissenschaft',
      science_hero_t:'Betritt die Wissenschaftswelt',
      science_hero_d:'Lernen, üben und entdecken — Klasse 8.',
      science_quiz_title:'Quizze',
      coming_soon:'BALD',
      coming_soon_d:'Wir arbeiten an etwas Erstaunlichem. Bleib dran!',
      back_home:'← Zurück zur Startseite',
      tools_title:'Werkzeuge',
      contact_title:'Kontakt',
      name:'Dein Name', email:'E-Mail', message:'Nachricht',
      send:'Senden', sent:'Gesendet ✓',
      admin_login:'Admin-Login', admin_panel:'Admin-Panel',
      username:'Benutzername', password:'Passwort', login_btn:'Anmelden', logout:'Abmelden',
      post_title:'Titel', post_cover:'Cover-URL',
      post_tags:'Tags', post_content:'Beitrag schreiben...',
      game_name:'Spielname', game_cover:'Cover-URL',
      game_download:'Download-URL', game_free_label:'Gratis',
      game_price:'Preis', game_tags:'Tags',
      game_desc:'Beschreibung...', your_games:'Deine Spiele',
      your_posts:'Deine Beiträge', download_now:'Herunterladen', free:'GRATIS',
      publish:'Veröffentlichen', cancel:'Abbrechen',
      read_more:'Weiterlesen', min_read:'Min. Lesezeit',
      tab_posts:'📝 Beiträge', tab_games:'🎮 Spiele', tab_security:'🔐 Sicherheit',
      tab_resources:'📚 Ressourcen',
      change_creds:'Zugangsdaten ändern', new_username:'Neuer Benutzername',
      current_password:'Aktuelles Passwort', new_password:'Neues (leer = behalten)',
      confirm_password:'Bestätigen', save_changes:'Speichern',
      danger_zone:'⚠ Gefahr', reset_all:'Alles löschen'
    }
  };

  let currentLang = 'en';

  function t(key) {
    return (translations[currentLang] && translations[currentLang][key])
        || translations.en[key]
        || key;
  }

  function setLang(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL.includes(lang) ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (translations[lang][k]) el.textContent = translations[lang][k];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const k = el.dataset.i18nPh;
      if (translations[lang][k]) el.placeholder = translations[lang][k];
    });
    document.querySelectorAll('.lang-switch button').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    D.storage.setLang(lang);

    document.dispatchEvent(new CustomEvent('diamond:langchange', { detail: { lang } }));
  }

  function getLang() { return currentLang; }

  function init() {
    const saved = D.storage.getLang()
      || (navigator.language && navigator.language.startsWith('fa') ? 'fa' : 'en');
    setLang(saved);

    document.querySelectorAll('.lang-switch button').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });
  }

  D.i18n = { t, setLang, getLang, init, translations };
})();