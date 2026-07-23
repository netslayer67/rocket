import { FeedbackService } from './feedback.service';

describe('FeedbackService', () => {
  it('starts learning immediately when feedback is approved', async () => {
    const learning = { learnOne: jest.fn().mockResolvedValue('processed') };
    const service = new FeedbackService(
      { create: jest.fn().mockResolvedValue({ _id: 'feedback-1' }), findById: jest.fn(() => ({ lean: jest.fn().mockResolvedValue({ _id: 'feedback-1' }) })) } as never,
      { exists: jest.fn().mockResolvedValue(true) } as never,
      learning as never,
    );
    await service.create({ narrativeId: '507f1f77bcf86cd799439011', lessonType: 'negative', scores: { hook: 2 }, approvedForLearning: true });
    expect(learning.learnOne).toHaveBeenCalledWith('feedback-1');
  });
});
