import type { Knowledge } from '@/lib/types';
import { VectorBadge } from './ui';

export function KnowledgeLibrary({ knowledge, busy, onReindex }: { knowledge: Knowledge[]; busy: boolean; onReindex: () => Promise<boolean> }) {
  const reindexDisabled = busy || knowledge.length === 0;

  return (
    <section className="mt-8" aria-labelledby="library-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="library-title" className="text-xl font-semibold tracking-tight text-white">Pola yang sudah dipelajari</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">Rocket menyimpan struktur narasi, bukan teks thread asli. Pola ini dipakai untuk mencari sudut yang mirip saat membuat draft.</p>
          <p id="semantic-index-help" className="mt-2 max-w-3xl text-xs leading-5 text-slate-500">Index pencarian makna menghubungkan setiap pola dengan representasi di Qdrant. Perbarui index setelah menambah pola atau ketika status masih menunggu.</p>
        </div>
        <button className="button-secondary" disabled={reindexDisabled} aria-describedby="semantic-index-help" title={knowledge.length === 0 ? 'Tambahkan pola terlebih dahulu.' : undefined} onClick={() => void onReindex()}>Perbarui index pencarian</button>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {knowledge.map((item) => <LibraryItem item={item} key={item._id} />)}
        {!knowledge.length && <p className="rounded-xl border border-dashed border-slate-700 px-5 py-8 text-sm text-slate-500 lg:col-span-2">Belum ada pola. Import sebuah thread untuk membangun library.</p>}
      </div>
    </section>
  );
}

function LibraryItem({ item }: { item: Knowledge }) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs text-slate-500">{item.sourceLabel}</p><h3 className="mt-1 text-sm font-semibold text-white">{item.hookType}</h3></div><VectorBadge status={item.vectorStatus ?? 'pending'} /></div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{item.patternSummary}</p>
      <p className="mt-3 text-xs leading-5 text-slate-500">Yang belum terjawab: {item.informationGap}</p>
      <div className="mt-3 flex flex-wrap gap-2">{item.topics.map((topic) => <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400" key={topic}>{topic}</span>)}</div>
    </article>
  );
}
