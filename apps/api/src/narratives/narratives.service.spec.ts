import { NarrativesService, demoNarrative } from './narratives.service';
import { fetchReferencePreview } from './reference-preview';

jest.mock('./reference-preview', () => ({ fetchReferencePreview: jest.fn() }));

describe('demoNarrative', () => {
  it('keeps the reference neutral and leaves placement to the ending', () => {
    const result = demoNarrative(
      { topic: 'membaca buku', personaId: '507f1f77bcf86cd799439011', referenceTitle: 'Atomic Habits' },
      { name: 'Santai', tone: 'casual', vocabulary: ['gue'], sentenceLength: 'short', emojiHabit: '', interactionStyle: '' },
    );
    expect(result.linkPlacement).toBe('ending');
    expect(result.body).toContain('Atomic Habits');
    expect(result.body).not.toMatch(/beli sekarang|klik sekarang/i);
  });
});

describe('NarrativesService approval', () => {
  it('blocks a legacy draft that has a generic AI pattern', async () => {
    const narratives = { findById: jest.fn(() => ({ lean: jest.fn().mockResolvedValue({ title: 'Tes', body: 'Ini bukan sekadar tes.', reviewerNotes: [] }) })) };
    const service = new NarrativesService(narratives as never, {} as never, {} as never, {} as never);

    await expect(service.approve('507f1f77bcf86cd799439011')).rejects.toThrow('Approval diblokir');
  });

  it('blocks a previously stored article-style draft with no reviewer notes', async () => {
    const url = 'https://shop.example/giannis';
    const narratives = { findById: jest.fn(() => ({ lean: jest.fn().mockResolvedValue({ title: 'Logika Transfer Pemain dan Masa Depan LeBron', body: `Garis lapangan basket seringkali menjadi ruang penuh spekulasi.\n\n${url}`, referenceTitle: 'Giannis Immortality Basketball Shoes', referenceUrl: url, reviewerNotes: [] }) })) };
    const service = new NarrativesService(narratives as never, {} as never, {} as never, {} as never);

    await expect(service.approve('507f1f77bcf86cd799439011')).rejects.toThrow('Approval diblokir');
  });

  it('returns current warnings for a listed legacy draft', async () => {
    const url = 'https://shop.example/giannis';
    const draft = { title: 'Logika Transfer Pemain dan Masa Depan LeBron', body: `Garis lapangan basket seringkali menjadi ruang penuh spekulasi.\n\n${url}`, referenceTitle: 'Giannis Immortality Basketball Shoes', referenceUrl: url, reviewerNotes: [] };
    const narratives = { find: jest.fn(() => ({ sort: jest.fn(() => ({ limit: jest.fn(() => ({ lean: jest.fn().mockResolvedValue([draft]) })) })) })) };
    const service = new NarrativesService(narratives as never, {} as never, {} as never, {} as never);

    const result = await service.findAll();

    expect(result[0].reviewerNotes.some((note: string) => note.startsWith('Review blocked:'))).toBe(true);
  });
});

