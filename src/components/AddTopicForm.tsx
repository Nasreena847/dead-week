import { useState } from 'react';
import { validateTopicName } from '../utils/topicValidation';

interface AddTopicFormProps {
  existingTopics: string[];
  onAdd(name: string): void;
}

export function AddTopicForm({ existingTopics, onAdd }: AddTopicFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateTopicName(name, existingTopics);
    if (validationError) {
      setError(validationError);
      return;
    }
    onAdd(name);
    setName('');
    setError(null);
  }

  return (
    <form className="add-topic-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          placeholder="Add a topic..."
          aria-label="New topic name"
          aria-describedby={error ? 'topic-error' : undefined}
        />
        {error && (
          <span id="topic-error" className="field-error" role="alert">
            {error}
          </span>
        )}
      </div>
      <button type="submit">Add Topic</button>
    </form>
  );
}
