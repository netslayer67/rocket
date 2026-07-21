import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import type { Knowledge, KnowledgeInput, Narrative, NarrativeInput, NarrativeSuggestion, Persona, PersonaInput, ThreadsStatus } from '@/lib/types';

export function useStudio() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [threads, setThreads] = useState<ThreadsStatus>({ configured: false, connected: false });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const refreshSequence = useRef(0);

  const refresh = useCallback(async () => {
    const sequence = ++refreshSequence.current;
    try {
      const [nextPersonas, nextKnowledge, nextNarratives, nextThreads] = await Promise.all([
        api<Persona[]>('/personas'),
        api<Knowledge[]>('/knowledge'),
        api<Narrative[]>('/narratives'),
        api<ThreadsStatus>('/threads/status'),
      ]);
      if (sequence !== refreshSequence.current) return;
      setPersonas(nextPersonas);
      setKnowledge(nextKnowledge);
      setNarratives(nextNarratives);
      setThreads(nextThreads);
    } catch {
      if (sequence === refreshSequence.current) setMessage('API belum terhubung. Jalankan MongoDB dan API terlebih dahulu.');
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get('threads');
    if (!result) return;
    setMessage(result === 'connected' ? 'Akun Threads berhasil terhubung.' : 'Koneksi Threads tidak berhasil. Coba lagi.');
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  const run = useCallback(async <T,>(action: () => Promise<T>, success: string, onSuccess?: (result: T) => void) => {
    setBusy(true);
    setMessage('');
    try {
      const result = await action();
      if (onSuccess) onSuccess(result);
      else await refresh();
      setMessage(success);
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Terjadi kesalahan.');
      return false;
    } finally {
      setBusy(false);
    }
  }, [refresh]);

  const suggestNarrative = useCallback(async (referenceUrl: string) => {
    setBusy(true);
    setMessage('');
    try {
      const suggestion = await api<NarrativeSuggestion>('/narratives/suggestions', { method: 'POST', body: JSON.stringify({ referenceUrl }) });
      setMessage('Saran dari link sudah diisi. Tetap edit agar sudutnya benar-benar pas.');
      return suggestion;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Saran link tidak tersedia.');
      return undefined;
    } finally {
      setBusy(false);
    }
  }, []);

  return {
    personas,
    knowledge,
    narratives,
    threads,
    message,
    busy,
    refresh,
    createPersona: (input: PersonaInput) => run(() => api('/personas', { method: 'POST', body: JSON.stringify(input) }), 'Persona tersimpan.'),
    importKnowledge: (input: KnowledgeInput) => run(() => api('/knowledge/import', { method: 'POST', body: JSON.stringify(input) }), 'Pola tersimpan; isi sumber tidak disimpan.'),
    reindexKnowledge: () => run(() => api('/knowledge/reindex', { method: 'POST' }), 'Knowledge berhasil diperiksa dan diindeks ulang.'),
    generate: (input: NarrativeInput) => run(
      () => api<Narrative>('/narratives/generate', { method: 'POST', body: JSON.stringify(input) }),
      'Draft narasi siap untuk direview.',
      (narrative) => {
        refreshSequence.current += 1;
        setNarratives((current) => [narrative, ...current.filter((item) => item._id !== narrative._id)]);
      },
    ),
    suggestNarrative,
    approve: (id: string) => run(() => api(`/narratives/${id}/approve`, { method: 'PATCH' }), 'Draft disetujui untuk publish manual.'),
    disconnectThreads: () => run(() => api('/threads/connection', { method: 'DELETE' }), 'Akun Threads diputus dari Rocket Project.'),
  };
}
