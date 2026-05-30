import React from 'react';
import classNames from 'classnames';

type Props = {
  hasTodos: boolean;
  allTodosCompleted: boolean;
  newTodoTitle: string;
  isCreating: boolean;
  onNewTodoTitleChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  hasTodos,
  allTodosCompleted,
  newTodoTitle,
  isCreating,
  onNewTodoTitleChange,
  onSubmit,
  onToggleAll,
}) => (
  <header className="todoapp__header">
    {hasTodos && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allTodosCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
    )}

    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={e => onNewTodoTitleChange(e.target.value)}
        disabled={isCreating}
        autoFocus
      />
    </form>
  </header>
);
