import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  activeTodosAmount: number;
  completedTodosAmount: number;
  filterByStatus: FilterStatus;
  setFilterByStatus: (newFilter: FilterStatus) => void;
  onClearCompleted: () => void;
};

const filterOptions = Object.values(FilterStatus);

export const Footer: React.FC<Props> = React.memo(({
  activeTodosAmount,
  completedTodosAmount,
  filterByStatus,
  setFilterByStatus,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${activeTodosAmount} items left`}</span>

      <nav className="filter">
        {filterOptions.map((option) => (
          <a
            key={option}
            href={`#/${option}`}
            className={classNames('filter__link', {
              selected: option === filterByStatus,
            })}
            onClick={() => setFilterByStatus(option)}
          >
            {option[0].toUpperCase() + option.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: !completedTodosAmount,
        })}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
