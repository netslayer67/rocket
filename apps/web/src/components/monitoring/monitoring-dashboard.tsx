'use client';

import { MonitoringControls } from './monitoring-controls';
import { LearningStatusPanel } from './learning-status';
import { MonitoringGraph } from './monitoring-graph';
import { MonitoringTimeline } from './monitoring-timeline';
import { useMonitoring } from '@/hooks/use-monitoring';

export function MonitoringDashboard() {
  const monitor = useMonitoring();
  const snapshot = monitor.snapshot;
  const statusCopy = { connecting: 'Menghubungkan', live: 'Live', reconnecting: 'Menyambungkan ulang', idle: 'Idle', error: 'Tidak tersedia' }[monitor.status];
  return <main className="page-shell"><header className="flex flex-col gap-5 border-b border-slate-800 pb-8 sm:flex-row sm:items-end sm:justify-between"><div><a href="/" className="text-sm font-semibold text-cyan-300">Rocket</a><h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Status sistem</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">Lihat proses belajar otomatis dan aktivitas terbaru. Koneksi halaman tidak menjalankan worker.</p></div><div className="flex items-center gap-2 text-sm" role="status" aria-live="polite"><span className={`h-2.5 w-2.5 rounded-full ${monitor.status === 'live' ? 'bg-emerald-400' : 'bg-amber-300'}`} aria-hidden="true" />{statusCopy}</div></header>
    <p className="mt-4 min-h-6 text-sm text-slate-400" role="status" aria-live="polite">{monitor.message}</p>
    <LearningStatusPanel status={snapshot?.learning} />
    <dl className="mt-6 grid border-y border-slate-800 py-4 text-sm sm:grid-cols-3" aria-label="Ringkasan 24 jam"><Summary label="Event tersimpan" value={snapshot?.summary.total ?? 0} /><Summary label="Agent aktif" value={snapshot?.summary.activeAgents.length ?? 0} /><Summary label="Jendela histori" value="24 jam" /></dl>
    <section className="mt-8" aria-labelledby="timeline-title"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 id="timeline-title" className="text-xl font-semibold text-white">Aktivitas terbaru</h2><p className="mt-1 text-sm text-slate-400">Detail ringkas tanpa prompt, sumber mentah, atau isi draft.</p></div><span className="text-sm text-slate-400">{snapshot?.windowStart ? `Sejak ${new Date(snapshot.windowStart).toLocaleString()}` : 'Memuat...'}</span></div><MonitoringTimeline events={snapshot?.events ?? []} onRetry={(jobId) => { if (window.confirm('Ulangi job ini?')) void monitor.retry(jobId); }} busy={monitor.busy} /></section>
    <details className="mt-8 section-card"><summary className="cursor-pointer text-base font-semibold text-white">Lihat alur teknis</summary><p className="mt-2 text-sm leading-6 text-slate-400">Peta ini memakai event tersimpan. Garis aktif bukan animasi buatan.</p><div className="mt-5"><MonitoringGraph events={snapshot?.events ?? []} learning={snapshot?.learning} /></div></details>
    <details className="mt-8 section-card"><summary className="cursor-pointer text-base font-semibold text-white">Pemeliharaan manual</summary><div className="mt-5"><MonitoringControls busy={monitor.busy} onReindex={() => void monitor.reindex()} onLearning={() => void monitor.runLearning()} /></div></details>
  </main>;
}

function Summary({ label, value }: { label: string; value: string | number }) { return <div className="flex items-baseline justify-between gap-3 py-2 sm:px-4 first:sm:pl-0 last:sm:pr-0"><dt className="text-slate-400">{label}</dt><dd className="text-lg font-semibold text-slate-100">{value}</dd></div>; }
