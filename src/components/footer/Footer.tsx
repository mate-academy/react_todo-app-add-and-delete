import classNames from 'classnames';
import React from 'react';
import { Filtering } from '../../types/Filtering';

interface Props {
  filterType: Filtering;
  handleClick: (arg: Filtering) => void;
  itemLeft: string;
}

export const Footer: React.FC<Props> = ({
  filterType,
  handleClick,
  itemLeft,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemLeft}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: filterType === Filtering.ALL,
          })}
          onClick={() => handleClick(Filtering.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === Filtering.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleClick(Filtering.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === Filtering.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleClick(Filtering.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
