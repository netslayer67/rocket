import { PersonasService } from './personas.service';

describe('PersonasService canonical profile', () => {
  it('adopts the newest legacy profile and archives the others once', async () => {
    const legacy = { _id: 'latest', name: 'Nara' };
    const personas = {
      findOne: jest.fn((filter) => filter.active ? { lean: jest.fn().mockResolvedValue(null) } : { sort: jest.fn(() => ({ lean: jest.fn().mockResolvedValue(legacy) })) }),
      updateOne: jest.fn().mockResolvedValue({}), updateMany: jest.fn().mockResolvedValue({}),
      findById: jest.fn(() => ({ lean: jest.fn().mockResolvedValue({ ...legacy, active: true }) })),
    };
    const service = new PersonasService(personas as never, {} as never);

    await expect(service.findActive()).resolves.toMatchObject({ _id: 'latest', active: true });
    expect(personas.updateMany).toHaveBeenCalledWith({ _id: { $ne: 'latest' }, archivedAt: { $exists: false } }, { $set: expect.objectContaining({ active: false }) });
  });

  it('updates one active profile and derives review signals without a quality score', async () => {
    const active = { _id: 'active', name: 'Nara', active: true };
    const personas = {
      findOne: jest.fn(() => ({ lean: jest.fn().mockResolvedValue(active) })),
      findByIdAndUpdate: jest.fn(() => ({ lean: jest.fn().mockResolvedValue({ ...active, tone: 'observatif' }) })),
    };
    const narratives = { find: jest.fn(() => ({ select: jest.fn(() => ({ lean: jest.fn().mockResolvedValue([
      { reviewerNotes: ['Review blocked: Diagnosis persona: missing context.', 'Review blocked: AI generic terdeteksi.'] },
    ]) })) })) };
    const service = new PersonasService(personas as never, narratives as never);

    await service.saveActive({ name: 'Nara', tone: 'observatif', vocabulary: ['aku'], sentenceLength: 'short' });
    await expect(service.quality()).resolves.toEqual({ windowDays: 30, drafts: 1, persona: 1, specificity: 0, generic: 1, productInjection: 0 });
    expect(personas.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  });
});
