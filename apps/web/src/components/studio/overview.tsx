import type { Knowledge, Narrative, Persona } from '@/lib/types';

export function Overview({ personas, knowledge, narratives }: { personas: Persona[]; knowledge: Knowledge[]; narratives: Narrative[] }) {
  const approved = narratives.filter((narrative) => narrative.status === 'approved').length;
  const stats = [
    ['Persona aktif', personas.length, 'Suara yang siap dipakai'],
    ['Pola tersimpan', knowledge.length, 'DNA narasi, bukan isi thread'],
    ['Draft disetujui', approved, `${narratives.length} total narrative`],
  ];

  return (
    <section aria-label="Ringkasan studio" className="grid gap-3 sm:grid-cols-3">
      {stats.map(([label, value, description]) => (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4" key={label}>
          <p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      ))}
    </section>
  );
}
