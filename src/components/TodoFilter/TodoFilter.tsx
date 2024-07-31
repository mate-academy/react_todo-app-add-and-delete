import React from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  activeTodosCount: number;
  areThereCompletedTodos: boolean;
  clearCompletedTodos: () => void;
};

export const TodoFilter: React.FC<Props> = ({
  filter,
  setFilter,
  activeTodosCount,
  areThereCompletedTodos,
  clearCompletedTodos,
}) => {
  const filters = [
    { value: Filter.all, label: 'All', href: '#' },
    { value: Filter.active, label: 'Active', href: '#/active' },
    { value: Filter.completed, label: 'Completed', href: '#/completed' },
  ];

  const handleFilterChange = (value: Filter) => {
    setFilter(value);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ value, label, href }) => (
          <a
            key={value}
            href={href}
            className={cn('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${label}`}
            onClick={() => handleFilterChange(value)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!areThereCompletedTodos}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
