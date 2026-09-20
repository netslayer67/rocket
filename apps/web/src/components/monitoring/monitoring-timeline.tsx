import type { MonitoringEvent } from '@/lib/types';

type Props = { events: MonitoringEvent[]; onRetry: (jobId: string) => void; busy: boolean };

export function MonitoringTimeline({ events, onRetry, busy }: Props) {
  if (!events.length) return <p className="rounded-xl border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-400">Belum ada aktivitas tersimpan dalam 24 jam terakhir.</p>;
  return <ol className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950" aria-label="Timeline aktivitas monitoring">{events.map((event) => <li key={`${event.kind}-${event.id}`} className="flex flex-wrap items-start gap-3 px-4 py-4"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300" aria-hidden="true" /><div className="min-w-0 flex-1 break-words"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><strong className="text-sm text-slate-100">{event.label}</strong><span className="text-sm text-slate-400">{event.agent}</span>{event.model && <span className="break-all text-sm text-slate-400">via {event.model}</span>}</div><p className="mt-1 text-sm text-slate-400">{event.status} · {new Date(event.occurredAt).toLocaleString()}</p></div>{event.kind === 'job' && event.status === 'error' && <button className="button-secondary min-h-9 px-3 text-sm" disabled={busy} onClick={() => onRetry(event.id.split(':')[0])}>Ulangi job</button>}</li>)}</ol>;
}
