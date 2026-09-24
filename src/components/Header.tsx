import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

interface Props {
  todosCount: number;
  activeTodosCount: number;
  onAddTodo: (title: string) => Promise<void>;
  isSubmitting: boolean;
  onError: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  todosCount,
  activeTodosCount,
  onAddTodo,
  isSubmitting,
  onError,
  inputRef,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [inputRef, isSubmitting]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError('Title should not be empty');
    }

    onAddTodo(trimmedTitle)
      .then(() => {
        setTitle('');
      })
      .catch(() => {});
  };

  const isAllCompleted = todosCount > 0 && activeTodosCount === 0;

  return (
    <header className="todoapp__header">
      {todosCount > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={isSubmitting}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
