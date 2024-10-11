import React from 'react';
import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/filterStatus';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  todosCount: number;
  clearCompleted: () => void;
  filter: string;
  setFilter: (filter: string) => void;
};

export const Footer: React.FC<Props> = ({
  todosCount,
  clearCompleted,
  filter,
  setFilter,
  todos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(status => (
          <a
            key={status}
            data-cy={`FilterLink${status.charAt(0).toUpperCase() + status.slice(1)}`}
            href={`#/${status}`}
            className={classNames('filter__link', {
              selected: filter === status,
            })}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={todos.every(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
