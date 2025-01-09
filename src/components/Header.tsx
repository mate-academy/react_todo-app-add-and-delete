import React, { useEffect, useRef, useState, useCallback } from 'react';

type Props = {
  hasAllTodosCompleted: boolean;
  isLoading: boolean;
  shouldFocus: boolean;
  onEmptyTitleError: () => void;
  onAddTodo: (title: string) => void;
};

export const Header: React.FC<Props> = ({
  hasAllTodosCompleted,
  isLoading,
  shouldFocus,
  onEmptyTitleError,
  onAddTodo,
}) => {
  const [title, setTitle] = useState('');
  const field = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (title.trim() === '') {
        onEmptyTitleError();

        return;
      }

      try {
        await onAddTodo?.(title.trim());
        setTitle('');
      } catch (error) {
        // console.error('Failed to add a todo:', error);
      }
    },
    [title, onAddTodo, onEmptyTitleError],
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    [],
  );

  useEffect(() => {
    if (field.current && !isLoading && shouldFocus) {
      field.current.focus();
    }
  }, [isLoading, shouldFocus]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${hasAllTodosCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={field}
          value={title}
          onChange={handleTitleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
