import React from 'react';
import { FilterType } from '../../types/Filter';

type Props = {
  setFilter: (filterType: FilterType) => void;
  itemsLeft: number;
  deleteAllCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  setFilter,
  itemsLeft,
  deleteAllCompleted,
}) => {
  const handleFilterChange = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const name = event.currentTarget.dataset.name as FilterType;

    setFilter(name);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className="filter__link selected"
          data-cy="FilterLinkAll"
          data-name={FilterType.ALL}
          onClick={handleFilterChange}
        >
          All
        </a>

        <a
          href="#/active"
          className="filter__link"
          data-cy="FilterLinkActive"
          data-name={FilterType.ACTIVE}
          onClick={handleFilterChange}
        >
          Active
        </a>

        <a
          href="#/completed"
          className="filter__link"
          data-cy="FilterLinkCompleted"
          data-name={FilterType.COMPLETED}
          onClick={handleFilterChange}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
