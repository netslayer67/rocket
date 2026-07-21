import { parsePattern, retrievalText } from './knowledge-pattern';
import { vectorPointId } from './vector-id';

describe('knowledge pattern helpers', () => {
  it('keeps only compact pattern fields and creates a stable vector ID', () => {
    const pattern = parsePattern('{"topics":["Kebiasaan"],"naturalness":9,"vocabulary":["gue"]}');
    expect(pattern.topics).toEqual(['kebiasaan']);
    expect(pattern.naturalness).toBe(5);
    expect(retrievalText(pattern)).toContain('Topics: kebiasaan');
    expect(vectorPointId('abc')).toMatch(/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/);
    expect(vectorPointId('abc')).toBe(vectorPointId('abc'));
  });
});
