import './styles/global.css';
import './styles/graveyard.css';
import './styles/tombstone.css';
import { useSubjects } from './hooks/useSubjects';
import { AddSubjectForm } from './components/AddSubjectForm';
import { Graveyard } from './components/Graveyard';

export default function App() {
  const {
    subjects,
    storageError,
    addSubject,
    deleteSubject,
    addTopic,
    removeTopic,
    toggleTopic,
  } = useSubjects();

  return (
    <div className="app">
      {storageError && (
        <div className="storage-error-banner" role="alert">
          {storageError}
        </div>
      )}
      <header className="app-header">
        <h1>☠ Dead Week</h1>
      </header>
      <main className="app-main">
        <AddSubjectForm onAdd={addSubject} />
        <Graveyard
          subjects={subjects}
          onDelete={deleteSubject}
          onAddTopic={addTopic}
          onRemoveTopic={removeTopic}
          onToggleTopic={toggleTopic}
        />
      </main>
    </div>
  );
}
