import { useState } from 'react';
import classNames from 'classnames';
import { FilterOptions } from '../types/FilterOptions';

type Props = {
  changeFilter: React.Dispatch<React.SetStateAction<FilterOptions>>
};

export const TodoFilter: React.FC<Props> = ({ changeFilter }) => {
  const [filter, setFilter] = useState(FilterOptions.All);
  const handleChangeFilter = (field: FilterOptions) => {
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
        onClick={() => handleChangeFilter(FilterOptions.All)}
      >
        {FilterOptions.All}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          'filter__link selected': filter === FilterOptions.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => handleChangeFilter(FilterOptions.Active)}
      >
        {FilterOptions.Active}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          'filter__link selected': filter === FilterOptions.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => handleChangeFilter(FilterOptions.Completed)}
      >
        {FilterOptions.Completed}
      </a>
    </nav>
  );
};
