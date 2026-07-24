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
          <h1 className="mt-4 max-w-xl break-words text-3xl font-bold tracking-tight text-white sm:text-4xl">Buat draft yang terdengar seperti kamu.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">Siapkan suara tulisan, tambahkan pola yang ingin dipelajari, lalu buat draft untuk kamu review sebelum publish.</p>
        </div>
        <div className="flex min-w-0 w-full flex-col gap-3 lg:w-auto lg:items-end"><button className="button-secondary" disabled={studio.busy} onClick={() => void studio.refresh()}>Segarkan data</button><p role="status" aria-live="polite" className="min-h-5 text-sm text-slate-400 lg:text-right">{studio.message || 'Data studio siap digunakan.'}</p></div>
      </header>

      <div className="mt-6"><Overview personas={studio.personas} knowledge={studio.knowledge} narratives={studio.narratives} /></div>
      <ThreadsConnection status={studio.threads} busy={studio.busy} onDisconnect={studio.disconnectThreads} />
      <section className="mt-10" aria-labelledby="setup-title">
        <div className="mb-4 max-w-2xl"><h2 id="setup-title" className="text-xl font-semibold tracking-tight text-white">Siapkan bahan</h2><p className="mt-1 text-sm leading-6 text-slate-400">Dua hal ini memberi Rocket suara dan contoh pola sebelum draft dibuat.</p></div>
        <div className="grid gap-4 lg:grid-cols-2">
        <PersonaForm personas={studio.personas} busy={studio.busy} onCreate={studio.createPersona} />
        <KnowledgeForm busy={studio.busy} onImport={studio.importKnowledge} />
        </div>
      </section>
      <KnowledgeLibrary knowledge={studio.knowledge} busy={studio.busy} onReindex={studio.reindexKnowledge} />
      <section className="mt-10" aria-labelledby="draft-title">
        <div className="mb-4 max-w-2xl"><h2 id="draft-title" className="text-xl font-semibold tracking-tight text-white">Tulis draft</h2><p className="mt-1 text-sm leading-6 text-slate-400">Mulai dari topik atau fenomena. Link hanya dipakai jika benar-benar membantu konteks.</p></div>
        <NarrativeForm personas={studio.personas} busy={studio.busy} onGenerate={studio.generate} onSuggest={studio.suggestNarrative} />
      </section>
      <NarrativeQueue narratives={studio.narratives} busy={studio.busy} onApprove={studio.approve} onPublish={studio.publish} onFeedback={studio.submitFeedback} />
      <AnalyticsPanel summary={studio.analytics} insights={studio.insights} narratives={studio.narratives} busy={studio.busy} onCapture={studio.captureAnalytics} onRunLearning={studio.runLearning} onPromote={studio.promoteOutcome} />
    </main>
  );
}
