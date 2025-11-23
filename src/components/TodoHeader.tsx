import React, { useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';

type Props = {
  activeTodos: number;
  todosLength: number;
  onAdd: (title: string) => void;
  onToggleAll: () => void;
  disabled?: boolean;
  resetSignal: number;
};

export const TodoHeader: React.FC<Props> = ({
  activeTodos,
  todosLength,
  onAdd,
  onToggleAll,
  disabled = false,
  resetSignal,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, resetSignal]);

  useEffect(() => {
    setTitle('');
  }, [resetSignal]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onAdd(title);
    },
    [title, onAdd],
  );

  const allCompleted = todosLength > 0 && activeTodos === 0;

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
        disabled={todosLength === 0}
        aria-label="Toggle all todos"
      />

      <form data-cy="NewTodoForm" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Escape' && setTitle('')}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
