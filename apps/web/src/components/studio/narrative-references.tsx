import type { Dispatch, SetStateAction } from 'react';
import { Field } from './ui';

export type ReferenceSlot = { id: number };

export function NarrativeReferences({ slots, setSlots }: { slots: ReferenceSlot[]; setSlots: Dispatch<SetStateAction<ReferenceSlot[]>> }) {
  return <div className="md:col-span-2">
    <div className="mb-2 flex flex-wrap items-end justify-between gap-2"><div><p className="text-sm font-medium text-slate-200">Referensi kontekstual</p><p className="text-xs leading-5 text-slate-500">Tambahkan maksimal lima link. Link hanya dipakai bila menjawab kebutuhan pembaca.</p></div>{slots.length < 5 && <button className="button-secondary" type="button" onClick={() => setSlots((current) => [...current, { id: Date.now() }])}>Tambah referensi</button>}</div>
    <div className="grid gap-4 md:grid-cols-2">
      {slots.map((slot, index) => <ReferenceFields key={slot.id} index={index} canRemove={slots.length > 1} onRemove={() => setSlots((current) => current.filter((item) => item.id !== slot.id))} />)}
    </div>
  </div>;
}

function ReferenceFields({ index, canRemove, onRemove }: { index: number; canRemove: boolean; onRemove: () => void }) {
  const suffix = index ? `-${index}` : '';
  return <div className="grid gap-3 rounded-xl border border-slate-800 p-3 sm:grid-cols-[1fr_auto] md:col-span-2">
    <Field label={index ? `Link referensi ${index + 1}` : 'Link referensi'} hint={index ? 'Produk atau sumber tambahan (opsional).' : 'Tempel link jika ada; topik tetap boleh berbeda selama jembatannya jelas.'}><input name={`referenceUrl${suffix}`} type="url" placeholder="https://... (opsional)" /></Field>
    <Field label={index ? `Judul referensi ${index + 1}` : 'Judul referensi'} hint="Boleh dikosongkan jika judul bisa dibaca dari link."><input name={`referenceTitle${suffix}`} placeholder="Nama objek atau sumber" /></Field>
    {canRemove && <button className="button-secondary justify-self-start md:col-span-2" type="button" onClick={onRemove}>Hapus referensi ini</button>}
  </div>;
}

export function readReferences(values: FormData, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const suffix = index ? `-${index}` : '';
    const url = String(values.get(`referenceUrl${suffix}`) ?? '').trim();
    const title = String(values.get(`referenceTitle${suffix}`) ?? '').trim();
    return url ? { url, ...(title ? { title } : {}) } : undefined;
  }).filter((item): item is { url: string; title?: string } => Boolean(item));
}
