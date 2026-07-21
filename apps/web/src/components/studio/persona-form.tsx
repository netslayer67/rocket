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
    <SectionCard title="1. Bentuk persona" description="Berikan AI ritme dan kosakata yang terasa seperti Anda.">
      <form className="grid gap-3" onSubmit={submit}>
        <Field label="Nama persona"><input name="name" required placeholder="Raka Santai" /></Field>
        <Field label="Tone"><input name="tone" required placeholder="Observatif, hangat, dan santai" /></Field>
        <Field label="Kosakata" hint="Pisahkan dengan koma."><input name="vocabulary" required placeholder="gue, gk, emang, wkwk" /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Panjang kalimat"><select name="sentenceLength" defaultValue="short"><option value="short">Pendek</option><option value="medium">Sedang</option><option value="long">Panjang</option></select></Field>
          <Field label="Kebiasaan emoji"><input name="emojiHabit" placeholder="Mis. ☕ (opsional)" /></Field>
        </div>
        <Field label="Gaya interaksi"><input name="interactionStyle" placeholder="Mis. suka lempar pertanyaan" /></Field>
        <button className="button" disabled={busy}>Simpan persona</button>
      </form>
      {personas.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{personas.map((persona) => <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300" key={persona._id}>{persona.name} · {persona.tone}</span>)}</div>}
    </SectionCard>
  );
}

function optional(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim();
  return text || undefined;
}
