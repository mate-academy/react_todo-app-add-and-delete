import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  filter: string,
  setFilter: (filter: Filters) => void;
  onClearCompleted: () => void,
};

enum Filters {
  Active = 'active',
  Completed = 'completed',
  All = 'all',
}

export const Footer: React.FC<Props> = ({
  todos, filter, setFilter, onClearCompleted,
}) => {
  const completedTodos = todos.filter(todo => todo.completed).length;
  const unCompletedTodos = todos.filter(todo => !todo.completed).length;

  const filters = [
    {
      label: 'All',
      filter: Filters.All,
    },
    {
      label: 'Active',
      filter: Filters.Active,
    },
    {
      label: 'Completed',
      filter: Filters.Completed,
    },
  ];

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${unCompletedTodos} items left`}
      </span>

      <nav className="filter">
        {filters.map((f) => (
          <a
            href="#/"
            key={f.filter}
            className={classNames(
              'filter__link',
              { selected: filter === f.filter },
            )}
            onClick={() => {
              setFilter(f.filter);
            }}
          >
            {f.label}
          </a>
        ))}
      </nav>

      {completedTodos > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => onClearCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
