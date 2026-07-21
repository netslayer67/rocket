import type { ReactNode } from 'react';

export function SectionCard({ title, description, children, wide = false, step }: { title: string; description: string; children: ReactNode; wide?: boolean; step?: string }) {
  return (
    <section className={`section-card ${wide ? 'lg:col-span-2' : ''}`}>
      <div className="mb-5 flex gap-3">
        {step && <span className="mt-0.5 shrink-0 text-xs font-semibold tracking-[0.16em] text-cyan-400" aria-hidden="true">{step}</span>}
        <div><h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">{description}</p></div>
      </div>
      {children}
    </section>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="grid gap-1.5"><span className="text-sm font-medium text-slate-200">{label}</span>{children}{hint && <span className="text-xs text-slate-500">{hint}</span>}</label>;
}

export function StatusBadge({ status }: { status: 'draft' | 'approved' }) {
  const color = status === 'approved' ? 'bg-emerald-400/10 text-emerald-200 ring-emerald-400/20' : 'bg-amber-400/10 text-amber-200 ring-amber-400/20';
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${color}`}>{status === 'approved' ? 'Disetujui' : 'Draft'}</span>;
}

export function VectorBadge({ status }: { status: 'pending' | 'ready' }) {
  const color = status === 'ready' ? 'bg-cyan-400/10 text-cyan-100 ring-cyan-400/20' : 'bg-slate-700/50 text-slate-300 ring-slate-600';
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${color}`}>{status === 'ready' ? 'Siap dicari' : 'Menunggu index'}</span>;
}