describe('NarrativesService quality gate', () => {
  it('passes an incoherent scene to the existing one-time rewrite', async () => {
    const ai = { complete: jest.fn()
      .mockResolvedValueOnce({ mode: 'live', content: JSON.stringify({ title: 'aku masih kepikiran warna neon purple', body: 'Di tengah main layangan di lapangan, aku ngerasain warna neon purple di atas lantai.', linkPlacement: 'ending' }) })
      .mockResolvedValueOnce({ mode: 'live', content: JSON.stringify({ title: 'aku masih kepikiran warna neon purple', body: 'aku baru sadar warna neon purple sering kelihatan beda tergantung cahaya.', linkPlacement: 'ending' }) }),
    };
    const narratives = { create: jest.fn((input) => input) };
    const personas = { findById: jest.fn().mockResolvedValue({ name: 'Rico', tone: 'santai', vocabulary: ['aku'], sentenceLength: 'short', emojiHabit: '', interactionStyle: '' }) };
    const knowledge = { findRelevant: jest.fn().mockResolvedValue([]) };
    const service = new NarrativesService(narratives as never, personas as never, knowledge as never, ai as never);

    const result = await service.generate({ topic: 'warna neon purple', personaId: '507f1f77bcf86cd799439011' });

    expect(ai.complete).toHaveBeenCalledTimes(2);
    expect(ai.complete.mock.calls[1][0].prompt).toContain('Detail adegan tidak koheren: layangan dan lantai');
    expect(result.reviewerNotes.some((note: string) => note.includes('Detail adegan tidak koheren'))).toBe(false);
  });

  it('rewrites a weak draft using the resolved reference title', async () => {
    const url = 'https://shop.example/giannis';
    jest.mocked(fetchReferencePreview).mockResolvedValue({ host: 'shop.example', title: 'Giannis Immortality Basketball Shoes', description: 'Sepatu basket' });
    const ai = { complete: jest.fn()
      .mockResolvedValueOnce({ mode: 'live', content: JSON.stringify({ title: 'Logika Transfer Pemain dan Masa Depan LeBron', body: 'Garis lapangan basket seringkali menjadi ruang penuh spekulasi.', linkPlacement: 'ending' }) })
      .mockResolvedValueOnce({ mode: 'live', content: JSON.stringify({ title: 'gw masih kepikiran cara orang milih sepatu basket', body: `gw baru sadar banyak orang bahas Giannis cuma dari highlight-nya. Sepatu Giannis Immortality ini bikin gw melihat cara dia bergerak dari sisi lain: ${url}`, linkPlacement: 'ending' }) }),
    };
    const narratives = { create: jest.fn((input) => input) };
    const personas = { findById: jest.fn().mockResolvedValue({ name: 'Rico', tone: 'santai', vocabulary: ['gw'], sentenceLength: 'short', emojiHabit: '', interactionStyle: '' }) };
    const knowledge = { findRelevant: jest.fn().mockResolvedValue([]) };
    const service = new NarrativesService(narratives as never, personas as never, knowledge as never, ai as never);

    const result = await service.generate({ topic: 'Trade pemain basket', personaId: '507f1f77bcf86cd799439011', referenceTitle: 'Kemana LeBron masuk?', referenceUrl: url });

    expect(ai.complete).toHaveBeenCalledTimes(2);
    expect(ai.complete.mock.calls[0][0].prompt).toContain('REFERENCE TITLE: Giannis Immortality Basketball Shoes');
    expect(result.referenceTitle).toBe('Giannis Immortality Basketball Shoes');
    expect(result.reviewerNotes.some((note: string) => note.startsWith('Review blocked:'))).toBe(false);
  });

  it('passes negative lessons to the generator as constraints', async () => {
    const ai = { complete: jest.fn().mockResolvedValue({ mode: 'demo', content: '' }) };
    const narratives = { create: jest.fn((input) => input) };
    const personas = { findById: jest.fn().mockResolvedValue({ name: 'Rico', tone: 'santai', vocabulary: ['gw'], sentenceLength: 'short', emojiHabit: '', interactionStyle: '' }) };
    const knowledge = { findRelevant: jest.fn().mockResolvedValue([{ sourceLabel: 'Negative lesson: trade pemain basket', topics: ['trade pemain basket'], hookType: 'anti-pattern', emotion: 'flat', narrativeType: 'news summary', curiosityLevel: 1, linkPlacement: 'detached', patternSummary: 'reject', conflict: '', persona: '', style: '', vocabulary: [], informationGap: '', discussionPattern: '', authorityType: '', ctaStyle: '', naturalness: 1 }, { sourceLabel: 'Positive lesson: sepatu basket sebagai tiket masuk komunitas', topics: ['trade pemain basket'], hookType: 'conflict question', emotion: 'curiosity', narrativeType: 'observational reflection', curiosityLevel: 4, linkPlacement: 'middle', patternSummary: 'process', conflict: '', persona: '', style: '', vocabulary: [], informationGap: '', discussionPattern: '', authorityType: '', ctaStyle: '', naturalness: 5 }]) };
    const service = new NarrativesService(narratives as never, personas as never, knowledge as never, ai as never);

    await service.generate({ topic: 'Trade pemain basket', personaId: '507f1f77bcf86cd799439011' });

    expect(ai.complete.mock.calls[0][0].prompt).toContain('anti-patterns to avoid');
    expect(ai.complete.mock.calls[0][0].prompt).toContain('structural guidance only');
  });
});
