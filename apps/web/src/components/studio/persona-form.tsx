import type { FormEvent } from 'react';
import type { Persona, PersonaInput, Submit } from '@/lib/types';
import { Field, SectionCard } from './ui';

export function PersonaForm({ personas, busy, onCreate }: { personas: Persona[]; busy: boolean; onCreate: Submit<PersonaInput> }) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const saved = await onCreate({
      name: String(values.get('name')),
      tone: String(values.get('tone')),
      vocabulary: String(values.get('vocabulary')).split(',').map((word) => word.trim()).filter(Boolean),
      sentenceLength: String(values.get('sentenceLength')) as Persona['sentenceLength'],
      emojiHabit: optional(values.get('emojiHabit')),
      interactionStyle: optional(values.get('interactionStyle')),
    });
    if (saved) form.reset();
  }

  return (
    <SectionCard step="01" title="Buat suara tulisan" description="Isi cara bicara yang ingin dipertahankan di setiap draft.">
      <form className="grid gap-3" onSubmit={submit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nama persona"><input name="name" required placeholder="Rico santai" /></Field>
          <Field label="Tone"><input name="tone" required placeholder="Observatif, hangat, santai" /></Field>
        </div>
        <Field label="Kosakata" hint="Pisahkan dengan koma; gunakan kata yang benar-benar kamu pakai."><input name="vocabulary" required placeholder="gw, gk, emang, wkwk" /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Panjang kalimat"><select name="sentenceLength" defaultValue="short"><option value="short">Pendek</option><option value="medium">Sedang</option><option value="long">Panjang</option></select></Field>
          <Field label="Kebiasaan emoji"><input name="emojiHabit" placeholder="Mis. ☕ (opsional)" /></Field>
        </div>
        <Field label="Gaya interaksi" hint="Contoh: memberi konteks dulu, lalu membuka ruang diskusi."><input name="interactionStyle" placeholder="Santai dan observatif" /></Field>
        <button className="button mt-1" disabled={busy}>{busy ? 'Menyimpan suara...' : 'Simpan suara'}</button>
      </form>
      {personas.length > 0 && <div className="mt-5 border-t border-slate-800 pt-4"><p className="text-xs font-medium text-slate-500">Persona tersimpan</p><ul className="mt-2 grid gap-2 text-sm text-slate-300">{personas.map((persona) => <li key={persona._id}>{persona.name}<span className="text-slate-500"> · {persona.tone}</span></li>)}</ul></div>}
    </SectionCard>
  );
}

function optional(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim();
  return text || undefined;
}
