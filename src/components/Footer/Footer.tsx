import React from 'react';
import classNames from 'classnames';

import { FilterByType } from '../../types/FilterBy';
import { FilterBy } from '../../utils/Enums/FilterBy';

interface Props {
  filterBy: FilterByType;
  handleFilterButtonClick: (filterBy: FilterBy) => void;
  handleClear: () => void;
  isSomeTodoCompleted: boolean;
  counter: number;
}

export const Footer: React.FC<Props> = ({
  filterBy,
  handleFilterButtonClick,
  handleClear,
  isSomeTodoCompleted,
  counter,
}) => {
  return (
    <div>
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${counter} items left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={classNames({
              filter__link: filterBy !== FilterBy.ALL,
              'filter__link selected': filterBy === FilterBy.ALL,
            })}
            onClick={() => handleFilterButtonClick(FilterBy.ALL)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames({
              filter__link: filterBy !== FilterBy.ACTIVE,
              'filter__link selected': filterBy === FilterBy.ACTIVE,
            })}
            onClick={() => handleFilterButtonClick(FilterBy.ACTIVE)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames({
              filter__link: filterBy !== FilterBy.COMPLETED,
              'filter__link selected': filterBy === FilterBy.COMPLETED,
            })}
            onClick={() => handleFilterButtonClick(FilterBy.COMPLETED)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className={classNames('todoapp__clear-completed',
            { hidden: !isSomeTodoCompleted })}
          onClick={handleClear}
        >
          Clear completed
        </button>
      </footer>
    </div>
  );
};
