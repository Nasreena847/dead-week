import type { Subject } from '../types';
import { Tombstone } from './Tombstone';

interface GraveyardProps {
  subjects: Subject[];
  onDelete(id: string): void;
  onAddTopic(subjectId: string, name: string): void;
  onRemoveTopic(subjectId: string, topicId: string): void;
  onToggleTopic(subjectId: string, topicId: string): void;
}

export function Graveyard({ subjects, onDelete, onAddTopic, onRemoveTopic, onToggleTopic }: GraveyardProps) {
  if (subjects.length === 0) {
    return (
      <div className="graveyard graveyard--empty">
        <p className="graveyard-empty-message">
          No subjects yet. Add your first subject to begin haunting.
        </p>
      </div>
    );
  }

  return (
    <div className="graveyard">
      {subjects.map((subject) => (
        <Tombstone
          key={subject.id}
          subject={subject}
          onDelete={() => onDelete(subject.id)}
          onAddTopic={(name) => onAddTopic(subject.id, name)}
          onRemoveTopic={(topicId) => onRemoveTopic(subject.id, topicId)}
          onToggleTopic={(topicId) => onToggleTopic(subject.id, topicId)}
        />
      ))}
    </div>
  );
}
