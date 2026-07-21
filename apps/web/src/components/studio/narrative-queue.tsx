import type { Narrative } from '@/lib/types';
import { StatusBadge } from './ui';

export function NarrativeQueue({ narratives, busy, onApprove }: { narratives: Narrative[]; busy: boolean; onApprove: (id: string) => Promise<boolean> }) {
  return (
    <section className="mt-8" aria-labelledby="review-title">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="review-title" className="text-xl font-semibold tracking-tight text-white">Review draft sebelum publish</h2><p className="mt-1 text-sm leading-6 text-slate-400">Baca catatan reviewer, edit bila perlu, lalu setujui secara manual. Rocket tidak mempublish otomatis.</p></div><p className="text-xs text-slate-500">{narratives.length} draft tersimpan</p></div>
      <div className="grid gap-4 lg:grid-cols-2">
        {narratives.map((narrative) => <NarrativeCard narrative={narrative} busy={busy} onApprove={onApprove} key={narrative._id} />)}
        {!narratives.length && <EmptyState />}
      </div>
    </section>
  );
}

function NarrativeCard({ narrative, busy, onApprove }: { narrative: Narrative; busy: boolean; onApprove: (id: string) => Promise<boolean> }) {
  const blocked = narrative.reviewerNotes.some((note) => note.startsWith('Review blocked:') || note.startsWith('Naturalness -15 / AI generic +20:'));
  return (
    <article className="section-card p-5">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs text-slate-500">Posisi referensi: {narrative.linkPlacement}</p><h3 className="mt-1 font-semibold text-white">{narrative.title}</h3></div><StatusBadge status={narrative.status} /></div>
      <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">{narrative.body}</p>
      <div className="mt-4 grid gap-2">{narrative.reviewerNotes.map((note) => <p className="rounded-lg bg-amber-400/10 px-3 py-2 text-xs text-amber-100" key={note}>{note}</p>)}</div>
      {narrative.status === 'draft' && !blocked && <button className="button mt-5" disabled={busy} onClick={() => void onApprove(narrative._id)}>Setujui untuk publish manual</button>}
      {narrative.status === 'draft' && blocked && <p className="mt-5 text-xs text-amber-200">Approval diblokir. Buat ulang draft dengan sudut yang lebih konkret.</p>}
    </article>
  );
}

function EmptyState() {
  return <p className="rounded-xl border border-dashed border-slate-700 px-5 py-10 text-sm leading-6 text-slate-500 lg:col-span-2">Belum ada draft. Mulai dengan membuat suara tulisan, simpan satu pola, lalu isi topik.</p>;
}
