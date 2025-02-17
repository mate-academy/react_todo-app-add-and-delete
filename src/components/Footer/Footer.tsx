import React from 'react';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';

type Props = {
  unCompletedTodos: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  length: number;
  onCompleteDelete: () => void;
};

export const Footer: React.FC<Props> = ({
  unCompletedTodos,
  filter,
  setFilter,
  length,
  onCompleteDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${unCompletedTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={length === unCompletedTodos}
        onClick={onCompleteDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
