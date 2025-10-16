import React from 'react';
import classNames from 'classnames';

import { FilterType } from '../types/FilterType';

type Props = {
  filterStatus: FilterType;
  setFilterStatus: (filterType: FilterType) => void;
  todosLeft: number;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
  todosLeft,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filter => (
          <a
            key={filter}
            href={`#/${
              filter === FilterType.All ? '' : filter.toLocaleLowerCase()
            }`}
            className={classNames('filter__link', {
              selected: filterStatus === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setFilterStatus(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
