// .. FormAdd.tsx
import { useState, useRef, useEffect } from 'react';

interface FormAddProps {
  handleAddTodo: (title: string) => Promise<boolean>;
  allCompleted: boolean;
  hasTodos: boolean;
  isAdding: boolean;
  shouldFocusInput: boolean;
  setShouldFocusInput: (value: boolean) => void;
}

export const FormAdd = ({
  handleAddTodo,
  allCompleted,
  hasTodos,
  isAdding,
  shouldFocusInput,
  setShouldFocusInput,
}: FormAddProps) => {
  const [query, setQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const isAdded = await handleAddTodo(query);

    if (isAdded) {
      setQuery('');
    }
  };

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    if (shouldFocusInput) {
      inputRef.current?.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput, setShouldFocusInput]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={
            allCompleted ? 'todoapp__toggle-all active' : 'todoapp__toggle-all'
          }
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQueryChange}
          disabled={isAdding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
