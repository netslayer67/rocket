import { apiUrl } from '@/lib/api';
import type { ThreadsStatus } from '@/lib/types';
import { SectionCard } from './ui';

export function ThreadsConnection({ status, busy, onDisconnect }: { status: ThreadsStatus; busy: boolean; onDisconnect: () => Promise<boolean> }) {
  const expiry = status.expiresAt ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(status.expiresAt)) : null;

  return (
    <div className="mt-8">
      <SectionCard title="Threads connection" description="Hubungkan melalui halaman otorisasi resmi Threads. Password tidak pernah masuk ke Rocket Project." wide>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div role="status" className="text-sm text-slate-300">
            {!status.configured && 'Konfigurasi Meta App diperlukan sebelum akun dapat dihubungkan.'}
            {status.configured && !status.connected && 'Belum ada akun Threads yang terhubung.'}
            {status.connected && `Akun Threads terhubung${expiry ? ` · token berlaku hingga ${expiry}` : ''}.`}
          </div>
          <div className="flex flex-wrap gap-2">
            {!status.connected && status.configured && <a className="button" href={`${apiUrl}/threads/connect`}>Hubungkan Threads</a>}
            {status.connected && <button className="button-secondary" disabled={busy} onClick={() => void onDisconnect()}>Putuskan koneksi</button>}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
