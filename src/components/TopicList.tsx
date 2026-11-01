import type { Topic } from '../types';
import { TopicItem } from './TopicItem';

interface TopicListProps {
  topics: Topic[];
  onToggle(id: string): void;
  onRemove(id: string): void;
}

export function TopicList({ topics, onToggle, onRemove }: TopicListProps) {
  return (
    <ul className="topic-list">
      {topics.map((topic) => (
        <TopicItem
          key={topic.id}
          topic={topic}
          onToggle={() => onToggle(topic.id)}
          onRemove={() => onRemove(topic.id)}
        />
      ))}
    </ul>
  );
}
