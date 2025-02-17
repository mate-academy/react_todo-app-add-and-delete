import classNames from 'classnames';
import React, { useContext } from 'react';
import { Filter } from '../types/Filter';
import { TodosContext } from './TodosContext';

export const TodosFilter: React.FC = () => {
  const { filter, setFilter } = useContext(TodosContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={classNames('filter__link', {
          selected: filter === Filter.ALL,
        })}
        onClick={() => {
          setFilter(Filter.ALL);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === Filter.ACTIVE,
        })}
        onClick={() => {
          setFilter(Filter.ACTIVE);
        }}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === Filter.COMPLETED,
        })}
        onClick={() => {
          setFilter(Filter.COMPLETED);
        }}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
