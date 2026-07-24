import { useState, type FormEvent } from 'react';
import type { AnalyticsInput, AnalyticsInsight, AnalyticsSummary, Narrative } from '@/lib/types';
import { Field, SectionCard } from './ui';

export function AnalyticsPanel({ summary, insights, narratives, busy, onCapture, onRunLearning, onPromote }: { summary: AnalyticsSummary; insights: AnalyticsInsight[]; narratives: Narrative[]; busy: boolean; onCapture: (input: AnalyticsInput) => Promise<boolean>; onRunLearning: () => Promise<boolean>; onPromote: (narrativeId: string, lessonType: 'positive' | 'negative') => Promise<boolean> }) {
  const [open, setOpen] = useState(false);
  const [lessonTypes, setLessonTypes] = useState<Record<string, 'positive' | 'negative'>>({});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const number = (name: string) => Math.max(0, Number(data.get(name) || 0));
    const saved = await onCapture({ narrativeId: String(data.get('narrativeId')), views: number('views'), clicks: number('clicks'), likes: number('likes'), replies: number('replies'), reposts: number('reposts'), quotes: number('quotes') });
    if (saved) event.currentTarget.reset();
  }

  return <SectionCard title="Sinyal hasil" description="Catat angka yang kamu lihat; Rocket menghitung CTR dan engagement." wide>
    <div className="grid gap-3 sm:grid-cols-4"><Metric label="Views" value={summary.views} /><Metric label="Clicks" value={summary.clicks} /><Metric label="CTR" value={summary.ctr == null ? '—' : `${summary.ctr}%`} /><Metric label="Engagement" value={summary.engagementRate == null ? '—' : `${summary.engagementRate}%`} /></div>
    {insights.length > 0 && <div className="mt-5 border-t border-slate-800 pt-4"><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-sm font-semibold text-white">Kandidat pola dari hasil</h3><p className="text-xs text-slate-500">Manual, perlu persetujuan</p></div><ul className="mt-3 divide-y divide-slate-800">{insights.slice(0, 3).map((item) => { const lessonType = lessonTypes[item.narrativeId] ?? 'positive'; return <li className="flex flex-wrap items-center gap-2 py-3 text-xs" key={item.narrativeId}><span className="min-w-0 flex-1 truncate text-slate-300">{item.title}</span><span className="text-slate-500">{item.samples} capture · {item.ctr == null ? 'CTR —' : `CTR ${item.ctr}%`} · {item.linkPlacement}</span>{item.status === 'promoted' ? <span className="text-emerald-300">DNA tersimpan</span> : <><select aria-label={`Jenis DNA untuk ${item.title}`} value={lessonType} onChange={(event) => setLessonTypes((current) => ({ ...current, [item.narrativeId]: event.target.value as 'positive' | 'negative' }))}><option value="positive">Pelajaran positif</option><option value="negative">Pelajaran negatif</option></select><button className="button-secondary" type="button" disabled={busy} onClick={() => { if (window.confirm('Promosikan kandidat ini menjadi DNA?')) void onPromote(item.narrativeId, lessonType); }}>Promosikan ke DNA</button></>}</li>; })}</ul></div>}
    <div className="mt-4 flex flex-wrap gap-2"><button className="button-secondary" type="button" onClick={() => setOpen(!open)}>{open ? 'Tutup input metrik' : 'Catat metrik manual'}</button><button className="button-secondary" type="button" disabled={busy} onClick={() => void onRunLearning()}>Jalankan learning</button><span className="self-center text-xs text-slate-500">Sumber: {summary.source}</span></div>
    {open && <form className="mt-4 grid gap-3 border-t border-slate-800 pt-4" onSubmit={submit}><Field label="Draft"><select name="narrativeId" required defaultValue=""><option value="" disabled>Pilih draft</option>{narratives.map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}</select></Field><div className="grid grid-cols-2 gap-2 sm:grid-cols-6">{['views', 'clicks', 'likes', 'replies', 'reposts', 'quotes'].map((key) => <label className="text-xs text-slate-400" key={key}>{key}<input name={key} type="number" min="0" defaultValue="0" /></label>)}</div><button className="button" disabled={busy}>{busy ? 'Menyimpan...' : 'Simpan metrik'}</button></form>}
  </SectionCard>;
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-xl border border-slate-800 px-3 py-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-semibold text-white">{value}</p></div>;
}
