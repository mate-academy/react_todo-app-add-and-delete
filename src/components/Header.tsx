import React from 'react';
import classNames from 'classnames';

interface HeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: () => void;
  isDisabled: boolean;
  onToggleAll?: () => void;
  isAllCompleted?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onTitleChange,
  onSubmit,
  isDisabled,
  onToggleAll,
  isAllCompleted,
}) => (
  <header className="todoapp__header">
    {onToggleAll && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
        aria-label="Toggle all todos"
      />
    )}

    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        disabled={isDisabled}
        autoFocus
      />
    </form>
  </header>
);
