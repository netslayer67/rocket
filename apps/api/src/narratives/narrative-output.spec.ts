import { narrativeOutputGate } from './narrative-output';

describe('narrative output gate', () => {
  const persona = { name: 'Naya Arunika', tone: 'hangat', vocabulary: ['aku'], sentenceLength: 'medium' as const, emojiHabit: '', interactionStyle: '' };

  it('rejects a generic or hard-selling response before it becomes a draft', () => {
    const content = JSON.stringify({ title: 'Kopi bukan sekadar minuman', body: 'Aku baru sadar kopi ini premium. Beli sekarang.', linkPlacement: 'ending' });
    expect(narrativeOutputGate(content, 'kopi', persona, { description: '' })).toBe('voice-quality');
  });

  it('accepts a concrete active-persona observation', () => {
    const content = JSON.stringify({ title: 'aku masih kepikiran suara mesin kopi pagi tadi', body: 'Aku baru sadar antrean kopi pagi selalu bikin orang buru-buru, padahal ada jeda kecil ketika pesanan dipanggil. Aku jadi penasaran kenapa momen itu terasa lebih tenang dari yang kukira.', linkPlacement: 'ending' });
    expect(narrativeOutputGate(content, 'ritual kopi pagi', persona, { description: '' })).toBe('accepted');
  });
});
