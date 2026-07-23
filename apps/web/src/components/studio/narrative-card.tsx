import type { FeedbackInput, Narrative } from '@/lib/types';
import { StatusBadge } from './ui';
import { FeedbackForm } from './feedback-form';

export function NarrativeCard({ narrative, busy, onApprove, onPublish, onFeedback }: { narrative: Narrative; busy: boolean; onApprove: (id: string) => Promise<boolean>; onPublish: (id: string) => Promise<boolean>; onFeedback: (input: FeedbackInput) => Promise<boolean> }) {
  const blocked = narrative.reviewerNotes.some((note) => note.startsWith('Review blocked:') || note.startsWith('Naturalness -15 / AI generic +20:'));
  return <article className="section-card p-5">
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs text-slate-500">Posisi referensi: {narrative.linkPlacement}</p><h3 className="mt-1 font-semibold text-white">{narrative.title}</h3></div><StatusBadge status={narrative.publishedThreadId ? 'published' : narrative.status} /></div>
    <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">{narrative.body}</p>
    <div className="mt-4 grid gap-2">{narrative.reviewerNotes.map((note) => <p className="rounded-lg bg-amber-400/10 px-3 py-2 text-xs text-amber-100" key={note}>{note}</p>)}</div>
    {narrative.status === 'draft' && !blocked && <button className="button mt-5" disabled={busy} onClick={() => void onApprove(narrative._id)}>Setujui untuk publish manual</button>}
    {narrative.status === 'draft' && blocked && <p className="mt-5 text-xs text-amber-200">Approval diblokir. Buat ulang draft dengan sudut yang lebih konkret.</p>}
    {narrative.status === 'approved' && !narrative.publishedThreadId && <button className="button mt-5" disabled={busy} onClick={() => void onPublish(narrative._id)}>Publish ke Threads</button>}
    {narrative.publishedThreadId && <p className="mt-5 text-xs text-emerald-200">Sudah dipublish manual ke Threads.</p>}
    <FeedbackForm narrative={narrative} busy={busy} onSubmit={onFeedback} />
  </article>;
}
