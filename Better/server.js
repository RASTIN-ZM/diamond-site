/* ============================================================
   DIAMOND SERVER — Express Static File Server
   ============================================================ */

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// اعتماد به پروکسی (برای هاست‌های cPanel)
app.set('trust proxy', 1);

// Middleware برای لاگ
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// فایل‌های استاتیک
app.use(express.static(__dirname, {
  extensions: ['html'],
  maxAge: '1d'
}));

// روت اصلی
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// صفحات HTML دیگه
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, page);
  
  // اگه فایل با پسوند نبود، .html اضافه کن
  if (!page.includes('.')) {
    res.sendFile(path.join(__dirname, page + '.html'), (err) => {
      if (err) next();
    });
  } else {
    res.sendFile(filePath, (err) => {
      if (err) next();
    });
  }
});

// 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// خطاها
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ DIAMOND server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
});