import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  it('returns null rates when no views exist', async () => {
    const model = { find: jest.fn(() => ({ sort: jest.fn(() => ({ limit: jest.fn(() => ({ lean: jest.fn().mockResolvedValue([{ views: 0, clicks: 2, likes: 3, replies: 0, reposts: 0, quotes: 0 }]) })) })) })) };
    await expect(new AnalyticsService(model as never, {} as never).summary()).resolves.toMatchObject({ views: 0, clicks: 2, ctr: null, engagementRate: null });
  });
});
