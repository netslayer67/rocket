import { apiUrl } from '@/lib/api';
import type { ThreadsStatus } from '@/lib/types';
import { SectionCard } from './ui';

export function ThreadsConnection({ status, busy, onDisconnect }: { status: ThreadsStatus; busy: boolean; onDisconnect: () => Promise<boolean> }) {
  const expiry = status.expiresAt ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(status.expiresAt)) : null;

  return (
    <div className="mt-8">
      <SectionCard title="Koneksi Threads" description="Hubungkan lewat OAuth resmi. Rocket tidak menerima password dan tidak mempublish otomatis." wide>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div role="status" className="max-w-2xl text-sm leading-6 text-slate-300">
            {!status.configured && 'Konfigurasi Meta App belum lengkap, jadi koneksi belum tersedia.'}
            {status.configured && !status.connected && 'Belum ada akun Threads yang terhubung.'}
            {status.connected && `Akun Threads terhubung${expiry ? ` hingga ${expiry}` : ''}.`}
          </div>
          <div className="flex flex-wrap gap-2">
            {!status.connected && status.configured && <a className="button" href={`${apiUrl}/threads/connect`}>Hubungkan akun</a>}
            {status.connected && <button className="button-secondary" disabled={busy} onClick={() => void onDisconnect()}>Putuskan akun</button>}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
