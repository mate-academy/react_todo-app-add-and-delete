import React from 'react';
import classNames from 'classnames';

type Props = {
  todosCount?: number;
  activeCount?: number;
  title?: string;
  isSubmitting?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  setTitle?: (title: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
};

export const Header: React.FC<Props> = ({
  todosCount = 0,
  activeCount = 0,
  title = '',
  isSubmitting = false,
  inputRef,
  setTitle,
  onSubmit,
}) => {
  const isAllCompleted = todosCount > 0 && activeCount === 0;

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

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle?.(e.target.value)}
          disabled={isSubmitting}
          autoFocus
        />
      </form>
    </header>
  );
};
