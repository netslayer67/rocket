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
  ['generic metaphor', /\b(?:menambahkan|memberi|membawa)\s+(?:dimensi|sentuhan|makna)\b/iu],
  ['generic adjective', /\b(?:dramatis|mendalam|mengubah segalanya)\b/iu],
  ['abstract mystery', /\b(?:punya|memiliki)\s+(?:rahasia|cerita|makna)\s+tersendiri\b/iu],
  ['expectation contrast', /\b(?:lebih|kurang)\s+\w+\s+dari\s+(?:dugaan|ekspektasi)\b/iu],
  ['promotional transition', /\b(?:punya detail yang cukup menarik|koleksi yang ada di shopee|langsung kepikiran koleksi)\b/iu],
];
const sceneConflicts: Array<[string, RegExp, RegExp]> = [
  ['layangan dan lantai', /\blayangan\b/iu, /\b(?:di\s+atas\s+)?lantai\b/iu],
];
const informationGap = /\b(?:penasaran|heran|kok|kenapa|ternyata|padahal|awalnya|lucunya|aneh(?:nya)?|jangan-jangan|makin\s+dipikir|belum\s+yakin|(?:baru|masih)\s+(?:sadar|kepikiran)|(?:gw|gue|aku|saya)\s+kira|(?:gak|nggak)\s+nyangka|belum\s+ngerti)\b/iu;
const processThought = /\b(?:awalnya|(?:gw|gue|aku|saya)\s+kira|jangan-jangan|makin\s+dipikir|belum\s+yakin|baru\s+kepikiran|ternyata)\b/iu;
const broadClosingQuestion = /\b(?:menurut\s+(?:kamu|kalian|lo|lu)|apa\s+pendapat(?:mu|kamu)?|setuju\s*(?:nggak|gak|ga)?)\s*\?$/iu;
const sceneBridge = /\b(?:mirip|analogi|ibarat|bandingkan|ngingetin|mengingatkan)\b/iu;
const sceneGroups: Array<[string, RegExp]> = [
  ['layangan', /\b(?:layangan|tali layangan|benang layangan)\b/iu],
  ['basket', /\b(?:basket|sepatu basket|foam|pivot|sprint|grip)\b/iu],
  ['lantai', /\b(?:lantai|keramik|indoor)\b/iu],
];
const marketplaceLanguage = /\b(?:premium|adem\s+di\s+kulit|bahan(?:nya)?\s+(?:tipis|adem)|original|terlaris|best\s+seller|size\s+\d+|rp\s?[\d.]+|produk)\b/iu;
const shoppingTransition = /\b(?:mulai\s+cari|nemuin|nemu|langsung\s+(?:cari|kepikiran)|cari\s+cara)\b[^.!?\n]{0,100}\b(?:produk|kemeja|sepatu|koleksi|shopee)\b/iu;
const communityTangent = /\b(?:suasana\s+komunitas|komunitas\s+yang\s+(?:hangat|penting)|bagian\s+dari\s+komunitas)\b/iu;
const weakProductQuestion = /\b(?:apakah|bakal)\b[^?\n]{0,120}\b(?:solusi|nyaman|cocok|bagus)\b[^?\n]*\?$/iu;
const forcedPersonaContext = /\b(?:acara\s+komunitas|pertemuan\s+kreatif|menggabungkan\s+aspek\s+kultur|kebutuhan\s+fashion\s+masa\s+kini)\b/iu;
const unsupportedProductClaim = /\b(?:detail\s+furing|furing|siluet\s+tubuh|jatuhnya\s+kain|tetap\s+stabil|kenyamanan\s+tekstur)\b/iu;

export type NarrativeReviewContext = { topic?: string; referenceTitle?: string; referenceUrl?: string; vocabulary?: string[] };

