import type { LearningStatus, MonitoringEvent } from '@/lib/types';

type Stage = 'signals' | 'agents' | 'models' | 'memory';
type Node = { id: string; label: string; stage: Stage; x: number; y: number; note?: string };
type Path = { from: string; to: string };

const agentNames = ['Narrative Agent', 'Knowledge Agent', 'Reference Agent', 'Reviewer Agent', 'Learning Agent', 'Analytics Agent'];
const signalNodes = ['Jobs', 'Feedback', 'Metrics', 'Internal evidence'];
const stageNames: Record<Stage, string> = { signals: 'Signals', agents: 'Agents', models: 'Models', memory: 'Memory' };
const stageX: Record<Stage, number> = { signals: 11, agents: 36, models: 62, memory: 88 };

export function MonitoringGraph({ events, learning }: { events: MonitoringEvent[]; learning?: LearningStatus }) {
  const recent = events.filter((event) => Date.now() - Date.parse(event.occurredAt) < 60_000);
  const models = [...new Set(events.filter((event) => event.model).map((event) => event.model as string))].slice(0, 3);
  const nodes = makeNodes(models.length ? models : ['OpenRouter pool']);
  const active = activeNodes(recent, nodes);
  const working = learning?.enabled && ['synthesizing', 'validating', 'saving'].includes(learning.phase);
  if (working) { active.add('signals:internal evidence'); active.add('agents:Learning Agent'); }
  const paths = makePaths(nodes, events);
  const activePaths = paths.filter((path) => active.has(path.from) && active.has(path.to));
  const state = working ? 'Worker sedang memproses bukti internal' : recent.length ? `${recent.length} event dalam 60 detik terakhir` : 'Tidak ada aktivitas baru. Lihat status worker di atas.';
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300" tabIndex={0} role="region" aria-label="Peta workflow. Geser horizontal untuk melihat seluruh peta; timeline tersedia di bawah.">
      <div className="min-w-[980px] p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
          <span className="font-medium text-slate-300">Aktivitas backend</span>
          <span role="status" aria-live="polite">{state}</span>
        </div>
        <div className="relative h-[430px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <GraphWires nodes={nodes} paths={paths} activePaths={new Set(activePaths.map((path) => `${path.from}:${path.to}`))} />
          {(Object.keys(stageNames) as Stage[]).map((stage) => <div key={stage} className="absolute top-4 text-sm font-semibold text-slate-400" style={{ left: `${stageX[stage] - 6}%` }}>{stageNames[stage]}</div>)}
          <div role="list" aria-label="Node workflow signals, agents, models, and memory">
            {nodes.map((node) => <GraphNode key={node.id} node={node} active={active.has(node.id)} />)}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400" aria-label="Legenda status workflow">
          <Legend color="bg-cyan-300" label="event baru / worker aktif" /><Legend color="bg-slate-600" label="histori / menunggu" /><span className="ml-auto">Timeline memuat detail aktivitas</span>
        </div>
      </div>
    </div>
  );
}

function makeNodes(models: string[]): Node[] {
  const stageNodes = [
    ...signalNodes.map((label, index) => ({ id: `signals:${label.toLowerCase()}`, label, stage: 'signals' as Stage, index })),
    ...agentNames.map((label, index) => ({ id: `agents:${label}`, label, stage: 'agents' as Stage, index })),
    ...models.map((label, index) => ({ id: `models:${label}`, label: trimModel(label), stage: 'models' as Stage, index, note: 'OpenRouter' })),
    { id: 'memory:mongo', label: 'Mongo metadata', stage: 'memory' as Stage, index: 0, note: 'source of truth' },
    { id: 'memory:qdrant', label: 'Qdrant index', stage: 'memory' as Stage, index: 1, note: 'semantic recall' },
  ];
  return stageNodes.map(({ index, ...node }) => ({ ...node, x: stageX[node.stage], y: nodeY(node.stage, index, stageNodes.filter((item) => item.stage === node.stage).length) }));
}

function nodeY(stage: Stage, index: number, count: number) {
  const gap = stage === 'agents' ? 12 : count > 2 ? 18 : 24;
  return 18 + index * gap + (stage === 'agents' ? 1 : 0);
}

