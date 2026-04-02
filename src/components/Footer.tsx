import React from 'react';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  activeTodosCount: number;
  filter: Status;
  setFilter: (value: Status) => void;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  activeTodosCount,
  filter,
  setFilter,
  clearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      {Object.values(Status).map(statusValue => (
        <a
          key={statusValue}
          href={statusValue === Status.All ? '#/' : `#/${statusValue}`}
          className={classNames('filter__link', {
            selected: filter === statusValue,
          })}
          data-cy={`FilterLink${statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}`}
          onClick={() => setFilter(statusValue)}
        >
          {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!todos.some(todo => todo.completed)}
      onClick={clearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
