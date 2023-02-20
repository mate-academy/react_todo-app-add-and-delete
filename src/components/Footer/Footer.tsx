import React from 'react';
import classNames from 'classnames';

import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  status: Filter,
  onStatusChange: (status: Filter) => void;
  todos: Todo[],
  onTodoDelete: () => void,
};

export const Footer: React.FC<Props> = ({
  status,
  onStatusChange,
  todos,
  onTodoDelete,
}) => {
  const todosOnPage = todos.filter(todo => !todo.completed);
  const completedTodos
  = todos.filter(todo => todo.completed)
    .map(todo => todo.id);

  const isButtonActive = {
    opacity: completedTodos.length === 0
      ? 0
      : 1,
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosOnPage.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: status === Filter.ALL },
          )}
          onClick={() => onStatusChange(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: status === Filter.ACTIVE },
          )}
          onClick={() => onStatusChange(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: status === Filter.COMPLETED },
          )}
          onClick={() => onStatusChange(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        style={isButtonActive}
        onClick={onTodoDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
