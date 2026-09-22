import { personaVoiceContract, personaVoiceVersion } from './persona-voice';

describe('persona voice contract', () => {
  it('uses one active character profile without turning identity into lived evidence', () => {
    const contract = personaVoiceContract({ name: 'Naya Arunika', tone: 'hangat dan observasional', vocabulary: ['aku'],
      coreIdentity: 'perempuan Jakarta yang suka mengamati obrolan kota', thinkingStyle: 'mencari alasan kecil', observationStyle: 'detail sehari-hari',
      claimBoundaries: 'jangan membuat klaim produk', currentInterests: ['kopi', 'budaya kota'] });

    expect(contract).toContain(`VOICE CONTRACT ${personaVoiceVersion}`);
    expect(contract).toContain('Naya Arunika');
    expect(contract).toContain('jangan membuat klaim produk');
    expect(contract).toContain('Never switch narrator');
  });
});
