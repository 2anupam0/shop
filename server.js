const express = require('express');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PUBLIC_DIR = path.join(__dirname, 'public');

[PUBLIC_DIR, DATA_DIR, UPLOADS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(PUBLIC_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));

app.use(session({
  secret: 'jivan-cake-shop-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.set('view engine', 'ejs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

function readJSON(file) {
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(fp)) return file === 'cakes.json' ? [] : file === 'offers.json' ? { text: '', active: true } : [];
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

function isAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  return res.redirect('/admin/login');
}

// --- Init default admin ---
(async () => {
  let users = readJSON('users.json');
  if (!users.length) {
    const hash = await bcrypt.hash('admin123', 10);
    users = [{ username: 'admin', password: hash }];
    writeJSON('users.json', users);
    console.log('Default admin created: admin / admin123');
  }
})();

// ===== PUBLIC ROUTES =====

app.get('/', (req, res) => {
  const cakes = readJSON('cakes.json');
  const offer = readJSON('offers.json');
  const baseUrl = req.protocol + '://' + req.get('host');
  res.render('index', { cakes: cakes.filter(c => c.featured), offer, baseUrl });
});

app.get('/menu', (req, res) => {
  const cakes = readJSON('cakes.json');
  const cats = [...new Set(cakes.map(c => c.category))];
  const baseUrl = req.protocol + '://' + req.get('host');
  res.render('menu', { cakes, categories: cats, baseUrl });
});

app.get('/contact', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  res.render('contact', { baseUrl });
});

app.get('/api/cakes', (req, res) => {
  const cakes = readJSON('cakes.json');
  res.json(cakes);
});

app.get('/api/offers', (req, res) => {
  res.json(readJSON('offers.json'));
});

// ===== ADMIN AUTH =====

app.get('/admin/login', (req, res) => {
  if (req.session.admin) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readJSON('users.json');
  const user = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.admin = true;
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: 'Invalid credentials' });
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// ===== ADMIN CMS =====

app.get('/admin', isAdmin, (req, res) => {
  const cakes = readJSON('cakes.json');
  const offer = readJSON('offers.json');
  res.render('admin/dashboard', { cakes, offer });
});

app.post('/admin/cakes', isAdmin, upload.single('image'), (req, res) => {
  const cakes = readJSON('cakes.json');
  const maxId = cakes.length ? Math.max(...cakes.map(c => c.id)) : 0;
  const cake = {
    id: maxId + 1,
    name: req.body.name,
    category: req.body.category,
    price: parseFloat(req.body.price) || 0,
    description: req.body.description || '',
    image: req.file ? '/uploads/' + req.file.filename : '',
    featured: req.body.featured === 'on'
  };
  cakes.push(cake);
  writeJSON('cakes.json', cakes);
  res.redirect('/admin');
});

app.post('/admin/cakes/:id', isAdmin, upload.single('image'), (req, res) => {
  let cakes = readJSON('cakes.json');
  const idx = cakes.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.redirect('/admin');
  cakes[idx].name = req.body.name;
  cakes[idx].category = req.body.category;
  cakes[idx].price = parseFloat(req.body.price) || 0;
  cakes[idx].description = req.body.description || '';
  cakes[idx].featured = req.body.featured === 'on';
  if (req.file) cakes[idx].image = '/uploads/' + req.file.filename;
  writeJSON('cakes.json', cakes);
  res.redirect('/admin');
});

app.post('/admin/cakes/:id/delete', isAdmin, (req, res) => {
  let cakes = readJSON('cakes.json');
  cakes = cakes.filter(c => c.id !== parseInt(req.params.id));
  writeJSON('cakes.json', cakes);
  res.redirect('/admin');
});

app.post('/admin/offer', isAdmin, (req, res) => {
  writeJSON('offers.json', { text: req.body.offerText, active: req.body.active === 'on' });
  res.redirect('/admin');
});

app.post('/admin/password', isAdmin, async (req, res) => {
  const { current, newpass } = req.body;
  let users = readJSON('users.json');
  const user = users[0];
  if (user && await bcrypt.compare(current, user.password)) {
    user.password = await bcrypt.hash(newpass, 10);
    writeJSON('users.json', users);
  }
  res.redirect('/admin');
});

app.listen(PORT, () => {
  console.log(`ANUP CAKE SHOP running at http://localhost:${PORT}`);
});
