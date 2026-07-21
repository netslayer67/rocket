import type { Narrative } from '@/lib/types';
import { StatusBadge } from './ui';

export function NarrativeQueue({ narratives, busy, onApprove }: { narratives: Narrative[]; busy: boolean; onApprove: (id: string) => Promise<boolean> }) {
  return (
    <section className="mt-8" aria-labelledby="review-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2"><div><p className="eyebrow">Manual review</p><h2 id="review-title" className="mt-1 text-xl font-bold text-white">Antrian narrative</h2></div><p className="text-sm text-slate-400">Tidak ada publishing otomatis pada V1.</p></div>
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
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs text-slate-500">Link placement: {narrative.linkPlacement}</p><h3 className="mt-1 font-semibold text-white">{narrative.title}</h3></div><StatusBadge status={narrative.status} /></div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">{narrative.body}</p>
      <div className="mt-4 grid gap-2">{narrative.reviewerNotes.map((note) => <p className="rounded-lg bg-amber-400/10 px-3 py-2 text-xs text-amber-100" key={note}>{note}</p>)}</div>
      {narrative.status === 'draft' && !blocked && <button className="button mt-5" disabled={busy} onClick={() => void onApprove(narrative._id)}>Setujui untuk publish manual</button>}
      {narrative.status === 'draft' && blocked && <p className="mt-5 text-xs text-amber-200">Approval diblokir. Buat ulang draft dengan sudut yang lebih konkret.</p>}
    </article>
  );
}

function EmptyState() {
  return <p className="rounded-xl border border-dashed border-slate-700 px-5 py-10 text-sm text-slate-500 lg:col-span-2">Belum ada draft. Bentuk persona, ekstrak pola, lalu mulai dari sebuah topik.</p>;
}
