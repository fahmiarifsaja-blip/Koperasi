# Projek Web Koperasi Warga Lima Sejahtera

Fitur:
- Input Kantin, Retail, Simpanan, Pinjaman
- Report Kantin, Retail, Simpanan, Pinjaman sesuai format gambar
- Export Excel dari masing-masing report
- Siap Cloudflare Pages + D1

## Cara pasang di Cloudflare
1. Buat D1 Database, contoh: `koperasi_db`.
2. Jalankan isi `schema.sql` di menu D1 > Console.
3. Upload folder ini ke GitHub.
4. Cloudflare Pages > Create Project dari GitHub.
5. Settings > Functions > D1 database bindings:
   - Variable name: `DB`
   - Database: pilih `koperasi_db`
6. Deploy.

Catatan: ubah `database_id` di `wrangler.toml` kalau deploy memakai Wrangler CLI.
