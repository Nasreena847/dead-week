import type { Subject } from '../types';
import { getTombstoneState } from '../utils/getTombstoneState';
import { CurseLevelBadge } from './CurseLevelBadge';
import { TopicList } from './TopicList';
import { AddTopicForm } from './AddTopicForm';

interface TombstoneProps {
  subject: Subject;
  onDelete(): void;
  onAddTopic(name: string): void;
  onRemoveTopic(id: string): void;
  onToggleTopic(id: string): void;
}

export function Tombstone({ subject, onDelete, onAddTopic, onRemoveTopic, onToggleTopic }: TombstoneProps) {
  const state = getTombstoneState(subject.curseLevel);

  return (
    <article className="tombstone" data-state={state}>
      <header className="tombstone-header">
        <h2 className="tombstone-name">{subject.name}</h2>
        <CurseLevelBadge curseLevel={subject.curseLevel} />
      </header>
      <p className="tombstone-exam-date">Exam: {subject.examDate}</p>
      <TopicList
        topics={subject.topics}
        onToggle={onToggleTopic}
        onRemove={onRemoveTopic}
      />
      <AddTopicForm
        existingTopics={subject.topics.map((t) => t.name)}
        onAdd={onAddTopic}
      />
      <button
        type="button"
        className="tombstone-delete"
        onClick={onDelete}
        aria-label={`Delete subject: ${subject.name}`}
      >
        Delete Subject
      </button>
    </article>
  );
}
