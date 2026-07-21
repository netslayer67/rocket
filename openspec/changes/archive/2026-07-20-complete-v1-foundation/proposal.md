## Why

V1 sudah memiliki alur domain dasar, tetapi belum memiliki kontrak proyek yang tahan lama, pemeriksaan batas ukuran file, atau dashboard yang cukup jelas untuk dipakai sebagai studio narasi. Menyelesaikan fondasi sekarang mencegah fitur V2 menambah kompleksitas pada alur yang belum tervalidasi.

## What Changes

- Tambahkan dokumen konteks proyek, aturan pemeliharaan, dan pemeriksaan otomatis maksimal 200 baris per file kode.
- Inisialisasi OpenSpec untuk perubahan berikutnya dan gunakan aturan Ponytail sebagai prinsip implementasi minimal.
- Pecah dashboard menjadi komponen kecil serta terapkan tata letak Tailwind yang jelas, responsif, dan aksesibel.
- Perjelas state alur persona → knowledge → narrative → approval tanpa mengubah batas publish manual.

## Capabilities

### New Capabilities

- `project-governance`: Konteks teknik, workflow OpenSpec, batas ukuran file, dan perintah verifikasi yang konsisten.
- `narrative-studio-ui`: Dashboard Tailwind untuk membuat dan meninjau artefak V1 secara terpandu.

### Modified Capabilities

- Tidak ada.

## Impact

Mempengaruhi dokumentasi root, konfigurasi OpenSpec, skrip npm, dan `apps/web`. Tidak ada perubahan API publik, skema MongoDB, model AI, atau kemampuan publish otomatis.
