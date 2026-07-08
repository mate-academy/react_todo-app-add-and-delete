import classNames from 'classnames';
import React from 'react';
import { Filter } from '../../types/Filter';

type FilterOption = {
  href: string;
  title: string;
  value: Filter;
  dataCy: string;
};

type Props = {
  activeTodosCount: number;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  hasCompletedTodos: boolean;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filter,
  setFilter,
  hasCompletedTodos,
  handleClearCompleted,
}) => {
  const filterOptions: FilterOption[] = [
    {
      href: '#/',
      title: 'All',
      value: 'all',
      dataCy: 'FilterLinkAll',
    },
    {
      href: '#/active',
      title: 'Active',
      value: 'active',
      dataCy: 'FilterLinkActive',
    },
    {
      href: '#/completed',
      title: 'Completed',
      value: 'completed',
      dataCy: 'FilterLinkCompleted',
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterOptions.map(option => {
          return (
            <a
              key={option.value}
              href={option.href}
              className={classNames('filter__link', {
                selected: filter === option.value,
              })}
              data-cy={option.dataCy}
              onClick={() => setFilter(option.value)}
            >
              {option.title}
            </a>
          );
        })}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
