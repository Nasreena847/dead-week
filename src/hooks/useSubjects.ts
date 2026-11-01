import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Subject, Topic, SubjectDraft } from '../types';
import { STORAGE_KEY } from '../types';
import { curseLevelFor } from '../utils/curseLevelFor';
import { validateTopicName } from '../utils/topicValidation';

export interface UseSubjectsResult {
  subjects: Subject[];
  storageError: string | null;
  addSubject(draft: SubjectDraft): void;
  deleteSubject(id: string): void;
  addTopic(subjectId: string, name: string): string | null;
  removeTopic(subjectId: string, topicId: string): void;
  toggleTopic(subjectId: string, topicId: string): void;
}

function persistSubjects(subjects: Subject[]): string | null {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    return null;
  } catch (err) {
    console.error('Failed to write to localStorage:', err);
    return 'Could not save — changes may be lost after refresh.';
  }
}

function recomputeCurseLevel(subject: Subject): Subject {
  return { ...subject, curseLevel: curseLevelFor(subject) };
}

export function useSubjects(): UseSubjectsResult {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return [];
      return JSON.parse(raw) as Subject[];
    } catch (err) {
      console.error('Failed to parse subjects from localStorage:', err);
      return [];
    }
  });

  const [storageError, setStorageError] = useState<string | null>(null);

  function addSubject(draft: SubjectDraft): void {
    const newSubject: Subject = {
      id: uuidv4(),
      name: draft.name,
      examDate: draft.examDate,
      topics: draft.topics.map((topicName) => ({
        id: uuidv4(),
        name: topicName,
        studied: false,
      })),
      curseLevel: 0, // will be recomputed below
    };
    newSubject.curseLevel = curseLevelFor(newSubject);

    const next = [...subjects, newSubject];
    setSubjects(next);
    const err = persistSubjects(next);
    setStorageError(err);
  }

  function deleteSubject(id: string): void {
    const next = subjects.filter((s) => s.id !== id);
    setSubjects(next);
    const err = persistSubjects(next);
    setStorageError(err);
  }

  function addTopic(subjectId: string, name: string): string | null {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return 'Subject not found.';

    const existingNames = subject.topics.map((t) => t.name);
    const validationError = validateTopicName(name, existingNames);
    if (validationError !== null) return validationError;

    const newTopic: Topic = {
      id: uuidv4(),
      name,
      studied: false,
    };

    const updatedSubject = recomputeCurseLevel({
      ...subject,
      topics: [...subject.topics, newTopic],
    });

    const next = subjects.map((s) => (s.id === subjectId ? updatedSubject : s));
    setSubjects(next);
    const err = persistSubjects(next);
    setStorageError(err);
    return null;
  }

  function removeTopic(subjectId: string, topicId: string): void {
    const next = subjects.map((s) => {
      if (s.id !== subjectId) return s;
      return recomputeCurseLevel({
        ...s,
        topics: s.topics.filter((t) => t.id !== topicId),
      });
    });
    setSubjects(next);
    const err = persistSubjects(next);
    setStorageError(err);
  }

  function toggleTopic(subjectId: string, topicId: string): void {
    const next = subjects.map((s) => {
      if (s.id !== subjectId) return s;
      return recomputeCurseLevel({
        ...s,
        topics: s.topics.map((t) =>
          t.id === topicId ? { ...t, studied: !t.studied } : t,
        ),
      });
    });
    setSubjects(next);
    const err = persistSubjects(next);
    setStorageError(err);
  }

  return {
    subjects,
    storageError,
    addSubject,
    deleteSubject,
    addTopic,
    removeTopic,
    toggleTopic,
  };
}
