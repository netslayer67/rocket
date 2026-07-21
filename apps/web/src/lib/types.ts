export type Persona = {
  _id: string;
  name: string;
  tone: string;
  vocabulary: string[];
  sentenceLength: 'short' | 'medium' | 'long';
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
  title: string;
  body: string;
  status: 'draft' | 'approved';
  reviewerNotes: string[];
  linkPlacement: string;
};

export type ThreadsStatus = {
  configured: boolean;
  connected: boolean;
  accountId?: string;
  expiresAt?: string;
};

export type PersonaInput = Omit<Persona, '_id'> & { emojiHabit?: string; interactionStyle?: string };
export type KnowledgeInput = { sourceLabel: string; sourceUrl?: string; content: string };
export type NarrativeInput = { topic: string; personaId: string; referenceTitle?: string; referenceUrl?: string };
export type NarrativeSuggestion = { topic: string; referenceTitle: string };
export type Submit<T> = (value: T) => Promise<boolean>;
export type NarrativeJobStage = 'queued' | 'generating' | 'reviewing' | 'saved' | 'complete' | 'error';
export type NarrativeJobEvent = { stage: NarrativeJobStage; progress: number; message: string; narrative?: Narrative; error?: string };
export type NarrativeProgress = (event: NarrativeJobEvent) => void;
export type NarrativeSubmit = (value: NarrativeInput, onProgress?: NarrativeProgress) => Promise<boolean>;
