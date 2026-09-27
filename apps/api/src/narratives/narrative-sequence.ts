export const linkIntents = ['resource', 'identifier', 'recommendation', 'reference', 'alternative', 'action', 'answer'] as const;
export type LinkIntent = typeof linkIntents[number];
export type NarrativeReference = { title?: string; url: string };
export type SequenceLink = { url: string; intent: LinkIntent; anchor: string; productRole?: 'supporting' | 'hero' };
export type SequencePost = { role: 'main' | 'reply'; objective: 'attention' | 'utility' | 'consideration' | 'commerce' | 'engagement'; body: string; links: SequenceLink[] };
export type MediaBrief = { role: 'result-context' | 'product-identification' | 'use-case'; note: string; creatorSupplied: true };
export type ContentSequence = { archetype: string; posts: SequencePost[]; mediaBrief?: MediaBrief };

export function suppliedReferences(input: { referenceTitle?: string; referenceUrl?: string; references?: NarrativeReference[] }) {
  const values = [input.referenceUrl ? { title: input.referenceTitle, url: input.referenceUrl } : undefined, ...(input.references ?? [])]
    .filter((item): item is NarrativeReference => Boolean(item?.url));
  const seen = new Set<string>();
  return values.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  }).slice(0, 5);
}

export function legacySequence(body: string): ContentSequence {
  return { archetype: 'single-post', posts: [{ role: 'main', objective: 'attention', body, links: [] }] };
}

export function parseSequence(value: unknown, fallbackBody: string): ContentSequence {
  if (!value || typeof value !== 'object') return legacySequence(fallbackBody);
  const raw = value as Record<string, unknown>;
  const posts = Array.isArray(raw.posts) ? raw.posts.map(parsePost).filter((item): item is SequencePost => Boolean(item)).slice(0, 4) : [];
  if (!posts.length) return legacySequence(fallbackBody);
  posts[0].role = 'main';
  for (const post of posts.slice(1)) post.role = 'reply';
  const mediaBrief = parseMediaBrief(raw.mediaBrief);
  return { archetype: text(raw.archetype, 80) || 'custom-sequence', posts, ...(mediaBrief ? { mediaBrief } : {}) };
}

export function sequenceText(sequence?: ContentSequence) {
  return sequence?.posts.map((post) => post.body).join('\n\n') ?? '';
}

function parsePost(value: unknown): SequencePost | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const raw = value as Record<string, unknown>;
  const body = text(raw.body, 5000);
  if (!body) return undefined;
  return { role: raw.role === 'reply' ? 'reply' : 'main', objective: objective(raw.objective), body, links: Array.isArray(raw.links) ? raw.links.map(parseLink).filter((item): item is SequenceLink => Boolean(item)).slice(0, 5) : [] };
}

function parseLink(value: unknown): SequenceLink | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const raw = value as Record<string, unknown>;
  const url = text(raw.url, 2000);
  const anchor = text(raw.anchor, 160);
  if (!/^https?:\/\//iu.test(url) || !anchor) return undefined;
  const intent = linkIntents.includes(raw.intent as LinkIntent) ? raw.intent as LinkIntent : 'reference';
  return { url, intent, anchor, ...(raw.productRole === 'hero' || raw.productRole === 'supporting' ? { productRole: raw.productRole } : {}) };
}

function parseMediaBrief(value: unknown): MediaBrief | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const raw = value as Record<string, unknown>;
  const role = raw.role;
  const note = text(raw.note, 280);
  if ((role !== 'result-context' && role !== 'product-identification' && role !== 'use-case') || !note) return undefined;
  return { role, note, creatorSupplied: true };
}

function objective(value: unknown): SequencePost['objective'] {
  return ['attention', 'utility', 'consideration', 'commerce', 'engagement'].includes(String(value)) ? value as SequencePost['objective'] : 'utility';
}

function text(value: unknown, max: number) {
  return String(value ?? '').trim().slice(0, max);
}