function makePaths(nodes: Node[], events: MonitoringEvent[]): Path[] {
  const by = (stage: Stage) => nodes.filter((node) => node.stage === stage);
  const signals = by('signals');
  const agents = by('agents');
  const models = by('models');
  const memory = by('memory');
  const route = (from: string, to: string) => ({ from, to });
  const paths = [
    route(signals[0].id, agents[0].id), route(signals[1].id, agents[3].id), route(signals[2].id, agents[5].id),
    route(signals[3].id, 'agents:Learning Agent'),
    ...events.filter((event) => event.model && models.some((model) => model.id === `models:${event.model}`))
      .map((event) => route(`agents:${event.agent}`, `models:${event.model}`)),
    ...models.map((model) => route(model.id, memory[0].id)),
    route('agents:Knowledge Agent', 'memory:qdrant'), route('agents:Learning Agent', 'memory:mongo'),
  ];
  return [...new Map(paths.map((path) => [`${path.from}:${path.to}`, path])).values()];
}

function activeNodes(recent: MonitoringEvent[], nodes: Node[]) {
  const active = new Set<string>();
  recent.forEach((event) => {
    if (event.kind === 'job') active.add('signals:jobs');
    if (event.kind === 'feedback') active.add('signals:feedback');
    if (event.kind === 'analytics') active.add('signals:metrics');
    if (event.id.startsWith('cycle:') || event.label.startsWith('internal-learning')) active.add('signals:internal evidence');
    const agent = nodes.find((node) => node.stage === 'agents' && node.label === event.agent);
    if (agent) active.add(agent.id);
    const model = nodes.find((node) => node.stage === 'models' && (node.label === trimModel(event.model ?? '') || node.id === `models:${event.model}`));
    if (model) active.add(model.id);
    if (event.kind === 'knowledge' && event.status === 'ready') active.add('memory:qdrant');
    if (event.kind !== 'analytics') active.add('memory:mongo');
  });
  return active;
}

function GraphWires({ nodes, paths, activePaths }: { nodes: Node[]; paths: Path[]; activePaths: Set<string> }) {
  const lookup = new Map(nodes.map((node) => [node.id, node]));
  return <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    {paths.map((path) => { const from = lookup.get(path.from); const to = lookup.get(path.to); if (!from || !to) return null; const active = activePaths.has(`${path.from}:${path.to}`); return <path key={`${path.from}:${path.to}`} className={`neural-path ${active ? 'neural-path-active' : ''}`} d={curve(from, to)} fill="none" stroke={active ? '#67e8f9' : '#334155'} strokeOpacity={active ? 0.9 : 0.68} strokeWidth={active ? 0.55 : 0.32} strokeDasharray={active ? '1.8 1.2' : '0'} strokeLinecap="round" />; })}
  </svg>;
}

function curve(from: Node, to: Node) { const bend = Math.max(5, (to.x - from.x) * 0.42); return `M ${from.x} ${from.y} C ${from.x + bend} ${from.y}, ${to.x - bend} ${to.y}, ${to.x} ${to.y}`; }

function GraphNode({ node, active }: { node: Node; active: boolean }) {
  return <div className={`absolute z-10 w-44 -translate-x-1/2 -translate-y-1/2 rounded-lg border px-3 py-2.5 transition-colors ${active ? 'neural-node-active border-cyan-300/70 bg-cyan-950 text-cyan-50' : 'border-slate-800 bg-slate-900 text-slate-300'}`} style={{ left: `${node.x}%`, top: `${node.y}%` }} role="listitem" aria-label={`${node.label}: ${active ? 'active' : 'idle'}`}>
    <div className="flex items-center gap-2"><span className={`h-2 w-2 shrink-0 rounded-full ${active ? 'bg-cyan-300' : 'bg-slate-500'}`} aria-hidden="true" /><span className="truncate text-sm font-medium">{node.label}</span></div>
    {node.note && <span className="ml-4 mt-1 block truncate text-sm text-slate-400">{node.note}</span>}
    <span className="sr-only">{active ? ' menerima event terbaru' : ' tidak menerima event terbaru'}</span>
  </div>;
}

function Legend({ color, label }: { color: string; label: string }) { return <span className="inline-flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${color}`} aria-hidden="true" />{label}</span>; }
function trimModel(model: string) { return model.length > 22 ? `${model.slice(0, 20)}…` : model || 'OpenRouter pool'; }
