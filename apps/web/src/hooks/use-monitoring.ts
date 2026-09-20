'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api, apiUrl } from '@/lib/api';
import type { MonitoringSnapshot, MonitoringStreamEvent } from '@/lib/types';

type StreamStatus = 'connecting' | 'live' | 'reconnecting' | 'idle' | 'error';

export function useMonitoring() {
  const [snapshot, setSnapshot] = useState<MonitoringSnapshot | undefined>();
  const [status, setStatus] = useState<StreamStatus>('connecting');
  const [message, setMessage] = useState('Mengambil histori 24 jam...');
  const [busy, setBusy] = useState(false);
  const stopped = useRef(false);

  const refresh = useCallback(async () => {
    const next = await api<MonitoringSnapshot>('/monitoring/history');
    setSnapshot(next);
    return next;
  }, []);

  useEffect(() => {
    stopped.current = false;
    void refresh().catch(() => { setStatus('error'); setMessage('Histori monitoring belum tersedia.'); });
    let source: EventSource | undefined;
    let reconnect: ReturnType<typeof setTimeout> | undefined;
    const connect = () => {
      if (stopped.current) return;
      setStatus('connecting');
      source = new EventSource(`${apiUrl}/monitoring/events`);
      source.onopen = () => { setStatus('live'); setMessage('Koneksi monitoring aktif. Status belajar ditampilkan terpisah.'); };
      source.addEventListener('activity', (event) => { setSnapshot(JSON.parse((event as MessageEvent<string>).data) as MonitoringSnapshot); setStatus('live'); setMessage('Aktivitas backend diterima.'); });
      source.addEventListener('heartbeat', (event) => { const value = JSON.parse((event as MessageEvent<string>).data) as MonitoringStreamEvent; setStatus('live'); setMessage(`Koneksi diperiksa ${new Date((value as { at: string }).at).toLocaleTimeString()}. Bukan event belajar.`); });
      source.onerror = () => {
        source?.close();
        if (stopped.current) return;
        setStatus('reconnecting');
        setMessage('Menghubungkan ulang monitoring. Worker API berjalan terpisah dari koneksi halaman.');
        reconnect = setTimeout(connect, 1500);
      };
    };
    connect();
    return () => { stopped.current = true; source?.close(); if (reconnect) clearTimeout(reconnect); };
  }, [refresh]);

  const action = useCallback(async (path: string, body: Record<string, string | boolean> = {}) => {
    setBusy(true);
    try { await api(path, { method: 'POST', body: JSON.stringify(body) }); await refresh(); setMessage('Aksi monitoring selesai.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Aksi monitoring gagal.'); }
    finally { setBusy(false); }
  }, [refresh]);

  return {
    snapshot, status, message, busy,
    retry: (jobId: string) => action('/monitoring/actions/retry', { jobId, confirmed: true }),
    reindex: () => action('/monitoring/actions/reindex', { confirmed: true }),
    runLearning: () => action('/monitoring/actions/learning', { confirmed: true }),
  };
}
