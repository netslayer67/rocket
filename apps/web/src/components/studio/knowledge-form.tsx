import type { FormEvent } from 'react';
import type { KnowledgeInput, Submit } from '@/lib/types';
import { Field, SectionCard } from './ui';

export function KnowledgeForm({ busy, onImport }: { busy: boolean; onImport: Submit<KnowledgeInput> }) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const saved = await onImport({
      sourceLabel: String(values.get('sourceLabel')),
      sourceUrl: optional(values.get('sourceUrl')),
      content: String(values.get('content')),
    });
    if (saved) form.reset();
  }

  return (
    <SectionCard title="2. Ambil pola" description="Tempel sumber untuk diekstrak menjadi pola; teks aslinya tidak disimpan.">
      <form className="grid gap-3" onSubmit={submit}>
        <Field label="Label sumber"><input name="sourceLabel" required placeholder="Thread tentang kebiasaan kecil" /></Field>
        <Field label="URL sumber"><input name="sourceUrl" type="url" placeholder="https://... (opsional)" /></Field>
        <Field label="Sumber"><textarea name="content" required rows={7} placeholder="Tempel thread atau catatan di sini." /></Field>
        <button className="button" disabled={busy}>Ekstrak pola narasi</button>
      </form>
    </SectionCard>
  );
}

function optional(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim();
  return text || undefined;
}
