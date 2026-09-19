import { FeedbackController } from './feedback.controller';

describe('FeedbackController cron', () => {
  const original = process.env.CRON_SECRET;
  afterEach(() => { process.env.CRON_SECRET = original; });

  it('runs learning for a valid bearer secret', async () => {
    process.env.CRON_SECRET = 'test-secret';
    const feedback = { run: jest.fn().mockResolvedValue({ processed: 1 }) };
    await expect(new FeedbackController(feedback as never).cron('Bearer test-secret')).resolves.toEqual({ processed: 1 });
  });

  it('rejects missing or invalid cron authorization', async () => {
    process.env.CRON_SECRET = 'test-secret';
    const feedback = { run: jest.fn() };
    expect(() => new FeedbackController(feedback as never).cron('Bearer wrong')).toThrow('Invalid cron authorization');
    expect(feedback.run).not.toHaveBeenCalled();
  });
});
