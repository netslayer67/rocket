import { BadRequestException } from '@nestjs/common';
import { AnalyticsService } from './analytics/analytics.service';
import { FeedbackService } from './feedback/feedback.service';
import { LearningService } from './feedback/learning.service';
import { parsePattern } from './knowledge/knowledge-pattern';
import { NarrativeJobRunner } from './narratives/narrative-job.runner';
import { NarrativeJobService } from './narratives/narrative-job.service';
import { NarrativesService } from './narratives/narratives.service';

const narrativeId = '507f1f77bcf86cd799439011';

describe('V1 regression smoke path', () => {
  afterEach(() => jest.useRealTimers());

  it('runs persona, DNA, SSE, review, publish, learning, and analytics in order', async () => {
    jest.useFakeTimers();
    const persona = { name: 'Rico test', tone: 'santai', vocabulary: ['gw'], sentenceLength: 'short', thinkingStyle: 'observatif' };
    const dna = parsePattern(JSON.stringify({ topics: ['observasi'], hookType: 'observation', lessonType: 'positive', diagnosis: 'detail kecil membuka diskusi', naturalness: 5 }));
    expect(persona.thinkingStyle).toBe('observatif');
    expect(dna.topics).toEqual(['observasi']);
    expect(dna).not.toHaveProperty('content');

    const saved = { _id: narrativeId, topic: 'waktu ngobrol', personaId: narrativeId, title: 'gw baru kepikiran soal waktu', body: 'gw baru sadar, waktu ngobrol lebih memengaruhi fokus daripada tempatnya.', linkPlacement: 'ending', reviewerNotes: [], status: 'draft' as const };
    const jobs = new NarrativeJobService();
    const jobId = jobs.create();
    const events: string[] = [];
    let persisted = false;
    jobs.events(jobId).subscribe({ next: (event) => { events.push(event.type ?? ''); if (event.type === 'complete') expect(persisted).toBe(true); } });
    const runner = new NarrativeJobRunner({ generate: jest.fn(async (_dto, progress) => { progress('generating', 20, 'Menyusun.'); progress('saved', 90, 'Tersimpan.'); persisted = true; return saved; }) } as never, jobs);
    await runner.run(jobId, { topic: saved.topic, personaId: narrativeId });
    expect(events).toEqual(['queued', 'generating', 'saved', 'complete']);
    jest.runAllTimers();

    let current = { ...saved };
    const narrativeModel = {
      findById: jest.fn(() => ({ lean: jest.fn().mockResolvedValue({ ...current }) })),
      findByIdAndUpdate: jest.fn((_id, update) => ({ lean: jest.fn().mockImplementation(async () => { current = { ...current, ...(update.$set ?? update) }; return { ...current }; }) })),
    };
    const publisher = { publishText: jest.fn().mockResolvedValue({ threadId: 'threads-test-1' }) };
    const narrativeService = new NarrativesService(narrativeModel as never, {} as never, {} as never, {} as never, publisher as never);
    await expect(narrativeService.publish(narrativeId)).rejects.toBeInstanceOf(BadRequestException);
    await narrativeService.approve(narrativeId);
    const published = await narrativeService.publish(narrativeId);
    expect(publisher.publishText).toHaveBeenCalledWith(saved.body);
    expect(published.publishedThreadId).toBe('threads-test-1');

    const feedbackRows = new Map<string, Record<string, unknown>>();
    const logs = new Set<string>();
    const lessons: Record<string, unknown>[] = [];
    const feedbackModel = {
      exists: jest.fn().mockResolvedValue(true),
      create: jest.fn(async (input) => { const item = { ...input, _id: `${input.lessonType}-feedback` }; feedbackRows.set(String(item._id), item); return item; }),
      findById: jest.fn((id) => ({ lean: jest.fn().mockResolvedValue(feedbackRows.get(String(id))) })),
      find: jest.fn(() => ({ limit: jest.fn(() => ({ lean: jest.fn().mockResolvedValue([...feedbackRows.values()].filter((row) => row.approvedForLearning && !row.learnedAt)) })) })),
      updateOne: jest.fn(async (_filter, update) => { const item = feedbackRows.get(String(_filter._id)); if (item) Object.assign(item, update.$set); }),
    };
    const logModel = { exists: jest.fn(async ({ feedbackId }) => logs.has(String(feedbackId))), create: jest.fn(async (row) => { logs.add(String(row.feedbackId)); return row; }) };
    const knowledge = { createLesson: jest.fn(async (input) => { const lesson = { ...input, _id: `lesson-${lessons.length + 1}`, vectorStatus: 'ready' }; lessons.push(lesson); return lesson; }) };
    const learning = new LearningService(feedbackModel as never, logModel as never, { findById: jest.fn(() => ({ lean: jest.fn().mockResolvedValue(current) })) } as never, knowledge as never, { get: jest.fn() } as never);
    const feedback = new FeedbackService(feedbackModel as never, { exists: jest.fn().mockResolvedValue(true) } as never, learning);
    await feedback.create({ narrativeId, lessonType: 'negative', scores: { hook: 2, naturalness: 3 }, notes: 'Hook terlalu umum.', approvedForLearning: true });
    await feedback.create({ narrativeId, lessonType: 'positive', scores: { hook: 9, naturalness: 8 }, notes: 'Observasi terasa hidup.', approvedForLearning: true });
    expect(lessons).toHaveLength(2);
    expect(lessons.every((lesson) => lesson.vectorStatus === 'ready')).toBe(true);
    await expect(feedback.run()).resolves.toMatchObject({ processed: 0, skipped: 2, failed: 0 });
    expect(knowledge.createLesson).toHaveBeenCalledTimes(2);

    const analyticsRows: Record<string, unknown>[] = [];
    const analyticsModel = {
      create: jest.fn(async (row) => { analyticsRows.push(row); return { toObject: () => row }; }),
      find: jest.fn(() => ({ sort: jest.fn(() => ({ limit: jest.fn(() => ({ lean: jest.fn().mockResolvedValue(analyticsRows) })) })) })),
    };
    const analytics = new AnalyticsService(analyticsModel as never, { findById: jest.fn(() => ({ lean: jest.fn().mockResolvedValue(current) })) } as never);
    await analytics.capture({ narrativeId, views: 100, clicks: 12, likes: 8, replies: 3, reposts: 2, quotes: 1 });
    await expect(analytics.summary()).resolves.toMatchObject({ source: 'manual capture', ctr: 12, engagementRate: 14, records: 1 });
  });
});
