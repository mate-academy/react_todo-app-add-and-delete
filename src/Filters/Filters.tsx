import classNames from 'classnames';
import React, { useContext } from 'react';
import { TodosContext } from '../contexts/TodosContext';
import { TodosFilterQuery } from '../constants';

export const Filters: React.FC = () => {
  const { query, setQuery } = useContext(TodosContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: query === TodosFilterQuery.all },
        )}
        data-cy="FilterLinkAll"
        onClick={() => setQuery(TodosFilterQuery.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: query === TodosFilterQuery.active },
        )}
        data-cy="FilterLinkActive"
        onClick={() => setQuery(TodosFilterQuery.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: query === TodosFilterQuery.completed },
        )}
        data-cy="FilterLinkCompleted"
        onClick={() => setQuery(TodosFilterQuery.completed)}
      >
        Completed
      </a>
    </nav>
  );
};
