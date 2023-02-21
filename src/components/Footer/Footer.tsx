import React from 'react';

import classNames from 'classnames';

import { FilterField } from '../../types/FilterField';

type Props = {
  filterBy: FilterField,
  isActiveCount: number,
  hascompletedTodo: number,
  onSetFilterByField: (field: FilterField) => void,
};

export const Footer: React.FC<Props> = ({
  filterBy,
  isActiveCount,
  hascompletedTodo,
  onSetFilterByField,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${isActiveCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === FilterField.ALL,
          })}
          onClick={() => onSetFilterByField(FilterField.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === FilterField.ACTIVE,
          })}
          onClick={() => onSetFilterByField(FilterField.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === FilterField.COMPLETED,
          })}
          onClick={() => onSetFilterByField(FilterField.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={hascompletedTodo === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
