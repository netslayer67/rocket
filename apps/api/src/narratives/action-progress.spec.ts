import { nextProgress, progressDetail } from '../../../web/src/lib/action-progress';

describe('narrative action progress', () => {
  it('advances without claiming completion before a request resolves', () => {
    expect(nextProgress(8)).toBe(17);
    expect(nextProgress(91)).toBe(92);
    expect(nextProgress(92)).toBe(92);
  });

  it('uses distinct copy for generation and link suggestions', () => {
    expect(progressDetail('generate', 60, 'pending')).toContain('Menyusun narasi');
    expect(progressDetail('suggest', 60, 'pending')).toContain('sudut topik');
  });
});
