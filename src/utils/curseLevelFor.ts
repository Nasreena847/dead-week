import type { Subject } from '../types';

/**
 * Computes the curse level for a subject.
 * Returns an integer in [0, 100].
 */
export function curseLevelFor(subject: Subject): number {
  const { topics, examDate } = subject;

  // No topics → not cursed
  if (topics.length === 0) return 0;

  const unstudied = topics.filter(t => !t.studied).length;

  // All studied → fully safe
  if (unstudied === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate);
  exam.setHours(0, 0, 0, 0);
  const daysRemaining = Math.floor((exam.getTime() - today.getTime()) / 86_400_000);

  // Exam today or past + unstudied → max curse
  if (daysRemaining <= 0) return 100;

  const topicComponent = (unstudied / topics.length) * 50;
  const timeComponent = Math.max(0, Math.min(1, (30 - daysRemaining) / 30)) * 50;

  return Math.round(topicComponent + timeComponent);
}
