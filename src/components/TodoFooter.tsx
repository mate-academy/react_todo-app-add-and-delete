import React from 'react';
import classNames from 'classnames';
import { FilterBy } from '../types/FilterBy';

type Props = {
  activeTodosCount: number;
  completedTodosCount: number;
  filterBy: FilterBy;
  setFilterBy: (filterBy: FilterBy) => void;
  handleClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  filterBy,
  setFilterBy,
  handleClearCompleted,
}) => {
  const filters = [
    {
      title: 'All',
      href: '#/',
      dataCy: 'FilterLinkAll',
      value: FilterBy.All,
    },

    {
      title: 'Active',
      href: '#/active',
      dataCy: 'FilterLinkActive',
      value: FilterBy.Active,
    },

    {
      title: 'Completed',
      href: '#/completed',
      dataCy: 'FilterLinkCompleted',
      value: FilterBy.Completed,
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter.value}
            href={filter.href}
            className={classNames('filter__link', {
              selected: filterBy === filter.value,
            })}
            data-cy={filter.dataCy}
            onClick={e => {
              e.preventDefault();
              setFilterBy(filter.value);
            }}
          >
            {filter.title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
