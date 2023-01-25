import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  todos: Todo[],
};

export const Header: React.FC<Props> = ({ newTodoField, todos }) => {
  return (
    <header className="todoapp__header">

      {todos.length
        ? (
        /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />
        ) : null}

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
