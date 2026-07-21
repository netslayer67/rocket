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
    <SectionCard step="03" title="Buat draft narasi" description="Mulai dari topik atau fenomena. Referensi hanya dipakai jika hubungannya masuk akal." wide>
      <form ref={formRef} className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
        <Field label="Topik atau fenomena" hint="Tulis hal yang ingin dibahas, bukan nama produknya."><input name="topic" required placeholder="Kenapa orang mudah percaya rumor" /></Field>
        <Field label="Pakai suara"><select name="personaId" required defaultValue="" disabled={personas.length === 0}><option value="" disabled>{personas.length ? 'Pilih persona' : 'Buat suara terlebih dahulu'}</option>{personas.map((persona) => <option key={persona._id} value={persona._id}>{persona.name}</option>)}</select></Field>
        <Field label="Link referensi" hint="Tempel link jika ada; topik tetap boleh berbeda selama jembatannya jelas."><input name="referenceUrl" type="url" placeholder="https://... (opsional)" /></Field>
        <Field label="Judul referensi" hint="Boleh dikosongkan jika judul bisa dibaca dari link."><input name="referenceTitle" placeholder="Buku, artikel, repositori, atau produk" /></Field>
        <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center"><button className="button-secondary" type="button" disabled={busy} onClick={() => void suggest()}>{progress?.action === 'suggest' && progress.state === 'pending' ? `Mencari sudut • ${progress.value}%` : 'Cari sudut dari link'}</button><p className="text-xs leading-5 text-slate-500">Saran akan mengisi topik dan judul; kamu tetap memegang kendali untuk mengeditnya.</p></div>
        <div className="md:col-span-2"><button className="button" disabled={cannotGenerate}>{progress?.action === 'generate' && progress.state === 'pending' ? `Menyusun draft • ${progress.value}%` : 'Buat draft untuk review'}</button>{!personas.length && <p className="mt-2 text-sm text-amber-200">Buat minimal satu suara tulisan sebelum membuat draft.</p>}</div>
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
  return <div aria-live="polite" className="rounded-xl border border-cyan-400/20 bg-slate-950 p-3 md:col-span-2"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-cyan-100">Proses berjalan</p><p className="mt-0.5 text-xs leading-5 text-slate-400">{progressDetail(action, value, state)}</p></div><span className="shrink-0 text-sm font-semibold text-cyan-200">{value}%</span></div><div aria-label={`Progres perkiraan ${value}%`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={value} className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800" role="progressbar"><div className="h-full rounded-full bg-cyan-400 transition-all duration-500 motion-reduce:transition-none" style={{ width: `${value}%` }} /></div></div>;
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
