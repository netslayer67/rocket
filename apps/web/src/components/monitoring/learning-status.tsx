import type { LearningStatus } from '@/lib/types';

const phases: Record<string, string> = {
  starting: 'Menunggu pemeriksaan pertama', disabled: 'Pembelajaran otomatis nonaktif', checking: 'Memeriksa bahan belajar',
  waiting: 'Menunggu bahan baru', synthesizing: 'Menyusun calon DNA', validating: 'Memeriksa dukungan bukti',
  saving: 'Menyimpan DNA', complete: 'DNA baru tersimpan', rejected: 'Calon DNA tidak diterima',
  unavailable: 'Pembelajaran tertunda', backoff: 'Menunggu jadwal percobaan ulang', quota: 'Batas harian tercapai', error: 'Pemeriksaan gagal',
};
const reasons: Record<string, string> = {
  awaiting_check: 'Worker belum menyelesaikan pemeriksaan pertama.', checking_sources: 'Hanya sumber internal yang disetujui yang diperiksa.',
  insufficient_evidence: 'Perlu sedikitnya dua bahan internal yang memenuhi syarat.',
  unchanged_evidence: 'Bahan yang tersedia sudah diperiksa. Tidak ada panggilan AI berulang untuk bahan yang sama.',
  batch_daily_limit: 'Batas dua percobaan untuk bahan ini tercapai hari ini. Worker akan mencoba kembali pada hari UTC berikutnya.',
  retry_later: 'Percobaan berikutnya menunggu jeda minimal 15 menit.', daily_limit: 'Percobaan tersedia kembali pada hari UTC berikutnya.',
  processing_evidence: 'Model gratis sedang merangkum pola dan diagnosis dari bukti internal.',
  checking_candidate: 'Penilaian kedua memeriksa dukungan bukti, kebaruan, dan kontradiksi.',
  saving_knowledge: 'Metadata dan asal bukti sedang disimpan.', no_valid_novel_lesson: 'Belum ditemukan diagnosis baru yang memenuhi syarat.',
  review_rejected: 'Calon DNA belum lolos penilaian kedua dan tidak ditambahkan ke knowledge.',
  sources_changed: 'Sumber berubah saat diproses. Calon DNA tidak disimpan.',
  lesson_saved: 'DNA tersedia untuk pengambilan konteks pada narasi berikutnya.',
  lesson_saved_index_pending: 'DNA tersimpan. Indeks semantik tertunda; pencarian kata kunci tetap tersedia.',
  invalid_model_output: 'Respons model tidak memenuhi format diagnosis yang diperlukan.',
  free_model_unavailable: 'Model gratis atau kredensial belum tersedia. Tidak beralih ke model berbayar.',
  storage_or_index_unavailable: 'Penyimpanan belum berhasil. Percobaan ulang tetap dibatasi.',
  storage_unavailable: 'Worker belum dapat membaca atau menyimpan status ke database.',
  interrupted: 'Percobaan sebelumnya terhenti saat layanan dimulai ulang.',
};

export function LearningStatusPanel({ status }: { status?: LearningStatus }) {
  const phase = status?.enabled ? status.phase : 'disabled';
  const latest = status?.latest;
  return <section className="mt-6 border-b border-slate-800 pb-6" aria-labelledby="learning-title">
    <h2 id="learning-title" className="text-xl font-semibold text-white">Pembelajaran otomatis</h2>
    <p className="mt-2 text-base font-medium text-cyan-200" role="status" aria-live="polite">
      {status ? phases[phase] ?? phase : 'Status worker belum tersedia dari API'}
    </p>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
      {!status ? 'Status koneksi saja tidak membuktikan bahwa proses belajar sudah berjalan.'
        : !status.enabled ? 'Worker perlu diaktifkan pada API Railway. Membuka halaman ini tidak menjalankan pembelajaran.'
          : reasons[status.reason] ?? status.reason}
    </p>
    {status && <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><Detail label="Pemeriksaan berikutnya" value={date(status.nextCheck)} /><Detail label="Percobaan hari ini (UTC)" value={`${status.attemptsToday} / ${status.dailyLimit} · model gratis saja`} /></dl>}
    {latest && <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
      Hasil terakhir ({date(latest.finishedAt ?? latest.createdAt)}): {reasons[latest.reason] ?? phases[latest.phase] ?? latest.phase}
    </p>}
    {status && <details className="mt-4 max-w-2xl text-sm text-slate-400"><summary className="cursor-pointer">Rincian proses</summary><dl className="mt-3 grid gap-3 sm:grid-cols-2"><Detail label="Pemeriksaan terakhir" value={date(status.lastCheck)} /><Detail label="Bahan diperiksa" value={`${status.sourceCount} · maks. 6 per jenis`} /></dl><p className="mt-3 leading-6">Worker berjalan di API meski halaman ditutup. Sumbernya feedback disetujui, DNA non-otomatis, dan narasi disetujui. Ini sintesis yang diperiksa model, bukan pelatihan ulang model atau bukti peningkatan kualitas terukur.</p></details>}
  </section>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><dt className="text-slate-400">{label}</dt><dd className="mt-1 break-words text-slate-100">{value}</dd></div>;
}
function date(value?: string) { return value ? new Date(value).toLocaleString('id-ID') : 'Belum tersedia'; }
