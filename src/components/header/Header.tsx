import React, { useEffect, useRef, useState } from 'react';

interface Props {
  setError: (error: string) => void;
  onAdd: (title: string) => void;
}

export const Header: React.FC<Props> = ({ setError, onAdd }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    setIsLoading(true);

    try {
      await onAdd(title.trim());
      setTitle('');
    } catch {
      setError('Unable to add todo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isLoading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
