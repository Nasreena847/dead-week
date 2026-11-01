import type { Topic } from '../types';

interface TopicItemProps {
  topic: Topic;
  onToggle(): void;
  onRemove(): void;
}

export function TopicItem({ topic, onToggle, onRemove }: TopicItemProps) {
  return (
    <li className="topic-item">
      <label className="topic-label">
        <input
          type="checkbox"
          checked={topic.studied}
          onChange={onToggle}
        />
        <span className={topic.studied ? 'topic-name studied' : 'topic-name'}>
          {topic.name}
        </span>
      </label>
      <button
        type="button"
        className="topic-remove"
        onClick={onRemove}
        aria-label={`Remove topic: ${topic.name}`}
      >
        ✕
      </button>
    </li>
  );
}
