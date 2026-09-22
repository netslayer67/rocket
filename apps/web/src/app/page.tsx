'use client';

import { KnowledgeForm } from '@/components/studio/knowledge-form';
import { KnowledgeLibrary } from '@/components/studio/knowledge-library';
import { NarrativeForm } from '@/components/studio/narrative-form';
import { NarrativeQueue } from '@/components/studio/narrative-queue';
import { Overview } from '@/components/studio/overview';
import { PersonaForm } from '@/components/studio/persona-form';
import { ThreadsConnection } from '@/components/studio/threads-connection';
import { AnalyticsPanel } from '@/components/studio/analytics-panel';
import { useStudio } from '@/hooks/use-studio';

export default function Home() {
  const studio = useStudio();

  return (
    <main className="page-shell">
      <header className="flex min-w-0 flex-col gap-6 border-b border-slate-800 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-2xl">
          <div className="flex items-center gap-2 text-sm text-slate-400"><span className="font-semibold text-cyan-300">Rocket</span><span aria-hidden="true">·</span><span>Narrative Studio</span></div>
          <h1 className="mt-4 max-w-xl break-words text-3xl font-bold tracking-tight text-white sm:text-4xl">Siapkan, tulis, lalu review draft.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">Perbarui satu karakter aktif, isi topik, lalu setujui draft secara manual jika sudah sesuai.</p>
        </div>
        <div className="flex min-w-0 w-full flex-col gap-3 lg:w-auto lg:items-end"><div className="flex flex-wrap gap-2"><a href="/monitoring" className="button-secondary">Monitoring</a><button className="button-secondary" disabled={studio.busy} onClick={() => void studio.refresh()}>Segarkan data</button></div><p role="status" aria-live="polite" className="min-h-5 text-sm text-slate-400 lg:text-right">{studio.message || 'Data studio siap digunakan.'}</p></div>
      </header>

      <div className="mt-6"><Overview personas={studio.personas} knowledge={studio.knowledge} narratives={studio.narratives} /></div>
      <section className="mt-10" aria-labelledby="setup-title">
        <div className="mb-4 max-w-2xl"><h2 id="setup-title" className="text-xl font-semibold tracking-tight text-white">1. Siapkan studio</h2><p className="mt-1 text-sm leading-6 text-slate-400">Satu karakter aktif menjaga draft dan pembelajaran tetap konsisten. Pola adalah contoh tambahan bila kamu memilikinya.</p></div>
        <div className="grid gap-4 lg:grid-cols-2">
        <PersonaForm persona={studio.personas[0]} quality={studio.personaQuality} busy={studio.busy} onSave={studio.savePersona} />
        <KnowledgeForm busy={studio.busy} onImport={studio.importKnowledge} />
        </div>
      </section>
      <KnowledgeLibrary knowledge={studio.knowledge} busy={studio.busy} onReindex={studio.reindexKnowledge} />
      <section className="mt-10" aria-labelledby="draft-title">
        <div className="mb-4 max-w-2xl"><h2 id="draft-title" className="text-xl font-semibold tracking-tight text-white">2. Buat draft</h2><p className="mt-1 text-sm leading-6 text-slate-400">Mulai dari topik atau fenomena. Link hanya dipakai jika benar-benar membantu konteks.</p></div>
        <NarrativeForm persona={studio.personas[0]} busy={studio.busy} onGenerate={studio.generate} onSuggest={studio.suggestNarrative} />
      </section>
      <NarrativeQueue narratives={studio.narratives} busy={studio.busy} onApprove={studio.approve} onPublish={studio.publish} onFeedback={studio.submitFeedback} />
      <ThreadsConnection status={studio.threads} busy={studio.busy} onDisconnect={studio.disconnectThreads} />
      <AnalyticsPanel summary={studio.analytics} insights={studio.insights} narratives={studio.narratives} busy={studio.busy} onCapture={studio.captureAnalytics} onPromote={studio.promoteOutcome} />
    </main>
  );
}
