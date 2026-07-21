import type { Knowledge, Narrative, Persona } from '@/lib/types';

export function Overview({ personas, knowledge, narratives }: { personas: Persona[]; knowledge: Knowledge[]; narratives: Narrative[] }) {
  const approved = narratives.filter((narrative) => narrative.status === 'approved').length;
  const stats = [
    ['Persona', personas.length, personas.length ? 'Siap dipakai' : 'Belum dibuat'],
    ['Pola', knowledge.length, knowledge.length ? 'Sudah dipelajari' : 'Belum ada pola'],
    ['Draft disetujui', approved, `${narratives.length} draft tersimpan`],
  ];

  return (
    <section aria-label="Status studio" className="border-y border-slate-800 py-4">
      <dl className="grid gap-4 sm:grid-cols-3 sm:divide-x sm:divide-slate-800">
        {stats.map(([label, value, description]) => (
          <div className="flex items-baseline justify-between gap-3 sm:px-5 first:sm:pl-0 last:sm:pr-0" key={label}>
            <div><dt className="text-sm text-slate-400">{label}</dt><dd className="mt-1 text-xs text-slate-500">{description}</dd></div><dd className="text-2xl font-semibold text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
