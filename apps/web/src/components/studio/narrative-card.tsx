import type { FeedbackInput, Narrative } from '@/lib/types';
import { StatusBadge } from './ui';
import { FeedbackForm } from './feedback-form';

export function NarrativeCard({ narrative, busy, onApprove, onPublish, onFeedback }: { narrative: Narrative; busy: boolean; onApprove: (id: string) => Promise<boolean>; onPublish: (id: string) => Promise<boolean>; onFeedback: (input: FeedbackInput) => Promise<boolean> }) {
  const blocked = narrative.reviewerNotes.some((note) => note.startsWith('Review blocked:') || note.startsWith('Naturalness -15 / AI generic +20:'));
  return <article className="section-card p-5">
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs text-slate-500">Posisi referensi: {narrative.linkPlacement}</p><h3 className="mt-1 font-semibold text-white">{narrative.title}</h3></div><StatusBadge status={narrative.publishedThreadId ? 'published' : narrative.status} /></div>
    <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">{narrative.body}</p>
    {narrative.quality && <section className="mt-4 border-y border-slate-800 py-3" aria-label="Gate kualitas draft">
      <div className="flex flex-wrap items-baseline justify-between gap-2"><h4 className="text-sm font-semibold text-slate-100">Gate kualitas: {narrative.quality.passed ? 'lolos' : 'perlu perbaikan'}</h4><p className="text-xs text-slate-400">{narrative.quality.overall}/100</p></div>
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs sm:grid-cols-4"><Quality label="Persona" value={narrative.quality.persona} /><Quality label="Spesifik" value={narrative.quality.specificity} /><Quality label="Stereotip" value={narrative.quality.stereotype} /><Quality label="Jualan" value={narrative.quality.hiddenSelling} /></dl>
      <p className="mt-2 text-xs leading-5 text-slate-500">Gate draft, bukan prediksi performa atau pelatihan model.</p>
    </section>}
    {narrative.retrieval && <p className="mt-3 break-words text-xs leading-5 text-slate-500">Konteks knowledge: {retrievalLabel(narrative.retrieval.mode)} · {narrative.retrieval.semanticCount} semantik · {narrative.retrieval.lexicalCount} kata kunci · {narrative.retrieval.knowledgeIds.length} pola dipakai.</p>}
    <div className="mt-4 grid gap-2">{narrative.reviewerNotes.map((note) => <p className="rounded-lg bg-amber-400/10 px-3 py-2 text-xs text-amber-100" key={note}>{note}</p>)}</div>
    {narrative.reviewerDiagnostics?.length ? <p className="mt-3 text-xs text-slate-500">Diagnosis: {narrative.reviewerDiagnostics.map((item) => item.code).join(' · ')}</p> : null}
    {narrative.status === 'draft' && !blocked && <button className="button mt-5" disabled={busy} onClick={() => void onApprove(narrative._id)}>Setujui untuk publish manual</button>}
    {narrative.status === 'draft' && blocked && <p className="mt-5 text-xs text-amber-200">Approval diblokir. Buat ulang draft dengan sudut yang lebih konkret.</p>}
    {narrative.status === 'approved' && !narrative.publishedThreadId && <button className="button mt-5" disabled={busy} onClick={() => void onPublish(narrative._id)}>Publish ke Threads</button>}
    {narrative.publishedThreadId && <p className="mt-5 text-xs text-emerald-200">Sudah dipublish manual ke Threads.</p>}
    <FeedbackForm narrative={narrative} busy={busy} onSubmit={onFeedback} />
  </article>;
}

function Quality({ label, value }: { label: string; value: number }) { return <div className="flex justify-between gap-2"><dt className="text-slate-500">{label}</dt><dd className="text-slate-200">{value}/100</dd></div>; }
function retrievalLabel(mode: NonNullable<Narrative['retrieval']>['mode']) { return { hybrid: 'hybrid', semantic: 'semantik', 'lexical-fallback': 'kata kunci', 'recent-fallback': 'pola terbaru', empty: 'tanpa pola' }[mode]; }
