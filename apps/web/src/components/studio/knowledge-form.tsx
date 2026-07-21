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
    <SectionCard step="02" title="Tambahkan pola" description="Tempel contoh thread. Rocket mengambil strukturnya, bukan menyalin isinya.">
      <form className="grid gap-3" onSubmit={submit}>
        <Field label="Nama pola"><input name="sourceLabel" required placeholder="Observasi kecil yang membuka diskusi" /></Field>
        <Field label="URL sumber" hint="Opsional; hanya label dan pola yang disimpan."><input name="sourceUrl" type="url" placeholder="https://..." /></Field>
        <Field label="Contoh thread"><textarea name="content" required rows={7} placeholder="Tempel thread atau catatan yang ingin dipelajari." /></Field>
        <button className="button mt-1" disabled={busy}>{busy ? 'Mempelajari pola...' : 'Simpan pola'}</button>
      </form>
    </SectionCard>
  );
}

function optional(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim();
  return text || undefined;
}
