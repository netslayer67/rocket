# Rocket Project crawler

Crawler ini adalah alat operator manual, bukan fitur dashboard. Gunakan hanya untuk halaman publik yang Anda berhak ambil dan yang mengizinkan crawling melalui `robots.txt`.

## Scrapy: impor satu halaman publik

1. Jalankan API Rocket (`npm run dev:api`) serta MongoDB yang diperlukannya.
2. Salin `.env.example` menjadi `.env`, lalu sesuaikan bila API tidak berada di `http://localhost:4000`.
3. Buat virtual environment dan pasang paket resmi Scrapy.

```powershell
cd apps/crawler
py -3 -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m rocket_crawler.run --seed https://example.com --source-label "Contoh sumber"
```

Default hanya mengambil satu halaman. Tambahkan `--max-pages 3` untuk mengikuti paling banyak tiga link pada **domain yang persis sama**. Crawler mematuhi `robots.txt`, memakai satu request per domain, AutoThrottle, delay, timeout, batas 1 MB respons, dan menolak URL lokal/pribadi sebelum Scrapy dimulai. Redirect dinonaktifkan agar seed publik tidak dapat berpindah ke target internal.

Teks halaman hanya dikirim sekali ke `POST /knowledge/import`; API yang sudah ada mengekstrak pola melalui AI Orchestrator lalu menyimpan metadata pola dan vector saja. Jangan gunakan output untuk menyalin artikel atau materi berhak cipta.

## Apache Nutch: discovery kandidat URL

Nutch bersifat opsional dan **tidak pernah** diakses dari dashboard/API. Siapkan runtime dari [repository Apache Nutch](https://github.com/apache/nutch) sesuai tutorial resminya; untuk source checkout, `ant runtime` akan membuat runtime lokal. Lalu dari Bash atau WSL:

```bash
export NUTCH_HOME=/path/ke/runtime/local
bash scripts/nutch-discover.sh https://example.com 10
```

Perintah tersebut membuat workspace sementara, membatasi URL pada domain seed, membatasi fetcher ke satu thread, lalu menghapus artifact Nutch ketika proses selesai. Ia hanya mencetak kandidat URL; pilih satu URL sendiri sebelum menjalankan Scrapy. Jangan arahkan Nutch ke login, Threads, Instagram, halaman privat, atau situs yang melarang crawling.

Scrapy dipasang dari proyek resmi [scrapy/scrapy](https://github.com/scrapy/scrapy) melalui `requirements.txt`; tidak ada fork atau scraper browser yang disisipkan ke aplikasi.
