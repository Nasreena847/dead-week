export interface Topic {
  id: string;          // uuid v4 generated at creation time
  name: string;        // 1–100 characters, unique within a Subject
  studied: boolean;
}

export interface Subject {
  id: string;          // uuid v4 generated at creation time
  name: string;        // 1–100 characters
  examDate: string;    // ISO 8601 date string, e.g. "2025-10-31"
  topics: Topic[];
  curseLevel: number;  // 0–100 integer, derived; stored for fast reads
}

export interface SubjectDraft {
  name: string;
  examDate: string;
  topics: string[];    // raw names; converted to Topic objects in useSubjects
}

export type TombstoneState = 'calm' | 'flickering' | 'cracked' | 'haunted';

export const STORAGE_KEY = "dead-week:subjects";
