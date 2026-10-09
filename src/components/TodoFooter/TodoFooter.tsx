import React from 'react';
import classNames from 'classnames';

type Filter = 'all' | 'active' | 'completed';

type Props = {
  activeTodosCount: number;
  completedTodosCount: number;
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const filters: {
    title: string;
    value: Filter;
    href: string;
  }[] = [
    { title: 'All', value: 'all', href: '#/' },
    { title: 'Active', value: 'active', href: '#/active' },
    { title: 'Completed', value: 'completed', href: '#/completed' },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filterItem => (
          <a
            key={filterItem.value}
            href={filterItem.href}
            className={classNames('filter__link', {
              selected: filter === filterItem.value,
            })}
            onClick={() => onFilterChange(filterItem.value)}
            data-cy={`FilterLink${filterItem.title}`}
          >
            {filterItem.title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
