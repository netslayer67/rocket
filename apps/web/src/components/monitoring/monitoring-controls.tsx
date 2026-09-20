type Props = { busy: boolean; onReindex: () => void; onLearning: () => void };

export function MonitoringControls({ busy, onReindex, onLearning }: Props) {
  const confirm = (message: string, action: () => void) => { if (window.confirm(message)) action(); };
  return <section className="section-card" aria-labelledby="monitoring-actions-title"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 id="monitoring-actions-title" className="text-lg font-semibold text-white">Pemulihan manual</h2><p className="mt-1 text-sm leading-6 text-slate-400">Untuk pemeliharaan. Worker otomatis tidak memerlukan tombol ini dan tidak menerbitkan konten.</p></div><div className="flex flex-wrap gap-2"><button className="button-secondary" disabled={busy} onClick={() => confirm('Proses ulang feedback disetujui yang belum menjadi DNA?', onLearning)}>Proses feedback tertunda</button><button className="button-secondary" disabled={busy} onClick={() => confirm('Periksa ulang semua vector knowledge sekarang?', onReindex)}>Reindex Qdrant</button></div></div></section>;
}
