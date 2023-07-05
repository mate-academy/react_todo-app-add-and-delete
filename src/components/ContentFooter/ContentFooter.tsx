/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../../helper';

interface Props {
  activeTodosQuantity: number;
  filterStatuses: string[];
  filter: string;
  handleFilterChange: (arg: FilterStatus) => void
}

export const ContentFooter: React.FC<Props> = ({
  activeTodosQuantity,
  filterStatuses,
  filter,
  handleFilterChange,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosQuantity} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        {filterStatuses.map((status) => (
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filter === status,
            })}
            onClick={() => handleFilterChange(status as FilterStatus)}
          >
            {`${status.slice(0, 1).toUpperCase()}${status.slice(1)}`}
          </a>
        ))}
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button type="button" className="todoapp__clear-completed">
        Clear completed
      </button>
    </footer>
  );
};
