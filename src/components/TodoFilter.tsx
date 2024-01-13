import { useState } from 'react';
import classNames from 'classnames';
import { FilterOptions } from '../types/FilterOptions';

type Props = {
  changeFilter: React.Dispatch<React.SetStateAction<FilterOptions>>
};

export const TodoFilter: React.FC<Props> = ({ changeFilter }) => {
  const [filter, setFilter] = useState(FilterOptions.All);
  const handelFilterChange = (field: FilterOptions) => {
    setFilter(field);
    changeFilter(field);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          'filter__link selected': filter === FilterOptions.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => handelFilterChange(FilterOptions.All)}
      >
        {FilterOptions.All}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          'filter__link selected': filter === FilterOptions.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => handelFilterChange(FilterOptions.Active)}
      >
        {FilterOptions.Active}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          'filter__link selected': filter === FilterOptions.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => handelFilterChange(FilterOptions.Completed)}
      >
        {FilterOptions.Completed}
      </a>
    </nav>
  );
};
