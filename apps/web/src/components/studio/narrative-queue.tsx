import type { FeedbackInput, Narrative } from '@/lib/types';
import { NarrativeCard } from './narrative-card';

export function NarrativeQueue({ narratives, busy, onApprove, onPublish, onFeedback }: { narratives: Narrative[]; busy: boolean; onApprove: (id: string) => Promise<boolean>; onPublish: (id: string) => Promise<boolean>; onFeedback: (input: FeedbackInput) => Promise<boolean> }) {
  return (
    <section className="mt-8" aria-labelledby="review-title">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="review-title" className="text-xl font-semibold tracking-tight text-white">Review draft sebelum publish</h2><p className="mt-1 text-sm leading-6 text-slate-400">Baca catatan reviewer, edit bila perlu, lalu setujui secara manual. Rocket tidak mempublish otomatis.</p></div><p className="text-xs text-slate-500">{narratives.length} draft tersimpan</p></div>
      <div className="grid gap-4 lg:grid-cols-2">
        {narratives.map((narrative) => <NarrativeCard narrative={narrative} busy={busy} onApprove={onApprove} onPublish={onPublish} onFeedback={onFeedback} key={narrative._id} />)}
        {!narratives.length && <EmptyState />}
      </div>
    </section>
  );
}

function EmptyState() {
  return <p className="rounded-xl border border-dashed border-slate-700 px-5 py-10 text-sm leading-6 text-slate-500 lg:col-span-2">Belum ada draft. Mulai dengan membuat suara tulisan, simpan satu pola, lalu isi topik.</p>;
}
