import type { ContentSequence, NarrativeReference } from './narrative-sequence';

const block = (message: string) => `Review blocked: ${message} Regenerasi atau edit draft sebelum approval.`;
const allegation = /\b(?:diganti|palsu|bahaya|berbahaya|menipu|penipuan|korban|ilegal|tidak berizin|air keran)\b/iu;
const highRiskContext = /\b(?:klinik|dokter|treatment|botox|suntik|obat|produk kesehatan|keamanan|merek|brand|perusahaan|penjual|hukum)\b/iu;

export function reviewSequence(sequence: ContentSequence | undefined, references: NarrativeReference[]) {
  if (!sequence) return [];
  const notes: string[] = [];
  const allowed = new Set(references.map((reference) => reference.url));
  for (const post of sequence.posts) {
    const mentionedUrls = post.body.match(/https?:\/\/[^\s]+/giu) ?? [];
    if (sequence.archetype !== 'single-post') for (const url of mentionedUrls) if (!post.links.some((link) => link.url === url)) notes.push(block('URL di post tidak memiliki konteks link yang dapat direview.'));
    for (const link of post.links) {
      if (!allowed.has(link.url)) notes.push(block('Link sequence tidak berasal dari referensi yang diberikan.'));
      if (!post.body.includes(link.url)) notes.push(block('Link sequence terlepas dari teks post.'));
      if (!post.body.toLocaleLowerCase().includes(link.anchor.toLocaleLowerCase())) notes.push(block('Anchor link tidak muncul di post yang sama.'));
    }
  }
  const body = sequence.posts.map((post) => post.body).join('\n');
  // ponytail: narrow contextual risk check; replace with reviewed evidence taxonomy after enough labelled examples.
  if (highRiskContext.test(body) && allegation.test(body)) {
    notes.push(block('Klaim kesehatan, keselamatan, atau reputasi berisiko tidak dapat diperlakukan sebagai konten persuasi. Link yang diberikan bukan verifikasi klaim.'));
  }
  return [...new Set(notes)];
}
