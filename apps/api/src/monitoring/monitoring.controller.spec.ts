import { MonitoringController } from './monitoring.controller';

describe('MonitoringController', () => {
  it('routes history, stream, and confirmed actions to the service', async () => {
    const monitoring = {
      history: jest.fn().mockResolvedValue({ events: [] }), events: jest.fn().mockReturnValue([]),
      retry: jest.fn().mockResolvedValue({ jobId: 'new-job' }), reindex: jest.fn().mockResolvedValue({ indexed: 1 }), runLearning: jest.fn().mockResolvedValue({ processed: 1 }),
    };
    const controller = new MonitoringController(monitoring as never);
    await expect(controller.history()).resolves.toEqual({ events: [] });
    expect(controller.events()).toEqual([]);
    await expect(controller.retry({ jobId: 'job', confirmed: true })).resolves.toEqual({ jobId: 'new-job' });
    await expect(controller.reindex({ confirmed: true })).resolves.toEqual({ indexed: 1 });
    await expect(controller.learning({ confirmed: true })).resolves.toEqual({ processed: 1 });
    expect(monitoring.retry).toHaveBeenCalledWith('job');
    expect(monitoring.reindex).toHaveBeenCalled();
    expect(monitoring.runLearning).toHaveBeenCalled();
  });
});
