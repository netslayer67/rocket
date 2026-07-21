'use client';

import { KnowledgeForm } from '@/components/studio/knowledge-form';
import { KnowledgeLibrary } from '@/components/studio/knowledge-library';
import { NarrativeForm } from '@/components/studio/narrative-form';
import { NarrativeQueue } from '@/components/studio/narrative-queue';
import { Overview } from '@/components/studio/overview';
import { PersonaForm } from '@/components/studio/persona-form';
import { ThreadsConnection } from '@/components/studio/threads-connection';
import { useStudio } from '@/hooks/use-studio';

export default function Home() {
  const studio = useStudio();

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
      <header className="mb-8 flex flex-col gap-5 border-b border-slate-800 pb-8 md:flex-row md:items-end md:justify-between">
        <div><p className="eyebrow">Rocket Project · V1</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Narrative first.<br />Reference second.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">Studio untuk mengubah insight menjadi diskusi, lalu menghadirkan link sebagai referensi yang relevan.</p></div>
        <div className="max-w-sm md:text-right"><button className="button-secondary" disabled={studio.busy} onClick={() => void studio.refresh()}>Segarkan data</button><p aria-live="polite" className="mt-3 min-h-5 text-sm text-cyan-100">{studio.message}</p></div>
      </header>

      <Overview personas={studio.personas} knowledge={studio.knowledge} narratives={studio.narratives} />
      <ThreadsConnection status={studio.threads} busy={studio.busy} onDisconnect={studio.disconnectThreads} />
      <section className="mt-8 grid gap-5 lg:grid-cols-2" aria-label="Workflow narrative">
        <PersonaForm personas={studio.personas} busy={studio.busy} onCreate={studio.createPersona} />
        <KnowledgeForm busy={studio.busy} onImport={studio.importKnowledge} />
        <NarrativeForm personas={studio.personas} busy={studio.busy} onGenerate={studio.generate} onSuggest={studio.suggestNarrative} />
      </section>
      <KnowledgeLibrary knowledge={studio.knowledge} busy={studio.busy} onReindex={studio.reindexKnowledge} />
      <NarrativeQueue narratives={studio.narratives} busy={studio.busy} onApprove={studio.approve} />
    </main>
  );
}
