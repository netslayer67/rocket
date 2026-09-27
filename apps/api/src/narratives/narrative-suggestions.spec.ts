import { NarrativesService } from './narratives.service';
import { fetchReferencePreview } from './reference-preview';

jest.mock('./reference-preview', () => ({ fetchReferencePreview: jest.fn() }));

describe('NarrativesService suggestions', () => {
  const preview = { host: 'example.com', title: 'Madilog', description: 'Buku pemikiran', type: 'book' as const, siteName: 'Rocket Books' };

  it('returns a recommended angle and bounded alternative from metadata', async () => {
    jest.mocked(fetchReferencePreview).mockResolvedValue(preview);
    const ai = { complete: jest.fn().mockResolvedValue({ mode: 'live', content: JSON.stringify({ angles: [
      { title: 'Cara orang menguji argumen saat obrolan ramai', confidence: 0.8, reason: 'Judul dan deskripsi mengarah ke diskusi ide.', evidence: ['reference-title', 'reference-description'] },
      { title: 'Kenapa bacaan lama masih memancing debat', confidence: 0.6, reason: 'Sudut alternatif dari konteks buku.', evidence: ['reference-title'] },
    ] }) }) };
    const service = new NarrativesService({} as never, {} as never, {} as never, ai as never);

    await expect(service.suggest({ referenceUrl: 'https://example.com/madilog' })).resolves.toEqual({
      referenceTitle: 'Madilog',
      topic: 'Cara orang menguji argumen saat obrolan ramai',
      reference: preview,
      recommendedAngle: {
        title: 'Cara orang menguji argumen saat obrolan ramai',
        confidence: 0.8,
        reason: 'Judul dan deskripsi mengarah ke diskusi ide.',
        evidence: ['reference-title', 'reference-description'],
      },
      alternativeAngles: [{
        title: 'Kenapa bacaan lama masih memancing debat',
        confidence: 0.6,
        reason: 'Sudut alternatif dari konteks buku.',
        evidence: ['reference-title'],
      }],
      origin: 'model',
    });
    expect(ai.complete.mock.calls[0][0].prompt).toContain('REFERENCE METADATA');
    expect(ai.complete.mock.calls[0][0].prompt).toContain('Rocket Books');
  });

  it('keeps malformed angles safe and preserves the legacy topic shape', async () => {
    jest.mocked(fetchReferencePreview).mockResolvedValue(preview);
    const ai = { complete: jest.fn().mockResolvedValue({ mode: 'live', content: JSON.stringify({ topic: 'Sudut lama', angles: [
      { title: 'Sudut sama', confidence: 4, reason: 'A', evidence: ['made-up-claim'] },
      { title: 'Sudut sama', confidence: -1, reason: 'B', evidence: ['reference-host'] },
    ] }) }) };
    const service = new NarrativesService({} as never, {} as never, {} as never, ai as never);

    const result = await service.suggest({ referenceUrl: 'https://example.com/madilog' });

    expect(result.topic).toBe('Sudut sama');
    expect(result.recommendedAngle.confidence).toBe(1);
    expect(result.recommendedAngle.evidence).toEqual(['metadata-only']);
    expect(result.alternativeAngles).toHaveLength(0);
  });

  it('returns a safe demo contract when the model fails', async () => {
    jest.mocked(fetchReferencePreview).mockResolvedValue(preview);
    const ai = { complete: jest.fn().mockRejectedValue(new Error('provider down')) };
    const service = new NarrativesService({} as never, {} as never, {} as never, ai as never);

    const result = await service.suggest({ referenceUrl: 'https://example.com/madilog' });

    expect(result.recommendedAngle.evidence).toEqual(['metadata-only']);
    expect(result.alternativeAngles).toHaveLength(1);
    expect(result.origin).toBe('metadata-fallback');
  });

  it('replaces a title-only apparel listing with human tensions in the fallback', async () => {
    const product = { host: 'shopee.co.id', title: 'Kemeja Batik Pria Premium Lengan Panjang Katun Primisima Slimfit Lapis Furing', description: '' };
    jest.mocked(fetchReferencePreview).mockResolvedValue(product);
    const ai = { complete: jest.fn().mockResolvedValue({ mode: 'demo', content: '' }) };
    const personas = { findActive: jest.fn().mockResolvedValue({ name: 'Naya Arunika', thinkingStyle: 'mulai dari detail', observationStyle: 'konkret' }) };
    const service = new NarrativesService({} as never, personas as never, {} as never, ai as never);

    const result = await service.suggest({ referenceUrl: 'https://shopee.co.id/item' });

    expect(result.topic).toContain('ragu memilih pakaian');
    expect(result.topic).not.toContain(product.title);
    expect(result.recommendedAngle.confidence).toBe(0.2);
    expect(result.origin).toBe('metadata-fallback');
    expect(ai.complete.mock.calls[0][0].prompt).toContain('Naya Arunika');
    expect(ai.complete.mock.calls[0][0]).toMatchObject({ personaModels: true });
  });

  it('rejects a live generic listing angle before exposing it to the creator', async () => {
    const product = { host: 'shopee.co.id', title: 'Kemeja Batik Pria', description: '' };
    jest.mocked(fetchReferencePreview).mockResolvedValue(product);
    const ai = { complete: jest.fn().mockResolvedValue({ mode: 'live', content: JSON.stringify({ angles: [{ title: 'Hal kecil yang bikin orang melihat Kemeja Batik Pria dari sudut lain', confidence: 0.7, reason: 'generic', evidence: ['reference-title'] }] }) }) };
    const service = new NarrativesService({} as never, { findActive: jest.fn().mockResolvedValue(null) } as never, {} as never, ai as never);

    await expect(service.suggest({ referenceUrl: 'https://shopee.co.id/item' })).resolves.toMatchObject({ topic: expect.stringContaining('ragu memilih pakaian'), recommendedAngle: { evidence: ['metadata-only'] } });
  });

  it('uses an audio tension instead of the cross-category fallback for title-only earphones', async () => {
    const product = { host: 'shopee.co.id', title: 'Ultrapods TWS Bluetooth 5.3 Earphone', description: '' };
    jest.mocked(fetchReferencePreview).mockResolvedValue(product);
    const ai = { complete: jest.fn().mockRejectedValue(new Error('provider unavailable')) };
    const service = new NarrativesService({} as never, {} as never, {} as never, ai as never);

    await expect(service.suggest({ referenceUrl: 'https://shopee.co.id/item' })).resolves.toMatchObject({
      topic: expect.stringContaining('ruang dengar sendiri'), origin: 'metadata-fallback', recommendedAngle: { confidence: 0.2 },
    });
  });

  it('keeps unknown title-only listings neutral and visibly constrained', async () => {
    const product = { host: 'shopee.co.id', title: 'Produk Serbaguna', description: '' };
    jest.mocked(fetchReferencePreview).mockResolvedValue(product);
    const ai = { complete: jest.fn().mockResolvedValue({ mode: 'demo', content: '' }) };
    const service = new NarrativesService({} as never, {} as never, {} as never, ai as never);

    await expect(service.suggest({ referenceUrl: 'https://shopee.co.id/item' })).resolves.toMatchObject({
      topic: expect.stringContaining('Kebutuhan apa'), origin: 'metadata-fallback', recommendedAngle: { evidence: ['metadata-only'] },
    });
  });
});
