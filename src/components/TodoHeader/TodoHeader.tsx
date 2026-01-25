import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  allCompleted: boolean;
  onToggleAll: () => void;

  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;

  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  allCompleted,
  onToggleAll,
  query,
  onQueryChange,
  onSubmit,
  isAdding,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => onQueryChange(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
