import React from 'react';
import classNames from 'classnames';

type Filter = 'all' | 'active' | 'completed';

type FilterOption = {
  value: Filter;
  label: string;
  href: string;
};

type Props = {
  activeTodosCount: number;
  filter: Filter;
  setFilter: (value: Filter) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  filter,
  setFilter,
  hasCompleted,
  onClearCompleted,
}) => {
  const filters: FilterOption[] = [
    {
      value: 'all',
      label: 'All',
      href: '#/',
    },
    {
      value: 'active',
      label: 'Active',
      href: '#/active',
    },
    {
      value: 'completed',
      label: 'Completed',
      href: '#/completed',
    },
  ];

  const dataCyMap: Record<Filter, string> = {
    all: 'FilterLinkAll',
    active: 'FilterLinkActive',
    completed: 'FilterLinkCompleted',
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(item => (
          <a
            key={item.value}
            href={item.href}
            data-cy={dataCyMap[item.value]}
            className={classNames('filter__link', {
              selected: filter === item.value,
            })}
            onClick={event => {
              event.preventDefault();
              setFilter(item.value);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
