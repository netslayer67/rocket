import { useEffect, useRef, useState, type FormEvent } from 'react';
import { nextProgress, progressDetail, type ProgressAction, type ProgressState } from '@/lib/action-progress';
import type { NarrativeInput, NarrativeSuggestion, Persona, Submit } from '@/lib/types';
import { Field, SectionCard } from './ui';

export function NarrativeForm({ personas, busy, onGenerate, onSuggest }: { personas: Persona[]; busy: boolean; onGenerate: Submit<NarrativeInput>; onSuggest: (url: string) => Promise<NarrativeSuggestion | undefined> }) {
  const formRef = useRef<HTMLFormElement>(null);
  const intervalRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<number | undefined>(undefined);
  const [progress, setProgress] = useState<{ action: ProgressAction; value: number; state: ProgressState }>();

  useEffect(() => () => stopTimers(intervalRef, timeoutRef), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    beginProgress('generate', intervalRef, timeoutRef, setProgress);
    const saved = await onGenerate({ topic: String(values.get('topic')), personaId: String(values.get('personaId')), referenceTitle: optional(values.get('referenceTitle')), referenceUrl: optional(values.get('referenceUrl')) });
    finishProgress(saved, intervalRef, timeoutRef, setProgress);
    if (saved) form.reset();
  }

  const cannotGenerate = busy || personas.length === 0;
  async function suggest() {
    const form = formRef.current;
    const url = String(new FormData(form ?? undefined).get('referenceUrl') ?? '').trim();
    if (!form || !url) return;
    beginProgress('suggest', intervalRef, timeoutRef, setProgress);
    const suggestion = await onSuggest(url);
    finishProgress(Boolean(suggestion), intervalRef, timeoutRef, setProgress);
    if (!suggestion) return;
    setField(form, 'topic', suggestion.topic);
    setField(form, 'referenceTitle', suggestion.referenceTitle);
  }

  return (
    <SectionCard title="3. Rangkai narrative" description="Mulai dari insight. Referensi akan diperlakukan sebagai konteks, bukan CTA." wide>
      <form ref={formRef} className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
        <Field label="Topik atau fenomena"><input name="topic" required placeholder="Kenapa kebiasaan kecil terasa sulit dimulai" /></Field>
        <Field label="Persona"><select name="personaId" required defaultValue="" disabled={personas.length === 0}><option value="" disabled>{personas.length ? 'Pilih persona' : 'Buat persona terlebih dahulu'}</option>{personas.map((persona) => <option key={persona._id} value={persona._id}>{persona.name}</option>)}</select></Field>
        <Field label="Judul referensi"><input name="referenceTitle" placeholder="Buku, artikel, repositori, atau produk" /></Field>
        <Field label="Link referensi" hint="Gunakan saran untuk mengisi topik dan judul; keduanya tetap dapat diedit."><input name="referenceUrl" type="url" placeholder="https://... (opsional)" /></Field>
        <div className="md:col-span-2"><button className="button-secondary" type="button" disabled={busy} onClick={() => void suggest()}>{progress?.action === 'suggest' && progress.state === 'pending' ? `Mencari saran • ${progress.value}%` : 'Isi saran dari link'}</button></div>
        <div className="md:col-span-2"><button className="button" disabled={cannotGenerate}>{progress?.action === 'generate' && progress.state === 'pending' ? `Merangkai draft • ${progress.value}%` : 'Buat draft narrative'}</button>{!personas.length && <p className="mt-2 text-sm text-amber-200">Simpan minimal satu persona sebelum membuat draft.</p>}</div>
        {progress && <ProgressIndicator action={progress.action} value={progress.value} state={progress.state} />}
      </form>
    </SectionCard>
  );
}

function optional(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim();
  return text || undefined;
}

function setField(form: HTMLFormElement, name: string, value: string) {
  const field = form.elements.namedItem(name);
  if (field instanceof HTMLInputElement) field.value = value;
}

function ProgressIndicator({ action, value, state }: { action: ProgressAction; value: number; state: ProgressState }) {
  return <div aria-live="polite" className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-3 md:col-span-2"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-cyan-100">Progres perkiraan</p><p className="mt-0.5 text-xs text-slate-400">{progressDetail(action, value, state)}</p></div><span className="shrink-0 text-sm font-semibold text-cyan-200">{value}%</span></div><div aria-label={`Progres perkiraan ${value}%`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={value} className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800" role="progressbar"><div className="h-full rounded-full bg-cyan-400 transition-all duration-500 motion-reduce:transition-none" style={{ width: `${value}%` }} /></div></div>;
}

function beginProgress(action: ProgressAction, intervalRef: React.MutableRefObject<number | undefined>, timeoutRef: React.MutableRefObject<number | undefined>, setProgress: React.Dispatch<React.SetStateAction<{ action: ProgressAction; value: number; state: ProgressState } | undefined>>) {
  stopTimers(intervalRef, timeoutRef);
  setProgress({ action, value: 8, state: 'pending' });
  intervalRef.current = window.setInterval(() => setProgress((current) => current?.state === 'pending' ? { ...current, value: nextProgress(current.value) } : current), 500);
}

function finishProgress(success: boolean, intervalRef: React.MutableRefObject<number | undefined>, timeoutRef: React.MutableRefObject<number | undefined>, setProgress: React.Dispatch<React.SetStateAction<{ action: ProgressAction; value: number; state: ProgressState } | undefined>>) {
  if (intervalRef.current) window.clearInterval(intervalRef.current);
  setProgress((current) => current ? { ...current, value: 100, state: success ? 'complete' : 'error' } : current);
  timeoutRef.current = window.setTimeout(() => setProgress(undefined), 900);
}

function stopTimers(intervalRef: React.MutableRefObject<number | undefined>, timeoutRef: React.MutableRefObject<number | undefined>) {
  if (intervalRef.current) window.clearInterval(intervalRef.current);
  if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
}
