import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';

interface Props {
  todosCount: number;
  isAllCompleted: boolean;
  onAddTodo: (title: string) => Promise<void>;
  isDisabled: boolean;
  onError: (message: ErrorMessage) => void;
  loadingTodoIds: number[];
}

export const Header: React.FC<Props> = ({
  todosCount,
  isAllCompleted,
  onAddTodo,
  isDisabled,
  onError,
  loadingTodoIds,
}) => {
  const [title, setTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDisabled && loadingTodoIds.length === 0) {
      newTodoField.current?.focus();
    }
  }, [isDisabled, loadingTodoIds]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError(ErrorMessage.Title);

      return;
    }

    try {
      await onAddTodo(trimmedTitle);
      setTitle('');
    } catch {
    } finally {
      newTodoField.current?.focus();
    }
  };

  return (
    <header className="todoapp__header">
      {todosCount > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${isAllCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={newTodoField}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
