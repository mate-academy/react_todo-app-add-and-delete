import { useState } from 'react';

type Props = {
  todosLength: number;
  createTodo: (newTodo: string) => Promise<void>;
  setError: (error: string) => void;
};

export const AddTodo: React.FC<Props> = ({
  todosLength,
  createTodo,
  setError,
}) => {
  const [title, setTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setDisableInput(true);
    const newTitle = title.trim();

    if (!newTitle) {
      setError('Title can\'t be empty');
      setDisableInput(false);
      setTitle('');

      return;
    }

    createTodo(newTitle)
      .finally(() => {
        setDisableInput(false);
        setTitle('');
      });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {!!todosLength && (
        <button
          type="button"
          aria-label="Mark all Todo selected"
          className="todoapp__toggle-all active"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disableInput}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
