import { useState } from 'react';
import type { SubjectDraft } from '../types';
import { validateTopicName } from '../utils/topicValidation';

interface AddSubjectFormProps {
  onAdd(draft: SubjectDraft): void;
}

interface FormErrors {
  name?: string;
  examDate?: string;
  topics?: string;
}

export function AddSubjectForm({ onAdd }: AddSubjectFormProps) {
  const [name, setName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [topicInputError, setTopicInputError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleAddTopic() {
    const error = validateTopicName(topicInput, topics);
    if (error) {
      setTopicInputError(error);
      return;
    }
    setTopics((prev) => [...prev, topicInput]);
    setTopicInput('');
    setTopicInputError(null);
    // Clear the topics-level error once at least one topic is added
    setErrors((prev) => ({ ...prev, topics: undefined }));
  }

  function handleTopicInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTopic();
    }
  }

  function handleRemoveTopic(index: number) {
    setTopics((prev) => prev.filter((_, i) => i !== index));
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      errs.name = 'Subject name is required.';
    } else if (name.length > 100) {
      errs.name = 'Subject name cannot exceed 100 characters.';
    }

    if (!examDate) {
      errs.examDate = 'Exam date is required.';
    } else if (isNaN(Date.parse(examDate))) {
      errs.examDate = 'Exam date must be a valid date.';
    }

    if (topics.length === 0) {
      errs.topics = 'At least one topic is required.';
    }

    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onAdd({ name: name.trim(), examDate, topics });

    // Reset all fields on successful submit
    setName('');
    setExamDate('');
    setTopics([]);
    setTopicInput('');
    setTopicInputError(null);
    setErrors({});
  }

  return (
    <form className="add-subject-form" onSubmit={handleSubmit} noValidate>
      <h2>Add Subject</h2>

      {/* Subject name */}
      <div className="form-field">
        <label htmlFor="subject-name">Subject name</label>
        <input
          id="subject-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder="e.g. Advanced Algorithms"
          aria-describedby={errors.name ? 'subject-name-error' : undefined}
        />
        {errors.name && (
          <span id="subject-name-error" className="field-error" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      {/* Exam date */}
      <div className="form-field">
        <label htmlFor="exam-date">Exam date</label>
        <input
          id="exam-date"
          type="date"
          value={examDate}
          onChange={(e) => {
            setExamDate(e.target.value);
            setErrors((prev) => ({ ...prev, examDate: undefined }));
          }}
          aria-describedby={errors.examDate ? 'exam-date-error' : undefined}
        />
        {errors.examDate && (
          <span id="exam-date-error" className="field-error" role="alert">
            {errors.examDate}
          </span>
        )}
      </div>

      {/* Topics */}
      <div className="form-field">
        <label htmlFor="topic-input">Topics</label>

        {topics.length > 0 && (
          <ul className="topic-draft-list">
            {topics.map((topic, index) => (
              <li key={index} className="topic-draft-item">
                <span>{topic}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTopic(index)}
                  aria-label={`Remove topic "${topic}"`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="topic-input-row">
          <input
            id="topic-input"
            type="text"
            value={topicInput}
            onChange={(e) => {
              setTopicInput(e.target.value);
              setTopicInputError(null);
            }}
            onKeyDown={handleTopicInputKeyDown}
            placeholder="Add a topic and press Enter or click +"
            aria-describedby={topicInputError ? 'topic-input-error' : undefined}
          />
          <button type="button" onClick={handleAddTopic} aria-label="Add topic">
            +
          </button>
        </div>

        {topicInputError && (
          <span id="topic-input-error" className="field-error" role="alert">
            {topicInputError}
          </span>
        )}
        {errors.topics && (
          <span id="topics-error" className="field-error" role="alert">
            {errors.topics}
          </span>
        )}
      </div>

      <button type="submit">Add Subject</button>
    </form>
  );
}
