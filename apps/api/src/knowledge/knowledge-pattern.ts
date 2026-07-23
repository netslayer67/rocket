import type { Knowledge } from './schemas/knowledge.schema';

export type KnowledgePattern = Pick<
  Knowledge,
  'topics' | 'hookType' | 'emotion' | 'narrativeType' | 'curiosityLevel' | 'linkPlacement' | 'patternSummary' |
  'conflict' | 'persona' | 'style' | 'vocabulary' | 'informationGap' | 'discussionPattern' | 'authorityType' | 'ctaStyle' | 'naturalness' |
  'lessonType' | 'diagnosis' | 'rootCause' | 'recommendedFix' | 'failureDimensions' | 'evidenceSources'
>;

export function parsePattern(content: string): KnowledgePattern {
  const value = JSON.parse(content.replace(/^```(?:json)?\s*|\s*```$/g, '')) as Partial<KnowledgePattern>;
  return {
    topics: Array.isArray(value.topics) ? value.topics.map((topic) => String(topic).toLowerCase()).slice(0, 6) : [],
    hookType: text(value.hookType, 'observation'),
    emotion: text(value.emotion, 'curiosity'),
    narrativeType: text(value.narrativeType, 'insight'),
    curiosityLevel: score(value.curiosityLevel, 3),
    linkPlacement: text(value.linkPlacement, 'ending'),
    patternSummary: text(value.patternSummary, 'Mulai dengan observasi, beri satu sudut pandang baru, lalu hadirkan referensi sebagai kelanjutan alami.'),
    conflict: text(value.conflict, 'asumsi umum berhadapan dengan pengalaman nyata'),
    persona: text(value.persona, 'observer yang dekat dengan audiens'),
    style: text(value.style, 'ringkas dan reflektif'),
    vocabulary: Array.isArray(value.vocabulary) ? value.vocabulary.map(String).slice(0, 12) : [],
    informationGap: text(value.informationGap, 'ada alasan penting yang belum terlihat di awal'),
    discussionPattern: text(value.discussionPattern, 'tutup dengan pertanyaan atau ruang untuk berbagi pengalaman'),
    authorityType: text(value.authorityType, 'pengalaman atau observasi'),
    ctaStyle: text(value.ctaStyle, 'referensi netral tanpa ajakan membeli'),
    naturalness: score(value.naturalness, 3),
    lessonType: lessonType(value.lessonType),
    diagnosis: text(value.diagnosis, ''),
    rootCause: text(value.rootCause, ''),
    recommendedFix: text(value.recommendedFix, ''),
    failureDimensions: list(value.failureDimensions, 8),
    evidenceSources: list(value.evidenceSources, 6),
  };
}

export function demoPattern(content: string): KnowledgePattern {
  return {
    topics: keywords(content),
    hookType: 'observasi yang berlawanan dengan asumsi umum',
    emotion: 'penasaran', narrativeType: 'insight singkat', curiosityLevel: 3, linkPlacement: 'ending',
    patternSummary: 'Mulai dengan observasi yang terasa dekat, beri satu sudut pandang baru, lalu jadikan referensi sebagai kelanjutan alami.',
    conflict: 'hasil akhir terlihat sederhana, proses kecil di belakangnya sering diabaikan',
    persona: 'teman yang berbagi temuan', style: 'santai dan observatif', vocabulary: [],
    informationGap: 'pembaca belum melihat keputusan kecil yang mengubah hasil',
    discussionPattern: 'ajak pembaca membandingkan pengalaman tanpa memaksa kesimpulan',
    authorityType: 'observasi personal', ctaStyle: 'referensi sebagai bacaan lanjutan', naturalness: 4,
    lessonType: 'positive', diagnosis: 'observasi kecil membuka sudut yang bisa dibahas bersama', rootCause: '', recommendedFix: 'pertahankan detail konkret dan ruang interpretasi', failureDimensions: [], evidenceSources: ['firsthand'],
  };
}

export function keywords(value: string) {
  return [...new Set(value.toLowerCase().match(/[\p{L}\p{N}]{4,}/gu) ?? [])].slice(0, 6);
}

export function retrievalText(pattern: KnowledgePattern) {
  return [
    `Topics: ${pattern.topics.join(', ')}`, `Hook: ${pattern.hookType}`, `Emotion: ${pattern.emotion}`,
    `Narrative: ${pattern.narrativeType}`, `Conflict: ${pattern.conflict}`, `Information gap: ${pattern.informationGap}`,
    `Discussion: ${pattern.discussionPattern}`, `Authority: ${pattern.authorityType}`, `Style: ${pattern.style}`,
    `CTA: ${pattern.ctaStyle}`, `Summary: ${pattern.patternSummary}`,
    `Diagnosis: ${pattern.diagnosis ?? ''}`, `Root cause: ${pattern.rootCause ?? ''}`,
    `Recommended fix: ${pattern.recommendedFix ?? ''}`, `Failure dimensions: ${(pattern.failureDimensions ?? []).join(', ')}`,
  ].join('\n');
}

function text(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, 700) : fallback;
}

function score(value: unknown, fallback: number) {
  return Math.min(5, Math.max(1, Number(value) || fallback));
}

function lessonType(value: unknown) {
  return value === 'negative' || value === 'positive' ? value : undefined;
}

function list(value: unknown, limit: number) {
  return Array.isArray(value) ? value.map(String).filter(Boolean).slice(0, limit) : [];
}
