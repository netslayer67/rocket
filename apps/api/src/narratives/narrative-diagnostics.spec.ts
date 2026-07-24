import { diagnoseReviewNotes } from './narrative-diagnostics';

describe('narrative diagnostics', () => {
  it('maps blocking review notes to stable dimensions', () => {
    const diagnostics = diagnoseReviewNotes([
      'Review blocked: Product Injection Score 80/100.',
      'Review blocked: Diagnosis evidence: unsupported claim.',
      'Review blocked: Topic drift terdeteksi.',
    ]);

    expect(diagnostics).toEqual([
      expect.objectContaining({ code: 'PRODUCT_INJECTION', dimension: 'reference', severity: 'blocking' }),
      expect.objectContaining({ code: 'EVIDENCE_PROVENANCE', dimension: 'evidence', severity: 'blocking' }),
      expect.objectContaining({ code: 'TOPIC_DRIFT', dimension: 'topic', severity: 'blocking' }),
    ]);
  });

  it('keeps unknown notes and returns no output for a clean review', () => {
    expect(diagnoseReviewNotes(['Catatan baru'])).toEqual([expect.objectContaining({ code: 'OTHER_REVIEW_NOTE' })]);
    expect(diagnoseReviewNotes([])).toEqual([]);
  });
});
