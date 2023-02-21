import React from 'react';
import classNames from 'classnames';
import { FilterByStatus } from '../../types/FilterByStatus';

type Props = {
  activeTodosLength: number;
  completedTodosLength: number;
  filteredByStatus: FilterByStatus;
  setFilteredByStatus: (newFilter: FilterByStatus) => void;
  onClearCompleted: () => void;
};

const filteredItems = Object.values(FilterByStatus);

export const Footer: React.FC<Props> = React.memo(
  ({
    activeTodosLength,
    completedTodosLength,
    filteredByStatus,
    setFilteredByStatus,
    onClearCompleted,
  }) => {
    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodosLength} items left`}
        </span>

        <nav className="filter">
          {filteredItems.map((item) => (
            <a
              key={item}
              href={`#/${item}`}
              className={classNames('filter__link', {
                selected: item === filteredByStatus,
              })}
              onClick={() => setFilteredByStatus(item)}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={classNames('todoapp__clear-completed', {
            hidden: completedTodosLength === 0,
          })}
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
