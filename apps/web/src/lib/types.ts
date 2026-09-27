export type Persona = {
  _id: string;
  name: string;
  tone: string;
  vocabulary: string[];
  sentenceLength: 'short' | 'medium' | 'long';
  emojiHabit?: string;
  interactionStyle?: string;
  thinkingStyle?: string;
  observationStyle?: string;
  reasoningPatterns?: string[];
  coreIdentity?: string;
  claimBoundaries?: string;
  currentInterests?: string[];
  active?: boolean;
};

export type Knowledge = {
  _id: string;
  sourceLabel: string;
  topics: string[];
  hookType: string;
  informationGap: string;
  patternSummary: string;
  vectorStatus: 'pending' | 'ready';
};

export type Narrative = {
  _id: string;
  topic?: string;
  referenceTitle?: string;
  referenceUrl?: string;
  references?: NarrativeReference[];
  title: string;
  body: string;
  status: 'draft' | 'approved';
  reviewerNotes: string[];
  reviewerDiagnostics?: NarrativeDiagnostic[];
  linkPlacement: string;
  publishedThreadId?: string;
  publishedAt?: string;
  outcomeKnowledgeId?: string;
  outcomePromotedAt?: string;
  retrieval?: { mode: 'hybrid' | 'semantic' | 'lexical-fallback' | 'recent-fallback' | 'empty'; semanticCount: number; lexicalCount: number; knowledgeIds: string[] };
  quality?: { persona: number; specificity: number; stereotype: number; hiddenSelling: number; overall: number; passed: boolean; diagnostics: string[] };
  sequence?: ContentSequence;
};

export type NarrativeReference = { title?: string; url: string };
export type ContentSequence = { archetype: string; posts: ContentPost[]; mediaBrief?: { role: 'result-context' | 'product-identification' | 'use-case'; note: string; creatorSupplied: true } };
export type ContentPost = { role: 'main' | 'reply'; objective: 'attention' | 'utility' | 'consideration' | 'commerce' | 'engagement'; body: string; links: ContentLink[] };
export type ContentLink = { url: string; intent: 'resource' | 'identifier' | 'recommendation' | 'reference' | 'alternative' | 'action' | 'answer'; anchor: string; productRole?: 'supporting' | 'hero' };

export type NarrativeDiagnostic = { code: string; dimension: string; severity: 'blocking' | 'warning'; message: string };

export type ThreadsStatus = {
  configured: boolean;
  connected: boolean;
  accountId?: string;
  expiresAt?: string;
};

export type PersonaInput = Omit<Persona, '_id' | 'active'>;
export type KnowledgeInput = { sourceLabel: string; sourceUrl?: string; content: string };
export type NarrativeInput = { topic: string; referenceTitle?: string; referenceUrl?: string; references?: NarrativeReference[] };
export type ReferenceAngle = { title: string; confidence: number; reason: string; evidence: string[] };
export type ReferenceMetadata = { host: string; title: string; description: string; type?: 'article' | 'product' | 'book' | 'video' | 'website'; siteName?: string; author?: string; section?: string; publishedAt?: string; price?: string; currency?: string; canonicalUrl?: string };
export type NarrativeSuggestion = {
  topic: string;
  referenceTitle: string;
  reference: ReferenceMetadata;
  recommendedAngle: ReferenceAngle;
  alternativeAngles: ReferenceAngle[];
};
export type Submit<T> = (value: T) => Promise<boolean>;
export type NarrativeJobStage = 'queued' | 'generating' | 'reviewing' | 'saved' | 'complete' | 'error';
export type NarrativeJobEvent = { stage: NarrativeJobStage; progress: number; message: string; agent?: 'Reference Agent' | 'Knowledge Agent' | 'Narrative Agent' | 'Reviewer Agent'; narrative?: Narrative; error?: string };
export type NarrativeProgress = (event: NarrativeJobEvent) => void;
export type NarrativeSubmit = (value: NarrativeInput, onProgress?: NarrativeProgress) => Promise<boolean>;
export type FeedbackInput = { narrativeId: string; lessonType: 'positive' | 'negative'; scores: Record<string, number>; notes?: string; approvedForLearning: boolean };
export type AnalyticsSummary = { source: string; records: number; views: number; clicks: number; likes: number; replies: number; reposts: number; quotes: number; ctr: number | null; engagementRate: number | null };
export type AnalyticsInsight = { narrativeId: string; title: string; topic: string; linkPlacement: string; views: number; clicks: number; likes: number; replies: number; reposts: number; quotes: number; samples: number; ctr: number | null; engagementRate: number | null; source: string; status: 'candidate' | 'promoted' };
export type AnalyticsInput = { narrativeId: string; views: number; clicks: number; likes: number; replies: number; reposts: number; quotes: number };
export type MonitoringKind = 'job' | 'model' | 'feedback' | 'learning' | 'knowledge' | 'analytics';
export type MonitoringEvent = { id: string; kind: MonitoringKind; agent: string; model?: string; status: string; label: string; occurredAt: string; details?: Record<string, string | number | boolean | null> };
export type LearningStatus = {
  enabled: boolean; phase: string; reason: string; lastCheck?: string; nextCheck?: string;
  sourceCount: number; attemptsToday: number; dailyLimit: number; freeOnly: boolean;
  latest?: { phase: string; reason: string; createdAt: string; finishedAt?: string; knowledgeId?: string; models: string[]; evidenceIds: string[]; quality?: { eligibleDrafts: number; averageOverall?: number } } | null;
};
export type MonitoringSnapshot = { source: 'persisted metadata'; windowStart: string; generatedAt: string; events: MonitoringEvent[]; learning?: LearningStatus; summary: { total: number; activeAgents: string[]; activeModels: string[]; byKind: Record<MonitoringKind, number> } };
export type MonitoringStreamEvent = { at?: string; source?: string; message?: string } | MonitoringSnapshot;
export type PersonaQuality = { windowDays: number; drafts: number; persona: number; specificity: number; generic: number; productInjection: number };
