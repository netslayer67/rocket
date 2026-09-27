import type { ContentSequence } from '@/lib/types';

const objectiveLabel = { attention: 'Menarik perhatian', utility: 'Memberi nilai', consideration: 'Membantu pertimbangan', commerce: 'Konteks referensi', engagement: 'Membuka percakapan' };
const intentLabel = { resource: 'bahan/sumber', identifier: 'objek yang dimaksud', recommendation: 'rekomendasi', reference: 'referensi', alternative: 'alternatif', action: 'langkah lanjut', answer: 'jawaban' };
const mediaLabel = { 'result-context': 'konteks hasil', 'product-identification': 'identifikasi objek', 'use-case': 'contoh pemakaian' };

export function ContentSequenceView({ sequence }: { sequence: ContentSequence }) {
  return <section className="mt-4 border-y border-slate-800 py-4" aria-label="Rangkaian post dan balasan">
    <div><h4 className="text-sm font-semibold text-slate-100">Rangkaian untuk review</h4><p className="mt-1 text-xs leading-5 text-slate-500">Struktur {sequence.archetype}. Balasan tetap perlu disalin dan diposting manual.</p></div>
    <ol className="mt-3 space-y-4">
      {sequence.posts.map((post, index) => <li className="border-l border-slate-700 pl-3" key={`${post.role}-${index}`}><p className="text-xs font-medium text-cyan-200">{index === 0 ? 'Post utama' : `Balasan ${index}`} · {objectiveLabel[post.objective]}</p><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">{post.body}</p>{post.links.map((link, linkIndex) => <p className="mt-2 break-words text-xs leading-5 text-slate-400" key={`${link.url}-${linkIndex}`}>Link {intentLabel[link.intent]}: <span className="text-slate-200">{link.anchor}</span>{link.productRole ? ` · ${link.productRole === 'hero' ? 'hero' : 'pendukung'}` : ''}<br /><a className="text-cyan-200 underline underline-offset-2" href={link.url} rel="noreferrer" target="_blank">{link.url}</a></p>)}</li>)}
    </ol>
    {sequence.mediaBrief && <p className="mt-4 border-t border-slate-800 pt-3 text-xs leading-5 text-slate-400">Media (disediakan dan diverifikasi creator): {mediaLabel[sequence.mediaBrief.role]} · {sequence.mediaBrief.note}</p>}
  </section>;
}
