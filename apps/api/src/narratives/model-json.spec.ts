import { parseSuggestion } from './narrative-parsers';
import { parseModelJsonObject } from './model-json';

describe('model JSON normalization', () => {
  it('extracts one object from harmless surrounding text', () => {
    expect(parseModelJsonObject('Berikut hasilnya: {"title":"draft"}')).toEqual({ title: 'draft' });
  });

  it('rejects malformed text instead of inventing an object', () => {
    expect(() => parseModelJsonObject('```json\n{"title":}\n```')).toThrow('did not contain one JSON object');
  });

  it('keeps grounded reference-angle parsing after normalization', () => {
    const reference = { title: 'Earphone Bluetooth', description: '', fetched: false, host: 'shopee.co.id' };
    const content = '```json\n{"angles":[{"title":"Kenapa suara earphone murah sering bikin orang cepat lelah?","confidence":0.6,"reason":"Membuka kebutuhan memilih tanpa klaim produk.","evidence":["reference-title"]}]}\n```';

    expect(parseSuggestion(content, reference).origin).toBe('model');
  });
});
