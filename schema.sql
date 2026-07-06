CREATE TABLE IF NOT EXISTS members (
  nomor TEXT PRIMARY KEY,
  nama TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS kantin_retail (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jenis TEXT NOT NULL CHECK (jenis IN ('kantin','retail')),
  tanggal TEXT NOT NULL,
  nomor_anggota TEXT NOT NULL,
  nama_anggota TEXT NOT NULL,
  barang TEXT NOT NULL,
  jumlah INTEGER NOT NULL DEFAULT 1,
  harga_dasar INTEGER NOT NULL DEFAULT 0,
  harga_jual INTEGER NOT NULL DEFAULT 0,
  jasa INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS simpanan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jenis TEXT NOT NULL CHECK (jenis IN ('wajib','sukarela','idulfitri')),
  nomor_anggota TEXT NOT NULL,
  nama_anggota TEXT NOT NULL,
  bulan INTEGER NOT NULL,
  tahun INTEGER NOT NULL,
  jumlah INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pinjaman (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jenis_pinjaman TEXT NOT NULL CHECK (jenis_pinjaman IN ('reguler','insidental')),
  nomor_anggota TEXT NOT NULL,
  nama_anggota TEXT NOT NULL,
  bulan INTEGER NOT NULL,
  tahun INTEGER NOT NULL,
  cicilan INTEGER NOT NULL DEFAULT 0,
  jenis_jasa TEXT NOT NULL CHECK (jenis_jasa IN ('jasa_reguler','jasa_insidental')),
  jumlah_jasa INTEGER NOT NULL DEFAULT 0,
  jenis_provisi TEXT NOT NULL CHECK (jenis_provisi IN ('provisi_reguler','provisi_insidental')),
  jumlah_provisi INTEGER NOT NULL DEFAULT 0,
  sisa_pinjaman INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
