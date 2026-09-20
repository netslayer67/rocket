export type MonitoringKind = 'job' | 'model' | 'feedback' | 'learning' | 'knowledge' | 'analytics';

export type MonitoringEvent = {
  id: string;
  kind: MonitoringKind;
  agent: string;
  model?: string;
  status: string;
  label: string;
  occurredAt: string;
  details?: Record<string, string | number | boolean | null>;
};

export type MonitoringSnapshot = {
  source: 'persisted metadata';
  windowStart: string;
  generatedAt: string;
  events: MonitoringEvent[];
  learning?: Awaited<ReturnType<AutonomousLearningService['status']>>;
  summary: { total: number; activeAgents: string[]; activeModels: string[]; byKind: Record<MonitoringKind, number> };
};

type Timestamped = { _id: unknown; createdAt?: Date; updatedAt?: Date };

export function jobEvent(record: Timestamped & { jobId: string; events?: Array<{ sequence: number; type: string; data?: Record<string, unknown> }> }): MonitoringEvent {
  const latest = [...(record.events ?? [])].sort((a, b) => b.sequence - a.sequence)[0];
  const status = latest?.type ?? 'queued';
  const progress = typeof latest?.data?.progress === 'number' ? latest.data.progress : null;
  return event(`${record.jobId}:${latest?.sequence ?? 0}`, 'job', 'Narrative Agent', status, `Narrative job ${status}`, record.updatedAt ?? record.createdAt, { progress });
}

export function modelEvent(record: Timestamped & { task: string; model: string; cached?: boolean; inputTokens?: number; outputTokens?: number }): MonitoringEvent {
  return event(String(record._id), 'model', agentForTask(record.task), 'completed', `${record.task} via ${record.model}`, record.createdAt, {
    cached: Boolean(record.cached), inputTokens: record.inputTokens ?? null, outputTokens: record.outputTokens ?? null,
  }, record.model);
}

export function feedbackEvent(record: Timestamped & { lessonType: string; approvedForLearning?: boolean; learnedAt?: Date }): MonitoringEvent {
  const status = record.learnedAt ? 'learned' : record.approvedForLearning ? 'approved' : 'reviewed';
  return event(String(record._id), 'feedback', 'Reviewer Agent', status, `${record.lessonType} feedback`, record.updatedAt ?? record.createdAt, { approved: Boolean(record.approvedForLearning) });
}

export function learningEvent(record: Timestamped & { status: string }): MonitoringEvent {
  return event(String(record._id), 'learning', 'Learning Agent', record.status, `DNA learning ${record.status}`, record.createdAt);
}

export function cycleEvent(record: Timestamped & LearningCycle): MonitoringEvent {
  return event(`cycle:${record._id}`, 'learning', 'Learning Agent', record.phase,
    `Internal learning ${record.phase}`, record.updatedAt ?? record.createdAt,
    { reason: record.reason, evidenceCount: record.evidenceIds.length, knowledgeId: record.knowledgeId ?? null });
}

export function knowledgeEvent(record: Timestamped & { lessonType?: string; vectorStatus?: string }): MonitoringEvent {
  const status = record.vectorStatus ?? 'pending';
  return event(String(record._id), 'knowledge', 'Knowledge Agent', status, `${record.lessonType ?? 'pattern'} DNA`, record.updatedAt ?? record.createdAt);
}

export function analyticsEvent(record: Timestamped & { views?: number; clicks?: number; engagementRate?: number }): MonitoringEvent {
  return event(String(record._id), 'analytics', 'Analytics Agent', 'captured', 'Manual outcome captured', record.createdAt, {
    views: record.views ?? 0, clicks: record.clicks ?? 0, engagementRate: record.engagementRate ?? null,
  });
}

function event(id: string, kind: MonitoringKind, agent: string, status: string, label: string, date?: Date, details?: Record<string, string | number | boolean | null>, model?: string): MonitoringEvent {
  return { id, kind, agent, status, label, occurredAt: (date ?? new Date()).toISOString(), ...(model ? { model } : {}), ...(details ? { details } : {}) };
}

function agentForTask(task: string) {
  if (task.startsWith('internal-learning')) return 'Learning Agent';
  if (task.includes('knowledge') || task.includes('embedding')) return 'Knowledge Agent';
  if (task.includes('reference')) return 'Reference Agent';
  if (task.includes('review')) return 'Reviewer Agent';
  return 'Narrative Agent';
}
import type { AutonomousLearningService } from '../feedback/autonomous-learning.service';
import type { LearningCycle } from '../feedback/schemas/learning-cycle.schema';
