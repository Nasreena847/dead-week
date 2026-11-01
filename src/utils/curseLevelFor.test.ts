import { describe, it, expect } from 'vitest';
import { curseLevelFor } from './curseLevelFor';
import type { Subject } from '../types';

// Helpers
function makeSubject(
  examDate: string,
  topics: Array<{ name: string; studied: boolean }>
): Subject {
  return {
    id: 'test-id',
    name: 'Test Subject',
    examDate,
    curseLevel: 0,
    topics: topics.map((t, i) => ({ id: `t${i}`, name: t.name, studied: t.studied })),
  };
}

/** Returns an ISO date string offset by `days` from today */
function dateInDays(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

describe('curseLevelFor', () => {
  describe('edge cases – no topics / all studied', () => {
    it('returns 0 when topic list is empty', () => {
      expect(curseLevelFor(makeSubject(dateInDays(5), []))).toBe(0);
    });

    it('returns 0 when all topics are studied (future exam)', () => {
      const s = makeSubject(dateInDays(10), [
        { name: 'A', studied: true },
        { name: 'B', studied: true },
      ]);
      expect(curseLevelFor(s)).toBe(0);
    });

    it('returns 0 when all topics are studied even if exam is today', () => {
      const s = makeSubject(dateInDays(0), [
        { name: 'A', studied: true },
      ]);
      expect(curseLevelFor(s)).toBe(0);
    });

    it('returns 0 when all topics are studied even if exam is in the past', () => {
      const s = makeSubject(dateInDays(-5), [
        { name: 'A', studied: true },
      ]);
      expect(curseLevelFor(s)).toBe(0);
    });
  });

  describe('exam today or past with unstudied topics → 100', () => {
    it('returns 100 when exam is today and a topic is unstudied', () => {
      const s = makeSubject(dateInDays(0), [{ name: 'A', studied: false }]);
      expect(curseLevelFor(s)).toBe(100);
    });

    it('returns 100 when exam was yesterday and a topic is unstudied', () => {
      const s = makeSubject(dateInDays(-1), [{ name: 'A', studied: false }]);
      expect(curseLevelFor(s)).toBe(100);
    });

    it('returns 100 when exam was a week ago and topics are unstudied', () => {
      const s = makeSubject(dateInDays(-7), [
        { name: 'A', studied: false },
        { name: 'B', studied: true },
      ]);
      expect(curseLevelFor(s)).toBe(100);
    });
  });

  describe('formula – topic component + time component', () => {
    it('returns 50 when half topics unstudied and exam is > 30 days away', () => {
      // topicComponent = (1/2)*50 = 25
      // timeComponent  = max(0, min(1, (30-31)/30))*50 = 0
      // total = 25
      const s = makeSubject(dateInDays(31), [
        { name: 'A', studied: false },
        { name: 'B', studied: true },
      ]);
      expect(curseLevelFor(s)).toBe(25);
    });

    it('returns 50 when all topics unstudied and exam is > 30 days away', () => {
      // topicComponent = (2/2)*50 = 50
      // timeComponent  = 0
      // total = 50
      const s = makeSubject(dateInDays(31), [
        { name: 'A', studied: false },
        { name: 'B', studied: false },
      ]);
      expect(curseLevelFor(s)).toBe(50);
    });

    it('curse level increases as days remaining decreases (more time pressure)', () => {
      // With all topics unstudied, a closer exam date yields a higher curse level.
      // We compare two future dates rather than pinning an exact number,
      // which avoids DST / UTC-parse ambiguity.
      const farSubject = makeSubject(dateInDays(29), [
        { name: 'A', studied: false },
        { name: 'B', studied: false },
      ]);
      const nearSubject = makeSubject(dateInDays(1), [
        { name: 'A', studied: false },
        { name: 'B', studied: false },
      ]);
      expect(curseLevelFor(nearSubject)).toBeGreaterThan(curseLevelFor(farSubject));
    });

    it('curse level for half-unstudied is always less than all-unstudied at the same exam date', () => {
      const date = dateInDays(10);
      const allUnstudied = makeSubject(date, [
        { name: 'A', studied: false },
        { name: 'B', studied: false },
      ]);
      const halfUnstudied = makeSubject(date, [
        { name: 'A', studied: false },
        { name: 'B', studied: true },
      ]);
      expect(curseLevelFor(halfUnstudied)).toBeLessThan(curseLevelFor(allUnstudied));
    });

    it('clamps time component when exam is more than 30 days away', () => {
      // timeComponent must be 0 when daysRemaining > 30
      const s = makeSubject(dateInDays(60), [{ name: 'A', studied: false }]);
      // topicComponent = 50, timeComponent = 0
      expect(curseLevelFor(s)).toBe(50);
    });

    it('result is always an integer', () => {
      const s = makeSubject(dateInDays(7), [
        { name: 'A', studied: false },
        { name: 'B', studied: false },
        { name: 'C', studied: true },
      ]);
      const result = curseLevelFor(s);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('result is within [0, 100] for various inputs', () => {
      const cases: [number, Array<{ name: string; studied: boolean }>][] = [
        [1, [{ name: 'A', studied: false }]],
        [30, [{ name: 'A', studied: false }, { name: 'B', studied: true }]],
        [100, [{ name: 'A', studied: false }]],
        [-5, [{ name: 'A', studied: false }]],
      ];
      for (const [days, topics] of cases) {
        const level = curseLevelFor(makeSubject(dateInDays(days), topics));
        expect(level).toBeGreaterThanOrEqual(0);
        expect(level).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('visual-state boundary values', () => {
    // These concrete examples pin specific numbers so regressions are caught.
    it('returns 0 for no-topic subject (calm)', () => {
      expect(curseLevelFor(makeSubject(dateInDays(5), []))).toBe(0);
    });

    it('returns 100 for exam-today with unstudied (haunted)', () => {
      const s = makeSubject(dateInDays(0), [{ name: 'A', studied: false }]);
      expect(curseLevelFor(s)).toBe(100);
    });

    it('returns 50 for all-unstudied, > 30 days away (flickering boundary)', () => {
      const s = makeSubject(dateInDays(35), [
        { name: 'A', studied: false },
        { name: 'B', studied: false },
      ]);
      expect(curseLevelFor(s)).toBe(50);
    });
  });
});
