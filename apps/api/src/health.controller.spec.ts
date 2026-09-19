import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns a liveness response', () => {
    expect(new HealthController().status()).toEqual({ status: 'ok' });
  });
});