export const naturalnessInstruction = `Avoid generic AI framing. Never use contrast reframing such as "bukan X, tapi Y", "X bukan hanya Y. Itu tentang Z", "it's not X, it's about Y", "bukan sekadar", "lebih dari sekadar", a detached "Referensi yang gue maksud", or an em dash. Avoid filler such as "imagine if", "let that sink in", "think about it", "here's the thing", "little did I know", "in a world where", "stop scrolling", "POV", and "unpopular opinion". Prefer concrete observations over abstract metaphors, generic adjectives, or objects with a mysterious "secret". Do not invent an unrelated concrete scene: every place, activity, object, and visual detail must have a believable connection. Do not take the shortest path from a problem to a product: follow a real human concern first, then use a reference only when it naturally answers that concern. Persona is a reasoning style, not a keyword quota: do not insert community, culture, creative, perspective, space, or process vocabulary unless the scene earns it. Think Observe -> Wonder -> Hypothesis -> Reference -> Open Question. Never use marketplace descriptions or claim garment details such as furing, silhouette, fabric drape, or texture stability without firsthand evidence or trusted reference metadata. Do not add a new topic such as community without building it. Show a small uncertainty or process of thought before concluding.`;

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
  if (!hasProcessThought(body) && !hasConcreteObservation(body)) notes.push(block('Proses berpikir tidak terlihat; tunjukkan observasi konkret atau keraguan personal sebelum menyimpulkan.'));
  if (hasBroadClosingQuestion(body)) notes.push(block('Pertanyaan penutup terlalu umum; ajukan detail yang bisa diperdebatkan, bukan sekadar meminta pendapat.'));
  if (hasWeakProductQuestion(body)) notes.push(block('Kualitas diskusi rendah; jangan jadikan pertanyaan akhir sebagai uji coba produk.'));
  if (referenceUrl && body.includes(referenceUrl) && !hasReferenceBridge(body, referenceTitle, referenceUrl)) {
    notes.push(block('Link tidak memiliki jembatan konteks ke judul referensi.'));
  }
  const conflict = sceneConflict(body);
  if (conflict) notes.push(block(`Detail adegan tidak koheren: ${conflict}.`));
  const drift = contextDrift(body);
  if (drift) notes.push(block(`Context drift terdeteksi: ${drift}.`));
  if (marketplaceLanguage.test(body)) notes.push(block('Bahasa marketplace terdeteksi; ubah deskripsi listing menjadi observasi pribadi.'));
  if (forcedPersonaContext.test(body)) notes.push(block('Persona cosplay terdeteksi; jangan memasang istilah komunitas atau kultur tanpa pengalaman yang membangunnya.'));
  if (unsupportedProductDetail(body)) notes.push(block('Klaim detail produk tidak punya bukti pengalaman; hapus atau ubah menjadi dugaan yang jujur.'));
  const injectionScore = productInjectionScore(body, referenceTitle, referenceUrl);
  if (injectionScore >= 60) notes.push(block(`Product Injection Score ${injectionScore}/100; cerita terasa dibuat untuk mengantar produk.`));
  const reasoningIssue = referenceReasoningIssue(body, referenceUrl);
  if (reasoningIssue) notes.push(block(`Reasoning flow terputus: ${reasoningIssue}.`));
  const topicTangent = topicDrift(body, topic);
  if (topicTangent) notes.push(block(`Topic drift terdeteksi: ${topicTangent}.`));
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

function hasProcessThought(body: string) {
  return processThought.test(body);
}

function hasConcreteObservation(body: string) {
  return hasHumanVoice(body) && /\b(?:lihat|pakai|rasain|ngerasa|perhatiin|coba|nemu|dengar|kelihatan|terasa|bikin|warna|keras|empuk|nyala|norak)\b/iu.test(body);
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

function contextDrift(body: string) {
  if (sceneBridge.test(body)) return undefined;
  const groups = new Set(sceneGroups.filter(([, pattern]) => pattern.test(body)).map(([name]) => name));
  if (groups.has('layangan') && groups.has('lantai')) return 'layangan dan lantai tanpa jembatan';
  if (groups.has('layangan') && groups.has('basket')) return 'layangan dan perlengkapan basket tanpa jembatan';
  return undefined;
}

function productInjectionScore(body: string, referenceTitle?: string, referenceUrl?: string) {
  const hasReference = Boolean((referenceUrl && body.includes(referenceUrl)) || (referenceTitle && body.toLowerCase().includes(referenceTitle.toLowerCase())));
  if (!hasReference) return 0;
  let score = 15;
  if (shoppingTransition.test(body)) score += 45;
  if (marketplaceLanguage.test(body)) score += 30;
  if (referenceUrl && body.indexOf(referenceUrl) > 0) score += 10;
  return Math.min(100, score);
}

function hasWeakProductQuestion(body: string) {
  const withoutTrailingUrl = body.trim().replace(/\s*https?:\/\/\S+\s*$/u, '').trim();
  return weakProductQuestion.test(withoutTrailingUrl);
}

function referenceReasoningIssue(body: string, referenceUrl?: string) {
  if (!referenceUrl) return undefined;
  const urlIndex = body.indexOf(referenceUrl);
  if (urlIndex < 0) return undefined;
  const beforeReference = body.slice(0, urlIndex);
  if (hasProcessThought(beforeReference) || hasConcreteObservation(beforeReference)) return undefined;
  return 'referensi muncul sebelum ada observasi atau keraguan personal';
}

function unsupportedProductDetail(body: string) {
  if (!unsupportedProductClaim.test(body)) return false;
  return !/\b(?:gw|gue|aku|saya)\s+(?:sudah\s+)?(?:pakai|coba|lihat|pegang|rasain|ngerasa|perhatiin)\b/iu.test(body);
}

function topicDrift(body: string, topic?: string) {
  if (!communityTangent.test(body)) return undefined;
  if (/\b(?:komunitas|teman|tamu|dress\s*code)\b/iu.test(topic ?? '')) return undefined;
  return 'komunitas muncul tanpa dibangun dari topik atau adegan sebelumnya';
}

function hasReferenceBridge(body: string, title: string | undefined, url: string) {
  const beforeUrl = body.slice(0, body.indexOf(url)).toLowerCase();
  const terms = (title ?? '').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  return terms.filter((term) => term.length >= 4).some((term) => beforeUrl.includes(term));
}
