import classNames from 'classnames';
import React, { useContext } from 'react';
import { TodosContext } from '../../TodoProvider';
import { Filter } from '../../types/Filter';

export const TodoFilter: React.FC = () => {
  const { filterType, setFilterType } = useContext(TodosContext);

  return (
    <nav className="filter">
      <a
        href="#/"
        onClick={() => setFilterType(Filter.ALL)}
        className={classNames('filter__link', {
          selected: filterType === Filter.ALL,
        })}
      >
        All
      </a>

      <a
        href="#/active"
        onClick={() => setFilterType(Filter.ACTIVE)}
        className={classNames('filter__link', {
          selected: filterType === Filter.ACTIVE,
        })}
      >
        Active
      </a>

      <a
        href="#/completed"
        onClick={() => setFilterType(Filter.COMPLETED)}
        className={classNames('filter__link', {
          selected: filterType === Filter.COMPLETED,
        })}
      >
        Completed
      </a>
    </nav>
  );
};
