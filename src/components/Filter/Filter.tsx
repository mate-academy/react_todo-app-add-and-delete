import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../TododsContext/TodosContext';
import { FilterOption } from '../../types/FilterOption';

export const Filter: React.FC = () => {
  const { filterOption, setFilterOption } = useContext(TodosContext);

  const handleClickAll = () => {
    setFilterOption(FilterOption.All);
  };

  const handleClickActive = () => {
    setFilterOption(FilterOption.Active);
  };

  const handleClickCompleted = () => {
    setFilterOption(FilterOption.Completed);
  };

  return (
    // {/* Active filter should have a 'selected' class */}
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterOption === FilterOption.All,
        })}
        data-cy="FilterLinkAll"
        onClick={handleClickAll}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterOption === FilterOption.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={handleClickActive}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterOption === FilterOption.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={handleClickCompleted}
      >
        Completed
      </a>
    </nav>
  );
};
