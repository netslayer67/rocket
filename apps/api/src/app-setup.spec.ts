import { corsOrigins } from './app-setup';

describe('app setup', () => {
  it('parses configured CORS origins', () => {
    expect(corsOrigins('https://web.example, https://preview.example')).toEqual([
      'https://web.example',
      'https://preview.example',
    ]);
  });

  it('uses the local dashboard default', () => {
    expect(corsOrigins()).toEqual(['http://localhost:3000']);
  });
});
