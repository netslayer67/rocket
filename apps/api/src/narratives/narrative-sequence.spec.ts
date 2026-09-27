import { parseNarrative } from './narrative-output';
import { reviewSequence } from './sequence-review';

describe('content sequence planning', () => {
  it('keeps a parseable legacy draft as a one-post sequence', () => {
    const draft = parseNarrative(JSON.stringify({ title: 'aku kepikiran kopi pagi', body: 'Aku baru sadar antrean kopi selalu bikin aku penasaran.', linkPlacement: 'ending' }));
    expect(draft.sequence.posts).toEqual([{ role: 'main', objective: 'attention', body: draft.body, links: [] }]);
  });

  it('uses the reviewed main post as the legacy publish body', () => {
    const draft = parseNarrative(JSON.stringify({ title: 'aku kepikiran kopi pagi', body: 'teks lama', linkPlacement: 'ending', sequence: { archetype: 'discovery', posts: [{ role: 'main', objective: 'attention', body: 'teks main yang direview', links: [] }] } }));
    expect(draft.body).toBe('teks main yang direview');
  });

  it('accepts contextual supplied links and blocks detached or unknown links', () => {
    const sequence = { archetype: 'utility', posts: [{ role: 'main' as const, objective: 'utility' as const, body: 'Kuncian creamy ada di bahan ini: https://shop.example/cream', links: [{ anchor: 'bahan ini', intent: 'resource' as const, url: 'https://shop.example/cream', productRole: 'hero' as const }] }] };
    expect(reviewSequence(sequence, [{ url: 'https://shop.example/cream' }])).toEqual([]);
    const notes = reviewSequence({ ...sequence, posts: [{ ...sequence.posts[0], links: [{ ...sequence.posts[0].links[0], url: 'https://unknown.example/item' }] }] }, [{ url: 'https://shop.example/cream' }]);
    expect(notes.some((note) => note.includes('Link sequence tidak berasal'))).toBe(true);
  });

  it('blocks a high-risk allegation even when a link is supplied', () => {
    const sequence = { archetype: 'warning', posts: [{ role: 'main' as const, objective: 'attention' as const, body: 'Klinik itu menipu korban dengan treatment berbahaya.', links: [] }] };
    expect(reviewSequence(sequence, []).join(' ')).toContain('Klaim kesehatan');
  });
});
