'use client';

import { MonitoringControls } from './monitoring-controls';
import { MonitoringGraph } from './monitoring-graph';
import { MonitoringTimeline } from './monitoring-timeline';
import { useMonitoring } from '@/hooks/use-monitoring';

export function MonitoringDashboard() {
  const monitor = useMonitoring();
  const snapshot = monitor.snapshot;
  const statusCopy = { connecting: 'Menghubungkan', live: 'Live', reconnecting: 'Menyambungkan ulang', idle: 'Idle', error: 'Tidak tersedia' }[monitor.status];
  return <main className="page-shell"><header className="flex flex-col gap-5 border-b border-slate-800 pb-8 sm:flex-row sm:items-end sm:justify-between"><div><a href="/" className="text-sm font-semibold text-cyan-300">Rocket</a><p className="mt-4 text-sm text-slate-400">Monitoring workflow</p><h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Lihat apa yang benar-benar sedang dikerjakan sistem.</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">Histori 24 jam dan event live dari API. Saat tidak ada pekerjaan, jaringan tetap idle.</p></div><div className="flex items-center gap-2 text-sm" role="status" aria-live="polite"><span className={`h-2.5 w-2.5 rounded-full ${monitor.status === 'live' ? 'bg-emerald-400' : 'bg-amber-300'}`} aria-hidden="true" />{statusCopy}</div></header>
    <p className="mt-4 min-h-6 text-sm text-slate-400" role="status" aria-live="polite">{monitor.message}</p>
    <section className="mt-6 grid gap-3 sm:grid-cols-4" aria-label="Ringkasan 24 jam"><Summary label="Event tersimpan" value={snapshot?.summary.total ?? 0} /><Summary label="Agent terlihat" value={snapshot?.summary.activeAgents.length ?? 0} /><Summary label="Model terlihat" value={snapshot?.summary.activeModels.length ?? 0} /><Summary label="Window" value="24 jam" /></section>
    <section className="mt-8 section-card" aria-labelledby="map-title"><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 id="map-title" className="text-xl font-semibold text-white">Workflow map</h2><p className="mt-1 text-sm text-slate-400">Flow hanya bergerak saat event baru benar-benar tersimpan.</p></div><span className="text-xs text-slate-500">SSE bounded stream</span></div><MonitoringGraph events={snapshot?.events ?? []} /></section>
    <section className="mt-8" aria-labelledby="timeline-title"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 id="timeline-title" className="text-xl font-semibold text-white">Event timeline</h2><p className="mt-1 text-sm text-slate-400">Detail ringkas tanpa prompt, source mentah, atau isi draft.</p></div><span className="text-xs text-slate-500">{snapshot?.windowStart ? `Sejak ${new Date(snapshot.windowStart).toLocaleString()}` : 'Memuat...'}</span></div><MonitoringTimeline events={snapshot?.events ?? []} onRetry={(jobId) => { if (window.confirm('Ulangi job ini?')) void monitor.retry(jobId); }} busy={monitor.busy} /></section>
    <div className="mt-8"><MonitoringControls busy={monitor.busy} onReindex={() => void monitor.reindex()} onLearning={() => void monitor.runLearning()} /></div>
  </main>;
}

function Summary({ label, value }: { label: string; value: string | number }) { return <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-semibold text-slate-100">{value}</p></div>; }
