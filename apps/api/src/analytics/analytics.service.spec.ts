import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  it('returns null rates when no views exist', async () => {
    const model = { find: jest.fn(() => ({ sort: jest.fn(() => ({ limit: jest.fn(() => ({ lean: jest.fn().mockResolvedValue([{ views: 0, clicks: 2, likes: 3, replies: 0, reposts: 0, quotes: 0 }]) })) })) })) };
    await expect(new AnalyticsService(model as never, {} as never).summary()).resolves.toMatchObject({ views: 0, clicks: 2, ctr: null, engagementRate: null });
  });

  it('groups manual rows into reviewable outcome candidates', async () => {
    const analytics = { find: jest.fn(() => ({ sort: jest.fn(() => ({ limit: jest.fn(() => ({ lean: jest.fn().mockResolvedValue([
      { narrativeId: 'n1', views: 100, clicks: 8, likes: 10, replies: 2, reposts: 0, quotes: 0 },
      { narrativeId: 'n1', views: 50, clicks: 2, likes: 5, replies: 0, reposts: 1, quotes: 0 },
      { narrativeId: 'missing', views: 30, clicks: 3, likes: 0, replies: 0, reposts: 0, quotes: 0 },
    ]) })) })) })) };
    const narratives = { find: jest.fn(() => ({ lean: jest.fn().mockResolvedValue([{ _id: 'n1', title: 'Sudut kecil', topic: 'observasi', linkPlacement: 'ending' }]) })) };
    const result = await new AnalyticsService(analytics as never, narratives as never).insights();

    expect(result).toEqual([{ narrativeId: 'n1', title: 'Sudut kecil', topic: 'observasi', linkPlacement: 'ending', views: 150, clicks: 10, likes: 15, replies: 2, reposts: 1, quotes: 0, samples: 2, ctr: 6.67, engagementRate: 12, source: 'manual capture', status: 'candidate' }]);
  });

  it('returns a null rate for a candidate with zero views', async () => {
    const analytics = { find: jest.fn(() => ({ sort: jest.fn(() => ({ limit: jest.fn(() => ({ lean: jest.fn().mockResolvedValue([{ narrativeId: 'n1', views: 0, clicks: 2, likes: 0, replies: 0, reposts: 0, quotes: 0 }]) })) })) })) };
    const narratives = { find: jest.fn(() => ({ lean: jest.fn().mockResolvedValue([{ _id: 'n1', title: 'Kosong', topic: 'tes', linkPlacement: 'reply' }]) })) };
    const result = await new AnalyticsService(analytics as never, narratives as never).insights();

    expect(result[0]).toMatchObject({ views: 0, clicks: 2, ctr: null, engagementRate: null, status: 'candidate' });
  });

  it('promotes an explicitly approved positive candidate once', async () => {
    const analytics = analyticsRows([{ narrativeId: 'n1', views: 100, clicks: 8, likes: 10, replies: 2, reposts: 0, quotes: 0 }]);
    const narrative = { _id: 'n1', title: 'Sudut kecil', topic: 'observasi', linkPlacement: 'ending' };
    const narratives = { findById: jest.fn(() => ({ lean: jest.fn().mockResolvedValue(narrative) })), find: jest.fn(() => ({ lean: jest.fn().mockResolvedValue([narrative]) })), updateOne: jest.fn().mockResolvedValue({}) };
    const createLesson = jest.fn().mockResolvedValue({ _id: 'k1' });
    const result = await new AnalyticsService(analytics as never, narratives as never, { createLesson } as never).promote('n1', { approved: true, lessonType: 'positive' });

    expect(createLesson).toHaveBeenCalledWith(expect.objectContaining({ lessonType: 'positive', evidenceSources: ['manual-analytics'], diagnosis: expect.stringContaining('not a causal claim') }));
    expect(narratives.updateOne).toHaveBeenCalledWith({ _id: 'n1' }, expect.objectContaining({ outcomeKnowledgeId: 'k1', outcomePromotedAt: expect.any(Date) }));
    expect(result).toMatchObject({ status: 'promoted', knowledgeId: 'k1', candidate: { status: 'promoted' } });
  });

  it('does not create a lesson when approval is false', async () => {
    const service = new AnalyticsService({} as never, { findById: jest.fn() } as never, { createLesson: jest.fn() } as never);
    await expect(service.promote('n1', { approved: false as never, lessonType: 'negative' })).rejects.toThrow();
  });

  it('promotes a negative candidate with failure dimensions', async () => {
    const analytics = analyticsRows([{ narrativeId: 'n1', views: 20, clicks: 1, likes: 0, replies: 0, reposts: 0, quotes: 0 }]);
    const narrative = { _id: 'n1', topic: 'observasi', linkPlacement: 'middle' };
    const narratives = { findById: jest.fn(() => ({ lean: jest.fn().mockResolvedValue(narrative) })), find: jest.fn(() => ({ lean: jest.fn().mockResolvedValue([narrative]) })), updateOne: jest.fn().mockResolvedValue({}) };
    const createLesson = jest.fn().mockResolvedValue({ _id: 'k2' });
    await new AnalyticsService(analytics as never, narratives as never, { createLesson } as never).promote('n1', { approved: true, lessonType: 'negative', notes: 'Cari jembatan referensi yang lebih jelas.' });

    expect(createLesson).toHaveBeenCalledWith(expect.objectContaining({ lessonType: 'negative', failureDimensions: ['narrative', 'reference'], recommendedFix: 'Cari jembatan referensi yang lebih jelas.' }));
  });

  it('rejects promotion when no manual candidate exists', async () => {
    const analytics = analyticsRows([]);
    const narrative = { _id: 'n1', topic: 'observasi', linkPlacement: 'ending' };
    const narratives = { findById: jest.fn(() => ({ lean: jest.fn().mockResolvedValue(narrative) })), find: jest.fn(() => ({ lean: jest.fn().mockResolvedValue([narrative]) })) };
    const createLesson = jest.fn();

    await expect(new AnalyticsService(analytics as never, narratives as never, { createLesson } as never).promote('n1', { approved: true, lessonType: 'positive' })).rejects.toThrow('Belum ada analytics manual');
    expect(createLesson).not.toHaveBeenCalled();
  });

  it('returns the existing lesson for repeated promotion', async () => {
    const narrative = { _id: 'n1', outcomeKnowledgeId: 'k1' };
    const narratives = { findById: jest.fn(() => ({ lean: jest.fn().mockResolvedValue(narrative) })) };
    const createLesson = jest.fn();
    await expect(new AnalyticsService({} as never, narratives as never, { createLesson } as never).promote('n1', { approved: true, lessonType: 'negative' })).resolves.toEqual({ status: 'already-promoted', knowledgeId: 'k1' });
    expect(createLesson).not.toHaveBeenCalled();
  });
});

function analyticsRows(rows: unknown[]) {
  return { find: jest.fn(() => ({ sort: jest.fn(() => ({ limit: jest.fn(() => ({ lean: jest.fn().mockResolvedValue(rows) })) })) })) };
}
