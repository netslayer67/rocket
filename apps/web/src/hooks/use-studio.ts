import { useCallback, useEffect, useRef, useState } from 'react';
import { api, startNarrativeJob, watchNarrativeJob } from '@/lib/api';
import type { AnalyticsInput, AnalyticsInsight, AnalyticsSummary, FeedbackInput, Knowledge, KnowledgeInput, Narrative, NarrativeInput, NarrativeProgress, NarrativeSuggestion, Persona, PersonaInput, ThreadsStatus } from '@/lib/types';

export function useStudio() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [threads, setThreads] = useState<ThreadsStatus>({ configured: false, connected: false });
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({ source: 'manual capture', records: 0, views: 0, clicks: 0, likes: 0, replies: 0, reposts: 0, quotes: 0, ctr: null, engagementRate: null });
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const refreshSequence = useRef(0);

  const refresh = useCallback(async () => {
    const sequence = ++refreshSequence.current;
    try {
      const [nextPersonas, nextKnowledge, nextNarratives, nextThreads, nextAnalytics, nextInsights] = await Promise.all([
        api<Persona[]>('/personas'),
        api<Knowledge[]>('/knowledge'),
        api<Narrative[]>('/narratives'),
        api<ThreadsStatus>('/threads/status'),
        api<AnalyticsSummary>('/analytics/summary'),
        api<AnalyticsInsight[]>('/analytics/insights').catch(() => []),
      ]);
      if (sequence !== refreshSequence.current) return;
      setPersonas(nextPersonas);
      setKnowledge(nextKnowledge);
      setNarratives(nextNarratives);
      setThreads(nextThreads);
      setAnalytics(nextAnalytics);
      setInsights(nextInsights);
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

  const generate = useCallback(async (input: NarrativeInput, onProgress?: NarrativeProgress) => {
    setBusy(true);
    setMessage('');
    try {
      const { jobId } = await startNarrativeJob(input);
      const narrative = await watchNarrativeJob(jobId, (event) => onProgress?.(event));
      refreshSequence.current += 1;
      setNarratives((current) => [narrative, ...current.filter((item) => item._id !== narrative._id)]);
      setMessage('Draft narasi siap untuk direview.');
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Draft tidak dapat dibuat.');
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  return {
    personas,
    knowledge,
    narratives,
    threads,
    analytics,
    insights,
    message,
    busy,
    refresh,
    createPersona: (input: PersonaInput) => run(() => api('/personas', { method: 'POST', body: JSON.stringify(input) }), 'Persona tersimpan.'),
    importKnowledge: (input: KnowledgeInput) => run(() => api('/knowledge/import', { method: 'POST', body: JSON.stringify(input) }), 'Pola tersimpan; isi sumber tidak disimpan.'),
    reindexKnowledge: () => run(() => api('/knowledge/reindex', { method: 'POST' }), 'Knowledge berhasil diperiksa dan diindeks ulang.'),
    generate,
    suggestNarrative,
    approve: (id: string) => run(() => api(`/narratives/${id}/approve`, { method: 'PATCH' }), 'Draft disetujui untuk publish manual.'),
    publish: (id: string) => run(() => api(`/narratives/${id}/publish`, { method: 'POST' }), 'Draft dipublish ke Threads.'),
    submitFeedback: (input: FeedbackInput) => run(() => api('/feedback', { method: 'POST', body: JSON.stringify(input) }), 'Feedback tersimpan; DNA diperbarui bila diizinkan.'),
    captureAnalytics: (input: AnalyticsInput) => run(() => api('/analytics', { method: 'POST', body: JSON.stringify(input) }), 'Metrik tersimpan.'),
    promoteOutcome: (narrativeId: string, lessonType: 'positive' | 'negative') => run(() => api(`/analytics/insights/${narrativeId}/promote`, { method: 'POST', body: JSON.stringify({ approved: true, lessonType }) }), 'Kandidat outcome dipromosikan menjadi DNA.'),
    runLearning: () => run(() => api('/learning/run', { method: 'POST' }), 'Learning run selesai.'),
    disconnectThreads: () => run(() => api('/threads/connection', { method: 'DELETE' }), 'Akun Threads diputus dari Rocket Project.'),
  };
}
