const BLOCKING_PREFIX = 'Review blocked:';
const LEGACY_BLOCKING_PREFIX = 'Naturalness -15 / AI generic +20:';

const patterns: Array<[string, RegExp]> = [
  ['contrast reframing', /\bbukan\s+(?:hanya\s+|sekadar\s+)?[^.!?\n]{1,70}\b(?:tapi|melainkan)\b/iu],
  ['meaning pivot', /\b[^.!?\n]{1,55}\s+bukan\s+(?:hanya\s+|sekadar\s+)?[^.!?\n]{1,55}\.\s*(?:itu|ini)\s+(?:tentang|soal)\b/iu],
  ['English contrast framing', /\bit(?:'|’)s\s+not\s+[^.!?\n]{1,70}\.\s*it(?:'|’)s\s+about\b/iu],
  ['bukan sekadar', /\bbukan\s+sekadar\b/iu],
  ['lebih dari sekadar', /\blebih\s+dari\s+sekadar\b/iu],
  ['more than just', /\bmore\s+than\s+just\b/iu],
  ['AI filler', /\b(?:imagine if|let that sink in|think about it|here(?:'|’)s the thing|little did i know|in a world where|stop scrolling|pov|unpopular opinion)\b/iu],
  ['generic reference appendix', /\breferensi yang (?:gue|gw|aku|saya) maksud\b/iu],
  ['em dash', /—/u],
];
const sceneConflicts: Array<[string, RegExp, RegExp]> = [
  ['layangan dan lantai', /\blayangan\b/iu, /\b(?:di\s+atas\s+)?lantai\b/iu],
];
const informationGap = /\b(?:penasaran|heran|kok|kenapa|ternyata|padahal|awalnya|lucunya|aneh(?:nya)?|(?:baru|masih)\s+(?:sadar|kepikiran)|(?:gak|nggak)\s+nyangka|belum\s+ngerti)\b/iu;
const broadClosingQuestion = /\b(?:menurut\s+(?:kamu|kalian|lo|lu)|apa\s+pendapat(?:mu|kamu)?|setuju\s*(?:nggak|gak|ga)?)\s*\?$/iu;

export type NarrativeReviewContext = { topic?: string; referenceTitle?: string; referenceUrl?: string; vocabulary?: string[] };

export const naturalnessInstruction = `Avoid generic AI framing. Never use contrast reframing such as "bukan X, tapi Y", "X bukan hanya Y. Itu tentang Z", "it's not X, it's about Y", "bukan sekadar", "lebih dari sekadar", a detached "Referensi yang gue maksud", or an em dash. Avoid filler such as "imagine if", "let that sink in", "think about it", "here's the thing", "little did I know", "in a world where", "stop scrolling", "POV", and "unpopular opinion". Do not invent an unrelated concrete scene: every place, activity, object, and visual detail must have a believable connection. Start from a concrete observation, small experience, tension, or unexpected detail instead.`;

export function naturalnessIssues(text: string) {
  return patterns.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
}

export function hasNaturalnessIssue(title: string, body: string) {
  return naturalnessIssues(`${title}\n${body}`).length > 0;
}

export function isNaturalnessBlocked(notes: string[]) {
  return notes.some((note) => note.startsWith(BLOCKING_PREFIX) || note.startsWith(LEGACY_BLOCKING_PREFIX));
}

export function reviewNarrative(title: string, body: string, context: NarrativeReviewContext = {}) {
  const notes: string[] = [];
  const { topic, referenceTitle, referenceUrl, vocabulary = [] } = context;
  if (referenceUrl && !body.includes(referenceUrl)) notes.push(block('Link referensi belum muncul di naskah.'));
  if (!hasHumanVoice(opening(body))) notes.push(block('Human voice tidak terlihat; mulai dari observasi orang pertama.'));
  if (missingPersonaVoice(body, vocabulary)) notes.push(block('Kosakata orang pertama persona tidak muncul di naskah.'));
  if (looksLikeArticleHeadline(title)) notes.push(block('Hook terasa seperti judul artikel; mulai dengan suara percakapan.'));
  if (!hasInformationGap(body)) notes.push(block(`Information gap tidak terlihat${topic ? ` untuk topik ${topic}` : ''}; sisakan detail atau kegelisahan yang membuat orang ingin lanjut.`));
  if (hasBroadClosingQuestion(body)) notes.push(block('Pertanyaan penutup terlalu umum; ajukan detail yang bisa diperdebatkan, bukan sekadar meminta pendapat.'));
  if (referenceUrl && body.includes(referenceUrl) && !hasReferenceBridge(body, referenceTitle, referenceUrl)) {
    notes.push(block('Link tidak memiliki jembatan konteks ke judul referensi.'));
  }
  const conflict = sceneConflict(body);
  if (conflict) notes.push(block(`Detail adegan tidak koheren: ${conflict}.`));
  if (/\b(klik sekarang|beli sekarang|diskon|promo|terbatas)\b/i.test(body)) {
    notes.push('Bahasa promosi terdeteksi; edit sebelum dipublikasikan.');
  }
  const issues = naturalnessIssues(`${title}\n${body}`);
  if (issues.length) notes.push(block(`AI generic terdeteksi: ${issues.join(', ')}.`));
  if (body.length > 2800) notes.push('Thread cukup panjang; pertimbangkan memecahnya.');
  return notes;
}

function block(message: string) {
  return `${BLOCKING_PREFIX} ${message} Regenerasi atau edit draft sebelum approval.`;
}

function hasHumanVoice(text: string) {
  return /\b(?:gw|gue|aku|saya|menurut\s+(?:gw|gue|aku|saya)|awalnya|lucunya|baru\s+kepikiran)\b/iu.test(text);
}

function opening(body: string) {
  return body.split(/\n\s*\n/u, 1)[0] ?? body;
}

function missingPersonaVoice(body: string, vocabulary: string[]) {
  const voice = vocabulary.map((word) => word.toLowerCase()).find((word) => /^(gw|gue|aku|saya)$/.test(word));
  return Boolean(voice && !new RegExp(`\\b${voice}\\b`, 'iu').test(body));
}

function hasInformationGap(body: string) {
  return informationGap.test(body);
}

function hasBroadClosingQuestion(body: string) {
  const closing = body.trim().split(/\n\s*\n/u).at(-1) ?? body.trim();
  return broadClosingQuestion.test(closing);
}

function looksLikeArticleHeadline(title: string) {
  return !hasHumanVoice(title) && /\b(?:logika|masa depan|dampak|analisis|strategi|fenomena|pergerakan)\b/iu.test(title);
}

function sceneConflict(body: string) {
  return sceneConflicts.find(([, first, second]) => first.test(body) && second.test(body))?.[0];
}

function hasReferenceBridge(body: string, title: string | undefined, url: string) {
  const beforeUrl = body.slice(0, body.indexOf(url)).toLowerCase();
  const terms = (title ?? '').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  return terms.filter((term) => term.length >= 4).some((term) => beforeUrl.includes(term));
}
