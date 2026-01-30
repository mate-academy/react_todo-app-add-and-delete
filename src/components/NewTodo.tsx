import cn from 'classnames';
import React, { RefObject } from 'react';

type Props = {
  onSubmit: (value: React.FormEvent) => void;
  onSetTitle: (query: string) => void;
  activeTodos: number;
  todosQuantity: number;
  onFocus: RefObject<HTMLInputElement>;
  isDisabled: boolean;
  query: string;
};

export const NewTodo: React.FC<Props> = ({
  onSubmit,
  activeTodos,
  todosQuantity,
  onFocus,
  onSetTitle,
  isDisabled,
  query,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todosQuantity > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: activeTodos === 0 })}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => {
            onSetTitle(event.target.value);
          }}
          disabled={isDisabled}
          ref={onFocus}
        />
      </form>
    </header>
  );
};
