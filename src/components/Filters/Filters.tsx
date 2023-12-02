import React from 'react';
import classNames from 'classnames';
import { useAppState } from '../AppState/AppState';
import { StatusFilter } from '../../types/Todo';
import { filterTodos } from '../function/filterTodos';

export const Filters: React.FC = () => {
  const {
    filter,
    setFilter,
    todos,
    setTodosFilter,
  } = useAppState();

  const handleFilterClick = (selectedFilter: StatusFilter) => {
    const filteredTodos = filterTodos(todos, selectedFilter);

    setFilter(selectedFilter);

    setTodosFilter(filteredTodos);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          {
            selected: filter === StatusFilter.All,
          },
        )}
        data-cy="FilterLinkAll"
        onClick={() => handleFilterClick(StatusFilter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          {
            selected: filter === StatusFilter.Active,
          },
        )}
        data-cy="FilterLinkActive"
        onClick={() => {
          handleFilterClick(StatusFilter.Active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          {
            selected: filter === StatusFilter.Completed,
          },
        )}
        data-cy="FilterLinkCompleted"
        onClick={() => handleFilterClick(StatusFilter.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
