import React, { useContext } from 'react';
import classNames from 'classnames';

import './TodosFilter.scss';
import { Status } from '../../types/Status';
import { TodosContext } from '../TodosContext';

export const TodosFilter: React.FC = () => {
  const { currentFilter, setCurrentFilter } = useContext(TodosContext);

  const onFilterSelect = (status: Status) => () => {
    setCurrentFilter(status);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: currentFilter === Status.All,
        })}
        data-cy="FilterLinkAll"
        onClick={onFilterSelect(Status.All)}
      >
        {Status.All}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: currentFilter === Status.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={onFilterSelect(Status.Active)}
      >
        {Status.Active}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: currentFilter === Status.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={onFilterSelect(Status.Completed)}
      >
        {Status.Completed}
      </a>
    </nav>
  );
};
