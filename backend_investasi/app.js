const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Serve file statis (frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Koneksi database SQLite
const db = new sqlite3.Database('./investasi.db', (err) => {
  if (err) {
    console.error('Gagal membuka database:', err.message);
  } else {
    console.log('Terhubung ke database SQLite.');
  }
});

// Buat tabel investments jika belum ada
db.run(`CREATE TABLE IF NOT EXISTS investments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
)`);

// Endpoint dapatkan daftar investasi
app.get('/api/investments', (req, res) => {
  db.all('SELECT * FROM investments ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal mengambil data investasi' });
    }
    res.json(rows);
  });
});

// Endpoint tambah investasi
app.post('/api/investments', (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Nama investasi wajib diisi' });
  }

  const query = 'INSERT INTO investments (name) VALUES (?)';
  db.run(query, [name.trim()], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint')) {
        return res.status(409).json({ error: 'Investasi sudah ada' });
      }
      return res.status(500).json({ error: 'Gagal menambahkan investasi' });
    }
    res.status(201).json({ id: this.lastID, name: name.trim() });
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
