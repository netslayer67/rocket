import type { FormEvent } from 'react';
import type { Persona, PersonaInput, PersonaQuality, Submit } from '@/lib/types';
import { Field, SectionCard } from './ui';

export function PersonaForm({ persona, quality, busy, onSave }: { persona?: Persona; quality: PersonaQuality; busy: boolean; onSave: Submit<PersonaInput> }) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const saved = await onSave({
      name: String(values.get('name')),
      tone: String(values.get('tone')),
      vocabulary: String(values.get('vocabulary')).split(',').map((word) => word.trim()).filter(Boolean),
      sentenceLength: String(values.get('sentenceLength')) as Persona['sentenceLength'],
      emojiHabit: optional(values.get('emojiHabit')),
      interactionStyle: optional(values.get('interactionStyle')),
      thinkingStyle: optional(values.get('thinkingStyle')),
      observationStyle: optional(values.get('observationStyle')),
      reasoningPatterns: String(values.get('reasoningPatterns') ?? '').split(',').map((item) => item.trim()).filter(Boolean),
      coreIdentity: optional(values.get('coreIdentity')),
      claimBoundaries: optional(values.get('claimBoundaries')),
      currentInterests: String(values.get('currentInterests') ?? '').split(',').map((item) => item.trim()).filter(Boolean),
    });
    if (saved && !persona) form.reset();
  }

  return (
    <SectionCard title="Karakter aktif" description="Satu karakter dipakai untuk setiap draft dan pembelajaran baru. Persona lama tetap tersimpan sebagai arsip.">
      <form key={persona?._id ?? 'new'} className="grid gap-3" onSubmit={submit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nama karakter"><input name="name" required defaultValue={persona?.name} placeholder="Nara" /></Field>
          <Field label="Suara bahasa"><input name="tone" required defaultValue={persona?.tone} placeholder="Observatif, hangat, santai" /></Field>
        </div>
        <Field label="Identitas inti" hint="Sudut pandang yang stabil, bukan klaim pengalaman nyata."><textarea name="coreIdentity" rows={2} defaultValue={persona?.coreIdentity} placeholder="Perempuan urban Jakarta yang peka pada tren, kebiasaan, dan percakapan sehari-hari" /></Field>
        <Field label="Kosakata" hint="Pisahkan dengan koma; gunakan bila adegannya memang mendukung."><input name="vocabulary" required defaultValue={persona?.vocabulary.join(', ')} placeholder="aku, gitu, jujur" /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Panjang kalimat"><select name="sentenceLength" defaultValue={persona?.sentenceLength ?? 'short'}><option value="short">Pendek</option><option value="medium">Sedang</option><option value="long">Panjang</option></select></Field>
          <Field label="Kebiasaan emoji"><input name="emojiHabit" defaultValue={persona?.emojiHabit} placeholder="Mis. ☕ (opsional)" /></Field>
        </div>
        <Field label="Gaya interaksi"><input name="interactionStyle" defaultValue={persona?.interactionStyle} placeholder="Memberi konteks dulu, lalu membuka ruang diskusi" /></Field>
        <Field label="Gaya berpikir" hint="Cara karakter menimbang sesuatu, bukan daftar kata."><textarea name="thinkingStyle" rows={2} defaultValue={persona?.thinkingStyle} placeholder="Mulai dari detail kecil, ragu sebelum menyimpulkan" /></Field>
        <Field label="Cara mengamati"><textarea name="observationStyle" rows={2} defaultValue={persona?.observationStyle} placeholder="Kejadian harian, gestur, perubahan kecil" /></Field>
        <Field label="Batas klaim" hint="Hal yang tidak boleh ia akui tanpa bukti atau pengalaman nyata."><textarea name="claimBoundaries" rows={2} defaultValue={persona?.claimBoundaries} placeholder="Jangan mengaku pernah memakai produk atau mengalami kejadian yang tidak didukung konteks" /></Field>
        <Field label="Minat dan tren saat ini" hint="Pisahkan dengan koma; konteks ini boleh berubah tanpa mengganti identitas."><input name="currentInterests" defaultValue={persona?.currentInterests?.join(', ')} placeholder="kopi, snack, tren sosial, keseharian Jakarta" /></Field>
        <Field label="Pola penalaran (opsional)"><input name="reasoningPatterns" defaultValue={persona?.reasoningPatterns?.join(', ')} placeholder="observasi, pertanyaan, refleksi" /></Field>
        <button className="button mt-1" disabled={busy}>{busy ? 'Menyimpan profil...' : persona ? 'Perbarui karakter aktif' : 'Simpan karakter aktif'}</button>
      </form>
      <QualitySummary quality={quality} />
    </SectionCard>
  );
}

function QualitySummary({ quality }: { quality: PersonaQuality }) {
  const signals = [['Konsistensi persona', quality.persona], ['Observasi spesifik', quality.specificity], ['Bahasa generik', quality.generic], ['Terasa jualan', quality.productInjection]];
  return <div className="mt-5 border-t border-slate-800 pt-4"><p className="text-sm font-medium text-slate-200">Sinyal review {quality.windowDays} hari</p><p className="mt-1 text-xs leading-5 text-slate-500">{quality.drafts ? `${quality.drafts} draft diperiksa. Angka ini menunjukkan blocker reviewer, bukan skor kualitas.` : 'Belum ada draft aktif untuk dievaluasi.'}</p>{quality.drafts > 0 && <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{signals.map(([label, value]) => <div className="flex justify-between rounded-lg border border-slate-800 px-3 py-2" key={label as string}><dt className="text-slate-400">{label}</dt><dd className="font-medium text-white">{value}</dd></div>)}</dl>}</div>;
}

function optional(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim();
  return text || undefined;
}
