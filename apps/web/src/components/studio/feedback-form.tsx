import { useState, type FormEvent } from 'react';
import type { FeedbackInput, Narrative } from '@/lib/types';

export function FeedbackForm({ narrative, busy, onSubmit }: { narrative: Narrative; busy: boolean; onSubmit: (input: FeedbackInput) => Promise<boolean> }) {
  const [open, setOpen] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const scores = Object.fromEntries(['hook', 'persona', 'naturalness', 'reference', 'reasoning'].map((key) => [key, Number(data.get(key) || 0)]));
    const saved = await onSubmit({ narrativeId: narrative._id, lessonType: String(data.get('lessonType')) as 'positive' | 'negative', scores, notes: String(data.get('notes') || '').trim() || undefined, approvedForLearning: data.get('approvedForLearning') === 'on' });
    if (saved) { event.currentTarget.reset(); setOpen(false); }
  }

  return <details className="mt-4 rounded-xl border border-slate-800" open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
    <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">Catat feedback</summary>
    <form className="grid gap-3 border-t border-slate-800 p-3" onSubmit={submit}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{['hook', 'persona', 'naturalness', 'reference', 'reasoning'].map((key) => <label className="text-xs text-slate-400" key={key}>{key}<input name={key} type="number" min="0" max="10" defaultValue="5" aria-label={`Nilai ${key}`} /></label>)}</div>
      <label className="text-xs text-slate-400">Jenis lesson<select name="lessonType" defaultValue="negative"><option value="negative">Negative lesson</option><option value="positive">Positive lesson</option></select></label>
      <label className="text-xs text-slate-400">Diagnosis singkat<textarea name="notes" rows={3} placeholder="Apa yang bekerja atau gagal, dan kenapa?" /></label>
      <label className="flex items-start gap-2 text-xs text-slate-300"><input name="approvedForLearning" type="checkbox" className="mt-0.5 h-4 w-4" />Izinkan feedback ini menjadi DNA knowledge.</label>
      <button className="button-secondary" disabled={busy}>{busy ? 'Menyimpan...' : 'Simpan feedback'}</button>
    </form>
  </details>;
}
