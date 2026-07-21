import { NarrativesService } from './narratives.service';
import { fetchReferencePreview } from './reference-preview';

jest.mock('./reference-preview', () => ({ fetchReferencePreview: jest.fn() }));

describe('NarrativesService suggestions', () => {
  it('returns metadata title with an editable broader topic', async () => {
    jest.mocked(fetchReferencePreview).mockResolvedValue({ host: 'example.com', title: 'Madilog', description: 'Buku pemikiran' });
    const ai = { complete: jest.fn().mockResolvedValue({ mode: 'live', content: '{"topic":"Cara orang menguji argumen saat obrolan ramai"}' }) };
    const service = new NarrativesService({} as never, {} as never, {} as never, ai as never);

    await expect(service.suggest({ referenceUrl: 'https://example.com/madilog' })).resolves.toEqual({
      referenceTitle: 'Madilog',
      topic: 'Cara orang menguji argumen saat obrolan ramai',
    });
  });
});
