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
  title: string;
  body: string;
  status: 'draft' | 'approved';
  reviewerNotes: string[];
  linkPlacement: string;
  publishedThreadId?: string;
  publishedAt?: string;
};

export type ThreadsStatus = {
  configured: boolean;
  connected: boolean;
  accountId?: string;
  expiresAt?: string;
};

export type PersonaInput = Omit<Persona, '_id'>;
export type KnowledgeInput = { sourceLabel: string; sourceUrl?: string; content: string };
export type NarrativeInput = { topic: string; personaId: string; referenceTitle?: string; referenceUrl?: string };
export type NarrativeSuggestion = { topic: string; referenceTitle: string };
export type Submit<T> = (value: T) => Promise<boolean>;
export type NarrativeJobStage = 'queued' | 'generating' | 'reviewing' | 'saved' | 'complete' | 'error';
export type NarrativeJobEvent = { stage: NarrativeJobStage; progress: number; message: string; narrative?: Narrative; error?: string };
export type NarrativeProgress = (event: NarrativeJobEvent) => void;
export type NarrativeSubmit = (value: NarrativeInput, onProgress?: NarrativeProgress) => Promise<boolean>;
export type FeedbackInput = { narrativeId: string; lessonType: 'positive' | 'negative'; scores: Record<string, number>; notes?: string; approvedForLearning: boolean };
export type AnalyticsSummary = { source: string; records: number; views: number; clicks: number; likes: number; replies: number; reposts: number; quotes: number; ctr: number | null; engagementRate: number | null };
export type AnalyticsInput = { narrativeId: string; views: number; clicks: number; likes: number; replies: number; reposts: number; quotes: number };
